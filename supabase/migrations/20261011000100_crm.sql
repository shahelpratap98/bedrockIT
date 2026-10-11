-- BedRock CRM: leads pulled from the info@ mailbox.
--
-- Mail arrives through api/crm (Microsoft Graph). Each message is handed to
-- crm_ingest() as structured JSON, and every decision about contacts, leads
-- and triage happens here, in one transaction, so a retried notification can
-- never create a duplicate.
--
-- Everything is readable and writable by signed-in, active BedRock staff
-- (profiles.is_active) and by nobody else. The mail sync runs with the
-- service role key, which bypasses row-level security.

create schema if not exists app;

-- ---------------------------------------------------------------------------
-- People who can sign in
-- ---------------------------------------------------------------------------

create table public.profiles (
  user_id       uuid primary key references auth.users (id) on delete cascade,
  display_name  text not null check (length(btrim(display_name)) > 0),
  email         text not null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

create or replace function app.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (user_id, display_name, email)
  values (
    new.id,
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (user_id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function app.handle_new_user();

create or replace function app.is_member()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.profiles where user_id = auth.uid() and is_active)
$$;

-- ---------------------------------------------------------------------------
-- Contacts, leads, mail, notes
-- ---------------------------------------------------------------------------

create type public.lead_stage as enum ('new', 'contacted', 'quoted', 'won', 'lost');

create table public.contacts (
  id                uuid primary key default gen_random_uuid(),
  email             text not null unique check (email = lower(btrim(email)) and email like '%@%'),
  name              text,
  phone             text,
  company           text,
  -- triage: emailed us, not yet a lead. active: has or had a lead.
  -- ignored: never create anything for this sender again.
  status            text not null default 'triage' check (status in ('triage', 'active', 'ignored')),
  notes             text not null default '',
  first_seen_at     timestamptz not null default now(),
  last_inbound_at   timestamptz,
  last_outbound_at  timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table public.leads (
  id              uuid primary key default gen_random_uuid(),
  contact_id      uuid not null references public.contacts (id) on delete cascade,
  title           text not null check (length(btrim(title)) > 0),
  service         text,
  source          text not null default 'email'
                  check (source in ('website_form', 'google_ads', 'meta', 'email', 'phone', 'referral', 'other')),
  stage           public.lead_stage not null default 'new',
  value           numeric(12,2) check (value >= 0),          -- one-off build price
  monthly_value   numeric(12,2) check (monthly_value >= 0),  -- hosting/support per month
  next_action     text,
  next_action_on  date,
  lost_reason     text,
  quoted_on       date,
  won_on          date,
  closed_at       timestamptz,
  -- where the enquiry came from, as recorded by the website form
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  utm_term        text,
  gclid           text,
  fbclid          text,
  landing_page    text,
  referrer        text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index leads_contact_idx on public.leads (contact_id);
create index leads_stage_idx on public.leads (stage);

create table public.messages (
  id                   uuid primary key default gen_random_uuid(),
  graph_id             text not null unique,
  internet_message_id  text,
  conversation_id      text,
  contact_id           uuid references public.contacts (id) on delete cascade,
  lead_id              uuid references public.leads (id) on delete set null,
  direction            text not null check (direction in ('in', 'out')),
  from_email           text,
  from_name            text,
  to_emails            text[] not null default '{}',
  subject              text not null default '',
  preview              text not null default '',
  body_text            text not null default '',
  received_at          timestamptz not null,
  has_attachments      boolean not null default false,
  is_form              boolean not null default false,
  created_at           timestamptz not null default now()
);
create index messages_contact_idx on public.messages (contact_id, received_at desc);
create index messages_lead_idx on public.messages (lead_id);

create table public.activities (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references public.leads (id) on delete cascade,
  kind        text not null check (kind in ('note', 'call', 'stage', 'email', 'system')),
  body        text not null check (length(btrim(body)) > 0),
  created_by  uuid references public.profiles (user_id) on delete set null,
  at          timestamptz not null default now()
);
create index activities_lead_idx on public.activities (lead_id, at desc);

-- One row: where the mailbox sync is up to.
create table public.mail_sync (
  id                    boolean primary key default true check (id),
  mailbox               text,
  inbox_delta           text,
  sent_delta            text,
  subscription_id       text,
  subscription_expires  timestamptz,
  last_run_at           timestamptz,
  last_ok_at            timestamptz,
  last_error            text,
  messages_seen         integer not null default 0
);
insert into public.mail_sync (id) values (true);

-- ---------------------------------------------------------------------------
-- Bookkeeping triggers
-- ---------------------------------------------------------------------------

create or replace function app.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger touch before update on public.contacts for each row execute function app.touch_updated_at();
create trigger touch before update on public.leads    for each row execute function app.touch_updated_at();

-- Stage dates fill themselves in, and every stage change is logged.
create or replace function app.lead_stage_changed()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if new.stage is distinct from old.stage then
    if new.stage = 'quoted' and new.quoted_on is null then new.quoted_on := current_date; end if;
    if new.stage = 'won' and new.won_on is null then new.won_on := current_date; end if;
    if new.stage in ('won', 'lost') then new.closed_at := coalesce(new.closed_at, now());
    else new.closed_at := null; end if;
    -- crm_ingest sets app.event_at to the email's own time, so a stage
    -- change caused by a backfilled reply is dated when it really happened.
    insert into public.activities (lead_id, kind, body, created_by, at)
    values (new.id, 'stage', 'Moved from ' || old.stage || ' to ' || new.stage, auth.uid(),
            coalesce(nullif(current_setting('app.event_at', true), '')::timestamptz, now()));
  end if;
  return new;
end $$;

create trigger stage_changed before update of stage on public.leads
  for each row execute function app.lead_stage_changed();

-- ---------------------------------------------------------------------------
-- Ingest one email. Called by the mail sync with the service role.
--
-- p: { graph_id, direction ('in'|'out'), from_email, from_name, to_emails[],
--      subject, preview, body_text, received_at, conversation_id,
--      internet_message_id, has_attachments, automated (bool),
--      form: null | { name, company, email, phone, service, message,
--                     utm_source, utm_medium, utm_campaign, utm_term,
--                     gclid, fbclid, landing_page, referrer } }
-- Returns what it did, for the sync log.
-- ---------------------------------------------------------------------------

create or replace function public.crm_ingest(p jsonb, p_own_domain text default 'bedrock-it.co.nz')
returns text
language plpgsql security definer set search_path = ''
as $$
declare
  v_dir      text := p ->> 'direction';
  v_form     jsonb := nullif(p -> 'form', 'null'::jsonb);
  v_at       timestamptz := (p ->> 'received_at')::timestamptz;
  v_email    text;
  v_contact  public.contacts%rowtype;
  v_lead     uuid;
  v_source   text;
  v_outcome  text;
begin
  if exists (select 1 from public.messages where graph_id = p ->> 'graph_id') then
    return 'duplicate';
  end if;

  -- Who is the other party?
  if v_form is not null then
    v_email := lower(btrim(v_form ->> 'email'));
  elsif v_dir = 'in' then
    v_email := lower(btrim(p ->> 'from_email'));
  else
    select lower(btrim(e)) into v_email
    from jsonb_array_elements_text(coalesce(p -> 'to_emails', '[]'::jsonb)) as e
    where lower(e) not like '%@' || p_own_domain
    limit 1;
  end if;

  if v_email is null or v_email not like '%@%' or v_email like '%@' || p_own_domain then
    return 'skipped: internal or no address';
  end if;

  select * into v_contact from public.contacts where email = v_email;

  if v_contact.id is null then
    -- Newsletters, receipts and notifications never become contacts.
    if v_form is null and coalesce((p ->> 'automated')::boolean, false) then
      return 'skipped: automated';
    end if;
    -- Something we sent to someone who never wrote to us: not a lead.
    if v_dir = 'out' then
      return 'skipped: outbound to unknown';
    end if;
    insert into public.contacts (email, name, phone, company, status, first_seen_at)
    values (
      v_email,
      nullif(btrim(coalesce(v_form ->> 'name', p ->> 'from_name')), ''),
      nullif(btrim(v_form ->> 'phone'), ''),
      nullif(btrim(v_form ->> 'company'), ''),
      case when v_form is not null then 'active' else 'triage' end,
      v_at
    )
    returning * into v_contact;
  elsif v_contact.status = 'ignored' then
    return 'skipped: ignored sender';
  else
    -- Fill gaps; never overwrite what someone typed in by hand.
    update public.contacts set
      name    = coalesce(name,    nullif(btrim(coalesce(v_form ->> 'name', p ->> 'from_name')), '')),
      phone   = coalesce(phone,   nullif(btrim(v_form ->> 'phone'), '')),
      company = coalesce(company, nullif(btrim(v_form ->> 'company'), ''))
    where id = v_contact.id
    returning * into v_contact;
  end if;

  -- The lead this message belongs to: the most recent open one.
  select id into v_lead from public.leads
  where contact_id = v_contact.id and stage in ('new', 'contacted', 'quoted')
  order by created_at desc limit 1;

  if v_form is not null then
    v_source := case
      when nullif(v_form ->> 'gclid', '') is not null
        or (lower(coalesce(v_form ->> 'utm_source', '')) = 'google' and lower(coalesce(v_form ->> 'utm_medium', '')) in ('cpc', 'ppc', 'paid'))
        then 'google_ads'
      when nullif(v_form ->> 'fbclid', '') is not null
        or lower(coalesce(v_form ->> 'utm_source', '')) in ('facebook', 'fb', 'instagram', 'ig', 'meta')
        then 'meta'
      else 'website_form'
    end;

    if v_lead is null then
      insert into public.leads (contact_id, title, service, source, utm_source, utm_medium, utm_campaign,
                                utm_term, gclid, fbclid, landing_page, referrer, created_at)
      values (
        v_contact.id,
        coalesce(nullif(btrim(v_form ->> 'service'), ''), 'Website enquiry'),
        nullif(btrim(v_form ->> 'service'), ''),
        v_source,
        nullif(v_form ->> 'utm_source', ''), nullif(v_form ->> 'utm_medium', ''),
        nullif(v_form ->> 'utm_campaign', ''), nullif(v_form ->> 'utm_term', ''),
        nullif(v_form ->> 'gclid', ''), nullif(v_form ->> 'fbclid', ''),
        nullif(v_form ->> 'landing_page', ''), nullif(v_form ->> 'referrer', ''),
        v_at
      )
      returning id into v_lead;
      insert into public.activities (lead_id, kind, body, at)
      values (v_lead, 'system', 'Enquiry through the website form', v_at);
      v_outcome := 'new lead from form';
    else
      insert into public.activities (lead_id, kind, body, at)
      values (v_lead, 'system', 'Sent another enquiry through the website form', v_at);
      v_outcome := 'form enquiry added to open lead';
    end if;

    update public.contacts set status = 'active' where id = v_contact.id and status <> 'active';
  elsif v_dir = 'out' then
    -- Replying to a new lead means it has been contacted.
    if v_lead is not null then
      perform set_config('app.event_at', v_at::text, true);
      update public.leads set stage = 'contacted' where id = v_lead and stage = 'new';
      perform set_config('app.event_at', '', true);
    end if;
    v_outcome := 'sent';
  else
    v_outcome := case when v_lead is not null then 'email on open lead'
                      when v_contact.status = 'triage' then 'triage'
                      else 'email from known contact' end;
  end if;

  insert into public.messages (graph_id, internet_message_id, conversation_id, contact_id, lead_id, direction,
                               from_email, from_name, to_emails, subject, preview, body_text, received_at,
                               has_attachments, is_form)
  values (
    p ->> 'graph_id', p ->> 'internet_message_id', p ->> 'conversation_id', v_contact.id, v_lead, v_dir,
    lower(p ->> 'from_email'), p ->> 'from_name',
    coalesce(array(select lower(e) from jsonb_array_elements_text(coalesce(p -> 'to_emails', '[]'::jsonb)) e), '{}'),
    coalesce(p ->> 'subject', ''), left(coalesce(p ->> 'preview', ''), 300), left(coalesce(p ->> 'body_text', ''), 20000),
    v_at, coalesce((p ->> 'has_attachments')::boolean, false), v_form is not null
  );

  if v_dir = 'in' then
    update public.contacts set last_inbound_at = greatest(coalesce(last_inbound_at, v_at), v_at) where id = v_contact.id;
  else
    update public.contacts set last_outbound_at = greatest(coalesce(last_outbound_at, v_at), v_at) where id = v_contact.id;
  end if;

  return v_outcome;
end $$;

revoke all on function public.crm_ingest(jsonb, text) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Actions from the portal
-- ---------------------------------------------------------------------------

-- Turn a triage sender into a lead; their earlier emails move onto it.
create or replace function public.crm_make_lead(p_contact_id uuid, p_title text, p_service text default null,
                                                p_source text default 'email')
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare v_lead uuid; v_first timestamptz;
begin
  if not app.is_member() then raise exception 'Not allowed' using errcode = '42501'; end if;
  select min(received_at) into v_first from public.messages where contact_id = p_contact_id;
  insert into public.leads (contact_id, title, service, source, created_at)
  values (p_contact_id, coalesce(nullif(btrim(p_title), ''), 'Email enquiry'), nullif(btrim(p_service), ''),
          coalesce(p_source, 'email'), coalesce(v_first, now()))
  returning id into v_lead;
  update public.messages set lead_id = v_lead where contact_id = p_contact_id and lead_id is null;
  update public.contacts set status = 'active' where id = p_contact_id;
  insert into public.activities (lead_id, kind, body, created_by)
  values (v_lead, 'system', 'Made into a lead from the inbox', auth.uid());
  return v_lead;
end $$;

-- A lead that did not arrive by email: a phone call, a referral.
create or replace function public.crm_add_lead(p_email text, p_name text, p_title text, p_phone text default null,
                                               p_company text default null, p_service text default null,
                                               p_source text default 'phone', p_value numeric default null)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare v_contact uuid; v_lead uuid; v_email text := lower(btrim(p_email));
begin
  if not app.is_member() then raise exception 'Not allowed' using errcode = '42501'; end if;
  if v_email is null or v_email not like '%@%' then raise exception 'An email address is needed' using errcode = '22023'; end if;
  insert into public.contacts (email, name, phone, company, status)
  values (v_email, nullif(btrim(p_name), ''), nullif(btrim(p_phone), ''), nullif(btrim(p_company), ''), 'active')
  on conflict (email) do update set
    name = coalesce(public.contacts.name, excluded.name),
    phone = coalesce(public.contacts.phone, excluded.phone),
    company = coalesce(public.contacts.company, excluded.company),
    status = 'active'
  returning id into v_contact;
  insert into public.leads (contact_id, title, service, source, value)
  values (v_contact, coalesce(nullif(btrim(p_title), ''), 'Enquiry'), nullif(btrim(p_service), ''),
          coalesce(p_source, 'phone'), p_value)
  returning id into v_lead;
  update public.messages set lead_id = v_lead where contact_id = v_contact and lead_id is null;
  insert into public.activities (lead_id, kind, body, created_by)
  values (v_lead, 'system', 'Added by hand', auth.uid());
  return v_lead;
end $$;

-- ---------------------------------------------------------------------------
-- Read models
-- ---------------------------------------------------------------------------

create view public.v_leads with (security_invoker = true) as
select
  l.*,
  c.email   as contact_email,
  c.name    as contact_name,
  c.phone   as contact_phone,
  c.company as contact_company,
  m.message_count,
  m.last_message_at,
  m.last_message_subject,
  m.last_message_direction
from public.leads l
join public.contacts c on c.id = l.contact_id
left join lateral (
  select count(*)::int as message_count,
         max(received_at) as last_message_at,
         (array_agg(subject order by received_at desc))[1] as last_message_subject,
         (array_agg(direction order by received_at desc))[1] as last_message_direction
  from public.messages where contact_id = c.id
) m on true;

create view public.v_triage with (security_invoker = true) as
select
  c.id, c.email, c.name, c.company, c.first_seen_at, c.last_inbound_at,
  m.message_count, m.last_subject, m.last_preview
from public.contacts c
join lateral (
  select count(*)::int as message_count,
         (array_agg(subject order by received_at desc))[1] as last_subject,
         (array_agg(preview order by received_at desc))[1] as last_preview
  from public.messages where contact_id = c.id and direction = 'in'
) m on true
where c.status = 'triage';

-- Leads, quotes and wins by where they came from, for a date range of
-- enquiry dates.
create or replace function public.crm_report(p_from date, p_to date)
returns table (source text, leads int, quoted int, won int, lost int, open int,
               won_value numeric, won_monthly numeric, quoted_value numeric)
language sql stable security invoker set search_path = ''
as $$
  select l.source,
         count(*)::int,
         count(*) filter (where l.quoted_on is not null or l.stage in ('quoted', 'won'))::int,
         count(*) filter (where l.stage = 'won')::int,
         count(*) filter (where l.stage = 'lost')::int,
         count(*) filter (where l.stage in ('new', 'contacted', 'quoted'))::int,
         coalesce(sum(l.value) filter (where l.stage = 'won'), 0),
         coalesce(sum(l.monthly_value) filter (where l.stage = 'won'), 0),
         coalesce(sum(l.value) filter (where l.stage = 'quoted'), 0)
  from public.leads l
  where l.created_at >= p_from and l.created_at < p_to + 1
  group by l.source
  order by count(*) desc
$$;

-- ---------------------------------------------------------------------------
-- Row-level security: active BedRock staff only
-- ---------------------------------------------------------------------------

alter table public.profiles   enable row level security;
alter table public.contacts   enable row level security;
alter table public.leads      enable row level security;
alter table public.messages   enable row level security;
alter table public.activities enable row level security;
alter table public.mail_sync  enable row level security;

create policy members_read on public.profiles for select to authenticated using (app.is_member());

create policy members_all on public.contacts   for all to authenticated using (app.is_member()) with check (app.is_member());
create policy members_all on public.leads      for all to authenticated using (app.is_member()) with check (app.is_member());
create policy members_read on public.messages  for select to authenticated using (app.is_member());
create policy members_update on public.messages for update to authenticated using (app.is_member()) with check (app.is_member());
create policy members_read on public.activities for select to authenticated using (app.is_member());
create policy members_add on public.activities for insert to authenticated
  with check (app.is_member() and kind in ('note', 'call') and created_by = auth.uid());
create policy members_remove on public.activities for delete to authenticated
  using (app.is_member() and kind in ('note', 'call') and created_by = auth.uid());
create policy members_read on public.mail_sync for select to authenticated using (app.is_member());

-- Explicit grants: nothing is exposed to anon, and new tables are not
-- auto-exposed.
revoke all on all tables in schema public from anon;
grant select on public.profiles, public.mail_sync, public.messages, public.v_leads, public.v_triage to authenticated;
grant select, insert, update, delete on public.contacts, public.leads to authenticated;
grant update (lead_id) on public.messages to authenticated;
grant select, insert, delete on public.activities to authenticated;
grant usage on schema app to authenticated;
grant execute on function app.is_member() to authenticated;
grant execute on function public.crm_make_lead(uuid, text, text, text) to authenticated;
grant execute on function public.crm_add_lead(text, text, text, text, text, text, text, numeric) to authenticated;
grant execute on function public.crm_report(date, date) to authenticated;

-- The mailbox sync runs as service_role. Granted explicitly so it works with
-- "Automatically expose new tables" switched off in the project settings.
grant usage on schema public, app to service_role;
grant select, insert, update, delete on all tables in schema public to service_role;
grant execute on function public.crm_ingest(jsonb, text) to service_role;
