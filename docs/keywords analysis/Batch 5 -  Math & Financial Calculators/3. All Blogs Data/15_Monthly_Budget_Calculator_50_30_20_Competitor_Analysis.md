# Monthly Budget Calculator (50/30/20) — Competitor Analysis

> **Target page:** KKCTools `/budget-calculator/` (Batch 5, Tool #15 🟡)
> **Primary keyword:** `budgeting worksheets`, US 1,600 · KD 13 · CPC $2.60 · ad comp 1.00. Cluster of 4 keywords, 14,000 US searches. It includes `microsoft excel budget template` (6,600, which wants a file) and `sample budget spreadsheet` (2,900).
> **SERP source:** ⚠ No Semrush SERP export for Batch 5. Competitors come from a live web search for `50/30/20 budget calculator monthly budget worksheet` on 2026-11-14. `TODO(owner): pull Google top 10 for "budgeting worksheets" (likely government PDFs, NerdWallet, Vertex42, Microsoft templates).`
> **Pages visited (2026-11-14):** 4 read: Chime, DollarSprout, 101 Planners, Consumer.gov (FTC).
> **Partly or fully blocked:**
> - NerdWallet: navigation only; the calculator body was not returned.
> - TransUnion: 403.
> - PocketGuard: 403.
> - Nasdaq: timed out.

---

## 0. How this was collected (read first)

- **Who ranks:** a finance-brand SERP.
  - NerdWallet, TransUnion, Chime, PocketGuard, DollarSprout, Nasdaq, Yahoo (syndicated)
  - MAJORITY, 101 Planners, Michael Ryan Money
  - Ordio
  - **consumer.gov**, an FTC page with a fillable budget worksheet PDF
  - Most of these are lead-gen for apps, credit products or banks.
- **Four of the strongest brands could not be read.** `TODO(owner)`: open NerdWallet, TransUnion, PocketGuard and Nasdaq in a browser.
  - From the search snippets: TransUnion offers pay frequency and PDF/Excel export, and NerdWallet uses a three-bucket split.
- **YMYL-light (keyword file):** this is a planning tool, not financial advice. There is no product promotion and no data leaves the browser. The draft is saved locally only.
- **Excel intent:** `microsoft excel budget template` (6,600) wants a file. We offer a **CSV (and optionally XLSX) download generated in the browser.** `TODO(owner)`: XLSX would need a library that isn't on the allowed-dependency list, so CSV is the default.
- Arithmetic was re-checked. One factual error was found on 101 Planners (§4). No competitor text was copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | chime.com/blog/budget-calculator/ | Neobank blog | Budget Calculator: Simplify Your Monthly Budgeting | ~1,300 |
| 2 | dollarsprout.com/50-30-20-budget-calculator/ | Personal-finance affiliate | 50/30/20 Budget Calculator | ~750 |
| 3 | 101planners.com/50-30-20-calculator/ | Planner/printables site | 50/30/20 Rule Calculator (and Budget Spreadsheet) | 1,800–2,000 |
| 4 | consumer.gov/your-money/making-budget | US government (FTC) | Making a Budget (+ fillable worksheet PDF) | ~350 |
| — | nerdwallet.com/finance/calculators/nerdwallet-budget-calculator | Finance brand | 50/30/20 Budget Calculator | **body not returned** |
| — | transunion.com/tools/budget-calculator | Credit bureau | 50/30/20 Budget Calculator | **blocked (403)** |
| — | pocketguard.com/50-30-20-calculator/ | Budget app | 50/30/20 Budget Calculator | **blocked (403)** |
| — | nasdaq.com/articles/budget-calculator-50-30-20 | Finance media | Budget Calculator (50/30/20) | **timed out** |

**What this tells us:**
- **Most "calculators" only split income three ways:** 50 % needs, 30 % wants, 20 % savings.
- **Chime goes further.** It has category inputs (8 needs, 4 wants, 3 savings) and compares actual spending against 50/30/20. It does not describe its output and has no export.
- **101 Planners adds a downloadable 12-month spreadsheet.** It offers Quick or Detailed actual-vs-target modes and PDF/Excel downloads.
  - **Error:** it calls 50/20/30 "the same categories in a different order". It is a different split (20 % wants, 30 % savings).
- **Consumer.gov is the plain, trustworthy worksheet.** It lists the steps (list bills, income, subtract) and links a fillable PDF. It has no calculator.
- **No page combines all of these:**
  - itemised income (several sources, any pay frequency)
  - itemised expenses tagged needs / wants / savings-debt
  - totals and the amount left over
  - your % split against 50/30/20, with an editable rule (70/20/10, 60/20/20)
  - a printable worksheet and CSV
  - a local-only draft

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Chime | DollarSprout | 101 Planners | Consumer.gov |
|---|---|---|---|---|
| Take-home income → 50/30/20 split | ✅ | ✅ | ✅ | ❌ |
| Multiple income sources | ❌ | ❌ | ❌ | ⚠️ (worksheet) |
| Pay frequency (weekly, biweekly, semi-monthly) → monthly | ❌ | ⚠️ ("double semi-monthly", text only) | ❌ | ⚠️ (÷ 12 of yearly) |
| Itemised expenses | ✅ (15 fields) | ❌ | ✅ (Detailed mode) | ✅ (worksheet) |
| Tag items as needs / wants / savings | ✅ (fixed) | ❌ | ✅ | ❌ |
| Actual vs target comparison | ✅ (output not described) | ❌ | ✅ (verdict; tolerance undefined) | ⚠️ (manual) |
| Money left over / shortfall | ⚠️ | ❌ | ⚠️ | ✅ (manual) |
| Alternative rules (70/20/10, custom) | ⚠️ (text only) | ❌ | ❌ (50/20/30 described wrongly) | ❌ |
| Chart | ? | ❌ | ? | ❌ |
| Print / PDF | ❌ | ❌ | ✅ | ✅ (fillable PDF) |
| CSV / Excel download | ❌ | ❌ | ✅ (Excel/Sheets template) | ❌ |
| 12-month tracker | ❌ | ❌ | ✅ (spreadsheet) | ⚠️ ("each month" advice) |
| Saved draft (local) | ❌ | ❌ | ? | ❌ |
| Privacy statement | ❌ | ❌ | ⚠️ ("nothing leaves your browser", unverified) | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Chime | DollarSprout | 101 Planners | Consumer.gov |
|---|---|---|---|---|
| Needs vs wants defined | ✅ | ✅ (lists) | ✅ | ⚠️ |
| How to budget, step by step | ⚠️ | ⚠️ | ✅ | ✅ (3 steps) |
| Worked example (checked) | ❌ (not shown) | ⚠️ (one % shift) | ✅ (9-row table, all ✔) | ❌ |
| Irregular / variable income | ✅ (FAQ) | ❌ | ✅ (FAQ) | ✅ (÷ 12) |
| Debt treatment explained | ⚠️ | ✅ | ✅ (FAQ) | ❌ |
| Criticism and limits of 50/30/20 | ⚠️ | ⚠️ (thin) | ⚠️ | n/a |
| Errors | title/H1 mismatch | "bi-monthly" ambiguous | **50/20/30 misdescribed** | — |
| FAQ count | 5 | 0 | 9 | 0 |
| Named author | ✅ | ❌ | ✅ (LLB, MBA) | ❌ (FTC agency) |
| Date | ✅ Mar 2026 | ❌ | ✅ Aug 2026 | ✅ Aug 2024 |
| Promotion / affiliate | bank app | advertiser disclosure | downloads, CTAs | none |

---

## 4. Competitor-by-competitor detail

### 1. Chime — Budget Calculator (Rebecca Safier, Mar 2026)
- **Inputs:** after-tax income (with 401(k) contributions added back) and 15 category fields:
  - Housing, food, utilities, transport, health, insurance, minimum debt payments, other needs
  - Entertainment, dining, travel, other wants
  - Emergency fund, retirement, other savings
- **Output:** "compare to 50/30/20". The format is not described.
- **FAQs (5):**
  1. 70/20/10
  2. Variable income
  3. Saving less than 20 %
  4. How often to update
  5. Needs vs wants
- **Weak points:**
  - Title and H1 differ.
  - No sample output.
  - No export.
  - "Entertainment" is used as both a group and a field.
  - The 401(k) add-back is confusing.

### 2. DollarSprout — 50/30/20 Budget Calculator
- **Input:** take-home pay.
- **Output:** three buckets.
- **Category lists:**
  - Needs: housing, food, vehicle, utilities, insurance, loans
  - Wants: travel, streaming, events, dining
  - Savings/debt: emergency fund, high-interest debt, investing, employer match
- **Weak points:**
  - No itemised inputs, worksheet or FAQ.
  - "Bi-monthly" is ambiguous.
  - No author or date.
  - Advertiser disclosure on the page.

### 3. 101 Planners — 50/30/20 Rule Calculator and spreadsheet (Nicole Bar-Dayan, Aug 2026)
- **Calculator:** take-home pay, plus optional actual spending (Quick or Detailed). Gives a verdict.
- **Downloads:** PDF and Excel. A free 12-month spreadsheet for Excel and Google Sheets.
- **Table:** $2,500–$8,000 splits, all ✔.
- **FAQs (9):**
  1. Definition
  2. How to calculate
  3. Net vs gross
  4. Needs vs wants
  5. Debt
  6. High-cost needs
  7. The spreadsheet
  8. Irregular income
  9. Cost
- **Error:** "50/20/30 is the same three categories in a different order". It is actually a different allocation.
- **Weak points:** the "on target" tolerance is not defined; heavy calls to action.

### 4. Consumer.gov — Making a Budget (FTC, Aug 2024)
- **Steps:**
  1. List bills and expenses.
  2. Add up monthly income (yearly ÷ 12 if pay is irregular).
  3. Subtract; the result should be above zero.
- **Ongoing:** plan monthly, record daily spending, compare at month end.
- Links a **fillable budget worksheet PDF**.
- **Weak points:** no calculator; about 350 words. Its plain-language framing is useful for low-literacy users.

### Not read (`TODO(owner)` check manually)
- NerdWallet budget calculator: likely the #1 benchmark.
- TransUnion: pay frequency and PDF/Excel export, according to the snippet.
- PocketGuard: app lead-gen.
- Nasdaq.

---

## 5. Patterns

**Maths**
- Monthly income = Σ(source × periods per year ÷ 12):
  - weekly = 52
  - biweekly = 26
  - semi-monthly = 24
  - monthly = 12
  - yearly = 1
- Totals by tag: needs, wants, savings/debt, plus untagged items.
- Left over = income − Σexpenses.
- Your split % = each tag ÷ income.
- Target $ = income × rule %.
- Gap = actual − target.

**Rules**
- Presets: 50/30/20, 70/20/10, 60/20/20, 80/20, plus custom percentages that must sum to 100.
- Label every rule as a guideline, not advice.

**Tagging conventions**
- Minimum debt payments count as **needs**.
- Extra debt payments count as **savings/debt**.
- 101 Planners and DollarSprout follow this convention.
- `TODO(owner)`: confirm our wording.

**Gross vs net**
- The rule is applied to take-home pay.
- An optional "pre-tax deductions" note covers 401(k) contributions. There is no tax calculation (Batch 3 tax tools are on Hold).

**Export and storage**
- Printable worksheet built with print CSS.
- CSV download (client-side Blob).
- Draft saved in localStorage only, with a clear button.

**Coverage across the 4 pages read**

| Section | Pages (of 4) |
|---|:---:|
| 3-bucket split | 3 |
| Itemised + tagging | 2 |
| Actual vs target | 2 |
| Pay frequency | **0** (calculator) |
| Multiple incomes | **0** |
| Custom rules | **0** |
| Printable | 2 |
| CSV/Excel | 1 |

---

## 6. FAQ question bank

★ = asked on 2+ pages or a cluster keyword. Maps to: budgeting worksheets, how to budget money, microsoft excel budget template, sample budget spreadsheet.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is the 50/30/20 rule? | all |
| 2 | ★ How do I make a budget step by step? | Consumer.gov, 101P · `how to budget money` |
| 3 | ★ What counts as a need vs a want? | Chime, DollarSprout, 101P |
| 4 | ★ How do I budget with irregular income? | Chime, 101P, Consumer.gov |
| 5 | Should I use gross or take-home pay? | 101P, Chime |
| 6 | Where do debt payments go? | 101P, DollarSprout |
| 7 | What if my needs are more than 50 %? | 101P, Chime |
| 8 | What is the 70/20/10 rule? | Chime |
| 9 | Is there a free budget worksheet or spreadsheet I can download? | 101P, Consumer.gov · `budgeting worksheets`, `sample budget spreadsheet` |
| 10 | Can I use this as an Excel budget template? | `microsoft excel budget template` |
| 11 | How often should I update my budget? | Chime, Consumer.gov |

---

## 7. Gaps nobody fills — our opportunities

1. **Full worksheet-calculator:**
   - several income sources, each with its own pay frequency, converted to monthly
   - itemised expenses with a needs / wants / savings-debt tag, plus sensible default rows
   - users can add, rename and delete rows
2. **Results panel:**
   - totals, amount left over or shortfall
   - your % split against the chosen rule
   - the gap in $ for each bucket, plus a theme-aware bar chart
3. **Rule presets plus custom percentages.** Fixes the 50/20/30 confusion by explaining each split.
4. **Printable worksheet** (clean print layout) and a **CSV download**, both generated locally. CSV answers the Excel/spreadsheet searches without a server.
5. **Local draft only:** localStorage, a visible "clear" button, and a plain privacy note.
6. **Annual view** (monthly × 12) and an optional "irregular expenses" sinking-fund line (yearly bills ÷ 12).
7. **Neutral, non-promotional copy** with no product links, a "planning guide, not advice" note, and owner-approved wording.
8. **Links to** Net Worth (Batch 3 #19), How Long Will My Money Last (Batch 3 #20), Credit Card Payoff (Batch 3 #24), Hourly to Salary (Batch 3 #4).

---

## 8. Blueprint for the KKCTools Monthly Budget Calculator

### 8.1 SEO

- **URL:** `/budget-calculator/`
- **Title:** Budget Calculator – Monthly Budget Planner 50/30/20
- **H1:** Monthly Budget Calculator: Plan Income, Bills and Savings
- **Meta:** as in the keyword file (152 chars).
- **H2s:** budgeting worksheet · how to budget money · sample budget spreadsheet (CSV).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Income | N sources × frequency (weekly, biweekly, semi-monthly, monthly, yearly) → monthly |
| Expenses | Default rows (housing, utilities, groceries, transport, insurance, min. debt, phone, dining, entertainment, subscriptions, savings, extra debt…); add/rename/delete; tag N/W/S |
| Rule | 50/30/20 default; 70/20/10, 60/20/20, custom (must sum 100) |
| Outputs | Totals, left over, % split vs rule, $ gap per bucket, bar chart, annual view |
| Export | Print worksheet; CSV download (client-side) |
| Storage | localStorage draft + clear; nothing sent anywhere |
| Currency | Selector (neutral) |

### 8.3 Content outline (≈ 1,300–1,600 words, original)

1. Intro (primary keyword) and privacy note
2. How to use
3. How to budget money in 5 steps
4. The 50/30/20 rule explained, with an example
5. Needs, wants and savings: what goes where (debt, irregular bills)
6. Other budgeting rules (70/20/10, 60/20/20) and when to use them
7. Budgeting with irregular income
8. Printing your budget worksheet and downloading the spreadsheet (CSV opens in Excel and Sheets)
9. FAQ (10)
10. Related tools: Net Worth, How Long Will My Money Last, Credit Card Payoff, Hourly to Salary (Batch 3)

### 8.4 Quality checks

- **Unit tests:**
  - frequency conversion
  - tag totals and percentages
  - custom rule validation
  - CSV escaping
  - empty and negative rows
- **localStorage:** wrapped in try/catch and works without storage. No network calls.
- No competitor wording. No product promotion. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - pull Google top 10
  - check NerdWallet, TransUnion, PocketGuard and Nasdaq manually
  - decide between CSV only and XLSX (dependency approval)
  - approve the "not financial advice" wording
