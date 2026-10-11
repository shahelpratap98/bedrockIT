// Runs the CRM migration in PGlite (Postgres compiled to WASM, in-process) and
// exercises crm_ingest and the portal functions through row-level security,
// with the same roles Supabase uses. No Supabase project or Docker needed.
//
//   npm run test:crm
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";

const db = new PGlite();
await db.exec(`
  create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
  create schema auth;
  create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}');
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant usage on schema auth to authenticated, anon, service_role;
  grant execute on function auth.uid() to authenticated, anon, service_role;
  grant usage on schema public to authenticated, anon, service_role;
`);
for (const f of ["20261011000100_crm.sql", "20261011000200_contact_email_optional.sql"]) {
  await db.exec(readFileSync(fileURLToPath(new URL("../migrations/" + f, import.meta.url)), "utf8"));
}
await db.exec(`grant all on all tables in schema public to service_role; grant usage on schema app to service_role;
               grant execute on all functions in schema public to service_role;`);

let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : fail++; console.log(c ? "  ok  " : "  FAIL", m); };
const q = async (sql, p) => (await db.query(sql, p)).rows;
const SHAHEL = "00000000-0000-4000-8000-0000000000a1", STRANGER = "00000000-0000-4000-8000-0000000000b2";
await db.exec(`insert into auth.users (id, email, raw_user_meta_data) values
  ('${SHAHEL}', 'info@bedrock-it.co.nz', '{"display_name":"Shahel"}'), ('${STRANGER}', 'x@x.test', '{}');
  update public.profiles set is_active = false where user_id = '${STRANGER}';`);

async function as(uid, fn) {
  return db.transaction(async (tx) => {
    await tx.query(`select set_config('request.jwt.claim.sub', $1, true)`, [uid]);
    await tx.exec(`set local role authenticated`);
    return fn((sql, p) => tx.query(sql, p).then((r) => r.rows));
  });
}
async function svc(fn) {
  return db.transaction(async (tx) => { await tx.exec(`set local role service_role`); return fn((sql, p) => tx.query(sql, p).then((r) => r.rows)); });
}
const ingest = (m) => svc((x) => x(`select public.crm_ingest($1::jsonb) as r`, [JSON.stringify(m)])).then((r) => r[0].r);
const msg = (o) => ({ direction: "in", to_emails: ["info@bedrock-it.co.nz"], subject: "", preview: "", body_text: "", received_at: "2026-10-01T09:00:00Z", has_attachments: false, automated: false, form: null, ...o });

console.log("\nform enquiry from Google Ads");
ok(await ingest(msg({ graph_id: "g1", from_email: "website@bedrock-it.co.nz", from_name: "BedRock IT Website", subject: "Website enquiry — Sam (Acme)",
  form: { name: "Sam Lee", company: "Acme Builders", email: "Sam@Acme.test", phone: "021 555 0100", service: "Business systems", message: "Timesheets in Excel",
          utm_source: "google", utm_medium: "cpc", utm_campaign: "systems", gclid: "abc123", landing_page: "/services/business-systems" } })) === "new lead from form", "creates a lead");
let lead = (await q(`select * from public.v_leads`))[0];
ok(lead.contact_email === "sam@acme.test" && lead.contact_name === "Sam Lee" && lead.contact_company === "Acme Builders", "contact from the form, email lower-cased");
ok(lead.source === "google_ads" && lead.gclid === "abc123" && lead.service === "Business systems" && lead.stage === "new", "source google_ads, gclid and service kept");

console.log("\nsame message delivered twice (Graph retries)");
ok(await ingest(msg({ graph_id: "g1", from_email: "website@bedrock-it.co.nz" })) === "duplicate", "second copy ignored");
ok((await q(`select count(*)::int n from public.messages`))[0].n === 1, "one message stored");

console.log("\nthe client emails directly, then we reply");
ok(await ingest(msg({ graph_id: "g2", from_email: "sam@acme.test", from_name: "Sam", subject: "Re: your quote", received_at: "2026-10-02T09:00:00Z" })) === "email on open lead", "attached to the open lead");
ok(await ingest(msg({ graph_id: "g3", direction: "out", from_email: "info@bedrock-it.co.nz", to_emails: ["Sam@acme.test"], subject: "Re: Website enquiry", received_at: "2026-10-02T10:00:00Z" })) === "sent", "our reply recorded");
lead = (await q(`select * from public.v_leads`))[0];
ok(lead.stage === "contacted" && lead.message_count === 3 && lead.last_message_direction === "out", "reply moved New to Contacted");
const st = await q(`select at from public.activities where kind = 'stage'`);
ok(st.length === 1, "stage change logged");
ok(new Date(st[0].at).toISOString() === "2026-10-02T10:00:00.000Z", "dated when the reply was sent, not when it was read");

console.log("\nunknown senders");
ok(await ingest(msg({ graph_id: "g4", from_email: "news@saas.test", automated: true, subject: "Our October update" })) === "skipped: automated", "newsletter skipped");
ok(await ingest(msg({ graph_id: "g5", from_email: "jo@cafe.test", from_name: "Jo Park", subject: "Can you build a booking system?", preview: "We run 3 vans" })) === "triage", "real person goes to triage");
ok(await ingest(msg({ graph_id: "g6", direction: "out", from_email: "info@bedrock-it.co.nz", to_emails: ["supplier@x.test"] })) === "skipped: outbound to unknown", "our email to a stranger is not a lead");
ok(await ingest(msg({ graph_id: "g7", from_email: "staff@bedrock-it.co.nz" })) === "skipped: internal or no address", "internal mail skipped");
ok((await q(`select count(*)::int n from public.v_triage`))[0].n === 1, "triage lists Jo");

console.log("\nportal actions as a signed-in member");
const jo = (await q(`select id from public.contacts where email = 'jo@cafe.test'`))[0].id;
const newLead = await as(SHAHEL, (x) => x(`select public.crm_make_lead($1, 'Booking system', 'Business systems', 'email') as id`, [jo]));
ok(!!newLead[0].id, "triage sender made into a lead");
ok((await q(`select lead_id from public.messages where graph_id = 'g5'`))[0].lead_id === newLead[0].id, "their earlier email moved onto the lead");
await as(SHAHEL, (x) => x(`update public.leads set stage = 'quoted', value = 3500, monthly_value = 75 where id = $1`, [newLead[0].id]));
await as(SHAHEL, (x) => x(`update public.leads set stage = 'won' where id = $1`, [newLead[0].id]));
const won = (await q(`select * from public.leads where id = $1`, [newLead[0].id]))[0];
ok(won.quoted_on && won.won_on && won.closed_at, "quoted_on, won_on and closed_at filled in");
await as(SHAHEL, (x) => x(`insert into public.activities (lead_id, kind, body, created_by) values ($1, 'note', 'Called, keen', $2)`, [newLead[0].id, SHAHEL]));
ok((await q(`select count(*)::int n from public.activities where kind = 'note'`))[0].n === 1, "member adds a note");
const phoneLead = await as(SHAHEL, (x) => x(`select public.crm_add_lead('Pat@Shop.test', 'Pat', 'Website', '021 555 0199', null, 'Website development', 'phone', 450) as id`));
ok(!!phoneLead[0].id, "lead added by hand");
const rep = await as(SHAHEL, (x) => x(`select * from public.crm_report('2026-01-01', '2026-12-31')`));
const bySrc = Object.fromEntries(rep.map((r) => [r.source, r]));
ok(bySrc.email?.won === 1 && Number(bySrc.email.won_value) === 3500 && bySrc.google_ads?.leads === 1 && bySrc.phone?.leads === 1, "report by source: " + rep.map((r) => `${r.source} ${r.leads}/${r.won}`).join(", "));

console.log("\nignore a sender");
await ingest(msg({ graph_id: "g8", from_email: "spam@seo.test", subject: "Rank #1 on Google" }));
const spam = (await q(`select id from public.contacts where email = 'spam@seo.test'`))[0].id;
await as(SHAHEL, (x) => x(`update public.contacts set status = 'ignored' where id = $1`, [spam]));
ok(await ingest(msg({ graph_id: "g9", from_email: "spam@seo.test" })) === "skipped: ignored sender", "ignored sender stays ignored");

console.log("\npermissions");
ok((await as(STRANGER, (x) => x(`select * from public.v_leads`))).length === 0, "inactive account sees no leads");
ok((await as(STRANGER, (x) => x(`select * from public.messages`))).length === 0, "inactive account sees no email");
let blocked = false;
try { await as(STRANGER, (x) => x(`select public.crm_make_lead($1, 'x')`, [jo])); } catch { blocked = true; }
ok(blocked, "inactive account cannot create leads");
blocked = false;
try { await as(SHAHEL, (x) => x(`select public.crm_ingest('{}'::jsonb)`)); } catch { blocked = true; }
ok(blocked, "signed-in users cannot call crm_ingest directly");
blocked = false;
try { await as(SHAHEL, (x) => x(`insert into public.activities (lead_id, kind, body, created_by) values ($1, 'stage', 'fake', $2)`, [newLead[0].id, SHAHEL])); } catch { blocked = true; }
ok(blocked, "members cannot forge system or stage entries");
blocked = false;
try { await db.transaction(async (tx) => { await tx.exec(`set local role anon`); await tx.query(`select * from public.leads`); }); } catch { blocked = true; }
ok(blocked, "anonymous visitors have no access at all");

console.log("\nphone-only contacts");
await db.exec(`insert into public.contacts (name, phone, status) values ('Phone Only', '021 555 0000', 'active')`);
ok((await q(`select count(*)::int n from public.contacts where email is null`))[0].n === 1, "a contact without an email is allowed");
let badEmail = false;
try { await db.exec(`insert into public.contacts (email) values ('Not An Email')`); } catch { badEmail = true; }
ok(badEmail, "a malformed email is still rejected");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
