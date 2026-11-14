# TDEE & Maintenance Calorie Calculator — Competitor Analysis

> **Target page:** KKCTools `/tdee-calculator/` (Batch 8, Tool #20 🟡, **YMYL health tool**)
> **Primary keyword:** `maintenance calorie calculator` — US 74,000 · KD 8 · CPC $0.04.
> - Secondary: `calorie calculator` (4,090,000 / KD 5). The Semrush figure looks inflated; use it only as H1 support.
> - Long tail: 36 calorie-need / deficit / TDEE phrases (193,900), e.g. `kcal`, `kcal to cal`, `calorie intake calculator` (14,800 / KD 5), `tdee calc` (9,900 / KD 5), `what is a calorie deficit`, `how much calories should i eat`.
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 8. Competitors come from a live web search on 2026-11-14 for `maintenance calorie calculator TDEE`, plus the known leaders Calculator.net, TDEECalculator.net and the NIH Body Weight Planner.
> - Other results seen but not audited: gymgeek, tdeecalculator.it.com, Fitness Volt (TDEE + maintenance), calculate.co.nz, Bodybuilding.com, Marathon Handbook, Zava (UK pharmacy), Ro (telehealth), coachway, bushe, devcomma, mycalcbuddy.
> - `TODO(owner): pull Google top 10 for "maintenance calorie calculator", "tdee calculator" and "calorie calculator".`
> **Pages visited (2026-11-14):** 5 read: Calculator.net (Calorie), TDEECalculator.net, Inch (Maintenance Calorie), Built With Science (TDEE), NIH/NIDDK Body Weight Planner.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - General calculator sites: Calculator.net, Inch.
  - Dedicated TDEE sites: TDEECalculator.net.
  - Fitness influencers and brands: Built With Science, Fitness Volt, Bodybuilding.com, Marathon Handbook.
  - **Telehealth and pharmacy lead-gen:** Ro, Zava.
  - **The US government:** NIH Body Weight Planner (NIDDK).
  - The keyword file warns that the SERP is crowded, so we need **a clearly better tool**, not just more text.
- **The standard equations, as verified on the pages that print them:**
  - **Mifflin-St Jeor (1990):** BMR = 10·kg + 6.25·cm − 5·age + 5 (men) / − 161 (women).
  - **Revised Harris-Benedict (Roza & Shizgal 1984):**
    - men: 88.362 + 13.397·kg + 4.799·cm − 5.677·age
    - women: 447.593 + 9.247·kg + 3.098·cm − 4.330·age
  - **Katch-McArdle:** BMR = 370 + 21.6·LBM(kg), where LBM = weight × (1 − body-fat **fraction**).
  - **Activity factors** (the common convention, origin poorly documented): 1.2 / 1.375 / 1.55 / 1.725 / 1.9.
  - The NIH planner instead uses a **physical activity level (PAL) of 1.4–2.5**, defaulting to 1.6.
  - `TODO(owner)`: cite the original papers (Mifflin 1990, *Am J Clin Nutr* 51:241; Roza & Shizgal 1984, *Am J Clin Nutr* 40:168), and decide which activity-factor source to cite. NASEM's 2023 *Dietary Reference Intakes for Energy* is the official alternative, with new EER equations.
- **Errors found:**
  - **Calculator.net:**
    - It defines Katch-McArdle's F as "body fat in percentage"; it must be a **fraction** (0.20, not 20).
    - It gives no per-level activity multipliers (only "1.2–1.95").
    - It states the 3,500 kcal/lb rule with only a "theoretical" caveat.
    - Its zigzag example uses a 525 kcal swing against its own "200–300" guideline.
  - **Inch:**
    - TEF is described as both "≤ 10% of BMR" and "≤ 10% of total calories".
    - The calculator's day ranges differ from its table (1–3 vs 1–2 days; a 5–6 tier is missing).
    - "Activity favor" typo.
    - Three of its five formulas are offered but not explained.
  - **TDEECalculator.net:** no formula named ("the best formulas"), no multipliers, no sources, about 330 words.
  - **Built With Science:** Katch-McArdle is named but not shown, its multipliers are not disclosed, it cites no sources, and it carries heavy programme promotion.
- **Why the 3,500 kcal rule matters.**
  - It is widely criticised for overstating long-term loss, because expenditure falls as weight falls (Hall et al., *Lancet* 2011, dynamic model).
  - The NIH planner simulates this over time, but its page doesn't name the model.
  - Our page should **not promise a date from 3,500 kcal maths**. The Weight Loss Date tool (#25) will handle this carefully.
  - `TODO(owner)`: cite Hall 2011 and confirm the NIH planner's model reference.
- **Breastfeeding mode (keyword file requirement):**
  - It needs a cited extra-calorie figure: NASEM/IOM or the Dietary Guidelines for Americans 2020–2025 (≈ +330 kcal for 0–6 months, ≈ +400 kcal for 6–12 months).
  - `TODO(owner)`: confirm the current official values (NASEM 2023 may differ) before showing any number.
- **YMYL:** show "estimate, not medical advice", minimum-intake guidance (cited), a qualified reviewer, and no health claims. `TODO(owner)`.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | calculator.net/calorie-calculator.html | General calc site | Calorie Calculator | ~3,500 |
| 2 | tdeecalculator.net | Dedicated TDEE site | TDEE Calculator: Learn Your Total Daily Energy Expenditure | ~330 |
| 3 | inchcalculator.com/maintenance-calorie-calculator/ | Calc site | Maintenance Calorie Calculator | ~1,000 |
| 4 | builtwithscience.com/tdee-calculator | Fitness influencer brand | TDEE Calculator: Find Your Total Daily Energy Expenditure | 1,800–2,000 |
| 5 | niddk.nih.gov/bwp | US government simulator | NIH Body Weight Planner | (tool page) |

**What this tells us:**
- **Calculator.net owns `calorie calculator`.**
  - It offers 3 equations, 6 activity levels and minimum-intake warnings (1,200 / 1,500 kcal).
  - It has meal plans, a zigzag schedule, food and exercise tables, and about 3,500 words.
  - **Weak points:** a Katch-McArdle definition error, hidden multipliers, weak sources ("Harvard Health", "studies have shown"), unsourced exercise values, and no FAQ.
- **TDEECalculator.net ranks on its exact-match domain and its UX**, not its content.
  - It shows BMI and macros and accepts an optional body fat %.
  - It **discloses nothing** about formulas or sources.
- **Inch has the most formula choice:** Mifflin, Katch, revised HB, original HB and Schofield.
  - Its 7 references are matched in the text, and it has RDN and DC reviewers.
  - **Weak points:** no example, no FAQ, no disclaimer, plus the inconsistencies listed above.
- **Built With Science** has a strong brand, an FAQ and a disclaimer ✔.
  - Its maths is opaque (Katch only, multipliers hidden), and it carries heavy promotion.
- **NIH Body Weight Planner is the scientific benchmark.**
  - It **simulates weight, body fat and intake over time**, uses PAL 1.4–2.5, and offers advanced inputs (RMR, body fat, carb %, sodium).
  - It warns below 1,000 kcal and exports CSV.
  - **Its limits:** a complex UX, and it is not aimed at "what's my maintenance in 10 seconds".
- **No page offers all of these:**
  1. **all 3 named equations side by side**, with the coefficients shown and cited
  2. **activity multipliers shown next to each level**, with plain descriptions, and **PAL** offered as an option
  3. a goal table (maintain, −0.25 / −0.5 / −0.75 kg per week, +0.25) with **floor warnings**
  4. a **TDEE range** (± typical error), not a falsely precise number
  5. a "calibrate from your own log" mode (2–3 weeks of intake + weight trend → observed TDEE)
  6. a correct Katch-McArdle with body fat (links #19)
  7. a cited breastfeeding mode
  8. a YMYL disclaimer, a qualified reviewer and a review date
  9. kcal vs cal vs kJ explained (long-tail `kcal to cal`)

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Calculator.net | TDEECalc.net | Inch | Built With Science | NIH BWP |
|---|---|---|---|---|---|
| Mifflin-St Jeor | ✅ | ? (not named) | ✅ | ❌ | (own model) |
| Revised Harris-Benedict | ✅ | ? | ✅ (+ original) | ❌ | — |
| Katch-McArdle (body fat) | ✅ (**F defined wrong**) | ⚠️ (BF field) | ✅ (not shown) | ✅ (not shown) | ⚠️ (BF input) |
| Other (Schofield) | ❌ | ❌ | ✅ | ❌ | — |
| Activity multipliers shown | ❌ (range only) | ❌ | ✅ (table mismatch) | ❌ | ✅ (PAL) |
| Goal targets (lose / gain) | ⚠️ (prose) | ⚠️ | ❌ | ✅ (ranges) | ✅ (goal + date) |
| Minimum-intake warning | ✅ | ❌ | ❌ | ❌ | ✅ (< 1,000) |
| Results at every activity level | ⚠️ | ⚠️ | ❌ | ❌ | ❌ |
| Error range shown | ❌ | ❌ | ❌ | ❌ | ✅ (uncertainty) |
| Time simulation (adaptation) | ❌ | ❌ | ❌ | ❌ | ✅ |
| Calibrate from own log | ❌ | ❌ | ❌ | ⚠️ (advice) | ❌ |
| Breastfeeding mode | ❌ | ❌ | ❌ | ❌ | ❌ (excluded) |
| kJ output | ✅ | ❌ | ❌ | ❌ | ❌ |
| Macros | ❌ (separate) | ✅ | ⚠️ | ⚠️ (links) | ✅ (carb %) |
| Export | ❌ | ❌ | ✅ (share) | ❌ | ✅ (CSV) |

---

## 3. Feature matrix — content and trust

| Item | Calculator.net | TDEECalc.net | Inch | Built With Science | NIH BWP |
|---|---|---|---|---|---|
| Equations printed and correct | ⚠️ (**Katch F**) | ❌ | ✅ (Mifflin only) | ❌ | — |
| Primary sources cited | ❌ (vague) | ❌ | ✅ (7) | ❌ | ⚠️ (gov links) |
| 3,500 kcal rule handled | ⚠️ ("theoretical") | — | — | — | ✅ (dynamic) |
| Worked example | ✅ (meal plans) | ❌ | ❌ | ⚠️ | — |
| Medical disclaimer | ⚠️ | ❌ | ❌ | ✅ | ✅ |
| Qualified reviewer | ❌ | ❌ | ✅ (RDN, DC) | ❌ | ✅ (institution) |
| Date | ❌ | ❌ | ❌ | ❌ | ⚠️ |
| FAQ | 0 | linked page | 0 | ✅ | ⚠️ |
| Internal inconsistencies | 2 | — | 3 | 2 | — |
| Promotion | ads | — | — | **heavy** | none |

---

## 4. Competitor-by-competitor detail

### 1. Calculator.net: Calorie Calculator
- **Features:**
  - Mifflin, revised HB and Katch, with 6 activity levels.
  - Minimum 1,200 (women) / 1,500 (men) unless supervised; maximum 1,000 kcal/day deficit.
  - Zigzag plan, meal plans (sums checked ✔), and food, exercise and energy tables (kJ ✔).
- **Errors:**
  - Katch "F = body fat in percentage" (it must be a fraction).
  - No per-level multipliers.
  - The 3,500 kcal rule is under-qualified.
  - The zigzag example (525) contradicts its 200–300 guideline.
  - Tennis and swimming show identical values.
  - Many "studies show" claims with no source.
- **Weak points:** no FAQ; the age range of 15–80 is not explained.

### 2. TDEECalculator.net
- **Features:** imperial/metric, 5 activity levels (including "Athlete 2x per day"), optional body fat %, BMI and macro outputs.
- **Weak points:**
  - No formula, multipliers, sources, examples, author or on-page FAQ.
  - Unverifiable claims ("best formulas", "256-bit encryption").
  - Height range 4′7″–7′0″.
- **Takeaway:** it shows the UX the head term rewards: fast, clean, every activity level at once.

### 3. Inch Calculator: Maintenance Calorie (Joe Sexton; reviewers Elise Harlow, MS, RDN, and Donna Schwontkowski, DC, MS)
- **Features:** 5 formulas, optional body fat %, stones support, share/embed, a multiplier table, and a TEF variant (BMR × 1.1 × AF).
- **Our check:** woman, 30 y, 165 cm, 60 kg → BMR 1,320 → sedentary 1,584 kcal ✔.
- **Errors:**
  - TEF basis contradicts itself.
  - The day ranges don't match the table.
  - "Activity favor".
  - Three formulas are unexplained.
- **Weak points:** no example, FAQ or disclaimer.

### 4. Built With Science: TDEE Calculator
- **Features:** Katch-McArdle (body fat required), goal guidance (−300–500 / +200–300), recalculate every 4–6 weeks, FAQ, disclaimer.
- **Weak points:**
  - Formula and multipliers hidden.
  - No sources.
  - Inconsistent recalculation trigger.
  - "BMR 60–70% of TDEE" vs "TDEE 30–60% higher" only loosely agree.
  - No byline or date.
  - Heavy "start my transformation" promotion.

### 5. NIH Body Weight Planner (NIDDK)
- **Features:**
  - Inputs: weight, sex, age, height, PAL (1.4–2.5, default 1.6), plus advanced settings (uncertainty, carb %, sodium, body fat, RMR).
  - Goal weight and date, and activity changes with ramps.
  - Outputs: maintenance, goal and goal-maintenance calories; charts of weight, body fat and intake; CSV.
  - Warnings for BMI and < 1,000 kcal.
  - Adults only; not for pregnancy or breastfeeding.
- **Weak points:** a complex UI; the model isn't named on the page.
- **Takeaway:** link to it as an authoritative "go deeper" tool and cite it. We don't try to copy it.

---

## 5. Patterns

**Engine (shared with BMR #21, Macro #22, Weight Loss Date #25)**
- **BMR:**
  - Mifflin-St Jeor (default).
  - Revised Harris-Benedict.
  - Katch-McArdle, shown only when body fat is entered; links to #19.
- **TDEE = BMR × activity factor:**
  - 1.2 sedentary (desk job, little exercise)
  - 1.375 light (1–3 days a week)
  - 1.55 moderate (3–5 days)
  - 1.725 very (6–7 days)
  - 1.9 extra (physical job + training)
  - Show each factor on screen. Offer a "PAL" input for advanced users.
- **Range:** show TDEE ± a typical prediction error.
  - Mifflin is commonly reported to be within ±10% for most adults.
  - `TODO(owner)`: cite a validation study (e.g. Frankenfield et al. 2005, *JADA*).
- **Goal targets:**

| Goal | kcal/day vs TDEE |
|---|---|
| Maintain | 0 |
| Lose slowly | −250 |
| Lose | −500 |
| Lose faster | −750 (warning) |
| Gain lean | +250 |
| Gain | +500 |

- **Floors:** never show a target below the cited minimum. Show "speak to a professional" instead.
  - `TODO(owner)`: choose the source for the 1,200/1,500 convention, or use NIH's 1,000 warning.
- **Calibrate mode:**
  - Inputs: average daily intake over N ≥ 14 days, plus start and end weight (trend).
  - Observed TDEE ≈ intake − (Δweight_kg × 7,700 / days).
  - Label it **approximate**: water and glycogen add noise, so 3–4 weeks is better.
  - `TODO(owner)`: reviewer approval of the 7,700 kcal/kg energy-density approximation and its wording.
- **Breastfeeding:** add the cited kcal for 0–6 or 6–12 months (values pending owner verification).
- **Units:** kcal ↔ kJ (× 4.184); "Calorie" (capital C) = kcal.

**Example (our arithmetic, for the page; final copy reviewed)**
- Man, 35 y, 180 cm, 80 kg.
- **Mifflin BMR** = 800 + 1,125 − 175 + 5 = **1,755 kcal**.
- **Moderate activity:** 1,755 × 1.55 = **2,720 kcal/day**.
- **Revised HB** = 88.362 + 1,071.76 + 863.82 − 198.70 = **1,825 kcal**, giving 2,829 at moderate activity. This shows how much the formulas differ (≈ 4%).

**Coverage across the 5 competitors**

| Section | Pages (of 5) |
|---|:---:|
| 3 equations printed correctly | **0–1** |
| Multipliers visible per level | 2 |
| Error range shown | 1 (NIH) |
| Goal table with floors | 1–2 |
| Calibrate from own log | **0** |
| Breastfeeding mode | **0** |
| Disclaimer + reviewer + date | **0** |
| kcal/kJ explained | 1 |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword. All answers must be reviewed by a qualified person.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What are maintenance calories? | `maintenance calorie calculator`, all |
| 2 | ★ How many calories should I eat a day? | `how much calories should i eat` |
| 3 | ★ What is a calorie deficit, and how big should it be? | `what is a calorie deficit`, Calculator.net, BWS |
| 4 | ★ What is the difference between BMR and TDEE? | BWS, Inch |
| 5 | ★ Which activity level should I choose? | Inch, TDEECalc.net |
| 6 | What is the difference between kcal and Calories (and kJ)? | `kcal`, `kcal to cal` |
| 7 | Which formula is most accurate? | Inch, BWS |
| 8 | Why isn't my weight changing at the calculated calories? | search summary (calibrate) |
| 9 | Is 1 pound really 3,500 calories? | Calculator.net |
| 10 | How often should I recalculate? | BWS |
| 11 | How many extra calories do I need while breastfeeding? | keyword file (cited) |
| 12 | Is there a minimum number of calories I should eat? | Calculator.net, NIH |

---

## 7. Gaps nobody fills — our opportunities

1. **Three equations side by side**, with the coefficients printed and the originals cited. Katch-McArdle is defined correctly.
2. **Transparent activity levels:** each factor shown and described, plus a PAL option.
3. **A range, not false precision** (± a cited typical error).
4. **A calibrate-from-your-log mode** to find your real maintenance. Nobody offers this.
5. **A goal table with safe floors** and neutral wording, linked to the Weight Loss Date tool (#25), which handles adaptation honestly.
6. **A cited breastfeeding mode.**
7. **YMYL trust:** a disclaimer, a qualified reviewer, a date, and NIH linked as the deeper tool.
8. **Fast UX:** results at every activity level shown at once (what TDEECalc.net is known for), plus kJ.
9. **Links:** BMR (#21), Macro (#22), Weight Loss Date (#25), Body Fat (#19), Calories Burned Walking (#23), BMI (#24).

---

## 8. Blueprint for the KKCTools TDEE Calculator

### 8.1 SEO

- **URL:** `/tdee-calculator/`
- **Title:** TDEE Calculator – Maintenance Calories Per Day
- **H1:** TDEE Calculator: How Many Calories Do You Burn and Need a Day?
- **Meta:** as in the keyword file (160 chars).
- **H2s:**
  - "Maintenance calorie calculator"
  - "Calories for weight loss or gain"
  - "What is a calorie deficit?"
  - "BMR vs TDEE"
  - "kcal, Calories and kJ"
- **Schema:** `WebApplication` + `FAQPage`. No ratings.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Inputs | Sex, age (18–80), height, weight (kg/lb/st), activity (5 levels + PAL), optional body fat %, optional breastfeeding (0–6 / 6–12 months) |
| Outputs | BMR (chosen formula) + other two formulas; TDEE range; table for all activity levels; goal table with floors; kcal + kJ |
| Calibrate | Avg intake + weight trend over ≥ 14 days → observed TDEE (approx.) |
| Safety | Disclaimer above results; floors; under-18 / pregnancy notice |
| Engine | Shared fitness module (#21, #22, #25), unit-tested |
| UX | Share URL, copy, print, no network |

### 8.3 Content outline (≈ 1,500–1,800 words, original, reviewed)

1. Intro and calculator, with the disclaimer
2. How to use it, and how to choose an activity level
3. What TDEE and maintenance calories are (BMR + activity + TEF)
4. The three formulas (printed, cited, worked example)
5. How accurate it is, and how to calibrate with your own data
6. Calories for weight loss or gain (goal table, floors, why progress slows)
7. Breastfeeding (cited)
8. kcal vs Calories vs kJ
9. FAQ (12)
10. Sources, reviewer and date, then related tools (and the NIH planner)

### 8.4 Quality checks

- **Unit tests:**
  - Each equation against published examples and our worked example (1,755 / 2,720 / 1,825).
  - Katch with 20% body fat (fraction handling).
  - Floors.
  - Unit conversions.
  - Calibration maths.
- No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)` (blocking for launch):**
  - Pull Google top 10.
  - Cite Mifflin 1990, Roza & Shizgal 1984, Katch-McArdle and a validation study.
  - Choose the activity-factor source (or NASEM 2023).
  - Verify the breastfeeding kcal.
  - Choose the floor wording.
  - Get a qualified reviewer (RD) with name and date.
