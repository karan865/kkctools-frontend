# Compound Interest Calculator — Competitor Analysis

> **Target page:** KKCTools `/compound-interest-calculator/` (Batch 3, Tier 2 #21; Batch 5 adds more keywords for this URL)
> **Primary keyword:** `compound calculator` — US 18,100 · KD 7 · CPC $0.37 (cluster 14 keywords, 83,600 US vol). Head term `compound interest calculator` (KD > 30) not in the export. Batch 5 §3 adds `compound interest calculator daily` etc. · YMYL: medium
> **SERP source:** ⚠ No Semrush SERP export. Competitors from live web search (2026-11-14) + known giants. `TODO(owner): pull Google top 10 — expect Investor.gov (SEC), NerdWallet, Calculator.net, TheCalculatorSite, Omni, Bankrate.`
> **Pages visited:** 2026-11-14 — 4 read in full (Calculator.net, TheCalculatorSite, Inch Calculator, Omni). Blocked: Investor.gov 403, NerdWallet 403. Search results were otherwise dominated by tiny clone sites.

---

## 0. How this was collected (read first)

- Read: Calculator.net, TheCalculatorSite (UK), Inch Calculator, Omni.
- **Investor.gov** (US SEC's official compound interest calculator) — likely #1 for the head term; blocked to our reader. `TODO: check by hand.` It's the trust benchmark (government source).
- Verified figures used in this file (our own arithmetic): $10,000 at 5% for 10 years → $16,288.95 annual / $16,470.09 monthly / $16,486.65 daily; $1,000 at 10% for 1 year → $1,100 / $1,104.71 / $1,105.16.
- Do not copy text or tables (AGENTS.md rule 8).

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | investor.gov/…/compound-interest-calculator | **US government (SEC)** | (403) | — |
| 2 | calculator.net/compound-interest-calculator.html | Giant | Compound Interest Calculator (rate converter only) | ~1,300 |
| 3 | thecalculatorsite.com/finance/calculators/compoundinterestcalculator.php | Giant (UK) | Compound Interest Calculator | 1,200–1,400 prose |
| 4 | inchcalculator.com/compound-interest-calculator | Giant | Compound Interest Calculator | ~1,300 |
| 5 | omnicalculator.com/finance/compound-interest | Giant | Compound Interest Calculator | ~3,000 |
| — | nerdwallet.com/calculator/compound-interest-calculator/ | Publisher | (403) | — |

**What this tells us:**
- **Head term is held by giants and a government site** — we target the easier `compound calculator` + daily/monthly/contribution long-tail (Batch 5 keywords).
- **TheCalculatorSite is the feature leader:** 5 currencies, 12 compounding presets, deposits **and** withdrawals, deposit timing, annual deposit increase, effective annual rate, time to double, monthly/yearly tables.
- **Common technical errors:** Inch's contribution formula only valid for annual compounding but offered with monthly/daily; TheCalculatorSite's “RoR” not annualised; Calculator.net's tool is only a **rate converter** (no balances).
- **Inflation and tax** — promised or mentioned, never modelled.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Calc.net | TheCalculatorSite | InchCalc | Omni |
|---|---|---|---|---|
| Principal, rate, time → future value | ❌ (converter only) | ✅ | ✅ | ✅ |
| Compounding options | 9 (converter) | 12 + custom | 6 | 14 (incl. 360/365) |
| Regular deposits | ❌ | ✅ (weekly–yearly) | ⚠️ annual only | ✅ (never–daily) |
| Deposit timing (start/end) | ❌ | ✅ | ❌ | ⚠️ mentioned, not visible |
| Deposit frequency ≠ compounding frequency handled | ❌ | ✅ | ❌ (formula issue) | ✅ |
| Annual deposit increase | ❌ | ✅ | ❌ | ⚠️ mentioned |
| Withdrawals | ❌ | ✅ fixed / % | ❌ | ❌ |
| Inflation-adjusted (real) value | ❌ | ❌ (promised) | ❌ | ❌ |
| Tax on interest | ❌ | ❌ | ❌ | ❌ |
| Solve for rate / time / required deposit | ❌ | ❌ | ❌ | ⚠️ examples only |
| APY / effective annual rate | ✅ converter | ✅ | ❌ | ⚠️ text |
| Time to double | ⚠️ Rule of 72 text | ✅ | ⚠️ text | ✅ example |
| Simple vs compound comparison | ⚠️ text | ❌ | ❌ | ⚠️ text |
| Yearly / monthly table | ❌ | ✅ both | ✅ yearly | ✅ |
| Chart | ❌ | ⚠️ | ❌ | ✅ bar/pie |
| Currency | ❌ | ✅ 5 | ❌ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Calc.net | TheCalculatorSite | InchCalc | Omni |
|---|---|---|---|---|
| Formulas (periodic, continuous, Rule of 72) | ✅ | ⚠️ (exponent rendering broken) | ✅ (+ contributions variant) | ✅ |
| Worked examples | 4 | 4 | 3 | 4 + factor table |
| Compounding frequency explained | ✅ | ✅ | ✅ | ✅ |
| APY vs APR | ⚠️ | ⚠️ | ❌ | ⚠️ (conflated) |
| Where to earn compound interest | ❌ | ✅ (generic) | ✅ FAQ (banks) | ❌ |
| History | ✅ | ❌ | ❌ | ❌ |
| FAQ count | 0 | 3 | 3 | 4 |
| Named author | ❌ | ✅ + chartered reviewer | ✅ + MBA | ✅ PhD |
| Date | ❌ | ✅ Nov 2026 | ❌ | ❌ |
| Sources | ❌ | ✅ references | ❌ | ⚠️ 2 |

---

## 4. Competitor-by-competitor detail

### Calculator.net — compound-interest
- Rate converter only (rate + period → equivalent rate under 9 periods). Content: definition, frequencies, formulas (basic, continuous, Rule of 72), history (Babylon, Bernoulli). Examples: $1,000 at 6% annual/daily/continuous. Links to a separate Interest Calculator for balances.
- **Lesson:** Google still ranks it — authority. Our tool should **include** a rate-converter panel too.

### TheCalculatorSite — compound interest — **feature benchmark**
- Inputs in §2 (currency, presets, deposits/withdrawals, timing, increases). Outputs: future value, total interest, effective annual rate, RoR, time to double, monthly & yearly breakdowns.
- Examples: $10,000 at 5% for 20 years → $26,532.98; + $100/month → $67,121; default $5,000 at 5% monthly 5 yrs → $6,416.79.
- **FAQs (3):** include regular contributions? · effective annual rate · what is RoR.
- **Weak points:** inflation promised not visible; RoR not annualised; formula exponent lost; option overload.

### Inch Calculator — compound interest
- Initial value, annual contribution, rate, years, compounding (daily → continuous) → total value, principal, interest, balance-by-year table. Formulas incl. contribution and continuous; Rule of 72; examples ($10,000 at 5% 3 yrs → $11,576.25; + $500/yr → $13,152.50; continuous $11,618.34 — checked).
- **FAQs (3):** how it works · types · do banks offer compound interest accounts.
- **Error:** contribution formula correct only for annual compounding but offered with other frequencies; annual contributions only.

### Omni — compound interest
- Initial balance, rate, term, 14 compounding options, additional deposits (frequency) → final balance, interest, yearly breakdown, charts/table. Formula; 4 examples incl. **solve for rate** (2,000 → 3,000 in 6 yrs ≈ 6.99%) and **doubling time** (4% ≈ 17.67 yrs); factor table.
- **FAQs (4):** what's compound interest · simple vs compound · how to calculate · how long for $1,000 to double.
- **Weak points:** nominal rate vs APY conflated; author credential mismatch; casual tone.

---

## 5. Patterns

- **Formulas:** FV = P(1 + r/n)^(nt) · continuous: P·e^(rt) · with periodic contributions PMT at frequency m (≠ n): convert to effective rate per contribution period i = (1 + r/n)^(n/m) − 1, then FV = P(1+i)^(mt) + PMT·((1+i)^(mt) − 1)/i (×(1+i) if start of period) · EAR/APY = (1 + r/n)^n − 1 · doubling time = ln 2 ÷ ln(1 + i) per period · real value = FV ÷ (1 + inflation)^t.
- **Frequency matters less than rate** (daily vs monthly at 5%/10 yrs differ by ~$17 on $10,000) — good teaching point.

| Section | Pages (of 4) |
|---|:---:|
| Contributions with frequency ≠ compounding | 2 |
| Deposit timing | 1 |
| Withdrawals | 1 |
| Inflation | **0** |
| Tax | **0** |
| Solve-for modes | 0 (examples only) |
| Currency | 1 |

---

## 6. FAQ question bank

★ = asked on 2+ pages. Add Batch 5 keywords (compound interest calculator daily, monthly compound interest, etc.).

| # | Question | Seen on |
|---:|---|---|
| 1 | ★ How does compound interest work? / what is it? | Omni, InchCalc |
| 2 | ★ How do I calculate compound interest? | Omni, InchCalc |
| 3 | ★ How long does it take money to double? | Omni, Calc.net (Rule of 72), TheCalculatorSite |
| 4 | Simple vs compound interest? | Omni |
| 5 | What is the effective annual rate (APY)? | TheCalculatorSite |
| 6 | Can I include regular contributions? | TheCalculatorSite |
| 7 | Daily vs monthly compounding — how much difference? | — (examples only) |
| 8 | Do banks offer compound interest accounts? | InchCalc |
| 9 | What are the types of compound interest? | InchCalc |
| 10 | APR vs APY — which should I enter? | — (nobody clear) |
| 11 | How does inflation affect my savings growth? | — |
| 12 | How much do I need to save monthly to reach $X? | — (no solve mode anywhere) |

---

## 7. Gaps nobody fills — our opportunities

1. **Solve for anything:** future value · required monthly deposit for a goal · rate needed · time needed.
2. **Correct mixed-frequency maths** (deposit monthly, compound daily) with start/end timing — and say which convention.
3. **Inflation-adjusted (real) balance** and **simple tax-on-interest %** — 0 competitors.
4. **APR vs APY input switch** (avoid double-counting compounding).
5. **Compare scenarios** (e.g., 5% daily vs 5.1% monthly; start now vs 5 years later).
6. **Rate converter panel** (Calculator.net's whole tool) as a small extra.
7. **Yearly table + SVG chart** (contributions vs interest), CSV copy.
8. **Currency selector.**
9. **Daily compounding focus** (Batch 5 keywords) with a clear 360 vs 365 note.

---

## 8. Blueprint for the KKCTools Compound Interest Calculator

### 8.1 SEO

- **URL:** `/compound-interest-calculator/`
- **Title/H1/Meta:** from Batch 3 file (and add Batch 5 daily-compounding terms to H2s/FAQ).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Solve | FV · required deposit · required rate · required time |
| Inputs | principal, rate (APR or APY), compounding (annual → daily 365/360, continuous), deposit amount/frequency/timing, annual deposit increase, withdrawals (optional), years/months |
| Adjust | inflation %, tax on interest % |
| Outputs | FV (nominal & real), total deposits, total interest, EAR/APY, doubling time, yearly/monthly table, chart |
| Compare | scenario B side by side |
| Extra | rate converter |
| UX | currency, share URL, CSV copy, no network |

### 8.3 Content outline (≈ 1,800–2,200 words, original)

1. Intro (primary keyword)
2. How to use
3. Compound interest formula (+ engine examples)
4. Compounding frequency: daily vs monthly vs annual (table from engine)
5. Adding monthly contributions (and timing)
6. APR vs APY
7. Rule of 72 and doubling time
8. Inflation and taxes — real growth
9. How much to save for a goal (solve mode)
10. FAQ (10–12)
11. Related tools — CAGR (Batch 5), Simple Interest (Batch 5), How Long Will My Money Last (#20), Investment Return (#27), Net Worth (#19)
12. Disclaimer & sources

### 8.4 Quality checks

- Unit tests incl. the verified figures above and mixed-frequency cases.
- No competitor wording copied. `npm run check:no-network` passes.
- `TODO(owner): pull Google top-10 SERP; check Investor.gov and NerdWallet by hand.`
