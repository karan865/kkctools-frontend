# SFM ↔ RPM Calculator — Build Spec

> **URL:** `/sfm-to-rpm-calculator/` · Batch 4 · Tier 1 · **Build order 5** (shares `machining-engine`)
> **Read first:** `../00_BATCH4_BUILD_RULES.md`
> **Inputs:** `04_SFM_RPM_Surface_Speed_Calculator_Competitor_Analysis.md`, keyword file §2 #4
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**Volume:** ~8,700 searches, almost all at KD 1–22, with CPC up to **$14** (industrial buyers).

**Competitors** are tiny distributor pages:
- unlabelled "D" and "RPM" inputs;
- imperial only;
- one direction per page;
- no example and no FAQ.

**Our page:** a 3-way solve, every unit, a line-speed mode, a generated chart and a full FAQ.

**Note:** if a SERP pull later shows the same pages for "sfm to rpm" and "speeds and feeds", merge this into #3 as a section.

### Research notes from the competitor analysis (added 2026-11-22)

- Pages read: Redline Tools and Productivity Inc. (same template, same .262 constant, one direction each), Calculator Academy (3 pages), Wikipedia, Fluent Conveyors (line speed).
- `TODO(owner)`: check Machining Doctor (403) and CNCCookbook in a browser; likely the best chart benchmarks.
- Gearbox effect on line speed is a real FAQ (Calculator Academy, Fluent): include the optional gear ratio.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | sfm calculator | 1,300 | 17 | title, H1, first sentence |
| Secondary | sfm to rpm · sfm to rpm calculator · sfm rpm · sfpm to rpm · sfpm calculator | 720 · 320 · 320 · 320 · 390 | 7–13 | H2 "SFM to RPM formula" + default tab |
| Secondary | rpm to sfm calculator · rpm to ft min · rpm to feet per minute · rpm to fpm calculator · fpm to rpm calc | 260 · 390 · 260 · 260 · 260 | 2–9 | RPM → SFM tab + H2 |
| Secondary | surface footage calculator · surface feet per minute calculator | 880 · 720 | 21–22 | intro + H2 "What is surface feet per minute?" |
| Secondary | m/min to sfm | 260 | 4 | unit strip |
| Secondary | line speed calculator | 590 | 1 | Line-speed tab + H2 |
| FAQ | how do i calculate rpm · how do you calculate revolutions per minute | 320 · 260 | 10–14 | FAQ |

## 2. Our edge

- **3-way solve** (SFM / RPM / diameter) with full units: in/mm, SFM ↔ m/min, plus ft/s, m/s and mph for line speed.
- **Exact π maths;** the 3.82 and 0.262 shortcuts are explained.
- **Generated chart:** RPM for common diameters × chosen SFM range, in imperial and metric tabs. Printable, and **produced by our code**.
- **Line / belt speed mode:** roller diameter, optional belt thickness, gear ratio, slip.
- **Diameter guidance** (turning = work diameter; milling = tool diameter; ball end = effective diameter).
- Max-RPM warning with a link to #3.
- Clears up the SCFM vs SFM confusion.

## 3. Calculator spec

### 3.1 Tabs

1. **SFM → RPM** (default)
2. **RPM → SFM**
3. **Line speed**
4. **RPM chart**

### 3.2 Input guide diagram (above the inputs)

`SfmInputGuide.tsx`: a circle (tool or workpiece).

- "1 Diameter" across it.
- A curved arrow on the edge labelled "2 Surface speed (feet per minute at the edge)".
- A centre spin icon labelled "3 RPM".
- Caption: "One turn travels π × diameter".
- **Line-speed tab:** a roller with a belt leaving it, labelled "Roller diameter", "RPM" and "Belt speed".

Live values; the focused field highlights.

### 3.3 Inputs

| Field | Default |
|---|---|
| Units | in / mm |
| Diameter | 0.5 in |
| SFM | 300 (example) |
| RPM (reverse) | 1,000 |
| Max machine RPM | optional |
| Line tab | roller diameter, RPM, optional belt thickness, gear ratio, slip % |
| Chart | SFM range + step; diameter list (editable) |

### 3.4 Engine

`machining-engine.ts`:

```ts
rpm = 12*sfm/(π*Din) ; sfm = π*Din*rpm/12 ; Din = 12*sfm/(π*rpm)
metric: rpm = 1000*vc/(π*Dmm) ; vc(m/min) = sfm * 0.3048
line speed = π*(D + belt thickness)*rpm/12 * (1 - slip) * ratio → ft/min, m/min, m/s, mph
chart(diameters[], sfmRange) → matrix
```

**Worked examples (checked 2026-11-22):**

| Input | Result |
|---|---|
| 1 in at 1,000 RPM | **261.8 SFM** |
| 0.5 in at 300 SFM | **2,292 RPM** |

### 3.5 Outputs

- **Headline:** RPM (or SFM / diameter).
- **Sentence:** "At 300 surface feet per minute, a 0.5-inch tool spins at 2,292 RPM."
- Unit strip: SFM, m/min, ft/s, m/s.
- Max-RPM warning. Chart table (print, CSV). Share URL.

### 3.6 Tests

- The 3-way solve round-trips.
- Metric; line speed with slip.
- Chart spot cells; zero/negative inputs → `null`.
- The examples. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `SFM to RPM Calculator – Surface Feet per Minute` (47; 59 with the suffix: OK) |
| Meta | `Free SFM to RPM calculator. Convert surface feet per minute to spindle RPM for any diameter, or RPM back to SFM, m/min and feet per minute.` (139) |
| H1 | `SFM to RPM Calculator: Surface Speed, RPM and Feet per Minute` |
| BLUF | "RPM = (12 × SFM) ÷ (π × diameter in inches), about 3.82 × SFM ÷ D. A 0.5-inch tool at 300 SFM runs at 2,292 RPM; a 1-inch tool at 1,000 RPM moves at 261.8 surface feet per minute." (engine) |
| ToolShell pills | `SFM, RPM or diameter`, `Inch & metric units`, `Line speed mode`, `Printable RPM chart` |
| Links out | Speeds & Feeds (#3), Pulley (#7), Thread Pitch (#8) |
| Links in | Speeds & Feeds, Pulley, Tools hub "RPM tools" |

## 5. Content (~1,400–1,700 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the SFM calculator | 4 tabs | 100 |
| 2 | What is surface feet per minute (SFM)? | Definition, SCFM confusion | 150 |
| 3 | SFM to RPM formula | Derivation, 3.82 shortcut, example | 200 |
| 4 | RPM to SFM (feet per minute) | Reverse, example | 150 |
| 5 | Metric: m/min to SFM and RPM | Example | 130 |
| 6 | Which diameter to use | Turning vs milling vs ball end | 150 |
| 7 | Line speed from roller RPM | Example (`line speed calculator`) | 150 |
| 8 | RPM chart for common diameters | How to read it | 100 |
| 9 | FAQ | §6 | 350 |

## 6. FAQ (12, from the competitor question bank + cluster keywords)

1. How do I convert SFM to RPM?
2. How do I calculate RPM (revolutions per minute)?
3. What does SFM (SFPM) mean?
4. How do I convert RPM to feet per minute?
5. How do I convert m/min to SFM?
6. Why is the constant 3.82 (or 0.262)?
7. Which diameter do I use: tool or workpiece?
8. How do I calculate conveyor or line speed from roller RPM?
9. How does a gearbox change line speed?
10. What SFM should I use for aluminum, steel or stainless? (link #3; cited only)
11. What if the RPM is above my machine's maximum?
12. What is the difference between SFM and SCFM?

## 7. Done when

- [ ] `machining-engine` reused + tests; `npm run verify` passes.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`; chart generated by our code.
- [ ] Registrations + docs; `graphify update .`.
