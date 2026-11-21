# Gallons ↔ Cubic Feet Converter (with m³ and Litres) — Competitor Analysis

> **Target page:** KKCTools `/gallons-to-cubic-feet/` (Batch 5, Tool #5 ✅)
> **Primary keyword:** `gallons to cubic feet` — US 4,400 · KD 15 (cluster of 12 keywords, 64,300 US vol, 20,800 of it on KD ≤ 15; the largest is `gallons to feet 3` at 22,200)
> **SERP source:** ⚠ Batch 5 has no Semrush SERP export. Competitors come from a live web search for `gallons to cubic feet converter` run on 2026-11-14. `TODO(owner): pull Google top 10 (Google's own unit-converter box likely sits on top).`
> **Pages visited (2026-11-14):** 4 read (Inch Calculator, Omni, Calculator.uk.com, Metric-Calculator) · 1 blocked (WorksheetGenius, 403)

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Calc sites: Inch Calculator, Omni, Calculator.uk.com
  - Converter sites: metric-calculator, WorksheetGenius, xconvert, convertilo, easyunitconverter, mathda, onunitconverter, smcalculator, elysiatools
- **Programmatic per-number pages exist**, for example WorksheetGenius "convert-710-gal-to-ft3". We will **not** copy that thin-page pattern.
- **Google's own converter box** covers the bare number. The keyword file notes that we need more than one number to win the click: a dimensions mode and a table.
- **Exact factors used for the arithmetic checks:**
  - 1 US liquid gal = 231 in³ = 0.133680556 ft³
  - 1 ft³ = 7.48051948 US gal
  - 1 imperial gal = 4.54609 L = 0.160543653 ft³
  - 1 US dry gal = 268.8025 in³ = 0.155557 ft³
- **A rounding note:**
  - Omni and Inch show 5 gal = 0.668403 ft³. That is correct with the exact factor, even though multiplying by the displayed 6-decimal factor gives 0.668405.
  - That isn't an error, but no page explains it.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | inchcalculator.com/convert/gallon-to-cubic-foot/ | Calc site | Gallons to Cubic Feet Converter | 500–600 |
| 2 | omnicalculator.com/conversion/gallons-to-cubic-feet | Giant | Gallons to Cubic Feet Converter | 300–350 |
| 3 | calculator.uk.com/general/gallons-to-cubic-feet-calculator | UK calc site | Gallons to Cubic Feet Calculator | 400–450 |
| 4 | metric-calculator.com/convert-gal-to-cu-ft.htm | Converter site | Gallons to Cubic Feet Converter | ~750 |
| — | worksheetgenius.com/unit-converter/gal-to-ft3/ | Converter + programmatic | Gallons to Cubic Feet Converter | **blocked (403)** |

**What this tells us:**
- **Every page is a single-number converter.**
  - None has a box, cylinder or tank dimensions → gallons mode.
  - None converts between all five units at once (US gal, imperial gal, ft³, m³, L).
- **Gallon type is often left implicit.**
  - Omni and Calculator.uk.com handle US vs UK gallons.
  - Inch and Metric-Calculator only *mention* dry or imperial gallons.
  - No page converts US dry gallons.
- **Tables are short.** Inch covers 1–40 and Metric-Calculator 1–20. The keyword file asks for a printable 1–1,000 table.
- **Content is thin.**
  - At most 2–5 FAQs.
  - No real-world uses (aquarium, pond, pool, hot tub, concrete water, fuel tank).
  - Metric-Calculator wrongly treats BOE (an energy unit) as a simple volume conversion.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Inch | Omni | Calc.uk | Metric-Calc |
|---|---|---|---|---|
| US gal → ft³ | ✅ | ✅ | ✅ | ✅ |
| ft³ → gal (same page) | ❌ (separate page) | ✅ (3 linked fields) | ❌ | ✅ direction toggle |
| Imperial gallon | ❌ (mentioned) | ✅ | ✅ | ❌ |
| US dry gallon | ❌ (mentioned) | ❌ | ❌ | ❌ |
| m³ / litres on the same page | ❌ (links) | ❌ | ⚠️ FAQ litres | ❌ |
| Live multi-unit (all fields update together) | ❌ | ✅ (3 fields) | ❌ | ❌ |
| Rounding control | ❌ | ⚠️ | ❌ | ✅ 1–10 dp |
| Box L×W×H → gallons | ❌ | ❌ | ❌ | ❌ |
| Cylinder / round tank → gallons | ❌ | ❌ | ❌ | ❌ |
| Mixed units for dimensions (ft + in, cm) | ❌ | ❌ | ❌ | ❌ |
| Conversion table | ✅ 1–40 (inconsistent precision) | ❌ | ❌ | ✅ 1–20 (one row rounded wrong: 13 gal = 1.7378, shown as 1.7379) |
| Printable table / custom range | ❌ | ❌ | ❌ | ❌ |
| Weight of water (lb / kg) | ❌ | ❌ | ❌ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Inch | Omni | Calc.uk | Metric-Calc |
|---|---|---|---|---|
| Factor and exact definition (231 in³) | ✅ | ✅ | ✅ (also 277.42 in³ UK) | ✅ |
| Formula shown | ✅ | ✅ | ✅ | ⚠️ implied |
| Worked example | ✅ 5 gal | ✅ 5 gal (US and UK) | ❌ | ⚠️ only reverse direction |
| Rounding explained | ❌ | ❌ | ⚠️ (FAQ wording contradicts itself) | ❌ |
| Real-world uses | ❌ | ❌ | ❌ | ❌ |
| Errors | — | intro says the opposite conversion direction; typo "160544" | — | BOE treated as volume; duplicate links |
| FAQ count | 0 | 2 | 5 | 0 |
| Named author | ✅ | ✅ + reviewer | ❌ team | ❌ |
| Date | ❌ | ❌ | ✅ Jul 2026 | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. Inch Calculator — Gallons to Cubic Feet (Joe Sexton)
- **Converter:** one input (US gal). Factor 0.133681 ✔, reverse 7.48051948 ✔.
- **Example:** 5 gal = 0.668403 ft³ (correct with the exact factor).
- **Table:** 1–40 gal. Precision is inconsistent between rows and trailing zeros are dropped.
- **Weak points:**
  - Dry and imperial gallons are noted but not converted.
  - No dimensions mode, FAQ or date.

### 2. Omni — Gallons to Cubic Feet (Luciano Miño; reviewer Gabriela Diaz)
- **Fields:** US gal, UK gal and ft³ (linked).
- **Factors:** 0.133681 / 0.160544 ✔.
- **Examples:** 5 gal (US and UK).
- **FAQs (2):**
  1. How many ft³ are in 5 gallons
  2. What do you call half a gallon
- **Weak points:**
  - The intro says "cubic feet to gallons", the opposite of the title.
  - Typo "160544" (missing decimal point).
  - No table, no dimensions mode, no date.

### 3. Calculator.uk.com — Gallons to Cubic Feet (reviewed Jul 2026)
- **Inputs:** gallons plus a gallon-type selector (US/UK).
- **Explains** that the UK gallon is about 20 % larger: 4.546 L vs 3.785 L ✔.
- **FAQs (5):** include litre equivalents and the definitions. The FAQ claims "no rounding", but the converter uses 6-dp factors.
- **Weak points:** no example, no table, a generic "team" author, an empty default state.

### 4. Metric-Calculator — Gallons to Cubic Feet
- **Converter:** direction toggle and rounding 1–10 dp. Table for 1–20 gal (13 gal row rounded wrong).
- **Errors:**
  - Gallon → BOE "conversion" with no energy assumption.
  - Duplicate and self-referencing links.
  - The gallon type is not named in the converter.
- **Weak points:** no FAQ, author or date; the only examples are in the reverse direction.

---

## 5. Patterns

- **Exact definitions:**
  - US liquid gal = 231 in³ (exact) = 3.785411784 L
  - ft³ = 1,728 in³ = 28.316846592 L
  - so 1 gal = 0.1336805556 ft³ and 1 ft³ = 7.4805194805 gal
  - Imperial gal = 4.54609 L (exact) = 0.1605436532 ft³
  - US dry gal = 268.8025 in³ = 4.40488377086 L
  - m³ = 264.172052 US gal = 35.3146667 ft³
- **Dimensions mode:**
  - Box: L × W × H in ft → × 7.48052
  - Cylinder: π r² h
  - Horizontal tank partial fill: link to Tank Volume (#16)
- **Water weight (optional):** 1 US gal of water ≈ 8.34 lb at about 4–20 °C. Label it approximate and temperature-dependent. `TODO(owner)`: confirm the source and the rounding.
- **Compute with exact factors and round only for display.** Show the precision used.

| Section | Pages (of 4) |
|---|:---:|
| US gal ↔ ft³ | 4 |
| Imperial | 2 |
| Dry gal | **0** |
| m³ / L together | **0** |
| Dimensions mode | **0** |
| Table | 2 (≤ 40 rows) |
| FAQ | 2 |

---

## 6. FAQ question bank

★ = asked on 2+ pages or a cluster keyword. Map to: gallons to cubic feet, gallon to ft3, how many cubic feet in a gallon, ft3 to gallons, cubic ft to gallons, gallon to m3, gallons to feet 3, gal to ft3, m3 to gallons, cubic ft per gallon, how many gallons in a cubic foot, gallons in a cubic foot.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How many gallons are in a cubic foot? (7.48052) | Inch, Metric-Calc · `how many gallons in a cubic foot` (8,100) |
| 2 | ★ How many cubic feet are in a gallon? (0.133681) | Omni, Inch · `how many cubic feet in a gallon` |
| 3 | ★ How do I convert gallons to cubic feet? | all |
| 4 | ★ US gallon vs imperial gallon: what's the difference? | Omni, Calc.uk |
| 5 | How do I convert gallons to m³ (and m³ to gallons)? | `gallon to m3`, `m3 to gallons` |
| 6 | How many gallons does a box or tank of L × W × H hold? | — (gap) |
| 7 | How many litres are in a gallon? | Calc.uk |
| 8 | What is a US dry gallon? | Inch (mention) |
| 9 | How much does a cubic foot of water weigh? | — |
| 10 | How many cubic feet are 5, 10, 55 or 100 gallons? | Omni (5) |

---

## 7. Gaps nobody fills — our opportunities

1. **Five units live in one panel:** US gal, imperial gal, US dry gal (optional), ft³, m³ and L. Edit any field and the rest update.
2. **Dimensions mode:**
   - Box: L × W × H in any mixed units → volume in all units.
   - Cylinder: diameter × height.
   - Link to Tank Volume (#16) for partial fills and other shapes.
3. **Printable conversion table** with a chosen range (1–1,000) and step. Values come from our own code.
4. **Answer in the first line:** "1 ft³ = 7.48052 US gallons; 1 US gallon = 0.133681 ft³" (keyword-file instruction).
5. **Precision explained:** exact definitions are used and rounding happens only at display, which answers the 0.668403 vs 0.668405 question.
6. **Use-case examples:** aquarium, pond, hot tub, concrete mix water, fuel tank. Use our own numbers.
7. **Optional water-weight output** (lb / kg), labelled approximate.
8. **Links to** Tank Volume (#16), Metric Conversion (#20), Concrete (Batch 2), and Pipe/Tube Volume (Batch 2 #7).

---

## 8. Blueprint for the KKCTools Gallons ↔ Cubic Feet Converter

### 8.1 SEO

- **URL:** `/gallons-to-cubic-feet/`
- **Title:** Gallons to Cubic Feet Converter – ft³, m³ & Litres
- **H1:** Gallons to Cubic Feet: Convert Gallons, Cubic Feet, m³ and Litres
- **Meta:** as in the keyword file (134 chars).
- **First line:** both factors.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Converter | Linked fields: US gal, imp gal, US dry gal, ft³, m³, L (+ in³, optional) |
| Dimensions | Box (L, W, H) / cylinder (Ø, H); units ft, in, yd, cm, m, mixed ft + in |
| Table | Start, end, step (default 1–100, max 1,000); printable; US or imperial |
| Precision | Rounding selector; exact definitions used |
| Extras | Water weight (approx.), share URL, copy, no network |

### 8.3 Content outline (≈ 900–1,200 words, original)

1. Quick answer (both factors) and intro
2. How to use
3. Gallons to cubic feet formula — examples
4. Cubic feet to gallons — examples
5. US vs imperial vs dry gallons
6. Gallons ↔ m³ and litres
7. Volume of a box or round tank in gallons — example
8. Conversion table
9. FAQ (8–10)
10. Related tools: Tank Volume (#16), Metric Conversion (#20), Concrete (Batch 2), Pipe Volume (Batch 2 #7)

### 8.4 Quality checks

- **Unit tests:** every pair of units in both directions, using the exact definitions; box and cylinder volumes; table generation; round-trip stability.
- No competitor wording copied. `npm run check:no-network` passes.
- **`TODO(owner)`:** pull Google top 10; check WorksheetGenius in a browser; confirm the water-weight figure and its source.
