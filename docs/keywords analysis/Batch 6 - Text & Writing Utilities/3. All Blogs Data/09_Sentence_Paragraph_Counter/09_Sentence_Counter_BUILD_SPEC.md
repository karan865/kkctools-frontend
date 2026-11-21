# Sentence & Paragraph Counter — Build Spec

> **URL:** `/sentence-counter/` · Batch 6 · Tier 2 · **Build order 9**
> **Read first:** `../00_BATCH6_BUILD_RULES.md` (§3 digital.gov paragraph guidance, §4 `sentences()` + `abbreviations-en.ts`)
> **Inputs:** `09_Sentence_Paragraph_Counter_Competitor_Analysis.md`, keyword file §2 #9
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**About 28,500 searches,** but the head is hard and falling:
- `sentence counter` 18,100 / KD 25, declining: the real head, used in title and H1 but not relied on;
- **`paragraph counter` 1,600 / KD 11** is the way in (primary);
- `paragraph number` 590 / KD 13; `how long should a sentence be` 260 / KD 10;
- `sentences counter` 1,300 and `sentence count` 720 (KD 22), `lines counter` 880 (KD 19, rising);
- question rows: `how long is 20 sentences` 1,300, `how long is a sentence` 1,000.

**The hard part is sentence detection,** and that is where we win. The browser's `Intl.Segmenter` alone gets ordinary text wrong (checked with node, 2026-11-22):
- `Mr. and Mrs. Lee met Prof. Ray at 9 a.m. on Monday.` → **3** sentences (it is 1);
- our 5-sentence fixture with "Dr." and "J. K." → **8**.

So the engine adds documented, editable merge rules on top. **ConvertCase is the only competitor that documents its rules, and it still misses "etc." and "Inc."**

### Research notes from the competitor analysis

- **Pages read:** Grammarly (paragraph counter; editor didn't load), ConvertCase (rules benchmark), CharacterCounter.com (most stats), WordCount.com (paragraph counter). QuillBot 403.
- **ConvertCase:** `. ? !` + space/line break, closing quotes/brackets, list lines = sentences, unpunctuated last sentence counts, line break before lowercase doesn't split, multilingual marks; abbreviation list (Dr, Mr, Mrs, Ms, Prof, St, vs, e.g., i.e., U.S., "No." before a digit). **Misses "etc." and "Inc."**; readability advice contradicts itself (Grade 8 vs 15–20-word bands).
- **CharacterCounter.com:** average, **median**, longest, shortest, sentences per paragraph, 10 FAQs; detection rules not explained.
- **WordCount.com:** per-paragraph table, longest-sentences list, blank-line / every-line toggle; **its definitions conflict**, its "Averages" section is empty, and its FAQ (40–100 words per paragraph) contradicts its table (75–150).
- **Grammarly:** paragraph-length advice that switches units (sentences for blogs, words for academic), "40 million users" unverified, heavy promotion.
- **0 of 4** have an editable abbreviation list or highlight long sentences for free.
- **Length guidance we can cite** (§3, digital.gov plain-language guide): "paragraphs of no more than 150 words in three to eight sentences", "never longer than 250 words", one idea per sentence. **No sentence word limit is given there**, so we don't publish one.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | paragraph counter | 1,600 | 11 | title ("Paragraphs"), H1, first sentence, Paragraphs tile |
| Head | sentence counter · sentences counter · sentence count · count sentences | 18,100 · 1,300 · 720 · 880 | 22–28 | title + H1 lead, ToolShell heading, H2 "How the sentence counter works" |
| Secondary | paragraph number | 590 | 13 | per-paragraph table (numbered ¶1, ¶2…), FAQ 5 |
| Secondary | lines counter | 880 | 19 | Lines tile + H2 "Counting lines" |
| Secondary | how long should a sentence be · how long is a sentence | 260 · 1,000 | 10–27 | H2 "How long should a sentence be?" (cited guidance only + your own average) |
| Support | how long is 20 sentences | 1,300 | 28 | FAQ: 20 × your average (default 20 words) = 400 words → pages (#1) and reading time (#7) |
| Never in copy | sentance counter · sentence coutner | — | — | misspellings |

## 2. Our edge

- **Documented, editable sentence rules** (shown in a "How we split sentences" panel):
  - **never-final abbreviations** (Mr, Mrs, Ms, Dr, Prof, Sr, Jr, St, vs, e.g., i.e., No. before a digit, Jan–Dec when followed by a digit): always merge;
  - **maybe-final abbreviations** (etc., Inc., Ltd., Co., a.m., p.m., U.S.): merge only when the next word starts lowercase or with a digit;
  - single initials (`J. K.`), decimals (`3.14`, `$4.50`), URLs and emails, ellipses followed by lowercase;
  - closing quotes and brackets stay with their sentence;
  - a line break before a lowercase letter doesn't end a sentence (hard-wrapped text);
  - list lines count as sentences (toggle);
  - terminal marks for other scripts: `。！？` `।` `؟`.
  - The user can add or remove abbreviations; the list is saved only in memory (optional localStorage).
- **Clear paragraph and line rules:** paragraphs = blocks separated by a blank line (default) or every non-empty line (toggle); the rule is printed in the UI.
- **Full statistics:** mean, **median**, shortest and longest sentence (words), a length histogram, sentences per paragraph, words per paragraph.
- **Long-sentence highlighting** above N words (default 25, labelled "your threshold"), click a highlight or a list item to jump to it.
- **Long-paragraph flag** at the cited 150-word guideline (and 250 "never longer" line), with the source shown.
- **Optional readability** (Flesch Reading Ease, Flesch–Kincaid Grade) with formulas shown and syllables labelled approximate. `TODO(owner)`: approve including it.
- **Privacy:** text stays in the browser.

## 3. Calculator spec

### 3.1 Tabs

1. **Count** (default): tiles + highlighted text.
2. **Sentences**: the sentence list with lengths, histogram, long-sentence list.
3. **Paragraphs**: numbered paragraph table (words, sentences, characters), long-paragraph flags.
4. **Rules**: abbreviation editor, toggles, the rules panel.

### 3.2 Input guide diagram (above the inputs)

`SentenceInputGuide.tsx`: the fixture text drawn with sentence brackets.

- Text: `Dr. Smith arrived at 3.30 p.m. on Monday. He paid $4.50 for coffee! Was it worth it?`
- **Brackets 1, 2, 3** under each real sentence.
- **Callouts:**
  - "1 'Dr.' doesn't end a sentence (abbreviation list)";
  - "2 '3.30' and '$4.50' are numbers, not ends";
  - "3 ? and ! end sentences".
- **Paragraph tab:** two blocks with a gap labelled "4 Blank line = new paragraph" and a "5 Line" tick at each line break.
- **Rules tab:** a chip list "Mr · Mrs · Dr · etc. …" with "+ add".
- Live mode: brackets follow the user's first 3 sentences.

### 3.3 Inputs

| Field | Default |
|---|---|
| Text | our own sample (3 paragraphs, incl. the fixture sentences) |
| Long-sentence threshold | 25 words ("your threshold"; edit 5–60) |
| Paragraph rule | blank line (default) · every line |
| List lines as sentences | on |
| Abbreviations | `abbreviations-en.ts` (two classes, editable) |
| Language marks | auto (all listed scripts) |
| Readability scores | off (if the owner approves the feature) |

### 3.4 Engine (shared `text-engine.ts` → `sentences()`)

```ts
raw = Intl.Segmenter(locale, {granularity:'sentence'}) segments
merge pass (left to right): join segment i with i+1 when segment i ends with
  - a never-final abbreviation + "." ;
  - a maybe-final abbreviation + "." AND segment i+1 starts with a lowercase letter or a digit ;
  - a single capital letter + "." (initial) AND segment i+1 starts with a capital (another initial or a name) ;
  - "..." / "…" AND segment i+1 starts lowercase ;
  - a line break (not a blank line) AND segment i+1 starts lowercase (unless listLines and the line starts with -, *, •, a digit + "." or ")")
(decimals, URLs and emails are already kept whole by Intl; keep tests for them)
stats: words per sentence (shared words()), mean, median, min, max, histogram buckets (1–10, 11–20, 21–30, 31–40, 41+)
paragraphs(t, mode) ; lines(t) ; perParagraph → {n, words, sentences, chars, flag150, flag250}
readability (optional): FRE = 206.835 − 1.015·(words/sentences) − 84.6·(syllables/words) ; FKGL = 0.39·(w/s) + 11.8·(syl/w) − 15.59
```

**Worked examples (checked with node, 2026-11-22; "raw" = `Intl.Segmenter` alone):**

| Text | Raw | **Ours** |
|---|---:|---:|
| `Dr. Smith arrived at 3.30 p.m. on Monday. He paid $4.50 for coffee! Was it worth it? J. K. Rowling wrote it... and then she left. Visit example.com/a.b for more.` | 8 | **5** |
| `Mr. and Mrs. Lee met Prof. Ray at 9 a.m. on Monday.` | 3 | **1** |
| `The meeting starts at 9 a.m. Bring the slides.` | 2 | **2** (maybe-final "a.m." + capital = a real end; known limit: "at 9 a.m. Monday" would also split, so say so in the rules panel) |
| `We sell apples, pears, etc. and more.` | 1 | **1** |
| `We sell apples, pears, etc. Then we left.` | 2 | **2** (maybe-final + capital → a real end) |
| `She works at Acme Inc. in Ohio.` | 1 | **1** |
| `It costs 3.14 dollars. Ok.` | 2 | **2** |
| `Wait... what? Yes.` | 2 | **2** |
| `He said “Stop!” Then he left.` | 2 | **2** (the quote stays with sentence 1) |
| `Email me at a.b@example.com today. Thanks.` | 2 | **2** |
| `- milk` / `- eggs` / `- bread` (3 lines) | 3 | **3** with list lines on; 1 with it off |
| `你好。我很好！` · `नमस्ते। आप कैसे हैं?` | 2 · 2 | **2 · 2** |

**Stats for the 5-sentence fixture** (URLs = 1 word, per #6 rules): words per sentence **8, 5, 4, 9, 4** → mean **6.0**, median **5**, longest **9** (sentence 4), shortest **4**. `TODO(builder)`: confirm "p.m." counts as one word in the shared rules; if not, update these numbers from the engine.

**"How long is 20 sentences":** 20 × 20 words (default average) = **400 words** ≈ 0.8 pages single-spaced (#1) and ≈ 1:41 to read at 238 wpm (#7, shown only once that rate is verified).

### 3.5 Outputs

- **Tiles:** Sentences · Paragraphs · Lines · Words · Average sentence (words) · Longest sentence.
- **Sentence:** "Your text has 5 sentences in 1 paragraph. The average sentence is 6 words; the longest is 9."
- **Highlighted text:** each sentence alternately tinted; sentences over the threshold outlined; click to jump.
- **Sentences tab:** numbered list with word counts, histogram (accessible table fallback), long-sentence list.
- **Paragraphs tab:** ¶ number, words, sentences, characters, and a flag when over 150 words ("plain-language guideline: no more than 150 words, 3–8 sentences", source link) or over 250 ("never longer than 250 words").
- **Rules tab:** the editable abbreviation chips and toggles; "Reset to default".
- Copy stats, Clear, Share URL (settings only).

### 3.6 Tests

- Every row of the worked-examples table, raw and ours.
- Abbreviation classes (never-final vs maybe-final); user-added abbreviation; removed abbreviation.
- Initials, decimals, currency, URLs, emails, ellipses (`...` and `…`), quotes and brackets.
- Line breaks: hard-wrap merge, list lines on/off, CRLF.
- CJK, Hindi, Arabic marks.
- Paragraph modes; lines; empty text; text without final punctuation (still 1 sentence).
- Stats: mean, median (odd and even counts), histogram buckets.
- Readability formula against a hand-computed sample (if included).
- Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Sentence Counter – Count Sentences and Paragraphs` (49; **61 with the suffix → `absoluteTitle`**) |
| Meta | `Free sentence counter. Count sentences, paragraphs and lines in any text, see average sentence length and spot long sentences that need splitting.` (146) |
| H1 | `Sentence Counter: Count Sentences, Paragraphs and Lines` |
| BLUF | "Paste your text to count sentences, paragraphs and lines, with your average and longest sentence. Abbreviations like 'Dr.' and 'Mr.', numbers like 3.14 and initials like 'J. K.' don't break a sentence; you can see and edit every rule. Sentences longer than your limit are highlighted so you can split them." |
| ToolShell pills | `Handles Mr., 3.14 & initials`, `Editable sentence rules`, `Long sentences highlighted`, `Paragraph & line counts` |
| Links out | Word Counter (#6), Character Counter (#5), Words to Pages (#1), Reading Time (#7), Keyword Density (#10) |
| Links in | #1, #5, #6, #10, Tools hub "Text & Writing" |

## 5. Content (~1,200–1,500 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the paragraph and sentence counter | 4 tabs | 110 |
| 2 | How the sentence counter works | The rules, raw vs ours (8 → 5 example) | 200 |
| 3 | What counts as a paragraph | Blank-line vs every-line; why tools disagree (`paragraph number`) | 110 |
| 4 | Counting lines | Lines vs sentences vs paragraphs (`lines counter`) | 80 |
| 5 | How long should a sentence be? | No fixed number in the plain-language guide we cite; one idea per sentence; use your own average and the highlight | 140 |
| 6 | How many sentences are in a paragraph? | Cited: no more than 150 words in 3–8 sentences, never over 250 words | 120 |
| 7 | Finding and fixing long sentences | Highlight workflow; splitting tips (our own) | 130 |
| 8 | Readability scores (optional) | Formulas, what they measure, limits (only if included) | 120 |
| 9 | FAQ | §6 | 330 |

## 6. FAQ (10, from the competitor question bank + cluster keywords)

1. How do I count sentences in my text?
2. How many sentences are in a paragraph? (cited guideline)
3. How long should a sentence be? (no fixed rule; one idea per sentence)
4. How does the counter handle "Mr." or "3.14"?
5. What counts as a paragraph?
6. How long is 20 sentences?
7. How long is a sentence, in words? (your text's average; default assumption 20 for estimates)
8. What is the average or median sentence length, and which is more useful?
9. What is a run-on sentence? (definition in our words; the highlight finds long ones, it doesn't judge grammar)
10. How do I count lines?

## 7. Done when

- [ ] `sentences()` merge rules + `abbreviations-en.ts` + tests; `npm run verify` passes.
- [ ] Rules panel matches the engine exactly; no sentence-length "rule" published.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Registrations + docs; `graphify update .`.
