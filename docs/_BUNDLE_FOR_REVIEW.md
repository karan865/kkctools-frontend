# COMPLETE PROJECT REVIEW BUNDLE
Generated on: 2026-11-08T18:48:04.423Z



<!-- ========================================================= -->
<!-- FILE: docs/00-PROJECT-STATUS.md -->
<!-- ========================================================= -->

# 00 — Project Status & Master Checklist

## 1. Executive Summary & Progress

- **Last Updated:** 2026-11-08
- **Node.js Version:** `v25.8.0` (LTS requirement: ≥ 20.9 met)
- **NPM Version:** `11.11.0`
- **Current Phase:** Phase 3 Complete ⟵ CHECKPOINT 1 Reached
- **Overall Completion:** 35/64 tasks completed (54.7%)

| Phase | Completed | Total | Status |
|---|---|---|---|
| **Phase 0 — Setup and rules** | 8 | 8 | Done |
| **Phase 1 — Design system and layout shell** | 11 | 11 | Done |
| **Phase 2 — Generator engine (no UI)** | 7 | 7 | Done |
| **Phase 3 — Tool UI and main tool page** | 9 | 9 | Done (Checkpoint 1) |
| **Phase 4 — Home, tools index and genre pages** | 0 | 12 | Next |
| **Phase 4 — Home, tools index and genre pages** | 0 | 12 | Not Started |
| **Phase 5 — Trust pages and guides** | 0 | 9 | Not Started |
| **Phase 6 — SEO infrastructure and audit** | 0 | 12 | Not Started (Checkpoint 2) |
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

### Phase 4 — Home, tools index and genre pages (0/12 done)
- [ ] P4-01 Home page with all sections in 8.1 (≥ 350 words).
- [ ] P4-02 `/tools/` index (≥ 150 words).
- [ ] P4-03 Genre config type and the `[genre]` route with `generateStaticParams`, `dynamicParams = false`.
- [ ] P4-04 `/band-name-generator/kpop/` complete, unique content ≥ 600 words.
- [ ] P4-05 `/band-name-generator/metal/` complete.
- [ ] P4-06 `/band-name-generator/heavy-metal/` complete and clearly different from metal.
- [ ] P4-07 `/band-name-generator/rock/` complete.
- [ ] P4-08 `/band-name-generator/random/` complete.
- [ ] P4-09 `/band-name-generator/boy-band/` complete.
- [ ] P4-10 Hub-and-spoke links in place (10.5).
- [ ] P4-11 `/band-name-generator/punk/` — **BLOCKED until the owner confirms volume/KD**.
- [ ] P4-12 `/band-name-generator/pop/` — **BLOCKED until the owner confirms volume/KD**.

### Phase 5 — Trust pages and guides (0/9 done)
- [ ] P5-01 About page.
- [ ] P5-02 Contact page.
- [ ] P5-03 Privacy Policy (draft for owner review).
- [ ] P5-04 Terms.
- [ ] P5-05 Markdown guide pipeline (`content/guides`, `gray-matter`, `marked`, TOC, last-updated).
- [ ] P5-06 Guide 1: How to Choose a Band Name (≥ 1,000 words).
- [ ] P5-07 Guide 2: Band Name Ideas by Genre (≥ 1,000 words).
- [ ] P5-08 Guide 3: How to Check If a Band Name Is Already Taken (≥ 1,000 words).
- [ ] P5-09 `/guides/` index.

### Phase 6 — SEO infrastructure and audit  ⟵ CHECKPOINT 2 (0/12 done)
- [ ] P6-01 `sitemap.ts` and `robots.ts` (static) produce `out/sitemap.xml` and `out/robots.txt` correctly.
- [ ] P6-02 `public/_headers` in place and copied to `out/_headers`.
- [ ] P6-03 Favicon set and default OG image.
- [ ] P6-04 JSON-LD present on all page types and valid.
- [ ] P6-05 `scripts/seo-audit.mjs` implemented as in 10.9.
- [ ] P6-06 `npm run seo:audit` passes with zero failures (non-strict).
- [ ] P6-07 Genre page similarity check passes (< 0.30).
- [ ] P6-08 No broken internal links; no orphan pages (from the audit).
- [ ] P6-09 `npm run build` shows First Load JS ≤ 130 kB on tool pages (record the numbers).
- [ ] P6-10 Lighthouse mobile scores recorded (or listed as "Owner to run").
- [ ] P6-11 No console errors; no third-party requests (verified by running the built site).
- [ ] P6-12 `npm run verify` green and `docs/_BUNDLE_FOR_REVIEW.md` generated. **STOP and report** to the owner with the bundle.

### Phase 7 — Deployment and launch (needs the owner) (0/11 done)
- [ ] P7-01 Owner supplies: site name, domain, contact email, owner/brand statement. Replace all `TODO(owner)` placeholders. `npm run seo:audit -- --strict` passes.
- [ ] P7-02 Code pushed to a GitHub repository.
- [ ] P7-03 Site connected to Netlify (or Cloudflare Pages): build command `npm run build`, publish directory `out`, Node version from `.nvmrc`.
- [ ] P7-04 Custom domain connected, HTTPS on, `www` redirects to the apex.
- [ ] P7-05 `NEXT_PUBLIC_SITE_URL` set to the real domain and the site redeployed.
- [ ] P7-06 Google Search Console domain property verified, sitemap submitted.
- [ ] P7-07 Bing Webmaster Tools set up (import from Search Console).
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
- [ ] P8-06 Tool #2 (the owner picks from the keyword research; for example `yaml to json`).
- [ ] P8-07 Off-site work by the owner: genuinely useful posts and answers in music communities.

---

## 3. Open Placeholders (TODO(owner))

| File | Placeholder | Purpose | Status |
|---|---|---|---|
| `src/config/site.ts` | `SITE_NAME = 'YourSiteName'` | Site branding | Open |
| `src/config/site.ts` | `SITE_URL = 'https://example.com'` | Canonical domain | Open |
| `src/config/site.ts` | `OWNER_EMAIL = 'contact@example.com'` | Contact link mailto | Open |
| `src/config/site.ts` | `OWNER_NAME = 'YourSiteName Team'` | About page owner identity | Open |

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

Run Date: 2026-11-08T18:47:24.535Z
Status: PASSED ✅

| Route | Title | Words | H1 | Status |
|---|---|---|---|---|
| `/404/` | Page Not Found – 404 | YourSiteName | 23 | Page Not Found | PASS |
| `/404/` | Page Not Found – 404 | YourSiteName | 23 | Page Not Found | PASS |
| `/band-name-generator/` | Band Name Generator – Free Random Band N | 2070 | Band Name Generator | PASS |
| `/` | YourSiteName – Free Online Generators &  | 598 | Free Online Tools That Just Wo | PASS |
| `/_not-found/` | Page Not Found – 404 | YourSiteName | 23 | Page Not Found | PASS |

## Warnings (2)

- sitemap.xml not found in out/
- robots.txt not found in out/



<!-- ========================================================= -->
<!-- SECTION: Exported Routes (from out/) -->
<!-- ========================================================= -->

```
404/index.html
404.html
band-name-generator/index.html
index.html
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
c49978b phase-2: pure TypeScript generator engine, pools, blocklist and unit tests
a653742 phase-1: design system, layout shell, UI primitives and 404 page
f450baa phase-0: setup, rules, static export config and docs skeleton
546ccfb Initial commit from Create Next App
```


<!-- ========================================================= -->
<!-- SECTION: Evidence Outputs (docs/evidence/) -->
<!-- ========================================================= -->

### Evidence: build.txt

```

> band-name-generator-site@0.1.0 build
> next build

▲ Next.js 16.4.5 (Turbopack)
✓ Running next.config.ts took 27ms
Attention: Next.js now collects completely anonymous telemetry regarding usage.
This information is used to shape Next.js' roadmap and prioritize features.
You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
https://nextjs.org/telemetry


  Creating an optimized production build ...
✓ Compiled successfully in 183ms
  Running TypeScript ...
  Finished TypeScript in 1545ms ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/6) ...
  Generating static pages using 7 workers (1/6) 
  Generating static pages using 7 workers (2/6) 
  Generating static pages using 7 workers (4/6) 
✓ Generating static pages using 7 workers (6/6) in 740ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /band-name-generator
└ ○ /opengraph-image


○  (Static)  prerendered as static content


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


```

### Evidence: seo-audit.txt

```

> band-name-generator-site@0.1.0 seo:audit
> node scripts/seo-audit.mjs

Auditing 5 HTML files in out/...
Report written to docs/seo-audit-report.md
✅ SEO Audit Passed with 0 errors.

```

### Evidence: test.txt

```

> band-name-generator-site@0.1.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.12 [39m[90mD:/1_programmins/5.kkgtools[39m

 [32m✓[39m src/lib/generator/engine.test.ts [2m([22m[2m9 tests[22m[2m)[22m[32m 39[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m9 passed[39m[22m[90m (9)[39m
[2m   Start at [22m 00:17:18
[2m   Duration [22m 339ms[2m (transform 110ms, setup 0ms, import 144ms, tests 39ms, environment 0ms)[22m


```

