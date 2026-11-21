# Days Until Calculator (Countdown to Any Date or Holiday) — Build Spec

> **URL:** `/days-until/` · Batch 8 · Tier 1 · **Build order 3**
> **Read first:** `../00_BATCH8_BUILD_RULES.md` (§2 conventions, §3 holiday sources, §4 `holidays-us`, `LiveDateTable`, `ics`)
> **Inputs:** `03_Days_Until_Countdown_Calculator_Competitor_Analysis.md`, keyword file §2 #3
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**86 keywords, ≈ 698,600 searches, most at KD 2–15:**
- the tool term `days until calculator` **9,900 / KD 0** (primary);
- `how many weeks left in the year` 12,100 / KD 15 and `how many weeks are left in the year` 6,600 (both rising);
- holidays (10 phrases, ≈ 149,000): `how many days until thanksgiving` **60,500**, `how many days till thanksgiving` 27,100, `days until thanksgiving` 6,600, `thanksgiving countdown` 14,800 (seasonal), `how many days until 2027` …;
- dates (70 phrases, ≈ 504,600): `how many days until may 22` 22,200, `… may 21` 14,800, `… december 1st` 12,100, `… april 1st` 8,100, `… june 1`, `… june 10` …;
- `online countdown` 1,000 / KD 0 (rising), `countdown online` 480.

**The SERP is heavily spammed** (hijacked .edu and corporate subdomains with stale "days until Thanksgiving" counts). Real competitors either make **one page per holiday** (Inch) or show **static counts** (SaturdayGift). A clean, live, rule-based page stands out. **Never one page per date**; rows are seasonal.

### Research notes from the competitor analysis

- **Pages read:** Time and Date countdown creator, Inch "days until Thanksgiving", SaturdayGift Thanksgiving countdown, Calculator.net day counter, Time and Date week number.
- **Time and Date countdown:** the feature leader (title, font, time, zone, ~40 themes, share URL) but ~50 words, no FAQ, a confusing midnight default.
- **Inch per-holiday:** Thu Nov 26, 2026 ✔, 12 days from Nov 14 ✔, but **its manual method is wrong** (it says to add the days of the months "before November"; it should be the months between now and the date), formulas hard-coded to 2026, past dates in its table.
- **SaturdayGift:** correct 2024–2035 Thanksgiving table + Canada's rule, but **"12 days (including today)"** mixes conventions and all counts are static.
- **Calculator.net day counter:** business days + 14 holiday presets, **not a countdown**; lists Black Friday and Christmas Eve next to federal holidays; a long off-topic Doomsday tutorial.
- **Time and Date week number:** shows neither the current week nor **weeks left in the year**; never names ISO 8601.
- **0 of 5** show weeks left in the year; only 1 computes one holiday by rule for future years.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | days until calculator | 9,900 | 0 | title, H1 lead, first sentence, ToolShell heading |
| Long tail (holidays) | how many days until thanksgiving · how many days till thanksgiving · days until thanksgiving · how many more days until thanksgiving · how many days until thanksgiving 2025 · how many days until 2027 … (10) | ≈ 149,100 | 9–29 | H2 "How many days until Thanksgiving?" (live + the rule), the **holiday list** (hash `#thanksgiving`), FAQ 1 |
| Secondary (seasonal) | thanksgiving countdown | 14,800 | 22 | the Thanksgiving card's live countdown + full-screen view |
| Long tail (dates) | how many days until may 22 / may 21 / december 1st / april 1st / june 1 / june 10 · how many days till may 22 … (70) | ≈ 504,600 | 2–27 | the date picker + **"next 12 months" table** of month starts and the 15th (client), H2 "How many days until a date?" |
| Secondary | how many weeks left in the year · how many weeks are left in the year | 12,100 · 6,600 | 12–15 | H2 "How many weeks are left in the year?" (live), year-info card |
| Secondary | online countdown · countdown online | 1,000 · 480 | 0 | live countdown, share link, full-screen view |

## 2. Our edge

- **Any date (and optional time) → days, weeks + days, hours, minutes left, with a live ticking countdown** (to local midnight by default, or a chosen time and time zone).
- **One stated convention:** today = day 0, so on Nov 22, 2026 Thanksgiving is **4 days away**; "include today" toggle.
- **Holiday presets computed by rule** for this year and next (US federal from § 6103 + popular dates: Easter by the Anonymous Gregorian algorithm, Mother's Day, Father's Day, Halloween, Valentine's Day, Christmas Eve, New Year's Eve, Canada Thanksgiving); auto-rollover after the date passes; hash anchors.
- **Year info:** days left, **weeks left** (weeks + days and decimal), ISO week number (rule named), day of year.
- **Business days until** (shared engine).
- **Share link with a title** (sanitised) and a **full-screen countdown** view; `.ics` download.
- **A correct manual and Excel method:** `=DATE(2026,11,26)-TODAY()`, `=NETWORKDAYS(TODAY(), date, holidays)`.

## 3. Calculator spec

### 3.1 Tabs

1. **Countdown** (default: pick a date)
2. **Holidays** (list, click to load)
3. **This year** (weeks/days left, ISO week)

### 3.2 Input guide diagram (above the inputs)

`DaysUntilInputGuide.tsx`: a timeline from "Today" to a flag.

- "1 Target date" flag (e.g. Thanksgiving, Nov 26, 2026); "2 Time (optional, midnight by default)" clock badge; "3 Title" label on the flag.
- The gap labelled "4 days · 96 hours" (live).
- A toggle chip "4 Include today".
- **Holidays tab:** a strip of holiday chips, each with its computed date.
- **This year tab:** a 12-month bar with the remaining part shaded: "5 weeks 4 days left".
- Live values; the focused field highlights.

### 3.3 Inputs

| Field | Default |
|---|---|
| Target date | the next upcoming holiday from the list (client) |
| Time | 00:00 (optional) |
| Time zone | the device's (shown); optional other IANA zone |
| Title | the holiday name, or "My countdown" |
| Include today | off |
| Business days until | off |
| Holiday set | US federal (observed + actual) + popular dates; Canada Thanksgiving optional |

### 3.4 Engine (shared + `holidays-us.ts`)

```ts
daysUntil = dayNumber(target) - dayNumber(today) (+1 if includeToday) ; past → "X days ago" + next occurrence for yearly dates
weeksDays = floor(d/7), d%7 ; hours = d*24 (date-only) ; live: (targetInstant - now) → d:h:m:s, ticking each second, paused when hidden
targetInstant: wall time in the chosen zone via Intl (no fixed offsets) ; DST-safe
holidays(y): federal (actual + observed) ∪ popular ; next = first with date ≥ today, else next year's
yearInfo(today): daysLeft = dayNumber(Dec 31) - dayNumber(today) ; weeksLeft = daysLeft/7 ; isoWeek ; dayOfYear
nextTwelveMonths(today) → 1st and 15th of each month with days until (client table)
```

**Worked examples (checked with node, 2026-11-22; "today" fixed):**

| Today → target | Result |
|---|---|
| **2026-11-22 → Thanksgiving 2026-11-26** | **4 days** (5 including today) · 96 hours |
| 2026-11-14 → Thanksgiving | 12 days (Inch ✔; SaturdayGift's "12 including today" is 13 by our toggle) |
| 2026-11-22 → Christmas 2026-12-25 | 33 days |
| 2026-11-22 → New Year 2027-01-01 | 40 days |
| 2026-11-22 → 2026-12-01 | 9 days · 1 week 2 days · 216 hours |
| 2026-11-22 → 2027-04-01 | 130 days · 18 weeks 4 days |
| 2026-11-22 → 2027-05-21 / 2027-05-22 | 180 / 181 days · 25 weeks 5 / 6 days |
| 2026-11-22 → 2027-07-04 | 224 days |
| Weeks left in 2026 on 2026-11-22 | **39 days = 5 weeks 4 days (5.6 weeks)** · ISO week 2026-W47 · day 326 of 365 |
| Holiday rules 2027 | Thanksgiving Nov 25 · Easter Mar 28 · Mother's Day May 9 · Father's Day Jun 20 · Canada Thanksgiving Oct 11 |
| Holiday rules 2026 | Easter Apr 5 · Canada Thanksgiving Oct 12 |

### 3.5 Outputs

- **Headline:** "4 days" + live "3 d 14 h 22 m 05 s".
- **Sentence:** "Thanksgiving is Thursday, November 26, 2026: 4 days from today (Sunday, November 22, 2026)." (fixed-date example in static text; live on the client)
- **Holiday list:** name, rule ("4th Thursday in November"), date, days until; observed date for federal holidays; next-year date after it passes.
- **This year card:** days left, weeks left, ISO week, day of year.
- Business days until (optional).
- Share link (`?to=2026-11-26&t=00:00&tz=America/New_York&title=Thanksgiving`), full-screen view, `.ics`, Copy.
- Links: #1, #2, Online Timer (#28) and Alarm Clock (#29) when live.

### 3.6 Tests

- Worked examples; include-today; past dates roll to next year for yearly holidays.
- Holiday rules 1990–2100 (nth/last weekday, Easter vs a reference list, observed shifts).
- Weeks left in leap and non-leap years; ISO week edges.
- Live countdown with a mocked clock: second ticks, pause on hidden tab, DST change day (target in a zone with a DST shift).
- Title sanitising (no HTML injection via `?title=`).
- `.ics` valid. Server HTML has no counts. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Days Until Calculator – Countdown to Any Date` (45; 57 with the suffix: OK) |
| Meta | `Free days until calculator. See how many days, weeks and hours are left until any date, birthday or holiday like Thanksgiving or July 4, with a live countdown.` (159) |
| H1 | `Days Until: How Many Days Until Any Date or Holiday?` |
| BLUF | Static: "Pick any date and the days until calculator shows how many days, weeks and hours are left, with a live countdown. Holidays like Thanksgiving (the fourth Thursday in November) are worked out by rule for this year and next. For example, from Sunday, November 22, 2026, Thanksgiving on November 26 is 4 days away." Live line (client): "Today: N days until <next holiday>." |
| ToolShell pills | `Live countdown to any date`, `Holidays worked out by rule`, `Weeks left in the year`, `Shareable countdown link` |
| Links out | Days Between Dates (#1), Days From Today (#2), Online Timer (#28, later) |
| Links in | #1, #2, Tools hub "Date & Time" |

## 5. Content (~1,100–1,400 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the days until calculator | 3 tabs, time zone, share | 110 |
| 2 | How many days until Thanksgiving? | Live answer, the 4th-Thursday rule, next year's date, the Nov 14 → 12 days example | 130 |
| 3 | How "days until" is counted | Today = day 0; include today; why sites differ (12 vs 13) | 110 |
| 4 | Upcoming holidays and how their dates are set | The rules table (federal § 6103 + popular dates + Easter method) | 180 |
| 5 | How many weeks are left in the year? | Live + the Nov 22 example; ISO week (Thursday rule) | 120 |
| 6 | How many days until a date? | The next-12-months table; picking any date (`how many days until may 22`) | 90 |
| 7 | Counting down to a time and time zone | Midnight default, DST, sharing | 100 |
| 8 | Days until a date in Excel or Google Sheets | `=DATE(y,m,d)-TODAY()`, `=NETWORKDAYS(TODAY(),date)`; Inch's "months before" mistake explained in our words | 110 |
| 9 | FAQ | §6 | 330 |

## 6. FAQ (10, from the competitor question bank + cluster keywords)

1. How many days until Thanksgiving?
2. How many days until a specific date (e.g. May 22, June 1, December 1)?
3. How many weeks are left in the year?
4. When is Thanksgiving this year and next year?
5. How many days until 2027 (New Year's Day)?
6. How many business days until a date?
7. Does "days until" include today?
8. Can I share a countdown?
9. What week number is it? (ISO 8601 Thursday rule)
10. How do I count down to a specific time?

## 7. Done when

- [ ] `holidays-us.ts` popular dates + Easter + countdown hook + tests; `npm run verify` passes.
- [ ] No per-date URLs; hash anchors only; server HTML has no counts.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Registrations + docs; `graphify update .`.
