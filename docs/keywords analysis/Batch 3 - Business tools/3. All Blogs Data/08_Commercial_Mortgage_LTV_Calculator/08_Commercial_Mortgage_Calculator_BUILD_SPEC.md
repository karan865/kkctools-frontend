# Commercial Mortgage & LTV Calculator — Build Spec

> **URL:** `/commercial-mortgage-calculator/` · Batch 3 Part 2 · Tier 2 · **Build order 8**
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + Part 2; §10.3 YMYL box)
> **Inputs used:** `08_Commercial_Mortgage_LTV_Calculator_Competitor_Analysis.md` (4 pages), `KKCTools_Batch3_Final_Tool_Keywords.md` §2 #10
> **Written:** 2026-11-20

---

## 0. Strategy note

**SERP:** `commercial mortgage calculator` is **8,100 at KD 6**.
- Only 2 strong relevant tools: mortgagecalculator.org 62 and Nationwide 68.
- 5 relevant tools are AS 23–38 lender pages.
- NerdWallet is not in the real top 10.

**Extra volume:** the LTV terms add ~23,000 searches at KD 6–17. LTV is an output of this tool.

**Rules for this page:**
- **Users always type the interest rate.** No rate data to maintain, and no live-rate claims (zero network).
- It is YMYL-light: present it as an estimator, with a "Sources & assumptions" box and a "Last reviewed" date.

Competitors make errors we can fix (CommLoan's DSCR, PropertyMetrics' debt yield).

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | commercial mortgage calculator | 8,100 | 6 | title, H1, first sentence, tool heading |
| Secondary | ltv calculator | 3,600 | 6 | the LTV output + Max loan tab + H2 |
| Secondary | ltv meaning · l.t.v. · what is ltv · ltv loan to value · ltv loan | 6,600 · 5,400 · 3,600 · 1,300 · 1,900 | 8–17 | H2 "What LTV (loan-to-value) means" + FAQ |
| Secondary | commercial mortgages · business mortgage · buying commercial property · commercial real estate loans | 1,000 · 590 · 720 · 4,400 | 7–20 | intro, H2 "Commercial vs residential mortgages" |
| Secondary | land payment calculator | 2,900 | 5 | FAQ + a "land loan" note (same payment maths; shorter terms are common; the user enters them) |
| Secondary | commercial construction loan(s) | 1,300 · 1,300 | 22 | FAQ: interest-only draw period (the I/O input models it) |
| FAQ only | commercial mortgage rates | 2,400 | 4 | ⚠ rate-lookup intent: explain what drives rates; show none |
| Support | commercial loan estimator | 2,400 | 25 | H2 wording |

## 2. Our edge

- **Both jobs in one tool:** *Payment & balloon* + *How much can I borrow?* (LTV / DSCR / debt-yield limits, the lowest wins). Nobody does both.
- **Formula shown with the user's numbers.** 0 of 4 competitors show it.
- **Term ≠ amortization visual:** balance chart with the balloon marked and the I/O period shaded.
- **Fees and points → effective rate (APR-style)** via `loan-engine.aprWithFees`.
- **Refinance at maturity:** the balloon becomes a new loan at a new rate.
- **Rate as fixed or index + spread.** The user types the index; nothing is fetched.
- Correct DSCR and debt-yield definitions. Printable schedule. Currency + UK wording.

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **Payment & balloon** (default)
2. **How much can I borrow?**
3. **Refinance the balloon**

### 3.2 Input guide diagram (above the inputs, rules §9)

`CommercialMortgageInputGuide.tsx`: a timeline bar, the key concept of commercial loans.

- **Full bar** = "4 Amortization (years)", e.g. 25.
- **Solid first part** = "3 Loan term (years)", e.g. 10. A tall marker at its end is labelled "Balloon due here".
- **Optional hatched start** = "5 Interest-only months".
- **Above the bar:** a building icon with "1 Property value" and "2 Loan amount" (shown as a filled portion = LTV %), and a "% Rate" tag.
- **Max-loan tab:** three side-by-side gauges labelled "LTV limit", "DSCR limit" and "Debt-yield limit", fed by badges "6 NOI", "7 Max LTV", "8 Min DSCR" and "9 Min debt yield". The shortest gauge is highlighted as "your max loan".

Live values; the focused field highlights.

### 3.3 Inputs (defaults = examples; rates always user-entered)

| Group | Fields | Defaults |
|---|---|---|
| Loan | property value/price, loan amount **or** LTV %, rate (fixed % or index % + spread %), loan term years, amortization years, interest-only months, payments monthly | $2,000,000, 75%, 7.00% (label: "example rate, enter your quote"), 10, 25, 0 |
| Fees | origination/points %, other closing costs $ | 1%, $0 |
| Income (optional) | annual NOI (link: "don't know it? use the Cap Rate calculator") | $160,000 |
| Max-loan tab | NOI, value (or cap rate → value), max LTV %, min DSCR, min debt yield %, rate, amortization | $160,000, $2,000,000, 75%, 1.25, 9% (labels: "example lender limits, ask your lender") |
| Refi tab | new rate, new amortization, new term | — |

### 3.4 Engine

`loan-engine.ts` (payment, balanceAfter, schedule, maxLoanFromPayment, aprWithFees) + `real-estate-engine.ts` (dscr, debtYield, valueFromCap). Wrapper: `src/lib/commercial-mortgage-engine.ts`.

```ts
loan = value * ltv  (or typed) ; payment = payment(loan, apr, amortYears*12)
ioPayment = loan * apr / 12                       // during I/O months
balloon = balanceAfter(loan, apr, amortMonths, termMonths - ioMonths)   // I/O months don't reduce principal
interestInTerm, principalInTerm from schedule
ltv = loan / value ; dscr = noi / (payment*12) ; debtYield = noi / loan
maxLoanLtv = value * maxLtv
maxLoanDscr = maxLoanFromPayment(noi / minDscr / 12, apr, amortMonths)
maxLoanDy = noi / minDebtYield
maxLoan = min(…) ; equityNeeded = price - maxLoan ; bindingConstraint = argmin
effectiveRate = aprWithFees(loan, loan*points + closing, apr, termMonths)   // over the actual term, balloon included
refi: newLoan = balloon (+ costs) → new payment
```

**Worked example (defaults, checked 2026-11-20):**

| Item | Value |
|---|---|
| Loan | $1,500,000 |
| Payment | $10,601.69/mo ($127,220.26/yr) |
| **Balloon after 10 years** | **$1,179,500.95** |
| Interest paid in term | $951,703.50 |
| LTV | 75% |
| DSCR at $160,000 NOI | 1.26 |
| Debt yield | 10.67% |

**Max loan:**

| Limit | Value |
|---|---|
| LTV | $1,500,000 ← binds |
| DSCR | $1,509,194 |
| Debt yield | $1,777,778 |

### 3.5 Outputs

- **Headline:** monthly payment + balloon at maturity.
- **Sentence:** "A $1,500,000 commercial mortgage at 7% on a 25-year amortization costs $10,601.69 a month. After the 10-year term, $1,179,501 is still owed as a balloon payment."
- Cards: LTV, DSCR, debt yield, effective rate with fees, interest paid in term.
- **Schedule:** yearly table (monthly on expand) + SVG balance chart (I/O shaded, balloon marked). Print, Copy CSV.
- Max-loan tab: three limits, the binding one highlighted, equity needed.
- **"Sources & assumptions" box** (formula reference, "rates and lender limits are examples you replace") + "Last reviewed" date.
- Share URL.

### 3.6 Tests

- Payment vs known values; rate 0 path.
- Balloon = remaining balance; I/O months.
- Schedule totals (interest + principal = payments).
- Max loan: each constraint and the binding choice.
- `aprWithFees` > the note rate when fees > 0.
- Refi path. The worked example. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Commercial Mortgage Calculator – Payment & Balloon` (50, over 60 with the suffix → `absoluteTitle`) |
| Meta | `Free commercial mortgage calculator. Get the monthly payment, balloon balance, amortization schedule, loan-to-value and DSCR for a commercial property loan.` (156) |
| H1 | `Commercial Mortgage Calculator: Payment, Balloon, LTV & DSCR` |
| BLUF | "Commercial loans are often paid as if over 25 years but due after 10, so a balloon is left at the end. A $1.5 million loan at 7% costs $10,602 a month and leaves a $1.18 million balloon after 10 years." (engine) |
| ToolShell pills | `Balloon & interest-only`, `Max loan by LTV & DSCR`, `Printable schedule`, `Share link` |
| Links out | Cap Rate, Rental Property, Equipment Loan (when built), SBA Loan (when built), Commercial Lease |
| Links in | Cap Rate, Rental Property, Commercial Lease, Equipment Loan, SBA, Tools hub "Real estate" |

## 5. Content (~1,900–2,200 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the commercial mortgage calculator | 3 tabs | 130 |
| 2 | How a commercial mortgage payment is calculated | Formula + engine example | 230 |
| 3 | Loan term vs amortization: why there's a balloon | Diagram reference, engine example | 220 |
| 4 | Interest-only periods | Engine example; construction-loan note | 150 |
| 5 | What LTV (loan-to-value) means | `ltv meaning`, `what is ltv`; formula; example | 200 |
| 6 | DSCR and debt yield: how lenders size a loan | Max-loan example; lender limits vary (no unsourced "typical") | 250 |
| 7 | Fees, points and the effective rate | Engine example | 130 |
| 8 | Refinancing the balloon | Risk explained, engine example | 150 |
| 9 | Commercial vs residential mortgages | Table: term, amortization, recourse, prepayment (general) | 180 |
| 10 | What affects commercial mortgage rates | Answers `commercial mortgage rates` without numbers | 120 |
| 11 | FAQ | §6 | 400 |
| — | Sources & assumptions + disclaimer | YMYL | 60 |

## 6. FAQ (11)

1. How is a commercial mortgage payment calculated?
2. What is the difference between loan term and amortization?
3. What is a balloon payment?
4. What does LTV mean? (`ltv meaning`)
5. How much down payment do I need for a commercial property? (= 1 − LTV; lenders vary)
6. What is DSCR and what do lenders look for? (no fixed number; example only)
7. What is debt yield?
8. How much can I borrow for a commercial property?
9. What is an interest-only period? (construction loans)
10. Can I use this as a land payment calculator? (`land payment calculator`)
11. Why doesn't this page show current commercial mortgage rates? (zero network; rates change; ask lenders)

## 7. Done when

- [x] `loan-engine.ts` (created now if Rental Property didn't) + `commercial-mortgage-engine.ts` + tests; `npm run verify` passes. *(Evidence: 4 tests passing in commercial-mortgage-engine.test.ts, npm run verify passes with 0 errors)*
- [x] Input guide diagram (timeline + gauges) above the inputs; balance chart in results; ToolShell + TabSlider used. *(Evidence: CommercialMortgageInputGuide.tsx with timeline + Underwriting Triad gauges; CommercialMortgageCalculator.tsx with SVG paydown chart, ToolShell with 4 feature pills, TabSlider)*
- [x] No live or "current" rates anywhere; Sources & assumptions box + Last reviewed date. *(Evidence: YMYL assumptions card with November 2026 review date, MBA/CCIM/OCC citations in HowWeCalculate)*
- [x] Schedule prints and copies; registrations + docs updated; `graphify update .`. *(Evidence: printable schedule table with monthly/annual views, clipboard copy, registered in routes, catalog, Footer, ToolArt, calculation methods)*
