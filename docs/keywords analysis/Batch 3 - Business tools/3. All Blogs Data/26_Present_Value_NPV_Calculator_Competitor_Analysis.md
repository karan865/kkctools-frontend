# Present Value / NPV Calculator — Competitor Analysis

> **Target page:** KKCTools `/present-value-calculator/` (Batch 3, Tier 3 #26; Batch 5 adds keywords)
> **Primary keyword:** `pv formula` — US 2,400 · KD 14 (cluster 9 keywords, 21,020 US vol) · YMYL: low. Primary is **formula/education intent**; tool terms (`present value calculator`, `npv calculator`) are in the cluster.
> **SERP source:** ⚠ No Semrush SERP export. Competitors from live web search (2026-11-14). `TODO(owner): pull Google top 10 — expect Investopedia, CFI, Corporate Finance Institute, Omni, CalculatorSoup, Calculator.net, Excel (Microsoft) pages.`
> **Pages visited:** 2026-11-14 — 6 read (CalculatorSoup PV, CalculatorSoup PV of cash flows, Calculator.net PV, Omni NPV, Inch Calculator NPV, Ablebits Excel NPV).

---

## 0. How this was collected (read first)

- Read: CalculatorSoup (2 tools), Calculator.net, Omni NPV, Inch Calculator NPV, Ablebits (Excel tutorial).
- Search also returned Vertex42 (Excel templates), SpreadsheetPlanet, Ajelix, Ryan O'Connell (BA II Plus), RedCrab, AG Capital CFO.
- Do not copy formula derivations verbatim or examples (AGENTS.md rule 8).

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | calculatorsoup.com/…/present-value-calculator.php | Giant | Present Value Calculator | 2,000–2,500 (derivations) |
| 2 | calculatorsoup.com/…/present-value-cash-flows-calculator.php | Giant | Present Value of Cash Flows Calculator | 500–600 body |
| 3 | calculator.net/present-value-calculator.html | Giant | Present Value Calculator | 300–350 editorial |
| 4 | omnicalculator.com/finance/net-present-value | Giant | NPV Calculator – Net Present Value | 1,100–1,300 |
| 5 | inchcalculator.com/net-present-value-calculator/ | Giant | Net Present Value Calculator | ~1,100 |
| 6 | ablebits.com/…/calculate-npv-excel-net-present-value-formula | Excel tutorial | How to calculate NPV in Excel | 2,400–2,600 |

**What this tells us:**
- **PV and NPV are split across separate pages** everywhere (CalculatorSoup has 3+). Users searching “pv formula” want the **formula explained** (lump sum, annuity, uneven cash flows) and an instant answer.
- **Excel/financial-calculator intent is real** (Ablebits ranks with an Excel guide; Excel's NPV treats the first value as period 1 — a classic mistake).
- **Best tool features:** CalculatorSoup PV (lump sum + annuity + growing annuity + perpetuity + continuous + timing) and Inch NPV (NPV + IRR + ROI).

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | CalcSoup PV | CalcSoup CF | Calc.net | Omni NPV | Inch NPV |
|---|---|---|---|---|---|
| PV of lump sum | ✅ | ✅ | ✅ | ❌ | ⚠️ example |
| PV of annuity (ordinary / due) | ✅ | ⚠️ | ✅ | ❌ | ❌ |
| Growing annuity / perpetuity | ✅ | ❌ | ❌ | ❌ | ❌ |
| Uneven cash flows | ❌ | ✅ 50 lines | ❌ | ✅ up to 10 | ✅ 25 years |
| Initial investment (NPV) | ❌ | ❌ | ❌ | ✅ | ✅ |
| IRR | ❌ | ❌ | ❌ | ❌ (text) | ✅ |
| Compounding frequency / continuous | ✅ | ✅ | ❌ | ❌ | ❌ |
| Beginning/end timing | ✅ | ✅ | ✅ | ❌ | ❌ |
| Period-by-period table | ❌ | ✅ | ✅ (annuity) | ❌ | ❌ |
| Sensitivity (NPV at several rates) / NPV profile | ❌ | ❌ | ❌ | ❌ | ⚠️ example |
| Payback / discounted payback | ❌ | ❌ | ❌ | ❌ | ❌ |
| Profitability index | ❌ | ❌ | ❌ | ❌ | ❌ |
| Excel formula output | ❌ | ❌ | ❌ | ❌ | ❌ |
| Irregular dates (XNPV) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Share/embed | ✅ | ✅ | ❌ | ✅ | ✅ |

---

## 3. Feature matrix — content and trust

| Item | CalcSoup PV | CalcSoup CF | Calc.net | Omni NPV | Inch NPV | Ablebits |
|---|---|---|---|---|---|---|
| PV formula(s) | ✅ many derivations | ✅ | ❌ | ✅ | ✅ | ✅ |
| NPV formula | ❌ | ❌ | ⚠️ text | ✅ | ✅ | ✅ |
| Worked numeric example | ❌ | ✅ 3 | ⚠️ built-in | ✅ 2 projects | ✅ detailed | ✅ |
| PV vs NPV | ❌ | ⚠️ | ⚠️ | ⚠️ | ✅ | ✅ |
| NPV vs IRR | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Excel NPV/XNPV/PV functions | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (+ common errors) |
| Choosing a discount rate | ❌ | ❌ | ❌ | ⚠️ | ❌ | ❌ |
| FAQ count | 0 | 0 | 0 | 4 | 4 | 0 |
| Named author | ✅ | ✅ | ❌ | ✅ | ✅ + PhD | ✅ |
| Date | ✅ Oct 2026 | ✅ Oct 2026 | ❌ | ❌ | ❌ | ⚠️ Mar 2023 |

---

## 4. Competitor-by-competitor detail

### CalculatorSoup — present value (lump + annuity)
- FV, periods (or “p” for perpetuity), rate, compounding (1/4/12/365/continuous), PMT, PMT growth, payments per period, timing → PV. Derivations for lump sum, ordinary annuity, annuity due, perpetuity, growing annuity/perpetuity, combined, continuous. No numeric example; repeated sections; typo “Withdrawls”. Updated Oct 2026.

### CalculatorSoup — PV of cash flows
- Up to 50 lines (periods × cash flow), rate, compounding, timing → total PV + per-period table. Formulas; 3 examples (11% 5-period; 7-line stream $1,689.94; delayed annuity $43,656.85).

### Calculator.net — present value
- Lump sum (FV, N, I/Y → PV, interest) and periodic deposits (N, I/Y, PMT, timing → PV, FV, principal, interest, chart, schedule). Defaults: 6%, 10 periods ($558.39 / $736.01 — checked). No formulas, no FAQ; NPV section with no NPV tool.

### Omni — NPV
- Discount rate, initial cost, annual cash flows (5, expandable to 10) → NPV, PV of inflows. Formula; two-project example ($481.55 vs −$29.13 — small rounding differences in our recheck); NPV vs IRR.
- **FAQs (4):** how to calculate NPV · NPV in finance · can NPV be negative · what does NPV = 1000 mean.
- **Weak points:** loose IRR definition; timing convention unstated.

### Inch Calculator — NPV
- Initial investment, rate, cash flows years 1–25 → NPV, net cash flow, ROI, **IRR**. Example $5,000 → 5 × $1,300 at 10% → NPV −$71.98 (checked), IRR ≈ 9.44%; NPV at 9% = $56.55; PV of $50,000 in 5 yrs at 5% = $39,176.31.
- **FAQs (4):** is NPV still used · when to use · NPV vs DCF · can NPV be negative.
- **Error:** says DCF “calculates the future value” (should be present value); IRR shown as 9.44% and 9.435%.

### Ablebits — NPV in Excel (tutorial)
- NPV syntax; 4 things to know (period-1 start!); Formula 1 (NPV + initial cost), Formula 2 (× (1 + rate) for start-of-period); manual check formulas; PV vs NPV; **NPV vs XNPV**; common errors. Formulas as images; dated (2023).
- **Lesson:** our tool should **print the matching Excel/Sheets formulas** for the user's inputs.

---

## 5. Patterns

- **Formulas:** PV = FV ÷ (1 + r)^n · PV (m compounding) = FV ÷ (1 + r/m)^(mt) · continuous: FV·e^(−rt) · ordinary annuity PV = PMT × (1 − (1+r)^−n) ÷ r (due: ×(1+r)) · growing annuity PV = PMT ÷ (r − g) × (1 − ((1+g)/(1+r))^n) · perpetuity = PMT ÷ r (growing: PMT ÷ (r − g)) · NPV = −C₀ + Σ Cₜ ÷ (1+r)^t · IRR: NPV = 0 · PI = PV inflows ÷ C₀ · discounted payback.
- **Excel:** `=PV(rate,nper,pmt,fv,type)` · `=NPV(rate, C1:Cn) + C0` · `=XNPV(rate, values, dates)` · `=IRR(values)`.

| Section | Pages (of 6) |
|---|:---:|
| PV + NPV in one tool | **0** |
| IRR | 1 |
| Growing annuity/perpetuity | 1 |
| Excel help | 1 (tutorial only) |
| XNPV (dates) | 0 tools |
| FAQ | 2 |

---

## 6. FAQ question bank

★ = asked on 2+ pages. Map to the 9 keywords (pv formula, present value formula, npv formula, present value calculator…).

| # | Question | Seen on |
|---:|---|---|
| 1 | ★ Can NPV be negative? | Omni, Inch |
| 2 | ★ How do I calculate NPV? | Omni, Ablebits |
| 3 | ★ PV vs NPV — what's the difference? | Inch, Ablebits |
| 4 | What is the PV formula? (lump sum, annuity) | CalcSoup (derivations) |
| 5 | NPV vs IRR? | Omni, Inch |
| 6 | Is NPV the same as DCF? | Inch |
| 7 | Why is Excel's NPV result wrong? (period-1 start) | Ablebits |
| 8 | NPV vs XNPV? | Ablebits |
| 9 | What does an NPV of $1,000 mean? | Omni |
| 10 | What discount rate should I use? | — (nobody) |
| 11 | What is the present value of an annuity / perpetuity? | CalcSoup |
| 12 | How does compounding frequency change PV? | — |

---

## 7. Gaps nobody fills — our opportunities

1. **One tool, four tabs:** PV of a lump sum · PV of an annuity (incl. due, growing, perpetuity) · PV of uneven cash flows · NPV/IRR of a project.
2. **NPV + IRR + PI + discounted payback** together.
3. **NPV profile:** NPV at a range of rates (table + small chart) — shows IRR visually.
4. **Excel & Google Sheets formulas generated** for the inputs (incl. the period-0 fix).
5. **Dates mode (XNPV-style)** for irregular cash flows.
6. **Compounding frequency + timing** everywhere.
7. **Discount-rate guidance** (WACC, required return, inflation — conceptual, link Business Valuation #11).
8. **Clear “pv formula” section** answering the primary keyword in 2 lines at the top.
9. **Correct definitions** (Inch DCF error, Omni IRR wording).

---

## 8. Blueprint for the KKCTools Present Value / NPV Calculator

### 8.1 SEO

- **URL:** `/present-value-calculator/`
- **Title/H1/Meta:** from Batch 3 file; H2 “PV formula” near top with the formula and a one-line example.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Tabs | Lump sum · Annuity (ordinary/due, growth, perpetuity) · Cash flows (rows or dates) · NPV/IRR |
| Inputs | rate per year, compounding (1–365, continuous), timing, periods/years |
| Outputs | PV, total discount, per-period table; NPV, IRR, PI, discounted payback; NPV profile |
| Excel | generated `PV`, `NPV`, `XNPV`, `IRR` formulas |
| UX | currency, share URL, CSV copy, no network |

### 8.3 Content outline (≈ 1,600–2,000 words, original)

1. PV formula (top answer)
2. How to use (tabs)
3. Present value of a lump sum — example
4. Present value of an annuity (and annuity due) — example
5. Growing annuities and perpetuities
6. Uneven cash flows
7. Net present value and the decision rule — project example
8. NPV vs IRR (and NPV profile)
9. PV and NPV in Excel / Google Sheets (common mistake)
10. Choosing a discount rate
11. FAQ (10)
12. Related tools — Compound Interest (#21), Business Valuation (#11), Investment Return (#27), ROI (Batch 5), CAGR (Batch 5)

### 8.4 Quality checks

- Unit tests vs the checked examples (Calc.net defaults, Inch NPV) and Excel-equivalent outputs.
- No competitor wording copied. `npm run check:no-network` passes.
- `TODO(owner): pull Google top-10 SERP for pv formula and present value calculator.`
