# Speeds and Feeds Calculator — Build Spec

> **URL:** `/speeds-and-feeds-calculator/` · Batch 4 · Tier 1 · **Build order 4**
> **Read first:** `../00_BATCH4_BUILD_RULES.md` (§2 accuracy rules are critical here)
> **Inputs:** `03_Speeds_and_Feeds_Calculator_Competitor_Analysis.md`, keyword file §2 #3
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

Both CNC seeds point here. The calculator terms total ~7,000 searches at KD 22–29, CPC $2–3, and `chip load calculator` is easier (480, KD 10).

**The SERP serves two audiences, and nobody serves both in one tool:**
- machinists (metal);
- hobby CNC router users (wood, MDF, plastics).

**Competitors also hide their numbers:** they use preset SFM and chip loads but never show the values.

**Our rule:** presets ship **only** if copied from a named, publicly available source the builder opened. Show the values, cite them, keep them editable.
- `TODO(owner)`: approve a source.
- Otherwise ship custom SFM and chip-load fields with a "starting point from your tool maker's chart" note.

### Research notes from the competitor analysis (added 2026-11-22)

- Pages read: Omni, Calctool (same engine family), GoodCalculators, Engineers Edge, Firgelli, Popular Woodworking, Twotrees.
- **Tool makers (Kennametal, Seco, Rigibore) rank but render with JavaScript.** `TODO(owner)`: review them in a browser; they are the authority benchmark for metric/inch, operations and disclaimers.
- **everycalculators.com has many thin near-duplicate pages** ("router bit chip load calculator", "… mm min"): a programmatic pattern we must **not** copy. One strong page wins.
- Competitor errors re-checked: Twotrees' matrix values and Firgelli's MRR assumption (see the analysis §4).

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | feeds and speeds calculator | 1,300 | 22 | title, H1, first sentence |
| Secondary | speeds and feeds calculator · speed and feed calculator · feed and speed calculator · speed and feed calc · speed feed calculator | 1,300 · 1,000 · 720 · 1,000 · 1,000 | 23–28 | tool heading, H2s |
| Secondary | feed rate calculator | 1,300 | 29 | Feed output + H2 "How to calculate feed rate" |
| Secondary | chip load calculator | 480 | 10 | Chip-load reverse mode + H2 "Chip load" |
| Secondary | high speed machining | 880 | 12 | H2 "Chip thinning and high speed machining" |
| Secondary | cutting data · cutting speeds and feeds chart | 590 · 320 | 11 | H2 + a printable starting chart **only with a cited source** |
| Secondary | drill speeds and feeds | 260 | 8 | Drilling tab + H2 |
| Secondary | tap calculator | 320 | 6 | Tapping tab (feed = RPM × pitch) |
| Skip | haas insert drill feeds and speeds (brand, irregular) | — | — | — |
| **Never** | adult-slang "CNC" terms | — | — | rules §2.5 |

## 2. Our edge

- **One tool, four modes:** milling (metal), CNC router (wood / MDF / plastic / aluminum), drilling, tapping.
- **Visible, sourced presets or none** (competitors hide theirs).
- **Machine limits:** max RPM and max feed (min RPM for routers) → scale the cut and show the **real** chip load and SFM, with warnings. Nobody has this.
- **Radial chip-thinning correction** (`high speed machining`).
- **Full metric ↔ imperial:** SFM ↔ m/min, IPM ↔ mm/min, in/tooth ↔ mm/tooth.
- **Reverse modes:** chip load from a known feed; SFM from RPM.
- Correct MRR (WOC × DOC × feed).
- Router troubleshooting table (burning, chatter, fuzzy edges, dust): our own wording.
- "Starting point, test cut first" workflow.

## 3. Calculator spec

### 3.1 Tabs

1. **Milling** (default)
2. **CNC router**
3. **Drilling**
4. **Tapping**

### 3.2 Input guide diagram (above the inputs)

`FeedsInputGuide.tsx`: a side view of an end mill cutting a block.

- **Tool:** "1 Tool diameter" across it; "2 Flutes" on a top-view inset.
- **Surface:** an arrow on the tool surface labelled "3 Surface speed (SFM)" → spindle "RPM".
- **Chip:** a single chip labelled "4 Chip load per tooth".
- **Table movement:** "Feed rate".
- **Cut depths:** "5 Width of cut (stepover)" and "6 Depth of cut" on the block.
- **Machine limits:** a gauge labelled "7 Machine max RPM / max feed".
- **Drilling tab:** a drill with "Feed per rev".
- **Tapping tab:** a tap with "Pitch / TPI".

Live values; the focused field highlights.

### 3.3 Inputs (defaults = examples; label all as examples)

| Field | Default |
|---|---|
| Units | inch / metric |
| Tool diameter | 0.5 in |
| Flutes | 3 |
| Tool material | carbide / HSS (label only, no multipliers unless sourced) |
| Surface speed | 600 SFM (example; "use your tool maker's chart") or a preset if a source is approved |
| Chip load | 0.002 in/tooth (example) |
| WOC / DOC | optional, for chip thinning and MRR |
| Machine | max RPM, min RPM, max feed: optional |
| Drilling | feed per rev |
| Tapping | TPI or pitch |

### 3.4 Engine (`src/lib/machining-engine.ts`, shared with #4 and #7)

```ts
rpm = 12*sfm/(π*D)  | metric 1000*vc/(π*Dmm)
feed = rpm * flutes * chipLoad
chipThinFactor = woc < D/2 ? D / (2*sqrt(D*woc - woc²)) : 1 ; adjustedChipLoad = chipLoad * factor (show both)
limits: if rpm > maxRpm → rpm = maxRpm ; if feed > maxFeed → feed = maxFeed ; actualChipLoad = feed/(rpm*flutes) ; actualSfm = π*D*rpm/12 → warnings
chipLoadFromFeed = feed/(rpm*flutes) ; mrr = woc*doc*feed
drill feed = rpm * ipr ; tap feed = rpm * pitch (pitch = 1/TPI)
```

**Worked example (checked 2026-11-22):**
- 0.5 in, 3 flutes, 600 SFM (example) → **4,584 RPM**.
- At 0.002 in/tooth → **27.50 IPM**.

### 3.5 Outputs

- **Headline:** RPM + feed (IPM and mm/min).
- **Sentence:** "A 1/2-inch, 3-flute cutter at 600 SFM runs at 4,584 RPM; at 0.002 in per tooth the feed is 27.5 inches per minute. These are starting values; make a test cut."
- Actual chip load and SFM after machine limits, with warnings (over limit, chip too thin = rubbing).
- MRR. Printable **setup card**. Share URL.
- Sourced preset table (if approved).
- Router troubleshooting table.

### 3.6 Tests

- RPM imperial/metric; feed.
- Chip thinning at 10% stepover.
- Limit scaling recomputes the actual chip load.
- Reverse modes; tap feed; MRR.
- The worked example. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Speeds and Feeds Calculator – CNC RPM & Feed Rate` (49; 61 with the suffix → `absoluteTitle`) |
| Meta | `Free speeds and feeds calculator for CNC milling, routing and drilling. Get spindle RPM, feed rate (IPM or mm/min) and chip load from tool size and material.` (157) |
| H1 | `Speeds and Feeds Calculator: CNC Spindle RPM, Feed Rate and Chip Load` |
| BLUF | "RPM = (12 × SFM) ÷ (π × tool diameter), and feed rate = RPM × flutes × chip load. A 1/2-inch 3-flute end mill at 600 SFM runs 4,584 RPM; at 0.002 in per tooth that's a 27.5 IPM feed." (engine) |
| ToolShell pills | `Mill, router, drill & tap`, `Machine-limit scaling`, `Chip thinning`, `Inch or metric` |
| Links out | SFM ↔ RPM (#4), Pulley (#7), Thread Pitch / Tap Drill (#8), Steps per mm (#6) |
| Links in | SFM ↔ RPM, Pulley, Thread Pitch, Tools hub |

## 5. Content (~1,900–2,200 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the feeds and speeds calculator | 4 tabs | 120 |
| 2 | Spindle speed (RPM) from surface speed | Formula, 3.82 shortcut explained, example | 200 |
| 3 | How to calculate feed rate | Formula + example (`feed rate calculator`) | 200 |
| 4 | Chip load: what it is and why it matters | Reverse mode, rubbing vs overload (`chip load calculator`) | 200 |
| 5 | Chip thinning and high speed machining | Formula + example (`high speed machining`) | 200 |
| 6 | Speeds and feeds for CNC routers | Wood / plastic considerations; starting points from tool makers | 200 |
| 7 | Drill speeds and feeds | Feed per rev | 130 |
| 8 | Tapping feed rate | RPM × pitch; rigid tapping note (`tap calculator`) | 130 |
| 9 | Machine limits: when your spindle can't reach the RPM | Scaling example | 150 |
| 10 | Troubleshooting your cut | Our own table | 150 |
| 11 | FAQ | §6 | 400 |

## 6. FAQ (13, from the competitor question bank + cluster keywords)

1. How do you calculate spindle RPM from surface speed?
2. How do you calculate feed rate (IPM or mm/min)?
3. What is chip load, and how do I calculate it?
4. What if the calculated RPM is higher than my machine's maximum?
5. Why is my cut making dust, burning or chattering?
6. What chip load should I use for wood, MDF, acrylic and aluminum on a router? (cited preset or tool-maker chart)
7. How does carbide vs HSS or a coating change SFM? (cited only)
8. What is radial chip thinning (high speed machining)?
9. How do I calculate drilling feed per revolution?
10. How do I calculate tapping feed rate?
11. How do I convert SFM to m/min?
12. How does depth of cut change feeds, MRR and power?
13. Where do cutting-data charts come from, and can I trust them?

## 7. Done when

- [ ] `machining-engine.ts` + tests; `npm run verify` passes.
- [ ] Presets only with an approved, cited source (or custom-only); all values visible and editable.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`; no adult-slang terms.
- [ ] Registrations + docs; `graphify update .`.
