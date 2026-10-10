import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * /portal/* is a separate single-page app (portal.html). Vercel rewrites it
 * in production (vercel.json); this does the same for `vite` and
 * `vite preview`.
 */
function portalFallback(): Plugin {
  const rewrite = (req: { url?: string }) => {
    const path = (req.url ?? '').split('?')[0]
    if (path === '/portal' || (path.startsWith('/portal/') && !path.includes('.'))) req.url = '/portal.html'
  }
  return {
    name: 'portal-fallback',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => (rewrite(req), next()))
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => (rewrite(req), next()))
    },
  }
}

export default defineConfig(({ isSsrBuild }) => ({
  // Root by default (Vercel, custom domains). GitHub Pages project sites are
  // served from /<repo>/, so `npm run build:pages` sets BASE_PATH instead.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), portalFallback()],
  // Two pages: the public site, prerendered by scripts/build-site.mjs, and the
  // CRM portal, which never loads the site's ad and analytics tags. The SSR
  // build takes its entry from the command line instead.
  build: isSsrBuild
    ? {}
    : {
        rollupOptions: {
          input: {
            main: resolve(__dirname, 'index.html'),
            portal: resolve(__dirname, 'portal.html'),
          },
        },
      },
}))
