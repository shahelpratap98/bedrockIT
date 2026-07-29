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

## Before going live

- **Contact form has no backend.** `handleSubmit` in `src/pages/Contact.tsx` opens the
  visitor's mail client via `mailto:`, which fails silently for webmail users. Point it at
  a form endpoint instead.
- **Response targets are placeholders.** The P1–P4 figures in `src/pages/Support.tsx` read
  as contractual commitments — replace them with the real numbers.
- **SPA routing needs a host rewrite.** All routes must fall back to `index.html`
  (Netlify `_redirects`, `vercel.json`, or the `404.html` copy trick on GitHub Pages),
  otherwise deep links 404 on refresh.
- **Media is placeholder.** The hero and feature-card videos are stock; swap `HERO_VIDEO`
  in `src/components/Hero.tsx` and `CARD_VIDEO` in `src/components/Features.tsx`.

Contact details live in one place: `src/config/contact.ts`.
