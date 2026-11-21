# Password Generator (Strong, Random, PIN) — Build Spec

> **URL:** `/password-generator/` · Batch 7 · Tier 1 · **Build order 1** (builds `secure-random`)
> **Read first:** `../00_BATCH7_BUILD_RULES.md` (§2 security rules, §3 NIST/CISA/OWASP sources, §4 shared code)
> **Inputs:** `01_Password_Generator_Competitor_Analysis.md`, keyword file §2 #1
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**The exact tool rows are KD 0:** `generate secure password` **3,600 / KD 0** (primary), `online password generator` 1,900 / KD 0. The cluster is 24 keywords / 47,490 searches, 37,190 on KD ≤ 15.

**The heads are taken:** `password generator` and `random password generator` (KD > 30) belong to password-manager brands (1Password, Bitwarden, LastPass, Norton, RoboForm). We go in through the KD 0 variants and the **"password rules" long tail**:
- `password special characters` 1,000 / KD 8; `what are the special characters for passwords` 320;
- `upper & lowercase letters password` / `uppercase lowercase password` 1,300 each; `upper case lower case letters password` 1,300;
- `password must be numeric 0 9` 1,300 (rising): PIN mode;
- `example of password with 8 characters` (+ 2 variants, ≈ 520 together, rising);
- `strongest wifi password` 480, `how to generate wifi password` 210: Wi-Fi preset;
- `best phone passwords` 140: PIN tips;
- `best password practices` 27,100 (⚠ irregular, inflated): one H2 of cited tips, not a target.

**Our edge is trust you can check:**
- generated in the browser with Web Crypto and the method explained (no competitor names its randomness source; GIGAcalculator appears to generate on its server);
- exact entropy in bits;
- advice from NIST SP 800-63B rev 4 and CISA, not invented statistics.

### Research notes from the competitor analysis

- **Pages read:** 1Password, GIGAcalculator, RoboForm, 10015.io, NIST SP 800-63B rev 4.
- **1Password:** random / memorable / PIN modes; no stated length range, randomness source, bulk or meter; "81% of breaches…" unsourced; product-led FAQ.
- **GIGAcalculator:** the longest article but **apparently server-side** ("our server does not store", TLS 1.2). **Errors:** 10 lowercase letters given as 95,428,956,661,682,176 combinations; the correct figure is **26¹⁰ = 141,167,095,653,376** (node-checked). A 29-character example called "30"; "29 special characters" with ~10 listed; SHA-1 listed with no warning.
- **RoboForm:** client-side stated, exclude-similar, hex mode, meter (method hidden); no length control or symbol toggle visible.
- **10015.io:** all toggles + exclude confusing/ambiguous, "generated in your browser", default 16; says 2FA makes login "impossible" (overstated).
- **0 of 4** disclose the RNG, enforce "at least one of each", offer bulk, show entropy or cite NIST.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | generate secure password | 3,600 | 0 | first sentence, H2 "How to generate a secure password", Generate button label ("Generate secure password") |
| Head (not in exports) | password generator · random password generator · strong password generator | — | — | title, H1, ToolShell heading (`TODO(owner)`: pull volumes) |
| Secondary | online password generator · generated passwords · passgen · pw random · random pw · create pwd | 1,900 · 480 · 1,300 · 260 · 1,900 · 480 | 0–27 | intro, HowWeCalculate, FAQ wording |
| Secondary | passwords that are strong · creating strong password | 320 · 210 | 10–13 | H2 "What makes a password strong?" |
| Secondary | password special characters · what are the special characters for passwords | 1,000 · 320 | 8–14 | H2 "Password special characters" + a copyable list |
| Secondary | upper & lowercase letters password · uppercase lowercase password · upper case lower case letters password | 1,300 × 3 | 24–28 | H2 "Do passwords need upper and lower case letters?" |
| Secondary | password must be numeric 0 9 · best phone passwords | 1,300 · 140 | 13–19 | PIN tab + H2 "PINs and numbers-only passwords" |
| Secondary | example of password with 8 characters · example of 8 characters password · example of a password with 8 characters | 210 · 170 · 140 | 10–14 | FAQ: **live-generated** 8-character examples (never fixed strings) |
| Secondary | strongest wifi password · how to generate wifi password | 480 · 210 | 5–11 | Wi-Fi tab + H2 "Wi-Fi passwords" |
| Secondary | 15 letter password | 170 | 7 | length preset "15 (NIST minimum)" |
| Support | password policy expiration special characters length | 1,900 | 28 | H2 "Password rules: what NIST says" |
| Support (⚠ irregular) | best password practices | 27,100 | 14 | H2 "Password tips that help" (NIST + CISA) |

## 2. Our edge

- **Web Crypto generation, method on the page:** `crypto.getRandomValues`, rejection sampling, Fisher–Yates; never `Math.random`; fails closed.
- **Full control:** length 4–128 (default 16); upper, lower, digits, symbols; **custom symbol set**; exclude look-alikes (`O 0 I l 1`); **"at least one of each" enforced without bias** (place one from each, fill, shuffle).
- **Presets:** Strong (16, all sets) · NIST minimum (15) · PIN (4–12 digits) · Wi-Fi (WPA2: 8–63 printable ASCII; default 20 letters + digits, look-alikes off) · Hex (32) · Letters + digits only.
- **Bulk 1–50,** copy all, download `.txt` (made locally).
- **Exact entropy in bits** and guess-time for the 4 shared scenarios (assumptions shown).
- **Copyable special-character list** (the 32 ASCII symbols; space noted).
- **NIST- and CISA-cited tips**, with the archived-page caveat for CISA.
- **Privacy:** nothing stored, nothing sent, no analytics on output.

## 3. Calculator spec

### 3.1 Tabs

1. **Password** (default)
2. **PIN**
3. **Wi-Fi**
4. **Bulk**

### 3.2 Input guide diagram (above the inputs)

`PasswordInputGuide.tsx`: a masked sample password as 16 boxes, coloured by character set.

- Sample pattern (not a real output): `Aa9#····` style boxes, with a legend.
- **Callouts:**
  - "1 Length (16)" along the row;
  - "2 Character sets: A–Z · a–z · 0–9 · symbols" on the legend chips;
  - "3 Exclude look-alikes (O 0 I l 1)" with two struck-out boxes;
  - "4 At least one of each" with one tick per set;
  - a badge "≈ 104.6 bits" (engine value for the current options).
- **PIN tab:** 6 digit boxes + "avoid 1234, birthdays" note.
- **Wi-Fi tab:** a router icon + "8–63 characters".
- **Bulk tab:** a stack of rows "× 10".

Live: box count, colours and the bits badge follow the options; **the real password is never drawn in the diagram**.

### 3.3 Inputs

| Field | Default |
|---|---|
| Length | 16 (slider + number, 4–128) |
| Upper / lower / digits / symbols | all on |
| Symbol set | the 32 ASCII symbols (editable text field; duplicates removed) |
| Exclude look-alikes (`O 0 I l 1`) | off |
| At least one of each selected set | on |
| PIN length | 6 (4–12) |
| Wi-Fi length | 20 (8–63); sets letters + digits; look-alikes off |
| Bulk count | 10 (1–50) |
| Scenario rates | from `attack-scenarios.ts` (editable in a details panel) |

### 3.4 Engine (`src/lib/secure-random.ts` + `src/lib/password-engine.ts`)

```ts
randomInt(n): x = Uint32 ; limit = floor(2^32 / n) * n ; retry while x >= limit ; return x % n
pool = union(selected sets) minus lookAlikes minus duplicates     // validate: pool.length >= 2, else error
generate(L):
  if requireEach and L >= sets.length: chars = [one from each set] + (L - k) from pool ; shuffle (Fisher–Yates, randomInt)
  else: L × pool[randomInt(pool.length)]
entropyBits:
  plain: L × log2(pool)
  requireEach: log2( Σ_{S ⊆ sets} (-1)^|S| × (pool − |∪S|)^L )   // inclusion–exclusion, BigInt
pin(L) = digits only (no requireEach) ; bits = L × log2(10)
wifi: printable ASCII 32–126 allowed; length 8–63 enforced
guessTime(bits, rate) = 2^(bits-1) / rate seconds → human units
```

**Worked examples (checked with node, 2026-11-22):**

| Options | Result |
|---|---|
| **16 characters, all 4 sets (pool 94)** | **104.87 bits** plain; **104.59 bits** with "at least one of each" |
| 16, look-alikes excluded (pool 89) | **103.61 bits** |
| 8, all sets | 52.44 bits (51.32 with require-each) |
| 15 (NIST minimum), all sets | 98.32 bits |
| 20 letters + digits, look-alikes off (pool 57) — Wi-Fi default | **116.66 bits** |
| PIN 4 / 6 | **13.29 / 19.93 bits** (10,000 / 1,000,000 combinations) |
| Hex 32 | 128 bits |
| 10 lowercase letters | **141,167,095,653,376** combinations (26¹⁰) |
| Rejection limit for pool 94 | 4,294,967,254 (retry chance ≈ 9.8 × 10⁻⁹) |
| Guess time, 16 chars look-alikes off (103.61 bits), offline fast hash 10¹¹/s | ≈ **2.45 × 10¹²** years on average |
| Guess time, PIN 6 (19.93 bits), online no limit 10/s | ≈ **13.9 hours** on average; rate-limited (100/h) ≈ **208 days** |

### 3.5 Outputs

- **Big result** (monospace), Copy, Regenerate, Hide/Show.
- **Meter:** bits + label from the shared strength engine (for a random password the label is driven by bits; the pattern matcher only matters for custom input).
- **Sentence:** "This 16-character password was made from 94 possible characters: about 104.6 bits. At 100 billion guesses a second it would take about 4.8 trillion (4.8 × 10¹²) years on average to guess." (engine numbers for the current options)
- Scenario table (4 rows, rates shown).
- Bulk: list with per-row Copy, Copy all, Download `.txt`.
- **Privacy line:** "Made in your browser with Web Crypto. Nothing is saved or sent."
- Link: "Check another password" → #2; "Prefer words?" → #4. Share URL: options only, never the password.

### 3.6 Tests

- `randomInt`: chi-square uniformity on 10⁶ draws for n = 94 and n = 10 (with a seeded test byte source **and** one run on real Web Crypto); rejection path covered with a byte source that forces retries.
- Require-each always satisfied (10⁴ samples); look-alikes never appear when excluded; custom symbol set honoured; pool < 2 → error.
- Entropy (plain and inclusion–exclusion) equals the worked examples.
- PIN digits only; Wi-Fi length bounds 8–63 and ASCII 32–126; bulk count bounds.
- **Lint/test: no `Math.random` in `secure-random`, `password-engine`, `uuid-engine`, `passphrase-engine`;** no import of `src/lib/generator/rng.ts`.
- Web Crypto missing → error state, no output.
- The worked examples. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Password Generator – Strong Random Passwords` (44; 56 with the suffix: OK) |
| Meta | `Free password generator. Create strong random passwords or PINs with your own length and character rules, made in your browser and never sent anywhere.` (151) |
| H1 | `Password Generator: Create a Strong, Random Password` |
| BLUF | "Generate a secure password in one click: 16 random characters from letters, numbers and symbols gives about 104 bits of randomness. Change the length or character rules, make a PIN or a Wi-Fi password, or create up to 50 at once. Passwords are made in your browser with Web Crypto and are never saved or sent." (engine) |
| ToolShell pills | `Made in your browser (Web Crypto)`, `Length 4–128, every character rule`, `PIN & Wi-Fi presets`, `Bits of strength shown` |
| Links out | Password Strength Checker (#2), Passphrase Generator (#4), UUID Generator (#3) |
| Links in | #2, #3, #4, #5, Tools hub "Developer & Web" |

## 5. Content (~1,300–1,600 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to generate a secure password | 4 tabs; options; privacy | 120 |
| 2 | How this password generator makes random passwords | Web Crypto, rejection sampling, shuffle, in plain words; why `Math.random` isn't used | 160 |
| 3 | How long should a password be? | NIST: 15 single-factor, 8 with MFA, accept 64+; CISA's "at least 16" (archived caveat); entropy table by length | 170 |
| 4 | Do passwords need upper and lower case letters? | NIST: sites SHALL NOT force mixtures; but more sets → more bits per character; worked numbers | 150 |
| 5 | Password special characters | The 32 symbols, copyable; space; sites that reject some symbols → custom set | 120 |
| 6 | PINs and numbers-only passwords | 4 vs 6 digits (13.3 vs 19.9 bits); avoid sequences and dates; rate limits matter (`password must be numeric 0 9`, `best phone passwords`) | 130 |
| 7 | Wi-Fi passwords | 8–63 printable characters (source + caveat); letters + digits for typing on TVs; 20 characters ≈ 117 bits | 120 |
| 8 | Password rules: what NIST says | Composition rules not imposed, no periodic changes, blocklists; translated into user tips (`password policy expiration special characters length`) | 150 |
| 9 | Password tips that help | Unique per site, a password manager (no brand picks), MFA; CISA link | 120 |
| 10 | FAQ | §6 | 350 |

## 6. FAQ (11, from the competitor question bank + cluster keywords)

1. How long should a password be? (NIST)
2. What makes a password strong? (randomness and length; bits)
3. What are the special characters for passwords?
4. Is it safe to use an online password generator? (only if it runs locally; how to check ours: it works offline after loading)
5. Should I change my password regularly? (NIST: not on a schedule; change it if it may be exposed)
6. Do I need upper and lower case letters?
7. What is an example of an 8-character password? (three live examples + why 8 is short for a single-factor password)
8. How do I create a strong Wi-Fi password?
9. What is a good phone PIN?
10. What are the best password practices? (cited list)
11. Should I use a password manager? (neutral; no product picks)

## 7. Done when

- [ ] `secure-random.ts` + `password-engine.ts` + `attack-scenarios.ts` + tests; `npm run verify` passes.
- [ ] No `Math.random` and no `generator/rng.ts` import in secret tools (test).
- [ ] InputGuide above the inputs (masked); ToolShell/TabSlider/fonts/`<main>`.
- [ ] Static HTML holds no generated password; generation happens on mount.
- [ ] Registrations + docs + new "Developer & Web" category; `graphify update .`.
- [ ] **STOP and report** (first tool of the batch).
