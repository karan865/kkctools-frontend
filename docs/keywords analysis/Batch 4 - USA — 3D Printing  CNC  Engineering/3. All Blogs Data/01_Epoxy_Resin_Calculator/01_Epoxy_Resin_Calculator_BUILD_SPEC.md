# Epoxy Resin Calculator — Build Spec

> **URL:** `/epoxy-resin-calculator/` · Batch 4 · Tier 1 · **Build order 1**
> **Read first:** `../00_BATCH4_BUILD_RULES.md`
> **Inputs:** `01_Epoxy_Resin_Calculator_Competitor_Analysis.md`, keyword file §2 #1
> **SERP:** provisional (no Semrush export)
> **Written:** 2026-11-22

---

## 0. Strategy

**Easy tool terms:**

| Keyword | US vol | KD |
|---|---:|---:|
| `epoxy calculator` | 2,400 | 13 |
| `epoxy resin calculator` | 1,300 | 5 |
| `art resin calculator` | 480 | 3 |
| `resin calculator` | 1,600 | 19 |

There is also a large FAQ cluster around them: mix ratio, deep pour, cure time, food safe, marine.

**Competitor landscape:**
- Jeff Mack has the best tool.
- Woodworking Advisor has the best content.
- Most tools are imperial-only, locked to one brand, and have no cost or kit planner.

**Our angle:** every shape in one brand-neutral tool, metric + imperial, with:
- a generic mix ratio by volume **or** weight;
- a deep-pour planner;
- a kit planner.

The River Table page (#5) shares the engine.

### Research notes from the competitor analysis (added 2026-11-22)

- Pages read: TotalBoat, Omni, Jeff Mack Supply, IntoResin, EPODEX, MAS Epoxies, Woodworking Advisor. **Resin brands dominate: their calculators sell kits.** Product facts (max pour depth, mix ratio, density) stay user inputs from the data sheet; never default to a brand's numbers without citation.
- Omni's FAQ has an arithmetic error; Woodworking Advisor's tool is rectangle-only with a fixed 1:1 split. Our examples are engine-checked.
- IntoResin's **water method** for irregular molds (fill with water, measure, convert) is a real user need: add it as a "Known volume" helper with steps.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | epoxy calculator | 2,400 | 13 | title, H1, first sentence |
| Secondary | epoxy resin calculator · art resin calculator · resin calculator | 1,300 · 480 · 1,600 | 3–19 | tool heading, intro, H2 |
| Secondary | epoxy resin and hardener · epoxy and hardener · epoxy hardener · hardener | 880 · 590 · 480 · 590 | 4–9 | H2 "Mixing resin and hardener (mix ratio)" |
| Secondary | deep pour epoxy (resin) · deep pour resin · deep pour epoxy resins | 2,400 · 480 · 480 | 6–19 | Deep pour tab + H2 |
| Secondary | casting resin · epoxy resin casting · clear casting resin · epoxy casting resin | 1,900 · 590 · 1,900 · 880 | 14–18 | Mold/casting tab + H2 |
| Secondary | 5 gallon epoxy resin | 590 | 3 | kit planner output |
| FAQ | how long does epoxy take to dry (and variants) | 1,900 · 1,000 · 720 | 8–23 | FAQ: "check your product's data sheet"; **no times printed** |
| FAQ | food safe epoxy (resin) · is epoxy food safe · food safe resin | 4,400 · 1,000 · 590 · 1,000 | 4–28 | FAQ: depends on the product's certification; mention FDA 21 CFR 175.300 **only if the builder reads the eCFR page and cites it**; no product claims |
| FAQ | what is epoxy · what is epoxy resin · what is in epoxy · epoxy vs resin | 3,600 · 880 · 1,000 · 720 | 5–24 | short H2 "What is epoxy resin?" + FAQ |
| FAQ | marine epoxy (resin) · uv resistant epoxy/resin | 2,900 · 720 · 720 · 720 | 12–18 | FAQ, general; no product claims |
| FAQ | how to use epoxy resin | 880 | 10 | H2 "How to use the result: mixing and pouring basics" |

## 2. Our edge

| Feature | Competitors |
|---|---|
| All shapes: rectangle, circle, river (avg width or segments), cylinder/box mold, void fill, known volume | Jeff Mack has most, others 1–2 |
| Several sections summed (top + edges + river) | rare |
| Coat presets: seal / flood / deep pour + edge-drip % + waste % | partial |
| Mix ratio any A:B, by volume **or** weight (densities from the label) | brand-locked |
| Deep-pour planner: max layer depth (label) → number of pours, volume per pour | Jeff Mack only |
| Kit planner (16 oz, 32 oz, 1 gal, 1.5 gal, 3 gal, 5 gal, 1 L, 5 L; editable) + optional price → cost | none |
| Metric + imperial together; brand-neutral | most imperial-only |

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`)

1. **Coating** (table/bar top, art panel)
2. **Deep pour / river**
3. **Mold & casting**
4. **Known volume** (just mix + kits)

### 3.2 Input guide diagram (above the inputs)

`EpoxyInputGuide.tsx`: an isometric slab.

- **Labelled sides:** "1 Length", "2 Width" and a thin top layer "3 Thickness".
- **Edges:** a drip lip labelled "4 Edge drip %".
- **Waste:** a small cup labelled "5 Waste %".
- **To the right, the mixing:** two bottles "A" and "B" with "6 Mix ratio (by volume / by weight)".
- **Deep pour tab:** the slab shows stacked layers, each marked "7 Max depth per pour (from your label)".
- **Mold tab:** a cylinder and a box with "Diameter / Height" badges.

Live values; the focused field highlights.

### 3.3 Inputs (defaults = examples)

| Field | Default |
|---|---|
| Units | in / cm |
| Shape | rectangle |
| Length × width | 48 × 24 in |
| Thickness | 1/8 in (fractions accepted, or mm) |
| Coat preset | flood (seal coat = user thickness) |
| Edge drip % | 0% |
| Waste % | 10% |
| Mix ratio | 1:1 by volume. Label: "example, use your product's ratio" |
| Densities A/B | optional, for weight mode |
| Max depth per pour | Deep tab only. Label: "from your product label"; **no default value**; a required input |
| Kit sizes + price per kit | optional |
| Add section | button: sums several shapes |

### 3.4 Engine (`src/lib/epoxy-engine.ts`, shared)

```ts
volumeIn3(shape): rect = L*W*T ; circle = π r² T ; cylinder = π r² H ; box = L*W*H ; river = L * avgW * D (or Σ segments)
withAllowances = v * (1 + edgePct) * (1 + wastePct)   // show both steps
toFlOz = in3 / 1.804688 ; toGal = in3 / 231 ; toMl = in3 * 16.387064 ; toL = toMl / 1000
mixSplit volume: A = v * a/(a+b), B = v * b/(a+b) ; weight mode: needs densities → grams/oz by weight ratio
pourPlan(depth, maxLayer) = ceil(depth / maxLayer) pours, volume per pour   // null if maxLayer <= 0
kitPlan: smallest total leftover combination of user kit sizes (greedy + check), cost = Σ price
```

**Worked example (checked 2026-11-22):**
- 48 × 24 in at 1/8 in = **144 in³** = 0.623 US gal = 79.79 fl oz.
- With 10% waste: **87.77 fl oz** (2,596 mL).
- 1:1 split → about **43.9 fl oz each** of resin and hardener.

### 3.5 Outputs

- **Headline:** total mixed volume (fl oz / gal and mL / L).
- **Sentence:** "A 48 × 24 in table top at 1/8 in needs about 88 fl oz of mixed epoxy with 10% waste: roughly 44 fl oz of resin and 44 fl oz of hardener at a 1:1 ratio."
- A/B table (volume and, if densities given, weight).
- Pours (deep tab).
- Kit plan + leftover + cost.
- Coverage per gallon (the same coat over sq ft).
- **Printable shopping list.** Share URL, Copy.
- **Safety note:** gloves, ventilation, follow the label; deep pours can overheat if poured thicker than the label allows.

### 3.6 Tests

- Each shape.
- Unit conversions (231, 1.804688, 16.387064).
- Allowances compound.
- Volume and weight mix split.
- `pourPlan`, including maxLayer 0 → `null`.
- Kit plan picks a valid combo.
- The worked example. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Epoxy Resin Calculator – How Much Resin You Need` (48; 60 with the suffix: OK) |
| Meta | `Free epoxy resin calculator. Enter the size of a coating, deep pour or mold and get the resin volume in oz, gallons or litres, split by mix ratio.` (146) |
| H1 | `Epoxy Resin Calculator: How Much Resin and Hardener to Mix` |
| BLUF | "Epoxy needed = length × width × thickness. A 48 × 24 in table top coated 1/8 in thick holds 144 cubic inches, about 80 fl oz; add 10% for waste and you need about 88 fl oz, split by your mix ratio." (engine) |
| ToolShell pills | `Every shape & deep pours`, `Mix by volume or weight`, `Kit planner`, `Inches or cm` |
| Links out | Epoxy Table (#5), 3D Print Cost (resin mode), Square Footage (live), Paint (live, not epoxy) |
| Links in | Epoxy Table, 3D Print Cost, Tools hub "3D Printing & CNC" |

## 5. Content (~1,800–2,100 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the epoxy calculator | 4 tabs | 120 |
| 2 | How much epoxy do I need? The formula | Volume formula + unit conversions + engine example | 220 |
| 3 | Seal coat vs flood coat vs deep pour | What each is for; thickness is an input from the product | 200 |
| 4 | Mixing resin and hardener (mix ratio) | By volume vs by weight, why weight needs densities (`epoxy resin and hardener`) | 220 |
| 5 | Deep pour epoxy: how many pours? | Pour planner example; heat/exotherm warning (`deep pour epoxy`) | 200 |
| 6 | Casting resin in molds | Cylinder/box example (`casting resin`) | 150 |
| 7 | How many kits to buy | Kit planner example (`5 gallon epoxy resin`) | 130 |
| 8 | What is epoxy resin? | Short and factual (`what is epoxy`, `epoxy vs resin`) | 150 |
| 9 | Using the result: mixing and pouring basics | General, plus "follow your label" (`how to use epoxy resin`) | 150 |
| 10 | FAQ | §6 | 400 |

## 6. FAQ (12, from the competitor question bank + cluster keywords)

1. How much epoxy resin do I need?
2. What is the epoxy volume formula?
3. How much epoxy do I need for a river table? (link #5)
4. How thick should epoxy be, and do I need a seal coat?
5. How much epoxy for a 24 × 24 in table? (engine)
6. How many pours do I need for a deep project?
7. Can I measure epoxy by weight instead of volume?
8. How much extra epoxy should I add for waste?
9. I know the area: how much resin do I need?
10. How do I calculate a 2:1 or 3:1 mix?
11. How do I measure an irregular mold? (water method)
12. How long does epoxy take to dry, and is it food safe? (data sheet / certification, no claims)

## 7. Done when

- [ ] `epoxy-engine.ts` + tests (incl. the worked example); `npm run verify` passes (PowerShell).
- [ ] InputGuide above the inputs; ToolShell + TabSlider + fonts + `<main>`.
- [ ] No cure times, pour depths or food-safe claims printed as facts.
- [ ] New category `3D Printing & CNC` created; registrations + docs; `graphify update .`.
