# Roman Numeral Converter (Numbers, Dates, Copy & Paste) — Competitor Analysis

> **Target page:** KKCTools `/roman-numeral-converter/` (Batch 8, Tool #6 ✅)
> **Primary keyword:** `roman numeral conversion`, US 2,900 · KD 6 · rising.
> **Cluster:** 28 keywords, 158,660 US vol, including:
> - `roman numeral date converter` 2,900 (KD 0)
> - `roman numerals copy and paste`
> - `roman letter generator`
> - 22 "roman numeral 4 / what is IV / year" phrases (143k)
>
> **SERP source:** ⚠ No Semrush SERP export for Batch 8. Competitors come from a live web search on 2026-11-14 for `roman numeral converter date converter`, plus known leaders. `TODO(owner): pull Google top 10 for "roman numeral conversion" and "roman numeral 4".`
>
> **Pages visited (2026-11-14):** 5 read: Calculator.net, CalculatorSoup date converter, RapidTables, Onecklace (jewellery), RomanNumerals.org.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Calc giants: Calculator.net, CalculatorSoup, RapidTables, calculator.io
  - Text and SEO tool sites: ConvertCase, Duplichecker, CodersTool
  - Education sites: Vedantu
  - **Jewellery and tattoo brands**: Onecklace
  - Antiques sites: worldclassantiques
  - Reference sites: romannumerals.org
  - Clones
- **Keyword-file must-haves:**
  - number ↔ Roman for 1–3,999, with optional vinculum above that
  - a **date mode** in several layouts
  - **validation with an explanation** (why IIII or IC is wrong)
  - copy as letters **or as Unicode numerals** (Ⅻ)
  - charts for 1–100 and for years 1900–2100
  - Pure logic with zero YMYL risk, so this is a strong first pick.
- **What every competitor gets wrong:**
  - None explains *why* a numeral is invalid.
  - None offers copying Unicode Roman numeral characters (U+2160–U+2188).
  - Onecklace calls its chart "complete 1–100" but skips 76–79, 81–84, and so on.
  - RapidTables lists 5,000–1,000,000 as plain V–M without an overline, which is wrong.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | calculator.net/roman-numeral-converter.html | Calc giant | Roman Numeral Converter | 1,000–1,200 |
| 2 | calculatorsoup.com/…/roman-numeral-date-converter.php | Calc giant | Roman Numeral Date Converter | ~200 |
| 3 | rapidtables.com/convert/number/roman-numerals-converter.html | Calc / reference | Roman Numerals Converter | 100–150 + table |
| 4 | onecklace.com/tips/roman-numeral-converter/ | Jewellery brand | Roman Numeral Date Converter | 1,300–1,500 |
| 5 | romannumerals.org/converter | Reference site | Roman Numerals Converter | ~120 + tables |

**What this tells us:**
- **Calculator.net is the strongest converter:**
  - converts both ways, up to 3,999, and up to **3,999,999 with vinculum** (typed as `_V`)
  - date input with several separators, plus batch input
  - an apostrophus chart and rules for invalid forms
  - Missing: a description of what happens with invalid input, any copy or Unicode option, and an FAQ.
- **CalculatorSoup's date converter** offers 3 formats (US, EU, ISO), 7 separators, and reverse conversion. It has a 3,999 cap and only about 200 words.
- **Onecklace** (a jewellery brand) offers date plus number modes, 2 formats, 4 separators, and 8 FAQs. Problems:
  - The "complete" 1–100 chart has gaps.
  - The day selector allows Feb 30.
  - It claims to convert "any number".
  - It pushes heavy discount promotions.
- **RapidTables** has a table with a calculation column, but its large values are wrong (no vinculum) and its coverage is uneven.
- **RomanNumerals.org** has tables for 1–2,550, all correct. It doesn't state its range, doesn't support vinculum, and doesn't explain invalid input.
- **No page combines all of these:**
  - converting both ways, with **validation that explains each error**
  - vinculum and apostrophus (optional)
  - a **date mode** with US, EU and ISO layouts, separators, and real-date checks
  - **Unicode output** (Ⅻ), as well as ASCII letters
  - a full 1–100 chart, a year chart for 1900–2100, and a "roman numeral 1 to 10" quick list
  - step-by-step breakdowns, e.g. 1994 = M + CM + XC + IV

---

## 2. Feature matrix: calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Calculator.net | CalcSoup date | RapidTables | Onecklace | RomanNumerals.org |
|---|---|---|---|---|---|
| Number → Roman | ✅ | ✅ (date parts) | ✅ | ✅ | ✅ |
| Roman → number | ✅ | ✅ | ✅ | ✅ | ✅ |
| Range 1–3,999 stated | ✅ | ✅ (year ≤ 3999) | ❌ | ⚠️ (FAQ) | ❌ |
| Vinculum (> 3,999) | ✅ (`_V`, up to 3,999,999) | ❌ | ❌ (**wrong letters**) | ❌ | ❌ |
| Apostrophus | ✅ (chart) | ❌ | ❌ | ❌ | ❌ |
| Date mode | ✅ (multi-separator) | ✅ (US/EU/ISO, 7 separators) | ❌ | ✅ (2 formats, 4 separators) | ❌ |
| Real-date validation (no Feb 30) | ? | ? | n/a | ❌ | n/a |
| **Invalid numeral explained** | ⚠️ (rules, but no output described) | ❌ | ❌ | ❌ | ❌ ("Invalid" only) |
| Step-by-step breakdown | ✅ (method) | ❌ | ✅ (calc column) | ⚠️ (rule examples) | ⚠️ (5 examples) |
| **Unicode numerals (Ⅻ) output** | ❌ | ❌ | ❌ | ❌ | ❌ |
| Copy button | ❌ | ? | ❌ | ? | ❌ |
| Chart 1–100 | ✅ | ⚠️ (symbols only) | ✅ | ❌ (**gaps**) | ✅ (1–2,550) |
| Year chart (1900–2100) | ❌ | ❌ | ❌ | ⚠️ (1990–2030) | ✅ (to 2550) |
| Batch conversion | ✅ | ❌ | ❌ | ❌ | ❌ |
| Lowercase option (iv) | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 3. Feature matrix: content and trust

| Item | Calculator.net | CalcSoup | RapidTables | Onecklace | RN.org |
|---|---|---|---|---|---|
| Rules explained (subtractive pairs, repeats) | ✅ | ❌ | ❌ | ✅ | ⚠️ |
| History / where used (clocks, films, Super Bowl, monarchs) | ⚠️ | ❌ | ❌ | ✅ (clocks) | ❌ |
| Tattoo / jewellery date tips | ❌ | ⚠️ | ❌ | ✅ (sales-driven) | ❌ |
| Errors | markdown artefacts | duplicate related block | **large values wrong** | **"complete chart" with gaps; "any number"** | — |
| FAQ count | 0 | 0 | 0 | 8 | 0 |
| Named author | ❌ | ✅ | ❌ | ❌ | ❌ |
| Date | ❌ | ✅ Aug 2025 | ❌ | ✅ Mar 2026 | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. Calculator.net: Roman Numeral Converter
- **Converter:** both ways. Separators `- . \ / |` and space. Batch input.
- **Vinculum:** an `_` prefix, up to 3,999,999. Apostrophus chart included (CCIↃↃ = 10,000 ✔).
- **Rules:** explains which forms are invalid (VX, IIII, subtraction limits).
- **Examples:** 768, 3,278 and 414 are all ✔. Day-of-week table.
- **Missing:**
  - It doesn't say what the tool returns for invalid input.
  - No copy or Unicode option.
  - Markdown artefacts on the page.
  - No FAQ, author or date.

### 2. CalculatorSoup: Roman Numeral Date Converter (Aug 2025)
- **Converter:** US, EU and ISO formats; 7 delimiters or none; converts back to digits; month names accepted; year ≤ 3999.
- **Missing:**
  - No handling of invalid dates described.
  - About 200 words.
  - The related block appears twice.

### 3. RapidTables: Roman Numerals Converter
- **Converter and table:** both directions, plus a table from 0 to 1,000,000 with a calculation column.
- **Errors:**
  - 5,000–1,000,000 are shown as plain V/X/L/C/D/M. Without an overline these mean 5–1,000.
  - Large values have no calculation entries.
  - Coverage is uneven: 101–199 is missing.
  - Awkward "−10+50" notation.

### 4. Onecklace: Roman Numeral Date Converter (jewellery)
- **Tools:** a date tool (MM.DD.YYYY or DD.MM.YYYY, 4 separators) and a number tool. Examples check out ✔ (1776, 2020).
- **FAQs (8):** range, zero, clock numerals (IIII), years, jewellery formatting, Roman vs Arabic.
- **Errors:**
  - The "complete 1–100" chart has gaps.
  - Claims to convert "any number".
  - The day selector allows impossible dates.
  - Outdated country names; Black Friday banners in March.

### 5. RomanNumerals.org: Converter
- **Converter and tables:** both directions; tables for 1–2,550, all ✔; 5 examples ✔.
- **Missing:**
  - No stated range or validation rules.
  - Users report "Invalid" for MDCCCCVI and VC, with no reason given.
  - No vinculum.
  - About 120 words.

---

## 5. Patterns

**Conversion (our code)**
- Greedy algorithm with the 13 standard tokens: M, CM, D, CD, C, XC, L, XL, X, IX, V, IV, I.
- Range 1–3,999.
- Optional vinculum (overline via U+0305 combining character, or a `_` input prefix) up to 3,999,999.
- Optional apostrophus display.

**Validation with an explanation** (canonical form = round-trip match)
- Parse leniently. Then compare the input with the canonical encoding of its value.
- If they differ, explain why:
  - IIII → IV: no more than three repeats.
  - IC → XCIX: I can only come before V or X.
  - VX → V: V, L and D are never subtracted.
  - IIX → VIII: only one smaller numeral can come before a larger one.
- Always show the canonical form.
- Note that **IIII appears on clock faces by convention**. It is accepted with a note.

**Date mode**
- Layouts: MM.DD.YYYY, DD.MM.YYYY and YYYY.MM.DD.
- Separators: `. • - / space _ none`.
- Real-date validation, including leap years.
- Show each part converted separately.

**Output**
- ASCII uppercase or lowercase.
- **Unicode Roman numeral characters** (Ⅰ–Ⅻ are single code points U+2160–216B; larger numbers are built from Ⅽ Ⅾ Ⅿ).
- Copy button for each format.
- `TODO(owner)`: confirm Unicode composition rules for numbers above 12 (there is no single code point; we join U+2160-range letters).

**Charts**
- 1–100, complete.
- Years 1900–2100.
- Quick list 1–10.
- All generated by our code.

**Breakdown**
- 1994 = M (1000) + CM (900) + XC (90) + IV (4).

**What the competitors cover (of 5)**

| Section | Pages (of 5) |
|---|:---:|
| Both directions | 5 |
| Vinculum | 1 |
| Date mode | 3 |
| Invalid explained | **0** |
| Unicode output | **0** |
| Complete 1–100 | 3 |
| Years 1900–2100 | 1 |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword. These map to the 28-keyword cluster.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is 4 in Roman numerals (IV)? | long tail · `roman numeral 4`, `4 roman numeral` |
| 2 | ★ How do I write a date in Roman numerals (tattoos, weddings)? | CalcSoup, Onecklace · `roman numeral date converter` |
| 3 | ★ What is the largest Roman numeral? | Calc.net, Onecklace |
| 4 | ★ Is there a Roman numeral for zero? | Onecklace |
| 5 | Why do clocks use IIII instead of IV? | Onecklace |
| 6 | How do I copy and paste Roman numerals (Ⅻ)? | `roman numerals copy and paste`, `roman letter generator` |
| 7 | What is VI, XIV or other numerals? | `vi roman numerals` (reverse) |
| 8 | Roman numerals 1 to 10 | `roman digit 1 to 10` |
| 9 | How do I write years like 1995 or 2026? | year queries |
| 10 | Why is IC wrong for 99? | — (our validation) |

---

## 7. Gaps nobody fills: our opportunities

1. **Validation that explains the error**, showing the canonical form and the rule that was broken.
2. **Unicode Roman numeral output** with copy, alongside ASCII upper and lower case. This targets the copy-and-paste and "roman letter generator" searches.
3. **A date mode that rejects impossible dates**, with 3 layouts and 8 separators.
4. **Vinculum support**, with the overline shown correctly. Fixes RapidTables' error.
5. **Complete charts:** 1–100, years 1900–2100, and 1–10, all printable.
6. **Step-by-step breakdown** for any number.
7. **A use-case guide:** clocks, film credits, monarchs and popes, outlines, tattoos. Written by us.
8. **Links:** Numbers to Words (Batch 6 #4), Fraction to Decimal (#7).

---

## 8. Blueprint for the KKCTools Roman Numeral Converter

### 8.1 SEO

- **URL:** `/roman-numeral-converter/`
- **Title:** Roman Numeral Converter – Numbers & Dates
- **H1:** Roman Numeral Converter: Numbers and Dates to Roman Numerals and Back
- **Meta:** as in the keyword file (149 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Number ↔ Roman | 1–3,999; vinculum to 3,999,999 (optional) |
| Validation | Canonical round-trip; explain rule broken; clock IIII note |
| Date | US / EU / ISO layouts, 8 separators, real-date check |
| Output | ASCII upper/lower, Unicode (Ⅻ), copy each |
| Breakdown | Token-by-token sum |
| Charts | 1–100, 1–10, years 1900–2100 (printable) |
| UX | Share URL, no network |

### 8.3 Content outline (≈ 1,000–1,300 words, original)

1. Intro (primary keyword)
2. How to use
3. Roman numeral symbols and rules
4. How to convert a number, with a step-by-step example
5. Common mistakes (IIII, IC, VX), with explanations
6. Dates in Roman numerals (tattoos, weddings), with layouts
7. Large numbers (vinculum)
8. Copy and paste Roman numerals (Unicode)
9. Charts: 1–100 and years
10. FAQ (10)
11. Related tools: Numbers to Words (Batch 6 #4), Fraction to Decimal (#7)

### 8.4 Quality checks

- **Unit tests:**
  - every value from 1 to 3,999 round-trips
  - each invalid pattern gets the right explanation
  - vinculum values
  - date validation, including leap years
  - Unicode output
  - lower case
- No competitor wording copied. `npm run check:no-network` passes.
- **`TODO(owner)`:** pull Google top 10; confirm the Unicode composition approach.
