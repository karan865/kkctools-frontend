# Word Counter — Competitor Analysis

> **Target page:** KKCTools `/word-counter/` (Batch 6, Tool #6 🟡)
> **Primary keyword:** `word counter free`: US 4,400 · KD 3. Cluster of 21 keywords, 61,840 US vol. About 40,000 of that is Google Docs / Word how-to searches, e.g. `how to check word count on google docs` (9,900) and `how to show word count on google docs` (8,100).
> **SERP source:** ⚠ No Semrush SERP export for Batch 6. Competitors are the known category leaders plus Google's own help page. `TODO(owner): pull Google top 10 for "word counter free" and "essay word counter".`
> **Pages visited:** 2026-11-14. 5 read:
> - WordCounter.net
> - WordCount.com
> - CalculatorSoup word counter
> - CountWordsFree
> - Google Docs Help, used as the authority for the how-to H2s

---

## 0. How this was collected (read first)

- **Who ranks:** exact-match leaders (WordCounter.net, WordCount.com, CountWordsFree), CalculatorSoup, and Google Help for the how-to queries.
- **Keyword-file rule:** **one shared component, two URLs** (Character Counter #5 and Word Counter #6). They get different defaults and **completely different articles**. If the SERP shows one page ranking for both, merge them.
- **Do not use these misspellings in copy:** `word coutner`, `word countre`, `word countwr`.
- **`word checker` (8,100) is ambiguous.** It may mean spell check. Note it, but don't target it.
- **Google Docs facts come from Google Help:**
  - Tools → Word count.
  - The "Display word count while typing" option.
  - The count excludes headers, footers and footnotes.
  - The shortcut was **not shown** on the help page. The keyword file says Ctrl+Shift+C. `TODO(owner)`: verify the shortcut on Windows and Mac before publishing.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | wordcounter.net | Exact-match leader | WordCounter – Count Words & Correct Writing (no H1) | 250–300 |
| 2 | wordcount.com | Exact-match tool | Word Count — Free Online Word Counter, No Signup | ~1,000 |
| 3 | calculatorsoup.com/calculators/statistics/word-counter.php | Calc giant | Word Counter | short |
| 4 | countwordsfree.com | Exact-match tool | Word Counter (Words and Characters Counter) | ~850 |
| 5 | support.google.com/docs/answer/39003 | Google Help (authority) | See the number of words in your document | reference |

**What this tells us:**
- **WordCounter.net is the incumbent.**
  - It has goal min/max for words, characters, sentences, paragraphs, pages, reading time and speaking time.
  - It has keyword density (×1/×2/×3), autosave, a Flow Score and a grammar add-on.
  - **Weak points:** no H1, heavy Grammarly upselling, autosave messages that contradict each other, no FAQ.
- **WordCount.com is the best modern tool.** Its advantages:
  - essay goal presets, including a Common App value of 650
  - unique words, longest sentence and keyword density
  - file import (.docx, .pdf, .odt, .rtf, .txt, .md)
  - **in-browser privacy**
  - 7 FAQs marked up with schema
  - **Weak points:** doesn't say what wpm its time estimates use; no stop-word filter; how-to content only links out; "never stored" conflicts with its local drafts.
- **CalculatorSoup has the clearest word-definition rules.**
  - Numbers count as words. Standalone symbols don't.
  - A true hyphen joins a word; an em dash splits it.
  - A true apostrophe keeps a contraction as one word.
  - Its stop-word option applies only to the density chart.
- **Nobody offers all of these together:**
  - an ignore list you can edit
  - reading and speaking time at **cited, editable** wpm
  - an essay limit bar
  - correct counts when text is pasted from Docs or Word (smart quotes, en/em dashes, NBSP)
  - **accurate, step-by-step how-to H2s** for Google Docs, Word and Pages on desktop and mobile

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | WordCounter.net | WordCount.com | CalcSoup | CountWordsFree |
|---|---|---|---|---|
| Words, characters, sentences, paragraphs | ✅ | ✅ | ⚠️ (words, characters, spaces) | ✅ |
| Unique words | ❌ | ✅ | ✅ | ⚠️ |
| Reading / speaking time | ✅ (wpm not stated) | ✅ (wpm not stated) | ❌ | ⚠️ |
| Goal / limit bar (essay mode) | ✅ (min/max, many metrics) | ✅ (presets 250–1,500, 650) | ❌ | ❌ |
| Keyword density ×1/×2/×3 | ✅ | ✅ | ✅ (×1) | ⚠️ (phrase table) |
| Stop-word / ignore list | ❌ | ❌ | ✅ (Semrush list, chart only) | ✅ (example) |
| Editable ignore list | ❌ | ❌ | ❌ | ❌ |
| Word-definition rules stated | ❌ | ❌ | ✅ | ❌ |
| Smart-quote / dash handling stated | ❌ | ⚠️ ("formatting removed" on import) | ✅ (hyphen vs em dash) | ❌ |
| Longest sentence / readability | ⚠️ (Flow Score) | ✅ (longest sentence) | ❌ | ❌ |
| File import | ❌ | ✅ (formats listed inconsistently) | ❌ | ✅ (+ URL load, network) |
| Autosave / local drafts | ⚠️ (off by default, sign-in) | ✅ (local) | ❌ | ❌ |
| Privacy (local only) stated | ❌ | ✅ (conflicting wording) | ❌ | ❌ (no privacy policy) |
| Grammar / spell check | ⚠️ (Grammarly) | ❌ | ❌ | ⚠️ |

---

## 3. Feature matrix — content and trust

| Item | WordCounter.net | WordCount.com | CalcSoup | CountWordsFree |
|---|---|---|---|---|
| Google Docs / Word how-to | ❌ | ⚠️ (links out) | ❌ | ❌ |
| What counts as a word | ❌ | ⚠️ | ✅ | ⚠️ |
| Essay / application length guidance | ❌ | ⚠️ (presets, unsourced) | ❌ | ❌ |
| FAQ count | 0 | 7 (FAQPage) | 0 | 0 |
| Named author | ❌ | ❌ | ✅ | ❌ |
| Date | ❌ | ❌ | ✅ (Nov 2025) | ❌ (© 2015–2024) |
| Monetization / clutter | Grammarly heavy | upsell sync | AI-promo block | typos, `#` links |

---

## 4. Competitor-by-competitor detail

### 1. WordCounter.net (incumbent)
- **Features:**
  - Goals (min/max) for many metrics.
  - Keyword density ×1/2/3.
  - Autosave, which is off by default and also offered as a sign-in benefit.
  - Grammar checker (off by default; needs Grammarly).
  - Flow Score demo.
- **Weak points:**
  - No H1.
  - Heavy pop-up and Grammarly promotion.
  - No FAQ, author or date.
  - About 300 words of generic copy.
  - The sign-up flow is for EnglishGrammar.org, which is confusing.

### 2. WordCount.com
- **Stats:** words, characters, sentences, paragraphs, reading/speaking time, unique words, characters per word, longest sentence. Platform limits for X, IG and SMS.
- **Goal presets:** 250, 500, 1,000, 1,667 (unlabelled), 650 (Common App, unsourced) and 1,500.
- **Import:** .docx, .pdf, .odt, .rtf, .txt, .md. The second card lists fewer formats.
- **Privacy:** "runs in your browser". This conflicts with its local drafts.
- **FAQs:** 7, matching the schema. Two are near-duplicates.
- **Weak points:** wpm not disclosed; no stop-word filter; how-to only as links.

### 3. CalculatorSoup: Word Counter (Edward Furey, Nov 2025)
- **Rules:**
  - Words are letter or number groups.
  - "20" and "twenty" each count as one word.
  - Symbols don't count.
  - A true hyphen joins; an em dash splits.
  - A true apostrophe keeps a contraction as one word.
- **Density:** excludes numbers. An optional Semrush stop-word list (175+, linked out) applies to the chart only.
- **Weak points:** no example, no reading time; it's unclear whether stop words affect the total; encoding glitch note.

### 4. CountWordsFree
- **Features:**
  - Counts words, characters and phrases.
  - Load from disk (doc, docx, txt, pdf, "epubhtml" typo, odt) or from a URL, which needs a network call.
  - Voice input.
  - Its example King Lear excerpt is 28 words ✔.
- **Weak points:**
  - No privacy policy, even though it handles uploads and voice.
  - No FAQ, author or date.
  - Keyword-stuffed copy.
  - `#` links.

### 5. Google Docs Help: word count (authority for the how-to H2)
- **Desktop:** Tools → Word count shows pages, words, characters, and characters excluding spaces.
- **While typing:** tick "Display word count while typing". The count shows bottom-left.
- **Selection:** counts only the selected text.
- **What it skips:** headers, footers and footnotes by default.
- **Not stated on this page:** the keyboard shortcut and mobile steps. `TODO(owner)`: verify both.

---

## 5. Patterns

**Engine (shared with #5)**
- Words via `Intl.Segmenter('word')` with `isWordLike`.
- Normalise before counting:
  - smart quotes → straight quotes
  - en/em dash → separator
  - NBSP → space
  - soft hyphen → removed
- **Options:** count numbers as words (default on); count hyphenated words as one (default on).

**Reading and speaking time**
- Silent reading ≈ 238 wpm (Brysbaert 2019 meta-analysis). Speaking ≈ 130–150 wpm.
- `TODO(owner)`: confirm the citations (shared with the Reading Time tool, #7).
- Both rates are editable.

**Essay limit bar**
- Min, max or target.
- Show over and under counts, plus a progress bar.

**Keyword frequency**
- Top words and 2–3-word phrases, as counts and %.
- Editable ignore list (default English stop words, our own list).
- Case-insensitive, with an option for case-sensitive.

**How-to H2s (verified steps only)**
- Google Docs (desktop, Android, iOS)
- Microsoft Word (Windows, Mac, web: status bar, Review → Word Count)
- Apple Pages

**What the 4 competitors cover**

| Section | Pages (of 4) |
|---|:---:|
| Goals/limit bar | 2 |
| Keyword density | 4 |
| Editable ignore list | **0** |
| Cited wpm | **0** |
| Word rules stated | 1 |
| Docs/Word how-to | **0** on-page |
| Privacy stated | 1 |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword. Map to the 21-keyword cluster.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How do I check word count in Google Docs? | Google Help · `how to check word count on google docs` (9,900), `how to show…` (8,100) |
| 2 | ★ How do I see word count in Microsoft Word? | `how to check word count on word`, `how to show word count on word` |
| 3 | ★ What is the word count shortcut? | `word count shortcut` (verify) |
| 4 | ★ Is this word counter free / does it store my text? | WordCount.com |
| 5 | What counts as a word (numbers, hyphens, contractions)? | CalcSoup |
| 6 | How long does it take to read or say my text? | WordCounter, WordCount |
| 7 | Does Google Docs count footnotes and headers? | Google Help |
| 8 | How do I count words for an essay with a word limit? | `essay word counter` |
| 9 | Why does my count differ from Word or Docs? | — (gap) |
| 10 | What are stop words? | CalcSoup |

---

## 7. Gaps nobody fills — our opportunities

1. **Accurate, explained word rules.** Normalise text pasted from Docs/Word, with toggles for numbers and hyphens.
2. **An essay limit bar** with min, max and target.
3. **Reading and speaking time at cited, editable wpm.**
4. **Keyword frequency** for 1, 2 and 3-word phrases, with an **editable ignore list**.
5. **Verified how-to sections** for Google Docs, Word and Pages, on desktop and mobile, each with its source. This targets about 40k searches.
6. **"Why counts differ" section:** footnotes, headers, hyphens, numbers, URLs.
7. **Privacy:** local only. Opt-in drafts with a clear button, and wording that is consistent everywhere.
8. **A different article from #5** (keyword-file rule), with word-focused defaults.
9. **Links:** Words to Pages (#1), Reading Time (#7), Sentence Counter (#9), Keyword Density (#10), Character Counter (#5).

---

## 8. Blueprint for the KKCTools Word Counter

### 8.1 SEO

- **URL:** `/word-counter/`
- **Title:** Word Counter – Free Online Word Count Tool
- **H1:** Word Counter: Count Words, Characters and Reading Time
- **Meta:** as in the keyword file (158 chars).
- **H2s:**
  - Word count in Google Docs
  - Word count in Microsoft Word
  - Word count shortcut
  - Essay word counter

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Counts | Words, unique words, characters (±spaces), sentences, paragraphs, avg word/sentence length, longest sentence |
| Essay mode | Target/min/max → bar, over/under |
| Time | Reading + speaking (editable wpm, cited defaults) |
| Frequency | 1/2/3-word phrases, %, editable ignore list, case toggle |
| Rules | Normalise smart quotes/dashes/NBSP; numbers-as-words and hyphen toggles |
| Storage | Opt-in local draft, clear; privacy line |
| UX | No network; shared engine with #5 |

### 8.3 Content outline (≈ 1,400–1,700 words, original)

1. Intro (primary keyword) and privacy line
2. How to use
3. What counts as a word
4. Essay word limits: how to hit them
5. Reading and speaking time
6. Word count in Google Docs (desktop and mobile, verified)
7. Word count in Microsoft Word (Windows, Mac, web)
8. Word count shortcuts
9. Why different tools give different counts
10. FAQ (10)
11. Related tools: Words to Pages (#1), Reading Time (#7), Sentence Counter (#9), Keyword Density (#10)

### 8.4 Quality checks

- **Unit tests:**
  - contractions, hyphens vs em dashes
  - numbers, URLs, emails
  - CJK
  - smart quotes
  - large text performance
- **Parity check:** run 10 sample documents and compare against Google Docs and Word counts. Explain any difference. `TODO(owner)`: provide the documents.
- No competitor wording. `npm run check:no-network` passes.
- `TODO(owner)`:
  - pull Google top 10
  - verify the shortcuts and mobile steps
  - decide whether to merge with #5 if the SERP overlaps
