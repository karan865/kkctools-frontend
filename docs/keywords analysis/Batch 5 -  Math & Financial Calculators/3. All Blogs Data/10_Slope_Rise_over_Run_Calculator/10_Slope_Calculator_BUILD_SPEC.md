# Slope / Rise over Run Calculator — Build Spec

> **URL:** `/slope-calculator/` · Batch 5 · Tier 2 · rank chance 🟡 · **Build order 13**
> **Read first:** `../00_BATCH5_BUILD_RULES.md` (§2.1: rules only with citations)
> **Inputs used:** `10_Slope_Rise_over_Run_Calculator_Competitor_Analysis.md` (6 pages read, 2026-11-14), keyword file §2 #10
> **SERP:** provisional
> **Written:** 2026-11-22 (full rewrite after the research pass)

---

## 0. Strategy

**Primary keyword:** `rise over run`, 14,800 searches at KD 23.

**Two intents share the keyword:**
- **maths** (two-point slope, rate of change);
- **building grades** (ramps, drains, roofs, driveways).

The maths rate-of-change rows are big (9,900 each) but **all declining**, so they get H2s only. **The page is built around construction slopes,** our audience.

**Who ranks:**

| Site | What it does |
|---|---|
| Pearson | best conversions, correct examples, "10% ≠ 10°" FAQ; no pitch, no ft-in, no sources |
| Omni | "rise over run" is two-point only: no %, ratio or pitch |
| Inch | splits the topic over **4+ thin pages** |
| DQYDJ | — |
| Firgelli | names ADA/IBC/MUTCD without sections |
| 1728.org | — |

**Gaps nobody fills:**
- cited presets;
- x/12 pitch;
- "any two → third" (e.g. a run of 20 ft at 2% gives the rise);
- feet + inches.

**Presets need citations the builder actually opens.** Proposed sources are listed in §3.3. `TODO(owner)`: approve the editions.

## 1. Keywords and placement

| Role | Keyword | US vol | KD | Trend | Where it goes |
|---|---|---:|---:|:---:|---|
| **Primary** | rise over run | 14,800 | 23 | | Title, H1, first sentence, H2 "Rise over run explained" |
| Secondary | rate of change formula · average rate of change formula | 9,900 · 9,900 | 26 | ⚠ declining | H2 "Rate of change and average rate of change" (two-point tab) |
| Secondary | how to find rate of change · rate of change equation | 5,400 · 4,400 | 19–20 | ⚠ declining | Same H2 + FAQ |
| Secondary | finding slope from a table | 1,000 | 13 | ⚠ declining | Two-point/table tab + H3 |
| FAQ only | difference quotient calculator | 1,000 | 14 | ⚠ declining | One FAQ (calculus definition, no tool) |
| Natural | slope calculator · percent slope · slope to degrees · roof pitch · ramp slope · drain slope | — | | | H2s, presets |

## 2. Our edge (6 competitors checked)

| Feature | Competitors with it |
|---|---|
| % grade / angle / ratio | 6 / 5 / 3 of 6 |
| **x/12 roof pitch** and in/ft | **0** |
| **Any two → the rest** (run + % → rise; rise + limit → minimum run) | **0** |
| **Feet + inches** in, ft-in to 1/16" out | **0** |
| **Cited construction presets** with pass/fail | **0** |
| Ramp planner (total rise → min run, runs, landings: only if the rule is cited) | 0 |
| Two-point/table: m, b (y = mx + b), distance, average rate of change | 2/6 |
| Slope length vs horizontal run explained | 1/6 |
| "10% ≠ 10°" explainer + triangle visual | 1/6 |

## 3. Calculator spec

### 3.1 Tabs

1. **Rise & run** (default; any two → the rest)
2. **Ramp, drain & roof presets**
3. **Two points / table** (maths)

### 3.2 Input guide diagram (above the inputs)

`SlopeInputGuide.tsx`: a right triangle on a ground line.
- Vertical "1 Rise", horizontal "2 Run", the sloped edge "slope length", and the angle θ.
- A badge shows the live **%, 1:N, degrees and x/12**.
- **Presets tab:** the triangle becomes a ramp, a pipe or a roof icon, with the limit line and a pass/fail colour.
- **Two-point tab:** a small grid with points (x₁, y₁) and (x₂, y₂).

### 3.3 Inputs

| Field | Default |
|---|---|
| Rise / run | 1 / 12, entered in ft-in (`2' 6"`), in, ft, m or cm |
| Other "any two" fields | slope length, %, degrees, 1:N, x/12, in/ft |

**Presets (each needs a citation the builder opened; otherwise ship as a user-set limit):**

| Preset | Rule to cite | Proposed source |
|---|---|---|
| Accessible ramp | max 1:12 running slope; max 30 in rise per run | 2010 ADA Standards §405.2 / §405.6 |
| Accessible route cross slope | max 1:48 | 2010 ADA Standards §403.3 |
| Drain / waste pipe | ¼ in per ft for small diameters | IPC 704.1 (check the edition) |
| Roof pitch | x/12 geometry only; material minimums from the manufacturer | — |
| Driveway / road | **no single rule**: user-set limit | — |

**Two-point:** x₁, y₁, x₂, y₂, or a pasted table of x, y.

### 3.4 Engine (`src/lib/slope-engine.ts`)

```ts
m = rise/run (null if run = 0) ; pct = 100m ; deg = atan(m) ; oneToN = run/rise ; pitch = 12m ; inPerFt = 12m ; length = √(rise²+run²)
solve any two: e.g. rise = run × pct/100 ; run = rise / m ; from degrees m = tan θ
preset check: m ≤ limit → pass, margin ; ramp: minRun = rise/limit ; runs = ceil(rise / maxRisePerRun) (only if the cited rule is enabled)
two-point: m = Δy/Δx, b = y1 − m·x1, distance = √(Δx²+Δy²) ; table: consecutive slopes + "is it linear?"
```

**Worked examples (checked 2026-11-22):**

| Case | Result |
|---|---|
| Rise 1, run 12 | **8.33%, 1:12, 4.76°, 1/12 pitch**, 1 in/ft |
| Run 20 ft at 2% | rise **0.4 ft = 4.8 in** |
| 4/12 roof pitch | **18.43°**, 33.3% |
| ¼ in per ft | **2.08%** |
| Ramp, 24 in total rise at 1:12 | minimum run **24 ft** |
| (1, 2) and (4, 11) | m = **3**, b = **−1**, y = 3x − 1 |

### 3.5 Outputs

- **Headline:** slope in every form.
- **Sentence:** "A rise of 1 over a run of 12 is an 8.33% slope (1:12, 4.76°, a 1/12 pitch)."
- Slope length; steps; triangle SVG.
- **Presets:** pass/fail with the margin, the source cited, and "check your local code".
- Two-point: the equation and distance.
- Copy, Share URL.

### 3.6 Tests

- Every conversion and "any two" solve.
- Run = 0; degrees ≥ 90 rejected.
- ft-in parsing; preset pass/fail.
- Two-point and table.
- All examples. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Slope Calculator – Rise over Run, Percent & Angle` (49; 61 with the suffix → `absoluteTitle`) |
| Meta | `Free slope calculator. Enter rise and run to get slope as a percent, ratio (1:12), angle and pitch, or find the rise for a ramp, drain or roof.` (143) |
| H1 | `Slope Calculator: Rise over Run as Percent, Ratio and Angle` |
| BLUF | "Slope = rise ÷ run. A rise of 1 over a run of 12 is 1/12: an 8.33% slope, a 1:12 ratio, an angle of 4.76° or a 1/12 roof pitch. Multiply by 100 for percent; use the arctangent for degrees. A 10% slope is not 10°." (engine) |
| ToolShell pills | `Percent, ratio, angle & pitch`, `Ramp & drain checks`, `Feet-inches input`, `Two-point slope` |
| Links out | Pythagorean (#9), Rafter (live), Roof Replacement (live), Concrete (live), Shingle (live) |
| Links in | Pythagorean, Rafter (add "convert pitch to %"), Concrete (driveway/slab slope), Tools hub "Construction maths" |

## 5. Content (~1,600–1,900 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the slope calculator | 3 tabs | 100 |
| 2 | Rise over run explained | Primary + example | 180 |
| 3 | Converting slope: percent, degrees, ratio and pitch | Conversion table | 200 |
| 4 | Percent vs degrees: a common mistake | 10% ≠ 10°; 45° = 100% | 120 |
| 5 | Ramp slope and planning an accessible ramp | 1:12 cited (if approved), planner example | 220 |
| 6 | Drain and pipe slope | ¼ in/ft cited (if approved) | 130 |
| 7 | Roof pitch and slope | x/12 ↔ % ↔ degrees; link Rafter | 130 |
| 8 | Driveway and road grades | No single rule; user limit | 100 |
| 9 | Slope from two points or a table | y = mx + b (`finding slope from a table`) | 150 |
| 10 | Rate of change and average rate of change | Formulas (`rate of change formula`, `average rate of change formula`) | 150 |
| 11 | FAQ | §6 | 420 |

## 6. FAQ (12, from the question bank)

1. What is rise over run, and how do you find slope?
2. How do you convert slope to a percentage?
3. Is a 10% slope the same as 10°?
4. What is the maximum slope for a wheelchair ramp? (cited only)
5. How do you find slope from two points or a table?
6. What is the rate of change formula?
7. What is the average rate of change formula?
8. How do you convert slope to roof pitch (x/12)?
9. How much fall does a drain pipe need per foot? (cited only)
10. What does 1:12 mean?
11. What is a steep driveway grade? (no single rule; check local code)
12. What is a difference quotient? (short definition)

## 7. Done when

- [ ] `slope-engine.ts` + tests; `npm run verify` passes.
- [ ] Every preset rule cited with section + edition (opened by the builder) or shipped as a user limit.
- [ ] InputGuide above the inputs; ToolShell + TabSlider + fonts + `<main>`.
- [ ] Registrations + docs; `graphify update .`.
