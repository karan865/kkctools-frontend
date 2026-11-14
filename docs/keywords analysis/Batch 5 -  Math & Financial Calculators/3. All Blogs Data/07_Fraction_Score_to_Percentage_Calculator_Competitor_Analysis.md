# Fraction & Score to Percentage Calculator — Competitor Analysis

> **Target page:** KKCTools `/fraction-to-percent-calculator/` (Batch 5, Tool #7 🟡)
> **Primary keyword:** `percentage finder`: US 2,900 · KD 7 · rising.
> **Cluster:** 99 keywords, 263,520 US vol. It includes about 42 "a/b as a percent" phrases (131k) and about 40 "X out of Y as a percentage" phrases (72.7k).
> **SERP source:** ⚠ No Semrush SERP export for Batch 5. Competitors come from live web searches on 2026-11-14 for `percentage finder calculator fraction to percent score` and `test score percentage calculator out of letter grade`. `TODO(owner): pull Google top 10 for "percentage finder", "16 out of 20 as a percentage", "4/5 to a percent".`
> **Pages visited (2026-11-14):** 6 read (Omni fraction→%, Inch fraction→%, CalculatorSoup percentage, Cuemath fraction→%, Omni test grade, Pearson test grade). 1 blocked (Dad's Worksheets visual percentage, 403).

---

## 0. How this was collected (read first)

- **Three overlapping intents go to one page:**
  1. **Fraction → %:** Omni, Inch, Cuemath. Also PlanetCalc, Redcrab, Firgelli and num8ers, which were not read.
  2. **"X is what % of Y" / percentage finder:** CalculatorSoup, Omni percentage, Inch percentage.
  3. **Score → % + letter grade:** Omni test-grade, Pearson test-grade, Inch, Rows and Firgelli.
- **Keyword-file rule:** **never create one URL per fraction or score.** One page, with tables built by the engine. Some competitors and clones use per-value pages, for example Inch's 4 sample conversion pages and the programmatic converters. We avoid that doorway pattern.
- **Overlap:** this tool sits next to Percentage Change (Batch 3 #1). This page covers "X of Y". That page covers change and difference. Cross-link the two.
- Arithmetic was re-checked. Competitor tables were checked for repeating-decimal handling. No competitor text was copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | omnicalculator.com/math/convert-fraction-to-percentage | Giant | Fraction to Percent Calculator | 550–600 |
| 2 | inchcalculator.com/fraction-to-percent-calculator/ | Calc site | Fraction to Percent Calculator | ~650 |
| 3 | calculatorsoup.com/calculators/math/percentage.php | Calc giant | Percentage Calculator | ~1,300 |
| 4 | cuemath.com/calculators/fraction-to-percent-calculator | Ed-tech (India) | Fraction to Percentage Calculator | 250–300 |
| 5 | omnicalculator.com/other/test-grade | Giant | Test Grade Calculator | ~900 |
| 6 | pearson.com/channels/calculators/test-grade-calculator | Education publisher | Test Grade Calculator | 850–900 |
| — | dadsworksheets.com/percentage-calculator.html | Worksheets site | Visual Percentage Calculator | **blocked (403)** |

**What this tells us:**
- **No competitor joins the three intents.** Fraction pages have no score or grade feature. Grade pages have no fraction or mixed-number input. Percentage pages cover "X of Y" but not fractions or grades.
- **Mixed numbers:** only Inch supports them (whole + numerator + denominator).
- **Tables:**
  - Inch has a fraction chart for denominators 2–16, but **truncates repeating decimals** without marking them (1/3 = 33.3 %, 2/3 = 66.6 %) and uses inconsistent precision.
  - Omni's test-grade page has a grade table, and its "increment by" setting is unclear.
  - **No page has a scores table** for "out of 10/15/20/25/30/40/50", even though about 40 keyword phrases ask for exactly that.
- **Grade scales:**
  - Omni lets you edit the scale, but its whole-number bands leave gaps (82.5 % is neither B− nor B).
  - Pearson's scale is fixed to A/B/C/D/F.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Omni frac | Inch frac | CalcSoup % | Cuemath | Omni grade | Pearson grade |
|---|---|---|---|---|---|---|
| Fraction a/b → % | ✅ | ✅ | ⚠️ (as X of Y) | ✅ | ⚠️ | ⚠️ |
| Mixed number (1 1/4) | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Improper fraction (5/4 → 125 %) | ✅ | ✅ | ✅ | ? | ❌ | ❌ |
| Decimal output | ⚠️ (step) | ⚠️ | ⚠️ | ❌ | ❌ | ❌ |
| Simplified fraction output | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Repeating decimals marked (33.3̅ %) | ❌ | ❌ (truncated) | ❌ | ❌ | ❌ | ❌ |
| Precision control | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ sig figs |
| % → fraction (reverse) | ✅ (20 % example left at 2/10) | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| X is what % of Y | ⚠️ | ❌ | ✅ | ❌ | ✅ (score) | ✅ |
| P % of X | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Add / subtract a % | ❌ | ❌ | ✅ (6 modes) | ❌ | ❌ | ❌ |
| Score: number wrong → % | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Letter grade | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Editable grade scale | ❌ | ❌ | ❌ | ❌ | ✅ (gaps between bands) | ❌ |
| Curve / bonus points | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Fraction table | ❌ | ✅ (2–16, truncated) | ❌ | ❌ | ❌ | ❌ |
| Score table (out of N) | ❌ | ❌ | ❌ | ❌ | ✅ (one total at a time) | ❌ |
| Steps | ✅ | ✅ | ⚠️ (article) | ⚠️ (image) | ⚠️ | ✅ |

---

## 3. Feature matrix — content and trust

| Item | Omni frac | Inch frac | CalcSoup % | Cuemath | Omni grade | Pearson grade |
|---|---|---|---|---|---|---|
| Formulas | ✅ n/d × 100 | ✅ | ✅ 3 forms | ⚠️ loose | ✅ | ✅ |
| Worked examples (checked) | ✅ (1 not fully simplified) | ✅ 3/4, 1 3/4 | ✅ 8 | ✅ 12/25 | ✅ 3 (82.5 % gap) | ✅ 4 |
| "Grading scales vary" caveat | n/a | n/a | n/a | n/a | ✅ | ✅ FAQ |
| FAQ count | 4 | 0 | 0 | 0 | 4 | 4 |
| Named author | ✅ + reviewer | ✅ + MS educator | ✅ | ❌ | ✅ PhD + reviewers | ❌ |
| Date | ❌ | ❌ | ✅ Aug 2025 | ❌ | ❌ | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. Omni: Fraction to Percent Calculator (Bogna Szyk, Piotr Małek; reviewer Jack Bowater)
- **Inputs:** numerator and denominator only. Includes a percent → fraction section.
- **Method:** divide, × 100. Examples 4/5 = 80 % ✔ and 3/4 = 75 % ✔.
- **Error:** the 20 % example stops at 2/10. It should reduce to **1/5**.
- **FAQs (4):** fraction → %, % → fraction, 20 % as a fraction, 3/4 as %.
- **Weak points:** no mixed numbers, no repeating-decimal handling, no table, no date.

### 2. Inch Calculator: Fraction to Percent (Joe Sexton; reviewer Bailey Nelson MS)
- **Inputs:** whole + numerator + denominator (mixed numbers supported). Steps shown.
- **Examples:** 3/4 = 75 % ✔ and 1 3/4 = 175 % ✔.
- **Chart:** denominators 2, 3, 4, 5, 6, 8, 9, 10, 12, 16.
  - Truncates repeating decimals: 1/3 = 33.3 %, 2/3 = **66.6 %**, when the rounded value is 66.67 %.
  - Precision is inconsistent (16.66 %, 8.333 %).
- **Weak points:** no FAQ, no date, no reverse mode, no score mode.

### 3. CalculatorSoup: Percentage Calculator (Edward Furey, Aug 2025)
- **Modes:**
  - What is P % of X
  - X is what % of Y
  - X is P % of what
  - Six add/subtract variants
- **Examples:** all 8 ✔ (e.g., 12 of 60 = 20 %, 6 of 27 = 22.22 %).
- **Weak points:** no FAQ, rounding not stated, typos ("Or or"), duplicated related blocks.

### 4. Cuemath: Fraction to Percentage Calculator (India, students)
- **Inputs:** numerator and denominator. Example 12/25 = 48 % ✔, with the division shown only in an image.
- **Weak points:**
  - Title and H1 don't match.
  - Practice problems have no answers.
  - No mixed numbers or repeating decimals.
  - Heavy promotion.

### 5. Omni: Test Grade Calculator (Hanna Pamuła PhD et al.)
- **Inputs:** total points, number wrong or number correct.
- **Outputs:** % and letter grade. Editable scale with an option to ignore +/− grades. Grade table with an "increment by" setting.
- **Examples:** 15/18 = 83.33 % B ✔, 27/40 = 67.5 % D+ ✔, 75/80 = 93.75 % A ✔.
- **Gap:** 7 wrong of 40 = 82.5 % is labelled "B−", but the scale's bands are B− 80–82 and B 83–86, so 82.5 % falls in neither.
- **Error:** calls a percentage a "percentile".

### 6. Pearson: Test Grade Calculator
- **Modes:**
  - Single test: earned, possible, curve.
  - Final exam: current grade, weight, target. This overlaps with Final Grade (#14).
- **Examples:** 42/50 + 3 = 90 % A ✔, 17/25 = 68 % D ✔, required final ≈ 92 % ✔.
- **FAQs (4):** curve, letter scale, impossible targets, letters in final mode.
- **Weak points:** fixed scale, no author or date, rounding rule vague.

---

## 5. Patterns

- **Maths:**
  - % = a ÷ b × 100.
  - Mixed number w a/b = (w·b + a)/b.
  - % → fraction = p/100, simplified by GCD (decimals: × 10ⁿ first).
  - P % of X = X × P/100.
  - X ± P % = X × (1 ± P/100).
  - Score with wrong answers: (total − wrong) ÷ total.
- **Repeating decimals:** if the reduced denominator has prime factors other than 2 and 5, the decimal repeats. Show it with an overbar (33.3̅ %) and also rounded to the chosen decimal places.
- **Letter grades:**
  - Default US scale: A ≥ 90, B ≥ 80, C ≥ 70, D ≥ 60, F < 60.
  - Optional +/− scale.
  - **Bands use half-open ranges (≥ lower, < next)**, so no value falls into a gap.
  - Scale is editable and saved locally.
  - Label: "scales vary by school". `TODO(owner)`: confirm the default scale wording; it is a convention, not an official standard.
- **Tables (generated by our engine on the same page):**
  - Fraction table: denominators 2–16, plus 20, 25, 32, 50, 100.
  - Score table: out of 10, 12, 15, 20, 25, 30, 40, 50, 60, 100, with letter grades.

| Section | Pages (of 6) |
|---|:---:|
| Fraction → % | 4 |
| Mixed numbers | 1 |
| % of a number / X of Y | 3 |
| Letter grade | 2 |
| Editable scale | 1 |
| Fraction table | 1 (truncated decimals) |
| Score table (out of N) | **0** |
| Repeating decimals handled | **0** |

---

## 6. FAQ question bank

★ = asked on 2 or more pages, or a cluster keyword. Map to: percentage finder, how to find a percentage, how to find the percentage of a number, what percent, x is what percent of y formula, how to subtract a percentage from a number, "a/b as a percent" long tail, and "X out of Y as a percentage" long tail.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How do you turn a fraction into a percentage? | Omni, Inch, Cuemath · `4/5 to a percent` etc. |
| 2 | ★ How do you work out X out of Y as a percentage? | Omni grade, Pearson, CalcSoup · `16 out of 20 as a percentage` |
| 3 | ★ What is the "x is what percent of y" formula? | CalcSoup · `x is what percent of y formula` |
| 4 | ★ How do you find a percentage of a number? | CalcSoup · `how to find the percentage of a number` (8,100) |
| 5 | ★ What letter grade is my percentage? | Omni grade, Pearson |
| 6 | How do you convert a percent back to a fraction? | Omni |
| 7 | How do you subtract or add a percentage? | CalcSoup · `how to subtract a percentage from a number` |
| 8 | What is 1/3 (or 2/3) as a percent, and why does it repeat? | Inch (truncated) · `1/3 as a percent` |
| 9 | How do I convert a mixed number (1 1/4) to a percent? | Inch |
| 10 | What is a percentage? | `what is percentage` |
| 11 | How do I find the whole from a part and percent? | CalcSoup · `how to find numbers from percentage` |
| 12 | Can a percentage be more than 100 %? (5/4, 8/3) | `5/4 in percentage`, `8/3 as a percent` |

---

## 7. Gaps nobody fills — our opportunities

1. **One page, three tabs:** Fraction → % · Score → % + grade · Percent of a number (± %). This answers the 99-keyword cluster without doorway pages.
2. **Fraction input that accepts anything:** a/b, mixed 1 1/4, improper fractions, decimals. Outputs the percent, the decimal, the simplified fraction and the steps.
3. **Repeating decimals marked correctly**, plus a precision control.
4. **Score mode:** points earned or number wrong, out of a total. Shows the %, the letter grade (editable scale, no band gaps) and points to the next grade.
5. **Engine-generated tables on the page:** fractions (2–16 and more) and scores (out of 10–100) with letter grades. Printable.
6. **Reverse modes:** % → fraction (fully simplified), and the whole from a part and a %.
7. **Clear examples matching top long-tail queries:** 16/20, 4/5, 3/8, 1/3, 5/4, 18/20, 11/15. Our own text.
8. **Cross-links:** Percentage Change (Batch 3 #1), Final Grade (#14), Ratio (#1), Discount (Batch 3 #9).

---

## 8. Blueprint for the KKCTools Fraction & Score to Percentage Calculator

### 8.1 SEO

- **URL:** `/fraction-to-percent-calculator/`
- **Title:** Fraction to Percent Calculator – X out of Y as %
- **H1:** Fraction to Percent Calculator: X out of Y as a Percentage
- **Meta:** as in the keyword file (157 chars).
- **H2s:** fraction to percent · X out of Y as a percentage · percentage finder (X is what % of Y) · percent of a number · fraction and score tables.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Tab 1: Fraction | a/b, mixed, improper, decimal → %, decimal, simplified fraction, repeating marker, steps |
| Tab 2: Score | Earned (or wrong) + total (+ bonus) → %, letter grade (editable scale, ±), points to next grade |
| Tab 3: Percent | P % of X · X is what % of Y · X is P % of what · X ± P % |
| Reverse | % → simplified fraction |
| Tables | Fraction table, score table (out of N, chosen totals), printable |
| UX | Precision control, share URL, copy, no network |

### 8.3 Content outline (≈ 1,300–1,600 words, original)

1. Quick answer examples and intro
2. How to use
3. How to turn a fraction into a percent (incl. mixed and improper), with examples
4. Repeating decimals (1/3, 2/3, 1/7)
5. X out of Y as a percentage, with test-score examples
6. Percent to letter grade (scales vary)
7. Percent of a number, and adding or subtracting a percent
8. Percent to fraction
9. Fraction table and score table
10. FAQ (10–12)
11. Related tools: Percentage Change (Batch 3 #1), Final Grade (#14), Ratio (#1), Discount (Batch 3 #9)

### 8.4 Quality checks

- **Unit tests:**
  - parser (mixed, improper, decimals, spaces)
  - repeating detection
  - GCD simplification
  - grade bands with no gaps (82.5 → B− or B per the scale)
  - all percent modes
  - generated tables
- No per-fraction URLs. No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - pull Google top 10
  - confirm the default grade scale wording
  - check Dad's Worksheets manually
