# Binomial Probability Calculator — Competitor Analysis

> **Target page:** KKCTools `/binomial-probability-calculator/` (Batch 5, Tool #12 🟡)
> **Primary keyword:** `binomial probability distribution calculator`: US 1,900 · KD 8. The cluster has 2 keywords and 7,300 US vol, including `binomial distribution calculator` at 5,400. Both are declining.
> **SERP source:** ⚠ No Semrush SERP export for Batch 5. Competitors come from a live web search for `binomial probability distribution calculator` on 2026-11-14. `TODO(owner): pull Google top 10.`
> **Pages visited (2026-11-14):** 5 read (Stat Trek, Pearson, GIGAcalculator, MiniWebtool, Inch Calculator). 1 blocked (Statistics by Jim, 403).

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Education and stats references: Stat Trek, Statistics by Jim, Analyzemath, university pages (UAB, Jain), Pearson
  - Calc sites: GIGA, Inch, MiniWebtool, 8gwifi, InventiveHQ, Calculate.co.nz
  - Vendor docs: SigmaZone
- **Statistics by Jim** is known for graphing the full distribution with the chosen value highlighted, according to the search snippet. It was blocked, so it is `TODO(owner)`: check in a browser.
- **Re-checked:** every example and every table value that was spot-checked.
- **Errors found:**
  - Inch mislabels its table as cumulative.
  - Inch's dice FAQ calls a die roll "normal".
  - Inch's complement wording is wrong.
  - MiniWebtool never answers its own example.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | stattrek.com/online-calculator/binomial | Stats education | Binomial Probability Calculator | ~1,000 |
| 2 | pearson.com/channels/calculators/binomial-distribution-calculator | Education publisher | Binomial Distribution Calculator | 600–700 |
| 3 | gigacalculator.com/calculators/binomial-probability-calculator.php | Stats calc site | Binomial Distribution Calculator | 850–900 |
| 4 | miniwebtool.com/binomial-probability-distribution-calculator/ | Utility site | Binomial Probability Distribution Calculator | 1,000–1,200 |
| 5 | inchcalculator.com/binomial-distribution-calculator/ | Calc site | Binomial Distribution Calculator | ~1,100 |
| — | statisticsbyjim.com/calculators/binomial-distribution-calculator/ | Stats blog | Binomial Distribution Calculator | **blocked (403)** |

**What this tells us:**
- **Pearson and MiniWebtool cover the most features:**
  - all comparison modes, including between and outside a range
  - a PMF table, a chart, steps, and mean/variance/SD
  - MiniWebtool also gives the mode and skewness
  - Pearson adds a normal-approximation note and a simulation comparison
  - Their weak points: no examples with numeric answers, no author or date (Pearson), and no criteria for the normal approximation (Pearson)
- **Stat Trek is the trusted classic.** It covers all 7 comparison types, mean and SD, 9 FAQs, and 3 sample problems that check out. It has **no chart, no variance, no steps and no normal approximation**.
- **GIGA uniquely offers a "trials needed" mode**, for example the number of draws needed for 99.99 % chance of at least one win (n = 917 ✔). It has no mean or variance, and its chart is a simulation that isn't labelled as one.
- **No page provides all of these together:**
  - exact + cumulative + between, in every direction
  - mean, variance, SD, mode
  - a theme-aware chart that highlights the selected region
  - steps with substituted numbers
  - the normal approximation **with** criteria and continuity correction
  - a trials-needed mode
  - support for large n without overflow

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Stat Trek | Pearson | GIGA | MiniWebtool | Inch |
|---|---|---|---|---|---|
| P(X = k) | ✅ | ✅ | ✅ | ✅ | ✅ |
| P(X <, ≤, >, ≥ k) | ✅ | ✅ | ✅ (selector not visible) | ✅ | ✅ |
| Between P(a ≤ X ≤ b) | ✅ | ✅ | ❌ | ⚠️ (form vs schema mismatch) | ❌ |
| Outside a range | ✅ | ✅ | ❌ | ❌ | ❌ |
| Mean / variance / SD | ⚠️ mean, SD | ✅ (toggle) | ❌ | ✅ (+ mode, skew) | ❌ |
| Full PMF / CDF table | ❌ | ✅ | ❌ | ✅ | ⚠️ (static, **mislabelled**) |
| Chart with the region highlighted | ❌ | ✅ | ⚠️ (static simulation image) | ✅ PMF + CDF | ⚠️ (illustration) |
| Steps with the user's numbers | ❌ | ✅ (toggle) | ❌ | ⚠️ (claimed) | ❌ |
| Normal approximation | ❌ | ⚠️ (note, no criteria) | ❌ | ✅ (rule in FAQ) | ❌ |
| Continuity correction shown | ❌ | ❌ | ❌ | ❌ | ❌ |
| Trials needed for a target probability | ❌ | ❌ | ✅ | ❌ | ❌ |
| Solve p for a target | ❌ | ❌ | ❌ | ❌ | ❌ |
| Plain-language interpretation | ❌ | ✅ | ⚠️ | ❌ | ❌ |
| Large n (log-gamma) | ? | ? | ? | ⚠️ (n ≤ 1,000) | ? |
| Input validation stated | ❌ | ❌ | ❌ | ✅ ranges | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Stat Trek | Pearson | GIGA | MiniWebtool | Inch |
|---|---|---|---|---|---|
| Formula (PMF/CDF) | ✅ (rendering garbled) | ✅ | ✅ (image) | ✅ | ✅ |
| Worked examples with answers | ✅ 3 (checked) | ⚠️ (setups only) | ✅ 5 (checked) | ❌ (basketball question unanswered) | ✅ coin (checked) |
| Assumptions (independence, fixed p) | ✅ FAQ | ❌ | ⚠️ | ✅ | ⚠️ (incomplete) |
| Errors | name typo "Nichlaus"; "experient" | — | typos; simulation image unlabelled | video date mismatch | **table mislabelled cumulative; die = "normal"; complement wrong** |
| FAQ count | 9 | ~5 | 0 | 6 | several |
| Named author | ✅ H.G. Berman | ❌ | ✅ G. Georgiev | ❌ team | ✅ + 2 PhD reviewers |
| Date | ❌ | ❌ | ✅ Aug 2026 | ✅ Jan 2026 | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. Stat Trek — Binomial Probability Calculator (H.G. Berman)
- **Inputs:** p, n, x (or x1 and x2).
- **Outputs:** 7 probabilities (=, <, ≤, >, ≥, between, outside), plus mean and SD.
- **Examples:**
  - n 12, p 0.5, x 7: 792/4096 = 0.193 ✔; P(≤7) = 0.806 ✔.
  - n 3, p 0.6: P(≤2) = 0.784 ✔.
  - n 72, p 0.22, 14–17: 0.431 (plausible).
- **FAQs (9):**
  1. Experiment
  2. Distribution
  3. Formula
  4. Trials
  5. Successes
  6. p
  7. Binomial probability
  8. Cumulative probability
  9. Mean/SD
- **Weak points:**
  - No chart, variance, steps or normal approximation.
  - Typos ("Nichlaus", "experient").
  - The AP-exam claim is unsourced.

### 2. Pearson — Binomial Distribution Calculator
- **Modes:** all 7 comparisons.
- **Optional outputs:** shaded bar chart, formula, stats, table, interpretation, steps, normal-approximation note, simulation comparison.
- **Weak points:**
  - The examples have no numeric answers. Our check gives 0.1172, 0.1719 and 0.8656.
  - No criteria for the normal approximation.
  - The fields used by the "outside" mode are unclear.
  - No author or date.

### 3. GIGAcalculator — Binomial (Georgi Georgiev, Aug 2026)
- **Modes:** exact and cumulative probability, plus **trials needed** for a desired probability.
- **Examples (all ✔):**
  - 5 of 10 heads = 24.61 %.
  - More than 2 sixes in 20 rolls = 67.13 %.
  - 99.99 % at 1 % per draw needs 917 trials.
  - 50 of 100 heads = 7.96 %.
- **Weak points:**
  - No mean or variance.
  - The chart is a simulation (10,000 runs) but not labelled as one.
  - Formulas shown as images.
  - Typos ("isuues").
  - No FAQ.

### 4. MiniWebtool — Binomial Probability Distribution (updated Jan 2026)
- **Inputs:** n (1–1,000), p, k.
- **Outputs:** exact and cumulative probabilities, range, PMF table, mean, variance, SD, mode, skewness. PMF and CDF charts.
- **FAQs (6):** these include the complement rule and the normal-approximation rule of thumb (np and n(1 − p) > 5).
- **Gap:** the basketball example (n 10, p 0.75, P(X ≥ 8)) is never answered. The answer is ≈ **0.5256**.
- **Weak points:** clutter (ads and "Ask AI"); a date inconsistency.

### 5. Inch Calculator — Binomial Distribution (Joe Sexton; reviewers Libgober PhD and Heath PhD)
- **Inputs:** p, n, x.
- **Outputs:** P(=, <, ≤, >, ≥).
- **Content:** CDF formula ✔; coin example P(≤2 | n 6) = 0.344 ✔; static table for n 1–20.
- **Errors:**
  - The table is called "cumulative" but shows P(X = x).
  - The FAQ says a die roll is "a normal distribution". It is discrete uniform.
  - It says "1 − F(x) = at least x". 1 − F(x) is P(X > x); "at least x" is 1 − F(x − 1).
  - Broken anchor.
- **Weak points:** no mean, variance or normal approximation.

---

## 5. Patterns

- **PMF:** P(X = k) = C(n,k) pᵏ (1 − p)ⁿ⁻ᵏ.
  - For large n, compute in log space with lgamma, or use a recurrence, to avoid overflow and underflow.
- **CDF:** sum of the PMF from 0 to k. Use the regularised incomplete beta for big n. Then:
  - P(X ≥ k) = 1 − F(k − 1)
  - P(X > k) = 1 − F(k)
- **Moments:**
  - Mean = np
  - Variance = np(1 − p)
  - SD = √variance
  - Mode = ⌊(n + 1)p⌋
  - Skew = (1 − 2p)/√(np(1 − p))
- **Normal approximation:**
  - Show it only when np ≥ 10 and n(1 − p) ≥ 10. Some texts use 5. State which rule we use and cite the textbook. `TODO(owner)`: pick the rule and the source.
  - Apply a continuity correction (e.g. P(X ≤ k) ≈ Φ((k + 0.5 − np)/σ)).
  - Show the approximation error next to the exact value.
- **Trials needed (at least one success with probability P):** n = ⌈ln(1 − P)/ln(1 − p)⌉.

| Section | Pages (of 5) |
|---|:---:|
| Exact + cumulative | 5 |
| Between | 3 |
| Mean/var/SD | 2 full |
| Chart | 2 real |
| Steps | 1 |
| Normal approx with criteria | 1 (FAQ) |
| Trials-needed | 1 |
| Correct, complete examples | 3 |

---

## 6. FAQ question bank

★ = asked on 2+ pages or a cluster keyword. Map to: binomial probability distribution calculator, binomial distribution calculator.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is a binomial distribution and when does it apply? | Stat Trek, MiniWebtool, Inch, GIGA |
| 2 | ★ What is the binomial probability formula? | all |
| 3 | ★ Exactly vs at most vs at least: what is the difference? | Stat Trek, Pearson, MiniWebtool |
| 4 | ★ What are the mean and variance of a binomial distribution? | Stat Trek, MiniWebtool |
| 5 | ★ When can I use the normal approximation? | MiniWebtool, Pearson |
| 6 | How do I calculate "at least one success"? | GIGA (trials needed) |
| 7 | How many trials do I need for a target probability? | GIGA |
| 8 | What makes a problem not binomial? | Inch (incomplete) |
| 9 | What is a cumulative binomial probability? | Stat Trek, Inch |
| 10 | Binomial vs Poisson vs normal | — |

---

## 7. Gaps nobody fills: our opportunities

1. **All comparison modes:** =, <, ≤, >, ≥, between, outside. Every result is written as a plain sentence.
2. **Full statistics:** mean, variance, SD, mode, skewness.
3. **Theme-aware SVG bar chart** with the selected region highlighted, plus a PMF/CDF table that can be copied.
4. **Steps with the user's numbers:** C(n,k), the powers, and each term in a cumulative sum (collapsed when there are many terms).
5. **Normal approximation done properly:** stated criteria, continuity correction, and the exact-vs-approximate error.
6. **Inverse modes:** trials needed for P(at least one) or P(≥ k), and the smallest k for a target cumulative probability.
7. **Large-n stability** (log-gamma / incomplete beta), up to about 10⁶ trials.
8. **Assumption checklist:** fixed n, two outcomes, constant p, independent trials.
9. **Correct examples and wording.** Inch's errors are listed above.
10. **Links:** Standard Deviation (#11), T-Test (#13), A/B Test (#4), IQR (#3).

---

## 8. Blueprint for the KKCTools Binomial Probability Calculator

### 8.1 SEO

- **URL:** `/binomial-probability-calculator/`
- **Title:** Binomial Probability Calculator – P(X = k)
- **H1:** Binomial Probability Calculator: Exactly, At Most and At Least k
- **Meta:** as in the keyword file (154 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Inputs | n, p (decimal or %), k (and k₂ for range), comparison type |
| Outputs | Probability + sentence, mean, variance, SD, mode, skew |
| Visual | SVG PMF bars (highlight), optional CDF line; table (copy CSV) |
| Steps | C(n,k), terms, sum (collapsible) |
| Approx | Normal approx with criteria, continuity correction, error |
| Inverse | Trials needed; k for target cumulative probability |
| Engine | log-gamma / incomplete beta, validated |
| UX | Share URL, no network |

### 8.3 Content outline (≈ 1,200–1,500 words, original)

1. Intro (primary keyword)
2. How to use
3. When a problem is binomial (checklist)
4. The binomial formula, with an example
5. Exactly, at most, at least, between: examples
6. Mean, variance and the shape of the distribution
7. Normal approximation and continuity correction
8. "At least one" and how many trials you need
9. FAQ (8–10)
10. Related tools: Standard Deviation (#11), T-Test (#13), A/B Test (#4)

### 8.4 Quality checks

- **Unit tests** against reference values. `TODO(owner)`: generate fixtures from R `dbinom`/`pbinom` for large n and extreme p.
- **Fixtures:**
  - 792/4096
  - basketball 0.5256
  - 917 trials
  - 0.1719
- No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - pull Google top 10
  - check Statistics by Jim manually
  - choose the normal-approximation rule and its source
