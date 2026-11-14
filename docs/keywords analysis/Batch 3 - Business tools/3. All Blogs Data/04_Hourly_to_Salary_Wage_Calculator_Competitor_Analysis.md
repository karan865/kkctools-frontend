# Hourly to Salary (Wage) Calculator — Competitor Analysis

> **Target page:** KKCTools `/hourly-to-salary-calculator/` (Batch 3, Tier 1 #4)
> **Primary keyword:** `wage calculator` — US 18,100 · KD 15 · CPC $1.64 (cluster 9 keywords, 52,280 US vol) · YMYL: low
> **SERP source:** ⚠ No Semrush SERP export for Batch 3. Competitors from live web search (2026-11-14) — Omni ranked first for “wage calculator”. `TODO(owner): pull Google top 10 in Semrush.`
> **Pages visited:** 2026-11-14 — 7 read (Financer returned 404 — URL changed).

---

## 0. How this was collected (read first)

- Pages: Omni wage, Calculator.net salary, Inch Calculator, GIGAcalculator, Everhour (time-tracking SaaS), Indeed (employer tool), Corporate Finance Institute. financer.com/calculator/hourly-to-salary returned 404 (`TODO: find new URL`).
- Meta and schema not readable. Word counts are estimates. Do not copy text or tables (AGENTS.md rule 8). Any wage statistic used must come from BLS / ONS / national source with date.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | omnicalculator.com/finance/wage | Giant | Wage Calculator | 700–800 |
| 2 | calculator.net/salary-calculator.html | Giant | Salary Calculator | ~2,500 |
| 3 | inchcalculator.com/hourly-to-salary-calculator/ | Giant | Hourly to Salary Calculator | ~1,200 |
| 4 | gigacalculator.com/…/hourly-to-salary-calculator.php | Large | Hourly to Salary Calculator | ~1,000 |
| 5 | everhour.com/calculators/hourly-to-salary-calculator | SaaS | Hourly to salary calculator | 1,500–1,700 |
| 6 | indeed.com/hire/hourly-to-salary-calculator-for-employers | Job site (employers) | Hourly to Salary Calculator for Employers | ~550 |
| 7 | corporatefinanceinstitute.com/…/salary-calculator… | Education | Salary Calculator | ~600 |

**What this tells us:**
- **“Wage calculator” = convert pay between periods** (hour ↔ day ↔ week ↔ biweek ↔ month ↔ year). Omni (fill any one) and Calculator.net (8 periods, unadjusted vs adjusted for holidays/vacation) are the strongest models.
- **Holidays & vacation adjustment** is the key differentiator (Calculator.net, Giga, CFI) — and Giga's maths double-counts it.
- **Take-home pay is a separate (YMYL) intent** — Everhour's tool does only gross-to-net with flat %, mismatching its H1. Keep net pay out or very clearly simplified.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Omni | Calc.net | InchCalc | Giga | Everhour | Indeed | CFI |
|---|---|---|---|---|---|---|---|
| Hourly → annual | ✅ | ✅ | ✅ | ✅ | ❌ (!) | ✅ | ✅ |
| Annual → hourly (reverse) | ✅ | ✅ | ❌ (separate page) | ❌ | ❌ | ✅ | ❌ |
| Enter any period, get all | ✅ 5 periods | ✅ 8 periods | ⚠️ hourly in only | ⚠️ | ❌ | ⚠️ | ❌ |
| Biweekly / semi-monthly / quarterly | ❌ | ✅ | ⚠️ biweekly | ❌ | ⚠️ | ❌ | ❌ |
| Hours/week & days/week editable | ✅ | ✅ | ⚠️ hours only | ✅ | ❌ | ✅ | ✅ |
| Paid holidays & vacation days | ❌ | ✅ (adjusted column) | ❌ | ✅ (maths inconsistent) | ❌ | ⚠️ weeks worked | ✅ weeks off |
| Unpaid vs paid time off distinction | ❌ | ⚠️ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Overtime (hours × 1.5 / 2) | ❌ | ❌ | ❌ | ❌ | ❌ (FAQ only) | ⚠️ rate dropdown | ❌ |
| Variable weekly hours (average) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ text |
| Raise / compare two wages | ❌ | ❌ | ⚠️ similar-wage links | ❌ | ❌ | ❌ | ❌ |
| Benchmarks (median wage, by state) | ⚠️ FAQ | ✅ text | ✅ US + state | ⚠️ hours stats | ❌ | ❌ | ❌ |
| Gross → net estimate | ❌ | ❌ | ❌ | ❌ | ⚠️ flat % | ❌ | ❌ |
| Currency / non-US | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Omni | Calc.net | InchCalc | Giga | Everhour | Indeed | CFI |
|---|---|---|---|---|---|---|---|
| Formula | ✅ | ✅ unadjusted & adjusted | ✅ | ⚠️ prose | ✅ | ✅ 2,080 | ✅ |
| Hourly → salary chart ($10–$50) | ❌ | ❌ | ✅ | ⚠️ 5 examples | ❌ | ❌ | ❌ |
| Pay frequency explained | ✅ | ✅ table | ✅ | ❌ | ✅ divisors | ❌ | ❌ |
| Federal holidays list | ❌ | ✅ 11 | ❌ | ✅ | ❌ | ❌ | ❌ |
| Gross vs net explained | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Hourly vs salaried pros/cons | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Overtime rules | ⚠️ | ⚠️ FLSA | ❌ | ❌ | ✅ | ❌ | ❌ |
| FAQ count | 4 | 0 | 5 | 0 (5 “$X an hour” H3s) | 6 | 2 | 0 |
| Named author | ✅ PhD | ❌ | ✅ + MBA | ✅ | ❌ | ❌ | ✅ |
| Date | ❌ | ⚠️ data Q3 2025 | ❌ | ✅ May 2026 | ❌ | ❌ | ⚠️ 2018 |
| Sources | ⚠️ 1 (2009 book) | ✅ BLS | ⚠️ Census (household, mismatched) | ✅ FRED, BLS ATUS | ❌ | ❌ | ❌ |

---

## 4. Competitor-by-competitor detail

### Omni — wage (giant)

- Enter hourly, daily, weekly, monthly or yearly → others fill. Working days panel (40 h/week, 5 days). Sections: weekly from annual, hourly from salary, salary from hourly, pay frequency, increase your wage.
- **FAQs (4):** annual salary at $20/hour · what wage is middle class · average American salary · how to calculate wage.
- **Weak points:** unsourced wage stats; one 2009 source; no holidays/overtime; no date.

### Calculator.net — salary (giant) — **feature model**

- Amount + unit (hour, day, week, bi-week, semi-month, month, quarter, year), hours/week, days/week, holidays/year, vacation days/year → **two columns: unadjusted vs holidays & vacation adjusted** across 8 periods.
- Content: salary vs wage, benefits, self-employed, how adjusted values are calculated (260 working days), pay frequencies, 11 US federal holidays, PTO, factors influencing salary, how to increase salary.
- **Weak points:** defaults not shown; hourly/daily inputs treated as unadjusted while others adjusted (confusing); no FAQ; US-only.

### Inch Calculator — hourly-to-salary (giant)

- Hourly rate + hours/week → annual, monthly, biweekly, weekly, daily. **Comparison panel** (US median, US average hourly, state dropdown, similar wages). Hourly-to-salary chart $10–$50.
- **FAQs (5):** appropriate salary to ask · how much to negotiate · salary vs commission · are salaries based on 40 hours · gross or net.
- **Errors:** compares to Census **household** income as “median salary”; typos.

### GIGAcalculator — hourly-to-salary (large)

- Hourly rate, hours/week, days/week, holidays, vacation → yearly, monthly, weekly, daily. 5 “$X an hour is how much a year?” examples ($15, $17, $20, $25, $30); average hours stats (FRED, BLS ATUS); before vs after tax discussion.
- **Error:** assumes 49 weeks *and* subtracts holidays/vacation (double-count); examples don't match the stated method.
- **Lesson:** the **“$X an hour is how much a year”** query format is popular — answer it with a table.

### Everhour — hourly-to-salary (SaaS)

- **Tool mismatch:** gross salary + pay period + flat federal 22% + state 5% → net pay. No hourly input. Article has correct formula ($23 × 36 × 52 = $43,056), pay-frequency divisors, overtime rule.
- **FAQs (6):** before payroll taxes? · includes overtime? · part-time 2,080 hours? · does pay frequency change annual · vacation/sick pay · timecards.

### Indeed — employers (job site)

- Two calculators: hourly → salary and salary → hourly, with hours/week, weeks worked, **overtime rate (×1.5, ×2, ×2.5)**. Formula 2,080 hours; examples $40,000 ÷ 2,080 ≈ $19.23; $15 × 2,080 = $31,200. Outputs show $0.00 placeholders; overtime unexplained.

### CFI — salary calculator (education)

- Hours/week, total annual hours, weeks off, hourly wage → annual salary. Example 37 h, 2 weeks off, $22 → $40,700. Gross vs net. 2018 article.

---

## 5. Patterns

- **Maths:** annual = hourly × hours/week × paid weeks; standard 2,080 h (40 × 52). Paid holidays/vacation **don't** reduce pay for salaried-equivalent comparison; **unpaid** time off does — most pages blur this.
- **Periods:** weekly 52 · biweekly 26 · semi-monthly 24 · monthly 12 · daily = weekly ÷ days/week.
- **Overtime:** US FLSA 1.5× over 40 h/week (state rules differ, e.g. daily OT) — explain, cite DOL.

| Section | Pages (of 7) |
|---|:---:|
| Reverse (salary → hourly) | 3 |
| All periods | 2 |
| Holidays/vacation input | 3 |
| Overtime input | 1 |
| Wage chart/table | 2 |
| FAQ | 4 |
| Non-US | **0** |

---

## 6. FAQ question bank

★ = asked on 2+ pages.

| # | Question | Seen on |
|---:|---|---|
| 1 | ★ What is $X an hour annually? ($15, $20, $25, $30…) | Omni, Giga, Indeed |
| 2 | ★ Is a salary gross or net? / before taxes? | InchCalc, Everhour |
| 3 | ★ Are salaries based on 40 hours / 2,080 hours? | InchCalc, Everhour, Indeed |
| 4 | How do I convert salary to hourly? | Omni, Indeed |
| 5 | Does the salary equivalent include overtime? | Everhour |
| 6 | Should vacation and holidays be included? | Everhour, Calc.net |
| 7 | Does pay frequency change annual pay? | Everhour |
| 8 | What's the average / median wage? | Omni, InchCalc |
| 9 | What wage is middle class? | Omni |
| 10 | How much should I ask for / negotiate? | InchCalc |
| 11 | How many working hours are in a year? | Giga, Calc.net |
| 12 | How much is biweekly pay / how many paychecks a year? | — |

---

## 7. Gaps nobody fills — our opportunities

1. **Enter any period → all 8 periods**, both directions (Omni + Calc.net combined).
2. **Paid vs unpaid time off** handled correctly (and explained) — Giga gets it wrong, Calc.net confuses.
3. **Overtime:** regular hours + OT hours × rate.
4. **Variable schedules:** average of several weeks or hours per day pattern.
5. **Compare two jobs / a raise:** hourly vs salaried offer, % raise (link Percentage Change).
6. **Wage table** “$10–$100/hour → yearly, monthly, biweekly, weekly” generated by engine.
7. **Non-US mode:** currency + typical hours (e.g., 37.5 h UK, 38 h AU) — 0 competitors.
8. **Gross only, clearly labelled** — link out to official take-home tools; no tax maths (YMYL caution).
9. **Benchmarks only from a dated BLS/ONS source** (or none).
10. **Copy/share; no sign-up.**

---

## 8. Blueprint for the KKCTools Hourly to Salary Calculator

### 8.1 SEO

- **URL:** `/hourly-to-salary-calculator/`
- **Title/H1/Meta:** use the keyword file's drafts (Batch 3 §4); include “wage calculator” in the H1 or first sentence.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Input | amount + period (hour, day, week, biweek, semi-month, month, quarter, year) |
| Schedule | hours/day or hours/week, days/week, paid weeks; paid holidays & vacation; unpaid days off |
| Overtime | OT hours per week, OT multiplier |
| Outputs | all periods, gross; “annual working hours” shown |
| Compare | second wage/job; raise % |
| Locale | currency, default hours presets by country |
| UX | copy, share URL, print table, no network |

### 8.3 Content outline (≈ 1,400–1,800 words, original)

1. Intro (primary keyword)
2. How to use
3. Hourly to salary formula + examples (full-time, part-time)
4. Salary to hourly
5. Paid vs unpaid time off — how it changes the result
6. Overtime
7. Pay frequencies (weekly, biweekly, semi-monthly, monthly)
8. Hourly wage → salary table (engine)
9. Gross vs take-home pay (brief, no tax maths; link official resources)
10. FAQ (8–10)
11. Related tools — Freelance Rate (#15), Labor Cost (#18), Percentage Change, Days Between Dates (Batch 8), Time to Decimal (Batch 8)

### 8.4 Quality checks

- Unit tests for every period conversion, time-off and overtime case, and table rows.
- Statistics only with source + date.
- No competitor wording copied. `npm run check:no-network` passes.
- `TODO(owner): pull Google top-10 SERP for wage calculator; find Financer's new URL.`
