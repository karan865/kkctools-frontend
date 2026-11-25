# Batch 5 + 8 Finance Pages: Fix and Check Prompt (Antigravity / Gemini)

> **Goal:** fix what users and Google see wrongly on 28 live pages, then check Batch 5 against its research. No new tools, URLs or categories.
> **Written:** 2026-11-25, from a check of the built pages in Chrome and in `out/`.
> **Start only** on a clean working tree (ignore `docs/`). Don't run beside another batch.

- `B5` = `docs/keywords analysis/Batch 5 -  Math & Financial Calculators/` (two spaces)
- **Batch 5 (20):** ratio, age-difference, iqr, ab-test-significance, gallons-to-cubic-feet, cagr, fraction-to-percent, reverse-sales-tax, pythagorean-theorem, slope, standard-deviation, binomial-probability, t-test, final-grade, budget, tank-volume, simple-interest, roi, boolean-algebra, metric-conversion.
- **Finance (8):** compound-interest, credit-card-payoff, heloc, how-long-will-my-money-last, investment-return, net-worth, present-value, processing-fee.

**Which file wins:** `AGENTS.md` → this file → `00_BATCH5_BUILD_RULES.md` → spec → keyword file → competitor analysis.

## 0. Obey always

1. Read `AGENTS.md` and `CLAUDE.md`. `graphify query` before searching; `graphify update .` after changes. `npm run verify` from PowerShell only.
2. **Never:** commit or push; change a URL, title, meta, H1, config or dependency; edit `ToolShell.module.css`, `TabSlider`, `globals.css` or `tokens.css`; add a network call; invent a number; copy competitor text; change a calculator formula unless §4 proves it wrong.
3. Never edit a test to make it pass. Don't weaken `src/lib/batch6-review.test.ts`.
4. Progress file: `docs/prompts/BATCH5_IMPROVE_PROGRESS.md`. "Done" needs a test name or file:line. List everything not done or not checked. Don't count footer, header or sitemap links as inlinks.
5. Order: Part A → B → C → D. Verify green after each part, and after each page in C.

## Part A. 8 finance pages: the tool is missing from the HTML (do first)

`useSearchParams` plus `<Suspense>` makes the static HTML contain only "Loading calculator…" and **zero inputs** in `<main>`.

For each of the 8:
1. Replace `useSearchParams` and the `initialTab` code with `useTabParam(ids, defaultTab)`. Move `src/components/tool/text/useTabParam.ts` to `src/components/tool/shared/useTabParam.ts` and update every import (Batch 6 uses it).
2. Keep the same tab ids and default tab, so old `?tab=` links still work. An unknown `?tab=` shows the default. Remove the old `handleTabChange` URL code; keep any other work it does.
3. Remove the `Suspense` wrapper and fallback from the page.
4. Server and first client render must match: nothing on first render may use the clock, locale defaults, storage or random values. Load saved data in an effect. Use `'en-US'`.
5. Keep `InvoiceGenerator` as it is (it already renders 40 inputs).

**Guard test:** add to `scripts/seo-audit.mjs` (the one allowed script change): any route of type `tool` in `out/` fails if its `<main>` has no `input`, `select`, `textarea` or tool `button[role=tab]`, or shows "Loading". If another page fails, list it; don't hide it with an exception.

## Part B. Text that can't be read (Batch 5, in Chrome)

Rule: on the purple band, text outside a card is white; inside a card it is `var(--ink)` or `var(--ink-soft)` on `var(--surface)`. Fix in the tool's own CSS module. Don't use `!important` unless `ToolShell` forces it, and say where.

**Confirmed**
| Page | Problem |
|---|---|
| Gallons to Cubic Feet | Table tab: all rows, "Up to", "Step" are white on white. Dimensions tab: shape choices too |
| Ratio, IQR | Labels, hints and "Examples" are dark on the band. Put the inputs in a surface card |
| Age Difference | Same: labels, format hint, quick-age labels |
| Boolean Algebra | Binary tab: white labels on a pale cell, dark values on the dark hero |
| A/B Test | "Presets", the SRM text, and the control row in the plan table |
| Budget, ROI | Privacy note and the "Note:" line and link under the cards, dark on band |
| Slope | Two radio labels on the third tab |
| Simple Interest | Day-count tab in dark mode; `$0.00` in light mode |
| Boolean, Metric | "Export CSV" button in dark mode |

**Then scan all 28 pages** with your own Playwright-type check: every tab, light and dark, at 1280 and 390 px, every visible non-SVG text node, contrast under 4.5:1 (3:1 for text ≥ 24 px, or ≥ 18.66 px bold). Gradients need a screenshot look: CAGR, Fraction, Reverse Tax and Standard Deviation sentence boxes showed up in my scan but are readable on their pale gradient in screenshots, so leave those if you agree. No new dependency in the repo; keep the script outside it.

Also, on the 28 pages only: replace CSS variables that are **not defined anywhere** and have no fallback (`--border`, `--surface-1`, `--border-color`, `--bg-subtle`, `--surface-secondary`, `--text-1` and similar) with defined ones (`--line`, `--surface`, `--surface-2`, `--ink`, `--ink-soft`). Check each with a search in `tokens.css` and the component's own CSS before replacing; locally defined ones stay.

## Part C. Batch 5 content, one page at a time

Right before each page, read its `BUILD_SPEC.md` **and** `Competitor_Analysis.md` in full, plus its rows in the keyword file in `B5/2. …/`. The analyses were not required reading in the first build.

**For all 20**
1. Remove visible "BLUF" / "Bottom Line Up Front" (18 pages). Keep the answer. Do the same on the 8 finance pages if present.
2. Fill a table (progress file): every spec FAQ, H2, tab, input, output and test bullet → where it is, or "missing". Every ✅ a competitor has in the analysis feature matrix → have / missing / out of scope and why.
3. Add a missing spec item if it is small (FAQ, H2, caption, label, one option). **Larger gaps go in a list for the owner, not into the code.**
4. Each long-tail table is a `<table>` with a `<caption>` in the static HTML, rows from the engine.
5. Every keyword-file row: answered, or a reason. Natural wording, no stuffing, no misspellings.
6. Grep page and component for `typical|usually|average|recommended|standard practice|industry|good ROI`. Each hit must be maths, labelled "example", or sourced with link and date. Otherwise remove it.
7. Spec "Links out / in" between live pages: in a sentence, 1–2 new per page. Skip forced ones.

**Known gaps**
| Page | Add |
|---|---|
| Standard Deviation | FAQs: by hand, mean/median/mode, SD from a frequency table (10 of 12 spec FAQs now). H2 for frequency and grouped data |
| Binomial | FAQ "How do I calculate at least one success?" if not already answered (the existing "How do I calculate …" may cover it) |
| Tank Volume | H2 for gallons, litres and barrels. Propane/oil tank sizes FAQ **only** with a manufacturer or standards page opened now; otherwise "enter your tank's size" |
| Gallons, Fraction to Percent | Conversion table as its own H2 with a caption, in the static HTML |
| ROI | FAQ comparing ROI, rate of return and CAGR, if not clearly answered |

## Part D. Calculator check (report first, fix only with proof)

The formulas were not re-checked after the build. For each of the 20:
1. Map every spec worked example to a **named existing test**. Missing → write the test from the spec *before* running it.
2. Type each worked example into the page in Chrome and compare the screen with the spec (engine tests don't prove the UI passes the right values).
3. Edge inputs: empty, 0, negative, very large, `1e9`, `1,234.5`, pasted spaces, swapped dates, 29 Feb, identical samples, n = 1. No `NaN`, `Infinity`, `undefined`, crash or silently wrong answer.
4. Independent checks, shown in the progress file with the tool used (Python `statistics`/`scipy` if installed, or a spreadsheet; otherwise say "not checked"): SD and variance, IQR methods, Welch t and p, binomial exact/cumulative, A/B z and p, CAGR, simple interest day counts (30/360, Actual/360, Actual/365), annualised ROI, partial cylinder volume.
5. Constants exact: 1 US gal = 231 in³, 1 in = 2.54 cm, 1 lb = 0.45359237 kg.
6. If engine and spec differ: work it out by hand. Fix only if the hand result proves the engine wrong, with a failing test first. If the spec looks wrong, record both and ask.

## 5. Acceptance (paste evidence)

- [ ] verify green, test count before and after; same URLs, titles, metas and H1s on all 28.
- [ ] Part A: inputs in `<main>` per page, before (0) and after; `?tab=` deep link works for every tab; new audit guard passes on all tool pages (list any that failed).
- [ ] Chrome on all 28: every tab, 390 / 768 / 1280, light and dark: no console or hydration error, no page-level horizontal scroll. Contrast scan result per page.
- [ ] Part C tables complete; FAQ schema equals visible FAQs; no `BLUF`, `TODO(`, `NaN`, "Loading" in `out/` for the 28.
- [ ] Part D: worked example → test name → value on screen. Independent checks listed. Any formula change listed with proof.
- [ ] Every new number → its source or engine.
- [ ] 5-word-shingle Jaccard < 0.30 between every pair of the 20.
- [ ] `routes.ts` `updated` changed only where visible content changed. Docs 00 and graph updated.
- [ ] Owner list: larger gaps, sources needed, anything not checked.
- [ ] Last line: "Freeze these pages for 28 days from deploy."

---

## Paste into Antigravity

```
Read docs/prompts/BATCH5_IMPROVE_PROMPT.md in full and follow it exactly.

Work in order: Part A (8 finance pages missing from the HTML), Part B (unreadable text), Part C (20 Batch 5 pages), Part D (calculator check). Before each Batch 5 page, read its BUILD_SPEC and its Competitor_Analysis in full. Do not change URLs, titles, metas, H1s or shared styles. No new tools or pages.

npm run verify green after each part and each page in Part C (PowerShell, not Git Bash). Check every tab in a real browser, light and dark. Never commit or push. Never edit a test to make it pass; change a formula only with proof. Write docs/prompts/BATCH5_IMPROVE_PROGRESS.md: "done" only with a test name or file:line, and list what you did not do or check. Finish with the section 5 acceptance list with evidence.

If interrupted, read the progress file and resume from the first unfinished row.
```
