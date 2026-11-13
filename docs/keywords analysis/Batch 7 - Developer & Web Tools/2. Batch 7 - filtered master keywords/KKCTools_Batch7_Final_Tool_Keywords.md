# KKCTools — Batch 7 Final Tool Keywords (Developer & Web Tools)

> **Keyword data:** `Batch 7 - Developer & Web Tools/` — 4 Semrush US exports (Oct 2026 snapshot), two KD bands per seed (≈ 0–15% and 15–30%)  
> **Seeds:** #1 random password generator strong · #2 uuid generator online  
> **Rows read:** 400 rows → **300 unique keywords** after removing duplicates across files  
> **⚠ Export problem:** `2. uuid generator online 0-15 %.csv` is a byte-for-byte copy of `1.1 - random password generator strong 0-15%.csv`. The real UUID 0–15% export is missing, so the UUID cluster below only has KD 15–30 rows. Re-export it.  
> **Updated:** 2026-11-14 · **Site:** KKCTools, **DA 1, new domain**, 24 calculators live (construction + Business & Creative); no developer tools yet  
> **Selection rule:** only keywords a brand-new DA 1 site can realistically push into the **top 10** (same filter as Batches 5–6). Everything else is listed with the reason.  
> **SERP data:** ⏳ none yet for Batch 7 — rank chances are judged from keyword data and known SERP owners; confirm with the SERP pull in Section 6

## How keywords were selected (DA 1 filter)

1. **Primary KD ≤ 15** where the data allows it. The UUID cluster is the exception: the easy export is missing, so its primary is KD 18 and marked 🟡.
2. **The tool must work 100% in the browser.** Breach checks and one-time secret links need a server, so they are not selected.
3. **No brand or navigational intent** (LastPass, 1Password, Gmail / Xbox account recovery).
4. **No harmful intent:** hacking and password-cracking searches are dropped, whatever their volume.
5. **Security advice must be sourced** (NIST SP 800-63B, CISA). No invented rules or “X% of hacks” statistics.

**Rank chance:** ✅ good = exact tool term or long tail at KD ≤ 15 with no single dominant site · 🟡 possible = KD 16–29 or brand sites in the way; needs links and a better tool.

## What these exports tell us (read first)

- **This batch is thin for a “Developer & Web Tools” category.** Only two seeds were exported, and most password rows are about password managers or account recovery, not tools. Section 6 lists the seeds to export next (JSON formatter, Base64, URL encode, hash generator, QR code, and others).
- **Neither seed head is in the files.** `password generator`, `random password generator` and `uuid generator` are missing (KD > 30).
- **The easy wins are password tools:** `generate secure password` 3,600 / KD 0, `password strength tester` 4,400 / KD 0, plus a long tail of “password rules” questions (special characters, upper / lower case, 8-character examples).
- **The UUID cluster is large (~45,000 combined) but KD 15–29 only**, because the 0–15% export was saved wrongly.
- **Both password tools are a strong trust signal:** “made in your browser, never sent” is a real advantage over sites that generate passwords on a server.

## How to read the tables

- **Role:** Primary = the page’s main target · Secondary – easy = KD ≤ 15 · Secondary – medium = KD 16–24 · Support = KD 25–30, use in H2 / FAQ.
- **Intent** (Semrush codes, decoded as 0 = Info, 1 = Nav, 2 = Comm, 3 = Trans).
- **Trend:** ⚠ irregular = 4+ months at zero · ⚠ declining = last 3 months under half of the first 3 · ↑ rising = last 3 months over 1.6× the first 3.
- **Long-tail rows** (“… queries (N phrases)”) sum many near-identical searches answered by one section on the page.

---

## 1. Selected new tools — master table (build in this order)

| # | Tier | Rank chance | New tool | Primary keyword | US Vol | KD | CPC | Keywords | Cluster US vol | Easy vol (KD ≤15) | URL |
|---:|:---:|:---:|---|---|---:|---:|---:|---:|---:|---:|---|
| 1 | **1** | ✅ | Password Generator (Strong, Random, PIN) | `generate secure password` | 3,600 | 0 | $0.06 | 24 | 47,490 | 37,190 | `/password-generator/` |
| 2 | **1** | ✅ | Password Strength Checker | `password strength tester` | 4,400 | 0 | $0.03 | 15 | 17,730 | 7,530 | `/password-strength-checker/` |
| 3 | **1** | 🟡 | UUID / GUID Generator (v4, v7, Validator) | `random uuid` | 1,900 | 18 | $0.00 | 83 | 45,720 | 610 | `/uuid-generator/` |
| 4 | **2** | 🟡 | Passphrase Generator (Random Words) | `generate passphrase` | 720 | 10 | $0.17 | 3 | 10,220 | 720 | `/passphrase-generator/` |
| 5 | **3** | ✅ | Hacker Name Generator | `hacker name generator` | 210 | 6 | $0.00 | 1 | 210 | 210 | `/hacker-name-generator/` |

**Totals:** 5 new tools · 126 keywords · 121,370 combined US volume · 46,260 on KD ≤ 15. Close variants overlap (`guid generator` / `generate guid` / `uuid generate`), so real traffic will be much lower.

**Tiers:** **1** = build first · **2** = build next (cheap once the random engine exists) · **3** = later (small).

**One engine, three pages:** a shared secure-random module (`crypto.getRandomValues` + rejection sampling) powers #1 Password Generator, #3 UUID Generator and #4 Passphrase Generator. #2 Strength Checker reuses #1’s scoring. #5 reuses the Band Name Generator engine.

---

## 2. Tool-by-tool detail

## Tier 1 — build first

### 1. Password Generator (Strong, Random, PIN)  ✅

- **URL:** `/password-generator/`
- **SEO title (44 chars, 56 with “ | KKC Tools”):** Password Generator – Strong Random Passwords
- **H1:** Password Generator: Create a Strong, Random Password
- **Meta description (151 chars):** Free password generator. Create strong random passwords or PINs with your own length and character rules, made in your browser and never sent anywhere.
- **Primary keyword:** `generate secure password` — US 3,600 · KD 0 · CPC $0.06 · ad comp 0.27
- **Rank chance for a DA 1 site:** ✅
- **Export seed:** #1 random password generator strong
- **Cluster:** 24 keywords · 47,490 US searches · 37,190 on KD ≤ 15
- **SERP:** ⏳ not pulled yet — see Section 6

**Why this tool:** The exact tool rows are **KD 0** (`generate secure password` 3,600, `online password generator` 1,900), and the “password rules” searches (special characters, upper / lower case, 8-character examples) are KD 8–24. Pure browser logic using `crypto.getRandomValues`, so it fits the zero-network rule perfectly.

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`generate secure password`** | **Primary** | 3,600 | 0 | $0.06 | 0.27 | Info |  |  |
| `best password practices` | Secondary – easy (KD ≤15) | 27,100 | 14 | $1.46 | 0.04 | Comm | ⚠ irregular | ⚠ irregular volume (27,100 is inflated) — H2 “Password tips”, cite NIST / CISA |
| `online password generator` | Secondary – easy (KD ≤15) | 1,900 | 0 | $0.03 | 0.09 | Comm | ⚠ declining |  |
| `password special characters` | Secondary – easy (KD ≤15) | 1,000 | 8 | $0.00 | 0.33 | Info |  | H2: the special-character set, with a copyable list |
| `create pwd` | Secondary – easy (KD ≤15) | 480 | 10 | $0.06 | 0.20 | Info | ⚠ irregular |  |
| `generated passwords` | Secondary – easy (KD ≤15) | 480 | 11 | $0.05 | 0.20 | Info | ⚠ declining |  |
| `strongest wifi password` | Secondary – easy (KD ≤15) | 480 | 11 | $0.00 | 0.33 | Info |  | Wi-Fi preset (WPA2 max 63 characters, no confusing characters) |
| `passwords that are strong` | Secondary – easy (KD ≤15) | 320 | 10 | $0.05 | 0.14 | Info |  |  |
| `what are the special characters for passwords` | Secondary – easy (KD ≤15) | 320 | 14 | $0.00 | 0.33 | Info | ⚠ declining | same H2 |
| `pw random` | Secondary – easy (KD ≤15) | 260 | 7 | $0.02 | 0.14 | Comm | ⚠ irregular |  |
| `creating strong password` | Secondary – easy (KD ≤15) | 210 | 13 | $0.08 | 0.28 | Info |  |  |
| `how to generate wifi password` | Secondary – easy (KD ≤15) | 210 | 5 | $0.65 | 0.05 | Info | ⚠ declining | same Wi-Fi preset |
| `example of password with 8 characters` | Secondary – easy (KD ≤15) | 210 | 10 | $0.00 | 0.01 | Info | ↑ rising | show freshly generated examples, never a fixed “example” people copy |
| `15 letter password` | Secondary – easy (KD ≤15) | 170 | 7 | $0.86 | 0.02 | Info |  | length preset |
| `example of 8 characters password` | Secondary – easy (KD ≤15) | 170 | 14 | $0.00 | 0.01 | Info |  | same |
| `example of a password with 8 characters` | Secondary – easy (KD ≤15) | 140 | 12 | $0.00 | 0.33 | Info |  | same |
| `best phone passwords` | Secondary – easy (KD ≤15) | 140 | 13 | $0.00 | 0.33 | Info/Comm |  | PIN mode + tip to avoid 1234 / birthdays |
| `passgen` | Secondary – medium (KD 16–24) | 1,300 | 22 | $0.09 | 0.11 | Info |  |  |
| `upper & lowercase letters password` | Secondary – medium (KD 16–24) | 1,300 | 24 | $0.00 | 0.33 | Info |  | rule checkboxes (must contain upper / lower / number / symbol) |
| `uppercase lowercase password` | Secondary – medium (KD 16–24) | 1,300 | 24 | $0.00 | 0.33 | Info |  | same |
| `password must be numeric 0 9` | Secondary – medium (KD 16–24) | 1,300 | 19 | $0.00 | 0.33 | Info | ↑ rising | PIN / numbers-only mode |
| `random pw` | Support – H2/FAQ (KD 25–30) | 1,900 | 27 | $0.03 | 0.15 | Info |  |  |
| `password policy expiration special characters length` | Support – H2/FAQ (KD 25–30) | 1,900 | 28 | $0.00 | 0.00 | Info | ⚠ declining | ⚠ declining — H2 on common password rules, cite NIST SP 800-63B |
| `upper case lower case letters password` | Support – H2/FAQ (KD 25–30) | 1,300 | 28 | $0.00 | 0.33 | Info |  | same |

**Tool must include:**
- Length slider 4–128; checkboxes for upper, lower, numbers, symbols; exclude look-alike characters (O 0 l 1); custom symbol set
- “Must contain at least one of each” rule; PIN mode (digits only); Wi-Fi preset
- Generate 1–50 passwords at once; copy button; strength meter (shares the #2 engine)
- Randomness from `crypto.getRandomValues` only (never `Math.random`), with rejection sampling so there is no bias
- Privacy line: generated in your browser, never stored or sent

**Note:** The head `password generator` and `random password generator` are not in the exports (KD > 30) and are held by password-manager brands (Bitwarden, LastPass, 1Password, Norton). Target the KD 0 variants and the rules long tail first. Security advice must cite NIST / CISA, never invented rules.

### 2. Password Strength Checker  ✅

- **URL:** `/password-strength-checker/`
- **SEO title (46 chars, 58 with “ | KKC Tools”):** Password Strength Checker – Test Your Password
- **H1:** Password Strength Checker: How Strong Is Your Password?
- **Meta description (153 chars):** Free password strength checker. See how long your password would take to guess, why it is weak, and whether it is on a common-password list, all offline.
- **Primary keyword:** `password strength tester` — US 4,400 · KD 0 · CPC $0.03 · ad comp 0.04
- **Rank chance for a DA 1 site:** ✅
- **Export seed:** #1 random password generator strong
- **Cluster:** 15 keywords · 17,730 US searches · 7,530 on KD ≤ 15
- **SERP:** ⏳ not pulled yet — see Section 6

**Why this tool:** `password strength tester` is **4,400 / KD 0** and the rest of the cluster is KD 5–21. Entropy, patterns and a bundled common-password list all run in the browser. It pairs with the generator (each page links to the other).

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`password strength tester`** | **Primary** | 4,400 | 0 | $0.03 | 0.04 | Info |  |  |
| `most common passwords` | Secondary – easy (KD ≤15) | 1,600 | 13 | $0.00 | 0.33 | Info |  | offline check against a bundled common-password list + H2 showing the top 20 |
| `password 123456` | Secondary – easy (KD ≤15) | 320 | 14 | $0.00 | 0.33 | Info |  | FAQ: why “123456” is cracked instantly |
| `weak password strong password` | Secondary – easy (KD ≤15) | 210 | 5 | $0.00 | 0.33 | Info |  |  |
| `popular passwords` | Secondary – easy (KD ≤15) | 210 | 10 | $2.75 | 0.01 | Info |  | same H2 |
| `password strength check` | Secondary – easy (KD ≤15) | 170 | 14 | $0.52 | 0.03 | Info | ⚠ declining |  |
| `types of password attacks` | Secondary – easy (KD ≤15) | 170 | 10 | $0.00 | 0.33 | Info | ⚠ declining | H2: brute force, dictionary, credential stuffing (explains the guess-time estimate) |
| `guessing passwords` | Secondary – easy (KD ≤15) | 170 | 14 | $0.00 | 0.33 | Info | ⚠ irregular | ⚠ irregular — guess-time estimate |
| `10 000 most common passwords` | Secondary – easy (KD ≤15) | 140 | 9 | $0.00 | 0.33 | Info | ⚠ irregular | same list |
| `4 sequential letters` | Secondary – easy (KD ≤15) | 140 | 12 | $0.00 | 0.33 | Info | ⚠ declining | pattern check (abcd, 1234, qwerty) |
| `password strength` | Secondary – medium (KD 16–24) | 2,400 | 21 | $1.84 | 0.03 | Info |  |  |
| `password security` | Secondary – medium (KD 16–24) | 1,900 | 17 | $4.27 | 0.26 | Info |  | H2 |
| `password complexity checker` | Secondary – medium (KD 16–24) | 1,300 | 19 | $0.79 | 0.04 | Info |  |  |
| `consequences of sharing passwords` | Secondary – medium (KD 16–24) | 1,000 | 17 | $0.00 | 0.00 | Info |  | FAQ |
| `password guesser` | Support – H2/FAQ (KD 25–30) | 3,600 | 26 | $0.00 | 0.04 | Info |  | ⚠ some hacking intent — we only estimate guess time, never crack |

**Tool must include:**
- Live score as you type: entropy bits, estimated guess time (offline fast-hash vs online throttled), plain-English reasons
- Pattern checks: sequences, repeats, keyboard rows, years, common words, l33t swaps
- Offline check against a bundled common-password list (no breach API)
- Text is never stored, logged or sent: big privacy note; input is type=password with a show toggle
- “Make it stronger” button → opens the generator with similar length

**Note:** Breach checks (Have I Been Pwned style) need a network call, so they are out (see Section 4). The common-password list must come from a source whose licence allows reuse: `TODO(owner)`: approve the list source before shipping. Guess-time figures are estimates; show the assumed guesses per second.

### 3. UUID / GUID Generator (v4, v7, Validator)  🟡

- **URL:** `/uuid-generator/`
- **SEO title (45 chars, 57 with “ | KKC Tools”):** UUID Generator – Random UUID v4 & GUID Online
- **H1:** UUID Generator: Create Random UUIDs (v4, v7) and GUIDs
- **Meta description (157 chars):** Free UUID generator. Create random v4 or time-ordered v7 UUIDs and GUIDs in bulk, check if a UUID is valid, and copy code for your language, in your browser.
- **Primary keyword:** `random uuid` — US 1,900 · KD 18 · CPC $0.00 · ad comp 0.33
- **Rank chance for a DA 1 site:** 🟡
- **Export seed:** #2 uuid generator online
- **Cluster:** 83 keywords · 45,720 US searches · 610 on KD ≤ 15
- **SERP:** ⏳ not pulled yet — see Section 6

**Why this tool:** About **45,000 combined searches**, but nearly all rows are **KD 15–29** (the 0–15% export for this seed was saved wrongly; see the top note). Developer tool sites with modest authority rank here, so a better tool (v7, bulk, validator, formats) can get in, but it needs links.

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`random uuid`** | **Primary** | 1,900 | 18 | $0.00 | 0.33 | Info |  |  |
| `guid online generator` | Secondary – easy (KD ≤15) | 210 | 15 | $0.00 | 0.33 | Info | ↑ rising |  |
| `uuid random` | Secondary – easy (KD ≤15) | 110 | 15 | $0.00 | 0.01 | Nav | ⚠ declining |  |
| `v4 uuid generator` | Secondary – easy (KD ≤15) | 110 | 15 | $0.00 | 0.33 | Nav |  |  |
| `guid converter` | Secondary – easy (KD ≤15) | 90 | 15 | $0.00 | 0.33 | Info |  | format options: upper case, braces, no hyphens, Base64, URN |
| `uuid v5 generator` | Secondary – easy (KD ≤15) | 90 | 15 | $0.00 | 0.33 | Comm | ↑ rising | v5 mode (namespace + name, SHA-1 done in our own code) |
| `uuid4 generator` | Secondary – medium (KD 16–24) | 1,900 | 23 | $0.28 | 0.33 | Nav | ↑ rising |  |
| `gen uuid` | Secondary – medium (KD 16–24) | 1,600 | 23 | $0.37 | 0.33 | Info/Nav | ⚠ irregular |  |
| `generated uuid` | Secondary – medium (KD 16–24) | 880 | 21 | $1.71 | 0.33 | Info/Nav | ⚠ irregular |  |
| `guid generator online` | Secondary – medium (KD 16–24) | 880 | 21 | $0.00 | 0.33 | Info | ↑ rising |  |
| `generate random uuid` | Secondary – medium (KD 16–24) | 590 | 23 | $0.00 | 0.00 | Info | ⚠ declining |  |
| `generate uuid random` | Secondary – medium (KD 16–24) | 590 | 24 | $0.00 | 0.33 | Info |  |  |
| `uuid v4 generator` | Secondary – medium (KD 16–24) | 590 | 20 | $0.00 | 0.33 | Nav | ⚠ declining |  |
| `online uuid generator` | Secondary – medium (KD 16–24) | 480 | 20 | $0.00 | 0.33 | Nav | ↑ rising |  |
| `uuidv4 generator` | Secondary – medium (KD 16–24) | 480 | 23 | $0.29 | 0.01 | Nav |  |  |
| `uuidgenerator` | Secondary – medium (KD 16–24) | 390 | 23 | $0.37 | 0.33 | Nav |  |  |
| `generate online guid` | Secondary – medium (KD 16–24) | 260 | 21 | $0.00 | 0.33 | Info | ⚠ declining |  |
| `guid length` | Secondary – medium (KD 16–24) | 260 | 23 | $0.00 | 0.33 | Info | ⚠ declining | same FAQ |
| `guid validator` | Secondary – medium (KD 16–24) | 210 | 18 | $0.00 | 0.33 | Info |  | validator mode (paste → valid? version? variant?) |
| `identifier generator` | Secondary – medium (KD 16–24) | 210 | 21 | $0.00 | 0.33 | Info |  | ⚠ broad |
| `uuid generate online` | Secondary – medium (KD 16–24) | 210 | 20 | $0.00 | 0.33 | Nav | ↑ rising |  |
| `what does guid stand for` | Secondary – medium (KD 16–24) | 210 | 24 | $0.00 | 0.33 | Info |  | FAQ / H2 |
| `online generate uuid` | Secondary – medium (KD 16–24) | 170 | 18 | $0.00 | 0.33 | Nav | ↑ rising |  |
| `uiid generator` | Secondary – medium (KD 16–24) | 170 | 22 | $0.37 | 0.33 | Nav | ⚠ irregular | misspelling |
| `online uuid` | Secondary – medium (KD 16–24) | 140 | 19 | $0.00 | 0.33 | Nav |  |  |
| `online uuid generator tool` | Secondary – medium (KD 16–24) | 140 | 18 | $0.00 | 0.33 | Nav | ↑ rising |  |
| `unique identifier generator` | Secondary – medium (KD 16–24) | 140 | 23 | $0.00 | 0.33 | Info |  |  |
| `uuid generator v4` | Secondary – medium (KD 16–24) | 110 | 21 | $0.00 | 0.33 | Nav |  |  |
| `database uuid` | Secondary – medium (KD 16–24) | 110 | 16 | $4.36 | 0.05 | Info |  | H2: UUID v7 vs v4 as a database key |
| `generate uid` | Secondary – medium (KD 16–24) | 90 | 18 | $0.37 | 0.33 | Nav | ↑ rising |  |
| `generate unique identifier` | Secondary – medium (KD 16–24) | 90 | 20 | $0.00 | 0.33 | Info |  |  |
| `generateguid` | Secondary – medium (KD 16–24) | 90 | 23 | $0.27 | 0.01 | Info | ⚠ irregular |  |
| `guid generat` | Secondary – medium (KD 16–24) | 90 | 21 | $0.37 | 0.33 | Nav | ⚠ irregular | cut-off spelling |
| `uetr generator` | Secondary – medium (KD 16–24) | 90 | 18 | $0.00 | 0.33 | Nav |  | SWIFT UETR = a UUID v4 — preset + FAQ |
| `uuid online generator` | Secondary – medium (KD 16–24) | 90 | 17 | $0.00 | 0.33 | Nav | ↑ rising |  |
| `how long is a guid` | Secondary – medium (KD 16–24) | 90 | 18 | $0.00 | 0.33 | Info |  | same FAQ |
| `guid` | Support – H2/FAQ (KD 25–30) | 8,100 | 26 | $38.92 | 0.33 | Info |  | ⚠ single word, CPC $38.92 (ad noise) — H2 “What is a GUID?” |
| `guid generator` | Support – H2/FAQ (KD 25–30) | 6,600 | 29 | $0.28 | 0.33 | Nav |  |  |
| `generate uuid` | Support – H2/FAQ (KD 25–30) | 3,600 | 25 | $0.28 | 0.33 | Info | ↑ rising |  |
| `generate guid` | Support – H2/FAQ (KD 25–30) | 2,400 | 28 | $0.27 | 0.01 | Info/Nav | ↑ rising |  |
| `guid creator` | Support – H2/FAQ (KD 25–30) | 1,300 | 26 | $4.20 | 0.33 | Info | ⚠ declining |  |
| `random uuid generator` | Support – H2/FAQ (KD 25–30) | 1,000 | 25 | $0.00 | 0.33 | Nav |  |  |
| `uuid generate` | Support – H2/FAQ (KD 25–30) | 880 | 28 | $0.28 | 0.33 | Info |  |  |
| `guid meaning` | Support – H2/FAQ (KD 25–30) | 720 | 28 | $0.00 | 0.33 | Info |  | FAQ / H2 |
| `uuid length` | Support – H2/FAQ (KD 25–30) | 590 | 29 | $0.00 | 0.33 | Info |  | FAQ: 36 characters / 128 bits |
| `uid generator` | Support – H2/FAQ (KD 25–30) | 480 | 25 | $1.71 | 0.33 | Nav |  |  |
| `empty guid` | Support – H2/FAQ (KD 25–30) | 480 | 25 | $0.00 | 0.33 | Info |  | nil UUID (all zeros) — FAQ + copy button |
| `random guid generator` | Support – H2/FAQ (KD 25–30) | 390 | 27 | $0.28 | 0.01 | Info |  |  |
| `guid gen` | Support – H2/FAQ (KD 25–30) | 320 | 26 | $4.20 | 0.33 | Info | ⚠ irregular |  |
| `sample uuid` | Support – H2/FAQ (KD 25–30) | 320 | 25 | $0.27 | 0.02 | Info |  | example UUID with each part labelled (SVG) |
| `get uuid online` | Support – H2/FAQ (KD 25–30) | 260 | 26 | $0.09 | 0.33 | Nav | ↑ rising |  |
| `generate uuuid` | Support – H2/FAQ (KD 25–30) | 210 | 28 | $1.71 | 0.33 | Info | ⚠ irregular | misspelling |
| `size of guid` | Support – H2/FAQ (KD 25–30) | 210 | 27 | $0.00 | 0.33 | Info |  | same FAQ |
| `guid online` | Support – H2/FAQ (KD 25–30) | 170 | 29 | $0.00 | 0.01 | Info |  |  |
| `online guid` | Support – H2/FAQ (KD 25–30) | 140 | 25 | $0.00 | 0.33 | Info |  |  |
| `unique id generator` | Support – H2/FAQ (KD 25–30) | 140 | 27 | $0.00 | 0.33 | Info |  | short-ID option (nanoid-style, our own code) |
| `universally unique identifiers` | Support – H2/FAQ (KD 25–30) | 140 | 27 | $0.28 | 0.33 | Info | ⚠ irregular | ⚠ irregular — H2 definition |
| `create a new guid` | Support – H2/FAQ (KD 25–30) | 110 | 25 | $0.00 | 0.33 | Info |  |  |
| `uuid mean` | Support – H2/FAQ (KD 25–30) | 110 | 29 | $0.00 | 0.33 | Info | ⚠ irregular |  |
| `uuid size` | Support – H2/FAQ (KD 25–30) | 110 | 29 | $0.00 | 0.33 | Info |  | same FAQ |
| `generate guids` | Support – H2/FAQ (KD 25–30) | 90 | 25 | $4.20 | 0.33 | Info |  |  |
| `uu id` | Support – H2/FAQ (KD 25–30) | 90 | 26 | $1.54 | 0.33 | Info | ⚠ irregular | odd spelling |
| Language how-to queries (C#, Python, Java, SQL, PowerShell) (21 phrases) | Long tail – one H2 + examples | 2,900 | 18–29 | — | — | Info | | One H2 “Generate a UUID in your language” with a short, tested snippet per language; the official docs rank for the deep queries. e.g. `guid newguid`, `create uuid python`, `c# guid`, `uuid java`, `guid in python`, `c# generate guid` |

**Tool must include:**
- v4 (random, `crypto.randomUUID` / `getRandomValues`), v7 (time-ordered), v5 (name-based, SHA-1 in our own code), nil UUID
- Bulk 1–1,000, formats (upper / lower, braces, no hyphens, URN, Base64), download as .txt
- Validator: version, variant, and v7 timestamp decode
- Code snippets for JS, Python, C#, Java, SQL, PowerShell (static text, tested by hand)

**Note:** 🟡 because the head rows are KD 18–29 and long-standing UUID sites hold the top spots. The 0–15% export must be re-pulled before the final tier is set; easy rows may be hiding there.

## Tier 2 — build next

### 4. Passphrase Generator (Random Words)  🟡

- **URL:** `/passphrase-generator/`
- **SEO title (45 chars, 57 with “ | KKC Tools”):** Passphrase Generator – Random Memorable Words
- **H1:** Passphrase Generator: Strong Passwords Made of Random Words
- **Meta description (160 chars):** Free passphrase generator. Build a strong, easy-to-remember passphrase from random words, with your own word count, separator and number rules, in your browser.
- **Primary keyword:** `generate passphrase` — US 720 · KD 10 · CPC $0.17 · ad comp 0.06
- **Rank chance for a DA 1 site:** 🟡
- **Export seed:** #1 random password generator strong
- **Cluster:** 3 keywords · 10,220 US searches · 720 on KD ≤ 15
- **SERP:** ⏳ not pulled yet — see Section 6

**Why this tool:** `passphrase generator` is **6,600 / KD 19** and `generate passphrase` is 720 / KD 10 and rising. Same random engine as the Password Generator; only a word list is new.

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`generate passphrase`** | **Primary** | 720 | 10 | $0.17 | 0.06 | Info | ↑ rising |  |
| `passphrase generator` | Secondary – medium (KD 16–24) | 6,600 | 19 | $0.17 | 0.06 | Info |  | the real head: 6,600 / KD 19 |
| `what is a passphrase` | Support – H2/FAQ (KD 25–30) | 2,900 | 25 | $0.00 | 0.33 | Info |  | H2 + FAQ: passphrase vs password |

**Tool must include:**
- 3–10 words; separator (space, hyphen, dot, none); capitalise; add a number / symbol
- Entropy shown (words × log2(list size))
- Word list bundled in the page (no fetch)

**Note:** Needs a word list. Either write our own list (rule 8: no copied lists) or use a list whose licence allows reuse with credit: `TODO(owner)`: choose the list. Password-manager brands rank for the head, hence 🟡.

## Tier 3 — later

### 5. Hacker Name Generator  ✅

- **URL:** `/hacker-name-generator/`
- **SEO title (45 chars, 57 with “ | KKC Tools”):** Hacker Name Generator – Cool Hacker Usernames
- **H1:** Hacker Name Generator: Cool Hacker Names and Usernames
- **Meta description (151 chars):** Free hacker name generator. Get cool hacker-style names and gamer tags from your own words and styles, then copy your favourites. Made in your browser.
- **Primary keyword:** `hacker name generator` — US 210 · KD 6 · CPC $0.00 · ad comp 0.33
- **Rank chance for a DA 1 site:** ✅
- **Export seed:** #1 random password generator strong (related)
- **Cluster:** 1 keywords · 210 US searches · 210 on KD ≤ 15
- **SERP:** ⏳ not pulled yet — see Section 6

**Why this tool:** Small (**210 / KD 6**) but it is the same kind of tool as the Band Name Generator, so it reuses that engine with a new word bank. Cheap to add.

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`hacker name generator`** | **Primary** | 210 | 6 | $0.00 | 0.33 | Comm |  |  |

**Tool must include:**
- Styles: l33t, cyberpunk, minimal, gamer tag; optional seed word
- Original word bank written by us
- Favourites + copy

**Note:** A fun page only; no real hacking content. Low volume, so build it only when the name-generator engine already exists.

---

## 3. Keywords for live or planned pages

None. No Batch 7 keyword fits an existing KKCTools page or a tool planned in Batches 2–6.

---

## 4. Not selected — a DA 1 site cannot build or hold these now

| Group | Keywords | US vol | Top examples (US vol / KD) | Why not |
|---|---:|---:|---|---|
| Password managers, apps & brand comparisons | 58 | 189,140 | `what is a password manager` 110,000/15, `lastpass password generator` 14,800/29, `dashlane password generator` 8,100/23, `1password extension` 5,400/25, `1 password login` 5,400/7 | Review and brand searches (`what is a password manager` 110,000, mostly declining). These need affiliate-style reviews and brand trust, not a tool. Brand generators (`lastpass password generator` 14,800) want that brand’s page. |
| Account recovery & log-in (navigational) | 44 | 99,050 | `gmail forgot password` 9,900/28, `mypassword` 9,900/28, `one password login` 5,400/24, `password reset` 5,400/17, `how do i find my google password` 4,400/26 | People want Google / Microsoft / Xbox help pages. No tool can help, and those official pages own the SERP. |
| Breach checks & secret sharing (need a server) | 10 | 14,930 | `onetimesecret` 6,600/29, `one time secret` 2,900/17, `breachdirectory` 1,300/24, `onetime secret` 1,300/17, `compromised passwords` 1,000/13 | A breach check needs a network call (breach API) and one-time secret links need a server. Both break the zero-network rule. |
| Hacking, cracking & phone security | 16 | 14,200 | `can an iphone be hacked` 1,900/26, `can an iphone be hacked into` 1,900/28, `how to check if iphone is hacked` 1,900/25, `hack to hack` 1,300/19, `how to hack wifi` 1,300/23 | Harmful or off-topic intent (`how to hack wifi`, `crack zip password`, lab exercises). Not something we publish. |
| App lock & passkeys (device features, not tools) | 9 | 28,280 | `passkeys` 14,800/17, `app lock software for android` 5,400/27, `what is a pass key` 1,900/23, `how to lock apps on android` 1,900/8, `how to lock application in android` 1,600/25 | `passkeys` (14,800 / KD 17) and Android app-lock how-tos are device settings and explainers. Possible blog topics later, not tools. |
| “The Password Game” rule searches | 9 | 45,500 | `password game` 33,100/21, `the roman numerals in your password should multiply to 35.` 4,400/25, `game of password` 2,400/27, `the digits in your password must add up to 25.` 1,900/28, `773rd most common password` 1,300/25 | Players of a popular browser game looking up rule answers (`the roman numerals in your password should multiply to 35.` 4,400). Mostly declining fad traffic tied to someone else’s game, so not selected. |
| Non-English searches (Chinese, Japanese, Russian, Spanish) | 15 | 11,890 | `uuid在线生成` 2,400/23, `パスワード生成` 1,900/23, `随机数生成器` 1,900/29, `uuid生成` 1,600/27, `uuid生成器` 1,600/29 | KKCTools is English-only. `uuid在线生成` (2,400) and `パスワード生成` (1,900) could be a later localisation project. |

### Small ideas (not selected now)

| Keyword | US Vol | KD | Trend | Note |
|---|---:|---:|:---:|---|
| `secret messages` | 1,000 | 23 | ⚠ declining | ⚠ declining — a browser-only text cipher (Caesar / Base64) could fit later; unclear intent |
| `pw list` | 1,000 | 12 | ↑ rising | ⚠ unclear (a list of passwords? a password-list app?) |
| `desired password` | 720 | 14 | ⚠ declining | ⚠ declining, unclear intent |

---

## 5. Dropped — no tool intent

| Group | Keywords | US vol | Examples | Why dropped |
|---|---:|---:|---|---|
| Unturned game item IDs | 6 | 730 | `id generator unturned` 210, `generator unturned id` 170, `id for generator unturned` 140, `bed id in unturned` 70, `bed id unturned` 70, `bed unturned id` 70 | Players of the game Unturned looking up item IDs; nothing to do with UUIDs. |
| Misc & fragments | 4 | 800 | `export addon list in brave browser` 210, `intext:password` 210, `skvqx2` 210, `account generators` 170 | Random strings, search operators and unclear queries. |

**Every keyword is accounted for:** New tools (Sections 1–2): 126 · Not selected + ideas (Section 4): 164 · Dropped (Section 5): 10 · **Total: 300 of 300 unique keywords.**

---

## 6. Next steps

1. **Re-export** `uuid generator online` at KD 0–15% (the saved file is a copy of the password export).
2. **Pull SERPs (top 10, Domain AS) for:** `generate secure password`, `online password generator`, `password strength tester`, `password complexity checker`, `random uuid`, `guid generator`, `passphrase generator`, `generate passphrase`. Any primary with 3+ giants (AS ≥ 60) in the top 5 drops one tier.
3. **Pull the missing heads:** `password generator`, `random password generator`, `strong password generator`, `uuid generator`, `password strength checker`, `pin generator`.
4. **Export more Developer & Web seeds** (this batch only covered two): `json formatter`, `json validator`, `base64 encode`, `base64 decode`, `url encode`, `hash generator` / `sha256 generator` / `md5 generator`, `qr code generator`, `regex tester`, `jwt decoder`, `unix timestamp converter`, `hex to rgb`, `color picker`, `lorem ipsum generator`, `slug generator`, `cron expression generator`, `html entity encoder`, `diff checker`, `random number generator`. All can run 100% in the browser.
5. **Build order:** shared secure-random module → #1 Password Generator → #2 Strength Checker → #3 UUID Generator → #4 Passphrase Generator → #5 Hacker Name Generator.
6. **New catalog category:** add “Developer & Web” to `TOOLS_CATALOG` when the first tool ships. Hub: Password Generator ↔ Strength Checker ↔ Passphrase Generator; UUID Generator links to the future JSON / Base64 / hash tools.
7. **`TODO(owner)`:** approve the common-password list source (#2) and the passphrase word list (#4) before shipping.
