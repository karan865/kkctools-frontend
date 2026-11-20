# Contribution Margin & Break-Even Calculator — Build Spec

> **URL:** `/contribution-margin-calculator/` · Batch 3 Part 2 · Tier 1 · **Build order 7**
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + Part 2)
> **Inputs used:** `22_Contribution_Margin_Break_Even_Calculator_Competitor_Analysis.md` (5 pages), `KKCTools_Batch3_Final_Tool_Keywords.md` §2 #9
> **Written:** 2026-11-20

---

## 0. Strategy note

**SERP:**
- For `contribution margin calculator`, only one strong relevant tool (Omni 84).
- Six results are articles or gross-margin calculators (a different metric).
- The two relevant tools are AS 9–29.

**Audience and volume:**
- Students (CVP analysis) and small-business owners.
- ~7,500 searches at KD 4–22, but all four exported rows are **declining**.

**Decision:**
- `TODO(owner)`: pull `break even calculator` (not in the exports, KD > 30).
- If it is big, keep this URL and add an H2 + tab named "Break-even calculator". **Don't** create a second page; the two topics share one SERP family.

It extends the live Markup and Profit Margin pages (shared `pricing-engine` vocabulary).

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | contribution margin and contribution margin ratio | 2,400 | 4 | H2 **verbatim**, first paragraph, H1 wording |
| Secondary | contribution margin equation | 1,900 | 17 | H2 formula block |
| Secondary | contribution margin ratio formula | 1,900 | 22 | H2 formula block |
| Secondary | define contribution margin | 1,300 | 6 | first sentence + FAQ |
| Natural phrases | contribution margin calculator · calculate contribution margin · how to calculate contribution margin · break-even point · break-even calculator | (1.6K each for the two "calculate" rows, per the keyword file) | — | title, H2s, FAQ |

## 2. Our edge (from 5 competitors)

- **All of CVP in one tool:** CM per unit, total CM, CM ratio, break-even (units and $), target-profit units, margin of safety, operating leverage. Simple Sheets comes closest; **margin of safety, sales mix and DOL are in 0 tools**.
- **Sales-mix mode:** several products → weighted CM and break-even by product.
- **Contribution-format income statement** generated from the inputs (the teaching view students need).
- **After-tax target profit.**
- **Time to break even** from monthly volume.
- **CM vs gross margin explained** (nobody does it); link Profit Margin.
- **"Exam check" step-by-step working** matching how courses present CVP.
- **Correct maths.** GIGAcalculator has 3 errors: wrong pizza example, profit ignoring fixed costs, wrong target-units formula.

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **Single product** (default)
2. **Sales mix** (several products)
3. **What-if** (sliders: price, variable cost, fixed costs)

### 3.2 Input guide diagram (above the inputs, rules §9)

`CmInputGuide.tsx`: one unit's price drawn as a horizontal bar.

- The bar splits into:
  - "2 Variable cost per unit" (materials, commission, shipping);
  - the remainder, labelled "= Contribution margin per unit".
- Beside it, a small stack of these CM slices fills a box labelled "3 Fixed costs (rent, salaries)". Caption: "How many slices fill the box = break-even units".
- Below: badges "4 Units sold" and "5 Target profit" next to the box (target profit adds a second box on top).
- **Sales-mix tab:** 2–3 coloured bars of different lengths with "% of mix".
- Live values; the focused field highlights.

The diagram teaches the core idea (each unit chips in toward fixed costs) before any numbers.

### 3.3 Inputs (defaults = examples)

| # | Field | Default |
|---:|---|---|
| 1 | Selling price per unit | $50 |
| 2 | Variable cost per unit | $30 |
| 3 | Fixed costs for the period (month or year, selectable) | $20,000 |
| 4 | Units sold (actual or planned) | 1,500 |
| 5 | Target profit (pre-tax, or after-tax + tax %) | $15,000 |
| — | Monthly unit volume (for time to break even) | optional |
| Mix tab | rows: product, price, variable cost, mix % (or units) | 2 example rows |

### 3.4 Engine (`src/lib/contribution-margin-engine.ts`)

```ts
cmUnit = price - vc ; cmRatio = cmUnit / price          // null if price <= 0
totalCm = cmUnit * units ; operatingIncome = totalCm - fixed
breakEvenUnits = fixed / cmUnit                         // null if cmUnit <= 0 → UI: "each sale loses money"
breakEvenSales = fixed / cmRatio
targetUnits = (fixed + targetPreTax) / cmUnit ; targetPreTax = targetAfterTax / (1 - t)
marginOfSafetyUnits = units - breakEvenUnits ; mosSales = mos * price ; mosPct = mos / units
dol = totalCm / operatingIncome                         // null if operatingIncome == 0; explain negative
profitIfSalesChange(pct) = operatingIncome * (1 + dol*pct)   // show "+10% sales → +X% profit"
mix: weightedCm = Σ(mix_i * cm_i) ; breakEvenTotalUnits = fixed / weightedCm ; per product = total * mix_i
statement: sales − variable costs = CM − fixed = operating income
```

**Worked example (defaults):**

| Item | Value |
|---|---|
| CM per unit | $20 |
| CM ratio | 40% |
| Break-even | 1,000 units = $50,000 sales |
| Operating income at 1,500 units | $10,000 |
| Margin of safety | 500 units / $25,000 / 33.33% |
| DOL | 3.0 |
| Units for a $15,000 profit | 1,750 |

### 3.5 Outputs

- **Headline:** CM per unit + CM ratio. Second row: break-even units and $.
- **Sentence:** "Each unit sold for $50 with $30 of variable cost contributes $20 (a 40% contribution margin ratio). With $20,000 of fixed costs you break even at 1,000 units ($50,000 of sales)."
- **Contribution-format income statement** (table).
- **CVP chart (inline SVG, results column):** revenue line, total-cost line, break-even point marked, profit/loss areas.
- Margin of safety, DOL, target-profit cards.
- "Show working" step-by-step (exam style).
- Share URL, Copy, Print.

### 3.6 Tests

- Every formula with the defaults.
- `cmUnit` ≤ 0 → `null` break-even + message.
- After-tax target.
- Mix weighted CM ≠ simple average (a test case proves it).
- Statement totals; DOL sign cases.
- Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Contribution Margin Calculator – Ratio & Break-Even` (51, over 60 with the suffix → `absoluteTitle`) |
| Meta | `Free contribution margin calculator. Enter price, variable cost and fixed costs to get contribution margin per unit, the ratio and the break-even point.` (152) |
| H1 | `Contribution Margin Calculator: Ratio and Break-Even Point` |
| BLUF | "Contribution margin is what each sale leaves after variable costs: price − variable cost per unit. The contribution margin ratio is that amount ÷ price. A $50 product with $30 of variable cost has a $20 contribution margin and a 40% ratio." (engine) |
| ToolShell pills | `Break-even in units & $`, `Margin of safety`, `Sales-mix mode`, `Step-by-step working` |
| Links out | Profit Margin (strong), Markup, Business Valuation (when built), Percentage Change |
| Links in | Profit Margin (add a "contribution margin" link), Markup, Tools hub "Business maths" |

## 5. Content (~1,700–2,000 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | Contribution margin and contribution margin ratio | Definitions (`define contribution margin`) | 200 |
| 2 | Contribution margin equation and ratio formula | Both formulas + engine example (`contribution margin equation`, `contribution margin ratio formula`) | 200 |
| 3 | How to use the calculator | 3 tabs | 100 |
| 4 | Break-even point in units and dollars | Engine example | 200 |
| 5 | Units needed for a target profit (incl. after tax) | Engine example | 150 |
| 6 | Margin of safety | Engine example | 130 |
| 7 | Operating leverage (DOL) | "+10% sales → +30% profit" example | 150 |
| 8 | Several products: sales mix | Engine example | 180 |
| 9 | Contribution margin vs gross margin | Variable vs COGS; link Profit Margin | 150 |
| 10 | Limits of break-even analysis | Linear assumptions, step costs | 100 |
| 11 | FAQ | §6 | 400 |

## 6. FAQ (11)

1. What is contribution margin? (`define contribution margin`)
2. What is the contribution margin ratio, and how is it used?
3. What is the contribution margin equation?
4. How do I calculate the break-even point?
5. Break-even in units or in dollars: which should I use?
6. How many units do I need to sell to make a target profit?
7. What is margin of safety?
8. How does break-even work with several products?
9. Contribution margin vs gross margin: what's the difference?
10. Can contribution margin be negative?
11. How can I lower my break-even point?

## 7. Done when

- [ ] `contribution-margin-engine.ts` + tests; `npm run verify` passes.
- [ ] Input guide diagram above the inputs; CVP chart in results; ToolShell + TabSlider used.
- [ ] `TODO(owner)` note in docs about pulling `break even calculator` data.
- [ ] Registrations + docs updated; Profit Margin links here; `graphify update .`.
