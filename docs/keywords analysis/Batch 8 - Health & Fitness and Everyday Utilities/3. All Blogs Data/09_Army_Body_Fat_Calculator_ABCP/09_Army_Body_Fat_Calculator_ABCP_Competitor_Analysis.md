# Army Body Fat Calculator (ABCP) — Competitor Analysis

> **Target page:** KKCTools `/army-body-fat-calculator/` (Batch 8, Tool #9 ✅ — **⚠ regulatory risk, see §0**)
> **Primary keyword:** `army calculator for body fat` — US 12,100 · **KD 1** (cluster 13 keywords, 91,580 US vol, incl. `army pt body fat calculator` 12,100 and Marine/height-weight queries)
> **SERP source:** ⚠ No Semrush SERP export for Batch 8. Competitors from live web searches (2026-11-14): `army body fat calculator one site tape abdomen 2023 directive`, `army one-site tape test formula … coefficients`. `TODO(owner): pull Google top 10.`
> **Pages visited:** 2026-11-14 — 4 read (army.mil AD 2023-11 news article, GIGAcalculator, BodySpec guide, DoD HPRC "How the military measures body composition").

---

## 0. How this was collected (read first) — **critical**

- **Official sources:**
  - **Army Directive 2023-11** (Jun 2023) introduced a **one-site abdominal tape test** for all soldiers.
  - The multi-site method was allowed for confirmation for 12 more months.
  - The one-site test became the only tape method by 2024.
  - **AD 2023-08:** soldiers are exempt with an ACFT score ≥ 540 and ≥ 80 points per event.
  - The governing regulation is **AR 600-9**. The official calculator is the ABCP page at armyresilience.army.mil.
- **⚠ The one-site formula coefficients are NOT verified anywhere we read.**
  - The army.mil article gives no formula. BodySpec gives no coefficients.
  - One search snippet admits the Army doesn't publish them "in a fully independent, citable form".
  - Other pages disagree on the inputs. Some say height is used for men; others say only weight and abdomen.
  - **We must not invent a formula.**
  - `TODO(owner)`: get the formula and the pass tables from AD 2023-11 / AR 600-9 (or the official ABCP calculator documentation) before building. If they aren't public, the tool can only offer the **legacy multi-site (DoDI 1308.3) method, clearly labelled "legacy"**, plus a link to the official calculator.
- **⚠ Possible new change:** DoD HPRC (updated Jul 2026) says that from **Jan 1, 2026 "the military uses the waist-to-height ratio (WHtR) method"**, citing a Jan 12, 2026 memo and a pending DoDI 1308.03 revision.
  - Its own Army section still describes tape tests, so the page is inconsistent.
  - `TODO(owner)`: **verify the current Army standard (AR 600-9 edition, any WHtR directive) before any build.**
  - The keyword file asks for a re-check every 6 months.
- **Legacy formula (seen consistently, attributed to DoDI 1308.3):**
  - Male: %BF = 86.010·log₁₀(waist − neck) − 70.041·log₁₀(height) + 36.76
  - Female: %BF = 163.205·log₁₀(waist + hip − neck) − 97.684·log₁₀(height) − 78.387 (inches)
  - `TODO(owner)`: verify these against the primary DoDI text.
- **YMYL (keyword file):**
  - Show "estimate, not medical advice". Cite the formula source.
  - Never invent health claims.
  - **A qualified reviewer is needed before launch.** `TODO(owner)`.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | army.mil/article/267486 (AD 2023-11 news) | **Official Army** | Army publishes new body fat assessment guidance | news |
| 2 | gigacalculator.com/calculators/army-body-fat-calculator.php | Calc site | Army Body Fat Calculator (New Tape Test) | 1,500–1,800 |
| 3 | bodyspec.com/blog/…/army_body_fat_calculator_guide… | DEXA-scan company blog | Army Body Fat Calculator: Guide to the New One-Site Tape Test | 1,200–1,400 |
| 4 | hprc-online.org/…/how-military-measures-body-composition | **DoD HPRC (authority)** | How the military measures body composition | reference |

**What this tells us:**
- **GIGA** has both methods: one-site (2023) and multi-site (legacy). It shows the **legacy formulas**, AR 40-501 join tables and AR 600-9 retention tables, and 5 sources.
  - It lists **no thresholds for the one-site test**.
  - It has no height/weight screening table and no Marine mode.
  - Its dates conflict (updated 2025, claims "valid 2026").
- **BodySpec** covers one-site inputs (sex, age, weight, abdomen) and a **max BF% table** (17–20: 20/30 %; 21–27: 22/32 %; 28–39: 24/34 %; 40+: 26/36 %, cited to AR 600-9 Table B-2). It also has good measuring instructions and ACFT exemption details.
  - **No formula.**
  - The directive is cited through an unofficial mirror.
  - Its DEXA promotion isn't disclosed.
- **HPRC** is the authority for every branch, but it is **internally inconsistent on WHtR in 2026**.
- **No page does all of these:**
  - a verified current formula
  - the current standards table with **edition and date**
  - a screening table
  - a Marine Corps mode
  - a legacy toggle
  - a how-to-measure SVG
  - a clear YMYL disclaimer
  - a "last checked" date

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | army.mil | GIGA | BodySpec | HPRC |
|---|---|---|---|---|
| One-site (abdomen) method | ✅ (described) | ✅ (formula unverified) | ✅ (no formula) | ✅ (described) |
| Formula / coefficients published | ❌ | ⚠️ (legacy only) | ❌ | ❌ |
| Legacy multi-site method | ✅ (transition) | ✅ | ⚠️ (mentioned) | ✅ |
| Standards by age & sex (max BF %) | ❌ | ✅ (2019 tables) | ✅ (AR 600-9 B-2, undated) | ⚠️ (reference) |
| Pass / fail vs standard | ❌ | ⚠️ ("how far over") | ⚠️ (claimed) | n/a |
| Height / weight screening table | ❌ | ❌ | ❌ | ❌ |
| ACFT 540 exemption | ⚠️ (separate article) | ❌ | ✅ | ❌ |
| Marine Corps mode | ❌ | ❌ | ❌ | ✅ (described) |
| Supplementary tests (DEXA / BIA / ADP) | ❌ | ❌ | ✅ (promoted) | ✅ |
| How-to-measure guide | ❌ | ⚠️ | ✅ | ❌ |
| WHtR (2026?) | ❌ | ❌ | ❌ | ⚠️ (stated, inconsistent) |

---

## 3. Feature matrix — content and trust

| Item | army.mil | GIGA | BodySpec | HPRC |
|---|---|---|---|---|
| Official sources cited | ✅ | ✅ (5 refs, one mis-tag) | ⚠️ (mirror) | ✅ |
| Date / currency | ✅ (Jun 2023) | ⚠️ (conflicting) | ✅ (Oct 2025) | ✅ (updated Jul 2026, inconsistent) |
| Disclaimer | n/a | ✅ | ✅ | n/a |
| Errors | — | "three measurements" lists four; citation mis-tag; wrong tool name | duplicate H1; DA form labels conflict | WHtR vs tape inconsistency |
| Commercial bias | — | — | DEXA sales | — |

---

## 4. Competitor-by-competitor detail

### 1. army.mil — Army publishes new body fat assessment guidance (Jun 2023)
- **Covers:**
  - AD 2023-11: one-site tape test plus a calculation model for all soldiers.
  - Multi-site allowed for confirmation for 12 months.
  - The ABCP program page.
- **Missing:** no formula, standards or site detail in the article.

### 2. GIGAcalculator — Army Body Fat Calculator (Georgi Georgiev; "updated Mar 2025")
- **Inputs:**
  - New method: sex, age, weight, abdomen.
  - Old method: height, neck, waist, hip.
- **Content:** legacy formulas (US and metric constants), AR 40-501 and AR 600-9 tables, DoD goals of 18 % (men) and 26 % (women), 5 references.
- **Errors:**
  - Date conflicts.
  - Says "replaces three measurements" but lists four.
  - Reference [2] is mis-tagged.
  - Refers to an "Army height and weight calculator" that isn't on the page.
  - **No thresholds for the new test.**

### 3. BodySpec — Army Body Fat Calculator guide (Oct 2025)
- **Covers:**
  - One-site inputs; no height needed.
  - A measuring procedure: take two readings, and a third if they differ.
  - A max BF % table (AR 600-9 Table B-2, edition not given).
  - ACFT exemption details: 540 points, ≥ 80 per event, revalidation within 8 or 14 months.
- **Weak points:**
  - No formula.
  - Directive cited via an unofficial mirror.
  - Duplicate H1.
  - Conflicting DA form labels.
  - **DEXA upsell** without disclosure.

### 4. DoD HPRC — How the military measures body composition (May 2023, updated Jul 2026)
- **Per branch:**
  - Army: AD 2023-11 one-site test, AR 600-9, supplementary DEXA / BIA / ADP.
  - Marines: tape as a secondary method, confirmed by DEXA/BIA (MCO 6110, MARADMIN 066/26).
  - Navy: OPNAVINST 6110.1L.
  - Air Force: DAFMAN 36-2905.
- **Says:** "as of Jan 1, 2026 the military uses WHtR".
  - **This conflicts with its own Army section.** It must be verified.

---

## 5. Patterns

**Only build from verified official sources.**
- **Current Army method:** use the one-site formula and pass tables from AD 2023-11 / AR 600-9 (current edition). `TODO(owner)` must supply these. If they are unavailable, ship the **legacy DoDI 1308.3 method, labelled "legacy, for reference"**, plus a prominent link to the official ABCP calculator.
- **WHtR:** if DoD has moved to WHtR (2026 memo), add a WHtR mode: waist ÷ height, compared with the official threshold. `TODO(owner)`: verify.

**Other modes**
- **Screening:** the height/weight screening table from AR 600-9, only if it is current and reproducible. `TODO(owner)`.
- **Marine Corps mode:** MCO 6110 method and standards, cited. `TODO(owner)`.

**Content and disclaimers**
- **How to measure:** an SVG we draw (navel level, tape level, relaxed exhale, repeat readings).
- **Output:** estimated BF %, the limit for the soldier's age and sex, the margin, and an **"estimate, not an official assessment"** banner. Include a "last checked against AR 600-9 on <date>" stamp.
- **ACFT exemption** (AD 2023-08): explain it, cited.

**What competitors cover**

| Section | Pages (of 4) |
|---|:---:|
| Current method described | 4 |
| Current formula published | **0** |
| Standards with edition/date | **0** (one undated) |
| Screening table | **0** |
| Marine mode | **0** (tool) |
| How-to-measure | 1 |
| WHtR | 1 (uncertain) |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword. Map to the 13-keyword cluster.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How does the Army calculate body fat now (one-site tape)? | all · `army body fat calculator`, `calculate body fat army` |
| 2 | ★ What are the Army body fat standards by age and sex? | GIGA, BodySpec |
| 3 | ★ How do I measure my abdomen for the tape test? | BodySpec |
| 4 | ★ What is the ACFT 540 body-fat exemption? | BodySpec, army.mil |
| 5 | What is the Army height and weight standard? | `army height and weight calculator` |
| 6 | What happens if I fail the tape test (DEXA / BIA / ADP)? | HPRC, BodySpec |
| 7 | How is the Marine Corps body fat test different? | HPRC · Marine queries |
| 8 | What was the old multi-site method? | GIGA |
| 9 | Is the tape test accurate? | army.mil (science article) |
| 10 | Is this an official Army result? | — (no; disclaimer) |

---

## 7. Gaps nobody fills — our opportunities

1. **A verified current formula and standards**, with the source edition and a "last checked" date. Nobody publishes this cleanly.
2. **Method selector:** current one-site, legacy multi-site, and WHtR (if adopted), each labelled with its status.
3. **Height/weight screening and Marine Corps modes**, each cited.
4. **A how-to-measure SVG** and repeat-reading guidance.
5. **Pass/fail with the margin**, plus an "estimate, not official" banner and a link to the official ABCP calculator.
6. **No commercial bias:** no DEXA upsell. Supplementary tests are explained neutrally.
7. **YMYL safeguards:** qualified reviewer, citations, 6-month re-check (keyword file).
8. **Links:** Body Fat Navy (#19), BMI (#24), Ideal Weight (#12).

---

## 8. Blueprint for the KKCTools Army Body Fat Calculator

### 8.1 SEO

- **URL:** `/army-body-fat-calculator/`
- **Title:** Army Body Fat Calculator – ABCP Standards
- **H1:** Army Body Fat Calculator: Check the ABCP Body Fat Standard
- **Meta:** as in the keyword file (152 chars). Adjust if the method changes to WHtR.

### 8.2 Calculator spec (**blocked until owner supplies the official formula and tables**)

| Area | Spec |
|---|---|
| Methods | Current Army (per AR 600-9 / AD 2023-11) · Legacy multi-site (DoDI 1308.3, labelled) · WHtR (if official) · Marine Corps (MCO 6110) |
| Inputs | Sex, age, weight, abdomen (+ height/neck/hip for legacy), units in/cm, lb/kg |
| Outputs | Estimated BF %, age-sex limit, pass/fail margin, screening result |
| Content | Measure SVG, ACFT exemption, supplementary tests |
| Data | Static file with regulation, edition, date, checkedOn |
| Safety | "Estimate, not official / not medical advice" banner; official calculator link |

### 8.3 Content outline (≈ 1,100–1,400 words, original, reviewed)

1. Intro (primary keyword) and status banner
2. How to use
3. How the Army measures body fat today (cited)
4. How to take the abdominal measurement (SVG)
5. Army body fat standards by age and sex (cited table)
6. Height and weight screening
7. ACFT exemption and supplementary tests
8. Marine Corps standards
9. Legacy multi-site method (for reference)
10. FAQ (10)
11. Related tools: Body Fat Navy (#19), BMI (#24), Ideal Weight (#12)

### 8.4 Quality checks

- **Unit tests:** against official worked examples or calculator outputs (`TODO(owner)`), for each method, plus unit conversions.
- **Reviewer sign-off** before launch (YMYL).
- No competitor wording. `npm run check:no-network` passes.
- `TODO(owner)`:
  - **Verify the current Army method** (one-site vs WHtR 2026).
  - **Supply the official formula and tables.**
  - Choose a qualified reviewer.
  - Set the 6-month re-check.
  - Pull Google top 10.
