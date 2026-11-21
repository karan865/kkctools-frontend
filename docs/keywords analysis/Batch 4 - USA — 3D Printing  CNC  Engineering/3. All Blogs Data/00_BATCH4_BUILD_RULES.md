# Batch 4 — Build Rules (3D Printing, CNC & Engineering)

> **Read before every Batch 4 spec.** Builder: Antigravity / Gemini.
> **Inputs used:**
> - `KKCTools_Batch4_Final_Tool_Keywords.md` (Semrush US, Oct 2026)
> - 8 competitor analyses (live web search, 2026-11-14)
>
> **Written:** 2026-11-22

---

## 0. Status: provisional (no Semrush SERP export)

- There is **no Semrush SERP data** (top 10 + Domain AS) for Batch 4. The owner chose to build anyway.
- Every spec targets low-KD rows first and treats bigger terms as long-term.
- **TODO(owner):** pull the SERPs later. If a tool's top 5 holds 3+ relevant domains at AS ≥ 60, adjust its targets.

## 1. Project rules (AGENTS.md wins on any conflict)

**Never do these:**
- make network calls in tool code;
- invent facts;
- copy competitor text, tables or designs;
- commit or push.

**Always do these:**
- Use `TODO(owner)` for anything the owner must supply.
- Engine-first: pure functions in `src/lib/<tool>-engine.ts` + a test file.
  - Return `null` for undefined cases; never NaN or Infinity.
  - Normalise -0 to 0.
- Every number in the BLUF, examples and FAQ comes from the engine.
  - Each spec's **worked example must be a unit test.**
- Run `npm run verify` from **PowerShell or the VS Code terminal, not Git Bash**. In Git Bash, vitest fails with "reading 'config'".
- Run graphify:
  - `graphify query` before searching code;
  - `graphify update .` after changes;
  - exe path: `$(ls ~/AppData/Roaming/Python/*/Scripts/graphify.exe | head -1)`.

## 2. Accuracy rules for this batch (the main risk)

1. **Never publish invented reference values.** This covers:
   - epoxy cure times and max pour depths;
   - "food safe" claims;
   - SFM or chip loads by material;
   - filament densities;
   - firmware defaults;
   - thread tolerance classes.
2. **Values a product label or data sheet gives are user inputs.** This covers max pour depth, mix ratio, densities and cure time.
   - Label every default **"example: use your product's data sheet"**.
3. **Material presets are optional.** Ship them (SFM, chip load, filament density) **only** when copied from a named, dated, publicly available source the builder actually opened, with that source cited in `HowWeCalculate`.
   - Otherwise ship custom fields only. `TODO(owner)`: approve a source.
4. **No standards tables copied.** This means ASME B1.1, ISO 965 and Machinery's Handbook tables. Show basic sizes from formulas only.
5. **Adult-slang "CNC" terms** (keyword file §5) must never appear in copy, titles, anchors or alt text.
6. **Brands** (TotalBoat, ArtResin, Prusa, Bambu, Haas, Marlin, Klipper…) appear descriptively only.
   - Firmware names are fine as labels; they are factual.
   - No logos, no affiliate links.
7. **Safety lines** go on the epoxy pages, and the machining pages carry "starting point, test cut first". Keep them short.
   - Epoxy: gloves, ventilation, follow the label.
   - Exotherm: deep pours can overheat; follow the label's max depth.

## 3. Shared code

| File | Exports | Used by |
|---|---|---|
| `src/lib/epoxy-engine.ts` (+ test) | volume of shapes (rect, circle, cylinder, box, river by avg width or segments, void, known volume), unit conversion (in³ ↔ fl oz ↔ US gal ↔ mL ↔ L; 1 US gal = 231 in³; 1 fl oz = 1.804688 in³; 1 in³ = 16.387064 mL), allowances (edge %, waste %), `mixSplit(volume, ratioA, ratioB, mode: 'volume' \| 'weight', densA?, densB?)`, `pourPlan(depth, maxLayer)`, `kitPlan(volume, kitSizes[], prices?)` | Epoxy Resin, Epoxy Table |
| `src/lib/machining-engine.ts` (+ test) | `rpmFromSfm(sfm, dIn) = 12·sfm/(π·d)`, `sfmFromRpm`, metric `rpmFromVc(vc, dMm) = 1000·vc/(π·d)`, `feed(rpm, flutes, chipLoad)`, `chipLoadFromFeed`, `chipThinning(chipLoad, woc, d)`, `mrr(woc, doc, feed)`, `tapFeed(rpm, pitch)`, `lineSpeed(rpm, dia)`, limits scaling | Speeds & Feeds, SFM ↔ RPM, Pulley (belt speed) |

**Rule:** use exact π maths. The 3.82 / 0.262 shortcuts are explained in content only.

## 4. Shared UI (same as Batch 3, already live)

- `ToolShell` wraps the calculator. Give it 3–4 **true** pills; no ratings, never `aggregateRating`.
- `TabSlider` for modes, with `?tab=` in the URL.
- `<main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>`.
  - Fonts from `src/lib/fonts.ts`; typography from `src/styles/tool-typography.module.css`.
  - **The page must have a `<main>` element.**
- **Input guide diagram ABOVE the inputs.** Same pattern as Batch 3 rules §9:
  - `<Name>InputGuide.tsx`, inline SVG;
  - numbered callouts that match the numbered field labels;
  - live values; focus highlight;
  - `role="img"` + title/desc; tokens only; mobile `<details>`; one diagram per tab.
  - Each spec §3.2 says what it shows.

## 5. Files a new tool touches

- **New:**
  - engine + test;
  - component folder (calculator, InputGuide, optional result diagram, `index.ts`);
  - `src/app/<slug>/page.tsx` + `page.module.css`.
- **Edit:**
  - `routes.ts`;
  - `tools-catalog.ts` + count test;
  - `calculation-methods.ts`;
  - `ToolArt.tsx`, `Icons.tsx`, `Footer.tsx`;
  - docs 00/01/02/04/06.
- **New catalog category:** `3D Printing & CNC`. Add it with the first tool.
  - Hubs: Resin (Epoxy ↔ Epoxy Table ↔ 3D Print resin mode) · Machining (Speeds & Feeds ↔ SFM ↔ Pulley ↔ Thread) · Maker (3D Print Cost ↔ Steps per mm).

## 6. Page structure and SEO

- `buildMetadata`. Use `absoluteTitle` when the title + " | KKC Tools" is over 60.
- Breadcrumbs, then JsonLd (WebApplication + FAQPage + BreadcrumbList).
- **Calculator above the fold, working with defaults.**
- BLUF: the first 50–60 words answer the main query, with engine numbers.
- One plain-English result sentence; step-by-step with the user's numbers.
- H2s per spec; FAQ visible once with its schema once; HowWeCalculate; related tools.
- AdSlots outside the ToolShell band.
- Metric + imperial everywhere.
- Share URL, Copy, Print (a printable "shopping list" or "setup card" where the spec says so).
- Mobile 390 px: no page-level horizontal scroll; tables scroll inside their box.

## 7. Build order

| # | Spec folder | URL | Primary (US vol / KD) |
|---:|---|---|---|
| 1 | `01_Epoxy_Resin_Calculator` | `/epoxy-resin-calculator/` | `epoxy calculator` 2,400 / 13 |
| 2 | `05_Epoxy_River_Table_Calculator` | `/epoxy-table-calculator/` | `epoxy resin table` 2,900 / 15 |
| 3 | `02_3D_Print_Cost_Calculator` | `/3d-print-cost-calculator/` | `3d print cost calculator` 2,400 / 11 |
| 4 | `03_Speeds_and_Feeds_Calculator` | `/speeds-and-feeds-calculator/` | `feeds and speeds calculator` 1,300 / 22 |
| 5 | `04_SFM_RPM_Surface_Speed_Calculator` | `/sfm-to-rpm-calculator/` | `sfm calculator` 1,300 / 17 |
| 6 | `07_Pulley_Ratio_Belt_Speed_Calculator` | `/pulley-calculator/` | `pulley ratio calculator` 480 / 5 |
| 7 | `06_Stepper_Steps_per_mm_Esteps_Calculator` | `/steps-per-mm-calculator/` | `stepper motor calculator` 720 / 14 |
| 8 | `08_Thread_Pitch_Diameter_Tap_Drill_Calculator` | `/thread-pitch-diameter-calculator/` | `pitch diameter` 1,300 / 10 |

**Ranking reality:**
- KD is low, but there is no SERP data, so this is unconfirmed.
- Pages need a few relevant links (maker forums, woodworking and CNC communities) and a few weeks.
