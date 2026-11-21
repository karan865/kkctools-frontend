# One Rep Max (1RM) & Strength Calculator — Build Spec

> **URL:** `/one-rep-max-calculator/` · Batch 8 · Tier 1 · **Build order 9**
> **Read first:** `../00_BATCH8_BUILD_RULES.md` (Part 2 §10 rule 4 fitness estimates, §11 formula sources, §12 `one-rep-max-engine`, §13 Health & Fitness hub)
> **Inputs:** `10_One_Rep_Max_1RM_Strength_Calculator_Competitor_Analysis.md`, keyword file §2 #10
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**14 keywords, ≈ 62,000 searches, tool terms at KD 0–15:**
- primary `1rm predictor` **6,600 / KD 4** (irregular);
- `strength calculator` 12,100 / KD 13, `str calc` 12,100 / KD 15, `strength calc` 2,400 / KD 4;
- `bench pr calculator` 2,900, `deadlift calculator` 1,600, `deadlift 1rm calculator` 1,000 / **KD 0**, `onerepmax` 1,000, `1 rpm calculator` 1,000 (a misspelling of 1RM: never in copy);
- `how strong am i` 1,000 / KD 13: answered honestly (no rankings without a cited dataset);
- `rpe calculator` 5,400 / KD 20: RPE tab;
- brand-name rows (`strength level bench press calculator` 6,600, `strength level calculator` 2,900, `level strength` 5,400): **"Strength Level" is a site's name; we use the words only descriptively** ("strength level" in a sentence), never as our product name.

**Low-risk fitness, but still an estimate.** Public formulas, no data to maintain. Competitors either hide their formula (Strength Level) or get their own charts wrong (GIGA, Fitness Volt).

### Research notes from the competitor analysis

- **Pages read:** Strength Level, Calculator.net, GIGAcalculator, Fitness Volt (formula comparison). ExRx 403.
- **Strength Level:** lift selector, kg/lb, a 1–30 rep % chart; **formula undisclosed**; ~200 words; no RPE; links to its own standards (dataset not described).
- **Calculator.net:** Epley/Brzycki/Lombardi, 100 kg × 5 → 116.7 / 112.5 ✔, but training % only as bullets and the rep-range advice contradicts itself (1–10 vs 3–10).
- **GIGA:** 13 formulas (5 written out), 9 references, **% chart wrong at 4, 6 and 12 reps** (89 / 84 / 72; Epley gives 88.2 / 83.3 / 71.4), Mayhew and Wathen exponents garbled.
- **Fitness Volt:** 7 formulas, RPE example 100 ÷ 0.86 = 116.3 ✔, **but** calls Epley "exact" at 1 rep (it gives 1.033 × w), says Brzycki is "slightly lower at 10 reps" (**they're identical at 10: 133.33**), says Brzycki fails "above 36" (it fails at 37); no sources; an empty "Average" row.
- **0 of 4** show the average and spread of several formulas or a stated-derivation RPE table.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | 1rm predictor | 6,600 | 4 | first sentence, H2 "How the 1RM predictor works" |
| Head (not in exports) | one rep max calculator · 1rm calculator | — | — | title, H1, ToolShell heading |
| Secondary | strength calculator · str calc · strength calc | 12,100 · 12,100 · 2,400 | 4–15 | intro ("a strength calculator for any lift"), HowWeCalculate |
| Secondary | bench pr calculator · deadlift calculator · deadlift 1rm calculator | 2,900 · 1,600 · 1,000 | 0–15 | lift presets, H2 "Bench press, squat and deadlift 1RM" |
| Secondary | onerepmax | 1,000 | 5 | URL/H1 already match; no run-together spelling in copy |
| Secondary | how strong am i | 1,000 | 13 | FAQ 7 (honest answer) |
| Secondary | rpe calculator | 5,400 | 20 | RPE tab + H2 "RPE and reps in reserve" |
| Descriptive only | strength level bench press calculator · strength level calculator · level strength | 6,600 · 2,900 · 5,400 | 2–26 | never as a name; "your strength level" may appear naturally once |
| Never in copy | 1 rpm calculator | 1,000 | 9 | misspelling |

## 2. Our edge

- **Three named formulas (Epley, Brzycki, Lombardi), their average and their spread,** with sources (rules §11); Mayhew/Wathen/O'Conner hidden until sourced.
- **A correct % chart** (100 → 50 % in 5 % steps): weight, estimated reps (inverse Epley), **rounded to your plates** (2.5 kg / 5 lb, editable).
- **RPE / RIR table** (reps 1–12 × RPE 6–10), **derivation shown** (Epley with reps-in-reserve added) and labelled as our method until the RPE source is confirmed.
- **Lift presets** (bench, squat, deadlift, overhead press) only change labels; kg ↔ lb.
- **Accuracy note:** most reliable from 2–10 reps; flagged above 10; Brzycki rejected at 37+ reps.
- **Honest "how strong am I":** we don't rank people without a cited, licensed dataset.
- Link to Barbell Plate (#32) for loading the bar.

## 3. Calculator spec

### 3.1 Tabs

1. **Estimate 1RM** (default)
2. **% chart**
3. **RPE table**

### 3.2 Input guide diagram (above the inputs)

`OneRepMaxInputGuide.tsx`: a loaded barbell with a rep counter.

- "1 Weight lifted (100 kg)" on the plates; "2 Reps done (5)" on a counter; "3 Lift" label (bench/squat/deadlift icon); "4 Units kg / lb".
- An arrow to a gauge "≈ 116 kg 1RM (3 formulas)" (live average).
- **% chart tab:** the bar at 80 % with "93 kg × ~7 reps".
- **RPE tab:** a 1–10 effort scale with "RPE 8 = 2 reps left".
- Live values; the focused field highlights.

### 3.3 Inputs

| Field | Default |
|---|---|
| Weight | 100 |
| Reps | 5 (1–20; warning above 10) |
| Units | kg (kg · lb) |
| Lift | bench press (bench · squat · deadlift · overhead press · other) |
| Plate rounding step | 2.5 kg / 5 lb (editable; 0 = none) |
| Show extra formulas | off (enabled only once sourced) |

### 3.4 Engine (`src/lib/one-rep-max-engine.ts`)

```ts
epley(w, r)    = r === 1 ? w : w * (1 + r/30)        // show the raw formula value as well in HowWeCalculate
brzycki(w, r)  = r >= 37 ? null : w * 36 / (37 - r)
lombardi(w, r) = w * r ** 0.10
average = mean(non-null) ; spread = max − min
percentTable(oneRM, step) = [1, .95 … .5] → {pct, weight, rounded = round(weight/step)*step, reps = 30*(1/p − 1)}
rpeTable(oneRM): for r in 1..12, rpe in 6..10: rir = 10 − rpe ; pct = 1 / (1 + (r + rir)/30) ; weight = oneRM * pct
units: lb = kg * 2.20462262185 (1 lb = 0.45359237 kg exactly)
```

Note on r = 1: the formulas give w × 1.033 (Epley) and w (Brzycki, Lombardi); a single rep **is** the 1RM, so the headline uses w and the note explains the difference (fixes Fitness Volt's "exact" claim).

**Worked examples (checked with node, 2026-11-22):**

| Input | Epley | Brzycki | Lombardi | Average | Spread |
|---|---:|---:|---:|---:|---:|
| **100 kg × 5** | **116.67** | **112.50** | **117.46** | **115.54** | 4.96 |
| 100 kg × 10 | 133.33 | **133.33** (equal) | 125.89 | 130.85 | 7.44 |
| 225 lb × 5 | 262.50 | 253.13 | 264.29 | 259.97 → **260 lb** (5 lb plates) | 11.16 |
| 315 lb × 3 | 346.50 | 333.53 | 351.58 | 343.87 | 18.05 |
| 60 kg × 20 | 100.00 | 127.06 | 80.96 | 102.67 | **46.10** (why > 10 reps is unreliable) |

**% chart for a 116.67 kg 1RM (2.5 kg rounding):**

| % | Weight | Rounded | Est. reps |
|---:|---:|---:|---:|
| 100 | 116.7 | 117.5 | 1 |
| 90 | 105.0 | 105.0 | 3.3 |
| 85 | 99.2 | 100.0 | 5.3 |
| 80 | 93.3 | 92.5 | 7.5 |
| 75 | 87.5 | 87.5 | 10 |
| 70 | 81.7 | 82.5 | 12.9 |
| 60 | 70.0 | 70.0 | 20 |
| 50 | 58.3 | 57.5 | 30 |

Epley % at 4 / 6 / 12 reps = **88.2 / 83.3 / 71.4 %** (GIGA prints 89 / 84 / 72).

**RPE (derived):** 5 reps @ RPE 10 = 85.7 % · 5 @ 8 = 81.1 % · 3 @ 9 = 88.2 % · 8 @ 7 = 73.2 % · 1 @ 10 = 96.8 % (the derived table puts a single rep at 96.8 %, not 100 %: say so).

### 3.5 Outputs

- **Headline:** "Estimated 1RM ≈ 115.5 kg" (average) + the three formula values + "range 112.5–117.5".
- **Sentence:** "Lifting 100 kg for 5 reps suggests a one rep max of about 115.5 kg (Epley 116.7, Brzycki 112.5, Lombardi 117.5). This is an estimate; your true max can differ."
- Accuracy note (reps > 10 → amber).
- % chart and RPE table (rounded to plates), Copy as text.
- **"Estimate, not medical or coaching advice"** line + link to the Health methodology page.
- Share URL (`?w=100&r=5&u=kg&lift=bench`).
- Links: Barbell Plate (#32), FFMI (#26), TDEE (#20) when live.

### 3.6 Tests

- Each formula vs the table; r = 1 (headline = w); r ≥ 37 → Brzycki null; average ignores nulls.
- Units: exact kg/lb conversion; plate rounding (2.5, 5, 1.25, 0).
- % chart rows and inverse-Epley reps; RPE table values above.
- Input guards (0, negative, reps > 20 warning).
- Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `One Rep Max Calculator – 1RM for Bench & Deadlift` (49; **61 with the suffix → `absoluteTitle`**) |
| Meta | `Free one rep max calculator. Estimate your 1RM for bench press, squat and deadlift from any set, see a % training chart and an RPE table, in your browser.` (154) |
| H1 | `One Rep Max Calculator: Estimate Your 1RM and Training Weights` |
| BLUF | "Enter the weight and reps from a hard set and this 1RM predictor estimates your one rep max with three named formulas and their average. 100 kg for 5 reps gives about 115.5 kg (Epley 116.7, Brzycki 112.5, Lombardi 117.5). Use the % chart and RPE table to pick training weights, rounded to your plates." (engine) |
| ToolShell pills | `3 formulas + average`, `% chart rounded to plates`, `RPE / reps-in-reserve table`, `kg or lb, any lift` |
| Links out | Barbell Plate (#32), FFMI (#26), TDEE (#20) (when live); Health methodology page |
| Links in | #32, #26, Tools hub "Health & Fitness" |

## 5. Content (~1,200–1,500 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the one rep max calculator | 3 tabs, units, plates | 110 |
| 2 | How the 1RM predictor works | The three formulas with sources; the 100 × 5 example; average and spread | 180 |
| 3 | Which formula should you trust? | Rep-range accuracy; the 60 × 20 spread example; why the average helps | 140 |
| 4 | Bench press, squat and deadlift 1RM | Same maths for every lift; presets; deadlift notes (our own, general) (`deadlift 1rm calculator`, `bench pr calculator`) | 120 |
| 5 | Training percentages | The % chart and how to use it | 130 |
| 6 | RPE and reps in reserve | The derived table, what RPE means, the 96.8 % caveat (`rpe calculator`) | 140 |
| 7 | Testing a true 1RM safely | General guidance: warm-ups, spotters, safety bars; no medical claims | 110 |
| 8 | FAQ | §6 | 330 |

## 6. FAQ (10, from the competitor question bank + cluster keywords)

1. How do I calculate my one rep max?
2. Which 1RM formula is most accurate (Epley vs Brzycki)?
3. What percentage of my 1RM should I train at?
4. How many reps should I use to estimate 1RM?
5. What is RPE / reps in reserve, and how does it relate to 1RM?
6. How do I estimate my deadlift 1RM?
7. How strong am I compared with others? (we don't rank without a cited dataset; compare with your own past lifts)
8. Is it safe to test a true 1RM?
9. How do I convert kg to lb for lifting?
10. What plates do I need to load this weight? (link #32)

## 7. Done when

- [ ] `one-rep-max-engine.ts` + tests; `npm run verify` passes.
- [ ] No strength-standards table; formula sources shown; extra formulas off until sourced.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Health methodology page linked (create a stub if it doesn't exist; `TODO(owner)` reviewer).
- [ ] Registrations + docs + "Health & Fitness" category; `graphify update .`.
