# Thread Pitch Diameter & Tap Drill Calculator — Build Spec

> **URL:** `/thread-pitch-diameter-calculator/` · Batch 4 · Tier 3 · **Build order 8 (last)**
> **Read first:** `../00_BATCH4_BUILD_RULES.md` (§2.4: no standards tables copied)
> **Inputs:** `08_Thread_Pitch_Diameter_Tap_Drill_Calculator_Competitor_Analysis.md`, keyword file §2 #8
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**Volume:** `pitch diameter` is 1,300 at KD 10, an informational head term. The page must explain pitch diameter with a diagram **and** calculate it.

**Basic sizes come from formulas** (60° thread: d₂ = d − 0.649519·P), so no table copying is needed.

**Tolerance classes** (2A/2B, 6g/6H) need ASME B1.1 / ISO 965 tables we can't copy. We explain what they mean and point to the standards. `TODO(owner)`: decide whether to license any data later.

**Competitors:**
- Omni is the quality benchmark, but metric-only.
- One ranking page uses wrong formulas.

### Research notes from the competitor analysis (added 2026-11-22)

- Pages read: Omni (ISO metric only), Firgelli (**formulas wrong**), Carr Lane (pitch-diameter definition wrong), CJWinter (rolled-thread blank diameter), AmesWeb (ISO 724/965 limits), EngineeringTechnology.org (three-wire), Engineers Edge.
- Omni and AmesWeb compute ISO 965 limits **from published tolerance formulas** (not tables). `TODO(owner)`: decide whether formula-computed limits are acceptable; default = basic sizes only.
- Ambiguity: "pitch diameter" also means gear or sprocket/pulley pitch diameter. One disambiguation line + link to Pulley (#7).

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | pitch diameter | 1,300 | 10 | H1, first sentence, H2 "What is pitch diameter?", diagram |
| FAQ only | how it pitch diameter measured acme threads (irregular, broken grammar) | 320 | 11 | FAQ "How is pitch diameter measured on Acme threads?" |
| Natural | thread pitch diameter calculator · tap drill size calculator · three wire method · pitch to TPI | — | — | title, H2s (`TODO(owner)`: pull volumes) |

## 2. Our edge

- **One tool for UN (inch) + ISO metric + Acme 29° + trapezoidal 30°.** Outputs basic major, pitch and minor diameters (internal and external), H and thread height.
- **Correct, visible formulas,** with worked examples (M10×1.5 → d₂ = 9.026 mm).
- **Tap drill for a chosen % thread** (default 75%): ideal drill, nearest standard drills, and the resulting %.
  - The drill list is **generated or factual sizes**, not copied tables.
- **Three-wire helper:** best wire size (0.57735·P for 60°), the target measurement M over wires, or d₂ from a measured M.
- Pitch ↔ TPI converter; common-size quick pick (sizes are factual designations).
- **SVG thread-profile diagram** (our design) labelling d, d₂, d₁/d₃, P, H.
- Disambiguation: thread vs gear vs pulley pitch diameter (link #7).

## 3. Calculator spec

### 3.1 Tabs

1. **Pitch diameter** (default)
2. **Tap drill size**
3. **Three-wire measurement**
4. **Pitch ↔ TPI**

### 3.2 Input guide diagram (above the inputs)

`ThreadInputGuide.tsx`: a 60° thread profile cross-section (sawtooth).

- "1 Major diameter (d)" at the crests.
- "2 Pitch (P), or threads per inch" between two crests.
- A dashed line through the flanks: "Pitch diameter (d₂), where thread and groove are equal width".
- The root: "Minor diameter".
- A toggle "3 External (bolt) / Internal (nut)" flips the shading.
- **Three-wire tab:** three circles sitting in the grooves ("4 Wire diameter") and a caliper "M over wires".
- **Acme mode:** the angle label switches to 29°.

Live values; the focused field highlights.

### 3.3 Inputs (defaults = examples)

| Field | Default |
|---|---|
| Standard | ISO metric (UN, Acme, trapezoidal) |
| Major diameter / size pick | M10 |
| Pitch | 1.5 mm (or TPI) |
| Type | external |
| % thread (tap tab) | 75 |
| Wire diameter / measured M (wire tab) | — |

### 3.4 Engine (`src/lib/thread-engine.ts`)

```ts
H = 0.866025·P (60° fundamental triangle)
external 60°: d2 = d − 0.649519·P ; d3 (minor, ISO) = d − 1.226869·P
internal 60°: D2 = D − 0.649519·P ; D1 = D − 1.082532·P
inch: P = 1/TPI (inches)
acme 29° basic: d2 = d − 0.5·P (general-purpose basic; cite the formula source used or label "basic")
tapDrill(%) = D − 0.01299 × %thread × P   (metric, mm)  ; inch: D − 0.01299 × %thread / TPI
resultingPct(drill) = (D − drill) / (0.01299 × P)
bestWire60 = 0.57735·P ; M = d2 + 3W − 1.51554·P ; d2FromM = M − 3W + 1.51554·P
```

**Worked examples (checked 2026-11-22):**

| Input | Result |
|---|---|
| M10×1.5 external | **d₂ 9.026 mm**, d₃ 8.160 mm |
| M10×1.5 internal | D₁ 8.376 mm |
| Tap drill at 75% | **8.539 mm → nearest standard 8.5 mm** |
| Best wire | 0.866 mm, so M over wires 9.350 mm |
| 1/4-20 UNC | d₂ **0.2175 in** |

### 3.5 Outputs

- **Headline:** pitch diameter (plus the minor diameters).
- **Sentence:** "An M10 × 1.5 thread has a basic pitch diameter of 9.026 mm (10 − 0.6495 × 1.5)."
- Table of basic sizes, internal and external.
- Tap drill + nearest drills with their resulting %.
- Three-wire values.
- **Basic-size note:** "Basic (zero-tolerance) sizes. For class limits (2A/2B, 6g/6H) see ASME B1.1 / ISO 965."
- Share URL, Copy.

### 3.6 Tests

- d₂, d₃ and D₁ for M10×1.5 and 1/4-20.
- Tap drill and the resulting %.
- Three-wire M ↔ d₂ round-trip.
- Pitch ↔ TPI. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Thread Pitch Diameter Calculator – UN & Metric` (46; 58 with the suffix: OK) |
| Meta | `Free thread pitch diameter calculator. Get basic pitch diameter, minor diameter and tap drill size for UN, metric and Acme threads from size and pitch.` (151) |
| H1 | `Thread Pitch Diameter Calculator: UN, Metric and Acme Threads` |
| BLUF | "Pitch diameter is the diameter where a thread's ridge and groove are equally wide. For 60° UN and metric threads, basic pitch diameter = major diameter − 0.6495 × pitch, so an M10 × 1.5 thread has a pitch diameter of 9.026 mm." (engine) |
| ToolShell pills | `UN, metric & Acme`, `Tap drill for any % thread`, `Three-wire helper`, `Inch & mm` |
| Links out | Speeds & Feeds tapping (#3), Pulley (#7), SFM ↔ RPM (#4) |
| Links in | Speeds & Feeds, Tools hub "Machining" |

## 5. Content (~1,500–1,800 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | What is pitch diameter? | Definition + diagram reference (primary) | 200 |
| 2 | How to use the thread calculator | Tabs | 100 |
| 3 | Pitch diameter formula for UN and metric threads | Derivation (H, 0.6495) + examples | 220 |
| 4 | Minor and major diameters, internal vs external | Formulas | 150 |
| 5 | Tap drill size for a % thread | Formula, why 75% (general), example | 200 |
| 6 | Measuring pitch diameter: the three-wire method | Best wire, M formula, example | 200 |
| 7 | Acme and trapezoidal threads | 29° vs 30°, basic sizes | 130 |
| 8 | Thread classes and tolerances (2A/2B, 6g/6H) | What they mean; standards named; no tables | 130 |
| 9 | Thread vs gear vs pulley pitch diameter | Disambiguation | 100 |
| 10 | FAQ | §6 | 350 |

## 6. FAQ (11, from the competitor question bank + cluster keywords)

1. What is the pitch diameter of a thread?
2. How do you calculate pitch diameter (formula)?
3. What is the difference between major, minor and pitch diameter?
4. How do I measure pitch diameter (three-wire method)?
5. How is pitch diameter measured on Acme threads?
6. What tap drill size do I need for a given % thread?
7. What do 6g/6H and 2A/2B mean?
8. Pitch vs TPI: how do I convert?
9. What is the blank diameter for rolled threads? (if the formula is cited; else link out)
10. Thread pitch diameter vs gear pitch diameter
11. Why are my calculated values different from a chart? (basic vs tolerance limits)

## 7. Done when

- [ ] `thread-engine.ts` + tests; `npm run verify` passes.
- [ ] InputGuide (thread profile) above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] No tolerance tables copied; the drill list is factual sizes only; the basic-size note is visible.
- [ ] Registrations + docs; `graphify update .`.
