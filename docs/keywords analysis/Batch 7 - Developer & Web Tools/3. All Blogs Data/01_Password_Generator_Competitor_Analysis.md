# Password Generator (Strong, Random, PIN) — Competitor Analysis

> **Target page:** KKCTools `/password-generator/` (Batch 7, Tool #1 ✅)
> **Primary keyword:** `generate secure password` — US 3,600 · **KD 0**. The cluster has 24 keywords and 47,490 US searches, 37,190 of them on KD ≤ 15. It includes `best password practices` (27,100, irregular) and the "special characters / upper-lower / 8-character" rules queries.
> **SERP source:** ⚠ Batch 7 has no Semrush SERP export. Competitors come from a live web search on 2026-11-14 for `random password generator strong`, plus **NIST SP 800-63B (rev 4)** as the authority for advice. `TODO(owner): pull Google top 10 for "generate secure password".`
> **Pages visited (2026-11-14):** 5 read: 1Password, GIGAcalculator, RoboForm, 10015.io, NIST SP 800-63B rev 4 (authority).

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Password-manager brands: 1Password, Zoho Vault, RoboForm, LastPass, Bitwarden, Norton.
  - Identity-protection vendors: IDStrong, Avast/tune-up.
  - Calculator sites: GIGAcalculator, Calculator.net (affiliate redirect).
  - Dev-tool sites: 10015.io.
  - Wikipedia, and assorted clones.
  - The heads `password generator` and `random password generator` are held by the brands (KD > 30). We target KD-0 variants and rules queries (keyword file).
- **Advice must cite NIST or CISA (keyword file).** From **NIST SP 800-63B rev 4, §3.1.1.2**, as fetched on 2026-11-14:
  - ≥ 15 characters when the password is the only factor; ≥ 8 characters with MFA.
  - Support ≥ 64 characters, all printable ASCII plus space, and Unicode (NFC).
  - **Must not** impose composition rules. **No** periodic expiry.
  - Check passwords against a blocklist. Allow password managers and paste.
  - `TODO(owner)`: confirm that rev 4 is the final current edition.
- **Competitors don't explain their randomness or privacy:**
  - 1Password, 10015 and RoboForm don't name their randomness source.
  - GIGA appears to **generate on its server**, saying "our server does not store".
  - **Our rule:** `crypto.getRandomValues` with rejection sampling, generated in the browser, nothing stored or sent.
- **Arithmetic errors found:** GIGA's 26¹⁰ figure is wrong, and it miscounts its passphrase example (§4).
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | 1password.com/password-generator/ | Password manager | Strong. Secure. Awesome. Try our random password generator. | 700–800 |
| 2 | gigacalculator.com/calculators/random-password-generator.php | Calc site | Random Password Generator | 1,000–1,200 |
| 3 | roboform.com/password-generator.html | Password manager | Random password generator | ~450 |
| 4 | 10015.io/tools/strong-random-password-generator | Dev-tools site | Strong Random Password Generator | 1,000–1,200 |
| 5 | pages.nist.gov/800-63-4/sp800-63b.html | **NIST (authority)** | Digital Identity Guidelines: Authentication | reference |

**What this tells us:**
- **1Password** has 3 modes (random, memorable, PIN). It doesn't state a length range, randomness source, local generation, bulk option or strength meter. It makes an unsourced "81 % of breaches" claim and heavily promotes its product.
- **RoboForm** states client-side generation, has an "exclude similar characters" option and a hex mode, and shows a strength meter (method not published). There is no visible symbol toggle and no length range.
- **10015.io** has upper/lower/number/symbol toggles, excludes confusing and ambiguous characters, and claims generation in the browser. It doesn't name its randomness source, and its 2FA claim is overstated.
- **GIGA** has the longest article, but it appears to be **server-side**, its maths is wrong, its "ambiguous" and "similar" options are undefined, and it gives no SHA-1 warning.
- **No competitor offers all of these:**
  - Generation in the browser **with the method disclosed** (CSPRNG with rejection sampling)
  - Length 4–128
  - Every character-set toggle, a custom symbol set, and exclude look-alikes
  - "At least one of each" enforced without bias
  - PIN and Wi-Fi presets
  - Bulk 1–50
  - An **entropy-based** strength meter shared with tool #2
  - **NIST-cited** advice

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | 1Password | GIGA | RoboForm | 10015.io |
|---|---|---|---|---|
| Length control | ⚠️ (range not stated) | ✅ (up to 128) | ❌ (not shown) | ✅ (range not stated, default 16) |
| Upper / lower / digits / symbols toggles | ⚠️ | ⚠️ (lowercase forced on) | ⚠️ (no symbol toggle) | ✅ |
| Custom symbol set | ❌ | ❌ | ❌ | ❌ |
| Exclude look-alikes (O 0 l 1 I) | ❌ | ⚠️ ("similar" undefined) | ✅ | ✅ |
| At least one of each set | ❌ | ❌ | ❌ | ❌ |
| Memorable / passphrase | ✅ | ❌ | ❌ | ❌ |
| PIN mode | ✅ | ❌ | ⚠️ (digits only) | ⚠️ |
| Wi-Fi preset (WPA2 ≤ 63) | ❌ | ❌ | ❌ | ❌ |
| Hex mode | ❌ | ❌ | ✅ | ❌ |
| Bulk generation | ❌ | ❌ | ❌ | ❌ |
| Strength meter | ❌ | ❌ | ✅ (method hidden) | ⚠️ (label only) |
| Entropy (bits) shown | ❌ | ❌ | ❌ | ❌ |
| Randomness source disclosed | ❌ | ❌ ("strong algorithms") | ❌ | ❌ |
| Generated in browser | ? | ❌ (server, per its text) | ✅ (stated) | ✅ (stated) |
| Copy button | ✅ | ✅ | ✅ | ✅ |

---

## 3. Feature matrix — content and trust

| Item | 1Password | GIGA | RoboForm | 10015.io |
|---|---|---|---|---|
| NIST / CISA cited | ❌ | ❌ | ❌ | ❌ |
| Special-character list | ❌ | ⚠️ ("29", ~10 listed) | ❌ | ❌ |
| Attack types explained | ⚠️ | ✅ | ❌ | ✅ |
| Worked math (combinations) | ❌ | ⚠️ (**26¹⁰ wrong**) | ❌ | ❌ |
| Unsourced statistics | "81 % of breaches" | — | "independent audit" spreadsheet | rotation claim |
| FAQ count | 4 (product-led) | 0 | 0 | 6 |
| Named author | ❌ | ✅ | ❌ | ❌ |
| Date | ❌ | ✅ Jun 2026 | ❌ | ❌ |
| Promotion | heavy | — | heavy | — |

---

## 4. Competitor-by-competitor detail

### 1. 1Password — Free Password Generator
- **Modes:** random (characters, numbers, symbols), memorable (capitalise, full words), PIN.
- **FAQs (4):** easiest strong password, personal password manager, enterprise password manager, best password manager.
- **Weak points:**
  - No stated length range, look-alike exclusion, bulk option or randomness source.
  - Local generation not stated.
  - "81 % of breaches…" has no source.
  - Promotional answers throughout.
  - No date.

### 2. GIGAcalculator — Random Password Generator (Georgi Georgiev, Jun 2026)
- **Options:** length (up to 128), numbers, capitals, symbols, "ambiguous" characters, "similar" characters. Lowercase is always on.
- **Privacy:** says "our server does not store" passwords and describes TLS 1.2, which implies **server-side generation**.
- **Errors:**
  - Says 10 lowercase characters give 95,428,956,661,682,176 combinations. The correct figure is **26¹⁰ = 141,167,095,653,376**.
  - Calls a 29-character example "30".
  - Says "29 special characters" but lists about 10.
  - Lists SHA-1 without a weakness warning.
  - Defines "ambiguous" unusually and never defines "similar".
- **Weak points:** no entropy figure and no bulk option.

### 3. RoboForm — Random password generator
- **Options:** A-Z, a-z, 0-9, exclude similar characters, hex mode.
- **Strength meter:** Weak / Medium / Good / Strong.
- **Privacy:** says passwords are "not transmitted to our servers".
- **Weak points:**
  - No length control or symbol toggle visible.
  - Audit is a linked spreadsheet.
  - No author or date.
  - Copy typos.
  - Heavy upselling.

### 4. 10015.io — Strong Random Password Generator
- **Options:** lower, upper, numbers, symbols; exclude confusing and ambiguous characters; default length 16.
- **Privacy:** says "generated in your browser".
- **FAQs (6):** length, server-side generation, password managers, reuse, rotation, hashing.
- **Weak points:**
  - Randomness source and strength method not disclosed.
  - Says 2FA makes login "impossible", which is overstated.
  - The rotation claim has no source.
  - Typos.

### 5. NIST SP 800-63B rev 4 (authority)
- **§3.1.1.2:**
  - 15 characters minimum as a single factor; 8 minimum with MFA.
  - Accept at least 64 characters.
  - Accept all printable ASCII, space and Unicode (NFC).
  - **SHALL NOT** impose composition rules.
  - No periodic changes.
  - Blocklist check.
  - Allow password managers and paste.
- **How we use it:**
  - The H2 "Password tips" and the `password policy … length` FAQ.
  - **Our default length is ≥ 16.** It meets the 15-character single-factor guidance.

---

## 5. Patterns

**Random generation (our code)**
- Use `crypto.getRandomValues(Uint32Array)`.
- Pick indexes with **rejection sampling** so there is no modulo bias.
- To enforce "at least one of each": place one character from each selected set, fill the rest from the union, then shuffle with Fisher–Yates using the same CSPRNG. The result is unbiased given the constraint.
- Never use `Math.random`.

**Entropy**
- Pure random: bits = L × log₂(N), where N is the size of the character pool.
- With "at least one of each" the entropy is slightly lower. Show the exact figure via combinatorics, or a conservative estimate.

**Presets**
- Default: 16 characters, all sets.
- PIN: 4–12 digits. Add a tip to avoid sequences and birthdays; a 4-digit PIN has 10,000 combinations.
- Wi-Fi WPA2: 8–63 printable characters with look-alikes excluded. `TODO(owner)`: verify the WPA2 passphrase length rule (IEEE 802.11i: 8–63 ASCII).
- Hex.
- "Pronounceable": optional; clearly lower entropy.

**Bulk and output**
- Generate 1–50 at once, copy all, download as .txt.

**Strength meter**
- Shares its engine with #2 (entropy plus pattern checks).

**Special-character list**
- A copyable list of the ASCII symbols we use (the 32 OWASP-style printable symbols).
- `TODO(owner)`: cite OWASP's password special-characters list.

**Privacy**
- Show: "Generated in your browser with the Web Crypto API; never stored or sent."
- Also: no analytics on input; clipboard copy only when the user asks.

**Competitor coverage**

| Section | Pages (of 4) |
|---|:---:|
| Browser generation stated | 2 |
| Randomness source disclosed | **0** |
| Look-alike exclusion | 2 |
| At least one of each | **0** |
| Bulk | **0** |
| Entropy | **0** |
| NIST cited | **0** |

---

## 6. FAQ question bank

★ = asked on 2+ pages or a cluster keyword. Map to the 24-keyword cluster.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How long should a password be? | 10015, GIGA, RoboForm · cite NIST (15 / 8 with MFA) |
| 2 | ★ What makes a password strong? | 1Password, GIGA · `passwords that are strong` |
| 3 | ★ What are the special characters for passwords? | GIGA · `password special characters` |
| 4 | ★ Is it safe to use an online password generator? | 10015, RoboForm |
| 5 | ★ Should I change my password regularly? | 10015 · NIST: no periodic expiry |
| 6 | Do I need upper and lower case letters? | `upper & lowercase letters password` · NIST: no composition rules, but more sets → more entropy |
| 7 | What is an example of an 8-character password? | `example of password with 8 characters` (show live-generated examples only) |
| 8 | How do I create a strong Wi-Fi password? | `strongest wifi password`, `how to generate wifi password` |
| 9 | What is a good phone PIN? | `best phone passwords`, `password must be numeric 0 9` |
| 10 | What are best password practices? | `best password practices` · cite NIST and CISA |
| 11 | Should I use a password manager? | 1Password · neutral, no product picks |

---

## 7. Gaps nobody fills — our opportunities

1. **Transparent CSPRNG generation** in the browser: `crypto.getRandomValues`, rejection sampling, Fisher–Yates shuffle, with the method explained.
2. **Full control:**
   - length 4–128
   - every character set plus a custom symbol set
   - exclude look-alikes
   - an unbiased "at least one of each" rule
3. **Presets:** default (16), PIN, Wi-Fi (WPA2 8–63), hex, NIST-aligned (≥ 15).
4. **Bulk 1–50** with copy all and a .txt download.
5. **Entropy in bits and a time-to-guess estimate**, shared with #2, with the assumptions shown.
6. **NIST-cited password tips**: length over composition, no forced expiry, use a password manager, MFA. Plus a CISA link.
7. **Copyable special-character list.**
8. **Fresh examples for "8-character password"** queries: generated live and never a fixed string.
9. **Strong privacy statement:** no storage, no network, no analytics on output.
10. **Links:** Password Strength Checker (#2), Passphrase Generator (#4), UUID Generator (#3).

---

## 8. Blueprint for the KKCTools Password Generator

### 8.1 SEO

- **URL:** `/password-generator/`
- **Title:** Password Generator – Strong Random Passwords
- **H1:** Password Generator: Create a Strong, Random Password
- **Meta:** as in the keyword file (151 characters).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Length | 4–128 (default 16) |
| Sets | Upper, lower, digits, symbols (custom set), exclude look-alikes, require each |
| Presets | Default · PIN · Wi-Fi (WPA2) · Hex · NIST-aligned |
| Bulk | 1–50, copy all, download .txt |
| Strength | Entropy bits + guess-time (shared #2 engine), assumptions listed |
| RNG | `crypto.getRandomValues` + rejection sampling; never Math.random |
| UX | Regenerate, copy, hide/show, no network, nothing stored |

### 8.3 Content outline (≈ 1,200–1,500 words, original)

1. Intro (primary keyword) and privacy line
2. How to use
3. How our generator creates random passwords (CSPRNG, explained simply)
4. How long should a password be? (NIST)
5. Do you need symbols and mixed case? (entropy vs composition rules)
6. Special characters list
7. Wi-Fi passwords and PINs
8. Password tips that actually help (NIST / CISA)
9. FAQ (10–12)
10. Related tools: Password Strength Checker (#2), Passphrase Generator (#4)

### 8.4 Quality checks

- **Unit tests:**
  - Rejection sampling: chi-square distribution test on 10⁶ draws.
  - "Require each" always satisfied.
  - Look-alike exclusion.
  - Entropy calculation.
  - Presets.
  - A test that `Math.random` is never used (lint rule).
- **Network:** no network calls. Security headers are already set site-wide.
- No competitor wording copied. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - pull Google top 10
  - confirm NIST rev 4 status and section numbers
  - verify the WPA2 length rule and the OWASP symbol list
