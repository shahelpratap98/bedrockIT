# BedRock CRM

A lead tracker at **https://www.bedrock-it.co.nz/portal** that fills itself from
the **info@bedrock-it.co.nz** mailbox.

- **Website form enquiries** become leads automatically, with the ad, campaign
  and landing page they came from.
- **Replies you send** from info@ move a lead from New to Contacted.
- **Other new senders** wait in **Inbox** until you make them a lead or ignore
  them.
- **Newsletters and system mail** are skipped.
- **Reports** show leads, quotes and wins by source, so you can see which ads
  bring in paying work.

## How it fits together

| Piece | Where |
| --- | --- |
| Portal (React, its own page, no ad or analytics tags) | `portal.html`, `src/portal/` |
| Database, permissions, all lead logic | `supabase/migrations/20261011000100_crm.sql` |
| Mailbox sync (Microsoft Graph) | `api/_lib/crm.ts`, `api/crm/notify.ts`, `api/crm/sync.ts` |
| Ad and page source on enquiries | `src/config/attribution.ts`, `api/contact.ts` |
| Tests | `npm run test:crm` |

**How mail arrives:**

1. When mail lands in info@, Microsoft calls `/api/crm/notify` within seconds.
2. That runs the sync, which reads new mail from Inbox and Sent Items.
3. The sync hands each message to `crm_ingest()` in the database.
4. A daily cron (`vercel.json`, 18:00 UTC) catches anything missed and renews
   the Microsoft subscription, which lapses after about three days.

The website form tags each enquiry email with an `X-BedRock-Lead` header
carrying the form fields. The CRM reads that rather than parsing the email body.

## Setting it up

You need to do these steps once, because they need your logins.

### 1. Supabase project

The BedRock Supabase account already has two free projects (Stable Structure and
the shuttle app), which is the free-tier limit. Choose one:

- **Upgrade the BedRock organisation to Pro** (US$25/month). This allows more
  projects and adds daily backups. It is the sensible choice once client data
  lives here.
- **Create a second free organisation** under another email address. It is free,
  but there are no backups, and it pauses after 7 days without use.

Then:

1. **Create the project.** Name it `bedrock-crm`, region **Sydney
   (ap-southeast-2)**.
2. **Run the migration.** In the SQL Editor, paste all of
   `supabase/migrations/20261011000100_crm.sql` and run it.
3. **Set up authentication.** Under Authentication → Sign In / Providers, turn
   **off "Allow new users to sign up"**. Under URL Configuration:
   - Site URL: `https://www.bedrock-it.co.nz/portal/`
   - Redirect URL: `https://www.bedrock-it.co.nz/portal/**`
4. **Create your login.** Under Authentication → Users → Add user, enter your
   email and a strong password, and tick auto-confirm. A profile row is created
   for you automatically.
5. **Copy three values** from Project Settings → API:
   - the Project URL
   - the **publishable** key
   - the **secret** (service role) key

### 2. Microsoft app for reading the mailbox

This needs a Microsoft 365 **Global Administrator**.

1. **Register the app.** Go to https://entra.microsoft.com → Applications → App
   registrations → **New registration**. Name it `BedRock CRM mail sync`, choose
   single tenant, and leave the redirect URI blank.
2. **Copy two IDs:** the **Application (client) ID** and the **Directory
   (tenant) ID**.
3. **Create a secret.** Under Certificates & secrets → **New client secret**,
   choose 24 months and copy the **Value** straight away; it is shown once. Put
   its expiry date in your calendar.
4. **Give it access to info@ only.** Do **not** add a Microsoft Graph `Mail.Read`
   permission under API permissions; that would let the app read *every* mailbox
   in the organisation. Instead, grant the permission scoped to info@ with
   Exchange Online "RBAC for Applications".

   In PowerShell, as the admin:

   ```powershell
   Install-Module ExchangeOnlineManagement   # once
   Connect-ExchangeOnline

   # The Object ID is under Entra → Enterprise applications → BedRock CRM mail
   # sync → Overview. It is NOT the ID on the App registrations page.
   New-ServicePrincipal -AppId <Application (client) ID> -ObjectId <Enterprise app Object ID> -DisplayName "BedRock CRM mail sync"

   New-ManagementScope -Name "CRM mailbox only" -RecipientRestrictionFilter "PrimarySmtpAddress -eq 'info@bedrock-it.co.nz'"

   New-ManagementRoleAssignment -App <Application (client) ID> -Role "Application Mail.Read" -CustomResourceScope "CRM mailbox only"

   # Should say InScope: True for info@, and False for any other mailbox:
   Test-ServicePrincipalAuthorization -Identity <Application (client) ID> -Resource info@bedrock-it.co.nz
   ```

   Microsoft's guide is "Role Based Access Control for Applications in Exchange
   Online". Permission changes can take up to an hour to apply.

### 3. Vercel environment variables

Set these under Project → Settings → Environment Variables, for **Production**:

| Name | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `SUPABASE_URL` | Supabase Project URL (same again, for the server side) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase secret key. **Server only, never in a `VITE_` variable** |
| `MS_TENANT_ID` | Directory (tenant) ID |
| `MS_CLIENT_ID` | Application (client) ID |
| `MS_CLIENT_SECRET` | the client secret value |
| `CRM_MAILBOX` | `info@bedrock-it.co.nz` |
| `GRAPH_CLIENT_STATE` | any long random string, e.g. from a password generator |
| `CRON_SECRET` | another long random string |

Then redeploy.

### 4. First run

1. Open https://www.bedrock-it.co.nz/portal and sign in.
2. Go to **Settings → Sync now**. The first run reads the last 90 days of
   Inbox and Sent Items and turns on instant updates.
3. Check **Inbox** for people to make into leads, and **Leads** for website form
   enquiries.

To confirm the setup is complete without signing in, open
`/api/crm/sync?check=1`. It lists any missing settings by name, never their
values.

## Day to day

- **Leads** opens on everything still open, with overdue follow-ups first. Click
  a lead to change its stage, set the price and monthly fee, add notes or log a
  call, and read every email with that person.
- **Moving a lead to Quoted or Won** records the date automatically. Reports use
  those dates.
- **Inbox:** use *Make lead* for a real enquiry, or *Ignore sender* for anyone
  you never want to see again, such as suppliers or sales pitches.
- **Add lead** is for phone calls and referrals that never came by email.

## Security notes

- The portal page carries **no Google tag and no Meta pixel**, and is served with
  its own strict Content Security Policy, `noindex`, and `no-referrer`.
- Every table has row-level security. Only signed-in, active profiles can read
  or change anything. The anonymous key can read nothing.
- `crm_ingest()` can only be called with the secret key, which lives only in
  Vercel's server environment.
- Graph notifications are only acted on when they carry the `GRAPH_CLIENT_STATE`
  secret. Even then they only trigger a sync, which reads the mailbox itself.
- To remove someone's access, set `is_active = false` on their row in
  `profiles`, or delete their user in Supabase.
