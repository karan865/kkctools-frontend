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

## 4. Lessons from the Batch 4 review (added 2026-11-23) — mandatory

The Batch 4 build passed `npm run verify` but still had real problems. Don't repeat them:

1. **No unsourced "typical" values anywhere:**
   - not in FAQ answers (they go into FAQ schema), help texts, labels, article copy or HowWeCalculate;
   - e.g. "typical tax rate", "average grade scale", "good ROI is 10%", "typical cap rate", prices, densities;
   - use a formula, a value labelled "example", or a cited, dated source from the spec;
   - before you finish each tool, grep its page and component for `typical|usually|average|recommended|standard practice|~[0-9]`.
2. **Citations must say what the source really covers.** Don't attach a standard to a claim it doesn't support. If you didn't open it, don't cite it.
3. **Don't change shared files for one tool's styling:**
   - `ToolShell.module.css`, `globals.css`, `tokens.css`, the layout components;
   - a broad selector there (e.g. `[class*='card']`) can break ~70 live tools;
   - fix colours in the tool's own CSS module (set `color: var(--ink)` on its root card).
4. **ToolShell lives on the page only.** The calculator component must not render its own `<ToolShell>`. Nested shells give two bands and two pill rows.
5. **Every `<label>` is linked to its control** (`htmlFor` + `id` from `useId()`).
6. **Pages read `title` and `description` from `ROUTES.<key>`.** Never copy them inline. Use `absoluteTitle` only when the title + " | KKC Tools" is over 60 characters.
7. **Safety and correctness bugs hide behind passing tests:**
   - a test must assert the *correct* behaviour from the spec, not whatever the code currently does;
   - for limits, clamps and edge cases, write the test from the spec first.
8. **Exact constants:** 1 US gal = 231 in³; 1 in = 2.54 cm; 1 lb = 0.45359237 kg. Never rounded versions.
9. **Dates (02 Age Difference, 17 Simple Interest, 06 CAGR):**
   - `date-diff-engine.ts` uses **month-stepping** for Y/M/D (2026-01-31 → 2026-03-01 = 1 month 1 day), not the "borrow" rule (spec 02 updated 2026-11-22);
   - Batch 8 Part 1 reuses this engine, so build it to the spec interface.
10. **One-run builds:** when the owner asks for all tools in one run, still run `npm run verify` after every tool and post the short per-tool report. Stop only on a spec/code conflict or a test you can't make pass.
