# Batch 7 Build Progress

**Run started:** 2026-11-25  
**Prompt:** `docs/prompts/BATCH7_BUILD_PROMPT.md`

| Step / Tool | Status | Verification & Evidence |
|---|---|---|
| Section 1 Baseline | Done | `git status --short` clean; `npm run verify` green (`107 test files, 1,348 tests, 105 tools, 140 HTML pages`). |
| Section 2 `Developer & Web` category | Done | `src/lib/tools-catalog.ts` (`CATEGORIES.developer`), `src/styles/tokens.css`, `CategoryTiles.tsx` (5x2), `Footer.tsx` (4x2), `Icons.tsx`, `ToolArt.tsx`, `HowWeCalculate.tsx`. |
| Shared `secure-random` | Done | `src/lib/secure-random.ts` + `src/lib/secure-random.test.ts` (6 tests passing: Web Crypto detection, fail-closed, >65,536 byte chunking, rejection sampling, chi-square uniformity on 10^6 draws, real Web Crypto smoke check). |
| 01 Password Generator (`/password-generator/`) | Done | `src/lib/password-engine.ts`, `src/lib/password-engine.test.ts` (7 tests), `src/data/attack-scenarios.ts`, `src/components/tool/password-generator/*`, `src/app/password-generator/page.tsx`. `npx tsc --noEmit` + `npm run verify` green (`task-24009`). |
| 02 Password Strength Checker (`/password-strength-checker/`) | Done | `src/data/common-passwords.ts` (10,001 SecLists entries), `src/lib/strength-engine.ts`, `src/lib/strength-engine.test.ts` (4 tests incl. <16ms 64-char check), `src/components/tool/password-strength-checker/*`, `src/app/password-strength-checker/page.tsx`. `npx tsc --noEmit` + `npm run verify` green (`task-24145`). |
| 03 UUID / GUID Generator (`/uuid-generator/`) | Done | `src/lib/uuid-engine.ts`, `src/lib/uuid-engine.test.ts` (5 tests), `src/components/tool/uuid-generator/*`, `src/app/uuid-generator/page.tsx`. `npx tsc --noEmit` + `npm run verify` green (`task-24207`). |
| 04 Passphrase Generator (`/passphrase-generator/`) | Done | `src/data/wordlist-passphrase.ts` (7,776 EFF words), `src/lib/passphrase-engine.ts`, `src/lib/passphrase-engine.test.ts` (6 tests), `src/components/tool/passphrase-generator/*`, `src/app/passphrase-generator/page.tsx`. `npx tsc --noEmit` + `npm run verify` green (`task-24252`). |
| 05 Hacker Name Generator (`/hacker-name-generator/`) | Done | `src/lib/generator/pools/hacker.ts`, `src/lib/hacker-name-engine.ts`, `src/lib/hacker-name-engine.test.ts` (5 tests incl. 10,000-sample profanity sweep), `src/components/tool/hacker-name-generator/*`, `src/app/hacker-name-generator/page.tsx`. `npx tsc --noEmit` + `npm run verify` green (`task-24279`). |
| Section 6 Cross-Links & Section 7 Final Checks | Done | Cross-links added across Batch 7 tools, `/comma-separator/`, and `/band-name-generator/`; `src/lib/batch7-security.test.ts` (2 tests); UUID snippet smoke tests (Node, Python, PowerShell); Jaccard max `0.0140` (<0.30); `graphify update .`; final `npx tsc --noEmit` + `npm run verify` green (`task-24311`). **Not checked:** live Chrome DevTools browser pass (light/dark & bad-input UI interaction) and live PostgreSQL execution of `gen_random_uuid()`. |


---

## Review pass (Claude, 2026-11-25)

**Fixed:** UUID page title, meta, H1 and pills back to the spec; its article described tabs that don't exist; added C#, Java, SQL Server and MySQL snippets and two FAQs. White text on lime buttons and badges in dark mode. Unreadable note under Passphrase and Hacker. Mega menu cut off at 1280 px. EFF list moved out of the first bundle (`passphrase-core.ts`). Custom symbols limited to printable ASCII. Duplicate words in the hacker pool. Guess times under 10 years show one decimal. Wrong or unsourced claims removed ("123456" time, cracking-list claims, username rules, filter completeness). Security scan now includes the data files. Tests: `batch7-review.test.ts`.

**Checked in Chrome:** every tab, 390 / 1280 light and dark; the first tab at 768; offline generation on 4 tools and the strength checker; missing Web Crypto on tools 1, 3 and 4; no password or passphrase in URL, storage or dataLayer; typing in the strength checker at most 7.4 ms; v5 and v7 RFC values on screen; bad inputs.

**Not done:** C#, Java and SQL snippets not run; 4A row-by-row table; 1024 px menu and screen readers.
