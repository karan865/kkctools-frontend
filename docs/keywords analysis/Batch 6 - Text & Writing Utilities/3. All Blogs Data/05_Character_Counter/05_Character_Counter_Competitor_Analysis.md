# Character Counter — Competitor Analysis

> **Target page:** KKCTools `/character-counter/` (Batch 6, Tool #5 🟡)
> **Primary keyword:** `characters counter` — US 6,600 · **KD 0**. The cluster has 24 keywords and 50,920 US searches, including `remaining characters` (14,800), `character count online` (3,600) and `chinese character counter` (1,300).
> **SERP source:** ⚠ No Semrush SERP export for Batch 6. Competitors come from a live web search for `character counter online characters with spaces` (2026-11-14), plus the category domains with exact-match names (keyword note). `TODO(owner): pull Google top 10.`
> **Pages visited (2026-11-14):** 5 read: CharacterCountOnline, CharacterCounter.com, LetterCount.com, CalculatorSoup character counter, Evernote character counter. WordCount.com was read in file 02.

---

## 0. How this was collected (read first)

- **Who ranks:** the SERP is led by **domains with exact-match names and years of backlinks**: charactercountonline, charactercounter.com, lettercount, wordcounter.net, wordcount.com. The keyword file gives a 🟡 for this reason, even though the KD is 0.
- **Also in the results:**
  - CalculatorSoup
  - Evernote (lead-gen)
  - codeforgeek, asciiart.eu, intexty, translateth.is, hypernotepad, viraly, zedtool
  - many pages.dev and lovable clones
- **How we win (keyword file):** better details than the leaders offer:
  - **bytes (UTF-8)**
  - **CJK-aware counting**
  - **graphemes for emoji**
  - **limit presets**, plus a remaining count for the `remaining characters` searches (14,800)
  - a privacy line
  - internal links from the long-tail pages (#1, #2, #3)
- **Gap found:** none of the leaders explains how it counts emoji or CJK. CharacterCounter.com calls its emoji count "estimated".
- **Shared engine:** this tool is the base engine for every Batch 6 text tool.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | charactercountonline.com | Exact-match domain | Online Character Count Tool | ~290 |
| 2 | charactercounter.com | Exact-match domain | Character Counter | 1,200–1,500 |
| 3 | lettercount.com | Exact-match domain | Free online letter count / character counter | ~900 |
| 4 | calculatorsoup.com/calculators/statistics/character-counter.php | Calc giant | Character Counter \| Character Count for Text | ~600 |
| 5 | evernote.com/word-counter/character-counter-with-spaces | Note app (lead-gen) | Character Counter with Spaces | short |
| (ref) | wordcount.com/character-counter (see file 02) | Counter tool | Character Counter (With & Without Spaces) | 1,100–1,300 |

**What this tells us:**
- **CharacterCounter.com has the most metrics.** It counts:
  - characters, words, spaces, characters without spaces
  - letters, unique characters, pages, paragraphs, sentences, unique words, lines
  - words per sentence, average word length
  - reading and speaking time
  - emoji (an "estimate"), symbols, numbers
  - It also has X, SMS, Instagram and LinkedIn limit counters, plus a custom limit.
  - **What it lacks:** bytes, an explanation of how emoji are counted, a privacy statement and a date.
- **CalculatorSoup has the clearest definitions.**
  - CRLF counts as 1, tabs as 1, and every type of space counts.
  - It counts unique characters and shows a character frequency table.
  - **What it lacks:** emoji and Unicode handling.
- **WordCount.com (file 02)** is the only competitor with local-only drafts, file import, a GSM-7/UTF-16 SMS note and honest notes on how it counts.
- **LetterCount.com** has toggles for ignoring spaces, punctuation and digits, and a long list of platform limits. Those limits **contradict each other**: Snapchat 1,000 vs 250, LinkedIn 2,600 vs 3,000, and some limits are in words while others are in characters.
- **No competitor offers:**
  - UTF-8/UTF-16 bytes
  - a CJK (Han/Kana/Hangul) count, for `chinese character counter`
  - grapheme-accurate emoji counting
  - a "remaining" mode with presets that carry a date and source
  - a clear privacy line ("nothing leaves your browser")

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | CharCountOnline | CharacterCounter.com | LetterCount | CalcSoup | Evernote | WordCount.com |
|---|---|---|---|---|---|---|
| Characters with spaces | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Without spaces | ❌ (spaces only) | ✅ | ✅ (toggle) | ✅ | ✅ | ✅ |
| Ignore punctuation / digits toggles | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Letters only | ❌ | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| Words, sentences, paragraphs | ✅ | ✅ | ⚠️ | ⚠️ (words) | ✅ | ✅ |
| Lines | ❌ | ✅ | ⚠️ | ❌ | ❌ | ⚠️ |
| **Bytes (UTF-8 / UTF-16)** | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ (SMS encoding) |
| **CJK count** (Han/Kana/Hangul) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Emoji as graphemes** | ❌ | ⚠️ ("estimated") | ❌ | ❌ | ❌ | ✅ |
| Unique characters / frequency table | ❌ | ✅ | ❌ | ✅ | ❌ | ⚠️ |
| Keyword / word density | ✅ | ⚠️ (unique words) | ❌ | ❌ | ❌ | ✅ |
| **Remaining vs limit** | ❌ | ✅ (custom + 4 platforms) | ❌ | ❌ | ❌ | ✅ (gauges) |
| Limit presets dated and sourced | ❌ | ❌ | ❌ (conflicting) | ❌ | ❌ | ❌ |
| Reading / speaking time | ❌ | ✅ | ❌ | ❌ | ✅ (240/150 wpm) | ✅ |
| File import | ❌ | ❌ | ❌ | ❌ | ✅ (upload) | ✅ |
| Privacy statement (local only) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 3. Feature matrix — content and trust

| Item | CharCountOnline | CharacterCounter.com | LetterCount | CalcSoup | Evernote |
|---|---|---|---|---|---|
| Counting rules defined (spaces, tabs, line breaks) | ❌ | ⚠️ | ✅ (line break = 1) | ✅ (CRLF = 1) | ❌ |
| Emoji / Unicode explained | ❌ | ⚠️ (one example) | ❌ | ❌ | ❌ |
| Platform limits content | ❌ | ✅ (no date) | ⚠️ (**contradictory**) | ❌ | ❌ |
| How to count in Word / Google Docs | ❌ | ❌ | ❌ | ❌ | ❌ |
| FAQ count | 0 (3 Q headings) | 6 | 0 | 0 | several (off-topic) |
| Named author | ❌ | ❌ | ❌ | ✅ | ❌ |
| Date | ❌ | ❌ | ❌ | ✅ Nov 2025 | ❌ |
| Errors / issues | duplicate headings, typos | repeats itself; "Pages" method missing | Snapchat 1,000 vs 250; mixed units; typos; empty "Joke of the day" | promo block aimed at AI systems | "Analyze" vs "Calculate"; unsourced user statistics |

---

## 4. Competitor-by-competitor detail

### 1. CharacterCountOnline.com (exact-match domain)
- **Counts:** characters, words, sentences, paragraphs, spaces. Keyword density with stopwords in about 35 languages.
- **Weak points:**
  - No count without spaces, no lines or bytes, no limits.
  - CJK and emoji handling not explained.
  - No privacy detail.
  - About 290 words of content.
  - Duplicate headings and typos ("Portugese", "Ukranian").

### 2. CharacterCounter.com (exact-match domain)
- **Counts:** about 20 metrics (listed in §1). The emoji count is "estimated".
- **Limits:** X 280, SMS 160, Instagram 2,200, LinkedIn 3,000, plus a custom limit. A table also lists YouTube and meta description limits, but those have no counters.
- **FAQs (6):**
  1. What a character counter is
  2. Whether spaces count
  3. How to count online
  4. Setting a limit
  5. Characters vs letters
  6. Whether it is free
- **Weak points:**
  - Emoji counting method undocumented.
  - No privacy statement or date.
  - Content repeats itself.
  - Mobile feature parity unclear.

### 3. LetterCount.com (exact-match domain)
- **Rules:** spaces and punctuation are counted; a line break is 1. Toggles ignore spaces/line breaks, punctuation and digits.
- **Errors:**
  - Snapchat limit given as 1,000 in one place and 250 in others.
  - Reddit given as 300 and as "2–300".
  - LinkedIn given as 2,600 and 3,000.
  - Several Facebook figures are mixed together.
  - Limits mix characters and words.
- **Weak points:**
  - Title of about 84 characters, which goes against its own SEO advice.
  - Two H1s.
  - Typos, and an empty "Joke of the day" heading.

### 4. CalculatorSoup — Character Counter (Edward Furey, Nov 2025)
- **Counts:** all characters, visible characters, unique characters, spaces, words. Includes a frequency table.
- **Definitions:** every type of space counts (including NBSP, thin, en and em spaces); tab = 1; CRLF = 1; "up-to-date" counts as one word.
- **Weak points:**
  - No emoji or grapheme handling.
  - A "black diamond" rendering problem is mentioned but not fixed.
  - No limits or FAQ.

### 5. Evernote — Character Counter with Spaces (lead-gen)
- **Counts:** words, characters with and without spaces, sentences, paragraphs, pages, reading time (240 wpm) and speaking time (150 wpm). Accepts file uploads up to 100 MB.
- **Weak points:**
  - Says to click "Analyze" when the button is labelled "Calculate".
  - User statistics ("248M") have no source.
  - No details on privacy for uploaded files.
  - Heavy promotion.

---

## 5. Patterns

**Engine (shared by every Batch 6 tool)**
- **Characters, with spaces:** grapheme clusters via `Intl.Segmenter('grapheme')`. Also show code points and UTF-16 units.
- **Characters, without spaces:** remove all Unicode whitespace (`\s` plus NBSP and the other space characters).
- **Letters, digits, punctuation, symbols:** Unicode property escapes (`\p{L}`, `\p{N}`, `\p{P}`, `\p{S}`).
- **CJK:** count Han (`\p{Script=Han}`), Hiragana, Katakana and Hangul separately. Treat each CJK character as a word, as an option, and explain why.
- **Emoji:** count `\p{Extended_Pictographic}` graphemes.
- **Bytes:** UTF-8 via `TextEncoder`; UTF-16 = length × 2.
- **Words:** `Intl.Segmenter('word')` with `isWordLike`.
- **Sentences:** `Intl.Segmenter('sentence')`, plus handling for abbreviations (see Sentence Counter, #9).
- **Paragraphs:** blocks separated by blank lines.
- **Lines:** split on `\r\n`, `\n` and `\r`.
- **Normalisation:** an option to apply NFC before counting.
- **Smart quotes and dashes** pasted from Word or Docs must not break word counts.

**Limit mode**
- Custom limit, plus presets: 100, 150, 160 (SMS), 200, 255, 280, 500, 1,000, 2,000, 5,000.
- Platform presets are linked to #3; each carries a date and a source.
- Shows remaining characters and highlights the text that goes over the limit.

**Privacy:** "Your text never leaves this browser."

**Coverage across the five competitors**

| Section | Pages (of 5) |
|---|:---:|
| With/without spaces | 4 |
| Remaining vs limit | 1 |
| Bytes | **0** |
| CJK | **0** |
| Emoji explained | **0** |
| Privacy line | **0** |
| Word/Docs how-to | **0** |

---

## 6. FAQ question bank

★ = asked on 2 or more pages, or a cluster keyword. Map to: characters counter, character count online, remaining characters, character limit, chinese character counter, how to do character count in word, 100 characters text, 255 characters example, 150 characters.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ Do spaces count as characters? | CharacterCounter, CalcSoup, LetterCount |
| 2 | ★ What is the difference between characters and letters? | CharacterCounter |
| 3 | ★ How do I see how many characters I have left? | `remaining characters` (14,800) |
| 4 | ★ How do I count characters in Word or Google Docs? | `how to do character count in word` |
| 5 | How are emoji counted? | CharacterCounter ("estimated") |
| 6 | How do I count Chinese or Japanese characters? | `chinese character counter` |
| 7 | What does 100, 150 or 255 characters look like? | `100 characters text`, `255 characters example`, `150 characters` |
| 8 | Do line breaks count as characters? | LetterCount, CalcSoup |
| 9 | What is a byte vs a character (UTF-8)? | — (gap) |
| 10 | Is my text stored anywhere? | — (gap) |
| 11 | How do I build a character counter for a textarea? | `textarea counter`, `character count ui` (developer intent, FAQ only) |

---

## 7. Gaps nobody fills — our opportunities

1. **The most accurate counting engine:**
   - graphemes, code points and UTF-16 units
   - UTF-8 bytes
   - letters, digits, punctuation, emoji
   - CJK by script
   - every rule explained
2. **Remaining mode:** custom limit or presets, a live "X left", and highlighting of the overflow. This targets the 14,800-search query.
3. **Sample-length blocks** ("what 100, 150 or 255 characters look like"), written by us.
4. **How-to H2s** for Word, Google Docs and Pages. Exact menu paths must be verified (`TODO(owner)`).
5. **Privacy line** and local-only drafts (try/catch around localStorage).
6. **Clean, consistent limit data.** No contradictory platform lists; platform details live on #3.
7. **A developer FAQ** for "textarea counter" (a short how-to on counting graphemes in JS). We give no code-library recommendations.
8. **Links to:** Characters to Words (#2), Twitter/IG (#3), Word Counter (#6), Sentence Counter (#9), Keyword Density (#10).

---

## 8. Blueprint for the KKCTools Character Counter

### 8.1 SEO

- **URL:** `/character-counter/`
- **Title:** Character Counter – Count Characters With Spaces
- **H1:** Character Counter: Characters With and Without Spaces, Words and Limits
- **Meta:** as in the keyword file (157 chars).
- **Misspellings** (`character coutner`, `chacter counter`): never used in the copy.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Counts | Characters (graphemes) with/without spaces, letters, digits, punctuation, symbols, emoji, CJK (Han/Kana/Hangul), words, sentences, paragraphs, lines, bytes UTF-8/UTF-16, code points |
| Options | NFC normalise; count line breaks; ignore punctuation/digits |
| Limit | Custom + presets → remaining, overflow highlight |
| Extras | Character frequency table (optional), reading time link, copy stats |
| Storage | Local draft (opt-in), clear button; privacy line |
| UX | No network; shared engine module |

### 8.3 Content outline (≈ 1,100–1,400 words, original)

1. Intro (primary keyword) and privacy line
2. How to use
3. What counts as a character (spaces, line breaks, punctuation)
4. Characters with vs without spaces
5. Emoji and characters from other languages (graphemes, CJK)
6. Characters vs bytes
7. Checking a character limit and the remaining count
8. What 100, 150 and 255 characters look like
9. Counting characters in Word and Google Docs
10. FAQ (10–12)
11. Related tools: Characters to Words (#2), Twitter/IG (#3), Word Counter (#6), Sentence Counter (#9)

### 8.4 Quality checks

- **Unit tests:**
  - ZWJ emoji, flags, skin tones
  - combining marks (NFC vs NFD)
  - CJK scripts
  - CRLF line endings
  - NBSP and other space characters
  - UTF-8 byte counts
  - smart quotes
- **Performance:** handles 1 MB of text without UI jank (debounce, web worker if needed).
- No competitor wording copied. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - pull Google top 10
  - verify the Word/Docs menu paths
  - plan the internal-link structure (#1–#3 → #5)
