/** Google tag (gtag.js) and Meta Pixel. Both loader snippets live in index.html. */
export const GOOGLE_TAG_ID = 'AW-18359431812'
export const META_PIXEL_ID = '1340904901132804'

/** Conversion event names as defined in Google Ads. */
export const CONVERSIONS = {
  contact: 'ads_conversion_Contact_Us_1',
} as const

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

/**
 * Report a completed enquiry to both ad platforms. Fire at the moment the
 * action completes — never on page load, which would count every visitor
 * as a conversion.
 */
export function trackEnquiryConversion() {
  window.gtag?.('event', CONVERSIONS.contact, {})
  window.fbq?.('track', 'Lead')
}

/**
 * Report a click on a WhatsApp, phone, email or Messenger link. This is an
 * intent signal, not a completed enquiry, so it is a plain event: it only
 * counts in Google Ads once a conversion action is created for
 * `contact_click`, and that action should be secondary so bidding still
 * optimises for real form enquiries.
 */
export function trackContactClick(method: 'whatsapp' | 'phone' | 'email' | 'messenger') {
  window.gtag?.('event', 'contact_click', { method })
  window.fbq?.('track', 'Contact', { method })
}

/** Which contact method a link opens, if any. */
export function contactMethodOf(href: string) {
  if (href.startsWith('https://wa.me/')) return 'whatsapp' as const
  if (href.startsWith('tel:')) return 'phone' as const
  if (href.startsWith('mailto:')) return 'email' as const
  if (href.startsWith('https://m.me/')) return 'messenger' as const
  return null
}

/**
 * The pixel's base code only fires PageView on full page loads; client-side
 * route changes must report themselves. (gtag has its own equivalent in Seo.)
 */
export function trackMetaPageView() {
  window.fbq?.('track', 'PageView')
}
