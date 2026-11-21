# Words to Pages Calculator — Build Spec

> **URL:** `/words-to-pages/` · Batch 6 · Tier 1 · **Build order 2**
> **Read first:** `../00_BATCH6_BUILD_RULES.md` (§2 accuracy, §3 sources, §7 tables)
> **Inputs:** `01_Words_to_Pages_Calculator_Competitor_Analysis.md`, keyword file §2 #1, CSVs `1. word count 0-15%` and `1.1 word count 15-30%`
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**The biggest opportunity in Batch 6:** 87 keywords, **138,210** US searches.
- About **51 "how many pages is X words" phrases (≈ 92,000)**, most at KD 4–22.
- The head `how many pages is 1000 words` is **14,800 / KD 27**; then 1,500 (6,600), 2,000 (6,600), 500 (5,400), 3,000 (3,600), 5,000 (2,900), 1,200 and 2,500 (2,400 each).
- 14 "sentences / paragraphs" phrases (≈ 14,500).

**One page answers all of them:** the calculator plus one engine-generated table. **Never one URL per number.**

**Many rows are declining** because Google answers "1,000 words = 2 pages" directly. We still win the click by doing what an answer box can't:
- font, size, spacing, paper and margins;
- pasting the actual essay;
- book pages;
- paragraph and sentence estimates;
- showing *why* the answer is a range.

**The SERP is confused, and that is our content angle.** Competitors disagree on the baseline:
- single spacing 450 vs 500 words per page;
- 1.5 spacing 375 vs the ≈ 333 the maths gives;
- double spacing 250 vs ≈ 274.

WordCounter.net's own two tables disagree with each other. We publish the model, the assumptions and a range.

### Research notes from the competitor analysis

- **Pages read:** WordCounter.net/words-per-page, The Write Practice, TypeCount, Calculate.co.nz, CharacterCalculator (CodeShack blocked, 403).
- **WordCounter.net** has the most inputs (6 fonts, 10–14 pt, spacing, A1–A5/Letter, margins) but:
  - its "X words → pages" table implies ≈ 274 words/page and its "words in X pages" table uses 450;
  - both contradict the 500/250 rule on the same page;
  - the H1 is branding; Grammarly modal.
- **The Write Practice** is the only one with book trims (5×8 → 8.5×11). No visible results, table or examples.
- **TypeCount:** the 500-word row is labelled "One page (double-spaced)" but shows 2.0 pages. Says "publishers use 250" with no source.
- **Calculate.co.nz:** 3,000 words → 6 / 12 pages ✔, but 375 for 1.5 spacing is unexplained, and no A4 even though NZ uses A4.
- **CharacterCalculator:** claims an "advanced algorithm" but uses a fixed 500 baseline.
- **0 of 5** have paragraph/sentence estimates, sample blocks or cited novel/essay lengths.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | words to pages | 1,900 | 18 | title, H1, first sentence |
| Long tail (one table) | how many pages is 1000 / 1500 / 2000 / 500 / 3000 / 5000 / 1200 / 2500 / 4000 / 750 / 10000 / 800 / 600 / 700 / 20000 words | 14,800 · 6,600 · 6,600 · 5,400 · 3,600 · 2,900 · 2,400 · 2,400 · 1,900 · 1,900 · 1,600 · 1,600 · 1,300 · 1,000 · 720 | 5–28 | **H1 example (1,000)**, BLUF, the big table (each row's first cell is "X words"), H2 "How many pages is 1,000 words?" |
| Long tail | how many pages is 1000 words double spaced · 2000 words double spaced | 1,600 · 1,000 | 11–23 | double-spaced column + FAQ 2 |
| Secondary | how many pages | 4,400 | 19 | H1 ("How Many Pages"), intro |
| Secondary | how many words per page · how many words is one page · how many words are on one page · how many words are on a page · 1 page how many words | 1,000 · 1,900 · 590 · 720 · 590 | 6–23 | H2 "How many words are on a page?" + reverse mode |
| Secondary | how many words is half a page | 1,000 | 20 | FAQ 3 (engine numbers) |
| Secondary | word count in pages | 720 | 26 | intro sentence |
| Secondary | how long is an essay · how long is a essay · how long should an essay be | 4,400 · 1,900 · 1,300 | 12–19 | H2 "How long is an essay?" (**cited only**, else page counts by word count) |
| Secondary | how many words in a book · how many words in a 300 page book · word count of average novel · how many words is the average novel · how many words is a novel · how many words is an average novel | 720 · 720 · 720 · 2,900 · 1,900 · 1,600 | 11–29 | book mode + H2 "How many words are in a book?" (**cited only**) |
| Secondary | what does 100 words look like · what does 200 words look like · how much is 300 words · 200 word essay · a 500 word essay | 480 · 590 · 720 · 480 · 480 | 4–12 | sample blocks section |
| Long tail | how much sentences are in a paragraph · how many words in a paragraph · how many sentences is one paragraph · 300 words is how many paragraphs | 3,600 · 2,900 · 1,000 · 720 | 16–27 | paragraph/sentence outputs + H2 "Paragraphs and sentences" |

## 2. Our edge

- **A visible model:** font size, spacing, paper (Letter / A4) and margins → words per page, pages and a **±10% range**, with the assumptions printed under the result.
- **Font choice backed by real calibration** (§3.4), not a hidden "algorithm".
- **Two directions:** words → pages and pages → words.
- **Paste the text** → live word count (shared engine) → pages.
- **Paragraph and sentence estimates** from editable averages, with the plain-language guideline cited (§3: "no more than 150 words in three to eight sentences").
- **Book mode:** trim-size presets with an editable words-per-page.
- **The big table** (100 → 50,000 words) with single, 1.5 and double spacing side by side, generated by the engine.
- **Sample blocks:** what 100, 200 and 300 words look like (our own text, exact word counts).
- **"Why calculators disagree"** section: turns the competitors' inconsistencies into trust content.

## 3. Calculator spec

### 3.1 Tabs

1. **Words → pages** (default)
2. **Pages → words**
3. **Paste text**
4. **Book pages**

### 3.2 Input guide diagram (above the inputs)

`WordsToPagesInputGuide.tsx`: a page outline (Letter or A4 proportions, switching live).

- **Margins:** dashed inner box labelled "3 Margins (1 in)".
- **Text lines:** grey lines inside; their count follows "2 Line spacing" (single = many lines, double = half).
- **Line height:** a bracket on one line, labelled "1 Font size (12 pt)".
- **Paper:** a label at the top, "4 Paper: Letter 8.5 × 11 in".
- **Result:** a badge in the corner, "≈ 500 words per page".
- **Book tab:** a narrower book page with "Trim 6 × 9 in" and "Words per page (edit)".

Live values; the focused field highlights.

### 3.3 Inputs

| Field | Default |
|---|---|
| Words | 1,000 |
| Font | Times New Roman (list from the calibration file; see §3.4) |
| Font size | 12 pt (10–14) |
| Line spacing | single · 1.15 · 1.5 · double |
| Paper | Letter · A4 |
| Margins | 1 in all round (0.5–1.5) |
| Words per sentence | 20 (assumption, edit) |
| Words per paragraph | 100 (assumption, edit) |
| Book trim | 5 × 8 · 5.5 × 8.5 · 6 × 9 (default) · 7 × 10 · custom |
| Book words per page | 250, labelled "example figure, edit to match your layout" (`TODO(owner)`: a cited typical figure, else keep as an example) |

### 3.4 Engine (`src/lib/page-estimate-engine.ts`)

```ts
// Baseline: 12 pt, single spacing, Letter, 1-inch margins = BASE words per page
BASE = calibration[font] ?? 500           // 500 = the common convention; label it "convention" until calibrated
area(paper, margin) = (w - 2m) * (h - 2m) // Letter 8.5×11, A4 8.27×11.69 in
wordsPerPage = BASE * (12 / size)^2 * area(paper, margin) / area(Letter, 1) / spacing
pages        = words / wordsPerPage ; range = [pages*0.9, pages*1.1]
wordsForPages(p) = p * wordsPerPage
sentences = words / wordsPerSentence ; paragraphs = words / wordsPerParagraph
book: bookPages = ceil(words / bookWordsPerPage)
table(rows, settings) → [{words, single, onePointFive, double}]   // single/1.5/double at 12 pt Letter 1 in
```

- **Why size is squared:** a smaller font fits more characters per line *and* more lines per page.
- **Why spacing divides:** double spacing halves the lines on a page, so 1.5 gives 500 ÷ 1.5 ≈ 333 (not the 375 some sites use).
- **Calibration (`src/data/page-calibration.ts`):**
  - `TODO(owner)` before launch, ~15 minutes in Word:
    1. paste our 1,000-word calibration text (written by us, stored as a fixture);
    2. set the font at 12 pt, single, Letter, 1-inch margins;
    3. record the page count to one decimal;
    4. words per page = 1,000 ÷ pages.
  - Do Times New Roman, Arial, Calibri, Georgia, Verdana, Courier New.
  - **Until a font is measured, it is not in the font list.** If only the convention exists, hide the font field and print "Based on the common 500-words-per-page convention (12 pt, single-spaced)".

**Worked examples (checked with node, 2026-11-22; convention baseline 500):**

| Input | Result |
|---|---|
| 1,000 words, 12 pt, single, Letter, 1 in | **500 words/page → 2.0 pages** (range 1.8–2.2) |
| same, double-spaced | **250 words/page → 4.0 pages** |
| same, 1.5 spacing | **333.3 words/page → 3.0 pages** |
| 1,000 words at 11 pt, single | 595.0 words/page → **1.68 pages** |
| 10 pt / 14 pt single | 720.0 / 367.3 words/page |
| A4, 1 in, 12 pt single | **519.3** words/page (A4 text area is 3.9% larger) |
| Letter, 1.25 in margins | 435.9 words/page |
| Reverse: 5 pages, double-spaced | **1,250 words** |
| 1,000 words at 20 words/sentence, 100 words/paragraph | **50 sentences, 10 paragraphs** |
| 300 words at 100 words/paragraph | **3 paragraphs** |
| 3,000 words single / double | **6 / 12 pages** (matches Calculate.co.nz ✔) |

### 3.5 Outputs

- **Headline:** pages (one decimal) + the range.
- **Sentence:** "1,000 words is about 2 pages single-spaced or 4 pages double-spaced (12 pt, 1-inch margins, Letter paper)."
- **Assumptions line** under the result (font, size, spacing, paper, margins, baseline source: "convention" or "measured in Word on <date>").
- Paragraphs and sentences estimate, labelled "averages; edit them".
- "Reading time ≈ 4 min 12 s at 238 wpm" link → #7 (only once the wpm entry is verified; otherwise link text without the number).
- **The big table:** 100, 200, 250, 300, 400, 500, 600, 700, 750, 800, 1,000, 1,200, 1,500, 2,000, 2,500, 3,000, 4,000, 5,000, 7,500, 10,000, 20,000, 50,000 words × single / 1.5 / double.
  - Columns follow the user's font/size/paper settings live; the static HTML shows the 12 pt Letter defaults.
  - Print button.
- **Sample blocks:** 100, 200 and 300 words, expandable.
- Share URL, Copy.

### 3.6 Tests

- Baseline maths and each factor (size², area, spacing).
- Range output; reverse mode; rounding to one decimal.
- Table rows equal single calls.
- Calibration file: fonts without data are excluded.
- Paste tab uses the shared `words()` (hyphen rule).
- Sample blocks are exactly 100, 200 and 300 words.
- Zero / empty → 0 pages, no `NaN`.
- The worked examples. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Words to Pages Calculator – How Many Pages Is It?` (49; **61 with the suffix → `absoluteTitle`**) |
| Meta | `Free words to pages calculator. See how many pages, paragraphs and sentences a word count makes, single or double spaced, for any font size and paper size.` (155) |
| H1 | `Words to Pages Calculator: How Many Pages Is 1,000 Words?` |
| BLUF | "1,000 words is about 2 pages single-spaced or 4 pages double-spaced, using 12 pt type, 1-inch margins and Letter paper. Change the font size, spacing, paper or margins below and the page count updates, or paste your text to count it first." (engine) |
| ToolShell pills | `Single, 1.5 or double spaced`, `Letter or A4, any margins`, `Pages ↔ words both ways`, `Paragraph & sentence estimates` |
| Links out | Word Counter (#6), Characters to Words (#2), Reading Time (#7), Sentence Counter (#9) |
| Links in | #2, #6, #7, #9, Tools hub "Text & Writing" |

## 5. Content (~1,500–1,800 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the words to pages calculator | 4 tabs | 110 |
| 2 | How many pages is 1,000 words? | Engine answer for single / 1.5 / double; then 500, 1,500, 2,000 in one line each | 150 |
| 3 | How many words are on a page? | Model, the baseline, font size and spacing effects; reverse example | 200 |
| 4 | Single vs double spacing | Why double halves the words; the 375 vs 333 note | 120 |
| 5 | Letter vs A4 and margins | Engine numbers (519 vs 500; 1.25 in margins 436) | 100 |
| 6 | Paragraphs and sentences: how many words? | Editable averages; cited plain-language guideline (≤ 150 words, 3–8 sentences) | 160 |
| 7 | What 100, 200 and 300 words look like | Three sample blocks | 80 + samples |
| 8 | How long is an essay? | **Only with a cited university/style-guide source** (`TODO(owner)`); otherwise "your assignment sets the length; here's what 500 / 1,000 / 2,000 words means in pages" | 120 |
| 9 | How many words are in a book? | Book mode; 300-page example as arithmetic with the stated words/page; novel ranges **only if cited** (`TODO(owner)`: publisher/agent source) | 150 |
| 10 | Why words-to-pages calculators disagree | Baselines 450/500, 250/274, 333/375; our method | 140 |
| 11 | Words to pages table | The big table | — |
| 12 | FAQ | §6 | 380 |

## 6. FAQ (12, from the competitor question bank + cluster keywords)

1. How many pages is 1,000 words? (single, 1.5, double)
2. How many pages is 1,000 words double-spaced? (and 2,000)
3. How many words is half a page? (250 single / 125 double at the defaults)
4. How many words are on one page?
5. How many pages is 500, 1,500, 2,000 or 3,000 words?
6. How long is an essay? (cited only)
7. How many words are in a novel or a 300-page book? (cited ranges only; the 300-page arithmetic with the stated words/page)
8. How many sentences are in a paragraph? (cited guideline: three to eight in plain-language writing)
9. How many words are in a paragraph? (assumption + guideline)
10. Does font or font size change the page count?
11. Letter vs A4: does it matter?
12. Why do different calculators give different answers?

## 7. Done when

- [ ] `page-estimate-engine.ts` + tests; `npm run verify` passes.
- [ ] `page-calibration.ts` filled by the owner, or the font field hidden with the convention label.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Table is static HTML from the engine; no per-number URLs; essay/novel figures only with a cited source.
- [ ] Registrations + docs; `graphify update .`.
