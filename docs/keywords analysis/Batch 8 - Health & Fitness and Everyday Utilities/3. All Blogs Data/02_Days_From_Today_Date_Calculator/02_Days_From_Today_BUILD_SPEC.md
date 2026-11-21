# Days From Today Calculator (Add or Subtract Days) — Build Spec

> **URL:** `/days-from-today/` · Batch 8 · Tier 1 · **Build order 2**
> **Read first:** `../00_BATCH8_BUILD_RULES.md` (§1 no per-number URLs, §2 conventions + month clamp, §4 `LiveDateTable`, `ics`)
> **Inputs:** `02_Days_From_Today_Date_Calculator_Competitor_Analysis.md`, keyword file §2 #2, CSVs `6.` / `6.2`
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**The biggest cluster in Batch 8:** 73 keywords, ≈ 1.74 million US searches:
- 61 "X days / weeks / months from today / from now" phrases ≈ 1.59M — e.g. `90 days from today` **246,000**, `45 days from today` 135,000, `28 days from today` 110,000, `10 days from today` 60,500, `30 days from now` 49,500, `120 days from today` 49,500 / KD 12, `45 days from now` 40,500, `20 days from today` 27,100, `what is 45 days from today` **22,200 / KD 5** (primary), `50 days from today` 18,100, `14 weeks from today` 12,100, `22 weeks from today` 5,400;
- 11 "X ago" phrases ≈ 128,000 — `90 days ago` 33,100, `30 days ago` 14,800, `60 days ago`, `45 days ago`, `now - 30 days`, `what day was 90 days ago`.

**The SERP is per-number pages** (Inch, Symbolab clones, daysbetweencalculator.org, timecal.net) plus hijacked-domain spam. **Our rule: one page, never one URL per number** (thin/doorway content). We win the click with what a fixed page and Google's answer box can't do: any start date, weeks/months/years, business days with holidays, a live table, and a calendar file.

**The trap competitors fall into:** they write "today = November 14, 2026" into the HTML, so the answer is wrong the next day. Our dates are computed in the browser after load.

`TODO(owner)`: watch rankings vs the per-number pages after launch; the one-page rule stands unless you change it.

### Research notes from the competitor analysis

- **Pages read:** Inch /days-from/ (hub) and /45-days-from-today/ (per-number), Time and Date date-add, Symbolab 45-days page, daysbetweencalculator.org 45-days page.
- **Inch per-number:** 45 days from Nov 14, 2026 = Tue Dec 29, 2026 ✔; 45 weekdays → Fri Jan 15, 2027 ✔ (holidays not excluded); **"today" hard-coded**; a garbled sentence; near-duplicate sibling pages.
- **Time and Date date-add:** the most flexible (years/months/weeks/days, add or subtract) but business days live on separate tools; ~200 words.
- **Symbolab:** correct working but a **static date**, templated thin content, UI text leaking into the page.
- **daysbetweencalculator.org:** **2025-locked examples**, and an FAQ promising business days the tool doesn't offer.
- **0 of 5** explain the month-end rule (Jan 31 + 1 month), offer a live table or a calendar file.
- Our node check: 45 weekdays from Nov 14, 2026 **with** federal holidays (Thanksgiving, Christmas, New Year) = **Thu Jan 21, 2027** (Inch's Jan 15 ignores holidays).

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | what is 45 days from today | 22,200 | 5 | H2 "What is 45 days from today?" (live answer + fixed example), FAQ 1 |
| Head (not in exports) | days from today calculator · date calculator | — | — | title, H1, ToolShell heading (`TODO(owner)`: pull volumes) |
| Long tail (one table) | 90 / 45 / 28 / 10 / 20 / 50 / 120 / 12 / 11 / 13 / 19 days from today · 30 / 45 days from now · 14 / 22 weeks from today · 6 months from today … (61) | ≈ 1.59M | 2–29 | **live table** (first column "N days from today"), H1 ("30, 60 or 90 Days From Now"), quick-answer chips (30, 45, 60, 90, 120) |
| Long tail (same table, ago) | 90 / 30 / 60 / 45 days ago · now − 30 days · what day was 90 days ago (11) | ≈ 128,000 | 7–28 | "Days ago" table + H2 "What day was 30, 60 or 90 days ago?" |

## 2. Our edge

- **One tool:** add **or** subtract days, weeks, months and years, from **today or any date**.
- **Rich result:** date, weekday, ISO week, day of year, days left in that year, relative wording ("in 6 weeks 3 days").
- **Business days** (weekends + US federal holidays by rule, shared with #1); the holidays skipped are listed.
- **Live tables computed in the browser:** 1–365 days (common values highlighted: 7, 10, 14, 21, 28, 30, 45, 60, 90, 100, 120, 150, 180, 270, 365), 1–52 weeks, 1–24 months; **from today and ago**; hash anchors (`#90-days`, `#90-days-ago`).
- **Month-end rule shown** (Jan 31 + 1 month = Feb 28/29), with an option to roll over.
- **.ics download** (add to calendar, made locally), Copy, Share URL.
- **Clear conventions:** today is day 0 (today + 1 = tomorrow); business days start counting the next day (Excel WORKDAY-style).

## 3. Calculator spec

### 3.1 Tabs

1. **Add / subtract** (default)
2. **Business days**
3. **Tables** (days, weeks, months; from today / ago)

### 3.2 Input guide diagram (above the inputs)

`DaysFromTodayInputGuide.tsx`: a calendar strip with an arrow.

- Left: "1 Start date (today)" card.
- Middle: an arrow with "2 + / −" toggle and "3 Amount + unit (45 days)".
- Right: result card "Wed, Jan 6, 2027" (live).
- **Business tab:** the strip greys weekends and dots holidays: "4 Skip weekends & holidays".
- **Month mode:** a small note card "Jan 31 + 1 month = Feb 28" labelled "5 Month-end rule".
- **Tables tab:** a mini table with "#90-days" anchor tag.
- Live values; the focused field highlights.

### 3.3 Inputs

| Field | Default |
|---|---|
| Start date | today (client); "Today" button |
| Direction | add (add · subtract) |
| Amount | 45 |
| Unit | days (days · weeks · months · years); or combined fields Y/M/W/D |
| Business days only | off (Business tab) |
| Holidays | US federal observed on; custom dates |
| Month-end rule | clamp (default) · roll over |
| Include today as day 1 | off (explained) |

### 3.4 Engine (shared `date-diff-engine.ts`, `business-days.ts`, `ics.ts`)

```ts
addDays(start, ±n) ; weeks: ±7n
addMonths(start, ±k, {clamp}) ; addYears = addMonths(12k)   // Feb 29 + 1 year = Feb 28 (clamp)
combined Y/M/W/D: apply years+months first (clamped), then weeks+days   // stated in the UI
addBusinessDays(start, ±n, {holidays})  // counts from the next day; skips weekends + observed federal + custom
result → {date, weekday, isoWeek, dayOfYear, daysLeftInYear, relative}
table(today, offsets, unit, dir) → rows (client-only)
ics(date, title) → "BEGIN:VCALENDAR…DTSTART;VALUE=DATE:20270106…END:VCALENDAR"
```

**Worked examples (checked with node, 2026-11-22; fixed start dates):**

| Input | Result |
|---|---|
| **2026-11-14 + 45 days** | **Tue, Dec 29, 2026** (Inch ✔) |
| 2026-11-14 + 45 business days, weekends only | Fri, Jan 15, 2027 (Inch ✔) |
| 2026-11-14 + 45 business days, with US holidays | **Thu, Jan 21, 2027** |
| 2026-11-22 + 10 / 20 / 28 / 30 days | Wed Dec 2 · Sat Dec 12 · Sun Dec 20 · Tue Dec 22, 2026 |
| 2026-11-22 + 45 / 50 / 90 / 120 days | Wed Jan 6 · Mon Jan 11 · **Sat Feb 20** · Mon Mar 22, 2027 |
| 2026-11-22 + 14 weeks / + 22 weeks | Sun Feb 28, 2027 / Sun Apr 25, 2027 |
| 2026-11-22 − 30 days / − 90 days | Fri Oct 23, 2026 / **Mon Aug 24, 2026** |
| 2026-11-22 + 6 months | May 22, 2027 |
| 2027-01-31 + 1 month / 2028-01-31 + 1 month | **Feb 28, 2027 / Feb 29, 2028** (clamp) |
| 2024-02-29 + 1 year | Feb 28, 2025 (clamp) |
| 2026-08-31 + 6 months | Feb 28, 2027 |
| WORKDAY check 2008-10-01 + 151 | **2009-04-30** (Microsoft ✔) |

### 3.5 Outputs

- **Headline:** the date (big) + weekday.
- **Sentence:** "45 days from Sunday, November 22, 2026 is Wednesday, January 6, 2027 (ISO week 1, day 6 of the year)." (engine; live with today on the client)
- **Quick chips:** today + 30 / 45 / 60 / 90 / 120 days (client).
- **Business tab:** the date + "skipped: Thanksgiving (Nov 26), Christmas (Dec 25), New Year's Day (Jan 1)".
- **Tables tab:** three tables (days, weeks, months), each with "from today" and "ago" columns, weekday shown; print button.
- Copy, Share URL (`?start=…&n=45&unit=d&dir=add&biz=0`), **Add to calendar (.ics)**.
- Links: "Count days between two dates" → #1; "Countdown to a date" → #3; Weeks to Months (#30, later).

### 3.6 Tests

- Every worked example; subtract mode; years across Feb 29; combined Y/M/W/D order.
- Clamp vs roll-over (Jan 31, Mar 31, May 31 + 1 month).
- Business days across Thanksgiving/Christmas/New Year and the 2027 observed shifts; negative business days.
- ISO week edges; day-of-year in leap years.
- `LiveDateTable` with a mocked "today" (and the server render shows no dates).
- `.ics` output valid (DTSTART VALUE=DATE, CRLF line endings, UID).
- Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Days From Today Calculator – Add or Subtract Days` (49; **61 with the suffix → `absoluteTitle`**) |
| Meta | `Free days from today calculator. Add or subtract days, weeks or months from today or any date to see the exact date and weekday, with a quick table.` (148) |
| H1 | `Days From Today: What Date Is 30, 60 or 90 Days From Now?` |
| BLUF | Static: "Add or subtract any number of days, weeks, months or years from today or another date to get the exact date and weekday. For example, 45 days after November 14, 2026 is Tuesday, December 29, 2026. Turn on business days to skip weekends and US holidays." Live line under it (client): "Today + 45 days = …". |
| ToolShell pills | `Add or subtract days to months`, `Business days with US holidays`, `Live tables to 365 days`, `Add to calendar (.ics)` |
| Links out | Days Between Dates (#1), Days Until (#3), Weeks to Months (#30, later) |
| Links in | #1, #3, Tools hub "Date & Time" |

## 5. Content (~1,100–1,400 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the days from today calculator | 3 tabs, chips, calendar file | 110 |
| 2 | What is 45 days from today? | Live answer + the fixed Nov 14 example; how to read the result | 110 |
| 3 | How "days from today" is counted | Today = day 0; include-today option; weekday | 110 |
| 4 | Adding weeks, months and years | Month-end rule with the Jan 31 and Feb 29 examples; order of combined units | 150 |
| 5 | Business days from today | Next-day start, weekends, US holidays by rule; the Jan 15 vs Jan 21 example | 140 |
| 6 | What day was 30, 60 or 90 days ago? | Subtract mode, the "ago" table (`90 days ago`, `now - 30 days`) | 100 |
| 7 | Days from today in Excel or Google Sheets | `=TODAY()+45`; `=WORKDAY(TODAY(),45,holidays)`; `=EDATE(TODAY(),6)` (verified syntax) | 120 |
| 8 | Days, weeks and months from today: tables | The live tables | — |
| 9 | FAQ | §6 | 330 |

## 6. FAQ (10, from the competitor question bank + cluster keywords)

1. What is 45 / 30 / 60 / 90 / 120 days from today? (live)
2. What day was 30 / 45 / 60 / 90 days ago? (live)
3. How do I count days from a date by hand or in Excel?
4. What about business days (no weekends or holidays)?
5. Is 45 days the same as 1.5 months? (no: months vary from 28 to 31 days; compare 45 days vs + 1 month 15 days with the engine)
6. What is 6 weeks or 6 months from today?
7. What happens when I add a month to January 31?
8. Does "from today" include today?
9. Can I add the date to my calendar? (.ics)
10. What is "now − 30 days"?

## 7. Done when

- [ ] Engine additions + `LiveDateTable` + `ics.ts` + tests; `npm run verify` passes.
- [ ] No per-number URLs; hash anchors only; server HTML has no dates.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Registrations + docs; `graphify update .`.
