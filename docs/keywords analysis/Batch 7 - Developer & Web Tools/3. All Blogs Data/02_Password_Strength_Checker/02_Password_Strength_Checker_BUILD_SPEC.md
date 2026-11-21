# Password Strength Checker — Build Spec

> **URL:** `/password-strength-checker/` · Batch 7 · Tier 1 · **Build order 2**
> **Read first:** `../00_BATCH7_BUILD_RULES.md` (§2 security rules, §3 NIST blocklist + SecLists licence, §4 `strength-engine`, scenarios)
> **Inputs:** `02_Password_Strength_Checker_Competitor_Analysis.md`, keyword file §2 #2
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**`password strength tester` is 4,400 / KD 0** (primary); the rest of the 15-keyword cluster (17,730 searches) is KD 5–26:
- `password strength` 2,400 / KD 21; `password security` 1,900 / KD 17; `password complexity checker` 1,300 / KD 19;
- `most common passwords` 1,600 / KD 13, `popular passwords` 210, `10 000 most common passwords` 140, `password 123456` 320;
- `types of password attacks` 170, `guessing passwords` 170, `4 sequential letters` 140, `weak password strong password` 210;
- `consequences of sharing passwords` 1,000 / KD 17;
- `password guesser` 3,600 / KD 26 (⚠ partly hacking intent: we only *estimate*, never crack).

**The trust gap is big.** Competitors either send data over the network (breach checks), hide their guess rates ("billion years"), or contradict their own numbers. A **fully offline** checker that shows *which part* of a password is weak and *what assumptions* the time is based on is rare.

**Method:** most serious tools use the published zxcvbn approach (pattern matching + minimum-guess search). AGENTS rules forbid adding zxcvbn as a dependency, so we write **our own estimator** following the same idea (`TODO(owner)`: approve the approach, rules §1).

### Research notes from the competitor analysis

- **Pages read:** Bitwarden, Service Victoria (Australian state government), RoboForm, DNS Robot, Security.org.
- **Bitwarden:** zxcvbn label + crack-time range, "never transmitted"; **no guess rate stated**; its 8-character example disagrees with its own table.
- **Service Victoria:** discloses **10 guesses/s** (online, no rate limiting) and runs a Pwned Passwords breach check, but doesn't say whether the password leaves the browser; no offline scenario.
- **RoboForm:** zxcvbn + HIBP list; **no crack time and no privacy statement** for the checker.
- **DNS Robot:** the depth benchmark (pattern breakdown, 8 hash/GPU scenarios, 11 FAQs) but **contradicts itself:** Tr0ub4dor&3 is "about a million guesses" (≈ 20 bits) in the text and 62.2 bits in the table; NTLM/MD5 8-character times differ between FAQ and table; bcrypt is "10,000 years" and "5K years".
- **Security.org:** an opaque "sum of character values" score; length advice 12 vs 8–10 characters; affiliate-heavy.
- **0 of 5** are fully offline *and* disclose guess rates for several scenarios.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | password strength tester | 4,400 | 0 | first sentence, ToolShell heading, H2 "How the password strength tester works" |
| Head (not in exports) | password strength checker · how secure is my password | — | — | title, H1 (`TODO(owner)`: pull volumes) |
| Secondary | password strength · password strength check · password complexity checker | 2,400 · 170 · 1,300 | 14–21 | intro, result labels, H2 "Password strength vs complexity" |
| Secondary | password security | 1,900 | 17 | H2 "Password security: what actually helps" (NIST) |
| Secondary | weak password strong password | 210 | 5 | H2 "What makes a password weak or strong" (side-by-side engine examples) |
| Secondary | most common passwords · popular passwords · 10 000 most common passwords | 1,600 · 210 · 140 | 9–13 | H2 "The most common passwords" (top 20 **from the approved list**) + the offline list check |
| Secondary | password 123456 | 320 | 14 | FAQ "Why is 123456 cracked instantly?" |
| Secondary | types of password attacks · guessing passwords | 170 · 170 | 10–14 | H2 "Types of password attacks" (explains the 4 scenarios) |
| Secondary | 4 sequential letters | 140 | 12 | pattern reason text ("4 sequential letters: abcd") |
| Secondary | consequences of sharing passwords | 1,000 | 17 | FAQ (neutral, general) |
| Support (⚠ intent) | password guesser | 3,600 | 26 | FAQ "What is a password guesser?" (education only) |

## 2. Our edge

- **Fully offline:** no breach API, no network, no storage; the common-password list is bundled (dynamic `import()` chunk).
- **Our own pattern estimator** (documented): dictionary (common passwords + English words), l33t, capitalisation, keyboard runs (QWERTY + keypad), sequences, repeats, years/dates, brute-force remainder; minimum-guess segmentation by dynamic programming.
- **Plain-English breakdown:** each segment coloured, with its reason ("'summer' is a common word", "'2026' looks like a year").
- **Four scenarios with disclosed, editable guesses/s** (shared `attack-scenarios.ts`): online rate-limited, online unlimited, offline slow hash, offline fast hash.
- **Naive entropy beside the real estimate** to show why "has a symbol" isn't strength (P@ssw0rd: 52 bits naive, a few guesses real).
- **NIST-tied list check:** "This password is #N on a common-password list" (NIST says sites must check blocklists).
- **"Make it stronger"** opens #1 with the same length, or #4.
- **Safe input:** `type=password`, show toggle, no autocomplete, no spellcheck; advice to test a *similar* password.
- **Consistent numbers:** every example on the page is produced by the same engine.

## 3. Calculator spec

### 3.1 Tabs

1. **Check** (default)
2. **Breakdown** (segments and reasons)
3. **Attack scenarios** (rates editable)

### 3.2 Input guide diagram (above the inputs)

`StrengthInputGuide.tsx`: a **sample** password `Summer2026!` (never the user's input) split into labelled segments.

- **Segments:** "Summer" (1 Dictionary word + capital), "2026" (2 Year), "!" (3 Symbol).
- **Callouts:**
  - "1 Words people use are guessed first";
  - "2 Years and dates are short lists";
  - "3 One symbol at the end adds little";
  - "4 Time depends on the attack" with four small gauges.
- **Breakdown tab:** the same row with "guesses per segment" badges.
- **Scenarios tab:** four rate dials.

The guide is static (sample only); the user's real breakdown appears in the results, never in the SVG.

### 3.3 Inputs

| Field | Default |
|---|---|
| Password | empty (`type=password`, show toggle, `autocomplete="off"`, `spellcheck="false"`, `autocapitalize="off"`) |
| Scenario rates | 100/hour · 10/s · 10,000/s · 100 billion/s (editable, Reset) |
| Show naive entropy | on |

No other options; the page stays simple.

### 3.4 Engine (`src/lib/strength-engine.ts`, our own code)

```ts
normalize: NFC ; lowerCopy for dictionary matching
matchers (each returns {i, j, pattern, guesses, reason}):
  dictionary: common-passwords (guesses = rank, 1-based) and English words (EFF long list if approved: guesses = rank or list size)
              × 2 if first-letter capital, × (2^k) for k other capitals (cap at ×(L choose k))
  l33t: map 4→a 3→e 1→i/l 0→o 5→s 7→t @→a $→s then dictionary ; × 2 per substituted kind
  sequence: abcd / 1234 / dcba ; guesses = startSpace × length (startSpace 4 if starts a/z/0/1/9, else 10 digits / 26 letters) ; × 2 descending
  repeat: "aaaa" or "abcabc" ; guesses = baseGuesses × repeatCount
  keyboard: QWERTY rows/adjacency and keypad ; guesses = startKeys × turns factor (our own table, documented)
  year/date: 1900–2099 → 200 ; dd/mm/yyyy etc. → 365 × 200
  bruteforce: any remainder ; guesses = 10^len for digits-only, else poolOf(segment)^len (pool from the classes present, ≥ 10)
total(segmentation) = m! × Π guesses_i            // m = segments (order matters)
best = min over segmentations (dynamic programming over positions)
bits = log2(best) ; naive = L × log2(classPool)
score bands (OUR bands, labelled): <28 very weak · <36 weak · <60 fair · <80 strong · ≥80 very strong
times[scenario] = (best / 2) / rate
```

**Worked examples (from the stated rules; make each a unit test):**

| Password | Best segmentation | Guesses | Bits | Naive bits |
|---|---|---:|---:|---:|
| `123456` | common-password match (rank ≤ 10 in any approved list) or sequence 4 × 6 = 24 | **≤ 24** | ≤ 4.6 | 19.93 |
| `aaaaaaaa` | repeat of "a" (26) × 8 | **208** | 7.70 | 37.60 |
| `abcd1234` | sequence 4 × 4 = 16, sequence 4 × 4 = 16, 2 segments → 2! × 16 × 16 | **512** | 9.00 | 41.36 |
| `P@ssw0rd` | l33t of "password" (rank r in the list) × 2² substitution kinds | **4 r** (tiny) | — | **52.44** |
| 16 random characters from 94 | brute force 94¹⁶ | 94¹⁶ | **104.87** | 104.87 |

`TODO(builder)`: after the list is approved, replace "rank r" with the real rank in the tests, and add `Summer2026!` (dictionary + year + symbol) with its computed value.

**Time examples (shared scenarios, node-checked):** naive 52.44 bits (`P@ssw0rd` *if it were random*) → 8.5 hours at 10¹¹/s; 77.55 bits → ≈ 35,100 years at 10¹¹/s. Real `P@ssw0rd` → under a second in every offline scenario. This contrast is the page's key teaching example.

### 3.5 Outputs

- **Score bar** (5 bands, colour + text, not colour alone) and bits.
- **Sentence:** "This password would take about 8 hours to guess offline with a fast hash, and it's on a common-password list." (engine)
- **Breakdown:** segments with reasons; "Naive estimate: 52 bits · Real estimate: 4 bits".
- **Scenario table:** 4 rows, rate shown, average time.
- **List check:** "Found at #N in the common-password list" or "Not in the list (that alone doesn't make it strong)".
- **Make it stronger** → `/password-generator/?length=<same or 16>`; **Try a passphrase** → #4.
- **Privacy banner:** "Checked on this device only. Nothing is stored or sent. To be extra safe, test a password that's *like* yours, not your real one."
- No Copy button for the input; Clear button.

### 3.6 Tests

- Each matcher on its own (dictionary rank, capitals, l33t map, sequences up/down, repeats incl. "abcabc", keyboard rows, keypad, years, dates).
- DP picks the minimum (e.g. `abcd1234` prefers two sequences over brute force).
- The worked examples.
- Unicode / emoji input (NFC, brute-force pool rule).
- List loading via dynamic `import()`; the checker works before the list loads (shows "checking common list…").
- Scenario maths; editable rates.
- Typing latency: < 16 ms for 64-character input (perf test).
- No network (`check:no-network`), no storage, no input in analytics or URL.
- Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Password Strength Checker – Test Your Password` (46; 58 with the suffix: OK) |
| Meta | `Free password strength checker. See how long your password would take to guess, why it is weak, and whether it is on a common-password list, all offline.` (153) |
| H1 | `Password Strength Checker: How Strong Is Your Password?` |
| BLUF | "Type a password and this strength tester shows how long it would take to guess under four attack types, which parts are weak and why, and whether it's on a common-password list. It runs entirely on your device: nothing is stored or sent. A password like P@ssw0rd looks complex but falls in seconds, because attackers try common words first." |
| ToolShell pills | `Works offline, nothing sent`, `Shows which part is weak`, `4 attack scenarios, rates shown`, `Common-password list check` |
| Links out | Password Generator (#1), Passphrase Generator (#4) |
| Links in | #1, #4, Tools hub "Developer & Web" |

## 5. Content (~1,400–1,700 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the password strength tester | Safe-testing advice; tabs | 120 |
| 2 | How the password strength tester works | Patterns, minimum guesses, our score bands; naive vs real | 200 |
| 3 | What makes a password weak or strong | Engine examples side by side (`weak password strong password`) | 150 |
| 4 | How long would it take to crack? | The 4 scenarios, rates as assumptions, "on average" | 170 |
| 5 | Types of password attacks | Online guessing, offline cracking (slow vs fast hashes), dictionary, credential stuffing; defensive framing only | 160 |
| 6 | The most common passwords | Top 20 from the approved list (credited) + why lists matter (NIST blocklist) | 130 |
| 7 | Why "P@ssw0rd" and "Password1!" fail | l33t and capital tricks are in every attacker's rules | 110 |
| 8 | Password security: what actually helps | NIST: length, no forced composition, no scheduled changes, blocklists; unique passwords + MFA | 140 |
| 9 | Why we don't check breaches here | Breach checks need a network call; where to find one (neutral, no affiliate) | 90 |
| 10 | FAQ | §6 | 340 |

## 6. FAQ (11, from the competitor question bank + cluster keywords)

1. Is it safe to type my real password here? (offline; still better to test a similar one)
2. How is password strength calculated?
3. How long would it take to crack my password?
4. What are the most common passwords?
5. What makes a password weak or strong?
6. Why is "123456" cracked instantly?
7. What types of password attacks are there?
8. Do l33t swaps like P@ssw0rd help?
9. What are the consequences of sharing passwords? (general: loss of control, account misuse, harder to trace; no statistics)
10. Can you check if my password was in a breach? (not here; why)
11. What is a password guesser? (education: estimates vs cracking; we never crack)

## 7. Done when

- [ ] `strength-engine.ts` + tests; `common-passwords.ts` from the **owner-approved** file with its licence recorded; `npm run verify` passes.
- [ ] Input never stored, logged, sent or put in a URL (test).
- [ ] InputGuide above the inputs (sample only); ToolShell/TabSlider/fonts/`<main>`.
- [ ] Score bands labelled as ours; rates labelled as assumptions.
- [ ] Registrations + docs; `graphify update .`.
