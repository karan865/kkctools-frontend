# Cooking Measurement Converter (Cups, Tbsp, Tsp, Oz, mL): Competitor Analysis

> **Target page:** KKCTools `/cooking-measurement-converter/` (Batch 8, Tool #8 ✅)
> **Primary keyword:** `convert cups to ml`. US 1,600 · KD 3. The cluster has 83 keywords and 910,600 US vol: 63 phrases like "how many tbsp in 1/2 cup / 8 oz to cups" (690,700) and 18 phrases about halving or adding cup fractions (216,700).
> **SERP source:** ⚠ No Semrush SERP export for Batch 8. Competitors come from live web searches on 2026-11-14 for `cooking measurement converter cups tablespoons teaspoons ml` and a cups-to-mL query. `TODO(owner): pull Google top 10 for "how many tbsp in 1/2 cup" and "convert cups to ml".`
> **Pages visited (2026-11-14):** 3 read: Omni cooking measurement, Calculate.co.nz, TheCalculatorSite cups↔mL. Allrecipes was not fetchable. A NIST kitchen-conversion URL returned 404.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Calc sites: Omni, Calculate.co.nz, TheCalculatorSite, GIGA, mytecbits, easyunitconverter, CalcPlanet
  - Food media: Allrecipes, Man of Many, foodnutters
  - Appliance brands: Zanussi
  - Recipe apps: RecipeSage
  - Accessibility sites: disabled-world
  - Many clone sites
- **Keyword-file rules:**
  - **Volume only.** Weight (grams ↔ cups) depends on the ingredient and is the next tool (#17).
  - Required: US, metric and imperial cups, with US vs UK labelled. Fraction input and **fraction output to the nearest ⅛**. A **recipe scaler**. A **printable kitchen chart**.
- **Unit facts that must be cited (and that competitors get wrong):**

  | Unit | Value | Notes |
  |---|---|---|
  | US customary cup | 236.5882 mL | = 8 US fl oz, 16 tbsp, 48 tsp |
  | **US "legal" cup** | **240 mL** | US nutrition labelling. `TODO(owner)`: cite 21 CFR 101.9 |
  | Metric cup | 250 mL | AU/NZ/CA |
  | Imperial cup | 284.131 mL | |
  | Japanese cup | 200 mL | |
  | US tbsp | 14.787 mL | |
  | UK/metric tbsp | 15 mL | |
  | **Australian tbsp** | **20 mL (4 tsp)** | |
  | US tsp | 4.929 mL | |
  | Metric tsp | 5 mL | |
  | US fl oz | 29.5735 mL | |
  | UK fl oz | 28.4131 mL | |

  - A search snippet wrongly said the "metric tablespoon holds four teaspoons". That is only true for the Australian tablespoon.
  - Calculate.co.nz contradicts itself on the Australian tablespoon.
- **Arithmetic check:** TheCalculatorSite's 150 mL → 0.64 cups should be ≈ 0.63. Several of its fraction approximations are loose.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | omnicalculator.com/food/cooking-measurement | Giant | Cooking Measurement Converter | long |
| 2 | calculate.co.nz/cooking-measurement-converter.php | NZ calc site | Cooking Measurement Converter | 650–700 |
| 3 | thecalculatorsite.com/cooking/cups-ml.php | Calc site | Cups and mL Converter | 400–450 |
| — | allrecipes.com/article/cup-to-gram-conversions/ | Food media | — | **not fetchable** |

**What this tells us:**
- **Omni** handles weight ↔ weight, volume ↔ volume **and weight ↔ volume**, using 17 ingredient categories plus a custom density. It notes that US and metric spoons differ. It's broad, but it isn't a quick kitchen chart.
- **Calculate.co.nz** covers US cup, tbsp, tsp, mL, L and fl oz. Its worked example is ✔. It notes the 240 mL legal cup and UK fl oz in the FAQ. Gaps:
  - Contradicts itself on the Australian tablespoon.
  - No fractions, no scaler, no chart.
  - Doesn't say which cup NZ recipes use.
- **TheCalculatorSite** offers US, imperial and metric cups and two charts. Its fraction column is loose, it has no examples or FAQ, and it **leaves out the Japanese cup and the 240 mL legal cup**.
- **No page has all of these:**
  - every cup and spoon standard, labelled by country
  - **fraction input (1 1/2 cup) and output to the nearest ⅛ cup or tsp**, with the rounding shown
  - a **recipe scaler** for halving and doubling (the "half of 3/4 cup" queries)
  - **adding mixed amounts** (3/4 cup + 3/4 cup)
  - a **printable kitchen chart**
  - results shown in **practical measures** (e.g. 1/3 cup + 1 tbsp)

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Omni | Calc.co.nz | TheCalculatorSite |
|---|---|---|---|
| US cup / tbsp / tsp / fl oz / mL / L | ✅ | ✅ | ⚠️ (cups ↔ mL only) |
| Metric cup (250) | ✅ | ⚠️ (intro only) | ✅ |
| Imperial cup (284) | ? | ⚠️ (intro) | ✅ |
| US legal cup (240) | ? | ⚠️ (FAQ) | ❌ |
| Japanese cup (200) | ? | ❌ | ❌ |
| Australian tbsp (20 mL) | ? | ⚠️ (**contradicts itself**) | ❌ |
| UK vs US fl oz | ? | ✅ (FAQ) | ❌ |
| Fraction input (1 1/2) | ? | ❌ | ❌ |
| Fraction output (nearest ⅛) | ❌ | ❌ | ⚠️ (chart, loose) |
| **Practical measures (e.g. 1/3 cup + 1 tbsp)** | ❌ | ❌ | ❌ |
| **Recipe scaler (×½, ×2, custom)** | ❌ | ❌ | ❌ |
| **Add amounts (3/4 + 3/4 cup)** | ❌ | ❌ | ❌ |
| Weight ↔ volume (ingredient) | ✅ (17 categories) | ❌ | ❌ |
| Printable chart | ❌ | ❌ | ⚠️ (2 charts, not print-styled) |
| Sticks of butter | ✅ | ❌ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Omni | Calc.co.nz | TheCalculatorSite |
|---|---|---|---|
| Unit standards explained by country | ⚠️ | ⚠️ (contradiction) | ⚠️ |
| Worked example (checked) | ✅ (125 g butter) | ✅ (236.59 mL = 16 tbsp) | ❌ |
| Errors | — | Australian tbsp contradiction; 284 vs 284.131 | 150 mL → 0.64 (should be ≈ 0.63); loose fractions |
| Dry vs liquid measuring cups note | ? | ❌ | ❌ |
| FAQ count | some | yes | 0 |
| Named author | ✅ | ⚠️ (reviewer) | ✅ (+ reviewer) |
| Date | ❌ | ✅ (Nov 2026) | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. Omni: Cooking Measurement Converter
- **Units:** weight (g, dag, kg, oz, lb) and volume (mL, cups, fl oz, tsp, tbsp). Says US and metric spoons differ and that 3 tsp = 1 tbsp within one system.
- **Weight ↔ volume:** 17 ingredient categories plus custom density. Example: 125 g butter ≈ 1.1 sticks ≈ 0.55 cup.
- **Weak points:**
  - Not a quick kitchen chart.
  - No fractions or scaler.
  - Results are estimates.

### 2. Calculate.co.nz: Cooking Measurement Converter (reviewed Nov 2026)
- **Units:** US cup, tbsp, tsp, mL, L, fl oz. Example: 1 cup = 236.59 mL = 16 tbsp = 48 tsp = 8 fl oz ✔.
- **FAQ:** 240 mL legal cup; UK fl oz 28.4131 mL.
- **Errors:**
  - Says 3 tsp = 1 tbsp "in the US, Australia and most countries", then says the Australian tbsp is 20 mL (4 tsp).
  - Gives the imperial cup as 284 in one place and 284.131 in another.
- **Weak points:** no fractions, scaler or chart; doesn't say which cup NZ recipes use.

### 3. TheCalculatorSite: Cups and mL Converter (Alastair Hazell; reviewer Casey Bumpsteed)
- **Converter:** US, imperial and metric cups ↔ mL. Formula: mL = cups × 236.6.
- **Charts:** cups → mL ✔; mL → cups with errors.
- **Errors:**
  - 150 mL → 0.64 cups (should be ≈ 0.63).
  - Loose fractions: 250 mL shown as "1 1/20" cups; 300 mL as "1 1/4"; 600 mL as "2 1/2".
- **Weak points:** no Japanese or legal cup; no examples or FAQ; formula given only for US cups.

---

## 5. Patterns

**Engine**
- Convert everything to mL internally, using exact definitions per standard. The user picks a standard: **US**, **Metric (AU/NZ/CA)**, **UK/Imperial**, **Japan**, **US legal (nutrition labels)**.
- **Australian tbsp = 20 mL** is a toggle within the Metric standard.

**Input**
- Accepts decimals, fractions, mixed numbers and Unicode fractions (½ ¾ ⅓).

**Output**
- An exact decimal.
- A **nearest practical fraction**: ⅛, ¼, ⅓, ½, ⅔, ¾ of a cup, and ¼, ½ of a tsp/tbsp.
- A **practical combination** (e.g. 0.4 cup ≈ ⅓ cup + 1 tbsp + 1 tsp), found greedily with real measuring sets. Show the error.

**Recipe scaler**
- Multiply by ½, ⅓, 2, 3 or a custom factor.
- Show results in practical measures. This answers "half of 3/4 cup = 6 tbsp" (US).

**Adder**
- Add several amounts in mixed units, e.g. 3/4 cup + 3/4 cup = 1 ½ cups, or 1/4 + 1/4 + 1/4 cup = 3/4 cup.

**Chart**
- Cups (⅛–4) ↔ tbsp ↔ tsp ↔ fl oz ↔ mL for the chosen standard.
- Printable, with a separate print layout.
- Includes sticks of butter (US: 1 stick = ½ cup = 8 tbsp) as a volume note only.

**Coverage across the 3 competitors**

| Section | Pages (of 3) |
|---|:---:|
| US units | 3 |
| Multi-standard | 2 (partial) |
| Fraction output | 1 (loose) |
| Scaler | **0** |
| Adder | **0** |
| Practical combinations | **0** |
| Printable chart | **0** |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword. Map to the 83-keyword cluster.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How many tablespoons are in 1/2 cup (1/4, 1/3, 3/4)? | long tail (33,100 for 1/2) |
| 2 | ★ How many mL are in a cup? | all · `convert cups to ml`, `1 2 cup to ml` |
| 3 | ★ How many cups is 8 oz? | long tail · `8 oz to cups` (fluid oz) |
| 4 | ★ What is half of 3/4 cup? | scaler long tail (216,700) |
| 5 | ★ US cup vs metric cup vs UK cup: what's the difference? | Calc.co.nz, TheCalculatorSite |
| 6 | How many teaspoons are in a tablespoon (3, or 4 in Australia)? | Calc.co.nz |
| 7 | What is 3/4 cup + 3/4 cup? | `3/4 cup + 3/4` |
| 8 | How many tablespoons make 1/3 cup? | long tail |
| 9 | Fluid ounces vs weight ounces? | — (link to Grams to Cups, #17) |
| 10 | Why do nutrition labels use 240 mL? | Calc.co.nz (legal cup) |

---

## 7. Gaps nobody fills — our opportunities

1. **Every cup and spoon standard, labelled by country** (US, legal US, metric, Australian tbsp, UK, Japan), with each value cited.
2. **Fraction input and practical fraction output**, e.g. "≈ ⅓ cup + 1 tbsp", with the error shown.
3. **Recipe scaler and adder**: halve, double, a custom factor, and adding amounts. This covers the 216k scaling and addition queries.
4. **A printable kitchen chart** for the selected standard.
5. **Answers to the big long-tail questions in the first lines** (tbsp in ½ cup, mL in a cup).
6. **A clear note that this page converts volume only**, linking to Grams to Cups (#17) for weights.
7. **A short dry vs liquid measuring tip**, written by us.
8. **Links:** Grams to Cups (#17), Water Weight (#18), Metric Conversion (Batch 5 #20).

---

## 8. Blueprint for the KKCTools Cooking Measurement Converter

### 8.1 SEO

- **URL:** `/cooking-measurement-converter/`
- **Title:** Cups to Tablespoons Converter – Cooking Units
- **H1:** Cooking Measurement Converter: Cups, Tablespoons, Teaspoons, Ounces and mL
- **Meta:** as in the keyword file (153 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Standards | US · US legal · Metric (AU tbsp toggle) · UK/Imperial · Japan |
| Units | Cup, tbsp, tsp, fl oz, mL, L (+ pint, quart, gallon) |
| Input | Decimal, fraction, mixed, Unicode fractions |
| Output | Exact + nearest practical fraction + measuring-set combination |
| Scaler | ×½, ×⅓, ×2, ×3, custom → practical measures |
| Adder | Multiple amounts, mixed units → total |
| Chart | Printable chart for selected standard |
| UX | Copy, share URL, no network |

### 8.3 Content outline (≈ 1,000–1,300 words, original)

1. Quick answers (½ cup = 8 tbsp US; 1 cup = 236.6 mL) and intro
2. How to use
3. Cup sizes around the world (table, cited)
4. Tablespoons and teaspoons (US, metric, Australian)
5. Fluid ounces (US vs UK) vs weight ounces
6. Halving, doubling and adding recipe amounts, with examples
7. Kitchen conversion chart (printable)
8. Measuring tips (dry vs liquid)
9. FAQ (10)
10. Related tools: Grams to Cups (#17), Water Weight (#18), Metric Conversion (Batch 5 #20)

### 8.4 Quality checks

- **Unit tests:**
  - every unit pair per standard
  - fraction parser (including Unicode fractions)
  - nearest-fraction and measuring-set combination
  - scaler, e.g. ½ × ¾ cup = 6 tbsp US
  - adder
- No competitor wording copied. `npm run check:no-network` passes.
- **`TODO(owner)`:** pull the Google top 10; **cite each unit standard** (21 CFR 101.9 for the legal cup; national measurement bodies for metric, Australian and Japanese units).
