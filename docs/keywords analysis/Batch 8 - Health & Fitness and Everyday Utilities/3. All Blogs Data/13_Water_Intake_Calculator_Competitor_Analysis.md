# Water Intake Calculator — Competitor Analysis

> **Target page:** KKCTools `/water-intake-calculator/` (Batch 8, Tool #13 ✅, YMYL)
> **Primary keyword:** `water intake calculator` — US 14,800 · KD 12 · rising. The cluster has 7 keywords and 56,800 US searches, including `how many cups of water a day` (9,900) and 5 "how many oz/liters a day" phrases (32,100).
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 8. Competitors come from a live web search for `water intake calculator how much water should i drink a day` on 2026-11-14. `TODO(owner): pull Google top 10.`
> **Pages visited (2026-11-14):** 4 read (Omni, GIGAcalculator, Inch Calculator, Calculate.co.nz). The Mayo Clinic water article returned 403.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Calc sites: Omni, GIGA, Inch, Calculate.co.nz, FatCalc, 101 Planners, calcfyi.
  - Fitness and health brands: Bodybuilding.com, JumpstartMD, Fitness Volt, Stylecraze.
  - App lead-gen pages: PlanFit, Sparkful, Arvo, Gymkee.
  - A spam PDF on a hijacked Linux group domain.
  - Mayo Clinic probably ranks but was blocked.
- **Keyword-file rules:**
  - Inputs: weight, activity minutes and climate.
  - Output: a daily **range** in oz, litres, cups and 500 mL bottles.
  - A **simple tracker stored only in the browser**.
  - **Cite the guideline**, e.g. the National Academies adequate-intake figures.
  - YMYL: label it an estimate, never invent health claims, and get a reviewer before launch.
- **The authority reference is NASEM (2005) Adequate Intake for total water:**
  - about **3.7 L/day for men** and **2.7 L/day for women**.
  - Roughly 80 % comes from drinks and 20 % from food. Omni reports 81/19.
  - An AI is a **population median, not an individual requirement**. Omni frames it wrongly ("to prevent dehydration").
  - `TODO(owner)`: cite NASEM 2005 DRI and, if used, EFSA 2010.
- **The methods differ widely:**
  - Omni: the NASEM AI by age and sex only, with no weight input.
  - GIGA: TDEE × 1 mL/kcal.
  - Inch: 1 oz per lb plus 12 oz per 30 min of exercise, cited to WebMD.
  - Calculate.co.nz: 30–40 mL/kg plus 12 mL per minute, unsourced and possibly double-counted.
  - **We show more than one method, explain each one, and give a range.**
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | omnicalculator.com/health/water-intake | Giant | Water Intake Calculator | 1,200–1,400 |
| 2 | gigacalculator.com/calculators/water-intake-calculator.php | Calc site | Daily Water Intake Calculator | ~2,500 |
| 3 | inchcalculator.com/water-intake-calculator/ | Calc site | Water Intake Calculator – How Much Water Should You Drink? | ~1,300 |
| 4 | calculate.co.nz/water-intake-calculator.php | NZ calc site | Water Intake Calculator NZ 2026 | 700–800 |
| — | mayoclinic.org/…/water/art-20044256 | Health authority | Water: How much should you drink every day? | **blocked (403)** |

**What this tells us:**
- **GIGA has the most inputs:** age, sex, height, weight, 5 activity tiers, and pregnancy or lactation. Its method is TDEE × 1 mL/kcal. It cites 11 references and outputs total water vs drinks in L, mL, cups and oz.
  - Weak points: a typo ("ESFA" for EFSA), a broken sentence, an overstated claim about weight loss, and no FAQ.
- **Omni** uses the NASEM AI table and has a PhD and MD author team plus a disclaimer.
  - Its **only inputs are child/adult and sex**. There's no weight, activity or climate input.
  - Its AI interpretation is wrong, its citation numbering is off, and it makes unsourced symptom claims.
- **Inch** has clinical authors (DO, RDN) and uses 1 oz/lb plus an exercise allowance. Its examples check out.
  - Weak points: it rests on WebMD, doesn't say whether the output is total water or drinks only, and has **no disclaimer**.
- **Calculate.co.nz** uses mL/kg by activity plus exercise. Its arithmetic is correct.
  - Weak points: **no sources**, a possible double count, 350 vs 360 mL inconsistency, and a "not financial advice" footer on a health tool.
- **No competitor provides all of these:**
  - a cited **NASEM baseline** plus **weight- and activity-based estimates** shown as a range
  - a climate (heat) adjustment
  - **pregnancy and lactation AI values**, cited
  - output split into total vs drinks
  - output in oz, L, cups and bottles
  - a **local tracker**
  - an overhydration (hyponatremia) caution
  - "check with a doctor" guidance for heart and kidney conditions
  - a reviewer

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Omni | GIGA | Inch | Calc.co.nz |
|---|---|---|---|---|
| Sex / age | ✅ | ✅ | ❌ | ❌ |
| Weight | ❌ | ✅ | ✅ | ✅ |
| Activity / exercise minutes | ❌ | ✅ (tiers) | ✅ (minutes) | ✅ (tiers + minutes) |
| Climate / heat | ❌ | ❌ | ⚠️ (heat minutes) | ❌ |
| Pregnancy / lactation | ❌ | ✅ | ❌ | ❌ |
| NASEM AI baseline shown | ✅ | ⚠️ | ⚠️ (text) | ❌ |
| Total vs drinks split | ✅ | ✅ | ❌ (**unclear**) | ❌ |
| Range (not single number) | ❌ | ❌ | ⚠️ (text 0.5–1 oz/lb) | ❌ |
| Units: oz, L, cups, bottles | ⚠️ (L, cups) | ✅ (no bottles) | ✅ (oz, L, glasses) | ⚠️ (L, mL, glasses) |
| **Tracker (local)** | ❌ | ❌ | ❌ | ❌ |
| Overhydration caution | ⚠️ (wording) | ⚠️ | ❌ | ❌ |
| Medical-condition note | ✅ | ✅ | ❌ | ✅ |

---

## 3. Feature matrix — content and trust

| Item | Omni | GIGA | Inch | Calc.co.nz |
|---|---|---|---|---|
| Authoritative source (NASEM / EFSA) | ✅ (NASEM 2005) | ✅ (IOM + EFSA) | ✅ (NASEM) + WebMD | ❌ |
| Method explained | ✅ | ✅ | ✅ | ✅ |
| Worked example (checked) | ✅ (180 lb → 90 oz) | ✅ (70/56 oz) | ✅ (216 oz) | ✅ (2,810 mL) |
| Errors | AI framed as requirement; citation numbering; unsourced symptoms | "ESFA" typo; broken sentence; weight-loss claim | upper-bound choice unexplained; scope unclear | 350 vs 360 mL; double count; finance disclaimer |
| Disclaimer | ✅ | ✅ | ❌ | ✅ (+ wrong footer) |
| Clinical author / reviewer | ✅ (MD candidate) | ❌ | ✅ (DO, RDN) | ❌ |
| FAQ count | some | 0 | 0 | 3 |
| Date | ❌ | ✅ (Jun 2026) | ❌ | ✅ (Nov 2026) |

---

## 4. Competitor-by-competitor detail

### 1. Omni — Water Intake Calculator (Hanna Pamuła PhD, Łucja Zaborowska MD; reviewers)
- **Inputs:** child/adult, sex.
- **Outputs:** total water ≈ 3.7 L and drinks 3.0 L (≈ 13 cups) for an adult man. The beverage/food split is 81/19.
- **Sources:** NASEM 2005 and Sawka 2007 (ACSM).
- **Errors:**
  - AI is described as what is needed "to prevent dehydration", but it is a population median.
  - Two age bands overlap.
  - Reference list numbering is wrong.
  - Unsourced symptoms ("purple fingernails") and an unsourced "15 L excretion" claim.
  - Hyponatremia is equated with overhydration.
  - An empty heading.
- **Weak points:** no weight, activity or climate input; no tracker.

### 2. GIGAcalculator — Daily Water Intake Calculator (Georgi Georgiev, Jun 2026)
- **Inputs:** units, age, sex, height, weight, 5 activity levels, pregnancy/lactation.
- **Method:** TDEE × 1 mL/kcal, with pregnancy adjustments based on a mix of EFSA and IOM values.
- **Sources:** 11 references.
- **Errors:**
  - "ESFA" typo.
  - A sentence runs on.
  - Reference 6's URL doesn't match the cited paper.
  - The Elderly row just says "as adults".
  - Calls itself "superior" and "most scientific" without support.
  - Draws causal weight-loss conclusions from one small study.

### 3. Inch Calculator — Water Intake Calculator (Holly Smith DO; reviewers RDN, DC)
- **Inputs:** weight, exercise or heat minutes.
- **Formula:** oz = lb + 12 × min/30.
- **Example:** 180 lb with 90 min → 216 oz ✔.
- **Sources:** NASEM, EFSA and studies, but the formula itself rests on WebMD.
- **Errors:**
  - Uses the top of its own 0.5–1 oz/lb range without saying why.
  - Doesn't say whether the result is total water or drinks only.
  - Minor rounding in the cup figures.
  - The 2 % dehydration claim has no citation.
- **Weak points:** **no medical disclaimer**, no FAQ, no date.

### 4. Calculate.co.nz — Water Intake Calculator NZ (reviewed Nov 2026)
- **Inputs:** weight, activity (30, 35 or 40 mL/kg), exercise minutes (12 mL/min).
- **Example:** 70 kg → 2,450 + 360 = 2,810 mL ✔.
- **FAQs (3).**
- **Errors:**
  - No health sources.
  - The reviewer's references are tax and bank bodies.
  - Activity may be counted twice.
  - Says 350 mL in one place and 360 mL in another.
  - Footer says "not financial advice" on a health tool.
  - Partner banners.

---

## 5. Patterns

**Baseline (cite)**
- NASEM Adequate Intake, total water for adults aged 19+: men 3.7 L, women 2.7 L.
- About 80 % of that comes from drinks: men ≈ 3.0 L, women ≈ 2.2 L.
- Pregnancy 3.0 L total; lactation 3.8 L total.
- `TODO(owner)`: verify all values against the NASEM 2005 DRI tables.

**Personal estimate**
- Shown as a **range** from two methods:
  - weight-based: 30–35 mL/kg (label the source; `TODO(owner)` to cite)
  - the NASEM baseline
- Plus an exercise allowance of about 0.4–0.8 L per hour of activity (`TODO(owner)`: cite ACSM / Sawka 2007).
- Plus a **hot-climate** note, given as a qualitative increase with no invented number unless it can be cited.

**Output**
- Total water and water from drinks.
- Units: oz, L, 8-oz cups, 250 mL glasses, 500 mL bottles.

**Tracker**
- Tap to log drinks. Stored in localStorage (try/catch), resets daily, with a clear button.
- No reminders that need the network. In-tab reminders are optional.

**Safety**
- Overhydration and hyponatremia risk, especially during long endurance events.
- People with kidney, heart or liver disease, or on fluid restrictions, should follow their clinician.
- Thirst and urine colour are general guides (cite).

**What competitors cover (of 4)**

| Section | Pages (of 4) |
|---|:---:|
| Cited NASEM | 3 |
| Weight-based | 3 |
| Range output | **0** |
| Total vs drinks | 2 |
| Tracker | **0** |
| Climate | **0** (explicit) |
| Clinical reviewer | 2 |

---

## 6. FAQ question bank

★ = asked on 2+ pages or a cluster keyword. Map to the 7-keyword cluster.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How much water should I drink a day? | all · `how much water to drink a day calculator` |
| 2 | ★ How many ounces of water should I drink a day? | `how many oz water should you drink a day`, `how many ounces of water should i drink per day` |
| 3 | ★ How many cups of water a day? | `how many cups of water a day` (9,900) |
| 4 | ★ How many liters of water a day? | `how many liters of water should drink in a day` |
| 5 | Does food and other drinks count? | Calc.co.nz, Omni |
| 6 | How much more water when exercising or in heat? | Inch, GIGA |
| 7 | Is the "8 glasses a day" rule true? | search snippet |
| 8 | Can you drink too much water? | Omni, GIGA |
| 9 | How many cups are in a water bottle? | `how many cups are in water bottle` |
| 10 | How do I know if I'm drinking enough? | Calc.co.nz |

---

## 7. Gaps nobody fills — our opportunities

1. **Range-first, cited estimate:** the NASEM baseline next to a weight-based method, plus exercise and heat, with each method explained.
2. **Total vs drinks**, in oz, L, cups and **bottles** (`how many cups are in water bottle`).
3. **Pregnancy and lactation AI values**, cited.
4. **A local daily tracker** that stays in the browser.
5. **Safety content:** overhydration, medical conditions, thirst and urine colour, all cited.
6. **Honest framing:** AI is a population average, not a prescription, which fixes Omni's error. Myth-checking "8 × 8".
7. **YMYL safeguards:** a reviewer, a health-specific disclaimer, no finance boilerplate.
8. **Links:** Water Weight (#18), Cooking Measurement (#8), TDEE (#20), Calories Burned Walking (#23).

---

## 8. Blueprint for the KKCTools Water Intake Calculator

### 8.1 SEO

- **URL:** `/water-intake-calculator/`
- **Title:** Water Intake Calculator – How Much to Drink
- **H1:** Water Intake Calculator: How Much Water Should You Drink a Day?
- **Meta:** as in the keyword file (160 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Inputs | Sex, age band, weight, exercise minutes, hot climate toggle, pregnancy/lactation |
| Outputs | Range (low–high) total and from drinks; oz, L, cups, 500 mL bottles |
| Baseline | NASEM AI shown + cited |
| Tracker | Local log (cups/bottles), daily reset, clear |
| Safety | Disclaimer, conditions note, overhydration note, reviewer |
| UX | Units, share URL (no personal data), no network |

### 8.3 Content outline (≈ 1,100–1,400 words, original, reviewed)

1. Intro (primary keyword), the range answer, and a disclaimer
2. How to use
3. Official guidance (NASEM) and what "adequate intake" means
4. Adjusting for body weight, exercise and heat (cited)
5. Water from food vs drinks
6. Pregnancy and breastfeeding (cited)
7. Signs you are drinking enough, and the risks of too much
8. Using the tracker
9. FAQ (10)
10. Related tools: Water Weight (#18), Cooking Measurement (#8), TDEE (#20)

### 8.4 Quality checks

- **Unit tests:**
  - each method
  - range assembly
  - unit conversions (1 US fl oz = 29.5735 mL)
  - tracker storage with no storage available
  - pregnancy values
- **Reviewer sign-off** (YMYL).
- No competitor wording copied. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - pull Google top 10
  - check Mayo Clinic manually
  - verify the NASEM/EFSA values and the exercise allowance source
  - name a reviewer
