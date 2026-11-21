# Character Counter — Build Spec

> **URL:** `/character-counter/` · Batch 6 · Tier 1 · **Build order 1** (builds the shared text engine)
> **Read first:** `../00_BATCH6_BUILD_RULES.md` (§2 accuracy, §3 sources, §4 shared code)
> **Inputs:** `05_Character_Counter_Competitor_Analysis.md`, keyword file §2 #5
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**The prize:** the exact tool terms sit at **KD 0–11**:
- `characters counter` 6,600 / KD 0;
- `character count online` 3,600 / KD 0;
- `online character counter` 2,900 / KD 0;
- `character count tool` 2,900 / KD 9, rising.

`remaining characters` (14,800 / KD 25) is the biggest single row. It is a **limit-mode** search, so the limit bar is not an extra; it is half the page.

**Why it's 🟡:** exact-match domains (charactercountonline, charactercounter.com, lettercount) hold the top spots on years of links, not on quality.

**How we beat them:** be the most *correct* counter and explain every rule. None of the five leaders:
- counts UTF-8 bytes;
- counts CJK by script (`chinese character counter` 1,300 / KD 7);
- explains how emoji are counted (CharacterCounter.com calls its emoji figure "estimated");
- has a privacy line;
- has on-page Word / Google Docs steps.

**This page also builds the shared engine** (`text-engine.ts`) that #1, #2, #3, #6, #7, #9 and #10 reuse. Build it carefully; six pages inherit its bugs.

### Research notes from the competitor analysis

- **Pages read:**
  - CharacterCountOnline.com (~290 words, typos, no count without spaces);
  - CharacterCounter.com (~20 metrics, "estimated" emoji, no privacy line, no date);
  - LetterCount.com (ignore toggles, but **contradicting limits**);
  - CalculatorSoup (clearest definitions: CRLF = 1, tab = 1, NBSP counts; no emoji handling);
  - Evernote (lead-gen; tells users to click "Analyze" when the button says "Calculate").
- **Errors we must not repeat** (LetterCount): Snapchat given as 1,000 and 250, LinkedIn as 2,600 and 3,000, Reddit as 300 and "2–300", and limits that mix words and characters.
  - Our fix: platform limits come only from `text-limits.ts`, each with a source and a checked date; unverified ones are labelled.
- CalculatorSoup's rule that CRLF = 1 matches Unicode grapheme rules (CR LF is one grapheme cluster), so our grapheme count agrees with it.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | characters counter | 6,600 | 0 | title ("Character Counter"), H1, first sentence, ToolShell heading |
| Secondary | character count online · online character counter · online character count | 3,600 · 2,900 · 1,600 | 0 | first paragraph, H2 "How to use the online character counter" |
| Secondary | character count tool · character counts · check character count | 2,900 · 2,400 · 320 | 6–9 | intro, HowWeCalculate, FAQ 1 |
| Secondary | word count character count | 2,400 | 1 | stat tiles label "Words" next to "Characters"; H2 "Characters vs words"; link to #6 |
| Secondary | remaining characters | 14,800 | 25 | **limit mode** label "characters remaining"; H2 "How many characters do I have left?" |
| Secondary | character limit · counter 1000 · counter 200 | 1,000 · 1,000 · 480 | 5–12 | limit presets (200, 1,000); H2 "Checking a character limit" |
| Secondary | chinese character counter | 1,300 | 7 | CJK tile + H2 "Counting Chinese, Japanese and Korean characters" |
| Secondary | 100 characters text · 255 characters example · 150 characters | 1,000 · 320 · 880 | 7–17 | sample-length blocks section |
| Secondary | how to do character count in word | 880 | 7 | H2 "Character count in Word and Google Docs" |
| Secondary | paragraph character | 2,400 | 23 | paragraphs tile + per-paragraph character list |
| FAQ only | textarea counter · character count ui · character counter ui | 1,000 · 320 · 260 | 9–16 | one developer FAQ (counting graphemes in JavaScript) |
| Never in copy | character coutner · chacter counter · charactercounter | — | — | misspellings / run-together; the H1 already matches them |

## 2. Our edge

- **Unicode-correct characters:** grapheme clusters, so 👍🏽 is 1 and 👨‍👩‍👧‍👦 is 1. Code points, UTF-16 units and UTF-8 bytes are shown beside it with a one-line explanation of each.
- **Without spaces** removes every Unicode space (space, tab, NBSP, thin/en/em spaces, line breaks).
- **Class breakdown:** letters, digits, punctuation, symbols, spaces, emoji.
- **CJK by script:** Han, Hiragana, Katakana, Hangul, each counted.
- **Words, sentences, paragraphs, lines** from the shared rules.
- **Limit mode:** custom limit or presets, a live "X characters left" or "X over", a progress ring, and the **overflow highlighted** in the text.
  - Count against graphemes (default), characters without spaces, UTF-8 bytes or words (dropdown), because forms differ.
- **Per-paragraph character list** (`paragraph character`): each paragraph's length, so long ones stand out.
- **Optional character frequency table** (top 20, case toggle).
- **Sample-length blocks** for 100, 150 and 255 characters, written by us and exact to the character (tested).
- **Privacy line**, no upload, opt-in local draft.
- **Platform presets** link to #3 for X-weighted counting.

## 3. Calculator spec

### 3.1 Tabs

1. **Count** (default): textarea + all counts.
2. **Limit**: the same textarea with the limit bar on top (shares state with Count; the tab only changes the layout).
3. **Details**: class breakdown, scripts, bytes, frequency table, per-paragraph list.

All three tabs share one text state; switching tabs never clears the text.

### 3.2 Input guide diagram (above the inputs)

`CharacterInputGuide.tsx`: one sample line, drawn as text with brackets underneath.

- Sample: `Hi 👋🏽 café.` (our own).
- **Brackets:**
  - "1 Characters: 10 (👋🏽 counts as 1)";
  - "2 Without spaces: 8";
  - "3 Bytes: 18 (emoji and é use more bytes)".
  - Checked with node: 10 graphemes, 8 without spaces, 18 UTF-8 bytes. Make it a unit test.
- **Limit tab:** a bar with "4 Your limit" and "5 Characters left".
- **Live mode:** once the user types, the brackets show the user's own first line (truncated to 40 graphemes).
- The focused option highlights its callout.

### 3.3 Inputs

| Field | Default |
|---|---|
| Text | sample text: `The quick brown fox jumps over the lazy dog.` (already counted on load) |
| Normalise (NFC) | on |
| Count line breaks as characters | on |
| Ignore toggles | punctuation, digits (both off) |
| Limit | off; presets 100, 150, 160, 200, 255, 280, 500, 1,000, 2,000, 5,000, custom; platform presets from `text-limits.ts` (verified only, labelled with source) |
| Limit unit | characters (graphemes) · without spaces · UTF-8 bytes · words |
| CJK words | count each CJK character as a word: off (explained in a tooltip) |
| Keep draft on this device | off |

### 3.4 Engine (`src/lib/text-engine.ts`, shared)

```ts
normalizeText(t, {nfc:true})            // NFC; keep the original for highlighting offsets
graphemes(t)   = [...new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(t)].length
charsNoSpaces  = graphemes(t.replace(/[\s  -​  　﻿]/gu, ''))
codePoints     = [...t].length ; utf16Units = t.length ; utf8Bytes = new TextEncoder().encode(t).length
classCounts    : per grapheme → letter \p{L} | digit \p{N} | punctuation \p{P} | symbol \p{S} | space \s | emoji
emojiCount     : graphemes matching \p{Extended_Pictographic} or a Regional_Indicator pair
scriptCounts   : \p{Script=Han} | \p{Script=Hiragana} | \p{Script=Katakana} | \p{Script=Hangul}
words(t, {hyphenJoin:true, numbers:true, cjkPerChar:false})   // Intl word segments with isWordLike, then merge "a-b" and "it’s"
sentences(t)   : Intl sentence segments + abbreviation/initial/decimal merge (see #9 spec §3.4)
paragraphs(t)  = t.split(/\r?\n\s*\r?\n/).filter(p => p.trim()).length
lines(t)       = t === '' ? 0 : t.split(/\r\n|\n|\r/).length
remaining(limit, count) = limit - count       // negative → "over by"
overflowStart(t, limit, unit) → index where the text passes the limit (for the highlight)
```

**Worked examples (checked with node, 2026-11-22):**

| Text | Result |
|---|---|
| `The quick brown fox jumps over the lazy dog.` | **44** characters · **36** without spaces · **9** words · 1 sentence · limit 500 → **456 left** |
| `Café ☕ costs ₹250.` + blank line + `日本語 text 👍🏽!` | **31** characters · **24** without spaces · 32 code points · 34 UTF-16 · **49** UTF-8 bytes · Han **3** · emoji **2** · 2 paragraphs · 3 lines · words **5** (7 with CJK-per-character on) |
| `👨‍👩‍👧‍👦` | **1** character · 7 code points · 11 UTF-16 · 25 UTF-8 bytes |
| `cafe` + U+0301 (NFD) | **4** characters either way; 5 code points before NFC, 4 after |

### 3.5 Outputs

- **Stat tiles (headline):** Characters · Without spaces · Words · Sentences · Paragraphs · Lines.
- **Second row:** UTF-8 bytes · Emoji · Letters · Digits · Punctuation/Symbols · CJK (shown only when > 0).
- **Sentence:** "Your text has 44 characters (36 without spaces) and 9 words."
- **Limit mode:** ring + "456 characters left of 500" or "12 characters over the limit"; overflow highlighted in red-token background inside a mirrored overlay of the textarea.
- **Details tab:** per-paragraph character list, frequency table, the four length units with one-line explanations.
- **Copy stats** (plain-text summary), Clear, Share URL (settings only, **never the text**).
- Links: "Count for X (links = 23, emoji = 2)" → #3; "How many words is this many characters?" → #2.

### 3.6 Tests

- ZWJ families, flags, skin tones, keycaps (`1️⃣`).
- NFC vs NFD; combining marks.
- CJK scripts and the CJK-per-character word option.
- CRLF, CR, LF; tabs; NBSP and the other spaces in the regex.
- UTF-8 bytes for ASCII, é, ₹, 日, emoji.
- Smart quotes and em dashes don't change the word count.
- Overflow index for each limit unit.
- Sample-length blocks are exactly 100, 150 and 255 characters.
- Empty text → all zeros, no `NaN`.
- 1 MB paste: counts update within the debounce without blocking typing (perf test or manual note).
- The worked examples. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Character Counter – Count Characters With Spaces` (48; 60 with the suffix: OK) |
| Meta | `Free character counter. Paste text to count characters with and without spaces, words, sentences and lines, and see how many characters are left for a limit.` (157) |
| H1 | `Character Counter: Characters With and Without Spaces, Words and Limits` |
| BLUF | "Paste or type below and the character counter updates as you go: characters with and without spaces, words, sentences, lines and UTF-8 bytes. Set a limit to see how many characters are left. Emoji count as one character each, the way people see them. Your text never leaves this browser." |
| ToolShell pills | `Counts emoji correctly`, `Characters left for any limit`, `Bytes & CJK counts`, `Text stays on your device` |
| Links out | Characters to Words (#2), Twitter/IG Counter (#3), Word Counter (#6), Sentence Counter (#9), Keyword Density (#10) |
| Links in | #1, #2, #3, #6, #9, #10, Tools hub "Text & Writing" |

## 5. Content (~1,200–1,500 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the online character counter | Tabs, limit, options; privacy line | 120 |
| 2 | What counts as a character? | Spaces, line breaks, tabs, punctuation (our rules, CRLF = 1) | 150 |
| 3 | Characters with and without spaces | Example from the engine; when forms use which | 120 |
| 4 | How many characters do I have left? | Limit mode, units (`remaining characters`) | 130 |
| 5 | Emoji and accented letters | Graphemes vs code points vs UTF-16, with the family-emoji example | 150 |
| 6 | Counting Chinese, Japanese and Korean characters | Script counts, CJK-as-words option (`chinese character counter`) | 120 |
| 7 | Characters vs bytes (UTF-8) | Why databases and SMS care; byte examples | 110 |
| 8 | What 100, 150 and 255 characters look like | Three exact sample blocks (`100 characters text`, `255 characters example`) | 130 |
| 9 | Character count in Word and Google Docs | Only the §3 steps: Docs Ctrl + Shift + C / ⌘ + Shift + C; Word status bar → Word Count box (`how to do character count in word`) | 130 |
| 10 | FAQ | §6 | 350 |

## 6. FAQ (11, from the competitor question bank + cluster keywords)

1. Do spaces count as characters?
2. What is the difference between characters and letters?
3. How do I see how many characters I have left? (`remaining characters`)
4. How do I count characters in Word or Google Docs? (§3 steps only)
5. How are emoji counted? (one per visible emoji; why some sites show 2 or more)
6. How do I count Chinese or Japanese characters?
7. Do line breaks count as characters?
8. What is the difference between a character and a byte?
9. What does 100, 150 or 255 characters look like?
10. Is my text stored or sent anywhere? (no; how we know: no network calls)
11. How do I build a character counter for a textarea? (developer FAQ: `Intl.Segmenter` grapheme count vs `.length`, our own 3-line snippet)

## 7. Done when

- [ ] `text-engine.ts` + tests (all §3.6 cases); `npm run verify` passes.
- [ ] `TextInputPanel`, `StatTiles`, `text-limits.ts` (with `verified` flags) built as shared pieces.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Sample blocks exact; no misspellings in copy; privacy line present.
- [ ] Registrations + docs + new "Text & Writing" category; `graphify update .`.
- [ ] **STOP and report** (first tool of the batch; the owner reviews the shared pattern).
