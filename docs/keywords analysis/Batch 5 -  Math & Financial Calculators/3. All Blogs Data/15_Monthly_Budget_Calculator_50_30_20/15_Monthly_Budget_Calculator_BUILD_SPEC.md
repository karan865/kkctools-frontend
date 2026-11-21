# Monthly Budget Calculator (50/30/20) — Build Spec

> **URL:** `/budget-calculator/` · Batch 5 · Tier 2 · rank chance 🟡 · **Build order 18**
> **Read first:** `../00_BATCH5_BUILD_RULES.md` (§2.5: planning tool, not advice)
> **Inputs used:** `15_Monthly_Budget_Calculator_50_30_20_Competitor_Analysis.md` (4 pages read; NerdWallet, TransUnion, PocketGuard and Nasdaq not readable; 2026-11-14), keyword file §2 #15
> **SERP:** provisional. `TODO(owner)`: open the 4 unreadable brand pages in a browser.
> **Written:** 2026-11-22 (full rewrite after the research pass)

---

## 0. Strategy

**Easy, tool-like keywords** with **ad competition 1.0**, which means advertisers pay for this audience:

| Keyword | Volume | KD |
|---|---:|---:|
| `budgeting worksheets` | 1,600 | 13 |
| `how to budget money` | 2,900 | 12 |

**Spreadsheet searches** want a file:
- `microsoft excel budget template` (6,600, rising);
- `sample budget spreadsheet` (2,900).

We answer with a **CSV download generated in the browser**. XLSX would need a non-allowed library, so CSV is the default. `TODO(owner)`.

**The SERP is finance brands and lead-gen:** NerdWallet, TransUnion, Chime, PocketGuard, DollarSprout, 101 Planners, plus **consumer.gov** (an FTC page with a fillable PDF).

**What the competitors do and miss:**
- Most "calculators" only split income 50/30/20.
- Chime has category inputs, but no export and no output explanation.
- 101 Planners has a spreadsheet download.
  - It also has an **error**: it calls 50/20/30 "the same categories in a different order". It's a different split.

**No page combines:**
- several incomes with pay frequencies;
- tagged itemised expenses;
- actual vs target with editable rules;
- print + CSV;
- a local-only draft.

**Trust:**
- neutral copy;
- no product links;
- "planning guide, not financial advice";
- nothing leaves the browser.

## 1. Keywords and placement

| Role | Keyword | US vol | KD | Trend | Where it goes |
|---|---|---:|---:|:---:|---|
| **Primary** | budgeting worksheets | 1,600 | 13 | | H2 "Printable budgeting worksheet" + first sentence + print button label |
| Secondary | how to budget money | 2,900 | 12 | | H2 "How to budget money in 5 steps" + FAQ |
| Secondary | microsoft excel budget template | 6,600 | 27 | ↑ | H2 "Use it as an Excel or Google Sheets budget template (CSV)" + FAQ. **Never name Microsoft in the title** |
| Secondary | sample budget spreadsheet | 2,900 | 27 | ↑ | Same H2 + the default example rows act as the sample |
| Natural | budget calculator · 50/30/20 rule · monthly budget planner | — | | | Title, H1, H2 |

## 2. Our edge (4 competitors read)

| Feature | Competitors with it |
|---|---|
| 3-bucket split | 3/4 |
| Itemised expenses + needs/wants/savings tags | 2/4 |
| Actual vs target | 2/4 |
| **Several income sources, each with a pay frequency** (weekly ×52, biweekly ×26, semi-monthly ×24, monthly, yearly) | **0/4** |
| **Rule presets + custom** (50/30/20, 70/20/10, 60/20/20, 80/20; custom must total 100) with each split explained | **0/4** |
| Printable worksheet (print CSS) | 2/4 |
| CSV download (client-side) | 1/4 |
| Local draft + clear button + privacy note | 0 |
| Annual view; sinking-fund line (yearly bills ÷ 12) | 0 |

## 3. Calculator spec

### 3.1 Tabs

1. **Monthly budget** (default)
2. **Compare with a rule**
3. **Annual view**

### 3.2 Input guide diagram (above the inputs)

`BudgetInputGuide.tsx`:
- A wallet labelled "1 Take-home income (all sources, any pay frequency)" pours into three jars:
  - "2 Needs"
  - "3 Wants"
  - "4 Savings & extra debt payments"
- Each jar fills to its live share. The chosen rule's target sits as a dotted line on each jar.
- A small calendar icon is labelled "yearly bills ÷ 12".

### 3.3 Inputs (defaults = examples)

**Income:** salary $5,000 monthly take-home (+ "add source", with frequency).

**Default expense rows** (editable, renamable, deletable, taggable):

| Tag | Rows | Total |
|---|---|---:|
| Needs | rent $1,600, utilities $200, groceries $500, transport $250, insurance $200 | $2,750 |
| Wants | dining $300, entertainment $200, subscriptions $100, shopping $400 | $1,000 |
| Savings/debt | savings $500, extra debt payment $250 | $750 |

**Other settings:**
- Rule: 50/30/20.
- Currency selector (neutral).
- Tagging convention: minimum debt payments = needs; extra payments = savings/debt. `TODO(owner)`: confirm the wording.

### 3.4 Engine (`src/lib/budget-engine.ts`)

```ts
monthlyIncome = Σ amount × periodsPerYear / 12
totals by tag ; leftover = income − Σ expenses (negative → shortfall)
split% = tag / income ; target = income × rule% ; gap = actual − target
rule validation: custom % must sum to 100
annual = monthly × 12 ; sinkingFund = Σ yearly bills / 12
toCSV(rows, totals)    // opens in Excel / Google Sheets
draft: src/lib/storage.ts (try/catch), clear()
```

**Worked example (defaults, checked 2026-11-22):**

| | Needs | Wants | Savings |
|---|---:|---:|---:|
| Actual | $2,750 (55%) | $1,000 (20%) | $750 (15%) |
| 50/30/20 target | $2,500 | $1,500 | $1,000 |
| Gap | **+$250** | **−$500** | **−$250** |

$5,000 income → **$500 left over**.

### 3.5 Outputs

- **Totals card:** income, expenses, left over.
- **Sentence:** "Out of $5,000 a month, needs take 55%, wants 20% and savings 15%, with $500 left over. Compared with 50/30/20, needs are $250 over target."
- Bar chart (actual vs target).
- Gap table.
- Annual view.
- **Print worksheet** (clean A4/Letter layout) and **Download CSV**.
- "Saved only in this browser" + clear button.
- Disclaimer.

### 3.6 Tests

- Pay-frequency conversions; tag totals.
- Leftover/shortfall; custom rule validation.
- CSV escaping (commas, quotes).
- Storage failure doesn't break the page.
- The example above. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Budget Calculator – Monthly Budget Planner 50/30/20` (51; 63 with the suffix → `absoluteTitle`) |
| Meta | `Free monthly budget calculator. List income and expenses, compare them with the 50/30/20 rule and print a budget worksheet. Nothing leaves your browser.` (152) |
| H1 | `Monthly Budget Calculator: Plan Income, Bills and Savings` |
| BLUF | "List your take-home pay, tag every expense as a need, a want or savings, and see what's left. Under the 50/30/20 guideline, $5,000 a month would be $2,500 for needs, $1,500 for wants and $1,000 for savings. Print the budgeting worksheet or download it as a spreadsheet." (engine) |
| ToolShell pills | `Needs, wants & savings`, `50/30/20 or custom split`, `Printable worksheet & CSV`, `Saved only on your device` |
| Links out | Hourly to Salary (live), Credit Card Payoff (live), Net Worth (live), How Long Will My Money Last (live), Compound Interest (live) |
| Links in | Net Worth, Credit Card Payoff, Hourly to Salary (monthly gross section), Tools hub "Money" |

## 5. Content (~1,400–1,700 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the budget calculator | Tabs, privacy note | 100 |
| 2 | How to budget money in 5 steps | List income → list bills → tag → compare → adjust (`how to budget money`) | 220 |
| 3 | The 50/30/20 rule explained | Example. Describe it as a common guideline; attribute it only if the builder verifies the source (Elizabeth Warren's *All Your Worth*, 2005) | 180 |
| 4 | Needs, wants and savings: what goes where | Debt minimums vs extra payments; irregular bills | 180 |
| 5 | Other budgeting rules: 70/20/10 and 60/20/20 | When people use them; 50/20/30 is a *different* split | 130 |
| 6 | Budgeting with irregular income | Sinking fund, baseline month | 130 |
| 7 | Printable budgeting worksheet | Print layout | 80 |
| 8 | Use it as an Excel or Google Sheets budget template (CSV) | How to open the CSV (`microsoft excel budget template`, `sample budget spreadsheet`) | 120 |
| 9 | FAQ | §6 | 400 |
| — | Disclaimer | "Planning tool, not financial advice" | 30 |

## 6. FAQ (11, from the question bank)

1. What is the 50/30/20 rule?
2. How do I make a budget step by step? (`how to budget money`)
3. What counts as a need vs a want?
4. How do I budget with irregular income?
5. Should I use gross or take-home pay?
6. Where do debt payments go?
7. What if my needs are more than 50%?
8. What is the 70/20/10 rule?
9. Is there a free budget worksheet I can print? (`budgeting worksheets`)
10. Can I use this as an Excel budget template? (CSV)
11. How often should I update my budget?

## 7. Done when

- [ ] `budget-engine.ts` + tests; `npm run verify` passes.
- [ ] Print + CSV work offline; local draft opt-in with clear; no data sent.
- [ ] InputGuide above the inputs; ToolShell + TabSlider + fonts + `<main>`.
- [ ] Neutral copy; 50/30/20 attribution verified or omitted.
- [ ] Registrations + docs; `graphify update .`.
