# FFMI Calculator (Fat-Free Mass Index) — Competitor Analysis

> **Target page:** KKCTools `/ffmi-calculator/` (Batch 8, Tool #26 🟡, health/fitness)
> **Primary keyword:** `ffmi calculator` — US 14,800 · KD 23 · CPC $1.16.
> - Support: `ffmi` (6,600 / KD 28), as a definition H2.
> - Cluster: 2 keywords, 21,400 US searches. **None are on KD ≤ 15**, so this page needs links.
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 8. Competitors come from a live web search on 2026-11-14 for `ffmi calculator normalized fat free mass index`.
> - Other results seen but not audited: Visual Paradigm, cznull, muscleevo, Bony to Beastly, goodcalculators, calcplanet, Naked Nutrition, totalcalchub, Topend Sports (DEXA), prommer.net, mycalcbuddy, and many pages.dev clones.
> - **Blocked (HTTP 403):** Legion Athletics, Menno Henselmans. `TODO(owner)`: review these manually; both are strong fitness brands.
> - `TODO(owner): pull Google top 10 for "ffmi calculator" and "ffmi".`
> **Pages visited (2026-11-14):** 5 read: Inch (FFMI), DQYDJ (FFMI), Omni (FFMI), BodySpec (FFMI blog), GetFitCraft (FFMI). 2 blocked: Legion, Menno Henselmans.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Calculator sites: Inch, Omni, DQYDJ.
  - **Evidence-based fitness brands:** Legion, Menno Henselmans (both blocked), GetFitCraft.
  - A DEXA company: BodySpec.
  - Many templated clones.
- **The formulas are agreed:**
  - FFM = weight × (1 − BF).
  - **FFMI** = FFM (kg) ÷ height (m)².
  - **Normalized FFMI** = FFMI + **6.1** × (1.8 − height in m). This is the Kouri et al. 1995 adjustment.
  - **Coefficient inconsistency:** Inch uses 6.1 in its metric formula and **6.3** in its imperial one. BodySpec uses 6.3 and attributes it to Kouri.
    - GetFitCraft notes the difference is < 0.1 point between 5′0″ and 6′6″.
  - **We will use 6.1 and cite Kouri 1995.** `TODO(owner)`: verify the coefficient in the original paper.
  - **Normalization wording is wrong on two pages.** Omni and Inch say it is "for taller people". It **adds** points for people shorter than 1.8 m and **subtracts** them for taller people.
- **Reference ranges are the weakest part of every page.**
  - Bands overlap (DQYDJ: 20–21 / 21–23; Omni: >28 vs 28–30).
  - Pages disagree with themselves (Omni: women's average 15–17 vs 14–17).
  - Sources are often unclear.
  - **Citable options:**
    - **Kouri et al. 1995:** 74 drug-free men had a maximum normalized FFMI of about 25. This is an athletic context and **a single sample, not a hard limit**; GetFitCraft frames it correctly.
    - **Schutz et al. 2002 (*Int J Obes*):** general-population FFMI percentiles by age and sex.
    - Kyle et al. 2003 and Hull et al. 2011 as references.
  - `TODO(owner)`: transcribe the bands from the primary papers and have a reviewer approve them. **Never copy competitor tables.**
- **Errors found (re-checked by us):**
  - **BodySpec:**
    - Its elite example (185 lb, 5′10″, 8% BF) gives FFMI **24.4**, not 24.8.
    - Its sedentary example (180 lb, 30% BF) gives **18.1**, not 17.3. That value falls in its own "Good" band, not "below average".
    - It says "a 5% body-fat error swings FFMI by 2–3 points"; for 180 lb it is **≈ 1.3 points**.
    - It assigns 22.0 to "Excellent" while its table boundary also suggests "Elite".
  - **Inch:**
    - A missing parenthesis, and 6.1 vs 6.3.
    - Its Ref 4 is misattributed (it cites an *Obesity* BIA paper for a *European Heart Journal* claim).
    - It says there is "no upper FFMI limit for health" (too strong).
  - **DQYDJ:**
    - Overlapping bands.
    - Contradictory statements about body fat.
    - 1.8 m described as "5′11″" (it is 5′10.9″).
    - Dated 2020; empty alt text.
  - **Omni:**
    - The women's average range is inconsistent.
    - The ">28" band overlaps its note.
    - The "taller athletes" wording.
    - Its example is ✔ (75 kg, 22%, 1.80 m → 18.1).
  - **GetFitCraft:**
    - No H1.
    - Band boundary nits (23.8/23.9; 28.0/28.1).
    - A broken disclaimer anchor.
    - Its maths is ✔ throughout.
- **Sensitivity is the key honesty point.**
  - FFMI depends heavily on the body-fat estimate. In our arithmetic, every 1 percentage point of body fat changes FFMI by about 0.26 for a 180 lb, 5′10″ man.
  - The page must show this and link to Body Fat (#19).
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | inchcalculator.com/ffmi-calculator/ | Calc site | FFMI Calculator (Fat-Free Mass Index) | 900–1,000 |
| 2 | dqydj.com/ffmi-calculator/ | Finance/calc blog | FFMI Calculator (Fat-Free Mass Index) | ~1,000 |
| 3 | omnicalculator.com/sports/ffmi | Calc site | FFMI Calculator (Fat-Free Mass Index) | 1,000–1,400 |
| 4 | bodyspec.com/blog/post/ffmi_calculator… | DEXA company blog | FFMI Calculator: Reaching Your Natural Muscle-Building Potential | 1,700–1,900 |
| 5 | getfitcraft.com/tools/ffmi-calculator | Evidence-based fitness tool site | (no H1) Calculate your FFMI and lean body mass | 4,500–5,000 |

**What this tells us:**
- **GetFitCraft is the content benchmark:**
  - FFMI with or without body fat (a **Boer LBM estimate** when body fat is unknown)
  - normalized FFMI and sex-specific bands
  - **25.0 framed as an observation, not a limit**
  - sensitivity worked out (19% → 20.9, 11% → 23.0)
  - many studies, a credentialed author (MS, MPH, CSCS), and an FAQ
  - **Weak points:** no H1, very long (about 5,000 words), formatting artifacts.
- **Omni** covers sex, normalization, men's and women's bands, a correct example, an FAQ and MD/PhD credits.
  - **Weak points:** wrong normalization wording and band inconsistencies.
- **Inch** has correct core formulas, a DO and RDN, and 6 references.
  - **Weak points:** the coefficient mismatch, a misattributed reference, and no FAQ, example or disclaimer.
- **DQYDJ** has historical colour (Mr. America FFMI estimates, which are speculative) and Kouri with a link.
  - **Weak points:** overlapping bands, contradictions, and its age (2020).
- **BodySpec** has the most arithmetic errors, an anonymous author and heavy DEXA promotion.
- **No page offers all of these:**
  1. correct formulas with **6.1** cited and the **correct normalization explanation**
  2. **non-overlapping, cited bands**, with the general-population and athletic contexts **separated**
  3. a **body-fat sensitivity readout** (FFMI at BF ± 3 points) shown live
  4. an option for **no body fat**: estimate LBM with a cited formula (Boer), labelled as low-confidence
  5. a **neutral "natural limit" section**: Kouri's sample maximum (~25) explained, without accusing anyone of steroid use
  6. a worked example with correct arithmetic, plus an FAQ, sources and a disclaimer
  7. a compact page (≈ 1,000–1,300 words), not a 5,000-word wall

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Inch | DQYDJ | Omni | BodySpec | GetFitCraft |
|---|---|---|---|---|---|
| FFMI | ✅ | ✅ | ✅ | ✅ (not rendered) | ✅ |
| Normalized FFMI | ✅ (6.1 / **6.3**) | ✅ (6.1) | ✅ (6.1) | ✅ (**6.3**) | ✅ (both discussed) |
| Fat-free mass + fat mass | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| Sex-specific bands | ⚠️ (ranges) | ✅ (**overlap**) | ✅ (**inconsistent**) | ⚠️ (one table) | ✅ |
| No-body-fat estimate (LBM formula) | ❌ | ❌ | ❌ | ❌ | ✅ (Boer) |
| Sensitivity to body-fat error | ❌ | ❌ | ❌ | ⚠️ (**overstated**) | ✅ |
| Units (lb/kg, in/cm, st) | ✅ | ? | ✅ | ⚠️ | ✅ |
| Link to body-fat estimator | ⚠️ | ⚠️ | ⚠️ | ⚠️ (DEXA) | ✅ |
| Share / embed | ✅ | ❌ | ✅ | ❌ | ⚠️ |

---

## 3. Feature matrix — content and trust

| Item | Inch | DQYDJ | Omni | BodySpec | GetFitCraft |
|---|---|---|---|---|---|
| Formulas correct | ⚠️ (parenthesis, 6.3) | ✅ | ✅ | ⚠️ (6.3) | ✅ |
| Normalization explained correctly | ❌ | ⚠️ | ❌ | ⚠️ | ✅ |
| Bands non-overlapping | ⚠️ | ❌ | ❌ | ⚠️ | ⚠️ (nits) |
| Bands cited to a primary source | ✅ (Kyle 2003) | ⚠️ (Kouri) | ⚠️ | ⚠️ | ✅ |
| Worked example correct | ❌ (none) | ❌ (none) | ✅ | ❌ (**2 errors**) | ✅ |
| "Natural limit" framed carefully | ⚠️ | ⚠️ (speculative) | ⚠️ | ❌ (hype) | ✅ |
| Disclaimer | ❌ | ❌ | ⚠️ | ❌ | ⚠️ (broken anchor) |
| Author / reviewer | ✅ (DO + RDN) | ✅ (PK) | ✅ (MD, PhD) | ❌ (Team) | ✅ (CSCS) |
| Date | ❌ | ✅ (2020) | ❌ | ⚠️ | ✅ |
| FAQ | 0 | 0 | ✅ | ❌ (linked, absent) | ✅ |
| Promotion | — | sidebar | — | **heavy (DEXA)** | 3 CTAs |

---

## 4. Competitor-by-competitor detail

### 1. Inch Calculator: FFMI (Holly Smith, DO; reviewer Elise Harlow, RDN)
- **Features:** height, weight (lb/kg/st), BF% → FFMI, normalized FFMI, FFM, fat mass; share/embed/cite.
- **Our check:** 180 lb, 15%, 70 in → FFMI 21.95; normalized 22.09 ✔.
- **Errors:**
  - Missing parenthesis.
  - **6.1 vs 6.3.**
  - Says normalization is only for tall people.
  - **Ref 4 misattributed.**
  - "No upper limit for health".
  - The table header labels body fat as FFMI.
- **Weak points:** no example, FAQ or disclaimer.

### 2. DQYDJ: FFMI Calculator (PK, 4 Sep 2020)
- **Content:** formulas ✔, Kouri linked, Mr. America FFMI history, the author's own FFMI anecdote.
- **Errors:**
  - Overlapping men's and women's bands.
  - Contradictory body-fat statements.
  - 1.8 m ≈ "5′11″".
  - Empty alt text and typos.
- **Weak points:** the calculator didn't render in capture; no FAQ.

### 3. Omni: FFMI (Filip Derma; Łucja Zaborowska, MD)
- **Features:** sex, height, weight, BF → FFMI, normalized FFMI, FFM, fat mass; men's and women's bands (7 each); FAQ; example (Steve: 18.1 ✔).
- **Errors:**
  - "For taller athletes" (backwards).
  - Women's average 15–17 vs 14–17.
  - ">28" vs the 28–30 note.
  - Source list starts at 3.
- **Weak points:** a third credited person with no credentials.

### 4. BodySpec: FFMI blog (BodySpec Team)
- **Content:** formula (6.3), an example (180 lb, 5′10″, 15% → 22.0 ✔), comparison personas, Kouri sample sizes, muscle-gain rates attributed to Lyle McDonald.
- **Errors:**
  - **Elite 24.4, not 24.8.**
  - **Sedentary 18.1, not 17.3, which mislabels the band.**
  - **The 2–3 point sensitivity claim (≈ 1.3).**
  - Boundary handling.
  - Unsourced "gold standard" and vitamin D claims.
- **Weak points:** no calculator in capture; no FAQ despite the navigation link; heavy DEXA promotion.

### 5. GetFitCraft: FFMI Calculator
- **Features:**
  - With or without BF (Boer), normalized FFMI, sex bands.
  - Sensitivity, an FAQ and many studies (Kouri, Trexler, Magee…).
  - 7 worked rows ✔.
- **Weak points:**
  - No H1; formatting artifacts.
  - Boundary nits.
  - A broken disclaimer anchor and missing speakable class.
  - About 5,000 words.

---

## 5. Patterns

**Formulas**
- FFM (kg) = weight (kg) × (1 − BF/100).
- FFMI = FFM ÷ h².
- **Normalized FFMI** = FFMI + 6.1 × (1.8 − h). Explain: "adjusts to a 1.80 m reference; adds for shorter people, subtracts for taller people".
- **No body fat:**
  - Estimate LBM with Boer (1984):
    - men: 0.407·kg + 0.267·cm − 19.2
    - women: 0.252·kg + 0.473·cm − 48.3
  - Label it "rough estimate; may overstate FFMI in lean muscular people".
  - `TODO(owner)`: cite Boer 1984 and verify the coefficients.

**Worked example (our arithmetic)**
- 180 lb (81.65 kg), 5′10″ (1.778 m), 15% BF.
- FFM = 69.40 kg.
- FFMI = 69.40 ÷ 3.1613 = **21.95**.
- Normalized = 21.95 + 6.1 × 0.022 = **22.09**.
- **Sensitivity:**
  - At 12% BF → FFM 71.85 → FFMI 22.73.
  - At 18% BF → 66.95 → 21.18.
  - So ±3 points of BF ≈ ±0.8 FFMI.

**Bands (to be transcribed from primary sources)**
- **General population, by sex** (Schutz 2002 percentiles, or Kyle 2003 / Hull 2011).
- **Athletic context:** Kouri 1995 reported a sample maximum of about 25 in drug-free men. Later studies (e.g. Trexler) found some athletes above 25.
- Neutral wording: "Very high values are uncommon; they don't prove anything about an individual."
- **Display:** non-overlapping half-open intervals ([a, b)), with the source shown under the table.

**Coverage across the 5 competitors**

| Section | Pages (of 5) |
|---|:---:|
| 6.1 coefficient used consistently | 3 |
| Normalization explained correctly | 1 |
| Non-overlapping, cited bands | **0–1** |
| Live sensitivity readout | **0** (1 static) |
| No-BF estimate | 1 |
| Correct worked example | 2 |
| Neutral natural-limit framing | 1 |
| Disclaimer + FAQ + author + date | **0** |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is FFMI? | `ffmi`, all |
| 2 | ★ How do I calculate FFMI? | Omni, Inch, DQYDJ |
| 3 | ★ What is a good FFMI for men (and for women)? | Omni, DQYDJ, GetFitCraft |
| 4 | ★ What is the natural FFMI limit? | DQYDJ, BodySpec, GetFitCraft |
| 5 | ★ What is normalized FFMI? | all |
| 6 | Why does my FFMI depend so much on body fat? | GetFitCraft, BodySpec |
| 7 | Can I calculate FFMI without knowing my body fat? | GetFitCraft (Boer) |
| 8 | FFMI vs BMI: what's the difference? | gap (link #24) |
| 9 | How fast can FFMI increase? | BodySpec (cite carefully or skip) |
| 10 | Is a high FFMI healthy? | Inch (qualified answer) |

---

## 7. Gaps nobody fills — our opportunities

1. **Correct formulas with one cited coefficient (6.1)**, and normalization explained the right way round.
2. **Non-overlapping bands from primary sources**, with general-population and athletic contexts kept separate.
3. **A live sensitivity readout** (BF ± 3 points), because the result is only as good as the body-fat input.
4. **A no-body-fat option** (Boer) with an honest low-confidence label.
5. **Neutral natural-limit framing:** no steroid accusations, and a sample maximum is not a law.
6. **A worked example plus FAQ, sources, disclaimer, author and date**, in a compact page.
7. **Link building:** this page is KD 23, so it needs internal links (#19, #24, #10) and outreach.
8. **Links:** Body Fat (#19), BMI (#24), One Rep Max (#10), Macro (#22), TDEE (#20), Barbell Plate (#32).

---

## 8. Blueprint for the KKCTools FFMI Calculator

### 8.1 SEO

- **URL:** `/ffmi-calculator/`
- **Title:** FFMI Calculator – Fat-Free Mass Index
- **H1:** FFMI Calculator: Your Fat-Free Mass Index
- **Meta:** as in the keyword file (156 chars).
- **H2s:**
  - "What is FFMI?"
  - "Normalized FFMI"
  - "FFMI chart for men and women"
  - "The natural limit question"
  - "How body fat changes your FFMI"
- **Schema:** `WebApplication` + `FAQPage`.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Inputs | Sex, height (ft/in or cm), weight (lb/kg/st), body fat % (or "don't know" → Boer estimate) |
| Outputs | FFM, fat mass, FFMI, normalized FFMI, band (cited), sensitivity row (BF −3 / +3) |
| Links | "Estimate body fat" → #19 |
| UX | Share URL, copy, no network |

### 8.3 Content outline (≈ 1,000–1,300 words, original)

1. Intro and calculator
2. What FFMI is (vs BMI)
3. How to calculate it (worked example)
4. Normalized FFMI (correct explanation)
5. FFMI chart for men and women (cited; contexts separated)
6. The natural limit question (Kouri, neutral framing)
7. Why your body-fat estimate matters (sensitivity)
8. FAQ (10)
9. Sources and disclaimer, then related tools

### 8.4 Quality checks

- **Unit tests:**
  - The worked example (21.95 / 22.09).
  - The sensitivity rows.
  - The Boer branch.
  - Band lookup at the boundaries (half-open intervals).
  - Unit conversions.
- No competitor wording or tables. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - Pull Google top 10.
  - Review Legion and Menno manually (blocked).
  - Verify Kouri's 6.1 and Boer's coefficients.
  - Transcribe the bands from Schutz 2002 / Kyle 2003.
  - Reviewer (optional but recommended).
  - Plan links for KD 23.
