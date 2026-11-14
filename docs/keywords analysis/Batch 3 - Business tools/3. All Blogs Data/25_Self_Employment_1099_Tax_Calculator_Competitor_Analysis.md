# Self-Employment (1099) Tax Calculator — Competitor Analysis

> **Target page:** KKCTools `/self-employment-tax-calculator/` (Batch 3, Tier 3 #25)
> **Primary keyword:** `1099 tax calculator` — US 9,900 · KD 6 · CPC $0.70 (cluster 7 keywords, 27,600 US vol) · YMYL: **high**
> **SERP source:** ⚠ No Semrush SERP export. Competitors from live web search (2026-11-14). `TODO(owner): pull Google top 10 — expect Keeper, Everlance, TurboTax, H&R Block, NerdWallet, IRS.`
> **Pages visited:** 2026-11-14 — 3 read (Everlance, Pilot, Driversnote). Failed: Keeper calculator URL 404, ustax.tools 403, Omni self-employment URL 404.
> **YMYL / data rule:** tax figures change every year. Every rate, bracket, wage base, deduction and mileage rate must be loaded from one dated data file with IRS citations (Pub 505, Schedule SE instructions, Rev. Proc. for brackets, IRS mileage notice). The keyword file already marks this Tier 3 because of yearly maintenance — `TODO(owner)` to confirm owner will update yearly before building.

---

## 0. How this was collected (read first)

- Read: Everlance (mileage-tracking app), Pilot (bookkeeping), Driversnote (mileage app).
- Search also returned Keeper (tax app — multiple URLs), ustax.tools, TripLog, MileageWise, terms.law (California), nationaltaxtools, countrytaxcalc.
- **Data conflict found:** Everlance says “2026” but uses the **$176,100** Social Security wage base (that's the 2025 figure); Driversnote uses **$184,500** for 2026. → verify on SSA.gov before use.
- Meta and schema not readable. Word counts are estimates. Do not copy text or tables (AGENTS.md rule 8).

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | everlance.com/tax-calculator | Mileage app | 1099 Tax Calculator | 2,000–2,500 unique |
| 2 | pilot.com/calculators/1099-contractor-tax-calculator | Bookkeeping | 1099 contractor tax calculator | ~500 |
| 3 | driversnote.com/blog/1099-tax-calculator | Mileage app | 1099 Tax Calculator: Estimate Your 2026 Taxes | 850–1,000 |
| — | keepertax.com (several), ustax.tools, omnicalculator.com | Tax app / calc | (404/403) | — |

**What this tells us:**
- **Searchers are gig workers / freelancers** wanting “how much tax do I owe / set aside / pay quarterly?” — SE tax + federal income tax (+ state) on 1099 profit, often with **mileage** (rideshare/delivery drivers).
- **Mileage apps dominate** (Everlance, Driversnote, TripLog, MileageWise) — they use the calculator to sell tracking.
- **Common gaps:** QBI deduction (Driversnote excludes; Everlance mentions), state tax, W-2 + 1099 combined (Everlance advanced only), quarterly safe-harbor rules.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Everlance | Pilot | Driversnote |
|---|---|---|---|
| Filing status | ✅ single/married | ❌ | ✅ |
| 1099 income | ✅ | ✅ | ✅ |
| Business expenses | ✅ other expenses | ✅ | ✅ (+ parking/tolls) |
| Mileage (standard rate) | ✅ | ❌ | ✅ (two rate periods) |
| W-2 income too | ✅ advanced | ❌ | ✅ optional |
| SE tax (92.35% × 15.3%, wage-base cap) | ✅ (stale cap) | ⚠️ flat 15.3% | ✅ (2026 cap) |
| Half of SE tax deduction | ✅ text | ❌ | ⚠️ |
| Additional Medicare 0.9% | ✅ text | ❌ | ❌ |
| Federal income tax (brackets, standard deduction) | ✅ | ✅ | ✅ |
| QBI (§199A) deduction | ⚠️ text | ❌ | ❌ excluded |
| State income tax | ✅ state dropdown | ❌ | ❌ excluded |
| Retirement / health insurance deductions | ⚠️ text | ❌ | ❌ excluded |
| Quarterly estimated payments | ✅ | ✅ | ✅ |
| Safe harbor (100% / 110% prior-year) | ❌ | ❌ | ❌ |
| Effective rate / % to set aside | ✅ | ✅ | ✅ |
| Tax year shown | ✅ 2026 (stale data) | ❌ | ✅ 2026 |

---

## 3. Feature matrix — content and trust

| Item | Everlance | Pilot | Driversnote |
|---|---|---|---|
| SE tax explained | ✅ | ⚠️ | ✅ |
| Deductions list | ✅ (mileage, home office, health, retirement, QBI, half SE) | ❌ | ⚠️ mileage only |
| 1099 vs W-2 | ✅ | ❌ | ❌ |
| How/when to pay quarterly | ✅ | ⚠️ vague | ✅ dates + $1,000 rule |
| Tax-by-income table | ✅ (assumptions unstated) | ❌ | ❌ |
| Worked example | ✅ case study (mileage maths wrong) | ✅ 2 simple | ⚠️ (no working) |
| FAQ count | 12 | 0 | 3 (question H2s) |
| Named author | ❌ | ❌ | ❌ |
| Date | ⚠️ © 2025 | ❌ | ✅ Aug 2026 |
| IRS sources | ⚠️ Schedule SE link (mislabelled) | ❌ | ⚠️ |

---

## 4. Competitor-by-competitor detail

### Everlance — 1099 tax calculator
- Filing status, state, SE income, (advanced) W-2 income, mileage, other expenses → % of SE income owed, total, federal / state / SE breakdown.
- Content: how it works, SE rate 2026 (12.4% SS up to $176,100 — **stale**; 2.9% Medicare; +0.9% surtax), how much you'll owe (table $30k–$100k; $30k SE = $4,239 — checked correct), deductions, 1099 vs W-2, how to pay, quarterly formula.
- **FAQs (12):** how much to set aside · SE rate 2026 · quarterly required? · 1099 vs W-2 · calculate quarterly · deductible expenses · W-2 + 1099 · skipping quarterly · reduce SE tax · 1099-NEC vs 1099-K · filing deadline · accuracy.
- **Errors:** case study 12,400 mi × $0.725 = **$8,990**, page says $8,680; wage base stale; heavy duplication (same blocks 3–5×); 1099-K threshold contradictory.

### Pilot — 1099 contractor tax calculator
- Income and expenses → tax owed, quarterly payment, effective rate. Explains profit-based tax; examples ($100k − $75k contractors = $25k taxable). Thresholds: 1099-NEC > $2,000 paid; quarterly if ≥ $1,000 owed.
- **Weak points:** flat 15.3% without base; no tax year; vague quarterly guidance; promo.

### Driversnote — 1099 tax calculator 2026
- Filing status, 1099 income, business miles (two 2026 rate periods: 72.5¢ / 76¢ — **verify with IRS**), parking/tolls, other expenses, W-2 income → annual tax estimate, quarterly payment.
- Content: how to use, what it covers, **explicit exclusions** (state, credits, retirement/health, spouse SE, QBI, depreciation, Section 179), why track mileage, when to pay (Apr 15, Jun 15, Sep 15, Jan 15; $1,000 rule), how much to set aside (25–30% rule of thumb), mileage deduction.
- **Weak points:** widget not visible; unsupported “closer to 9%” example; no author.

---

## 5. Patterns

- **Maths (US, verify each year):** net SE earnings = gross 1099 − business expenses (incl. mileage × IRS rate) · SE tax = net × 92.35% × (12.4% up to SS wage base − W-2 wages + 2.9% all) (+0.9% additional Medicare over threshold) · AGI = net − ½ SE tax − SE health insurance − SEP/solo 401(k) · taxable = AGI − standard deduction − QBI (20% of qualified income, limits) · federal tax by brackets · quarterly = (total − withholding) ÷ 4, safe harbor = 100% (110% high income) of prior-year tax · SE tax not due if net < $400.
- **State tax:** 40+ states — big maintenance; MVP can take an “effective state %” input.

| Section | Pages (of 3) |
|---|:---:|
| Mileage | 2 |
| W-2 + 1099 | 2 |
| QBI in calc | **0** |
| State tax | 1 |
| Safe harbor | **0** |
| Correct current-year data | 1 |
| FAQ | 2 |

---

## 6. FAQ question bank

★ = asked on 2+ pages.

| # | Question | Seen on |
|---:|---|---|
| 1 | ★ How much should I set aside for taxes on 1099 income? | Everlance, Driversnote |
| 2 | ★ Do I have to pay quarterly taxes / when are they due? | Everlance, Driversnote, Pilot |
| 3 | What is the self-employment tax rate? | Everlance |
| 4 | How do I calculate quarterly estimated taxes? | Everlance |
| 5 | What expenses can I deduct (mileage, home office…)? | Everlance, Driversnote |
| 6 | Can I use it with W-2 and 1099 income? | Everlance |
| 7 | What happens if I don't pay quarterly? | Everlance |
| 8 | How can I reduce self-employment tax? | Everlance |
| 9 | 1099-NEC vs 1099-K? | Everlance |
| 10 | Can I deduct mileage as a 1099 contractor? | Driversnote |
| 11 | What is the QBI deduction? | — (nobody explains in tool) |
| 12 | Do I owe SE tax if I earned under $400? | — |

---

## 7. Gaps nobody fills — our opportunities

1. **Correct, dated tax data file** (SS wage base, brackets, standard deduction, mileage rate) with IRS/SSA links and “tax year” selector — competitors use stale data.
2. **QBI deduction** (simple below-threshold case) — 0 tools include it.
3. **W-2 + 1099** with the SS wage-base interaction.
4. **Quarterly payments with safe harbor** (prior-year 100%/110%) and due dates.
5. **Transparent breakdown:** SE tax lines, ½ SE deduction, AGI, taxable income, bracket table, effective vs marginal rate.
6. **Mileage + actual expenses** inputs; home office simplified method ($5/sq ft, max 300 sq ft — verify).
7. **State tax as effective % input** (honest MVP) + list of no-income-tax states (cited).
8. **Retirement contribution what-if** (SEP / solo 401(k)) → tax saved.
9. **No app push, no email gate.**

---

## 8. Blueprint for the KKCTools Self-Employment Tax Calculator

### 8.1 SEO

- **URL:** `/self-employment-tax-calculator/`
- **Title/H1/Meta:** from Batch 3 keyword file; “1099 tax calculator” in H1 or first sentence.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Year | tax-year selector (data file with `asOf` + sources) |
| Income | 1099 gross, W-2 wages & withholding, other income |
| Expenses | itemised business expenses, miles × rate, home office (simplified) |
| Deductions | SE health insurance, SEP/solo 401(k), standard deduction by status, QBI (simple) |
| Taxes | SE tax (with cap & W-2 interaction), additional Medicare, federal brackets, state effective % |
| Outputs | total tax, breakdown, effective & marginal rate, % to set aside, quarterly amounts & due dates, safe-harbor amount |
| What-if | retirement contribution, extra expenses |
| UX | share URL, print, no network, no data stored |

### 8.3 Content outline (≈ 2,000–2,400 words, original)

1. Intro (primary keyword) + YMYL note
2. How to use
3. How self-employment tax works (92.35%, 15.3%, wage base) — example
4. Federal income tax on 1099 profit — example
5. Deductions that lower your bill (mileage, home office, QBI, ½ SE tax, health, retirement)
6. W-2 and 1099 together
7. Quarterly estimated taxes: amounts, due dates, safe harbor
8. How much to set aside (engine-driven, not a fixed rule)
9. FAQ (10–12)
10. Related tools — Freelance Rate (#15), Invoice Generator (#16), Hourly to Salary (#4), Labor Cost (#18)
11. Sources (IRS, SSA) + tax year + disclaimer

### 8.4 Quality checks

- Unit tests per tax year using IRS worked examples where available.
- Annual data update logged as `TODO(owner)` in `docs/00-PROJECT-STATUS.md`.
- No competitor wording copied. `npm run check:no-network` passes.
- `TODO(owner): pull Google top-10 SERP; check Keeper, ustax.tools, Omni by hand; confirm 2026 SS wage base and mileage rate on SSA.gov / IRS.gov.`
