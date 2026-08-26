# GEO Analysis — bedrock-it.co.nz

Analysed 26 August 2026 against Google's AI-optimization guidance (GEO = SEO
fundamentals applied to AI surfaces). Checks run live against the production
site, robots.txt, schema output and web brand-mention search.

## GEO Readiness Score: 55/100

| Criterion | Weight | Score | Notes |
| --- | --- | --- | --- |
| Citability | 25 | 14 | Good self-contained blocks and FAQs on service pages; no data points, no dates |
| Structural readability | 20 | 16 | Clean h1→h2→h3, question-based FAQ headings, lists, short paragraphs |
| Multi-modal | 15 | 6 | Video on home, screenshots on /projects; service pages are text-only |
| Authority & brand signals | 20 | 4 | No dates, no bylines, zero external brand presence, crowded entity name |
| Technical accessibility | 20 | 15 | Fully prerendered, all AI crawlers allowed, FAQPage schema; no Organization schema |

## Platform breakdown

| Platform | Outlook | Why |
| --- | --- | --- |
| Google AI Overviews | Weak for now | AIO citations correlate with classic rankings; the site is new and barely ranks yet. The prerendered, well-structured pages mean it can inherit visibility as rankings build. |
| Google AI Mode | Slightly better | Broader citation pool, freshness- and entity-weighted; needs dates and entity signals first. |
| ChatGPT | Very weak | ChatGPT leans on Wikipedia (47.9%) and entity presence — BedRock IT has none. |
| Perplexity | Very weak | Leans on Reddit (46.7%) — no presence. |

## AI crawler access: ✅ all allowed

`robots.txt` is `User-agent: * / Allow: /` with a sitemap. GPTBot, OAI-SearchBot,
ClaudeBot, PerplexityBot, Google-Extended all have access. Nothing to change
unless you want to block training crawlers (CCBot) — not recommended to bother.

## Technical rendering: ✅ strong (best asset)

Every route is prerendered to static HTML with per-page titles, descriptions,
canonicals and content in the markup. AI crawlers do not execute JavaScript, so
this is the single most important box and it is fully ticked.

One wrinkle: **/llms.txt returns HTTP 200 with the SPA's HTML** (the rewrite
sends every unknown path to index.html). Any AI fetcher requesting it gets a
misleading 200 + HTML instead of a 404. Same applies to every non-existent
path. Low priority, but either add a real llms.txt or exclude `.txt` paths from
the rewrite. Google ignores llms.txt entirely; it only matters for other
crawlers.

## Schema

- ✅ FAQPage on all four service pages (real Q&A content behind it)
- ❌ No Organization/LocalBusiness schema anywhere — the biggest gap, because…

## Brand & entity: the real problem

A web search for "BedRock IT" + the domain returns **no results for this
business at all** — instead: Bedrock (NZ business-systems SaaS), Bedrock
Solutions (NZ safety consultancy), Amazon Bedrock, Bedrock Linux, Minecraft
Bedrock. The name is heavily contested and the business has zero external
footprint (no LinkedIn company page, no directory listings, no Reddit/YouTube
mentions, no Wikipedia — the last is normal for a small business).

Ahrefs (Dec 2025, 75k brands): brand mentions correlate ~3x more strongly with
AI citations than backlinks. For a name this ambiguous, entity disambiguation
is the highest-leverage GEO work available.

## Content citability

Service pages are genuinely good: direct answers, question-based FAQ headings,
self-contained blocks near the optimal 134–167-word range. Weaknesses:

- No publication or updated dates anywhere (recency <3 months ≈ 3x citation
  likelihood; stale 6+ months loses eligibility)
- No author byline or Person schema
- No unique data points or specific figures (the one you own: **websites from
  $350** — publicly committed in ads and Messenger greeting, absent from the site)
- Home page copy is brand voice, not extractable answers (fine — the spokes are
  the citation surface)

## Top 5 highest-impact changes

1. **Organization schema, sitewide** — name, url, logo, telephone, email,
   areaServed NZ, `sameAs` → Facebook page (+ LinkedIn once it exists). Directly
   attacks the entity-ambiguity problem. (Code change — small.)
2. **Visible "Last updated" dates on service pages** + a habit of refreshing
   them quarterly. (Code change — small.)
3. **A price answer block** on the website-development page: "How much does a
   website cost in New Zealand?" answered in ~50 words including the from-$350
   figure. Specific, unique, exactly what AI engines quote. (Needs your price
   confirmation — already public in your ads.)
4. **LinkedIn company page + NZ directory listings** (Yellow, Finda, NoCowboys,
   localist) with identical name/address/phone. Cheapest external entity signals
   available. (Your action, not code.)
5. **Author byline + Person schema** on service pages ("Written by Shahel
   Pratap, BedRock IT") linking to the LinkedIn profile. (Code change once
   LinkedIn exists.)

## Quick wins already in place

- ✅ Prerendered HTML (SSR-equivalent)
- ✅ FAQ sections with clear Q&A on every spoke
- ✅ Question-based headings in FAQs
- ✅ Definition-style opener on About ("We are BedRock IT, a managed services team…")
- ✅ All AI crawlers allowed, sitemap live
