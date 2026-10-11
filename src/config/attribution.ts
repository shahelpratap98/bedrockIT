/**
 * Where a visitor came from, so an enquiry can be traced back to the ad,
 * campaign or page that brought them in. Kept in sessionStorage for the
 * visit only, and sent with the contact form. Nothing here identifies a
 * person: click IDs are opaque tokens issued by Google and Meta.
 */

export interface Attribution {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  gclid?: string
  fbclid?: string
  landing_page?: string
  referrer?: string
}

const KEY = 'bedrock_attribution'
const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'gclid', 'fbclid'] as const

function read(): Attribution | null {
  try {
    const raw = window.sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Attribution) : null
  } catch {
    return null
  }
}

/**
 * Run once when the site loads. The first page of the visit wins, unless the
 * visitor arrives again through a new ad or tagged link, which replaces it.
 */
export function captureAttribution() {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  const fromUrl: Attribution = {}
  for (const key of PARAMS) {
    const value = url.searchParams.get(key)
    if (value) fromUrl[key] = value.slice(0, 300)
  }
  const tagged = Object.keys(fromUrl).length > 0
  if (read() && !tagged) return

  const referrer = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : ''
  const next: Attribution = {
    ...fromUrl,
    landing_page: url.pathname.slice(0, 300),
    ...(referrer ? { referrer: referrer.slice(0, 300) } : {}),
  }
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* Storage blocked: the enquiry still sends, just without its source. */
  }
}

export function getAttribution(): Attribution {
  return read() ?? {}
}
