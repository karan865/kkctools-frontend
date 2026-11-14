# Water Weight Calculator (Gallons & Liters to lbs / kg) — Competitor Analysis

> **Target page:** KKCTools `/water-weight-calculator/` (Batch 8, Tool #18 ✅)
> **Primary keyword:** `weight of water per gallon` — US 6,600 · KD 10.
> - Cluster: 13 keywords, 91,520 US searches.
> - Top terms: `how much does a gallon weight of water` (22,200 / KD 27), `how much does 5 gallons of water weigh`, `gallon of water weight`, `how much does 1 gallon of water weigh`, plus liters-to-kg phrases (KD 0–14).
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 8. Competitors come from a live web search on 2026-11-14 for `how much does a gallon of water weigh calculator`.
> - Other results seen but not audited: High Altitude Science, scienceinfo, thedonutwhole, and Inch's gallon-to-kg converter.
> - Spam/parasite pages were also seen (oli.org subdomain, a university-domain "news" page). They are not audited.
> - `TODO(owner): pull Google top 10 for "how much does a gallon of water weigh" and "weight of water per gallon".`
> **Pages visited (2026-11-14):** 5 read: Inch Calculator (water weight), The Calculator Site (article), Omni (gallons to pounds), Roof Observations (water weight & volume), EasyUnitConverter (gallons to pounds).

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Calculator sites: Inch, Omni, EasyUnitConverter.
  - An explainer article with a calculator: The Calculator Site.
  - A niche trade site: Roof Observations, which covers ponding water on flat roofs.
  - Science blogs.
  - Google's own answer box ("8.34 lb").
- **The answer is physics, not opinion:**
  - **1 US gal = 3.785411784 L** (exact by definition).
  - Water's density peaks at **0.99997 g/mL at about 4 °C (39.2 °F)**, so 1 US gal ≈ **8.345 lb (3.785 kg)**.
  - At 20 °C (68 °F), density is about 0.99821, giving **8.330 lb (3.779 kg)**.
  - At 100 °C, density is about 0.9584, giving **≈ 8.00 lb**.
  - **Imperial gallon** = 4.54609 L. It was historically defined as the volume of 10 lb of water at 62 °F, so it is ≈ **10.02 lb** at 4 °C and ≈ 10.0 lb at room temperature.
  - **Seawater** (≈ 1.025 g/mL) ≈ **8.55 lb per US gal**.
  - `TODO(owner)`: cite USGS "Water Density" and NIST (SP 811 / Handbook 44) for the definitions and the density table.
- **Errors found (re-checked by us):**
  - **Inch:**
    - The 70 °F five-gallon value is shown as **41.64405 lb**; 5 × 8.328881 = **41.644405** (a dropped digit).
    - Its stated "8.288–8.345 lb" range covers only 32–100 °F, though the selector goes to 212 °F (≈ 8.0 lb).
    - "Warmer water is less dense" is presented as universal; it holds only above 4 °C.
    - "Reclaimation" typo in the sources.
  - **Omni:**
    - The pool section says 5 gal = **41.6 lb**, but its own FAQ says 41.73 (5 × 8.3452). 41.6 matches room temperature, not its 4 °C figure, so the page is inconsistent.
    - It uses both 8.3452 and 8.3454 lb/gal.
    - It calls the US gallon "imperial system".
  - **The Calculator Site:**
    - Its anecdote "a pint of cold water weighed 560 g, hot 530 g" is physically implausible. Even a UK pint (568 mL) of boiling water weighs about 544 g, and a US pint about 453–472 g.
    - It confuses mass with weight (moon and ocean examples).
    - It has a broken anchor.
  - **Roof Observations:**
    - It says water "contracts until near freezing, then expands"; the turning point is 4 °C, not freezing.
    - Its 30 sq ft × 12 in table cell shows 1,873.04 lb; 30 × 62.428 = **1,872.84 lb**.
    - Minor rounding inconsistencies.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | inchcalculator.com/water-weight-calculator/ | Calc site | Water Weight Calculator | ~1,100 |
| 2 | thecalculatorsite.com/articles/units/how-much-gallon-of-water-weigh.php | Article + calc | How Much Does a Gallon of Water Weigh? | ~1,000 |
| 3 | omnicalculator.com/conversion/gallons-to-pounds | Calc site | Gallons to Pounds Converter | 1,200–1,400 |
| 4 | roofobservations.com/water-weight-calculator/ | Trade/niche | Water Weight & Volume Calculators, Charts, and Explanation | ~1,700 + 3 tables |
| 5 | easyunitconverter.com/gallons-to-pounds | Converter site | Gallons to Pounds Calculator | 650–700 |

**What this tells us:**
- **Inch is the benchmark:**
  - 14 volume units, 4 weight units, and **15 temperatures (32–212 °F)**.
  - A USGS-based density table.
  - Three sources; writer plus PhD reviewer.
  - **Gaps:** no salt water, no FAQ, a dropped digit, and a simplified density explanation.
- **Omni** covers 15 substances (beer, fuels, honey and others) and a pool example.
  - It offers only 3 water temperatures.
  - It has internal inconsistencies (41.6 vs 41.73; 8.3452 vs 8.3454) and the "imperial" mislabel.
- **The Calculator Site** is a strong article:
  - US vs imperial, a temperature section, a consistent reference table, and a named author (last updated Aug 2023).
  - **Weak points:** a physically wrong anecdote, the mass/weight confusion, and no FAQ.
- **Roof Observations** has the most practical extra: **water weight by area × depth** (ponding on roofs).
  - A credentialed author (RRO).
  - One temperature-physics error and one table error.
- **EasyUnitConverter**:
  - 10 substances including **seawater** ✔, a correct table, and an FAQ.
  - **Missing:** temperature input and kg output.
- **No page offers all of these:**
  1. every common volume, including **5-gallon jug, water heater, aquarium, bathtub, pool and 55-gallon drum presets**
  2. **temperature input with a correct density curve** (0–100 °C) and a correct explanation of the 4 °C maximum
  3. **fresh / sea / custom density**
  4. lb, kg, oz and short tons at once
  5. a **container-weight add-on** (empty jug or tank)
  6. a **volume → weight → load** answer for area × depth (tank, roof, raised bed)
  7. an FAQ that answers the long tail (1 L, 1 cup, 1 cubic foot, 5 gal, 55 gal)

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Inch | Calc Site | Omni | Roof Obs. | EasyUnit |
|---|---|---|---|---|---|
| US gallons | ✅ | ✅ | ✅ | ✅ | ✅ |
| Imperial gallons | ⚠️ | ✅ (text) | ❌ | ⚠️ | ⚠️ (FAQ) |
| Liters / mL | ✅ | ⚠️ | ⚠️ | ✅ | ❌ |
| Cups, quarts, cubic ft/m | ✅ | ⚠️ | ❌ | ✅ | ❌ |
| lb + kg + oz | ✅ | ⚠️ | ⚠️ | ✅ | ❌ (lb only) |
| Temperature input | ✅ (15 steps) | ⚠️ (text) | ⚠️ (3 steps) | ✅ | ❌ |
| Salt water | ❌ | ❌ | ❌ | ⚠️ (note only) | ✅ |
| Other liquids | ❌ | ❌ | ✅ (15) | ❌ | ✅ (10) |
| Area × depth (tank/roof/pool) | ❌ | ❌ | ⚠️ (pool link) | ✅ | ❌ |
| Container presets (5-gal jug, water heater, aquarium) | ❌ | ❌ | ⚠️ (examples) | ❌ | ❌ |
| Container tare weight | ❌ | ⚠️ (text: jug 4–8 oz) | ❌ | ❌ | ❌ |
| Reference table | ✅ | ✅ | ⚠️ | ✅ (3) | ✅ |
| Print / share | ✅ | ❌ | ✅ | ✅ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Inch | Calc Site | Omni | Roof Obs. | EasyUnit |
|---|---|---|---|---|---|
| 1 gal ≈ 8.34 lb stated correctly | ✅ | ✅ | ✅ | ✅ | ✅ |
| Temperature physics correct (4 °C max) | ⚠️ (oversimplified) | ✅ | ✅ | ❌ | ✅ |
| All examples / tables correct | ❌ (**1 digit**) | ❌ (**pint anecdote**) | ❌ (**41.6**) | ❌ (**1 cell**) | ✅ |
| Mass vs weight handled | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ |
| Sources cited | ✅ (3) | ⚠️ (1) | ❌ | ⚠️ | ❌ |
| FAQ | ❌ | ❌ | ✅ (5) | ❌ | ✅ |
| Named author / reviewer | ✅ (+ PhD) | ✅ | ✅ (+ physicist) | ✅ (RRO) | ❌ |
| Date | ❌ | ✅ (Aug 2023) | ❌ | ❌ | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. Inch Calculator: Water Weight (Joe Sexton; reviewer Teresa Michelsen, PhD)
- **Features:** 14 volume units → oz/lb/g/kg; 15 temperatures (32–212 °F); a density table (USGS).
- **Checked ✔:**
  - 1 gal = 8.345 lb / 3,785.4 g.
  - 1 ft³ = 62.428 lb.
  - The molar-mass trivia.
- **Errors:**
  - 41.64405 should be 41.644405.
  - The range claim leaves out 100–212 °F.
  - The warming/density statement is too simple.
  - "Reclaimation".
- **Weak points:** no salt water, no FAQ, no presets.

### 2. The Calculator Site: How Much Does a Gallon of Water Weigh? (Becky Kleanthous, updated 11 Aug 2023)
- **Content:**
  - US gallon (128 fl oz / 3.785 L) vs UK gallon (160 fl oz / 4.546 L) ✔.
  - 8.345 lb at 4 °C; 8.33 lb at 70 °F; ≈ 8.04 lb at 200 °F ✔.
  - 5 gal = 41.6 lb; 10 gal = 83.3 lb ✔.
- **Errors:**
  - The implausible pint anecdote.
  - Mass/weight confusion.
  - "Around 8 lb" vs "8.33" rounding.
  - Broken anchor.
- **Weak points:** the calculator is unverified (static capture); one source; no FAQ.

### 3. Omni: Gallons to Pounds (Carolyn Kovacs; reviewer Steven Wooding)
- **Features:** 15 substances plus custom; water at 3 temperatures; a pool example; 5 FAQs.
- **Checked ✔:**
  - Beer 8.43 and ice cream 4.67 lb/gal.
  - The pool: 9,874 gal → 82,402 lb.
  - A 55-gal corn drum = 331 lb.
- **Errors:**
  - 41.6 vs 41.73 for 5 gal.
  - 8.3452 vs 8.3454.
  - "Imperial system" for US gallons.
  - The 39 °F label vs 39.2.
  - "us our".
  - Ice cream described as "almost half" when it is 56% of water's density.

### 4. Roof Observations: Water Weight & Volume (Jack Gray, RRO)
- **Features:**
  - Area × depth × temperature calculator and a unit-volume calculator.
  - 3 tables, a ponding-water section, and copy/share/print.
- **Checked ✔:**
  - 100 gal at 70 °F = 832.89 lb.
  - 1 ft³ at 70 °F = 62.3044 lb.
- **Errors:**
  - The "contracts until near freezing" statement.
  - The 30 sq ft × 12 in cell (1,873.04 → 1,872.84).
  - The mole rounding.
  - 62.42786 vs 62.4280.
- **Weak points:** salt water is mentioned without numbers; no FAQ.

### 5. EasyUnitConverter: Gallons to Pounds
- **Features:** 10 substances including seawater, a formula, a table (all correct ✔), and an FAQ.
- **Weak points:**
  - lb only; no temperature input.
  - Imprecise wording: "gasoline molecules are less dense".
  - Table markdown spacing.
  - A "v 2.15" footer.

---

## 5. Patterns

**Formula**
- mass (kg) = volume (L) × density (kg/L).
- lb = kg ÷ 0.45359237 (exact).
- **Density of fresh water by temperature:**
  - Implement the Kell (1975) or Tanaka et al. (2001) equation for 0–100 °C, **or** a cited table interpolated linearly.
  - `TODO(owner)`: choose the source (USGS table / Tanaka 2001) and cite it.
- **Seawater:** default 1.025 kg/L (user-editable), noting that it varies with salinity and temperature.

**Reference values (our arithmetic; finalised once the source is approved)**

| Volume | at 4 °C | at 20 °C (68 °F) |
|---|---|---|
| 1 US cup (236.59 mL) | 0.5216 lb / 236.6 g | 0.5207 lb / 236.2 g |
| 1 L | 2.2046 lb / 1.000 kg | 2.2007 lb / 0.998 kg |
| 1 US gal | 8.345 lb / 3.785 kg | 8.330 lb / 3.779 kg |
| 1 imp gal | 10.02 lb / 4.546 kg | 10.00 lb / 4.538 kg |
| 5 US gal (jug) | 41.73 lb / 18.93 kg | 41.65 lb / 18.89 kg |
| 1 ft³ (28.317 L) | 62.43 lb | 62.32 lb |
| 55 US gal (drum) | 459.0 lb | 458.2 lb |
| 1 m³ | 1,000.0 kg | 998.2 kg |

**Presets** (labelled "typical; check your container")
- 16.9 oz bottle (500 mL)
- 1-gal jug
- 5-gal water-cooler jug
- 40- and 50-gal water heaters
- 10/20/55/75-gal aquariums
- bathtub (≈ 40 gal)
- 55-gal drum
- IBC tote (275 gal)
- custom tank (links Tank Volume, Batch 5 #16)

**Load mode**
- Area × depth (or L × W × H) → water weight and **pounds per square foot**.
- Example: 1 inch of water on 1 ft² weighs about 5.2 lb (62.4/12).
- Show a note that this is **not** a structural assessment.

**Coverage across the 5 competitors**

| Section | Pages (of 5) |
|---|:---:|
| Temperature input (full range) | 2 |
| Correct 4 °C explanation | 3 |
| Salt water calculated | 1 |
| Container presets | **0** |
| Tare weight option | **0** |
| Area × depth load | 1 |
| Every number correct | 1 |
| FAQ ≥ 5 | 2 |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How much does a gallon of water weigh? | `how much does a gallon weight of water` (22.2k), `weight of water per gallon` |
| 2 | ★ How much does 5 gallons of water weigh? | `how much does 5 gallons of water weigh`; Omni, Calc Site, EasyUnit |
| 3 | ★ Does hot water weigh less than cold water? | Inch, Calc Site, Omni, Roof Obs. |
| 4 | ★ How much does an imperial (UK) gallon of water weigh? | Calc Site, EasyUnit |
| 5 | How much does a liter of water weigh? | liters-to-kg long tail |
| 6 | How much does a cubic foot of water weigh? | Inch, Roof Obs. |
| 7 | Is salt water heavier than fresh water? | EasyUnit, Roof Obs. |
| 8 | How much does a full 50-gallon water heater (or aquarium) weigh? | presets (gap) |
| 9 | How much does an empty gallon jug weigh? | search summary |
| 10 | What is the difference between mass and weight here? | gap |

---

## 7. Gaps nobody fills — our opportunities

1. **Every number correct and cited.** Four of the five pages have a small error.
2. **A full temperature curve (0–100 °C)**, with the **4 °C maximum explained correctly**.
3. **Fresh, sea or custom density.**
4. **Real-life presets** (jug, water heater, aquarium, drum, IBC), with an optional **container tare**.
5. **A load mode** (area × depth → lb/ft²), with a "not structural advice" note. It links Tank Volume.
6. **A complete long-tail table** (cup → 1,000 gal) at two temperatures.
7. **A short, correct mass-vs-weight note.**
8. **Links:** Tank Volume (Batch 5 #16), Gallons ↔ Cubic Feet (Batch 5 #5), Grams to Cups (#17), Water Intake (#13), Metric Conversion (Batch 5 #20).

---

## 8. Blueprint for the KKCTools Water Weight Calculator

### 8.1 SEO

- **URL:** `/water-weight-calculator/`
- **Title:** Water Weight Calculator – Gallons to Pounds
- **H1:** Water Weight Calculator: How Much Does a Gallon of Water Weigh?
- **Meta:** as in the keyword file (153 chars).
- **H2s:**
  - "How much does a gallon of water weigh?"
  - "How much does 5 gallons of water weigh?"
  - "Liters to kilograms"
  - "Does temperature change the weight?"
  - "Water weight chart"
- **Schema:** `WebApplication` + `FAQPage`.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Inputs | Volume + unit (mL, L, m³, tsp, tbsp, cup, pt, qt, US gal, imp gal, in³, ft³, yd³) or preset; temperature (°C/°F, default 20 °C); water type (fresh / sea / custom density) |
| Optional | Container tare; quantity (e.g. 12 jugs) |
| Load mode | L × W × depth or area × depth → total weight + lb/ft² & kg/m² |
| Outputs | lb, kg, oz, g, short tons; density used shown |
| Table | Cup → 1,000 gal at 4 °C and 20 °C |
| UX | Copy, share URL, print table, no network |

### 8.3 Content outline (≈ 900–1,200 words, original)

1. Quick answer (8.34 lb / 3.78 kg) and the calculator
2. How much 5 gallons, 1 liter and 1 cubic foot weigh
3. US vs imperial gallons
4. Temperature and density (the 4 °C point, hot vs cold)
5. Salt water and other liquids
6. Practical presets: water heaters, aquariums, drums
7. Water weight on a surface (load mode, with caution)
8. Chart
9. FAQ (10)
10. Sources, then related tools

### 8.4 Quality checks

- **Unit tests:**
  - Exact unit definitions.
  - The density function against 10 table points (±0.00002).
  - The reference table snapshot.
  - Presets.
  - The load mode (1 in on 1 ft² ≈ 5.20 lb).
- No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - Pull Google top 10.
  - Approve and cite the density source (USGS / NIST / Tanaka 2001).
  - Confirm the typical preset sizes, or label them as examples.
