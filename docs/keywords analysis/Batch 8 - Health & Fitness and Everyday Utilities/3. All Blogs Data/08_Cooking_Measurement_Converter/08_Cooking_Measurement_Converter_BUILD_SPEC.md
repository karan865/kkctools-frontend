# Cooking Measurement Converter (Cups, Tbsp, Tsp, Oz, mL) — Build Spec

> **URL:** `/cooking-measurement-converter/` · Batch 8 · Tier 1 · **Build order 8**
> **Read first:** `../00_BATCH8_BUILD_RULES.md` (Part 2 §10 exact units, §11 kitchen sources, §12 `kitchen-units`, `fraction-engine`)
> **Inputs:** `08_Cooking_Measurement_Converter_Competitor_Analysis.md`, keyword file §2 #8
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**83 keywords, ≈ 910,600 searches, zero YMYL:** the water-intake seed drifted into kitchen maths.
- primary `convert cups to ml` **1,600 / KD 3**; `1 2 cup to ml` 1,600 / KD 11;
- **63 "how many tbsp in 1/2 cup / 8 oz to cups" phrases ≈ 690,700:** `how many tbsp in 1/2 cup` **33,100**, `how many spoons is 1/2 cup` 33,100, `8 oz to cups` 27,100, `1 tablespoon to 1/3 cup` 22,200, `4 tablespoons to cups` 22,200, `8 tablespoons to cups` 22,200, `1/4 cup to tablespoons` 18,100, `12 oz is what in cups` 18,100, `3 tablespoons to cups` 18,100, `how many ounces is 3/4 a cup` 18,100, `how many spoons in 1/8 cup` 18,100, `3 0z is how many cups` 14,800, `4 tablespoons 1/4 cup` 14,800…;
- **18 halving/adding phrases ≈ 216,700:** `3/4 cup + 3/4` 22,200, `what is half of 3/4 cup` 22,200, `what is 3/4 cup in half` 22,200, `what is half of 3/4th cup` 18,100, `3/4 cup` 18,100…

**Volume only.** Weight (grams ↔ cups) depends on the ingredient: that's tool #17. Rows like `200 grams to cups` and `ml to g` link there.

**Our edge vs the SERP (calc sites, food media, clones):** every cup/spoon standard labelled by country, practical answers in real measuring cups and spoons, a recipe scaler and adder (nobody has either), and a printable chart.

### Research notes from the competitor analysis

- **Pages read:** Omni cooking measurement, Calculate.co.nz, TheCalculatorSite cups ↔ mL. Allrecipes not fetchable; a NIST kitchen URL 404.
- **Omni:** broad (weight ↔ volume with 17 ingredient categories, butter sticks) but not a quick kitchen chart; no fractions or scaler.
- **Calculate.co.nz:** 1 cup = 236.59 mL = 16 tbsp = 48 tsp = 8 fl oz ✔ and the 240 mL legal cup, **but** says 3 tsp = 1 tbsp "in the US, Australia and most countries" and then that the Australian tbsp is 20 mL (4 tsp); imperial cup given as 284 and 284.131.
- **TheCalculatorSite:** US/imperial/metric cups ↔ mL, two charts; **150 mL → 0.64 cups** (our node: 0.634); loose fractions (250 mL as "1 1/20" cups, 300 mL as "1 1/4", 600 mL as "2 1/2"); no Japanese or legal cup.
- A search snippet claimed the "metric tablespoon holds four teaspoons": true only for the Australian tablespoon.
- **0 of 3** have a scaler, an adder, practical measuring-set answers or a print-ready chart.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | convert cups to ml | 1,600 | 3 | first sentence, H2 "How many mL are in a cup?", default conversion (1 cup → mL) |
| Secondary | 1 2 cup to ml | 1,600 | 11 | quick-answer line ("½ cup = 118.3 mL US, 125 mL metric") |
| Head (not in exports) | cooking measurement converter · cups to tablespoons | — | — | title ("Cups to Tablespoons Converter"), H1, ToolShell heading |
| Long tail (converter + chart) | how many tbsp in 1/2 cup · how many spoons is 1/2 cup · 8 oz to cups · 1 tablespoon to 1/3 cup · 4 / 8 / 3 tablespoons to cups · 1/4 cup to tablespoons · 12 oz is what in cups · how many ounces is 3/4 a cup · how many spoons in 1/8 cup · 3 0z is how many cups … (63) | ≈ 690,700 | 6–29 | **quick-answer block under the H1**, the chart, H2 "How many tablespoons in ½ cup?" and "How many cups is 8 oz?", hash anchors |
| Long tail (scaler + adder) | what is half of 3/4 cup · what is 3/4 cup in half · 3/4 cup + 3/4 · what is half of 3/4th cup · 3/4 cup … (18) | ≈ 216,700 | 11–29 | Scale and Add tabs, H2 "Halving, doubling and adding recipe amounts" |
| Link out | ml to g · 200 grams to cups | 22,200 · 14,800 | — | one line + link to Grams to Cups (#17) |

## 2. Our edge

- **Every standard, labelled:** US customary (cup 236.5882365 mL), US nutrition label (cup 240 mL, tbsp 15 mL), Metric (cup 250 mL, tbsp 15 mL, tsp 5 mL) with an **Australian tbsp = 20 mL** toggle, UK imperial (fl oz 28.4130625 mL; ½ pint 284.13 mL), Japan (cup 200 mL). The source and status of each value are shown (rules §11).
- **Units:** cup, tbsp, tsp, fl oz, mL, L, pint, quart, gallon (US and imperial labelled).
- **Fraction input** (`1 1/2`, `¾`, `1/3`) and **practical output**: nearest ⅛/¼/⅓/½/⅔/¾ cup, and a **measuring-set combination** (0.4 cup ≈ ⅓ cup + 1 tbsp + ¼ tsp) with the error.
- **Recipe scaler:** ×½, ×⅓, ×2, ×3, custom; results in practical measures (half of ¾ cup = **6 tbsp**).
- **Adder:** add mixed amounts (¾ cup + ¾ cup = 1½ cups; 2 tbsp + 1 tsp + ¼ cup = …).
- **Printable kitchen chart** for the chosen standard; butter sticks as a US volume note.
- **Fluid vs weight ounces** made clear (8 fl oz = 1 cup; 8 oz by weight depends on the ingredient → #17).

## 3. Calculator spec

### 3.1 Tabs

1. **Convert** (default)
2. **Scale a recipe**
3. **Add amounts**
4. **Kitchen chart**

### 3.2 Input guide diagram (above the inputs)

`KitchenInputGuide.tsx`: a measuring cup with fill lines beside a row of spoons.

- Cup with lines at ¼, ⅓, ½, ⅔, ¾, 1; the fill level follows the input (e.g. ½ cup).
- **Callouts:** "1 Amount (½)", "2 From unit (cup)", "3 To unit (tbsp)", "4 Standard: US / Metric / UK / Japan".
- Spoons row: "8 × tablespoon" drawn as eight spoon icons for ½ cup US.
- **Scale tab:** two cups "¾ → ×½ → ⅜ (6 tbsp)".
- **Add tab:** two cups pouring into one.
- Live values; the focused field highlights.

### 3.3 Inputs

| Field | Default |
|---|---|
| Amount | 1/2 (decimal, fraction, mixed, Unicode fractions) |
| From → to | cup → tbsp |
| Standard | US customary (US · US nutrition label · Metric · Metric with 20 mL tbsp (Australia) · UK imperial · Japan) |
| Practical output | on (max 3 measures) |
| Scale factor | ×½ (½, ⅓, 2, 3, custom) |
| Add rows | 2 rows (amount + unit each) |
| Chart range | ⅛ cup → 4 cups |

### 3.4 Engine (`src/lib/kitchen-units.ts` + `fraction-engine.ts`)

```ts
units in mL per standard:
  US: floz = 231·16.387064/128 = 29.5735295625 ; cup = 8 floz ; tbsp = floz/2 ; tsp = tbsp/3 ; pint 16 floz ; quart 32 ; gallon 128
  USlabel: cup 240, tbsp 15, tsp 5 (nutrition labels; FDA rule)
  metric: cup 250, tbsp 15 (or 20 AU), tsp 5
  imperial: floz = 4546.09/160 = 28.4130625 ; pint 20 floz ; cup = ½ pint (284.130625) ; tbsp 15, tsp 5 (state the convention)
  japan: cup 200 (tbsp 15, tsp 5)
convert(x, from, to, std) = x · mL(from) / mL(to)  (exact rationals where possible)
nearestPractical(cups) → nearest of {⅛ ¼ ⅓ ½ ⅔ ¾} with error
practicalCombo(mL, std, maxParts=3): greedy over the measuring set (1, ¾, ⅔, ½, ⅓, ¼ cup; 1 tbsp; 1, ½, ¼ tsp), remainder shown as error
scale(amount, factor) → convert to the best unit (cups ≥ ¼ cup, else tbsp, else tsp)
addAmounts(rows) → total in mL → best unit + practical
```

**Worked examples (checked with node, 2026-11-22; US customary unless noted):**

| Input | Result |
|---|---|
| **1 cup → mL** | **236.59 mL** (exact 236.5882365); metric 250; label 240; Japan 200; UK ½ pint 284.13 |
| **½ cup → tbsp** | **8 tbsp** (`how many tbsp in 1/2 cup`); → mL 118.3 |
| ¼ cup → tbsp | 4 tbsp |
| ⅓ cup → tbsp | 5⅓ tbsp = **5 tbsp + 1 tsp** |
| ¾ cup → tbsp / fl oz | 12 tbsp / 6 fl oz |
| ⅛ cup → tbsp / tsp | 2 tbsp / 6 tsp |
| 4 tbsp / 8 tbsp / 3 tbsp → cups | ¼ / ½ / 3/16 cup |
| 8 fl oz / 12 fl oz / 3 fl oz → cups | 1 / 1½ / ⅜ cup |
| 1 tbsp / 1 tsp → mL | 14.787 / 4.929 mL (metric 15 / 5) |
| **Half of ¾ cup** | **⅜ cup = 6 tbsp** |
| ¾ cup + ¾ cup | 1½ cups |
| ¼ + ¼ + ¼ cup | ¾ cup |
| 150 mL → US cups | 0.634 cup ≈ ⅝ cup (TheCalculatorSite's 0.64 is off) |
| 0.4 cup, practical | ⅓ cup + 1 tbsp + ¼ tsp |
| Australian tbsp (20 mL) → US tsp | 4.06 tsp |
| Metric cup → US tbsp | 16.91 tbsp |

### 3.5 Outputs

- **Headline:** "½ cup = 8 tablespoons" (big) + mL.
- **Sentence:** "½ US cup is 8 tablespoons (118.3 mL). With metric cups it's 125 mL, a little more."
- Practical combination + error; the standard used and its source line.
- Scale: the scaled amount in practical measures; Add: the total.
- **Chart:** cups (⅛…4) × tbsp × tsp × fl oz × mL for the chosen standard; Print button; hash anchors (`#half-cup`).
- Copy, Share URL (`?a=1/2&from=cup&to=tbsp&std=us`).
- Links: Grams to Cups (#17, later), Water Weight (#18, later), Metric Conversion (Batch 5 #20), Fraction to Decimal (#7).

### 3.6 Tests

- Every unit pair per standard; exact US derivation (cup = 236.5882365).
- Parser: `1 1/2`, `1½`, `¾`, `.75`, `3/4 cup`; bad input.
- Practical fractions and combos (max parts, error); the 0.4-cup case.
- Scaler and adder (incl. mixed units); best-unit choice.
- AU tbsp toggle changes tbsp only.
- The worked examples. Chart snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Cups to Tablespoons Converter – Cooking Units` (45; 57 with the suffix: OK) |
| Meta | `Free cooking measurement converter. Convert cups, tablespoons, teaspoons, fluid ounces and mL, halve or double recipe amounts, and print a kitchen chart.` (153) |
| H1 | `Cooking Measurement Converter: Cups, Tablespoons, Teaspoons, Ounces and mL` |
| BLUF | "In US measures, 1 cup is 16 tablespoons, 8 fluid ounces or about 236.6 mL, so ½ cup is 8 tablespoons and ¼ cup is 4. Convert any amount between cups, spoons, ounces and mL in US, metric, UK or Japanese units, halve or double a recipe (half of ¾ cup is 6 tablespoons), and print the kitchen chart." (engine) |
| ToolShell pills | `US, metric, UK & Japan cups`, `Halve, double & add amounts`, `Answers in real measuring cups`, `Printable kitchen chart` |
| Links out | Grams to Cups (#17, later), Water Weight (#18, later), Metric Conversion (Batch 5 #20), Fraction to Decimal (#7) |
| Links in | #7, Tools hub "Everyday Conversions" |

## 5. Content (~1,200–1,500 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the cooking measurement converter | 4 tabs, standards | 110 |
| 2 | How many mL are in a cup? | US 236.6 vs label 240 vs metric 250 vs UK vs Japan; which recipes use which (`convert cups to ml`, `1 2 cup to ml`) | 160 |
| 3 | How many tablespoons in ½ cup? | ½ = 8, ¼ = 4, ⅓ = 5 tbsp + 1 tsp, ⅛ = 2 (`how many tbsp in 1/2 cup`) | 110 |
| 4 | Tablespoons and teaspoons around the world | 3 tsp = 1 tbsp; Australia 4 tsp = 20 mL; fixing the common mix-up | 120 |
| 5 | How many cups is 8 oz? | Fluid vs weight ounces; 8 / 12 / 3 fl oz; link #17 for weight | 120 |
| 6 | Halving, doubling and adding recipe amounts | Half of ¾ cup = 6 tbsp; ¾ + ¾ = 1½; tips for awkward amounts | 150 |
| 7 | Kitchen conversion chart (printable) | The chart | — |
| 8 | Measuring tips | Dry vs liquid cups, levelling, spoons (our own tips) | 100 |
| 9 | FAQ | §6 | 330 |

## 6. FAQ (10, from the competitor question bank + cluster keywords)

1. How many tablespoons are in ½ cup (¼, ⅓, ¾)?
2. How many mL are in a cup?
3. How many cups is 8 oz?
4. What is half of ¾ cup?
5. US cup vs metric cup vs UK cup: what's the difference?
6. How many teaspoons are in a tablespoon? (3; 4 with an Australian 20 mL tablespoon)
7. What is ¾ cup + ¾ cup?
8. How many tablespoons make ⅓ cup?
9. Fluid ounces vs weight ounces?
10. Why do nutrition labels use 240 mL for a cup?

## 7. Done when

- [ ] `kitchen-units.ts` + tests (exact US chain; standards labelled with sources); `npm run verify` passes.
- [ ] Chart, scaler, adder; no per-amount URLs; hash anchors.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Registrations + docs; `graphify update .`.
