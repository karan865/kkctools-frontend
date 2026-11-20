# Cap Rate Calculator — Build Spec

> **URL:** `/cap-rate-calculator/` · Batch 3 Part 2 · Tier 1 · **Build order 1**
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + Part 2, especially §7 shared engines, §9 input guide diagram, §10 trust rules)
> **Inputs used:** `06_Cap_Rate_Commercial_Property_Value_Calculator_Competitor_Analysis.md` (7 pages), `KKCTools_Batch3_Final_Tool_Keywords.md` §2 #3 (Semrush SERP 2026-11-16)
> **Written:** 2026-11-20

---

## 0. Strategy note

**SERP is weak** (avg AS 34). Omni (84) is the only strong page; the rest are real-estate lenders and SaaS at AS 7–41 (mynd, RentSpree, Landlord Studio, propmetrics.co…).

One page covers two jobs with one formula:
- the head term `cap rate calculator` (6.6K);
- the ~10 "commercial property value estimator" searches (value = NOI ÷ cap rate).

**Don't** build separate value-estimator pages.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | cap rate calculator | 6,600 | 24 | title, H1, first sentence, tool heading |
| Secondary | calculate cap rate | 1,900 | 28 | H2 "How to calculate cap rate" |
| Secondary | cap rate equation | 1,600 | 6 | H2 formula block |
| Secondary | whats a cap rate in real estate · what cap rate in real estate · cap rate real estate | 1,600 · 1,000 · 1,600 | 1 · 4 · 26 | H2 "What is a cap rate in real estate?" + FAQ |
| Secondary | commercial property value · commercial property value estimator · commercial real estate value calculator · commercial building value calculator · property value estimator commercial | 1,000 · 720 · 170 · 140 · 170 | 8–28 | H2 "Commercial property value from NOI" + the Value tab |
| Secondary | commercial real estate calculator · commercial real estate valuation (calculator) | 590 · 590 · 210 | 5–23 | intro + H2 |
| Secondary | pro forma noi · pro-forma noi · pro forma noi meaning | 260 · 320 · 110 | 5–9 | H2 "Pro forma vs actual (T-12) NOI" |
| Secondary | commercial land value calculator / estimator | 210 · 210 | 10–13 | FAQ: why the income approach suits buildings, not bare land |
| FAQ only | cap rate california | 5,400 | 12 | ⚠ wants local averages. Only answer "how to find local cap rates" — **no numbers** unless cited with a date |

**Skip:**
- "cap calculator" (ambiguous);
- appraisal-service searches (people hiring an appraiser; the page says "estimate, not an appraisal").

## 2. Our edge (from the competitor analysis)

- **3 solves in one tool:** cap rate · property value · required NOI. Only Tyler Cauble has modes.
- **NOI builder** for users who don't know their NOI: units × rent or area × rent/sq ft, vacancy, other income, itemised expenses. Omni and PropertyMetrics have one; most lenders don't.
- **Sensitivity grid:** value at cap ±0.25/0.5/1% × NOI ±5/10%. **0 of 7 competitors** have it.
- **Going-in vs exit cap** and **T-12 vs pro forma** (nobody calculates them).
- **Related metrics:** GRM, price per sq ft or per unit, price-to-NOI multiple.
- **Correct definitions.** Omni's FAQ uses gross income and repeats the "payback period" myth. We exclude debt service, capex and depreciation from NOI, and say so.
- No email gate. Currency + sq m. Share URL.

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **Cap rate** (default): NOI + price → cap rate
2. **Property value:** NOI + cap rate → value
3. **Required NOI:** price + target cap rate → NOI needed

**NOI input on every tab:** a toggle "I know my NOI" (one field) / "Build my NOI" (builder, below).

**NOI builder fields:**

| # | Field | Default (example) |
|---:|---|---|
| 1 | Income basis: units × rent per unit per month, **or** rentable area × rent per sq ft per year | 10 units × $1,500 |
| 2 | Other income per year (parking, laundry) | $3,000 |
| 3 | Vacancy & credit loss % | 5% |
| 4 | Operating expenses per year (add rows): property tax, insurance, utilities, repairs & maintenance, management (% of effective income), reserves, other | tax $18,000, insurance $6,000, management 6%, repairs $9,000, reserves $3,000 |
| 5 | Price (Cap rate and Required NOI tabs) | $2,400,000 |
| 6 | Cap rate % (Value and Required NOI tabs) | 7% |

Optional (collapsed): building area (for price per sq ft) and units (for price per unit); scenario T-12 vs pro forma (two NOI columns); exit cap rate + holding years + NOI growth % → exit value.

All defaults carry the label "example — change to your numbers" (rules §10).

### 3.2 Input guide diagram (above the inputs, rules §9)

`CapRateInputGuide.tsx`: a horizontal flow of 4 blocks with numbered badges.

```
[1 Rent roll] → [3 − Vacancy] → [4 − Operating expenses] → [= NOI] → ÷ [5 Price] → [= Cap rate %]
        ↑ [2 + Other income]
```
- **Value tab:** the last step becomes `NOI ÷ [6 Cap rate] = Value`.
- **Required NOI tab:** `[5 Price] × [6 Cap rate] = NOI needed`.
- A small dashed box under "Operating expenses" says "Not included: mortgage, capex, depreciation, income tax". This is the most common mistake, so the diagram teaches it before the user types.
- Labels show live values. The focused field's block highlights.

### 3.3 Engine

Use `src/lib/real-estate-engine.ts` (create it now; rules §7). The tool-specific helpers go in `src/lib/cap-rate-engine.ts`:

```ts
effectiveIncome   = grossRent + otherIncome - grossRent * vacancyPct      // vacancy on rent only (state it)
managementCost    = effectiveIncome * managementPct
noi               = effectiveIncome - Σ expenses - managementCost
capRate           = noi / price                 // null if price <= 0
value             = noi / cap                   // null if cap <= 0
requiredNoi       = price * cap
grm               = price / grossAnnualRent     // null if rent 0
pricePerSqft      = price / area ; pricePerUnit = price / units
priceToNoi        = price / noi                 // = 1 / cap; null if noi <= 0
sensitivity(noi, cap, capSteps = [-1,-0.5,-0.25,0,0.25,0.5,1], noiSteps = [-10,-5,0,5,10]) -> grid of values
exitValue         = noi * (1+g)^years / exitCap
```
A negative NOI is allowed. The UI says "Expenses exceed income: the cap rate is negative and value-from-NOI is not meaningful".

### 3.4 Outputs

- **Result headline:** cap rate (or value, or NOI) + direction note.
- **Plain sentence:** "A property with $127,560 NOI bought for $2,400,000 has a 5.32% cap rate."
- **NOI breakdown table:** income → vacancy → effective income → each expense → NOI, each with % of effective income.
- **Metrics row:** GRM, price per sq ft or per unit, price-to-NOI.
- **Sensitivity grid**, with the current cell highlighted.
- **Step-by-step formula** with the user's numbers.
- Share URL, Copy, Print. `aria-live` on the headline.

### 3.5 Tests (`real-estate-engine.test.ts`, `cap-rate-engine.test.ts`)

- Each solve, plus round-trips (value → cap → value).
- Zero or negative price, cap, rent → `null`, never Infinity or NaN.
- Vacancy applied to rent only. Management % on effective income.
- Sensitivity grid size and its centre cell = base value.
- Negative NOI path.
- Snapshot: every number used in page copy, the BLUF and the FAQ comes from the engine.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Cap Rate Calculator – NOI & Commercial Property Value` (53, over 60 with the suffix → `absoluteTitle`) |
| Meta | `Free cap rate calculator. Work out net operating income, the cap rate from a price, or a commercial property's value from NOI and a market cap rate.` (148) |
| H1 | `Cap Rate Calculator: Cap Rate, NOI and Property Value` |
| BLUF (first 60 words) | "Cap rate = net operating income ÷ property price × 100. A building with $127,560 of NOI priced at $2.4 million has a 5.32% cap rate. Turn it around to value a commercial property: value = NOI ÷ cap rate." All numbers come from the engine defaults. |
| Schema | WebApplication + FAQPage + BreadcrumbList (via `buildSchema`), as on live pages |
| ToolShell pills | `3 ways to solve`, `NOI builder`, `Sensitivity grid`, `Print & share link` |
| Links out | Rental Property, Commercial Mortgage, Commercial Lease (when built), Percentage Change, Square Footage (live) |
| Links in | Rental Property, Commercial Lease, Commercial Mortgage, Airbnb, Tools hub "Real estate" row |

## 5. Content (~1,900–2,200 words, original; each H2 maps to keywords)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the cap rate calculator | 3 tabs, NOI toggle, sensitivity | 130 |
| 2 | Cap rate equation (how to calculate cap rate) | Formula + engine example, every line shown | 230 |
| 3 | What is a cap rate in real estate? | Plain definition; what a higher or lower cap says about price and risk (no unsourced ranges) | 200 |
| 4 | How to calculate NOI: what's in and what's out | Table of included vs excluded items (mortgage, capex, depreciation, income tax) | 230 |
| 5 | Commercial property value from NOI | Value tab example; "commercial property value estimator" wording | 200 |
| 6 | Pro forma vs actual (T-12) NOI | Why buyers check both; example from the engine | 150 |
| 7 | Going-in vs exit cap rate | Exit value example; how a 0.5% cap move changes value (from the sensitivity grid) | 150 |
| 8 | Cap rate vs cash-on-cash, GRM and IRR | When to use which; link Rental Property | 180 |
| 9 | How to find local cap rates | Broker reports, recent sales, appraisers; **no numbers without a dated source** (answers "cap rate california") | 130 |
| 10 | Common cap rate mistakes | Gross vs NOI, including the mortgage, the payback myth, stale "market" figures | 150 |
| 11 | FAQ | §6 | 400 |
| — | Disclaimer | "Estimate only, not an appraisal or investment advice" | 30 |

## 6. FAQ (11)

1. How do you calculate cap rate? (`calculate cap rate`)
2. What is the cap rate equation? (`cap rate equation`)
3. What is a cap rate in real estate? (`whats a cap rate in real estate`)
4. What does a 7% cap rate mean? (engine: price-to-NOI ≈ 14.3×)
5. What is a good cap rate? (depends on risk, location and asset type; how to find comps; no invented ranges)
6. Does cap rate include the mortgage? (no)
7. How do I estimate a commercial property's value? (`commercial property value estimator`)
8. What is pro forma NOI? (`pro forma noi meaning`)
9. Do cap rates go up when interest rates rise? (explain the relationship in general terms, no forecast)
10. Can I use a cap rate to value land? (`commercial land value calculator`: little or no NOI, so use comparable sales)
11. Is this an appraisal? (no)

## 7. Done when

- [x] `real-estate-engine.ts` + `cap-rate-engine.ts` with tests (§3.5); `npm run verify` passes from PowerShell. (Evidence: 16 tests in real-estate-engine.test.ts, 9 tests in cap-rate-engine.test.ts)
- [x] Input guide diagram above the inputs, with numbers matching the field labels and focus highlight (rules §9). (Evidence: CapRateInputGuide.tsx with SVG flow and live values)
- [x] ToolShell + TabSlider + font/typography classes used. (Evidence: ToolShell with 4 pills, TabSlider segmented control)
- [x] No average cap rates anywhere without a dated citation. (Evidence: User input driven with dated sources)
- [x] Mobile 390 px: grid and NOI table scroll inside their boxes. (Evidence: tableScroll wrappers with overflow-x auto)
- [x] Routes, catalog (`business`), calculation-methods, ToolArt, Icons, Footer, docs 00/01/02/04/06 updated; `graphify update .` run.
