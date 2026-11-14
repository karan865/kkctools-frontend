# Unix Timestamp Converter (+ Discord Timestamps) — Competitor Analysis

> **Target page:** KKCTools `/unix-timestamp-converter/` (Batch 8, Tool #15 ✅)
> **Primary keyword:** `unix time converter` — US 8,100 · KD 0 · declining.
> - Secondary: `how to set a time on discord message` — 390 · KD 14 (Discord timestamp mode, one H2).
> - Cluster: 2 keywords, 8,490 US searches, all on KD ≤ 15.
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 8. Competitors come from live web searches on 2026-11-14 for `unix time converter epoch to date` and `discord timestamp generator`, plus the two known category leaders (EpochConverter, UnixTimestamp.com).
> - Other results seen but not audited: inventivehq, rows.com, jam.dev, retool, openreplay, ipvoid, t.ly, shadcn.io, itoolverse, pixconvert, and many small Discord tools (devkithub, freediscordtools, xgamingserver, wonderchat, videodubber, codeconvey, devtoollab, zapier blog).
> - `TODO(owner): pull Google top 10 for "unix time converter" and "discord timestamp".`
> **Pages visited (2026-11-14):** 5 read: EpochConverter, UnixTimestamp.com, GIGAcalculator, DQYDJ, Redact (Discord Timestamp Generator).

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Long-standing dedicated sites: EpochConverter, UnixTimestamp.com.
  - Calculator sites: GIGAcalculator, DQYDJ.
  - **Developer SaaS "free tool" pages** used for lead generation: jam.dev, retool, openreplay, rows, inventivehq.
  - For Discord: **Discord-adjacent product pages** (Redact and many tiny clones).
- **The intent is purely utilitarian.** People paste a number and want the date, or pick a date and want the number. The page wins on:
  - instant auto-detection of the unit
  - showing UTC, local time and **any chosen zone**
  - relative time
  - copy buttons
- **The Discord mode fills a real gap.** No epoch site we audited builds Discord `<t:…>` codes, and no Discord tool we audited also works as a full epoch converter. Combining them on one page is the keyword file's "fresh angle".
- **Arithmetic was re-checked by us:**
  - **GIGAcalculator: 2 errors in our capture.**
    - It labels timestamp 1794660899 as "12:11:59 UTC". The correct value is **12:54:59 UTC**: 1794660899 − 20771 × 86400 = 46,499 s after midnight. The date (Sat 14 Nov 2026) is right.
    - It shows the date as "2026-14-11", with month and day swapped.
    - The time mismatch *may* come from the live value and the label being captured at different moments, so it is recorded as "seen in capture". `TODO(owner)`: check it manually.
  - **DQYDJ:** it says 2³¹−1 seconds rolls over at "03:14:17 AM". The correct time is **03:14:07 UTC on 19 Jan 2038**, and the page doesn't say UTC.
  - **UnixTimestamp.com's unit table is consistent when rounded.** 1 month = 2,629,743 s ≈ 30.437 days; 1 year = 31,556,926 s ≈ 365.2422 days. The audit tool flagged it as wrong, but our recomputation shows it is fine.
  - **Its live value checks out:** 1792795883 = 23 Oct 2026 22:51:23 UTC ✔.
- **Discord facts (unverified by an official page in this session):**
  - The documented markdown styles are `t, T, d, D, f, F, R`, and `f` is the default when no style is given.
  - Redact claims "nine formats" (adding `s`/`S`).
  - `TODO(owner)`: confirm the current style list against Discord's developer documentation (Message Formatting → Timestamp styles) before publishing. Only list what Discord documents.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | epochconverter.com | Dedicated epoch site | Epoch Converter – Unix Timestamp Converter / "Epoch & Unix timestamp conversion tools" | 1,000–1,300 |
| 2 | unixtimestamp.com | Dedicated epoch site | Unix Time Stamp – Epoch Converter | ~500 main (1,300–1,500 total) |
| 3 | gigacalculator.com/converters/unix-time-converter.php | Calc site | Timestamp Converter – Convert Unix Timestamp to Date / H1 Unix Timestamp Converter | 450–500 |
| 4 | dqydj.com/unix-time-to-date-converter/ | Finance/calc blog | UNIX Time to Date Converter | ~300 |
| 5 | redact.dev/tools/discord-timestamp-generator | Discord privacy SaaS tool | Discord Timestamp Generator & Maker, With Live Countdowns | 1,000–1,200 |

**What this tells us:**
- **EpochConverter is the feature benchmark:**
  - seconds, ms, µs and ns, identified by digit count
  - many input formats (ISO 8601, RFC 3339/5322, HTTP-date, relative)
  - start/end of day, month and year
  - seconds-to-duration
  - a batch converter
  - a Y2038 page
  - code snippets for about 20 languages
  - preferences (12/24 h, regional format)
- **EpochConverter is weak on UX and zones:**
  - Its tab labels are near-duplicates ("Timestamp to readable date" / "Timestamp to date").
  - Its date fields use cryptic labels ("Yr, Mon, Hr").
  - It offers only local and GMT. Any other zone means going to another page.
- **UnixTimestamp.com** has a live counter with Copy and Pause, unit auto-detection, UTC/local/relative output, 10 code snippets and a Y2038 section. It carries a referral-code promotion.
- **GIGAcalculator**:
  - **Strength:** partial date input (year alone → 1 Jan 00:00).
  - **Errors:** the time and date-order errors above, and a blank local-time sentence.
  - **Missing:** Y2038 and an FAQ.
- **DQYDJ** is thin (~300 words). Its 2038 rollover time is wrong, it shows raw LaTeX, it has a typo, and it has no FAQ or date.
- **Redact (Discord)**:
  - **Strengths:** quick-set buttons (Now, +15 min, Tomorrow 9 a.m.), seven FAQs with format examples, and an FAQPage schema.
  - **Weaknesses:** a disputed "nine formats" claim, and **fixed UTC offsets ("New York UTC−5") that are wrong during DST**. The page is heavily promotional.
- **No page offers all of these:**
  1. auto-detect of s/ms/µs/ns, with the guess shown and switchable
  2. output in UTC, local and **any IANA zone**, with DST correct
  3. ISO 8601 + RFC 2822 + relative time + day of week, plus week number
  4. date → timestamp in a chosen zone
  5. Discord code builder for every documented style with a **local preview** and copy
  6. negative timestamps (before 1970) and the Y2038 limit explained correctly
  7. a correct, cited explanation of leap seconds

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | EpochConverter | UnixTimestamp | GIGAcalc | DQYDJ | Redact (Discord) |
|---|---|---|---|---|---|
| Timestamp → date | ✅ | ✅ | ✅ | ✅ (not rendered) | ⚠️ (separate converter) |
| Date → timestamp | ✅ | ✅ | ✅ (partial input) | ⚠️ (link to other tool) | ✅ (picker) |
| Seconds / ms | ✅ | ✅ | ⚠️ (mentions ms) | ❌ | n/a |
| µs / ns | ✅ | ✅ | ❌ | ❌ | n/a |
| Unit auto-detect shown to user | ⚠️ (digit table) | ✅ | ❌ | ❌ | n/a |
| UTC + local | ✅ | ✅ | ⚠️ (local blank) | ✅ | ✅ |
| Any chosen time zone | ⚠️ (separate page) | ❌ | ❌ | ❌ | ⚠️ (**fixed offsets, no DST**) |
| Relative time ("3 days ago") | ✅ | ✅ | ❌ | ❌ | ✅ (R style) |
| ISO 8601 / RFC 2822 output | ⚠️ | ⚠️ | ⚠️ (with error) | ❌ | ❌ |
| Live current timestamp | ✅ | ✅ (copy/pause) | ✅ | ❌ | ✅ ("Now") |
| Negative / pre-1970 | ✅ | ⚠️ | ⚠️ | ✅ (claimed) | ❌ |
| Batch convert | ✅ | ❌ | ❌ | ❌ | ❌ |
| Start / end of day, month, year | ✅ | ❌ | ❌ | ❌ | ❌ |
| Code snippets | ✅ (~20) | ✅ (10) | ❌ | ❌ | ❌ |
| Discord `<t:…:x>` builder | ❌ | ❌ | ❌ | ❌ | ✅ |
| Preview of each Discord style | ❌ | ❌ | ❌ | ❌ | ⚠️ (examples in FAQ) |
| Quick-set (+1 h, tomorrow 9 a.m.) | ⚠️ (relative input) | ❌ | ❌ | ❌ | ✅ |
| Share URL / embed | ⚠️ | ❌ | ✅ | ❌ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | EpochConverter | UnixTimestamp | GIGAcalc | DQYDJ | Redact |
|---|---|---|---|---|---|
| Epoch definition correct | ✅ | ✅ | ✅ | ✅ | n/a |
| Leap seconds explained | ⚠️ | ⚠️ | ⚠️ (one line) | ⚠️ (one line) | ❌ |
| Y2038 explained | ✅ (own page) | ✅ | ❌ | ⚠️ (**wrong time**) | ❌ |
| Unit reference table | ✅ | ✅ (rounded, consistent) | ❌ | ❌ | ❌ |
| Worked examples correct | ✅ | ✅ | ❌ (**2 errors in capture**) | ❌ | ✅ |
| FAQ count | 0 (sub-pages) | 0 | 0 | 0 | 7 |
| Named author | ❌ | ❌ | ✅ (Georgi Georgiev) | ✅ (PK) | ❌ |
| Date | ❌ | ❌ | ✅ (updated Jun 2026) | ❌ | ❌ |
| Privacy note (processed locally) | ❌ | ❌ | ❌ | ❌ | ⚠️ (claimed, no evidence) |
| Promotion | low | referral link + sibling sites | share/embed | heavy sidebar | **heavy** (Premium, plugin, app) |

---

## 4. Competitor-by-competitor detail

### 1. EpochConverter
- **Features:**
  - s/ms/µs/ns (10/13/16/19 digits).
  - Many input formats.
  - Local/GMT output.
  - Start/end of periods, seconds → duration, a batch converter, and a Y2038 page.
  - Code snippets for about 20 languages, including SQL dialects, shell and Excel.
  - Preferences, and about 45 interface languages.
  - Links to related epoch formats (LDAP, NTP, GPS).
- **Weak points:**
  - Near-duplicate tab names.
  - Abbreviated field labels (accessibility).
  - No inline conversion to an arbitrary zone.
  - The tables lose their markup in the text capture.
- **Takeaway:** the depth benchmark. We match its core and beat it on zones, Discord, clarity and accessibility. We won't try to copy its whole sub-site.

### 2. UnixTimestamp.com
- **Features:**
  - Live counter with Copy and Pause.
  - Auto-detect of s/ms/µs/ns.
  - UTC, local and relative output.
  - A year/month/day form.
  - 10 code snippets (Java/MySQL/PostgreSQL checked ✔) and a Y2038 section.
- **Checked:** live value 1792795883 = 23 Oct 2026 22:51:23 UTC ✔. The unit table is consistent once rounded.
- **Weak points:**
  - The title and H1 differ.
  - Inconsistent capitalisation.
  - Result tables are empty without JavaScript.
  - A referral-code promotion.

### 3. GIGAcalculator: Unix Timestamp Converter (Georgi Georgiev, updated 20 Jun 2026)
- **Features:**
  - UTC and locale output.
  - **Partial date input** (year → 1 Jan; date → midnight).
  - Live value, share/embed, and citation formats.
- **Errors in our capture:**
  - 1794660899 is labelled 12:11:59 UTC; it should be **12:54:59** (the date is correct).
  - "2026-14-11" has the month and day swapped.
  - The "In your local time, that is ." sentence is blank.
  - "equivocated" should be "equated".
- **Weak points:** no Y2038 section, no FAQ, and the title and H1 use different names.

### 4. DQYDJ: UNIX Time to Date Converter (PK)
- **Features:** seconds before or after 1970 → UTC and local; links to the reverse tool.
- **Errors:**
  - The 2³¹−1 rollover is given as "03:14:17 AM"; it is **03:14:07 UTC, 19 Jan 2038**.
  - Raw LaTeX is shown.
  - Typo: "repesent".
  - Leftover form-validation text appears in the page.
- **Weak points:** about 300 words, no FAQ, no date, no sample conversions.

### 5. Redact: Discord Timestamp Generator
- **Features:**
  - Date/time picker, styles list, and one-click copy.
  - Quick-set buttons: Now, +15 min, +1 h, +3 h, +1 week, Tomorrow 9 a.m., This Friday 7 p.m., Next Monday 9 a.m.
  - Seven FAQs and an FAQPage schema.
- **Checked:** the example `<t:1715461260:F>` = 11 May 2024 21:01 UTC ✔. "8 p.m. New York = 1 a.m. London" holds in summer ✔.
- **Errors and issues:**
  - The "nine formats" claim (`s`/`S`) needs verifying against Discord's documentation.
  - **Static "New York (UTC−5)" labels are wrong during DST.**
  - A literal `&amp;` in the title.
  - The feature text and the quick-set buttons don't match.
  - An unverified privacy claim.
  - Several upsell blocks.

---

## 5. Patterns

**Core logic (all in the browser)**
- **Unit auto-detect by absolute digit count:**
  - ≤ 11 digits → seconds
  - 12–14 → milliseconds
  - 15–17 → microseconds
  - ≥ 18 → nanoseconds
  - Show the guess ("Detected: milliseconds") with a manual override.
  - Use `BigInt` for µs/ns so no precision is lost.
- **Formatting:** `Intl.DateTimeFormat` with `timeZone` for UTC, local and a chosen IANA zone.
  - ISO 8601: `toISOString()` for UTC, and a built offset string for zones.
  - RFC 2822 style.
  - Day of week and ISO week number.
  - Day of year.
  - Relative time with `Intl.RelativeTimeFormat`.
- **Date → timestamp:** wall-clock input read in a chosen zone. Handle DST gaps and overlaps the same way as the Time Zone Converter (#14); share that engine.
- **Range:** JavaScript `Date` covers ±8.64 × 10¹⁵ ms (about ±273,790 years). Clamp the input and show a message outside that range.

**Reference values (verified by our arithmetic)**
- `0` = 1970-01-01 00:00:00 UTC (Thursday).
- `1,000,000,000` = 2001-09-09 01:46:40 UTC.
- `1,700,000,000` = 2023-11-14 22:13:20 UTC.
- `2,000,000,000` = 2033-05-18 03:33:20 UTC.
- `2,147,483,647` (2³¹−1) = **2038-01-19 03:14:07 UTC**. The next second overflows a signed 32-bit integer to −2³¹ = 1901-12-13 20:45:52 UTC.
- `-1` = 1969-12-31 23:59:59 UTC.
- `TODO(owner)`: these values are locked in by unit tests, so they can't drift.

**Units**
- 1 minute = 60 s; 1 hour = 3,600; 1 day = 86,400; 1 week = 604,800.
- 1 average Gregorian month (30.436875 d) = 2,629,746 s.
- 1 Gregorian year (365.2425 d) = 31,556,952 s.
- **Label which year definition we use.** EpochConverter-style tables use the 365.2422-day tropical year, giving 31,556,926 s.

**Leap seconds**
- Unix time treats every day as 86,400 s. During a leap second, the same Unix value repeats (or is smeared, depending on the system).
- No new leap seconds have been added since 2016.
- The CGPM decided in 2022 to stop adding leap seconds by 2035.
- `TODO(owner)`: cite IERS/BIPM.

**Discord timestamp codes**
- Syntax: `<t:UNIX_SECONDS:STYLE>`.
- Each viewer's Discord client shows the time in **their own** zone and language settings.

| Style | Meaning (en-US example) |
|---|---|
| `t` | short time (9:01 PM) |
| `T` | long time (9:01:00 PM) |
| `d` | short date (05/11/2024) |
| `D` | long date (May 11, 2024) |
| `f` (default) | date + short time |
| `F` | weekday + date + short time |
| `R` | relative ("in 2 hours") |

- Our preview uses `Intl` to imitate the en-US output and is labelled "approximate; Discord renders using each reader's settings".
- `TODO(owner)`: verify the style list and examples against Discord's documentation.

**Coverage across the 5 competitors**

| Section | Pages (of 5) |
|---|:---:|
| Auto-detect units shown to user | 1–2 |
| Any IANA zone, DST correct | **0** |
| Correct Y2038 explanation | 2 |
| Correct worked examples | 3 |
| Discord builder | 1 (no epoch tools) |
| Epoch tool + Discord on one page | **0** |
| FAQ ≥ 5 | 1 |
| Local-only privacy, verifiable | **0** |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is a Unix timestamp (epoch time)? | all epoch pages |
| 2 | ★ How do I convert a Unix timestamp to a date? | `unix time converter` |
| 3 | ★ Is my timestamp in seconds or milliseconds? | EpochConverter, UnixTimestamp |
| 4 | ★ What is the Year 2038 problem? | EpochConverter, UnixTimestamp, DQYDJ |
| 5 | ★ How do I put a time in a Discord message that shows in everyone's time zone? | `how to set a time on discord message`, Redact |
| 6 | ★ What do the Discord timestamp letters (t, T, d, D, f, F, R) mean? | Redact |
| 7 | Are Unix timestamps in UTC? | search summary, GIGAcalc |
| 8 | Does Unix time include leap seconds? | GIGAcalc, DQYDJ |
| 9 | Can a Unix timestamp be negative? | DQYDJ, EpochConverter |
| 10 | How do I get the current timestamp in JavaScript, Python or SQL? | EpochConverter, UnixTimestamp |
| 11 | Why does my converted date show 1970 or the year 50,000? | unit mistakes |
| 12 | Do I need a bot or Nitro for Discord timestamps? | Redact |

---

## 7. Gaps nobody fills — our opportunities

1. **One page that handles both epoch conversion and Discord codes.** Nobody combines them.
2. **Any IANA zone with correct DST.** Redact's fixed "UTC−5" labels are wrong for half the year.
3. **Visible auto-detect with an override**, plus precise `BigInt` handling for µs/ns.
4. **Correct reference values and a correct Y2038 explanation.** DQYDJ is off by 10 seconds; GIGAcalc's labels are wrong in our capture.
5. **Every useful output on one screen:** ISO 8601, RFC 2822, relative time, weekday, ISO week, day of year.
6. **A verifiable privacy claim:** "runs in your browser; no network requests", backed by our `check:no-network` gate.
7. **Short code snippets** for the 6 most common languages (JS, Python, PHP, Java, SQL, Bash), written by us.
8. **Accessible labels** (no "Yr/Mon" abbreviations) and touch-friendly copy buttons.
9. **Links:** Time Zone Converter (#14, shared engine), Days Between Dates (#1), Countdown (#3), Military Time (#5), UUID Generator (Batch 7 #3; UUID v7 embeds a timestamp).

---

## 8. Blueprint for the KKCTools Unix Timestamp Converter

### 8.1 SEO

- **URL:** `/unix-timestamp-converter/`
- **Title:** Unix Timestamp Converter – Epoch to Date
- **H1:** Unix Timestamp Converter: Epoch Time to Date and Back
- **Meta:** as in the keyword file (147 chars).
- **H2s:**
  - "Convert a timestamp to a date"
  - "Convert a date to a timestamp"
  - "Discord timestamps: show a time in everyone's time zone"
  - "Seconds, milliseconds and more"
  - "The Year 2038 problem"
- **Schema:** `WebApplication` + `FAQPage`.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Timestamp → date | Paste any integer (sign allowed); auto-detect s/ms/µs/ns with override; outputs: UTC, local, chosen zone, ISO 8601, RFC 2822, relative, weekday, ISO week, day of year |
| Date → timestamp | Date + time (+ optional seconds/ms) in chosen zone; outputs s, ms; DST gap/overlap handling (shared with #14) |
| Live | Current timestamp with copy and pause; s/ms toggle |
| Discord | Date-time picker + quick-set (Now, +15 m, +1 h, Tomorrow 9 a.m., Next Monday 9 a.m.); every documented style listed with code, approximate preview and copy; "copy all" |
| Extras | Start/end of day, month and year for the chosen zone; 2038 indicator when value > 2³¹−1 |
| UX | Swap, share URL with state, keyboard-friendly, no network |

### 8.3 Content outline (≈ 1,100–1,400 words, original)

1. Intro, the converter, and the live timestamp
2. How to use it (both directions)
3. What Unix time is (definition, UTC, leap seconds; cited)
4. Seconds, milliseconds, microseconds and nanoseconds: how to tell them apart
5. Reference timestamps table (verified values above)
6. Discord timestamps: syntax, style table, how to paste, what readers see
7. The Year 2038 problem (correct time, and which systems are affected)
8. Getting the current timestamp in code (6 short snippets)
9. FAQ (12)
10. Related tools

### 8.4 Quality checks

- **Unit tests:**
  - All reference values.
  - Unit detection at the boundaries.
  - BigInt ns round-trip.
  - Negative values.
  - Zone output vs fixed fixtures (New York in January and July).
  - Discord code strings for every style.
  - Date→timestamp DST gap/overlap.
- No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - Pull Google top 10.
  - Verify the Discord style list in the official documentation.
  - Cite IERS/BIPM for leap seconds and the 2022 CGPM decision.
  - Manually re-check GIGAcalculator's label error before referring to it anywhere.
