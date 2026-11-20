# Equipment & Business Loan Calculator — Build Spec

> **URL:** `/equipment-loan-calculator/` · Batch 3 Part 2 · Tier 2 · **Build order 9** (shares `loan-engine` with Commercial Mortgage)
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + Part 2)
> **Inputs used:** `13_Equipment_Business_Loan_Calculator_Competitor_Analysis.md` (3 pages), `KKCTools_Batch3_Final_Tool_Keywords.md` §2 #14
> **Written:** 2026-11-20

---

## 0. Strategy note

**SERP:**
- 3 strong relevant tools: Cat 61, Citizens 65, SoFi 73.
- 4 relevant tools at AS 25–43.
- An index page and a generic loan tool (open slots).

**The construction-equipment angle fits our audience.** Contractors already use the concrete, drywall and stud tools.

**Competitor tools are basic or broken:**
- United Capital shows $299,999 for every term.
- Quipli's example payments are wrong.
- So engine-tested numbers are a real edge.

**Merge rule (keyword file):** keep this separate from Commercial Mortgage unless the same sites rank for both. They share code, not a URL.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | equipment loan calculator | 1,900 | 6 | title, H1, first sentence |
| Secondary | business loan payment calculator | 720 | 3 | Business loan tab + H2 |
| Secondary | farm loan calculator | 2,400 | 0 | intro line + FAQ ("works for tractors and farm equipment; enter your terms"); annual/semi-annual payment frequency option |
| Secondary | dental loan calculator | 1,000 | 2 | FAQ (practice equipment) |
| Secondary | business line of credit calculator | 590 | 14 | Line of credit tab + H2 |
| Secondary | finance vs lease · difference between lease and finance | 2,400 · 2,400 | 17–23 | Lease vs buy tab + H2 |
| Secondary | finance lease vs operating lease · operating lease vs finance lease | 1,300 · 1,300 | 14–23 | FAQ (accounting view, short, general) |
| Secondary | heavy equipment financing · construction equipment financing · farm equipment financing | 1,600 · 1,300 · 2,400 | 16–26 | H2 "Heavy and construction equipment financing" |
| Secondary | mca calculator | 1,600 | 24 | MCA tab (factor rate → APR) + H2 |

## 2. Our edge

- **Cash vs loan vs lease, side by side** for the same equipment: total cost, monthly outflow, ownership at the end. 0 competitors.
- **Residual / balloon / $1 buyout / FMV lease** handled properly. 0 competitors.
- **Sales tax, fees and trade-in** in the financed amount.
- **Payback & ROI:** monthly revenue or savings − operating cost − payment → payback months. Only NerdWallet does part of this.
- **Several terms at once:** a payment table for 24–84 months, with correct maths.
- **MCA mode:** factor rate → effective APR. A real gap: MCA costs are usually shown as a factor, not an APR.
- **Line of credit mode:** draw, rate → interest-only and repayment payments.
- **Affordability:** annual cash flow → DSCR.
- **Tax explainer** with an IRS link + year only (Section 179). No numbers unless read on irs.gov.

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **Equipment loan** (default)
2. **Lease vs loan vs cash**
3. **Business loan / line of credit**
4. **Merchant cash advance (MCA)**

### 3.2 Input guide diagram (above the inputs, rules §9)

`EquipmentInputGuide.tsx`: an excavator/tractor silhouette with a price tag.

```
[1 Price] + [2 Sales tax %] + [3 Fees] − [4 Down payment] − [5 Trade-in] = Amount financed
Amount financed → [6 Rate %] → [7 Term (months)] → monthly payment   … optional [8 Balloon] flag at the end of the term bar
```

**Lease tab:** three columns of icons:
- Cash: a stack of notes.
- Loan: a calendar of payments + an "own it" key.
- Lease: a calendar + "9 Buyout: $1 / FMV / return it".

**MCA tab:**
- Bag "Advance $".
- × "Factor rate" = "Total payback".
- Split into daily/weekly drops over "Days to repay".

**Line of credit tab:** a meter showing "Credit limit" vs "Amount drawn".

Live values; the focused field highlights.

### 3.3 Inputs (defaults = examples; rates user-entered)

| Tab | Fields | Defaults |
|---|---|---|
| Loan | price, sales tax %, fees, down payment, trade-in, rate, term months, balloon $ or %, payment frequency (monthly / quarterly / semi-annual / annual for farm) | $80,000, 6%, $500, $10,000, $0, 8.5% (example), 60, 0, monthly |
| ROI (optional, Loan tab) | monthly revenue or savings from the equipment, monthly operating cost | — |
| Lease vs loan vs cash | lease payment, lease term, upfront, fees, buyout ($1 / FMV % / none), resale value at end (loan/cash) | $1,450, 60, $2,900, $0, $1, — |
| Business loan / LOC | amount, rate, term; LOC: limit, drawn, rate, draw-period months (interest-only), repayment months | — |
| MCA | advance, factor rate, remittance (daily/weekly), days to repay (or % of sales + monthly card sales) | $50,000, 1.35, daily, 180 |
| Affordability | annual business cash flow available for debt | optional |

### 3.4 Engine

Uses `loan-engine.ts`. Wrapper: `src/lib/equipment-loan-engine.ts`.

```ts
financed = price*(1+tax) + fees - down - tradeIn
payment = payment(financed - PV(balloon), apr, n) adjusted for balloon (pay PV of balloon at end)  // test both
totalInterest = payment*n + balloon - financed
termTable = [24,36,48,60,72,84].map(n => payment(financed, apr, n))
leaseTotal = upfront + leasePmt*n + fees + buyout ; loanTotal = down + payment*n + balloon (- resale) ; cashTotal = price*(1+tax) (- resale)
payback = (down + upfront costs) / (monthlyBenefit - opCost - payment)   // null if <= 0
mca: payback = advance*factor ; perRemit = payback / remitCount ; apr = factorRateToApr(...)   // nominal APR = daily IRR × 365 (state the convention)
loc: drawInterest = drawn*apr/12 ; repayment = payment(drawn, apr, repayMonths)
dscr = annualCashFlow / annualDebtService
```

**Worked example (defaults, checked 2026-11-20):**

| Item | Value |
|---|---|
| Amount financed | $75,300 |
| Payment | $1,544.89/mo over 60 months |
| Total interest | $17,393.69 |

| Term (months) | Payment |
|---:|---:|
| 24 | $3,422.81 |
| 36 | $2,377.04 |
| 48 | $1,856.02 |
| 60 | $1,544.89 |
| 72 | $1,338.71 |
| 84 | $1,192.49 |

| Option | Total cost (before resale) |
|---|---:|
| Loan | $102,693.69 |
| Lease | $89,901 |
| Cash | $84,800 |

**MCA:** $50,000 × 1.35 repaid daily over 180 days = $375/day ≈ **127.9% nominal APR**.

### 3.5 Outputs

- **Headline:** monthly payment + total interest.
- **Sentence:** "Financing $75,300 of equipment at 8.5% for 60 months costs $1,544.89 a month and $17,394 in interest."
- Term table (24–84 months) with the selected row highlighted.
- Lease vs loan vs cash: 3 columns (upfront, monthly, total, own at end?, total after resale), plus the cheapest-over-term banner. The note says leases may have tax and cash-flow reasons; this compares cost only.
- ROI card: net monthly benefit, payback months.
- MCA: total payback, per-remit amount, effective APR, with a clear "this is what the factor rate means as an annual rate" line.
- Schedule (yearly / monthly), print, CSV. Share URL.

### 3.6 Tests

- Payment values for every term in the table; rate 0.
- Balloon reduces the payment correctly.
- Lease and cash totals; payback `null` when the benefit ≤ payment.
- MCA APR against a known case (bisection converges).
- LOC interest-only then amortising.
- Non-monthly frequencies (annual farm payments). Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Equipment Loan Calculator – Business Loan Payments` (50, over 60 with the suffix → `absoluteTitle`) |
| Meta | `Free equipment loan calculator. Get monthly payments, total interest and an amortization schedule for equipment, farm and business loans, or compare leasing.` (157) |
| H1 | `Equipment Loan Calculator: Payments for Equipment and Business Loans` |
| BLUF | "Your equipment loan payment depends on the amount financed (price + tax + fees − down payment − trade-in), the rate and the term. $75,300 at 8.5% over 60 months is $1,544.89 a month." (engine) |
| ToolShell pills | `Lease vs loan vs cash`, `24–84 month table`, `MCA factor → APR`, `Printable schedule` |
| Links out | Commercial Mortgage, SBA Loan (when built), Labor Cost, Construction Estimate Template (live) |
| Links in | Commercial Mortgage, Labor Cost, SBA, Tools hub |

## 5. Content (~1,800–2,100 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the equipment loan calculator | 4 tabs | 120 |
| 2 | Equipment loan payment formula: example | Engine | 220 |
| 3 | Down payment, trade-in and balloon payments | Engine examples | 180 |
| 4 | Lease vs finance vs paying cash | `finance vs lease`, `difference between lease and finance`; comparison example | 250 |
| 5 | Will the equipment pay for itself? | Payback example | 150 |
| 6 | Heavy, construction and farm equipment financing | What to ask a lender; payment frequencies; no rate claims | 180 |
| 7 | Business loans and lines of credit | Engine examples (`business loan payment calculator`, `business line of credit calculator`) | 180 |
| 8 | Merchant cash advance: factor rate vs APR | Engine example (`mca calculator`) | 200 |
| 9 | Tax basics (Section 179) | Link irs.gov with year; no figures unless verified | 100 |
| 10 | FAQ | §6 | 400 |
| — | Disclaimer (YMYL-light) + Last reviewed | | 40 |

## 6. FAQ (11)

1. How is an equipment loan payment calculated?
2. Should I lease or finance equipment? (`finance vs lease`)
3. What's the difference between a finance lease and an operating lease? (short, general, accounting-standard names only)
4. How much down payment do I need? (lender-dependent; an input)
5. What is a balloon payment on equipment financing?
6. What is a $1 buyout lease vs an FMV lease?
7. Can I use this as a farm loan calculator? (`farm loan calculator`: annual payment option)
8. How do I convert an MCA factor rate to an APR? (`mca calculator`)
9. How does a business line of credit payment work?
10. Are equipment loans tax-deductible? (Section 179: link IRS, no numbers unless verified)
11. Will the equipment pay for itself?

## 7. Done when

- [ ] `loan-engine` reused (`aprWithFees`, `factorRateToApr` covered by tests); `equipment-loan-engine.ts` + tests; `npm run verify` passes.
- [ ] Input guide diagram per tab, above the inputs; ToolShell + TabSlider used.
- [ ] No live rates; IRS links dated; Last reviewed date shown.
- [ ] Registrations + docs updated; `graphify update .`.
