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

/** Head tags for the client-only 404 shell (no markup is prerendered for it). */
export function notFoundHead() {
  return renderHeadTags(NOT_FOUND_SEO, BASE)
}

export const routes = ROUTE_SEO.map((route) => route.path)
