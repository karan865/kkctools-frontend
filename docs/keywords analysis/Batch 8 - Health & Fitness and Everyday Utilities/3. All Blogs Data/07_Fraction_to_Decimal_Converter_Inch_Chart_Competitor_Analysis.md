# Fraction to Decimal Converter (with Inch Chart): Competitor Analysis

> **Target page:** KKCTools `/fraction-to-decimal/` (Batch 8, Tool #7 ✅)
> **Primary keyword:** `fraction to decimal chart`. US 8,100 · KD 15 · CPC $1.30.
> **Cluster:** 110 keywords, 884,300 US searches. About 95 are "3/8 as a decimal" style phrases (805k). The cluster also includes `fraction to decimal` (22,200, KD 21) and `inches to decimal` (3,600).
> **SERP source:** ⚠ There is no Semrush SERP export for Batch 8. Competitors come from a live web search on 2026-11-14 for `fraction to decimal chart inches 1/64`, plus Omni. `TODO(owner): pull Google top 10 for "fraction to decimal chart" and "3/8 as a decimal".`
> **Pages visited (2026-11-14):** 4 read (Metal Supermarkets table, Inch Calculator inch-fraction, Engineering ToolBox chart, Omni fraction→decimal). CalculatorSoup's URL returned 404.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Industrial suppliers: Metal Supermarkets, MISUMI, OnlineMetals, MW Components, MTC.
  - Engineering references: Engineering ToolBox.
  - Calc sites: Inch, Omni, CalculatorSoup.
  - Scribd PDFs, pages.dev clones, and spam on hijacked domains.
  - Most top results are **charts**, not calculators. Industrial buyers print them, which is why ad competition is 1.00.
- **The keyword file says:** never one page per fraction. Build one chart (every /2 to /64 fraction) plus the converter. Google answers the simple ones directly, so **the chart and the inch mode are why people will click.**
- **Problems found when we re-checked values:**
  - Metal Supermarkets' mm column is **truncated, not rounded**. 1/64 should be 0.397 mm but shows 0.396; 1/16 should be 1.588 but shows 1.587; 5/16 should be 7.938 but shows 7.937.
  - Engineering ToolBox calls its page a "Calculator" but it is only a chart.
  - Omni says "up to 16 places" in one spot and "15" in another, and gives no guidance on repeating decimals.
- **Mixed-number long tail:** queries like `3 3/8 as decimal` and `13/5 as a mixed number` need mixed-number input and output.
- No competitor text was copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | metalsupermarkets.com/fraction-to-decimal-and-metric-conversion-table/ | Metal supplier | Standard Fraction to Decimal and Metric Conversion Table | ~90 + table |
| 2 | inchcalculator.com/inch-fraction-calculator/ | Calc site | Inch Fraction Calculator | ~1,300 (incl. chart) |
| 3 | engineeringtoolbox.com/fractional-decimal-equivalents-d_1159.html | Engineering reference | Fraction to Decimal Inches Conversion Chart | ~75 + table |
| 4 | omnicalculator.com/math/fraction-to-decimal | Giant | Fraction To Decimal Converter | 600–700 |
| — | calculatorsoup.com/…/fractiontodecimal.php | Calc giant | — | **404** |

**What this tells us:**
- **Metal Supermarkets** has the industrial-standard table: 1/64 to 1 inch, with fraction, decimal (6 places, ✔) and mm columns. The **mm column is truncated** and shows inconsistent decimal places. It offers a PDF.
- **Inch Calculator** converts a fraction or decimal into fraction, decimal, ft, mm, cm and m. It has precision presets (1/16, 1/32, 1/64), a 1/64 chart that is **duplicated**, and 5 FAQs.
- **Engineering ToolBox** shows equivalent forms across denominator columns (64ths, 32nds, 16ths and so on) to 4 decimal places. It has **no calculator**, despite its title.
- **Omni** handles simple and mixed fractions, rounds to 0–16 places, and links to a reverse tool. It has **no chart, no repeating-decimal notation and no inch mode**.
- **No page has all of these:**
  - fraction or mixed number → decimal, with **repeating decimals shown with a bar** (3/7 = 0.4̅2̅8̅5̅7̅1̅)
  - decimal → fraction in **simplest form**, plus the **nearest 1/16, 1/32 or 1/64** for inch work, with the error shown
  - a **printable chart** from 1/64 to 1 inch, with decimal and **correctly rounded mm** (plus columns for equivalent forms)
  - a compare mode for fractions (`19/32 vs 5/8`)
  - an improper ↔ mixed-number converter

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Metal Supermarkets | Inch | Eng. ToolBox | Omni |
|---|---|---|---|---|
| Fraction → decimal (calculator) | ❌ | ✅ | ❌ | ✅ |
| Mixed numbers | ❌ | ✅ | ❌ | ✅ (field not shown) |
| Repeating-decimal notation | ❌ | ❌ | ❌ | ❌ |
| Rounding control | ❌ | ⚠️ | ❌ | ✅ (0–16, inconsistent) |
| Decimal → fraction (simplest) | ❌ | ✅ | ❌ | ⚠️ (link) |
| Nearest 1/16 / 1/32 / 1/64 + error | ❌ | ✅ (precision) | ❌ | ❌ |
| mm / cm / ft output | ✅ (mm, truncated) | ✅ | ⚠️ (25.4 note) | ❌ |
| Chart 1/64 → 1 | ✅ | ✅ (duplicated) | ✅ | ❌ |
| Equivalent-forms columns | ❌ | ❌ | ✅ | ❌ |
| Chart beyond 1 inch / mixed | ❌ | ❌ | ❌ | ❌ |
| Printable / PDF | ✅ (PDF) | ❌ | ❌ | ❌ |
| Compare two fractions | ❌ | ❌ | ❌ | ❌ |
| Improper ↔ mixed | ❌ | ❌ | ❌ | ⚠️ |

---

## 3. Feature matrix — content and trust

| Item | Metal Supermarkets | Inch | Eng. ToolBox | Omni |
|---|---|---|---|---|
| Method explained (divide; power-of-10 method) | ❌ | ✅ (0.695 × 16 example ✔) | ⚠️ | ✅ (method 1 limits unstated) |
| Accuracy | ⚠️ (**mm truncated**) | ✅ (one row missing its unit) | ✅ | ✅ |
| Errors | rounding; title mismatch | duplicate chart; "imperial" wording | "Calculator" title has no tool; placeholder citation | 15 vs 16 places |
| FAQ count | 0 | 5 | 0 | 0 |
| Named author | ❌ | ✅ (+ PhD reviewer) | ❌ | ✅ (+ reviewer) |
| Date | ❌ | ❌ | ⚠️ (2018) | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. Metal Supermarkets: Fraction to Decimal & Metric table (supplier)
- **Table:** 64 rows from 1/64 to 1. Decimals are correct to 6 places ✔. The mm column has 3 places, **truncated**:
  - 1/64 → 0.396 (should be 0.397)
  - 1/16 → 1.587 (should be 1.588)
  - 5/16 → 7.937 (should be 7.938)
- **Weak points:**
  - Trailing zeros are dropped inconsistently.
  - Title and heading don't match.
  - Promotional boilerplate.

### 2. Inch Calculator: Inch Fraction Calculator (Joe Sexton; reviewer Ethan Dederick PhD)
- **Input:** a fraction or decimal.
- **Output:** fraction, decimal, ft, mm, cm, m. 5/8" = 0.625 in = 15.875 mm ✔.
- **Precision:** 1/16, 1/32, 1/64.
- **Example:** 2.695 → 2 11/16 ✔.
- **FAQs (5).**
- **Weak points:**
  - The chart is duplicated under two headings.
  - The 19/64 row is missing its unit.
  - Calls US units "imperial".
  - No date.

### 3. Engineering ToolBox: Fractional decimal equivalents
- **Chart:** 1/64 to 64/64, with equivalent-form columns (64ths, 32nds, 16ths, 8ths, 4ths, ½, 1) to 4 decimal places. All ✔.
- **Weak points:**
  - The title promises a calculator, but there is none.
  - Sparse table layout.
  - Stops at 1 inch.
  - Placeholder citation text.
  - Dated (2018).

### 4. Omni: Fraction to Decimal Converter (Rita Rain; reviewer Czernia PhD)
- **Input:** simple or mixed fraction. Rounds to 0–6, 10 or custom.
- **Examples:** all ✔ (2/5, 3/4, 1/25, 3/5, 7/8).
- **Weak points:**
  - "Up to 16" places in one spot, "15" in another.
  - No guidance on repeating decimals.
  - Doesn't explain why the power-of-10 method only works for denominators of 2ᵃ5ᵇ.
  - No chart, FAQ or date.

---

## 5. Patterns

**Maths**
- **Fraction → decimal:** long division. Detect the repeating cycle by tracking remainders. Show it with an overline (Unicode combining overline U+0305) or in parentheses, and also round to N places.
- **Terminates** when the reduced denominator has only the prime factors 2 and 5.
- **Mixed number:** w a/b = (wb + a)/b. Also convert improper ↔ mixed.
- **Decimal → fraction:**
  - Exact: multiply by 10ⁿ and reduce by the GCD.
  - Repeating: algebraic method.
  - **Nearest 1/2ⁿ for inches:** round(d × 2ⁿ)/2ⁿ, reduced. Show the error in inches and mm.
- **mm** = inches × 25.4 (exact). **Round half-up**, not truncate. Show the decimal places used.

**Chart (generated by our code)**
- All /2, /4, /8, /16, /32, /64 fractions from 0 to 1.
- Columns: fraction, decimal (6 places), mm (3 places, rounded), and equivalent forms.
- Optional extension to 2 or 3 inches. Printable as Letter or A4.

**Compare mode:** `19/32 vs 5/8` gives the larger value, the difference as a decimal and in mm, and the difference in 64ths.

**What competitors cover**

| Section | Pages (of 4) |
|---|:---:|
| Calculator | 2 |
| Repeating bar | **0** |
| Nearest 1/64 with error | 1 (no error shown) |
| Chart 1/64 | 3 |
| mm rounded correctly | 2 |
| Printable | 1 |
| Compare | **0** |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword. Map to the 110-keyword cluster.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is 3/8 (5/16, 1/8, 3/4…) as a decimal? | long tail (805k) |
| 2 | ★ How do you convert a fraction to a decimal? | Omni, Inch · `how to calculate fraction to decimal` |
| 3 | ★ Is there a printable fraction-to-decimal chart? | Metal SM, Eng. ToolBox · `fraction chart`, `fraction decimal chart` |
| 4 | ★ How do I convert inches to decimal (and mm)? | Inch, Metal SM · `inches to decimal` |
| 5 | How do I convert a decimal back to a fraction? | Omni, Inch · `decimal to fraction table` |
| 6 | What is 3 3/8 or 1 1/8 as a decimal? | mixed long tail |
| 7 | What is 13/5 as a mixed number? | `13/5 as a mixed number` |
| 8 | Why do some fractions repeat (1/3, 2/7)? | — (gap) |
| 9 | Which is bigger, 19/32 or 5/8? | `19/32 vs 5/8` |
| 10 | What is 15 as a fraction? | `whats 15 as a fraction` (15/1; decimals as fractions) |

---

## 7. Gaps nobody fills — our opportunities

1. **Repeating decimals shown correctly** (with a bar) plus a chosen rounding.
2. **Mixed numbers in and out**, plus an improper ↔ mixed conversion.
3. **Decimal → fraction:** simplest exact form, plus the **nearest 1/16, 1/32 or 1/64 with the error** for shop use.
4. **The most accurate printable chart:** decimal, correctly rounded mm, and equivalent forms, extendable past 1 inch.
5. **Compare mode** for inch fractions.
6. **The method explained**, including why some decimals terminate.
7. **One page, with no per-fraction URLs** (keyword-file rule). Optional hash anchors.
8. **Links:** Fraction & Score to % (Batch 5 #7), Ratio (Batch 5 #1), Metric Conversion (Batch 5 #20), Batch 4 thread and CNC tools.

---

## 8. Blueprint for the KKCTools Fraction to Decimal Converter

### 8.1 SEO

- **URL:** `/fraction-to-decimal/`
- **Title:** Fraction to Decimal Converter – Chart & Inches
- **H1:** Fraction to Decimal: Convert Any Fraction, With a Decimal Chart
- **Meta:** as in the keyword file (151 characters).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Fraction → decimal | a/b, mixed, improper, negative; repeating bar; round N places |
| Decimal → fraction | Simplest form; nearest 1/16, 1/32, 1/64 + error (in, mm) |
| Inch mode | Output in, mm, cm, ft |
| Compare | Two fractions → bigger, difference |
| Chart | /2…/64 to 1" (+ extend), decimal 6dp, mm 3dp rounded, equivalents; printable |
| UX | Copy, share URL, hash anchors, no network |

### 8.3 Content outline (≈ 1,100–1,400 words, original)

1. Intro and quick-answer examples
2. How to use
3. How to convert a fraction to a decimal, with an example
4. Repeating decimals explained
5. Mixed numbers and improper fractions
6. Decimal to fraction, and the nearest 1/64 inch
7. Inch fractions to decimal and mm (machining, woodworking)
8. Fraction to decimal chart (printable)
9. FAQ (10)
10. Related tools: Fraction & Score to % (Batch 5 #7), Metric Conversion (Batch 5 #20), Thread Pitch (Batch 4 #8)

### 8.4 Quality checks

- **Unit tests:**
  - repeating cycle detection (1/7, 1/97)
  - terminating detection
  - mixed numbers
  - nearest-1/64 rounding and error
  - mm rounding: 1/64 = 0.397, 5/16 = 7.938
  - chart generation
  - compare mode
- No competitor wording copied. `npm run check:no-network` passes.
- **`TODO(owner)`:** pull Google top 10; decide how far the chart extends (1, 2 or 3 inches).
