/**
 * CRM mail sync: reads the info@ mailbox through Microsoft Graph and hands
 * each new email to crm_ingest() in Supabase, which decides what it means.
 *
 * Runs from three places:
 *   - api/crm/notify  when Graph says a message arrived (seconds after it lands)
 *   - api/crm/sync    once a day from Vercel cron, as a catch-up and to keep
 *                     the Graph subscription alive
 *   - api/crm/sync    when someone presses "Sync now" in the portal
 *
 * Every step is idempotent: a message already stored is skipped by its Graph
 * id, so overlapping runs and retried notifications are harmless.
 *
 * Environment (Vercel → Settings → Environment Variables):
 *   MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET   Entra app registration
 *   CRM_MAILBOX              mailbox to read, e.g. info@bedrock-it.co.nz
 *   GRAPH_CLIENT_STATE       random secret Graph echoes back on notifications
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   CRON_SECRET              Vercel sends it on cron requests
 *   CRM_PUBLIC_URL           optional, defaults to https://www.bedrock-it.co.nz
 */

declare const process: { env: Record<string, string | undefined> }

const env = (key: string) => process.env[key] ?? ''

// Overridable for local testing against fakes; never set in production.
const GRAPH = env('GRAPH_BASE') || 'https://graph.microsoft.com/v1.0'
const LOGIN = env('MS_LOGIN_BASE') || 'https://login.microsoftonline.com'

const OWN_DOMAIN = 'bedrock-it.co.nz'
const FORM_SENDER = 'website@bedrock-it.co.nz'
const BACKFILL_DAYS = 90
const TIME_BUDGET_MS = 240_000
// Graph caps mail subscriptions at 4,230 minutes; renew well before that.
const SUBSCRIPTION_MINUTES = 4_200
const RENEW_WITHIN_MS = 30 * 3600_000

export function crmConfigured() {
  const missing = ['MS_TENANT_ID', 'MS_CLIENT_ID', 'MS_CLIENT_SECRET', 'CRM_MAILBOX', 'GRAPH_CLIENT_STATE',
    'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'].filter((key) => !env(key))
  return { ok: missing.length === 0, missing }
}

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
}

// ---------------------------------------------------------------------------
// Supabase (PostgREST with the service role: bypasses row-level security)
// ---------------------------------------------------------------------------

async function db(path: string, init: RequestInit = {}) {
  const key = env('SUPABASE_SERVICE_ROLE_KEY')
  const res = await fetch(`${env('SUPABASE_URL')}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, authorization: `Bearer ${key}`, 'content-type': 'application/json', ...(init.headers ?? {}) },
  })
  if (!res.ok) throw new Error(`Supabase ${init.method ?? 'GET'} ${path.split('?')[0]}: ${res.status} ${await res.text()}`)
  return res.status === 204 ? null : res.json()
}

interface SyncState {
  inbox_delta: string | null
  sent_delta: string | null
  subscription_id: string | null
  subscription_expires: string | null
  messages_seen: number
}

const getState = async () => ((await db('mail_sync?select=*&id=eq.true')) as SyncState[])[0]
const setState = (patch: Record<string, unknown>) =>
  db('mail_sync?id=eq.true', { method: 'PATCH', headers: { prefer: 'return=minimal' }, body: JSON.stringify(patch) })

/** True when the bearer token belongs to an active BedRock staff member. */
export async function isMember(accessToken: string) {
  if (!accessToken) return false
  const res = await fetch(`${env('SUPABASE_URL')}/auth/v1/user`, {
    headers: { apikey: env('SUPABASE_SERVICE_ROLE_KEY'), authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) return false
  const user = (await res.json()) as { id?: string }
  if (!user.id) return false
  const rows = (await db(`profiles?select=is_active&user_id=eq.${encodeURIComponent(user.id)}`)) as { is_active: boolean }[]
  return rows[0]?.is_active === true
}

// ---------------------------------------------------------------------------
// Microsoft Graph
// ---------------------------------------------------------------------------

let cachedToken: { value: string; expires: number } | null = null

async function graphToken() {
  if (cachedToken && cachedToken.expires > Date.now() + 60_000) return cachedToken.value
  const res = await fetch(`${LOGIN}/${env('MS_TENANT_ID')}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env('MS_CLIENT_ID'),
      client_secret: env('MS_CLIENT_SECRET'),
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
  })
  if (!res.ok) throw new Error(`Microsoft sign-in failed: ${res.status} ${await res.text()}`)
  const body = (await res.json()) as { access_token: string; expires_in: number }
  cachedToken = { value: body.access_token, expires: Date.now() + body.expires_in * 1000 }
  return cachedToken.value
}

async function graph(url: string, init: RequestInit = {}) {
  const full = url.startsWith('http') ? url : `${GRAPH}${url}`
  return fetch(full, {
    ...init,
    headers: {
      authorization: `Bearer ${await graphToken()}`,
      'content-type': 'application/json',
      prefer: 'outlook.body-content-type="text", odata.maxpagesize=50',
      ...(init.headers ?? {}),
    },
  })
}

interface Address {
  emailAddress?: { address?: string; name?: string }
}

export interface GraphMessage {
  id: string
  '@removed'?: unknown
  subject?: string
  from?: Address
  toRecipients?: Address[]
  ccRecipients?: Address[]
  replyTo?: Address[]
  receivedDateTime?: string
  sentDateTime?: string
  bodyPreview?: string
  body?: { content?: string }
  conversationId?: string
  internetMessageId?: string
  hasAttachments?: boolean
  isDraft?: boolean
}

const SELECT = [
  'subject', 'from', 'toRecipients', 'ccRecipients', 'replyTo', 'receivedDateTime', 'sentDateTime', 'bodyPreview',
  'body', 'conversationId', 'internetMessageId', 'hasAttachments', 'isDraft',
].join(',')

// ---------------------------------------------------------------------------
// Turning an email into what crm_ingest expects
// ---------------------------------------------------------------------------

const AUTOMATED_SENDER = /^(no-?reply|do-?not-?reply|donotreply|mailer-daemon|postmaster|bounces?|notifications?|alerts?|newsletters?)([+.\-_].*)?@/i

/**
 * Newsletters, receipts and system mail. Deliberately narrow: a real
 * prospect who lands in triage costs a click; one silently dropped costs a job.
 */
export function looksAutomated(fromEmail: string, body: string) {
  return AUTOMATED_SENDER.test(fromEmail) || /\bunsubscribe\b/i.test(body)
}

export interface FormFields {
  name?: string
  company?: string
  email?: string
  phone?: string
  service?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  gclid?: string
  fbclid?: string
  landing_page?: string
  referrer?: string
}

/** The X-BedRock-Lead header written by api/contact.ts. */
export function decodeLeadHeader(value: string | undefined): FormFields | null {
  if (!value) return null
  try {
    const binary = atob(value.replace(/\s+/g, ''))
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0))
    const data = JSON.parse(new TextDecoder().decode(bytes)) as FormFields & { v?: number }
    return data && typeof data.email === 'string' ? data : null
  } catch {
    return null
  }
}

/** Fallback for form emails without the header: "Label: value" lines. */
export function parseFormBody(body: string): FormFields | null {
  const labels: Record<string, keyof FormFields> = {
    name: 'name', company: 'company', email: 'email', phone: 'phone', service: 'service',
    'came from': 'utm_source', medium: 'utm_medium', campaign: 'utm_campaign', keyword: 'utm_term',
    'landing page': 'landing_page', referrer: 'referrer', 'google click id': 'gclid', 'meta click id': 'fbclid',
  }
  const out: FormFields = {}
  for (const line of body.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z ]{3,20}?)\s*[:\t]\s*(.+?)\s*$/)
    const key = match && labels[match[1].toLowerCase()]
    if (key && match[2] !== '—') out[key] = match[2]
  }
  return out.email ? out : null
}

const addr = (a?: Address) => (a?.emailAddress?.address ?? '').toLowerCase()

export function isFormEmail(m: GraphMessage) {
  return addr(m.from) === FORM_SENDER || (m.subject ?? '').startsWith('Website enquiry')
}

export function toIngest(m: GraphMessage, direction: 'in' | 'out', form: FormFields | null) {
  const body = m.body?.content ?? ''
  const fromEmail = addr(m.from)
  return {
    graph_id: m.id,
    direction,
    from_email: fromEmail,
    from_name: m.from?.emailAddress?.name ?? null,
    to_emails: [...(m.toRecipients ?? []), ...(m.ccRecipients ?? [])].map(addr).filter(Boolean),
    subject: m.subject ?? '',
    preview: m.bodyPreview ?? '',
    body_text: body,
    received_at: (direction === 'out' ? m.sentDateTime : m.receivedDateTime) ?? m.receivedDateTime ?? new Date().toISOString(),
    conversation_id: m.conversationId ?? null,
    internet_message_id: m.internetMessageId ?? null,
    has_attachments: Boolean(m.hasAttachments),
    automated: direction === 'in' && !form && looksAutomated(fromEmail, body),
    form,
  }
}

async function formFieldsFor(m: GraphMessage): Promise<FormFields | null> {
  const res = await graph(`/users/${encodeURIComponent(env('CRM_MAILBOX'))}/messages/${encodeURIComponent(m.id)}?$select=internetMessageHeaders`)
  if (res.ok) {
    const { internetMessageHeaders = [] } = (await res.json()) as { internetMessageHeaders?: { name: string; value: string }[] }
    const header = internetMessageHeaders.find((h) => h.name.toLowerCase() === 'x-bedrock-lead')
    const decoded = decodeLeadHeader(header?.value)
    if (decoded) return decoded
  }
  const parsed = parseFormBody(m.body?.content ?? '')
  if (parsed) return parsed
  // Last resort: the enquirer is the Reply-To address.
  const replyTo = addr(m.replyTo?.[0])
  return replyTo ? { email: replyTo, name: m.replyTo?.[0]?.emailAddress?.name } : null
}

// ---------------------------------------------------------------------------
// The sync
// ---------------------------------------------------------------------------

async function ensureSubscription(state: SyncState) {
  const expires = state.subscription_expires ? Date.parse(state.subscription_expires) : 0
  if (state.subscription_id && expires - Date.now() > RENEW_WITHIN_MS) return
  const expirationDateTime = new Date(Date.now() + SUBSCRIPTION_MINUTES * 60_000).toISOString()

  if (state.subscription_id) {
    const res = await graph(`/subscriptions/${state.subscription_id}`, { method: 'PATCH', body: JSON.stringify({ expirationDateTime }) })
    if (res.ok) {
      await setState({ subscription_expires: expirationDateTime })
      return
    }
  }
  const publicUrl = (env('CRM_PUBLIC_URL') || 'https://www.bedrock-it.co.nz').replace(/\/$/, '')
  const res = await graph('/subscriptions', {
    method: 'POST',
    body: JSON.stringify({
      changeType: 'created',
      notificationUrl: `${publicUrl}/api/crm/notify`,
      resource: `/users/${env('CRM_MAILBOX')}/messages`,
      expirationDateTime,
      clientState: env('GRAPH_CLIENT_STATE'),
    }),
  })
  if (!res.ok) throw new Error(`Could not subscribe to the mailbox: ${res.status} ${await res.text()}`)
  const sub = (await res.json()) as { id: string; expirationDateTime: string }
  await setState({ subscription_id: sub.id, subscription_expires: sub.expirationDateTime })
}

async function syncFolder(folder: 'inbox' | 'sentitems', cursor: string | null, deadline: number) {
  const direction = folder === 'inbox' ? 'in' : 'out'
  const since = new Date(Date.now() - BACKFILL_DAYS * 86400_000).toISOString()
  const base = `/users/${encodeURIComponent(env('CRM_MAILBOX'))}/mailFolders/${folder}/messages/delta`
  let url = cursor ?? `${base}?$select=${SELECT}&$filter=receivedDateTime+ge+${since}`
  const outcomes: Record<string, number> = {}
  let seen = 0

  for (;;) {
    let res = await graph(url)
    // Some tenants refuse $filter on the first delta call; fall back to the
    // whole folder and skip old mail ourselves.
    if (res.status === 400 && !cursor && url.includes('$filter')) {
      url = `${base}?$select=${SELECT}`
      res = await graph(url)
    }
    // An expired cursor means start again; stored messages are skipped by id.
    if (res.status === 410 && cursor) return syncFolder(folder, null, deadline)
    if (!res.ok) throw new Error(`Reading ${folder} failed: ${res.status} ${await res.text()}`)

    const page = (await res.json()) as { value: GraphMessage[]; '@odata.nextLink'?: string; '@odata.deltaLink'?: string }
    for (const m of page.value) {
      if (m['@removed'] || m.isDraft) continue
      if ((m.receivedDateTime ?? m.sentDateTime ?? '') < since) continue
      const form = direction === 'in' && isFormEmail(m) ? await formFieldsFor(m) : null
      const outcome = (await db('rpc/crm_ingest', {
        method: 'POST',
        body: JSON.stringify({ p: toIngest(m, direction, form), p_own_domain: OWN_DOMAIN }),
      })) as string
      const kind = outcome.split(':')[0]
      outcomes[kind] = (outcomes[kind] ?? 0) + 1
      seen++
    }

    const next = page['@odata.nextLink']
    if (next) {
      url = next
      // Out of time: keep the place and carry on next run.
      if (Date.now() > deadline) return { cursor: next, seen, outcomes, finished: false }
      continue
    }
    return { cursor: page['@odata.deltaLink'] ?? cursor, seen, outcomes, finished: true }
  }
}

export async function runSync() {
  const started = Date.now()
  const deadline = started + TIME_BUDGET_MS
  await setState({ last_run_at: new Date(started).toISOString() })
  try {
    const state = await getState()
    await ensureSubscription(state)
    const inbox = await syncFolder('inbox', state.inbox_delta, deadline)
    await setState({ inbox_delta: inbox.cursor })
    const sent = await syncFolder('sentitems', state.sent_delta, deadline)
    await setState({
      sent_delta: sent.cursor,
      last_ok_at: new Date().toISOString(),
      last_error: null,
      messages_seen: (state.messages_seen ?? 0) + inbox.seen + sent.seen,
    })
    return { ok: true, inbox, sent, ms: Date.now() - started }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await setState({ last_error: message.slice(0, 1000) }).catch(() => {})
    return { ok: false, error: message }
  }
}
