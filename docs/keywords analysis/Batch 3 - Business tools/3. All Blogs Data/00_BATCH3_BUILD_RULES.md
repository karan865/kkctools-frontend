# Batch 3 (Business Tools) — Common Build Rules

> Applies to all 5 Batch 3 build specs:
> - `1. Percentage_Change_…/01_…_BUILD_SPEC.md`
> - `2.Markup_…/02_…_BUILD_SPEC.md`
> - `3.Profit_Margin_…/03_…_BUILD_SPEC.md`
> - `4.Hourly_to_Salary_…/04_…_BUILD_SPEC.md`
> - `5.Unit_Price_…/05_…_BUILD_SPEC.md`
>
> **Read this file first, then the tool's own spec.**
> Written 2026-11-18.

---

## 1. Project rules (from `AGENTS.md`, which wins on any conflict)

- Next.js 16 static export, React 19, TypeScript, CSS Modules.
- **Zero network calls** in tool code (`npm run check:no-network`).
- **No fabricated facts.** Any statistic, benchmark ("good margin", "median wage") or legal rule needs a named, dated, official source. If you have no source, leave it out or mark it `TODO(owner)`.
- **Never copy competitor text, tables or examples.** Write original examples with our own numbers.
- **Every number shown in content (tables, examples, FAQ answers) is computed by the engine at build time.** Never type a result into the JSX. The page then can't contradict itself (the Batch 2 review found hard-coded FAQ numbers that drifted from the engine).
- No author name or credentials (`TODO(owner)`). No "accurate", "exact" or "guaranteed" claims.
- `npm run verify` must pass all 6 steps before you finish. Do not commit or push.

## 2. Shared engines (build once, reuse)

These 5 tools are all percentage and price maths. Create the shared code first:

| File | Exports | Used by |
|---|---|---|
| `src/lib/percent-engine.ts` (+ test) | `pctChange(old, new)`, `pctDifference(a, b)`, `applyPct(x, p)`, `reversePct(newVal, p)`, `pctOf(p, y)`, `whatPct(x, y)`, `ppDifference(a, b)`, `excelFormula(mode, cells)` | Percentage Change, Unit Price (shrinkflation), Hourly (raise %), Markup |
| `src/lib/pricing-engine.ts` (+ test) | `priceFromMarkup`, `markupFromPrice`, `costFromPrice`, `priceFromMargin`, `marginFromMarkup`, `markupFromMargin`, `multiplier`, `roundPriceEnding`, `addTax`, `stripTax`, `landedCost` | Markup, Profit Margin, Unit Price (seller mode) |

Rules for both engines:
- Pure functions; return `null` (not NaN or Infinity) for undefined cases (divide by zero). The UI explains why the answer is undefined.
- Use `Math.max(0, …)` only where a negative result is truly impossible. Percent changes **can** be negative.
- Normalise -0 to 0.
- Display rounding happens only in the UI formatter (2 dp default, editable). The engine keeps full precision.

## 3. Files a new tool touches (same pattern as every live tool)

Reference implementation: the latest tools (Carpet / Deck / Roof). Run `git show --stat fc9be24` to see the file list.

| Action | File |
|---|---|
| new | `src/lib/<tool>-engine.ts` + `.test.ts` (or use the shared engines above) |
| new | `src/components/tool/<slug>/<Name>.tsx` + `.module.css`, `index.ts` (+ diagram/visual if the spec asks) |
| new | `src/app/<slug>/page.tsx` + `page.module.css` |
| edit | `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (category `business`), `src/lib/tools-catalog.test.ts` (count) |
| edit | `src/content/calculation-methods.ts` (formulas + any sources), `src/components/home/ToolArt.tsx`, `src/components/icons/Icons.tsx`, `src/components/layout/Footer.tsx` |
| edit | `docs/00-PROJECT-STATUS.md`, `01-FEATURES.md`, `02-SEO.md`, `04-KEYWORDS.md`, `06-CHANGELOG.md` |

Page structure, copied from the existing tool pages:
- `buildMetadata` (title ≤ 60 chars **including** the " | KKC Tools" suffix; use `absoluteTitle` if the brand suffix pushes it over 60);
- `Breadcrumbs` (Home › Tools › Name);
- `JsonLd` with WebApplication + FAQPage + BreadcrumbList via `buildSchema`;
- the calculator above the fold;
- the BLUF answer (first 50–60 words answer the main query directly);
- content H2s;
- `HowWeCalculate`;
- FAQ (visible once, schema once);
- related tools;
- `AdSlot` placements like the other pages.

## 4. SEO rules for this batch (business-maths SERPs)

1. **The calculator is above the fold and works with defaults on load.** It shows a real answer before the user types anything.
2. **Every result has a plain-English sentence,** e.g. "Selling at $150 gives $50 profit: a 50% markup and a 33.3% margin." Google often quotes these lines.
3. **Show the formula with the user's own numbers** (step-by-step) under every result.
4. **One H2 per keyword cluster** in the spec. FAQ questions use the exact keyword phrasing ("how to find percent change").
5. **Tables come from the engine** (e.g. markup ↔ margin table, $/hour → salary table).
6. **Internal links:** link every Batch 3 maths tool to the others (Percentage ↔ Markup ↔ Margin ↔ Unit Price ↔ Hourly). Add a "Business maths" row on the Tools hub.
7. **Share URL** (state in the query string), Copy result, Print. Keyboard friendly; `aria-live` on results.
8. **Mobile 390 px:** inputs stack, tabs scroll horizontally inside their bar, tables scroll in their own box, no page-level horizontal scroll.
9. **No sign-up, no email, no network.**

## 5. Ranking reality (read before choosing the build order)

SERP check from `KKCTools_Batch3_Final_Tool_Keywords.md` (2026-11-16):

| Tool | Head-term SERP | What to target first | Build order |
|---|---|---|:---:|
| Unit Price | ✅ weak: 6 slots held by AS 9–22 sites | `unit price calculator`, `price per unit calculator` (KD 0) | **1** |
| Markup | ✅ weak: #1 and #2 are AS 33 and AS 14 | `markup calculator` (14.8K) | **2** |
| Profit Margin | 🟡 hard: top 7 are AS 51–100 | `gross margin calculator` (KD 8), aiming for #8–10, plus long-tail formula terms | **3** (shares the Markup engine) |
| Hourly to Salary | ❌ `wage calculator` = paycheck-tax intent (ADP, SmartAsset) | **Not** `wage calculator`. Target `yearly wage calculator` (6.6K, KD 0), `calculate annual salary` (6.6K, KD 10), `monthly gross income calculator` (3.6K, KD 9) | **4** |
| Percentage Change | ❌ head term: 9 of 10 results are AS 67–100 | **Not** the head term at first. Target long tail: `how to find percent change` (8.1K, KD 10), `percentage change formula` (6.6K, KD 12), `percentage difference between two numbers` (2.9K, KD 7), Excel terms | **5** |

Even on the weak SERPs, a DA 1 site needs a few backlinks and 4–8 weeks. "Turant ranking" isn't realistic for anyone. What these pages can do is win on usefulness, and Google rewards that over time.


---

# Part 2 — Pending 14 tools (added 2026-11-20)

Part 1 above (sections 1–5) still applies. Part 2 adds the rules for the 14 tools still pending in `KKCTools_Batch3_Final_Tool_Keywords.md`. Each tool has its own folder here with `<NN>_<Name>_BUILD_SPEC.md` next to its competitor analysis.

## 6. Build order (from the keyword file, §6 "Next steps")

| Order | Spec folder | URL | Tier | Shared engine |
|---:|---|---|:---:|---|
| 1 | `06_Cap_Rate_Commercial_Property_Value_Calculator` | `/cap-rate-calculator/` | 1 | `real-estate-engine` |
| 2 | `07_Rental_Property_Calculator` | `/rental-property-calculator/` | 1 | `real-estate-engine` + `loan-engine` |
| 3 | `18_Labor_Cost_Calculator` | `/labor-cost-calculator/` | 1 | `us-tax-data` + `pricing-engine` |
| 4 | `10_Commercial_Lease_Calculator` | `/commercial-lease-calculator/` | 1 | own engine |
| 5 | `14_Airbnb_Short_Term_Rental_Profit_Calculator` | `/airbnb-calculator/` | 1 | `real-estate-engine` + `loan-engine` |
| 6 | `15_Freelance_Hourly_Rate_Calculator` | `/freelance-rate-calculator/` | 1 | `us-tax-data` + `wage-engine` |
| 7 | `22_Contribution_Margin_Break_Even_Calculator` | `/contribution-margin-calculator/` | 1 | own engine + `pricing-engine` |
| 8 | `08_Commercial_Mortgage_LTV_Calculator` | `/commercial-mortgage-calculator/` | 2 | `loan-engine` + `real-estate-engine` |
| 9 | `13_Equipment_Business_Loan_Calculator` | `/equipment-loan-calculator/` | 2 | `loan-engine` |
| 10 | `11_Business_Valuation_Calculator` | `/business-valuation-calculator/` | 2 | own engine |
| 11 | `16_Invoice_Generator_Hourly_Freelance` | `/invoice-generator/` | 2 | own engine (reuse Construction Estimate Template patterns) |
| 12 | `20_How_Long_Will_My_Money_Last_Calculator` | `/how-long-will-my-money-last/` | 3 (YMYL) | own engine |
| 13 | `12_SBA_Loan_Calculator` | `/sba-loan-calculator/` | 3 (YMYL) | `loan-engine` |
| 14 | `25_Self_Employment_1099_Tax_Calculator` | `/self-employment-tax-calculator/` | 3 (YMYL) | `us-tax-data` |

**Tier 3 gate:** build 12–14 only after the owner confirms in writing (in `docs/00-PROJECT-STATUS.md`) that they will review the data yearly. Until then stop after #11 and report.

## 7. New shared code (build once, before the first tool that needs it)

| File | Exports (pure functions; `null` for undefined cases; -0 → 0) | Used by |
|---|---|---|
| `src/lib/loan-engine.ts` (+ test) | `monthlyRate(apr)`, `payment(principal, apr, months)` (rate 0 → principal ÷ months), `interestOnlyPayment(principal, apr)`, `balanceAfter(principal, apr, amortMonths, paidMonths)`, `schedule(opts)` → monthly rows + yearly roll-up (supports an interest-only period, a balloon when term < amortization, extra principal), `maxLoanFromPayment(payment, apr, months)` (PV of an annuity), `aprWithFees(principal, fees, apr, months)` (solve the rate by bisection), `factorRateToApr(advance, factor, termDays, remitEveryDays)` | Rental Property, Airbnb, Commercial Mortgage, Equipment Loan, SBA |
| `src/lib/real-estate-engine.ts` (+ test) | `noi({grossRent, otherIncome, vacancyPct, expenses[]})`, `capRate(noi, value)`, `valueFromCap(noi, cap)`, `noiFromCap(value, cap)`, `grm(price, annualRent)`, `dscr(noi, annualDebtService)`, `debtYield(noi, loan)`, `cashOnCash(annualCashFlow, cashInvested)`, `grossYield`, `netYield`, `irr(cashFlows)` (bisection; `null` if there is no sign change), `npv(rate, cashFlows)` | Cap Rate, Rental Property, Airbnb, Commercial Mortgage |
| `src/content/us-tax-data.ts` | One object per tax year: `{ year, ssRate: 0.124, medicareRate: 0.029, seFactor, ssWageBase, addlMedicareRate: 0.009, addlMedicareThresholds: {single, mfj, mfs, hoh}, seMinimumNet: 400, futa, mileage: [{from, to, centsPerMile}], estimatedTaxDueDates, sources: [{label, url, checked}] }`. Only figures read on an official page go in, with URL and date checked; anything unverified stays `null` with `TODO(owner)`. | Labor Cost, Freelance Rate, SE Tax |

**Figures already checked on official pages (2026-11-20), so they can go into `us-tax-data.ts`:**

| Figure | Value | Source (checked 2026-11-20) |
|---|---|---|
| SE tax rate | 15.3% = 12.4% Social Security + 2.9% Medicare | irs.gov "Self-employment tax (Social Security and Medicare taxes)", last reviewed 30-Oct-2026 |
| SE tax applies from | $400 net | same page |
| Additional Medicare 0.9% thresholds | single $200,000 · married filing jointly $250,000 · married filing separately $125,000 · head of household $200,000 | same page |
| 2026 Social Security wage base | $184,500 | same IRS page. `TODO(owner)`: confirm on ssa.gov/oact/cola/cbb.html (it blocked our fetch) |
| Business mileage rate | 2025: 70¢ · 2026: 72.5¢ (Jan 1–Jun 30) and 76¢ (Jul 1–Dec 31) | irs.gov/tax-professionals/standard-mileage-rates, last reviewed 28-Jul-2026 |
| Estimated tax due dates | Apr 15, Jun 15, Sep 15, Jan 15 (next year) | irs.gov "Estimated taxes" + Estimated tax FAQ "Individuals 2", reviewed Sep/Oct 2026 |
| Safe harbor | Pay at least 90% of this year's tax or 100% of last year's, whichever is smaller; no penalty if you owe under $1,000 | same pages |

**Not verified yet (`TODO(owner)` until read on irs.gov):**
- the 92.35% factor (the IRS page didn't show it; take it from the Schedule SE instructions);
- the 110% high-income safe harbor;
- 2026 federal brackets and standard deduction;
- FUTA.

## 8. Every Part 2 page uses the live shared UI

- Wrap the calculator in `ToolShell` (`src/components/tool/shared/ToolShell.tsx`) with 3–4 true feature pills. The rules are in `docs/prompts/TOOL_SHELL_ROLLOUT_PROMPT.md` §4: no ratings, no review counts, never `aggregateRating`.
- Modes/tabs use `TabSlider` (`src/components/tool/shared/TabSlider.tsx`, props `tabs`, `activeId`, `onChange`, `ariaLabel`). Mirror the active tab in `?tab=` so it can be shared.
- `<main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>`, using `src/lib/fonts.ts` + `src/styles/tool-typography.module.css`, as on the live tool pages.

## 9. NEW: input guide diagram ABOVE the inputs (owner request)

Every Part 2 tool gets an **input guide diagram at the top of the input column, above the first field**. It shows what each input means *before* the user types.

**Pattern (same in every tool):**
- **File:** `src/components/tool/<slug>/<Name>InputGuide.tsx` (+ `.module.css`). Inline SVG only: no images, no chart library, no network.
- **Numbered callouts:** each labelled part of the diagram has a small number badge (1, 2, 3…). The **same number** appears before the matching input label, so "1 Gross rent" in the diagram is the "1 Gross rent" field.
- **Live values:** the diagram labels show the current input values ("Rent $4,000/mo"), so it explains and confirms at the same time.
- **Focus highlight:** the calculator keeps `activeField` state. Each input's `onFocus`/`onBlur` sets it, and the diagram highlights the matching part (accent stroke + soft fill) while dimming the rest to ~45% opacity. With no field focused, everything is full strength.
- **Size:** max-height 220px desktop, 180px at 390px. Scale with `viewBox`; no fixed pixel widths, no horizontal scroll.
- **Accessibility:** the `<svg>` has `role="img"` plus `<title>` and `<desc>` describing in words what each part means. The callout numbers also appear in the visible labels, so screen-reader users lose nothing.
- **Themes:** colours come only from tokens (`var(--surface)`, `var(--ink)`, `var(--line)`, an accent). It must read on the tinted ToolShell surface in light and dark mode.
- **Print:** keep it (it explains the printed numbers) but drop the dimming.
- **Mobile:** below 640px it may collapse into a `<details>` titled "What do these inputs mean?", open by default the first time. It stays above the inputs.
- **Tabs:** each tab whose inputs differ shows its own diagram. Swap it with the tab; don't stack several.
- A results diagram (waterfall, chart, schedule) is separate and stays in the results column.

Each spec's §3.2 says what its diagram must show.

## 10. Content and trust rules for Part 2 (finance / real estate / tax)

1. **Never print market data we can't cite:** average cap rates, rents, Airbnb occupancy, freelance rates, valuation multiples, interest rates.
   - The user types these.
   - If a page needs a reference number, cite a named, dated public source with a link; otherwise leave it out.
   - Label every default in the tool "example — change to your numbers".
2. **Disclaimer block** (short and factual, not scary) on every Part 2 page: "Estimate for planning only. Not financial, tax, legal or investment advice." Real-estate pages add "not an appraisal"; tax pages add the tax year.
3. **YMYL pages (Tier 2 loans + Tier 3):**
   - a visible "Sources & assumptions" box listing every official figure with its URL and the date checked;
   - a "Last reviewed" date on the page;
   - no guarantees ("safe", "will last").
4. **No brand misuse:**
   - "Airbnb" is used descriptively only: no logo, no "official".
   - Competitor brand keywords from the exports (AirDNA, BNBCalc, BizBuySell, Omni…) are never targeted.
5. **Pre-tax / gross labels everywhere,** unless the tool really models tax (only SE Tax does).

## 11. Ranking reality for Part 2

| Tier | SERP | What to expect |
|---|---|---|
| 1 | Weak | With a few relevant links, a page can reach the top 10 in weeks to a few months. |
| 2 | Giants on top | Aim for #5–10, with links. |
| 3 | YMYL | Google wants expert trust signals: cited sources, a reviewer, an update date. |

**Before building each tool,** the builder confirms its SERP is still weak, using the keyword file's "SERP filter" rule. If 3+ relevant domains with AS ≥ 60 are in the top 5, stop and tell the owner.


---

# Part 3 — Tools removed in the SERP check, built on owner request (added 2026-11-20)

**Background:** these 7 tools are in §2b of `KKCTools_Batch3_Final_Tool_Keywords.md` (removed after the SERP check). The owner chose to build them anyway.

**The rule for all of them:** the head term is a **long-term** goal. Every spec targets low-KD long-tail rows from the Semrush exports first. Parts 1 and 2 (including §9 input guide and §10 trust rules) apply in full.

## 12. Build order (after Part 2 tool #11; can run before the Tier 3 tools if those are still gated)

| Order | Spec folder | URL | Long-tail target first (US vol / KD) | YMYL |
|---:|---|---|---|:---:|
| 1 | `26_Present_Value_NPV_Calculator` | `/present-value-calculator/` | `pv formula` 2,400/14 · `present value discount tables` 1,300/9 | no |
| 2 | `21_Compound_Interest_Calculator` | `/compound-interest-calculator/` | `compound growth calculator` 6,600/4 · `compound daily calculator` 1,600/3 | light |
| 3 | `17_Card_Processing_Fee_Calculator` | `/processing-fee-calculator/` | `square credit card processing fees` 1,600/10 · `square pos pricing` 2,400/9 | no |
| 4 | `24_Credit_Card_Payoff_APR_Calculator` | `/credit-card-payoff-calculator/` | `estimate minimum payment credit card` 2,400/5 · `calculator apr credit card` 1,600/6 | yes |
| 5 | `19_Net_Worth_Calculator` | `/net-worth-calculator/` | `net worth meaning` 5,400/7 · `calculate net worth` 2,900/9 | light |
| 6 | `23_HELOC_Home_Equity_Calculator` | `/heloc-calculator/` | `heloc loan calculator` 12,100/9 · `estimate home equity payment` 2,400/9 | yes |
| 7 | `27_Investment_Return_Calculator_SP500` | `/investment-return-calculator/` | `investment calculator s&p 500` 880/10 · money market rows (KD 12–22) | yes |

## 13. Shared code and data gates for Part 3

- **`src/lib/tvm-engine.ts` (+ test).** Built with Present Value and reused by Compound Interest and Investment Return:
  - `pv`, `fv`, `pvAnnuity`, `fvAnnuity`, `pvGrowingAnnuity`, `pvPerpetuity`;
  - `effectiveRate(r, n)`, `nominalFromApy`, `perPeriodRate(r, n, m)`;
  - `xnpv`, `pvTable`, `annuityTable`, `excelFormulas`.
  - Reuse `real-estate-engine.npv/irr`; don't duplicate them.
- **`loan-engine.ts`** (Part 2) is reused by Credit Card Payoff and HELOC.
- **Processing-fee presets:** `src/content/processing-fee-presets.ts` holds only rates read on each provider's official pricing page, with `sourceUrl` + `checked`. Unverified presets are omitted; Custom mode always works. `TODO(owner)`: re-check every 3 months.
- **Net Worth benchmarks:** only from the Federal Reserve SCF tables read on federalreserve.gov (survey year, dollar year, link, date). Otherwise none.
- **Investment Return historical mode:** only with an owner-approved static dataset whose licence allows reuse (asOf + sources). Otherwise the Historical tab is not rendered; v1 ships Projection, Money market, T-bill and Compare.
- **No brand keywords targeted** (NerdWallet, Bankrate, Ramsey, myusfinance…). Square, PayPal and Stripe are named descriptively only, with no logos and no affiliate links.
