# Batch 4 — Builder Prompt (Antigravity / Gemini)

> **Goal:** build the 8 Batch 4 tool pages (3D printing, CNC, engineering) from their build specs.
> **Spec folder:** `docs/keywords analysis/Batch 4 - USA — 3D Printing  CNC  Engineering/3. All Blogs Data/`
> **Written:** 2026-11-22

## 0. Read first, and obey

1. **Read in full before touching code:**
   - `AGENTS.md` and `CLAUDE.md`;
   - `00_BATCH4_BUILD_RULES.md`;
   - the spec of the tool you are building.
2. **graphify:**
   - run `graphify query` before searching code;
   - run `graphify update .` after changes;
   - exe path: `$(ls ~/AppData/Roaming/Python/*/Scripts/graphify.exe | head -1)`.
3. **Run `npm run verify` from PowerShell or the VS Code terminal, never Git Bash.**
4. **Never:**
   - commit or push;
   - make network calls in tool code;
   - invent reference values (cure times, pour depths, SFM or chip loads by material, filament densities, thread tolerances);
   - copy competitor text or standards tables;
   - add ratings or `aggregateRating`;
   - use adult-slang "CNC" terms anywhere.
5. **If a spec and the code disagree, or a `TODO(owner)` value is needed, stop and report.**

## 1. Order of work (rules §7)

1. **Shared code first:**
   - `src/lib/epoxy-engine.ts` + test;
   - `src/lib/machining-engine.ts` + test.
2. **Add the catalog category `3D Printing & CNC`** with the first tool.
3. **Build in this order:**
   - `01_Epoxy_Resin_Calculator`, then **STOP and report** so the owner can review the pattern;
   - then, with the owner's OK: `05_Epoxy_River_Table_Calculator`, `02_3D_Print_Cost_Calculator`, `03_Speeds_and_Feeds_Calculator`, `04_SFM_RPM_Surface_Speed_Calculator`, `07_Pulley_Ratio_Belt_Speed_Calculator`, `06_Stepper_Steps_per_mm_Esteps_Calculator`, `08_Thread_Pitch_Diameter_Tap_Drill_Calculator`.
4. **Run `npm run verify` after each tool.**

## 2. For every tool

1. **Engine:**
   - pure functions; `null` for undefined cases; −0 → 0;
   - **the spec's worked example is a unit test**, and the engine must match it.
2. **Component:**
   - the calculator;
   - **`<Name>InputGuide.tsx` above the inputs** (numbered callouts = numbered labels, live values, focus highlight, accessible SVG, tokens, mobile `<details>`);
   - any result diagram the spec asks for.
3. **Shared UI:**
   - `ToolShell` with the spec's 4 pills;
   - `TabSlider` with `?tab=`;
   - `<main>` with `toolDisplayFont.variable` + `typo.scope`. **The page must have a `<main>` element.**
4. **Page:**
   - title, meta and H1 exactly as the spec, with `absoluteTitle` where it says;
   - BLUF with engine numbers;
   - H2s and FAQ as the spec (FAQ schema once);
   - HowWeCalculate with formulas and sources;
   - safety or "starting point" note;
   - AdSlots outside the band.
5. **Data rules:**
   - product-label values are user inputs, labelled "example: use your product's data sheet";
   - material presets **only** from a named source you opened, cited (otherwise custom fields only).
6. **Register:**
   - `routes.ts`, `tools-catalog.ts` + count test;
   - `calculation-methods.ts`, `ToolArt.tsx`, `Icons.tsx`, `Footer.tsx`;
   - the "Links in" from each spec;
   - docs 00/01/02/04/06.
7. **Verify:**
   - `npm run verify` (6 steps pass);
   - `graphify update .`;
   - manual check at 390/768/1280 px, light and dark.

## 3. Report at each stop

- Files changed.
- Verify output.
- Worked example: spec value vs engine value.
- The pills used.
- Each `TODO(owner)` you hit and what you did.
- Any spec/code mismatch.
