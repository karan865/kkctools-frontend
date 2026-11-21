# ROI Calculator (with Annualized ROI) — Build Spec

> **URL:** `/roi-calculator/` · Batch 5 · Tier 2 · rank chance 🟡 · **Build order 16** (shares `growth-engine` with CAGR #6)
> **Read first:** `../00_BATCH5_BUILD_RULES.md` (§0 ROI rule, §2.5)
> **Inputs used:** `18_ROI_Calculator_Annualized_Competitor_Analysis.md` (5 pages read, 2026-11-14), keyword file §2 #18
> **SERP:** provisional
> **Written:** 2026-11-22 (full rewrite after the research pass)

---

## 0. Strategy and the owner decision

**Keywords:** `roi calculator` is 14,800 at KD 11, with a cluster of about 33,000.

**Who ranks:** 5 giants (Calculator.net, Omni, CalculatorSoup, Inch, GIGA), so the keyword-file "giant check" is **likely triggered**.

**Owner decision** (`TODO(owner)`):
- (a) **separate page with a business ROI angle** (recommended in the analysis), or
- (b) an ROI section on the CAGR page.

This spec assumes (a). Business ROI (campaign, equipment, project) is less YMYL than investment ROI, and the giants don't offer it.

**Gaps across all 5:**

| Gap | Competitors with it |
|---|---|
| Side-by-side comparison of 2–4 options | **0 of 5** |
| Marketing/business ROI mode | **0 of 5** |
| Real (after-inflation) ROI | **0 of 5** |
| FAQ | 1 of 5 |
| Documented annualized method | Omni doesn't document its own |

**Accuracy edge:**
- Inch has an exponent typo and a rounded exponent.
- GIGA's apartment example ignores financing and doesn't annualize.
- Calculator.net shows "4.129 years" without a stated basis.

## 1. Keywords and placement

| Role | Keyword | US vol | KD | Where it goes |
|---|---|---:|---:|---|
| **Primary** | roi calculator | 14,800 | 11 | Title, H1, first sentence, tool heading |
| Secondary | how to calculate roi | 6,600 | 20 | H2 "How to calculate ROI step by step" + FAQ #1 |
| Secondary | rate of return | 4,400 | 19 | H2 "ROI vs rate of return vs CAGR vs IRR" |
| Secondary | what is return on investment · what does roi mean | 3,600 · 3,600 | 17–25 | H2 "What does ROI mean?" + FAQ |
| Natural | annualized roi · marketing roi · roas · payback period | — | — | Tabs, H2s |

## 2. Our edge (5 competitors checked)

| Feature | Competitors with it |
|---|---|
| ROI + annualized | 5/5 |
| Annualized formula shown, with the basis stated (days ÷ 365.25) | 3/5 |
| Dates input | 2/5 |
| Income (dividends, rent) and expenses (fees, maintenance) | 1/5 |
| **Compare 2–4 options** (table + ranking + chart, with a warning when holding periods differ) | **0** |
| **Marketing ROI on margin + ROAS shown separately** | **0** |
| **Equipment/project ROI with payback** | **0** |
| Target mode (value needed for X% ROI) | 0 |
| **Real ROI** (user inflation) | **0** |
| Limits section → IRR/NPV for multiple cash flows | partial |

## 3. Calculator spec

### 3.1 Tabs

1. **ROI** (default)
2. **Compare up to 4**
3. **Marketing ROI**
4. **Project / equipment ROI**

### 3.2 Input guide diagram (above the inputs)

`RoiInputGuide.tsx`

- **ROI tab:** two coin stacks, "1 Amount invested (cost)" and "2 Final value / amount returned", with optional "+ income" and "− expenses" chips. The difference is labelled "net gain". A timeline beneath shows "3 Holding period or dates", with the badge "annualized = the same rate each year".
- **Marketing tab:** an ad icon "Ad spend / cost" → "Revenue" × "Gross margin %" = profit, plus a "ROAS" side badge.
- **Project tab:** "Cost" vs yearly "Savings" bars, with a payback marker.

### 3.3 Inputs (defaults = examples)

| Tab | Default |
|---|---|
| ROI | cost $10,000 · final $15,000 · 3 years (or dates) · income/expenses optional · inflation optional |
| Compare | 2–4 rows (name, cost, final, years) |
| Marketing | revenue $20,000 · cost $5,000 · gross margin 40% |
| Project | cost $12,000 · annual benefit $4,000 · 5 years |
| Target | target ROI % → value needed |
| Currency | selector |

### 3.4 Engine (`src/lib/growth-engine.ts` + `roi-engine.ts`)

```ts
roi = (final + income − expenses − cost)/cost   (null if cost ≤ 0)
annualized = (1+roi)^(1/years) − 1 ; years = days/365.25 (stated) — same function as CAGR
real = (1+annualized)/(1+inflation) − 1
target value = cost × (1 + target)
compare: rows → roi, annualized, net gain; rank by annualized; warn if years differ
marketing: roiRevenue = (rev − cost)/cost ; roiMargin = (rev·margin − cost)/cost ; roas = rev/cost   (labelled as different metrics)
project: roi over N years = (benefit·N − cost)/cost ; payback = cost/benefit
contributions note: multiple cash-flow dates → link Present Value (NPV/IRR) / Investment Return
```

**Worked examples (checked 2026-11-22):**

| Case | Result |
|---|---|
| $10,000 → $15,000 in 3 years | **ROI 50%**, **annualized 14.47%** |
| Marketing: $20,000 revenue, $5,000 cost, 40% margin | **ROI on margin 60%** (on revenue 300%, labelled) · **ROAS 4.0** |
| Project: $12,000 cost, $4,000/yr saving | **payback 3 years** · 5-year ROI **66.7%** |

### 3.5 Outputs

- **Headline:** ROI % + net gain; annualized ROI.
- **Sentence:** "Turning $10,000 into $15,000 is a 50% return on investment, or 14.47% a year over 3 years."
- Comparison table + bar chart + ranking warning.
- Marketing card (ROI on margin vs ROAS, explained).
- Payback.
- Real ROI.
- Formula shown.
- Copy, Share URL.

### 3.6 Tests

- Basic and annualized ROI (shared with CAGR); negative ROI; cost 0.
- Compare ranking + the differing-period warning.
- Marketing (margin vs revenue vs ROAS); project payback; target; real ROI.
- The examples above. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `ROI Calculator – Return on Investment & Annualized` (50; 62 with the suffix → `absoluteTitle`) |
| Meta | `Free ROI calculator. Enter what you invested and what you got back to see ROI, net profit and annualized ROI over any period, with the formula shown.` (149) |
| H1 | `ROI Calculator: Return on Investment and Annualized ROI` |
| BLUF | "ROI = (what you got back − what you put in) ÷ what you put in. Turning $10,000 into $15,000 is a 50% return on investment; over 3 years that's 14.47% a year annualized. Compare up to four options, or check a campaign's ROI on margin." (engine) |
| ToolShell pills | `ROI & annualized ROI`, `Compare up to 4 options`, `Marketing ROI & ROAS`, `Payback period` |
| Links out | CAGR (#6), Present Value / NPV (live), Investment Return (live), Profit Margin (live), Contribution Margin / Break-even (live) |
| Links in | CAGR, Profit Margin, A/B Test, Tools hub "Growth" and "Business" |

## 5. Content (~1,500–1,800 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the ROI calculator | 4 tabs | 100 |
| 2 | What does ROI mean? | Definition (`what is return on investment`, `what does roi mean`) | 150 |
| 3 | How to calculate ROI step by step | Formula + example (`how to calculate roi`) | 200 |
| 4 | Annualized ROI: comparing different holding periods | Example + compare mode | 200 |
| 5 | ROI vs rate of return vs CAGR vs IRR | Table (`rate of return`) | 180 |
| 6 | Marketing ROI and ROAS | Margin-based example; why revenue ROI overstates | 200 |
| 7 | Equipment and project ROI with payback | Example | 150 |
| 8 | Real ROI after inflation | Example | 100 |
| 9 | What ROI doesn't tell you | Risk, time value, multiple cash flows → IRR/NPV | 130 |
| 10 | FAQ | §6 | 380 |

## 6. FAQ (10, from the question bank)

1. How do you calculate ROI? (`how to calculate roi`)
2. What does ROI mean?
3. What is annualized ROI, and why does it matter?
4. ROI vs rate of return vs CAGR: what's the difference?
5. What is a good ROI? (depends on risk and time; no market claims)
6. How do I calculate marketing ROI?
7. How do I compare investments held for different lengths of time?
8. Can ROI be negative?
9. What does ROI leave out (risk, time, inflation)?
10. How do I calculate ROI on equipment or real estate?

## 7. Done when

- [ ] Owner decision recorded (separate page vs CAGR section).
- [ ] `roi-engine.ts` + shared `growth-engine` + tests; `npm run verify` passes.
- [ ] InputGuide above the inputs; ToolShell + TabSlider + fonts + `<main>`; currency selector.
- [ ] No market-return claims.
- [ ] Registrations + docs; `graphify update .`.
