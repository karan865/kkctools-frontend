# Time Zone Converter (US Zones, UTC, IST) — Competitor Analysis

> **Target page:** KKCTools `/time-zone-converter/` (Batch 8, Tool #14 🟡)
> **Primary keyword:** `pst to est converter` — US 8,100 · KD 1 · rising.
> - Cluster: 109 keywords, 1,616,800 US searches.
> - Biggest terms: `what time zone am i in` (135,000 / KD 29), `central time to eastern time` (33,100 / KD 6), `convert time difference` (27,100 / KD 25), `what timezone am i in` (18,100 / KD 12).
> - Long tail: 78 zone-pair phrases (926,800) and 24 zone-name/abbreviation phrases (462,800).
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 8. Competitors come from a live web search on 2026-11-14 for `pst to est converter`, plus the two known category leaders (Time and Date, Time.is).
> - Other results seen but not audited: time.tz, 24timezones, codeitbro, xconvert, time.now, iformat.io.
> - Spam/parasite pages were also seen in the results (on oli.org and cloudns subdomains). They are not audited.
> - `TODO(owner): pull Google top 10 for "pst to est converter", "central time to eastern time" and "what time zone am i in".`
> **Pages visited (2026-11-14):** 5 read: World Time Buddy (PST→EST), Time and Date (Time Zone Converter), Koalendar (PST→EST tool), ConvertTime (PST→EST), Time.is (home).

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Dedicated time sites: Time and Date, World Time Buddy, Time.is, time.tz, 24timezones.
  - Scheduling SaaS lead-gen: Koalendar.
  - Thin converter farms with one page per pair: ConvertTime, xconvert, iformat.io, codeitbro.
  - Google's own answer box, which answers "9 am pst to est" directly.
- **The rank chance is 🟡 for two reasons:**
  - Google answers many pair queries itself.
  - Time and Date and World Time Buddy are strong domains.
- **Strategy (from the keyword file):**
  - Launch one strong page first.
  - Add a few pair pages (PST↔EST, CST↔EST, UTC↔EST) only if the main page ranks, each with its own full table.
  - **Never** publish one page per hour.
- **The industry-wide error: "the PST–EST offset changes with DST".**
  - Koalendar and ConvertTime both say the PST/EST offset shifts during the year because of DST.
  - It doesn't. All US zones that observe DST switch on the same dates (second Sunday in March → first Sunday in November), so the gap stays **3 hours**.
  - Only the labels change (PST→PDT, EST→EDT).
  - **The real nuance nobody explains:** each zone switches at **2:00 a.m. local time**, so Eastern switches 3 hours before Pacific. For a few hours on each changeover night, the gap is briefly different:
    - **In March it is 4 hours.** Eastern is already on EDT (UTC−4) while Pacific is still on PST (UTC−8), from 07:00 to 10:00 UTC.
    - **In November it is 2 hours.** Eastern is back on EST (UTC−5) while Pacific is still on PDT (UTC−7), from 06:00 to 09:00 UTC.
  - Our engine (Intl API with IANA zones) handles this automatically. Our page explains it correctly.
- **Where DST really does change an offset:**
  - **Mixed pairs:** US ↔ India (IST has no DST), US ↔ UK/EU (they change on different dates), and US ↔ Arizona (most of Arizona stays on MST).
  - **Examples:**
    - EST↔IST is 10 h 30 m in winter and 9 h 30 m in summer.
    - PST↔MST (Arizona) is 1 h in winter and 0 h in summer.
    - US↔UK is briefly 4 hours instead of 5 in March and late October/early November.
- **Date facts used on the page (US rule, Energy Policy Act of 2005):**
  - 2026: DST ran 8 Mar – 1 Nov.
  - 2027: 14 Mar – 7 Nov.
  - `TODO(owner)`: cite an official source (e.g. NIST or the US DOT time-zone page) and add a yearly refresh check.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | worldtimebuddy.com/pst-to-est-converter | Time site (pair page) | PST to EST Converter – Convert Pacific Time to Eastern Time | ~120 editorial (~450 with timeline) |
| 2 | timeanddate.com/worldclock/converter.html | Authority time site | Time Zone Converter – Time Difference Calculator | ~60 core (700–900 incl. navigation) |
| 3 | koalendar.com/tools/timezone/pst-to-est | Scheduling SaaS tool | PST to EST converter | 450–500 |
| 4 | converttime.com/en/converter/pst-to-est | Converter farm | PST to EST Time Converter | ~700 |
| 5 | time.is | Exact-time clock site | (home: exact time for detected city) | 450–550 incl. lists |

**What this tells us:**
- **The leaders win on the tool, not on content.**
  - World Time Buddy has about 120 words of prose. Time and Date has about 60 words around the widget.
  - Both are JavaScript-heavy, and the core tool did not render in our text capture ("Loading…").
  - A page whose **converter, result and pair table are all in the static HTML** (pre-rendered at build time, then made interactive) is more crawlable and more citable than any of them.
- **World Time Buddy** has the best UX idea: an hour-tile timeline across several zones, click to select, then export to Google, Outlook or iCal.
  - Its prose uses "PST/EST" all year.
  - It has no FAQ, two typos, and placeholder `#` links.
  - Its "mouse over" instructions don't work on touch screens.
- **Time and Date** handles past and future dates and DST, and links to its separate Meeting Planner.
  - The page itself teaches nothing.
  - It offers a "legacy" converter without explaining the difference.
- **Koalendar**:
  - Has a good caveat about ambiguous abbreviations (e.g. IST, CST mean several zones).
  - **States the DST/offset error.**
  - Has no hour table and is heavily promotional.
  - Shows a 4.9★/808 marketplace rating, which belongs to the product, not the tool.
- **ConvertTime has the most errors.**
  - It repeats the DST error, using US-vs-EU examples for a US-only pair.
  - It calls PST "+3 hours compared to EST", which is the wrong direction.
  - It says an early-morning Pacific slot aligns with late-afternoon Eastern; 6 a.m. PST is actually 9 a.m. EST.
  - It never says PDT/EDT.
  - Its table has a broken separator, and 21:00 PST → 00:00 EST is not flagged as the next day.
  - Its "400+ time zones" vs "400 major cities" claims are inconsistent.
- **Time.is**:
  - Shows an exact clock for the detected city.
  - Leaves detection, UTC offset and DST behind links.
  - Its default city was a small Indian town, with no explanation of how it was chosen.
- **No page offers all of these:**
  1. a converter that works in the static HTML
  2. **"Your time zone" shown immediately** (IANA name, offset, abbreviation, DST on/off, next change date)
  3. a correct explanation of when the gap changes and when it doesn't
  4. a 3–5 zone meeting strip with business-hour shading
  5. full 24-row tables for the top pairs, with next-day and previous-day flags
  6. an abbreviation glossary that warns about ambiguous codes

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen (or not rendered in capture)

| Feature | World Time Buddy | Time and Date | Koalendar | ConvertTime | Time.is |
|---|---|---|---|---|---|
| Any zone → any zone | ✅ | ✅ (claimed) | ⚠️ (widget not rendered) | ✅ (dropdowns) | ❌ (clock only) |
| Pick date (past/future) | ✅ | ✅ (claimed) | ✅ (claimed, FAQ) | ⚠️ | ❌ |
| DST handled by engine | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| Correct PDT/EDT labels by season | ✅ (labels) / ❌ (prose) | ✅ | ⚠️ | ❌ | ⚠️ |
| Detect visitor's zone | ⚠️ | ⚠️ ("My Location") | ❌ | ❌ | ✅ (city) |
| Shows UTC offset as a number | ⚠️ | ⚠️ | ❌ | ✅ (text) | ❌ |
| 3+ zones at once | ✅ | ✅ | ❌ | ⚠️ (add zone) | ❌ |
| Hour timeline / slider | ✅ (tiles) | ⚠️ | ❌ | ✅ (claimed slider) | ❌ |
| Business-hours overlap | ⚠️ (visual) | ⚠️ (separate planner) | ❌ | ✅ (prose, correct) | ❌ |
| 24-row pair table | ⚠️ (timeline) | ❌ | ❌ | ⚠️ (broken markdown, no next-day flag) | ❌ |
| Next / previous day flag | ⚠️ | ⚠️ | ❌ | ❌ | ❌ |
| Calendar export (ICS) | ✅ | ⚠️ (planner) | ❌ (CTA to sign up) | ❌ | ❌ |
| Shareable URL with state | ⚠️ (`#` placeholder) | ✅ | ⚠️ (claimed) | ❌ | ❌ |
| Works with JS disabled / static result | ❌ | ❌ | ❌ | ⚠️ | ⚠️ |
| Touch-friendly instructions | ❌ ("mouse over") | ⚠️ | ⚠️ | ⚠️ | ✅ |

---

## 3. Feature matrix — content and trust

| Item | World Time Buddy | Time and Date | Koalendar | ConvertTime | Time.is |
|---|---|---|---|---|---|
| States offset correctly (EST 3 h ahead of PST) | ✅ | n/a | ✅ | ❌ (direction wording) | n/a |
| Explains DST correctly for the pair | ❌ (silent) | ❌ (silent) | ❌ (**wrong**) | ❌ (**wrong**) | ❌ |
| Explains the 2-hour/4-hour changeover nights | ❌ | ❌ | ❌ | ❌ | ❌ |
| Abbreviation ambiguity warning (IST, CST, BST) | ❌ | ❌ | ✅ | ❌ | ❌ |
| US zone glossary (PT/MT/CT/ET/AKT/HT + offsets) | ❌ | ⚠️ (other pages) | ❌ | ❌ | ⚠️ (links) |
| Arizona / Hawaii no-DST note | ❌ | ⚠️ (other pages) | ❌ | ❌ | ❌ |
| FAQ count | 0 | 0 | 3 | 4 (2 wrong) | 0 |
| Named author / date | ❌ | ❌ | ❌ | ❌ | ❌ |
| Source for DST rules | ❌ | ⚠️ (own database) | ❌ | ❌ | ❌ |
| Promotion | low | ads + supporter panel | **heavy** (sign-up CTAs, app badges) | medium | ad-free upsell, app |
| Typos / broken items | 2 typos, `#` links | "legacy" confusion | duplicate links, CTA wording | broken table, "PST, EST" missing "and" | — |

---

## 4. Competitor-by-competitor detail

### 1. World Time Buddy: PST to EST Converter
- **Features:**
  - An hour-tile timeline for PST/PDT, EST/EDT and a third zone (Tokyo by default).
  - Add more locations; click tiles to select a slot.
  - Export to Outlook/iCal, Google Calendar and Gmail.
- **Correct:**
  - "EST is 3 hours ahead of PST" ✔.
  - The Tokyo sample (5:15 a.m. PST → 10:15 p.m. JST, 17 h) ✔.
- **Weak points:**
  - The title is ~78 characters, so it truncates in search results.
  - About 120 words of prose, and no FAQ.
  - The prose says PST/EST all year and doesn't explain why the gap holds.
  - Typos: "intenational", "Annoucements".
  - "Link to this view" points to a placeholder `#`.
  - The "mouse over" instructions don't work on touch screens.
  - The timeline extracts as run-together text, which is a possible screen-reader problem.

### 2. Time and Date: Time Zone Converter
- **Features (claimed in the description):**
  - Past, present and future dates.
  - DST.
  - Link to the Meeting Planner (`/worldclock/meeting.html`).
  - "My Location" in the navigation.
- **Weak points:**
  - The widget did not render in the text capture; its content is JavaScript-only.
  - About 60 words of guidance.
  - A "legacy converter" with no explanation.
  - Heavy navigation and promotional cards ("Become a Supporter").
  - No FAQ, examples or glossary on the page.
- **Takeaway:** Time and Date's authority comes from the domain and its many sub-pages, not from this page.

### 3. Koalendar: PST to EST converter
- **Features (claimed):**
  - Date-aware comparison.
  - A "Copy link" button.
  - A list of six related pair links.
  - **A good note that abbreviations are ambiguous.**
- **Error:**
  - "The offset between PST and EST can change during the year" is wrong. Both switch on the same dates, so it stays 3 h, apart from the changeover-night hours that it doesn't mention.
- **Weak points:**
  - No hour table.
  - The widget did not render.
  - Many "Get started / Sign up" CTAs and app badges.
  - A 4.9★ (808 reviews) rating for the product shown on the tool page.
  - Duplicate navigation, and two solution links with the same URL.

### 4. ConvertTime: PST to EST Time Converter
- **Features (claimed):**
  - Instant conversion and DST handling.
  - "400+ timezones", an interactive time slider and smart search.
  - A PST→EST table (values correct, +3 h).
  - A business-hours overlap (09:00–14:00 PST = 12:00–17:00 EST, 5 h) ✔.
- **Errors:**
  - The DST FAQ says the gap shifts because the zones change on different dates, using US-vs-EU examples. That is **wrong** for PST/EST.
  - "PST is +3 hours compared to EST" gets the direction wrong; PST is 3 hours **behind**.
  - "An early-morning western slot aligns with late-afternoon eastern hours" is wrong: 6:00 PST = 9:00 EST, which is morning.
  - It never says PDT or EDT.
  - The table has no separator row and doesn't flag 21:00 PST → 00:00 EST as the next day.
  - "400+ timezones" vs "over 400 major cities" is inconsistent.
- **Weak points:**
  - The "Convert PST to EST" section repeats the intro.
  - It claims "real-time conversion as you type" on a dropdown interface.

### 5. Time.is (home)
- **Features:**
  - An exact "atomic" clock for the detected city.
  - Sunrise/sunset times.
  - Links to "Your time zone" and "DST 2026".
- **Weak points:**
  - The page itself shows no UTC offset or DST status, and detection is behind a link. That fails the `what time zone am i in` intent on first view.
  - The default city (a small Indian town in our capture) is unexplained.
  - Long city and language lists, an inspirational quote, and an ad-free upsell.

---

## 5. Patterns

**Engine (all in the browser, no network)**
- Zones come from `Intl.supportedValuesOf('timeZone')`, with a fallback to a bundled list of about 30 common IANA zones on browsers that lack it.
- **Conversion:** treat the input wall-clock time in zone A as an instant, using an offset found from `Intl.DateTimeFormat(...).formatToParts`. Then format that instant in zone B.
  - Handle the **gap** (spring-forward: 2:30 a.m. doesn't exist) by warning and moving forward.
  - Handle the **overlap** (fall-back: 1:30 a.m. happens twice) by letting the user pick the earlier or later instance.
- **Visitor's zone:** `Intl.DateTimeFormat().resolvedOptions().timeZone` gives, e.g., `America/Chicago`.
  - Show the abbreviation (`timeZoneName: 'short'`).
  - Show the UTC offset (`'longOffset'` → "GMT−06:00").
  - Show whether DST is on now.
  - Show the next transition date, found by scanning forward day by day and then hour by hour (pure computation).
- **Accuracy limit:** results depend on the browser's time-zone database (tzdata). The page says so.

**Offsets used in the content (verify against tzdata at build time)**

| Zone | Standard | Daylight | DST? |
|---|---|---|---|
| Pacific (PT) | PST UTC−8 | PDT UTC−7 | yes |
| Mountain (MT) | MST UTC−7 | MDT UTC−6 | yes (most of Arizona: **no**, stays MST) |
| Central (CT) | CST UTC−6 | CDT UTC−5 | yes |
| Eastern (ET) | EST UTC−5 | EDT UTC−4 | yes |
| Alaska (AKT) | AKST UTC−9 | AKDT UTC−8 | yes |
| Hawaii (HT) | HST UTC−10 | — | **no** |
| UTC / GMT | UTC±0 | (UK uses BST UTC+1 in summer) | UTC never |
| India (IST) | UTC+5:30 | — | **no** |

**Pair gaps (standard time / daylight time)**
- PST↔EST: 3 h / 3 h (2 h or 4 h for a few hours on changeover nights).
- CST↔EST: 1 h / 1 h.
- MST(Arizona)↔PST: 1 h in winter / 0 h in summer.
- UTC↔EST: 5 h / 4 h.
- EST↔IST: 10 h 30 m / 9 h 30 m.
- PST↔IST: 13 h 30 m / 12 h 30 m.
- US↔UK: 5 h normally, but 4 h for about 3 weeks in March and about 1 week around late October/early November, because the US and the UK switch on different dates.

**Tables (generated at build time and refreshed live)**
- One 24-row table for each of: PST↔EST, CST↔EST, UTC↔EST, IST↔EST, MST↔PST.
- Each row is flagged "+1 day" or "−1 day" where the date changes.
- Two columns cover winter and summer where the gap differs.

**Coverage across the 5 competitors**

| Section | Pages (of 5) |
|---|:---:|
| Converter visible in static HTML | **0–1** |
| Correct DST explanation | **0** |
| Changeover-night nuance | **0** |
| Visitor zone + offset + DST status on page | **0** (Time.is: city only) |
| 3+ zone strip | 2 |
| 24-row pair table, correct and flagged | **0** |
| Abbreviation glossary / ambiguity warning | 1 |
| FAQ ≥ 5 | **0** |
| Calendar export | 1 |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword. These map to the 109-keyword cluster.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What time zone am I in? | `what time zone am i in` (135k), `what timezone am i in` (18.1k) |
| 2 | ★ How many hours ahead is Eastern time from Pacific? | WTB, Koalendar, ConvertTime; pair long tail |
| 3 | ★ How do I convert Central time to Eastern time? | `central time to eastern time` (33.1k) |
| 4 | ★ Does daylight saving time change the PST–EST difference? | Koalendar, ConvertTime (both wrong) |
| 5 | ★ What is the difference between EST and EDT (or PST and PDT)? | zone-name long tail (`what is edt`, `est vs edt`) |
| 6 | What is 9 a.m. PST in EST? | pair long tail (`9 am pst to est`) |
| 7 | What is UTC, and is it the same as GMT? | `gmt`, `greenwich time gmt` |
| 8 | How far ahead is India (IST) from EST or CST? | `cst to ist` long tail |
| 9 | Why is Arizona the same as California in summer? | MST↔PST pair |
| 10 | What does "PT" or "ET" mean on a TV or event schedule? | `pt time` |
| 11 | Which abbreviations are ambiguous (CST, IST, BST)? | Koalendar |
| 12 | How do I find a meeting time that works across zones? | WTB, ConvertTime; `time calculator zones` |
| 13 | When does daylight saving time start and end this year? | supports DST section |

---

## 7. Gaps nobody fills — our opportunities

1. **A correct DST explanation:**
   - US zones switch together, so the gap holds.
   - The changeover nights briefly give 2 h or 4 h.
   - Mixed pairs (IST, UK/EU, Arizona, Hawaii) really do change.
   - Every competitor that tried to explain this got it wrong.
2. **"Your time zone" answered instantly in the static page:**
   - The detected IANA name, abbreviation, UTC offset, and DST on/off.
   - The next change date and the current local time.
   - This targets `what time zone am i in` (135k).
3. **Static, crawlable results.** The default PST→EST conversion and the pair tables are pre-rendered at build time. Competitors show "Loading…".
4. **A meeting strip for 3–5 zones** with business-hours shading (09–17), "+1 day" markers, tap support, and an ICS file download built in the browser.
5. **Five full pair tables** with next-day flags and winter/summer columns.
6. **A US zone glossary** with offsets, DST names, and the Arizona/Hawaii exceptions.
7. **An abbreviation ambiguity warning.** For example, CST can mean China Standard Time; IST can mean India, Israel or Irish time.
8. **Handling of the spring-forward gap and fall-back overlap** in the converter. Nobody mentions these.
9. **A shareable URL** that encodes the zones, date and time.
10. **Links:** Military Time (#5), Unix Timestamp (#15), Time Duration (#4), Days Until Countdown (#3), Online Timer (#28), Alarm Clock (#29).

---

## 8. Blueprint for the KKCTools Time Zone Converter

### 8.1 SEO

- **URL:** `/time-zone-converter/`
- **Title:** Time Zone Converter – PST, EST, CST, UTC & IST
- **H1:** Time Zone Converter: Convert Times Between PST, EST, CST, UTC and More
- **Meta:** as in the keyword file (151 chars).
- **H2s:**
  - "What time zone am I in?"
  - "PST to EST"
  - "Central time to Eastern time"
  - "UTC to EST"
  - "EST to IST"
  - "Does daylight saving change the difference?"
  - "US time zones and abbreviations"
- **Schema:** `WebApplication` + `FAQPage`. Do **not** add `HowTo` or any rating.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Inputs | Date (default today), time (12/24 h toggle), From zone, To zone; quick chips PT/MT/CT/ET/UTC/IST; searchable list of all IANA zones (US first) |
| Output | Converted time and date, "+1 day/−1 day", both abbreviations, both UTC offsets, gap in h:mm, DST status for each zone |
| Your zone | Detected zone card: IANA name, abbreviation, offset, DST on/off, next change date and time, live local clock |
| Edge cases | Spring-forward gap: warn and show the shifted time. Fall-back overlap: offer earlier or later. Half-hour and 45-minute zones (IST, Nepal) |
| Meeting strip | Up to 5 zones, 24 hour columns, working hours shaded, drag or tap to select; ICS download built in the browser |
| Tables | 24-row tables for PST↔EST, CST↔EST, UTC↔EST, IST↔EST, MST↔PST with day flags |
| UX | Swap button, copy result, share URL with state; works offline; no network |
| Fallback | Without `Intl.supportedValuesOf`, use a bundled list of common zones and say so |

### 8.3 Content outline (≈ 1,300–1,600 words, original)

1. Intro, the converter, and the "your time zone" card
2. How to use it, including the meeting strip
3. What time zone am I in? How detection works (on the device, nothing sent anywhere)
4. PST to EST: the rule, examples, and a table
5. Central to Eastern, UTC to EST, and EST/CST to IST, each with a table
6. Does daylight saving change the difference? US pairs vs mixed pairs, plus the changeover nights
7. US time zones: glossary table (PT, MT, CT, ET, AKT, HT; Arizona and Hawaii notes)
8. Ambiguous abbreviations and why we use city/IANA names
9. DST dates for this year and next (with a cited source)
10. FAQ (13)
11. Related tools

### 8.4 Quality checks

- **Unit tests:**
  - PST→EST is 3 h on 50 dates across 2026–2028.
  - The 4 h window on 2027-03-14 and the 2 h window on 2027-11-07 (UTC hours as computed above).
  - EST↔IST is 10:30 in winter and 9:30 in summer.
  - Arizona↔Los Angeles is 1 h in winter and 0 h in summer.
  - The gap/overlap handling.
  - Day-flag rows.
  - Snapshot tests of the pair tables.
- Pre-rendered default results exist in the exported HTML (checked with cheerio).
- No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - Pull Google top 10 for the three head terms.
  - Cite the official US DST rule source (NIST/DOT) and add a yearly date-refresh reminder.
  - Approve ICS generation in the browser; no new dependency is needed.
  - Decide whether to build pair pages later (only if the main page ranks).
