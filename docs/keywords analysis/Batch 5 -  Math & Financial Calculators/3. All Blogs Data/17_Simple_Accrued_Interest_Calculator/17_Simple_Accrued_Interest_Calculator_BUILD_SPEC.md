# Simple & Accrued Interest Calculator — Build Spec

> **URL:** `/simple-interest-calculator/` · Batch 5 · Tier 2 · rank chance 🟡 · **Build order 15**
> **Read first:** `../00_BATCH5_BUILD_RULES.md` (§3 date-diff-engine, §2.5 finance-light)
> **Inputs used:**
> - `17_Simple_Accrued_Interest_Calculator_Competitor_Analysis.md` (6 pages read; Investopedia not fetchable; Omni 404; 2026-11-14)
> - keyword file §2 #17
>
> **SERP:** provisional
> **Written:** 2026-11-22 (full rewrite after the research pass)

---

## 0. Strategy

**Keywords:**
- `accrued interest`: 4,400 at KD 13. It is an **informational head**, so the page opens with the definition, then the date tool.
- `calculate interest`: 2,400 at KD 9, rising.
- `simple interest equation`: 2,900 at KD 24.

**The gap:** the accrued-interest search returned **no standalone calculator**, only documentation (Sheets ACCRINT, MathWorks, DAX, Carta, PropertyMetrics, TVMCalcs).
- No page offers **accrued interest between two dates with a day-count choice**.
- The simple-interest calculators (CalculatorSoup, Calculator.net, Inch, Calculate.co.nz) take durations, not dates.
- CalculatorSoup's 360 option isn't explained.

**Accuracy edge:**
- PropertyMetrics' Act/360 total doesn't reconcile with its stated payment.
- A snippet figure ("$972.22 vs $958.90") **wasn't found on its page**, so we don't cite it.

**Finance-light:** the user enters every rate; no advice.

## 1. Keywords and placement

| Role | Keyword | US vol | KD | Trend | Where it goes |
|---|---|---:|---:|:---:|---|
| **Primary** | accrued interest | 4,400 | 13 | | **First sentence = definition** ("Accrued interest is interest that has been earned but not yet paid"), H2 "What is accrued interest?", Accrued tab heading |
| Secondary | calculate interest | 2,400 | 9 | ↑ | Intro + H2 "How to calculate interest for any number of days" |
| Secondary | simple interest equation | 2,900 | 24 | ⚠ declining | H2 "Simple interest equation (I = P × r × t)" |
| Natural | simple interest calculator · day count convention · 30/360 · actual/360 · bond accrued interest | — | — | | Title, H1, Compare tab, Bond tab |

## 2. Our edge (6 pages checked)

| Feature | Competitors with it |
|---|---|
| I = Prt | 4/6 |
| **Start and end dates** in a calculator | **0** |
| **Day-count choice:** Act/365, Act/360, 30/360 US, 30E/360, Act/Act | 1 (365/360 only, unexplained) |
| **Compare all conventions side by side** (why Act/360 costs more) | 0 (articles only) |
| **Bond accrued interest** (face, coupon, frequency, last coupon, settlement) | 0 (Excel docs only) |
| Solve for I, P, r, t or A; optional period schedule | 1/6 |
| Excel/Sheets formulas with the user's values (YEARFRAC, DAYS360, ACCRINT) | 0 |
| Simple vs compound comparison (link live Compound Interest) | 3/6 |
| Correct definition first | 1/6 |

## 3. Calculator spec

### 3.1 Tabs

1. **Accrued between dates** (default; matches the primary)
2. **Simple interest solver**
3. **Bond accrued interest**
4. **Compare day counts**

### 3.2 Input guide diagram (above the inputs)

`InterestInputGuide.tsx`: a timeline.
- "1 Principal" coin stack at "3 Start date".
- A **straight** line of equal daily steps (no curve; this is simple, not compound) labelled "2 Annual rate %".
- The line runs to "4 End date". A "5 Day count" badge shows the days counted and the year basis (365/360).
- **Bond tab:** a bond certificate with coupon dates on the line, "last coupon" and "settlement" markers, and the accrued slice shaded.

### 3.3 Inputs (defaults = examples)

| Tab | Default |
|---|---|
| Accrued | $10,000 · 5% · 2026-01-15 → 2026-04-15 · Act/365 |
| Solver | P $10,000 · r 5% · t 3 years (days/weeks/months/years or dates) |
| Bond | face $1,000 · coupon 5.75% · semi-annual · last coupon + settlement date · 30/360 |
| Compare | same dates, all conventions |

### 3.4 Engine (`src/lib/date-diff-engine.ts` day counts + `simple-interest-engine.ts`)

```ts
I = P·r·t ; A = P + I ; solve P = I/(rt), r = I/(Pt), t = I/(Pr)
τ(start, end, basis):
  Act/365 = days/365 ; Act/360 = days/360
  30/360 US = (360(Y2−Y1) + 30(M2−M1) + (D2−D1))/360 with US EOM rules (D1=31→30; D2=31 and D1≥30 → 30; Feb end rules)
  30E/360 = same, with any 31 → 30 ; Act/Act ISDA = split by year
accrued = P·r·τ ; daily = P·r/basis
bond: AI = face × coupon/freq × (days since last coupon / days in period) [basis-aware]
excel strings: '=YEARFRAC(B2,C2,basis)', '=DAYS360(B2,C2)', '=ACCRINT(...)'
```

**Worked examples (checked 2026-11-22):**

| Case | Result |
|---|---|
| Simple interest: $10,000 at 5% for 3 years | **$1,500** (total $11,500) |
| Accrued 2026-01-15 → 2026-04-15 (90 actual days) | **$123.29** on Act/365 · **$125.00** on Act/360 · **$125.00** on 30/360 (90 days) |
| Bond fixture (from the TVMCalcs re-check): $1,000 face, 5.75% semi-annual, 61 of 360 days | **$9.74** (61/360 × $57.50) |

`TODO(owner)`: confirm the "typical use" of each convention against a primary source (ISDA / SIFMA / Excel docs), or publish the rules only.

### 3.5 Outputs

- **Headline:** accrued interest (or the solved value).
- **Sentence:** "Between 15 January and 15 April 2026 (90 days), $10,000 at 5% accrues $123.29 on an actual/365 basis, or $125.00 on actual/360."
- Days counted, τ, daily accrual.
- Comparison table (all conventions).
- Excel/Sheets formula box.
- **Simple vs compound line:** "Compounded monthly, the same 3 years would earn $1,614.72" (via the live `tvm-engine`).
- Copy, Share URL.

### 3.6 Tests

- Each day-count convention, including month-end and February cases (30/360 US EOM rules).
- Act/Act across a year boundary.
- Bond fixture $9.74.
- Solver round-trips.
- The examples above. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Simple Interest Calculator – Accrued Interest` (45; 57 with the suffix: OK) |
| Meta | `Free simple interest calculator. Get interest on a principal for any number of days, months or years, and the accrued interest between two dates.` (145) |
| H1 | `Simple Interest Calculator: Interest and Accrued Interest by Day` |
| BLUF | "Accrued interest is interest earned but not yet paid. Simple interest = principal × rate × time: $10,000 at 5% for 3 years is $1,500. Between 15 January and 15 April 2026 it accrues $123.29 on actual/365, or $125.00 on actual/360." (engine) |
| ToolShell pills | `Accrued between two dates`, `5 day-count conventions`, `Bond accrued interest`, `Excel formulas` |
| Links out | Compound Interest (live), CAGR (#6), Present Value (live), Credit Card Payoff (live), Days Between Dates (Batch 8, when built) |
| Links in | Compound Interest (add "simple interest" link), CAGR, Tools hub "Growth" |

## 5. Content (~1,500–1,800 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | What is accrued interest? | Definition (primary): loans, deposits, bonds; accrued vs paid | 180 |
| 2 | How to use the calculator | 4 tabs | 100 |
| 3 | Simple interest equation (I = P × r × t) | Example + solving for P, r or t | 180 |
| 4 | How to calculate interest for any number of days | Daily accrual (`calculate interest`) | 150 |
| 5 | Day-count conventions explained | Table: Act/365, Act/360, 30/360, 30E/360, Act/Act | 220 |
| 6 | Accrued interest between two dates | Engine example + comparison | 150 |
| 7 | Accrued interest on a bond | $9.74 example | 150 |
| 8 | Accrued interest in Excel and Google Sheets | YEARFRAC, DAYS360, ACCRINT | 130 |
| 9 | Simple vs compound interest | Link Compound Interest | 120 |
| 10 | FAQ | §6 | 380 |

## 6. FAQ (10, from the question bank)

1. What is accrued interest?
2. What is the simple interest equation (I = Prt)?
3. How do I calculate interest for a number of days?
4. Simple vs compound interest: what's the difference?
5. What's the difference between 30/360, actual/360 and actual/365?
6. How do I calculate accrued interest on a bond?
7. How do I calculate accrued interest in Excel or Google Sheets?
8. Why does actual/360 cost more interest?
9. How do I find the rate or time from the interest?
10. Is accrued interest the same as interest paid?

## 7. Done when

- [ ] Day-count functions + `simple-interest-engine.ts` + tests (incl. EOM cases, the bond fixture); `npm run verify` passes.
- [ ] Definition in the first sentence; InputGuide above the inputs; ToolShell + TabSlider + fonts + `<main>`.
- [ ] Convention "typical use" lines cited or removed.
- [ ] Registrations + docs; `graphify update .`.
