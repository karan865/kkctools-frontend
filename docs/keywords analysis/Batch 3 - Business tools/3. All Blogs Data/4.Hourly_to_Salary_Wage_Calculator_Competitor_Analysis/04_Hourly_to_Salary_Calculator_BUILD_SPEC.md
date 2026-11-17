# Hourly to Salary Calculator — Build Spec

> **URL:** `/hourly-to-salary-calculator/` · Batch 3 · **Build order 4**
> **Read first:** `../00_BATCH3_BUILD_RULES.md`
> **Inputs used:** `04_Hourly_to_Salary_Wage_Calculator_Competitor_Analysis.md` (7 pages, 2026-11-14), `KKCTools_Batch3_Final_Tool_Keywords.md` §1 + §2b (Semrush SERP 2026-11-16), Semrush exports in `1. All Keywords from Semrush/`
> **Written:** 2026-11-18

---

## 0. Strategy note (important)

The SERP check (§2b) removed `wage calculator` (18.1K) because Google reads it as a **take-home paycheck** query: ADP, SmartAsset, PaycheckCity and Gusto rank there, and they need tax tables. **We don't target it as the primary, and we don't build tax maths** (YMYL, yearly updates).

Instead, we target the **gross pay conversion** intent, where the Semrush exports show low-KD terms (below). Keep "wage calculator" only as a natural phrase in the content.

## 1. Keywords

| Role | Keyword | US vol | KD |
|---|---|---:|---:|
| **Primary** | yearly wage calculator | 6,600 | **0** |
| Secondary | calculate annual salary | 6,600 | 10 |
| Secondary | monthly gross income calculator | 3,600 | 9 |
| Secondary | how to calculate annual income biweekly | 1,300 | **0** |
| Secondary (harder) | hourly salary calculator | 12,100 | 28 |
| Natural mention only | wage calculator | 18,100 | 15 (paycheck intent; don't promise take-home pay) |

**Long tail from the FAQ bank:**
- "$X an hour is how much a year" ($15, $17, $20, $25, $30…), covered by an engine table;
- "how many working hours in a year";
- "how many paychecks in a year".

**Skip:** every state "paycheck calculator" or "salary calculator <state>" term. Those are tax tools.

## 2. Our edge

- **Enter any period → all 8 periods**, both directions: hour, day, week, biweek, semi-month, month, quarter, year. Omni has 5 periods; Calculator.net has 8 but confusing defaults.
- **Paid vs unpaid time off handled correctly.** GIGAcalculator double-counts it; Calculator.net blurs it.
- **Overtime** (regular + OT hours × multiplier). Only Indeed has it, and it is unexplained.
- **Variable schedules** (hours per day pattern or several weeks averaged): 0 competitors.
- **Compare two jobs / a raise %**: 0 competitors.
- **Non-US hours presets and currency**: 0 competitors.
- **Gross only, clearly labelled.** Link to official take-home tools; never estimate tax.

## 3. Calculator spec

### 3.1 Inputs

- **Amount + period** (hour / day / week / biweek / semi-month / month / quarter / year). Default: $25 per hour.
- **Schedule:**
  - hours per week (default 40), or a "different hours each day" pattern (Mon–Sun);
  - days per week (default 5);
  - weeks per year (default 52).
- **Time off:**
  - **paid** holidays + paid vacation days: the default salaried view counts them as paid, so annual pay doesn't change; they only change "pay per hour actually worked";
  - **unpaid** days off: these reduce annual pay.
- **Overtime:** OT hours per week + multiplier (1.5× default, 2× option). Note: US federal rule is 1.5× over 40 h/week (FLSA, cite dol.gov), some states have daily OT, and other countries have different rules.
- **Country preset** (sets default hours and currency only, no tax): US 40 h, UK 37.5 h, AU 38 h, CA 40 h, IN 48 h. All defaults editable. Show the source of any "standard hours" claim, or label them as "common default, edit to match your contract".
- **Compare** (toggle): a second job (amount + period + hours), or a raise % on the current wage (uses percent-engine).

### 3.2 Engine (`wage-engine.ts`, pure)

```ts
paidHoursPerYear = hoursPerWeek * weeksPerYear - unpaidDays * hoursPerDay
annualRegular    = hourly * paidHoursPerYear
annualOT         = otHoursPerWeek * hourly * otMultiplier * (weeksPerYear - unpaidWeeksEquivalent)
annual           = annualRegular + annualOT
// periods from annual
week = annual / weeksPerYear ; biweek = annual / 26 ; semiMonth = annual / 24
month = annual / 12 ; quarter = annual / 4 ; day = week / daysPerWeek ; hour = annual / paidHoursPerYear (excl. OT)
// reverse: any input period -> annual first, then all periods
effectiveHourlyWorked = annual / (paidHoursPerYear - paidHolidayHours - paidVacationHours)   // "per hour actually worked"
```

**Table generator:** $10–$100 per hour (steps of 1 to $30, then 5) → yearly, monthly, biweekly, weekly at 40 h × 52 weeks. Covers the "$X an hour is how much a year" queries. Each row is linkable: `#hourly-25`.

### 3.3 Outputs

- Big number: **yearly gross**, then all 8 periods in a table. The input period is highlighted.
- Plain sentence: "$25 an hour at 40 hours a week is $52,000 a year before tax, about $4,333 a month or $2,000 every two weeks."
- "Working hours used: 2,080 a year." Show the working.
- Time-off panel: annual pay and "pay per hour actually worked" side by side.
- Compare: difference per year/month and % difference.
- Label every result **"gross (before tax)"**, and link to the official IRS Tax Withholding Estimator and GOV.UK income tax pages for take-home pay.
- Copy, Share URL, Print.

### 3.4 Tests

- $25 × 40 × 52 = $52,000. Reverse: $52,000 ÷ 2,080 = $25.
- Biweekly = annual ÷ 26, semi-monthly = annual ÷ 24 (they differ, and the test shows it).
- Paid time off doesn't change annual pay. Unpaid days reduce it by days × hours/day × rate.
- OT: 5 h × 1.5 × $20 × 52 weeks added correctly.
- Variable daily pattern sums correctly.
- Every period → annual → every period round-trips.
- Table rows and FAQ numbers equal the engine output (snapshot).
- Zero hours returns `null` for hourly, not Infinity.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Hourly to Salary Calculator – Yearly Wage & Monthly Pay` (55; use `absoluteTitle`) |
| Meta | `Free yearly wage calculator. Convert hourly pay to annual, monthly, biweekly and weekly salary (or back), with overtime and unpaid time off, before tax.` (151) |
| H1 | `Hourly to Salary Calculator (Yearly Wage Calculator)` |
| BLUF | "To turn an hourly wage into a yearly salary, multiply it by the hours you work a week and then by 52. At 40 hours a week that is hourly × 2,080, so $25 an hour is $52,000 a year before tax." Engine-computed. |
| Links out | Percentage Change (raise %), Freelance Rate (when built), Labor Cost (when built), Days Between Dates and Time to Decimal (Batch 8, when built) |
| Links in | Percentage Change, Construction Estimate Template (labour context), Tools hub |

## 5. Content (~1,600–1,900 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the hourly to salary calculator | 4 steps | 120 |
| 2 | How to calculate annual salary from hourly pay | Formula, full-time and part-time engine examples | 250 |
| 3 | Salary to hourly: the reverse | Engine example | 150 |
| 4 | How many working hours are in a year? | 2,080 explained; 37.5 h and 38 h weeks | 150 |
| 5 | Paid vs unpaid time off | The mistake competitors make, shown with engine numbers | 200 |
| 6 | Overtime pay | 1.5× rule (dol.gov link), engine example | 150 |
| 7 | Weekly, biweekly, semi-monthly and monthly pay | 52 vs 26 vs 24 vs 12 paychecks; "how to calculate annual income biweekly" | 200 |
| 8 | Hourly wage to salary table ($10–$100) | Engine table | (table) |
| 9 | Gross pay vs take-home pay | Brief, no tax maths, links to official tools | 120 |
| 10 | Monthly gross income | For rent/loan applications (`monthly gross income calculator`) | 120 |
| 11 | FAQ | §6 | 400 |

**Wage statistics** (median wage etc.): only from BLS (bls.gov) or ONS with year and link, or leave them out.

## 6. FAQ (11)

1. How much is $20 an hour a year? (plus $15, $25 and $30 from the table)
2. How do I calculate my annual salary from hourly pay? (`calculate annual salary`)
3. How do I convert my salary to an hourly rate?
4. How many working hours are in a year?
5. How do I calculate annual income from biweekly pay?
6. What's the difference between biweekly and semi-monthly pay?
7. Does this include overtime?
8. Should I include paid holidays and vacation?
9. Is the result before or after tax? (gross; link official tools)
10. How do I work out my monthly gross income?
11. How do I compare an hourly job with a salaried offer?

## 7. Done when

- [ ] `npm run verify` passes; `wage-engine` tests cover §3.4.
- [ ] Every result is labelled gross; no tax estimates anywhere.
- [ ] Statistics and legal rules (FLSA) linked to official sources or removed.
- [ ] Mobile 390 px: the periods table fits or scrolls inside its box.
- [ ] Routes, catalog (`business`), hub, internal links, docs updated.
