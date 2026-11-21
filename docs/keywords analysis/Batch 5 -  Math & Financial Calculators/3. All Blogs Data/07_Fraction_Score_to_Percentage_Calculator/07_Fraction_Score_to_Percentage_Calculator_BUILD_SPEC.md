# Fraction & Score to Percentage Calculator — Build Spec

> **URL:** `/fraction-to-percent-calculator/` · Batch 5 · Tier 1 · rank chance 🟡 · **Build order 7**
> **Read first:** `../00_BATCH5_BUILD_RULES.md` (§2.6 one-URL rule)
> **Inputs used:**
> - `07_Fraction_Score_to_Percentage_Calculator_Competitor_Analysis.md` (6 pages read, 2026-11-14)
> - keyword file §2 #7
> - Semrush CSV long tail
>
> **SERP:** provisional
> **Written:** 2026-11-22 (full rewrite after the research pass)

---

## 0. Strategy

**Search demand:**
- A 99-keyword cluster, ~263,000 searches.
- ~170 fraction and score phrases (~150,000 combined, mostly KD 7–24), e.g. "16 out of 20 as a percentage" and "4/5 to a percent".
- The primary `percentage finder` is 2,900 at KD 7 and rising.

**🟡 risk:** Google and AI answers take many of these, and most rows are declining.

**Our counter:** one page that does **all three jobs** with real tools and tables.

**Three intents, and no competitor joins them:**
1. **Fraction → %:** Omni, Inch, Cuemath. Only Inch handles mixed numbers.
2. **"X is what % of Y":** CalculatorSoup, Omni.
3. **Score → % + letter grade:** Omni test-grade, Pearson.
   - Omni's editable scale leaves **gaps** (82.5% is neither B− nor B).
   - Pearson's scale is fixed.

**Tables:**
- Inch's fraction chart **truncates repeating decimals** (1/3 = 33.3%, 2/3 = 66.6%) without marking them.
- **No page has a score table** ("out of 10/15/20/25…"), yet ~40 keyword phrases ask for exactly that.

**🚫 Never one URL per fraction or score** (doorway/thin content). All long-tail phrases are answered by the engine tables on this one page.

**Overlap:**
- This page covers "X of Y", fractions and scores.
- The live **Percentage Change** page covers change and difference.
- Cross-link both ways. Don't duplicate H2 topics.

## 1. Keywords and placement

| Role | Keyword | US vol | KD | Where it goes |
|---|---|---:|---:|---|
| **Primary** | percentage finder | 2,900 | 7 | First sentence + tool heading ("Percentage finder") + H2 |
| Secondary | how to find a percentage · how to find the percentage of a number · how to calculate a percentage of a number · how do you calculate percentage of a number | 8,100 · 8,100 · 4,400 · 720 | 6–22 | H2 "How to find a percentage of a number" (Tab 3) |
| Secondary | what percent · what's the percentage · what the percentage of | 5,400 · 3,600 · 2,900 | 18–22 | H2 "X is what percent of Y" |
| Secondary | x is what percent of y formula · what percentage is x of y formula | 720 · 720 | 0 | Formula box in that H2 + FAQ |
| Secondary | how to subtract a percentage from a number · how do you minus a percentage from a number | 720 · 720 | 10–14 | H3 "Adding or subtracting a percentage" + FAQ |
| Secondary | how to find the percentage of two numbers · how to find numbers from percentage | 4,400 · 3,600 | 25–28 | FAQ + "find the whole" mode |
| Secondary | what is percentage | 3,600 | 29 | One-paragraph definition at the top of the content |
| Long tail: fractions (42 phrases, ~131K) | `4/5 to a percent` 6,600 · `1/3 as a percent` 5,400 · `3/2 percent` 5,400 · `3/5 in percent` 5,400 · `5/4 in percentage` 5,400 · `8/3 as a percent` 5,400 · `1 1/4 to percent` 4,400 · `3/4 to a percent` 4,400 · `4 3/4 as a percent` 4,400 · `2/5 as percentage` 3,600 · `3/8 in a percent` 3,600 · `percent of 5/7` 3,600 | | 13–29 | **Engine fraction table** + the FAQ examples below. Each answer appears as a table row. No separate pages |
| Long tail: scores (40 phrases, ~73K) | `16 out of 20 as a percentage` 6,600 · `18 out of 20` 4,400 · `10 of a 100` 4,400 · `11 out of 15` 3,600 · `12 of 20 is what percentage` 3,600 · `13 out of 15` 2,900 · `20 out of 25` 2,900 · `21 out of 25` 2,900 | | 12–27 | **Engine score table** (out of 10, 12, 15, 20, 25, 30, 40, 50, 60, 100) with letter grades |
| Skip | how to find a number as a percentage · do percentage calculator | | | irregular trend |

## 2. Our edge (6 competitors checked)

| Feature | Competitors with it |
|---|---|
| One page, 3 tabs: fraction · score + grade · percent of a number | **0** (each covers one) |
| Fraction input: a/b, mixed (1 1/4), improper, decimal → %, decimal, simplified fraction, steps | fraction 4/6 · **mixed 1/6** |
| **Repeating decimals marked** (33.3̅%) + precision control | **0/6** |
| Score mode: earned **or** number wrong, out of total, + bonus → %, letter grade, points to the next grade | grade 2/6 |
| Editable grade scale with **half-open bands (no gaps)**, ± option | 1/6 (with gaps) |
| **Score table** (out of N) with grades, printable | **0/6** |
| Fraction table: denominators 2–16 + 20, 25, 32, 50, 100, correct repeats | 1/6 (truncated) |
| Reverse: % → simplified fraction; whole from part + % | partial |

## 3. Calculator spec

### 3.1 Tabs

1. **Fraction → percent** (default)
2. **Score → percent & grade**
3. **Percent of a number** (P% of X · X is what % of Y · X is P% of what · X ± P%)

### 3.2 Input guide diagram (above the inputs)

`FractionInputGuide.tsx`

- **Fraction tab:** a 10 × 10 grid (or pie). "1 Top number (part)" cells are shaded out of "2 Bottom number (whole)", with the live % in the middle. Mixed numbers show whole grids plus a partial grid.
- **Score tab:** a test paper with "3 Points earned" (or "number wrong") and "4 Total points", and a grade badge.
- **Percent tab:** a bar showing "5 Percent" of "6 Number".

### 3.3 Inputs (defaults = examples)

| Tab | Default |
|---|---|
| Fraction | 4/5 (accepts `3/8`, `1 1/4`, `5/4`, `0.375`) |
| Score | 16 out of 20; mode earned/wrong; bonus optional |
| Grade scale | A ≥ 90, B ≥ 80, C ≥ 70, D ≥ 60, F < 60, with an optional ± scale. Label: "a common US scale; schools differ, so edit it" (saved locally) |
| Percent | 15% of 80 |
| Precision | 2 decimals |

### 3.4 Engine (`src/lib/fraction-percent-engine.ts`)

```ts
parse: "w a/b" → (w·b + a)/b ; "a/b" ; decimal → rational (×10ⁿ, reduce)
percent = a/b × 100 (null if b = 0) ; decimal ; simplified = gcd reduce
repeating: reduced denominator has a prime factor ∉ {2,5} → mark repetend (long division, cycle detection) → "33.3̅%"
score: (earned + bonus)/total or (total − wrong)/total ; grade by half-open bands ; pointsToNext = ceil(nextCutoff·total/100) − earned
percentOf(p, x) = x·p/100 ; whatPercent(x, y) = x/y·100 ; wholeFrom(x, p) = x/(p/100) ; addPct/subPct = x·(1 ± p/100)
pctToFraction(p) → reduced p/100
tables: fractionTable(denominators) ; scoreTable(totals) with grades
```

**Worked examples (match the top long-tail queries; checked 2026-11-22):**

| Input | Result | Input | Result |
|---|---|---|---|
| 4/5 | **80%** | 3/2 | **150%** |
| 3/5 | **60%** | 5/4 | **125%** |
| 1/3 | **33.3̅%** (33.33%) | 8/3 | **266.6̅%** |
| 3/4 | **75%** | 1 1/4 | **125%** |
| 4 3/4 | **475%** | 3/8 | **37.5%** |
| 16 out of 20 | **80% (B)** | 18 out of 20 | **90% (A)** |
| 11 out of 15 | **73.3̅% (C)** | 13 out of 15 | **86.6̅% (B)** |
| 20 out of 25 | **80%** | 21 out of 25 | **84%** |
| 12 of 20 | **60%** | 15% of 80 | **12** |
| 1/4 of 1 percent | **0.25%** | | |

### 3.5 Outputs

- **Headline:** the percent (with the repeat bar), plus the decimal and the simplified fraction.
- **Sentence:** "16 out of 20 is 80%: a B on the scale shown. You'd need 2 more points for an A."
- Steps.
- Fraction and score tables on the page (printable, Copy CSV).
- Share URL.

### 3.6 Tests

- Parsing (mixed, improper, decimals, spaces).
- Repeat detection (1/3, 2/3, 1/7, 5/6).
- Half-open grade bands at boundary values (89.99, 90, 82.5).
- Points to the next grade.
- All percent modes; b = 0.
- Every example above. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Fraction to Percent Calculator – X out of Y as %` (48; 60 with the suffix: OK) |
| Meta | `Free fraction to percent calculator. Turn 4/5, 3/8 or a test score like 16 out of 20 into a percentage, with steps, a letter grade and a full fraction table.` (157) |
| H1 | `Fraction to Percent Calculator: X out of Y as a Percentage` |
| First sentence | "Use this percentage finder to turn any fraction or test score into a percentage, or to find a percent of a number." |
| BLUF | "To turn a fraction or score into a percentage, divide the part by the whole and multiply by 100. 4/5 = 80%, 16 out of 20 = 80%, 3/8 = 37.5%, and 1/3 = 33.3% (the 3 repeats)." (engine) |
| ToolShell pills | `Fractions & mixed numbers`, `Scores with letter grade`, `Percent of a number`, `Printable fraction & score tables` |
| Links out | Percentage Change (live), Final Grade (#14), Ratio (#1), Discount (live) |
| Links in | Percentage Change (add "part of a whole? use the fraction calculator"), Final Grade, Ratio, Tools hub "Everyday" |

## 5. Content (~1,500–1,800 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | What is a percentage? | 2-line definition (`what is percentage`) | 80 |
| 2 | How to use the percentage finder | 3 tabs | 100 |
| 3 | How to turn a fraction into a percent | Method + examples 4/5, 3/5, 3/4; mixed 1 1/4 and 4 3/4; improper 5/4, 3/2, 8/3 (>100%) | 250 |
| 4 | Repeating decimals: 1/3, 2/3 and 1/7 | Why they repeat, how we show them | 130 |
| 5 | X out of Y as a percentage (test scores) | 16/20, 18/20, 11/15, 13/15, 21/25 examples; letter grades; scales vary | 220 |
| 6 | X is what percent of Y | Formula box + example (`x is what percent of y formula`) | 150 |
| 7 | How to find a percentage of a number | 15% of 80 + the whole from a part (`how to find the percentage of a number`) | 150 |
| 8 | Adding or subtracting a percentage | Examples (`how to subtract a percentage from a number`) | 120 |
| 9 | Fraction and score tables | Engine tables; how to read them | 80 |
| 10 | FAQ | §6 | 420 |

## 6. FAQ (12, from the question bank + top long-tail)

1. How do you turn a fraction into a percentage?
2. What is 16 out of 20 as a percentage? (80%)
3. What is 4/5 as a percent? (80%)
4. What is 1/3 as a percent, and why does it repeat?
5. What is the "x is what percent of y" formula?
6. How do you find the percentage of a number?
7. How do you subtract a percentage from a number?
8. How do I convert a mixed number like 1 1/4 to a percent? (125%)
9. Can a percentage be more than 100%? (5/4 = 125%, 8/3 = 266.6̅%)
10. What letter grade is my percentage? (scale editable)
11. How do I convert a percent back to a fraction?
12. How do I find the whole number from a part and a percent?

## 7. Done when

- [ ] `fraction-percent-engine.ts` + tests (all examples); `npm run verify` passes.
- [ ] One URL only; tables generated on the page; no per-value routes in `routes.ts` or the sitemap.
- [ ] InputGuide above the inputs; ToolShell + TabSlider + fonts + `<main>`.
- [ ] Grade-scale wording approved by the owner; cross-links with Percentage Change added.
- [ ] Registrations + docs; `graphify update .`.
