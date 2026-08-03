import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE, canonicalFor, seoFor } from '../config/seo'

const GOOGLE_TAG_ID = 'AW-18359431812'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Keeps the document head in step with the current route. The prerendered HTML
 * already carries the right tags, so this matters for client-side navigation.
 */
export default function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const seo = seoFor(pathname)
    // Prefer the origin actually being viewed, so the same build serves
    // correct URLs from a preview domain and a custom domain alike.
    const canonical = canonicalFor(seo, import.meta.env.BASE_URL, window.location.origin)

    document.title = seo.title
    upsertMeta('name', 'description', seo.description)
    upsertLink('canonical', canonical)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', SITE.name)
    upsertMeta('property', 'og:title', seo.title)
    upsertMeta('property', 'og:description', seo.description)
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('name', 'twitter:card', SITE.ogImage ? 'summary_large_image' : 'summary')
    upsertMeta('name', 'twitter:title', seo.title)
    upsertMeta('name', 'twitter:description', seo.description)

    if (SITE.ogImage) {
      const imageUrl = `${window.location.origin}${import.meta.env.BASE_URL.replace(
        /\/$/,
        '',
      )}${SITE.ogImage}`
      upsertMeta('property', 'og:image', imageUrl)
      upsertMeta('name', 'twitter:image', imageUrl)
    }

    const robots = document.head.querySelector('meta[name="robots"]')
    if (seo.noindex) {
      upsertMeta('name', 'robots', 'noindex')
    } else if (robots) {
      robots.remove()
    }

    // The tag in index.html only fires on full page loads; client-side route
    // changes must report themselves or Google sees one page per visit.
    window.gtag?.('config', GOOGLE_TAG_ID, { page_path: pathname, page_title: seo.title })
  }, [pathname])

  return null
}
