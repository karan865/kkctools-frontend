# Calories Burned Walking & Steps to Calories — Competitor Analysis

> **Target page:** KKCTools `/calories-burned-walking/` (Batch 8, Tool #23 ✅, health-adjacent)
> **Primary keyword:** `calories burned walking` — US 6,600 · KD 12.
> - Cluster: 6 keywords, 19,900 US searches.
> - Other terms: `calories burned running a mile` (2,400 / **KD 0**), `calorie burner calculator` (1,000 / KD 0), `steps to calories calculator`, `calorie expenditure calculator`, `how many calories do you burn running a mile`, `step calorie calculator`.
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 8. Competitors come from a live web search on 2026-11-14 for `calories burned walking calculator steps`.
> - Other results seen but not audited: Inch (steps-to-calories), rapidtoolset, caloriesburnedhq steps page, Garage Gym Reviews, hsalist, havenofheat, walks4all, buildingclub.
> - A Google Sites page styled as a news article was also seen (possible spam). It is not audited.
> - `TODO(owner): pull Google top 10 for "calories burned walking" and "steps to calories".`
> **Pages visited (2026-11-14):** 5 read: Inch (calories burned walking), Omni (steps to calories), CaloriesBurnedHQ (walking), Fitness Volt (steps to calories), Captain Calculator (walking).

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Calculator sites: Inch, Omni, Captain Calculator.
  - A dedicated calorie site: CaloriesBurnedHQ.
  - A fitness publisher: Fitness Volt.
  - Gym-gear review sites: Garage Gym Reviews.
  - Small tool sites.
- **Everyone uses the MET formula:** kcal = MET × 3.5 × kg ÷ 200 × minutes, which equals MET × kg × hours.
  - **Nobody distinguishes gross from net.** Gross includes the calories you would have burned at rest anyway. **Net = (MET − 1) × kg × hours** is what "extra calories from walking" really means.
  - For a 3.5 MET walk, net is about 29% lower than gross. That is a big, honest gap we can fill.
- **MET values must cite the Compendium of Physical Activities** (keyword file rule).
  - **Walking speed codes from the 2011 Compendium (Ainsworth et al.), level firm surface:**
    - 2.0 mph ≈ 2.8
    - 2.5 mph ≈ 3.0
    - 2.8–3.2 mph ≈ 3.5
    - 3.5 mph ≈ 4.3
    - 4.0 mph ≈ 5.0
    - 4.5 mph ≈ 7.0
  - A **2024 Adult Compendium** (Herrmann et al. 2024) updates the values.
  - `TODO(owner)`: choose the edition, transcribe the walking and running codes from the primary source, and cite it. Don't copy competitor tables.
- **Steps → distance:**
  - Stride heuristics differ: Omni uses **height × 0.414**, Fitness Volt **height × 0.46**.
  - **Offer a measured-stride input** (walk 10 steps, measure, divide) and label the heuristic as approximate.
  - `TODO(owner)`: cite a source for the coefficient we pick.
- **Errors found (re-checked by us):**
  - **CaloriesBurnedHQ, many internal contradictions:**
    - 30-minute ranges: "100–175" vs the table's 93–238.
    - 60-minute ranges: "200–300" vs "300–400" vs "200–350".
    - "About 50 kcal per km" vs "100 per mile" (≈ 62/km). Its 5 km and 10 km rows are actually the 3- and 6-mile figures.
    - 2 miles × 5 days stated as "¼–½ lb"; it is ≈ 0.2–0.34 lb, so the upper bound is overstated.
    - 3 × 650–1,200 = 1,950–3,600, not 2,100–3,600.
    - A duplicated CDC source.
    - Affiliate links with no visible disclosure.
  - **Omni:**
    - It calls 70 kg "approx. 160 lb"; it is ≈ 154 lb.
    - Its formula's time unit is unstated.
    - It has one source. Its 2 mph FAQ value is ≈ 3 kcal off.
  - **Captain Calculator:**
    - Its intro (286 kcal/h for 200 lb at 2.5 mph) implies MET ≈ 3.15, which conflicts with its own 2.5 mph activity.
    - The content was last updated in 2020, and it never says gross vs net.
    - Typos: "talk", "compares shows".
  - **Fitness Volt:**
    - Its weight bounds don't match (67 lb ≠ 30 kg).
    - Its brisk MET of 4.8 isn't in its own table.
    - Its dates conflict.
  - **Inch:**
    - Its moderate MET range (2.0–5.0) overlaps slow and brisk.
    - It mentions a load-based MET but has no load input.
    - Its Example 2 (386 kcal) is ✔ when 180 lb = 81.65 kg is used precisely.
- **Health-adjacent:** add "estimates vary ±20–30% between people" (cite) and no weight-loss promises. Link to TDEE (#20) instead of using 3,500 kcal maths.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | inchcalculator.com/calories-burned-walking-calculator/ | Calc site | Calories Burned Walking Calculator | 700–800 |
| 2 | omnicalculator.com/sports/steps-to-calories | Calc site | Steps to Calories Calculator | 1,200–1,400 |
| 3 | caloriesburnedhq.com/calories-burned-walking/ | Dedicated calorie site | Walking Calorie Calculator: 10,000 Steps, 1 Mile & 1 Hour Results | 3,000–3,500 |
| 4 | fitnessvolt.com/steps-to-calories-calculator/ | Fitness publisher | Steps to Calories Calculator | ~1,100 |
| 5 | captaincalculator.com/health/calorie/calories-burned-walking-calculator/ | Calc site | Calories Burned Walking \| Calculator & Formula | ~700 |

**What this tells us:**
- **Fitness Volt has the best method:**
  - steps up to 24 h, weight, **height or measured step length**, pace or a timed walk
  - the Compendium formula; examples that reproduce ✔
  - 6 sources and 3 FAQs; a CSCS author
  - **Gaps:** no disclaimer, no gross/net distinction, and the brisk MET is missing from its table.
- **Omni** does steps → distance → time → kcal (3 speed presets, METs 2.8 / 3.5 / 5).
  - PhD author, PhD and MD reviewers.
  - **Weak points:** a single source, an unsourced stride coefficient, and the kg/lb slip.
- **CaloriesBurnedHQ** has the most long-tail content (10,000 steps, 1 mile, 1 hour, per km, per minute, weekly tables).
  - It is **riddled with contradictions** and hides its formula and METs.
- **Inch** offers 6 activity categories (including hills and stairs) from the Compendium, with credentialed authors and 5 references.
  - **Missing:** distance, steps, incline input and an FAQ. Its MET ranges overlap.
- **Captain Calculator** shows a deck of activities for one weight and time, a formula, a worked example ✔ and an FAQ.
  - It is dated (2020), and its intro figures mismatch its METs.
- **No page offers all of these:**
  1. **input by steps, distance or time**, all converting to each other
  2. a **pace selector with cited Compendium METs** for walking **and running**
  3. **incline** (the ACSM walking equation) and an optional **backpack load**
  4. **gross and net calories** shown side by side, with an explanation
  5. a **measured stride** option plus a height heuristic
  6. a **steps × body weight table** (1,000–20,000 steps) generated by our code
  7. the **"calories per mile running"** answer (KD 0 long tail)
  8. consistent, contradiction-free numbers with a cited error range

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Inch | Omni | CaloriesBurnedHQ | Fitness Volt | Captain Calc |
|---|---|---|---|---|---|
| Input: time | ✅ | ⚠️ (derived) | ⚠️ (tables) | ✅ (timed walk) | ✅ |
| Input: steps | ❌ (other page) | ✅ | ⚠️ (tables) | ✅ | ❌ |
| Input: distance | ❌ | ❌ | ⚠️ (tables) | ⚠️ | ❌ |
| Height → stride | ❌ | ✅ (0.414) | ❌ | ✅ (0.46) | ❌ |
| Measured stride | ❌ | ❌ | ❌ | ✅ | ❌ |
| Pace presets | ✅ (6 categories) | ✅ (3) | ✅ (4) | ✅ | ✅ (deck) |
| Running | ❌ | ❌ | ⚠️ (claim) | ❌ | ⚠️ (deck) |
| Incline / hills | ⚠️ (category) | ❌ | ❌ | ❌ | ⚠️ (deck) |
| Load / backpack | ❌ (mentioned) | ❌ | ❌ | ❌ | ❌ |
| Gross vs net | ❌ | ❌ | ❌ | ❌ | ❌ |
| Steps × weight table | ❌ | ❌ | ⚠️ (10k only) | ⚠️ (per 1,000) | ⚠️ (10k FAQ) |
| kcal per mile / km / step | ❌ | ⚠️ (per step) | ✅ (**km wrong**) | ✅ | ⚠️ |

---

## 3. Feature matrix — content and trust

| Item | Inch | Omni | CaloriesBurnedHQ | Fitness Volt | Captain Calc |
|---|---|---|---|---|---|
| Formula shown | ✅ | ✅ (unit unclear) | ❌ | ✅ | ✅ |
| METs tied to the Compendium | ✅ (ranges overlap) | ⚠️ (Brooks 2005) | ⚠️ (cited, not tied) | ✅ | ✅ (2015 retrieval) |
| Numbers internally consistent | ⚠️ | ⚠️ | ❌ (**many**) | ⚠️ | ❌ (**intro**) |
| Gross / net explained | ❌ | ❌ | ❌ | ❌ | ❌ |
| Accuracy caveat cited | ❌ | ❌ | ❌ | ⚠️ (assumptions) | ⚠️ |
| Disclaimer | ❌ | ❌ | ❌ | ❌ | ❌ |
| Author / reviewer | ✅ (DO + MS) | ✅ (PhD, MD) | ✅ | ✅ (CSCS) | ❌ |
| Date | ❌ | ❌ | ✅ (May 2026) | ⚠️ (conflicting) | ✅ (**2020**) |
| FAQ | 0 | 4 | ✅ | 3 | ✅ |
| Promotion | — | — | **affiliate, undisclosed** | share/login | — |

---

## 4. Competitor-by-competitor detail

### 1. Inch Calculator: Calories Burned Walking (Holly Smith, DO; reviewer Hannah Daugherty, MS)
- **Features:** 6 activity categories (slow, moderate, brisk, hiking, hills, stairs), weight in lb/kg/st, duration, and a Compendium MET table.
- **Checked ✔:** 180 lb, 30 min, MET 6.3 ≈ 270 kcal; MET 9.0 ≈ 386 kcal (exact weight).
- **Weak points:**
  - Overlapping MET ranges, and it's unclear which value in a range is used.
  - A load is mentioned with no input.
  - No steps or distance; no FAQ.
  - The fracture-risk claim isn't supported by its cited title.

### 2. Omni: Steps to Calories (Joanna Michałowska, PhD; reviewers Dominik Czernia, PhD, and Łucja Zaborowska, MD)
- **Features:** weight, height, steps, speed (0.9 / 1.34 / 1.79 m/s → 2.8 / 3.5 / 5 MET), kcal per step, 4 FAQs.
- **Checked:** 70 kg, 183 cm, 10,000 steps, 3 mph ≈ 404 kcal ✔.
- **Errors:**
  - 70 kg ≈ 160 lb (should be ≈ 154).
  - "1 source" numbered 3.
  - The time unit is unstated.
  - 2 mph FAQ value ~3 kcal off.
- **Weak points:** unsourced stride coefficient and health claims.

### 3. CaloriesBurnedHQ: Walking Calorie Calculator (Noleen Arendse; reviewer Gareth Chapman; updated 3 May 2026)
- **Features:** weight plus 4 paces; tables for 30 min, 1 h, per minute, weekly mileage and brisk 5-minute; weight-loss projections.
- **Errors:** all the contradictions listed in §0, plus:
  - two near-duplicate headings
  - "2,000 steps per mile" against its own stride figures
  - an unsupported running claim (572 kcal)
  - a stale Amazon price
  - mismatched affiliate tags
- **Weak points:** the formula and METs are not disclosed; affiliate links are undisclosed.

### 4. Fitness Volt: Steps to Calories (Tom Miller, CSCS)
- **Features:** steps (≤ 24 h), weight, height or measured step length, pace or a timed walk, the Compendium formula, per-1,000-step figures, 6 sources, 3 FAQs.
- **Checked ✔:** 10,000 steps × 31.7 in = 5.01 mi; 411 / 499 kcal at 3.4 / 2.8 mph (3.8 MET, 69.85 kg).
- **Errors:**
  - 67 lb vs 30 kg.
  - Brisk MET 4.8 not in its table.
  - Date conflicts.
- **Weak points:** no disclaimer; no gross/net.

### 5. Captain Calculator: Calories Burned Walking
- **Features:** weight plus time; a deck of walking activities; formula; worked example (180 lb, MET 8, 1 h ≈ 686 kcal ✔); a table and distance chart (empty in capture); an FAQ.
- **Errors:**
  - Intro figures mismatch its METs.
  - 4 mph / 200 lb, 1,000 kcal time ≈ 2 h 5 m, not 2 h 6 m.
  - Typos.
  - Last updated Sep 2020.
- **Weak points:** no gross/net; dated.

---

## 5. Patterns

**Formulas**
- **Gross kcal** = MET × kg × hours. This is the same as MET × 3.5 × kg ÷ 200 × minutes.
- **Net kcal** = (MET − 1) × kg × hours. The page explains: "net = extra calories above resting".
- **Distance** = steps × stride.
  - Stride = measured, or height × coefficient, with walking and running coefficients kept separate.
  - `TODO(owner)`: cite the coefficient.
- **Time** = distance ÷ speed.
- **Incline (optional):** ACSM walking equation.
  - VO₂ (mL/kg/min) = 3.5 + 0.1·v + 1.8·v·grade, where v is in m/min and grade is a fraction.
  - kcal/min ≈ VO₂ × kg ÷ 1000 × 5.
  - Valid for about 50–100 m/min (1.9–3.7 mph).
  - `TODO(owner)`: cite the ACSM *Guidelines*.
- **Running:**
  - Compendium running codes by speed, or the ACSM running equation.
  - Common rule of thumb: about 1 kcal per kg per km of gross running cost (≈ 0.73 kcal/lb/mile).
  - `TODO(owner)`: cite it or drop it.

**Reference example (our arithmetic; Compendium 2011 values pending owner check)**
- 80 kg (176 lb) walking 3.0 mph (MET 3.5) for 1 h: gross 280 kcal, **net 200 kcal**.
- At 3 mph, 1 mile takes 20 min: gross 93, net 67 kcal per mile.

**Tables (generated by our code)**
- Steps (1,000 / 2,000 / 5,000 / 7,500 / 10,000 / 15,000 / 20,000) × weight (120–260 lb, in 20 lb steps) at a chosen pace and height. Gross and net toggle.
- 1 mile walking vs running by weight.

**Accuracy note**
- MET-based estimates can differ substantially from measured values (fitness, terrain, economy).
- Wearables also vary.
- `TODO(owner)`: cite a validation study of the error range.

**Coverage across the 5 competitors**

| Section | Pages (of 5) |
|---|:---:|
| Steps + distance + time inputs | **0** (max 2 of 3) |
| Measured stride | 1 |
| Running | **0–1** |
| Incline / load input | **0** |
| Gross vs net | **0** |
| Steps × weight table | **0** (partial only) |
| Contradiction-free | 1–2 |
| Disclaimer | **0** |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How many calories do I burn walking 10,000 steps? | Omni, CaloriesBurnedHQ, Captain, Fitness Volt |
| 2 | ★ How many calories does walking 1 mile burn? | CaloriesBurnedHQ, search summary |
| 3 | ★ How many calories do you burn running a mile? | `calories burned running a mile` (KD 0) |
| 4 | ★ How many steps does it take to burn 100 calories? | Omni, search summary |
| 5 | ★ How are calories burned walking calculated? | Omni, Inch, Fitness Volt |
| 6 | How many calories does a 30-minute or 1-hour walk burn? | CaloriesBurnedHQ, Captain |
| 7 | Does walking faster or uphill burn more calories? | Inch, CaloriesBurnedHQ |
| 8 | What is the difference between gross and net calories? | gap |
| 9 | How many steps are in a mile? | CaloriesBurnedHQ |
| 10 | Are fitness tracker calorie numbers accurate? | gap (cite) |
| 11 | Is walking or running better for burning calories? | CaloriesBurnedHQ (careful) |

---

## 7. Gaps nobody fills — our opportunities

1. **Gross and net calories**, side by side and explained. No competitor does this.
2. **Steps, distance or time** in one tool, all converting both ways.
3. **Walking and running** with cited Compendium codes, which answers the KD 0 running-a-mile query.
4. **Incline (ACSM) and optional load.**
5. **A measured-stride option** plus a cited height heuristic.
6. **Steps × weight tables generated by our code**, consistent with the calculator. CaloriesBurnedHQ contradicts itself.
7. **An honest accuracy note** and no weight-loss promises. Link to TDEE (#20).
8. **Links:** TDEE (#20), Weight Loss Date (#25), Heart Rate Zones (#11), Time Duration (#4), Pomodoro (#27), Online Timer (#28).

---

## 8. Blueprint for the KKCTools Calories Burned Walking Calculator

### 8.1 SEO

- **URL:** `/calories-burned-walking/`
- **Title:** Calories Burned Walking – Steps to Calories
- **H1:** Calories Burned Walking: Steps, Miles and Minutes to Calories
- **Meta:** as in the keyword file (155 chars).
- **H2s:**
  - "Steps to calories"
  - "Calories burned walking a mile"
  - "Calories burned running a mile"
  - "10,000 steps: how many calories?"
  - "Gross vs net calories"
- **Schema:** `WebApplication` + `FAQPage`.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Inputs | Mode (steps / distance / time); weight; height or measured stride; activity (walk/run) + pace; optional incline %; optional pack weight |
| Outputs | Gross kcal, net kcal, distance, time, steps, kcal per mile/km/1,000 steps, MET used (with Compendium code) |
| Tables | Steps × weight; mile walk vs run × weight |
| Notes | Accuracy note; "not a weight-loss promise"; link to #20 |
| UX | Share URL, copy, print, no network |

### 8.3 Content outline (≈ 1,100–1,400 words, original)

1. Intro and calculator
2. How to use it (steps, miles or minutes)
3. How calories burned are calculated (MET, gross vs net, cited)
4. Steps to miles: stride length
5. 10,000 steps, 1 mile and 1 hour (tables)
6. Walking vs running a mile
7. Speed, hills and backpacks
8. How accurate is this (and your fitness tracker)?
9. FAQ (11)
10. Sources, then related tools

### 8.4 Quality checks

- **Unit tests:**
  - Gross/net maths (280 / 200 kcal example).
  - Mode conversions round-trip.
  - The ACSM incline equation against a textbook example.
  - Table snapshot.
  - Unit conversions (lb ↔ kg exact).
- No competitor wording or tables. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - Pull Google top 10.
  - Choose the Compendium edition and transcribe the codes.
  - Cite the stride coefficient, the ACSM equations and an accuracy study.
