# Carpet Cost Calculator — Build Spec (for Antigravity / Gemini)

> **Tool:** `/carpet-cost-calculator/` · Batch 2 · #17
> **Inputs used:** `17_Carpet_Cost_Calculator_Competitor_Analysis.md` (top-10 SERP read on 2026-11-14), `17.1.csv` + `17.2.csv` (Semrush, 186 keywords)
> **Written:** 2026-11-17 · **Status:** not built
> **Goal:** the most complete, correct and trustworthy carpet cost page in the SERP. It should beat every top-10 page on tool depth, accuracy and clarity.

---

## 0. Read this first (rules for the builder)

1. **Read `AGENTS.md` and follow it.** Key rules:
   - zero network calls in tool code;
   - no fabricated facts or prices;
   - anything only the owner can supply is `TODO(owner)`;
   - do not copy competitor text, tables or prices;
   - run `npm run verify` before calling it done.
2. **Copy the pattern of an existing cost tool.** The closest one is **Floor Refinishing Cost Calculator**. Read these files before writing code:
   - `src/lib/floor-refinish-engine.ts` (+ `.test.ts`): price ranges with a `source` per item, `EXTRAS`, `checkQuote()`, `quickRefinish()`
   - `src/components/tool/floor-refinishing-cost-calculator/*`
   - `src/app/floor-refinishing-cost-calculator/page.tsx`
   - Laminate: `src/lib/laminate-engine.ts` (area items, pricing basis)
3. **Files to create or edit.** This is the same set the last tool build touched (Cubic Inch, commit `5d10abb`):

| Action | File |
|---|---|
| new | `src/lib/carpet-engine.ts`, `src/lib/carpet-engine.test.ts` |
| new | `src/components/tool/carpet-cost-calculator/CarpetCostCalculator.tsx` + `.module.css`, `CarpetDiagram.tsx` + `.module.css`, `index.ts` |
| new | `src/app/carpet-cost-calculator/page.tsx` + `page.module.css` |
| edit | `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (category `finishes`), `src/lib/tools-catalog.test.ts` (count +1) |
| edit | `src/content/calculation-methods.ts` (method + sources), `src/components/home/ToolArt.tsx`, `src/components/icons/Icons.tsx`, `src/components/layout/Footer.tsx` (if the finishes list is there) |
| edit | `docs/00-PROJECT-STATUS.md`, `docs/01-FEATURES.md`, `docs/02-SEO.md`, `docs/04-KEYWORDS.md`, `docs/06-CHANGELOG.md` |
| edit (internal links) | Laminate Flooring, Floor Refinishing Cost, Square Footage, Tile pages: add a contextual link to this tool |

4. **Prices (most important rule).** Every default price must come from a **named, public, dated source**, such as:
   - Angi/HomeAdvisor, Fixr, HomeGuide, This Old House or Homewyse cost guides;
   - BLS OEWS for installer wages (SOC 47-2041 "Carpet Installers").

   For each price item:
   - store `{ low, typical, high, unit, source, sourceUrl, asOf }`;
   - list it in `calculation-methods.ts`.

   If two sources disagree, use a range that covers both. If you can't open and verify a source, **do not invent a number**. Set it to `TODO(owner)`, add a line in `docs/00-PROJECT-STATUS.md`, and do not ship. Every price is editable by the user anyway.

---

## 1. Keyword map (Semrush US)

| Role | Keyword | Vol | KD | CPC |
|---|---|---:|---:|---:|
| **Primary** | carpet cost per square foot | 4,400 | 27 | $1.63 |
| Secondary | carpet replacement cost | 4,400 | 18 | **$8.09** |
| Secondary | cost per sq ft for carpet | 3,600 | 27 | $1.63 |
| Secondary | carpet flooring installation cost | 1,600 | 21 | $5.47 |
| Secondary | carpet removal prices | 1,300 | 24 | $5.14 |
| Secondary | how much is carpet with installation | 1,300 | 28 | $3.71 |
| Secondary | cost of carpeting installed | 1,000 | 23 | $5.51 |
| Secondary | berber carpet cost | 1,000 | 23 | $1.46 |
| Long-tail | how much to carpet a room / how much is it to carpet a room / price to recarpet a room | 720 / 480 / 390 | 21–24 | |
| Long-tail | carpet replacement cost calculator | 590 | 26 | $4.15 |
| Long-tail | carpet tile installation cost / rates | 590 / 590 | **11** | $3.95 |
| Long-tail | cost to replace carpet on stairs / cost to install carpet on stairs / cost to carpet stairs | 590 / 390 / 320 | 12–27 | ~$5 |
| Long-tail | carpet repair cost | 480 | **12** | $4.28 |
| Long-tail | carpet installation estimate | 480 | 29 | $6.51 |
| Long-tail | carpet cost per sq ft | 720 | **6** | |

**Skip** (store or navigation intent, not a calculator): carpet sales, cheap carpet near me, discount carpet, carpet rolls, 3 rooms of carpet for $399, carpets for less, same day carpet.

**Where each keyword goes:**
- Title and H1: "carpet cost calculator" plus "per square foot".
- One H2 each for: replacement cost, installation cost, cost to carpet a room, stairs, carpet tiles, Berber cost, removal.
- FAQ: the "how much…" questions.

---

## 2. What the SERP looks like (summary of the analysis)

- **It's an article SERP, not a tool SERP.** Only Homewyse and the Inch Calculator benchmark have a calculator, and Homewyse's line items are broken (identical ranges, blank totals).
- **4–5 slots are weak or useless:** Reddit, YouTube, hhs.gov, msstate.edu, and royalamericarpets.com (dead domain). A new domain can realistically take one of these.
- **An AS 9 store blog (floorcw.com) ranks #2 with ~7,000 words and cited sources.** Here, depth and sourced numbers win.
- **Nobody calculates roll width or seam waste.** Carpet is sold in 12 ft rolls (also 13'6" and 15'), so buyers pay for the cut rectangle, not the room's exact area. This is our main differentiator.
- Errors to avoid, because competitors make them:
  - FloorCW prices stairs two different ways.
  - Inch Calculator's removal price in the tool doesn't match its text, and the page is titled 2026 but was updated in 2023.

---

## 3. Calculator spec

### 3.1 Inputs (UI order)

**A. Mode toggle:** `New carpet` | `Replace carpet` (default **Replace**, because it has the highest CPC and is the most common search). Replace turns on removal and disposal by default.

**B. Spaces (repeatable list, "Add room").** Each row has:
- name (Bedroom 1…);
- type: `room` | `closet` | `hallway`;
- length × width in ft + in, or m (unit toggle);
- optional: "same carpet as room 1" (shared roll layout).

**C. Stairs (optional block):**
- number of steps (default 13; a typical US flight has 12–14);
- style: `box (cap & band)` | `waterfall` (box costs more labour);
- tread depth (default 10 in) and riser height (default 7.5 in), both editable. IRC R311.7.5: max riser 7¾ in, min tread 10 in;
- stair width (default 36 in);
- landing: L × W (optional).

**D. Roll & waste:**
- roll width: `12 ft` (default) | `13 ft 6 in` | `15 ft` | custom;
- pile direction must match across seams (checkbox, default on);
- extra waste % for pattern match (default 0%, presets 0 / 5 / 10%).

**E. Carpet price.** Choose one:
- grade preset: `Builder / budget` | `Mid-grade` | `Premium`;
- fibre preset: nylon, polyester (PET), triexta, olefin (polypropylene), wool;
- style note: plush/Saxony, frieze, Berber/loop, cut-and-loop, pattern;
- price entry unit toggle: **per sq ft | per sq yd** (stores quote both). Auto-convert using 1 sq yd = 9 sq ft;
- carpet tiles option: tiles are priced per sq ft or per box with no roll waste. Use a 5% waste default (editable, cite the source or `TODO(owner)`).

**F. Pad (cushion):** thickness (1/4, 3/8, 7/16, 1/2 in) and density (6 / 8 / 10 lb), with a price per sq ft or sq yd. Add a note that many carpet warranties set minimum pad specs; tell users to check theirs.

**G. Labour & extras.** Each one has a checkbox and an editable unit price:

| Extra | Unit |
|---|---|
| installation labour | per sq ft or sq yd of carpet installed |
| stairs labour | per step; box and waterfall at different rates |
| old carpet + pad removal | per sq ft |
| disposal / haul-away | per job or per sq ft |
| furniture moving | per room |
| tack strip replacement | per linear ft of room perimeter (auto-calc perimeter) |
| transition strips | count × price |
| subfloor repair | sq ft × price |
| door trimming | count × price |

**H. Tax:** sales tax % (default 0, editable). Ask whether it applies to materials only or the total (US states differ; default is materials only).

**I. Region and currency:**
- regional multiplier slider 0.7–1.4 (default 1.0) with a short note;
- currency selector (USD default; GBP, CAD, AUD, EUR). The symbol changes only and there is no FX conversion. Prices are the user's own.

### 3.2 Engine logic (`carpet-engine.ts`, pure functions, no I/O)

```ts
export const SQFT_PER_SQYD = 9;
export const SQFT_PER_M2 = 10.7639;

// 1. Net area per space
net = L * W                       // ft²

// 2. Roll layout per room (the differentiator)
// Try both orientations; pick the one with less carpet bought.
for orientation of [L along roll, W along roll]:
  across = side running across the roll width
  along  = side running along the roll length
  drops  = ceil(across / rollWidth)          // number of strips
  cutLength = along + trimAllowance          // trimAllowance default 3 in each end = 0.5 ft total, editable
  bought = drops * rollWidth * cutLength     // ft²
  seams  = drops - 1
  // Reuse leftover: if (drops*rollWidth - across) >= next room's needs, allow fill (keep simple: v1 per-room, v2 optional reuse)
choose min bought
waste% = (bought - net) / net

// 3. Stairs
perStepDepth = tread + riser + nosingWrap        // nosingWrap default 1.5 in, editable
stairArea = steps * stairWidth * perStepDepth / 144   // in² -> ft²
          + landingL * landingW
// Box style adds side wrap labour, not area (priced in stairs labour rate)
// Stair carpet is cut from the roll; add stairWaste default 10% (editable, cite or TODO(owner))

// 4. Totals
carpetSqFt  = Σ bought + stairArea*(1+stairWaste) (+ patternWaste%)
padSqFt     = Σ net + stairArea                 // pad is not bought with roll waste the same way; keep = net (+5% editable)
removalSqFt = Σ net (+ stairs if replace)
perimeterFt = Σ 2*(L+W) for rooms                // tack strip

lines = [
  carpet:   carpetSqFt * price,
  pad:      padSqFt * padPrice,
  install:  installedSqFt * labour,
  stairs:   steps * stairRate(style),
  removal, disposal, furniture, tack, transitions, subfloor, doors,
  tax
]
total = Σ lines * regionMultiplier
low/typical/high = same formula using each item's low/typical/high
outputs: net ft², bought ft², sq yd, m², waste %, seams, $/sq ft and $/sq yd (installed, total ÷ net)
```

**Also export:**
- `quickCarpet(sqft, grade)`: generates the "cost by room size" table on the page. Rooms: 10×10, 10×12, 12×12, 12×14, 12×15, 14×16, 15×20, plus 3 bedrooms and 1,000 / 1,500 sq ft whole-house estimates. Use the engine so the numbers never contradict each other (FloorCW does contradict itself).
- `checkQuote(quoteTotal, result)`: returns `below | within | above` the range, with the % difference.
- `compareFloors(netSqFt)`: the same rooms priced as carpet vs LVP vs laminate vs hardwood refinish. Use existing engines and price sets where possible (laminate-engine, floor-refinish-engine). New floor prices need sources as well.

### 3.3 Outputs (results panel)

1. **Big number:** total with a low–high range, plus installed cost per sq ft **and** per sq yd.
2. Quantity card showing net area, carpet to buy (sq ft / sq yd / m²), waste %, number of seams and roll width used.
3. Line-item table: item, qty, unit price, total. Show every line, with a note when an item is turned off.
4. **Roll layout diagram** (`CarpetDiagram.tsx`, inline SVG): the room rectangle, strips drawn on the 12 ft roll, seam lines, and the waste area hatched. No competitor shows this.
5. Quote check box.
6. Flooring comparison table.
7. Actions: Print / Copy summary / Share URL (state in the query string, like the other tools). No network.

### 3.4 Tests (`carpet-engine.test.ts`)

- 12×12 room on a 12 ft roll gives 1 drop and 0 seams; bought = 12 × 12.5 with trim allowance.
- 14×16 room: compare both orientations; the engine picks the smaller purchase; seam count is correct.
- A room exactly 12.0 ft wide gives 1 drop (boundary test). A 12.01 ft wide room gives 2 drops.
- sq ft ↔ sq yd ↔ m² conversions round-trip.
- Stairs: 13 steps × 36 in × (10 + 7.5 + 1.5) in matches the hand calculation.
- Replace mode adds removal and disposal; New mode doesn't.
- Every number in the room-size table and in the FAQ equals the engine output (snapshot test).
- Low ≤ typical ≤ high for every line.
- Zero, empty and negative inputs never give NaN or -0 (use `Math.max(0, …)`, as the brick engine does).

---

## 4. Page SEO

| Item | Value |
|---|---|
| URL | `/carpet-cost-calculator/` |
| Title (≤60) | `Carpet Cost Calculator – Price per Square Foot & Yard` (52) |
| Meta (≤160) | `Estimate carpet cost by room: carpet, pad, installation, stairs and old-carpet removal. Price per sq ft or sq yd, with roll waste worked out for you.` |
| H1 | `Carpet Cost Calculator` |
| Intro (BLUF, first 50–60 words) | Answer the question directly: "Carpet usually costs $X–$Y per sq ft installed (carpet + pad + labour) …". The numbers come from the engine's typical range, not hard-coded, plus one line on what the tool adds (roll waste, stairs, removal). |
| Breadcrumb | Home › Tools › Carpet Cost Calculator |
| Schema | `WebApplication` + `FAQPage` + `BreadcrumbList` through the existing `buildSchema.ts` / `JsonLd` (the normalizer joins the @graph) |
| HowWeCalculate | yes: method, formulas, sources and price date (`calculation-methods.ts`) |
| OG image | site default (no new image needed) |
| Internal links out | Square Footage, Laminate Flooring, Floor Refinishing Cost, Tile, Bathroom Remodel Cost |
| Internal links in | add a contextual sentence and link on Laminate, Floor Refinishing, Square Footage, and the Tools/Finishes hub |

---

## 5. Content outline (~2,200–2,600 words, original, Flesch 60+)

Tool first (above the fold), then content. Use short paragraphs, real tables and no filler.

| # | H2 (keyword) | What to write | Words |
|---:|---|---|---:|
| 1 | How to use this carpet cost calculator | 5 steps: add rooms → stairs → roll width → prices → read the result | 150 |
| 2 | Carpet cost per square foot | Split carpet / pad / labour in a table by grade (sourced ranges). Explain per sq ft vs per sq yd (×9). | 300 |
| 3 | How much does it cost to carpet a room? | Engine-generated table: 10×10 … 15×20 plus 3 bedrooms and whole house, low / typical / high | 200 |
| 4 | Why you buy more carpet than your room measures | Roll widths, seams, pile direction, worked example (14×16 room on a 12 ft roll, with the diagram) | 300 |
| 5 | Carpet replacement cost | Removal, disposal, tack strip, subfloor repair, furniture; when replacement beats repair | 250 |
| 6 | Cost to carpet stairs | Per step, box vs waterfall, landing, why stairs cost more per sq ft | 200 |
| 7 | Carpet cost by fibre and style | Nylon, polyester, triexta, olefin, wool; plush, frieze, Berber (with the "Berber carpet cost" line) | 250 |
| 8 | Carpet tile installation cost | Tiles vs broadloom, waste, commercial use | 150 |
| 9 | Carpet vs LVP vs laminate vs hardwood | Comparison table from `compareFloors()`, with lifespan and feel notes | 200 |
| 10 | Ways to save on carpet | Remnants and roll ends, a pad that meets the warranty, doing your own removal, comparing 3 quotes using the quote check | 150 |
| 11 | FAQ | see §6 | 400 |
| 12 | Sources, price date & methodology | Via `HowWeCalculate` | — |

**Writing rules:**
- Short sentences.
- Numbers come only from engine or sourced constants.
- No "accurately/exact" claims. Write "estimate", and tell users to get local quotes.
- No made-up statistics.
- No author name unless the owner supplies one (`TODO(owner)`).

---

## 6. FAQ (10–12, each answer 40–70 words, numbers from the engine)

1. How much does carpet cost per square foot installed? (`carpet cost per square foot`)
2. How much does carpet replacement cost, including removal? (`carpet replacement cost`)
3. How much does it cost to carpet a 12×12 room? (also mention 10×12)
4. How much does it cost to carpet stairs? (`cost to replace carpet on stairs`)
5. How much carpet do I need for my room? Why do I need extra?
6. What's the difference between price per square yard and per square foot?
7. How much does carpet padding cost, and which pad should I choose?
8. Is Berber carpet cheaper than plush?
9. How much does carpet removal cost? (`carpet removal prices`)
10. How much does carpet tile installation cost? (`carpet tile installation cost`, KD 11)
11. Is carpet cheaper than vinyl plank or laminate?
12. Can carpet be repaired instead of replaced? (`carpet repair cost`, KD 12)

---

## 7. Beat-the-competitor checklist (must all be ✅ before shipping)

| Gap in SERP | Our page |
|---|---|
| No tool on 8/10 pages | Full calculator above the fold |
| Nobody models roll width or seams | Roll layout engine + SVG diagram |
| Line items broken (Homewyse) | Every line shown, tested |
| Removal and stairs priced inconsistently | One engine feeds the tool, tables and FAQ |
| Prices not editable anywhere | Every price editable, sq ft ↔ sq yd |
| No metric or non-USD | ft/m + currency symbol |
| Old or no dates, few sources | Price date + linked sources in HowWeCalculate |
| No comparison with other floors | Carpet vs LVP vs laminate vs hardwood |
| No quote check | Quote check box |
| Lead-gen / store promos | No contact gate, no network |

---

## 8. Definition of done

- [ ] `npm run verify` passes all steps (lint, types, tests, build, seo-audit, no-network). Save the output to `docs/evidence/`.
- [ ] Engine tests cover §3.4.
- [ ] All prices have a source and date, or the page is blocked with `TODO(owner)`.
- [ ] Mobile check at 390 px: inputs stack, the results table scrolls inside its own box, and the diagram scales.
- [ ] Title ≤ 60, meta ≤ 160, one H1, FAQ in the visible page **and** schema (no duplicate FAQ blocks).
- [ ] Added to sitemap via routes, tools catalog, home/tools hub, internal links in and out.
- [ ] Docs updated: status, features, SEO, keywords, changelog.
- [ ] After merge: request indexing in GSC (owner).
