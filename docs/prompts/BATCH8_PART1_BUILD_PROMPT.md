# Batch 8 Part 1 — Builder Prompt (Antigravity / Gemini)

> **Goal:** build the first 5 Batch 8 tool pages (date & time): Days Between Dates, Days From Today, Days Until, Military Time, Time Duration.
> **Spec folder:** `docs/keywords analysis/Batch 8 - Health & Fitness and Everyday Utilities/3. All Blogs Data/` (folders `01_…` to `05_…`)
> **Not in scope:** tools 06–32 (no build specs yet). Don't build them.
> **Written:** 2026-11-22

## 0. Read first, and obey

1. **Read in full before touching code:**
   - `AGENTS.md`, `CLAUDE.md`;
   - `00_BATCH8_BUILD_RULES.md` (Part 1: §2 conventions, §3 sources, §4 shared code);
   - the tool's spec.
2. **graphify:** `graphify query` before searching code, `graphify update .` after changes; run from PowerShell. Exe: `$(ls ~/AppData/Roaming/Python/*/Scripts/graphify.exe | head -1)`.
3. **Run `npm run verify` from PowerShell or the VS Code terminal, never Git Bash.**
4. **Never:**
   - commit or push;
   - make network calls (no time server, no holiday API);
   - create one URL per number, time or date ("90 days from today", "1700 military time" are rows on one page, with hash anchors);
   - bake today-relative dates or counts into the static HTML;
   - type holiday dates in by year (compute them by rule);
   - use local-time `Date` arithmetic for calendar dates (UTC day numbers only);
   - invent facts, copy competitor text, add ratings or `aggregateRating`.
5. If a spec disagrees with the code, or needs a `TODO(owner)` value, stop and report.

## 1. Order of work

1. **Shared code first** (rules §4), with tests:
   - `src/lib/date-diff-engine.ts` (**shared with Batch 5 Age Difference**; if it exists, extend it; Y/M/D uses month-stepping, not "borrow");
   - `src/lib/holidays-us.ts` (5 U.S.C. § 6103 rules, observed Sat → Fri / Sun → Mon, Easter, popular dates);
   - `src/lib/business-days.ts` (NETWORKDAYS- and WORKDAY-style; reproduce Microsoft's examples: 110 and 2009-04-30).
2. **Add the catalog category `Date & Time`.**
3. **Build `01_Days_Between_Dates`, then STOP and report.**
4. **With the owner's OK:** 02 Days From Today (+ `LiveDateTable`, `ics.ts`) → 03 Days Until → 05 Military Time (+ `time-engine.ts`) → 04 Time Duration (**STOP**). Run `npm run verify` after every tool.

## 2. For every tool

1. **Engine:** pure; "today" and "now" injected. **Every worked example in the spec is a unit test** (e.g. 224 days for 2026-11-22 → 2027-07-04; Thanksgiving 2026 = Nov 26; 2028 New Year observed 2027-12-31; 1900 = 7:00 PM; 10 PM → 6 AM minus 30 min = 7.50 h).
2. **Component:**
   - the calculator;
   - **`<Name>InputGuide.tsx` above the inputs** (numbered callouts = numbered labels, live values, focus highlight, accessible SVG, tokens, mobile `<details>`).
3. **Shared UI:**
   - `ToolShell` (the spec's 4 pills) + `TabSlider` (`?tab=`);
   - **a `<main>` element** with `toolDisplayFont.variable` + `typo.scope`.
4. **Page:**
   - title, meta and H1 exactly as the spec (`absoluteTitle` for 02 Days From Today);
   - BLUF with a fixed-date engine example in static text + a live line on the client;
   - long-tail tables client-rendered with hash anchors; the server HTML keeps the table header + method note;
   - H2s and FAQ as the spec (FAQ schema once);
   - HowWeCalculate with conventions, § 6103 holiday rules and Excel/Sheets equivalents (cite the §3 sources);
   - AdSlots outside the band.
5. **Register:**
   - routes, catalog + count test;
   - calculation-methods, ToolArt, Icons, Footer;
   - the spec's links in and out (Date & Time hub; Time Duration links to the live Hourly to Salary and Labor Cost pages);
   - docs 00/01/02/04/06.
6. **Verify:**
   - `npm run verify` (all steps);
   - `graphify update .`;
   - manual check at 390/768/1280 px, light and dark; set the device clock to another day and time zone and reload: every live value updates.

## 3. Owner items (`TODO(owner)`)

- Pull the SERPs in rules §0; watch rankings vs per-number competitor pages.
- Approve the holiday list (US federal + popular dates); decide on Canada/UK sets later.
- Approve hash anchors (`#90-days`) and the print approach for the military chart (print stylesheet).
- Confirm the DST display (elapsed time + wall-clock note).

## 4. Report at each stop

- Files changed.
- Verify output.
- Each worked example: spec value vs engine value.
- The pills used.
- Every `TODO(owner)` you hit and what you did.
- Any spec/code mismatch.
