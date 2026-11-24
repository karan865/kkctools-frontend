# Batch 7: Builder Prompt (Antigravity / Gemini)

> **Goal:** build **all 5** Batch 7 tools (Developer & Web) in one run, from their build specs.
> **Rewritten:** 2026-11-25, for the code after Batch 6 (105 tools, 9 categories).
> **Result:** 110 catalog tools, 5 new routes, a `Developer & Web` category, `npm run verify` green, and a browser check.

- `B7` = `docs/keywords analysis/Batch 7 - Developer & Web Tools/`
- **Keyword file:** `B7/2. Batch 7 - filtered master keywords/KKCTools_Batch7_Final_Tool_Keywords.md`
- **Rules:** `B7/3. All Blogs Data/00_BATCH7_BUILD_RULES.md`
- **Specs:** `B7/3. All Blogs Data/NN_<Name>/NN_<Name>_BUILD_SPEC.md`
- **Competitor analyses:** `B7/3. All Blogs Data/NN_<Name>/NN_<Name>_Competitor_Analysis.md` (what already ranks, its errors, the gaps, the FAQ bank)

**Which file wins:** `AGENTS.md` → §3 here → §5 here → Rules → spec → keyword file → competitor analysis.

---

## 0. Obey always

1. **Read in full first:** `AGENTS.md`, `CLAUDE.md`, the Rules, the keyword file, §3 here. Right before each tool, read its spec **and** its competitor analysis in full (including spec §0–§1, which hold the keyword-to-section map).
2. `graphify query` before searching code; `graphify update .` after code changes.
3. Run `npm run verify` from PowerShell or the VS Code terminal, never Git Bash.
4. **Never:**
   - commit, push, or change `tsconfig.json`, `next.config.ts`, `package.json` or `public/_headers`;
   - add a dependency;
   - make a runtime network call. `check:no-network` does not scan all of `src/lib` or `src/data`, so check those yourself;
   - use `Math.random` or import `src/lib/generator/rng.ts` in tools 1–4;
   - store, log, send, or put in a URL any generated secret or typed password. No `<form>` and no `name` attribute around a secret input;
   - write hacking or cracking instructions, invented security statistics, or brand comparisons;
   - copy competitor text, add ratings, print a misspelled keyword (`uiid`, `uuuid`, `guid generat`), or let `TODO(` reach the HTML.
5. **Report honestly.** In Batch 6 the progress file said "Exact match" for cases that were never run. A row may say "match" only if a named test asserts it. Paste test names, not adjectives.
6. Don't touch other tools' pages, except the links in §6 and shared category files in §2. Don't touch `docs/Google Search console data/`.

## 1. One run, no waiting

The owner approved all 5 tools. **This replaces every "STOP" in the Rules and specs.** Keep `docs/prompts/BATCH7_PROGRESS.md` current (tool · engine · tests · component · page · verify · browser check). If interrupted, read it and resume at the first unfinished row.

One tool at a time; the next starts only when verify is green. **Stop and ask only if** a verify step fails after 3 real attempts, a worked example differs and §3 doesn't explain it (never edit the test to pass), a fix needs a dependency or config change, or a word list can't be downloaded (§5).

First: check `git status`, run `npm run verify`, and record the baseline.

## 2. New category `Developer & Web` (once, first)

Id **`developer`**, order 10. Lime is unused by the other nine categories.

| File | Change |
|---|---|
| `src/lib/tools-catalog.ts` + test | `CategoryId`, `CATEGORIES.developer`; count 105 → +1 per tool; update the hard-coded first tool to whatever the real sort gives |
| `src/styles/tokens.css` | Light `--cat-developer #4D7C0F`, `-soft #ECFCCB`, `-ink #3F6212`, `-deep #365314`. Dark `#A3E635`, `rgba(163,230,53,0.14)`, `#BEF264`, `#D9F99D`. Fixed `-g1 #4D7C0F`, `-g2 #3F6212` (white text 4.99:1 / 7.08:1) |
| `home/CategorySection`, `ToolCard`, `ToolArt` CSS | `.developer`, `.cat-developer`, `.cat_developer` |
| `CategoryTiles.tsx` + CSS | 10 tiles: 5 × 2 on desktop, 2 columns on mobile |
| `ToolCard.tsx`, `HomeHero.tsx` + CSS, `src/app/page.tsx` | label, chip, band |
| `Header.tsx`, `MobileMenu.tsx` | `categoryKeys`; the 5-column mega menu becomes exactly 5 × 2 |
| `Footer.tsx` + CSS | 8th column: 4 × 2 grid on desktop; recheck every breakpoint |
| `seo/HowWeCalculate.tsx` | `developer` must not show the construction disclaimer. Use: "Strength and time figures are estimates from the stated assumptions." for the password pages, and the text-tool wording for the others |
| `Icons.tsx`, `ToolArt.tsx` | **A different icon and drawing for each of the 5 tools** (key, gauge, hex ID, word tiles, terminal) |

## 3. Corrections (these override Rules and specs; each gets a test)

**Password**
1. **"At least one of each" in spec 01 is biased.** Place-one-then-fill-then-shuffle does not give every valid password the same chance: for sets {a} and {b,c} at length 4, 2+2 mixes come out more often than 1+3. The spec's entropy formula assumes a uniform choice, so it would be wrong. **Draw the whole password from the pool and redraw until every set is present.** Acceptance is about 82% at length 16 and 7% at length 4. Cap at 100,000 tries, then show an error. Test the distribution on a tiny pool against the exact uniform one.
2. The sets must not overlap. Remove from the custom symbols any character already in another selected set; an empty set is an error, not a silent drop. If length < number of required sets, block generation and say why.
3. Look-alike pool is 89 (24 + 25 + 8 + 32): 103.61 bits plain, **103.23** with at least one of each. The default result (94, length 16, require-each) is **104.59**.

**Strength**
4. `P@ssw0rd` is **8 r**, not 4 r: the spec's own rules give ×2 for the capital and ×2 for each of two swap kinds. With the list in §5, r = 1, so **8 guesses, 3 bits**. Real ranks: `password` 1, `123456` 2, `qwerty` 5, `summer` 78, `abcd1234` 747, `aaaaaaaa` 807. So `abcd1234` stays 512 and `aaaaaaaa` stays 208 (both lower than their rank).
5. `total = m! × Π guesses` can't be minimised with a plain one-dimensional DP: keep the best product **per segment count m**, then take the minimum. Use log2 values (94¹⁶ overflows safe integers). Analyse the first 128 code points and say so.
6. Every sentence on the page comes from the engine. The spec's "about 8 hours … and it's on a list" sample mixes two different passwords; don't reuse it.
7. The list has slurs and sexual words. It may be *matched* in full, but the "most common passwords" table must skip entries that `isOffensive` flags and say "n entries hidden".

**UUID**
8. TypeScript target is ES2017: no BigInt literals (`10n`), no `v` or `s` regex flags, no lookbehind or named groups. They pass vitest and fail `next build` or older Safari. Use `BigInt('10')`. Run `npx tsc --noEmit` after every engine.
9. v7 keeps the last timestamp when the clock goes backwards. Test that, counter overflow, and 1,000 IDs in one fake millisecond.
10. Node snippet: `import { randomUUID } from 'node:crypto'`. Don't claim a Node version for the global. Don't call `NEWID()` v4.

**Passphrase**
11. The EFF long list has 4 words with a hyphen (`drop-down`, `felt-tip`, `t-shirt`, `yo-yo`). Keep all 7,776, allow `-` in the hygiene test (`^[a-z-]{3,9}$`). No word is a prefix of another (checked), so "no separator" loses no entropy.
12. The spec's "none on the offensive-words list" test fails on clean words: `isOffensive` matches **substrings** (`peacock`, `therapist`). Don't filter the list; filtering changes its size and the 12.925 bits per word.
13. Some option mixes can produce the same text two ways, so adding their bits overstates strength. Disable "random digit separator" together with "add a number", and "random symbol separator" together with "add a symbol". With a number or symbol that can equal the fixed separator, exclude the separator from the symbol set.

**Hacker names**
14. Spec 05 says the filter matches whole terms. It matches substrings after removing symbols, and it does **not** undo leet (`sh1t` passes). In the new engine, check the readable form, the output, and a de-leeted copy (0→o, 1→i, 3→e, 4→a, 5→s, 7→t, @→a, $→s, !→i). Don't edit `offensive.ts` or the band engine.

**All tools (bugs from Batch 6; don't repeat them)**
15. **No `useSearchParams` and no page-level Suspense:** they left 5 tools as "Loading…" in the static HTML. Use `src/components/tool/text/useTabParam.ts` and `TabSlider`. Read options from the URL in an effect. On first load the static HTML shows the real inputs and a masked placeholder; generation happens after mount.
16. **Node is not Chrome.** Check each tool in a real browser; no React hydration errors.
17. Undefined CSS variables render as nothing. Use only variables that exist in `tokens.css` (`--border` and `--surface-alt` **don't**; use `--line`, `--surface-2`). Inputs need a visible border.
18. On the purple ToolShell band, text outside a card must be white; inside cards use `var(--ink)` / `var(--ink-soft)`.
19. SVG `<text>` uses `y`, not `cy`. No overlapping labels. The guide sits above the inputs, is live, and never draws a real secret.
20. Every input named in a pill, tab or article must exist and change the result. Every toggle gets a test or a manual check.
21. Wrap clipboard calls in try/catch; `toLocaleString('en-US')`; one `h1`; breadcrumb = Tools › Developer & Web › page (the component adds Home itself).

## 4. Build order

| # | Spec | URL | Min words in `<main>` | Watch |
|:-:|---|---|:-:|---|
| 1 | 01 Password Generator (+ `secure-random`, `password-engine`, `attack-scenarios`) | `/password-generator/` | 1,300 | §3.1–3.3 · **checkpoint** |
| 2 | 02 Password Strength Checker | `/password-strength-checker/` | 1,400 | §3.4–3.7 |
| 3 | 03 UUID Generator | `/uuid-generator/` | 1,600 | §3.8–3.10 · **checkpoint** |
| 4 | 04 Passphrase Generator | `/passphrase-generator/` | 1,200 | §3.11–3.13 |
| 5 | 05 Hacker Name Generator | `/hacker-name-generator/` | 800 | §3.14 · **checkpoint** |

Add each minimum to `minWordCounts` in `scripts/seo-audit.mjs`.

### 4A. What the competitor analyses require (gap checklist)

Analyses come from live pages read on 2026-11-14. There is no Semrush SERP export for this batch. Never name, quote or mock a competitor on our pages; use this list to be more complete and more correct.

| Tool | Must beat them on (seen on 0 or 1 of their pages) | Their errors we must not repeat |
|---|---|---|
| Password | named RNG method, at least one of each, bulk, bits, Wi-Fi preset, custom symbols, sourced advice (each 0 of 4) | wrong 26^10, wrong symbol count, "2FA makes login impossible", unsourced "81% of breaches" |
| Strength | fully offline **and** disclosed rates for several scenarios (0 of 5), pattern breakdown | figures that differ between table, FAQ and example; "billions of years" with no rate |
| UUID | language snippets, anatomy diagram (0 of 4), v5, Max, validator with v7, v6 and v1 time | citing RFC 4122 as current; "v7 is always greater"; unexplained "RFC 7515" option; "74+ random bits" |
| Passphrase | list name + size + licence + exact bits together, bulk, capitals and number options | tiny list called "very strong"; crack times that contradict; "computer randomness is predictable"; promising a generator and not having one |
| Hacker | five styles, length and character rules, seed word, readable leet (no page has all) | template code shown to users; `#` links; options that don't match controls; false "Neo anagram" claim |

- Every FAQ in the analysis bank (§6) appears once, except UETR, unless the spec merges or drops it.
- Every ✅ any competitor has in the analysis feature matrix is either in our tool or listed in the progress file with the reason (network, dependency, out of scope).
- **Analysis conflicts:** its "place one, fill, shuffle … unbiased" line is wrong (§3.1). Its ULID / NanoID and "pronounceable" ideas, the platform-username hints and the hacker tool's Web Crypto RNG are optional: leave them out. Its "NIST allows password managers and paste" is not quoted (§5).
- **Keyword file §4–5:** never target the rejected groups (brand, log-in recovery, breach checks, hacking, "The Password Game", non-English, Unturned).

**For every tool**
1. **Engine:** pure, randomness injected, fails closed when Web Crypto is missing. Every spec worked example and "Tests" bullet is a test. Statistical tests use a seeded byte source, so they can't flake.
2. **Component:** tool, `<Name>InputGuide.tsx`, `index.ts`; `ToolShell` with the spec's 4 pills; Copy only on click; Hide/Show for secrets; privacy line; Clear.
3. **Page:** follow `src/app/comma-separator/page.tsx`. Title, meta and H1 exactly as the spec. Answer in the first 60 words, without the label "BLUF". All spec H2s and FAQs, FAQ schema once, tables with `<caption>`, HowWeCalculate with sources and checked dates.
4. **Keywords:** answer every Primary, Secondary and Long-tail row of that tool naturally in an H2, table, FAQ or body, except rows marked broad, misspelled or hacking intent. No stuffing.
5. **Content:** only Rules §3 sources for security facts. No "billions of years" or "ideal" claims beyond engine output with its assumption shown. Plain words.
6. **Register:** `routes.ts`, catalog + test, `calculation-methods.ts` (real sources only), icon, art, footer, docs 00/01/02/04/06.
7. **Verify:** `npx tsc --noEmit` → `npm run verify` → `graphify update .` → browser check (§7).

## 5. Owner items: use these defaults

| Item | Default |
|---|---|
| Passphrase list | EFF long list from `https://www.eff.org/files/2016/07/18/eff_large_wordlist.txt` (7,776 lines). Download once at build time into `src/data/wordlist-passphrase.ts`. Show the credit "EFF Long Wordlist, CC BY" with links |
| Common passwords | SecLists `Passwords/Common-Credentials/10k-most-common.txt` (MIT, `github.com/danielmiessler/SecLists`). Save in `src/data/common-passwords.ts`, order kept, copyright and licence text in the file. Note its actual size on the page instead of "10,000" if it differs |
| Loading both lists | `import()` as same-origin chunks, preloaded after mount. Never in the first page bundle |
| Can't download a list | Finish the other tools, then stop and ask. **Never invent or retype a list from memory** |
| Strength estimator | our own; bands labelled as ours |
| v5 SHA-1 | `crypto.subtle.digest` |
| v3 / MD5 | own small MD5, tested with RFC 1321 vectors, labelled legacy |
| UETR | hidden; no text about it |
| WPA2 8–63 | state it with its secondary-source label |
| CISA page | cite only with "archived page" |
| NIST | cite SP 800-63B-4 and the URL; no publication-status claim; no password-manager quote |
| Attack rates | editable, labelled "assumptions" |
| Ads | no AdSlot on tools 1, 2 and 4 |
| Site analytics | GTM loads site-wide. Don't change it. Say "Your password is not saved or sent", never "no third-party scripts" |
| Hacker word bank | write it, no real aliases, people or brands; list it for owner review |
| UUID snippets | Python, JS, PowerShell: run if installed; mark the others "from official docs, not run" in the progress file |
| Missing UUID export, SERP pulls | skip, list as open |

## 6. After tool 5: links

Password ↔ Strength ↔ Passphrase · Password ↔ UUID · UUID ↔ Comma Separator · Hacker ↔ Password, Passphrase · Band Name Generator hub → Hacker (one "More name generators" link; change nothing else there). Links carry options such as `?length=16`, never secrets. Link a page only once it exists.

## 7. Acceptance (paste evidence)

- [ ] verify green; 110 tools; 5 new pages.
- [ ] Every worked example and §3 item mapped to a test name.
- [ ] §4A done: FAQ bank, feature matrix and keyword map (spec §1) ticked row by row in the progress file.
- [ ] A test scans the source of tools 1–4 (engines, data, components) for `Math.random`, `generator/rng`, `fetch(`, `localStorage`, `sessionStorage`: none.
- [ ] `out/` for the 5 pages: no `TODO(`, `NaN`, "Loading", generated secret, misspelling or `aggregateRating`; real inputs present in the HTML.
- [ ] Browser, every tab, 390 / 768 / 1280 px, light and dark: no console or hydration error, no horizontal page scroll, readable text, no overlapping SVG labels.
- [ ] Loaded once, then offline: all 5 still generate or check, including the common-password list.
- [ ] Web Crypto removed in a test: nothing is generated and the error shows.
- [ ] 64-character typing in the strength checker stays smooth (record the ms).
- [ ] After using each tool, the URL, storage and `dataLayer` contain no secret.
- [ ] One H1, one FAQPage, WebApplication + BreadcrumbList, title ≤ 65, meta 70–160.
- [ ] 5-word-shingle Jaccard < 0.30 between every pair of the 5 pages (Password vs Passphrase matters most).
- [ ] Home, `/tools/`, mega menu, mobile menu and footer show the category, coloured.
- [ ] Band engine tests unchanged and green; docs updated; `graphify update .` run.

## 8. Checkpoint report (after tools 1, 3 and 5, then continue)

Files changed · verify lines · worked example → engine value → test name · pills · defaults used · anything **not** done or **not** checked. After tool 5, add the §7 list with evidence and the owner review list.

---

## Paste into Antigravity

```
Read docs/prompts/BATCH7_BUILD_PROMPT.md in full and follow it exactly.

Build ALL 5 Batch 7 (Developer & Web) tools in one run, in the order of section 4. Do not wait for my OK: section 1 replaces every "STOP" in the rules and specs. Write checkpoints to docs/prompts/BATCH7_PROGRESS.md and continue.

Start with: AGENTS.md, CLAUDE.md, 00_BATCH7_BUILD_RULES.md, KKCTools_Batch7_Final_Tool_Keywords.md, then section 1 baseline, section 2 (category), secure-random with its tests, then 01 Password Generator.

Before each tool, read its BUILD_SPEC and its Competitor_Analysis in full and complete the section 4A checklist. Section 3 corrections override the specs. Section 5 defaults answer the owner questions. One tool at a time, npm run verify green before the next (PowerShell, not Git Bash). Check every tab in a real browser. Never commit or push. Write "match" only when a named test proves it; list anything you did not do. Finish with section 6 links and the section 7 acceptance list with evidence.

If the session was interrupted, read docs/prompts/BATCH7_PROGRESS.md and resume from the first unfinished row.
```
