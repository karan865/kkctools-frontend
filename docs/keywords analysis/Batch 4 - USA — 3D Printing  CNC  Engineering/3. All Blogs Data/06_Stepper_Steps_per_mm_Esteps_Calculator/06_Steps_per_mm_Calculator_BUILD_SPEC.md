# Steps per mm & E-steps Calculator — Build Spec

> **URL:** `/steps-per-mm-calculator/` · Batch 4 · Tier 2 · **Build order 7**
> **Read first:** `../00_BATCH4_BUILD_RULES.md`
> **Inputs:** `06_Stepper_Steps_per_mm_Esteps_Calculator_Competitor_Analysis.md`, keyword file §2 #6
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**Volume:** `stepper motor calculator` is 720 at KD 14. The calibration cluster is big on paper, but the 27,100 row is **irregular and unreliable**. Use it for H2s only.

**Competitors:**
- Calculator Academy is the most complete, and correct. But it has no axis test-cube correction, no GRBL output and no Klipper config line.
- Firgelli gets the correction direction wrong.

**Firmware commands differ** between Marlin/RRF, Klipper and GRBL: show all three, clearly labelled.

### Research notes from the competitor analysis (added 2026-11-22)

- The keyword splits: **electrical** "stepper motor calculator" (RS Components, ElectronicsForU: current, inductance, voltage → speed/power, unexplained formulas) vs **mechanical** steps/mm (Firgelli, Calculator Academy, Tembrica, LightBurn). We are mechanical, with a short electrical strip (step angle → steps/rev, RPM ↔ pulse Hz) and one FAQ, and **no unsourced power formulas**.
- **Firgelli's over/undersize troubleshooting is backwards.** Our copy states the correct direction with an example.
- Calibration reference in the community: Ellis' Print Tuning Guide (cite if used). PrintPal is e-steps-only and suggests "93" as a Creality default; we say "read your value with M503; don't trust defaults".

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | stepper motor calculator | 720 | 14 | title, H1, first sentence |
| Natural | steps per mm calculator · e steps calculator · esteps calibration · rotation distance | — | — | title, H2s (`TODO(owner)`: pull volumes) |
| Secondary | 3d printing calibration · 3d printer calibration | 720 · 1,600 | 13–21 | H2 "Calibration order: e-steps, flow, then axes" |
| Secondary (irregular) | how to calibrate a 3d printer | 27,100 ⚠ | 18 | H2 wording only; don't rely on the volume |

## 2. Our edge

- **All modes in one tool:**
  - belt (GT2/GT3/HTD/custom pitch × teeth);
  - lead screw (pitch × starts or TPI);
  - extruder from hardware (gear ratio, drive gear Ø);
  - **e-steps calibration**;
  - **axis calibration** (commanded vs measured);
  - rotary (steps/°).
- **Firmware output tabs:**
  - Marlin/RRF: `M92 X.. Y.. Z.. E..`, then `M500`; read the current values with `M503`.
  - Klipper: `rotation_distance` lines for `printer.cfg`.
  - GRBL: `$100` / `$101` / `$102`.
  - Each has a copy button.
- **Correct correction direction**, with an example: new = current × requested ÷ actual.
- **Iteration history:** the result becomes the next "current".
- **Measurement helper:** mark length − remaining = actual extruded; under/over-extrusion % with the sign explained.
- **Step-rate check:** step frequency at max speed. Any "too high for 8-bit boards" threshold **only with an owner-approved source**; otherwise just show the Hz.
- **Electrical strip:** step angle → steps/rev; RPM ↔ pulse Hz. No unsourced power formulas.

## 3. Calculator spec

### 3.1 Tabs

1. **Belt axis** (default)
2. **Lead screw**
3. **Extruder e-steps calibration**
4. **Axis calibration**
5. **Extruder from hardware / rotary**

### 3.2 Input guide diagram (above the inputs)

`StepsInputGuide.tsx`

- **Belt tab:** a motor ("1 Step angle → steps per rev") with a microstep switch ("2 Microsteps"), a toothed pulley ("3 Pulley teeth") and a belt with tooth spacing ("4 Belt pitch").
- **Lead screw tab:** a screw with "Lead = pitch × starts".
- **E-steps tab:** filament with a mark at "5 Mark distance (e.g. 120 mm)", an arrow "6 Requested extrusion (e.g. 100 mm)" and "7 Remaining to mark", giving "Actual extruded".
- **Axis tab:** a test cube with "Commanded size" vs "Measured size".

Live values; the focused field highlights.

### 3.3 Inputs (defaults = examples)

| Field | Default |
|---|---|
| Step angle | 1.8° (200 steps/rev); options 0.9°, 7.5°, custom |
| Microsteps | 16 (1–256) |
| Belt pitch | 2 mm (GT2) |
| Pulley teeth | 20 |
| Lead screw | 8 mm lead (T8: 2 mm pitch × 4 starts) |
| E-steps | current 93; requested 100 mm; mark 120 mm; remaining 25 mm → actual 95 mm |
| Axis | current, commanded 20 mm, measured |
| Max speed | for the step-rate check: optional |

These defaults are **example hardware values, labelled as such**.

### 3.4 Engine (`src/lib/steps-engine.ts`)

```ts
stepsPerRev = 360 / stepAngle
belt = stepsPerRev * microsteps / (pitch * teeth)
leadScrew = stepsPerRev * microsteps / lead          // lead = pitch * starts ; TPI → 25.4/TPI
extruderHw = stepsPerRev * microsteps * gearRatio / (π * driveGearDia)
eStepsNew = current * requested / actual ; actual = mark - remaining ; errorPct = (actual - requested)/requested
axisNew = current * commanded / measured
rotationDistance = stepsPerRev * microsteps / stepsPerMm   // Klipper (full steps per rotation × microsteps ÷ steps/mm)
stepHz = stepsPerMm * speed_mm_s
firmware(lines): Marlin "M92 E97.89" + "M500" ; Klipper "rotation_distance: …" ; GRBL "$100=…"
```

**Worked examples (checked 2026-11-22):**

| Setup | Result |
|---|---|
| 200 steps × 16 µsteps ÷ (2 mm × 20 teeth) | **80 steps/mm** (Klipper rotation_distance 40) |
| T8 lead screw (8 mm lead) | **400 steps/mm** |
| E-steps: 93 × 100 ÷ 95 | **97.89** |

### 3.5 Outputs

- **Headline:** steps/mm (and steps/in).
- **Sentence:** "A 1.8° motor at 16 microsteps on a GT2 belt with a 20-tooth pulley needs 80 steps per mm (Klipper rotation_distance: 40)."
- Resolution (µm per microstep); step Hz.
- Firmware tabs with copy buttons; iteration history.
- **Safety/clarity note:** "Back up your config. `M500` saves to EEPROM only if your firmware supports it."

### 3.6 Tests

- Belt, lead screw (TPI path), extruder hardware.
- E-steps correction direction (under-extrusion raises e-steps).
- Axis correction; rotation_distance.
- Firmware strings exact; the examples. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Steps per mm Calculator – Stepper & E-steps` (43; 55 with the suffix: OK) |
| Meta | `Free steps per mm calculator for 3D printers and CNC machines. Work out stepper steps per mm for belts, lead screws and extruders, and correct your e-steps.` (156) |
| H1 | `Steps per mm Calculator: Stepper Motors, E-steps and Calibration` |
| BLUF | "Steps per mm = (motor steps per revolution × microsteps) ÷ (belt pitch × pulley teeth). A 1.8° motor at 16 microsteps with a GT2 belt and 20-tooth pulley needs 80 steps/mm. To fix e-steps: new = current × requested ÷ measured." (engine) |
| ToolShell pills | `Belt, lead screw & extruder`, `E-steps & axis calibration`, `Marlin, Klipper & GRBL lines`, `Copy-ready G-code` |
| Links out | 3D Print Cost (#2), Pulley (#7), Speeds & Feeds (#3) |
| Links in | 3D Print Cost, Pulley, Tools hub "Maker" |

## 5. Content (~1,600–1,900 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the stepper motor calculator | Tabs | 100 |
| 2 | Steps per mm for belt-driven axes | Formula + example | 180 |
| 3 | Steps per mm for lead screws | Pitch × starts, TPI | 150 |
| 4 | How to calibrate e-steps | Step-by-step with the mark method, our wording | 250 |
| 5 | Calibration order: e-steps, flow, then axes | Our wording (`3d printer calibration`) | 180 |
| 6 | Axis calibration with a test cube | Example + caveat (backlash, belt tension first) | 150 |
| 7 | Marlin, Klipper and GRBL: entering the values | Commands explained | 200 |
| 8 | Microstepping and resolution | Resolution example; no unsourced torque claims | 130 |
| 9 | FAQ | §6 | 380 |

## 6. FAQ (12, from the competitor question bank + cluster keywords)

1. How do I calculate steps per mm for a GT2 belt with a 20-tooth pulley? (80)
2. How do I calculate steps per mm for a lead screw (T8, multi-start)? (400)
3. How do I calibrate extruder e-steps?
4. What is microstepping, and which setting should I use?
5. How do I convert steps/mm to Klipper rotation_distance?
6. How do I save new values (M92, M500, M503)?
7. My parts are too big or too small: should I raise or lower steps/mm?
8. What are the default e-steps for my printer? (read with M503)
9. Should I calibrate e-steps hot or cold? (cite the guide used)
10. E-steps vs flow rate: what's the difference?
11. How do I calibrate a 3D printer (e-steps, flow, axes, bed)?
12. What does a stepper motor calculator compute (step angle, RPM, pulse rate)?

## 7. Done when

- [ ] `steps-engine.ts` + tests; `npm run verify` passes.
- [ ] InputGuide per tab above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Firmware lines exact and labelled; no unsourced thresholds.
- [ ] Registrations + docs; `graphify update .`.
