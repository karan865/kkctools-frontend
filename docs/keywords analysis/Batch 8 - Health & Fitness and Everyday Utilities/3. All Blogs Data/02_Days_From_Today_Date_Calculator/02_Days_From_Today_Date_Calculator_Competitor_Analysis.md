# Date Calculator — Days From Today / Days Ago: Competitor Analysis

> **Target page:** KKCTools `/days-from-today/` (Batch 8, Tool #2 ✅)
> **Primary keyword:** `what is 45 days from today`. US 22,200 · KD 5. The cluster has 73 keywords and about 1.74M US searches: 61 "X days/weeks/months from today" phrases (1.59M) and 11 "X ago" phrases (128k).
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 8. Competitors come from a live web search on 2026-11-14 for `what is 45 days from today calculator`, plus Time and Date's date-add tool. `TODO(owner): pull Google top 10 for 3–5 of the biggest phrases (e.g. "120 days from today", "90 days from today").`
> **Pages visited (2026-11-14):** 5 read. Inch Calculator /days-from/ (hub) and /45-days-from-today/ (per-number page), Time and Date date-add, Symbolab 45-days page, daysbetweencalculator.org 45-days page.

---

## 0. How this was collected (read first)

- **The SERP is full of per-number pages.**
  - Inch has one page per offset (30, 45, 60, 90, 120 days, from today and ago).
  - Symbolab has one per number, cloned on several subdomains.
  - daysbetweencalculator.org, timecal.net and outside.so do the same, alongside hijacked-domain spam (sagenext, joecoffee, westnyc).
  - **Keyword-file rule: never one URL per number.** That is thin, doorway-style content.
  - Our bet: one page with a strong tool plus a large **table computed in the browser**.
  - Risk: Google may reward the per-number pages. `TODO(owner)`: watch the rankings after launch; the rule stands unless the owner changes it.
- **Per-number pages hard-code "today".**
  - Inch and Symbolab write "today = November 14, 2026" into the page text, so the answer goes **stale** the next day unless it is regenerated.
  - daysbetweencalculator's examples are locked to 2025.
  - **Our static export must compute dates on the client after load** (keyword-file note). The HTML shows the method, and the browser fills in the dates.
- Google shows its own answer for some of these queries, so expect fewer clicks than the volume suggests (keyword note).
- **Arithmetic check:** 45 days from Nov 14, 2026 = **Tue, Dec 29, 2026** ✔. 45 weekdays = Fri, Jan 15, 2027 ✔.
- No competitor text was copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | inchcalculator.com/days-from/ | Calc site (hub) | Days From Today Calculator | 350–400 |
| 2 | inchcalculator.com/days-from/45-days-from-today/ | Calc site (per-number page) | What Date Is 45 Days From Today? | 400–450 |
| 3 | timeanddate.com/date/dateadd.html | Category authority | Date Calculator: Add to or Subtract From a Date | ~200 |
| 4 | symbolab.com/calculator/45-days-from-today | Maths solver (per-number) | 45 days from today | 150–200 |
| 5 | daysbetweencalculator.org/45-days-from-today | Exact-match site (per-number) | 45 Days From Today | ~550 |

**What this tells us:**
- **Inch's per-number page** shows the date, weekday, a 45-weekday result and a 9-row start-date table. **"Today" is hard-coded** and there's a garbled sentence. It sits in a series of near-identical pages.
- **Time and Date date-add** is the most flexible tool: add or subtract years, months, weeks and days, with a repeat option and links to include a time or certain weekdays. Business days are on a **separate tool**, and the page has about 200 words.
- **Symbolab** gives the correct date and a month-by-month working, but the date is static, and UI text leaks into the page.
- **daysbetweencalculator** has a dynamic calculator but **2025-locked examples**, an empty result in the capture, and an FAQ that promises business days the tool doesn't offer.
- **No page combines all of these:**
  - add or subtract days, weeks, months and years from **today or any date**
  - weekday, ISO week and day of the year
  - calendar days **and** business days (with rule-based holidays, shared with #1)
  - a **live table** (1–365 days, 1–52 weeks, 1–24 months, both from-today and ago) computed in the browser
  - a month-end clamping rule explained (Jan 31 + 1 month)
  - .ics download
  - copy and share

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Inch hub | Inch per-number | Time and Date | Symbolab | DaysBetweenCalc |
|---|---|---|---|---|---|
| Add days | ✅ | (fixed) | ✅ | (fixed) | ✅ |
| Subtract (ago) | ⚠️ (separate pages) | (separate page) | ✅ | ⚠️ (separate page) | ? |
| Weeks / months / years | ❌ | ❌ | ✅ | ❌ | ❌ |
| From any start date | ✅ | ⚠️ (table only) | ✅ | ⚠️ | ✅ |
| Weekday shown | ✅ | ✅ | ✅ | ✅ | ✅ |
| Week number / day of year | ❌ | ❌ | ? | ❌ | ❌ |
| Business days | ❌ (link) | ✅ (weekdays, no holidays) | ❌ (separate tool) | ❌ | ❌ (FAQ only) |
| Holidays excluded | ❌ | ❌ | ⚠️ (separate tool) | ❌ | ❌ |
| Month-end rule explained | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Live table, computed on the client** | ❌ | ❌ (static, dated) | ❌ | ❌ (static) | ❌ |
| Hours / minutes conversion | ❌ | ✅ | ❌ | ❌ | ❌ |
| .ics / add-to-calendar | ❌ | ❌ | ❌ | ❌ | ❌ |
| Copy / share | ✅ | ? | ? | ❌ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Inch hub | Inch 45 | Time and Date | Symbolab | DBC |
|---|---|---|---|---|---|
| "Today" handled correctly | n/a | ❌ (hard-coded) | ✅ (tool) | ❌ (hard-coded) | ⚠️ (2025 examples) |
| Manual method / Excel formula | ✅ (`=A1+60`) | ✅ (garbled) | ❌ | ✅ (month-by-month) | ✅ |
| Inclusive vs exclusive explained | ❌ | ❌ | ❌ | ❌ | ❌ |
| FAQ count | 0 | 0 | 0 | 0 | 3 |
| Named author | ✅ + PhD reviewer | ✅ | ❌ | ❌ | ❌ |
| Date | ❌ | ❌ | ❌ | ❌ | ⚠️ (© 2025) |
| Thin / doorway risk | low | **high** | low | **high** | **high** |

---

## 4. Competitor-by-competitor detail

### 1. Inch Calculator, Days From Today (hub)
- **Inputs:** number of days and a start date.
- **Methods covered:** manual counting, spreadsheet `=A1+60`, online calculator.
- **Links:** to 9 per-number pages and a business-day calculator.
- **Weak points:**
  - No business days in the tool.
  - No table and no FAQ.
  - Typo: "number of of".
  - An off-topic "5 years ago" link.

### 2. Inch Calculator, What Date Is 45 Days From Today? (per-number)
- **Shows:** Tue, Dec 29, 2026 ✔. 45 weekdays → Fri, Jan 15, 2027 ✔ (holidays not excluded). Hours, minutes and seconds ✔. A start-date table for Nov 10–18.
- **Weak points:**
  - **"Today" is hard-coded.**
  - A garbled sentence in the method.
  - No FAQ or week number.
  - A near-duplicate of its sibling pages (doorway pattern).

### 3. Time and Date: Date Calculator (add/subtract)
- **Inputs:** start date (Today button), add or subtract, years/months/weeks/days, a repeat option, plus include-time and weekday options.
- **Links:** Add Workdays and Business Date (holiday exclusion) are on separate tools.
- **Weak points:**
  - The intro doesn't mention weeks.
  - "Repeat" is unclear.
  - No FAQ.
  - Heavy navigation.

### 4. Symbolab: 45 days from today
- **Shows:** a result with working and a start-date chart (all ✔), plus an input form.
- **Weak points:**
  - Static date.
  - Templated, thin content.
  - UI text leaking into the page.
  - Awkward headings.

### 5. daysbetweencalculator.org: 45 Days From Today
- **Shows:** a dynamic calculator, about 550 words of generic copy, and 3 FAQs (45 days vs 1.5 months, bills, business days).
- **Weak points:**
  - 2025-locked examples and copyright.
  - The FAQ promises business days the tool doesn't offer.
  - No inclusive/exclusive rule.
  - No author or date.

---

## 5. Patterns

**Engine** (shared with #1)
- Date-only arithmetic, in UTC or as a Julian day number (JDN).
- **Days and weeks:** add n × 1 or n × 7 days.
- **Months and years:** calendar add with **end-of-month clamping**, e.g. Jan 31 + 1 month = Feb 28/29. Show the rule, and offer an option to roll over instead.
- **Business days:** step over weekdays, skipping US federal holidays computed by rule (shared module). Start-date convention: count starts the next day. State this.

**Outputs**
- Date
- Weekday
- ISO week
- Day of year
- Days remaining in year
- Relative label ("in 6 weeks 3 days")

**Live table** (rendered on the client after load)
- From today: days 1–365 (common values highlighted: 7, 10, 14, 21, 28, 30, 45, 60, 90, 100, 120, 150, 180, 270, 365), weeks 1–52, months 1–24.
- Ago: the same offsets, subtracted.
- The static HTML shows the method plus a "dates fill in when the page loads" note. No dates are baked in.
- **Never one URL per number.** Optional deep links via hash (`#45-days`) on the same page. `TODO(owner)`: confirm hash anchors are acceptable.

**Calendar export:** generate .ics with a Blob download. No network calls.

**What the 5 competitors cover**

| Section | Pages (of 5) |
|---|:---:|
| Add + subtract on one page | 1 |
| Months/years | 1 |
| Business days | 1 (weekdays only) |
| Live table | **0** |
| Month-end rule | **0** |
| .ics | **0** |
| Correct "today" handling | 2 |

---

## 6. FAQ question bank

★ = asked on 2+ pages or a cluster keyword. Map to the 73 phrases.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is 45 / 30 / 60 / 90 / 120 days from today? | all · long tail (1.59M) |
| 2 | ★ What day was 30 / 45 / 60 / 90 days ago? | Inch, Symbolab · ago long tail (128k) |
| 3 | ★ How do I count days from a date manually or in Excel? | Inch, Symbolab, DBC |
| 4 | ★ What about business days (excluding weekends and holidays)? | Inch per-number, DBC |
| 5 | Is 45 days the same as 1.5 months? | DBC |
| 6 | What is 6 weeks or 6 months from today? | long tail (`6 weeks from today`, `6 months from today`) |
| 7 | What happens when adding a month to Jan 31? | — (gap) |
| 8 | Does "from today" include today? | — (gap) |
| 9 | Can I add the date to my calendar? | — (gap) |
| 10 | What is "now − 30 days"? | `now - 30 days` |

---

## 7. Gaps nobody fills — our opportunities

1. **One flexible tool:** add or subtract days, weeks, months and years, from today or any date.
2. **Rich result:** weekday, ISO week, day of year, days left in the year, relative wording.
3. **Business days** with holidays computed by rule (shared with #1). No competitor does this on a from-today page.
4. **Live client-side tables** (1–365 days, 1–52 weeks, 1–24 months; both directions). Always correct for today, and never stale.
5. **Month-end clamping explained**, with an option to change it.
6. **.ics download** and copy/share.
7. **Clear conventions:** whether today is day 0, and inclusive vs exclusive.
8. **Avoid the doorway pattern.** One page plus hash anchors.
9. **Links:** Days Between Dates (#1), Days Until (#3), Weeks to Months (#30).

---

## 8. Blueprint for the KKCTools Days From Today Calculator

### 8.1 SEO

- **URL:** `/days-from-today/`
- **Title:** Days From Today Calculator – Add or Subtract Days
- **H1:** Days From Today: What Date Is 30, 60 or 90 Days From Now?
- **Meta:** as in the keyword file (148 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Inputs | Start (today default / any date), add/subtract, years, months, weeks, days, business-days toggle |
| Outputs | Date, weekday, ISO week, day of year, relative text |
| Tables | Days 1–365, weeks 1–52, months 1–24 (from today & ago), computed on load; highlight common values |
| Rules | Month-end clamp (option), business days with rule-based holidays |
| Export | .ics download, copy, share URL (params) |
| Engine | Shared date module (#1–#4) |

### 8.3 Content outline (≈ 900–1,200 words, original)

1. Intro and live quick answers (30/45/60/90 days)
2. How to use
3. How "days from today" is counted
4. Adding weeks, months and years (the month-end rule)
5. Business days from today
6. Days ago: counting backwards
7. Doing it in Excel or Google Sheets (`=TODAY()+45`, `WORKDAY`)
8. Tables (live)
9. FAQ (10)
10. Related tools: Days Between Dates (#1), Days Until (#3), Weeks to Months (#30)

### 8.4 Quality checks

- **Unit tests:**
  - month-end clamping
  - leap years
  - business days across holidays
  - subtract mode
  - ISO week edge cases (Dec 29–Jan 3)
  - table generation with a mocked "today"
- The static HTML contains no hard-coded results.
- No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - pull Google top 10 for the head phrases
  - confirm the hash-anchor approach
  - monitor rankings vs the per-number pages
