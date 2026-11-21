# Pulley Ratio & Belt Speed Calculator — Build Spec

> **URL:** `/pulley-calculator/` · Batch 4 · Tier 2 · **Build order 6**
> **Read first:** `../00_BATCH4_BUILD_RULES.md`
> **Inputs:** `07_Pulley_Ratio_Belt_Speed_Calculator_Competitor_Analysis.md`, keyword file §2 #7
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**Volume:** small (~1,700) but **every row is KD 1–13**, and the maths is short.

**Competitors:**
- Omni and Calctool are the most complete, but mix units.
- **Firgelli's main example is physically wrong:** it claims a bigger driven pulley slows the belt. In fact belt speed is fixed by the driver.

**Nobody combines** a 4-way solve, belt length **and** centre distance from a stock belt, a multi-stage drive, and wheel RPM ↔ mph.

### Research notes from the competitor analysis (added 2026-11-22)

- Pages read: Firgelli (main example physically wrong: claims a bigger driven pulley slows the belt), Calculate.co.nz, Calctool / Omni (same engine, mixed units), Blocklayer (diagram, 2-stage tool), Compressor Source (motor-to-pump pulleys).
- Application intent ("slow down a drill press / lathe / router") is real: examples only, with no unsourced max-RPM claims.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | pulley ratio calculator | 480 | 5 | title, H1, first sentence |
| Secondary | pulley ratio calc · pulley speed calculator · pulley size calculator | 260 · 390 · 320 | 1–13 | tool heading, H2s ("Pulley speed", "Pulley size for a target RPM") |
| Secondary | rotations per minute to mph | 260 | 9 | Wheel tab + H2 |
| Natural | belt length calculator · belt speed | — | — | Belt tab + H2 (`TODO(owner)`: volume not in the exports) |

## 2. Our edge

- **4-way solve** (D₁, D₂, N₁, N₂) with a stated convention (i = D₂/D₁, driver → driven) and a reduction/overdrive label.
- **Belt geometry:**
  - open and crossed belt length;
  - **centre distance from a stock belt length**;
  - wrap angle with a low-wrap note.
- **Pitch vs outside diameter** note; timing-belt teeth mode (link #6).
- **Multi-stage** (2–3 stages): total ratio, RPM at each shaft.
- Optional slip % and efficiency %.
- **Wheel RPM ↔ mph / km/h.**
- **Live SVG diagram** (our design). Correct physics in the examples.
- Examples (drill press, lathe, router spindle) are illustrative only, with **no unsourced max-RPM claims**.

## 3. Calculator spec

### 3.1 Tabs

1. **Pulley speed & size** (default)
2. **Belt length & centre distance**
3. **Multi-stage**
4. **Wheel RPM ↔ mph**

### 3.2 Input guide diagram (above the inputs)

`PulleyInputGuide.tsx`: the live diagram itself, placed above the inputs.

- **Left pulley:** "1 Driver diameter" + "2 Driver RPM" (motor icon).
- **Right pulley:** "3 Driven diameter" → "Driven RPM".
- **Centre line:** "4 Centre distance".
- **Belt arrow:** "Belt speed (same on both pulleys)".
- **Behaviour:** the circles resize with the inputs, with min/max visual clamps.
- **Wheel tab:** a wheel with "Diameter" + "RPM" → speedometer "mph".

### 3.3 Inputs

| Field | Default |
|---|---|
| Units | in / mm |
| Driver | 2 in at 1,725 RPM (example motor speed) |
| Driven | 4 in |
| Solve-for selector | driven RPM (default) |
| Centre distance | 20 in |
| Stock belt length | for reverse |
| Slip % / efficiency % | 0 / 100 |
| Stages | up to 3 |
| Wheel | diameter + RPM |

### 3.4 Engine (`src/lib/pulley-engine.ts`)

Belt speed comes from `machining-engine.lineSpeed`.

```ts
N2 = N1 * D1 / D2 * (1 - slip) ; D2 = D1 * N1 / N2 ; ratio = D2/D1
beltSpeed_ftmin = π * D1 * N1 / 12
openLength = 2C + π(D1+D2)/2 + (D2-D1)²/(4C) ; crossed = 2C + π(D1+D2)/2 + (D1+D2)²/(4C)
centreFromLength: solve the open-length equation for C (quadratic) ; null if L too short
wrapSmall = 180° - 2*asin((D2-D1)/(2C))
stages: product of ratios ; torque ratio ideal = ratio × efficiency
wheel: mph = rpm * π * Din * 60 / 63360
```

**Worked example (checked 2026-11-22):**
- 2 in driver at 1,725 RPM → 4 in driven = **862.5 RPM** (2:1 reduction).
- Belt speed **903.2 ft/min**.
- Open belt at a 20 in centre: **49.47 in**.
- Small-pulley wrap ≈ 174.3°.

### 3.5 Outputs

- **Headline:** driven RPM + ratio.
- **Sentence:** "A 2-inch pulley at 1,725 RPM driving a 4-inch pulley turns it at 862.5 RPM, a 2:1 reduction. The belt moves at about 903 feet per minute."
- Belt length / centre distance; wrap angle; stage table; mph.
- Share URL, Copy.

### 3.6 Tests

- 4-way solve round-trips.
- Belt length open/crossed; centre-from-length inverse.
- Wrap angle; slip; stages; wheel mph.
- The worked example.
- Belt speed **does not change** with the driven size.
- Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Pulley Calculator – Ratio, Speed and Belt Size` (46; 58 with the suffix: OK) |
| Meta | `Free pulley ratio calculator. Find the driven pulley speed, the pulley size for a target RPM, the speed ratio and the belt speed for two pulleys.` (145) |
| H1 | `Pulley Ratio Calculator: Driven Speed, Pulley Size and Belt Speed` |
| BLUF | "Driven RPM = driver RPM × driver diameter ÷ driven diameter. A 2-inch pulley at 1,725 RPM turning a 4-inch pulley gives 862.5 RPM, a 2:1 reduction, and the belt runs at about 903 feet per minute." (engine) |
| ToolShell pills | `Solve any pulley value`, `Belt length & centre distance`, `Multi-stage drives`, `Live diagram` |
| Links out | SFM ↔ RPM (#4), Speeds & Feeds (#3), Steps per mm (#6) |
| Links in | SFM ↔ RPM, Speeds & Feeds, Thread Pitch, Tools hub "RPM tools" |

## 5. Content (~1,300–1,600 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the pulley ratio calculator | 4 tabs | 100 |
| 2 | Pulley ratio formula | Example; reduction vs overdrive | 180 |
| 3 | Pulley speed: finding the driven RPM | Example (`pulley speed calculator`) | 130 |
| 4 | Pulley size for a target RPM | Example (`pulley size calculator`) | 130 |
| 5 | Belt speed (and why it doesn't change) | Fixes the common mistake | 150 |
| 6 | Belt length and centre distance | Formulas + example | 180 |
| 7 | Multi-stage pulley drives | Example | 120 |
| 8 | Wheel RPM to mph | Example (`rotations per minute to mph`) | 100 |
| 9 | FAQ | §6 | 330 |

## 6. FAQ (12, from the competitor question bank + cluster keywords)

1. How do I calculate pulley ratio?
2. How do I find the driven pulley speed (RPM)?
3. What pulley size do I need for a target RPM?
4. How do I calculate belt speed?
5. How do I calculate belt length for two pulleys?
6. Does a bigger pulley increase torque?
7. What centre distance do I need for my belt?
8. Should I use outside or pitch diameter?
9. How do I calculate a two-stage (compound) pulley drive?
10. How do I convert wheel RPM to mph?
11. How much does belt slip reduce speed?
12. How do I slow down a drill press, lathe or router spindle with pulleys?

## 7. Done when

- [ ] `pulley-engine.ts` + tests; `npm run verify` passes.
- [ ] Live diagram as the InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Registrations + docs; `graphify update .`.
