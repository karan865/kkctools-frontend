# T-Test Calculator — Build Spec

> **URL:** `/t-test-calculator/` · Batch 5 · Tier 2 · rank chance 🟡 · **Build order 10** (after Standard Deviation; shares `stats-engine`)
> **Read first:** `../00_BATCH5_BUILD_RULES.md` (§2.3: correct statistical language)
> **Inputs used:** `13_T_Test_Calculator_Competitor_Analysis.md` (6 pages read, 2026-11-14), keyword file §2 #13
> **SERP:** provisional (GraphPad expected at #1)
> **Written:** 2026-11-22 (full rewrite after the research pass)

---

## 0. Strategy

- **The keyword:** `t-test calculator` has 1,900 searches at **KD 2**. It's declining, but it's an exact tool term. **GraphPad** likely holds #1; the rest of the SERP is weaker.
- **Who ranks:**

  | Page | Strengths | Weaknesses |
  |---|---|---|
  | GraphPad | solid | **two-tailed only**; no example, FAQ or author; calls Welch "rarely used" |
  | MathCheck | most complete (one-sample, Welch, pooled, paired; raw/summary/t+df; Δ; Cohen's d) | wrong glossary definitions |
  | AAT Bioquest | runs Shapiro-Wilk and draws plots | its interpretations are **wrong** |
  | Omni, Inch, 8gwifi | — | — |

- **Language errors to avoid:**
  - AAT says "p-value is the probability that the null is true" and "accept the null".
  - Inch says "t ≥ 2 is enough".
  - **Our copy must define these correctly.** That alone beats several pages.
- **Nobody combines all of these:**
  - Welch **as the default, with a reason**;
  - a correct verdict;
  - effect size with its CI;
  - a **working t-curve with the shaded p region** (0 of 6 have one);
  - a normality/outlier hint.

## 1. Keywords and placement

| Role | Keyword | US vol | KD | Where it goes |
|---|---|---:|---:|---|
| **Primary** | t-test calculator | 1,900 | 2 | Title, H1, first sentence, tool heading |
| Natural | welch t test · paired t test · two sample t test · one sample t test · p value from t · degrees of freedom | — | — | Tab names, H2s, FAQ |

## 2. Our edge (6 competitors checked)

| Feature | Competitors with it |
|---|---|
| All 3 test types (one-sample, paired, two-sample) | 4/6 |
| **Welch as the default** (with a reason) + pooled option | Welch in the tool 3/6; default + reason 0 |
| Raw + summary (SD **or** SEM) + t/df input | raw + summary 2/6 |
| One- and two-tailed p, critical t, CI of the difference | tails 4/6 · CI 3/6 |
| Cohen's d + Hedges' g | 2/6 |
| **Theme-aware t-curve SVG** (p region shaded, critical lines) | **0/6 working** |
| Assumption helper (outliers by IQR rule, skew flag, small-n note) | partial (AAT, wrongly interpreted) |
| Correct plain-English verdict and definitions | 2–3/6 |
| Numeric worked examples verified | 1/6 |

## 3. Calculator spec

### 3.1 Tabs

1. **Two-sample** (default; Welch, with a pooled toggle)
2. **Paired**
3. **One-sample**

### 3.2 Input guide diagram (above the inputs)

`TTestInputGuide.tsx`
- **Two-sample:** two overlapping bell curves, "Group 1" and "Group 2". Each has badges "1 Mean", "2 Standard deviation (or SEM)" and "3 Sample size (n)". The gap between the means is bracketed and labelled "difference tested".
- **Paired:** before/after dots joined by lines, labelled "differences".
- **One-sample:** one curve vs a vertical "4 Hypothesised mean (μ₀)".
- **A settings strip:** "5 α", "6 Tails", "7 Hypothesised difference Δ".

### 3.3 Inputs (defaults = examples)

| Field | Default |
|---|---|
| Input mode | summary (or paste raw data, or t + df) |
| Group 1 | n 30, mean 75, SD 10 |
| Group 2 | n 30, mean 70, SD 12 |
| Settings | α 0.05, two-tailed, Δ 0, Welch |

### 3.4 Engine (`src/lib/stats-engine.ts` + `t-test-engine.ts`)

```ts
one-sample: t = (x̄ − μ0)/(s/√n), df = n − 1 ; paired: one-sample on dᵢ
pooled: sp² = ((n1−1)s1² + (n2−1)s2²)/(n1+n2−2) ; t = (x̄1 − x̄2 − Δ)/(sp√(1/n1+1/n2)) ; df = n1+n2−2
Welch: t = (x̄1 − x̄2 − Δ)/√(s1²/n1 + s2²/n2) ; df Satterthwaite
SEM input → SD = SEM·√n
p via Student-t CDF (regularized incomplete beta) ; two-tailed 2(1 − F(|t|)) ; critical t via inverse (bisection)
CI = diff ± t* · SE ; Cohen's d = diff / sp (two-sample) or diff / s (one-sample/paired) ; Hedges' g correction
assumption flags: IQR outliers (#3 engine), skewness, n < 15 note
```

**Worked examples (checked 2026-11-22):**

| Test | t | df | Two-tailed p |
|---|---:|---:|---:|
| Welch | **1.753** | **56.17** | **0.085** |
| Pooled | 1.753 | 58 | 0.0848 |

Both are not significant at α = 0.05.

`TODO(owner)`: store R `t.test()` fixtures (Welch and `var.equal = TRUE`) in tests.

### 3.5 Outputs

- **Descriptives** per group.
- **Result card:** t, df, p (one- and two-tailed), critical t, CI of the difference, Cohen's d / Hedges' g.
- **Verdict:** "At α = 0.05, the difference of 5 points is not statistically significant (Welch t = 1.75, df ≈ 56.2, p = 0.085)."
- **Meaning line:** "If the true difference were 0, a difference at least this large would appear about 8.5% of the time."
- t-curve SVG with the shaded region.
- Assumption flags.
- Copy; Share URL (small data).

### 3.6 Tests

- Each test type vs R fixtures; SEM input.
- t + df mode; one-tailed direction.
- Hedges' g.
- n < 2 errors; zero variance.
- t CDF accuracy vs a table. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `T-Test Calculator – One, Two-Sample & Paired` (44; 56 with the suffix: OK) |
| Meta | `Free t-test calculator. Paste two groups or enter summary stats to get the t value, degrees of freedom and p-value for one-sample, Welch and paired tests.` (154) |
| H1 | `T-Test Calculator: One-Sample, Two-Sample and Paired t-Tests` |
| BLUF | "A t-test checks whether two means differ by more than chance. Group means of 75 and 70 (SD 10 and 12, 30 each) give Welch's t = 1.753 with about 56 degrees of freedom: a two-sided p-value of 0.085, so the difference is not significant at the 5% level." (engine) |
| ToolShell pills | `Welch, pooled & paired`, `Raw data or summary stats`, `p-value, CI & effect size`, `t-curve chart` |
| Links out | Standard Deviation (#11), A/B Test (#4), IQR (#3), Binomial (#12) |
| Links in | Standard Deviation (CI link), A/B Test, Tools hub "Stats" |

## 5. Content (~1,600–1,900 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the t-test calculator | 3 tabs, input modes | 100 |
| 2 | Which t-test should I use? | Decision table | 180 |
| 3 | Two-sample t-test: Welch vs pooled | Formula + example; why Welch is our default (`TODO(owner)`: cite a source) | 250 |
| 4 | Paired t-test | Example | 180 |
| 5 | One-sample t-test | Example | 130 |
| 6 | Reading the results: p-value, confidence interval, effect size | Correct definitions | 220 |
| 7 | Degrees of freedom | What df is and where it comes from | 100 |
| 8 | Assumptions, and what to do when they fail | Normality, outliers, small n | 150 |
| 9 | One- vs two-tailed tests | | 100 |
| 10 | FAQ | §6 | 400 |

## 6. FAQ (11, from the question bank)

1. What is a t-test?
2. Which t-test should I use: one-sample, two-sample or paired?
3. Welch or Student's (pooled) t-test?
4. What does the p-value mean? (correct definition)
5. One-tailed or two-tailed?
6. What are the assumptions of a t-test?
7. What is Cohen's d (effect size)?
8. How do I calculate degrees of freedom?
9. Can I run a t-test from mean, SD and n only?
10. What if my data aren't normal or my sample is small?
11. t-test vs z-test vs ANOVA

## 7. Done when

- [ ] `t-test-engine.ts` + Student-t functions + R fixtures; `npm run verify` passes.
- [ ] InputGuide above the inputs; t-curve working; ToolShell + TabSlider + fonts + `<main>`.
- [ ] No "accept the null" or "probability the null is true" wording anywhere.
- [ ] Registrations + docs; `graphify update .`.
