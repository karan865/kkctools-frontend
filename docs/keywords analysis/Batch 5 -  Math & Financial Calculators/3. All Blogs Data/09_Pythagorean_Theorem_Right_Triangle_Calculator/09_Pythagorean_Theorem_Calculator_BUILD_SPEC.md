# Pythagorean Theorem / Right Triangle Calculator — Build Spec

> **URL:** `/pythagorean-theorem-calculator/` · Batch 5 · Tier 2 · rank chance 🟡 · **Build order 12**
> **Read first:** `../00_BATCH5_BUILD_RULES.md`
> **Inputs used:** `09_Pythagorean_Theorem_Right_Triangle_Calculator_Competitor_Analysis.md` (6 pages read, incl. Inch's Squaring page, 2026-11-14), keyword file §2 #9
> **SERP:** provisional
> **Written:** 2026-11-22 (full rewrite after the research pass)

---

## 0. Strategy

- **Search volume:** `pythagoras equation solver` is **22,200 at KD 25, rising**. Together with a variant, ~25,000 searches.
- **KD 25 needs links.** Internal links come from the live **Rafter, Stud and Concrete** pages; external links from builder/DIY communities.
- **Who ranks:**
  - education sites (**Pearson** is the maths benchmark: 3 modes, exact radicals, a diagram, triples, 6 FAQs);
  - giants (Omni, CalculatorSoup, Inch);
  - Calculate.co.nz;
  - clones.
- **Gaps:**
  - **No Pythagorean page gives the angles.**
  - **No page takes feet + inches or outputs fractional inches.** That includes Inch Calculator.
  - The construction "is it square?" check exists only on Inch's **separate** Squaring page. That page uses one unit, has no tolerance and no ft-in.
- **Our edge:** a full right-triangle solver + a builder's squaring mode on one page.
- **Accuracy edge:** Omni's FAQ has a wrong sum; Inch's inverse formula is wrong.

## 1. Keywords and placement

| Role | Keyword | US vol | KD | Where it goes |
|---|---|---:|---:|---|
| **Primary** | pythagoras equation solver | 22,200 | 25 | First sentence ("This Pythagoras equation solver finds…"), H2 "The Pythagoras equation (a² + b² = c²)", FAQ |
| Secondary (irregular) | pythagorean equation solver | 2,900 | 29 | Natural mention in the intro |
| Natural | pythagorean theorem calculator · right triangle calculator · hypotenuse calculator · 3-4-5 rule · how to square a corner | — | — | Title, H1, Square tab, H2s |

## 2. Our edge (6 competitors checked)

| Feature | Competitors with it |
|---|---|
| Missing side (any two → third) | 6/6 |
| **Both angles, area, perimeter, altitude** | angles **0/6**; area 2/6 |
| Side + angle mode | 0 |
| Check mode: right / acute / obtuse, with a link to the law of cosines | 1/6 |
| Exact radicals (√45 = 3√5) + decimals + steps | 1/6 |
| **Feet + inches input, output to 1/16"**, plus metric | **0/6** |
| **"Is it square?"**: L × W → target diagonal; scaled 3-4-5 suggestion; two measured diagonals → out-of-square amount | 1 (separate page, no ft-in) |
| Labelled theme-aware SVG, unknown side highlighted | 1/6 |
| Error handling (leg ≥ hypotenuse, ≤ 0) | rare |

## 3. Calculator spec

### 3.1 Tabs

1. **Find a side** (default)
2. **Side + angle**
3. **Is it square?** (builders)
4. **Check a triangle**

### 3.2 Input guide diagram (above the inputs)

`PythagorasInputGuide.tsx`: a labelled right triangle.
- Legs "1 Side a" and "2 Side b", hypotenuse "3 Side c", the right-angle box, and angles α and β.
- The unknown side is drawn dashed and highlighted. Live values sit on each side.
- **Square tab:** a rectangle (slab/deck) with "Length", "Width" and both diagonals. A 3-4-5 triangle is marked in one corner, plus "Measured diagonal 1 / 2" badges.

### 3.3 Inputs (defaults = examples)

| Tab | Default |
|---|---|
| Find a side | a = 3, b = 4 |
| Side + angle | c = 10, α = 30° |
| Square | 10 ft × 14 ft; measured diagonals optional |
| Check | 5, 12, 13 |

- **Units:** ft + in with fractions (e.g. `10' 6 1/2"`), in, ft, yd, mm, cm, m.
- **Output precision:** decimals or nearest 1/16".
- **Triple quick-picks:** 3-4-5, 5-12-13, 8-15-17, 7-24-25.

### 3.4 Engine (`src/lib/right-triangle-engine.ts`)

```ts
c = √(a²+b²) ; a = √(c²−b²) (null + message if b ≥ c) ; area = ab/2 ; perimeter ; altitude h = ab/c
α = atan(a/b) ; β = 90° − α ; side+angle: a = c·sin α, b = c·cos α
exact radical: n = k²·m → k√m (integer inputs)
check: sort; a²+b² vs c² within ε → right / acute / obtuse
square: diagonal = √(L²+W²) ; largest 3-4-5 multiple ≤ shorter side ; out-of-square from |d1 − d2| (wording "approximately", `TODO(owner)` confirm; no "tolerance standard")
ft-in parse/format to 1/16"
```

**Worked examples (checked 2026-11-22):**

| Case | Result |
|---|---|
| a = 3, b = 4 | **c = 5**; α = 36.87°, β = 53.13°; area 6; altitude 2.4 |
| Legs 3 and 6 | c = √45 = **3√5** ≈ 6.708 |
| Square 12 ft × 16 ft | diagonal **20 ft** (3-4-5 × 4) |
| Square 10 ft × 14 ft | diagonal **17.2047 ft = 17′ 2-7/16″** |

### 3.5 Outputs

- **Headline:** the missing side (exact + decimal / ft-in).
- **Sentence:** "With legs of 3 and 4, the hypotenuse is 5. The angles are 36.87° and 53.13°."
- Steps with substitution.
- Angles, area, perimeter, altitude.
- **Square tab:** the target diagonal in ft-in, a suggested 3-4-5 multiple ("mark 9 ft and 12 ft; the diagonal should be 15 ft"), and the out-of-square note.
- Copy, Share URL.

### 3.6 Tests

- All modes; leg ≥ hypotenuse; zero/negative.
- Exact radicals; ft-in parse and format (rounding to 1/16").
- Square diagonal; check classification.
- Every example above. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Pythagorean Theorem Calculator – Right Triangles` (48; 60 with the suffix: OK) |
| Meta | `Free Pythagorean theorem calculator. Find the missing side of a right triangle, check a corner is square with the 3-4-5 method, and see every step.` (147) |
| H1 | `Pythagorean Theorem Calculator: Find Any Side of a Right Triangle` |
| BLUF | "The Pythagoras equation is a² + b² = c². With legs of 3 and 4, c = √(9 + 16) = 5. Builders use it to check a corner: a 12 × 16 ft slab is square when its diagonal is exactly 20 ft, and a 10 × 14 ft deck should measure 17′ 2-7/16″." (engine) |
| ToolShell pills | `Any missing side & angles`, `3-4-5 square check`, `Feet-inches to 1/16"`, `Steps & diagram` |
| Links out | Slope (#10), Rafter (live), Stud (live), Concrete (live), Square Footage (live) |
| Links in | **Rafter, Stud, Concrete** (add contextual links: "check your layout is square"), Slope, Tools hub "Construction maths" |

## 5. Content (~1,400–1,700 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the Pythagoras equation solver | 4 tabs | 100 |
| 2 | The Pythagoras equation (a² + b² = c²) | Explained with the diagram (primary) | 180 |
| 3 | How to find the hypotenuse | Example + exact radical | 150 |
| 4 | How to find a missing leg | Example | 130 |
| 5 | Angles, area and perimeter of a right triangle | Engine example (the gap no one fills) | 180 |
| 6 | Pythagorean triples | 3-4-5, 5-12-13, 8-15-17, 7-24-25 and multiples | 120 |
| 7 | Squaring a corner with the 3-4-5 rule | Slab, deck, wall; ft-in example; checking both diagonals | 250 |
| 8 | Is it a right triangle? | Check mode; acute vs obtuse; law of cosines | 130 |
| 9 | FAQ | §6 | 380 |

## 6. FAQ (11, from the question bank)

1. What is the Pythagorean theorem (a² + b² = c²)?
2. How do I find the hypotenuse?
3. How do I find a missing leg?
4. How do I check whether a triangle is a right triangle?
5. What are Pythagorean triples?
6. How do I use 3-4-5 to square a corner for a slab, deck or wall?
7. What diagonal should an L × W rectangle have?
8. Does the theorem work for non-right triangles? (law of cosines)
9. How do I find the angles of a right triangle?
10. What is the diagonal of a square or an isosceles right triangle? (side × √2)
11. How do I write the answer in exact radical form?

## 7. Done when

- [ ] `right-triangle-engine.ts` + tests; `npm run verify` passes.
- [ ] InputGuide above the inputs; ToolShell + TabSlider + fonts + `<main>`.
- [ ] Contextual links added on Rafter, Stud and Concrete.
- [ ] Out-of-square wording approved; no tolerance "standard" claimed.
- [ ] Registrations + docs; `graphify update .`.
