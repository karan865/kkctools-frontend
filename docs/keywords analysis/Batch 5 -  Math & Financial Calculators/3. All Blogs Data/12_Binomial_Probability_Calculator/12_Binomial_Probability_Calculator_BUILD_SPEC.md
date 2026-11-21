# Binomial Probability Calculator — Build Spec

> **URL:** `/binomial-probability-calculator/` · Batch 5 · Tier 2 · rank chance 🟡 · **Build order 11**
> **Read first:** `../00_BATCH5_BUILD_RULES.md` (§3 stats-engine)
> **Inputs used:**
> - `12_Binomial_Probability_Calculator_Competitor_Analysis.md` (5 pages read, Statistics by Jim blocked; 2026-11-14)
> - keyword file §2 #12
>
> **SERP:** provisional
> **Written:** 2026-11-22 (full rewrite after the research pass)

---

## 0. Strategy

**Keywords:**
- `binomial probability distribution calculator`: 1,900 at **KD 8**.
- `binomial distribution calculator`: 5,400 at KD 22.
- Both are **declining** (AI answers), so this is lower priority within Tier 2.

**Who ranks:**
- Stat Trek: the trusted classic. It has 7 comparison types and 3 correct sample problems, but no chart, variance or steps.
- Pearson and MiniWebtool: the most features, but no numeric worked answers.
- GIGA: the only "trials needed" mode, but its chart is an unlabelled simulation.
- Inch: has errors. Its table is mislabelled as cumulative, a die roll is called "normal", and the complement wording is wrong.
- Statistics by Jim: blocked for us. `TODO(owner)`: check it.

**Gap:** no page combines all of these:
- every comparison;
- full moments;
- a highlighted chart;
- steps;
- a normal approximation **with criteria and continuity correction**;
- inverse modes;
- large-n stability.

## 1. Keywords and placement

| Role | Keyword | US vol | KD | Where it goes |
|---|---|---:|---:|---|
| **Primary** | binomial probability distribution calculator | 1,900 | 8 | First sentence, tool heading, H2 |
| Secondary | binomial distribution calculator | 5,400 | 22 | Title wording, H2 "Mean, variance and shape of the binomial distribution" |
| Natural | binomial probability formula · at least one probability · n choose k · cumulative binomial | — | — | H2s, inverse tab |

## 2. Our edge (5 competitors checked)

| Feature | Competitors with it |
|---|---|
| Exact + cumulative | 5/5 |
| Between / outside | 3/5 |
| Mean, variance, SD, **mode, skewness** | 2/5 full |
| Theme-aware SVG bars, selected region highlighted, + copyable PMF/CDF table | 2/5 real charts |
| **Steps with the user's numbers** (C(n,k), powers, each cumulative term, collapsible) | 1/5 |
| **Normal approximation with stated criteria + continuity correction + error vs exact** | 1/5 (FAQ only) |
| **Inverse:** trials needed for P(at least one) ≥ target; smallest k for a cumulative target | 1/5 |
| Large n (≈10⁶) via log-gamma / incomplete beta | rare |
| Assumption checklist (fixed n, two outcomes, constant p, independence) | partial |

## 3. Calculator spec

### 3.1 Tabs

1. **Probability** (default)
2. **Trials needed / inverse**
3. **Normal approximation**

### 3.2 Input guide diagram (above the inputs)

`BinomialInputGuide.tsx`:
- A row of trial icons (coins) for "1 Number of trials (n)".
- Some coins highlighted as "2 Successes (k)".
- A dial for "3 Probability of success on each trial (p)".
- A comparison picker "4 Exactly / at most / at least / between".
- A mini bar chart under it, with the selected bars shaded.

### 3.3 Inputs

| Field | Default |
|---|---|
| n | 10 |
| p | 0.5 (decimal or %) |
| k | 3 (k₂ for between/outside) |
| Comparison | =, <, ≤, >, ≥, between, outside |
| Inverse | target probability 99.99%, p = 1% → trials needed |
| Normal-approx rule | np ≥ 10 and n(1−p) ≥ 10 (some texts use 5). `TODO(owner)`: pick the rule and cite the textbook |

### 3.4 Engine (`src/lib/stats-engine.ts`)

```ts
logC(n,k) = lgamma(n+1) − lgamma(k+1) − lgamma(n−k+1) ; pmf = exp(logC + k ln p + (n−k) ln(1−p))
cdf(k) = Σ pmf (small n) or regularized incomplete beta I_{1−p}(n−k, k+1) (large n)
P(≥k) = 1 − F(k−1) ; P(>k) = 1 − F(k) ; between = F(k2) − F(k1−1)
mean np ; var np(1−p) ; sd ; mode ⌊(n+1)p⌋ ; skew (1−2p)/√(np(1−p))
normal approx with continuity correction: P(X ≤ k) ≈ Φ((k + 0.5 − np)/σ), shown with the error vs exact
trialsNeeded(P, p) = ⌈ln(1−P)/ln(1−p)⌉ ; smallest k with F(k) ≥ target
```

**Worked examples (checked 2026-11-22):**

| Case | Result |
|---|---|
| n = 10, p = 0.5 | **P(X = 3) = 0.1172** · **P(X ≤ 3) = 0.1719** · mean 5 · variance 2.5 · SD 1.581 · mode 5 |
| Trials needed for 99.99% chance of at least one success at p = 1% | **917** (matches GIGA's correct figure) |

### 3.5 Outputs

- **Probability + sentence:** "The probability of exactly 3 successes in 10 trials at p = 0.5 is 0.1172 (11.72%)."
- Moments table. Bar chart with the highlighted region. PMF/CDF table (Copy CSV).
- Steps (collapsible).
- Normal approximation (if the criteria are met), with its error.
- Assumption checklist. Share URL.

### 3.6 Tests

- PMF/CDF against Stat Trek-style fixtures (`TODO(owner)`: R `dbinom`/`pbinom` fixtures).
- All comparisons; large n (10⁶) without overflow.
- p = 0 or 1 edge cases; k > n.
- Trials-needed.
- Normal approximation with continuity correction. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Binomial Probability Calculator – P(X = k)` (42; 54 with the suffix: OK) |
| Meta | `Free binomial probability calculator. Enter trials, successes and probability to get P(X = k), P(X ≤ k) and P(X ≥ k), with the mean, variance and a chart.` (154) |
| H1 | `Binomial Probability Calculator: Exactly, At Most and At Least k` |
| BLUF | "This binomial probability distribution calculator uses P(X = k) = C(n, k) × pᵏ × (1 − p)ⁿ⁻ᵏ. For 10 fair coin flips, the chance of exactly 3 heads is 0.1172, and of 3 or fewer is 0.1719." (engine) |
| ToolShell pills | `Exactly, at most, at least & between`, `Distribution chart`, `Steps with your numbers`, `Trials needed` |
| Links out | Standard Deviation (#11), T-Test (#13), A/B Test (#4), IQR (#3) |
| Links in | Standard Deviation, A/B Test, Tools hub "Stats" |

## 5. Content (~1,300–1,600 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the binomial probability distribution calculator | 3 tabs | 100 |
| 2 | When is a problem binomial? | 4-point checklist | 130 |
| 3 | The binomial probability formula | Example with C(n,k) | 200 |
| 4 | Exactly, at most, at least and between | Examples | 200 |
| 5 | Mean, variance and shape of the binomial distribution | `binomial distribution calculator` | 150 |
| 6 | Normal approximation and continuity correction | Criteria (cited), example, error | 180 |
| 7 | "At least one" and how many trials you need | Example (917 trials) | 150 |
| 8 | Binomial vs Poisson vs normal | Short | 100 |
| 9 | FAQ | §6 | 380 |

## 6. FAQ (10, from the question bank)

1. What is a binomial distribution, and when does it apply?
2. What is the binomial probability formula?
3. Exactly vs at most vs at least: what's the difference?
4. What are the mean and variance of a binomial distribution?
5. When can I use the normal approximation?
6. How do I calculate "at least one success"?
7. How many trials do I need for a target probability?
8. What makes a problem not binomial?
9. What is a cumulative binomial probability?
10. Binomial vs Poisson vs normal: which should I use?

## 7. Done when

- [ ] `stats-engine` binomial functions + tests (R fixtures); `npm run verify` passes.
- [ ] InputGuide above the inputs; ToolShell + TabSlider + fonts + `<main>`.
- [ ] Normal-approximation rule chosen and cited.
- [ ] Registrations + docs; `graphify update .`.
