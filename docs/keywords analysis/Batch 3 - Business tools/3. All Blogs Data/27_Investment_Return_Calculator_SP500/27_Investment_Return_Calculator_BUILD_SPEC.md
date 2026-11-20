# Investment Return Calculator (S&P 500, T-Bills, Money Market) — Build Spec

> **URL:** `/investment-return-calculator/` · Batch 3 **Part 3** · **YMYL** · **Part 3 build order 7 (last)**
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + 2 + Part 3 §12–13; §10.3 YMYL box)
> **Inputs used:** `27_Investment_Return_Calculator_SP500_Competitor_Analysis.md`, `KKCTools_Batch3_Final_Tool_Keywords.md` §2b, Semrush exports
> **Written:** 2026-11-20

---

## 0. Strategy note and scope

**The keyword file removed this tool.** `s and p 500 calculator` (4,400) has a SERP KD of 62: Calculator.net 90, investor.gov 70, NerdWallet 80, iShares 61, Ramsey 64. It's YMYL.

**Smaller rows that fit our zero-network rule:**

| Keyword | US vol | KD |
|---|---:|---:|
| `money market interest calculator` | 1,000 | 14 |
| `calculate money market interest` | 720 | 12 |
| `money market account calculator` | 2,400 | 22 |
| `t bill calculator` | 1,300 | 23 |
| `investment calculator s&p 500` | 880 | 10 |

**Data rule (blocking):**
- Historical S&P 500 returns need a monthly price + dividend + CPI dataset. We can't fetch live data.
- The **historical mode ships only if** the owner approves a static dataset whose licence allows reuse, e.g. Robert Shiller's public data (check the licence/terms on his page), with an `asOf` date and its sources.
- `TODO(owner)`: decide on the dataset and the refresh schedule.

**v1 (ships without that dataset):**
- **Projection mode:** lump sum + contributions at an **assumed** return, clearly labelled illustrative, with fees and inflation.
- **Money market / savings interest mode:** balance × APY, with monthly deposits.
- **T-bill mode:** price ↔ yield maths from the user's inputs (discount yield, investment yield). Standard formulas, cited to TreasuryDirect pages the builder actually opens.
- **Compare mode:** stock-like assumed return vs cash-like yield, same deposits.

**Never** show "the S&P 500 averaged X%" unless it is computed from the approved dataset, with dates.

**Brand rows** (NerdWallet / Ramsey investment calculator) are never targeted. `roth ira return calculator` (1,900, KD 3) gets an FAQ only (tax-account rules are out of scope).

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary (now)** | investment calculator s&p 500 | 880 | 10 | title, H1 wording, Projection tab |
| Secondary | money market interest calculator · calculate money market interest · money market account calculator | 1,000 · 720 · 2,400 | 12–22 | Money market tab + H2 |
| Secondary | t bill calculator | 1,300 | 23 | T-bill tab + H2 |
| Head (long-term) | s and p 500 calculator · investment return calculator | 4,400 · — | 17 (SERP 62) | H1 / intro wording |
| Support | investment calculator with withdrawals | 1,600 | 27 | withdrawals option + link How Long Will My Money Last |
| FAQ only | roth ira return calculator | 1,900 | 3 | FAQ: use Projection with your assumed return; tax rules not modelled |

## 2. Our edge

- **Stock-like vs T-bills vs money market on the same deposits.** 0 competitors compare with cash.
- **Fees (expense ratio)** and an optional **tax drag** %. 0 competitors model fees.
- **Lump sum vs monthly investing** for the same total.
- **Nominal and real (inflation-adjusted) results + CAGR** in one card.
- **T-bill price ↔ yield helper** (nobody on the SERP has it).
- **Historical mode (if approved):**
  - "$X invested in [month/year] → today", with dividends reinvested or price-only;
  - max drawdown, best and worst year in the window;
  - data-through date shown next to the result.
- The past-performance / illustrative disclaimer sits **next to the result**, not only in the footer.

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **Projection** (default): assumed return
2. **Money market / savings**
3. **T-bill**
4. **Compare** (stocks vs cash)
5. **Historical S&P 500**: **only if the dataset is approved**; otherwise the tab is not rendered

### 3.2 Input guide diagram (above the inputs, rules §9)

`InvestInputGuide.tsx`

**Projection tab:** a rising line chart sketch.
- Start dot "1 Starting amount".
- Small step-ups along the line "2 Monthly contribution".
- Slope label "3 Assumed yearly return %".
- A thin grey band under the line "4 Fees %".
- Length "5 Years".
- End dot "Final value".
- A second dashed line "6 Inflation %" → "in today's money".

**Money market tab:** a savings jar with "Balance", "APY %" and "Monthly deposit" coins.

**T-bill tab:** a bill graphic, "7 Face value $" vs "8 Price paid $", with "9 Days to maturity" → yield.

Live values; the focused field highlights.

### 3.3 Inputs (defaults = examples; return labelled "assumed, not a forecast")

| Tab | Fields | Defaults |
|---|---|---|
| Projection | starting amount, contribution + frequency + timing, yearly step-up %, assumed return %, fees (expense ratio) %, tax drag %, inflation %, years, withdrawals (optional) | $10,000, $300/mo end, 0%, 7%, 0%, 0%, 0%, 20 |
| Money market | balance, APY %, monthly deposit, months | $25,000, 4.5% (example), $0, 12 |
| T-bill | face value, price paid (or discount rate), days to maturity | — |
| Compare | same deposits; stock assumed return vs cash APY | 7% vs 4.5% (examples) |
| Historical (if approved) | start/end month, lump/monthly, dividends reinvested toggle, fees | — |

### 3.4 Engine (`src/lib/investment-return-engine.ts`, reusing `tvm-engine`)

```ts
projection: monthly loop; r_m = (1+ret)^(1/12)-1 - fee/12 (state convention); deposits with step-up; tax drag on gains yearly
real = nominal / (1+inflation)^years ; cagr = (end/start)^(1/years)-1 (money-weighted note when contributions exist)
moneyMarket: monthly rate from APY = (1+apy)^(1/12)-1 ; interest = balance after months - deposits
tbill: discountYield = (face-price)/face * 360/days ; investmentYield = (face-price)/price * 365/days   // cite TreasuryDirect formulas after reading them
compare: two projections, same deposits
historical (gated): TR index from dataset; value = amount × TR(end)/TR(start); DCA sum; real via CPI; drawdown
```

**Worked examples (checked 2026-11-20):**

| Case | Result |
|---|---|
| $10,000 + $300/month for 20 years at an assumed 7% (monthly rate 7%/12, end-of-month) | **$196,665.39** from $82,000 contributed |
| $25,000 at 4.5% APY for 12 months | **$1,125** interest |

The builder must pick **one** monthly-rate convention: the effective rate (1 + r)^(1/12) − 1, or the nominal r/12.
- State it in the UI and HowWeCalculate.
- Make the test match the convention.
- The $196,665.39 figure uses nominal r/12. With the effective convention the number differs; recompute it.

### 3.5 Outputs

- **Headline:** final value + total contributed + growth.
- **Sentence:** "Investing $10,000 plus $300 a month at an assumed 7% a year would grow to about $196,665 in 20 years. That's an illustration, not a forecast."
- Cards: real value, CAGR, fees paid, growth vs contributions.
- Yearly table + SVG chart. CSV.
- Compare: two lines + a difference banner.
- **Disclaimer next to the result** + Sources & assumptions + "Last reviewed" (+ "data through" for historical).
- Share URL, Print.

### 3.6 Tests

- Projection vs `tvm-engine` FV.
- Fee drag lowers the value.
- Real value.
- Money market APY → monthly.
- T-bill yields against a hand case.
- Compare.
- Historical (if built) against benchmark windows computed from the bundled dataset. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Investment Calculator – S&P 500, T-Bills & Money Market` (55, over 60 with the suffix → `absoluteTitle`) |
| Meta | `Free investment calculator. Project growth at an assumed S&P 500-style return, compare it with T-bills and money market interest, and see fees and inflation.` (157) |
| H1 | ` (33) |
| H1 | `Investment Return Calculator: S&P 500, T-Bills and Money Market` |
| BLUF | "Future value depends on what you put in, the return, fees and time. $10,000 plus $300 a month at an assumed 7% grows to about $196,665 in 20 years. A 4.5% money market account pays $1,125 a year on $25,000." (engine; return labelled assumed) |
| ToolShell pills | `Stocks vs cash compare`, `Fees & inflation`, `Money market & T-bills`, `Yearly table & chart` |
| Links out | Compound Interest, Present Value, How Long Will My Money Last (Part 2), Net Worth |
| Links in | Compound Interest, Net Worth, Tools hub "Money" |

## 5. Content (~1,800–2,100 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the investment calculator | Tabs; "assumed return" honesty note | 130 |
| 2 | How investment growth is calculated | Formula + engine example | 200 |
| 3 | Using an S&P 500-style return | What an assumed return means; **no historical % unless from the approved dataset** (`investment calculator s&p 500`) | 200 |
| 4 | Money market interest: how to calculate it | APY example (`calculate money market interest`) | 180 |
| 5 | T-bill calculator: price and yield | Formulas (cited) + example (`t bill calculator`) | 180 |
| 6 | Stocks vs cash: comparing growth | Compare example + risk note | 180 |
| 7 | Fees and inflation: what they cost | Engine example | 160 |
| 8 | Lump sum vs monthly investing | Example | 130 |
| 9 | Historical S&P 500 returns | **Only if the dataset is approved**: method, sources, data-through date | (150) |
| 10 | FAQ | §6 | 400 |
| — | Disclaimer + sources + Last reviewed | | 80 |

## 6. FAQ (10)

1. How do I calculate investment returns?
2. What return should I use for the S&P 500? (assumption; no forecast; historical only from the dataset)
3. How do I calculate money market interest? (`calculate money market interest`)
4. How do T-bill yields work? (`t bill calculator`)
5. Do fees really make a big difference? (engine)
6. What is an inflation-adjusted (real) return?
7. Lump sum or monthly investing: which grows more?
8. Can I use this as a Roth IRA return calculator? (`roth ira return calculator`: growth yes, tax rules not modelled)
9. Can I include withdrawals? (link How Long Will My Money Last)
10. Is this investment advice? (no)

## 7. Done when

- [ ] `investment-return-engine.ts` + tests; `tvm-engine` reused; `npm run verify` passes.
- [ ] Historical tab rendered **only** with an owner-approved, licensed static dataset (asOf + sources); otherwise absent.
- [ ] Input guide diagram per tab above the inputs; ToolShell + TabSlider used.
- [ ] Disclaimer next to results; no unsourced return figures; registrations + docs updated; `graphify update .`.
