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

## Deployment

This is a single-page app, so every route has to fall back to `index.html` or deep links
404 on refresh. Two setups are included.

### Vercel (recommended)

Import the repo and accept the defaults — `vercel.json` supplies everything:

- `rewrites` sends all paths to `/index.html`, after the filesystem is checked
- `outputDirectory: dist`, `buildCommand: npm run build`
- immutable cache headers on `/assets/*` (filenames are content-hashed)

No dashboard configuration needed.

### GitHub Pages, or any static host without rewrites

```bash
npm run build:pages
```

That differs from the normal build in two ways: `BASE_PATH` (default `/bedrockIT/`)
prefixes asset URLs, because project sites are served from a subpath rather than the
domain root; and `dist/404.html` is written as a copy of `index.html`, so an unknown
path still serves the SPA shell and the router renders the right route. Override the
subpath for a custom domain:

```bash
BASE_PATH=/ npm run build:pages
```

The router reads its `basename` from `import.meta.env.BASE_URL`, so it follows
whatever `BASE_PATH` was set at build time.

Note that the 404.html route returns an HTTP 404 status even for pages that exist,
which search engines dislike. On a site that sells SEO, prefer Vercel.

## Before going live

- **Contact form has no backend.** `handleSubmit` in `src/pages/Contact.tsx` opens the
  visitor's mail client via `mailto:`, which fails silently for webmail users. Point it at
  a form endpoint instead.
- **Response targets are placeholders.** The P1–P4 figures in `src/pages/Support.tsx` read
  as contractual commitments — replace them with the real numbers.
- **Every route shares one `<title>` and has no meta description.** Client-side rendering
  with a single static `index.html` is weak for search. Consider per-route metadata, or
  prerendering / SSR if organic search matters.
- **Media is placeholder.** The hero and feature-card videos are stock; swap `HERO_VIDEO`
  in `src/components/Hero.tsx` and `CARD_VIDEO` in `src/components/Features.tsx`.

Contact details live in one place: `src/config/contact.ts`.
