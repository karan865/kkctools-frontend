# HELOC & Home Equity Calculator — Competitor Analysis

> **Target page:** KKCTools `/heloc-calculator/` (Batch 3, Tier 3 #23)
> **Primary keyword:** `heloc calculator` — US 40,500 · KD 10 · **CPC $4.41** · ad comp 0.69 (cluster 5 keywords, 58,280 US vol) · YMYL: **high**
> **SERP source:** ⚠ No Semrush SERP export. Competitors from live web search (2026-11-14). `TODO(owner): pull Google top 10 — expect Bankrate, NerdWallet, banks (Citi, Regions, US Bank), Omni.`
> **Pages visited:** 2026-11-14 — 5 read (The Mortgage Reports, The Truth About Mortgage, Regions Bank, Point, Omni). Bankrate returned 405; Citi and SoFi not fetched (bank lead pages).
> **YMYL rule:** home-secured borrowing. Explain risk (variable rate, payment shock, home as collateral), no rate claims without dated source, no lender promotion, CLTV limits shown as editable examples.

---

## 0. How this was collected (read first)

- Read: The Mortgage Reports (Full Beaker lead-gen), The Truth About Mortgage (mortgage blog), Regions Bank, Point (home-equity-investment company), Omni.
- **Big volume (40,500) + KD 10 is surprising** — the keyword file put it in Tier 3 because of high YMYL and bank/publisher dominance. Verify SERP before building.
- Meta and schema not readable. Word counts are estimates. Do not copy text (AGENTS.md rule 8).

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | themortgagereports.com/heloc-payment-calculator | Mortgage lead-gen | Estimate Your Home Equity Line of Credit Payments | ~550 |
| 2 | thetruthaboutmortgage.com/heloc-calculator/ | Mortgage blog | HELOC Calculator | 1,000–1,200 |
| 3 | regions.com/…/how-to-calculate-home-equity-line-of-credit | Bank | HELOC payment calculator: How to calculate home equity line of credit payments | 1,100–1,300 |
| 4 | point.com/tools/heloc-interest-only-calculator | HEI company | HELOC interest-only calculator | 1,000–1,200 |
| 5 | omnicalculator.com/finance/heloc | Giant | HELOC Calculator | 1,800–2,000 |
| — | bankrate.com/home-equity/heloc-calculator/ | Publisher | (405) | — |

**What this tells us:**
- **Three questions:** (a) **How much can I borrow?** (home value × max CLTV − mortgage), (b) **What's my payment in the draw period?** (interest-only), (c) **What happens at repayment?** (payment shock). Omni covers (a)+(b)+(c)+fees+rate changes; others cover one or two.
- **Regions is the only page with the 1/360 + interest draw method** (real bank products differ).
- **No one shows a worked numeric example of payment shock** (e.g., $50k at 8%: $333/mo → ~$418/mo over 20 yrs).

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | MortgageReports | TruthAboutMortgage | Regions | Point | Omni |
|---|---|---|---|---|---|
| Max credit line from home value, mortgage, CLTV | ⚠️ (85% rule text) | ❌ | ❌ | ❌ | ✅ formula (80%) |
| Balance / draw amount | ✅ | ✅ | ✅ | ✅ | ✅ |
| Rate | ⚠️ unclear | ✅ | ✅ | ✅ | ✅ |
| Draw period length | ❌ | ✅ remaining | ✅ | ❌ fixed 10 | ✅ |
| Repayment period length | ❌ | ✅ | ✅ | ❌ fixed 20 | ✅ |
| Draw-period payment: interest-only | ✅ | ✅ | ✅ | ✅ | ✅ |
| Draw-period payment: 1/360 + interest / % of balance | ❌ | ❌ | ✅ | ❌ | ❌ |
| Minimum payment | ❌ | ❌ | ✅ | ❌ | ❌ |
| Repayment payment (P&I) | ❌ | ✅ | ✅ | ✅ | ✅ |
| Payment shock ($ and %) | ❌ | ✅ increase | ⚠️ first/last | ⚠️ | ⚠️ table |
| Total interest | ❌ | ✅ | ⚠️ table | ❌ | ✅ |
| Extra principal in draw period | ❌ | ❌ | ❌ | ❌ | ❌ |
| Rate changes (variable, cap) | ❌ | ❌ | ❌ | ❌ | ✅ manual/trend + cap |
| Fees (up-front, annual) | ❌ | ❌ | ❌ | ❌ | ✅ |
| Draws over time (not one lump) | ❌ | ❌ | ❌ | ❌ | ❌ |
| HELOC vs home equity loan vs cash-out refi | ❌ | ❌ | ❌ | ❌ | ❌ |
| Schedule / chart | ❌ | ✅ phase breakdown | ✅ chart, table, amortization | ❌ | ✅ |
| Lead capture (address etc.) | ⚠️ | ❌ | ❌ | ✅ address field | ❌ |

---

## 3. Feature matrix — content and trust

| Item | MortgageReports | TruthAboutMortgage | Regions | Point | Omni |
|---|---|---|---|---|---|
| How a HELOC works (draw vs repayment) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Formula shown | ❌ | ❌ | ⚠️ words | ❌ | ✅ |
| Worked example | ❌ | ❌ | ❌ | ⚠️ schema only ($50k @4% = $167) | ✅ ($500k home → $350k line; CLTV 30%) |
| Fixed vs variable rates | ✅ FAQ | ✅ | ✅ disclosure | ⚠️ | ⚠️ |
| Tax deductibility | ❌ | ❌ | ❌ | ❌ | ⚠️ “Yes” (oversimplified) |
| Alternatives (HEL, refi, HEI) | ⚠️ | ⚠️ | ❌ | ✅ (pushes HEI) | ❌ |
| FAQ count | 6 | 9 | 8 | 0 visible | 5 |
| Named author | ❌ | ✅ ex-lender | ❌ | ⚠️ team | ✅ + PhD reviewer |
| Date | ❌ | ❌ | ✅ Oct 2026 | ⚠️ 2024 / 2026 conflict | ❌ |
| Sources | ❌ | ❌ | ⚠️ disclosures | ❌ | ⚠️ 1 (2020) |

---

## 4. Competitor-by-competitor detail

### The Mortgage Reports — HELOC payment calculator
- Inputs described inconsistently (property value, mortgage, draw vs credit line, rate, draw). Output: draw-period payment only. “Up to 85% of home value minus mortgage”.
- **FAQs (6):** how to calculate payment · fixed or variable · how much can I borrow · need home paid off? · what happens when draw ends · HELOC vs home equity loan payment.
- **Weak points:** no formula/example; no repayment estimate; lead-gen heavy; typo.

### The Truth About Mortgage — HELOC calculator
- Balance, APR, draw period remaining, repayment period → draw payment (IO), repayment payment (P&I), **payment increase**, total interest, phase breakdown.
- **FAQs (9):** what is a HELOC · draw vs repayment · how interest is calculated · HELOC rates · can rate change · shop for cheap HELOC · refinance · where to get · minimum draw.
- **Weak points:** fixed rate only; daily-accrual mentioned but monthly model; no fees.

### Regions Bank — HELOC payment calculator
- Balance, rate, draw period, **payment method (interest-only or 1/360 + interest)**, repayment period, **minimum payment** → first and last draw payment, repayment payment, chart/table/amortization.
- **FAQs (8):** what is a HELOC · how to use · is this what I'll qualify for · how it works · how interest is calculated · how minimum payment is calculated · draw-period payment · payment on a $100,000 HELOC (no number given).

### Point — HELOC interest-only calculator (HEI company)
- Draw amount, rate, **home address** (lead capture) → IO payment, repayment payment; fixed 10/20-year terms; fees excluded. Heavy promotion of its Home Equity Investment product; error text visible.

### Omni — HELOC calculator — **feature benchmark**
- Balance, draw period, repayment term, rate, **up-front fee % / $, annual fee**, **rate adjustments (manual/trend, timing, cap)** → yearly table (balance, principal, interest), chart, schedule.
- Content: what is a HELOC, draw/repayment, **loan amount formula** ((value × 80%) − mortgage), **CLTV**, payment formulas.
- **FAQs (5):** tax deductible · how to get · interest calculation · vs mortgage · rate calculation.
- **Errors:** says CLTV must be “above” 80% (should be below); tax answer oversimplified; rates FAQ confuses rate with interest; one 2020 source.

---

## 5. Patterns

- **Maths:** max line = home value × max CLTV − mortgage balance(s) · CLTV = (mortgage + line) ÷ value · draw IO payment = balance × APR ÷ 12 · 1/360 method = balance ÷ 360 + interest · repayment P&I = amortise remaining balance over repayment months · payment shock = repayment payment − last draw payment · variable rate = index + margin (with caps).
- **Worked check:** $50,000 at 8%: IO $333.33/mo; 20-yr repayment ≈ $418.22/mo (+25%).

| Section | Pages (of 5) |
|---|:---:|
| Borrowing limit tool | 1 (formula) |
| Repayment payment | 4 |
| Payment shock shown | 1–2 |
| Variable rate scenarios | 1 |
| Fees | 1 |
| Extra principal | **0** |
| HELOC vs HEL vs refi | **0** |
| Worked numeric example | 1 |

---

## 6. FAQ question bank

★ = asked on 2+ pages.

| # | Question | Seen on |
|---:|---|---|
| 1 | ★ How do I calculate my HELOC payment? | MortgageReports, Regions, TruthAboutMortgage |
| 2 | ★ How is HELOC interest calculated? | Regions, TruthAboutMortgage, Omni |
| 3 | ★ Are HELOC rates fixed or variable / can they change? | MortgageReports, TruthAboutMortgage |
| 4 | ★ How much can I borrow with a HELOC? | MortgageReports, Omni (formula) |
| 5 | What happens when the draw period ends? | MortgageReports |
| 6 | HELOC vs home equity loan — payment difference? | MortgageReports |
| 7 | What is the monthly payment on a $50k / $100k HELOC? | Regions (no number) |
| 8 | How is the minimum payment calculated? | Regions |
| 9 | Is HELOC interest tax deductible? | Omni |
| 10 | Do I need my home paid off? | MortgageReports |
| 11 | Can I refinance a HELOC? | TruthAboutMortgage |
| 12 | What is CLTV? | — (Omni text) |

---

## 7. Gaps nobody fills — our opportunities

1. **Three-step tool:** borrowing limit (CLTV) → draw-period payment (IO or 1/360 or % method) → repayment payment and **payment shock**, with a worked example.
2. **Draws over time** (e.g., $20k now, $10k in year 3) instead of one lump.
3. **Extra principal during draw** → lower shock.
4. **Rate scenarios:** current rate, +1%, +2% (variable risk) with optional cap.
5. **Fees** (closing, annual) in total cost.
6. **Compare HELOC vs home equity loan vs cash-out refinance** on the same amount (simple, editable rates).
7. **Concrete answers** for “payment on a $50k/$100k HELOC” (engine-generated).
8. **Tax note done right** (US: interest deductible only when used to buy, build or substantially improve the home securing the loan — cite IRS Pub 936, year).
9. **No address capture, no lender ads** — trust advantage.

---

## 8. Blueprint for the KKCTools HELOC Calculator

### 8.1 SEO

- **URL:** `/heloc-calculator/`
- **Title/H1/Meta:** from Batch 3 keyword file (“HELOC & Home Equity”).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Limit | home value, mortgage balance(s), max CLTV (editable, e.g. 80/85/90) → max line, CLTV |
| Balance | lump sum or draw schedule |
| Draw period | years, payment method (interest-only, 1/360 + interest, % of balance), minimum payment, extra principal |
| Repayment | years (or balloon), rate |
| Rate | current APR, scenario +1/+2%, cap |
| Fees | closing $, annual $ |
| Outputs | max line, draw payment (first/last), repayment payment, shock $ and %, total interest, total cost, schedule + chart |
| Compare | vs home equity loan, vs cash-out refi (editable) |
| UX | share URL, print, no network |

### 8.3 Content outline (≈ 1,800–2,200 words, original)

1. Intro (primary keyword)
2. How to use
3. How much can you borrow? (CLTV, example)
4. Draw-period payments (interest-only vs 1/360) — example
5. Repayment period and payment shock — example
6. Variable rates and what a rate rise does
7. HELOC vs home equity loan vs cash-out refinance
8. Fees and total cost
9. Tax treatment (cited, brief)
10. Risks (home as collateral, freezes, balloon)
11. FAQ (10–12)
12. Related tools — Commercial Mortgage (#8), Credit Card Payoff (#24), Compound Interest (#21), Net Worth (#19)
13. YMYL disclaimer + sources + date

### 8.4 Quality checks

- Unit tests incl. $50k/8% example, 1/360 method, draw schedule, shock, scenarios.
- No rate claims without dated source; IRS link dated.
- No competitor wording copied. `npm run check:no-network` passes.
- `TODO(owner): pull Google top-10 SERP; check Bankrate (405) and Citi by hand.`
