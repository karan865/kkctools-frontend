# Numbers to Words Converter (Check Writing) — Build Spec

> **URL:** `/numbers-to-words/` · Batch 6 · Tier 1 · **Build order 7**
> **Read first:** `../00_BATCH6_BUILD_RULES.md` (§3 UCC § 3-114 source, §4 `number-words-engine`)
> **Inputs:** `04_Numbers_to_Words_Converter_Check_Writing_Competitor_Analysis.md`, keyword file §2 #4
> **SERP:** provisional (US and India SERPs differ; `TODO(owner)`: pull both)
> **Written:** 2026-11-22

---

## 0. Strategy

**About 22,000 searches at KD 0–14** (one row at 29):
- `numbers to words` 4,400 / KD 14 (primary);
- `amount in words` 4,400 / KD 13 (check writing and Indian cheques);
- `numbers in words` 2,400; `amount words converter` 2,400 / **KD 2**; `number to words converter` 880 / KD 0, rising;
- `rewrite the numbers with commas separating the periods` 1,600 (homework: digit grouping);
- `three hundred fifty` 1,600 (a spelled number: reverse mode).

**Pure logic, done in the browser, and low YMYL.** The angle is **every format people actually need in one tool**: US check, Indian cheque (Rupees … Paise Only), lakh/crore, ordinals, reverse, grouping. No competitor has more than half of these.

### Research notes from the competitor analysis

- **Pages read:** CalculatorSoup (Feb 2026), Omni, MiniWebtool (Jan 2026), Prep Edu (rules guide), TrumpExcel (Indian + bulk).
- **CalculatorSoup** is the strongest check tool (1e±300, ~20 currencies incl. Rupees/Paise, Exactly/Only, 4 cases). Its example **5,075.62 → "Five thousand seventy-five and 62/100 dollars"** is correct and is our fixture. No lakh/crore, ordinals, reverse or negatives; "300 digits" vs "300 characters" stated inconsistently.
- **Omni:** 88.52 → "eighty-eight dollars and 52/100" ✔; up to quadrillions only; unsourced fraud/legal claims.
- **MiniWebtool errors:** its currency output for 1,250.75 says "…and seventy-five cents" while its own tip says checks use "75/100"; "three hundred **and** forty-five" vs "one hundred twenty-three" on the same page.
- **Prep Edu:** best rules content (hyphens, "and" US/UK/checks, ordinals, decimals, style guides) but says 15 vs 50 "differ fivefold" (it is 3.3×) and uses "fifty arab" unexplained.
- **TrumpExcel:** International + Indian + bulk (10,000) + CSV, but its example "1,00,000 becomes 1,000,000" mixes the two groupings; no "Only", no paise.
- **Legal claims** ("words take precedence", "banks must honor…") are unsourced on every page. **We cite the one verified text** (UCC § 3-114, §3) and give no further legal advice.
- **0 of 5** have a complete Rupees/Paise/Only cheque format or a reverse (words → number) tool.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | numbers to words | 4,400 | 14 | title, H1, first sentence |
| Secondary | amount in words | 4,400 | 13 | title ("Amount in Words"), Check and Cheque tabs, H2 "How to write an amount in words on a check" |
| Secondary | numbers in words · number to words | 2,400 · 4,400 | 13–29 | intro, H2 "Rules for writing numbers in words" |
| Secondary | amount words converter · number to words converter | 2,400 · 880 | 0–2 | ToolShell heading, meta, FAQ |
| Secondary | rewrite the numbers with commas separating the periods | 1,600 | 22 | grouping output ("periods" explained) + H2 "Commas and periods (place value)" |
| Secondary | three hundred fifty | 1,600 | 25 | **Reverse tab** (words → number) + H2 "Words back to numbers" |
| Natural (India) | amount in words in rupees · lakh crore converter | — | — | Cheque tab, H2 "Rupees in words: lakh and crore" (`TODO(owner)`: pull India volumes) |

## 2. Our edge

- **All formats in one tool:** plain words (US; UK "and" option), US check, Indian cheque, currency words (USD, EUR, GBP, INR, …), ordinals, decimals, negatives.
- **Indian system done fully:** 12,34,567 grouping; thousand, lakh, crore (arab/kharab optional, labelled less common); "Rupees … and … Paise Only".
- **Reverse:** words → number, lakh/crore aware, ordinals, "a hundred", hyphens, "and".
- **Digit grouping shown both ways** (1,234,567 and 12,34,567) with place-value names: the homework keyword.
- **Generic SVG check / cheque preview** with a "SAMPLE" watermark, no bank name or design, no MICR line.
- **Exact decimals:** string/BigInt maths, never floating point (so 1234.567 rounds to 57/100 correctly, and 10.995 → 11.00).
- **Case options** (lower, UPPER, Title, Sentence), copy buttons, optional bulk list (one per line).
- **Correct, consistent examples** (competitors contradict themselves on "and" and the check format).

## 3. Calculator spec

### 3.1 Tabs

1. **Words** (default)
2. **Check (US)**
3. **Cheque (India)**
4. **Ordinal**
5. **Words → number**

### 3.2 Input guide diagram (above the inputs)

`NumberWordsInputGuide.tsx`: the number split into labelled periods.

- **Words tab:** `1,234,567` drawn as three boxes "1 | 234 | 567" labelled "millions · thousands · ones (periods)", each with its words under it ("one million", "two hundred thirty-four thousand", "five hundred sixty-seven").
- **Indian toggle:** the same digits as "12 | 34 | 567" labelled "lakh · thousand · ones".
- **Check tab:** a mini check with numbered callouts: "1 Amount box ($5,075.62)", "2 Amount in words line", "3 Cents as /100", "4 Line filled to the end".
- **Cheque tab:** "Rupees … Only" line and the ₹ box.
- **Reverse tab:** words → arrow → digits.

Live values; the focused field highlights.

### 3.3 Inputs

| Field | Default |
|---|---|
| Number | 1234567 (accepts `1,234,567`, `12,34,567`, `1 234 567`, `-42`, `3.14`; rejects letters with a clear message) |
| Grouping | International (US) · Indian |
| "and" style | US (none) · UK ("one hundred and twenty-three") |
| Decimals | "point" digits (default) · as a fraction ("and fourteen hundredths") |
| Negatives | minus · negative |
| Case | Sentence (default) · lower · UPPER · Title |
| Check: currency | dollars (default) |
| Check: suffix/prefix | none · "Only" · "Exactly" |
| Cheque: Indian extras | arab/kharab off |
| Range | integers up to 10³⁶ − 1 (named to decillion); larger → "too large to name; scientific notation" note |

### 3.4 Engine (`src/lib/number-words-engine.ts`, BigInt + strings)

```ts
parseInput(s) → {sign, intPart: bigint, fracDigits: string} | null
toWords(n, {style:'us'|'uk'}) : 3-digit groups + scale names (thousand … decillion); hyphens 21–99
toIndianWords(n) : crore = n / 10^7 (recursive if ≥ 1000 → "one thousand crore"), lakh, thousand, rest
cents(fracDigits) : round half-up on the 3rd digit, carry into the integer (10.995 → 11, 00)
toCheck(s)  = Sentence(words(int)) + " and " + cc + "/100 dollars" [+ " only"]
toCheque(s) = "Rupees " + Title(indianWords(int)) + (paise ? " and " + Title(words(paise)) + " Paise" : "") + " Only"
toOrdinal(n): last word → first, second, third, fifth, eighth, ninth, twelfth; -y → -ieth; else + th
groupDigits(s, 'intl'|'indian')
parseWords(s) : tokens (hyphens split, "and" ignored, "a" = 1), scales incl. lakh/crore, ordinals → cardinal ; null if unknown word
```

**Worked examples (checked with node, 2026-11-22):**

| Input | Output |
|---|---|
| **5,075.62 (check)** | **Five thousand seventy-five and 62/100 dollars** (CalculatorSoup ✔) |
| 1,250.75 (check) | One thousand two hundred fifty and 75/100 dollars (not "seventy-five cents", the MiniWebtool error) |
| 88.52 (check) | Eighty-eight and 52/100 dollars |
| 0.05 (check) | Zero and 05/100 dollars |
| 10.995 (check) | Eleven and 00/100 dollars (rounding carries) |
| 1,234.567 (check) | One thousand two hundred thirty-four and 57/100 dollars |
| 123 US / UK | one hundred twenty-three / one hundred and twenty-three |
| 1,000,001 | one million one |
| 4,207,938 | four million two hundred seven thousand nine hundred thirty-eight |
| **12,34,567.50 (cheque)** | **Rupees Twelve Lakh Thirty-Four Thousand Five Hundred Sixty-Seven and Fifty Paise Only** |
| 25,000 (cheque) | Rupees Twenty-Five Thousand Only |
| 99.99 (cheque) | Rupees Ninety-Nine and Ninety-Nine Paise Only |
| 1,00,00,000 (cheque) | Rupees One Crore Only |
| 10,00,00,000 | ten crore (Indian) · one hundred million (US) |
| 1,000,00,00,000 | one thousand crore |
| Grouping 1234567 / 123456789 | 1,234,567 · 12,34,567 / 123,456,789 · 12,34,56,789 |
| 10³³ | one decillion |
| Ordinals 1, 2, 3, 5, 8, 9, 12, 20, 21, 40, 100, 112 | first, second, third, fifth, eighth, ninth, twelfth, twentieth, twenty-first, fortieth, one hundredth, one hundred twelfth |
| Reverse "three hundred fifty" | **350** |
| Reverse "one hundred and twenty-three" / "a hundred" / "two million five" | 123 / 100 / 2,000,005 |
| Reverse "twelve lakh thirty-four thousand five hundred sixty-seven" | 1,234,567 |

### 3.5 Outputs

- **Headline:** the words (large, wraps), Copy.
- **Grouped digits** in both systems with the period names.
- **Check tab:** the check line + SVG preview (amount box, words line with a dash fill, "SAMPLE" watermark).
- **Cheque tab:** "Rupees … Only" + SVG preview (₹ box), same rules.
- **Ordinal tab:** "twenty-first" + the numeral "21st".
- **Reverse tab:** the number, grouped, or "I couldn't read 'xyz'" pointing at the unknown word.
- **Bulk (optional, inside Words):** one number per line → one result per line, Copy all, `.txt` download (generated locally).
- Share URL (the number and options), Copy.

### 3.6 Tests

- 0, 1–20, tens, 21–99 hyphens, 100, 101, 110, 999, 1,000, 1,001, 1,000,000, 10³³, 10³⁶ − 1.
- "and" styles; the decimal styles; negatives (−0 → zero).
- Cents rounding (x.995, x.994, x.005); carry into the integer.
- Indian: lakh, crore, ≥ 1,000 crore, paise, "Only"; grouping both ways.
- Ordinals (all irregulars, -y → -ieth, large numbers).
- Reverse: round-trip `parseWords(toWords(n)) === n` for a sample of 1–10⁹ and lakh/crore forms; unknown word → `null`.
- Input parsing: commas, Indian commas, spaces, leading `+`, invalid text.
- The worked examples. Snapshot of the SVG previews.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Numbers to Words Converter – Amount in Words` (44; 56 with the suffix: OK) |
| Meta | `Free numbers to words converter. Turn any number or dollar amount into words for checks and invoices, with US and lakh / crore styles and ordinals.` (147) |
| H1 | `Numbers to Words: Write Any Number or Amount in Words` |
| BLUF | "Type a number to see it in words, with the digit groups shown. For a check, $5,075.62 is written 'Five thousand seventy-five and 62/100 dollars'. For an Indian cheque, ₹12,34,567.50 is 'Rupees Twelve Lakh Thirty-Four Thousand Five Hundred Sixty-Seven and Fifty Paise Only'. You can also turn words back into a number." (engine) |
| ToolShell pills | `US check & Indian cheque formats`, `Lakh & crore`, `Ordinals & decimals`, `Words back to numbers` |
| Links out | live Invoice Generator (Batch 3 #16), Reverse Sales Tax (Batch 5 #8, when live), Roman Numeral / Fraction to Decimal (Batch 8, when live) |
| Links in | Invoice Generator, Tools hub "Text & Writing" |

## 5. Content (~1,400–1,700 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the numbers to words converter | 5 tabs, options | 110 |
| 2 | Rules for writing numbers in words | Hyphens 21–99; "and" (US vs UK vs checks); zero | 180 |
| 3 | How to write an amount in words on a check | Steps + 5,075.62 example + SVG; fill the line; "Only"/"Exactly"; one sentence quoting UCC § 3-114 ("words prevail over numbers", link, checked date), no other legal claims | 200 |
| 4 | Rupees in words: lakh and crore | Grouping, units, cheque format with example | 180 |
| 5 | Ordinal numbers in words | Irregulars; numeral suffixes | 110 |
| 6 | Decimals and negative numbers | "point" vs fraction; minus/negative | 100 |
| 7 | Commas and periods (place value) | Both systems; `rewrite the numbers with commas separating the periods` worked example | 130 |
| 8 | Words back to numbers | Reverse rules; "three hundred fifty" = 350 | 90 |
| 9 | Names of large numbers | thousand → decillion; lakh/crore/arab/kharab | 100 |
| 10 | FAQ | §6 | 350 |

## 6. FAQ (11, from the competitor question bank + cluster keywords)

1. How do I write a check amount in words (cents as /100)?
2. When should numbers be written as words? (general guidance; style guides differ, name them only if cited)
3. Do you use "and" when writing numbers?
4. How do I write numbers in lakh and crore?
5. How do I hyphenate numbers like forty-two?
6. How do I write ordinal numbers in words?
7. How do I write decimals in words?
8. How do I convert words back to a number?
9. How do commas separate the periods?
10. What comes after trillion?
11. How do I write rupees and paise on a cheque?

## 7. Done when

- [ ] `number-words-engine.ts` + tests (BigInt, no floats); `npm run verify` passes.
- [ ] SVG previews generic with a "SAMPLE" watermark; no bank names, logos or MICR.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Only the UCC § 3-114 legal sentence, cited; nothing else legal.
- [ ] Registrations + docs; `graphify update .`.
- [ ] **STOP and report** (end of Tier 1).
