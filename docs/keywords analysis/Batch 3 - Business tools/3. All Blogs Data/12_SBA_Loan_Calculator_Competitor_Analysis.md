# SBA Loan Calculator (7(a) & 504) — Competitor Analysis

> **Target page:** KKCTools `/sba-loan-calculator/` (Batch 3, Tier 2 #12)
> **Primary keyword:** `sba 504 loan` — US 4,400 · KD 5 · **CPC $7.65** (cluster 9 keywords, 15,860 US vol) · YMYL: **medium**
> **SERP source:** ⚠ No Semrush SERP export for Batch 3. Competitors from live web search (2026-11-14). `TODO(owner): pull Google top 10 for sba 504 loan (likely SBA.gov + lenders — informational) and sba loan calculator.`
> **Pages visited:** 2026-11-14 — 5 read (Fit Small Business 403, SoFi 403, Ramp 404).

---

## 0. How this was collected (read first)

- Read: NerdWallet SBA calculator, Janover sba7a.loans, Swoop Funding 504, Finder, Nav.
- **Primary keyword `sba 504 loan` is informational** (people learning the program). The page must explain 504 clearly *and* calculate. Expect SBA.gov to rank #1 — official rules must be cited from SBA.gov / 13 CFR, with date.
- **Rate caps, fee percentages and prime rate change** (Nav and Finder already show stale/mismatched prime rates). Keep every rate/fee as an editable input with “as of” date and SBA source; no hard-coded “current rates”.
- Meta and schema not readable. Word counts are estimates. Do not copy text or tables (AGENTS.md rule 8).

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | nerdwallet.com/business/loans/calculators/sba-loan | Finance publisher | SBA Loan Calculator: Estimate Payments on 7(a), 504 Loans | 2,300–2,600 |
| 2 | sba7a.loans/sba-7a-loan-calculator-amortization-schedule/ | Janover lender site | SBA Loan Calculator & Current Rates | 1,300–1,500 |
| 3 | swoopfunding.com/us/sba-loan-calculator/sba-504-loan-calculator | Funding broker | SBA 504 Loan Calculator | ~400 core |
| 4 | finder.com/business-loans/sba-loans/sba-loan-calculator | Finance publisher | SBA Loan Calculator for 2026 | 1,200–1,400 |
| 5 | nav.com/cares-act-sba-loan-calculator/ | Fintech | SBA loan calculator: Estimate your SBA loan payments | ~1,800 |

**What this tells us:**
- **No tool models a real 504 correctly:** a 504 is **two loans** (bank 50% first lien + CDC 40% second lien) + 10% equity, with different rates, terms and fees. Swoop comes closest (split + blended rate) but shows no method; NerdWallet treats 504 as a single loan preset.
- **Fees are the weak spot:** guarantee fees, CDC fees, packaging fees are either excluded (Finder), hidden (NerdWallet), or listed but not calculated (Nav).
- **Publishers (NerdWallet, Finder, Nav) have bylines and fact-checking** — YMYL trust bar is high.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | NerdWallet | sba7a.loans | Swoop 504 | Finder | Nav |
|---|---|---|---|---|---|
| Loan type presets (7(a), Express, 504, micro) | ✅ 3 | ⚠️ purpose selector | 504 only | ❌ | ✅ 4 |
| Amount, rate, term | ✅ | ✅ | ⚠️ project cost | ✅ | ✅ |
| Down payment / equity injection | ✅ % | ❌ | ✅ (output) | ❌ | ❌ |
| 504 split: bank / CDC / borrower | ❌ | ❌ | ✅ (no labels/method) | ❌ | ⚠️ text |
| Separate bank and CDC rates & terms | ❌ | ❌ | ⚠️ first-lender rate, CDC amortization | ❌ | ❌ |
| Blended rate | ❌ | ❌ | ✅ | ❌ | ❌ |
| Guarantee fee | ✅ (hidden %) | ❌ | ⚠️ “SBA fees” | ❌ excluded | ⚠️ optional |
| CDC / packaging / servicing fees | ❌ | ❌ | ⚠️ | ❌ (listed) | ⚠️ (listed) |
| Prime + spread rate input | ❌ | ❌ | ❌ | ❌ | ⚠️ FAQ |
| Max-rate cap check | ⚠️ table | ❌ | ❌ | ⚠️ list | ⚠️ table |
| Amortization schedule | ✅ CSV | ✅ link | ❌ | ❌ | ❌ |
| DSCR / affordability (can my business afford it?) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Business acquisition mode (price, seller note) | ❌ | ⚠️ separate calc | ❌ | ❌ | ❌ |
| Prepayment penalty | ❌ | ❌ | ❌ | ⚠️ text | ❌ |

---

## 3. Feature matrix — content and trust

| Item | NerdWallet | sba7a.loans | Swoop | Finder | Nav |
|---|---|---|---|---|---|
| 7(a) vs 504 explained | ✅ | ✅ | ⚠️ FAQ | ✅ | ✅ |
| Example scenarios | ✅ 3 | ❌ | ❌ | ❌ | ❌ |
| Rate caps table | ✅ fixed + variable | ❌ | ❌ | ✅ | ✅ |
| Guarantee fee schedule | ❌ | ❌ | ❌ | ⚠️ range | ✅ detailed |
| 504 fee breakdown | ❌ | ❌ | ❌ | ❌ | ✅ |
| Eligibility / qualify | ✅ | ✅ | ⚠️ | ⚠️ | ✅ |
| Calculator limitations | ✅ | ❌ | ❌ | ✅ | ⚠️ |
| FAQ count | 4 | 11 (headings) | 2 | 0 | 4 |
| Named author / editor | ✅ + CFP | ❌ | ✅ | ✅ fact-checked | ✅ 2 |
| Date | ✅ Jul 2026 (tables say Nov) | ✅ Oct 2026 | ⚠️ reviewed 2024 | ✅ Oct 2026 | ⚠️ Feb 2026 (widget Sep) |
| Sources | ✅ SBA lender report, size standards | ✅ sba.gov, 13 CFR | ✅ sba.gov | ⚠️ | ⚠️ |

---

## 4. Competitor-by-competitor detail

### NerdWallet — SBA loan calculator (publisher) — trust benchmark
- Inputs: loan type (7(a), Express, 504), amount, term, rate, down %. Outputs: monthly payment, total payments, total interest, guarantee fee, down payment, **amortization CSV**.
- Examples: 7(a) $750k/10 yr/11.75% → $9,802.70; Express $100k → $1,343.86; 504 $1.2M/25 yr/5% → $6,326.20 (totals consistent; fees hidden — implied financed balances differ from amount × 90%).
- Max rate tables for 7(a) fixed and variable (prime assumed 7%). 504 rates “typically 5–7%”.
- **FAQs (4):** how to use · types · who is eligible · is it right for me.
- **Weak points:** fee %s not disclosed; 504 as one loan; date mismatch (Jul page, Nov tables); “SBA charges prepayment penalties” imprecise; 20% down claim conflicts.

### sba7a.loans (Janover) — 7(a) calculator & current rates
- Amount, rate, term → monthly, totals, schedule. Purpose selector. Guarantee %: 85% ≤ $150k, 75% above; Express 50%; max $5M; 10% down for startups/change of ownership; personal guaranty ≥ 20% owners (13 CFR cited).
- 11 question headings (amortization, P vs I, what is 7(a), who qualifies, max amount, down payment, uses, how calculator works, commercial vs traditional loan, free quote, speed up approval).
- **Weak points:** outputs and “current rates” empty in capture; no fee table; heavy lead-gen.

### Swoop Funding — SBA 504 calculator (broker)
- Inputs: project cost, SBA 504 amortization, first-lender amortization, first-lender rate. Outputs: first lender $, SBA 504 $, equity injection $, total, **blended rate**, SBA fees, first-lender and total monthly/annual payments.
- **Weak points:** no CDC rate input; split % not shown; no method; no example; reviewed 2024. FAQs (2): max 504 amount · when 504 beats 7(a).

### Finder — SBA loan calculator (publisher)
- Amount, term, rate → monthly payment, principal, interest, total. Content: amounts by program, rate caps (prime 6.75%), terms, **fees list** (guarantee 0.25–3.75%, packaging 2–3%, servicing, late), prepayment rules, **504 payments explained**, limitations (no fees, no 504/PPP/EIDL, no schedule).

### Nav — SBA loan calculator (fintech)
- Loan type (7(a), 504, Express, Microloan), amount (program caps), term, variable rate (default 9%), optional guaranty fee, advanced options. Content: rate tiers (prime + spread), **7(a)/Express guaranty fee schedule**, waivers (veterans, manufacturers), **504 fee schedule** (CDC processing 1.5%, underwriter, third-party lender 0.5%, funding 0.25%, servicing), microloan fees.
- **FAQs (4):** why lenders quote differently · does it include guaranty fee · what rate if prime + spread · variable rate estimate.
- **Errors:** prime 6.75% in body vs 7.0% in widget; default 9% unexplained; duplicated sections.

---

## 5. Patterns

- **504 structure (SBA rules — cite SBA.gov):** typically 50% bank first mortgage, up to 40% CDC debenture (SBA-backed), ≥ 10% borrower equity (more for startups/special-purpose); CDC portion fixed rate tied to Treasury; 10/20/25-year terms.
- **7(a):** up to $5M; max rates = base (prime) + allowed spread by size; guarantee fee on guaranteed portion by loan size and maturity; terms up to 10 yrs (working capital/equipment) or 25 yrs (real estate); fully amortising (no balloon).
- **Payment maths:** standard amortisation; 504 total payment = bank payment + CDC payment (+ fees financed).
- **Prime rate** changes — every competitor with a fixed prime number is already inconsistent.

| Section | Pages (of 5) |
|---|:---:|
| 504 two-loan split | 1 (opaque) |
| Fees in calculation | 2 (partial) |
| Amortization schedule | 2 |
| Rate-cap table | 3 |
| Affordability / DSCR | **0** |
| Bylined + sourced | 2–3 |

---

## 6. FAQ question bank

★ = asked on 2+ pages.

| # | Question | Seen on |
|---:|---|---|
| 1 | ★ What is an SBA 504 loan / how do 504 payments work? | Finder, Swoop, Nav |
| 2 | ★ 7(a) vs 504 — which is better for me? | Swoop, NerdWallet, sba7a.loans |
| 3 | ★ Who is eligible / how to qualify? | NerdWallet, sba7a.loans, Nav |
| 4 | ★ Does the calculator include the guarantee fee? | Nav, NerdWallet |
| 5 | What is the maximum SBA 504 / 7(a) amount? | Swoop, sba7a.loans |
| 6 | How much down payment do I need? | sba7a.loans, NerdWallet |
| 7 | What interest rate should I enter (prime + spread)? | Nav |
| 8 | Why do lenders quote different payments? | Nav |
| 9 | Are there prepayment penalties? | Finder |
| 10 | What can an SBA loan be used for? | sba7a.loans |
| 11 | What are 504 fees (CDC, servicing)? | Nav |
| 12 | Can I use SBA to buy a business? | — (sba7a.loans separate tool) |

---

## 7. Gaps nobody fills — our opportunities

1. **True 504 model:** project cost → bank / CDC / equity (editable %), separate rates & terms, fees financed, combined monthly payment, blended rate. 0 competitors do this transparently.
2. **7(a) with fees:** guarantee fee by size/maturity (from SBA table, user-confirmable), packaging fee; rate = prime + spread with cap check.
3. **504 vs 7(a) side by side** for the same project (real estate/equipment).
4. **Affordability check:** business cash flow (or NOI) → DSCR vs lender minimum (editable).
5. **Acquisition mode:** price, equity injection, seller note, 7(a) loan → payments and DSCR (links Business Valuation #11).
6. **Schedules** for each loan + combined; CSV copy; no sign-up.
7. **Dated, sourced rules box** (“SBA program limits as of …, source SBA.gov”).
8. **Plain-English 504 explainer** (primary keyword is informational).

---

## 8. Blueprint for the KKCTools SBA Loan Calculator

### 8.1 SEO

- **URL:** `/sba-loan-calculator/`
- **Title/H1/Meta:** from Batch 3 keyword file; H2 “What is an SBA 504 loan?” near the top for the primary keyword.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Tabs | 7(a) · 504 · Compare 7(a) vs 504 · Acquisition |
| 7(a) | amount, prime + spread (or fixed), term, guarantee fee (table default, editable), other fees |
| 504 | project cost, bank % / CDC % / equity %, bank rate & term, CDC rate & term, CDC fees financed |
| Outputs | monthly & annual payments (each loan + total), blended rate, total interest, total fees, schedules |
| Affordability | annual cash flow / NOI → DSCR |
| UX | share URL, CSV copy, print, no network |

### 8.3 Content outline (≈ 2,000–2,400 words, original)

1. What is an SBA 504 loan? (2–3 sentences + diagram of the 50/40/10 split)
2. How to use the calculator
3. How 504 payments work (example from engine)
4. SBA 7(a) payments, rates and guarantee fees (example)
5. 7(a) vs 504 — when each fits
6. Fees to budget for
7. Down payment and eligibility basics (cited)
8. Can my business afford the loan? (DSCR)
9. FAQ (10–12)
10. Related tools — Commercial Mortgage (#8), Equipment Loan (#13), Business Valuation (#11), Compound Interest (#21)
11. Sources (SBA.gov, 13 CFR) + date; YMYL disclaimer

### 8.4 Quality checks

- Unit tests for 7(a), 504 split, fees, blended rate, DSCR, schedules.
- Every program rule traced to SBA.gov / CFR with access date, or `TODO(owner)`.
- No competitor wording copied. `npm run check:no-network` passes.
- `TODO(owner): pull Google top-10 SERP; check Fit Small Business, SoFi (403) and Ramp (404) by hand.`
