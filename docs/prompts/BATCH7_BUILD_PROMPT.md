# Batch 7 — Builder Prompt (Antigravity / Gemini)

> **Goal:** build the 5 Batch 7 tool pages (password, passphrase, UUID and hacker-name tools) from their build specs.
> **Spec folder:** `docs/keywords analysis/Batch 7 - Developer & Web Tools/3. All Blogs Data/`
> **Written:** 2026-11-22

## 0. Read first, and obey

1. **Read in full before touching code:**
   - `AGENTS.md`, `CLAUDE.md`;
   - `00_BATCH7_BUILD_RULES.md` (especially §2 security rules, §3 sources, §4 shared code);
   - the tool's spec (`NN_<Name>_BUILD_SPEC.md` in its folder).
2. **graphify:** `graphify query` before searching code, `graphify update .` after changes; run from PowerShell. Exe: `$(ls ~/AppData/Roaming/Python/*/Scripts/graphify.exe | head -1)`.
3. **Run `npm run verify` from PowerShell or the VS Code terminal, never Git Bash.**
4. **Never:**
   - commit or push;
   - make network calls (no breach API, no UUID API; `npm run check:no-network` must pass);
   - use `Math.random` or `src/lib/generator/rng.ts` in the Password, Strength, UUID or Passphrase tools;
   - store, log, send or put in a URL any password, passphrase or typed password;
   - add npm dependencies (no zxcvbn, no uuid package, no word-list packages);
   - write hacking/cracking content, invented security statistics, or brand comparisons;
   - copy competitor text, names or word lists;
   - add ratings or `aggregateRating`.
5. If a spec disagrees with the code, or needs a `TODO(owner)` value, stop and report.

## 1. Order of work

1. **Shared code first** (rules §4), with tests:
   - `src/lib/secure-random.ts` (Web Crypto only, rejection sampling, Fisher–Yates, fails closed, injectable byte source for tests);
   - `src/data/attack-scenarios.ts` (4 labelled, editable rates).
2. **Add the catalog category `Developer & Web`.**
3. **Build `01_Password_Generator` (order 1), then STOP and report** so the owner can review the RNG and the pattern.
4. **With the owner's OK:**
   - 02 Password Strength Checker (needs the owner-approved common-password file);
   - 03 UUID / GUID Generator (**STOP**);
   - 04 Passphrase Generator (needs the owner-approved word list);
   - 05 Hacker Name Generator (reuses `src/lib/generator` helpers; band engine untouched) (**STOP**).
   - Run `npm run verify` after every tool.

## 2. For every tool

1. **Engine:** pure; randomness injected. **Every worked example in the spec is a unit test**, including the RFC 9562 vectors (v5 `2ed6657d-e927-568b-95e1-2665a8aea6a2`, v3 `5df41881-3aed-3515-88a7-2f4a814cf09e`) and the entropy figures (16 characters = 104.87 bits; 6 EFF words = 77.55 bits).
2. **Component:**
   - the calculator;
   - **`<Name>InputGuide.tsx` above the inputs** (numbered callouts = numbered labels, live values, focus highlight, accessible SVG, tokens, mobile `<details>`); **never draw a real generated secret in it**.
3. **Shared UI:**
   - `ToolShell` (the spec's 4 pills) + `TabSlider` (`?tab=`);
   - **a `<main>` element** with `toolDisplayFont.variable` + `typo.scope`;
   - Copy only on click; Hide/Show for secrets; the privacy line.
4. **Page:**
   - title, meta and H1 exactly as the spec;
   - BLUF with engine numbers (never a specific secret); static HTML holds no generated value;
   - H2s and FAQ as the spec (FAQ schema once);
   - HowWeCalculate with the RNG method, formulas and §3 sources (checked dates; CISA marked archived);
   - AdSlots outside the band, never near a password field.
5. **Register:**
   - routes, catalog + count test;
   - calculation-methods, ToolArt, Icons, Footer;
   - the spec's links in and out (Band Name page links to #5);
   - docs 00/01/02/04/06.
6. **Verify:**
   - `npm run verify` (all steps);
   - `graphify update .`;
   - manual check at 390/768/1280 px, light and dark;
   - load the page, go offline, and confirm every tool still works.

## 3. Owner items (`TODO(owner)`)

- **Blocking:** the common-password list file (SecLists is MIT; pick the file) for #2; the passphrase word list (EFF long list CC BY 4.0 with credit, or our own) for #4.
- Approve our own strength estimator (no zxcvbn); Web Crypto SHA-1 for v5; v3/MD5 in or out; the UETR preset (SWIFT page blocked); the hacker word bank.
- Confirm NIST SP 800-63B rev 4 final status and the password-manager/paste wording; find a current (non-archived) CISA page.
- Confirm the WPA2 8–63 rule against IEEE; run each UUID code snippet once.
- Re-export the UUID 0–15% keyword file; pull the SERPs in rules §0.
- Consider no ads on the three password pages.

## 4. Report at each stop

- Files changed.
- Verify output.
- Each worked example: spec value vs engine value.
- The pills used.
- Every `TODO(owner)` you hit and what you did.
- Any spec/code mismatch.
