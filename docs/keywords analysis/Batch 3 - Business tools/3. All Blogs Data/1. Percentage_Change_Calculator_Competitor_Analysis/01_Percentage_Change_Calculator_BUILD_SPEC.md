# Percentage Change Calculator — Build Spec

> **URL:** `/percentage-change-calculator/` · Batch 3 · **Build order 5**
> **Read first:** `../00_BATCH3_BUILD_RULES.md`
> **Inputs used:** `01_Percentage_Change_Calculator_Competitor_Analysis.md` (8 pages, 2026-11-14), `KKCTools_Batch3_Final_Tool_Keywords.md` §2b (owner's Semrush SERP), Semrush exports
> **Written:** 2026-11-18

---

## 0. Strategy note (important)

`percentage increase calculator` (74K, KD 2) was **removed in the SERP check**. 9 of the 10 results are on-topic pages at AS 67–100 (CalculatorSoup, Omni, Britannica, Canva, percentagecalculator.net, Pearson, Calculator.net), and an AI Overview shows. KD 2 is misleading.

**Plan:**
1. Build the best all-in-one percentage tool anyway. It is a strong **internal-link hub** for Markup, Margin, Unit Price and Hourly.
2. Target the **long-tail "how to" and Excel queries** first (below), where giants answer poorly.
3. Treat the head term as a long-term goal after the site has links.

## 1. Keywords

| Role | Keyword | US vol | KD |
|---|---|---:|---:|
| Head (long-term) | percentage increase calculator | 74,000 | 2 (SERP strong) |
| **Primary for now** | how to find percent change | 8,100 | 10 |
| Secondary | percentage change formula | 6,600 | 12 |
| Secondary | how do you calculate percentage change | 2,900 | 13 |
| Secondary | percentage difference between two numbers | 2,900 | **7** |
| Secondary | decreased by percent | 1,600 | 12 |
| Secondary | how to find percent decrease calculator | 720 | **0** |
| Support | percent increase | 6,600 | 22 |
| Support | how to calculate percent difference · how to calculate percentage difference | 12,100 · 2,900 | 28 · 23 |
| Support (Excel cluster, ~20K) | percentage change formula excel 3,600/24 · increase in percentage formula excel 3,600/29 · excel percentage formula 2,900/26 · percent change excel formula 2,400/28 · excel formula for percent difference 1,900/27 · percent increase formula excel 1,900/26 · percentage change excel formula 1,900/28 | | 24–29 |
| Long tail ("X% of Y") | what's 10 percent of 50 1,900 · 10 is 25 percent of what 1,600 · 10 000 5 percent 1,000 | | 8–26 |

**Not this page:**
- "percent off" and discount terms (`off percent calculator` 6.6K, `40 percent off 30`). These belong to the Discount Calculator.
- `percent error calculator` (5.4K, KD 11). This needs a separate small page later; note it in docs as a next tool idea.

## 2. Our edge

From the analysis of 8 pages:
- **Giants split the topic over 5+ URLs. We do every percentage job on one page with tabs.**
- **Correct Excel/Sheets formula for the user's own cells.** Only Omni tries, and its steps give a result 100× too big.
- **Percent vs percentage points:** 0 of 8 explain it.
- **List mode** (many old → new pairs): 0 of 8.
- **Edge cases inside the tool** (zero start, negatives, >100%): partial at best elsewhere.
- **Step-by-step with the user's numbers + a light visual bar.**

## 3. Calculator spec

### 3.1 Tabs (URL hash per tab so each can be linked: `#change`, `#difference`…)

1. **% change** (old → new, signed). Default tab, defaults 80 → 100.
2. **% difference** (two values, no direction).
3. **Increase / decrease by %** (x and p → new value).
4. **Find the original** (new value + % → original; reverse percentage).
5. **X% of Y**
6. **X is what % of Y**
7. **Percentage points** (rate A → rate B: pp change and % change, side by side)
8. **List mode** (paste old/new pairs: change per row, average change, total change)

### 3.2 Engine (`percent-engine.ts`, shared)

```ts
pctChange(o, n)      = (n - o) / Math.abs(o) * 100         // null if o == 0 → UI: "undefined; absolute change = n - o"
pctDifference(a, b)  = Math.abs(a - b) / ((a + b) / 2) * 100  // null if a + b == 0
applyPct(x, p)       = x * (1 + p / 100)                    // decrease = negative p
reversePct(n, p)     = n / (1 + p / 100)                    // null if p == -100
pctOf(p, y)          = p / 100 * y
whatPct(x, y)        = x / y * 100                          // null if y == 0
ppDifference(a, b)   = { points: b - a, percent: pctChange(a, b) }
listChanges(pairs)   = rows + average of pct changes + total change (Σnew vs Σold) — explain why they differ
excelFormula(mode, {oldCell:'A2', newCell:'B2'}) -> {
  change:     '=(B2-A2)/ABS(A2)',     // then Format → Percent (do NOT also ×100)
  difference: '=ABS(A2-B2)/AVERAGE(A2,B2)',
  increaseBy: '=A2*(1+B2)',           // B2 holds a % value like 15%
  original:   '=A2/(1+B2)',
  pctOf:      '=A2*B2',
  whatPct:    '=A2/B2'
}
```

The user can edit the cell names ("my old value is in C5"). The formula updates, with a copy button and a note that it works the same in Google Sheets.

### 3.3 Outputs (each tab)

- Big result with direction word ("25% increase") and the absolute change.
- Step-by-step with the user's numbers.
- Plain sentence for featured snippets: "Going from 80 to 100 is a 25% increase (an increase of 20)."
- A light visual bar (old vs new), CSS only.
- Excel/Sheets formula box.
- Swap button (old ↔ new); copy; share URL.

**Edge cases shown in the UI:**
- zero start: "Percent change from 0 is undefined. The change is +N";
- a negative start explained;
- changes over 100% explained ("a 150% increase means 2.5× the original").

### 3.4 Tests

- Every function, including null cases.
- 80 → 100 = 25%; 100 → 80 = −20% (the asymmetry is tested and explained on the page).
- % difference of 80 and 100 = 22.22%.
- Reverse: 115 after +15% gives 100.
- pp: 4% → 5% = +1 pp = +25%.
- List: average of % changes ≠ total change % (test proves it).
- Excel strings are exact for every mode and custom cell names.
- -0 normalised; no NaN or Infinity anywhere.
- Every page example and FAQ number equals the engine output (snapshot).

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Percentage Change Calculator – Increase & Decrease` (50; use `absoluteTitle`) |
| Meta | `Free percentage change calculator. Find percent increase, decrease or difference between two numbers, reverse a percentage, and copy the Excel formula.` |
| H1 | `Percentage Change Calculator: Increase, Decrease & Difference` |
| BLUF | "To find percent change, subtract the old value from the new value, divide by the old value and multiply by 100. From 80 to 100 that's (100 − 80) ÷ 80 × 100 = 25%." Engine-computed. |
| Links out | Markup, Profit Margin, Unit Price (shrinkflation), Hourly to Salary (raise), Discount (when built) |
| Links in | all four Batch 3 maths tools + Tools hub ("Business maths" row) |

## 5. Content (~1,700–2,000 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to find percent change | Formula + 3 engine examples (price, salary, test score). Targets the primary. | 250 |
| 2 | Percentage change formula | Written formula, why the old value goes on the bottom | 150 |
| 3 | Percent increase vs percent decrease | Why 80→100 (+25%) ≠ 100→80 (−20%) | 150 |
| 4 | Percentage difference between two numbers | When to use difference vs change | 200 |
| 5 | How to increase or decrease a number by a percentage | "decreased by percent" | 150 |
| 6 | How to find the original number (reverse percentage) | Engine example | 150 |
| 7 | Percentage change in Excel and Google Sheets | Formulas, Percent format pitfall (the ×100 mistake), ABS for negatives | 250 |
| 8 | Percent vs percentage points | Interest-rate example | 150 |
| 9 | Zero, negative and over-100% changes | Edge cases | 120 |
| 10 | FAQ | §6 | 400 |

## 6. FAQ (12)

1. How do you find percent change? (`how to find percent change`)
2. What is the percentage change formula?
3. How do you calculate percentage difference between two numbers?
4. Is percent difference the same as percent change?
5. How do I calculate percent decrease?
6. How do I add 10% (or 15%, 20%) to a number?
7. How do I find the original price before a percentage increase?
8. How do I calculate percentage change in Excel?
9. Can a percentage increase be more than 100%?
10. What is the percent change when the starting value is zero?
11. What's the difference between percent and percentage points?
12. What is 10% of 50? / 10 is 25% of what? (engine)

## 7. Done when

- [ ] `npm run verify` passes; `percent-engine` tests cover §3.4 and are reused by the other Batch 3 tools.
- [ ] All 8 tabs work, each with its own URL hash, and share via URL.
- [ ] Excel formulas checked by hand in a real spreadsheet (note the result in the PR or docs).
- [ ] Mobile 390 px: the tab bar scrolls; the formula box wraps.
- [ ] Routes, catalog (`business`), hub, internal links, docs updated.
- [ ] Docs note: `percent error calculator` (5.4K / KD 11) and Discount Calculator are follow-up pages.
