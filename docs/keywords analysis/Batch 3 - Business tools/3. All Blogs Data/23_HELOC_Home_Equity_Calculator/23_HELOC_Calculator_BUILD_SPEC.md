# HELOC & Home Equity Calculator — Build Spec

> **URL:** `/heloc-calculator/` · Batch 3 **Part 3** · **YMYL** · **Part 3 build order 6**
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + 2 + Part 3 §12–13; §10.3 YMYL box)
> **Inputs used:** `23_HELOC_Home_Equity_Calculator_Competitor_Analysis.md`, `KKCTools_Batch3_Final_Tool_Keywords.md` §2b, Semrush exports
> **Written:** 2026-11-20

---

## 0. Strategy note

**The keyword file removed `heloc calculator`** (40,500, KD 10). Bank of America 85, Chase 85, Bankrate 78, U.S. Bank 76 and Calculator.net 90 hold it, and it's YMYL (your home is the collateral).

**The long tail has real volume at low KD:**

| Keyword | US vol | KD |
|---|---:|---:|
| `heloc loan calculator` | 12,100 | **9** |
| `estimate home equity payment` | 2,400 | **9** |
| `heloc amortization calculator` | 880 | **7** |

**Our angle is the part nobody shows: payment shock.**
- Engine example: $50,000 at 8% costs $333.33/month interest-only, then **$418.22/month** over a 20-year repayment.
- Plus draws over time, extra principal during the draw period, rate-rise scenarios, and HELOC vs home-equity loan vs cash-out refinance.

**Users always type rates.** No live rates, no lender ads, no address capture. "Sources & assumptions" box + "Last reviewed".

**Tax line:** only what IRS Publication 936 says, read on irs.gov with the year (interest deductible only if the money buys, builds or substantially improves the home that secures the loan). If not verified, omit it.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary (now)** | heloc loan calculator | 12,100 | 9 | title, H1 wording, tool heading |
| Secondary | estimate home equity payment | 2,400 | 9 | H2 "Estimate your home equity payment" + Payment tab |
| Secondary | heloc amortization calculator | 880 | 7 | the repayment schedule + H2 |
| Head (long-term) | heloc calculator | 40,500 | 10 | H1 / first sentence |
| Natural phrases | how much can I borrow with a HELOC · HELOC payment · CLTV · home equity loan vs HELOC | — | — | H2s, FAQ |

## 2. Our edge (from the competitor analysis)

- **Three-step tool:** borrowing limit (CLTV) → draw-period payment (interest-only, 1/360 + interest, or % of balance) → repayment payment + **payment shock** with a worked example. Omni covers part of it; only Regions has the 1/360 method; **no one shows a numeric shock example**.
- **Draw schedule** (e.g. $20k now, $10k in year 3) instead of one lump.
- **Extra principal during the draw period** → smaller shock (0 tools).
- **Rate scenarios:** current, +1%, +2%, optional cap.
- **Fees** (closing, annual) in the total cost.
- **HELOC vs home-equity loan vs cash-out refi** on the same amount, with the user's rates (0 tools).
- Concrete "payment on a $50k / $100k HELOC" answers (engine).

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **How much can I borrow?** (CLTV)
2. **Payments & payment shock** (default)
3. **Compare** (HELOC vs home equity loan vs cash-out refi)

### 3.2 Input guide diagram (above the inputs, rules §9)

`HelocInputGuide.tsx`

**Borrow tab:** a house drawn as a tall bar = "1 Home value". A line marks "3 Max CLTV %" (e.g. 85%). Under it:
- the filled part = "2 Mortgage balance";
- the gap between the mortgage and the CLTV line = "Your max HELOC" (highlighted);
- the top slice above the CLTV line = "equity you keep".

**Payments tab:** a two-part timeline.
- **Left part:** "4 Draw period (years)", with low flat payment bars ("interest-only") and optional "5 Draws".
- **Right part:** "6 Repayment period (years)", with taller bars. A red bracket between the two marks "Payment shock".
- A "7 Rate %" tag, plus "+1% / +2%" ghost bars for the scenarios.

Live values; the focused field highlights.

### 3.3 Inputs (defaults = examples; rates user-entered)

| Tab | Fields | Defaults |
|---|---|---|
| Borrow | home value, mortgage balance(s), max CLTV % (editable; label "lenders set their own limit") | $400,000, $250,000, 85% |
| Payments | amount drawn (lump) or draw schedule rows; draw years; draw payment method (interest-only / 1/360 + interest / % of balance); extra principal per month; repayment years (or balloon); APR (variable); scenario +1/+2%; rate cap; closing costs; annual fee | $50,000, 10 years, interest-only, $0, 20 years, 8% (example) |
| Compare | home equity loan rate + term; cash-out refi: new rate, term, closing costs, current mortgage rate & balance | — |

### 3.4 Engine

Uses `loan-engine.ts`. Wrapper: `src/lib/heloc-engine.ts`.

```ts
maxLine = homeValue * maxCltv - mortgageBalance   // null/0 if negative → "no equity available at this CLTV"
cltv = (mortgage + line) / homeValue
drawPayment: io = balance*apr/12 ; '1/360' = balance/360 + interest ; pct = balance*pct
drawSchedule: balance grows by draws; extra principal reduces it
repayPayment = payment(balanceAtEndOfDraw, apr, repayYears*12)   // or balloon
shock = repayPayment - lastDrawPayment ; shockPct = shock / lastDrawPayment
scenarios: rerun with apr+1, apr+2 (capped)
totalInterest, totalCost (+ fees) ; schedule (yearly / monthly)
compare: HEL payment = payment(amount, helRate, helTerm) ; refi = new loan (balance + amount + costs) vs old payment
```

**Worked example (checked 2026-11-20):**
- Max line: $400,000 × 85% − $250,000 = **$90,000**.
- $50,000 at 8%: interest-only **$333.33/month**; 20-year repayment **$418.22/month** (shock +$84.89, +25.5%).

### 3.5 Outputs

- **Headline:** draw payment → repayment payment, with the shock highlighted.
- **Sentence:** "Borrowing $50,000 at 8%, you'd pay about $333 a month interest-only during the draw period, then $418 a month for 20 years: a 25% jump."
- Borrowing-limit card (max line, CLTV).
- Scenario table (rate, draw payment, repay payment).
- Schedule + SVG chart. Total interest and cost.
- Compare table (monthly, total interest, closing costs).
- **Sources & assumptions + risks box:** variable rate, home as collateral, draw freezes (general), no rate data, Pub 936 line only if verified. "Last reviewed".
- Share URL, Print.

### 3.6 Tests

- The worked example.
- 1/360 method.
- Draw schedule + extra principal.
- Balloon option.
- Scenarios with a cap.
- Negative equity → message.
- Compare maths. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `HELOC Loan Calculator – Payment, Limit & Payment Shock` (54, over 60 with the suffix → `absoluteTitle`) |
| Meta | `Free HELOC loan calculator. See how much you can borrow, your interest-only and repayment payments, the payment jump, and HELOC vs home equity loan.` (148) |
| H1 | `HELOC Calculator: Borrowing Limit, Payments and Payment Shock` |
| BLUF | "Most HELOCs charge interest-only during the draw period, then a full principal-and-interest payment afterwards. $50,000 at 8% is about $333 a month at first and $418 a month over a 20-year repayment. Your limit is roughly home value × 85% − mortgage." (engine; CLTV labelled example) |
| ToolShell pills | `Borrowing limit (CLTV)`, `Payment shock shown`, `Rate-rise scenarios`, `HELOC vs home equity loan` |
| Links out | Commercial Mortgage (Part 2), Credit Card Payoff, Net Worth, Compound Interest |
| Links in | Credit Card Payoff (consolidation note), Net Worth, Tools hub "Money" |

## 5. Content (~1,900–2,200 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the HELOC loan calculator | 3 tabs | 120 |
| 2 | How much can you borrow with a HELOC? | CLTV formula + example | 200 |
| 3 | Estimate your home equity payment in the draw period | Interest-only vs 1/360 vs % (`estimate home equity payment`) | 220 |
| 4 | Repayment period and payment shock | Engine example | 220 |
| 5 | HELOC amortization schedule | Reading the table (`heloc amortization calculator`) | 150 |
| 6 | Variable rates: what a rate rise does | Scenario example | 160 |
| 7 | HELOC vs home equity loan vs cash-out refinance | Compare example | 220 |
| 8 | Fees and total cost | | 120 |
| 9 | Tax treatment | Pub 936 line only if verified | 80 |
| 10 | Risks to understand | Collateral, freezes, balloon (general) | 130 |
| 11 | FAQ | §6 | 420 |
| — | Sources & assumptions + disclaimer + Last reviewed | | 80 |

## 6. FAQ (11)

1. How do I calculate my HELOC payment?
2. How is HELOC interest calculated?
3. How much can I borrow with a HELOC? (CLTV)
4. What happens when the draw period ends?
5. What is the payment on a $50,000 HELOC? (engine)
6. What is the payment on a $100,000 HELOC? (engine)
7. Are HELOC rates fixed or variable?
8. HELOC vs home equity loan: what's the difference?
9. What is CLTV?
10. Is HELOC interest tax-deductible? (Pub 936, verified, or "see IRS Pub 936")
11. Do I need my home paid off to get a HELOC? (no; equity matters)

## 7. Done when

- [ ] `loan-engine` reused; `heloc-engine.ts` + tests; `npm run verify` passes.
- [ ] Input guide (house bar + two-phase timeline) above the inputs; ToolShell + TabSlider used.
- [ ] No live rates, no lender ads; Sources & assumptions + Last reviewed.
- [ ] Registrations + docs updated; `graphify update .`.
