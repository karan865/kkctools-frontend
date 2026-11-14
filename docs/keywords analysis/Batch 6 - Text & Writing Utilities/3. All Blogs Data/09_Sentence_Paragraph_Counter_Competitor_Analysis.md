# Sentence & Paragraph Counter — Competitor Analysis

> **Target page:** KKCTools `/sentence-counter/` (Batch 6, Tool #9 🟡)
> **Primary keyword:** `paragraph counter` — US 1,600 · KD 11. Cluster: 12 keywords, 28,490 US vol. The real head term is `sentence counter` (18,100 / KD 25, declining).
> **SERP source:** ⚠ No Semrush SERP export for Batch 6. Competitors come from a live web search for `sentence counter paragraph counter online` (2026-11-14). `TODO(owner): pull Google top 10 for "sentence counter" and "paragraph counter".`
> **Pages visited (2026-11-14):** 4 read: Grammarly paragraph counter, ConvertCase sentence counter, CharacterCounter.com sentence counter, WordCount.com paragraph counter. QuillBot sentence counter returned 403.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Writing-AI brands: Grammarly, QuillBot.
  - Counter sites: CharacterCounter.com, WordCount.com, ConvertCase, howmanywords.
  - Many vercel / pages.dev / lovable clones.
- **The hard part is sentence boundary detection.** Per the keyword file, it must handle "Mr.", decimals and ellipses.
  - **ConvertCase is the only site that documents its rules**: an abbreviation list, list lines, terminal marks in other scripts, and lowercase continuation.
  - The others either say nothing or claim "handles abbreviations" without explaining how.
- **Paragraph definitions conflict.** WordCount.com contradicts itself on blank-line vs every-line modes.
- **Shared engine** with #5 / #6, so this is a cheap page once those exist.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | grammarly.com/paragraph-counter | Writing-AI brand | Free paragraph counter | 1,100–1,300 |
| 2 | convertcase.net/online-sentence-counter/ | Text-tool site | Online Sentence Counter | 800–900 |
| 3 | charactercounter.com/sentence-counter | Counter site | Sentence Counter | ~1,000 |
| 4 | wordcount.com/paragraph-counter | Counter tool | Paragraph Counter | ~1,000 |
| — | quillbot.com/sentence-counter | Writing-AI brand | Sentence Counter | **blocked (403)** |

**What this tells us:**
- **ConvertCase is the rules benchmark.** A sentence ends with `. ? !` followed by a space or line break, including when closing quotes or brackets come after the mark.
  - Each list line counts as one sentence.
  - A trailing sentence with no punctuation still counts.
  - A line break before a lowercase letter does not end a sentence.
  - It recognises terminal marks in Chinese, Japanese, Hindi, Arabic and Greek.
  - Its abbreviation list covers Dr, Mr, Mrs, Ms, Prof, St, vs, e.g., i.e., U.S. and "No." before a number, but it **misses** "etc." and "Inc." before a capital.
- **CharacterCounter.com reports the most statistics:**
  - average and **median** sentence length
  - longest and shortest sentence
  - sentences per paragraph
  - a 10-question FAQ
  - **Weak point:** it doesn't explain how it detects sentences.
- **WordCount.com** offers per-paragraph tables, a longest-sentences list, click-to-select, and a blank-line / every-line toggle. Its definitions contradict each other and its "Averages" section is empty.
- **Grammarly** gives paragraph-length advice by content type and has 7 FAQs. It gives no definitions and heavily promotes its paid plan.
- **No one combines all of these:**
  - documented sentence rules
  - an **editable abbreviation list**
  - decimals, URLs and ellipses handled correctly
  - average, median and longest sentence
  - **highlighting of sentences over N words** (a keyword-file must-have)
  - paragraph and line counts, with the definitions stated

---

## 2. Feature matrix: calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Grammarly | ConvertCase | CharacterCounter | WordCount.com |
|---|---|---|---|---|
| Sentences | ✅ | ✅ | ✅ | ✅ |
| Paragraphs | ✅ | ❌ | ✅ (sentences per paragraph) | ✅ |
| Lines | ❌ | ✅ | ? | ✅ |
| Abbreviation handling | ❌ | ✅ (listed; gaps) | ⚠️ (claimed) | ❌ |
| Decimals / URLs / ellipses | ❌ | ⚠️ | ⚠️ (claimed) | ❌ |
| Editable abbreviation list | ❌ | ❌ | ❌ | ❌ |
| Multilingual terminal marks | ❌ | ✅ | ❌ | ❌ |
| List lines as sentences (option) | ❌ | ✅ (always) | ❌ | ❌ |
| Average sentence length | ❌ | ⚠️ (readability) | ✅ | ❌ (empty) |
| Median sentence length | ❌ | ❌ | ✅ | ❌ |
| Longest / shortest sentence | ❌ | ❌ | ✅ | ✅ (longest list) |
| **Highlight sentences > N words** | ⚠️ (Pro suggestions) | ❌ | ❌ | ⚠️ (select longest) |
| Per-paragraph table | ❌ | ❌ | ❌ | ✅ |
| Paragraph mode (blank line vs every line) | ❌ | n/a | ❌ | ✅ (contradictory) |
| Readability grade | ⚠️ | ⚠️ (inconsistent) | ❌ | ❌ |
| Privacy (local) | ❌ | ? | ❌ | ✅ |

---

## 3. Feature matrix: content and trust

| Item | Grammarly | ConvertCase | CharacterCounter | WordCount.com |
|---|---|---|---|---|
| Detection rules documented | ❌ | ✅ | ❌ | ❌ |
| Paragraph defined | ❌ | n/a | ❌ | ⚠️ (contradictory) |
| Sentence / paragraph length advice | ✅ (by type, mixed units) | ✅ (inconsistent grades) | ✅ ("long isn't bad") | ⚠️ (40–100 vs 75–150 conflict) |
| FAQ count | 7 | 7 | 10 | 5 (FAQPage) |
| Named author | ❌ | ⚠️ ("Concept by …") | ❌ | ❌ |
| Date | ❌ | ⚠️ (Sep vs Nov 2026) | ❌ | ❌ |
| Promotion | heavy Pro upsell | ad-free upsell | internal links | — |

---

## 4. Competitor-by-competitor detail

### 1. Grammarly: Free paragraph counter
- **Advice:** paragraph length by content type.
  - Blogs: 2–4 sentences.
  - Business: 2–5.
  - Social: 1–3.
  - Academic: 100–200 *words*. This switches unit from sentences to words.
- **FAQs (7):**
  1. What it is
  2. When to use it
  3. How to use it
  4. Ideal length
  5. Counting sentences per paragraph
  6. Difference from a word counter
  7. AI tools
- **Weak points:**
  - The editor didn't load, so the tool couldn't be verified.
  - No definitions.
  - Grammar error ("…counter seamlessly with…").
  - Unverified "40 million users" claim.
  - Heavy promotion.

### 2. ConvertCase: Online Sentence Counter (rules benchmark)
- **Rules:** documented in full (see §1).
- **Abbreviation gaps:** "etc." and "Inc." before a capitalised word will split.
- **Weak points:**
  - Readability guidance contradicts itself (Grade 8 vs the 15–20-word bands).
  - Unsourced claims about Flesch-Kincaid and other platforms.
  - Two FAQ answers overlap.
  - Two different "last reviewed/updated" dates.

### 3. CharacterCounter.com: Sentence Counter
- **Stats:** sentences, average, median, longest and shortest (primarily by words), sentences per paragraph.
- **FAQs (10):** counting, averages, median ✔, longest, punctuation, scale, run-ons.
- **Weak points:**
  - Claims to handle abbreviations, decimals and URLs but doesn't explain how.
  - "Primarily" by word count is never defined.
  - Paragraph detection not explained.
  - No author or date.

### 4. WordCount.com: Paragraph Counter
- **Stats:** paragraphs, words, characters, sentences, lines.
- **Features:** per-paragraph table, longest-sentences list, click-to-select, blank-line or every-line toggle, local draft.
- **Errors:**
  - Paragraph definitions conflict.
  - Empty "Averages" section.
  - FAQ (40–100 words per paragraph) contradicts the table (75–150).
  - Edge-case chips render as "** **".
  - The `&amp;` entity shows in the title.

---

## 5. Patterns

**Sentence segmentation (our engine)**
1. Start with `Intl.Segmenter(locale, {granularity:'sentence'})`.
2. Post-process to **merge splits after known abbreviations**. Use an editable list, defaulting to Mr, Mrs, Ms, Dr, Prof, Sr, Jr, St, vs, etc, e.g, i.e, Inc, Ltd, Co, No (before a digit) and month abbreviations.
3. Also merge splits after:
   - single initials ("J. K.")
   - decimals ("3.14")
   - URLs and emails
   - ellipses followed by a lowercase letter
4. Option: treat each line of a list as a sentence.
5. Terminal marks in other scripts: 。！？ । ؟ ;
6. `TODO(owner)`: test the engine against an annotated corpus sample (e.g. a few hundred hand-labelled sentences we write ourselves).

**Paragraphs:** blocks separated by ≥1 blank line (default), or every non-empty line (toggle). State the rule in the UI.

**Lines:** split on CRLF, LF or CR.

**Statistics:**
- sentence length (in words): mean, median, min, max
- distribution histogram
- sentences per paragraph
- highlight sentences longer than N words (default 25, editable)

**Readability (optional, to cite):**
- Flesch Reading Ease and Flesch–Kincaid Grade, with the formulas shown.
- Syllable counting is approximate; label it so.
- `TODO(owner)`: decide whether to include readability; if so, cite the original Flesch / Kincaid formulas.

**Length advice:** no invented rules. If we give a recommended sentence or paragraph length, cite a style guide (e.g. Plain Language guidelines, plainlanguage.gov). `TODO(owner)`.

**Coverage across the 4 competitors**

| Section | Pages (of 4) |
|---|:---:|
| Rules documented | 1 |
| Abbreviation handling (claimed or real) | 2 |
| Median | 1 |
| Highlight long sentences | **0** (explicit, free) |
| Editable abbreviations | **0** |
| Paragraph rule clear | **0** |

---

## 6. FAQ question bank

★ = asked on 2 or more pages, or a cluster keyword. Map to the 12-keyword cluster.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How do I count sentences in my text? | all · `sentence counter`, `count sentences` |
| 2 | ★ How many sentences are in a paragraph? | Grammarly, CharacterCounter |
| 3 | ★ How long should a sentence be? | ConvertCase, CharacterCounter · `how long should a sentence be` |
| 4 | ★ How does the counter handle "Mr." or "3.14"? | ConvertCase, CharacterCounter |
| 5 | What counts as a paragraph? | WordCount (conflicting) · `paragraph number` |
| 6 | How long is 20 sentences? | `how long is 20 sentences` |
| 7 | How long is a sentence (in words)? | `how long is a sentence` |
| 8 | What is the average or median sentence length? | CharacterCounter |
| 9 | What is a run-on sentence? | CharacterCounter |
| 10 | How do I count lines? | `lines counter` |

---

## 7. Gaps nobody fills — our opportunities

1. **Documented, editable sentence rules:**
   - abbreviation list, initials, decimals, URLs, ellipses
   - option to count list lines as sentences
   - terminal marks for other scripts
2. **Clear paragraph and line definitions**, with a toggle.
3. **Full statistics:** mean, median, longest and shortest sentence, a histogram, and sentences per paragraph.
4. **Long-sentence highlighting** above N words, with click-to-jump (keyword file).
5. **Optional readability scores** with the formulas cited.
6. **"How long is 20 sentences / a sentence" answers**, expressed in words and in reading time. Labelled as averages.
7. **Privacy:** text stays in the browser.
8. **Links:** Word Counter (#6), Character Counter (#5), Words to Pages (#1) for its paragraph estimates, Reading Time (#7).

---

## 8. Blueprint for the KKCTools Sentence & Paragraph Counter

### 8.1 SEO

- **URL:** `/sentence-counter/`
- **Title:** Sentence Counter – Count Sentences and Paragraphs
- **H1:** Sentence Counter: Count Sentences, Paragraphs and Lines
- **Meta:** as in the keyword file (146 chars).
- **Misspellings to avoid in copy:** `sentance counter`, `sentence coutner`.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Counts | Sentences, paragraphs, lines, words |
| Rules | Abbreviation list (editable), initials, decimals, URLs, ellipses, list-line option, multilingual marks |
| Stats | Mean/median/min/max sentence length, histogram, sentences per paragraph |
| Highlight | Sentences > N words (default 25), click to jump |
| Readability | Optional, formulas cited |
| UX | Local only, copy stats, no network |

### 8.3 Content outline (≈ 1,100–1,400 words, original)

1. Intro (primary keyword)
2. How to use
3. How sentences are counted (rules and edge cases)
4. What counts as a paragraph or a line
5. How long should a sentence be? (cited guidance)
6. How many sentences make a paragraph?
7. Spotting long sentences
8. (Optional) Readability scores explained
9. FAQ (10)
10. Related tools: Word Counter (#6), Character Counter (#5), Words to Pages (#1), Reading Time (#7)

### 8.4 Quality checks

- **Unit tests:** an abbreviation test suite; decimals; URLs and emails; ellipses; quotes and brackets; list lines; CJK and Hindi; CRLF.
- **Accuracy check** against our own hand-labelled sample (`TODO(owner)`).
- No competitor wording copied. `npm run check:no-network` passes.
- **`TODO(owner)`:** pull Google top 10; check QuillBot manually; decide on readability; cite the length guidance.
