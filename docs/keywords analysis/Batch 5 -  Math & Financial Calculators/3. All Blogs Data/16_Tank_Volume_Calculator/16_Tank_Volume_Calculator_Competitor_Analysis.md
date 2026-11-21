# Tank Volume Calculator — Competitor Analysis

> **Target page:** KKCTools `/tank-volume-calculator/` (Batch 5, Tool #16 🟡)
> **Primary keyword:** `tank volume calculator` — US 5,400 · KD 26. Cluster: 2 keywords, 9,000 US vol. Includes `tank size calculator` (3,600).
> **SERP source:** ⚠ No Semrush SERP export for Batch 5. Competitors come from a live web search for `tank volume calculator horizontal cylinder fill level gallons` on 2026-11-14. `TODO(owner): pull Google top 10 (keyword note: Omni and Calculator.net rank).`
> **Pages visited (2026-11-14):** 5 read (CalculatorSoup, Inch Calculator, Firgelli, GIGAcalculator, Engineering ToolBox). Omni hit a redirect loop and was not read. NIST Circular 416 (tank calibration) was noted only.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Calc giants: CalculatorSoup, Inch, Omni, GIGA, easyunitconverter.
  - Engineering references: Engineering ToolBox, 1728.org dipstick calculator, spikevm, Firgelli blog.
  - Excel tutorial: ExcelDemy.
  - Clone sites: buildingclub, num8ers.
  - Government reference: **NIST Circular 416**, a historic tank-calibration publication.
- **The real differentiator is partial fill by depth**, especially for horizontal cylinders with domed heads, plus a dipstick (strapping) chart. Nobody explains it fully with worked numbers.
- **Errors found when re-checking the arithmetic with exact geometry:**
  - **Firgelli's partial-fill example is wrong.** A 10 ft tank filled to 3 ft is 25.2 %, not 19.4 %.
  - **Firgelli's widget total is wrong.** 8 × 20 ft is 7,520 gal, not 7,540.
  - A search-snippet example of "6 × 12 ft, 2,527 gal full, 518 gal at 2 ft" is also wrong. The correct values are about **2,538 gal** full and about **740.6 gal** at 2 ft. Its source page was not identified.
- No competitor text copied. The tool shares its engine with Gallons ↔ ft³ (#5) and Pipe/Tube Volume (Batch 2 #7).

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | calculatorsoup.com/calculators/construction/tank.php | Calc giant | Tank Volume Calculator (Tank Volume & Fill Calculator) | 1,000–1,200 |
| 2 | inchcalculator.com/tank-volume-calculator/ | Calc site | Tank Volume Calculator | 700–800 |
| 3 | firgelliauto.com/blogs/engineering-calculators/tank-volume-calculator-horizontal-and-vertical-cylinders | Actuator maker blog | Tank Volume Calculator — Horizontal and Vertical Cylinders | ~1,400 |
| 4 | gigacalculator.com/calculators/tank-volume-calculator.php | Calc site | Tank Volume Calculator | ~850 |
| 5 | engineeringtoolbox.com/content-cylindrical-tank-d_1301.html | Engineering reference | Content in Horizontal or Sloped Cylindrical Tanks or Pipes | 250–300 core |
| — | omnicalculator.com/construction/tank-volume | Giant | Tank Volume Calculator | **not read (redirect loop)** |

**What this tells us:**
- **CalculatorSoup has the widest range of shapes**:
  - horizontal and vertical cylinder, rectangle, horizontal and vertical oval, horizontal and vertical capsule
  - 2:1 elliptical, dish ends, "ellipse"
  - filled volume for each shape, and 6 output units
  - Weak points: no fill formulas for elliptical or dish heads, an undefined variable "m", no cone-bottom shape, no examples.
- **GIGA has 13 shapes, including cone-bottom**, and outputs in barrels and UK gallons.
  - Weak points: table labels contradict the images, no formulas, no examples, and it was last updated in 2022.
- **Firgelli is the only page that handles head types** (flat, elliptical, hemispherical) on horizontal and vertical cylinders.
  - Its examples and its head-volume claims contradict each other.
- **Engineering ToolBox is the only one with sloped tanks.** It also gives mass from density and a level→% chart. It shows no formulas.
- **No page offers:**
  - a dipstick / strapping table (depth → gallons in steps)
  - fill from the top (ullage)
  - mixed ft + in input
  - correct worked examples for partial horizontal fills

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | CalcSoup | Inch | Firgelli | GIGA | Eng. ToolBox |
|---|---|---|---|---|---|
| Vertical cylinder | ✅ | ✅ | ✅ | ✅ | ❌ |
| Horizontal cylinder | ✅ | ✅ | ✅ | ✅ | ✅ |
| Rectangle / box | ✅ | ✅ | ❌ | ✅ | ❌ |
| Oval (stadium) H/V | ✅ | ✅ | ❌ | ✅ | ❌ |
| Capsule H/V | ✅ | ✅ | ❌ | ✅ | ❌ |
| Elliptical heads (2:1) | ⚠️ (no fill formula) | ❌ | ✅ (claims conflict) | ⚠️ | ❌ |
| Dish / torispherical ends | ⚠️ | ❌ | ❌ | ⚠️ | ❌ |
| Hemispherical heads | ✅ (capsule) | ✅ (capsule) | ✅ | ✅ | ❌ |
| Cone bottom | ❌ | ❌ | ❌ | ✅ | ❌ |
| Frustum / sloped walls | ❌ | ❌ | ❌ | ⚠️ | ❌ |
| Sphere | ❌ | ✅ (no formula) | ❌ | ✅ | ❌ |
| Partial fill by depth | ✅ | ✅ (not explained) | ✅ (**example wrong**) | ✅ | ✅ |
| Sloped (tilted) tank | ❌ | ❌ | ❌ | ❌ | ✅ |
| % full | ⚠️ | ❌ | ✅ | ✅ | ✅ (chart) |
| **Dipstick / strapping table** | ❌ | ❌ | ❌ | ❌ | ⚠️ (static % chart) |
| Ullage (measure from top) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Units in | in, ft, yd, mm, cm, m, % | in, ft, mm, cm, m | ft | mm–yd | m, ft, in |
| Ft + in mixed | ❌ | ❌ | ❌ | ❌ | ❌ |
| Units out | US gal, qt, imp gal, L, m³, ft³ | gal, L | gal | m³, ft³, L, US/UK gal, bbl | volume + mass |
| Liquid mass / weight | ❌ | ❌ | ❌ | ❌ | ✅ (density) |

---

## 3. Feature matrix — content and trust

| Item | CalcSoup | Inch | Firgelli | GIGA | Eng. ToolBox |
|---|---|---|---|---|---|
| Formulas shown | ✅ (segment variable "m" undefined) | ✅ (capacity only) | ✅ (head formulas ambiguous) | ❌ | ❌ |
| Partial-fill method explained | ✅ | ❌ | ✅ | ⚠️ (dry rod tip) | ⚠️ (iterative) |
| Worked example (checked) | ❌ | ✅ (73,287 in³ ✔; not converted to gal) | ⚠️ (**10 ft @ 3 ft = 25.2 %, page 19.4 %; 8×20 ft = 7,520 gal, page 7,540**) | ❌ | ❌ |
| FAQ count | 0 | 3 (propane sizes unsourced) | several (contradict body) | 0 | 0 |
| Named author | ✅ | ✅ + PhD reviewer | ✅ | ✅ | ❌ |
| Date | ✅ Aug 2026 | ❌ | ✅ Feb 2026 | ✅ Sep 2022 | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. CalculatorSoup — Tank Volume & Fill (Edward Furey, Aug 2026)
- **Shapes:** 10 (listed in §1). **Units:** in, ft, yd, mm, cm, m, or % fill. **Output:** 6 units.
- **Formulas:**
  - cylinder πr²l ✔
  - segment ½r²(θ − sin θ) with θ = 2 acos(m/r) ✔, but m is never defined
  - stadium ✔, capsule ✔, spherical cap ✔
- **Weak points:**
  - no fill formula for 2:1 elliptical or dish heads
  - "Horizontal Ellipse" has no documentation
  - no cone bottom, no examples, no FAQ

### 2. Inch Calculator — Tank Volume (Joe Sexton; reviewer Ethan Dederick PhD)
- **Shapes:** 8, including sphere. Optional fill depth. Output in gallons and litres.
- **Example:** 36 in × 72 in → 73,287 in³ ✔. The page stops there. It should go on to about 317 gal.
- **FAQs (3):** tank level · litres to gallons · propane tank sizes (unsourced).
- **Weak points:**
  - fill method not explained
  - no sphere formula
  - broken anchor
  - no date

### 3. Firgelli — Tank Volume, Horizontal and Vertical (Robbie Dickson, Feb 2026)
- **Inputs:** orientation, head type (flat, elliptical, hemispherical), diameter, length, fill (ft).
- **Outputs:** total, fill, % full, head volume.
- **Errors:**
  - **10 ft dia, 3 ft fill = 25.2 %.** The page says 19.4 %.
  - **8 × 20 ft = 7,520 gal.** The widget shows 7,540, which implies a factor of 7.5 instead of 7.48052.
  - 4 × 10 ft = 940.0 gal; the page says 940.3.
  - The head formulas give the total for both heads without saying so.
  - The body, FAQ and formulas disagree on elliptical vs hemispherical head volume.
- **Weak points:** the "1–2 % accuracy" claim is unsourced; actuator pitch.

### 4. GIGAcalculator — Tank Volume (Georgi Georgiev, Sep 2022)
- **Shapes:** 13, including cone bottom, dome and capsule.
- **Inputs:** filled height. **Outputs:** m³, ft³, L, US and UK gallons, barrels, % used. Includes a dry-rod measuring tip.
- **Errors:**
  - title typo "Capacitiy"
  - two table rows mislabelled against their images
  - "Eliptical" in the form
  - duplicate Height/Diameter fields
- **Weak points:** no formulas, examples or FAQ; outdated.

### 5. Engineering ToolBox — Horizontal or sloped cylindrical tanks
- **Inputs:** diameter, liquid level, density, length, slope°.
- **Outputs:** volume, mass, central angle, chord, arc, liquid and air areas, air volume.
- **Chart:** level % → volume %.
- **Weak points:**
  - no formulas (an iterative method with no slice count given)
  - "highest level" is ambiguous on sloped tanks
  - heads not handled
  - typos and boilerplate

---

## 5. Patterns

**Exact geometry (r = D/2, h = liquid depth)**
- **Horizontal cylinder, flat ends:**
  - Area A(h) = r²·acos((r − h)/r) − (r − h)·√(2rh − h²)
  - Volume V = A·L
- **Hemispherical heads, two in total:**
  - Full volume: (4/3)πr³
  - Partial: two spherical caps of height h, each πh²(3r − h)/3
- **2:1 elliptical heads, two in total:**
  - Each head is a half-ellipsoid with depth a = D/4 = r/2, so one head = (2/3)πr²a = (1/3)πr³.
  - Both heads together = (2/3)πr³ (half of the hemispherical total).
  - Partial fill scales the hemispherical cap volume by a ÷ r.
  - `TODO(owner)`: confirm the head formulas against a cited engineering reference before shipping. Firgelli contradicts itself on this point.
- **Torispherical heads:** v2, or omit them.
- **Vertical cylinder:** πr²h. Add the bottom-head volume when the head is domed or conical.
- **Cone bottom:**
  - Full cone volume: (1/3)πr²H_c
  - Partial fill within the cone: (1/3)π(r·h/H_c)²h
  - Plus the cylinder above the cone.
- **Rectangle:** L·W·h.
- **Oval (stadium):** circle-segment geometry plus the rectangle part.
- **Capsule:** cylinder plus hemispheres.

**Unit conversion**
- 1 ft³ = 7.48052 US gal = 28.3168 L.
- 1 US gal = 231 in³.
- Imperial gal = 4.54609 L.
- Barrel (oil) = 42 US gal.

**Dipstick table**
- Depth in chosen steps (e.g. every 1 in) → volume and % full. Printable.

**Ullage**
- h = D − measured gap from the top.

**Mass (optional)**
- V × density. Water is about 8.34 lb/gal; other liquids are user-entered.

**What the pages cover**

| Section | Pages (of 5) |
|---|:---:|
| Horizontal partial fill | 5 |
| Head types | 1 (conflicting) |
| Cone bottom | 1 |
| Dipstick table | **0** |
| Ullage | **0** |
| Ft + in | **0** |
| Correct worked partial example | **0** |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword. Maps to: tank volume calculator, tank size calculator.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How do I calculate the volume of a cylindrical tank in gallons? | all |
| 2 | ★ How much liquid is in a horizontal tank at a given depth? | CalcSoup, Firgelli, Eng. ToolBox, GIGA |
| 3 | ★ How do I measure the liquid level (dipstick)? | GIGA, 1728.org (SERP) |
| 4 | How do domed or elliptical ends change capacity? | Firgelli |
| 5 | How do I calculate a cone-bottom tank? | GIGA |
| 6 | Why isn't a half-full tank gauge exact in gallons? | Inch FAQ (linear assumption) |
| 7 | What size tank do I need? (tank size calculator) | `tank size calculator` |
| 8 | How many gallons are in a cubic foot? | link to #5 |
| 9 | How much does the water in my tank weigh? | Eng. ToolBox (mass) |
| 10 | What are common propane / oil tank sizes? | Inch (unsourced): cite manufacturers only, or skip |

---

## 7. Gaps nobody fills — our opportunities

1. **Every shape in one place:**
   - vertical and horizontal cylinder
   - flat, hemispherical and 2:1 elliptical heads
   - rectangle, oval, capsule, cone bottom, sphere
2. **Correct partial fill for every shape**, using depth from the bottom or ullage from the top.
3. **Dipstick / strapping table:**
   - depth step → gallons, litres and % full
   - printable, so it can be taped to the tank
4. **Ft + in input** and metric, with output in US gal, imperial gal, L, m³, ft³ and barrels.
5. **"Tank size" mode:** required volume plus one dimension → the other dimension (e.g. length for a given diameter).
6. **Optional liquid weight** from density.
7. **Correct worked examples:**
   - 6 × 12 ft → 2,538 gal full, 740.6 gal at 2 ft
   - 10 ft dia @ 3 ft → 25.2 %
8. **Labelled SVG diagram** showing the fill level.
9. **Links:** Gallons ↔ ft³ (#5), Pipe/Tube Volume (Batch 2 #7), Metric Conversion (#20).

---

## 8. Blueprint for the KKCTools Tank Volume Calculator

### 8.1 SEO

- **URL:** `/tank-volume-calculator/`
- **Title:** Tank Volume Calculator – Gallons in Any Tank
- **H1:** Tank Volume Calculator: Gallons and Litres in Round, Oval and Box Tanks
- **Meta:** as in the keyword file (153 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Shapes | V/H cylinder (flat, hemi, 2:1 elliptical heads), rectangle, oval H/V, capsule, cone-bottom, sphere |
| Inputs | Dimensions (ft + in or metric), fill depth or ullage |
| Outputs | Capacity, filled volume, % full, empty space; US gal, imp gal, L, m³, ft³, bbl |
| Dipstick | Step (in / cm) → printable table |
| Sizing | Target volume + one dimension → other dimension |
| Extras | Liquid weight (density), SVG diagram, share URL, no network |

### 8.3 Content outline (≈ 1,300–1,600 words, original)

1. Intro (primary keyword)
2. How to use
3. Volume of a vertical tank, with an example
4. Volume of a horizontal tank: full and partly filled, with an example (correct figures)
5. Tanks with domed or elliptical ends
6. Rectangular, oval and cone-bottom tanks
7. Making a dipstick chart
8. Choosing a tank size
9. FAQ (10)
10. Related tools: Gallons ↔ ft³ (#5), Pipe/Tube Volume (Batch 2 #7), Metric Conversion (#20)

### 8.4 Quality checks

- **Unit tests:**
  - every shape, full and partial
  - checks against numerical integration
  - fixtures: 2,538 / 740.6 / 25.2 %
  - edge cases: h = 0, h = D, ullage
- **Head formulas:** verified against a cited reference. `TODO(owner)`.
- No competitor wording copied. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - pull Google top 10
  - check Omni and Calculator.net manually
  - approve the head-geometry reference (e.g. a NIST or ASME-style source)
