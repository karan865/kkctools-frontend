# Army Body Fat Calculator (2026 Waist-to-Height Standard) — Build Spec

> **URL:** `/army-body-fat-calculator/` · Batch 8 · Tier 1 · **Build order 10** (last in Part 2)
> **Read first:** `../00_BATCH8_BUILD_RULES.md` (Part 2 §10 rules 1 and 5, **§11 AD 2026-13**, §12 `whtr-engine`, §13 Health hub)
> **Inputs:** `09_Army_Body_Fat_Calculator_ABCP_Competitor_Analysis.md`, keyword file §2 #9, **Army Directive 2026-13** (read 2026-11-22)
> **SERP:** provisional
> **Written:** 2026-11-22
> **⚠ Blocking `TODO(owner)` before launch:** (1) the official WHtR measuring procedure (G-1 implementing guidance / DA Form 5500 instructions); (2) a qualified reviewer (YMYL); (3) re-check the directive status. Re-check every 6 months (keyword file).

---

## 0. Strategy — the standard changed, and the SERP hasn't caught up

**What changed (verified from the PDF, rules §11):** **Army Directive 2026-13 (1 July 2026)** makes the **waist-to-height ratio (WHtR) "the sole measurement for all Soldiers"**:
- "The standard is a WHtR of less than and not equal to 0.55";
- a Soldier at **0.55 or greater** is flagged and enrolled in the Army Body Composition Program (ABCP);
- **height and weight screening tables are discontinued**;
- **no tape test or other body-fat method** may be used to challenge the WHtR;
- **no Army Fitness Test score exempts** a Soldier (AD 2025-17 and AD 2023-08 rescinded);
- the one-site tape directive **AD 2023-11 is rescinded**.

**Every competitor we read still teaches the old tape tests** (GIGA: one-site + multi-site formulas and 2019 tables; BodySpec: the one-site method and a body-fat table). The analysis (2026-11-14) had even blocked this tool because the one-site formula was never published. **That problem is gone: the current method is a simple, published ratio.** Being the first clear, correct, dated page is the opportunity.

**Keywords (≈ 91,600 searches):** `army calculator for body fat` **12,100 / KD 1** (primary), `army body fat calculator`, `army calculate body fat percentage`, `army fitness calculator body fat`, `army pt body fat calculator`, `calculate body fat army` (12,100 each), `army height and weight calculator` 6,600, `army height weight calculator` 3,600, `body fat calculator army` 2,400. People still search "body fat"; the page answers with the current standard and says plainly that the Army no longer uses a body-fat % for this.

### Research notes

- **Competitor pages read (2026-11-14):** army.mil AD 2023-11 news (Jun 2023, one-site tape, "height and weight screening table will remain"), GIGAcalculator (legacy and one-site, no one-site thresholds, conflicting dates), BodySpec (one-site inputs, a max BF % table, ACFT 540 exemption, DEXA upsell), DoD HPRC (said "as of Jan 1, 2026 … WHtR", internally inconsistent; now 404).
- **All four are now out of date** on the points above (2023 tape test, screening tables, AFT exemption).
- **Verified 2026-11-22:** armypubs lists AD 2026-13 as ACTIVE, AD 2023-11 as INACTIVE; AR 600-9 (16 Jul 2019, Change 1 27 Feb 2025) remains active and will be revised within 2 years.
- **Not verified:** where and how the waist is measured and how it's rounded (the directive leaves this to G-1 guidance); Marine Corps / other services; the DoD memo text.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | army calculator for body fat | 12,100 | 1 | first sentence, ToolShell heading |
| Secondary | army body fat calculator · body fat calculator army · calculate body fat army · army calculate body fat percentage | 12,100 · 2,400 · 12,100 · 12,100 | 11–28 | title, H1, H2 "Does the Army still use body fat percentage?" |
| Secondary | army pt body fat calculator · army fitness calculator body fat | 12,100 · 12,100 | 11–28 | H2 "Does a high AFT score exempt you?" (no: AD 2026-13) |
| Secondary | army height and weight calculator · army height weight calculator | 6,600 · 3,600 | — | H2 "Army height and weight standards (discontinued)" + the **max-waist-by-height table** (what replaces them) |
| Natural | army waist to height ratio · whtr calculator · army tape test | — | — | H1, H2s (`TODO(owner)`: pull volumes) |

## 2. Our edge

- **The current standard, dated and cited:** AD 2026-13, 1 July 2026, with "last checked" date and a link to armypubs.
- **WHtR calculator:** waist and height (in or cm) → ratio to 4 places, **meets / does not meet** (exact rational comparison, so 0.5500 correctly fails), and the margin in inches/cm.
- **Max waist for your height** ("to meet the standard, your waist must be under 38.5 in at 70 in tall") and a **table by height** (58–80 in, with cm).
- **Plain-English "what changed"** box: tape tests, screening tables and AFT exemptions → replaced.
- **What happens at 0.55 or above** (from the directive: flag, ABCP enrollment, same-day confirmation by another team, medical exam for RA/AGR), neutral and cited.
- **No invented formulas:** no tape-test body-fat %, no unverified tables. A link to #19 (Navy method body-fat estimate) for people who want a body-fat %, clearly labelled "not the Army standard".
- **YMYL safeguards:** "not an official assessment" banner, reviewer line, methodology page.

## 3. Calculator spec

### 3.1 Tabs

1. **WHtR check** (default)
2. **Max waist by height** (table)
3. **What changed in 2026**

### 3.2 Input guide diagram (above the inputs)

`ArmyWhtrInputGuide.tsx`: a simple standing figure with two measurement lines.

- "1 Height" vertical arrow head-to-floor; "2 Waist" horizontal tape around the middle, labelled **"measure as your unit's procedure says"** (no anatomical landmark until `TODO(owner)` supplies the official procedure).
- A ratio badge "38 ÷ 70 = 0.543" and a gauge with the **0.55 line**.
- **Table tab:** the figure at three heights with their max waists.
- Live values; the focused field highlights.

### 3.3 Inputs

| Field | Default |
|---|---|
| Units | inches (in · cm) |
| Height | 70 in (or 178 cm) |
| Waist | 38 in (or 95 cm) |
| Show margin | on |

No sex or age input: the directive's standard is a single threshold for all Soldiers.

### 3.4 Engine (`src/lib/whtr-engine.ts`)

```ts
whtr = waist / height (same units)           // display: 4 decimal places
meets = waist * 100 < 55 * height            // exact; equality (0.55) does NOT meet
maxWaist(height) = 0.55 * height (strictly below) ; margin = maxWaist − waist
table(heights 58..80 in) → {in, cm, maxWaistIn, maxWaistCm}
cm ↔ in: 2.54 exactly
```

**Worked examples (checked with node, 2026-11-22):**

| Height | Waist | WHtR | Result |
|---:|---:|---:|---|
| **70 in** | **38 in** | **0.5429** | **meets** (margin 0.5 in) |
| 70 in | 38.4 in | 0.5486 | meets |
| 70 in | **38.5 in** | **0.5500** | **does not meet** (must be under 0.55) |
| 64 in | 34 in | 0.5313 | meets |
| 64 in | 35.2 in | 0.5500 | does not meet |
| 72 in | 39.5 in | 0.5486 | meets |
| 178 cm | 95 cm | 0.5337 | meets |

**Max waist table (strictly below):** 60 in → 33.0 in (152.4 cm → 83.8 cm) · 64 in → 35.2 in (89.4 cm) · 66 in → 36.3 in · 68 in → 37.4 in · **70 in → 38.5 in (97.8 cm)** · 72 in → 39.6 in · 74 in → 40.7 in · 76 in → 41.8 in.

### 3.5 Outputs

- **Headline:** "WHtR 0.543: meets the Army standard" (green/amber/red with text, not colour alone).
- **Sentence:** "A 38-inch waist at 70 inches tall is a waist-to-height ratio of 0.543, under the Army's 0.55 limit (AD 2026-13). Your waist would need to stay under 38.5 inches."
- Margin; the max-waist table; the "what changed" box with the rescinded directives.
- **Banner (always visible):** "Estimate only. Your official result is the measurement taken by your unit under AD 2026-13. Not medical advice." + "Standard checked against AD 2026-13 on <checkedOn>."
- Share URL (`?h=70&w=38&u=in`).
- Links: Body Fat (Navy method) (#19, later, labelled "body-fat %, not the Army standard"), BMI (#24, later), Ideal Weight (#12, later), Health methodology page.

### 3.6 Tests

- Exact boundary: 38.5/70 and 35.2/64 → does not meet; 38.49/70 → meets.
- Units: cm and in give the same ratio; conversions exact.
- Table values; margin sign.
- Guards: zero/negative/absurd values (height < 48 in or > 96 in → "check your height").
- The data file `src/data/army-standard.ts` holds `{directive: "AD 2026-13", date: "2026-07-01", threshold: 0.55, comparison: "<", checkedOn}`; the page reads everything from it (one place to update).
- Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Army Body Fat Calculator – 2026 WHtR Standard` (45; 57 with the suffix: OK) — **changed from the keyword file** ("ABCP Standards") because the standard is now WHtR |
| Meta | `Free Army body fat calculator for the 2026 waist-to-height standard. Check your WHtR against the Army's 0.55 limit and see the most your waist can measure.` (155) |
| H1 | `Army Body Fat Calculator: The 2026 Waist-to-Height (WHtR) Standard` |
| BLUF | "Since Army Directive 2026-13 (1 July 2026), the Army no longer uses tape-test body fat: every Soldier is measured by waist-to-height ratio, and the standard is below 0.55. Enter your waist and height to check it. For example, a 38-inch waist at 70 inches tall is 0.543, which meets the standard; at 70 inches your waist must stay under 38.5 inches." (engine + §11) |
| ToolShell pills | `Updated for AD 2026-13`, `Waist-to-height check`, `Max waist for your height`, `What changed, explained` |
| Links out | Body Fat Navy (#19), BMI (#24), Ideal Weight (#12) (when live); Health methodology page; armypubs AD 2026-13 |
| Links in | #19, #12, #24 (later), Tools hub "Health & Fitness" |

## 5. Content (~1,000–1,300 words, original, reviewed)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the Army body fat calculator | Inputs, units, the banner | 100 |
| 2 | The Army's 2026 standard: waist-to-height ratio | Quote the rule (< 0.55), who it applies to, twice a year, confirmation measurement | 170 |
| 3 | Does the Army still use body fat percentage? | No: tape tests can't be used to challenge WHtR; AD 2023-11 rescinded (`army calculate body fat percentage`) | 130 |
| 4 | Army height and weight standards (discontinued) | The screening tables are discontinued; the max-waist table is the practical replacement (`army height and weight calculator`) | 120 |
| 5 | Does a high AFT score exempt you? | No: "No AFT score exempts a Soldier" (`army pt body fat calculator`) | 80 |
| 6 | What happens if your WHtR is 0.55 or more? | Flag, ABCP enrollment, medical exam (RA/AGR), removal when the standard is met; neutral, cited | 140 |
| 7 | How to measure waist and height | **Only after `TODO(owner)` supplies the official procedure**; until then: "follow your unit's procedure" + general tips that don't contradict it (relaxed, same time of day) **only if the reviewer approves** | 100 |
| 8 | Max waist by height | The table | — |
| 9 | FAQ | §6 | 300 |

## 6. FAQ (10, from the competitor question bank + cluster keywords, updated for 2026)

1. How does the Army calculate body fat now? (it doesn't use body fat %; WHtR < 0.55)
2. What is the Army waist-to-height standard?
3. How do I measure my waist and height for it? (official procedure only; `TODO(owner)`)
4. Is there still an AFT exemption? (no)
5. Does the Army still use height and weight tables? (discontinued)
6. What happens if I don't meet the WHtR standard?
7. Can I use a tape test or DEXA scan to challenge the result? (no, per AD 2026-13)
8. What was the old tape test? (one-site 2023 and multi-site methods, now rescinded; no formulas shown)
9. Does this apply to the Guard and Reserve? (yes: RA, ARNG/ARNGUS, USAR; medical-exam rules differ)
10. Is this an official result? (no; banner)

## 7. Done when

- [ ] **Owner items resolved:** official measuring procedure, reviewer sign-off, directive status re-checked.
- [ ] `whtr-engine.ts` + `army-standard.ts` + tests; `npm run verify` passes.
- [ ] No tape-test formulas, body-fat tables or screening tables shown as current.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Registrations + docs; `graphify update .`.
- [ ] **STOP and report** (end of Batch 8 Part 2).
