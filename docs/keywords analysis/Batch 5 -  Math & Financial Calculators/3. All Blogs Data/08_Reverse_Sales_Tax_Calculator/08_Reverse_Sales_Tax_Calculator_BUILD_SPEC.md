# Reverse Sales Tax Calculator — Build Spec

> **URL:** `/reverse-sales-tax-calculator/` · Batch 5 · Tier 1 · rank chance 🟡 · **Build order 8**
> **Read first:** `../00_BATCH5_BUILD_RULES.md` (§2.4: no rate tables)
> **Inputs used:**
> - `08_Reverse_Sales_Tax_Calculator_Competitor_Analysis.md` (6 pages read, 2026-11-14)
> - keyword file §2 #8
>
> **SERP:** provisional
> **Written:** 2026-11-22 (full rewrite after the research pass)

---

## 0. Strategy

- **The opportunity:** about 8,000 searches at KD 20–24, for a one-formula tool:
  - `reverse sales tax calculator`: 4,400;
  - `reverse tax calculator`: 3,600.
- **Who ranks:**
  - CalculatorSoup and Inch;
  - tax SaaS lead-gen pages (Kintsugi with a ZIP lookup, 99minds, HireQuotient, Quadratic);
  - reversesalestaxcalc.org (exact-match domain, ~4,000 words);
  - WealthNorth (Canada);
  - an Excel tutorial.
- **🚫 No rate tables.** The two competitors that publish rates have **errors**:
  - reversesalestaxcalc.org shows South Dakota at 6.19%, but its own components add to 6.49%;
  - Inch is off by a cent in two combined rates.
  - Rate tables would also put us on the yearly update treadmill. The user types the rate.
- **Accuracy edge:** Inch's worked example **and** its default output are wrong.
- **Every tool has one input pair (total + rate):**
  - **0 of 6** find the rate from two prices;
  - **0 of 6** offer a multi-line receipt;
  - only Kintsugi (via network ZIP lookup) builds a combined rate;
  - only WealthNorth handles GST/HST.

## 1. Keywords and placement

| Role | Keyword | US vol | KD | Where it goes |
|---|---|---:|---:|---|
| **Primary** | reverse sales tax calculator | 4,400 | 20 | Title, H1, first sentence, tool heading |
| Secondary | reverse tax calculator | 3,600 | 24 | Intro sentence + H2 "Reverse tax for VAT and GST" (covers the non-US meaning) |
| Natural | price before tax · how to calculate sales tax backwards · remove VAT from price · tax-inclusive price | — | — | H2s, FAQ |

## 2. Our edge (6 competitors checked)

| Feature | Competitors with it |
|---|---|
| Total + rate → pre-tax and tax | 6/6 |
| **Pre-tax + total → rate**, and **tax + total → rate/pre-tax** | **0/6** |
| **Multi-line receipt** (each line with its own rate or exempt; tip and shipping with taxable toggles) | **0/6** |
| Rate builder (state + county + city + district, typed, then added) | 1/6 (Canada) |
| Sales tax / VAT / GST / HST wording switch (no country rates) | 1/6 |
| Rounding rule stated: pre-tax rounded to the cent, tax = remainder, totals reconcile; "off by a cent" explained | 1/6 |
| Excel/Sheets formulas with the user's numbers, rounded to cents | 1/6 (tutorial only) |
| Correct worked examples | 4/6 |

## 3. Calculator spec

### 3.1 Tabs

1. **Price before tax** (default)
2. **Find the tax rate** (from two prices, or from the tax amount + total)
3. **Receipt** (several items)
4. **Add tax** (forward, for checking)

### 3.2 Input guide diagram (above the inputs)

`ReverseTaxInputGuide.tsx`: a receipt.
- Bottom line: "1 Total paid".
- Next to the tax line: "2 Tax rate %".
- The unknown "Price before tax" at the top is highlighted.
- A small stack beside it: "State + county + city + district = 3 Combined rate".
- **Receipt tab:** several item lines, each with its own rate badge or "exempt".

### 3.3 Inputs (defaults = examples)

| Field | Default |
|---|---|
| Total | $107.25 |
| Rate | 7.25%, labelled "example: enter your local rate (check your state or city revenue department)" |
| Rate builder | optional rows: state, county, city, district (typed) |
| Label switch | Sales tax / VAT / GST / HST |
| Receipt | 3 example lines (one exempt); tip and shipping with taxable toggles |
| Rounding | round half-up to cents (stated in the UI) |

### 3.4 Engine (`src/lib/reverse-tax-engine.ts`)

```ts
pre = round2(total / (1 + r)) ; tax = round2(total − pre)          // reconciles exactly
rate = total/pre − 1 ; rateFromTax = tax/(total − tax)
combined = Σ parts (US additive)
receipt: per line pre_i, tax_i (exempt → tax 0); taxable tip/shipping toggles; sums; per-line vs receipt rounding note
forward: tax = round2(pre × r), total = pre + tax
excel: '=ROUND(B2/(1+C2),2)' , '=B2-ROUND(B2/(1+C2),2)' , '=B2/A2-1'
VAT note: 20% VAT-inclusive → VAT = gross/6 (shown as a property of 20%, no country claim)
```

**Worked examples (checked 2026-11-22):**

| Case | Result |
|---|---|
| $107.25 at 7.25% | **$100.00** before tax, **$7.25** tax |
| Pre-tax $100, total $108.875 | rate **8.875%** |
| £120 including 20% VAT | **£100** + £20 VAT (= gross ÷ 6) |

### 3.5 Outputs

- **Headline:** price before tax + tax amount.
- **Sentence:** "$107.25 including 7.25% tax is $100.00 before tax, so the tax was $7.25."
- Reconciliation line: "$100.00 + $7.25 = $107.25".
- Receipt table (per line + totals).
- Excel/Sheets formula box. Copy, Share URL.

### 3.6 Tests

- Each solve mode; rounding reconciliation (cases that cause cent drift).
- Combined rate sum.
- Receipt with exempt and taxable tip/shipping.
- VAT 20% fraction.
- Excel strings. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Reverse Sales Tax Calculator – Price Before Tax` (47; 59 with the suffix: OK) |
| Meta | `Free reverse sales tax calculator. Enter the total paid and the tax rate to get the price before tax and the tax amount, or work out the rate from two prices.` (158) |
| H1 | `Reverse Sales Tax Calculator: Find the Price Before Tax` |
| BLUF | "To remove sales tax, divide the total by 1 plus the tax rate. $107.25 with a 7.25% rate is $107.25 ÷ 1.0725 = $100.00 before tax, so the tax was $7.25. Don't subtract 7.25% of the total: that gives the wrong answer." (engine) |
| ToolShell pills | `Price before tax`, `Find the rate from two prices`, `Receipt mode`, `Sales tax, VAT or GST` |
| Links out | Discount (live), Markup (live, tax strip), Percentage Change (live), Unit Price (live), Fraction to Percent (#7) |
| Links in | Markup (tax section), Discount, Tools hub "Everyday" |

## 5. Content (~1,300–1,600 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the reverse sales tax calculator | 4 tabs | 100 |
| 2 | Reverse sales tax formula | Formula + example | 180 |
| 3 | Why subtracting the tax rate from the total is wrong | $107.25 × 7.25% vs the correct answer | 150 |
| 4 | Finding the tax rate from two prices | Example | 130 |
| 5 | Combining state, county and city rates | Additive; where to look up yours; **no table** | 150 |
| 6 | Receipts with several items or tax-exempt items | Receipt example | 150 |
| 7 | Reverse tax for VAT and GST | Generic VAT/GST method; the 20% → ÷6 property (`reverse tax calculator`) | 150 |
| 8 | Reverse sales tax in Excel and Google Sheets | Formulas with ROUND | 120 |
| 9 | Why your result can be off by a cent | Rounding rule | 100 |
| 10 | FAQ | §6 | 380 |

## 6. FAQ (10, from the question bank)

1. How do I calculate the price before tax from the total?
2. What is the reverse sales tax formula?
3. Why can't I multiply the total by the tax rate and subtract?
4. How do I find the sales tax rate from two prices?
5. How do I back out tax from a receipt with several items?
6. How do I combine state and local tax rates?
7. How do I remove VAT or GST from a price?
8. How do I do reverse sales tax in Excel?
9. Why is my result off by a cent?
10. Is sales tax charged on tips or shipping? (depends on the state: check with your revenue department; no claims)

## 7. Done when

- [ ] `reverse-tax-engine.ts` + tests; `npm run verify` passes.
- [ ] No rate tables anywhere; the default rate labelled an example.
- [ ] InputGuide above the inputs; ToolShell + TabSlider + fonts + `<main>`.
- [ ] Registrations + docs; `graphify update .`.
