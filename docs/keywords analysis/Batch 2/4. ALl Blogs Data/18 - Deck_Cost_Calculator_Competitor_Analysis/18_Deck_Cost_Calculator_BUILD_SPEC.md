# Deck Cost Calculator & Estimator — Build Spec (for Antigravity / Gemini)

> **Tool:** `/deck-cost-calculator/` · Batch 2 · #18
> **Inputs used:** `18_Deck_Cost_Calculator_Competitor_Analysis.md` (SERP read on 2026-11-14), `18.1.csv` + `18.2.csv` (Semrush, 199 keywords)
> **Written:** 2026-11-17 · **Status:** not built
> **Goal:** the only **neutral, brand-free** deck estimator in a SERP full of retailer and composite-brand tools. It gives a full bill of materials plus cost, with every price editable.

---

## 0. Read this first (rules for the builder)

1. **Follow `AGENTS.md`:**
   - zero network calls;
   - no fabricated facts or prices;
   - `TODO(owner)` for anything the owner must supply;
   - never copy competitor text, tables or prices;
   - `npm run verify` must pass.
2. **Reuse what already exists. Don't rebuild it:**
   - `src/lib/deck-stain-engine.ts`: deck sections, `floorArea`, `railingArea`, `stairsArea`, railing/stairs defaults. **Share this deck-area model** (import its types/functions or extract a shared `deck-geometry.ts` that both engines use; update the deck-stain tests if you move anything).
   - `src/lib/floor-refinish-engine.ts`: the cost pattern (price range + `source` per item, `EXTRAS`, `checkQuote`).
   - Concrete calculator engine: concrete volume per footing (link to it, or call its volume helper if one is exported).
3. **Files to create or edit:**

| Action | File |
|---|---|
| new | `src/lib/deck-cost-engine.ts`, `src/lib/deck-cost-engine.test.ts` (+ optional `src/lib/deck-geometry.ts`) |
| new | `src/components/tool/deck-cost-calculator/DeckCostCalculator.tsx` + `.module.css`, `DeckDiagram.tsx` + `.module.css`, `index.ts` |
| new | `src/app/deck-cost-calculator/page.tsx` + `page.module.css` |
| edit | `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (category `framing`), `src/lib/tools-catalog.test.ts` (count +1) |
| edit | `src/content/calculation-methods.ts`, `ToolArt.tsx`, `Icons.tsx`, `Footer.tsx` |
| edit | `docs/00-PROJECT-STATUS.md`, `01-FEATURES.md`, `02-SEO.md`, `04-KEYWORDS.md`, `06-CHANGELOG.md` |
| edit (internal links) | Deck Stain, Fence Cost, Concrete, Linear Foot, Stud pages: add a link to this tool |

4. **Prices:** every default needs a named, public, dated source, for example:
   - Angi/HomeAdvisor, Fixr, HomeGuide or This Old House deck cost guides;
   - lumber and decking list prices from a public retailer page, recorded with date;
   - BLS OEWS wages for carpenters (SOC 47-2031).

   Store `{ low, typical, high, unit, source, sourceUrl, asOf }` for each item. If a source can't be opened and verified, use `TODO(owner)` and do not ship.
5. **Brands:** "Trex" appears in search terms. Use it **only descriptively** ("Trex-style composite", "composite, e.g. Trex or TimberTech"). No logos, no brand-specific price claims unless sourced, and no implication of endorsement.

---

## 1. Keyword map (Semrush US)

| Role | Keyword | Vol | KD | CPC |
|---|---|---:|---:|---:|
| **Primary** | deck estimator | 3,600 | **13** | $1.72 |
| Secondary | deck replacement cost | 1,600 | 18 | **$4.06** |
| Secondary | labor cost to build a deck per square foot | 1,600 | 17 | $1.87 |
| Secondary | trex decking prices / trex prices decking | 2,900 / 3,600 | 22–28 | $1.34 |
| Secondary | cost of trex decking | 1,300 | 22 | |
| Secondary | deck renovation cost | 1,300 | 20 | |
| Secondary | pressure treated deck pricing | 1,300 | 23 | |
| Secondary | price to install deck | 1,000 | **8** | |
| Secondary | free deck calculator | 880 | **7** | |
| Long-tail | how much is composite decking / how much does composite decking cost | 880 / 390 | 25 | $1.31–$2.10 |
| Long-tail | cost to fix deck | 720 | 13 | |
| Long-tail | trex cost calculator | 720 | 12 | |
| Long-tail | cost to replace deck boards | 590 | 11 | |
| Long-tail | how much is trex per square foot / per sq ft | 320 / 210 | **9–10** | |
| Long-tail | how much does it cost to replace a deck / how much to replace a deck | 320 / 210 | 12–16 | $2.87 |
| Long-tail | how much does a 20x20 composite deck cost | 210 | 15 | |
| Long-tail | how much would a new deck cost / how much cost to build a deck | 260 / 260 | 24–28 | |
| Support (content H2/FAQ) | how much gap between deck boards (+4 variants) | ~1,300 combined | **3–12** | |
| Support | deck materials / decking material / composite decking material | 4,400 / 4,400 / 2,400 | 2–12 | |
| Support | best materials for outdoor decks | 2,400 | **4** | |

**Skip:** deck repair near me, porch builders near me, inspectah deck, sand estimator, stud calculator, deck plans/ideas/pictures, lowes/menards terms, under-deck ceiling/drainage. These are wrong intent or a different tool.

**Bonus quick wins** (very low KD, can be H2s or FAQs):
- "how much gap between deck boards" (KD 3–7): a board-gap section;
- "best materials for outdoor decks" (KD 4): a material comparison H2;
- "composite decking material" (KD 2).

---

## 2. What the SERP looks like

- **Brand and retailer SERP:** Home Depot, Menards, Lowe's, Trex, TimberTech, Deckorators, Armadillo. Every tool pushes its own boards or store cart. **None is neutral.**
- **Materials tools have no cost; cost pages have no tool.** Decks.com counts boards and screws but gives no price. Trex and TimberTech show ranges with no calculator.
- **Weak page-level links:** Armadillo 2 RD, Mr. Handyman 3 RD, Deckorators 8 RD. Domains are strong, but these individual pages are beatable.
- **Benchmark (CostFlowAI)** has the right cost structure but opaque defaults, no editing, no split between materials and framing, and maths that contradicts itself.
- Competitor errors to avoid:
  - Trex left template headings live ("[Enter the first item title]");
  - TimberTech's labour share in the FAQ doesn't match its own chart (80% vs 68%);
  - Decks.com shows placeholder text in its results.

---

## 3. Calculator spec

### 3.1 Inputs (UI order)

**A. Project mode (tabs):**
1. `New deck` (default)
2. `Resurface`: new boards + railing on the existing frame (no framing, no footings, plus board removal)
3. `Replace`: demo + haul-away + full new deck
4. `Repair`: replace N boards / N joists / N railing sections / stairs repair

Modes 2–4 target `deck replacement cost`, `deck renovation cost`, `cost to fix deck` and `cost to replace deck boards`. **No competitor models them.**

**B. Size (repeatable sections):**
- each section L × W (ft+in or m). Support L-shapes or two levels as 2+ sections;
- height above grade band: `ground (<2 ft)` | `2–4 ft` | `4–8 ft` | `8 ft+ / second storey`. This drives the labour multiplier and post length;
- attached to the house (ledger) or freestanding (extra beam row);
- side against the house (for the railing calculation).

**C. Decking:**
- material preset: pressure-treated pine, cedar, redwood, composite (basic), composite (premium/capped), PVC, tropical hardwood (ipe);
- board width: 5.5 in (nominal 6) default, or 3.5 in;
- board length: 8 / 12 / 16 / 20 ft (or auto best fit);
- gap: default by material (wood vs composite). Keep it editable and **cite the manufacturer or source** for the defaults;
- pattern: straight 90° (waste default 10%) | diagonal 45° (15%) | herringbone/chevron (20%). All waste values are editable and cited, or `TODO(owner)`;
- picture-frame border (adds perimeter boards).

**D. Framing (hide in an "Advanced" accordion with sensible defaults):**
- joist size 2×6 / 2×8 / 2×10 / 2×12, spacing 12 / 16 / 24 in o.c. (default 16; composite often requires 12 or 16 for diagonal. Note "check the manufacturer");
- beam and post spacing (default 6–8 ft), post size 4×4 / 6×6;
- footing diameter and depth. Depth depends on the local frost line, so add an "ask your local building department" note. Concrete per footing is computed with the cylinder formula, with a link to the Concrete Calculator.
- ledger flashing / joist tape (linear ft).

**E. Railing:**
- type: wood, composite, aluminium, cable, glass;
- length: auto = exposed perimeter − house side − stair openings (editable);
- note: IRC R312.1.1 requires guards where the deck surface is more than 30 in above grade. Show a tip when the height band is ≥ 2–4 ft.

**F. Stairs:** number of risers (auto suggestion = height ÷ 7.5 in, editable), stair width, landing (optional). Output treads, stringers (one per ~16 in of width; cite or `TODO(owner)`), stair railing.

**G. Fasteners:** face screws (2 per board per joist crossing) | hidden clips (1 per board per joist crossing), with a price per box and screws per box.

**H. Costs (every one editable):**
- decking $/sq ft or per board;
- lumber per piece (joist, beam, post);
- concrete per bag or yd³;
- hardware per sq ft;
- railing $/lf;
- stairs per step;
- labour $/sq ft (by material × height band);
- permit (flat, editable; varies by city);
- demolition and disposal $/sq ft (Replace / Resurface);
- site prep;
- region multiplier 0.7–1.4;
- contingency % (default 10, editable);
- currency symbol.

**I. DIY toggle:** hides labour, shows tool rental line (optional), and shows the materials-only total.

### 3.2 Engine logic (`deck-cost-engine.ts`, pure)

```ts
area = Σ section.L * section.W                          // ft²
perimeter = Σ exposed edges (exclude house side)

// Decking boards
rows        = ceil(sectionWidthAcrossJoists / ((boardWidthIn + gapIn) / 12))
runLength   = sectionLengthAlongBoards
boardsPerRow= ceil(runLength / boardLengthFt)           // allow 'best fit' choose length with least offcut
boards      = rows * boardsPerRow * (1 + waste%)        // + picture frame: ceil(perimeter / boardLength)
deckingSqFt = area * (1 + waste%)

// Framing
joists      = ceil(spanAlongLedger / (spacingIn/12)) + 1  (+ rim joists 2)
beams       = attached ? 1 row : 2 rows ; beamLength = deck width
postsPerBeam= ceil(beamLength / postSpacing) + 1
footings    = posts (attached: + 0 ledger footings)
concreteFt3 = footings * π * (dia/2)^2 * depth          // ft³ -> yd³ ÷ 27, -> bags via Concrete engine helper if exported
ledgerLf    = attached ? houseSide : 0

// Fasteners
crossings   = rows * joists  (per section)
screws      = crossings * 2 ; clips = crossings * 1      // -> boxes = ceil(n / perBox)

// Railing & stairs
railLf      = max(0, perimeter - stairOpenings) (editable)
risers      = ceil(heightIn / 7.5) ; treads = risers - 1
stringers   = ceil(stairWidthIn / 16) + 1

// Cost lines (low/typical/high each)
decking, framing lumber, concrete, hardware & fasteners, flashing tape,
railing, stairs, labour = area * labourRate(material) * heightMultiplier(band),
permit, demolition (replace/resurface), disposal, site prep, contingency
total = Σ * region ;  $/sq ft = total / area
```

**Also export:**
- `deckSizeTable(material)`: 10×10, 12×12, 12×16, 14×20, 16×20, 20×20 for each material, low/typical/high. Use it for the page table and FAQ numbers, so they never contradict (Trex and CostFlowAI do).
- `compareMaterials(input)`: the same deck in each material. Show upfront cost, typical lifespan (sourced), maintenance per year (link Deck Stain for wood), and **cost per year of service**.
- `checkQuote(quote, result)`.
- `bom(input)`: a printable bill of materials (boards by length, joists, beams, posts, footings and concrete bags, screws/clips boxes, railing lf, stair parts).

### 3.3 Outputs

1. Total with a low–high range and $/sq ft; DIY vs Pro side by side.
2. Cost breakdown bar (framing / decking / railing / stairs / labour / permit / demo). Use real computed shares, not a fixed pie like TimberTech's.
3. **Bill of materials table** (print-friendly).
4. `DeckDiagram.tsx` (SVG): plan view with joists at spacing, beam and post positions, board direction, stairs location. Scale it to the input.
5. Material comparison table (upfront + lifetime).
6. Quote check. Print / Copy / Share URL.

### 3.4 Tests

- 12×12 deck at 16 in o.c. gives joist count = ceil(144/16)+1 (+rims). Verify by hand in the test comment.
- 5.5 in board + 3/16 in gap over 12 ft gives the expected row count.
- Diagonal pattern has higher waste than straight. Picture frame adds ceil(perimeter / length) boards.
- Footing concrete matches the cylinder formula; yd³ = ft³ ÷ 27.
- Railing lf excludes the house side and stair opening.
- Resurface mode: framing = 0, demo of boards > 0. Replace: demo + full new. Repair: only selected items.
- Height band multiplier applies to labour only.
- Every value in `deckSizeTable` matches the page table and FAQ (snapshot).
- Low ≤ typical ≤ high. No NaN or -0 on empty input.
- If the geometry is extracted, deck-stain tests still pass.

---

## 4. Page SEO

| Item | Value |
|---|---|
| URL | `/deck-cost-calculator/` |
| Title (≤60) | `Deck Cost Calculator & Estimator – Wood vs Composite` (52) |
| Meta (≤160) | `Free deck estimator: enter size and material (pressure-treated, cedar, composite or PVC) for a full materials list, labour and total deck cost.` |
| H1 | `Deck Cost Calculator & Estimator` |
| Intro (BLUF) | "A new deck typically costs $X–$Y per sq ft installed, depending on material and height…" (engine typical, all sourced). Add one line on what is unique: neutral, editable, full bill of materials. |
| Schema | `WebApplication` + `FAQPage` + `BreadcrumbList` (existing helpers) |
| HowWeCalculate | method + formulas + sources + price date |
| Internal links out | Deck Stain, Concrete (footings), Fence Cost, Linear Foot, Stud, Square Footage |
| Internal links in | Deck Stain (strong contextual link: "planning a new deck? estimate the build cost"), Fence Cost, Concrete, Tools hub |

---

## 5. Content outline (~2,400–2,800 words, original)

| # | H2 | What to write | Words |
|---:|---|---|---:|
| 1 | How to use the deck estimator | Pick mode → sections → material → advanced framing → read the BOM | 150 |
| 2 | Deck cost per square foot by material | Engine table: PT / cedar / redwood / composite / PVC / ipe, materials-only vs installed | 300 |
| 3 | How much does a deck cost? Cost by deck size | 10×10 … 20×20 table (covers "20x20 composite deck cost") | 200 |
| 4 | Labour cost to build a deck per square foot | What labour covers, height and access effect, DIY savings (BLS wage source) | 250 |
| 5 | What makes up the cost of a deck | Framing, decking, railing, stairs, fasteners, permit, with real shares from the engine | 250 |
| 6 | Pressure-treated vs cedar vs composite vs PVC (best materials for outdoor decks) | Upfront, lifespan, maintenance, cost per year | 300 |
| 7 | Composite decking prices (Trex-style boards) | Descriptive only, per sq ft range from a source | 150 |
| 8 | Deck replacement, resurfacing and repair cost | When to resurface vs replace; board replacement | 250 |
| 9 | How many boards, joists and screws you need | Explain the BOM maths simply | 200 |
| 10 | How much gap between deck boards? | Wood vs composite, end gaps, wet vs dry PT. **Cite the manufacturer or a source** | 150 |
| 11 | Permits and codes | Guards over 30 in (IRC R312.1.1), footings to frost depth, "check your local building department". No legal advice. | 150 |
| 12 | FAQ | see §6 | 450 |
| 13 | Sources, price date & methodology | HowWeCalculate | — |

---

## 6. FAQ (12)

1. How much does a 12×12 / 16×20 / 20×20 deck cost?
2. What is the labour cost to build a deck per square foot?
3. How much does Trex or composite decking cost per square foot? (descriptive)
4. Is composite decking worth the extra cost over wood?
5. How much does a pressure-treated deck cost?
6. How much does it cost to replace a deck? (`deck replacement cost`)
7. How much does it cost to replace deck boards / resurface a deck?
8. How much does it cost to fix or repair a deck? (`cost to fix deck`)
9. How many deck boards and screws do I need?
10. How much gap should I leave between deck boards?
11. Do I need a permit to build a deck?
12. How much do stairs and railing add to deck cost?

---

## 7. Beat-the-competitor checklist

| Gap in SERP | Our page |
|---|---|
| Every tool is brand or store-biased | Neutral, all materials, all prices editable |
| Materials tools have no cost; cost pages have no tool | BOM + cost in one tool |
| No replace/resurface/repair modes | 4 modes |
| No framing/footing maths in cost tools | Joists, beams, posts, footings, concrete |
| Contradicting size tables | One engine for tool, tables and FAQ |
| No DIY vs pro | Side by side |
| No metric/currency | ft/m + currency symbol |
| Template errors, AI filler, no dates | Clean, dated, sourced, tested |
| No lifetime cost numbers | Cost per year of service |

---

## 8. Definition of done

- [ ] `npm run verify` passes. Evidence saved in `docs/evidence/`.
- [ ] Engine tests cover §3.4. Deck-stain tests still pass.
- [ ] All prices sourced and dated, or `TODO(owner)` blocking release.
- [ ] 390 px mobile check: section rows stack, BOM table scrolls in its own box, diagram scales.
- [ ] Title ≤ 60, meta ≤ 160, one H1, one FAQ block (visible + schema).
- [ ] Routes, catalog, hub, internal links in and out, docs updated.
- [ ] Owner: request indexing in GSC after deploy.
