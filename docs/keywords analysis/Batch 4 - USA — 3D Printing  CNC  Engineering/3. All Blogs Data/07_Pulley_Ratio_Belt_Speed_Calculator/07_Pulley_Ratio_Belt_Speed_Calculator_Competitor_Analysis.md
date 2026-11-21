# Pulley Ratio & Belt Speed Calculator — Competitor Analysis

> **Target page:** KKCTools `/pulley-calculator/` (Batch 4, Tier 2 #7)
> **Primary keyword:** `pulley ratio calculator`. US 480 · KD 5 · CPC $0.08. Cluster: 5 keywords, 1,710 US vol, all KD ≤ 13.
> **SERP source:** ⚠ No Semrush SERP export for Batch 4. Competitors come from a live web search for `pulley ratio calculator` on 2026-11-14. `TODO(owner): pull Google top 10.`
> **Pages visited:** 2026-11-14. Read: 6 (Firgelli, Calculate.co.nz, Calctool, Blocklayer, Compressor Source, Omni).

---

## 0. How this was collected (read first)

- **Types of page read:**
  - Engineering blog calculators: Firgelli.
  - Calc sites: Calculate.co.nz, Calctool, Omni (Omni and Calctool run the same engine).
  - A trade-tool site: Blocklayer, which has a diagram.
  - An industry page: Compressor Source, for motor-to-pump pulleys.
- **Also in the SERP, not read:**
  - pages.dev mirrors (machinecalc, caltrx, joteo1, basicfreetools)
  - everycalculators
  - Sourcetable
  - AIMS Industrial blog
  - Palm Beach Bots belt calculator (robotics timing belts)
  - daycounter
  - Calculator Academy alternator pulley page
  - two iOS apps
- **Ratio convention is inconsistent across the SERP.** Some pages define it as driven ÷ driver and others as driver ÷ driven. We must state our convention in one line.
- **Keyword mode:** `rotations per minute to mph` (wheel RPM + diameter → mph). We did not find a competitor that pairs this with a pulley tool. This is a gap.
- Arithmetic and physics were re-checked. No competitor text is copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | firgelliauto.com/blogs/engineering-calculators/pulley-ratio-calculator-speed-and-torque-between-pulleys | Actuator maker blog | Pulley Ratio Calculator — Speed and Torque Between Pulleys | ~1,800 |
| 2 | calculate.co.nz/pulley-rpm-calculator.php | NZ calc site | Pulley RPM Calculator | 600–700 core |
| 3 | calctool.org/machines-and-mechanisms/pulley | Calc site (Omni family) | Pulley Calculator | 750–800 |
| 4 | blocklayer.com/pulley-belt | Trade-tool site | Pulley and Belt Calculator – Metric | 700–800 (much off-topic) |
| 5 | compressor-source.com/pages/pulley-size-rpm-calculator | Compressor parts shop | Pulley Size & RPM Ratio Calculator | ~600 |
| 6 | omnicalculator.com/physics/pulley | Giant | Pulley Calculator (belt drive) | 1,000–1,200 |

**What this tells us:**
- **Omni and Calctool are the most complete.** They cover power, centre distance, diameters, RPM, torque, belt length, belt velocity and tension. Weak points: mixed units (ft and N·m) and no worked example on Calctool.
- **Firgelli's main worked example is physically wrong.** It claims a bigger driven pulley slows the belt. Belt speed is fixed by the driver.
- **Nobody combines all of these:**
  - a 4-way solve for any unknown (D₁, D₂, N₁, N₂)
  - belt length **and** centre distance from belt length
  - wrap angle
  - multi-stage (compound) drives
  - pitch vs outside diameter
  - slip
  - wheel RPM ↔ mph
- **The ratio convention is never clearly stated.** Firgelli shows 1:2 in one place and 0.5:1 in another. Calctool doesn't say what its ratio means.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Firgelli | Calc.co.nz | Calctool | Blocklayer | Compressor Src | Omni |
|---|---|---|---|---|---|---|
| Driven RPM from D₁, D₂, N₁ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Solve any unknown (pulley size for target RPM) | ❌ | ❌ | ✅ | ✅ | ✅ (labels swapped) | ✅ |
| Ratio output with stated convention | ⚠️ two notations | ✅ driven ÷ driver | ⚠️ unclear | ✅ | ❌ | ⚠️ |
| Torque ratio / torque | ✅ | ⚠️ FAQ | ✅ (fields ambiguous) | ❌ | ⚠️ vague | ✅ |
| Belt speed | ✅ (no units in widget) | ✅ m/min | ✅ ft/s | ❌ (separate tool) | ❌ | ✅ |
| Belt length (open) | ⚠️ FAQ formula only | ❌ (separate tool) | ✅ | ❌ (title implies it) | ❌ | ✅ |
| Centre distance from belt length | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Crossed belt | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Wrap angle (small pulley) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Belt tension from power | ❌ | ❌ | ✅ (net only) | ❌ | ❌ | ✅ |
| Multi-stage / compound drive | ❌ | ❌ | ❌ | ✅ multiple sets | ❌ | ❌ |
| Pitch vs outside diameter (V-belt, timing) | ❌ | ❌ | ❌ | ❌ | ⚠️ "outside diameter" | ❌ |
| Timing belt (teeth instead of diameter) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Slip % | ❌ (FAQ 1–3%, uncited) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Wheel RPM ↔ mph | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Diagram | ✅ visualiser | ❌ | ❌ | ✅ scaled, printable | ❌ | ⚠️ image |
| Units | ⚠️ in (no units in widget) | mm only | ft / N·m mixed | mm (+ inch section) | in | ✅ selectable |

---

## 3. Feature matrix — content and trust

| Item | Firgelli | Calc.co.nz | Calctool | Blocklayer | Compressor | Omni |
|---|---|---|---|---|---|---|
| Formulas shown | ✅ | ✅ | ✅ | ❌ | ✅ (4 rearrangements) | ✅ 5 |
| Worked example | ⚠️ simple ✔, conveyor **physically wrong** | ✅ (checked) | ❌ | ⚠️ (answer not stated) | ❌ | ✅ (checked) |
| Speed vs torque trade-off explained | ✅ | ⚠️ | ✅ | ❌ | ⚠️ | ✅ (bike FAQ) |
| Application guidance (compressor, lathe, router, fan) | ⚠️ conveyor | ❌ | ❌ | ❌ | ✅ compressor | ⚠️ bikes |
| FAQ count | several | 3 | 0 | 0 | 0 | 4 |
| Named author | ✅ | ✅ (reviewer cites tax sources, not a fit) | ✅ | ✅ | ❌ | ✅ + reviewer |
| Date | ✅ Feb 2026 | ✅ Nov 2026 | ✅ Aug 2022 | ❌ | ❌ | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. Firgelli — Pulley Ratio Calculator (Robbie Dickson, Feb 2026)
- **Inputs:** D₁ (4 in), D₂ (8 in), N₁ (1,000 RPM).
- **Outputs:** 500 RPM, torque 2:1, ratio, belt speed. The widget shows 1,047 with no units; it is ft/min (12,566 in/min).
- **Formulas:** N₂ = N₁ × D₁/D₂ · T₂ = T₁ × D₂/D₁ · V = πD₁N₁. A render glitch shows "N—".
- **Major error:** in the conveyor example, a 73.3 in driven pulley is said to bring belt speed down to 100 ft/min. **Wrong.** Belt speed is π × D₁ × N₁ no matter what the driven pulley is. Only the driven shaft slows (to about 95 RPM).
- **Inconsistency:** the FAQ says the practical limit is about 6–7:1 per stage, but the example uses 18:1.
- **Belt length** appears in the FAQ only (standard open-belt approximation ✔). The calculator doesn't compute it.

### 2. Calculate.co.nz — Pulley RPM Calculator (reviewed Nov 2026)
- **Inputs:** driver Ø (mm), driven Ø (mm), driver RPM.
- **Outputs:** driven RPM, ratio (driven ÷ driver), belt speed (m/min).
- **Example checked:** 100 mm, 1,500 RPM, 250 mm → 600 RPM ✔, 2.5:1 ✔, 471.24 m/min ✔.
- **FAQs (3):** driven RPM · drive ratio · belt speed.
- **Weak points:** no reverse solve, no belt length (links out), no pitch-diameter note, no slip; the reviewer's sources (tax and bank) don't fit the topic.

### 3. Calctool — Pulley Calculator (Davide Borchia, Aug 2022)
- **Fields:** power (W), centre distance (ft), driver/driven Ø (ft), RPM, torque (N·m), belt length (ft).
- **Outputs:** belt length, velocity (ft/s), tension (N).
- **Formulas:** n₁d₁ = n₂d₂ · v = πdn/60 · T = P/v (net tension) · open belt L = π(d₁+d₂)/2 + 2D + (d₁−d₂)²/(4D).
- **Weak points:** mixed units; ratio direction not stated; open belt not labelled as such; no crossed belt; no example or FAQ; typos ("calcualtions", "Lenght").

### 4. Blocklayer — Pulley and Belt Calculator (metric)
- **Calculator:** solves any one of D₁, D₂, N₁, N₂.
- **Multi-set mode** for compound drives, with a centre distance per set.
- **Diagram:** scaled and printable, with full-scale on-screen measuring.
- **Weak points:** no belt length or wrap angle despite the title; no formulas; no FAQ; a lot of off-topic content.

### 5. Compressor Source — Pulley Size & RPM Ratio Calculator
- **Inputs:** motor RPM, motor pulley OD (in), pump flywheel OD (in), pump RPM. Enter any 3.
- **Formula:** RPM₁D₁ = RPM₂D₂ (4 rearrangements, all correct).
- **Error:** the two solve-for labels are **swapped**.
- **Weak points:** "pulley" and "flywheel" used interchangeably; no pump max RPM guidance; no example, author or date.

### 6. Omni — Pulley Calculator (belt drive; Bogna Szyk, reviewed by Steven Wooding)
- **Inputs:** power, centre distance, both pulleys (Ø, RPM, torque), belt length, velocity, tension. It solves for missing values.
- **Example checked:** d₁ 0.4 m, 1,000 RPM, d₂ 0.1 m, 1,500 W, D 1 m → 4,000 RPM, 20.94 m/s, L 2.808 m, F 71.6 N, T₁ 14.32, T₂ 3.58 N·m ✔.
- **FAQs (4):**
  1. belt length for two pulleys
  2. bike chainrings
  3. lifting yourself with pulleys (mechanical advantage, not covered by this tool)
  4. bike gears uphill
- **Weak points:** no centre distance from belt length, no wrap angle, no multi-stage, no pitch diameter, no date.

---

## 5. Patterns

- **Core maths:**
  - Speed: N₁D₁ = N₂D₂, so N₂ = N₁ × D₁/D₂ and D₂ = D₁ × N₁/N₂.
  - Ratio: speed ratio i = N₁/N₂ = D₂/D₁. We state this convention.
  - Torque (ideal): T₂ = T₁ × D₂/D₁, optionally × efficiency.
  - Belt speed: v = π × D₁ × N₁. **Set by the driver.**
- **Belt geometry:**
  - Open belt: L ≈ 2C + π(D₁+D₂)/2 + (D₂−D₁)²/(4C).
  - Crossed belt: L ≈ 2C + π(D₁+D₂)/2 + (D₁+D₂)²/(4C).
  - **Centre distance from belt length** (open): C = [b + √(b² − 8(D₂−D₁)²)]/8, where b = 2L − π(D₁+D₂).
  - **Wrap angle** on the small pulley: θ = 180° − 2·asin((D₂−D₁)/(2C)).
- **Multi-stage:** total ratio = product of the stage ratios.
- **Diameter and slip:**
  - Timing belts: use tooth counts (N₂ = N₁ × z₁/z₂).
  - V-belts: use pitch diameter, not OD.
  - Slip: N₂_actual = N₂ × (1 − s).
- **Wheel mode:** mph = RPM × π × D(in) × 60 ÷ 63,360. km/h = RPM × π × D(m) × 60 ÷ 1000.

| Section | Pages (of 6) |
|---|:---:|
| Driven RPM | 6 |
| Solve any unknown | 4 |
| Belt speed | 4 |
| Belt length | 2 calculators + 1 FAQ |
| Centre distance from length | **0** |
| Wrap angle | **0** |
| Multi-stage | 1 |
| Pitch diameter / timing teeth | **0** |
| Wheel RPM ↔ mph | **0** |

---

## 6. FAQ question bank

★ = asked on 2 or more pages, or a cluster keyword. Map to: pulley ratio calculator, pulley speed calculator, pulley size calculator, pulley ratio calc, rotations per minute to mph.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How do I calculate pulley ratio? | Calc.co.nz, Firgelli, Calctool · `pulley ratio calculator` |
| 2 | ★ How do I find the driven pulley speed (RPM)? | Calc.co.nz, Firgelli, Compressor · `pulley speed calculator` |
| 3 | ★ What pulley size do I need for a target RPM? | Compressor, Blocklayer · `pulley size calculator` |
| 4 | ★ How do I calculate belt speed? | Calc.co.nz, Firgelli, Omni |
| 5 | ★ How do I calculate belt length for two pulleys? | Firgelli, Omni, Calctool |
| 6 | Does a bigger pulley increase torque? | Firgelli, Calc.co.nz, Compressor |
| 7 | What centre distance do I need for my belt? | none |
| 8 | Should I use outside or pitch diameter? | none |
| 9 | How do I calculate a two-stage (compound) pulley drive? | Blocklayer (tool only) |
| 10 | How do I convert wheel RPM to mph? | none · `rotations per minute to mph` |
| 11 | How much does belt slip reduce speed? | Firgelli (uncited) |
| 12 | How do I slow down a drill press, lathe or router spindle with pulleys? | application intent |

---

## 7. Gaps nobody fills — our opportunities

1. **4-way solve** with a clearly stated ratio convention, plus a reduction/overdrive label.
2. **Belt geometry:** open and crossed belt length, **centre distance from a stock belt length**, and wrap angle with a low-wrap warning.
3. **Diameter type:** pitch vs outside diameter (V-belt), and a timing-belt tooth mode (link to Steps-per-mm #6).
4. **Multi-stage drive** (2–3 stages): total ratio and RPM at each shaft.
5. **Optional slip and efficiency.**
6. **Wheel RPM ↔ mph / km/h mode** (keyword file requirement).
7. **Correct physics in examples.** Belt speed is fixed by the driver; this fixes Firgelli's error.
8. **Unit freedom:** in/mm, ft/min, m/s, m/min, mph.
9. **Simple SVG diagram** that updates with the inputs (our own design).
10. **Application examples:** drill press, lathe, router spindle, compressor. Examples only, with no unsourced max-RPM claims.
11. **"RPM tools" hub links** to SFM ↔ RPM (#4) and Speeds and Feeds (#3).

---

## 8. Blueprint for the KKCTools Pulley Ratio & Belt Speed Calculator

### 8.1 SEO

- **URL:** `/pulley-calculator/`
- **Title:** Pulley Calculator – Ratio, Speed and Belt Size
- **H1:** Pulley Ratio Calculator: Driven Speed, Pulley Size and Belt Speed
- **Meta:** as in the keyword file (145 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Solve | Any one of D₁, D₂, N₁, N₂; ratio shown as i = D₂/D₁ (driver → driven) |
| Diameter type | Pitch / outside (note) · timing belt teeth mode |
| Outputs | Driven RPM, ratio, reduction/overdrive, ideal torque ratio (× efficiency optional), belt speed |
| Belt | Centre distance → open/crossed belt length; belt length → centre distance; wrap angle |
| Stages | Up to 3 stages → shaft RPMs, total ratio |
| Losses | Slip %, efficiency % (optional) |
| Wheel mode | Wheel Ø + RPM ↔ mph / km/h |
| Units | in/mm; ft/min, m/s, m/min |
| UX | Live SVG diagram, share URL, no network |

### 8.3 Content outline (≈ 1,100–1,400 words, original)

1. Intro (primary keyword) and convention note
2. How to use
3. Pulley ratio formula: example
4. Finding pulley size for a target RPM: example
5. Belt speed (and why the driven pulley doesn't change it)
6. Belt length and centre distance: example
7. Wrap angle and minimum centre distance
8. Compound (two-stage) drives
9. Timing belts and V-belt pitch diameter
10. Wheel RPM to mph
11. FAQ (10)
12. Related tools: SFM ↔ RPM (#4), Speeds and Feeds (#3), Steps-per-mm (#6)

### 8.4 Quality checks

- Unit tests for all solve directions, belt length ↔ centre distance (round trip), wrap angle, stages, slip, and mph.
- Re-check the examples in tests: 1,500 × 100/250 = 600; Omni-style geometry.
- No competitor wording copied. `npm run check:no-network` passes.
- `TODO(owner):` pull the Google top-10 SERP.
