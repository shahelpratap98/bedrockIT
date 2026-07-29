/**
 * Per-route metadata, shared by the client (Seo component) and the prerender
 * script, so the tags in the static HTML and the tags after hydration agree.
 */

/**
 * Origin used for absolute URLs. Never hardcoded to a domain: the build script
 * resolves it from SITE_URL, then Vercel's own environment, so the tags always
 * point at whatever is actually live. In `vite dev` there is no build-time
 * value, so fall back to the origin being viewed.
 */
function resolveSiteUrl(): string {
  const fromBuild = import.meta.env.VITE_SITE_URL
  if (fromBuild) return fromBuild.replace(/\/$/, '')
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

export const SITE = {
  name: 'BedRock IT',
  url: resolveSiteUrl(),
  /**
   * Preview image path, or '' when none is present. The build sets this only
   * after finding the file, so a missing image means no og:image tag rather
   * than a broken thumbnail on Messenger.
   */
  ogImage: import.meta.env.VITE_OG_IMAGE || '',
}

const OG_IMAGE_ALT =
  'A person working on a laptop on a sunlit hillside, under a dark cinematic sky.'

import { SERVICES } from '../data/services'

export interface RouteSeo {
  path: string
  title: string
  description: string
  /** Keep out of search results (used for the 404 shell). */
  noindex?: boolean
}

/** Spoke pages, derived so page copy and metadata cannot drift apart. */
const SERVICE_SEO: RouteSeo[] = SERVICES.map((service) => ({
  path: `/services/${service.slug}`,
  title: service.seoTitle,
  description: service.seoDescription,
}))

export const ROUTE_SEO: RouteSeo[] = [
  {
    path: '/',
    title: 'BedRock IT — Managed IT, Cloud and Websites',
    description:
      'Managed IT support, cloud migration, cyber security and SEO optimised websites for businesses that cannot afford downtime. One team that answers the phone.',
  },
  {
    path: '/our-story',
    title: 'Our Story — BedRock IT',
    description:
      'How BedRock IT grew from two engineers and a van into a managed services team, and the principles behind the way we run IT for our clients.',
  },
  {
    path: '/services',
    title: 'IT Services — BedRock IT',
    description:
      'Managed IT support, cloud migration, cyber security, website development, networks and project rollouts — scoped and priced before any work begins.',
  },
  ...SERVICE_SEO,
  {
    path: '/support',
    title: 'Get IT Support — BedRock IT',
    description:
      'How existing clients reach the BedRock IT helpdesk by phone, WhatsApp or email, what counts as a P1, and the response targets we report against monthly.',
  },
  {
    path: '/contact',
    title: 'Contact BedRock IT',
    description:
      'Tell us what you are running today and we will come back within one business day with an honest read on what we would change and what it would cost.',
  },
]

export const NOT_FOUND_SEO: RouteSeo = {
  path: '/404',
  title: 'Page Not Found — BedRock IT',
  description: 'The page you were looking for does not exist.',
  noindex: true,
}

export function seoFor(pathname: string): RouteSeo {
  const normalised = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return ROUTE_SEO.find((route) => route.path === normalised) ?? NOT_FOUND_SEO
}

function escapeAttr(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

/**
 * Absolute URL for a route. `basePrefix` is the deploy subpath — "/" for a
 * domain root, "/bedrockIT/" for a GitHub Pages project site.
 */
export function canonicalFor(seo: RouteSeo, basePrefix = '/', origin = SITE.url): string {
  const prefix = basePrefix.replace(/\/$/, '')
  return `${origin}${prefix}${seo.path === '/' ? '/' : seo.path}`
}

/** Head tags as an HTML string, for the prerendered pages. */
export function renderHeadTags(seo: RouteSeo, basePrefix = '/'): string {
  const canonical = canonicalFor(seo, basePrefix)
  const tags = [
    `<title>${escapeAttr(seo.title)}</title>`,
    `<meta name="description" content="${escapeAttr(seo.description)}" />`,
    `<link rel="canonical" href="${escapeAttr(canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeAttr(SITE.name)}" />`,
    `<meta property="og:title" content="${escapeAttr(seo.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(seo.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(canonical)}" />`,
    `<meta name="twitter:card" content="${SITE.ogImage ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${escapeAttr(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(seo.description)}" />`,
  ]

  if (SITE.ogImage) {
    const imageUrl = `${SITE.url}${basePrefix.replace(/\/$/, '')}${SITE.ogImage}`
    tags.push(
      `<meta property="og:image" content="${escapeAttr(imageUrl)}" />`,
      `<meta property="og:image:alt" content="${escapeAttr(OG_IMAGE_ALT)}" />`,
      `<meta name="twitter:image" content="${escapeAttr(imageUrl)}" />`,
    )
  }

  if (seo.noindex) tags.push(`<meta name="robots" content="noindex" />`)
  return tags.join('\n    ')
}
