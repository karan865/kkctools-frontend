# Degrees ↔ Radians Converter — Competitor Analysis

> **Target page:** KKCTools `/degrees-to-radians/` (Batch 8, Tool #31 ✅, Tier 3)
> **Primary keyword:** `radians to degrees formula` — US 4,400 · KD 6.
> - Secondary: `how to convert degree to rad` (9,900 / KD 11; declining).
> - Cluster: 2 keywords, 14,300 US searches, all on KD ≤ 15.
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 8. Competitors come from a live web search on 2026-11-14 for `radians to degrees formula converter`, plus the known reference sites CalculatorSoup and Math is Fun.
> - Other results seen but not audited: calculate.co.nz, Pearson, lucidar, sengpielaudio, Ashampoo (Excel DEGREES doc), dadsworksheets, awajis, calcitfast, mathda, conversionvibes, onunitconverter.
> - `TODO(owner): pull Google top 10 for "radians to degrees formula" and "degrees to radians".`
> **Pages visited (2026-11-14):** 5 read: Inch (radians to degrees), Omni (radians to degrees), CalculatorSoup (angle conversion), Bhanzu (radians to degrees article), Math is Fun (radians).

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Calculator sites: Inch, Omni, CalculatorSoup.
  - **Tutoring and education brands:** Bhanzu, Pearson, Math is Fun.
  - Generic converter farms.
  - Software help pages: Ashampoo, for the spreadsheet `DEGREES()` function.
- **The maths:**
  - degrees = radians × 180/π.
  - radians = degrees × π/180.
  - 1 rad = 180/π ≈ **57.29577951°**; 1° = π/180 ≈ **0.01745329252 rad**.
- **The keyword file requires:**
  1. **both directions**
  2. **the answer in terms of π** (e.g. 135° = 3π/4)
  3. a **chart of common angles**
  4. **step-by-step working**
  - Only Inch accepts π input, and **no competitor reduces a degree input to a simplified π fraction** with steps.
- **Errors found (re-checked by us):**
  - **Omni:**
    - "6.283 rad = 360°" is wrong: 6.283 × 57.29578 = **359.98°**. Only 2π = 360° exactly.
    - "3.14159 rad = 180°" should be "≈".
    - A typo: "convert degrees into degrees".
  - **Inch:**
    - It says "**360 days in the Persian calendar year**" (wrong; about 365).
    - A broken "#idx_how_calculator_works" anchor.
    - A duplicated worked-example line.
    - "2 rad = 360/π" with no degree unit.
    - Its table and π handling are ✔.
  - **Bhanzu:**
    - It promises a "unit circle chart" that isn't on the page.
    - It says "the first five rows" cover the first quadrant; it is seven.
    - It claims calculator rounding yields "149.999…°", which is misleading.
    - Unsourced student-performance statistics; heavy demo-booking promotion.
    - Its 25-row table is ✔.
  - **CalculatorSoup:**
    - "1 degrees".
    - The "sign" unit is in the dropdown but missing from the tables.
    - Inconsistent rounding.
    - Its factors are ✔.
  - **Math is Fun:** no converter; animation scripts show as raw text in the capture; good small-angle content.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | inchcalculator.com/convert/radian-to-degree/ | Calc site | Radians to Degrees Converter (rad to °) | ~1,000 |
| 2 | omnicalculator.com/conversion/radians-to-degrees | Calc site | Radians to Degrees Converter | 400–450 |
| 3 | calculatorsoup.com/calculators/conversions/angle.php | Calc site | Angle Conversion Calculator | 700–800 |
| 4 | bhanzu.com/math/geometry/radians-to-degrees | Tutoring brand article | Radians to Degrees — Conversion Table and Formula | 1,400–1,600 |
| 5 | mathsisfun.com/geometry/radians.html | Education reference | Radians | 500–600 |

**What this tells us:**
- **Inch is the tool benchmark:**
  - accepts **decimals, fractions and π expressions** ("π/2")
  - outputs **decimal degrees, DMS and the π form**
  - an 11-row table (✔), and an author plus PhD reviewer
  - **Weak points:** no FAQ, a factual slip, and a broken anchor.
- **Omni** is a basic two-way converter with 3 examples and 2 FAQs, and **one wrong example**.
- **CalculatorSoup** covers **many angle units** (gon, revolution, mil, octant, sextant, quadrant, arcmin, arcsec) with solution steps. It has no common-angle chart and no π output.
- **Bhanzu** has the best teaching content: derivation, why calculus uses radians, a 25-row table ✔, 7 FAQs and practice problems.
  - It has errors, a missing chart and heavy promotion.
- **Math is Fun** has the clearest definition and visuals (an animated radian), plus small-angle approximations. There is no converter.
- **No page offers all of these:**
  1. two-way conversion with **π-expression input** (π/6, 3π/4, 2.5π, "pi/3") **and** **simplified π-fraction output** (e.g. 135° → 3π/4, 100° → 5π/9)
  2. **step-by-step working** for the user's own number, including the fraction-reduction step
  3. an **SVG unit-circle chart** (our own drawing) of the common angles, plus a 0–360° table (every 15° and the 30/45/60 families)
  4. DMS input/output and **negative and > 360° angles** (with the coterminal angle in [0°, 360°))
  5. other units (gradians, turns, arcmin, arcsec), one click away
  6. a spreadsheet and code formulas section (`RADIANS()`, `DEGREES()`, JS/Python)
  7. an FAQ, an author and correct examples throughout

---

## 2. Feature matrix — tool

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Inch | Omni | CalculatorSoup | Bhanzu | Math is Fun |
|---|---|---|---|---|---|
| rad → deg | ✅ | ✅ | ✅ | ❌ (article) | ❌ |
| deg → rad | ✅ (separate page) | ✅ | ✅ | ❌ | ❌ |
| π input ("π/2") | ✅ | ❌ | ❌ | — | — |
| π-fraction output | ⚠️ (360/π form) | ❌ | ❌ | ✅ (table) | ✅ (table) |
| Simplified fraction for any degree value | ❌ | ❌ | ❌ | ❌ | ❌ |
| Steps for the user's number | ⚠️ (example) | ⚠️ (FAQ) | ✅ | ❌ | ❌ |
| DMS | ✅ (output) | ❌ | ⚠️ (separate units) | ❌ | ❌ |
| Other units (grad, turn, mil) | ⚠️ (links) | ✅ | ✅ | ❌ | ❌ |
| Common-angle table | ✅ (11) | ❌ | ❌ | ✅ (25) | ✅ (7) |
| Unit-circle diagram | ❌ | ❌ | ❌ | ❌ (**promised**) | ✅ |
| Negative / > 360° (coterminal) | ? | ? | ? | ⚠️ (practice) | ❌ |
| Spreadsheet / code formulas | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Inch | Omni | CalculatorSoup | Bhanzu | Math is Fun |
|---|---|---|---|---|---|
| Formula correct | ✅ | ✅ | ✅ | ✅ | ✅ |
| Examples all correct | ✅ | ❌ (**6.283 → 360**) | ✅ | ⚠️ (misleading rounding claim) | ✅ |
| Factual slips | ❌ (**Persian calendar**) | typo | "1 degrees" | "five rows" | — |
| Why radians matter (arc length, calculus) | ⚠️ | ❌ | ❌ | ✅ | ⚠️ |
| FAQ | ❌ | 2 | ❌ | 7 | ❌ |
| Author / reviewer | ✅ (+ PhD) | ✅ | ✅ | ⚠️ (no maths credentials) | ❌ |
| Promotion | — | — | — | **heavy** | ads |

---

## 4. Competitor-by-competitor detail

### 1. Inch Calculator: Radians to Degrees (Joe Sexton; reviewer Ethan Dederick, PhD)
- **Features:** decimal, fraction and π input → decimal degrees, DMS and π form; an 11-row table ✔; share/cite.
- **Errors:**
  - "360 days in the Persian calendar year".
  - A broken anchor.
  - A repeated step.
  - "360/π" with no unit.
- **Weak points:** no FAQ; the reverse direction is on another page.

### 2. Omni: Radians to Degrees (Mariamy Chrdileli; reviewer Julia Żuławińska)
- **Features:** two-way conversion, other units, 3 examples, 2 FAQs.
- **Errors:**
  - **6.283 rad = 360°** (it is 359.98°).
  - "=" where "≈" is needed for 3.14159.
  - "Degrees into degrees".
- **Weak points:** no π output, no chart.

### 3. CalculatorSoup: Angle Conversion
- **Features:** 12+ units, solution steps, worked examples (5 rad ✔), factor tables ✔.
- **Errors:** "1 degrees"; "sign" missing from the tables; inconsistent rounding.
- **Weak points:** no π form, no common-angle chart, no FAQ.

### 4. Bhanzu: Radians to Degrees (Madhukar V, 30 Sep 2026)
- **Content:** formula, derivation, the calculus note, a **25-row table ✔**, worked examples, 7 FAQs, practice problems ✔.
- **Errors:**
  - The promised unit-circle chart is missing.
  - "First five rows" (it is seven).
  - The misleading rounding claim.
  - Unsourced statistics.
  - Inconsistent grade labels.
- **Weak points:** heavy demo CTAs and a sticky ad.

### 5. Math is Fun: Radians
- **Content:** definition, an animated radian (scripts in capture), a 7-angle table ✔, small-angle approximations (tan 0.01 ≈ 0.57° ✔).
- **Weak points:** no converter; a repeated definition; no negative or > 360° angles.

---

## 5. Patterns

**Parsing**
- Accept: `135`, `135°`, `135 deg`, `2.356`, `3π/4`, `3pi/4`, `0.75π`, `-π/6`, `2.5 rad`, and DMS `135°30'15"`.
- Evaluate π expressions safely with our own small parser, **never `eval`**.

**Degrees → radians**
- **Exact form:** reduce deg/180 with the GCD.
  - Examples: 135/180 = 3/4 → **3π/4**; 100/180 = 5/9 → **5π/9**; 1/180 → π/180.
  - For non-integer degrees (e.g. 22.5° = 45/2 → π/8), use a rational approximation with a bounded denominator. Fall back to decimal only.
- **Decimal:** deg × π/180 (show 6 dp plus full precision on request).
- **Steps:** (1) multiply by π/180, (2) simplify the fraction, (3) show the decimal.

**Radians → degrees**
- rad × 180/π. When the input is a π expression, show the exact result (e.g. 3π/4 → 135° exactly).
- Steps shown.

**Extras**
- Coterminal angle in [0, 360) and in (−180, 180].
- Quadrant.
- Reference angle.
- DMS output.
- Gradians (× 10/9 from degrees), turns (÷ 360), arcmin, arcsec.

**Chart**
- An SVG unit circle with the 16 standard angles, labelled in degrees and π form.
- A table of every 15° from 0–360°, plus the 30/45/60 families with exact radian, decimal, sin, cos and tan.
- `TODO(owner)`: decide whether to include trig values. Exact forms like √2/2 require careful rendering.

**Formulas for spreadsheets and code**
- `=RADIANS(A1)` and `=DEGREES(A1)`.
- JS: `deg * Math.PI / 180`.
- Python: `math.radians()` / `math.degrees()`.

**Reference values (our arithmetic)**
- 1 rad = 57.2957795131°.
- 6.283 rad = 359.98°.
- 5 rad = 286.4789°.
- 0.45 rad = 25.783°.
- 100° = 5π/9 = 1.745329 rad.

**Coverage across the 5 competitors**

| Section | Pages (of 5) |
|---|:---:|
| Both directions on one page | 2–3 |
| π input | 1 |
| Simplified π output for any input | **0** |
| Steps for the user's input | 1 |
| Unit-circle diagram | 1 (no tool) |
| Coterminal / negative handling | **0** |
| Spreadsheet / code formulas | **0** |
| All examples correct | 3 |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is the formula to convert radians to degrees? | `radians to degrees formula`, all |
| 2 | ★ How do I convert degrees to radians? | `how to convert degree to rad`, all |
| 3 | ★ How many degrees is 1 radian? | Omni, Math is Fun, search summary |
| 4 | ★ What is 5 radians (or 2 radians) in degrees? | Omni, CalculatorSoup, Inch |
| 5 | What is a radian? | Math is Fun, Bhanzu |
| 6 | Why do mathematicians use radians? | Bhanzu, Math is Fun |
| 7 | How do I write 135° (or 100°) in terms of π? | gap |
| 8 | How do I convert in Excel or Google Sheets? | search summary (DEGREES) |
| 9 | What about negative angles or angles over 360°? | gap |
| 10 | What is a gradian? | CalculatorSoup |

---

## 7. Gaps nobody fills — our opportunities

1. **Simplified π-fraction output for any degree input**, with the reduction steps.
2. **π-expression input**, parsed safely.
3. **Step-by-step working for the user's own number** (keyword file requirement).
4. **An SVG unit circle and a full table**, delivering what Bhanzu promises but doesn't show.
5. **Coterminal, reference angle and quadrant** for negative and large angles.
6. **Spreadsheet and code formulas.**
7. **Every example correct** (Omni's 6.283 error), with "≈" used properly.
8. **Links:** Pythagorean (Batch 5 #9), Slope (Batch 5 #10), Metric Conversion (Batch 5 #20), Fraction to Decimal (#7), Roman Numerals (#6).

---

## 8. Blueprint for the KKCTools Degrees ↔ Radians Converter

### 8.1 SEO

- **URL:** `/degrees-to-radians/`
- **Title:** Degrees to Radians Converter – With Formula
- **H1:** Degrees to Radians: Convert Angles Both Ways
- **Meta:** as in the keyword file (153 chars).
- **H2s:**
  - "Radians to degrees formula"
  - "How to convert degrees to radians"
  - "Common angles chart (unit circle)"
  - "Angles in terms of π"
- **Schema:** `WebApplication` + `FAQPage`.

### 8.2 Tool spec

| Area | Spec |
|---|---|
| Input | One box; auto-detect unit (°, rad, π expression, DMS) + toggle |
| Output | Degrees (decimal + DMS), radians (exact π form + decimal), gradians, turns |
| Steps | Shown for each conversion |
| Extras | Coterminal, reference angle, quadrant |
| Chart | SVG unit circle + 0–360° table |
| UX | Swap, copy (plain and LaTeX-free text), share URL, no network |

### 8.3 Content outline (≈ 700–1,000 words, original)

1. Intro and converter
2. Radians to degrees formula (with derivation from 2π = 360°)
3. Degrees to radians, and writing the answer in terms of π
4. Worked examples (3 each way)
5. Common angles chart and unit circle
6. Negative angles and angles over 360°
7. Why radians are used (arc length s = rθ; calculus)
8. Spreadsheet and code formulas
9. FAQ (10)
10. Related tools

### 8.4 Quality checks

- **Unit tests:**
  - The parser (all input forms and invalid input).
  - Every 1° from −720 to 720: the exact fraction round-trips.
  - Non-integer degree approximations.
  - DMS round-trip.
  - Coterminal and quadrant.
  - Reference values (6.283 → 359.98).
- No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)`:** pull Google top 10; decide on the trig-values table.
