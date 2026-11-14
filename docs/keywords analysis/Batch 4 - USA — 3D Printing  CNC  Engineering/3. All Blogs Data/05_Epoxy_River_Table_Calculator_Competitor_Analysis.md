# Epoxy River Table Calculator — Competitor Analysis

> **Target page:** KKCTools `/epoxy-table-calculator/` (Batch 4, Tier 1 #5)
> **Primary keyword:** `epoxy resin table` — US 2,900 · KD 15 · CPC $0.69 · ad comp 1.00 (cluster 35 keywords, 58,540 US vol, 20,100 on KD ≤ 15)
> **SERP source:** ⚠ There is no Semrush SERP export for Batch 4. Competitors come from a live web search on 2026-11-14 for `epoxy river table calculator`. `TODO(owner): pull Google top 10 for "epoxy resin table" — likely dominated by shops/Pinterest/images (buy intent).`
> **Pages visited:** 2026-11-14. 5 read: Blacktail Studio (Cameron Anderson), RePaintNow, Resin Calculators large-pour, Epoxy Planner river-table, Best Bar Top/UltraClear deep-pour coverage. JeffMack's river mode, already audited in file 01, is reused here.

---

## 0. How this was collected (read first)

- **Intent warning (keyword file):** "epoxy resin table", "epoxy tables" and "resin table" are mostly **shopping and inspiration** searches (ad comp 1.00). We therefore researched the maker query `epoxy river table calculator`, which has the calculator intent. `TODO(owner)`: check the real SERP for the primary keyword. If it is all product listings, keep the planning answer above the fold and add a short "buying vs making" section.
- **Pages read:**
  - Blacktail Studio blog: a known river-table maker, and the most practical method.
  - RePaintNow: an affiliate blog.
  - Resin Calculators (pages.dev): a calculator plus cost.
  - Epoxy Planner (pages.dev): a calculator with segments, buffers and layers.
  - UltraClear / Best Bar Top help doc: a brand's coverage figures.
- **Already covered in file 01 (Epoxy Resin Calculator):** JeffMack (river, mould and top-coat modes), TotalBoat, Omni, EPODEX, MAS, IntoResin. We do not repeat them. This page shares the engine with Tool #1.
- Arithmetic was re-checked (231 in³ per US gal; 61.02 in³ per L). No competitor text is copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | blacktailstudio.com (squarespace) /blog/epoxy-volume-calculation | Maker blog (river tables) | How to Calculate How Much Epoxy For Your Table | ~900 |
| 2 | repaintnow.com (?p=7290) | Affiliate blog | How Much Epoxy is Needed for a River Table? | 2,000–2,200 |
| 3 | resincalculators-gh.pages.dev/large-pour-calculator | Calc micro-site | Deep Pour Epoxy & River Table Calculator | ~2,000 |
| 4 | epoxyplanner.pages.dev/river-table-epoxy-calculator | Calc micro-site | River Table Epoxy Calculator: Resin Volume, Waste & Cost | ~800 |
| 5 | help.bestbartopepoxy.com/article/853-deep-pour-epoxy-coverage | Epoxy brand help doc | Epoxy Coverage Calculator – Deep Pour Epoxy | ~120 |
| 6 | jeffmacksupply.com/pages/epoxy-resin-calculator (from file 01) | Epoxy store | Epoxy Calculator (river mode) | 350–450 |

**What this tells us:**
- **The best method comes from a maker, but has a maths error.** Blacktail measures the width every 6 in and averages it, then adds two seepage terms: under the slab and around the perimeter. Its average width is wrong: 432 ÷ 35 = 12.34, not 11.77.
- **The calculator micro-sites are the closest feature competitors.** Epoxy Planner has segments, waste/seepage/seal buffers, A:B split, layers and kits. Resin Calculators has river, coating and cost.
  - Weak point: neither one checks the pour depth against the product's maximum layer depth.
  - Weak point: neither handles variable depth or unequal-length segments.
- **None of them covers the whole build in one tool:** river volume + seal coat + flood coat + edges + number of pours + mix split + kits + cost.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Blacktail | RePaintNow | Resin Calcs | Epoxy Planner | UltraClear | JeffMack |
|---|---|---|---|---|---|---|
| Working calculator on page | ❌ (method) | ❌ (links to TotalBoat) | ✅ | ✅ | ❌ (links out) | ✅ |
| River L × average W × D | ✅ manual | ✅ text | ✅ (one width) | ✅ | ⚠️ L×W×T | ✅ |
| Several width readings / segments | ✅ every 6" | ✅ every 4–6" | ❌ | ✅ (equal-length segments only) | ❌ | ❌ |
| Variable depth | ❌ (thinnest slab) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Seepage under slabs / mould gaps | ✅ ⅛" gap × form area | ❌ | ❌ | ✅ % | ❌ | ⚠️ |
| Waste / buffer % | ⚠️ (seepage is the buffer) | ⚠️ 10–20% | ✅ 15% toggle | ✅ 12 + 8 + 5% (added, not compounded) | ❌ | ⚠️ |
| Seal coat | ❌ | ⚠️ text | ❌ | ✅ 5% | ❌ | ❌ |
| Flood / top coat over the whole top | ❌ | ❌ | ✅ (coating mode) | ❌ | ✅ coverage by thickness | ✅ top coat mode |
| Edges | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Pours: max depth per layer → count | ❌ | ⚠️ "work in stages" | ❌ | ⚠️ layer guidance (rule unclear) | ❌ | ❌ |
| Mix ratio A:B split (volume / weight) | ❌ | ❌ | ❌ | ✅ (weight-ratio method unclear) | ❌ | ❌ |
| Kits (round up to kit sizes) | ❌ | ❌ | ❌ | ✅ | ⚠️ kit coverage | ❌ |
| Cost | ❌ | ⚠️ unsourced ranges | ✅ fixed $/L ranges | ✅ | ❌ | ❌ |
| Size presets (coffee, dining, bar top) | ❌ | ⚠️ small/med/large table | ⚠️ examples | ❌ | ❌ | ❌ |
| Mould size from slab size | ⚠️ form 125×51 | ❌ | ❌ | ❌ | ❌ | ❌ |
| Units in/cm, L/gal | ⚠️ liters via external tool | ⚠️ | ❌ cm only | ✅ toggle (labels unclear) | ❌ | ✅ |
| Weight output (kg/lb) | ❌ | ❌ | ❌ (promised) | ❌ | ❌ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Blacktail | RePaintNow | Resin Calcs | Epoxy Planner | UltraClear |
|---|---|---|---|---|---|
| Worked example | ✅ real table (width error) | ⚠️ size table (some overstated) | ✅ 5 (1 rounding slip) | ✅ 72×1.5×6 = 648 in³ (checked) | ❌ |
| Deep pour vs table-top epoxy explained | ⚠️ | ⚠️ | ✅ (unsourced temps) | ✅ product fit | ❌ |
| Mould build guidance | ⚠️ | ✅ HDPE/melamine | ❌ | ⚠️ checklist | ❌ |
| Cure times / temperature | ❌ | ⚠️ | ⚠️ unsourced | ⚠️ links to data sheets | ⚠️ "72 h light use" |
| Cost of a river table | ❌ | ✅ unsourced | ✅ hard-coded | ✅ | ❌ |
| FAQ count | 0 | 0 | several | yes | 0 |
| Named author | ✅ Cameron Anderson | ✅ (painter, not an epoxy expert) | ❌ | ⚠️ site authors page | ❌ |
| Date | ✅ Dec 2019 | ⚠️ 2026 affiliate update | ❌ | ✅ reviewed Oct 2026 | ✅ Sep 2026 |

---

## 4. Competitor-by-competitor detail

### 1. Blacktail Studio: How to Calculate How Much Epoxy for Your Table (the method benchmark)
- **Method:**
  - Measure the river width every 6 in (every 4 in on small pieces), taking top and bottom on sloped edges, then average.
  - Length: 195 in along the curves.
  - Height: the thinnest slab, 2.75 in.
  - Base volume, plus **under-slab seepage** (⅛ in × 125 × 51 form = 13 L), plus **perimeter seepage** (350 in × 2.75 × ⅛ = 1.97 L).
- **Numbers checked:**
  - **Average width is wrong:** 432 ÷ 35 = 12.34 in, but the page says 11.77.
  - The page rounds down to 11 in to account for an island.
  - Base 11 × 195 × 2.75 = 5,899 in³ = 96.7 L ✔. Under-slab 13.1 L ✔. Perimeter 1.97 L ✔.
  - Total: 111.7 L (the page says 111). The author used 105 L in practice.
- **Weak points:**
  - Single pour, with no layer or max-depth discussion.
  - Converts units with an outside calculator.
  - Typos and a leftover embed placeholder.

### 2. RePaintNow: How Much Epoxy for a River Table
- **Method:** Measure the average width (every 4–6 in), length and depth. Add 10–20%.
- **Size table checked (assuming the river runs the full table length):**
  - Small (36 in): says 0.5–1 gal; calculates to 0.23–0.47 gal. Roughly covered by the buffer.
  - Medium (48 in): says 1–2 gal; calculates to 0.62–1.25 gal. **Overstated.**
  - Large (72 in): says 2–4+ gal; calculates to 1.87–4.68 gal. Consistent.
- **Cost (unsourced):** DIY $120–2,000+; retail tables $300–6,000+.
- **Weak points:**
  - No conversion factor given.
  - No per-layer depth, even though it lists 2–3 in deep rivers.
  - Recommends a 16 oz kit, far too small for a river table.
  - Empty price column in the product table.
  - Unsupported "food-safe" claims.

### 3. Resin Calculators: Large Pour / River Table Calculator
- **Modes:** river (length, width, depth in cm), coating (thickness in mm), art piece and custom pour. Optional +15% buffer.
- **Outputs:** litres, gallons, cost ranges.
- **Examples checked:**
  - 180×15×5 cm = 13.5 L → 15.5 L with buffer → 4.1 gal ✔
  - 240×20×6 = 28.8 → 33.1 L → **8.75 gal** (the page says 8.7)
  - The upper bounds of the cost ranges are a little low.
- **Inconsistencies:**
  - Resin priced at $21–27/L in one place and $21–32/L in another.
  - The buffer components add up to 10–16% but the buffer is fixed at 15%.
  - Recommends a heat gun while also warning against one.
- **Weak points:**
  - cm only, no imperial.
  - No depth limit check, no weight, no pours, no mix ratio.
  - Unsourced 200–300 °F core temperatures.

### 4. Epoxy Planner: River Table Epoxy Calculator (the closest feature competitor; reviewed Oct 2026)
- **Inputs:**
  - Imperial/metric, length, depth, width or segment widths.
  - Waste, seepage and seal-coat percentages.
  - Product max layer depth, batch size (L), kit size (L/gal), price.
- **Outputs:** raw / conservative / standard volume, cost, A:B split, layer guidance, kits, product fit.
- **Example checked:** 72 × 1.5 × 6 = 648 in³ = 2.81 gal ✔. With +25% (12 + 8 + 5 added together) = 3.51 gal ✔. Compounding the three would give 3.56.
- **Weak points:**
  - Uniform depth only.
  - Segments must be equal length.
  - Doesn't explain how a weight ratio becomes a volume ratio.
  - Layer rule is unclear.
  - Batch-size field is always in litres.
  - Cost basis (raw or buffered volume) not stated.

### 5. UltraClear / Best Bar Top: Deep Pour Coverage
- **Coverage per 1.5 gal kit:** ¼ in → 10 ft², ½ in → 5 ft², 1 in → 2.5 ft². These are **rounded up about 4%**; exact figures are 9.63 / 4.81 / 2.41 ft².
- **Example:** a 4 × 2 ft table at ½ in = 2.49 gal exactly, versus 2.4 gal from the page's rating.
- **Weak points:** no max depth per layer, no waste allowance, no example, no author.

### 6. JeffMack: river mode (see file 01)
- River, rectangle mould, round mould, top coat, void fill and known-volume modes.
- Thin copy, and no pours or seepage.

---

## 5. Patterns

- **Maths:**
  - River volume = L × W_avg × D.
  - Better: the sum of segments (Lᵢ × W̄ᵢ × Dᵢ), so lengths and depths can differ.
  - Seepage under slabs = gap × mould footprint. Perimeter seepage = perimeter × height × gap.
  - Flood coat = top area × coat thickness.
  - Seal coat = area × thin coat (or a %).
  - Edges = perimeter × edge height × coat thickness.
  - Buffer: compounded or additive. Say which one is used.
  - Pours = ceil(D ÷ max layer depth from the product label).
  - Volume per pour = area × layer depth.
  - Mix by volume: A = V × a/(a + b). By weight, use the product densities or the label weight ratio.
  - Kits = ceil(V ÷ kit size). Cost = kits × price.
- **Unit facts:** 231 in³ = 1 US gal; 1 L = 61.024 in³; 1 gal = 3.785 L.
- **Typical depths (the river is usually the slab thickness, 1.5–2.75 in):** deep-pour products are needed. The layer limit must come from the **product label**, so it is an input, not a constant.

| Section | Pages (of 6) |
|---|:---:|
| River L × W × D | 6 |
| Width averaging / segments | 3 |
| Seepage | 2 |
| Pours / layers | 1 (unclear) |
| Flood / top coat | 3 |
| Mix split | 1 |
| Cost | 3 |
| Variable depth | **0** |
| Edges | **0** |

---

## 6. FAQ question bank

★ = asked on 2 or more pages, or a cluster keyword. Map answers to the cluster: epoxy resin table, epoxy river table, table top epoxy, epoxy coffee table, epoxy dining table, live edge epoxy table, epoxy resin table kit, epoxy table mold, river table.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How much epoxy do I need for a river table? | all |
| 2 | ★ How do I measure an irregular river? | Blacktail, RePaintNow, Epoxy Planner |
| 3 | ★ How much extra epoxy should I add for waste/seepage? | Blacktail, RePaintNow, Resin Calcs, Epoxy Planner |
| 4 | ★ How deep can I pour epoxy in one layer? | RePaintNow, Resin Calcs, Epoxy Planner |
| 5 | ★ How much does an epoxy river table cost (DIY vs buy)? | RePaintNow, Resin Calcs · `epoxy tables` buy intent |
| 6 | How much epoxy for a coffee table vs a dining table? | RePaintNow, Resin Calcs · `epoxy coffee table`, `epoxy dining table` |
| 7 | How much epoxy for a table-top flood coat? | UltraClear, Resin Calcs · `table top epoxy` |
| 8 | Do I need a seal coat on the wood first? | RePaintNow, Epoxy Planner |
| 9 | What mould should I use, and how big? | RePaintNow · `epoxy table mold` |
| 10 | Deep-pour vs table-top epoxy: which one? | Resin Calcs, Epoxy Planner |
| 11 | How many litres or gallons is a typical river table? | Blacktail, Resin Calcs |
| 12 | What size epoxy table kit should I buy? | `epoxy resin table kit` |

---

## 7. Gaps nobody fills: our opportunities

1. **Segment mode with variable depth and unequal lengths.** Each section gets its own L, W̄ and D. No competitor offers this.
2. **Width-reading helper:** enter widths measured every X inches and the tool averages them correctly (Blacktail's arithmetic slip shows why this matters).
3. **Full build in one result:**
   - river volume + under-slab and perimeter seepage
   - seal coat + flood coat + edges
   - waste (compounded, and stated as such)
4. **Pour planner:** product max layer depth (from the label), then the number of pours, litres per pour and an A:B split per pour.
5. **Mix by volume or weight** using the label ratio, with weight output in kg/lb.
6. **Kit planner:** round up to the kit sizes the user enters, then the cost. Prices are user-entered, so no live prices.
7. **Size presets:** coffee, dining, bar top and live-edge slab examples, all owner-approved dimensions.
8. **Mould sizing:** inner mould dimensions from the slab size plus a margin, and the release area.
9. **Correct worked examples in both unit systems.**
10. **Buyer section:** a short, honest "making vs buying" note to catch the shopping intent. No fake prices; cost ranges only if the owner provides them.
11. **Shared engine with the Epoxy Resin Calculator (#1),** with links both ways.

---

## 8. Blueprint for the KKCTools Epoxy River Table Calculator

### 8.1 SEO

- **URL:** `/epoxy-table-calculator/`
- **Title:** Epoxy Table Calculator – River Table Resin Amount
- **H1:** Epoxy River Table Calculator: Resin for the River, Pour and Top Coat
- **Meta:** as in the Batch 4 keyword file (138 characters).
- **Above the fold:** a quick answer ("A 72 × 6 × 1.5 in river needs about … gal plus …"), then the calculator.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Units | in/cm; output in L, US gal, fl oz; weight in kg/lb (from density or label) |
| River | Simple (L, average W, D) or segments (Lᵢ, widths list → average, Dᵢ) |
| Seepage | Under-slab gap × mould footprint; perimeter gap (optional) |
| Coats | Seal coat thickness/%, flood coat (top area × thickness), edges (perimeter × edge height) |
| Waste | % (compounded, shown) |
| Pours | Max layer depth from the label → number of pours, volume per pour |
| Mix | Ratio by volume or weight → A and B per pour and total |
| Kits / cost | Kit size(s) and price, entered by the user → kits needed, leftover, total cost |
| Presets | Coffee / dining / bar top / custom (owner-approved sizes) |
| Mould | Slab size + margin → mould inner size |
| UX | Share URL, printable pour plan, no network |

### 8.3 Content outline (≈ 1,600–2,000 words, original)

1. Intro (primary keyword) and quick answer
2. How to use
3. How to measure a river (width readings, depth, sections), with an example
4. Seepage and waste allowance
5. Seal coat, flood coat and edges
6. Planning pours (layer depth from the label, cure between pours)
7. Mixing ratio (volume vs weight)
8. Typical amounts for coffee and dining river tables (our own calculated examples)
9. Building the mould
10. Cost: DIY vs buying a finished epoxy table (no invented prices)
11. Safety (ventilation, gloves, heat in deep pours; refer to the product SDS)
12. FAQ (10–12)
13. Related tools: Epoxy Resin (#1), Board Foot / lumber (Batch 1/2), 3D Print Cost (#2), Unit Price (Batch 3 #5)

### 8.4 Quality checks

- Unit tests for segments, seepage, coats, compounded waste, pours, mix by volume/weight, kits and unit conversions.
- Re-check every page example in tests (e.g., 648 in³ = 2.805 gal; 432 ÷ 35 = 12.34).
- No competitor wording copied. `npm run check:no-network` passes.
- `TODO(owner)`:
  - pull the Google top-10 SERP for `epoxy resin table` and `epoxy river table`
  - approve the size-preset dimensions
  - decide whether to show cost ranges (owner-sourced only)
