# SBA Loan Calculator (7(a) & 504) — Build Spec

> **URL:** `/sba-loan-calculator/` · Batch 3 Part 2 · **Tier 3 (YMYL)** · **Build order 13**
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + Part 2; §6 Tier 3 gate, §10.3 YMYL box)
> **Inputs used:** `12_SBA_Loan_Calculator_Competitor_Analysis.md` (5 pages), `KKCTools_Batch3_Final_Tool_Keywords.md` §2 #17, official SBA pages read 2026-11-20 (below)
> **Written:** 2026-11-20

---

## 0. Gate and strategy

**🚫 Tier 3 gate:** build only after the owner records in `docs/00-PROJECT-STATUS.md` that they will re-check the SBA program rules and fees at least yearly (SBA fees change by fiscal year).

**SERP for `sba 504 loan`** (4,400, KD 5):
- Strong: sba.gov 69 ×2, Wells Fargo 80, Wikipedia 100, Investopedia 91.
- Then 5 relevant pages at AS 26–43.
- **A small calculator (evergreen504, AS 29) already ranks #7.** A guide + calculator page can reach positions 4–10.

**Intent:** the primary is **informational**. "What is an SBA 504 loan?" must be answered near the top, and the article matters as much as the tool.

**Gap:** no competitor models a 504 correctly. A 504 is **two loans** (bank first lien + CDC/SBA debenture second lien) plus borrower equity, with different rates, terms and fees.
- NerdWallet treats it as one loan.
- Swoop shows a split without its method.

### Official facts read 2026-11-20 (these may be used, with the link and date)

| Fact | Source |
|---|---|
| 504 maturity terms: "10-, 20- and 25-year maturity terms are available." | sba.gov/funding-programs/loans/504-loans |
| 504 rate: pegged to an increment above the 10-year U.S. Treasury rate | same page |
| 504 fees: "Totals approximately 3% of the debt, rate may be financed with the loan." | same page |
| 504 maximum: **the page conflicts.** The header says "up to $5 million"; the body says "$5.5 million". | same page. `TODO(owner)`: confirm the current maximum (and any special cases) before printing either number; until then, say "see SBA.gov for the current maximum" |
| 7(a) maximum: "The maximum loan amount for a 7(a) loan is $5 million." | sba.gov/funding-programs/loans/7a-loans |

### NOT verified on an official page yet (must not be printed as fact until read on SBA.gov or eCFR 13 CFR Part 120)

- The 504 split (commonly described as 50% bank / 40% CDC / 10% borrower, with more equity for start-ups or special-purpose property).
  - In the tool these are **editable example percentages** labelled "example structure: confirm with your lender/CDC".
  - `TODO(owner)`: verify on eCFR 13 CFR 120.
- 7(a) maximum terms by use (real estate vs equipment vs working capital).
- 7(a) maximum interest-rate spreads.
- The current-fiscal-year guarantee-fee table.
- In the tool all of these are **user inputs** (with a link to SBA.gov) until verified.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | sba 504 loan | 4,400 | 5 | H2 "What is an SBA 504 loan?" near the top, first paragraph, title |
| Secondary | sba 504 loans · sba 504 financing | 2,400 · 880 | 6–7 | same H2 + the 504 tab |
| Secondary | 7a sba loan · sba loan 7a · 7 a loans | 1,300 · 1,000 · 880 | 3–11 | H2 "SBA 7(a) loan payments" + the 7(a) tab |
| Secondary | what is a sba loan | 2,400 | 17 | H2 / FAQ |
| Natural phrase | sba loan calculator | — | — | title, H1 |
| FAQ only | sba certified lender | 1,300 | 7 | lender-search intent: FAQ pointing to SBA's Lender Match (link) |
| FAQ only | sba 504 rates | 1,300 | 29 | rates change; user input; explain the Treasury-based pricing (cited) |

## 2. Our edge

- **True 504 model:** project cost → bank / CDC / equity (editable %), each loan with its own rate and term, fees financed on the CDC part, combined monthly payment, blended rate. **0 competitors** do this transparently.
- **7(a) with fees:** guarantee fee (user input until the FY table is verified), packaging/other fees, rate = base rate + spread or fixed.
- **504 vs 7(a) side by side** for the same project.
- **Affordability:** business cash flow or NOI → DSCR vs a lender minimum (editable, example).
- **Acquisition mode:** price, equity injection, seller note, 7(a) loan → payments and DSCR. Links to Business Valuation.
- Schedules per loan + combined. CSV copy. No sign-up.
- **Dated rules box** ("as read on SBA.gov on …").

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **504 loan** (default: the primary keyword)
2. **7(a) loan**
3. **Compare 504 vs 7(a)**
4. **Buy a business (7(a) acquisition)**

### 3.2 Input guide diagram (above the inputs, rules §9)

`SbaInputGuide.tsx`

**504 tab:** one tall bar = "1 Total project cost" (land/building/equipment), split into three stacked parts:
- "2 Bank loan %" (first lien);
- "3 CDC / SBA loan %" (second lien);
- "4 Your equity %".

Each part has a side tag for its own "rate" and "term" (badges 5–8). An arrow at the bottom merges the two loan payments: "= your total monthly payment". A small note under the CDC part: "CDC fees (~3% per SBA.gov) can be financed".

**7(a) tab:** a single bar: "Loan amount" + "Rate = base + spread" + "Term" + "Guarantee fee".

**Compare tab:** the two bars side by side.

Live values; the focused field highlights.

### 3.3 Inputs (all rates and fees user-entered; defaults = examples, labelled)

| Tab | Fields | Defaults |
|---|---|---|
| 504 | project cost; bank %, bank rate, bank term (years), bank amortization; CDC %, CDC rate, CDC term (10/20/25); CDC fees % financed (example 3%, linked to SBA.gov text); equity % (auto = 100 − bank − CDC) | $2,000,000; 50%, 7.0%, 25, 25; 40%, 6.5%, 25; 0% (toggle); 10% |
| 7(a) | amount, rate (fixed, or base + spread), term years, guarantee fee % or $ (user), other fees, fees financed? | $1,800,000, 9.0%, 25, —, — |
| Affordability | annual cash flow available for debt (or NOI), lender minimum DSCR (example 1.25) | optional |
| Acquisition | purchase price, buyer equity %, seller note % + rate + term, 7(a) rate + term | — |

### 3.4 Engine

`loan-engine.ts` (payment, schedule) + `real-estate-engine.dscr`. Wrapper: `src/lib/sba-loan-engine.ts`.

```ts
// 504
bankLoan = cost*bankPct ; cdcLoan = cost*cdcPct * (1 + cdcFeePct if financed) ; equity = cost*(1-bankPct-cdcPct)
validate: bankPct + cdcPct <= 1 ; warn if equity < user-chosen minimum
bankPmt = payment(bankLoan, bankRate, bankAmort*12) ; cdcPmt = payment(cdcLoan, cdcRate, cdcTerm*12)
total = bankPmt + cdcPmt ; blendedRate = (bankLoan*bankRate + cdcLoan*cdcRate) / (bankLoan + cdcLoan)
balloon if bankTerm < bankAmort (balanceAfter)
// 7(a)
financed = amount + (feesFinanced ? guaranteeFee + other : 0) ; pmt = payment(financed, rate, term*12)
// compare: same project → 504 total vs 7(a) at (cost - equity7a)
dscr = annualCashFlow / (12 * totalPmt)
acquisition: loan7a = price*(1-equity-sellerNote) ; payments + seller-note payment ; dscr
```

**Worked example (defaults, checked 2026-11-20):**

| Loan | Amount | Terms | Payment |
|---|---:|---|---:|
| 504 bank | $1,000,000 | 7.0%, 25 yr | $7,067.79/mo |
| 504 CDC | $800,000 | 6.5%, 25 yr | $5,401.66/mo |
| **504 total** | **$1,800,000** | blended rate 6.778% | **$12,469.45/mo** |
| Equity | $200,000 | — | — |
| 7(a) for the same $1.8M | $1,800,000 | 9.0%, 25 yr | **$15,105.53/mo** (+$2,636.09/mo vs 504) |

All rates are examples, and the page must label them that way.

### 3.5 Outputs

- **Headline:** total monthly payment (and each loan's).
- **Sentence:** "On a $2,000,000 project with a 50/40/10 example split, the bank and CDC loans cost $12,469 a month together at a 6.78% blended rate. The same $1.8 million as one 7(a) loan at 9% would cost $15,106."
- Split table; fees; total interest; schedules (bank, CDC, combined), CSV.
- Compare banner. DSCR card (with the "lenders set their own minimums" note).
- **"Sources & rules" box** listing the official facts above with links and the "read on" date, plus the unverified items shown as "check SBA.gov". "Last reviewed" date.
- Share URL, Print.

### 3.6 Tests

- 504 split arithmetic and validation (bank + CDC > 100% → error).
- Each payment; blended rate.
- Fees financed.
- Bank balloon when term < amortization.
- 7(a) with and without financed fees.
- Compare difference.
- DSCR; acquisition sums. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `SBA Loan Calculator – 7(a) and 504 Loan Payments` (48; 60 with the suffix: OK) |
| Meta | `Free SBA loan calculator for 7(a) and 504 loans. See the monthly payment, the 504 bank / CDC / equity split, the guarantee fee and total interest.` (146) |
| H1 | `SBA Loan Calculator: 7(a) and 504 Payments, Fees and Down Payment` |
| BLUF | "An SBA 504 loan is really two loans: a bank loan and an SBA-backed CDC loan, plus your own equity, each with its own rate. In this example, $1.8 million split between them costs $12,469 a month, versus $15,106 as a single 7(a) loan." (engine; rates labelled examples) |
| ToolShell pills | `True 504 two-loan split`, `504 vs 7(a) compare`, `DSCR affordability`, `Printable schedules` |
| Links out | Commercial Mortgage, Equipment Loan, Business Valuation, Cap Rate |
| Links in | Commercial Mortgage, Equipment Loan, Business Valuation, Tools hub |

## 5. Content (~2,100–2,400 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | What is an SBA 504 loan? | 2–3 sentences + split diagram reference (primary); cite SBA.gov | 200 |
| 2 | How to use the SBA loan calculator | 4 tabs | 120 |
| 3 | How SBA 504 payments work | Engine example: two loans, blended rate | 250 |
| 4 | SBA 7(a) loan payments, rates and fees | Engine example; fees as inputs; link the SBA fee page | 250 |
| 5 | 7(a) vs 504: which fits your project? | Uses, collateral, structure (only verified facts + general wording) | 220 |
| 6 | Fees to budget for | CDC ~3% (cited); guarantee fee (link, user input) | 150 |
| 7 | Down payment and eligibility basics | **Verified facts only**; otherwise "check SBA.gov / your lender" | 150 |
| 8 | Can my business afford the loan? (DSCR) | Engine example | 150 |
| 9 | Using a 7(a) loan to buy a business | Acquisition tab + link Business Valuation | 150 |
| 10 | FAQ | §6 | 450 |
| — | Sources & rules (dated) + YMYL disclaimer + Last reviewed | | 100 |

## 6. FAQ (11)

1. What is an SBA 504 loan? (`sba 504 loan`)
2. How do SBA 504 payments work?
3. What is an SBA 7(a) loan? (`7a sba loan`)
4. 7(a) vs 504: which is better for me?
5. What is the maximum SBA 504 / 7(a) amount? (7(a): $5M, cited; 504: "see SBA.gov" until the conflict is resolved)
6. How much down payment do I need? (verified wording only; else "lender/CDC decides; check SBA.gov")
7. What interest rate should I enter? (504: Treasury-based, cited; 7(a): lender quote)
8. Does the calculator include the guarantee fee? (yes, as your input)
9. What fees come with a 504 loan? (~3%, cited)
10. How do I find an SBA lender? (`sba certified lender`: link SBA Lender Match)
11. Why do lenders quote different payments? (rates, fees, terms)

## 7. Done when

- [ ] Owner's yearly-review note exists (gate).
- [ ] `sba-loan-engine.ts` + tests; `loan-engine` reused; `npm run verify` passes.
- [ ] Input guide (stacked split bar) above the inputs; ToolShell + TabSlider used.
- [ ] Every SBA rule on the page is in the dated Sources box with a link; unverified items are inputs, not facts; the 504 maximum conflict resolved by the owner or omitted.
- [ ] Registrations + docs updated; `graphify update .`.
