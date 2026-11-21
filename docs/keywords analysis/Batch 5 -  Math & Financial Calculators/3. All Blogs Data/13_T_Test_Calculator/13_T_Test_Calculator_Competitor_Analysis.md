# T-Test Calculator — Competitor Analysis

> **Target page:** KKCTools `/t-test-calculator/` (Batch 5, Tool #13 🟡)
> **Primary keyword:** `t-test calculator` — US 1,900 · **KD 2** · declining (single-keyword cluster)
> **SERP source:** ⚠ No Semrush SERP export for Batch 5. Competitors come from a live web search on 2026-11-14 for `t-test calculator two sample paired one sample`. `TODO(owner): pull Google top 10 (keyword note: GraphPad holds #1).`
> **Pages visited (2026-11-14):** 6 read (GraphPad QuickCalcs, Omni, Inch Calculator, 8gwifi, AAT Bioquest, MathCheck).

---

## 0. How this was collected (read first)

- **Who ranks:**
  - GraphPad: the stats-software brand and the expected #1.
  - Omni.
  - Inch.
  - 8gwifi.
  - AAT Bioquest: a life-science vendor.
  - MathCheck.
  - Others not read: Firgelli, coddy, easyunitconverter, mycalcbuddy.
- **Several pages misdefine statistical terms.** AAT says "p-value is the probability that the null is true" and "accept the null". Inch says "t ≥ 2 is enough" and uses the CLT to justify normality. Our copy must define these correctly.
- **Reuses our engine.** This shares the stats engine with Standard Deviation (#11), plus a t-distribution CDF (regularised incomplete beta).
- All examples on MathCheck (the only page with numbers) were recomputed. No competitor text was copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | graphpad.com/quickcalcs/ttest1/ | Stats software brand | T test calculator | ~1,100 |
| 2 | omnicalculator.com/statistics/t-test | Giant | t-test Calculator | ~1,700 |
| 3 | inchcalculator.com/t-test-calculator/ | Calc site | T-Test Calculator | ~1,300 |
| 4 | 8gwifi.org/t-test-calculator.jsp | Dev-tools site | T-Test Calculator (one-sample · two-sample · paired · Welch · t curve) | ~900 |
| 5 | aatbio.com/tools/one-two-sample-independent-paired-student-t-test-calculator | Life-science vendor | T-Test Calculator | ~700 |
| 6 | mathcheck.net/calculators/t-test | Calc site | T-Test Calculator | 1,600–1,800 |

**What this tells us:**
- **GraphPad** (likely #1) is solid but basic.
  - Input: raw data up to 2,000 rows, or mean/SEM/N, or mean/SD/N.
  - Tests: unpaired, Welch (labelled "rarely used") and paired.
  - Outputs: t, df, p, SE, mean difference, CI.
  - Weak spots: **two-tailed only**, no worked example, no FAQ, no author or date.
- **MathCheck has the most complete feature list.**
  - Tests: one-sample, Welch, pooled, paired.
  - Input modes: raw, summary, or t/df.
  - Extras: Δ (hypothesised difference), CI, Cohen's d and critical value.
  - Its examples check out apart from 4th-decimal rounding.
  - Weak spots: a vague team author, and glossary definitions that are wrong.
- **AAT adds diagnostics.** It runs Shapiro-Wilk and draws Q-Q, histogram and box plots. Its interpretations are wrong, and its Welch switching rule is non-standard.
- **Nobody puts all of these together:**
  - Welch as the **default** with a reason given
  - a correct plain-English verdict
  - effect size with its CI
  - a t-curve visual with the shaded p region
  - a normality hint
  - a sample-size or power link

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | GraphPad | Omni | Inch | 8gwifi | AAT | MathCheck |
|---|---|---|---|---|---|---|
| One-sample | ⚠️ (separate page) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Two-sample pooled | ✅ | ✅ (article) | ✅ | ✅ | ✅ | ✅ |
| Welch (unequal variances) | ✅ ("rarely used") | ⚠️ (article; tool unclear) | ❌ (formula only) | ✅ | ⚠️ (non-standard trigger) | ✅ |
| Paired | ✅ | ✅ (article) | ❌ (text only) | ✅ | ✅ | ✅ |
| Raw data input | ✅ (≤2,000 rows) | ❌ | ❌ | ✅ | ✅ (Excel paste) | ✅ |
| Summary stats input | ✅ (SD or SEM) | ✅ | ✅ | ❌ | ❌ | ✅ |
| t + df → p | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| One/two-tailed | ❌ (two only) | ✅ (3 options) | ✅ (all p's) | ✅ | ❌ | ✅ |
| α choice | ❌ | ⚠️ | ❌ | ✅ (0.01/0.05/0.10) | ❌ | ✅ |
| Hypothesised difference Δ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| CI of difference | ✅ | ❌ | ❌ | ✅ | ✅ (CI of the mean) | ✅ |
| Effect size (Cohen's d) | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Critical value | ❌ | ✅ | ❌ | ⚠️ | ❌ | ⚠️ (inconsistent) |
| t-curve visual | ❌ | ⚠️ (critical region) | ❌ | ⚠️ (placeholder) | ❌ | ❌ |
| Normality check | ❌ | ❌ | ❌ | ❌ | ✅ (Shapiro-Wilk, Q-Q) | ❌ |
| Descriptives per group | ⚠️ | ❌ | ⚠️ | ⚠️ | ✅ | ✅ |
| Plain verdict | ⚠️ | ✅ | ❌ | ✅ | ⚠️ ("accept null", wrong) | ✅ |
| Presets / examples | ❌ | ⚠️ (linked) | ❌ | ✅ (4 quick presets) | ❌ | ✅ |

---

## 3. Feature matrix — content and trust

| Item | GraphPad | Omni | Inch | 8gwifi | AAT | MathCheck |
|---|---|---|---|---|---|---|
| Formulas | ⚠️ (image) | ✅ (incl. Satterthwaite df) | ✅ | ⚠️ (no Welch df) | ❌ | ✅ |
| Worked numeric examples | ❌ | ❌ (linked) | ❌ | ❌ | ❌ | ✅ (checked) |
| Which-test guidance | ✅ | ✅ | ⚠️ | ✅ table | ⚠️ | ✅ |
| Correct p-value definition | ✅ | ✅ | ⚠️ (one tail only) | ✅ | ❌ ("prob null is true") | ⚠️ (loose) |
| Assumptions explained | ✅ | ⚠️ | ⚠️ (CLT misused) | ⚠️ (n ≥ 30 rule) | ⚠️ (overstated) | ❌ |
| FAQ count | 0 | 3 | 0 | 6 | 0 | yes |
| Named author | ❌ | ✅ PhD + reviewers | ✅ + PhD reviewer | ❌ | ❌ | ❌ (team) |
| Date | ❌ | ❌ | ❌ | ❌ | ⚠️ | ✅ Sep 2026 |

---

## 4. Competitor-by-competitor detail

### 1. GraphPad: T test calculator (QuickCalcs)
- **Input:** raw data (50 or 2,000 rows), or mean, SEM and N, or mean, SD and N.
- **Tests:** unpaired, Welch, paired.
- **Outputs:** p, t, df, SE, mean difference, CI, plus a data review.
- **Content:** explains t tests, how they compare with ANOVA and regression, the assumptions, how to read p values, and graphing advice.
- **Weak points:**
  - Two-tailed only.
  - No numeric example.
  - Formula shown only as an image.
  - Doesn't say which options are disabled when you enter summary data.
  - No author or date.
  - Calls to action for GraphPad Prism.

### 2. Omni: t-test Calculator (Anna Szczepanek PhD; reviewers Czernia PhD, Bowater)
- **Inputs:** t and df, or summary stats.
- **Tails:** two, left or right.
- **Outputs:** p, critical region, interpretation.
- **Article covers:**
  - one-sample, two-sample and paired tests
  - pooled SD
  - Welch with Satterthwaite df, plus the conservative min(n₁−1, n₂−1) df
- **FAQs (3):**
  1. What a t-test is
  2. The types of t-test
  3. How to find the one-sample t
- **Weak points:**
  - No numeric examples on the page itself (they are linked).
  - Doesn't recommend Welch by default.
  - No CI.

### 3. Inch Calculator: T-Test (Joe Sexton; reviewer Libgober PhD)
- **Tools:** single-sample and two-sample (pooled).
- **Outputs:** 3 p-values, t, df, pooled SD, SE.
- **Errors:**
  - "t ≥ 2 is typically enough". This ignores df and tails.
  - Uses the CLT to say the assumptions will be "approximately satisfied". The CLT is about sample means, not about the data being normal or independent.
  - The p-value is defined for one tail only.
- **Weak points:** no paired tool, no Welch, no example, no FAQ.

### 4. 8gwifi: T-Test Calculator
- **Tests:** one-sample, pooled, paired, Welch.
- **Settings:** α of 0.01, 0.05 or 0.10; tails.
- **Input:** raw data. 4 quick presets (exam, drug trial, weight loss, teaching).
- **Outputs, per the text:** t, df, p, CI, Cohen's d. Also a "t-distribution visualization", which shows only a placeholder.
- **FAQs (6):**
  1. Which test to use
  2. p-values
  3. Cohen's d
  4. Assumptions
  5. Tails
  6. When to avoid a t-test
- **Weak points:** no Welch df formula; uncited claims; no author or date; sponsored clutter.

### 5. AAT Bioquest: T-Test Calculator
- **Tests:** one-sample, paired, unpaired, Welch.
- **Diagnostics:** Shapiro-Wilk, Q-Q, histogram and box plots, descriptives.
- **Errors:**
  - "The p-value is the probability that the null hypothesis is true."
  - "Accept the null hypothesis."
  - Switches to Welch when the "variance ratio is < 0.05", which is non-standard.
  - Claims all t-tests assume equal variances.
- **Weak points:** no tails option, no example, no FAQ.

### 6. MathCheck: T-Test Calculator (team, Sep 2026)
- **Tests:** one-sample, Welch, pooled, paired.
- **Input modes:** raw, summary, or t/df. Hypothesised difference Δ. Tails.
- **Outputs:** t, df, p, decision, CI, Cohen's d, critical value.
- **Examples (all ✔ to 4 decimals):**
  - one-sample t = 2.2097
  - pooled 1.5555
  - Welch 3.2612
  - paired 3.4895
  - t = 2.2 with df 14 → p ≈ 0.045
- **Weak points:**
  - The glossary's CI and p definitions are wrong.
  - Never mentions normality or outliers.
  - Glossary tooltips fused into the text.
  - No sources.

---

## 5. Patterns

**One-sample test**
- t = (x̄ − μ₀)/(s/√n)
- df = n − 1

**Pooled two-sample test**
- sₚ² = ((n₁−1)s₁² + (n₂−1)s₂²)/(n₁+n₂−2)
- t = (x̄₁ − x̄₂ − Δ)/(sₚ√(1/n₁ + 1/n₂))
- df = n₁ + n₂ − 2

**Welch test**
- t = (x̄₁ − x̄₂ − Δ)/√(s₁²/n₁ + s₂²/n₂)
- Satterthwaite df = (s₁²/n₁ + s₂²/n₂)² / ((s₁²/n₁)²/(n₁−1) + (s₂²/n₂)²/(n₂−1))

**Paired test**
- Compute the differences dᵢ, then apply the one-sample formula to d.

**p-value and confidence interval**
- p comes from the t CDF via the regularised incomplete beta function.
- Two-tailed p = 2(1 − F(|t|)).
- CI = diff ± t*(α/2, df) × SE.

**Effect size**
- One-sample and paired: Cohen's d = diff / s.
- Two-sample: d = diff / sₚ.
- Optionally report Hedges' g, which corrects small-sample bias.

**Default test:** use **Welch** for two independent samples. Many stats texts now recommend this, and it is also the default in R `t.test`. `TODO(owner)`: confirm the citation for "recommended default".

**Plain-English verdict**
- "At α = 0.05 the difference is / is not statistically significant (p = …)."
- Never say "accept the null" and never say "probability the null is true".

**Counts across the 6 pages**

| Section | Pages (of 6) |
|---|:---:|
| All 3 test types in tool | 4 |
| Welch in tool | 3 |
| Raw + summary input | 2 |
| Tails choice | 4 |
| CI | 3 |
| Effect size | 2 |
| t-curve visual (working) | **0** |
| Correct interpretation wording | 2–3 |
| Numeric worked examples | 1 |

---

## 6. FAQ question bank

★ = asked on 2+ pages or a cluster keyword. Map to: t-test calculator.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is a t-test? | Omni, GraphPad, 8gwifi |
| 2 | ★ Which t-test should I use (one-sample, two-sample, paired)? | Omni, 8gwifi, GraphPad, MathCheck |
| 3 | ★ Welch vs Student's (pooled) t-test? | GraphPad, 8gwifi, MathCheck, Omni |
| 4 | ★ What does the p-value mean? | 8gwifi, AAT (wrong), Inch (partial) |
| 5 | ★ One-tailed vs two-tailed? | 8gwifi, Omni |
| 6 | What are the assumptions of a t-test? | GraphPad, 8gwifi, AAT |
| 7 | What is Cohen's d / effect size? | 8gwifi, MathCheck |
| 8 | How do I calculate degrees of freedom? | Omni |
| 9 | Can I run a t-test from mean, SD and n only? | GraphPad, Omni, MathCheck |
| 10 | What if my data are not normal (small samples)? | — |
| 11 | t-test vs z-test vs ANOVA | GraphPad |

---

## 7. Gaps nobody fills — our opportunities

1. **All tests, all input modes:**
   - Tests: one-sample, paired, Welch (default), pooled.
   - Inputs: raw data, summary stats (SD or SEM), or t and df.
2. **Full output:**
   - descriptives for each group
   - t, df, one- and two-tailed p
   - critical value, CI of the difference
   - Cohen's d and Hedges' g
   - a correct plain-English verdict
3. **Theme-aware SVG t-curve** with the p region shaded and the critical lines marked.
4. **Assumption helper:**
   - flag outliers using the IQR rule (#3)
   - flag skew
   - for small n, suggest checking normality
   - optionally run Shapiro-Wilk (`TODO(owner)`: confirm the implementation reference)
5. **Hypothesised difference Δ** and a choice of α.
6. **Correct definitions** of p-value and CI. Several competitors get these wrong.
7. **Worked examples we verify** (fixtures checked against R).
8. **Links** to Standard Deviation (#11), A/B Test (#4), IQR (#3) and Binomial (#12).

---

## 8. Blueprint for the KKCTools T-Test Calculator

### 8.1 SEO

- **URL:** `/t-test-calculator/`
- **Title:** T-Test Calculator – One, Two-Sample & Paired
- **H1:** T-Test Calculator: One-Sample, Two-Sample and Paired t-Tests
- **Meta:** as in the keyword file (154 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Tests | One-sample · Paired · Two-sample Welch (default) · Two-sample pooled |
| Input | Raw (paste) · Summary (mean, SD or SEM, n) · t + df |
| Settings | α (0.10/0.05/0.01/custom), tails, Δ |
| Outputs | Descriptives, t, df, p (1- and 2-tailed), critical t, CI, d / g, verdict sentence |
| Visual | t-curve SVG with shaded regions |
| Checks | Outliers / skew flags; small-n note; optional Shapiro-Wilk |
| Engine | Incomplete beta for t CDF, inverse t for critical values (validated) |
| UX | Copy results, share URL (small data), no network |

### 8.3 Content outline (≈ 1,500–1,800 words, original)

1. Intro (primary keyword)
2. How to use
3. Choosing the right t-test (decision table)
4. One-sample t-test, with an example
5. Two-sample t-test: Welch vs pooled, with an example
6. Paired t-test, with an example
7. Reading the results: p-value, CI, effect size (correct definitions)
8. Assumptions and what to do when they fail
9. One- vs two-tailed tests
10. FAQ (10)
11. Related tools: Standard Deviation (#11), A/B Test (#4), IQR (#3), Binomial (#12)

### 8.4 Quality checks

- **Unit tests** against R `t.test` fixtures (`TODO(owner)`: generate them):
  - Welch df
  - pooled
  - paired
  - Δ
  - every tail option
  - CI
  - d and g
  - edge cases: n < 2, s = 0
- **Inverse t:** test against tables to 1e-6.
- No competitor wording copied. `npm run check:no-network` passes.
- **`TODO(owner)`:** pull Google top 10; confirm the citation for the Welch default; decide whether Shapiro-Wilk is in scope.
