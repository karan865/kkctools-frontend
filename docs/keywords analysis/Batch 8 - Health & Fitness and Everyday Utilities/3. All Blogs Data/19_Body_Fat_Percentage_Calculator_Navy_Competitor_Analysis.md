# Body Fat Percentage Calculator (Navy Method) — Competitor Analysis

> **Target page:** KKCTools `/body-fat-calculator/` (Batch 8, Tool #19 🟡, **YMYL health tool**)
> **Primary keyword:** `fat percentage calculator` — US 9,900 · KD 8 · CPC $0.46.
> - Cluster: 19 keywords, 74,900 US searches.
> - 18 long-tail body-fat / Navy-method phrases (65,000), e.g. `body fat percentage men` (8,100 / KD 10), `15 body fat`, `navy body fat calculator`, `10 body fat`, `15 body fat male`, `good fat percentage for males`.
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 8. Competitors come from a live web search on 2026-11-14 for `navy body fat calculator`, plus the known general leader Calculator.net.
> - Other results seen but not audited: Operation Military Kids ("2026 standards"), fedratecalc ("BCA Step 1 and Step 2"), coachway, mytecbits, calcplanet, rippedbody, metricgate, mycalcbuddy, guyru.github.io, and a csc.com subdomain page (possible parasite).
> - `TODO(owner): pull Google top 10 for "fat percentage calculator", "body fat percentage men" and "navy body fat calculator".`
> **Pages visited (2026-11-14):** 5 read: Calculator.net (Body Fat), Inch Calculator (Navy), Omni (Navy), Fitness Volt (US Navy), Bony to Beastly (Navy).

---

## 0. How this was collected (read first)

- **Who ranks:**
  - General calculator sites: Calculator.net, Inch, Omni.
  - Fitness publishers: Fitness Volt, Bony to Beastly, RippedBody.
  - Military-audience sites: Operation Military Kids, fedratecalc.
- **The Navy (Hodgdon & Beckett, 1984) equations are identical on every page that shows them.** We checked:
  - **Imperial, men:** BF% = 86.010·log₁₀(waist − neck) − 70.041·log₁₀(height) + 36.76
  - **Imperial, women:** BF% = 163.205·log₁₀(waist + hip − neck) − 97.684·log₁₀(height) − 78.387
  - **Metric (cm), men:** BF% = 495 / (1.0324 − 0.19077·log₁₀(waist − neck) + 0.15456·log₁₀(height)) − 450
  - **Metric (cm), women:** BF% = 495 / (1.29579 − 0.35004·log₁₀(waist + hip − neck) + 0.22100·log₁₀(height)) − 450
- **The imperial and metric forms give slightly different results for the same body.**
  - Omni's example (72 in, waist 40.2, neck 15.2) gives **26.8%** with the metric form and **26.9%** with the imperial form (our arithmetic).
  - No competitor mentions this.
  - We will pick **one canonical form** (the one in the cited Navy document), convert units to it, and note the ±0.1–0.2 point difference.
  - `TODO(owner)`: confirm which form the current Navy guide specifies.
- **Examples re-checked by us:**
  - Inch's sample (70 in, waist 34, neck 15) = **17.5%** ✔.
  - Fitness Volt's (70 in, waist 32, neck 14, 142 lb) = **15.5%**, fat mass 22.0 lb ✔.
  - Calculator.net's (15.7% of 70 kg) = 11.0 kg fat mass ✔.
- **Category charts: sources differ, and most aren't cited properly.**
  - The ACE categories (Essential / Athletes / Fitness / Average / Obese) are the most common.
  - Calculator.net also shows a "Jackson & Pollock ideal by age" table, credited only in a heading.
  - Its own text gives different "healthy" ranges (men 8–19%, women 21–33%), which match **Gallagher et al. 2000** (AJCN, a peer-reviewed age- and sex-specific source), but it doesn't cite that paper.
  - The keyword file asks for a chart **by age and sex with a cited source**.
  - **Recommended:** Gallagher et al. 2000 for age and sex, plus ACE as a simple secondary table, both cited.
  - `TODO(owner)`: approve the sources, then have a qualified reviewer confirm the numbers.
- **Military standards are moving.**
  - Fitness Volt claims a 2026 Navy process with a waist-to-height screen (≈0.55) before the tape test, and limits of 26%/36%. Inch shows age-based maximums (men 22–26%, women 33–36%) citing Navy Guide 4 (2023).
  - We **will not publish military pass/fail limits on this page.** We link to the Army ABCP tool (#9) and say "check your current service instruction".
  - `TODO(owner)`: verify the current Navy (and DoD) policy before any military wording.
- **YMYL:** show "estimate, not medical advice", cite the formula source, make no health claims, and get a qualified reviewer before launch. `TODO(owner)`.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | calculator.net/body-fat-calculator.html | General calc site | Body Fat Calculator | 1,200–1,400 |
| 2 | inchcalculator.com/navy-body-fat-calculator/ | Calc site | Navy Body Fat Calculator | ~900 |
| 3 | omnicalculator.com/health/navy-body-fat | Calc site | Navy Body Fat Calculator | ~650 |
| 4 | fitnessvolt.com/body-fat-navy-calculator/ | Fitness publisher | Body Fat US Navy Calculator | ~2,500 |
| 5 | bonytobeastly.com/navy-body-fat-calculator/ | Fitness coaching brand | The Navy Body Fat Percentage Calculator / H1 Body-Fat Percentage Calculator | ~1,000 |

**What this tells us:**
- **Calculator.net is the head-term benchmark for `fat percentage calculator`:**
  - The Navy method **plus** a BMI-based method (Deurenberg; not attributed).
  - Fat mass and lean mass.
  - ACE categories and a Jackson & Pollock "ideal by age" table.
  - "Fat to lose to reach ideal".
  - **Weak points:**
    - Citations are mostly names without links.
    - Its healthy ranges conflict with the ACE table.
    - It uses "abdomen" vs "waist" inconsistently.
    - It describes subcutaneous fat as "deep under the dermis", which is wrong.
    - It has an empty "other units" tab and no FAQ.
- **Inch has the best Navy sourcing:**
  - Navy Guide 4 (2023), NAVADMIN 178-15, OPNAVINST 6110.1K, and a study.
  - A dietitian (RDN) and a Navy officer as reviewers.
  - **Missing:** an example, an FAQ and a disclaimer. Typo: "naval" for "navel".
- **Omni**:
  - An MD author, a correct example, a disclaimer ✔, and 4 FAQs.
  - **Problems:** no accuracy figures, source numbering starts at 3, and "6 similar calculators" lists only 3.
- **Fitness Volt has the most features:**
  - Navy, YMCA, Jackson-Pollock 3/4/7 skinfold and BMI methods, with a side-by-side comparison.
  - Fat and lean mass, typical error, and the ACE category.
  - **Problems:**
    - **Contradictory waist instructions for women** (narrowest point vs navel).
    - Unverified 2026 Navy claims.
    - No disclaimer.
    - Heavy newsletter and pop-up promotion.
- **Bony to Beastly**:
  - It has two waist fields with no explanation, and no formula, output description or categories.
  - Its accuracy claims ("3–4%", "DEXA off by 8%") are unsourced.
  - Heavy programme promotion.
- **No page offers all of these:**
  1. a correct Navy formula with **one canonical unit form**, shown with a worked example
  2. **an age- and sex-specific category chart with a citation** (Gallagher 2000), plus ACE, clearly separated
  3. fat mass and lean mass, and the visitor's position on a bar
  4. a **measuring guide with an SVG** (neck below the larynx; waist at the navel for men; women's waist **as specified by the cited source**; hips at the widest point), with consistent wording
  5. an honest accuracy section with a cited error range, and when *not* to trust it (very lean, very muscular, pregnancy, under 18)
  6. a YMYL disclaimer, a named qualified reviewer and a review date
  7. a **clear separation from military pass/fail** standards

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Calculator.net | Inch | Omni | Fitness Volt | Bony to Beastly |
|---|---|---|---|---|---|
| Navy method | ✅ | ✅ | ✅ | ✅ | ✅ |
| Imperial + metric | ✅ | ✅ | ✅ | ✅ | ✅ |
| Hip input for women | ✅ | ✅ | ⚠️ (not listed) | ✅ | ✅ |
| Other methods (BMI / skinfold) | ✅ (BMI) | ❌ | ❌ | ✅ (YMCA, JP 3/4/7, BMI) | ❌ |
| Fat mass / lean mass | ✅ | ❌ | ❌ | ✅ | ❌ |
| Category shown for result | ✅ (ACE) | ⚠️ (Navy max) | ⚠️ | ✅ (ACE) | ❌ |
| Age-based chart | ✅ (J&P, weakly cited) | ⚠️ (Navy maxima) | ❌ | ❌ | ❌ |
| Fat to lose to reach a target | ✅ | ❌ | ❌ | ❌ | ❌ |
| Typical error shown | ❌ | ❌ | ❌ | ✅ | ⚠️ (unsourced) |
| Measuring diagram | ⚠️ | ⚠️ (text) | ⚠️ (text) | ✅ (image) | ⚠️ |
| Military standard check | ❌ | ✅ | ⚠️ | ✅ (2026 claims) | ❌ |
| Share / embed | ✅ | ✅ | ✅ | ✅ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Calculator.net | Inch | Omni | Fitness Volt | Bony to Beastly |
|---|---|---|---|---|---|
| Formula shown and correct | ✅ | ✅ | ✅ (metric) | ✅ | ❌ (not shown) |
| Worked example | ✅ | ❌ | ✅ | ✅ | ❌ |
| Formula source cited | ⚠️ (named) | ✅ | ✅ | ✅ (DOI) | ⚠️ (named) |
| Category chart source cited | ⚠️ (names only) | ✅ (Navy) | ⚠️ | ⚠️ (archived ACE) | ❌ |
| Consistent measuring instructions | ⚠️ (abdomen/waist) | ✅ | ✅ | ❌ (**women's waist**) | ❌ (**2 waist fields**) |
| Accuracy figure cited | ❌ | ❌ | ❌ | ⚠️ | ❌ (unsourced) |
| Medical disclaimer | ⚠️ | ❌ | ✅ | ❌ | ⚠️ (footer) |
| Qualified author / reviewer | ❌ | ✅ (RDN + LT) | ✅ (MD) | ✅ (ACE; reviewer in schema only) | ✅ (BHSc) |
| FAQ | 0 | 0 | 4 | 0 | 0 |
| Factual errors | 2 | 1 typo | 1 | 1 | several |
| Promotion | ads | — | — | **heavy** | **heavy** |

---

## 4. Competitor-by-competitor detail

### 1. Calculator.net: Body Fat Calculator
- **Features:**
  - Navy method (Hodgdon & Beckett 1984) and a BMI method (adult and child equations; Deurenberg form, not attributed).
  - Fat mass and lean mass.
  - ACE table and a Jackson & Pollock ideal-by-age table (ages 20–55).
  - Fat to lose.
  - A linked Navy PDF.
- **Checked ✔:** 15.7% × 70 kg = 11.0 kg fat mass; 10.5% ideal → 3.6 kg to lose.
- **Errors:**
  - "Subcutaneous fat … deep under the dermis".
  - The text's healthy ranges vs the ACE table.
  - "Abdomen" vs "waist".
  - The child-equation age range isn't stated.
  - An unlinked WHO statistic.
  - Broken formula layout.
  - An empty tab.

### 2. Inch Calculator: Navy Body Fat (Joe Sexton; reviewers Elise Harlow, MS, RDN, and LT Lisa Swanson)
- **Features:** inputs including age; imperial/metric; maximum-allowed table by age (men 22–26%, women 33–36%); measuring instructions from Guide 4; 4 references.
- **Checked:** our sample (70 / 34 / 15) gives 17.5% ✔.
- **Errors and gaps:**
  - "Naval" for "navel".
  - The table attribution is inconsistent.
  - The cm → in conversion is not explained.
  - No example, FAQ or disclaimer.

### 3. Omni: Navy Body Fat (Małgorzata Koperska, MD)
- **Features:** metric formulas, a measuring guide, an example (72 in / 40.2 / 15.2 → 26.8% ✔ with the metric form), 4 FAQs, and a disclaimer ✔.
- **Weak points:**
  - Hip input isn't listed.
  - Accuracy isn't quantified.
  - Source numbering starts at 3.
  - "6 similar calculators" lists 3.
  - A "650 found helpful" counter.

### 4. Fitness Volt: Body Fat US Navy Calculator (Matthew Magnante, ACE)
- **Features:**
  - 6 methods, with fat and lean mass, typical error, ACE category and a method comparison.
  - Example (70 / 32 / 14, 142 lb → 15.5%) ✔.
  - Sources: Hodgdon & Beckett, Brozek 1963, ACE (archived).
- **Errors:**
  - Women's waist: narrowest point vs navel.
  - A "fat-to-lean ratio" is promised but not shown.
  - Unverified 2026 Navy WHtR and limit claims.
  - Truncated or duplicated JSON-LD.
  - "6–13.9%" vs "6–13%".
- **Weak points:** no disclaimer; heavy newsletter, pop-up and share-bar promotion.

### 5. Bony to Beastly (Marco Walker-Ng, BHSc)
- **Features:** unit toggle, sex, height, neck, **two waist fields** (navel and narrowest), hip.
- **Weak points:**
  - No formula, output description, categories or example.
  - Unsourced accuracy claims.
  - The title and H1 differ.
  - Typos ("assthetics").
  - Heavy programme, course and app promotion.

---

## 5. Patterns

**Formula and inputs**
- Use the canonical Navy equations (the form in the cited Navy guide).
- Inputs: sex, height, neck, waist, and hip (women).
- Weight is optional, for fat and lean mass. Age is optional, for the age-based chart.
- Validation:
  - waist > neck (men)
  - waist + hip > neck (women)
  - sensible ranges
  - a warning when the result is < 3% or > 50%
- **Rounding:** show one decimal place. Don't imply precision beyond ±1 point.

**Measuring guide (SVG, our own drawing)**
- **Neck:** just below the larynx, tape sloping slightly down to the front.
- **Waist, men:** at the navel. **Waist, women:** as stated in the cited Navy guide.
  - Several pages disagree here. `TODO(owner)`: confirm against the current guide.
- **Hip:** the widest point of the buttocks.
- **Height:** barefoot.
- Measure 2–3 times and average. Same time of day, relaxed, not sucking in.

**Category tables (cited; reviewed)**
- **Primary: age and sex**, from Gallagher et al. (2000), *Am J Clin Nutr* 72:694–701. It gives the body-fat ranges matching BMI 18.5 / 25 / 30 for ages 20–39, 40–59 and 60–79, split by sex and ethnicity.
  - `TODO(owner)`: obtain and transcribe the exact values from the paper (do not copy them from competitors); the reviewer signs off.
- **Secondary: ACE categories** (not age-based). `TODO(owner)`: cite the ACE page directly.
- No invented "ideal" numbers.

**Outputs**
- BF%.
- Fat mass and lean mass (if weight is given).
- The category under each table.
- Position marker on a bar.
- A "what this means" note with neutral wording and no health claims.

**Accuracy section**
- Tape methods are estimates. Cite a validation study for the typical error (SEE).
- Less reliable for very muscular or very lean people, during pregnancy, and for under-18s; the tool is not for under-18s.
- For tracking, use the same tape, the same person and the same conditions.
- `TODO(owner)`: choose and cite the validation reference.

**Coverage across the 5 competitors**

| Section | Pages (of 5) |
|---|:---:|
| Correct formula shown | 4 |
| Worked example | 3 |
| Age/sex chart with proper citation | **0** |
| Consistent measuring guidance | 2–3 |
| Cited accuracy range | **0** |
| Disclaimer | 1–2 |
| Fat/lean mass | 2 |
| FAQ ≥ 5 | **0** |
| Military limits clearly separated | **0** |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword. All answers must be reviewed by a qualified person.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is a good body fat percentage for men (and for women)? | `body fat percentage men`, `good fat percentage for males` |
| 2 | ★ How accurate is the Navy body fat method? | Omni, Bony to Beastly, Fitness Volt |
| 3 | ★ How do I measure my neck, waist and hips correctly? | all |
| 4 | ★ What does 10%, 15% or 20% body fat look like? | `10 body fat`, `15 body fat`, `15 body fat male`; answer with ranges, **no photos of real people** |
| 5 | How is the Navy formula calculated? | Calculator.net, Inch |
| 6 | Why do women need a hip measurement? | Omni FAQ |
| 7 | Is body fat percentage better than BMI? | Bony to Beastly, Omni (cite a source) |
| 8 | Does age change what a healthy body fat is? | Calculator.net (Gallagher chart) |
| 9 | What are the Navy or Army body fat limits? | Inch, Fitness Volt; link to #9, no numbers |
| 10 | How often should I measure? | gap |
| 11 | Is this calculator suitable for teenagers? | gap (no) |

---

## 7. Gaps nobody fills — our opportunities

1. **An age- and sex-specific chart properly cited** (Gallagher 2000), with ACE as a clearly labelled secondary table.
2. **One canonical formula form** with a worked example, and an explanation of the small metric/imperial difference.
3. **Consistent, source-based measuring instructions** with our own SVG. Two competitors contradict themselves.
4. **An honest, cited accuracy section**, including when not to use the tool.
5. **YMYL trust:** a disclaimer, a qualified reviewer and a review date. No competitor has all three.
6. **Fat and lean mass**, plus a neutral "difference to the top of the healthy range" figure with no weight-loss promises.
7. **Military separation:** no pass/fail on this page; link to the Army ABCP tool (#9).
8. **An answer to the "10% / 15% body fat" intent** with text ranges, no stock photos and no body shaming.
9. **Links:** Army Body Fat (#9), BMI (#24), FFMI (#26), Ideal Weight (#12), TDEE (#20).

---

## 8. Blueprint for the KKCTools Body Fat Calculator

### 8.1 SEO

- **URL:** `/body-fat-calculator/`
- **Title:** Body Fat Calculator – Navy Tape Method
- **H1:** Body Fat Calculator: Estimate Body Fat With a Tape Measure
- **Meta:** as in the keyword file (155 chars).
- **H2s:**
  - "Body fat percentage chart for men and women"
  - "How to measure"
  - "How the Navy method works"
  - "How accurate is it?"
  - "What 10%, 15% and 20% body fat mean"
- **Schema:** `WebApplication` + `FAQPage`. **No `MedicalWebPage` claims and no ratings.**

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Inputs | Sex, units (in/cm), height, neck, waist, hip (women), optional weight, optional age |
| Validation | Logical checks, ranges, age ≥ 18 notice |
| Outputs | BF % (1 dp), fat mass, lean mass, category per cited table, bar marker |
| Charts | Gallagher 2000 by age/sex (reviewed) + ACE (secondary) |
| Guide | Measuring SVG with steps; "measure 3× and average" helper (3 inputs per site → mean) |
| Trust | Disclaimer above result, sources list, reviewer + date |
| UX | Share URL (no measurements stored server-side; none exists), no network |

### 8.3 Content outline (≈ 1,300–1,600 words, original, reviewed)

1. Intro and calculator, with the disclaimer
2. How to measure (SVG)
3. How the Navy method works (formula, worked example, cited)
4. Body fat chart by age and sex (cited)
5. What different body fat levels mean (neutral text)
6. How accurate it is, and who shouldn't rely on it
7. Body fat vs BMI (cited)
8. Military body fat standards (link to #9 only)
9. FAQ (11)
10. Sources and reviewer, then related tools

### 8.4 Quality checks

- **Unit tests:**
  - Four formula forms against hand-worked fixtures (the 17.5%, 15.5% and 26.8% examples above).
  - Unit conversion.
  - Validation errors.
  - Chart lookup boundaries.
- No competitor wording or tables. `npm run check:no-network` passes.
- **`TODO(owner)` (blocking for launch):**
  - Pull Google top 10.
  - Approve and transcribe the Gallagher 2000 and ACE sources.
  - Choose the accuracy-validation citation.
  - Confirm the women's waist site and the canonical formula form from the current Navy guide.
  - Get a qualified reviewer (RD/MD/CSCS), with name and date.
