# BedRock IT

Marketing site for BedRock IT — managed IT, cloud, security and website development.

Dark, cinematic design in a warm cream palette (`#DEDBC8` / `#E1E0CC` on black), with
Almarai as the global typeface and Instrument Serif italic for accent text.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS 3
- framer-motion — pull-up text, scroll-linked character reveals, card entrances
- lucide-react — icons
- react-router-dom — routing

## Running locally

```bash
npm install
npm run dev
```

```bash
npm run build
```

## Pages

| Route | Contents |
| --- | --- |
| `/` | Hero, About, and a four-card feature grid |
| `/our-story` | Company timeline and working principles |
| `/services` | Six services with detail and checklists |
| `/support` | Contact channels, response targets, agreement scope |
| `/cloud` | Five-phase migration process |
| `/contact` | Contact details and enquiry form |

## Search and social metadata

`npm run build` prerenders every route to static HTML. Client-side rendering alone is weak
for search and useless for link previews — social scrapers never run JavaScript, so a
WhatsApp or LinkedIn share would only ever see an empty shell.

Each route's `<title>`, meta description, canonical URL and Open Graph tags are baked into
its own HTML file, and React hydrates over that markup on load. `src/components/Seo.tsx`
keeps the head in step during client-side navigation. Both read the same data from
`src/config/seo.ts`, so the static tags and the post-hydration tags cannot drift.

Set the live origin at build time — Open Graph needs absolute URLs:

```bash
SITE_URL=https://your-domain.co.nz npm run build
```

The build also writes `sitemap.xml` and `robots.txt` from the same route list.

Headings are semantic: one `<h1>` per page, `<h2>` for section headers, `<h3>` on cards.

## Deployment

Every route is prerendered to its own `index.html`, so deep links resolve as real files on
any static host. The rewrite and 404 fallback below only matter for paths that do not
exist at build time.

### Vercel (recommended)

Import the repo and accept the defaults — `vercel.json` supplies everything:

- `rewrites` sends all paths to `/index.html`, after the filesystem is checked
- `outputDirectory: dist`, `buildCommand: npm run build`
- immutable cache headers on `/assets/*` (filenames are content-hashed)

No dashboard configuration needed.

### GitHub Pages, or any static host without rewrites

```bash
SITE_URL=https://shahelpratap98.github.io npm run build:pages
```

That differs from the normal build in two ways: `--base=/bedrockIT/` prefixes asset URLs
and canonical URLs, because project sites are served from a subpath rather than the domain
root; and `dist/404.html` is written as a `noindex` client-rendered shell for paths that
were not prerendered. Pass `SITE_URL` or canonical URLs and the sitemap will point at the
wrong origin — the build warns if you forget.

The router reads its `basename` from `import.meta.env.BASE_URL`, so it follows whatever
base the build used. For a custom domain on Pages, build with `--base=/` instead.

## Before going live

- **Contact form has no backend.** `handleSubmit` in `src/pages/Contact.tsx` opens the
  visitor's mail client via `mailto:`, which fails silently for webmail users. Point it at
  a form endpoint instead.
- **Response targets are placeholders.** The P1–P4 figures in `src/pages/Support.tsx` read
  as contractual commitments — replace them with the real numbers.
- **`SITE.url` in `src/config/seo.ts` defaults to a placeholder domain.** Set `SITE_URL` at
  build time, or link previews and canonical URLs will point somewhere that does not exist.
- **Media is placeholder.** The hero and feature-card videos are stock; swap `HERO_VIDEO`
  in `src/components/Hero.tsx` and `CARD_VIDEO` in `src/components/Features.tsx`.

Contact details live in one place: `src/config/contact.ts`.
