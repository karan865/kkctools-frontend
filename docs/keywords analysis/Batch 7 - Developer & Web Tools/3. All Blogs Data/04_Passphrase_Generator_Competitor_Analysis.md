# Passphrase Generator (Random Words) — Competitor Analysis

> **Target page:** KKCTools `/passphrase-generator/` (Batch 7, Tool #4 🟡)
> **Primary keyword:** `generate passphrase` — US 720 · KD 10 · rising. The cluster has 3 keywords and 10,220 US searches. The real head term is `passphrase generator` (6,600 / KD 19); `what is a passphrase` gets 2,900.
> **SERP source:** ⚠ There is no Semrush SERP export for Batch 7. Competitors come from a live web search for `passphrase generator random words diceware` (2026-11-14), plus the EFF dice page, which is the authority on word lists. `TODO(owner): pull Google top 10 for "passphrase generator".`
> **Pages visited (2026-11-14):** 5 read: Calculate.co.nz Diceware, EFF Dice-Generated Passphrases, Bitwarden generator (passphrase mode), UseAPassphrase.com, ProPrivacy Diceware guide.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Password managers: Bitwarden, 1Password.
  - Diceware and EFF references: diceware.com, eff.org/dice.
  - Single-purpose sites: useapassphrase.com.
  - Calc and tool sites: Calculate.co.nz, timbrica, switchlabs, trustcomponent.
  - Privacy blogs: ProPrivacy.
  - Open-source CLIs on GitHub and Debian, plus some school tools.
- **Keyword-file rule:** we need a word list. We can write our own (AGENTS rule 8: no copied lists) or use one whose licence allows reuse with credit. `TODO(owner)`: choose the list.
  - **EFF large list:** 7,776 words, about 12.925 bits per word. It has two short lists of 1,296 words each. The page doesn't state a licence for the lists; the site-wide footer links "Copyright (CC BY)". `TODO(owner)`: confirm that the EFF lists are CC BY and how to credit them.
  - Our own list: it must have ≥ 2,048 unique, unambiguous, inoffensive words. Entropy per word = log₂(size).
- **Entropy maths re-checked:**
  - 7,776 words → 12.925 bits per word. 5 words = 64.6, 6 words = 77.5, 7 words = 90.5 ✔.
  - Calculate.co.nz uses a list of about 130 words (≈ 7.02 bits per word) and still calls 6 words "very strong" (≈ 42 bits). That is misleading.
  - UseAPassphrase's crack times for 4 words differ by about 30× between two examples.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | calculate.co.nz/diceware-passphrase-generator.php | NZ calc site | Diceware Passphrase Generator NZ | ~400 |
| 2 | eff.org/dice | **EFF (authority)** | Dice-Generated Passphrases | reference |
| 3 | bitwarden.com/password-generator/ (passphrase mode) | Password manager | Password generator | — |
| 4 | useapassphrase.com | Single-purpose site | Use A Passphrase | ~1,000 |
| 5 | proprivacy.com/…/diceware-passphrase-generator | Privacy blog | Diceware Passphrase Generator (no tool) | 550–600 |

**What this tells us:**
- **The EFF page is the standard.**
  - The long list (7,776 words, rolled with 5 dice) and two short lists (1,296 words, 4 dice).
  - Its advice: **at least 6 words** from the long list.
  - It explains the dice method and a mnemonic technique.
  - It has no web generator.
- **Calculate.co.nz:**
  - Options are word count (default 5) and separator (hyphen, dot, space, underscore). There is no capitalisation or number option.
  - The entropy formula is correct, but the list has only **about 130 words**, so "6 words = very strong" is misleading.
  - It doesn't name the list or its licence.
- **Bitwarden's** passphrase mode is undocumented: no word-count range, list, entropy or separators are described. It shows a vague strength label and promotes its product heavily.
- **UseAPassphrase:**
  - 4, 5 or 12 words, spaces only.
  - Crack times are inconsistent and falsely precise.
  - Sources are outdated (2012).
  - It carries ads.
- **ProPrivacy** promises a generator in its title and H1 but has none. Its content dates from 2019 and is accurate on Diceware entropy.
- **No page combines all of these:**
  - a **named, licensed list** with its size shown
  - **exact entropy** for the chosen options, including how capitalisation and digits change it
  - 3–10 words
  - separators: space, hyphen, dot, none, custom, digit
  - a capitalise option
  - an inserted number or symbol, placed at random
  - bulk generation
  - CSPRNG with rejection sampling
  - a "what is a passphrase" explainer that cites NIST and EFF

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Calc.co.nz | EFF | Bitwarden | UseAPassphrase | ProPrivacy |
|---|---|---|---|---|---|
| Web generator | ✅ | ❌ (dice method) | ✅ | ✅ | ❌ |
| Word count range | ⚠️ (≥4 suggested, no maximum stated) | n/a (≥6 advised) | ? | ⚠️ (4/5/12 only) | n/a |
| Separator choice | ✅ (4) | n/a | ⚠️ (dashes) | ❌ (spaces) | n/a |
| Capitalise | ❌ | n/a | ? | ❌ | n/a |
| Add number / symbol | ❌ | n/a | ? | ❌ | n/a |
| Named list + size | ❌ (~130, unnamed) | ✅ (7,776 / 1,296) | ❌ | ❌ | ✅ (Diceware 7,776) |
| Licence stated | ❌ | ⚠️ (site CC BY) | ❌ | ❌ | n/a |
| Entropy (bits) | ✅ (method; example 36 vs 35.1) | ⚠️ (implied) | ❌ | ⚠️ (zxcvbn; inconsistent) | ✅ (12.9/word) |
| Crack-time with assumptions | ❌ | ❌ | ⚠️ (blank) | ⚠️ (10k/s; inconsistent) | ❌ |
| CSPRNG stated | ✅ ("crypto-strong") | n/a (dice) | ✅ | ⚠️ ("in browser") | ⚠️ (prefers dice) |
| Bulk | ❌ | ❌ | ❌ | ❌ | ❌ |
| Copy | ✅ | n/a | ✅ | ✅ | n/a |
| Local / private | ✅ (claimed) | n/a | ✅ | ✅ (claimed) | n/a |

---

## 3. Feature matrix — content and trust

| Item | Calc.co.nz | EFF | Bitwarden | UseAPassphrase | ProPrivacy |
|---|---|---|---|---|---|
| What is a passphrase | ⚠️ | ✅ | ⚠️ | ✅ | ✅ |
| Why random words beat chosen words | ⚠️ | ✅ | ❌ | ✅ | ✅ |
| Recommended word count with bits | ❌ (no bits) | ✅ (6) | ❌ | ⚠️ | ✅ |
| Errors | small-list "very strong"; 36 vs 35.1 bits | — | vague label | 30× crack-time gap; stale sources | no tool despite title |
| FAQ count | 3 | 0 | some | 3 | 0 |
| Named author | ⚠️ (reviewer) | EFF | ❌ | ✅ (@mikehearn) | ✅ |
| Date | ✅ Nov 2026 | ⚠️ (2016 files) | ❌ | ❌ | ✅ (2019, stale) |

---

## 4. Competitor-by-competitor detail

### 1. Calculate.co.nz — Diceware Passphrase Generator NZ
- **Options:** word count (default 5); separator (hyphen, dot, space, underscore).
- **Entropy:** words × log₂(list size) ✔. The worked example uses a list of about 130 words, so 5 words ≈ 35.1 bits; the page says "≈ 36".
- **Errors:**
  - Says a larger list adds "a little more" entropy per word. The real difference is about 7 vs 12.9 bits, nearly double.
  - Calls 6 words "very strong" with a 130-word list (≈ 42 bits).
- **Weak points:** the list is unnamed; no capitalisation or number options; one dense paragraph of text.

### 2. EFF — Dice-Generated Passphrases (authority)
- **Lists:** long (7,776, 5 dice), short #1 and #2 (1,296 each, 4 dice). It mentions Reinhold's Diceware.
- **Advice:** at least 6 words. It explains the method and a mnemonic.
- **Licence:** not stated on the page; the site footer is CC BY. `TODO(owner)` to confirm.

### 3. Bitwarden — Passphrase mode
- **What it shows:** a password/passphrase toggle. "correct-horse-battery-staple" is the example. It says generation is local.
- **Weak points:**
  - The options, word list and entropy are undocumented.
  - The strength label and crack time are empty or vague.
  - "Billions of years" has no source.
  - Heavy upselling.

### 4. UseAPassphrase.com
- **Generator:** 4, 5 or 12 words, spaces only. Uses zxcvbn for strength.
- **Errors:**
  - Two 4-word examples have crack times about 30× apart.
  - A "0 seconds" placeholder appears.
  - Falsely precise figures ("2.213 seconds").
  - Mixes a 10,000/s assumption with a 2012 figure of 350 billion guesses/s.
- **Weak points:** no list source, ads, no date, stale links.

### 5. ProPrivacy — Diceware guide (Douglas Crawford, 2019)
- **Content:** the Diceware 7,776 list; EFF lists; ~30 languages; entropy 12.9 bits per word, so 6 words = 77.55 and 7 words = 90.47 ✔.
- **Weak points:**
  - **No generator**, despite the title.
  - Last updated in 2019.
  - Says computer randomness is "ultimately predictable", which is wrong for a CSPRNG.
  - Affiliate pop-ups.

---

## 5. Patterns

**Generation (shared RNG engine with #1)**
- Pick each word as `list[randomIndex(listSize)]` using `crypto.getRandomValues` with rejection sampling.
- Words are chosen with replacement, which is standard. Optionally avoid repeats and show the slightly lower entropy.

**Options and the entropy they add**
- Words: 3–10. Default **6**, per the EFF advice.
- Separator: space, hyphen, dot, underscore, none, or **random digit/symbol**. A random separator adds log₂(set size) bits per slot. Show this.
- Capitalise:
  - none / first letter of each word: +0 bits (deterministic)
  - random word capitalised: + log₂(words)
- Add a number (0–99) at a random position: + log₂(100 × positions).
- Add a symbol at a random position: + log₂(symbols × positions).
- **Exact entropy** is shown live, e.g. "6 words × 12.925 = 77.5 bits (+ 6.6 for digit) = 84.1 bits".

**Guess-time**
- Uses the same scenarios as #2, with disclosed guesses per second.
- **The attacker is assumed to know the word list** (Kerckhoffs). Say so on the page.

**Word list**
- Bundled inline (no fetch).
- Requirements: show the size; no duplicates; no offensive words; avoid homophones and look-alikes; 3–9 letters.
- `TODO(owner)`: choose the EFF large list (CC BY, credit required) or our own list. If we write our own, record how it was built.

**What is a passphrase**
- Explain passphrase vs password.
- NIST SP 800-63B rev 4 allows long passwords and spaces, and verifiers should accept at least 64 characters (see file #1).

**How the competitors cover these features**

| Section | Pages (of 5) |
|---|:---:|
| Generator | 3 |
| Named list + size | 2 |
| Exact entropy | 2 |
| Capitalise / number | **0** (documented) |
| Bulk | **0** |
| Licence | **0** clear |

---

## 6. FAQ question bank

★ = asked on 2+ pages or a cluster keyword. Map to: generate passphrase, passphrase generator, what is a passphrase.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is a passphrase? | all · `what is a passphrase` (2,900) |
| 2 | ★ Passphrase vs password: which is stronger? | Bitwarden, UseAPassphrase, ProPrivacy |
| 3 | ★ How many words should a passphrase have? | EFF (6), Calc.co.nz, ProPrivacy |
| 4 | ★ What is Diceware? | EFF, ProPrivacy, Calc.co.nz |
| 5 | How strong is a 4, 5 or 6-word passphrase (bits)? | ProPrivacy, Calc.co.nz |
| 6 | Does adding numbers or capitals help? | — (our entropy explainer) |
| 7 | Is "correct horse battery staple" safe? | Bitwarden example (no: it is public) |
| 8 | Can I make up my own words? | UseAPassphrase (no; people choose predictable words) |
| 9 | Is an online passphrase generator safe? | Calc.co.nz, Bitwarden |
| 10 | Where can I use spaces in a password? | NIST (verifiers should allow spaces) |

---

## 7. Gaps nobody fills — our opportunities

1. **A named, licensed (or self-written) list with its size shown**, bundled inline.
2. **Exact live entropy** that updates for every option: words, separator type, capitalisation, number or symbol position.
3. **Full options:** 3–10 words, every separator type including random digits or symbols, capitalise, add a number or symbol, no repeated words.
4. **Bulk generation** (1–20), with copy.
5. **Guess-time scenarios with disclosed assumptions**, shared with #2. The attacker is assumed to know the list.
6. **Honest content:** dice vs CSPRNG (both fine when done correctly), why chosen words are weak, and why published examples must never be used.
7. **NIST + EFF citations.**
8. **Links:** Password Generator (#1), Password Strength Checker (#2).

---

## 8. Blueprint for the KKCTools Passphrase Generator

### 8.1 SEO

- **URL:** `/passphrase-generator/`
- **Title:** Passphrase Generator – Random Memorable Words
- **H1:** Passphrase Generator: Strong Passwords Made of Random Words
- **Meta:** as in the keyword file (160 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Words | 3–10 (default 6); no-repeat option |
| Separator | Space, hyphen, dot, underscore, none, random digit, random symbol, custom |
| Extras | Capitalise (none / first letters / one random word), add number, add symbol (random position) |
| Entropy | Exact bits shown, with breakdown |
| Guess-time | Shared scenarios (#2), assumptions shown |
| Bulk | 1–20, copy all |
| List | Bundled inline, size + source/licence shown |
| RNG | `crypto.getRandomValues` + rejection sampling |
| UX | Local only, no network |

### 8.3 Content outline (≈ 1,100–1,400 words, original)

1. Intro (primary keyword) and privacy line
2. How to use
3. What a passphrase is (vs a password)
4. How strong is a passphrase? The entropy maths, with a table for 4–8 words
5. Why random words beat words you choose
6. Diceware and EFF lists (credited)
7. Do capitals, numbers and symbols help?
8. Where passphrases work best (and site rules that block them)
9. FAQ (10)
10. Related tools: Password Generator (#1), Password Strength Checker (#2)

### 8.4 Quality checks

- **Unit tests:**
  - uniform word selection (chi-square)
  - entropy maths for each option
  - no-repeat mode
  - separator handling
  - list hygiene: unique entries, no offensive words (a review checklist)
- No competitor wording. The list licence is recorded in the repo. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - pull Google top 10
  - **choose the word list** (EFF CC BY with credit, or our own)
  - confirm the CC BY status of the EFF lists
