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
  'BedRock IT — managed IT, cloud, cyber security and websites for New Zealand businesses, over a person working on a laptop on a sunlit hilltop above the clouds.'

import { SERVICES } from '../data/services'
import { CONTACT } from './contact'

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
    path: '/projects',
    title: 'Our Projects — Websites We Have Built | BedRock IT',
    description:
      'Real business websites designed, built and hosted by BedRock IT — commercial HVAC, structural engineering and immigration advice. Every one live today.',
  },
  {
    path: '/support',
    title: 'Get IT Support — BedRock IT',
    description:
      'How existing clients reach the BedRock IT helpdesk by phone, WhatsApp or email, what counts as a P1, and the response targets we report against monthly.',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — BedRock IT',
    description:
      'How BedRock IT collects, uses and protects personal information from this website, including contact form enquiries and advertising measurement, under the NZ Privacy Act 2020.',
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

/**
 * Organization schema, emitted on every prerendered page. "Bedrock" is a
 * heavily contested name (a SaaS, a safety consultancy, AWS, Minecraft), so
 * explicit entity signals — including sameAs to the Facebook page — do the
 * disambiguation work for search and AI engines.
 */
function organizationSchema(origin: string) {
  return {
    '@type': 'Organization',
    // Stable identifier so the other blocks can reference this entity by @id
    // instead of restating it.
    '@id': `${origin}/#organization`,
    name: SITE.name,
    url: origin,
    description:
      'Managed IT support, cloud migration, cyber security and website development for New Zealand businesses.',
    telephone: CONTACT.phoneDisplay,
    email: CONTACT.email,
    areaServed: 'NZ',
    sameAs: ['https://www.facebook.com/' + CONTACT.messengerPageId],
  }
}

/** Trail from the home page down to this route, for the breadcrumb rich result. */
function breadcrumbSchema(seo: RouteSeo, origin: string) {
  if (seo.path === '/') return null

  const segments = seo.path.split('/').filter(Boolean)
  const items = [{ name: 'Home', item: `${origin}/` }]

  segments.forEach((segment, i) => {
    const path = `/${segments.slice(0, i + 1).join('/')}`

    // A crumb names the page; it does not sell it. Service titles carry
    // marketing ("Custom Websites From $350 — …"), so prefer the service's own
    // name and only fall back to trimming the title.
    const service = SERVICES.find((entry) => `/services/${entry.slug}` === path)
    const match = ROUTE_SEO.find((route) => route.path === path)
    const name =
      service?.name ??
      (match
        ? match.title.split(/\s+[—|]\s+/)[0]
        : segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))

    items.push({ name, item: `${origin}${path}` })
  })

  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: entry.name,
      item: entry.item,
    })),
  }
}

/** What is actually being sold, on the pages that sell it. */
function serviceSchema(seo: RouteSeo, origin: string) {
  const slug = seo.path.startsWith('/services/') ? seo.path.slice('/services/'.length) : null
  const service = slug ? SERVICES.find((entry) => entry.slug === slug) : null
  if (!service) return null

  return {
    '@type': 'Service',
    name: service.name,
    serviceType: service.name,
    description: service.summary,
    provider: { '@id': `${origin}/#organization` },
    areaServed: 'NZ',
    url: `${origin}${seo.path}`,
  }
}

/**
 * One @graph rather than several loose blocks, so the entities can reference
 * each other by @id and search engines read them as one connected description
 * of the site instead of unrelated fragments.
 */
function schemaGraph(seo: RouteSeo, origin: string): string {
  const graph: Record<string, unknown>[] = [organizationSchema(origin)]

  if (seo.path === '/') {
    graph.push({
      '@type': 'WebSite',
      '@id': `${origin}/#website`,
      name: SITE.name,
      url: origin,
      publisher: { '@id': `${origin}/#organization` },
    })
  }

  const breadcrumb = breadcrumbSchema(seo, origin)
  if (breadcrumb) graph.push(breadcrumb)

  const service = serviceSchema(seo, origin)
  if (service) graph.push(service)

  const data = { '@context': 'https://schema.org', '@graph': graph }
  return '<script type="application/ld+json">' + JSON.stringify(data) + '</script>'
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

  tags.push(schemaGraph(seo, SITE.url))

  if (seo.noindex) tags.push(`<meta name="robots" content="noindex" />`)
  return tags.join('\n    ')
}
