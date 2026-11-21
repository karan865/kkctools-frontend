# Characters to Words Converter — Build Spec

> **URL:** `/characters-to-words/` · Batch 6 · Tier 1 · **Build order 3**
> **Read first:** `../00_BATCH6_BUILD_RULES.md` (§2 accuracy, §3 sources, §4 shared engine)
> **Inputs:** `02_Characters_to_Words_Converter_Competitor_Analysis.md`, keyword file §2 #2, CSVs `2. character counter 15-30 %` and `2.2 - character counter 0-15%`
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**About 33 "X characters to words" searches, ≈ 32,000 combined, and most are rising.**
- `how many words is 2000 characters` 2,900; `1000 characters to words` 2,400; `how many words is 1000 characters` 2,400.
- Then 1,500 / 3,000 / 4,000 / 500 characters (1,300 each), 2,000 / 3,000 / 4,000 / 500 / 5,000 variants (1,000 each), 2,500 (880), 5,300 (390), 200 and 1,200 (320).

**Who searches:** people filling a form with a character limit (college and grant applications, job portals, bios). They need two things: a quick estimate and an exact check of their own text.

**The SERP is weak and spammy:** hijacked-domain spam (truck dealers, a Samsung newsroom, a surf brand sitemap), blogspot posts and counter-site articles. **No dedicated converter ranks.** A clean, correct tool can.

**Competitors disagree by almost 2×:** answers for 1,000 characters range from 140 to 250 words because each site picks a different word length (4.5, 4.7, 5 + 1, 5.5, 6.5) and rarely says which. **Our angle: show the formula, make the average editable, give a range, and let people measure their *own* average from pasted text.**

### Research notes from the competitor analysis

- **Pages read:** HowManyWords.app (1,000 characters article), LetterCounter.org (words ↔ characters reference), WordCount.com (character counter).
- **Failed:** CharacterCalculator (404), UtilitiesKit (404), WordLimit.ai (DNS error), WordCounter.net blog (served an unrelated post).
- **HowManyWords.app** gives "150–200", "≈ 167" and "165–180" in one article, using 5.5 and 6 characters per word; reading time "≈ 1 min", "< 1 min" and "40–50 s"; "100 words = 500–600 characters" while its own rule gives 600.
- **LetterCounter.org** errors we checked:
  - a sentence shown as 64 characters is 65;
  - a "150-word tweet ≈ 280 characters" is about 33 words and 240 characters;
  - a meta description shown as "28 words / 155 characters" is about 18–19 words and 130 characters;
  - with-spaces upper bounds imply 6.5 characters per word, contradicting its stated 5.5–6; "Method 2" uses 4.5.
- **WordCount.com** is the strongest tool (limit gauges, file import, local drafts, SMS encoding note) but has no characters → words converter, a broken table header, and a meta-description limit given as both 155 and 160 (Google truncates by pixel width, not characters).

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | 1000 characters to words | 2,400 | 22 | H1 ("1,000 Characters"), BLUF, first table row highlighted |
| Long tail (one table) | how many words is 2000 / 1000 / 1500 / 3000 / 4000 / 500 / 5000 / 2500 / 650 / 750 characters; 1500 / 3000 / 4000 / 2500 / 3500 / 5300 characters to words; 2000 / 500 / 4000 / 1000 characters is how many words; 5000 / 3000 / 4000 / 1200 / 200 characters in words | 260–2,900 each (≈ 28,000) | 0–29 | **the table** (first cell reads "1,000 characters"), H2 "Characters to words table" |
| Secondary | characters to words (head, not in exports) | — | — | title, H2s (`TODO(owner)`: pull volume) |
| Secondary | do spaces count as characters | 260 | 11 | FAQ 3 + H2 "With or without spaces" |
| Secondary | character count includes spaces and punctuation definition | 1,300 | 27 | H2 "What counts as a character?" (one clear definition paragraph) |
| Secondary | what does 1000 characters look like · what does 500 characters look like | 1,000 · 720 | 0–18 | two exact sample blocks |
| Secondary | how long is 3000 characters | 260 | — | FAQ (words + pages + reading time, linking #1 and #7) |

## 2. Our edge

- **A real two-way converter:** characters ↔ words, with or without spaces.
- **The formula on screen** and an **editable average word length** (default 4.7 letters, labelled; §3 says this needs a source, so `TODO(owner)` or label "commonly used average").
- **A range, not one hard number:** low uses (L + 1), high uses (L − 1). Explained in one sentence.
- **"Use my writing" calibration:** paste any sample of your own writing and the page measures *your* characters per word, then re-runs the estimate and the table with it. Nobody offers this.
- **Paste-to-check:** exact characters (graphemes), with and without spaces, words, and "X characters left" for a chosen limit (shared engine).
- **One engine table** for 100 → 10,000 characters, with and without spaces.
- **Correct, consistent figures:** every number on the page comes from the same formula.
- **Privacy:** text never leaves the browser.

## 3. Calculator spec

### 3.1 Tabs

1. **Characters → words** (default)
2. **Words → characters**
3. **Check my text** (paste, exact counts, limit)

### 3.2 Input guide diagram (above the inputs)

`CharsToWordsInputGuide.tsx`: one sample phrase split into boxes.

- Sample: `Write clear, short answers.`
- **Each word** in a box with its letter count under it ("5", "5", "5", "7"; the comma and full stop shown as punctuation).
- **Spaces** shown as small dots labelled "2 Spaces (counted or not)".
- **Average:** a bracket over a word: "1 Average word length (4.7 letters)".
- **Result:** "27 characters ≈ 4.7 words (with spaces)" in a badge.
- **Words → characters tab:** the arrow reverses.
- **Check tab:** a limit bar with "3 Your limit" and "Characters left".

Live values (the badge uses the user's inputs); the focused field highlights.

`TODO(builder)`: put the guide's sample counts in a unit test (checked with node: 27 graphemes with spaces; 24 without; 22 letters; 4 words; 27 ÷ 5.7 ≈ 4.7 words estimated).

### 3.3 Inputs

| Field | Default |
|---|---|
| Characters | 1,000 |
| Count spaces | with spaces (default) · without spaces |
| Average word length | 4.7 letters (editable 2–12; "commonly used English average") |
| Punctuation per word | 0 (editable 0–1; optional "add punctuation" toggle) |
| Words (reverse) | 250 |
| Limit (check tab) | 1,000; presets 150, 200, 255, 280, 500, 1,000, 1,500, 2,000, 3,000, 4,000, 5,000, custom |

### 3.4 Engine (in `text-engine.ts` or `src/lib/char-word-engine.ts`)

```ts
perWord   = L + (spaces ? 1 : 0) + p            // L = average letters, p = punctuation allowance
words     = chars / perWord
range     = [chars / (perWord + 1), chars / (perWord - 1)]   // guard perWord - 1 > 0
chars     = words * perWord                     // reverse
measured  = (graphemes(text, spaces) ) / words(text)          // "use my writing": replaces perWord
table(rows, opts) → [{chars, withSpaces:{est,low,high}, withoutSpaces:{est,low,high}}]
```

Round estimates to whole words; show "about".

**Worked examples (checked with node, 2026-11-22; L = 4.7, p = 0):**

| Input | Result |
|---|---|
| **1,000 characters with spaces** | **≈ 175 words** (range 149–213) |
| 1,000 characters without spaces | ≈ 213 words (175–270) |
| 2,000 with spaces | ≈ 351 (299–426) |
| 500 with spaces | ≈ 88 (75–106) |
| 5,000 with spaces | ≈ 877 (746–1,064) |
| Reverse: 500 words | ≈ 2,850 characters with spaces · 2,350 without |
| Reverse: 250 words | ≈ 1,425 with spaces · 1,175 without |

**Table (with spaces · without spaces), checked with node:**

| Characters | With spaces | Without spaces |
|---:|---|---|
| 100 | 18 (15–21) | 21 (18–27) |
| 150 | 26 (22–32) | 32 (26–41) |
| 200 | 35 (30–43) | 43 (35–54) |
| 250 | 44 (37–53) | 53 (44–68) |
| 280 | 49 (42–60) | 60 (49–76) |
| 500 | 88 (75–106) | 106 (88–135) |
| 650 | 114 (97–138) | 138 (114–176) |
| 750 | 132 (112–160) | 160 (132–203) |
| **1,000** | **175 (149–213)** | **213 (175–270)** |
| 1,200 | 211 (179–255) | 255 (211–324) |
| 1,500 | 263 (224–319) | 319 (263–405) |
| 2,000 | 351 (299–426) | 426 (351–541) |
| 2,500 | 439 (373–532) | 532 (439–676) |
| 3,000 | 526 (448–638) | 638 (526–811) |
| 3,500 | 614 (522–745) | 745 (614–946) |
| 4,000 | 702 (597–851) | 851 (702–1,081) |
| 5,000 | 877 (746–1,064) | 1,064 (877–1,351) |
| 5,300 | 930 (791–1,128) | 1,128 (930–1,432) |
| 10,000 | 1,754 (1,493–2,128) | 2,128 (1,754–2,703) |

The table is generated by the engine (static HTML at the defaults), and re-renders live when the user changes L or uses "my writing".

### 3.5 Outputs

- **Headline:** "≈ 175 words" + range.
- **Sentence:** "1,000 characters with spaces is about 175 words (between 149 and 213), assuming an average word of 4.7 letters plus a space."
- **Method line:** `1,000 ÷ (4.7 + 1) = 175.4`.
- "Your writing averages 5.9 characters per word; at that rate 1,000 characters ≈ 169 words." (only after calibration).
- Check tab: characters (with/without spaces), words, limit ring, "X characters left", overflow highlight (shared component).
- Links: "≈ 0.35 pages single-spaced" → #1; "≈ 44 s to read" → #7 (only with a verified wpm).
- Share URL (numbers only), Copy.

### 3.6 Tests

- Conversion and range maths; reverse; `perWord - 1 ≤ 0` guard.
- Calibration from pasted text (graphemes ÷ words, spaces on/off).
- Grapheme counting in the check tab (emoji, ZWJ, combining marks, CJK).
- Table rows equal single calls; static table matches the defaults.
- Input guide sample counts.
- Sample blocks are exactly 500 and 1,000 characters.
- The worked examples. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Characters to Words Converter – How Many Words?` (47; 59 with the suffix: OK) |
| Meta | `Free characters to words converter. See roughly how many words fit in 500, 1,000, 2,000 or 5,000 characters, with and without spaces, or paste text to check.` (157) |
| H1 | `Characters to Words: How Many Words Is 1,000 Characters?` |
| BLUF | "1,000 characters is about 175 words with spaces (between 149 and 213), or about 213 words if spaces aren't counted. That assumes an average English word of 4.7 letters. Change the average, or paste your own writing to measure it, and every figure below updates." (engine) |
| ToolShell pills | `Characters ↔ words both ways`, `With or without spaces`, `Measures your own writing`, `Exact check for any limit` |
| Links out | Character Counter (#5), Word Counter (#6), Twitter/IG Counter (#3), Words to Pages (#1) |
| Links in | #1, #3, #5, #6, Tools hub "Text & Writing" |

## 5. Content (~1,100–1,400 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the characters to words converter | 3 tabs, calibration | 110 |
| 2 | How many words is 1,000 characters? | Engine answer + method + range | 130 |
| 3 | How characters convert to words | Formula; why a range; why sites disagree (4.5 / 4.7 / 5.5 / 6.5) | 180 |
| 4 | With or without spaces | Which forms use which; example (`do spaces count as characters`) | 120 |
| 5 | What counts as a character? | One definition paragraph: letters, digits, spaces, punctuation, line breaks; emoji = 1 per visible symbol (`character count includes spaces and punctuation definition`) | 130 |
| 6 | Characters to words table | The table | — |
| 7 | Fitting an application or form limit | Paste-and-check workflow, trimming tips (our own); **no specific application limits unless cited and dated** (`TODO(owner)`) | 150 |
| 8 | What 500 and 1,000 characters look like | Two exact sample blocks | 60 + samples |
| 9 | FAQ | §6 | 330 |

## 6. FAQ (10, from the competitor question bank + cluster keywords)

1. How many words is 1,000 characters?
2. How many words is 2,000 / 1,500 / 3,000 / 4,000 characters?
3. Do spaces count as characters?
4. Does a character count include punctuation?
5. How many characters is 250 / 500 / 1,000 words?
6. Why do different tools give different answers?
7. Do emoji count as one character or two? (one here; some platforms count differently, link #3)
8. How do I fit an application's character limit?
9. Is the average word length different in other languages? (we don't state averages for other languages; use "my writing" calibration)
10. How long is 3,000 characters? (words, pages via #1, reading time via #7)

## 7. Done when

- [ ] Engine functions + tests; `npm run verify` passes.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Table is static HTML from the engine; no per-number URLs; the 4.7 default labelled (or cited).
- [ ] Registrations + docs; `graphify update .`.
