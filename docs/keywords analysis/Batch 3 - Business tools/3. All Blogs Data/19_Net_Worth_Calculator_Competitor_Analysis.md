# Net Worth Calculator — Competitor Analysis

> **Target page:** KKCTools `/net-worth-calculator/` (Batch 3, Tier 2 #19)
> **Primary keyword:** `calculate net worth` — US 2,900 · KD 9 · CPC $0.43 (cluster 6 keywords, 21,520 US vol, all KD ≤ 15) · YMYL: low
> **SERP source:** ⚠ No Semrush SERP export for Batch 3. Competitors from live web search (2026-11-14). `TODO(owner): pull Google top 10.`
> **Pages visited:** 2026-11-14 — 5 read (Inch Calculator, NerdWallet, PortfolioPilot, Financer, CompoundLadder). Blocked: Clark.com 403, Facet 403; Calculator.net URL 404.
> **Privacy rule for our build:** people enter their whole financial picture → nothing leaves the browser; optional local save only (localStorage, try/catch), with a clear “stored only on this device” note.

---

## 0. How this was collected (read first)

- Read: Inch Calculator, NerdWallet (CFP-written), PortfolioPilot (robo-advisor), Financer (finance comparison), CompoundLadder (calc site with Fed SCF benchmarks).
- Search also returned many bank/wealth-manager “learning center” calculators (white-label) — thin, duplicate.
- **Benchmarks by age must come from the Federal Reserve Survey of Consumer Finances (SCF), latest wave, with year and dollar basis** — competitors use old (2016–2019) or mislabelled figures. Don't copy their tables (AGENTS.md rule 8).

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | inchcalculator.com/net-worth-calculator | Giant | Net Worth Calculator | 1,300–1,500 |
| 2 | nerdwallet.com/article/finance/net-worth-calculator | Finance publisher | Net Worth Calculator: What Is My Net Worth? | ~700 |
| 3 | portfoliopilot.com/…/net-worth-calculator---tool | Robo-advisor | Net Worth Calculator - Tool | ~1,000 |
| 4 | financer.com/personal-finance/net-worth-calculator/ | Comparison site | Net Worth Calculator | ~1,200 |
| 5 | compoundladder.com/calculators/net-worth-calculator | Calc site | Net Worth Calculator (title: “US Median Net Worth at 40: $156K — 2026 Calculator”) | 2,000–2,300 |

**What this tells us:**
- **Simple formula, so differentiation is in the extras:** benchmarks by age, liquid vs total net worth, asset-mix breakdown, debt-to-asset ratio, change over time.
- **CompoundLadder is the most complete** (presets, compare scenarios, asset mix, liquid share, investable net worth, Fed SCF medians by age) — and puts a benchmark number in the title.
- **Trust bar is moderate** (NerdWallet CFP byline). Benchmarks are the main credibility risk (stale/mislabelled).

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | InchCalc | NerdWallet | PortfolioPilot | Financer | CompoundLadder |
|---|---|---|---|---|---|
| Asset fields | 7 fixed | 6 fixed | add rows freely | 7 fixed | 4 fixed |
| Liability fields | 6 fixed | 6 fixed | add rows freely | 5 fixed | 2 fixed |
| Custom rows | ❌ | ❌ | ✅ | ❌ | ❌ |
| Totals (assets, liabilities) | ❌ net only | ❌ net only | ✅ | ✅ | ✅ |
| Asset-mix breakdown / chart | ❌ | ❌ | ✅ table (weight) | ✅ chart | ✅ % |
| Debt-to-asset ratio | ❌ | ❌ | ❌ | ✅ | ✅ |
| Liquid net worth | ❌ | ❌ | ❌ | ❌ | ⚠️ liquid share |
| Investable / excl. home equity | ❌ | ❌ | ❌ | ❌ | ✅ |
| Change vs last period | ❌ | ❌ | ✅ month-over-month | ❌ | ❌ |
| Compare scenarios / presets | ❌ | ❌ | ❌ | ❌ | ✅ 4 presets + pin |
| Benchmark vs your age | ❌ | ❌ | ❌ | ❌ | ⚠️ text table |
| Pre-tax retirement haircut option | ❌ | ❌ | ❌ | ❌ | ⚠️ advice only |
| Joint / household | ❌ | ❌ | ❌ | ❌ | ⚠️ example |
| Currency | $ | $ | $ | $ | $ |
| Save / print | ✅ share | ❌ | ⚠️ account | ❌ | ⚠️ pin |

---

## 3. Feature matrix — content and trust

| Item | InchCalc | NerdWallet | PortfolioPilot | Financer | CompoundLadder |
|---|---|---|---|---|---|
| Formula | ✅ | ✅ | ✅ | ✅ | ✅ |
| Worked example | 1 | 1 (home equity) | ❌ | ✅ sample | ✅ 3 personas |
| What counts as asset / liability | ✅ | ✅ | ✅ field-by-field | ✅ | ✅ |
| Valuation guidance (home, car, 401k) | ⚠️ | ❌ | ⚠️ | ⚠️ brief | ✅ |
| Income ≠ net worth | ❌ | ✅ | ❌ | ✅ FAQ | ❌ |
| How to improve net worth | ✅ | ❌ | ❌ | ✅ | ⚠️ templated |
| Benchmarks by age (sourced) | ❌ (2019 median only) | ⚠️ link | ❌ | ❌ (unsourced rule) | ✅ Fed SCF (labels off) |
| Negative net worth explained | ❌ | ⚠️ anecdote | ❌ | ✅ FAQ | ✅ FAQ |
| FAQ count | 3 | 0 visible | 0 | 6 | 8 |
| Named author | ✅ + MBA | ✅ CFP | ✅ CEO + compliance | ❌ | ⚠️ operator |
| Date | ❌ | ✅ Jun 2026 | ✅ Jul 2026 | ❌ | ✅ Oct 2026 |
| Sources | ✅ Fed 2016–19 | ⚠️ interview | ⚠️ marketing stats | ❌ | ✅ Fed SCF, Census, BLS, SSA, IRS |

---

## 4. Competitor-by-competitor detail

### Inch Calculator — net worth
- 7 asset + 6 liability fields → net worth only. Content: formula (and assets = liabilities + net worth), how to value assets (KBB, Zillow), liabilities, how to improve (increase assets, reduce debt), one example ($515k − $172k = $343k).
- **FAQs (3):** does net worth matter · average US net worth · do retirement accounts count. Median benchmark from **2016–2019** Fed data (stale).

### NerdWallet — net worth calculator (CFP)
- 6 + 6 fields → net worth. Content: what it is, why it matters, how to find it, **income is not net worth**, assets and liabilities explained. Example: $200k home − $150k loan = $50k. No benchmarks on page (link out). Updated Jun 2026.

### PortfolioPilot — net worth tool (robo-advisor)
- Free-form add asset/liability rows; optional last month's net worth → totals, net worth, **month-over-month change**, breakdown table (category, type, amount, weight). Field-by-field guide; what it doesn't do. Heavy sign-up CTAs; marketing fee stats.

### Financer — net worth calculator
- 7 + 5 fields → net worth, totals, **debt-to-asset ratio**, asset breakdown chart, summary. Sections: list what you own/owe, read, run again later, tips.
- **FAQs (6):** what is a good net worth · include my house? · does 401(k)/IRA count · net worth vs income · can it be negative · how often to calculate.
- **Weak points:** no liquid net worth; unsourced income-multiple rule; broker ads inside the tool.

### CompoundLadder — net worth calculator — **feature benchmark**
- 6 inputs; **4 presets**; **pin-to-compare**; outputs: totals, net worth, asset mix %, liquid share, debt-to-asset, **investable net worth (excl. home equity)**; templated advice.
- Benchmarks: Fed SCF medians by age band; income-multiple rule; valuation guidance (home, car, 401(k) tax haircut 0.75 suggested manually).
- **FAQs (8):** home value or equity · 401(k) pre/after tax · include Social Security · car · belongings · how often · good net worth by age · why negative.
- **Errors:** title says “at 40” but uses the 35–44 band; 2025-dollar figures under a 2026 title; repetition.

---

## 5. Patterns

- **Formulas:** net worth = total assets − total liabilities · liquid net worth = liquid assets (cash, savings, taxable investments) − liabilities (definitions vary — state ours) · debt-to-asset = liabilities ÷ assets · home equity = home value − mortgage · optional after-tax retirement value = balance × (1 − expected tax %).
- **Benchmarks:** Fed SCF median & mean by age, income percentile, education — triennial; must label survey year and dollar year.

| Section | Pages (of 5) |
|---|:---:|
| Custom rows | 1 |
| Liquid net worth | **0** (1 partial) |
| Change over time | 1 |
| Age benchmark (sourced) | 1 |
| Debt-to-asset | 2 |
| FAQ | 3 |

---

## 6. FAQ question bank

★ = asked on 2+ pages. Map to the 6 keywords (calculate net worth, net worth calculator, what is net worth, how to calculate net worth…).

| # | Question | Seen on |
|---:|---|---|
| 1 | ★ Do retirement accounts (401k/IRA) count? | InchCalc, Financer, CompoundLadder |
| 2 | ★ What is a good net worth / by age? | Financer, CompoundLadder, InchCalc (average) |
| 3 | ★ Should I include my house (value or equity)? | Financer, CompoundLadder |
| 4 | ★ Can net worth be negative? / why is mine negative? | Financer, CompoundLadder |
| 5 | ★ How often should I calculate it? | Financer, CompoundLadder |
| 6 | Net worth vs income? | NerdWallet, Financer |
| 7 | Does my car count? Personal belongings? | CompoundLadder |
| 8 | Should Social Security be included? | CompoundLadder |
| 9 | Does personal net worth matter? | InchCalc |
| 10 | What is liquid net worth? | — (nobody defines clearly) |
| 11 | How do I value my home / car / business? | — (partial) |
| 12 | How do I calculate net worth for a couple? | — |

---

## 7. Gaps nobody fills — our opportunities

1. **Both fixed categories and custom rows** (quick + flexible).
2. **Total, liquid and investable net worth** shown together with clear definitions.
3. **Age benchmark** vs latest Fed SCF (median & percentile bands) — correctly labelled year/dollar basis; non-US users see “benchmarks are US-only”.
4. **After-tax option** for pre-tax retirement accounts (editable %).
5. **Change tracker:** enter a previous snapshot → change $ and %, saved locally only.
6. **Household mode:** person A / person B / joint.
7. **Ratios:** debt-to-asset, liquid months of expenses (if monthly spend entered).
8. **Currency selector** (net worth is universal) — 0 competitors.
9. **Privacy-first and ad-free inside the tool** (vs Financer broker ads).
10. **Print/PDF statement** of assets and liabilities.

---

## 8. Blueprint for the KKCTools Net Worth Calculator

### 8.1 SEO

- **URL:** `/net-worth-calculator/`
- **Title/H1/Meta:** from Batch 3 keyword file; “calculate net worth” in H1 or first sentence.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Assets | cash, savings, taxable investments, retirement (pre-tax / Roth), home, other real estate, vehicles, business, other + custom rows |
| Liabilities | mortgage, HELOC, auto, student, credit cards, personal, other + custom rows |
| Options | after-tax haircut % on pre-tax retirement; household A/B/joint |
| Outputs | total, liquid, investable net worth; totals; asset mix chart (SVG); debt-to-asset; months of expenses covered |
| Benchmark | age band median (Fed SCF, labelled) |
| History | save snapshot locally → change over time |
| UX | currency, print statement, no network |

### 8.3 Content outline (≈ 1,400–1,800 words, original)

1. Intro (primary keyword)
2. How to calculate net worth (formula + example)
3. What counts as an asset — and how to value it
4. What counts as a liability
5. Liquid vs total vs investable net worth
6. Net worth by age (Fed SCF, dated, sourced)
7. Negative net worth — what it means
8. How to grow net worth
9. FAQ (10)
10. Related tools — Compound Interest (#21), How Long Will My Money Last (#20), Credit Card Payoff (#24), Investment Return (#27), Monthly Budget (Batch 5)

### 8.4 Quality checks

- Unit tests for totals, liquid/investable logic, ratios, haircut, change.
- Benchmarks from official SCF tables with year; `TODO(owner)` to update each new wave.
- Verify no data leaves the browser. `npm run check:no-network` passes.
- `TODO(owner): pull Google top-10 SERP; check Clark, Facet by hand.`
