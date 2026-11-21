# Time Duration & Hours Calculator — Build Spec

> **URL:** `/time-duration-calculator/` · Batch 8 · Tier 1 · **Build order 5**
> **Read first:** `../00_BATCH8_BUILD_RULES.md` (§2.5 12-hour rules, §2.6 DST, §4 `time-engine`)
> **Inputs:** `04_Time_Duration_Hours_Calculator_Competitor_Analysis.md`, keyword file §2 #4
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**20 keywords, ≈ 212,300 searches:**
- easy tool terms: `time adder` **6,600 / KD 0** (primary), `time calculator hours` 5,400 / KD 5, `calculator to calculate hours` 4,400 / KD 9 (irregular);
- medium: `hour hour calculator` 8,100 (irregular), `time between times` 8,100 / KD 19;
- head (support for now): `time duration calculator` **90,500 / KD 28**, in the title and H1;
- "from now / until" long tail (14 phrases, ≈ 89,200, KD 0–22): `16 hours from now` 12,100, `how long until 3pm` 9,900, `how long until 2:30` 6,600, `how long until 12 am` 5,400, `24 hours from now` 5,400, `22 hours from now` 4,400, `now + 8 hours`, `17 hours from now`.

**The SERP is calc giants plus time-tracking SaaS lead-gen** (Clockify, HiveDesk, OnTheClock…). None combines overnight shifts, breaks, a timesheet list, decimal hours and "from now" on one page, and several get **12 o'clock wrong**.

### Research notes from the competitor analysis

- **Pages read:** Calculator.net time calculator, Omni time duration, Clockify, Inch Calculator (Time and Date's hours-from-now URL was 404).
- **Calculator.net:** the most flexible maths (add/subtract d/h/m/s, date-time offset with "Now", an expression mode) but the syntax is undocumented and ~2,000 words of off-topic essay.
- **Omni:** elapsed and clock modes, overnight handled; correct examples: 8:13 am → 4:55 pm = **8:42** ✔, → 4:07 pm = **7:54** ✔, 4:07 pm → 8:13 am = **16:06** ✔ (all reproduced by our engine). **No decimal output, no adding durations**; its "add 12 for pm" rule skips 12 pm.
- **Clockify:** between times (HH:MM + decimal), dates, add/subtract; **no breaks field, no multiple rows**, overnight undocumented; confusing notation ("1600 − 800 = 800 hours").
- **Inch:** decimal output, but **12:30 am becomes "1230" and 12:30 pm "24:30"** under its rule; overnight gives an unexplained negative.
- **0 of 4** have break deduction or a timesheet list; only 1 explains overnight spans.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | time adder | 6,600 | 0 | "Add & subtract" tab label, H2 "Time adder: add and subtract hours and minutes", first paragraph |
| Head (support) | time duration calculator | 90,500 | 28 | title, H1, ToolShell heading |
| Secondary | time calculator hours · calculator to calculate hours · hour hour calculator | 5,400 · 4,400 · 8,100 | 5–22 | intro, H2 "Hours worked calculator (with breaks)" |
| Secondary | time between times | 8,100 | 19 | "Between two times" tab + H2 "Time between two times" |
| Long tail (live) | 16 / 24 / 22 / 17 hours from now · now + 8 hours | 12,100 · 5,400 · 4,400 · … | 0–22 | "From now" tab + live table (+1…+48 h) + H2 "What time will it be in X hours?" |
| Long tail (live) | how long until 3pm · how long until 2:30 · how long until 12 am | 9,900 · 6,600 · 5,400 | — | "Until a time" field + H2 "How long until 3 PM?" |

## 2. Our edge

- **Between two times with automatic overnight roll-over** (end before start = next day) and an optional end date for multi-day spans.
- **Correct 12-hour handling** (rules §2.5) and 24-hour input; seconds optional.
- **Three outputs at once:** h:mm, **decimal hours** (2 dp, the rounding shown), total minutes.
- **Break deduction** (minutes) with an error if the break is longer than the span.
- **Timesheet list:** N rows of (start, end, break) or a plain duration, each + or −, with a total in h:mm and decimal; optional hourly rate → pay (links to Batch 3 Hourly to Salary and Labor Cost).
- **From now:** + H:M → clock time and day (device zone shown); "how long until hh:mm" (next occurrence); a live +1…+48 h table.
- **DST note** when a "from now" span crosses a change (elapsed time is used; wall-clock difference shown).
- **Expression box** with documented syntax: `1h 30m + 45m - 10m`.

## 3. Calculator spec

### 3.1 Tabs

1. **Between two times** (default)
2. **Add & subtract** (time adder + expression)
3. **Timesheet**
4. **From now / until**

### 3.2 Input guide diagram (above the inputs)

`TimeDurationInputGuide.tsx`: a 24-hour arc from start to end.

- "1 Start time" and "2 End time" handles on the arc; the filled span labelled with the result ("8:00").
- If the end is earlier, the arc wraps past midnight with a "+1 day" tag ("3 Crosses midnight").
- A cut-out on the arc: "4 Break (30 min)".
- Result badges: "7:30 · 7.50 h · 450 min".
- **Timesheet tab:** stacked mini rows with a total bar.
- **From now tab:** a clock with "now" and "+16 h" hands.
- Live values; the focused field highlights.

### 3.3 Inputs

| Field | Default |
|---|---|
| Start / end time | 9:00 AM / 5:30 PM (12-hour or 24-hour; seconds optional) |
| End date (optional) | same day |
| Break | 30 min |
| Decimal places | 2 |
| Add & subtract | rows of h / m / s with +/−; or the expression box |
| Timesheet rows | 3 sample rows (editable, add/remove), optional hourly rate |
| From now | +16 h 0 m; "until" time 3:00 PM |

### 3.4 Engine (`src/lib/time-engine.ts`)

```ts
toMinutes(h12/24) : 12:xx AM = 0:xx ; 12:xx PM = 12:xx ; 1–11 PM = +12 on the hour
durationBetween(a, b) = b − a ; if < 0 → + 1440 (overnight) ; with dates: real day difference
net = duration − break ; break > duration → error
formatHMM(min) ; toDecimalHours(min, dp) = round(min / 60, dp) (show "7 h 40 m = 7.67 h")
parseDurationExpr("1h 30m + 45m - 10m") → tokens [±][n d|h|m|s] ; whitespace optional ; errors point at the token
timesheet: Σ (sign × (rowDuration − rowBreak)) ; pay = totalHours × rate
fromNow(nowMs, +min, tz): instant = nowMs + min·60000 ; wall = Intl in tz ; dstChanged = offset(now) ≠ offset(instant)
untilClock(now, hh:mm): next occurrence (today if later, else tomorrow) → duration
```

**Worked examples (checked with node, 2026-11-22):**

| Input | Result |
|---|---|
| 8:13 AM → 4:55 PM | **8:42** (Omni ✔) · 8.70 h · 522 min |
| 8:13 AM → 4:07 PM | 7:54 (Omni ✔) |
| 4:07 PM → 8:13 AM | **16:06** (overnight; Omni ✔) |
| **10:00 PM → 6:00 AM, break 30 min** | 8:00 span → **7:30 net = 7.50 h** (overnight shift) |
| 12:30 AM / 12:30 PM | 0:30 / 12:30 (minutes 30 / 750; Inch's "1230" / "24:30" are wrong) |
| Timesheet: 9:00–17:30 (−30), 8:45–12:00, 13:00–17:15 (−15) | 8:00 + 3:15 + 4:00 = **15:15 = 15.25 h** |
| 7 h 40 m / 7 h 20 m to decimal | **7.67 h** / 7.33 h |
| Expression `1h 30m + 45m - 10m` | **2:05** |
| 2026-11-22 10:15 AM, how long until 3:00 PM | **4:45** |
| 2026-11-22 10:15 AM + 16 h | **Mon, Nov 23, 2:15 AM** |
| DST: 2026-10-31 8:00 PM EDT + 16 h | **Sun, Nov 1, 11:00 AM EST** (elapsed); note: "the clocks went back 1 hour; wall-clock difference 15 h" |

### 3.5 Outputs

- **Headline:** "7:30" (big) + "7.50 hours · 450 minutes".
- **Sentence:** "From 10:00 PM to 6:00 AM the next day is 8 hours; minus a 30-minute break that's 7 hours 30 minutes, or 7.50 hours."
- Add & subtract: the total + each step.
- Timesheet: rows with subtotals, total h:mm and decimal, optional pay; Copy as text / CSV.
- From now: clock time + weekday + date; live table +1…+48 h (client); DST note when relevant.
- Copy, Share URL (inputs only).
- Links: Military Time (#5), Time to Decimal (#16, later), Hourly to Salary and Labor Cost (Batch 3, live).

### 3.6 Tests

- 12 AM/PM edge cases for every hour; 24-hour and seconds input.
- Overnight, exactly 24 h (start = end → 0 or 24 h? **0 by default, "24 h" if an end date of the next day is set**: test both), multi-day with dates.
- Break longer than the span → error; decimal rounding (dp 0–4).
- Expression parser: valid forms, errors at the right token, negative totals.
- Timesheet sums with + and − rows; pay maths.
- fromNow / untilClock with a mocked clock and zone, including the Nov 1, 2026 DST change.
- The worked examples. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Time Duration Calculator – Add Hours & Minutes` (46; 58 with the suffix: OK) |
| Meta | `Free time duration calculator. Find the hours and minutes between two times, add or subtract time, and see what time it will be in X hours from now.` (148) |
| H1 | `Time Duration Calculator: Hours Between Times, Add and Subtract Time` |
| BLUF | "Enter a start and end time to get the hours and minutes between them, even across midnight, in h:mm and decimal hours. Use the time adder to add or subtract hours and minutes, the timesheet to total a week of shifts with breaks, or From now to see what time it will be in 16 hours. A 10 PM to 6 AM shift with a 30-minute break is 7.50 hours." (engine) |
| ToolShell pills | `Overnight shifts handled`, `Breaks & timesheet totals`, `h:mm and decimal hours`, `X hours from now` |
| Links out | Military Time (#5), Time to Decimal (#16, later), Hourly to Salary + Labor Cost (Batch 3, live) |
| Links in | #1, #5, Hourly to Salary, Labor Cost, Tools hub "Date & Time" |

## 5. Content (~1,200–1,500 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the time duration calculator | 4 tabs | 110 |
| 2 | Time between two times | Method, the Omni-style examples in our words, overnight roll-over (`time between times`) | 160 |
| 3 | Time adder: add and subtract hours and minutes | Carrying minutes, the expression syntax (`time adder`) | 140 |
| 4 | Hours worked calculator (with breaks) | Timesheet example (15.25 h), pay link (`time calculator hours`) | 150 |
| 5 | Converting hours and minutes to decimal hours | ÷ 60, rounding, 7:40 = 7.67 (link #16) | 110 |
| 6 | What time will it be in X hours? | From-now method, the table (`16 hours from now`, `24 hours from now`) | 110 |
| 7 | How long until 3 PM? | Next-occurrence rule (`how long until 3pm`, `how long until 12 am`) | 80 |
| 8 | 12 AM, 12 PM and the 24-hour clock | The rules, common mistakes (link #5) | 110 |
| 9 | Daylight saving time and long spans | The Nov 1, 2026 example | 80 |
| 10 | FAQ | §6 | 330 |

## 6. FAQ (10, from the competitor question bank + cluster keywords)

1. How do I calculate the time between two times?
2. How do I add hours and minutes together?
3. How do I calculate hours worked, including breaks?
4. What time will it be in 8, 16 or 24 hours?
5. How long until 3 PM (or 2:30)?
6. How do I handle shifts that cross midnight?
7. How do I convert minutes to decimal hours?
8. What is 12:30 AM in 24-hour time? (00:30)
9. How do I subtract time?
10. Does daylight saving time change the answer?

## 7. Done when

- [ ] `time-engine.ts` duration/expression/from-now functions + tests; `npm run verify` passes.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Live table client-only; DST note works.
- [ ] Registrations + docs; `graphify update .`.
- [ ] **STOP and report** (end of Batch 8 Part 1).
