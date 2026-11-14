# 01 — Features & Tool Directory

## 1. Overview
KKC Tools is a fast multi-tool website. Every tool runs fully in the browser (no API, no server, no network calls — enforced by `npm run check:no-network`).
- **Live tools:** 27 — 1 generator, 1 estimate template, 25 calculators/converters (source: `src/lib/routes.ts`, `src/app/`).
- **Tests:** 342 Vitest tests passing (`npm run verify`, 2026-11-14).
- **Hosting:** static export (`out/`), deployed to Cloudflare Workers Static Assets (see `05-DEPLOY-AND-LAUNCH.md`).

---

## 2. Tool Directory (live)

| # | Tool | URL | UI component (`src/components/tool/`) | Engine (`src/lib/`) |
|---:|---|---|---|---|
| 1 | Band Name Generator (+ 6 genre pages) | `/band-name-generator/` | `band-name-generator/` | `generator/` |
| 2 | Construction Estimate Template | `/construction-estimate-template/` | `construction-estimate/` | (in component) |
| 3 | Asphalt Calculator | `/asphalt-calculator/` | `asphalt-calculator/` | `volume-engine.ts` |
| 4 | Cubic Yard Calculator | `/cubic-yard-calculator/` | `cubic-yard-calculator/` | `volume-engine.ts` |
| 5 | Concrete Calculator | `/concrete-calculator/` | `concrete-calculator/` | `concrete-engine.ts` |
| 6 | Rebar Calculator | `/rebar-calculator/` | `rebar-calculator/` | `rebar-engine.ts` |
| 7 | Drywall Calculator | `/drywall-calculator/` | `drywall-calculator/` | `drywall-engine.ts` |
| 8 | Sand Calculator | `/sand-calculator/` | `sand-calculator/` | `sand-engine.ts` |
| 9 | Fill Dirt Calculator | `/fill-dirt-calculator/` | `fill-dirt-calculator/` | `fill-dirt-engine.ts` |
| 10 | Linear Foot Calculator | `/linear-foot-calculator/` | `linear-foot-calculator/` | `linear-foot-engine.ts` |
| 11 | Rafter Calculator | `/rafter-calculator/` | `rafter-calculator/` | `rafter-engine.ts` |
| 12 | Square Footage Calculator | `/square-footage-calculator/` | `square-footage-calculator/` | `square-footage-engine.ts` |
| 13 | Cinder Block Calculator | `/cinder-block-calculator/` | `cinder-block-calculator/` | `cinder-block-engine.ts` |
| 14 | Brick Calculator (US + Metric) | `/brick-calculator/` | `brick-calculator/` | `brick-engine.ts`, `brick-metric-engine.ts` |
| 15 | Paint Cost Calculator | `/paint-cost-calculator/` | `paint-calculator/` | `paint-engine.ts` |
| 16 | Tile Calculator | `/tile-calculator/` | `tile-calculator/` | `tile-engine.ts` |
| 17 | Laminate Flooring Calculator | `/laminate-flooring-calculator/` | `laminate-calculator/` | `laminate-engine.ts` |
| 18 | Stone Calculator | `/stone-calculator/` | `stone-calculator/` | `stone-engine.ts` |
| 19 | Stud Calculator | `/stud-calculator/` | `stud-calculator/` | `stud-engine.ts` |
| 20 | Tons to Cubic Yards Converter | `/tons-to-cubic-yards/` | `tons-yards-converter/` | `tons-yards-engine.ts` |
| 21 | Paver Sand Calculator | `/paver-sand-calculator/` | `paver-sand-calculator/` | `paver-sand-engine.ts` |
| 22 | Paver Base Calculator | `/paver-base-calculator/` | `paver-base-calculator/` | `paver-base-engine.ts` |
| 23 | Compost Calculator | `/compost-calculator/` | `compost-calculator/` | `compost-engine.ts` |
| 24 | Fence Stain Calculator | `/fence-stain-calculator/` | `fence-stain-calculator/` | `fence-stain-engine.ts` |
| 25 | Lawn Mowing Cost Calculator (homeowner + pro views) | `/lawn-mowing-cost-calculator/` | `lawn-mowing-calculator/` | `lawn-mowing-engine.ts` |
| 26 | Shingle Roof Calculator (sections, bundles + full accessory list) | `/shingle-calculator/` | `shingle-calculator/` | `shingle-engine.ts` |
| 27 | Board and Batten Calculator (accent wall + exterior siding) | `/board-and-batten-calculator/` | `board-batten-calculator/` | `board-batten-engine.ts` |

Shared helpers: `area-depth-engine.ts`, `tools-catalog.ts` (catalog for `/tools/` and home), `storage.ts` (safe localStorage), `guides.ts`.
Every calculator page has a "How This Calculator Works" block (formula, defaults, sources, last-updated date, correction link).

Planned tools (not built): Batches 2–8 in `docs/keywords analysis/` — each has a competitor-analysis file with a page blueprint.

---

## 3. Tool #1: Band Name Generator Features

| Feature ID | Feature Name | Description | Status | Code Path |
|---|---|---|---|---|
| **F1** | Genre Selector | Radio chips: Any, Rock, Metal, Heavy Metal, Punk, Pop, K-pop, Boy Band, Indie | Done ✅ | `src/components/tool/band-name-generator/Controls.tsx` |
| **F2** | Name Style | Select: Any, "The ...", Two words, One word, "X of Y" | Done ✅ | `Controls.tsx` |
| **F3** | Batch Count | 5, 10 (default), 20 names per generation | Done ✅ | `Controls.tsx` |
| **F4** | Starts With | A–Z letter filter on first significant word | Done ✅ | `Controls.tsx` |
| **F5** | Must Include Word | Custom word injected into a compatible template, sanitized & filtered | Done ✅ | `Controls.tsx` |
| **F6** | ALL CAPS Toggle | Capitalize output (default ON for K-pop) | Done ✅ | `Controls.tsx` |
| **F7** | Generate Action | Button + Enter key; avoids the last 50 names | Done ✅ | `Controls.tsx` |
| **F8** | Results List | Styled list with copy, save and check buttons | Done ✅ | `Results.tsx` |
| **F9** | Copy Actions | Copy and copy-all with fallback and non-shifting "Copied" alert | Done ✅ | `ResultRow.tsx` |
| **F10** | Saved Names Panel | localStorage favorites with copy-all & .txt download | Done ✅ | `SavedPanel.tsx` |
| **F11** | Availability Check Menu | Google, Spotify, Bandcamp, YouTube search links with disclaimer | Done ✅ | `CheckMenu.tsx` |
| **F12** | Constraint Warning | "Try fewer filters" when constraints yield fewer names | Done ✅ | `Results.tsx` |
| **F13** | Server Starter Names | Curated starter names in static HTML (no hydration mismatch) | Done ✅ | `BandNameGenerator.tsx` |

### Core Engine Modules (`src/lib/generator/`)
- `types.ts`: GenreId, StyleId, GenerateOptions, GenerateResult.
- `rng.ts`: Seeded PRNG (mulberry32).
- `pools/*.ts`: Word pools for all 9 genres (80+ words each).
- `patterns.ts`: Weighted templates per genre (8+ each).
- `blocklist.ts`: 260+ famous band/artist names to avoid.
- `offensive.ts`: Slur/explicit sanitization filter.
- `engine.ts`: Name assembly and constraint validation.
