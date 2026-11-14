# Numbers to Words Converter (Check Writing) — Competitor Analysis

> **Target page:** KKCTools `/numbers-to-words/` (Batch 6, Tool #4 ✅)
> **Primary keyword:** `numbers to words` — US 4,400 · KD 14. Cluster: 8 keywords, 22,080 US searches. It includes `amount in words` 4,400 (common in India), `amount words converter` 2,400 (KD 2) and `three hundred fifty` 1,600 (reverse search).
> **SERP source:** ⚠ No Semrush SERP export for Batch 6. Competitors come from live web searches run on 2026-11-14: `numbers to words converter amount in words check writing` and `amount in words converter rupees lakh crore`. `TODO(owner): pull Google top 10 (US) and the India SERP for "amount in words".`
> **Pages visited (2026-11-14):** 5 read: CalculatorSoup, Omni, MiniWebtool, Prep Edu (rules guide), TrumpExcel (Indian system).

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Calc giants: CalculatorSoup, Omni, MiniWebtool.
  - Language and education sites: Prep Edu.
  - Excel brands: TrumpExcel.
  - Dev and tool sites: CodeShack, codeitbro, designrevision.
  - Many pages.dev clones and a spam profile page.
  - For India: converteraz, aceonlinetools, toolstackhub.
- **Keyword-file angle:** a check-writing mode ("… and 45/100 dollars") plus a **lakh/crore mode**. Show any check example as an SVG, **never a real bank's design**.
- **Legal claims:** some pages say "words take legal precedence" or "banks must honor the written amount". Those statements are unsourced and differ from page to page. We avoid legal claims. `TODO(owner)`: if the page mentions this at all, cite UCC §3-114 (US), or omit it.
- **Checks done:** rules and examples were re-checked. Errors found:
  - MiniWebtool's check output contradicts its own tip.
  - Prep Edu says 15 vs 50 is "fivefold".
  - TrumpExcel mixes Indian and US grouping in one example.
- No competitor text was copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | calculatorsoup.com/calculators/conversions/numberstowords.php | Calc giant | Numbers to Words Converter | ~1,100 |
| 2 | omnicalculator.com/everyday-life/numbers-to-words | Giant | Numbers to Words Converter | ~650 |
| 3 | miniwebtool.com/number-to-word-converter/ | Utility site | Number to Word Converter | ~1,300 |
| 4 | prepedu.com/en/blog/numbers-to-words | English-learning site | Numbers to Words: Converter, Rules and Charts | 3,000–3,500 |
| 5 | trumpexcel.com/tools/number-to-words-converter/ | Excel brand | Number to Words Converter | ~440 |

**What this tells us:**
- **CalculatorSoup is the strongest check tool.**
  - Range up to 1e±300.
  - About 20 currencies, including Rupees/Paise.
  - Check mode with "Exactly" or "Only", and four letter cases.
  - Worked check example: 5,075.62 → "Five thousand seventy-five and 62/100 dollars".
  - **Weak spots:** no lakh/crore, no ordinals, no reverse mode, and negatives are undocumented.
- **Prep Edu has the best rules content:**
  - hyphens, "and" (US vs UK vs checks), ordinals, decimals
  - large-number names and style guides (AP, Chicago, MLA, APA)
  - charts and a practice set
  - **Weak spots:** a factual slip, and it relies on a converter that wasn't visible to us.
- **TrumpExcel covers international and Indian systems, plus bulk input (10,000 numbers) and CSV.**
  - No "Only" suffix, no paise, and the Indian range is vague.
- **No page has all of these:**
  - US and Indian systems
  - a check mode in the correct format (XX/100)
  - Indian cheque format ("Rupees … and … Paise Only")
  - ordinals
  - reverse words → number (`three hundred fifty`)
  - digit grouping shown (`rewrite the numbers with commas separating the periods`, 1,600)
  - case options
  - a safe SVG check preview

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | CalcSoup | Omni | MiniWebtool | Prep Edu | TrumpExcel |
|---|---|---|---|---|---|
| Number → words (US short scale) | ✅ (1e±300) | ✅ (≤ quadrillion) | ✅ (≤ 999T, negatives) | ✅ (claimed) | ✅ (≤ 999T) |
| Decimals | ⚠️ (check mode only) | ⚠️ | ✅ ("high precision", undefined) | ✅ (rules) | ✅ ("point one four") |
| Negatives | ❌ | ❌ | ✅ | ⚠️ ("minus") | ? |
| Check format "…and 62/100 dollars" | ✅ | ✅ | ❌ (**writes "seventy-five cents"**, contradicting its own tip) | ✅ | ❌ |
| Currency (USD, EUR, INR…) | ✅ (~20) | ❌ | ⚠️ (dollars only) | ⚠️ | ⚠️ (dollars example) |
| "Only" / "Exactly" suffix | ✅ | ❌ | ❌ | ⚠️ | ❌ |
| **Indian lakh/crore** | ❌ | ❌ | ❌ | ⚠️ ("arab" mentioned) | ✅ |
| Rupees + paise words | ⚠️ (currency, no lakh) | ❌ | ❌ | ❌ | ❌ |
| Ordinals (twenty-first) | ❌ | ❌ | ✅ | ✅ (rules) | ❌ |
| **Reverse: words → number** | ❌ | ❌ | ❌ | ⚠️ (section) | ❌ |
| Digit grouping shown (1,234,567 / 12,34,567) | ❌ | ❌ | ❌ | ✅ (place-value chart) | ⚠️ |
| Letter case options | ✅ (4) | ⚠️ (2) | ✅ (3) | ? | ? |
| British "and" option | ❌ | ❌ | ⚠️ (inconsistent) | ✅ (rules) | ❌ |
| Bulk / CSV | ❌ | ❌ | ❌ | ❌ | ✅ |
| Check preview (visual) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Copy | ✅ | ✅ | ✅ | ? | ✅ |

---

## 3. Feature matrix — content and trust

| Item | CalcSoup | Omni | MiniWebtool | Prep Edu | TrumpExcel |
|---|---|---|---|---|---|
| Rules (hyphens, "and") | ✅ | ⚠️ (implied) | ❌ (inconsistent) | ✅ | ❌ |
| Check-writing steps | ✅ (5 steps) | ✅ | ⚠️ | ✅ | ❌ |
| Large-number names table | ✅ (googol) | ❌ | ❌ | ✅ | ✅ (both systems) |
| Style-guide rules (when to write words) | ❌ | ⚠️ (inconsistent) | ❌ | ✅ (AP/Chicago/MLA/APA) | ❌ |
| Legal / fraud claims | ⚠️ (screen-reader claim unsourced) | ⚠️ (unsourced) | — | ⚠️ (banks named, no links) | — |
| Errors | "300 digits" vs "300 characters" | — | check format; "and" use; date | "fivefold" (it's 3.3×) | mixes 1,00,000 with US grouping |
| FAQ count | 6 | 2 | 5 | 0 | 2 |
| Named author | ✅ | ✅ PhD + reviewer | ❌ team | ✅ | ✅ (Excel MVP) |
| Date | ✅ Feb 2026 | ❌ | ✅ Jan 2026 | ✅ (ambiguous) | ✅ Oct 2026 |

---

## 4. Competitor-by-competitor detail

### 1. CalculatorSoup — Numbers to Words (Edward Furey, Feb 2026)
- **Modes:** words · currency (about 20) · check writing ("Exactly" or "Only").
- **Case options:** lower, UPPER, Title, Sentence. **Range:** 1e-300 to 1e300.
- **Examples:**
  - 5,075.62 → "Five thousand seventy-five and 62/100 dollars" ✔
  - googol → "ten duotrigintillion" ✔
- **FAQs (6):** fraud prevention, limits, scientific notation, case, accessibility, and more.
- **Weak points:**
  - No lakh/crore, ordinals, reverse mode or negatives.
  - The "300 digits" vs "300 characters" limit is stated inconsistently.

### 2. Omni — Numbers to Words (Anna Szczepanek PhD; reviewer Steven Wooding)
- **Modes:** words, check writing. **Case:** lower or UPPER. **Range:** up to quadrillions.
- **Examples:** 88 in 4 languages ✔; 88.52 → "eighty-eight dollars and 52/100" ✔.
- **FAQs (2):** when to write amounts in words · how to write an amount on a check.
- **Weak points:**
  - Capabilities are underspecified.
  - The "Formatting" section is unexplained.
  - The "words for one to ten" style advice conflicts with its FAQ.
  - Fraud and legal claims are unsourced.

### 3. MiniWebtool — Number to Word Converter (updated Jan 2026)
- **Modes:** cardinal, ordinal, currency. Handles negatives and decimals up to 999,999,999,999,999. Three case options.
- **Errors:**
  - The currency output for 1,250.75 says "…and seventy-five cents", while its own tip says checks use "75/100".
  - Inconsistent "and" ("three hundred and forty-five" vs "one hundred twenty-three").
  - Video date conflicts with the page date.
- **FAQs (5):** these repeat the About text.

### 4. Prep Edu — Numbers to Words: rules and charts (Chloe, ~Nov 2026)
- **Rules:**
  - hyphenate 21–99
  - "and" in US vs UK English vs on checks
  - ordinals
  - decimals ("point" vs "and")
  - million to nonillion
- **Charts:** 1–20, tens, hundreds, place value, style guides.
- **Examples:** 4,207,938; 4,000,938; check amounts; a practice set.
- **Error:** says 15 vs 50 "differ fivefold". The real ratio is 3.3×.
- **Weak points:**
  - Unsupported claims.
  - Banks are named without links.
  - "Fifty arab" is used without explanation.

### 5. TrumpExcel — Number to Words Converter (Sumit Bansal, Excel MVP)
- **Systems:** International and Indian (lakh/crore).
- **Modes:** plain ("three point one four") and currency (dollars example). Bulk up to 10,000 numbers; CSV or Excel download.
- **Error:** the International example shows "1,00,000 becomes 1,000,000", which mixes the two groupings.
- **Weak points:**
  - No "Only" suffix, no paise, no Hindi.
  - The Indian range is vague.
  - FAQ has only 2 questions.

---

## 5. Patterns

**Rules (our engine)**
- **US short scale:** thousand, million, billion, trillion … decillion, plus an optional long tail.
- **Hyphens:** compound numbers from 21 to 99.
- **"and":**
  - US default: no "and" inside numbers ("one hundred twenty-three").
  - UK option: "one hundred and twenty-three".
  - Checks: "and" goes before the cents fraction.

**Check (US)**
- Format: "One thousand two hundred thirty-four and 56/100 dollars".
- Cents are rounded half-up to 2 decimals.
- Optional "Exactly" or "Only", optional trailing dash fill.
- `TODO(owner)`: confirm the conventions against bank or consumer guidance (e.g. a CFPB or bank help page) and cite it. No legal-precedence claims unless cited.

**Indian system**
- Grouping: 3 digits, then 2,2,2 (12,34,56,789).
- Units: thousand, lakh (10⁵), crore (10⁷), plus optional arab (10⁹) and kharab (10¹¹), which we label as less common.
- Cheque format: "Rupees Twelve Lakh Thirty-Four Thousand Five Hundred Sixty-Seven and Fifty Paise Only".

**Other modes**
- **Ordinals:** first, second, third, fifth, eighth, ninth, twelfth (irregular); twenty-first; one hundredth.
- **Decimals:** "point" + digits, or as a fraction.
- **Negatives:** "minus" or "negative" (selectable).
- **Reverse:** parse words → number. Handle hyphens, "and", "a hundred", lakh/crore, and ordinals.
- **Digit grouping output:** "1,234,567" (US) and "12,34,567" (IN). This answers the homework keyword.
- **Case:** lower, UPPER, Title, Sentence.

**Coverage across the 5 competitors**

| Section | Pages (of 5) |
|---|:---:|
| US words | 5 |
| Check format correct | 3 |
| Lakh/crore | 1 |
| Rupees/paise + Only | **0** (complete) |
| Ordinals | 2 |
| Reverse | **0** (tool) |
| Grouping shown | 1 |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword. Maps to: numbers to words, amount in words, numbers in words, amount words converter, number to words converter, rewrite the numbers with commas separating the periods, number to words, three hundred fifty.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How do I write a check amount in words (cents as /100)? | CalcSoup, Omni, Prep Edu · `amount in words` |
| 2 | ★ When should numbers be written as words? | Omni, Prep Edu (style guides) |
| 3 | ★ Do you use "and" when writing numbers? | Prep Edu, MiniWebtool (inconsistent) |
| 4 | ★ How do I write numbers in lakh and crore? | TrumpExcel · India `amount in words` |
| 5 | How do I hyphenate numbers like forty-two? | Prep Edu, CalcSoup |
| 6 | How do I write ordinal numbers in words? | MiniWebtool, Prep Edu |
| 7 | How do I write decimals in words? | Prep Edu, TrumpExcel |
| 8 | How do I convert words back to a number? | `three hundred fifty` |
| 9 | How do commas separate the periods (place value)? | `rewrite the numbers with commas separating the periods` |
| 10 | What comes after trillion (quadrillion …)? | CalcSoup, Prep Edu |
| 11 | How do I write rupees and paise on a cheque? | India SERP |

---

## 7. Gaps nobody fills — our opportunities

1. **All modes in one tool:**
   - words (US / UK "and")
   - US check format
   - Indian cheque format (Rupees + Paise + Only)
   - ordinals, decimals, negatives
2. **Reverse mode:** words → number (lakh/crore aware). This covers spelled-number searches.
3. **Digit grouping output** for both systems, with place-value labels (homework keyword).
4. **SVG check/cheque preview.** A generic design with no bank branding, per the keyword-file rule.
5. **Case options and copy buttons.** Optional bulk list.
6. **Correct, consistent examples.** Competitors contradict themselves on "and" and on the check format.
7. **Rules content:** hyphens, "and", ordinals, large-number names (both systems), and style-guide summaries. We write this ourselves and cite where needed.
8. **No legal claims** unless cited.
9. **Links:** Roman Numeral (Batch 8), Fraction to Decimal (Batch 8), Reverse Sales Tax (Batch 5 #8), Invoice Generator (Batch 3 #16).

---

## 8. Blueprint for the KKCTools Numbers to Words Converter

### 8.1 SEO

- **URL:** `/numbers-to-words/`
- **Title:** Numbers to Words Converter – Amount in Words
- **H1:** Numbers to Words: Write Any Number or Amount in Words
- **Meta:** as in the keyword file (147 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Modes | Words · Check (US) · Cheque (INR) · Currency (USD/EUR/GBP/INR…) · Ordinal · Reverse (words → number) |
| Options | US/UK "and", Indian/International grouping, negatives wording, decimals as point/fraction, case (4), Only/Exactly |
| Range | BigInt up to 10³⁶ (named), beyond → scientific note |
| Outputs | Words, grouped digits (both systems), SVG check preview, copy |
| UX | Share URL, no network |

### 8.3 Content outline (≈ 1,300–1,600 words, original)

1. Intro (primary keyword)
2. How to use
3. Rules for writing numbers in words (hyphens, "and")
4. Writing a check amount in words, with an example and SVG
5. Writing rupees in lakh and crore (cheque format), with an example
6. Ordinal numbers in words
7. Decimals and negative numbers
8. Place value and commas (both systems)
9. Large number names
10. FAQ (10–12)
11. Related tools: Roman Numeral (Batch 8), Fraction to Decimal (Batch 8), Invoice Generator (Batch 3 #16)

### 8.4 Quality checks

- **Unit tests:**
  - 0, teens, hyphenation
  - the "and" variants
  - check cents rounding (x.995)
  - lakh/crore (12,34,567)
  - ordinals (irregulars)
  - reverse parser round-trip for 1 to 10⁹ (sampled)
  - negatives and decimals
- **Fixtures:** 5,075.62 → "Five thousand seventy-five and 62/100 dollars"; 1,250.75 check → "…and 75/100".
- No bank branding. No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)`:** pull the US and India SERPs; cite the check-writing convention; decide on arab/kharab and the Hindi output scope.
