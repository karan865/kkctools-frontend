# Rental Property Calculator — Build Spec

> **URL:** `/rental-property-calculator/` · Batch 3 Part 2 · Tier 1 · **Build order 2** (after Cap Rate, reusing its NOI engine)
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + Part 2)
> **Inputs used:** `07_Rental_Property_Calculator_Competitor_Analysis.md` (8 pages), `KKCTools_Batch3_Final_Tool_Keywords.md` §2 #4 (Semrush SERP 2026-11-16)
> **Written:** 2026-11-20

---

## 0. Strategy note

**All 10 SERP slots are open:**
- The three strong domains (Investopedia 91, LoopNet 72, Wall Street Prep 56) are **articles**, not calculators.
- The seven calculators are AS 18–43.

Google puts cash-on-cash, rental ROI, cash flow and pro forma searches in **one SERP**, so build **one strong page**, not four.

**The primary term is half informational.** The first paragraph must define cash-on-cash return in one sentence, then give the tool.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary (title)** | cash on cash return calculator | 1,300 | 17 | title, H1, tool heading |
| **Primary (definition)** | cash on cash return | 3,600 | 7 | first sentence + H2 "What is cash-on-cash return?" |
| Secondary | calculate rental property | 2,900 | 8 | H2 "How to calculate rental property returns" |
| Secondary | investment property calculator | 1,300 | 2 | intro + H2 |
| Secondary | cash on cash roi · cash on cash calculator · coc calculator · coc formula · cash on cash yield | 880 · 720 · 110 · 110 · 140 | 0–12 | H2 formula + FAQ |
| Secondary | roi calculator real estate · return on investment real estate · rental roi · how to calculate roi for rental property · rate of return on rental property | 480 · 210 · 140 · 140 · 110 | 0–7 | H2 "Rental property ROI" |
| Secondary | rental cash flow calculator · cash flow in real estate · cash flow property | 480 · 170 · 170 | 2–14 | H2 "Monthly cash flow" |
| Secondary | real estate pro forma · pro forma real estate · real estate proforma template · pro forma rental property | 480 · 390 · 140 · 110 | 9–13 | 5–10 year pro forma table + "Print as pro forma" + H2 |
| Secondary | property value to rent ratio | 390 | 24 | the rent-to-price ratio output + 1% rule section |
| Secondary | property management cost calculator | 140 | 6 | management % input; FAQ |
| FAQ | what is a good roi in real estate · what is a good roi for rental property · what is roi in real estate · how do you make money on rental property | 260 · 260 · 480 · 110 | 5–23 | FAQ. **No invented benchmarks** ("8–12% is good" appears everywhere without a source) |
| Support | calculator real estate investment · real estate roi | 880 · 320 | 27–28 | H2 wording |

**Don't use in copy:** the misspellings ("pro froma…") or development pro forma (a different model; FAQ line only).

## 2. Our edge

- **One dashboard:** monthly and annual cash flow, cash-on-cash, cap rate, gross and net yield, DSCR, GRM, break-even occupancy, 1% rule, rent-to-price. Competitors show 2–4 of these; **yield and DSCR appear on 0 of 8**.
- **5/10-year pro forma:**
  - rent growth, expense growth, appreciation, principal paydown → equity and total return;
  - IRR (simple, transparent).
  - 1 of 8 competitors has any multi-year view.
- **All-cash vs financed** side by side (shows leverage).
- **UK/AU wording:** "rental yield" (gross and net), £/A$. Everything stays pre-tax.
- **Engine-generated worked example.** Landlord Studio's example doesn't add up.
- No sign-up (WSP and Landlord Studio push accounts).

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **Returns** (default): the full model below
2. **Pro forma**: years 1–10 table + chart
3. **Cash vs mortgage**: two columns of the same deal

### 3.2 Input guide diagram (above the inputs, rules §9)

`RentalInputGuide.tsx`: a simple house icon with three labelled flows.

```
            [1 Price] ── [2 Down payment %] + [3 Closing + 4 Repairs] = Cash invested
  House ──► [5 Monthly rent] − [6 Vacancy %] − [7 Expenses: tax · insurance · HOA · maintenance % · capex % · management %]
            = NOI ── − [8 Mortgage payment (rate, term)] = Cash flow
  Cash flow ÷ Cash invested = Cash-on-cash %
```

- Numbered badges match the field labels. The focused field highlights.
- Under "Expenses", a small dashed note: "Mortgage is not an operating expense: it comes after NOI".
- On the **Pro forma** tab the diagram adds a timeline arrow (Year 1 → Year 10) with badges for growth %, appreciation % and years.

### 3.3 Inputs (defaults = examples, labelled as such)

| Group | Fields | Defaults |
|---|---|---|
| Purchase | price, closing costs ($ or %), upfront repairs | $250,000, $7,500, $5,000 |
| Loan | financed toggle, down %, rate, term years (points optional) | on, 25%, 7%, 30 |
| Income | monthly rent, other income, vacancy % | $2,400, $0, 5% |
| Expenses | property tax/yr, insurance/yr, HOA/mo, utilities/mo, maintenance % of rent, capex % of rent, management % of collected rent, other | $3,000, $1,400, 0, 0, 5%, 5%, 8% |
| Pro forma | years (5/10), rent growth %, expense growth %, appreciation %, selling costs % | 10, 3%, 3%, 3%, 6% |

### 3.4 Engine

- Use `real-estate-engine.ts` for `noi`, `capRate`, `dscr`, `cashOnCash`, `grossYield`, `netYield`, `grm` and `irr`.
- Use `loan-engine.ts` for `payment`, `schedule` and `balanceAfter`.
- Thin wrapper: `src/lib/rental-property-engine.ts`.

```ts
grossRent = rent * 12 ; egi = grossRent * (1 - vacancy) + otherIncome * 12
opex = tax + insurance + hoa*12 + utilities*12 + grossRent*(maint + capex) + egi*mgmt + other
noi = egi - opex
debtService = payment(loan, apr, term*12) * 12          // 0 when all-cash
cashFlow = noi - debtService
cashInvested = down + closing + repairs (+ points)
coc = cashFlow / cashInvested                            // null if cashInvested <= 0
breakEvenOccupancy = (opex_fixed + debtService) / (grossRent + otherIncome*12 - variable costs)   // explain in UI
onePercentRule = rent / price >= 0.01 ; rentToPrice = rent / price
proForma(year n): rent, expenses grown; principal paid from schedule; value = price*(1+app)^n
totalReturn(n) = Σ cashFlow + principal paid + (value_n - price) - selling costs
irr = irr([-cashInvested, cf1, …, cfN + saleProceedsN])
```

**Worked example (engine defaults, checked 2026-11-20 with the formulas above):**

| Item | Value |
|---|---|
| Loan | $187,500 → payment $1,247.44/mo |
| Effective gross income (EGI) | $27,360 |
| Operating expenses (opex) | $9,468.80 |
| NOI | $17,891.20 |
| Debt service | $14,969.31 |
| Cash flow | $2,921.89/yr ($243.49/mo) |
| Cash invested | $75,000 |
| **Cash-on-cash** | **3.90%** |
| Cap rate | 7.16% |
| Gross yield | 11.52% |
| DSCR | 1.20 |
| Rent-to-price | 0.96% (1% rule: not met) |

The page must still compute these at build time from the engine. Never hard-code them.

### 3.5 Outputs

- **Headline cards:** monthly cash flow · cash-on-cash · cap rate · DSCR.
- **Plain sentence:** "With $75,000 invested, this rental makes about $243 a month after the mortgage: a 3.90% cash-on-cash return and a 7.16% cap rate (before tax)."
- **Metrics table:** gross and net yield, GRM, break-even occupancy, 1% rule (pass/fail with a one-line "rule of thumb, not advice" note), rent-to-price.
- **Income → NOI → cash flow breakdown** (each line monthly and yearly).
- **Pro forma table + inline SVG chart:** equity vs loan balance. "Print as pro forma" uses a print stylesheet; "Copy CSV".
- **Cash vs mortgage:** two columns (cash flow, CoC, total return, IRR).
- Share URL, Copy, Print.

### 3.6 Tests

- Every metric with the defaults above.
- All-cash path (debt service 0, CoC = cap on total cash).
- Zero cash invested → `null`.
- Negative cash flow path and message.
- Pro forma year-1 equals the Returns tab. Principal paid matches `loan-engine` balance.
- IRR known-value test.
- Snapshot of all page numbers.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Rental Property Calculator – Cash-on-Cash & ROI` (47; 59 with the suffix: OK) |
| Meta | `Free rental property calculator. Enter price, loan, rent and expenses to get monthly cash flow, cash-on-cash return, cap rate and rental yield in one view.` (155) |
| H1 | `Rental Property Calculator: Cash Flow, Cash-on-Cash Return & ROI` |
| BLUF | "Cash-on-cash return is the yearly cash a rental puts in your pocket divided by the cash you put in. A $250,000 rental with 25% down that clears $2,922 a year after the mortgage returns 3.90% on $75,000 invested." (engine) |
| ToolShell pills | `Cash flow + 8 metrics`, `10-year pro forma`, `Cash vs mortgage`, `Print & share link` |
| Links out | Cap Rate, Airbnb (when built), Commercial Mortgage (when built), Percentage Change |
| Links in | Cap Rate, Airbnb, Commercial Mortgage, Tools hub "Real estate" |

## 5. Content (~2,100–2,400 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | What is cash-on-cash return? | 2-sentence definition + formula (`cash on cash return`, `coc formula`) | 150 |
| 2 | How to use the rental property calculator | 3 tabs | 130 |
| 3 | How to calculate rental property returns: worked example | Engine table, every line | 260 |
| 4 | Monthly cash flow and NOI: what's included | Expense list, vacancy, capex vs maintenance | 200 |
| 5 | Cap rate, rental yield, ROI and DSCR: when to use each | Table; gross vs net yield for UK/AU readers | 220 |
| 6 | Leverage: paying cash vs a mortgage | Engine comparison | 180 |
| 7 | Long-term return: a 10-year real estate pro forma | Principal paydown, appreciation, IRR (`real estate pro forma`) | 220 |
| 8 | The 1% rule and rent-to-price ratio | What they test, their limits (`property value to rent ratio`) | 150 |
| 9 | Common mistakes | Forgetting vacancy, capex, closing costs; counting the mortgage as opex | 150 |
| 10 | FAQ | §6 | 450 |
| — | Disclaimer | Estimate, pre-tax, not investment advice | 30 |

## 6. FAQ (12)

1. How do you calculate cash-on-cash return? (`cash on cash calculator`)
2. What is a good cash-on-cash return? (explain how to set your own target versus other uses of the money; no unsourced %)
3. Cash-on-cash vs cap rate vs ROI: what's the difference?
4. Does cash-on-cash include appreciation or principal paydown? (no; total return does)
5. Can cash-on-cash return be negative?
6. How do I calculate ROI on a rental property? (`how to calculate roi for rental property`)
7. What is rental yield, gross vs net?
8. What is the 1% rule?
9. What is DSCR and why do lenders look at it?
10. How much should I budget for property management? (it's an input; how to get quotes; no invented %)
11. What is a real estate pro forma? (`what is a proforma in real estate`)
12. How do you make money on a rental property? (cash flow, paydown, appreciation)

## 7. Done when

- [x] `loan-engine.ts`, `real-estate-engine.ts` (from Cap Rate) reused; `rental-property-engine.ts` + tests; `npm run verify` passes.
- [x] Input guide diagram above the inputs (per tab); ToolShell + TabSlider used.
- [x] No unsourced "good return" numbers anywhere.
- [x] Pro forma prints cleanly (A4/Letter) and copies as CSV.
- [x] Mobile 390 px checked; registrations + docs updated; `graphify update .`.
