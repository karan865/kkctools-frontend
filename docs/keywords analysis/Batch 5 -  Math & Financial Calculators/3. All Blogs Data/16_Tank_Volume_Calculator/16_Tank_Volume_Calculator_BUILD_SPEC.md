# Tank Volume Calculator — Build Spec

> **URL:** `/tank-volume-calculator/` · Batch 5 · Tier 2 · rank chance 🟡 · **Build order 14** (after Gallons #5; shares `volume-units-engine`)
> **Read first:** `../00_BATCH5_BUILD_RULES.md`
> **Inputs used:** `16_Tank_Volume_Calculator_Competitor_Analysis.md` (5 pages read, Omni not readable, 2026-11-14), keyword file §2 #16
> **SERP:** provisional
> **Written:** 2026-11-22 (full rewrite after the research pass)

---

## 0. Strategy

**Volume:** 9,000 searches at KD 22–26:
- `tank volume calculator` 5,400;
- `tank size calculator` 3,600.

**Who ranks:**
- CalculatorSoup: widest shapes, but no cone-bottom, no examples and an undefined variable "m".
- GIGA: 13 shapes incl. cone-bottom and barrels, but labels contradict its images, and it was last updated in 2022.
- Firgelli: the only one with head types, but it contradicts itself.
- Engineering ToolBox: sloped tanks and mass, but no formulas.
- Omni.

**The differentiator is partial fill by depth**, especially horizontal tanks with domed heads, plus a **dipstick (strapping) chart**. **0 of 5** pages have a dipstick table, ullage input, ft + in, or a correct worked partial-fill example.

**Accuracy edge** (all re-checked with exact geometry):
- Firgelli says a 10 ft tank filled to 3 ft is 19.4%. **Correct: 25.2%.**
- Its widget shows 8 × 20 ft as 7,540 gal. **Correct: 7,520.**
- A snippet example says 6 × 12 ft holds 2,527 gal, with 518 gal at 2 ft. **Correct: 2,538 gal full, 740.6 gal at 2 ft.**

**Internal links:** link with Gallons ↔ ft³ (#5) and the live Pipe Volume page.

## 1. Keywords and placement

| Role | Keyword | US vol | KD | Where it goes |
|---|---|---:|---:|---|
| **Primary** | tank volume calculator | 5,400 | 26 | Title, H1, first sentence, tool heading |
| Secondary | tank size calculator | 3,600 | 22 | "Tank size" tab + H2 "What size tank do I need?" |
| Natural | horizontal tank volume · oil tank chart · dipstick chart · cylinder tank gallons · cone bottom tank | — | — | H2s, Dipstick tab |

## 2. Our edge (5 competitors checked)

| Feature | Competitors with it |
|---|---|
| Horizontal partial fill | 5/5 |
| **Every shape:** V/H cylinder with flat, hemispherical or 2:1 elliptical heads; rectangle; oval H/V; capsule; cone-bottom; sphere | heads 1 (conflicting) · cone 1 |
| **Depth from the bottom or ullage from the top** | ullage **0** |
| **Dipstick / strapping table** (step → gal, L, % full), printable to tape on the tank | **0** |
| **Ft + in** and metric input; output in US gal, imp gal, L, m³, ft³, barrels | ft+in **0** |
| "Tank size" mode (target volume + one dimension → the other) | 0 |
| Liquid weight from density | 1 |
| Labelled SVG showing the fill level | partial |
| Correct worked partial example | **0** |

## 3. Calculator spec

### 3.1 Tabs

1. **Capacity & fill** (default)
2. **Dipstick chart**
3. **Tank size**

### 3.2 Input guide diagram (above the inputs)

`TankInputGuide.tsx`: a shape picker (tank silhouettes). The chosen tank is drawn with:
- "1 Diameter / width";
- "2 Length / height";
- "3 Head type" (flat / dome / elliptical);
- a blue liquid line at "4 Liquid depth", or "5 Gap from the top (ullage)".

The filled area is shaded with live gallons and % full. For horizontal tanks the circular segment is clearly visible.

### 3.3 Inputs (defaults = examples)

| Field | Default |
|---|---|
| Shape | horizontal cylinder, flat ends |
| Dimensions | diameter 6 ft, length 12 ft (ft + in or metric) |
| Fill | depth 2 ft (or ullage) |
| Dipstick | step 1 in (or 1 cm) |
| Tank size | target 500 gal + diameter → length |
| Density | optional (water ≈ 8.34 lb/US gal, labelled approximate) |

### 3.4 Engine (`src/lib/tank-engine.ts` + `volume-units-engine`)

```ts
horizontal segment: A(h) = r²·acos((r−h)/r) − (r−h)·√(2rh − h²) ; V = A·L
hemispherical heads: full (4/3)πr³ total ; partial: 2 × cap πh²(3r − h)/3
2:1 elliptical heads: total (2/3)πr³ ; partial = hemi caps × (a/r), a = r/2   // `TODO(owner)`: verify against a cited engineering reference before shipping
vertical cylinder πr²h (+ head) ; cone bottom: full (1/3)πr²Hc, partial in cone (1/3)π(r·h/Hc)²h, + cylinder above
rectangle L·W·h ; oval (stadium): segment + rectangle ; capsule: cylinder + hemispheres ; sphere cap πh²(3R − h)/3
ullage: h = D − gap ; dipstick table by step ; tank size inverse (closed form or bisection)
units via volume-units-engine (1 ft³ = 7.48052 gal; 1 bbl = 42 US gal)
```

**Worked examples (checked 2026-11-22):**

| Tank | Result |
|---|---|
| Horizontal 6 ft × 12 ft, flat ends | full **2,538.1 US gal** · at 2 ft depth **740.6 gal** |
| Horizontal, 10 ft diameter at 3 ft depth | **25.2% full** |
| Vertical 4 ft × 6 ft | **564.0 US gal** |
| Horizontal 4 ft × 10 ft | full 940.0 gal · at 1 ft 183.8 gal |

### 3.5 Outputs

- **Headline:** capacity + filled volume + % full.
- **Sentence:** "A 6 × 12 ft horizontal tank holds about 2,538 gallons. At 2 ft of liquid it contains 740.6 gallons (29.2% full)."
- All units. Liquid weight.
- SVG with the fill level.
- **Dipstick table** (print / CSV).
- Tank-size result.
- Share URL.

### 3.6 Tests

- Every shape full + partial; ullage; head volumes vs the cited reference.
- Dipstick monotonic; tank-size inverse.
- The fixtures above (2,538.1 / 740.6 / 25.2%).
- Depth > diameter → error. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Tank Volume Calculator – Gallons in Any Tank` (44; 56 with the suffix: OK) |
| Meta | `Free tank volume calculator. Find the capacity and the filled volume of round, horizontal, oval, rectangular and cone-bottom tanks in gallons and litres.` (153) |
| H1 | `Tank Volume Calculator: Gallons and Litres in Round, Oval and Box Tanks` |
| BLUF | "For a vertical round tank, volume = π × radius² × height: 4 ft across and 6 ft tall holds about 564 US gallons. A horizontal 6 × 12 ft tank holds about 2,538 gallons, and at 2 ft of liquid it contains 740.6 gallons; the calculator does that partial-fill maths for any depth." (engine) |
| ToolShell pills | `Every tank shape & head`, `Volume at any depth`, `Printable dipstick chart`, `Gallons, litres & barrels` |
| Links out | Gallons ↔ ft³ (#5), Pipe Volume (live), Metric Conversion (#20), Cubic Yard (live) |
| Links in | Gallons ↔ ft³, Pipe Volume, Metric Conversion, Tools hub "Units" |

## 5. Content (~1,500–1,800 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the tank volume calculator | 3 tabs | 100 |
| 2 | Volume of a vertical tank | Formula + example | 150 |
| 3 | Volume of a horizontal tank: full and partly filled | Segment formula + the corrected 6 × 12 ft example | 250 |
| 4 | Tanks with domed or elliptical ends | Head volumes (cited) | 180 |
| 5 | Rectangular, oval, capsule and cone-bottom tanks | Formulas | 200 |
| 6 | Making a dipstick chart | Table example; why a half-height gauge isn't half the gallons in a horizontal tank | 150 |
| 7 | What size tank do I need? | Tank-size mode (`tank size calculator`) | 130 |
| 8 | Gallons, litres and barrels | Conversions; link #5 | 80 |
| 9 | FAQ | §6 | 380 |

## 6. FAQ (10, from the question bank)

1. How do I calculate the volume of a cylindrical tank in gallons?
2. How much liquid is in a horizontal tank at a given depth?
3. How do I make or read a dipstick chart?
4. How do domed or elliptical ends change capacity?
5. How do I calculate a cone-bottom tank?
6. Why isn't a half-full gauge exactly half the gallons?
7. What size tank do I need? (`tank size calculator`)
8. How many gallons are in a cubic foot? (link #5)
9. How much does the liquid in my tank weigh?
10. What are common propane or oil tank sizes? (manufacturers' published sizes only, cited, or skip)

## 7. Done when

- [ ] `tank-engine.ts` + tests (fixtures); `npm run verify` passes.
- [ ] Head formulas verified against a cited engineering reference.
- [ ] InputGuide above the inputs; ToolShell + TabSlider + fonts + `<main>`.
- [ ] Registrations + docs; `graphify update .`.
