# ROI Calculator (with Annualized ROI) — Competitor Analysis

> **Target page:** KKCTools `/roi-calculator/` (Batch 5, Tool #18 🟡)
> **Primary keyword:** `roi calculator` — US 14,800 · KD 11. The cluster has 5 keywords and 33,000 US searches: how to calculate roi 6,600 · rate of return 4,400 · what is return on investment 3,600 · what does roi mean 3,600.
> **SERP source:** ⚠ Batch 5 has no Semrush SERP export. Competitors come from a live web search for `roi calculator annualized return on investment` (2026-11-14). `TODO(owner): pull Google top 10. Keyword note: if 3+ giants hold the top 5, make ROI a section of the CAGR page (#6) instead.`
> **Pages visited (2026-11-14):** 5 read: CalculatorSoup, Calculator.net, Omni, Inch Calculator, GIGAcalculator.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - **Giants:** Calculator.net, Omni, CalculatorSoup, Inch and GIGA.
  - **Others:** finance and SaaS sites (Geekflare, Financer, Tipalti, VisionRetirement), Spreadsheet Planet, AccurateCalculators, and clones.
  - The **giant check** in the keyword note is **likely triggered**, because 5 giants appear in the results. Owner decision: build a separate page or an ROI section on the CAGR page. Our recommendation is a separate page with a **business ROI angle**, sharing the same engine as CAGR. That angle covers campaign, equipment and project ROI, comparing up to 4 options, and marketing ROI. It is less YMYL than investment ROI, and the giants don't offer it (see §7).
- We re-checked all the arithmetic:
  - Inch has an exponent typo and a rounded exponent.
  - GIGA's apartment example ignores financing costs and doesn't annualize.
  - Omni's annualized method is undocumented.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | calculatorsoup.com/calculators/financial/return-on-investment-roi-calculator.php | Calc giant | Return on Investment ROI Calculator | 450–500 |
| 2 | calculator.net/roi-calculator.html | Calc giant | Return on Investment (ROI) Calculator | ~600 |
| 3 | omnicalculator.com/finance/roi | Giant | ROI Calculator - Return on Investment | long (truncated) |
| 4 | inchcalculator.com/roi-calculator/ | Calc site | ROI Calculator | ~1,200 |
| 5 | gigacalculator.com/calculators/roi-calculator.php | Calc site | ROI Calculator | ~800 |

**What this tells us:**
- **All five use the same core tool:** invested + returned (+ length) → ROI and annualized ROI.
  - **Calculator.net** takes dates, adds a pie chart, and shows the length as 4.129 years with no rounding basis given.
  - **CalculatorSoup** takes income and expense inputs.
  - **Omni** takes periodic contributions with a frequency, but **never explains how annualized ROI is computed**.
- **None of them compare 2–4 investments side by side.** Calculator.net and GIGA only say to compare over the same period.
- **None has a marketing or business ROI mode** (revenue, cost, gross margin, attribution). Tipalti and the SaaS pages only talk about it.
- **Real ROI is missing.** No page covers ROI after inflation, fees or taxes. GIGA and Calculator.net mention these factors but have no inputs.
- **FAQs:** only Omni has one (4 questions). Nobody answers `how to calculate roi`, `what does roi mean` and `rate of return` together.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | CalcSoup | Calc.net | Omni | Inch | GIGA |
|---|---|---|---|---|---|
| Invested + returned → ROI % | ✅ | ✅ | ✅ | ✅ | ✅ |
| Net gain | ⚠️ | ✅ | ✅ | ✅ | ✅ |
| Annualized ROI | ✅ | ✅ (formula not shown) | ✅ (**method undocumented**) | ✅ | ✅ |
| Length as years + months | ✅ | ✅ | ✅ | ✅ (d/w/m/y) | ⚠️ (years) |
| Start and end dates | ❌ | ✅ | ✅ (annualized mode) | ❌ | ❌ |
| Extra income / expenses (dividends, fees) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Periodic contributions | ❌ | ❌ | ✅ (unclear treatment) | ❌ | ❌ |
| **Compare 2–4 investments** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Marketing ROI** (revenue, cost, margin) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Target mode (return needed for X % ROI) | ❌ | ⚠️ (text) | ❌ | ❌ | ❌ |
| Inflation-adjusted (real) ROI | ❌ | ❌ | ❌ | ❌ | ❌ |
| Chart | ❌ | ✅ pie | ❌ | ❌ | ❌ |
| Currency choice | ❌ | ❌ | ✅ | ❌ | ❌ ($ fixed) |

---

## 3. Feature matrix — content and trust

| Item | CalcSoup | Calc.net | Omni | Inch | GIGA |
|---|---|---|---|---|---|
| ROI formula | ✅ | ✅ | ✅ | ✅ | ✅ |
| Annualized formula shown | ✅ | ❌ | ❌ | ✅ | ✅ (bracket typo) |
| Worked examples (checked) | ✅ 15 %, 33.3 % → 10.06 % | ✅ 40 % | ✅ 50 %, 60 %, 20.21 %, −27.86 % | ✅ (exponent typos in steps) | ✅ (apartment method weak) |
| ROI vs annualized vs CAGR explained | ✅ | ✅ (ROI vs ROR) | ⚠️ (link to CAGR) | ✅ | ⚠️ |
| Limits (risk, time value, attribution) | ⚠️ | ⚠️ | ✅ | ⚠️ | ⚠️ |
| Unsourced market claims | — | — | investing advice | "stocks about 10 %" | — |
| FAQ count | 0 | 0 | 4 | 0 | 0 |
| Named author | ✅ | ❌ | ✅ + reviewers | ✅ + MBA reviewer | ✅ |
| Date | ✅ Oct 2026 | ❌ | ❌ | ❌ | ✅ Feb 2026 (citation date later) |

---

## 4. Competitor-by-competitor detail

### 1. CalculatorSoup — ROI Calculator (Edward Furey, Oct 2026)
- **Inputs:** initial investment, final value, optional total income and expenses, length (years + months).
- **Outputs:** ROI and annualized ROI.
- **Examples:**
  - $1,000 → $1,150 in 1 yr = 15 % ✔
  - $600 → $800 in 3 yr = 33.33 %, annualized 10.06 % ✔
  - It explains rate vs total dollars well.
- **Weak points:**
  - The net-final-value formula is never written out.
  - No dates input, no marketing mode, no FAQ.
  - Related links are duplicated.

### 2. Calculator.net — ROI Calculator
- **Inputs:** invested and returned amounts. Time is either dates or a length.
- **Outputs:** gain, ROI, annualized ROI, length and a pie chart. The sample is consistent: 100 % over 4.129 yr = 18.28 %.
- **Example:** sheep farm 40 % ✔.
- **Weak points:**
  - No annualized formula.
  - "Gain" and "profit" are used inconsistently.
  - Only one cash flow is allowed.
  - No fees, inflation, FAQ, author or date.

### 3. Omni — ROI Calculator (T. Jedynak PhD, A. Barrantes; reviewers)
- **Basic mode:** period, initial amount, contribution and its frequency, rate of return.
- **Annualized mode:** start and end dates.
- **Examples (all ✔):** 50 %, 60 %, 20.21 % gain and −27.86 % loss.
- **FAQs (4):**
  1. ROI percentage
  2. Real-estate ROI
  3. $1,200 / $2,000 = 60 %
  4. Meaning of a 30 % ROI
- **Weak points:**
  - The annualized method is not stated.
  - The role of contributions and the rate of return is unclear.
  - EPS is listed as an ROI measure.
  - Typos, unsourced investing advice, and incomplete sources.

### 4. Inch Calculator — ROI Calculator (Joseph Rich MS; reviewer Laura Deimling MBA)
- **Inputs:** initial amount, amount returned, length (days, weeks, months, years).
- **Outputs:** total ROI, annualized ROI, gain.
- **Examples (results all ✔):**
  - 200 % over 10 yr → 11.61 %
  - Apple 632.9 % → 39.37 %
  - A vs B: 20.09 % vs 25.74 %
  - S&P 15.16 %
- **Errors in the working:**
  - "3^0.01" should be 3^0.1.
  - The Apple step uses 0.167 for 1/6, which gives 39.46 %, not the 39.37 % shown.
- **Weak points:** typos ("Let"s"), no date, unsourced benchmark returns.

### 5. GIGAcalculator — ROI Calculator (Georgi Georgiev, Feb 2026)
- **Inputs:** initial investment, final return, years.
- **Formulas:** basic ✔; annualized uses (end − start)/365 years.
- **Examples:**
  - Stock: 220 % → 47.4 %/yr ✔
  - Catering: 20 % ✔
  - Apartment: 33 %. This counts the loan as cost, ignores interest, and doesn't annualize over the few months held.
- **Weak points:**
  - Citation dated after the last update.
  - Bracket typo.
  - Placeholder embed link.
  - No FAQ.

---

## 5. Patterns

**Maths**
- ROI = (final value + income − expenses − cost) ÷ cost.
- Annualized ROI = (1 + ROI)^(1/years) − 1, where years = days ÷ 365.25 (state the convention). This is the same as CAGR (#6).
- **Target mode:** final value needed for target ROI = cost × (1 + target).
- **Real ROI:** (1 + annualized) ÷ (1 + inflation) − 1. The user enters inflation.

**Marketing ROI**
- Simple: (revenue attributed − cost) ÷ cost.
- On margin: (revenue × gross margin − cost) ÷ cost. This is better because it uses profit, not revenue.
- Also show ROAS = revenue ÷ ad spend for reference.
- Label these as different metrics, never mixed together.

**Comparing 2–4 options**
- Show each option's ROI, annualized ROI, net gain and payback (if cash flows are given).
- Rank by annualized ROI, with a warning when holding periods differ.

**Contributions**
- Simple ROI is wrong when money goes in at several dates. Point users to IRR/XIRR (Investment Return, Batch 3 #27, or NPV/IRR, Batch 3 #26).

**What the five competitors cover**

| Section | Pages (of 5) |
|---|:---:|
| ROI + annualized | 5 |
| Annualized formula shown | 3 |
| Dates | 2 |
| Income/expenses | 1 |
| Compare options | **0** |
| Marketing ROI | **0** |
| Real ROI | **0** |
| FAQ | 1 |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword. Map to: roi calculator, how to calculate roi, rate of return, what is return on investment, what does roi mean.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How do you calculate ROI? | all · `how to calculate roi` (6,600) |
| 2 | ★ What does ROI mean? | Omni · `what does roi mean`, `what is return on investment` |
| 3 | ★ What is annualized ROI and why does it matter? | CalcSoup, Calc.net, Inch, GIGA |
| 4 | ★ ROI vs rate of return vs CAGR? | Calc.net (ROR) · `rate of return` |
| 5 | What is a good ROI? | Inch (unsourced): answer by context, no market claims |
| 6 | How do I calculate marketing ROI? | — (gap) |
| 7 | How do I compare investments held for different times? | Calc.net, GIGA |
| 8 | Can ROI be negative? | Omni (−27.86 %) |
| 9 | What does ROI leave out (risk, time, inflation)? | Omni, Calc.net |
| 10 | How do I calculate ROI on real estate or equipment? | Omni, GIGA |

---

## 7. Gaps nobody fills — our opportunities

1. **Compare up to 4 projects or investments side by side.** This is in the keyword file and no competitor has it. Rank by annualized ROI, with a warning when holding periods differ.
2. **Business ROI modes:**
   - Marketing ROI: revenue, cost, gross margin, with ROAS shown separately.
   - Equipment/project ROI: cost, annual savings or profit, and the payback period.
3. **Dates or length**, with annualized ROI that is clearly explained and shares the CAGR engine.
4. **Extra cash items:** income such as dividends or rent, and expenses such as fees or maintenance.
5. **Target mode:** the return needed to hit X % ROI.
6. **Real ROI** using inflation the user enters.
7. **Correct worked examples, with the working shown** (fixing the exponent errors on Inch).
8. **A plain limits section** (risk, time value, attribution) that points to IRR/NPV for multiple cash flows.
9. **Neutral currency and no market-return claims** (YMYL-light).
10. **Links:** CAGR (#6), NPV/IRR (Batch 3 #26), Investment Return (Batch 3 #27), Profit Margin (Batch 3 #3), Break-even (Batch 3 #22).

---

## 8. Blueprint for the KKCTools ROI Calculator

### 8.1 SEO

- **URL:** `/roi-calculator/`. Owner decision vs a CAGR section after the SERP pull.
- **Title:** ROI Calculator – Return on Investment & Annualized
- **H1:** ROI Calculator: Return on Investment and Annualized ROI
- **Meta:** use the one in the keyword file (149 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Basic | Cost, final value, + income, − expenses; dates or length → ROI, net gain, annualized |
| Compare | 2–4 rows → table + ranking + chart |
| Marketing | Revenue, cost, gross margin → ROI (on margin), ROAS |
| Project | Cost, annual benefit, years → ROI, payback |
| Target | Target ROI → value needed |
| Real | Inflation % → real annualized ROI |
| UX | Currency selector, share URL, copy, no network |

### 8.3 Content outline (≈ 1,300–1,600 words, original)

1. Intro (primary keyword) and the formula
2. How to use
3. What ROI means, with an example
4. How to calculate ROI step by step
5. Annualized ROI and comparing different holding periods, with an example
6. ROI vs rate of return vs CAGR vs IRR
7. Marketing ROI and ROAS, with an example
8. Equipment and project ROI with payback
9. What ROI doesn't tell you
10. FAQ (10)
11. Related tools: CAGR (#6), NPV/IRR (Batch 3 #26), Profit Margin (Batch 3 #3), Break-even (Batch 3 #22)

### 8.4 Quality checks

- **Unit tests** for every mode:
  - dates convention
  - negative ROI
  - zero cost (error)
  - compare ranking
- **Fixtures:**
  - 600 → 800 over 3 yr = 33.33 % / 10.06 %
  - 200 % over 10 yr = 11.61 %
  - 220 % over 3 yr = 47.36 %
- No competitor wording copied. No market-return claims. `npm run check:no-network` passes.
- `TODO(owner)`: pull Google top 10 and decide between a separate page and a CAGR section.
