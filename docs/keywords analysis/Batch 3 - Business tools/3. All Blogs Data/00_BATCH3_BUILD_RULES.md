# Batch 3 (Business Tools) — Common Build Rules

> Applies to all 5 Batch 3 build specs:
> - `1. Percentage_Change_…/01_…_BUILD_SPEC.md`
> - `2.Markup_…/02_…_BUILD_SPEC.md`
> - `3.Profit_Margin_…/03_…_BUILD_SPEC.md`
> - `4.Hourly_to_Salary_…/04_…_BUILD_SPEC.md`
> - `5.Unit_Price_…/05_…_BUILD_SPEC.md`
>
> **Read this file first, then the tool's own spec.**
> Written 2026-11-18.

---

## 1. Project rules (from `AGENTS.md`, which wins on any conflict)

- Next.js 16 static export, React 19, TypeScript, CSS Modules.
- **Zero network calls** in tool code (`npm run check:no-network`).
- **No fabricated facts.** Any statistic, benchmark ("good margin", "median wage") or legal rule needs a named, dated, official source. If you have no source, leave it out or mark it `TODO(owner)`.
- **Never copy competitor text, tables or examples.** Write original examples with our own numbers.
- **Every number shown in content (tables, examples, FAQ answers) is computed by the engine at build time.** Never type a result into the JSX. The page then can't contradict itself (the Batch 2 review found hard-coded FAQ numbers that drifted from the engine).
- No author name or credentials (`TODO(owner)`). No "accurate", "exact" or "guaranteed" claims.
- `npm run verify` must pass all 6 steps before you finish. Do not commit or push.

## 2. Shared engines (build once, reuse)

These 5 tools are all percentage and price maths. Create the shared code first:

| File | Exports | Used by |
|---|---|---|
| `src/lib/percent-engine.ts` (+ test) | `pctChange(old, new)`, `pctDifference(a, b)`, `applyPct(x, p)`, `reversePct(newVal, p)`, `pctOf(p, y)`, `whatPct(x, y)`, `ppDifference(a, b)`, `excelFormula(mode, cells)` | Percentage Change, Unit Price (shrinkflation), Hourly (raise %), Markup |
| `src/lib/pricing-engine.ts` (+ test) | `priceFromMarkup`, `markupFromPrice`, `costFromPrice`, `priceFromMargin`, `marginFromMarkup`, `markupFromMargin`, `multiplier`, `roundPriceEnding`, `addTax`, `stripTax`, `landedCost` | Markup, Profit Margin, Unit Price (seller mode) |

Rules for both engines:
- Pure functions; return `null` (not NaN or Infinity) for undefined cases (divide by zero). The UI explains why the answer is undefined.
- Use `Math.max(0, …)` only where a negative result is truly impossible. Percent changes **can** be negative.
- Normalise -0 to 0.
- Display rounding happens only in the UI formatter (2 dp default, editable). The engine keeps full precision.

## 3. Files a new tool touches (same pattern as every live tool)

Reference implementation: the latest tools (Carpet / Deck / Roof). Run `git show --stat fc9be24` to see the file list.

| Action | File |
|---|---|
| new | `src/lib/<tool>-engine.ts` + `.test.ts` (or use the shared engines above) |
| new | `src/components/tool/<slug>/<Name>.tsx` + `.module.css`, `index.ts` (+ diagram/visual if the spec asks) |
| new | `src/app/<slug>/page.tsx` + `page.module.css` |
| edit | `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (category `business`), `src/lib/tools-catalog.test.ts` (count) |
| edit | `src/content/calculation-methods.ts` (formulas + any sources), `src/components/home/ToolArt.tsx`, `src/components/icons/Icons.tsx`, `src/components/layout/Footer.tsx` |
| edit | `docs/00-PROJECT-STATUS.md`, `01-FEATURES.md`, `02-SEO.md`, `04-KEYWORDS.md`, `06-CHANGELOG.md` |

Page structure, copied from the existing tool pages:
- `buildMetadata` (title ≤ 60 chars **including** the " | KKC Tools" suffix; use `absoluteTitle` if the brand suffix pushes it over 60);
- `Breadcrumbs` (Home › Tools › Name);
- `JsonLd` with WebApplication + FAQPage + BreadcrumbList via `buildSchema`;
- the calculator above the fold;
- the BLUF answer (first 50–60 words answer the main query directly);
- content H2s;
- `HowWeCalculate`;
- FAQ (visible once, schema once);
- related tools;
- `AdSlot` placements like the other pages.

## 4. SEO rules for this batch (business-maths SERPs)

1. **The calculator is above the fold and works with defaults on load.** It shows a real answer before the user types anything.
2. **Every result has a plain-English sentence,** e.g. "Selling at $150 gives $50 profit: a 50% markup and a 33.3% margin." Google often quotes these lines.
3. **Show the formula with the user's own numbers** (step-by-step) under every result.
4. **One H2 per keyword cluster** in the spec. FAQ questions use the exact keyword phrasing ("how to find percent change").
5. **Tables come from the engine** (e.g. markup ↔ margin table, $/hour → salary table).
6. **Internal links:** link every Batch 3 maths tool to the others (Percentage ↔ Markup ↔ Margin ↔ Unit Price ↔ Hourly). Add a "Business maths" row on the Tools hub.
7. **Share URL** (state in the query string), Copy result, Print. Keyboard friendly; `aria-live` on results.
8. **Mobile 390 px:** inputs stack, tabs scroll horizontally inside their bar, tables scroll in their own box, no page-level horizontal scroll.
9. **No sign-up, no email, no network.**

## 5. Ranking reality (read before choosing the build order)

SERP check from `KKCTools_Batch3_Final_Tool_Keywords.md` (2026-11-16):

| Tool | Head-term SERP | What to target first | Build order |
|---|---|---|:---:|
| Unit Price | ✅ weak: 6 slots held by AS 9–22 sites | `unit price calculator`, `price per unit calculator` (KD 0) | **1** |
| Markup | ✅ weak: #1 and #2 are AS 33 and AS 14 | `markup calculator` (14.8K) | **2** |
| Profit Margin | 🟡 hard: top 7 are AS 51–100 | `gross margin calculator` (KD 8), aiming for #8–10, plus long-tail formula terms | **3** (shares the Markup engine) |
| Hourly to Salary | ❌ `wage calculator` = paycheck-tax intent (ADP, SmartAsset) | **Not** `wage calculator`. Target `yearly wage calculator` (6.6K, KD 0), `calculate annual salary` (6.6K, KD 10), `monthly gross income calculator` (3.6K, KD 9) | **4** |
| Percentage Change | ❌ head term: 9 of 10 results are AS 67–100 | **Not** the head term at first. Target long tail: `how to find percent change` (8.1K, KD 10), `percentage change formula` (6.6K, KD 12), `percentage difference between two numbers` (2.9K, KD 7), Excel terms | **5** |

Even on the weak SERPs, a DA 1 site needs a few backlinks and 4–8 weeks. "Turant ranking" isn't realistic for anyone. What these pages can do is win on usefulness, and Google rewards that over time.
