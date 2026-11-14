# 06 — Changelog

All notable changes to this project will be documented in this file, sorted newest first.

---

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
