# Password Strength Checker — Competitor Analysis

> **Target page:** KKCTools `/password-strength-checker/` (Batch 7, Tool #2 ✅)
> **Primary keyword:** `password strength tester`: US 4,400 · **KD 0**. Cluster: 15 keywords, 17,730 US searches. It includes `password guesser` (3,600, partly hacking intent), `password strength` (2,400) and `most common passwords` (1,600).
> **SERP source:** ⚠ Batch 7 has no Semrush SERP export. Competitors come from a live web search on 2026-11-14 for `password strength tester checker how secure is my password`. `TODO(owner): pull Google top 10.`
> **Pages visited (2026-11-14):** 5 read: Bitwarden, Service Victoria (government), RoboForm, DNS Robot, Security.org.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Password managers: Bitwarden, RoboForm.
  - Security and VPN affiliates: Security.org, VPN.com, CyberGuy.
  - A **state government** tool: Service Victoria.
  - IP and DNS tool sites: DNS Robot, ShowMyIP, WhatIsMyIP, Chemicloud.
  - Labnol and InventiveHQ.
- **Method used across the SERP:** most serious tools use **zxcvbn**, a pattern-based guess estimator, rather than simple character-class counting. These include Bitwarden, RoboForm and DNS Robot (zxcvbn-ts).
  - AGENTS rule 6 means **we cannot add zxcvbn as a dependency**. We must write our own pattern-based estimator.
  - `TODO(owner)`: approve the approach (our own estimator, informed by the published zxcvbn method), or approve a dependency.
- **Breach checks are out of scope.** Pwned Passwords k-anonymity needs a network call, which breaks the zero-network rule (keyword file §4). We use an **offline bundled common-password list** instead.
  - `TODO(owner)`: approve the list source and its licence before shipping.
- **Guess-rate assumptions:** most competitors don't disclose them. Service Victoria discloses 10 guesses/s (online, unthrottled). DNS Robot discloses hashcat GPU benchmarks.
  - Our rule (keyword file): **show the assumed guesses per second** for each scenario.
- **Intent caution:** `password guesser` partly comes from people who want to hack. We only *estimate* guess time and never attempt to crack anything.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | bitwarden.com/password-strength/ | Password manager | How strong is your password? | ~700 |
| 2 | service.vic.gov.au/…/password-strength-tester | State government (AU) | Password strength tester | ~1,300 |
| 3 | roboform.com/how-secure-is-my-password | Password manager | How secure is my password? | 350–400 |
| 4 | dnsrobot.net/password-strength-tester | DNS/IP tool site | Password Strength Tester | 3,000–3,500 |
| 5 | security.org/how-secure-is-my-password/ | Security affiliate | How Secure Is My Password? | 1,000–1,200 |

**What this tells us:**
- **DNS Robot is the depth benchmark.**
  - zxcvbn-ts with corrections.
  - A **pattern breakdown** showing which parts of the password are guessable.
  - Crack times for **8 attack scenarios** (hash types, on 1 or 100 GPUs, from hashcat benchmarks).
  - An HIBP k-anonymity breach check (network).
  - 11 FAQs.
  - Weak spots: **its own figures contradict each other** (FAQ vs table; the Tr0ub4dor example), and it uses mixed hardware.
- **Service Victoria** (government, a trusted source):
  - strength rating, crack time at a disclosed 10 guesses/s
  - breach check against Pwned Passwords
  - a passphrase generator
  - Weak spots: it doesn't explain whether the password leaves the browser for the breach check, it doesn't cover offline attacks, and it has no date.
- **Bitwarden** shows a zxcvbn label and a crack time, and states that processing is local. It gives no guess-rate assumptions.
- **RoboForm** uses zxcvbn and an HIBP list but shows **no crack time and no privacy statement** for the checker.
- **Security.org** uses an opaque "sum of character values" score. Its 8–10 vs 12-character length advice is inconsistent, and the page is heavy with affiliate links.
- **No page combines all of these:**
  - **fully offline** (no breach API)
  - pattern explanations in plain English
  - **multiple scenarios with disclosed guesses/s** (online throttled, online unthrottled, offline slow hash, offline fast hash)
  - a common-password list check
  - "make it stronger" via our generator
  - a `type=password` field with a show toggle
  - a big privacy note

---

## 2. Feature matrix: calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Bitwarden | Service Victoria | RoboForm | DNS Robot | Security.org |
|---|---|---|---|---|---|
| Live score as you type | ✅ | ✅ | ✅ | ✅ | ✅ |
| Pattern-based estimator (zxcvbn-like) | ✅ | ⚠️ | ✅ | ✅ (zxcvbn-ts, corrected) | ❌ (char-value sum) |
| Entropy bits shown | ❌ | ❌ | ❌ | ✅ ("pattern bits") | ❌ |
| Crack-time estimate | ✅ (ranges) | ✅ | ❌ | ✅ (8 scenarios) | ✅ |
| **Guess-rate assumptions disclosed** | ❌ | ✅ (10/s online) | ❌ | ✅ (hashcat benchmarks) | ❌ |
| Multiple attack scenarios | ❌ | ❌ | ❌ | ✅ | ❌ |
| Pattern breakdown (which part is weak) | ❌ | ⚠️ (tips) | ❌ | ✅ | ❌ |
| Sequences / repeats / keyboard / years / l33t | ⚠️ (zxcvbn) | ⚠️ | ✅ | ✅ | ❌ |
| Common-password list check | ⚠️ (zxcvbn dictionary) | ✅ (500M+ via API) | ✅ (HIBP list) | ✅ | ⚠️ (database, unspecified) |
| Breach check (network) | ❌ | ✅ | ✅ | ✅ (k-anonymity via its server) | ❌ |
| **Fully offline** | ✅ (claimed) | ❌ | ? | ❌ | ? |
| Plain-English reasons | ⚠️ | ✅ (tips) | ❌ | ✅ | ⚠️ |
| Show / hide toggle | ? | ? | ? | ? | ? |
| Make-stronger / generator link | ✅ (product) | ✅ (passphrase generator) | ✅ (product) | ✅ | ⚠️ (affiliate) |
| Privacy statement for the checker | ✅ | ⚠️ (unclear for breach) | ❌ | ⚠️ (self-attested) | ⚠️ (bare claim) |

---

## 3. Feature matrix: content and trust

| Item | Bitwarden | Service Victoria | RoboForm | DNS Robot | Security.org |
|---|---|---|---|---|---|
| Method explained | ⚠️ (zxcvbn link) | ⚠️ | ⚠️ | ✅ | ❌ |
| Attack types explained | ⚠️ | ⚠️ (online only) | ❌ | ✅ | ⚠️ |
| Advice cited (NIST / CISA) | ❌ | ⚠️ (vic.gov.au) | ❌ | ⚠️ | ⚠️ (dated citations) |
| Internal consistency | ⚠️ (ranges differ) | ✅ | n/a | ❌ (FAQ vs table) | ❌ (8–10 vs 12 chars) |
| FAQ count | 4 | 0 | 0 | 11 | 8+ |
| Named author | ❌ | (government) | ❌ | ❌ | ✅ (retired SWAT commander) |
| Date | ❌ | ❌ | ❌ | ⚠️ (measured Oct 2026) | ❌ |
| Promotion | heavy | disclaimers | heavy | moderate | heavy affiliate |

---

## 4. Competitor-by-competitor detail

### 1. Bitwarden: Password Strength Tester
- **Method and output:** zxcvbn. A label (strong, good, weak, very weak) and a crack-time range, with a table of examples.
- **Privacy:** "never transmitted", processed in the browser.
- **FAQs (4):**
  1. Is it safe to type a real password?
  2. How is strength calculated?
  3. How do I create a strong password?
  4. How should I manage passwords?
- **Weak points:**
  - The "billion years" claim has no model behind it.
  - Guess rate not stated.
  - The 8-character example disagrees with the table.
  - No date.
  - Product banners.

### 2. Service Victoria: Password strength tester (State Government of Victoria)
- **Outputs:**
  - strength
  - time to crack at **10 guesses/s** (online attack on a service with no rate limiting), disclosed in a footnote
  - breach check against **500M+ Pwned Passwords**
  - tips
- **Extra:** a passphrase generator (4, 6 or 8 words, separator, capitals, numbers).
- **Weak points:**
  - Doesn't explain whether the password leaves the browser for the breach check.
  - No offline-attack scenario.
  - Unsourced "typical password is about 9 characters".
  - Unexplained "Parsephrase" button.
  - No date.

### 3. RoboForm: How secure is my password?
- **Method:** zxcvbn plus a compromised-password list from HIBP. Example: "P@ssword1" is weak.
- **Weak points:**
  - No crack-time figures.
  - No privacy statement for the checker.
  - "More reliable than others" with no evidence.
  - About 400 words.
  - Heavy upselling.

### 4. DNS Robot: Password Strength Tester
- **Method:** zxcvbn-ts with two corrections; an HIBP range check via its server (5-character SHA-1 prefix, sent when you leave the field).
- **Crack time:** 8 scenarios on an RTX 5090 (Argon2id on a 4090), 1 or 100 GPUs.
- **Examples:** Summer2026!, P@ssw0rd, Tr0ub4dor&3.
- **FAQs (11).**
- **Errors:**
  - Tr0ub4dor&3 is described as "about a million guesses" (≈ 20 bits) in the text but shown as 62.2 bits in the table.
  - NTLM and MD5 8-character times differ between the FAQ and the table.
  - bcrypt is "10,000 years" in one place and "5K years" in another.
- **Weak points:** the "6 of 9 checkers" competitor claim has no method; the corrections are undocumented.

### 5. Security.org: How Secure Is My Password? (Gene Petrino)
- **Method:** "each character has a value, summed", plus a common-password database. Output is a crack time, e.g. "34,000 years".
- **Weak points:**
  - No assumptions given.
  - Length advice conflicts (12 vs 8–10 characters).
  - Citation errors: a duplicated title and stale statistics.
  - Affiliate-heavy.
  - Author has no technical credentials.

---

## 5. Patterns

**Estimator (our own code)**
- **Approach** (from the published zxcvbn model, re-implemented):
  - Find matches: dictionary words (bundled lists: common passwords, English words and common names, each to be licence-approved), l33t-substituted dictionary words, keyboard runs (QWERTY and number pad), sequences (abcd, 1234), repeats (aaaa, abcabc), dates and years, short brute-force segments.
  - Choose the minimum-guess segmentation with dynamic programming.
  - Total guesses = product of segment guesses, with an adjustment for the number of segments.
- **Output:**
  - log₁₀(guesses)
  - a bits equivalent (log₂ guesses)
  - a 0–4 score
  - matched patterns highlighted in plain English
- Also show **naive entropy** (L × log₂ N) for comparison, and explain why it overstates strength for patterned passwords.

**Scenarios, with guesses/s shown and editable**

| Scenario | Default rate (label as assumption) |
|---|---|
| Online, rate-limited | 100 / hour (to cite) |
| Online, no rate limit | 10 / s (Service Victoria uses this) |
| Offline, slow hash (bcrypt/Argon2) | ~10⁴ / s |
| Offline, fast hash (MD5/NTLM on GPUs) | ~10¹⁰–10¹¹ / s |

`TODO(owner)`: cite the hashcat benchmark source and its date, or present these as order-of-magnitude assumptions.

**Common-password check**
- Exact-match lookup in a bundled list (e.g. the top 10k–100k most common passwords).
- `TODO(owner)`: pick a source with a reuse licence. Candidate types: an MIT-licensed security wordlist project, or a government-published list with an open licence.
- Shown as: "This password is in the top N most common passwords."

**NIST link**
- SP 800-63B rev 4 requires verifiers to check a blocklist and sets length guidance. This ties to tool #1.

**UI**
- `type=password` with a show toggle.
- `autocomplete="off"`, spellcheck off.
- No logging, no analytics on the input, no network.
- "Make it stronger" opens the generator with a similar length.

**Coverage across the 5 competitors**

| Section | Pages (of 5) |
|---|:---:|
| Pattern estimator | 3 |
| Guess-rate disclosed | 2 |
| Multi-scenario | 1 |
| Fully offline | 1 (claimed) |
| Common-list check | 4 (3 via network) |
| Internally consistent numbers | 2 |

---

## 6. FAQ question bank

★ = asked on 2 or more pages, or a cluster keyword. Map to the 15-keyword cluster.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ Is it safe to type my real password here? | Bitwarden, DNS Robot (answer: offline; still better to test a similar pattern) |
| 2 | ★ How is password strength calculated? | Bitwarden, DNS Robot, Security.org |
| 3 | ★ How long would it take to crack my password? | Bitwarden, Service Vic, DNS Robot · `guessing passwords` |
| 4 | ★ What are the most common passwords? | Security.org · `most common passwords`, `popular passwords`, `10 000 most common passwords` |
| 5 | ★ What makes a password weak or strong? | all · `weak password strong password` |
| 6 | Why is "123456" cracked instantly? | `password 123456` |
| 7 | What types of password attacks are there? | DNS Robot · `types of password attacks` |
| 8 | Do l33t swaps (P@ssw0rd) help? | RoboForm, DNS Robot |
| 9 | What are the consequences of sharing passwords? | `consequences of sharing passwords` |
| 10 | Can you check if my password was in a breach? | Service Vic, DNS Robot (we explain why not: no network) |
| 11 | What is a password guesser? | `password guesser` (education only; no cracking) |

---

## 7. Gaps nobody fills: our opportunities

1. **Fully offline, pattern-aware estimator**, written by us. Nothing leaves the browser, and we say so prominently.
2. **Plain-English breakdown** of which part of the password is weak, and why.
3. **Four attack scenarios with disclosed, editable guesses/s.** No unexplained "billion years".
4. **Naive entropy vs real-world estimate**, side by side, to teach why character counting misleads.
5. **Offline common-password check** using a licensed bundled list.
6. **Consistent numbers.** Every example on the page is generated by the same engine, so FAQ and table figures can't disagree.
7. **"Make it stronger" handoff** to the generator (#1) and passphrase (#4).
8. **NIST-cited guidance** and an explanation of breach checks: why we don't run one, and where to get one (neutral, no affiliate).
9. **Safe UI:** password field, show toggle, no autocomplete, no logging.
10. **Links:** Password Generator (#1), Passphrase Generator (#4).

---

## 8. Blueprint for the KKCTools Password Strength Checker

### 8.1 SEO

- **URL:** `/password-strength-checker/`
- **Title:** Password Strength Checker – Test Your Password
- **H1:** Password Strength Checker: How Strong Is Your Password?
- **Meta:** as in the keyword file (153 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Input | type=password, show toggle, no autocomplete/spellcheck |
| Estimator | Own pattern matcher (dictionary, l33t, keyboard, sequence, repeat, date, brute) + min-guess DP |
| Outputs | Score 0–4, log10 guesses, bits, per-pattern breakdown, naive entropy, reasons |
| Scenarios | 4 rows with editable guesses/s → time |
| List check | Bundled common-password list (licensed) |
| Actions | Make it stronger → generator; copy nothing |
| Privacy | Big note; no network, no storage |

### 8.3 Content outline (≈ 1,300–1,600 words, original)

1. Intro (primary keyword) and privacy note
2. How to use (and why to test a similar password, not your real one)
3. How we estimate strength (patterns, not just character types)
4. How long would it take to crack? Scenarios explained
5. Types of password attacks
6. The most common passwords (our list, top 20)
7. Why l33t swaps and "Password1!" fail
8. What NIST recommends
9. Why we don't check breaches here
10. FAQ (10–12)
11. Related tools: Password Generator (#1), Passphrase Generator (#4)

### 8.4 Quality checks

- **Unit tests:**
  - each matcher
  - DP minimum
  - known examples: "123456" → instant; "correct horse battery staple"-style → strong
  - l33t
  - Unicode input
  - list lookup
  - scenario maths
- **Performance:** typing latency < 16 ms. Word lists are lazy-loaded from bundled static files on the same origin.
  - `TODO(owner)`: confirm a same-origin static asset is fine under the zero-network rule. If not, inline the lists in the JS bundle.
- No competitor wording. No zxcvbn dependency unless approved. `npm run check:no-network` passes.
- `TODO(owner)`:
  - pull Google top 10
  - approve the common-password list and dictionary sources and licences
  - approve the guesses/s citations
