/**
 * Contact form endpoint — a Vercel Edge Function, so there is no npm
 * dependency and nothing to keep patched.
 *
 * Environment variables (set in Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY   required. Without it the endpoint reports 501 and the
 *                    form falls back to opening the visitor's mail client.
 *   CONTACT_TO       optional. Where enquiries go. Defaults to the address below.
 *   CONTACT_FROM     optional. Must be on a domain verified in Resend. The
 *                    default works for sending to your own account's address.
 */
export const config = { runtime: 'edge' }

declare const process: { env: Record<string, string | undefined> }

const DEFAULT_TO = 'shahel.pratap98@gmail.com'
const DEFAULT_FROM = 'BedRock IT <onboarding@resend.dev>'

const LIMITS = { name: 120, company: 160, email: 200, phone: 60, size: 60, message: 5000 }

interface Payload {
  name?: string
  company?: string
  email?: string
  phone?: string
  size?: string
  message?: string
  /** Honeypot — real people never see this field, so anything in it is a bot. */
  website?: string
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let payload: Payload
  try {
    payload = (await req.json()) as Payload
  } catch {
    return json({ error: 'Expected JSON' }, 400)
  }

  // Silently accept bot submissions so they get no signal to adapt.
  if (clean(payload.website, 200)) return json({ ok: true }, 200)

  const name = clean(payload.name, LIMITS.name)
  const email = clean(payload.email, LIMITS.email)
  const message = clean(payload.message, LIMITS.message)
  const company = clean(payload.company, LIMITS.company)
  const phone = clean(payload.phone, LIMITS.phone)
  const size = clean(payload.size, LIMITS.size)

  const missing = [!name && 'name', !email && 'email', !message && 'message'].filter(Boolean)
  if (missing.length) return json({ error: `Missing: ${missing.join(', ')}` }, 400)
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: 'Invalid email' }, 400)

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Not configured yet — tell the client so it can fall back to mailto.
    return json({ error: 'not_configured' }, 501)
  }

  const rows: Array<[string, string]> = [
    ['Name', name],
    ['Company', company || '—'],
    ['Email', email],
    ['Phone', phone || '—'],
    ['Team size', size || '—'],
  ]

  const text = [...rows.map(([k, v]) => `${k}: ${v}`), '', message].join('\n')
  const html = [
    '<table cellpadding="6" style="font-family:sans-serif;font-size:14px">',
    ...rows.map(
      ([k, v]) =>
        `<tr><td style="color:#666">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`,
    ),
    '</table>',
    `<p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(
      message,
    )}</p>`,
  ].join('')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || DEFAULT_FROM,
      to: [process.env.CONTACT_TO || DEFAULT_TO],
      // So hitting reply in your inbox replies to the enquirer, not to Resend.
      reply_to: email,
      subject: `Website enquiry — ${name}${company ? ` (${company})` : ''}`,
      text,
      html,
    }),
  })

  if (!res.ok) {
    const detail = await res.text()
    console.error('Resend rejected the send:', res.status, detail)
    return json({ error: 'send_failed' }, 502)
  }

  return json({ ok: true }, 200)
}
