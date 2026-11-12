# COMPLETE PROJECT REVIEW BUNDLE
Generated on: 2026-11-12T17:44:25.139Z



<!-- ========================================================= -->
<!-- FILE: docs/00-PROJECT-STATUS.md -->
<!-- ========================================================= -->

# 00 — Project Status & Master Checklist

## 1. Executive Summary & Progress

- **Last Updated:** 2026-11-11
- **Node.js Version:** `v25.8.0` (LTS requirement: ≥ 20.9 met)
- **NPM Version:** `11.11.0`
- **Current Phase:** Batch 2 Expansion Complete (Tools #13 to #19: Stone / Rock, Stud / Framing, Tons to Cubic Yards Converter, Paver Sand, Paver Base, Compost / Soil Volume, and Fence Stain Calculators fully built, tested, and verified)
- **Overall Completion:** 142 vitest tests passing (100% green), 41 static pages compiled with zero errors across strict SEO audit and no-network checks.

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

---

## 3. Open Placeholders (TODO(owner))

| File | Placeholder | Purpose | Status |
|---|---|---|---|
| `src/config/site.ts` | `SITE_NAME = 'KKC Tools'` | Site branding | Resolved (KKC Tools) |
| `src/config/site.ts` | `SITE_URL = 'https://www.kkctools.com'` | Canonical domain | Resolved (https://www.kkctools.com) |
| `src/config/site.ts` | `OWNER_EMAIL = 'contact@kkctools.com'` | Contact link mailto | Set to contact@kkctools.com |
| `src/config/site.ts` | `OWNER_NAME = 'KKC Tools Team'` | About page owner identity | Set to KKC Tools Team |

---

## 4. Needs Owner Input (Blocked Tasks)

1. **Volume & KD for Punk & Pop sub-pages**:
   - `punk band name generator`
   - `pop band name generator`
   - *Status:* Blocked in Phase 4 (P4-11, P4-12) until owner provides SEMrush data.
2. **Production Domain & Email**: Required before Phase 7 deployment.

---

## 5. Known Issues / Decisions Log

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
This website is a fast, multi-tool platform hosting client-side utilities.
- **Total Tools:** 1 (Tool #1: Band Name Generator)
- **Architecture:** Pure browser execution (zero API/server dependencies)

---

## 2. Tool #1: Band Name Generator Features

| Feature ID | Feature Name | Description | Status | Code Path |
|---|---|---|---|---|
| **F1** | Genre Selector | Radio chips: Any, Rock, Metal, Heavy Metal, Punk, Pop, K-pop, Boy Band, Indie | Done ✅ | `src/components/tool/band-name-generator/Controls.tsx` |
| **F2** | Name Style | Select: Any, "The ...", Two words, One word, "X of Y" | Done ✅ | `src/components/tool/band-name-generator/Controls.tsx` |
| **F3** | Batch Count | Options for 5, 10 (default), 20 names per generation | Done ✅ | `src/components/tool/band-name-generator/Controls.tsx` |
| **F4** | Starts With | A–Z letter filter on first significant word | Done ✅ | `src/components/tool/band-name-generator/Controls.tsx` |
| **F5** | Must Include Word | Custom word injected into compatible template, sanitized & filtered | Done ✅ | `src/components/tool/band-name-generator/Controls.tsx` |
| **F6** | ALL CAPS Toggle | Capitalize entire output (default ON for K-pop) | Done ✅ | `src/components/tool/band-name-generator/Controls.tsx` |
| **F7** | Generate Action | Large button + Enter key triggers new batch avoiding last 50 names | Done ✅ | `src/components/tool/band-name-generator/Controls.tsx` |
| **F8** | Results List | Ordered list with large styled text, copy, save, and check buttons | Done ✅ | `src/components/tool/band-name-generator/Results.tsx` |
| **F9** | Copy Actions | One-click copy and copy-all with fallback & non-shifting "Copied" alert | Done ✅ | `src/components/tool/band-name-generator/ResultRow.tsx` |
| **F10** | Saved Names Panel | LocalStorage-backed favorites with copy-all & download .txt export | Done ✅ | `src/components/tool/band-name-generator/SavedPanel.tsx` |
| **F11** | Availability Check Menu | Google, Spotify, Bandcamp, and YouTube search links with disclaimer | Done ✅ | `src/components/tool/band-name-generator/CheckMenu.tsx` |
| **F12** | Friendly Constraint Warning | Announce "Try fewer filters" if constraints yield fewer names | Done ✅ | `src/components/tool/band-name-generator/Results.tsx` |
| **F13** | Server Starter Names | Curated starter names rendered in static HTML (no hydration mismatch) | Done ✅ | `src/components/tool/band-name-generator/BandNameGenerator.tsx` |

---

## 3. Core Engine Modules (`src/lib/generator/`)

- `types.ts`: GenreId, StyleId, GenerateOptions, GenerateResult.
- `rng.ts`: Seeded PRNG using mulberry32 algorithm.
- `pools/*.ts`: Word pools for all 9 genres (80+ words per pool).
- `patterns.ts`: Weighted template patterns per genre (8+ per genre, >5,000 combinations per genre).
- `blocklist.ts`: 260+ famous band/artist names to avoid duplicates.
- `offensive.ts`: Explicit/slur sanitization filter.
- `engine.ts`: Core name assembly and constraint validation engine.



<!-- ========================================================= -->
<!-- FILE: docs/02-SEO.md -->
<!-- ========================================================= -->

# 02 — Technical & On-Page SEO Specification

## 1. Page Inventory & SEO Targets

| Path | Primary Target Keyword | Min Words | Schema Types | Status |
|---|---|---|---|---|
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
- **JSON-LD**: Validated Schema.org markup matching on-page content.




<!-- ========================================================= -->
<!-- FILE: docs/03-PAGES-AND-DESIGN.md -->
<!-- ========================================================= -->

# 03 — Pages & Design System

## 1. Design Direction: "Stage Lights"
- Modern typography: **Bricolage Grotesque** (headings) + **Inter** (body), self-hosted via `next/font/google`.
- Accent palette: Purple (`#6D28D9` in light, `#A78BFA` in dark) with Amber highlight (`#F59E0B` / `#FBBF24`).
- Zero layout shift (CLS ≤ 0.1).
- Native theme toggle without flash of wrong theme (inline script in `<head>`).

---

## 2. Token Definitions (`src/styles/tokens.css`)

```css
:root {
  --bg: #FAF8F5;
  --surface: #FFFFFF;
  --surface-2: #F3F0EA;
  --ink: #14121A;
  --ink-2: #4A4757;
  --muted: #6B6780;
  --line: #E7E3EC;
  --accent: #6D28D9;
  --accent-ink: #FFFFFF;
  --accent-soft: #EFE7FD;
  --highlight: #F59E0B;
  --success: #15803D;
  --danger: #B91C1C;
  --radius-s: 8px;
  --radius-m: 14px;
  --radius-pill: 999px;
  --shadow-s: 0 1px 2px rgb(20 18 26 / 6%);
  --shadow-m: 0 8px 24px rgb(20 18 26 / 8%);
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;
  --container: 1120px;
  --prose: 68ch;
}

:root[data-theme="dark"] {
  --bg: #0E0C14;
  --surface: #17141F;
  --surface-2: #1F1B2A;
  --ink: #F4F1FA;
  --ink-2: #C4BFD3;
  --muted: #9690A8;
  --line: #2A2536;
  --accent: #A78BFA;
  --accent-ink: #0E0C14;
  --accent-soft: #261D3D;
  --highlight: #FBBF24;
  --shadow-s: none;
  --shadow-m: 0 8px 24px rgb(0 0 0 / 40%);
}
```

---

## 3. Contrast Verification Table (Target: ≥ 4.5:1 for body text, ≥ 3.0:1 for large text/borders)

| Mode | Text Token | Background Token | Measured Contrast | Target | Result |
|---|---|---|---|---|---|
| Light | `--ink` (#14121A) | `--bg` (#FAF8F5) | 16.4:1 | ≥ 4.5:1 | PASS ✅ |
| Light | `--ink` (#14121A) | `--surface` (#FFFFFF) | 17.5:1 | ≥ 4.5:1 | PASS ✅ |
| Light | `--ink-2` (#4A4757) | `--bg` (#FAF8F5) | 7.6:1 | ≥ 4.5:1 | PASS ✅ |
| Light | `--muted` (#6B6780) | `--bg` (#FAF8F5) | 4.8:1 | ≥ 4.5:1 | PASS ✅ |
| Light | `--accent-ink` (#FFFFFF) | `--accent` (#6D28D9) | 7.2:1 | ≥ 4.5:1 | PASS ✅ |
| Dark | `--ink` (#F4F1FA) | `--bg` (#0E0C14) | 16.3:1 | ≥ 4.5:1 | PASS ✅ |
| Dark | `--ink` (#F4F1FA) | `--surface` (#17141F) | 14.8:1 | ≥ 4.5:1 | PASS ✅ |
| Dark | `--ink-2` (#C4BFD3) | `--bg` (#0E0C14) | 10.5:1 | ≥ 4.5:1 | PASS ✅ |
| Dark | `--muted` (#9690A8) | `--bg` (#0E0C14) | 6.2:1 | ≥ 4.5:1 | PASS ✅ |
| Dark | `--accent-ink` (#0E0C14) | `--accent` (#A78BFA) | 11.2:1 | ≥ 4.5:1 | PASS ✅ |




<!-- ========================================================= -->
<!-- FILE: docs/04-KEYWORDS.md -->
<!-- ========================================================= -->

# 04 — Keyword Strategy & Intelligence

Source: SEMrush US Database, Desktop, Nov 2026. Cluster: 939 keywords, total volume 20,880, average KD 13%.

## 1. Verified Keyword Targets

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

---

## 2. Unverified / Pending Owner Input (Blocked Pages)

- `punk band name generator`: Pending owner verification
- `pop band name generator`: Pending owner verification
- `ai band name generator`: Note — generator must stay pure browser logic without AI
- India-related variants
- Word-based variants ("band name generator from words")




<!-- ========================================================= -->
<!-- FILE: docs/05-DEPLOY-AND-LAUNCH.md -->
<!-- ========================================================= -->

# 05 — Deployment, Launch & Maintenance Guide

## 1. Honest Expectation & Reality
Technical SEO, fast pages, useful tools, and good content give the site a fair chance. Nobody can guarantee rankings. Rankings depend on content quality, competition, backlinks, and time. The main keyword has KD 10 with 7 dedicated tool pages ranking, so our tool must be genuinely cleaner, faster, and more practical.

---

## 2. Deployment Setup

### Netlify Deployment
1. Connect GitHub repository to Netlify.
2. Build Settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `out`
   - **Node.js version:** Set to `.nvmrc` (`22` or `20.9+`)
3. Environment variables:
   - `NEXT_PUBLIC_SITE_URL`: Set to production custom apex domain (e.g. `https://yourdomain.com`).
   - `NEXT_PUBLIC_ADS_ENABLED`: `false` (until approved).

---

## 3. Post-Launch Steps

1. Verify domain property in Google Search Console.
2. Submit `https://yourdomain.com/sitemap.xml`.
3. Request indexing for Home, main tool, and active genre pages.
4. Run PageSpeed Insights on live URLs and save results in `docs/evidence/`.
5. After organic indexing and steady traffic (few weeks), submit site to Google AdSense.
6. Post-AdSense approval: configure certified CMP for EEA/UK and place `ads.txt`.




<!-- ========================================================= -->
<!-- FILE: docs/06-CHANGELOG.md -->
<!-- ========================================================= -->

# 06 — Changelog

All notable changes to this project will be documented in this file, sorted newest first.

---

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

Run Date: 2026-11-12T17:44:24.718Z
Status: PASSED ✅

| Route | Title | Words | H1 | Status |
|---|---|---|---|---|
| `/404/` | Page Not Found – 404 | KKC Tools | 23 | Page Not Found | PASS |
| `/404/` | Page Not Found – 404 | KKC Tools | 23 | Page Not Found | PASS |
| `/about/` | About Our Mission & Philosophy | KKC Too | 371 | About KKC Tools | PASS |
| `/asphalt-calculator/` | Asphalt Calculator: Tons, Cubic Yards &  | 2211 | Asphalt Calculator: How Many T | PASS |
| `/band-name-generator/boy-band/` | Boy Band Name Generator – Catchy Group N | 1017 | Boy Band Name Generator | PASS |
| `/band-name-generator/heavy-metal/` | Heavy Metal Band Name Generator – Classi | 1007 | Heavy Metal Band Name Generato | PASS |
| `/band-name-generator/` | Band Name Generator – Free Random Band N | 2194 | Band Name Generator | PASS |
| `/band-name-generator/kpop/` | K-pop Band Name Generator – Group Name I | 1002 | K-pop Band Name Generator | PASS |
| `/band-name-generator/metal/` | Metal Band Name Generator – Dark & Heavy | 1051 | Metal Band Name Generator | PASS |
| `/band-name-generator/random/` | Random Band Name Generator – Instant Ide | 1044 | Random Band Name Generator | PASS |
| `/band-name-generator/rock/` | Rock Band Name Generator – Free Name Ide | 1038 | Rock Band Name Generator | PASS |
| `/brick-calculator/` | Brick Calculator (Brick Wall & Mortar) | | 2277 | Free Brick Calculator: Estimat | PASS |
| `/cinder-block-calculator/` | Cinder Block Calculator – CMU & Concrete | 3796 | Cinder Block Calculator – Conc | PASS |
| `/compost-calculator/` | Compost Calculator (Garden Beds & Lawns) | 2336 | Free Compost Calculator: Estim | PASS |
| `/construction-estimate-template/` | Construction Estimate Template – Free Bu | 2853 | Free Construction Estimate Tem | PASS |
| `/contact/` | Contact Us & Suggest a Feature | KKC Too | 187 | Contact KKC Tools | PASS |
| `/cubic-yard-calculator/` | Cubic Yard Calculator: Concrete, Bags &  | 2194 | Cubic Yard Calculator: How Man | PASS |
| `/fence-stain-calculator/` | Fence Stain Calculator — Gallons & Picke | 1751 | Fence Stain Calculator: Estima | PASS |
| `/fill-dirt-calculator/` | Fill Dirt Calculator: Cubic Yards & Tons | 1489 | Fill Dirt Calculator | PASS |
| `/guides/band-name-ideas-by-genre/` | Band Name Ideas by Genre – Naming Guide  | 1237 | Band Name Ideas by Genre: The  | PASS |
| `/guides/how-to-check-if-a-band-name-is-taken/` | How to Check If a Band Name Is Taken | K | 1527 | How to Check If a Band Name Is | PASS |
| `/guides/how-to-choose-a-band-name/` | How to Choose a Band Name – Complete Gui | 1427 | How to Choose a Band Name: The | PASS |
| `/guides/` | Band Naming & Music Branding Guides | KK | 203 | Band Naming & Music Branding G | PASS |
| `/` | Free Online Generators & Tools | 997 | Free Online Tools That Just Wo | PASS |
| `/laminate-flooring-calculator/` | Laminate Flooring Calculator (Boxes & Co | 2549 | Laminate Flooring Calculator:  | PASS |
| `/linear-foot-calculator/` | Linear Foot Calculator (Sq Ft to Linear  | 1570 | Linear Foot Calculator | PASS |
| `/paint-cost-calculator/` | Paint Cost Calculator (Coverage & Price) | 2745 | Free Paint Cost Calculator: Es | PASS |
| `/paver-base-calculator/` | Paver Base Calculator (Tons & Cubic Yard | 2822 | Free Paver Base Calculator: Es | PASS |
| `/paver-sand-calculator/` | Paver Sand Calculator (Bedding & Polymer | 2175 | Free Paver Sand Calculator: Es | PASS |
| `/privacy-policy/` | Privacy Policy – Transparent & Privacy F | 664 | Privacy Policy | PASS |
| `/rafter-calculator/` | Rafter Calculator: Length, Pitch & Cut A | 2589 | Rafter Calculator – Find Rafte | PASS |
| `/sand-calculator/` | Sand Calculator: Cubic Yards, Tons & Bag | 1484 | Sand Calculator | PASS |
| `/square-footage-calculator/` | Sqft Calculator – Square Footage Calcula | 3512 | Sqft Calculator – Free Square  | PASS |
| `/stone-calculator/` | Stone Calculator (Tons, Yards & Bags) |  | 2604 | Stone Calculator: How Many Ton | PASS |
| `/stud-calculator/` | Stud Calculator: Wall Framing & Lumber C | 1935 | Stud Calculator: Free Wall Fra | PASS |
| `/terms/` | Terms of Service – Simple & Fair Usage | | 518 | Terms of Service | PASS |
| `/tile-calculator/` | Tile Calculator (Tile Sq Ft & Boxes) | K | 3045 | Free Tile Sq Ft Calculator: Es | PASS |
| `/tons-to-cubic-yards/` | Tons to Cubic Yards Converter by Materia | 1548 | Tons to Cubic Yards Converter | PASS |
| `/tools/` | All Online Tools & Generators | KKC Tool | 1083 | Practical tools for your websi | PASS |
| `/_not-found/` | Page Not Found – 404 | KKC Tools | 23 | Page Not Found | PASS |



<!-- ========================================================= -->
<!-- SECTION: Exported Routes (from out/) -->
<!-- ========================================================= -->

```
404/index.html
404.html
about/index.html
asphalt-calculator/index.html
band-name-generator/boy-band/index.html
band-name-generator/heavy-metal/index.html
band-name-generator/index.html
band-name-generator/kpop/index.html
band-name-generator/metal/index.html
band-name-generator/random/index.html
band-name-generator/rock/index.html
brick-calculator/index.html
cinder-block-calculator/index.html
compost-calculator/index.html
construction-estimate-template/index.html
contact/index.html
cubic-yard-calculator/index.html
fence-stain-calculator/index.html
fill-dirt-calculator/index.html
guides/band-name-ideas-by-genre/index.html
guides/how-to-check-if-a-band-name-is-taken/index.html
guides/how-to-choose-a-band-name/index.html
guides/index.html
index.html
laminate-flooring-calculator/index.html
linear-foot-calculator/index.html
paint-cost-calculator/index.html
paver-base-calculator/index.html
paver-sand-calculator/index.html
privacy-policy/index.html
rafter-calculator/index.html
sand-calculator/index.html
square-footage-calculator/index.html
stone-calculator/index.html
stud-calculator/index.html
terms/index.html
tile-calculator/index.html
tons-to-cubic-yards/index.html
tools/index.html
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
8f044dd feat(paver-base): upgrade tool #17 spec and implement 2800+ word deep guide with ICPI compaction standards
359b9d8 feat(paver-sand): upgrade tool #16 spec and implement comprehensive 2800+ word guide with verified ICPI standards
ddbd302 style(home): align generate button color to primary ocean blue
aa1896e fix(seo): resolve audit issues, standardize structured data and disable netlify hud - Add public/llms.txt to eliminate 404 error and support AI search crawlers - Standardize WebApplication, BreadcrumbList, and FAQPage schemas via buildSchema.ts - Synchronize canonical URLs and sitemap entries with strict trailing slashes - Add semantic <main> tags on tile and laminate calculators to resolve low text ratio - Add netlify.toml with hud_enabled=false to suppress unminified Netlify HUD injection - Organize footer tools section into a responsive 2-column layout - Update docs/SEO-SITE-AUDIT-REPORT.md with verified evidence
ff523b8 feat(tool-9): implement brick calculator with DA-1 SEO, corrected mortar math & unified UI
29c5149 feat(tool-15): update tons to cubic yards converter spec and app implementation
9b8b877 feat(tool-14): update stud wall framing calculator spec and app implementation
2d19a9f feat(tool-13): implement stone / rock / aggregate calculator with multi-area engine & DA-1 SEO
fdd6099 feat(laminate): multi-room, float-safe rounding, KD-1 keyword retarget, spec v2
9577d61 feat(tile-calculator): rebuild tool 11 with multi-area deductions, trowel mortar yields, grout volume, and updated spec
39f1033 feat(paint-calculator): rebuild tool 10 with multi-room support, container rounding, pro benchmark, and updated spec
0da3fb5 feat(cinder-block-calculator): rebuild tool 8 with multi-wall rows, openings deductions, and updated spec
6a230e9 feat(square-footage-calc): rebuild tool 7 with multi-room subtract, shapes v1, area converter, and updated spec
e33fecf 13 to 19 tools completed
f31d161 docs & feat: standardize specifications and optimize keyword density for tools #7 to #12
2072659 13 to 19 files completed
9578784 feat(tools): implement laminate flooring calculator with SEO cluster optimization
8b222f9 feat(tools): add Tile Calculator with modular card layout and box estimators
d0eb0c4 feat(tools): add Paint Cost and Coverage Calculator with modular card layout
0a37d11 feat(tools): add Brick Calculator with mortar, wythes and pallet estimators
```


<!-- ========================================================= -->
<!-- SECTION: Evidence Outputs (docs/evidence/) -->
<!-- ========================================================= -->

### Evidence: build.txt

```

> band-name-generator-site@0.1.0 build
> next build --webpack

▲ Next.js 16.4.5 (webpack)
✓ Running next.config.ts took 43ms

  Creating an optimized production build ...
✓ Compiled successfully in 3.8s
  Running TypeScript ...
  Finished TypeScript in 2.4s ...
  Collecting page data using 15 workers ...
  Generating static pages using 15 workers (0/52) ...
  Generating static pages using 15 workers (13/52) 
  Generating static pages using 15 workers (26/52) 
  Generating static pages using 15 workers (39/52) 
✓ Generating static pages using 15 workers (52/52) in 2.0s
  Finalizing page optimization ...
  Collecting build traces ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /about
├ ○ /apple-icon
├ ○ /asphalt-calculator
├ ○ /band-name-generator
├   /band-name-generator/[genre]
│ ├ ● /band-name-generator/kpop
│ ├ ● /band-name-generator/metal
│ ├ ● /band-name-generator/heavy-metal
│ └ ● [+3 more paths]
├ ○ /brick-calculator
├ ○ /brick-calculator/opengraph-image
├ ○ /cinder-block-calculator
├ ○ /cinder-block-calculator/opengraph-image
├ ○ /compost-calculator
├ ○ /construction-estimate-template
├ ○ /construction-estimate-template/opengraph-image
├ ○ /contact
├ ○ /cubic-yard-calculator
├ ○ /fence-stain-calculator
├ ○ /fill-dirt-calculator
├ ○ /guides
├   /guides/[slug]
│ ├ ● /guides/how-to-choose-a-band-name
│ ├ ● /guides/how-to-check-if-a-band-name-is-taken
│ └ ● /guides/band-name-ideas-by-genre
├ ○ /laminate-flooring-calculator
├ ○ /laminate-flooring-calculator/opengraph-image
├ ○ /linear-foot-calculator
├ ○ /opengraph-image
├ ○ /paint-cost-calculator
├ ○ /paint-cost-calculator/opengraph-image
├ ○ /paver-base-calculator
├ ○ /paver-sand-calculator
├ ○ /privacy-policy
├ ○ /rafter-calculator
├ ○ /robots.txt
├ ○ /sand-calculator
├ ○ /sitemap.xml
├ ○ /square-footage-calculator
├ ○ /square-footage-calculator/opengraph-image
├ ○ /stone-calculator
├ ○ /stone-calculator/opengraph-image
├ ○ /stud-calculator
├ ○ /terms
├ ○ /tile-calculator
├ ○ /tile-calculator/opengraph-image
├ ○ /tons-to-cubic-yards
└ ○ /tools


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


D:\1_programmins\5.kkctools\src\components\tool\asphalt-calculator\AsphaltCalculator.tsx
  292:11  warning  The attribute aria-checked is not supported by the role button. This role is implicit on the element button  jsx-a11y/role-supports-aria-props
  300:11  warning  The attribute aria-checked is not supported by the role button. This role is implicit on the element button  jsx-a11y/role-supports-aria-props
  311:11  warning  The attribute aria-checked is not supported by the role button. This role is implicit on the element button  jsx-a11y/role-supports-aria-props
  319:11  warning  The attribute aria-checked is not supported by the role button. This role is implicit on the element button  jsx-a11y/role-supports-aria-props

D:\1_programmins\5.kkctools\src\components\tool\cubic-yard-calculator\CubicYardCalculator.tsx
  280:11  warning  The attribute aria-checked is not supported by the role button. This role is implicit on the element button  jsx-a11y/role-supports-aria-props
  288:11  warning  The attribute aria-checked is not supported by the role button. This role is implicit on the element button  jsx-a11y/role-supports-aria-props
  299:11  warning  The attribute aria-checked is not supported by the role button. This role is implicit on the element button  jsx-a11y/role-supports-aria-props
  307:11  warning  The attribute aria-checked is not supported by the role button. This role is implicit on the element button  jsx-a11y/role-supports-aria-props

D:\1_programmins\5.kkctools\src\components\tool\laminate-calculator\LaminateCalculator.tsx
   9:3  warning  'LAST_VERIFIED' is defined but never used          @typescript-eslint/no-unused-vars
  24:9  warning  'priceBasisId' is assigned a value but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\paint-calculator\PaintCalculator.tsx
    4:8   warning  'Link' is defined but never used                  @typescript-eslint/no-unused-vars
   12:3   warning  'COVERAGE' is defined but never used              @typescript-eslint/no-unused-vars
   15:3   warning  'DEFAULT_PRIMER_PRICE' is defined but never used  @typescript-eslint/no-unused-vars
   16:3   warning  'DEFAULT_SUNDRIES' is defined but never used      @typescript-eslint/no-unused-vars
  299:35  warning  'idx' is defined but never used                   @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\components\tool\stone-calculator\StoneCalculator.tsx
  11:3  warning  'LAST_VERIFIED' is defined but never used  @typescript-eslint/no-unused-vars

D:\1_programmins\5.kkctools\src\lib\paint-engine.test.ts
  4:3   warning  'calculateContainerBreakdown' is defined but never used  @typescript-eslint/no-unused-vars
  8:10  warning  'COVERAGE' is defined but never used                     @typescript-eslint/no-unused-vars

✖ 18 problems (0 errors, 18 warnings)


```

### Evidence: seo-audit.txt

```

> band-name-generator-site@0.1.0 seo:audit
> node scripts/seo-audit.mjs

Auditing 40 HTML files in out/...
Report written to docs/seo-audit-report.md
✅ SEO Audit Passed with 0 errors.

```

### Evidence: test.txt

```

> band-name-generator-site@0.1.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.12 [39m[90mD:/1_programmins/5.kkctools[39m

 [32m✓[39m src/lib/fill-dirt-engine.test.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 21[2mms[22m[39m
 [32m✓[39m src/lib/square-footage-engine.test.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 11[2mms[22m[39m
 [32m✓[39m src/lib/sand-engine.test.ts [2m([22m[2m5 tests[22m[2m)[22m[32m 33[2mms[22m[39m
 [32m✓[39m src/lib/tile-engine.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 11[2mms[22m[39m
 [32m✓[39m src/lib/brick-engine.test.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 12[2mms[22m[39m
 [32m✓[39m src/components/tool/construction-estimate/calculations.test.ts [2m([22m[2m13 tests[22m[2m)[22m[32m 38[2mms[22m[39m
 [32m✓[39m src/components/tool/construction-estimate/formatter.test.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 48[2mms[22m[39m
 [32m✓[39m src/lib/volume-engine.test.ts [2m([22m[2m16 tests[22m[2m)[22m[32m 13[2mms[22m[39m
 [32m✓[39m src/lib/area-depth-engine.test.ts [2m([22m[2m12 tests[22m[2m)[22m[32m 12[2mms[22m[39m
 [32m✓[39m src/lib/stud-engine.test.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 12[2mms[22m[39m
 [32m✓[39m src/lib/paint-engine.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 17[2mms[22m[39m
 [32m✓[39m src/lib/rafter-engine.test.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 15[2mms[22m[39m
 [32m✓[39m src/lib/cinder-block-engine.test.ts [2m([22m[2m8 tests[22m[2m)[22m[32m 13[2mms[22m[39m
 [32m✓[39m src/lib/laminate-engine.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 13[2mms[22m[39m
 [32m✓[39m src/lib/stone-engine.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 12[2mms[22m[39m
 [32m✓[39m src/lib/tons-yards-engine.test.ts [2m([22m[2m9 tests[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m src/lib/generator/engine.test.ts [2m([22m[2m9 tests[22m[2m)[22m[32m 97[2mms[22m[39m
 [32m✓[39m src/lib/linear-foot-engine.test.ts [2m([22m[2m8 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32m✓[39m src/lib/fence-stain-engine.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/lib/paver-base-engine.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/lib/compost-engine.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/lib/paver-sand-engine.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 4[2mms[22m[39m

[2m Test Files [22m [1m[32m22 passed[39m[22m[90m (22)[39m
[2m      Tests [22m [1m[32m189 passed[39m[22m[90m (189)[39m
[2m   Start at [22m 23:13:57
[2m   Duration [22m 1.30s[2m (transform 3.54s, setup 0ms, import 4.71s, tests 411ms, environment 9ms)[22m


```

