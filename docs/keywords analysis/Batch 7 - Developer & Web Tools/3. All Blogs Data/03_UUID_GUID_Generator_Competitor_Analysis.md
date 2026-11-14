# UUID / GUID Generator (v4, v7, Validator) — Competitor Analysis

> **Target page:** KKCTools `/uuid-generator/` (Batch 7, Tool #3 🟡)
> **Primary keyword:** `random uuid` — US 1,900 · KD 18.
> **Cluster:** 83 keywords, 45,720 US searches, nearly all at KD 15–29. It includes `guid` (8,100), `guid generator` (6,600), `generate uuid` (3,600) and 21 language how-to phrases (2,900).
> **SERP source:** ⚠ No Semrush SERP export for Batch 7. Competitors come from a live web search for `uuid generator online v4 v7` (2026-11-14), plus the category leaders, plus **RFC 9562** as the authority source.
> `TODO(owner):` the keyword note says to re-pull the 0–15 % export (it was saved wrongly), then pull Google top 10.
> **Pages visited (2026-11-14):** 5 read — UUIDGenerator.net, UUIDTools.com, GUIDGenerator.com, singhajit.com UUID tool, RFC 9562 (authority).

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Long-standing exact-match sites: uuidgenerator.net, guidgenerator.com, uuidtools.com.
  - Developer blogs and tools: singhajit, coderspace, zap-hosting, DNS Robot, kunalganglani, devplaybook.
  - Many pages.dev clones.
  - The keyword file gives this a 🟡 because the head terms sit at KD 18–29 and the incumbents are old. **A better tool helps, but the page also needs links.**
- **The standard changed. RFC 9562 (May 2024) obsoletes RFC 4122.** It defines:
  - versions 1–8, including the **v7** layout: 48-bit unix_ts_ms, ver, 12-bit rand_a, var, 62-bit rand_b
  - the **Max UUID** (all bits set)
  - monotonicity guidance for v7 (a counter in rand_a/rand_b, or sub-millisecond precision)
  - UUIDGenerator.net still says it follows "RFC 4122 whenever possible", which is outdated.
- **Keyword-file must-haves:**
  - v4 via `crypto.randomUUID` / `getRandomValues`
  - v7
  - v5 with **SHA-1 written in our own code** (Web Crypto `crypto.subtle.digest('SHA-1')` may also be acceptable; see §5)
  - nil
  - bulk 1–1,000
  - formats
  - a validator with v7 timestamp decoding
  - code snippets for JS, Python, C#, Java, SQL and PowerShell, tested by hand
  - a UETR preset, since a SWIFT UETR is a v4 UUID
- **Facts re-checked:**
  - collision figures (2¹²² ≈ 5.3 × 10³⁶; about 2.71 × 10¹⁸ UUIDs for a 50 % chance) ✔
  - singhajit's "v7 always greater" claim is overstated within a single millisecond
- No competitor text was copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | uuidgenerator.net | Exact-match incumbent | Online UUID Generator | ~250 |
| 2 | uuidtools.com | Exact-match tool | Online UUID Generator (v4, v7, v1, v5) | ~400 |
| 3 | guidgenerator.com | Exact-match incumbent | Free Online GUID / UUID Generator | 1,100–1,300 |
| 4 | singhajit.com/tools/uuid-generator/ | Developer blog tool | UUID Generator & Decoder | ~1,300 |
| 5 | rfc-editor.org/rfc/rfc9562 | **IETF standard** | RFC 9562: UUIDs | reference |

**What this tells us:**
- **UUIDTools offers the most generator features:**
  - versions v1, v3, v4, v5, v6, v7, v8, plus nil, max, GUID and bulk (≤ 1,000)
  - formats: upper case, hyphens, braces, urn:uuid, quoting, separators
  - output as .txt or JSON
  - a decoder and a **public API** (a network call, which we won't use)
  - Weak spots: **no code snippets**, a thin FAQ (2 questions), and RFC 9562 is named but not linked.
- **GUIDGenerator.com is the GUID incumbent:**
  - count 1–1,000; v4, v7, ULID, NanoID
  - formats and Base64 / URL encoding
  - a v4-vs-v7 table and 5 FAQs
  - Weak spot: an "RFC 7515" encoding option that is never explained.
- **UUIDGenerator.net is thin:** v4 only on the home page (other versions on sub-pages), no formats, no validator, and it cites the outdated RFC 4122.
- **singhajit has the best content:**
  - v4/v7, bulk ≤ 100, decoder
  - a **v7 database-key explanation** (B-tree fragmentation)
  - RFC 9562 linked, 10 FAQs, a named author
  - Weak spots: overclaims v7 monotonicity, and its Snowflake digit count is off.
- **No page offers all of these:**
  - v4 + v7 (monotonic per RFC) + v5 (namespaces + name) + nil + max
  - bulk 1–1,000 and every format (including Base64 and URN)
  - a **validator** showing version, variant and the v7 timestamp
  - **tested snippets in 6 languages**
  - a UETR preset
  - a labelled SVG anatomy diagram
  - privacy (generated locally, no API)

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | UUIDGenerator.net | UUIDTools | GUIDGenerator | singhajit |
|---|---|---|---|---|
| v4 | ✅ | ✅ | ✅ | ✅ |
| v7 | ⚠️ (sub-page) | ✅ | ✅ | ✅ |
| v7 monotonic within the same ms (RFC method) | ? | ? | ? | ❌ (claims "always") |
| v1 / v6 | ⚠️ (v1 sub-page) | ✅ | ❌ | ❌ |
| v3 / v5 (namespace + name) | ❌ | ✅ | ❌ | ❌ |
| v8 | ❌ | ✅ | ❌ | ❌ |
| Nil / Max | ⚠️ (nil sub-page) | ✅ / ✅ | ❌ | ❌ |
| ULID / NanoID | ❌ | ❌ | ✅ | ❌ |
| Bulk | ✅ (count) | ✅ (≤ 1,000) | ✅ (≤ 1,000) | ✅ (≤ 100) |
| Upper / braces / no hyphens | ❌ | ✅ | ✅ | ⚠️ (upper, no hyphens) |
| URN / Base64 / URL-encode | ❌ | ⚠️ (URN) | ✅ (Base64, URL, "RFC 7515" unexplained) | ❌ |
| Separators / quotes (CSV, JSON) | ❌ | ✅ | ⚠️ | ❌ |
| Download .txt / JSON | ✅ | ✅ | ? | ❌ |
| **Validator / decoder** (version, variant, timestamp) | ❌ | ✅ | ❌ | ✅ (v1/v7 timestamps) |
| UETR preset | ❌ | ❌ | ❌ | ❌ |
| Code snippets (JS/Py/C#/Java/SQL/PS) | ❌ | ❌ (curl only) | ❌ | ❌ |
| Anatomy diagram | ❌ | ⚠️ (v4 structure text) | ❌ | ❌ |
| Local generation stated | ⚠️ ("secure RNG") | ⚠️ (claimed) | ⚠️ ("don't store") | ? |

---

## 3. Feature matrix — content and trust

| Item | UUIDGenerator.net | UUIDTools | GUIDGenerator | singhajit |
|---|---|---|---|---|
| RFC cited | ⚠️ (RFC 4122, **outdated**) | ⚠️ (RFC 9562, no link) | ✅ (9562 + 4122) | ✅ (9562 linked) |
| What is a UUID / GUID | ⚠️ | ✅ | ✅ | ✅ |
| v4 vs v7 for databases | ❌ | ⚠️ | ✅ (table) | ✅ |
| Collision maths | ❌ | ✅ (correct) | ✅ (5.3 × 10³⁶) | ✅ (correct) |
| UUIDs are not secrets | ❌ | ✅ | ⚠️ | ✅ |
| FAQ count | 0 | 2 | 5 | 10 |
| Named author | ❌ (publisher) | ❌ | ❌ | ✅ |
| Date | ❌ | ❌ | ❌ | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. UUIDGenerator.net (incumbent)
- **Generator:** v4 with a "How many?" count and file download. The v1, v7, nil and GUID generators are separate pages.
- **Weak points:**
  - Says it conforms to RFC 4122 "whenever possible". That RFC is obsolete, and the qualifier is never explained.
  - No formats, validator or code snippets.
  - About 250 words of content.
  - No FAQ, author or date.
  - You regenerate by reloading the page.

### 2. UUIDTools.com
- **Generators:** v1, v3, v4, v5, v6, v7, v8, nil, max, GUID, bulk. Also v2, timestamp-first and Minecraft variants in its index.
- **Formats:** upper case, hyphens, braces, urn, quotes, separators.
- **Output:** copy, .txt or JSON. Has a decoder and a **public API endpoint**.
- **FAQs (2):** collision probability (correct) and "v4 is not a secret".
- **Weak points:**
  - No code snippets.
  - The title doesn't list all the versions it offers.
  - RFC not linked.
  - No author or date.

### 3. GUIDGenerator.com (incumbent)
- **Options:** count 1–1,000; v4, v7, ULID, NanoID.
- **Formats:** hyphens, braces, upper case, quotes, commas.
- **Encodings:** Base64, "RFC 7515" (unexplained; RFC 7515 is JWS, so this is probably base64url), URL-encode.
- **Content:** v4/v7 table and "not guaranteed unique" ✔.
- **FAQs (5):** GUID vs UUID, v4 vs v7, sortability, uniqueness, primary keys.
- **Weak points:**
  - Says v7 has "74+ random bits", which is vague.
  - Says to avoid v1 for MAC-address privacy reasons, but this isn't explained in its own table.
  - Inconsistent labels.
  - No author or date.

### 4. singhajit.com — UUID Generator & Decoder (Ajit Singh)
- **Features:** v4/v7, bulk (5–100), upper case and no-hyphen toggles, a decoder (v1/v7 timestamps).
- **Content:** a guide to v1, v3, v5, v4 and v7, plus databases (B-tree). RFC 9562 is linked. 10 FAQs.
- **Errors:**
  - "New v7 IDs are always greater". This only holds across milliseconds unless a counter is used (RFC 9562 §6.2).
  - Snowflake "up to 19 digits". An unsigned 64-bit value can reach 20 digits.
- **Weak points:** keyword stuffing, a `#` nav link, no date.

### 5. RFC 9562 (May 2024) — the authority source
- **Defines:**
  - versions 1–8 (v2 out of scope)
  - the v7 layout
  - v4 with 122 random bits
  - Nil (all bits 0) and Max (all bits 1)
  - the 8-4-4-4-12 string format, case-insensitive
- **v5:** SHA-1 of the namespace concatenated with the name; take the first 128 bits; set version and variant.
- **v7 monotonicity:** counter or sub-millisecond precision methods. Check that each new value is greater than the last, and handle counter rollover.

---

## 5. Patterns

**Generation (our code)**
- **v4:** `crypto.randomUUID()` where available, otherwise `getRandomValues` (16 bytes; set byte 6 to (b & 0x0f) | 0x40 and byte 8 to (b & 0x3f) | 0x80).
- **v7:**
  - 48-bit ms timestamp (`Date.now()`).
  - **A monotonic counter in rand_a** (RFC 9562 method 1) for bulk runs within the same millisecond.
  - A random seed in rand_b.
  - On rollover, bump the timestamp.
- **v5:** SHA-1 over namespace bytes + name in UTF-8.
  - The keyword file says "SHA-1 in our own code".
  - `crypto.subtle.digest('SHA-1')` is a built-in browser API, not a network call or a dependency. `TODO(owner)`: decide whether Web Crypto counts as "our own code". Otherwise implement SHA-1 ourselves and test it against vectors.
  - Namespaces: DNS, URL, OID, X.500 (from the RFC), plus custom.
- **Nil / Max:** constants.
- **UETR:** a v4 in lower case (`TODO(owner)`: verify the SWIFT gpi format requirement).

**Formats**
- lower, UPPER, `{braces}`, no hyphens, `urn:uuid:`
- Base64 (standard and URL-safe; 22 characters without padding)
- separators (newline, comma, space) and quotes (none, single, double), with SQL, JSON and CSV presets

**Validator**
- Regex for the 8-4-4-4-12 pattern. Report version (nibble 13) and variant (bits of byte 8).
- v7: show the decoded timestamp as UTC ISO time.
- v1/v6: show the Gregorian timestamp.
- Nil and Max detection.

**Snippets (static text, tested by hand)**

| Language | Example to verify |
|---|---|
| JavaScript | `crypto.randomUUID()` |
| Python | `uuid.uuid4()` (v7 depends on the Python version, `TODO(owner)`) |
| C# | `Guid.NewGuid()` (v7: `Guid.CreateVersion7()` in .NET 9+, `TODO(owner)` verify) |
| Java | `UUID.randomUUID()` |
| SQL | PostgreSQL `gen_random_uuid()`; SQL Server `NEWID()`; MySQL `UUID()` (v1) |
| PowerShell | `New-Guid` / `[guid]::NewGuid()` |

**Facts for FAQs**
- 128 bits; 36 characters with hyphens (32 hex).
- About 2.71 × 10¹⁸ v4 UUIDs for a 50 % collision chance.

**Coverage across the competitors**

| Section | Pages (of 4) |
|---|:---:|
| v4 + v7 | 4 |
| v5 | 1 |
| Max UUID | 1 |
| Validator | 2 |
| Code snippets | **0** |
| UETR | **0** |
| RFC 9562 linked | 2 |
| Anatomy diagram | **0** |

---

## 6. FAQ question bank

★ = asked on 2 or more pages, or a cluster keyword. Map to the 83-keyword cluster.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is a UUID / GUID? What does GUID stand for? | all · `guid`, `what does guid stand for`, `guid meaning`, `universally unique identifiers` |
| 2 | ★ UUID v4 vs v7: which should I use? | GUIDGen, singhajit · `database uuid` |
| 3 | ★ Can two UUIDs collide? | UUIDTools, GUIDGen, singhajit |
| 4 | ★ How long is a UUID / GUID? | `uuid length`, `guid length`, `how long is a guid`, `size of guid`, `uuid size` |
| 5 | ★ GUID vs UUID: what is the difference? | GUIDGen |
| 6 | What is an empty / nil GUID? | `empty guid` |
| 7 | How do I generate a UUID in C#, Python, Java, SQL, PowerShell? | 21 how-to phrases (`guid newguid`, `create uuid python`, `c# guid`…) |
| 8 | How do I check if a UUID is valid? | `guid validator` |
| 9 | What is a UUID v5 (name-based)? | `uuid v5 generator` |
| 10 | Is a UUID safe to use as a secret or token? | UUIDTools, singhajit |
| 11 | What is a UETR? | `uetr generator` |
| 12 | Show me a sample UUID with its parts labelled. | `sample uuid` |

---

## 7. Gaps nobody fills — our opportunities

1. **Complete version set:**
   - v4
   - **v7 with an RFC-compliant monotonic counter**
   - v5 (namespaces + name)
   - nil, max, UETR
   - optional: ULID and short ID (nanoid-style, our own code)
2. **Bulk 1–1,000 with every format:** cases, braces, URN, Base64, separators and quotes, plus SQL, JSON and CSV presets. Copy or download as .txt.
3. **Validator and decoder:** version, variant, v7 and v1 timestamps, nil/max detection.
4. **Hand-tested code snippets** for JS, Python, C#, Java, SQL and PowerShell (21 how-to queries).
5. **SVG anatomy diagram** labelling each field for v4 and v7.
6. **A correct, current standards section:** RFC 9562 explained, with its relationship to RFC 4122.
7. **Database-key guidance** (v7 vs v4) with no invented benchmark numbers.
8. **Privacy:** generated locally with no API and nothing stored.
9. **Links:** Password Generator (#1), Comma Separator (Batch 6 #8), plus future developer tools (Base64, hash).

---

## 8. Blueprint for the KKCTools UUID / GUID Generator

### 8.1 SEO

- **URL:** `/uuid-generator/`
- **Title:** UUID Generator – Random UUID v4 & GUID Online
- **H1:** UUID Generator: Create Random UUIDs (v4, v7) and GUIDs
- **Meta:** as in the keyword file (157 chars).
- **H2s:**
  - What is a GUID
  - UUID v4 vs v7
  - Generate a UUID in your language
  - UUID length
  - Empty GUID

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Versions | v4 · v7 (monotonic) · v5 (namespace+name) · nil · max · UETR (+ optional ULID / short ID) |
| Bulk | 1–1,000; copy all; download .txt |
| Formats | Case, braces, hyphens, URN, Base64/base64url, separators, quotes, SQL/JSON/CSV presets |
| Validator | Paste → valid?, version, variant, timestamp (v1/v6/v7), nil/max |
| Snippets | JS, Python, C#, Java, SQL (Postgres/SQL Server/MySQL), PowerShell |
| Visual | SVG anatomy (v4/v7) |
| UX | Local only, no API, no network |

### 8.3 Content outline (≈ 1,400–1,700 words, original)

1. Intro (primary keyword)
2. How to use
3. What a UUID / GUID is (RFC 9562), with a labelled sample
4. UUID versions explained (v1–v8; why v4 and v7 matter)
5. UUID v4 vs v7 for database keys
6. Name-based UUIDs (v5)
7. Nil and Max UUIDs
8. UUID length and format
9. Can UUIDs collide? (the maths)
10. Validating and decoding a UUID
11. Generating a UUID in your language
12. FAQ (12)
13. Related tools: Password Generator (#1), Comma Separator (Batch 6 #8)

### 8.4 Quality checks

- **Unit tests:**
  - v4 version/variant bits
  - v7 ordering within the same ms and across ms boundaries, plus rollover
  - v5 against the RFC test vectors (`TODO(owner)`: add vectors from the RFC appendix)
  - Base64 round trip
  - validator
  - timestamp decode
- Snippets are tested by hand in each language before shipping (owner or developer sign-off).
- No competitor wording. No API. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - re-pull the 0–15 % export
  - pull Google top 10
  - decide on Web Crypto SHA-1 vs own SHA-1
  - verify the C# v7 and Python v7 APIs
  - verify the UETR format
