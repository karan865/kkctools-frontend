# Metric Conversion Calculator — Build Spec

> **URL:** `/metric-conversion-calculator/` · Batch 5 · Tier 3 · rank chance 🟡 · **Build order 20 (last)**
> **Read first:** `../00_BATCH5_BUILD_RULES.md` (§2.2: exact constants, NIST)
> **Inputs used:** `20_Metric_Conversion_Calculator_Competitor_Analysis.md` (6 pages incl. NIST, 2026-11-14), keyword file §2 #20
> **SERP:** provisional
> **Written:** 2026-11-22 (full rewrite after the research pass)

---

## 0. Strategy

- **Search demand:** about 7,600 searches at KD 7–12.
  - `metric conversion calculator`: 4,400 at KD 7.
  - `length conversion calculator`: 1,900, rising.
- **Expect a low click-through rate.** Google's converter box takes many of these clicks. This page's main job is to be the **internal hub** for every KKCTools unit page:
  - Gallons ↔ ft³ (#5), Tank (#16);
  - Concrete, Cubic Yard, Tons to Cubic Yards, Linear Foot, Square Footage (live);
  - Batch 8 cooking and time tools.
- **Who ranks:**
  - Omni (5 categories, incl. ft-in, yd³, short tons);
  - Inch (8 types, widget repeated about 8×);
  - CalculatorSoup and Science Made Simple (hubs of separate pages);
  - Calculate.co.nz, Quackit and clones;
  - **NIST** (the authority).
- **Nobody combines all of these:**
  - mixed ft + in input with fractional-inch output;
  - construction units (yd³, short/long/metric tons, board feet, sq ft);
  - a precision control;
  - printable charts per category;
  - common pitfalls explained.
- **Accuracy edge:**
  - Omni says the metre is based on Earth's dimensions. That's outdated: it has been defined via the speed of light since 1983.
  - Science Made Simple rounds kg→lb to 2.205 without saying so.
  - Calculate.co.nz claims "not rounded" but shows 3.281.

## 1. Keywords and placement

| Role | Keyword | US vol | KD | Trend | Where it goes |
|---|---|---:|---:|:---:|---|
| **Primary** | metric conversion calculator | 4,400 | 7 | | Title, H1, first sentence |
| Secondary | length conversion calculator | 1,900 | 12 | ↑ | Length tab heading + H2 "Length conversions: feet, inches, metres" |
| Secondary (irregular) | metric conversion calc | 1,300 | 11 | ⚠ | Natural mention |
| Natural | cm to inches · kg to lbs · celsius to fahrenheit · feet to meters · metric prefixes | — | — | | H2s, FAQ |

## 2. Our edge (6 pages checked)

| Feature | Competitors with it |
|---|---|
| All-in-one (length, weight, volume US/UK, area, temperature; optional speed and time), linked live fields | 3/6 |
| **Ft + in input**, **fractional-inch output (to 1/16)** | ft-in 1/6 · **fractions 0** |
| Construction units: yd³, sq ft, acres, short/long/metric ton, board-feet note | 2/6 partial |
| **Precision control** (decimals or significant figures) with exact factors | **0** |
| **Printable charts per category** (our code, user range) | **0** real |
| **Pitfall callouts:** US vs UK gallon/pint, fluid oz vs oz, squared/cubed factors, temperature points vs differences | 1 (NIST) |
| Exact factors cited to NIST (SP 811 App. B / HB 44 App. C) in a static, dated data file | 0 |
| Hub links to every unit tool | partial |

## 3. Calculator spec

### 3.1 Tabs

1. **Length** (default)
2. **Weight**
3. **Volume**
4. **Area**
5. **Temperature**
6. *(optional)* Speed

### 3.2 Input guide diagram (above the inputs)

`MetricInputGuide.tsx`: a ruler with inches on one edge and centimetres on the other.
- Labels: "1 Value", "2 From unit", "3 To unit".
- The live conversion is marked on the ruler.
- Per tab the picture changes:
  - Weight: a balance scale (lb vs kg).
  - Volume: a jug (US gal vs UK gal vs L).
  - Area: a square (ft² vs m²).
  - Temperature: a thermometer (°F, °C, K), with a note that "a 10° change ≠ 10° reading".

### 3.3 Inputs (defaults = examples)

| Field | Default |
|---|---|
| Length | 10 ft → m; ft + in input (`5' 10"`) |
| Weight | 100 kg → lb |
| Temperature | 68 °F → °C |
| Precision | 4 decimals (or significant figures); inch fractions to 1/16 (1/2–1/64 selectable) |
| Chart | range + step per unit pair |

### 3.4 Engine (`src/lib/volume-units-engine.ts` + `units-engine.ts`)

All factors are exact definitions, stored in a static data file citing NIST SP 811 / HB 44 with the edition and date. `TODO(owner)`: confirm the NIST citation.

```ts
length: 1 in = 2.54 cm ; 1 ft = 0.3048 m ; 1 yd = 0.9144 m ; 1 mi = 1,609.344 m
mass: 1 lb = 0.45359237 kg ; 1 oz = 28.349523125 g ; short ton 2,000 lb ; long ton 2,240 lb ; tonne 1,000 kg
volume: 1 US gal = 231 in³ = 3.785411784 L ; imp gal = 4.54609 L ; US fl oz = 29.5735295625 mL ; 1 yd³ = 27 ft³
area: square the length factor ; acre = 43,560 ft²
temperature: °F = °C×9/5 + 32 ; K = °C + 273.15 ; difference mode uses factor only
convert via base unit; round only at display; ft-in parse/format with fractions
chart(pair, from, to, step)
```

**Worked examples (checked 2026-11-22):**

| Conversion | Result |
|---|---|
| 10 ft | **3.048 m** (exact) |
| 5′ 10″ | **1.778 m** |
| 100 kg | **220.462 lb** |
| 68 °F | **20 °C** |
| A 10 °C temperature *difference* | **18 °F** (not 50 °F) |
| 1 m² | **10.7639 ft²** |

### 3.5 Outputs

- **Headline:** the converted value + every unit in the category (linked fields).
- **Sentence:** "10 feet is exactly 3.048 metres, because 1 inch is defined as 2.54 cm."
- Pitfall callout relevant to the tab.
- Printable chart, Copy CSV.
- **Hub list:** "More unit tools on KKC Tools".
- Share URL.

### 3.6 Tests

- Every factor against its exact definition.
- Round-trips; ft-in fractions.
- Temperature point vs difference.
- Area/volume squared/cubed.
- The examples above. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Metric Conversion Calculator – Length, Weight & More` (52; 64 with the suffix → `absoluteTitle`) |
| Meta | `Free metric conversion calculator. Convert length, weight, volume, area and temperature between metric and US units, with a printable chart for each.` (149) |
| H1 | `Metric Conversion Calculator: Length, Weight, Volume, Area and Temperature` |
| BLUF | "Pick a category, type a value and choose the units. 10 feet is exactly 3.048 metres because 1 inch is defined as 2.54 cm, 100 kg is 220.46 lb, and 68 °F is 20 °C using °C = (°F − 32) × 5/9." (engine) |
| ToolShell pills | `Length, weight, volume, area & temp`, `Feet-inches & fractions`, `Exact NIST factors`, `Printable charts` |
| Links out (hub) | Gallons ↔ ft³ (#5), Tank Volume (#16), Concrete, Cubic Yard, Tons to Cubic Yards, Linear Foot, Square Footage, Cubic Inch (live), cooking/time tools (Batch 8, when built) |
| Links in | Gallons, Tank, all unit pages ("more conversions"), Tools hub "Units" |

## 5. Content (~1,300–1,600 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the metric conversion calculator | Tabs, precision | 100 |
| 2 | Metric system basics and prefixes | kilo, centi, milli; current SI definitions (cited) | 150 |
| 3 | Length conversions: feet, inches, metres | ft-in examples (`length conversion calculator`) | 180 |
| 4 | Weight and mass: pounds, kilograms and tons | Short vs long vs metric ton | 150 |
| 5 | Volume: US vs imperial units | Gallon/pint differences; link #5 | 150 |
| 6 | Area conversions | Squared factors | 120 |
| 7 | Temperature: readings vs differences | Formulas + the 10° example | 150 |
| 8 | Exact factors and rounding | NIST | 100 |
| 9 | All unit calculators on KKC Tools | Hub list | 80 |
| 10 | FAQ | §6 | 350 |

## 6. FAQ (10, from the question bank)

1. How do I convert cm to inches (and back)?
2. How do I convert kg to pounds (and stone)?
3. How do I convert Celsius to Fahrenheit?
4. What are the metric prefixes (kilo, centi, milli)?
5. US gallon vs imperial gallon: what's the difference?
6. Why do area and volume conversions use squared or cubed factors?
7. Fluid ounces vs ounces: what's the difference?
8. How do I convert feet and inches to metres?
9. Short ton vs long ton vs tonne?
10. Which conversion factors are exact?

## 7. Done when

- [ ] Static factor file with the NIST source + date; `units-engine.ts` + tests; `npm run verify` passes.
- [ ] Hub links to all unit pages; InputGuide above the inputs; ToolShell + TabSlider + fonts + `<main>`.
- [ ] Registrations + docs; `graphify update .`.
