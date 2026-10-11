-- Money actually received against won work. A job can be paid in parts
-- (deposit, stages), so payments are their own rows rather than a flag.

create table public.payments (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references public.leads (id) on delete cascade,
  amount      numeric(12,2) not null check (amount > 0),
  paid_on     date not null default current_date,
  note        text not null default '',
  created_by  uuid references public.profiles (user_id) on delete set null,
  created_at  timestamptz not null default now()
);
create index payments_lead_idx on public.payments (lead_id);
create index payments_paid_on_idx on public.payments (paid_on);

-- Every payment shows in the lead's history.
create or replace function app.payment_logged()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.activities (lead_id, kind, body, created_by)
    values (new.lead_id, 'system',
            'Payment received: $' || to_char(new.amount, 'FM999,999,990.00') || ' on ' || to_char(new.paid_on, 'DD Mon YYYY')
              || case when btrim(new.note) <> '' then ' (' || btrim(new.note) || ')' else '' end,
            auth.uid());
  else
    insert into public.activities (lead_id, kind, body, created_by)
    values (old.lead_id, 'system', 'Payment of $' || to_char(old.amount, 'FM999,999,990.00') || ' removed', auth.uid());
  end if;
  return null;
end $$;

create trigger payment_logged after insert or delete on public.payments
  for each row execute function app.payment_logged();

alter table public.payments enable row level security;
create policy members_all on public.payments for all to authenticated
  using (app.is_member()) with check (app.is_member());

grant select, insert, delete on public.payments to authenticated;
grant select, insert, update, delete on public.payments to service_role;
