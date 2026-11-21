# Standard Deviation & Variance Calculator — Competitor Analysis

> **Target page:** KKCTools `/standard-deviation-calculator/` (Batch 5, Tool #11 🟡)
> **Primary keyword:** `stdev calculator` — US 5,400 · KD 17. The cluster has 7 keywords (24,820 US searches): variance 4,400, standard error 4,400, mean median mode 4,400 + 3,600, statistics calc 1,900, se calculator 720.
> **SERP source:** ⚠ No Semrush SERP export for Batch 5. Competitors come from a live web search on 2026-11-14 for `standard deviation calculator sample population variance`. `TODO(owner): pull Google top 10 for "stdev calculator" (keyword note: Calculator.net and Omni rank).`
> **Pages visited (2026-11-14):** 6 read: CalculatorSoup SD, Omni SD, Pearson SD, Inch SD, GIGAcalculator SD, and CalculatorSoup Mean/Median/Mode.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Calculator giants: CalculatorSoup, Omni, Inch, GIGAcalculator, Alcula, DQYDJ
  - Pearson, the education publisher
  - Data/Excel brands: 365 Data Science, TrumpExcel, Kanaries
  - Clones
  - Calculator.net, which the keyword file expects to rank, did not show in this search. `TODO(owner)`: check it in the real SERP.
- **The cluster also covers:**
  - **mean / median / mode** (8,000 searches)
  - **standard error** (5,120)
  - **variance** (4,400)
  - For mean/median/mode we read CalculatorSoup's separate page.
  - No single competitor answers all of these on one page.
- **Arithmetic checked: two pages have wrong worked examples.**
  - Inch's sample variance is wrong.
  - GIGAcalculator mislabels its percentile and sigma figures.
  - Details in §4.
- No competitor text was copied. The data engine is shared with the IQR tool (#3).

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | calculatorsoup.com/calculators/statistics/standard-deviation-calculator.php | Calc giant | Standard Deviation Calculator | 450–500 |
| 2 | omnicalculator.com/statistics/standard-deviation | Giant | Standard Deviation Calculator | 900–1,000 |
| 3 | pearson.com/channels/calculators/standard-deviation-calculator | Education publisher | Standard Deviation Calculator (Sample & Population with Steps) | 1,300–1,500 |
| 4 | inchcalculator.com/standard-deviation-calculator/ | Calc site | Standard Deviation Calculator (with Steps) | 1,000–1,200 |
| 5 | gigacalculator.com/calculators/standard-deviation-calculator.php | Stats calc site | Standard Deviation Calculator | 1,100–1,200 |
| 6 | calculatorsoup.com/calculators/statistics/mean-median-mode.php | Calc giant | Mean, Median, Mode Calculator | ~600 |

**What this tells us:**
- **Pearson is the benchmark.** It offers:
  - flexible paste input and `value:frequency` shorthand
  - mean, variance and SD
  - steps, a chart and a five-number summary
  - a deviation table with z-scores and outlier flags
  - copy and rounding, and 7 FAQs
  - Its weak points: no grouped data, no author or date, and one rounding slip.
- **The outputs are split across pages.**
  - The SD pages leave out median, mode, SE and CV. Only GIGA shows SEM and range.
  - CalculatorSoup's mean/median/mode page has no SD.
  - **Nobody shows the full descriptive set on one page**, even though the cluster asks for all of it.
- **Steps tables are rare.** Inch and Omni explain the steps in prose. Pearson's deviation table is the closest to a student-friendly (x − x̄)² table, and Inch's version contains an error.
- **Only Pearson accepts frequency input.** Nobody accepts grouped or class-interval data.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | CalcSoup SD | Omni | Pearson | Inch | GIGA | CalcSoup MMM |
|---|---|---|---|---|---|---|
| Paste: commas / spaces / lines | ✅ | ⚠️ (fields, ≤30 values) | ✅ (+ spreadsheet) | ⚠️ (commas) | ✅ | ✅ |
| Frequency input (value:freq) | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Grouped data (class intervals) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Proportion / binomial SD | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Sample vs population toggle | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Both shown side by side** | ❌ | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| SD and variance | ✅ | ⚠️ (variance not listed as an output) | ✅ | ✅ | ✅ | ❌ |
| Standard error (SEM) | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Mean | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Median / mode | ❌ | ❌ | ⚠️ (5-number summary) | ❌ | ❌ | ✅ |
| Range / min / max | ❌ | ❌ | ⚠️ | ❌ | ✅ | ✅ |
| Sum / count / sum of squares | ⚠️ | ❌ | ⚠️ | ✅ | ✅ count | ✅ |
| Coefficient of variation | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Quartiles / IQR / outliers | ❌ | ❌ | ✅ (z-score flags) | ❌ | ❌ | ✅ (method not named) |
| Steps table (x, x − x̄, squared) | ⚠️ (placeholders) | ⚠️ (prose) | ✅ (deviation table + z) | ⚠️ (prose, **error**) | ❌ | ⚠️ |
| Chart | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Copy results / rounding | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| CI for the mean | ❌ | ❌ | ❌ | ❌ | ❌ (link only) | ❌ |

---

## 3. Feature matrix — content and trust

| Item | CalcSoup SD | Omni | Pearson | Inch | GIGA | CalcSoup MMM |
|---|---|---|---|---|---|---|
| Sample vs population explained (n − 1) | ⚠️ (early wording ambiguous) | ✅ Bessel | ✅ | ⚠️ (muddled) | ⚠️ (notation blurred) | n/a |
| Worked example (checked) | ❌ | ✅ (2.7689) | ✅ ×5 (1 slip) | ❌ **wrong** | ✅ | ✅ |
| Interpretation (68-95-99.7, z) | ❌ | ⚠️ | ✅ z | ❌ | ✅ (**table/text errors**) | ❌ |
| FAQ count | 0 | 0 | 7 | 0 | 0 | 0 |
| Named author | ✅ | ✅ + reviewers | ❌ | ✅ + PhD reviewer | ✅ (statistician) | ✅ |
| Source cited | ❌ | ✅ (Ross 2014) | ❌ | ❌ | ⚠️ | ❌ |
| Date | ✅ Oct 2026 | ❌ | ❌ | ❌ | ✅ Apr 2026 | ✅ Oct 2026 |

---

## 4. Competitor-by-competitor detail

### 1. CalculatorSoup — Standard Deviation (Edward Furey, Oct 2026)
- **Input:** any separators; sample/population toggle.
- **Outputs:** SD, variance, n, mean, sum of squares.
- **Weak points:**
  - No median, mode, SE, CV or range.
  - The "Solution" block shows unrendered placeholders.
  - The variance text says "divide by number of points", which conflicts with n − 1.
  - No example, no FAQ. Typos.
- **Check on its own sample data (our calculation):** 42, 54, 65, 47, 59, 40, 53 gives mean 51.43, s 9.03, σ 8.36.

### 2. Omni — Standard Deviation (Jasmine J Mah; reviewed by Szyk and Bowater)
- **Input:** up to 30 values; sample/population; all steps or a summary.
- **Examples (both ✔):**
  - 2, 4, 5, 6, 6, 9, 10: mean 6, Σ = 46, s² 7.667, s 2.769.
  - Hand method on 1, 2, 4, 6: s² 4.917.
- **Source:** Ross (2014).
- **Weak points:**
  - 30-value cap.
  - No FAQ, no date.
  - Variance is not listed as an output.
  - Garbled formula rendering.

### 3. Pearson — Standard Deviation Calculator (benchmark)
- **Inputs:** paste, or `value:frequency`.
- **Outputs:**
  - mean, variance, SD
  - steps, chart, 5-number summary
  - deviation table with z-scores and outlier flags (|z| > 2)
  - copy, 2–6 decimal places
- **Examples:** 1–4 ✔. Example 5's s should be ≈ 13.67 (page shows 13.6), and z for 47 should be ≈ 2.04 (page shows 2.05).
- **FAQs (7):**
  1. Sample vs population
  2. Why n − 1
  3. What SD means
  4. z-scores
  5. Outlier rule
  6. A single value
  7. Pasting data
- **Weak points:** no grouped data; the |z| > 2 rule is not compared with IQR; no author or date.

### 4. Inch Calculator — Standard Deviation (Joe Sexton; reviewer Brian Libgober PhD)
- **Input:** population/sample, comma list.
- **Outputs:** SD, variance, sum of squares, n, mean.
- **Error:** in the sample example on [1, 3, 4, 7, 8, 9], Σ = 49.33 ✔. The page then shows "49.33 ÷ (6 − 1) = **8.22**". The correct value is **9.87**, so s = **3.14**, not 2.87. The page divided by 6 while writing 6 − 1.
- **Weak points:** Bessel's correction explained in a muddled way; no FAQ; no date.

### 5. GIGAcalculator — Standard Deviation (Georgi Georgiev, Apr 2026)
- **Modes:** continuous data, or proportions (proportion, % or count with n); sample/population.
- **Outputs:** SD, variance, mean, range, count, SEM.
- **Examples:** two 18-value data sets → 2.26 and 8.94 ✔.
- **Errors:**
  - Says 1.645 σ is the "top 10th percentile". It is the top 5 % (one-sided), which its own table shows.
  - One table row (0.3186 σ) appears mislabelled.
  - Credits CERN for the gravitational-wave detection, which was LIGO.
- **Weak points:**
  - Formulas are images.
  - Overstates normality of the SEM.
  - No FAQ.

### 6. CalculatorSoup — Mean, Median, Mode (Oct 2026)
- **Outputs:** sum, count, mean, median, mode, range, Q1, Q3, IQR, outliers. All ✔ on its example (16 values).
- **Weak points:**
  - The quartile method is not named (see the IQR file #3).
  - No SD.
  - No FAQ.

---

## 5. Patterns

- **Formulas:**
  - Mean x̄ = Σx/n.
  - Sum of squares SS = Σ(x − x̄)².
  - Sample variance s² = SS/(n − 1); population variance σ² = SS/N.
  - SD = √variance.
  - SE = s/√n.
  - CV = s/x̄ (only for ratio-scale data with x̄ > 0).
  - Median: middle value (average of the two middle values for even n).
  - Mode: the most frequent value(s); multimodal or "no mode" is also possible.
- **Frequency input:** use weights, so x̄ = Σfx/Σf and SS = Σf(x − x̄)². Sample n = Σf.
- **Grouped data:** class midpoints × frequencies. Label results as **estimates**.
- **Numerical stability:** use Welford's algorithm or two-pass sums for large or high-magnitude data.
- **Optional CI for the mean:** x̄ ± t* × SE. This reuses the t distribution from the T-Test tool (#13).
- **Proportion SD:** √(p(1 − p)/n). Optional.

| Section | Pages (of 6) |
|---|:---:|
| SD + variance | 5 |
| Sample/pop toggle | 5 |
| SE | 1 |
| Median/mode | 1 (separate page) |
| Frequency input | 1 |
| Grouped data | **0** |
| CV | **0** |
| Steps table | 1 good |
| Correct example | 4 of 5 with examples |

---

## 6. FAQ question bank

★ = asked on 2+ pages or a cluster keyword. Map to: stdev calculator, statistics calc, se calculator, variance calculator, standard error calculator, mean median mode calculator, mean median mode finder.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is standard deviation? | Omni, Pearson, GIGA |
| 2 | ★ Sample vs population standard deviation — which do I use? | Omni, Pearson, Inch, CalcSoup |
| 3 | ★ Why divide by n − 1? | Omni, Pearson, Inch |
| 4 | ★ How do I calculate standard deviation by hand? | Omni, Inch |
| 5 | ★ What is variance and how does it relate to SD? | all · `variance calculator` |
| 6 | What is the standard error of the mean? | GIGA · `standard error calculator`, `se calculator` |
| 7 | How do I find mean, median and mode? | CalcSoup MMM · `mean median mode calculator` |
| 8 | What is a z-score? | Pearson |
| 9 | What is a good or high standard deviation (CV)? | — |
| 10 | What does 68-95-99.7 mean? | GIGA (partly wrong) |
| 11 | Can standard deviation be negative or zero? | — |
| 12 | How do I calculate SD from a frequency table? | Pearson (shorthand) |

---

## 7. Gaps nobody fills — our opportunities

1. **One descriptive-statistics panel:**
   - count, sum, mean, median, mode(s), min, max, range
   - sample **and** population SD and variance side by side
   - SE, CV
   - quartiles, IQR (shared with #3)
2. **Input modes:** raw paste (any separator), frequency table, and grouped classes (labelled as estimates).
3. **Student steps table:** x, x − x̄, (x − x̄)², the totals, and each formula with numbers substituted.
4. **Interpretation:** z-scores, the 68-95-99.7 rule (only for roughly normal data, stated clearly), outlier flags by z and by IQR.
5. **Optional 95 % CI for the mean**, with a t-based link to the T-Test tool (#13).
6. **Correct worked examples.** Inch and GIGA contain errors (see §4).
7. **Copy results** as text or CSV, and choose the decimal places.
8. **Theme-aware SVG chart** (dot plot or histogram).
9. **Links to IQR (#3), T-Test (#13), Binomial (#12) and A/B Test (#4).**

---

## 8. Blueprint for the KKCTools Standard Deviation Calculator

### 8.1 SEO

- **URL:** `/standard-deviation-calculator/`
- **Title:** Standard Deviation Calculator – Variance & SE
- **H1:** Standard Deviation Calculator: Variance, Standard Error, Mean and Median
- **Meta:** as written in the keyword file (149 chars).
- **H2s:**
  - variance calculator
  - standard error calculator
  - mean median mode calculator

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Input | Paste (any separator) · value:frequency table · grouped classes |
| Outputs | n, Σ, mean, median, mode(s), min, max, range, s, σ, s², σ², SE, CV, quartiles/IQR |
| Steps | Deviation table + substituted formulas; z-score column; outlier flags (z and IQR) |
| Extras | 95 % CI for mean (optional), chart, decimals, copy text/CSV |
| Engine | Welford / two-pass; shared parser with IQR (#3) |
| UX | Share URL (small data only), no network |

### 8.3 Content outline (≈ 1,400–1,700 words, original)

1. Intro (primary keyword)
2. How to use
3. What standard deviation tells you
4. Sample vs population (why n − 1), with an example
5. How to calculate SD by hand, with a steps table
6. Variance explained
7. Standard error of the mean
8. Mean, median and mode
9. Frequency tables and grouped data
10. Interpreting SD: z-scores, 68-95-99.7, CV
11. FAQ (10–12)
12. Related tools: IQR (#3), T-Test (#13), Binomial (#12), A/B Test (#4)

### 8.4 Quality checks

- **Unit tests** against reference values (`TODO(owner)`: fixtures from R `sd`/`var`):
  - frequency and grouped data
  - single value (sample undefined)
  - constant data
  - large-magnitude stability
- **Fixtures:** [1, 3, 4, 7, 8, 9] gives s = 3.141 and σ = 2.867; [2, 4, 5, 6, 6, 9, 10] gives s = 2.769.
- No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)`:** pull Google top 10; check Calculator.net.
