# IQR Calculator (Quartiles & Box Plot) — Competitor Analysis

> **Target page:** KKCTools `/iqr-calculator/` (Batch 5, Tool #3 ✅)
> **Primary keyword:** `iqr calculator` — US 2,400 · **KD 0** (cluster: 2 keywords, 3,400 US vol, incl. `work out average calculator` 1,000)
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 5. Competitors come from a live web search for `iqr calculator` run on 2026-11-14. `TODO(owner): pull Google top 10.`
> **Pages visited:** 2026-11-14 — 5 read (Omni, Calculate.co.nz, Pearson, Inch Calculator, Social Science Statistics) · 1 blocked (Scribbr, 403).

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Omni (giant)
  - Pearson channels (education publisher, the strongest feature set)
  - Calculate.co.nz
  - Inch Calculator (with a PhD reviewer)
  - Social Science Statistics
  - Scribbr (an academic-writing brand; returned 403). `TODO(owner)`: check Scribbr in a browser, since it is likely a top-3 result with strong content.
- **Other results not read:**
  - Helping with Math, Testbook, eMathHelp, GoodCalculators, z-table, MathCracker
  - many pages.dev clones
- **Main point:** competitors **disagree on quartile values** because they use different methods (Tukey hinges, Excel INC/EXC, n+1 interpolation). Only Pearson and SocSciStats let the user choose a method. Omni contradicts itself. The keyword file says to make this an H2.
- All worked quartile examples were re-checked. No competitor text is copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | omnicalculator.com/statistics/iqr | Giant | IQR Calculator — Interquartile Range | several hundred |
| 2 | calculate.co.nz/quartile-iqr-calculator.php | NZ calc site | Quartile and IQR Calculator | ~600 |
| 3 | pearson.com/channels/calculators/range-iqr-calculator | Education publisher | Range & IQR Calculator | 900–1,000 |
| 4 | inchcalculator.com/quartile-calculator/ | Calc site | Quartile Calculator – IQR Calculator | ~850 |
| 5 | socscistatistics.com/tests/iqr/calculator | Stats tool site | Interquartile Range (IQR) Calculator | 150–200 |
| — | scribbr.com/statistics/interquartile-range/ | Academic brand | How to Find Interquartile Range (IQR) | **blocked (403)** |

**What this tells us:**
- **Pearson is the benchmark.** It has a method selector (exclusive, inclusive, interpolation), flexible input (commas, spaces or new lines), range, Q1/Q2/Q3, IQR, 1.5×IQR outliers, a box plot, steps, an "all-method comparison" and copy. It has four correct worked examples and four FAQs.
  - Weak points: no author or date, and the method comparison isn't demonstrated.
- **Omni is inconsistent and thin on outputs.**
  - It describes quartiles as "median of halves", but its example uses n+1 interpolation. For 5, 7, 8, 9 those give IQR 2.5 and 3.25 respectively.
  - It shows only IQR, Q1 and Q3. It has no fences, outliers or box-plot output.
- **No page shows all of these together:**
  - a five-number summary
  - mean (for "work out average")
  - fences with an outlier list
  - a theme-aware box plot
  - a method toggle that explains **why** answers differ
  - TI-84, Excel and R equivalence

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Omni | Calc.co.nz | Pearson | Inch | SocSciStats |
|---|---|---|---|---|---|
| Input: commas / spaces / new lines | ⚠️ one per row | ⚠️ commas | ✅ all | ⚠️ commas | ✅ lines or commas |
| Data limit | 4–50 | ≥4 | ? | ? | 4–1,000 |
| Sorted list shown | ⚠️ | ⚠️ | ✅ steps | ❌ | ❌ |
| Q1, median, Q3 | ⚠️ Q1/Q3 only | ✅ | ✅ | ✅ | ? |
| IQR | ✅ | ✅ | ✅ | ✅ | ✅ |
| Min / max / range | ❌ | ❌ | ✅ | ✅ | ❌ |
| Mean / count | ❌ | ⚠️ count (not visible) | ❌ | ❌ | ❌ |
| Fences (1.5×IQR) | ❌ (text only) | ✅ | ✅ | ❌ | ❌ |
| Outlier list | ❌ | ❌ (separate tool) | ✅ | ❌ | ❌ |
| Box plot | ❌ (static image) | ❌ (mentioned) | ✅ | ❌ | ❌ |
| Method choice | ❌ (unnamed, inconsistent) | ❌ (n+1 interpolation stated) | ✅ 3 methods + compare | ❌ (median of halves, unnamed) | ✅ INC/EXC (R type 7/6) |
| Steps shown | ✅ article | ⚠️ example | ✅ toggle | ✅ article | ❌ |
| Copy / share | ⚠️ | ❌ | ✅ copy | ✅ share/embed | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Omni | Calc.co.nz | Pearson | Inch | SocSciStats |
|---|---|---|---|---|---|
| Worked example (checked) | ✅ 5,7,8,9 → 3.25 (contradicts its own text) | ✅ n=10 → 11 | ✅ 4 examples | ✅ 7 values → Q1 4, Q3 8 | ❌ |
| "Why methods differ" explained | ❌ | ⚠️ | ✅ FAQ | ❌ | ❌ |
| Software equivalence (Excel / R / TI) | ❌ | ❌ | ❌ | ❌ | ✅ Excel INC/EXC, R 6/7 |
| Outlier rule explained | ⚠️ | ✅ FAQ (Tukey) | ✅ FAQ (why 1.5) | ⚠️ mentioned | ❌ |
| Box plot reading | ⚠️ | ❌ | ✅ whiskers FAQ | ❌ | ❌ |
| FAQ count | 0 | 3 | 4 | 0 | 0 |
| Named author | ✅ + reviewers | ⚠️ reviewer only | ❌ | ✅ + PhD reviewer | ❌ |
| Date | ❌ | ✅ Nov 2026 | ❌ | ❌ | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. Omni — IQR Calculator (Steven Wooding; reviewers Bogna Szyk and Jack Bowater)
- **Input:** 4–50 values, one per row.
- **Output:** IQR, Q1 and Q3 only.
- **Method:** rank (N+1)/4 with interpolation ("method 4" on Wikipedia). The method is not named, and no link is given.
- **Example:** 5, 7, 8, 9 gives Q1 = 5.5, Q3 = 8.75, IQR = 3.25 ✔. However, the article's own "median of halves" description would give 6 / 8.5 / 2.5. **The page contradicts itself.**
- **Weak points:**
  - Fences and outliers are described but not calculated.
  - The box plot is a static image.
  - No FAQ and no date.

### 2. Calculate.co.nz — Quartile and IQR Calculator (reviewed Nov 2026)
- **Input:** comma-separated values (≥4).
- **Outputs:** Q1, Q2, Q3, IQR, lower and upper fence.
- **Method:** rank = p × (n+1), interpolated.
- **Example:** 3, 5, …, 21 gives 6.5 / 12 / 17.5, IQR 11, fences −10 and 34 ✔.
- **FAQs (3):** what IQR is · Tukey fences · range vs IQR.
- **Weak points:**
  - The count it promises is not shown.
  - No box plot.
  - The outlier list sits in a separate tool.
  - The method variant is not named, even though it differs from Excel INC.

### 3. Pearson — Range & IQR Calculator — **benchmark**
- **Inputs:** method choice (exclusive, inclusive, interpolation); data entered with commas, spaces or new lines; toggles for box plot, steps and compare-all-methods; quick-example chips.
- **Outputs:** range, Q1/Q2/Q3, IQR, 1.5×IQR outliers, box plot, steps, copy.
- **Examples (all ✔):**
  - Exclusive Q1/Q3 = 2/6 vs inclusive 2.5/5.5
  - Scores Q1 = 75, Q3 = 85 → 40 flagged
  - Q1 = 9.75
  - Constant data → IQR 0
- **FAQs (4):** why several methods · why 1.5×IQR · range vs IQR · whisker placement.
- **Weak points:**
  - No author or date.
  - "Matches most intro stats" is unsourced.
  - The result area is empty until Calculate is clicked.

### 4. Inch Calculator — Quartile / IQR (Joe Sexton; reviewer Brian Libgober PhD)
- **Input:** comma-separated values.
- **Outputs:** Q1, Q2, Q3, IQR, min, max, range.
- **Method:** median of halves. It is not named, and it doesn't say whether the median is excluded when n is odd.
- **Example:** [3,4,5,5,7,8,9] gives Q1 4, Q2 5, Q3 8 ✔. The example doesn't show the IQR.
- **Weak points:** no fences, no FAQ, no date; inconsistent headings.

### 5. Social Science Statistics — IQR Calculator
- **Input:** 4–1,000 values, with a choice of Inclusive (Excel PERCENTILE.INC / R type 7) or Exclusive (EXC / R type 6).
- **Weak points:**
  - No outputs are described.
  - No steps, examples or FAQ.
  - Mostly promotional content.

---

## 5. Patterns

**Methods to support (name each one, and show which software matches it):**

| Method | Rule | Matches |
|---|---|---|
| Tukey hinges / median of halves, **median excluded** for odd n | Q1 = median of lower half | TI-83/84, many US textbooks |
| Median of halves, **median included** for odd n | lower half includes the median | some textbooks (Moore & McCabe style) |
| Exclusive interpolation | rank = p(n+1) | Excel QUARTILE.EXC, R type 6, Minitab |
| Inclusive interpolation | rank = p(n−1)+1 | Excel QUARTILE.INC, R type 7 (default), Google Sheets |

`TODO(owner)`: confirm the software-equivalence claims against the official Excel and R documentation before publishing. The default method should be the TI/textbook one or Excel INC, and the owner should choose which.

**Fences and other outputs:**
- Inner fences: Q1 − 1.5·IQR and Q3 + 1.5·IQR. Optional outer fences at 3·IQR (extreme outliers).
- Whiskers end at the most extreme points that fall inside the fences.
- Also show the mean, count and sum (covers `work out average calculator`).

**What the 5 pages cover:**

| Section | Pages (of 5) |
|---|:---:|
| IQR | 5 |
| Q1/Q2/Q3 | 4 |
| Fences | 2 |
| Outlier list | 1 |
| Box plot | 1 |
| Method choice | 2 |
| Mean | **0** |
| Explains why methods differ | 1 |

---

## 6. FAQ question bank

★ = asked on 2+ pages or a cluster keyword. Map to: iqr calculator, work out average calculator.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is the interquartile range? | Omni, Calc.co.nz, Inch, Pearson |
| 2 | ★ How do you calculate IQR (step by step)? | Omni, Inch, Pearson |
| 3 | ★ How do you find outliers with the IQR (1.5 rule)? | Calc.co.nz, Pearson |
| 4 | ★ Range vs IQR — what is the difference? | Calc.co.nz, Pearson |
| 5 | ★ Why do different calculators give different quartiles? | Pearson, SocSciStats (implicit) |
| 6 | How do I read a box plot / where do whiskers end? | Pearson |
| 7 | Which method does Excel, Google Sheets, R or a TI-84 use? | SocSciStats (partial) |
| 8 | What if the data set has an even/odd number of values? | Inch (partial) |
| 9 | How do I work out the average (mean) of a data set? | `work out average calculator` |
| 10 | Can IQR be zero or negative? | Pearson (zero) |

---

## 7. Gaps nobody fills — our opportunities

1. **A full summary in one view:**
   - count, sum, mean, min, Q1, median, Q3, max, range, IQR
   - fences, plus an outlier list (mild vs extreme)
2. **Method toggle with four named methods**, a "compare all" table, and a plain explanation of why answers differ (keyword-file H2).
3. **Software equivalence labels:** Excel INC/EXC, Google Sheets, R type 6/7, TI-84 (owner-verified).
4. **Theme-aware SVG box plot** with outliers drawn as points and whiskers placed at the last values inside the fences.
5. **Steps:** sorted list with the quartile positions highlighted, and the interpolation arithmetic.
6. **Robust input:** commas, spaces, tabs or new lines; pasted spreadsheet columns; clear errors for bad values.
7. **Copy results** (text or CSV) and a share URL with the data encoded. Large data stays local.
8. **Correct, consistent examples** (avoid Omni's contradiction).
9. **Links to Standard Deviation (#11), T-Test (#13) and Final Grade (#14).**

---

## 8. Blueprint for the KKCTools IQR Calculator

### 8.1 SEO

- **URL:** `/iqr-calculator/`
- **Title:** IQR Calculator – Quartiles, Outliers & Box Plot
- **H1:** IQR Calculator: Interquartile Range, Quartiles and Outliers
- **Meta:** as in the keyword file (139 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Input | Paste numbers (any separator); up to ~10,000 values |
| Method | Tukey (exclude median) · Tukey (include median) · Exclusive n+1 · Inclusive n−1 (default `TODO(owner)`) |
| Outputs | Five-number summary, IQR, range, mean, count, sum; inner and outer fences; outliers |
| Visual | SVG box plot (theme aware), dot strip optional |
| Steps | Sorted list, positions, interpolation |
| Compare | Table of Q1 / Q3 / IQR under all methods |
| UX | Copy, share URL, no network |

### 8.3 Content outline (≈ 1,200–1,500 words, original)

1. Intro (primary keyword)
2. How to use
3. What the IQR tells you
4. How to find Q1, Q3 and the IQR — example (odd n and even n)
5. Why calculators give different quartiles — the 4 methods table
6. Finding outliers with the 1.5 × IQR rule — example
7. Reading a box plot
8. IQR vs range vs standard deviation
9. FAQ (10)
10. Related tools: Standard Deviation (#11), T-Test (#13), Ratio (#1), Final Grade (#14)

### 8.4 Quality checks

- **Unit tests:** every method against published reference values (`TODO(owner)`: R/Excel outputs as fixtures); odd/even n; ties; constant data; fences; outliers.
- **Re-check examples in tests:** 5,7,8,9 under each method; 3…21.
- No competitor wording copied. `npm run check:no-network` passes.
- `TODO(owner)`: pull Google top 10; check Scribbr manually; choose the default method.
