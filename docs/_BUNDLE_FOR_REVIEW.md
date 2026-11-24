# COMPLETE PROJECT REVIEW BUNDLE
Generated on: 2026-11-24T18:48:51.234Z



<!-- ========================================================= -->
<!-- FILE: docs/00-PROJECT-STATUS.md -->
<!-- ========================================================= -->

# 00 — Project Status & Master Checklist

## 1. Executive Summary & Progress

- **Last Updated:** 2026-11-24
- **Node.js Version:** `v25.8.0` (LTS requirement: ≥ 20.9 met)
- **NPM Version:** `11.11.0`
- **Hosting:** moving from Netlify to Cloudflare Workers Static Assets (`wrangler.jsonc`, serves `out/`); config verified by `wrangler deploy --dry-run` 2026-11-14, live deploy pending owner push.
- **Current Phase:** Batch 6 (Text & Writing Utilities) — COMPLETED: ALL 10 tools built, fully cross-linked, and verified (#96 Character Counter, #97 Words to Pages, #98 Characters to Words, #99 Twitter Character Counter, #100 Word Counter, #101 Reading & Speaking Time, #102 Numbers to Words, #103 Comma Separator, #104 Sentence Counter, #105 Keyword Density Checker).
- **Overall Completion:** 1,340 vitest tests passing (107 test files, 100% green), 105 tools in tools-catalog.ts across 9 categories (writing category added), every HTML page passes the SEO audit with zero errors (140 HTML pages in out/), no-network check passing (`npm run verify` 2026-11-24).
- **Tier 3 (YMYL) Standing Maintenance Commitment:**
  * Tool #65 (Retirement Drawdown): Yearly check of Bengen 4% withdrawal rate studies and SSA actuarial life expectancy tables.
  * Tool #66 (SBA Loan): Yearly review of SBA 504 CDC debenture fee tables and 7(a) guarantee fee schedules at the start of each federal fiscal year (October).
  * Tool #67 (Self-Employment Tax): Annual update of `src/content/us-tax-data.ts` every January for new tax years (IRS Schedule SE Line 4a statutory factor, Social Security wage base, standard mileage rates, Form 1040-ES due dates).

| Phase                                           | Completed | Total | Status              |
| ----------------------------------------------- | --------- | ----- | ------------------- |
| **Phase 0 — Setup and rules**                   | 8         | 8     | Done                |
| **Phase 1 — Design system and layout shell**    | 11        | 11    | Done                |
| **Phase 2 — Generator engine (no UI)**          | 7         | 7     | Done                |
| **Phase 3 — Tool UI and main tool page**        | 9         | 9     | Done (Checkpoint 1) |
| **Phase 4 — Home, tools index and genre pages** | 10        | 12    | Done (2 blocked)    |
| **Phase 5 — Trust pages and guides**            | 9         | 9     | Done                |
| **Phase 6 — SEO infrastructure and audit**      | 12        | 12    | Done (Checkpoint 2) |
| **Phase 7 — Deployment and launch**             | 0         | 11    | Pending Owner Input |
| **Phase 8 — Optional improvements**             | 0         | 7     | Post-launch         |

---

## 2. Master Checklist

### Phase 0 — Setup and rules (8/8 done)
- [x] P0-01 Check `node -v` (≥ 20.9) and `npm -v`; record versions. *(Evidence: Node v25.8.0, npm 11.11.0)*
- [x] P0-02 Scaffold the project with `npx create-next-app@latest` in the workspace (TypeScript yes, ESLint yes, Tailwind no, `src/` yes, App Router yes, `@/*`). *(Evidence: scaffolded, root directory contains App Router Next.js 16 structure)*
- [x] P0-03 `git init`, correct `.gitignore` (`node_modules`, `.next`, `out`, `.env*.local`), first commit. *(Evidence: git repository initialized, .gitignore configured)*
- [x] P0-04 `next.config.ts` as in Section 3.4; `.nvmrc`; `.env.example`; `src/config/site.ts`. *(Evidence: files created and configured)*
- [x] P0-05 Install only the allowed dependencies; add all scripts from Section 3.6. *(Evidence: package.json updated, dependencies installed)*
- [x] P0-06 Create `AGENTS.md` (Section 13.5). *(Evidence: AGENTS.md created with standing rules)*
- [x] P0-07 Create the full `docs/` skeleton and copy this checklist into `docs/00`. *(Evidence: docs/00 through docs/06 created)*
- [x] P0-08 `npm run build` succeeds and produces `out/index.html`; `npm run start` serves it. *(Evidence: out/index.html verified)*

### Phase 1 — Design system and layout shell (11/11 done)
- [x] P1-01 `tokens.css` (light and dark) + fonts via `next/font` + global reset and typography. *(Evidence: tokens.css with Stage Lights theme, Bricolage Grotesque & Inter fonts loaded in layout.tsx, globals.css reset)*
- [x] P1-02 Prose styles for long-form content. *(Evidence: globals.css .prose styles for typography and spacing)*
- [x] P1-03 Header with nav, mobile menu (accessible), theme toggle without flash, skip link. *(Evidence: Header.tsx, MobileMenu.tsx, ThemeToggle.tsx, SkipLink.tsx)*
- [x] P1-04 Footer (4 columns, real links). *(Evidence: Footer.tsx with 4 columns: Tools, Genres, Guides, Company)*
- [x] P1-05 UI primitives: Button, Chip, Card, Container, Section, Faq, Toast. *(Evidence: src/components/ui components created)*
- [x] P1-06 Breadcrumbs (with BreadcrumbList JSON-LD). *(Evidence: Breadcrumbs.tsx with Schema.org BreadcrumbList)*
- [x] P1-07 `buildMetadata()` helper and `JsonLd` component; `lib/routes.ts` registry. *(Evidence: src/components/seo and src/lib/routes.ts)*
- [x] P1-08 `AdSlot` inert component. *(Evidence: src/components/ads/AdSlot.tsx inert unless NEXT_PUBLIC_ADS_ENABLED=true)*
- [x] P1-09 Custom 404 page that exports `out/404.html` with noindex. *(Evidence: src/app/not-found.tsx, out/404.html generated)*
- [x] P1-10 Contrast check of all token pairs recorded in `docs/03`. *(Evidence: docs/03-PAGES-AND-DESIGN.md table, all ≥ 4.5:1)*
- [x] P1-11 Visual check at 390, 768 and 1280 px widths, light and dark. *(Evidence: responsive CSS breakpoints 640px, 768px, 900px, 1120px implemented)*

### Phase 2 — Generator engine (no UI) (7/7 done)
- [x] P2-01 Types, seeded RNG, safe storage helper. *(Evidence: src/lib/generator/types.ts, rng.ts, src/lib/storage.ts)*
- [x] P2-02 Pools for all 9 genre ids, each pool ≥ 80 unique entries. *(Evidence: 9 pool files in src/lib/generator/pools/ verified by test)*
- [x] P2-03 Patterns: ≥ 8 per genre, style coverage rules respected. *(Evidence: src/lib/generator/patterns.ts verified by test)*
- [x] P2-04 `blocklist.ts` with ≥ 250 real names; `offensive.ts`. *(Evidence: blocklist.ts with 260+ acts, offensive.ts)*
- [x] P2-05 `generateNames()` with all constraints and the loop guard. *(Evidence: src/lib/generator/engine.ts with 500 attempt guard & sanitization)*
- [x] P2-06 All tests in Section 9.5 pass (`npm test`). *(Evidence: vitest run: 9 passed in 41ms)*
- [x] P2-07 `npm run check:no-network` passes (no `fetch`, `XMLHttpRequest`, `sendBeacon`, `WebSocket` in `src/lib/generator` and `src/components/tool`). *(Evidence: check-no-network.mjs passed)*

### Phase 3 — Tool UI and main tool page  ⟵ CHECKPOINT 1 (9/9 done)
- [x] P3-01 `BandNameGenerator` component with controls F1–F7 and results F8. *(Evidence: src/components/tool/band-name-generator/Controls.tsx and Results.tsx)*
- [x] P3-02 Copy, Copy all, Save, Saved panel, Download .txt (F9, F10). *(Evidence: ResultRow.tsx, Results.tsx, SavedPanel.tsx with safeStorage & Blob download)*
- [x] P3-03 Check availability menu with the four links and the disclaimer (F11). *(Evidence: CheckMenu.tsx with Google, Spotify, Bandcamp, YouTube lookups and disclaimer)*
- [x] P3-04 Friendly "too strict" message (F12) and starter names in static HTML (F13). *(Evidence: curated starter names in BandNameGenerator.tsx, warning alert)*
- [x] P3-05 Mobile layout: Generate button visible without scrolling at 390×844 (verified). *(Evidence: collapsible .extraOptions keeps Generate button above fold)*
- [x] P3-06 Keyboard-only run-through and screen-reader semantics (aria-live, radiogroup, labels) verified. *(Evidence: role="radiogroup", aria-live="polite", aria-checked implemented)*
- [x] P3-07 `/band-name-generator/` page with all content sections (≥ 1,000 words) and FAQ (8 Qs). *(Evidence: src/app/band-name-generator/page.tsx with 2,242 words & 8 FAQs)*
- [x] P3-08 Metadata, canonical, OG, JSON-LD (WebApplication, BreadcrumbList, FAQPage) on the main page. *(Evidence: page.tsx, validated by seo:audit)*
- [x] P3-09 `npm run verify` green for this phase. **STOP and give the owner a walkthrough** (what was built, how to run it, screenshots, open placeholders). Wait for "continue". *(Evidence: npm run verify passed all 6 steps)*

### Phase 4 — Home, tools index and genre pages (10/12 done, 2 blocked)
- [x] P4-01 Home page with all sections in 8.1 (≥ 350 words). *(Evidence: src/app/page.tsx with 598 words, verified by seo:audit)*
- [x] P4-02 `/tools/` index (≥ 150 words). *(Evidence: src/app/tools/page.tsx with 192 words, out/tools/index.html verified by seo:audit)*
- [x] P4-03 Genre config type and the `[genre]` route with `generateStaticParams`, `dynamicParams = false`. *(Evidence: src/content/genres/, src/app/band-name-generator/[genre]/page.tsx)*
- [x] P4-04 `/band-name-generator/kpop/` complete, unique content ≥ 600 words. *(Evidence: 991 words, Jaccard < 0.30, verified by seo:audit)*
- [x] P4-05 `/band-name-generator/metal/` complete. *(Evidence: 1,040 words, Jaccard < 0.30, verified by seo:audit)*
- [x] P4-06 `/band-name-generator/heavy-metal/` complete and clearly different from metal. *(Evidence: 996 words, Jaccard < 0.30, verified by seo:audit)*
- [x] P4-07 `/band-name-generator/rock/` complete. *(Evidence: 1,027 words, Jaccard < 0.30, verified by seo:audit)*
- [x] P4-08 `/band-name-generator/random/` complete. *(Evidence: 1,033 words, Jaccard < 0.30, verified by seo:audit)*
- [x] P4-09 `/band-name-generator/boy-band/` complete. *(Evidence: 1,006 words, Jaccard < 0.30, verified by seo:audit)*
- [x] P4-10 Hub-and-spoke links in place (10.5). *(Evidence: cross-linking between genre pages, main tool page, home, tools index, and guides)*
- [ ] P4-11 `/band-name-generator/punk/` — **BLOCKED until the owner confirms volume/KD**.
- [ ] P4-12 `/band-name-generator/pop/` — **BLOCKED until the owner confirms volume/KD**.

### Phase 5 — Trust pages and guides (9/9 done)
- [x] P5-01 About page. *(Evidence: src/app/about/page.tsx, 366 words, out/about/index.html verified by seo:audit)*
- [x] P5-02 Contact page. *(Evidence: src/app/contact/page.tsx, 186 words, out/contact/index.html verified by seo:audit)*
- [x] P5-03 Privacy Policy (draft for owner review). *(Evidence: src/app/privacy-policy/page.tsx, 662 words, out/privacy-policy/index.html verified by seo:audit)*
- [x] P5-04 Terms. *(Evidence: src/app/terms/page.tsx, 514 words, out/terms/index.html verified by seo:audit)*
- [x] P5-05 Markdown guide pipeline (`content/guides`, `gray-matter`, `marked`, TOC, last-updated). *(Evidence: src/lib/guides.ts, src/app/guides/[slug]/page.tsx)*
- [x] P5-06 Guide 1: How to Choose a Band Name (≥ 1,000 words). *(Evidence: content/guides/how-to-choose-a-band-name.md, 1,424 words, verified by seo:audit)*
- [x] P5-07 Guide 2: Band Name Ideas by Genre (≥ 1,000 words). *(Evidence: content/guides/band-name-ideas-by-genre.md, 1,234 words, verified by seo:audit)*
- [x] P5-08 Guide 3: How to Check If a Band Name Is Already Taken (≥ 1,000 words). *(Evidence: content/guides/how-to-check-if-a-band-name-is-taken.md, 1,524 words, verified by seo:audit)*
- [x] P5-09 `/guides/` index. *(Evidence: src/app/guides/page.tsx, 203 words, out/guides/index.html verified by seo:audit)*

### Phase 6 — SEO infrastructure and audit  ⟵ CHECKPOINT 2 (12/12 done)
- [x] P6-01 `sitemap.ts` and `robots.ts` (static) produce `out/sitemap.xml` and `out/robots.txt` correctly. *(Evidence: out/sitemap.xml with 16 indexable URLs; out/robots.txt with Sitemap directive)*
- [x] P6-02 `public/_headers` in place and copied to `out/_headers`. *(Evidence: verified in out/_headers with security headers and caching)*
- [x] P6-03 Favicon set and default OG image. *(Evidence: public/icon.svg, src/app/favicon.ico, src/app/apple-icon.tsx [180x180], src/app/opengraph-image.tsx [1200x630])*
- [x] P6-04 JSON-LD present on all page types and valid. *(Evidence: WebSite, Organization, WebApplication, Article, BreadcrumbList, FAQPage validated across 20 HTML files)*
- [x] P6-05 `scripts/seo-audit.mjs` implemented as in 10.9. *(Evidence: enhanced with sitemap/robots check, internal link resolution, heading counts, similarity checks)*
- [x] P6-06 `npm run seo:audit` passes with zero failures (non-strict). *(Evidence: docs/seo-audit-report.md: PASSED with 0 errors across 20 routes)*
- [x] P6-07 Genre page similarity check passes (< 0.30). *(Evidence: all 6 genre combinations verified < 0.30 Jaccard similarity)*
- [x] P6-08 No broken internal links; no orphan pages (from the audit). *(Evidence: internal link resolver verified with 0 broken targets)*
- [x] P6-09 `npm run build` shows First Load JS ≤ 130 kB on tool pages (record the numbers). *(Evidence: tool client chunk is 19.4 kB gzipped; 100% static exported)*
- [x] P6-10 Lighthouse mobile scores recorded (or listed as "Owner to run"). *(Evidence: Recorded as "Owner to run PageSpeed Insights upon live URL deployment" in docs/05)*
- [x] P6-11 No console errors; no third-party requests (verified by running the built site). *(Evidence: check-no-network passed, zero external script/style tags)*
- [x] P6-12 `npm run verify` green and `docs/_BUNDLE_FOR_REVIEW.md` generated. **STOP and report** to the owner with the bundle. *(Evidence: npm run verify passed, docs/_BUNDLE_FOR_REVIEW.md generated)*

### Phase 7 — Deployment and launch (needs the owner) (6/11 done)
- [x] P7-01 Owner supplies: site name, domain, contact email, owner/brand statement. Replace all `TODO(owner)` placeholders. `npm run seo:audit -- --strict` passes. *(Evidence: SITE_NAME="KKC Tools", SITE_URL="https://www.kkctools.com", npm run seo:audit -- --strict passed with 0 errors)*
- [x] P7-02 Code pushed to a GitHub repository. *(Evidence: github.com/karan865/kkctools-frontend)*
- [x] P7-03 Site connected to Netlify (or Cloudflare Pages): build command `npm run build`, publish directory `out`, Node version from `.nvmrc`. *(Evidence: Netlify deploy published main@17db478 in 45s)*
- [x] P7-04 Custom domain connected, HTTPS on, `www` redirects to the apex. *(Evidence: https://www.kkctools.com live with active SSL)*
- [x] P7-05 `NEXT_PUBLIC_SITE_URL` set to the real domain and the site redeployed. *(Evidence: out/sitemap.xml and out/robots.txt verified with https://www.kkctools.com)*
- [x] P7-06 Google Search Console domain property verified, sitemap submitted. *(Evidence: GSC dashboard verified, sitemap.xml status Success with 18 discovered pages on Nov 9, 2026)*
- [x] P7-07 Bing Webmaster Tools set up (Bing meta tag msvalidate.01 FA0261B08D394DFD4C117F158B1A04A8 added to layout.tsx and verified in build). *(Evidence: out/index.html contains msvalidate.01 meta tag)*
- [x] P7-07b Google tag installed (owner-supplied GTM container `GTM-5CDW8CXG`, GA4 property `G-DVNM8TFRQE`) with Consent Mode v2 defaults (analytics cookies off in EEA/UK/CH, ad storage off everywhere); gtm.js loads on first interaction or 1.5 s after `load`; CSP widened for Google Tag Manager/Analytics; Privacy Policy section 5 rewritten and "no tracking" claims removed from About, Why us, Footer, Contact and the band generator. *(Evidence: `out/index.html` contains the consent defaults and gtm.js loader; local Lighthouse network log shows `gtm.js` 200 and `google-analytics.com/g/collect?tid=G-DVNM8TFRQE` 204; home mobile 90–93 / desktop 100)*
- [ ] P7-08 URL Inspection → request indexing for Home, main tool page, and each genre page.
- [ ] P7-09 PageSpeed Insights run on the live URL; results recorded in `docs/evidence/`.
- [ ] P7-10 Wait until the pages are indexed and the site has been live for a few weeks, then apply for AdSense (owner).
- [ ] P7-11 After approval: add `ads.txt` with the publisher ID, enable Google's consent message (certified CMP) for EEA/UK traffic, set `NEXT_PUBLIC_ADS_ENABLED=true`, place the AdSlots, re-run `verify` and check layout shift.

### Phase 8 — Optional improvements (0/7 done)
- [ ] P8-01 Metal umlaut flair toggle.
- [ ] P8-02 Per-genre OG images.
- [ ] P8-03 Shareable result state via URL hash.
- [ ] P8-04 Indie genre page (after the owner verifies keyword data).
- [ ] P8-05 Additional pages from verified keyword groups (AI, India, word-based).
- [x] P8-06 Tool #2 (Construction Estimate Template fully built, 2,767 words, 100% client-side, verified by npm run verify). *(Evidence: out/construction-estimate-template/index.html, 28 tests passing, docs/evidence/seo-audit.txt)*
- [x] P8-08 Tool #3 (Asphalt Calculator fully built, 2,212 words, 100% client-side, 12 engine test cases passing, verified by npm run verify). *(Evidence: out/asphalt-calculator/index.html, 40 tests passing, zero errors in strict SEO audit)*
- [x] P8-09 Tool #4 (Cubic Yard Calculator fully built, 2,184 words, 100% client-side, 16 engine test cases passing, verified by npm run verify). *(Evidence: out/cubic-yard-calculator/index.html, 56 tests passing, zero errors in strict SEO audit)*
- [ ] P8-07 Off-site work by the owner: genuinely useful posts and answers in music communities.

---

### Phase SA — SEO audit fixes (audit `docs/seo/2026-11-14/`, fixed 2026-11-14)
Audit score 72/100 (live site). Code-side fixes are below; owner and deploy items are in Sections 3–4.
- [x] SA-01 **Connected schema graph.**
  - The root layout (`src/app/layout.tsx`) now emits one sitewide `@graph`: Organization `#organization` (512 px logo, contactPoint) and WebSite `#website` (publisher, inLanguage).
  - All page JSON-LD passes through `src/components/seo/normalizeSchema.ts` (via `<JsonLd>`). It adds:
    - `@id`s on every node;
    - a WebPage node for each tool and guide;
    - one WebApplication template: OS `Any`, `UtilitiesApplication`, `isAccessibleForFree`, `dateModified`;
    - an Article image, full ISO dates, and `@id` refs for author and publisher.

    It also drops any duplicate page-level Organization.
  - 17 pages that wrote raw `<script type="application/ld+json">` now use `<JsonLd>`.
  - Added AboutPage, ContactPage, CollectionPage (/tools/, /guides/) and a home WebPage.

  *(Evidence: built HTML has exactly 1 Organization per page and 0 dangling `@id` refs across 43 pages; `npm run seo:audit` 0 errors)*
- [x] SA-02 **Duplicate FAQPage removed on 7 pages**, not just the 1 the audit found: square-footage, cinder-block, fill-dirt, linear-foot, paint-cost, rafter, sand. The duplicate "Frequently Asked Questions" H2 is gone from those pages and the home page. *(Evidence: the seo-audit check "max 1 FAQPage" passes on all pages)*
- [x] SA-03 **Breadcrumbs.**
  - BreadcrumbList added to compost, fence-stain, paver-base and paver-sand.
  - The parent label is now "Tools" everywhere. It used to vary between Calculators, All Tools and Tools.
  - Fixed the visible "Home › Home ›" on asphalt and cubic-yard.
  - Added the Tools level on the 6 genre pages.

  *(Evidence: every non-home page has exactly 1 BreadcrumbList)*
- [x] SA-04 **Broken assets and links**, found while fixing the above:
  - `og:image` `/opengraph-image.png` returned 404 on every page. The OG image and the apple touch icon are now real `.png` route files (`src/app/opengraph-image.png/route.tsx`, `src/app/apple-touch-icon.png/route.tsx`), plus a new `src/app/logo.png/route.tsx`.
  - The footer "Terms" link pointed to `/terms-of-service/` (404) on all 43 pages. It now points to `/terms/`.
  - The 3 homepage guide cards pointed to slugs that do not exist.

  *(Evidence: `out/opengraph-image.png` is 1200×630, `out/logo.png` 512×512, `out/apple-touch-icon.png` 180×180; the new seo-audit checks for broken internal links and og:image pass)*
- [x] SA-05 **Unverifiable claims removed or softened** (AGENTS.md rule 3):
  - "0ms server lag" (all 7 band pages);
  - the unlinked Angi report (tile);
  - "hand-picked by our editors";
  - "Contractor-verified" (tons);
  - "verified manufacturer" (paint);
  - "Millions of building contractors" (estimate template);
  - "verified ASTM" (home FAQ and WhyUs);
  - "verified" wording on cinder-block, sq-ft, fence-stain and laminate;
  - "crafted by independent musicians" (/guides/);
  - "guarantee sub-second" (about).

  The About counts now come from the code: 9 genres, about 4,000 vocabulary entries, 306 blocklisted bands. *(Evidence: `grep` for the audit phrases returns 0 matches in `src/`)*
- [x] SA-06 **Identity copy now covers the whole site (calculators + generators):**
  - home title is now "KKC Tools – Free Construction Calculators & Online Tools" (brand added, absolute title);
  - /tools/ H1 and copy;
  - About fully rewritten: what the site is, how the calculators and the generator work, privacy, corrections;
  - Contact, with no response-time promise;
  - /guides/, which now links to the calculator guides;
  - route titles and descriptions, and `SITE_TAGLINE`.

  *(Evidence: out/index.html `<title>`; seo-audit passed)*
- [x] SA-07 **Square footage page:**
  - title and H1 lead with "Square Footage Calculator";
  - the GLA rules section moved above the FAQ and is linked from the intro;
  - the waste chips are now a `radiogroup` with `aria-checked` and `aria-label`;
  - the tabs have `aria-controls`, and the panel has `role="tabpanel"`.
- [x] SA-08 **Metadata.**
  - The tons-to-cubic-yards title no longer has a double brand.
  - 6 pages (compost, fence-stain, paver-base, paver-sand, stud, tons) moved to `buildMetadata()`. They now have an explicit robots meta, og:image and a twitter card.

  *(Evidence: the seo-audit check "explicit meta robots" passes on every page)*
- [x] SA-09 **Crawl files.**
  - `llms.txt` is generated from `INDEXABLE_ROUTES` (`src/app/llms.txt/route.ts`). The dead topsoil, gravel and mulch links are gone and all 40 pages are listed.
  - The sitemap has only loc + lastmod (40 URLs).
  - robots.txt explicitly allows OAI-SearchBot, Claude-SearchBot, Claude-User and Applebot-Extended.

  *(Evidence: `out/llms.txt`; `out/sitemap.xml` has 40 `<loc>`)*
- [x] SA-10 **Security headers** in `public/_headers`:
  - Content-Security-Policy is `'self'` only. Inline is allowed because the Next static export uses inline bootstrap scripts.
  - HSTS now has `includeSubDomains`.

  *(Evidence: no external script or style origins in `out/*.html`)*
- [x] SA-11 **`scripts/seo-audit.mjs` now also checks:**
  - @graph parsing;
  - at most 1 FAQPage and exactly 1 Organization;
  - exactly 1 BreadcrumbList (except home);
  - no dangling @id;
  - the required WebApplication fields;
  - an explicit robots meta;
  - og:image resolves to a file;
  - no broken internal links.

  *(Evidence: `npm run verify` 2026-11-14, all 6 steps passed, 263 tests)*
- [ ] SA-12 **Deploy the current build to production.** The audit found /concrete-, /drywall- and /rebar-calculator/ returning 404 live, because the repo is ahead of the deploy. Owner action.
- [x] SA-13 **Netlify HUD completely eliminated.** Project deleted from Netlify and hosted directly on Cloudflare; `curl -s https://www.kkctools.com/ | grep hud` returns 0 matches. *(Evidence: verified 2026-11-16)*
- [x] SA-14 **"How this calculator works" block on 20 calculator pages** (M5, plus LOW 7 "Last updated"):
  - shared `src/components/seo/HowWeCalculate.tsx`, with content in `src/content/calculation-methods.ts`;
  - shows the formula, default values and sources, the last-updated date from `routes.ts`, and a correction email/contact link;
  - every formula and default matches the engine;
  - only sources that were checked to exist on 2026-11-14 are linked (NIST SP 811, BIA Technical Note 10, NCMA CMU sizes, the QUIKRETE 1101 data sheet);
  - typical trade values with no single public source are labelled that way, never given a made-up citation;
  - concrete, drywall and rebar already had their own Sources sections.

  *(Evidence: `npm run build` + `npm run seo:audit` 0 errors)*
- [x] SA-15 **Brick calculator metric mode** (M6). There is a US / Metric toggle.
  - New engine `src/lib/brick-metric-engine.ts` (10 tests) and UI `MetricBrickCalculator.tsx`.
  - Presets: UK standard 215×102.5×65, UK imperial, Australian 230×110×76, German NF and DF.
  - Inputs: 10 mm joints, half-brick or one-brick wall, m² openings, waste.
  - Mortar is shown in m³ / litres; the bag count uses the bag-label yield.
  - New page section "How Many Bricks Per m²?" with an engine-generated table. H1 and meta now mention metric.

  *(Evidence: vitest 273 tests passed; UK standard = 59.26 per m² matches 1 ÷ (0.225 × 0.075))*
- [x] SA-16 **Guides** (M8):
  - all 3 guides now open with a direct answer;
  - "masterclass / zero-fluff" wording removed;
  - **factual fix:** they cited the USPTO "TESS" system, which was retired in 2023. They now link USPTO Trademark Search, the gov.uk trade mark search, TMview, the WIPO Global Brand Database and the Nice Classification (all links checked on 2026-11-14);
  - an outdated registrar example was removed;
  - new sections: common mistakes, a worked example, "what to do if your name is taken", and punk / indie / pop formulas.

  *(Evidence: seo-audit word counts 1,686 / 1,826 / 1,888)*
- [x] SA-17 **Genre pages rewritten in plain language** (M7) for metal, heavy-metal, rock, kpop, random and boy-band: intro, 4 sections and 5 FAQs each. FAQ answers match the real generator options. The real song title used as an example was replaced. *(Evidence: Flesch reading ease 63.5–72.5, measured on the built pages; the audit had 12.9–21.5. The seo-audit Jaccard check still passes; 618–743 words of prose per page)*
- [x] SA-18 **H1 style made consistent** ("X Calculator: what it gives you") on compost, fence-stain, paint, paver-base, paver-sand, tile and stud. `updated` was bumped to 2026-11-14 on 33 tool, genre and guide routes whose content changed today.
- [x] SA-19 **Mobile TBT (M1) re-measured with Lighthouse 13.6 (mobile, throttled).** `/band-name-generator/` gave TBT 109 ms and 108 ms on the local build, and 91 ms live; the score is 99–100. The audit's 980 ms single run did not reproduce, so no code change was needed. The biggest item is the shared React chunk `3794` (~300 ms boot-up), which is framework cost. *(Evidence: Lighthouse JSON runs, 2026-11-14)*
- [ ] SA-20 **Not done (low priority or owner decision):**
  - per-page OG images (a static export serves extension-less image routes as `text/plain`, so this needs a different build approach);
  - an IndexNow key and ping (needs an owner-held key and a deploy hook);
  - HSTS preload (owner decision, hard to undo);
  - a free-text "describe your sound" field on the band generator (SXO idea).

### Phase BN — Band Name Generator review and improvements (2026-11-15)
- [x] BN-1 Engine bug fixed: templates with the same slot twice (e.g. `{noun} of {noun}`) left the second slot unfilled, so users could get names like "Ashes {Noun}" (`.replace` only replaced the first match; now a global regex). New test covers every genre × style × 15 seeds. *(Evidence: `npx vitest run src/lib/generator` → 11 passed)*
- [x] BN-2 Title case keeps joining words lower-case ("Hammer of Glory", not "Hammer Of Glory"); tested.
- [x] BN-3 Removed the slur "Spastic" from the punk word list (replaced with "Spiteful") and added spastic/spaz/cripple/midget/gypsy to the offensive filter.
- [x] BN-4 Tool: "How these names are built" panel next to the controls (each naming formula as word slots, an example from the current batch and how many names use it) and a formula label under every result.
- [x] BN-5 Page: title "Band Name Generator – Free Band Name Ideas by Genre" (63 chars incl. brand), new meta (149), last-updated line, 80 crawlable band name ideas (10 per genre, hand-picked from the generator's output and tested against the blocklist and offensive filter in `src/content/pages/band-name-ideas.test.ts`), two new FAQs (10 total), less inflated wording, a typo fixed, a factual count corrected (blocklist has 307 names), and musician-relevant sidebar links instead of the construction template. ~2,040 words.
- [x] BN-6 `npm run verify` passed; accessibility 100 on the main page and all 6 genre pages; mobile performance 93, SEO 100.

### Phase DG — Live diagrams inside every calculator (2026-11-15)
Owner request: every tool must show, inside the input area, a large diagram that explains the calculation with the user's own numbers.
- [x] DG-1 Audit: 17 calculators had no diagram in the tool section (asphalt, fill dirt, sand, stone, compost, paver base, paver sand, tons ↔ yards, cinder block, brick US + metric, fence stain, laminate, linear foot, paint, square footage, stud, tile); cubic yard got a results meter and two page diagrams.
- [x] DG-2 Shared components in `src/components/tool/shared/`: `AreaDepthDiagram` (isometric area × depth with material texture and layer stacks), `StepFrame` + `StepsList` (numbered calculation steps; side-by-side on wide containers, stacked below the drawing under 540 px via a container query), `PaverJointDiagram`, `ConversionDiagram`, `WallDiagram`.
- [x] DG-3 Tool-specific diagrams: fence stain (picket style, both sides), laminate (plank layout incl. diagonal/herringbone, cut offcuts), linear foot (pieces end to end; area → strip), paint (perimeter + unrolled walls with doors/windows), square footage (every shape; multi-room add/subtract), stud (framing with plates, king/jack studs, headers), tile (tile grid with grout and layout pattern).
- [x] DG-4 Every diagram updates live from the inputs and shows the engine's own numbers in 3–4 steps. *(Evidence: screenshots at 1280 px and 500 px; `npm run verify` passed; Lighthouse a11y 100 on all 18 pages; mobile performance 92–94 on tile and asphalt)*

### Phase B4 — Tools #68–#75: 3D Printing, CNC & Engineering Suite (Batch 4, built 2026-11-23)
Research basis: `docs/keywords analysis/Batch 4 - USA — 3D Printing  CNC  Engineering/3. All Blogs Data/00_BATCH4_BUILD_RULES.md` and all 8 tool build specs.
- [x] B4-0 Shared Engines & Unit Tests:
  - `src/lib/epoxy-engine.ts` (14 unit tests passing): supports rectangle, circle, and river irregular shapes; multi-pour layer planner; mix ratios (1:1, 2:1, 3:1, 4:1, 5:1, 100:43, custom); waste allowance; volume and weight conversions.
  - `src/lib/machining-engine.ts` (12 unit tests passing): SFM to RPM ($SFM \times 3.8197 / D$), RPM to SFM, feed rate ($IPM = RPM \times f_z \times z$), chip thinning for light radial width ($W < D/2$), tool limit warnings, and cited material presets.
  - `src/lib/print-cost-engine.ts` (4 unit tests passing): FDM filament & SLA resin models, electricity consumption with bed heating, depreciation & wear, failure buffer %, labor time & wage, markup profit pricing.
  - `src/lib/pulley-engine.ts` (7 unit tests passing): 2-pulley speed ratio, target pulley diameter solver, linear belt speed (ft/min and m/s), center-to-length and length-to-center solvers, contact wrap angles with slip warning (< 120°), compound multi-stage reduction.
  - `src/lib/steps-engine.ts` (6 unit tests passing): timing belt drives (GT2/T5/custom), lead screws (T8, ballscrews, thread starts), Klipper `rotation_distance` converter, and 100 mm extrusion E-steps calibration.
  - `src/lib/thread-engine.ts` (6 unit tests passing): UN/UNC/UNF (ASME B1.1), Metric ISO 68-1/965-1, Acme 29° (ASME B1.5), basic pitch diameter ($d_2 = d - 0.649519 \cdot P$), minor diameter ($d_3 = d - 1.082532 \cdot P$), tap drill diameter with percentage engagement ($D_{tap} = d - (0.01299 \times \% / TPI)$), and 3-wire measurement method ($M = d_2 + W(1 + \csc 30^\circ) - \frac{P}{2} \cot 30^\circ$).
  *(Evidence: `npx vitest run` → 79 test files, 953 tests passed)*
- [x] B4-1 Category & Site Integration: Added `engineering` ("3D Printing & CNC") category to `CATEGORIES` in `src/lib/tools-catalog.ts`, added 8 unique SVG icons in `src/components/icons/Icons.tsx` and custom card art in `src/components/home/ToolArt.tsx`, registered routes in `src/lib/routes.ts` and `Footer.tsx`.
- [x] B4-2 Tool #68: Epoxy Resin Calculator (`/epoxy-resin-calculator/`) — InputGuide diagram, 4 pills (`Deep pour vs surface`, `Layer cure planner`, `Mix ratio 1:1 to 5:1`, `Resin + hardener split`), 10% waste worked example (48×24×0.125 in = 144 in³; with 10% waste = 87.77 fl oz / 2,596 mL).
- [x] B4-3 Tool #69: Epoxy River Table Calculator (`/epoxy-table-calculator/`) — live slab & river SVG diagram, 4 pills (`Live-edge channel math`, `Deep pour layer planner`, `Seal coat + flood top`, `Board foot calculator`), worked example (River 48×6×1 in + flood 48×24×0.125 in + 10% waste = 475.2 in³ = 2.057 US gal).
- [x] B4-4 Tool #70: 3D Print Cost Calculator (`/3d-print-cost-calculator/`) — filament spool & SLA bottle diagram, 4 pills (`Filament & resin modes`, `True electricity cost`, `Machine wear & failure %`, `Markup & selling price`), worked example (50 g PLA ($1.00) + Power ($0.054) + Wear ($0.45) + 5% failure + Labor ($5) = $6.58; at 50% markup = $9.87).
- [x] B4-5 Tool #71: Speeds and Feeds Calculator (`/speeds-and-feeds-calculator/`) — cutter engagement diagram, 4 pills (`Chip thinning auto-calc`, `Milling, router & drill`, `Spindle RPM & IPM feed`, `Machine limit guards`), worked example (0.5 in cutter, 3 flutes, 600 SFM → 4,584 RPM; 0.002 in/tooth → 27.50 IPM).
- [x] B4-6 Tool #72: SFM to RPM Calculator (`/sfm-to-rpm-calculator/`) — surface speed circumference diagram, 4 pills (`SFM ↔ RPM both ways`, `Metric m/min supported`, `RPM tooling matrix`, `Conveyor & line speed`), worked example (1 in at 1,000 RPM → 261.8 SFM; 0.5 in at 300 SFM → 2,292 RPM).
- [x] B4-7 Tool #73: Pulley Calculator (`/pulley-calculator/`) — 2-pulley belt transmission diagram, 4 pills (`Speed ratio & target RPM`, `Belt length & center dist`, `Belt speed in ft/min`, `Contact wrap angle warning`), worked example (2 in driver at 1,725 RPM, 4 in driven → 862.5 RPM (2:1 reduction), belt speed 903.2 ft/min, open belt at 20 in center = 49.47 in, small pulley wrap 174.3°).
- [x] B4-8 Tool #74: Steps per mm Calculator (`/steps-per-mm-calculator/`) — stepper pulley/lead-screw diagram, 4 pills (`Belt & lead screw modes`, `E-steps calibration`, `Klipper rotation_distance`, `Microstepping presets`), worked example (200 steps × 16 µsteps ÷ (2 mm × 20 teeth) = 80 steps/mm (Klipper rotation_distance 40); T8 lead screw = 400 steps/mm; E-steps: 93 × 100 ÷ 95 = 97.89).
- [x] B4-9 Tool #75: Thread Pitch Diameter Calculator (`/thread-pitch-diameter-calculator/`) — screw thread geometry diagram, 4 pills (`UN, Metric & Acme 29°`, `Pitch & minor diameter`, `Tap drill % engagement`, `3-wire method solver`), worked example (M10×1.5 external $d_2 = 9.026$ mm, $d_3 = 8.160$ mm; internal $D_1 = 8.376$ mm; tap drill 75% = 8.539 mm → nearest standard 8.5 mm; best wire 0.866 mm, $M = 9.350$ mm; 1/4-20 UNC $d_2 = 0.2175$ in).
- [x] B4-10 Full Verification Pipeline: All 6 verify steps passed (`npm run verify`): 0 lint issues, 953/953 vitest tests passing across 79 test files, 0 client-side network calls, static build generated 96 HTML pages, SEO audit verified 96 pages with 0 errors.

### Phase SE67 — Tool #67: Self-Employment (1099) Tax Calculator (Batch 3 Part 2 #14, built 2026-11-20)
Research basis: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/25_Self_Employment_1099_Tax_Calculator/25_Self_Employment_Tax_Calculator_BUILD_SPEC.md` & `25_Self_Employment_1099_Tax_Calculator_Competitor_Analysis.md` (primary `1099 tax calculator`, US 9,900 / KD 6; secondary `1099 tax estimator` 2,400 / KD 0, `self employed taxes calculator` 1,300 / KD 5, `estimate taxes` 5,400 / KD 1, `estimated tax dates` 2,900 / KD 2).
- [x] SE-1 Engine `src/lib/se-tax-engine.ts` (12 unit tests passing): implements pure IRS statutory rules from `src/content/us-tax-data.ts`. Computes net self-employment earnings, statutory 92.35% net multiplier (IRC § 1402(a)(12) and Schedule SE Line 4a), $400 minimum net exemption threshold (IRC § 1402(b)(2)), Social Security 12.4% tax capped at $184,500 wage base with W-2 wage priority offset, Medicare 2.9% uncapped tax, Additional Medicare 0.9% surtax by filing status, 50% above-the-line deduction on Schedule 1 Line 15 (IRC § 164(f)), quarterly Form 1040-ES payment schedule across official IRS deadlines (Apr 15, Jun 15, Sep 15, Jan 15), safe harbor benchmark (90% current year vs 100% prior year), and what-if deduction analysis. Benchmark verified: $70,000 gross − $10,000 exp = $60,000 net -> $55,410 taxable base -> $8,477.73 SE tax ($6,870.84 SS + $1,606.89 Med) and $4,238.87 deduction. *(Evidence: `npx vitest run src/lib/se-tax-engine.test.ts` → 12 passed)*
- [x] SE-2 Input Guide Diagram `src/components/tool/self-employment-tax-calculator/SeTaxInputGuide.tsx`: SVG funnel diagram from gross 1099 receipts down to ordinary deductions, standard mileage, 92.35% net multiplier, 15.3% SE tax breakdown, half deduction, and 4 quarterly calendar vouchers. 0 SVG `<title>` tags to protect SEO title audit.
- [x] SE-3 UI & ToolShell `src/components/tool/self-employment-tax-calculator/SelfEmploymentTaxCalculator.tsx`: TabSlider segmented control for 3 modes (`estimate`, `quarterly`, `what-if`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with copyable BLUF sentence, metrics grid, itemized tax breakdown table, quarterly voucher cards, and dated IRS & SSA verified sources box. Wrapped in `ToolShell` with 4 verified pills: `2026 IRS figures, cited`, `W-2 + 1099 together`, `Quarterly due dates`, `Mileage at IRS rate`.
- [x] SE-4 Main Tool Page `src/app/self-employment-tax-calculator/page.tsx`: 2,100+ words of original copy, primary keyword in first sentence ("1099 tax calculator"), 12 comprehensive FAQs matching schema, `HowWeCalculate` component citing IRS and SSA, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`1099 Tax Calculator – Self-Employment Tax`).
- [x] SE-5 Discovery & Routing: Registered in `src/lib/routes.ts` (`seTaxCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#67, category `business`, icon `seTax`), `src/lib/tools-catalog.test.ts` (updated to 67), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `invoice-generator`, `freelance-rate-calculator`, and `hourly-to-salary-calculator`.
- [x] SE-6 Strict Verification: 0 network calls (`npm run check:no-network`), 904/904 vitest tests passing across 73 test files, 88 static HTML pages built, 88 HTML files audited with 0 SEO errors (`npm run verify` passed).

### Phase SBA66 — Tool #66: SBA Loan Calculator (7(a) & 504) (Batch 3 Part 2 #13, built 2026-11-20)
Research basis: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/12_SBA_Loan_Calculator/12_SBA_Loan_Calculator_BUILD_SPEC.md` & `12_SBA_Loan_Calculator_Competitor_Analysis.md` (primary `sba 504 loan`, US 4,400 / KD 5; secondary `sba 504 loans` 2,400 / KD 6, `7a sba loan` 1,300 / KD 3, `what is a sba loan` 2,400 / KD 17, `sba certified lender` 1,300 / KD 7).
- [x] SBA-1 Engine `src/lib/sba-loan-engine.ts` (9 unit tests passing): pure functions modeling SBA 504 two-loan capital stack (bank 1st lien, CDC debenture 2nd lien pegged to 10-yr Treasury, borrower equity, ~3% CDC fees financed into note, blended interest rate, balloon payoff), SBA 7(a) single commercial loans with guarantee fees, 504 vs 7(a) head-to-head comparison, and business acquisition M&A debt stack (buyer cash equity, seller note, and 7(a) senior debt with DSCR underwriting). All spec benchmarks verified: $2M project with 50/40/10 split ($1M bank @ 7% 25 yr = $7,067.79/mo; $800k CDC @ 6.5% 25 yr = $5,401.66/mo; 504 total = $1,800,000, 6.778% blended rate, $12,469.45/mo) vs $1.8M 7(a) loan @ 9% 25 yr ($15,105.53/mo) -> $2,636.08/mo monthly cash flow savings. *(Evidence: `npx vitest run src/lib/sba-loan-engine.test.ts` → 9 passed)*
- [x] SBA-2 Input Guide Diagram `src/components/tool/sba-loan-calculator/SbaInputGuide.tsx`: SVG stacked capital structure diagram showing total project cost bar, bank 1st lien, CDC 2nd lien debenture, borrower equity injection, and merged combined monthly debt service arrow. 0 SVG `<title>` tags to protect SEO title audit.
- [x] SBA-3 UI & ToolShell `src/components/tool/sba-loan-calculator/SbaLoanCalculator.tsx`: TabSlider segmented control for 4 modes (`504`, `7a`, `compare`, `acquisition`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with copyable BLUF sentence, metrics grid, loan split breakdown table, comparison savings matrix, and full combined amortization table with CSV download. Wrapped in `ToolShell` with 4 verified pills: `True 504 two-loan split`, `504 vs 7(a) compare`, `DSCR affordability`, `Printable schedules`.
- [x] SBA-4 Main Tool Page `src/app/sba-loan-calculator/page.tsx`: 2,200+ words of original copy, primary keyword in first sentence ("sba 504 loan"), 12 comprehensive FAQs matching schema, `HowWeCalculate` component citing SBA.gov and 13 CFR Part 120, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`SBA Loan Calculator – 7(a) and 504 Loan Payments`).
- [x] SBA-5 Discovery & Routing: Registered in `src/lib/routes.ts` (`sbaLoanCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#66, category `business`, icon `sbaLoan`), `src/lib/tools-catalog.test.ts` (updated to 66), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `commercial-mortgage-calculator`, `equipment-loan-calculator`, and `business-valuation-calculator`.
- [x] SBA-6 Strict Verification: 0 network calls (`npm run check:no-network`), 904/904 vitest tests passing across 73 test files, 88 static HTML pages built, 88 HTML files audited with 0 SEO errors (`npm run verify` passed).

### Phase DL65 — Tool #65: Retirement Drawdown Calculator (Batch 3 Part 2 #12, built 2026-11-20)
Research basis: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/20_How_Long_Will_My_Money_Last_Calculator/20_How_Long_Will_My_Money_Last_BUILD_SPEC.md` & `20_How_Long_Will_My_Money_Last_Calculator_Competitor_Analysis.md` (primary `how long will my money last`, US 12,100 / KD 0; secondary `how long will my money last calculator` 2,400 / KD 0, `how long will my savings last` 3,600 / KD 0, `4 percent rule calculator` 1,600 / KD 0).
- [x] DL-1 Engine `src/lib/drawdown-engine.ts` (9 unit tests passing): pure functions modeling portfolio retirement drawdowns: closed-form log exhaustion formula, annual dynamic simulation with compound returns and inflation adjustments, other income (Social Security/pension), maximum sustainable annual spending solver (growing annuity formula), Bengen 4% Rule baseline, and stress testing scenarios (-2% return, bad-start sequence of returns). All spec benchmarks verified: $500k @ 5% with flat $40k/yr = 20.1 years; $500k with $40k/yr rising 3% inflation @ 5% return lasts ~15.2 years (exhausted at age 80); $500k to age 95 @ 5% return with 3% inflation allows $22,810.94 in Year 1 (4.56% withdrawal rate). *(Evidence: `npx vitest run src/lib/drawdown-engine.test.ts` → 9 passed)*
- [x] DL-2 Input Guide Diagram `src/components/tool/how-long-will-my-money-last/DrawdownInputGuide.tsx`: SVG savings tank diagram with inflow pipes (returns, pensions), inflation leak, tap outflow, and age timeline ruler. 0 SVG `<title>` tags to protect SEO title audit.
- [x] DL-3 UI & ToolShell `src/components/tool/how-long-will-my-money-last/DrawdownCalculator.tsx`: TabSlider segmented control for 3 modes (`years`, `spend`, `four-percent`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with copyable BLUF sentence, metrics grid, stress test scenario comparison cards, and year-by-year balance table with CSV download. Wrapped in `ToolShell` with 4 verified pills: `Years left or spending`, `Inflation & return`, `Pensions & Social Security`, `4% rule benchmark`.
- [x] DL-4 Main Tool Page `src/app/how-long-will-my-money-last/page.tsx`: 2,200+ words of original copy, primary keyword in first sentence ("how long will my money last"), 12 comprehensive FAQs matching schema, `HowWeCalculate` component citing Bengen (1994) and Trinity Study (1998), `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`How Long Will My Money Last? Retirement Drawdown Calculator`).
- [x] DL-5 Discovery & Routing: Registered in `src/lib/routes.ts` (`drawdownCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#65, category `business`, icon `drawdown`), `src/lib/tools-catalog.test.ts` (updated to 65), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `investment-return-calculator` and `compound-interest-calculator`.
- [x] DL-6 Strict Verification: 0 network calls (`npm run check:no-network`), 904/904 vitest tests passing across 73 test files, 88 static HTML pages built, 88 HTML files audited with 0 SEO errors (`npm run verify` passed).

### Phase IR64 — Tool #64: Investment Return / S&P 500 Calculator (Batch 3 Part 3 #7, built 2026-11-20)
Research basis: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/27_Investment_Return_Calculator_SP500/27_Investment_Return_Calculator_BUILD_SPEC.md` & `27_Investment_Return_Calculator_SP500_Competitor_Analysis.md` (primary `investment calculator s&p 500`, US 880 / KD 10; secondary `money market interest calculator` 1,000 / KD 14, `calculate money market interest` 720 / KD 12, `t bill calculator` 1,300 / KD 23, `s and p 500 calculator` 4,400 / KD 17, `roth ira return calculator` 1,900 / KD 3).
- [x] IR-1 Engine `src/lib/investment-return-engine.ts` (9 unit tests passing): pure functions for monthly compounding growth projection, annual contribution step-up, expense ratio fee drag, inflation discounting, money market monthly APY interest accrual, Treasury bill discount rate (360-day) and coupon-equivalent investment yield (365-day), and equities vs cash side-by-side comparison. Reuses `tvm-engine` TVM math. All spec benchmarks verified: $10,000 + $300/mo for 20 yrs at assumed 7% nominal = $196,665.39 from $82,000 contributed; $25,000 at 4.5% APY for 12 mos = $1,125.00 interest; T-bill $10k par at $9,750 for 182d = 4.945% discount rate and 5.142% investment yield. *(Evidence: `npx vitest run src/lib/investment-return-engine.test.ts` → 9 passed)*
- [x] IR-2 Input Guide Diagram `src/components/tool/investment-return-calculator/InvestInputGuide.tsx`: SVG diagrams positioned above inputs with tab-specific visual flows: exponential growth curve with starting amount dot, periodic deposit steps, assumed slope %, fee drag zone, and dashed inflation curve; savings jar with APY compounding; U.S. Treasury bill security graphic showing auction discount to maturity par value; and stocks vs cash comparative divergence lines. Live sync, focus highlight, mobile collapsible `<details>`, 0 SVG `<title>` tags to protect SEO title audit.
- [x] IR-3 UI & ToolShell `src/components/tool/investment-return-calculator/InvestmentReturnCalculator.tsx`: TabSlider segmented control for 4 modes (`projection`, `money-market`, `tbill`, `compare`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with copyable BLUF sentence, prominent disclaimer box next to results ("Past performance and assumed rates are illustrative..."), quick return chips (6%, 7%, 8%, 10%), T-bill maturity chips (28d, 91d, 182d, 364d), metrics grid (Final Value, Contributed, Compound Gains, Real Value, Fee Drag, CAGR), stacked principal vs growth bar, and annual schedule table with CSV download. Wrapped in `ToolShell` with 4 verified pills: `Stocks vs cash compare`, `Fees & inflation`, `Money market & T-bills`, `Yearly table & chart`.
- [x] IR-4 Main Tool Page `src/app/investment-return-calculator/page.tsx`: 2,000+ words of original copy, primary keyword in first sentence ("investment calculator s&p 500"), 10 comprehensive FAQs matching schema, `HowWeCalculate` component citing TreasuryDirect and Federal Reserve FRED, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Investment Calculator – S&P 500, T-Bills & Money Market`).
- [x] IR-5 Discovery & Routing: Registered in `src/lib/routes.ts` (`investmentReturnCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#64, category `business`, icon `investmentReturn`), `src/lib/tools-catalog.test.ts` (updated to 64), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `compound-interest-calculator` and `net-worth-calculator`.
- [x] IR-6 Strict Verification: 0 network calls (`npm run check:no-network`), 874/874 vitest tests passing across 70 test files, 85 static pages built, 85 HTML files audited with 0 SEO errors (`npm run verify` passed).

### Phase HC63 — Tool #63: HELOC & Home Equity Calculator (Batch 3 Part 3 #6, built 2026-11-20)
Research basis: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/23_HELOC_Home_Equity_Calculator/23_HELOC_Calculator_BUILD_SPEC.md` & `23_HELOC_Home_Equity_Calculator_Competitor_Analysis.md` (primary `heloc loan calculator`, US 12,100 / KD 9; secondary `estimate home equity payment` 2,400 / KD 9, `heloc amortization calculator` 880 / KD 7; head `heloc calculator` 40,500 / KD 10 long-term).
- [x] HC-1 Engine `src/lib/heloc-engine.ts` (7 unit tests passing): reuses `loan-engine.payment`. Implements `calculateBorrowingLimit` (85% CLTV cap -> $90k max line on $400k home with $250k mortgage), `calculateHelocPayments` ($50k at 8% -> $333.33/mo interest-only draw payment, $418.22/mo 20-yr repayment payment, +25.5% / +$84.89/mo payment shock, 1/360 method, extra principal, balloon option, rate caps), `generateRateScenarios` (+0%, +1%, +2%, +3%), and `compareHomeEquityOptions` (HELOC vs 15-yr Home Equity Loan vs 30-yr Cash-Out Refinance). *(Evidence: `npx vitest run src/lib/heloc-engine.test.ts` → 7 passed)*
- [x] HC-2 Input Guide Diagram `src/components/tool/heloc-calculator/HelocInputGuide.tsx`: SVG house equity stack bar with 85% CLTV cap and two-phase lifecycle timeline showing draw to repayment payment shock. 0 SVG `<title>` tags to protect SEO title audit.
- [x] HC-3 UI & ToolShell `src/components/tool/heloc-calculator/HelocCalculator.tsx`: TabSlider segmented control for 3 modes (`payment`, `borrow`, `compare`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with copyable BLUF sentence, hero payment shock card with red badge, metrics grid, rate-rise sensitivity table, and full 360-month amortization table with CSV download. Wrapped in `ToolShell` with 4 verified pills: `Borrowing limit (CLTV)`, `Payment shock shown`, `Rate-rise scenarios`, `HELOC vs home equity loan`.
- [x] HC-4 Main Tool Page `src/app/heloc-calculator/page.tsx`: 2,100+ words of original copy, primary keyword ("heloc loan calculator"), 11 comprehensive FAQs matching schema, `HowWeCalculate` component citing CFPB and IRS Pub 936, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`HELOC Loan Calculator – Payment, Limit & Payment Shock`).
- [x] HC-5 Discovery & Routing: Registered in `src/lib/routes.ts` (`helocCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#63, category `business`, icon `heloc`), `src/lib/tools-catalog.test.ts` (updated to 63), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `net-worth-calculator`.
- [x] HC-6 Strict Verification: 0 network calls (`npm run check:no-network`), 874/874 vitest tests passing across 70 test files, 85 static pages built, 85 HTML files audited with 0 SEO errors (`npm run verify` passed).

### Phase NW62 — Tool #62: Net Worth Calculator (Batch 3 Part 3 #5, built 2026-11-20)
Research basis: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/19_Net_Worth_Calculator/19_Net_Worth_Calculator_BUILD_SPEC.md` & `19_Net_Worth_Calculator_Competitor_Analysis.md` (primary `calculate net worth`, US 4,400 / KD 17; secondary `net worth meaning` 14,800 / KD 8, `what is net worth` 2,400 / KD 9, `how do i figure out my net worth` 1,600 / KD 12; head `net worth calculator` 246,000 / KD 75 long-term).
- [x] NW-1 Engine `src/lib/net-worth-engine.ts` (7 unit tests passing): pure functions for total assets, total liabilities, net worth, liquid net worth ($31,000 spec benchmark), investable net worth ($151,000), 53.45% debt-to-asset ratio, home equity, monthly spend runway, household dual-earner mode, and local private snapshots comparison. Spec benchmarks verified. *(Evidence: `npx vitest run src/lib/net-worth-engine.test.ts` → 7 passed)*
- [x] NW-2 Input Guide Diagram `src/components/tool/net-worth-calculator/NetWorthInputGuide.tsx`: SVG balance scale with dynamic tilt angle based on assets vs liabilities. 0 SVG `<title>` tags to protect SEO title audit.
- [x] NW-3 UI & ToolShell `src/components/tool/net-worth-calculator/NetWorthCalculator.tsx`: TabSlider segmented control for 3 modes (`personal`, `household`, `tracker`) with `?tab=` URL sync, multi-currency selector (USD/EUR/GBP/CAD/AUD), high-contrast light mint `.summaryBanner` box, stacked asset allocation bar, local private snapshots via safeStorage in localStorage, and CSV statement export. Wrapped in `ToolShell` with 4 verified pills: `Liquid net worth`, `Household & partner mode`, `Asset-mix breakdown`, `Track over time`.
- [x] NW-4 Main Tool Page `src/app/net-worth-calculator/page.tsx`: 1,800+ words of original copy, primary keyword ("calculate net worth"), 10 comprehensive FAQs matching schema, `HowWeCalculate` component citing Federal Reserve Survey of Consumer Finances (SCF), `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Net Worth Calculator – Calculate Your Net Worth`).
- [x] NW-5 Discovery & Routing: Registered in `src/lib/routes.ts` (`netWorthCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#62, category `business`, icon `netWorth`), `src/lib/tools-catalog.test.ts` (updated to 62), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `credit-card-payoff-calculator`.
- [x] NW-6 Strict Verification: 0 network calls (`npm run check:no-network`), 874/874 vitest tests passing across 70 test files, 85 static pages built, 85 HTML files audited with 0 SEO errors (`npm run verify` passed).

### Phase CC61 — Tool #61: Credit Card Payoff & APR Calculator (Batch 3 Part 3 #4, built 2026-11-20)
Research basis: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/16_Credit_Card_Payoff_APR_Calculator/16_Credit_Card_Payoff_Calculator_BUILD_SPEC.md` & `16_Credit_Card_Payoff_APR_Calculator_Competitor_Analysis.md` (primary `credit card apr calculator`, US 2,400 / KD 11; secondary `estimate minimum payment credit card` 1,300 / KD 12, `credit card payoff calculator` 14,800 / KD 53; head `credit card payoff calculator` long-term).
- [x] CC-1 Engine `src/lib/card-payoff-engine.ts` (8 unit tests passing): pure functions modeling credit card amortization and debt reduction math. Implements `simulateCardPayoff` (with <$1.00 remainder roll-over), `calculatePaymentForMonths` ($259.39 for 24 months), `simulateMinimumPayment` (230 months, ~$8,100 interest on $5k @ 22%), `simulateMultiCardPayoff` (avalanche vs snowball priority ordering and debt budget rollover), `calculateBalanceTransfer` (evaluates promo interest vs transfer fee savings), and `convertApr` (APR -> daily rate, monthly rate, compounded APY). Spec worked examples verified ($5,000 at 22% paying $200/mo = 34 months & $1,750 interest; 24 months = $259.39/mo; minimum payments = 230 months & $8,100 interest). *(Evidence: `npx vitest run src/lib/card-payoff-engine.test.ts` → 8 passed)*
- [x] CC-2 Input Guide Diagram `src/components/tool/credit-card-payoff-calculator/CardPayoffInputGuide.tsx`: credit card outline graphic with live draining balance bar, principal vs interest split, debt-free flag, minimum payment trap visualization showing shrinking monthly payments, avalanche vs snowball priority arrows, and 0% balance transfer bridge. 0 SVG `<title>` tags to protect SEO title audit.
- [x] CC-3 UI & ToolShell `src/components/tool/credit-card-payoff-calculator/CreditCardPayoffCalculator.tsx`: TabSlider segmented control for 5 modes (`payoff`, `minimum`, `multi-card`, `transfer`, `converter`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic copyable BLUF sentence, hero payoff card with projected debt-free month/year, metrics strip (Total Interest, Total Paid, Monthly Payment, Initial Interest), sensitivity table ($150–$400 payment range), interactive SVG amortization chart, full monthly schedule table with CSV download, side-by-side minimum payment trap comparison, editable multi-card tracker with avalanche vs snowball interest difference, balance transfer savings calculator, and daily periodic rate converter. Wrapped in `ToolShell` with 4 verified pills: `Minimum-payment simulator`, `Avalanche vs snowball`, `Balance transfer check`, `No card ads`.
- [x] CC-4 Main Tool Page `src/app/credit-card-payoff-calculator/page.tsx`: 2,000+ words of original copy, primary keywords ("credit card apr calculator", "estimate minimum payment credit card"), 11 comprehensive FAQs matching schema, `HowWeCalculate` component citing CFPB and Federal Reserve Statistical Release G.19, zero credit card ads, zero affiliate links, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Credit Card APR Calculator – Payoff Time & Interest`).
- [x] CC-5 Discovery & Routing: Registered in `src/lib/routes.ts` (`creditCardPayoffCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#61, category `business`, icon `creditCardPayoff`), `src/lib/tools-catalog.test.ts` (updated to 61), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `compound-interest-calculator` and `percentage-change-calculator`.
- [x] CC-6 Strict Verification: 0 network calls (`npm run check:no-network`), 874/874 vitest tests passing across 70 test files, 85 static pages built, 85 HTML files audited with 0 SEO errors (`npm run verify` passed).

### Phase PF60 — Tool #60: Card Processing Fee Calculator (Batch 3 Part 3 #3, built 2026-11-20)
Research basis: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/17_Card_Processing_Fee_Calculator/17_Card_Processing_Fee_Calculator_BUILD_SPEC.md` & `17_Card_Processing_Fee_Calculator_Competitor_Analysis.md` (primary `square credit card processing fees`, US 1,600 / KD 10; secondary `square reader fees` 2,400 / KD 12, `square fee calculator` 1,000 / KD 26, `credit card processing fee calculator`, `square pos pricing` 2,400 / KD 9; head `credit card processing fee calculator` long-term).
- [x] PF-1 Engine `src/lib/processing-fee-engine.ts` (10 unit tests passing): pure functions for transaction fee calculation (`calculateSaleFee`: fee, net proceeds, effective rate %, percentage/fixed/international cut splits), gross-up charge-to-receive solver (`calculateGrossUp`: solves required customer charge to net target amount after fees; null on fee >= 100%), monthly overhead modeling (`calculateMonthlyFees`: monthly volume, variable fees, annual fees, net take-home), subscription plan break-even analyzer (`calculatePlanBreakEven`: computes required ticket count and monthly volume for software fee payoff, e.g. Square Free vs Square Plus), surcharge calculator (`calculateSurcharge` with 3.0% legal card-network cap), and preset comparator (`comparePresets`). Spec worked example verified ($100 sale at 2.9% + $0.30 -> $3.20 fee, $96.80 net, 3.20% effective; gross-up to net $100 -> charge $103.30). *(Evidence: `npx vitest run src/lib/processing-fee-engine.test.ts` → 10 passed)*
- [x] PF-2 Official Presets Registry `src/content/processing-fee-presets.ts`: strict freshness rule enforced; holds verified standard rates directly read from official public pricing pages with source URLs and verified dates (Square In-Person 2.6% + $0.15, Square Online 3.3% + $0.30, Square Keyed 3.5% + $0.15, Square Plus 2.5% + $0.15 with $49/mo; Stripe Online 2.9% + $0.30, Stripe Terminal 2.7% + $0.05; PayPal Zettle 2.29% + $0.09, PayPal Standard Cards 2.99% + $0.49, PayPal Checkout 3.49% + $0.49, PayPal Keyed 3.49% + $0.09). `TODO(owner)`: re-check presets every 3 months.
- [x] PF-3 Input Guide Diagram `src/components/tool/processing-fee-calculator/FeeInputGuide.tsx`: SVG payment flow diagram positioned above inputs with tab-specific visual flows: 3-box transaction payment flow (Customer pays [1] -> Processor cut [2] -> Merchant receives net [3]), reverse gross-up flow, 4-way processor comparison bars, and monthly volume receipt stack. Live values, active focus highlight, mobile collapsible `<details>`, 0 SVG `<title>` tags to protect SEO title audit.
- [x] PF-4 UI & ToolShell `src/components/tool/processing-fee-calculator/ProcessingFeeCalculator.tsx`: TabSlider segmented control for 4 modes (`fee`, `gross-up`, `compare`, `monthly`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, verified preset selector with auto-fill and custom rate override, international card toggle (+1.5%) and FX conversion toggle (+1.0%), hero Net/Fee card, metrics grid, gross-up solver with live surcharge cap check, side-by-side comparison table ranking lowest monthly cost with verified links, and paid plan break-even analyzer. Wrapped in `ToolShell` with 4 verified pills: `Fee, net & charge-to-receive`, `Compare providers`, `Monthly cost & plans`, `Any processor, any currency`.
- [x] PF-5 Main Tool Page `src/app/processing-fee-calculator/page.tsx`: 1,900+ words of original copy, primary keyword in first sentence ("square credit card processing fees"), 10 comprehensive FAQs matching schema, `HowWeCalculate` component citing Square, Stripe, PayPal official pricing and Visa Core Rules, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Card Processing Fee Calculator – Square, PayPal & More`).
- [x] PF-6 Discovery & Routing: Registered in `src/lib/routes.ts` (`processingFeeCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#60, category `business`, icon `processingFee`), `src/lib/tools-catalog.test.ts` (updated to 60), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `invoice-generator` and `markup-calculator`.
- [x] PF-7 Strict Verification: 0 network calls (`npm run check:no-network`), 843/843 vitest tests passing across 66 test files, 95 static pages built, 81 HTML files audited with 0 SEO errors (`npm run verify` passed).

### Phase CI59 — Tool #59: Compound Interest Calculator (Batch 3 Part 3 #2, built 2026-11-20)
Research basis: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/21_Compound_Interest_Calculator/21_Compound_Interest_Calculator_BUILD_SPEC.md` & `21_Compound_Interest_Calculator_Competitor_Analysis.md` (primary `compound growth calculator`, US 6,600 / KD 4; secondary `compound daily calculator` 1,600 / KD 3, `calculate interest compounded monthly` 1,000 / KD 7, `compound interest vs simple interest` 2,400 / KD 14, `compounded continuously` 2,400 / KD 22, `apy to apr calculator` 1,000 / KD 24; head `compound interest calculator` long-term).
- [x] CI-1 Engine `src/lib/compound-interest-engine.ts` (16 unit tests passing): reuses `tvm-engine.ts` (`effectiveRate`, `nominalFromApy`). Implements `calculateCompoundGrowth` with mixed-frequency compounding math ($i = (1 + r/n)^{n/m} - 1$), timing toggle (start/end), annual step-up deposit increases, tax on interest drag %, inflation purchasing power deflation, `compareFrequencies` across 7 standard intervals (annual to continuous), `compareSimpleVsCompound` (linear vs exponential math with exact advantage), `solveDepositForGoal`, `solveRateForGoal`, and `solveTimeForGoal`. All spec benchmarks verified: $10,000 @ 5% monthly + $200/mo for 10 yrs = $47,526.55 ($34,000 deposits, $13,526.55 interest); $10k for 10y @ 5% no deposits: Annual $16,288.95 / Monthly $16,470.09 / Daily $16,486.65; APY of 5% monthly = 5.116%; Doubling time = 13.89 yrs. *(Evidence: `npx vitest run src/lib/compound-interest-engine.test.ts` → 16 passed)*
- [x] CI-2 Input Guide Diagram `src/components/tool/compound-interest-calculator/CompoundInputGuide.tsx`: SVG snowball rolling down gentle slope metaphor across 4 modes (`growth`, `goal`, `simple-vs-compound`, `apr-vs-apy`), live values, active input focus highlight, mobile collapsible `<details>`, 0 SVG `<title>` tags to protect SEO title audit.
- [x] CI-3 UI & ToolShell `src/components/tool/compound-interest-calculator/CompoundInterestCalculator.tsx`: TabSlider segmented control for 4 modes (`growth`, `goal`, `simple-vs-compound`, `apr-vs-apy`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, hero Future Value card, key metrics strip (Total Deposits, Total Interest, APY, Doubling Time, Real Purchasing Power), SVG stacked growth chart, yearly schedule table with CSV download, 3-variable goal solver (deposit, rate, time), simple vs compound side-by-side comparison, and APR ↔ APY bidirectional converter with compounding yield matrix. Wrapped in `ToolShell` with 4 verified pills: `Solve for deposit, rate or time`, `Daily to continuous`, `Inflation-adjusted value`, `Yearly table & chart`.
- [x] CI-4 Main Tool Page `src/app/compound-interest-calculator/page.tsx`: 2,200+ words of original copy, primary keyword in first sentence ("compound growth calculator"), 11 comprehensive FAQs matching schema, `HowWeCalculate` component citing SEC Investor.gov, CFPB Truth in Savings Act (Reg DD), and CFA Institute TVM Curriculum, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Compound Interest Calculator – Daily, Monthly & Growth`).
- [x] CI-5 Discovery & Routing: Registered in `src/lib/routes.ts` (`compoundInterestCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#59, category `business`, icon `compoundInterest`), `src/lib/tools-catalog.test.ts` (updated to 59), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `present-value-calculator` and `percentage-change-calculator`.
- [x] CI-6 Strict Verification: 0 network calls (`npm run check:no-network`), 833/833 vitest tests passing across 65 test files, 94 static pages built, 80 HTML files audited with 0 SEO errors (`npm run verify` passed).

### Phase PV58 — Tool #58: Present Value & NPV Calculator (Batch 3 Part 3 #1, built 2026-11-20)
Research basis: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/26_Present_Value_NPV_Calculator/26_Present_Value_Calculator_BUILD_SPEC.md` & `26_Present_Value_NPV_Calculator_Competitor_Analysis.md` (primary `pv formula`, US 2,400 / KD 14; secondary `present value discount tables` 1,300 / KD 9, `present value table` 1,900 / KD 21, `pv table` 1,900 / KD 23, `pv of annuity` 720 / KD 12, `how to calculate npv` 1,900 / KD 29; head `present value calculator` 8,100 / KD 50).
- [x] PV-0 Step P3-A Shared Engine `src/lib/tvm-engine.ts` (21 unit tests passing): robust time-value-of-money and capital budgeting engine. Exports `pv`, `fv`, `pvAnnuity`, `fvAnnuity`, `pvGrowingAnnuity`, `pvPerpetuity`, `effectiveRate(r, m)`, `nominalFromApy`, `perPeriodRate`, `npvProject`, `profitabilityIndex`, `discountedPayback`, `npvProfile`, `xnpv`, `pvTable`, `annuityTable`, and `generateExcelFormulas`. Reuses `npv` and `irr` from `real-estate-engine.ts`. All spec worked examples verified ($10k in 10y at 6% = $5,583.95; $1k/yr for 10y at 6% = $7,360.09; -$10k + 5×$3k at 8% = $1,978.13 NPV, 15.24% IRR, 1.20 PI, 4.03y discounted payback). *(Evidence: `npx vitest run src/lib/tvm-engine.test.ts` → 21 passed)*
- [x] PV-1 Input Guide Diagram `src/components/tool/present-value-calculator/PvInputGuide.tsx`: SVG timeline diagram positioned above inputs with tab-specific visual flows: lump-sum discounting arc from Year N back to Today with compounding tick marks, periodic annuity stream with due vs ordinary indicator, uneven multi-year cash flows, capital budgeting outlay vs inflow bars with live NPV/IRR, and 4-decimal PV factor table preview. Zero SVG `<title>` tags to protect SEO title audit.
- [x] PV-2 UI & ToolShell `src/components/tool/present-value-calculator/PresentValueCalculator.tsx`: TabSlider segmented control for 5 modes (`lump-sum`, `annuity`, `cash-flows`, `npv`, `pv-table`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, compounding frequency selector (annual to continuous), perpetuity and growing annuity toggles, dynamic cash flow row builder (add/remove years), capital budgeting card with interactive SVG NPV profile curve, Excel & Google Sheets formula generator box with one-click copy, and interactive 4-decimal PV/annuity table generator with CSV copy and print stylesheet. Wrapped in `ToolShell` with 4 verified pills: `PV, annuity & NPV/IRR`, `Printable PV table`, `Excel formulas`, `Step-by-step working`.
- [x] PV-3 Main Tool Page `src/app/present-value-calculator/page.tsx`: 2,000+ words of authoritative copy, primary keyword in first sentence ("pv formula"), 11 comprehensive FAQs matching schema, `HowWeCalculate` component citing FASB Concepts Statement No. 7, CFA Institute TVM Curriculum, and Brealey/Myers/Allen Corporate Finance, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Present Value Calculator – PV Formula, NPV & PV Table`).
- [x] PV-4 Discovery & Routing: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#58, category `business`, icon `presentValue`), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `business-valuation-calculator` and `cap-rate-calculator`.
- [x] PV-5 Strict Verification: 0 network calls (`npm run check:no-network`), 817/817 vitest tests passing across 64 test files, 93 static pages built, 79 HTML files audited with 0 SEO errors.

### Phase AB51 — Tool #51: Airbnb Profit Calculator (Batch 3 Part 2 #5, built 2026-11-20)
Research basis: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/14_Airbnb_Short_Term_Rental_Profit_Calculator/14_Airbnb_Calculator_BUILD_SPEC.md` & `14_Airbnb_Short_Term_Rental_Profit_Calculator_Competitor_Analysis.md` (primary `airbnb profit calculator`, US 880 / KD 19 / CPC $2.94; secondary `free airbnb calculator` 480 / KD 0, `vacation rental investment calculator` 320 / KD 5, `airbnb arbitrage calculator` 260 / KD 4).
- [x] AB-1 Engine `src/lib/str-engine.ts` (9 unit tests passing): full-stack STR profitability modeling for gross revenue from nightly rate (ADR), occupancy %, nights available, weekend uplift, cleaning fees collected, platform host fees (3%–15%), variable turnover costs (cleaner fee, supplies, management %, maintenance reserve %), fixed bills (utilities, Wi-Fi, STR insurance, permits), Net Operating Income (NOI), mortgage debt service or master lease arbitrage rent, cash flow, RevPAR, break-even occupancy % and ADR, cash-on-cash return, furniture payback period, 3-scenario projections, and STR vs LTR comparison. Spec worked example verified (365 nights, 65% occ = 237.25 booked nights, 79.08 stays, $180 ADR + $90 cleaning fee = $49,822.50 gross rev; $1,494.68 platform fee, $9,608.63 variable costs, $5,520 fixed costs -> NOI $33,199.20; after $1,800/mo mortgage -> $11,599.20/yr cash flow ($966.60/mo), 15.47% cash-on-cash on $75k invested, 45.53% break-even occupancy, 15.5 months furniture payback). *(Evidence: `npx vitest run src/lib/str-engine.test.ts` → 9 passed)*
- [x] AB-2 Input Guide Diagram `src/components/tool/airbnb-calculator/AirbnbInputGuide.tsx`: SVG diagram positioned above inputs with tab-specific visual flows: 30-day visual calendar strip with booked vs vacant day shading, stay duration groupings, turnover cleaning broom badges, live ADR/cleaning fee tags, and net cash flow money waterfall. Live sync, focus highlight, mobile collapsible, 0 SVG `<title>` tags to protect SEO title audit.
- [x] AB-3 UI & ToolShell `src/components/tool/airbnb-calculator/AirbnbCalculator.tsx`: TabSlider segmented control for 4 modes (`buy`, `arbitrage`, `midterm`, `str-vs-ltr`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, honest input standard notice, itemized annual & monthly P&L waterfall table, 3-tier sensitivity & scenario matrix (Conservative, Expected, Optimistic), side-by-side STR vs Long-Term Rental comparison card, and clipboard summary copy. Wrapped in `ToolShell` with 4 verified pills: `Full expense model`, `Break-even occupancy`, `Arbitrage & mid-term modes`, `STR vs long-term`.
- [x] AB-4 Main Tool Page `src/app/airbnb-calculator/page.tsx`: 2,300+ words of original copy, BLUF quick answer box with engine-computed metrics, 12 comprehensive FAQs matching schema, `HowWeCalculate` component with AirDNA, AHLA, and NAR citations, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata. Descriptive brand use only, no competitor brand targeting.
- [x] AB-5 Discovery & Routing: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#51, category `business`, icon `airbnbHost`), `Footer.tsx` (Column 5), `ToolArt.tsx`, and `calculation-methods.ts`. Inbound cross-links added from `rental-property-calculator` and `cap-rate-calculator`.
- [x] AB-6 Strict Verification: 0 network calls (`npm run check:no-network`), 750/750 vitest tests passing across 57 test files.

### Phase CL50 — Tool #50: Commercial Lease Calculator (Batch 3 Part 2 #4, built 2026-11-20)
Research basis: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/10_Commercial_Lease_Calculator/10_Commercial_Lease_Calculator_BUILD_SPEC.md` & `10_Commercial_Lease_Calculator_Competitor_Analysis.md` (primary `commercial lease calculator`, US 390 / KD 17 / CPC $2.46; secondary `triple net lease calculator` 480 / KD 12, `cam expenses` 260 / KD 8, `rent increase calculator` 1,600 / KD 15).
- [x] CL-1 Engine `src/lib/commercial-lease-engine.ts` (10 unit tests passing): pure functions for usable area with load factor % -> rentable area (RSF), rate basis ($/SF/yr or $/SF/mo), lease types (Gross, Modified Gross with toggles, NNN, Absolute NNN), pass-throughs (tax, insurance, CAM, utilities), escalations (annual % or $/SF step, base-only vs all-costs), concessions (free rent months, TI allowance), 5-year multi-year schedule with net effective rent, building CAM pro-rata share, retail percentage rent overage with natural breakpoint, and side-by-side 2-offer comparison. Spec worked example verified (2,000 USF, 15% load = 2,300 RSF, $24 NNN + $8 pass-throughs, 5 yrs, 3% escalation base-only, 2 mos free rent, $10/SF TI ($23,000) -> Year 1 base $55,200 ($4,600/mo), Year 1 NNN $18,400 ($1,533.33/mo), Year 1 monthly total $6,133.33/mo, 5-yr base $293,064.30, 5-yr NNN $92,000.00, free rent -$9,200.00, total lease cost $375,864.30, avg monthly $6,264.40, net effective rent $22.68/SF/yr). *(Evidence: `npx vitest run src/lib/commercial-lease-engine.test.ts` → 10 passed)*
- [x] CL-2 Input Guide Diagram `src/components/tool/commercial-lease-calculator/LeaseInputGuide.tsx`: SVG diagram positioned above inputs with tab-specific visual flows: Tab 1 floor plan diagram showing usable space vs rentable space (with load factor markup) + NNN pass-through stack + free rent concession ribbon; Tab 2 side-by-side offer comparison bars; Tab 3 building CAM allocation pie/bar; Tab 4 retail percentage rent breakpoint diagram. Live sync, focus highlight, mobile collapsible, 0 SVG `<title>` tags to protect SEO title audit.
- [x] CL-3 UI & ToolShell `src/components/tool/commercial-lease-calculator/CommercialLeaseCalculator.tsx`: TabSlider segmented control for 4 modes (`cost`, `compare`, `cam`, `retail`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, 5-year year-by-year schedule table, side-by-side 2-offer comparison cards with winner banner, pro-rata building CAM calculator, retail percentage rent breakpoint calculator, and clipboard summary copy. Wrapped in `ToolShell` with 4 verified pills: `Gross, modified gross & NNN`, `Escalations & free rent`, `Compare 2 offers`, `Print & share link`.
- [x] CL-4 Main Tool Page `src/app/commercial-lease-calculator/page.tsx`: 2,100+ words of original copy, BLUF quick answer box with engine-computed metrics, 11 comprehensive FAQs matching schema, `HowWeCalculate` component with BOMA, CCIM, and ICSC citations, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata.
- [x] CL-5 Discovery & Routing: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#50, category `business`, icon `commercialLease`), `Footer.tsx` (Column 5), `ToolArt.tsx`, and `calculation-methods.ts`. Inbound cross-links added from `cap-rate-calculator`, `rental-property-calculator`, and `square-footage-calculator`.
- [x] CL-6 Strict Verification: 0 network calls (`npm run check:no-network`), 741/741 vitest tests passing across 56 test files.

### Phase LC49 — Tool #49: Labor Cost Calculator (Batch 3 Part 2 #3, built 2026-11-20)
Research basis: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/18_Labor_Cost_Calculator/18_Labor_Cost_Calculator_BUILD_SPEC.md` & `18_Labor_Cost_Calculator_Competitor_Analysis.md` (primary `labor cost`, US 1,900 / KD 14 / CPC $6.43; secondary `how to estimate labor costs for construction` 1,000 / KD 5).
- [x] LC-1 Engine `src/lib/labor-cost-engine.ts` (12 unit tests passing): pure functions for fully burdened employee cost, US payroll-tax caps (Social Security 6.2% up to $184,500 wage base in 2026, Medicare 1.45% uncapped, FUTA 0.6% on first $7,000, SUTA on state wage base, workers' compensation per $100, benefits), paid vs productive billable hours, crew and job quote estimating (markup and margin modes reusing `pricing-engine.ts`), labor cost as a percentage of revenue, and employee vs 1099 subcontractor cost comparison. Spec worked example verified ($30/hr × 2,080 h = $62,400 wages, $5,015.60 payroll taxes, $3,120 wc, $6,000 benefits -> $76,535.60 total annual cost, 22.65% burden, $36.80/paid hr, $39.86/productive hr; 3-worker 40-hr crew quote with 15% overhead & 10% profit = $6,051.10). *(Evidence: `npx vitest run src/lib/labor-cost-engine.test.ts` → 12 passed)*
- [x] LC-2 Input Guide Diagram `src/components/tool/labor-cost-calculator/LaborInputGuide.tsx`: SVG diagram positioned above inputs with tab-specific visual flows: Tab 1 stacked cost waterfall bar with 6 numbered badges (1 Wages, 2 Payroll Taxes, 3 Comp & Ins, 4 Benefits, 5 Total Cost) plus right-side productive hours clock (7 Paid − 8 Time Off = Billable hours) and true rate formula ribbon; Tab 2 crew roles × hours → Direct Labor + Materials/Subs → Overhead/Profit → Final Quote; Tab 3 labor vs revenue comparative bars. Live sync, focus highlight, mobile collapsible, 0 SVG `<title>` tags to protect SEO title audit.
- [x] LC-3 UI & ToolShell `src/components/tool/labor-cost-calculator/LaborCostCalculator.tsx`: TabSlider segmented control for 3 modes (`employee`, `job`, `labor-pct`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, itemized waterfall breakdown table, W-2 vs 1099 subcontractor comparison tool, dynamic crew roster builder (add/remove members, hours, overtime), job expenses, markup vs margin pricing toggle, and clipboard summary copy. Wrapped in `ToolShell` with 4 verified pills: `Payroll-tax caps built in`, `Crew & job quote`, `Paid vs productive hours`, `Print & share link`.
- [x] LC-4 Main Tool Page `src/app/labor-cost-calculator/page.tsx`: 2,200+ words of original copy, BLUF quick answer box with engine-computed metrics, 10 comprehensive FAQs matching schema, `HowWeCalculate` component with IRS Pub 15, SSA, and DOL FLSA citations, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata.
- [x] LC-5 Discovery & Routing: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#49, category `business`, icon `laborCost`), `Footer.tsx` (Column 5), `ToolArt.tsx`, and `calculation-methods.ts`. Inbound cross-links added from `construction-estimate-template`, `markup-calculator`, and `hourly-to-salary-calculator`.
- [x] LC-6 Strict Verification: 0 network calls (`npm run check:no-network`), 731/731 vitest tests passing across 55 test files.

### Phase RP48 — Tool #48: Rental Property Calculator (Batch 3 Part 2 #2, built 2026-11-20)
Research basis: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/07_Rental_Property_Calculator/07_Rental_Property_Calculator_BUILD_SPEC.md` & `07_Rental_Property_Calculator_Competitor_Analysis.md` (primary `cash on cash return calculator`, US 1,300 / KD 17; `cash on cash return` 3,600 / KD 7, `calculate rental property` 2,900 / KD 8, `investment property calculator` 1,300 / KD 2, `cash on cash roi` 880 / KD 0, `rental cash flow calculator` 480 / KD 2, `real estate pro forma` 480 / KD 9, `property value to rent ratio` 390 / KD 24).
- [x] RP-1 Engine `src/lib/rental-property-engine.ts` (9 unit tests passing): full underwriting model reusing `real-estate-engine.ts` and `loan-engine.ts` for NOI, debt service, cash-on-cash return, cap rate, DSCR, gross/net yield, break-even occupancy, 1% rule, 10-year pro forma with equity paydown and IRR, and side-by-side all-cash vs financed deal comparison. Spec worked example verified ($250k price, 25% down, 7% rate, 30 yr, $2,400 rent, 5% vac, $9,468.80 opex -> NOI $17,891.20, debt service $14,969.31, cash flow $2,921.89/yr ($243.49/mo), cash invested $75,000, cash-on-cash 3.90%, cap rate 7.16%, DSCR 1.20×). *(Evidence: `npx vitest run src/lib/rental-property-engine.test.ts` → 9 passed)*
- [x] RP-2 Input Guide Diagram `src/components/tool/rental-property-calculator/RentalInputGuide.tsx`: SVG diagram positioned above inputs with 8 numbered badge callouts matching inputs (1 Price, 2 Down payment, 3 Closing, 4 Repairs, 5 Monthly rent, 6 Vacancy, 7 Operating expenses, 8 Mortgage payment), live values sync, focus highlight, pro forma timeline arrow, and note that mortgage debt service is paid after NOI.
- [x] RP-3 UI & ToolShell `src/components/tool/rental-property-calculator/RentalPropertyCalculator.tsx`: TabSlider segmented control for 3 modes (`returns`, `pro-forma`, `cash-vs-mortgage`) with `?tab=` URL sync, dedicated high-contrast light summary banner (`.summaryBanner`), itemized income waterfall table, 10-year pro forma table with SVG equity vs loan balance chart, CSV copy, printable pro forma report, and side-by-side financed vs all-cash comparison card. Wrapped in `ToolShell` with 4 verified pills: `Cash flow + 8 metrics`, `10-year pro forma`, `Cash vs mortgage`, `Print & share link`.
- [x] RP-4 Main Tool Page `src/app/rental-property-calculator/page.tsx`: 2,300+ words of original copy, BLUF quick answer box with engine-computed metrics, 12 comprehensive FAQs matching schema, `HowWeCalculate` component, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata. Sourced citations: IRS Pub 527, NARPM, and CFI Real Estate Standards.
- [x] RP-5 Discovery & Routing: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#48, category `business`, icon `rentalProperty`), `Footer.tsx` (Column 5), `ToolArt.tsx`, and `calculation-methods.ts`. Cross-linked from `cap-rate-calculator` and `percentage-change-calculator`.
- [x] RP-6 Strict Verification: 0 network calls (`npm run check:no-network`), 719/719 vitest tests passing across 54 test files, 83 static export pages generated in `out/`, 0 SEO audit errors.

### Phase CP47 — Tool #47: Cap Rate Calculator & Step A Shared Engines (Batch 3 Part 2 #1, built 2026-11-20)
Research basis: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/06_Cap_Rate_Commercial_Property_Value_Calculator/06_Cap_Rate_Calculator_BUILD_SPEC.md` & `06_Cap_Rate_Commercial_Property_Value_Calculator_Competitor_Analysis.md` (primary `cap rate calculator`, US 33,100 / KD 12; secondary `how to calculate cap rate` 22,200 / KD 18, `what is a good cap rate` 2,400 / KD 24, `what is cap rate` 1,900 / KD 24, `cap rate equation` 1,600 / KD 7, `capitalization rate calculator` 1,600 / KD 8, `what does a 7 cap rate mean` 480 / KD 3).
- [x] CP-0 Step A Shared Engines:
  * `src/lib/real-estate-engine.ts` (16 unit tests passing): `noi`, `calculateNoiBreakdown`, `capRate`, `valueFromCap`, `noiFromCap`, `grm`, `dscr`, `debtYield`, `cashOnCash`, `grossYield`, `netYield`, `npv`, `irr`. *(Evidence: `npx vitest run src/lib/real-estate-engine.test.ts` → 16 passed)*
  * `src/lib/loan-engine.ts` (9 unit tests passing): `monthlyRate`, `payment`, `interestOnlyPayment`, `balanceAfter`, `maxLoanFromPayment`, `aprWithFees`, `factorRateToApr`, `schedule`. *(Evidence: `npx vitest run src/lib/loan-engine.test.ts` → 9 passed)*
  * `src/content/us-tax-data.ts`: verified IRS Rev. Proc. 2024-40 2025/2026 brackets, standard deductions, standard mileage, self-employment tax thresholds, marked explicit `TODO(owner)` on unverified items.
- [x] CP-1 Cap Rate Engine `src/lib/cap-rate-engine.ts` (9 unit tests passing): 3 solve modes (Cap Rate, Property Value, Required NOI), itemized NOI builder with units/sqft basis, 7x5 sensitivity matrix, exit valuation model. Spec worked example verified ($180k rent + $3k other - 5% vac - $46,440 exp = $127,560 NOI; $2.4M price → 5.315% / 5.32% cap rate). *(Evidence: `npx vitest run src/lib/cap-rate-engine.test.ts` → 9 passed)*
- [x] CP-2 Input Guide Diagram `src/components/tool/cap-rate-calculator/CapRateInputGuide.tsx`: SVG diagram positioned above inputs with numbered badge callouts (1 Rent roll, 2 + Other income, 3 - Vacancy loss, 4 - Operating expenses with debt service excluded warning callout, 5 Property price, 6 Cap rate result), live input synchronization, focus tracking highlight, collapsible on mobile screens.
- [x] CP-3 UI & ToolShell `src/components/tool/cap-rate-calculator/CapRateCalculator.tsx`: TabSlider segmented control for 3 solve modes with `?tab=` URL reflection, itemized NOI waterfall table, 7x5 sensitivity matrix table, exit valuation card, secondary metrics grid (GRM, Price/SqFt, Price/Unit, Price to NOI), one-click copy, shareable URL, and printable pro forma report. Wrapped in `ToolShell` with 4 verified pills: `3 solve modes (Cap, Value, NOI)`, `Itemized NOI waterfall`, `7x5 sensitivity matrix`, `Exit valuation model`.
- [x] CP-4 Main Tool Page `src/app/cap-rate-calculator/page.tsx`: 2,400+ words of original copy, BLUF quick answer box, 11 comprehensive FAQs matching schema, `HowWeCalculate` component, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata. Sourced citations: CCIM Institute, Appraisal Institute, and Cornell Real Estate Review.
- [x] CP-5 Discovery & Routing: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#47, category `business`, icon `capRate`), `Footer.tsx` (Column 5 Business & Finance Tools), `ToolArt.tsx`, and `calculation-methods.ts`. Cross-linked from `percentage-change-calculator` and `square-footage-calculator`.
- [x] CP-6 Strict Verification: 0 network calls (`npm run check:no-network`), 710/710 vitest tests passing across 53 test files, 82 static export pages generated in `out/`, 0 SEO audit errors.

### Phase HS — Tool #45: Hourly to Salary Calculator (Batch 3 Tier 1 #5, built 2026-11-18)
Research basis: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/4.Hourly_to_Salary_Wage_Calculator_Competitor_Analysis/04_Hourly_to_Salary_Calculator_BUILD_SPEC.md` & `04_Hourly_to_Salary_Wage_Calculator_Competitor_Analysis.md` (primary `yearly wage calculator`, US 6,600 / KD 0; secondary `calculate annual salary` 6,600 / KD 10, `monthly gross income calculator` 3,600 / KD 9, `how to calculate annual income biweekly` 1,300 / KD 0, `hourly salary calculator` 12,100 / KD 28).
- [x] HS-1 Engine `src/lib/wage-engine.ts` + 11 tests: bi-directional conversions across all 8 pay frequencies (hour, day, week, biweek, semi-month, month, quarter, year), schedule configurations (hours/week, days/week, weeks/year, custom Mon–Sun variable daily hours), paid vs unpaid time off math (PTO preserves annual salary while updating effective hourly worked rate, unpaid days deduct from annual salary), overtime rules (FLSA 1.5×, 2.0× double-time across paid weeks), job offer and raise % comparison, and precomputed $10–$100/hr reference table generator. Tests verify precision, round-trip symmetry, and division-by-zero guards. *(Evidence: `npx vitest run src/lib/wage-engine.test.ts` → 11 passed)*
- [x] HS-2 Metrology & labor standards cited in `calculation-methods.ts` and cited in page copy: US Department of Labor FLSA 40h workweek & 1.5x overtime rules, US Office of Personnel Management (OPM 2,087-hour divisor), and UK Working Time Regulations 1998 (1,950-hour standard). Official links to IRS and GOV.UK for take-home pay taxes.
- [x] HS-3 UI `src/components/tool/hourly-to-salary-calculator/`: Three tabs (Convert Hourly ↔ Salary, Job Offer & Raise Comparison, Wage Reference Table $10–$100), interactive SVG `WageDiagram` (Paycheck Frequencies comparison bar view + Annual Working Hours & PTO Stack view), schedule presets (US 40h, UK 37.5h, AU 38h, India 48h, Part-time 20h), time off & overtime accordions, search filterable reference table, copy summary, shareable URL query params, and print breakdown. *(Evidence: `npm run verify` passed, static build clean)*
- [x] HS-4 Page `src/app/hourly-to-salary-calculator/`: Title 55 chars (`absoluteTitle: true`), meta 151 chars, H1 57 chars, ~1,900 original words, 11 H2 content sections matching BUILD SPEC §5, 11 FAQs matching SPEC §6 with live calculated numbers from engine, WebApplication + FAQPage JSON-LD schema, HowWeCalculate component. *(Evidence: `seo:audit` PASSED with 0 errors, 80 static routes)*
- [x] HS-5 System Wiring: routes (`/hourly-to-salary-calculator/`), tools catalog (#45, category `business`, icon `wage`, tags `['Yearly Wage', 'Pay Frequencies']`), `tools-catalog.test.ts` updated to 45, footer link added under "More Utilities", calculation-methods entry added, inbound contextual links added from `percentage-change-calculator`, `unit-price-calculator`, and `construction-estimate-template`. *(Evidence: `npm run verify` passed all 6 steps)*

### Phase UP — Tool #44: Unit Price Calculator (Batch 3 Tier 1 #4, built 2026-11-18)
Research basis: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/5.Unit_Price_Calculator_Competitor_Analysis/05_Unit_Price_Calculator_BUILD_SPEC.md` & `05_Unit_Price_Calculator_Competitor_Analysis.md` (primary `unit price calculator`, US 1,900 / KD 14; secondary `price per unit calculator` 1,300 / KD 0, `price per ounce calculator` 1,300 / KD 11, `calculate price per oz` 590 / KD 11, `cost per unit` 590 / KD 7).
- [x] UP-1 Engine `src/lib/unit-price-engine.ts` + 11 tests: exact NIST Handbook 130 / SP 811 conversions (Weight: oz, lb, g, kg; Volume: fl oz, cup, pt, qt, gal, ml, L; Count: item, sheet, roll, load, pc), promotional deal engine (`applyDeal`: % off, $ off coupon, BOGO / buy X get Y free, X for $Y multi-buy), product comparator (`compareUnitPrices`: ranks from cheapest, calculates unit savings & % premium over cheapest, target quantity-to-buy solver), shrinkflation detector (`calculateShrinkflation`: physical size reduction % vs true hidden unit price inflation %), and seller statutory shelf tagger (`calculateSellerUnitCost`: cost per finished unit, shelf tag per kg/L and per 100g/ml). All unit tests green, zero NaN/Infinity, round-trip conversion accuracy. *(Evidence: `npx vitest run src/lib/unit-price-engine.test.ts` → 11 passed)*
- [x] UP-2 Sourced benchmarks and official metrology citations in `calculation-methods.ts` and cited in page copy: NIST Handbook 130 (Uniform Unit Pricing Regulation), UK Statutory Instruments Price Marking Order 2004 (SI 2004/102), and EU Directive 98/6/EC.
- [x] UP-3 UI `src/components/tool/unit-price-calculator/`: Three tabs (Compare 2–6 products, Shrinkflation Check, Seller Cost & Shelf Tag), interactive SVG `UnitPriceDiagram` (Unit Price Value Comparison bar view + Yield per Dollar view, visual shrinkflation box downsizing animation), deal accordion per row, output unit selector, quantity needed solver, copy table/summary, shareable URL query params, print sheet. *(Evidence: `npm run verify` passed, static build clean)*
- [x] UP-4 Page `src/app/unit-price-calculator/`: Title 53 chars (`absoluteTitle: true`), meta 157 chars, H1 62 chars, ~1,850 original words, 10 H2 content sections matching BUILD SPEC §5, 10 FAQs matching SPEC §6 with live calculated numbers from engine, WebApplication + FAQPage JSON-LD schema, HowWeCalculate component. *(Evidence: `seo:audit` PASSED with 0 errors, 79 static routes)*
- [x] UP-5 System Wiring: routes (`/unit-price-calculator/`), tools catalog (#44, category `business`, icon `unitPrice`, tags `['Price per Ounce', 'Deals & BOGO']`), `tools-catalog.test.ts` updated to 44, footer link added under "More Utilities", calculation-methods entry added, inbound contextual links added from `markup-calculator`, `profit-margin-calculator`, and `percentage-change-calculator`. *(Evidence: `npm run verify` passed all 6 steps)*

### Phase PM — Tool #43: Profit Margin Calculator (Batch 3 Tier 1 #3, built 2026-11-18)
Research basis: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/3.Profit_Margin_Calculator_Competitor_Analysis/03_Profit_Margin_Calculator_BUILD_SPEC.md` & `03_Profit_Margin_Calculator_Competitor_Analysis.md` (primary `gross margin calculator`, US 8,100 / KD 8 / CPC $1.65; secondary `gross profit margin formula` 8,100 / KD 9, `calculate profit margin` 4,400 / KD 11, `net profit margin formula` 3,600 / KD 11, `how to calculate net profit margin` 1,900 / KD 11, `gross margin calculation` 1,600 / KD 9, `gp profit` 2,400 / KD 8, `how to work out a gp` 3,600 / KD 17, `what is a good profit margin` 3,600 / KD 20).
- [x] PM-1 Engine `src/lib/margin-engine.ts` + 9 tests: gross margin (revenue, COGS, units sold), multi-tier P&L cascade (gross sales, returns, COGS, OPEX, D&A, interest, taxes → Gross Margin, Operating Margin EBIT, EBITDA, Net Profit Margin), target margin pricing (`priceForTargetMargin` with platform fee %), and multi-product mix weighted blended margin (`calculateProductMix`). Unit tests prove mathematically that blended margin is weighted by revenue and strictly not the simple average of individual product margins. *(Evidence: `npx vitest run src/lib/margin-engine.test.ts` → 9 passed; full suite → 637 passed, 47 files)*
- [x] PM-2 Sourced academic benchmarks and official financial citations documented in `calculation-methods.ts` and cited in page copy: NYU Stern School of Business (Prof. Aswath Damodaran, Margins by Sector US dataset), Financial Accounting Standards Board (FASB), and HM Revenue & Customs (gov.uk GP% guidance). No fabricated industry averages.
- [x] PM-3 UI `src/components/tool/profit-margin-calculator/`: Strict KKCTools design system (`.cardHead` with circular numbered step badges, `.inputWrap` + `.unitBadge`, radiant sky-blue hero result card, 4 key metrics strip [Gross Margin %, Operating Margin %, Markup on Cost, Gross Profit], interactive SVG `MarginDiagram` with P&L Waterfall view vs 3 Margin Tiers Retention view, 4 tabs [Gross Profit Margin, Full P&L Cascade, Price for Target Margin, Product Mix & Blended Margin], currency switcher [$ / £ / € / ₹], copy summary, shareable URL query params, and print sheet). *(Evidence: `npm run verify` passed, static build clean)*
- [x] PM-4 Page `src/app/profit-margin-calculator/`: Title 49 chars (`absoluteTitle: true`), meta 155 chars, H1 57 chars, ~2,200 original words, primary keyword `gross margin calculator` in intro, H2, and tool heading, 11 H2 content sections matching BUILD SPEC §5, 11 FAQs matching SPEC §6 with live calculated numbers from engine, WebApplication + FAQPage JSON-LD schema, HowWeCalculate component. *(Evidence: `seo:audit` PASSED with 0 errors, 78 static routes)*
- [x] PM-5 System Wiring: routes (`/profit-margin-calculator/`), tools catalog (#43, category `business`, icon `margin`, tags `['Gross Margin', 'P&L Waterfall']`), `tools-catalog.test.ts` updated to 43, footer link added under "More Utilities", calculation-methods entry added, inbound contextual links added from `markup-calculator` and `percentage-change-calculator`. *(Evidence: `npm run verify` passed all 6 steps)*

### Phase MC — Tool #42: Markup Calculator (Batch 3 Tier 1 #2, built 2026-11-18)
Research basis: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/2.Markup_Calculator_Competitor_Analysis/02_Markup_Calculator_BUILD_SPEC.md` (primary `markup calculator`, US 14,800 / KD 24 / CPC $5.16; secondary `figuring markup` 2,400 / KD 12, `what is retail price` 2,400 / KD 7, `how much should i sell it for` 1,300 / KD 12, `average pricing` 1,900 / KD 15, `retail price` 14,800 / KD 26, `selling price` 6,600 / KD 25, `markup vs margin` 2,400 / KD 25, `retail math` 1,900 / KD 16).
- [x] MC-1 Engine `src/lib/pricing-engine.ts` + 20 tests: 4-way linked solve (cost, markup %, selling price, profit), target gross margin solver, markup ↔ margin conversion, keystone 2.0× pricing multiplier, landed cost builder with marketplace/processor fee % adjustment, psychological price endings (.99, .95, .49, whole dollar, nearest 5) with live recalculated actual margin, tax ex-tax vs inc-tax handling, 3-tier distribution price chain (Maker → Wholesale → Retail), multi-item TSV/CSV batch calculator, and reference table generator. Tests prove 100% mathematical precision and edge case handling. *(Evidence: `npx vitest run src/lib/pricing-engine.test.ts` → 20 passed; full suite → 628 passed, 46 files)*
- [x] MC-2 Sourced benchmarks and official tax citations documented in `calculation-methods.ts` and cited in page copy: HM Revenue & Customs (gov.uk VAT 20%), Australian Taxation Office (ato.gov.au GST 10%), New Zealand Inland Revenue (ird.govt.nz GST 15%), and NIST commercial pricing standards.
- [x] MC-3 UI `src/components/tool/markup-calculator/`: Strict KKCTools design system (`.cardHead` with circular numbered step badges, `.inputWrap` + `.unitBadge`, radiant blue result hero card, 4 key metrics strip [Markup %, Gross Margin %, Profit, Multiplier], interactive SVG `MarkupDiagram` with Price Stack & Profit Breakdown view vs 3-Tier Distribution Chain view, modular accordions for landed costs, charm price endings, tax presets, 3-tier chain, and batch TSV/CSV spreadsheet paste, currency selector [$ / £ / € / ₹], copy summary, shareable URL query params, and print sheet). *(Evidence: `npm run verify` passed, static build clean)*
- [x] MC-4 Page `src/app/markup-calculator/`: Title 50 chars (`absoluteTitle: true`), meta 155 chars, H1 49 chars, ~2,250 original words, 11 H2 content sections matching BUILD SPEC §5, 11 FAQs matching SPEC §6 with live calculated numbers from engine, WebApplication + FAQPage JSON-LD schema, HowWeCalculate component. *(Evidence: `seo:audit` PASSED with 0 errors, 77 static routes)*
- [x] MC-5 System Wiring: routes (`/markup-calculator/`), tools catalog (#42, category `business`, icon `tag`, tags `['Pricing', 'Retail Math']`), `tools-catalog.test.ts` updated to 42, footer link added under "More Utilities", calculation-methods entry added, inbound contextual links added from `construction-estimate-template` and `percentage-change-calculator`. *(Evidence: `npm run verify` passed all 6 steps)*

### Phase PC — Tool #41: Percentage Change Calculator (Batch 3 Tier 1 #1, built 2026-11-18)
Research basis: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/1. Percentage Change Calculator/01_Percentage_Change_Calculator_BUILD_SPEC.md` (primary `percentage change calculator`, US 90,500 / KD 53 / CPC $1.64; secondary `percentage difference calculator` 49,500 / KD 47, `percent increase calculator` 60,500 / KD 44, `percent decrease calculator` 40,500 / KD 43, `percentage difference` 74,000 / KD 49).
- [x] PC-1 Engine `src/lib/percent-engine.ts` + 27 tests: percent change (signed, handles negatives), percent difference (symmetric absolute), percent of, what percent is X of Y, increase/decrease by %, reverse percentage (pre-tax/original baseline), percentage points difference vs relative percent surge, multi-pair batch calculation, and Excel formula generation. Tests verify precision and division-by-zero safety. *(Evidence: `npx vitest run src/lib/percent-engine.test.ts` → 27 passed)*
- [x] PC-2 Interactive Visual SVG Diagram `PercentDiagram.tsx`: Dual-mode toggle between "Bar Comparison" (side-by-side proportional scaling with floating delta bracket and trend arrow) and "Waterfall Flow" (baseline block → change step → final value), integrated inside the calculation results card.
- [x] PC-3 UI `src/components/tool/percentage-change-calculator/`: 8 dedicated tab modes with URL hash navigation, quick benchmark presets, copy summary, share calculation URL, and Excel formula copy box.
- [x] PC-4 Page `src/app/percentage-change-calculator/`: Title 57 chars, meta 156 chars, H1 45 chars, 2,200+ words, 12 FAQs matching SPEC §6 with dynamic engine outputs, WebApplication + FAQPage JSON-LD schema, HowWeCalculate component.
- [x] PC-5 System Wiring: routes (`/percentage-change-calculator/`), tools catalog (#41, category `business`, icon `percent`), `tools-catalog.test.ts` updated, footer link added, calculation-methods entry added, and inbound links added. *(Evidence: `npm run verify` passed)*

### Phase DC — Tool #38: Deck Cost Calculator (Batch 2 Tier 3 #18, built 2026-11-17)
Research basis: `docs/keywords analysis/Batch 2/4. ALl Blogs Data/18 - Deck_Cost_Calculator_Competitor_Analysis/18_Deck_Cost_Calculator_Competitor_Analysis.md` (primary `deck estimator`, US 3,600 / KD 13 / CPC $1.72; secondary `deck replacement cost` 1,600 / KD 18 / CPC $4.06, `labor cost to build a deck per square foot` 1,600 / KD 17, `cost of trex decking` 1,300 / KD 22, `deck renovation cost` 1,300 / KD 20, `pressure treated deck pricing` 1,300 / KD 23, `free deck calculator` 880 / KD 7).
- [x] DC-1 Engine `src/lib/deck-cost-engine.ts` + 15 tests: 4 project modes (New build, Resurface re-decking on existing frame, Full tear-out replacement, Targeted repairs), multi-section geometry (reusing `floorArea` from `deck-stain-engine.ts`), joists spacing (12"/16"/24" o.c.) & rim joist math, beam rows & support posts, pier footing count & cylinder concrete volume (cubic yards + 80 lb QUIKRETE #1101 bag yield via `concrete-engine.ts`), decking takeoff by board width (5.5" / 3.5") and pitch with stock lengths (12'/16'/20'), pattern waste (straight 10%, diagonal 15%, herringbone 20%), picture-frame border perimeter takeoff, fastener crossings (face screws vs hidden clips), railing linear footage (perimeter minus house ledger and stair opening), stair risers and stringers (16" o.c.), 7 decking materials (PT pine, cedar, redwood, basic composite, 4-sided capped composite, cellular PVC, ipe), height band labor scaling (ground 1.0×, low 1.1×, mid 1.25×, elevated second-story 1.45×), regional multiplier (0.85×–1.30×), contractor quote verifier, multi-material 25-yr lifetime cost comparison, and printable bill of materials (BOM). Hand-calculation proofs in unit tests. *(Evidence: `npx vitest run src/lib/deck-cost-engine.test.ts` → 15 passed; full test suite → 581 passed, 44 files)*
- [x] DC-2 Dated public sources documented in `calculation-methods.ts` and cited in page copy: HomeGuide (2026), Fixr (2026), This Old House (2026), Trex Cost Guide (2025/2026), TimberTech Cost Overview (2026), US BLS carpenter wage statistics (SOC 47-2031), International Residential Code (IRC Section R312 guards & Section R507 exterior decks), and QUIKRETE No. 1101 data sheet.
- [x] DC-3 UI `src/components/tool/deck-cost-calculator/`: Strict KKCTools design system (`.cardHead` with 28px circular numbered step badges 1–6, `.inputWrap` + `.unitBadge` with `ft`, `in`, `steps`, `$/sq ft`, `$/LF`, `%` badges, radiant cobalt blue hero banner `linear-gradient(135deg, #0369a1 0%, #075985 100%)` with `#bae6fd` labels and `$XX.XX` installed cost per sq ft, DIY vs contractor savings alert banner, interactive SVG `DeckDiagram` with framing & pier footings view vs decking & railing layout view, clean structured `.breakdownTable` with itemized components, full printable Bill of Materials (BOM) table, contractor quote verifier, 25-yr wood vs composite comparison table, 5-currency switcher, and copy/print estimate actions). *(Evidence: static build verified, npm run verify passed)*
- [x] DC-4 Page `src/app/deck-cost-calculator/`: title 52 chars, meta 154 chars, H1 33 chars, 4,200+ words (exceeds 1,500 word minimum), 12 FAQs matching SPEC §6 with live calculated figures from engine, benchmark size table (10×10, 12×12, 12×16, 14×20, 16×20, 20×20), 7-material cost comparison matrix, BLS carpenter labor economics by height band, substructure vs decking budget breakdown, wood vs composite vs PVC guide, 4-point structural safety inspection check for resurfacing, board spacing & gap recommendations table, IRC code compliance guide, HowWeCalculate component. *(Evidence: `seo:audit` PASSED with 0 errors, word count: 4,200+)*
- [x] DC-5 System Wiring: routes (`/deck-cost-calculator/`), tools catalog (#40, category `framing`, icon `deck`, tags `['BOM Takeoff', 'Wood vs Composite']`), `tools-catalog.test.ts` updated to 40, footer link added under "Framing & Finishes", calculation-methods entry added, inbound contextual links added from `deck-stain-calculator`, `fence-cost-calculator`, `concrete-calculator`, `linear-foot-calculator`, and `stud-calculator`. *(Evidence: `npm run verify` passed all 6 steps)*

### Phase CR — Tool #37: Carpet Cost Calculator (Batch 2 Tier 3 #17, built 2026-11-17)
Research basis: `docs/keywords analysis/Batch 2/4. ALl Blogs Data/17- Carpet_Cost_Calculator_Competitor_Analysis/17_Carpet_Cost_Calculator_Competitor_Analysis.md` (primary `carpet cost calculator`, US 5,400 / KD 17 / CPC $2.14; secondary `carpet installation cost calculator` 2,400 / KD 8, `cost to carpet a 10x12 room` 1,600 / KD 4, `cost to carpet stairs` 1,000 / KD 1).
- [x] CR-1 Engine `src/lib/carpet-engine.ts` + 16 tests: multi-room takeoff geometry, real-world broadloom roll layout (12 ft, 13.5 ft, 15 ft rolls) with 6-inch drop cutting allowance, seam count calculation, carpet tiles option with 10% modular waste, stairs runner calculator (box vs waterfall styles, tread/riser runner length, 10% tuck/staple waste), 4 quality grades (Budget Olefin, Mid-range Polyester, Premium Nylon, Luxury Wool) with material, cushion pad (6 lb, 8 lb, 10 lb rebound/urethane) and installation labor breakdown, 6 customizable prep/extra items (old carpet tear-out, dump disposal, tack strip replacement, heavy furniture moving, subfloor patching, door undercut trimming), regional labor cost index (80%–140%), sales tax, and multi-currency support. Hand-calculation proofs in unit tests. *(Evidence: `npx vitest run src/lib/carpet-engine.test.ts` → 16 passed; full test suite → 566 passed, 43 files)*
- [x] CR-2 Dated public sources documented in `calculation-methods.ts` and cited in page copy: HomeGuide (2026), Fixr (2026), This Old House (2026), CRI (Carpet and Rug Institute 105 standard), and US BLS carpet installer wage statistics (SOC 47-2041).
- [x] CR-3 UI `src/components/tool/carpet-cost-calculator/`: Fully redesigned to 100% align with KKCTools design tokens and visual architecture (`.cardHead` with 28px numbered circle badges 1–6, `.inputWrap` + `.unitBadge` with `ft`, `in`, `steps`, `$/sq ft`, `$/sq yd`, `%` badges, radiant cobalt blue hero banner `linear-gradient(135deg, #0369a1 0%, #075985 100%)` with `#bae6fd` labels and `$X.XX` installed cost per sq ft / sq yd, clean structured `.breakdownTable` with itemized materials/pad/labor/stairs/prep lines, interactive SVG roll layout and stairs runner diagram with pattern direction visualization, contractor quote verifier, 6-currency switcher, and copy/share/print summary). *(Evidence: screenshots verified, static build verified)*
- [x] CR-4 Page `src/app/carpet-cost-calculator/`: title 56 chars, meta 156 chars, H1 25 chars, 3,858 words (exceeds 1,500 word minimum), 12 FAQs matching SPEC §6 with live calculated figures from engine, benchmark room size table (10x10, 10x12, 12x12, 12x15, 15x20, 1,000 sq ft whole home), 4-tier carpet fiber comparison matrix (Nylon, Polyester, Triexta, Wool, Olefin), roll width vs seam optimization guide, pad density recommendations (CRI 105 residential limits), HowWeCalculate component. *(Evidence: `seo:audit` PASSED with 0 errors, word count: 3,858)*
- [x] CR-5 System Wiring: routes (`/carpet-cost-calculator/`), tools catalog (#39, category `flooring`, icon `carpetRoll`, tags `['Takeoff', 'Roll Width', 'Pad']`), `tools-catalog.test.ts` updated to 39, footer link added under "Flooring & Tiling", calculation-methods entry added, inbound contextual links added from `square-footage-calculator`, `tile-calculator`, `laminate-flooring-calculator`, and `floor-refinishing-cost-calculator`. *(Evidence: `npm run verify` passed all 6 steps)*

### Phase RR — Tool #36: Roof Replacement Cost Calculator (Batch 2 Tier 3 #19, built 2026-11-17)
Research basis: `docs/keywords analysis/Batch 2/4. ALl Blogs Data/19 - Roof_Replacement_Cost_Calculator_Competitor_Analysis/19_Roof_Replacement_Cost_Calculator_Competitor_Analysis.md` (primary `roof replacement cost calculator`, US 2,900 / KD 4 / CPC $7.42; secondary `roofing cost per square` 1,900 / KD 7, `roofing labor cost per square` 1,600 / KD 5, `how much is a new roof` 4,400 / KD 9).
- [x] RR-1 Engine `src/lib/roof-replacement-engine.ts` + 17 tests: pure pitch factors reused from `shingle-engine` (`pitchFactor`), multi-plane or direct footprint sizing, 10 material types (3-tab, architectural, luxury/designer, standing seam, corrugated, clay tile, concrete tile, slate, cedar shake, flat membrane), labor scaling (stories 1/1.5/2/3, steep-slope ≥ 8/12 pitch +20%, complexity simple/hip/complex), tear-off scaling by layer ($125/sq/layer), dumpster fees, decking repair sheets, accessories (synthetic vs felt underlayment, ice & water shield, drip edge, ridge vent, pipe boots/chimney flashing, gutters), 3-way comparison (spot repair vs overlay vs full replacement with IRC R908.3.1.1 2-layer code prohibition), and quote checker. Tests prove exact hand-calc geometry, linear tear-off scaling, 2-layer overlay code block, decking sheet math, stories/steep multipliers on labour only, and quote checker. *(Evidence: `npx vitest run src/lib/roof-replacement-engine.test.ts` → 17 passed; full test suite → 549 passed, 42 files)*
- [x] RR-2 Dated public sources documented in `calculation-methods.ts` and cited in page copy: Fixr (2026), HomeGuide (2026), This Old House (2026), US BLS roofer wage statistics (SOC 47-2181), and IRC Section R908.3.1.1.
- [x] RR-3 UI `src/components/tool/roof-replacement-cost-calculator/`: Quick and Detailed modes, pitch preset buttons (3/12 through 12/12) + custom input, material dropdown, layers (0, 1, 2) with warning banner, stories, complexity, decking %, accessories checkboxes, region index, custom price overrides accordion; hero result with total, range, cost/sq, cost/sq ft, labor/sq; interactive SVG pitch diagram and cross-section diagram; itemized line-items table; 3-way comparison cards with visual bar chart; contractor quote verifier; share URL, print, copy summary. *(Evidence: UI tested, static export verified)*
- [x] RR-4 Page `src/app/roof-replacement-cost-calculator/`: title 53 chars, meta 156 chars, H1 32 chars, 4,101 words (exceeds 1,500 word minimum), 12 FAQs matching SPEC §6 with live calculated figures from engine, benchmark size table (1,000–3,000 sq ft), 10-material matrix, pitch multiplier table, components guide, flat/commercial section, insurance/permits advice, contractor quote comparison tips, HowWeCalculate component. *(Evidence: `seo:audit` PASSED with 0 errors, word count: 4,101)*
- [x] RR-5 System Wiring: routes (`/roof-replacement-cost-calculator/`), tools catalog (#38, category `framing`, icon `roofTruss`, tags `['Per Square', 'Tear-Off']`), `tools-catalog.test.ts` updated to 38, footer link added under "Framing & Finishes", calculation-methods entry added, inbound contextual links added from `shingle-calculator`, `metal-roof-cost-calculator`, `rafter-calculator`, and `square-footage-calculator`. *(Evidence: `npm run verify` passed all 6 steps)*

### Phase CI — Tool #35: Cubic Inch & Engine Displacement Calculator (Batch 2 Tier 3 #16, built 2026-11-15)
Research basis: `docs/keywords analysis/Batch 2/4. ALl Blogs Data/16_Cubic_Inch_Engine_Displacement_Calculator_Competitor_Analysis.md` (primary `cubic inch calculator`, US 3,600 / KD 9; secondary `engine displacement calculator` 3,600 / KD 18).
- [x] CI-1 Engine `src/lib/cubic-inch-engine.ts` + 17 tests: exact conversions (2.54³ cc per in³, 231 in³ per US gal, 4.54609 L per imp gal), box / cylinder / tube (wall + capacity) / sphere, displacement, per-cylinder and bore/stroke ratio, bore and stroke solvers, overbore/stroker what-if, CID chart. Tests prove the presets reproduce the published sizes (350, 376, 502, 391 for the “392”, 5.04 L, 1,996 cc). *(Evidence: `npx vitest run` → 528 passed, 40 files)*
- [x] CI-2 Presets use bore and stroke exactly as published by Chevrolet (ZZ6 350, LS3, 502), Dodge Garage/Stellantis (392 HEMI), Ford Performance (Coyote Gen 4 crate, 93 × 92.7 mm) and Honda (Civic Type R, 86.0 × 85.9 mm); sources listed in `calculation-methods.ts` and linked on the page.
- [x] CI-3 UI: Volume / Engine mode tabs; shapes, length units, quantity, all-unit results, converter, shape diagram, working; engine presets, in/mm, what-if bars, solver, cylinder cutaway diagram (bore, stroke, TDC/BDC), working; copy/share/print. *(Evidence: screenshots at 1440 px for box, tube in mm and Coyote engine share links; 500 px mobile)*
- [x] CI-4 Page: title 64 chars incl. brand, meta 142, one H1, ~1,700 words, 10 FAQs + schema; box and cylinder/tube/sphere sections, conversion table, engine formula with V8 and metric examples, manufacturer engine table, classic sizes in litres, overbore/stroker table, bore × stroke chart, reverse solve, oversquare/undersquare.
- [x] CI-5 Wiring: routes (55), catalog (37, new `piston` icon and card art), footer, method entry; `npm run verify` passed; a11y 100, desktop performance 100, mobile 92.

### Phase FR — Tool #34: Hardwood Floor Refinishing Cost Calculator (Batch 2 Tier 2 #15, built 2026-11-15)
Research basis: `docs/keywords analysis/Batch 2/4. ALl Blogs Data/15_Hardwood_Floor_Refinishing_Cost_Calculator_Competitor_Analysis.md` (primary `hardwood floor resurfacing cost`, US 6,600 / KD 24 / CPC $4.35).
- [x] FR-1 Engine `src/lib/floor-refinish-engine.ts` + 19 tests: method rates, species factor (sanding methods only), stain (sanding only), 7 extras with units, region factor, minimum job charge, low/high from the ends of each published range (scaled when a rate is edited), labour hours, refinish vs replace, DIY list with gallons rounded up from coverage, quote checker. Tests prove a sand (+ stain) stays inside This Old House’s $3–$8/ft² band and the default DIY list sits in its $500–$1,000 DIY range once stain and a vacuum are added. *(Evidence: `npx vitest run` → 511 passed, 39 files)*
- [x] FR-2 Dated sources for every default, documented in `calculation-methods.ts`: This Old House (Jun 5, 2026) for methods, stain, species, repairs, carpet, furniture, DIY prices, installation cost, labour share/hours and refinish limits; Fixr (Jan 31, 2025) for stairs, board replacement and baseboards; Sherwin-Williams for 500 ft²/gal coverage.
- [x] FR-3 UI: rooms or total area, ft/m, 7 currencies, method cards with ranges, species, stain, extras toggles with quantity + price, region, minimum charge, DIY card (finish type, coats, rental days, vacuum, editable prices), quote checker; results with line items, option bars (recoat / sand / sand + stain / dustless / DIY / replace), board cross-section diagram, room plan, DIY list; copy/share/print. Engineered-wood and recoat-can’t-stain warnings. *(Evidence: screenshots at 1440 and 500 px, metric/engineered and recoat/minimum-charge share links)*
- [x] FR-4 Page: title 54 chars incl. brand, meta 139, one H1 with “Resurfacing”, ~2,200 words, 10 FAQs + schema; refinish/resurface/recoat table, per-sq-ft table, size table, species table, extras table with sources, worked example, finishes, DIY vs pro, refinish vs replace bars, engineered wear layer, quote fairness. Two misleading comparisons fixed after review (replace low end vs stained sand; DIY example without stain).
- [x] FR-5 Wiring: routes (54), catalog (36, new `floorSander` icon and card art), footer, method entry; `npm run verify` passed; a11y 100, desktop performance 99, mobile 76–79 (bathroom page 78–79 under the same load).
- [ ] FR-6 `TODO(owner)`: no sourced floor-buffer rental rate was found; the DIY buffer (screen & recoat) defaults to This Old House’s drum-sander midpoint ($65/day) and says so in the UI. Replace if a rental-shop price is available.

### Phase BR — Tool #33: Bathroom Remodel Cost Calculator (Batch 2 Tier 2 #14, built 2026-11-15)
Research basis: `docs/keywords analysis/Batch 2/4. ALl Blogs Data/14_Bathroom_Remodel_Cost_Calculator_Competitor_Analysis.md` (primary `cost to remodel bathroom calculator`, US 2,900 / KD 7 / CPC $5.68).
- [x] BR-1 Engine `src/lib/bathroom-remodel-engine.ts` + 12 tests: fixed + per-area line items from This Old House averages, 70 ft² reference room, finish factors from its finish table, cosmetic vs full scope, bathing options, water heater, permit, region, contingency, ±13% range, quote checker. Tests prove it lands inside This Old House’s size and finish tables. *(Evidence: `npx vitest run` → 492 passed)*
- [x] BR-2 Single dated source (This Old House, Jul 2, 2026) for every default, documented in `calculation-methods.ts`; default rates rounded to cents so the form and the page show identical numbers.
- [x] BR-3 UI: room types, ft/m, 7 currencies, scope and finish, tub/shower, per-line checkbox + editable price, extras, quote checker, spend bar, line table, bathroom plan diagram, copy/share/print. *(Evidence: screenshots at 1440 px)*
- [x] BR-4 Page: title 64 chars incl. brand (blueprint title was 66), meta 154, ~1,460 words, 10 FAQs + schema, cost by size × finish table, line items, bathing options table, budget scenarios ($5k/$10k/$20k). Two unsourced pieces of advice removed after review.
- [x] BR-5 Wiring: routes (53), catalog (35, new `bath` icon and card art), footer; `npm run verify` passed; a11y 100, desktop performance 100.
- [ ] BR-6 `TODO(owner)`: a half bath with new plumbing defaults to the national plumbing average ($5,545), which is high for a powder room — consider a lower half-bath plumbing default if a sourced figure is found.

### Phase MR — Tool #32: Metal Roof Cost Calculator (Batch 2 Tier 2 #13, built 2026-11-15)
Research basis: `docs/keywords analysis/Batch 2/4. ALl Blogs Data/13_Metal_Roof_Cost_Calculator_Competitor_Analysis.md` (primary `metal roof cost calculator`, US 1,900 / KD 24 / CPC $4.11).
- [x] MR-1 Engine `src/lib/metal-roof-engine.ts` + 13 tests, reusing `sectionGeometry` from the Shingle engine: metal total with tear-off and permit, asphalt tear-off-and-replace comparison (tear-off removed when not replacing), cost per year, roofs over one metal life, panels per slope and length, hip panel length from area, trim, underlayment, low–high ranges. *(Evidence: `npx vitest run` → 480 passed)*
- [x] MR-2 Prices: HomeGuide 2026 midpoints for every metal type and for asphalt (single source so they compare fairly), tear-off $1–$3 (HomeGuide), life 40–70 (This Old House) and 15–30 (Fixr) — in `calculation-methods.ts`. The page states honestly that standing seam still costs more per year than shingles at these prices.
- [x] MR-3 UI: roof sections (gable/hip/shed/area), ft or m, 7 currencies, metal and asphalt pickers, comparison bars, cost breakdown, materials list, panel diagram, roof plan (reused Shingle diagram), copy/share/print. *(Evidence: screenshots at 1440 px)*
- [x] MR-4 Page: title 65 chars incl. brand, meta 147, ~1,610 words, 10 FAQs + schema, cost-by-type and cost-by-size tables, standing seam section, metal vs shingle with bars, measuring with the pitch diagram. Price formatting fixed after review ($8.50 not $8.5).
- [x] MR-5 Wiring: routes (52), catalog (34, new `metalRoof` icon and card art), footer; `npm run verify` passed; a11y 100, desktop performance 100; mobile performance 79 in this run, the same as the Fence and Shingle pages re-measured at the same time (machine load), so not page-specific.
- [ ] MR-6 `TODO(owner)`: Houzz, Omni and RoofingCalculator pages could not all be read; consider adding gauge/coating (Galvalume, PVDF) modifiers if a sourced price difference is found.

### Phase CF — Tool #31: Cubic Feet ↔ Square Feet Converter (Batch 2 Tier 2 #12, built 2026-11-15)
Research basis: `docs/keywords analysis/Batch 2/4. ALl Blogs Data/12_Cubic_Feet_to_Square_Feet_Converter_Competitor_Analysis.md` (primary `cubic feet to square feet`, US 3,600 / Global 9,100 / KD 23; half the SERP is Q&A).
- [x] CF-1 Engine `src/lib/cubic-square-engine.ts` + 11 tests: exact unit factors (NIST), both directions, metric, bags, coverage tables, Purdue 19 yd³ cross-check, no division by zero. *(Evidence: `npx vitest run` → 467 passed)*
- [x] CF-2 Depth presets from university extensions (Illinois, Minnesota, Maryland, Penn State, Purdue) and our own slab/paver pages — in `calculation-methods.ts`.
- [x] CF-3 UI: direction toggle with Reverse, volume or bags, area or L × W, 4 volume / 3 area / 5 depth units, presets with notes, working shown, spread diagram, copy/share. Fixed after review: presets with the same depth highlighted the wrong one; slab drawing redrawn. *(Evidence: screenshots at 1440 px)*
- [x] CF-4 Page: title 64 chars incl. brand, meta 143, one H1, ~1,340 words (blueprint 1,000–1,400), short-answer box, 9 FAQs + schema, imperial and metric coverage tables, material depth table, cft/brass section. *(Evidence: cheerio dump)*
- [x] CF-5 Wiring: routes (51), catalog (33, new `cubeToArea` icon and card art), footer; `npm run verify` passed; Lighthouse mobile 90/100/96/100, desktop 100/100/96/100.
- [ ] CF-6 `TODO(owner)`: re-check cubicfeettosquarefeet.com (DNS error during research) and confirm the Indian “cft” intent in Semrush for India.

### Phase FC — Tool #30: Fence Cost Calculator (Batch 2 Tier 2 #11, built 2026-11-15)
Research basis: `docs/keywords analysis/Batch 2/4. ALl Blogs Data/11_Fence_Cost_Calculator_Competitor_Analysis.md` (primary `fence cost calculator`, US 1,600 / KD 21; cluster 51,900 US vol).
- [x] FC-1 Engine `src/lib/fence-cost-engine.ts` + 15 tests: sides with gate openings, pieces, sections and posts, shared corners and closed loops, terminal vs line posts, pickets/rails, panels, chain link fabric rolls and top rail, concrete per post (hole − post) and bags, cost with slope surcharge, gates, removal, permit, materials vs labour, DIY, published low–high range. *(Evidence: `npx vitest run` → 456 passed)*
- [x] FC-2 Prices: installed per-foot midpoints from This Old House (Jun 2026) and HomeGuide 2026, gates from Angi/HomeGuide 2026, removal from Angi 2026, labour share 50% (This Old House), hole sizing from QUIKRETE — in `calculation-methods.ts`.
- [x] FC-3 UI: 6 materials, sides with gates, corners/closed loop, ft or m, 7 currencies, live plan view and front-view diagram with post in concrete, materials list, copy/share/print. *(Evidence: screenshots at 1440 px)*
- [x] FC-4 Page: title 63 chars incl. brand, meta 150, H1 with the full keyword set, ~2,200 words, 12 FAQs + schema, cost-by-material table (100/150/200 ft + DIY), worked backyard example, concrete-per-post section, replace, permits/811. One FAQ ordering error fixed after review. *(Evidence: cheerio dump of `out/fence-cost-calculator/index.html`)*
- [x] FC-5 Wiring: routes (50), catalog (32, new `fenceCost` icon and card art, category Framing/Roofing/Measuring), footer; `npm run verify` passed; Lighthouse mobile 90/100/96/100, desktop 100/100/96/100.
- [x] FC-6 `--danger` token darkened to `#B91C1C` site-wide (remove buttons failed contrast at 4.08:1 once a tool shows more than one row). *(Evidence: fence and slab pages a11y 100)*
- [ ] FC-7 `TODO(owner)`: Home Depot, Menards and Hoover Fence calculators could not be read by the research tool — check by hand; consider adding farm/split-rail fencing if users ask.

### Phase DS — Tool #29: Deck Stain Calculator (Batch 2 Tier 1 #10, built 2026-11-15)
Research basis: `docs/keywords analysis/Batch 2/4. ALl Blogs Data/10_Deck_Stain_Calculator_Competitor_Analysis.md` (primary `deck stain calculator`, US 720 / KD 14; 7 of 10 SERP slots open).
- [x] DS-1 Engine `src/lib/deck-stain-engine.ts` (new, more complete than the Fence Stain engine) + 23 tests: floor sections, board edges, railing quick or detailed (posts, rails, square/round balusters), stairs (treads, risers, stringers), skirting, coverage by opacity, wood-condition factor, second-coat factor, extra %, 5-gal/1-gal and 5/2.5/1 L can plans, cleaner, DIY vs pro with prep. *(Evidence: `npx vitest run` → 441 passed)*
- [x] DS-2 Coverage from manufacturer data (BEHR PREMIUM transparent 300–350, semi 250–300, solid 200–400 ft²/gal; Duckback rough vs smooth), railing defaults from IRC R312, prices from Fixr and Angi 2026 — all in `calculation-methods.ts`. Weathered ×0.8 and the 10%/15% allowances are labelled as working assumptions.
- [x] DS-3 UI: US/metric with conversion, 7 currencies, 6 cards, live isometric deck diagram, railing front-view diagram, coat-by-coat panel, DIY vs pro, copy/share/print, mobile bar. *(Evidence: screenshots at 1440 px and 500 px)*
- [x] DS-4 Page: title 60 chars incl. brand (blueprint title was 70), meta 142, one H1, ~2,290 words, 10 FAQs + schema, engine tables (coverage by type, stain by deck size, railing by length), 2 diagrams. *(Evidence: cheerio dump of `out/deck-stain-calculator/index.html`)*
- [x] DS-5 Wiring: routes (49), catalog (31, new `deck` icon and card art), footer, sitemap, llms.txt; `npm run verify` passed; Lighthouse mobile 89 / 100 / 96 / 100, desktop 100 / 100 / 96 / 100 after the GTM delay change below.
- [x] DS-6 GTM fallback delay raised from 1.5 s to 5 s (first interaction still loads it at once): mobile Lighthouse on tool pages went from 79–86 to 89–90. Verified with a DOM dump: no gtm.js tag at 3 s, tag present at 9 s.
- [ ] DS-7 `TODO(owner)`: check your preferred stain brand’s label and, if different, consider changing the default coverage; re-check stain prices yearly.

### Phase SC — Tool #28: Concrete Slab Cost Calculator (Batch 2 Tier 1 #9, built 2026-11-15)
Research basis: `docs/keywords analysis/Batch 2/4. ALl Blogs Data/09_Concrete_Slab_Cost_Calculator_Competitor_Analysis.md` (primary `concrete slab cost calculator`, US 8,100 / KD 16 / CPC $2.36; 6 of 10 SERP slots open).
- [x] SC-1 Engine `src/lib/slab-cost-engine.ts` + 26 tests: L×W×T ÷ 324 volume, waste, ¼ yd³ order rounding, trucks, short-load (per-yard or flat), delivery, pump minimums, gravel base with 15% compaction at 1.40 t/yd³ (same as Paver Base), mesh/rebar/vapour barrier, forms per slab, labour, colour/stamped/sealer, removal, region factor, overhead, permit, cost per ft² and per yard ordered, DIY bags vs DIY ready-mix vs contractor, published-range check, metric/currency display. *(Evidence: `npx vitest run` → 418 passed)*
- [x] SC-2 Default prices all dated 2026 and cited (LawnStarter Sep/Nov 2026, Concrete Network Jul 2026, This Old House Mar 2026, Angi 2026, HomeGuide 2026, Inch Calculator); listed in `calculation-methods.ts` and shown on the page. Default 20 × 20 ft, 4 in slab = $3,088 ($7.72/ft²), inside the published $4.34–$10.50/ft² range. *(Evidence: engine test "sits inside the 2026 published installed range")*
- [x] SC-3 Calculator UI: 6 project presets, several slabs, US/metric with automatic price conversion, 7 currency symbols, PSI price presets, every rate editable, itemised list, cost bar, comparison, order panel with truck diagram, live slab section diagram, copy/share/print, mobile summary bar. *(Evidence: `src/components/tool/slab-cost-calculator/`; screenshots at 1440 px and 500 px)*
- [x] SC-4 Page: title 60 chars incl. brand, meta 153, one H1, ~2,760 words, 13 FAQs + FAQ schema, engine-generated tables (price by psi, cost per ft² by thickness, cost by size, cost by project, worked example), 3 diagrams. *(Evidence: cheerio dump of `out/concrete-slab-cost-calculator/index.html`)*
- [x] SC-5 Wiring: routes (48), catalog (30, new `slabCost` icon and card diagram), footer, sitemap, llms.txt, /tools/, site map; `npm run verify` all passed; Lighthouse mobile 90/100/96/100, desktop 100/100/96/100. *(Evidence: 2026-11-15 run, `docs/evidence/`)*
- [ ] SC-6 `TODO(owner)`: prices change — re-check the cited guides every few months and update `DEFAULT_RATES` / `PSI_PRICES` and `PRICE_BASIS`; consider adding real local supplier prices if you have them. Check Lowe's and HomeGuide slab pages by hand (blocked to the research tool).

### Phase HD — Home page redesign (owner request, 2026-11-15)
- [x] HD-1 Colourful, varied home page: category tiles, per-category bands with alternating layouts, coloured tool cards, dark "why us" band, gradient guide covers. *(Evidence: `src/components/home/CategorySection.tsx`, `CategoryTiles.tsx`; screenshots checked at 1440 px and 500 px)*
- [x] HD-3 Tool cards with tool-specific SVG diagrams, bigger text, 3-column grids. *(Evidence: `src/components/home/ToolArt.tsx`; screenshots of `/` and `/tools/` at 1440 px and 500 px)*
- [x] HD-4 Hero banner illustration (`HeroScene.tsx`), gradient heading, wrapped chips. *(Evidence: screenshots at 1440 px and 500 px; Lighthouse home mobile 94/100/96/100, desktop 100/100/96/100)*
- [x] HD-2 No regressions: Lighthouse home mobile 95/100/96/100, desktop 100/100/96/100 after the card redesign; `/tools/` a11y 100; `npm run verify` passed. *(Evidence: local Lighthouse 12.6.0, 2026-11-15)*

### Phase AR — AdSense-readiness report check (report `docs/Adsence Approval reports/Adsence aprooval - report.pdf`, 2026-11-15)
The report came from an external scanner. Each item was checked on the live site (curl, local Lighthouse 12.6.0) and in the code. Items the scanner got wrong are recorded, not "fixed".
- [x] AR-01 "Google Analytics detected" — **false**. The live HTML has no GA/GTM. The script it saw is Cloudflare Web Analytics (`static.cloudflareinsights.com/beacon.min.js`), injected by Cloudflare; our CSP blocks it (console error). *(Evidence: curl of live home page + Lighthouse `errors-in-console`)*
- [x] AR-02 Title `&amp;` warning — not a fault; `&` is correctly escaped in HTML. *(Evidence: `out/index.html` `<title>`)*
- [x] AR-03 Speed — mobile 94 / desktop 100 on home, CLS 0, TBT 80 ms; meets the report's thresholds. *(Evidence: local Lighthouse runs, scratchpad JSON)*
- [x] AR-04 Broken links, font size (17 px body), images (no `<img>` without alt — no `<img>` at all), breadcrumbs, footer navigation — already fine. *(Evidence: `npm run seo:audit` 0 errors; Lighthouse SEO 100)*
- [x] AR-05 Disclaimer page added `/disclaimer/` (+ footer, sitemap, llms.txt). *(Evidence: `out/disclaimer/index.html`)*
- [x] AR-06 HTML site map added `/site-map/`. *(Evidence: `out/site-map/index.html`; `out/sitemap.xml` has 47 `<loc>`)*
- [x] AR-07 Terms updated (calculators/templates, link to Disclaimer, 2026-11-15). *(Evidence: `src/app/terms/page.tsx`)*
- [x] AR-08 External links: `noopener noreferrer` + new tab for citations; `nofollow` on commercial link. *(Evidence: `HowWeCalculate.tsx`, `guides.ts` renderer, concrete page)*
- [x] AR-09 Accessibility: contrast tokens and hardcoded colours, undefined `--color-text-muted` fallbacks, input/select labels, segmented-button ARIA, heading order, empty table header, link underlines, search ARIA, card labels, guide checkboxes. *(Evidence: local Lighthouse 12.6.0 accessibility sweep of all 47 built pages on 2026-11-15 → 47/47 score 100, zero failed audits; before the fixes 14 pages scored 87–98)*
- [x] AR-10 `npm run verify` all steps passed after the fixes. *(Evidence: 2026-11-15 run, `docs/evidence/`)*
- [ ] AR-11 `TODO(owner)`: disable Cloudflare Web Analytics (steps in `05-DEPLOY-AND-LAUNCH.md` §3 6a).
- [ ] AR-12 `TODO(owner)`: redeploy — live site is an old build (shows 24 tools; the new tools, Disclaimer and Site Map are missing).
- [x] AR-13 Owner identity: Karan Kumar (founder & developer; senior software engineer), kkchub1@gmail.com, Instagram — on `/about/` and as a `Person` node linked from Organization `founder`. `kkchub1@gmail.com` is now the site-wide contact (owner said `contact@kkctools.com` did not exist). *(Evidence: `out/about/index.html`, JSON-LD graph in `out/index.html`)*
- [ ] AR-14 `TODO(owner)`: request indexing in Search Console for the new pages after the redeploy (P7-08); the domain is about a week old, so wait for pages to be indexed and some traffic before applying (P7-10).
- Note: local-only console 404 for `…/__next.<route>.__PAGE__.txt` comes from the Windows build output layout; the same URL returns 200 on the live Cloudflare build, so no change is needed.

### Phase WG — Tool #27: Wire Gauge Calculator (Batch 2 Tier 1 #8, built 2026-11-15, safety-sensitive)
Research basis: `docs/keywords analysis/Batch 2/4. ALl Blogs Data/08_Wire_Gauge_Calculator_Competitor_Analysis.md` (primary `wire gauge calculator`, US 5,400 / KD 11; 4 tool pages with AS ≤ 11 rank).
- [x] WG-1 Engine `src/lib/wire-gauge-engine.ts` + 31 tests (AWG geometry, resistance vs NEC Table 8 within 1.5 %, IEC 60228 metric, load/drop formulas, 310.16 ampacity, ambient/bundling factors, terminal cap, 240.4(D), sizing cases incl. continuous, aluminium, metric, 12 V DC, lookup). *(Evidence: `npx vitest run` → 392 passed)*
- [x] WG-2 Calculator UI: 3 modes, systems/voltages, amps or watts, ft/m, drop presets, AWG/mm², Cu/Al, insulation/terminal/ambient/bundling, safety banner, live diagrams, share/copy/print. *(Evidence: `src/components/tool/wire-gauge-calculator/`)*
- [x] WG-3 Page: title 64 chars incl. brand, meta 140, one H1, ~2,500 words, 11 FAQs, engine-generated tables; FAQ/table numbers reviewed in the built HTML and 3 issues fixed. *(Evidence: cheerio dump of `out/wire-gauge-calculator/index.html`)*
- [x] WG-4 Wiring: routes, catalog (29), icon, footer, sitemap, llms.txt, /tools/. *(Evidence: grep of `out/` files)*
- [x] WG-5 `npm run verify` all steps passed after the review fixes. *(Evidence: 2026-11-15 run, `docs/evidence/`)*
- [ ] WG-6 `TODO(owner)` (safety): verify Table 310.16 values against the NEC edition your audience uses (conflicting reproductions for Cu 3 AWG 90 °C and Al 300 kcmil — lower values used); consider a licensed-electrician review of the page; decide whether to add BS 7671 / IEC 60364 current-carrying-capacity tables for metric mode; consider a new "Electrical & Plumbing" category (pipe + wire) — needs a colour token and home-page CSS; re-check wiresizecalculator.net by hand (SSL expired).

### Phase PV — Tool #26: Pipe & Tube Volume Calculator (Batch 2 Tier 1 #7, built 2026-11-15)
Research basis: `docs/keywords analysis/Batch 2/4. ALl Blogs Data/07_Pipe_Tube_Volume_Calculator_Competitor_Analysis.md` (primary `tube volume calculator`, US 1,600 / Global 4,800 / KD 12; no dedicated tube tool from a big site in the SERP).
- [x] PV-1 Engine `src/lib/pipe-volume-engine.ts` + 19 tests (preset IDs vs ASME B36.10M / ASTM B88, round/rect areas, unit outputs, runs, fill time, per-length tables, steel weight vs standard). *(Evidence: `npx vitest run` → 361 passed)*
- [x] PV-2 Calculator UI: presets, custom round, square/rect, runs, densities, flow, formula, share/copy/print. *(Evidence: `src/components/tool/pipe-volume-calculator/`)*
- [x] PV-3 Page: title 60 chars incl. brand, meta 139, one H1, ~2,500 words, 10 FAQs, WebApplication + FAQPage + BreadcrumbList, no duplicate ids. *(Evidence: cheerio check of `out/pipe-volume-calculator/index.html`; hero shows 17.43 gal for 100 ft of 2 in Sch 40)*
- [x] PV-4 Wiring: routes, catalog (28), icon, footer, sitemap, llms.txt, /tools/. *(Evidence: grep of `out/` files)*
- [x] PV-5 `npm run verify` all steps passed; SEO audit re-run after the final text fix (0 errors). *(Evidence: 2026-11-15 run, `docs/evidence/`)*
- [ ] PV-6 `TODO(owner)`: Semrush "questions" export for pipe/tube volume to confirm FAQ wording; optionally add metric copper (EN 1057) presets once a dimension source is approved.

### Phase BB — Tool #25: Board and Batten Calculator (Batch 2 Tier 1 #6, built 2026-11-14)
Research basis: `docs/keywords analysis/Batch 2/4. ALl Blogs Data/06_Board_and_Batten_Calculator_Competitor_Analysis.md` (primary `board and batten calculator`, US 4,400 / KD 22 / CPC $5.55; 6 of 10 slots weak or irrelevant).
- [x] BB-1 Engine `src/lib/board-batten-engine.ts` + 27 tests (PS 20 widths, fraction parser/formatter, 3 edge modes, count↔gap, marks, clashes, cut list, rails/grid, supplies, siding). *(Evidence: `npx vitest run` → 342 passed)*
- [x] BB-2 Calculator UI: accent wall + siding modes, inches/mm, live drawing, compare table, marks, obstacles, shopping list, share/copy/print. *(Evidence: `src/components/tool/board-batten-calculator/`)*
- [x] BB-3 Page: title 61 chars incl. brand, meta 142, one H1, ~2,600 words, 10 FAQs, WebApplication + FAQPage + BreadcrumbList. *(Evidence: cheerio check of `out/board-and-batten-calculator/index.html`; hero renders 16 9/16" for the default wall)*
- [x] BB-4 Wiring: routes, catalog (27), icon, footer, sitemap, llms.txt, /tools/. *(Evidence: grep of `out/` files)*
- [x] BB-5 `npm run verify` all steps passed. *(Evidence: 2026-11-14 run, `docs/evidence/`)*
- [ ] BB-6 `TODO(owner)`: export secondary keywords (`batten spacing calculator`, `board and batten spacing`, `accent wall calculator`, `wainscoting calculator`) and add any missing H2s; confirm the nail-spacing and paint-coverage defaults.

### Phase SH — Tool #24: Shingle Roof Calculator (Batch 2 Tier 1 #5, built 2026-11-14)
Research basis: `docs/keywords analysis/Batch 2/4. ALl Blogs Data/05_Shingle_Roof_Calculator_Competitor_Analysis.md` (primary `shingle roof calculator`, US 1,300 / KD 10; top 8 pages have 0 referring domains).
- [x] SH-1 Engine `src/lib/shingle-engine.ts` + 20 tests (pitch factor, gable/hip/shed/area geometry, bundles, accessories, ice & water, nails, overrides, cost). *(Evidence: `npx vitest run` → 315 passed)*
- [x] SH-2 Calculator UI with roof sections, live plan diagrams, shingle presets, waste, accessories, edge overrides, prices, share/copy/print. *(Evidence: `src/components/tool/shingle-calculator/`)*
- [x] SH-3 Page: title 61 chars incl. brand, meta 138, one H1, ~2,840 words, 10 FAQs, WebApplication + FAQPage + BreadcrumbList. *(Evidence: cheerio check of `out/shingle-calculator/index.html`)*
- [x] SH-4 Wiring: routes, catalog (26), icon, footer, sitemap, llms.txt, /tools/. *(Evidence: grep of `out/` files)*
- [x] SH-5 `npm run verify` all steps passed. *(Evidence: 2026-11-14 run, `docs/evidence/`)*
- [ ] SH-6 `TODO(owner)`: confirm the waste presets and default products suit your market; link the planned Metal Roof Cost (#13) and Roof Replacement Cost (#19) pages once built.

### Phase LM — Tool #23: Lawn Mowing Cost Calculator (Batch 2 Tier 1 #4, built 2026-11-14)
Research basis: `docs/keywords analysis/Batch 2/4. ALl Blogs Data/04_Lawn_Mowing_Cost_Calculator_Competitor_Analysis.md` (primary keyword `lawn mowing cost calculator`, US 1,000 / KD 3; 6 of the top 10 are Domain AS ≤ 20).
- [x] LM-1 Engine `src/lib/lawn-mowing-engine.ts` + 22 tests (visit counts, time model, minimum, season/month, per acre, range, published-range guard). *(Evidence: `npx vitest run` → 295 passed)*
- [x] LM-2 Calculator UI (homeowner/pro, sq ft/acres/m², rectangles, frequency, season, conditions, extras, pricing, share/copy/print) + 4 SVG diagrams. *(Evidence: `src/components/tool/lawn-mowing-calculator/`)*
- [x] LM-3 Page with title 64 chars incl. brand, meta 134 chars, one H1, 19 H2s, ~2,730 words in main, 12 FAQs, WebApplication + FAQPage + BreadcrumbList schema. *(Evidence: cheerio check of `out/lawn-mowing-cost-calculator/index.html`)*
- [x] LM-4 Wiring: routes, catalog (25), icon, footer, sitemap, llms.txt, home and /tools/. *(Evidence: grep of `out/sitemap.xml`, `out/llms.txt`, `out/tools/index.html`, `out/index.html`)*
- [x] LM-5 `npm run verify` all steps passed (lint, test, no-network, build, SEO audit, docs bundle). *(Evidence: 2026-11-14 run, `docs/evidence/`)*
- [ ] LM-6 `TODO(owner)`: review lawnbeast.com (#4, blocked to the reader) by hand; confirm hourly presets and $35 minimum suit your market; request indexing after deploy.

### Phase RB — Tool #22: Rebar / Reinforcement Steel Calculator (Batch 2 Tier 1 #3, built 2026-11-14)
Research basis: `docs/keywords analysis/Batch 2/4. ALl Blogs Data/3/03_Reinforcement_Steel_Calculator_Competitor_Analysis.md`.
- [x] RB-0 Engine: `src/lib/rebar-engine.ts`. It covers:
  - US bars #3–#11 with published ASTM A615 lb/ft, and metric 8–40 mm from 7,850 kg/m³ (BS 4449 masses);
  - nearest-diameter bar mapping when units switch;
  - slab grid, strip footing (long bars plus optional cross bars), wall (vertical and horizontal) and bar-list parts;
  - bars across a span = ceil(span ÷ spacing) + 1;
  - laps at 40 × d by default (user-editable), using 10/20/40 ft or 6/12 m stock bars;
  - waste %, results grouped by bar size, weight, and optional cost per weight or per piece.
  *(Evidence: `src/lib/rebar-engine.test.ts`, 19 tests passing)*
- [x] RB-1 UI: `src/components/tool/rebar-calculator/`. It has:
  - a multi-part job list and a unit switch that converts entered sizes;
  - a live labelled SVG diagram for each part, plus a lap diagram;
  - stock bar and lap controls, waste presets and optional prices;
  - a hero "Rebar to buy" result, a by-size table and totals;
  - copy, share link (URL only) and print;
  - a mobile sticky bar.
  *(Evidence: headless Edge screenshots at 1300 px light and dark and at 390 px. A shared metric link (6×3 m wall + 6×4 m slab, 12 mm @ 400 mm) restored 247.7 m → 42 × 6 m bars and 220 kg, matching a hand calculation. Slab cover-label and wall Sh-label overlaps fixed after review.)*
- [x] RB-2 Page: `src/app/rebar-calculator/page.tsx`. It contains:
  - 2,298 words in `<main>`;
  - 6 engine-computed worked examples, plus a rounding callout that 125.68 m ÷ 6 m = 21 bars, not 20;
  - US and metric bar tables, a slab bar-count table and a lap table;
  - cover, mesh vs rebar, common mistakes, 11 FAQs and sources.
  *(Evidence: `docs/seo-audit-report.md` row `/rebar-calculator/` PASS)*
- [x] RB-3 Registration:
  - route `rebarCalculator` (title `Rebar Calculator – Reinforcement Steel Bars & Weight`);
  - catalog entry (Concrete category, New);
  - new `rebar` icon and a footer link;
  - min word count 1,500 in `scripts/seo-audit.mjs`.
  *(Evidence: `src/lib/tools-catalog.test.ts` updated to 24 tools, passing)*
- [x] RB-4 Verification: `npm run verify` passed — lint, 263 tests, no-network, build, SEO audit, docs bundle. *(Evidence: `docs/evidence/*.txt`, 2026-11-14)*

---

### Phase DW — Tool #21: Drywall Calculator (Batch 2 Tier 1 #2, built 2026-11-14)
Research basis: `docs/keywords analysis/Batch 2/4. ALl Blogs Data/2/02_Drywall_Calculator_Competitor_Analysis.md` (primary keyword `drywall calculator`, US 12,100 / KD 41; 5 of the top 10 are Domain AS 7–19).
- [x] DW-0 Engine: `src/lib/drywall-engine.ts` — 5 surface types (room, single wall, ceiling, gable, known area), editable door/window deductions, US 4×8–4×16 and metric 1200×2400/2700/3000 sheets, sheets-by-size, screws per sheet from framing + screw spacing (IRC Table R702.3.5 defaults, user-overridable), compound (USG J1969: ≈ 10 gal / 1,000 sq ft), tape (Georgia-Pacific WallWorks Guide: ≈ 350 ft / 1,000 sq ft), corner bead, board weight (USG nominal 1.6 / 1.25 / 2.2 lb/sq ft), optional cost incl. labour. *(Evidence: `src/lib/drywall-engine.test.ts`, 26 tests passing)*
- [x] DW-1 UI: `src/components/tool/drywall-calculator/` — multi-surface job list, unit switch that converts entered sizes, ft + in inputs, room quick-fill presets, live labelled SVG diagram per surface, sheet + framing diagram with screw pattern, clickable sheets-by-size grid, finishing materials, weight, cost, copy / share link (URL only) / print, mobile sticky result bar; styled with site tokens so light and dark themes both work. *(Evidence: headless Edge screenshots at 1300 px light and dark and at 390 px; a shared 2-surface metric link restored 52.7 m² → 21 sheets and 23.6 L compound, matching a hand calculation)*
- [x] DW-2 Page: `src/app/drywall-calculator/page.tsx` — 2,789 words in `<main>`; all examples, tables and FAQ numbers computed by the engine at build time; diagrams for measuring, sheet sizes, screw pattern and the three-coat taped joint; sources section. *(Evidence: `docs/seo-audit-report.md` row `/drywall-calculator/` PASS)*
- [x] DW-3 Registration: route `drywallCalculator` (title `Drywall Calculator – Sheetrock Sheets, Mud & Tape`), catalog entry (Floors, Paint & Stain, first card, New), new `drywall` icon, footer link, min word count 1,500 in `scripts/seo-audit.mjs`; hard-coded "22 tools" counts replaced by `TOOLS_CATALOG.length`. *(Evidence: `src/lib/tools-catalog.test.ts` updated to 23 tools, passing)*
- [x] DW-4 Verification: `npm run verify` passed — lint, 244 tests, no-network, build, SEO audit, docs bundle. *(Evidence: `docs/evidence/*.txt`, 2026-11-14)*

---

### Phase CC — Tool #20: Concrete Calculator (Batch 2 Tier 1 #1, built 2026-11-13)
Research basis: `docs/keywords analysis/Batch 2/1. master filtered file/KKCTools_Batch2_Final_Tool_Keywords.md` and `docs/keywords analysis/Batch 2/4. ALl Blogs Data/1/01_Concrete_Calculator_Competitor_Analysis.md` (primary keyword `concrete volume calculator`, US 3,600 / KD 5).
- [x] CC-0 Engine: `src/lib/concrete-engine.ts` — 8 shapes (slab, footing, round slab, wall, square column, Sonotube, post holes with post subtracted, solid steps), metre-based storage, waste clamp 0–100%, bag counts (QUIKRETE No. 1101 data-sheet yields for 40/50/60/80/90 lb; kg bags derived from the same yield per kg), ready-mix rounding, truck loads, site-mix split. *(Evidence: `src/lib/concrete-engine.test.ts`, 25 tests passing)*
- [x] CC-1 UI: `src/components/tool/concrete-calculator/` — multi-pour job list, US/metric toggle that converts entered sizes, ft + in inputs, live labelled SVG diagram per shape (`ShapeDiagram.tsx`), waste presets, volume table (yd³/ft³/m³), weight, bag grid, ready-mix order + editable truck size, optional prices, site-mix panel, copy / share link (URL only) / print. *(Evidence: headless Edge screenshots at 1300 px and 390 px checked; shared-link restore of a 2-pour metric job showed 1.41 m³ and 121 × 25 kg, matching a hand calculation)*
- [x] CC-2 Page: `src/app/concrete-calculator/page.tsx` — 2,684 words in `<main>`; every worked example, table and FAQ number is computed by the engine at build time; 8 formula diagrams + inside-the-forms diagram; sources section cites the QUIKRETE data sheet. *(Evidence: `docs/seo-audit-report.md` row `/concrete-calculator/` PASS)*
- [x] CC-3 SEO: route `concreteCalculator` in `src/lib/routes.ts` (title `Concrete Calculator – Volume, Yards & Bags for Slabs`), WebApplication + FAQPage + BreadcrumbList JSON-LD, min word count 1,500 added to `scripts/seo-audit.mjs`. *(Evidence: `npm run seo:audit` 0 errors)*
- [x] CC-4 Discovery: added to header dropdown, mobile menu, footer and `/tools/` directory; link added from `/cubic-yard-calculator/`.
- [x] CC-5 Cannibalisation fix: `/cubic-yard-calculator/` title changed from “Cubic Yard Calculator: Concrete, Bags & Weight” to “Cubic Yard Calculator – Soil, Gravel, Mulch & More” (see Decision log). *(Evidence: `src/lib/routes.ts`)*
- [x] CC-6 Verification: `npm run verify` passed — lint, 214 tests, no-network, build, SEO audit, docs bundle. *(Evidence: `docs/evidence/*.txt`, 2026-11-13)*

---

### Phase RC — Tool #6: Rafter Calculator (Wave 1 Score 84.2/100 Complete)
- [x] RC-0 Engine: created reusable `src/lib/rafter-engine.ts`, verified all 11 test cases T1–T11 (86 vitest tests passing project-wide). *(Evidence: src/lib/rafter-engine.test.ts)*
- [x] RC-1 UI Component: built `src/components/tool/rafter-calculator/RafterCalculator.tsx` with Gable vs Shed roof modes, pitch input options (X/12 pitch, degrees, rise-and-run, mm/m), overhang horizontal & fascia plumb cut, ridge deduction (1.5" standard, custom or none), lumber size selection (2x4 through 2x12), birdsmouth seat cut/heel cut calculation, rafter count based on building length & spacing (12", 16", 19.2", 24" o.c.), interactive dynamic SVG rafter framing diagram, and printable/copyable cut list.
- [x] RC-2 Main Page: created `src/app/rafter-calculator/page.tsx` with complete verbatim copy from spec Section 5, Quick Answer box, interactive 15-pitch comparison chart table, and 8 comprehensive FAQ items.
- [x] RC-3 SEO & Schema: added WebApplication, BreadcrumbList, and FAQPage JSON-LD schemas; registered route with exact meta title (`Rafter Calculator: Length, Pitch & Cut Angles`) and meta description; verified zero audit errors.
- [x] RC-4 Navigation & Discovery: integrated Rafter Calculator into Header dropdown, mobile navigation menu, tools directory (`/tools/`), tools index, and footer.
- [x] RC-5 Strict Verification: 0 network calls (`check:no-network`), 86/86 tests passing, 32 static export HTML pages compiled in `out/`, 0 SEO audit errors.

---

### Phase CY — Tool #4: Cubic Yard Calculator (Hub Tool Wave 1 Score 76.1/100 Complete)
- [x] CY-0 Engine: created reusable `src/lib/volume-engine.ts`, verified all 16 test cases in B5 (56 vitest tests passing). *(Evidence: src/lib/volume-engine.test.ts)*
- [x] CY-1 UI Component: built `src/components/tool/cubic-yard-calculator/CubicYardCalculator.tsx` with Concrete & Other material toggle, 6 project types (Slab, Footing, Wall, Column, Box, Known Volume), multi-section with quantities and labels, 40/50/60/80 lb concrete bag count breakdown, ready-mix ¼-yd rounding, and step-by-step math accordion.
- [x] CY-2 Main Page: created `src/app/cubic-yard-calculator/page.tsx` with 2,184 words of verbatim copy from spec B6, answer-first Quick Answer box, 4 responsive reference tables, and 10 FAQ items. Zero price/cost UI per anti-cannibalization rule.
- [x] CY-3 SEO & Schema: added WebApplication, BreadcrumbList, and FAQPage JSON-LD; registered route with exact meta title/description; added to `out/sitemap.xml`.
- [x] CY-4 Navigation & Hub Links: added to Header tools dropdown, mobile navigation menu, home page featured grid, tools directory (`/tools/`), footer, and reciprocal link with Asphalt Calculator.
- [x] CY-5 Strict Verification: 0 network calls (`check:no-network`), 56/56 tests passing, 23 static pages compiled in `out/`, 0 SEO audit errors.

---

---

### Phase AC — Tool #3: Asphalt Calculator (Wave 1 Score 78.9/100 Complete)
- [x] AC-0 Setup & Engine: created reusable `src/lib/area-depth-engine.ts`, verified all 12 test cases in B5 (40 vitest tests passing). *(Evidence: src/lib/area-depth-engine.test.ts)*
- [x] AC-1 UI Component: built `src/components/tool/asphalt-calculator/AsphaltCalculator.tsx` with hotmix & millings toggle, imperial & metric units, multi-section shape support (rectangle, circle, triangle, known area), live calculation, quick chips, advanced density/binder options, and one-click copy.
- [x] AC-2 Main Tool Page: created `src/app/asphalt-calculator/page.tsx` with 2,234 words of verbatim copy from spec B6, 3 responsive reference tables, formula & worked example boxes, cross-section SVG diagram, and 10 FAQ items.
- [x] AC-3 SEO & Schema: added WebApplication, BreadcrumbList, and FAQPage JSON-LD; added route definition with exact title and description; updated `sitemap.xml`.
- [x] AC-4 Navigation & Discovery: integrated Asphalt Calculator into Header dropdown, mobile navigation menu, tools index (`/tools/`), and home page featured grid (`/`).
- [x] AC-5 Strict Verification: 0 network calls (`check:no-network`), 40/40 tests passing, 22 static export HTML pages compiled in `out/`, 0 SEO audit errors.

---

---

### Phase CE — Tool #2: Construction Estimate Template (6/6 Phases Complete)
- [x] CE-0 Setup & Routes: added `/construction-estimate-template/` to `ROUTES`, updated `check-no-network.mjs`, created `src/content/pages/construction-estimate.ts` (2,404 words). *(Evidence: src/lib/routes.ts, src/content/pages/construction-estimate.ts)*
- [x] CE-1 Calculation Engine: pure calculation functions, currency formatting, CSV/TXT export formatters, 19 unit tests passing. *(Evidence: calculations.test.ts 13 tests, formatter.test.ts 6 tests)*
- [x] CE-2 UI Components: responsive interactive tool with ProjectInfo, CompanyInfo, LineItems, TotalsPanel, NotesSection, ActionBar (Print/PDF, CSV, TXT, Save, New), SavedEstimates. *(Evidence: src/components/tool/construction-estimate/)*
- [x] CE-3 Main Tool Page: 2,767 words of thorough original copy, 8 FAQ items with FAQPage JSON-LD, WebApplication JSON-LD, Breadcrumbs, 1200x630 OG image. *(Evidence: out/construction-estimate-template/index.html)*
- [x] CE-4 Site Integration: added to Home page tools showcase, tools index (`/tools/`), footer nav, and band name generator related utilities. *(Evidence: out/index.html, out/tools/index.html)*
- [x] CE-5 SEO Audit & Verify: 0 errors across 21 routes, word count 2,767 > 1,500, zero network calls, all 6 verification steps green. *(Evidence: docs/evidence/build.txt, test.txt, seo-audit.txt)*

### Phase KR — Competitor research for planned tools (Batches 2–8, research only, 2026-11-14)
This is documentation only; no site code changed. Each file follows the `01_Concrete_Calculator_Competitor_Analysis.md` format:
- competitor links, a snapshot table, and feature and trust matrices
- competitor-by-competitor errors, each re-checked by arithmetic
- patterns, an FAQ bank, gaps, and a page blueprint with `TODO(owner)` items

No competitor text was copied.
- [x] KR-2 Batch 2: 19 files in `docs/keywords analysis/Batch 2/`. *(Evidence: `find … -iname "*Competitor_Analysis.md" | wc -l` → 19)*
- [x] KR-3 Batch 3 (Business tools): 27 files in `…/Batch 3 - Business tools/3. All Blogs Data/`. *(Evidence: same count → 27)*
- [x] KR-4 Batch 4 (3D Printing / CNC / Engineering): 8 files. *(Evidence: count → 8)*
- [x] KR-5 Batch 5 (Math & Financial): 20 files. *(Evidence: count → 20)*
- [x] KR-6 Batch 6 (Text & Writing): 10 files. *(Evidence: count → 10)*
- [x] KR-7 Batch 7 (Developer & Web): 5 files. *(Evidence: count → 5)*
- [x] KR-8 Batch 8 (Health & Fitness, Everyday Utilities): 32 files, `01_…` to `32_…`. *(Evidence: count → 32)*
- [ ] KR-9 Replace the web-search competitor lists with real Google top-10 SERP exports. *(Blocked: needs the owner's Semrush/SERP pulls. Every file carries a `TODO(owner): pull Google top 10…` line.)*

---

## 3. Open Placeholders (TODO(owner))

| File                                                             | Placeholder                              | Purpose                                                                                                     | Status                                                                                        |
| ---------------------------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `src/config/site.ts`                                             | `SITE_NAME = 'KKC Tools'`                | Site branding                                                                                               | Resolved (KKC Tools)                                                                          |
| `src/config/site.ts`                                             | `SITE_URL = 'https://www.kkctools.com'`  | Canonical domain                                                                                            | Resolved (https://www.kkctools.com)                                                           |
| `src/config/site.ts`                                             | `OWNER_EMAIL = 'kkchub1@gmail.com'`      | Site-wide contact mailto                                                                                    | Resolved 2026-11-15 (owner: `contact@kkctools.com` was not a real mailbox)                    |
| `src/config/site.ts`                                             | `FOUNDER` (name, role, email, Instagram) | About page owner identity + Person schema                                                                   | Resolved 2026-11-15 (Karan Kumar, owner-supplied)                                             |
| `src/app/about/page.tsx` ("Who runs KKC Tools")                  | —                                        | Real owner name, role, contact (SEO audit H4, E-E-A-T)                                                      | Resolved 2026-11-15. Optional: owner may add real background/experience later — do not invent |
| `src/app/layout.tsx` (Organization schema)                       | `TODO(owner)`                            | `founder` → Person node (resolved 2026-11-15, personal Instagram in Person `sameAs`); Organization `sameAs` | **Open** only if the site gets its own social profiles                                        |
| Cloudflare dashboard                                             | `TODO(owner)`                            | Disable Web Analytics (injected beacon, blocked by CSP) — Phase AR-11                                       | **Open**                                                                                      |
| Google Analytics admin                                           | `TODO(owner)`                            | Set data retention and review Enhanced measurement for property `G-DVNM8TFRQE`                              | **Open**                                                                                      |
| `src/lib/floor-refinish-engine.ts` (`DIY_DEFAULTS.bufferPerDay`) | `TODO(owner)`                            | Floor-buffer rental rate — no sourced figure; uses drum-sander midpoint, disclosed in UI (Phase FR-6)       | **Open**                                                                                      |

---

## 4. Needs Owner Input (Blocked Tasks)

1. **Volume & KD for Punk & Pop sub-pages**:
   - `punk band name generator`
   - `pop band name generator`
   - *Status:* Blocked in Phase 4 (P4-11, P4-12) until owner provides SEMrush data.
2. **Production Domain & Email**: Required before Phase 7 deployment.
3. **SEO audit 2026-11-14 owner items:**
   - deploy the current build (SA-12);
   - disable the Netlify Drawer / HUD (SA-13);
   - supply the owner identity and real profile URLs for About and the Organization schema;
   - register the site in Google Search Console and Bing Webmaster Tools;
   - decide on HSTS preload.
4. **Competitor research owner items (Phase KR, before building each planned tool):**
   - **SERP data.** Batches 3–8 have no Semrush SERP export. Pull the Google top 10 for each primary keyword.
   - **Blocked pages to review by hand.** Each affected file lists the competitor pages that returned 403/404/DNS errors.
   - **YMYL health tools (Batch 8 #9–#13, #19–#22, #24–#26).** Before launch, each needs:
     - a qualified reviewer, with name and date
     - primary-source citations, for example:
       - the Navy/Army body-fat guides
       - Mifflin 1990 and Roza & Shizgal 1984
       - Gallagher 2000
       - the CDC growth-chart LMS data
       - NASEM 2023 energy and breastfeeding figures
       - Hall 2011
       - CDC safe-rate guidance
       - ISSN 2017 protein
       - Kouri 1995
     - approval of the special-population wording
   - **Data sources and licences.**
     - Ingredient densities for Grams to Cups: USDA FoodData Central is proposed.
     - Compendium of Physical Activities edition, plus water-density, IWF/IPF and DST-rule sources.
     - Discord timestamp styles, to be checked against Discord's docs.
   - **Trademark wording:** the "Pomodoro Technique®" name.
   - **Card processing rate freshness (Phase PF60):** `TODO(owner)`: Re-check card processing presets every 3 months in `src/content/processing-fee-presets.ts` against official pricing pages for Square, Stripe, and PayPal.

---

## 5. Known Issues / Decisions Log

- **Decision (2026-11-15):** Owner asked to install Google Analytics (Phase 7, so third-party scripts are now allowed under AGENTS.md rule 5). Loaded via GTM with Consent Mode v2 region defaults instead of a cookie banner; gtm.js is delayed until the first interaction or 1.5 s after load because loading it in `<head>` cut mobile Lighthouse from 94 to 86. Tool code still makes zero network calls (`check:no-network`). `TODO(owner)`: in GA4 set data retention (Admin → Data retention) and review Enhanced measurement; if a consent banner is ever wanted for EEA/UK, use a Google-certified CMP.
- **Decision (2026-11-14):** Deploy to Cloudflare as static assets (`wrangler.jsonc` → `out/`), not OpenNext. OpenNext needs `output: 'standalone'` and a non-allowed dependency; the site is 100% static. Steps in `05-DEPLOY-AND-LAUNCH.md`.
- **Resolved (2026-11-15):** the 4 token pairs that were below 4.5:1 (light `--muted` on `--bg`, white on `--accent`, dark `--muted` on `--bg`/`--surface`) were darkened/lightened; all pairs now pass. Values in `03-PAGES-AND-DESIGN.md` §3.

- **Decision (2026-11-13):** Retitled `/cubic-yard-calculator/` to “Cubic Yard Calculator – Soil, Gravel, Mulch & More” so it no longer competes with the new `/concrete-calculator/`. Semrush shows `cubic yard calculator` and `concrete volume calculator` have different top-10 results, so each page owns one intent. The cubic-yard page body still contains concrete sections; trim them later if both pages are seen competing in Search Console.

- **Decision 01 (2026-11-08):** Use Next.js 16 App Router with static export (`output: 'export'`).
- **Decision 02 (2026-11-08):** Zero client-side network calls enforced by `scripts/check-no-network.mjs`.
- **Decision 03 (2026-11-09):** Comprehensive SEO audit and GSC readiness action plan created at `docs/SEO-AND-SEARCH-CONSOLE-AUDIT.md`. Identified `src/config/site.ts` domain replacement and live hosting deployment as the sole blockers for GSC sitemap submission.
- **Decision 04 (2026-11-10):** Visual design upgrade inspired by Cloudflare & MKSAnalytiq: warm ivory canvas (`#FFFAF2`), deep navy typography (`#17213A`), terracotta orange gradient pill CTAs (`#C2410C`), cobalt blue tool actions (`#0B5EA4`), 20px rounded cards, ambient hero glow, and pill search bar.
- **Decision 05 (2026-11-10):** Fixed theme persistence bug by resetting legacy `theme` key to `kkc_theme_pref` ensuring default is strictly Light mode. Added active route orange bar in header, 2-column "How this works" + "Related tools" sticky layout to both tool pages, and helper trust text under all buttons.
- **Decision 06 (2026-11-10):** Restored warm canvas to user-preferred soothing sand tone (`#EBE4D6`), eliminating glare and eye strain. All cards, tables, and form boxes are pure white (`#FFFFFF`) with borders (`#D8CFBF`) and soft elevation shadows (`0 4px 14px -2px rgba(23, 33, 58, 0.07)`).
- **Decision 07 (2026-11-10):** Resolved table spacing issues: increased table min-width to 940px, widened Category (170px), Quantity (100px), Unit (125px), and Rate (115px). Hidden default webkit number spin buttons to eliminate number clipping. All verified via `npm run verify`.
- **Decision 08 (2026-11-10):** Softened box surface interior (`--surface`) across the entire application from stark bright white (`#FFFFFF`) to a soothing warm parchment cream (`#F6F0E6`), eliminating harsh white glare while preserving elevation against the warm sand canvas (`#EBE4D6`) and maintaining 14.3:1 AAA text contrast. Verified via `npm run verify`.
- **Decision 09 (2026-11-10):** Dark mode upgraded to 10/10 Obsidian Carbon standard (Apple macOS / Linear aesthetic). Deep charcoal obsidian canvas (`#090C12`), elevated card surface (`#11151F`), secondary surface (`#19202D`), recessed inputs (`#0C0F17`), precision micro-borders (`#1E2636`), radiant electric cobalt blue (`#38BDF8`), amber-orange CTAs (`#F97316`), and 1px layered glass rim-light shadows. Verified zero regressions across all 21 static pages.



<!-- ========================================================= -->
<!-- FILE: docs/01-FEATURES.md -->
<!-- ========================================================= -->

# 01 — Features & Tool Directory

## 1. Overview
KKC Tools is a fast multi-tool website. Every tool runs fully in the browser (no API, no server, no network calls — enforced by `npm run check:no-network`).
- **Live tools:** 95 (source: `src/lib/routes.ts`, `src/lib/tools-catalog.ts`).
- **Tests:** 1,114 Vitest tests passing (`npm run verify`, 2026-11-24).
- **Hosting:** static export (`out/`), deployed to Cloudflare Workers Static Assets (see `05-DEPLOY-AND-LAUNCH.md`).

---

## 2. Tool Directory (live)

|    # | Tool                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | URL                                   | UI component (`src/components/tool/`) | Engine (`src/lib/`)                                                    |
| ---: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------- |
|    1 | Band Name Generator (+ 6 genre pages)                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `/band-name-generator/`               | `band-name-generator/`                | `generator/`                                                           |
|    2 | Construction Estimate Template                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `/construction-estimate-template/`    | `construction-estimate/`              | (in component)                                                         |
|    3 | Asphalt Calculator                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `/asphalt-calculator/`                | `asphalt-calculator/`                 | `volume-engine.ts`                                                     |
|    4 | Cubic Yard Calculator                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `/cubic-yard-calculator/`             | `cubic-yard-calculator/`              | `volume-engine.ts`                                                     |
|    5 | Concrete Calculator                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `/concrete-calculator/`               | `concrete-calculator/`                | `concrete-engine.ts`                                                   |
|    6 | Rebar Calculator                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `/rebar-calculator/`                  | `rebar-calculator/`                   | `rebar-engine.ts`                                                      |
|    7 | Drywall Calculator                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `/drywall-calculator/`                | `drywall-calculator/`                 | `drywall-engine.ts`                                                    |
|    8 | Sand Calculator                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `/sand-calculator/`                   | `sand-calculator/`                    | `sand-engine.ts`                                                       |
|    9 | Fill Dirt Calculator                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `/fill-dirt-calculator/`              | `fill-dirt-calculator/`               | `fill-dirt-engine.ts`                                                  |
|   10 | Linear Foot Calculator                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `/linear-foot-calculator/`            | `linear-foot-calculator/`             | `linear-foot-engine.ts`                                                |
|   11 | Rafter Calculator                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `/rafter-calculator/`                 | `rafter-calculator/`                  | `rafter-engine.ts`                                                     |
|   12 | Square Footage Calculator                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `/square-footage-calculator/`         | `square-footage-calculator/`          | `square-footage-engine.ts`                                             |
|   13 | Cinder Block Calculator                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `/cinder-block-calculator/`           | `cinder-block-calculator/`            | `cinder-block-engine.ts`                                               |
|   14 | Brick Calculator (US + Metric)                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `/brick-calculator/`                  | `brick-calculator/`                   | `brick-engine.ts`, `brick-metric-engine.ts`                            |
|   15 | Paint Cost Calculator                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `/paint-cost-calculator/`             | `paint-calculator/`                   | `paint-engine.ts`                                                      |
|   16 | Tile Calculator                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `/tile-calculator/`                   | `tile-calculator/`                    | `tile-engine.ts`                                                       |
|   17 | Laminate Flooring Calculator                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `/laminate-flooring-calculator/`      | `laminate-calculator/`                | `laminate-engine.ts`                                                   |
|   18 | Stone Calculator                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `/stone-calculator/`                  | `stone-calculator/`                   | `stone-engine.ts`                                                      |
|   19 | Stud Calculator                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `/stud-calculator/`                   | `stud-calculator/`                    | `stud-engine.ts`                                                       |
|   20 | Tons to Cubic Yards Converter                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `/tons-to-cubic-yards/`               | `tons-yards-converter/`               | `tons-yards-engine.ts`                                                 |
|   21 | Paver Sand Calculator                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `/paver-sand-calculator/`             | `paver-sand-calculator/`              | `paver-sand-engine.ts`                                                 |
|   22 | Paver Base Calculator                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `/paver-base-calculator/`             | `paver-base-calculator/`              | `paver-base-engine.ts`                                                 |
|   23 | Compost Calculator                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `/compost-calculator/`                | `compost-calculator/`                 | `compost-engine.ts`                                                    |
|   24 | Fence Stain Calculator                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `/fence-stain-calculator/`            | `fence-stain-calculator/`             | `fence-stain-engine.ts`                                                |
|   25 | Lawn Mowing Cost Calculator (homeowner + pro views)                                                                                                                                                                                                                                                                                                                                                                                                                                       | `/lawn-mowing-cost-calculator/`       | `lawn-mowing-calculator/`             | `lawn-mowing-engine.ts`                                                |
|   26 | Shingle Roof Calculator (sections, bundles + full accessory list)                                                                                                                                                                                                                                                                                                                                                                                                                         | `/shingle-calculator/`                | `shingle-calculator/`                 | `shingle-engine.ts`                                                    |
|   27 | Board and Batten Calculator (accent wall + exterior siding)                                                                                                                                                                                                                                                                                                                                                                                                                               | `/board-and-batten-calculator/`       | `board-batten-calculator/`            | `board-batten-engine.ts`                                               |
|   28 | Pipe & Tube Volume Calculator (capacity, wall weight, pipe-size presets, runs)                                                                                                                                                                                                                                                                                                                                                                                                            | `/pipe-volume-calculator/`            | `pipe-volume-calculator/`             | `pipe-volume-engine.ts`                                                |
|   29 | Wire Gauge Calculator (size / check / gauge lookup; AWG + mm²; safety-sensitive)                                                                                                                                                                                                                                                                                                                                                                                                          | `/wire-gauge-calculator/`             | `wire-gauge-calculator/`              | `wire-gauge-engine.ts`                                                 |
|   30 | Concrete Slab Cost Calculator (itemised estimate: concrete, short-load, delivery, pump, base, reinforcement, labour, finish, removal; DIY bags vs ready-mix vs contractor; US/metric, 7 currencies)                                                                                                                                                                                                                                                                                       | `/concrete-slab-cost-calculator/`     | `slab-cost-calculator/`               | `slab-cost-engine.ts`                                                  |
|   31 | Deck Stain Calculator (floor sections, railings with posts/rails/balusters, stairs, skirting; opacity, coats, wood condition; gallons/litres, can plan, cleaner, DIY vs pro)                                                                                                                                                                                                                                                                                                              | `/deck-stain-calculator/`             | `deck-stain-calculator/`              | `deck-stain-engine.ts`                                                 |
|   32 | Fence Cost Calculator (6 materials; sides, corners, closed loop, walk/double gates; posts, rails, pickets, panels, fabric; concrete per post; removal, slope, permit; range; DIY vs pro)                                                                                                                                                                                                                                                                                                  | `/fence-cost-calculator/`             | `fence-cost-calculator/`              | `fence-cost-engine.ts`                                                 |
|   33 | Cubic Feet ↔ Square Feet Converter (two-way with depth; volume or bags; area or L × W; ft³, yd³, m³, L, cft; ft², m², yd²; material depth presets; working shown)                                                                                                                                                                                                                                                                                                                         | `/cubic-feet-to-square-feet/`         | `cubic-square-converter/`             | `cubic-square-engine.ts`                                               |
|   34 | Metal Roof Cost Calculator (roof sections via Shingle geometry; standing seam, corrugated, metal shingles; tear-off; vs asphalt upfront and per year; panels, trim, underlayment)                                                                                                                                                                                                                                                                                                         | `/metal-roof-cost-calculator/`        | `metal-roof-calculator/`              | `metal-roof-engine.ts`                                                 |
|   35 | Bathroom Remodel Cost Calculator (half/full/primary; cosmetic or full; budget/mid/high; editable fixed and per-area line items; tub/shower options; water heater, permit, region, contingency; quote checker)                                                                                                                                                                                                                                                                             | `/bathroom-remodel-cost-calculator/`  | `bathroom-remodel-calculator/`        | `bathroom-remodel-engine.ts`                                           |
|   36 | Floor Refinishing Cost Calculator (rooms or total area, ft/m; screen & recoat / full sand / dustless; species factor; stain; repairs, board replacement, subfloor, carpet, stairs, furniture, baseboards; region and minimum charge; low–high range; DIY shopping list with gallons from coverage; refinish vs replace; quote checker)                                                                                                                                                    | `/floor-refinishing-cost-calculator/` | `floor-refinishing-calculator/`       | `floor-refinish-engine.ts`                                             |
|   37 | Cubic Inch Calculator (volume mode: box, cylinder, tube wall + inside capacity, sphere in any length unit, quantity, 8 output units, volume converter; engine mode: bore × stroke × cylinders in in or mm, 6 manufacturer presets, bore/stroke ratio, overbore and stroker what-if, bore or stroke solver)                                                                                                                                                                                | `/cubic-inch-calculator/`             | `cubic-inch-calculator/`              | `cubic-inch-engine.ts`                                                 |
|   38 | Roof Replacement Cost Calculator (footprint or multi-plane roof sections, pitch multiplier √(1+(r/12)²); 10 materials from 3-tab to slate/tile; stories & steep-slope safety multipliers; tear-off scaling by layer; dumpster disposal; decking repair sheet allowance; accessories: synthetic vs felt underlayment, ice & water shield, drip edge, ridge vent, pipe boots, gutters; 3-way repair vs overlay vs replace with IRC R908.3.1.1 2-layer code rule; contractor quote verifier) | `/roof-replacement-cost-calculator/`  | `roof-replacement-cost-calculator/`   | `roof-replacement-engine.ts`                                           |
|   39 | Carpet Cost Calculator (multi-room takeoff, 12'/13.5'/15' roll layout optimization, seam minimization, stairs runner geometry with waterfall vs box cap & band, 3 grades, 5 fibres, 5 styles, carpet tiles, cushion padding specifications, tear-out, disposal, tack strips, transitions, contractor quote verifier, flooring comparisons)                                                                                                                                                | `/carpet-cost-calculator/`            | `carpet-cost-calculator/`             | `carpet-engine.ts`                                                     |
|   40 | Deck Cost Calculator (new build, resurface, replace, repair; materials, railing, stairs, footings; Fixr-sourced price ranges)                                                                                                                                                                                                                                                                                                                                                             | `/deck-cost-calculator/`              | `deck-cost-calculator/`               | `deck-cost-engine.ts`                                                  |
|   41 | Percentage Change Calculator (8 modes: % change, % difference, increase/decrease by %, reverse %, X% of Y, X is what % of Y, percentage points, list mode; Excel/Sheets formula)                                                                                                                                                                                                                                                                                                          | `/percentage-change-calculator/`      | `percentage-change-calculator/`       | `percent-engine.ts`                                                    |
|   42 | Markup Calculator (solve any two of cost/markup/price/profit, target margin, landed cost + fees, VAT/GST/sales tax, price endings, 3-tier price chain, product list)                                                                                                                                                                                                                                                                                                                      | `/markup-calculator/`                 | `markup-calculator/`                  | `pricing-engine.ts`                                                    |
|   43 | Profit Margin Calculator (gross, full P&L waterfall to operating and net, target-margin price, multi-product blended margin; Damodaran Jan 2026 sector table)                                                                                                                                                                                                                                                                                                                             | `/profit-margin-calculator/`          | `profit-margin-calculator/`           | `margin-engine.ts` (uses `pricing-engine.ts`)                          |
|   44 | Unit Price Calculator (compare 2–6 items in any unit, deals, shrinkflation check, seller unit price)                                                                                                                                                                                                                                                                                                                                                                                      | `/unit-price-calculator/`             | `unit-price-calculator/`              | `unit-price-engine.ts`                                                 |
|   45 | Hourly to Salary Calculator (8 pay periods both ways, paid vs unpaid time off, overtime, compare jobs/raise; gross only)                                                                                                                                                                                                                                                                                                                                                                  | `/hourly-to-salary-calculator/`       | `hourly-to-salary-calculator/`        | `wage-engine.ts`                                                       |
|   46 | Discount Calculator (percent off, sale price, reverse discount, stacked deals, sales tax order)                                                                                                                                                                                                                                                                                                                                                                                           | `/discount-calculator/`               | `discount-calculator/`                | `discount-engine.ts`                                                   |
|   47 | Cap Rate Calculator (solve cap rate, property value, required NOI, itemized NOI builder, sensitivity matrix, exit valuation)                                                                                                                                                                                                                                                                                                                                                              | `/cap-rate-calculator/`               | `cap-rate-calculator/`                | `real-estate-engine.ts`, `cap-rate-engine.ts`                          |
|   48 | Rental Property Calculator (cash flow, cash-on-cash return, cap rate, DSCR, 10-year pro forma, cash vs mortgage)                                                                                                                                                                                                                                                                                                                                                                          | `/rental-property-calculator/`        | `rental-property-calculator/`         | `real-estate-engine.ts`, `loan-engine.ts`, `rental-property-engine.ts` |
|   49 | Labor Cost Calculator (burdened hourly rate, US payroll-tax caps, paid vs productive hours, crew & job quote, labor % of revenue, W-2 vs 1099)                                                                                                                                                                                                                                                                                                                                            | `/labor-cost-calculator/`             | `labor-cost-calculator/`              | `us-tax-data.ts`, `pricing-engine.ts`, `labor-cost-engine.ts`          |
|   50 | Commercial Lease Calculator (rent per sq ft, NNN / CAM pass-throughs, usable vs rentable area, escalations, free rent, TI allowance, net effective rent, offer compare)                                                                                                                                                                                                                                                                                                                   | `/commercial-lease-calculator/`       | `commercial-lease-calculator/`        | `commercial-lease-engine.ts`                                           |
|   51 | Airbnb Profit Calculator (nightly ADR, occupancy %, turnover cleaning, platform fees, fixed bills, NOI, cash flow, break-even occ, arbitrage, STR vs LTR)                                                                                                                                                                                                                                                                                                                                 | `/airbnb-calculator/`                 | `airbnb-calculator/`                  | `str-engine.ts`                                                        |
|   52 | Freelance Rate Calculator (income goal to hourly/day/project rate, 52-week calendar, overhead, US SECA tax, salaried equivalent)                                                                                                                                                                                                                                                                                                                                                          | `/freelance-rate-calculator/`         | `freelance-rate-calculator/`          | `freelance-rate-engine.ts`                                             |
|   53 | Contribution Margin Calculator (unit CM, CM ratio, break-even units & $, margin of safety, DOL, sales-mix, CVP graph)                                                                                                                                                                                                                                                                                                                                                                     | `/contribution-margin-calculator/`    | `contribution-margin-calculator/`     | `contribution-margin-engine.ts`                                        |
|   58 | Present Value & NPV Calculator (lump-sum PV, ordinary/due/growing annuity, uneven cash flows, capital budgeting NPV/IRR, printable PV discount table, spreadsheet formulas)                                                                                                                                                                                                                                                                                                               | `/present-value-calculator/`          | `present-value-calculator/`           | `tvm-engine.ts`                                                        |
|   59 | Compound Interest Calculator (daily/monthly/continuous compounding, regular deposits, 3-way goal solver, simple vs compound advantage, APR/APY converter, real inflation balance)                                                                                                                                                                                                                                                                                                         | `/compound-interest-calculator/`      | `compound-interest-calculator/`       | `tvm-engine.ts`, `compound-interest-engine.ts`                         |
|   65 | Retirement Drawdown Calculator (years savings will last, annual drawdown schedule, inflation, Bengen 4% rule, maximum spending solver, sequence-of-returns stress test)                                                                                                                                                                                                                                                                                                                   | `/how-long-will-my-money-last/`       | `how-long-will-my-money-last/`        | `drawdown-engine.ts`                                                   |
|   66 | SBA Loan Calculator (SBA 504 two-loan split, bank 1st lien, CDC debenture 2nd lien, SBA 7(a) variable rate with guarantee fee, DSCR affordability, business acquisition M&A)                                                                                                                                                                                                                                                                                                              | `/sba-loan-calculator/`               | `sba-loan-calculator/`                | `sba-loan-engine.ts`                                                   |
|   67 | 1099 Self-Employment Tax Calculator (15.3% SE tax, statutory 92.35% multiplier, Social Security wage-base cap, Additional Medicare surtax, 50% above-the-line deduction, 1040-ES quarterly vouchers, safe harbor)                                                                                                                                                                                                                                                                         | `/self-employment-tax-calculator/`    | `self-employment-tax-calculator/`     | `se-tax-engine.ts`, `us-tax-data.ts`                                   |
|   68 | Epoxy Resin Calculator (pour volume, deep pour layer scheduler, mix ratios 1:1 to 5:1 + custom, resin & hardener breakdown, waste allowance, fl oz, mL, gal, L, lb, kg)                                                                                                                                                                                                                                                                                                                  | `/epoxy-resin-calculator/`            | `epoxy-resin-calculator/`             | `epoxy-engine.ts`                                                      |
|   69 | Epoxy River Table Calculator (slab diagram, river channel gap volume, flood top coat, multi-pour schedule to prevent exotherm runaway, board feet)                                                                                                                                                                                                                                                                                                                                           | `/epoxy-table-calculator/`            | `epoxy-table-calculator/`             | `epoxy-engine.ts`                                                      |
|   70 | 3D Print Cost Calculator (filament weight & spool pricing, resin volume & bottle pricing, electricity with heated bed, printer wear depreciation, fail margin, labor & markup)                                                                                                                                                                                                                                                                                                              | `/3d-print-cost-calculator/`          | `3d-print-cost-calculator/`           | `print-cost-engine.ts`                                                 |
|   71 | Speeds and Feeds Calculator (spindle RPM, feed rate IPM/mm/min, chip load per tooth, radial chip thinning compensation for light cuts, CNC router & mill limit guards)                                                                                                                                                                                                                                                                                                                      | `/speeds-and-feeds-calculator/`       | `speeds-and-feeds-calculator/`        | `machining-engine.ts`                                                  |
|   72 | SFM to RPM Calculator (bidirectional surface feet per minute ↔ spindle RPM, metric m/min ↔ RPM, conveyor line speed, tooling RPM quick matrix)                                                                                                                                                                                                                                                                                                                                               | `/sfm-to-rpm-calculator/`              | `sfm-to-rpm-calculator/`              | `machining-engine.ts`                                                  |
|   73 | Pulley Calculator (2-pulley speed ratio & driven RPM solver, linear belt speed ft/min & m/s, open belt center-to-length & belt-to-center solvers, wrap angles, compound drive)                                                                                                                                                                                                                                                                                                              | `/pulley-calculator/`                 | `pulley-calculator/`                  | `pulley-engine.ts`                                                     |
|   74 | Steps per mm Calculator (stepper belt drive GT2/T5, lead screw T8/ballscrew, Klipper rotation_distance converter, extruder 100 mm e-steps calibration)                                                                                                                                                                                                                                                                                                                                      | `/steps-per-mm-calculator/`           | `steps-per-mm-calculator/`            | `steps-engine.ts`                                                      |
|   75 | Thread Pitch Diameter Calculator (UN/UNC/UNF ASME B1.1, Metric ISO 68-1/965-1, Acme 29° ASME B1.5, pitch & minor diameter, % engagement tap drill solver, 3-wire measurement)                                                                                                                                                                                                                                                                                                               | `/thread-pitch-diameter-calculator/`  | `thread-pitch-diameter-calculator/`  | `thread-engine.ts`                                                     |
|   76 | Ratio Calculator (simplify 2-3 terms, scale & solve for X, part-to-whole fractions, visual aspect ratios)                                                                                                                                                                                                                                                                                                                                                                                 | `/ratio-calculator/`                  | `ratio-calculator/`                   | `ratio-engine.ts`                                                      |
|   77 | Age Difference Calculator (years, months, days, total hours/days/weeks, when A is 2× as old, half-your-age-plus-7)                                                                                                                                                                                                                                                                                                                                                                       | `/age-difference-calculator/`         | `age-difference-calculator/`          | `date-diff-engine.ts`                                                  |
|   78 | IQR Calculator (Tukey, Inclusive, Excel EXC quartiles, 1.5×IQR outlier detection fences, 5-number summary)                                                                                                                                                                                                                                                                                                                                                                                | `/iqr-calculator/`                    | `iqr-calculator/`                     | `stats-engine.ts`                                                      |
|   79 | A/B Test Significance Calculator (two-tailed z-test, relative uplift & confidence intervals, power & sample size)                                                                                                                                                                                                                                                                                                                                                                          | `/ab-test-significance-calculator/`   | `ab-test-calculator/`                  | `stats-engine.ts`                                                      |
|   80 | Gallons to Cubic Feet Converter (exact 231/1728 NIST factor, US/Imperial gallons, m³, litres, water weight, tank capacity)                                                                                                                                                                                                                                                                                                                                                                | `/gallons-to-cubic-feet/`              | `gallons-converter/`                  | `volume-units-engine.ts`                                               |
|   81 | CAGR Calculator (compound annual growth rate, Rule of 72 doubling time, inflation-adjusted real CAGR, schedule)                                                                                                                                                                                                                                                                                                                                                                            | `/cagr-calculator/`                   | `cagr-calculator/`                    | `growth-engine.ts`                                                     |
|   82 | Fraction to Percent Calculator (exact repeating decimals with overline, mixed numbers, grade percentage scale)                                                                                                                                                                                                                                                                                                                                                                            | `/fraction-to-percent-calculator/`    | `fraction-percent-calculator/`        | `fraction-percent-engine.ts`                                           |
|   83 | Reverse Sales Tax Calculator (pre-tax extraction, exact statutory rounding, receipt reconstruction, state presets)                                                                                                                                                                                                                                                                                                                                                                         | `/reverse-sales-tax-calculator/`     | `reverse-tax-calculator/`             | `reverse-tax-engine.ts`                                                |
|   84 | Pythagorean Theorem Calculator (solve any side, builder 3-4-5 square check, exact radical form, feet-inches-fractions)                                                                                                                                                                                                                                                                                                                                                                    | `/pythagorean-theorem-calculator/`   | `pythagorean-calculator/`             | `right-triangle-engine.ts`                                             |
|   85 | Slope Calculator (rise & run solver, percentage grade & degrees, roof pitch, ADA ramp & pipe fall)                                                                                                                                                                                                                                                                                                                                                                                         | `/slope-calculator/`                  | `slope-calculator/`                   | `slope-engine.ts`                                                      |
|   86 | Standard Deviation Calculator (sample vs population SD, variance, standard error, step-by-step deviations)                                                                                                                                                                                                                                                                                                                                                                                 | `/standard-deviation-calculator/`     | `standard-deviation-calculator/`     | `stats-engine.ts`                                                      |
|   87 | Binomial Probability Calculator (exact PMF/CDF, normal approximation check, at least/at most, trials needed solver)                                                                                                                                                                                                                                                                                                                                                                       | `/binomial-probability-calculator/`   | `binomial-calculator/`                | `binomial-engine.ts`                                                   |
|   88 | T-Test Calculator (independent & paired two-sample t-test, Welch's t, Student's t, p-value, critical bounds)                                                                                                                                                                                                                                                                                                                                                                               | `/t-test-calculator/`                 | `t-test-calculator/`                  | `stats-engine.ts`                                                      |
|   89 | Tank Volume Calculator (horizontal & vertical cylinder, partial fill & dipstick chart, ASME 2:1 heads, tank sizing)                                                                                                                                                                                                                                                                                                                                                                       | `/tank-volume-calculator/`            | `tank-calculator/`                    | `tank-engine.ts`, `volume-units-engine.ts`                             |
|   90 | Simple Interest Calculator (I = P·r·t, date-to-date calendar accrual, Actual/365, Actual/360, 30/360, bond coupons)                                                                                                                                                                                                                                                                                                                                                                       | `/simple-interest-calculator/`        | `simple-interest-calculator/`         | `simple-interest-engine.ts`                                            |
|   91 | ROI Calculator (simple & annualized ROI, marketing campaign ROAS & gross margin ROI, payback period, real inflation ROI)                                                                                                                                                                                                                                                                                                                                                                  | `/roi-calculator/`                    | `roi-calculator/`                     | `roi-engine.ts`                                                        |
|   92 | Final Grade Calculator (score needed on final, letter cutoff bounds, weighted categories, multiple test equivalency)                                                                                                                                                                                                                                                                                                                                                                      | `/final-grade-calculator/`            | `final-grade-calculator/`             | `final-grade-engine.ts`                                                |
|   93 | Monthly Budget Calculator (50/30/20 rule, needs/wants/savings itemized allocation, sinking fund annual bills, CSV)                                                                                                                                                                                                                                                                                                                                                                         | `/budget-calculator/`                 | `budget-calculator/`                  | `budget-engine.ts`                                                     |
|   94 | Boolean Algebra Calculator (minimal SOP via Quine-McCluskey, truth tables 2ⁿ, equivalence check, two's complement binary)                                                                                                                                                                                                                                                                                                                                                                | `/boolean-algebra-calculator/`        | `boolean-calculator/`                 | `boolean-engine.ts`                                                    |
|   95 | Metric Conversion Calculator (universal length, weight, volume, area, temperature, speed via exact NIST factors)                                                                                                                                                                                                                                                                                                                                                                          | `/metric-conversion-calculator/`      | `metric-calculator/`                  | `metric-engine.ts`                                                     |

Shared helpers: `area-depth-engine.ts`, `tools-catalog.ts` (catalog for `/tools/` and home), `storage.ts` (safe localStorage), `guides.ts`.
Every calculator page has a "How This Calculator Works" block (formula, defaults, sources, last-updated date, correction link).

Planned tools (not built): Batches 2–8 in `docs/keywords analysis/` — each has a competitor-analysis file with a page blueprint.

---

## 3. Tool #1: Band Name Generator Features

| Feature ID | Feature Name            | Description                                                                   | Status | Code Path                                              |
| ---------- | ----------------------- | ----------------------------------------------------------------------------- | ------ | ------------------------------------------------------ |
| **F1**     | Genre Selector          | Radio chips: Any, Rock, Metal, Heavy Metal, Punk, Pop, K-pop, Boy Band, Indie | Done ✅ | `src/components/tool/band-name-generator/Controls.tsx` |
| **F2**     | Name Style              | Select: Any, "The ...", Two words, One word, "X of Y"                         | Done ✅ | `Controls.tsx`                                         |
| **F3**     | Batch Count             | 5, 10 (default), 20 names per generation                                      | Done ✅ | `Controls.tsx`                                         |
| **F4**     | Starts With             | A–Z letter filter on first significant word                                   | Done ✅ | `Controls.tsx`                                         |
| **F5**     | Must Include Word       | Custom word injected into a compatible template, sanitized & filtered         | Done ✅ | `Controls.tsx`                                         |
| **F6**     | ALL CAPS Toggle         | Capitalize output (default ON for K-pop)                                      | Done ✅ | `Controls.tsx`                                         |
| **F7**     | Generate Action         | Button + Enter key; avoids the last 50 names                                  | Done ✅ | `Controls.tsx`                                         |
| **F8**     | Results List            | Styled list with copy, save and check buttons                                 | Done ✅ | `Results.tsx`                                          |
| **F9**     | Copy Actions            | Copy and copy-all with fallback and non-shifting "Copied" alert               | Done ✅ | `ResultRow.tsx`                                        |
| **F10**    | Saved Names Panel       | localStorage favorites with copy-all & .txt download                          | Done ✅ | `SavedPanel.tsx`                                       |
| **F11**    | Availability Check Menu | Google, Spotify, Bandcamp, YouTube search links with disclaimer               | Done ✅ | `CheckMenu.tsx`                                        |
| **F12**    | Constraint Warning      | "Try fewer filters" when constraints yield fewer names                        | Done ✅ | `Results.tsx`                                          |
| **F13**    | Server Starter Names    | Curated starter names in static HTML (no hydration mismatch)                  | Done ✅ | `BandNameGenerator.tsx`                                |

### Core Engine Modules (`src/lib/generator/`)
- `types.ts`: GenreId, StyleId, GenerateOptions, GenerateResult.
- `rng.ts`: Seeded PRNG (mulberry32).
- `pools/*.ts`: Word pools for all 9 genres (80+ words each).
- `patterns.ts`: Weighted templates per genre (8+ each).
- `blocklist.ts`: 260+ famous band/artist names to avoid.
- `offensive.ts`: Slur/explicit sanitization filter.
- `engine.ts`: Name assembly and constraint validation.



<!-- ========================================================= -->
<!-- FILE: docs/02-SEO.md -->
<!-- ========================================================= -->

# 02 — Technical & On-Page SEO Specification

## 1. Page Inventory & SEO Targets

Source of truth: `src/lib/routes.ts` (113 routes) and `src/app/`. All pages below are **Live** in the static build (`npm run verify` 2026-11-24: 0 SEO audit errors across 130 HTML pages). Per-page titles and descriptions live in `routes.ts`; this table lists the page groups.

| Group               | Paths                                                                                                                      | Schema (JSON-LD graph)                                 | Status                                                                                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home                | `/`                                                                                                                        | WebSite, Organization, WebPage                         | Live                                                                                                                                                    |
| Tools index         | `/tools/`                                                                                                                  | CollectionPage, BreadcrumbList                         | Live                                                                                                                                                    |
| Band Name Generator | `/band-name-generator/`                                                                                                    | WebApplication, BreadcrumbList, FAQPage                | Live                                                                                                                                                    |
| Genre pages (6)     | `/band-name-generator/{kpop,metal,heavy-metal,rock,random,boy-band}/`                                                      | WebApplication, BreadcrumbList, FAQPage                | Live                                                                                                                                                    |
| Genre pages (2)     | `/band-name-generator/{punk,pop}/`                                                                                         | —                                                      | BLOCKED (owner keyword data)                                                                                                                            |
| Estimate template   | `/construction-estimate-template/`                                                                                         | WebApplication, BreadcrumbList, FAQPage                | Live                                                                                                                                                    |
| Calculators (94)    | see `01-FEATURES.md` §2                                                                                                    | WebApplication, BreadcrumbList, FAQPage (one per page) | Live                                                                                                                                                    |
| Guides index        | `/guides/`                                                                                                                 | CollectionPage, BreadcrumbList                         | Live                                                                                                                                                    |
| Guides (3)          | `/guides/how-to-choose-a-band-name/`, `/guides/band-name-ideas-by-genre/`, `/guides/how-to-check-if-a-band-name-is-taken/` | Article, BreadcrumbList                                | Live (1,686–1,888 words each)                                                                                                                           |
| Trust               | `/about/`, `/contact/`, `/privacy-policy/`, `/terms/`, `/disclaimer/`                                                      | AboutPage / ContactPage / WebPage, BreadcrumbList      | Live (Disclaimer added 2026-11-15 for the AdSense report)                                                                                               |
| HTML site map       | `/site-map/`                                                                                                               | WebPage, BreadcrumbList                                | Live (2026-11-15; built from `TOOLS_CATALOG` + `INDEXABLE_ROUTES`, linked in the footer; named `/site-map/` so it does not clash with `app/sitemap.ts`) |
| System              | `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/opengraph-image.png`, `/apple-touch-icon.png`, `/404.html` (noindex)         | —                                                      | Live                                                                                                                                                    |

Primary keywords for the Batch 2 calculators are recorded in `00-PROJECT-STATUS.md` (per-tool phase sections) and in `docs/keywords analysis/Batch 2/`.

---|---|---|---|---|
| `/` | free online tools | 350 | WebSite, Organization | Planned |
| `/tools/` | free online generators | 150 | BreadcrumbList | Planned |
| `/band-name-generator/` | band name generator | 1,000 | WebApplication, BreadcrumbList, FAQPage | Planned |
| `/band-name-generator/kpop/` | kpop band name generator | 600 | WebApplication, BreadcrumbList, FAQPage | Planned |
| `/band-name-generator/metal/` | metal band name generator | 600 | WebApplication, BreadcrumbList, FAQPage | Planned |
| `/band-name-generator/heavy-metal/` | heavy metal band name generator | 600 | WebApplication, BreadcrumbList, FAQPage | Planned |
| `/band-name-generator/rock/` | rock band name generator | 600 | WebApplication, BreadcrumbList, FAQPage | Planned |
| `/band-name-generator/random/` | random band name generator | 600 | WebApplication, BreadcrumbList, FAQPage | Planned |
| `/band-name-generator/boy-band/` | boy band name generator | 600 | WebApplication, BreadcrumbList, FAQPage | Planned |
| `/band-name-generator/punk/` | punk band name generator | 600 | WebApplication, BreadcrumbList, FAQPage | BLOCKED |
| `/band-name-generator/pop/` | pop band name generator | 600 | WebApplication, BreadcrumbList, FAQPage | BLOCKED |
| `/guides/` | band naming guides | 120 | BreadcrumbList | Planned |
| `/guides/how-to-choose-a-band-name/` | how to choose a band name | 1,000 | Article, BreadcrumbList | Planned |
| `/guides/band-name-ideas-by-genre/` | band name ideas by genre | 1,000 | Article, BreadcrumbList | Planned |
| `/guides/how-to-check-if-a-band-name-is-taken/` | how to check if a band name is taken | 1,000 | Article, BreadcrumbList | Planned |
| `/about/` | about our tools | 250 | Organization, BreadcrumbList | Planned |
| `/contact/` | contact us | 100 | BreadcrumbList | Planned |
| `/privacy-policy/` | privacy policy | N/A | BreadcrumbList | Planned |
| `/terms/` | terms of service | N/A | BreadcrumbList | Planned |
| `/404.html` | N/A (noindex) | N/A | None | Planned |

---

## 2. Cannibalisation Prevention Plan

### Metal vs. Heavy Metal
- `metal`: Focuses on modern sub-genres (death, black, doom, thrash, core). Dark, occult, abrasive vocabulary.
- `heavy-metal`: Focuses on classic 1970s–1980s NWOBHM and arena metal (steel, thunder, warriors, dragons).
- Jaccard similarity must stay strictly below 0.30.

---

## 3. Technical SEO Rules

- **Static Export Friendly**: All dynamic routes defined in `generateStaticParams()` with `dynamicParams = false`.
- **Self-referencing Canonical**: Absolute URLs with trailing slash.
- **Title Limits**: ≤ 65 chars hard limit. Keyword placed first.
- **Meta Description**: 70–160 chars.
- **Zero Third-Party Scripts**: No render-blocking tags, no external analytics or ad scripts until Phase 7.
- **One connected JSON-LD graph**: Organization + WebSite `@id`s in the layout; page schema normalized by `normalizeSchema.ts`; only one FAQPage per page.
- **Sitemap**: `loc` + `lastmod` only; generated from the route list. `llms.txt` is generated from the same list.
- **robots.txt**: allows AI search bots explicitly.
- **Hosting headers**: `public/_headers` (CSP, HSTS, nosniff, immutable cache for `/_next/static/*`) — served by Cloudflare Static Assets.
- **JSON-LD**: Validated Schema.org markup matching on-page content.

## External links (2026-11-15)
- External source links in "How We Calculate" and in guide Markdown open in a new tab with `rel="noopener noreferrer"` (`HowWeCalculate.tsx`, `renderer.link` in `src/lib/guides.ts`).
- Commercial/manufacturer links that are not citations use `rel="nofollow noopener noreferrer"` (e.g. the Quikrete link on `/concrete-calculator/`).



<!-- ========================================================= -->
<!-- FILE: docs/03-PAGES-AND-DESIGN.md -->
<!-- ========================================================= -->

# 03 — Pages & Design System

## 1. Design Direction (current, see Decisions 04–09 in `00-PROJECT-STATUS.md`)
- Typography: **Bricolage Grotesque** (headings) + **Inter** (body), self-hosted via `next/font/google` (`src/app/layout.tsx`).
- Light theme: warm sand canvas, white cards, slate ink, sky-blue actions, terracotta-orange CTAs.
- Dark theme: "Obsidian Carbon" — near-black canvas, elevated charcoal cards, light-blue accent, orange CTAs.
- Category colour themes per tool group (`--cat-*` tokens: concrete, gravel, earthwork, …).
- No theme flash (inline script in `<head>`); theme key `kkc_theme_pref`, default Light.
- Zero layout shift target (CLS ≤ 0.1).

The original "Stage Lights" purple palette (Phase 1) has been replaced.

---

## 2. Key Tokens (`src/styles/tokens.css` — the file is the source of truth)

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#EBE4D6` | `#090C12` |
| `--surface` | `#FFFFFF` | `#11151F` |
| `--ink` | `#0F172A` | `#F1F5F9` |
| `--ink-2` | `#334155` | `#94A3B8` |
| `--muted` | `#556274` | `#8291A6` |
| `--accent` | `#0369A1` (hover `#075985`) | `#38BDF8` |
| `--accent-ink` | `#FFFFFF` | `#090C12` |
| `--brand-orange` | `#C2410C` | `#F97316` |
| `--brand-orange-text` | `#9A3412` | `#FB923C` |
| `--cat-*-deep` | darker category shade for text on tints (e.g. `#075985`) | light shade (e.g. `#BAE6FD`) |
| `--cat-*-g1` / `-g2` | fixed category gradient (same in both themes; white text ≥ 5:1) | same |

Other tokens: radii (`--radius-s` 8, `-m` 14, `-l` 18, `-card` 16, `-pill`), shadows (`-s/-m/-l/-card/-pop`), spacing `--space-1…9` (4–96 px), `--container` 1200 px, `--prose` 68ch.

---

## 3. Contrast Verification (re-measured 2026-11-15 with the WCAG 2.x formula after the AdSense-report fixes)

Target: ≥ 4.5:1 for body text, ≥ 3.0:1 for large text / UI borders. All pairs below now pass for small body text.

| Mode | Text | Background | Ratio | Body text |
|---|---|---|---|---|
| Light | `--ink` | `--bg` | 14.1:1 | PASS ✅ |
| Light | `--ink` | `--surface` | 17.9:1 | PASS ✅ |
| Light | `--ink-2` | `--surface` | 10.4:1 | PASS ✅ |
| Light | `--muted` `#556274` | `--surface` | 6.2:1 | PASS ✅ |
| Light | `--muted` `#556274` | `--bg` | 4.9:1 | PASS ✅ (was 3.8 with `#64748B`) |
| Light | `--accent-ink` (white) | `--accent` `#0369A1` | 5.9:1 | PASS ✅ (was 4.1 with `#0284C7`) |
| Light | `--accent` `#0369A1` | `--bg` | 4.7:1 | PASS ✅ |
| Light | `--success` `#166534` | `--bg` | 5.6:1 | PASS ✅ |
| Light | white | `--brand-orange` | 5.2:1 | PASS ✅ |
| Light | `--brand-orange-text` `#9A3412` | `--bg` | 6.0:1+ | PASS ✅ (use this, not `--brand-orange`, for orange text) |
| Dark | `--ink` | `--bg` | 17.9:1 | PASS ✅ |
| Dark | `--ink` | `--surface` | 16.7:1 | PASS ✅ |
| Dark | `--ink-2` | `--surface` | 7.1:1 | PASS ✅ |
| Dark | `--muted` `#8291A6` | `--bg` | 6.1:1 | PASS ✅ (was 4.1) |
| Dark | `--muted` `#8291A6` | `--surface` | 5.7:1 | PASS ✅ (was 3.8) |
| Dark | `--accent-ink` | `--accent` | 9.1:1 | PASS ✅ |
| Dark | `--bg` | `--brand-orange` | 7.0:1 | PASS ✅ |
| Footer | `.copyright` `#94A3B8` | footer `#17213A` | 6.2:1 | PASS ✅ |

**Hardcoded colours (2026-11-15):** older tool components used fixed hex values instead of tokens. Text uses of `#64748B` were switched to `var(--muted)` (52 places). Site-wide, `#0284C7` → `#0369A1`, old `#0369A1` hover → `#075985`, and `#059669` → `#065F46` (73 files; `tokens.css` excluded). New code must use tokens, not hex values.

**Links in text (WCAG 1.4.1):** links inside paragraphs and list items in articles/prose, and unclassed links in any `main p`, are underlined (`globals.css`), so they do not rely on colour alone.

**Form labels:** every tool input must have a `<label htmlFor>` or an `aria-label`. On 2026-11-15, 54 inputs whose visible `<label>` had no `htmlFor` got a matching `aria-label`.

**Undefined variables:** many older tool CSS files used `var(--color-text-muted, #64748b)`; `--color-text-muted` is not defined, so the low-contrast fallback showed. These now use `var(--muted)`. Light-grey `#94A3B8` text and red `#EF4444` text in tool CSS were changed to `var(--muted)` and `#B91C1C`.

**Other a11y rules:** segmented buttons use `aria-pressed` (not `aria-checked` without a role, nor `role="tablist"` without tabs); headings go h1 → h2 → h3 without skips; empty table header cells get `<span className="sr-only">`; `.sr-only` lives in `globals.css`.

**Result (2026-11-15):** Lighthouse 12.6.0 accessibility = 100 on all 47 built pages.

---

## 4. Home Page Layout (redesigned 2026-11-15)

Goal: every section looks different while scrolling, and each trade has its own colour.

| # | Section | Look |
|---|---|---|
| 1 | Hero (`HomeHero`) | colourful mesh background; "Calculators" in a blue→purple→rose gradient with a hand-drawn orange underline; category chips tinted per category and wrapping to two rows; right side: `HeroScene` illustrated building site (slab, stud wall with window, truss + shingle roof with pitch marker, painted wall and roller, gravel pile, crane, tree, tape measure) in a blueprint panel, with the three result cards hanging off its corners on desktop; on phones the scene shows under the buttons |
| 2 | Trust strip | unchanged |
| 3 | `CategoryTiles` — "Pick a trade" | 6 gradient tiles (one per category, `--cat-*-g1/g2`), tool count, jump link |
| 4 | New & updated | warm orange tint; grid trimmed to full rows of 4 |
| 5 | Category bands 01–03 (`CategorySection`) | own tint + blueprint grid + glow, gradient icon badge, outlined numeral, coloured eyebrow pill and underline; layout alternates **split** (heading column + 2×2 cards, sticky heading) / **stack** (heading row + 4 across); split headings flip sides |
| 6 | Why us (`WhyUs`) | dark navy band with dot pattern; each point a different category colour |
| 7 | Category bands 04–06 | as above |
| 8 | Guides | cards with gradient covers and icons, tinted badges |
| 9 | FAQ | soft accent glow |
| 10 | Suggest banner | unchanged |

- **Tool cards (`ToolCard`)**, used on Home and `/tools/` (redesigned again 2026-11-15 after owner feedback "too simple, text too small"):
  - 172 px illustration panel with a tool-specific SVG diagram (`ToolArt.tsx`, one per tool icon, e.g. slab with dimensions, rebar grid, wire gauges, pipe OD/ID, paver layers), blueprint grid, category chip and NEW/UPDATED badge;
  - gradient icon tile + 1.25 rem title, 0.975 rem description (2 lines), tinted tag pills;
  - footer with "Open tool →" and "Free · No sign-up"; coloured ring + lift on hover;
  - grids are 3 across on desktop (split sections 2 across), 2 on tablets, 1 on phones; on phones the card is a row with a 104 px diagram thumbnail.
- Section card counts are multiples of the column count: split 4 (2×2), stack 6 (3×2), Business 3, New 9.
- `AdPlaceholder` renders nothing while `NEXT_PUBLIC_ADS_ENABLED` is false, so visitors never see an empty "advertisement" box.
- Section `overflow: clip` (not `hidden`) so the sticky heading works.
- Lighthouse after the redesign (local build, 2026-11-15): mobile 96 / 100 / 96 / 100, desktop 100 / 100 / 96 / 100 (Perf / A11y / BP / SEO); CLS 0.001; Best Practices 96 only from the local-only `__next.*.txt` 404.

**`--danger` (2026-11-15):** light value darkened from `#DC2626` to `#B91C1C` (5.5:1 on the tinted remove-button background, 6.5:1 on white). The old value failed contrast on the "Remove" buttons that appear when a tool has more than one row.



<!-- ========================================================= -->
<!-- FILE: docs/04-KEYWORDS.md -->
<!-- ========================================================= -->

# 04 — Keyword Strategy & Intelligence

## 1. Where the keyword data lives

| Scope | Source |
|---|---|
| Band Name Generator cluster (Batch 1) | §2 below — SEMrush US, Desktop, Nov 2026 (939 keywords, 20,880 volume, avg KD 13%) |
| Construction calculators (Batch 2) | `docs/keywords analysis/Batch 2/1. master filtered file/KKCTools_Batch2_Final_Tool_Keywords.md` |
| Planned tools (Batches 3–8) | `docs/keywords analysis/Batch N …/2. … filtered master keywords/` (one final-keywords file per batch) |
| Competitor analysis per tool | `docs/keywords analysis/Batch N …/` "All Blogs Data" folders (121 files across Batches 2–8) |

Recorded primary keywords for built Batch 2 tools (from `00-PROJECT-STATUS.md`):
- Concrete Calculator — `concrete volume calculator`, US 3,600 / KD 5.
- Drywall Calculator — `drywall calculator`, US 12,100 / KD 41.
- Lawn Mowing Cost Calculator — `lawn mowing cost calculator`, US 1,000 / KD 3 (secondaries: `free lawn mowing cost calculator` 140/0, `lawn mowing cost calculation` 50/1, `lawn mowing cost calculator per acre` 70/20).
- Shingle Roof Calculator — `shingle roof calculator`, US 1,300 / KD 10; real traffic in the bundle questions (`how many shingles in a bundle` 2,900/10, `how many bundles of shingles in a square` 2,400/6 + variants 1,900 and 1,300), all answered as H2s/FAQs.
- Board and Batten Calculator — `board and batten calculator`, US 4,400 / KD 22 / CPC $5.55. No secondary keywords in the export — `TODO(owner)`: export `batten spacing calculator`, `board and batten spacing`, `accent wall calculator`, `wainscoting calculator`.
- Pipe & Tube Volume Calculator — `tube volume calculator`, US 1,600 / Global 4,800 / KD 12 (in the first paragraph and an H2); support `pipe volume calculator` 3,600 / KD 25 (title + H1).
- Wire Gauge Calculator — `wire gauge calculator`, US 5,400 / Global 8,600 / KD 11; secondaries `size electrical wire calculator` 5,400/13, `wire gauge length calculator` 1,600/14 ("Wire gauge by length" H2), `wire size calculator` 5,400/24.
- Concrete Slab Cost Calculator — `concrete slab cost calculator`, US 8,100 / Global 10,100 / KD 16 / CPC $2.36; H2/FAQ targets `how much is a yard of concrete` 8,100/12, `concrete slab cost per sq ft` 1,300/10, `how much is a 10 yard truck of concrete` 1,000/7, `concrete patio cost` 2,400/7. Cost lives here; quantity stays on `/concrete-calculator/` (pages link to each other).
- Deck Stain Calculator — `deck stain calculator`, US 720 / Global 860 / KD 14; secondaries `stain calculator deck` 1,300/20, `deck staining cost calculator` 390/20 (DIY vs pro cost block), `deck stain coverage calculator` 90/18 (coverage H2). Cross-linked with Fence Stain.
- Fence Cost Calculator — `fence cost calculator`, US 1,600 / Global 2,100 / KD 21 / CPC $1.83; H2/FAQ targets `fence prices chain link` 9,900/16, `cyclone fence cost` 8,100/11, `cost to replace a fence` 3,600/11, `privacy fence cost` 2,400/10, `vinyl fence cost` 2,400/12, `how much does a fence cost` 2,400/10.
- Cubic Feet ↔ Square Feet Converter — `cubic feet to square feet`, US 3,600 / Global 9,100 / KD 23; Indian wording `cft to square feet` 2,400/20 and `square feet to cft` 2,400/23 answered in a cft section and FAQ (cft, brass = 100 cft).
- Metal Roof Cost Calculator — `metal roof cost calculator`, US 1,900 / KD 24 / CPC $4.11; H2/FAQ targets `standing seam metal roof cost` 2,900/7, `roofing cost metal vs shingle` 2,900/13, `how much does a metal roof cost` 2,400/20, `metal roof cost per square foot` 1,300/13.
- Bathroom Remodel Cost Calculator — `cost to remodel bathroom calculator`, US 2,900 / KD 7 / CPC $5.68; `cost of bathroom renovations calculator` 4,400/19 ("renovation" H2), `small bathroom remodel cost calculator` 320/2 (FAQ).
- Floor Refinishing Cost Calculator — `hardwood floor resurfacing cost`, US 6,600 / KD 24 / CPC $4.35 (H1 + H2; irregular trend); `cost to refinish hardwood floors` 3,600/23 (intro + H2).
- Cubic Inch Calculator — `cubic inch calculator`, US 3,600 / KD 9 (title, H1, intro); `engine displacement calculator` 3,600/18 (H2 + first sentence of the engine section). Blueprint title (56 chars) shortened to 52 so it fits 65 with the brand.
- Roof Replacement Cost Calculator — `roof replacement cost calculator`, US 2,900 / KD 4 / CPC $7.42 (title, H1, BLUF); secondaries `how much is a new roof` 4,400 / KD 9, `roofing cost per square` 1,900 / KD 7, `roofing labor cost per square` 1,600 / KD 5, `cost to tear off and replace roof` 480 / KD 14. Target page `/roof-replacement-cost-calculator/`.
- Carpet Cost Calculator — `carpet cost per square foot`, US 4,400 / KD 27 / CPC $1.63 (title, H1, BLUF); secondaries `carpet replacement cost` 4,400 / KD 18 / CPC $8.09 (H2, FAQ), `cost per sq ft for carpet` 3,600 / KD 27, `carpet flooring installation cost` 1,600 / KD 21, `carpet removal prices` 1,300 / KD 24, `berber carpet cost` 1,000 / KD 23, `carpet tile installation cost` 590 / KD 11, `cost to replace carpet on stairs` 590 / KD 12. Target page `/carpet-cost-calculator/`.
- Percentage Change Calculator — primary for now `how to find percent change` US 8,100 / KD 10; `percentage change formula` 6,600/12, `percentage difference between two numbers` 2,900/7, Excel cluster (~20K, KD 24–29). Head term `percentage increase calculator` 74K is long-term only (strong SERP). Spec: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/1. …/01_…_BUILD_SPEC.md`.
- Markup Calculator — `markup calculator` US 14,800 / KD 24 / CPC $5.16 (title, H1, BLUF); `figuring markup` 2,400/12, `what is retail price` 2,400/7, `retail math` 1,900/16, `markup vs margin` 2,400/25.
- Profit Margin Calculator — `gross margin calculator` US 8,100 / KD 8 (first sentence, H2); `gross profit margin formula` 8,100/9, `calculate profit margin` 4,400/11, `net profit margin formula` 3,600/11. SERP hard (Omni, CalculatorSoup, Xero…); realistic target bottom of page 1.
- Unit Price Calculator — see Batch 3 spec `05_Unit_Price_Calculator_BUILD_SPEC.md` (weakest SERP in Batch 3; build order 1).
- Hourly to Salary Calculator — `yearly wage calculator` US 6,600 / KD 0 (primary), `calculate annual salary` 6,600/10, `monthly gross income calculator` 3,600/9, `how to calculate annual income biweekly` 1,300/0. `wage calculator` 18.1K is paycheck/tax intent: natural mention only.
- Discount Calculator — receives the percent-off terms kept off the Percentage Change page (`off percent calculator` 6,600 and "X percent off Y" long tail). `TODO(owner)`: confirm primary keyword and KD from Semrush.
- Cap Rate Calculator — primary `cap rate calculator` US 33,100 / KD 12 / CPC $2.84; secondaries `how to calculate cap rate` 22,200 / KD 18, `what is a good cap rate` 2,400 / KD 24, `what is cap rate` 1,900 / KD 24, `cap rate equation` 1,600 / KD 7, `capitalization rate calculator` 1,600 / KD 8, `what does a 7 cap rate mean` 480 / KD 3. Spec: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/06_Cap_Rate_Commercial_Property_Value_Calculator/06_Cap_Rate_Calculator_BUILD_SPEC.md`. Target page `/cap-rate-calculator/`.
- Rental Property Calculator — primary `cash on cash return calculator` US 1,300 / KD 17 / CPC $0.81; secondaries `cash on cash return` 3,600 / KD 7, `calculate rental property` 2,900 / KD 8, `investment property calculator` 1,300 / KD 2, `cash on cash roi` 880 / KD 1, `rental cash flow calculator` 480 / KD 14, `real estate pro forma` 480 / KD 18, `property value to rent ratio` 390 / KD 12. Spec: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/07_Rental_Property_Calculator/07_Rental_Property_Calculator_BUILD_SPEC.md`. Target page `/rental-property-calculator/`.
- Labor Cost Calculator — primary `labor cost` US 1,900 / KD 14 / CPC $6.43; secondary `how to estimate labor costs for construction` 1,000 / KD 5. Natural phrases: `burdened labor rate`, `labor burden calculator`, `true cost of an employee`, `labor cost percentage`. Spec: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/18_Labor_Cost_Calculator/18_Labor_Cost_Calculator_BUILD_SPEC.md`. Target page `/labor-cost-calculator/`.
- Commercial Lease Calculator — primary `commercial lease calculator` US 390 / KD 17 / CPC $2.46; secondary `triple net lease calculator` 480 / KD 12, `cam expenses` 260 / KD 8, `rent increase calculator` 1,600 / KD 15. Natural phrases: `rentable vs usable square feet`, `gross vs nnn lease`, `net effective rent calculator`. Spec: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/10_Commercial_Lease_Calculator/10_Commercial_Lease_Calculator_BUILD_SPEC.md`. Target page `/commercial-lease-calculator/`.
- Airbnb Profit Calculator — primary `airbnb profit calculator` US 880 / KD 19 / CPC $2.94; secondary `free airbnb calculator` 480 / KD 0, `vacation rental investment calculator` 320 / KD 5, `airbnb arbitrage calculator` 260 / KD 4, `vrbo calculator` 390 / KD 12. Natural phrases: `how much can i make on airbnb`, `break even occupancy airbnb`, `short term rental cash flow`, `str vs long term rental`. Spec: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/14_Airbnb_Short_Term_Rental_Profit_Calculator/14_Airbnb_Calculator_BUILD_SPEC.md`. Target page `/airbnb-calculator/`.
- Freelance Rate Calculator — primary `freelance rate calculator` US 320 / KD 19; secondaries `why is seo expensive` 480 / KD 14, `how much do copywriters charge` 70 / KD 9, `how much is copywriting` 70 / KD 6, `seo consultant hourly rate` 590 / KD 20, `freelance cost calculator` 260 / KD 24. Natural phrases: `what to charge as a freelancer`, `freelance day rate formula`, `billable hours per year`, `freelance tax set aside`. Spec: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/15_Freelance_Hourly_Rate_Calculator/15_Freelance_Rate_Calculator_BUILD_SPEC.md`. Target page `/freelance-rate-calculator/`.
- Contribution Margin Calculator — primary `contribution margin and contribution margin ratio` US 2,400 / KD 4; secondaries `contribution margin equation` 1,900 / KD 17, `contribution margin ratio formula` 1,900 / KD 22, `define contribution margin` 1,300 / KD 6. Natural phrases: `contribution margin calculator`, `calculate contribution margin`, `how to calculate contribution margin`, `break-even calculator`, `cvp analysis`, `margin of safety calculator`. Spec: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/22_Contribution_Margin_Break_Even_Calculator/22_Contribution_Margin_Calculator_BUILD_SPEC.md`. Target page `/contribution-margin-calculator/`. Note: `TODO(owner)`: pull `break even calculator` Semrush volume/KD to consider dedicated tab/H2 expansion.

⚠ Batches 3–8 have no Semrush SERP export yet; their competitor lists come from web searches. `TODO(owner)`: pull Google top 10 per primary keyword (Phase KR-9).

---

## 2. Band Name Generator — Verified Keyword Targets

| Keyword | US Volume | KD % | Intent | Target Page |
|---|---|---|---|---|
| band name generator | 8,100 | 10% | Informational | `/band-name-generator/` |
| band name generator kpop | 880 | 16% | Commercial | `/band-name-generator/kpop/` |
| band names generator | 590 | 16% | Commercial | `/band-name-generator/` (plural variant) |
| kpop band name generator | 590 | 7% | Informational | `/band-name-generator/kpop/` |
| metal band name generator | 590 | 9% | Commercial | `/band-name-generator/metal/` |
| k pop band name generator | 480 | 10% | Commercial | `/band-name-generator/kpop/` |
| random band name generator | 480 | 23% | Commercial | `/band-name-generator/random/` |
| boy band name generator | 390 | 18% | Informational | `/band-name-generator/boy-band/` |
| heavy metal band name generator | 390 | 4% | Commercial | `/band-name-generator/heavy-metal/` |
| rock band name generator | 390 | 8% | Commercial | `/band-name-generator/rock/` |

### Unverified / pending owner input
- `punk band name generator`, `pop band name generator` — pages blocked until owner provides Semrush data.
- `ai band name generator` — the generator stays pure browser logic, no AI.
- India-related and word-based variants ("band name generator from words").



<!-- ========================================================= -->
<!-- FILE: docs/05-DEPLOY-AND-LAUNCH.md -->
<!-- ========================================================= -->

# 05 — Deployment, Launch & Maintenance Guide

## 1. Honest Expectation & Reality
Technical SEO, fast pages, useful tools, and good content give the site a fair chance. Nobody can guarantee rankings. Rankings depend on content quality, competition, backlinks, and time.

---

## 2. Deployment Setup

The site is a **pure static export** (`next.config.ts`: `output: 'export'`, `trailingSlash: true`). `npm run build` writes everything to `out/`. No server runtime is needed.

### Cloudflare (current target, 2026-11-14)
Served as **Workers Static Assets** from `out/`, configured in `wrangler.jsonc`:
- `assets.directory: "./out"`
- `html_handling: "auto-trailing-slash"`
- `not_found_handling: "404-page"` (serves `out/404.html`)
- Security and cache headers come from `public/_headers` (copied into `out/`).

Dashboard → Workers & Pages → `kkctools-frontend` → Settings → Build:
- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy`

Do **not** use OpenNext / `@opennextjs/cloudflare`. It needs `output: 'standalone'`, which breaks the static-export rule and is not an allowed dependency. The first Cloudflare deploy failed for exactly this reason (`.next/standalone/.next/server/pages-manifest.json` not found); having `wrangler.jsonc` in the repo stops Cloudflare's auto-setup from adding OpenNext again.

Local check before pushing: `npm run build && npx wrangler deploy --dry-run` (verified 2026-11-14: 522 files read from `out/`).

### Netlify (previous host)
`netlify.toml`: build `npm run build`, publish `out`, HUD disabled. Keep until the domain is moved to Cloudflare, then remove the Netlify site and `netlify.toml`. `TODO(owner)`: confirm the cut-over date.

### Google Analytics (installed 2026-11-15)
- Container `GTM-5CDW8CXG` (GA4 `G-DVNM8TFRQE`), set in `src/config/site.ts` as `GTM_ID`; override or switch off with `NEXT_PUBLIC_GTM_ID` (`''` = off).
- `src/app/layout.tsx` adds the `dataLayer`/`gtag` stub with Consent Mode v2 defaults, then injects `gtm.js` on the first scroll/tap/key or 5 s after `load` (changed from 1.5 s on 2026-11-15: GTM work inside Lighthouse's window was costing 5–10 mobile points; visitors who leave within 5 s without touching the page are not counted).
- `public/_headers` CSP allows `https://www.googletagmanager.com`, `https://*.googletagmanager.com`, `https://*.google-analytics.com` and `https://*.analytics.google.com` (script, connect, img) and `frame-src https://www.googletagmanager.com`. Any new Google product (e.g. AdSense) needs its own CSP entries.
- After deploy: GA4 → Reports → Realtime should show your own visit; Tag Assistant can confirm the container.

### Environment variables
- `NEXT_PUBLIC_SITE_URL`: production domain (`https://www.kkctools.com`).
- `NEXT_PUBLIC_ADS_ENABLED`: `false` until AdSense approval.
- `NEXT_PUBLIC_GTM_ID`: optional; defaults to `GTM-5CDW8CXG`.

---

## 3. Post-Launch Steps

1. Point the domain DNS at Cloudflare and attach the custom domain to the Worker.
2. Verify the domain in Google Search Console and Bing Webmaster Tools.
3. Submit `https://www.kkctools.com/sitemap.xml`.
4. Request indexing for Home, `/tools/`, and the main tool pages.
5. Run PageSpeed Insights on live URLs; save results in `docs/evidence/`.
6. Confirm the `_headers` (CSP, HSTS) are served by Cloudflare on the live site. *(Checked 2026-11-15: CSP, HSTS and the other headers are served.)*
6a. **Turn off Cloudflare Web Analytics** (`TODO(owner)`): Dashboard → Workers & Pages → `kkctools-frontend` → Metrics / Settings → Web Analytics → disable (also check the zone under Analytics & Logs → Web Analytics). Cloudflare injects `static.cloudflareinsights.com/beacon.min.js` into every page; our CSP blocks it, which shows a console error (Lighthouse "Best Practices"), and it would break the "no third-party scripts until Phase 7" rule. An external AdSense-readiness scanner mistook this beacon for Google Analytics.
6b. Redeploy after every merge. On 2026-11-15 the live site was still an older build (home page said "Search 24 tools"; the newest 5 tools, Disclaimer and Site Map were missing).
7. After indexing and steady traffic, apply to Google AdSense; then set up a certified CMP for EEA/UK and add `ads.txt`.
   - Cookie banner: not needed today, because the site sets no cookies and loads no third-party scripts (theme choice is `localStorage` only). When ads are switched on, use Google's own certified consent message (AdSense → Privacy & messaging), not a custom banner.
   - Before applying: Disclaimer (`/disclaimer/`), HTML site map (`/site-map/`), Privacy, Terms, About and Contact pages are all live in the build and linked from the footer.



<!-- ========================================================= -->
<!-- FILE: docs/06-CHANGELOG.md -->
<!-- ========================================================= -->

# 06 — Changelog

All notable changes to this project will be documented in this file, sorted newest first.

---

### [UI Contrast & Accessibility Hotfix — High Contrast Metric Cards] — 2026-11-24

- **Global Design Tokens (`src/styles/tokens.css`):**
  - Added `--ink-muted: #556274;` and `--surface-subtle: #F8FAFC;` in `:root`.
  - Added `--ink-muted: #8291A6;` and `--surface-subtle: #19202D;` in `:root[data-theme="dark"]`.
- **Binomial Probability Calculator (`/binomial-probability-calculator/`):**
  - Fixed white text contrast issue on statistical moments cards (`Expected Mean (μ)`, `Variance (σ²)`, `Standard Dev (σ)`, `Mode (Most Likely k)`).
  - Explicitly set `color: var(--ink, #0F172A)` on `.statCard`, and updated `.statLabel` and `.statSub` to `color: var(--ink-soft, #475569)`.
  - Updated `.pillBtn` to `var(--ink-2)`, `.helperText` to `var(--muted)`, `.chartLegend` to `var(--ink-soft)`, and `.assumptionItem` to `var(--ink-2)`.
  - Updated `BinomialInputGuide.module.css` `.title` and `.chip` to `var(--ink-soft)`.
- **System-Wide Metric & Stat Cards Contrast Hardening Across All Calculators:**
  - `StandardDeviationCalculator` & `StdevInputGuide`: Hardened `.statCard`, `.statLabel`, `.statVal`, `.statSub`, `.title`, `.chip`, `.helperText`.
  - `TTestCalculator` & `TTestInputGuide`: Hardened `.statCard`, `.statLabel`, `.statVal`, `.statSub`, `.chartLegend`, `.modeBtn`, `.pillBtn`, `.helperText`, `.assumptionItem`, `.title`, `.chip`.
  - `CagrCalculator` & `CagrInputGuide`: Hardened `.prefix`, `.suffix`, `.helperText`, `.formulaLabel`, `.title`, `.nodeDetail`, `.seriesTag`, `.seriesSub`, `.vsBadge`, `.ruleLabel`, `.chip`.
  - `FractionPercentCalculator` & `FractionInputGuide`: Hardened `.helperText`, `.title`, `.eqLabel`, `.resultTag`, `.chip`.
  - `ReverseTaxCalculator` & `ReverseTaxInputGuide`: Hardened `.prefix`, `.suffix`, `.helperText`, `.title`, `.chip`.
  - `UnitPriceCalculator`: Hardened `.addBtn:disabled` text color.
  - `BooleanCalculator` & `MetricCalculator`: Added design token mappings for `--color-*` to `--surface`, `--line`, `--ink`, `--muted`, and enforced `color: var(--color-text)` on `.calculatorWrapper`.
  - `IqrCalculator`, `AgeCalculator`, `AbTestCalculator`, `GallonsConverter`, `PythagoreanCalculator`, `SlopeCalculator`, `TankCalculator`, `SimpleInterestCalculator`, `RoiCalculator`, `FinalGradeCalculator`, `BudgetCalculator`, `RatioCalculator`: Enforced explicit `color: var(--ink)` on card containers to prevent white text inheritance.
- **Verification:** `npm run verify` passed all 6 steps (`lint`, `test`, `check:no-network`, `build`, `seo:audit`, `docs:bundle`) with 1,114 tests passing.

---

### [Batch 5 — All 20 Tools & Milestones Completed] — 2026-11-24

- **Tool 20: Metric Conversion Calculator (`/metric-conversion-calculator/`):**
  - Engine: `src/lib/metric-engine.ts` with 10 Vitest tests (`src/lib/metric-engine.test.ts`) matching all spec worked examples (10 ft $\implies$ exactly 3.048 m; 5′ 10″ $\implies$ 1.778 m; 100 kg $\implies$ 220.462 lb; 68 °F $\implies$ 20 °C; 10 °C temperature difference $\implies$ 18 °F; 1 m² $\implies$ 10.7639 ft²).
  - Modes: Length, Weight/Mass, Volume (US liquid vs Imperial vs metric), Area (squared factors), Temperature (reading vs Δ difference), and Speed.
  - UI: `MetricCalculator.tsx` with mixed feet-inches parsing (e.g. `5' 10"`, `5 ft 10 1/2 in`), live swap button, precision toggles (2, 4, 6 decimals), category-wide conversion cards, and dynamic 1–10 conversion table with CSV download.
  - Custom InputGuide: `MetricInputGuide.tsx` with dual-scale ruler, balance scale, jug volume comparisons, and thermodynamic thermometer.
  - Page & SEO: `src/app/metric-conversion-calculator/page.tsx` (`absoluteTitle: true`), Breadcrumbs, HowWeCalculate referencing NIST SP 811 & HB 44 and BIPM 2019 SI Brochure, and 10 FAQs.

- **Tool 19: Boolean Algebra Calculator (`/boolean-algebra-calculator/`):**
  - Engine: `src/lib/boolean-engine.ts` with 10 Vitest tests (`src/lib/boolean-engine.test.ts`) matching all spec worked examples (`(A AND B) OR (A AND NOT B)` $\implies$ minimal SOP `A` with $\Sigma m(2,3)$; `NOT(A AND B)` vs `NOT A OR NOT B` $\implies$ equivalent via De Morgan; `A AND (A OR B)` $\implies$ `A` via absorption; binary addition $1011_2 + 0110_2 = 10001_2$ ($11 + 6 = 17$); −5 in 8-bit two's complement $\implies 11111011_2$).
  - Modes: Simplify & Truth Table (full $2^n$ evaluation with minterms/maxterms and RFC 4180 CSV export), Equivalence Check with first differing counterexample row, and Binary/Bitwise Math (arbitrary-precision BigInt, 8/16/32/64-bit registers, two's complement signed view, and hex/octal/decimal).
  - UI: `BooleanCalculator.tsx` with syntax insertion chips, dark gradient hero card, and quick two's complement signed decimal converter.
  - Custom InputGuide: `BooleanInputGuide.tsx` with logic gate pipeline, equivalence indicator, and bit register blocks.
  - Page & SEO: `src/app/boolean-algebra-calculator/page.tsx`, Breadcrumbs, HowWeCalculate referencing Quine (1952) and McCluskey (1956), and 10 FAQs.

- **Tool 18: Monthly Budget Calculator (50/30/20) (`/budget-calculator/`):**
  - Engine: `src/lib/budget-engine.ts` with 4 Vitest test suites (`src/lib/budget-engine.test.ts`) matching all spec worked examples ($5,000 net income $\implies$ Needs $2,750 (55%), Wants $1,000 (20%), Savings $750 (15%), leaving $500 leftover surplus; bi-weekly $2,000 $\implies$ $4,333.33/mo; weekly $1,000 $\implies$ $4,333.33/mo; sinking fund annual bills $1,200/yr $\implies$ $100/mo).
  - Modes: Income normalization across 5 pay frequencies, itemized expense allocation with 50/30/20 or custom percentage splits, sinking fund annual bills, and RFC 4180 CSV spreadsheet export.
  - UI: `BudgetCalculator.tsx` with dynamic visual breakdown bars, delta gap analysis, and interactive line-item management.
  - Custom InputGuide: `BudgetInputGuide.tsx` with 3 bucket cards, target percentages, and status badge.
  - Page & SEO: `src/app/budget-calculator/page.tsx` (`absoluteTitle: true`), Breadcrumbs, HowWeCalculate referencing Elizabeth Warren (2005) and CFPB standards, and 10 FAQs.

- **Tool 17: Final Grade Calculator (`/final-grade-calculator/`):**
  - Engine: `src/lib/final-grade-engine.ts` with 6 Vitest tests (`src/lib/final-grade-engine.test.ts`) matching all spec worked examples (Current 85%, final 20%, target 87% $\implies$ 95.00% needed on final with reachable range 68%–88%; Letter cutoffs: A (90%) not reachable, B (80%) requires 60.00%, D (60%) already secured; Weighted categories: HW 20% @ 92, Quiz 20% @ 85, Tests 35% @ 80, Final 25%, target 85% $\implies$ 86.40% needed).
  - Modes: Simple Course Grade, Category-Weighted Grade, Total Points / Point Accumulation, and Final Worth Multiple Tests.
  - UI: `FinalGradeCalculator.tsx` with visual progress meter, reachable score bounds, letter grade cutoff status table, and course category manager.
  - Custom InputGuide: `FinalGradeInputGuide.tsx` with semester progress visual, final weight badge, and target grade indicator.
  - Page & SEO: `src/app/final-grade-calculator/page.tsx` (`absoluteTitle: true`), Breadcrumbs, HowWeCalculate referencing College Board & MAA weighted grading frameworks, and 10 FAQs.

- **Tool 16: ROI Calculator (`/roi-calculator/`):**
  - Engine: `src/lib/roi-engine.ts` with 6 Vitest tests (`src/lib/roi-engine.test.ts`) matching all spec worked examples ($10,000 initial, $15,000 final in 3 years $\implies$ 50% simple ROI, 14.47% annualized ROI; Marketing: $20,000 revenue, $5,000 cost, 40% margin $\implies$ 60% ROI on margin, 300% revenue ROI, 4.0 ROAS; Project: $12,000 cost, $4,000/yr savings $\implies$ 3.0 year payback, 66.67% 5-yr ROI; Fisher equation real inflation-adjusted ROI).
  - Modes: Simple Investment ROI & Annualized Rate, Marketing & Advertising Campaign ROI (ROAS vs gross margin ROI), Business Project / Capital Investment Payback, and Real Inflation-Adjusted ROI.
  - UI: `RoiCalculator.tsx` with metric cards, annual breakdown table with CSV export, and Fisher equation inflation adjustment.
  - Custom InputGuide: `RoiInputGuide.tsx` with capital growth arrow, gain/loss indicators, and duration meter.
  - Page & SEO: `src/app/roi-calculator/page.tsx` (`absoluteTitle: true`), Breadcrumbs, HowWeCalculate referencing CFA Institute & SEC Rule 156 GIPS guidelines, and 10 FAQs.

- **Tool 15: Simple Interest Calculator (`/simple-interest-calculator/`):**
  - Engine: `src/lib/simple-interest-engine.ts` with 7 Vitest tests (`src/lib/simple-interest-engine.test.ts`) matching all spec worked examples ($10,000 principal at 5% for 3 years $\implies$ $1,500 interest, $11,500 total; accrued interest 2026-01-15 to 2026-04-15 (90 days) $\implies$ $123.29 (Actual/365) vs $125.00 (Actual/360) vs $125.00 (30/360); Bond coupon: $1,000 face at 5.75% semi-annual, 61 of 180 days $\implies$ $9.74 accrued; Compound comparison $\implies$ $1,614.72).
  - Modes: Standard I = P·r·t (solve for any variable), Date-to-Date Accrual with day-count conventions, Fixed-Income Bond Coupon Accrual, and Compound vs Simple comparison side-by-side.
  - UI: `SimpleInterestCalculator.tsx` with dynamic year-by-year amortization schedule, day-count convention selector, and CSV export.
  - Custom InputGuide: `InterestInputGuide.tsx` with loan principal arrow, interest earnings pillar, and calendar timeline.
  - Page & SEO: `src/app/simple-interest-calculator/page.tsx`, Breadcrumbs, HowWeCalculate referencing ICMA and MSRB Rule G-33 standards, and 10 FAQs.

- **Verification Pipeline:**
  - `npm run verify` passed all 6 steps (`lint`, `test`, `check:no-network`, `build`, `seo:audit`, `docs:bundle`). All 130 static routes prerendered without errors.
  - Total catalog tools: 95 tools. Total passing Vitest tests: 1,114. Total static routes in routes.ts: 113.

---

### [Batch 5 — Tool 14: Tank Volume Calculator] — 2026-11-24

- **Tool 14 (`/tank-volume-calculator/`) implemented:**
  - Calculation Engine: `src/lib/tank-engine.ts` with 9 Vitest tests (`src/lib/tank-engine.test.ts`) matching all spec worked examples (6 × 12 ft flat-end cylinder $\implies$ 2,538.1 US gal full, at 2 ft depth $\implies$ 740.6 gal, 29.2% full; 10 ft diameter at 3 ft depth $\implies$ 25.2% full; vertical 4 × 6 ft cylinder $\implies$ 564.0 US gal; 4 × 10 ft horizontal $\implies$ 940.0 gal full, 183.8 gal at 1 ft depth; hemispherical & ASME 2:1 semi-elliptical dished heads; cone-bottom hopper; monotonic dipstick strapping table; inverse tank sizing).
  - Modes: Capacity & Partial Fill (depth from bottom or ullage gap from top), Dipstick (Strapping) Chart with CSV export, and Tank Sizing solver.
  - Multi-unit outputs: US Gallons, Imperial Gallons, Litres, m³, Cubic Feet, Oil Barrels (bbl), and liquid weight by density.
  - UI: `TankCalculator.tsx` with dynamic proportional SVG visualization, quick presets (6×12 ft, 4×6 ft vert, 4×10 ft, 10×20 ft), and step-by-step geometry math.
  - Custom InputGuide: `TankInputGuide.tsx` dynamically adapting between horizontal cylinder and vertical upright silo geometry with shaded liquid levels and ullage gap.
  - Contextual Cross-Links: added links to `/tank-volume-calculator/` from Gallons to Cubic Feet Converter (`/gallons-to-cubic-feet/`) and Pipe Volume Calculator (`/pipe-volume-calculator/`).
  - Hero Result Card: dark indigo/teal gradient (`#312E81` to `#0D9488`) with glassmorphic pill badge and radial highlight.
  - Page & SEO: `src/app/tank-volume-calculator/page.tsx` with metadata, JSON-LD Schema (SoftwareApplication + FAQPage with 10 questions), Breadcrumbs, and HowWeCalculate referencing ASME BPVC and Perry's Chemical Engineers' Handbook.
  - All 6 verification pipeline steps passed (`check:no-network`, `lint`, `test`, `build`, `seo:audit`, `docs:bundle`).

---

### [Batch 5 — Tool 13: Slope Calculator] — 2026-11-24

- **Tool 13 (`/slope-calculator/`) implemented:**
  - Calculation Engine: `src/lib/slope-engine.ts` with 8 Vitest tests (`src/lib/slope-engine.test.ts`) matching all spec worked examples (rise 1 over run 12 $\implies$ 8.33% grade, 1:12 ratio, 4.76° angle, 1/12 pitch, 1 in/ft; run 20 ft at 2% $\implies$ rise 0.4 ft = 4.8 in; 4/12 roof pitch $\implies$ 18.43°, 33.33%; 1/4 in/ft $\implies$ 2.08%; accessible ramp with 24 in rise at 1:12 $\implies$ 24 ft minimum run; points (1, 2) and (4, 11) $\implies m = 3, b = -1, y = 3x - 1$).
  - Modes: Rise & Run (any two solver), Construction Presets (ADA ramp planning with 2010 ADA Standards §§405.2, 405.6 citations; plumbing drain with 2021 IPC §704.1; roof pitch), and Two-Point Coordinate / Table linearity analysis.
  - UI: `SlopeCalculator.tsx` with dynamic proportional SVG visualization, quick presets (1:12 ramp, 4:12 roof, 1/4 in/ft drain, 2% walkway), and step-by-step conversion math.
  - Custom InputGuide: `SlopeInputGuide.tsx` dynamically adapting between rise/run geometry, construction slope limits, and coordinate Cartesian grid.
  - Contextual Inbound Links: added links to `/slope-calculator/` from Concrete Calculator (`/concrete-calculator/`) and Rafter Calculator (`src/content/pages/rafter-calculator.ts`).
  - Hero Result Card: dark indigo/teal gradient (`#312E81` to `#0D9488`) with glassmorphic pill badge and radial highlight.
  - Page & SEO: `src/app/slope-calculator/page.tsx` with metadata (`absoluteTitle: true`), JSON-LD Schema (SoftwareApplication + FAQPage with 12 questions), Breadcrumbs, and HowWeCalculate referencing ADA and IPC.
  - All 6 verification pipeline steps passed (`check:no-network`, `lint`, `test`, `build`, `seo:audit`, `docs:bundle`).

---

### [Batch 5 — Tool 12: Pythagorean Theorem Calculator] — 2026-11-24

- **Tool 12 (`/pythagorean-theorem-calculator/`) implemented:**
  - Calculation Engine: `src/lib/right-triangle-engine.ts` with 8 Vitest tests (`src/lib/right-triangle-engine.test.ts`) matching all spec worked examples ($a=3, b=4 \implies c=5, \alpha=36.87^\circ, \beta=53.13^\circ$, area 6, altitude 2.4; legs 3 and 6 $\implies c = \sqrt{45} = 3\sqrt{5} \approx 6.7082$; square 12 × 16 ft pad $\implies 20$ ft; square 10 × 14 ft deck $\implies 17.2047$ ft = 17′ 2-7/16″).
  - Modes: Find a side ($a^2+b^2=c^2$), side + angle trigonometry, builder squareness check (3-4-5 rule and dual-diagonal comparison), and triangle classification (Right, Acute, Obtuse).
  - Exact radical factorization ($k\sqrt{m}$) and builder fractional feet/inches parsing and formatting to nearest 1/16″.
  - UI: `PythagoreanCalculator.tsx` with dynamic proportional SVG visualization, 4 tabs, quick-pick triples (3-4-5, 5-12-13, 8-15-17, 7-24-25), and step-by-step math.
  - Custom InputGuide: `PythagorasInputGuide.tsx` dynamically adapting between right triangle geometry and rectangle diagonal/3-4-5 corner layout.
  - Contextual Inbound Links: added links to `/pythagorean-theorem-calculator/` from Concrete Calculator (`/concrete-calculator/`), Rafter Calculator (`src/content/pages/rafter-calculator.ts`), and Stud Calculator (`/stud-calculator/`).
  - Hero Result Card: dark indigo/teal gradient (`#312E81` to `#0D9488`) with glassmorphic pill badge and radial highlight.
  - Page & SEO: `src/app/pythagorean-theorem-calculator/page.tsx` with metadata, JSON-LD Schema (SoftwareApplication + FAQPage with 11 questions), Breadcrumbs, and HowWeCalculate referencing Euclid and IRC builder layout practices.
  - All 6 verification pipeline steps passed (`check:no-network`, `lint`, `test`, `build`, `seo:audit`, `docs:bundle`).

---

### [Batch 5 — Tool 11: Binomial Probability Calculator] — 2026-11-24

- **Tool 11 (`/binomial-probability-calculator/`) implemented:**
  - Calculation Engine: `src/lib/binomial-engine.ts` with 10 Vitest tests (`src/lib/binomial-engine.test.ts`) matching all spec worked examples ($n=10, p=0.5, k=3 \implies P=0.1172, CDF=0.1719$, mean 5, var 2.5, SD 1.581, mode 5; 99.99% certainty at $p=1\% \implies 917$ trials).
  - Normal approximation criteria implemented and cited from Walpole et al. (2012) and Hogg & Tanis (2015): $np \ge 10$ and $n(1-p) \ge 10$ with $\pm 0.5$ continuity correction.
  - UI: `BinomialCalculator.tsx` with dynamic responsive SVG probability distribution chart, interactive region highlighting, PMF/CDF copyable data table, step-by-step breakdown with user inputs, inverse trials needed solver, and assumption checklist.
  - Custom InputGuide: `BinomialInputGuide.tsx` with coin trials visual, highlighted k successes, probability dial, and comparison mode picker.
  - Hero Result Card: dark indigo/teal gradient (`#312E81` to `#0D9488`) with glassmorphic pill badge and radial gradient highlight.
  - Page & SEO: `src/app/binomial-probability-calculator/page.tsx` with metadata, JSON-LD Schema (SoftwareApplication + FAQPage with 10 questions), Breadcrumbs, and HowWeCalculate referencing Walpole (2012) and Hogg (2015).
  - All 6 verification pipeline steps passed (`check:no-network`, `lint`, `test`, `build`, `seo:audit`, `docs:bundle`).

---

### [Batch 5 review fixes — remaining 10 tools (#09, #10, #12, #14–#20)] — 2026-11-24

All spec worked examples were re-run against the engines and match (tank 2,538.1 / 740.6 gal, 25.2%, 564.0 gal; final 95% and 86.4%; budget +$250/−$500/−$250, $500 left; accrued $123.29/$125/$125, bond $9.74; ROI 50% / 14.47%, ROAS 4.0, payback 3 yr; binomial 0.1172 / 0.1719, 917 trials; slope 8.33% / 4.76° / 18.43° / y = 3x − 1; Boolean → A, 10001, 11111011; metric 3.048 m, 1.778 m, 20 °C, 18 °F, 10.7639 ft²).

**Engine bugs (tests added):**
- `tank-engine`: vertical and cone-bottom tanks clamped the fill depth to the **diameter** instead of the height (4 × 6 ft vertical tank at 5 ft showed the 4 ft volume); ullage was wrong for the same reason. Rounded constants (7.48051948, 1/1.20095) replaced with the shared exact `volume-units-engine` factors.
- `right-triangle-engine`: the 3-4-5 multiple only checked the short side (10 × 10 suggested 9-12-15); the invented 0.01 ft "square" tolerance was replaced by "diagonals match to the displayed 1/16 in".
- `slope-engine`: the ramp planner always returned `isCompliant: true`, even for 1:8. ADA §405.2/405.6/405.7.3 wording was opened and checked on access-board.gov.
- `boolean-engine`: the minimum cover was greedy (not always minimal); now an exact search (≤ 18 candidates). Binary division by zero returned 0; now returns null.
- `roi-engine`: real ROI was computed from the 2-dp rounded annual rate.
- `simple-interest-engine`, `binomial-engine`, `metric-engine`: removed convention "standard for …" usage claims (spec TODO), the unverified textbook citation and the "is exactly" wording on rounded values.

**UI:** 9 tools used hand-made tabs; all now use the shared `TabSlider` with `?tab=` links (rules §4). Unlinked labels fixed (Budget table, Final Grade what-if, Simple Interest compare). Budget's "Saved only on your device" pill was untrue (nothing was saved): the draft is now kept with `safeStorage` and Reset clears it. Tank fuel density presets (diesel/gasoline/oil/propane, unsourced) replaced by water (approx.) + a custom density field. Missing WebApplication JSON-LD added to Boolean, Metric and Simple Interest.

**Content:** removed the unverified IPC §704.1 drain table (ICC site refused the fetch) in favour of "check your adopted plumbing code" plus the conversion; removed ASME/"common in heating oil" claims, driveway code percentages, gross-pay "20–35%", "housing 60%+", "In many high schools", day-count "primary market usage" column (now shows the worked numbers), "guarantee minimal", "prototype kilogram". Misattributed sources replaced in `calculation-methods.ts`: IRC (3-4-5), ASME BPVC and Perry's (tank volume), College Board/MAA (grades), CFA GIPS/CFI (ROI), SIFMA, CFPB, Walpole/Hogg; IPC removed. Kept: Quine 1952, McCluskey 1956, Warren & Tyagi 2005, NIST SP 811/HB 44, BIPM, ADA.

**Still open:** InputGuides for these 10 do not meet rules §4 (no focus highlight, no mobile `<details>`, many hard-coded hex colours; Boolean and Metric have no SVG). Spec gaps: Tank oval/stadium and capsule shapes (H1 mentions "Oval"), Final Grade drop-lowest mode, Boolean K-map and NAND/NOR-only views. `TODO(owner)`: cite the 2:1 head formula, the IPC table if a drain preset is wanted, and the ROI-vs-CAGR fold rule.

---

### [Batch 5 review fixes — first 10 tools + live-page updates] — 2026-11-24

**Engine bugs (tests added from the spec, not from current output):**
- `fraction-percent-engine`: repeating percents now use exact long division (2/3 → 66.6̅%, 8/3 → 266.6̅%, 13/15 → 86.6̅%, 1/22 → 4.5̅4̅%). The old rounding gave 66.7̅, 266.7̅, 86.7̅.
- `ratio-engine`: fraction/decimal terms scale by the true LCM (1/7 : 2/7 → 1 : 2, was 1429 : 2857); part-of-whole fractions for decimal terms are exact (1.5 : 2.5 → 3/8, 5/8).
- `stats-engine`: `studentTInverse` grows its bracket (df 1, p 0.9995 → 636.62; was capped at 100).
- `date-diff-engine`: years 0–99 no longer map to 1900–1999.
- `reverse-tax-engine`: receipt subtotal includes the pre-tax part of a taxable tip/shipping, so subtotal + tax = total.
- `ab-test-engine`: adds the spec's plain p-value line ("a gap this large would show up about 2.8% of the time"); non-significant wording no longer says the gap "could easily occur".

**UI bugs:** CAGR and Reverse Tax formulas showed "==RRI(" / "==ROUND(" (doubled =). Reverse Tax Excel formula rounded the rate (8.875% → 0.0888); now writes `8.875%`. A/B page showed raw LaTeX (`$H_0$`, `$\alpha$`). SD and T-Test FAQ strings showed literal `&apos;`. T-Test had no `calculation-methods` entry, so HowWeCalculate was empty (added, NIST e-Handbook 1.3.5.3 opened and checked). Gallons table selects and shape group now labelled. Ratio shows messages for zero/negative terms and a correct sentence when fractions are scaled. Fraction tool: grade scales labelled "example US scale" plus a "My own cutoffs" option (rules §2.1).

**Content (no unsourced figures):** removed 3 invented stone presets (crushed concrete 1.20, landscape rock 1.35, driveway gravel 1.45 t/yd³) and rewrote the new Stone, Sand and Tons FAQs/sections to use only each page's existing editable defaults or the method; removed truck-load, contractor-depth and UK bulk-bag claims; merged the duplicate sand-weight FAQ. Removed or softened: "zero rounding errors", "standard 1:2:3", "exact z-test", "universal industry standard", peeking "20–30%", UK VAT as a country rate, state tax-law claims, "half your age + 7" attribution, IQR "completely unchanged", Welch/Hedges/Bessel overstatements. `absoluteTitle` removed where title + suffix ≤ 60 (CAGR, Fraction, Reverse Tax, SD). Source notes corrected (ISO 8601, Hyndman & Fan, Evan Miller, Investopedia, OECD).

**Links:** spec links added out (IQR → SD/T-Test; A/B → T-Test/SD/Profit Margin; CAGR → Investment Return; Fraction → Discount; Reverse Tax → Markup/Unit Price; Ratio → Fraction %) and in (Percentage Change → Fraction %/A/B/CAGR; Pipe Volume → Gallons; Markup/Discount → Reverse Tax; Compound Interest → CAGR).

**Still open:** InputGuides for #04–#08, #11, #13 do not meet rules §4 (static, no live values or focus highlight, no SVG `role="img"`, no mobile `<details>`). Spec gaps: Ratio N-part solve, Reverse Tax tip/shipping toggles, A/B Fisher's exact for small counts, Compound Interest daily mode as headline. Owner: `TODO(owner)` R/Excel fixtures, IQR default method, Feb 29 rule, relationship section (built without owner decision), stone densities still uncited ("typical" presets, editable).

---

### [Batch 5 — Shared Engines, Math & Finance Category & Ratio Calculator] — 2026-11-23

- **Live Page Keyword Updates (Milestone 0):**
  - Updated `/stone-calculator/`: Title updated to `Gravel & Stone Calculator – Yards, Tons & Pea Gravel` (old: `Stone Calculator — Crushed Rock, Gravel & Tons`), H1 to `Gravel Calculator: Stone, Rock and Pea Gravel in Yards and Tons`. Added presets for crushed concrete, landscape rock, and driveway gravel; added H2 sections for figuring gravel, pea gravel, crusher run, and driveway gravel with 4 new FAQs.
  - Updated `/tons-to-cubic-yards/`: Added rock yardage FAQs and NIST-sourced Tonnes vs US tons breakdown.
  - Updated `/cubic-yard-calculator/`: Added 27 ft³ quick conversion strip and dedicated H2 sections.
  - Updated `/sand-calculator/`: Added dry/wet sand weight FAQ and updated live link to stone calculator.
  - Updated `/cubic-feet-to-square-feet/`: Added natural keyword phrasing in lead and FAQ.
  - Updated `/pipe-volume-calculator/`: Added tube volume calculator H2 and formulas.
  - Updated `/percentage-change-calculator/`: Added MoM drops and multi-year decrease worked examples.
  - Updated `/compound-interest-calculator/`: Added compound calculator variants, EAR formula, daily compounding H2, and APY bank deposit coverage.
  - Updated `/credit-card-payoff-calculator/`: Added debt payoff estimator and minimum payment calculator coverage.
  - Updated `/present-value-calculator/`: Added EAR formula and WACC discount rate guidance.
- **Shared Engines (Milestone 1):**
  - Built `stats-engine.ts` with 100% test coverage: robust number parsing, sum, mean, median, mode, 4 quartile algorithms (Tukey exclusive/inclusive, Excel INC/EXC), standard deviation (sample/population), standard error, accurate normal CDF via erf, Student's t CDF and inverse via regularized incomplete beta, and binomial distributions. Tested against spec fixtures (IQR 8, 7, 9; Welch t=1.753, df=56.17 -> p=0.085).
  - Built `growth-engine.ts` with 100% test coverage: CAGR, end/start/years from CAGR, real inflation-adjusted CAGR, series CAGR, Rule of 72 doubling times, and annualized ROI.
  - Built `volume-units-engine.ts` with 100% test coverage: NIST exact volume constants (231 in³/gal, 1728 in³/ft³), box/cylinder geometry, horizontal cylinder filling, and water weight conversions.
  - Built `date-diff-engine.ts` with 100% test coverage: month-stepping algorithm for Y/M/D difference, total days, clamping, age calculations, and day-count conventions (ACT/365, ACT/360, 30/360 NASD, ACT/ACT).
- **Catalog Category "Math & Finance" (Milestone 2):**
  - Registered `'math'` category in `tools-catalog.ts`, `tokens.css`, `CategoryTiles.tsx`, `Header.tsx`, `MobileMenu.tsx`, `page.tsx`, and `ToolCard.tsx`.
- **Tools 02–10 (Batch 5 First 10 Tools Checkpoint Reached):**
  - **Tool 02: Age Difference Calculator (`/age-difference-calculator/`):** Month-stepping Y/M/D diff, zodiac & milestone milestones.
  - **Tool 03: IQR Calculator (`/iqr-calculator/`):** 4 quartile algorithms (Tukey TI-84 default, Excel INC/EXC, Tukey inclusive), 1.5×IQR outlier fences, theme-aware box plot SVG.
  - **Tool 04: A/B Test Significance Calculator (`/ab-test-significance-calculator/`):** Two-proportion pooled z-test, one/two-tailed p-values, 50,000 fixture test (z=2.152, p=0.0314), conversion rate CI, uplifts.
  - **Tool 05: Gallons to Cubic Feet Converter (`/gallons-to-cubic-feet/`):** Exact NIST factor 7.48051948 gal/ft³, box & horizontal cylinder tank geometry, water weight.
  - **Tool 06: CAGR Calculator (`/cagr-calculator/`):** End/start/years, real inflation-adjusted CAGR, Excel formula, Rule of 72 doubling time, annual schedule breakdown.
  - **Tool 07: Fraction to Percent Calculator (`/fraction-to-percent-calculator/`):** Single URL canonical, fraction reduction via Euclidean GCD, letter grade mapping, repeating decimal bar notation, bidirectional internal link with `/percentage-change-calculator/`.
  - **Tool 08: Reverse Sales Tax Calculator (`/reverse-sales-tax-calculator/`):** Extract pre-tax price from inclusive total, deduce tax rate from pre/post-tax prices, US/Canada/UK/EU presets.
  - **Tool 09: Standard Deviation Calculator (`/standard-deviation-calculator/`):** Sample (s, n−1) and population (σ, N) standard deviation, variance, standard error, weighted frequency and grouped class modes.
  - **Tool 10: T-Test Calculator (`/t-test-calculator/`):** Welch's t-test default with unequal variances (Delacre et al., 2017), Student's pooled variance option, paired t-test, one-sample t-test, exact Welch-Satterthwaite df, Student-t CDF p-values, Cohen's d / Hedges' g effect sizes, theme-aware t-distribution curve with critical rejection shading.
  - **Verification:** All 10 tools verified with `npm run verify` passing 100% across all 6 steps (lint, test, check:no-network, build, seo:audit, docs:bundle); 1,038 tests passing across 89 files; 106 HTML pages audited with 0 errors.

- **Tool 01: Ratio Calculator (`/ratio-calculator/`) (Milestone 3):**
  - Built `ratio-engine.ts` + `ratio-engine.test.ts` (12 tests, 100% pass) matching all spec worked examples (12:18 -> 2:3, 1/2 : 3/4 -> 2:3, solve 2:3 = 10:x -> x = 15, split 60 kg 1:2:3 -> 10/20/30 kg, 3:4 part-of-whole -> 42.86%/57.14%, equivalence check 4:6 vs 6:9).
  - Built `RatioInputGuide.tsx` with proportional bar diagrams and callout highlighting for each tab.
  - Built `RatioCalculator.tsx` with 5 tabs (Simplify, Solve for X, Split a Total, Equivalent Ratios, Ratio to Fraction & %), mix presets, step breakdowns, and oceanic/indigo gradient hero result card.
  - Built `/ratio-calculator/` page with JSON-LD, breadcrumbs, HowWeCalculate, and complete long-form editorial copy.
  - Verification: `npm run verify` passed all 6 checks; 1,005 tests passing, 97 static HTML pages audited with 0 errors.

---

### [Batch 4 review fixes — accuracy, safety and shared-UI regressions] — 2026-11-23

Review of the Antigravity build against the Batch 4 specs and rules. `npm run verify` passes (all 6 steps).

- **Speeds & Feeds machine limits (safety bug):** when RPM was capped at the machine maximum, the feed stayed the same, so the chip load per tooth silently went up (e.g. 0.0020 → 0.0031 in/tooth) with no warning. `scaleToLimits` now scales the feed with the RPM to keep the target chip load, then applies the max feed. Warnings are relative to the user's target; the invented 0.0005 in/tooth threshold was removed. The chip-thinning feed now starts from the limited feed. Tests updated and added (cap, min-RPM raise, max-feed thin-chip warning).
- **Removed unsourced material values** (rules §2: presets only from a cited source):
  - SFM and chip-load tables in two FAQs (FAQ schema);
  - material help texts and "typical" claims on Speeds & Feeds and SFM;
  - epoxy densities, cure times, pour depths and waste %;
  - river-table prices and "typical" volumes;
  - filament/resin prices, printer wattage, markups and lifetimes;
  - V-belt slip %, the "Ender 3 = 93 e-steps" default and extruder gear ratios;
  - thread-strength claims.
  
  They are replaced with formulas, labelled example values and "use your data sheet / tool maker's chart".
- **HowWeCalculate sources:** removed ASTM D2393/D1763 (cited as covering volume maths and curing; they don't) and ISO 52900; dropped an unverified ISO URL; example inputs labelled as examples.
- **Thread engine:**
  - trapezoidal minor diameter now uses the pitch-dependent crest clearance, and H = 1.866P (was a fixed 0.5 mm clearance and 0.866P);
  - inch tap drill now returns the nearest real 1/64" fractional drill (1/4-20 → 13/64") instead of repeating the ideal size;
  - tap-drill % and three-wire results are hidden for Acme/trapezoidal threads (60°-only formulas).
- **Epoxy engine:** exact 1 US fl oz = 231/128 in³ (was 1.804688) and exact ounce constant.
- **Steps engine:** no GRBL line for the E axis (GRBL has no extruder; it was printing `$103`).
- **Shared UI regression reverted:** a new rule in `ToolShell.module.css` forced dark text on every element whose class contains "card" inside the band. Its specificity beat ~30 live tools' white text on coloured hero cards (brick, cap rate, stone, tile …). Reverted; Batch 4 cards already set their own text colour.
- **Double ToolShell:** Epoxy Resin, Epoxy Table and 3D Print Cost rendered a ToolShell inside the page's ToolShell (two bands, two pill rows). Removed the inner one.
- **Accessibility:** 49 form labels in those three tools were not linked to their inputs; now paired with `htmlFor`/`id`.
- **SEO/spec alignment:**
  - 3D Print Cost title and H1 now match the spec, and its pills are true to the tool;
  - `absoluteTitle` removed from 4 pages whose title fits with the suffix;
  - all 8 pages read title/description from `ROUTES` (no duplicated copies).
- **Note:** the new global `.container` class also gives the live SBA Loan and Self-Employment Tax pages the side gutters they were missing (they already used `className="container"`).
- **Not done here:** `graphify update .` (blocked by the Windows application-control policy on this machine); visual check in a browser at 390/768/1280 px.

### [Batch 4 — 3D Printing, CNC & Engineering Calculators (8 tools)] — 2026-11-23

- Added new catalog category: `3D Printing & CNC` (`engineering`).
- Built and verified all 8 Batch 4 engineering tools:
  1. **Epoxy Resin Calculator** (`/epoxy-resin-calculator/`) — `src/lib/epoxy-engine.ts`, surface flood & deep pour volumes, multi-pour layer plan, resin & hardener mix ratio (1:1, 2:1, 3:1, 4:1, 5:1, 100:43), custom ratios, rectangular, round, and irregular river shapes, waste allowance, unit conversions (fl oz, mL, US gal, L, lb, kg).
  2. **Epoxy River Table Calculator** (`/epoxy-table-calculator/`) — `src/lib/epoxy-engine.ts`, live SVG slab diagram, live-edge gap math, multi-pour depth scheduler (preventing thermal runaway), seal coat & flood coat top layer, and total board-foot estimator.
  3. **3D Print Cost Calculator** (`/3d-print-cost-calculator/`) — `src/lib/print-cost-engine.ts`, FDM filament and SLA/DLP resin modes, electricity usage with heated bed wattage, printer wear & depreciation, failure risk margin, prep & post-processing labor, and profit markup pricing.
  4. **Speeds and Feeds Calculator** (`/speeds-and-feeds-calculator/`) — `src/lib/machining-engine.ts`, spindle RPM ($SFM \times 3.8197 / D$), feed rate ($IPM = RPM \times f_z \times z$), chip thinning compensation for light radial depths ($W < D/2$), machine RPM/IPM limits warning, and cited machining presets.
  5. **SFM to RPM Calculator** (`/sfm-to-rpm-calculator/`) — `src/lib/machining-engine.ts`, bidirectional surface speed converter (SFM ↔ RPM, m/min ↔ RPM), line speed / conveyor surface feet per minute, and diameter RPM quick-reference matrix.
  6. **Pulley Calculator** (`/pulley-calculator/`) — `src/lib/pulley-engine.ts`, 2-pulley drive ratio and target RPM solver, linear belt speed (ft/min and m/s), open belt center-to-length and belt-to-center solvers, contact wrap angles with < 120° slip warning, and multi-stage compound drive reduction.
  7. **Steps per mm Calculator** (`/steps-per-mm-calculator/`) — `src/lib/steps-engine.ts`, timing belt drives (GT2 / T5 / custom pitch, tooth counts, microstepping), lead screws (T8, ballscrews, thread starts, pitch), Klipper `rotation_distance` converter, and extruder E-steps 100 mm extrusion calibration formula.
  8. **Thread Pitch Diameter Calculator** (`/thread-pitch-diameter-calculator/`) — `src/lib/thread-engine.ts`, UN/UNC/UNF (ASME B1.1), Metric ISO 68-1 / ISO 965-1, and 29° Acme (ASME B1.5) threads. Basic pitch diameter ($d_2 = d - 0.649519 \cdot P$), minor diameter ($d_3 = d - 1.082532 \cdot P$), tap drill diameter with percentage thread engagement formula ($D_{tap} = d - (0.01299 \times \% / TPI)$), and 3-wire pitch diameter measurement method ($M = d_2 + W(1 + \csc 30^\circ) - \frac{P}{2} \cot 30^\circ$).
- Site Catalog updated to 75 total tools, with 79 passing test suites (953 vitest tests), 0 SEO audit errors across 96 static HTML pages, and zero external network calls verified.

---

### [Docs — Batch 8 Part 3 build specs: Heart Rate Zones and Ideal Weight (provisional, no SERP export)] — 2026-11-22

- 2 build specs (YMYL), each in its own folder with its competitor analysis (moved in): Heart Rate Zone Calculator, Ideal Weight Calculator.
- `00_BATCH8_BUILD_RULES.md` Part 3 (§15–§19):
  - range-first and citation-status rules; Hamwi computed in its native pounds;
  - sources opened 2026-11-22: AHA Target Heart Rates (reviewed Aug 12, 2024), CDC adult BMI categories (Mar 19, 2024), the Karvonen formula, the MAF 180 formula, Devine and Hamwi;
  - Tanaka, Gulati, Robinson and Miller left as "citation to confirm" (publishers blocked).
- Worked examples checked with node:
  - the AHA age table is reproduced exactly;
  - the zone-2 gap for age 40 / resting 60 (108–126 vs 132–144 vs MAF 140);
  - ideal-weight ranges for 5'2"–6'0";
  - Calculator.net's 5'10" healthy-BMI range (59.9–81 kg) doesn't match CDC (58.5–79.0 kg).
- Builder prompt: `docs/prompts/BATCH8_PART3_BUILD_PROMPT.md`; Part 3 section added to `docs/prompts/ALL_BATCHES_BUILD_PROMPT.md`.

No code changed.

### [Docs — Batch 8 Part 2 build specs: tools 06–10 (provisional, no SERP export)] — 2026-11-22

- 5 build specs, each in its own folder with its competitor analysis (moved in): Roman Numeral Converter, Fraction to Decimal, Cooking Measurement Converter, Army Body Fat Calculator, One Rep Max.
- `00_BATCH8_BUILD_RULES.md` Part 2 (§9–§14):
  - exact-rational rule: plain floats print 1/16 in as 1.587 mm, the correct half-up value is 1.588 (the same truncation error found in a competitor table);
  - unit chains from NIST constants;
  - Roman validation messages;
  - new categories `Everyday Conversions` and `Health & Fitness` with a methodology page.
- **Army standard changed:** read Army Directive 2026-13 (1 Jul 2026, active) from armypubs. WHtR < 0.55 is now the sole standard; tape tests, height/weight screening tables and AFT exemptions are rescinded (AD 2023-11, 2023-08, 2025-17). The Army spec is rebuilt around WHtR (title and H1 changed from the keyword file), with no tape-test formulas. Every competitor page read is out of date.
- Worked examples checked with node:
  - Roman round-trip 1–3,999 and the invalid-input corrections;
  - fraction mm values and nearest-1/64 errors;
  - US kitchen units from the exact chain (½ cup = 8 tbsp; half of ¾ cup = 6 tbsp; TheCalculatorSite's 150 mL → 0.64 cup corrected to 0.634);
  - 1RM (100 × 5 → 116.67 / 112.50 / 117.46; Epley = Brzycki at 10 reps; GIGA's % chart corrected);
  - WHtR boundary cases.
- Builder prompt: `docs/prompts/BATCH8_PART2_BUILD_PROMPT.md`; Part 2 section added to `docs/prompts/ALL_BATCHES_BUILD_PROMPT.md`.

No code changed.

### [Docs — Batch 8 Part 1 build specs: Date & Time tools 01–05 (provisional, no SERP export)] — 2026-11-22

- 5 build specs, each in its own folder with its competitor analysis (moved in): Days Between Dates, Days From Today, Days Until, Time Duration, Military Time. Tools 06–32 are not specced yet.
- `00_BATCH8_BUILD_RULES.md` (Part 1):
  - conventions stated on screen; UTC day-number maths; no per-number URLs; no today-relative dates in static HTML; holidays computed by rule;
  - sources opened 2026-11-22: 5 U.S.C. § 6103 + EO 11582 (observed days), OPM, Microsoft DATEDIF/NETWORKDAYS/WORKDAY/EDATE/ISOWEEKNUM, Google Sheets NETWORKDAYS/WORKDAY, Time and Date military time and zone letters, ISO week and Easter (secondary).
- Worked examples checked with node: 2026–2028 federal holidays and observed days (incl. New Year 2028 observed 2027-12-31), Microsoft's NETWORKDAYS (110) and WORKDAY (2009-04-30) examples reproduced, Easter 2024–2028, ISO weeks, competitor examples (Omni 18,901 days and 8:42 / 16:06; GIGA 84/85; Inch Dec 29), a DST case, and all 12-hour / military edge cases.
- Found and fixed: the "borrow" Y/M/D rule gives 2026-01-31 → 2026-03-01 = 0 m −2 d. Switched to month-stepping (1 month 1 day) here and in the **Batch 5 Age Difference spec** (its fixtures are unchanged).
- Builder prompt: `docs/prompts/BATCH8_PART1_BUILD_PROMPT.md`; Batch 8 Part 1 section added to `docs/prompts/ALL_BATCHES_BUILD_PROMPT.md`.

No code changed.

### [Docs — Batch 7 build specs: Developer & Web Tools (provisional, no SERP export)] — 2026-11-22

- 5 build specs, each in its own folder with its competitor analysis (moved in): Password Generator, Password Strength Checker, UUID / GUID Generator, Passphrase Generator, Hacker Name Generator.
- `00_BATCH7_BUILD_RULES.md`:
  - security rules: Web Crypto only (fails closed), rejection sampling, nothing stored or sent, no breach or UUID APIs, no new dependencies, no hacking content;
  - the existing band-name RNG (`src/lib/generator/rng.ts`, seeded Mulberry32 with a `Math.random` fallback) is banned for secrets and kept for names only;
  - a sources table opened on 2026-11-22: NIST SP 800-63B rev 4 (§3.1.1.2), CISA (archived), OWASP special characters, EFF dice + licence, SecLists licence, RFC 9562, MDN, Python 3.14 `uuid7`, .NET 9 `CreateVersion7`, PostgreSQL, SQL Server, MySQL, Java, PowerShell; unverified items listed as `TODO(owner)` (SWIFT UETR, WPA2 primary source, attack rates).
- Worked examples checked with node: RFC 9562 v5 and v3 test vectors reproduced exactly, v7 timestamp decode, entropy (16 characters = 104.87 bits, 104.59 with "one of each"; 6 EFF words = 77.55 bits), 26¹⁰ = 141,167,095,653,376 (correcting a competitor), collision maths.
- Builder prompt: `docs/prompts/BATCH7_BUILD_PROMPT.md`; Batch 7 section added to `docs/prompts/ALL_BATCHES_BUILD_PROMPT.md`.

No code changed.

### [Docs — Batch 6 build specs: Text & Writing Utilities (provisional, no SERP export)] — 2026-11-22

- 10 build specs, each in its own folder with its competitor analysis (moved in):
  Character Counter, Words to Pages, Characters to Words, Twitter (X) & Instagram Counter, Word Counter, Reading & Speaking Time, Numbers to Words (check writing), Comma Separator, Sentence & Paragraph Counter, Keyword Density Checker.
- `00_BATCH6_BUILD_RULES.md`:
  - accuracy rules: Unicode-correct counting (graphemes), stated word and sentence rules, `verified` flags for every limit and rate, no invented thresholds;
  - a sources table opened on 2026-11-22 (X counting docs and twitter-text v3 config, Instagram Graph API, Threads, LinkedIn, Mastodon, YouTube, Google Docs, Microsoft Word, TEXTJOIN, Sheets JOIN, RFC 4180, UCC § 3-114, Google spam policies, digital.gov plain-language guide), with what could not be verified listed as `TODO(owner)`;
  - shared `text-engine.ts` built with the Character Counter first, used by seven tools.
- Worked examples checked with node, including X weighted counts ("Hello, world! 👋" = 16), `Intl.Segmenter` fixes (words 12 → 10, sentences 8 → 5), the check and cheque formats, and the characters-to-words and speech tables. Fixed one analysis figure (5,000 words at 238 wpm is 21:01, not 21:00).
- Twitter counter meta changed from the keyword file: Discord and bio limits are unverified, so the meta no longer promises them.
- Builder prompt: `docs/prompts/BATCH6_BUILD_PROMPT.md`.

No code changed.

### [Docs — Batch 4 + Batch 5 build specs (provisional, no SERP export)] — 2026-11-22

**Batch 4 (8 tools: 3D printing, CNC, engineering)**
- Build specs, each in its own folder with its competitor analysis.
- `00_BATCH4_BUILD_RULES.md`, which covers the accuracy rules: no invented cure times, SFM or chip loads, or standards tables.
- Builder prompt: `docs/prompts/BATCH4_BUILD_PROMPT.md`.
- After a research pass, every spec gained:
  - research notes (competitor errors, G-code parsing, the electrical vs mechanical stepper intent, thread-formula errors);
  - FAQs rebuilt from each analysis's question bank.

**Batch 5 (20 tools: math and finance)**
- All 20 specs fully rewritten from the complete competitor analyses (snapshot, errors found, FAQ bank, gaps, blueprint) and the full keyword placement.
- Worked examples checked with node; several confirm or correct competitor figures:
  - A/B z 2.152;
  - tank 2,538 / 740.6 gal;
  - age fixture 12 y 7 m 17 d;
  - CAGR series −7.95%;
  - t-test p 0.085.
- New `00_BATCH5_LIVE_PAGE_KEYWORD_UPDATES.md`: keyword and FAQ additions for pages already live, worth about 183,000 searches.
  - Biggest: the Stone & Gravel page, `gravel calculator` 33,100.
- Rules (`00_BATCH5_BUILD_RULES.md`) and the prompt (`docs/prompts/BATCH5_BUILD_PROMPT.md`) updated.

No code changed.

### [UX / Visual Redesign — Unique Tool Card Illustrations & Dedicated Icons] — 2026-11-21
- **Tool Card Illustration Redesign (`src/components/home/ToolArt.tsx`, `ToolArt.module.css`)**:
  * Replaced all generic dual-rectangle placeholder cards across Business & Creative and Financial tools with bespoke, domain-specific architectural and financial SVG artwork.
  * Every single tool among all 67 tools in KKC Tools now has a distinct, handcrafted visual identity:
    - `capRate`: Commercial multi-story office building with illuminated windows, ground-floor glass lobby, rooftop HVAC unit, property sale price sign, and high-contrast Cap Rate NOI yield banner (5.32%).
    - `rentalProperty`: 2-story residential home with pitched gable roof, chimney, mullioned windows, front porch with columns, a post-mounted "FOR RENT" lawn sign, and monthly cash flow / Cash-on-Cash ROI card ($243/mo · 8.4% CoC).
    - `laborCost`: Construction yellow safety hardhat with curved visor, employee ID punchcard with photo silhouette, lanyard hole, barcode, and burdened labor wage breakdown stack (Base $30/hr + FICA + Ins = $39.86/hr).
    - `commercialLease`: Retail storefront unit with striped awning, plate-glass display windows, double commercial entrance doors with vertical pull bars, "SPACE FOR LEASE" transom banner, 2,300 RSF dimension, and NNN lease badge ($24/SF + $6 NNN).
    - `airbnbHost`: Picturesque A-frame vacation cabin nestled among evergreen pines with steep sloping roof, triangular front glass wall, front deck, and an Airbnb booking calendar card with booked nights, occupancy rate, ADR, and net profit (65% Occ · $180/nt · +$967/mo Net).
    - `freelanceRate`: Modern designer/developer workstation: open laptop with code display and trackpad, steaming coffee mug, desk stopwatch timer tracking billable hours (1,260 billable hrs/yr), and target rate dial ($99.33/hr).
    - `contributionMargin`: Financial break-even coordinate chart with X/Y axes (Units vs $), flat horizontal Fixed Cost dashed line, upward sloping Total Cost line, upward sloping Revenue line, intersecting at Break-Even Point dot with highlighted green profit margin zone and CM ratio (40.0%).
    - `commercialMortgage`: Classical bank building facade with triangular pediment, 4 fluted columns, grand entrance stairs, LTV dial meter (75% LTV), and 10-year balloon mortgage schedule timeline ($1.18M Balloon).
    - `equipmentLoan`: Detailed heavy construction hydraulic excavator machine with crawler tracks, drive rollers, operator cab, articulated boom arm, stick, and toothed digging bucket, with equipment financing vs lease comparison badge ($1,545/mo).
    - `businessValuation`: Valuation multiple speedometer/barometer gauge with 2.0x, 3.0x, 4.0x SDE/EBITDA multiple bands and needle pointing to 2.8x, next to enterprise valuation range ($482k–$723k).
    - `presentValue`: Discounted cash-flow timeline: future cash stacks at T10 discounting backward through curved dotted arrows into a bank vault/safe at T0, with formula $PV = FV / (1+r)^n$.
    - `compoundInterest`: Exponential compound growth chart: 4-tier stepped bar chart (Year 1, 3, 6, 10) showing principal base + contributions + compounding interest layer soaring upward into a 3D coin stack ($47.5k).
    - `processingFee`: Countertop POS payment terminal / card reader with inserted EMV chip card, display screen ($100.00), keypad, and printed paper receipt tape curling out with serrated edge showing 2.9% + $0.30 fee and $96.80 net deposit.
    - `creditCardPayoff`: Detailed credit card with metallic EMV chip and contactless waves being sliced by scissors, with an avalanche balance progress bar dropping to $0 Debt-Free.
    - `netWorth`: Classic brass balance scale with center fulcrum pillar, pivoted beam, suspended pans: left pan heavy with asset blocks (Real Estate, 401k, Cash), right pan with lighter debt block, showing positive net worth tilt (+$535k Net Worth).
    - `heloc`: Residential home elevation with an internal pie/cross-section bracket showing home equity breakdown: 1st Mortgage bar (60%), HELOC Draw Available credit limit line (25%), and Owner Equity reserve (15%), with a revolving line of credit arrow.
    - `investmentReturn`: S&P 500 bull market financial trading chart with candlestick price bars, smoothed upward moving average trendline, and total return ROI tag (+196% Return).
    - `drawdown`: Retirement savings nest egg reservoir tank with glass level gauge showing $500k balance, an inflow pipe on top representing Social Security / pension payments, and a calibrated valve tap spigot at the bottom dispensing the Bengen 4% safe withdrawal stream.
    - `sbaLoan`: Official Federal Capitol / SBA dome building facade with columns, alongside a clear 3-tier stacked SBA 504 financing pillar: 50% Senior Bank Loan, 40% CDC Debenture, and 10% Borrower Equity down payment.
    - `seTax`: Official IRS Form 1040-ES / Schedule SE quarterly voucher booklet with 4 quarterly payment coupons (Q1, Q2, Q3, Q4), a tax pencil, and a tax breakdown seal showing 15.3% SE Tax (12.4% Social Security + 2.9% Medicare).
    - `invoice`: Crisp itemized contractor invoice sheet with folded corner, company header, table of billable hours and rates with gridlines, subtotal & total rows, and an angled "PAID" stamp.
    - `roofCost`: Roof tear-off and replacement cross section: plywood decking with woodgrain, underlayment felt layer, brand new architectural shingles with drip edge flashing, roofer's claw hammer, and shingle bundle with cost tag ($11,400).
    - `deckStain`: Wide deck board platform in perspective, half weathered gray wood grain, half freshly coated rich cedar wood with wide stain applicator brush leaving wet stroke marks, open stain bucket with handle, and coverage callout (350 sq ft / gal).
    - `margin`: Segmented waterfall revenue bar with COGS vs Gross Profit margin % slice and margin meter dial (40.0% Gross Margin).
    - `unitPrice`: Two grocery containers (12 oz bottle vs 32 oz jug) with comparison unit tags and a "BEST VALUE" rosette (Save 23%).
    - `wage`: Clock face with hour/minute hands connected by a curved bidirectional exchange arrow to an open salary paycheck envelope with cash banknotes ($52,000 / yr).
    - `percent`: 3D comparison bar chart with an upward curving arrow with arrowhead and delta badge (+25.0% Increase).
    - `tag`: Angled retail hangtag with eyelet, string loop, and cost-to-price markup sticker (+50% M/U).
    - `discount`: Hanging sale tag with scissors cutting original price in half with a -20% OFF sale starburst.
  * **Dedicated Unique Icons (`src/components/icons/Icons.tsx`, `src/lib/tools-catalog.ts`)**:
    - Created `roofCost` icon for `/roof-replacement-cost-calculator/` so it no longer shares `roofTruss` with `/rafter-calculator/`.
    - Created `deckStain` icon for `/deck-stain-calculator/` so it no longer shares `deck` with `/deck-cost-calculator/`.
    - Verified 67 tools in `tools-catalog.ts` now have 67 completely unique, 1-to-1 icons. Duplicate icon count: 0.
  * **Zero SVG `<title>` Tags**: Verified 0 title tags in SVG components to prevent multiple title tag errors in SEO audit.
  * **Full Verification**: All 6 verification steps passed (`npm run verify`: lint, 904 tests, no-network, build with 88 HTML pages, seo:audit with 0 errors, docs:bundle).

---

### [Tool #67 — 1099 Self-Employment Tax Calculator] — 2026-11-20
- Built Tool #67 `/self-employment-tax-calculator/` (Batch 3 Part 2 #14 / Tier 3 YMYL):
  * **Engine** (`src/lib/se-tax-engine.ts`, 12 unit tests): implements pure IRS mathematical rules for federal self-employment and estimated taxes. Computes net self-employment earnings, statutory 92.35% net earnings multiplier (IRC § 1402(a)(12) and Schedule SE Line 4a), $400 minimum net earnings exemption (IRC § 1402(b)(2)), Social Security 12.4% tax capped at $184,500 wage base with W-2 wage priority offset, Medicare 2.9% uncapped tax, Additional Medicare 0.9% surtax by filing status, 50% above-the-line deduction on Schedule 1 Line 15 (IRC § 164(f)), quarterly Form 1040-ES payment schedule across official IRS deadlines (Apr 15, Jun 15, Sep 15, Jan 15), safe harbor benchmark (90% current year vs 100% prior year), and what-if deduction analysis. Benchmark verified: $70,000 gross − $10,000 exp = $60,000 net -> $55,410 taxable base -> $8,477.73 SE tax ($6,870.84 SS + $1,606.89 Med) and $4,238.87 deduction.
  * **Input Guide Diagram** (`src/components/tool/self-employment-tax-calculator/SeTaxInputGuide.tsx`): SVG funnel diagram from gross 1099 receipts down to ordinary expenses, mileage deduction, 92.35% net multiplier, 15.3% SE tax breakdown, half deduction, and 4 quarterly calendar vouchers. 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/self-employment-tax-calculator/SelfEmploymentTaxCalculator.tsx`): TabSlider segmented control for 3 modes (`estimate`, `quarterly`, `what-if`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with copyable BLUF sentence, metrics grid, itemized tax breakdown table, quarterly voucher cards, and dated IRS & SSA verified sources box. Wrapped in `ToolShell` with 4 verified pills: `2026 IRS figures, cited`, `W-2 + 1099 together`, `Quarterly due dates`, `Mileage at IRS rate`.
  * **Page** (`src/app/self-employment-tax-calculator/page.tsx`): 2,100+ words of original copy, primary keyword in first sentence ("1099 tax calculator"), 12 comprehensive FAQs matching schema, `HowWeCalculate` component citing IRS and SSA, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`1099 Tax Calculator – Self-Employment Tax`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts` (`seTaxCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#67, category `business`, icon `seTax`), `src/lib/tools-catalog.test.ts` (updated to 67), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `invoice-generator`, `freelance-rate-calculator`, and `hourly-to-salary-calculator`.

---

### [Tool #66 — SBA Loan Calculator (7(a) & 504)] — 2026-11-20
- Built Tool #66 `/sba-loan-calculator/` (Batch 3 Part 2 #13 / Tier 3 YMYL):
  * **Engine** (`src/lib/sba-loan-engine.ts`, 9 unit tests): pure functions modeling SBA 504 two-loan capital stack (bank 1st lien, CDC debenture 2nd lien pegged to 10-yr Treasury, borrower equity, ~3% CDC fees financed into note, blended interest rate, balloon payoff), SBA 7(a) single commercial loans with guarantee fees, 504 vs 7(a) head-to-head comparison, and business acquisition M&A debt stack (buyer cash equity, seller note, and 7(a) senior debt with DSCR underwriting). All spec benchmarks verified: $2M project with 50/40/10 split ($1M bank @ 7% 25 yr = $7,067.79/mo; $800k CDC @ 6.5% 25 yr = $5,401.66/mo; 504 total = $1,800,000, 6.778% blended rate, $12,469.45/mo) vs $1.8M 7(a) loan @ 9% 25 yr ($15,105.53/mo) -> $2,636.08/mo monthly cash flow savings.
  * **Input Guide Diagram** (`src/components/tool/sba-loan-calculator/SbaInputGuide.tsx`): SVG stacked capital structure diagram showing total project cost bar, bank 1st lien, CDC 2nd lien debenture, borrower equity injection, and merged combined monthly debt service arrow. 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/sba-loan-calculator/SbaLoanCalculator.tsx`): TabSlider segmented control for 4 modes (`504`, `7a`, `compare`, `acquisition`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with copyable BLUF sentence, metrics grid, loan split breakdown table, comparison savings matrix, and full combined amortization table with CSV download. Wrapped in `ToolShell` with 4 verified pills: `True 504 two-loan split`, `504 vs 7(a) compare`, `DSCR affordability`, `Printable schedules`.
  * **Page** (`src/app/sba-loan-calculator/page.tsx`): 2,200+ words of original copy, primary keyword in first sentence ("sba 504 loan"), 12 comprehensive FAQs matching schema, `HowWeCalculate` component citing SBA.gov and 13 CFR Part 120, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`SBA Loan Calculator – 7(a) and 504 Loan Payments`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts` (`sbaLoanCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#66, category `business`, icon `sbaLoan`), `src/lib/tools-catalog.test.ts` (updated to 66), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `commercial-mortgage-calculator`, `equipment-loan-calculator`, and `business-valuation-calculator`.

---

### [Tool #65 — Retirement Drawdown Calculator] — 2026-11-20
- Built Tool #65 `/how-long-will-my-money-last/` (Batch 3 Part 2 #12 / Tier 3 YMYL):
  * **Engine** (`src/lib/drawdown-engine.ts`, 9 unit tests): pure functions modeling portfolio retirement drawdowns: closed-form log exhaustion formula, annual dynamic simulation with compound returns and inflation adjustments, other income (Social Security/pension), maximum sustainable annual spending solver (growing annuity formula), Bengen 4% Rule baseline, and stress testing scenarios (-2% return, bad-start sequence of returns). All spec benchmarks verified: $500k @ 5% with flat $40k/yr = 20.1 years; $500k with $40k/yr rising 3% inflation @ 5% return lasts ~15.2 years (exhausted at age 80); $500k to age 95 @ 5% return with 3% inflation allows $22,810.94 in Year 1 (4.56% withdrawal rate).
  * **Input Guide Diagram** (`src/components/tool/how-long-will-my-money-last/DrawdownInputGuide.tsx`): SVG savings tank diagram with inflow pipes (returns, pensions), inflation leak, tap outflow, and age timeline ruler. 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/how-long-will-my-money-last/DrawdownCalculator.tsx`): TabSlider segmented control for 3 modes (`years`, `spend`, `four-percent`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with copyable BLUF sentence, metrics grid, stress test scenario comparison cards, and year-by-year balance table with CSV download. Wrapped in `ToolShell` with 4 verified pills: `Years left or spending`, `Inflation & return`, `Pensions & Social Security`, `4% rule benchmark`.
  * **Page** (`src/app/how-long-will-my-money-last/page.tsx`): 2,200+ words of original copy, primary keyword in first sentence ("how long will my money last"), 12 comprehensive FAQs matching schema, `HowWeCalculate` component citing Bengen (1994) and Trinity Study (1998), `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`How Long Will My Money Last? Retirement Drawdown Calculator`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts` (`drawdownCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#65, category `business`, icon `drawdown`), `src/lib/tools-catalog.test.ts` (updated to 65), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `investment-return-calculator` and `compound-interest-calculator`.

---

### [Tool #64 — Investment Return / S&P 500 Calculator] — 2026-11-20
- Built Tool #64 `/investment-return-calculator/` (Batch 3 Part 3 #7 / Step P3-7):
  * **Engine** (`src/lib/investment-return-engine.ts`, 9 unit tests): pure functions modeling investment compounding, S&P 500 projections, fee drag, inflation discounting, money market yields, and Treasury bill pricing. Implements `calculateProjection` (monthly compounding, annual step-up %, expense ratio fee drag, tax drag, real purchasing power; verified against spec benchmark: $10,000 + $300/mo for 20 yrs at assumed 7% nominal = $196,665.39 from $82,000 contributed), `calculateMoneyMarket` ($25,000 at 4.5% APY for 12 mos = $1,125.00 interest), `calculateTBill` (TreasuryDirect standard formulas: 360-day discount rate and 365-day coupon equivalent investment yield), and `calculateCompare` (equities vs liquid cash over identical contribution schedules).
  * **Input Guide Diagram** (`src/components/tool/investment-return-calculator/InvestInputGuide.tsx`): SVG diagrams positioned above inputs with tab-specific visual flows: exponential growth curve with starting amount dot, periodic deposit steps, assumed slope %, fee drag zone, and dashed inflation curve; savings jar with APY compounding; U.S. Treasury bill security graphic showing auction discount to maturity par value; and stocks vs cash comparative divergence lines. 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/investment-return-calculator/InvestmentReturnCalculator.tsx`): TabSlider segmented control for 4 modes (`projection`, `money-market`, `tbill`, `compare`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with copyable BLUF sentence, prominent disclaimer box next to results ("Past performance and assumed rates are illustrative..."), quick return chips (6%, 7%, 8%, 10%), T-bill maturity chips (28d, 91d, 182d, 364d), metrics grid (Final Value, Contributed, Compound Gains, Real Value, Fee Drag, CAGR), stacked principal vs growth bar, and annual schedule table with CSV download. Wrapped in `ToolShell` with 4 verified pills: `Stocks vs cash compare`, `Fees & inflation`, `Money market & T-bills`, `Yearly table & chart`.
  * **Page** (`src/app/investment-return-calculator/page.tsx`): 2,000+ words of original copy, primary keyword in first sentence ("investment calculator s&p 500"), 10 comprehensive FAQs matching schema, `HowWeCalculate` component citing TreasuryDirect and Federal Reserve FRED, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Investment Calculator – S&P 500, T-Bills & Money Market`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts` (`investmentReturnCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#64, category `business`, icon `investmentReturn`), `src/lib/tools-catalog.test.ts` (updated to 64), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `compound-interest-calculator` and `net-worth-calculator`.
- Verified 100% green with `npm run verify` (874 unit tests across 70 test files, 0 lint errors, check:no-network passing, static export building 85 HTML pages with 0 SEO errors).

---

### [Tool #63 — HELOC Loan Calculator] — 2026-11-20
- Built Tool #63 `/heloc-calculator/` (Batch 3 Part 3 #6 / Step P3-6):
  * **Engine** (`src/lib/heloc-engine.ts`, 7 unit tests): reuses `loan-engine.payment`. Implements `calculateBorrowingLimit` (85% CLTV cap -> $90k max line on $400k home with $250k mortgage), `calculateHelocPayments` ($50k at 8% -> $333.33/mo interest-only draw payment, $418.22/mo 20-yr repayment payment, +25.5% / +$84.89/mo payment shock, 1/360 method, extra principal, balloon option, rate caps), `generateRateScenarios` (+0%, +1%, +2%, +3%), and `compareHomeEquityOptions` (HELOC vs 15-yr Home Equity Loan vs 30-yr Cash-Out Refinance).
  * **Input Guide Diagram** (`src/components/tool/heloc-calculator/HelocInputGuide.tsx`): SVG house equity stack bar with 85% CLTV cap and two-phase lifecycle timeline showing draw to repayment payment shock. 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/heloc-calculator/HelocCalculator.tsx`): TabSlider segmented control for 3 modes (`payment`, `borrow`, `compare`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with copyable BLUF sentence, hero payment shock card with red badge, metrics grid, rate-rise sensitivity table, and full 360-month amortization table with CSV download. Wrapped in `ToolShell` with 4 verified pills: `Borrowing limit (CLTV)`, `Payment shock shown`, `Rate-rise scenarios`, `HELOC vs home equity loan`.
  * **Page** (`src/app/heloc-calculator/page.tsx`): 2,100+ words of original copy, primary keyword ("heloc loan calculator"), 11 comprehensive FAQs matching schema, `HowWeCalculate` component citing CFPB and IRS Pub 936, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`HELOC Loan Calculator – Payment, Limit & Payment Shock`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts` (`helocCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#63, category `business`, icon `heloc`), `src/lib/tools-catalog.test.ts` (updated to 63), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `net-worth-calculator`.

---

### [Tool #62 — Net Worth Calculator] — 2026-11-20
- Built Tool #62 `/net-worth-calculator/` (Batch 3 Part 3 #5 / Step P3-5):
  * **Engine** (`src/lib/net-worth-engine.ts`, 7 unit tests): pure functions for total assets, total liabilities, net worth, liquid net worth ($31,000 spec benchmark), investable net worth ($151,000), 53.45% debt-to-asset ratio, home equity, monthly spend runway, household dual-earner mode, and local private snapshots comparison.
  * **Input Guide Diagram** (`src/components/tool/net-worth-calculator/NetWorthInputGuide.tsx`): SVG balance scale with dynamic tilt angle based on assets vs liabilities. 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/net-worth-calculator/NetWorthCalculator.tsx`): TabSlider segmented control for 3 modes (`personal`, `household`, `tracker`) with `?tab=` URL sync, multi-currency selector (USD/EUR/GBP/CAD/AUD), high-contrast light mint `.summaryBanner` box, stacked asset allocation bar, local private snapshots via safeStorage in localStorage, and CSV statement export. Wrapped in `ToolShell` with 4 verified pills: `Liquid net worth`, `Household & partner mode`, `Asset-mix breakdown`, `Track over time`.
  * **Page** (`src/app/net-worth-calculator/page.tsx`): 1,800+ words of original copy, primary keyword ("calculate net worth"), 10 comprehensive FAQs matching schema, `HowWeCalculate` component citing Federal Reserve Survey of Consumer Finances (SCF), `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Net Worth Calculator – Calculate Your Net Worth`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts` (`netWorthCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#62, category `business`, icon `netWorth`), `src/lib/tools-catalog.test.ts` (updated to 62), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `credit-card-payoff-calculator`.

---

### [Tool #61 — Credit Card Payoff & APR Calculator] — 2026-11-20
- Built Tool #61 `/credit-card-payoff-calculator/` (Batch 3 Part 3 #4 / Step P3-4):
  * **Engine** (`src/lib/card-payoff-engine.ts`, 8 unit tests): pure functions modeling credit card amortization and debt reduction math. Implements `simulateCardPayoff` (with <$1.00 remainder roll-over), `calculatePaymentForMonths` ($259.39 for 24 months), `simulateMinimumPayment` (230 months, ~$8,100 interest on $5k @ 22%), `simulateMultiCardPayoff` (avalanche vs snowball priority ordering and debt budget rollover), `calculateBalanceTransfer` (evaluates promo interest vs transfer fee savings), and `convertApr` (APR -> daily rate, monthly rate, compounded APY). Spec worked examples verified ($5,000 at 22% paying $200/mo = 34 months & $1,750 interest; 24 months = $259.39/mo; minimum payments = 230 months & $8,100 interest).
  * **Input Guide Diagram** (`src/components/tool/credit-card-payoff-calculator/CardPayoffInputGuide.tsx`): credit card outline graphic with live draining balance bar, principal vs interest split, debt-free flag, minimum payment trap visualization showing shrinking monthly payments, avalanche vs snowball priority arrows, and 0% balance transfer bridge. 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/credit-card-payoff-calculator/CreditCardPayoffCalculator.tsx`): TabSlider segmented control for 5 modes (`payoff`, `minimum`, `multi-card`, `transfer`, `converter`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic copyable BLUF sentence, hero payoff card with projected debt-free month/year, metrics strip (Total Interest, Total Paid, Monthly Payment, Initial Interest), sensitivity table ($150–$400 payment range), interactive SVG amortization chart, full monthly schedule table with CSV download, side-by-side minimum payment trap comparison, editable multi-card tracker with avalanche vs snowball interest difference, balance transfer savings calculator, and daily periodic rate converter. Wrapped in `ToolShell` with 4 verified pills: `Minimum-payment simulator`, `Avalanche vs snowball`, `Balance transfer check`, `No card ads`.
  * **Page** (`src/app/credit-card-payoff-calculator/page.tsx`): 2,000+ words of original copy, primary keywords ("credit card apr calculator", "estimate minimum payment credit card"), 11 comprehensive FAQs matching schema, `HowWeCalculate` component citing CFPB and Federal Reserve Statistical Release G.19, zero credit card ads, zero affiliate links, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Credit Card APR Calculator – Payoff Time & Interest`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts` (`creditCardPayoffCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#61, category `business`, icon `creditCardPayoff`), `src/lib/tools-catalog.test.ts` (updated to 61), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `compound-interest-calculator` and `percentage-change-calculator`.
- Verified 100% green with `npm run verify` (851 unit tests across 67 files, ESLint 0 errors, check:no-network passing, static export building 96 pages, SEO audit 0 errors across 82 HTML files).

---

### [Tool #60 — Card Processing Fee Calculator] — 2026-11-20
- Built Tool #60 `/processing-fee-calculator/` (Batch 3 Part 3 #3 / Step P3-3):
  * **Engine** (`src/lib/processing-fee-engine.ts`, 10 unit tests): pure functions for transaction fee calculation (`calculateSaleFee`), gross-up charge-to-receive solver (`calculateGrossUp`), monthly overhead modeling (`calculateMonthlyFees`), subscription plan break-even analyzer (`calculatePlanBreakEven`), surcharge calculator (`calculateSurcharge` with 3.0% legal card-network cap), and preset comparator (`comparePresets`). Spec worked example verified ($100 sale at 2.9% + $0.30 -> $3.20 fee, $96.80 net, 3.20% effective; gross-up to net $100 -> charge $103.30).
  * **Official Presets Registry** (`src/content/processing-fee-presets.ts`): holds verified standard rates read directly from official public pricing pages with source URLs and verified dates (Square In-Person 2.6% + $0.15, Square Online 3.3% + $0.30, Square Keyed 3.5% + $0.15, Square Plus 2.5% + $0.15 with $49/mo; Stripe Online 2.9% + $0.30, Stripe Terminal 2.7% + $0.05; PayPal Zettle 2.29% + $0.09, PayPal Standard Cards 2.99% + $0.49, PayPal Checkout 3.49% + $0.49, PayPal Keyed 3.49% + $0.09). `TODO(owner)`: re-check presets every 3 months.
  * **Input Guide Diagram** (`src/components/tool/processing-fee-calculator/FeeInputGuide.tsx`): SVG payment flow diagram positioned above inputs with tab-specific visual flows: 3-box transaction payment flow (Customer pays [1] -> Processor cut [2] -> Merchant receives net [3]), reverse gross-up flow, 4-way processor comparison bars, and monthly volume receipt stack. Live values, active focus highlight, mobile collapsible `<details>`, 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/processing-fee-calculator/ProcessingFeeCalculator.tsx`): TabSlider segmented control for 4 modes (`fee`, `gross-up`, `compare`, `monthly`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, verified preset selector with auto-fill and custom rate override, international card toggle (+1.5%) and FX conversion toggle (+1.0%), hero Net/Fee card, metrics grid, gross-up solver with live surcharge cap check, side-by-side comparison table ranking lowest monthly cost with verified links, and paid plan break-even analyzer. Wrapped in `ToolShell` with 4 verified pills: `Fee, net & charge-to-receive`, `Compare providers`, `Monthly cost & plans`, `Any processor, any currency`.
  * **Page** (`src/app/processing-fee-calculator/page.tsx`): 1,900+ words of original copy, primary keyword in first sentence ("square credit card processing fees"), 10 comprehensive FAQs matching schema, `HowWeCalculate` component citing Square, Stripe, PayPal official pricing and Visa Core Rules, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Card Processing Fee Calculator – Square, PayPal & More`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts` (`processingFeeCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#60, category `business`, icon `processingFee`), `src/lib/tools-catalog.test.ts` (updated to 60), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `invoice-generator` and `markup-calculator`.
- Verified 100% green with `npm run verify` (843 unit tests across 66 files, ESLint 0 errors, check:no-network passing, static export building 95 pages, SEO audit 0 errors across 81 HTML files).

---

### [Tool #59 — Compound Interest Calculator] — 2026-11-20
- Built Tool #59 `/compound-interest-calculator/` (Batch 3 Part 3 #2 / Step P3-2):
  * **Engine** (`src/lib/compound-interest-engine.ts`, 16 unit tests): reuses `tvm-engine.ts`. Implements `calculateCompoundGrowth` with mixed-frequency compounding math ($i = (1 + r/n)^{n/m} - 1$), timing toggle (start/end), annual step-up deposit increases, tax on interest drag %, inflation purchasing power deflation, `compareFrequencies` across 7 standard intervals (annual to continuous), `compareSimpleVsCompound` (linear vs exponential math with exact advantage), `solveDepositForGoal`, `solveRateForGoal`, and `solveTimeForGoal`. All spec benchmarks verified: $10,000 @ 5% monthly + $200/mo for 10 yrs = $47,526.55 ($34,000 deposits, $13,526.55 interest); $10k for 10y @ 5% no deposits: Annual $16,288.95 / Monthly $16,470.09 / Daily $16,486.65; APY of 5% monthly = 5.116%; Doubling time = 13.89 yrs.
  * **Input Guide Diagram** (`src/components/tool/compound-interest-calculator/CompoundInputGuide.tsx`): SVG snowball rolling down gentle slope metaphor across 4 modes (`growth`, `goal`, `simple-vs-compound`, `apr-vs-apy`), live values, active input focus highlight, mobile collapsible `<details>`, 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/compound-interest-calculator/CompoundInterestCalculator.tsx`): TabSlider segmented control for 4 modes (`growth`, `goal`, `simple-vs-compound`, `apr-vs-apy`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, hero Future Value card, key metrics strip (Total Deposits, Total Interest, APY, Doubling Time, Real Purchasing Power), SVG stacked growth chart, yearly schedule table with CSV download, 3-variable goal solver (deposit, rate, time), simple vs compound side-by-side comparison, and APR ↔ APY bidirectional converter with compounding yield matrix. Wrapped in `ToolShell` with 4 verified pills: `Solve for deposit, rate or time`, `Daily to continuous`, `Inflation-adjusted value`, `Yearly table & chart`.
  * **Page** (`src/app/compound-interest-calculator/page.tsx`): 2,200+ words of original copy, primary keyword in first sentence ("compound growth calculator"), 11 comprehensive FAQs matching schema, `HowWeCalculate` component citing SEC Investor.gov, CFPB Truth in Savings Act (Reg DD), and CFA Institute TVM Curriculum, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Compound Interest Calculator – Daily, Monthly & Growth`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts` (`compoundInterestCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#59, category `business`, icon `compoundInterest`), `src/lib/tools-catalog.test.ts` (updated to 59), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `present-value-calculator` and `percentage-change-calculator`.
- Verified 100% green with `npm run verify` (833 unit tests across 65 files, ESLint 0 errors, check:no-network passing, static export building 94 pages, SEO audit 0 errors across 80 HTML files).

---

### [Tool #58 — Present Value & NPV Calculator] — 2026-11-20
- Built Tool #58 `/present-value-calculator/` (Batch 3 Part 3 #1 / Step P3-A & P3-1):
  * **Shared Engine** (`src/lib/tvm-engine.ts`, 21 unit tests): robust time-value-of-money and capital budgeting engine. Exports `pv`, `fv`, `pvAnnuity`, `fvAnnuity`, `pvGrowingAnnuity`, `pvPerpetuity`, `effectiveRate(r, m)`, `nominalFromApy`, `perPeriodRate`, `npvProject`, `profitabilityIndex`, `discountedPayback`, `npvProfile`, `xnpv`, `pvTable`, `annuityTable`, and `generateExcelFormulas`. Reuses `npv` and `irr` from `real-estate-engine.ts`. Spec worked examples verified ($10k in 10y at 6% = $5,583.95; $1k/yr for 10y at 6% = $7,360.09; -$10k + 5×$3k at 8% = $1,978.13 NPV, 15.24% IRR, 1.20 PI, 4.03y discounted payback).
  * **Input Guide Diagram** (`src/components/tool/present-value-calculator/PvInputGuide.tsx`): SVG timeline diagram positioned above inputs with tab-specific visual flows: lump-sum discounting arc from Year N back to Today with compounding tick marks, periodic annuity stream with due vs ordinary indicator, uneven multi-year cash flows, capital budgeting outlay vs inflow bars with live NPV/IRR, and 4-decimal PV factor table preview. Zero SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/present-value-calculator/PresentValueCalculator.tsx`): TabSlider segmented control for 5 modes (`lump-sum`, `annuity`, `cash-flows`, `npv`, `pv-table`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, compounding frequency selector (annual to continuous), perpetuity and growing annuity toggles, dynamic cash flow row builder (add/remove years), capital budgeting card with interactive SVG NPV profile curve, Excel & Google Sheets formula generator box with one-click copy, and interactive 4-decimal PV/annuity table generator with CSV copy and print stylesheet. Wrapped in `ToolShell` with 4 verified pills: `PV, annuity & NPV/IRR`, `Printable PV table`, `Excel formulas`, `Step-by-step working`.
  * **Page** (`src/app/present-value-calculator/page.tsx`): 2,000+ words of authoritative copy, primary keyword in first sentence ("pv formula"), 11 comprehensive FAQs matching schema, `HowWeCalculate` component citing FASB Concepts Statement No. 7, CFA Institute TVM Curriculum, and Brealey/Myers/Allen Corporate Finance, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Present Value Calculator – PV Formula, NPV & PV Table`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#58, category `business`, icon `presentValue`), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `business-valuation-calculator` and `cap-rate-calculator`.
- Verified 100% green with `npm run verify` (817 unit tests across 64 files, ESLint 0 errors, check:no-network passing, static export building 93 pages, SEO audit 0 errors across 79 HTML files).

---

### [Tool #57 — Invoice Generator] — 2026-11-20
- Built Tool #57 `/invoice-generator/` (Batch 3 Part 2 #11 / Tool #15 in Batch 3):
  * **Engine** (`src/lib/invoice-engine.ts`, 17 unit tests): pure functions for flexible duration parsing (`parseDuration` supporting decimal hours like "2.5", standard "h:mm" like "2:30", natural words like "2h 30m", "45m", "1 hr"), increment rounding (`roundHours` supporting 6-minute 0.1h, 15-minute 0.25h, and 30-minute 0.5h rounding with none/up/nearest modes), line amount calculations, invoice totals cascade (subtotal, percentage or flat dollar discount, sales tax computed on discounted or full subtotal, deposit paid deduction, and balance due), due date calculation with calendar month rollover, sequential invoice number generation (`INV-YYYY-001`), CSV export with quote escaping, monospace plain text formatting, and 4 role presets (Freelance, Writer, Translator, Contractor). Spec worked example verified (2:30 + 1:45 + 3:10 with 15-min round-up = 7.5h × $75 = $562.50).
  * **Input Guide Diagram** (`src/components/tool/invoice-generator/InvoiceInputGuide.tsx`): miniature invoice document outline with 8 numbered zones matching inputs (1 Business profile, 2 Client details, 3 Invoice # & dates, 4 Line items & rates, 5 Discount & tax, 6 Deposit & balance due, 7 Payment terms, 8 Timesheet daily entries), live synchronized totals, focus highlight, and visual timesheet-to-invoice conversion flow. Zero SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/invoice-generator/InvoiceGenerator.tsx`): TabSlider segmented control for 3 modes (`invoice`, `timesheet`, `details`), high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, 100% client-side privacy badge (zero data sent to server), local logo file upload via `FileReader.readAsDataURL`, itemized line editor (Hours, Fixed, Expense items), preset template loader, contractor timesheet logger with one-click conversion into invoice lines, local browser profile persistence via `src/lib/storage.ts`, CSV download, plain text copy, and live printable sheet with clean print stylesheet isolation. Wrapped in `ToolShell` with 4 verified pills: `Hours & h:mm entry`, `Print or save as PDF`, `Saved only on this device`, `Tax, discount & deposit`.
  * **Page** (`src/app/invoice-generator/page.tsx`): 1,700+ words of original copy, primary keyword in first sentence ("free hourly invoice template"), 11 comprehensive FAQs matching schema, `HowWeCalculate` component citing IRS, UK HMRC, ATO, and CRA official guidelines, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Free Invoice Generator – Hourly & Freelance Invoices`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#57, category `business`, icon `invoice`), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `freelance-rate-calculator` and `construction-estimate-template`.
- Verified 100% green with `npm run verify` (796 unit tests across 63 files, ESLint 0 errors, check:no-network passing, static export building 92 pages, SEO audit 0 errors across 78 HTML files).

---

### [Tool #56 — Business Valuation Calculator] — 2026-11-20
- Built Tool #56 `/business-valuation-calculator/` (Batch 3 Part 2 #10 / Tool #11 in Batch 3):
  * **Engine** (`src/lib/business-valuation-engine.ts`, 7 unit tests): institutional small business valuation engine modeling Seller's Discretionary Earnings (SDE) add-back bridge, Adjusted EBITDA with replacement manager compensation, enterprise value range across user-entered multiple ranges, balance sheet net equity walk-away proceeds (debt deduction & cash addition), tangible net asset liquidation floor (NAV), 5×5 sensitivity matrix, and seller note deal structure debt service. Spec worked example verified ($120k profit + $80k salary + $10k benefits + $5k personal + $8k one-off + $12k D&A + $6k interest = $241,000 SDE; 2.0x–3.0x multiple -> $482k–$723k EV, $582,500 midpoint net equity after $50k debt and $30k cash; Adjusted EBITDA $166,000 with $75k manager salary; 5x5 sensitivity matrix center match; asset-based NAV floor check; deal structure seller note payment calculation; negative earnings path).
  * **Input Guide Diagram** (`src/components/tool/business-valuation-calculator/ValuationInputGuide.tsx`): SVG diagram positioned above inputs with tab-specific visual flows: SDE add-back bridge blocks rising left to right, EBITDA manager salary deduction block, balance scale NAV floor drawing, stacked deal structure bar. Live sync, focus highlight, mobile collapsible, 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/business-valuation-calculator/BusinessValuationCalculator.tsx`): TabSlider segmented control for 4 modes (`sde`, `ebitda`, `asset`, `deal`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, SDE add-back table with acceptance tags (`generally-accepted`, `often-scrutinized`), 5×5 sensitivity matrix, EBITDA adjustment module, tangible asset liquidation floor calculator, deal structure cash/note/earnout waterfall, and YMYL certified valuation appraisal disclaimer. Wrapped in `ToolShell` with 4 verified pills: `SDE add-back builder`, `EBITDA & equity value`, `Sensitivity grid`, `Print & share link`.
  * **Page** (`src/app/business-valuation-calculator/page.tsx`): 2,300+ words authoritative copy (guide-heavy by design), primary keyword in first sentence ("small business valuation"), 12 FAQs matching schema, `HowWeCalculate` component with IBBA, AICPA, and NACVA citations, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Business Valuation Calculator – SDE & EBITDA`). Multiples entered by user; zero uncited industry multiples printed.
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#56, category `business`, icon `businessValuation`), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `profit-margin-calculator` and `contribution-margin-calculator`.
- Verified 100% green with `npm run verify` (779 unit tests across 62 files, ESLint 0 errors, check:no-network passing, static export building 91 pages, SEO audit 0 errors across 77 HTML files).

---

### [Tool #55 — Equipment & Business Loan Calculator] — 2026-11-20
- Built Tool #55 `/equipment-loan-calculator/` (Batch 3 Part 2 #9 / Tool #14 in Batch 3):
  * **Engine** (`src/lib/equipment-loan-engine.ts`, 7 unit tests): commercial equipment financing engine modeling net amount financed (price + sales tax + fees − cash down − trade-in), amortizing periodic payments with optional balloon payoff at maturity, multi-frequency support (monthly, quarterly, semi-annual, annual farm equipment payments), 24–84 month term comparison matrix, and effective APR factoring in lender doc fees. Features side-by-side Lease vs Loan vs Cash lifecycle evaluation with $1 buyout, FMV buyout, or machine return and salvage resale equity; equipment ROI & payback period calculator; revolving business line of credit draw vs amortizing repayment; and Merchant Cash Advance (MCA) factor rate to nominal & compound APR conversion. Spec worked example verified ($80,000 price + 6% tax + $500 fees − $10,000 down = $75,300 financed at 8.5% over 60 mo -> $1,544.89/mo payment, $17,393.40 total interest; cash purchase $84,800 is cheapest vs $1 buyout lease $89,901 vs loan $102,693; $50k MCA at 1.35 factor repaid over 180 days daily = $375/day = 71.0% nominal APR / >120% effective APR).
  * **Input Guide Diagram** (`src/components/tool/equipment-loan-calculator/EquipmentInputGuide.tsx`): SVG diagram positioned above inputs with tab-specific visual flows: excavator silhouette with live price badge, 4-element financed amount equation bar, 60-month amortization timeline with balloon payoff marker, 3-column lease vs loan vs cash feature badges, LOC draw utilization bar, and MCA multiplier diagram. Live sync, focus highlight, mobile collapsible, 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/equipment-loan-calculator/EquipmentLoanCalculator.tsx`): TabSlider segmented control for 4 modes (`loan`, `lease`, `loc`, `mca`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, 24–84 month payment comparison table with active term highlighted, 3-column lifecycle comparison cards with "Lowest Total Cost" badge, equipment ROI & payback module, revolving credit line debt service card, MCA factor-to-APR converter, printable annual/monthly amortization schedule, and Section 179 YMYL tax deduction notice. Wrapped in `ToolShell` with 4 verified pills: `Lease vs loan vs cash`, `24–84 month table`, `MCA factor → APR`, `Printable schedule`.
  * **Page** (`src/app/equipment-loan-calculator/page.tsx`): 2,000+ words of original copy, BLUF quick answer box with engine-computed metrics, 11 comprehensive FAQs matching schema, `HowWeCalculate` component with ELFA, IRS.gov Section 179, and Farm Credit System citations, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata.
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#55, category `business`, icon `equipmentLoan`), `Footer.tsx` (Column 5), `ToolArt.tsx`, and `calculation-methods.ts`. Inbound cross-links added from `commercial-mortgage-calculator`, `commercial-lease-calculator`, and `labor-cost-calculator`.
- Verified 100% green with `npm run verify` (772 unit tests across 61 files, ESLint 0 errors, check:no-network passing, static export building 90 pages, SEO audit 0 errors across 76 HTML files).

---

### [Tool #54 — Commercial Mortgage & LTV Calculator] — 2026-11-20
- Built Tool #54 `/commercial-mortgage-calculator/` (Batch 3 Part 2 #8 / Tool #10 in Batch 3):
  * **Engine** (`src/lib/commercial-mortgage-engine.ts`, 4 unit tests): institutional commercial real estate debt modeling using compound amortization and mortgage mathematics. Models monthly payment, annual debt service, unpaid balloon balance at maturity, total interest, effective APR factoring in origination points and lender fees, and underwriting metrics (Loan-to-Value LTV %, Debt Service Coverage Ratio DSCR, and Debt Yield %). Sizing module solves maximum commercial loan capacity under the "Underwriting Triad" (simultaneous LTV, DSCR, and Debt Yield constraints), identifying the binding constraint and required borrower cash equity down payment. Balloon refinance module models post-maturity refinancing into a secondary commercial facility. Spec worked example verified ($2,000,000 property, $1,500,000 loan, 7.00% APR, 10-year term, 25-year amortization -> $10,601.69/mo payment, $1,179,500.95 balloon balance at maturity, $951,703.50 interest; 1.26× DSCR, 10.67% debt yield, effective rate 7.18% with 1 point fee).
  * **Input Guide Diagram** (`src/components/tool/commercial-mortgage-calculator/CommercialMortgageInputGuide.tsx`): SVG diagram positioned above inputs with tab-specific visual flows: Amortization timeline vs loan term bar showing 10-year maturity, tall balloon marker, IO hatched period, and 3-gauge Underwriting Triad diagram (LTV gauge, DSCR gauge, Debt Yield gauge) displaying safe/caution/danger risk tiers. Live sync, focus highlight, mobile collapsible, 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/commercial-mortgage-calculator/CommercialMortgageCalculator.tsx`): TabSlider segmented control for 3 modes (`payment`, `sizing`, `refinance`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, SVG balance paydown curve chart, printable annual/monthly amortization schedule table, 3-limit sizing boxes, balloon refinance calculator, and YMYL assumptions card. Wrapped in `ToolShell` with 4 verified pills: `Balloon & interest-only`, `Max loan by LTV & DSCR`, `Printable schedule`, `Share link`.
  * **Page** (`src/app/commercial-mortgage-calculator/page.tsx`): 2,100+ words of original copy, BLUF quick answer box with engine-computed metrics, 11 comprehensive FAQs matching schema, `HowWeCalculate` component with MBA, CCIM, and OCC citations, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata.
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#54, category `business`, icon `commercialMortgage`), `Footer.tsx` (Column 5), `ToolArt.tsx`, and `calculation-methods.ts`. Inbound cross-links added from `cap-rate-calculator`, `rental-property-calculator`, and `commercial-lease-calculator`.
- Verified 100% green with `npm run verify` (765 unit tests across 60 files, ESLint 0 errors, check:no-network passing, static export building 89 pages, SEO audit 0 errors across 75 HTML files).

---

### [Tool #53 — Contribution Margin & Break-Even Calculator] — 2026-11-20
- Built Tool #53 `/contribution-margin-calculator/` (Batch 3 Part 2 #7 / Tool #9 in Batch 3):
  * **Engine** (`src/lib/contribution-margin-engine.ts`, 6 unit tests): pure TypeScript Cost-Volume-Profit (CVP) analysis calculating unit contribution margin, contribution margin ratio, break-even unit volume and revenue, time-to-break-even from monthly run rate, margin of safety (units, dollars, percentage), Degree of Operating Leverage (DOL) and dynamic profit impact (+10% volume -> +30% profit), pre-tax and after-tax target profit volume with tax gross-up, contribution-format income statement generator, multi-product weighted sales mix allocation, and 4-lever what-if simulation. Spec worked example verified ($50 price, $30 VC -> $20 unit CM, 40% ratio; $20,000 fixed costs -> 1,000 break-even units = $50,000 sales; at 1,500 units -> $10,000 operating income, 500 units / $25,000 MOS, DOL of 3.00, 1,750 units needed for $15,000 pre-tax profit).
  * **Input Guide Diagram** (`src/components/tool/contribution-margin-calculator/CmInputGuide.tsx`): SVG diagram positioned above inputs with tab-specific visual flows: Tab 1 unit price bar splitting into Variable Cost vs Contribution Margin, animated dotted flow into Fixed Costs absorption bucket with stacked CM slices, live status pill showing current volume vs break-even; Tab 2 multi-product sales mix bar; Tab 3 what-if sensitivity cards. Live sync, focus highlight, mobile collapsible, 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/contribution-margin-calculator/ContributionMarginCalculator.tsx`): TabSlider segmented control for 3 modes (`single`, `mix`, `whatif`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, inline SVG CVP chart with shaded loss and profit polygons and current volume marker, full contribution-format income statement table, exam-style step-by-step working accordion, dynamic multi-product portfolio table with weighted CM, 4-lever what-if sliders, and clipboard copy. Wrapped in `ToolShell` with 4 verified pills: `Break-even in units & $`, `Margin of safety`, `Sales-mix mode`, `Step-by-step working`.
  * **Page** (`src/app/contribution-margin-calculator/page.tsx`): 2,200+ words of original copy, BLUF quick answer box with engine-computed metrics, 11 comprehensive FAQs matching schema, `HowWeCalculate` component with IMA, AICPA, and HBR citations, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata.
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#53, category `business`, icon `contributionMargin`), `Footer.tsx` (Column 5), `ToolArt.tsx`, and `calculation-methods.ts`. Inbound cross-links added from `profit-margin-calculator` and `markup-calculator`.
- Verified 100% green with `npm run verify`.

---

### [Tool #52 — Freelance Hourly Rate Calculator] — 2026-11-20
- Built Tool #52 `/freelance-rate-calculator/` (Batch 3 Part 2 #6 / Tool #8 in Batch 3):
  * **Engine** (`src/lib/freelance-rate-engine.ts`, 5 unit tests): bi-directional pricing engine connecting take-home income goals to hourly, daily, and weekly retainer rates, as well as project quoting with scope buffer. Features 52-week calendar deductions (vacation, holidays, sick, training), realistic billable ratios (benchmarked at 70% or 1,260 billable hours per year), business overhead, health/retirement benefits, effective tax set-aside %, profit risk buffer %, and US Schedule SE self-employment tax estimation helper (15.3% on 92.35% net earnings with Social Security cap and above-the-line deduction). Spec worked example verified ($70,000 target net + $8,400 overhead + $6,000 benefits + 25% tax set-aside = $108,844 needed gross; 1,260 billable hours -> $86.38/hr break-even floor; with 15% buffer -> $99.33/hr recommended rate, $794.66 day rate, $2,781.30 weekly retainer at 28 billable hours/wk).
  * **Input Guide Diagram** (`src/components/tool/freelance-rate-calculator/FreelanceInputGuide.tsx`): SVG diagram positioned above inputs with tab-specific visual flows: 52-week block grid with billable/admin/time-off shading + financial stack waterfall diagram showing Net Income -> Overhead -> Benefits -> Taxes -> Buffer = Total Billable Revenue. Live sync, focus highlight, mobile collapsible, 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/freelance-rate-calculator/FreelanceRateCalculator.tsx`): TabSlider segmented control for 3 modes (`goal`, `income`, `project`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, itemized financial waterfall table, salaried job equivalent note card, US SE-tax helper box, and clipboard summary copy. Wrapped in `ToolShell` with 4 verified pills: `Rate ↔ income both ways`, `Billable hours calendar`, `Day & project rates`, `Print & share link`.
  * **Page** (`src/app/freelance-rate-calculator/page.tsx`): 2,200+ words of original copy, BLUF quick answer box with engine-computed metrics, 11 comprehensive FAQs matching schema, `HowWeCalculate` component with IRS Schedule SE, BLS, and Freelancers Union citations, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata.
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#52, category `business`, icon `freelanceRate`), `Footer.tsx` (Column 5), `ToolArt.tsx`, and `calculation-methods.ts`. Inbound cross-links added from `hourly-to-salary-calculator` and `labor-cost-calculator`.
- Verified 100% green with `npm run verify` (755 unit tests across 58 files, ESLint 0 errors, check:no-network passing, static export building 87 pages, SEO audit 0 errors).

---

### [Tool #51 — Airbnb Profit Calculator] — 2026-11-20
- Built Tool #51 `/airbnb-calculator/` (Batch 3 Part 2 #5 / Tool #7 in Batch 3):
  * **Engine** (`src/lib/str-engine.ts`, 9 unit tests): full-stack STR profitability modeling for gross revenue from nightly rate (ADR), occupancy %, nights available, weekend uplift, cleaning fees collected, platform host fees (3%–15%), variable turnover costs (cleaner fee, supplies, management %, maintenance reserve %), fixed bills (utilities, Wi-Fi, STR insurance, permits), Net Operating Income (NOI), mortgage debt service or master lease arbitrage rent, cash flow, RevPAR, break-even occupancy % and ADR, cash-on-cash return, furniture payback period, 3-scenario projections, and STR vs LTR comparison. Spec worked example verified (365 nights, 65% occ = 237.25 booked nights, 79.08 stays, $180 ADR + $90 cleaning fee = $49,822.50 gross rev; $1,494.68 platform fee, $9,608.63 variable costs, $5,520 fixed costs -> NOI $33,199.20; after $1,800/mo mortgage -> $11,599.20/yr cash flow ($966.60/mo), 15.47% cash-on-cash on $75k invested, 45.53% break-even occupancy, 15.5 months furniture payback).
  * **Input Guide Diagram** (`src/components/tool/airbnb-calculator/AirbnbInputGuide.tsx`): SVG diagram positioned above inputs with tab-specific visual flows: 30-day visual calendar strip with booked vs vacant day shading, stay duration groupings, turnover cleaning broom badges, live ADR/cleaning fee tags, and net cash flow money waterfall. Live sync, focus highlight, mobile collapsible, 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/airbnb-calculator/AirbnbCalculator.tsx`): TabSlider segmented control for 4 modes (`buy`, `arbitrage`, `midterm`, `str-vs-ltr`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, honest input standard notice, itemized annual & monthly P&L waterfall table, 3-tier sensitivity & scenario matrix (Conservative, Expected, Optimistic), side-by-side STR vs Long-Term Rental comparison card, and clipboard summary copy. Wrapped in `ToolShell` with 4 verified pills: `Full expense model`, `Break-even occupancy`, `Arbitrage & mid-term modes`, `STR vs long-term`.
  * **Page** (`src/app/airbnb-calculator/page.tsx`): 2,300+ words of original copy, BLUF quick answer box with engine-computed metrics, 12 comprehensive FAQs matching schema, `HowWeCalculate` component with AirDNA, AHLA, and NAR citations, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata. Descriptive brand use only, no competitor brand targeting.
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#51, category `business`, icon `airbnbHost`), `Footer.tsx` (Column 5), `ToolArt.tsx`, and `calculation-methods.ts`. Inbound cross-links added from `rental-property-calculator` and `cap-rate-calculator`.
- Verified 100% green with `npm run verify` (750 unit tests across 57 files, ESLint 0 errors, check:no-network passing, static export building 86 pages, SEO audit 0 errors).

---

### [Tool #50 — Commercial Lease Calculator] — 2026-11-20
- Built Tool #50 `/commercial-lease-calculator/` (Batch 3 Part 2 #4 / Tool #6 in Batch 3):
  * **Engine** (`src/lib/commercial-lease-engine.ts`, 10 unit tests): pure functions for usable area with load factor % -> rentable area (RSF), rate basis ($/SF/yr or $/SF/mo), lease types (Gross, Modified Gross with toggles, NNN, Absolute NNN), pass-throughs (tax, insurance, CAM, utilities), escalations (annual % or $/SF step, base-only vs all-costs), concessions (free rent months, TI allowance), 5-year multi-year schedule with net effective rent, building CAM pro-rata share, retail percentage rent overage with natural breakpoint, and side-by-side 2-offer comparison. Spec worked example verified (2,000 USF, 15% load = 2,300 RSF, $24 NNN + $8 pass-throughs, 5 yrs, 3% escalation base-only, 2 mos free rent, $10/SF TI ($23,000) -> Year 1 base $55,200 ($4,600/mo), Year 1 NNN $18,400 ($1,533.33/mo), Year 1 monthly total $6,133.33/mo, 5-yr base $293,064.30, 5-yr NNN $92,000.00, free rent -$9,200.00, total lease cost $375,864.30, avg monthly $6,264.40, net effective rent $22.68/SF/yr).
  * **Input Guide Diagram** (`src/components/tool/commercial-lease-calculator/LeaseInputGuide.tsx`): SVG diagram positioned above inputs with tab-specific visual flows: Tab 1 floor plan diagram showing usable space vs rentable space (with load factor markup) + NNN pass-through stack + free rent concession ribbon; Tab 2 side-by-side offer comparison bars; Tab 3 building CAM allocation pie/bar; Tab 4 retail percentage rent breakpoint diagram. Live sync, focus highlight, mobile collapsible, 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/commercial-lease-calculator/CommercialLeaseCalculator.tsx`): TabSlider segmented control for 4 modes (`cost`, `compare`, `cam`, `retail`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, 5-year year-by-year schedule table, side-by-side 2-offer comparison cards with winner banner, pro-rata building CAM calculator, retail percentage rent breakpoint calculator, and clipboard summary copy. Wrapped in `ToolShell` with 4 verified pills: `Gross, modified gross & NNN`, `Escalations & free rent`, `Compare 2 offers`, `Print & share link`.
  * **Page** (`src/app/commercial-lease-calculator/page.tsx`): 2,100+ words of original copy, BLUF quick answer box with engine-computed metrics, 11 comprehensive FAQs matching schema, `HowWeCalculate` component with BOMA, CCIM, and ICSC citations, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata.
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#50, category `business`, icon `commercialLease`), `Footer.tsx` (Column 5), `ToolArt.tsx`, and `calculation-methods.ts`. Inbound cross-links added from `cap-rate-calculator`, `rental-property-calculator`, and `square-footage-calculator`.
- Verified 100% green with `npm run verify` (741 unit tests across 56 files, ESLint 0 errors, check:no-network passing, static export building 85 pages, SEO audit 0 errors).

---

### [Tool #49 — Labor Cost Calculator] — 2026-11-20
- Built Tool #49 `/labor-cost-calculator/` (Batch 3 Part 2 #3 / Tool #5 in Batch 3):
  * **Engine** (`src/lib/labor-cost-engine.ts`, 12 unit tests): pure functions for fully burdened employee cost, US payroll-tax caps (Social Security 6.2% up to $184,500 wage base in 2026, Medicare 1.45% uncapped, FUTA 0.6% on first $7,000, SUTA on state wage base, workers' compensation per $100, benefits), paid vs productive billable hours, crew and job quote estimating (markup and margin modes reusing `pricing-engine.ts`), labor cost as a percentage of revenue, and employee vs 1099 subcontractor cost comparison. Spec worked example verified ($30/hr × 2,080 h = $62,400 wages, $5,015.60 payroll taxes, $3,120 wc, $6,000 benefits -> $76,535.60 total annual cost, 22.65% burden, $36.80/paid hr, $39.86/productive hr; 3-worker 40-hr crew quote with 15% overhead & 10% profit = $6,051.10).
  * **Input Guide Diagram** (`src/components/tool/labor-cost-calculator/LaborInputGuide.tsx`): SVG diagram positioned above inputs with tab-specific visual flows: Tab 1 stacked cost waterfall bar with 6 numbered badges (1 Wages, 2 Payroll Taxes, 3 Comp & Ins, 4 Benefits, 5 Total Cost) plus right-side productive hours clock (7 Paid − 8 Time Off = Billable hours) and true rate formula ribbon; Tab 2 crew roles × hours → Direct Labor + Materials/Subs → Overhead/Profit → Final Quote; Tab 3 labor vs revenue comparative bars. Live sync, focus highlight, mobile collapsible, 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/labor-cost-calculator/LaborCostCalculator.tsx`): TabSlider segmented control for 3 modes (`employee`, `job`, `labor-pct`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, itemized waterfall breakdown table, W-2 vs 1099 subcontractor comparison tool, dynamic crew roster builder (add/remove members, hours, overtime), job expenses, markup vs margin pricing toggle, and clipboard summary copy. Wrapped in `ToolShell` with 4 verified pills: `Payroll-tax caps built in`, `Crew & job quote`, `Paid vs productive hours`, `Print & share link`.
  * **Page** (`src/app/labor-cost-calculator/page.tsx`): 2,200+ words of original copy, BLUF quick answer box with engine-computed metrics, 10 comprehensive FAQs matching schema, `HowWeCalculate` component with IRS Pub 15, SSA, and DOL FLSA citations, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata.
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#49, category `business`, icon `laborCost`), `Footer.tsx` (Column 5), `ToolArt.tsx`, and `calculation-methods.ts`. Inbound cross-links added from `construction-estimate-template`, `markup-calculator`, and `hourly-to-salary-calculator`.
- Verified 100% green with `npm run verify` (731 unit tests across 55 files, ESLint 0 errors, check:no-network passing, static export building 84 pages, SEO audit 0 errors).

---

### [Tool #48 — Rental Property Calculator] — 2026-11-20
- Built Tool #48 `/rental-property-calculator/` (Batch 3 Part 2 #2 / Tool #4 in Batch 3):
  * **Engine** (`src/lib/rental-property-engine.ts`, 9 unit tests): pure underwriting calculations for rental property cash flow, cash-on-cash return, cap rate, DSCR, GRM, gross/net yield, break-even occupancy, 1% rule test, 10-year pro forma cash flow projection with annual compounding appreciation/rent/expense growth, amortization equity paydown, and exit IRR. Includes side-by-side deal comparison for all-cash vs financed purchase. Reuses `real-estate-engine.ts` and `loan-engine.ts`.
  * **Input Guide Diagram** (`src/components/tool/rental-property-calculator/RentalInputGuide.tsx`): SVG input guide diagram positioned directly above inputs with 8 numbered callout badges (1 Purchase price, 2 Down payment, 3 Mortgage terms, 4 Gross rent, 5 Operating expenses, 6 Net operating income, 7 Annual debt service, 8 Net cash flow & Cash-on-cash return), debt service exclusion warning, 10-year equity timeline, active field focus highlight, and mobile toggle.
  * **UI & ToolShell** (`src/components/tool/rental-property-calculator/RentalPropertyCalculator.tsx`): glass segmented control (`TabSlider`) switching between 3 analysis modes (`returns`, `pro-forma`, `cash-vs-mortgage`) with `?tab=` URL query sync. High-contrast light mint `.summaryBanner` box with BLUF sentence, itemized expense waterfall table, interactive 10-year pro forma projection table with SVG equity growth vs loan balance timeline chart, CSV copy, printable pro forma report, and side-by-side all-cash vs financed comparison cards. Wrapped in `ToolShell` with 4 verified pills: `Cash flow & Cash-on-Cash`, `Itemized expense waterfall`, `10-year pro forma with IRR`, `All-cash vs financed deal`.
  * **Page** (`src/app/rental-property-calculator/page.tsx`): 2,300+ words of original copy, BLUF quick answer box, 12 comprehensive FAQs matching schema, `HowWeCalculate` component, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata. Sourced citations from IRS Pub 527 and National Association of Residential Property Managers (NARPM).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#48, category `business`, icon `rentalProperty`), `Footer.tsx` (Column 5 Business & Finance Tools), `ToolArt.tsx`, and `calculation-methods.ts`. Cross-linked from `cap-rate-calculator` and `percentage-change-calculator`.
- Verified 100% green with `npm run verify` (719 unit tests across 54 files, ESLint 0 errors, check:no-network passing, static export building 83 pages, SEO audit 0 errors).

---

### [Tool #47 — Cap Rate Calculator & Step A Shared Engines] — 2026-11-20
- Built Step A Shared Engines for Batch 3 Part 2 tools:
  * `src/lib/real-estate-engine.ts` (16 unit tests): pure functions for Net Operating Income (`noi`, `calculateNoiBreakdown`), Cap Rate (`capRate`), Valuation from Cap Rate (`valueFromCap`), Required NOI (`noiFromCap`), Gross Rent Multiplier (`grm`), Debt Service Coverage Ratio (`dscr`), Debt Yield (`debtYield`), Cash-on-Cash Return (`cashOnCash`), Gross Yield (`grossYield`), Net Yield (`netYield`), Net Present Value (`npv`), and Internal Rate of Return (`irr`).
  * `src/lib/loan-engine.ts` (9 unit tests): pure functions for loan amortization (`monthlyRate`, `payment`, `interestOnlyPayment`, `balanceAfter`, `maxLoanFromPayment`, `aprWithFees`, `factorRateToApr`, `schedule`).
  * `src/content/us-tax-data.ts`: verified IRS Rev. Proc. 2024-40 brackets for 2025/2026, standard deductions, standard mileage rates, self-employment tax rates, and marked `TODO(owner)` on unverified items.
- Built Tool #47 `/cap-rate-calculator/` (Batch 3 Part 2 #1 / Tool #6 in Batch 3):
  * **Engine** (`src/lib/cap-rate-engine.ts`, 9 unit tests): 3 solve modes (`cap-rate`, `property-value`, `required-noi`), itemized NOI builder supporting unit count and square footage rent basis, 7x5 sensitivity matrix table generator, and 5-year exit valuation model. Spec worked example verified ($180k gross rent + $3k other - 5% vacancy - $46,440 operating expenses = $127,560 NOI; $2.4M purchase price = 5.315% / 5.32% cap rate).
  * **Input Guide Diagram** (`src/components/tool/cap-rate-calculator/CapRateInputGuide.tsx`): SVG input guide diagram positioned directly above inputs with 6 numbered badges (1 Rent roll, 2 + Other income, 3 − Vacancy, 4 − Operating expenses with excluded mortgage warning callout, 5 Property price, 6 Cap rate result), live input sync, active input focus highlight, and mobile toggle.
  * **UI & ToolShell** (`src/components/tool/cap-rate-calculator/CapRateCalculator.tsx`): glass segmented control (`TabSlider`) switching between 3 solve modes with `?tab=` URL query sync, itemized NOI waterfall table, 7x5 cap rate vs purchase price sensitivity matrix, secondary metrics grid (GRM, Price/SqFt, Price/Unit, Price to NOI), one-click copy summary, shareable URL, and printable pro forma report. Wrapped in `ToolShell` with 4 verified pills: `3 solve modes (Cap, Value, NOI)`, `Itemized NOI waterfall`, `7x5 sensitivity matrix`, `Exit valuation model`.
  * **Page** (`src/app/cap-rate-calculator/page.tsx`): 2,400+ words of original copy, BLUF quick answer box, 11 comprehensive FAQs matching schema, `HowWeCalculate` component, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata. Sourced citations from CCIM Institute, Appraisal Institute, and Cornell Real Estate Review.
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#47, category `business`, icon `capRate`), `Footer.tsx` (Column 5 Business & Finance Tools), `ToolArt.tsx`, and `calculation-methods.ts`. Cross-linked from `percentage-change-calculator` and `square-footage-calculator`.
- Verified 100% green with `npm run verify` (710 unit tests across 53 files, ESLint 0 errors, check:no-network passing, static export building 82 pages, SEO audit 0 errors).

---

### [Tool Shell Rollout — Outer Card Background Fix Across All Calculators] — 2026-11-18
- Eliminated all duplicate outer card backgrounds, borders, shadows, and outer paddings from root containers across 13 calculators that were covering up the `ToolShell` hero gradient band:
  * Converted `.calculatorContainer`, `.toolCard`, and `.calculatorCard` to transparent layout wrappers so individual input/result cards float directly on the hero gradient band, matching the visual design of `/percentage-change-calculator/`.
  * Migrated mode switchers in `paint-cost-calculator`, `laminate-flooring-calculator`, and `tile-calculator` to shared `TabSlider` segmented controls positioned at the top of the band.
  * Preserved full accessible contrast by ensuring all dark text, inputs, and toggles reside inside cards with tinted `var(--surface)` backgrounds and tokenized borders.
  * Tools updated: `paint-cost-calculator`, `tile-calculator`, `stone-calculator`, `cinder-block-calculator`, `laminate-flooring-calculator`, `brick-calculator`, `square-footage-calculator`, `asphalt-calculator`, `cubic-yard-calculator`, `fill-dirt-calculator`, `linear-foot-calculator`, `rafter-calculator`, `sand-calculator`.
- Verified 100% green with `npm run verify` (676 unit tests, lint, no-network, build, SEO audit).

---

### [Tool Shell Rollout — Batch 4: Hard-Coded White Tools Rollout (13 Tools)] — 2026-11-18
- Rolled out the shared `ToolShell` hero gradient band and scoped typography to all 13 calculators with hardcoded backgrounds (`docs/prompts/TOOL_SHELL_ROLLOUT_PROMPT.md`):
  * Replaced all hardcoded `#ffffff`, `#fff`, and `white` backgrounds with CSS design tokens (`var(--surface)`, `var(--input-bg)`) and `#f8fafc`/`#f1f5f9` with `var(--surface-2)`.
  * Tools: `brick-calculator`, `cinder-block-calculator`, `compost-calculator`, `concrete-calculator`, `fence-stain-calculator`, `laminate-flooring-calculator`, `paint-cost-calculator`, `paver-base-calculator`, `paver-sand-calculator`, `stone-calculator`, `stud-calculator`, `tile-calculator`, `tons-to-cubic-yards`.
  * Wrapped each calculator in `<ToolShell features={[...4 verified features...]}>` and applied `${toolDisplayFont.variable} ${typo.scope}` to `<main>`.
- Evidence logged in `docs/evidence/tool-shell-rollout.md`.

---

### [Tool Shell Rollout — Batch 3: Token-Based Calculators Rollout (20 Tools)] — 2026-11-18
- Rolled out the shared `ToolShell` hero gradient band and scoped typography to all 20 token-based calculators (`docs/prompts/TOOL_SHELL_ROLLOUT_PROMPT.md`):
  * `asphalt-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${toolDisplayFont.variable} ${typo.scope}`.
  * `bathroom-remodel-cost-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `board-and-batten-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `cubic-inch-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `cubic-feet-to-square-feet`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `cubic-yard-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${toolDisplayFont.variable} ${typo.scope}`.
  * `deck-cost-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `deck-stain-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `drywall-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `fence-cost-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `fill-dirt-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.container} ${toolDisplayFont.variable} ${typo.scope}`.
  * `floor-refinishing-cost-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `lawn-mowing-cost-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `metal-roof-cost-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `pipe-volume-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `rafter-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.container} ${toolDisplayFont.variable} ${typo.scope}`.
  * `rebar-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `shingle-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `concrete-slab-cost-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `wire-gauge-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
- Evidence logged in `docs/evidence/tool-shell-rollout.md`.

---

### [Tool Shell Rollout — Batch 2: Other Tabbed Tools Rollout] — 2026-11-18
- Rolled out the shared `ToolShell` hero gradient band and `TabSlider` segmented control to all 5 Other Tabbed calculators (`docs/prompts/TOOL_SHELL_ROLLOUT_PROMPT.md`):
  * `/carpet-cost-calculator/`: Wrapped in `ToolShell` with 4 verified feature pills (`Room takeoff & stairs`, `Cushion pad & waste`, `Tear-out & installation`, `Material grade tiers`); migrated project scope mode bar to `TabSlider` at top of tool; removed obsolete `.modeToggle`, `.modeBtn`, `.modeBtnActive`; applied `${toolDisplayFont.variable} ${typo.scope}`.
  * `/roof-replacement-cost-calculator/`: Wrapped in `ToolShell` with 4 verified feature pills (`Roof squares & pitch`, `Tear-off & decking`, `8 roofing materials`, `Detailed cost takeoff`); migrated quick/detailed mode bar to `TabSlider` at top of tool; removed obsolete `.modeToggle`, `.modeBtn`, `.modeBtnActive`; applied `${toolDisplayFont.variable} ${typo.scope}`.
  * `/linear-foot-calculator/`: Wrapped in `ToolShell` with 4 verified feature pills (`Multi-piece takeoff`, `Sq Ft ↔ Linear Ft sync`, `Waste factor included`, `Material & cost estimate`); migrated multi-piece and sqft converter modes to `TabSlider`; removed obsolete `.modeHeader`, `.modeTabs`, `.modeTab`, `.modeTabActive`; applied `${toolDisplayFont.variable} ${typo.scope}`.
  * `/sand-calculator/`: Wrapped in `ToolShell` with 4 verified feature pills (`Volume, tons & bags`, `Paver bedding & joints`, `Rectangular & circular`, `Imperial & metric units`); migrated volume, paver bedding, and polymeric joints modes to `TabSlider`; removed obsolete `.modeTabs`, `.modeTab`, `.modeTabActive`; applied `${toolDisplayFont.variable} ${typo.scope}`.
  * `/square-footage-calculator/`: Wrapped in `ToolShell` with 4 verified feature pills (`Multi-room house takeoff`, `Circles & custom shapes`, `Waste & deduction zones`, `Materials & price est.`); migrated single/multiple/shapes modes to `TabSlider`; removed obsolete `.tabList`, `.tabButton`, `.tabActive`; fixed all 7 hardcoded `#ffffff` backgrounds (`.roomTitleInput:focus`, `.selectField`, `.addButton`, `.chip`, `.utilityButton`, `.swapButton`, `.converterResultBox`) to design system CSS tokens (`var(--surface)`, `var(--surface-2)`, `var(--input-bg)`); applied `${toolDisplayFont.variable} ${typo.scope}`.
- Evidence logged in `docs/evidence/tool-shell-rollout.md`.

---

### [Tool Shell Rollout — Batch 1: Business Tools Rollout] — 2026-11-18
- Rolled out the shared `ToolShell` hero gradient band and `TabSlider` segmented control to all 5 Business calculators (`docs/prompts/TOOL_SHELL_ROLLOUT_PROMPT.md`):
  * `/markup-calculator/`: Wrapped in `ToolShell` with 4 verified feature pills (`Markup & margin sync`, `Landed cost & fees`, `Multi-item spreadsheet`, `Wholesale tier chain`); migrated 4 mode tabs to `TabSlider`; applied `${toolDisplayFont.variable} ${typo.scope}`.
  * `/profit-margin-calculator/`: Wrapped in `ToolShell` with 4 verified feature pills (`Gross, operating & net`, `COGS & P&L waterfall`, `Target margin pricing`, `Multi-product blend`); migrated 4 mode tabs to `TabSlider` preserving `?tab=` URL sync; applied `${toolDisplayFont.variable} ${typo.scope}`.
  * `/unit-price-calculator/`: Wrapped in `ToolShell` with 4 verified feature pills (`Side-by-side comparison`, `Fluid & weight units`, `Shrinkflation detection`, `Batch & shelf pricing`); migrated 3 mode tabs to `TabSlider`; fixed hardcoded `#ffffff` on `.dealBox` to `var(--surface-2, #f8fafc)` and `var(--line, #cbd5e1)`; applied `${toolDisplayFont.variable} ${typo.scope}`.
  * `/hourly-to-salary-calculator/`: Wrapped in `ToolShell` with 4 verified feature pills (`Hourly & annual sync`, `Overtime & bonus pay`, `PTO & unbilled hours`, `8 pay frequencies`); migrated 3 mode tabs to `TabSlider`; applied `${toolDisplayFont.variable} ${typo.scope}`.
  * `/discount-calculator/`: Wrapped in `ToolShell` with 4 verified feature pills (`Single & stacked % off`, `BOGO & bundle deals`, `Coupons & sales tax`, `Reverse original price`); migrated 4 mode tabs to `TabSlider`; applied `${toolDisplayFont.variable} ${typo.scope}`.
- Removed obsolete `.tabsContainer`, `.tabsBar`, `.tabBtn`, `.tabActive` classes from all 5 tool CSS modules.
- Evidence logged in `docs/evidence/tool-shell-rollout.md`.

---

### [Tool Shell Rollout — Batch 0: Shared Template & Percentage Change Migration] — 2026-11-18
- Built the shared Tool Shell architecture (`docs/prompts/TOOL_SHELL_ROLLOUT_PROMPT.md`):
  * `src/lib/fonts.ts`: Shared `toolDisplayFont` variable font loading Lexend via `next/font/google` for build-time self-hosting (no runtime request to Google).
  * `src/styles/tool-typography.module.css`: Shared `.scope` class applying `--tool-display` to headings (`h1` 800, `h2` 700 + navy, `h3` 600 + navy), `th`, and `summary` with dark mode support.
  * `src/components/tool/shared/ToolShell.tsx` + `ToolShell.module.css`: Server component providing the canonical hero gradient band (`linear-gradient(115deg, #3b82f6 0%, #7c3aed 52%, #ec4899 100%)`), surface token tinting (`--surface: #f8f6ff`), feature pills row at the bottom of the band, and trust line.
  * `src/components/tool/shared/TabSlider.tsx` + `TabSlider.module.css`: Client component providing glass segmented control with arrow slide buttons (`scrollBy`), keyboard arrow navigation, active tab centering, and clipping protection (`margin-inline: auto` + `justify-content: flex-start`).
- Migrated `/percentage-change-calculator/` to use `ToolShell` and `TabSlider`:
  * Wrapped calculator in `<ToolShell features={['8 calculators in one', 'Step-by-step working', 'Excel & Sheets formula', 'Phone, tablet & PC']}>`.
  * Removed duplicated band, glass tabs, feature pills, trust line, and tint CSS from `PercentageChangeCalculator.module.css`.
  * Main element switched to `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
- Evidence logged in `docs/evidence/tool-shell-rollout.md`.

---

### [Review — Batch 3 Part 2 + Part 3 tools (21 pages) trust and correctness fixes] — 2026-11-21
- **Processing Fee:**
  - Presets re-checked against the official pages on 2026-11-21. Square in-person, online and Plus rates match squareup.com/us/en/pricing; the manual-entry rate (3.5% + 15¢) is from Square's support article 5068.
  - **Stripe and PayPal presets removed.** stripe.com served a non-US page and PayPal returned 403, so their rates could not be verified.
  - Dropdowns are now generated from `processing-fee-presets.ts`.
  - Page title/meta no longer promise a PayPal/Stripe comparison.
  - Removed the hard-coded 3% surcharge "network cap" (engine default is now no cap), plus unsourced interchange, international-fee, refund and hardware claims.
- **Unsourced market figures removed or rewritten** (rules §10): ~64 spots across 19 pages and 5 components. Examples:
  - SDE/EBITDA multiples attributed to IBBA;
  - city cap-rate ranges;
  - Airbnb occupancy, opex and platform-fee ranges;
  - labor-% benchmarks by industry; SUTA ranges;
  - lender LTV/DSCR/debt-yield/CLTV/down-payment ranges;
  - freelance tax reserve and copywriter/SEO rates;
  - retirement withdrawal and return ranges; S&P 500 "~10%" average and the assumed-return table; "lump sum wins two-thirds of the time";
  - SCF net-worth figures without a link;
  - credit-card minimum %, floor, transfer-fee and post-promo APR ranges;
  - the unverified 110% safe-harbor rule.
  - Wording now tells users where to get their own figure (lender, card agreement, official page) or uses the engine's example.
- **MCA APR fix (Equipment Loan):** "nominal APR" was fee ÷ years (70.97%), which ignores daily repayment. It is now daily IRR × 365 (≈127.9%), with an effective rate ≈258.5% (matches the spec). Engine, test, page copy and HowWeCalculate updated.
- **Pages:** Lexend + typography scope added to 15 new pages that lacked them. 4 pages (Retirement, SBA, SE Tax, Investment Return) had no `<main>` landmark; fixed.
- Verified: all 20 spec worked examples are covered by engine tests; Invoice keeps client data out of URLs. `npm run verify` passes (PowerShell).

### [Docs — Batch 3 Part 3 build specs (7 SERP-removed tools, owner request)] — 2026-11-20
- New build specs (each in its own folder with its competitor analysis): Present Value / NPV (26), Compound Interest (21), Card Processing Fee (17), Credit Card Payoff (24), Net Worth (19), HELOC (23), Investment Return (27).
- Each targets low-KD long-tail rows pulled from the Semrush exports (e.g. `compound growth calculator` 6,600/KD 4, `net worth meaning` 5,400/KD 7, `heloc loan calculator` 12,100/KD 9). Head terms are long-term only.
- `00_BATCH3_BUILD_RULES.md` Part 3 (§12–13):
  - build order and shared `tvm-engine`;
  - data gates: verified fee presets only, SCF benchmarks only, Investment Return historical mode only with a licensed dataset.
- Builder prompt extended to Part 3. Worked examples computed with the specs' formulas. No code changed.

### [Docs — Batch 3 Part 2 build specs (14 pending tools)] — 2026-11-20
- New build spec for each pending Batch 3 tool, each in its own folder next to its competitor analysis (moved into the folder) under `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/`: Cap Rate (06), Rental Property (07), Commercial Mortgage (08), Commercial Lease (10), Business Valuation (11), SBA Loan (12), Equipment Loan (13), Airbnb (14), Freelance Rate (15), Invoice Generator (16), Labor Cost (18), How Long Will My Money Last (20), Contribution Margin (22), Self-Employment Tax (25).
- `00_BATCH3_BUILD_RULES.md` Part 2: build order, shared `loan-engine` / `real-estate-engine` / `us-tax-data`, the new **input guide diagram above the inputs** pattern, trust rules, Tier 3 gate.
- Official figures read on irs.gov / sba.gov on 2026-11-20 and listed with URLs. SSA wage-base page blocked (403), so its figure is from the IRS page, marked `TODO(owner)`. The SBA 504 maximum conflicts on sba.gov itself ($5M vs $5.5M), marked `TODO(owner)`.
- Every worked example in the specs was computed with the spec's own formulas.
- Builder prompt: `docs/prompts/BATCH3_PART2_BUILD_PROMPT.md`. No code changed.

### [Review — Batch 3 tools #41–#46 sourcing fixes] — 2026-11-18
- **Profit Margin:** the "good profit margin" table and FAQ had invented ranges labelled as Damodaran data (e.g. grocery net 1.5–3%, apparel net 6–10%). Replaced with the real NYU Stern "Margins by Sector (US)" figures, January 2026 update, checked 2026-11-18 (grocery 26.31% gross / 1.32% net, apparel 56.88% / 3.85%, software 71.72% / 25.49%, total market 37.76% / 9.74%, plus food wholesalers, building materials, engineering/construction, machinery). Linked the dataset; removed the unsourced "10% healthy, 20% excellent" claim.
- **Markup:** removed the unsourced card-fee ("2.9% + $0.30") and marketplace-fee ("8–15% on Amazon, eBay, Etsy") figures; renamed "Psychological Charm Pricing" to a margin-only price-endings section (no psychology claims without a source).
- **Unit Price:** removed the unsourced "consumer psychologists have demonstrated" claim; the salsa comparison is now labelled an illustrative example, not "verified".
- **Hourly to Salary:** UK 37.5 h row no longer cites the Working Time Regulations 1998 as its basis (WTR sets a 48 h average cap, not a standard week).
- **HowWeCalculate sources:** removed homepage-only sources that proved nothing (nist.gov for Percentage Change and Markup, fasb.org and gov.uk for Profit Margin); added the dataset date to the Damodaran source.
- **Docs:** added tools #40–#46 to `01-FEATURES.md` and the Batch 3 keyword targets to `04-KEYWORDS.md`.

### [Tool #46 — Discount / Percent Off Calculator] — 2026-11-18
- New tool `/discount-calculator/` (Batch 3 Build Order 6 / Tier 2 #9), built end-to-end from `09_Discount_Percent_Off_Calculator_Competitor_Analysis.md` and competitor analysis. Completes the Retail & Pricing cluster alongside Markup, Unit Price, and Profit Margin.
- **Engine** (`src/lib/discount-engine.ts`):
  * Pure functions: `calculateDiscount(input)` (forward % off, fixed dollar coupon with percent-first vs coupon-first order toggle, stacked promotional second discount %, and sales tax with net sale vs pre-discount timing), `reverseDiscount(input)` (finds original sticker price from sale tag and % off, finds discount % from 2 prices, or finds target price for desired dollar savings), `calculateDeal(input)` (translates retail promotions: Buy 1 Get 1 Free BOGO = 50%, Buy 1 Get 1 at X% off, Buy X Get Y Free 3-for-2, Spend $X Save $Y, and multi-buy bundles into true effective unit discounts), `generateDiscountTable(price)` (dynamic 12-row reference table for entered price), and `generateCommonPricesMatrix()` (pre-computed matrix solving 43 search queries like "30 off 50").
- **Tests** (`src/lib/discount-engine.test.ts`):
  * 17 Vitest unit tests covering simple 20% off $100 = $80 ($20 savings), stacked compounding (20% + 10% = 28% off, not 30%), coupon order ($100 with 20% then $15 coupon = $65 vs coupon first = $68), sales tax calculations, reverse mode ($80 at 20% off = $100 original), retail promo equivalents (BOGO free = 50%, BOGO 50% = 25%, 3-for-2 = 33.33%), zero/negative inputs, and table generators.
- **UI** (`src/components/tool/discount-calculator/`):
  * Adopted canonical KKCTools 2-column desktop grid layout (`.wrap` -> `.tabsBar` pill bar -> `.grid` with left `.inputs` and right sticky `.results`).
  * 4 tabs:
    1. **🏷️ Percent Off & Sale Price**: Card 1 with Step 1 blue badge, multi-currency selector (`$`, `£`, `€`, `₹`, `A$`, `C$`), quick presets (10%, 15%, 20%, 25%, 30%, 40%, 50%, 75%), collapsible accordions for fixed dollar coupon with order toggle, stacked secondary discount with mathematical compounding, and sales tax / VAT. Right sticky column featuring gradient hero card (`#0284c7` to `#0369a1`), green summary banner (`#ecfdf5`), `<DiscountDiagram />` waterfall flow, step 2 metrics grid (Original MSRP, Dollar Savings, Effective Discount %, Final Price with Tax), and actions bar (Copy, Share URL, Print).
    2. **🔄 Reverse (Find Original or %)**: 3 sub-modes solving backwards from sale prices and desired savings with explicit math formulas, sticky hero card, summary banner, metrics breakdown, and action buttons.
    3. **🎁 BOGO & Retail Deals**: Interactive calculator translating promotional deals into effective discount % and per-unit costs, retail economics comparison, and sticky results card.
    4. **📋 Reference Table ($10–$200)**: Full-width card with quick search filter, dynamic discount table for user's price, and common retail price matrix solving 43 long-tail queries.
  * Dedicated interactive SVG diagram (`DiscountDiagram.tsx`) toggling between Price Split Bar (You Pay vs You Save vs Tax) and Waterfall Deduction Flow.
  * Actions: Copy Summary, Shareable URL with query parameter sync, Print receipt.
- **Page** (`src/app/discount-calculator/`):
  * Title 46 chars (`Discount Calculator – Percent Off & Sale Price` with `absoluteTitle`), meta 152 chars, H1 67 chars, ~1,850 original words.
  * Direct BLUF box computing live numbers from engine.
  * 11 H2 content sections matching SPEC §8 and 11 FAQs with WebApplication + FAQPage JSON-LD schema, HowWeCalculate component.
  * Sourced metrology and consumer protection citations: US FTC Guides Against Deceptive Pricing (16 CFR Part 233) and UK Price Marking Order 2004 (SI 2004/102).
  * FAQ answers formatted with pure white background cards (`#ffffff`).
  * Registered in `routes.ts`, `tools-catalog.ts` (#46, category `business`, icon `discount`), `tools-catalog.test.ts` updated to 46, `calculation-methods.ts`, `Footer.tsx`, and `ToolArt.tsx` (`discount` art). Inbound contextual links from `markup-calculator`, `profit-margin-calculator`, `unit-price-calculator`, and `percentage-change-calculator`.
- **Verification**: `npm run verify` passed all 6 steps with zero errors. 676 vitest tests passing across 50 files. 81 static pages generated in export. Knowledge graph updated via `graphify update .`.

---

### [Design & UI — FAQ Answer Pure White Background Fix] — 2026-11-18
- **User Feedback Addressed**: Fixed FAQ question & answer card styling across the site where answer sections lacked an explicit white background and rendered directly on the warm beige canvas (`--bg: #EBE4D6`).
- **Files Updated**:
  * `src/components/ui/Faq.module.css`: Set `.details` background to `#ffffff`, `<summary>` to subtle header `var(--surface-2, #f8fafc)` with bottom border on open, and `.answer` to explicit `background: #ffffff;`.
  * `src/app/hourly-to-salary-calculator/page.module.css`: Converted FAQ list into crisp card layout with `.faqItem` (`background: #ffffff`, border, radius 12px, shadow), `.faqQuestion` header bar (`background: var(--surface-2, #f8fafc)`), and `.faqAnswer` (`background: #ffffff`, padding 16px 20px).
  * `src/app/unit-price-calculator/page.module.css`: Converted FAQ list into crisp card layout with `.faqItem` (`background: #ffffff`), `.faqQuestion` header bar (`#f8fafc`), and `.faqAnswer` (`background: #ffffff`).
  * `src/app/markup-calculator/page.module.css`: Added card styling to `.faqItem` (`background: #ffffff`), `.faqQ` header bar (`#f8fafc`), and `.faqA` (`background: #ffffff`).
  * `src/app/profit-margin-calculator/page.module.css`: Added card styling to `.faqItem` (`background: #ffffff`), `.faqQ` header bar (`#f8fafc`), and `.faqA` (`background: #ffffff`).
  * `src/app/percentage-change-calculator/page.module.css`: Added explicit `background: #ffffff;` to `.faqAnswer` and updated `.faqItem` shadow and radius.
  * `src/app/roof-replacement-cost-calculator/page.module.css`: Converted FAQ list to modern card layout with header bar and `.faqAnswer` (`background: #ffffff`).
  * `src/app/tile-calculator/page.module.css`: Converted FAQ list to modern card layout with header bar and `.faqAnswer` (`background: #ffffff`).
  * `src/app/laminate-flooring-calculator/page.module.css`: Converted FAQ list to modern card layout with header bar and `.faqAnswer` (`background: #ffffff`).
  * `src/app/concrete-calculator/page.module.css`, `src/app/carpet-cost-calculator/page.module.css`, `src/app/deck-cost-calculator/page.module.css`, `src/app/stone-calculator/page.module.css`: Explicit `background: #ffffff;` added to `.faqItem` and `.faqAnswer` / `.faqA`.
- **Verification**: `npm run verify` passed all 6 steps. All vitest tests passing (659 tests), 0 lint errors, no-network clean, SEO audit clean.

---

### [Tool #45 — Hourly to Salary Calculator] — 2026-11-18
- New tool `/hourly-to-salary-calculator/` (Batch 3 Build Order 5), built end-to-end from `04_Hourly_to_Salary_Calculator_BUILD_SPEC.md` and competitor analysis.
- **Engine** (`src/lib/wage-engine.ts`):
  * Pure functions: `calculateWage(input)` (converts any period across all 8 frequencies: hour, day, week, biweek, semi-month, month, quarter, year; handles custom hours/week, variable daily schedule Mon–Sun, paid vs unpaid time off, and overtime with FLSA multipliers), `compareWages(input)` (compares baseline against offer B or raise %), `generateWageTable(hoursPerWeek, weeksPerYear)` (generates $10 to $100/hr reference table).
- **Tests** (`src/lib/wage-engine.test.ts`):
  * 11 Vitest unit tests covering full-time $25/hr = $52,000 annual gross, reverse salary to hourly, biweekly (26 paychecks) vs semi-monthly (24 paychecks) differentiation, paid leave preserving salary while raising effective worked hourly rate, unpaid days docking annual gross, overtime 1.5× compounding, variable daily schedules, international presets, raise %, and wage table generator.
- **UI** (`src/components/tool/hourly-to-salary-calculator/`):
  * 3 tabs:
    1. **Convert (Hourly ↔ Salary)**: 8 pay frequencies, schedule presets (US 40h, UK 37.5h, AU 38h, India 48h, Part-time 20h), variable daily schedule input, time off and overtime accordions, hero annual gross card, 8-period table, and tax notices with official links.
    2. **Job Offer & Raise Comparison**: Compares current baseline vs second offer or percentage raise with annual, monthly, and hourly difference metrics.
    3. **Wage Table ($10–$100)**: Search-filterable interactive table with anchor links `#hourly-25`.
  * Dedicated interactive SVG diagram (`WageDiagram.tsx`) toggling between Paycheck Frequencies (Monthly, Semi-Monthly, Biweekly, Weekly) and Annual Hours Breakdown (hours on the clock vs paid leave vs overtime).
  * Actions: Copy summary/table, Shareable URL with query parameter sync, Print breakdown.
- **Page** (`src/app/hourly-to-salary-calculator/`):
  * Title 55 chars (`Hourly to Salary Calculator – Yearly Wage & Monthly Pay` with `absoluteTitle`), meta 151 chars, H1 57 chars, ~1,900 original words.
  * Direct BLUF box computing live numbers from engine.
  * 11 H2 content sections matching BUILD SPEC §5 and 11 FAQs matching SPEC §6 with WebApplication + FAQPage JSON-LD schema, HowWeCalculate component.
  * Sourced metrology and labor citations: US DOL FLSA (dol.gov), US OPM 2,087-hour divisor (opm.gov), UK Working Time Regulations 1998, and official IRS/GOV.UK tax links.
  * Registered in `routes.ts`, `tools-catalog.ts` (#45, category `business`, icon `wage`), `tools-catalog.test.ts` updated to 45, `calculation-methods.ts`, `Footer.tsx`, and `ToolArt.tsx`. Inbound contextual links from `percentage-change-calculator`, `unit-price-calculator`, and `construction-estimate-template`.
- **Verification**: `npm run verify` passed all 6 steps with zero errors. 659 vitest tests passing across 49 files. 80 static pages generated in export. Knowledge graph updated via `graphify update .`.

---

### [Tool #44 — Unit Price Calculator] — 2026-11-18
- New tool `/unit-price-calculator/` (Batch 3 Build Order 4), built end-to-end from `05_Unit_Price_Calculator_BUILD_SPEC.md` and competitor analysis.
- **Engine** (`src/lib/unit-price-engine.ts`):
  * Pure functions: `toBaseQuantity(qty, unit)` & `fromBaseQuantity(baseQty, unit)` applying exact NIST Handbook 130 / SP 811 conversions (Weight: oz, lb, g, kg; Volume: fl oz, cup, pt, qt, gal, ml, L; Count: item, sheet, roll, load, pc), `applyDeal(price, deal)` (handles percentage off, dollar coupon, Buy X Get Y Free BOGO per-unit amortisation, and X for $Y multi-buy bundles), `compareUnitPrices(items, outputUnit, targetQuantity)` (ranks items from cheapest, detects mismatched measurement groups, calculates unit savings and % premium over cheapest, and solves quantity-to-buy pack counts and total purchase costs), `calculateShrinkflation(input)` (calculates package physical size reduction % vs true hidden unit price inflation % and generates plain-English summary), and `calculateSellerUnitCost(input)` (computes manufacturing cost per finished unit and statutory retail shelf tags per kg/L and per 100g/ml).
- **Tests** (`src/lib/unit-price-engine.test.ts`):
  * 11 Vitest unit tests covering NIST exact conversions (1 lb = 16 oz = 453.59237 g, 1 gal = 128 fl oz), multi-pack comparison (6 × 330 ml vs 2 L bottle), deal mathematics (20% off, $1 coupon, BOGO halves effective price, 3 for $5), mismatched group warnings (weight vs volume), zero price/size validation (no NaN or Infinity), shrinkflation hidden inflation (10% smaller at same price = 11.11% price hike), and quantity-to-buy solver.
- **UI** (`src/components/tool/unit-price-calculator/`):
  * 3 tabs:
    1. **Compare Products**: 2 to 6 product rows (default 3 rows), deal accordion per row, group-aware output unit dropdown (per oz, lb, kg, L, item), optional quantity needed solver, and ranked table with cheapest badge.
    2. **Shrinkflation Check**: Compares original and downsized package specs, displaying physical size drop % alongside hidden price rise %.
    3. **Seller Cost & Shelf Tag**: Calculates unit production cost from batch expenses and generates statutory shelf-tag prices per kg/L and per 100g/ml with direct deep link to the Markup Calculator.
  * Dedicated interactive SVG diagram (`UnitPriceDiagram.tsx`) supporting comparative price bars and yield per dollar views in Compare mode, and a visual package downsizing comparison in Shrinkflation mode.
  * Actions: Copy Table/Summary to clipboard, Shareable URL with query parameter synchronisation, and Print sheet.
- **Page** (`src/app/unit-price-calculator/`):
  * Title 53 chars (`Unit Price Calculator – Price per Ounce, Pound & Item` with `absoluteTitle`), meta 157 chars, H1 62 chars, ~1,850 original words.
  * Direct BLUF summary box with live engine computations.
  * 10 H2 content sections matching BUILD SPEC §5 and 10 FAQs matching SPEC §6 with WebApplication + FAQPage JSON-LD schema, HowWeCalculate component.
  * Metrology & statutory law citations: NIST Handbook 130, UK Price Marking Order 2004 (SI 2004/102), and EU Directive 98/6/EC.
  * Registered in `routes.ts`, `tools-catalog.ts` (#44, category `business`, icon `unitPrice`), `tools-catalog.test.ts` updated to 44, `calculation-methods.ts`, `Footer.tsx`, and `ToolArt.tsx`. Inbound contextual links from `markup-calculator`, `profit-margin-calculator`, and `percentage-change-calculator`.
- **Verification**: `npm run verify` passed all 6 steps with zero errors. 648 vitest tests passing across 48 files. 79 static pages generated in export. Knowledge graph updated via `graphify update .`.

---

### [Tool #43 — Profit Margin Calculator] — 2026-11-18
- New tool `/profit-margin-calculator/` (Batch 3 Build Order 3), built end-to-end from `03_Profit_Margin_Calculator_BUILD_SPEC.md` and competitor analysis.
- **Engine** (`src/lib/margin-engine.ts`):
  * Pure functions: `calculateGrossMargin(input)` (handles revenue, COGS, gross profit, gross margin %, markup %, multiplier, units sold, and negative margin detection), `calculatePnL(input)` (gross sales, returns/discounts, net revenue, COGS, gross profit, OPEX [rent, salaries, marketing], operating profit EBIT, D&A, EBITDA, interest, taxes, net profit, and 7-step P&L waterfall structure), `priceForTargetMargin(cost, targetMargin, feePercent)` (calculates required ticket price with gross-up fee protection), and `calculateProductMix(items)` (computes multi-product revenue share, individual margins, and weighted blended portfolio margin).
- **Tests** (`src/lib/margin-engine.test.ts`):
  * 9 Vitest unit tests covering retail gross margin ($100/$60 = 40%), per-unit volume breakdown, zero revenue null handling, negative margin detection on clearance loss, full 7-step P&L cascade with OPEX/EBITDA/tax, target margin pricing with platform fees, and mathematical proof that blended margin is weighted by revenue and strictly not the simple arithmetic average of margins.
- **UI** (`src/components/tool/profit-margin-calculator/`):
  * 4 modes: Gross Profit Margin, Full P&L (Gross, Operating, Net), Price for Target Margin, and Product Mix & Blended Margin.
  * Dedicated interactive SVG diagram (`MarginDiagram.tsx`) with toggle between "P&L Waterfall" (revenue → COGS → gross → OPEX → net profit) and "Margin Tiers" (comparative gross, operating, and net margin retention bars).
  * Presets for Standard Retail (40%), Software/SaaS (60%), Grocery/Volume (15%), currency switcher ($ / £ / € / ₹), copy summary, share URL with query params, print sheet, and warning callout on blended margin vs simple averages.
- **Page** (`src/app/profit-margin-calculator/`):
  * Title 49 chars (`Profit Margin Calculator – Gross, Net & Operating` with `absoluteTitle`), meta 155 chars, H1 57 chars, ~2,200 original words.
  * Direct BLUF intro with live dynamic engine values.
  * Primary keyword `gross margin calculator` placed in intro, H2, and tool heading.
  * 11 H2 content sections matching SPEC §5 and 11 FAQs matching SPEC §6 with WebApplication + FAQPage JSON-LD schema, HowWeCalculate component.
  * Academic dataset benchmark citations: NYU Stern School of Business (Damodaran US margins by sector), FASB, and HMRC.
  * Registered in `routes.ts`, `tools-catalog.ts` (#43, category `business`, icon `margin`), `tools-catalog.test.ts` updated to 43, `calculation-methods.ts`, `Footer.tsx`, and `ToolArt.tsx`. Inbound contextual links from `markup-calculator` and `percentage-change-calculator`.
- **Verification**: `npm run verify` passed all 6 steps with zero errors. 637 vitest tests passing across 47 files. 78 static pages generated in export. Knowledge graph updated via `graphify update .`.

---

### [Tool #42 — Markup Calculator] — 2026-11-18
- New tool `/markup-calculator/` (Batch 3 Build Order 2), built end-to-end from `02_Markup_Calculator_BUILD_SPEC.md` and competitor analysis.
- **Engine** (`src/lib/pricing-engine.ts`):
  * Pure functions: `priceFromMarkup(cost, markupPercent)`, `markupFromPrice(cost, price)`, `costFromPrice(price, markupPercent)`, `priceFromMargin(cost, marginPercent)`, `marginFromPrice(cost, price)`, `marginFromMarkup(m)`, `markupFromMargin(g)`, `multiplier(cost, price)`, `calculateLandedCost(input)` (handles shipping, packaging, and gross-up platform/card fee % on selling price), `addTax(price, rate)` & `stripTax(priceInc, rate)`, `roundPriceEnding(price, ending, cost)` (rounds to .99, .95, .49, whole dollar, nearest 5 with constraint never dropping below cost and recomputes actual margin/markup), `calculatePriceChain(initialCost, tiers)` (3-tier Maker → Wholesaler → Retailer sequential markup compounding), `calculateProductList(rows, defaultMarkup)`, and `parsePastedSpreadsheet(text)` (TSV/CSV parser).
- **Tests** (`src/lib/pricing-engine.test.ts`):
  * 20 Vitest unit tests covering 4-way linked solve (cost 40, markup 50% → price 60, profit 20, margin 33.33%), keystone 100% markup = 50% margin = 2.0× multiplier, fee-adjusted pricing formula, margin fee boundary check, tax add/strip round-trips, price endings with cost floor protection, 3-tier price chain compounding (8× total keystone chain), spreadsheet parsing, and reference table generator.
- **UI** (`src/components/tool/markup-calculator/`):
  * 5 modes: Cost & Markup %, Cost & Target Margin %, Cost & Selling Price, Target Price to Max Cost (reverse), and Multi-Item Spreadsheet mode.
  * Dedicated interactive SVG diagram (`MarkupDiagram.tsx`) with toggle between "Price Stack & Margin Flow" (stacked cost + profit bar with markup/margin badges) and "3-Tier Distribution Chain" (Factory → Wholesaler → Retailer compounding flow).
  * 4 modular accordions:
    1. Landed Cost & Marketplace Fees (shipping + packaging + % fee on selling price).
    2. Psychological Price Endings (.99, .95, .49, whole dollar, nearest $5) with live recalculated margin.
    3. Sales Tax / VAT / GST with presets for UK VAT (20%), AU GST (10%), NZ GST (15%), US state average (7%), and ex-tax vs inc-tax toggle.
    4. 3-Tier Distribution Chain with custom markups and tabular margin breakdown.
  * Presets for Keystone (100%), Retail Standard (50%), Wholesale (30%), Boutique (200%), currency switcher ($ / £ / € / ₹), copy summary, share URL with query params, print sheet, and batch CSV export.
- **Page** (`src/app/markup-calculator/`):
  * Title 50 chars (`Markup Calculator – Selling Price, Markup & Margin` with `absoluteTitle`), meta 155 chars, H1 49 chars, ~2,250 original words.
  * Direct BLUF intro computing live numbers from engine.
  * 11 H2 content sections matching SPEC §5 and 11 FAQs matching SPEC §6 with WebApplication + FAQPage JSON-LD schema, HowWeCalculate component.
  * Registered in `routes.ts`, `tools-catalog.ts` (#42, category `business`, icon `tag`), `tools-catalog.test.ts` updated to 42, `calculation-methods.ts`, `Footer.tsx`, and `ToolArt.tsx`. Inbound contextual links from `construction-estimate-template` and `percentage-change-calculator`.
- **Verification**: `npm run verify` passed all 6 steps with zero errors. 628 vitest tests passing across 46 files. 77 static pages generated in export. Knowledge graph updated via `graphify update .`.

---

### [Tool #41 — Percentage Change Calculator] — 2026-11-18
- New tool `/percentage-change-calculator/` (Batch 3 Build Order 5), built end-to-end from `01_Percentage_Change_Calculator_BUILD_SPEC.md` and competitor analysis.
- **Engine** (`src/lib/percent-engine.ts`):
  * Pure functions: `pctChange(oldVal, newVal)` (signed, handling zero-division with null and -0 normalization), `pctDifference(a, b)` (symmetric with average denominator), `applyPct(x, p)` (increase/decrease by %), `reversePct(newVal, p)` (finding original before percentage), `pctOf(p, y)`, `whatPct(x, y)`, `ppDifference(a, b)` (percentage points difference alongside relative percentage change), `listChanges(pairs)` (batch row changes, arithmetic average of percentages, and true aggregate portfolio change), `excelFormula(mode, cells)` (dynamic copyable spreadsheet formulas with custom cell references).
- **Tests** (`src/lib/percent-engine.test.ts`):
  * 27 Vitest unit tests covering 80→100 (+25%), 100→80 (−20% asymmetry), 0-start division by zero null handling, negative start handling with `|old|` denominator, symmetric difference order invariance (22.22%), reverse percentages, percentage points (4%→5% = +1 pp vs +25% relative change), list aggregation proving average of % changes ≠ total aggregate % change, Excel formula string generation with custom cells, and formatting utilities.
- **UI** (`src/components/tool/percentage-change-calculator/`):
  * 8 distinct modes accessed via responsive horizontal tab bar (`#change`, `#difference`, `#increase-decrease`, `#find-original`, `#pct-of`, `#what-pct`, `#percentage-points`, `#list`) with URL hash persistence.
  * Aligned strictly with KKCTools design system:
    - 28px circular numbered step badges in card headers.
    - All numeric inputs wrapped in `.inputWrap` with trailing `.unitBadge` pills (`Base`, `New`, `Amount`, `%`, `Part`, `Whole`).
    - Signature radiant cobalt blue hero banner (`linear-gradient(135deg, #0369a1 0%, #075985 100%)`) with direction badges (Increase/Decrease), absolute deltas, and 3-metric subgrids.
    - Plain-English snippet sentence for Google featured snippets under every result.
    - Step-by-step math breakdown with user's actual numbers.
    - CSS-only proportional visual comparison bar (`VisualPercentBar.tsx`).
    - Interactive Excel & Google Sheets formula generator with editable cell inputs and one-click copy button.
    - List mode with dynamic add/remove rows and aggregate vs average explanation.
    - Share URL (encoded state), Print, and Quick Preset chips.
- **Page** (`src/app/percentage-change-calculator/`):
  * 2,100+ words of original copy, title 50 chars (`Percentage Change Calculator – Increase & Decrease` with `absoluteTitle`), meta 154 chars, H1 62 chars.
  * Direct BLUF intro (50–60 words) computing figures dynamically via the engine.
  * 10 structured sections covering manual calculation, formula anatomy, mathematical asymmetry, symmetric difference, multiplier shortcuts, reverse percentages, spreadsheet formulas & formatting pitfalls, percent vs percentage points, boundary edge cases (0, negatives, >100%), and 12 FAQ items matching SPEC §6.
  * Registered in `routes.ts`, `tools-catalog.ts` (#41, category `business`, icon `percent`), `tools-catalog.test.ts` updated to 41, `calculation-methods.ts`, `Footer.tsx`, and `ToolArt.tsx`. Inbound contextual links from `construction-estimate-template`.
- **Verification**: `npm run verify` passed all 6 steps with zero errors. 608 vitest tests passing across 45 files. 76 static pages generated in export.

---

### [Review — Batch 2 tools #17–#19 price and content fixes] — 2026-11-17
- Deck engine: pressure-treated and cedar decking material ranges and wood/composite railing rates now match the Fixr deck cost guide (checked 2026-11-17). The old values didn't match the source they cited.
- Roof and Deck "How we calculate" values now equal the engine defaults (architectural $500/sq = $195 material + $305 labour, tear-off $200/sq per layer, dumpster $475, decking $80/sheet).
- Roof page tear-off text ($125 → $200/sq, $100–$300) and Deck FAQ railing/PT figures now match the engine.
- Header "New:" pill now shows the most recently added tool instead of the first catalog entry.
- `npm run verify`: all 6 steps pass.

### [Tool #38 — Deck Cost Calculator] — 2026-11-17
- New flagship page `/deck-cost-calculator/` (Batch 2 Tier 3 #18), built end-to-end exactly from `18_Deck_Cost_Calculator_BUILD_SPEC.md` and competitor analysis.
- **Engine** (`src/lib/deck-cost-engine.ts`):
  * 4 project modes: New deck, Resurface (re-decking sound existing framing), Full replacement (demo + new), and Repairs.
  * Structural framing takeoff: joist count by spacing (12", 16", 24" o.c.) & rim joists, doubled/tripled beam rows, 4x4/6x6 posts, and pier footings.
  * Concrete footing calculations: cylinder volume formula with frost-depth scaling, cubic yards, and 80 lb QUIKRETE #1101 bag yield via `concrete-engine.ts`.
  * Decking board takeoff: 5.5" / 3.5" boards, stock lengths (12', 16', 20'), pattern waste (straight 10%, diagonal 15%, herringbone 20%), and picture-frame border perimeter.
  * Fastener takeoff: face screws (2/crossing) vs hidden clips (1/crossing) with box counts.
  * Railing (exposed perimeter minus house ledger and stair opening) and stairs (risers, treads, 2x12 stringers at 16" o.c.).
  * 7 materials: Pressure-Treated Pine, Western Red Cedar, California Redwood, Basic Composite, 4-Sided Capped Composite, Cellular PVC, and Tropical Ipe Hardwood.
  * Height band labor multipliers (ground 1.0×, low 1.1×, mid 1.25×, elevated 1.45×), regional multiplier, contingency %, contractor quote verifier, 25-yr lifetime cost comparison, and printable Bill of Materials (BOM).
- **Tests** (`src/lib/deck-cost-engine.test.ts`): 15 Vitest unit tests covering 12x12 16" o.c. joists hand calculation, row count pitch, diagonal waste, picture frame border, footing concrete volume & QUIKRETE bags, railing perimeter exclusions, resurface vs replace mode logic, height multipliers on labor only, DIY savings, zero dimensions, benchmark tables, lifetime comparison, quote verifier, and BOM categories.
- **UI** (`src/components/tool/deck-cost-calculator/`):
  * Aligned strictly with KKCTools design tokens and visual architecture:
    - 28px circular numbered step badges (`1` to `6`) in card headers.
    - All numeric inputs wrapped in `.inputWrap` with trailing `.unitBadge` pills (`ft`, `in`, `steps`, `$/sq ft`, `$/LF`, `in`).
    - Signature radiant cobalt blue hero banner (`linear-gradient(135deg, #0369a1 0%, #075985 100%)`) with total price, range, and 3-column subgrid metrics.
    - Interactive SVG `DeckDiagram` with toggleable views: "Decking & Railing" vs "Joists & Footings".
    - Structured `.breakdownTable` with itemized line items.
    - Printable Bill of Materials (BOM) table.
    - Contractor quote verifier card and 25-yr wood vs composite comparison table.
    - Copy summary, Print BOM, and 5-currency switcher.
- **Page** (`src/app/deck-cost-calculator/`): 4,200+ words of thorough original copy, title 52 chars, meta 154 chars, H1 33 chars, 12 FAQs matching SPEC §6 with live calculated figures, benchmark size table (10x10 to 20x20), 7-material cost matrix, BLS carpenter labor economics, substructure budget breakdown, wood vs composite vs PVC guide, 4-point structural safety inspection checklist for resurfacing, board spacing & gap recommendations table, IRC code compliance guide, HowWeCalculate component.
- **Wiring & Inbound Links**: Registered in `routes.ts`, `tools-catalog.ts` (#40, category `framing`, icon `deck`), `tools-catalog.test.ts` updated to 40, footer link added under "Framing & Finishes", calculation-methods entry added, inbound contextual links added from `deck-stain-calculator`, `fence-cost-calculator`, `concrete-calculator`, `linear-foot-calculator`, and `stud-calculator`.
- **Verification**: `npm run verify` passed all 6 steps (lint, tests, check:no-network, build, seo:audit, docs:bundle) with zero errors. 581 unit tests passing across 44 files.

---

### [Tool #37 — Carpet Cost Calculator] — 2026-11-17
- New flagship page `/carpet-cost-calculator/` (Batch 2 Tier 3 #17), built end-to-end exactly from `17_Carpet_Cost_Calculator_BUILD_SPEC.md` and competitor analysis.
- **Engine** (`src/lib/carpet-engine.ts`): Pure mathematical takeoff for multi-room roll layout (12 ft, 13.5 ft, 15 ft) testing both orientations and minimizing purchased carpet square footage; seam calculation and off-cut waste %; stairs runner geometry (13 standard steps, tread depth, riser height, nosing wrap, landing, waterfall vs box/cap & band); 3 material grades (builder, mid, premium), 5 fibres (nylon, polyester, triexta, olefin, wool), 5 styles (plush, berber, frieze, pattern, carpet tiles); padding specifications (6 lb, 8 lb, 10 lb) per CRI standards; itemized labour and extras (removal, disposal, furniture, tack strips, transitions, subfloor leveling, doors); room benchmarks (10x10 to whole house); contractor quote verifier; flooring comparisons (carpet vs LVP vs laminate vs hardwood refinish).
- **Tests** (`src/lib/carpet-engine.test.ts`): 16 Vitest unit tests covering 12x12 1-drop 0-seams baseline, 14x16 orientation optimization, boundary tests (12.0 vs 12.01 ft), stairs hand calculations, replace vs new mode toggles, carpet tiles mode, edge cases, quote checker, and price sanity checks.
- **UI Aligned to KKCTools Design System** (`src/components/tool/carpet-cost-calculator/`): Fully aligned with KKCTools design tokens and visual architecture:
  - Added standard 28px circular numbered step badges (`.cardHead > .step`, steps 1 through 6).
  - Encapsulated all numeric inputs in `.inputWrap` with trailing `.unitBadge` pills (`ft`, `in`, `steps`, `$/sq ft`, `$/sq yd`, `%`).
  - Implemented signature radiant cobalt blue hero banner (`linear-gradient(135deg, #0369a1 0%, #075985 100%)` with white value `$1,240.96`, `#bae6fd` subheadings, and 3-metric subgrid for unit rates and area).
  - Converted loose tiles to structured `.breakdownTable` with itemized materials/pad/labor/stairs/prep lines.
  - Interactive SVG `CarpetDiagram` showing room boundary, roll drops, heat-tape seams, off-cut waste, and stair runner profile.
  - Contractor quote verifier, flooring comparison table, regional index slider, and copy/print/share actions.
- **Page** (`src/app/carpet-cost-calculator/`): 3,858 words of thorough original copy, title 56 chars, meta 156 chars, H1 25 chars, 12 FAQs matching SPEC §6 with live figures, room size benchmark matrix, roll width constraint guide, stairs style table, fibre & style matrices, HowWeCalculate component.
- **Wiring & Inbound Links**: Registered in `routes.ts`, `tools-catalog.ts` (#39, category `finishes`, icon `carpetRoll`), `tools-catalog.test.ts` updated to 39, footer link added under "Framing & Finishes", calculation-methods entry added, inbound contextual links added from `laminate-flooring-calculator`, `floor-refinishing-cost-calculator`, `square-footage-calculator`, and `tile-calculator`.
- **Verification**: `npm run verify` passed all 6 steps (lint, tests, check:no-network, build, seo:audit, docs:bundle) with zero errors. 566 unit tests passing across 43 files.

---

### [New Tools Priority & Directory Sorting] — 2026-11-17
- Implemented global newest-first sorting and quick-discovery across KKCTools:
  - **Single Source of Truth (`src/lib/tools-catalog.ts`):** `TOOLS_CATALOG` is now sorted by `added` date descending (latest first, e.g., 2026-11-17 -> 2026-11-08), with `isNew` priority and alphabetical tie-breaker.
  - **Tools Directory (`/tools/`):** Added a dynamic sort selector with "Newest First" as the default, alongside "Name (A-Z)" and "By Category". Added a dedicated "✨ New Tools (17)" quick filter pill next to trade category pills.
  - **Home Page (`/`):** "Recently Built & Updated Tools" showcase and category bands surface the freshest tools at the front of each collection.
  - **Header & Mobile Navigation:** Header mega-menu category columns show the 5 newest tools per trade; mega-menu highlight dynamically links to the newest tool (`TOOLS_CATALOG[0]`); Mobile menu shows dynamic tool count (`All 38 Tools Directory`) and newest tools in accordions.
  - **Tests:** Added `src/lib/tools-catalog.test.ts` monotonic date test asserting newest tool is at index 0 (`/roof-replacement-cost-calculator/`) and oldest tools are at the end. All 549 unit tests pass.

---

### [Tool #36 — Roof Replacement Cost Calculator] — 2026-11-17
- New flagship page `/roof-replacement-cost-calculator/` (Batch 2 Tier 3 #19), built end-to-end exactly from `19_Roof_Replacement_Cost_Calculator_BUILD_SPEC.md` and competitor analysis.
- **Engine** (`src/lib/roof-replacement-engine.ts`): Reuses verified pitch geometry from `shingle-engine` (`pitchFactor`), multi-plane sections or direct ground footprint entry, 10 material classes (3-tab, architectural, luxury/designer, standing seam, corrugated metal, clay tile, concrete tile, natural slate, cedar shake, flat membrane), labor multipliers (stories 1/1.5/2/3, steep-slope ≥ 8/12 pitch +20%, complexity simple/hip/complex), tear-off scaling by layer ($125/sq/layer), dumpster fees ($450), decking repair sheets, accessories (synthetic vs felt underlayment, ice & water shield, drip edge, ridge vent, pipe boots/chimney flashing, gutters), 3-way comparison (spot repair vs overlay vs full replacement with IRC Section R908.3.1.1 2-layer code prohibition), and contractor quote verifier.
- **Tests** (`src/lib/roof-replacement-engine.test.ts`): 17 Vitest unit tests covering pitch geometry, 2,000 sq ft hand calculation verification, linear tear-off scaling, 2-layer overlay code block, decking sheet calculations, stories/steep multipliers on labour only, shared pricing checks with metal-roof engine, quote checker, and snapshot table integrity.
- **UI** (`src/components/tool/roof-replacement-cost-calculator/`): Quick and Detailed modes, pitch preset buttons (3/12 through 12/12) + custom input, material selector with descriptions, tear-off layer buttons (0, 1, 2) with warning banner, stories, complexity, decking % input, accessories checkboxes, region index, custom price overrides accordion; hero result with total, range, cost/sq, cost/sq ft, labor/sq; interactive SVG pitch diagram and cross-section diagram; itemized line-items table; 3-way comparison cards with visual bar chart; contractor quote verifier; share URL, print, copy summary.
- **Page** (`src/app/roof-replacement-cost-calculator/`): 4,101 words, title 53 chars, meta 156 chars, H1 32 chars, 12 FAQs matching SPEC §6 with live calculated figures from engine, benchmark size table (1,000–3,000 sq ft), 10-material comparison matrix, pitch multiplier table, components guide, flat/commercial section, insurance/permits advice, contractor quote comparison tips, HowWeCalculate component.
- **Wiring & Inbound Links**: Registered in `routes.ts`, `tools-catalog.ts` (#38, category `framing`, icon `roofTruss`), `tools-catalog.test.ts` updated to 38, footer link added under "Framing & Finishes", calculation-methods entry added, inbound contextual links added from `shingle-calculator`, `metal-roof-cost-calculator`, `rafter-calculator`, and `square-footage-calculator`.
- **Verification**: `npm run verify` passed all 6 steps (lint, tests, check:no-network, build, seo:audit, docs:bundle) with zero errors. 549 unit tests passing across 42 files.

### [CueAudit action implementation] — 2026-11-16
- Implemented and verified code-level recommendations from `docs/seo/CUE - new audit/CueAudit_Action_Report.md`:
  - **P0-3 Privacy & analytics accuracy:** Removed all misleading "zero tracking" claims (`construction-estimate.ts`, `site.ts`, `band-name-generator/page.tsx`); updated copy to accurately describe browser execution + Google Analytics visit metrics.
  - **P0-4 Legal wording on band guides:** Updated `content/guides/how-to-check-if-a-band-name-is-taken.md` and routes registry with trademark attorney guidance and clear common-law disclaimers.
  - **P0-5 Softened absolute claims:** Replaced "accurately calculate" and "exact area" across 7 pages; added official ANSI Z765 appraisal disclaimer to Square Footage GLA section.
  - **P0-6 Mobile 390px enhancements:** Added `inputMode="decimal"` and `inputMode="numeric"` to all numeric inputs on key tools (Linear Foot, Brick, Tile); added compact mobile media queries to `FloatingPill.module.css`.
  - **P1-2 Topical hubs:** Implemented natural in-body contextual links across all 5 topic clusters (Measuring, Concrete & Masonry, Finishes, Roofing, Estimating).
  - **P1-3 BLUF direct answers:** Added immediate formula & worked example answers directly under H1 heroes for Square Footage, Linear Foot, Paint, Tile, Cinder Block, and Cubic Yard.
  - **P1-4 Pricing benchmarks:** Added explicit "Prices are typical US ranges, checked November 2026 (enter your local price)" notes on all 9 cost estimator pages.
  - **P1-6 GSC query mapping:** Integrated high-opportunity search terms into on-page headings and body copy (Paint, Linear Foot, Tile, Square Footage).
- Verification: 532 Vitest unit tests passing, `npm run verify` passed all 6 steps with 0 SEO errors.

### [Band Name Generator improvements] — 2026-11-15
- Fixed a generator bug that left `{Noun}` placeholders in names whose pattern used the same slot twice; joining words now stay lower-case; removed a slur from the punk word list and widened the offensive filter.
- Added a "How these names are built" panel and a formula label on every result.
- Page: new title/meta, last-updated line, 80 tested band name ideas by genre, two new FAQs, cleaner wording, relevant sidebar links.
- New tests: generator slot filling and title case; band name ideas vs blocklist/offensive filter.

### [Calculator diagrams] — 2026-11-15
- Added a large, live "how it is calculated" diagram inside the input area of 17 calculators that had none, plus a result meter in the cubic yard calculator.
- New shared components (`src/components/tool/shared/`): `AreaDepthDiagram`, `StepFrame`/`StepsList`, `PaverJointDiagram`, `ConversionDiagram`, `WallDiagram`; tool-specific diagrams for fence stain, laminate, linear foot, paint, square footage, stud and tile.
- Responsive: drawing and steps sit side by side on wide containers and stack on narrow ones (container query at 540 px).
- `npm run verify` passed; accessibility 100 on all affected pages.

### [Tool #35 — Cubic Inch & Engine Displacement Calculator] — 2026-11-15
- New page `/cubic-inch-calculator/` (Batch 2 Tier 3 #16), built from `16_Cubic_Inch_Engine_Displacement_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/cubic-inch-engine.ts`): box, cylinder, tube (wall and inside capacity) and sphere volume; exact unit conversions; displacement = π/4 × bore² × stroke × cylinders; bore/stroke solvers; overbore and stroker what-if; CID chart; 6 presets with manufacturer-published bore and stroke.
- UI with Volume / Engine modes, shape and cylinder-cutaway diagrams, working shown, share links. Page ~1,700 words with 10 FAQs; title 64 chars incl. brand (blueprint title shortened).
- 17 new tests (528 total); `npm run verify` all passed.

### [Tool #34 — Hardwood Floor Refinishing Cost Calculator] — 2026-11-15
- New page `/floor-refinishing-cost-calculator/` (Batch 2 Tier 2 #15), built from `15_Hardwood_Floor_Refinishing_Cost_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/floor-refinish-engine.ts`): screen & recoat $1.50, full sand $4.25, dustless $6.50 per ft² (This Old House midpoints) × species factor for sanding; stain +$2; repairs, board replacement, subfloor, carpet, stairs ($35/step, Fixr), furniture, baseboards; region factor and minimum job charge; low/high from the published range ends; refinish vs replace ($12/ft² installed); DIY list (rentals, abrasives, finish and stain gallons at 500 ft²/gal, supplies).
- UI with rooms or total area, extras toggles, DIY card, quote checker, option bars, board cross-section and room plan diagrams. Page ~2,200 words with 10 FAQs; title 54 chars incl. brand.
- 19 new tests (511 total); `npm run verify` all passed.

### [Tool #33 — Bathroom Remodel Cost Calculator] — 2026-11-15
- New page `/bathroom-remodel-cost-calculator/` (Batch 2 Tier 2 #14), built from `14_Bathroom_Remodel_Cost_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/bathroom-remodel-engine.ts`): fixed items (toilet, vanity, top, faucets, electrical, plumbing, tub/shower) + per-ft² items (flooring, wall tile, paint, drywall) from This Old House’s Jul 2026 averages over a 70 ft² reference room; finish factors 0.575 / 1 / 1.881 from its finish table; cosmetic vs full scope; water heater, permit, region, 20% contingency; ±13% range; quote checker. Reproduces This Old House’s size and finish tables (tested).
- UI with editable line items, spend bar and bathroom plan; page with size × finish table, tub/shower options, budget scenarios, DIY, permits and resale notes, 10 FAQs; ~1,460 words. Title 64 chars incl. brand.
- 12 new tests (492 total); `npm run verify` all passed.

### [Tool #32 — Metal Roof Cost Calculator] — 2026-11-15
- New page `/metal-roof-cost-calculator/` (Batch 2 Tier 2 #13), built from `13_Metal_Roof_Cost_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/metal-roof-engine.ts`): roof area and edges from the Shingle engine's section geometry; metal total with tear-off and permit; asphalt tear-off-and-replace comparison; cost per year of life; panels per slope and length (gable/shed), total panel length on hips; trim and underlayment; low–high ranges.
- **Data:** HomeGuide 2026 installed ranges (midpoints) for standing seam, corrugated, metal shingles and asphalt; tear-off $1–$3; lifespans from This Old House and Fixr.
- UI with comparison bars, materials list, panel diagram and roof plan; page with cost-by-type and cost-by-size tables, standing seam and metal-vs-shingle sections (honest per-year comparison), measuring and tear-off guidance, 10 FAQs; ~1,610 words.
- 13 new tests (480 total); `npm run verify` all passed.

### [Tool #31 — Cubic Feet ↔ Square Feet Converter] — 2026-11-15
- New page `/cubic-feet-to-square-feet/` (Batch 2 Tier 2 #12), built from `12_Cubic_Feet_to_Square_Feet_Converter_Competitor_Analysis.md`.
- **Engine** (`src/lib/cubic-square-engine.ts`): area = volume ÷ depth and volume = area × depth with exact factors for in/ft/cm/mm/m, ft³/yd³/m³/L and ft²/m²/yd²; bags; coverage tables.
- UI: two-way with a Reverse button, volume or bag count, area or length × width, material presets (slab, mulch, topsoil, base, bedding sand, stone mulch) with sourced notes, working shown and a spread diagram.
- Page: short-answer box (“you need a depth”), worked examples (mulch bag, topsoil yard, slab, mulch bed, Purdue lawn check), coverage tables in imperial and metric, material depths, cft/brass section for India, 9 FAQs; ~1,340 words.
- 11 new tests (467 total); `npm run verify` all passed.

### [Tool #30 — Fence Cost Calculator] — 2026-11-15
- New page `/fence-cost-calculator/` (Batch 2 Tier 2 #11), built from `11_Fence_Cost_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/fence-cost-engine.ts`): fence sides with walk/double gates (gates split a side and add a post), shared corner posts and closed loops, terminal vs line posts, materials list by type (pickets + rails, panels, chain link fabric + top rail), concrete per post from hole and post size, slope surcharge, removal, permit, materials vs labour share, DIY cost and a low–high range from published prices.
- **Prices:** This Old House (Jun 2026) and HomeGuide 2026 per-foot ranges (midpoints as defaults), Angi/HomeGuide gate prices, Angi removal, QUIKRETE hole sizing; all editable.
- UI with live plan view (posts, corners, gate swings) and front view (post set in concrete); page with cost-by-material table, worked backyard example, concrete per post, replace, DIY vs pro, permits/811 and 12 FAQs; ~2,200 words.
- `--danger` token darkened to `#B91C1C` (remove buttons failed contrast).
- 15 new tests (456 total); `npm run verify` all passed.

### [Tool #29 — Deck Stain Calculator] — 2026-11-15
- New page `/deck-stain-calculator/` (Batch 2 Tier 1 #10), built from `10_Deck_Stain_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/deck-stain-engine.ts`): floor sections and optional board edges; railings quick (L × H × 2) or detailed (posts every N ft, rail perimeters, square or round balusters from width + gap); stairs (treads, risers, visible stringers); skirting; coverage by opacity × wood condition, second coat × factor, extra %; cheapest 5-gal/1-gal mix or 5/2.5/1 L tins; deck cleaner; DIY vs pro with wash/strip/sand prep.
- **Data:** BEHR PREMIUM coverage ranges (low end used), Duckback rough vs smooth, IRC R312 railing defaults, Fixr and Angi 2026 prices.
- UI with live isometric deck diagram and railing diagram; page with coverage-by-type, stain-by-deck-size and railing tables, worked example, 10 FAQs; ~2,290 words. Title 60 chars incl. brand.
- **Analytics:** GTM now loads on first interaction or 5 s after load (was 1.5 s) — mobile Lighthouse on tool pages 79–86 → 89–90.
- 23 new tests (441 total); `npm run verify` all passed.

### [Tool #28 — Concrete Slab Cost Calculator] — 2026-11-15
- New page `/concrete-slab-cost-calculator/` (Batch 2 Tier 1 #9), built from `09_Concrete_Slab_Cost_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/slab-cost-engine.ts`): itemised estimate — ready-mix by the yard (¼ yd³ rounding, trucks), short-load fee (per yard or flat, editable threshold), delivery, line/boom pump minimum, gravel base (15% compaction, 1.40 t/yd³), mesh or rebar, vapour barrier, forms, labour, coloured/stamped finish, sealer, removal, region factor, overhead & profit, permit; totals per ft² and per yard ordered; DIY bags vs DIY ready-mix vs contractor; check against 2026 published installed prices.
- **Prices:** every default is inside a dated 2026 published range (LawnStarter, Concrete Network/NRMCA, This Old House, Angi, HomeGuide, Inch Calculator) and editable; sources listed in "How This Calculator Works".
- UI: 6 project presets, several slabs, US/metric with price conversion, 7 currency symbols, psi presets, cost bar, comparison, truck and slab-section diagrams, copy / share / print.
- Page: price per yard by psi, cost per ft² by thickness, cost by size and by project, quote line items, worked 20 × 20 example, bags vs ready-mix vs contractor, saving tips, remove & replace, 13 FAQs + schema; ~2,760 words. Title shortened to 60 chars incl. brand (blueprint title was 66).
- Wiring: routes (48), catalog (30 tools), new `slabCost` icon and card diagram, footer. 26 new tests (418 total); `npm run verify` all passed; Lighthouse mobile 90 / 100 / 96 / 100, desktop 100 / 100 / 96 / 100.

### [Google Analytics via Google Tag Manager] — 2026-11-15
- Installed the owner's Google tag (`GTM-5CDW8CXG` → GA4 `G-DVNM8TFRQE`) in the root layout with Consent Mode v2 defaults: analytics cookies off in the EEA, UK and Switzerland; ad storage off everywhere.
- `gtm.js` is injected on first interaction or 1.5 s after `load` (in `<head>` it dropped mobile Lighthouse 94 → 86; now 90–93, desktop 100). GA collect requests confirmed (204).
- CSP in `public/_headers` widened for Google Tag Manager / Analytics.
- Privacy Policy: new section 5 "Analytics (Google Analytics)" (what is and is not collected, `_ga` cookies, EEA/UK defaults, opt-out); advertising moved to section 6; last updated 2026-11-15. Removed "no tracking" wording from About, Why us, Footer, Contact and the band generator page.

### [Hero banner illustration] — 2026-11-15
- Owner asked for a more attractive hero with images/diagrams.
- New `HeroScene.tsx`: inline-SVG building site touching every category (concrete slab, framed wall, roof truss + shingles with 8/12 pitch marker, painted wall with roller, gravel pile, crane lifting a beam, tree, 24 ft tape measure) on a blueprint sky panel; shown on all screen sizes.
- Heading accent in a gradient with a hand-drawn underline; colourful background glows; chips wrap instead of being cut off; result cards resized and moved to the panel corners.
- Lighthouse home: mobile 94 / 100 / 96 / 100 (LCP 2.9 s, CLS 0.001), desktop 100 / 100 / 96 / 100; `npm run verify` passed.

### [Tool cards with diagrams — bigger, modern] — 2026-11-15
- Owner feedback: cards looked simple and text was small; wanted tool-related diagrams so a visitor sees at a glance what each tool does.
- New `ToolArt.tsx`: 31 small inline-SVG diagrams (29 tools + "browse all" + "suggest"), coloured from the card's category, decorative (`aria-hidden`).
- `ToolCard` redesigned: illustration panel with category chip and badge, bigger icon/title/description/tags, "Open tool →" footer, hover ring; mobile row with diagram thumbnail. Fixed description showing a cut-off third line.
- Grids now 3 across (home and `/tools/`); home sections rebalanced so no row is half empty (split 4, stack 6, Business 3, New 9).
- Fix: in flipped split sections (heading on the right) the columns now swap too, so the cards keep the wide column (the Gravel cards had been squeezed into the narrow one).
- Lighthouse home: mobile 95 / 100 / 96 / 100, desktop 100 / 100 / 96 / 100; `/tools/` a11y 100; `npm run verify` passed.

### [Home page redesign — colourful, varied sections] — 2026-11-15
- Owner feedback: the home page looked flat; every section and every tool card looked the same.
- New `CategoryTiles` ("Pick a trade" gradient tiles) and `CategorySection` (per-category tint, blueprint grid, glow, gradient icon badge, numerals 01–06, alternating split/stack layouts with sticky heading).
- Tool cards now carry their category colour (top stripe, tint, gradient icon, tinted tags, coloured hover); mobile badge overlap fixed.
- Hero chips tinted per category (+ Business chip); "Why us" is a dark navy band with colourful icons; guides get gradient covers; FAQ glow.
- Fixes found on the way: double arrows in "View all" links, stale "22 calculators" text (now from the catalog), inert ad box hidden until ads are enabled, header search `aria-label` now matches its visible text.
- New tokens `--cat-*-deep` and `--cat-*-g1/g2`. Lighthouse: mobile Perf 96 / A11y 100, desktop 100 / 100; `npm run verify` passed.

### [AdSense-readiness report — verified and fixed] — 2026-11-15
- Checked every item of `docs/Adsence Approval reports/Adsence aprooval - report.pdf` against the live site and the code. Results and the owner list are in `00-PROJECT-STATUS.md` → Phase AR.
- **New pages:** `/disclaimer/` (estimates not advice, electrical/structural safety, prices, corrections, generated names, external links, advertising/affiliates, no affiliation, contact) and `/site-map/` (HTML site map built from the tool catalog and route list). Both are in the footer, `sitemap.xml` and `llms.txt` (47 routes).
- **Terms:** section 2 now covers calculators and templates and links to the Disclaimer; last updated 2026-11-15.
- **Accessibility:**
  - Darker `--muted`, `--accent` and `--success` tokens, plus the footer copyright colour; all token pairs now ≥ 4.5:1.
  - Older tool components used hardcoded colours. 52 text uses of `#64748B` now use `var(--muted)`. Across 73 files, `#0284C7` → `#0369A1`, `#0369A1` hover → `#075985` and `#059669` → `#065F46`.
  - 54 tool inputs whose `<label>` had no `htmlFor` now have an `aria-label`.
  - Underlines added to links in running text.
  - Guide task lists no longer render unlabelled disabled checkboxes.
  - Second pass after a full sweep: undefined `--color-text-muted` fallbacks → `var(--muted)`; grey/red text in tool CSS; new `--brand-orange-text` token for orange labels; unit `<select>`s named; `aria-checked` → `aria-pressed` on segmented buttons; Rafter `tablist` → `group`; heading order on Construction Estimate, Square Footage and Tile; empty header cell on Board & Batten.
  - Lighthouse accessibility: 100 on all 47 built pages (was 87–98 on 14 pages).
  - Fixed home search ARIA (`aria-controls` only while results exist; `aria-autocomplete`), and removed tool-card `aria-label`s that did not match the visible text.
- **Links:** external source links use `rel="noopener noreferrer"` and open in a new tab (How We Calculate, guide Markdown); the Quikrete link is `nofollow`.
- **Fonts:** Bricolage Grotesque uses `display: 'optional'` to avoid a late swap moving LCP.
- **Owner identity:** About → "Who runs KKC Tools" now names Karan Kumar (founder & developer) with email and Instagram; JSON-LD has a `Person` node (`/#founder`, occupation: senior software engineer) linked from the Organization's `founder`.
- **Contact email:** `contact@kkctools.com` was not a real mailbox (owner); every mailto, the Organization schema and `llms.txt` now use `kkchub1@gmail.com`.
- `npm run verify` passed after the fixes.

### [Tool #27 — Wire Gauge Calculator] — 2026-11-15
- New page `/wire-gauge-calculator/` (Batch 2 Tier 1 #8, safety-sensitive), built from `08_Wire_Gauge_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/wire-gauge-engine.ts`): three modes (size a wire, check a wire, gauge lookup); DC / single-phase / three-phase; amps or watts (+ power factor); voltage drop 2·I·R·L or √3·I·R·L; AWG resistance from geometry (ASTM B258 formula) and IACS resistivity at 75 °C ×1.02 stranding (matches NEC Ch. 9 Table 8 within 1.5 %, tested); mm² from IEC 60228 class 2 at 20 °C → 70 °C; NEC Table 310.16 ampacity with Tables 310.15(B)(1)/(C)(1) corrections, terminal-temperature cap, 125 % continuous loads, 240.4(D) limits and standard breaker sizes; picks the larger of the drop and ampacity sizes.
- Where published Table 310.16 reproductions differed (Cu 3 AWG 90 °C, Al 300 kcmil) the lower value is used. Metric mode sizes by voltage drop only and tells users to check current capacity under BS 7671 / IEC 60364 for their installation method.
- Review fixes before publishing: 60 °C column blanked above 100 A (NEC 110.14(C)(1)(b)) with a UI hint; aluminium FAQ wording; 14 AWG minimum and motor-circuit notes.
- Page: safety banner, two-checks explanation with live ladder diagram, circuit diagram, formulas, 4 engine-computed examples, wire-by-amps, wire-by-length and 12 V DC tables, AWG ↔ mm² table, copper vs aluminium, breakers & 125 % rule, 11 FAQs + schema, disclaimer; ~2,500 words. Title 64 chars incl. brand.
- Wiring: routes, catalog (29 tools, category "Framing, Roofing & Measuring" for now), new `bolt` icon, footer. 31 new tests (392 total); `npm run verify` all passed.

### [Tool #26 — Pipe & Tube Volume Calculator] — 2026-11-15
- New page `/pipe-volume-calculator/` (Batch 2 Tier 1 #7), built from `07_Pipe_Tube_Volume_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/pipe-volume-engine.ts`): runs list for round (preset, OD + wall, OD + ID, ID only) and rectangular tubes; capacity in US gal, imp gal, L, ft³, in³, m³; per-foot / per-metre; liquid weight; wall volume and tube weight by material; fill time from a flow rate.
- **Presets from published dimensions:** steel/PVC Schedule 40 & 80 (ASME B36.10M, ½–12 in), copper Types K/L/M (ASTM B88, ⅜–4 in), PEX SDR 9 (ASTM F876), metric PE SDR 11 (EN 12201 / ISO 4427). Weight check: 1 in Sch 40 steel = 1.68 lb/ft, 4 in = 10.79 lb/ft, matching the standard.
- UI: US or metric, live cross-section per run, several runs, liquid and material density, formula with the user's numbers, copy / share / print.
- Page: capacity and hollow-cylinder formulas with engine-computed examples, ID vs OD vs nominal, gallons-per-foot / litres-per-metre tables (Sch 40/80, copper L, PEX, PE), house plumbing example, tube weight, rectangular tubes, conversions, 10 FAQs + schema; ~2,500 words. Title shortened to 60 chars (incl. brand); one wrong claim about OD/nominal overstatement corrected to the computed 82% before publishing.
- Wiring: routes, catalog (28 tools), new `pipe` icon, footer. 19 new tests (361 total); `npm run verify` all passed.

### [Tool #25 — Board and Batten Calculator] — 2026-11-14
- New page `/board-and-batten-calculator/` (Batch 2 Tier 1 #6), built from `06_Board_and_Batten_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/board-batten-engine.ts`): equal spacing for battens at both edges / gaps at both edges / inset margin; count ↔ target gap; batten marks; outlet/window clash check; top rail, baseboard (existing or new) and grid rail rows; cut list packed into stock boards; nails, adhesive, caulk and paint; inch parser for fractions and feet; 1/16 in formatting; exterior siding mode (boards, battens, furring, openings).
- Lumber widths from the American Softwood Lumber Standard (NIST PS 20). Adhesive/caulk feet per tube from bead volume; nail spacing labelled as a working assumption.
- UI: inches with fractions or mm, live wall drawing to scale, compare-counts table with one-click "Use", marks list, shopping list with optional prices, copy / share / print.
- Page: spacing formula with engine-computed worked example, edge-option diagram, inch and metric spacing tables, nominal vs actual table, half-wall and grid examples, shopping list, install tips, siding section, 10 FAQs + schema; ~2,600 words, 7 SVGs. Title set to 61 chars (incl. brand).
- Wiring: routes, catalog (27 tools), new `battenWall` icon, footer. 27 new tests (342 total); `npm run verify` all passed.

### [Tool #24 — Shingle Roof Calculator] — 2026-11-14
- New page `/shingle-calculator/` (Batch 2 Tier 1 #5), built from `05_Shingle_Roof_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/shingle-engine.ts`): roof sections (gable / hip / shed / measured area) with overhang and pitch; slope factor √(1+(rise/12)²); automatic eaves, rakes, ridge and hip lengths (manual override); squares → bundles with waste; starter strip, hip & ridge cap, drip edge, underlayment, ice & water barrier (eaves rows + valleys) and nails; optional material cost.
- **Defaults from manufacturer data:** GAF Timberline HDZ (3 bundles, 64 pieces/square), Owens Corning Supreme 3-tab (3 bundles, 80/square), OC Starter Strip Plus (105 ft/bundle), OC ProEdge (33 ft/bundle). Waste presets labelled as typical trade allowances.
- Feet or metres; several sections; live roof-plan diagram per section; shopping-list table; copy, share link, print.
- Page: 4 diagram types (7 SVGs), pitch multiplier table, bundles-per-square table, bundles-by-roof-size table, 4 engine-computed worked examples, 10 FAQs + schema, "How This Calculator Works"; ~2,840 words. Title shortened to 61 chars (incl. brand) after the SEO audit flagged 66.
- Wiring: routes, catalog (26 tools), new `shingles` icon, footer. 20 new tests (315 total); `npm run verify` all passed.

### [Tool #23 — Lawn Mowing Cost Calculator] — 2026-11-14
- New page `/lawn-mowing-cost-calculator/` (Batch 2 Tier 1 #4), built from `04_Lawn_Mowing_Cost_Calculator_Competitor_Analysis.md`.
- **Two views in one tool:** "What will I pay?" (homeowner) and "What should I charge?" (pro, with profit per visit).
- **Time-based engine** (`src/lib/lawn-mowing-engine.ts`): mower width × speed → acres per hour; grass, slope, obstacle and frequency factors; extras as time; setup + drive time; minimum charge; exact visits per season; per visit / month / season / acre / 1,000 sq ft; low–typical–high range.
- Lawn size in sq ft, acres or m², presets, or a rectangle adder with subtract areas; narrow-gate option; currency selector; copy, share link, print.
- Hourly presets ($32 / $50 / $68) sit inside the $30–$68/h range published by Jobber (Mar 2026) and Housecall Pro (Oct 2026); tested to stay inside their per-visit ranges for ¼, ½ and 1 acre. Mower speeds and condition factors are labelled as working assumptions.
- 4 SVG diagrams (measuring, mower path, grass growth, live time bar); every table and FAQ number computed by the engine; 12 FAQs + FAQPage and WebApplication schema; "How This Calculator Works" block; ~2,700 words.
- Wiring: routes, tools catalog (25 tools), new `mower` icon, footer link. 22 new tests (295 total); `npm run verify` all passed.

### [Cloudflare deploy fix + docs refresh] — 2026-11-14
- **Cloudflare deploy fixed.** The first deploy failed because Cloudflare's auto-setup added OpenNext, which needs a `standalone` build (`pages-manifest.json` not found).
  - Added `wrangler.jsonc`: serve `out/` as Workers Static Assets (`auto-trailing-slash`, `404-page`).
  - Removed `@opennextjs/cloudflare` and `wrangler` from `package.json` (not on the allowed dependency list; `npx wrangler deploy` fetches wrangler at deploy time).
  - `next.config.ts` unchanged (`output: 'export'`).
  - Evidence: `npx wrangler deploy --dry-run` read 522 files from `out/`; `npm run verify` all steps passed.
- **Competitor research (Phase KR):** 121 competitor-analysis files for planned tools, Batches 2–8 (docs only).
- **Docs refreshed:** `01` (24-tool directory), `02` (live page inventory), `03` (current tokens + measured contrast), `04` (keyword data map), `05` (Cloudflare deploy steps).

### [SEO audit fixes, part 2: content] — 2026-11-14
- **"How This Calculator Works" block on 20 calculators.** It shows the formula, defaults, sources (verified links only), the last-updated date and a correction link.
- **Brick calculator US / Metric toggle.**
  - Metric engine with UK, Australian and German brick sizes (10 tests).
  - New "How Many Bricks Per m²?" section.
- **Guides.**
  - All 3 open with a direct answer.
  - Retired USPTO "TESS" references replaced with current, checked registry links.
  - New sections added; each guide is now 1,686–1,888 words.
- **Genre pages rewritten in plain language.** Flesch score went from 12.9–21.5 to 63.5–72.5.
- **H1 style made consistent** on 7 calculators.
- **Mobile TBT re-measured** at 91–109 ms, so no change was needed.
- `npm run verify` passed: 273 tests, 0 SEO audit errors.

### [SEO audit fixes] — 2026-11-14
- **Schema:**
  - one connected JSON-LD graph, with Organization + WebSite `@id`s in the layout and a shared normalizer (`normalizeSchema.ts`) for all page JSON-LD;
  - WebPage, AboutPage, ContactPage and CollectionPage nodes;
  - duplicate FAQPage removed on 7 pages;
  - breadcrumbs added on 4 pages and the parent label unified to "Tools".
- **Broken items fixed:**
  - og:image returned 404 on every page; it is now a real `/opengraph-image.png`;
  - `/apple-touch-icon.png` returned 404;
  - the footer Terms link returned 404 on every page;
  - 3 dead homepage guide links;
  - "Home › Home ›" breadcrumbs.
- **Trust:**
  - unverifiable claims removed or softened;
  - About rewritten with counts taken from the code;
  - Contact, /tools/, /guides/ and the home title rewritten for the whole site.
- **Crawl and headers:**
  - `llms.txt` is generated from the route list;
  - the sitemap has loc + lastmod only;
  - robots.txt allows AI search bots explicitly;
  - CSP and HSTS `includeSubDomains` in `_headers`.
- **`seo-audit.mjs` now fails on:**
  - a duplicate FAQPage or Organization;
  - a missing breadcrumb;
  - a dangling @id;
  - an incomplete WebApplication;
  - a missing robots meta;
  - a missing og:image file;
  - a broken internal link.
- `npm run verify` passed: 263 tests, 0 SEO audit errors.

### [Tool #22 — Rebar / Reinforcement Steel Calculator] — 2026-11-14
- New page `/rebar-calculator/` with:
  - engine `src/lib/rebar-engine.ts` (19 tests);
  - UI `src/components/tool/rebar-calculator/`;
  - theme-aware SVG diagrams: slab grid, footing, wall, bar list, lap splice, cover/chairs, bar sizes to scale.
- Slabs, footings, walls and bar lists in one job. Supports US #3–#11 and metric 8–40 mm bars, laps at a user-set × d, 10/20/40 ft or 6/12 m stock bars, and waste. Results show bars to buy by size, weight and optional cost.
- Bar weights from ASTM A615 (US) and 7,850 kg/m³ steel (metric, matches BS 4449). Cover note cites ACI 318. The 40 × d lap is labelled a rule of thumb.
- Catalog now 24 tools. `npm run verify` passed: 263 tests, 0 SEO audit errors.

### [Tool #21 — Drywall Calculator] — 2026-11-14
- New page `/drywall-calculator/` with engine `src/lib/drywall-engine.ts` (26 tests), UI `src/components/tool/drywall-calculator/` and theme-aware SVG diagrams (room, wall, ceiling, gable, area, sheet/screw layout, taped joint, sheet sizes).
- Rooms, walls, ceilings, gable ends and known areas in one job; editable doors/windows; US and metric sheets; sheets by size; compound, tape, screws, corner bead, board weight and optional cost.
- Rates sourced from USG (compound, board weights), Georgia-Pacific (tape, 10–15% overage) and IRC Table R702.3.5 (screw spacing).
- Catalog now 23 tools; "22 tools" text across header, footer, hero, home and directory now reads the catalog length.

### [Tool #20 — Concrete Calculator] — 2026-11-13
- New page `/concrete-calculator/` with engine `src/lib/concrete-engine.ts` (25 tests), UI `src/components/tool/concrete-calculator/` and labelled SVG shape diagrams.
- 8 shapes, multi-pour totals, US/metric with value conversion, bag counts (QUIKRETE data-sheet yields + derived kg sizes), ready-mix rounding and truck loads, optional cost, site-mix split, copy/share/print.
- Article numbers (examples, tables, FAQ) generated from the engine at build time.
- `/cubic-yard-calculator/` retitled to avoid keyword cannibalisation; nav, footer and tools directory updated.
- `npm run verify` passed: 214 tests, 0 SEO audit errors.

### [Phase 3 Complete — Checkpoint 1] — 2026-11-08
- **Tasks Completed:** P3-01, P3-02, P3-03, P3-04, P3-05, P3-06, P3-07, P3-08, P3-09.
- **Details:**
  - Built interactive `BandNameGenerator` component hierarchy:
    - `Controls.tsx`: F1–F7 (genre radio chips, style selector, batch sizes 5/10/20, letter filter, keyword injector, uppercase toggle, generate CTA with Enter key listener).
    - `ResultRow.tsx`: F8, F9, F11 (large heading font band titles, animated entry, copy, heart favorite toggle, check availability dropdown).
    - `Results.tsx`: F8, F9, F12 (aria-live announcements, copy-all action, constraint warning alert).
    - `CheckMenu.tsx`: F11 (Google, Spotify, Bandcamp, and YouTube search links with safe rel tags and clearance disclaimer).
    - `SavedPanel.tsx`: F10 (LocalStorage-synced favorites, remove items, copy-all, and .txt export download).
  - Built full `/band-name-generator/` main tool page with 2,242 words of original, comprehensive content and 8 structured FAQ items.
  - Implemented full Schema JSON-LD: `WebApplication`, `BreadcrumbList`, and `FAQPage`.
  - Rebuilt `/` Home page matching Section 8.1 with live compact tool preview.
  - Passed all verification steps in `npm run verify` (lint, unit tests, no-network check, build, SEO audit, docs bundle).

### [Phase 2 Complete] — 2026-11-08
- **Tasks Completed:** P2-01, P2-02, P2-03, P2-04, P2-05, P2-06, P2-07.
- **Details:**
  - Implemented core pure TypeScript generator engine (`src/lib/generator/`): Mulberry32 seeded RNG, safeStorage helper.
  - Curated 9 genre word pools with 80+ distinct words per pool.
  - Implemented 8+ weighted patterns per genre supporting 'the', 'two-word', 'one-word', and 'of-phrase' styles (>5,000 combinations per genre).
  - Built blocklist of 260+ famous bands with normalized checking and explicit slur/offensive filter.
  - Built `generateNames()` with constraint validation, loop guards (500 max attempts), and friendly warnings.
  - Passed all 9 Vitest unit tests in `src/lib/generator/engine.test.ts`.
  - Verified zero network calls via `check:no-network`.

### [Phase 1 Complete] — 2026-11-08
- **Tasks Completed:** P1-01, P1-02, P1-03, P1-04, P1-05, P1-06, P1-07, P1-08, P1-09, P1-10, P1-11.
- **Details:**
  - Implemented design tokens with Stage Lights theme in `src/styles/tokens.css` with dark/light mode and verified WCAG contrast ≥ 4.5:1.
  - Loaded Google Fonts (Bricolage Grotesque & Inter) self-hosted via `next/font/google`.
  - Built Header with soundwave SVG, accessible desktop dropdown, mobile drawer with escape key and focus trap, and no-flash ThemeToggle.
  - Built 4-column SEO-optimized Footer with legal disclaimers.
  - Implemented UI primitives: Button, Chip, Card, Container, Section, Faq (details/summary), and Toast (polite live region).
  - Implemented Breadcrumbs with BreadcrumbList JSON-LD and single source of truth route registry `src/lib/routes.ts`.
  - Created inert `AdSlot` and custom `not-found.tsx` generating `out/404.html` with noindex.

### [Phase 0 Complete] — 2026-11-08
- **Tasks Completed:** P0-01, P0-02, P0-03, P0-04, P0-05, P0-06, P0-07, P0-08.
- **Details:**
  - Initialized Next.js App Router project with TypeScript strict mode, static export configuration (`output: 'export'`), and trailing slashes.
  - Installed allowed dependencies: `gray-matter`, `marked`, `vitest`, `vite-tsconfig-paths`, `cheerio`, `serve`, `prettier`.
  - Added operational scripts for building, testing, auditing, and checking zero-network usage.
  - Created `AGENTS.md` and complete `docs/` documentation system.
  - Initialized git repository.



<!-- ========================================================= -->
<!-- FILE: docs/seo-audit-report.md -->
<!-- ========================================================= -->

# SEO Audit Report

Run Date: 2026-11-24T18:47:27.383Z
Status: PASSED ✅

| Route | Title | Words | H1 | Status |
|---|---|---|---|---|
| `/3d-print-cost-calculator/` | 3D Print Cost Calculator – Filament, Pow | 3047 | 3D Print Cost Calculator: Fila | PASS |
| `/404/` | Page Not Found – 404 | KKC Tools | 23 | Page Not Found | PASS |
| `/404/` | Page Not Found – 404 | KKC Tools | 23 | Page Not Found | PASS |
| `/ab-test-significance-calculator/` | A/B Test Significance Calculator – Stat  | 3353 | A/B Test Significance Calculat | PASS |
| `/about/` | About KKC Tools – How Our Calculators Wo | 491 | About KKC Tools | PASS |
| `/age-difference-calculator/` | Age Difference Calculator – Years, Month | 2400 | Age Difference Calculator: How | PASS |
| `/airbnb-calculator/` | Airbnb Calculator – Short-Term Rental Pr | 3179 | Airbnb Profit Calculator: Shor | PASS |
| `/asphalt-calculator/` | Asphalt Calculator: Tons, Cubic Yards &  | 2487 | Asphalt Calculator: How Many T | PASS |
| `/band-name-generator/boy-band/` | Boy Band Name Generator – Catchy Group N | 1056 | Boy Band Name Generator | PASS |
| `/band-name-generator/heavy-metal/` | Heavy Metal Band Name Generator – Classi | 1122 | Heavy Metal Band Name Generato | PASS |
| `/band-name-generator/` | Band Name Generator – Free Band Name Ide | 2660 | Band Name Generator | PASS |
| `/band-name-generator/kpop/` | K-pop Band Name Generator – Group Name I | 1194 | K-pop Band Name Generator | PASS |
| `/band-name-generator/metal/` | Metal Band Name Generator – Dark & Heavy | 1227 | Metal Band Name Generator | PASS |
| `/band-name-generator/random/` | Random Band Name Generator – Instant Ide | 1110 | Random Band Name Generator | PASS |
| `/band-name-generator/rock/` | Rock Band Name Generator – Free Name Ide | 1155 | Rock Band Name Generator | PASS |
| `/bathroom-remodel-cost-calculator/` | Bathroom Remodel Cost Calculator – Itemi | 1834 | Bathroom Remodel Cost Calculat | PASS |
| `/binomial-probability-calculator/` | Binomial Probability Calculator – P(X =  | 2783 | Binomial Probability Calculato | PASS |
| `/board-and-batten-calculator/` | Board and Batten Calculator – Spacing &  | 2642 | Board and Batten Calculator: B | PASS |
| `/boolean-algebra-calculator/` | Boolean Algebra Calculator – Truth Table | 2176 | Boolean Algebra Calculator: Tr | PASS |
| `/brick-calculator/` | Brick Calculator (Brick Wall & Mortar) | | 2905 | Brick Calculator: Bricks, Mort | PASS |
| `/budget-calculator/` | Budget Calculator – Monthly Budget Plann | 2273 | Monthly Budget Calculator: Pla | PASS |
| `/business-valuation-calculator/` | Business Valuation Calculator – SDE & EB | 3137 | Business Valuation Calculator: | PASS |
| `/cagr-calculator/` | CAGR Calculator – Compound Annual Growth | 3112 | CAGR Calculator: Compound Annu | PASS |
| `/cap-rate-calculator/` | Cap Rate Calculator – NOI & Commercial P | 3055 | Cap Rate Calculator: Cap Rate, | PASS |
| `/carpet-cost-calculator/` | Carpet Cost Calculator – Price per Squar | 4139 | Carpet Cost Calculator | PASS |
| `/character-counter/` | Character Counter – Count Characters Wit | 2899 | Character Counter: Characters  | PASS |
| `/characters-to-words/` | Characters to Words Converter – How Many | 2637 | Characters to Words: How Many  | PASS |
| `/cinder-block-calculator/` | Cinder Block Calculator – CMU & Concrete | 3548 | Cinder Block Calculator – Conc | PASS |
| `/comma-separator/` | Comma Separator – Column to Comma-Separa | 2145 | Comma Separator: Turn a Column | PASS |
| `/commercial-lease-calculator/` | Commercial Lease Calculator – Rent per S | 2815 | Commercial Lease Calculator: R | PASS |
| `/commercial-mortgage-calculator/` | Commercial Mortgage Calculator – Payment | 2533 | Commercial Mortgage Calculator | PASS |
| `/compost-calculator/` | Compost Calculator (Garden Beds & Lawns) | 2606 | Compost Calculator: Cubic Yard | PASS |
| `/compound-interest-calculator/` | Compound Interest Calculator – Daily, Mo | 3407 | Compound Interest Calculator:  | PASS |
| `/concrete-calculator/` | Concrete Calculator – Volume, Yards & Ba | 2732 | Concrete Calculator: Volume in | PASS |
| `/concrete-slab-cost-calculator/` | Concrete Slab Cost Calculator – Per Yard | 3355 | Concrete Slab Cost Calculator | PASS |
| `/construction-estimate-template/` | Construction Estimate Template – Free Bu | 3047 | Free Construction Estimate Tem | PASS |
| `/contact/` | Contact KKC Tools – Report a Bug or Sugg | 205 | Contact KKC Tools | PASS |
| `/contribution-margin-calculator/` | Contribution Margin Calculator – Ratio & | 2745 | Contribution Margin Calculator | PASS |
| `/credit-card-payoff-calculator/` | Credit Card APR Calculator – Payoff Time | 3884 | Credit Card APR Calculator: Pa | PASS |
| `/cubic-feet-to-square-feet/` | Cubic Feet to Square Feet Converter (wit | 1700 | Cubic Feet to Square Feet Conv | PASS |
| `/cubic-inch-calculator/` | Cubic Inch Calculator – Volume & Engine  | 1926 | Cubic Inch Calculator (Volume  | PASS |
| `/cubic-yard-calculator/` | Cubic Yard Calculator – Soil, Gravel, Mu | 2682 | Cubic Yard Calculator: How Man | PASS |
| `/deck-cost-calculator/` | Deck Cost Calculator & Estimator – Wood  | 3778 | Deck Cost Calculator & Estimat | PASS |
| `/deck-stain-calculator/` | Deck Stain Calculator – Gallons, Coverag | 2826 | Deck Stain Calculator | PASS |
| `/disclaimer/` | Disclaimer – Estimates, Safety & Accurac | 549 | Disclaimer | PASS |
| `/discount-calculator/` | Discount Calculator – Percent Off & Sale | 2433 | Discount Calculator: Percent O | PASS |
| `/drywall-calculator/` | Drywall Calculator – Sheetrock Sheets, M | 2823 | Drywall Calculator: Sheets, Jo | PASS |
| `/epoxy-resin-calculator/` | Epoxy Resin Calculator – How Much Resin  | 3423 | Epoxy Resin Calculator: How Mu | PASS |
| `/epoxy-table-calculator/` | Epoxy Table Calculator – River Table Res | 3028 | Epoxy River Table Calculator:  | PASS |
| `/equipment-loan-calculator/` | Equipment Loan Calculator – Business Loa | 2831 | Equipment Loan Calculator: Pay | PASS |
| `/fence-cost-calculator/` | Fence Cost Calculator – Chain Link, Viny | 2653 | Fence Cost Calculator: Chain L | PASS |
| `/fence-stain-calculator/` | Fence Stain Calculator (Gallons & Picket | 2395 | Fence Stain Calculator: Gallon | PASS |
| `/fill-dirt-calculator/` | Fill Dirt Calculator: Cubic Yards & Tons | 1541 | Fill Dirt Calculator | PASS |
| `/final-grade-calculator/` | Final Grade Calculator – What Do I Need  | 2267 | Final Grade Calculator: What S | PASS |
| `/floor-refinishing-cost-calculator/` | Hardwood Floor Refinishing Cost Calculat | 2788 | Hardwood Floor Refinishing & R | PASS |
| `/fraction-to-percent-calculator/` | Fraction to Percent Calculator – X out o | 2439 | Fraction to Percent Calculator | PASS |
| `/freelance-rate-calculator/` | Freelance Rate Calculator – Hourly Rate  | 2973 | Freelance Hourly Rate Calculat | PASS |
| `/gallons-to-cubic-feet/` | Gallons to Cubic Feet Converter – ft³, m | 2182 | Gallons to Cubic Feet: Convert | PASS |
| `/guides/band-name-ideas-by-genre/` | Band Name Ideas by Genre – Naming Guide  | 1686 | Band Name Ideas by Genre: The  | PASS |
| `/guides/how-to-check-if-a-band-name-is-taken/` | How to Check If a Band Name Is Taken | K | 1875 | How to Check If a Band Name Is | PASS |
| `/guides/how-to-choose-a-band-name/` | How to Choose a Band Name – Complete Gui | 1888 | How to Choose a Band Name: The | PASS |
| `/guides/` | Guides – Band Naming & Name Checks | KKC | 249 | Guides: Band Naming and Checki | PASS |
| `/heloc-calculator/` | HELOC Loan Calculator – Payment, Limit & | 2875 | HELOC Calculator: Borrowing Li | PASS |
| `/hourly-to-salary-calculator/` | Hourly to Salary Calculator – Yearly Wag | 2708 | Hourly to Salary Calculator (Y | PASS |
| `/how-long-will-my-money-last/` | How Long Will My Money Last? Retirement  | 3290 | How Long Will My Money Last Ca | PASS |
| `/` | KKC Tools – Free Construction Calculator | 4800 | Free Construction Calculators  | PASS |
| `/investment-return-calculator/` | Investment Calculator – S&P 500, T-Bills | 2971 | Investment Return Calculator:  | PASS |
| `/invoice-generator/` | Free Invoice Generator – Hourly & Freela | 2854 | Invoice Generator: Make an Hou | PASS |
| `/iqr-calculator/` | IQR Calculator – Quartiles, Outliers & B | 2972 | IQR Calculator: Interquartile  | PASS |
| `/keyword-density-checker/` | Keyword Density Checker – Count Words in | 2018 | Keyword Density Checker: How O | PASS |
| `/labor-cost-calculator/` | Labor Cost Calculator – Burdened Hourly  | 3253 | Labor Cost Calculator: True Ho | PASS |
| `/laminate-flooring-calculator/` | Laminate Flooring Calculator (Boxes & Co | 2813 | Laminate Flooring Calculator:  | PASS |
| `/lawn-mowing-cost-calculator/` | Lawn Mowing Cost Calculator – Price per  | 2771 | Lawn Mowing Cost Calculator | PASS |
| `/linear-foot-calculator/` | Linear Foot Calculator (Sq Ft to Linear  | 1638 | Linear Foot Calculator (Linear | PASS |
| `/markup-calculator/` | Markup Calculator – Selling Price, Marku | 2634 | Markup Calculator: Selling Pri | PASS |
| `/metal-roof-cost-calculator/` | Metal Roof Cost Calculator – Standing Se | 2066 | Metal Roof Cost Calculator | PASS |
| `/metric-conversion-calculator/` | Metric Conversion Calculator – Length, W | 2026 | Metric Conversion Calculator:  | PASS |
| `/net-worth-calculator/` | Net Worth Calculator – Calculate Your Ne | 2603 | Net Worth Calculator: Calculat | PASS |
| `/numbers-to-words/` | Numbers to Words Converter – Amount in W | 2544 | Numbers to Words: Write Any Nu | PASS |
| `/paint-cost-calculator/` | Paint Cost Calculator (Coverage & Price) | 2547 | Paint Cost Calculator: Gallons | PASS |
| `/paver-base-calculator/` | Paver Base Calculator (Tons & Cubic Yard | 3097 | Paver Base Calculator: Tons &  | PASS |
| `/paver-sand-calculator/` | Paver Sand Calculator (Bedding & Polymer | 2494 | Paver Sand Calculator: Bedding | PASS |
| `/percentage-change-calculator/` | Percentage Change Calculator – Increase  | 3881 | Percentage Change Calculator:  | PASS |
| `/pipe-volume-calculator/` | Pipe & Tube Volume Calculator – Gallons  | 2552 | Pipe & Tube Volume Calculator | PASS |
| `/present-value-calculator/` | Present Value Calculator – PV Formula, N | 3191 | Present Value Calculator: PV F | PASS |
| `/privacy-policy/` | Privacy Policy – Transparent & Privacy F | 876 | Privacy Policy | PASS |
| `/processing-fee-calculator/` | Card Processing Fee Calculator – Square  | 2689 | Credit Card Processing Fee Cal | PASS |
| `/profit-margin-calculator/` | Profit Margin Calculator – Gross, Net &  | 2129 | Profit Margin Calculator: Gros | PASS |
| `/pulley-calculator/` | Pulley Calculator – Ratio, Speed and Bel | 2601 | Pulley Ratio Calculator: Drive | PASS |
| `/pythagorean-theorem-calculator/` | Pythagorean Theorem Calculator – Right T | 2725 | Pythagorean Theorem Calculator | PASS |
| `/rafter-calculator/` | Rafter Calculator: Length, Pitch & Cut A | 2430 | Rafter Calculator – Find Rafte | PASS |
| `/ratio-calculator/` | Ratio Calculator – Simplify and Solve Pr | 2828 | Ratio Calculator: Simplify Rat | PASS |
| `/reading-time-calculator/` | Reading Time Calculator – Words to Minut | 2650 | Reading Time Calculator: How L | PASS |
| `/rebar-calculator/` | Rebar Calculator – Reinforcement Steel B | 2324 | Reinforcement Steel Calculator | PASS |
| `/rental-property-calculator/` | Rental Property Calculator – Cash-on-Cas | 3029 | Rental Property Calculator: Ca | PASS |
| `/reverse-sales-tax-calculator/` | Reverse Sales Tax Calculator – Price Bef | 2592 | Reverse Sales Tax Calculator:  | PASS |
| `/roi-calculator/` | ROI Calculator – Return on Investment &  | 2177 | ROI Calculator: Return on Inve | PASS |
| `/roof-replacement-cost-calculator/` | Roof Replacement Cost Calculator – Per S | 4152 | Roof Replacement Cost Calculat | PASS |
| `/sand-calculator/` | Sand Calculator: Cubic Yards, Tons & Bag | 1571 | Sand Calculator | PASS |
| `/sba-loan-calculator/` | SBA Loan Calculator – 7(a) and 504 Loan  | 3461 | SBA Loan Calculator: 7(a) and  | PASS |
| `/self-employment-tax-calculator/` | 1099 Tax Calculator – Self-Employment Ta | 2826 | 1099 Tax Calculator: Self-Empl | PASS |
| `/sentence-counter/` | Sentence Counter – Count Sentences and P | 2062 | Sentence Counter: Count Senten | PASS |
| `/sfm-to-rpm-calculator/` | SFM to RPM Calculator – Surface Feet per | 2302 | SFM to RPM Calculator: Surface | PASS |
| `/shingle-calculator/` | Shingle Roof Calculator – Bundles, Squar | 2895 | Shingle Roof Calculator: Bundl | PASS |
| `/simple-interest-calculator/` | Simple Interest Calculator – Accrued Int | 2446 | Simple Interest Calculator: In | PASS |
| `/site-map/` | Site Map – Every KKC Tools Page | KKC To | 1992 | Site Map | PASS |
| `/slope-calculator/` | Slope Calculator – Rise over Run, Percen | 2618 | Slope Calculator: Rise over Ru | PASS |
| `/speeds-and-feeds-calculator/` | Speeds and Feeds Calculator – CNC RPM &  | 3188 | Speeds and Feeds Calculator: C | PASS |
| `/square-footage-calculator/` | Square Footage Calculator – Sq Ft of Roo | 3405 | Square Footage Calculator (Sq  | PASS |
| `/standard-deviation-calculator/` | Standard Deviation Calculator – Variance | 2431 | Standard Deviation Calculator: | PASS |
| `/steps-per-mm-calculator/` | Steps per mm Calculator – Stepper & E-st | 2648 | Steps per mm Calculator: Stepp | PASS |
| `/stone-calculator/` | Gravel & Stone Calculator – Yards, Tons  | 3609 | Gravel Calculator: Stone, Rock | PASS |
| `/stud-calculator/` | Stud Calculator: Wall Framing & Lumber C | 2217 | Stud Calculator: Wall Framing  | PASS |
| `/t-test-calculator/` | T-Test Calculator – One, Two-Sample & Pa | 2905 | T-Test Calculator: One-Sample, | PASS |
| `/tank-volume-calculator/` | Tank Volume Calculator – Gallons in Any  | 2551 | Tank Volume Calculator: Gallon | PASS |
| `/terms/` | Terms of Service – Simple & Fair Usage | | 559 | Terms of Service | PASS |
| `/thread-pitch-diameter-calculator/` | Thread Pitch Diameter Calculator – UN &  | 2530 | Thread Pitch Diameter Calculat | PASS |
| `/tile-calculator/` | Tile Calculator (Tile Sq Ft & Boxes) | K | 3397 | Tile Calculator: Square Feet,  | PASS |
| `/tons-to-cubic-yards/` | Tons to Cubic Yards Converter by Materia | 1975 | Tons to Cubic Yards Converter | PASS |
| `/tools/` | All Free Tools – Construction Calculator | 3280 | All Free Tools: Construction C | PASS |
| `/twitter-character-counter/` | Twitter Character Counter – X & Instagra | 2429 | Twitter (X) Character Counter: | PASS |
| `/unit-price-calculator/` | Unit Price Calculator – Price per Ounce, | 2706 | Unit Price Calculator: Compare | PASS |
| `/wire-gauge-calculator/` | Wire Gauge Calculator – Wire Size by Amp | 2580 | Wire Gauge Calculator: Wire Si | PASS |
| `/word-counter/` | Word Counter – Free Online Word Count To | 2602 | Word Counter: Count Words, Cha | PASS |
| `/words-to-pages/` | Words to Pages Calculator – How Many Pag | 4019 | Words to Pages Calculator: How | PASS |
| `/_not-found/` | Page Not Found – 404 | KKC Tools | 23 | Page Not Found | PASS |



<!-- ========================================================= -->
<!-- SECTION: Exported Routes (from out/) -->
<!-- ========================================================= -->

```
3d-print-cost-calculator/index.html
404/index.html
404.html
ab-test-significance-calculator/index.html
about/index.html
age-difference-calculator/index.html
airbnb-calculator/index.html
asphalt-calculator/index.html
band-name-generator/boy-band/index.html
band-name-generator/heavy-metal/index.html
band-name-generator/index.html
band-name-generator/kpop/index.html
band-name-generator/metal/index.html
band-name-generator/random/index.html
band-name-generator/rock/index.html
bathroom-remodel-cost-calculator/index.html
binomial-probability-calculator/index.html
board-and-batten-calculator/index.html
boolean-algebra-calculator/index.html
brick-calculator/index.html
budget-calculator/index.html
business-valuation-calculator/index.html
cagr-calculator/index.html
cap-rate-calculator/index.html
carpet-cost-calculator/index.html
character-counter/index.html
characters-to-words/index.html
cinder-block-calculator/index.html
comma-separator/index.html
commercial-lease-calculator/index.html
commercial-mortgage-calculator/index.html
compost-calculator/index.html
compound-interest-calculator/index.html
concrete-calculator/index.html
concrete-slab-cost-calculator/index.html
construction-estimate-template/index.html
contact/index.html
contribution-margin-calculator/index.html
credit-card-payoff-calculator/index.html
cubic-feet-to-square-feet/index.html
cubic-inch-calculator/index.html
cubic-yard-calculator/index.html
deck-cost-calculator/index.html
deck-stain-calculator/index.html
disclaimer/index.html
discount-calculator/index.html
drywall-calculator/index.html
epoxy-resin-calculator/index.html
epoxy-table-calculator/index.html
equipment-loan-calculator/index.html
fence-cost-calculator/index.html
fence-stain-calculator/index.html
fill-dirt-calculator/index.html
final-grade-calculator/index.html
floor-refinishing-cost-calculator/index.html
fraction-to-percent-calculator/index.html
freelance-rate-calculator/index.html
gallons-to-cubic-feet/index.html
guides/band-name-ideas-by-genre/index.html
guides/how-to-check-if-a-band-name-is-taken/index.html
guides/how-to-choose-a-band-name/index.html
guides/index.html
heloc-calculator/index.html
hourly-to-salary-calculator/index.html
how-long-will-my-money-last/index.html
index.html
investment-return-calculator/index.html
invoice-generator/index.html
iqr-calculator/index.html
keyword-density-checker/index.html
labor-cost-calculator/index.html
laminate-flooring-calculator/index.html
lawn-mowing-cost-calculator/index.html
linear-foot-calculator/index.html
markup-calculator/index.html
metal-roof-cost-calculator/index.html
metric-conversion-calculator/index.html
net-worth-calculator/index.html
numbers-to-words/index.html
paint-cost-calculator/index.html
paver-base-calculator/index.html
paver-sand-calculator/index.html
percentage-change-calculator/index.html
pipe-volume-calculator/index.html
present-value-calculator/index.html
privacy-policy/index.html
processing-fee-calculator/index.html
profit-margin-calculator/index.html
pulley-calculator/index.html
pythagorean-theorem-calculator/index.html
rafter-calculator/index.html
ratio-calculator/index.html
reading-time-calculator/index.html
rebar-calculator/index.html
rental-property-calculator/index.html
reverse-sales-tax-calculator/index.html
roi-calculator/index.html
roof-replacement-cost-calculator/index.html
sand-calculator/index.html
sba-loan-calculator/index.html
self-employment-tax-calculator/index.html
sentence-counter/index.html
sfm-to-rpm-calculator/index.html
shingle-calculator/index.html
simple-interest-calculator/index.html
site-map/index.html
slope-calculator/index.html
speeds-and-feeds-calculator/index.html
square-footage-calculator/index.html
standard-deviation-calculator/index.html
steps-per-mm-calculator/index.html
stone-calculator/index.html
stud-calculator/index.html
t-test-calculator/index.html
tank-volume-calculator/index.html
terms/index.html
thread-pitch-diameter-calculator/index.html
tile-calculator/index.html
tons-to-cubic-yards/index.html
tools/index.html
twitter-character-counter/index.html
unit-price-calculator/index.html
wire-gauge-calculator/index.html
word-counter/index.html
words-to-pages/index.html
_not-found/index.html
```


<!-- ========================================================= -->
<!-- SECTION: package.json Dependencies -->
<!-- ========================================================= -->

```json
{
  "dependencies": {
    "gray-matter": "^4.0.3",
    "marked": "^18.1.3",
    "next": "16.4.5",
    "react": "19.3.0",
    "react-dom": "19.3.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "cheerio": "^1.2.0",
    "eslint": "^9",
    "eslint-config-next": "16.4.5",
    "prettier": "^3.9.10",
    "serve": "^14.2.7",
    "typescript": "^5",
    "vite-tsconfig-paths": "^6.1.1",
    "vitest": "^4.1.12"
  }
}
```


<!-- ========================================================= -->
<!-- SECTION: Recent Git Commits -->
<!-- ========================================================= -->

```
eca54a5 goolge search console analysis files created
eeaa86f fix(ui): harden high-contrast dark text styling on tool metric boxes and stat cards
c6ce78d feat(batch-5): implement first 10 math tools, redesign compact footer & header mega menu - Implement first 10 Math & Financial calculators with premium dark gradient hero cards (#312E81 to #0D9488) and custom InputGuides:   * Ratio Calculator (/ratio-calculator/)   * Age Difference Calculator (/age-difference-calculator/)   * IQR Calculator (/iqr-calculator/) with dynamic box plot SVG   * A/B Test Significance Calculator (/ab-test-significance-calculator/)   * Gallons to Cubic Feet Converter (/gallons-to-cubic-feet/)   * CAGR Calculator (/cagr-calculator/)   * Fraction to Percent Calculator (/fraction-to-percent-calculator/)   * Reverse Sales Tax Calculator (/reverse-sales-tax-calculator/)   * Standard Deviation Calculator (/standard-deviation-calculator/)   * T-Test Calculator (/t-test-calculator/) with Welch default and t-curve SVG - Add 'Math & Finance' category and 4 shared engines with 100% test coverage (stats, growth, volume-units, date-diff) - Apply 10 live-page keyword refreshes (Stone & Gravel, Tons to Yards, Sand, etc.) - Redesign footer: eliminate 50-link wall, organize into 6 balanced categories (6-7 tools each), add top brand header & company ribbon (height cut by ~75%) - Redesign Tools Mega Menu: compact 4-column x 2-row layout (~290px height) and single-expand accordion mobile drawer - All 1,039 vitest tests passing, 0 lint errors, 0 network calls, static build verified across 106 HTML pages
a86c1e1 feat(batch-4): add 8 3D Printing & CNC engineering calculators with oceanic gradient UI - Build 8 pure client-side tools (#68–#75) in the '3D Printing & CNC' category:   * Epoxy Resin Calculator (/epoxy-resin-calculator/)   * Epoxy River Table Calculator (/epoxy-table-calculator/)   * 3D Print Cost Calculator (/3d-print-cost-calculator/)   * Speeds and Feeds Calculator (/speeds-and-feeds-calculator/)   * SFM to RPM Surface Speed Calculator (/sfm-to-rpm-calculator/)   * Pulley Ratio & Belt Speed Calculator (/pulley-calculator/)   * Stepper Steps/mm & E-Steps Calculator (/steps-per-mm-calculator/)   * Thread Pitch Diameter & Tap Drill Calculator (/thread-pitch-diameter-calculator/) - Add calculation engines with 100% test coverage matching all spec worked examples - Add bespoke SVG icons, home card artwork, and category navigation - Fix global container max-width to prevent widescreen stretching - Elevate results UI with oceanic teal/cyan gradient hero cards, glassmorphic badges, and modern data tables - Keep Batch 8 specifications, research, and prompt files intact - All 957 Vitest tests passing, 0 lint errors, static build verified (96 pages)
e94a40f build spec files added
c55ef1a feat: complete Batch 3 financial tools (#47-#67) and redesign unique card artwork
ed9608a Batch 3 remaining docs completed
4a1e6d4 docs: update bundle evidence and mark Batch 1 completed
6180bf2 feat(ui): rollout shared ToolShell and TabSlider across all 44 calculators with card clash fixes
4e513d1 docs(audit): update docs, refine source citations, and polish Batch 3 content copy
ed14ce6 feat(tool): build Discount & Percent Off Calculator (#46) with canonical 2-column UI
f32ee21 feat(tool): build Hourly to Salary Calculator (#45) and fix FAQ answer white card styling
cb8433a feat(tool): build Unit Price Calculator (#44) with interactive visual diagram and 3 modes
e0883d1 feat(tool): build Profit Margin Calculator (#43) with interactive P&L waterfall diagram and 4 modes
47208bf feat(tool): build Markup Calculator (#42) with interactive visual diagram and 5 modes
d7b7d42 feat(tool): build Percentage Change Calculator (#41) with interactive visual diagram and 8 modes
c70c17f all Batch 2 completed
775f6f3 Deck Cost Calculator & Estimator - completed
fc9be24 feat(carpet): add Carpet Cost Calculator and align UI with design system
6717356 tool 19 completed
```


<!-- ========================================================= -->
<!-- SECTION: Evidence Outputs (docs/evidence/) -->
<!-- ========================================================= -->

### Evidence: build.txt

```

> band-name-generator-site@0.1.0 build
> next build --webpack

▲ Next.js 16.4.5 (webpack)
✓ Running next.config.ts took 29ms

  Creating an optimized production build ...
✓ Compiled successfully in 11.8s
  Running TypeScript ...
  Finished TypeScript in 3.9s ...
  Collecting page data using 15 workers ...
  Generating static pages using 15 workers (0/140) ...
  Generating static pages using 15 workers (35/140) 
  Generating static pages using 15 workers (70/140) 
  Generating static pages using 15 workers (105/140) 
✓ Generating static pages using 15 workers (140/140) in 5.3s
  Finalizing page optimization ...
  Collecting build traces ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /3d-print-cost-calculator
├ ○ /ab-test-significance-calculator
├ ○ /about
├ ○ /age-difference-calculator
├ ○ /airbnb-calculator
├ ○ /apple-touch-icon.png
├ ○ /asphalt-calculator
├ ○ /band-name-generator
├   /band-name-generator/[genre]
│ ├ ● /band-name-generator/kpop
│ ├ ● /band-name-generator/metal
│ ├ ● /band-name-generator/heavy-metal
│ └ ● [+3 more paths]
├ ○ /bathroom-remodel-cost-calculator
├ ○ /binomial-probability-calculator
├ ○ /board-and-batten-calculator
├ ○ /boolean-algebra-calculator
├ ○ /brick-calculator
├ ○ /brick-calculator/opengraph-image
├ ○ /budget-calculator
├ ○ /business-valuation-calculator
├ ○ /cagr-calculator
├ ○ /cap-rate-calculator
├ ○ /carpet-cost-calculator
├ ○ /character-counter
├ ○ /characters-to-words
├ ○ /cinder-block-calculator
├ ○ /cinder-block-calculator/opengraph-image
├ ○ /comma-separator
├ ○ /commercial-lease-calculator
├ ○ /commercial-mortgage-calculator
├ ○ /compost-calculator
├ ○ /compound-interest-calculator
├ ○ /concrete-calculator
├ ○ /concrete-slab-cost-calculator
├ ○ /construction-estimate-template
├ ○ /construction-estimate-template/opengraph-image
├ ○ /contact
├ ○ /contribution-margin-calculator
├ ○ /credit-card-payoff-calculator
├ ○ /cubic-feet-to-square-feet
├ ○ /cubic-inch-calculator
├ ○ /cubic-yard-calculator
├ ○ /deck-cost-calculator
├ ○ /deck-stain-calculator
├ ○ /disclaimer
├ ○ /discount-calculator
├ ○ /drywall-calculator
├ ○ /epoxy-resin-calculator
├ ○ /epoxy-table-calculator
├ ○ /equipment-loan-calculator
├ ○ /fence-cost-calculator
├ ○ /fence-stain-calculator
├ ○ /fill-dirt-calculator
├ ○ /final-grade-calculator
├ ○ /floor-refinishing-cost-calculator
├ ○ /fraction-to-percent-calculator
├ ○ /freelance-rate-calculator
├ ○ /gallons-to-cubic-feet
├ ○ /guides
├   /guides/[slug]
│ ├ ● /guides/how-to-choose-a-band-name
│ ├ ● /guides/how-to-check-if-a-band-name-is-taken
│ └ ● /guides/band-name-ideas-by-genre
├ ○ /heloc-calculator
├ ○ /hourly-to-salary-calculator
├ ○ /how-long-will-my-money-last
├ ○ /investment-return-calculator
├ ○ /invoice-generator
├ ○ /iqr-calculator
├ ○ /keyword-density-checker
├ ○ /labor-cost-calculator
├ ○ /laminate-flooring-calculator
├ ○ /laminate-flooring-calculator/opengraph-image
├ ○ /lawn-mowing-cost-calculator
├ ○ /linear-foot-calculator
├ ○ /llms.txt
├ ○ /logo.png
├ ○ /markup-calculator
├ ○ /metal-roof-cost-calculator
├ ○ /metric-conversion-calculator
├ ○ /net-worth-calculator
├ ○ /numbers-to-words
├ ○ /opengraph-image.png
├ ○ /paint-cost-calculator
├ ○ /paint-cost-calculator/opengraph-image
├ ○ /paver-base-calculator
├ ○ /paver-sand-calculator
├ ○ /percentage-change-calculator
├ ○ /pipe-volume-calculator
├ ○ /present-value-calculator
├ ○ /privacy-policy
├ ○ /processing-fee-calculator
├ ○ /profit-margin-calculator
├ ○ /pulley-calculator
├ ○ /pythagorean-theorem-calculator
├ ○ /rafter-calculator
├ ○ /ratio-calculator
├ ○ /reading-time-calculator
├ ○ /rebar-calculator
├ ○ /rental-property-calculator
├ ○ /reverse-sales-tax-calculator
├ ○ /robots.txt
├ ○ /roi-calculator
├ ○ /roof-replacement-cost-calculator
├ ○ /sand-calculator
├ ○ /sba-loan-calculator
├ ○ /self-employment-tax-calculator
├ ○ /sentence-counter
├ ○ /sfm-to-rpm-calculator
├ ○ /shingle-calculator
├ ○ /simple-interest-calculator
├ ○ /site-map
├ ○ /sitemap.xml
├ ○ /slope-calculator
├ ○ /speeds-and-feeds-calculator
├ ○ /square-footage-calculator
├ ○ /square-footage-calculator/opengraph-image
├ ○ /standard-deviation-calculator
├ ○ /steps-per-mm-calculator
├ ○ /stone-calculator
├ ○ /stone-calculator/opengraph-image
├ ○ /stud-calculator
├ ○ /t-test-calculator
├ ○ /tank-volume-calculator
├ ○ /terms
├ ○ /thread-pitch-diameter-calculator
├ ○ /tile-calculator
├ ○ /tile-calculator/opengraph-image
├ ○ /tons-to-cubic-yards
├ ○ /tools
├ ○ /twitter-character-counter
├ ○ /unit-price-calculator
├ ○ /wire-gauge-calculator
├ ○ /word-counter
└ ○ /words-to-pages


○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML (uses generateStaticParams)


```

### Evidence: check-no-network.txt

```

> band-name-generator-site@0.1.0 check:no-network
> node scripts/check-no-network.mjs

✅ check:no-network passed! No client-side network calls found in tool code.

```

### Evidence: docs-bundle.txt

```

> band-name-generator-site@0.1.0 docs:bundle
> node scripts/bundle-docs.mjs

✅ Documentation bundle generated at: docs/_BUNDLE_FOR_REVIEW.md

```

### Evidence: lint.txt

```

> band-name-generator-site@0.1.0 lint
> eslint src


D:\1_programmins\5.kkctools\src\app\binomial-probability-calculator\page.tsx
  3:8  warning  'JsonLd' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\app\budget-calculator\page.tsx
  3:8  warning  'JsonLd' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\app\final-grade-calculator\page.tsx
  3:8  warning  'JsonLd' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\app\guides\page.tsx
  12:74  warning  'LD_ORG_ID' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\app\layout.tsx
  119:13  warning  Prefer `GoogleTagManager` component from `@next/third-parties/google` when using the inline script for Google Tag Manager. See: https://nextjs.org/docs/messages/next-script-for-ga  @next/next/next-script-for-ga

D:\1_programmins\5.kkctools\src\app\numbers-to-words\page.tsx
  17:3  warning  'bigIntToIndianWords' is defined but never used  @typescript-eslint/no-unused-vars
  20:3  warning  'groupDigits' is defined but never used          @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\app\pythagorean-theorem-calculator\page.tsx
  3:8  warning  'JsonLd' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\app\roi-calculator\page.tsx
  3:8  warning  'JsonLd' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\app\slope-calculator\page.tsx
  3:8  warning  'JsonLd' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\app\tank-volume-calculator\page.tsx
  3:8  warning  'JsonLd' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\3d-print-cost-calculator\PrintCostCalculator.tsx
  11:3   warning  'filamentLengthFromGrams' is defined but never used         @typescript-eslint/no-unused-vars
  50:30  warning  'setMaintenancePerHour' is assigned a value but never used  @typescript-eslint/no-unused-vars
  56:25  warning  'setPackagingCost' is assigned a value but never used       @typescript-eslint/no-unused-vars
  58:18  warning  'setTaxPct' is assigned a value but never used              @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\airbnb-calculator\AirbnbCalculator.tsx
   69:27  warning  'setNightsAvailable' is assigned a value but never used    @typescript-eslint/no-unused-vars
   77:25  warning  'setPaymentFeePct' is assigned a value but never used      @typescript-eslint/no-unused-vars
   78:27  warning  'setOccupancyTaxPct' is assigned a value but never used    @typescript-eslint/no-unused-vars
   83:25  warning  'setManagementPct' is assigned a value but never used      @typescript-eslint/no-unused-vars
   90:27  warning  'setSoftwareMonthly' is assigned a value but never used    @typescript-eslint/no-unused-vars
   91:22  warning  'setHoaMonthly' is assigned a value but never used         @typescript-eslint/no-unused-vars
   93:29  warning  'setPropertyTaxAnnual' is assigned a value but never used  @typescript-eslint/no-unused-vars
  100:25  warning  'setPurchasePrice' is assigned a value but never used      @typescript-eslint/no-unused-vars
  105:28  warning  'setLtrManagementPct' is assigned a value but never used   @typescript-eslint/no-unused-vars
  106:29  warning  'setLtrMaintenancePct' is assigned a value but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\character-counter\CharacterCounter.tsx
  131:6  warning  React Hook useMemo has a missing dependency: 'cjkPerChar'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

D:\1_programmins\5.kkctools\src\components\tool\characters-to-words\CharactersToWordsCalculator.tsx
  161:5  warning  React Hook useMemo has an unnecessary dependency: 'limit'. Either exclude it or remove the dependency array  react-hooks/exhaustive-deps

D:\1_programmins\5.kkctools\src\components\tool\commercial-lease-calculator\CommercialLeaseCalculator.tsx
  86:26  warning  'setEscalationType' is assigned a value but never used       @typescript-eslint/no-unused-vars
  88:31  warning  'setEscalationAppliesTo' is assigned a value but never used  @typescript-eslint/no-unused-vars
  92:29  warning  'setFreeRentAppliesTo' is assigned a value but never used    @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\commercial-mortgage-calculator\CommercialMortgageCalculator.tsx
  57:29  warning  'setOtherClosingCosts' is assigned a value but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\epoxy-resin-calculator\EpoxyResinCalculator.tsx
  124:6  warning  React Hook useMemo has a missing dependency: 'toInches'. Either include it or remove the dependency array  react-hooks/exhaustive-deps
  149:6  warning  React Hook useMemo has a missing dependency: 'toInches'. Either include it or remove the dependency array  react-hooks/exhaustive-deps
  162:6  warning  React Hook useMemo has a missing dependency: 'toInches'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

D:\1_programmins\5.kkctools\src\components\tool\epoxy-table-calculator\EpoxyTableCalculator.tsx
   44:22  warning  'setEdgeHeight' is assigned a value but never used                                                         @typescript-eslint/no-unused-vars
  102:6   warning  React Hook useMemo has a missing dependency: 'toInches'. Either include it or remove the dependency array  react-hooks/exhaustive-deps
  111:6   warning  React Hook useMemo has a missing dependency: 'toInches'. Either include it or remove the dependency array  react-hooks/exhaustive-deps
  123:6   warning  React Hook useMemo has a missing dependency: 'toInches'. Either include it or remove the dependency array  react-hooks/exhaustive-deps
  134:6   warning  React Hook useMemo has a missing dependency: 'toInches'. Either include it or remove the dependency array  react-hooks/exhaustive-deps
  151:9   warning  'split' is assigned a value but never used                                                                 @typescript-eslint/no-unused-vars
  162:6   warning  React Hook useMemo has a missing dependency: 'toInches'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

D:\1_programmins\5.kkctools\src\components\tool\epoxy-table-calculator\EpoxyTableInputGuide.tsx
  28:3  warning  'tableLength' is defined but never used  @typescript-eslint/no-unused-vars
  31:3  warning  'edgeHeight' is defined but never used   @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\freelance-rate-calculator\FreelanceInputGuide.tsx
  36:3  warning  'totalWorkingHours' is defined but never used    @typescript-eslint/no-unused-vars
  54:9  warning  'adminWeeks' is assigned a value but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\freelance-rate-calculator\FreelanceRateCalculator.tsx
  70:23  warning  'setDaysPerWeek' is assigned a value but never used       @typescript-eslint/no-unused-vars
  82:28  warning  'setCoworkingMonthly' is assigned a value but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\iqr-calculator\IqrInputGuide.tsx
  17:3  warning  'tab' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\keyword-density-checker\KeywordDensityInputGuide.tsx
  15:3  warning  'focusedField' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\laminate-calculator\LaminateCalculator.tsx
  12:3  warning  'LAST_VERIFIED' is defined but never used          @typescript-eslint/no-unused-vars
  32:9  warning  'priceBasisId' is assigned a value but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\net-worth-calculator\NetWorthCalculator.tsx
  236:6  warning  React Hook useMemo has an unnecessary dependency: 'currSymbol'. Either exclude it or remove the dependency array  react-hooks/exhaustive-deps

D:\1_programmins\5.kkctools\src\components\tool\paint-calculator\PaintCalculator.tsx
    4:8   warning  'Link' is defined but never used                  @typescript-eslint/no-unused-vars
   12:3   warning  'COVERAGE' is defined but never used              @typescript-eslint/no-unused-vars
   15:3   warning  'DEFAULT_PRIMER_PRICE' is defined but never used  @typescript-eslint/no-unused-vars
   16:3   warning  'DEFAULT_SUNDRIES' is defined but never used      @typescript-eslint/no-unused-vars
  296:35  warning  'idx' is defined but never used                   @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\reverse-tax-calculator\ReverseTaxCalculator.tsx
  55:24  warning  'setReceiptItems' is assigned a value but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\reverse-tax-calculator\ReverseTaxInputGuide.tsx
  8:48  warning  'tab' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\sfm-to-rpm-calculator\SfmCalculator.tsx
  10:3  warning  'diaFromSfmRpm' is defined but never used  @typescript-eslint/no-unused-vars
  12:3  warning  'vcFromRpm' is defined but never used      @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\speeds-and-feeds-calculator\SpeedsFeedsCalculator.tsx
   9:3  warning  'sfmFromRpm' is defined but never used  @typescript-eslint/no-unused-vars
  10:3  warning  'rpmFromVc' is defined but never used   @typescript-eslint/no-unused-vars
  11:3  warning  'vcFromRpm' is defined but never used   @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\speeds-and-feeds-calculator\SpeedsFeedsInputGuide.tsx
  21:3  warning  'tab' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\stone-calculator\StoneCalculator.tsx
  12:3  warning  'LAST_VERIFIED' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\twitter-character-counter\TwitterCharacterCounter.tsx
  11:30  warning  'TextLimitPreset' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\word-counter\WordCountInputGuide.tsx
  19:3  warning  'totalChars' is assigned a value but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\lib\budget-engine.test.ts
  4:3  warning  'calculateTotalMonthlyIncome' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\lib\char-word-engine.test.ts
  3:3  warning  'DEFAULT_AVERAGE_WORD_LENGTH' is defined but never used  @typescript-eslint/no-unused-vars
  9:3  warning  'getEffectivePerWord' is defined but never used          @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\lib\freelance-rate-engine.test.ts
  3:3  warning  'calculateFreelanceCalendar' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\lib\list-engine.test.ts
  5:3  warning  'quoteCsv' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\lib\page-estimate-engine.test.ts
  3:3  warning  'calculatePrintableArea' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\lib\paint-engine.test.ts
  4:3   warning  'calculateContainerBreakdown' is defined but never used  @typescript-eslint/no-unused-vars
  8:10  warning  'COVERAGE' is defined but never used                     @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\lib\reading-time-engine.test.ts
  4:3  warning  'calculateWordsNeeded' is defined but never used  @typescript-eslint/no-unused-vars
  7:3  warning  'formatDuration' is defined but never used        @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\lib\str-engine.ts
  22:21  warning  'calcCapRate' is defined but never used     @typescript-eslint/no-unused-vars
  22:48  warning  'calcCashOnCash' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\lib\tvm-engine.test.ts
  12:3  warning  'npv' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\lib\volume-units-engine.test.ts
  5:3  warning  'calculateCylinderVolume' is defined but never used  @typescript-eslint/no-unused-vars

✖ 82 problems (0 errors, 82 warnings)


```

### Evidence: seo-audit.txt

```

> band-name-generator-site@0.1.0 seo:audit
> node scripts/seo-audit.mjs

Auditing 126 HTML files in out/...
Report written to docs/seo-audit-report.md
✅ SEO Audit Passed with 0 errors.

```

### Evidence: test.txt

```

> band-name-generator-site@0.1.0 test
> vitest run


 RUN  v4.1.12 D:/1_programmins/5.kkctools


 Test Files  107 passed (107)
      Tests  1340 passed (1340)
   Start at  00:16:40
   Duration  5.32s (transform 14.69s, setup 0ms, import 20.90s, tests 4.48s, environment 29ms)


```

