-- Some clients are known by phone only (a WhatsApp contact, a referral).
-- Email stays unique when present, which is what mail matching relies on.

alter table public.contacts alter column email drop not null;
alter table public.contacts drop constraint if exists contacts_email_check;
alter table public.contacts add constraint contacts_email_check
  check (email is null or (email = lower(btrim(email)) and email like '%@%'));
