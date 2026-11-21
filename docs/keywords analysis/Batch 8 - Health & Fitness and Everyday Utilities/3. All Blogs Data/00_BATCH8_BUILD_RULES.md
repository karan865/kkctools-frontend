# Batch 8 — Build Rules (Part 1: Date & Time 01–05 · Part 2: tools 06–10 · Part 3: tools 11–12)

> **Read before every Batch 8 spec 01–05.** Builder: Antigravity / Gemini.
> **Scope of this part:** tools 01–05 (Days Between Dates, Days From Today, Days Until, Time Duration, Military Time). Tools 06–32 get their own part later (unit converters, fitness/YMYL, timers); this file will grow, so keep the section numbers.
> **Inputs used:** `KKCTools_Batch8_Final_Tool_Keywords.md` (Semrush US, Oct 2026), competitor analyses 01–05, official sources opened on 2026-11-22 (§3).
> **Written:** 2026-11-22

---

## 0. Status: provisional (no Semrush SERP export)

`TODO(owner)`: pull the top 10 (Domain AS) for `date duration calculator`, `what is 45 days from today`, `days until calculator`, `time adder`, `military time converter`; and the missing heads `days between dates calculator`, `date calculator`, `time calculator`.

**Expect fewer clicks than the volumes:** Google answers many short date questions itself ("what is 90 days from today"). The pages must beat the answer box with tables, business days, holidays, countdowns and charts.

## 1. Project rules (AGENTS.md wins on any conflict)

**Never:**
- network calls (no time server, no holiday API): dates come from the device clock and our own rules (`npm run check:no-network`);
- **one URL per number** ("90 days from today", "1700 military time", "days until May 22" are table rows or presets on one page; hash anchors like `#90-days` are allowed);
- dates or counts baked into the static HTML that go stale ("today is Nov 14"): anything relative to today renders on the client after load;
- holiday dates typed in year by year: they are computed by rule (§4);
- invented facts (e.g. "most people…"), copying competitor text, ratings or `aggregateRating`, committing or pushing.

**Always:**
- `TODO(owner)` for owner-supplied facts; engine first (pure functions, "today" injected so tests can fix it); every number in the BLUF, examples and FAQ from the engine; **each spec's worked example is a unit test**.
- `npm run verify` from PowerShell or the VS Code terminal, never Git Bash.
- graphify: `graphify query` before searching code; `graphify update .` after changes; run from PowerShell; exe `$(ls ~/AppData/Roaming/Python/*/Scripts/graphify.exe | head -1)`.

## 2. Accuracy rules (how these pages beat the SERP)

1. **Date-only maths in UTC day numbers** (`Date.UTC(y, m-1, d) / 86400000`), never local `Date` arithmetic, so DST and time zones can't shift a date.
2. **State every counting convention on screen:**
   - days between: end date **excluded** by default, "include end date" toggle (+1);
   - days until: today = day 0, so "Thanksgiving is 4 days away" on Nov 22 (toggle to include today);
   - business days **between** two dates: both dates counted when they are weekdays (this matches Excel's NETWORKDAYS: our engine reproduces Microsoft's example 2012-10-01 → 2013-03-01 = **110**);
   - business days **from** a date: counting starts the next day (matches Excel's WORKDAY: 2008-10-01 + 151 = **2009-04-30**, Microsoft's example).
3. **Month arithmetic clamps to the month end:** Jan 31 + 1 month = Feb 28 (Feb 29 in a leap year). Shown as a rule, with an option to roll over (Jan 31 + 1 month = Mar 3/2).
4. **Y/M/D differences use month-stepping, not the "borrow" rule.** Borrowing gives 2026-01-31 → 2026-03-01 = 0 m −2 d; stepping gives **1 month 1 day**. (Batch 5 Age Difference spec updated to the same rule on 2026-11-22.)
5. **12-hour rules done right:** 12:xx AM = 00:xx; 12:xx PM = 12:xx; 1–11 PM add 12 **to the hour**. Several competitors get 12 o'clock wrong (Inch, Omni, OnTheClock).
6. **"X hours from now" uses real elapsed time;** when the span crosses a DST change, show a note with the wall-clock difference (§4 fixture).
7. **Live values render on the client;** the static HTML shows the method and placeholders ("dates fill in when the page loads"), never a date.

## 3. Sources opened on 2026-11-22 (cite these)

| Fact | Value | Source | Status |
|---|---|---|---|
| US federal holidays | New Year's Day (Jan 1); Birthday of Martin Luther King, Jr. (3rd Monday in January); Washington's Birthday (3rd Monday in February); Memorial Day (last Monday in May); Juneteenth National Independence Day (June 19); Independence Day (July 4); Labor Day (1st Monday in September); Columbus Day (2nd Monday in October); Veterans Day (Nov 11); Thanksgiving Day (4th Thursday in November); Christmas Day (Dec 25) | 5 U.S.C. § 6103(a), law.cornell.edu/uscode/text/5/6103 | ✅ |
| Observed: Saturday | "the Friday immediately before is a legal public holiday" (Mon–Fri workweek) | 5 U.S.C. § 6103(b)(1) | ✅ |
| Observed: Sunday | next workday (Monday) | Executive Order 11582 §3(a) (on the same Cornell page); OPM federal holidays page | ✅ |
| Inauguration Day | Jan 20 every 4th year, only in some areas | 5 U.S.C. § 6103(c) | ✅ (excluded by default; mention in FAQ) |
| OPM observed dates | 2026: July 4 (Sat) → Fri July 3. 2027: Juneteenth (Sat) → Fri June 18; July 4 (Sun) → Mon July 5; Christmas (Sat) → Fri Dec 24 | opm.gov federal holidays | ✅ (summary) — **reproduced by our rules** (§4) |
| Excel | `DATEDIF(start,end,unit)` units Y/M/D/MD/YM/YD; Microsoft: "We don't recommend using the "MD" argument"; start > end → #NUM! · `NETWORKDAYS(start,end,[holidays])` · `WORKDAY(start,days,[holidays])` (negative = past) · `EDATE(start,months)` · `ISOWEEKNUM(date)` | support.microsoft.com (each function page) | ✅ |
| Google Sheets | `NETWORKDAYS(start_date, end_date, [holidays])`; `WORKDAY(start_date, num_days, [holidays])` (negative counts back) | support.google.com/docs/answer/3092979, /3093059 | ✅ |
| ISO 8601 week | week 01 has the year's first Thursday (contains Jan 4); weeks start Monday; 52 or 53 weeks | en.wikipedia.org/wiki/ISO_week_date | ⚠ secondary (ISO text is paywalled); name the rule, cite as "ISO 8601 (summary)" |
| Easter | Anonymous Gregorian algorithm (Nature 1876; reprinted by Butcher, Spencer Jones, Meeus) | en.wikipedia.org/wiki/Date_of_Easter | ⚠ secondary; **our engine reproduces 2026-04-05** and other known dates (§4) |
| Military time | leading zero spoken ("zero one"); full hours "hundred hours" (1000 = "ten hundred hours"); never "thousand"; 0945 = "zero nine forty-five hours"; 0000 "zero hundred hours"; 2400 = "twenty-four hundred hours" = midnight (end of day) | timeanddate.com/time/military-time.html | ✅ (describe as common usage; no official style guide opened) |
| Military zone letters | A–I = UTC+1…+9, K–M = +10…+12, N–Y = UTC−1…−12, Z = UTC ("Zulu"); J ("Juliet") = the speaker's local time, not a zone | timeanddate.com/time/zones/military and the military-time article | ✅ |

`TODO(owner)`: decide whether to add non-US holiday sets later (UK bank holidays, Canada); this batch ships US federal + a short list of popular US dates (§4) + custom holidays.

## 4. Shared code

| File | Exports | Used by |
|---|---|---|
| `src/lib/date-diff-engine.ts` (+ test) — **shared with Batch 5 #2 Age Difference**; if Batch 5 hasn't built it yet, build it here to the Batch 5 interface | `dayNumber(ymd)`, `fromDayNumber(n)`, `daysBetween(a, b, {includeEnd})`, `ymdDiff(a, b)` (month-stepping), `addDays`, `addMonths(ymd, k, {clamp: true})`, `addYears`, `weekday`, `isoWeek`, `dayOfYear`, `daysLeftInYear`, `isLeap`, `parseDateInput` | 01 02 03 |
| `src/lib/holidays-us.ts` (+ test) | `nthWeekday(y, m, dow, n)`, `lastWeekday(y, m, dow)`, `federalHolidays(y)` with `observed` dates (Sat → Fri, Sun → Mon), `popularDates(y)` (Easter, Mother's Day 2nd Sun May, Father's Day 3rd Sun June, Halloween, Valentine's, Christmas Eve, New Year's Eve, Canada Thanksgiving 2nd Mon Oct), `easter(y)` | 01 02 03 |
| `src/lib/business-days.ts` (+ test) | `businessDaysBetween(a, b, {holidays})` (inclusive, NETWORKDAYS-style), `addBusinessDays(a, n, {holidays})` (WORKDAY-style) | 01 02 03 |
| `src/lib/time-engine.ts` (+ test) | `parseClock("5:30 pm" \| "17:30" \| "1730" \| "17:30:15")`, `toMinutes`, `durationBetween(a, b)` (overnight roll-over), `formatHMM`, `toDecimalHours(min, dp)`, `addDuration`, `parseDurationExpr("1h 30m + 45m − 10m")`, `toMilitary`, `fromMilitary`, `spokenMilitary`, `fromNow(nowMs, minutes, tz)` with a DST-change flag | 04 05 (+ later 14 15 16) |
| `src/components/tool/date/LiveDateTable.tsx` | client-only table of offsets (renders a placeholder on the server) | 02 03 04 |
| `src/lib/ics.ts` | build an `.ics` VEVENT string for a date (Blob download) | 02 03 |

**Fixtures checked with node (2026-11-22; `b8` script):**

| Check | Result |
|---|---|
| Federal holidays 2026 | Jan 1 (Thu), MLK Jan 19, Washington Feb 16, Memorial May 25, Juneteenth Jun 19 (Fri), **Jul 4 (Sat) → observed Fri Jul 3**, Labor Sep 7, Columbus Oct 12, Veterans Nov 11 (Wed), **Thanksgiving Nov 26**, Christmas Dec 25 (Fri) |
| Observed 2027 | Juneteenth Jun 19 (Sat) → **Jun 18**; Jul 4 (Sun) → **Jul 5**; Christmas (Sat) → **Dec 24** (= OPM ✔) |
| Observed 2028 | **New Year's Day Jan 1, 2028 (Sat) → Fri Dec 31, 2027** (falls in the previous year: the business-day code must look one year ahead); Veterans Nov 11 (Sat) → Nov 10 |
| Business days in 2026 | 261 weekdays; **250** after the 11 observed federal holidays |
| NETWORKDAYS example | 2012-10-01 → 2013-03-01 = **110** (Microsoft ✔) |
| WORKDAY example | 2008-10-01 + 151 = **2009-04-30** (Microsoft ✔) |
| Easter | 2024-03-31, 2025-04-20, **2026-04-05**, 2027-03-28, 2028-04-16, 2100-03-28 |
| ISO weeks | 2026-11-22 = **2026-W47**; 2026-12-31 and 2027-01-01 = **2026-W53**; 2027-01-04 = 2027-W01; 2021-01-03 = 2020-W53; 2012-03-09 = W10 (Microsoft's ISOWEEKNUM example ✔) |
| DST | 16 hours after 2026-10-31 20:00 EDT = **Nov 1, 11:00 AM EST** (elapsed); wall-clock arithmetic would say 12:00 PM |

## 5. Shared UI

- `ToolShell` (the spec's 4 **true** pills), `TabSlider` (`?tab=`).
- **`<main>` element:** `<main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>`.
- Date inputs: native `<input type="date">` plus a typed fallback that accepts `2026-11-22`, `11/22/2026` and `22 Nov 2026` (US order labelled); time inputs accept 12- and 24-hour forms.
- **Input guide diagram ABOVE the inputs** (same rule as Batches 3–7): `<Name>InputGuide.tsx`, inline SVG, numbered callouts = numbered labels, live values, focus highlight, `role="img"` + title/desc, tokens only (light + dark), mobile `<details>`, one diagram per tab. Date tools use a mini calendar / timeline; time tools a clock face.
- Share URLs carry the inputs (`?start=2026-11-22&end=2027-07-04&incl=1&biz=1`), never personal data.
- **New catalog category `Date & Time`** with the first tool. Hub links: Days Between ↔ Days From Today ↔ Days Until ↔ Time Duration ↔ Military Time; later Weeks to Months (#30), Time Zone (#14), Unix Timestamp (#15), Time to Decimal (#16), Online Timer (#28); Batch 5 Age Difference.

## 6. Files a tool touches

**New:** engine + test (shared ones once); component folder (calculator, InputGuide, `index.ts`); `src/app/<slug>/page.tsx` + `page.module.css`.

**Edit:** `routes.ts`; `tools-catalog.ts` + count test; `calculation-methods.ts`; `ToolArt.tsx`, `Icons.tsx`, `Footer.tsx`; docs 00/01/02/04/06.

## 7. Page structure and SEO

- `buildMetadata`, with `absoluteTitle` when the title + " | KKC Tools" is over 60 (#2 Days From Today).
- Breadcrumbs, then JsonLd (WebApplication + FAQPage + BreadcrumbList).
- Calculator above the fold, working on load (today's date filled on the client).
- BLUF in the first 60 words: a rule plus a **fixed-date example** (e.g. "45 days after Nov 14, 2026 is Tue, Dec 29, 2026"), never "today is …" in static text; a live line ("Today + 45 days = …") fills in on the client.
- Result sentence; steps; H2s per spec; FAQ once; HowWeCalculate (conventions, holiday rules with § 6103 citation, Excel equivalents); related links.
- **Long-tail tables:** real HTML tables rendered on the client from the engine, with `id` anchors (`#45-days`); the server HTML includes the table header and a short method note so the page isn't empty without JavaScript.
- AdSlots outside the band. Mobile 390 px: no page-level horizontal scroll.

## 8. Build order (Part 1)

| Order | Spec | Why here |
|---:|---|---|
| 1 | **01 Days Between Dates** + `date-diff-engine` + `holidays-us` + `business-days` | builds the date engine |
| 2 | **02 Days From Today** + `LiveDateTable` + `ics` | biggest long tail |
| 3 | **03 Days Until** | reuses everything |
| 4 | **05 Military Time** + `time-engine` | keyword file puts it before Time Duration |
| 5 | **04 Time Duration** | reuses `time-engine` |

**Stops:** after order 1 (owner reviews the date engine and pattern); after order 5.


---

# Part 2 — Tools 06–10 (Roman Numerals, Fraction to Decimal, Cooking, Army Body Fat, One Rep Max)

> **Added:** 2026-11-22. Part 1 rules (§1 project rules, §5 shared UI, §6 files, §7 page/SEO) apply to these tools too. This part adds what is new.

## 9. Status

`TODO(owner)`: pull the top 10 for `roman numeral conversion`, `fraction to decimal chart`, `how many tbsp in 1/2 cup`, `convert cups to ml`, `army calculator for body fat`, `1rm predictor`, `strength calculator`; and the missing heads `roman numeral converter`, `one rep max calculator`.

## 10. Accuracy rules for Part 2

1. **Exact arithmetic, never floats, for anything printed to fixed decimals.**
   - Fractions and inch → mm use rational maths: mm = n × 254 ÷ (10 × d), rounded **half-up** on the exact value.
   - The float trap: `(1/16 * 25.4).toFixed(3)` gives **1.587**; the exact 1.5875 rounds to **1.588**. (Metal Supermarkets' table truncates the same way.) Unit test this.
   - WHtR compares with integers or rationals: `waist × 100 < 55 × height`, so 38.5 ÷ 70 = 0.55 exactly → does **not** meet.
2. **Unit definitions come from exact chains, cited once** (§11): 1 in = 2.54 cm; 1 US gal = 231 in³; 1 US fl oz = 1/128 gal; 1 imperial gal = 4.54609 L.
3. **Roman numerals:** canonical form = the greedy encoding; any input that doesn't match its own canonical form is shown as "not standard" with the rule it breaks (IIII is accepted with a clock-face note).
4. **Fitness pages are estimates.** Show "estimate, not medical advice"; name every formula and its source; no strength or body-fat "standards" tables unless from an official or licensed dataset.
5. **Army page: only the current official standard.** AD 2026-13 replaced tape tests with WHtR (§11). Never present a rescinded method as current; never show a tape-test formula we couldn't verify.

## 11. Sources opened on 2026-11-22 (Part 2)

| Fact | Value | Source | Status |
|---|---|---|---|
| **Army body composition standard** | "WHtR is adopted as the sole measurement for all Soldiers. The use of height and weight screening tables is discontinued." No tape test or other body-fat method may challenge it. "The standard is a WHtR of less than and not equal to 0.55." WHtR ≥ 0.55 → flagged and enrolled in ABCP. Measured at least twice a year; a confirmation measurement the same day by a different team. "No AFT score exempts a Soldier." | **Army Directive 2026-13** (Army Body Composition Program and Standards), 1 July 2026, ACTIVE — armypubs.army.mil (PUB_ID 1033414; PDF ARN47030) | ✅ read from the PDF |
| What AD 2026-13 rescinds | AD 2023-11 (one-site tape test), AD 2023-08 and AD 2025-17 (fitness-score exemptions); supersedes AD 2025-18 in part; AR 600-9 (16 July 2019) to be revised within 2 years | same, references list | ✅ |
| Other references in AD 2026-13 | DoDI 1308.03 (10 May 2022, Change 1 effective 25 June 2025); Under Secretary memo "Additional Guidance on Military Fitness Standards" (18 Dec 2025) | same | ✅ titles only (not opened) |
| WHtR measurement procedure (where on the waist, rounding) | — | not in AD 2026-13 ("G-1 will publish implementing guidance") | ❌ `TODO(owner)`: find the G-1 implementing guidance / DA Form 5500 instructions before writing measuring steps |
| Marine Corps / other services | — | HPRC page 404; DoD memo not opened | ❌ `TODO(owner)`: no other-service mode until verified |
| US customary cup | 236.5882365 mL exactly (8 US fl oz); 1 tbsp = ½ fl oz; 3 tsp = 1 tbsp | derived from NIST constants (231 in³ gal, 2.54 cm in); Wikipedia "Cup (unit)", "Tablespoon" | ✅ (exact derivation; `TODO(owner)`: cite NIST Handbook 44 App. C directly) |
| US nutrition-label cup / tbsp | 240 mL / 15 mL | 21 CFR 101.9(b)(5)(viii), via Wikipedia (eCFR redirect blocked) | ⚠ secondary: `TODO(owner)` open eCFR in a browser |
| Metric cup; Japanese cup; Australian tbsp | 250 mL; 200 mL; 20 mL (4 tsp) | Wikipedia "Cup (unit)", "Tablespoon" (secondary citations) | ⚠ secondary: label as "common standard"; `TODO(owner)`: a national-body source |
| Imperial fl oz / cup | 28.4130625 mL (1/160 imperial gal); ½ imperial pint = 10 fl oz = 284.130625 mL | derived from the 4.54609 L imperial gallon | ✅ derivation (`TODO(owner)`: cite the UK Weights and Measures Act schedule) |
| Unicode Roman numerals | Ⅰ–Ⅻ U+2160–216B; Ⅼ Ⅽ Ⅾ Ⅿ U+216C–216F; small ⅰ–ⅿ U+2170–217F; ↀ ↁ ↂ U+2180–2182; "compatibility characters" | Wikipedia "Number Forms" (Unicode chart redirect not followed) | ✅ code points |
| Roman numeral range and vinculum | standard form max 3,999 (MMMCMXCIX); a bar (vinculum) multiplies by 1,000; clocks often use IIII | Wikipedia "Roman numerals" | ✅ (secondary; stated as convention) |
| 1RM formulas | Epley w(1 + r/30) (Epley 1985, *Poundage Chart*); Brzycki w × 36/(37 − r) (Brzycki, *A Practical Approach to Strength Training*, McGraw-Hill); Lombardi w × r^0.10; Mayhew, Wathen, O'Conner (no source in the table) | Wikipedia "One-repetition maximum" | ⚠ Epley/Brzycki sourced; others `TODO(owner)` before showing them |
| RPE / reps in reserve | RPE 10 = 0 reps in reserve … | Zourdos et al. 2016 (PubMed blocked) | ❌ `TODO(owner)`: confirm; until then label the RPE table "derived from Epley + reps in reserve (our method)" |

## 12. Shared code (Part 2)

| File | Exports | Used by |
|---|---|---|
| `src/lib/roman-engine.ts` (+ test) | `toRoman(n, {vinculum, lower, unicode})`, `parseRoman(s)` → `{value, canonical, issues[]}`, `romanDate(y, m, d, layout, sep)`, `breakdown(n)` | 06 |
| `src/lib/fraction-engine.ts` (+ test) — reuse Batch 5 Fraction to Percent's parser if it exists | `parseFraction("3 3/8" / "27/8" / "⅜" / "-1/3")`, `toDecimal(n, d) → {terminating, digits, repetend}`, `nearest(x, 2^k) → {fraction, error}`, `toMm(n, d, dp)` (exact half-up), `toMixed`, `compare` | 07, 08 |
| `src/lib/kitchen-units.ts` (+ test) | standards `{us, usLegal, metric, metricAuTbsp, imperial, japan}` in mL, `convert`, `nearestPractical`, `practicalCombo(mL, standard, maxParts)`, `scale`, `addAmounts` | 08 (later 17, 18) |
| `src/lib/whtr-engine.ts` (+ test) | `whtr(waist, height)` (same units, rational), `meetsArmyStandard`, `maxWaistFor(height)`, `table(heights)` | 09 |
| `src/lib/one-rep-max-engine.ts` (+ test) | `epley`, `brzycki` (r < 37), `lombardi`, `average`, `percentTable`, `repsAtPercent` (inverse Epley), `rpeTable`, `roundToPlates(x, step)` | 10 (later 32) |

**Fixtures checked with node (2026-11-22, `b8b` script):**

| Check | Result |
|---|---|
| Roman | 4 = IV · 14 = XIV · 49 = XLIX · 99 = XCIX · **1994 = MCMXCIV (M + CM + XC + IV)** · 2026 = MMXXVI · 3999 = MMMCMXCIX; every 1–3,999 round-trips |
| Non-standard inputs | IIII → 4 (IV); IC → 99 (XCIX); VX → 5 (V); IIX → 10 (X); MDCCCCVI → 1906 (MCMVI) |
| Roman dates | 07.04.1776 → VII.IV.MDCCLXXVI; 11.22.2026 → XI.XXII.MMXXVI |
| Fractions | 3/8 = 0.375 = **9.525 mm**; 5/16 = 0.3125 = 7.938 mm; 1/64 = **0.397 mm**; 1/16 = **1.588 mm**; 1/3 = 0.(3); 2/7 = 0.(285714); 27/8 = 3 3/8 = 3.375; 13/5 = 2 3/5 |
| Nearest inch fraction | 2.695 → **2 11/16** (error −0.0075 in = −0.190 mm); 0.3 → 19/64 (−0.0031 in) |
| Compare | 19/32 vs 5/8: 5/8 is larger by 1/32 in = **2/64 = 0.794 mm** |
| Kitchen (US) | 1 cup = 236.5882365 mL; **½ cup = 8 tbsp**; ⅓ cup = 5 tbsp + 1 tsp; ¾ cup = 12 tbsp; **half of ¾ cup = 6 tbsp**; ¾ + ¾ cup = 1½ cups; 150 mL = 0.634 US cup (TheCalculatorSite's 0.64 is off); 0.4 cup ≈ ⅓ cup + 1 tbsp + ¼ tsp |
| 1RM 100 kg × 5 | Epley **116.67**, Brzycki **112.50**, Lombardi **117.46**, average 115.54, spread 4.96 |
| 1RM 100 kg × 10 | Epley = Brzycki = **133.33** (Fitness Volt says they differ); Lombardi 125.89 |
| Epley % at 4 / 6 / 12 reps | 88.2 / 83.3 / 71.4 % (GIGA's 89 / 84 / 72 are off) |
| WHtR | 70 in height, 38 in waist = 0.5429 **meets**; 38.5 in = **0.5500 does not meet**; max waist for 70 in: under 38.5 in |

## 13. New catalog categories

- **`Everyday Conversions`** with 06 (Roman), 07 (Fraction), 08 (Cooking); later 17 Grams to Cups, 18 Water Weight, 31 Degrees ↔ Radians. Hub: Fraction ↔ Cooking ↔ Grams to Cups ↔ Batch 5 Metric Conversion; Roman ↔ Batch 6 Numbers to Words.
- **`Health & Fitness`** with 09 (Army) and 10 (1RM); a shared **methodology & sources page** (`/health-methodology/`; `TODO(owner)`: reviewer name, only with permission) linked from every health tool. 1RM links to Barbell Plate (#32) and FFMI (#26) when live.

## 14. Build order (Part 2)

| Order | Spec | Why here |
|---:|---|---|
| 6 | **06 Roman Numeral** + `roman-engine` | zero YMYL, KD 0–6 |
| 7 | **07 Fraction to Decimal** + `fraction-engine` | huge long tail |
| 8 | **08 Cooking Measurement** + `kitchen-units` | reuses the fraction parser |
| 9 | **10 One Rep Max** + `one-rep-max-engine` | low-risk fitness |
| 10 | **09 Army Body Fat (WHtR)** + `whtr-engine` | **blocked on the measuring-procedure source and a reviewer** |

**Stops:** after order 6 (new category pattern); after order 10.


---

# Part 3 — Tools 11–12 (Heart Rate Zones, Ideal Weight)

> **Added:** 2026-11-22. Parts 1–2 apply (project rules, shared UI, files, page/SEO, §10 rule 4 fitness estimates, §13 Health & Fitness hub). This part adds what is new.

## 15. Status

`TODO(owner)`: pull the top 10 for `heart rate zones calculator`, `heart rate zones by age`, `compute ideal weight`, `figuring out ideal body weight`, `correct weight for 5'4 female`. **Both tools are YMYL: a qualified reviewer signs off before launch.**

## 16. Rules for health formulas (Part 3)

1. **Ranges first, never one "ideal" number** (keyword file). Ideal weight shows the 4-formula range next to the CDC healthy-BMI range; heart rate shows every method side by side.
2. **Each formula is shown with its name, year and status** from §17. A formula whose source we couldn't open is shown with "citation to confirm" in HowWeCalculate until the owner confirms it; it never appears in the BLUF as fact.
3. **Medical guard rails:** "estimate, not medical advice"; heart-rate page adds a plain medication/heart-condition note ("talk to your doctor"); ideal-weight page adds "adults 20+ (CDC)" and "not for pregnancy, children or dosing".
4. **Native units for native formulas:** Hamwi is defined in pounds (106 lb + 6 lb per inch over 5 ft for men; 100 lb + 5 lb per inch for women), Devine/Robinson/Miller in kg per inch. Convert only for display (1 lb = 0.45359237 kg).

## 17. Sources opened on 2026-11-22 (Part 3)

| Fact | Value | Source | Status |
|---|---|---|---|
| Max HR (rule of thumb) | "about 220 minus your age" | American Heart Association, "Target Heart Rates" (last reviewed Aug 12, 2024) | ✅ |
| Intensity bands | moderate "about 50-70% of maximum heart rate"; vigorous "about 70-85% of maximum" | same | ✅ |
| AHA age table | 20 → 100–170 bpm (max 200) · 30 → 95–162 (190) · 40 → 90–153 (180) · 50 → 85–145 (170) · 60 → 80–136 (160) · 70 → 75–128 (150) | same | ✅ **reproduced by our engine** |
| Resting HR | "between 60 and 100 beats per minute is normal" for most adults | same | ✅ |
| Karvonen | target = (max − rest) × % + rest; Karvonen, Kentala, Mustala 1957, *Ann Med Exp Biol Fenn* 35(3):307–15 | Wikipedia "Heart rate" (summary) | ✅ formula / ⚠ citation via secondary |
| Tanaka | 208 − 0.7 × age (Tanaka, Monahan, Seals 2001, *J Am Coll Cardiol* 37:153–156) | publisher and PubMed blocked | ⚠ `TODO(owner)` confirm |
| Gulati (women) | 206 − 0.88 × age (Gulati et al. 2010, *Circulation*) | publisher blocked | ⚠ `TODO(owner)` confirm |
| MAF | "Subtract your age from 180", then −10 / −5 / 0 / +5 by category; not for 16 and under | philmaffetone.com/180-formula (updated Jul 2020) | ✅ (label as a coaching method, not medical) |
| 5-zone model | 50–60 / 60–70 / 70–80 / 80–90 / 90–100 % | none opened | ❌ label "common 5-zone model (convention)"; `TODO(owner)`: a citation, or keep the label |
| CDC adult BMI | underweight < 18.5; **healthy 18.5 to less than 25**; overweight 25 to < 30; obesity ≥ 30 (classes 30–35, 35–40, ≥ 40); adults 20+; "BMI is a screening measure" | cdc.gov/bmi/adult-calculator/bmi-categories.html (Mar 19, 2024) | ✅ |
| Devine (1974) | men 50 kg + 2.3 kg per inch over 5 ft; women 45.5 + 2.3 | Wikipedia "Human body weight" (metric form ≈ 0.9 kg/cm) | ✅ secondary |
| Hamwi (1964) | men 106 lb + 6 lb/in; women 100 lb + 5 lb/in (Wikipedia metric: 48 kg + 1.1 kg/cm; 45.4 + 0.9) | same | ✅ secondary |
| Robinson (1983), Miller (1983) | men 52 + 1.9 / 56.2 + 1.41 kg per inch; women 49 + 1.7 / 53.1 + 1.36 | not on the page read | ⚠ `TODO(owner)`: confirm via Pai & Paloucek 2000 (*Ann Pharmacother* 34:1066–1069) |
| Origin of IBW formulas | made for drug dosing / diet planning, not health targets | Pai & Paloucek 2000 (title cited on Wikipedia) | ⚠ title only |

## 18. Shared code (Part 3)

| File | Exports | Used by |
|---|---|---|
| `src/lib/heart-rate-engine.ts` (+ test) | `maxHr(age, {formula: fox \| tanaka \| gulati}, tested?)`, `zonesPctMax(max, model)`, `zonesKarvonen(max, rest, model)`, `ahaBands(max)`, `maf(age, category)`, `ageTable(ages)`; rounding: nearest bpm | 11 (later 20 TDEE, 23 Calories Burned may link) |
| `src/lib/body-metrics-engine.ts` (+ test) | `ibw(heightIn, sex)` → `{devine, robinson, miller, hamwi}` (kg; Hamwi computed in lb), `ibwRange`, `bmiWeightRange(heightM)` (CDC 18.5 to < 25), `bmi(weightKg, heightM)`, `frame(hamwi, small \| large ±10 %)`, unit helpers | 12 (later 24 BMI, 19 Body Fat, 25 Weight Loss reuse) |

**Fixtures checked with node (2026-11-22):**

| Check | Result |
|---|---|
| Age 40, resting 60 | Fox 180 · Tanaka 180 · Gulati 170.8 · **zone 2 (60–70 %): 108–126 bpm by %max, 132–144 by Karvonen** · MAF 140 · AHA moderate 90–126, vigorous 126–153 |
| AHA table | 20 → 100–170 · 40 → 90–153 · 70 → 75–128 (= AHA ✔) |
| Ideal weight 5'10" man | Devine 73.0 · Robinson 71.0 · Miller 70.3 · Hamwi 75.3 kg (166 lb) → range **70.3–75.3 kg (155–166 lb)**; CDC BMI range **58.5–79.0 kg (129–174 lb)** (Calculator.net's 59.9–81 doesn't match CDC) |
| Ideal weight 5'4" woman | Devine 54.7 · Robinson 55.8 · Miller 58.5 · Hamwi 54.4 kg → **54.4–58.5 kg (120–129 lb)**; BMI range 48.9–66.1 kg (108–146 lb) |

## 19. Build order (Part 3)

| Order | Spec | Note |
|---:|---|---|
| 11 | **11 Heart Rate Zone** + `heart-rate-engine` | reviewer before launch |
| 12 | **12 Ideal Weight** + `body-metrics-engine` | reviewer before launch; **STOP** after |
