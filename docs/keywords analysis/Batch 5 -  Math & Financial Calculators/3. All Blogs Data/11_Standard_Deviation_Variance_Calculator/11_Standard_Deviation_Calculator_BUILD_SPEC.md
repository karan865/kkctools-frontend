# Standard Deviation & Variance Calculator — Build Spec

> **URL:** `/standard-deviation-calculator/` · Batch 5 · Tier 2 · rank chance 🟡 · **Build order 9** (first Tier 2 tool; shares `stats-engine` with IQR)
> **Read first:** `../00_BATCH5_BUILD_RULES.md` (§2.3, §3)
> **Inputs used:**
> - `11_Standard_Deviation_Variance_Calculator_Competitor_Analysis.md` (6 pages read, 2026-11-14)
> - keyword file §2 #11
>
> **SERP:** provisional. `TODO(owner)`: check whether Calculator.net ranks.
> **Written:** 2026-11-22 (full rewrite after the research pass)

---

## 0. Strategy

**The cluster:** ~25,000 reliable searches across three groups:
- SD and variance: `stdev calculator` 5,400 at KD 17; `variance calculator` 4,400.
- Standard error: 5,120.
- Mean/median/mode: 8,000.
- **No competitor answers all three on one page.** That is our page.

**Who ranks:**
- giants: CalculatorSoup, Omni, Inch, GIGA, Alcula, DQYDJ;
- **Pearson** (the benchmark: value:frequency input, deviation table with z-scores, five-number summary, 7 FAQs; no grouped data);
- Excel/data brands.

**Accuracy edge:** Inch's sample variance is **wrong**; GIGA mislabels percentile/sigma figures.

**Get internal links from the IQR page (#3) first,** since giants rank here.

## 1. Keywords and placement

| Role | Keyword | US vol | KD | Trend | Where it goes |
|---|---|---:|---:|:---:|---|
| **Primary** | stdev calculator | 5,400 | 17 | ⚠ declining | First sentence, tool heading |
| Secondary | variance calculator | 4,400 | 23 | ⚠ declining | H2 "Variance calculator: sample vs population variance" |
| Secondary | standard error calculator · se calculator | 4,400 · 720 | 25 · 4 | | H2 "Standard error of the mean" + output card |
| Secondary | mean median mode calculator · mean median mode finder | 4,400 · 3,600 | 26–28 | ↑ | H2 "Mean, median and mode" + summary card |
| Secondary | statistics calc | 1,900 | 13 | ↑ | Intro ("a quick statistics calc for any data set") |
| Natural | standard deviation calculator · how to calculate standard deviation | — | | | Title, H1, H2 |

## 2. Our edge (6 competitors checked)

| Feature | Competitors with it |
|---|---|
| SD + variance; sample/population toggle | 5/6 |
| **Full descriptive set in one panel:** n, Σ, mean, median, mode(s), min, max, range, s & σ side by side, s² & σ², SE, CV, quartiles/IQR | SE 1/6 · median/mode 1 (separate page) · **CV 0** |
| Frequency input (value:frequency) | 1/6 |
| **Grouped classes** (midpoints, labelled estimates) | **0/6** |
| **Student steps table:** x, x − x̄, (x − x̄)², totals, formulas with numbers | 1/6 good (Inch's has an error) |
| Interpretation: z-scores, 68-95-99.7 (only for roughly normal data), outliers by z and IQR | partial (GIGA partly wrong) |
| Optional 95% CI for the mean (t-based) | rare |
| Theme-aware dot plot / histogram; copy text/CSV; decimals | partial |

## 3. Calculator spec

### 3.1 Tabs

1. **Raw data** (default)
2. **Frequency table**
3. **Grouped data** (estimates)

### 3.2 Input guide diagram (above the inputs)

`StdevInputGuide.tsx`: a dot plot of "1 Your data".
- A vertical line at the mean.
- Small arrows from each dot to the line, labelled "deviation (x − mean)".
- A shaded band labelled "±1 standard deviation".
- A toggle badge "2 Sample or population", with a one-line hint: "sample = part of a bigger group".
- **Frequency tab:** a two-column value | count table.
- **Grouped tab:** class bars.

### 3.3 Inputs

| Field | Default |
|---|---|
| Data | `2, 4, 4, 4, 5, 5, 7, 9` (example; any separator) |
| Sample/population | sample (explained) |
| Frequency | value:frequency rows |
| Grouped | class from–to + frequency |
| Decimals | 3 |
| CI | off (95% when on) |

### 3.4 Engine (`src/lib/stats-engine.ts`, shared)

```ts
mean = Σx/n ; SS = Σ(x − x̄)² (two-pass or Welford) ; s² = SS/(n−1) (null if n<2) ; σ² = SS/n ; s, σ = √
SE = s/√n ; CV = s/x̄ (only if x̄ > 0, labelled) ; median ; modes (multi / none) ; min max range ; quartiles (method from #3)
frequency: weights (n = Σf) ; grouped: midpoints (estimate flag)
z_i = (x_i − x̄)/s ; outliers |z| > 3 and IQR fences
CI = x̄ ± t*(n−1) × SE (t from the shared Student-t functions used by #13)
```

**Worked example (checked 2026-11-22):** `2, 4, 4, 4, 5, 5, 7, 9`.

| Output | Value |
|---|---:|
| n | 8 |
| Σ | 40 |
| Mean | 5 |
| Median | 4.5 |
| Mode | 4 |
| SS | 32 |
| **Population SD** | **2.000** (σ² 4) |
| **Sample SD** | **2.138** (s² 4.571) |
| SE | **0.756** |
| CV (sample) | 42.76% |

### 3.5 Outputs

- **Summary panel** (all outputs, with sample and population columns).
- **Sentence:** "Your 8 values average 5 with a sample standard deviation of 2.138 (population: 2.000). Most values sit within about 2 of the mean."
- Steps table with substituted formulas.
- z-score column; outlier flags.
- Chart.
- Optional CI.
- Copy text/CSV; Share URL (small data).

### 3.6 Tests

- The example above.
- n = 1 (sample SD `null`); constant data (SD 0).
- Multimodal / no-mode; frequency and grouped inputs.
- Large-magnitude stability (e.g. 1e9 + small values).
- CV guard; CI vs a t-table fixture. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Standard Deviation Calculator – Variance & SE` (45; 57 with the suffix: OK) |
| Meta | `Free standard deviation calculator. Paste your data to get sample and population standard deviation, variance, standard error, mean, median and mode.` (149) |
| H1 | `Standard Deviation Calculator: Variance, Standard Error, Mean and Median` |
| BLUF | "This stdev calculator shows how spread out your numbers are. For 2, 4, 4, 4, 5, 5, 7, 9 the mean is 5 and the population standard deviation is 2; treated as a sample it is 2.138, because the sample formula divides by n − 1 instead of n." (engine) |
| ToolShell pills | `Sample & population SD`, `Variance, SE, mean, median, mode`, `Step-by-step table`, `Frequency & grouped data` |
| Links out | IQR (#3), T-Test (#13), Binomial (#12), A/B Test (#4) |
| Links in | IQR, T-Test, Binomial, A/B Test, Tools hub "Stats" |

## 5. Content (~1,600–1,900 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the standard deviation calculator | 3 tabs | 100 |
| 2 | What standard deviation tells you | Intuition + visual | 150 |
| 3 | Sample vs population: why divide by n − 1? | Example both ways | 200 |
| 4 | How to calculate standard deviation by hand | Steps table (engine) | 250 |
| 5 | Variance calculator: sample vs population variance | `variance calculator` | 150 |
| 6 | Standard error of the mean | `standard error calculator`, `se calculator`; vs SD | 150 |
| 7 | Mean, median and mode | `mean median mode calculator`; multimodal | 150 |
| 8 | Frequency tables and grouped data | Weights; grouped = estimate | 150 |
| 9 | Interpreting SD: z-scores, the 68-95-99.7 rule and CV | Normal-data caution | 180 |
| 10 | FAQ | §6 | 420 |

## 6. FAQ (12, from the question bank)

1. What is standard deviation?
2. Sample or population standard deviation: which should I use?
3. Why divide by n − 1?
4. How do I calculate standard deviation by hand?
5. What is variance, and how does it relate to SD?
6. What is the standard error of the mean?
7. How do I find the mean, median and mode?
8. What is a z-score?
9. What is a "high" standard deviation? (use CV; context matters)
10. What does the 68-95-99.7 rule mean? (roughly normal data only)
11. Can standard deviation be negative or zero?
12. How do I calculate SD from a frequency table?

## 7. Done when

- [ ] `stats-engine` descriptive functions + tests; `npm run verify` passes.
- [ ] InputGuide above the inputs; ToolShell + TabSlider + fonts + `<main>`.
- [ ] Links exchanged with IQR; grouped results labelled estimates.
- [ ] Registrations + docs; `graphify update .`.
