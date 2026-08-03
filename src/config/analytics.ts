/** Google tag (gtag.js). The loader snippet lives in index.html. */
export const GOOGLE_TAG_ID = 'AW-18359431812'

/** Conversion event names as defined in Google Ads. */
export const CONVERSIONS = {
  contact: 'ads_conversion_Contact_Us_1',
} as const

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Report a conversion. Fire at the moment the action completes — never on
 * page load, which would count every visitor as a conversion.
 */
export function trackConversion(name: (typeof CONVERSIONS)[keyof typeof CONVERSIONS]) {
  window.gtag?.('event', name, {})
}
