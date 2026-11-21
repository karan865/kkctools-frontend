# Epoxy River Table Calculator — Build Spec

> **URL:** `/epoxy-table-calculator/` · Batch 4 · Tier 2 · **Build order 2** (shares `epoxy-engine` with #1)
> **Read first:** `../00_BATCH4_BUILD_RULES.md`
> **Inputs:** `05_Epoxy_River_Table_Calculator_Competitor_Analysis.md`, keyword file §2 #5
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**Volume and difficulty:** ~58,000 searches of table vocabulary, many at KD 2–15:

| Keyword | US vol | KD |
|---|---:|---:|
| `table top epoxy` | 2,900 | 12 |
| `epoxy on table top` | 1,600 | 5 |
| `resin table top` | 1,300 | 6 |
| `epoxy dining table` | 1,300 | 2 |

**Intent risk:** many searchers are browsing or buying tables, not making one. The page must serve makers first and still answer "what size / how much resin would a table like this take".

**Competitor gaps:**
- Blacktail has the best method, but a maths error (average width 12.34, not 11.77).
- The micro-sites miss variable-depth segments and never check pour depth against the product's max layer.

### Research notes from the competitor analysis (added 2026-11-22)

- Researched the **maker query** `epoxy river table calculator` because the table keywords are mostly shopping/inspiration (ad comp 1.00).
- Pages read: Blacktail Studio (best method; average-width slip 432 ÷ 35 = 12.34, not 11.77), RePaintNow, Resin Calculators and Epoxy Planner (pages.dev micro-sites), UltraClear/Best Bar Top help doc (brand coverage figures: cite or omit).

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | epoxy resin table | 2,900 | 15 | title, H1, first sentence |
| Secondary | table top epoxy · epoxy on table top · epoxy for table top · tabletop epoxy · epoxy table top | 2,900 · 1,600 · 720 · 1,000 · 2,900 | 5–22 | Table-top tab + H2 "Epoxy for a table top" |
| Secondary | epoxy river table · river table · epoxy resin river table | 2,400 · 2,900 · 1,600 | 23–28 | River tab + H2 "How much epoxy for a river table" |
| Secondary | resin table top · resin table · resin tables · resin top tables | 1,300 · 3,600 · 1,600 · 590 | 6–17 | intro + H2s |
| Secondary | epoxy wood table · epoxy resin wood table · epoxy for wood table · woodworking epoxy · wood resin · live edge epoxy table | 1,900 · 1,600 · 480 · 720 · 590 · 1,000 | 7–20 | H2 "Live-edge and wood slab tables" |
| Secondary | epoxy coffee table · epoxy dining (room) table(s) | 1,300 · 1,300 · 720 · 720 | 2–9 | size presets + H2 "Coffee vs dining table resin amounts" |
| Secondary | epoxy resin table kit · epoxy table mold | 880 · 720 | 8–21 | kit planner + mold sizing |
| Support | epoxy tables · epoxy resin on table tops · table with epoxy top | 5,400 · 2,900 · 2,900 | 20–26 | H2 "Making vs buying an epoxy table" (honest, no prices unless the owner supplies them) |
| Skip | table en epoxy (French) | — | — | — |

## 2. Our edge

- **Segment mode:** each section has its own length, width readings (averaged correctly) and depth. 0 competitors.
- **Width-reading helper:** widths every X in → correct average.
- **Full build in one result:** river + under-slab seepage + seal coat + flood coat + edges + waste.
- **Pour planner:** max layer depth from the label → pours, volume per pour, A:B per pour.
- **Size presets** (coffee, dining, bar top, custom).
  - **Preset dimensions are labelled "example sizes", owner-approvable.** `TODO(owner)` to confirm.
- **Mold sizing:** slab + margin → inner mold size + release area.
- Kit planner + cost (user prices). Metric + imperial.

## 3. Calculator spec

### 3.1 Tabs

1. **River table** (default)
2. **Table-top flood coat**
3. **Full build** (river + coats)

### 3.2 Input guide diagram (above the inputs)

`EpoxyTableInputGuide.tsx`: a top view of a table with two wood slabs and a blue river between them.

- **River labels:** "1 River length"; "2 River width readings (every X in)" shown as small arrows across the river; "3 River depth" in a side-section inset.
- **Inset extras:** a thin "4 Seepage gap" under the slab.
- **Top coat:** "5 Flood coat thickness" over the whole top; "6 Edge height" around the perimeter.
- **Pours:** stacked layers marked "7 Max depth per pour (label)".

Live values; the focused field highlights.

### 3.3 Inputs (defaults = examples)

| Field | Default |
|---|---|
| Units | in / cm |
| River | length 48 in; average width 6 in (or width readings / segments); depth 1 in |
| Seepage | under-slab gap: optional, 0 |
| Seal coat | % or thickness: optional |
| Flood coat | table 48 × 24 in, 1/8 in |
| Edges | perimeter × edge height: optional |
| Waste | 10% |
| Max depth per pour | 0.5 in. Label: "example, use your product's label" |
| Mix ratio / densities | 1:1 by volume, example |
| Kits + prices | optional |
| Preset | custom |

### 3.4 Engine

Reuse `epoxy-engine.ts`. Add `averageWidth(readings)` and `riverSegments([{L, widths[], D}])`.

```ts
river = Σ Lᵢ × avg(widthsᵢ) × Dᵢ ; seepage = slabFootprint × gap (+ perimeter × gap)
flood = topArea × thickness ; edges = perimeter × edgeHeight × edgeThickness
total = (river + seepage + seal + flood + edges) × (1 + waste)
pours = ceil(maxDepth / maxLayer)
```

**Worked example (checked 2026-11-22):**

| Part | Volume |
|---|---:|
| River 48 × 6 × 1 in | 288 in³ |
| Flood coat 48 × 24 × 1/8 in | 144 in³ |
| **Total with 10% waste** | **475.2 in³ = 2.057 US gal = 7.79 L** |

River 1 in at a 0.5 in max layer → **2 pours**.

### 3.5 Outputs

- **Headline:** total gallons / litres + number of pours.
- **Sentence:** "A 48-inch river, 6 inches wide and 1 inch deep, plus a 1/8-inch flood coat on a 48 × 24 in top, needs about 2.06 gallons of mixed epoxy, poured in 2 layers."
- Breakdown table (river, seepage, seal, flood, edges, waste).
- **Pour plan table:** pour #, volume, A, B.
- Kits + cost. Mold size.
- **Printable pour plan.** Share URL.
- Safety + exotherm note.

### 3.6 Tests

- Average width (Blacktail case: 432 ÷ 35 = 12.34).
- Segments with different depths.
- Seepage; pours; the worked example. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Epoxy Table Calculator – River Table Resin Amount` (49; 61 with the suffix → `absoluteTitle`) |
| Meta | `Free epoxy table calculator. Work out the resin for a river table or a table top: river volume, number of pours, flood coat and mix ratio.` (138) |
| H1 | `Epoxy River Table Calculator: Resin for the River, Pour and Top Coat` |
| BLUF | "For an epoxy resin table, multiply river length × average width × depth, then add the flood coat (table area × thickness) and about 10% waste. A 48 × 6 × 1 in river plus a 1/8 in top coat needs about 2.06 US gallons." (engine) |
| ToolShell pills | `River segments & width readings`, `Pour planner`, `Full build in one result`, `Printable pour plan` |
| Links out | Epoxy Resin (#1), Square Footage (live), Board & Batten / wood tools (live), Construction Estimate Template (live) |
| Links in | Epoxy Resin, Tools hub |

## 5. Content (~1,800–2,100 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the epoxy table calculator | 3 tabs | 120 |
| 2 | How much epoxy for a river table | Formula, width readings, engine example | 250 |
| 3 | Measuring an irregular river correctly | Average-width method + common mistake | 180 |
| 4 | Epoxy for a table top (flood coat) | Engine example | 180 |
| 5 | How many pours? Layer depth and heat | Pour planner; follow the label | 180 |
| 6 | Coffee vs dining table resin amounts | Presets from the engine | 150 |
| 7 | Live-edge and wood slab tables | Seepage, sealing, mold | 180 |
| 8 | Building the mold | Size + margin, release | 130 |
| 9 | Making vs buying an epoxy table | Honest note, no invented prices | 120 |
| 10 | FAQ | §6 | 400 |

## 6. FAQ (12, from the competitor question bank + cluster keywords)

1. How much epoxy do I need for a river table?
2. How do I measure an irregular river?
3. How much extra epoxy should I add for waste and seepage?
4. How deep can I pour epoxy in one layer? (label value)
5. How much does an epoxy river table cost to make vs buy? (user prices only; no invented figures)
6. How much epoxy for a coffee table vs a dining table?
7. How much epoxy for a table-top flood coat?
8. Do I need a seal coat on the wood first?
9. What mold should I use, and how big?
10. Deep-pour vs table-top epoxy: which one?
11. How many litres or gallons is a typical river table? (engine presets)
12. What size epoxy table kit should I buy?

## 7. Done when

- [ ] Engine additions + tests; `npm run verify` passes.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Preset sizes labelled examples; no invented prices or pour depths.
- [ ] Registrations + docs; `graphify update .`.
