# Days Between Dates Calculator — Competitor Analysis

> **Target page:** KKCTools `/days-between-dates/` (Batch 8, Tool #1 ✅)
> **Primary keyword:** `date duration calculator`: US 27,100 · **KD 0**. Cluster of 11 keywords, 167,000 US searches. Includes `date to date calculator` (27,100, KD 0) and `days between two dates` (27,100, KD 24).
> **SERP source:** ⚠ There is no Semrush SERP export for Batch 8. Competitors come from a live web search for `days between dates calculator date duration` (2026-11-14) plus the known leaders, Time and Date and Calculator.net. `TODO(owner): pull Google top 10.`
> **Pages visited (2026-11-14):** 5 read: Time and Date, Calculator.net, Omni, GIGAcalculator, DQYDJ.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Time and Date, the category authority
  - Calculator.net, Omni, GIGA, Inch, DQYDJ, Calculate.co.nz
  - TrumpExcel and Spreadsheet Planet (Excel brands)
  - 101 Planners, Rows, and clone sites
- **Keyword-file rules:**
  - The **same date engine** powers tools #1–#4.
  - **Holidays are computed by rule in code** (e.g., Thanksgiving is the 4th Thursday of November). They are never typed in year by year.
  - The page needs a shareable URL.
- **Main gap:**
  - Time and Date sends business days to a separate tool.
  - Calculator.net offers business days only in its add/subtract mode, and its US holiday tables are **hard-coded for 2026–2027**.
  - Nobody computes **business days between two dates, with holidays calculated by rule, on one page**.
- Arithmetic was re-checked. All examples are correct, but Omni's manual method uses 365.25-day averages, which is approximate.
- No competitor text was copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | timeanddate.com/date/duration.html | Category authority | Days Calculator: Days Between Two Dates | ~100 core |
| 2 | calculator.net/date-calculator.html | Calc giant | Date Calculator | ~900 |
| 3 | omnicalculator.com/everyday-life/days-between-dates | Giant | Days Between Dates Calculator | 600–700 |
| 4 | gigacalculator.com/calculators/days-between-dates-calculator.php | Calc site | Days Calculator | ~1,000 |
| 5 | dqydj.com/days-between-dates-calculator/ | Calc site | Days Calculator: See the Day Difference Between Two Dates | ~450 |

**What this tells us:**
- **Time and Date** has the authority, the include-end-date checkbox, optional time fields and time-zone add-ons, and URL parameters. It has almost no content (about 100 words), and **workdays live on a separate page**.
- **Calculator.net** is the most complete single page:
  - two modes: days between, and add/subtract
  - an include-end option
  - **business days with holidays** (13 US holidays plus custom ones), but **only in add/subtract mode**
  - Gregorian history and **static 2026–2027 holiday tables**
- **GIGA** offers between and add modes and an include-last-day toggle, with examples that check out (84/85 days). Its "days until/since" tables are **static as of Nov 2026** and will go stale.
- **Omni and DQYDJ** are simple between-dates tools. Neither has business days.
- **No competitor offers all of these:**
  - one page with **days, weeks + days, months + days, and years**
  - include or exclude the end date
  - **business days with holidays computed by rule** (US federal, plus custom)
  - a share URL
  - an explanation of the counting convention
  - ISO week numbers
  - correct, worked examples

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Time and Date | Calculator.net | Omni | GIGA | DQYDJ |
|---|---|---|---|---|---|
| Start/end date | ✅ (+ Today button) | ✅ | ✅ | ✅ | ✅ |
| Include end date toggle | ✅ | ✅ | ⚠️ (described) | ✅ | ❌ (always excludes) |
| Days total | ✅ | ✅ | ✅ | ✅ | ✅ |
| Weeks + days / months + days / years | ✅ | ✅ | ✅ (unit switch) | ✅ | ⚠️ (years + days) |
| Hours/minutes/seconds | ⚠️ (other tool) | ❌ | ✅ | ❌ | ❌ |
| **Business days between dates** | ❌ (separate tool) | ❌ (add mode only) | ❌ | ❌ (separate tool) | ❌ |
| Holidays (by rule, not typed in) | ⚠️ (separate tool) | ⚠️ (13 US, fixed tables 2026–27) | ❌ | ❌ | ❌ |
| Custom holidays | ? | ✅ | ❌ | ❌ | ❌ |
| Add/subtract mode | ⚠️ (separate tool) | ✅ | ❌ | ✅ | ❌ |
| Times + time zones | ✅ (add-ons) | ❌ | ❌ | ❌ | ❌ |
| Shareable URL | ✅ (query parameters) | ? | ✅ (share) | ? | ❌ |
| Reverse order handled | ? | ? | ? | ? | ✅ |
| ISO week number | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Time and Date | Calculator.net | Omni | GIGA | DQYDJ |
|---|---|---|---|---|---|
| Counting convention explained | ⚠️ ("1 day is added") | ⚠️ | ✅ (tip) | ✅ (example) | ✅ |
| Leap years explained | ❌ | ⚠️ (history) | ⚠️ (365.25 method) | ⚠️ | ✅ (Feb 28 → Mar 1 examples) |
| Worked examples (checked) | ❌ | ❌ | ✅ (18,901; 22/23) | ✅ (84/85; tables) | ✅ (2/1; 1,449) |
| Static date content that goes stale | — | holiday tables 2026–27 | — | "until/since" tables (Nov 2026) | — |
| FAQ count | 0 | 0 | 2 | 0 | 3 (subsections) |
| Named author | ❌ | ❌ | ✅ + reviewer | ✅ | ✅ |
| Date | ❌ | ❌ | ❌ | ✅ (Oct 2026) | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. Time and Date — Days Between Two Dates (authority)
- **Inputs:** start and end dates as D/M/Y, a Today button, and an include-end option.
- **Add-ons:** time fields and time-zone conversion.
- **Links:** to Workdays and Count Days tools.
- **Weak points:**
  - The title and H1 don't match.
  - About 100 words of content.
  - Business days and holidays are on another page.
  - Promotions.
  - No FAQ.

### 2. Calculator.net — Date Calculator
- **Modes:**
  - Days between: years, months, weeks and days, with an include-end option.
  - Add/subtract: includes business days (weekends only, or weekends plus holidays).
- **Holidays:** 13 US holidays plus custom ones.
- **Content:** Gregorian history, and US federal holiday tables for 2026 and 2027 (static).
- **Weak points:**
  - No business days in between-dates mode.
  - Holiday options are unclear.
  - Repetitive custom-holiday form.
  - No FAQ, author or date.

### 3. Omni — Days Between Dates (Adena Benn; reviewer Rijk de Wet)
- **Inputs and outputs:** From/To dates; time between in any unit; share.
- **Examples:**
  - Sep 5, 1970 → Jun 5, 2022 = 18,901 days ✔
  - Jul 4 → Jul 26 = 22 days, or 23 inclusive ✔
- **FAQs (2).**
- **Weak points:**
  - The manual method uses average year and month lengths.
  - The include-end checkbox isn't clearly shown.
  - No business days.
  - No date.

### 4. GIGAcalculator — Days Calculator (Georgi Georgiev, Oct 2026)
- **Modes:** between, and add (negative values subtract). Include-last-day option.
- **Example:** Jun 23 → Sep 15, 2026 = 84 days, or 85 including the last day ✔. Its "until/since" tables are ✔ but **dated to Nov 2026**.
- **Weak points:**
  - Business days only on another page.
  - Output layout not shown.
  - Two of its three references are never cited.
  - US-centric examples.

### 5. DQYDJ — Days Calculator (PK)
- **Inputs and outputs:** first and second date. Results as "years + days" and total days. Always excludes the end date.
- **Examples:**
  - Feb 28 → Mar 1, 2016 = 2 days; 2017 = 1 day ✔
  - Monroe/Madonna overlap = 1,449 days ✔
- **Weak points:**
  - The title and H1 don't match.
  - No business days.
  - Grammar slip ("1 days").

---

## 5. Patterns

**Shared date engine (for tools #1–#4)**
- Work with **calendar dates only**, as UTC dates or a Julian Day Number, so there are no DST or time-zone shifts.
- Days = JDN(end) − JDN(start), plus 1 when the end date is included.

**Breakdown**
- Calendar-aware Y/M/D using the borrow rule (shared with Age Difference, Batch 5 #2).
- Also show weeks + days and total units (hours and minutes as × 24 for date-only input).

**Business days**
- Count weekdays between the two dates. Show whether the start and end dates are counted.
- Subtract holidays that fall on weekdays.
- Optional: handle observed holidays (Sat → Fri, Sun → Mon, per OPM rules).
- `TODO(owner)`: cite the OPM federal holiday rules.

**US federal holidays, computed by rule**
- New Year (Jan 1)
- MLK Day (3rd Monday of January)
- Presidents' Day (3rd Monday of February)
- Memorial Day (last Monday of May)
- Juneteenth (Jun 19)
- Independence Day (Jul 4)
- Labor Day (1st Monday of September)
- Columbus Day (2nd Monday of October)
- Veterans Day (Nov 11)
- Thanksgiving (4th Thursday of November)
- Christmas (Dec 25)
- Plus a custom holiday list.
- `TODO(owner)`: confirm the list against 5 U.S.C. §6103, and decide whether to add other countries.

**Other features**
- ISO week number and day of the year for both dates.
- Share URL: `?start=YYYY-MM-DD&end=YYYY-MM-DD&incl=1&biz=1`.
- Static export: the page renders a default view and computes on the client.

**What the competitors cover (of 5)**

| Section | Pages (of 5) |
|---|:---:|
| Include end toggle | 4 |
| Breakdown units | 5 |
| Business days (between) | **0** |
| Rule-based holidays | **0** (Calc.net uses static tables) |
| Share URL | 2 |
| ISO week | **0** |

---

## 6. FAQ question bank

★ = asked on 2+ pages or a cluster keyword. Map to the 11-keyword cluster.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How many days are there between two dates? | all · `how many days are there between`, `number of days between two dates` |
| 2 | ★ Does the count include the end date? | Time and Date, Calc.net, GIGA, DQYDJ |
| 3 | ★ How do leap years affect the count? | DQYDJ, Omni |
| 4 | ★ How do I calculate days between dates by hand or in Excel? | Omni, TrumpExcel (SERP) · `calculate days between dates` |
| 5 | How many business days are between two dates? | Calc.net (add mode) |
| 6 | Which holidays are excluded? | Calc.net |
| 7 | How many weeks or months is that? | all |
| 8 | Does it matter which date I enter first? | DQYDJ |
| 9 | What is a date duration? | `date duration calculator` |
| 10 | Excel: DATEDIF / NETWORKDAYS formulas | SERP (Excel brands) |

---

## 7. Gaps nobody fills — our opportunities

1. **One page, everything:**
   - days (with or without the end date)
   - weeks + days, months + days, Y/M/D
   - hours and minutes
   - business days, **with holidays computed by rule** (US federal, observed rules, custom)
2. **Date-only maths**, so no time-zone or DST errors.
3. **Share URL** with every setting encoded.
4. **ISO week and day of the year** for both dates.
5. **An explanation of counting conventions**, with leap-year examples written by us.
6. **Excel and Google Sheets equivalents** (`=B1-A1`, `DATEDIF`, `NETWORKDAYS`), verified.
7. **No stale static tables.** Anything date-relative is computed on the client.
8. **Links:** Days From Today (#2), Days Until (#3), Time Duration (#4), Age Difference (Batch 5 #2).

---

## 8. Blueprint for the KKCTools Days Between Dates Calculator

### 8.1 SEO

- **URL:** `/days-between-dates/`
- **Title:** Days Between Dates Calculator – Count Days
- **H1:** Days Between Dates: Count Days, Weeks and Months Between Two Dates
- **Meta:** as in the keyword file (146 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Inputs | Start, end (date pickers + typed), include end toggle |
| Outputs | Days, weeks+days, months+days, Y/M/D, hours/minutes, ISO week, day of year |
| Business | Skip weekends; US federal holidays by rule (+ observed); custom holidays |
| Share | URL params; copy result |
| Engine | Shared date module (#1–#4), date-only UTC |
| UX | No network; static default + client compute |

### 8.3 Content outline (≈ 1,000–1,300 words, original)

1. Intro (primary keyword)
2. How to use
3. How days between dates are counted (end-date rule, leap years)
4. Business days and holidays (how holidays are computed)
5. Weeks, months and years between dates
6. Doing it in Excel or Google Sheets
7. FAQ (10)
8. Related tools: Days From Today (#2), Days Until (#3), Time Duration (#4), Age Difference (Batch 5 #2)

### 8.4 Quality checks

- **Unit tests:**
  - leap years (Feb 29), century rules (1900, 2000)
  - reversed dates
  - include-end
  - business days across holidays and observed shifts
  - holiday rules for 1990–2100 against a reference list (`TODO(owner)`: OPM data as fixtures)
  - DST-proof (dates only)
- No competitor wording. `npm run check:no-network` passes.
- `TODO(owner)`: pull Google top 10; confirm the holiday list and observed rules; decide on non-US holidays.
