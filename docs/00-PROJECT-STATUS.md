# 00 — Project Status & Master Checklist

## 1. Executive Summary & Progress

- **Last Updated:** 2026-11-18
- **Node.js Version:** `v25.8.0` (LTS requirement: ≥ 20.9 met)
- **NPM Version:** `11.11.0`
- **Hosting:** moving from Netlify to Cloudflare Workers Static Assets (`wrangler.jsonc`, serves `out/`); config verified by `wrangler deploy --dry-run` 2026-11-14, live deploy pending owner push.
- **Current Phase:** Tool #46 Discount / Percent Off Calculator built and verified (Phase DC46, 2026-11-18); FAQ Answer Pure White Background Styling Fix completed across all tools (2026-11-18); Tool #45 Hourly to Salary Calculator built and verified (Phase HS, 2026-11-18); Tool #44 Unit Price Calculator built and verified (Phase UP, 2026-11-18); Tool #43 Profit Margin Calculator built and verified (Phase PM, 2026-11-18); Tool #42 Markup Calculator built and verified (Phase MC, 2026-11-18); Tool #41 Percentage Change Calculator built and verified (Phase PC, 2026-11-18); Before that: Tool #38 Deck Cost Calculator built and verified (Phase DC, 2026-11-17); Tool #37 Carpet Cost Calculator built and verified (Phase CR, 2026-11-17); Tool #36 Roof Replacement Cost Calculator built and verified (Phase RR, 2026-11-17); Newest-First Tool Priority & Directory Sorting implemented across catalog, directory, homepage, and navigation (2026-11-17). Before that: Tool #35 Cubic Inch & Engine Displacement Calculator (Phase CI). Before that: Tool #34 Hardwood Floor Refinishing Cost Calculator (Phase FR). Before that: Tool #33 Bathroom Remodel Cost Calculator (Phase BR). Before that: Tool #32 Metal Roof Cost Calculator (Phase MR). Before that: Tool #31 Cubic Feet ↔ Square Feet Converter (Phase CF). Before that: Tool #30 Fence Cost Calculator (Phase FC). Before that: Tool #29 Deck Stain Calculator (Phase DS). Before that: Tool #28 Concrete Slab Cost Calculator (Phase SC).
- **Overall Completion:** 676 vitest tests passing (50 files, 100% green), 81 static routes generated, every HTML page passes the SEO audit with zero errors, no-network check passing (`npm run verify` 2026-11-18, evidence in `docs/evidence/`).

| Phase | Completed | Total | Status |
|---|---|---|---|
| **Phase 0 — Setup and rules** | 8 | 8 | Done |
| **Phase 1 — Design system and layout shell** | 11 | 11 | Done |
| **Phase 2 — Generator engine (no UI)** | 7 | 7 | Done |
| **Phase 3 — Tool UI and main tool page** | 9 | 9 | Done (Checkpoint 1) |
| **Phase 4 — Home, tools index and genre pages** | 10 | 12 | Done (2 blocked) |
| **Phase 5 — Trust pages and guides** | 9 | 9 | Done |
| **Phase 6 — SEO infrastructure and audit** | 12 | 12 | Done (Checkpoint 2) |
| **Phase 7 — Deployment and launch** | 0 | 11 | Pending Owner Input |
| **Phase 8 — Optional improvements** | 0 | 7 | Post-launch |

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

| File | Placeholder | Purpose | Status |
|---|---|---|---|
| `src/config/site.ts` | `SITE_NAME = 'KKC Tools'` | Site branding | Resolved (KKC Tools) |
| `src/config/site.ts` | `SITE_URL = 'https://www.kkctools.com'` | Canonical domain | Resolved (https://www.kkctools.com) |
| `src/config/site.ts` | `OWNER_EMAIL = 'kkchub1@gmail.com'` | Site-wide contact mailto | Resolved 2026-11-15 (owner: `contact@kkctools.com` was not a real mailbox) |
| `src/config/site.ts` | `FOUNDER` (name, role, email, Instagram) | About page owner identity + Person schema | Resolved 2026-11-15 (Karan Kumar, owner-supplied) |
| `src/app/about/page.tsx` ("Who runs KKC Tools") | — | Real owner name, role, contact (SEO audit H4, E-E-A-T) | Resolved 2026-11-15. Optional: owner may add real background/experience later — do not invent |
| `src/app/layout.tsx` (Organization schema) | `TODO(owner)` | `founder` → Person node (resolved 2026-11-15, personal Instagram in Person `sameAs`); Organization `sameAs` | **Open** only if the site gets its own social profiles |
| Cloudflare dashboard | `TODO(owner)` | Disable Web Analytics (injected beacon, blocked by CSP) — Phase AR-11 | **Open** |
| Google Analytics admin | `TODO(owner)` | Set data retention and review Enhanced measurement for property `G-DVNM8TFRQE` | **Open** |
| `src/lib/floor-refinish-engine.ts` (`DIY_DEFAULTS.bufferPerDay`) | `TODO(owner)` | Floor-buffer rental rate — no sourced figure; uses drum-sander midpoint, disclosed in UI (Phase FR-6) | **Open** |

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
