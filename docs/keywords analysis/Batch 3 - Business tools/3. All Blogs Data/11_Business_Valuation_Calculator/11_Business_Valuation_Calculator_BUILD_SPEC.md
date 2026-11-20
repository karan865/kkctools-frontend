# Business Valuation Calculator (SDE / EBITDA) — Build Spec

> **URL:** `/business-valuation-calculator/` · Batch 3 Part 2 · Tier 2 · **Build order 10**
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + Part 2; §10.1 no uncited multiples)
> **Inputs used:** `11_Business_Valuation_Calculator_Competitor_Analysis.md` (6 pages), `KKCTools_Batch3_Final_Tool_Keywords.md` §2 #11
> **Written:** 2026-11-20

---

## 0. Strategy note

**SERP: a "guide gap".** All 10 results for `small business valuation` are articles, and **no calculator** ranks:
- Reddit, M&T Bank 64, The Hartford 64;
- CRI 40, OK SBDC 26, Morgan & Westfield 34, Williams Keepers 23, gvalue 20, business.gov.au 69.

**Build it as a guide first, calculator second.** Think 2,200+ words of real explanation, with the SDE add-back builder as the tool searchers need. This matches the owner's KD 45 win (a strong guide where no relevant page existed).

**Volume:** the **SDE cluster alone is ~21,000 searches** (`what is sde` 5,400, `sde meaning` 4,400, …).

**Never print industry multiples we can't cite** (keyword file note).
- The user enters a multiple range.
- The page explains where to find comparable sales (broker reports, deal databases, an adviser) without naming numbers.
- `TODO(owner)`: only if the owner later gets a dated, citable dataset (e.g. a BizBuySell Insight report, with its date) can a range be shown, and then with the citation.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | small business valuation | 1,600 | 26 | H1 or first sentence, title, H2 |
| Secondary (SDE cluster) | what is sde · sde meaning · meaning sde · s d e meaning · s.d.e meaning · what is sde in business · define sde · what does sde mean | 5,400 · 4,400 · 1,900 · 2,900 · 1,300 · 1,000 · 720 · 590 | 20–28 | H2 "What is SDE (seller's discretionary earnings)?" near the top + SDE builder + FAQ |
| Secondary | cash flow sde · cash flow sde meaning · what does cash flow sde mean | 590 · 590 · 170 | 12–24 | same H2 (listing sites call SDE "cash flow") |
| Secondary | seller's discretionary earnings | 1,000 | 27 | same H2 |
| Secondary | sde vs ebitda | 480 | 18 | H2 "SDE vs EBITDA" |
| Secondary | sde multiple · valuation using multiples | 170 · 210 | 8–13 | H2 "Choosing a multiple" |
| Secondary | how much can i sell my business for · how to value a business to sell · what is my company worth · how to determine the value of a small business · how to calculate the value of a business for sale · value a business · valuing a business for sale · how to valuate a small business · how to calculate a value of a company | 1,000 · 390 · 720 · 720 · 210 · 480 · 210 · 720 · 390 | 0–28 | H2s + FAQ |
| Secondary | hvac business valuation (calculator) · how to value a heating and air conditioning business | 390 · 320 · 2,900 | 9–25 | H2 "Valuing a trade business (HVAC example)" + an example preset (inputs only, user's multiple) |
| Secondary | free business valuation · ecommerce business valuation · saas valuation calculator | 170 · 170 · 210 | 3–13 | intro + FAQ (SaaS: revenue-multiple note, no numbers) |
| FAQ | p/ebitda · ev/ebit · ev ebit | 5,400 · 720 · 480 | 16–27 | FAQ: short definitions |
| FAQ only | business valuation cost · business valuation services cost | 260 · 170 | 9–14 | service-price intent: "when to hire a professional" FAQ, no prices |

## 2. Our edge

- **Transparent method:** every step is shown with the user's numbers: earnings bridge → multiple → enterprise value → equity. No hidden logic. Acquiry has a bridge but hides the multiple.
- **SDE and adjusted EBITDA** (SDE − market-rate manager salary), with the rule of thumb in words: owner-run → SDE; managed → EBITDA.
- **Add-back checklist** with "buyers usually accept / often question" notes.
- **Guided multiple builder:** the user enters a base range from their own comps, then sees how factors (growth, recurring revenue, customer concentration, owner dependence, years trading, records quality) *tend* to push it. This is qualitative, labelled "your judgement", with no invented adjustments.
- **EV → equity:** minus debt, plus cash, ± working capital vs target. Only sum.money does this.
- **Sensitivity grid:** multiple ±0.5× × earnings ±10%.
- **Asset-based floor check:** equipment + inventory + other assets − liabilities.
- **Simple deal view:** cash at close vs seller note vs earn-out (illustrative).
- Currency. No lead gate. No "AI valuation" tricks.

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **SDE (owner-run business)** (default)
2. **EBITDA (managed business)**
3. **Asset check**
4. **Deal structure** (optional)

### 3.2 Input guide diagram (above the inputs, rules §9)

`ValuationInputGuide.tsx`: a "bridge" of stacked blocks rising left to right.

```
[1 Net profit] + [2 Owner's salary & benefits] + [3 Personal expenses run through the business] + [4 One-off costs] + [5 Depreciation & amortization] + [6 Interest] = SDE
SDE × [7 Multiple (low–high)] = Business value range  → − [8 Debt] + [9 Cash] = What the owner may receive
```

- **EBITDA tab:** a block "− 10 Manager salary to replace you" turns SDE into adjusted EBITDA.
- **Asset tab:** a balance-scale drawing (assets vs liabilities).

Live values; the focused field highlights. A footnote in the diagram: "The multiple is your input: see 'Choosing a multiple' below".

### 3.3 Inputs (defaults = examples)

| # | Field | Default |
|---:|---|---|
| 1 | Net profit (pre-tax, from the P&L) | $120,000 |
| 2 | Owner salary + owner benefits (one owner) | $80,000 + $10,000 |
| 3 | Personal / discretionary expenses through the business | $5,000 |
| 4 | One-off / non-recurring costs | $8,000 |
| 5 | Depreciation & amortization | $12,000 |
| 6 | Interest expense | $6,000 |
| — | Optional: revenue (for margin %), income tax (EBITDA tab) | — |
| 7 | Multiple range: low / high (user's own comps; labelled "example only, use multiples from comparable sales") | 2.0× / 3.0× |
| 8–9 | Debt to be repaid at sale; cash kept by the seller | $50,000; $30,000 |
| — | Working capital: actual vs target (optional) | — |
| 10 | Replacement manager salary (EBITDA tab) | $75,000 |
| Asset tab | equipment, inventory, receivables, other assets, liabilities | — |
| Deal tab | cash at close %, seller note % + rate + years, earn-out % | — |

### 3.4 Engine (`src/lib/business-valuation-engine.ts`)

```ts
sde = netProfit + ownerPay + ownerBenefits + personal + oneOff + da + interest
ebitda = netProfit + interest + tax + da                      // reported EBITDA (tab 2)
adjustedEbitda = sde - managerSalary
evLow = earnings * multLow ; evHigh = earnings * multHigh ; evMid = average
equity = ev - debt + cash ± (workingCapital - wcTarget)
sensitivity(earnings, multiple, multSteps=[-0.5,-0.25,0,0.25,0.5], earnSteps=[-10,-5,0,5,10])
assetValue = Σ assets - liabilities ; floorCheck = equityMid vs assetValue
deal: cashAtClose, sellerNote payment via loan-engine.payment, earnOut (illustrative, undiscounted)
```

Negative earnings → the UI says "an earnings multiple doesn't apply; see the asset approach".

**Worked example (defaults):**

| Item | Value |
|---|---|
| SDE | $241,000 |
| Value range at 2.0–3.0× | $482,000–$723,000 (mid $602,500) |
| Owner may receive (mid, after $50k debt and $30k cash) | ≈ $582,500 |
| Adjusted EBITDA | $166,000 |

### 3.5 Outputs

- **Headline:** value range (low–high) + SDE.
- **Sentence:** "With $241,000 of seller's discretionary earnings and a 2.0× to 3.0× multiple, the business is worth about $482,000 to $723,000 before debt and cash."
- Earnings bridge table (each add-back line + its accept/question note).
- EV → equity table.
- Sensitivity grid.
- Asset floor card.
- Deal view.
- **Disclaimer:** "Estimate for planning; not a formal valuation or appraisal; buyers, lenders and the IRS may require a certified valuation."
- Share URL, Copy, Print (seller-friendly summary).

### 3.6 Tests

- SDE / EBITDA / adjusted EBITDA arithmetic.
- EV range; equity with WC ±.
- Sensitivity centre = base.
- Negative earnings path.
- Asset floor.
- Seller note payment via `loan-engine`. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Business Valuation Calculator – SDE & EBITDA` (44; 56 with the suffix: OK) |
| Meta | `Free small business valuation calculator. Work out seller's discretionary earnings (SDE) or EBITDA, apply a multiple range and get a value range.` (145) |
| H1 | `Business Valuation Calculator: SDE, EBITDA and Multiples` |
| First sentence | must contain "small business valuation", e.g. "Most small business valuation starts with one number, seller's discretionary earnings (SDE), multiplied by a range buyers will pay." |
| BLUF | "Business value ≈ SDE × multiple. Add the owner's salary, personal expenses, one-off costs, depreciation and interest back to net profit to get SDE. $241,000 of SDE at 2–3× is $482,000–$723,000." (engine) |
| ToolShell pills | `SDE add-back builder`, `EBITDA & equity value`, `Sensitivity grid`, `Print & share link` |
| Links out | Profit Margin, Contribution Margin, SBA Loan (when built; buyer financing), Percentage Change |
| Links in | Profit Margin, Contribution Margin, SBA, Tools hub |

## 5. Content (~2,300–2,600 words: guide-heavy, by design)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | Small business valuation in one minute | Formula + engine example (primary) | 150 |
| 2 | What is SDE (seller's discretionary earnings)? | Definition, "cash flow" on listings (`what is sde`, `sde meaning`, `cash flow sde`) | 250 |
| 3 | How to use the business valuation calculator | 4 tabs | 120 |
| 4 | Add-backs: what buyers accept and question | Checklist table | 250 |
| 5 | SDE vs EBITDA (and adjusted EBITDA) | When each is used (`sde vs ebitda`) | 200 |
| 6 | Choosing a multiple | Drivers; how to find comps; **no numbers** (`sde multiple`, `valuation using multiples`) | 250 |
| 7 | Enterprise value vs what you take home | Debt, cash, working capital (engine) | 180 |
| 8 | How much can I sell my business for? | Step-by-step using the tool (`how much can i sell my business for`, `how to value a business to sell`) | 180 |
| 9 | Valuing a trade business (HVAC example) | Worked example with the user's multiple; owner dependence and recurring maintenance contracts as factors (`hvac business valuation`) | 180 |
| 10 | Other approaches: assets, market comps, DCF | Short | 150 |
| 11 | Calculator vs professional valuation | When you need a certified appraiser (`business valuation cost`) | 120 |
| 12 | FAQ | §6 | 450 |
| — | Disclaimer | | 30 |

## 6. FAQ (12)

1. What is SDE? / What does SDE mean? (`sde meaning`)
2. How do I calculate SDE?
3. What's the difference between SDE and EBITDA? (`sde vs ebitda`)
4. How do you value a small business? (`how to determine the value of a small business`)
5. How much can I sell my business for?
6. What multiple do small businesses sell for? (depends on comparable sales; how to find them; no invented ranges)
7. What increases a business's multiple?
8. What add-backs do buyers accept?
9. What is my company worth if it isn't profitable? (asset approach)
10. Enterprise value vs equity value: what do I actually receive?
11. What do P/EBITDA and EV/EBIT mean? (`p/ebitda`, `ev/ebit`: short)
12. Do I need a professional valuation? (`business valuation cost`)

## 7. Done when

- [ ] `business-valuation-engine.ts` + tests; `npm run verify` passes.
- [ ] Input guide diagram (bridge) above the inputs; ToolShell + TabSlider used.
- [ ] **Zero industry multiples** printed unless a dated, linked source exists (`TODO(owner)` otherwise).
- [ ] Guide sections fully written (this page ranks on depth); registrations + docs updated; `graphify update .`.
