# Passphrase Generator (Random Words) — Build Spec

> **URL:** `/passphrase-generator/` · Batch 7 · Tier 2 · **Build order 4**
> **Read first:** `../00_BATCH7_BUILD_RULES.md` (§2 security rules, §3 EFF + NIST + CISA sources, §4 `passphrase-engine`)
> **Inputs:** `04_Passphrase_Generator_Competitor_Analysis.md`, keyword file §2 #4
> **SERP:** provisional
> **Written:** 2026-11-22
> **Blocking `TODO(owner)`:** choose the word list before building (§3.4).

---

## 0. Strategy

**Three keywords, 10,220 searches:**
- `generate passphrase` 720 / **KD 10**, rising (primary);
- `passphrase generator` **6,600 / KD 19**: the real head, in the title and H1;
- `what is a passphrase` 2,900 / KD 25: the explainer H2.

**Who ranks:** password-manager brands (Bitwarden, 1Password), the EFF dice page, single-purpose sites (useapassphrase.com), calc sites (Calculate.co.nz), privacy blogs. Brands hold the head, hence 🟡.

**The gap:** no generator names its list *and* shows exact entropy for the chosen options. Calculate.co.nz uses ~130 words and still calls 6 words "very strong" (≈ 42 bits); UseAPassphrase's crack times for two 4-word examples differ ~30×. We show the list, its size, its licence and the exact bits, and every option's effect on them.

**Authority we can cite (§3):** EFF ("we suggest making a six-word passphrase"; long list rolled with 5 dice = 6⁵ = 7,776 words), CISA (passphrase of "4 – 7 unrelated words", archived page), NIST (sites should accept spaces and at least 64 characters).

### Research notes from the competitor analysis

- **Pages read:** Calculate.co.nz Diceware, EFF dice page, Bitwarden (passphrase mode), UseAPassphrase.com, ProPrivacy Diceware guide.
- **Calculate.co.nz:** words × log₂(list) ✔, but ~130-word list (5 words ≈ 35.1 bits; it says "≈ 36"); says a bigger list adds "a little" entropy (7 → 12.9 bits per word is nearly double); 6 words "very strong" (≈ 42 bits).
- **EFF:** long list (5 dice) and two short lists (1,296, 4 dice); advises at least 6 words; no web generator.
- **Bitwarden:** options, list and entropy undocumented; "billions of years" unsourced.
- **UseAPassphrase:** 4/5/12 words, spaces only; 30× crack-time gap; mixes a 10,000/s assumption with a 2012 "350 billion/s" figure; falsely precise "2.213 seconds".
- **ProPrivacy:** no generator despite the title; content from 2019; says computer randomness is "ultimately predictable" (wrong for a CSPRNG).
- **0 of 5** offer bulk, documented capitals/number options, or a clear licence.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | generate passphrase | 720 | 10 | first sentence, Generate button ("Generate passphrase"), H2 "How to generate a passphrase" |
| Secondary | passphrase generator | 6,600 | 19 | title, H1, ToolShell heading, HowWeCalculate |
| Support | what is a passphrase | 2,900 | 25 | H2 "What is a passphrase?" + FAQ 1 |
| Natural | diceware · eff word list · random word password · memorable password | — | — | H2 "Diceware and the EFF word list" (`TODO(owner)`: pull volumes) |

## 2. Our edge

- **A named list with size, source and licence on screen** (bundled inline, no fetch).
- **Exact live entropy** with a breakdown for every option (words, separator, capitals, number, symbol).
- **Options:** 3–10 words (default 6, EFF), separator (space, hyphen, dot, underscore, none, random digit, random symbol, custom), capitals (none · first letter of each word · one random word in capitals), add a number 0–99 and/or a symbol at a random position, no repeated words.
- **Bulk 1–20**, copy all.
- **Guess-time** for the 4 shared scenarios, stating that **the attacker is assumed to know the word list**.
- **Honest content:** dice vs computer randomness (both fine done right), why chosen words are weak, why famous published examples must never be used.
- **Privacy:** made in the browser, never saved or sent.

## 3. Calculator spec

### 3.1 Tabs

1. **Passphrase** (default)
2. **Options & strength** (entropy breakdown + scenarios)
3. **Bulk**

### 3.2 Input guide diagram (above the inputs)

`PassphraseInputGuide.tsx`: six word tiles joined by separators (sample words from our own text, e.g. "word · word · word"; **never the generated phrase**).

- **Callouts:**
  - "1 Number of words (6)" over the tiles;
  - "2 Separator" on a joint;
  - "3 Capitals" on one tile;
  - "4 Add a number / symbol" with an insert caret;
  - "5 Word list: 7,776 words = 12.9 bits per word" on a dictionary icon;
  - total badge "77.5 bits" (engine value for the current options).
- **Options tab:** a stacked bar of bits by source (words, separator, capitals, number).
- **Bulk tab:** "× 5" stack.

Live values; the focused field highlights.

### 3.3 Inputs

| Field | Default |
|---|---|
| Words | 6 (3–10) |
| Separator | hyphen (space, hyphen, dot, underscore, none, random digit, random symbol, custom) |
| Capitals | none (none · first letter of each word · one random word in capitals) |
| Add a number (0–99) | off |
| Add a symbol | off (from the 32 ASCII symbols, or a custom set) |
| No repeated words | off |
| Bulk count | 5 (1–20) |
| Scenario rates | shared `attack-scenarios.ts` |

### 3.4 Engine (`src/lib/passphrase-engine.ts` + `src/data/wordlist-passphrase.ts`)

**Word list (`TODO(owner)`, blocking):**
- **Option A (recommended): EFF long list**, 7,776 words, CC BY 4.0 (eff.org/copyright, "unless otherwise noted"); show the credit "Word list: EFF Long Wordlist, CC BY 4.0" with a link; record the licence in the data file.
- **Option B: our own list** (AGENTS rule 8): ≥ 4,096 unique words, 3–9 letters, no offensive words, homophones or look-alikes; record how it was built; 12 bits per word at 4,096.
- The engine reads `size` from the data file; nothing is hard-coded to 7,776.

```ts
words: k × list[randomInt(size)] (with replacement) ; noRepeat → draw again on a duplicate
separator: fixed (+0 bits) | random digit (+(k-1)·log2 10) | random symbol (+(k-1)·log2 |symbols|)
capitals: none / every first letter (+0) | one random word in capitals (+log2 k)
number 0–99 at a random gap among k+1 positions (+log2(100·(k+1)))
symbol at a random gap (+log2(|symbols|·(k+1)))
bits = k·log2(size) (noRepeat: log2(size·(size-1)·…·(size-k+1))) + extras
guessTime = 2^(bits-1) / rate
```

**Worked examples (checked with node, 2026-11-22; EFF list size 7,776):**

| Options | Bits |
|---|---:|
| 4 words | 51.70 |
| 5 words | 64.62 |
| **6 words, hyphen** | **77.55** (12.925 per word) |
| 6 words, no repeats | 77.55 (77.5461: the difference is tiny) |
| 6 words + one random word in capitals | 80.13 |
| 6 words + a number 0–99 at one of 7 gaps | 87.00 |
| 6 words, random digit separators (5 slots) | 94.16 |
| 6 words from a 1,296-word short list | 62.04 |
| Calculate.co.nz-style ~130-word list, 5 / 6 words | 35.11 / 42.13 (why "very strong" is wrong) |
| Guess time: 6 words, offline fast hash 10¹¹/s | ≈ **35,100 years** on average |
| Guess time: 4 words, same | ≈ **5.1 hours** on average |

### 3.5 Outputs

- **Big result** (monospace), Copy, Regenerate, Hide/Show.
- **Sentence:** "6 random words from a 7,776-word list: 77.5 bits. Even at 100 billion guesses a second, someone who knows the list would need about 35,000 years on average."
- **Breakdown bar** (bits by source) and the scenario table.
- **List line:** size, source, licence, link.
- Bulk list, Copy all.
- **Privacy line:** "Made in your browser with Web Crypto. Nothing is saved or sent."
- Links: "Need characters instead?" → #1; "Test a passphrase" → #2. Share URL: options only.

### 3.6 Tests

- Uniform word choice (chi-square on 10⁶ picks with the test byte source).
- Each option's bit formula; no-repeat maths; separator handling (none / custom / random).
- Number and symbol placement covers every gap.
- List hygiene test: unique entries, length 3–9, lower-case letters only, size matches the data file, none on the offensive-words list.
- No `Math.random`; no network.
- The worked examples. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Passphrase Generator – Random Memorable Words` (45; 57 with the suffix: OK) |
| Meta | `Free passphrase generator. Build a strong, easy-to-remember passphrase from random words, with your own word count, separator and number rules, in your browser.` (160) |
| H1 | `Passphrase Generator: Strong Passwords Made of Random Words` |
| BLUF | "Generate a passphrase of random words that's strong and easy to remember: 6 words from a 7,776-word list give about 77.5 bits, the length the EFF suggests. Choose 3 to 10 words, a separator, capitals or an extra number, and the exact strength updates as you go. Everything is made in your browser and never sent." (engine; numbers depend on the approved list) |
| ToolShell pills | `Exact strength in bits`, `3–10 words, your separator`, `Named word list`, `Made in your browser` |
| Links out | Password Generator (#1), Password Strength Checker (#2) |
| Links in | #1, #2, Tools hub "Developer & Web" |

## 5. Content (~1,200–1,500 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to generate a passphrase | Tabs, options, privacy | 110 |
| 2 | What is a passphrase? | Passphrase vs password; NIST lets sites accept spaces and 64+ characters (`what is a passphrase`) | 150 |
| 3 | How strong is a passphrase? | Formula; table 4–8 words (engine); the attacker-knows-the-list rule | 170 |
| 4 | How many words should a passphrase have? | EFF "six words"; CISA "4 – 7 unrelated words" (archived caveat); our table | 120 |
| 5 | Why random words beat words you choose | People pick predictable words; small lists | 120 |
| 6 | Diceware and the EFF word list | Dice method, list sizes, credit/licence | 130 |
| 7 | Do capitals, numbers and symbols help? | Bits each option adds (engine); length helps more | 120 |
| 8 | Where passphrases work (and sites that block them) | Spaces/length limits on some sites → use hyphens or no separator; password managers | 110 |
| 9 | FAQ | §6 | 320 |

## 6. FAQ (10, from the competitor question bank + cluster keywords)

1. What is a passphrase?
2. Passphrase vs password: which is stronger? (depends on bits; table)
3. How many words should a passphrase have? (EFF six)
4. What is Diceware?
5. How strong is a 4, 5 or 6-word passphrase?
6. Do capital letters or numbers make a passphrase stronger?
7. Is "correct horse battery staple" safe? (no: a famous published example is on every attacker's list)
8. Can I make up my own words? (better not; chosen words are predictable)
9. Is an online passphrase generator safe? (only if it runs locally; ours does)
10. Can I use spaces in a password? (NIST says sites should accept them; some sites still don't)

## 7. Done when

- [ ] Word list chosen by the owner; licence + credit shown and recorded.
- [ ] `passphrase-engine.ts` + tests; `npm run verify` passes.
- [ ] InputGuide above the inputs (sample tiles only); ToolShell/TabSlider/fonts/`<main>`.
- [ ] Registrations + docs; `graphify update .`.
