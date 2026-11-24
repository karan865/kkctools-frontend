# Batch 6 — Builder Prompt (Antigravity / Gemini)

> **Goal:** build **all 10** Batch 6 tool pages (Text & Writing), in one run, from their build specs.
> **Written:** 2026-11-22 · **Rewritten:** 2026-11-24 for the code after Batch 5 (95 tools, 8 categories, new footer and mega menu).
> **Result when done:** 105 tools in the catalog, 10 new routes, a new `Text & Writing` category, `npm run verify` green.

**Paths used below**

- `B6` = `docs/keywords analysis/Batch 6 - Text & Writing Utilities/`
- **Keyword file:** `B6/2. Batch 6 - filtered master keywords/KKCTools_Batch6_Final_Tool_Keywords.md`
- **Rules:** `B6/3. All Blogs Data/00_BATCH6_BUILD_RULES.md`
- **Specs:** `B6/3. All Blogs Data/NN_<Name>/NN_<Name>_BUILD_SPEC.md`

**Which file wins:** `AGENTS.md` → §3 of this prompt (corrections) → Rules → spec → keyword file. Competitor analyses are background only; never copy from them.

---

## 0. Obey always

1. **Read in full before any code:** `AGENTS.md`, `CLAUDE.md`, the Rules, the keyword file. Then read each tool's spec in full right before building that tool.
2. **graphify:** `graphify query "<question>"` before searching code; `graphify update .` after changing code. If one shell refuses to run it, use the other.
3. **Run `npm run verify` from PowerShell or the VS Code terminal, never Git Bash.**
4. **Never:**
   - commit, push, or change `tsconfig.json`, `next.config.ts`, `package.json` or `public/_headers`;
   - add a dependency (no twitter-text, no NLP, no emoji library);
   - make a network call, fetch a URL for the user, upload or log text, or put the user's text in a URL. `check:no-network` only scans `src/components/tool` and `src/lib/generator`, so apply the same rule yourself in `src/lib` and `src/data`;
   - invent a fact: platform limits, reading speeds, essay or novel lengths, "ideal" densities, sentence-length rules;
   - create one URL per number ("how many pages is 1,500 words" is a table row);
   - copy competitor text, use platform logos or bank designs, add ratings or `aggregateRating`;
   - print a misspelled keyword (`coutner`, `chacter`, `sentance`, `countre`, `countwr`);
   - let `TODO(owner)` or `TODO(builder)` appear in rendered HTML.
5. **Don't touch** `docs/Google Search console data/`, `docs/Indivisual keywords analysis/`, or other tools' pages, except for the links in §6 and the category fixes in §2.

## 1. How this run works: all 10 tools, no waiting

The owner has approved building the whole batch in one go. **This replaces every "STOP and report"** in the Rules (§8) and in specs 04, 05 and 10. At each of those points, write a checkpoint (§8) and keep going.

**Progress file:** keep `docs/prompts/BATCH6_PROGRESS.md` up to date with one row per tool: engine · tests · component · page · registered · verify result · notes. If the session ends or the context resets, read it first and resume from the first unfinished row. Never restart finished tools.

**One tool at a time.** A tool is finished only when `npm run verify` is green with it included. Don't start the next one on a red build.

**Stop and ask only if:**
- the same verify step still fails after 3 real attempts;
- an engine result differs from a spec worked example and §3 doesn't explain it (record both numbers; never edit a test to make it pass);
- a fix would need a new dependency or a config change.

Everything else has a default in §5. Use it, log it, continue.

**Before the first tool**
1. Read `docs/00-PROJECT-STATUS.md`. **Its summary is stale:** commit `eca54a5` overwrote it with "11 of 20" Batch 5 tools. All 20 are live (95 tools in `tools-catalog.ts`). Run `git restore --source=eeaa86f -- docs/00-PROJECT-STATUS.md`, then refresh its numbers from your own verify output.
2. Run `npm run verify` and save the baseline (tests, HTML pages) in the progress file. If the baseline is red, report it before building.

## 2. New category `Text & Writing` (do this once, first)

Use the id **`writing`** (not `text`, which is too easy to collide with CSS class names). The list of categories is hard-coded in many files; miss one and you get a build error or an uncoloured section.

| File | What to add |
|---|---|
| `src/lib/tools-catalog.ts` | `'writing'` in `CategoryId`; `CATEGORIES.writing` = name `Text & Writing`, order 9, headline, blurb |
| `src/styles/tokens.css` | Light: `--cat-writing #C026D3`, `-soft #FAE8FF`, `-ink #A21CAF`, `-deep #86198F`. Dark: `#E879F9`, `rgba(232,121,249,0.14)`, `#F0ABFC`, `#F5D0FE`. Fixed: `--cat-writing-g1 #A21CAF`, `-g2 #86198F` |
| `src/components/home/CategorySection.module.css` | `.writing`, **and the missing `.math`** |
| `src/components/home/ToolCard.module.css` | `.cat-writing`, **and the missing `.cat-engineering` and `.cat-math`** |
| `src/components/home/ToolArt.module.css` | `.cat_writing`, **and the missing `.cat_math`** |
| `src/components/home/CategoryTiles.tsx` + `.module.css` | `CATEGORY_ICONS`, `ORDER`, `.writing`. 9 tiles: use 3 × 3 on desktop; on 2 columns the last tile spans the row |
| `src/components/home/ToolCard.tsx` | `CATEGORY_LABEL.writing` |
| `src/components/home/HomeHero.tsx` + `.module.css` | a `Text & Writing` chip (the engineering and math chips are missing too; add them) |
| `src/app/page.tsx` | `CATEGORY_BANDS`: `{ id: 'writing', layout: 'split', show: 4, viewAllText: 'All text & writing tools' }`; check that the copy still reads true with non-calculator tools |
| `src/components/layout/Header.tsx` + `.module.css` | `categoryKeys`; 9 categories no longer fit 4 × 2, so use 5 columns (5 + 4) and keep two rows |
| `src/components/layout/Header.tsx` → `isToolsActive` | It matches `-calculator`, `-generator` and `-template` in the path, so most new slugs would not highlight "Tools". Compare against catalog slugs instead |
| `src/components/layout/MobileMenu.tsx` | `categoryKeys` |
| `src/components/layout/Footer.tsx` + `.module.css` | a 7th column `Text & Writing` (max 7 links + "All text tools →"). Re-check every breakpoint; no wrapped column titles at 1280 px |
| `src/app/llms.txt/route.ts` | the heading says "Construction & Landscaping Calculators" but lists every tool; rename it to "Calculators and Tools" |
| `src/lib/tools-catalog.test.ts` | count (95 → +1 per tool) and the hard-coded first tool (`added` + `slug`) → whatever the real sort now gives |

The bold items are gaps left by Batches 4–5; fixing them is in scope. Catalog rules enforced by test: `description` ≤ 110 characters, ≥ 3 `keywords`, a valid route.

## 3. Corrections to the specs (checked in Node 25 / TypeScript 5.9 on 2026-11-24)

These override the Rules and specs. **Each one gets a unit test.**

1. **Two text pipelines, never one.**
   - Characters, bytes, code points and limits run on the text as typed (NFC option only).
   - Word, sentence and phrase logic runs on `normalizeForWords()` (smart quotes, dashes, NBSP, soft hyphen).
   - Mixing them corrupts counts: `“Hi” — it’s` is 19 bytes, but 11 after quote/dash normalisation.
   - **Never strip U+200D or U+200C.** Rules §4 says "strip zero-width"; that turns 👨‍👩‍👧‍👦 from 1 character into 4. Strip only U+00AD, U+200B and U+FEFF, and only in the word pipeline.
2. **Emoji test.** The spec's `\p{Extended_Pictographic}` misses keycaps (`1️⃣`) and counts plain `©`, `®`, `™`, `✔` as emoji. A grapheme is an emoji if it matches any of: `\p{Emoji_Presentation}`, `\p{Extended_Pictographic}️`, `\p{RI}{2}`, or contains `⃣`.
   - For **X weighting**, the spec code gives `1️⃣` = 5 and `© 2026 Acme` = 12. The correct values are **2** and **11** (`©` without U+FE0F is inside the weight-1 range).
   - All spec worked examples stay the same with this test.
3. **URLs and emails = 1 word.** `Intl.Segmenter` splits `https://www.example.com/a?b=1` into 5 words and `example.com/a.b` into 2. Pre-tokenise URLs, bare domains with paths, and emails before segmenting. Spec 09's 8, 5, 4, 9, 4 depends on this.
4. **Characters without spaces.** The regex in spec 05 §3.4 contains invisible literal characters; don't paste it. Count the graphemes that don't match `/^[\s​]+$/u` (don't delete spaces and re-segment, which can fuse neighbours).
5. **TypeScript target is ES2017.** `1000n`, the `v` and `s` regex flags, and named groups **pass vitest but fail `next build`**. Use `BigInt('1000')`, the `u` flag, `[\s\S]` and numbered groups. Run `npx tsc --noEmit` after every engine. Don't change the target.
6. **Determinism.** Use `new Intl.Segmenter('en', …)`, `new Intl.Collator('en', …)` and `toLocaleString('en-US')`, never `undefined`. Server and first client render must match (plain ASCII samples on load). If `Intl.Segmenter` is missing, fall back to code points and show "Approximate in this browser". Never crash.
7. **Performance.** On 1 MB of text one recount costs about 91–192 ms (graphemes) + 57 ms (words) in Node, so counting on each keystroke will lag. Use one pass per metric (no `[...segment()]` spreads), an ASCII fast path for graphemes (bail out on `\r`), and a longer debounce above 100 KB. If it still lags, use a Web Worker via `new Worker(new URL('./x.worker.ts', import.meta.url))`. **Blob workers are blocked by the site CSP.**
8. **Twitter page H1.** The spec H1 promises "Bio Limits", but the bio limits are unverified, which Rules §2.2 bans from an H1. Use: `Twitter (X) Character Counter: Tweets, Threads and Instagram Captions`. The meta is the spec's, not the keyword file's.
9. **Thread fixture.** The "6-sentence, 443-character sample" is not in the repo. Write your own sample, compute its split, and store those numbers. Don't claim 275/175. Test the invariants: no part over the limit, the suffix counted, no URL or emoji split, the parts rejoin to the original.
10. **Links to pages that don't exist yet fail `seo:audit`.** Link to a Batch 6 page only once it is built; complete the rest in §6. Leave out "when live" targets from Batches 7–8.
11. **Text colour.** Commit `eeaa86f` had to repair unreadable metric boxes. Every tile, stat box and table sets its own `color`: values `var(--ink)`, labels `var(--ink-soft)`. Never inherit white from a dark hero card and never use `--ink-muted` on tiles. Any hero card uses `--cat-writing-g1/g2` with white text.

`src/data/` doesn't exist yet; create it as Rules §4 says.

## 4. Build order

**First the shared code** (Rules §4–5) with every Rules §4 fixture as a test: `src/lib/text-engine.ts`; `src/data/text-limits.ts`, `reading-rates.ts`, `stop-words-en.ts`, `abbreviations-en.ts`; `src/components/tool/text/TextInputPanel.tsx` and `StatTiles.tsx`. Seven pages inherit its bugs, so finish its tests before any UI.

| # | Spec | URL | Own engine | Min words in `<main>` | Don't miss |
|---:|---|---|---|---:|---|
| 1 | 05 Character Counter | `/character-counter/` | shared | 1,200 | limit mode with overflow highlight; exact 100/150/255 samples · **checkpoint** |
| 2 | 01 Words to Pages | `/words-to-pages/` | `page-estimate-engine` | 1,500 | big static table; `absoluteTitle`; font field hidden |
| 3 | 02 Characters to Words | `/characters-to-words/` | `char-word-engine` | 1,100 | range, not one number; "use my writing" calibration |
| 4 | 03 Twitter & Instagram Counter | `/twitter-character-counter/` | `x-count-engine` | 1,300 | §3.2, §3.8, §3.9; dated sources |
| 5 | 06 Word Counter | `/word-counter/` | shared | 1,500 | article fully different from 05 |
| 6 | 07 Reading & Speaking Time | `/reading-time-calculator/` | `reading-time-engine` | 1,400 | BLUF switches on `verified`; timer reducer with a fake clock |
| 7 | 04 Numbers to Words | `/numbers-to-words/` | `number-words-engine` | 1,400 | BigInt rules (§3.5); lakh/crore; SAMPLE check SVG · **checkpoint** |
| 8 | 08 Comma Separator | `/comma-separator/` | `list-engine` | 1,000 | RFC 4180; round-trip tests |
| 9 | 09 Sentence Counter | `/sentence-counter/` | shared | 1,200 | abbreviation merge; `absoluteTitle` |
| 10 | 10 Keyword Density | `/keyword-density-checker/` | `keyword-density-engine` | 1,200 | no "ideal %"; paste only · **checkpoint** |

Add each page's minimum to `minWordCounts` in `scripts/seo-audit.mjs` when you build it.

### For every tool

1. **Engine:** pure functions, `null` for undefined cases, −0 → 0, no `NaN` on empty text. **Every worked example and every "Tests" bullet in the spec is a unit test.**
2. **Component** in `src/components/tool/<slug>/`: calculator, `<Name>InputGuide.tsx` **above** the inputs, `index.ts`. The guide is inline SVG: numbered callouts match numbered labels, live values, focus highlight, `role="img"` + title/desc, tokens only, `<details>` on mobile, one diagram per tab.
3. **UI:** `ToolShell` with the spec's 4 pills; `TabSlider` with `?tab=`; all tabs share one text state; privacy line under every text box; sample text already counted on first paint; counts in a throttled `aria-live="polite"`; Copy and Clear; Paste handles a denied clipboard; drafts are opt-in through `src/lib/storage.ts`. Share URLs carry settings and numbers only.
4. **Page:** follow `src/app/metric-conversion-calculator/page.tsx` (newest pattern) and keep `<main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>`.
   - Title, meta and H1 exactly as the spec (except §3.8).
   - BLUF in the first 60 words with engine numbers.
   - Long-tail tables as static `<table>` + `<caption>`, rendered from the engine.
   - All spec H2s and FAQs (FAQ schema once); HowWeCalculate with formulas, sources and checked dates.
   - AdSlots outside the tool band, never between a text box and its counts.
5. **Keywords:** every Primary, Secondary and Long-tail row of the tool in the keyword file is answered naturally by the H1/H2s, table, FAQ or body. Skip the rows the spec marks FAQ-only, ambiguous or never-in-copy. No stuffing.
6. **Content:** original, specific, written for the person using the tool. No filler, no repeated intro formula across the 10 pages, no "in today's digital world".
7. **Register:** `routes.ts`, `tools-catalog.ts` + test, `calculation-methods.ts`, a unique `ToolArt.tsx` drawing, `Icons.tsx`, `Footer.tsx`, docs 00/01/02/04/06 (tick only with evidence).
8. **Verify:** `npx tsc --noEmit` → `npm run verify` → `graphify update .` → open the page at 390 / 768 / 1280 px, light and dark → paste 1 MB of text. Update the progress file.

## 5. Owner items: use these defaults, don't wait

| Open item | Default now |
|---|---|
| Brysbaert rates (238 / 260 / 183) | `verified: false`, spec 07 labels, formula BLUF |
| Speaking pace 110 / 130 / 150 · 4.7 letters · 250 words per book page · 20 words per sentence · 100 words per paragraph | editable inputs labelled "example, edit" |
| X Premium, X/IG bio, IG comment/username, Discord, Bluesky, TikTok, Facebook limits | in the tool only, with the "Unverified: check <platform>'s help page" label; no number in prose, FAQ, tables or schema |
| Words-to-pages font calibration | hide the font field; print the 500-words convention label |
| Essay and novel lengths | spec 01's uncited fallback (pages by word count); no ranges |
| Flesch scores (09) | leave out |
| Sheets TEXTJOIN · Docs mobile steps · Word shortcut | leave out; use `JOIN` and the verified steps only |
| Sample texts, stop words, abbreviations, pace passage | write your own; list them for owner review |
| Docs/Word parity check · twitter-text conformance cases | skip; list as open |
| SERP pulls | keep the listed order; keep 05 and 06 as two pages |

Log each one under open placeholders in `docs/00-PROJECT-STATUS.md`.

## 6. After tool 10: cross-link pass

1. Add every remaining "Links out" and "Links in" from the 10 specs.
2. Hub links as Rules §5: Counters (Character ↔ Word ↔ Sentence ↔ Keyword Density), Converters (Words to Pages ↔ Characters to Words ↔ Reading Time), Social (Twitter ↔ Character ↔ Characters to Words).
3. Invoice Generator ↔ Numbers to Words; Numbers to Words → Reverse Sales Tax; Comma Separator ↔ Character Counter.
4. Links that carry a value pass the **count**, never the text.

## 7. Final acceptance (all must pass; paste the evidence)

- [ ] `npm run verify` green; 105 catalog tools; 10 new HTML pages in `out/`.
- [ ] Every spec worked example and every §3 correction has a passing test.
- [ ] `out/` for the 10 pages contains no `TODO(`, no `NaN`, no misspelled keyword and no `aggregateRating`.
- [ ] No network API in the new files under `src/lib`, `src/data` and `src/components/tool`.
- [ ] Each page: one H1, one FAQPage, WebApplication + BreadcrumbList, title ≤ 65, meta 70–160.
- [ ] 5-word-shingle Jaccard < 0.30 between every pair of the 10 articles (one-off script, not committed). Character vs Word Counter matters most.
- [ ] No unverified number in any title, meta, H1, BLUF, FAQ or schema.
- [ ] No console or hydration errors; no page-level horizontal scroll at 390 px; keyboard works on every tab.
- [ ] Home, `/tools/`, mega menu, mobile menu, footer and site map all show the new category, coloured, in light and dark.
- [ ] `graphify update .` run; docs 00/01/02/04/06 match the code.

## 8. Checkpoint report (after tools 1, 7 and 10; write it in the progress file, then continue)

- Files changed, and the verify summary lines.
- Worked examples: spec value vs engine value.
- The 4 pills per tool.
- Defaults used from §5, and spec/code mismatches found.
- After tool 10: the §7 checklist with evidence, plus the owner review list.

---

## Paste into Antigravity

```
Read docs/prompts/BATCH6_BUILD_PROMPT.md in full and follow it exactly.

Build ALL 10 Batch 6 (Text & Writing) tools in one run, in the order of section 4. Do not wait for my OK between tools: section 1 replaces every "STOP" in the rules and specs. Write checkpoint reports to docs/prompts/BATCH6_PROGRESS.md and continue.

Start with: AGENTS.md, CLAUDE.md, 00_BATCH6_BUILD_RULES.md, KKCTools_Batch6_Final_Tool_Keywords.md, then section 1 "Before the first tool", section 2 (category), the shared text engine with all its tests, then 05 Character Counter.

Section 3 corrections override the specs. Section 5 defaults answer the owner questions. One tool at a time, npm run verify green before the next (PowerShell, not Git Bash). Never commit or push. Finish with the section 6 cross-links and the section 7 acceptance list with evidence.

If the session was interrupted, read docs/prompts/BATCH6_PROGRESS.md and resume from the first unfinished row.
```
