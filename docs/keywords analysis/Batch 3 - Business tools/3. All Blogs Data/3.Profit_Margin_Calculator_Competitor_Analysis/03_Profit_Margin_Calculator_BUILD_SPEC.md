# Profit Margin Calculator — Build Spec

> **URL:** `/profit-margin-calculator/` · Batch 3 · Tier 2 · **Build order 3** (after Markup, reusing `pricing-engine.ts`)
> **Read first:** `../00_BATCH3_BUILD_RULES.md`
> **Inputs used:** `KKCTools_Batch3_Final_Tool_Keywords.md` §2 #13 (Semrush SERP 2026-11-16), the Markup analysis (same maths family)
> ⚠ **This folder had no competitor analysis file.** Before building, open the SERP pages named below and note their modes and FAQs: `TODO(owner)` or the builder does it. Do not copy their text.
> **Written:** 2026-11-18

---

## 1. Keywords

| Role | Keyword | US vol | KD |
|---|---|---:|---:|
| **Primary** | gross margin calculator | 8,100 | **8** |
| Secondary – easy | gross profit margin formula | 8,100 | 9 |
| Secondary – easy | calculate profit margin | 4,400 | 11 |
| Secondary – easy | net profit margin formula | 3,600 | 11 |
| Secondary – easy | how to calculate net profit margin | 1,900 | 11 |
| Secondary – easy | gross margin calculation | 1,600 | 9 |
| Secondary – easy | formula for profit margin · net profit margin equation | 720 · 720 | 14 · 12 |
| Secondary – easy (UK) | gp profit · how to work out a gp | 2,400 · 3,600 | 8 · 17 |
| Secondary – medium | gross profit margin calculator | 5,400 | 16 |
| Secondary – medium | how do you determine gross margin | 3,600 | 20 |
| Secondary – medium | what is a good profit margin | 3,600 | 20 |
| Secondary – medium | how to calculate profit | 2,900 | 21 |
| Secondary – medium | gross sales · net sales formula | 2,900 · 1,900 | 19 · 22 |
| Support | operating profit margin formula | 2,900 | 29 |
| Support | gross sales vs net sales | 2,400 | 29 |
| Support | profit margins | 1,900 | 27 |

**SERP (2026-11-16): 🟡 hard.** The top 7 are Omni 84, CalculatorSoup 80, Xero 72, Calculator.net 90, Canva 100, Mercury 51 and Investopedia 91. The weak slots are retaildogma 38 (#8) and margincalculator.cc 22 (#10).
- **Realistic target:** the bottom of page 1 for the head term.
- **Faster wins:** the formula and "how to" long tail (KD 9–14), where a clear formula section and FAQ can rank.

## 2. Our edge (what the typical margin tool lacks)

The typical tool does revenue + cost → margin. Ours covers the full picture:
- **All three margins on one page:** gross → operating → net, as a waterfall.
- **Gross vs net sales** (returns, discounts, allowances).
- **Target-margin pricing** (cost + target margin → price + markup), shared with the Markup page.
- **Per-unit or totals, plus multi-product blended margin.**
- **UK "GP" wording** supported in the content.
- **Margin ↔ markup conversion** always visible.

## 3. Calculator spec

### 3.1 Tabs

1. **Gross margin** (default)
2. **Full P&L** (gross / operating / net)
3. **Price for a target margin**
4. **Several products**

### 3.2 Inputs and engine

**Gross margin tab:** revenue (or price per unit × units) and COGS (or cost per unit × units).
```ts
grossProfit = revenue - cogs ; grossMargin = grossProfit / revenue      // null if revenue == 0
markup      = grossProfit / cogs                                        // via pricing-engine
```

**Full P&L tab:**
- Optional gross sales, minus returns, discounts and allowances, gives net sales (revenue).
- Then COGS gives gross profit.
- Then operating expenses (rent, salaries, marketing, other; add rows) give operating profit (EBIT).
- Then interest and taxes give net profit.

Outputs:
- gross margin %, operating margin %, net margin %;
- a **waterfall bar** (CSS or inline SVG): revenue → COGS → opex → interest/tax → net;
- each line as % of revenue.

Negative margins are allowed and explained ("you're losing $X on every $100 of sales").

**Target margin tab:** cost + target margin % gives the price, profit and equivalent markup (`pricing-engine.priceFromMargin`). Optional fee %, using the same formula as Markup.

**Several products tab:** rows of product, units, price and cost. Outputs margin per row and a **blended margin** = Σ profit ÷ Σ revenue. Never average the percentages; explain why in one line.

### 3.3 Tests

- Gross margin with revenue 0 returns `null`.
- A negative gross profit gives a negative margin and the right message.
- Full P&L lines add up; the percentages of revenue are correct.
- Target margin round-trips with Markup (40% margin = 66.67% markup).
- Blended margin ≠ the average of the margins (a test case proves it).
- Engine snapshot for every page example and FAQ number.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Profit Margin Calculator – Gross, Net & Operating` (49; with suffix 61, so use `absoluteTitle`) |
| Meta | `Free profit margin calculator. Enter revenue and costs to get gross, operating and net profit margin, or find the price you need to hit a target margin.` |
| H1 | `Profit Margin Calculator: Gross, Operating & Net Margin` |
| BLUF | "Gross margin = (revenue − cost of goods sold) ÷ revenue × 100. If you sell for $100 and the goods cost $60, your gross margin is 40%." Compute it from the engine. |
| Primary placement | "gross margin calculator" in the first sentence, an H2 and the tool heading (the head term is "gross margin calculator", while the URL says profit margin) |
| Links out | Markup (strong), Contribution Margin & Break-Even (when built), Percentage Change, Unit Price |
| Links in | Markup (strong), Tools hub |

## 5. Content (~1,800–2,200 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the profit margin calculator | 4 tabs in one line each | 120 |
| 2 | Gross profit margin formula | Formula + 2 engine examples; "gross margin calculation" | 250 |
| 3 | Operating profit margin formula | What counts as operating expenses | 200 |
| 4 | Net profit margin formula (how to calculate net profit margin) | Interest + tax step, engine example | 200 |
| 5 | Gross vs operating vs net margin | Waterfall explanation | 200 |
| 6 | Gross sales vs net sales | Returns, discounts, allowances; net sales formula | 150 |
| 7 | Margin vs markup | Short version + link to Markup; engine table (5 rows) | 150 |
| 8 | How to price for a target margin | Engine example | 150 |
| 9 | What is a good profit margin? | **Only with a real, dated dataset** (e.g. NYU Stern Damodaran "Margins by Sector (US)", with year and link). Otherwise explain the factors and say margins vary by industry. **Never invent averages.** | 200 |
| 10 | GP and GP% (UK terms) | "How to work out a GP" | 100 |
| 11 | FAQ | §6 | 400 |

## 6. FAQ (11)

1. How do you calculate profit margin? (`calculate profit margin`)
2. What is the gross profit margin formula?
3. What is the net profit margin formula?
4. What is the operating profit margin formula?
5. How do you determine gross margin from price and cost?
6. What is a good profit margin? (dataset-backed only)
7. What's the difference between gross sales and net sales?
8. Is profit margin the same as markup?
9. Can profit margin be negative?
10. How do I work out GP%? (UK)
11. How do I find the price for a 30% / 40% / 50% margin? (engine numbers)

## 7. Done when

- [ ] `npm run verify` passes; tests cover §3.3; `pricing-engine` shared with Markup (no duplicate formulas).
- [ ] Competitor pages (Omni, CalculatorSoup, Xero, Calculator.net, Mercury) opened and their gaps noted in this folder as `03_Profit_Margin_Calculator_Competitor_Analysis.md` (no copied text).
- [ ] "Good margin" figures cited with a dataset link and year, or removed.
- [ ] Mobile 390 px checked; the waterfall scales.
- [ ] Routes, catalog (`business`), hub, internal links, docs updated.
