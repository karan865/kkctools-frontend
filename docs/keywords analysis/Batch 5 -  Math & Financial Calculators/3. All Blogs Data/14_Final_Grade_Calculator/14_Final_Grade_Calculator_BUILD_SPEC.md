# Final Grade Calculator — Build Spec

> **URL:** `/final-grade-calculator/` · Batch 5 · Tier 2 · rank chance 🟡 · **Build order 17**
> **Read first:** `../00_BATCH5_BUILD_RULES.md`
> **Inputs used:** `14_Final_Grade_Calculator_Competitor_Analysis.md` (6 pages read, 2026-11-14), keyword file §2 #14
> **SERP:** provisional
> **Written:** 2026-11-22 (full rewrite after the research pass)

---

## 0. Strategy

- **Demand:** the leader's brand searches (33,100) show huge demand for this exact tool, but that brand owns the head term. **We target the question phrasing:** `what do i need on my final` (5,400, KD 24).
- **🚫 Never name the competitor brand in our copy** (keyword-file rule).
- **Everyone uses the same formula.** Tools differ in how many **real grading situations** they handle:
  - the category leader has 7 modes, but **no needed-score table**, no letter conversion and a dated design;
  - RemNote is the only page with an A/B/C/D table, and it shows "secured";
  - Pearson is the most modern, with weighted items and a weights-sum check, but **no answers** in its examples;
  - Omni covers international systems with unsourced equivalences;
  - CalculatorSoup gives **no warning** when the needed score is over 100%.
- **Our page combines:**
  - a letter table (A+…F);
  - weighted categories;
  - points-based grading;
  - the special cases (final counts as N tests, lowest test dropped);
  - "not reachable" / "already secured" messages;
  - a what-if slider;
  - an editable scale.
- `TODO(owner)`: pull `weighted grade calculator` (the weighted mode can target it).

## 1. Keywords and placement

| Role | Keyword | US vol | KD | Where it goes |
|---|---|---:|---:|---|
| **Primary** | what do i need on my final | 5,400 | 24 | H1 wording, first sentence, H2 "What do I need on my final? The formula", FAQ #1 |
| Secondary (irregular) | semester exam calculator | 1,300 | 0 | Semester mode (if the owner confirms the weighting) + FAQ |
| Natural | final grade calculator · final exam calculator · weighted grade calculator · grade needed on final | — | — | Title, tool heading, Weighted tab, H2s |

## 2. Our edge (6 competitors checked)

| Feature | Competitors with it |
|---|---|
| Needed score | 6/6 |
| Grade after the final (reverse) | 4/6 |
| **Needed-score table for every letter**, with "secured" / "not reachable" labels | 1/6 (A–D only) |
| Weighted categories (rows; final = one row; weights-sum check + normalise warning) | 2/6 (1 full) |
| Points-based classes | 1/6 |
| **Special cases:** final counts as N tests; lowest test dropped (explained, with examples) | 1/6 |
| Min/max possible grade (final 0% / 100%) | rare |
| What-if slider (final 0–100 → course grade) + mini chart | 1/6 |
| Editable scale, half-open bands, ± option (shared with #7) | partial |
| Examples with answers | 3/6 |

## 3. Calculator spec

### 3.1 Tabs

1. **Score needed** (default)
2. **Weighted categories**
3. **Points-based**
4. **What-if / grade after the final**

Advanced toggles: "final counts as N tests", "lowest test dropped".

### 3.2 Input guide diagram (above the inputs)

`FinalGradeInputGuide.tsx`: a horizontal course-grade bar split in two.
- "1 Current grade (work before the final)": width = 100% − final weight.
- "2 Final exam weight %".
- A vertical target line: "3 Grade you want".
- The final's segment is shaded up to the needed score, with the live value.
- **Weighted tab:** stacked category blocks (homework, quizzes, tests, final), each with "weight %" and "average".

### 3.3 Inputs (defaults = examples)

| Tab | Default |
|---|---|
| Score needed | current 85%, final weight 20%, target 87% |
| Weighted | homework 20% avg 92 · quizzes 20% avg 85 · tests 35% avg 80 · final 25%; target 85 |
| Points | points earned so far, points possible so far, final points |
| Scale | A ≥ 90, B ≥ 80, C ≥ 70, D ≥ 60 (± optional). Editable, saved locally, labelled "schools differ" |

### 3.4 Engine (`src/lib/final-grade-engine.ts`)

```ts
needed = (T − C(1−w))/w   (null if w ≤ 0) ; grade = C(1−w) + F·w ; min = C(1−w) ; max = C(1−w) + 100w
labels: needed > 100 → "not reachable (max possible X%)" ; needed ≤ 0 → "already secured"
weighted: course = Σ g_i w_i / Σ w ; needed = (T·Σw − Σ_other g_i w_i)/w_final ; warn + normalise if Σw ≠ 100
points: w_final = finalPts / totalPts
counts-as-N-tests: testAvg' = (avg·k + F·N)/(k+N) → solve F (numerically if needed)
drop-lowest: recompute with min excluded, including F (numeric solve)
letter table: needed for each cutoff on the scale
```

**Worked examples (checked 2026-11-22):**

- **Score needed:** 85% now, final worth 20%, want 87% → **need 95%** on the final.
- **Same inputs, letter table:**

  | Letter | Needed on the final |
  |---|---|
  | A (90) | 110%, **not reachable** (max possible 88%) |
  | B (80) | **60%** |
  | C (70) | **10%** |
  | D (60) | **already secured** (min possible 68%) |

- **Weighted example:** need **86.4%** on the final for an 85% course grade.

### 3.5 Outputs

- **Headline:** the score needed.
- **Sentence:** "You need 95% on your final to finish with 87%. Even a 0 on the final leaves you with 68%; a perfect score gives 88%."
- Letter table with labels.
- What-if slider + mini chart.
- Weights-sum warning.
- Copy, Share URL.

### 3.6 Tests

- Core formula; w = 0 → `null`.
- Not reachable / secured labels; min/max.
- Weighted with normalisation; points mode.
- Counts-as-N; drop-lowest (numeric).
- The examples above. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Final Grade Calculator – What Do I Need on My Final?` (52; 64 with the suffix → `absoluteTitle`) |
| Meta | `Free final grade calculator. Enter your current grade, the final's weight and the grade you want, and see the score you need on the final exam.` (143) |
| H1 | `Final Grade Calculator: What Score Do I Need on My Final?` |
| BLUF | "What do I need on my final? Needed score = (grade you want − current grade × (1 − final weight)) ÷ final weight. With an 85% now and a final worth 20%, you need 95% to finish with 87%; a B needs only 60%." (engine) |
| ToolShell pills | `Score needed for every letter`, `Weighted categories`, `What-if slider`, `Dropped-test & points modes` |
| Links out | Fraction to Percent (#7), Percentage Change (live), Standard Deviation (#11), Age Difference (#2) |
| Links in | Fraction to Percent (score tab), Tools hub "Everyday" |

## 5. Content (~1,300–1,600 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the final grade calculator | 4 tabs + toggles | 100 |
| 2 | What do I need on my final? The formula | Formula + example (primary) | 200 |
| 3 | Score needed for an A, B, C or D | Engine table example | 150 |
| 4 | Weighted grades: homework, quizzes, tests and the final | Weighted example (86.4%) | 200 |
| 5 | Points-based classes | Example | 120 |
| 6 | When the final counts as a test, or the lowest test is dropped | Examples | 180 |
| 7 | What if you need more than 100%? | Not reachable / secured; max possible | 120 |
| 8 | Where to find your final's weight | Syllabus tips | 80 |
| 9 | FAQ | §6 | 380 |

## 6. FAQ (10, from the question bank)

1. What do I need on my final to get an A, B or C? (`what do i need on my final`)
2. How is the needed final score calculated?
3. What will my grade be after the final?
4. What if I need more than 100%?
5. Where do I find my final exam's weight?
6. What if my final counts as a test, or my lowest test is dropped?
7. How do weighted categories (homework, quizzes, tests) work?
8. How do I calculate a semester exam grade? (`semester exam calculator`)
9. Does my current grade include the final?
10. How do points-based classes work?

## 7. Done when

- [ ] `final-grade-engine.ts` + tests (all examples); `npm run verify` passes.
- [ ] No competitor brand in copy; scale labelled "schools differ".
- [ ] InputGuide above the inputs; ToolShell + TabSlider + fonts + `<main>`.
- [ ] Semester weighting confirmed by the owner (or mode omitted).
- [ ] Registrations + docs; `graphify update .`.
