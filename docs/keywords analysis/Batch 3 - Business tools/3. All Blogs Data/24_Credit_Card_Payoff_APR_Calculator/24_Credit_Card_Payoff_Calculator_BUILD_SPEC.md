# Credit Card Payoff & APR Calculator — Build Spec

> **URL:** `/credit-card-payoff-calculator/` · Batch 3 **Part 3** · YMYL-light · **Part 3 build order 4**
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + 2 + Part 3 §12–13; §10.3 YMYL box)
> **Inputs used:** `24_Credit_Card_Payoff_APR_Calculator_Competitor_Analysis.md` (4 pages), `KKCTools_Batch3_Final_Tool_Keywords.md` §2b, Semrush exports
> **Written:** 2026-11-20

---

## 0. Strategy note

**The keyword file removed `credit card apr calculator`.** Card issuers and big publishers hold 9 of 10 slots: Discover 71, Chase 85, NerdWallet 80, Bankrate 78, SoFi 73, Credit Karma 68, Lloyds 70, Calculator.net 90.

**This is the hardest SERP in Part 3.** Our realistic angle is the jobs **no one does**:
- the **multi-card avalanche vs snowball planner** (0 tools);
- an honest **minimum-payment simulator** with the issuer's formula typed by the user (0 tools model it openly);
- a **balance-transfer calculator** with the fee (0 tools);
- a **clear interest method** (monthly vs daily). Competitors mix methods without saying so, and some publish wrong numbers.

**Long tail to target:**

| Keyword | US vol | KD |
|---|---:|---:|
| `estimate minimum payment credit card` | 2,400 | **5** |
| `calculator apr credit card` | 1,600 | **6** |
| `credit card apr calculator` | 3,600 | 8 |
| `how long to pay off credit card` | 1,900 | 24 |
| `what is apr` (H2/FAQ) | 49,500 | 22 |

**YMYL trust:** no card ads, no affiliate links. Cite CFPB and the Federal Reserve where facts are used. "Sources & assumptions" box + "Last reviewed".

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary (now)** | credit card apr calculator · calculator apr credit card | 3,600 · 1,600 | 8 · 6 | title, H1, APR converter + payoff tool |
| Secondary | estimate minimum payment credit card | 2,400 | 5 | Minimum-payment tab + H2 |
| Secondary | how long to pay off credit card · pay off credit card calculator · credit card payment calculator payoff · credit card payoff estimator · cc payoff calculator · pay off credit card debt calculator | 1,900 · 1,300 · — · 1,600 · 1,300 · 1,300 | 19–27 | H2 "How long to pay off a credit card" + Payoff tab |
| Secondary | how does apr work on a credit card · credit card apr | 1,900 · 4,400 | 18–20 | H2 "How credit card interest is calculated" |
| H2/FAQ (big) | what is apr · whats an apr · what's apr · annual apr | 49,500 · 1,600 · 1,000 · 6,600 | 11–22 | H2 "What is APR?" (short, clear) + FAQ |
| Secondary | apy to apr calculator | 1,000 | 24 | converter panel note (link Compound Interest's converter) |
| Skip | figuring apr loan (loan intent: one FAQ line linking loan pages) | — | — | — |

## 2. Our edge

See §0. Plus:
- Both modes (payment → months; months → payment) + a sensitivity table.
- New charges and annual fee inputs.
- Debt-free date; schedule + chart.
- The APR → daily periodic rate → monthly rate → effective APR converter (`credit card apr calculator` intent).

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **Payoff** (default): balance, APR, payment **or** target months
2. **Minimum payments**: the trap, with the user's issuer formula
3. **Several cards**: avalanche vs snowball
4. **Balance transfer**
5. **APR converter**

### 3.2 Input guide diagram (above the inputs, rules §9)

`CardPayoffInputGuide.tsx`: a credit card graphic with a balance bar draining month by month.

- **On the card:** "1 Balance" and "2 APR %".
- **The bar:** each monthly drop is "3 Your payment", split into a red sliver "interest (APR ÷ 12 × balance)" and a green part "principal". The bar shrinks toward a flag "Debt-free date".
- Optional "4 New charges per month" add to the bar.
- **Minimum tab:** the payment drop shrinks as the balance falls ("5 Min % of balance + interest, floor $"), showing visually why it takes years.
- **Several cards:** 2–3 card bars; arrows show the payoff order (highest APR first vs smallest balance first).
- **Transfer tab:** an arrow from card A to card B with "6 Transfer fee %" and "7 Promo months at x%".

Live values; the focused field highlights.

### 3.3 Inputs (defaults = examples)

| Tab | Fields | Defaults |
|---|---|---|
| Payoff | balance, APR, interest method (monthly APR÷12 / daily APR÷365 × days), monthly payment **or** target months, new charges/month, annual fee | $5,000, 22%, monthly, $200 |
| Minimum | min % of balance, + interest toggle, floor $ (labelled "check your card agreement") | 1% + interest, $25 |
| Several cards | rows: name, balance, APR, minimum; total monthly budget; method avalanche / snowball / custom | 3 example cards |
| Transfer | amount, fee %, promo APR, promo months, go-to APR, monthly payment, vs current APR | — |
| Converter | APR → daily periodic rate, monthly rate, effective APR | 22% |

### 3.4 Engine (`src/lib/card-payoff-engine.ts`; reuse `loan-engine.payment` for target months)

```ts
r = method === 'monthly' ? apr/12 : apr/365 * 30.4167   // state the convention in the UI
months = -ln(1 - r*B/P) / ln(1+r)        // null if P <= r*B → "payment doesn't cover interest"
simulate(B, payments, r, newCharges, annualFee) -> rows, totalInterest, debtFreeMonth
paymentForMonths(B, r, n) = r*B / (1 - (1+r)^-n)
minimumSim(B, r, pct, plusInterest, floor) -> months, interest (payment = max(floor, B*pct + (plusInterest ? interest : 0)), capped at B+interest)
multiCard(cards, budget, method) -> each month: minimums on all, extra to the target card (highest APR or smallest balance); roll freed payments forward
transfer: newBalance = amount*(1+fee); promo phase at promoApr; then goApr → total cost vs staying
converter: daily = apr/365 ; monthly = apr/12 ; effective = (1 + apr/365)^365 - 1
```

**Worked examples (checked 2026-11-20, monthly method):**

| Case | Result |
|---|---|
| $5,000 at 22% paying $200/month | **34 months** (closed form 33.75), ≈ **$1,750 interest** |
| Paying it off in 24 months | **$259.39/month** |
| Minimum payments (1% + interest, $25 floor) | **230 months (≈19.2 years)**, ≈ **$8,100 interest** |

The page computes these from the engine.

### 3.5 Outputs

- **Headline:** months to pay off + debt-free date + total interest.
- **Sentence:** "Paying $200 a month on a $5,000 balance at 22% APR clears it in 34 months and costs about $1,750 in interest. Paying only the minimum takes about 19 years and about $8,100 in interest."
- Sensitivity table (payments $150–$400 → months, interest).
- Schedule + SVG chart.
- Multi-card: avalanche vs snowball (months, interest, order).
- Transfer: savings vs staying + break-even note.
- **Sources & assumptions box:** interest method, minimum formula is the user's, CFPB link, "Last reviewed". **No average APR** unless cited from the Fed G.19 release with its date.

### 3.6 Tests

- The examples above.
- Payment ≤ interest → `null` + message.
- Daily vs monthly method.
- Minimum floor behaviour.
- Avalanche pays less interest than snowball on a mixed set.
- Transfer fee included.
- Converter values. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Credit Card APR Calculator – Payoff Time & Interest` (51, over 60 with the suffix → `absoluteTitle`) |
| Meta | `Free credit card APR calculator. See how long it takes to pay off a card, the interest you'll pay, the minimum-payment trap, and avalanche vs snowball.` (151) |
| H1 | ` (10) |
| H1 | `Credit Card APR Calculator: Payoff Time, Interest and Minimum Payments` |
| BLUF | "Credit card interest each month ≈ balance × APR ÷ 12. At 22% APR, $200 a month pays off $5,000 in 34 months with about $1,750 of interest; minimum payments alone take about 19 years." (engine) |
| ToolShell pills | `Minimum-payment simulator`, `Avalanche vs snowball`, `Balance transfer check`, `No card ads` |
| Links out | Compound Interest (APR/APY), HELOC (Part 3), Net Worth (Part 3), Percentage Change |
| Links in | Net Worth, HELOC, Compound Interest, Tools hub "Money" |

## 5. Content (~1,900–2,200 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the credit card APR calculator | 5 tabs | 120 |
| 2 | What is APR? | Short definition (APR vs interest rate vs APY) (`what is apr`) | 180 |
| 3 | How credit card interest is calculated | Daily periodic rate, average daily balance (general), our method (`how does apr work on a credit card`) | 220 |
| 4 | How long to pay off a credit card | Engine examples (`how long to pay off credit card`) | 200 |
| 5 | Estimating your minimum payment, and why it takes so long | Engine example (`estimate minimum payment credit card`) | 220 |
| 6 | Paying off several cards: avalanche vs snowball | Engine example | 200 |
| 7 | Balance transfers: when the fee is worth it | Engine example | 180 |
| 8 | Ways to pay less interest | Practical, non-advisory | 130 |
| 9 | FAQ | §6 | 420 |
| — | Sources & assumptions + disclaimer + Last reviewed | | 80 |

## 6. FAQ (11)

1. What is APR on a credit card? (`what is apr`)
2. How is credit card interest calculated?
3. How long will it take to pay off my credit card?
4. How do I estimate my minimum payment? (`estimate minimum payment credit card`)
5. Why do minimum payments take so long?
6. How much do I need to pay each month to be debt-free in 2 years?
7. Avalanche or snowball: which saves more?
8. Is a balance transfer worth the fee?
9. What is a daily periodic rate?
10. Does the grace period save interest? (general)
11. APR vs APY: what's the difference?

## 7. Done when

- [x] `card-payoff-engine.ts` + tests; `npm run verify` passes. *(Evidence: src/lib/card-payoff-engine.ts, 8 unit tests in card-payoff-engine.test.ts passing; full npm run verify passed 851 tests across 67 suites, 96 routes, 82 HTML files)*
- [x] Input guide diagram per tab above the inputs; ToolShell + TabSlider used. *(Evidence: CardPayoffInputGuide.tsx with visual card/balance amortization/avalanche diagrams; ToolShell with 4 pills; TabSlider with 5 tabs)*
- [x] No affiliate links or card ads in the tool area; any APR average cited with a date (or omitted). *(Evidence: Zero credit card affiliate links, zero ads in calculator; Federal Reserve G.19 reference cited)*
- [x] Sources & assumptions + Last reviewed; registrations + docs updated; `graphify update .`. *(Evidence: YMYL box with CFPB & Fed G.19 citations, Last reviewed Nov 2026; registered in routes.ts, tools-catalog.ts #61, Footer.tsx, calculation-methods.ts)*
