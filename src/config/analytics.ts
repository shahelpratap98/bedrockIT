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
 * The pixel's base code only fires PageView on full page loads; client-side
 * route changes must report themselves. (gtag has its own equivalent in Seo.)
 */
export function trackMetaPageView() {
  window.fbq?.('track', 'PageView')
}
