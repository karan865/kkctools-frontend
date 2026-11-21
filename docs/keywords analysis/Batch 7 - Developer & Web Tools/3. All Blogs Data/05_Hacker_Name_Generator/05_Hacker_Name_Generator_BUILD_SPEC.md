# Hacker Name Generator — Build Spec

> **URL:** `/hacker-name-generator/` · Batch 7 · Tier 3 · **Build order 5**
> **Read first:** `../00_BATCH7_BUILD_RULES.md` (§1 "no hacking content", §5 hub links)
> **Inputs:** `05_Hacker_Name_Generator_Competitor_Analysis.md`, keyword file §2 #5, the live Band Name Generator (`src/lib/generator/*`, `/band-name-generator/`)
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**One keyword:** `hacker name generator` **210 / KD 6** (✅). Small, but:
- it is the same kind of tool as our live Band Name Generator, so it's cheap;
- the SERP is name-generator networks with **no style controls** and some broken pages (unrendered template code, `#` share links, typos), plus spam on hijacked domains.

**Rules for this page:**
- **fun names only:** no hacking tutorials, no "how to hack", no real hacker aliases, no real people or brands;
- an **original word bank written by us**, reviewed by the owner, passed through the existing profanity filter;
- shorter content (~800–1,000 words) but fully original.

### Research notes from the competitor analysis

- **Pages read:** The Story Shack (Martin Hooijmans, Apr 2026), Fun Generators (May 2026), Eggradients (Oct 2026), NameGenerator.co cyberpunk. Nerd Burglars 403.
- **The Story Shack:** a Generate button only; save needs an account; **raw template placeholders (`<% app.name %>`) visible** on the page; its guide mentions leet speak but the tool has none.
- **Fun Generators:** 5 names per click with a leet version, local history, embed; inconsistent leet capitalisation; an unsourced "Neo anagram" claim; calls Delta Green cyberpunk (it's cosmic horror).
- **Eggradients:** the generator isn't visible in the page text; general hacking/ethics essay; entertainment disclaimer ✔; typos ("rying", "Cold Ppalettes").
- **NameGenerator.co:** the most controls (gender, 1–30, "starts with", AI toggle) but the stated maximum (20 vs 30) and gender options don't match the controls; templated definitions; `#` share links.
- **0 of 4** offer style choice + seed word + username-safe character rules together.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | hacker name generator | 210 | 6 | title, H1, first sentence, ToolShell heading, Generate button |
| Natural | hacker names · cool hacker names · hacker usernames · leet speak · gamer tag generator · cyberpunk names | — | — | H2s ("Cool hacker names", "Leet speak explained", "Hacker usernames and gamer tags") (`TODO(owner)`: pull volumes) |

## 2. Our edge

- **Five styles:** l33t, cyberpunk, minimal, gamer tag, terminal (code-like, e.g. `null_vector`, `0xGhost` style).
- **Optional seed word** woven in (sanitised with the existing `sanitizeMustInclude`, filtered by `isOffensive`).
- **Username-safe rules:** length range, allowed characters (letters/digits/underscore; spaces on/off), case (lower, CamelCase, UPPER). Labelled "common username style", **not** a claim about any platform's rules (platform hints only if the owner cites them).
- **Leet density:** none · light · heavy, with the readable form shown beside l33t names.
- **Local favourites** (localStorage in try/catch), Copy, Copy all, no account.
- **Original word bank** + the existing profanity filter + a "no real people/brands" check.

## 3. Calculator spec

### 3.1 Tabs

1. **Generate** (default)
2. **Favourites**

### 3.2 Input guide diagram (above the inputs)

`HackerNameInputGuide.tsx`: a terminal-window card.

- A prompt line `> generate --style l33t --seed ghost`.
- **Callouts:**
  - "1 Style" on `--style`;
  - "2 Your word (optional)" on `--seed`;
  - "3 Leet level" on a slider chip;
  - "4 Username rules (length, characters)" on a small rules box;
  - output lines below: `gh0st_runner`, `Gh057Vector` (examples from the engine's test fixtures).
- Live: the prompt line mirrors the user's choices.

### 3.3 Inputs

| Field | Default |
|---|---|
| Style | any (l33t · cyberpunk · minimal · gamer tag · terminal) |
| Seed word | empty (max 20 characters, sanitised) |
| Count | 10 (5 · 10 · 20 · 30) |
| Leet level | light (none · light · heavy) |
| Length | 4–16 |
| Characters | letters + digits + underscore (spaces off) |
| Case | as generated (lower · CamelCase · UPPER) |

### 3.4 Engine (`src/lib/hacker-name-engine.ts`, reusing `src/lib/generator`)

Reuse, don't widen the band engine's `GenreId` union (keeps the live band page safe):
- `createRNG`, `getRandomSeed` from `generator/rng.ts` (**fine here**: names aren't secrets; rules §2.1 forbids this RNG only for #1–#4);
- `isOffensive` from `generator/offensive.ts`;
- `sanitizeMustInclude` from `generator/engine.ts`.

```ts
pools (src/lib/generator/pools/hacker.ts, written by us): adjectives, techNouns, verbs, prefixes, suffixes, terminalTokens
patterns per style:
  l33t:      noun | adj+noun → leet(level)
  cyberpunk: adj + techNoun | neon/noir compounds
  minimal:   shortWord + 2–3 digits
  gamerTag:  prefix + seed|noun + suffix, joined by "_" or CamelCase
  terminal:  token_token | "0x" + Noun | noun + "()" style (characters filtered by the rules)
leet: light = {o→0, e→3} ; heavy = {a→4, e→3, i→1, o→0, s→5, t→7} ; keep the readable original alongside
rules filter: length range, allowed characters, case ; drop names that fail ; retry up to N times, then warn
safety: isOffensive(name) and isOffensive(seed) → drop ; a small blocklist of real hacker aliases / brands (ours) → drop
dedupe within a batch and against the current favourites
```

**Worked examples (deterministic with a fixed seed; make each a unit test):**

| Input | Output |
|---|---|
| leet heavy("ghost") | `gh057` |
| leet light("ghost") | `gh0st` |
| leet heavy("phantom") | `ph4n70m` |
| leet none("cipher") | `cipher` |
| rules: length 4–16, letters/digits/underscore, a candidate `null vector` | spaces not allowed → `null_vector` (join) or dropped, as configured |
| seed `shit99` | `isOffensive` → seed ignored, warning shown (note: the filter matches whole terms after stripping symbols, so add a test for symbol tricks like `sh!t` and extend `offensive.ts` only with the owner's OK) |
| fixed RNG seed 12345, style gamer tag, seed word `ghost`, count 5 | five names, identical on every run (snapshot test) |

### 3.5 Outputs

- **Name cards:** the name, the readable form for l33t (`gh057` · "ghost"), Copy, ☆ favourite.
- **Sentence:** "10 hacker names in the l33t style, made from your word 'ghost'."
- Generate again, Copy all.
- **Favourites tab:** saved names (this device only), Copy, Remove, Clear all.
- **"For fun" note** under the tool: "Names are made up for games, stories and usernames. Nothing here is about real hacking."
- Links: Band Name Generator, Password Generator (#1) ("Need a password for that new account?"), Passphrase Generator (#4).

### 3.6 Tests

- Each style's pattern; seed insertion; leet maps (light/heavy/none) incl. upper case (`G` stays `G`).
- Rules filter (length, characters, case); retry + warning when nothing fits.
- Profanity on seed and output (10,000 generated samples contain no `isOffensive` hit); alias/brand blocklist.
- Dedupe; favourites storage wrapped in try/catch (works with storage blocked).
- Deterministic output for a fixed RNG seed (snapshot).
- The band engine's tests still pass unchanged.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Hacker Name Generator – Cool Hacker Usernames` (45; 57 with the suffix: OK) |
| Meta | `Free hacker name generator. Get cool hacker-style names and gamer tags from your own words and styles, then copy your favourites. Made in your browser.` (151) |
| H1 | `Hacker Name Generator: Cool Hacker Names and Usernames` |
| BLUF | "Pick a style (l33t, cyberpunk, minimal, gamer tag or terminal), add your own word if you like, and the hacker name generator makes 10 names at a time. Set the length and allowed characters so they work as a username, save your favourites, and copy them. It's just for fun, and it all runs in your browser." |
| ToolShell pills | `5 styles incl. l33t`, `Add your own word`, `Username-safe options`, `Save favourites, no account` |
| Links out | Band Name Generator, Password Generator (#1), Passphrase Generator (#4) |
| Links in | Band Name Generator (add a "More name generators" link), Tools hub "Developer & Web" |

## 5. Content (~800–1,000 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the hacker name generator | Styles, seed, rules, favourites | 110 |
| 2 | Cool hacker names: the five styles | One short paragraph + 2 engine examples per style | 200 |
| 3 | What makes a memorable hacker handle | Our tips: short, sayable, unique, no personal info, check it's free | 140 |
| 4 | Leet speak explained | What it is, our light/heavy maps, readability trade-off | 120 |
| 5 | Hacker usernames and gamer tags | Length and character rules in general terms; check each platform's own rules (no claims) | 110 |
| 6 | FAQ | §6 | 230 |

## 6. FAQ (8, from the competitor question bank)

1. What makes a good hacker name or handle?
2. What is leet speak (1337)?
3. Is this free, and can I use the names anywhere? (yes, free; check the name isn't already someone's trademark or account)
4. Can I add my own word?
5. Will the names work as a gamer tag or username? (use the rules options; each site has its own rules)
6. Are these real hacker aliases? (no; made up from our word list)
7. Is this related to real hacking? (no; entertainment only)
8. Can I use the names for games or stories?

## 7. Done when

- [ ] `hacker-name-engine.ts` + `pools/hacker.ts` + tests; band engine untouched and its tests green; `npm run verify` passes.
- [ ] Word bank reviewed by the owner (`TODO(owner)`); no real aliases/brands; profanity filter applied.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Registrations + docs; Band Name page links here; `graphify update .`.
- [ ] **STOP and report** (end of Batch 7).
