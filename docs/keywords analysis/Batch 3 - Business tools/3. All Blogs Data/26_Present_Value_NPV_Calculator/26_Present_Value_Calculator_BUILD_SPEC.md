# Present Value & NPV Calculator — Build Spec

> **URL:** `/present-value-calculator/` · Batch 3 **Part 3** (tools removed in the SERP check, built on owner request) · **Part 3 build order 1**
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + 2 + **Part 3 §12–13**)
> **Inputs used:** `26_Present_Value_NPV_Calculator_Competitor_Analysis.md`, `KKCTools_Batch3_Final_Tool_Keywords.md` §2b (SERP), Semrush exports (keyword rows below)
> **Written:** 2026-11-20

---

## 0. Strategy note (read first)

**The head term is not our target for now.** The keyword file removed `present value calculator` (8,100, **KD 50**): Calculator.net 90, Stanford 84, Investopedia 91, Omni 84 and CalculatorSoup 80 hold it.

**Target the formula and table long tail first.** In the exports it is weakly served and not YMYL:

| Keyword | US vol | KD |
|---|---:|---:|
| `pv formula` | 2,400 | 14 |
| `present value discount tables` | 1,300 | 9 |
| `pv of annuity` | 720 | 12 |
| `present value table` · `pv table` | 1,900 · 1,900 | 21–23 |

**The PV table is a strong angle:**
- It's engine-generated, rates 1–20% × periods 1–50.
- It's printable, students and accountants search for it, and no competitor generates one for the user's own rate range.

**Excel intent is real.** Excel's NPV treats the first value as period 1, a classic mistake. Show the fixed formula.

Build it as a calculator + formula guide + tables page. Revisit the head term once the site has links.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary (now)** | pv formula | 2,400 | 14 | H2 at the very top ("PV formula") + first sentence |
| Secondary | present value discount tables · present value table · pv table | 1,300 · 1,900 · 1,900 | 9–23 | "Present value table" tab + H2 + print |
| Secondary | pv of annuity | 720 | 12 | Annuity tab + H2 |
| Secondary | how to calculate npv | 1,900 | 29 | NPV tab + H2 "How to calculate NPV" |
| Head (long-term) | present value calculator | 8,100 | 50 | title + H1 (still the page's name) |
| Natural phrases | npv calculator · npv formula · present value formula · discount factor | — | — | H2s, FAQ |

## 2. Our edge (from the competitor analysis)

- **One tool, five tabs:** PV lump sum · PV annuity (ordinary/due, growing, perpetuity) · uneven cash flows · NPV/IRR · **PV table**. Competitors split this over 3+ URLs; **0** have PV + NPV together.
- **NPV + IRR + profitability index + discounted payback** together, plus an **NPV profile** (NPV at a range of rates, small SVG chart showing where it crosses 0 = IRR).
- **Excel & Google Sheets formulas generated** for the inputs, including `=NPV(rate, C1:Cn) + C0` (period-0 fix) and `=PV(rate, nper, pmt, fv, type)` with the sign convention explained.
- **Dates mode (XNPV-style)** for irregular cash flows (0 tools).
- Compounding frequency and timing everywhere.
- Correct definitions: Inch has a DCF error; Omni's IRR wording is off.

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **Lump sum** (default): FV, rate, years, compounding → PV
2. **Annuity**: payment, rate, periods, ordinary/due, growth % (0 = level), perpetuity toggle
3. **Cash flows**: rows (period or date) → PV of each and total
4. **NPV & IRR**: initial investment + cash flows → NPV, IRR, PI, discounted payback, NPV profile
5. **PV table**: rate range (from–to, step) × periods (1–N) → discount factors 1/(1+r)^n; also an annuity factor table toggle

### 3.2 Input guide diagram (above the inputs, rules §9)

`PvInputGuide.tsx`: a timeline arrow from **Today** to **Year N**.

- **Lump sum:** a coin stack at the far end, "1 Future value", with a curved arrow back to Today labelled "÷ (1 + 2 Rate)^3 Years" = "Present value" (coin stack at Today, smaller). A "4 Compounding" tick pattern on the timeline.
- **Annuity:** equal coins at each tick ("1 Payment"), each with a faint arrow back to Today; a "due vs ordinary" toggle moves the coins to the start or end of each period.
- **NPV:** a red down-arrow at Today ("1 Initial investment") and green up-arrows of different heights per year ("2 Cash flows"), all discounted back.
- **Table:** a small grid preview (rates down, periods across).

Live values; the focused field highlights.

### 3.3 Inputs (defaults = examples)

| Tab | Defaults |
|---|---|
| Lump sum | FV $10,000, rate 6%, 10 years, annual compounding |
| Annuity | $1,000 per year, 6%, 10 periods, ordinary, growth 0% |
| Cash flows | 3 example rows |
| NPV | initial $10,000, 5 × $3,000, discount rate 8% |
| Table | rates 1–15% step 1, periods 1–20 |

### 3.4 Engine (`src/lib/tvm-engine.ts`: shared with Compound Interest and Investment Return; Part 3 §13)

```ts
pv(fv, rate, years, m) = fv / (1 + rate/m)^(m*years) ; continuous: fv * e^(-rate*years)
pvAnnuity(pmt, i, n, due) = pmt * (1 - (1+i)^-n) / i * (due ? (1+i) : 1)   // i == 0 → pmt*n
pvGrowingAnnuity(pmt, i, g, n) = pmt/(i-g) * (1 - ((1+g)/(1+i))^n)           // i == g → pmt*n/(1+i)
pvPerpetuity(pmt, i, g=0) = pmt/(i-g)                                         // null if i <= g
npv(rate, c0, flows[]) = -c0 + Σ flows[t]/(1+rate)^t   (reuse real-estate-engine.npv/irr)
irr(flows) ; pi = pvInflows / c0 ; discountedPayback = first t where cumulative discounted ≥ c0 (fractional)
xnpv(rate, [{date, amount}]) = Σ amount / (1+rate)^(days/365)
pvTable(rates[], periods) -> matrix of 1/(1+r)^n (4 dp) ; annuityTable likewise
excelFormulas(tab, inputs) -> strings  e.g. '=PV(6%,10,0,-10000)' , '=NPV(8%,B2:B6)-10000'
```

**Worked examples (checked 2026-11-20):**

| Case | Result |
|---|---|
| PV of $10,000 in 10 years at 6% | **$5,583.95** |
| PV of $1,000/yr for 10 years at 6% | **$7,360.09** |
| NPV of −$10,000 + 5 × $3,000 at 8% | **$1,978.13** |
| IRR of the same project | **15.24%** |

### 3.5 Outputs

- **Headline:** PV (or NPV + IRR).
- **Sentence:** "$10,000 received in 10 years is worth $5,583.95 today at a 6% discount rate."
- Step-by-step with the user's numbers.
- Per-period table (cash flow, discount factor, PV).
- NPV profile chart (SVG, results column).
- Excel/Sheets formula box with copy buttons.
- PV table: printable (print stylesheet), Copy CSV.
- Share URL.

### 3.6 Tests

- Every function with the examples above, plus i = 0 and i = g edge cases.
- Due vs ordinary; continuous compounding.
- IRR `null` when no sign change.
- XNPV against a hand case.
- Table values (spot cells).
- Excel strings exact. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Present Value Calculator – PV Formula, NPV & PV Table` (53, over 60 with the suffix → `absoluteTitle`) |
| Meta | `Free present value calculator. Use the PV formula for a lump sum or annuity, find NPV and IRR, and print a present value table for any range of rates.` (150) |
| H1 | ` (10) |
| H1 | `Present Value Calculator: PV Formula, NPV and PV Tables` |
| BLUF | "PV formula: PV = FV ÷ (1 + r)ⁿ. Money you get later is worth less today, so you divide by (1 + rate) once for every year you wait. $10,000 in 10 years at 6% is worth $5,583.95 today." (engine) |
| ToolShell pills | `PV, annuity & NPV/IRR`, `Printable PV table`, `Excel formulas`, `Step-by-step working` |
| Links out | Compound Interest (Part 3), Business Valuation (Part 2), Cap Rate, Percentage Change |
| Links in | Compound Interest, Business Valuation, Tools hub "Money" |

## 5. Content (~1,800–2,100 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | PV formula | 2-line answer + engine example (primary) | 150 |
| 2 | How to use the present value calculator | 5 tabs | 120 |
| 3 | Present value of a lump sum | Example, compounding frequency effect | 180 |
| 4 | PV of an annuity (ordinary and due) | `pv of annuity`; example | 200 |
| 5 | Growing annuities and perpetuities | Examples | 150 |
| 6 | Present value table (discount factors) | How to read it; generated table (`present value discount tables`) | 200 |
| 7 | How to calculate NPV | Example + decision rule (`how to calculate npv`) | 220 |
| 8 | NPV vs IRR, and the NPV profile | Example | 180 |
| 9 | PV and NPV in Excel and Google Sheets | The period-0 mistake, sign convention | 200 |
| 10 | Choosing a discount rate | Required return, cost of capital, inflation (conceptual) | 130 |
| 11 | FAQ | §6 | 400 |

## 6. FAQ (11)

1. What is the PV formula? (`pv formula`)
2. How do I calculate present value by hand?
3. What is a present value table, and how do I use it?
4. How do I calculate the PV of an annuity? (`pv of annuity`)
5. What is the difference between an ordinary annuity and an annuity due?
6. How do I calculate NPV? (`how to calculate npv`)
7. PV vs NPV: what's the difference?
8. Can NPV be negative? What does it mean?
9. NPV vs IRR: which should I use?
10. Why is my Excel NPV wrong? (period-0)
11. What discount rate should I use?

## 7. Done when

- [x] `tvm-engine.ts` + tests (reused later); `npm run verify` passes.
- [x] Input guide diagram per tab above the inputs; NPV profile in results; ToolShell + TabSlider used.
- [x] PV table prints cleanly and copies as CSV; Excel formulas verified in a real spreadsheet (note it in the PR/docs).
- [x] Registrations + docs updated; `graphify update .`.
