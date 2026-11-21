# CAGR Calculator (with Rule of 72) — Build Spec

> **URL:** `/cagr-calculator/` · Batch 5 · Tier 1 · rank chance 🟡 · **Build order 6**
> **Read first:** `../00_BATCH5_BUILD_RULES.md` (§3 growth-engine, date-diff-engine)
> **Inputs used:** `06_CAGR_Calculator_Rule_of_72_Competitor_Analysis.md` (6 pages read, 2026-11-14), keyword file §2 #6
> **SERP:** provisional. `TODO(owner)`: pull `cagr calculator` and check whether Investopedia holds the "formula" terms.
> **Written:** 2026-11-22 (full rewrite after the research pass)

---

## 0. Strategy

**Keywords:**
- The head term `cagr calculator` is not in the exports (KD > 30).
- **`cagr formula` (14,800, KD 10)** and **`compound annual growth rate formula` (9,900, KD 11)** are.
- A calculator page that explains the formula **at the very top** can rank for both.
- The Excel cluster adds ~10,000 searches.

**Who ranks:**
- calculator sites (CalculatorSoup, Omni, Inch, GIGA, DQYDJ);
- Vertex42;
- Excel tutorials (Ablebits and others);
- finance portals;
- SaaS bait pages;
- clones.

**Accuracy is a real edge.** Only **2 of the 6** pages have error-free examples:
- Omni: wrong period count;
- Vertex42: wrong Excel FV argument;
- Inch: misprinted formula;
- CalculatorSoup: intermediate typo;
- DQYDJ: sign notation.

**Gaps:**
- **Nobody fills the Excel formula with the user's numbers.**
- **Nobody has a series mode**, even though "CAGR vs average" is a ★ question.
- **No page takes real start and end dates.**
- Only Inch compares against the Rule of 72.

**Strong Indian demand** (mutual funds): use neutral currency or a selector.

## 1. Keywords and placement

| Role | Keyword | US vol | KD | Where it goes |
|---|---|---:|---:|---|
| **Primary** | cagr formula | 14,800 | 10 | **H2 directly under the tool**: "CAGR formula", with the formula in the first line of the BLUF |
| Secondary | compound annual growth rate formula | 9,900 | 11 | Same H2 (spell out) + FAQ |
| Secondary | compound growth formula · growth rate equation | 4,400 · 2,900 | 21 | H3s under the formula H2 + FAQ |
| Secondary | cagr calculation | 3,600 | 19 | H2 "CAGR calculation step by step" |
| Secondary | doubling time formula | 3,600 | 13 | Doubling tab + H2 |
| Support | what is the rule of 72 | 4,400 | 28 | H2 "Rule of 72 vs exact doubling time" + FAQ |
| Support | cagr formula excel · cagr excel formula · calculate cagr in excel | 5,400 · 2,400 · 2,400 | 25–29 | H2 "How to calculate CAGR in Excel and Google Sheets" + live formula box |
| Skip | improvement calculator (ambiguous) | — | — | — |
| Natural | cagr calculator | — | — | Title, H1, tool heading |

## 2. Our edge (6 competitors checked)

| Feature | Competitors with it |
|---|---|
| Four-way solve: CAGR, end, start, years | 2/6 |
| Years **or start and end dates** (leap years handled, convention labelled) | **0/6** properly |
| Series mode: paste yearly values → CAGR vs average annual growth, yearly % changes, chart | **0/6** |
| Excel/Sheets formulas **filled with the user's numbers**: direct, RRI, RATE, POWER, YEARFRAC | 0 (4 show generic formulas, 1 with a bug) |
| Rule of 72 vs 70 vs 69.3 vs exact, with the error at the user's rate | 1/6 |
| Real CAGR (user inflation) | rare |
| Growth table + chart (smoothed CAGR path vs actual) | 1/6 |
| Edge cases: start ≤ 0, end ≤ 0, sign change; "use IRR/XIRR when there are contributions" | partial |
| Error-free examples | 2/6 |

## 3. Calculator spec

### 3.1 Tabs

1. **CAGR** (default; solve any one of 4)
2. **Series of yearly values**
3. **Doubling time & Rule of 72**

### 3.2 Input guide diagram (above the inputs)

`CagrInputGuide.tsx`: a smooth rising curve from a start dot "1 Starting value" to an end dot "2 Ending value", across a time axis "3 Years (or 4 Start and end dates)".
- Equal dashed step arrows on the curve are labelled "the same % every year = CAGR".
- **Series tab:** a jagged line of yearly points with the smooth CAGR line overlaid; a gap label reads "average ≠ CAGR".

### 3.3 Inputs (defaults = examples)

| Field | Default |
|---|---|
| Solve-for selector | CAGR |
| Start / end | 10,000 → 20,000 |
| Years or dates | 5 years. Date mode: actual days ÷ 365.25 (`TODO(owner)`: confirm vs actual/actual) |
| Currency | selector (₹ / $ / €; neutral by default) |
| Inflation | optional |
| Series | example: 100, 50, 65, 78 (−50%, +30%, +20%) |

### 3.4 Engine (`src/lib/growth-engine.ts`, shared with ROI #18)

```ts
cagr = (end/start)^(1/years) − 1      // null if start ≤ 0 or end < 0; end = 0 → −100%
end = start·(1+r)^t ; start = end/(1+r)^t ; years = ln(end/start)/ln(1+r)
yearsFromDates(d1, d2) (date-diff-engine) ; realCagr = (1+cagr)/(1+infl) − 1
series: cagr = (Vn/V0)^(1/n) − 1 ; avg = mean(yearly % changes) ; yearly changes list
doubling exact = ln2/ln(1+r) ; rule72 = 72/(100r) ; rule70 ; rule69.3 ; error of each
excel(start, end, years, cells) → '=(B2/A2)^(1/C2)-1', '=RRI(C2,A2,B2)', '=RATE(C2,,-A2,B2)', '=POWER(B2/A2,1/C2)-1', '=(B2/A2)^(1/YEARFRAC(D2,E2))-1'
```

**Worked examples (checked 2026-11-22):**
- 10,000 → 20,000 in 5 years = **14.87% CAGR**.
- Series −50%, +30%, +20%: **average 0%, but CAGR −7.95%** (0.5 × 1.3 × 1.2 = 0.78; 0.78^(1/3) − 1).
- At 8%: exact doubling **9.01 years**; Rule of 72 = 9.00.

### 3.5 Outputs

- **Headline:** CAGR % (or the solved value).
- **Sentence:** "Growing from 10,000 to 20,000 over 5 years is a compound annual growth rate of 14.87%."
- **Live formula box:** Excel and Sheets formulas with the user's numbers, plus copy buttons.
- Growth table + SVG chart.
- Series: CAGR vs average, with a one-line why.
- Doubling table: exact vs 72/70/69.3, with errors.
- Edge-case messages. Share URL.

### 3.6 Tests

- Four-way solve round-trips.
- Dates mode across a leap year.
- The series example (−7.95%).
- Doubling and rules.
- Excel strings exact.
- Edge cases. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `CAGR Calculator – Compound Annual Growth Rate` (45; 57 with the suffix: OK) |
| Meta | `Free CAGR calculator. Enter a start value, end value and years to get the compound annual growth rate, the Excel formula, and the doubling time.` (144) |
| H1 | `CAGR Calculator: Compound Annual Growth Rate, Formula and Rule of 72` |
| BLUF | "CAGR formula: CAGR = (ending value ÷ starting value)^(1 ÷ years) − 1. Growing from 10,000 to 20,000 in 5 years is a compound annual growth rate of 14.87%. In Excel: =(B2/A2)^(1/C2)-1, or =RRI(5,10000,20000)." (engine) |
| ToolShell pills | `Solve CAGR, value or years`, `Series vs average growth`, `Excel & Sheets formulas`, `Rule of 72 check` |
| Links out | ROI (#18), Compound Interest (live), Investment Return (live), Percentage Change (live), Present Value (live) |
| Links in | ROI, Compound Interest, Investment Return, Percentage Change, Tools hub "Math & Finance → Growth" |

## 5. Content (~1,700–2,000 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | CAGR formula | The formula + compound annual growth rate formula spelled out + example (primary) | 220 |
| 2 | How to use the CAGR calculator | 3 tabs | 100 |
| 3 | CAGR calculation step by step | Example with every step (`cagr calculation`) | 180 |
| 4 | How to calculate CAGR in Excel and Google Sheets | 5 formulas; the common FV/argument mistake | 250 |
| 5 | CAGR vs average annual growth | −50/+30/+20 example; geometric vs arithmetic mean | 220 |
| 6 | Rule of 72 vs exact doubling time | Accuracy table; doubling time formula | 200 |
| 7 | CAGR for months, days or exact dates | Dates mode, convention | 130 |
| 8 | Real CAGR after inflation | Example | 100 |
| 9 | When CAGR misleads | Volatility, endpoints, contributions → IRR/XIRR | 150 |
| 10 | FAQ | §6 | 420 |

## 6. FAQ (12, from the question bank)

1. What is the CAGR formula?
2. How do you calculate CAGR in Excel?
3. CAGR vs average annual growth rate: what's the difference?
4. What is the Rule of 72, and how accurate is it?
5. What is a good CAGR? (depends on the asset and period; no invented benchmarks)
6. How do I calculate CAGR for months or days?
7. How do I find the end value from a CAGR?
8. Does CAGR include dividends or inflation?
9. Can CAGR be negative? What if the start value is negative?
10. CAGR vs IRR / XIRR: when should I use which?
11. What is the doubling time formula?
12. What is the compound growth formula?

## 7. Done when

- [ ] `growth-engine.ts` + tests (examples above); `npm run verify` passes.
- [ ] InputGuide above the inputs; ToolShell + TabSlider + fonts + `<main>`; currency selector.
- [ ] Excel formulas checked in a real spreadsheet (noted in docs).
- [ ] Registrations + docs; `graphify update .`.
