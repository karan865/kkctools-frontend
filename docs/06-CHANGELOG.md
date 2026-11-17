# 06 — Changelog

All notable changes to this project will be documented in this file, sorted newest first.

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
