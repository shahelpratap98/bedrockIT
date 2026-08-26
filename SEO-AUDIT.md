# SEO Audit — bedrock-it.co.nz

Run 26 August 2026. Six parallel specialist passes (technical, content/E-E-A-T,
schema, performance, visual, search-experience) plus the GEO analysis from
earlier the same day. Every headline finding below was re-verified by hand
against the live site or the source before being written down.

## Status — 26 August 2026

Findings 1, 2, 3, 4, 5, 10, 14, 15 and 16 are **fixed and verified live**. The
score below is the audit as first run; re-estimated after those fixes it is
roughly **70/100**, with the remaining gap almost entirely in content depth,
on-page targeting and external brand presence rather than engineering.

Still open: 6, 7, 8, 9, 11, 12, 13, 17, 18, 19, 20 and everything under "Not a
code problem".

## SEO Health Score: 64/100 (as first measured)

| Category | Weight | Score | Weighted |
| --- | --- | --- | --- |
| Technical SEO | 22% | 72 | 15.8 |
| Content Quality | 23% | 58 | 13.3 |
| On-Page SEO | 20% | 66 | 13.2 |
| Schema | 10% | 65 | 6.5 |
| Performance | 10% | 52 | 5.2 |
| AI Search Readiness | 10% | 65 | 6.5 |
| Images | 5% | 60 | 3.0 |
| **Total** | | | **63.6 → 64** |

The foundations are genuinely strong — fully prerendered, clean URLs, valid
schema, 110–150 ms TTFB, real portfolio, real reviews. The score is held down by
three things fixable in a day, and one that is not a code problem at all.

---

## Critical

### 1. Every nonexistent URL returns HTTP 200 pretending to be the homepage

`vercel.json` rewrites `/((?!api/).*)` to `/index.html`. So:

    GET /this-does-not-exist          -> 200, homepage HTML
    GET /wp-sitemap.xml               -> 200, homepage HTML
    GET /Services/Website-Development -> 200, homepage HTML

Each serves the homepage title and `<link rel="canonical" href="https://www.bedrock-it.co.nz/">`.
The React 404 route exists but never gets a prerendered shell — `dist/404.html`
is not built.

Crawlers therefore see an unlimited supply of distinct URLs that all return 200
and all canonicalise to the homepage. That is the textbook soft-404 pattern. It
burns crawl budget on a site that needs every crawl it can get, and a mistyped
or stale inbound link silently succeeds instead of failing honestly.

**Fix:** scope the rewrite to the 11 real routes, prerender a real `404.html`,
return HTTP 404 with `X-Robots-Tag: noindex`.
**Failure check:** `curl -o /dev/null -w "%{http_code}" .../nope` still returns 200.
**Leading indicator:** GSC "Crawled – currently not indexed" stops climbing.

### 2. The homepage hero video is 15.3 MB — and it is hotlinked from Higgsfield

    https://d8j0ntlcm91z4.cloudfront.net/user_38xzZ.../hf_20260405_170732_...mp4
    Content-Length: 16,092,112  (15.3 MB)
    autoplay loop muted playsinline — no poster, no preload

Two separate problems in one tag.

**Performance.** 15.3 MB autoplays on every homepage visit, plus 4.56 MB for the
card video — about 20.9 MB of eager video, roughly 99% of page weight, competing
for bandwidth with the JS bundle the LCP text is waiting on. On mobile this is
the single biggest thing between a visitor and first paint. It is also an
awkward look for a business whose pitch is fast, well-built websites.

**Availability.** The hero is served from Higgsfield's CloudFront bucket under a
generation ID in their user namespace. You do not control that URL. If they
rotate, expire or clean up that object, your homepage hero goes black — no
warning, and no deploy of yours to explain it.

**Fix:** self-host both videos under `/media/`, re-encode the hero under 2 MB
(shorter loop, lower bitrate, WebM/AV1 + H.264 fallback), add a `poster`, set
`preload="none"` and attach the source after first paint.
**Failure check:** homepage transfer size stays above ~3 MB.

### 3. The LCP text is invisible until JavaScript runs

The `<h1>` ships as:

    <h1 ...><span style="opacity:0;transform:translateY(20px)">BedRock</span> ...</h1>

288 elements on the homepage carry an inline `opacity:0`. The text is in the
HTML — good for crawlers — but it does not *paint* until the bundle downloads,
parses, executes and the reveal animation fires. LCP is gated behind hydration
rather than HTML parse, on a page simultaneously pulling 20.9 MB of video.

**Fix:** render above-the-fold headings visible by default; scope the pull-up
animation to below-the-fold content.
**Failure check:** the h1 still carries `opacity:0` in view-source.

---

## High

| # | Finding | Evidence | Fix |
| --- | --- | --- | --- |
| 4 | **No CTA above the fold on any service page** | The template's only `BookCallButton` sits in the outcomes block — top ≈3982 px desktop, ≈4871 px mobile (~6 screens). Shared template, so all four spokes including the money page. | Add a CTA directly under the service hero intro. |
| 5 | **No `og:image` anywhere** | `public/` holds only `media/`; no `og-image.*`, so the build's resolver emits nothing. Live: 0 `og:image` tags. | Add a 1200×630 `public/og-image.jpg`; the build wires it automatically. |
| 6 | **Price is not in the title tag** | Competitor `digitalcandy.co.nz` ranks for "cheap website nz" with "Websites from $350" — the identical price position — in its title. Yours is in an FAQ six sections down. | Test `Custom Websites From $350 — Website Development NZ`. |
| 7 | **No proof embedded on service pages** | `/projects` has 7 live client sites but is reachable only from nav/footer. Service pages contain zero `<img>`. | Embed 3–4 project thumbnails above the FAQ. |
| 8 | **Personal Gmail as the business contact** | `shahel.pratap98@gmail.com` in the footer and in Organization schema on every page. | Move to `hello@bedrock-it.co.nz`. |
| 9 | **Founding narrative is unverified** | `/our-story` opens "2019 — Two engineers and a van"; service copy says "our engineers", "a team". Contact details and both reviews indicate one person. This copy was generated during the build and never checked against fact. | Rewrite to the true story. |
| 10 | **No security headers** | Only HSTS (without `includeSubDomains`/`preload`). No CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy. `Access-Control-Allow-Origin: *` on HTML. | Add a `headers` block to `vercel.json`. |

---

## Medium

| # | Finding | Fix |
| --- | --- | --- |
| 11 | Three service pages under the 800-word topical floor (managed-it-support 615, cyber-security 627, cloud-migration 725) | Expand with a worked example and objection handling, mirroring website-development (837) |
| 12 | "Auckland" and "New Zealand" appear zero times on three service pages, though all 7 portfolio clients are Auckland businesses | Add location context to each intro and meta description |
| 13 | Zero contextual in-body internal links — every page carries the same 12-link nav/footer set | Link service pages to the relevant project, and to /support |
| 14 | Trailing-slash URLs return 200 rather than redirecting | 308 to the canonical non-slash form |
| 15 | `/media/*` served `max-age=0, must-revalidate` while `/assets/*` gets a year | Long-cache rule for hashed media |
| 16 | First `/projects` screenshot is `loading="lazy"` — likely the LCP candidate | `loading="eager" fetchpriority="high"` on the first card only |
| 17 | No BreadcrumbList, Service or WebSite schema; Organization has no `logo` | Add per the schema pass snippets |
| 18 | `http://bedrock-it.co.nz` takes two hops to reach `https://www.` | Collapse to one |
| 19 | Meta descriptions over 155 chars: cyber-security 172, cloud-migration 161 | Trim |
| 20 | Nav tap targets ~11 px tall on mobile, well under the 48 px minimum | Increase hit area |

---

## Low

Sitemap has no `<lastmod>`. No favicon, apple-touch-icon or manifest. Duplicate
H2 "Tired of IT that only gets attention when it breaks?" on all 10 pages. No
blog or evergreen resource content. `telephone` in schema is not strict E.164.
Card body copy at 6.3:1 contrast — passes AA, worth watching if the palette
darkens.

Two things flagged by agents and dismissed after checking: the "Last updated"
date is a hardcoded literal in `services.ts`, not `new Date()` (the only
`new Date()` is the footer copyright year); and FAQPage schema stays as-is —
Google retired FAQ rich results in May 2026, so it earns no SERP feature, but
removal buys nothing either.

---

## Not a code problem

The GEO pass found the real ceiling: **"BedRock IT" has no external footprint.**
A web search returns a NZ business-systems SaaS, a NZ safety consultancy, Amazon
Bedrock, Bedrock Linux and Minecraft — not this business. Brand mentions
correlate roughly 3× more strongly with AI citation than backlinks (Ahrefs,
Dec 2025, 75k brands).

No on-site work substitutes for a LinkedIn company page, NZ directory listings
(Yellow, Finda, NoCowboys) with identical name and phone, and a Google Business
Profile carrying the reviews you already have.

---

## Suggested order

Sequenced by dependency and by what touches revenue first.

1. ~~`og:image`~~ — done (#5)
2. ~~Service-page CTA above the fold~~ — done, 378 px on a 375×812 phone (#4)
3. ~~Self-host and compress the videos~~ — done, 20.9 MB eager → 0 (#2)
4. ~~Scope the rewrite, ship a real 404~~ — done, unknown paths return 404 (#1)
5. ~~Un-hide the LCP text~~ — done, hero renders with JS disabled (#3)
6. ~~Security headers~~ — done, minus HSTS (see below) (#10)
7. Correct the origin story and the business email (#8, #9)
8. Price in the title, proof on the page (#6, #7)
9. External presence — LinkedIn, directories, GBP (yours, not code)

### Deliberately not done

**HSTS `includeSubDomains` + `preload`** (#5 in the original Medium list).
Both are easy to add and unpleasant to reverse: `includeSubDomains` forces
HTTPS on every subdomain, including any that does not serve it yet, and
`preload` bakes the domain into a list shipped inside browsers. That is a
decision to make deliberately with knowledge of every subdomain in use, not a
default to apply from an audit.

**A stricter CSP.** The policy shipped carries `'unsafe-inline'` in
`script-src`, because the gtag and Meta pixel bootstraps are inline and this is
a static site with no server to mint nonces. That limits its value against XSS;
what it does still buy is `object-src 'none'`, `base-uri`, `form-action`,
`frame-ancestors` and `upgrade-insecure-requests`. Tightening it properly means
moving those snippets out of the HTML.
