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

Hub and spoke: `/services` introduces each service and links to a page per service, so
each one can target its own search intent with its own title and description. Services
without enough depth to sustain a page (networks, project rollouts) stay on the hub —
thin pages are worse than no pages.

| Route | Contents |
| --- | --- |
| `/` | Hero, About, and a four-card feature grid |
| `/our-story` | Company timeline and working principles |
| `/services` | Hub — links to the four service pages, plus networks and rollouts |
| `/services/website-development` | Includes, process, outcomes, FAQs |
| `/services/managed-it-support` | Includes, outcomes, FAQs |
| `/services/cyber-security` | Includes, outcomes, FAQs |
| `/services/cloud-migration` | Includes, five-phase process, outcomes, FAQs |
| `/support` | For existing clients — how to reach the helpdesk, response targets |
| `/contact` | Contact details and enquiry form |

`/cloud` 301s to `/services/cloud-migration` (via `vercel.json`, with a client-side
fallback in `AppRoutes.tsx` for hosts that ignore it).

Service copy lives in `src/data/services.ts` — one entry per spoke drives the page, the
hub card, the sibling links, the footer, the route and its metadata. Each spoke emits
`FAQPage` structured data from its own questions.

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
- **Service copy needs your review.** `src/data/services.ts` describes capability and
  process, deliberately avoiding claims that would need proof (certifications, partner
  status, client names, prices). Check every sentence is something you would stand behind
  on a call, and add the specifics only you know.
- **`SITE.url` in `src/config/seo.ts` defaults to a placeholder domain.** Set `SITE_URL` at
  build time, or link previews and canonical URLs will point somewhere that does not exist.
- **Media is placeholder.** The hero and feature-card videos are stock; swap `HERO_VIDEO`
  in `src/components/Hero.tsx` and `CARD_VIDEO` in `src/components/Features.tsx`.

Contact details live in one place: `src/config/contact.ts`.
