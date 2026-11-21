# All Pending Batches — Master Builder Prompt (Antigravity / Gemini)

> **Goal:** build every tool page that has a finished build spec but is not live yet: **Batch 4 (8 tools), Batch 5 (20 tools + live-page updates), Batch 6 (10 tools), Batch 7 (5 tools), Batch 8 Parts 1–2 (10 tools)** = 53 new pages.
> **Written:** 2026-11-22 (Batches 7 and 8 Parts 1–2 added the same day)
> **Status of the other batches:**
> - Batches 1, 2 and 3 are **live**. Don't rebuild them. Batch 5 step 0 edits a few of their pages.
> - Batch 8 tools 11–32 and Batch 9 have keyword data only, **no build specs yet**. Don't build them.

This file is the single entry point. Each batch also has its own prompt (`BATCH4_…` to `BATCH7_BUILD_PROMPT.md`, `BATCH8_PART1_…`, `BATCH8_PART2_BUILD_PROMPT.md`). If anything here disagrees with a batch prompt or its `00_BATCHn_BUILD_RULES.md`, **the batch rules win**. `AGENTS.md` wins over everything.

---

## 0. Rules for every batch (read first, obey always)

1. **Before touching code, read in full:**
   - `AGENTS.md`, `CLAUDE.md`;
   - the batch's `00_BATCHn_BUILD_RULES.md`;
   - the spec of the tool you are building.
2. **graphify:**
   - run `graphify query "<question>"` before searching code;
   - run `graphify update .` after code changes;
   - run it from PowerShell (Git Bash gets "Permission denied");
   - exe: `$(ls ~/AppData/Roaming/Python/*/Scripts/graphify.exe | head -1)`.
3. **Run `npm run verify` from PowerShell or the VS Code terminal, never Git Bash.** Git Bash passes a lower-case `d:/` and vitest fails every file.
4. **Never:**
   - commit or push;
   - make network calls in tool code (`npm run check:no-network` must pass);
   - invent facts, benchmarks or reference values (use `TODO(owner)` or an editable, labelled input);
   - copy competitor text or standards tables;
   - create one URL per number or value (long tails are rows in one engine table);
   - add ratings or `aggregateRating`;
   - use brand logos, bank designs or misspelled keywords in copy.
5. **Stop and report** if a spec disagrees with the code, a `TODO(owner)` value is needed, or a worked example doesn't match the engine. Don't silently change either side.

## 1. Build pattern (same for every tool)

1. **Engine:** a pure function in `src/lib/<name>-engine.ts`. Return `null` for undefined cases; −0 → 0. **Every worked example in the spec is a unit test.**
2. **Component:**
   - the calculator;
   - **`<Name>InputGuide.tsx` ABOVE the inputs**: inline SVG, numbered callouts = numbered field labels, live values, focus highlight, `role="img"` + title/desc, tokens only (light + dark), mobile `<details>`, one diagram per tab.
3. **Shared UI:**
   - `ToolShell` with the spec's 4 pills;
   - `TabSlider` with `?tab=`;
   - **a `<main>` element:** `<main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>`.
4. **Page:**
   - title, meta and H1 exactly as the spec (`absoluteTitle` where the spec says the title + " | KKC Tools" is over 60);
   - BLUF in the first 60 words, with engine numbers;
   - H2s and FAQ as the spec (FAQ schema once); HowWeCalculate with formulas and sources;
   - JsonLd: WebApplication + FAQPage + BreadcrumbList;
   - AdSlots outside the tool band.
5. **Register:**
   - `routes.ts`, `tools-catalog.ts` + count test;
   - `calculation-methods.ts`, `ToolArt.tsx`, `Icons.tsx`, `Footer.tsx`;
   - the spec's links in and out;
   - docs 00/01/02/04/06.
6. **Verify:**
   - `npm run verify` (all steps pass);
   - `graphify update .`;
   - manual check at 390 / 768 / 1280 px, light and dark; no page-level horizontal scroll.

## 2. Order of work across batches

Recommended order: quick wins first, then the cheapest high-volume batch. The owner may reorder.

| Step | Batch | What | Why here |
|---:|---|---|---|
| 1 | **5 — step 0** | Apply `00_BATCH5_LIVE_PAGE_KEYWORD_UPDATES.md` to live pages (Stone & Gravel first, then Tons ↔ Yards, Cubic Yard, Sand, Cubic Feet ↔ Sq Ft, Pipe, Percentage Change, Compound Interest, Credit Card Payoff, Present Value) | ~183,000 searches on pages we already have; no new URLs |
| 2 | **6** | Text & Writing: shared `text-engine` + 10 tools | one engine powers 7 pages; ~373,000 cluster searches; low YMYL |
| 3 | **5** | Math & Finance: 4 shared engines + 20 tools | biggest batch; stats engine needs careful fixtures |
| 4 | **8 Part 1** | Date & Time: shared date engine + 5 tools | KD 0 tool terms + ~2.5M long-tail searches; zero YMYL; builds the date engine Batch 5 Age Difference also uses |
| 4a | **8 Part 2** | Roman, Fraction, Cooking (zero YMYL) + 1RM + Army WHtR | ~2M long-tail searches; Army page waits on the official measuring procedure + reviewer |
| 4b | **7** | Developer & Web: shared `secure-random` + 5 tools | KD 0 password terms; small batch; needs 2 owner-approved lists |
| 5 | **4** | 3D Printing & CNC: 2 shared engines + 8 tools | smallest volume; accuracy-sensitive (cited presets only) |

**Hard stops (wait for the owner's OK before continuing):**
- after step 1 (live-page edits);
- after the **first tool of each batch** (pattern review);
- at the stops each batch's rules list (Batch 5: after #08 and #18; Batch 6: after order 7 and 10);
- at the end of each batch.

---

## 3. Batch 5 — step 0: live-page keyword updates

- **File:** `docs/keywords analysis/Batch 5 -  Math & Financial Calculators/3. All Blogs Data/00_BATCH5_LIVE_PAGE_KEYWORD_UPDATES.md`
- Stone & Gravel title → `Gravel & Stone Calculator – Yards, Tons & Pea Gravel` (`absoluteTitle`), plus its H1/H2/FAQ/presets; **every density cited or entered by the user**.
- Then the other pages in the file's order.
- **Changelog:** note the old vs new title for every page.
- Run `npm run verify` after each page. **STOP and report.**

## 4. Batch 6 — Text & Writing Utilities (10 tools)

- **Spec folder:** `docs/keywords analysis/Batch 6 - Text & Writing Utilities/3. All Blogs Data/`
- **Rules:** `00_BATCH6_BUILD_RULES.md` (§2 accuracy, §3 sources opened 2026-11-22, §4 shared code). Batch prompt: `docs/prompts/BATCH6_BUILD_PROMPT.md`.
- **Category:** `Text & Writing`.
- **Shared code first:**
  - `src/lib/text-engine.ts`;
  - `src/data/text-limits.ts` and `src/data/reading-rates.ts` (each entry has `sourceUrl`, `checkedOn`, `verified`);
  - `stop-words-en.ts`, `abbreviations-en.ts`;
  - shared `TextInputPanel` (privacy line) + `StatTiles`.
- **Order:**
  1. 05 Character Counter (**STOP**);
  2. 01 Words to Pages;
  3. 02 Characters to Words;
  4. 03 Twitter / Instagram Counter;
  5. 06 Word Counter;
  6. 07 Reading Time;
  7. 04 Numbers to Words (**STOP**);
  8. 08 Comma Separator;
  9. 09 Sentence Counter;
  10. 10 Keyword Density (**STOP**).
- **Batch-specific musts:**
  - characters = grapheme clusters; X uses its own weighted counter (links 23, emoji/CJK 2);
  - a `verified: false` value never appears as a plain fact or in a title, meta, H1 or BLUF;
  - text never leaves the browser and never goes into a share URL; no URL fetching;
  - no invented thresholds (keyword density, sentence length);
  - no counting libraries (no twitter-text, no NLP).

## 5. Batch 5 — Math & Financial Calculators (20 tools)

- **Spec folder:** `docs/keywords analysis/Batch 5 -  Math & Financial Calculators/3. All Blogs Data/`
- **Rules:** `00_BATCH5_BUILD_RULES.md`. Batch prompt: `docs/prompts/BATCH5_BUILD_PROMPT.md`.
- **Category:** `Math & Finance`.
- **Shared engines first:** `stats-engine`, `growth-engine`, `volume-units-engine`, `date-diff-engine` (verify the stats fixtures against R or Excel).
- **Order:**

  | Order | Spec | Order | Spec |
  |---:|---|---:|---|
  | 1 | 01 Ratio (**STOP**) | 11 | 12 Binomial |
  | 2 | 02 Age Difference | 12 | 09 Pythagorean |
  | 3 | 03 IQR | 13 | 10 Slope |
  | 4 | 04 A/B Test | 14 | 16 Tank Volume |
  | 5 | 05 Gallons ↔ ft³ | 15 | 17 Simple Interest |
  | 6 | 06 CAGR | 16 | 18 ROI (**STOP**) |
  | 7 | 07 Fraction to Percent | 17 | 14 Final Grade |
  | 8 | 08 Reverse Sales Tax (**STOP**) | 18 | 15 Budget |
  | 9 | 11 Standard Deviation | 19 | 19 Boolean |
  | 10 | 13 T-Test | 20 | 20 Metric Conversion (**STOP**) |

- **Batch-specific musts:**
  - no "good ROI / CAGR / SD" benchmarks, no tax-rate tables, no grade scales stated as fact;
  - exact unit constants cited (NIST);
  - name the statistical method (quartile method, Welch, two-sided); never "95% chance B is better";
  - Fraction to Percent is one URL only and links both ways with the live Percentage Change page;
  - ROI: if the SERP pull shows 3+ giants in the top 5, fold it into CAGR (ask the owner).

## 5b. Batch 7 — Developer & Web Tools (5 tools)

- **Spec folder:** `docs/keywords analysis/Batch 7 - Developer & Web Tools/3. All Blogs Data/`
- **Rules:** `00_BATCH7_BUILD_RULES.md`. Batch prompt: `docs/prompts/BATCH7_BUILD_PROMPT.md`.
- **Category:** `Developer & Web`.
- **Shared code first:** `secure-random` (Web Crypto only, rejection sampling, fails closed) + `attack-scenarios`.
- **Order:**
  1. 01 Password Generator (**STOP**);
  2. 02 Password Strength Checker;
  3. 03 UUID / GUID Generator (**STOP**);
  4. 04 Passphrase Generator;
  5. 05 Hacker Name Generator (**STOP**).
- **Batch-specific musts:**
  - no `Math.random` and no `src/lib/generator/rng.ts` in #1–#4 (that seeded PRNG is only OK for names);
  - no password/passphrase ever stored, logged, sent or put in a URL; no breach or UUID APIs;
  - our own strength estimator (no zxcvbn); RFC 9562 test vectors as unit tests;
  - advice only from NIST SP 800-63B rev 4, CISA (archived caveat), OWASP, EFF, as in rules §3;
  - no hacking content; hacker names are for fun, from our own word bank;
  - blocking owner items: the common-password file (#2) and the passphrase word list (#4).

## 5c. Batch 8 Part 1 — Date & Time (5 tools)

- **Spec folder:** `docs/keywords analysis/Batch 8 - Health & Fitness and Everyday Utilities/3. All Blogs Data/` (folders `01_…` to `05_…` only)
- **Rules:** `00_BATCH8_BUILD_RULES.md` (Part 1). Batch prompt: `docs/prompts/BATCH8_PART1_BUILD_PROMPT.md`.
- **Category:** `Date & Time`.
- **Shared code first:** `date-diff-engine` (shared with Batch 5 #2; month-stepping Y/M/D), `holidays-us` (5 U.S.C. § 6103 by rule, observed shifts, Easter), `business-days` (NETWORKDAYS/WORKDAY-style).
- **Order:**
  1. 01 Days Between Dates (**STOP**);
  2. 02 Days From Today;
  3. 03 Days Until;
  4. 05 Military Time (builds `time-engine`);
  5. 04 Time Duration (**STOP**).
- **Batch-specific musts:**
  - one page per tool, never one URL per number/time/date (hash anchors only);
  - no today-relative dates in the static HTML; UTC day numbers for date maths;
  - conventions stated on screen (end date, today = day 0, business-day counting);
  - correct 12 AM/PM and 0000/2400 rules; DST note for "from now".
- **If Batch 5 is built first:** reuse its `date-diff-engine`. If Batch 8 goes first, build it to the Batch 5 interface. Either way it uses month-stepping (the Batch 5 spec was updated on 2026-11-22).

## 5d. Batch 8 Part 2 — Roman, Fraction, Cooking, 1RM, Army (5 tools)

- **Spec folder:** same as Part 1, folders `06_…` to `10_…`.
- **Rules:** `00_BATCH8_BUILD_RULES.md` Part 2 (§9–§14). Batch prompt: `docs/prompts/BATCH8_PART2_BUILD_PROMPT.md`.
- **Categories:** `Everyday Conversions` (06, 07, 08) and `Health & Fitness` (10, 09) + a `/health-methodology/` page.
- **Order:**
  1. 06 Roman (**STOP**);
  2. 07 Fraction;
  3. 08 Cooking;
  4. 10 One Rep Max;
  5. 09 Army (**STOP**; blocked on the official WHtR measuring procedure and a reviewer).
- **Batch-specific musts:**
  - exact rationals for printed decimals (1/16 in = 1.588 mm);
  - charts as static engine HTML with hash anchors, never per-value URLs;
  - Army = **AD 2026-13 WHtR < 0.55 only** (tape tests, screening tables and AFT exemptions are rescinded; no tape formulas);
  - 1RM shows 3 sourced formulas + average, and no strength-standards table.

## 6. Batch 4 — 3D Printing, CNC & Engineering (8 tools)

- **Spec folder:** `docs/keywords analysis/Batch 4 - USA — 3D Printing  CNC  Engineering/3. All Blogs Data/`
- **Rules:** `00_BATCH4_BUILD_RULES.md`. Batch prompt: `docs/prompts/BATCH4_BUILD_PROMPT.md`.
- **Category:** `3D Printing & CNC`.
- **Shared engines first:** `epoxy-engine`, `machining-engine`.
- **Order:**
  1. 01 Epoxy Resin (**STOP**);
  2. 05 Epoxy River Table;
  3. 02 3D Print Cost;
  4. 03 Speeds and Feeds;
  5. 04 SFM ↔ RPM;
  6. 07 Pulley;
  7. 06 Steps per mm;
  8. 08 Thread Pitch / Tap Drill (**STOP**).
- **Batch-specific musts:**
  - no invented cure times, pour depths, SFM or chip loads, filament densities or thread tolerances;
  - material presets only from a named source you opened and cited (otherwise custom fields only);
  - product values are inputs labelled "example: use your product's data sheet";
  - a safety / "starting point, test cut first" note where the spec asks;
  - firmware lines (Marlin, Klipper, GRBL) exact and labelled;
  - no adult-slang "CNC" terms anywhere.

---

## 7. Owner items (`TODO(owner)`) to collect along the way

- **All batches:** SERP pulls listed in each rules file §0 (they can change tiers or merge pages).
- **Batch 6:**
  - confirm the Brysbaert (2019) reading rates;
  - verify the Discord, Instagram bio, X Premium, Bluesky, TikTok and Facebook limits;
  - calibrate Words to Pages fonts in Word;
  - sources for essay and novel lengths and the 4.7-letter average;
  - Sheets TEXTJOIN page; Docs mobile steps.
- **Batch 5:** cite the gravel and stone densities; approve the grade-scale labels; check the stats fixtures.
- **Batch 7:**
  - pick the common-password file (SecLists, MIT) and the passphrase list (EFF long list, CC BY 4.0, or our own);
  - approve our own strength estimator, Web Crypto SHA-1, v3/MD5 and the UETR preset;
  - confirm the NIST rev 4 status and the WPA2 rule; run the UUID snippets;
  - re-export the UUID 0–15% keywords.
- **Batch 8 Part 1:** approve the holiday list, hash anchors, the military-chart print approach and the DST display; watch rankings vs per-number competitor pages.
- **Batch 8 Part 2:**
  - Army: the WHtR measuring procedure (G-1 guidance) + a reviewer + a 6-month re-check;
  - open 21 CFR 101.9, NIST Handbook 44 and the UK gallon schedule;
  - sources for the extra 1RM formulas and RPE/RIR.
- **Batch 4:** approve sources for the SFM / chip-load presets (tool-maker charts) and any epoxy cure data.

## 8. Report at each stop

- Batch and tool(s) done; files changed.
- `npm run verify` output.
- Each worked example: spec value vs engine value.
- The 4 pills used per tool.
- Every `TODO(owner)` you hit and what you did (hidden, labelled, or waiting).
- Any spec/code mismatch.

---

## Paste into Antigravity

```
Read docs/prompts/ALL_BATCHES_BUILD_PROMPT.md and follow it exactly.
Start with section 2 step 1 (Batch 5 live-page keyword updates), then STOP and report.
After my OK, continue with Batch 6 (shared text engine, then 05 Character Counter), and stop at every STOP listed.
```
