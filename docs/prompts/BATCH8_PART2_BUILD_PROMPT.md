# Batch 8 Part 2 — Builder Prompt (Antigravity / Gemini)

> **Goal:** build Batch 8 tools 06–10: Roman Numeral Converter, Fraction to Decimal, Cooking Measurement Converter, One Rep Max, Army Body Fat (2026 WHtR standard).
> **Spec folder:** `docs/keywords analysis/Batch 8 - Health & Fitness and Everyday Utilities/3. All Blogs Data/` (folders `06_…` to `10_…`)
> **Not in scope:** tools 11–32 (no build specs yet).
> **Written:** 2026-11-22

## 0. Read first, and obey

1. **Read in full before touching code:**
   - `AGENTS.md`, `CLAUDE.md`;
   - `00_BATCH8_BUILD_RULES.md`: Part 1 (§1 project rules, §5 shared UI, §6 files, §7 page/SEO) **and** Part 2 (§9–§14);
   - the tool's spec.
2. **graphify:** `graphify query` before searching code, `graphify update .` after changes; run from PowerShell. Exe: `$(ls ~/AppData/Roaming/Python/*/Scripts/graphify.exe | head -1)`.
3. **Run `npm run verify` from PowerShell or the VS Code terminal, never Git Bash.**
4. **Never:**
   - commit or push; make network calls;
   - create one URL per number, fraction or amount (charts with hash anchors instead);
   - print fixed decimals from floats (use exact rationals: 1/16 in = **1.588 mm**, not 1.587);
   - show a rescinded Army method (tape test, screening tables, AFT exemption) as current, or any tape-test formula;
   - invent fitness standards or health claims; copy competitor text; add ratings or `aggregateRating`.
5. If a spec disagrees with the code, or needs a `TODO(owner)` value, stop and report.

## 1. Order of work (rules §14)

1. **06 Roman Numeral** (+ `roman-engine`, new category `Everyday Conversions`), then **STOP and report**.
2. With the owner's OK:
   - **07 Fraction to Decimal** (+ `fraction-engine`; reuse Batch 5's fraction parser if it exists);
   - **08 Cooking Measurement** (+ `kitchen-units`);
   - **10 One Rep Max** (+ `one-rep-max-engine`, new category `Health & Fitness`, a stub `/health-methodology/` page);
   - **09 Army Body Fat** (+ `whtr-engine`, `army-standard.ts`). **Only after the owner supplies the official WHtR measuring procedure and a reviewer.** If they're missing, build the engine and tests, keep the page unpublished, and report.
3. **STOP** after 09. Run `npm run verify` after every tool.

## 2. For every tool

1. **Engine:** pure. **Every worked example in the spec is a unit test.** Examples:
   - 1994 = MCMXCIV;
   - 1/64 in = 0.397 mm; 2.695 in → 2 11/16;
   - ½ US cup = 8 tbsp; half of ¾ cup = 6 tbsp;
   - 100 kg × 5 → Epley 116.67, Brzycki 112.50, Lombardi 117.46;
   - WHtR: 38/70 = 0.5429 meets; 38.5/70 = 0.55 does not.
2. **Component:**
   - the calculator;
   - **`<Name>InputGuide.tsx` above the inputs** (numbered callouts = numbered labels, live values, focus highlight, accessible SVG, tokens, mobile `<details>`).
3. **Shared UI:**
   - `ToolShell` (the spec's 4 pills) + `TabSlider` (`?tab=`);
   - **a `<main>` element** with `toolDisplayFont.variable` + `typo.scope`.
4. **Page:**
   - title, meta and H1 exactly as the spec (`absoluteTitle` for 10 One Rep Max). **09's title and H1 differ from the keyword file on purpose** (WHtR);
   - BLUF with engine numbers;
   - charts as static HTML from the engine (they don't depend on "today"), printable, hash anchors;
   - H2s and FAQ as the spec (FAQ schema once);
   - HowWeCalculate with formulas, unit chains and the §11 sources (with checked dates and status);
   - health pages: the "estimate, not medical advice" line + methodology link;
   - AdSlots outside the band.
5. **Register:**
   - routes, catalog + count test;
   - calculation-methods, ToolArt, Icons, Footer;
   - the spec's links in and out;
   - docs 00/01/02/04/06.
6. **Verify:**
   - `npm run verify`;
   - `graphify update .`;
   - manual check at 390/768/1280 px, light and dark;
   - print preview of each chart.

## 3. Owner items (`TODO(owner)`)

- **Army (blocking):**
  - the official WHtR measuring procedure (G-1 implementing guidance / DA Form 5500);
  - a qualified reviewer;
  - re-check AD 2026-13 status every 6 months.
- **Sources to open in a browser:**
  - 21 CFR 101.9 (240 mL label cup);
  - NIST Handbook 44 (US kitchen units);
  - a national source for the 250 mL metric cup and 20 mL Australian tablespoon;
  - the UK imperial gallon schedule;
  - sources for the Lombardi/Mayhew/Wathen formulas and the RPE/RIR concept (Zourdos 2016).
- SERP pulls in rules §9; the chart range for fractions (1, 2 or 3 inches).

## 4. Report at each stop

- Files changed.
- Verify output.
- Each worked example: spec value vs engine value.
- The pills used.
- Every `TODO(owner)` you hit and what you did.
- Any spec/code mismatch.
