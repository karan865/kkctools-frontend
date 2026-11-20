# "How Long Will My Money Last?" Calculator — Build Spec

> **URL:** `/how-long-will-my-money-last/` · Batch 3 Part 2 · **Tier 3 (YMYL)** · **Build order 12**
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + Part 2; §6 Tier 3 gate, §10.3 YMYL box)
> **Inputs used:** `20_How_Long_Will_My_Money_Last_Calculator_Competitor_Analysis.md` (6 pages), `KKCTools_Batch3_Final_Tool_Keywords.md` §2 #16
> **Written:** 2026-11-20

---

## 0. Gate and strategy

**🚫 Tier 3 gate:** build only after the owner records in `docs/00-PROJECT-STATUS.md` that they will review this page yearly. If there's no such note, skip this tool and report.

**SERP:**
- **12,100 + 6,600 searches at KD 0** (~46,000 in the cluster).
- No giants: CalcXML 39, Mutual of Omaha 55, then banks and credit unions at AS 30–63.

**Why Tier 3:**
- It's retirement money (YMYL), and every ranking page is a bank or insurer (a trust signal).
- Our trust plan:
  - cited formula and assumptions;
  - "Sources & assumptions" box and "Last reviewed" date;
  - no guarantees language;
  - no adviser ads or lead forms (a plus);
  - `TODO(owner)`: a real reviewer's name and credentials, **only if real** (never invented).

**Accuracy edge:** competitors make errors.
- CreditDonkey misspells Bengen and calls the 4% rule safe "even during the worst downturns".
- Omni says systematic withdrawals "cannot run out".

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | how long will my money last | 12,100 | 0 | H1 (exact question), title, first sentence |
| Secondary | how long will my money last calculator | 6,600 | 0 | title + tool heading |
| Secondary | how long will my savings last (calculator) | 2,400 · 3,600 | 1–27 | H2 + FAQ |
| Secondary | how long will my retirement savings last (calculator) · how long will retirement savings last (calculator) · how long will money last in retirement · how long will my money last in retirement calculator | 4,400 · 2,400 · 1,300 · 2,400 · 1,300 · 1,600 | 14–25 | H2 "How long will my retirement savings last?" + FAQ |
| Secondary | how long will money last (calculator) · how long money last | 1,300 · 2,900 · 1,600 | 24–29 | natural wording |
| Secondary | 4 percent rule calculator | 590 | 0 | 4% rule mode + H2 (cite Bengen 1994; Trinity study 1998) |
| Support | investment calculator with withdrawals | 1,600 | 27 | H2 wording + year-by-year table |

## 2. Our edge

- **Both questions in one tool:**
  - How many years will my money last?
  - How much can I spend each year so it lasts to age X?
  - Only 3 of 6 competitors do both.
- **Full inputs:**
  - inflation-linked or flat withdrawals;
  - fees %;
  - up to 3 other income sources (Social Security / state pension / pension / other), each with a start age and yearly increase;
  - one-off expenses by year;
  - optional effective tax % on withdrawals.
- **Scenarios:** expected / lower return / bad first years (defined numerically) + a sequence-of-returns illustration.
- **4% rule mode**, explained carefully with its limits (no "safe" claims).
- **Year-by-year table + SVG balance chart**, CSV copy.
- **Life-expectancy helper:** link SSA's life-expectancy tools; `TODO(owner)` before embedding any table values.
- **Deterministic and labelled as such.** Monte Carlo is a possible later phase (seeded, assumptions shown); not in v1.

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **How many years?** (default)
2. **How much can I spend?** (to last until age X)
3. **4% rule check**

### 3.2 Input guide diagram (above the inputs, rules §9)

`DrawdownInputGuide.tsx`: a water-tank drawing (savings pot).

- **Tank level:** "1 Savings today".
- **Inflow pipe at the top:** "2 Investment return %", with a small leak labelled "3 Fees %".
- **Outflow tap at the bottom:** "4 Yearly spending"; a "5 Inflation %" arrow shows the tap opening wider each year.
- **Side inflow:** "6 Other income (Social Security, pension)", which starts at "7 Start age".
- **Below the tank:** an age ruler "8 Your age now → age the tank runs dry" (live result).
- **Spend tab:** the ruler is fixed at "9 Plan to age" and the tap size is the answer.

Live values; the focused field highlights.

### 3.3 Inputs (defaults = examples)

| # | Field | Default |
|---:|---|---|
| 1 | Savings today | $500,000 |
| 8 | Current age | 65 |
| 4 | Spending from savings per year (or per month) + "rises with inflation" toggle | $40,000, on |
| 2 | Expected return % per year (nominal) | 5% (label: "example, not a forecast") |
| 5 | Inflation % | 3% (label: example) |
| 3 | Annual fees % | 0% |
| 6–7 | Other income ×3: amount/yr, start age, yearly increase % | none |
| — | One-off expenses: year/age + amount (add rows) | none |
| — | Effective tax % on withdrawals (optional) | 0% |
| 9 | Plan to age (Spend tab) | 95 |
| — | Scenarios: lower return (−x pts), bad start (first N years at −y%) | −2 pts; 2 years at −15% |
| — | Withdrawal timing: start / end of year | end (document it) |

### 3.4 Engine (`src/lib/drawdown-engine.ts`)

```ts
// yearly loop (end-of-year withdrawal by default)
balance = balance * (1 + r - fee) - netWithdrawal(t)
netWithdrawal(t) = max(0, spending(t) * grossUp(tax) - otherIncome(t)) + oneOff(t)
spending(t) = spending0 * (1+inf)^t   (if linked)
runOut: first year balance < 0 → fractional year = (balance_before*(1+r-fee)) / netWithdrawal(t)   // report years + months
closed form (flat W, no extras): n = ln(W / (W - rP)) / ln(1+r)   // null/∞ when W <= rP → "lasts indefinitely at these assumptions"
maxSpending(age X): growing annuity  P = W * (1 - ((1+g)/(1+r))^n) / (r - g)  (r == g → P = W * n / (1+r)); with extras → bisection on W
withdrawalRate = W / P
scenarios: re-run with returns path [r-2pts…] / [-15%, -15%, r, r, …]; sequence illustration: same average return, reversed order
```

**Worked examples (checked 2026-11-20):**

| Case | Result |
|---|---|
| $500,000, flat $40,000/yr, 5% return | **20.1 years** (closed form) |
| Same, with spending rising 3% a year | **about 15 years** |
| $1,000,000 with $40,000 rising 3% | about 36 years |
| Spend tab: spending (rising 3%) that lasts 30 years from $500,000 at 5% | **$22,810.94** in year 1 (a 4.56% starting withdrawal rate) |

The page computes all of these from the engine.

### 3.5 Outputs

- **Headline:** "Your money lasts about 15 years, until age 80" (or "indefinitely at these assumptions").
- **Sentence:** "Taking $40,000 a year from $500,000, rising with 3% inflation and earning 5%, the money lasts about 15 years. Without inflation increases it would last about 20 years."
- Year-by-year table (age, start balance, growth, withdrawal, other income, end balance) + SVG chart. CSV copy.
- Scenario panel (3 run-out ages side by side) + sequence illustration.
- 4% tab: first-year amount at 4% + how long it lasts under the user's assumptions. **No "safe" wording.**
- **"Sources & assumptions" box:** formula, deterministic returns, timing, inflation treatment, Bengen 1994 citation, "not financial advice". "Last reviewed" date.
- Share URL, Print.

### 3.6 Tests

- Loop equals the closed form for the flat case (±0.02 years).
- W ≤ rP → indefinite.
- Growing-annuity max spending, then plugging it back in → balance ≈ 0 at the plan age.
- Other income start ages; one-off expense; fees; tax gross-up.
- Bad-start scenario runs out earlier than expected.
- Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `How Long Will My Money Last? Retirement Calculator` (50, over 60 with the suffix → `absoluteTitle`) |
| Meta | `Free calculator: enter savings, yearly withdrawals, return and inflation to see how many years your money will last, with a year-by-year balance table.` (151) |
| H1 | `How Long Will My Money Last Calculator` |
| BLUF | "Your money lasts until withdrawals use up the balance plus its growth. $500,000 earning 5% with $40,000 taken out a year lasts about 20 years; if the $40,000 rises with 3% inflation, about 15 years." (engine) |
| ToolShell pills | `Years left or max spending`, `Inflation & pensions`, `Bad-start scenario`, `Year-by-year table` |
| Links out | Percentage Change, Hourly to Salary, Rental Property (income property as retirement income: neutral link). The removed tools (Compound Interest, Net Worth) are **not** built, so don't link them. |
| Links in | Tools hub "Money" row |

## 5. Content (~2,100–2,400 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | Quick answer: how long will my money last? | Formula in words + engine example | 150 |
| 2 | How to use the calculator | 3 tabs | 120 |
| 3 | What decides how long your savings last | Spending, return, inflation, fees, time, other income | 220 |
| 4 | How long will $500,000 or $1 million last? | Engine examples table | 200 |
| 5 | How long will my retirement savings last? | Adding Social Security / pensions (engine) | 200 |
| 6 | The 4% rule: what it is and what it isn't | Bengen 1994 (Journal of Financial Planning), Trinity study 1998; limits; no "safe" | 250 |
| 7 | Sequence-of-returns risk | Illustration from the engine | 180 |
| 8 | How long might retirement last? | Link SSA life-expectancy calculator (cite) | 120 |
| 9 | Ways to make savings last longer | Practical, non-advisory | 150 |
| 10 | What this calculator doesn't model | Taxes in detail, market randomness, health costs | 120 |
| 11 | FAQ | §6 | 450 |
| — | Sources & assumptions + disclaimer + Last reviewed | | 80 |

**Citations to verify before shipping (builder must open each):**
- Bengen, W. P. (1994), "Determining Withdrawal Rates Using Historical Data", *Journal of Financial Planning*.
- Cooley, Hubbard & Walz (1998), "Retirement Savings: Choosing a Withdrawal Rate That Is Sustainable", *AAII Journal*.
- SSA life-expectancy calculator page.

If a source page can't be opened, cite only what can be verified, or remove the line.

## 6. FAQ (12)

1. How long will my money last in retirement? (`how long will money last in retirement`)
2. How long will $500,000 last? (engine)
3. How long will $1 million last? (engine)
4. What is the 4% rule? (`4 percent rule calculator`)
5. Is the 4% rule still useful? (limits; no guarantee)
6. What return should I assume? (explain; no forecast)
7. Should I include Social Security or a pension?
8. How does inflation change how long my money lasts?
9. How much can I withdraw so my money lasts until I'm 95?
10. What is sequence-of-returns risk?
11. Are the withdrawals before or after tax?
12. Can my money last forever? (when withdrawals ≤ growth; the engine's indefinite case)

## 7. Done when

- [x] Owner's yearly-review note exists in `docs/00-PROJECT-STATUS.md` (gate).
- [x] `drawdown-engine.ts` + tests (§3.6); `npm run verify` passes.
- [x] Input guide (tank) above the inputs; chart in results; ToolShell + TabSlider used.
- [x] Sources & assumptions box, Last reviewed date, no guarantee words ("safe", "will last" as a promise).
- [x] Registrations + docs updated; `graphify update .`.
