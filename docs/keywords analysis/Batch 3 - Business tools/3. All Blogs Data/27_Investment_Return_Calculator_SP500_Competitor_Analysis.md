# Investment Return Calculator (S&P 500, T-Bills, Money Market) — Competitor Analysis

> **Target page:** KKCTools `/investment-return-calculator/` (Batch 3, Tier 3 #27)
> **Primary keyword:** `s and p 500 calculator` — US 4,400 · KD 17 · CPC $1.34 (cluster 12 keywords, 67,980 US vol) · YMYL: **high**
> **SERP source:** ⚠ No Semrush SERP export. Competitors from live web search (2026-11-14). `TODO(owner): pull Google top 10.`
> **Pages visited:** 2026-11-14 — 5 read (DQYDJ, Of Dollars And Data, OfficialData.org, ChartRow, Snowball Analytics).
> **Critical build constraint:** our tools may make **no network calls** (AGENTS.md rule 4). Historical returns would have to ship as a **static, dated dataset** in the build (e.g., Shiller monthly S&P/dividends/CPI; T-bill history from FRED). `TODO(owner)`: confirm data licence/terms for redistribution and accept a manual yearly data refresh — this is the main reason the tool is Tier 3.

---

## 0. How this was collected (read first)

- Read: DQYDJ S&P 500 return calculator, Of Dollars And Data (Nick Maggiulli), OfficialData.org (programmatic pages), ChartRow, Snowball Analytics.
- All competitors rely on **Robert Shiller's dataset** (some + SPY/S&P DJI data or EODHD/Twelve Data APIs). None includes taxes or fees by default (Snowball has a flat tax-drag input).
- Do not copy their text, tables or computed figures (AGENTS.md rule 8).

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Data | Body words (est.) |
|---:|---|---|---|---|---:|
| 1 | dqydj.com/sp-500-return-calculator/ | Finance calc site | S&P 500 Return Calculator, with Dividend Reinvestment | Shiller + S&P DJI, CPI (Shiller/FRED), monthly | 800–900 |
| 2 | ofdollarsanddata.com/sp500-calculator/ | Data blogger (wealth manager) | S&P 500 Historical Return Calculator [With Dividends] | Shiller 1871–present, CPI-U | 1,300–1,500 (mostly disclosures) |
| 3 | officialdata.org/us/stocks/s-p-500/2019 | Programmatic data site | S&P 500: $100 in 2019 → $331.85 in 2026 | Shiller + BLS CPI | 900–1,100 + tables |
| 4 | chartrow.com/sp500/return-calculator | Market data site | S&P 500 return calculator | SPY daily (API) + Shiller pre-1993 | 1,200–1,500 |
| 5 | snowball-analytics.com/…/s-amp-p-500-calculator | Portfolio app | The Snowball Analytics S&P 500 Calculator | EODHD calendar-year 1970–2025, CPI-U | 2,000–2,500 |

**What this tells us:**
- **Intent:** “What would $X invested in the S&P 500 in [year] be worth today?” — lump sum or monthly (DCA), with dividends reinvested, nominal and inflation-adjusted.
- **OfficialData.org ranks with one page per start year** (programmatic: “$100 in 2019 → $331.85 in 2026”) — strong long-tail model, but thin prose and a real/nominal confusion in text.
- **ChartRow is the richest** (daily data, presets, DCA, Nasdaq-100 compare, savings compare, drawdown, historical rank) — but needs a live data API, which we cannot use.
- **T-bills and money market comparisons** (in our keyword cluster) are absent everywhere.

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | DQYDJ | OfDollarsAndData | OfficialData | ChartRow | Snowball |
|---|---|---|---|---|---|
| Start / end date | ✅ months | ✅ months | ✅ years | ✅ days/presets | ✅ years 1970–2025 |
| Lump sum | ✅ ($10k chart) | ✅ | ✅ | ✅ | ✅ |
| Regular contributions (DCA) | ❌ (separate tool) | ❌ (separate DCA tool) | ⚠️ fixed 24-month | ✅ monthly/yearly | ✅ weekly–annual + timing |
| Annual contribution step-up | ❌ | ❌ | ❌ | ❌ | ✅ |
| Dividends reinvested vs price only | ✅ both | ✅ both | ✅ | ✅ toggle | ✅ toggle |
| Inflation-adjusted | ✅ toggle | ✅ | ✅ | ✅ toggle | ✅ |
| Total & annualized (CAGR) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Fees (expense ratio) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Taxes | ❌ | ❌ | ❌ | ❌ | ⚠️ flat tax drag |
| Compare vs savings / T-bills / bonds | ❌ | ❌ | ❌ | ⚠️ flat 5% savings, Nasdaq-100 | ❌ |
| Max drawdown | ❌ | ❌ | ❌ | ✅ | ❌ |
| Historical rank of the period | ❌ | ⚠️ “compared to history” | ❌ | ✅ | ❌ |
| Chart | ✅ (log option) | ❌ | ✅ | ✅ | ⚠️ bar |
| Table by year/month | ❌ | ❌ | ✅ monthly | ✅ by year | ✅ CSV |
| Forward projection (assumed return) | ❌ | ❌ | ❌ | ❌ | ⚠️ illustrative |

---

## 3. Feature matrix — content and trust

| Item | DQYDJ | OfDollarsAndData | OfficialData | ChartRow | Snowball |
|---|---|---|---|---|---|
| Methodology (monthly averages, dividends) | ✅ | ✅ (some text dated) | ⚠️ conflicting | ✅ | ✅ |
| Data sources named | ✅ | ✅ | ✅ | ✅ | ✅ |
| Limitations (no taxes/fees, monthly averages) | ⚠️ | ✅ | ❌ | ✅ (footer) | ✅ |
| Best-practice tips (Dec→Dec etc.) | ⚠️ | ✅ | ❌ | ❌ | ✅ pro tips |
| FAQ count | 0 | 0 | 0 | 5 | 5 |
| Named author | ✅ founder | ✅ (Ritholtz) | ✅ engineer | ❌ | ❌ |
| Date / data as-of | ✅ Nov 2026 | ❌ | ✅ data to Sep 2026 | ✅ Nov 13 2026 close | ⚠️ Oct 2026 |
| Disclaimer | ⚠️ | ✅ long | ❌ | ✅ | ✅ |

---

## 4. Competitor-by-competitor detail

### DQYDJ — S&P 500 return calculator
- Start/end month, CPI toggle → total & annualized price return, total & annualized return with dividends; growth-of-$10,000 chart (log option). Methodology: Shiller data + S&P DJI, monthly average prices, interpolated dividends, CPI (Shiller + FRED). Separate tools for DCA, fees/taxes, ETFs. Author dated Nov 2026. No FAQ.

### Of Dollars And Data — S&P 500 historical return calculator
- Start/end month, initial investment → nominal & real, price & total returns (total %, annualised %, grew to), comparison to history. Shiller 1871–present, CPI-U; best practices (Dec→Dec, short-period annualising warning); long disclosures (some text references data “through January 2000” — stale). No FAQ.

### OfficialData.org — S&P 500 since 2019 (programmatic page per year)
- Amount + start/end year → nominal end value ($331.85, +231.85%, 16.74%/yr), inflation-adjusted, DCA (fixed 24 months), monthly table (CPI), charts.
- **Error:** body says real value “$151.37” but that's the % gain; real value is $251.37 (its own table).
- **Lesson:** **one indexable page per start year** captures “$100 invested in 2015” style long tail — consider generating static pages from our dataset (programmatic SEO — must add unique value per page, see Batch 1 programmatic rules).

### ChartRow — S&P 500 return calculator
- Amount, frequency (one-time/monthly/yearly), start date presets (1–30 years, 1871, market tops/bottoms, events), end date, dividends, inflation, Nasdaq-100 compare → ending value, CAGR, price-only value, flat 5% savings comparison, **historical rank** (vs 1,751 ten-year periods), **max drawdown**, charts, by-year table.
- **FAQs (5):** $1,000 worth today · includes dividends? · inflation? · how far back · vs compound interest calculator.
- **Weak points:** needs live API data (not possible for us); event presets are padding; precision vs “may be wrong” disclaimer tension.

### Snowball Analytics — S&P 500 calculator
- Initial deposit, contribution, frequency, timing, DRIP, CPI, start/end year (1970–2025), **annual step-up**, **tax rate drag** → ending balance, contributed, gains, real value, breakdown, index summary, CSV; milestones gated.
- **FAQs (5):** historical performance · DRIP · tax drag · CPI effect · “tipping point”.
- **Weak points:** calendar-year data only; fees not modelled; app promotion; vague “tipping point”.

---

## 5. Patterns

- **Maths:** total return index TR(t) = TR(t−1) × (P(t) + D(t)/12) ÷ P(t−1) (monthly, Shiller style) · value = investment × TR(end) ÷ TR(start) · DCA = Σ contributions × TR(end)/TR(buy) · CAGR = (end/start)^(1/years) − 1 · real = nominal × CPI(start) ÷ CPI(end) · fee drag = × (1 − expense ratio)^years · max drawdown = max peak-to-trough fall.
- **Data needs:** monthly S&P price, dividends, CPI (Shiller); T-bill / money market yields (FRED 3-month T-bill) — static snapshot with `asOf`.

| Section | Pages (of 5) |
|---|:---:|
| DCA built in | 2 |
| Fees | **0** |
| Taxes | 1 (flat) |
| Cash / T-bill comparison | **0** (1 flat-rate) |
| Programmatic year pages | 1 |
| FAQ | 2 |

---

## 6. FAQ question bank

★ = asked on 2+ pages. Map to the 12 keywords (s and p 500 calculator, s&p 500 return calculator, t bill calculator, money market calculator…).

| # | Question | Seen on |
|---:|---|---|
| 1 | ★ Does the calculator include dividends? | ChartRow, Snowball (DRIP) |
| 2 | ★ Can it adjust for inflation? | ChartRow, Snowball |
| 3 | What would $1,000 invested in the S&P 500 be worth today? | ChartRow |
| 4 | How far back does the data go? | ChartRow |
| 5 | How has the S&P 500 performed historically? | Snowball |
| 6 | What is DRIP? | Snowball |
| 7 | How does this compare with a compound interest calculator? | ChartRow |
| 8 | Why don't results match exact daily prices? (monthly averages) | DQYDJ, OfDollarsAndData (text) |
| 9 | How do fees (expense ratio) change the result? | — (nobody) |
| 10 | S&P 500 vs T-bills vs money market — what would cash have earned? | — (nobody) |
| 11 | What's the average annual return of the S&P 500? | ChartRow (link) |
| 12 | Lump sum vs dollar-cost averaging — which did better? | — |

---

## 7. Gaps nobody fills — our opportunities

1. **S&P 500 vs T-bills vs money market (cash)** on the same dates — fits our keyword cluster; 0 competitors.
2. **Fees (expense ratio)** and simple **tax** inputs.
3. **Lump sum vs DCA** comparison for the same total amount.
4. **Nominal + real + price-only + total return** in one result card, plus CAGR.
5. **Offline static dataset** with visible “data through <month year>” and sources.
6. **Optional forward projection** using an assumed return (clearly labelled illustrative) — links Compound Interest (#21).
7. **Programmatic “$100 invested in YEAR” pages** only if each page adds unique, useful content (decade context, drawdowns, real return) — follow Batch 1 programmatic-SEO rules.
8. **Plain-language result:** “$10,000 in Jan 2010 grew to $X by Sep 2026 with dividends reinvested (Y% a year; Z% after inflation).”
9. **YMYL guardrails:** past performance disclaimer next to the result, not only in the footer.

---

## 8. Blueprint for the KKCTools Investment Return Calculator

### 8.1 SEO

- **URL:** `/investment-return-calculator/`
- **Title/H1/Meta:** from Batch 3 keyword file (“S&P 500, T-Bills, Money Market”).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Asset | S&P 500 (total return / price only), 3-month T-bills, money market proxy, custom fixed rate |
| Dates | start/end month (dataset range), presets (5/10/20/30 years) |
| Money | lump sum, monthly/annual contributions, step-up %, timing |
| Costs | expense ratio %, tax drag % (optional) |
| Outputs | end value, contributed, gain, CAGR, real value & real CAGR, max drawdown, best/worst year in window, comparison table across assets |
| Chart | growth lines (SVG), log toggle |
| Data | static JSON with `asOf`, sources (Shiller, FRED, BLS) |
| UX | share URL, CSV copy, no network |

### 8.3 Content outline (≈ 1,800–2,200 words, original)

1. Intro (primary keyword)
2. How to use
3. How S&P 500 returns are calculated (price vs total return, dividends, monthly data)
4. Inflation-adjusted (real) returns
5. Lump sum vs dollar-cost averaging (engine example)
6. S&P 500 vs T-bills vs money market (engine example)
7. Fees and taxes — what they cost over time
8. Data sources and limitations
9. FAQ (10–12)
10. Related tools — Compound Interest (#21), CAGR (Batch 5), How Long Will My Money Last (#20), Net Worth (#19), ROI (Batch 5)
11. YMYL disclaimer (past performance) + sources + data date

### 8.4 Quality checks

- Unit tests vs known benchmark periods computed from the bundled dataset; DCA and fee logic.
- Dataset licence confirmed and update cadence logged as `TODO(owner)` in `docs/00-PROJECT-STATUS.md`.
- No competitor wording or figures copied. `npm run check:no-network` passes.
- `TODO(owner): pull Google top-10 SERP; decide on static data refresh schedule.`
