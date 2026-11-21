# Batch 7 — Build Rules (Developer & Web Tools: passwords, UUIDs, names)

> **Read before every Batch 7 spec.** Builder: Antigravity / Gemini.
> **Inputs used:** `KKCTools_Batch7_Final_Tool_Keywords.md` (Semrush US, Oct 2026), 5 competitor analyses, official sources opened on 2026-11-22 (§3).
> **Written:** 2026-11-22

---

## 0. Status: provisional (no Semrush SERP export)

Rank chances come from keyword data and known SERP owners.

**Export problem (keyword file):** `2. uuid generator online 0-15 %.csv` is a copy of the password export, so the UUID cluster only has KD 15–29 rows. `TODO(owner)`: re-export it before setting the UUID tier.

`TODO(owner)`: pull the top 10 (Domain AS) for `generate secure password`, `online password generator`, `password strength tester`, `password complexity checker`, `random uuid`, `guid generator`, `passphrase generator`, `generate passphrase`. Also the missing heads: `password generator`, `random password generator`, `strong password generator`, `uuid generator`, `password strength checker`, `pin generator`.

**This batch is only 5 tools** from 2 seeds. Keyword file §6 lists the next seeds to export (JSON formatter, Base64, URL encode, hash, QR, regex, JWT, timestamp, colour, lorem ipsum, slug, cron, diff, random number).

## 1. Project rules (AGENTS.md wins on any conflict)

**Never:**
- network calls in tool code (`npm run check:no-network` must pass): no breach APIs, no "Have I Been Pwned", no public UUID API;
- `Math.random` anywhere in #1–#4 (lint rule + test);
- storing, logging or sending a password, a passphrase or a typed password (no analytics events on input, no localStorage, never in a share URL);
- hacking, cracking or "how to hack" content, whatever the volume;
- invented security statistics ("81% of breaches…", "billion years") or rules that aren't in a §3 source;
- password-manager brand comparisons, affiliate links or product picks;
- new npm dependencies (no zxcvbn, no uuid package, no word-list packages) unless the owner approves;
- copying competitor text, names or word lists;
- ratings or `aggregateRating`;
- committing or pushing.

**Always:**
- Use `TODO(owner)` for owner-supplied facts.
- Engine first: pure functions; randomness injected so tests can use a fixed byte source.
- Every number in the BLUF, examples and FAQ comes from the engine.
- **Each spec's worked example is a unit test.**
- Run `npm run verify` from PowerShell or the VS Code terminal, never Git Bash.
- graphify: `graphify query` before searching code; `graphify update .` after changes; run from PowerShell; exe `$(ls ~/AppData/Roaming/Python/*/Scripts/graphify.exe | head -1)`.

## 2. Security and trust rules (the reason these pages can win)

1. **Randomness = Web Crypto only, and it fails closed.**
   - `crypto.getRandomValues` (max 65,536 bytes per call, MDN) and `crypto.randomUUID` (v4, secure contexts only, MDN).
   - **The existing `src/lib/generator/rng.ts` must NOT be used for #1–#4:** it is a seeded Mulberry32 PRNG with a `Math.random` fallback, which is fine for band names but not for secrets.
   - If Web Crypto is missing, show "Your browser can't generate secure random values" and generate nothing.
2. **No bias:** pick indexes with rejection sampling (§4); shuffle with Fisher–Yates using the same source.
3. **The method is stated on the page** in plain words ("made with your browser's Web Crypto random generator; nothing is sent or saved").
4. **Advice only from §3 sources,** quoted carefully: NIST rules are for *verifiers* (websites); we turn them into user tips without changing their meaning.
5. **Guess-time figures are estimates with the assumed guesses per second shown and editable** (§4 scenarios). Always "on average, half the possibilities", stated.
6. **Strength checker input:** `type="password"`, show toggle, `autocomplete="off"`, `spellcheck="false"`, `autocapitalize="off"`; the page tells users to test a *similar* password rather than their real one.
7. **Examples are generated live,** never fixed strings people might copy (except clearly-labelled bad examples like `123456`).

## 3. Sources opened on 2026-11-22 (cite these; quote briefly)

| Fact | Value | Source | Status |
|---|---|---|---|
| Password length | single-factor: minimum 15 characters; with MFA: minimum 8 | NIST SP 800-63B rev 4, §3.1.1.2 item 1 (pages.nist.gov/800-63-4/sp800-63b.html; "supersedes SP 800-63B") | ✅ (final-status date not on the page: `TODO(owner)` confirm) |
| Max length | verifiers SHOULD permit at least 64 | same, item 2 | ✅ |
| Characters | SHOULD accept printing ASCII + space, and Unicode (each code point = 1 character), NFC normalisation | same, items 3–4 | ✅ |
| Composition rules | "SHALL NOT impose other composition rules (e.g., requiring mixtures of different character types)" | same, item 5 (and §3.1.1.1) | ✅ |
| Periodic change | "SHALL NOT require subscribers to change passwords periodically"; force a change on evidence of compromise | same, item 6 | ✅ |
| Blocklist | check new passwords against a blocklist; the entire password is compared | same | ✅ |
| Password managers / paste | allowed | same (unread part) | ⚠ summary only: `TODO(owner)` confirm before quoting |
| CISA advice | "long, random, unique passwords with a password manager"; "At least 16 characters"; passphrase of "4 – 7 unrelated words" | cisa.gov/secure-our-world/use-strong-passwords | ⚠ page marked **archived** ("may not reflect current policy"): cite with that caveat or `TODO(owner)` find the current page |
| Special characters | 33 including space (32 without): `` !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~ `` | OWASP "Password Special Characters" (community.owasp.org, CC BY-SA 4.0) | ✅ (state the set as fact; don't copy their table) |
| WPA2 passphrase | 8–63 printable ASCII (codes 32–126) | Wikipedia "Wi-Fi Protected Access", citing IEEE 802.11i-2004 Annex H.4.1 | ⚠ secondary source: `TODO(owner)` confirm against IEEE |
| EFF word lists | short lists 1,296 words (4 dice); long list rolled with 5 dice (6⁵ = **7,776**); "we suggest making a six-word passphrase" | eff.org/dice | ✅ |
| EFF licence | "Creative Commons Attribution 4.0 International License (CC-BY), unless otherwise noted" (badge links to 3.0 US) | eff.org/copyright | ✅ (credit required; `TODO(owner)` approve using the list) |
| Common-password lists | SecLists is MIT-licensed; `Passwords/Common-Credentials/` has `10k-most-common.txt`, `Pwdb_top-10000.txt`, `100k-most-used-passwords-NCSC.txt` … | github.com/danielmiessler/SecLists (LICENSE) | ✅ licence; the NCSC original page was removed, so its own licence is unverified: `TODO(owner)` pick the file |
| UUID standard | RFC 9562 (May 2024) "obsoletes RFC 4122"; versions 1–8; Nil (all 0) and Max (all 1); text hex may be upper, lower or mixed case | rfc-editor.org/rfc/rfc9562 | ✅ |
| v7 layout | unix_ts_ms 48 · ver 4 · rand_a 12 · var 2 · rand_b 62; monotonicity in §6.2 (method 1: a counter right after the timestamp) | same | ✅ (from the RFC summary; builder re-reads §5.7 and §6.2) |
| Namespaces | DNS `6ba7b810-9dad-11d1-80b4-00c04fd430c8`, URL `…b811…`, OID `…b812…`, X.500 `…b814…` | same, Table 3 | ✅ |
| Test vectors | v5(DNS, "www.example.com") = `2ed6657d-e927-568b-95e1-2665a8aea6a2`; v3 = `5df41881-3aed-3515-88a7-2f4a814cf09e`; v7 example `017F22E2-79B0-7CC3-98C4-DC0C0C07398F` | same, Appendix A | ✅ **and reproduced with node** (§4) |
| Browser APIs | `crypto.randomUUID()` = v4, secure context, widely available since March 2022; `getRandomValues` ≤ 65,536 bytes | MDN | ✅ |
| Python | `uuid.uuid4()`, `uuid.uuid5()`, `uuid.uuid7()` ("Added in version 3.14"), `uuid.NIL` / `uuid.MAX` (3.14) | docs.python.org/3/library/uuid.html | ✅ |
| .NET | `Guid.CreateVersion7()` (.NET 9, 10, 11), `Guid.NewGuid()` | learn.microsoft.com | ✅ (NewGuid's version via PowerShell docs: v4) |
| PowerShell | `New-Guid` creates a Version 4 UUID; `New-Guid -Empty` = nil | learn.microsoft.com New-Guid | ✅ |
| Java | `UUID.randomUUID()` = type 4; `UUID.nameUUIDFromBytes()` = type 3; no v7 in `java.util.UUID` (Java 21) | docs.oracle.com | ✅ |
| PostgreSQL | `gen_random_uuid()` and `uuidv4()` = v4; `uuidv7()` = v7 | postgresql.org docs (current = 19) | ✅ (the version that added `uuidv7()` isn't on the page: say "recent PostgreSQL versions; check your version's docs") |
| SQL Server | `NEWID()` returns `uniqueidentifier`, "compliant with RFC4122" | learn.microsoft.com | ✅ (page doesn't say v4: don't claim it) |
| MySQL | `UUID()` returns a version 1 UUID | dev.mysql.com 8.4 | ✅ (from summary; builder re-checks) |
| SWIFT UETR | — | swift.com (403) | ❌ `TODO(owner)`: confirm "UETR = UUID v4, lowercase, 36 characters" before shipping the preset; otherwise hide it |
| Attack guess rates | — | no source opened | ❌ order-of-magnitude assumptions, labelled and editable (§4) |

**Quarterly re-check:** `TODO(owner)` re-open NIST, CISA, RFC 9562 errata and the language docs each quarter.

## 4. Shared code (build once, with #1 first)

| File | Exports | Used by |
|---|---|---|
| `src/lib/secure-random.ts` (+ test) | `randomBytes(n)` (chunks of ≤ 65,536), `randomInt(maxExclusive)` (rejection sampling on Uint32), `pick(array)`, `shuffle(array)` (Fisher–Yates), `isAvailable()`; **an injectable byte source** for tests | #1 #3 #4 |
| `src/lib/password-engine.ts` (+ test) | character sets, look-alike set, `generatePassword(opts, rng)`, `requireEach`, presets, `entropyBits(opts)` (exact, incl. the require-each correction) | #1 |
| `src/lib/strength-engine.ts` (+ test) | our own pattern matcher (dictionary, l33t, keyboard, sequence, repeat, date/year, brute force) + minimum-guess dynamic programming, `naiveEntropy`, `scenarioTimes(guesses, rates)`, reasons in plain English | #2 (and the meters on #1, #4) |
| `src/lib/uuid-engine.ts` (+ test) | `v4`, `v7` (monotonic), `v5`/`v3` (namespace + name), nil, max, `format`, `parse`/`validate` (version, variant, timestamp), Base64/base64url | #3 |
| `src/lib/passphrase-engine.ts` (+ test) | `generatePassphrase(opts, rng)`, `entropyBreakdown(opts, listSize)` | #4 |
| `src/data/common-passwords.ts` | the approved list (lower-cased `Set`), **loaded with dynamic `import()`** so it is a same-origin code chunk, not a `fetch` | #2 |
| `src/data/wordlist-passphrase.ts` | the approved passphrase list + `source`, `licence`, `size` | #4 |
| `src/data/attack-scenarios.ts` | the 4 scenarios: `{id, label, guessesPerSecond, note, sourced:false}` | #1 #2 #4 |

**Rejection sampling (`randomInt(n)`):** draw a Uint32 `x`; `limit = floor(2³² / n) × n`; retry while `x ≥ limit`; return `x mod n`. For n = 94 the limit is 4,294,967,254 and a retry happens with probability ≈ 9.8 × 10⁻⁹.

**Attack scenarios (labelled "assumptions, edit them"):**

| Scenario | Default guesses/s | Meaning |
|---|---:|---|
| Online, rate-limited | 100 per hour | a site that slows or locks after failed tries |
| Online, no rate limit | 10 per second | a careless site (the rate Service Victoria's tester discloses) |
| Offline, slow hash | 10,000 per second | a stolen database hashed with bcrypt/scrypt/Argon2 |
| Offline, fast hash | 100 billion per second | a stolen database with a fast unsalted hash on GPUs |

Time shown = half the search space ÷ rate ("on average").

**Fixtures checked with node (2026-11-22):**

| Check | Result |
|---|---|
| v5(DNS, "www.example.com") with our SHA-1 code path | `2ed6657d-e927-568b-95e1-2665a8aea6a2` ✔ RFC |
| v3(DNS, "www.example.com") with MD5 | `5df41881-3aed-3515-88a7-2f4a814cf09e` ✔ RFC |
| v7 example timestamp `017F22E279B0` | 2022-02-22T19:22:22.000Z |
| 16 random characters, all 94 printable non-space ASCII | **104.87 bits** (exact with "at least one of each": **104.59**) |
| same, look-alikes `O 0 I l 1` excluded (pool 89) | **103.61 bits** |
| 8 characters, pool 94 | 52.44 bits (51.32 with require-each) |
| PIN 4 / 6 digits | 13.29 / 19.93 bits (10,000 / 1,000,000 combinations) |
| 6 words from a 7,776-word list | **77.55 bits** (12.925 per word) |
| 10 lowercase letters | 26¹⁰ = **141,167,095,653,376** (GIGA's figure is wrong) |
| v4 collisions | 2¹²² ≈ 5.317 × 10³⁶ possible; ≈ **2.715 × 10¹⁸** UUIDs for a 50% chance of one collision |

## 5. Shared UI

- `ToolShell` (the spec's 4 **true** pills), `TabSlider` (`?tab=`).
- **`<main>` element:** `<main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>`.
- **Result display:** monospace, large, selectable; Copy (only on click), Regenerate, Hide/Show for secrets; "Copied" toast; no auto-copy.
- **Privacy line** under every generator and the checker (wording per spec).
- **Input guide diagram ABOVE the inputs** (same rule as Batches 3–6): `<Name>InputGuide.tsx`, inline SVG, numbered callouts = numbered labels, live values, focus highlight, `role="img"` + title/desc, tokens only (light + dark), mobile `<details>`, one diagram per tab. **For secrets the diagram never shows the real generated value**: it uses a masked or sample pattern.
- **New catalog category `Developer & Web`** with the first tool. Hub links:
  - Security: Password Generator ↔ Strength Checker ↔ Passphrase Generator;
  - Developer: UUID Generator ↔ Comma Separator (Batch 6 #8) ↔ future JSON/Base64/hash tools;
  - Fun: Hacker Name Generator ↔ live Band Name Generator.

## 6. Files a tool touches

**New:** engine + test (shared ones once); component folder (calculator, InputGuide, `index.ts`); `src/app/<slug>/page.tsx` + `page.module.css`.

**Edit:** `routes.ts`; `tools-catalog.ts` + count test; `calculation-methods.ts`; `ToolArt.tsx`, `Icons.tsx`, `Footer.tsx`; docs 00/01/02/04/06.

## 7. Page structure and SEO

- `buildMetadata`, with `absoluteTitle` when the title + " | KKC Tools" is over 60 (none in this batch).
- Breadcrumbs, then JsonLd (WebApplication + FAQPage + BreadcrumbList).
- **The tool works on first paint:** a password / UUID / passphrase is already generated client-side on mount (the static HTML shows a placeholder like `••••••••••••••••`, never a fixed secret baked into the HTML).
- BLUF in the first 60 words, with engine numbers (bits, counts), never a specific secret.
- Result sentence; steps; H2s per spec; FAQ once; HowWeCalculate (RNG method, entropy formula, sources from §3 with checked dates); related links.
- AdSlots outside the band; **no ads or third-party scripts on #1, #2, #4 near the input** (`TODO(owner)`: consider no ads at all on these three pages; it is a trust signal).
- Mobile 390 px: no page-level horizontal scroll; long UUID lists scroll inside their box.

## 8. Build order

| Order | Spec | Tier | Why here |
|---:|---|:---:|---|
| 1 | **01 Password Generator** + `secure-random` + `password-engine` + `attack-scenarios` | 1 | KD 0 exact terms; builds the RNG |
| 2 | **02 Password Strength Checker** + `strength-engine` + `common-passwords` | 1 | KD 0; reuses scenarios |
| 3 | **03 UUID / GUID Generator** + `uuid-engine` | 1 (🟡) | big cluster, reuses RNG |
| 4 | **04 Passphrase Generator** + `passphrase-engine` + word list | 2 | after the list is approved |
| 5 | **05 Hacker Name Generator** (reuses `src/lib/generator`) | 3 | small; reuses Band Name engine |

**Stops:** after order 1 (owner reviews the RNG and pattern); after order 3; after order 5.
