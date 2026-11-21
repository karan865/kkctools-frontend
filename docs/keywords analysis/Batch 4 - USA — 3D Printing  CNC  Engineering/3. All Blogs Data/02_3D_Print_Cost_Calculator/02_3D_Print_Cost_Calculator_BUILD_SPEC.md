# 3D Print Cost Calculator — Build Spec

> **URL:** `/3d-print-cost-calculator/` · Batch 4 · Tier 1 · **Build order 3**
> **Read first:** `../00_BATCH4_BUILD_RULES.md`
> **Inputs:** `02_3D_Print_Cost_Calculator_Competitor_Analysis.md`, keyword file §2 #2
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**Volume:**
- `3d print cost calculator`: 2,400, KD 11, **rising**.
- The "how much does it cost to 3d print" and "make money 3d printing" questions add ~15,000.

**Two users:**
- **Hobbyists:** "what did this print cost?"
- **Sellers and print farms:** "what should I charge?"

**Competitors:**
- Prusa covers both best.
- **Resin printing is nearly absent everywhere.**
- Errors are common:
  - 3DWithUs treats 10 min as 0.1 h;
  - Snapmaker's 24-hour electricity FAQ is wrong;
  - Calculate.co.nz labels a W input as kW.

### Research notes from the competitor analysis (added 2026-11-22)

- Pages read: Prusa (reads G-code in the browser), Calculate.co.nz, 3DWithUs, PrintPal, Snapmaker, Omni; also FlashForge, Firgelli, 3DSourced, Sloyd in the SERP.
- **G-code read (optional, recommended):** parse slicer comments locally (no upload) for time and filament length/weight. Formats: PrusaSlicer, Cura, OrcaSlicer, Bambu Studio. `TODO(owner)`: confirm the feature; if yes, test with sample headers from each slicer.
- Competitor errors (arithmetic re-checked): 3DWithUs treats 10 min as 0.1 h; Snapmaker's 24-hour electricity FAQ is wrong ($0.41, not $0.61); Calculate.co.nz labels a W input as kW.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | 3d print cost calculator | 2,400 | 11 | title, H1, first sentence |
| Secondary | 3d printing cost calculator · 3d print pricing calculator · calculate cost of 3d printing · 3d print cost estimator | 1,300 · 320 · 1,900 · 1,000 | 14–29 | tool heading, H2 "How to calculate the cost of a 3D print" |
| Secondary | how much does 3d printing cost · how much does it cost to 3d print · cost of printing 3d · price to 3d print | 1,600 · 880 · 1,900 · 1,000 | 19–22 | H2 + FAQ (engine example; no market price claims) |
| Secondary | how long does it take to 3d print (something) · how long does 3d printing take · how long do 3d printers take | 590 · 390 · 480 · 390 | 7–13 | Print-time section + FAQ ("use your slicer time; rough estimate only") |
| Secondary | sell 3d prints · how to make money with a 3d printer (variants) · make money 3d printing · 3d printing business · 3d printer business ideas | 590 · 880 · 320 · 1,300 · 320 | 11–23 | Pricing tab + H2 "Pricing prints to sell" |
| Secondary | 3d printer farm | 720 | 12 | Batch/farm tab |
| Skip | printer-buying searches ("how much is a 3d printer") | — | — | dropped in the keyword file |

## 2. Our edge

- **FDM + resin in one tool.** Resin mode covers mL, bottle price, IPA/cleaning cost, and FEP/screen wear per hour.
- **Filament length → grams:** diameter (1.75 / 2.85 mm) × user density.
  - **Density presets only if sourced.** Otherwise a custom field labelled "from your filament's spec sheet".
- **Full seller model:**
  - electricity;
  - machine wear + maintenance;
  - consumables;
  - failure % with correct ÷(1 − r) maths;
  - labor;
  - packaging, markup, tax → price;
  - **cost per part for N parts** (farm).
- **Multi-material** (several filaments + purge grams).
- **Rough print-time estimate** from volume ÷ volumetric flow, **clearly labelled rough**. Slicer time preferred.
- **Optional G-code / .3mf read locally** (no upload) for time and grams. Only if feasible; otherwise skip and note it.
- Currency + $/kWh input. Correct worked examples. Link Markup (live).

## 3. Calculator spec

### 3.1 Tabs

1. **FDM print** (default)
2. **Resin print**
3. **Price to charge**
4. **Batch / print farm**

### 3.2 Input guide diagram (above the inputs)

`PrintCostInputGuide.tsx`: a printer drawing.

- **Spool on top:** "1 Filament used (g)" and "2 Spool price & weight". Resin tab: a bottle with "1 Resin used (mL)" and "2 Bottle price & size".
- **Plug cable:** "3 Printer watts" × "4 Print time" × "5 Electricity $/kWh".
- **Wrench:** "6 Machine wear $/hour".
- **Hand icon:** "7 Labor".
- **Warning triangle:** "8 Failure %".
- **Price tag at the end:** "9 Markup %".

Live values; the focused field highlights.

### 3.3 Inputs (defaults = examples)

| Field | Default |
|---|---|
| Filament used | 50 g (or length + diameter + density) |
| Spool | $20 / 1,000 g |
| Print time | 3 h 0 min (h + min fields, no decimal trap) |
| Printer power | 120 W (label: "check your printer's spec or a power meter") |
| Electricity | $0.15/kWh (example) |
| Printer price / lifetime hours | $300 / 2,000 h (→ $0.15/h) |
| Failure | 5% |
| Labor | 0.25 h × $20/h |
| Markup | 50% |
| Tax | 0% |
| Batch | N parts per plate, prints per day, number of printers |

### 3.4 Engine (`src/lib/print-cost-engine.ts`)

Markup via `pricing-engine`.

```ts
grams = length_m * π*(d/2)²(mm²) * density(g/cm³) / 1000 * 1000 … (unit-safe helper; test it)
material = grams/spoolGrams*spoolPrice (resin: mL/bottleMl*bottlePrice + cleaning)
electricity = watts/1000 * hours * pricePerKwh
wear = printerPrice/lifeHours * hours (+ maintenance/h)
base = material + electricity + wear + consumables ; withFailure = base / (1 - failurePct)   // null if failure >= 1
cost = withFailure + laborHours*laborRate + packaging ; price = priceFromMarkup(cost, markup) * (1 + tax)
perPart = cost / N ; farm: parts/day = printers × prints/day × N
roughTime = volume_mm3 / flow_mm3_s / 3600   // labelled rough
```

**Worked example (checked 2026-11-22):**

| Item | Amount |
|---|---:|
| Material (50 g of $20/kg) | $1.00 |
| Electricity (3 h × 120 W × $0.15) | $0.054 |
| Wear | $0.45 |
| With 5% failure (÷0.95) | $1.58 |
| Labor | $5.00 |
| **Total cost** | **$6.58** |
| **Price with 50% markup** | **$9.87** |

### 3.5 Outputs

- **Headline:** cost per print, plus the price to charge on the Price tab.
- **Sentence:** "This 50 g PLA print costs about $1.58 in material, power and machine time, or $6.58 with 15 minutes of labor. At a 50% markup, charge about $9.87."
- Breakdown bar (material / power / wear / failure / labor).
- Cost per part; farm daily output.
- Printable quote. Share URL. Currency.

### 3.6 Tests

- Grams from length (1.75 mm, a test density).
- Hours + minutes (10 min = 0.1667 h, **not** 0.1).
- Electricity (watts → kWh).
- Failure ÷(1 − r).
- Resin mode; markup via `pricing-engine`.
- The worked example. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `3D Print Cost Calculator – Filament, Power & Time` (49; 61 with the suffix → `absoluteTitle`) |
| Meta | `Free 3D print cost calculator. Enter filament used, spool price, print time and power to get the cost of a print, then add labor and markup for a price.` (152) |
| H1 | `3D Print Cost Calculator: Filament, Electricity, Time and Price to Charge` |
| BLUF | "3D print cost = filament (grams × price per gram) + electricity (watts × hours × rate) + machine wear, plus labor if you sell. A 50 g PLA print taking 3 hours costs about $1.58 before labor in this example." (engine) |
| ToolShell pills | `FDM & resin`, `Price to charge`, `Batch / print farm`, `Any currency` |
| Links out | Markup (live), Profit Margin (live), Epoxy Resin (#1), Steps per mm (#6) |
| Links in | Epoxy Resin, Steps per mm, Markup (add a "pricing 3D prints" link), Tools hub |

## 5. Content (~1,800–2,100 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the 3D print cost calculator | 4 tabs | 120 |
| 2 | How to calculate the cost of a 3D print | Formula + engine example | 250 |
| 3 | Filament cost: grams, length and density | Converter; density from the spec sheet | 180 |
| 4 | Electricity cost of a 3D printer | Watts × hours; measure with a power meter | 150 |
| 5 | Machine wear, maintenance and failed prints | ÷(1 − r) explained | 180 |
| 6 | Resin (SLA/MSLA) print cost | Engine example | 180 |
| 7 | How long does 3D printing take? | Slicer time first; rough estimate method | 150 |
| 8 | Pricing prints to sell | Labor + markup; link Markup (`sell 3d prints`) | 180 |
| 9 | Running a 3D printer farm | Batch math (`3d printer farm`) | 130 |
| 10 | FAQ | §6 | 400 |

**No market price claims** (e.g. "most sellers charge $X/hour").

## 6. FAQ (12, from the competitor question bank + cluster keywords)

1. How do I calculate the cost of a 3D print?
2. How much electricity does a 3D printer use, and what does 24 hours cost? (engine, with your watts and rate)
3. What should I charge for 3D prints?
4. How much does 1 gram of filament cost?
5. What is the cost of filament per metre or foot?
6. How long will a 3D printer last (machine wear)?
7. How do failed prints change the cost?
8. How do I calculate the cost of a resin print?
9. How long does it take to 3D print something?
10. How do I convert filament length to weight?
11. Is it cheaper to 3D print a part or buy it?
12. How do I price a batch or print-farm order?

## 7. Done when

- [ ] `print-cost-engine.ts` + tests; `pricing-engine` reused; `npm run verify` passes.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] No unsourced filament densities or printer wattages; rough time labelled.
- [ ] Registrations + docs; `graphify update .`.
