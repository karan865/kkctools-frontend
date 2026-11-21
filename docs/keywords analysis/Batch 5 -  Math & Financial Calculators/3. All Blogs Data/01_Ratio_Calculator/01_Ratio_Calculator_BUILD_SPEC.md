# Ratio Calculator — Build Spec

> **URL:** `/ratio-calculator/` · Batch 5 · Tier 1 · rank chance ✅ · **Build order 1**
> **Read first:** `../00_BATCH5_BUILD_RULES.md`
> **Inputs used:**
> - `01_Ratio_Calculator_Competitor_Analysis.md` (5 pages read, 2026-11-14)
> - `KKCTools_Batch5_Final_Tool_Keywords.md` §2 #1 (Semrush US)
>
> **SERP:** provisional (no Semrush export). `TODO(owner)`: pull the top 10 for `ratio finder`.
> **Written:** 2026-11-22 (full rewrite after the research pass)

---

## 0. Strategy

- **Why this term:** `ratio finder` is **8,100 searches at KD 7, and rising**. It is an exact tool term with low difficulty, and the biggest easy win in Batch 5.
- **Definition searches:** "ratio definition", "what does ratio mean", "def of ratio" add ~30,000 support searches. Answer them in plain English on the same page.
- **Who ranks:**
  - calculator giants (CalculatorSoup, Omni);
  - MiniWebtool;
  - an education site (Helping with Math);
  - Alcula;
  - plus pages.dev clones and Pearson channels.
  - MiniWebtool has the most features but **promises steps it never shows**. CalculatorSoup has no simplify mode and no FAQ.
- **Two homework keywords** need a worked example on the page that mirrors the wording:
  - `what x-value makes the set of ratios equivalent` (9,900);
  - `ratios that are equivalent to 5 2`.
- **Ignore `proportion calculator` (1.22M).** That is a Semrush data error (6 of 12 months are zero).
- **Construction angle:** mixing ratios (concrete 1:2:3, mortar 1:3, epoxy 2:1, 50:1 fuel) link to our live Concrete page and the Batch 4 Epoxy page.

## 1. Keywords and placement

| Role | Keyword | US vol | KD | Trend | Where it goes |
|---|---|---:|---:|:---:|---|
| **Primary** | ratio finder | 8,100 | 7 | ↑ | First sentence, tool heading ("Ratio finder"), one H2 |
| Secondary | proportions | 12,100 | 21 | | H2 "Ratios and proportions" + the Solve tab label |
| Secondary | what x-value makes the set of ratios equivalent | 9,900 | 19 | | H3 example under "Solving proportions for x", using that exact phrasing |
| Secondary | ratio definition · def of ratio | 5,400 · 2,900 | 21 · 28 | ↑ | H2 "What is a ratio? (definition)" |
| Secondary | proportions calculator | 5,400 | 24 | ↑ | Solve tab heading + meta wording |
| Secondary | how to calculate ratio | 3,600 | 21 | | H2 "How to calculate and simplify a ratio" + FAQ |
| Secondary | what does ratio mean | 3,600 | 16 | ↑ | FAQ #1 |
| Support | ratio 1 2 1 | 3,600 | 27 | | 3-part example + FAQ "What does a 1:2:1 ratio mean?" |
| Support | ratios that are equivalent to 5 2 | 2,900 | 25 | | Equivalents tab default example 5:2 + H3 |
| Skip | what is the value of x 50 100 | 2,900 | 17 | ⚠ irregular | — |

## 2. Our edge (5 competitors checked)

| Gap | Competitors with it |
|---|---|
| Split a total by a ratio (60 kg as 1:2:3 → 10/20/30) | **0 of 5** |
| Fraction and decimal terms (½ : ¾ → 2 : 3) | **0 of 5** |
| Steps actually shown in the tool (GCD, cross-multiplication, scale factor) | **0 of 5** (MiniWebtool promises but doesn't show) |
| N-part ratios (2–6 terms) in every mode, including solve | 2 of 5, partial |
| Ratio ↔ fraction ↔ percent with **both** meanings | 1 of 5, and **wrong** (Helping with Math shows 3:4 as 75%/25%; correct shares are 42.86%/57.14%) |
| Equivalents table + "check if equivalent" | 2 of 5 |
| Mix presets (concrete, mortar, epoxy, fuel) linked to real tools | 0 |
| Clear edge cases (zero, negative, no solution) | 0 |

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **Simplify** (default)
2. **Solve for x** (A:B = C:D and N-part)
3. **Split a total**
4. **Equivalent ratios** (table + check)
5. **Ratio → fraction & %**

### 3.2 Input guide diagram (above the inputs)

`RatioInputGuide.tsx`: coloured bars side by side, one per term. Bar lengths are proportional to "1 First term", "2 Second term" and "3 Third term" (optional).
- A bracket over the bars is labelled "Total parts = sum".
- **Split tab:** a long block labelled "4 Total amount" is cut into the same proportions, each slice labelled with its live share (e.g. "10 kg").
- **Solve tab:** two rows of bars, with the unknown bar dashed and labelled "x".

Numbered badges match the field labels; the focused field highlights.

### 3.3 Inputs (defaults = examples)

| Tab | Default | Notes |
|---|---|---|
| Simplify | 12 : 18 | 2–6 terms; integers, decimals (1.5), fractions (1/2) and mixed numbers (1 1/4) |
| Solve | 2 : 3 = 10 : x | x can sit in any position; N-part solve |
| Split | 60 kg as 1 : 2 : 3 | unit label free text; presets: concrete 1:2:3, mortar 1:3, epoxy 2:1, epoxy 1:1, 2-stroke fuel 50:1 (`TODO(owner)`: approve the list) |
| Equivalents | 5 : 2, multipliers 1–10 | plus "check: are 4:6 and 6:9 equivalent?" |
| Fraction/% | 3 : 4 | |

### 3.4 Engine (`src/lib/ratio-engine.ts`)

```ts
toIntegers(terms): multiply by 10^decimals or LCM of denominators → whole numbers (show the factor)
gcdAll(terms) ; simplify = terms / gcd
solve(a, b, c): x = b*c/a (null if a == 0) ; N-part: k = known/known' then multiply
split(total, terms): part_i = total * t_i / Σt (rounding note: show unrounded sum check)
equivalents(terms, from, to) ; isEquivalent(r1, r2) via cross-products
toFraction: a/b ; share_i = t_i / Σt ; percent = share × 100 ; oneToN = terms / first ; nToOne = terms / last
```

Edge cases: zero term → "a ratio term can't be 0 when solving"; negatives rejected with a message.

**Worked examples (checked 2026-11-22):**

| Case | Result |
|---|---|
| Simplify 12:18 | **2:3** (GCD 6) |
| Simplify ½ : ¾ | × 4 → **2 : 3** |
| Solve 2:3 = 10:x | **x = 15** |
| Split 60 kg as 1:2:3 | **10 / 20 / 30 kg** |
| 3:4 as shares | **42.86% / 57.14%** (not 75/25) |
| Check 4:6 vs 6:9 | **equivalent** (both 2:3) |

### 3.5 Outputs

- **Headline:** the simplified ratio, with 1:n and n:1 forms.
- **Plain sentence:** "12:18 simplifies to 2:3 because both terms divide by 6."
- **Steps panel:** the GCD found, the division shown, or the cross-multiplication with numbers.
- Share table (fraction and %). Equivalents table.
- Copy, Share URL.

### 3.6 Tests

- GCD with decimals and fractions; N-part simplify and solve.
- Split with rounding.
- Percent shares (3:4 → 42.86/57.14).
- Equivalence check; zero/negative messages.
- All the examples above. Snapshot of every page number.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Ratio Calculator – Simplify and Solve Proportions` (49; 61 with the suffix → `absoluteTitle`) |
| Meta | `Free ratio calculator. Simplify a ratio, list equivalent ratios, solve a proportion for x and scale a recipe or mix by a ratio, with the steps shown.` (149) |
| H1 | `Ratio Calculator: Simplify Ratios, Find Equivalents and Solve for X` |
| First sentence | "Use this ratio finder to simplify any ratio, solve a proportion for x, or split an amount by a ratio, with every step shown." |
| BLUF | "To simplify a ratio, divide every term by their greatest common factor: 12:18 ÷ 6 = 2:3. To solve a proportion a:b = c:x, cross-multiply: x = b × c ÷ a, so 2:3 = 10:x gives x = 15." (engine) |
| ToolShell pills | `Simplify & solve for x`, `Split a total by ratio`, `Fractions & decimals`, `Steps shown` |
| Links out | Fraction to Percent (#7), Percentage Change (live), Concrete (live), Epoxy Resin (Batch 4), Unit Price (live) |
| Links in | Fraction to Percent, Concrete (mix ratio line), Epoxy Resin, Tools hub "Math & Finance → Everyday" |

## 5. Content (~1,400–1,700 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the ratio finder | 5 tabs in one line each | 100 |
| 2 | What is a ratio? (definition) | Plain definition, a:b vs a to b vs a/b; `what does ratio mean`, `def of ratio` | 150 |
| 3 | How to calculate and simplify a ratio | GCD method, 3 engine examples (whole, decimal, fraction) | 220 |
| 4 | Equivalent ratios | Table for 5:2 + "how to check" (`ratios that are equivalent to 5 2`) | 150 |
| 5 | Ratios and proportions: solving for x | Cross-multiplication; H3 "What x-value makes the set of ratios equivalent?" worked example | 250 |
| 6 | Splitting an amount by a ratio | Concrete 1:2:3, recipe, epoxy 2:1 (link tools) | 180 |
| 7 | Three-part ratios like 1:2:1 | Meaning + example (`ratio 1 2 1`) | 120 |
| 8 | Ratios as fractions and percentages | Both meanings; the common 3:4 mistake | 150 |
| 9 | Ratio vs proportion | Short | 100 |
| 10 | FAQ | §6 | 400 |

## 6. FAQ (12, from the competitor question bank + cluster keywords)

1. What does ratio mean? (`what does ratio mean`)
2. How do you calculate a ratio? (`how to calculate ratio`)
3. How do you simplify a ratio?
4. How do you solve a proportion for x?
5. What x-value makes two ratios equivalent? (engine example)
6. What are equivalent ratios? (5:2 example)
7. What does a 1:2:1 ratio mean?
8. How do I split an amount in a ratio like 1:2:3?
9. How do I turn a ratio into a percentage or a fraction? (both meanings)
10. Can a ratio have decimals or fractions?
11. Ratio vs proportion: what is the difference?
12. How do map scales like 1:50,000 work?

## 7. Done when

- [ ] `ratio-engine.ts` + tests (all examples above); `npm run verify` passes (PowerShell).
- [ ] InputGuide above the inputs; ToolShell + TabSlider + fonts + `<main>`.
- [ ] Mix presets approved by the owner (or shipped as "example ratios").
- [ ] Registrations (category `Math & Finance`) + docs; `graphify update .`.
