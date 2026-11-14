# SFM ↔ RPM Calculator (Surface Speed) — Competitor Analysis

> **Target page:** KKCTools `/sfm-to-rpm-calculator/` (Batch 4, Tier 1 #4)
> **Primary keyword:** `sfm calculator` — US 1,300 · KD 17 · CPC $4.05 (cluster 17 keywords, 7,830 US vol, 4,930 on KD ≤ 15; CPC up to $14.39 on `sfm to rpm` / `rpm to ft min`)
> **SERP source:** ⚠ No Semrush SERP export for Batch 4. Competitors were taken from live web searches on 2026-11-14 for `sfm calculator` and `line speed calculator roller diameter rpm feet per minute`. `TODO(owner): pull Google top 10.`
> **Pages visited:** 2026-11-14. Read: 7 (Redline Tools, Productivity Inc, Calculator Academy ×2, Wikipedia, Fluent Conveyors, plus the Omni speeds-and-feeds page from file 03). Blocked: Machining Doctor SFM→RPM chart (403).

---

## 0. How this was collected (read first)

- **Tooling distributors:**
  - Redline Tools and Productivity Inc. Each has a separate SFM page and RPM page with the same template and the same `.262` constant.
- **Calc site:**
  - Calculator Academy has three pages: m/min ↔ SFM, RPM → feet per minute, and drill SFM.
- **Reference:**
  - Wikipedia "Surface feet per minute".
- **Line / belt speed** (`line speed calculator`, 590 vol, KD 1):
  - Calculator Academy RPM → FPM, which includes a conveyor example.
  - Fluent Conveyors, a conveyor maker's blog.
- **Also in the SERP, not read:**
  - Kennametal (JS-only, see file 03).
  - CNCCookbook.
  - Machining Doctor (403). `TODO(owner)`: check in a browser. It is likely the best chart benchmark.
  - Thin programmatic sites (everycalculators, pages.dev, ultimatefinancecalculator, codingace).
  - Omni "SCFM", which is an unrelated gas-flow tool. **Keyword ambiguity:** "SCFM" is a different thing, so our page should say once that it is about machining surface speed.
- **SERP overlap check (keyword file note):** the `sfm calculator` results (Redline, Productivity, Calculator Academy, Machining Doctor) are **mostly different** from the `feeds and speeds calculator` results (Omni, Firgelli, GoodCalculators, tool makers). Only Kennametal appears in both. **Recommendation: keep a separate URL** that shares the engine with Tool #3. `TODO(owner)`: confirm with a real SERP pull.
- Arithmetic was re-checked. No competitor text is copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | redlinetools.com/resources/surface-feet-per-minute-calculator | Tooling distributor | Surface Feet Per Minute Calculator | ~110 |
| 2 | productivity.com/resource/calculators/surface-feet-per-minute-calculator/ | Tooling distributor | Surface Feet Per Minute Calculator | ~150 |
| 3 | calculator.academy/m-min-to-sfm-calculator/ | Calc site | m/min To SFM Calculator | 700–800 |
| 4 | calculator.academy/rpm-to-feet-per-minute-calculator/ | Calc site | RPM To Feet Per Minute Calculator | 1,300–1,500 |
| 5 | wikipedia.org/wiki/Surface_feet_per_minute | Reference | Surface feet per minute | ~220 |
| 6 | fluentconveyors.com/blog/how-to-calculate-the-speed-of-a-conveyor-belt | Conveyor maker blog | How To Calculate Conveyor Belt Speed | ~800 |
| 7 | omnicalculator.com/physics/speeds-and-feeds | Giant | Speeds and Feeds Calculator (SFM → RPM inside) | 1,000–1,200 |
| — | machiningdoctor.com/charts/sfm-to-rpm/ | Machining reference | SFM to RPM chart | **blocked (403)** |

**What this tells us:**
- **The distributor pages that rank are tiny:**
  - Two inputs labelled only "D" and "RPM", with no units.
  - Imperial only.
  - One direction per page.
  - No example and no FAQ.
  - Both define SFM wrongly as "Surface **Feed** (Feet) Per Minute".
- **Calculator Academy is the content benchmark:**
  - Solve-for modes, unit choices and m/min.
  - 10 SFM → RPM examples and conversion tables, all of which check out.
  - Weak spots: no FAQ, no metric worked example, a garbled unit label, and one duplicated example.
- **Line/belt speed is a separate audience** (conveyors, rollers, fans). Only Calculator Academy's RPM → FPM page and Fluent's blog cover it, and Fluent's mph conversion is wrong.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Redline | Productivity | CA m/min↔SFM | CA RPM→FPM | Wikipedia | Fluent | Omni |
|---|---|---|---|---|---|---|---|
| SFM from RPM and diameter | ✅ | ✅ | ❌ | ✅ | ✅ formula | ❌ | ❌ |
| RPM from SFM and diameter | ⚠️ separate page | ⚠️ separate page | ✅ (optional) | ✅ | ✅ formula | ❌ | ✅ |
| Solve for diameter | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| m/min ↔ SFM | ❌ | ❌ | ✅ (exact 0.3048) | ⚠️ output unit | ⚠️ m/s note | ❌ | ⚠️ formula |
| Diameter in inches and mm | ❌ (unlabelled) | ❌ | ✅ | ⚠️ garbled label | ❌ | ❌ | ⚠️ |
| Other speed units (ft/s, mph, m/s, in/min) | ❌ | ❌ | ❌ | ✅ | ❌ | ⚠️ (mph wrong) | ❌ |
| rad/s input | ❌ | ❌ | ❌ | ✅ (not explained) | ❌ | ❌ | ❌ |
| Line / belt / conveyor speed | ❌ | ❌ | ❌ | ✅ example | ❌ | ✅ text | ❌ |
| Gear ratio (motor → roller) | ❌ | ❌ | ❌ | ✅ example (30:1) | ❌ | ✅ formula | ❌ |
| Belt thickness / pitch diameter | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Quick chart (diameters × SFM) | ❌ | ❌ | ✅ conversion table | ✅ shaft-speed table | ❌ | ❌ | ❌ |
| Material SFM guidance | ❌ (claims it, has none) | ❌ (claims it) | ❌ (declines, correctly) | ⚠️ example ranges | ⚠️ one example (303 SS HSS 120) | ❌ | ✅ presets (hidden) |
| Machine max-RPM check | ❌ | ❌ | ⚠️ brief note | ❌ | ❌ | ❌ | ❌ |
| Decimal / rounding control | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Redline | Productivity | CA m/min | CA RPM→FPM | Wiki | Fluent | Omni |
|---|---|---|---|---|---|---|---|
| Formula shown | ✅ .262 × D × RPM | ✅ same | ✅ ÷ 0.3048 | ✅ π/12 = 0.2618 | ✅ 0.2618 | ✅ (no units) | ✅ |
| Constant explained (π/12, 12/π ≈ 3.82) | ❌ | ❌ | ✅ 3.82 | ✅ | ⚠️ | ❌ | ⚠️ |
| Worked examples | ❌ | ❌ | ✅ (checked) | ✅ 10 + tables (checked; one duplicate) | ❌ | ❌ (mph example wrong) | ✅ |
| Definition correct | ❌ "Surface Feed" | ❌ "Surface Feed" | ✅ (Vc/SMM wording muddled) | ✅ | ✅ | ✅ | ✅ |
| FAQ count | 0 | 0 | 0 | 0 | 0 | 3 (1 wrong) | 0 |
| Named author | ❌ | ❌ | ✅ (BSME) | ✅ | n/a | ❌ | ✅ |
| Date | ❌ | ❌ | ✅ Oct 2026 | ✅ Oct 2026 | n/a | ❌ | ❌ |
| Safety note | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ one line | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. Redline Tools — Surface Feet Per Minute Calculator
- **Inputs:** two bare fields, D and RPM. No units, no defaults, and no visible output area.
- **Formula:** SFM = .262 × D × RPM. This is correct for D in inches; π/12 = 0.2618.
  - Check: D 0.5 in at 3,000 RPM gives 393 SFM. The exact value is 392.7.
- **Reverse:** a separate "RPM calculator" page uses RPM = 3.82 × SFM ÷ D.
- **Errors and weaknesses:**
  - Wrong abbreviation: "Surface Feed (Feet) Per Minute".
  - Circular definition.
  - Claims it checks speed "for the material" but has no material input.
  - No metric, no example, no FAQ, no author, no date.

### 2. Productivity Inc — Surface Feet Per Minute Calculator
- **Same template as Redline**, including the same abbreviation error and the same `.262` constant.
  - Check: D 1 in at 1,000 RPM gives 262 (exact 261.8).
- **Weaknesses:**
  - No reverse calculation on the same page.
  - No units and no metric.
  - Boilerplate location lists.
  - The feed calculator is named inconsistently in its menus.

### 3. Calculator Academy — m/min to SFM (Patrick Myers, BSME, updated Oct 2026)
- **Inputs:**
  - Direction toggle.
  - Surface speed.
  - Optional diameter (mm/in) to get RPM.
  - Decimal-places selector.
- **Conversion:**
  - SFM = m/min ÷ 0.3048 (exact). Checked: 244 m/min = 800.52 SFM, and 800 SFM = 243.84 m/min.
  - RPM: at 12 mm and 244 m/min, 1000 × 244 ÷ (π × 12) = 6,472 RPM ✔.
  - The conversion table is correct.
  - It explains the diameter to use: the effective diameter at depth of cut when milling, and the machined diameter when turning. This is a good point.
- **Weaknesses:**
  - No FAQ.
  - Calls "Vc" a unit and uses "SMM" as a label without explaining either.
  - Repeated share and embed clutter.

### 4. Calculator Academy — RPM to Feet Per Minute (updated Oct 2026)
- **Inputs:**
  - Solve for surface speed, RPM or diameter.
  - RPM or rad/s.
  - Diameter in in/ft/m. The unit label is garbled.
  - Output in ft/min, ft/s, mph, m/min, m/s or in/min.
- **Content:**
  - 10 SFM → RPM examples.
  - A 4 in conversion table (20 rows).
  - A shaft-speed table (7 diameters × 4 RPMs). Examples: 2 in at 1,725 RPM = 903 fpm; 24 in at 3,600 RPM = 22,619 fpm.
  - A conveyor example: 1,750 RPM motor with a 30:1 gearbox and a 6 in roller gives 91.6 fpm ✔.
  - A fan tip-speed example: 48 in at 1,750 RPM = 21,991 fpm ✔.
- **Weaknesses:**
  - Example 8 duplicates Example 3.
  - Ignores belt thickness.
  - No metric worked example.
  - No FAQ.
  - Empty screenshot placeholder.

### 5. Wikipedia — Surface feet per minute
- **Definition:** SFM (or SFPM) is the linear feet a point on a rotating surface travels per minute.
  - RPM = SFM ÷ (0.2618 × D).
  - 1 SFM = 0.00508 m/s.
  - Milling uses the tool diameter.
- **Content:** one example (303 stainless with HSS at about 120 SFM) and one reference (the Brown & Sharpe handbook). No table.

### 6. Fluent Conveyors — How to Calculate Conveyor Belt Speed
- **Formulas:**
  - Speed = roller circumference × RPM.
  - With a gearbox: ÷ gear ratio.
  - Gives no units.
- **Method:** a tachometer measurement method in 7 steps.
- **Error:** "500 ft/min = 0.094 mph" is wrong. The correct value is **5.68 mph** (500 × 60 ÷ 5,280). The m/s conversion of 2.54 is correct.
- **Weaknesses:**
  - No calculator and no worked example of the main formula.
  - No belt-slip or belt-thickness discussion.
  - No author or date.
  - Broken #overview anchor.

### 7. Omni — Speeds and Feeds (SFM → RPM inside)
- See file 03. It gives an RPM range from preset or typed SFM, with formulas in both systems.
- It has no SFM-only page, which is a gap our dedicated URL can fill.

---

## 5. Patterns

- **The maths (exact):**
  - SFM = π × D(in) × RPM ÷ 12 (≈ 0.2618 × D × RPM).
  - RPM = 12 × SFM ÷ (π × D) (≈ 3.8197 × SFM ÷ D).
  - Metric: Vc (m/min) = π × D(mm) × RPM ÷ 1000, and RPM = 1000 × Vc ÷ (π × D).
  - 1 SFM = 0.3048 m/min, and 1 m/min = 3.28084 SFM.
- **Rounded constants:**
  - Competitors use rounded constants (.262, 3.82). We compute with π and **show** the shortcut constants as a note.
- **Line / belt speed:**
  - v = π × D_eff × RPM, where D_eff = roller diameter + belt thickness for belt-line speed (an optional input).
  - With a gearbox: roller RPM = motor RPM ÷ ratio.
  - Slip is optional (percent).
- **Diameter guidance:**
  - Turning: the workpiece's machined diameter.
  - Milling and drilling: the tool diameter, or the effective diameter at DOC for ball and bull-nose cutters.
  - Only Calculator Academy explains this.

| Section | Pages (of 7) |
|---|:---:|
| Formula | 7 |
| Both directions on one page | 3 |
| Metric | 3 (1 complete) |
| Chart / table | 2 |
| Line / belt speed | 2 |
| FAQ | 1 (with an error) |
| Correct SFM definition | 5 |

---

## 6. FAQ question bank

★ means the question is asked on 2 or more pages, or is itself a cluster keyword. Map each answer to the cluster keywords: sfm to rpm, sfpm calculator, rpm to ft min, how do i calculate rpm, how do you calculate revolutions per minute, m/min to sfm, surface footage calculator, line speed calculator, fpm to rpm.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How do I convert SFM to RPM? | Redline, Productivity, CA, Wiki · `sfm to rpm` |
| 2 | ★ How do I calculate RPM (revolutions per minute)? | `how do i calculate rpm`, `how do you calculate revolutions per minute` |
| 3 | ★ What does SFM (SFPM) mean? | all |
| 4 | ★ How do I convert RPM to feet per minute? | CA · `rpm to ft min`, `rpm to feet per minute` |
| 5 | ★ How do I convert m/min to SFM? | CA · `m/min to sfm` |
| 6 | Why 3.82 (or 0.262) in the formula? | CA, Redline |
| 7 | Which diameter do I use: tool or workpiece? | CA, Wiki |
| 8 | How do I calculate conveyor or line speed from roller RPM? | CA, Fluent · `line speed calculator` |
| 9 | How does a gearbox change line speed? | CA, Fluent |
| 10 | What SFM should I use for aluminium, steel or stainless? | Wiki (1 example) · link to Tool #3 |
| 11 | What if the RPM is above my machine's maximum? | link to Tool #3 |
| 12 | What is the difference between SFM and SCFM? | SERP confusion (Omni SCFM) |

---

## 7. Gaps nobody fills — our opportunities

1. **One page with a 3-way solve** (SFM, RPM, diameter) and **full unit freedom**: in/mm diameter, SFM ↔ m/min, plus ft/s, m/s and mph for line speed. The distributor pages are one-way and imperial only.
2. **Correct definition and exact π maths**, with the 3.82 and 0.262 shortcuts explained, not hidden.
3. **Quick chart**: an RPM grid for common diameters (1/16–2 in and 1–50 mm) × common SFM values. The keyword file requires this, and it must be generated by our own code, not copied from Calculator Academy or Machining Doctor.
4. **Line / belt speed mode**:
   - roller diameter, optional belt thickness
   - gearbox ratio, optional slip
   - output in fpm, m/min and mph (correctly; Fluent got mph wrong)
5. **Diameter guidance** for turning vs milling vs ball-end effective diameter.
6. **Machine max-RPM warning**, with a link to Speeds and Feeds (#3) for chip load and feed.
7. **Correct worked examples** in both unit systems.
8. **FAQ** with 10+ answers. Most competitors have none.
9. **Clarify SCFM vs SFM** to catch confused searchers.

---

## 8. Blueprint for the KKCTools SFM ↔ RPM Calculator

### 8.1 SEO

- **URL:** `/sfm-to-rpm-calculator/`
- **Title:** SFM to RPM Calculator – Surface Feet per Minute
- **H1:** SFM to RPM Calculator: Surface Speed, RPM and Feet per Minute
- **Meta:** as in the Batch 4 keyword file (139 chars).
- **H2s:** sfm to rpm · rpm to sfm / rpm to feet per minute · m/min to sfm · line speed calculator · how do I calculate rpm.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Solve for | SFM / Vc · RPM · Diameter |
| Units | Diameter in in/mm; surface speed in SFM ↔ m/min (also ft/s, m/s, mph in line mode) |
| Line mode | Roller/pulley diameter, belt thickness (optional), gear ratio (optional), slip % (optional) → line speed and roller RPM |
| Chart | Generated RPM table: chosen SFM range × common diameters (imperial and metric tabs), printable |
| Checks | Optional machine max RPM warning; inputs must be positive |
| Display | Exact result, rounding selector, shortcut-constant note |
| UX | Share URL, copy result, no network; shares the engine with Tool #3 |

### 8.3 Content outline (≈ 1,200–1,500 words, original)

1. Intro (primary keyword): what SFM is, with a correct definition
2. How to use
3. SFM to RPM formula and examples (inch and metric)
4. RPM to SFM / feet per minute, with an example
5. m/min ↔ SFM conversion
6. Which diameter to use (turning, milling, ball end)
7. Line, belt and conveyor speed (gearbox, belt thickness), with an example
8. RPM quick chart
9. Choosing SFM for a material (short, with a link to Speeds and Feeds #3)
10. FAQ (10–12), including SFM vs SCFM
11. Related tools: Speeds and Feeds (#3), Pulley Ratio and Belt Speed (#7), Thread Pitch (#8)

### 8.4 Quality checks

- Unit tests for every solve direction, both unit systems, line mode with gearbox and belt thickness, and chart generation.
- Unit tests that re-check the page examples, including 500 fpm = 5.68 mph.
- No competitor wording or tables copied. `npm run check:no-network` passes.
- `TODO(owner):` pull the Google top-10 SERP and confirm the separate URL against Tool #3 (keyword-file note); check Machining Doctor and Kennametal manually.
