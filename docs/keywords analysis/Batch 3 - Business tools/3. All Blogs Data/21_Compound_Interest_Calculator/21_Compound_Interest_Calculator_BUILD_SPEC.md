# Compound Interest Calculator — Build Spec

> **URL:** `/compound-interest-calculator/` · Batch 3 **Part 3** · **Part 3 build order 2** (reuses `tvm-engine` from Present Value)
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + 2 + Part 3 §12–13)
> **Inputs used:** `21_Compound_Interest_Calculator_Competitor_Analysis.md`, `KKCTools_Batch3_Final_Tool_Keywords.md` §2b, Semrush exports
> **Written:** 2026-11-20

---

## 0. Strategy note

**The keyword file removed `compound calculator` (18,100, KD 7)** because of who ranks: investor.gov 70, NerdWallet 80, Bankrate 78, TheCalculatorSite 78, MoneyChimp, MDM, and only 3 open slots. KD 7 is misleading here.

**The exports show weakly-served variants with real volume:**

| Keyword | US vol | KD | Note |
|---|---:|---:|---|
| `compound growth calculator` | 6,600 | **4** | |
| `compound daily calculator` | 1,600 | **3** | |
| `calculate interest compounded monthly` | 1,000 | 7 | |
| `compound interest vs simple interest` | 2,400 | 14 | |
| `figure compound interest calculator` | 14,800 | 0 | Odd phrasing; Semrush may be grouping variants. Use the words naturally, don't build around them. |

**Target the daily, monthly and growth long tail + "solve for" modes** (no competitor solves for deposit, rate or time). Treat the head term as long-term.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary (now)** | compound growth calculator | 6,600 | 4 | title wording, H2, Growth tab |
| Secondary | compound daily calculator · compound interest calculator for daily | 1,600 · 8,100 | 3 · 23 | H2 "Daily compounding" + frequency table |
| Secondary | calculate interest compounded monthly | 1,000 | 7 | H2 "Interest compounded monthly" |
| Secondary | compound interest vs simple interest · simple interest vs compound interest | 2,400 · 4,400 | 14 · 28 | H2 + comparison output |
| Secondary | compounding calculator · compound calculator | 9,900 · 18,100 | 10 · 7 | natural wording, tool heading |
| Secondary | compounded continuously | 2,400 | 22 | "Continuous" frequency option + FAQ |
| Secondary | apy to apr calculator | 1,000 | 24 | APR ↔ APY converter panel + H2 |
| Head (long-term) | compound interest calculator | — | — | H1 (page name) |
| Skip | nerdwallet / myusfinance compound interest (brand) | — | — | never target |

## 2. Our edge

- **Solve for anything:** future value · monthly deposit needed for a goal · rate needed · time needed. **0 competitors** have solve modes.
- **Correct mixed-frequency maths** (deposit monthly, compound daily) with start/end timing, and the convention stated. Inch's formula is wrong when the frequencies differ.
- **Inflation-adjusted (real) balance + simple tax-on-interest %.** 0 competitors.
- **APR vs APY input switch** (avoids double compounding) + a converter panel.
- **Frequency comparison table** (annual, monthly, daily, continuous) for the same inputs. It teaches that the rate matters far more than the frequency.
- **Compare scenario B** side by side (e.g. start now vs 5 years later).
- Yearly/monthly table + SVG chart (deposits vs interest), CSV. Currency selector. 365 vs 360-day note.

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **Growth** (default): future value
2. **Savings goal**: solve for deposit / rate / time
3. **Simple vs compound**: same inputs side by side
4. **APR ↔ APY**: converter

### 3.2 Input guide diagram (above the inputs, rules §9)

`CompoundInputGuide.tsx`: a snowball rolling down a gentle slope, growing in size.

- **Starting snowball:** "1 Starting amount".
- **Snow added at regular marks:** "2 Monthly deposit"; a "3 Deposit timing" toggle puts it at the start or end of each mark.
- **Slope steepness:** "4 Interest rate %".
- **Tick density on the slope:** "5 Compounding: yearly / monthly / daily".
- **Slope length:** "6 Years".
- **Bottom:** the big snowball, labelled "Future value", with an "Interest earned" slice highlighted. A small thermometer icon shows "7 Inflation %" (real value).
- **Simple vs compound tab:** two slopes, one where the snowball doesn't grow (simple) vs one where it does.

Live values; the focused field highlights.

### 3.3 Inputs (defaults = examples)

| Field | Default |
|---|---|
| Starting amount | $10,000 |
| Rate % + "this is APR / APY" switch | 5% APR |
| Compounding | monthly (annual, semi-annual, quarterly, monthly, daily 365, daily 360, continuous) |
| Deposit amount + frequency + timing (start/end) | $200 monthly, end |
| Annual deposit increase % | 0% |
| Withdrawals (optional): amount, frequency | none |
| Years (+ months) | 10 |
| Inflation % (optional) | 0% |
| Tax on interest % (optional) | 0% |
| Goal tab | target amount + the field to solve |

### 3.4 Engine (`src/lib/tvm-engine.ts` + `src/lib/compound-interest-engine.ts`)

```ts
nominalFromApy(apy, n) = n * ((1+apy)^(1/n) - 1)   // when the user enters APY
iPerDeposit = (1 + r/n)^(n/m) - 1                  // m = deposits per year
fv = P*(1+r/n)^(n*t) + PMT * ((1+i)^(m*t) - 1)/i * (start ? (1+i) : 1)      // continuous: e^(r t), i = e^(r/m) - 1
schedule: period loop (handles deposit growth, withdrawals, tax on interest each year)
apy(r, n) = (1 + r/n)^n - 1 ; continuous: e^r - 1
doublingYears = ln 2 / ln(1 + apy)
real = fv / (1 + inflation)^t
solve: deposit (closed form), rate (bisection), time (log form / loop)
simple: P*(1 + r*t) + Σ deposits*(1 + r*remaining)   (state the convention)
```

**Worked examples (checked 2026-11-20):**

| Case | Result |
|---|---|
| $10,000 at 5% compounded monthly + $200/month (end) for 10 years | **$47,526.55** ($34,000 deposited, $13,526.55 interest) |
| $10,000 for 10 years at 5%, no deposits: annual / monthly / daily | $16,288.95 / $16,470.09 / $16,486.65 (daily beats monthly by only $16.56) |
| APY of 5% compounded monthly | 5.116% |
| Doubling time | ≈ 13.89 years |

### 3.5 Outputs

- **Headline:** future value + interest earned.
- **Sentence:** "Starting with $10,000 and adding $200 a month at 5% compounded monthly, you'd have $47,526.55 after 10 years: $34,000 of deposits and $13,526.55 of interest."
- Cards: total deposits, total interest, APY, doubling time, real value (if inflation is set).
- Frequency comparison table. Yearly table + SVG stacked chart. CSV.
- Goal tab: the solved value + a sentence. Simple vs compound: two columns + the difference.
- Share URL, Print.

### 3.6 Tests

- The examples above.
- Mixed frequency (daily compounding + monthly deposits) against a period loop.
- Start vs end timing.
- APY input path (no double compounding).
- Continuous.
- Solves round-trip (solved deposit → FV = target).
- Rate 0. Inflation/tax adjustments. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Compound Interest Calculator – Daily, Monthly & Growth` (54, over 60 with the suffix → `absoluteTitle`) |
| Meta | `Free compound interest calculator. See how savings grow with daily or monthly compounding and regular deposits, or work out the deposit needed for a goal.` (154) |
| H1 | ` (10) |
| H1 | `Compound Interest Calculator: Daily, Monthly and Compound Growth` |
| BLUF | "Compound interest earns interest on your interest. Future value = P × (1 + r/n)^(n×t), plus your deposits grown the same way. $10,000 plus $200 a month at 5% compounded monthly grows to $47,526.55 in 10 years." (engine) |
| ToolShell pills | `Solve for deposit, rate or time`, `Daily to continuous`, `Inflation-adjusted value`, `Yearly table & chart` |
| Links out | Present Value, How Long Will My Money Last (Part 2), Investment Return (Part 3), Percentage Change |
| Links in | Present Value, Investment Return, Net Worth, Credit Card Payoff, Tools hub "Money" |

## 5. Content (~1,900–2,200 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the compound interest calculator | 4 tabs | 120 |
| 2 | Compound interest formula | + engine example | 200 |
| 3 | Compound growth with monthly deposits | `compound growth calculator`; timing | 200 |
| 4 | Interest compounded monthly vs daily vs annually | Engine table; why the difference is small (`calculate interest compounded monthly`, `compound daily calculator`) | 220 |
| 5 | Continuous compounding | `compounded continuously` | 120 |
| 6 | Compound interest vs simple interest | Engine comparison | 180 |
| 7 | APR vs APY (and converting between them) | `apy to apr calculator` | 180 |
| 8 | Rule of 72 and doubling time | Engine vs rule-of-72 estimate | 130 |
| 9 | Inflation and taxes: your real growth | Example | 150 |
| 10 | How much do I need to save each month? | Goal tab example | 150 |
| 11 | FAQ | §6 | 400 |
| — | Disclaimer | "Illustration; returns are not guaranteed" | 30 |

## 6. FAQ (11)

1. How does compound interest work?
2. How do I calculate compound interest? (formula)
3. How do I calculate interest compounded monthly?
4. Is daily compounding much better than monthly?
5. What does compounded continuously mean?
6. What's the difference between simple and compound interest?
7. APR vs APY: which should I enter?
8. How long does it take money to double? (Rule of 72 vs exact)
9. How much do I need to save each month to reach $X?
10. How does inflation affect my savings?
11. Does deposit timing (start vs end of month) matter?

## 7. Done when

- [ ] `tvm-engine.ts` reused; `compound-interest-engine.ts` + tests; `npm run verify` passes.
- [ ] Input guide diagram per tab above the inputs; chart in results; ToolShell + TabSlider used.
- [ ] No brand keywords targeted; no "guaranteed return" language.
- [ ] Registrations + docs updated; `graphify update .`.
