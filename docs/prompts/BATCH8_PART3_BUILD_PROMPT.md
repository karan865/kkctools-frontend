# Batch 8 Part 3 — Builder Prompt (Antigravity / Gemini)

> **Goal:** build Batch 8 tools 11–12 (Heart Rate Zone Calculator, Ideal Weight Calculator).
> **Spec folder:** `docs/keywords analysis/Batch 8 - Health & Fitness and Everyday Utilities/3. All Blogs Data/` (folders `11_…` and `12_…`)
> **Rules:** `00_BATCH8_BUILD_RULES.md` Part 3 (§15–§19).
> **Not in scope:** tools 13–32 (keyword data only, no build specs yet).
> **Written:** 2026-11-22

## 0. Read first, and obey

1. **Read in full before touching code:**
   - `AGENTS.md`, `CLAUDE.md`;
   - `00_BATCH8_BUILD_RULES.md`: Part 1 (§1 project rules, §5 shared UI, §6 files, §7 page/SEO) **and** Part 3 (§15–§19);
   - the tool's spec.
2. **graphify:** `graphify query` before searching code, `graphify update .` after changes; run from PowerShell. Exe: `$(ls ~/AppData/Roaming/Python/*/Scripts/graphify.exe | head -1)`.
3. **Run `npm run verify` from PowerShell or the VS Code terminal, never Git Bash.**
4. **Never:**
   - commit or push; make network calls;
   - show only one "ideal" number (ranges first: 4-formula range + CDC healthy-BMI range);
   - invent medical claims or fitness standards; copy competitor text; add ratings or `aggregateRating`.
5. If a spec disagrees with the code, or needs a `TODO(owner)` value, stop and report.

## 1. Order of work (rules §19)

1. **11 Heart Rate Zone** (+ `heart-rate-engine.ts` with tests; category `Health & Fitness`), then **STOP and report**.
2. With the owner's OK:
   - **12 Ideal Weight** (+ `body-metrics-engine.ts` with tests).
3. **STOP** after 12. Both stay unpublished until a qualified reviewer signs off. Run `npm run verify` after every tool.

## 2. For every tool

1. **Engine:** pure functions. **Every worked example in the spec is a unit test.**
2. **Component:**
   - the calculator;
   - **`<Name>InputGuide.tsx` above the inputs** (numbered callouts = numbered labels, live values, focus highlight, accessible SVG, tokens, mobile `<details>`).
3. **Shared UI:**
   - `ToolShell` (the spec's 4 pills) + `TabSlider` (`?tab=`);
   - **a `<main>` element** with `toolDisplayFont.variable` + `typo.scope`.
4. **Page:**
   - title, meta and H1 exactly as the spec;
   - BLUF with engine numbers;
   - medical guard rails ("estimate, not medical advice");
   - HowWeCalculate with formulas, unit chains and sources;
   - AdSlots outside the band.
5. **Register:**
   - routes, catalog + count test;
   - calculation-methods, ToolArt, Icons, Footer;
   - docs 00/01/02/04/06.
6. **Verify:**
   - `npm run verify`;
   - `graphify update .`.

## 3. Owner items (`TODO(owner)`)

- A qualified reviewer to sign off on both YMYL health pages before launch.
- Confirm citations for Tanaka, Gulati, Robinson and Miller.
- Citation for the 5-zone model, or keep the "convention" label.

## 4. Report at each stop

- Files changed.
- Verify output.
- Each worked example: spec value vs engine value.
- The pills used.
- Every `TODO(owner)` you hit and what you did.
- Any spec/code mismatch.
