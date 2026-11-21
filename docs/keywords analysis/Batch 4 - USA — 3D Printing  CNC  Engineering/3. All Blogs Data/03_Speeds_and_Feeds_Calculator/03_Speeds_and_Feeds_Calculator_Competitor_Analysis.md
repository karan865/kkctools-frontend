# Speeds and Feeds Calculator (Milling, Drilling, Routing) — Competitor Analysis

> **Target page:** KKCTools `/speeds-and-feeds-calculator/` (Batch 4, Tier 1 #3)
> **Primary keyword:** `feeds and speeds calculator`: US 1,300 · KD 22 · CPC $3.00 (cluster 14 keywords, 10,790 US vol; 3,170 on KD ≤ 15)
> **SERP source:** ⚠ No Semrush SERP export for Batch 4. Competitors come from live web searches on 2026-11-14 (`feeds and speeds calculator`, `cnc router chip load calculator wood`). `TODO(owner): pull Google top 10.`
> **Pages visited:** 2026-11-14. Read: 7 (Omni, Calctool, Engineers Edge, Firgelli, GoodCalculators, Popular Woodworking, Twotrees). Blocked: 2 (Kennametal and Seco are JavaScript-only, so no content was returned).

---

## 0. How this was collected (read first)

- **Calculator sites:**
  - Omni (physics/speeds-and-feeds)
  - Calctool (the same Omni-family engine, by a different author)
  - GoodCalculators
  - Engineers Edge (a formula page that links to a separate calculator)
  - Firgelli (an engineering blog with a calculator)
- **Router/woodworking pages:**
  - Popular Woodworking (magazine article)
  - Twotrees (CNC router maker's blog)
- **Tool makers:** Kennametal, Seco, and Rigibore rank, but their calculators render with JavaScript and returned empty content. `TODO(owner)`: check these manually in a browser. They are the authority benchmark: metric/inch, operation types and disclaimers.
- **Other results not read:** everycalculators.com (many thin near-duplicate pages, e.g. "router bit chip load calculator" and "cnc router feeds and speeds calculator mm min") and pages.dev micro-sites. These look like programmatic thin pages, and we will not imitate that pattern.
- Arithmetic in every example was re-checked. Errors are listed in §4.
- No competitor text or tables are copied (AGENTS.md rule 8). Material SFM and chip-load presets must come from a source the owner approves (see §8.4).

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | omnicalculator.com/physics/speeds-and-feeds | Giant calc | Speeds and Feeds Calculator | 1,000–1,200 |
| 2 | calctool.org/rotational-and-periodic-motion/speeds-and-feeds | Calc site (Omni family) | Speeds and Feeds Calculator | ~950 |
| 3 | engineersedge.com/manufacturing/cutting-speeds-feeds.htm | Engineering reference | Machining Speeds and Feeds Equations & Calculator | 200–250 |
| 4 | firgelliauto.com/blogs/engineering-calculators/feeds-and-speeds-calculator-milling | Actuator maker blog | Feeds and Speeds Calculator — Milling | 2,000–2,500 |
| 5 | goodcalculators.com/speeds-feeds-calculator/ | Calc site | Speeds and Feeds Calculator | ~300 |
| 6 | popularwoodworking.com/techniques/feeds-speeds-for-cnc-routers/ | Woodworking magazine | Feeds & Speeds for CNC Routers | ~950 |
| 7 | twotrees3d.com/blogs/knowledge/cnc-router-physics-… | Router maker blog | CNC Router Physics: Spindle RPM, Feed Optimization, and Chip Load | 2,500–2,700 |
| — | kennametal.com …/speed-and-feed.html | Tool maker | Speed and Feed Engineering Calculator | **blocked (JS)** |
| — | secotools.com/article/how_to_calculate_safe_cutting_data | Tool maker | How to Calculate safe Cutting Data | **blocked (JS)** |

**What this tells us:**
- **The SERP splits into two audiences:**
  - Machinists (metal milling, drilling, turning), served by Omni, GoodCalculators, Engineers Edge and the tool makers.
  - Hobby CNC router users (wood, MDF, acrylic, aluminium on desktop machines), served by Popular Woodworking and Twotrees. Neither of these pages has a calculator.
  - **Nobody serves both well in one tool.**
- **Preset pages hide their numbers.** Omni and GoodCalculators both use Machinery's Handbook presets (26th and 28th editions) but never show the SFM or chip-load values. Users cannot see or check them.
- **No page reviewed has any of these:**
  - machine-limit scaling (max RPM or max feed)
  - chip-thinning correction
  - a tapping mode
  - a metric/imperial switch that covers every input
- **Quality is low.** Twotrees' main starting matrix is wrong in 6 of 10 rows, and Firgelli's MRR formula assumes a full-width slot.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Omni | Calctool | Eng. Edge | Firgelli | GoodCalc | Pop. WW | Twotrees |
|---|---|---|---|---|---|---|---|
| Working calculator on the page | ✅ | ✅ | ❌ (separate page) | ✅ | ✅ | ❌ | ❌ |
| RPM from SFM and diameter | ✅ | ✅ | ✅ formula | ✅ | ✅ | ❌ | ⚠️ text |
| Reverse: SFM from RPM | ❌ | ❌ | ✅ formula | ❌ | ❌ | ❌ | ❌ |
| Feed = RPM × flutes × chip load | ✅ | ✅ | ❌ | ✅ | ✅ | ⚠️ named only | ✅ |
| Reverse: chip load from feed | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ formula |
| Material presets | ✅ 11 (hidden values) | ✅ (hidden values) | ❌ | ⚠️ 5 SFM ranges, unsourced, used only as a check | ✅ 11 (hidden values) | ❌ | ⚠️ tables (with errors) |
| Tool material (HSS / carbide) | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Operations | ✅ 8 (drill, ream, bore, counterbore, end, face, slab, turn) | ✅ 8 | ⚠️ turning vs rotating tool | ❌ milling only | ✅ 8 | ❌ | ❌ |
| Router mode (wood, MDF, plastics) | ❌ | ❌ | ❌ | ⚠️ plastic SFM | ❌ | ⚠️ text | ⚠️ tables |
| Drilling feed per rev | ⚠️ via operation | ⚠️ | ❌ | ❌ | ⚠️ | ❌ | ❌ |
| Tapping (feed = RPM × pitch) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Min/avg/max range output | ✅ | ✅ | ❌ | ❌ | ✅ finish/rough | ❌ | ⚠️ |
| Machine max RPM / max feed limits | ❌ | ❌ | ❌ | ⚠️ FAQ advice only | ❌ | ⚠️ text (−1,000 rpm rule) | ❌ |
| Radial chip thinning | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| MRR (material removal rate) | ❌ | ❌ | ❌ | ⚠️ needs DOC, which isn't an input; assumes full width | ❌ | ❌ | ✅ formula |
| Power / torque estimate | ❌ | ❌ | ❌ | ⚠️ unsourced constant | ❌ | ❌ | ✅ formula |
| Metric / imperial | ⚠️ formulas only | ⚠️ | ✅ formulas | ❌ imperial only | ❌ imperial only | ❌ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Omni | Calctool | Eng. Edge | Firgelli | GoodCalc | Pop. WW | Twotrees |
|---|---|---|---|---|---|---|---|
| Formulas shown | ✅ | ✅ | ✅ (4) | ✅ | ✅ | ❌ ("previous page") | ✅ |
| Worked example | ✅ (checked) | ❌ | ❌ | ✅ 2 (checked) | ❌ | ❌ | ✅ (tables wrong) |
| Data source named | ✅ Machinery's Handbook 26th (citation list numbering broken) | ✅ MH 26th | ❌ | ❌ | ✅ MH 28th | ❌ | ❌ |
| Visible preset table | ❌ | ❌ | ❌ | ✅ (unsourced) | ❌ | ❌ | ✅ (errors) |
| Troubleshooting (dust vs chips, chatter, burning) | ❌ | ❌ | ❌ | ✅ FAQ | ❌ | ✅ | ✅ |
| Safety / "starting point only" disclaimer | ⚠️ | ⚠️ | ❌ | ✅ | ❌ | ⚠️ "test cut" | ✅ "test on scrap" |
| FAQ count | 0 | 0 | 0 | 6 | 0 | 0 | ~4 |
| Named author | ✅ + reviewer | ✅ | ❌ | ✅ (founder) | ❌ | ✅ | ❌ ("Expert View") |
| Date | ❌ | ✅ Aug 2022 | ❌ | ✅ Feb 2026 | ❌ | ✅ 2022 | ✅ Jun 2026 |

---

## 4. Competitor-by-competitor detail

### 1. Omni — Speeds and Feeds Calculator (the main benchmark)
- **Inputs:**
  - Preset or manual mode
  - Operation (8 options)
  - Tool material (HSS or carbide)
  - Workpiece material (11 presets: aluminium, two bronzes, brass, three cast irons, malleable iron, three steels)
  - Diameter and number of teeth
  - Optional custom RPM
  - In manual mode: min/max SFM and min/max chip load
- **Outputs:** min, average and max RPM, plus a feed range at the average or custom RPM.
- **Formulas:** N = 12V ÷ (πD) imperial; N = 60,000V ÷ (πD) with V in m/s; feed = N × chip load × teeth. All correct.
- **Example:** 0.5 in cutter at 600 SFM gives 4,584 RPM, and 2 flutes at 0.004 gives 36.7 IPM. **Checked correct.** The 600 SFM figure is not sourced.
- **Weak points:**
  - Preset values are hidden.
  - The citation list says "1 source" but starts at item 3.
  - The diameter unit isn't labelled.
  - No machine limits, no chip thinning, no FAQ.
  - Related links are off-topic (stairs, decking).

### 2. Calctool — Speeds and Feeds Calculator
- Same engine and operations as Omni, by author Luis Hoyos, updated Aug 2022, using Machinery's Handbook 26th (2000).
- **Weak points:**
  - No worked example and no FAQ.
  - Doesn't explain what to enter as "teeth" for single-point turning or boring tools.
  - Claims feed rate "gives the time" without needing a path length.
  - Typos ("speed and feeds or reamers", "curing tool").

### 3. Engineers Edge — Machining Speeds and Feeds Equations
- Four formulas in inch and metric: N = 12V/πD, N = 1000V/πD, V = πDN/12, V = πDN/1000. The calculator is on a separate page.
- **Weak points:**
  - No material data, no example, no author or date.
  - Unbalanced parentheses in the variable definitions.
  - Dead "copy text" link.

### 4. Firgelli — Feeds and Speeds Calculator, Milling
- **Inputs:** cutter diameter (in), SFM, flutes, chip load, and a material dropdown. The dropdown only shows an SFM range to check against and doesn't drive the result.
- **Material ranges (unsourced):**
  - aluminium 1,000–3,000
  - mild steel 100–300
  - stainless 50–200
  - brass 500–1,500
  - plastic 500–2,000 SFM
- **Outputs:** RPM, IPM and MRR.
- **Examples (checked):** 0.5 in, 1,000 SFM, 4 flutes, 0.003 gives 7,639 RPM, 91.67 IPM, and 4.58 in³/min at 0.1 in DOC. ✔. At 2,000 SFM and 0.005 chip load: 15,279 RPM and 305.6 IPM ✔.
- **Errors and weak points:**
  - MRR = IPM × D × DOC assumes a full-width slot. With partial radial engagement, MRR should use the radial width (WOC), so the page overstates it.
  - DOC is used in the formula but isn't an input.
  - Imperial only.
  - Unsourced rules of thumb: TiAlN "doubles or quadruples" SFM; 20% below max SFM "doubles tool life"; 0.3–2.0 HP per in³/min.
  - Promotes linear actuators.
- **FAQs (6):**
  1. RPM above the machine maximum
  2. Adjusting chip load
  3. Chatter and poor finish
  4. Coating vs SFM
  5. MRR vs power
  6. Different depths of cut

### 5. GoodCalculators — Speeds and Feeds Calculator
- **Inputs:**
  - 8 operations
  - 11 stock materials
  - HSS or carbide
  - teeth and diameter (inches)
- **Outputs:** RPM and a feed range (low = finish, high = roughing max, middle = roughing start).
- **Source:** Machinery's Handbook 28th (2008).
- **Weak points:**
  - Imperial only, no defaults.
  - Hidden preset values.
  - No example, FAQ, author or date.
  - Treats "teeth" and "flutes" as the same thing.
  - Rating links put the visitor's IP address in the URL, which is a privacy issue.

### 6. Popular Woodworking — Feeds & Speeds for CNC Routers (Chris Fitch, 2022)
- Gives router-user advice:
  - Fine dust means lower RPM, higher feed or fewer flutes; a rough cut means the reverse.
  - On a single-speed router, enter the stated speed minus 1,000 RPM.
  - Start at 18,500 RPM for small bits.
  - Keep DOC at or below half the bit diameter on hobby machines.
- **Weak points:**
  - Says the formulas are "on the previous page", so this page doesn't show them.
  - No chip-load values, no units, rules of thumb without sources.
  - Typos.

### 7. Twotrees — CNC Router Physics (router maker blog, June 2026)
- **Formulas:**
  - chip load = feed ÷ (RPM × flutes)
  - feed = CL × RPM × flutes
  - power = torque × RPM × 0.1047
  - MRR = W × D × feed
- **Examples:**
  - 0.002 × 18,000 × 2 = 72 IPM ✔
  - MRR 0.9 in³/min ✔
  - torque 0.21 and 0.16 N·m ✔
  - "24% torque drop" should be 25% under the page's own model.
- **Big errors:**
  - **6 of the 10 rows in the starting matrix don't follow from their own RPM × CL × 2.** Examples: hardwood 1/8 in is listed at 58 IPM but works out to 72; acrylic 1/8 in is listed at 77 but works out to 110; aluminium 1/8 in is listed at 31 but works out to 42.
  - The range tables don't state flute counts and don't match.
  - The intro chip-load ranges conflict with the tables.
  - Says single-flute is best for aluminium but uses 2-flute maths.
  - Contradicts itself on spindle power (100–200 W "adequate" vs 400 W "minimum").
  - Contains stray untranslated characters.
  - Claims a 1064 nm laser cuts acrylic cleanly, which is doubtful.

---

## 5. Patterns

- **Core maths that everyone uses:**
  - RPM = (12 × SFM) ÷ (π × D) ≈ 3.82 × SFM ÷ D (in)
  - Metric: RPM = (1000 × Vc) ÷ (π × D), with Vc in m/min and D in mm
  - Feed = RPM × z × fz
- **Maths no competitor offers (our advantage):**
  - **Chip thinning:** when the radial engagement ae < D/2, the adjusted fz = fz × D ÷ (2√(ae·D − ae²)). This is the usual RCTF form. `TODO(owner)`: confirm the formula source to cite.
  - **Machine-limit scaling:** if RPM_needed > RPM_max, then RPM = RPM_max. Feed scales with it, and the page shows the effective SFM. If feed > feed_max, cap it and show the actual chip load = feed ÷ (RPM × z).
  - **Drilling:** feed (IPM) = RPM × feed per rev.
  - **Tapping:** feed = RPM × pitch (in/rev = 1/TPI; metric pitch in mm).
  - **MRR** = WOC × DOC × feed (not D × DOC).
  - **Optional power:** P = MRR × unit power, with the unit-power values taken from a cited table.
- **Content patterns:** troubleshooting (dust vs chips, chatter, burning) appears only on the router and blog pages. Calculator pages offer only formulas.

| Section | Pages (of 7) |
|---|:---:|
| Formulas | 6 |
| Working calculator | 4 |
| Visible preset values | 2 (both unsourced or wrong) |
| Source named | 3 |
| Metric support in the calculator | **0** fully |
| Machine limits | **0** in the calculator |
| Chip thinning | **0** |
| Tapping | **0** |
| FAQ | 2 |

---

## 6. FAQ question bank

★ = asked on 2 or more pages or matches a cluster keyword. Map each answer to the cluster: feeds and speeds calculator, chip load calculator, drill speeds and feeds, tap calculator, high speed machining, cutting data, cutting speeds and feeds chart.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How do you calculate spindle RPM from surface speed? | Omni, Calctool, Eng. Edge, Firgelli, GoodCalc |
| 2 | ★ How do you calculate feed rate (IPM / mm/min)? | Omni, Calctool, Firgelli, GoodCalc, Twotrees |
| 3 | ★ What is chip load and how do I calculate it? | Twotrees, Pop. WW · `chip load calculator` |
| 4 | ★ What if the calculated RPM is higher than my machine's maximum? | Firgelli, Pop. WW |
| 5 | ★ Why is my cut making dust / burning / chattering? | Firgelli, Pop. WW, Twotrees |
| 6 | What chip load should I use for wood, MDF, acrylic and aluminium on a router? | Twotrees, router SERP |
| 7 | How does tool coating or carbide vs HSS change SFM? | Firgelli, Omni |
| 8 | What is radial chip thinning (high speed machining)? | none · `high speed machining` |
| 9 | How do I calculate drill feed per revolution? | none · `drill speeds and feeds` |
| 10 | How do I calculate tapping feed rate? | none · `tap calculator` |
| 11 | What is SFM vs m/min, and how do I convert? | Eng. Edge |
| 12 | How does depth of cut change feeds (MRR, power)? | Firgelli, Twotrees |
| 13 | Where do cutting data charts come from, and can I trust them? | `cutting data`, `cutting speeds and feeds chart` |

---

## 7. Gaps nobody fills: our opportunities

1. **One tool with four modes:** metal milling, CNC router (wood, MDF, plastic, aluminium), drilling and tapping.
2. **Visible, sourced preset table.** Show the SFM and chip-load ranges we use, name the source, and keep every value editable. Competitors hide theirs or get them wrong.
3. **Machine limits:** max RPM and max feed, then scale and show the real chip load and SFM. The keyword file requires this, and nobody has it.
4. **Radial chip-thinning correction**, explained and calculated (`high speed machining`, 880 vol, rising).
5. **Full metric and imperial switch** for every input and output: SFM ↔ m/min, IPM ↔ mm/min, in/tooth ↔ mm/tooth.
6. **Reverse modes:** chip load from a known feed, and SFM from a known RPM.
7. **Correct MRR** (WOC × DOC × feed) and an optional power estimate with its source.
8. **Router troubleshooting table:** dust, burning, chatter, fuzzy edges → what to change. We write this ourselves.
9. **Correct worked examples** (Twotrees' matrix errors, Firgelli's MRR assumption).
10. **Clear "starting point" disclaimer** and a test-cut workflow (start low, then increase).
11. **Links to the SFM ↔ RPM tool (#4) and the Thread Pitch / Tap Drill tool (#8)** for tapping.

---

## 8. Blueprint for the KKCTools Speeds and Feeds Calculator

### 8.1 SEO

- **URL:** `/speeds-and-feeds-calculator/`
- **Title:** Speeds and Feeds Calculator – CNC RPM & Feed Rate
- **H1:** Speeds and Feeds Calculator: CNC Spindle RPM, Feed Rate and Chip Load
- **Meta:** as in the Batch 4 keyword file (157 chars).
- **H2s mapped to the cluster:** chip load calculator · drill speeds and feeds · tap calculator · high speed machining (chip thinning) · cutting speeds and feeds chart · cutting data.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Units | Imperial ↔ metric for all fields |
| Mode | Milling · Router · Drilling · Tapping |
| Tool | Diameter, flutes/teeth, tool material (HSS, carbide), optional coating note (no unsourced multipliers) |
| Material | Preset (SFM and chip-load range from a cited table, values shown) or custom SFM / Vc and chip load |
| Engagement | WOC (radial) and DOC (axial): chip-thinning toggle, MRR |
| Machine | Max RPM, max feed, optional min RPM (routers often 10k–24k): scaling plus a warning |
| Drilling | Feed per rev → IPM |
| Tapping | TPI or metric pitch → feed = RPM × pitch, with a rigid-tap note |
| Reverse | Chip load from feed and RPM; SFM from RPM |
| Outputs | RPM, feed (IPM, mm/min), actual chip load, effective SFM, MRR, warnings (over-limit, chip too thin = rubbing) |
| UX | Share URL, printable setup card, copy values, no network |

### 8.3 Content outline (≈ 1,800–2,200 words, original)

1. Intro (primary keyword) and a "starting values, test-cut first" note
2. How to use the calculator
3. Spindle speed from surface speed, with imperial and metric examples
4. Feed rate and chip load, with an example and the reverse formula
5. Speeds and feeds chart by material (sourced, ranges)
6. CNC router feeds and speeds for wood, MDF, plastic and aluminium (sourced)
7. Machine limits: what to do when your spindle can't reach the RPM
8. Radial chip thinning and high-speed machining
9. Drill speeds and feeds (feed per rev)
10. Tapping feed rate
11. MRR and depth of cut
12. Troubleshooting: dust, burning, chatter, poor finish
13. FAQ (10–12)
14. Related tools: SFM ↔ RPM (#4), Thread Pitch / Tap Drill (#8), Pulley Ratio (#7, belt-driven spindles), Stepper Steps-per-mm (#6)

### 8.4 Quality checks

- Unit tests:
  - RPM (both unit systems)
  - feed, reverse chip load
  - chip-thinning factor
  - machine-limit scaling
  - drilling, tapping, MRR
- Re-check every example on the page by test (fixtures).
- Presets live in a static, dated data file with a source field. No network calls.
- No competitor wording or tables copied. `npm run check:no-network` passes.
- `TODO(owner)`:
  - pull the Google top-10 SERP
  - check the Kennametal and Seco calculators manually (they are JavaScript-only)
  - **approve the preset data source** (Machinery's Handbook edition or a tool maker's published chart) and the chip-thinning formula reference
