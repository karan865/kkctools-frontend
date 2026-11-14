# Weight Loss Date Calculator — Competitor Analysis

> **Target page:** KKCTools `/weight-loss-date-calculator/` (Batch 8, Tool #25 🟡, **YMYL health tool**)
> **Primary keyword:** `weight loss timeline calculator` — US 9,900 · KD 6 · rising.
> - Secondary: `how many calories is one pound` (2,400 / KD 7). This becomes an FAQ explaining the 3,500 kcal rule and **why it overestimates over time**.
> - Cluster: 2 keywords, 12,300 US searches.
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 8. Competitors come from a live web search on 2026-11-14 for `weight loss timeline calculator goal date`.
> - The results were dominated by **thin pages.dev / zone.id / templated clones** (bmi-jm, healthcalculatoronline, calivue, agentcalc, weightlosscalculatorhub, reset75) and **hacked or parasite pages** (internationaltrucks.com subdomain, jornaldamaia.pt uploads). They are not audited; this is noted as an opportunity.
> - Calculator.net's weight-loss URL redirected to its fitness index (no tool page). It is recorded as "not found".
> - `TODO(owner): pull Google top 10 for "weight loss timeline calculator" and "weight loss date calculator".`
> **Pages visited (2026-11-14):** 5 read: Fitness Volt (target-date URL → served its Calorie Deficit Calculator), BodySpec (blog + calculator), GetFitCraft (weight loss date), Coachway (goal weight date), and CDC "Losing Weight" (guidance source).

---

## 0. How this was collected (read first)

- **The SERP is weak.**
  - Many results are templated clones or spam.
  - Fitness Volt's "target date" URL now serves its calorie-deficit calculator.
  - That suggests a **quality page can rank** despite the 🟡.
- **There are two model types:**
  1. **Linear (3,500 kcal/lb, or 7,700 kcal/kg, fixed deficit):** Coachway, Fitness Volt, and BodySpec (whose text admits it "isn't perfectly linear").
     - This **overpromises**, because expenditure falls as weight falls.
  2. **Falling-needs / adaptive:** GetFitCraft uses Hall's rule of thumb. It is the **only** audited page that does.
     - Each sustained 100 kJ/day (≈ 24 kcal/day) change in intake leads eventually to about 1 kg of weight change. About half of it appears in about 1 year and about 95% in about 3 years.
- **The keyword file requires an adaptive model, not a straight line.**
  - Our plan: a weekly simulation that **recalculates TDEE from the new weight each week** (shared engine with #20).
  - It shows a **straight-line vs adaptive comparison**, so users see why the date moves.
  - `TODO(owner)`: cite Hall et al. 2011 (*Lancet* 378:826) and Thomas et al. 2013. A reviewer must approve the model and its wording.
- **Safe-rate guidance (cited):**
  - CDC "Losing Weight" (page dated 17 Jan 2025): people losing **about 1–2 lb a week** are more likely to keep it off.
  - Some pages use **0.5–1% of body weight per week**, which comes from Helms et al. 2014, a contest-prep population. GetFitCraft applies it generally without that caveat.
  - Use CDC as the primary warning source. `TODO(owner)`: confirm wording with the reviewer.
- **Errors found (re-checked by us):**
  - **Fitness Volt (calorie deficit):**
    - Its calorie floors conflict: "1,200 women / 1,500 men" vs "1.2 × BMR or 1,200".
    - Its protein uses 150 lb for a 190 lb example.
    - It promises an "adaptive" model and a "weekly table" but delivers neither.
    - An FAQ heading confuses a 1,200 kcal **intake** with a 1,200 kcal **deficit**.
    - Its own references (Thomas; Hall & Chow) contradict its 3,500 rule, and that goes unmentioned.
  - **BodySpec:**
    - It says calories "fall between 1,200 and 1,800", but its own examples give 2,240 and 2,671.
    - Its safe-rate ranges differ by section (0.5–2 vs 1–2 lb/week).
    - The model is described as non-linear but is computed linearly.
    - Its examples are consistent ✔ (Greg: 625 × 84 = 52,500 kcal = 15 lb).
  - **Coachway:**
    - Its "Steady (recommended)" preset of **0.5 lb/week (≈ 0.23 kg)** sits **below its own 0.45 kg lower bound** for its 90 kg example.
    - It cites Hall 2011 while using a linear model.
    - 0.625 is shown as 0.62.
  - **GetFitCraft:**
    - No H1, and rendering artifacts.
    - It applies Helms 0.5–1% outside its population.
    - Its "40 lb in 4 months" figures drift by 10–30 kcal/day.
    - Its weekly table was recomputed by the auditor and **matched within 0.1 lb** ✔.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | fitnessvolt.com/weight-loss-target-date-calculator/ → Calorie Deficit Calculator | Fitness publisher | Calorie Deficit Calculator – Fitness Volt | 1,800–2,000 |
| 2 | bodyspec.com/blog/post/weight_loss_calculator_by_date… | DEXA company blog + calc | Weight Loss Calculator by Date: Set a Date, Get Your Plan | ~3,000 |
| 3 | getfitcraft.com/tools/weight-loss-date-calculator | Fitness tool site | Weight Loss Date Calculator: Goal Weight by Date (no H1) | 4,000–4,500 |
| 4 | coachway.io/tools/goal-weight-date-calculator/ | Coaching tool site | Goal Weight Date Calculator (Free Target Date, 2026) | ~2,000 |
| 5 | cdc.gov/healthy-weight-growth/losing-weight/ | US government guidance | Losing Weight | (guidance) |

**What this tells us:**
- **GetFitCraft is the quality benchmark:**
  - two forward modes, a **reverse mode (target date → required deficit)**, and weekly milestones
  - a **falling-needs model** with the simplification disclosed
  - 12 DOI references and a named author
  - **Weak points:** no H1, broken text rendering, a population-misapplied rate rule, and about 4,000+ words that are hard to scan.
- **Coachway** has a clean linear tool (rate presets, a date → required-rate table, kg/lb), 9 FAQs, a disclaimer ✔ and a date.
  - Its recommended preset contradicts its own band, and it cites Hall while running a linear model.
- **BodySpec**:
  - Mifflin/Katch, 1,200/1,500 floors and a 1,000 kcal cap.
  - Red-flag warnings and milestones, with three consistent personas.
  - **Weak points:** a linear model despite saying otherwise, heavy DEXA promotion, and an anonymous "Team" author.
- **Fitness Volt** no longer has a dedicated date tool. Its deficit calculator has several internal conflicts.
- **CDC** gives the citable safe-rate statement (1–2 lb/week) but no calorie maths.
- **No page offers all of these:**
  1. **a visible adaptive vs linear comparison** (two lines on one chart) with an honest explanation
  2. **three modes:** by deficit, by weekly rate, and by **target date** (reverse)
  3. a **week-by-week table** (weight, TDEE that week, intake, cumulative loss) generated by our code
  4. **safe-rate warnings cited to CDC**, plus calorie floors from the shared engine
  5. an "update with your real weight" mode that re-plans from actual progress
  6. a clean, accessible layout (a proper H1 and no rendering artifacts)
  7. YMYL: a disclaimer, a reviewer, and screening notes (pregnancy, eating-disorder history, medical conditions, GLP-1 medicines → talk to a clinician)

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Fitness Volt | BodySpec | GetFitCraft | Coachway | CDC |
|---|---|---|---|---|---|
| Goal date from deficit | ⚠️ (weekly loss only) | ✅ | ✅ | ⚠️ (from rate) | ❌ |
| Goal date from weekly rate | ✅ (% options) | ✅ | ✅ | ✅ | ❌ |
| Reverse: date → required deficit | ❌ | ✅ | ✅ | ✅ (table) | ❌ |
| TDEE built in | ✅ | ✅ | ✅ (maintenance check) | ❌ | ❌ |
| Adaptive (falling needs) | ❌ (claimed) | ❌ (claimed) | ✅ | ❌ | — |
| Linear vs adaptive comparison | ❌ | ❌ | ✅ (columns) | ❌ | — |
| Week-by-week table | ❌ (claimed) | ⚠️ (milestones) | ✅ | ✅ (summary) | — |
| Safe-rate warning | ⚠️ | ✅ | ✅ | ⚠️ (**preset conflict**) | ✅ (1–2 lb) |
| Calorie floor | ⚠️ (**conflict**) | ✅ | ⚠️ | ❌ | — |
| Update with actual progress | ❌ | ⚠️ (advice) | ❌ | ⚠️ (ChatGPT prompt) | — |
| Chart | ❌ | ❌ | ✅ | ❌ | — |
| kg / lb | ✅ | ✅ | ✅ | ✅ | — |

---

## 3. Feature matrix — content and trust

| Item | Fitness Volt | BodySpec | GetFitCraft | Coachway | CDC |
|---|---|---|---|---|---|
| Model disclosed honestly | ❌ | ❌ (**says non-linear**) | ✅ | ⚠️ (cites Hall, uses linear) | — |
| 3,500 kcal rule critiqued | ❌ (refs only) | ⚠️ | ✅ | ⚠️ | — |
| Examples correct | ⚠️ (protein) | ✅ | ✅ (minor drift) | ✅ (rounding) | — |
| Internally consistent | ❌ | ❌ | ⚠️ | ❌ | ✅ |
| Safe rate cited | ✅ (2013 guideline) | ⚠️ (NIDDK) | ⚠️ (Helms misapplied) | ❌ | ✅ (source) |
| Medical disclaimer | ❌ | ⚠️ | ⚠️ | ✅ | ✅ |
| Special populations screened | ❌ | ⚠️ (GLP-1 FAQ) | ❌ | ❌ | — |
| Named author / reviewer | ✅ (ACE; reviewer muddled) | ❌ (Team) | ✅ | ✅ | agency |
| Date | ✅ (Oct 2026) | ✅ (Sep 2025) | ✅ | ✅ (Sep 2026) | ✅ (Jan 2025) |
| FAQ | ✅ | ✅ | 6 | 9 | — |
| Promotion | **heavy** | **heavy (DEXA)** | — | ChatGPT prompt | none |

---

## 4. Competitor-by-competitor detail

### 1. Fitness Volt (target-date URL → Calorie Deficit Calculator; Matthew Magnante, ACE)
- **Features:** weight, height, age 18–100, sex, 5 activity levels, deficit (250–1,000 / 0.5% / 1% / custom), lifting, goal weight, meals, body fat.
- **Checked ✔:** BMR 1,558; target 1,880; 1.0 lb/week; macros (fat and carbs).
- **Errors:**
  - Floors conflict.
  - **Protein basis 150 lb vs 190 lb.**
  - Adaptive and weekly table promised but not delivered.
  - The 1,200 "deficit" vs intake confusion.
  - Its own references go unacknowledged.
  - Schema and reviewer inconsistencies.
- **Weak points:** no disclaimer; newsletter pop-ups; possible undisclosed affiliate link.

### 2. BodySpec: Weight Loss Calculator by Date (BodySpec Team, 5 Sep 2025)
- **Features:**
  - Mifflin/Katch and activity 1.2–1.9.
  - Floors of 1,200/1,500 and a 1,000 kcal cap.
  - Red flags, macros and milestones.
  - Personas (Greg, Hannah, Frank all ✔).
  - A broad FAQ, including GLP-1.
- **Errors:**
  - The 1,200–1,800 claim vs its own examples.
  - Rate ranges inconsistent.
  - Linear maths despite non-linear wording.
  - Duplicate H1.
  - Unnamed "expert guidelines".
- **Weak points:** heavy DEXA promotion; unsourced accuracy claims.

### 3. GetFitCraft: Weight Loss Date Calculator (Domenic Angelino)
- **Features:**
  - Two forward modes and a reverse mode, weekly milestones, a maintenance check, metric/imperial.
  - The **3,500 rule vs falling-needs** comparison (100 kJ/kg slope ≈ 10.8 kcal/lb).
  - 12 references and 6 FAQs.
- **Checked ✔:** the auditor recomputed the weekly table at 9 points (within 0.1 lb) and confirmed the calendar dates.
- **Errors:**
  - No H1.
  - Merged text artifacts.
  - Helms 0.5–1% presented as general guidance.
  - "40 lb in 4 months" drift.
  - Unverifiable specific figures.

### 4. Coachway: Goal Weight Date Calculator (Markus Evers, updated 25 Sep 2026)
- **Features:** rate presets 0.25–2 lb/week, weeks and date, implied deficit, kg/lb, a required-rate table (20 cells ✔ apart from rounding), 9 FAQs, a disclaimer ✔.
- **Errors:**
  - **Its recommended preset is below its own band.**
  - Claimed caps and flags aren't visible.
  - Hall cited with a linear model.
  - 0.625 shown as 0.62.
  - A duplicate heading.
  - Unsourced muscle and rebound claims.
- **Weak points:** a promotional ChatGPT FAQ.

### 5. CDC: Losing Weight (17 Jan 2025)
- **Guidance:** "about 1 to 2 pounds a week" is more likely to be kept off; keep a food diary. No calorie targets.
- **Use:** cite it in our safe-rate warning.

---

## 5. Patterns

**Inputs**
- Sex, age, height, current weight, goal weight, activity (from #20), and one of:
  - a daily deficit (kcal)
  - a weekly rate (lb/kg, or % of body weight)
  - a target date (reverse mode)

**Adaptive weekly simulation (our method; reviewer approval required)**
1. Week 0: TDEE₀ = BMR(W₀) × AF. Planned intake I = TDEE₀ − deficit. Intake is held fixed, as people usually keep the same plan.
2. Each week: TDEE_w = BMR(W_w) × AF. Weekly change ΔW = 7 × (I − TDEE_w) ÷ ρ, with ρ = 7,700 kcal/kg (document the simplification). Then W_{w+1} = W_w + ΔW.
3. Stop when W ≤ goal, **or** when the weekly change is < 0.05 kg for 4 weeks. In that case show: "At this intake you level off near X kg. To reach the goal you'd need to adjust intake."
4. **Linear comparison:** weeks = (W₀ − goal) × ρ ÷ (7 × deficit).
5. **Reverse mode:** solve for the deficit (binary search) that reaches the goal by the date under the adaptive model.
   - If the required rate exceeds the warning threshold or the intake is below the floor, show a warning and suggest a later date.

**Reference example (our arithmetic, linear part)**
- 90 kg → 80 kg with a 500 kcal/day deficit: 10 × 7,700 ÷ (7 × 500) = **22 weeks** (linear).
- The adaptive model will be longer, because TDEE falls by about (10 kg × 10 kcal/kg Mifflin term) × AF ≈ 155 kcal/day at moderate activity by the end.
- The exact adaptive figure will come from the engine's unit test (fixture to be recorded).

**Warnings**
- Rate > 2 lb (≈ 0.9 kg) per week, or above the cited % → warn, citing CDC.
- Intake below the floor (shared with #20) → refuse to plan.
- Special populations (under 18, pregnant or breastfeeding, eating-disorder history, diabetes or GLP-1 medicine, medical conditions) → "talk to a clinician"; no numbers.
  - `TODO(owner)`: the reviewer approves the list.

**Outputs**
- Goal date (adaptive) and linear date.
- Weekly table: week, date, weight, TDEE, intake, cumulative loss.
- An SVG chart with both lines.
- A milestone list (every 5 lb or 2 kg).
- Copy, print and share.

**Coverage across the 5 pages**

| Section | Pages (of 4 tools) |
|---|:---:|
| Adaptive model | 1 |
| Linear vs adaptive shown | 1 |
| Reverse (date → deficit) | 3 |
| Week-by-week table | 2 |
| Safe rate cited to an official source | 1–2 |
| Internally consistent | 1 |
| Special-population screening | **0–1** |
| Update with real progress | **0** |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword. All answers must be reviewed by a qualified person.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ When will I reach my goal weight? | `weight loss timeline calculator`, all |
| 2 | ★ How many calories is one pound of body weight? | `how many calories is one pound` |
| 3 | ★ Why does weight loss slow down over time? | GetFitCraft, BodySpec, Coachway |
| 4 | ★ How fast is it safe to lose weight? | CDC, all |
| 5 | ★ How big should my calorie deficit be? | Fitness Volt, BodySpec |
| 6 | What if my target date is unrealistic? | BodySpec, Coachway |
| 7 | How often should I update my plan? | BodySpec (5%), Coachway |
| 8 | Why do different calculators give different dates? | BodySpec |
| 9 | Is it OK to eat below my BMR? | BodySpec (careful) |
| 10 | Does this work with GLP-1 medicines? | BodySpec (answer: talk to your prescriber) |

---

## 7. Gaps nobody fills — our opportunities

1. **An honest adaptive model** with a **visible linear comparison**, explained in plain words.
2. **Three modes** in one tool, including a reverse mode with a safe-rate check.
3. **A weekly table and chart generated by our code**, consistent with the stated model.
4. **An "update with my real weight" mode** that re-plans from actual progress.
5. **CDC-cited safe-rate warnings** plus shared floors, and **special-population screening**.
6. **A clean, fast, accessible page.** The SERP is full of thin clones and spam.
7. **An FAQ that answers "how many calories is a pound"** correctly, including why the 3,500 rule overestimates.
8. **Links:** TDEE (#20, shared engine), Macro (#22), BMI (#24), Body Fat (#19), Days Until Countdown (#3).

---

## 8. Blueprint for the KKCTools Weight Loss Date Calculator

### 8.1 SEO

- **URL:** `/weight-loss-date-calculator/`
- **Title:** Weight Loss Date Calculator – Goal Timeline
- **H1:** Weight Loss Date Calculator: When Will You Reach Your Goal Weight?
- **Meta:** as in the keyword file (148 chars).
- **H2s:**
  - "Weight loss timeline"
  - "How many calories is one pound?"
  - "Why progress slows down"
  - "How fast is safe?"
  - "Plan backwards from a date"
- **Schema:** `WebApplication` + `FAQPage`.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Inputs | Profile (shared #20), current + goal weight, mode (deficit / rate / target date), start date |
| Model | Adaptive weekly simulation + linear comparison; reverse solver |
| Outputs | Adaptive date, linear date, weekly table, chart, milestones, plateau message |
| Safety | Rate warning (CDC), floors, special-population stop |
| Progress | "Add real weigh-ins" → re-plan (stored in the browser only, optional) |
| UX | Share URL (no personal data beyond inputs), print, no network |

### 8.3 Content outline (≈ 1,300–1,600 words, original, reviewed)

1. Intro and calculator, with the disclaimer
2. How to use it (3 modes)
3. How the timeline is calculated (adaptive vs straight line)
4. How many calories is one pound (3,500 rule and its limits, cited)
5. How fast is safe (CDC, cited) and when to talk to a professional
6. Planning backwards from a date
7. Updating your plan with real progress
8. FAQ (10)
9. Sources, reviewer and date, then related tools

### 8.4 Quality checks

- **Unit tests:**
  - Linear maths (22-week example).
  - Adaptive simulation monotonic and converging.
  - Plateau detection.
  - The reverse solver hits the date ± 1 week.
  - Floors and special-population stops.
  - Snapshot of the weekly table.
- No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)` (blocking for launch):**
  - Pull Google top 10.
  - Cite Hall 2011, Thomas 2013 and CDC.
  - The reviewer approves the model, wording, floors and screening list.
  - Get a qualified reviewer (RD/MD), with name and date.
