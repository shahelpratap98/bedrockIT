/**
 * Build for a static host that has no rewrite rules (GitHub Pages and friends).
 *
 * Two things differ from the normal `npm run build`:
 *   1. `BASE_PATH` prefixes asset URLs, because project sites are served from
 *      https://<user>.github.io/<repo>/ rather than the domain root.
 *   2. dist/404.html is a copy of index.html, so an unknown path still serves
 *      the SPA shell and React Router can render the right route.
 *
 * Vercel needs neither — vercel.json rewrites everything to index.html.
 */
import { execSync } from 'node:child_process'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const basePath = process.env.BASE_PATH ?? '/bedrockIT/'
const env = { ...process.env, BASE_PATH: basePath }

console.log(`Building with base "${basePath}"`)
execSync('npx tsc', { stdio: 'inherit', env })
execSync('npx vite build', { stdio: 'inherit', env })

const index = resolve('dist', 'index.html')
const fallback = resolve('dist', '404.html')

if (!existsSync(index)) {
  console.error('dist/index.html is missing — did the build fail?')
  process.exit(1)
}

copyFileSync(index, fallback)
console.log('Copied dist/index.html -> dist/404.html')
