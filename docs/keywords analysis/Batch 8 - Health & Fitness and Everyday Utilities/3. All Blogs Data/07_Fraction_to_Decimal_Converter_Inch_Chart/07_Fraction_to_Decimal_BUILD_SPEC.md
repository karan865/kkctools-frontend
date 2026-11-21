# Fraction to Decimal Converter (with Inch Chart) — Build Spec

> **URL:** `/fraction-to-decimal/` · Batch 8 · Tier 1 · **Build order 7**
> **Read first:** `../00_BATCH8_BUILD_RULES.md` (Part 2 §10 rule 1 exact arithmetic, §12 `fraction-engine`)
> **Inputs:** `07_Fraction_to_Decimal_Converter_Inch_Chart_Competitor_Analysis.md`, keyword file §2 #7
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**110 keywords, ≈ 884,300 searches:**
- primary `fraction to decimal chart` **8,100 / KD 15** ($1.30 CPC, ad competition 1.00: industrial buyers print these charts);
- chart terms KD 9–13: `decimal to fraction table` 2,400, `fraction decimal chart` 2,400, `fractional decimal chart` 1,000, `decimal equivalents chart` 590 ($3.38);
- `inches to decimal` 3,600 / KD 11 ($3.10, machinists and woodworkers);
- heads: `fraction to decimal` 22,200 / KD 21, `fraction chart` 9,900 / KD 24, `how to calculate fraction to decimal` 12,100 / KD 27;
- mixed numbers: `13/5 as a mixed number` 1,000, `whats 15 as a fraction` 880;
- **≈ 95 "X/Y as a decimal" phrases ≈ 805,000:** `3/8 as a decimal` 22,200, `1 1/8 as decimal` 18,100, `3 3/8 as decimal` (and 4 spelling variants, 18,100 each), `5 and 5/8 as a decimal` 18,100, `8 5/8 in decimal form` 18,100, `4 3/4 as decimal` 14,800, `4/3 as decimal` 14,800, `8/3 in decimal form` 14,800…;
- inch rows: `15/32 into inches`, `19/32 vs 5/8`.

**Never one page per fraction.** The converter + one engine-generated chart answers all of them. **Google answers "3/8 as a decimal" itself,** so the reasons to click are the chart, the inch/mm mode, mixed numbers, repeating decimals and nearest-fraction rounding.

`mixed fraction calculator` (9,900) is fraction arithmetic, a different tool: support only.

### Research notes from the competitor analysis

- **Pages read:** Metal Supermarkets table, Inch Calculator inch-fraction calculator, Engineering ToolBox chart, Omni. CalculatorSoup 404.
- **Metal Supermarkets:** the industrial-standard 1/64 → 1 table, decimals ✔, but the **mm column is truncated**: 1/64 shows 0.396 (should be **0.397**), 1/16 shows 1.587 (**1.588**), 5/16 shows 7.937 (**7.938**). Our node check also shows plain JavaScript `toFixed` makes the same 1/16 mistake, hence rules §10.1.
- **Inch Calculator:** fraction ↔ decimal → in/ft/mm/cm/m, precision 1/16–1/64, 2.695 → 2 11/16 ✔, but the 1/64 chart is **duplicated** and one row is missing its unit; calls US units "imperial".
- **Engineering ToolBox:** a good equivalents chart (64ths, 32nds, 16ths…) but **no calculator despite its "Calculator" title**; stops at 1 inch; 2018.
- **Omni:** simple + mixed, 0–16 places, but "16" vs "15" places in two spots, **no repeating-decimal notation**, no chart, no inch mode.
- **0 of 4** show repeating decimals with a bar or offer a fraction compare.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | fraction to decimal chart | 8,100 | 15 | title ("Chart"), H2 "Fraction to decimal chart (printable)", chart caption |
| Secondary | fraction decimal chart · fractional decimal chart · decimal equivalents chart · decimal to fraction table | 2,400 · 1,000 · 590 · 2,400 | 9–13 | chart heading variants, "Decimal → fraction" tab, print title |
| Secondary | inches to decimal | 3,600 | 11 | Inch tab + H2 "Inch fractions to decimal and mm" |
| Secondary (head) | fraction to decimal · fraction chart | 22,200 · 9,900 | 21–24 | title, H1, ToolShell heading |
| Support | how to calculate fraction to decimal | 12,100 | 27 | H2 "How to convert a fraction to a decimal" |
| Secondary | 13/5 as a mixed number · whats 15 as a fraction | 1,000 · 880 | 14 | Mixed tab + FAQ |
| Long tail (chart + converter) | 3/8 as a decimal · 1 1/8 as decimal · 3 3/8 as decimal · 5 and 5/8 as a decimal · 8 5/8 in decimal form · 4 3/4 as decimal · 4/3 as decimal · 8/3 in decimal form … (95) | ≈ 805,000 | 7–29 | quick-answer line under the H1 (3/8, 5/8, 1/8, 3/4), chart rows with hash anchors (`#3-8`), mixed-number support, "Common mixed numbers" mini-table |
| Long tail | 15/32 into inches · 19/32 vs 5/8 | — | 11–14 | Compare tab + FAQ |
| Support only | mixed fraction calculator | 9,900 | 27 | one line linking Batch 5 fraction tools |

## 2. Our edge

- **Fraction, mixed number or improper fraction → decimal,** with **repeating decimals shown with a bar** (2/7 = 0.2̅8̅5̅7̅1̅4̅) and a rounded value.
- **Decimal → fraction:** simplest exact form, and the **nearest 1/2 … 1/64** for shop work **with the error** in inches and mm.
- **Inch mode:** in, mm (exact × 25.4, rounded half-up), cm, ft.
- **Compare two fractions** (`19/32 vs 5/8`): larger, difference in inches, 64ths and mm.
- **Improper ↔ mixed** (13/5 = 2 3/5).
- **The most accurate printable chart:** every /2…/64 from 0 to 1 inch (optionally to 2 or 3 in), decimal to 6 places, **mm to 3 places correctly rounded**, plus an equivalents column; Letter/A4 print.
- **Method explained**, including why some fractions terminate (denominator only has 2s and 5s).

## 3. Calculator spec

### 3.1 Tabs

1. **Fraction → decimal** (default)
2. **Decimal → fraction**
3. **Inches & mm**
4. **Compare**
5. **Chart**

### 3.2 Input guide diagram (above the inputs)

`FractionInputGuide.tsx`: a ruler segment from 0 to 1 inch with 1/64 ticks (16ths labelled).

- A marker at the input (e.g. 3/8) with "1 Numerator", "2 Denominator" labels on the fraction, "3 Whole number (optional)" for mixed numbers.
- Under the ruler: "0.375 in · 9.525 mm".
- **Decimal tab:** a marker at the decimal and the nearest tick, with "4 Round to 1/16 · 1/32 · 1/64" and the gap labelled as the error.
- **Compare tab:** two markers with the gap ("1/32 in").
- **Chart tab:** a mini chart row.
- Live values; the focused field highlights.

### 3.3 Inputs

| Field | Default |
|---|---|
| Fraction | `3/8` (accepts `3 3/8`, `3-3/8`, `27/8`, `⅜`, `-1/3`, `3 and 3/8`) |
| Decimal places | 6 (0–15) |
| Repeating notation | bar (bar · parentheses) |
| Decimal → fraction input | 0.695 |
| Nearest denominator | 16 (2, 4, 8, 16, 32, 64) |
| Inch output units | in, mm, cm, ft |
| Compare | 19/32 vs 5/8 |
| Chart range | 0–1 in (1 · 2 · 3 in) · step 1/64 |

### 3.4 Engine (`src/lib/fraction-engine.ts`, BigInt / rationals)

```ts
parseFraction(s) → {sign, whole, num, den} | error   // den ≠ 0 ; unicode vulgar fractions mapped ; "and" allowed
toImproper(w, n, d) = (w·d + n)/d ; reduce by gcd ; toMixed(n, d) = floor(n/d) r (n mod d)/d
toDecimal(n, d): long division tracking remainders → {int, nonRepeating, repetend} ; terminating iff reduced d = 2^a·5^b
round(n, d, dp): exact half-up on the rational (no float)
fromDecimal(str): exact: digits / 10^k reduced ; nearest(x, 2^k) = round(x·2^k)/2^k reduced, error = that − x
toMm(n, d, dp) = round(n·254 / (10·d), dp) half-up ; cm, ft likewise
compare(a, b) → {larger, diff (fraction), diff64ths, diffMm}
chart(maxInch, step 1/64) → rows {fraction (reduced), decimal6, mm3, equivalents [n/64, n/32…]}
```

**Worked examples (checked with node, 2026-11-22):**

| Input | Result |
|---|---|
| **3/8** | **0.375** · 9.525 mm |
| 1 1/8 · 3 3/8 · 5 5/8 · 8 5/8 · 4 3/4 | 1.125 · 3.375 · 5.625 · 8.625 · 4.75 |
| 4/3 · 8/3 | 1.3̅ (1.333333) · 2.6̅ (2.666667) |
| 1/3 · 2/7 · 1/7 | 0.3̅ · 0.2̅8̅5̅7̅1̅4̅ · 0.1̅4̅2̅8̅5̅7̅ |
| 13/5 | 2 3/5 = 2.6 |
| 27/8 | 3 3/8 = 3.375 |
| mm: **1/64 · 1/16 · 5/16** | **0.397 · 1.588 · 7.938** (exact 0.396875, 1.5875, 7.9375 rounded half-up; Metal Supermarkets truncates) |
| 0.695 to the nearest 1/16 | **11/16** (error −0.0075 in = −0.190 mm); 2.695 → 2 11/16 (Inch ✔) |
| 0.3 to the nearest 1/64 | 19/64 (error −0.0031 in) |
| 0.375 · 0.6 · 0.125 (exact) | 3/8 · 3/5 · 1/8 |
| 19/32 vs 5/8 | **5/8 is larger by 1/32 in = 2/64 = 0.794 mm** |
| 15/32 | 0.46875 in · 11.906 mm |
| 15 as a fraction | 15/1 |

### 3.5 Outputs

- **Headline:** "3/8 = 0.375" (big) + "9.525 mm".
- **Sentence:** "3/8 as a decimal is 0.375: divide 3 by 8. It ends because 8 is a power of 2."
- Repeating notation when relevant ("2/7 = 0.285714 repeating"); rounding shown.
- Decimal → fraction card: exact + nearest-1/16 with the error in in and mm.
- Compare card.
- **Chart** (static HTML, generated at build time from the engine: it doesn't depend on "today"), printable, hash anchors.
- Copy, Share URL (`?f=3/8`).
- Links: Fraction to Percent (Batch 5 #7), Metric Conversion (Batch 5 #20), Thread Pitch (Batch 4 #8), Cooking Converter (#8).

### 3.6 Tests

- Cycle detection (1/7, 1/97, 22/7); terminating detection (2ᵃ5ᵇ).
- Parser: every input form, negatives, zero denominator error, Unicode fractions.
- Mixed ↔ improper; reduction.
- Exact half-up rounding (the three mm cases above; 1/16 must be 1.588).
- Nearest 1/2…1/64 and errors; compare.
- Chart: 64 rows per inch, reduced fractions, equivalents.
- The worked examples. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Fraction to Decimal Converter – Chart & Inches` (46; 58 with the suffix: OK) |
| Meta | `Free fraction to decimal converter. Turn any fraction or mixed number into a decimal and back, with a printable chart of inch fractions from 1/64 to 1.` (151) |
| H1 | `Fraction to Decimal: Convert Any Fraction, With a Decimal Chart` |
| BLUF | "Divide the top number by the bottom number: 3/8 = 0.375, 5/8 = 0.625 and 3 3/8 = 3.375. Type any fraction or mixed number for its decimal (repeating decimals are marked), turn a decimal back into a fraction, or round inches to the nearest 1/16 or 1/64 with the mm value. The printable chart below lists every 64th of an inch." (engine) |
| ToolShell pills | `Fractions & mixed numbers`, `Repeating decimals marked`, `Nearest 1/64 inch + mm`, `Printable decimal chart` |
| Links out | Fraction to Percent (Batch 5 #7), Metric Conversion (Batch 5 #20), Thread Pitch (Batch 4 #8), Cooking Converter (#8) |
| Links in | #6, #8, Batch 4 #8, Tools hub "Everyday Conversions" |

## 5. Content (~1,200–1,500 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the fraction to decimal converter | 5 tabs | 110 |
| 2 | How to convert a fraction to a decimal | Long division with 3/8; the 10ⁿ shortcut and when it works | 160 |
| 3 | Repeating decimals | Why 1/3 and 2/7 repeat; the bar notation | 120 |
| 4 | Mixed numbers and improper fractions | 3 3/8, 27/8, 13/5 | 120 |
| 5 | Decimal to fraction | Exact method; nearest 1/16 / 1/64 with error (`decimal to fraction table`) | 140 |
| 6 | Inch fractions to decimal and mm | × 25.4 exact, rounding properly; machining and woodworking use (`inches to decimal`) | 140 |
| 7 | Comparing inch fractions | 19/32 vs 5/8 | 70 |
| 8 | Fraction to decimal chart (printable) | The chart | — |
| 9 | FAQ | §6 | 330 |

## 6. FAQ (10, from the competitor question bank + cluster keywords)

1. What is 3/8 (5/16, 1/8, 3/4) as a decimal?
2. How do you convert a fraction to a decimal?
3. Is there a printable fraction to decimal chart?
4. How do I convert inches to decimal and mm?
5. How do I convert a decimal back to a fraction?
6. What is 3 3/8 or 1 1/8 as a decimal?
7. What is 13/5 as a mixed number?
8. Why do some fractions repeat (1/3, 2/7)?
9. Which is bigger, 19/32 or 5/8?
10. What is 15 as a fraction?

## 7. Done when

- [ ] `fraction-engine.ts` (exact rationals) + tests; `npm run verify` passes.
- [ ] Chart generated by the engine (correct mm rounding); hash anchors; no per-fraction URLs.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Registrations + docs; `graphify update .`.
