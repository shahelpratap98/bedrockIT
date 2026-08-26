import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import AppRoutes from './AppRoutes'
import { NOT_FOUND_SEO, ROUTE_SEO, renderHeadTags, seoFor } from './config/seo'

const BASE = import.meta.env.BASE_URL

/** Renders one route to HTML plus the head tags that belong with it. */
export function render(url: string) {
  const html = renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>,
  )
  return { html, head: renderHeadTags(seoFor(url), BASE) }
}

/**
 * The 404 page, rendered for real rather than shipped as an empty shell. The
 * component shows the same thing whatever the unknown path was, so this markup
 * is valid for every miss and hydrates cleanly over any of them.
 */
export function renderNotFound() {
  const html = renderToString(
    <StaticRouter location="/404">
      <AppRoutes />
    </StaticRouter>,
  )
  return { html, head: renderHeadTags(NOT_FOUND_SEO, BASE) }
}

export const routes = ROUTE_SEO.map((route) => route.path)
