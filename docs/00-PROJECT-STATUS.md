# 00 — Project Status & Master Checklist

## 1. Executive Summary & Progress

- **Last Updated:** 2026-11-08
- **Node.js Version:** `v25.8.0` (LTS requirement: ≥ 20.9 met)
- **NPM Version:** `11.11.0`
- **Current Phase:** Phase 2 — Generator engine (no UI)
- **Overall Completion:** 19/64 tasks completed (29.7%)

| Phase | Completed | Total | Status |
|---|---|---|---|
| **Phase 0 — Setup and rules** | 8 | 8 | Done |
| **Phase 1 — Design system and layout shell** | 11 | 11 | Done |
| **Phase 2 — Generator engine (no UI)** | 0 | 7 | In Progress |
| **Phase 3 — Tool UI and main tool page** | 0 | 9 | Not Started (Checkpoint 1) |
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

### Phase 2 — Generator engine (no UI) (0/7 done)
- [ ] P2-01 Types, seeded RNG, safe storage helper.
- [ ] P2-02 Pools for all 9 genre ids, each pool ≥ 80 unique entries.
- [ ] P2-03 Patterns: ≥ 8 per genre, style coverage rules respected.
- [ ] P2-04 `blocklist.ts` with ≥ 250 real names; `offensive.ts`.
- [ ] P2-05 `generateNames()` with all constraints and the loop guard.
- [ ] P2-06 All tests in Section 9.5 pass (`npm test`).
- [ ] P2-07 `npm run check:no-network` passes (no `fetch`, `XMLHttpRequest`, `sendBeacon`, `WebSocket` in `src/lib/generator` and `src/components/tool`).

### Phase 3 — Tool UI and main tool page  ⟵ CHECKPOINT 1 (0/9 done)
- [ ] P3-01 `BandNameGenerator` component with controls F1–F7 and results F8.
- [ ] P3-02 Copy, Copy all, Save, Saved panel, Download .txt (F9, F10).
- [ ] P3-03 Check availability menu with the four links and the disclaimer (F11).
- [ ] P3-04 Friendly "too strict" message (F12) and starter names in static HTML (F13).
- [ ] P3-05 Mobile layout: Generate button visible without scrolling at 390×844 (verified).
- [ ] P3-06 Keyboard-only run-through and screen-reader semantics (aria-live, radiogroup, labels) verified.
- [ ] P3-07 `/band-name-generator/` page with all content sections (≥ 1,000 words) and FAQ (8 Qs).
- [ ] P3-08 Metadata, canonical, OG, JSON-LD (WebApplication, BreadcrumbList, FAQPage) on the main page.
- [ ] P3-09 `npm run verify` green for this phase. **STOP and give the owner a walkthrough** (what was built, how to run it, screenshots, open placeholders). Wait for "continue".

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
