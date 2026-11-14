# A/B Test Significance Calculator — Competitor Analysis

> **Target page:** KKCTools `/ab-test-significance-calculator/` (Batch 5, Tool #4 ✅)
> **Primary keyword:** `stat sig calculator`. US 1,900 · KD 11 · **CPC $23.11** (single-keyword cluster; owner note: pull `ab test calculator` and `sample size calculator` data)
> **SERP source:** ⚠ There is no Semrush SERP export for Batch 5. Competitors come from a live web search on 2026-11-14 for `stat sig calculator a/b test significance`. `TODO(owner): pull Google top 10 + "ab test calculator" / "sample size calculator" volumes.`
> **Pages visited (2026-11-14):** 5 read: SurveyMonkey, Convert, Mida, Optibase, Analytics-Toolkit. VWO redirected to wingify.com and was not re-fetched; it is noted from the search result only.

---

## 0. How this was collected (read first)

- **Who ranks:** the SERP is all **SaaS lead-gen tools**:
  - SurveyMonkey, Convert, VWO/Wingify, Mida, Optibase, Elementor, Shout, Userjot, Swetrix, Knock, Superlines
  - Analytics-Toolkit, which is a specialist statistics vendor
  - The calculators are bait for paid testing products. Our angle is a neutral, transparent tool that runs fully in the browser.
- **Pages read:**
  - SurveyMonkey: a big brand, with an error in its explanation.
  - Convert: the most complete planning tool, covering frequentist, sequential and Bayesian methods.
  - Mida: transparent maths, but one-tailed.
  - Optibase: has a solid FAQ.
  - Analytics-Toolkit: the expert benchmark (Dunnett, SRM, non-inferiority), but it requires sign-up.
- **Not read:** VWO (redirected to wingify.com; the search result says Bayesian). `TODO(owner)`: check it in a browser.
- **Re-checked:** every z, p and sample-size figure. **Several pages misstate what a p-value means** (§4). Our copy must define it correctly.
- No competitor text copied. No live data is needed; this is pure maths.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | surveymonkey.com/learn/research-and-analysis/ab-testing-significance-calculator/ | Survey SaaS | A/B testing calculator for statistical significance | ~1,000 |
| 2 | convert.com/tools/ab-split-multivariate-test-duration-visitor-calculator/ | Testing SaaS | The statistical significance calculator for A/B tests | ~1,100 |
| 3 | mida.so/ab-testing-significance-calculator | Testing SaaS | Statistical Significance Calculator for A/B Tests | ~1,000 |
| 4 | optibase.io/ab-test-significance-calculator | Webflow testing SaaS | A/B test significance calculator | ~550 |
| 5 | analytics-toolkit.com/statistical-calculators | Stats vendor | Statistical calculators (A/B, sample size, power, SRM…) | 500–600 |
| — | vwo.com → wingify.com/tools/ab-test-significance-calculator/ | Testing SaaS | (Bayesian) | **not read (redirect)** |

**What this tells us:**
- **Defaults differ, so the same data gives different answers.**
  - SurveyMonkey's p-value (0.0157) matches a **one-sided** test, but the page never says so.
  - Mida is **one-tailed** by design, so its "95 %" equals a two-sided 90 % threshold.
  - Convert and Optibase recommend **two-sided** by default.
- **Most pages misdefine the p-value.**
  - SurveyMonkey says "95 % confident the difference is authentic" and even "z-score is 14 %".
  - Optibase says "3 % chance the lift is a fluke".
  - Mida says the result "would go the same way 95 times in 100".
- **Few pages offer sample size, power and MDE.**
  - Convert plans sample size and duration but shows no formulas or examples.
  - Mida shows a required sample but hides its 80 % power assumption.
  - SurveyMonkey reports 86.69 % power, which we could not reproduce (≈ 69 % one-sided).
- **Multiple variants:**
  - Analytics-Toolkit applies Dunnett's correction automatically.
  - Convert offers Bonferroni or Šidák.
  - Optibase tells the user to apply Bonferroni by hand.
  - Mida and SurveyMonkey are A/B only.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | SurveyMonkey | Convert | Mida | Optibase | Analytics-Toolkit |
|---|---|---|---|---|---|
| Visitors + conversions A/B | ✅ | ✅ | ✅ | ✅ | ✅ |
| Conversion rates | ✅ | ✅ | ✅ | ✅ | ✅ |
| Relative uplift | ✅ | ✅ | ✅ | ✅ | ✅ |
| Absolute difference (pp) | ❌ | ⚠️ | ❌ | ❌ | ✅ |
| z-score | ❌ (and misdescribed) | ⚠️ | ⚠️ formula | ✅ | ✅ |
| p-value | ✅ (one-sided, unlabelled) | ✅ | ⚠️ confidence only | ✅ | ✅ |
| Confidence interval for the difference | ❌ | ✅ | ❌ | ❌ | ✅ |
| One / two-sided choice | ✅ | ✅ (2-sided default) | ❌ (1-tailed fixed) | ✅ (2-sided recommended) | ✅ |
| Confidence level 90/95/99 | ✅ | ✅ | ❌ | ✅ | ✅ |
| Plain-English verdict | ✅ | ⚠️ | ✅ | ❌ (numbers only) | ⚠️ |
| Sample size needed (MDE, power) | ❌ (separate tool) | ✅ (formulas hidden) | ⚠️ (power hidden) | ❌ (separate tool) | ✅ |
| Test duration (traffic/day) | ❌ | ✅ | ❌ | ❌ | ✅ planner |
| Power of observed test | ⚠️ (86.69 %, not reproducible) | ❌ | ❌ | ❌ | ✅ |
| A/B/n with correction | ❌ | ✅ Bonferroni/Šidák | ❌ | ⚠️ manual Bonferroni | ✅ Dunnett |
| SRM check | ❌ | ✅ | ✅ | ❌ | ✅ |
| Bayesian probability to beat | ❌ | ✅ | ❌ | ❌ | ❌ |
| Sequential testing | ❌ | ✅ (method unexplained) | ❌ | ❌ | ⚠️ |
| Revenue / continuous metric | ❌ | ✅ (upload) | ❌ | ❌ | ✅ (upload) |
| No sign-up | ✅ | ✅ | ✅ | ✅ | ❌ (trial) |

---

## 3. Feature matrix — content and trust

| Item | SurveyMonkey | Convert | Mida | Optibase | A-Toolkit |
|---|---|---|---|---|---|
| Test named (two-proportion z) | ❌ | ✅ | ✅ | ❌ | ⚠️ |
| Formula shown | ❌ | ❌ | ✅ Φ(z) | ❌ | ✅ (docs) |
| Worked example | ✅ (default numbers, checked) | ❌ | ✅ (checked) | ❌ | ❌ |
| p-value defined correctly | ❌ | ✅ | ❌ | ❌ | ✅ |
| Peeking / early stopping warning | ❌ | ✅ | ✅ (unsourced "30 %") | ✅ | ✅ |
| Practical vs statistical significance | ❌ | ✅ (MDE "business-relevant") | ❌ | ❌ | ✅ |
| FAQ count | 0 | 8 | yes | 10 | 0 |
| Named author | ❌ | ❌ | ❌ | ❌ | ❌ (page) |
| Date | ✅ Feb 2026 | ❌ | ❌ | ❌ | ❌ |
| Sales pressure | high | high | high | medium | sign-up wall |

---

## 4. Competitor-by-competitor detail

### 1. SurveyMonkey: A/B testing significance calculator (Feb 2026)
- **Inputs and settings:** visitors and conversions for A and B; one- or two-sided hypothesis; confidence of 90, 95 or 99 %.
- **Outputs:** verdict, lift, a confidence sentence, power and p-value.
- **Default check:** 50,000 / 500 vs 50,000 / 570 gives 1.00 % vs 1.14 %, a lift of 14 %. Pooled SE = 0.000651, z = 2.15.
  - One-sided p = 0.0157 ✔ (matches the page).
  - Two-sided p ≈ 0.031, which is not shown.
  - The reported power of **86.69 % cannot be reproduced.** We get about 69 % one-sided, or about 58 % two-sided.
- **Errors:**
  - "z-score is 14 %": that figure is the lift; z is 2.15.
  - "95 % confident the differences are authentic" misreads the p-value.
- **Weak points:** no FAQ, no author, the test is never named, A/B only.

### 2. Convert: Statistical significance calculator (test planning and analysis)
- **Modes:** planning and analysis.
- **Methods:** frequentist, sequential and Bayesian.
- **Metrics:** conversion rate, revenue per visitor, products per visitor (upload).
- **Outputs:**
  - sample per variant and duration
  - MDE curve
  - p-values and confidence intervals
  - SRM check
  - Bayesian probability to win, expected loss and credible interval
- **Methodology:**
  - Two-tailed by default.
  - MDE is defined as the smallest worthwhile lift, not the expected lift.
  - Bonferroni or Šidák correction for multiple variants.
- **FAQs (8):** MDE · method choice · sample size · meaning of significance · one- vs two-tailed · SRM · Type I and II errors · "good" conversion rate.
- **Weak points:** no worked numbers; alpha, power and the formula are hidden; the sequential method is unexplained; trial length conflicts (15 vs 30 days).

### 3. Mida: Statistical Significance Calculator
- **Method:** two-sample proportion z-test, **one-tailed**. Confidence = Φ(z).
- **Default check:** 8 % vs 12 % with n = 1,000 each. Unpooled SE = 0.01339, z = 2.99, confidence 99.86 % ✔.
- **Required sample:** about 884 per variant ✔ at 95 % two-sided with 80 % power. The power assumption is not stated.
- **Data-quality checks:** SRM and conversion volume.
- **Weak points:**
  - The one-tailed 95 % threshold is lenient and not flagged.
  - The FAQ says results "would go the same way 95/100 times", which is wrong.
  - The "30 %" false-positive figure has no source.
  - Input labels are confusing.
  - A/B only.

### 4. Optibase: A/B test significance calculator
- **Outputs:** achieved confidence, p-value, lift, both rates and z. Confidence level and direction are under advanced settings.
- **FAQs (10):**
  1. How to judge significance
  2. Choosing a confidence level
  3. Why results aren't significant
  4. One- vs two-sided
  5. What a p-value means (**misdefined**)
  6. Stopping early
  7. z thresholds 1.96 / 2.58
  8. More than two variants (Bonferroni)
  9. A worse variant
  10. A call to action
- **Weak points:** the test is not named; no verdict in the UI; no sample size or power check; no author or date.

### 5. Analytics-Toolkit: Statistical calculators (expert benchmark)
- **Tools:**
  - A/B testing and test planner
  - significance (binomial and continuous)
  - sample size, power and MDE
  - multiple comparisons
  - meta-analysis
  - SRM
- **Methods:** Dunnett's correction is applied automatically for A/B/n; non-inferiority margins; calculation documentation.
- **Weak points:** sign-up or trial required; continuous metrics need a file upload.

---

## 5. Patterns

- **Core maths (two-proportion z-test):**
  - Rates: p̂A = cA/nA, p̂B = cB/nB.
  - Pooled rate: p = (cA + cB)/(nA + nB).
  - Standard error: SE = √(p(1−p)(1/nA + 1/nB)).
  - z = (p̂B − p̂A)/SE.
  - p-value: two-sided = 2(1 − Φ(|z|)); one-sided = 1 − Φ(z).
- **Confidence interval for the difference:** use the unpooled SE, (p̂B − p̂A) ± z* × √(p̂A(1−p̂A)/nA + p̂B(1−p̂B)/nB).
- **Sample size per arm:** n = (z₁₋α/₂ √(2p̄(1−p̄)) + z₁₋β √(p₁(1−p₁) + p₂(1−p₂)))² / (p₂ − p₁)². Use z₁₋α for one-sided tests.
- **A/B/n:**
  - Bonferroni: α/m.
  - Šidák: 1 − (1−α)^(1/m).
  - Dunnett is more complex and optional.
- **SRM:** χ² goodness-of-fit test of nA vs nB against the planned split.
- **Edge cases:** zero conversions, conversions greater than visitors, and small counts. When the expected count is below 5, warn and suggest Fisher's exact test, or implement it.

| Section | Pages (of 5) |
|---|:---:|
| Lift + p/confidence | 5 |
| One/two-sided choice | 4 |
| Sample size | 3 (formulas shown: 0) |
| CI for difference | 2 |
| Multi-variant correction | 3 |
| SRM | 3 |
| Correct p-value definition | 2 |
| Worked example | 2 |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword. Map to: stat sig calculator, plus (pending owner data) ab test calculator and sample size calculator.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What does statistically significant mean in an A/B test? | SurveyMonkey, Convert, Mida, Optibase |
| 2 | ★ What is a p-value (and what it is not)? | SurveyMonkey ✗, Optibase ✗, Convert ✓ |
| 3 | ★ One-sided vs two-sided: which should I use? | SurveyMonkey, Convert, Optibase, Mida |
| 4 | ★ How many visitors do I need (sample size / MDE)? | Convert, Mida |
| 5 | ★ Can I stop a test as soon as it is significant (peeking)? | Convert, Mida, Optibase |
| 6 | ★ How do I test more than two variants? | Convert, Optibase, A-Toolkit |
| 7 | Which confidence level should I use (90/95/99)? | Optibase, SurveyMonkey |
| 8 | Why is my test not significant? | Optibase |
| 9 | What is sample ratio mismatch (SRM)? | Convert, Mida, A-Toolkit |
| 10 | Statistical vs practical significance | Convert |
| 11 | Frequentist vs Bayesian A/B testing | Convert, VWO |
| 12 | What is a z-score? | Optibase |

---

## 7. Gaps nobody fills — our opportunities

1. **Transparent and neutral.** Name the test, show the formula, show the default (two-sided 95 %) and state every assumption. No sign-up, and no data leaves the browser.
2. **Full result card:**
   - both rates, absolute difference (pp), relative lift
   - z, one- and two-sided p
   - a 95 % CI for the difference
   - verdict sentence and observed power
3. **Correct plain-English interpretation**, written by us. Several competitors get this wrong.
4. **Sample-size mode with visible formulas:** baseline rate, MDE (relative or absolute), α, power, one/two-sided, number of variants. Output n per arm and the duration from daily traffic.
5. **A/B/C… support** with a choice of Bonferroni or Šidák, each variant compared to control.
6. **SRM check** against the planned split.
7. **Edge-case handling** (zero conversions, small counts), with a Fisher's exact option.
8. **Worked examples whose numbers we verify,** for example 1.00 % vs 1.14 % at 50k per arm: z ≈ 2.15, two-sided p ≈ 0.031.
9. **Peeking warning and a pre-registration checklist.**
10. **Links to the Batch 3 business tools** (Percentage Change #1, Profit Margin #3, ROI Batch 5 #18) and the T-Test calculator (#13).

---

## 8. Blueprint for the KKCTools A/B Test Significance Calculator

### 8.1 SEO

- **URL:** `/ab-test-significance-calculator/`
- **Title:** A/B Test Significance Calculator – Stat Sig
- **H1:** A/B Test Significance Calculator: Is Your Result Statistically Significant?
- **Meta:** as in the keyword file (159 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Inputs | Control + 1–4 variants: visitors, conversions; α (90/95/99 %); one/two-sided; correction (none/Bonferroni/Šidák) |
| Outputs | Rates, abs diff, relative lift, z, p (both), CI, verdict, observed power |
| Sample size | Baseline, MDE (rel/abs), α, power, sides, variants, daily traffic → n per arm, total, days |
| Checks | SRM χ² (planned split), small-count warning / Fisher exact |
| UX | Share URL, copy summary, no network |

### 8.3 Content outline (≈ 1,500–1,800 words, original)

1. Intro (primary keyword)
2. How to use
3. How the significance test works: formula and worked example
4. What the p-value and confidence really mean
5. One-sided vs two-sided tests
6. How many visitors you need (sample size, MDE, power): example
7. Testing more than two variants
8. Common mistakes: peeking, SRM, novelty effects, practical significance
9. FAQ (10–12)
10. Related tools: T-Test (#13), Percentage Change (Batch 3 #1), ROI (#18), Standard Deviation (#11)

### 8.4 Quality checks

- **Unit tests** against reference values (`TODO(owner)`: generate fixtures with R `prop.test(correct=FALSE)` and `power.prop.test`):
  - z, p, CI, sample size
  - Bonferroni and Šidák
  - SRM
  - edge cases
- **Normal CDF and inverse:** a validated approximation with tests to 1e-6.
- No competitor wording. `npm run check:no-network` passes.
- `TODO(owner)`:
  - pull Google top 10 and the related keyword volumes
  - check VWO/Wingify (Bayesian) in a browser
  - decide whether a Bayesian mode is in scope for v1
