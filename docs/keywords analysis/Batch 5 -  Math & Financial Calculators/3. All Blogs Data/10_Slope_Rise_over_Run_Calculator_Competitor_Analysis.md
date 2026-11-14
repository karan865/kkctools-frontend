# Slope / Rise over Run Calculator — Competitor Analysis

> **Target page:** KKCTools `/slope-calculator/` (Batch 5, Tool #10 🟡)
> **Primary keyword:** `rise over run`. US 14,800 · KD 23. The cluster has 7 keywords and 46,400 US searches. The rate-of-change rows (9,900 + 9,900 + 5,400 + 4,400) are all declining.
> **SERP source:** ⚠ No Semrush SERP export for Batch 5. Competitors come from a live web search for `rise over run slope calculator` on 2026-11-14. `TODO(owner): pull Google top 10 for "rise over run".`
> **Pages visited:** 6 read on 2026-11-14: Omni (rise over run), Inch (rise-run → %), Pearson (slope %), DQYDJ (slope), Firgelli (slope grade), 1728.org (road gradient).

---

## 0. How this was collected (read first)

- **Two intents share this keyword:**
  - **Maths (two-point slope, rate of change):** Omni, DQYDJ, Inch's slope page, Brightchamps.
  - **Grade, construction and roads:** Pearson's slope %, Inch's rise-run → % and → degrees pages, Firgelli and 1728.org.
  - Our angle in the keyword file is building slopes: ADA ramp 1:12, drain fall ¼ in/ft, roof pitch and driveway grade.
- **Inch Calculator splits the topic into 4+ pages:** rise over run, rise-run to %, rise-run to degrees, and slope. Each one is thin. We will cover the topic on **one** page.
- **The standards that the presets need must be cited.** Firgelli names ADA, IBC and MUTCD with no section numbers. Pearson, DQYDJ and 1728.org give limits with no source at all. `TODO(owner)`: approve the citations listed in §5.
- Arithmetic was re-checked. No competitor text was copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | omnicalculator.com/construction/rise-over-run | Giant | Rise Over Run Calculator | 1,000–1,200 |
| 2 | inchcalculator.com/rise-run-percent-calculator/ | Calc site | Rise Over Run to Percent Slope Calculator | ~230 |
| 3 | pearson.com/channels/calculators/slope-percentage-calculator | Education publisher | Slope Percentage Calculator | ~900 |
| 4 | dqydj.com/slope-calculator/ | Calc site | Slope Calculator | ~400 |
| 5 | firgelliauto.com/blogs/engineering-calculators/slope-grade-calculator-rise-over-run | Actuator maker blog | Slope Grade Calculator — Rise Over Run | 1,500–1,700 |
| 6 | 1728.org/gradient.htm | Old calc site | The Slope of a Road (gradient, grade, pitch…) | 1,000–1,200 |

**What this tells us:**
- **Pearson is the best conversion benchmark:**
  - It converts between rise & run, percent grade, angle and "1 in N" in any direction.
  - It shows steps, a triangle and a steepness gauge.
  - It has 4 worked examples, all correct, and 6 FAQs, including "10 % ≠ 10°" and "45° = 100 %".
  - Weak points: no x/12 roof pitch, no feet-and-inches input, no cited sources.
- **Omni's "rise over run" page is two-point only.** It has no percent formula shown, no ratio, no pitch and no presets.
- **No page offers construction presets with cited rules.**
  - Firgelli mentions ADA, IBC and MUTCD in the text, but the calculator has no presets.
  - Pearson and 1728.org state 1:12 without a source.
- **Nobody solves "any two → third"** (e.g. a run of 20 ft at 2 % gives the rise), and nobody offers **feet + inches**. This is the most common real-world ramp or drain question.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Omni | Inch rise→% | Pearson | DQYDJ | Firgelli | 1728.org |
|---|---|---|---|---|---|---|
| Rise + run → slope | ✅ (via points) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Two points (x₁, y₁, x₂, y₂) | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| y = mx + b / distance | ✅ intercept, distance | ❌ | ❌ | ✅ | ❌ | ❌ |
| Percent grade | ✅ (formula not shown) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Angle (degrees) | ✅ | ❌ (separate page) | ✅ | ✅ | ✅ | ✅ |
| Ratio 1:N | ❌ | ❌ | ✅ | ⚠️ fraction | ✅ | ✅ |
| **Roof pitch x/12** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ (text only) |
| Any form → all forms | ❌ | ❌ | ✅ | ✅ (angle mode) | ⚠️ angle | ✅ |
| **Solve rise from run + grade** (any two → third) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Slope length vs horizontal run | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Feet + inches input | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Inches per foot (drain fall) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Presets with rule cited (ramp, drain, roof, driveway) | ❌ | ❌ | ⚠️ (numbers only) | ❌ | ⚠️ (text, no section numbers) | ❌ |
| Pass/fail against a limit | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Negative (downhill) slope | ✅ | ❌ | ✅ | ✅ | ? | ? |
| Steps / diagram | ⚠️ | ❌ | ✅ steps, triangle, gauge | ❌ | ✅ visualizer | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Omni | Inch | Pearson | DQYDJ | Firgelli | 1728 |
|---|---|---|---|---|---|---|
| Formulas | ⚠️ (no % formula) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Worked examples (checked) | ✅ 2 | ✅ 1 | ✅ 4 | ✅ 1 | ✅ 2 (ramp 288 in → 8.33 %) | ✅ road 2.5 % |
| % vs ° confusion explained | ❌ | ❌ | ✅ | ❌ | ⚠️ | ✅ |
| Building/road standards cited | ❌ | ❌ | ❌ | ❌ | ⚠️ (named only) | ❌ |
| Rate-of-change (maths) section | ⚠️ | ❌ | ❌ | ⚠️ | ❌ | ❌ |
| FAQ count | 4 | 0 | 6 | 0 | 6 (one contradicts the tool) | 0 |
| Named author | ✅ + reviewers | ✅ + MS reviewer | ❌ | ✅ | ✅ | ❌ |
| Date | ❌ | ❌ | ❌ | ❌ | ✅ Feb 2026 | ❌ (© 2000) |

---

## 4. Competitor-by-competitor detail

### 1. Omni: Rise Over Run Calculator (Álvaro Díez; reviewers Czernia PhD, Bowater)
- **Inputs:** two points.
- **Outputs:** rise, run, slope and % grade. "Show more" adds the intercept, angle and distance.
- **Examples:** (1,2)→(4,8) gives slope 2 ✔. (2,3)→(4,7) gives slope 2 ✔.
- **FAQs (4):** slope of two points · reading rise over run on a graph · finding slope · rise over run for stairs.
- **Weak points:**
  - The % formula and the angle calculation are not shown.
  - No ratio or pitch.
  - No presets.
  - Off-topic filler and the typo "run over rise formula".
  - No date.

### 2. Inch Calculator: Rise Over Run to Percent (Joe Sexton; reviewer Bailey Nelson MS)
- **Inputs:** rise and run. Users must convert units themselves.
- **Example:** 5 ft / 15 ft = 33.33 % ✔.
- **Weak points:**
  - About 230 words.
  - No ramp or drain guidance.
  - No FAQ.
  - The topic is spread across several sibling pages.

### 3. Pearson: Slope Percentage Calculator (conversion benchmark)
- **Modes:** rise & run · % · angle (−90° to 90°) · 1 in N.
- **Options:** steps, triangle, gauge, rounding.
- **Presets (5):** 5/100, −3/60, 12 %, 30°, 1 in 12.
- **Examples (all ✔):**
  - 5 % = 2.86° = 1 in 20
  - 12 % = 6.84° = 1 in 8.33
  - 30° = 57.7 % = 1 in 1.73
  - 1 in 12 = 8.33 % = 4.76°
- **FAQs (6):** 10 % vs 10° · 45° vs 45 % · what 1 in N means · run = 0 · what counts as steep · why grade explodes near vertical.
  - The ADA 1:12 figure and the highway 6–8 % figure are not sourced.
- **Weak points:**
  - No author or date.
  - Edge cases (N = 0, ±90°) are not covered.
  - Off-topic related links.

### 4. DQYDJ: Slope Calculator (PK)
- **Modes:** two points (slope, y = mx + b, distance) · rise & run · angle (degrees or radians).
- **Outputs:** decimal, simplified fraction, angle and %.
- **Example:** (2,3)→(8,15) gives slope 2, 63.43°, 200 % ✔. The equation y = 2x − 1 and the distance are not shown in the example.
- **Weak points:**
  - Grade figures (highway 6 %, driveway 15–20 %) are not sourced.
  - No FAQ or date.
  - Duplicated H1.

### 5. Firgelli: Slope Grade Calculator (Robbie Dickson, Feb 2026)
- **Inputs:** rise, run or angle.
- **Outputs:** ratio, % and angle. The visualizer shows 10/100 → 10 %, 5.7°, 1:10 ✔.
- **Examples:** 5/100 → 5 %, 2.86°, 1:20 ✔. A wheelchair ramp of 24 in over 288 in gives 8.33 %, 4.76° ✔. The example does not mention landings or the rise limit per run.
- **Errors:**
  - An FAQ says one measurement can't give a slope, while the tool accepts an angle on its own.
  - Many grade figures are unsourced (rail, vehicle ramps, egress, drainage ±0.1 %).
  - ADA, IBC and MUTCD are named without sections.

### 6. 1728.org: Gradient / Slope of a Road
- **Modes:** ratio, angle or grade. Run can be horizontal or slope length, and the page computes the true horizontal run.
- **Example:** a road rising 396 ft over 15,840 ft gives 2.5 %, 1.432° ✔. Slope length is 15,844.95 ft ✔.
- **Content:** explains why the map vs odometer difference only matters above about 10°.
- **Weak points:**
  - Ramp 1:12 and 1:18 are not sourced.
  - Roof pitch is discussed but not output.
  - Dated (© 2000), with old browser notes.

---

## 5. Patterns

- **Maths:**
  - slope m = rise ÷ run
  - % = 100 m
  - θ = atan(m)
  - 1:N with N = run ÷ rise
  - pitch = 12 m (x in 12)
  - in/ft = 12 m
  - slope length = √(rise² + run²)
  - two points: m = (y₂ − y₁)/(x₂ − x₁), b = y₁ − m x₁
  - distance = √(Δx² + Δy²)
  - average rate of change over [a, b] = (f(b) − f(a))/(b − a)
- **Any two → third:**
  - given run and % → rise = run × %/100
  - given rise and limit → minimum run
- **Presets: verify each one before shipping. `TODO(owner)`: approve the sources and editions.**

| Preset | Rule (to cite) | Proposed source to verify |
|---|---|---|
| Accessible ramp | max 1:12 (8.33 %) running slope; max 30 in rise per run | 2010 ADA Standards §405.2 / §405.6 |
| Accessible route cross slope | max 1:48 (2.08 %) | 2010 ADA Standards §403.3 |
| Drain / waste pipe | ¼ in per ft (2.08 %) for small diameters | IPC/UPC Table (e.g. IPC 704.1). Check the edition |
| Roof pitch | x/12 reference (e.g. 4/12 = 18.43°) | geometry; materials minimums from the manufacturer only |
| Driveway / road | no single legal rule; show as user limit | local code note only |

- **Pass/fail:** compare the computed slope against the preset limit and show by how much it passes or fails. Add a note: "check your local code".

| Section | Pages (of 6) |
|---|:---:|
| % grade | 6 |
| Angle | 5 |
| Ratio | 3 |
| Two-point | 2 |
| Pitch x/12 | **0** |
| Any two → third | **0** |
| Ft-in input | **0** |
| Cited presets | **0** |

---

## 6. FAQ question bank

★ = asked on 2 or more pages, or a cluster keyword. Map to: rise over run, finding slope from a table, difference quotient calculator, how to find rate of change, rate of change equation, rate of change formula, average rate of change formula.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is rise over run? / How do you find slope? | Omni, DQYDJ, Firgelli |
| 2 | ★ How do you convert slope to a percentage? | Inch, Pearson, Firgelli, 1728 |
| 3 | ★ Is a 10 % slope the same as 10°? | Pearson, 1728 |
| 4 | ★ What is the maximum slope for a wheelchair ramp? | Pearson, Firgelli, 1728 (all unsourced) |
| 5 | ★ How do you find slope from two points or a table? | Omni, DQYDJ · `finding slope from a table` |
| 6 | What is the rate of change formula? | `rate of change formula` |
| 7 | What is the average rate of change formula? | `average rate of change formula` |
| 8 | How do you convert slope to roof pitch (x/12)? | — (gap) |
| 9 | How much fall does a drain pipe need per foot? | — (gap) |
| 10 | What does 1:12 mean? | Pearson |
| 11 | What is a steep driveway or road grade? | DQYDJ, Pearson (unsourced) |
| 12 | What is a difference quotient? | `difference quotient calculator` (FAQ only) |

---

## 7. Gaps nobody fills: our opportunities

1. **All forms in one place, converting any direction:**
   - rise/run, %, degrees, 1:N, x/12 pitch, inches per foot
   - **any two values → the rest** (e.g. run + % → rise)
2. **Feet + inches** and metric for rise and run, with results in ft-in to 1/16".
3. **Construction presets with cited rules** and a pass/fail check: ADA ramp, cross slope, drain pipe, roof pitch. Driveways get a user-set limit.
4. **Ramp planner:** total rise → minimum run, plus the number of runs and landings needed (if the 30 in rule is approved).
5. **Two-point / table mode** for the maths searches: slope, y = mx + b, distance and the average rate of change.
6. **Slope length vs horizontal run**, with an explanation (1728.org has this, nobody else).
7. **A clear "% vs °" explainer** and a visual triangle.
8. **Correct, consistent examples.** We avoid Firgelli's contradictory FAQ.
9. **Links:** Pythagorean (#9), Roof Pitch / Rafter (Batch 1), Concrete (Batch 2), Stair calculator (if built).

---

## 8. Blueprint for the KKCTools Slope Calculator

### 8.1 SEO

- **URL:** `/slope-calculator/`
- **Title:** Slope Calculator – Rise over Run, Percent & Angle
- **H1:** Slope Calculator: Rise over Run as Percent, Ratio and Angle
- **Meta:** as in the keyword file (143 chars).
- **H2s:** rise over run · rate of change formula · average rate of change · slope from a table / two points.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Inputs | Any two of: rise, run, slope length, %, degrees, 1:N, x/12, in/ft (ft-in or metric) |
| Outputs | All forms, slope length, steps, triangle SVG |
| Presets | ADA ramp, cross slope, drain pipe, roof pitch, custom limit → pass/fail (sources cited) |
| Ramp planner | Total rise → min run, segments, landings (if approved) |
| Two-point | x₁, y₁, x₂, y₂ or table → m, b, distance, rate of change |
| UX | Share URL, copy, no network |

### 8.3 Content outline (≈ 1,400–1,700 words, original)

1. Intro (primary keyword)
2. How to use
3. Rise over run explained, with an example
4. Converting slope: percent, degrees, ratio, pitch (table)
5. Percent vs degrees: a common mistake
6. Building slopes: ramps, drains, roofs, driveways (with cited rules and a "check local code" note)
7. Planning an accessible ramp, with an example
8. Slope from two points or a table (y = mx + b)
9. Rate of change and average rate of change
10. FAQ (10–12)
11. Related tools: Pythagorean (#9), Roof Pitch / Rafter (Batch 1), Concrete (Batch 2)

### 8.4 Quality checks

- **Unit tests:**
  - every conversion pair
  - any-two solver
  - ft-in parser
  - pass/fail logic
  - two-point maths
  - edge cases: run = 0 → vertical; negative slopes
- **Fixtures:** 1 in 12 = 8.333 % = 4.764°; ¼ in/ft = 2.083 %; 4/12 = 18.435°.
- Presets live in a static data file with source and edition fields. No network calls.
- No competitor wording. `npm run check:no-network` passes.
- `TODO(owner)`: pull Google top 10; **approve preset sources** (ADA 2010 §405, IPC/UPC drain slope edition).
