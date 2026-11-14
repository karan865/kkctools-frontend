# Reverse Sales Tax Calculator — Competitor Analysis

> **Target page:** KKCTools `/reverse-sales-tax-calculator/` (Batch 5, Tool #8 🟡)
> **Primary keyword:** `reverse sales tax calculator`: US 4,400 · KD 20. Cluster: 2 keywords, 8,000 US vol, with `reverse tax calculator` at 3,600.
> **SERP source:** ⚠ There is no Semrush SERP export for Batch 5. Competitors come from a live web search for `reverse sales tax calculator` on 2026-11-14. `TODO(owner): pull Google top 10.`
> **Pages visited (2026-11-14):** 6 read: CalculatorSoup, Inch Calculator, Kintsugi, ReverseSalesTaxCalc.org, WealthNorth (Canada), MyExcelOnline.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Calc giants: CalculatorSoup, Inch.
  - Tax SaaS lead-gen: Kintsugi (ZIP rate lookup), 99minds, HireQuotient, Quadratic.
  - An exact-match domain: reversesalestaxcalc.org.
  - A Canadian finance site: WealthNorth (GST/HST/PST/QST).
  - An Excel tutorial: MyExcelOnline.
  - Others not read: Reed Corp, ustax.tools, and pages.dev clones.
- **Keyword-file rule:** **we do not publish state or city tax rates.** The user enters the rate. Two competitors publish rate tables, and both contain errors:
  - ReverseSalesTaxCalc.org shows South Dakota at 6.19 %, but its own components add up to 6.49 %.
  - Inch has two combined values that are off by a cent of rounding.
  - This supports the decision. A rates table would also put us back on the update treadmill that caused Batch 3's tax tools to be put on Hold.
- **Arithmetic re-checked:** Inch's worked example and its default output are both wrong (see §4).
- No competitor text is copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | calculatorsoup.com/calculators/financial/sales-tax-calculator-reverse.php | Calc giant | Reverse Sales Tax Calculator | 500–600 |
| 2 | inchcalculator.com/reverse-sales-tax-calculator/ | Calc site | Reverse Sales Tax Calculator | 450–500 + rate table |
| 3 | trykintsugi.com/reverse-sales-tax-calculator | Tax SaaS | Reverse Sales Tax Calculator | ~400 |
| 4 | reversesalestaxcalc.org | Exact-match domain | Free Reverse Sales Tax Calculator | ~4,000 |
| 5 | wealthnorth.ca/taxes/sales-tax/reverse-sales-tax-calculator/ | Canadian finance | Sales Tax Calculator Canada 2026 | ~1,200 |
| 6 | myexcelonline.com/blog/reverse-sales-tax-calculator | Excel tutorial | Reverse Sales Tax Calculator in Excel | ~1,500 |

**What this tells us:**
- **Every calculator has one input pair: total + rate.**
  - None offers "find the rate from two prices", which the keyword file requires.
  - None offers a **multi-line receipt** with different rates per item. ReverseSalesTaxCalc admits mixed-rate receipts fail.
  - None lets the user add up state + county + city rates. Kintsugi does it automatically via ZIP lookup, which is network data we will not use.
- **Coverage outside the US:** only WealthNorth handles VAT/GST-style splits (Canada). Nobody covers UK/EU VAT or Australia/India GST wording.
- **Rounding** (per line vs per receipt, and making the pre-tax price plus tax equal the total) is handled clearly only by Kintsugi. Pre-tax is rounded to the cent and tax is the remainder.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | CalcSoup | Inch | Kintsugi | RSTC.org | WealthNorth | MyExcelOnline |
|---|---|---|---|---|---|---|
| Total + rate → pre-tax and tax | ✅ | ✅ (**default output wrong**) | ✅ | ✅ | ✅ | ✅ (Excel) |
| Forward mode (add tax) | ❌ (separate page) | ❌ | ❌ | ❌ | ✅ toggle | ❌ |
| **Rate from pre-tax + total** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Tax amount + total → rate | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Combine state + county + city rates | ❌ | ❌ | ✅ (ZIP lookup, network) | ⚠️ (Chicago example) | ✅ (GST + PST split) | ❌ |
| **Multi-line receipt (different rates)** | ❌ | ❌ | ❌ | ❌ (admits it fails) | ❌ | ⚠️ ("per item") |
| Tax-exempt lines | ❌ | ❌ | ⚠️ (note) | ❌ | ⚠️ (text) | ❌ |
| VAT / GST wording | ❌ | ❌ | ❌ | ❌ | ✅ Canada | ❌ |
| Tips / shipping handling | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Rounding rule stated | ❌ | ❌ | ✅ | ❌ | ❌ | ⚠️ (bad ROUND advice) |
| Reconciles pre-tax + tax = total | ✅ | ❌ (**$1,000 + $40 = $1,000**) | ✅ | ✅ | ✅ | ❌ |
| History / share | ❌ | ✅ share | ❌ | ✅ history | ❌ | n/a |
| Publishes a rates table | ⚠️ (2023 rates) | ✅ (2026, ±$0.01) | ✅ (live) | ✅ (**SD error**) | ✅ (provinces) | ❌ |

---

## 3. Feature matrix — content and trust

| Item | CalcSoup | Inch | Kintsugi | RSTC.org | WealthNorth | MyExcel |
|---|---|---|---|---|---|---|
| Formula | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Worked examples (checked) | ✅ 2 | ❌ **$210/1.05 shown as $105** | ✅ 3 | ✅ 4 | ✅ all | ❌ (none) |
| "Why you can't just subtract the rate" | ❌ | ❌ | ✅ | ⚠️ | ✅ | ❌ |
| Business / receipt use cases | ⚠️ | ❌ | ✅ | ✅ | ⚠️ | ✅ |
| FAQ count | 0 | 0 | 4 | 0 (heading is empty) | 0 | yes |
| Named author | ✅ | ✅ | ❌ | ❌ | ❌ (team) | ✅ |
| Date | ✅ Aug 2025 | ❌ | ⚠️ (rates Oct 2026) | ✅ Oct 2026 | ✅ Sep 2026 (conflicting) | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. CalculatorSoup: Reverse Sales Tax (Edward Furey, Aug 2025)
- **Inputs:** total with tax, rate.
- **Outputs:** pre-tax price, tax, total.
- **Examples:**
  - $1,593.75 ÷ 1.0625 = $1,500, tax $93.75 ✔
  - $858 ÷ 1.0725 = $800, tax $58 ✔
- **Weak points:**
  - No rate mode, no multi-line, no VAT, no FAQ.
  - Cites 2023 rates.
  - Typo: "the the".

### 2. Inch Calculator: Reverse Sales Tax (Joe Sexton)
- **Inputs:** total after tax, rate.
- **Outputs:** pre-tax price, tax, solution steps.
- **Errors:**
  - The example writes "$210 ÷ 1.05 = **$105**". The correct result is $200, which the page then states.
  - The default output shows $1,000 at 4 % giving a pre-tax price of $1,000 and tax of $40, and a "total" of $1,000. The correct pre-tax price is **$961.54**, with tax of $38.46.
- **Rate table:** a 2026 Tax Foundation table of state, average local and combined rates. A couple of rows are off by 0.01 from rounding.
- **Weak points:** no FAQ, no date, no VAT.

### 3. Kintsugi: Reverse Sales Tax Calculator (tax SaaS)
- **Inputs:** US only. Address or ZIP lookup (combined state, county, city and district rate "as of Oct 2026"), and total paid.
- **Rounding:** the pre-tax price is rounded to the cent and the tax is the remainder, so the two add up to the total.
- **Examples:**
  - $221 ÷ 1.105 = $200, tax $21 ✔
  - The page also shows why multiplying the total by the rate is wrong: $23.21 ✔
  - $10 at 8.25 % → $9.24 + $0.76 ✔
- **FAQs (4):**
  1. What the tool does
  2. The formula
  3. Why multiplying fails
  4. Use cases
- **Weak points:**
  - The rate source isn't named.
  - The ZIP lookup doesn't warn that ZIP codes and tax boundaries don't always match.
  - No author.
  - Sales calls to action throughout.

### 4. ReverseSalesTaxCalc.org (exact-match domain)
- **Inputs:** final price, rate. History and share.
- **Examples (all ✔):**
  - $107.50 @ 7.5 %
  - $534 → $496.74
  - $12,850 → $11,870.67
  - Chicago 8.75 % (component rates unsourced)
- **Errors:**
  - South Dakota is shown as 6.19 %, but the components add up to 6.49 %.
  - A blog post's count of states in the 7.5–10 % band doesn't match the page's own table.
- **Weak points:**
  - The FAQ heading has no content under it.
  - No author.
  - "Verified" badges with nothing visible behind them.
  - A rating based on 3 votes.
  - Mixed-rate receipts aren't supported.

### 5. WealthNorth: Sales Tax Calculator Canada (Sep 2026)
- **Inputs:** add/extract toggle, 13 provinces and territories (rates ✔).
- **Outputs:** pre-tax amount, GST, provincial portion, PST, total tax. QST is applied on the pre-GST base, which is correct.
- **Tables and examples:** all checked to the cent ✔.
- **Weak points:**
  - The tables leave out some provinces.
  - The "QST" label is missing.
  - Dates conflict.
  - No FAQ.
  - Team author only.

### 6. MyExcelOnline: Reverse sales tax in Excel (John Michaloudis)
- **Formula:** `=B2/(1+C2)` ✔
- **Weak points:**
  - The FAQ formula uses labels instead of cell references.
  - It recommends `ROUND(…,0)`, which drops the cents.
  - No numeric example.
  - Screenshots are placeholders.
  - Heavy promotion.

---

## 5. Patterns

- **Maths:**
  - Pre-tax = Total ÷ (1 + r)
  - Tax = Total − Pre-tax
  - Rate = Total ÷ Pre-tax − 1
  - Rate from tax amount = Tax ÷ (Total − Tax)
- **Combined rate:** state + county + city + district, all user-entered, then **added** (US rates are additive).
- **Canada:**
  - GST + PST on the same base.
  - HST is a single rate.
  - Quebec's QST is on the pre-GST price (since 2013).
- **VAT:** a VAT-inclusive price ÷ (1 + VAT). The UK "VAT fraction" for 20 % is 1/6 of the gross price.
- **Rounding:**
  - Round the pre-tax price to the cent; tax = total − pre-tax, so the totals reconcile.
  - Optionally show the per-line rounding difference.
- **Receipt mode:**
  - Lines each have a total and a rate (or "exempt").
  - Sum the pre-tax amounts and the tax amounts.
  - Optional tip and shipping lines, where the user marks each as taxable or not.

| Section | Pages (of 6) |
|---|:---:|
| Total + rate → pre-tax | 6 |
| Rate from two prices | **0** |
| Multi-line receipt | **0** |
| Combined rate builder (no network) | 1 (Canada) |
| VAT/GST | 1 |
| Rounding rule stated | 1 |
| Correct examples | 4 of 6 |

---

## 6. FAQ question bank

★ = asked on 2 or more pages, or a cluster keyword. Map to: reverse sales tax calculator, reverse tax calculator.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How do I calculate the price before tax from the total? | all |
| 2 | ★ What is the reverse sales tax formula? | Kintsugi, CalcSoup, RSTC, MyExcel |
| 3 | ★ Why can't I just multiply the total by the tax rate and subtract? | Kintsugi, WealthNorth |
| 4 | How do I find the sales tax rate from two prices? | (gap) |
| 5 | How do I back out tax from a receipt with several items? | RSTC (limitation), MyExcel |
| 6 | How do I combine state and local tax rates? | Kintsugi, RSTC |
| 7 | How do I remove VAT or GST from a price? | WealthNorth · `reverse tax calculator` |
| 8 | How do I do reverse sales tax in Excel? | MyExcel |
| 9 | Why is my result off by a cent? (rounding) | Kintsugi, WealthNorth |
| 10 | Is sales tax charged on tips or shipping? | (point users to their state; no claims) |

---

## 7. Gaps nobody fills: our opportunities

1. **Three solve modes:**
   - total + rate → pre-tax and tax
   - pre-tax + total → rate
   - tax + total → rate and pre-tax
2. **Rate builder:** state + county + city + special district, all typed by the user. We publish no rate tables, which avoids competitor-style errors and stale data.
3. **Receipt mode:** multiple lines with their own rate or exempt, plus optional tip and shipping with a taxable toggle. Outputs the totals and a breakdown per line.
4. **Clear rounding rule** and reconciliation (pre-tax + tax = total), with an "off by a cent" explanation.
5. **VAT/GST wording toggle** (US sales tax / VAT / GST / HST). This is generic and contains no country rates.
6. **Excel / Sheets formulas** filled in with the user's numbers, correctly rounded to cents.
7. **Correct worked examples.** Inch's are wrong.
8. **Business use cases:** expense reports, bookkeeping, tax-inclusive pricing.
9. **Links:** Discount (Batch 3 #9), Markup (Batch 3 #2), Unit Price (Batch 3 #5), Percentage (#7).

---

## 8. Blueprint for the KKCTools Reverse Sales Tax Calculator

### 8.1 SEO

- **URL:** `/reverse-sales-tax-calculator/`
- **Title:** Reverse Sales Tax Calculator – Price Before Tax
- **H1:** Reverse Sales Tax Calculator: Find the Price Before Tax
- **Meta:** as in the keyword file (158 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Modes | Total + rate → pre-tax/tax · Pre-tax + total → rate · Tax + total → rate/pre-tax · Forward (add tax) |
| Rate | Single rate or builder (state/county/city/district, typed by the user) |
| Receipt | N lines: total and rate or exempt; tip/shipping with taxable toggle |
| Wording | Sales tax / VAT / GST / HST label switch |
| Rounding | Pre-tax to the cent, tax = remainder; per-line vs receipt note |
| Extras | Excel/Sheets formulas, share URL, copy, no network |

### 8.3 Content outline (≈ 1,000–1,300 words, original)

1. Intro (primary keyword) and quick formula
2. How to use
3. Reverse sales tax formula, with an example
4. Why subtracting the rate from the total gives the wrong answer
5. Finding the tax rate from two prices
6. Combining state and local rates (where to find yours; no rate table)
7. Receipts with several items or exempt items
8. Removing VAT or GST
9. Doing it in Excel / Google Sheets
10. Rounding and the one-cent difference
11. FAQ (8–10)
12. Related tools: Discount (Batch 3 #9), Markup (Batch 3 #2), Percentage (#7), Unit Price (Batch 3 #5)

### 8.4 Quality checks

- **Unit tests:** every mode, the rate builder, receipt mode with exempt lines, rounding reconciliation, and fixtures such as $1,000 @ 4 % → $961.54 / $38.46.
- No rates data in the code. No competitor wording copied. `npm run check:no-network` passes.
- **`TODO(owner)`:** pull the Google top 10; decide whether tips and shipping belong in v1 (wording must avoid state-specific tax claims).
