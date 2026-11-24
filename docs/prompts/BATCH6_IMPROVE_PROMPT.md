# Batch 6: Improvement Prompt (Antigravity / Gemini)

> **Goal:** one small, measured round of fixes on the 10 live Text & Writing pages. No new tools, no new URLs.
> **Written:** 2026-11-25, from a keyword-by-keyword check of the built pages.
> **Do not mix with Batch 7.** Start only when `git status` shows no half-built Batch 7 work.

- `B6` = `docs/keywords analysis/Batch 6 - Text & Writing Utilities/`
- **Read per tool, in full, right before changing it:** its `BUILD_SPEC.md` **and** `Competitor_Analysis.md` in `B6/3. All Blogs Data/NN_*/`, and its rows in `B6/2. …/KKCTools_Batch6_Final_Tool_Keywords.md`.
- **Which file wins:** `AGENTS.md` → this file → `00_BATCH6_BUILD_RULES.md` → spec → keyword file → competitor analysis.

## 0. Obey always

1. Read `AGENTS.md` and `CLAUDE.md` first. `graphify query` before searching; `graphify update .` after changes. Run `npm run verify` from PowerShell.
2. **Never:** commit or push; change a URL, config or dependency; add a network call; use `useSearchParams`; invent a number; stuff keywords; print a misspelling (`coutner`, `sentance`, `chacter`, `countre`); copy competitor text.
3. **Do not change titles, metas or H1s**, except where §2 says so. The pages have just been indexed or are waiting for it.
4. Do not weaken or delete tests in `src/lib/batch6-review.test.ts`. Keep the "unverified" and "estimate" labels.
5. A phrase that is already answered in other words is **not** a gap. Add a phrase only where it reads naturally; at most one sentence or one H2 per keyword group.
6. Progress file: `docs/prompts/BATCH6_IMPROVE_PROGRESS.md`. Write "done" only with the test name or the file and line. List what you did not do.

## 1. All 10 pages

| # | Fix |
|:-:|---|
| A1 | Remove the visible labels "BLUF", "Bottom Line Up Front", "Quick Answer (BLUF)". Keep the answer, first 60 words, plain words |
| A2 | Cut openers such as "Whether you are refining…" and adjectives such as "comprehensive", "effortlessly", "precision". Same facts, shorter |
| A3 | Headings inside the tool band are not page sections: the Character Counter `h2` "Key Character Metrics" becomes a non-heading label. The outline starts at the article |
| A4 | **In-sentence links** (not only "Related" lists), 1–2 new ones per source page. Counts below are non-utility pages that link now |
| A5 | Each tool gets its own catalog icon and `ToolArt` drawing. Today Sentence, Comma, Word, Twitter and Character share `pencil`; Keyword Density and Reading Time share `zap` |
| A6 | Every page ends with a Related block of 3–5 real links. Reading Time, Numbers to Words, Comma, Sentence, Keyword Density and Character have none |

**A4 link map**

| Target (now) | Add from |
|---|---|
| Numbers to Words (1) | Comma Separator, Reverse Sales Tax, Word Counter, Invoice Generator (has one) |
| Keyword Density (2) | Sentence Counter, Words to Pages |
| Characters to Words (3) | Character Counter, Reading Time |
| Twitter Counter (3) | Sentence Counter |
| Comma Separator (3) | Numbers to Words, Word Counter (list clean-up context) |
| Reading Time (3) | Characters to Words, Sentence Counter (has one; check it is in a sentence) |
| Words to Pages (4) | Sentence Counter, Character Counter |

Skip a link where the sentence would be forced.

## 2. Page by page (priority order)

### P1: most demand or the clearest gap

**Word Counter** (`/word-counter/`)
- The Google Docs group is the biggest here: `how to show word count on google docs` 8,100/19, `how to view…` 2,400/15, `how to check…` 9,900/29, `how to see how many words in google docs` 2,400/25. **One** H2: "How to Check and Show Word Count in Google Docs", with numbered steps. Only the verified steps in Rules §3; anything else (mobile menus, "display while typing") needs an official Google page you open now, with link and date, or is left out.
- Same for Word: H2 "How to Check and Show Word Count in Microsoft Word", Rules §3 steps only.
- New H2 "Why Word Counts Differ Between Tools" (from spec 06 and its analysis: hyphens, numbers, links, headers and footnotes). Explain with our engine's numbers for one sample line (hyphen on/off, numbers on/off).
- New FAQ: "What are stop words, and why ignore them?"
- Add the case-sensitive toggle for the frequency table (`getNgrams` option + test).

**Numbers to Words** (`/numbers-to-words/`)
- Say "number to words converter" and "amount in words" once each, naturally (`number to words converter` 880/0, `amount words converter` 2,400/2).
- Bulk mode inside the Words tab: one number per line → one result per line, Copy all, `.txt` download; invalid lines show a reason and don't stop the rest; cap 500 lines.
- Decimal style: "point" (default) or fraction ("and thirty-four hundredths"). Tests: 3.14, 0.5, 2.05, 1.000, 7 decimals; past millionths fall back to "point" and say so.
- New H2 "Names of Large Numbers": table from the engine, thousand → decillion, plus lakh and crore.
- Not in this round: EUR, GBP or other currencies.

**Character Counter** (`/character-counter/`)
- Toggles from spec 05: ignore punctuation, ignore digits, NFC. They change the **headline count and the limit**, stay off/off/on by default, and the page says what changed. Tests for each, and for overflow position with a toggle on.
- Answer `textarea counter` (1,000/16) in the existing JavaScript FAQ: say "textarea".
- Do **not** chase "character counter UI" or misspellings.

### P2

**Words to Pages:** the page shows two near-identical tables (live and static). Keep one: the live table with `<caption>`, pre-rendered at defaults, with sentences and paragraphs columns. Add one FAQ line for "300 words" and "How long should an essay be?" inside the existing essay answer (no ranges).

**Characters to Words:** same, one table. Keep the per-row ranges.

**Sentence Counter:** clicking a long sentence in the Sentences list selects it in the text box and scrolls there (map by source offsets, repeated sentences included; test the offset function). Say "lines counter" and "paragraph number" once where they fit.

**Keyword Density:** tables sortable by term, count, density with real buttons and `aria-sort`; KWIC click selects the hit in the text (test offsets). One FAQ that answers "How many keywords per page for SEO?" without a number. Say that it counts pasted text, for "count keywords on website".

### P3: only if P1 and P2 are green

- **Reading Time:** FAQ/table wording "How many words for a 4-minute speech", "7-minute speech", "How long is 2,000 words" where a row already answers it. Ring colour changes in the last 10% and on overrun, with a text cue too.
- **Twitter:** rewrite the limits H2 as "Instagram, LinkedIn, Threads and YouTube Character Limits". Discord stays unverified and out of the heading. Use "tweet character count" and "IG" once each.
- **Comma Separator:** "comma delimited", "add commas to a list" once each where they fit.
- **Draft saving** (Word, Character): opt-in, off by default, through `src/lib/storage.ts`, with a Clear button. If added, the privacy line must change to match ("…or stored, unless you turn on drafts"). If that can't be done cleanly, skip it.

## 3. Leave alone (on purpose)

Essay and novel length ranges; Flesch scores; Discord, bio and Premium numbers; "ideal" density; "word checker" (unclear intent); CSV/JSON import; one page per number; new category work; other batches' pages except the A4 links.

## 4. Verify each page before the next

1. Unit tests for every new rule; `npx tsc --noEmit` (ES2017: no BigInt literals, no lookbehind, no `v`/`s` flags); `npm run verify`.
2. Real browser at 390, 768 and 1280 px, light and dark, every tab: no console or hydration error, no page-level horizontal scroll, readable text. Node and Chrome segment text differently, so check counts in Chrome.
3. Paste 1 MB of text into Word and Character Counter; record the delay and whether typing stays usable.
4. New controls work by keyboard and have labels.

## 5. Acceptance (paste evidence)

- [ ] verify green; 10 pages, same URLs, titles, metas and H1s.
- [ ] Table: page → change → test name or file:line.
- [ ] `out/` for the 10 pages: no `BLUF`, `TODO(`, `NaN`, "Loading", misspelling, `aggregateRating`; one H1; FAQ schema matches visible FAQs.
- [ ] Every spec FAQ is answered on its page, except owner-blocked ones (list them).
- [ ] Inlink count per page, before and after.
- [ ] 5-word-shingle Jaccard < 0.30 for every pair.
- [ ] Word count per page still above `minWordCounts`.
- [ ] No unsourced number added (list every new number and where it comes from).
- [ ] `routes.ts` `updated` date changed only for pages whose content changed. `docs/00`, `graphify update .` done.
- [ ] Last line of the progress file: "Freeze these pages for 28 days from deploy."

---

## Paste into Antigravity

```
Read docs/prompts/BATCH6_IMPROVE_PROMPT.md in full and follow it exactly.

Improve the 10 live Batch 6 pages in one run: section 1 first, then P1, P2, P3 in order. Before each page, read its BUILD_SPEC and its Competitor_Analysis in full. Do not change URLs, titles, metas or H1s. No new tools or pages.

One page at a time, npm run verify green before the next (PowerShell, not Git Bash), and check every tab in a real browser. Never commit or push. Write docs/prompts/BATCH6_IMPROVE_PROGRESS.md; say "done" only with a test name or file:line, and list what you did not do. Finish with the section 5 acceptance list with evidence.

If interrupted, read the progress file and resume from the first unfinished row.
```
