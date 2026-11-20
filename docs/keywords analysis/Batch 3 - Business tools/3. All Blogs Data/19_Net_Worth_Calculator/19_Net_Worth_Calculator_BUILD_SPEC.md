# Net Worth Calculator — Build Spec

> **URL:** `/net-worth-calculator/` · Batch 3 **Part 3** · **Part 3 build order 5**
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + 2 + Part 3 §12–13)
> **Inputs used:** `19_Net_Worth_Calculator_Competitor_Analysis.md` (5 pages), `KKCTools_Batch3_Final_Tool_Keywords.md` §2b, Semrush exports
> **Written:** 2026-11-20

---

## 0. Strategy note

**The keyword file removed `net worth calculator`** (14,800, **KD 51**): Ramsey, NerdWallet, AARP, Empower, SEBI, Ameriprise.

**The definition long tail is very easy and large:**

| Keyword | US vol | KD |
|---|---:|---:|
| `net worth meaning` | 5,400 | **7** |
| `calculate net worth` | 2,900 | **9** |
| `how do i figure out my net worth` | 480 | **7** |
| `what is net worth` | 12,100 | 15 |

**Plan:** answer the definition in the first 2 sentences, then give the best free calculator:
- total, liquid and investable net worth;
- household mode;
- an asset-mix chart;
- a change tracker saved only on the device;
- a printable statement.

**Age benchmarks are the main credibility risk.** Use them only from the Federal Reserve's **Survey of Consumer Finances (SCF)** tables, read on federalreserve.gov, with:
- the survey year and dollar year;
- the link and the date checked.
- `TODO(owner)` / builder: read the latest SCF "by age" medians and means on federalreserve.gov before shipping.
- If that isn't done, ship **without** benchmarks. The tool is complete without them.

**Skip celebrity intent** ("what is her net worth", "how to find someone's net worth") and brand terms ("bankrate's net worth calculator").

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary (now)** | calculate net worth | 2,900 | 9 | H1 wording / first sentence, H2 "How to calculate net worth" |
| Secondary | net worth meaning · what is net worth | 5,400 · 12,100 | 7 · 15 | H2 "What is net worth?" (first section) + FAQ |
| Secondary | how do i figure out my net worth | 480 | 7 | FAQ + step list |
| Head (long-term) | net worth calculator | 14,800 | 51 | title, tool heading |
| Skip | celebrity / brand / foreign-language rows | — | — | — |

## 2. Our edge (from 5 competitors)

- **Fixed categories + custom rows** (quick and flexible).
- **Total, liquid and investable net worth together**, with our definitions stated. Nobody defines liquid net worth clearly.
- **After-tax option** for pre-tax retirement accounts (editable %).
- **Household mode:** person A / person B / joint.
- **Ratios:** debt-to-asset; months of expenses covered by liquid assets (if monthly spending is entered).
- **Change tracker:** save a snapshot **in this browser only** (`src/lib/storage.ts`, try/catch, clear button) → change $ and %.
- **Asset-mix SVG chart.** Printable statement of assets and liabilities.
- **Currency selector** (0 competitors). Privacy-first, with no broker ads inside the tool (Financer has them).
- **SCF age benchmark** only if verified (see §0).

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **My net worth** (default)
2. **Household** (A / B / joint columns)
3. **Track changes** (local snapshots)

### 3.2 Input guide diagram (above the inputs, rules §9)

`NetWorthInputGuide.tsx`: a balance scale.

- **Left pan, "What you own":** stacked icons:
  - 1 Cash & savings
  - 2 Investments
  - 3 Retirement accounts
  - 4 Home value
  - 5 Vehicles & other
- **Right pan, "What you owe":**
  - 6 Mortgage
  - 7 Car & student loans
  - 8 Credit cards & other debt
- **The beam** tilts with the live totals. The centre label shows "Net worth = own − owe".
- A small dotted outline around 1 + 2 is labelled "liquid".

Live values; the focused field highlights.

### 3.3 Inputs (defaults = examples, all editable; any row can be zero)

| Group | Rows | Example defaults |
|---|---|---|
| Assets | cash/checking, savings, taxable investments, retirement (pre-tax), retirement (Roth/after-tax), home value, other real estate, vehicles, business value, other + custom | $25,000 cash & savings · $40,000 investments · $120,000 retirement · $350,000 home · $15,000 vehicle |
| Liabilities | mortgage, home-equity loan/HELOC, auto loans, student loans, credit cards, personal loans, other + custom | $260,000 · 0 · $10,000 · $20,000 · $4,000 |
| Options | after-tax haircut % on pre-tax retirement; monthly spending (for months covered); currency | 0%, —, USD |

### 3.4 Engine (`src/lib/net-worth-engine.ts`)

```ts
totalAssets = Σ assets (pre-tax retirement × (1 - haircut) if set) ; totalLiabilities = Σ liabilities
netWorth = totalAssets - totalLiabilities          // can be negative → explain
liquidAssets = cash + savings + taxable ; liquidNetWorth = liquidAssets - (totalLiabilities - mortgage - heloc)   // definition stated in UI
investableNetWorth = liquidAssets + retirement - nonMortgageDebt   (definition stated)
debtToAsset = totalLiabilities / totalAssets       // null if assets 0
homeEquity = home - mortgage - heloc ; monthsCovered = liquidAssets / monthlySpend
mix = each asset / totalAssets ; change = (now - snapshot), pct
household: sums per column + joint
```

**Worked example (defaults):**

| Item | Value |
|---|---|
| Assets | $550,000 |
| Liabilities | $294,000 |
| **Net worth** | **$256,000** |
| Liquid net worth (by our definition) | $31,000 (= $65,000 liquid − $34,000 non-mortgage debt) |
| Debt-to-asset | 53.45% |
| Home equity | $90,000 |

### 3.5 Outputs

- **Headline:** net worth (with a negative-value explanation if below 0).
- **Sentence:** "You own $550,000 and owe $294,000, so your net worth is $256,000. Your liquid net worth (cash and taxable investments minus non-mortgage debt) is $31,000."
- Cards: total / liquid / investable; debt-to-asset; home equity; months covered.
- Asset-mix chart. Assets & liabilities statement (print). Change vs the saved snapshot.
- SCF benchmark card **only if verified** (survey year, dollar year, link, "US only").
- Share URL: **amounts only if the user opts in** (default: off, because these are personal finances).

### 3.6 Tests

- Totals; negative net worth; haircut.
- Liquid and investable definitions; debt-to-asset with zero assets → `null`.
- Household sums.
- Snapshot change (storage mocked; storage failure doesn't break the page).
- Snapshot of the page numbers.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Net Worth Calculator – Calculate Your Net Worth` (47; 59 with the suffix: OK) |
| Meta | `Free net worth calculator. Add up what you own and owe to calculate your net worth, liquid net worth and debt-to-asset ratio, privately in your browser.` (152) |
| H1 | `Net Worth Calculator: Calculate Your Net Worth in Minutes` |
| BLUF | "Net worth means everything you own minus everything you owe. To calculate net worth, add up your cash, investments, retirement accounts, home and other assets, then subtract your mortgage, loans and card balances. $550,000 − $294,000 = $256,000." (engine) |
| ToolShell pills | `Total, liquid & investable`, `Household mode`, `Track changes privately`, `Printable statement` |
| Links out | Compound Interest, Credit Card Payoff, How Long Will My Money Last (Part 2), Rental Property |
| Links in | Credit Card Payoff, Compound Interest, Tools hub "Money" |

## 5. Content (~1,500–1,800 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | What is net worth? | 2-sentence definition (`net worth meaning`, `what is net worth`) | 150 |
| 2 | How to calculate net worth | Steps + engine example (`calculate net worth`, `how do i figure out my net worth`) | 220 |
| 3 | What counts as an asset, and how to value it | Home, car, business, retirement (pre-tax note) | 220 |
| 4 | What counts as a liability | | 130 |
| 5 | Liquid vs total vs investable net worth | Our definitions | 180 |
| 6 | Net worth by age (US data) | **Only with verified SCF figures**; otherwise explain why comparisons mislead and skip numbers | 150 |
| 7 | What a negative net worth means | Common for students/new homeowners; not a judgement | 120 |
| 8 | How to grow your net worth | Practical, non-advisory | 150 |
| 9 | FAQ | §6 | 380 |

## 6. FAQ (10)

1. What does net worth mean? (`net worth meaning`)
2. How do I figure out my net worth? (`how do i figure out my net worth`)
3. Do retirement accounts count toward net worth?
4. Should I include my house at full value or just the equity?
5. Does my car count?
6. Can net worth be negative?
7. What is liquid net worth?
8. How often should I calculate my net worth?
9. Net worth vs income: what's the difference?
10. Is my data stored anywhere? (only in this browser, if you save a snapshot)

## 7. Done when

- [ ] `net-worth-engine.ts` + tests; `npm run verify` passes.
- [ ] Input guide (balance scale) above the inputs; ToolShell + TabSlider used.
- [ ] Benchmarks shown only from verified SCF tables (year + link + date) or omitted.
- [ ] Local snapshots opt-in and clearable; share-link amounts opt-in; registrations + docs updated; `graphify update .`.
