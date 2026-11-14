# Keyword Density Checker — Competitor Analysis

> **Target page:** KKCTools `/keyword-density-checker/` (Batch 6, Tool #10 🟡, Tier 3)
> **Primary keyword:** `how many keywords`. US 1,000 · KD 14 · declining. The cluster has 8 keywords (10,830 US vol), and almost all of it is SEO *questions*, such as `how many seo keywords should i use` (2,400). The tool term `keyword density checker` is not in the exports.
> **SERP source:** ⚠ No Semrush SERP export for Batch 6. Competitors come from a live web search for `keyword density checker paste text` run on 2026-11-14, plus Google Search Central as the authority source. `TODO(owner): pull "keyword density checker" volume/KD + SERP before building (keyword note).`
> **Pages visited (2026-11-14):** 4 read: SEO Review Tools, Gaurav Tiwari, RankAI, Google spam policies (authority). Solvid returned 403.

---

## 0. How this was collected (read first)

- **Who ranks:** the SERP is mostly **SEO vendors and AI startups** using the checker as lead generation:
  - RankAI, Solvid, AIAD, SEO Review Tools, Elite Content Marketer, Gaurav Tiwari (Gatilab), Wild Creek Studio, AEO Engine, parix
  - plus many vercel and pages.dev clones
- **Keyword-file rules:**
  - The honest answer to "how many keywords" is that **there is no magic density**. The FAQ **must not invent rules**.
  - `count keywords on website` wants a URL fetch. **We only analyse pasted text**, because tool code makes zero network calls.
- **Competitors invent thresholds.** Gaurav Tiwari gives 0.5–2.5 %, "under 2 %" and "< 0.3 %" in different places. Search snippets show 1–2.5 % and 1–3 %. None of these is sourced.
  - **Google's own documentation** defines keyword stuffing as repeating words "so often that it sounds unnatural". It gives no percentage.
  - SEO Review Tools and RankAI correctly say there is no exact number.
- **Unverified claim spotted:** SEO Review Tools cites a "KeywordStuffingScore 0–127" from a "Google API leak", with no link. We won't repeat it.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | seoreviewtools.com/keyword-density-checker/ | SEO tool vendor | Keyword Density Checker | long (cluttered) |
| 2 | gauravtiwari.org/calculators/keyword-density-checker/ | SEO consultant | Keyword Density Checker | 800–900 |
| 3 | rankai.ai/free-tools/keyword-density-checker | AI SEO startup | Keyword Density Checker | ~350 |
| 4 | developers.google.com/search/docs/essentials/spam-policies | **Google (authority)** | Spam policies: keyword stuffing | reference |
| — | solvid.co.uk/tools/keyword-density-checker/ | SEO agency | Free Keyword Density Checker | **blocked (403)** |

**What this tells us:**
- **Gaurav Tiwari has the richest tool:**
  - target phrase, n-gram 1/2/3
  - density, hits, prominence and a density gauge
  - **phrase-distribution heatmap** and **keyword-in-context list**
  - top-phrases table, reading time, 8 FAQs
  - Weak spots: **thresholds that contradict each other**, an ambiguous formula, and no documentation of stop words.
- **SEO Review Tools** accepts URL or text, reports 1-, 2- and 3-word frequency and density, removes stop words (English only) and lets users exclude keywords.
  - It says "no exact answer", but makes an unsourced claim about a leak.
  - Other problems: typo "Tree word", inconsistent ratings, broken markup.
- **RankAI** has the most honest FAQ ("no universal target") but no method, no sample output and no statement about how it handles data.
- **No page does all of these:**
  - documents the **formula** and how it splits text into words (case, stemming, multi-word phrases)
  - has an **editable** stop-word list
  - shows where the keyword appears in the text and in context
  - offers **variant grouping** (plural/singular, optional stemming)
  - avoids invented thresholds while linking Google's definition
  - states privacy (local only)

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | SEO Review Tools | Gaurav Tiwari | RankAI |
|---|---|---|---|
| Paste text | ✅ | ✅ | ✅ |
| URL fetch | ✅ (we won't — zero network) | ❌ | ❌ |
| 1-, 2-, 3-word phrases | ✅ | ✅ | ⚠️ |
| Count + % | ✅ | ✅ | ✅ |
| Target keyword input | ❌ | ✅ | ⚠️ ("focus topic") |
| Stop-word filter | ✅ (English, list hidden) | ❌ | ❌ |
| Editable stop words / exclusions | ⚠️ ("keywords to exclude") | ❌ | ❌ |
| Case / stemming / variants rules | ❌ | ⚠️ ("partial matches may or may not count") | ❌ |
| Position heatmap | ❌ | ✅ | ❌ |
| Keyword in context (KWIC) | ❌ | ✅ | ❌ |
| Prominence (early placement) | ❌ | ✅ (unsourced weighting) | ❌ |
| Over-use flag | ❌ | ✅ (gauge with invented range) | ✅ ("overuse signals") |
| Formula shown | ⚠️ (words only) | ⚠️ (ambiguous, not rendered) | ❌ |
| Privacy statement | ❌ | ✅ (FAQ) | ❌ |
| Copy / export table | ? | ? | ? |

---

## 3. Feature matrix — content and trust

| Item | SEO Review Tools | Gaurav Tiwari | RankAI | Google |
|---|---|---|---|---|
| "Ideal density" claim | "no exact answer" ✅ (but leak claim) | **0.5–2.5 % vs < 2 % vs 0.3 %** (conflicting, unsourced) | "no universal target" ✅ | no number: "unnatural repetition" |
| Google source linked | ✅ (support page) | ❌ | ❌ | — |
| FAQ count | 0 (question headings) | 8 | 8 | n/a |
| Named author | ⚠️ (admin in comments) | ✅ (site owner) | ❌ | Google |
| Date | ❌ | ❌ | ❌ | ❌ |
| Promotion | heavy tool lists | Black Friday pop-ups | "let RankAI fix your site" | — |

---

## 4. Competitor-by-competitor detail

### 1. SEO Review Tools — Keyword Density Checker
- **Input:** URL, text, or a search variant, plus keywords to exclude.
- **Output:** 1-, 2- and 3-word frequency and density. English stop words are removed. Title, meta and #comments are excluded.
- **Claims:**
  - "No exact answer" ✔.
  - "KeywordStuffingScore 0–127" attributed to a Google leak, unsourced ❌.
- **Weak points:**
  - Typo "Tree word combinations".
  - Ratings that don't match: 7.9 vs 9.3.
  - Stray markup.
  - Undated changelog.

### 2. Gaurav Tiwari — Keyword Density Checker
- **Inputs:** target phrase, n-gram size, content. Ctrl+Enter runs the check.
- **Outputs:**
  - density, hits, total words, prominence, reading time
  - gauge (0.5–2.5 %), heatmap, KWIC, top phrases, statistics
- **FAQs (8):**
  1. How the tool works
  2. Ideal density
  3. Prominence
  4. N-grams
  5. Heatmap
  6. Stuffing
  7. Lexical density (40–60 %, unsourced)
  8. Privacy
- **Errors:**
  - The thresholds contradict each other: < 2 % vs 2.5 %, and 0.3 % vs 0.5 %.
  - The formula "(count × keyword length)/total" is ambiguous.
  - A formula referenced in the text doesn't render.
- **Weak points:** no stop-word documentation; sales pop-ups.

### 3. RankAI — Keyword Density Checker
- **Inputs:** focus topic (optional) and text. **Outputs:** term frequency, density, overuse.
- **FAQs (8):** honest. They say there is no universal target and that short pages can mislead.
- **Weak points:**
  - No method or sample output.
  - No data-handling statement.
  - Sales calls to action.

### 4. Google Search Central — Spam policies (authority)
- Defines keyword stuffing as filling a page with keywords or numbers to manipulate rankings.
- Examples: lists of phone numbers, blocks of city names, words repeated "so often that it sounds unnatural".
- **No density figure is given.** We use this as the basis for our "no magic number" FAQ.

---

## 5. Patterns

**Formula, shown on the page**
- density(term) = occurrences × words in term ÷ total words × 100. Also show the simple "occurrences ÷ total" form, and say which one each column uses.
- `TODO(owner)`: pick one convention as the default and label it.

**Tokenisation and matching**
- `Intl.Segmenter('word')`.
- Lowercase, with a case-sensitive option.
- Strip punctuation.
- Optional light stemming (plural "s" and "es"). We write our own simple rules and label them "approximate".
- Phrase n-grams don't cross sentence boundaries (shared engine with #9).

**Stop words**
- A default English list that we write ourselves, and that users can edit.
- Toggle for whether stop words apply to the table or to the totals.

**Target keyword view**
- Count, density, first position, positions heatmap, KWIC (±N words around each hit).
- Present in the first 100 words? Shown as a fact, not a rule.

**No invented thresholds**
- Show **repetition relative to the text**: the top terms, and any phrase that repeats many times in a short span.
- Explain Google's guidance, with a link to the policy page.

**Privacy and network**
- Text only, kept in the browser. No URL fetching (keyword-file rule).

**What the competitors cover (of 3 tools)**

| Section | Pages (of 3 tools) |
|---|:---:|
| 1/2/3-grams | 3 |
| Target keyword | 1–2 |
| Stop words | 1 |
| Editable stop words | **0** |
| KWIC + heatmap | 1 |
| Formula clear | **0** |
| Honest "no ideal %" | 2 |
| Google source linked | 1 |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword. Maps to: how many keywords, how many keywords use in seo, is adding too many keywords bad for google ads, count keywords on website, how many seo keywords should i use, how many keywords per page seo, how many keywords for seo, how many seo keywords per page.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is the ideal keyword density? | all (answer: no fixed number; cite Google) |
| 2 | ★ How many keywords should I use per page? | `how many keywords per page seo`, `how many seo keywords should i use` |
| 3 | ★ What is keyword stuffing? | Google, SEO Review Tools |
| 4 | ★ How is keyword density calculated? | Gaurav Tiwari (ambiguous) |
| 5 | Can density alone improve rankings? | RankAI |
| 6 | Do stop words count? | SEO Review Tools |
| 7 | Why is density misleading on short pages? | RankAI |
| 8 | Can I check a live web page? | `count keywords on website` (no; paste the text — privacy, no network) |
| 9 | Is using too many keywords bad for Google Ads? | `is adding too many keywords bad for google ads` (FAQ only; general, no claims) |
| 10 | What are 2- and 3-word phrases (n-grams)? | Gaurav Tiwari |

---

## 7. Gaps nobody fills — our opportunities

1. **Transparent maths:** the formula on screen, plus the rules for splitting words and matching, and stemming options.
2. **An editable stop-word list** and case-sensitivity options.
3. **Target keyword views:** count, density, positions heatmap and keyword-in-context. Optional grouping of word variants.
4. **1-, 2- and 3-word phrase tables** with copy and CSV download, generated in the browser.
5. **An honest FAQ** anchored to Google's keyword-stuffing definition, with **no invented percentages** (keyword-file rule).
6. **Privacy and zero network:** paste only, and say why we don't fetch URLs.
7. **Shared engine** with the Word Counter (#6) and Sentence Counter (#9).
8. **Links:** Word Counter (#6), Sentence Counter (#9), Character Counter (#5), SEO-related tools (future).

---

## 8. Blueprint for the KKCTools Keyword Density Checker

### 8.1 SEO

- **URL:** `/keyword-density-checker/`
- **Title:** Keyword Density Checker – Count Words in Text
- **H1:** Keyword Density Checker: How Often Each Word and Phrase Appears
- **Meta:** as in the keyword file (147 chars).
- **H2s:** how many keywords per page · how many SEO keywords should I use · what is keyword stuffing.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Input | Pasted text only (no URL) |
| Tables | 1/2/3-word phrases: count, %, sortable, copy/CSV |
| Target | Keyword/phrase → count, density, first position, heatmap, KWIC |
| Options | Stop words (editable), case, light stemming (labelled approximate), min count |
| Explain | Formula shown; Google keyword-stuffing definition linked |
| UX | Local only, no network |

### 8.3 Content outline (≈ 1,100–1,400 words, original)

1. Intro (primary keyword) and privacy note
2. How to use
3. What keyword density is and how it's calculated
4. Is there an ideal keyword density? (no; Google's view, with a link)
5. How many keywords per page? (topics, intent and natural language; no fixed rule)
6. Using the phrase tables and the heatmap
7. Keyword stuffing: what it looks like
8. FAQ (10)
9. Related tools: Word Counter (#6), Sentence Counter (#9), Character Counter (#5)

### 8.4 Quality checks

- **Unit tests:**
  - tokenisation (punctuation, case, CJK)
  - n-grams that don't cross sentence boundaries
  - stop-word filtering
  - both density conventions
  - stemming rules
  - large-text performance
- **Copy review:** no invented thresholds anywhere in the copy.
- No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)`:** pull "keyword density checker" data and the SERP; choose the default density convention; approve the stop-word list.
