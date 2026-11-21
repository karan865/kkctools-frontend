# Ideal Weight Calculator (by Height) — Build Spec

> **URL:** `/ideal-weight-calculator/` · Batch 8 · Tier 1 · **Build order 12** (YMYL)
> **Read first:** `../00_BATCH8_BUILD_RULES.md` (Part 2 §10 rules 1 and 4; **Part 3 §16–§18**; §13 Health hub)
> **Inputs:** `12_Ideal_Weight_Calculator_Competitor_Analysis.md`, keyword file §2 #12
> **SERP:** provisional
> **Written:** 2026-11-22
> **Blocking `TODO(owner)` before launch:** a qualified reviewer; confirm the Robinson and Miller coefficients (§17).

---

## 0. Strategy

**16 keywords, ≈ 91,100 searches:**
- primary `compute ideal weight` **12,100 / KD 0**; `figuring out ideal body weight` **14,800 / KD 6**; `how much must i weigh` 2,400 / KD 0 (irregular); `ideal body weight` 6,600;
- **height-and-sex long tail (13 phrases ≈ 61,800, KD 2–27):** `correct weight for 5'2 female` 9,900, `correct weight for 5' 4 female` 8,100, `5 4 ideal weight woman` 5,400, `appropriate weight for 5' 7 female` 5,400, `healthy weight 5'5 woman` 4,400, `ideal weight for 5 7 female` 1,600;
- "average" rows (`average body weight for 5'7 female` 3,600, `average weight for 5'11 male` 3,600) ask for population averages; **we don't publish averages without a cited dataset** (FAQ explains and points to the healthy range).

**Rules (keyword file, YMYL):** a **range, never one "ideal" number**; every formula named and sourced; "estimate, not medical advice"; a reviewer before launch.

**Our angle:** show the four classic formulas as a range **next to** the CDC healthy-BMI range, explain that the formulas were made for drug dosing and diet planning (not personal targets), and publish a correct height–weight chart. Competitors are inconsistent on the BMI range and have chart errors.

### Research notes from the competitor analysis

- **Pages read:** Calculator.net, Inch Calculator IBW, FatCalc IBW, Omni ideal weight, CDC adult BMI categories.
- **Calculator.net:** worked example for a 5'10" man (Devine 73, Robinson 71, Miller 70.3, Hamwi 75 ✔) but **its displayed sample results (72.6 / 71.5 / 75.0 / 77.3) don't match the example**; it asks for age 2–80 and never uses it; its "healthy BMI range 59.9–81 kg" for 5'10" **doesn't match CDC's 18.5 to < 25** (node: 58.5–79.0 kg).
- **Inch:** clinical authors and reviewers (DO, RDN, DC) and 4 formulas, but **its BMI range is 18.5–25, 18.5–24.9 and 19–24.9 in different places**, the 67″ chart row duplicates 66″, a citation points to the wrong paper; no disclaimer.
- **FatCalc:** cleanest reference (frame ±10 %, WHO TRS 894, 8 references) but no example, FAQ, author or date.
- **Omni:** 7 formulas (incl. Broca, Lorentz, Peterson), height limit 153–272 cm, clinical disclaimer, but "four formulas" while listing six/seven; source list starts at 3.
- **0 of 4** present the range as the main answer or a correct chart; only Omni guards heights under 5 ft.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | compute ideal weight | 12,100 | 0 | first sentence, H2 "How to compute ideal weight", ToolShell heading |
| Secondary | figuring out ideal body weight · ideal body weight | 14,800 · 6,600 | 6 | intro, H2 "The four ideal body weight formulas" |
| Secondary | how much must i weigh | 2,400 | 0 | FAQ 6 |
| Long tail (one chart) | correct weight for 5'2 female · correct weight for 5' 4 female · 5 4 ideal weight woman · appropriate weight for 5' 7 female · healthy weight 5'5 woman · ideal weight for 5 7 female … (13) | ≈ 61,800 | 2–27 | **height–weight chart** (rows "5'2"", "5'4"" with hash anchors `#5-4-female`), quick-answer line for 5'4" woman and 5'10" man, H2 "Healthy weight for women by height" / "…for men by height" |
| FAQ (no data published) | average body weight for 5'7 female · average weight for 5'11 male | 3,600 · 3,600 | — | FAQ 9 (why we show a healthy range, not an average) |

## 2. Our edge

- **Range-first answer:** the 4-formula range **and** the CDC healthy-BMI weight range (18.5 to under 25), side by side, in kg and lb.
- **Each formula named with its year, purpose and status** (Devine 1974, Robinson 1983, Miller 1983, Hamwi 1964; Hamwi computed in its native pounds).
- **Guards:** adults (CDC: 20+) only; under 18 → link to the BMI calculator for children (#24, later); **under 5 ft → warning** ("these formulas start at 5 ft; use the BMI range"), results greyed; not for pregnancy or drug dosing.
- **Frame size** (Hamwi ±10 %, labelled "traditional adjustment, not evidence-based").
- **Optional current weight:** where it sits against both ranges, with neutral wording (no goals pushed).
- **Correct, engine-generated chart** 4'10"–6'6" for women and men, printable.
- **YMYL safeguards:** reviewer line, methodology link, no dosing advice.

## 3. Calculator spec

### 3.1 Tabs

1. **My range** (default)
2. **Height–weight chart**
3. **Formulas explained**

### 3.2 Input guide diagram (above the inputs)

`IdealWeightInputGuide.tsx`: a height ruler beside a weight scale with two shaded bands.

- "1 Height" on the ruler (5'10"); "2 Sex" toggle chips; "3 Frame (optional)"; "4 Current weight (optional)" as a needle on the scale.
- Scale bands: a narrow dark band "Formula range 155–166 lb" inside a wide light band "Healthy BMI range 129–174 lb" (labels + numbers, not colour alone).
- **Chart tab:** a mini table row "5'4" woman · 120–129 lb · 108–146 lb".
- Live values; the focused field highlights.

### 3.3 Inputs

| Field | Default |
|---|---|
| Units | ft/in + lb (ft/in · cm + kg) |
| Height | 5 ft 10 in (cm accepted; 4'6"–7'0" allowed; under 5'0" → warning) |
| Sex | required for the formulas (female · male) |
| Age | optional; only used for the adults-only note (under 20 → CDC adult categories don't apply) |
| Frame | medium (small · medium · large: Hamwi ±10 %) |
| Current weight | optional |

### 3.4 Engine (`src/lib/body-metrics-engine.ts`)

```ts
inchesOver5 = heightIn − 60 (exact: cm / 2.54)
devine   (kg) = male 50 + 2.3·o ; female 45.5 + 2.3·o
robinson (kg) = male 52 + 1.9·o ; female 49 + 1.7·o      // citation to confirm
miller   (kg) = male 56.2 + 1.41·o ; female 53.1 + 1.36·o // citation to confirm
hamwi    (lb) = male 106 + 6·o ; female 100 + 5·o ; frame small −10 %, large +10 % ; kg = lb × 0.45359237
range = [min, max] of the four ; bmiRange = [18.5·h², 25·h²) with h in metres (upper bound "under")
underFiveFeet = o < 0 → warning flag (values still computed for transparency, greyed)
bmi(current) = kg / h² → CDC category label (screening only)
chart(heights 58..78 in, both sexes) → {height, formulaRangeLb, formulaRangeKg, bmiRangeLb, bmiRangeKg}
```

**Worked examples (checked with node, 2026-11-22):**

| Input | Devine | Robinson | Miller | Hamwi | **Formula range** | **CDC healthy BMI range** |
|---|---:|---:|---:|---:|---|---|
| **Man, 5'10"** | 73.0 | 71.0 | 70.3 | 75.3 (166 lb) | **70.3–75.3 kg (155–166 lb)** | **58.5–79.0 kg (129–174 lb)** |
| **Woman, 5'4"** | 54.7 | 55.8 | 58.5 | 54.4 (120 lb) | **54.4–58.5 kg (120–129 lb)** | **48.9–66.1 kg (108–146 lb)** |
| Woman, 5'2" | 50.1 | 52.4 | 55.8 | 49.9 | 49.9–55.8 kg (110–123 lb) | 45.9–62.0 kg (101–137 lb) |
| Woman, 5'5" | 57.0 | 57.5 | 59.9 | 56.7 | 56.7–59.9 kg (125–132 lb) | 50.4–68.1 kg (111–150 lb) |
| Woman, 5'7" | 61.6 | 60.9 | 62.6 | 61.2 | 60.9–62.6 kg (134–138 lb) | 53.6–72.4 kg (118–160 lb) |
| Man, 5'11" | 75.3 | 72.9 | 71.7 | 78.0 | 71.7–78.0 kg (158–172 lb) | (133–179 lb) |
| Man, 6'0" | 77.6 | 74.8 | 73.1 | 80.7 | 73.1–80.7 kg (161–178 lb) | 61.9–83.6 kg (136–184 lb) |
| Woman, 4'10" | 40.9 | 45.6 | 50.4 | 40.8 | **warning: under 5 ft** | 40.2–54.3 kg (89–120 lb) |

Calculator.net's 5'10" example (73 / 71 / 70.3 / 75) matches ours; its BMI range (59.9–81 kg) does not match CDC.

### 3.5 Outputs

- **Headline:** two bands: "Formula range 155–166 lb" and "Healthy BMI range 129–174 lb" (never a single "ideal").
- **Sentence:** "For a 5'10" man, the four classic formulas give 155–166 lb (70.3–75.3 kg). The CDC's healthy BMI range for that height is 129–174 lb. These are estimates for adults, not medical advice."
- The four results with name, year, purpose; frame adjustment; current-weight position + BMI category (CDC, screening only).
- Chart (women and men), print, hash anchors.
- **Safety box** + reviewer line + methodology link.
- Share URL (`?h=70&sex=m&u=imp`).
- Links: BMI (#24), Body Fat (#19), Weight Loss Date (#25), TDEE (#20) when live; Heart Rate Zones (#11); Army WHtR (#9).

### 3.6 Tests

- Each formula for both sexes vs the table; Hamwi native lb; exact unit conversions.
- Range and BMI range (upper bound exclusive); frame ±10 %.
- Under-5-ft flag; adults-only note; cm input.
- Chart rows 4'10"–6'6" (both sexes) match single calls.
- Current weight → BMI category boundaries (18.5, 25, 30, 35, 40).
- Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Ideal Weight Calculator – By Height and Sex` (43; 55 with the suffix: OK) |
| Meta | `Free ideal weight calculator. See the healthy weight range for your height and sex using four named formulas and the BMI range, with a height-weight chart.` (155) |
| H1 | `Ideal Weight Calculator: Healthy Weight for Your Height` |
| BLUF | "Enter your height and sex to compute ideal weight as a range, not a single number. For a 5'10" man the four classic formulas give 155–166 lb, and the CDC's healthy BMI range for that height is 129–174 lb; for a 5'4" woman it's 120–129 lb and 108–146 lb. These are estimates for adults, not medical advice." (engine + CDC) |
| ToolShell pills | `Range, not one number`, `4 named formulas + CDC BMI range`, `Height-weight chart`, `ft/in or cm` |
| Links out | BMI (#24), Body Fat (#19), Weight Loss Date (#25), TDEE (#20) (when live); Heart Rate Zones (#11); Army WHtR (#9); CDC page |
| Links in | #9, #11, Tools hub "Health & Fitness" |

## 5. Content (~1,200–1,500 words, original, reviewed)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to compute ideal weight | Inputs, the two ranges, safety (`compute ideal weight`) | 120 |
| 2 | The four ideal body weight formulas | Devine, Robinson, Miller, Hamwi: formula, year, what each was made for; citation status (`figuring out ideal body weight`) | 200 |
| 3 | The CDC healthy BMI range | 18.5 to under 25; categories; "screening measure" | 130 |
| 4 | Healthy weight for women by height | Chart excerpt + the 5'2", 5'4", 5'5", 5'7" rows (`correct weight for 5'4 female` etc.) | 120 |
| 5 | Healthy weight for men by height | Chart excerpt + 5'10", 5'11", 6'0" | 100 |
| 6 | Frame size and body composition | Hamwi ±10 % (traditional); muscle vs fat; why formulas miss athletes | 120 |
| 7 | Limits of ideal weight formulas | Older adults, under 5 ft, pregnancy, children, dosing (not for these) | 110 |
| 8 | Height–weight chart | The full chart | — |
| 9 | FAQ | §6 | 330 |

## 6. FAQ (10, from the competitor question bank + cluster keywords)

1. How do I calculate my ideal body weight?
2. What is a healthy weight for a 5'4" (5'2", 5'5", 5'7") woman?
3. Which ideal weight formula is best? (none is "best"; they agree within a few kg; use the range)
4. What is a healthy BMI range? (CDC)
5. How does frame size change ideal weight?
6. How much should I weigh for my height? (`how much must i weigh`)
7. Why were these formulas created? (drug dosing and diet planning)
8. Are ideal weight formulas accurate for athletes or older adults?
9. What is the average weight for a 5'7" woman or a 5'11" man? (we don't publish averages without a cited dataset; average isn't the same as healthy)
10. What if I'm under 5 feet tall?

## 7. Done when

- [ ] `body-metrics-engine.ts` + tests; `npm run verify` passes.
- [ ] Range-first UI; CDC cited with its date; Robinson/Miller marked "citation to confirm" until confirmed.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Reviewer sign-off recorded (`TODO(owner)`); registrations + docs; `graphify update .`.
- [ ] **STOP and report** (end of Part 3).
