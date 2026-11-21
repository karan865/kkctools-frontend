# Word Counter — Build Spec

> **URL:** `/word-counter/` · Batch 6 · Tier 1 · **Build order 5**
> **Read first:** `../00_BATCH6_BUILD_RULES.md` (§2.4 word rules, §3 Google/Microsoft sources, §4 shared engine)
> **Inputs:** `06_Word_Counter_Competitor_Analysis.md`, keyword file §2 #6
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**The head `word counter` isn't in the exports (KD > 30), but the easy variants are:**
- `word counter free` **4,400 / KD 3** (primary);
- `essay word counter` 2,400 / KD 0;
- `word count checker online` 2,400 / KD 0.

**The how-to rows are ≈ 40,000 searches,** all about finding the count in Google Docs or Word (`how to check word count on google docs` 9,900; `how to show word count on google docs` 8,100; `how to see how many words in google docs` 2,400; `how to check word count on word` 2,400; `word count shortcut` 1,300). Google often answers these itself, but they give the article its H2s and its long-tail reach. **We now have the verified steps** (§3: Docs help 39003 and 179738, Microsoft "Show word count").

**Same shared engine as #5, a different page.** Keyword-file rule: different defaults and a **fully different article**:
- #5 is about characters, limits, bytes and Unicode;
- #6 is about words, essays, reading time, word frequency and the Docs/Word how-to.
- If the SERP pull shows one URL ranking for both heads, ask the owner about merging.

**Leaders are beatable on quality:** WordCounter.net has no H1 and pushes Grammarly; WordCount.com doesn't say what wpm it uses; nobody has an editable ignore list or an on-page Docs/Word how-to.

### Research notes from the competitor analysis

- **Pages read:** WordCounter.net, WordCount.com, CalculatorSoup, CountWordsFree, Google Docs Help (authority).
- **WordCounter.net:** goals for many metrics, keyword density ×1/2/3, autosave; **no H1**, Grammarly pop-ups, no FAQ, autosave messages that contradict each other, sign-up for a different site.
- **WordCount.com:** goal presets (250, 500, 1,000, 1,500, an unlabelled 1,667, and **650 "Common App", unsourced**), file import, in-browser privacy that conflicts with its local drafts, wpm not disclosed, how-to only as links.
- **CalculatorSoup** has the clearest rules (numbers are words, a hyphen joins, an em dash splits, an apostrophe keeps a contraction whole); stop words affect only the chart, and that isn't said clearly.
- **CountWordsFree:** loads from a URL (a network call), voice input, no privacy policy, keyword-stuffed copy.
- **0 of 4** have an editable ignore list, cited wpm or an on-page Docs/Word how-to.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | word counter free | 4,400 | 3 | title ("Free Online Word Count Tool"), H1 ("Word Counter"), first sentence ("free word counter") |
| Secondary | essay word counter | 2,400 | 0 | Essay tab + H2 "Essay word counter: hitting a word limit" |
| Secondary | word count checker online | 2,400 | 0 | intro, ToolShell heading |
| Secondary | how to check / show / view / find / do word count on google docs · how to see how many words in google docs · how to word count google docs · word count on docs · word counter google docs | 9,900 · 8,100 · 2,400 · 2,900 · 1,000 · 2,400 · 480 · 260 · 1,600 | 10–29 | H2 "How to check word count in Google Docs" (verified steps) |
| Secondary | how to check word count on word · how to show word count on word | 2,400 · 1,300 | 19–25 | H2 "How to check word count in Microsoft Word" (verified steps) |
| Secondary | word count shortcut | 1,300 | 18 | H2 "Word count shortcut" (Docs: Ctrl + Shift + C / ⌘ + Shift + C, verified; Word: **no shortcut published** unless verified) |
| Ambiguous | word checker | 8,100 | 5 | not targeted (spell-check intent); one mention at most |
| Never in copy | word coutner · word countre · word countwr · word count. | — | — | misspellings / odd forms |

## 2. Our edge

- **Stated, switchable word rules** (rules §2.4):
  - hyphenated words = 1 (toggle); numbers = words (toggle); contractions = 1;
  - smart quotes, en/em dashes, NBSP and soft hyphens from Docs/Word normalised first;
  - the rules are printed under the counts.
- **Essay tab:** target, minimum and maximum → a progress bar with "120 words to go" / "35 over".
- **Reading and speaking time** at editable wpm with the cited defaults from `reading-rates.ts` (shown only as "unverified estimate" until the owner confirms Brysbaert 2019).
- **Word frequency:** top words and 2- and 3-word phrases (count + %), an **editable ignore list** (our own stop words), case toggle, phrases never cross sentences.
- **More stats:** unique words, average word length, average sentence length, longest sentence (click to jump).
- **"Why my count differs from Docs or Word"** section: headers, footers and footnotes (Docs excludes them, §3), hyphens, numbers, URLs, em dashes.
- **Verified how-to steps** for Google Docs and Word, each with its source and checked date.
- **Privacy:** no upload, no URL fetching, no voice input; opt-in local draft only.

## 3. Calculator spec

### 3.1 Tabs

1. **Count** (default)
2. **Essay limit**
3. **Word frequency**
4. **Reading time** (summary; links to #7 for the full tool)

One text state across all tabs.

### 3.2 Input guide diagram (above the inputs)

`WordCountInputGuide.tsx`: one sample sentence with a bracket under each counted word.

- Sample: `It’s a well-known fact — numbers like 2,500 and e-mail count.`
- **Brackets numbered 1–10** under: It’s · a · well-known · fact · numbers · like · 2,500 · and · e-mail · count.
- **Callouts:**
  - "1 Contractions = 1 word" (It’s);
  - "2 Hyphenated = 1 word (toggle)" (well-known, e-mail);
  - "3 Numbers count (toggle)" (2,500);
  - "4 Dashes don't count" (—).
- **Result badge:** "10 words" (the raw `Intl.Segmenter` gives 12; checked with node).
- **Essay tab:** a bar with "Min", "Target", "Max" ticks.
- **Frequency tab:** a mini table with "Ignore list (edit)".
- Toggling an option redraws the brackets (e.g. hyphen join off → 12).

### 3.3 Inputs

| Field | Default |
|---|---|
| Text | our own 3-paragraph sample (~120 words) |
| Hyphenated words as one | on |
| Count numbers as words | on |
| Essay target / min / max | 500 / – / –; presets 250, 300, 500, 750, 1,000, 1,500, 2,000, custom (no school- or app-specific presets unless cited) |
| Reading / speaking wpm | from `reading-rates.ts` (editable) |
| Frequency: n-gram | 1 · 2 · 3 |
| Ignore list | default English stop words (ours, editable, Reset) · on |
| Case-sensitive | off |
| Keep draft on this device | off |

### 3.4 Engine (shared `text-engine.ts`)

```ts
words(t, {hyphenJoin, numbers})        // Intl word segments (isWordLike), then:
  // join A + "-" + B (no spaces) when hyphenJoin; keep ’/' contractions whole; drop number-only tokens if !numbers
uniqueWords = new Set(words.map(lower)).size
avgWordLength = letters / words ; avgSentenceLength = words / sentences
longestSentence = argmax(sentence word counts)
ngrams(words, n, {stopWords, caseSensitive, crossSentences:false}) → [{term, count, pct = count / totalWords × 100}]
essay: remaining = target - words ; status = under | within | over (min/max)
minutes(words, wpm) → mm:ss
```

**Worked examples (checked with node, 2026-11-22):**

| Text | Result |
|---|---|
| `It’s a well-known fact — numbers like 2,500 and e-mail count.` | **10 words** (hyphen join on; 12 raw segments with it off) |
| `The cat sat. The cat ran. A dog sat.` | **9 words**, 3 sentences, 6 unique words ignoring case; with stop words ignored: **cat 2, sat 2, ran 1, dog 1**; 2-word phrases: **"the cat" 2**, "cat sat", "cat ran", "a dog", "dog sat" (1 each); no "sat the" (phrases don't cross sentences) |
| Essay: 380 words, target 500 | **120 words to go** (76%) |
| Essay: 535 words, max 500 | **35 over** |
| 1,000 words at the reading-rate default 238 wpm (unverified) | 4:12 (shown with the "estimate" label until verified) |

### 3.5 Outputs

- **Stat tiles:** Words · Characters · Characters (no spaces) · Sentences · Paragraphs · Reading time.
- **Second row:** unique words · average word length · average sentence length · longest sentence.
- **Sentence:** "Your text has 10 words and 61 characters." (engine values for the user's text)
- **Rules line:** "Hyphenated words count as one. Numbers count as words. Change this in Options."
- **Essay:** progress bar, "to go / over", min-max status.
- **Frequency:** sortable table (term, count, %), copy as CSV text, the ignore-list editor.
- Copy stats, Clear, Share URL (settings only).
- Links: "How many pages is this?" → #1 (with the count prefilled via URL params, not the text); "Full reading and speaking time" → #7; "Check sentence lengths" → #9; "Keyword density" → #10.

### 3.6 Tests

- Contractions (straight and curly apostrophes), hyphens vs en/em dashes, numbers with commas and decimals, URLs and emails (1 word each), CJK (per the CJK option), smart quotes.
- Toggle effects (hyphen, numbers).
- n-grams don't cross sentences; stop words affect the table only (totals unchanged), and that is stated in the UI.
- Essay status for under/within/over.
- Empty text; 1 MB text performance.
- **Parity check (owner):** `TODO(owner)` count 10 sample documents in Google Docs and Word and record any differences and why (fixtures).
- The worked examples. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Word Counter – Free Online Word Count Tool` (42; 54 with the suffix: OK) |
| Meta | `Free word counter. Paste or type to count words, characters, sentences and paragraphs, see reading time and keyword frequency, and check against a word limit.` (158) |
| H1 | `Word Counter: Count Words, Characters and Reading Time` |
| BLUF | "Paste or type below and this free word counter shows words, characters, sentences, paragraphs and reading time as you write. Set an essay word limit to see how many words you have left. Hyphenated words count as one and numbers count as words; you can change both. Your text stays in this browser." |
| ToolShell pills | `Essay word limit bar`, `Reading & speaking time`, `Word frequency with ignore list`, `Text stays on your device` |
| Links out | Words to Pages (#1), Reading Time (#7), Sentence Counter (#9), Keyword Density (#10), Character Counter (#5) |
| Links in | #1, #5, #7, #9, #10, Tools hub "Text & Writing" |

## 5. Content (~1,500–1,800 words, original; different from #5)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the free word counter | 4 tabs, options, privacy | 120 |
| 2 | What counts as a word? | Our rules with the guide example (10 vs 12) | 170 |
| 3 | Essay word counter: hitting a word limit | Essay tab; trimming and padding tips (our own); no institution limits unless cited | 170 |
| 4 | Reading and speaking time | Method, editable wpm, source status; link #7 | 120 |
| 5 | Word frequency and repeated words | Ignore list, phrases; link #10 | 130 |
| 6 | How to check word count in Google Docs | Desktop: Tools → Word count (pages, words, characters, characters excluding spaces); "Display word count while typing"; selected text counts only the selection; headers, footers and footnotes excluded. Mobile steps only if verified (`TODO(owner)`) | 170 |
| 7 | How to check word count in Microsoft Word | Status bar shows the count; click it for the Word Count box (characters, lines, paragraphs); Mac: select text → Tools > Word Count | 140 |
| 8 | Word count shortcut | Docs: Ctrl + Shift + C (Windows/ChromeOS), ⌘ + Shift + C (Mac). Word: no shortcut stated on Microsoft's page (don't invent one) | 80 |
| 9 | Why word counts differ between tools | Headers/footnotes, hyphens, dashes, numbers, URLs | 150 |
| 10 | FAQ | §6 | 340 |

Each how-to H2 ends with "Source: Google Docs Help / Microsoft Support, checked 2026-11-22".

## 6. FAQ (10, from the competitor question bank + cluster keywords)

1. How do I check word count in Google Docs?
2. How do I see word count in Microsoft Word?
3. What is the word count shortcut?
4. Is this word counter free, and does it store my text?
5. What counts as a word (numbers, hyphens, contractions)?
6. How long does it take to read or say my text?
7. Does Google Docs count footnotes and headers? (no, by default)
8. How do I count words for an essay with a word limit?
9. Why does my count differ from Word or Google Docs?
10. What are stop words, and why ignore them in the frequency table?

## 7. Done when

- [ ] Shared engine word rules + tests; `npm run verify` passes.
- [ ] `stop-words-en.ts` written by us; ignore list editable and resettable.
- [ ] How-to steps match §3 sources exactly; nothing unverified published.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`; article fully different from #5.
- [ ] Registrations + docs; `graphify update .`.
