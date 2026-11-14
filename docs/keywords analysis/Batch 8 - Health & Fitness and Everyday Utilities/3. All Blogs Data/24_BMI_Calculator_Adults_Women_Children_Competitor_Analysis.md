# BMI Calculator (Adults, Women, Children) — Competitor Analysis

> **Target page:** KKCTools `/bmi-calculator/` (Batch 8, Tool #24 🟡, **YMYL health tool**)
> **Primary keyword:** `body mass index calculator for adults` — US 18,100 · KD 9 · rising.
> - Cluster: 27 keywords, 246,500 US searches.
> - Long tail (26 phrases, 228,400): `how to calculate bmi` (135,000 / KD 18, rising), `bmi cal` (8,100 / KD 0), `bmi calculator kg with age` (6,600 / KD 0), `bmi index chart for females`, `what does bmi stand for`, `calculation of body mass index`.
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 8. Competitors come from a live web search on 2026-11-14 for `bmi calculator adults kg with age`, plus the known government and calculator leaders (CDC adult and child calculators, NHLBI, Calculator.net, Omni).
> - Other results seen but not audited: CalculatorSoup, calcplanet, MedicineNet, size.ly, several pages.dev / vercel clones.
> - A spammy page whose title exactly matched the query was also seen. It is not audited.
> - `TODO(owner): pull Google top 10 for "bmi calculator", "how to calculate bmi" and "body mass index calculator for adults".`
> **Pages visited (2026-11-14):** 5 read: CDC Adult BMI Calculator, CDC Child & Teen BMI Calculator, NHLBI "Calculate Your BMI", Calculator.net (BMI), Omni (BMI).

---

## 0. How this was collected (read first)

- **Who ranks:**
  - **US government:** CDC adult and child calculators, NHLBI.
  - Big calculator sites: Calculator.net, Omni, CalculatorSoup.
  - Health publishers: MedicineNet.
  - Many thin clones.
  - The keyword file marks this 🟡 for that reason.
- **The adult formula is universal:**
  - BMI = kg ÷ m², or **703 × lb ÷ in²**.
  - Adult categories (WHO, used by CDC/NIH) are the **same for men and women and for all adult ages**:
    - < 18.5 underweight
    - 18.5–24.9 healthy
    - 25–29.9 overweight
    - ≥ 30 obesity: class 1 30–34.9, class 2 35–39.9, class 3 ≥ 40
  - So `bmi index chart for females` and `bmi calculator kg with age` need an **explanation**, not different adult numbers.
- **Children and teens (ages 2–19) use BMI-for-age percentiles by sex (CDC):**
  - < 5th percentile underweight
  - 5th to < 85th healthy
  - 85th to < 95th overweight
  - ≥ 95th obesity
  - **Severe obesity:** ≥ 120% of the 95th percentile, or BMI ≥ 35.
  - **The keyword file requires public CDC growth-chart data bundled in the page.**
    - The CDC 2000 growth-chart LMS tables are US government data.
    - CDC also published **extended BMI-for-age charts (2022)** for values above the 97th percentile.
    - `TODO(owner)`: confirm which CDC dataset the current CDC calculator uses, download the official LMS/extended tables, and verify our percentile code against CDC's results for ≥ 20 test cases.
- **Other populations (cite; reviewer approves):**
  - WHO expert consultation (*Lancet* 2004) gives lower **public-health action points for Asian populations (23 and 27.5)**. NICE (UK) uses lower thresholds for South Asian, Chinese, Black African and African-Caribbean adults.
  - This matters for our IST/India audience.
  - Older adults: interpretation differs, and the evidence is debated.
  - Pregnancy: BMI is not for use during pregnancy.
  - `TODO(owner)`: cite and decide wording.
- **Errors found (re-checked by us):**
  - **Omni:**
    - Its ranges overlap: "obesity 30–35" and "severe obesity 35 and over". It also has no WHO class split.
    - Its source numbering starts at 3.
    - "6 similar calculators" lists only 3.
  - **Calculator.net:**
    - It says anemia is a "lowered ability to carry blood vessels"; it should be oxygen.
    - It says BMI is "intended to quantify tissue mass".
    - Its BMI Prime boundary is inconsistent (> 1.2 vs ≥ 1.2).
    - Superscripts are lost (70² shown as "702").
    - Its arithmetic is ✔ (160 lb / 70 in = 23.0).
  - **CDC adult page:**
    - Before calculating, it shows "BMI is 0" and "Class 0, also called Severe Obesity".
    - A duplicated paragraph.
    - Share text from another page ("Living with High Blood Pressure").
    - "https://https://" in the syndication URL.
    - Two different dates.
  - **CDC child page:** template fragments ("ataboveless than"), a broken sentence, and the same wrong share text.
  - **NHLBI:**
    - Category names duplicated ("Underweight Underweight").
    - A stray script fragment.
    - No formula, sources or obesity classes.
- **YMYL:** "screening measure, not a diagnosis", the formula cited, no health claims, and a qualified reviewer. `TODO(owner)`.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | cdc.gov/bmi/adult-calculator/ | US government | Adult BMI Calculator | 650–700 |
| 2 | cdc.gov/bmi/child-teen-calculator/ | US government | Child and Teen BMI Calculator | (tool + text) |
| 3 | nhlbi.nih.gov/…/bmicalc.htm | US government | Calculate Your BMI | ~230 |
| 4 | calculator.net/bmi-calculator.html | General calc site | BMI Calculator | ~1,700 |
| 5 | omnicalculator.com/health/bmi | Calc site | BMI Calculator – Body Mass Index | ~900 |

**What this tells us:**
- **CDC is the authority:**
  - US and metric units, validation, obesity classes, a Spanish version, print and embed, ages 20+.
  - **The child calculator gives the full percentile treatment:** age in months or by birth date, sex, percentile, percent of the 95th, and a growth-chart plot.
  - **Weak points:**
    - No formula on the page.
    - Placeholder "Class 0 severe obesity".
    - Template and share-text bugs.
    - Only generic limitations (no muscle, pregnancy or ethnicity notes).
- **NHLBI** is minimal: 4 categories, no classes, no formula, no sources, and duplicated labels.
- **Calculator.net has the most features:**
  - age 2–120 and sex
  - BMI Prime, Ponderal Index and a **healthy weight range for your height**
  - WHO adult table and CDC child table
  - a thorough limitations section
  - **Weak points:** two medical-wording errors, unclear child-percentile output, and no FAQ.
- **Omni** has an MD author, a disclaimer, BMI Prime, a correct example and limitations.
  - **Weak points:** overlapping ranges, no classes, and children and women handled only by links to other pages.
- **No page offers all of these:**
  1. **adult BMI + child/teen percentile on one page**, switched automatically by age
  2. **the formula shown with a worked example** in both unit systems (`how to calculate bmi`, 135k)
  3. WHO classes **and** the cited Asian/ethnicity action points as an option
  4. a healthy weight range for your height, plus BMI Prime
  5. a **clear "women and men use the same adult chart" explanation** (`bmi index chart for females`) and a "does age matter" explanation
  6. a limitations section covering muscle, age, pregnancy and ethnicity
  7. a correct, bug-free result display (no "Class 0" placeholders)

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | CDC adult | CDC child | NHLBI | Calculator.net | Omni |
|---|---|---|---|---|---|
| Imperial + metric | ✅ | ✅ | ✅ | ✅ (+ other) | ✅ |
| Adult category | ✅ | n/a | ✅ | ✅ | ✅ (**overlap**) |
| Obesity classes 1–3 | ✅ | n/a | ❌ | ✅ | ❌ |
| Child percentile (2–19) | ❌ (link) | ✅ | ❌ | ⚠️ (table; output unclear) | ❌ (link) |
| Severe-obesity (120% of p95) | n/a | ✅ | n/a | ❌ | n/a |
| Growth-chart plot | n/a | ✅ | n/a | ⚠️ (links) | n/a |
| Healthy weight range for height | ❌ | n/a | ❌ | ✅ | ❌ |
| BMI Prime | ❌ | n/a | ❌ | ✅ | ✅ |
| Ponderal index | ❌ | n/a | ❌ | ✅ | ❌ |
| Asian / ethnicity cut-offs | ❌ | n/a | ❌ | ❌ | ❌ |
| Formula on page | ❌ | ❌ | ❌ | ✅ | ✅ |
| Print / share / embed | ✅ | ✅ | ❌ | ❌ | ✅ |

---

## 3. Feature matrix — content and trust

| Item | CDC adult | CDC child | NHLBI | Calculator.net | Omni |
|---|---|---|---|---|---|
| Ranges correct and non-overlapping | ✅ | ✅ | ✅ | ✅ | ❌ |
| Worked example | ❌ | ❌ | ❌ | ✅ | ✅ |
| Limitations covered | ⚠️ (generic) | ⚠️ | ⚠️ | ✅ | ✅ |
| Pregnancy / ethnicity notes | ❌ | ❌ | ❌ | ⚠️ | ❌ |
| "Screening, not diagnosis" | ✅ | ✅ | ⚠️ | ⚠️ | ✅ |
| Medical wording errors | 0 | 0 | 0 | **2** | 0 |
| UI / template bugs | **yes** | **yes** | **yes** | superscripts | — |
| Sources | ⚠️ (agency) | ⚠️ | ❌ | ✅ (WHO/CDC) | ⚠️ (2, misnumbered) |
| FAQ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Named author / reviewer | agency | agency | agency | ❌ | ✅ (MD) |
| Date | ✅ (conflicting) | ✅ | ❌ | ❌ | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. CDC Adult BMI Calculator
- **Features:** US/metric, validation ranges (3–9 ft; 55–1,000 lb), BMI + category + classes 1–3, Spanish version, print/share/iframe, adults 20+.
- **Weak points:**
  - No formula on the page.
  - "BMI is 0 / Class 0, also called Severe Obesity" shown before calculating.
  - A duplicated paragraph and run-together words.
  - Wrong social share text; "https://https://".
  - Conflicting dates.
  - Only generic limitations.

### 2. CDC Child & Teen BMI Calculator
- **Features:**
  - Age in years and months, months (24–239) or dates; sex.
  - BMI, percentile, category, % of p95, and a growth-chart plot.
  - Cut-offs at the 5th / 85th / 95th percentiles and severe ≥ 120% of p95 or BMI ≥ 35.
  - Rounding note.
- **Weak points:**
  - The data edition isn't named.
  - Template fragments, a broken sentence, and wrong share text.
- **Takeaway:** our percentile engine must reproduce its results. We cite CDC as the source.

### 3. NHLBI: Calculate Your BMI
- **Features:** a standard/metric toggle, a 4-category scale, adults only, and a note on muscle and bone.
- **Weak points:**
  - No formula, sources or classes.
  - Duplicated labels and a script fragment.
  - About 230 words.

### 4. Calculator.net: BMI Calculator
- **Features:**
  - Age 2–120, sex, US/metric/other units.
  - BMI Prime, Ponderal Index, healthy weight range.
  - WHO and CDC tables, formulas, and thorough limitations.
- **Checked ✔:** 160 lb / 70 in = 22.96; Ponderal 12.9; sample range consistent.
- **Errors:**
  - Anemia "carry blood vessels".
  - BMI "quantifies tissue mass".
  - BMI Prime 1.2 boundary.
  - Lost superscripts.
  - Says it accounts for age but doesn't explain how.
- **Weak points:** no FAQ; the child output is unclear.

### 5. Omni: BMI Calculator (Aleksandra Zając, MD)
- **Features:** sex, height, weight → BMI + BMI Prime; limitations; FAQ; disclaimer ✔; links to kids, women and geriatric variants.
- **Checked ✔:** 75 kg / 1.80 m = 23.15.
- **Errors:**
  - 30–35 / 35+ overlap; no classes.
  - Source numbering starts at 3.
  - "6 similar" lists 3.
- **Weak points:** children, women and Asian cut-offs are not on this page.

---

## 5. Patterns

**Adult**
- BMI = kg ÷ m², or 703 × lb ÷ in².
- Show **1 decimal**. Categories are based on the **rounded-to-1-dp** value, matching CDC practice.
  - `TODO(owner)`: confirm CDC's rounding.
- WHO/CDC categories with classes 1–3.
- **Optional "Asian action points" view (23 / 27.5)**, cited to WHO 2004, with neutral wording.
- **Healthy weight range for height** = 18.5 × m² to 24.9 × m², in kg and lb.
- **BMI Prime** = BMI ÷ 25.

**Worked example (our arithmetic)**
- 5′9″ (69 in), 170 lb → 703 × 170 ÷ 4,761 = **25.1** (overweight).
- In metric: 175.3 cm, 77.1 kg → 77.1 ÷ 1.7526² = 25.1 ✔.
- Healthy range for 1.7526 m: 56.8–76.5 kg (125–169 lb).

**Child / teen (2–19)**
- **Inputs:** sex, and age from date of birth plus measurement date, or years + months (in months, to one decimal place).
- **Percentile from the CDC LMS method:**
  - Z = ((BMI/M)^L − 1) / (L·S); if L = 0, Z = ln(BMI/M)/S.
  - Percentile = Φ(Z).
  - Interpolate L, M and S between half-month ages.
  - Above the 95th percentile, use CDC's extended method if it is adopted.
- **Outputs:** percentile, category, % of the 95th percentile, and a growth-curve SVG (our own drawing from the data).
- **Data:** bundled JSON of the official CDC tables (public domain), roughly 2 × 220 rows.

**Limitations box**
- Not a measure of body fat (link to Body Fat #19).
- Muscle mass (athletes).
- Older adults.
- Pregnancy (don't use).
- Ethnicity (cite).
- Children: percentiles only.
- "Talk to a healthcare professional."

**Coverage across the 5 competitors**

| Section | Pages (of 5) |
|---|:---:|
| Adult + child on one page | 1 (Calculator.net, partial) |
| Formula + worked example | 2 |
| Obesity classes | 2 |
| Asian / ethnicity option | **0** |
| Healthy weight range | 1 |
| Women/age explanation for adults | 1 (Omni FAQ) |
| Bug-free display | 2 |
| FAQ | 1 |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword. All answers must be reviewed by a qualified person.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How do I calculate BMI? | `how to calculate bmi` (135k), `calculation of body mass index` |
| 2 | ★ What is a healthy BMI for adults? | all |
| 3 | ★ Is the BMI chart different for women? | `bmi index chart for females` |
| 4 | ★ Does age change my BMI result? | `bmi calculator kg with age`, Omni FAQ |
| 5 | ★ How is BMI worked out for children and teens? | CDC child, Calculator.net |
| 6 | What does BMI stand for? | `what does bmi stand for` |
| 7 | What are the limitations of BMI? | Calculator.net, Omni, NHLBI |
| 8 | What weight range is healthy for my height? | Calculator.net |
| 9 | Are BMI cut-offs different for Asian people? | gap (WHO 2004, cited) |
| 10 | What is BMI Prime? | Calculator.net, Omni |
| 11 | Can I use BMI during pregnancy? | gap (no) |

---

## 7. Gaps nobody fills — our opportunities

1. **Adult and child on one page.** Age switches the method automatically, and the percentile engine is verified against CDC.
2. **The formula plus a worked example** in both unit systems, for the 135k `how to calculate bmi` query.
3. **Clear answers on women and age:** the same adult chart, explained.
4. **Asian/ethnicity action points** as a cited option. None of the competitors offer this.
5. **Healthy weight range + BMI Prime + obesity classes** together.
6. **A thorough, neutral limitations box** that links to Body Fat (#19).
7. **A bug-free, accessible result** (no "Class 0" placeholders), with a clear table and a growth-curve SVG.
8. **YMYL:** a screening disclaimer, a reviewer and a date.
9. **Links:** Body Fat (#19), Ideal Weight (#12), TDEE (#20), Weight Loss Date (#25), FFMI (#26).

---

## 8. Blueprint for the KKCTools BMI Calculator

### 8.1 SEO

- **URL:** `/bmi-calculator/`
- **Title:** BMI Calculator – Adults, Women and Children
- **H1:** BMI Calculator: Body Mass Index for Adults and Children
- **Meta:** as in the keyword file (140 chars).
- **H2s:**
  - "How to calculate BMI"
  - "BMI chart for adults (men and women)"
  - "BMI for children and teens"
  - "Healthy weight for your height"
  - "Limits of BMI"
- **Schema:** `WebApplication` + `FAQPage`.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Inputs | Units; height (ft/in or cm); weight (lb or kg); age (or DOB) and sex (needed for under 20) |
| Adult output | BMI (1 dp), category + class, healthy range for height, BMI Prime; optional Asian action points |
| Child output | Percentile, category, % of 95th, growth-curve SVG |
| Validation | Ranges; pregnancy notice; age < 2 not supported |
| Data | Bundled CDC LMS tables (verified) |
| UX | Share URL, print, accessible table, no network |

### 8.3 Content outline (≈ 1,300–1,600 words, original, reviewed)

1. Intro and calculator, with the screening disclaimer
2. How to calculate BMI (formula, imperial and metric worked examples)
3. Adult BMI chart (WHO/CDC categories and classes) and why it is the same for women and men
4. Does age matter? (adults vs children)
5. BMI for children and teens (percentiles explained, cited to CDC)
6. Healthy weight for your height (table by height)
7. BMI for Asian and other populations (cited)
8. Limits of BMI
9. FAQ (11)
10. Sources, reviewer and date, then related tools

### 8.4 Quality checks

- **Unit tests:**
  - Adult maths and the category boundaries (18.49 / 18.5 / 24.9 / 25.0 / 29.9 / 30.0 / 40.0).
  - Healthy range.
  - **Child percentiles vs the CDC calculator for ≥ 20 cases** (fixtures recorded by the owner).
  - LMS edge cases (L ≈ 0).
  - Age-in-months maths.
- No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)` (blocking for launch):**
  - Pull Google top 10.
  - Download and verify the CDC LMS/extended data and licence notes.
  - Record CDC fixtures.
  - Cite WHO 2004 and NICE for the ethnicity thresholds.
  - Confirm the rounding rule.
  - Get a qualified reviewer, with name and date.
