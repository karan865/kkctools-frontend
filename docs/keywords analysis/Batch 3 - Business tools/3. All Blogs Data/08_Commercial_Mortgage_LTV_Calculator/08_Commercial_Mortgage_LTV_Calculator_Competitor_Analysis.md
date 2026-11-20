# Commercial Mortgage & LTV Calculator — Competitor Analysis

> **Target page:** KKCTools `/commercial-mortgage-calculator/` (Batch 3, Tier 1 #8)
> **Primary keyword:** `commercial mortgage calculator` — US 8,100 · KD 6 · CPC $2.15 (cluster 16 keywords, 47,510 US vol, 36,210 on KD ≤ 15) · YMYL: **medium**
> **SERP source:** ⚠ No Semrush SERP export for Batch 3. Competitors from live web search (2026-11-14). `TODO(owner): pull Google top 10 in Semrush.`
> **Pages visited:** 2026-11-14 — 4 read in full. Failed: Calculator.net commercial-loan URL (404), Omni commercial-mortgage URL (404), New Silver (301 → construction-loan page, different tool). Search also returned many duplicate `*.pages.dev` clones and **4 Janover sister domains** (hud.loans, multifamily.loans, commercialrealestate.loans, j2-lp.pages.dev) with the same calculator.

---

## 0. How this was collected (read first)

- Pages read: PropertyMetrics (max-loan sizing), Janover commercialrealestate.loans (payment + balloon + rates), CommLoan (full payment model), Tyler Cauble (payment + balloon + DSCR).
- Meta and schema not readable. Word counts are estimates. Do not copy text, tables or rate data (AGENTS.md rule 8).
- **YMYL medium:** rates, LTV caps and DSCR minimums vary by lender and change — show as editable inputs, never as offers; cite any market rate source with a date (e.g., US Treasury, SOFR from NY Fed).

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | commercialrealestate.loans/commercial-mortgage-calculator (Janover — also on hud.loans, multifamily.loans) | Lender marketplace | Commercial Mortgage Calculator with Latest Interest Rates | ~2,300 |
| 2 | commloan.com/commercial-mortgages/calculator | CRE loan marketplace | Commercial Mortgage Calculator | ~1,000 |
| 3 | propertymetrics.com/commercial-mortgage-calculator/ | CRE SaaS | Commercial Mortgage Calculator (max supportable loan) | ~800 |
| 4 | tylercauble.com/blog/commercial-mortgage-calculator | CRE broker | Commercial Loan Calculator: Payment, Balloon, and Amortization | 900–1,000 |

**What this tells us:**
- **Two jobs:** (a) **payment & balloon** for a given loan (Janover, CommLoan, Cauble) and (b) **how much can I borrow** — max loan by LTV, DSCR and debt yield (PropertyMetrics). **Nobody does both.**
- **Term ≠ amortization** (e.g., 10-year term on 25-year amortization → balloon) is the core concept that makes commercial different from residential — explained well only by Cauble.
- **Lead-gen lenders dominate** with clone pages across domains; content quality is mediocre, with factual errors (CommLoan DSCR, PropertyMetrics debt yield).

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Janover | CommLoan | PropertyMetrics | Cauble |
|---|---|---|---|---|
| Loan amount input | ✅ | ✅ (or price + LTV) | ❌ (solves it) | ✅ |
| Purchase price + LTV / down payment | ❌ | ✅ | ⚠️ value from NOI ÷ cap | ❌ |
| Interest rate | ✅ | ✅ | ✅ | ✅ |
| Term vs amortization (separate) | ✅ | ✅ maturity + amortization | ⚠️ amortization only | ✅ |
| Interest-only period | ⚠️ term defined | ✅ 1–10 years | ❌ | ✅ (amortization = 0) |
| Monthly P&I | ✅ | ✅ | ⚠️ (used internally) | ✅ |
| Balloon at maturity | ✅ | ✅ payoff at maturity | ❌ | ✅ |
| Interest paid / principal paid in term | ⚠️ schedule | ✅ equity at payoff | ❌ | ✅ |
| Amortization schedule | ✅ link | ✅ graph + table + download | ❌ | ⚠️ chart |
| DSCR from NOI | ❌ | ✅ | ✅ requirement input | ✅ |
| Max loan by LTV / DSCR / debt yield | ❌ | ❌ | ✅ (lowest wins) | ❌ |
| Debt yield | ❌ | ⚠️ definition | ✅ (definition wrong) | ❌ |
| Fees, points, prepayment penalty | ❌ | ❌ | ❌ | ❌ |
| Rate type (fixed vs index + spread) | ❌ (rates table only) | ❌ | ❌ | ❌ |
| Currency / non-US | ❌ | ❌ | ❌ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Janover | CommLoan | PropertyMetrics | Cauble |
|---|---|---|---|---|
| Glossary (LTV, DSCR, balloon, amortization, I/O) | ✅ large | ✅ (errors) | ✅ LTV, DSCR, debt yield | ⚠️ |
| Worked example with numbers | ❌ | ❌ (outputs only) | ✅ small ones | ✅ full ($1.5M, 7%, 25/10) |
| Payment formula shown | ❌ | ❌ | ❌ | ❌ |
| Current index rates | ✅ UST, SOFR, Prime (dated, unsourced) | ⚠️ “show rates” link | ❌ | ❌ |
| Loan types table (SBA, HUD, CMBS, bridge…) | ✅ 16 rows (duplicate) | ❌ | ❌ | ❌ |
| What to watch (prepayment, recourse) | ⚠️ risk FAQ | ❌ | ❌ | ✅ list |
| FAQ count | 4 | 0 | 0 | 5 |
| Named author | ❌ | ❌ | ❌ | ✅ |
| Date | ⚠️ rates date | ❌ | ❌ | ✅ Sep 2026 |
| Sources | ❌ | ❌ | ❌ | ❌ |

---

## 4. Competitor-by-competitor detail

### Janover — commercialrealestate.loans (lender marketplace, cloned on several domains)

- Inputs: loan amount, rate, term, amortization → monthly payment, balloon, amortization schedule link. Says P&I only (no fees).
- Content: terminology (loan amount, rate, amortization, term, balloon, I/O, P&I, schedule), **current rates table** (5/7/10-yr Treasury, SOFR, 30-day SOFR, WSJ Prime — dated, unsourced), how to use, glossary (collateral, DSCR, LTV, maturity, prime, refinance), **16 loan types** (term ranges).
- **FAQs (4):** average CRE loan rate · what is an amortization schedule · eligibility requirements · levels of risk.
- **Weak points:** no worked example; unsourced “median rate ≈ fed funds + 3%”; duplicate USDA row; typos; heavy CTAs.

### CommLoan — commercial-mortgages/calculator (marketplace) — **best payment model**

- Inputs: purchase price, loan amount + LTV, rate, **interest-only toggle + I/O period**, maturity (3–35 yrs), amortization (10–35 yrs), first-year NOI. Outputs: down payment, I/O payment, P&I payment, annual payments, equity at payoff, payoff at maturity, **DSCR**; amortization graph + schedule + download.
- Glossary includes DSCR, LTV, debt yield, basis point.
- **Errors:** says DSCR **above 1** means debt is too much (backwards); defines “cap rate” as a rate cap; typos; no author/date/FAQ.

### PropertyMetrics — commercial-mortgage (CRE SaaS) — **max loan model**

- Inputs: underwritten NOI, cap rate, max LTV, debt yield, interest rate, DSCR requirement, amortization (years/months). Outputs: value @ cap rate, allowable debt service, max loan by **LTV / DSCR / debt yield**, final **maximum supportable loan** (lowest of three).
- **Error:** defines debt yield as *debt service ÷ loan* — standard definition is **NOI ÷ loan amount**.
- No FAQ, no author/date; Proforma software promotion.

### Tyler Cauble — commercial-mortgage blog (broker)

- Inputs: loan amount, rate, amortization (0 = I/O), term until balloon, NOI (optional). Outputs: monthly payment, annual debt service, **balloon**, interest paid in term, principal paid, DSCR, balance chart.
- Worked example: $1.5M at 7%, 25-yr amortization, 10-yr term → ≈ $10,602/month (checked correct), ≈ $127,220/yr, balloon ≈ $1,179,501, DSCR at $150k NOI ≈ 1.18×.
- **FAQs (5):** how is the payment calculated · amortization vs term · down payment required · what is a balloon · commercial mortgage vs commercial loan calculator.
- **Weak points:** formula not shown; DSCR minimum vague; broken newsletter block; course CTAs.

---

## 5. Patterns

- **Maths:** payment = L × r(1+r)^n ÷ ((1+r)^n − 1) with n = amortization months · balloon = remaining balance after term months · I/O payment = L × annual rate ÷ 12 · LTV = loan ÷ value · DSCR = NOI ÷ annual debt service · debt yield = NOI ÷ loan · max loan by DSCR = PV(rate, amortization, NOI ÷ DSCR min ÷ 12) · value = NOI ÷ cap rate.
- **Sizing rule:** max loan = lowest of LTV-based, DSCR-based, debt-yield-based amounts.
- **Typical lender ranges** (LTV 65–80%, DSCR 1.20–1.25×, debt yield ~8–10%) appear on pages **without sources** → present as editable “example” defaults labelled “check with your lender”.

| Section | Pages (of 4) |
|---|:---:|
| Payment + balloon | 3 |
| I/O period | 2 |
| DSCR | 3 |
| Max loan sizing | 1 |
| Amortization schedule | 2 |
| Worked example | 1 |
| Formula shown | **0** |
| FAQ | 2 |

---

## 6. FAQ question bank

★ = asked/defined on 2+ pages.

| # | Question | Seen on |
|---:|---|---|
| 1 | ★ What is the difference between amortization and term? | Cauble, Janover glossary |
| 2 | ★ What is a balloon payment? | Cauble, Janover |
| 3 | ★ What is DSCR and what do lenders require? | CommLoan, PropertyMetrics, Janover |
| 4 | ★ What is LTV / how much down payment for a commercial loan? | Cauble, PropertyMetrics, CommLoan |
| 5 | How is a commercial loan payment calculated? | Cauble |
| 6 | What is the average commercial mortgage interest rate? | Janover |
| 7 | What is an amortization schedule? | Janover |
| 8 | What is debt yield? | PropertyMetrics, CommLoan |
| 9 | How much can I borrow for a commercial property? | PropertyMetrics (tool) |
| 10 | What is an interest-only period? | CommLoan, Janover |
| 11 | What are prepayment penalties / defeasance / yield maintenance? | Cauble (list) |
| 12 | Commercial vs residential mortgage — what's different? | Cauble |

---

## 7. Gaps nobody fills — our opportunities

1. **Both jobs in one tool:** *Payment & balloon* tab + *How much can I borrow?* tab (LTV / DSCR / debt yield, lowest wins).
2. **Show the formula** with the user's numbers (0 competitors show it).
3. **Term ≠ amortization visual:** balance chart with balloon marked; I/O period shaded.
4. **Correct definitions** (CommLoan DSCR, PropertyMetrics debt yield are wrong).
5. **Fees and points:** origination %, closing costs, simple APR-style “effective cost”.
6. **Refinance at maturity scenario:** balloon → new loan at new rate.
7. **Rate input as fixed or index + spread** (e.g., SOFR + 2.5%) with user-entered index (no live data — no network).
8. **Currency + non-US wording** (UK “commercial mortgage” is common).
9. **Downloadable/printable schedule** without sign-up.
10. **Trust:** date, method, YMYL disclaimer; no live rate claims.

---

## 8. Blueprint for the KKCTools Commercial Mortgage Calculator

### 8.1 SEO

- **URL:** `/commercial-mortgage-calculator/`
- **Title/H1/Meta:** use Batch 3 keyword file drafts (“Commercial Mortgage & LTV”).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Tab 1 — Payment | price + down % or loan amount; rate (fixed or index + spread); term; amortization; I/O months; fees % → monthly/annual payment, balloon, interest & principal in term, LTV, DSCR (if NOI) |
| Tab 2 — Max loan | NOI, value (or cap rate), max LTV, min DSCR, min debt yield, rate, amortization → three limits + final max loan; required equity |
| Schedule | monthly/annual table + SVG balance chart; print/CSV copy |
| Refi | balloon refinance at new rate/term |
| UX | currency, share URL, no network |

### 8.3 Content outline (≈ 1,800–2,200 words, original)

1. Intro (primary keyword)
2. How to use (2 tabs)
3. How a commercial mortgage payment is calculated (formula + engine example)
4. Term vs amortization and balloon payments
5. Interest-only periods
6. LTV, DSCR and debt yield — how lenders size a loan (example)
7. Fees, prepayment penalties and refinancing risk
8. Commercial vs residential mortgages
9. FAQ (10)
10. Related tools — Cap Rate (#6), Rental Property (#7), SBA Loan (#12), Equipment Loan (#13), Compound Interest (#21)
11. Disclaimer (YMYL): estimate only; terms vary by lender; not a loan offer

### 8.4 Quality checks

- Unit tests for payment, balloon, I/O, max-loan sizing, DSCR, schedule totals.
- No live rates; any quoted index rate must be dated and sourced.
- No competitor wording copied. `npm run check:no-network` passes.
- `TODO(owner): pull Google top-10 SERP; find current Omni and Calculator.net commercial loan URLs.`
