/**
 * Microsoft Graph calls this when a message lands in the mailbox.
 *
 * Graph wants an answer within a few seconds, so this replies 202 at once and
 * runs the sync afterwards with waitUntil. The notification body is only a
 * nudge: nothing in it is trusted beyond the clientState check, and the sync
 * reads the mailbox itself.
 */
import { waitUntil } from '@vercel/functions'
import { crmConfigured, runSync } from '../_lib/crm.js'

declare const process: { env: Record<string, string | undefined> }

export async function POST(request: Request) {
  // Subscription handshake: echo the token back as plain text.
  const token = new URL(request.url).searchParams.get('validationToken')
  if (token) return new Response(token, { status: 200, headers: { 'content-type': 'text/plain' } })

  if (!crmConfigured().ok) return new Response(null, { status: 202 })

  let body: { value?: { clientState?: string }[] } = {}
  try {
    body = await request.json()
  } catch {
    return new Response(null, { status: 400 })
  }
  const secret = process.env.GRAPH_CLIENT_STATE
  const genuine = (body.value ?? []).some((n) => n.clientState === secret)
  if (!genuine) return new Response(null, { status: 403 })

  waitUntil(runSync())
  return new Response(null, { status: 202 })
}
