# Thread Pitch Diameter & Tap Drill Calculator — Competitor Analysis

> **Target page:** KKCTools `/thread-pitch-diameter-calculator/` (Batch 4, Tier 3 #8)
> **Primary keyword:** `pitch diameter` — US 1,300 · KD 10 · CPC $0.00 (2-keyword cluster, 1,620 US vol, all KD ≤ 15)
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 4. Competitors come from a live web search for `pitch diameter calculator thread` on 2026-11-14. `TODO(owner): pull Google top 10 for "pitch diameter". Gear "pitch diameter" pages and definitions are likely mixed in.`
> **Pages visited (2026-11-14):** 5 read (Omni, Firgelli, Carr Lane, CJWinter, AmesWeb). EngineeringTechnology.org was partly read: the body was cut off and only the title and menu were confirmed. Engineers Edge (ns2 mirror) was noted but not read.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Giant calculator site: Omni, ISO metric only.
  - Engineering blog: Firgelli, metric and imperial.
  - Workholding maker: Carr Lane, multi-standard.
  - Thread-rolling maker: CJWinter, which gives pitch and blank diameter.
  - Engineering reference: AmesWeb, with ISO 724 / ISO 965 limits.
  - Three-wire method page: EngineeringTechnology.org.
  - Engineers Edge, with several pitch-diameter and pitch-circle calculators.
- **Ambiguity:** "pitch diameter" also means a **gear** pitch diameter (Omni's FAQ touches on it) or a **sprocket/pulley** pitch diameter. Our page should say once that it is about screw threads and link to the pulley tool (#7).
- **Standards rule (keyword file):** tolerance classes (2A/2B, 6g/6H) need ASME B1.1 / ISO 965 tables, which we cannot copy. **Show basic sizes from formulas only, and say so.**
  - Omni and AmesWeb compute ISO 965 limits from the published tolerance formulas.
  - `TODO(owner)`: decide whether computing limits from the published formulas, rather than copying tables, is acceptable. The default is basic sizes only.
- Formulas were re-checked against the 60° basic profile (H = 0.866025P). **Firgelli's formulas are wrong** (see §4). No competitor text is copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | omnicalculator.com/construction/pitch-diameter | Giant | Pitch Diameter Calculator | ~1,300 |
| 2 | firgelliauto.com/blogs/engineering-calculators/thread-pitch-calculator-metric-and-imperial | Actuator maker blog | Thread Pitch Calculator — Metric and Imperial | 1,300–1,500 |
| 3 | carrlane.com/…/thread-calculator | Workholding maker | Carr Lane Mfg. Thread Calculator | 750–800 |
| 4 | cjwinter.com/pitch-diameter | Thread-rolling maker | Pitch & Blank Diameter Calculator | ~200 |
| 5 | amesweb.info/Screws/metric-thread-dimensions-calculator.aspx | Engineering reference | Metric Thread Dimensions Calculator (ISO 724 / ISO 965) | ~1,000 |
| 6 | engineeringtechnology.org (Pitch Diameter – Three Wire Method) | Education site | Pitch Diameter Calculator – Three Wire Method | **body not extracted** |

**What this tells us:**
- **Omni is the quality benchmark:**
  - ISO metric 60° only, with pitch dropdown 0.2–6 mm.
  - Tolerance grade 3–9 and position e/f/g/h, giving max and min d₂.
  - Formulas d₂ = d − 0.6495P and Td2 = 90·P^0.4·d^0.1 × k.
  - Examples M25×1.5-6g and M30×2-6h check out, apart from a 0.002 mm difference on one minimum.
  - **Gaps:** no UN, no Acme, no tap drill, no three-wire check.
- **Firgelli ranks with wrong geometry:**
  - It uses pitch diameter = D − 0.866P. The correct formula is D − 0.6495P.
  - It uses minor diameter = D − 1.732P. The correct values are d₃ = D − 1.2269P and D₁ = D − 1.0825P.
  - For M10×1.5 it gives d₂ = 8.701; the correct value is **9.026**.
- **No single page covers all of these:**
  - UN + metric + Acme
  - basic pitch, minor and major diameters
  - tap drill for a % thread
  - three-wire best-wire size and measurement
  - Carr Lane claims most of this but shows no formulas, and its pitch-diameter definition is wrong ("passes through the crest").

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Omni | Firgelli | Carr Lane | CJWinter | AmesWeb | EngTech |
|---|---|---|---|---|---|---|
| ISO metric 60° | ✅ | ✅ (wrong formulas) | ✅ | ✅ | ✅ | ? |
| Unified (UNC/UNF/UN) | ❌ | ⚠️ (sizes not listed) | ✅ | ✅ (#2–2¼") | ❌ | ? |
| Acme 29° / trapezoidal 30° | ❌ | ❌ | ✅ | ❌ | ❌ (separate trapezoidal page) | ❓ |
| Buttress / other | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Basic pitch diameter d₂ | ✅ correct | ❌ **wrong** | ✅ claimed | ⚠️ max/min only | ✅ | ? |
| Minor diameter (external d₃ / internal D₁) | ❌ | ❌ **wrong** | ✅ claimed | ❌ | ✅ | ❌ |
| Fundamental height H / thread depth | ✅ H | ⚠️ mislabels H as depth | ❌ | ❌ | ✅ | ❌ |
| Tolerance limits (6g/6H, 2A/2B) | ✅ ISO 965 from formula (external) | ⚠️ unsourced ± values | ⚠️ | ✅ max/min (class unstated) | ✅ ISO 965 classes | ❌ |
| Tap drill for % thread | ❌ | ❌ (separate page) | ✅ claimed | ❌ | ❌ | ❌ |
| Thread rolling blank diameter | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Three-wire best-wire size | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (title) |
| Pitch diameter from measurement over wires (M) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (title) |
| Pitch ↔ TPI | ⚠️ | ✅ | ✅ | ⚠️ | ❌ | ❌ |
| Length of engagement | ❌ | ❌ | ✅ claimed | ❌ | ❌ | ❌ |
| Tensile stress area | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ (Engineers Edge has a pitch-circle page) |
| Custom size/pitch | ✅ | ⚠️ preset list | ✅ | ❌ list | ✅ custom mode | ? |
| Thread diagram | ✅ | ✅ visualiser | ❌ | ⚠️ SVG | ❌ | ? |

---

## 3. Feature matrix — content and trust

| Item | Omni | Firgelli | Carr Lane | CJWinter | AmesWeb |
|---|---|---|---|---|---|
| Formulas shown | ✅ (render garbled) | ✅ (**wrong**) | ❌ | ❌ | ✅ basic |
| Worked examples | ✅ 2 (checked) | ✅ 2 (wrong values) | ❌ | ❌ | ❌ |
| Standard named | ✅ ISO | ⚠️ vague | ⚠️ "ANSI/ISO/DIN" | ❌ | ✅ ISO 68-1/724/965/1502… |
| Correct definition of pitch diameter | ✅ | ⚠️ | ❌ ("through the crest") | ❌ | ✅ |
| Measuring guidance | ⚠️ calipers (poor) | ⚠️ gauges | ❌ | ❌ | ❌ |
| FAQ count | ~5 | ~6 | 0 | 0 | 2 |
| Named author | ✅ + 2 reviewers | ✅ | ❌ | ❌ | ❌ |
| Date | ❌ | ✅ Feb 2026 | ❌ | ❌ | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. Omni — Pitch Diameter Calculator (Kenneth Alambra; reviewed by Wojciech Sas PhD and Steven Wooding)
- **Inputs:**
  - Pitch: 0.2–6 mm dropdown.
  - Basic major diameter.
  - External tolerance grade 3–9.
  - Position e/f/g/h.
  - The internal-thread inputs are not clearly exposed.
- **Outputs:** basic, max and min d₂, plus es, Td2 and H.
- **Formulas:** d₂ = d − 0.6495P (3√3/8) ✔. H = √3/2·P ✔. Deviations and Td2 = 90·P^0.4·d^0.1/1000 × k ✔.
- **Examples:**
  - M25×1.5-6g: d₂ = 24.026 ✔, max 23.994 ✔. The minimum is shown as 23.850, but the formula gives ≈ 23.848 (a 0.002 mm difference).
  - M30×2-6h: 28.701 / 28.534 ✔.
- **FAQs (~5):**
  - gear pitch diameter
  - a 20 × 1.5 example (19.026 ✔)
  - internal formula (minor + 0.4330P ✔)
  - measuring with calipers (weak advice)
  - pitch diameter limits
- **Weak points:** metric only; no tap drill or three-wire method; formula rendering is garbled; units placed inside exponents.

### 2. Firgelli — Thread Pitch Calculator (Robbie Dickson, Feb 2026) — **formulas wrong**
- **Inputs:** Metric (M3×0.5 to M20×2.5) or Imperial (UN). Outputs major, minor and pitch diameter, depth and TPI.
- **Errors:**

| Quantity | Firgelli | Correct (60° basic) |
|---|---|---|
| Pitch diameter | D − 0.866P | **D − 0.649519P** |
| Minor diameter | D − 1.732P | d₃ = D − 1.226869P (ext) · D₁ = D − 1.082532P (int) |
| "Thread depth" | 0.866P (this is H) | engagement ≈ 0.6134P (ext h₃) / 0.5413P (int H₁) |
| M10×1.5 d₂ | 8.701 | **9.026** |
| M10×1.5 minor | 7.402 | d₃ 8.160 · D₁ 8.376 |
| M6×1.0 d₂ | 5.134 | **5.350** |

- **Other weak points:** unsourced tolerances ("±0.02 mm", "±0.0008 in"); the tap drill is on another page.
- **Takeaway:** it ranks, so the errors are a clear opportunity. Our page can include a short "common formula mistakes" note without naming them.

### 3. Carr Lane — Thread Calculator
- **Claims:**
  - Covers Unified, Metric, Acme, Buttress and others.
  - Outputs basic, minor and pitch diameter, tap drill and length of engagement.
- **Not checkable:** the calculator body did not render in the extract.
- **Errors:**
  - Defines pitch diameter as a cylinder "through the thread's crest". It is actually where thread and groove widths are equal.
  - Says pitch diameter is "denoted by M".
  - Contradicts itself on metric TPI versus pitch.
  - Typo ("Ho do I").
- **Weak points:** no formulas, examples or standards cited.

### 4. CJWinter — Pitch & Blank Diameter Calculator (thread rolling)
- **Inputs:** size from a list (M1–M56, #2–#12, ¼–2¼"), then pitch.
- **Outputs:** max/min pitch diameter and the recommended blank diameter.
- **Weak points:** no formulas, standard or class; output units unstated; "general information only" disclaimer.

### 5. AmesWeb — Metric Thread Dimensions (ISO 724 / ISO 965)
- **Modes:** custom d and P, or a standard M1–M64 list.
- **Tolerance classes:** external 6e/6f/6g/4h, internal 5H/6H/7H/6G.
- **Outputs:** H, d₂, d₁, plus limit tables (d, d₂, d₃, C, R; D, D₂, D₁).
- **References cited:** ISO 68-1, 724, 965-1, 1502, 262, 898-1, BS 3643-1.
- **Weak points:**
  - The size range text (M1.6) contradicts the list (M1).
  - d₁ and d₃ notation is mixed.
  - Tolerance values are not shown.
  - Two short FAQs; no example, author or date.

### 6. EngineeringTechnology.org — Pitch Diameter, Three Wire Method
- **Confirmed:** the title, and a sibling page "Thread Wire Calculator – Best Wire Size". The page body was not extracted. `TODO(owner)`: check it in a browser.
- **Reference formulas (60°):** best wire W = 0.57735P. E = M − 3W + 0.86603P.

---

## 5. Patterns

- **60° basic profile (UN and ISO metric):**
  - H = 0.866025P.
  - Pitch diameter d₂ = d − 0.649519P.
  - External minor (ISO, rounded root) d₃ = d − 1.226869P.
  - Internal minor D₁ = d − 1.082532P.
  - UN basic minor (internal) = d − 1.082532P.
  - Imperial pitch P = 1/TPI.
- **Acme 29° (general purpose):**
  - Basic pitch diameter = d − 0.5P.
  - Basic thread height = 0.5P.
  - Metric trapezoidal 30°: d₂ = d − 0.5P.
- **Tap drill for % thread:**
  - Imperial: drill ≈ D − (0.01299 × %thread ÷ TPI).
  - Metric: drill ≈ D − (%thread × P ÷ 76.98).
  - At 100%, the drill equals the basic internal minor (D − 1.0825P).
  - **Formula-derived only; no copied drill charts.** Show the nearest common drill sizes from a list we generate ourselves (fractional, number/letter, metric 0.1 mm steps).
  - `TODO(owner)`: approve generating the number/letter drill list from published decimal equivalents. This is a factual dataset; cite it.
- **Three-wire method (60°):**
  - Best wire W = 0.57735P; the usable range is about 0.505P–1.010P.
  - E = M − 3W + 0.86603P.
  - Predicted M for a target E = E + 3W − 0.86603P.
  - Acme (29°): W_best = 0.51645P. E = M − 4.9939W + 1.9333P (approx.). `TODO(owner)`: confirm the formula source before shipping the Acme wire mode.

| Section | Pages (of 6) |
|---|:---:|
| Metric | 5 |
| Unified | 3 |
| Acme | 1 (claimed) |
| Correct basic d₂ | 3 |
| Tolerance limits | 3 |
| Tap drill % | 1 (claimed) |
| Three-wire | 1 |
| Worked example | 2 (one wrong) |

---

## 6. FAQ question bank

★ = asked on 2 or more pages, or a cluster keyword. Map to: pitch diameter, how it pitch diameter measured acme threads (FAQ only; the keyword has broken grammar).

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is pitch diameter of a thread? | Omni, Carr Lane (wrong), AmesWeb · `pitch diameter` |
| 2 | ★ How do you calculate pitch diameter (formula)? | Omni, Firgelli (wrong), AmesWeb |
| 3 | ★ What is the difference between major, minor and pitch diameter? | Firgelli, Carr Lane, CJWinter |
| 4 | ★ How do I measure pitch diameter (three-wire method)? | EngTech, Omni (calipers) |
| 5 | How is pitch diameter measured on Acme threads? | `how it pitch diameter measured acme threads` |
| 6 | What tap drill size do I need for a given % thread? | Carr Lane (claimed) |
| 7 | What do 6g/6H and 2A/2B mean? | Omni, AmesWeb |
| 8 | Pitch vs TPI: how do I convert? | Firgelli |
| 9 | What is the blank diameter for rolled threads? | CJWinter |
| 10 | Thread pitch diameter vs gear pitch diameter | Omni FAQ, SERP ambiguity |
| 11 | Why are my calculated values different from the chart? (basic vs limits) | — |

---

## 7. Gaps nobody fills — our opportunities

1. **One tool for UN + ISO metric + Acme/trapezoidal.** Each mode outputs basic major, pitch and minor diameters (internal and external), H and thread height.
2. **Correct, shown formulas.** A ranking competitor uses wrong ones, and our worked examples would be the correct reference (M10×1.5 → d₂ 9.026).
3. **Tap drill for a chosen % thread** (default 75%), the nearest standard drills and their resulting % thread. Uses a self-generated drill list.
4. **Three-wire helper:** best wire size and range, and either the target "measurement over wires" or the pitch diameter from a measured M.
5. **Clear basic-vs-tolerance statement.** We show basic sizes and explain what 2A/2B and 6g/6H mean, without copying ASME/ISO tables (keyword-file rule).
6. **Pitch ↔ TPI converter** and common-size quick pick (sizes are factual designations).
7. **SVG thread-profile diagram** labelling d, d₂, d₁/d₃, P, H. This is our own design.
8. **Disambiguation:** thread vs gear vs pulley pitch diameter, with a link to Pulley (#7).
9. **Link to Speeds and Feeds tapping mode (#3).**

---

## 8. Blueprint for the KKCTools Thread Pitch Diameter & Tap Drill Calculator

### 8.1 SEO

- **URL:** `/thread-pitch-diameter-calculator/`
- **Title:** Thread Pitch Diameter Calculator – UN & Metric
- **H1:** Thread Pitch Diameter Calculator: UN, Metric and Acme Threads
- **Meta:** as in the keyword file (151 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Standard | UN (inch, TPI) · ISO metric (mm, P) · Acme 29° · Trapezoidal 30° |
| Inputs | Major diameter (or size pick), pitch/TPI, thread type (internal/external) |
| Outputs | Basic pitch diameter, minor diameters (d₃, D₁), H, thread height, pitch ↔ TPI |
| Tap drill | % thread (default 75) → ideal drill; nearest fractional/number/letter/metric drills with resulting % |
| Three-wire | Best wire, min/max wire; target M for d₂, or d₂ from measured M |
| Limits | Not shown by default. Note explains 2A/2B, 6g/6H and points to ASME B1.1 / ISO 965 (`TODO(owner)` decision) |
| UX | Diagram, inch ↔ mm, copy and share URL, no network |

### 8.3 Content outline (≈ 1,300–1,600 words, original)

1. Intro (primary keyword): correct definition, with diagram
2. How to use
3. Pitch diameter formula for 60° threads (UN and metric), with examples
4. Major, minor and pitch diameter explained
5. Acme and trapezoidal threads
6. Tap drill size and % thread, with an example
7. Measuring pitch diameter with three wires (and Acme)
8. Basic sizes vs tolerance classes (2A/2B, 6g/6H)
9. Thread vs gear pitch diameter
10. FAQ (10)
11. Related tools: Speeds and Feeds tapping (#3), Pulley (#7), SFM ↔ RPM (#4)

### 8.4 Quality checks

- Unit tests:
  - every standard's basic dimensions (M10×1.5 → 9.026 / 8.376 / 8.160; ¼-20 UNC → d₂ 0.2175 in)
  - tap drill % (both systems)
  - three-wire formulas (both directions)
- The drill list lives in a static data file with its source noted. No network calls.
- No ASME/ISO tables copied. No competitor wording. `npm run check:no-network` passes.
- `TODO(owner)`:
  - pull Google top 10
  - decide on the limits policy
  - confirm Acme three-wire formula source
  - check EngineeringTechnology and Engineers Edge manually
