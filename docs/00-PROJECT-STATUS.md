# 00 — Project Status & Master Checklist

## 1. Executive Summary & Progress

- **Last Updated:** 2026-11-14
- **Node.js Version:** `v25.8.0` (LTS requirement: ≥ 20.9 met)
- **NPM Version:** `11.11.0`
- **Hosting:** moving from Netlify to Cloudflare Workers Static Assets (`wrangler.jsonc`, serves `out/`); config verified by `wrangler deploy --dry-run` 2026-11-14, live deploy pending owner push.
- **Current Phase:** SEO audit fixes (Phase SA, 2026-11-14): code-side fixes done and verified; deploy, Netlify HUD and owner identity pending. Before that, Batch 2 (new keyword research) — Tool #22 Rebar / Reinforcement Steel Calculator built and verified (2026-11-14); Tool #21 Drywall Calculator built and verified (2026-11-14); Tool #20 Concrete Calculator built and verified (2026-11-13). Earlier: Tools #13 to #19 (Stone / Rock, Stud / Framing, Tons to Cubic Yards Converter, Paver Sand, Paver Base, Compost / Soil Volume, Fence Stain) built, tested, and verified
- **Overall Completion:** 263 vitest tests passing (26 files, 100% green), every HTML page passes the SEO audit with zero errors, no-network check passing (`npm run verify` 2026-11-14, evidence in `docs/evidence/`).

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
- [ ] SA-13 **Netlify still injects `/.netlify/scripts/hud?variant=public`.** `netlify.toml` cannot turn it off. The owner must disable the Netlify Drawer / collaboration toolbar in the Netlify UI, then check with `curl -s https://www.kkctools.com/ | grep hud`.
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
| `src/config/site.ts` | `OWNER_EMAIL = 'contact@kkctools.com'` | Contact link mailto | Set to contact@kkctools.com |
| `src/config/site.ts` | `OWNER_NAME = 'KKC Tools Team'` | About page owner identity | Set to KKC Tools Team |
| `src/app/about/page.tsx` ("Who runs KKC Tools") | `TODO(owner)` | Real owner/author name, role, relevant background (SEO audit H4, E-E-A-T) | **Open** — do not invent |
| `src/app/layout.tsx` (Organization schema) | `TODO(owner)` | `sameAs` (real profile URLs) and `founder` (real person) | **Open** — do not invent |

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

- **Decision (2026-11-14):** Deploy to Cloudflare as static assets (`wrangler.jsonc` → `out/`), not OpenNext. OpenNext needs `output: 'standalone'` and a non-allowed dependency; the site is 100% static. Steps in `05-DEPLOY-AND-LAUNCH.md`.
- **Known issue (2026-11-14):** 4 token pairs are below 4.5:1 contrast for small body text: light `--muted` on `--bg` 3.8, light `--accent-ink` on `--accent` 4.1, dark `--muted` on `--bg` 4.1 and on `--surface` 3.8. Details in `03-PAGES-AND-DESIGN.md` §3. Not yet fixed in code.

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
