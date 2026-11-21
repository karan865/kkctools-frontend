# Heart Rate Zone Calculator: Competitor Analysis

> **Target page:** KKCTools `/heart-rate-zone-calculator/` (Batch 8, Tool #11 ✅, YMYL)
> **Primary keyword:** `heart rate zones calculator`, US 2,900 · **KD 0**. The cluster has 5 keywords and 17,000 US searches, all at KD 0–12. It includes `heart rate zones by age` (4,400) and `zone 2 cardio heart rate` (rising).
> **SERP source:** ⚠ No Semrush SERP export for Batch 8. Competitors come from a live web search on 2026-11-14 for `heart rate zones calculator karvonen zone 2 max heart rate tanaka`, plus Omni and the AHA. `TODO(owner): pull Google top 10.`
> **Pages visited (2026-11-14):** 4 read: Pearson, FatCalc, Omni, PeakVO2Trainer zone-2. The American Heart Association target-heart-rate page returned 403.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Education: Pearson
  - Health calculators: FatCalc, Omni
  - Fitness-app lead-gen: getfitcraft, elitetrackr, peakvo2trainer
  - Clones
  - The AHA, Mayo and Cleveland Clinic pages are probably also in the real SERP. `TODO(owner)`: check them, and use the **AHA target-heart-rate guidance as an authority citation**.
- **YMYL (keyword file):**
  - Show "estimate, not medical advice".
  - **Cite the formula sources** and never invent health claims.
  - **Get a qualified reviewer before launch.**
- **Formulas cited across the SERP:**
  - Fox (220 − age)
  - **Tanaka et al. 2001** (208 − 0.7 × age; 351 studies, 18,712 subjects)
  - **Gulati 2010** (206 − 0.88 × age; women, n = 5,437)
  - **Karvonen** (HRR × % + resting HR)
  - `TODO(owner)`: verify each citation against the primary paper.
- **Zone 2 is the main point of confusion.** The same person gets a very different "zone 2" depending on the method:
  - age 40, resting 60, Tanaka max 180
  - %HRmax 60–70 %: **108–126 bpm**
  - Karvonen 60–70 %: **132–144 bpm**
  - MAF (180 − age): **140**
  - That is an 18–24 bpm gap. PeakVO2Trainer understates it as "5–10 bpm", and Omni's FAQ mixes methods.
  - **We show every method side by side and explain it.**
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | pearson.com/channels/calculators/heart-rate-zones-calculator | Education publisher | Heart Rate Zones Calculator | ~1,000 |
| 2 | fatcalc.com/heart-rate-zone-calculator | Health calc site | Heart Rate Zone Calculator | long |
| 3 | omnicalculator.com/sports/heart-rate-zone | Giant | Heart Rate Zone Calculator | ~1,000 |
| 4 | peakvo2trainer.com/tools/zone-2-heart-rate-calculator/ | Fitness tool site | Zone 2 Heart Rate Calculator | ~1,300 |
| — | heart.org/…/target-heart-rates | **AHA (authority)** | Target Heart Rates | **403** |

**What this tells us:**
- **FatCalc** is the strongest on sources:
  - 3 max-HR formulas (Fox, Tanaka, Gulati) with correct study details
  - Karvonen and %HRmax zones
  - 8 references and a substantial medical-considerations section
  - Weak points: Zone 3 is mislabelled "threshold"; the HRR and %max boundaries don't line up; it overstates what ACSM says; no author or date.
- **Pearson:**
  - Fox, Tanaka or a known max HR, plus Karvonen
  - 6 FAQs and a good disclaimer
  - Weak points: **the zone table boundaries aren't shown**; an example miscalculation; no sources.
- **Omni:**
  - Karvonen and a 5-zone model, written by a PhD author with a reviewer
  - Weak points: **the zone 2 FAQ uses %max instead of Karvonen**; an unclear default formula; an incomplete source list.
- **PeakVO2Trainer** (zone-2 specialist):
  - %max and Karvonen, a correct age table and 4 references
  - Weak points: no MAF or lactate-threshold method, and it understates the gap between methods.
- **No page offers all of these:**
  - a choice of **3 max-HR formulas** (plus a known or tested max)
  - **zones by %HRmax and Karvonen side by side**, with zone 2 highlighted, plus the MAF number (labelled)
  - an **age table for 20–80**
  - a **"how to find resting HR"** guide
  - every source cited and dated
  - a reviewer named

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Pearson | FatCalc | Omni | PeakVO2 |
|---|---|---|---|---|
| Fox 220 − age | ✅ | ✅ | ⚠️ | ? |
| Tanaka | ✅ | ✅ | ✅ (FAQ) | ✅ |
| Gulati (women) | ❌ | ✅ | ❌ | ❌ |
| Known / tested max HR override | ✅ | ? | ? | ✅ |
| Karvonen (HRR) | ✅ | ✅ | ✅ | ✅ |
| %HRmax zones | ⚠️ | ✅ | ⚠️ (FAQ) | ✅ |
| **Both methods side by side** | ❌ | ⚠️ | ❌ | ⚠️ |
| 5-zone table with bpm | ⚠️ (boundaries missing) | ✅ | ✅ | ✅ |
| Zone 2 highlight | ✅ | ✅ | ⚠️ | ✅ |
| MAF (180 − age) | ❌ | ❌ | ❌ | ❌ |
| Age table (20–80) | ❌ | ❌ | ❌ | ✅ |
| Resting-HR how-to | ❌ | ⚠️ | ✅ (FAQ) | ❌ |
| Disclaimer / medical notes | ✅ | ✅ | ⚠️ | ⚠️ |

---

## 3. Feature matrix — content and trust

| Item | Pearson | FatCalc | Omni | PeakVO2 |
|---|---|---|---|---|
| Formula sources cited | ❌ | ✅ (8) | ⚠️ (list numbering starts at 3) | ✅ (4) |
| Worked examples (checked) | ⚠️ (one off by 1–2 bpm) | ✅ | ⚠️ (method mismatch) | ✅ |
| Explains why methods differ | ⚠️ | ⚠️ | ❌ | ⚠️ (understated) |
| Fat-burning claims | "commonly called" | ✅ (with numbers) | overstated | ⚠️ |
| FAQ count | 6 | 0 | several | 6 |
| Named author / reviewer | ❌ | ❌ | ✅ (PhD + reviewer) | ✅ (no credentials) |
| Date | ❌ | ❌ | ❌ | ✅ (Nov 2026) |

---

## 4. Competitor-by-competitor detail

### 1. Pearson: Heart Rate Zones Calculator
- **Inputs:** Fox, Tanaka or a known max HR; Karvonen with resting HR.
- **Zone 2:** about 60–70 % HRR.
- **FAQs (6):** Karvonen, fat burning, max HR accuracy, wearables, known max, medical issues.
- **Errors:**
  - The zone table boundaries aren't visible.
  - Example 3's difference of "about 14–15 bpm" only holds for Tanaka (it's about 13 with Fox).
  - A quick-example label is mismatched.
- **Weak points:** no sources, author or date.

### 2. FatCalc: Heart Rate Zone Calculator
- **Formulas:** Tanaka, Fox and Gulati (study details ✔).
- **Karvonen:** HRR 120 at 50 % = 120 bpm ✔.
- **Zone % conversions:** 65 % HRR ≈ 77 % max ✔.
- **References:** 8. A medical section covers cardiac conditions, diabetes, pregnancy, medications and warning signs.
- **Errors:**
  - Zone 3 is labelled "threshold" (that's Zone 4).
  - The HRR and %max boundaries don't match.
  - It says "ACSM recommends Karvonen" (overstated).
- **Weak points:** no FAQ, author or date.

### 3. Omni: Heart Rate Zone Calculator (Joanna Michałowska PhD; reviewer Czernia PhD)
- **Method:** Karvonen with 5 zones at 50–100 %. Tanaka is covered in the FAQ.
- **Errors:**
  - **The zone 2 FAQ uses %max**, which contradicts the page's own Karvonen method.
  - The displayed default formula (192 − 0.007 × age²) doesn't match the selector.
  - The source list starts at 3.
  - Overstated fat-burn claim.
- **Weak points:** no date.

### 4. PeakVO2Trainer: Zone 2 Heart Rate Calculator (Cristian Serb, Nov 2026)
- **Method:** %max (60–70 %) and Karvonen, with a measured-max override.
- **Age table:** 20–70 ✔.
- **References:** 4.
- **Errors:**
  - Says apps differ by "5–10 bpm"; its own maths shows **18–24 bpm**.
  - No MAF or lactate-threshold definitions.
  - Unsourced claim about watch defaults.
  - The 80/20 wording is inconsistent.

---

## 5. Patterns

**Max HR**
- Fox: 220 − age
- Tanaka 2001: 208 − 0.7 × age
- Gulati 2010 (women): 206 − 0.88 × age
- Known/tested max overrides all three.
- Show **±10–12 bpm uncertainty**. `TODO(owner)`: cite this.

**Zones** (cite the model used; many use a 5-zone %HRmax model)

| Zone | %HRmax | %HRR (Karvonen) |
|---|---|---|
| 1 Recovery | 50–60 | 30–40 |
| 2 Aerobic / endurance | 60–70 | 40–60 |
| 3 Tempo | 70–80 | 60–70 |
| 4 Threshold | 80–90 | 70–85 |
| 5 Max | 90–100 | 85–100 |

- `TODO(owner)`: choose **one cited zone model** (e.g. ACSM intensity categories, or a named 5-zone model) and state it. Show both columns.

**Zone 2 panel**
- Show the %max range, the Karvonen range and MAF (180 − age, labelled as a coaching heuristic).
- Explain why they differ.

**AHA ranges**
- Moderate intensity ≈ 50–70 % of max; vigorous ≈ 70–85 %.
- `TODO(owner)`: cite the AHA page; it returned 403 on 2026-11-14.

**Resting HR how-to**
- Measure on waking, over 60 seconds, averaged over several days.

**Age table**
- Ages 20–80 in 5-year steps: max HR (Tanaka and Fox) and the zone 2 range.

**Medical cautions**
- Beta-blockers and other medications, pregnancy, heart conditions.
- Text should say "talk to your doctor"; no invented specifics.

**Competitor coverage (out of 4)**

| Section | Pages (of 4) |
|---|:---:|
| 3 formulas | 1 |
| Side-by-side methods | 1 partial |
| MAF | **0** |
| Age table | 1 |
| Correct zone 2 explanation | 1 partial |
| Sources cited | 2 |

---

## 6. FAQ question bank

★ = asked on 2 or more pages, or a cluster keyword. Map to: heart rate zones calculator, heart rate zones by age, how to calculate max heart rate, finding maximum heart rate calculator, zone 2 cardio heart rate.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How do I calculate my maximum heart rate? | all · `how to calculate max heart rate` |
| 2 | ★ What is zone 2 heart rate? | all · `zone 2 cardio heart rate` |
| 3 | ★ What are heart rate zones by age? | PeakVO2 · `heart rate zones by age` |
| 4 | ★ What is the Karvonen formula? | Pearson, FatCalc, Omni |
| 5 | ★ Is the 220 − age formula accurate? | Pearson, FatCalc |
| 6 | Why does my watch show different zones? | Pearson, PeakVO2 |
| 7 | How do I find my resting heart rate? | Omni |
| 8 | What is the "fat-burning zone"? | Pearson, FatCalc, Omni |
| 9 | What is MAF / 180 − age? | — (gap) |
| 10 | Do medications affect my heart rate zones? | FatCalc, Pearson |

---

## 7. Gaps nobody fills — our opportunities

1. **Three max-HR formulas plus a tested-max override**, each cited, with an uncertainty note.
2. **%HRmax and Karvonen zones side by side**, so the 18–24 bpm zone-2 gap is visible and explained.
3. **A zone 2 panel** with all three methods (including MAF, labelled as a heuristic).
4. **An age table (20–80)**, generated by our engine.
5. **A resting-HR how-to** and a simple "measure your resting HR" timer (30 s × 2).
6. **YMYL safeguards:** citations, disclaimer, medication note, reviewer sign-off.
7. **Correct zone labels.** Fixes competitor errors (Zone 3 vs threshold; mixed methods).
8. **Links:** TDEE (#20), Calories Burned Walking (#23), BMR (#21).

---

## 8. Blueprint for the KKCTools Heart Rate Zone Calculator

### 8.1 SEO

- **URL:** `/heart-rate-zone-calculator/`
- **Title:** Heart Rate Zone Calculator – Zone 2 & Max HR
- **H1:** Heart Rate Zone Calculator: Your Max Heart Rate and Training Zones
- **Meta:** as in the keyword file (152 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Inputs | Age, sex (Gulati option), resting HR (optional), tested max HR (optional) |
| Max HR | Fox, Tanaka, Gulati, tested; ± note |
| Zones | 5-zone table: %HRmax and Karvonen columns (bpm); cited model |
| Zone 2 | %max, Karvonen, MAF (labelled) |
| Extras | Age table 20–80; resting-HR measuring timer |
| Safety | Disclaimer, medication note, reviewer |
| UX | Share URL, no network |

### 8.3 Content outline (≈ 1,100–1,400 words, original, reviewed)

1. Intro (primary keyword) and disclaimer
2. How to use
3. Estimating max heart rate (3 formulas, cited)
4. Heart rate zones explained (cited model)
5. %max vs Karvonen: why your zones differ (example)
6. Zone 2 training: what it is and how to find yours
7. Heart rate zones by age (table)
8. Measuring resting heart rate
9. When to talk to a doctor
10. FAQ (10)
11. Related tools: TDEE (#20), BMR (#21), Calories Burned Walking (#23)

### 8.4 Quality checks

- **Unit tests:**
  - each formula
  - Karvonen
  - zone boundary rounding
  - age table
  - fixture: age 40, rest 60 → 108–126 / 132–144 / MAF 140
- **Reviewer sign-off** (YMYL).
- No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - pull Google top 10
  - check the AHA page
  - choose the zone model and its citation
  - name the qualified reviewer
