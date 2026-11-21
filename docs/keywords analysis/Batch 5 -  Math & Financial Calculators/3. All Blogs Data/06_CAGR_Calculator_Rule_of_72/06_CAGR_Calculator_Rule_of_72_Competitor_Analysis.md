# CAGR Calculator (with Rule of 72) — Competitor Analysis

> **Target page:** KKCTools `/cagr-calculator/` (Batch 5, Tool #6 🟡)
> **Primary keyword:** `cagr formula`, US 14,800 · KD 10 · CPC $2.16. The cluster has 11 keywords and 54,800 US searches, 29,300 of them on KD ≤ 15. It includes `compound annual growth rate formula` (9,900) and `cagr formula excel` (5,400).
> **SERP source:** ⚠ There is no Semrush SERP export for Batch 5. Competitors come from a live web search for `cagr formula calculator` run on 2026-11-14. `TODO(owner): pull Google top 10 for "cagr formula" and "cagr calculator" (keyword note: Investopedia-type sites likely hold "formula").`
> **Pages visited (2026-11-14):** 6 read: CalculatorSoup, Omni, Vertex42, Inch Calculator, Ablebits (Excel tutorial), DQYDJ.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Calc sites: CalculatorSoup, Omni, Inch, GIGAcalculator, DQYDJ.
  - A spreadsheet brand: Vertex42.
  - Excel tutorials: Ablebits, Spreadsheet Planet, Spreadsheeto.
  - Finance portals: StockAnalysis, MarketBeat, TickerPlace.
  - SaaS bait pages: Canva, Coefficient, Ordio, Deckary.
  - Many pages.dev and lovable clones.
- **Investopedia was not in this search.** The keyword file expects it for "formula". `TODO(owner)`: check in the real SERP.
- **India demand.** CAGR is used for mutual funds (keyword note), so we use a neutral currency or a currency selector.
- **Every worked example was re-checked.** Errors were found on Omni (period count), Vertex42 (Excel FV argument), Inch (misprinted periodic formula), CalculatorSoup (typo in an intermediate value) and DQYDJ (sign notation). See §4.
- No live data is needed. No competitor text is copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | calculatorsoup.com/calculators/financial/cagr-calculator.php | Calc giant | CAGR Calculator | ~1,000 |
| 2 | omnicalculator.com/finance/cagr | Giant | CAGR Calculator (Compound Annual Growth Rate) | 2,000–2,300 |
| 3 | vertex42.com/Calculators/cagr-calculator.html | Spreadsheet brand | CAGR Calculator & Formula | 900–1,000 |
| 4 | inchcalculator.com/cagr-calculator/ | Calc site | CAGR Calculator | ~2,000 |
| 5 | ablebits.com/office-addins-blog/calculate-cagr-excel-formulas | Excel tutorial | How to calculate CAGR in Excel | ~2,000 |
| 6 | dqydj.com/cagr-calculator/ | Finance calc site | Compound Annual Growth Rate (CAGR) Calculator | ~1,000 |

**What this tells us:**
- **The standard tool:** start, end and years give CAGR. Solve-for variants exist on CalculatorSoup (all four values) and Vertex42 (leave one blank).
  - Inch adds compounding options and a growth table.
  - It is also the **only page with a Rule of 72** comparison (72 ÷ rate vs exact doubling time).
- **The Excel formula is a big secondary intent** (`cagr formula excel` and two related keywords, about 10k searches).
  - CalculatorSoup shows a POWER formula.
  - Vertex42 shows RATE, PV, FV and NPER, but its FV argument is wrong.
  - Ablebits covers direct, POWER, RATE, RRI and IRR, but not XIRR or YEARFRAC.
  - **Nobody fills in the formula with the user's own numbers.**
- **CAGR vs average annual growth.** DQYDJ has the best example: −50 %, +30 %, +20 % gives a 0 % average but a CAGR of −7.95 %.
  - Ablebits explains the difference but shows it only in screenshots.
  - **Nobody offers a series mode** where you paste yearly values and see CAGR vs the average.
- **Dates mode is rare.** Vertex42 uses days ÷ 365. CalculatorSoup has period units (days to years). No page lets you pick a start and end date with leap years handled.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | CalcSoup | Omni | Vertex42 | Inch | Ablebits | DQYDJ |
|---|---|---|---|---|---|---|
| Start, end, years → CAGR | ✅ | ✅ | ✅ | ✅ | n/a (Excel) | ✅ |
| Solve for end value | ✅ | ✅ | ✅ | ❌ | ⚠️ comment | ❌ |
| Solve for start value | ✅ | ⚠️ promised | ✅ | ❌ | ❌ | ❌ |
| Solve for years needed | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Period units (days/weeks/months/quarters) | ✅ | ❌ | ⚠️ days ÷ 365 | ⚠️ compounding | ❌ | ⚠️ "any periods" |
| Start and end **dates** | ❌ | ❌ | ⚠️ (date calc embed) | ❌ | ❌ | ❌ |
| Series of yearly values → CAGR vs average growth | ❌ | ❌ | ❌ | ❌ | ⚠️ (Excel, screenshot) | ⚠️ (example only) |
| Final value as a % gain | ❌ | ✅ (change) | ❌ | ❌ | ❌ | ✅ |
| Year-by-year growth table | ❌ | ⚠️ (illustration) | ❌ | ✅ | ❌ | ⚠️ (example) |
| Chart | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Rule of 72 vs exact doubling time | ❌ | ⚠️ (link only) | ❌ | ✅ | ❌ | ❌ |
| Excel / Sheets formula filled with the user's numbers | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Inflation-adjusted (real) CAGR | ❌ | ❌ | ❌ | ⚠️ (FAQ formula) | ❌ | ❌ |
| Negative and zero handling explained | ❌ | ❌ | ❌ | ❌ | ⚠️ (#NUM!) | ❌ |
| Cash flows warning (use IRR/XIRR) | ⚠️ | ❌ | ❌ | ✅ (IRR example) | ✅ IRR | ⚠️ XIRR |

---

## 3. Feature matrix — content and trust

| Item | CalcSoup | Omni | Vertex42 | Inch | Ablebits | DQYDJ |
|---|---|---|---|---|---|---|
| Formula shown | ✅ (+ reverse) | ✅ | ✅ | ✅ (periodic misprinted) | ✅ | ✅ (as image) |
| Excel formulas | ✅ POWER | ❌ | ✅ RATE/PV/FV/NPER (**FV bug**) | ❌ | ✅ 5 methods (says "4") | ✅ GEOMEAN, IRR/XIRR (image) |
| Worked examples | ✅ (typo 1.22766 → 1.12766) | ✅ (**period count wrong**) | ✅ (checked) | ✅ 7 (checked) | ⚠️ (images) | ✅ (sign notation wrong) |
| CAGR vs average explained | ⚠️ | ⚠️ | ❌ | ✅ SAGR | ✅ | ✅ |
| Limitations (volatility, endpoints) | ⚠️ | ⚠️ (contradicts itself) | ❌ | ✅ | ❌ | ⚠️ |
| FAQ count | 0 | 4 | 0 | 4 | 0 | 0 |
| Named author | ✅ | ✅ + reviewers | ✅ | ✅ + 2 reviewers | ✅ | ✅ |
| Date | ✅ Aug 2025 | ❌ | ✅ 2019 | ❌ | ✅ May 2023 | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. CalculatorSoup — CAGR Calculator (Edward Furey, Aug 2025)
- **Solve-for:** CAGR, periods, BV or FV.
- **Period units:** days, weeks, months, quarters, years. The n/t exponent is used for periods shorter than a year.
- **Excel:** `=ROUND(((POWER((B2/B1),(1/B3))-1)*100),4)`. Checked: 100k → 1M over 5 years gives 58.4893 % ✔.
- **Example:** an index fund 376 → 424 over 5 years gives 2.432 % ✔. The intermediate value is printed as "1.22766" but should be **1.12766**.
- **Weak points:**
  - No dates input.
  - No Rule of 72.
  - No series mode.
  - No FAQ.
  - Typo: "volativity".

### 2. Omni — CAGR Calculator (T. Jedynak PhD and others; reviewed)
- **Modes:** solve for the final value or for CAGR. Also shows the change in value and total growth.
- **Examples:**
  - $1,000 → $1,300 over 3 years gives 9.14 % ✔.
  - "Big Bite", 7 periods, gives 5.468 % ✔.
  - Doubling in 3 years needs 26 % ✔.
- **Error:** in the investment-table example, the period counts look wrong.
  - $3,000 (2016) → $6,000 (2018) is treated as 3 years, giving 25.99 %. Over 2 periods the CAGR is 41.42 %.
  - The 5-year figure has the same problem.
- **FAQs (4):**
  1. How to calculate CAGR
  2. What CAGR doubles money in 3 years
  3. Is 5 % good?
  4. What a 3-year CAGR means
- **Weak points:**
  - No Excel formula.
  - Rule of 72 is only a link.
  - Unsourced trading advice (7-day moving average).
  - Source list is incomplete.
  - No date.

### 3. Vertex42 — CAGR Calculator & Formula (Jon Wittwer, 2019)
- **Calculator:** PV, FV and years. Leave one blank to solve for it.
- **Day-based CAGR:** (1 + g)^(365/days) − 1.
- **Excel:**
  - RATE(Years,,-PV,FV) ✔
  - PV(…) ✔
  - **FV(CAGR,Years,-PV) is wrong.** −PV sits in the payment slot. It should be `FV(CAGR,Years,,-PV)`.
  - NPER ✔
- **Example:** $2,000 → $5,000 over 3 years gives 35.72 % ✔.
- **Weak points:**
  - Treats CAGR and APY as the same thing.
  - No FAQ.
  - No volatility caveat.

### 4. Inch Calculator — CAGR Calculator (Joseph Rich MS; reviewed by Monica Greer PhD and Laura Deimling MBA)
- **Inputs:** BV, EV, years, and compounding (daily through continuous).
- **Outputs:** CAGR and a growth table.
- **Examples (all ✔):**
  - DJI annual 12.8189 %
  - Quarterly 12.2451 %
  - SAGR 16.5544 %
  - Investor 14.2897 %
  - Rule of 72: 72 ÷ 16.55 = 4.35 years, against an exact 4.525 years
- **Errors:**
  - The periodic formula is misprinted (missing parentheses).
  - The dividend FAQ conflicts with the price-only DJI data.
  - Calls CAGR the "true return".
- **FAQs (4):** meaning, dividends, inflation (the real-return formula ✔), forecasting.

### 5. Ablebits — How to calculate CAGR in Excel (Svetlana Cheusheva, May 2023)
- **Methods:** direct formula, POWER, RATE (negative BV), RRI and IRR (zeros between endpoints).
- Explains average vs CAGR, but only in screenshots.
- **Weak points:**
  - Says "4 ways" but shows 5.
  - No XIRR or YEARFRAC, so irregular dates aren't covered.
  - A comment reply annualizes 6 % per 6 months as 12 %. Compounded, it is 12.36 %.

### 6. DQYDJ — CAGR Calculator (PK)
- **Inputs:** start, final (an amount or a % gain), and years or periods.
- **Example:** −50 %, +30 %, +20 % gives a product of 0.78 and a CAGR of −7.948 %, while the average is 0 % ✔.
  - The year values ✔.
  - The growth expressions are written "1 − (−7.948)" but should read "1 + (−0.07948)".
- **Excel:** GEOMEAN(0.5,1.3,1.2)−1 ✔. IRR/XIRR shown as images.
- **Weak points:**
  - No FAQ, no dates mode, no date.
  - Formulas are images.

---

## 5. Patterns

- **Maths:**
  - CAGR = (End ÷ Start)^(1/years) − 1.
  - End = Start × (1 + CAGR)^years.
  - Start = End ÷ (1 + CAGR)^years.
  - Years = ln(End ÷ Start) ÷ ln(1 + CAGR).
- **From dates:** years = days ÷ 365.25 (or actual/actual). Pick one convention and label it. `TODO(owner)`: choose.
- **Series mode:**
  - CAGR = (Vₙ ÷ V₀)^(1/n) − 1.
  - Average annual growth = mean of the yearly % changes.
  - Show both side by side and explain that the arithmetic average is always ≥ CAGR (the geometric mean).
- **Doubling time:**
  - Exact: ln 2 ÷ ln(1 + r).
  - Rule of 72: 72 ÷ r%. Also show the Rule of 69.3 and Rule of 70 for comparison.
  - Show the error of each rule at the user's rate.
- **Real CAGR:** (1 + CAGR) ÷ (1 + inflation) − 1. Inflation is a user input; there is no live CPI feed.
- **Excel / Sheets, filled with the user's numbers:**
  - `=(End/Start)^(1/Years)-1`
  - `=RRI(Years,Start,End)`
  - `=RATE(Years,,-Start,End)`
  - `=POWER(End/Start,1/Years)-1`
  - Dates: `=(End/Start)^(1/YEARFRAC(d1,d2))-1`
- **Edge cases:**
  - Start ≤ 0: undefined.
  - End ≤ 0: undefined or a −100 % loss.
  - Negative to positive: CAGR is not meaningful. Explain why.
  - Contributions: use IRR/XIRR instead, and link to Investment Return (Batch 3 #27).

| Section | Pages (of 6) |
|---|:---:|
| Basic CAGR | 6 |
| Reverse solves | 2 full |
| Excel formula | 4 (1 bug) |
| CAGR vs average | 3 (no tool) |
| Rule of 72 | 1 |
| Dates input | **0** proper |
| Series mode | **0** |
| Error-free examples | 2 of 6 |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword. Map to: cagr formula, compound annual growth rate formula, doubling time formula, compound growth formula, cagr calculation, growth rate equation, cagr formula excel, what is the rule of 72, cagr excel formula, calculate cagr in excel.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is the CAGR formula? | all · `cagr formula` 14,800 |
| 2 | ★ How do you calculate CAGR in Excel? | CalcSoup, Vertex42, Ablebits, DQYDJ · `cagr formula excel` |
| 3 | ★ CAGR vs average annual growth rate | Inch, Ablebits, DQYDJ |
| 4 | ★ What is the Rule of 72 and how accurate is it? | Inch · `what is the rule of 72` |
| 5 | ★ What is a good CAGR? | Omni |
| 6 | How do I calculate CAGR for months or days? | CalcSoup, Vertex42 |
| 7 | How do I find the end value from a CAGR? | Omni, Ablebits (comment) |
| 8 | Does CAGR include dividends or inflation? | Inch |
| 9 | Can CAGR be negative? What if the start value is negative? | DQYDJ (negative example) |
| 10 | CAGR vs IRR / XIRR: when should I use which? | Inch, Ablebits, DQYDJ |
| 11 | What is the doubling time formula? | `doubling time formula` |
| 12 | What is the compound growth formula? | `compound growth formula` |

---

## 7. Gaps nobody fills — our opportunities

1. **Four-way solve**: CAGR, end value, start value or years. Input either years or **start and end dates**.
2. **Series mode**: paste yearly values to get CAGR, average annual growth, yearly % changes and a chart. Explain why the two numbers differ.
3. **Excel and Google Sheets formulas filled with the user's numbers**: direct formula, RRI, RATE and YEARFRAC. Formulas checked: no Vertex42-style argument bugs.
4. **Rule of 72 vs exact doubling time**, also Rule of 70 and 69.3, with the error shown.
5. **Real (inflation-adjusted) CAGR**, with inflation entered by the user.
6. **Growth table and chart**: smoothed CAGR path vs actual values.
7. **Edge-case messages** for zero, negative and sign-change values, plus a note to use IRR/XIRR when there are contributions.
8. **Correct worked examples** (competitor errors listed in §4).
9. **Neutral currency** with a selector (India/US).
10. **Links**: Compound Interest (Batch 3 #21), Investment Return (Batch 3 #27), ROI (#18), Percentage Change (Batch 3 #1).

---

## 8. Blueprint for the KKCTools CAGR Calculator

### 8.1 SEO

- **URL:** `/cagr-calculator/`
- **Title:** CAGR Calculator – Compound Annual Growth Rate
- **H1:** CAGR Calculator: Compound Annual Growth Rate, Formula and Rule of 72
- **Meta:** as in the keyword file (144 chars).
- **H2s:** CAGR formula · compound annual growth rate formula · CAGR formula in Excel · what is the Rule of 72 · doubling time formula.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Solve | CAGR · End · Start · Years |
| Time | Years (decimal) or start/end dates (convention labelled) |
| Series | Yearly values → CAGR, average growth, yearly changes, chart |
| Doubling | Exact vs Rule of 72/70/69.3, with error |
| Real CAGR | Inflation % input |
| Excel / Sheets | Formulas with the user's numbers, copy button |
| Output | Growth table, chart (theme aware), sentence summary |
| UX | Currency selector, share URL, no network |

### 8.3 Content outline (≈ 1,500–1,800 words, original)

1. Intro and the formula in the first lines
2. How to use
3. CAGR formula explained, with an example
4. How to calculate CAGR in Excel and Google Sheets (4 formulas)
5. CAGR vs average annual growth, with a volatile-series example
6. Rule of 72 and doubling time, with an accuracy table
7. CAGR for months or days and for exact dates
8. Real CAGR after inflation
9. Limits of CAGR (volatility, endpoints, contributions → IRR)
10. FAQ (10–12)
11. Related tools: Compound Interest (Batch 3 #21), Investment Return (Batch 3 #27), ROI (#18), Percentage Change (Batch 3 #1)

### 8.4 Quality checks

- **Unit tests:**
  - all solve directions
  - dates convention
  - series mode
  - doubling rules
  - real CAGR
  - edge cases
- **Excel formula strings tested** against expected outputs. `TODO(owner)`: verify them in Excel or Sheets once.
- **Example fixtures:** 1,000 → 1,300 over 3 years = 9.14 %; −50/+30/+20 = −7.948 %.
- No competitor wording copied. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - pull Google top 10 for both "cagr formula" and "cagr calculator"
  - choose the date convention
  - set the currency default
