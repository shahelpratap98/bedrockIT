/**
 * Runs the mailbox sync on demand.
 *
 *   GET   from Vercel cron, daily: catch-up, and renews the Graph subscription
 *         before it lapses. Vercel sends "Authorization: Bearer $CRON_SECRET".
 *   POST  from the portal's "Sync now" button, with the signed-in person's
 *         Supabase access token.
 *   GET ?check=1  reports which settings are missing. No secrets, no data.
 */
import { crmConfigured, isMember, json, runSync } from '../_lib/crm.js'

declare const process: { env: Record<string, string | undefined> }

const bearer = (request: Request) => (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')

export async function GET(request: Request) {
  const config = crmConfigured()
  if (new URL(request.url).searchParams.has('check')) return json({ configured: config.ok, missing: config.missing })

  const secret = process.env.CRON_SECRET
  if (!secret || bearer(request) !== secret) return json({ error: 'Unauthorised' }, 401)
  if (!config.ok) return json({ error: 'not_configured', missing: config.missing }, 501)
  const result = await runSync()
  return json(result, result.ok ? 200 : 500)
}

export async function POST(request: Request) {
  const config = crmConfigured()
  if (!config.ok) return json({ error: 'not_configured', missing: config.missing }, 501)
  if (!(await isMember(bearer(request)))) return json({ error: 'Unauthorised' }, 401)
  const result = await runSync()
  return json(result, result.ok ? 200 : 500)
}
