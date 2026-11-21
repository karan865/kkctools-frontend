# Pythagorean Theorem / Right Triangle Calculator — Competitor Analysis

> **Target page:** KKCTools `/pythagorean-theorem-calculator/` (Batch 5, Tool #9 🟡)
> **Primary keyword:** `pythagoras equation solver` — US 22,200 · KD 25 · rising. Cluster: 2 keywords, 25,100 US vol.
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 5. Competitors come from live web searches run on 2026-11-14:
> - `pythagorean theorem calculator right triangle find missing side`
> - `3-4-5 rule square corner calculator diagonal layout`
>
> `TODO(owner): pull Google top 10 for "pythagoras equation solver".`
> **Pages visited (2026-11-14):** 6 read. Omni, Pearson, CalculatorSoup, Calculate.co.nz, Inch Calculator (Pythagorean), and Inch Calculator (Squaring) for the construction angle.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Education sites: Pearson, PlanetCalc, basic-mathematics, eMathHelp, MathCheck, coddy.
  - Calculator giants: Omni, CalculatorSoup, Inch.
  - Calculate.co.nz.
  - Many clones.
- **Construction angle (keyword file):** squaring a slab, deck or wall with 3-4-5. We researched it separately.
  - Inch has a separate "Squaring Calculator".
  - Other pages found: a flooring-tile guide, a carpentry blog, a fence-layout tool and MiniWebtool's squareness checker.
  - **No Pythagorean calculator page combines the maths with the site-layout use.**
- Arithmetic was re-checked. Errors found on Omni (FAQ sum) and Inch (inverse formula), see §4.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | omnicalculator.com/math/pythagorean-theorem | Giant | Pythagorean Theorem Calculator | 900–1,000 |
| 2 | pearson.com/channels/calculators/pythagorean-theorem-calculator | Education publisher | Pythagorean Theorem Calculator | ~700 |
| 3 | calculatorsoup.com/calculators/geometry-plane/pythagorean-theorem.php | Calc giant | Pythagorean Theorem Calculator | ~450 |
| 4 | calculate.co.nz/pythagorean-theorem-calculator.php | NZ calc site | Pythagorean Theorem Calculator | ~500 |
| 5 | inchcalculator.com/pythagorean-theorem-calculator/ | Calc site | Pythagorean Theorem Calculator – Steps to Solve | ~600 |
| 6 | inchcalculator.com/squaring-calculator/ | Calc site (construction) | Squaring Calculator – Check Square Diagonal | 350–400 |

**What this tells us:**
- **Pearson is the maths benchmark.**
  - 3 modes: hypotenuse, missing leg, right-triangle check.
  - Exact simplified radicals (√45 = 3√5).
  - A live diagram, triple quick-picks (3-4-5, 5-12-13, 8-15-17, 7-24-25), steps, and 6 FAQs.
  - Weak spots: no angles, area, error handling or author.
- **Angles are missing from every page.** None of the Pythagorean pages gives the angles. Omni points to a separate right-triangle calculator. Only CalculatorSoup and Inch give the area.
- **Feet + inches input and fractional-inch output appear nowhere.** That includes Inch Calculator, despite its name.
- **The construction "is it square?" check** (3-4-5 multiples, full-rectangle diagonal, tolerance) is only on Inch's separate Squaring page. That page uses one unit only, has no tolerance and no feet-and-inches.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Omni | Pearson | CalcSoup | Calc.co.nz | Inch Pyth. | Inch Squaring |
|---|---|---|---|---|---|---|
| Any 2 sides → third | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ (diagonal only) |
| Check if a right triangle (3 sides) | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Angles (α, β) | ❌ (separate tool) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Area / perimeter | ✅ (checkbox) | ❌ | ✅ area | ❌ | ✅ area | ❌ |
| Altitude to hypotenuse | ❌ | ❌ | ❌ | ❌ | ⚠️ (**formula wrong**) | ❌ |
| One side + one angle | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Exact radical form | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Units | ✅ (default cm) | ✅ none/cm/m/in/ft | ✅ 9 units | ❌ | ❌ | ✅ in/ft/cm/m |
| **Feet + inches input / fraction output** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Significant figures / precision | ❌ | ✅ (exact / 2 / 3 dp) | ✅ | ❌ | ❌ | ❌ |
| Steps shown | ✅ | ✅ | ⚠️ (claimed) | ⚠️ formulas | ⚠️ (one mode full) | ❌ |
| Diagram | ❌ | ✅ live | ❌ | ❌ | ❌ | ❌ |
| Triples list / quick picks | ❌ | ✅ | ⚠️ (3-4-5) | ⚠️ | ⚠️ | ✅ multiples |
| Error: leg ≥ hypotenuse | ❌ | ❌ | ❌ | ⚠️ (described) | ❌ | n/a |
| **Squaring check (L × W → diagonal, 3-4-5 scaled)** | ❌ | ❌ | ❌ | ⚠️ (claimed, no method) | ❌ | ✅ |
| Tolerance / "diagonals differ by X" | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Omni | Pearson | CalcSoup | Calc.co.nz | Inch Pyth. | Inch Sq. |
|---|---|---|---|---|---|---|
| Worked examples (checked) | ⚠️ (FAQ: 49 + 81 written as **150**) | ✅ 3 | ✅ 1 | ✅ 1 (repeated) | ✅ 1 | ✅ 30×40 → 50 |
| Real-life uses (ladder, TV, construction) | ✅ ladder | ❌ | ❌ | ⚠️ | ❌ | ✅ |
| Law of cosines (for non-right triangles) | ❌ | ⚠️ scope FAQ | ❌ | ❌ | ❌ | ❌ |
| FAQ count | 2 | 6 | 0 | 3 | 0 | 0 |
| Named author | ✅ + 3 reviewers | ❌ | ✅ | ⚠️ (reviewer cites tax sources) | ✅ + teacher reviewer | ✅ |
| Date | ❌ | ❌ | ✅ Oct 2026 | ✅ Nov 2026 | ❌ | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. Omni — Pythagorean Theorem Calculator (Piotr Małek, Mateusz Mucha; three reviewers)
- **Inputs:** sides a, b, c (any two). Optional area and perimeter. Units are selectable (default cm).
- **Content:** a 3-4-5 ladder example and a manual solve (a = 4, c = 8.94 → b ≈ 8; rounding not mentioned).
- **Error:** FAQ "legs 7 and 9" says "49 + 81 = c², c² = **150**". The correct sum is **130**. The final answer, 11.40, is right.
- **Weak points:** no angles, no exact radicals, no diagram, no triples, no construction use, no date.

### 2. Pearson — Pythagorean Theorem Calculator (benchmark)
- **Modes:** hypotenuse, missing leg, check.
- **Inputs:** units none/cm/m/in/ft; output as exact, 2 dp or 3 dp.
- **Features:** live diagram and a square-area visual; quick picks for triples.
- **Examples:** 3,4 → 5 ✔; c 10, a 6 → 8 ✔; 8-15-17 is a right triangle ✔.
- **FAQs (6):**
  1. The theorem
  2. Which side is the hypotenuse
  3. Finding a missing leg
  4. Checking a triangle
  5. Exact radicals
  6. Right triangles only
- **Weak points:**
  - No error handling for invalid inputs.
  - No failing example in check mode.
  - No angles or area.
  - No author or date.

### 3. CalculatorSoup — Pythagorean Theorem (Edward Furey, Oct 2026)
- **Solve for:** a, b, c or area. 9 units; significant figures from auto to 9.
- **Example:** 3-4-5 ✔.
- **Weak points:**
  - Only a and b fields appear on screen.
  - Steps are claimed but not visible.
  - No FAQ.
  - Area units are not stated.
  - References are dated 2020.

### 4. Calculate.co.nz — Pythagorean Theorem (reviewed Nov 2026)
- **Inputs:** three fields; fill in two.
- **Output:** the missing side only. No units.
- **Claims** to help check that a corner is "truly square", but gives no method.
- **FAQs (3):** the theorem · hypotenuse · shorter side.

### 5. Inch Calculator — Pythagorean Theorem (Joe Sexton; reviewed by Zachary Boeder, former maths teacher)
- **Solve for:** a, b, c or area. Steps are complete for leg a only.
- **Error:** the inverse-altitude section gives "c = ab/h". The correct relation is **h = ab/c**.
- **Weak points:** no units, no FAQ, no construction 3-4-5 use, no date.

### 6. Inch Calculator — Squaring Calculator (construction)
- **Inputs:** L and W, with units in/ft/cm/m.
- **Output:** the diagonal.
- **3-4-5 multiples:** 6-8-10, 9-12-15, 12-16-20 ✔. Example: 30 × 40 → 50 ft ✔.
- **Weak points:**
  - No tolerance; it says diagonals must be "exactly" equal.
  - No feet-and-inches input or fraction output.
  - No FAQ.

---

## 5. Patterns

- **Core formulas:**
  - c = √(a² + b²)
  - a = √(c² − b²), which requires c > b
  - Area = ab/2
  - Perimeter = a + b + c
  - Altitude to the hypotenuse: h = ab/c
- **Angles:** α = atan(a/b), β = 90° − α.
- **One side + one angle:** a = c·sin α, b = c·cos α.
- **Exact form:** simplify √n into k√m.
- **Check mode:**
  - Sort the sides, then test a² + b² = c² within a tolerance ε for decimals.
  - Otherwise, say whether the triangle is acute (a² + b² > c²) or obtuse (a² + b² < c²).
  - Link to the law of cosines.
- **Construction:**
  - The diagonal for L × W is √(L² + W²). Show it in ft-in-fractions to 1/16".
  - Scale 3-4-5 to the size of the job: the largest multiple that fits the shorter side.
  - **Diagonal difference:** if the two measured diagonals differ, report how far out of square the layout is.
    - Example offset: Δ/2 along the diagonal (approximate).
    - `TODO(owner)`: confirm the wording. Avoid presenting a "tolerance standard" unless it has a source.

| Section | Pages (of 6) |
|---|:---:|
| Missing side | 6 |
| Check mode | 1 |
| Angles | **0** |
| Exact radicals | 1 |
| Units | 4 |
| Ft + in / fractions | **0** |
| Diagram | 1 |
| Construction squaring | 1 (separate page) |

---

## 6. FAQ question bank

★ = asked on 2 or more pages, or is a cluster keyword. Map to: pythagoras equation solver, pythagorean equation solver.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is the Pythagorean theorem (a² + b² = c²)? | Pearson, Calc.co.nz, Omni |
| 2 | ★ How do I find the hypotenuse? | Pearson, Calc.co.nz, Omni FAQ |
| 3 | ★ How do I find a missing leg? | Pearson, Calc.co.nz |
| 4 | ★ How do I check whether a triangle is a right triangle? | Pearson |
| 5 | ★ What are Pythagorean triples (3-4-5, 5-12-13)? | Pearson, Inch, Inch Squaring |
| 6 | How do I use 3-4-5 to square a corner (slab, deck, wall)? | Inch Squaring, Calc.co.nz (claim) |
| 7 | What diagonal should a rectangle of L × W have? | Inch Squaring |
| 8 | Does the theorem work for non-right triangles? (law of cosines) | Pearson |
| 9 | How do I find the angles of a right triangle? | — (gap) |
| 10 | What is the diagonal of an isosceles right triangle (or a square)? | Omni FAQ |
| 11 | How do I give the answer in exact radical form? | Pearson |

---

## 7. Gaps nobody fills — our opportunities

1. **Full right-triangle solver in one place:**
   - any 2 sides → third side, plus both angles, area, perimeter and altitude
   - side + angle mode
2. **Check mode** that names the triangle type (right, acute, obtuse) and links to the law of cosines.
3. **Exact radicals + decimals + steps**, with substitution shown.
4. **Feet + inches input and output to 1/16"**, plus metric (our construction edge).
5. **"Is it square?" mode:**
   - L × W → target diagonal
   - a scaled 3-4-5 suggestion
   - two measured diagonals → out-of-square amount
6. **Labelled, theme-aware SVG triangle** with the unknown side highlighted.
7. **Error handling:** leg ≥ hypotenuse, zero, negative.
8. **Correct examples** (Omni's FAQ and Inch's formula errors are listed above).
9. **Internal links from Rafter, Stud and Concrete pages** (keyword file note: KD 25 needs links). Link out to Slope (#10) and Roof Pitch.

---

## 8. Blueprint for the KKCTools Pythagorean Theorem Calculator

### 8.1 SEO

- **URL:** `/pythagorean-theorem-calculator/`
- **Title:** Pythagorean Theorem Calculator – Right Triangles
- **H1:** Pythagorean Theorem Calculator: Find Any Side of a Right Triangle
- **Meta:** as in the keyword file (147 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Modes | Two sides → solve · Side + angle → solve · Check 3 sides · Is it square? (L × W, measured diagonals) |
| Outputs | Missing side (exact + decimal), α, β, area, perimeter, altitude, steps |
| Units | ft + in (fractions to 1/16), in, ft, yd, mm, cm, m |
| Visual | SVG triangle (theme aware), highlighted unknown |
| Errors | Leg ≥ hypotenuse, ≤ 0, non-numeric |
| UX | Precision selector, share URL, no network |

### 8.3 Content outline (≈ 1,200–1,500 words, original)

1. Intro (primary keyword) with a diagram
2. How to use
3. The Pythagorean theorem explained
4. Finding the hypotenuse — example
5. Finding a missing leg — example
6. Angles and area of a right triangle
7. Pythagorean triples
8. Squaring a corner with 3-4-5 (slab, deck, wall) — example in ft-in
9. Is it a right triangle? (and when to use the law of cosines)
10. FAQ (10)
11. Related tools: Slope (#10), Rafter / Roof Pitch (Batch 1), Concrete (Batch 2), Stud (Batch 1)

### 8.4 Quality checks

- **Unit tests:**
  - all modes
  - radical simplification
  - ft-in parser and formatter
  - angle maths
  - check-mode classification with a tolerance
  - squaring mode
- **Fixtures:** 7, 9 → √130 = 11.40; h = ab/c.
- No competitor wording copied. `npm run check:no-network` passes.
- `TODO(owner)`: pull Google top 10; approve the wording for the out-of-square explanation.
