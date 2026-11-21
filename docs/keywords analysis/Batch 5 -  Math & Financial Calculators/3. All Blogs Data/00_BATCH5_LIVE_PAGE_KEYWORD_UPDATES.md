# Batch 5 — Keyword Updates for Pages That Are Already Live

> **Source:** `KKCTools_Batch5_Final_Tool_Keywords.md` §3 and §4 (Semrush US).
> **Written:** 2026-11-22. Builder: Antigravity / Gemini.
> **Why first:** these are the **fastest wins in Batch 5**. About 183,000 searches belong to pages we already have, so no new URL is needed. Do this **before** the 20 new tools, or alongside tool #1.

---

## Rules

- **Never** create a new URL for these keywords. That would make our own pages compete.
- **Placement:**
  - the title and H1 only where this file says so;
  - otherwise new H2s, FAQ entries and small tool additions.
- **Keep facts sourced.** Weights per yard (gravel, sand, rock) must come from the page's existing cited densities, or from a named, dated source the builder opens. Otherwise explain the method (volume × density) and let the user enter the density.
- After each page:
  - `npm run verify` (PowerShell);
  - update `calculation-methods.ts` if the formulas or sources change;
  - add a changelog line;
  - run `graphify update .`.
- **Title changes:**
  - keep the URL;
  - if the title + " | KKC Tools" goes over 60, use `absoluteTitle`;
  - note the old and new title in the changelog so the owner can watch Search Console.

---

## 1. Stone & Gravel Calculator — `/stone-calculator/` (biggest win)

**Current title:** `Stone Calculator — Crushed Rock, Gravel & Tons`

| Keyword | US vol | KD |
|---|---:|---:|
| gravel calculator | 33,100 | 22 |
| figuring gravel | 27,100 | 21 |
| stone calculator | 12,100 | 14 |
| rock calculator | 9,900 | 13 |
| pea gravel calculator · river rock calculator | 4,400 · 4,400 | 12–16 |
| figuring gravel for driveway · driveway gravel calculator | 2,400 · 1,000 | 10–13 |
| landscape rock calculator · river stone calculator | 1,900 · 1,300 | 12–13 |
| how much does a yard of gravel weigh | 1,600 | **0** |
| aggregate calculator · crushed rock calculator · crushed stone estimator | 1,300 · 1,300 · 1,000 | 0–12 |
| crusher run calculator · crushed concrete calculator | 1,000 · 720 | 8–9 |
| how much chippings do i need (UK) | 1,300 | 12 |
| gravel yards | 1,000 | 14 |

**Changes:**
1. **Title →** `Gravel & Stone Calculator – Yards, Tons & Pea Gravel` (52; 64 with the suffix → `absoluteTitle`).
   - The H1 must start with "Gravel Calculator", e.g. `Gravel Calculator: Stone, Rock and Pea Gravel in Yards and Tons`.
   - **First sentence:** "This gravel calculator works out how much stone or rock you need…"
2. **Material presets:** pea gravel, river rock, crushed stone, crusher run, crushed concrete, landscape rock, driveway gravel.
   - Each preset is a **density, with its source** (or user-entered).
   - Presets change the density only, never invent coverage claims.
3. **Driveway mode:** length × width × depth with a base + top layer option (H2 "How much gravel for a driveway?").
4. **New H2s:**
   - "How to figure gravel (yards and tons)" (`figuring gravel`)
   - "Pea gravel, river rock and landscape rock"
   - "Crusher run and crushed concrete"
5. **New FAQs:**
   - "How much does a yard of gravel weigh?" (method + cited density range)
   - "How much gravel do I need for a driveway?"
   - "How many tons of gravel in a yard?" (link Tons ↔ Yards)
   - "How much chippings do I need?" (UK wording; metric)

## 2. Tons to Cubic Yards Converter — `/tons-to-cubic-yards/`

**Keywords:** ~16,500 searches at KD 0–21.

| Keyword | US vol | KD |
|---|---:|---:|
| how many yards in a ton | 2,900 | 21 |
| how many cubic yards in a ton | 1,900 | 8 |
| tons to cubic yards · conversion of tons to cubic yards | 1,600 · 1,300 | 8 |
| how many cubic yards in a ton of rock | 1,600 | 10 |
| how many yards in a ton of gravel | 1,300 | **0** |
| convert cy to tons · convert tons to cy | 1,300 · 1,000 | 5–9 |
| how many tons in a yard · how many tons is in a yard | 1,300 · 1,000 | 12–14 |
| yard to tonne conversion | 1,300 | 14 |

**Changes:**
- **FAQs:**
  - "How many yards are in a ton of gravel?"
  - "…of rock?"
  - "How many tons are in a yard?"
  - All answered from the page's cited densities.
- **Metric note:** H2 "Tonnes (metric) vs US tons". 1 tonne = 1,000 kg; 1 US ton = 2,000 lb = 907.18474 kg.
- **Two-way labels:** make sure the tool clearly reads "cy ↔ tons" both ways.

## 3. Cubic Yard Calculator — `/cubic-yard-calculator/`

| Keyword | US vol | KD |
|---|---:|---:|
| cubic yard calculator | 22,200 | 9 |
| cubic ft to cubic yards | 5,400 | 26 |
| calculate cubic yards | 3,600 | 13 |
| estimating cubic yards | 2,900 | 29 |
| cubic yard to cubic feet | 2,900 | 21 |

**Changes:**
- Add an **ft³ ↔ yd³ converter strip** (1 yd³ = 27 ft³).
- Add H2s:
  - "Cubic feet to cubic yards (÷ 27)"
  - "How to calculate cubic yards"
- FAQ: "How many cubic feet are in a cubic yard?"

## 4. Sand Calculator — `/sand-calculator/`

- `how much does a yard of sand weigh` (1,300, **KD 4**).
- Add that FAQ, using the page's cited sand density (dry vs wet if sourced).

## 5. Asphalt Calculator — `/asphalt-calculator/`

- `asphalt calculator` (22,200, KD 14) is already the target. No change, KD confirmed.

## 6. Cubic Feet ↔ Square Feet — `/cubic-feet-to-square-feet/`

- Add the variants `cft to square feet` (2,400, KD 20) and `cubic feet to ft sq` (2,400, KD 20):
  - one intro sentence ("cft to square feet");
  - one FAQ.

## 7. Pipe & Tube Volume — `/pipe-volume-calculator/`

- `tube volume calculator` (1,600, KD 12): make sure "tube volume" appears in the H1 or the first sentence, and in one H2.

## 8. Cubic Inch — `/cubic-inch-calculator/`

- `cubic inch calculator` (3,600, KD 9) is already the target. No change.

---

## Batch 3 pages (live) — extra rows from the Batch 5 exports

### Percentage Change — `/percentage-change-calculator/`

Add only **new** rows; the rest are already targeted.

| Keyword | US vol | KD | Placement |
|---|---:|---:|---|
| growth percentage calculator | 2,400 | **1** | Intro wording + FAQ "How do I calculate growth percentage?" |
| difference calculator | 3,600 | 17 | % difference tab label + H2 wording |
| percent of change | 3,600 | 20 | FAQ wording |
| month on month | 5,400 | 15 | H2 "Month-on-month (MoM) percentage change" + list-mode example |
| between which two years was the greatest percentage decrease | 2,400 | 4 | List-mode example: "find the biggest drop between years" (highlight max decrease) |

### Discount — `/discount-calculator/`

- Confirm these are covered by the engine table (no per-value pages):
  - `discount computation` (14,800, KD 6);
  - `discount on calculator` (1,900, KD 10);
  - the "X% off $Y" long tail (17 phrases, ~22,900), e.g. `30 off of 50$`, `20 off 45`.

### Compound Interest — `/compound-interest-calculator/`

| Keyword | US vol | KD | Placement |
|---|---:|---:|---|
| compound calculator | 18,100 | 7 | Natural wording in the intro |
| figure compound interest calculator | 14,800 | 0 | Intro wording |
| compounding calculator | 9,900 | 10 | Tool heading wording |
| compound daily calculator · compound interest calculator for daily | 1,600 · 8,100 | 3 · 23 | **Make daily compounding a headline mode** (keyword-file action) + H2 |
| saving account calculator | 1,600 | 6 | H2 "Savings account interest" (APY input) |
| future value calc | 4,400 | 29 | FAQ "How do I calculate future value?" |

### Credit Card Payoff — `/credit-card-payoff-calculator/`

| Keyword | US vol | KD | Placement |
|---|---:|---:|---|
| debt payoff estimator | 4,400 | **8** | **New:** intro + Several-cards tab wording + H2 "Debt payoff estimator for several cards" |
| minimum payment calculator | 2,900 | 23 | Minimum tab heading + FAQ |

### Present Value — `/present-value-calculator/`

| Keyword | US vol | KD | Placement |
|---|---:|---:|---|
| ear formula · effective annual rate formula | 3,600 · 2,900 | 20 | FAQ "What is the effective annual rate (EAR) formula?" (link Compound Interest's APR↔APY converter) |
| wacc calculator | 4,400 | 29 | Optional FAQ only ("choosing a discount rate"); no WACC tool now |

---

## Done when

- [ ] Each page updated, with the changelog noting old vs new titles.
- [ ] No invented densities: every weight answer is cited or method-only.
- [ ] `npm run verify` passes; `graphify update .`.
