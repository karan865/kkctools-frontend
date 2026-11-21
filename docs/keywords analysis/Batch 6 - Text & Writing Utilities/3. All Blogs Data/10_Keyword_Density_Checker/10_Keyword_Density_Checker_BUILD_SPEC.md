# Keyword Density Checker — Build Spec

> **URL:** `/keyword-density-checker/` · Batch 6 · Tier 3 · **Build order 10**
> **Read first:** `../00_BATCH6_BUILD_RULES.md` (§2.5 no invented thresholds, §3 Google spam-policy source, §4 `ngrams()`)
> **Inputs:** `10_Keyword_Density_Checker_Competitor_Analysis.md`, keyword file §2 #10
> **SERP:** provisional (`TODO(owner)`: pull `keyword density checker` volume and SERP before building, per the keyword file)
> **Written:** 2026-11-22

---

## 0. Strategy

**About 10,800 searches, mostly SEO *questions*, not tool searches:**
- `how many keywords` 1,000 / KD 14 (primary);
- `how many seo keywords should i use` 2,400 / KD 16 ($3.51 CPC);
- `how many keywords per page seo` 1,900; `how many keywords for seo` 1,900; `how many seo keywords per page` 1,900;
- `how many keywords use in seo` 880 / KD 14;
- `is adding too many keywords bad for google ads` 590 / **KD 1** (Google Ads intent: FAQ only);
- `count keywords on website` 260 / KD 6 (wants a URL fetch; **we analyse pasted text only**).

Most rows are declining. The tool term `keyword density checker` isn't in the exports. **Tier 3:** build after the other nine, and only after the SERP pull.

**The honest answer is our edge.** The SERP is SEO vendors and AI startups using a checker as lead-gen, and several **invent thresholds** (0.5–2.5%, "under 2%", "< 0.3%", 1–3%). Google's spam policy (§3, checked 2026-11-22) defines keyword stuffing as "filling a web page with keywords or numbers in an attempt to manipulate rankings" and **gives no percentage**. So:
- we show counts and percentages with the formula;
- we show *where* a phrase repeats and how it compares with the text's other phrases;
- we never say "your density should be X%".

### Research notes from the competitor analysis

- **Pages read:** SEO Review Tools, Gaurav Tiwari (Gatilab), RankAI, Google Search Central spam policies. Solvid 403.
- **Gaurav Tiwari** has the richest tool (target phrase, n-grams, gauge, **heatmap**, **KWIC**) but its thresholds contradict each other (< 2% vs 2.5%; 0.3% vs 0.5%), its formula "(count × keyword length)/total" is ambiguous, one formula doesn't render, and it states "lexical density 40–60%" without a source.
- **SEO Review Tools:** URL or text, 1/2/3-word tables, English stop words; says "no exact answer" ✔ but cites a "KeywordStuffingScore 0–127" from a "Google API leak" with no link. **We don't repeat it.** Typo "Tree word", ratings 7.9 vs 9.3.
- **RankAI:** the most honest FAQ ("no universal target", short pages mislead), but no method, no sample output, no data-handling statement.
- **0 of 3** show the formula clearly or let users edit the stop-word list.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | how many keywords | 1,000 | 14 | H2 "How many keywords should a page have?", first FAQ, intro sentence |
| Head (not in exports) | keyword density checker | — | — | title, H1, ToolShell heading (`TODO(owner)`: pull volume) |
| Secondary | how many seo keywords should i use · how many keywords use in seo · how many keywords for seo | 2,400 · 880 · 1,900 | 14–29 | the same H2 + FAQ 2 |
| Secondary | how many keywords per page seo · how many seo keywords per page | 1,900 · 1,900 | 21–29 | H2 sub-paragraph + FAQ 3 |
| FAQ only | is adding too many keywords bad for google ads | 590 | 1 | one FAQ, general and neutral (Ads keyword lists are a different thing from on-page text; no claims about Ads quality systems) |
| FAQ only | count keywords on website | 260 | 6 | FAQ "Can I check a live web page?": no; copy the page text and paste it (privacy, zero network) |

## 2. Our edge

- **Transparent maths:** both conventions shown, the default labelled:
  - **Density (default)** = occurrences ÷ total words × 100;
  - **Share of words** = occurrences × words in the phrase ÷ total words × 100 (the convention some tools use; shown as a second column).
- **Clear tokenising rules:** shared `words()` (case-insensitive by default, punctuation stripped, hyphen rule); phrases never cross sentence boundaries (shared `sentences()`).
- **Editable stop-word list** (ours, from `stop-words-en.ts`), applied to the **tables only**; totals never change (said in the UI).
- **Target keyword view:** count, density, first position (word number), **position heatmap** (text split into 10 equal parts), **keyword in context** (± 5 words around each hit), highlight in the text.
- **Variant grouping (optional):** our own light plural rules ("-s", "-es", "-ies → -y"), labelled approximate.
- **No invented thresholds:** a relative "most repeated phrases" view instead ("'word counter' appears 3 times in 17 words, more than any other 2-word phrase"), plus Google's definition with a link.
- **Paste only, zero network,** and the page says why (privacy; we don't fetch URLs).
- **CSV export** of the tables, generated locally.

## 3. Calculator spec

### 3.1 Tabs

1. **All words & phrases** (default): 1-, 2-, 3-word tables.
2. **Target keyword**: count, density, heatmap, KWIC.
3. **Settings**: stop words, case, variants, minimum count.

### 3.2 Input guide diagram (above the inputs)

`KeywordDensityInputGuide.tsx`: the sample text with the target phrase highlighted.

- Sample (ours): `Our word counter counts words fast. A word counter also counts characters. Use the word counter free.`
- **Callouts:**
  - "1 Target phrase: word counter (3 hits)";
  - "2 Total words: 17";
  - "3 Density = 3 ÷ 17 = 17.6%";
  - "4 Phrases don't cross sentences" (a small ✕ between "fast." and "A").
- **Target tab:** a 10-cell heatmap bar labelled "Where it appears".
- **Settings tab:** "Stop words (edit)" chip list.
- Live: the callouts follow the user's text and target.

### 3.3 Inputs

| Field | Default |
|---|---|
| Text | the sample above, extended to ~150 words of our own |
| Target keyword / phrase | `word counter` (sample) |
| Phrase length | 1 · 2 · 3 (all tables shown; tab switches focus) |
| Ignore stop words in tables | on |
| Stop-word list | `stop-words-en.ts` (editable, Reset) |
| Case-sensitive | off |
| Group plural variants | off (approximate) |
| Minimum count to list | 2 |
| Show "share of words" column | on |

### 3.4 Engine (shared `text-engine.ts` + `src/lib/keyword-density-engine.ts`)

```ts
tokens = words(normalizeText(t)) with sentence index ; lower unless caseSensitive
ngrams(tokens, n) : sliding window inside each sentence only
table(n) → [{term, count, density = count / total × 100, share = count × n / total × 100}]
          filtered by stopWords (1-grams: drop stop words; 2–3-grams: drop if every word is a stop word, or if it starts or ends with one) and minCount
target(phrase) → {count, density, share, firstPosition, positions[], heat[10], kwic[] (±5 words)}
variants (opt): "-ies"→"-y", "-xes/-ches/-shes"→ drop "es", "-s"→"" when the stem has ≥ 3 letters ; never strip words ending ss/us/is ; label approximate
topRepeated(n) → highest-count phrases (relative view, no thresholds)
```

**Worked examples (checked with node, 2026-11-22):**

| Text / target | Result |
|---|---|
| Sample above, target `word counter` | total **17** words · **3** occurrences · density **17.65%** · share of words **35.29%** |
| Sample above, target `counts` | **2** occurrences · **11.76%** |
| `The cat sat. The cat ran. A dog sat.` (2-word, stop words kept) | "the cat" **2**; "cat sat", "cat ran", "a dog", "dog sat" 1 each; **no "sat the"** (sentence boundary) |
| Same, 1-word, stop words ignored | cat 2, sat 2, ran 1, dog 1 (totals still 9 words) |

### 3.5 Outputs

- **Tiles:** total words · unique words · sentences · most repeated word · most repeated 2-word phrase.
- **Sentence:** "'word counter' appears 3 times in 17 words (17.6%), more than any other 2-word phrase."
- **Tables:** term, count, density %, share %; sortable; Copy; Download CSV.
- **Target tab:** stats, heatmap (with an accessible list fallback), KWIC list, highlight in the text, click a KWIC line to jump.
- **Formula box** under the tables with both conventions.
- **Google note** (fixed text): "Google's spam policies describe keyword stuffing as filling a page with keywords or numbers to manipulate rankings. They don't give a percentage." + link + checked date.
- Share URL (settings and target only, **never the text**).

### 3.6 Tests

- Tokenising: punctuation, case, apostrophes, hyphens, numbers, CJK (per the shared rules).
- n-grams don't cross sentences; stop-word filtering rules for 1/2/3-grams; totals unchanged by stop words.
- Both density conventions; zero words → no `NaN`.
- Variant grouping rules and their exclusions: words ending in "ss", "us" or "is" are never stripped ("glass", "bus", "analysis" stay as they are); "keywords" → "keyword", "boxes" → "box", "stories" → "story".
- Target: first position, heatmap buckets, KWIC windows at the start and end of the text.
- Large text (1 MB) performance.
- **Copy review test:** a snapshot of the rendered article has no "%" next to "ideal", "should" or "recommended".
- The worked examples. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Keyword Density Checker – Count Words in Text` (45; 57 with the suffix: OK) |
| Meta | `Free keyword density checker. Paste your text to see how often each word and 2–3 word phrase appears, as a count and a percentage, in your browser.` (147) |
| H1 | `Keyword Density Checker: How Often Each Word and Phrase Appears` |
| BLUF | "Paste your text to see how often each word and 2- or 3-word phrase appears, as a count and a percentage of all words, and where a target keyword shows up. Density here is occurrences ÷ total words × 100. There is no 'ideal' percentage: Google's spam policies warn against stuffing keywords but give no number." |
| ToolShell pills | `1-, 2- & 3-word phrases`, `Formula shown, no made-up targets`, `Keyword heatmap & context`, `Editable stop words` |
| Links out | Word Counter (#6), Sentence Counter (#9), Character Counter (#5) |
| Links in | #6, #9, Tools hub "Text & Writing" |

## 5. Content (~1,200–1,500 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the keyword density checker | 3 tabs, paste-only note | 110 |
| 2 | What keyword density is and how it's calculated | Both conventions with the sample (17.65% vs 35.29%); why tools disagree | 180 |
| 3 | Is there an ideal keyword density? | No; Google's definition (quoted briefly, linked); why fixed percentages mislead on short pages | 160 |
| 4 | How many keywords should a page have? | Topic, intent and natural language; one main topic per page plus related terms; **no fixed count** (`how many keywords`, `how many keywords per page seo`) | 200 |
| 5 | Reading the phrase tables and the heatmap | Stop words, n-grams, KWIC | 140 |
| 6 | What keyword stuffing looks like | Google's examples (lists of numbers, blocks of city names, unnatural repetition), rewritten in our words | 130 |
| 7 | FAQ | §6 | 330 |

## 6. FAQ (10, from the competitor question bank + cluster keywords)

1. How many keywords should I use for SEO? (no fixed number; what to do instead)
2. How many keywords per page? (one main topic + naturally related terms; no rule)
3. What is the ideal keyword density? (none published by Google)
4. What is keyword stuffing? (Google's definition, linked)
5. How is keyword density calculated? (both conventions)
6. Do stop words count? (in the totals yes; hidden from the tables by default)
7. Why is density misleading on short pages? (one repeat changes the % a lot; worked example)
8. Can I check a live web page? (paste the text; we don't fetch URLs)
9. Is adding too many keywords bad for Google Ads? (Ads keyword lists are separate from page text; check Google Ads Help; no claims)
10. What are 2- and 3-word phrases (n-grams)?

## 7. Done when

- [ ] `keyword-density-engine.ts` + tests; `npm run verify` passes.
- [ ] No invented threshold anywhere (copy review test passes); Google note linked and dated.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Registrations + docs; `graphify update .`.
- [ ] **STOP and report** (end of Batch 6).
