# Batch 6 — Builder Prompt (Antigravity / Gemini)

> **Goal:** build the 10 Batch 6 tool pages (text & writing utilities) from their build specs.
> **Spec folder:** `docs/keywords analysis/Batch 6 - Text & Writing Utilities/3. All Blogs Data/`
> **Written:** 2026-11-22

## 0. Read first, and obey

1. **Read in full before touching code:**
   - `AGENTS.md`, `CLAUDE.md`;
   - `00_BATCH6_BUILD_RULES.md` (especially §2 accuracy, §3 sources, §4 shared code);
   - the tool's spec (`NN_<Name>_BUILD_SPEC.md` in its folder).
2. **graphify:** run `graphify query` before searching code and `graphify update .` after changes. Run it from PowerShell (Git Bash gets "Permission denied"). Exe path: `$(ls ~/AppData/Roaming/Python/*/Scripts/graphify.exe | head -1)`.
3. **Run `npm run verify` from PowerShell or the VS Code terminal, never Git Bash.**
4. **Never:**
   - commit or push;
   - make network calls (`npm run check:no-network` must pass), fetch URLs for the user, or upload text;
   - invent facts: platform limits, reading speeds, essay or novel lengths, "ideal" keyword density, sentence-length rules;
   - publish a `verified: false` value as a plain fact, or use it in a title, meta, H1 or BLUF;
   - copy competitor text;
   - create one URL per number ("how many pages is 1,500 words" is a table row, never a page);
   - use misspellings in copy, platform logos or bank designs;
   - add ratings or `aggregateRating`;
   - add a dependency for counting (no twitter-text, no NLP libraries): our own code only.
5. If a spec disagrees with the code, or needs a `TODO(owner)` value, stop and report.

## 1. Order of work

1. **Shared code first** (rules §4), with tests:
   - `src/lib/text-engine.ts` (graphemes, bytes, classes, scripts, emoji, words with the hyphen/contraction rules, sentences with the abbreviation merge, paragraphs, lines, n-grams, minutes);
   - `src/data/text-limits.ts`, `src/data/reading-rates.ts` (each entry: `value`, `sourceUrl`, `checkedOn`, `verified`), `src/data/stop-words-en.ts`, `src/data/abbreviations-en.ts`;
   - shared UI `TextInputPanel` (privacy line, Paste/Clear/Sample, optional local `.txt` import) and `StatTiles`.
   - Every fixture in rules §4 is a unit test (X 16, 你好世界 8, family emoji 1 grapheme / 25 bytes, word rule 10 vs 12, sentence rule 5 vs 8).
2. **Add the catalog category `Text & Writing`.**
3. **Build `05_Character_Counter` (order 1), then STOP and report** so the owner can review the shared engine and UI.
4. **With the owner's OK, follow rules §8:** 01 Words to Pages → 02 Characters to Words → 03 Twitter/IG → 06 Word Counter → 07 Reading Time → 04 Numbers to Words (**STOP**) → 08 Comma Separator → 09 Sentence Counter → 10 Keyword Density (**STOP**).
   - Each later tool adds only its own engine (`page-estimate`, `x-count`, `reading-time`, `number-words`, `list`, `keyword-density`) on top of the shared one.
   - Run `npm run verify` after every tool.

## 2. For every tool

1. **Engine:** pure, `null` for undefined cases. **Every worked example in the spec is a unit test.** If the engine disagrees with a spec number, the test shows it: report it, don't silently change either side.
2. **Component:**
   - the calculator;
   - **`<Name>InputGuide.tsx` above the inputs** (numbered callouts = numbered labels, live values from the user's own text where the spec says so, focus highlight, accessible SVG, tokens, mobile `<details>`).
3. **Shared UI:**
   - `ToolShell` (the spec's 4 pills) + `TabSlider` (`?tab=`); all tabs share one text state;
   - **a `<main>` element** with `toolDisplayFont.variable` + `typo.scope`;
   - the privacy line under every text box; Share URLs never contain the user's text.
4. **Page:**
   - title, meta and H1 exactly as the spec (`absoluteTitle` for 01 Words to Pages and 09 Sentence Counter);
   - BLUF with engine numbers (07 Reading Time switches its BLUF wording on the `verified` flag);
   - long-tail tables as static HTML `<table>` from the engine, with captions;
   - H2s and FAQ as the spec (FAQ schema once);
   - HowWeCalculate with the rules, formulas and §3 sources (with checked dates);
   - AdSlots outside the band, never between a text box and its counts.
5. **Register:**
   - routes, catalog + count test;
   - calculation-methods, ToolArt, Icons, Footer;
   - the spec's links in and out (Text & Writing hub);
   - docs 00/01/02/04/06.
6. **Verify:**
   - `npm run verify` (all steps);
   - `graphify update .`;
   - manual check at 390/768/1280 px, light and dark;
   - paste 1 MB of text: typing stays smooth.

## 3. Owner items to collect before or during the build (`TODO(owner)`)

- **Brysbaert (2019) rates** (238 / 260 / 183 wpm): confirm from the paper's abstract, then set `verified: true`.
- **Unverified platform limits:** X Premium, X bio/name, Instagram bio/comment/username, Discord, Bluesky, TikTok, Facebook (their help pages blocked automated reading).
- **Words-to-pages calibration** in Word for 6 fonts (spec 01 §3.4), or keep the font field hidden.
- **Sources** for: essay lengths, novel lengths, book words per page, the 4.7-letter average, speaking pace (or keep them as labelled example inputs).
- Google Sheets TEXTJOIN help page (answer/7013992), Google Docs mobile steps.
- Approve: readability scores in 09, the sample texts, the stop-word and abbreviation lists.
- SERP pulls listed in rules §0 (they may change tiers or merge 05 and 06).

## 4. Report at each stop

- Files changed.
- Verify output.
- Each worked example: spec value vs engine value.
- The pills used.
- Every `TODO(owner)` you hit and what you did (hidden, labelled or waiting).
- Any spec/code mismatch.
