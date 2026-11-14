# Contribution Margin & Break-Even Calculator — Competitor Analysis

> **Target page:** KKCTools `/contribution-margin-calculator/` (Batch 3, Tier 3 #22)
> **Primary keyword:** `contribution margin and contribution margin ratio` — US 2,400 · KD 4 (cluster 4 keywords, 7,500 US vol). Head term `break even calculator` (KD > 30) missing from export — `TODO(owner)`.
> **SERP source:** ⚠ No Semrush SERP export. Competitors from live web search (2026-11-14). The primary keyword is **educational** — expect accounting textbooks/OER (Lumen, Saylor, OpenStax) and Investopedia. `TODO(owner): pull Google top 10.`
> **Pages visited:** 2026-11-14 — 5 read (GIGAcalculator, Omni, Calculate.co.nz, Lumen Learning, Simple Sheets). Calculator.net break-even URL 404.

---

## 0. How this was collected (read first)

- Read: GIGAcalculator break-even, Omni contribution margin, Calculate.co.nz break-even, Lumen Learning (SUNY managerial accounting, CC BY), Simple Sheets (spreadsheet templates).
- Search also returned Saylor Academy, OpenStax/Pressbooks, Pearson — **this keyword is taught in accounting courses**, so the page must teach clearly (textbook quality) *and* calculate.
- Meta and schema not readable. Word counts are estimates. Do not copy textbook text even if CC-licensed unless attributed — better to write our own (AGENTS.md rule 8).

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | gigacalculator.com/…/break-even-calculator.php | Large calc site | Break-Even Calculator | 900–1,000 |
| 2 | omnicalculator.com/finance/contribution-margin | Giant | Contribution Margin Calculator | ~700 |
| 3 | calculate.co.nz/break-even-calculator.php | NZ calc site | Break-Even Calculator | ~600 |
| 4 | courses.lumenlearning.com/suny-managacct/chapter/break-even-point/ | OER textbook | 5.6 Break-Even Point for a single product | 1,300–1,500 |
| 5 | simplesheets.co/break-even-calculator | Template seller | Break-Even Calculator | 700–800 |

**What this tells us:**
- **Contribution margin and break-even are taught together** (CVP analysis) — but the tools split them: Omni does CM + ratio; others do break-even only.
- **Simple Sheets is the most complete tool** (CM $, CM %, break-even units & revenue, target profit units, profit at planned units, chart, margin of safety in text).
- **Lumen (textbook) has the best teaching:** CM per unit, CM ratio, break-even units & dollars, **margin of safety** and rate, target profit, income statement proof.
- **GIGAcalculator has three maths errors** (pizza example, profit ignoring fixed costs, wrong target-units formula).

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Giga | Omni | Calc.co.nz | Lumen | Simple Sheets |
|---|---|---|---|---|---|
| Interactive tool | ✅ | ✅ | ✅ | ❌ | ✅ |
| CM per unit | ⚠️ | ✅ (total) | ✅ | (text) | ✅ |
| CM ratio % | ⚠️ margin % | ✅ | ❌ | (text) | ✅ |
| Total CM for units sold | ❌ | ✅ | ❌ | (text) | ✅ |
| Break-even units | ✅ | ❌ | ✅ | (text) | ✅ |
| Break-even revenue | ✅ | ❌ | ✅ | (text) | ✅ |
| Target profit → units / revenue | ⚠️ (formula wrong) | ❌ | ❌ | (text) | ✅ |
| Profit at planned volume | ⚠️ | ✅ profit | ❌ | — | ✅ |
| Margin of safety ($, units, %) | ❌ | ❌ | ❌ | (text) | ⚠️ text |
| Time to break even (monthly sales) | ✅ | ❌ | ❌ | ❌ | ⚠️ text |
| Price via margin % or markup % input | ✅ | ❌ | ❌ | — | ❌ |
| Multi-product / sales mix (weighted CM) | ❌ | ❌ | ❌ | ❌ (single product chapter) | ⚠️ text only |
| Operating leverage (DOL) | ❌ | ❌ | ❌ | ❌ | ❌ |
| What-if (price −x%, cost +y%) | ❌ | ❌ | ❌ | ❌ | ⚠️ scenario step |
| CVP chart | ✅ | ❌ | ❌ | ⚠️ image | ✅ |
| Contribution-format income statement | ❌ | ❌ | ❌ | ✅ | ❌ |
| Validation (price ≤ variable cost) | ❌ | ❌ | ✅ | — | ⚠️ |

---

## 3. Feature matrix — content and trust

| Item | Giga | Omni | Calc.co.nz | Lumen | Simple Sheets |
|---|---|---|---|---|---|
| CM & CM ratio explained | ⚠️ | ✅ | ✅ FAQ | ✅ | ✅ |
| Break-even units & dollars | ✅ | ❌ | ✅ | ✅ | ✅ |
| Margin of safety | ❌ | ❌ | ❌ | ✅ | ✅ |
| Target profit | ⚠️ wrong | ❌ | ❌ | ✅ | ✅ |
| Products vs services | ❌ | ❌ | ❌ | ❌ | ✅ |
| Break-even vs payback period | ❌ | ❌ | ❌ | ❌ | ✅ |
| Limitations (linear assumptions) | ❌ | ❌ | ❌ | ❌ | ✅ |
| Worked examples | 2 (1 wrong) | 1 | 1 | 3 | 2 |
| FAQ count | 0 | 0 | 3 | 0 | 6 |
| Named author | ✅ | ✅ + reviewers | ✅ reviewer | ✅ textbook authors | ❌ |
| Date | ✅ Mar 2026 | ❌ | ✅ Nov 2026 | ❌ | ❌ |
| Sources | ⚠️ irrelevant book | ⚠️ HBR | ❌ | ✅ textbook | ❌ |

---

## 4. Competitor-by-competitor detail

### GIGAcalculator — break-even
- Fixed costs, cost per unit, expected monthly units, and one of price / margin % / markup % → margin, markup, break-even units & revenue, **time to break even**, CVP chart with profit/loss zones.
- **Errors:** pizza example says 2,564 slices (that's $10,000 ÷ $3.90); correct = $10,000 ÷ ($3.90 − $2.50) ≈ **7,143**. “$160,000 net operating profit” at 40,000 units ignores $100,000 fixed costs (should be ~$60,000). Target-units formula wrong (should be (fixed + target) ÷ CM).

### Omni — contribution margin
- Price, variable cost, units, fixed costs → CM, CM ratio, profit. Example 100,000 units × ($12 − $8) = $400,000; ratio 33.33%. Sections: what is CM, how to calculate CM & ratio, example, why useful. No break-even, no FAQ.

### Calculate.co.nz — break-even
- Fixed costs, price, variable cost → break-even units, sales, CM; warning when price ≤ variable cost. Example $20,000 / $20 = 1,000 units = $50,000. **FAQs (3):** what is break-even · what is CM · how to lower break-even.

### Lumen Learning — break-even point (textbook, CC BY)
- CM per unit ($20 − $12 = $8), CM ratio (40%), break-even units (5,000), dollars ($100,000), **margin of safety** ($20,000; 16.67%), target profit (airline 200 tickets), income statement proof, CVP chart, video.
- **Weak points:** relies on video and “previous page”; garbled fractions; no tool.

### Simple Sheets — break-even calculator — **tool benchmark**
- Fixed costs, price, variable cost, target profit, planned units, scenario step → CM $, CM %, break-even units & revenue, units for target, profit at plan, status, chart.
- Content: formula, CM, units vs dollars, products vs services, target profit, **margin of safety**, time to break even, **break-even vs payback**, real-world adjustments, limitation.
- **FAQs (6):** formula · CM · units or dollars · lower break-even · multiple products · good margin of safety.
- **Weak points:** $79 template upsell mid-page; multi-product only described.

---

## 5. Patterns

- **Formulas (CVP):** CM/unit = P − VC · CM ratio = CM ÷ P (= total CM ÷ sales) · break-even units = FC ÷ CM/unit · break-even $ = FC ÷ CM ratio · target units = (FC + target profit) ÷ CM/unit · margin of safety = actual sales − break-even sales (% = ÷ actual) · DOL = total CM ÷ operating income · weighted CM (mix) = Σ(mix % × CM/unit) · after-tax target: target before tax = after-tax target ÷ (1 − t).

| Section | Pages (of 5) |
|---|:---:|
| CM + break-even in one tool | 1 |
| Margin of safety in tool | **0** |
| Sales mix | **0** |
| Operating leverage | **0** |
| Contribution income statement | 0 tools (1 text) |
| FAQ | 2 |

---

## 6. FAQ question bank

★ = asked on 2+ pages.

| # | Question | Seen on |
|---:|---|---|
| 1 | ★ What is contribution margin? | Calc.co.nz, Simple Sheets, Omni |
| 2 | ★ How do I lower my break-even point? | Calc.co.nz, Simple Sheets |
| 3 | ★ What is the break-even formula / point? | Calc.co.nz, Simple Sheets |
| 4 | What is the contribution margin ratio and how is it used? | Omni, Lumen |
| 5 | Should I calculate break-even in units or dollars? | Simple Sheets |
| 6 | How does break-even work with multiple products? | Simple Sheets |
| 7 | What is a good margin of safety? | Simple Sheets |
| 8 | How many units for a target profit? | Lumen, Simple Sheets |
| 9 | Contribution margin vs gross margin — what's the difference? | — (nobody; links Profit Margin #3) |
| 10 | What is operating leverage? | — |
| 11 | How long until I break even? | Giga (tool), Simple Sheets (text) |
| 12 | Is a negative contribution margin possible? | — (Calc.co.nz warning only) |

---

## 7. Gaps nobody fills — our opportunities

1. **CM + CM ratio + break-even + target profit + margin of safety** in one tool.
2. **Sales-mix mode:** several products → weighted CM, break-even by product.
3. **Contribution-format income statement** generated from inputs (teaching view).
4. **Operating leverage (DOL)** and “profit change if sales +10%”.
5. **What-if sliders** (price, variable cost, fixed cost).
6. **After-tax target profit.**
7. **Time to break even** from monthly volume (Giga-style, done right).
8. **Contribution margin vs gross margin** explainer (link Profit Margin #3).
9. **Student-friendly worked examples** matching how courses present CVP — with an “exam check” step-by-step output.
10. **Correct maths** (Giga has 3 errors).

---

## 8. Blueprint for the KKCTools Contribution Margin & Break-Even Calculator

### 8.1 SEO

- **URL:** `/contribution-margin-calculator/`
- **Title/H1/Meta:** from Batch 3 file; H2 “Contribution margin and contribution margin ratio” verbatim.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Inputs | price/unit, variable cost/unit, fixed costs (period), units sold (actual/planned), target profit (pre- or after-tax + tax %) |
| Outputs | CM/unit, total CM, CM ratio, operating income, break-even units & $, target units & $, margin of safety ($, units, %), DOL |
| Mix mode | rows of products with price, VC, mix % → weighted results |
| Statement | contribution-format income statement |
| Chart | CVP chart (SVG) |
| What-if | sliders |
| UX | currency, step-by-step working, share URL, no network |

### 8.3 Content outline (≈ 1,600–2,000 words, original)

1. Contribution margin and contribution margin ratio — definitions + formulas
2. How to use
3. Worked example (engine)
4. Break-even point in units and dollars
5. Target profit (incl. after-tax)
6. Margin of safety
7. Operating leverage
8. Multiple products — sales mix
9. Contribution margin vs gross margin
10. Limitations of CVP
11. FAQ (10)
12. Related tools — Profit Margin (#3), Markup (#2), Business Valuation (#11), Percentage Change (#1)

### 8.4 Quality checks

- Unit tests for every formula, mix mode, statement totals, DOL.
- No competitor/textbook wording copied. `npm run check:no-network` passes.
- `TODO(owner): pull Google top-10 SERP and the missing break even calculator keyword data.`
