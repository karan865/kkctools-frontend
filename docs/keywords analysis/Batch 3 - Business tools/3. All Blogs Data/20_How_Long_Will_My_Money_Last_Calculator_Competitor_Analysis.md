# Retirement Drawdown – “How Long Will My Money Last?” Calculator — Competitor Analysis

> **Target page:** KKCTools `/how-long-will-my-money-last/` (Batch 3, Tier 2 #20)
> **Primary keyword:** `how long will my money last` — US 12,100 · KD 0 · CPC $1.20 (cluster 15 keywords, 46,090 US vol) · YMYL: **high**
> **SERP source:** ⚠ No Semrush SERP export for Batch 3. Competitors from live web search (2026-11-14). `TODO(owner): pull Google top 10 — expect NerdWallet, Omni, Fidelity, Schwab, insurers.`
> **Pages visited:** 2026-11-14 — 6 read (Omni, Calculate.co.nz, CreditDonkey, Michael Ryan Money, Richify, Western & Southern). NerdWallet: only navigation captured.
> **YMYL rule:** retirement income is “Your Money or Your Life”. Keep the maths transparent, show assumptions and limitations, no product promotion, no “safe” guarantees, cite primary sources (SSA life tables, BLS CPI, published research) with dates. Author/reviewer credentials only if the owner provides real ones (AGENTS.md rule 3).

---

## 0. How this was collected (read first)

- Read: Omni retirement withdrawal, Calculate.co.nz (NZ), CreditDonkey, Michael Ryan Money (retired planner), Richify (AI-authored finance app), Western & Southern (insurer).
- Also in search (not read): Mutual of Omaha, LPL, Fidelity Bank, The Ways to Wealth — insurer/bank white-label tools.
- Meta and schema not readable. Word counts are estimates. Do not copy text, tables or scenario numbers (AGENTS.md rule 8).

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | omnicalculator.com/finance/retirement-withdrawal | Giant | Retirement Withdrawal Calculator | ~1,000 |
| 2 | calculate.co.nz/retirement-how-long-money-last-calculator.php | NZ calc site | Retirement: How Long Will My Money Last Calculator NZ | 450–550 |
| 3 | creditdonkey.com/how-long-will-my-money-last-calculator.html | Affiliate finance | How Long Will My Money Last Calculator | 1,200–1,400 |
| 4 | michaelryanmoney.com/how-long-will-my-money-last/ | Retired planner blog | How Long Will My Money Last in Retirement? Calculator | 2,300–2,700 |
| 5 | richify.ai/us/tools/retirement-withdrawal-calculator | AI finance app | Retirement Withdrawal Calculator | ~2,500 |
| 6 | westernsouthern.com/retirement/retirement-withdrawal-calculator | Insurer | Retirement Withdrawal Calculator | 1,300–1,600 |

**What this tells us:**
- **Two questions:** “how many years will my savings last?” and “how much can I withdraw to last until age X?” — Omni and Richify do both.
- **Best tools:** Michael Ryan (Social Security/pension, fees, 3 strategies, **3-scenario stress test**, year-by-year) and Richify (inflation-linked withdrawals, **sequence-of-returns illustration**, tables by savings × withdrawal).
- **Common gaps:** no Monte Carlo/probability (all deterministic), taxes ignored, sequence risk only illustrated, life expectancy rarely tied to SSA tables.
- **Errors in SERP:** CreditDonkey misspells Bengen (“Bergen”) and calls the 4% rule safe “even during the worst downturns”; Omni says systematic withdrawals “cannot run out”.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Omni | Calc.co.nz | CreditDonkey | MichaelRyan | Richify | W&S |
|---|---|---|---|---|---|---|
| Years money lasts | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Max withdrawal to last until age X | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Withdrawal grows with inflation | ✅ | ❌ | ⚠️ (4% growth) | ✅ | ✅ toggle | ✅ income increase % |
| Return assumption | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Investment fees | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Social Security / pension / other income | ❌ | ❌ (excludes NZ Super) | ❌ | ✅ with start age | ❌ | ✅ (+ growth) |
| Withdrawal strategies (fixed $, % of balance, 4% rule) | ⚠️ text | ❌ | ⚠️ text | ✅ 3 | ⚠️ 4% compare | ❌ |
| Timing (start/end of period), frequency | ✅ | ⚠️ | ❌ | ❌ | ⚠️ withdraw first | ✅ monthly/yearly |
| Sequence-of-returns risk | ❌ | ❌ | ❌ | ✅ “rough first 5 years” | ✅ illustration | ❌ |
| Scenarios / stress test | ❌ | ❌ | ❌ | ✅ 3 runs | ⚠️ | ❌ |
| Monte Carlo probability | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Taxes (pre-tax vs Roth) | ❌ | ❌ | ⚠️ bracket listed, unused | ❌ | ❌ | ❌ |
| Life expectancy reference | ❌ | ❌ | ❌ | ✅ SSA text | ❌ | ❌ |
| Year-by-year table | ✅ | ❌ | ✅ | ✅ | ✅ | ⚠️ chart |
| Chart | ✅ | ❌ | ❌ | ✅ | ⚠️ | ✅ |
| Currency / non-US | ❌ | NZD | ❌ | ❌ | ❌ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Omni | Calc.co.nz | CreditDonkey | MichaelRyan | Richify | W&S |
|---|---|---|---|---|---|---|
| Formula / method explained | ⚠️ | ✅ prose | ❌ | ⚠️ “constant-return” | ✅ method | ❌ |
| Worked examples | 2 | 1 (checked correct: 21.6 yrs) | 3 balances | several | 2 | 0 |
| “How long will $500k / $1M last” | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| 4% rule explained (accurately) | ✅ | ❌ | ⚠️ errors | ✅ (Morningstar 3.9%) | ✅ | ⚠️ |
| Sequence risk explained | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Limitations section | ⚠️ disclaimer | ✅ | ❌ | ✅ | ⚠️ | ⚠️ |
| FAQ count | 0 | 3 | 0 (question H2s) | 6 | 7 | 0 |
| Named author | ✅ | ✅ reviewer | ✅ | ✅ retired planner | ⚠️ AI author | ❌ |
| Date | ❌ | ✅ Nov 2026 | ❌ | ✅ Nov 2026 | ✅ Nov 2026 | ✅ Feb 2026 |
| Sources | ⚠️ 1 book | ❌ | ⚠️ CPI (stale) | ✅ 4 (Morningstar, Fidelity, SSA) | ⚠️ | ✅ listed |

---

## 4. Competitor-by-competitor detail

### Omni — retirement-withdrawal
- Mode: how long / how much. Inputs: balance, current age, retirement age, years in retirement, return, pre- and post-retirement inflation; advanced: frequency, compounding, timing. Outputs: withdrawal amount, year-by-year balance, chart.
- Strategies explained: 4% rule ($300k → $12k, +2% inflation), fixed-dollar, fixed-%, systematic, buckets.
- **Errors:** “systematic withdrawals mean you cannot run out of money”; buckets explanation garbled; no FAQ/date.

### Calculate.co.nz — how long money last (NZ)
- Pot, annual draw, return → years (example $500k, 4%, $35k → 21.6 years — verified with n = ln(W/(W − rP)) ÷ ln(1+r)); “forever” if draw ≤ return. Excludes inflation and NZ Super. **FAQs (3):** how long · can it last forever · inflation & NZ Super.
- **Lesson:** simple, correct, but missing inflation and income sources.

### CreditDonkey — how long will my money last
- Balance, return, monthly withdrawal → years + table. Examples: $500k ≈ 16 yrs, $800k ≈ 30 yrs, $1.5M > 30 yrs (with 8% return, withdrawals +4%/yr).
- **Errors:** “William Bergen” (should be **Bengen**); 4% rule called safe in the worst downturns (overclaim); stale CPI; tax bracket listed but unused; 3 repeated adviser ads.

### Michael Ryan Money — how long will my money last — **content & feature benchmark**
- Inputs: balance, start age, plan-through age, return, inflation, **fees**, strategy (3), spending, **Social Security/pension/other + start age + inflation adjustment**, withdrawal-rate options, sensitivity adjusters. Outputs: first/final withdrawal, ending balance, totals, **3 scenarios (expected, lower return, rough first five years)**, chart, year-by-year.
- Content: how to read the result, what determines longevity, $500k and $1M examples, **three-run stress test**, how to make money last longer, **what the calculator doesn't model** (taxes, RMDs, IRMAA, LTC). Sources: Morningstar 3.9%, Fidelity, SSA life expectancy.
- **FAQs (6):** how to calculate · reasonable withdrawal rate · include Social Security? · is 4% rule useful · what return to assume · why two people get different answers.
- **Weak points:** deterministic only; scenario definitions vague; clutter.

### Richify — retirement withdrawal calculator (AI-authored)
- Savings, first-year withdrawal, return, inflation, age, last-until age, inflation-linked or flat → years, run-out age, starting rate, max withdrawal to target age, total, year-by-year; **grids of years by savings × withdrawal** and income by savings; **safe-rate table by retirement age with “bad start” column**; **sequence-of-returns** comparison; plan vs 4% rule.
- **FAQs (7):** how long will savings last · $1M · what is 4% rule · withdraw so money lasts until I die · sequence risk · before/after tax · what return.
- **Weak points:** AI author for YMYL; no Social Security/fees/tax; heavy app CTAs.

### Western & Southern — retirement withdrawal (insurer)
- Savings, monthly income needed, **Social Security, pension, other income**, growth rates, return (−12% to 12%), schedule → years and total withdrawals + chart. No method, no example, no FAQ; lead-gen forms.

---

## 5. Patterns

- **Maths (deterministic):** each period: balance × (1 + r) − withdrawal(t); withdrawal(t) = (spending − other income(t)) grown by inflation; stop when balance < withdrawal. Closed form for flat withdrawal: n = ln(W ÷ (W − rP)) ÷ ln(1 + r). Max sustainable withdrawal = PV annuity (growing if inflation-linked).
- **Sequence risk:** same average return, different order → different longevity; illustrate with a down-first scenario.
- **Monte Carlo** would need random returns — feasible client-side (no network) but must explain assumptions; optional later.

| Section | Pages (of 6) |
|---|:---:|
| Two-way (years ↔ max withdrawal) | 3 |
| Other income (SS/pension) | 2 |
| Fees | 1 |
| Scenarios/stress test | 1–2 |
| Sequence risk | 2 |
| Taxes | **0** |
| Probability | **0** |

---

## 6. FAQ question bank (merged, with our keyword data)

★ = asked on 2+ pages. Map to the 15 keywords in the Batch 3 file.

| # | Question | Seen on |
|---:|---|---|
| 1 | ★ How long will my retirement savings last? | Calc.co.nz, Richify, MichaelRyan |
| 2 | ★ How long will $500,000 / $1 million last? | CreditDonkey, MichaelRyan, Richify |
| 3 | ★ What is the 4% rule — is it still useful? | Richify, MichaelRyan, CreditDonkey, Omni |
| 4 | ★ What return should I assume? | MichaelRyan, Richify |
| 5 | ★ Should I include Social Security / pension? | MichaelRyan, Calc.co.nz |
| 6 | How much can I withdraw so my money lasts until I die (age X)? | Richify |
| 7 | What is sequence-of-returns risk? | Richify |
| 8 | Are withdrawals before or after tax? | Richify |
| 9 | Can my money last forever? | Calc.co.nz |
| 10 | Why do two people with the same savings get different answers? | MichaelRyan |
| 11 | How does inflation affect how long my money lasts? | CreditDonkey, Calc.co.nz |
| 12 | How long might retirement last (life expectancy)? | MichaelRyan (SSA) |

---

## 7. Gaps nobody fills — our opportunities

1. **Both questions in one tool:** years until depletion **and** max withdrawal to last to age X.
2. **Full inputs:** fees, inflation-linked or flat withdrawals, multiple income sources with start ages and COLA, one-off expenses.
3. **Scenario panel:** expected / lower return / bad first years (defined numerically) + sequence illustration.
4. **Optional simple Monte Carlo** (client-side, seeded, assumptions shown) — 0 competitors; or clearly state “deterministic”.
5. **Life-expectancy helper** from SSA period life table (cited, dated) — “plan to age …”.
6. **Simple tax option:** effective tax % on withdrawals (no tax rules engine).
7. **Year-by-year table + chart**, CSV copy.
8. **Correct, careful 4% rule explanation** (Bengen 1994; limitations), no “safe” guarantees.
9. **Currency + non-US income wording** (state pension, NZ Super, CPP).
10. **No adviser ads, no lead forms** — trust advantage for YMYL.

---

## 8. Blueprint for the KKCTools “How Long Will My Money Last” Calculator

### 8.1 SEO

- **URL:** `/how-long-will-my-money-last/`
- **Title/H1/Meta:** from Batch 3 keyword file; H1 contains the exact question.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Mode | years it lasts · max spending to last to age X |
| Savings | balance, return, fees, inflation |
| Spending | annual/monthly, inflation-linked or flat, one-off expenses by year |
| Income | up to 3 sources (Social Security/state pension, pension, other) with start age & COLA |
| Tax | effective % (optional) |
| Scenarios | expected, lower return (−x%), bad start (first N years at −y%) |
| Outputs | run-out age, years, max sustainable spending, withdrawal rate, year-by-year table, chart |
| Optional | Monte Carlo success % (seeded, assumptions visible) |
| UX | currency, share URL, print, no network |

### 8.3 Content outline (≈ 2,000–2,400 words, original)

1. Quick answer (formula in one line + example)
2. How to use
3. What decides how long your money lasts (withdrawal, return, inflation, fees, time)
4. Worked examples ($500k and $1M — engine-generated)
5. The 4% rule — what it is and its limits (cited)
6. Sequence-of-returns risk (illustration)
7. Adding Social Security / pensions
8. How long might retirement last? (SSA life tables, cited)
9. Ways to make savings last longer
10. What this calculator doesn't model
11. FAQ (10–12)
12. Related tools — Compound Interest (#21), Net Worth (#19), Investment Return (#27), Present Value (#26)
13. YMYL disclaimer + sources + date

### 8.4 Quality checks

- Unit tests vs closed-form results; scenario and income-start logic; Monte Carlo reproducibility (seed).
- Every external figure cited with date; no guarantees language.
- No competitor wording copied. `npm run check:no-network` passes.
- `TODO(owner): pull Google top-10 SERP; check NerdWallet article body by hand; provide reviewer credentials only if real.`
