# UUID / GUID Generator (v4, v7, v5, Validator) — Build Spec

> **URL:** `/uuid-generator/` · Batch 7 · Tier 1 (🟡) · **Build order 3**
> **Read first:** `../00_BATCH7_BUILD_RULES.md` (§3 RFC 9562 + language API sources, §4 `uuid-engine`)
> **Inputs:** `03_UUID_GUID_Generator_Competitor_Analysis.md`, keyword file §2 #3, CSV `2.2 - uuid generator online 15-30 %`
> **SERP:** provisional; **the 0–15% export is missing** (rules §0): `TODO(owner)` re-export before setting the final tier
> **Written:** 2026-11-22

---

## 0. Strategy

**83 keywords, ≈ 45,700 searches, nearly all KD 15–29** (the easy export was saved wrongly):
- primary `random uuid` 1,900 / KD 18;
- `uuid4 generator` 1,900 (rising), `gen uuid` 1,600, `guid generator online` 880 (rising), `generated uuid` 880, `generate random uuid` / `generate uuid random` / `uuid v4 generator` 590 each;
- big support rows: `guid` 8,100, `guid generator` 6,600, `generate uuid` 3,600 (rising), `generate guid` 2,400 (rising), `guid creator` 1,300, `random uuid generator` 1,000;
- questions: `guid meaning` 720, `uuid length` 590, `empty guid` 480, `sample uuid` 320, `guid length` 260, `what does guid stand for` 210, `size of guid` 210;
- features: `guid validator` 210, `uuid v5 generator` 90 (rising), `guid converter` 90, `uetr generator` 90, `database uuid` 110 ($4.36 CPC);
- **21 language how-to phrases ≈ 2,900:** `guid newguid` 590, `create uuid python` 320, `c# guid` 210, `uuid java` 210, `guid in python` 170, `c# generate guid` / `c# new guid` / `sql new guid` 110 each, `guid in javascript` 90, `python uuid string` 90, `c# guid to string` 70 …

**Why 🟡:** old exact-match sites (uuidgenerator.net, guidgenerator.com, uuidtools.com) hold the heads. A clearly better tool wins on engagement, but **this page needs links** (developer communities, Batch 6 Comma Separator, future dev tools).

**Our angle:** the most *complete and correct* UUID page:
- the current standard (**RFC 9562, May 2024, obsoletes RFC 4122**; uuidgenerator.net still cites 4122);
- **v7 with the RFC's monotonic counter** (competitors overclaim ordering);
- v5/v3 verified against the RFC's own test vectors (we reproduced them with node);
- a validator/decoder, every format, and **verified code for six languages** (nobody has snippets).

### Research notes from the competitor analysis

- **Pages read:** UUIDGenerator.net, UUIDTools.com, GUIDGenerator.com, singhajit.com, RFC 9562.
- **UUIDGenerator.net:** v4 only on the home page (other versions on sub-pages), no formats/validator/snippets, ~250 words, cites obsolete RFC 4122 "whenever possible".
- **UUIDTools.com:** the most generators (v1, v3–v8, nil, max, bulk ≤ 1,000, formats, decoder) but **a public API** (network), no snippets, 2-question FAQ, RFC not linked.
- **GUIDGenerator.com:** v4/v7/ULID/NanoID, Base64/URL encodings, an unexplained "RFC 7515" option (that RFC is JWS; probably base64url), "74+ random bits" for v7 (vague).
- **singhajit.com:** the best content (v7 for B-tree keys, RFC linked, 10 FAQs) but **claims new v7 IDs are "always greater"**, which only holds across milliseconds unless a counter is used (RFC 9562 §6.2); says Snowflake IDs are "up to 19 digits" (an unsigned 64-bit value can have 20).
- **0 of 4** have code snippets, a UETR preset or an anatomy diagram.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | random uuid | 1,900 | 18 | title ("Random UUID v4"), first sentence, default tab label |
| Head (not in exports) | uuid generator | — | — | title, H1, ToolShell heading (`TODO(owner)`: pull volume) |
| Secondary | uuid4 generator · uuid v4 generator · uuidv4 generator · v4 uuid generator · uuid generator v4 | 1,900 · 590 · 480 · 110 · 110 | 15–23 | v4 tab, H2 "UUID v4: random UUIDs" |
| Secondary | gen uuid · generated uuid · generate random uuid · generate uuid random · online uuid generator · uuid generate online · online generate uuid · uuid online generator · online uuid generator tool · uuidgenerator · online uuid · uuid random | 1,600 · 880 · 590 · 590 · 480 · 210 · 170 · 90 · 140 · 390 · 140 · 110 | 15–24 | intro, Generate button, HowWeCalculate, image alt |
| Secondary | guid generator online · guid online generator · generate online guid | 880 · 210 · 260 | 15–21 | H2 "GUID generator" + braces/upper-case GUID preset |
| Support | guid · guid meaning · what does guid stand for · universally unique identifiers · uuid mean | 8,100 · 720 · 210 · 140 · 110 | 24–29 | H2 "What is a UUID / GUID?" |
| Support | guid generator · generate uuid · generate guid · guid creator · random uuid generator · uuid generate · random guid generator · guid gen · generate guids · create a new guid · uid generator · generate uid | 6,600 · 3,600 · 2,400 · 1,300 · 1,000 · 880 · 390 · 320 · 90 · 110 · 480 · 90 | 18–29 | H1 ("and GUIDs"), section intros, FAQ wording |
| Secondary | uuid length · guid length · how long is a guid · size of guid · uuid size | 590 · 260 · 90 · 210 · 110 | 18–29 | H2 "UUID length and format" |
| Secondary | empty guid | 480 | 25 | Nil/Max tab + FAQ + copy buttons |
| Secondary | sample uuid | 320 | 25 | the labelled anatomy SVG (sample values) |
| Secondary | guid validator | 210 | 18 | Validate tab + H2 "Check if a UUID is valid" |
| Secondary | uuid v5 generator | 90 | 15 | v5 tab + H2 "Name-based UUIDs (v5)" |
| Secondary | guid converter | 90 | 15 | formats panel (+ Validate tab converts any input to every format) |
| Secondary | database uuid | 110 | 16 | H2 "UUID v4 vs v7 for database keys" |
| Secondary | uetr generator | 90 | 18 | UETR preset **only after `TODO(owner)` confirms the format** |
| Secondary | unique id generator · identifier generator · unique identifier generator · generate unique identifier | 140 · 210 · 140 · 90 | 20–27 | optional short-ID mode + one FAQ |
| Long tail (one H2) | guid newguid · create uuid python · c# guid · uuid java · guid in python · c# generate guid · c# new guid · sql new guid · guid in javascript · python uuid string · c# guid to string … (21) | ≈ 2,900 | 18–29 | H2 "Generate a UUID in your language" (tabs per language) |
| Never in copy | uiid generator · generate uuuid · guid generat · uu id · generateguid | — | — | misspellings / fragments |

## 2. Our edge

- **Every useful version:** v4 (default), **v7 monotonic** (RFC 9562 §6.2 method 1: a counter in `rand_a` within the same millisecond, rollover bumps the timestamp), v5 and v3 (DNS / URL / OID / X.500 namespaces or a custom one), Nil, Max; optional short ID (our own code, URL-safe alphabet).
- **Bulk 1–1,000** (`getRandomValues` in ≤ 65,536-byte chunks), copy all, download `.txt` / `.json` / `.csv` (local Blob).
- **Formats:** lower (default, RFC output style), UPPER, `{braces}` (GUID style), no hyphens, `urn:uuid:`, Base64 and base64url (22 characters), with separators and quotes plus SQL / JSON / CSV presets.
- **Validate & decode tab:** paste anything → valid? version, variant, v7/v6/v1 timestamp (UTC), Nil/Max, and the same value in every format (`guid converter`).
- **Code snippets for 6 languages**, each checked against the §3 docs (and hand-run, `TODO(owner)` sign-off).
- **Labelled anatomy SVG** for v4 and v7 (`sample uuid`).
- **Correct facts:** 128 bits; 36 characters with hyphens (32 hex digits); v4 has 122 random bits; 50% collision chance after ≈ 2.7 × 10¹⁸ v4 UUIDs; "UUIDs are not secrets".
- **Local only:** no API, nothing stored.

## 3. Calculator spec

### 3.1 Tabs

1. **v4 (random)** (default)
2. **v7 (time-ordered)**
3. **v5 / v3 (name-based)**
4. **Validate & convert**
5. **Nil, Max & presets** (UETR only if confirmed; short ID optional)

### 3.2 Input guide diagram (above the inputs)

`UuidInputGuide.tsx`: the anatomy of one UUID, `xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx`.

- **v4 tab:** 5 groups (8-4-4-4-12) with callouts: "1 32 hex digits = 128 bits", "2 Version digit (4)", "3 Variant digit (8, 9, a or b)", "4 Hyphens (36 characters in all)"; a badge "122 random bits".
- **v7 tab:** the first 12 hex digits highlighted as "5 Timestamp (milliseconds since 1970)", then version 7, "6 Counter / random", variant, random.
- **v5 tab:** "Namespace + name → SHA-1 → first 128 bits → version 5".
- **Validate tab:** the same anatomy with the pasted value's parts lit up and labelled.
- **Count / format controls:** numbered "7 How many" and "8 Format".

Uses the RFC sample `017F22E2-79B0-7CC3-98C4-DC0C0C07398F` for v7 and a generated value for v4 (UUIDs aren't secrets, so the real value may be shown).

### 3.3 Inputs

| Field | Default |
|---|---|
| Count | 1 (1–1,000) |
| Case | lower |
| Hyphens / braces / URN | on / off / off |
| Encoding | text · Base64 · base64url |
| List separator | newline · comma · space |
| Quotes | none · `'` · `"` |
| Presets | plain · SQL `IN (…)` · JSON array · CSV column |
| v5/v3: namespace | DNS (DNS, URL, OID, X.500, custom UUID) |
| v5/v3: name | `www.example.com` (the RFC test input) |
| v5 or v3 | v5 (SHA-1); v3 (MD5) shown as legacy |
| Validate: input | empty (accepts upper/lower/mixed, braces, URN, no hyphens, Base64) |

### 3.4 Engine (`src/lib/uuid-engine.ts`)

```ts
v4(): crypto.randomUUID() if available else bytes = randomBytes(16); b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80
v7(state): ms = Date.now(); if ms <= state.lastMs: ms = state.lastMs, counter++ (12-bit rand_a) ; on overflow ms++ , counter = random 11-bit seed
           else counter = random 11-bit seed (leaves room to count up)
           bytes 0–5 = ms (48-bit big-endian) ; b6 = 0x70 | counter>>8 ; b7 = counter & 0xff ; b8 = 0x80 | (rand & 0x3f) ; b9–15 random
           assert each new value > previous (string compare on lower-case hex)
nameBased(ver, nsUuid, name): hash = SHA-1 (v5) or MD5 (v3) of nsBytes ‖ UTF-8(name) ; first 16 bytes ; set version + variant
   SHA-1: crypto.subtle.digest('SHA-1') (async; built-in, no dependency) — `TODO(owner)`: OK, or implement our own SHA-1
   MD5:   not in Web Crypto → our own MD5 (small, tested against RFC 1321 vectors) or omit v3 (`TODO(owner)`)
nil = 00000000-0000-0000-0000-000000000000 ; max = ffffffff-ffff-ffff-ffff-ffffffffffff
parse(s): strip braces / "urn:uuid:" / whitespace ; accept 32 hex (no hyphens), 36 with hyphens, 22-char base64url, 24-char base64 ;
          → {bytes, version = b[6] >> 4, variant (from b[8] top bits), timestamp (v7: bytes 0–5 ms ; v1/v6: Gregorian 100-ns since 1582-10-15)}
format(bytes, opts) ; toBase64 / toBase64Url ; list(presets)
```

**Worked examples (checked with node, 2026-11-22):**

| Input | Output |
|---|---|
| **v5, namespace DNS, name `www.example.com`** | **`2ed6657d-e927-568b-95e1-2665a8aea6a2`** (= RFC 9562 Appendix A.4 ✔) |
| v3, same input | `5df41881-3aed-3515-88a7-2f4a814cf09e` (= RFC A.2 ✔) |
| Validate `017F22E2-79B0-7CC3-98C4-DC0C0C07398F` | valid · **version 7** · variant RFC 9562 (`9` = 10xx) · timestamp **2022-02-22T19:22:22.000Z** · base64url `AX8i4nmwfMOYxNwMDAc5jw` |
| Validate `2ed6657d-e927-568b-95e1-2665a8aea6a2` | version 5 · base64 `LtZlfeknVouV4SZlqK6mog==` · base64url `LtZlfeknVouV4SZlqK6mog` (22 characters) |
| Nil | `00000000-0000-0000-0000-000000000000` · base64url `AAAAAAAAAAAAAAAAAAAAAA` |
| Max | `ffffffff-ffff-ffff-ffff-ffffffffffff` · base64url `_____________________w` |
| `{2ED6657D-E927-568B-95E1-2665A8AEA6A2}` | valid (braces + upper case accepted), same value |
| `2ed6657d-e927-568b-95e1-2665a8aea6a` (35 characters) | invalid: "35 characters; a UUID has 32 hex digits (36 with hyphens)" |
| 1,000 × v7 in one millisecond | strictly increasing (test) |
| Collision maths | 2¹²² ≈ 5.317 × 10³⁶ v4 values; ≈ 2.715 × 10¹⁸ for a 50% chance of any collision |

### 3.5 Outputs

- **Result list** (monospace), per-row Copy, Copy all, Regenerate, Download `.txt` / `.json` / `.csv`.
- **Sentence:** "Generated 1 random UUID (version 4, 122 random bits) in your browser."
- **v7:** "Timestamp: 2026-11-22T10:15:03.412Z" under each value (decoded from the value itself).
- **Validate:** a result card (valid / invalid with the reason), the decoded fields, every format with Copy.
- **Snippet tabs** under the tool (static text).
- Share URL: version, count and format only.

### 3.6 Tests

- v4: version nibble 4, variant 10xx, on 10⁴ samples; no duplicates in 10⁵.
- v7: ordering within the same ms and across ms; counter overflow path; timestamp round-trip.
- v5/v3: the RFC vectors above; all 4 namespaces; UTF-8 names (e.g. `café`).
- Parse: every accepted input form; rejects wrong lengths, non-hex, wrong Base64 length; Nil and Max detection.
- Base64 / base64url round-trip.
- Bulk 1,000 uses ≤ 65,536 bytes per `getRandomValues` call.
- No `Math.random`; no network.
- The worked examples. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `UUID Generator – Random UUID v4 & GUID Online` (45; 57 with the suffix: OK) |
| Meta | `Free UUID generator. Create random v4 or time-ordered v7 UUIDs and GUIDs in bulk, check if a UUID is valid, and copy code for your language, in your browser.` (157) |
| H1 | `UUID Generator: Create Random UUIDs (v4, v7) and GUIDs` |
| BLUF | "Click Generate for a random UUID (version 4), or switch to v7 for time-ordered IDs that sort well as database keys. Make up to 1,000 at once in any format, from upper-case GUIDs in braces to Base64, check whether a UUID is valid, and copy ready-made code for JavaScript, Python, C#, Java, SQL or PowerShell. Everything runs in your browser." |
| ToolShell pills | `v4, v7 & v5 (RFC 9562)`, `Bulk up to 1,000`, `Validate & decode`, `Code for 6 languages` |
| Links out | Password Generator (#1), Comma Separator (Batch 6 #8, when live); future JSON / Base64 / hash tools |
| Links in | #1, Comma Separator, Tools hub "Developer & Web" |

## 5. Content (~1,600–1,900 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the UUID generator | 5 tabs, count, formats | 120 |
| 2 | What is a UUID / GUID? | "Universally unique identifier"; GUID = Microsoft's name for the same thing; RFC 9562 (obsoletes 4122) (`guid`, `guid meaning`, `what does guid stand for`) | 160 |
| 3 | UUID versions explained | v1–v8 in one table; why v4 and v7 matter; v2 out of scope | 160 |
| 4 | UUID v4: random UUIDs | 122 random bits; `crypto.randomUUID` | 100 |
| 5 | UUID v4 vs v7 for database keys | Index locality in plain words; **no invented benchmarks**; v7 ordering caveat (counter) (`database uuid`) | 170 |
| 6 | Name-based UUIDs (v5) | Same input → same UUID; the RFC example; v3 is legacy | 130 |
| 7 | Nil and Max UUIDs (empty GUID) | Values, uses, Copy (`empty guid`) | 80 |
| 8 | UUID length and format | 128 bits, 32 hex, 36 characters, 8-4-4-4-12, case-insensitive input, Base64 22 characters (`uuid length`, `guid length`, `size of guid`) | 120 |
| 9 | Can two UUIDs collide? | The maths (node-checked) | 100 |
| 10 | Check if a UUID is valid | Validator rules; version and variant digits (`guid validator`) | 100 |
| 11 | Generate a UUID in your language | Snippet tabs (§5.1) | 60 + code |
| 12 | FAQ | §6 | 380 |

### 5.1 Snippets (static; only what §3 sources confirm)

| Language | v4 | v7 / notes |
|---|---|---|
| JavaScript (browser, Node 19+) | `crypto.randomUUID()` | no built-in v7: use our generator or a library you trust |
| Python | `import uuid` · `str(uuid.uuid4())` | `uuid.uuid7()` (Python 3.14+); `uuid.uuid5(uuid.NAMESPACE_DNS, "www.example.com")` |
| C# / .NET | `Guid.NewGuid()` · `.ToString()` / `.ToString("B")` for braces | `Guid.CreateVersion7()` (.NET 9+) |
| Java | `UUID.randomUUID()` (type 4) · `.toString()` | no v7 in `java.util.UUID` (Java 21); `nameUUIDFromBytes` = v3 |
| SQL | PostgreSQL `gen_random_uuid()` (v4) · `uuidv7()` (recent versions; check yours) · SQL Server `NEWID()` · MySQL `UUID()` (v1) | say each is a different version; don't call `NEWID()` v4 (its doc doesn't) |
| PowerShell | `New-Guid` (v4) · `[guid]::NewGuid()` | `New-Guid -Empty` = nil |

`TODO(owner)`: run each snippet once and tick it off; "Node 19+" for `crypto.randomUUID` global must be checked against the Node docs before publishing.

## 6. FAQ (12, from the competitor question bank + cluster keywords)

1. What is a UUID, and what does GUID stand for?
2. UUID v4 vs v7: which should I use?
3. Can two UUIDs ever be the same?
4. How long is a UUID (or GUID)?
5. What's the difference between a GUID and a UUID?
6. What is an empty (nil) GUID?
7. How do I generate a UUID in C#, Python, Java, SQL or PowerShell?
8. How do I check if a UUID is valid?
9. What is a UUID v5 (name-based) and when do I use it?
10. Is a UUID safe to use as a secret token? (no; use a password/random token generator — link #1)
11. What is a UETR? (only if the preset ships; else omit)
12. Can you show a sample UUID with its parts labelled? (the SVG)

## 7. Done when

- [ ] `uuid-engine.ts` + tests (RFC vectors, v7 monotonic, parser); `npm run verify` passes.
- [ ] Owner decisions recorded: Web Crypto SHA-1 vs own; v3/MD5 in or out; UETR in or out.
- [ ] Snippets match §5.1 and are signed off.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Registrations + docs; `graphify update .`.
- [ ] **STOP and report** (end of Tier 1).
