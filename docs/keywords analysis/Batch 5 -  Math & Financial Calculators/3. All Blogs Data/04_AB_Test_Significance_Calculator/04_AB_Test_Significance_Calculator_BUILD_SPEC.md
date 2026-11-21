# A/B Test Significance Calculator — Build Spec

> **URL:** `/ab-test-significance-calculator/` · Batch 5 · Tier 1 · rank chance ✅ · **Build order 4**
> **Read first:** `../00_BATCH5_BUILD_RULES.md` (§2.3 statistics rules, §3 stats-engine)
> **Inputs used:** `04_AB_Test_Significance_Calculator_Competitor_Analysis.md` (5 pages read, VWO redirect not read, 2026-11-14), keyword file §2 #4
> **SERP:** provisional
> **Written:** 2026-11-22 (full rewrite after the research pass)

---

## 0. Strategy

**Why this keyword:** `stat sig calculator` has 1,900 searches at KD 11, and a **CPC of $23**. That is the highest ad value in Batch 5: marketers with budgets.

**Who ranks:** only **SaaS lead-gen tools**.
- SurveyMonkey, Convert, VWO/Wingify, Mida, Optibase, Elementor and others.
- Analytics-Toolkit is the expert benchmark, but it requires sign-up.
- Their calculators are bait for paid testing products.

**Our angle:** a **neutral, transparent tool** that names the test, shows the formulas and keeps the data in the browser.

**Their weaknesses (all checked):**

1. **Defaults differ, and most pages don't say which one they use.**
   - SurveyMonkey's p-value (0.0157) is one-sided but unlabeled.
   - Mida is one-tailed, so its "95%" equals a two-sided 90%.
2. **Most pages misdefine the p-value.**
   - SurveyMonkey: "95% confident the difference is authentic", and "z-score is 14%".
   - Optibase: "3% chance the lift is a fluke".
   - Mida: "would go the same way 95 times in 100".
   - Our copy must define it correctly.
3. **Sample size is hidden.**
   - Convert shows no formulas.
   - Mida hides its 80% power assumption.
   - SurveyMonkey's 86.69% power could not be reproduced (we get ≈69% one-sided).

`TODO(owner)`:
- pull `ab test calculator` and `sample size calculator` volumes;
- check VWO (Bayesian) in a browser;
- decide whether a Bayesian mode is in scope (not in v1 by default).

## 1. Keywords and placement

| Role | Keyword | US vol | KD | CPC | Where it goes |
|---|---|---:|---:|---:|---|
| **Primary** | stat sig calculator | 1,900 | 11 | $23.11 | First sentence, title, tool heading |
| Natural | a/b test calculator · statistical significance calculator · ab test sample size calculator · p-value · confidence level | — | — | — | H1 wording, H2s, Sample-size tab |

## 2. Our edge (5 competitors checked)

| Feature | Competitors with it |
|---|---|
| Test named + formula shown + default stated (two-sided 95%) + assumptions | correct definition: 2/5 · formulas: 0/5 |
| Full result card: both rates, absolute diff (pp), relative lift, z, **one- and two-sided p**, 95% CI for the difference, observed power, verdict | lift+p: 5/5 · CI: 2/5 |
| Sample-size mode **with visible formulas**: baseline, MDE (rel/abs), α, power, sides, variants, daily traffic → n per arm, total, days | 3/5, no formulas |
| A/B/C… with Bonferroni or Šidák, each variant vs control | 3/5 |
| SRM check (χ² vs the planned split) | 3/5 |
| Small-count warning + Fisher's exact option; zero-conversion handling | rare |
| Peeking warning + pre-registration checklist | partial |
| No sign-up; nothing leaves the browser | most require nothing, but push products |

## 3. Calculator spec

### 3.1 Tabs

1. **Test result** (default)
2. **Sample size & duration**
3. **A/B/C variants**

### 3.2 Input guide diagram (above the inputs)

`AbInputGuide.tsx`: two funnels side by side, "A (control)" and "B (variant)".
- Each funnel has "1 Visitors" at the top and "2 Conversions" at the bottom, with the live conversion rate in the middle.
- Below them, a dial "3 Confidence level (90/95/99%)" and a switch "4 One- or two-sided".
- **Sample-size tab:** a baseline bar, an "MDE" bump on top, and a "5 Daily traffic" clock giving "days needed".

### 3.3 Inputs (defaults = examples)

| Tab | Default |
|---|---|
| Test | A: 10,000 visitors, 500 conversions · B: 10,000, 570 · two-sided · 95% |
| Sample size | baseline 5%, MDE 10% relative, α 0.05 two-sided, power 80%, 2 variants, daily traffic optional |
| Variants | control + up to 4 variants; correction Bonferroni (or Šidák / none) |
| SRM | planned split 50/50 |

### 3.4 Engine (`src/lib/stats-engine.ts` + `ab-test-engine.ts`)

```ts
pA = cA/nA ; pB = cB/nB ; p = (cA+cB)/(nA+nB)
SE = √(p(1−p)(1/nA + 1/nB)) ; z = (pB − pA)/SE
pTwo = 2(1 − Φ(|z|)) ; pOne = 1 − Φ(z)          // Φ via accurate erf (tested to 1e-6)
CI diff = (pB − pA) ± z* × √(pA(1−pA)/nA + pB(1−pB)/nB)
observed power (two-sided) from the effect and SE (labelled "observed, not a planning tool")
n per arm = (z₁₋α/₂ √(2p̄(1−p̄)) + z₁₋β √(p₁(1−p₁)+p₂(1−p₂)))² / (p₂−p₁)²   (z₁₋α one-sided)
Bonferroni α/m ; Šidák 1 − (1−α)^(1/m)
SRM: χ² goodness-of-fit of nA, nB vs planned split
guards: conversions ≤ visitors ; expected counts < 5 → warning + Fisher's exact
```

**Worked examples (checked 2026-11-22):**

| Case | Result |
|---|---|
| 5.0% vs 5.7% (10,000 each) | +14.0% lift, **z = 2.20, two-sided p ≈ 0.028** → significant at 95% |
| 1.00% vs 1.14% (50,000 each) | **z = 2.152, two-sided p ≈ 0.031**; matches the competitor analysis re-check |
| Sample size: 5% baseline, 10% relative MDE, α 0.05 two-sided, 80% power | **≈ 31,234 per arm** |

`TODO(owner)`: fixtures from R `prop.test(correct = FALSE)` and `power.prop.test`.

### 3.5 Outputs

- **Verdict card:** "B's conversion rate is 14.0% higher than A's (5.7% vs 5.0%). Two-sided p = 0.028, below 0.05, so this difference is statistically significant at 95% confidence."
- **Correct meaning line:** "If there were truly no difference, a gap this large would show up about 2.8% of the time."
- Table: rates, pp diff, lift, z, p one/two-sided, CI, observed power.
- SRM result.
- **Sample size:** n per arm, total, days. The formula is shown.
- Copy summary; Share URL.

### 3.6 Tests

- z, p and CI against the fixtures; one- vs two-sided.
- Sample size; Bonferroni/Šidák; SRM χ².
- Zero conversions; c > n error; small-count warning.
- Normal CDF accuracy. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `A/B Test Significance Calculator – Stat Sig` (43; 55 with the suffix: OK) |
| Meta | `Free A/B test significance calculator. Enter visitors and conversions for A and B to get conversion rates, uplift, p-value and confidence, all in your browser.` (159) |
| H1 | `A/B Test Significance Calculator: Is Your Result Statistically Significant?` |
| BLUF | "This stat sig calculator runs a two-proportion z-test. Example: A converts at 5.0% and B at 5.7% with 10,000 visitors each, a 14% lift with a two-sided p-value of about 0.028, so the result is statistically significant at 95% confidence." (engine) |
| ToolShell pills | `p-value & confidence interval`, `Sample-size planner`, `A/B/C with corrections`, `Data stays in your browser` |
| Links out | T-Test (#13), Percentage Change (live), ROI (#18), Standard Deviation (#11), Profit Margin (live) |
| Links in | T-Test, Percentage Change (add "testing a change?"), Tools hub "Math & Finance → Stats" and "Business" |

## 5. Content (~1,600–1,900 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the A/B test significance calculator | 3 tabs | 100 |
| 2 | How the significance test works | Two-proportion z-test, formula + engine example | 250 |
| 3 | What the p-value and confidence level really mean | Correct definitions; common wrong ones (without naming sites) | 220 |
| 4 | One-sided vs two-sided tests | Why we default to two-sided | 150 |
| 5 | How many visitors do you need? | Sample size, MDE, power, with an example | 220 |
| 6 | Testing more than two variants | Bonferroni vs Šidák | 150 |
| 7 | Sample ratio mismatch (SRM) | What it signals | 120 |
| 8 | Common A/B testing mistakes | Peeking, stopping early, novelty, practical vs statistical significance | 200 |
| 9 | FAQ | §6 | 420 |

## 6. FAQ (12, from the question bank)

1. What does statistically significant mean in an A/B test?
2. What is a p-value, and what is it not?
3. One-sided or two-sided: which should I use?
4. How many visitors do I need for an A/B test?
5. Can I stop a test as soon as it's significant?
6. How do I test more than two variants?
7. Which confidence level should I use (90, 95 or 99%)?
8. Why is my test not significant even though B looks better?
9. What is sample ratio mismatch?
10. Statistical vs practical significance: what's the difference?
11. Frequentist vs Bayesian A/B testing (short; this tool is frequentist)
12. What is a z-score?

## 7. Done when

- [ ] `stats-engine` normal functions + `ab-test-engine.ts` + tests (R fixtures); `npm run verify` passes.
- [ ] InputGuide above the inputs; ToolShell + TabSlider + fonts + `<main>`.
- [ ] Copy uses correct p-value language; no "95% chance B is better".
- [ ] Registrations + docs; `graphify update .`.
