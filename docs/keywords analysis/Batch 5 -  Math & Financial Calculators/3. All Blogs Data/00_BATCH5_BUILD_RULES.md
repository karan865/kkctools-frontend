# Batch 5 — Build Rules (Math & Financial Calculators)

> **Read before every Batch 5 spec.** Builder: Antigravity / Gemini.
> **Inputs used:** `KKCTools_Batch5_Final_Tool_Keywords.md` (Semrush US) and 20 competitor analyses.
> **Written:** 2026-11-22

---

## 0. Status: provisional (no Semrush SERP export)

Rank chances come from keyword data and known SERP owners.

`TODO(owner)`: pull SERPs for these tools:
- `cagr calculator`
- `roi calculator`
- `stdev calculator`
- `tank volume calculator`
- `rise over run`
- `pythagoras equation solver`

**ROI rule:** if 3+ giants hold the ROI top 5, fold ROI into the CAGR page as a section.

## 1. Project rules (AGENTS.md wins on any conflict)

**Never:**
- network calls in tool code;
- invented facts;
- copying competitor text;
- committing or pushing.

**Always:**
- Use `TODO(owner)` for owner-supplied facts.
- Engine first: pure functions, `null` for undefined cases, −0 → 0.
- Every number in the BLUF, examples and FAQ comes from the engine.
- **Each spec's worked example is a unit test.**
- Run `npm run verify` from PowerShell or the VS Code terminal, never Git Bash.
- graphify:
  - run `graphify query` before searching code;
  - run `graphify update .` after changes;
  - exe path: `$(ls ~/AppData/Roaming/Python/*/Scripts/graphify.exe | head -1)`.

## 2. Accuracy and trust rules

1. **No invented benchmarks:**
   - "good ROI", "good CAGR", "good SD";
   - relationship age-gap statistics;
   - grade scales as fact (label them "typical US scale, edit");
   - tax rates;
   - ramp and drain limits, unless cited from the official document the builder opened.
2. **Exact constants with sources:**
   - 1 in = 2.54 cm;
   - 1 lb = 0.45359237 kg;
   - 1 US gal = 231 in³;
   - 1 ft³ = 1,728 in³.
   - Cite NIST in HowWeCalculate.
3. **Statistics pages:**
   - Name the method: quartile method, sample vs population, Welch default, two-sided default.
   - Verify p-values and quartiles against R or Excel; store them as test fixtures.
   - Never write "95% chance B is better".
4. **Reverse Sales Tax:** no state or city rate tables. The user types the rates.
5. **Budget, ROI, Interest:** planning tools, not advice. Neutral copy, no product links.
6. **Fraction to Percent:**
   - **one URL only**, never per-fraction pages;
   - it complements the live Percentage Change page (part-of-whole vs change), so link both ways and don't duplicate.

## 3. Shared code (build once)

| File | Exports | Used by |
|---|---|---|
| `src/lib/stats-engine.ts` (+ test) | parse numbers (any separator), sort, mean, median, mode, quartiles by method, sample/population variance & SD, SE, z, normal CDF (accurate erf), Student t CDF + inverse (regularized incomplete beta), lgamma, binomial pmf/cdf | IQR, Standard Deviation, Binomial, T-Test, A/B Test |
| `src/lib/growth-engine.ts` (+ test) | `cagr`, `endFromCagr`, `yearsFromCagr`, `yearFrac(start, end)`, `doublingTime`, `ruleOf(n)`, `annualize(roi, years)` (reuse `tvm-engine` / `percent-engine` where possible) | CAGR, ROI |
| `src/lib/volume-units-engine.ts` (+ test) | exact volume constants and conversions (US gal, imp gal, L, m³, ft³, in³, barrels), box/cylinder volumes | Gallons ↔ ft³, Tank Volume, Metric Conversion |
| `src/lib/date-diff-engine.ts` (+ test) | UTC date-only Y/M/D difference, total days, add years, the Feb 29 rule, day-count conventions (act/365, act/360, 30/360 US, act/act) | Age Difference, Simple & Accrued Interest, CAGR (dates) |

## 4. Shared UI (live pattern)

- `ToolShell` wraps the calculator. Give it the spec's 4 **true** pills; no ratings, never `aggregateRating`.
- `TabSlider` with `?tab=`.
- **The page must have a `<main>` element:** `<main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>`.
- **Input guide diagram ABOVE the inputs** (same as Batch 3 §9):
  - `<Name>InputGuide.tsx`, inline SVG;
  - numbered callouts = numbered field labels;
  - live values, focus highlight;
  - `role="img"` + title/desc;
  - tokens only (light + dark);
  - mobile `<details>`;
  - one diagram per tab.
- **New catalog category `Math & Finance`,** added with the first tool. Hubs:
  - Stats: IQR ↔ SD ↔ T-Test ↔ Binomial ↔ A/B;
  - Growth: CAGR ↔ ROI ↔ Simple Interest ↔ live Compound Interest;
  - Units: Gallons ↔ Tank ↔ Metric;
  - Everyday: Ratio, Fraction %, Age, Final Grade, Budget, Reverse Tax;
  - Construction maths: Pythagorean ↔ Slope ↔ live Rafter/Stud.

## 5. Files a tool touches

**New:**
- engine + test;
- component folder (calculator, InputGuide, optional result chart, `index.ts`);
- `src/app/<slug>/page.tsx` + `page.module.css`.

**Edit:**
- `routes.ts`;
- `tools-catalog.ts` + count test;
- `calculation-methods.ts`;
- `ToolArt.tsx`, `Icons.tsx`, `Footer.tsx`;
- docs 00/01/02/04/06.

## 6. Page structure and SEO

- `buildMetadata`, with `absoluteTitle` when the title + " | KKC Tools" is over 60.
- Breadcrumbs, then JsonLd (WebApplication + FAQPage + BreadcrumbList).
- Calculator above the fold, working with defaults.
- BLUF in the first 60 words, with engine numbers.
- Result sentence; steps; H2s per spec; FAQ once; HowWeCalculate; related links.
- AdSlots outside the band.
- Mobile 390 px: no page-level horizontal scroll.

## 7. Build order

| Order | Specs | Notes |
|---|---|---|
| Tier 1 | 01 Ratio → 02 Age Difference → 03 IQR → 04 A/B Test → 05 Gallons ↔ ft³ → 06 CAGR → 07 Fraction % → 08 Reverse Sales Tax | |
| Tier 2 | 11 Standard Deviation → 13 T-Test → 12 Binomial | stats engine reuse |
| Tier 2 | 09 Pythagorean → 10 Slope | |
| Tier 2 | 16 Tank Volume | after #5 |
| Tier 2 | 17 Simple Interest → 18 ROI | after #6 |
| Tier 2 | 14 Final Grade → 15 Budget | |
| Tier 3 | 19 Boolean → 20 Metric Conversion | |

**Spec build-order numbers (in each spec header):**

| Order | Spec | Order | Spec |
|---:|---|---:|---|
| 1 | 01 Ratio | 11 | 12 Binomial |
| 2 | 02 Age | 12 | 09 Pythagorean |
| 3 | 03 IQR | 13 | 10 Slope |
| 4 | 04 A/B | 14 | 16 Tank |
| 5 | 05 Gallons | 15 | 17 Simple Interest |
| 6 | 06 CAGR | 16 | 18 ROI |
| 7 | 07 Fraction % | 17 | 14 Final Grade |
| 8 | 08 Reverse Tax | 18 | 15 Budget |
| 9 | 11 Standard Deviation | 19 | 19 Boolean |
| 10 | 13 T-Test | 20 | 20 Metric |

**Do first (fastest wins):** `00_BATCH5_LIVE_PAGE_KEYWORD_UPDATES.md`. About 183,000 searches belong to pages we already have.
- Biggest: the Stone & Gravel page, with `gravel calculator` at 33,100 and `figuring gravel` at 27,100.
- Then: Tons ↔ Yards, Cubic Yard, Sand, and extra rows for the live Percentage Change, Compound Interest, Credit Card Payoff and Present Value pages.
- No new URLs.

**All 20 specs were fully rewritten on 2026-11-22.** Each uses the full competitor analysis:
- snapshot;
- competitor errors found;
- FAQ question bank;
- gaps and blueprint;
- the complete keyword placement.

**Worked examples were checked with node.**
- Some fixtures confirm the competitor analysis: A/B 1.00% vs 1.14% → z 2.152; Tank 6×12 ft → 2,538 / 740.6 gal; Age fixture 12 y 7 m 17 d.
- Others correct competitor errors.
