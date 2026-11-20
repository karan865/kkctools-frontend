# Self-Employment (1099) Tax Calculator — Build Spec

> **URL:** `/self-employment-tax-calculator/` · Batch 3 Part 2 · **Tier 3 (YMYL, yearly data)** · **Build order 14**
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + Part 2; §6 Tier 3 gate, §7 `us-tax-data.ts` + verified figures, §10.3)
> **Inputs used:** `25_Self_Employment_1099_Tax_Calculator_Competitor_Analysis.md` (3 pages), `KKCTools_Batch3_Final_Tool_Keywords.md` §2 #18, official IRS pages read 2026-11-20
> **Written:** 2026-11-20

---

## 0. Gate and strategy

**🚫 Tier 3 gate:** build only after the owner records in `docs/00-PROJECT-STATUS.md` a commitment to update `us-tax-data.ts` **every tax year**, plus the month they'll do it. This page goes wrong the day the numbers go stale.

**SERP for `1099 tax calculator`** (9,900, KD 6) is beatable:
- The IRS withholding estimator 92 is a W-4 tool, not a 1099 tool.
- Liberty Tax is an article.
- Five relevant calculators sit at AS 25–40 (Everlance, Keeper, Pilot, usetabby, sequifi).
- ADP 81, Nationwide 68 and Jackson Hewitt 57 are the strong ones.

**Searchers:** gig workers and freelancers asking "how much tax do I owe / set aside / pay each quarter?" Mileage apps dominate and use the calculator to sell tracking.

**Phase plan (honest scope):**
- **v1 (ship):** self-employment tax done exactly from verified IRS data, plus:
  - the half-SE-tax deduction;
  - the W-2 + 1099 Social Security wage-base interaction;
  - additional Medicare;
  - mileage;
  - federal income tax via an **effective % input**;
  - quarterly plan + safe harbor (verified wording only).
- **v2 (only after the owner verifies the 2026 brackets, standard deduction and QBI rules on irs.gov):**
  - a bracket-based federal income tax;
  - a simple QBI deduction.
  - Until then the UI says "enter your expected federal income tax rate".

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | 1099 tax calculator | 9,900 | 6 | title, H1, first sentence |
| Secondary | 1099 tax estimator | 2,400 | 0 | intro + tool heading |
| Secondary | self employed taxes calculator | 1,300 | 5 | H2 "Self-employment tax: how it's calculated" |
| Secondary | estimate taxes · estimate my taxes · estimated taxes | 5,400 · 1,300 · 4,400 | 1–24 | H2 "Quarterly estimated taxes" |
| Secondary | estimated tax dates | 2,900 | 2 | the due-date table (verified IRS dates) + FAQ |
| Natural phrase | self-employment tax calculator | — | — | URL, H1 wording |

## 2. Our edge

- **Correct, dated tax data file** (`src/content/us-tax-data.ts`) with IRS/SSA links and a tax-year selector. Competitors run stale numbers.
- **W-2 + 1099 together:** W-2 wages use up the Social Security wage base first. Only Everlance has this, and only in "advanced".
- **Transparent breakdown:** net earnings → × factor → SS part (capped) + Medicare part + additional Medicare → ½ deduction.
- **Quarterly payments:** the four IRS due dates + safe-harbor wording, verified.
- **Mileage** at the verified IRS rate. 2026 has two rates (Jan–Jun 72.5¢, Jul–Dec 76¢), so the tool asks for miles in each half.
- **State tax as an effective % input** (honest; no 50-state tables).
- **What-if:** extra expenses or a retirement contribution (as a deduction amount) → tax change. No plan-limit claims unless verified.
- No app push, no email gate, nothing stored.

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **Tax estimate** (default)
2. **Quarterly payments**
3. **What if I…** (extra expense / deduction)

### 3.2 Input guide diagram (above the inputs, rules §9)

`SeTaxInputGuide.tsx`: a funnel from top to bottom.

```
[1 1099 income] − [2 Business expenses] − [3 Business miles × IRS rate] = Net self-employment earnings
      ↓ × 92.35%* → SE tax: [12.4% Social Security, up to the wage base minus 4 W-2 wages] + [2.9% Medicare] (+0.9% over the threshold for 5 Filing status)
      ↓ half of SE tax is deductible
[6 Federal income tax rate %] + [7 State tax rate %] → total to set aside → ÷ 4 quarterly
```

- *The factor shows only once `us-tax-data` has it verified (Schedule SE).
- **Quarterly tab:** four calendar tiles (Apr 15, Jun 15, Sep 15, Jan 15) with amounts, plus a "8 Last year's total tax" badge for safe harbor.

Live values; the focused field highlights.

### 3.3 Inputs

| # | Field | Default |
|---:|---|---|
| — | Tax year (selector from `us-tax-data.ts`) | 2026 |
| 1 | 1099 / self-employment gross income | $70,000 |
| 2 | Business expenses (one field or itemised rows) | $10,000 |
| 3 | Business miles (2026: Jan–Jun and Jul–Dec fields, because the rate changed) | 0 |
| 4 | W-2 wages (if any) + federal tax already withheld | $0, $0 |
| 5 | Filing status (for additional Medicare thresholds) | Single |
| 6 | Expected federal income tax rate % (effective; v1) | 12% (label: "example, use your own") |
| 7 | State income tax rate % (effective) | 0% |
| 8 | Last year's total tax (safe harbor) | optional |
| What-if | extra deductible expense, retirement contribution amount (deduction) | — |

### 3.4 Engine (`src/lib/se-tax-engine.ts`)

All rates come from `us-tax-data.ts`. No literals in the engine.

```ts
mileageDeduction = milesH1*rateH1 + milesH2*rateH2
netSE = gross - expenses - mileageDeduction
if netSE < data.seMinimumNet (400) → seTax = 0 (explain)
base = netSE * data.seFactor                                  // seFactor must be verified; if null → block SE calc with TODO message
ssRoom = max(0, data.ssWageBase - w2Wages)
ssTax = min(base, ssRoom) * data.ssRate                       // 12.4%
medTax = base * data.medicareRate                             // 2.9%
addlMed = max(0, base + w2Wages - threshold[status]) * data.addlMedicareRate   // note: employer may withhold part on W-2
seTax = ssTax + medTax + addlMed
halfSeDeduction = (ssTax + medTax) / 2                        // additional Medicare not included (verify on Schedule SE instructions)
incomeTaxEst = (netSE - halfSeDeduction - otherDeductions + w2Wages) * fedRate  (v1 effective-rate model; label clearly)
stateEst = same base * stateRate
totalTax = seTax + incomeTaxEst + stateEst - withholding
setAsidePct = totalTax / gross
quarterly = max(0, totalTax) / 4 ; dueDates = data.estimatedTaxDueDates
safeHarbor = min(0.90 * thisYearTax, 1.00 * lastYearTax)  // verified wording; the 110% high-income rule only once verified
```

**Worked example (2026 data, defaults):**
- $70,000 − $10,000 = $60,000 net.
- × 92.35% = $55,410 → SE tax **$8,477.73** (12.4% + 2.9%).
- Half-SE deduction **$4,238.87**.
- 92.35% must be verified before shipping (rules §7).

### 3.5 Outputs

- **Headline:** total estimated tax for the year + the % of income to set aside.
- **Sentence:** "On $60,000 of net self-employment income, self-employment tax is about $8,478 (15.3% on 92.35% of your earnings). Half of it, $4,239, is deductible."
- Breakdown table (SE lines, deduction, income-tax estimate, state, withholding, total).
- Quarterly table with the IRS due dates; safe-harbor line.
- **"Tax year & sources" box:** every figure with its irs.gov/ssa.gov URL and the date checked (from `us-tax-data.sources`), "Last reviewed", and "Estimate only, not tax advice; consider a tax professional".
- Share URL (amounts only, no personal identifiers), Print.

### 3.6 Tests

- Use the IRS figures in `us-tax-data`.
- Under $400 → 0.
- Wage-base cap with and without W-2 wages.
- Additional Medicare per filing status.
- Two-rate 2026 mileage.
- Half-SE deduction.
- Quarterly split; safe harbor = the smaller of the two.
- `seFactor` null → SE block disabled with a message (no silent wrong numbers).
- The worked example. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `1099 Tax Calculator – Self-Employment Tax` (41; 53 with the suffix: OK) |
| Meta | `Free 1099 tax calculator. Estimate self-employment tax (Social Security + Medicare), the deduction for half of it, and quarterly estimated payments.` (148) |
| H1 | `1099 Tax Calculator: Self-Employment Tax and Quarterly Estimates` |
| BLUF | "Self-employment tax is 15.3% (12.4% Social Security + 2.9% Medicare) on 92.35% of your net 1099 earnings. On $60,000 net that is about $8,478, and half of it is deductible. Then add income tax and split the total into four quarterly payments." (engine + verified data) |
| ToolShell pills | `2026 IRS figures, cited`, `W-2 + 1099 together`, `Quarterly due dates`, `Mileage at IRS rate` |
| Links out | Freelance Rate, Invoice Generator, Hourly to Salary (live), Labor Cost |
| Links in | Freelance Rate, Invoice Generator, Tools hub "Money" |

## 5. Content (~2,000–2,300 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | 1099 tax calculator: what it estimates | Scope (v1), tax year, YMYL note | 150 |
| 2 | How to use the calculator | 3 tabs | 120 |
| 3 | Self-employment tax: how it's calculated | Rates, factor, wage base, $400 rule (cited) + engine example | 280 |
| 4 | W-2 and 1099 income together | Wage-base interaction example | 180 |
| 5 | Deductions that lower your bill | Expenses, mileage (2026 rates cited), half-SE deduction, retirement contributions (general; limits only if verified) | 250 |
| 6 | Federal and state income tax on 1099 profit | v1 effective-rate approach; how to find your rate | 180 |
| 7 | Quarterly estimated taxes: amounts and due dates | Verified dates + safe harbor (`estimated tax dates`, `estimate taxes`) | 250 |
| 8 | How much should I set aside? | From the engine, not a fixed rule | 120 |
| 9 | FAQ | §6 | 450 |
| — | Tax year & sources + disclaimer + Last reviewed | | 100 |

## 6. FAQ (11)

1. How much should I set aside for taxes on 1099 income?
2. What is the self-employment tax rate? (15.3%, cited)
3. Do I owe self-employment tax if I earned under $400? (cited)
4. When are quarterly estimated taxes due? (`estimated tax dates`, cited)
5. How do I calculate quarterly estimated taxes?
6. What happens if I don't pay enough each quarter? (penalty + safe harbor, verified wording; no amounts)
7. Can I use it with W-2 and 1099 income?
8. Can I deduct mileage as a 1099 contractor? (2026 rates, cited)
9. Is half of self-employment tax deductible?
10. Does this include state tax? (an effective % input)
11. Is this tax advice? (no; an estimate; dated sources)

## 7. Done when

- [ ] Owner's yearly-update commitment exists (gate).
- [ ] `us-tax-data.ts` has 2026 figures **only** from official pages with URLs and dates; `seFactor` and any v2 data verified before use.
- [ ] `se-tax-engine.ts` + tests (§3.6); `npm run verify` passes.
- [ ] Input guide (funnel) above the inputs; ToolShell + TabSlider used.
- [ ] Tax year & sources box + Last reviewed date; no unverified tax numbers on the page.
- [ ] Registrations + docs updated (add "update us-tax-data every January" to `00-PROJECT-STATUS.md`); `graphify update .`.
