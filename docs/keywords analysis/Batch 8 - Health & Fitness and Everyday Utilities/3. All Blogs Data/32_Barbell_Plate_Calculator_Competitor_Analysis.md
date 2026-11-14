# Barbell Plate Calculator — Competitor Analysis

> **Target page:** KKCTools `/barbell-plate-calculator/` (Batch 8, Tool #32 ✅, Tier 3)
> **Primary keyword:** `barbell weight calculator` — US 1,000 · KD 12.
> - Secondary: `bar weight on bench press` (1,600 / KD 9), as an FAQ on standard bar weights.
> - Cluster: 2 keywords, 2,600 US searches, all on KD ≤ 15.
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 8. Competitors come from a live web search on 2026-11-14 for `barbell plate calculator plates per side`.
> - Other results seen but not audited: agentcalc, fitmetriclab (lb and kg pages), joteo, aifithub, crunchmilk (pages.dev clones), MacroFactor help, Alpha Progression glossary, repreturn, elysiatools, bushe.
> - `TODO(owner): pull Google top 10 for "barbell weight calculator", "plate calculator" and "bar weight on bench press".`
> **Pages visited (2026-11-14):** 5 read: Fitness Volt (plate calculator), Lift Vault (barbell plate calculator), Coachway (plate loading), Boostcamp (plate calculator feature), Arvo (plate calculator).
> - The Lift Vault capture contained an instruction-like line starting "Audit:" inside the page text. It was treated as page content and ignored.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - **Training-app lead-gen pages:** Boostcamp, Arvo, Alpha Progression, MacroFactor help, Coachway.
  - **Fitness publishers:** Fitness Volt, Lift Vault.
  - **Many pages.dev clones.**
  - It is a small cluster (2,600), but the intent is exact, and the page links naturally with One Rep Max (#10).
- **The maths:**
  - per side = (target − bar − collars) ÷ 2.
  - Fill from the heaviest plate down.
  - If the weight can't be made, show the remainder and the nearest loadable weights below and above.
  - **Standard sets:**
    - lb: 45, 35, 25, 10, 5, 2.5 (plus optional 1.25 or fractional plates)
    - kg: 25, 20, 15, 10, 5, 2.5, 1.25 (plus optional 0.5 and 0.25 change plates)
- **The algorithm is subtle.**
  - "Largest first" (greedy) is optimal for **unlimited** standard sets.
  - With a **limited inventory** (e.g. only one pair of 45s, or no 35s), greedy can fail when a solution exists.
  - Use a **bounded search (DP over plate counts)** to find an exact load, or the closest one, with the fewest plates.
  - No competitor explains this.
- **Bar weights (FAQ for `bar weight on bench press`; verify):**
  - Men's Olympic bar **20 kg (44.1 lb)**, sold in the US as **45 lb (20.4 kg)**. These are two different products. Coachway conflates them ("20 kg (45 lb, technically 44.1 lb)").
  - Women's Olympic bar 15 kg (33.1 lb); US "35 lb" bars are 15.9 kg. Boostcamp uses 33 lb ✔.
  - **Technique bars:** 5–15 kg, or 10–25 lb.
  - **EZ curl:** about 15–25 lb. **Trap/hex:** about 45–75 lb. **Safety squat:** about 60–70 lb. These are ranges that vary by brand.
  - **Smith machine:** the effective bar weight varies by machine (some are counterbalanced). **Check the machine's label.** None of the competitors cover this well.
  - `TODO(owner)`: cite IWF/IPF technical rules for the competition bar and plates, and use "typical" wording for the others.
- **Competition specifics (cited):**
  - IWF/IPF plate colours: 25 red, 20 blue, 15 yellow, 10 green, 5 white; smaller change plates in various colours.
  - **Competition collars 2.5 kg each** (5 kg a pair).
  - `TODO(owner)`: cite the IWF Technical & Competition Rules and the IPF Technical Rules.
- **Errors found (re-checked by us):**
  - **Arvo:**
    - **495 lb** is listed as "4×45 + 25 + 5 per side", which totals **465 lb**. The correct load is **5×45 per side**.
    - **500 lb** is listed as "4×45 + 25 + 5 + 2.5", which totals **470 lb**. The correct load is **5×45 + 2.5 per side**.
    - It mixes total and per-side notation.
    - Its title says "what to load for any weight", which overclaims.
  - **Coachway:**
    - Its FAQ says the kg and lb answers for "a plate plus 15" are "45 kg apart"; they are ≈ 15 kg apart.
    - The 20 kg/45 lb conflation.
    - Its FAQ mentions a "25 lb technique bar" that the tool doesn't offer.
    - A duplicated heading.
  - **Fitness Volt:**
    - A broken breadcrumb href.
    - Escaped markup in the login modal ("\<b>Google\</b>").
    - Raw "&#039;" in the meta description.
    - No Smith machine coverage; no author or date.
    - Its arithmetic is ✔ (225 lb = 2×45 per side).
  - **Boostcamp:**
    - App-only: 10 free uses, then Pro.
    - 1×1 placeholder images.
    - Its arithmetic is ✔ (warm-up rounding 126→125, 189→190, 252→250).
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | fitnessvolt.com/plate-calculator/ | Fitness publisher | Plate Calculator (~60 chars) | ~900 |
| 2 | liftvault.com/resources/barbell-plate-calculator/ | Strength-program site | Barbell Plate Calculator (updated 17 Jul 2026) | (tool + tables) |
| 3 | coachway.io/tools/plate-loading-calculator/ | Coaching SaaS tool | How Much Is 3, 4, 5 or 6 Plates on Each Side? / H1 Plate loading calculator. | 2,000–2,500 |
| 4 | boostcamp.app/features/plate-calculator | App feature page | Plate Calculator and Warm-Up Sets \| Boostcamp | 1,200–1,400 |
| 5 | arvo.guru/tools/plate-calculator | AI-coaching app tool | Plate Calculator – What to Load for Any Weight | 1,500–1,800 |

**What this tells us:**
- **Fitness Volt has the most complete web tool:**
  - target → plates, lb/kg, custom bar (trap, SSB, EZ)
  - **a saved plate inventory**, **3 collar options**, a diagram, and **reverse "load the bar" → total**
  - rounding to the next load
  - **Weak points:** technical bugs, no author or date, no Smith machine.
- **Lift Vault**:
  - kg and lb sets, a loaded-bar drawing, and the "closest loadable" suggestion
  - common-load tables, IPF colours, and a **competition-collar note** (subtract 5 kg)
  - links to its 1RM and attempt calculators
- **Coachway** targets the **"how much is 3/4/5/6 plates"** query: a correct plate-count chart in both systems (315 lb, 140 kg ✔) and 13 FAQs.
  - Two FAQ errors and heavy trial CTAs.
- **Boostcamp** is an app promo. Its best idea is **warm-up sets from the working set** (3 templates) with rounding to the smallest plate.
- **Arvo** has a custom plate list, bar options and 8 FAQs. **Two of its worked loads are wrong**, and it has no collars, no reverse mode and no visual.
- **No page offers all of these:**
  1. target → plates per side, **and** loaded bar → total
  2. **an inventory with counts** (pairs owned), solved exactly with a bounded search, not just greedy
  3. collars (none / spring ≈ 0.25 kg / training ≈ 0.5–1 kg / competition 2.5 kg), counted correctly
  4. a **plate SVG** in IWF colours (kg) or neutral colours (lb), with sizes to scale, labelled for accessibility
  5. **nearest loadable below and above** when the target is impossible
  6. **"how much is N plates"** quick answers, plus **mixed units** (kg plates on a lb bar)
  7. **a warm-up ladder** to the target, rounded to loadable weights (link to 1RM #10)
  8. a **bar-weight FAQ** including the Smith machine, with "check the label" honesty

---

## 2. Feature matrix — tool

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Fitness Volt | Lift Vault | Coachway | Boostcamp | Arvo |
|---|---|---|---|---|---|
| Target → plates per side | ✅ | ✅ | ✅ | ✅ (app) | ✅ |
| Loaded bar → total | ✅ | ❌ | ❌ | ❌ | ❌ |
| lb + kg sets | ✅ | ✅ | ✅ | ✅ | ✅ |
| Custom bar weight | ✅ | ✅ | ⚠️ (3 presets) | ✅ | ✅ |
| Plate inventory | ✅ (saved) | ❌ | ✅ (tick pairs) | ✅ (Manage Equipment) | ⚠️ |
| Counts per plate (limited pairs) | ⚠️ | ❌ | ❌ | ⚠️ | ❌ |
| Collars | ✅ (3) | ⚠️ (note) | ❌ | ❌ | ❌ (text only) |
| Closest loadable if impossible | ✅ (FAQ) | ✅ | ✅ (+ remainder) | ✅ | ⚠️ |
| Nearest below **and** above | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ |
| Plate diagram | ✅ | ✅ | ⚠️ (one side) | ⚠️ | ❌ |
| Competition colours | ✅ | ✅ | ❌ | ❌ | ✅ (text) |
| "N plates" chart | ❌ | ✅ (common loads) | ✅ | ❌ | ✅ |
| Warm-up ladder | ❌ | ❌ | ⚠️ (ChatGPT prompt) | ✅ | ❌ |
| Mixed units (kg plates, lb bar) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Web, free, no limits | ✅ | ✅ | ✅ | ❌ (**app, 10 uses**) | ✅ |

---

## 3. Feature matrix — content and trust

| Item | Fitness Volt | Lift Vault | Coachway | Boostcamp | Arvo |
|---|---|---|---|---|---|
| Worked examples correct | ✅ | ✅ | ⚠️ (FAQ errors) | ✅ | ❌ (**495, 500 lb**) |
| Bar weights accurate | ✅ | ✅ | ❌ (conflated) | ✅ | ✅ |
| Smith machine covered | ❌ | ❌ | ❌ | ❌ | ❌ |
| Competition rules cited | ⚠️ | ⚠️ | ❌ | ❌ | ⚠️ |
| Author / date | ❌ | ✅ (date) | ❌ | ✅ (date) | ❌ |
| FAQ | ✅ | ⚠️ | 13 | 6 | 8 |
| Technical bugs | **several** | — | duplicate heading | placeholder images | — |
| Promotion | login prompts | related tools | **trial CTAs** | **app + Pro** | **app CTAs** |

---

## 4. Competitor-by-competitor detail

### 1. Fitness Volt: Plate Calculator
- **Features:**
  - Target → plates, lb/kg, custom bar, saved inventory.
  - Collars (3 options; competition 2.5 kg ✔; spring ≈ 0.5 lb).
  - A diagram and a reverse "Load the bar" mode.
  - Rounding explained in the FAQ.
  - Bar ranges (EZ 15–25, SSB 60–70, trap 45–75 lb); IWF/IPF colours.
- **Errors:**
  - Broken breadcrumb; escaped login markup; raw entity.
  - Duplicate logo markup; the schema screenshot is the same as the image.
  - Stray header text.
- **Weak points:** no Smith machine; no author or date.

### 2. Lift Vault: Barbell Plate Calculator (updated 17 Jul 2026)
- **Features:**
  - Target + bar → plates per side, drawn.
  - The closest loadable weight; kg and lb sets.
  - Common-load tables; kg colours; the competition-collar note.
  - Links to 1RM and attempts tools; a printable chart.
- **Weak points:** no reverse mode, no inventory counts, no collar input.

### 3. Coachway: Plate Loading Calculator
- **Features:**
  - kg/lb; bars of 20/15/10 kg and 45/35 lb; ticked plates.
  - The remainder and closest loadable; a below-bar warning.
  - The "3–7 plates" chart ✔; 13 FAQs.
- **Errors:**
  - "45 kg apart" (≈ 15).
  - The 20 kg = 45 lb conflation.
  - A "25 lb technique bar" not in the tool.
  - A duplicate heading.
- **Weak points:** the visual shows one side only; trial CTAs; ChatGPT prompts.

### 4. Boostcamp: Plate Calculator (app feature)
- **Features:** up to 1,000 lb / 500 kg; closest load; custom bars and plates; **warm-up sets (3 templates)**; smallest-plate rounding.
- **Checked ✔:** the warm-up rounding.
- **Weak points:**
  - App-only, limited to 10 free uses.
  - Placeholder images.
  - Inconsistent "warm-up" spelling.

### 5. Arvo: Plate Calculator
- **Features:** standard, women's or custom bar; a customisable plate list; metric/imperial; 8 FAQs; a "1–6 plates" table ✔ (585 lb / 260 kg ✔).
- **Errors:**
  - **495 lb → 465 lb.**
  - **500 lb → 470 lb.**
  - Mixed notation.
  - "Any weight" overclaims.
  - An unsourced "±10 g" claim.
- **Weak points:** no collars, no reverse mode, no visual; app CTAs.

---

## 5. Patterns

**Solver**
- **Inputs:**
  - Target, units, bar (preset or custom), collars (preset or custom, per side).
  - Inventory: plate weight × pairs available. Default is unlimited standard sets.
  - Optional plate units different from the bar's (convert exactly with 0.45359237).
- **Per side:** need = (target − bar − 2 × collar) ÷ 2.
  - If need < 0, show "target below bar + collars".
- **Search:**
  - Bounded DP over plate counts (plate weights scaled to integer units, e.g. 0.25 kg or 1.25 lb).
  - Find an exact load with the fewest plates (tie-break: heavier plates first).
  - Otherwise find the nearest achievable below and above, with the difference shown.
- **Reverse:** a plate list per side + bar + collars → total (lb and kg).

**Reference examples (our arithmetic)**

| Target | Bar | Per side | Plates per side |
|---|---|---|---|
| 225 lb | 45 lb | 90 lb | 45 + 45 |
| 315 lb | 45 lb | 135 lb | 45 × 3 |
| 495 lb | 45 lb | 225 lb | 45 × 5 |
| 500 lb | 45 lb | 227.5 lb | 45 × 5 + 2.5 |
| 140 kg | 20 kg | 60 kg | 25 + 25 + 10 (or 25 + 20 + 15, also 3 plates; tie-break picks heavier first) |
| 102.5 kg | 20 kg | 41.25 kg | 25 + 15 + 1.25 |
| 100 kg, competition collars | 20 kg | 37.5 kg | 25 + 10 + 2.5 |

**"How much is N plates" (45 lb plates, 45 lb bar):** 1 = 135 · 2 = 225 · 3 = 315 · 4 = 405 · 5 = 495 · 6 = 585 lb.
**kg (20 kg bar, 25 kg plates):** 1 = 70 · 2 = 120 · 3 = 170 · 4 = 220 kg.

**SVG**
- Plates drawn to relative diameter and thickness (approximate) on both sides.
- IWF colours for kg; neutral for lb.
- A text list for screen readers.

**Warm-up ladder (optional)**
- Bar × 2 sets, then about 40% / 60% / 75% / 85% of the target, rounded to loadable weights.
- `TODO(owner)`: label it "an example progression, not a programme".

**Coverage across the 5 competitors**

| Section | Pages (of 5) |
|---|:---:|
| Reverse mode | 1 |
| Inventory with counts, exact solver | **0** |
| Collars as input | 1 |
| Nearest below + above | **0** (partial only) |
| Mixed units | **0** |
| Smith machine FAQ | **0** |
| All examples correct | 3 |
| Warm-up ladder (web, free) | **0** |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How much does the bar weigh on bench press? | `bar weight on bench press` |
| 2 | ★ How much is 2, 3, 4 or 5 plates on each side? | Coachway, Arvo, Lift Vault |
| 3 | ★ How do I work out which plates to put on the bar? | `barbell weight calculator`, all |
| 4 | ★ Is an Olympic bar 45 lb or 20 kg? | Coachway, Fitness Volt, Boostcamp |
| 5 | Do collars count toward the weight? | Fitness Volt, Lift Vault |
| 6 | How much does a Smith machine bar weigh? | gap |
| 7 | How much does a women's bar, EZ bar or trap bar weigh? | Fitness Volt, Arvo |
| 8 | What if I can't make the exact weight? | Fitness Volt, Coachway, Boostcamp |
| 9 | What do the plate colours mean? | Lift Vault, Fitness Volt |
| 10 | Can I use kg plates on a lb bar? | gap (mixed units) |

---

## 7. Gaps nobody fills — our opportunities

1. **An exact solver for limited inventories** (DP over counts), not just greedy.
2. **Both directions** (target → plates, plates → total) and **collars as an input.**
3. **Nearest loadable below and above**, with the difference shown.
4. **Mixed units** (kg plates on a lb bar, common in home gyms).
5. **An accessible plate SVG** with IWF colours.
6. **Honest bar-weight content**, including the 20 kg vs 45 lb distinction and the Smith machine ("check the label").
7. **A free web warm-up ladder**, linked to One Rep Max (#10).
8. **Correct examples throughout** (Arvo has two wrong loads).
9. **Links:** One Rep Max (#10), FFMI (#26), Calories Burned (#23), Metric Conversion (Batch 5 #20).

---

## 8. Blueprint for the KKCTools Barbell Plate Calculator

### 8.1 SEO

- **URL:** `/barbell-plate-calculator/`
- **Title:** Barbell Plate Calculator – Plates per Side
- **H1:** Barbell Plate Calculator: Which Plates to Load on Each Side
- **Meta:** as in the keyword file (153 chars).
- **H2s:**
  - "How much does the bar weigh?"
  - "How much is 3, 4 or 5 plates?"
  - "Loaded bar total"
  - "Using your own plates"
  - "Warm-up sets"
- **Schema:** `WebApplication` + `FAQPage`.

### 8.2 Tool spec

| Area | Spec |
|---|---|
| Modes | Target → plates; plates → total |
| Inputs | Units; bar (Olympic 20 kg, 45 lb, women's 15 kg / 35 lb, technique, EZ, trap, custom); collars; inventory with pair counts (saved locally) |
| Solver | Exact bounded search; fewest plates; nearest below/above |
| Output | Plates per side, total check, SVG, text list |
| Extras | "N plates" table; warm-up ladder; competition mode (IWF/IPF collars + colours) |
| UX | Share URL, copy, print, no network |

### 8.3 Content outline (≈ 700–1,000 words, original)

1. Intro and calculator
2. How to load a barbell (per-side maths, worked example)
3. Bar weights (Olympic, women's, technique, EZ, trap, Smith machine)
4. How much is 1–6 plates (lb and kg tables)
5. Collars, and competition loading (cited)
6. Using your own plate set (inventory)
7. Warm-up sets (example ladder)
8. FAQ (10)
9. Related tools

### 8.4 Quality checks

- **Unit tests:**
  - All reference examples, including 495/500 lb.
  - The inventory-limited case where greedy fails.
  - Example: per side 50 lb with inventory {35×1, 25×2, 10×0, 5×0}. Greedy picks 35, then can't make 15. The exact answer is 25+25.
  - Impossible targets give the nearest below and above.
  - Reverse mode.
  - Mixed-unit conversion.
  - Collars.
- No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - Pull Google top 10.
  - Cite the IWF/IPF technical rules.
  - Confirm the typical bar-weight ranges, or label them as typical.
  - Approve the warm-up wording.
