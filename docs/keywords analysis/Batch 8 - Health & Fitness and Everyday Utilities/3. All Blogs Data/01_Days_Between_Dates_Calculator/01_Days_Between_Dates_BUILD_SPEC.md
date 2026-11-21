# Days Between Dates Calculator — Build Spec

> **URL:** `/days-between-dates/` · Batch 8 · Tier 1 · **Build order 1** (builds the date engine, holidays and business days)
> **Read first:** `../00_BATCH8_BUILD_RULES.md` (§2 conventions, §3 § 6103 + Excel sources, §4 shared code)
> **Inputs:** `01_Days_Between_Dates_Calculator_Competitor_Analysis.md`, keyword file §2 #1
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**The exact tool terms are KD 0:** `date duration calculator` **27,100 / KD 0** (primary, rising) and `date to date calculator` 27,100 / KD 0. Around them:
- `number of days between two dates` 12,100 / KD 10; `day counter between dates` 6,600; `calculate days between dates` 5,400 (rising); `count days dates` 5,400; `calculate duration between dates` 4,400 / KD 2;
- medium: `days between two dates` 27,100 / KD 24 (rising, the real head), `how many days are there between` 27,100 / KD 16, `days between` 6,600;
- support: `count days` 18,100 / KD 26.

**Cluster: 167,000 searches,** pure date maths, no data to maintain.

**The gap:** nobody does **business days between two dates with holidays computed by rule on the same page**. Time and Date sends workdays to another tool; Calculator.net only offers business days in add/subtract mode and uses **hard-coded 2026–2027 holiday tables** that will go stale.

### Research notes from the competitor analysis

- **Pages read:** Time and Date (authority), Calculator.net, Omni, GIGAcalculator, DQYDJ.
- **Time and Date:** include-end checkbox, optional times and time zones, URL parameters; ~100 words; title and H1 don't match; **workdays on a separate page**.
- **Calculator.net:** the most complete page (between + add/subtract, include end, 13 US holidays + custom) but business days only in add mode; **static 2026–27 holiday tables**; no FAQ.
- **Omni:** examples correct (Sep 5, 1970 → Jun 5, 2022 = 18,901 days ✔; Jul 4 → Jul 26 = 22, or 23 inclusive ✔) but its manual method uses 365.25-day averages (approximate).
- **GIGA:** 84 / 85 days for Jun 23 → Sep 15, 2026 ✔; its "until/since" tables are **dated Nov 2026** and will go stale.
- **DQYDJ:** always excludes the end date; Feb 28 → Mar 1 = 2 days in 2016, 1 in 2017 ✔; grammar slip ("1 days").
- **0 of 5** have business days between dates with rule-based holidays, or ISO week numbers.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | date duration calculator | 27,100 | 0 | first sentence, ToolShell heading, H2 "How the date duration calculator counts" |
| Head (not in exports) | days between dates calculator | — | — | title, H1 (`TODO(owner)`: pull volume) |
| Secondary | date to date calculator | 27,100 | 0 | intro sentence, input labels ("From date / To date") |
| Secondary | number of days between two dates · days between two dates · how many days are there between · days between | 12,100 · 27,100 · 27,100 · 6,600 | 10–24 | H1 ("Days Between Two Dates"), H2 "How many days are there between two dates?" + FAQ 1 |
| Secondary | day counter between dates · count days dates · count days | 6,600 · 5,400 · 18,100 | 13–26 | result label "Day count", meta wording |
| Secondary | calculate days between dates · calculate duration between dates | 5,400 · 4,400 | 2–12 | H2 "Calculate days between dates by hand or in Excel" |

## 2. Our edge

- **Every unit on one page:** total days (end date excluded or included), weeks + days, months + days, years + months + days (month-stepping, rules §2.4), total hours and minutes (days × 24, labelled "for whole days").
- **Business days between the two dates,** with **US federal holidays computed by rule** (5 U.S.C. § 6103) and observed-day shifts, plus custom holidays; the holidays that fell in the range are listed.
- **ISO week and day of the year** for both dates.
- **Reversed dates handled** ("To" earlier than "From" → the same count, labelled "earlier").
- **Share URL** with every setting.
- **Excel and Google Sheets equivalents** from the verified docs (`=B1-A1`, `DATEDIF` with the "MD" warning, `NETWORKDAYS`).
- **Nothing goes stale:** no dated tables; examples use fixed dates.

## 3. Calculator spec

### 3.1 Tabs

1. **Days between** (default)
2. **Business days** (weekdays, holidays)
3. **Breakdown** (Y/M/D, weeks, hours, ISO week, day of year)

### 3.2 Input guide diagram (above the inputs)

`DaysBetweenInputGuide.tsx`: a horizontal timeline with two calendar cards.

- Left card "1 From date" (e.g. Nov 22, 2026), right card "2 To date" (Jul 4, 2027).
- A bracket between them: "224 days".
- A small flag on the right card: "3 Include end date (+1)".
- **Business tab:** the timeline shades weekends grey and marks holidays with dots, callout "4 Skip weekends & holidays"; a legend "US federal holidays (by rule)".
- **Breakdown tab:** the bracket splits into "7 months" + "12 days".
- Live values from the inputs; the focused field highlights.

### 3.3 Inputs

| Field | Default |
|---|---|
| From date | today (client) |
| To date | today + 30 days (client) |
| Include end date | off |
| Business days: skip weekends | on (in the Business tab) |
| Holidays | US federal (observed) on; custom dates (add/remove) |
| Count the start/end date in business days | both counted (NETWORKDAYS-style; explained) |

### 3.4 Engine (shared: `date-diff-engine.ts`, `holidays-us.ts`, `business-days.ts`)

```ts
days = dayNumber(to) - dayNumber(from) ; if includeEnd: days += sign(days) || 1 ; earlier = days < 0 → abs + label
weeks = floor(|days| / 7), rem = |days| % 7
ymd = ymdDiff(min, max)                         // month-stepping, rules §2.4
businessDaysBetween(from, to, {holidays: observed federal ∪ custom}) // inclusive of both ends when weekdays
holidaysInRange → list with names, actual date, observed date
isoWeek, dayOfYear for both dates
```

**Worked examples (checked with node, 2026-11-22):**

| Input | Result |
|---|---|
| **2026-11-22 → 2027-07-04** | **224 days** · 32 weeks 0 days · **7 months 12 days** · 225 with end date |
| 1970-09-05 → 2022-06-05 | **18,901 days** (Omni ✔) · 51 years 9 months 0 days |
| 2026-07-04 → 2026-07-26 | 22 days · **23** with end date (Omni ✔) |
| 2026-06-23 → 2026-09-15 | 84 days · 85 with end date (GIGA ✔) |
| 2016-02-28 → 2016-03-01 / 2017-02-28 → 2017-03-01 | **2 / 1** (leap year; DQYDJ ✔) |
| 2026-01-31 → 2026-03-01 | 29 days · **1 month 1 day** (not "0 months −2 days") |
| Business days 2026-11-22 → 2027-07-04 | **160** weekdays · **153** after 7 observed holidays (Thanksgiving, Christmas, New Year, MLK, Washington, Memorial, Juneteenth observed Jun 18) |
| Business days 2026-11-23 → 2026-12-04 | **10** weekdays · **9** after Thanksgiving (Nov 26) |
| Business days 2026-01-01 → 2026-12-31 | **261** weekdays · **250** after the 11 observed federal holidays |
| NETWORKDAYS check 2012-10-01 → 2013-03-01 | **110** (Microsoft's example ✔) |
| Reversed: 2027-07-04 → 2026-11-22 | 224 days, labelled "To is earlier than From" |
| ISO week 2026-11-22 / 2026-12-31 | 2026-W47 / 2026-W53 |

### 3.5 Outputs

- **Headline:** "224 days" (big), with "225 including the end date" under it.
- **Sentence:** "From Sunday, November 22, 2026 to Sunday, July 4, 2027 is 224 days (32 weeks), or 7 months and 12 days."
- Breakdown cards: weeks + days; Y/M/D; total hours/minutes; ISO week + day of year for both dates.
- **Business tab:** "153 business days (160 weekdays, minus 7 federal holidays)" for the default example, + the list of holidays in the range (name, date, observed date) + custom holidays.
- Copy result, Share URL (`?from=…&to=…&incl=1&tab=business`).
- Links: "Add days to a date" → #2; "Count down to a date" → #3; "Hours between times" → #4; Age Difference (Batch 5).

### 3.6 Tests

- All worked examples; leap years (2024-02-29), century rules (1900 not leap, 2000 leap); reversed dates; include-end with 0-day spans.
- Month-stepping Y/M/D on month-end starts (Jan 31, Mar 31, Aug 31) and Feb 29.
- Federal holiday rules 1990–2100 (every rule, observed shifts, the 2028 New Year → 2027-12-31 case); custom holidays on weekends are ignored.
- Business days: inclusive ends, ranges that start/end on weekends or holidays.
- ISO week edges (Dec 29 – Jan 3) for 2020–2030.
- Engine never uses local-time `Date` methods (lint/test); server render shows no dates.
- Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Days Between Dates Calculator – Count Days` (42; 54 with the suffix: OK) |
| Meta | `Free days between dates calculator. Count the days, weeks, months and years between two dates, with or without the end date, weekends or holidays.` (146) |
| H1 | `Days Between Dates: Count Days, Weeks and Months Between Two Dates` |
| BLUF | "Pick two dates and the date duration calculator counts the days between them, with or without the end date, plus weeks, months and years. Switch to business days to skip weekends and US federal holidays. For example, November 22, 2026 to July 4, 2027 is 224 days, or 7 months and 12 days." (engine) |
| ToolShell pills | `Days, weeks, months & years`, `Business days with US holidays`, `Include or exclude end date`, `Shareable link` |
| Links out | Days From Today (#2), Days Until (#3), Time Duration (#4), Age Difference (Batch 5 #2, when live) |
| Links in | #2, #3, #4, #30 (later), Tools hub "Date & Time" |

## 5. Content (~1,200–1,500 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the date duration calculator | 3 tabs, share link | 110 |
| 2 | How many days are there between two dates? | The 224-day example, the end-date rule, the +1 explained | 150 |
| 3 | How the date duration calculator counts | Date-only maths, leap years (DQYDJ-style Feb 28 → Mar 1 example in our words), reversed dates | 150 |
| 4 | Business days between two dates | Weekends, both ends counted (like NETWORKDAYS), the 2026 total (250) | 150 |
| 5 | US federal holidays and observed days | The 11 holidays by rule (§ 6103), Sat → Fri, Sun → Mon, the 2028 New Year case; custom holidays | 170 |
| 6 | Weeks, months and years between dates | Month-stepping in plain words; Jan 31 → Mar 1 = 1 month 1 day | 130 |
| 7 | Calculate days between dates by hand or in Excel | `=B1-A1`; `=DATEDIF(A1,B1,"y")` etc. (Microsoft warns against "MD"); `=NETWORKDAYS(A1,B1,holidays)`; Google Sheets same | 150 |
| 8 | FAQ | §6 | 330 |

## 6. FAQ (10, from the competitor question bank + cluster keywords)

1. How many days are there between two dates?
2. Does the count include the end date?
3. How do leap years affect the count?
4. How do I calculate days between dates by hand or in Excel?
5. How many business days are between two dates?
6. Which holidays are excluded? (the 11 federal holidays; Inauguration Day only in some areas, not included)
7. How many weeks or months is that?
8. Does it matter which date I enter first?
9. What is a date duration?
10. Why does Excel's DATEDIF sometimes give odd results? (Microsoft's own "MD" warning)

## 7. Done when

- [ ] `date-diff-engine.ts` (month-stepping, shared with Batch 5), `holidays-us.ts`, `business-days.ts` + tests; `npm run verify` passes.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] No dates in the server HTML; examples use fixed dates.
- [ ] Registrations + docs + new "Date & Time" category; `graphify update .`.
- [ ] **STOP and report** (first tool of the batch).
