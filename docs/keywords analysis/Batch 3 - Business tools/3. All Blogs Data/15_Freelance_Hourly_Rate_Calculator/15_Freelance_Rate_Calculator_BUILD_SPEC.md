# Freelance Hourly Rate Calculator — Build Spec

> **URL:** `/freelance-rate-calculator/` · Batch 3 Part 2 · Tier 1 · **Build order 6**
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + Part 2)
> **Inputs used:** `15_Freelance_Hourly_Rate_Calculator_Competitor_Analysis.md` (6 pages), `KKCTools_Batch3_Final_Tool_Keywords.md` §2 #8, Semrush exports #1 / #1.1
> **Written:** 2026-11-20

---

## 0. Strategy note

**SERP is weak.** AS 7–29 sites hold six slots, including #2 (freelancehourlyrate.com, AS 7). Upwork 73, HubSpot 79 (a gated download) and Harvest 54 are the only strong ones.

**Volume:**
- Small (320 US; ~1.2K global) for the exact tool terms.
- The "what should I charge" questions (copywriting, SEO and content rates, ~3,000) can be answered by the same tool for any profession.

**Don't publish "average rates by profession".** Every competitor table is unsourced. If the owner wants one later, it needs a named survey + year (`TODO(owner)`).

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | freelance rate calculator | 320 | 19 | title, H1, first sentence |
| Secondary | freelance fee calculator · freelance cost calculator | 260 · 260 | 23–24 | intro + H2 |
| Natural phrase | freelance hourly rate calculator · how much should I charge per hour | — | — | H1 wording + H2 |
| Secondary (profession presets text only) | seo consultant hourly rate | 590 | 20 | H2 "Setting a consultant or SEO rate": method, user-entered market check |
| Secondary | copywriting rates · copywriter rates · freelance copywriter rates · how much do copywriters charge · how much does website copywriting cost · website copywriting prices/rates | 210 · 90 · 390 · 70 · 110 · 110/90 | 5–27 | H2 "How to price copywriting and content work" (per hour, per word, per project from the engine; **no market numbers**) + FAQ |
| FAQ only | why is seo expensive | 480 | 14 | FAQ: time + skills + costs explained with the engine |
| Skip | job/platform searches (Upwork, Fiverr, writing jobs), foreign-language and dated queries | — | — | dropped in the keyword file |

## 2. Our edge

- **Two-way tool:**
  - **Goal → rate:** target take-home → hourly, day, week and project rate.
  - **Rate → income:** hourly rate → yearly revenue, profit and estimated take-home.
  - Only Rize goes rate → income, and it ignores income tax.
- **Realistic calendar:** holidays, vacation, sick and training days + billable % → billable hours, shown clearly. Competitors handle this partially.
- **Costs a job would cover:** health insurance, retirement, paid leave. Itemised business costs; equipment spread over years.
- **Tax as an editable effective %**, plus an optional US self-employment tax helper (data from `us-tax-data.ts`, cited). **0 of 6** model tax properly.
- **Break-even rate vs recommended rate** (+ buffer %), day rate, weekly retainer, project quote.
- **Salary equivalent:** link the live Hourly to Salary page.
- **Correct, consistent outputs.** Everhour's own numbers don't match ($65 × 960 h ≠ $91,200).
- Currency + VAT note (UK/EU rates are usually quoted ex-VAT). No email gate.

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **What should I charge?** (default): goal → rate
2. **What will I earn?**: rate → income
3. **Project quote**: hours × rate + buffer

### 3.2 Input guide diagram (above the inputs, rules §9)

`FreelanceInputGuide.tsx`: two linked visuals.

**Left: a year bar of 52 small week blocks.**
- Blocks greyed for "2 Holidays", "3 Vacation", "4 Sick days" and "5 Training".
- The remaining blocks are split into billable (accent) and non-billable (striped) by "6 Billable %".
- Caption: "= billable hours per year" (live number).

**Right: a money stack, read bottom-up.**
- 1 Take-home you want
- 7 Tax %
- 8 Business costs
- 9 Benefits (health, retirement)
- 10 Buffer %
- An arrow divides the stack by the billable hours: "= hourly rate".

**"What will I earn?" tab:** the arrow reverses. Rate × billable hours = revenue, then costs and tax come off the top.

Live values; the focused field highlights.

### 3.3 Inputs (defaults = examples)

| # | Field | Default |
|---:|---|---|
| 1 | Target take-home pay per year (after tax) | $70,000 |
| 2–5 | Workdays per week, hours per day, holidays, vacation, sick, training days | 5, 8, 10, 15, 5, 5 |
| 6 | Billable % of working time (admin, sales and learning take the rest) | 70% |
| 7 | Effective tax % on profit (editable). Optional "US self-employed helper" shows the SE tax part from `us-tax-data.ts` with source links | 25% |
| 8 | Business costs (add rows, monthly or yearly): software, equipment (cost ÷ years), insurance, coworking, accounting, marketing, other | total $6,000/yr |
| 9 | Benefits: health insurance /yr, retirement /yr | $6,000, $3,500 |
| 10 | Buffer / profit % on top of break-even | 15% |
| — | Currency; "rates quoted ex-VAT" note toggle | USD |
| Tab 2 | Hourly rate, billable hours (from calendar), costs, tax % | — |
| Tab 3 | Estimated hours, rate (from tab 1), revision buffer %, fixed expenses | — |

### 3.4 Engine (`src/lib/freelance-rate-engine.ts`)

Reuses `wage-engine` for the salary comparison and `us-tax-data` for the SE-tax helper.

```ts
workDays = 52*daysPerWeek - holidays - vacation - sick - training
billableHours = workDays * hoursPerDay * billablePct            // null if <= 0
preTaxProfitNeeded = takeHome / (1 - taxPct)                    // null if taxPct >= 1
requiredRevenue = preTaxProfitNeeded + businessCosts + benefits
breakEvenRate = requiredRevenue / billableHours
recommendedRate = breakEvenRate * (1 + buffer)
dayRate = recommendedRate * hoursPerDay        // label: "per full billable day"
weeklyRetainer = recommendedRate * hoursPerDay * daysPerWeek * billablePct
projectQuote = hours * rate * (1 + revisionBuffer) + fixedExpenses
// reverse
revenue = rate * billableHours ; profit = revenue - costs - benefits ; takeHome = profit * (1 - taxPct)
salaryEquivalent: a salaried job paying takeHome gross-up — show via wage-engine (gross) with the note "employers also pay benefits and paid leave"
```

**Worked example (defaults, checked 2026-11-20):**

| Item | Value |
|---|---|
| Work days | 225 |
| Billable hours | 1,260 |
| Pre-tax profit needed | $93,333.33 |
| Required revenue | $108,833.33 |
| Break-even rate | **$86.38/h** |
| Recommended rate (+15%) | **$99.33/h** |
| Day rate | $794.66 |
| Weekly retainer | $2,781.30 |

### 3.5 Outputs

- **Headline:** recommended hourly rate, with the break-even rate underneath.
- **Sentence:** "To take home $70,000 a year after tax with 1,260 billable hours, charge at least $86.38 an hour. $99.33 adds a 15% buffer."
- Cards: day rate, weekly retainer, monthly revenue needed, billable hours.
- Breakdown: take-home → tax → costs → benefits → revenue (shows why a freelance rate is higher than a salary ÷ 2,080).
- Comparison line: "A salaried job paying $X gross is roughly similar before benefits" (via `wage-engine`), plus a link to Hourly to Salary.
- Share URL, Copy, Print.

### 3.6 Tests

- Calendar maths; zero billable hours → `null`.
- Tax 100% → `null`.
- Goal → rate → income round-trips back to the target take-home.
- Project quote with buffer.
- The worked example. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Freelance Rate Calculator – Hourly Rate You Need` (48; 60 with the suffix: OK) |
| Meta | `Free freelance rate calculator. Start from the income you want, add expenses, taxes and time off, and get the hourly, day and project rate to charge.` (149) |
| H1 | `Freelance Hourly Rate Calculator: What to Charge per Hour` |
| BLUF | "Your freelance rate = (take-home pay ÷ (1 − tax rate) + business costs + benefits) ÷ billable hours. To take home $70,000 with 1,260 billable hours, charge at least $86.38 an hour, or about $99 with a 15% buffer." (engine) |
| ToolShell pills | `Rate ↔ income both ways`, `Billable hours calendar`, `Day & project rates`, `Print & share link` |
| Links out | Hourly to Salary (live), Invoice Generator (when built), Self-Employment Tax (when built), Markup, Labor Cost |
| Links in | Hourly to Salary (add "freelancing?" link), Invoice Generator, Labor Cost, Tools hub |

## 5. Content (~1,700–2,000 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the freelance rate calculator | 3 tabs | 120 |
| 2 | The freelance rate formula: worked example | Engine table | 250 |
| 3 | How many billable hours do you really have? | Calendar + billable % explained | 200 |
| 4 | Costs and benefits an employer would pay | Health, retirement, leave, equipment | 180 |
| 5 | Taxes: set aside an effective rate | Generic; US SE tax note (cited, dated) | 180 |
| 6 | Day rates, project pricing and retainers | Engine examples | 180 |
| 7 | How to price copywriting and content work | Hourly vs per word vs per project from your rate (no market figures) | 180 |
| 8 | Setting a consultant or SEO rate | Method + value-based pricing note | 130 |
| 9 | Freelance rate vs salary | Link Hourly to Salary | 120 |
| 10 | When and how to raise your rates | Practical, non-numeric | 100 |
| 11 | FAQ | §6 | 400 |

## 6. FAQ (11)

1. How do I calculate my freelance hourly rate?
2. What expenses should I include?
3. How many billable hours should I assume per year?
4. How much should I set aside for taxes as a freelancer? (effective rate; US SE-tax note with irs.gov link)
5. Should I charge hourly, per project or a monthly retainer?
6. How do I turn an hourly rate into a day rate?
7. How much do copywriters charge? (`how much do copywriters charge`: how to work out *your* rate; no invented market numbers)
8. Why is SEO expensive? (`why is seo expensive`: hours, skills, tools, from the engine)
9. How does a freelance rate compare to a salary?
10. Should I add VAT or sales tax to my rate? (UK/EU: usually quoted ex-VAT; check HMRC / your tax office)
11. How often should I raise my rates?

## 7. Done when

- [x] `freelance-rate-engine.ts` + tests; `wage-engine` + `us-tax-data` reused; `npm run verify` passes.
- [x] Input guide diagram above the inputs (per tab); ToolShell + TabSlider used.
- [x] No unsourced rate tables; tax figures cited with year.
- [x] Registrations + docs updated; Hourly to Salary links here; `graphify update .`.
