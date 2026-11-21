# Gallons ↔ Cubic Feet Converter — Build Spec

> **URL:** `/gallons-to-cubic-feet/` · Batch 5 · Tier 1 · rank chance ✅ · **Build order 5**
> **Read first:** `../00_BATCH5_BUILD_RULES.md` (§3 volume-units-engine)
> **Inputs used:**
> - `05_Gallons_Cubic_Feet_Converter_Competitor_Analysis.md` (4 pages read + WorksheetGenius blocked, 2026-11-14)
> - keyword file §2 #5
>
> **SERP:** provisional
> **Written:** 2026-11-22 (full rewrite after the research pass)

---

## 0. Strategy

**Search demand:** about **66,000 searches** across 12 keywords, most at KD 13–17.

**Who ranks:**
- Inch Calculator and Omni;
- Calculator.uk.com;
- a long tail of converter sites (metric-calculator, xconvert, convertilo and others);
- WorksheetGenius's **programmatic per-number pages** ("convert-710-gal-to-ft3"). **We will not copy that thin pattern.**

**Google shows its own converter box** for the bare number, so the page must offer more than one number:
- the answer in the first line;
- a **dimensions → gallons** mode;
- all units live;
- a printable table.

That is how a DA 1 site wins the click.

**Every competitor is a single-number converter:**
- no box or cylinder → gallons mode;
- no five-unit panel;
- tables of only 20–40 rows;
- 2–5 FAQs;
- no real uses.
- Metric-Calculator even treats BOE (an energy unit) as volume.

## 1. Keywords and placement

| Role | Keyword | US vol | KD | Where it goes |
|---|---|---:|---:|---|
| **Primary** | gallons to cubic feet | 4,400 | 15 | Title, H1, first sentence, tool heading |
| Secondary | gallons to feet 3 | 22,200 | 17 | Odd phrasing, real volume: use it once naturally in the intro ("gallons to feet³ / cubic feet") |
| Secondary | how many gallons in a cubic foot · gallons in a cubic foot | 8,100 · 3,600 | 27 | **First line answer** "1 ft³ = 7.48052 US gallons" + H2 + FAQ #1 |
| Secondary | how many cubic feet in a gallon · cubic ft per gallon | 4,400 · 2,400 | 13–18 | First line answer "1 US gal = 0.133681 ft³" + FAQ #2 |
| Secondary | gallon to ft3 · gal to ft3 | 4,400 · 3,600 | 14–17 | Unit labels + H2 "Gallons to cubic feet formula" |
| Secondary | ft3 to gallons · cubic ft to gallons | 3,600 · 2,400 | 14 | H2 "Cubic feet to gallons" |
| Secondary | gallon to m3 · m3 to gallons | 1,600 · 3,600 | 13–16 | m³ field + H2 "Gallons to cubic metres and litres" |

## 2. Our edge (4 competitors checked)

| Feature | Competitors with it |
|---|---|
| Five units live in one panel: US gal, imperial gal, ft³, m³, L (+ US dry gal optional). Edit any field | US↔ft³ 4/4 · imperial 2/4 · **dry 0** · **m³/L together 0** |
| Dimensions mode: box (L×W×H, mixed units) and cylinder → all units | **0 of 4** |
| Printable table, user range up to 1–1,000, chosen step, our code | 2/4, ≤ 40 rows |
| Answer in the first line (both factors) | partial |
| Precision explained: exact definitions, round only for display (why 5 gal = 0.668403, not 0.668405) | **0** (nobody explains it) |
| Use cases: aquarium, pond, hot tub, concrete mix water, fuel tank (our numbers) | 0 |
| Optional water weight (lb/kg), labelled approximate and temperature-dependent | 0 |

## 3. Calculator spec

### 3.1 Tabs

1. **Convert** (default)
2. **From dimensions**
3. **Conversion table**

### 3.2 Input guide diagram (above the inputs)

`GallonsInputGuide.tsx`: a 1 ft cube drawn next to ~7½ one-gallon jugs, captioned "1 ft³ ≈ 7.48 US gal".

Five linked chips below it:
- "1 US gallons"
- "2 Cubic feet"
- "3 Cubic metres"
- "4 Litres"
- "5 Imperial gallons"

**Dimensions tab:** a box labelled "Length × Width × Height" and a cylinder labelled "Diameter × Height", with unit pickers.

### 3.3 Inputs

| Field | Default |
|---|---|
| Convert | 100 US gal |
| Dimensions | box 4 × 2 × 2 ft; cylinder 3 ft diameter × 2 ft; inputs in ft, in, ft+in, cm, m |
| Table | 1–100 step 1 (range up to 1–1,000, step selectable) |
| Precision | 4 decimals (selectable) |
| Water weight | off |

### 3.4 Engine (`src/lib/volume-units-engine.ts`, shared)

Exact constants:
- 1 US gal = 231 in³ = 3.785411784 L
- 1 ft³ = 1,728 in³ = 28.316846592 L
- 1 imp gal = 4.54609 L
- 1 US dry gal = 268.8025 in³
- 1 m³ = 1,000 L

```ts
toLitres(value, unit) → fromLitres(litres, unit) for every unit ; round only in the formatter
box = L·W·H (converted to ft³ or m³) ; cylinder = π (d/2)² h
table(from, to, step, unitA, unitB)
waterWeight ≈ US gal × 8.34 lb (labelled approximate; `TODO(owner)`: confirm source) / L × ~1 kg
```

**Worked examples (checked 2026-11-22):**
- **1 ft³ = 7.48052 US gal**
- **1 US gal = 0.133681 ft³**
- 100 US gal = **13.3681 ft³** = 0.378541 m³ = 378.541 L
- 5 US gal = **0.668403 ft³** (exact factor)
- Box 4 × 2 × 2 ft = 16 ft³ = **119.69 US gal**

### 3.5 Outputs

- **First line (static + live):** "1 cubic foot = 7.48052 US gallons · 1 US gallon = 0.133681 cubic feet."
- All five units update live.
- **Sentence:** "100 US gallons is 13.37 cubic feet (0.379 m³, 378.5 litres)."
- Dimensions result in all units (+ optional water weight).
- **Table:** print stylesheet, Copy CSV.
- Share URL.

### 3.6 Tests

- Every pair of units round-trips.
- The exact constants.
- 5 gal → 0.668403.
- Box and cylinder in mixed units.
- Table generation; zero/negative input handling.
- Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Gallons to Cubic Feet Converter – ft³, m³ & Litres` (50; 62 with the suffix → `absoluteTitle`) |
| Meta | `Convert gallons to cubic feet and back, plus cubic metres and litres. Includes a quick table and a box or tank volume to gallons mode.` (134) |
| H1 | `Gallons to Cubic Feet: Convert Gallons, Cubic Feet, m³ and Litres` |
| BLUF | "One cubic foot holds 7.48052 US gallons, and one US gallon is 0.133681 cubic feet. To convert gallons to cubic feet, multiply by 0.133681: 100 gallons = 13.37 cubic feet. Or enter a box or tank's size to get its gallons directly." (engine) |
| ToolShell pills | `Gallons, ft³, m³ & litres`, `Box & cylinder to gallons`, `Printable table`, `US & imperial gallons` |
| Links out | Tank Volume (#16), Metric Conversion (#20), Cubic Feet ↔ Square Feet (live), Cubic Yard (live), Pipe Volume (live), Concrete (live) |
| Links in | Tank Volume, Metric Conversion, Pipe Volume (add "convert to gallons"), Tools hub "Units" |

## 5. Content (~1,100–1,400 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How many gallons are in a cubic foot? | Both factors + derivation from 231 in³ and 1,728 in³ | 150 |
| 2 | How to use the converter | 3 tabs | 80 |
| 3 | Gallons to cubic feet formula | ×0.133681 + 3 examples (5, 55, 100 gal) | 150 |
| 4 | Cubic feet to gallons | ×7.48052 + examples | 120 |
| 5 | US, imperial and dry gallons | The differences, with factors | 130 |
| 6 | Gallons to cubic metres and litres | Examples | 100 |
| 7 | How many gallons fit in a box or round tank? | Dimensions examples: aquarium, pond, hot tub; link Tank Volume | 180 |
| 8 | Why some converters show slightly different numbers | Precision note | 80 |
| 9 | Conversion table | How to read and print | 60 |
| 10 | FAQ | §6 | 330 |

## 6. FAQ (10, from the question bank)

1. How many gallons are in a cubic foot? (7.48052)
2. How many cubic feet are in a gallon? (0.133681)
3. How do I convert gallons to cubic feet?
4. What's the difference between a US gallon and an imperial gallon?
5. How do I convert gallons to m³, and m³ to gallons?
6. How many gallons does a box of L × W × H hold?
7. How many litres are in a gallon?
8. What is a US dry gallon?
9. How much does a cubic foot of water weigh? (approximate)
10. How many cubic feet are in 5, 55 or 100 gallons? (engine)

## 7. Done when

- [ ] `volume-units-engine.ts` + tests; `npm run verify` passes.
- [ ] First-line answer visible above the fold; InputGuide above the inputs; ToolShell + TabSlider + fonts + `<main>`.
- [ ] No per-number pages; table generated by code; water-weight source confirmed or labelled approximate.
- [ ] Registrations + docs; `graphify update .`.
