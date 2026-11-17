# Roof Replacement Cost Calculator — Build Spec (for Antigravity / Gemini)

> **Tool:** `/roof-replacement-cost-calculator/` · Batch 2 · #19
> **Inputs used:** `19_Roof_Replacement_Cost_Calculator_Competitor_Analysis.md` (SERP read on 2026-11-14), `19.1.csv` + `19.2.csv` (Semrush, 191 keywords)
> **Written:** 2026-11-17 · **Status:** not built
> **Goal:** the most accurate roof replacement estimator in the SERP. That means:
> - correct pitch maths (competitors get it wrong);
> - every price editable;
> - no address or contact gate;
> - repair vs overlay vs full replacement in one place.
>
> The primary keyword's CPC ($7.42) is the highest in Batch 2.

---

## 0. Read this first (rules for the builder)

1. **Follow `AGENTS.md`:**
   - zero network calls;
   - no fabricated facts or prices;
   - `TODO(owner)` for owner-only data;
   - never copy competitor text, tables or prices;
   - `npm run verify` must pass.
2. **Reuse existing engines (required):**
   - `src/lib/shingle-engine.ts`: `pitchFactor`, `RoofSection`, `sectionGeometry`, `calculateShingles`, `SHINGLE_TYPES`, `UNDERLAYMENTS`, `WASTE_PRESETS`, `SQFT_PER_SQUARE`. **Use these for all roof area, squares, bundles and the materials list. Do not write a second pitch formula.**
   - `src/lib/metal-roof-engine.ts`: `METALS`, `ASPHALTS`, `METAL_LIFE`, `TEAR_OFF_RANGE`, `TEAR_OFF_PRICE`, `roofOfArea`. **Share the price model** for metal, asphalt and tear-off. Where both tools need the same price, keep a single constant (move it to a shared `roof-prices.ts` if needed, and keep metal-roof tests green).
   - `src/lib/floor-refinish-engine.ts`: the cost and `checkQuote` pattern.
3. **Files to create or edit:**

| Action | File |
|---|---|
| new | `src/lib/roof-replacement-engine.ts`, `src/lib/roof-replacement-engine.test.ts` (+ optional `src/lib/roof-prices.ts`) |
| new | `src/components/tool/roof-replacement-cost-calculator/RoofReplacementCalculator.tsx` + `.module.css`, `RoofDiagram.tsx` + `.module.css`, `index.ts` |
| new | `src/app/roof-replacement-cost-calculator/page.tsx` + `page.module.css` |
| edit | `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (category `framing`, same as Shingle and Metal Roof), `tools-catalog.test.ts` (+1) |
| edit | `src/content/calculation-methods.ts`, `ToolArt.tsx`, `Icons.tsx`, `Footer.tsx` |
| edit | `docs/00-PROJECT-STATUS.md`, `01-FEATURES.md`, `02-SEO.md`, `04-KEYWORDS.md`, `06-CHANGELOG.md` |
| edit (internal links) | Shingle, Metal Roof Cost, Rafter, Square Footage pages: add a link to this tool |

4. **Prices:** every default needs a named, public, dated source, for example:
   - Angi/HomeAdvisor, Fixr, HomeGuide, This Old House or Homewyse roof cost guides;
   - BLS OEWS for roofer wages (SOC 47-2181);
   - manufacturer or retailer list prices with date.

   Store `{ low, typical, high, unit, source, sourceUrl, asOf }`. If you can't verify a price, set it to `TODO(owner)` and block release. Price per square = price per sq ft × 100.
5. **YMYL-adjacent:** this is a large household spend, and insurance and code questions come up. Keep claims factual, add "get 3 local quotes", give no insurance or legal advice, and link to official sources where you cite code.

---

## 1. Keyword map (Semrush US)

| Role | Keyword | Vol | KD | CPC |
|---|---|---:|---:|---:|
| **Primary** | roof replacement cost calculator | 2,900 | **4** | **$7.42** |
| Secondary | cost to replace roof | 6,600 | 14 | $8.58 |
| Secondary | redo roof cost / cost to redo roof | 6,600 / 2,400 | 24–29 | $8.58 |
| Secondary | how much does a new roof cost | 8,100 | 28 | $5.16 |
| Secondary | how much is a new roof | 4,400 | **9** | $5.59 |
| Secondary | how much does it cost to replace a roof | 4,400 | 21 | $5.87 |
| Secondary | shingle roof replacement | 4,400 | 14 | **$12.28** |
| Secondary | roof change price / how much cost to change roof | 2,400 / 1,900 | 16 / **3** | $6.30–$8.58 |
| Secondary | replacement roofing cost / roof cost | 2,400 / 2,400 | 18–28 | $7.46–$8.58 |
| Secondary | reroof cost calculator | 1,900 | 14 | |
| Secondary | roofing cost per square | 1,900 | **7** | |
| Secondary | roofing labor cost per square | 1,600 | **5** | |
| Secondary | roof cost estimator | 1,300 | **3** | |
| Long-tail | how much is a roof replacement | 880 | 15 | $6.30 |
| Long-tail | how much is a square of shingles / bundle of shingles | 1,300 / 1,300 | 17 / 27 | |
| Long-tail | how much does it cost to repair a roof / roof leak repair cost | 1,600 / 2,400 | 25 / 11 | **$12.66** |
| Long-tail | how to calculate roof square footage / how do I calculate square footage of a roof | 720 / 590 | 13–20 | |
| Long-tail | flat roof replacement | 5,400 | **11** | |
| Long-tail | commercial roof replacement cost calculator | 260 | 6 | |
| Long-tail | steel roofing cost vs shingles / tin roof vs shingles price / roofing cost metal vs shingle | 3,600 / 3,600 / 2,900 | 9–16 | |
| Support | roof maxx cost | 5,400 | 15 | (rejuvenation vs replace; mention generically only) |

**Skip** (local or contractor intent): roofing companies near me, roofing contractors, best roofers, commercial roofing company, roof installation near me, roof maxx reviews. Also skip: rafter calculator, shingle calculator, metal roof cost, which are **our existing tools**. Link to them instead of competing with them.

---

## 2. What the SERP looks like

- **Mostly lead-gen:** RoofingCalculator (address only), eRoofQuote (claims no contact info is needed but asks for name, email and phone), GAF, RoofMaxx, The Roofer Finder.
- **RoofingCalculator ranks on links** (1.5K RD page). Its tables contradict its own intro, and it has no sources.
- **RoofPitch has the best input list.** The input list is the bar to match, but its maths is wrong:
  - pitch multipliers 1.16 / 1.50, where the true values are 1.118 / 1.414;
  - four different "national average" numbers;
  - waste applied in the formula but not in the tables.
- **CostFlowAI** has correct pitch factors, but its FAQ figures don't match its own rates.
- **Calc.net** has correct slope factors but no cost model and no FAQ.
- **#10 is an irrelevant charity:** an open slot.
- **No page has a named author.** Trust is weak everywhere. Our edge is correct, tested maths, dates and sources.

---

## 3. Calculator spec

### 3.1 Inputs (UI order)

**A. Quick mode (default, 4 inputs, answers in 10 seconds):**
- home footprint sq ft (or "house living area" with a stories selector, giving footprint = area ÷ stories);
- roof pitch: preset buttons 3/12, 4/12, 6/12, 8/12, 10/12, 12/12 + custom (also accept degrees; use shingle-engine `degreesToPitch`);
- material: 3-tab asphalt, architectural asphalt, premium/designer shingle, metal (standing seam / exposed fastener, via metal-roof engine), clay/concrete tile, slate, wood shake, flat roof (EPDM / TPO / modified bitumen);
- existing layers to tear off: 0 / 1 / 2.

**B. Detailed mode (accordion):**
- **Roof planes:** use the Shingle engine's `RoofSection` list (main + garage + porch, each with its own pitch and shape) or "measured roof area" direct entry;
- eaves/rake overhang (default 12 in, editable);
- **complexity:** simple gable / hip / cut-up (dormers, valleys). This maps to `WASTE_PRESETS` and an editable labour multiplier;
- stories: 1 / 1.5 / 2 / 3+ (labour multiplier, shown and editable);
- steep-slope surcharge: auto when pitch ≥ 8/12 (editable %, cite the source or `TODO(owner)`);
- **decking (sheathing) replacement:** 0 / 10 / 25 / 50 / 100% or a number of sheets (4×8 = 32 sq ft);
- underlayment type: felt / synthetic (from `UNDERLAYMENTS`);
- ice & water shield: on/off, width at eaves (default 3 ft), plus valleys. Add a note: IRC R905.1.2 requires an ice barrier in areas with a history of ice damming, check locally;
- drip edge (auto lf = eaves + rakes), starter strip, ridge cap (lf = ridges + hips), ridge vent (lf);
- flashing: chimney (count), skylights (count, reflash or replace), pipe boots (count), wall/step flashing (lf);
- gutters (optional, lf + price);
- permit (flat, editable);
- disposal: dumpster size/count auto from squares × layers (editable) or per square;
- region multiplier 0.7–1.4; contingency % (default 10); currency symbol.

**C. Compare options (toggle, shown below the results):**
1. **Repair** (patch N sq ft or N shingles, leak repair);
2. **Overlay / reroof** (new layer over the old one; only allowed when existing layers < 2. IRC R908.3.1.1 does not permit re-cover over 2+ layers. Show a warning when layers ≥ 2);
3. **Full replacement** (tear-off + new).

### 3.2 Engine logic (`roof-replacement-engine.ts`, pure)

```ts
// Geometry — from shingle-engine (do NOT re-implement)
pf = pitchFactor(rise)                 // √(1 + (rise/12)²); 4/12=1.054, 6/12=1.118, 8/12=1.202, 10/12=1.302, 12/12=1.414
roofArea = Σ sectionGeometry(section).area      // includes overhang & pitch
waste    = WASTE_PRESETS[complexity]
squares  = roofArea * (1 + waste) / SQFT_PER_SQUARE   // 1 square = 100 ft² = 9.290304 m²

// Materials list (from calculateShingles for shingle types; metal-roof engine for metal)
bundles, underlayment rolls, ice&water rolls, drip edge lf, starter lf, ridge cap lf, nails/fasteners

// Cost lines (low/typical/high)
material    = squares * materialPerSquare(material)
labour      = squares * labourPerSquare(material) * storiesMult * complexityMult * (pitch>=8 ? steepMult : 1)
tearOff     = (roofArea/100) * layers * tearOffPerSquarePerLayer      // TEAR_OFF_* from metal-roof engine
disposal    = dumpsters(ceil(squares*layers / squaresPerDumpster)) * price
decking     = ceil(roofArea * deckPct / 32) * sheetPriceInstalled
underlay, iceWater, dripEdge, ridgeVent, flashing(chimney, skylights, boots, step), gutters, permit
subtotal    = Σ ; total = subtotal * region * (1 + contingency)
perSquare   = total / (roofArea/100) ; perSqFt = total / roofArea

// Compare
overlay = full - tearOff - disposal (+ overlay surcharge if sourced) ; blocked if layers >= 2
repair  = repairSqFt * repairRate + minimum service charge (sourced)
lifespan(material) -> costPerYear = total / typicalLifeYears             // METAL_LIFE + sourced asphalt/tile/slate life
```

**Also export:**
- `homeSizeTable(material)`: 1,000 / 1,500 / 2,000 / 2,500 / 3,000 sq ft homes at a 6/12 pitch, for the page table and FAQ (RoofPitch has four different "averages"; we have one engine).
- `materialComparison(input)`: the same roof in every material, showing total, $/square, lifespan and cost per year.
- `checkQuote(quote, result)`: "Is $18,000 for my roof reasonable?" gives below / within / above with %. No competitor has this.
- `laborPerSquare(material)`: separate output, for the "roofing labor cost per square" keyword.

### 3.3 Outputs

1. Total with a low–high range, **cost per square and per sq ft**, and labour per square shown separately.
2. Roof summary: true roof area (with the pitch factor value shown), squares, waste %, bundles.
3. Line-item table (materials / labour / tear-off / disposal / decking / add-ons / permit), with the % share of each.
4. **Repair vs overlay vs replace** cards, side by side.
5. Material comparison table (upfront + lifespan + cost per year).
6. `RoofDiagram.tsx` (SVG): a gable/hip side view that shows pitch rise/run, plus a plan view with eaves, ridge and valley lines labelled. It helps users understand the inputs.
7. Quote check. Print / Copy / Share URL. **No address, no email, no phone. Ever.**

### 3.4 Tests

- Pitch factors equal √(1+(r/12)²) to 3 decimals for 4, 6, 8, 10 and 12/12 (and match shingle-engine, the same function).
- 2,000 sq ft footprint, 6/12, gable, 12 in overhang: area and squares match a hand calculation written in the test comment.
- Tear-off scales linearly with layers. Layers = 0 gives tear-off 0. Overlay is blocked when layers ≥ 2.
- Decking 10% gives ceil(area × 0.1 / 32) sheets.
- Stories and steep multipliers apply to labour only.
- Metal option gives the same price as `metal-roof-engine` for the same area (shared constants).
- `homeSizeTable` values equal the page table and FAQ (snapshot).
- Low ≤ typical ≤ high. No NaN or -0. m² conversion: 1 square = 9.290304 m².
- Shingle and metal-roof tests stay green.

---

## 4. Page SEO

| Item | Value |
|---|---|
| URL | `/roof-replacement-cost-calculator/` |
| Title (≤60) | `Roof Replacement Cost Calculator – Per Square & Sq Ft` (53) |
| Meta (≤160) | `Estimate the cost to replace your roof by size, pitch, material and tear-off layers. See cost per square, labour per square and repair vs replace. No sign-up.` |
| H1 | `Roof Replacement Cost Calculator` |
| Intro (BLUF) | "Replacing an asphalt shingle roof typically costs $X–$Y per square ($A–$B per sq ft) installed; a 2,000 sq ft home is about $N…". All numbers come from the engine with a sourced date. Add one line: "correct pitch maths, every price editable, no address needed." |
| Schema | `WebApplication` + `FAQPage` + `BreadcrumbList` (existing helpers) |
| HowWeCalculate | formulas (pitch factor, squares, tear-off), sources, price date |
| Internal links out | Shingle, Metal Roof Cost, Rafter, Square Footage, Construction Estimate Template |
| Internal links in | Shingle ("next: what will the full replacement cost?"), Metal Roof Cost (asphalt vs metal context), Rafter, Tools hub |

---

## 5. Content outline (~2,600–3,000 words, original)

| # | H2 | What to write | Words |
|---:|---|---|---:|
| 1 | How to use the roof replacement cost calculator | Quick vs detailed mode, where to find pitch, how to measure | 150 |
| 2 | How much does a new roof cost? | Engine table by home size (1,000–3,000 sq ft) and material, low/typical/high | 300 |
| 3 | Roofing cost per square (materials + labour) | What a square is; material vs labour per square; "roofing labor cost per square" as its own sub-section | 300 |
| 4 | Roof replacement cost by material | Asphalt 3-tab / architectural, metal, tile, slate, shake, flat (EPDM/TPO), with lifespan and cost per year | 300 |
| 5 | What raises the price | Pitch (show the correct factor table), stories, complexity, layers, decking | 300 |
| 6 | How to calculate roof square footage | Footprint × pitch factor + overhang, worked example (covers 720 + 590 keyword) | 200 |
| 7 | Add-ons explained | Underlayment, ice & water, drip edge, flashing, vents, gutters, dumpster, permit | 250 |
| 8 | Repair, overlay (reroof) or full replacement? | Engine comparison, 2-layer limit, signs you need a new roof, rejuvenation treatments (generic) | 300 |
| 9 | Flat and commercial roof replacement | EPDM/TPO/mod-bit basics, per square | 150 |
| 10 | Insurance, permits and timing | Facts only: insurance depends on policy and cause (no advice); permits are local; seasonal demand | 150 |
| 11 | How to compare roofing quotes | Use the quote check; what each line should include; 3 quotes; warranty types | 200 |
| 12 | FAQ | see §6 | 500 |
| 13 | Sources, price date & methodology | HowWeCalculate | — |

---

## 6. FAQ (12)

1. How much does a new roof cost? (`how much is a new roof`, KD 9)
2. How much does it cost to replace a roof on a 1,500 / 2,000 sq ft house?
3. What is the roofing cost per square?
4. What is the roofing labour cost per square? (KD 5)
5. Does a roof replacement estimate include tear-off?
6. Can I put new shingles over old ones (reroof)?
7. Should I repair or replace my roof?
8. How much does roof leak repair cost? (CPC $12.66)
9. How many bundles of shingles are in a square? (link Shingle Calculator)
10. How long does a roof last by material?
11. Is a metal roof cheaper than shingles in the long run? (link Metal Roof Cost)
12. Does homeowners insurance pay for roof replacement? (facts only: "depends on policy and cause; ask your insurer")

---

## 7. Beat-the-competitor checklist

| Gap in SERP | Our page |
|---|---|
| Wrong pitch factors (RoofPitch) | Shared, tested `pitchFactor` |
| Contradicting averages and tables | One engine for tool, tables and FAQ |
| Address/phone/email gates | Nothing asked, ever |
| No editable prices (0/6) | Every price editable, sourced defaults |
| Single-plane roofs only | Multi-plane via Shingle engine |
| No repair vs overlay vs replace | Three-way comparison with the 2-layer code note |
| No quote check | Quote check |
| No lifetime cost | Cost per year by material |
| No metric (except Calc.net area) | ft/m + m² per square + currency |
| No author, old or no dates | Dated sources, methodology; author only if the owner provides one |

---

## 8. Definition of done

- [ ] `npm run verify` passes. Evidence saved in `docs/evidence/`.
- [ ] Engine tests cover §3.4. Shingle and metal-roof tests green.
- [ ] All prices sourced and dated, or `TODO(owner)` blocking release.
- [ ] 390 px mobile check: quick mode visible above the fold, detailed accordion closed by default, tables scroll inside their own box.
- [ ] Title ≤ 60, meta ≤ 160, one H1, one FAQ block (visible + schema).
- [ ] Routes, catalog, hub, internal links in and out (Shingle, Metal Roof, Rafter), docs updated.
- [ ] Owner: request indexing in GSC after deploy. This page also deserves first priority in the backlinks plan (highest CPC).
