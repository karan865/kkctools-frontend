# Batch 5 — Builder Prompt (Antigravity / Gemini)

> **Goal:** build the 20 Batch 5 tool pages (math & financial calculators) from their build specs.
> **Spec folder:** `docs/keywords analysis/Batch 5 -  Math & Financial Calculators/3. All Blogs Data/`
> **Written:** 2026-11-22

## 0. Read first, and obey

1. **Read in full before touching code:**
   - `AGENTS.md`, `CLAUDE.md`;
   - `00_BATCH5_BUILD_RULES.md`;
   - the tool's spec.
2. **graphify:** run `graphify query` before searching code and `graphify update .` after changes. Exe path: `$(ls ~/AppData/Roaming/Python/*/Scripts/graphify.exe | head -1)`.
3. **Run `npm run verify` from PowerShell or the VS Code terminal, never Git Bash.**
4. **Never:**
   - commit or push;
   - make network calls;
   - invent facts or benchmarks;
   - copy competitor text;
   - add ratings or `aggregateRating`;
   - create one URL per fraction or per value.
5. If a spec disagrees with the code, or needs a `TODO(owner)` value, stop and report.

## 1. Order of work

0. **Quick wins first:** apply `00_BATCH5_LIVE_PAGE_KEYWORD_UPDATES.md` to the live pages.
   - Start with the Stone & Gravel title/H1 and its presets. Every density must be cited or entered by the user.
   - Note old vs new titles in the changelog.
   - Run `npm run verify` after each page.
1. **Shared engines first** (rules §3):
   - `stats-engine`;
   - `growth-engine`;
   - `volume-units-engine`;
   - `date-diff-engine`.
   - Each needs tests. Verify the stats fixtures against R or Excel.
2. **Add the catalog category `Math & Finance`.**
3. **Build `01_Ratio_Calculator`, then STOP and report** so the owner can review the pattern.
4. **With the owner's OK, follow rules §7.**
   - Stop again after Tier 1 (#08) and after Tier 2 (#18).
   - Run `npm run verify` after every tool.

## 2. For every tool

1. **Engine:** pure, `null` for undefined cases. **The spec's worked example is a unit test.**
2. **Component:**
   - the calculator;
   - **`<Name>InputGuide.tsx` above the inputs** (numbered callouts = numbered labels, live values, focus highlight, accessible SVG, tokens, mobile `<details>`);
   - the result charts the spec names.
3. **Shared UI:**
   - `ToolShell` (the spec's 4 pills) + `TabSlider` (`?tab=`);
   - **a `<main>` element** with `toolDisplayFont.variable` + `typo.scope`.
4. **Page:**
   - title, meta and H1 exactly as the spec (`absoluteTitle` where it says);
   - BLUF with engine numbers;
   - H2s and FAQ as the spec (FAQ schema once);
   - HowWeCalculate with formulas and sources (NIST for unit constants);
   - AdSlots outside the band.
5. **Register:**
   - routes, catalog + count test;
   - calculation-methods, ToolArt, Icons, Footer;
   - the spec's links in and out;
   - docs 00/01/02/04/06.
6. **Verify:**
   - `npm run verify` (all 6 steps);
   - `graphify update .`;
   - manual check at 390/768/1280 px, light and dark.

## 3. Report at each stop

- Files changed.
- Verify output.
- Each worked example: spec value vs engine value.
- The pills used.
- Every `TODO(owner)` you hit and what you did.
- Any spec/code mismatch.
