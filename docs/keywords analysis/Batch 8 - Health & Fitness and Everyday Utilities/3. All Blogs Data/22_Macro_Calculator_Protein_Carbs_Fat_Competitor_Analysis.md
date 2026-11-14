# Macro Calculator (Protein, Carbs, Fat) — Competitor Analysis

> **Target page:** KKCTools `/macro-calculator/` (Batch 8, Tool #22 🟡, **YMYL health tool**)
> **Primary keyword:** `macronutrient calculator` — US 1,900 · KD 0 · CPC $0.38.
> - Cluster: 14 keywords, 138,180 US searches.
> - Easy variants: `calculate macros for weight loss` (2,900 / KD 5), `keto macro calculator` (2,400 / KD 8).
> - Long tail: `how to track macros`, `1 g of fat is how many calories`, `fat requirement calculator`, `macro calculator free`.
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 8. Competitors come from a live web search on 2026-11-14 for `macro calculator protein carbs fat keto`, plus the known leader Calculator.net.
> - Other results seen but not audited: Pearson, Men's Health UK, life.now.to, PT Pioneer, Eat This, calcplanet, gymkee, buildingclub, elysiatools.
> - `TODO(owner): pull Google top 10 for "macro calculator", "macronutrient calculator" and "keto macro calculator".`
> **Pages visited (2026-11-14):** 5 read: Calculator.net (Macro), Inch (Macros), Fitness Volt (Macronutrient), KetoFocus (Keto Macro), FatCalc (Macro).

---

## 0. How this was collected (read first)

- **Who ranks:**
  - General calculator sites: Calculator.net, Inch.
  - Fitness publishers: Fitness Volt, PT Pioneer, Men's Health.
  - Keto recipe blogs: KetoFocus, Eat This.
  - A diet-calculator specialist: FatCalc.
  - Education: Pearson.
- **There are two competing methods, and pages rarely explain the difference:**
  1. **Percentage split:** grams = kcal × % ÷ (4 or 9). Used by Calculator.net, Inch and FatCalc.
  2. **Body-weight-first:** protein in g/kg, fat as a % of calories, and carbs as the remainder. Used by Fitness Volt; KetoFocus does the same with a fixed net-carb cap.
  - Method 2 is usually considered better for protein, because a % split gives too little protein at low calories and too much at high calories.
  - **We will offer both, clearly labelled.**
- **Energy values:**
  - Protein 4 kcal/g, carbohydrate 4, fat 9, **alcohol 7** (Atwater general factors).
  - Fibre is roughly 2 kcal/g, which is why "net carbs" exist.
  - `TODO(owner)`: cite USDA/FAO for the Atwater factors.
- **Reference ranges (cite; reviewer approves):**
  - IOM/NASEM 2005 AMDR for adults: carbohydrate **45–65%**, protein **10–35%**, fat **20–35%** of energy.
  - Protein RDA 0.8 g/kg.
  - For exercising people: ISSN position stand (Jäger et al. 2017), **1.4–2.0 g/kg/day**. Morton et al. 2018 meta-analysis: ~1.6 g/kg (up to ~2.2) for gains in muscle mass with resistance training.
  - `TODO(owner)`: verify each figure in the primary source.
- **Errors found (re-checked by us):**
  - **Inch:**
    - Its worked example multiplies **1,862 × 1.55 = 2,866**; the correct value is **2,886**, so every downstream number is about 20 kcal low.
    - Its "Endurance" row (protein 20–30%, carbs 55–65%, fat 30%) has a **minimum total of 105%**.
    - Its table rows don't match its presets.
  - **Calculator.net:**
    - It cites the **2015–2020 Dietary Guidelines** (now superseded by 2020–2025) and the "American Dietetic Association" (now the Academy of Nutrition and Dietetics).
    - It states no kcal/g values, no activity multipliers and no protein guidance.
  - **Fitness Volt:**
    - Two contradictory calorie floors: "the higher of 1.2 × BMR or 1,500" vs "1,200 women / 1,500 men".
    - Its fat range is 20–35% in the text vs 25–35% in the tool.
    - It calls fibre a micronutrient in one place and a macro in another.
    - Its schema links "Fits" to Wikipedia's "Convulsion" page.
    - Its worked example is ✔ (2,449 kcal → 98 g protein, 82 g fat, 330 g carbs).
  - **FatCalc:**
    - Its Mediterranean preset uses 35–40% fat, described as "standard", while it quotes the IOM maximum of 35%.
    - It cites WHO without listing it.
    - Its preset arithmetic is ✔ (Balanced at 2,000 kcal = 285 / 90 / 56 g).
  - **KetoFocus:** its goal adjustments "10 / 20 / 25%" don't say what they are a percentage of. There are no activity multipliers.
- **YMYL:**
  - Keto and very-high-protein advice needs a "talk to your doctor if you have kidney disease, diabetes medication, pregnancy…" note.
  - Fitness Volt correctly refuses numbers for pregnancy and kidney disease. We will do the same.
  - `TODO(owner)`: reviewer.
- **Recipe macros:** `recipe macro calculator` needs a food database. Only build it with a public, reusable dataset bundled in the page, as the keyword file says. It is out of scope for v1.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | calculator.net/macro-calculator.html | General calc site | Macro Calculator | ~1,700 |
| 2 | inchcalculator.com/macros-calculator/ | Calc site | Macros Calculator – Calculate Macros for Weight Loss / H1 Macro Calculator | 1,300–1,500 |
| 3 | fitnessvolt.com/macronutrient-calculator/ | Fitness publisher | Macros Calculator: Count Your Macronutrient Easily | 2,000–2,500 |
| 4 | ketofocus.com/keto-macro-calculator/ | Keto recipe blog | Free Keto Macro Calculator with Recipe Matches | 450–500 core |
| 5 | fatcalc.com/macro | Diet calc specialist | Free Macro Calculator \| 11 Diet Types | ~2,800 |

**What this tells us:**
- **Calculator.net** ranks for the head term with calorie goals (±0.5 / 1 / 2 lb a week) and Mifflin or Katch.
  - It shows no presets, kcal/g values or protein guidance, and its guideline references are outdated.
- **Inch has the most knobs:**
  - 5 presets (balanced 40/30/30, low fat, high protein, high carb, keto 5/25/70; all sum to 100 ✔), 5 BMR formulas and body fat.
  - Credentialed author and reviewers.
  - **Weak points:** **its worked example has a multiplication error**, one table row is impossible, and there is no FAQ or disclaimer.
- **Fitness Volt has the best method:** protein by body weight (1.2 / 1.6 / 1.8 g/kg by lifting status and goal), fat 25/30/35%, carbs as the remainder.
  - Meals per day (3–6) and fibre.
  - **Special-condition handling** (no numbers for pregnancy, breastfeeding or kidney disease).
  - **Weak points:** contradictory floors, an unsourced 2.3 g/kg LBM figure, no disclaimer, heavy promotion, and schema errors.
- **KetoFocus** has the best keto logic: a **net-carb cap** (default 20 g), protein at 2 g/kg lean mass, fat as the "lever", and a < 1,000 kcal block.
  - A disclaimer ✔ and 6 FAQs.
  - **Weak points:** goal % base undefined, no multipliers, sources not linked, recipe promotion.
- **FatCalc**:
  - **11 diet presets**, all summing to 100 ✔, with 11 references (IOM DRI, PREDIMED and others) and 8 FAQs.
  - **Weak points:** percentages only (no body-weight protein), and its Mediterranean fat range conflicts with the IOM limit.
- **No page offers all of these:**
  1. **both methods** (% split *and* body-weight-first), explained, with the user choosing
  2. **protein shown in g/kg as well as %**, with a warning when outside the cited ranges
  3. **AMDR check marks** (IOM 45–65 / 10–35 / 20–35) on any custom split
  4. a keto mode with a net-carb cap, fibre and net vs total carbs
  5. a per-meal split (3–6 meals) and grams per meal
  6. grams ↔ calories converter (the "1 g of fat is how many calories" long tail)
  7. a correct worked example, disclaimer, reviewer, date and special-condition refusals
  8. TDEE included or entered directly (shared engine with #20)

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Calculator.net | Inch | Fitness Volt | KetoFocus | FatCalc |
|---|---|---|---|---|---|
| TDEE built in | ✅ | ✅ | ✅ | ✅ | ❌ (enter kcal) |
| Enter own calorie target | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ |
| % split presets | ❌ | ✅ (5) | ⚠️ (3 styles) | ❌ | ✅ (11) |
| Custom % | ❌ | ✅ | ❌ | ❌ | ✅ (redistribution unclear) |
| Protein by body weight | ❌ | ❌ | ✅ | ✅ (per LBM) | ❌ |
| Carbs as remainder | ❌ | ❌ | ✅ | ⚠️ (fat remainder) | ⚠️ |
| Keto mode / net-carb cap | ❌ | ✅ (5/25/70) | ⚠️ (separate) | ✅ | ✅ (preset) |
| Per-meal split | ❌ | ❌ | ✅ (3–6) | ❌ | ❌ |
| Fibre target | ❌ | ❌ | ✅ | ⚠️ (net carbs) | ❌ |
| AMDR check on result | ❌ | ❌ | ❌ | ❌ | ⚠️ (text) |
| Special-condition guard | ❌ | ❌ | ✅ | ⚠️ (1,000 floor) | ❌ |
| Grams ↔ kcal converter | ❌ | ❌ | ❌ | ❌ | ❌ |
| Share / embed | ✅ | ✅ | ✅ | ⚠️ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Calculator.net | Inch | Fitness Volt | KetoFocus | FatCalc |
|---|---|---|---|---|---|
| kcal/g stated | ❌ | ✅ | ✅ | ⚠️ | ✅ |
| Worked example correct | n/a | ❌ (**2,866**) | ✅ | n/a | ✅ |
| Tables internally consistent | n/a | ❌ (**105%**) | ⚠️ (floors, fat range) | ⚠️ | ⚠️ (Mediterranean) |
| Protein guidance cited | ❌ | ⚠️ (ref title only) | ⚠️ (not tied) | ❌ | ⚠️ |
| Guidelines current | ❌ (**2015–2020**) | ✅ | ✅ | ⚠️ | ✅ |
| Medical disclaimer | ❌ | ❌ | ❌ | ✅ | ⚠️ (keto/vegan caveats) |
| Qualified reviewer | ❌ | ✅ (RDN) | ❌ (ACE trainer) | ⚠️ | ❌ |
| FAQ | 0 | 0 | ✅ | 6 | 8 |
| Promotion | ads | — | **heavy** | **recipes/email** | — |

---

## 4. Competitor-by-competitor detail

### 1. Calculator.net: Macro Calculator
- **Features:** age, sex, height, weight, activity (6 levels), goal (maintain, ±0.5 / 1 / 2 lb/week), Mifflin/Katch, and a food table (288 kcal turkey sub ✔).
- **Weak points:**
  - No presets, kcal/g values, protein targets, example or FAQ.
  - Outdated guidelines (2015–2020) and an old organisation name.
  - The activity multipliers are hidden.

### 2. Inch Calculator: Macros (Holly Smith, DO; reviewers Elise Harlow, RDN, and Donna Schwontkowski, DC)
- **Features:** 5 presets, 5 BMR formulas, body fat, st units, kcal per macro, share/embed.
- **Errors:**
  - **1,862 × 1.55 shown as 2,866 (should be 2,886).**
  - **The Endurance row's minimum sums to 105%.**
  - Table rows vs presets mismatch.
  - Incomplete reference.
- **Weak points:** no FAQ; no disclaimer; title ≠ H1.

### 3. Fitness Volt: Macronutrient Calculator (Matthew Magnante, ACE)
- **Features:**
  - Goals (−0.25 to −1% per week, +0.25%).
  - Diet style (more carbs, balanced, more fat).
  - Meals 3–6, lifting status, body fat.
  - Special conditions (pregnancy, breastfeeding, GLP-1, kidney disease).
  - Protein 1.2 / 1.6 / 1.8 g/kg, fat 25/30/35%, and fibre at 14 g per 1,000 kcal.
- **Checked ✔:** 2,449 kcal → 98 g P, 82 g F, 330 g C; 4 meals → 25 / 21 / 83 g; fibre 34 g.
- **Errors:**
  - Floors contradict each other.
  - Fat range mismatch.
  - Fibre categorised inconsistently.
  - The 88 g "close to 98 g" claim.
  - Schema mention errors; broken images.
  - "The rest of your meal" (should be "day").
- **Weak points:** no disclaimer; no dietitian; newsletter pop-ups.

### 4. KetoFocus: Keto Macro Calculator
- **Features:** net-carb cap (default 20 g), protein 2 g/kg LBM (25% body fat assumed if blank), fat as the remainder, < 1,000 kcal blocked, recipe matching, 6 FAQs, a disclaimer ✔.
- **Weak points:**
  - The goal % base is undefined.
  - No multipliers; unlinked sources.
  - An unsourced "some hold ketosis at 30+ g".
  - Email and recipe promotion.

### 5. FatCalc: Macro Calculator
- **Features:** calorie target in; **11 diet presets** (all 100% ✔); custom arrows; IOM ranges explained (2,000 kcal → 225–325 g C, 50–175 g P, 44–78 g F ✔); 8 FAQs; 11 references.
- **Errors:**
  - Mediterranean 35–40% fat vs the IOM 35% maximum.
  - WHO is cited but not listed.
  - The Paleo "elevated protein" claim at 30% (still within the AMDR).
  - Unclear custom redistribution.
- **Weak points:** no body-weight protein; no per-meal split.

---

## 5. Patterns

**Method A: percentage split**
- grams_P = kcal × %P ÷ 4; grams_C = kcal × %C ÷ 4; grams_F = kcal × %F ÷ 9.
- **Presets (our own, each with its % shown and an AMDR check):**

| Preset | Carbs / Protein / Fat (%) |
|---|---|
| Balanced | 50 / 20 / 30 |
| Higher protein | 40 / 30 / 30 |
| Lower carb | 25 / 35 / 40 ⚠ fat above AMDR, flagged |
| Lower fat | 60 / 20 / 20 |
| Keto | ≈ 5–10 / 20–25 / 65–75 ⚠ outside AMDR, flagged with a medical note |

- `TODO(owner)`: the reviewer approves the presets.

**Method B: body-weight-first (recommended default)**
- **Protein:** chosen g/kg (presets 0.8 RDA / 1.2 / 1.6 / 2.0; cite the ranges). Use goal weight or LBM if the user prefers.
- **Fat:** 20–35% of kcal (default 30%), with a minimum of about 0.5 g/kg.
  - `TODO(owner)`: confirm the minimum guidance and its source.
- **Carbs:** the remainder.
  - If the remainder is negative, show an error: "calories too low for these protein and fat settings".

**Keto mode**
- Net-carb cap (default 20 g; options 20–50 g).
- Protein in g/kg (LBM or weight).
- Fat = the remainder.
- Show total carbs = net + fibre.

**Meals:** 3–6 meals, with grams per meal (rounded so the meals add up exactly to the daily total).

**Worked example (our arithmetic; the reviewer confirms)**
- 2,400 kcal, 80 kg, method B, protein 1.6 g/kg, fat 30%.
- **Protein:** 128 g = 512 kcal.
- **Fat:** 720 kcal = 80 g.
- **Carbs:** 2,400 − 512 − 720 = 1,168 kcal = 292 g.
- **As % of energy:** P 21.3%, F 30%, C 48.7%. All within the AMDR ✔.

**Converter:** g ↔ kcal for protein, carbs, fat and alcohol (e.g. 1 g fat = 9 kcal; 30 g protein = 120 kcal).

**Coverage across the 5 competitors**

| Section | Pages (of 5) |
|---|:---:|
| Both methods offered | **0** |
| Protein by body weight | 2 |
| AMDR check on custom result | **0** |
| Per-meal split | 1 |
| Net-carb cap keto | 1 |
| Worked example correct | 2 |
| Disclaimer + qualified reviewer | **0** |
| g ↔ kcal converter | **0** |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword. All answers must be reviewed by a qualified person.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How do I calculate my macros for weight loss? | `calculate macros for weight loss`, all |
| 2 | ★ How many calories are in 1 gram of fat, protein or carbs? | `1 g of fat is how many calories`, `1 gm of fat is how many calories` |
| 3 | ★ What are good keto macros? | `keto macro calculator`, KetoFocus, FatCalc |
| 4 | ★ How much protein do I need per day? | Fitness Volt, FatCalc, KetoFocus |
| 5 | ★ How do I track macros? | `how to track macros` |
| 6 | What is the difference between net carbs and total carbs? | FatCalc, KetoFocus |
| 7 | Which macro split is best? | Inch, FatCalc |
| 8 | Do macros matter if I hit my calories? | gap |
| 9 | How much fat should I eat per day? | `fat requirement calculator` |
| 10 | Should I base protein on current weight or goal weight? | gap |
| 11 | Is keto safe for everyone? | KetoFocus, Fitness Volt (reviewed answer) |

---

## 7. Gaps nobody fills — our opportunities

1. **Both methods**, explained, with the body-weight-first method as the cited default.
2. **AMDR check marks** on any result, so users see when a split goes outside the guideline ranges.
3. **Protein shown as g/kg and %** at the same time.
4. **A correct worked example** (Inch's is wrong), with the arithmetic shown.
5. **Keto mode done properly:** a net-carb cap, fibre, and total carbs.
6. **Per-meal grams that add up exactly.**
7. **A g ↔ kcal converter** for the long tail.
8. **YMYL:** a disclaimer, a reviewer, a date and special-condition refusals (pregnancy, kidney disease, diabetes medication).
9. **Links:** TDEE (#20, shared engine), BMR (#21), Weight Loss Date (#25), Body Fat (#19), FFMI (#26).

---

## 8. Blueprint for the KKCTools Macro Calculator

### 8.1 SEO

- **URL:** `/macro-calculator/`
- **Title:** Macro Calculator – Protein, Carbs and Fat
- **H1:** Macro Calculator: Daily Protein, Carbs and Fat for Your Goal
- **Meta:** as in the keyword file (158 chars).
- **H2s:**
  - "How to calculate macros for weight loss"
  - "Keto macro calculator"
  - "How much protein do you need?"
  - "Calories per gram"
  - "Macros per meal"
- **Schema:** `WebApplication` + `FAQPage`.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Calories | From TDEE engine (#20 inputs inline) or typed directly |
| Method | B (default: protein g/kg, fat %, carbs remainder) or A (% presets / custom, sum-to-100 enforced) |
| Keto | Net-carb cap, protein g/kg (weight or LBM), fat remainder, fibre field |
| Outputs | g, kcal, % for each macro; g/kg protein; AMDR checks; per-meal table (3–6) |
| Guards | Negative remainder error; floors from #20; special-condition notice (no numbers) |
| Converter | g ↔ kcal (P, C, F, alcohol) |
| UX | Share URL, copy, print, no network |

### 8.3 Content outline (≈ 1,300–1,600 words, original, reviewed)

1. Intro and calculator, with the disclaimer
2. How to use it (two methods)
3. Calories per gram (Atwater, cited)
4. How much protein (cited ranges)
5. Fat and carbs: guideline ranges (AMDR, cited)
6. Macros for weight loss, maintenance and gain (worked example)
7. Keto macros (net carbs, caution)
8. How to track macros (practical, neutral)
9. FAQ (11)
10. Sources, reviewer and date, then related tools

### 8.4 Quality checks

- **Unit tests:**
  - The worked example (128 / 80 / 292 g).
  - Presets sum to 100.
  - Negative-remainder handling.
  - The keto path.
  - Meal rounding sums.
  - The converter.
- No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)` (blocking for launch):**
  - Pull Google top 10.
  - Cite the IOM/NASEM AMDR, ISSN 2017, Morton 2018 and the Atwater factors.
  - The reviewer approves the presets and the minimum-fat guidance.
  - Approve the special-condition wording.
  - Get a qualified reviewer (RD), with name and date.
