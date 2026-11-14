# Wire Gauge / Wire Size Calculator — Top 10 Competitor Analysis

> **Target page:** KKCTools `/wire-gauge-calculator/` (Batch 2, Tier 1 #8)
> **Primary keyword:** `wire gauge calculator` — US 5,400 · Global 8,600 · KD 11 · CPC $0.36
> **Secondary:** `size electrical wire calculator` 5,400 / 13 · `wire gauge length calculator` 1,600 / 14 · `wire size calculator` 5,400 / 24
> **SERP source:** `2 . 1-36 complete SERP report/1-36 complete SERP.md` §24
> **Pages visited:** 2026-11-14 (8 of 10 read; both wiresizecalculator.net URLs failed — expired SSL certificate)
> **Purpose:** know exactly what the ranking pages offer, so our page covers everything they do and fixes what they miss.

---

## 0. How this was collected (read first)

- Every top-10 URL was opened; visible text read.
- **Limits:** most calculators render results with JS, so outputs often showed “N/A” or placeholders. wiresizecalculator.net (#3, #9) could not be opened (**expired SSL certificate** — itself a weakness). Meta and schema not readable. Word counts are estimates.
- **Safety-sensitive topic.** Every ampacity, resistance and voltage-drop figure must come from a cited standard (NEC Table 310.16 / Chapter 9 Table 8, IEC 60228, BS 7671 Appendix 4, AS/NZS 3008, ABYC E-11). **Do not copy competitor tables** (AGENTS.md rule 8) — build from the standards or mark `TODO(owner)`.

---

## 1. SERP snapshot

| # | URL | AS | What it is | Body words (est.) |
|---:|---|:---:|---|---:|
| 1 | omnicalculator.com/physics/12v-wire-size | 84 | Giant — **12 V only** wire size | 550–650 |
| 2 | ressupply.com/wire-sizing-chart-and-formula | 25 | Solar shop — chart + manual VDI method (no calculator) | ~450 |
| 3 | wiresizecalculator.net/calculators/advancedwiresize.htm | 23 | Old-style calculator site | **SSL expired** |
| 4 | ecalcubox.com/ot-wire-size-calculator | 6 | Small calc site | 300–350 |
| 5 | tools.puida.com/industrial/manufacturing/wire-sizing-calculator/ | 11 | Engineering tool — **most complete** | 1,900–2,100 |
| 6 | electricaltechnology.org/2014/04/electrical-wire-cable-size-calculator.html | 43 | 2014 blog calculator + 102 comments | 650–750 |
| 7 | electricalsupplycenter.com/pages/wire-gauge-calculator | 8 | Shopify wire store widget | 120–150 |
| 8 | app.gaugify.io/wire-gage-calculator | 9 | Calibration SaaS — gauge → diameter/resistance | 300–350 |
| 9 | wiresizecalculator.net/calculators/wiresize.htm | 23 | Same site as #3 | **SSL expired** |
| 10 | app.faroutride.com/electrical/wire-gauge | 26 | Van-life / RV 12–48 V DC tool | 450–550 |

**What the SERP tells us:**
- **Three intents share “wire gauge calculator”:**
  1. **Size a wire** for amps + distance + voltage drop (most pages) — main intent.
  2. **Gauge lookup** — AWG number → diameter, mm², resistance, weight (Gaugify only).
  3. **Low-voltage DC** — 12/24/48 V for solar, RV, marine, car audio (Omni, RES Supply, FarOutRide).
- **Only Puida (AS 11) is complete** (AC + 3-phase + DC, AWG + mm², derating, NEC/BS/IEC cited). Everyone else misses ampacity, derating, mm² or three-phase.
- **4 pages have AS ≤ 11** and one site appears twice with a broken certificate → weak SERP for a 5,400/month term.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Omni 12V | RES Supply | eCalcBox | Puida | ElecTech | ESC store | Gaugify | FarOutRide |
|---|---|---|---|---|---|---|---|---|
| Interactive tool | ✅ | ❌ chart only | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Current (A) input | ✅ | ✅ manual | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Watts → amps | ❌ | ✅ manual | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| One-way length | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Feet **and** metres | ⚠️ m | ❌ ft | ✅ | ✅ | ❌ ft | ❌ ft | ❌ | ✅ |
| Voltage choice | ❌ 12 V fixed | ✅ any | ✅ 12/24/120/240/480 | ✅ 12–600 V | ✅ 110–480 V (no 230/400 three-phase EU set) | ✅ 12/24/48/120/240 | — | ✅ 12/24/36/48 |
| AC single-phase vs three-phase | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | — | ❌ DC |
| DC | ✅ | ✅ | ✅ | ✅ | ❌ | ⚠️ | — | ✅ |
| Voltage drop % input | ✅ | ✅ | ✅ 1/2/3/5 | ✅ | ✅ 3/5/custom | ✅ 1/2/3/5 | — | ✅ 1–10 |
| Copper / aluminium | ✅ + custom ρ | ✅ | ✅ | ✅ | ✅ both shown | ❌ copper only | ✅ + steel | ❌ copper |
| Ampacity check | ❌ | ✅ chart | ⚠️ table | ✅ NEC 310.16 | ❌ (text says check) | ❌ | ❌ | ✅ |
| Temperature rating (60/75/90 °C) | ⚠️ max temp | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ⚠️ fixed 105 °C |
| Derating (ambient, bundling, conduit) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ 3 checkboxes |
| Continuous load 125 % | ❌ | ❌ | ❌ | ✅ claimed | ❌ | ❌ | ❌ | ✅ |
| Fuse / breaker size | ❌ | ❌ | ❌ | ⚠️ | ❌ | ❌ | ❌ | ✅ |
| Output AWG | ✅ | ✅ | ✅ | ✅ | ⚠️ circular mils | ✅ | input | ✅ |
| Output mm² (metric cable) | ⚠️ area | ❌ | ❌ | ✅ IEC 60228 | ⚠️ conversion note | ❌ | ⚠️ in² | ❌ |
| Actual voltage drop (V and %) | ❌ | ❌ | ✅ | ✅ + end voltage | ❌ | ✅ | ❌ | ⚠️ |
| Gauge lookup (diameter, Ω/km, weight) | ❌ | ❌ | ❌ | ⚠️ table | ❌ | ❌ | ✅ (weight wrong) | ❌ |
| Conduit fill | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Omni 12V | RES Supply | eCalcBox | Puida | ElecTech | ESC store | Gaugify | FarOutRide |
|---|---|---|---|---|---|---|---|---|
| Formula shown | ✅ | ✅ VDI | ✅ | ✅ 1-ph + 3-ph | ✅ circular mils | ❌ | ❌ | ❌ |
| Worked example | 3 (FAQ) | 1 (solar) | 0 | 3 | 0 | 0 | 0 | 0 |
| Wire size chart by amps | ❌ | ✅ VDI chart | ✅ small | ✅ | ❌ (link) | ❌ | ❌ | ❌ |
| AWG ↔ mm² table | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Standards by region (NEC / BS / IEC / AS) | ❌ | ❌ | ❌ | ✅ | ⚠️ NEC only | ❌ | ❌ | ⚠️ ABYC |
| FAQ count | 3 | 0 | 0 | **14** | 0 | 0 | 0 | 0 |
| Named author | ✅ + PhD reviewer | ⚠️ chart credit | ❌ | ❌ company | ⚠️ team | ❌ | ❌ | ❌ |
| Date | ❌ | ❌ | ❌ | ❌ | ⚠️ 2014 URL | ❌ | ❌ | ❌ |
| Sources | ❌ | ✅ SEI manual | ❌ | ✅ many NEC/BS/IEC clauses | ✅ NEC clauses | ❌ | ❌ | ⚠️ ABYC |
| Safety disclaimer | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ⚠️ | ✅ |

---

## 4. Competitor-by-competitor detail

### #1 — omnicalculator.com/physics/12v-wire-size (AS 84)

- **Title / H1:** 12 Volt Wire Size Calculator
- **Calculator:** 12 V fixed; allowable drop; copper/aluminium/custom resistivity; current; one-way distance; max wire temperature (50 °C). Outputs: cross-section area, diameter, AWG.
- **Formula:** A = 2 × I × ρ × L ÷ (V × %drop).
- **FAQs (3):** recommended wire for 12 V appliances · can I use 16 AWG at 12 V · amps on 14 AWG at 12 V.
- **Weak points:** drop labelled “(V)” but used as %; no ampacity or fuse; no date or sources.
- **Lesson:** Google ranks a **12 V-only** page #1 for the general term — a **DC / 12 V preset** is important. Omni has separate pages for wire size, DC, 100 A, 220 V and 24 V — we can cover all in one tool with presets.

### #2 — ressupply.com/wire-sizing-chart-and-formula (AS 25)

- No calculator. Manual method: **VDI = amps × feet ÷ (%drop × voltage)** → look up in a 12-row AWG chart (copper + aluminium VDI and ampacity). Solar example (17.6 A, 60 ft, 12 V, 3%) → VDI 29.3 → #2 Cu (checked correct).
- Source: SEI *Photovoltaics Design and Installation Manual* chart (used with permission).
- **Weak points:** unfinished 24 V example; no derating; no code reference.
- **Lesson:** solar/off-grid users are a real audience; **watts → amps** step is needed.

### #3, #9 — wiresizecalculator.net (AS 23) — SSL certificate expired

Both URLs fail with an expired certificate. Browsers will show a security warning → these slots are fragile. `TODO: re-check by hand.`

### #4 — ecalcubox.com/ot-wire-size-calculator (AS 6)

- **Calculator:** current, one-way length (ft/m), system voltage (12 DC, 24 DC, 120/240/480 AC), max drop (1/2/3/5%, NEC 3% branch / 5% total note), copper/aluminium. Outputs: minimum wire size, voltage drop, actual drop %.
- Formula Vdrop = 2 × I × L × R ÷ 1000; small copper table (14 AWG–1/0: ampacity + Ω/1000 ft) with no temperature basis.
- **Weak points:** no three-phase; aluminium has no table; no author/date/sources; brand misspelt in title.
- **Lesson:** ranks #4 at AS 6 with ~300 words — tool quality and clear inputs are enough here.

### #5 — tools.puida.com wire-sizing-calculator (AS 11) — **the page to beat**

- **Title:** Cable Size Calculator | Wire Gauge, Voltage Drop & Ampacity · **H1:** Cable Size & Wire Gauge Calculator
- **Calculator:** load current; one-way length (ft/m); single-phase, 3-phase (208/240/480/600 V), DC (12/24/48 V); Cu/Al; ambient temperature; terminal column 60/75/90 °C; bundling; raceway type (EMT/IMC/RMC/PVC). Outputs: AWG/kcmil **and nearest IEC mm²**, derated ampacity, voltage drop V and %, end voltage, conduit fill, size comparison. Claims 125 % continuous-load factor.
- **Content:** features; wire size by amp rating table; NEC 310.16 ampacity table; AWG ↔ mm² chart; standard by region (NEC, BS 7671, AS/NZS 3008, IEC 60364).
- **FAQs (14):** what size cable · cable vs wire size · 30 A · 50 A at 100 ft · 200 A service · voltage drop · 12/24 V DC · 3-phase · AWG to mm² · neutral sizing · acceptable drop % · which standard · replace an electrician? · is data stored?
- **Errors:** 1/0 AWG (53.5 mm²) mapped *down* to 50 mm² against its own “step up” rule; 200 A service 3/0 vs 2/0 inconsistent; NEC table omits Al 60 °C column.
- **Lesson:** match its scope, fix its inconsistencies, add a clean **watts → amps** step, **gauge lookup**, and clearer explanations for DIY users.

### #6 — electricaltechnology.org (AS 43)

- Calculator: source voltage (110–480 V list, no 230/400 V), single/three phase, current, distance (ft), drop 3%/5%/custom. Output: copper and aluminium size (circular mils).
- Formulas: CM = 2ρIL ÷ (%drop × V) single-phase; √3 version for three-phase; ρ Cu 11.2, Al 17.4 at 53 °C.
- **Weak points:** 2014 page; no worked example; L vs D variable mismatch; ampacity/derating discussed but not calculated; comments full of unverified answers.
- **Lesson:** missing **230 V / 400 V** — Europe/India users are underserved.

### #7 — electricalsupplycenter.com (AS 8)

- Shopify store widget: voltage (12/24/48/120/240), current, one-way length (ft), drop (1/2/3/5%). Output: recommended gauge (copper), actual drop. No method, ~130 words.
- **Lesson:** ranks #7 with a bare widget — a full tool with content should beat it easily.

### #8 — app.gaugify.io/wire-gage-calculator (AS 9)

- **Gauge lookup**: standard (AWG / SWG / BWG), gauge number, material (Cu / Al / steel). Outputs: diameter, area, resistance Ω/kft, weight g/ft.
- **Error:** AWG 12 copper weight shown 22.95 g/ft — real value ≈ 9 g/ft (area 0.005128 in² × copper density). Educational headings have **no text**.
- **Lesson:** a **gauge → diameter/mm²/resistance/weight** lookup mode serves the “wire gauge” meaning (and `wire gauge length calculator`).

### #10 — app.faroutride.com/electrical/wire-gauge (AS 26)

- RV/van DC tool: mode “I know the current” / “I know the fuse”; 12/24/36/48 V; drop 1–10%; current; one-way length (ft/m); fuse known or suggested; derating checkboxes (ambient > 50 °C −15%, load > 20 min +25%, bundled/conduit −30%) per ABYC. Output not visible.
- **Lesson:** **fuse size** output and simple derating checkboxes suit DIY users.

---

## 5. Patterns

- **Voltage-drop sizing formula (everyone):** single-phase/DC VD = 2 × I × R × L ÷ 1000 (R in Ω/1000 ft); three-phase VD = √3 × I × R × L ÷ 1000. Equivalent area form A = 2ρIL ÷ (V × %drop).
- **Common drop limits quoted:** 3% branch, 5% feeder + branch (NEC informational note, not mandatory) — cite carefully.
- **The two checks most pages skip:** ampacity (with temperature column + derating) and fuse/breaker size. Sizing by voltage drop alone can pick a wire that is too small for the current.
- **mm² is nearly absent** (Puida only), despite 37% of searches being outside the US.

| Section | Pages (of 8) |
|---|:---:|
| Formula | 5 |
| Worked example | 3 |
| Size chart by amps | 3 |
| AWG ↔ mm² | 1 |
| FAQ | 2 |
| Sources/standards cited | 4 |
| Date | 0 (1 via URL) |
| Safety disclaimer | 4 |

---

## 6. FAQ question bank

★ = asked on 2+ pages.

| # | Question | Seen on |
|---:|---|---|
| 1 | ★ What size wire do I need for 30 / 50 / 100 / 200 amps? | Puida, Omni (related pages) |
| 2 | ★ What size wire for 12 V (or 24 V) DC? | Omni, Puida, RES Supply |
| 3 | ★ How do I calculate voltage drop? | Puida, ElecTech, eCalcBox |
| 4 | What size cable for 50 amps at 100 feet? (distance questions) | Puida |
| 5 | What voltage drop percentage is acceptable? | Puida, eCalcBox (helper) |
| 6 | How do I convert AWG to mm²? | Puida |
| 7 | How many amps can 14 / 12 / 10 AWG carry? | Omni |
| 8 | Can I use aluminium instead of copper? | (inputs on 5 pages) |
| 9 | How do I size wire for three-phase? | Puida |
| 10 | What is the difference between wire size and cable size? | Puida |
| 11 | What fuse or breaker size do I need? | FarOutRide |
| 12 | Why is a bigger gauge number a thinner wire? | Gaugify |
| 13 | What is the diameter / resistance of 12 AWG? | Gaugify |
| 14 | Does this replace an electrician? | Puida |

---

## 7. Gaps nobody fills — our opportunities

1. **Three modes in one page:** *Size a wire* · *Check voltage drop of a wire I have* · *Gauge lookup (AWG ↔ mm² ↔ diameter ↔ Ω/km ↔ weight)*. Nobody combines these.
2. **Watts → amps** input (and kW, HP for motors). Only RES Supply does it, by hand.
3. **Global voltages:** 120/208/240/277/480 (US), 230/400 (EU, UK, India), 12/24/48 DC. Only Puida comes close.
4. **Both checks shown:** voltage-drop size **and** ampacity size → recommend the larger, explain which one controls.
5. **mm² standard sizes** (1.5, 2.5, 4, 6, 10, 16…) alongside AWG; regional standard note.
6. **Fuse/breaker suggestion** with continuous-load 125 % (US) shown transparently.
7. **Correct gauge data** — Gaugify's weight error shows lookup data must be tested.
8. **Plain-language result:** “Use 10 AWG copper (or 6 mm²): drop 2.4 % = 2.9 V at the load” + why.
9. **Size-by-amps and size-by-distance tables** generated by our engine.
10. **Trust:** standards cited with edition, last-updated date, strong safety disclaimer.

---

## 8. Blueprint for the KKCTools Wire Gauge Calculator page

### 8.1 SEO

- **URL:** `/wire-gauge-calculator/`
- **Title (52 chars):** Wire Gauge Calculator – Wire Size by Amps & Distance
- **H1:** Wire Gauge Calculator: Wire Size by Amps, Voltage & Distance
- **Meta:** Find the right wire gauge (AWG) or mm² for your circuit. Enter amps, voltage and run length to check voltage drop and a suggested wire size.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Modes | Size a wire · Voltage drop check · Gauge lookup |
| Load | amps, or watts/kW + voltage (+ power factor for AC) |
| System | DC · AC single-phase · AC three-phase; voltage presets (12/24/48 DC, 120/208/240/277/480, 230/400) + custom |
| Run | one-way length ft/m (tool doubles for return path; explained) |
| Conductor | copper / aluminium; temperature rating 60/75/90 °C (US) |
| Derating | ambient temperature, number of current-carrying conductors (factors from cited tables) |
| Limits | allowed drop % (default 3 %, editable) |
| Outputs | AWG/kcmil **and** mm², actual drop V and %, load-end voltage, ampacity check, which rule controls, suggested fuse/breaker, next size up/down comparison |
| Lookup | AWG 0000–40 ↔ diameter (in, mm), area (kcmil, mm²), Ω/1000 ft and Ω/km (Cu, Al), weight |
| UX | copy, print, share URL, no network; clear safety banner |

### 8.3 Content outline (≈ 2,000–2,500 words, original)

1. Intro + safety note
2. How to use (3 modes)
3. How wire size is worked out: voltage drop vs ampacity
4. Voltage drop formula (DC / single-phase / three-phase) + worked examples from engine
5. Wire size by amps table (generated, with temperature basis stated)
6. Wire size by distance table (e.g. 20 A / 30 A at 50–200 ft)
7. 12 V / 24 V DC wire sizing (solar, RV, marine, car audio)
8. AWG vs mm² — conversion table and regional standards
9. Copper vs aluminium
10. Fuse and breaker basics
11. FAQ (10–12)
12. Related tools — Pipe/Tube Volume, Cubic Inch, Linear Foot
13. Sources (NEC, IEC 60228, BS 7671, AS/NZS 3008, ABYC E-11 — editions named) + methodology + date
14. Disclaimer: estimate only; follow local code and a licensed electrician

### 8.4 Quality checks

- Unit tests for every formula, all voltage systems, derating and every table/FAQ number.
- Every resistance/ampacity value traced to a named standard and edition, or `TODO(owner)` in `docs/00-PROJECT-STATUS.md`. (Owner may need to buy/access NEC and BS 7671 tables.)
- No competitor wording or tables copied. `npm run check:no-network` passes.
- `TODO: re-check wiresizecalculator.net by hand (SSL expired).`
