# Grams to Cups Converter (by Ingredient) — Competitor Analysis

> **Target page:** KKCTools `/grams-to-cups/` (Batch 8, Tool #17 🟡)
> **Primary keyword:** `ml to grams conversion` — US 4,400 · KD 6.
> - Cluster: 34 keywords, 192,100 US searches.
> - 33 long-tail grams↔cups and mL↔g phrases (187,700), e.g. `ml to g`, `200 grams to cups`, `gr in ml`, `g to ml`, `cup to g` (1,600 / KD 0).
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 8. Competitors come from live web searches on 2026-11-14 for `grams to cups converter flour sugar butter` and `ml to grams conversion calculator`.
> - Other results seen but not audited: GoodtoKnow (UK), Delicious magazine (UK), 100 Days of Real Food, Spinach Tiger, rapidtoolset, calculate.co.nz, Lemons for Lulu, EasyUnitConverter, buildingclub, blaze.today, and Omni's separate mL-to-grams page.
> - `TODO(owner): pull Google top 10 for "ml to grams conversion", "grams to cups" and "200 grams to cups".`
> **Pages visited (2026-11-14):** 5 read: Omni (grams to cups), Inch Calculator (gram to cup), GIGAcalculator (grams to cups), Instacart (grams-to-cups guide), Baking Like a Chef (200 grams to cups).

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Calculator sites: Omni, Inch, GIGAcalculator.
  - Grocery-brand content: Instacart.
  - Baking blogs with **one page per gram amount**: Baking Like a Chef has 50/100/110/150/200 g pages.
  - UK magazine charts: GoodtoKnow, Delicious.
- **The core problem: nobody agrees on density, and almost nobody cites it.** All-purpose flour per US cup on the five pages:

| Page | Flour g per cup | Butter g per cup |
|---|---:|---:|
| Omni | 141.6 | **215** |
| Inch (chart) | ≈125 (0.53 g/mL); its text example uses 0.478 g/mL ≈ 113 g | ≈227 |
| GIGAcalculator | **161** | 228 |
| Baking Like a Chef | ≈125 | ≈227 |
| Instacart | values only in images | — |

- **Why it matters.** The same "1 cup of flour" can be 113–161 g, a 40% spread. That is enough to ruin a recipe.
  - The real causes are the **measuring method** (spooned and levelled vs scooped vs sifted) and the **cup definition**: US customary 236.59 mL, US legal/nutrition 240 mL, metric 250 mL, imperial 284 mL.
- **Our approach (keyword file requirement):**
  - Use densities from **a public, reusable source**. The leading candidate is **USDA FoodData Central "1 cup" portion weights**, which are US-government data.
  - **Cite every row.** State the measuring basis (e.g. "spooned and levelled").
  - Let the user choose the cup type.
  - **Never copy a competitor's table.**
  - `TODO(owner)`: approve the source and the licence (USDA FDC is public domain/CC0; FAO/INFOODS density data has its own terms).
- **Errors found (re-checked by us):**
  - **GIGAcalculator:**
    - The flour table gives 600 g = **2¾ cups**; 600/161 = 3.73, so it should be **3¾ cups**.
    - Its example heading says 250 g while the body uses 240 g.
    - It shows 150 g of water = ⅔ cup under a "nearest quarter" rule (0.625 is ⅝).
    - Its butter density is stated as 228 g, but the table implies about 230 g.
  - **Inch:**
    - The formula is typeset as "cups = grams / 236.5882 × density"; it should be grams ÷ (density × 236.5882). The worked example is right.
    - Its flour density in the text (0.478) conflicts with the chart (≈0.53).
  - **Omni:**
    - It says "10 ingredients" when the dropdown has 20.
    - Butter at 215 g/cup is low compared with the 227 g of two US sticks. `TODO(owner)`: confirm against USDA.
    - It gives 250 g flour = 1.76 cups; 1.7655 → 1.77.
    - Its kg/m³ densities are used in formulas without a unit conversion.
  - **Instacart:**
    - It says "1 cup = 250 g according to the metric system" while its formula uses 237 mL. The metric system defines no cup; 250 mL is the Australian/metric cup.
  - **Baking Like a Chef:**
    - Cornflour/cornstarch is ≈150 g/cup; the typical value is ≈120–128.
    - Cake flour is ≈100 g; the typical value is ≈114–120.
    - It says a US cup is 240 mL, but its water row implies 236 mL.
    - Typo: "Crams to Cups".
- No competitor text or table copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | omnicalculator.com/food/grams-to-cups | Calc site | Grams to Cups Converter | 1,100–1,300 |
| 2 | inchcalculator.com/convert/gram-to-cup/ | Calc site | Grams to Cups Converter – (g to c) | ~1,000 + 10 tables |
| 3 | gigacalculator.com/converters/convert-grams-to-cups.php | Calc site | Grams to Cups Converter – Convert Grams to Cups | 700–800 |
| 4 | company.instacart.com/ideas/grams-to-cups-conversion | Grocery brand guide | Grams to Cups Converter [Cooking Calculator + Charts] | 500–600 (charts as images) |
| 5 | bakinglikeachef.com/200-grams-to-cups/ | Baking blog (amount page) | 200 Grams To Cups Converter (Flour, Sugar, Butter & More) | 1,500–2,000 + ~15 tables |

**What this tells us:**
- **Inch is the trust benchmark:**
  - It cites 4 sources (FAO/INFOODS, NIST, LibreTexts, FDA).
  - It has a density-unit selector, a custom ingredient, and 10 amount tables × 8 ingredients.
  - It explains US, metric, Japanese and nutrition cups in the text.
  - **But:** it has no cup selector, a mistyped formula, inconsistent flour density, and no FAQ.
- **Omni**:
  - 20 ingredients plus custom, 4 FAQs, PhD author and three reviewers.
  - **Problems:** no sources, a low butter value, unit mixing, and claimed cup-type and density controls that don't appear.
- **GIGAcalculator**:
  - US legal and imperial cups, a good explanation of why weighing is better.
  - **Problems:** densities for only 3 of its 19 ingredients, no sources, and **a wrong row** (600 g).
- **Instacart** is mostly promotion. Its chart values are images (not crawlable), and it contains the "metric cup" error.
- **Baking Like a Chef** captures the "200 grams to cups" long tail through amount pages.
  - It has a big 200 g table and an FAQ.
  - Several densities are off, its cup definition conflicts with its own numbers, and it carries affiliate and course promotion.
- **No page offers all of these:**
  1. a **cited density for every ingredient**, with the measuring basis
  2. a **cup type selector** (US 236.6 / US legal 240 / metric 250 / imperial 284)
  3. **all directions in one tool:** g ↔ cups ↔ mL ↔ tbsp ↔ tsp ↔ oz
  4. **packed vs spooned vs sifted** flour and **packed brown sugar** options
  5. an amount table (25–500 g) for each ingredient, generated by our code
  6. **mL ↔ g for liquids**, with density shown (water 1.00, milk ≈1.03, oil ≈0.92, honey ≈1.42)

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Omni | Inch | GIGAcalc | Instacart | Baking Like a Chef |
|---|---|---|---|---|---|
| Ingredient picker | ✅ (20) | ✅ (many) | ✅ (19) | ❌ | ⚠️ (not rendered) |
| Custom density | ⚠️ (claimed) | ✅ | ❌ | ❌ | ❌ |
| Cup type selector | ⚠️ (claimed) | ❌ (text only) | ✅ (US legal/imperial) | ❌ | ❌ |
| g → cups | ✅ | ✅ | ✅ | ❌ | ✅ (table) |
| cups → g | ✅ | ✅ (toggle) | ⚠️ (separate page) | ❌ | ⚠️ (separate page) |
| mL ↔ g | ⚠️ (separate page) | ⚠️ | ⚠️ (separate page) | ❌ | ❌ |
| tbsp / tsp / oz outputs | ❌ | ❌ | ❌ | ❌ | ❌ |
| Fraction display (¾ cup) | ⚠️ | ✅ (loose) | ✅ (some wrong) | ❌ | ✅ |
| Packed vs spooned option | ❌ | ❌ | ❌ | ❌ | ❌ |
| Amount table per ingredient | ❌ | ✅ (50–500 g) | ⚠️ (3 ingredients) | ⚠️ (images) | ✅ (200 g only) |
| Printable chart | ❌ | ❌ | ❌ | ✅ | ❌ |
| Recipe scaling | ❌ | ❌ | ⚠️ (link) | ❌ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Omni | Inch | GIGAcalc | Instacart | Baking Like a Chef |
|---|---|---|---|---|---|
| Densities cited per ingredient | ❌ | ⚠️ (general refs) | ❌ | ⚠️ (one FAO link) | ❌ |
| Density values stated as text | ✅ | ⚠️ | ⚠️ (3 only) | ❌ (images) | ✅ (implied) |
| Flour value plausible (≈120–130 spooned) | ⚠️ (141.6) | ✅ (chart) / ❌ (text) | ❌ (161) | ? | ✅ |
| Butter ≈227 g/cup | ❌ (215) | ✅ | ✅ (228) | ? | ✅ |
| Cup definitions explained | ⚠️ | ✅ | ✅ | ❌ (**metric error**) | ❌ (**conflict**) |
| Measuring method explained | ⚠️ | ⚠️ | ✅ (weighing advice) | ⚠️ | ⚠️ |
| Table arithmetic correct | ⚠️ (1.76) | ✅ | ❌ (**600 g row**) | n/a | ⚠️ (3 rows off) |
| FAQ count | 4 | 0 | 0 | 0 | several |
| Named author / reviewer | ✅ (PhD + 3) | ✅ (+ PhD) | ✅ | ✅ | ✅ |
| Date | ❌ | ❌ | ❌ | ✅ (Feb 2025) | ✅ (Jul 2026) |
| Promotion | — | — | share/embed | **heavy** (products) | affiliate + course |

---

## 4. Competitor-by-competitor detail

### 1. Omni: Grams to Cups (Hanna Pamuła, PhD; 3 reviewers)
- **Features:** 20 ingredients plus custom; densities in kg/m³ with g per cup; 4 FAQs; examples.
- **Values given:**
  - flour 600 kg/m³ → 141.6 g
  - sugar 845 → 199.4 g
  - **butter 911 → 215 g**
  - raw rice 850 → 200.6 g
  - honey 1,420 → 335.1 g
- **Errors:**
  - Says 10 ingredients, but the dropdown has 20.
  - Cup-type and density inputs are described but not visible.
  - "215,00" uses a comma decimal.
  - Water uses 236.59 mL, but the other rows imply 236.0.
  - Unit mixing (kg/m³ in a g/mL formula).
  - 250 g flour = 1.76 cups; it should be 1.77.
  - "Powder sugar".
- **Weak points:** no sources; no packed/spooned option.

### 2. Inch Calculator (Joe Sexton; reviewer Ethan Dederick, PhD)
- **Features:**
  - A big ingredient list plus custom, and a density-unit selector.
  - A toggle between g→c and c→g.
  - **4 references.**
  - Ten amount tables (50–500 g) × 8 ingredients, linear and consistent.
- **Errors:**
  - The formula is typeset with multiply instead of divide.
  - Flour density: 0.478 g/mL in the text vs ≈0.53 in the chart.
  - Loose fraction labels (0.211 ≈ "¼"; 0.399 ≈ "⅓").
- **Weak points:**
  - No cup selector, despite explaining 4 cup types.
  - No FAQ.

### 3. GIGAcalculator: Grams to Cups (Georgi Georgiev)
- **Features:** 19 ingredients; mg/g/kg input; US legal and imperial cup output; recipe-conversion link.
- **Checked:**
  - water 500 g ÷ 240 = 2.083 ✔
  - flour 240 g ÷ 161 = 1.49 ✔
- **Errors:**
  - **600 g flour = 2¾ cups; it should be 3¾.**
  - The 250/240 g heading mismatch.
  - ⅔ for 0.625.
  - The butter table implies 230 g against 228 g stated.
  - The "g/240 = cups" rule is shown generically when it holds only for water.
- **Weak points:**
  - Densities for only 3 ingredients are shown.
  - No sources, no FAQ, no date.

### 4. Instacart: Grams to Cups guide
- **Features:** quick answer, formulas, a density explanation, chart images, a printable chart, a 9-item product carousel, and a budget-calculator link.
- **Errors:**
  - "1 cup = 250 g according to the metric system" conflicts with its own 237 × density formula.
  - It promises a calculator that isn't on the page.
  - The title and H1 differ.
- **Weak points:**
  - Charts are images only.
  - No worked example and no FAQ.
  - Heavy order CTAs.

### 5. Baking Like a Chef: 200 Grams to Cups
- **Features:** amount-page model (a whole page for 200 g); about 15 tables (flours, sugars, fats, sweeteners, rice, salt); FAQ; affiliate disclosure ✔.
- **Checked (implied g/cup):**
  - flour 125 ✔, sugar 200 ✔, powdered sugar 125 ✔, butter 227 ✔, honey 339 ✔
  - **cake flour 100 (low)**
  - **cornflour 150 (high)**
  - salt 274 (low)
  - **its water row implies a 236 mL cup, while the text says 240.**
- **Weak points:**
  - "Crams" typo.
  - Peanut butter is listed under fats.
  - Packed vs loose isn't stated for brown sugar.
  - No per-ingredient sources.
  - Course and affiliate promotion.

---

## 5. Patterns

**Formulas**
- grams = cups × cup_mL × density (g/mL).
- cups = grams ÷ (cup_mL × density).
- mL = grams ÷ density.
- tbsp = cups × 16; tsp = cups × 48 (US).
- oz (weight) = g ÷ 28.349523125.

**Cup definitions (selectable; default US customary)**

| Cup | mL | Where |
|---|---:|---|
| US customary | 236.5882365 | US recipes |
| US legal (nutrition labels) | 240 | FDA labelling |
| Metric | 250 | Australia, NZ, Canada (modern), UK recipes using "cups" |
| Imperial | 284.130625 | old UK recipes |
| Japanese | 200 | Japan |

- `TODO(owner)`: cite NIST Handbook 44 / FDA 21 CFR 101.9 for the US legal cup.

**Density table (≈30 ingredients) — the source must be approved before any value is published**
- Planned rows:
  - flours: all-purpose, bread, cake, whole wheat, almond
  - sugars: granulated, brown (packed), powdered
  - fats: butter, oil
  - liquids: water, milk, honey, maple syrup
  - grains: rice (raw), rolled oats
  - baking basics: cocoa, cornstarch, salt, baking powder, baking soda, yeast
  - other: chocolate chips, nuts (chopped), raisins, peanut butter, yogurt, sour cream, cream cheese, grated parmesan
- **Each row stores:**
  - g per US cup
  - basis (spooned and levelled / packed / melted)
  - source ID (e.g. USDA FDC food ID + portion description)
  - date checked
- **Indicative values only for now, NOT to be published until checked against the approved source:**
  - granulated sugar ≈200 g
  - butter ≈227 g (½ cup = 1 US stick = 113 g)
  - water ≈237 g
  - all-purpose flour ≈120–125 g, spooned
- `TODO(owner)`: approve USDA FoodData Central (or another source) and assign someone to enter about 30 rows with IDs.

**Long-tail strategy (no thin amount pages)**
- One page.
- An **amount table generated by our code** (25, 50, 100, 125, 150, 200, 250, 300, 400, 500 g) for the selected ingredient, plus a static "200 g of the 10 most common ingredients" table.
- This covers `200 grams to cups` without 50 doorway pages.

**Coverage across the 5 competitors**

| Section | Pages (of 5) |
|---|:---:|
| Cited density per ingredient | **0** |
| Cup type selector working | 1 |
| Packed / spooned option | **0** |
| mL ↔ g on same page | **0–1** |
| tbsp/tsp/oz outputs | **0** |
| All table rows correct | 1–2 |
| FAQ ≥ 5 | 1 |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How many grams are in a cup? | all; `cup to g`, `1 cup in grams` |
| 2 | ★ How do I convert mL to grams? | `ml to grams conversion`, `ml to g` |
| 3 | ★ How many cups is 200 grams of flour (or sugar)? | `200 grams to cups`, Baking Like a Chef |
| 4 | ★ Why does a cup of flour weigh less than a cup of sugar? | Omni, GIGAcalc, search summary |
| 5 | ★ Is 1 mL of water 1 gram? | `g to ml`, `gr in ml` |
| 6 | How many grams of butter are in a cup or a stick? | search summary |
| 7 | What is the difference between US, metric and imperial cups? | Inch, GIGAcalc |
| 8 | Should I spoon or scoop flour into a cup? | gap |
| 9 | How many grams is a cup of packed brown sugar? | Baking Like a Chef (gap) |
| 10 | How many tablespoons are in a cup? | links to Cooking Measurement (#8) |
| 11 | Why is weighing more accurate than cups? | GIGAcalc |
| 12 | How many grams is a cup of rice or oats? | Instacart |

---

## 7. Gaps nobody fills — our opportunities

1. **A cited density for every ingredient**, with the basis and a "checked on" date. No competitor does this.
2. **A working cup-type selector** (US / US legal / metric / imperial / Japanese), plus the answer shown in all of them.
3. **One tool for all units:** g ↔ cups ↔ mL ↔ tbsp ↔ tsp ↔ oz.
4. **Measuring-method options** (spooned / scooped / sifted flour; packed brown sugar) where the source supports them.
5. **Honest variability:** "±10–15% depending on how you fill the cup". Advise weighing for baking.
6. **An amount table generated by our code** for each ingredient. It replaces doorway amount pages.
7. **Text tables**, not images, plus a printable chart.
8. **Correct cup facts** (no "metric cup = metric system" error).
9. **Links:** Cooking Measurement (#8), Water Weight (#18), Fraction to Decimal chart (#7), Water Intake (#13).

---

## 8. Blueprint for the KKCTools Grams to Cups Converter

### 8.1 SEO

- **URL:** `/grams-to-cups/`
- **Title:** Grams to Cups Converter – Flour, Sugar, Butter
- **H1:** Grams to Cups: Convert Flour, Sugar, Butter and More
- **Meta:** as in the keyword file (151 chars).
- **H2s:**
  - "mL to grams conversion"
  - "Grams in a cup: ingredient chart"
  - "How many cups is 200 grams?"
  - "US, metric and imperial cups"
  - "Spooned vs scooped flour"
- **Schema:** `WebApplication` + `FAQPage`.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Inputs | Ingredient (searchable, ~30 + custom density g/mL), amount, from-unit (g, kg, oz, lb, cup, tbsp, tsp, mL, L) |
| Options | Cup type; method (spooned/packed where applicable) |
| Outputs | All units at once; cups as decimal + nearest common fraction (⅛ steps) with the remainder in tbsp |
| Table | Amount table for selected ingredient (25–500 g) |
| Source | Per-row source label + basis + date checked |
| UX | Swap, copy, share URL, printable chart, no network |

### 8.3 Content outline (≈ 1,200–1,500 words, original)

1. Intro and converter
2. How to use it
3. Why grams and cups don't convert directly (density explained simply)
4. mL to grams for water, milk, oil and honey
5. Ingredient chart: grams per cup (cited)
6. 200 grams in cups (static table, 10 ingredients)
7. Cup sizes around the world
8. Measuring flour and brown sugar correctly
9. FAQ (12)
10. Sources and method, then related tools

### 8.4 Quality checks

- **Unit tests:**
  - Formula round-trips for every ingredient and unit.
  - Fraction rounding (0.625 → ⅝).
  - Cup-type math against fixtures.
  - Every published density has a non-empty source field (build fails otherwise).
- No competitor wording or tables. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - Pull Google top 10.
  - Approve the density source and licence.
  - Enter and verify about 30 rows.
  - Cite NIST/FDA for the cup definitions.
