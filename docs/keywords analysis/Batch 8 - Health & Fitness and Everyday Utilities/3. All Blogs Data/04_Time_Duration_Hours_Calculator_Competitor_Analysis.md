# Time Duration & Hours Calculator — Competitor Analysis

> **Target page:** KKCTools `/time-duration-calculator/` (Batch 8, Tool #4 ✅)
> **Primary keyword:** `time adder`: US 6,600 · **KD 0**. The cluster has 20 keywords and 212,310 US searches. The head term is `time duration calculator` (90,500, KD 28). About 89k of the volume comes from 14 "X hours from now / how long until 3 pm" phrases.
> **SERP source:** ⚠ There is no Semrush SERP export for Batch 8. Competitors come from a live web search on 2026-11-14 for `time duration calculator hours between times add time`. `TODO(owner): pull Google top 10 for "time adder" and "16 hours from now".`
> **Pages visited (2026-11-14):** 4 read: Calculator.net time calculator, Omni time duration, Clockify, Inch Calculator. The Time and Date hours-from-now URL returned 404.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Calc giants: Calculator.net, Omni, Inch, DQYDJ, Calculate.co.nz, Rows.
  - Time-tracking SaaS lead-gen: Clockify, HiveDesk, OnTheClock, Clockit, WebWork, Leaveboard, Ordio.
  - The Old Farmer's Almanac.
  - Various clone sites.
- **Keyword-file must-haves:**
  - Time between two times, including spans that **cross midnight**. Show the result as h:mm and as decimal hours.
  - **Add or subtract a list of durations**, timesheet-style.
  - **X hours or minutes from now**, answered live from the device clock.
  - Links to Time to Decimal (#16) and the Batch 3 wage tools.
- **Errors found:**
  - Inch's 12-hour conversion rule breaks at the 12 o'clock hour (12:30 am → "1230"), and its overnight handling isn't explained.
  - Omni's "add 12 for pm" rule also skips the 12 pm / 12 am cases.
  - Clockify's manual notation is confusing ("1600 − 800 = 800 hours").
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | calculator.net/time-calculator.html | Calc giant | Time Calculator | ~2,000 (mostly essay) |
| 2 | omnicalculator.com/everyday-life/time-duration | Giant | Time Duration Calculator | 1,100–1,300 |
| 3 | clockify.me/time-duration-calculator | Time-tracking SaaS | Time Duration Calculator | long |
| 4 | inchcalculator.com/time-duration-calculator/ | Calc site | Time Duration Calculator | ~200 method |
| — | timeanddate.com/time/hours-from-now.html | Authority | — | **404** |

**What this tells us:**
- **Calculator.net has the most flexible time maths:**
  - add or subtract d/h/m/s
  - add an offset to a date-time (with a "Now" button)
  - an **expression mode** ("1d 2h 3m 4s + 4h 5s − 2030s")
  - Weak points: about 2,000 words of philosophy and history essay, and the expression syntax isn't documented.
- **Omni:** elapsed-time and clock modes (12 or 24 h), handles overnight spans in clock mode, has correct worked examples (8:42, 7:54, 16:06) and 4 FAQs. It has **no decimal output and no duration addition**.
- **Clockify:** between two times (shown as HH:MM and decimal), between two dates, and an add/subtract tool. It has **no breaks field, no multiple rows, and doesn't document overnight spans**. It promotes its product heavily.
- **Inch:** times, dates, and times-and-dates tabs with output in decimal hours. Its **12-hour conversion rule is wrong**, it doesn't explain overnight spans, and it has no worked example.
- **No page offers all of these:**
  - between two times, with an **automatic overnight roll-over**
  - output as h:mm, decimal hours, and total minutes
  - **break deduction**
  - a **timesheet list** (add or subtract many rows, with a total)
  - **X hours/minutes from now** answered live
  - a time-to-time **"how long until 3 pm"** mode
  - a small live table (1–48 hours from now)

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Calculator.net | Omni | Clockify | Inch |
|---|---|---|---|---|
| Time between two times | ⚠️ (link out) | ✅ | ✅ | ✅ |
| Overnight (crosses midnight) | n/a | ✅ (clock mode) | ⚠️ (undocumented) | ❌ (not explained) |
| 12 h / 24 h input | ✅ | ✅ | ✅ | ? |
| Output h:mm | ✅ | ⚠️ | ✅ | ⚠️ |
| Output decimal hours | ❌ | ❌ (separate tool) | ✅ (times tab only) | ✅ |
| Total minutes / seconds | ✅ | ✅ (unit switch) | ❌ | ❌ |
| Break deduction | ❌ | ❌ | ❌ (manual) | ❌ |
| **Add or subtract a list of durations (timesheet)** | ⚠️ (expression) | ❌ | ❌ | ❌ |
| Add offset to a clock time / now | ✅ | ❌ | ✅ | ❌ |
| **X hours from now (live)** | ⚠️ ("Now" button) | ❌ | ⚠️ | ❌ |
| How long until a time today | ❌ | ❌ | ❌ | ❌ |
| Dates + times span | ⚠️ (link) | ⚠️ (manual) | ✅ | ✅ |
| Weekly hours total | ❌ | ❌ | ❌ | ❌ |
| Copy / share | ? | ✅ | ? | ✅ |

---

## 3. Feature matrix — content and trust

| Item | Calculator.net | Omni | Clockify | Inch |
|---|---|---|---|---|
| Manual method | ❌ | ✅ (borrow 60, carry 24) | ⚠️ (confusing notation) | ⚠️ (**12 o'clock rule wrong**) |
| 12 am / 12 pm handled correctly | n/a | ⚠️ (FAQ covers 12:30 am only) | ? | ❌ |
| Worked examples (checked) | ❌ | ✅ (3) | ✅ (7h30 − 35 min = 6h55) | ❌ |
| Off-topic padding | heavy (philosophy, history) | "what is time" | product promotion | — |
| FAQ count | 0 | 4 | 4 | 0 |
| Named author | ❌ | ✅ (+ reviewers) | ❌ | ✅ (+ PhD reviewer) |
| Date | ❌ | ❌ | ❌ | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. Calculator.net: Time Calculator
- **Modes:**
  - add or subtract d/h/m/s
  - date-time + offset (AM/PM or 24 h, "Now" button)
  - expression parser
- **Weak points:**
  - Results and expression syntax aren't documented.
  - About 2,000 words of off-topic essay, with errors ("Lorenz").
  - No FAQ, author or date.

### 2. Omni: Time Duration Calculator (Steven Wooding, with reviewers)
- **Modes:** elapsed time (h/m/s) and clock time (12 or 24 h, overnight supported).
- **Examples:** 8:13 am → 4:55 pm = 8:42 ✔; → 4:07 pm = 7:54 ✔; 4:07 pm → 8:13 am = 16:06 ✔.
- **FAQs (4):**
  1. How to calculate a duration
  2. How to write one
  3. How to get intervals in hours
  4. 12:30 am in 24 h
- **Weak points:**
  - The "add 12 for pm" rule ignores 12 pm.
  - No decimal output and no addition of durations.
  - Padding on "what is time".

### 3. Clockify: Time Duration Calculator
- **Tabs:** between two times (HH:MM + decimal), between two dates (DD:HH:MM), add/subtract (date, time, weekday).
- **FAQs (4):** decimal, work hours, multiple periods, time zones (vague).
- **Weak points:**
  - Title and H1 don't match.
  - No breaks field and no multiple rows.
  - Overnight spans undocumented.
  - Placeholder links.
  - Heavy promotion, including unverified review counts.

### 4. Inch Calculator: Time Duration Calculator (Joe Sexton; reviewer Ethan Dederick PhD)
- **Tabs:** times, dates, times + dates. Output in decimal hours.
- **Errors:**
  - 12:30 am becomes "1230" and 12:30 pm becomes "24:30" under its rule.
  - Overnight spans give a negative result, which isn't explained.
  - A broken anchor.
- **Weak points:** no worked example, no FAQ, no date.

---

## 5. Patterns

**Maths**
- Convert each time to minutes since midnight. 12-hour rules:
  - 12:xx am = 0:xx
  - 12:xx pm = 12:xx
  - 1–11 pm: add 12
- Duration = end − start. If the result is negative, add 1,440 (overnight). An optional end date allows multi-day spans.
- Outputs:
  - h:mm
  - decimal hours (minutes ÷ 60, rounded to 2 decimals; show the rounding)
  - total minutes
- **Breaks:** subtract the break minutes.

**Timesheet list**
- Rows of either (start, end, break) or a duration.
- Each row can be added or subtracted.
- Totals in h:mm and decimal. An optional pay rate gives earnings, linked to Hourly to Salary (Batch 3 #4) and Labor Cost (#18).

**From now**
- now + H:M → the clock time and day, using the device time zone (shown).
- "How long until hh:mm": the next occurrence of that time.
- A live table of +1 to +48 hours, computed on the client.

**Expression mode (optional)**
- Accepts d/h/m/s tokens joined by + and −. Document the syntax.

**DST**
- "X hours from now" across a DST change uses real elapsed time. Show a note when the period crosses a DST change.
- `TODO(owner)`: decide whether to show wall-clock or elapsed time across DST. Elapsed is our default.

**What the 4 competitors cover**

| Section | Pages (of 4) |
|---|:---:|
| Overnight correct and explained | 1 |
| Decimal output | 2 |
| Break deduction | **0** |
| Timesheet list | **0** (Calc.net has expression mode only) |
| From now (live) | 1 partial |
| Correct 12 am/pm rule | 1 partial |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword. Map to the 20-keyword cluster.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How do I calculate the time between two times? | all · `time between times` |
| 2 | ★ How do I add hours and minutes together? | Calc.net · `time adder`, `time calculator hours` |
| 3 | ★ How do I calculate hours worked, including breaks? | Clockify · `calculator to calculate hours` |
| 4 | ★ What time will it be in 8 / 16 / 24 hours? | `now + 8 hours`, `16 hours from now`, `24 hours from now` |
| 5 | How long until 3 pm (or 2:30)? | `how long until 3pm`, `how long until 2:30` |
| 6 | How do I handle shifts that cross midnight? | Omni |
| 7 | How do I convert minutes to decimal hours? | Clockify, Inch · link #16 |
| 8 | What is 12:30 am in 24-hour time? | Omni |
| 9 | How do I subtract time? | Omni |
| 10 | Does daylight saving time change the answer? | — (gap) |

---

## 7. Gaps nobody fills — our opportunities

1. **Between-times mode with an automatic overnight roll-over** and correct 12 am/pm handling, explained.
2. **Three outputs at once:** h:mm, decimal hours (with the rounding shown), total minutes.
3. **Break deduction** and a **timesheet list** (add or subtract rows, weekly total, optional pay).
4. **From now:** X hours/minutes from now, plus "how long until hh:mm". Live, with a +1…48 h table.
5. **A DST note** for spans that cross a change.
6. **An expression box** with documented syntax.
7. **Correct worked examples**, written by us.
8. **Links:** Time to Decimal (#16), Military Time (#5), Hourly to Salary (Batch 3 #4), Labor Cost (Batch 3 #18).

---

## 8. Blueprint for the KKCTools Time Duration Calculator

### 8.1 SEO

- **URL:** `/time-duration-calculator/`
- **Title:** Time Duration Calculator – Add Hours & Minutes
- **H1:** Time Duration Calculator: Hours Between Times, Add and Subtract Time
- **Meta:** as in the keyword file (148 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Between | Start, end (12/24 h), optional dates, break → h:mm, decimal, minutes |
| Timesheet | N rows (start/end/break or duration, +/−), totals, optional rate |
| From now | +H:M → time/day; until hh:mm → duration; live table 1–48 h |
| Expression | d/h/m/s with + / − |
| Engine | Minutes-since-midnight, DST-aware for "from now" |
| UX | Copy, share URL, no network |

### 8.3 Content outline (≈ 1,000–1,300 words, original)

1. Intro (primary keyword)
2. How to use
3. Calculating time between two times (incl. overnight), with an example
4. Adding and subtracting hours and minutes, with an example
5. Hours worked with breaks (timesheet), with an example
6. Converting to decimal hours (link #16)
7. What time will it be in X hours?
8. 12 am, 12 pm and the 24-hour clock (link #5)
9. FAQ (10)
10. Related tools: Time to Decimal (#16), Military Time (#5), Hourly to Salary (Batch 3 #4)

### 8.4 Quality checks

- **Unit tests:**
  - 12 am/pm edge cases
  - overnight spans
  - multi-day spans
  - break larger than the span (error)
  - decimal rounding
  - timesheet sums
  - expression parser
  - "from now" across DST (mocked time zone)
- No competitor wording copied. `npm run check:no-network` passes.
- **`TODO(owner)`:** pull Google top 10; confirm the DST display choice.
