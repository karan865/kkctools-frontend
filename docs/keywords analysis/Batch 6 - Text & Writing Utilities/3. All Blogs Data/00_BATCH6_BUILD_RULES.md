# Batch 6 — Build Rules (Text & Writing Utilities)

> **Read before every Batch 6 spec.** Builder: Antigravity / Gemini.
> **Inputs used:** `KKCTools_Batch6_Final_Tool_Keywords.md` (Semrush US, Oct 2026), 10 competitor analyses, official help pages opened on 2026-11-22 (§3).
> **Written:** 2026-11-22

---

## 0. Status: provisional (no Semrush SERP export)

Rank chances come from keyword data and known SERP owners. Each competitor analysis read the live pages.

`TODO(owner)`: pull the top 10 (Domain AS) for:
- `words to pages`, `how many pages is 1000 words`;
- `1000 characters to words`, `how many words is 2000 characters`;
- `twitter character counter`;
- `numbers to words`, `amount in words`;
- `characters counter`, `word counter free`;
- `reading time calculation`.

Also pull the missing heads: `word counter`, `character counter`, `words to pages calculator`, `characters to words`, `keyword density checker`, `reading time calculator`, `number to words converter`.

**Two decisions depend on that pull:**
- If one URL ranks for both `characters counter` and `word counter free`, ask the owner whether to merge #5 and #6 (keyword file §2 #6).
- If 3+ giants (AS ≥ 60) hold a primary's top 5, that tool drops one tier.

## 1. Project rules (AGENTS.md wins on any conflict)

**Never:**
- network calls in tool code (`npm run check:no-network` must pass);
- fetching a URL for the user (#10 analyses pasted text only);
- invented facts (platform limits, reading speeds, novel or essay lengths, "ideal" densities, sentence-length rules);
- copying competitor text;
- one URL per number ("how many pages is 1,500 words" is a row in one table, never its own page);
- misspellings in copy (`character coutner`, `word coutner`, `sentance counter`, `chacter counter`);
- logos or brand styling for X, Instagram, Discord, Google, Microsoft (names are descriptive only);
- ratings or `aggregateRating`;
- committing or pushing.

**Always:**
- Use `TODO(owner)` for owner-supplied facts.
- Engine first: pure functions, `null` for undefined cases.
- Every number in the BLUF, examples, tables and FAQ comes from the engine.
- **Each spec's worked example is a unit test.**
- Run `npm run verify` from PowerShell or the VS Code terminal, never Git Bash.
- graphify:
  - run `graphify query` before searching code;
  - run `graphify update .` after changes;
  - exe path: `$(ls ~/AppData/Roaming/Python/*/Scripts/graphify.exe | head -1)`, run from PowerShell (Git Bash gets "Permission denied").

## 2. Accuracy and trust rules (the reason these pages can win)

The SERPs for these tools are full of pages that contradict themselves. **Being right and showing the method is our edge.**

1. **Every estimate shows its assumptions and a range.**
   - Words per page, characters per word, words per sentence, words per paragraph, words per minute.
   - Each one is an editable input with its default stated next to the result.
2. **Every "fact" carries a source and a checked date** in a data file:
   - `src/data/text-limits.ts` for platform limits;
   - `src/data/reading-rates.ts` for words-per-minute defaults.
   - Each entry has `value`, `unit`, `sourceUrl`, `checkedOn`, `verified: boolean`.
   - **An entry with `verified: false` renders as "unverified, check the platform's help page"**, never as a plain fact. It is never used in the BLUF, the H1, the title or the meta.
3. **Counting is Unicode-correct.**
   - Characters = grapheme clusters (`Intl.Segmenter`, granularity `grapheme`), so 👨‍👩‍👧‍👦 is 1 character, not 11.
   - Show code points, UTF-16 units and UTF-8 bytes beside it, and explain the difference in plain words.
   - X weighted counting is its own function (§4), never the generic counter.
4. **Word rules are stated and switchable.**
   - Hyphenated words = 1 word (default on). `Intl.Segmenter` alone splits "well-known" into 2, so post-process.
   - Numbers count as words (default on). Contractions (`it's`, `It’s`) = 1 word.
   - Smart quotes, en/em dashes, NBSP and soft hyphens from Word/Docs are normalised before counting.
5. **No invented thresholds.** No "ideal keyword density", no "a sentence should be under X words" unless the source in §3 says it.
6. **Privacy line under every text box:** "Your text stays in this browser. Nothing is uploaded or stored." True by design.
   - No auto-save. An opt-in "Keep my draft on this device" checkbox may use `localStorage`, wrapped in try/catch, with a Clear button.
7. **How-to steps for Google Docs and Word** use only the steps in §3. Anything else is `TODO(owner)`.

## 3. Sources opened on 2026-11-22 (use these; cite them on the page)

| Fact | Value | Source | Status |
|---|---|---|---|
| X post limit | 280 weighted characters | docs.x.com/fundamentals/counting-characters | ✅ verified |
| X: URL weight | any URL = 23 | same | ✅ |
| X: emoji / CJK weight | 2 each; "All emojis count as 2 characters, regardless of complexity" | same | ✅ |
| X: media, auto reply @mentions | 0; auto-populated reply mentions don't count; manual mentions count | same | ✅ |
| X weight ranges | default weight 200, scale 100; weight 100 for U+0000–U+10FF, U+2000–U+200D, U+2010–U+201F, U+2032–U+2037; URL length 23; emoji parsing on; max 280 | github.com/twitter/twitter-text `config/v3.json` (Apache-2.0) | ✅ |
| Instagram caption | 2,200 characters, 30 hashtags, 20 @ tags | developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media | ✅ (API reference) |
| Threads post | 500 characters | developers.facebook.com/docs/threads/posts | ✅ |
| LinkedIn post | 3,000 characters | linkedin.com/help/linkedin/answer/a528176 | ✅ |
| Mastodon post | 500 by default (servers can change it); links = 23; only the username part of a mention counts | docs.joinmastodon.org/user/posting/ | ✅ |
| YouTube | title 100 characters; description 5,000 | support.google.com/youtube/answer/57404 | ✅ |
| Google Docs word count | applies to everything except headers, footers and footnotes (unless text is selected) | support.google.com/docs/answer/39003 | ✅ |
| Google Docs shortcut | Ctrl + Shift + C (Windows/ChromeOS), ⌘ + Shift + C (Mac) | support.google.com/docs/answer/179738 | ✅ |
| Microsoft Word | the status bar shows the word count; click it to open the Word Count box (characters, lines, paragraphs); Mac: select text, Tools > Word Count | support.microsoft.com "Show word count" | ✅ (no keyboard shortcut on that page) |
| Excel TEXTJOIN | `TEXTJOIN(delimiter, ignore_empty, text1, …)`; Excel 2019, 2021, 2024, Microsoft 365, web (not 2016) | support.microsoft.com TEXTJOIN function | ✅ |
| Google Sheets JOIN | `JOIN(delimiter, value_or_array1, …)` | support.google.com/docs/answer/3094077 | ✅ |
| CSV quoting | fields with line breaks, double quotes or commas are enclosed in double quotes; an inner `"` is escaped as `""` | RFC 4180 §2 items 6–7 (rfc-editor.org/rfc/rfc4180) | ✅ |
| Check amount conflict | "words prevail over numbers" (UCC § 3-114) | law.cornell.edu/ucc/3/3-114 | ✅ (US law text; no further legal advice) |
| Keyword stuffing | "filling a web page with keywords or numbers in an attempt to manipulate rankings"; **no percentage given** | developers.google.com/search/docs/essentials/spam-policies | ✅ |
| Paragraph length | "paragraphs of no more than 150 words in three to eight sentences"; "never longer than 250 words"; one idea per sentence; **no sentence word limit given** | digital.gov/guides/plain-language/writing/clear-short | ✅ |
| Reading rate | 238 wpm non-fiction, 260 fiction (silent), 183 wpm aloud | Brysbaert (2019), *Journal of Memory and Language* 109, 104047 (doi 10.1016/j.jml.2019.104047) | ⚠ paper exists (Crossref); **rates not confirmed online** (publisher 403). `TODO(owner)`: confirm from the abstract before setting `verified: true` |
| Speaking rate | ~130–150 wpm | none found | ❌ `TODO(owner)`: source, or label "example pace, edit" |
| Average English word length 4.7 letters | — | none found | ❌ `TODO(owner)`: source, or label "commonly used average, edit" |
| Instagram bio 150, comment, username; Discord 2,000 / Nitro 4,000; Bluesky 300; X Premium; TikTok; Facebook | — | official pages failed (403/404/empty) | ❌ ship with `verified: false` and `TODO(owner)` |
| Google Sheets TEXTJOIN | — | support.google.com/docs/answer/7013992 (not opened) | ⚠ `TODO(owner)`: open and confirm |
| Word keyboard shortcut (Ctrl+Shift+G) | — | not on the Microsoft page | ❌ don't publish unless verified |

**Quarterly re-check:** `TODO(owner)` re-open every source in this table each quarter and update `checkedOn`.

## 4. Shared code (build once, with #5 first)

| File | Exports | Used by |
|---|---|---|
| `src/lib/text-engine.ts` (+ test) | `normalizeText(t, opts)` (NFC, smart quotes → straight, dashes → separator, NBSP → space, strip soft hyphen + zero-width); `graphemes`, `codePoints`, `utf16Units`, `utf8Bytes`; `charsNoSpaces`; `classCounts` (letters `\p{L}`, digits `\p{N}`, punctuation `\p{P}`, symbols `\p{S}`, spaces); `scriptCounts` (Han, Hiragana, Katakana, Hangul); `emojiCount` (`\p{Extended_Pictographic}` + flag pairs, per grapheme); `words(t, {hyphenJoin, numbers, cjkPerChar})`; `sentences(t, {abbreviations, listLines})`; `paragraphs(t, {mode})`; `lines(t)`; `ngrams(words, n, {stopWords, crossSentences:false})`; `minutes(words, wpm)`; `formatMmSs` | #5 #1 #2 #3 #6 #7 #9 #10 |
| `src/lib/x-count-engine.ts` (+ test) | `xWeightedLength(text)` from the v3 config in §3, `splitThread(text, limit, {numbering})` | #3 (and #5 platform presets) |
| `src/lib/number-words-engine.ts` (+ test) | BigInt-based: `toWords`, `toCheck`, `toCheque`, `toOrdinal`, `groupDigits`, `parseWords` | #4 |
| `src/lib/list-engine.ts` (+ test) | `splitLines`, `cleanList`, `joinList` (RFC 4180 mode), `parseDelimited`, presets (SQL, JSON, Python, JS, Excel, Markdown), `chunk` | #8 |
| `src/lib/page-estimate-engine.ts` (+ test) | words per page model, pages ↔ words, book mode, paragraph/sentence estimates, table rows | #1 |
| `src/data/text-limits.ts` | platform presets `{id, platform, field, limit, unit: 'x-weighted' \| 'chars' \| 'graphemes', sourceUrl, checkedOn, verified}` | #3 #5 #2 |
| `src/data/reading-rates.ts` | wpm defaults `{id, label, wpm, sourceLabel, sourceUrl, checkedOn, verified}` | #7 #6 #1 #9 |
| `src/data/stop-words-en.ts` | our own short English stop-word list (written by us, ~120 words), editable in the UI | #6 #10 |
| `src/data/abbreviations-en.ts` | our sentence-abbreviation list (Mr, Mrs, Ms, Dr, Prof, Sr, Jr, St, vs, etc, e.g, i.e, Inc, Ltd, Co, No, Jan–Dec, a.m, p.m, U.S) | #9 #5 #6 |

**Engine fixtures already checked with node (2026-11-22, Node 22 `Intl.Segmenter`):**

| Input | Result |
|---|---|
| `Hello, world! 👋` | X weighted **16**; graphemes 15; UTF-16 16; UTF-8 18 bytes |
| `你好世界` | X weighted **8**; graphemes 4; UTF-8 12 |
| `Read this https://www.example.com/a/very/long/path?utm_source=x 🚀` | X weighted **36** (10 + 23 + 1 + 2) |
| `👨‍👩‍👧‍👦` | 1 grapheme · 7 code points · 11 UTF-16 · 25 UTF-8 · X 2 |
| `🇮🇳` | 1 grapheme · 2 code points · X 2 |
| `café` NFC vs NFD (`café`) | both 4 graphemes; code points 4 vs 5 (why NFC matters) |
| `It’s a well-known fact — numbers like 2,500 and e-mail count.` | raw `Intl.Segmenter` = 12 word segments; **our rules (hyphen join on) = 10** |
| `Dr. Smith arrived at 3.30 p.m. on Monday. He paid $4.50 for coffee! Was it worth it? J. K. Rowling wrote it... and then she left. Visit example.com/a.b for more.` | raw `Intl.Segmenter` = 8 sentences (splits after "Dr." and each initial); **our merge rules = 5** |

**Performance:** debounce counting 120–150 ms; must stay smooth on 1 MB of pasted text. If it lags, move the counting into a Web Worker (still local).

## 5. Shared UI

- `ToolShell` wraps the calculator. Give it the spec's 4 **true** pills.
- `TabSlider` with `?tab=`.
- **The page must have a `<main>` element:** `<main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>`.
- **`src/components/tool/text/TextInputPanel.tsx`** (new, shared):
  - textarea (autosize, monospace toggle), Paste / Clear / "Try sample text" buttons;
  - optional `.txt` / `.md` import with `FileReader` (local only);
  - the privacy line from §2.6;
  - `aria-describedby` for the live counts; counts announced politely (`aria-live="polite"`, throttled).
- **`StatTiles`** (shared): the headline counts as tiles, with a Copy stats button.
- **Input guide diagram ABOVE the inputs** (same rule as Batches 3–5):
  - `<Name>InputGuide.tsx`, inline SVG;
  - numbered callouts = numbered field labels;
  - live values, focus highlight;
  - `role="img"` + title/desc;
  - tokens only (light + dark);
  - mobile `<details>`;
  - one diagram per tab.
  - **For text tools the diagram explains *what is counted*:** a sample line with brackets (for example "👍🏽 = 1 character", "well-known = 1 word", "https://… = 23 on X"). It updates from the user's own text where the spec says so.
- **New catalog category `Text & Writing`,** added with the first tool. Hub links (each page links to the others it names):
  - Counters: Character Counter ↔ Word Counter ↔ Sentence Counter ↔ Keyword Density;
  - Converters: Words to Pages ↔ Characters to Words ↔ Reading Time;
  - Social: Twitter/IG Counter ↔ Character Counter ↔ Characters to Words;
  - Standalone with links: Numbers to Words (↔ live Invoice Generator, Batch 5 Reverse Sales Tax), Comma Separator (↔ Character Counter).

## 6. Files a tool touches

**New:**
- engine + test (shared ones only once);
- component folder (calculator, InputGuide, `index.ts`);
- `src/app/<slug>/page.tsx` + `page.module.css`.

**Edit:**
- `routes.ts`;
- `tools-catalog.ts` + count test;
- `calculation-methods.ts`;
- `ToolArt.tsx`, `Icons.tsx`, `Footer.tsx`;
- docs 00/01/02/04/06.

## 7. Page structure and SEO

- `buildMetadata`, with `absoluteTitle` when the title + " | KKC Tools" is over 60.
- Breadcrumbs, then JsonLd (WebApplication + FAQPage + BreadcrumbList).
- **The tool is above the fold and works on first paint:** a textarea with sample text already counted, or the converter with its defaults.
- BLUF in the first 60 words, with engine numbers and the assumption in brackets.
- Result sentence; steps; H2s per spec; FAQ once; HowWeCalculate (rules, formulas, sources from §3 with checked dates); related links.
- **Long-tail tables** are real HTML `<table>` elements with a `<caption>`, generated by the engine at build time (static export). Each row reads as an answer, e.g. "1,000 words | 2 pages | 4 pages".
- AdSlots outside the band; never between the textarea and its counts.
- Mobile 390 px: no page-level horizontal scroll; wide tables scroll inside their own wrapper.

## 8. Build order

Engine first, because six pages reuse it (keyword file §6).

| Order | Spec | Tier | Why here |
|---:|---|:---:|---|
| 1 | **05 Character Counter** + `text-engine` + `TextInputPanel` + `text-limits` | 1 | base engine; KD 0 tool terms |
| 2 | **01 Words to Pages** + `page-estimate-engine` | 1 | biggest long tail (~100K) |
| 3 | **02 Characters to Words** | 1 | ~30K rising long tail |
| 4 | **03 Twitter / Instagram Counter** + `x-count-engine` | 1 | KD 0–14 exact intent |
| 5 | **06 Word Counter** | 1 | `word counter free` KD 3 |
| 6 | **07 Reading Time** + `reading-rates` | 1 | speech table asset |
| 7 | **04 Numbers to Words** + `number-words-engine` | 1 | standalone engine, KD 0–14 |
| 8 | **08 Comma Separator** + `list-engine` | 2 | standalone engine |
| 9 | **09 Sentence Counter** | 2 | reuses engine sentence rules |
| 10 | **10 Keyword Density** | 3 | reuses engine n-grams |

**Stops:** after #1 (05 Character Counter) for the owner to review the shared pattern; after order 7; after order 10.
