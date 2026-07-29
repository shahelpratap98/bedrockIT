/**
 * Build and prerender the site.
 *
 * Client-side rendering alone is weak for search and useless for link previews:
 * social scrapers never run JavaScript, so they would only ever see the empty
 * shell. This renders every route to static HTML at build time, with that
 * route's own title, description and Open Graph tags baked into the markup.
 * React hydrates over it on load.
 *
 *   node scripts/build-site.mjs                              root-relative (Vercel)
 *   node scripts/build-site.mjs --base=/bedrockIT/ --fallback  subpath + 404.html
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const args = process.argv.slice(2)
const baseArg = args.find((arg) => arg.startsWith('--base='))
const base = baseArg ? baseArg.slice('--base='.length) : '/'
const wantFallback = args.includes('--fallback')

const SSR_OUT = 'dist-ssr'
const origin = (process.env.SITE_URL ?? 'https://bedrockit.co.nz').replace(/\/$/, '')

if (base !== '/' && !process.env.SITE_URL) {
  console.warn(
    `\nWarning: building for subpath "${base}" with the default origin ${origin}.\n` +
      `Canonical URLs and the sitemap will be wrong. Set SITE_URL, e.g.\n` +
      `  SITE_URL=https://shahelpratap98.github.io npm run build:pages\n`,
  )
}

// VITE_ prefix so the value is inlined into both the client and SSR bundles.
const env = { ...process.env, BASE_PATH: base, VITE_SITE_URL: origin }

// Call Vite's JS entry with the running node binary rather than the shell
// wrapper — Node refuses to spawn .cmd files without a shell on Windows.
const viteBin = resolve('node_modules', 'vite', 'bin', 'vite.js')
const run = (cmdArgs) =>
  execFileSync(process.execPath, [viteBin, ...cmdArgs], { stdio: 'inherit', env })

console.log(`\nBuilding with base "${base}"`)
run(['build'])
run(['build', '--ssr', 'src/entry-server.tsx', '--outDir', SSR_OUT])

const entry = resolve(SSR_OUT, 'entry-server.js')
if (!existsSync(entry)) {
  console.error(`Expected the SSR bundle at ${entry}`)
  process.exit(1)
}

const { render, notFoundHead, routes } = await import(pathToFileURL(entry).href)
const template = readFileSync(resolve('dist', 'index.html'), 'utf8')

function writePage(outPath, html, head) {
  const page = template.replace('<!--app-head-->', head).replace('<!--app-html-->', html)
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, page)
}

console.log('')
for (const route of routes) {
  const { html, head } = render(route)
  // "/" is dist/index.html, "/services" is dist/services/index.html — both
  // resolve without a rewrite on any static host.
  const outPath =
    route === '/' ? resolve('dist', 'index.html') : resolve('dist', route.slice(1), 'index.html')
  writePage(outPath, html, head)
  console.log(`  prerendered ${route}`)
}

if (wantFallback) {
  // Shell only: the requested path is unknown at build time, so let the client
  // render it rather than shipping markup that will not match.
  writePage(resolve('dist', '404.html'), '', notFoundHead())
  console.log('  wrote 404.html (client-rendered shell)')
}

// Search engine plumbing. Absolute URLs, so they need the real origin.
const prefix = base === '/' ? '' : base.replace(/\/$/, '')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => `  <url><loc>${origin}${prefix}${route === '/' ? '/' : route}</loc></url>`)
  .join('\n')}
</urlset>
`
writeFileSync(resolve('dist', 'sitemap.xml'), sitemap)

writeFileSync(
  resolve('dist', 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${origin}${prefix}/sitemap.xml\n`,
)
console.log('  wrote sitemap.xml and robots.txt')

rmSync(SSR_OUT, { recursive: true, force: true })
console.log(`\nDone — ${routes.length} routes prerendered into dist/\n`)
