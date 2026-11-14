# Simple & Accrued Interest Calculator — Competitor Analysis

> **Target page:** KKCTools `/simple-interest-calculator/` (Batch 5, Tool #17 🟡)
> **Primary keyword:** `accrued interest`. US 4,400 · KD 13. The cluster has 3 keywords and 9,700 US searches: `calculate interest` (2,400, KD 9, rising) and `simple interest equation` (2,900).
> **SERP source:** ⚠ No Semrush SERP export for Batch 5. Competitors come from live web searches on 2026-11-14 for `accrued interest calculator simple interest day count actual/360 30/360` and `simple interest calculator calculate interest principal rate time`. `TODO(owner): pull Google top 10 for "accrued interest" (likely Investopedia/definition-led).`
> **Pages visited (2026-11-14):** 6 read: CalculatorSoup simple interest, Inch simple interest, Calculator.net simple interest, Calculate.co.nz, PropertyMetrics (day-count article), TVMCalcs (bond accrued interest in Excel). Not read: Omni accrued-interest URL (404) and Investopedia (fetch not allowed).

---

## 0. How this was collected (read first)

- **The keyword file treats `accrued interest` as an informational head term.** The page should open with a definition and then offer the date-range tool.
  - The accrued-interest search returned **no standalone calculator**. It returned documentation instead: Google Sheets ACCRINT, MathWorks, Microsoft DAX, R BondValuation, SIX Group, Carta, PropertyMetrics, TVMCalcs.
  - **That is the gap:** a simple, correct **accrued interest between two dates** calculator with a choice of day-count convention.
- **Simple interest calculators** were read for the `calculate interest` and `simple interest equation` rows: CalculatorSoup, Inch, Calculator.net, Calculate.co.nz.
- **Finance-light (keyword file):** no advice. This is a maths tool, and the user enters every rate.
- **Arithmetic re-checked.**
  - PropertyMetrics' Actual/360 total interest doesn't reconcile with its stated payment.
  - The "$972.22 vs $958.90" figures from the search snippet were **not found** on that page, so we don't cite them.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | calculatorsoup.com/calculators/financial/simple-interest-calculator.php | Calc giant | Simple Interest Calculator I = Prt | ~1,100 |
| 2 | inchcalculator.com/simple-interest-calculator/ | Calc site | Simple Interest Calculator | ~650 |
| 3 | calculator.net/simple-interest-calculator.html | Calc giant | Simple Interest Calculator | ~1,000 |
| 4 | calculate.co.nz/simple-interest-calculator.php | NZ calc site | Simple Interest Calculator | ~500 |
| 5 | propertymetrics.com/blog/30-360-vs-actual-360-vs-actual-365/ | CRE software blog | 30/360 vs Actual/360 vs Actual/365 | 1,100–1,200 |
| 6 | tvmcalcs.com/excel/calculate-accrued-interest-on-a-bond-in-excel-3-ways/ | Finance-education site | Calculate Accrued Interest on a Bond in Excel – 3 Ways | ~1,300 |
| — | investopedia.com/terms/a/accruedinterest.asp | Definition giant | Accrued Interest | **not fetchable** |
| — | omnicalculator.com/finance/accrued-interest | Giant | (404) | **not found** |

**What this tells us:**
- **Simple-interest calculators handle durations, not dates.**
  - CalculatorSoup offers days, weeks, months, quarters and years, with a 360 or 365 basis. Its 360 option is not explained.
  - Calculator.net offers years and months, solve-for-any-value, a schedule and a chart.
  - Inch and Calculate.co.nz accept years only.
  - **No calculator offers start and end dates or a day-count convention.**
- **Day-count conventions are explained only in articles.**
  - PropertyMetrics covers 30/360, Act/365 and Act/360 with a loan example.
  - TVMCalcs covers ACCRINT, YEARFRAC and DAYS360 with a bond example ($9.74 = 61/360 × $57.50 ✔).
  - Neither offers an interactive tool. PropertyMetrics' is a download.
- **Bond accrued interest** (coupon, last coupon date, settlement date) is the classic accrued-interest use. It is covered only by Excel documentation.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | CalcSoup | Inch | Calc.net | Calc.co.nz | PropertyMetrics | TVMCalcs |
|---|---|---|---|---|---|---|
| I = P r t | ✅ | ✅ | ✅ | ✅ | n/a | n/a |
| Solve for P, r or t | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Total (P + I) | ❌ (separate page) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Time in days, months or years | ✅ | ❌ (years) | ⚠️ (years, months) | ❌ (years) | n/a | n/a |
| **Start and end dates** | ❌ | ❌ | ❌ | ❌ | ⚠️ (spreadsheet) | ✅ (Excel) |
| Day count Act/365 | ✅ (365/yr) | ❌ | ❌ | ❌ | ✅ (text) | ⚠️ |
| Day count Act/360 | ⚠️ (360/yr, undocumented) | ❌ | ❌ | ❌ | ✅ (text) | ⚠️ (named) |
| Day count 30/360 (US and EU) | ❌ | ❌ | ❌ | ❌ | ✅ (text) | ✅ (DAYS360) |
| Actual/actual | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (text) |
| Bond accrued interest (coupon, frequency, last coupon) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (Excel) |
| Daily accrual amount | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ ($0.1389) |
| Schedule / table | ❌ | ✅ (by year) | ✅ | ❌ | ⚠️ (download) | ❌ |
| Chart | ❌ | ❌ | ✅ (axis clips the end balance) | ❌ | ❌ | ❌ |
| Compare with compound interest | ⚠️ | ✅ (text) | ✅ (example) | ✅ ($157 should be $158) | ❌ | ❌ |
| Excel / Sheets formula | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 3. Feature matrix — content and trust

| Item | CalcSoup | Inch | Calc.net | Calc.co.nz | PropertyMetrics | TVMCalcs |
|---|---|---|---|---|---|---|
| Accrued interest defined | ❌ | ❌ | ❌ | ❌ | ⚠️ | ✅ (bonds) |
| Worked example (checked) | ✅ ($4,500) | ✅ ($2,400) | ✅ | ✅ | ⚠️ (Act/360 total inconsistent) | ✅ ($9.74, $6.25) |
| Where each convention is used | ❌ | ❌ | ❌ | ❌ | ⚠️ (unsourced) | ✅ (Treasuries vs corporates) |
| Errors / issues | 360 basis undocumented; typo | "current principal" contradiction | example of 5 %/month rate | rounding | Act/360 total; "$8,333,33" typo | AccrInt framing overstated |
| FAQ count | 0 | 3 | 0 | 3 | 0 | 0 |
| Named author | ✅ | ✅ + MBA reviewer | ❌ | ⚠️ (reviewer) | ✅ | ✅ (PhD) |
| Date | ✅ Aug 2025 | ❌ | ❌ | ✅ Nov 2026 | ✅ Jan 2023 | ⚠️ (~2015, files 2024) |

---

## 4. Competitor-by-competitor detail

### 1. CalculatorSoup — Simple Interest I = Prt (Edward Furey, Aug 2025)
- **Solve for:** I, P, R or t.
- **Time units:** days, weeks, months, quarters, years. Days use a 360 or 365 basis.
- **Examples:** $50,000 at 4.5 % for 24 months = $4,500 ✔. 511 days ÷ 365 = 1.40 ✔.
- **Weak points:**
  - The 360 basis is offered but not explained.
  - No dates, no total, no FAQ.
  - Typo "interst".

### 2. Inch Calculator — Simple Interest (Joseph Rich MS; reviewer Laura Deimling MBA)
- **Inputs:** years only.
- **Outputs:** total, interest, and a balance-by-year table.
- **Example:** $8,000 at 3 % for 10 years = $2,400 ✔.
- **Errors:**
  - The FAQ says simple interest uses the "current principal". It uses the original principal.
  - The note mentions "compounding periods" for simple interest.
- **Weak points:** the rate period is not defined; no day count; no date.

### 3. Calculator.net — Simple Interest
- **Modes:** end balance, principal, term or rate. Rate per year or per month; term in years or months.
- **Outputs:** steps, chart, principal/interest split, schedule.
- **Examples:** $10,000 at 5 % for 5 years = $2,500 ✔. Monthly compounding comparison $12,833.59 ✔.
- **Weak points:**
  - No day count.
  - The chart's axis cuts off the end balance.
  - The 5 %-per-month example is unrealistic.
  - No author or date.

### 4. Calculate.co.nz — Simple Interest (reviewed Nov 2026)
- **Inputs:** P, annual rate, years.
- **Example:** $1,000 at 5 % for 3 years = $150 ✔. Its compound comparison says "about $157". The correct figure is **$157.63**, which rounds to $158.
- **FAQs (3):** what simple interest is · simple vs compound · the formula.

### 5. PropertyMetrics — 30/360 vs Actual/360 vs Actual/365 (Patrick Graham, Jan 2023)
- **Covers:** each convention's rule and why Act/360 gives the most interest. Example: a 10-year loan at 4 % with payment $25,311.28 ✔.
  - Month-1 interest: 30/360 $8,333.33 ✔, Act/365 $8,493.15 ✔, Act/360 $8,611.11 ✔.
- **Error:** the Act/360 lifetime total ($547,154) doesn't fit the stated payment.
- **Weak points:**
  - Unsourced claims about consumer vs commercial use.
  - Typos.
  - Calls to action for a downloadable calculator.

### 6. TVMCalcs — Accrued Interest on a Bond in Excel (Timothy Mayes PhD)
- **Methods:** ACCRINT (with the issue date set to the last coupon), YEARFRAC × coupon, DAYS360/360 × coupon. All give $9.74 ✔ (61/360 × 5.75 % × $1,000).
- **Examples:** a generic bond, $25 coupon × 45/180 = $6.25 ✔.
- **Covers:** 30/360 (corporates and municipals) vs actual/actual (Treasuries).
- **Weak points:** 2015 data; other bases are only named; no settlement-lag discussion.

---

## 5. Patterns

**Simple interest**
- I = P × r × t; A = P + I.
- t comes from the chosen unit or day count.
- Solve for any value:
  - P = I/(rt)
  - r = I/(Pt)
  - t = I/(Pr)

**Day-count conventions (accrual fraction τ)**

| Convention | τ | Typical use (cite before stating) |
|---|---|---|
| Actual/365 (Fixed) | actual days / 365 | some loans, UK markets |
| Actual/360 | actual days / 360 | money markets, many US commercial loans |
| 30/360 (US / Bond Basis) | (360(Y₂−Y₁) + 30(M₂−M₁) + (D₂−D₁))/360 with US end-of-month rules | US corporate and municipal bonds |
| 30E/360 (European) | same, with D = 31 → 30 for both dates | Eurobonds |
| Actual/Actual (ISDA or ICMA) | actual / actual days in year or period | US Treasuries (ICMA) |

`TODO(owner)`: confirm each "typical use" against a primary source (ISDA definitions, SIFMA, Excel/Sheets documentation) before publishing. Otherwise publish the rules only.

**Accrued interest between dates**
- AI = P × r × τ(start, end).
- Daily accrual = P × r ÷ year basis.

**Bond accrued interest**
- AI = face × coupon rate ÷ frequency × (days since last coupon ÷ days in coupon period). The days use the chosen basis.

**Excel / Sheets equivalents**
- `DAYS360`, `YEARFRAC(d1,d2,basis)`, `ACCRINT`.
- Show these with the user's own values.

**What the competitors cover (of 6 pages)**

| Section | Pages (of 6) |
|---|:---:|
| I = Prt | 4 |
| Dates input | **0** (calculator) |
| Day-count choice | 1 (365/360 only) |
| 30/360 rules | 2 (articles) |
| Bond accrued | 1 (Excel) |
| Simple vs compound | 3 |
| Accrued-interest definition | 1 |

---

## 6. FAQ question bank

★ = asked on 2+ pages or a cluster keyword. Maps to: accrued interest, calculate interest, simple interest equation.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is accrued interest? | TVMCalcs, Investopedia (SERP) · `accrued interest` |
| 2 | ★ What is the simple interest equation (I = Prt)? | CalcSoup, Calc.net, Calc.co.nz · `simple interest equation` |
| 3 | ★ How do I calculate interest for a number of days? | CalcSoup · `calculate interest` |
| 4 | ★ Simple vs compound interest: what's the difference? | Inch, Calc.net, Calc.co.nz |
| 5 | ★ What is the difference between 30/360, Actual/360 and Actual/365? | PropertyMetrics, TVMCalcs |
| 6 | How do I calculate accrued interest on a bond? | TVMCalcs |
| 7 | How do I calculate accrued interest in Excel or Google Sheets? | TVMCalcs, Google Sheets ACCRINT (SERP) |
| 8 | Why does Actual/360 cost more interest? | PropertyMetrics |
| 9 | How do I find the rate or time from the interest? | CalcSoup, Calc.net |
| 10 | Is accrued interest the same as interest paid? | — |

---

## 7. Gaps nobody fills — our opportunities

1. **Accrued interest between two dates** with a choice of day count:
   - Act/365, Act/360, 30/360 US, 30E/360, Act/Act
   - Shows the day count, τ, daily accrual and total accrued.
2. **Bond mode:** face value, coupon, frequency, last coupon date, settlement date → accrued interest.
3. **Simple-interest solver:**
   - solve for I, P, r, t or A
   - time in days, weeks, months or years, or as dates
   - optional schedule by period
4. **Compare conventions side by side** for the same dates. This shows why Act/360 is higher.
5. **Excel / Sheets formulas filled in** with the user's values (YEARFRAC, DAYS360, ACCRINT).
6. **Simple vs compound comparison** (link to Compound Interest, Batch 3 #21).
7. **A correct definition first** (keyword file): accrued interest as earned but not yet paid, for loans, deposits and bonds.
8. **Correct examples.** Competitors have rounding and reconciliation errors.
9. **Links:** Compound Interest (Batch 3 #21), Present Value/NPV (Batch 3 #26), Days Between Dates (Batch 8), CAGR (#6).

---

## 8. Blueprint for the KKCTools Simple & Accrued Interest Calculator

### 8.1 SEO

- **URL:** `/simple-interest-calculator/`
- **Title:** Simple Interest Calculator – Accrued Interest
- **H1:** Simple Interest Calculator: Interest and Accrued Interest by Day
- **Meta:** as in the keyword file (145 chars).
- **First lines:** the accrued-interest definition.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Mode A: Simple | Solve I / P / r / t / A; time unit or dates; optional schedule |
| Mode B: Accrued (dates) | Principal, annual rate, start, end, convention → days, τ, daily, accrued |
| Mode C: Bond | Face, coupon, frequency, last coupon, settlement, convention → accrued |
| Compare | All conventions side by side |
| Extras | Excel/Sheets formulas, compound comparison, share URL, no network |

### 8.3 Content outline (≈ 1,300–1,600 words, original)

1. What accrued interest is (definition first)
2. How to use
3. Simple interest equation: example
4. Interest for a number of days: example
5. Day-count conventions explained (table)
6. Accrued interest between two dates: example
7. Accrued interest on a bond: example
8. Doing it in Excel or Google Sheets
9. Simple vs compound interest
10. FAQ (10)
11. Related tools: Compound Interest (Batch 3 #21), NPV (Batch 3 #26), Days Between Dates (Batch 8), CAGR (#6)

### 8.4 Quality checks

- **Unit tests:**
  - each convention, including the end-of-month rules for 30/360 US vs EU
  - leap years
  - bond accrued
  - solve-for modes
- **Fixtures:**
  - 61/360 × 57.50 = 9.74
  - $1,000 at 5 % for 3 years = $150
  - Excel DAYS360 parity: `TODO(owner)` to generate fixtures from Excel or Sheets
- No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - pull Google top 10
  - check Investopedia manually
  - approve convention-usage citations (ISDA/SIFMA) or publish rules only
