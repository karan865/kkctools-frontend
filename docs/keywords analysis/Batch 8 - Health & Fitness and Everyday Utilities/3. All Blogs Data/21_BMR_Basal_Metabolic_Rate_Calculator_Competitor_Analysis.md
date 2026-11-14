# BMR Calculator (Basal Metabolic Rate) — Competitor Analysis

> **Target page:** KKCTools `/bmr-calculator/` (Batch 8, Tool #21 🟡, **YMYL health tool**)
> **Primary keyword:** `metabolic rate calculator` — US 9,900 · KD 0.
> - Secondary: `basal metabolic rate calculator` (18,100 / KD 3).
> - Cluster: 2 keywords, 28,000 US searches.
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 8. Competitors come from a live web search on 2026-11-14 for `basal metabolic rate calculator`, plus the known leader Calculator.net.
> - Other results seen but not audited: Zava (UK pharmacy), Superdrug Online Doctor (UK pharmacy), PlanetCalc, Fitpass (India), GIGAcalculator, Pearson, mytecbits, buildingclub.
> - `TODO(owner): pull Google top 10 for "basal metabolic rate calculator" and "bmr calculator".` If one page ranks for both BMR and TDEE terms, **merge into the TDEE page (#20)**, as the keyword file notes.
> **Pages visited (2026-11-14):** 5 read: Calculator.net (BMR), Omni (BMR), Inch (BMR), Topend Sports (BMR equations), MacroFactor (BMR).

---

## 0. How this was collected (read first)

- **Who ranks:**
  - General calculator sites: Calculator.net, Omni, Inch, GIGAcalculator.
  - A sports-science reference site: Topend Sports.
  - **App lead-gen:** MacroFactor.
  - **UK online pharmacies:** Zava, Superdrug.
  - Education: Pearson.
- **The engine is shared with the TDEE tool (#20).** This page targets a different intent: "what is my BMR, and how do the formulas differ".
- **Equations verified against the pages and standard published values:**

| Equation | Men | Women |
|---|---|---|
| Harris-Benedict original (1918/1919) | 66.473 + 13.7516·kg + 5.0033·cm − **6.755**·age | 655.0955 + 9.5634·kg + 1.8496·cm − 4.6756·age |
| Revised HB (Roza & Shizgal 1984) | 88.362 + 13.397·kg + 4.799·cm − 5.677·age | 447.593 + 9.247·kg + 3.098·cm − 4.330·age |
| Mifflin-St Jeor (1990) | 10·kg + 6.25·cm − 5·age + 5 | 10·kg + 6.25·cm − 5·age − 161 |
| Katch-McArdle | 370 + 21.6·LBM (kg) | same |
| Cunningham (1980) | 500 + 22·LBM (kg) | same |
| Schofield (WHO/FAO 1985) | age-banded, **MJ/day** in the original (× 239.006 for kcal) | age-banded |

- `TODO(owner)`: cite the original papers and the WHO/FAO/UNU 1985 report. Have a reviewer verify every coefficient before launch.
- **Errors found (re-checked by us):**
  - **Inch:**
    - The original Harris-Benedict men's age coefficient is printed as **6.775**; it should be **6.755**.
    - The LBM formula is printed as "weight × 100 − body fat % / 100" (garbled); it should be weight × (100 − BF%) / 100.
    - Its closing sentence lists 3 formulas while the tool offers 5.
    - Its LBM estimate equations are unsourced.
  - **Topend Sports:**
    - A **second equation labelled "Mifflin" (13.75 / 5 / 6.76 / +66 and 9.56 / 1.85 / 4.68 / +655) is actually the original Harris-Benedict, rounded.** It is mislabelled.
    - The Schofield coefficients are shown in MJ/day next to a kcal calculator, with no conversion stated.
    - Its activity labels conflict between the FAQ and the table.
    - Its "never below BMR" vs "BMR × 1.2" floors conflict.
  - **Calculator.net:**
    - It presents Katch-McArdle as BMR while its text says the equation gives resting energy expenditure.
    - It defines F as "%", which must be a fraction. This is the same error as on its calorie page (#20).
    - Unsourced claims: "aerobic exercise has no effect on BMR", "7% per 1.36 °F".
    - Its sample result has no inputs shown.
  - **Omni:**
    - It dates HB to 1919 but cites the 1918 PNAS paper.
    - The McArdle citation year is inconsistent (2001 vs 1991).
    - It calls Katch "the third known equation" while offering 5.
    - Its FAQ says "about 1,400" for a computed 1,384.
  - **MacroFactor:**
    - It says Cunningham is "erroneously called Katch-McArdle" without a citation. They are **different equations** (500 + 22·LBM vs 370 + 21.6·LBM).
    - It doesn't explain BMR vs RMR.
    - Its "better for everyone" accuracy claims have no on-page data.
    - Raw template placeholders appear in the cookie text.
- **Examples re-checked:**
  - Calculator.net: 1,605 × 1.2 / 1.375 / 1.465 / 1.55 / 1.725 / 1.9 = 1,926 / 2,207 / 2,351 / 2,488 / 2,769 / 3,050 ✔.
  - Omni's man (60 y, 162.56 cm, 68.04 kg) = 1,401.4 ✔; woman (25 y, 172.72 cm, 59.87 kg) = 1,392.2 ✔.
- **YMYL:** disclaimer, reviewer, no health claims. `TODO(owner)`.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | calculator.net/bmr-calculator.html | General calc site | BMR Calculator | 800–900 |
| 2 | omnicalculator.com/health/bmr | Calc site | BMR Calculator (Basal Metabolic Rate, Mifflin St Jeor Equation) | 2,400–2,600 |
| 3 | inchcalculator.com/bmr-calculator/ | Calc site | BMR Calculator – Basal Metabolic Rate | ~1,000 |
| 4 | topendsports.com/weight-loss/calculators/bmr-equations.htm | Sports-science reference | BMR Calculator – Calculate Your Basal Metabolic Rate (Athlete Edition) | 1,500–2,000 |
| 5 | macrofactor.com/bmr-calculator/ | Nutrition app lead-gen | How many calories does your body burn at rest? | ~1,700 |

**What this tells us:**
- **Calculator.net**:
  - 3 equations, a kcal/kJ toggle, and a **6-level activity table** (multipliers 1.2 → 1.9, checked ✔).
  - One cited study (Johnstone 2005, on what drives BMR variation).
  - **Missing:** an FAQ and an example with inputs. It also has the Katch terminology issue.
- **Omni** has the most text:
  - 5-formula selector, 2 correct worked examples, 4 FAQs, an MD creator and a disclaimer ✔.
  - **Weak points:** citation inconsistencies, and it only explains 3 of its 5 formulas.
- **Inch** has the best credentials: a DO/NASM author, RDN and DC reviewers, and 8 references with DOIs.
  - **But:** a coefficient typo, a garbled LBM formula, no example, no FAQ and no disclaimer.
- **Topend Sports** is the only page with **Schofield tables**.
  - **But:** a mislabelled "Mifflin" equation, no MJ→kcal note, conflicting floors, and no example.
- **MacroFactor** gives a **point estimate plus a plausible range**, and explains adaptation and athlete effects.
  - Its maths is hidden behind links, and it has no author, FAQ or example.
- **No page offers all of these:**
  1. **all major equations side by side** (Mifflin, revised HB, original HB, Katch-McArdle, Cunningham, Schofield) with **every coefficient correct and cited**
  2. **the spread between them** shown as a range, with a plain explanation of why they differ
  3. a clear **BMR vs RMR vs TDEE** explanation, with a link to TDEE (#20) via activity factors
  4. Katch and Cunningham done right (LBM from body fat, a fraction), linked to Body Fat (#19)
  5. a worked example with inputs, an FAQ, a disclaimer, a reviewer and a date
  6. kcal and kJ output

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Calculator.net | Omni | Inch | Topend Sports | MacroFactor |
|---|---|---|---|---|---|
| Mifflin-St Jeor | ✅ | ✅ | ✅ | ✅ (+ **mislabelled copy**) | ⚠️ (base for own) |
| Revised Harris-Benedict | ✅ | ✅ (unexplained) | ✅ | ⚠️ (unclear version) | ❌ |
| Original Harris-Benedict | ❌ | ✅ | ✅ (**typo**) | ✅ (as "Mifflin") | ❌ |
| Katch-McArdle | ✅ (**F as %**) | ✅ | ✅ (**garbled LBM**) | ❌ | ❌ (Cunningham) |
| Cunningham | ❌ | ❌ | ❌ | ❌ | ✅ |
| Schofield | ❌ | ✅ (unexplained) | ✅ (unexplained) | ✅ (**MJ**) | ⚠️ (Oxford/Henry) |
| All equations at once | ❌ | ❌ | ❌ | ⚠️ (text) | ❌ |
| Range / uncertainty | ❌ | ❌ | ❌ | ❌ | ✅ |
| Activity table → TDEE | ✅ (6 levels) | ⚠️ | ✅ | ✅ | ❌ |
| kJ output | ✅ | ❌ | ❌ | ❌ | ❌ |
| Units (st, ft/in) | ✅ | ✅ | ✅ (+ st) | ✅ | ? |

---

## 3. Feature matrix — content and trust

| Item | Calculator.net | Omni | Inch | Topend Sports | MacroFactor |
|---|---|---|---|---|---|
| All printed coefficients correct | ⚠️ (Katch F) | ✅ (Mifflin only printed) | ❌ (**6.775**, LBM) | ❌ (**mislabel**, MJ) | n/a (hidden) |
| Worked example with inputs | ❌ | ✅ (2 + FAQ) | ❌ | ❌ | ❌ |
| BMR vs RMR explained | ⚠️ | ⚠️ | ⚠️ (muddled) | ⚠️ | ❌ |
| Primary sources cited | ⚠️ (1) | ✅ (inconsistent) | ✅ (8) | ✅ (7) | ⚠️ (2) |
| Medical disclaimer | ❌ | ✅ | ❌ | ⚠️ | ❌ |
| Qualified author / reviewer | ❌ | ✅ (MD) | ✅ (DO + RDN) | ⚠️ | ❌ |
| Date | ❌ | ❌ | ❌ | ❌ | ❌ |
| FAQ | 0 | 4 | 0 | ✅ | 0 |
| Promotion | ads | — | — | ads | **app trials** |

---

## 4. Competitor-by-competitor detail

### 1. Calculator.net: BMR Calculator
- **Features:** age 15–80; US and metric; Calories/kJ; Mifflin, revised HB and Katch (body fat link); a 6-level activity table.
- **Errors:**
  - Katch is presented as BMR while the text calls it REE.
  - F is defined as %.
  - Unsourced claims (weather, starvation "30%", "aerobic no effect").
  - Wording ("more elderly and limber").
  - The "other units" tab is undocumented.
- **Weak points:** no FAQ; no example inputs.

### 2. Omni: BMR Calculator (Kacper Pawlik, MD; Mateusz Mucha)
- **Features:** 5 formulas, 2 worked examples ✔, 4 FAQs, a disclaimer ✔, an editorial policy link.
- **Errors:**
  - 1919 vs the 1918 paper.
  - McArdle 2001 vs 1991.
  - "Third known equation".
  - "About 1,400" vs 1,384.
  - The pregnancy statement is a simplification with no source.
  - "Food digestions".

### 3. Inch Calculator: BMR (Holly Smith, DO; reviewers Elise Harlow, MS, RDN, and Donna Schwontkowski, DC)
- **Features:** 5 formulas, optional body fat, st units, an activity table, share/embed, 8 references.
- **Errors:**
  - HB men age coefficient **6.775 → 6.755**.
  - **The LBM formula is garbled.**
  - The formula list is inconsistent.
  - Unsourced LBM estimates and "5% overestimate" claim.
  - Feedback block duplicated.
  - BMR/RMR definitions blur.
- **Weak points:** no example, FAQ, disclaimer or date.

### 4. Topend Sports: BMR Equations (Athlete Edition)
- **Features:** HB (metric and imperial), Mifflin, **Schofield age bands**, an activity table, an FAQ, 7 references.
- **Errors:**
  - A second **"Mifflin" equation that is actually HB**.
  - **Schofield in MJ/day** with no kcal conversion.
  - The FAQ and table activity labels conflict.
  - "6" vs "6–10" kcal per lb of muscle.
  - Conflicting floors.
  - Unsourced athlete claims.
- **Weak points:** no example; placeholder zeros in the output.

### 5. MacroFactor: BMR Calculator
- **Features:**
  - A point estimate plus a range, built on Cunningham and Oxford/Henry with its own adjustments (non-linear, age, athlete, adaptation).
  - Typical ranges given (women ≈1,300–1,600; men ≈1,700–2,100).
- **Errors:** the unsupported "Cunningham ≠ Katch" naming claim; no BMR/RMR explanation; raw `{title}` placeholders; the title and H1 differ.
- **Weak points:** no author, FAQ or example; app-trial CTAs; accuracy claims without data.

---

## 5. Patterns

**Inputs and outputs**
- **Inputs:** sex, age, height, weight (kg/lb/st), and optional body fat % (to enable Katch and Cunningham).
- **Output, primary:** Mifflin-St Jeor (the default).
- **Output, comparison table:** revised HB, original HB, Katch-McArdle, Cunningham and Schofield (age band shown, converted from MJ), each with its kcal and kJ.
- **Range:** min–max across the weight-based equations, plus a note: "Equations can differ from a lab-measured value by roughly ±10% for many adults."
  - `TODO(owner)`: cite a validation review (e.g. Frankenfield et al. 2005).

**Worked example (our arithmetic; the reviewer confirms)**
- Woman, 40 y, 165 cm, 65 kg, 30% body fat → LBM = 45.5 kg.

| Equation | BMR (kcal/day) |
|---|---:|
| Mifflin | 650 + 1,031.25 − 200 − 161 = **1,320** |
| Revised HB | 447.593 + 601.06 + 511.17 − 173.20 = **1,387** |
| Original HB | 655.10 + 621.62 + 305.18 − 187.02 = **1,395** |
| Katch-McArdle | 370 + 21.6 × 45.5 = **1,353** |
| Cunningham | 500 + 22 × 45.5 = **1,501** |

- The spread is 1,320–1,501 kcal (≈ 14%). This illustrates why we show a range.

**BMR → TDEE**
- Show the activity table (1.2 / 1.375 / 1.55 / 1.725 / 1.9) and link to #20 for goals.
- Don't duplicate the goal table on this page.

**Coverage across the 5 competitors**

| Section | Pages (of 5) |
|---|:---:|
| ≥ 5 equations available | 3 |
| Every printed coefficient correct | 1–2 |
| All equations side by side | **0** |
| Range / spread shown | 1 |
| Worked example with inputs | 1 |
| Disclaimer + reviewer | 1 |
| kJ | 1 |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword. All answers must be reviewed by a qualified person.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is basal metabolic rate (BMR)? | all; `basal metabolic rate calculator` |
| 2 | ★ How is BMR calculated? | Omni, Inch, Topend |
| 3 | ★ Which BMR formula is most accurate? | Omni, Topend, MacroFactor |
| 4 | ★ What is the difference between BMR, RMR and TDEE? | Inch, Calculator.net |
| 5 | What is a normal BMR for a woman or a man? | MacroFactor (ranges) |
| 6 | Do I burn calories while sleeping? | Omni |
| 7 | Does BMR change with age? | Omni, Calculator.net |
| 8 | Can I increase my BMR? | Calculator.net (cite; no claims) |
| 9 | Should I eat less than my BMR? | Topend (careful, reviewed) |
| 10 | Why do the formulas give different numbers? | gap |

---

## 7. Gaps nobody fills — our opportunities

1. **Every equation side by side, all coefficients correct and cited.** Three of five competitors have a coefficient or labelling error.
2. **A range and a plain explanation of the spread**, with a worked 5-equation example.
3. **Correct LBM handling** for Katch and Cunningham, with the two kept distinct.
4. **Schofield converted properly** (MJ → kcal), with the age band shown.
5. **A clear BMR vs RMR vs TDEE section** and a link to TDEE (#20) for goals, without duplicating it.
6. **YMYL trust:** a disclaimer, a reviewer, a date and an FAQ.
7. **kJ output** for non-US users.
8. **Links:** TDEE (#20), Macro (#22), Body Fat (#19), BMI (#24), Ideal Weight (#12).

---

## 8. Blueprint for the KKCTools BMR Calculator

### 8.1 SEO

- **URL:** `/bmr-calculator/`
- **Title:** BMR Calculator – Basal Metabolic Rate
- **H1:** BMR Calculator: Your Basal Metabolic Rate in Calories
- **Meta:** as in the keyword file (151 chars).
- **H2s:**
  - "BMR formulas compared"
  - "BMR vs RMR vs TDEE"
  - "From BMR to daily calories"
  - "Why the formulas differ"
- **Schema:** `WebApplication` + `FAQPage`.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Inputs | Sex, age (18–80), height, weight (kg/lb/st), optional body fat % |
| Outputs | Mifflin (primary), comparison table of 5–6 equations (kcal + kJ), range bar, activity table → TDEE link |
| Validation | Body fat as % input converted to fraction internally; ranges; under-18 notice |
| Engine | Shared with #20/#22/#25 |
| UX | Share URL, copy, no network |

### 8.3 Content outline (≈ 1,100–1,400 words, original, reviewed)

1. Intro and calculator, with the disclaimer
2. What BMR is (and RMR, and TDEE)
3. The formulas: all printed and cited, with when each is used
4. Worked example (5 equations) and why they differ
5. From BMR to daily calories (activity table → TDEE tool)
6. What affects BMR (age, sex, body size, lean mass; cited)
7. FAQ (10)
8. Sources, reviewer and date, then related tools

### 8.4 Quality checks

- **Unit tests:**
  - Every equation against our worked example and Omni's published examples (1,401.4 / 1,392.2).
  - Schofield bands and the MJ conversion.
  - LBM fraction handling.
  - Units.
- No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)` (blocking for launch):**
  - Pull Google top 10 and decide on merging with #20.
  - Cite every original paper and WHO/FAO/UNU 1985.
  - Cite a validation review.
  - Get a qualified reviewer, with name and date.
