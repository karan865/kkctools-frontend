# Military Time Converter (24-Hour Clock Chart) — Build Spec

> **URL:** `/military-time-converter/` · Batch 8 · Tier 1 · **Build order 4** (builds `time-engine`)
> **Read first:** `../00_BATCH8_BUILD_RULES.md` (§2.5 12-hour rules, §3 military-time source, §4 `time-engine`)
> **Inputs:** `05_Military_Time_Converter_Competitor_Analysis.md`, keyword file §2 #5, CSVs `4.` / `4.2` (time zone seed)
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**About 45 military-time searches, ≈ 400,700 combined; the long tail is the target** (keyword file):
- head `military time converter` 22,200 / KD 24 (primary, in title and H1);
- hour rows: `1900 military time` **33,100 / KD 13**, `2100 military time` 27,100, `1400 military time` 22,200, `1300 military time` 18,100, `military time 1700 hours` 18,100, `1600`, `1700`, `1800` rows;
- AM/PM rows: `10 a.m. in military time` 14,800, `10 a.m. military time` 12,100, `12 a.m. military time` 8,100, `10pm in military time` 3,600;
- `what is 1700 in military time` 6,600 / KD 0, `16:00 military time` 4,400, `what time is it at 1800 hours` 3,600, `military hours` 2,900, `0700 military time` 2,400, `14 military time` 2,900;
- `24-hour notation` 14,800 (definition intent).

**One page with the full chart answers all of them** (never one page per time). The chart is also the linkable asset (printable).

**Competitors get the basic rules wrong,** especially 12 o'clock and 0000 vs 2400. Being exactly right, with a spoken column, is our edge.

### Research notes from the competitor analysis

- **Pages read:** Inch Calculator, OnTheClock, TimeTackle, OnlineClock.net chart, Time and Date military-time article.
- **Inch:** both directions, whole-hour chart, zone table, 8 FAQs; **its PM rule ("hours > 12 are PM") would label 1200 as AM**; says the range is "0 to 24" in one place and 0000–2359 in another.
- **OnTheClock:** converter + PDF + pronunciation, but writes **"1700 − 12 = 5:00 PM"** (you subtract 12 from the hour, 17 − 12 = 5, not from 1700); "0100–11:59 is AM" leaves out the 00xx hour; heavy promotion.
- **TimeTackle:** a 48-row half-hour chart, all correct, 6 FAQs; no printable chart; 2400 only in the FAQ.
- **OnlineClock.net:** promises a detailed chart with a spoken column, but **the table has no rows**; "00–24" input range.
- **Time and Date:** the content benchmark (pronunciation, zone letters, a chart listing both 0000 and 2400) but **no converter** and no explanation of 0000 vs 2400.
- **0 of 5** support seconds or explain 2400 clearly; none has a minute-by-minute chart with a spoken column.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | military time converter | 22,200 | 24 | title, H1, first sentence, ToolShell heading |
| Long tail (one chart) | 1900 / 2100 / 1400 / 1300 / 1600 / 1700 / 1800 military time · military time 1700 hours · what is 1700 in military time · 16:00 military time · 0700 military time · 14 military time … (32) | ≈ 378,500 | 0–28 | **the chart** (first column "1900"), quick-answer chips (1300–2100), H2 "Military time chart", hash anchors `#1900` |
| Long tail | 10 a.m. in military time · 10 a.m. military time · 12 a.m. military time · 10pm in military time | 14,800 · 12,100 · 8,100 · 3,600 | — | standard → military direction; FAQ "What is 12 a.m. in military time?" |
| Secondary | what time is it at 1800 hours · military hours | 3,600 · 2,900 | — | live clock card ("Now: 1432 hours"), H2 "How to read military hours" |
| Secondary | 24-hour notation | 14,800 | — | H2 "Military time vs 24-hour notation" |

## 2. Our edge

- **Correct, complete rules shown on the page:** 12:00 AM = 0000; 12:xx AM = 00xx; 1–11 AM = 0100–1159; 12:xx PM = 12xx; 1–11 PM: add 12 **to the hour** (1300–2359); reverse: hour ≥ 13 → subtract 12 from the hour, PM; hour 12 → PM; hour 00 → 12 AM.
- **0000 vs 2400 explained:** 0000 is the start of a day, 2400 the end of the same day ("2400 Monday" = "0000 Tuesday"); the standard range is 0000–2359; input "2400" is accepted and explained.
- **Seconds** in both directions (`17:30:15` ↔ `5:30:15 PM`).
- **Flexible input:** `1730`, `17:30`, `5:30 pm`, `5:30PM`, `530p`, `17` (= 1700).
- **The fullest chart:** every 15 minutes by default (96 rows), expandable to every minute (1,440 rows, rendered lazily), with **standard time and spoken form on every row**; printable (Letter and A4) via a print stylesheet.
- **Spoken form** following common usage (Time and Date): leading zero spoken, "hundred hours" on the hour, never "thousand".
- **Live clock:** local military time and Zulu (UTC).
- **Military zone letters** table (A–Z, J = local).
- Link to #4 for time between two military times.

## 3. Calculator spec

### 3.1 Tabs

1. **Military → standard** (default)
2. **Standard → military**
3. **Chart** (15-minute / every minute, printable)
4. **Zones & live clock**

### 3.2 Input guide diagram (above the inputs)

`MilitaryTimeInputGuide.tsx`: a 24-hour clock face with an inner 12-hour ring.

- Outer ring 00–23, inner ring 12, 1…11; the pointer follows the input.
- **Callouts:** "1 Hours 00–23"; "2 Minutes"; "3 Seconds (optional)"; "4 Afternoon: add 12 to the hour (5 PM → 17)"; "5 Midnight = 0000 (2400 = end of day)".
- **Standard tab:** the inner ring highlights with an AM/PM switch.
- **Chart tab:** a mini table "1700 · 5:00 PM · seventeen hundred hours".
- **Zones tab:** a world strip with letters Z (Greenwich), A, … and "J = your local time".
- Live values; the focused field highlights.

### 3.3 Inputs

| Field | Default |
|---|---|
| Military time | 1900 (accepts 0000–2359, 2400, with or without colon, optional seconds) |
| Standard time | 7:00 PM (hour, minute, optional seconds, AM/PM) |
| Chart step | 15 minutes (15 · 30 · 60 · every minute) |
| Show seconds | off |
| Live clock zone | device local + Zulu |

### 3.4 Engine (`src/lib/time-engine.ts`)

```ts
parseClock(s) → {h, m, s} | {error}      // "1730" "17:30" "17:30:15" "5:30 pm" "530p" "17" ; 2400 → {h:24} flagged
toMilitary({h,m,s}) = HHMM[SS] (zero-padded) ; 12-hour → 24: h12 % 12 + (pm ? 12 : 0)
fromMilitary(HHMM) : h === 0 → 12 AM ; 1–11 AM ; 12 → 12 PM ; 13–23 → h − 12 PM ; 24 → 12 AM (end of day) note
spokenMilitary(h, m): hh = h < 10 ? "zero " + word(h) : word(h)
   m === 0 → (h === 0 ? "zero hundred hours" : hh + " hundred hours")
   else     → hh + " " + (m < 10 ? "zero " + word(m) : word(m)) + " hours"
chart(step) → rows {mil, std, spoken}
zones = A..I (+1..+9), K..M (+10..+12), N..Y (−1..−12), Z (0) ; J = local
```

**Worked examples (checked with node, 2026-11-22):**

| Military | Standard | Spoken |
|---|---|---|
| **1900** | **7:00 PM** | nineteen hundred hours |
| 1700 | 5:00 PM | seventeen hundred hours |
| 2100 / 1400 / 1300 | 9:00 PM / 2:00 PM / 1:00 PM | twenty-one hundred · fourteen hundred · thirteen hundred hours |
| 0000 | **12:00 AM** (midnight, start of day) | zero hundred hours |
| 0005 | 12:05 AM | zero zero zero five hours |
| 0030 | 12:30 AM | zero zero thirty hours |
| 0700 | 7:00 AM | zero seven hundred hours |
| 0945 | 9:45 AM | zero nine forty-five hours (Time and Date ✔) |
| 1200 | **12:00 PM** (noon) | twelve hundred hours |
| 1230 | 12:30 PM | twelve thirty hours |
| 1430 | 2:30 PM | fourteen thirty hours |
| 2000 | 8:00 PM | twenty hundred hours |
| 2359 | 11:59 PM | twenty-three fifty-nine hours |
| 2400 | 12:00 AM, end of day (= 0000 next day) | twenty-four hundred hours |
| 10:00 AM → | 1000 | ten hundred hours |
| 12:00 AM → / 10:00 PM → | 0000 / 2200 | — |
| 17:30:15 | 5:30:15 PM | — |

### 3.5 Outputs

- **Headline:** "1900 = 7:00 PM" (big), spoken form under it, Copy.
- **Sentence:** "1900 in military time is 7:00 PM: subtract 12 from the hour (19 − 12 = 7) and add PM."
- The rule that was used (highlighted in the rules box).
- **Chart:** sticky header (Military · Standard · Spoken), hash anchors per row, Print button (print stylesheet: table only, Letter/A4).
- **Live card:** "Now: 1432:05 local · 1932Z (Zulu)" (client).
- **Zones table:** letter, NATO name, UTC offset; note "J = local time".
- Share URL (`?t=1900`).
- Links: "Hours between two military times" → #4; Time Zone Converter (#14, later); Time to Decimal (#16, later).

### 3.6 Tests

- All 1,440 minutes round-trip military ↔ standard.
- 12 AM / 12 PM / 0000 / 1200 / 2400 cases; invalid input (2460, 2500, 9:75) → clear errors.
- Parser formats (`1730`, `17:30`, `5:30 pm`, `530p`, `17`, `17:30:15`).
- Spoken form snapshot for all 1,440 minutes (and the table above as explicit cases).
- Zone table offsets.
- Print stylesheet hides everything but the chart (visual check).

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Military Time Converter – 24-Hour Time Chart` (44; 56 with the suffix: OK) |
| Meta | `Free military time converter. Turn 24-hour military time into standard AM/PM time and back, with a full military time chart and how to say each time.` (149) |
| H1 | `Military Time Converter: 24-Hour Time to Standard Time and Back` |
| BLUF | "Type a military time like 1900 to get 7:00 PM, or type 7 PM to get 1900. For afternoon hours, subtract 12 from the hour (19 − 12 = 7) and add PM; midnight is 0000 and noon is 1200. The full chart below lists every time with how to say it, for example 1700 is "seventeen hundred hours"." (engine) |
| ToolShell pills | `Both directions, with seconds`, `Full chart, printable`, `How to say each time`, `Live Zulu clock` |
| Links out | Time Duration (#4), Time Zone Converter (#14, later), Time to Decimal (#16, later) |
| Links in | #4, Tools hub "Date & Time" |

## 5. Content (~1,200–1,500 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the military time converter | 4 tabs, input formats | 110 |
| 2 | How military time works | The rules with worked examples (1900, 0930, 1230) | 170 |
| 3 | Midnight and noon: 0000, 1200 and 2400 | The start/end-of-day explanation | 120 |
| 4 | How to say military time | Common usage (leading zero, "hundred hours", never "thousand"), with examples; cite Time and Date | 130 |
| 5 | How to read military hours | `what time is it at 1800 hours`, `military hours` | 90 |
| 6 | Military time chart | The chart (15-minute default, expand, print) | 60 + chart |
| 7 | Military time vs 24-hour notation | Same clock; colon vs no colon; "hours" suffix (`24-hour notation`) | 110 |
| 8 | Military time zones and Zulu time | Letters A–Z, J = local, Z = UTC | 120 |
| 9 | FAQ | §6 | 330 |

## 6. FAQ (10, from the competitor question bank + cluster keywords)

1. What is 1700 (or 1900, 1600, 2100, 1800, 1400) in military time?
2. How do I convert standard time to military time?
3. How do I convert military time to standard time?
4. Is midnight 0000 or 2400?
5. How do you say military time out loud?
6. What is 10 p.m. (or 10 a.m., 12 a.m.) in military time?
7. What is Zulu time?
8. Is military time the same as 24-hour time?
9. How do I calculate hours between two military times? (link #4)
10. Why do the military and hospitals use 24-hour time? (no AM/PM mix-ups; general, no statistics)

## 7. Done when

- [ ] `time-engine.ts` (parse, military, spoken) + tests; `npm run verify` passes.
- [ ] Chart rows generated by the engine; print stylesheet; hash anchors; no per-time URLs.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Registrations + docs; `graphify update .`.
