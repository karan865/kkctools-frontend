# Short-Term Rental (Airbnb) Profit Calculator — Competitor Analysis

> **Target page:** KKCTools `/airbnb-calculator/` (Batch 3, Tier 2 #14)
> **Primary keyword:** `airbnb profit calculator` — US 880 · KD 19 · CPC $2.94 (cluster 38 keywords, 11,010 US vol) · YMYL: low
> **SERP source:** ⚠ No Semrush SERP export for Batch 3. Competitors from live web search (2026-11-14). `TODO(owner): pull Google top 10 in Semrush.`
> **Pages visited:** 2026-11-14 — 7 read.
> **Brand note:** “Airbnb” is a trademark used descriptively in search terms. Use it only descriptively (“Airbnb-style short-term rental”), no logos, no implied affiliation.

---

## 0. How this was collected (read first)

- Read: PriceLabs (dynamic pricing SaaS), Airbtics (STR market data), EstatePass (agent tools), BNBCalc (paid STR analytics), Boostly (UK direct-booking agency), Your.Rentals (property manager), Guesty (PMS).
- **Market-data tools (Airbtics, PriceLabs, BNBCalc, AirDNA) estimate ADR/occupancy from scraped listing data** — we can't (no network calls). Our angle is the opposite: **user-entered numbers, full expenses, honest profit** — which those tools often skip.
- Meta and schema not readable. Word counts are estimates. Do not copy text or benchmark numbers (AGENTS.md rule 8).

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Has calculator? | Body words (est.) |
|---:|---|---|---|:---:|---:|
| 1 | hello.pricelabs.co/blog/airbnb-calculator/ | Pricing SaaS | Airbnb Calculator: The Host's Guide for Accurate Income Projections | ❌ (gated report) | 2,000–2,300 |
| 2 | airbtics.com/vacation-rental-calculator | STR data SaaS | Vacation Rental Calculator | ⚠️ (bedrooms + goal → app) | 1,500–1,800 |
| 3 | estatepass.ai/tools/calculators/airbnb/ | Agent tools | Airbnb Income Estimator | ✅ **full manual model** | 1,100–1,400 |
| 4 | bnbcalc.com | Paid STR analytics | Find profitable short-term rentals | ✅ paid ($30/mo), 2 free | ~2,000 |
| 5 | boostly.co.uk/airbnb-calculator/ | Direct-booking agency | Airbnb Calculator: How to Estimate Real STR Profit in 2026 | ❌ (description only) | ~3,000 |
| 6 | your.rentals/blog/airbnb-revenue-calculator/ | Property manager | Airbnb Profit Calculator: Estimate Your Rental Income in Minutes | ✅ revenue only | ~500 |
| 7 | guesty.com/blog/calculate-str-revenue-occupancy-2/ | PMS | How to calculate Airbnb revenue and occupancy… | ❌ | 1,200–1,300 |

**What this tells us:**
- **Most “calculators” are lead magnets:** gated (PriceLabs), app sign-up (Airbtics), paid (BNBCalc), or text only (Boostly, Guesty).
- **“Profit” is promised but rarely delivered:** Your.Rentals and PriceLabs output gross revenue only; PriceLabs admits it excludes cleaning, fees, taxes.
- **Only EstatePass** has a free, full manual model (ADR, weekend premium, cleaning fee, stay length, occupancy, platform %, cleaning cost, management %, utilities, supplies, maintenance, insurance, mortgage, tax, LTR comparison, break-even occupancy).

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | PriceLabs | Airbtics | EstatePass | BNBCalc | Your.Rentals |
|---|---|---|---|---|---|
| Free, no sign-up | ❌ | ⚠️ | ✅ | ❌ (2 free) | ✅ |
| Nightly rate (ADR) | auto | auto | ✅ | auto | ✅ |
| Weekend premium / seasonality by month | ✅ auto | ✅ auto | ⚠️ weekend % | ✅ | ❌ |
| Occupancy % | auto | auto | ✅ | auto | ✅ |
| Average stay length → turnovers | ❌ | ❌ | ✅ | ❌ | ❌ |
| Cleaning fee charged (revenue) | ❌ | ❌ | ✅ | ? | ❌ |
| Cleaning cost per turnover | ❌ | ⚠️ | ✅ | ? | ❌ |
| Platform/host fee % | ❌ | ⚠️ | ✅ | ? | ❌ |
| Management % | ❌ | ⚠️ | ✅ | ? | ❌ |
| Utilities, supplies, maintenance, insurance | ❌ | ⚠️ | ✅ | ? | ❌ |
| Occupancy/lodging tax | ❌ | ❌ | ❌ | ❌ | ❌ |
| Mortgage & property tax | ❌ | ⚠️ | ✅ | ✅ | ❌ |
| Furnishing / startup cost | ❌ | ❌ | ❌ | ? | ❌ |
| Long-term rent comparison | ❌ | ❌ | ✅ | ❌ | ❌ |
| Outputs: cash flow, NOI | ❌ | ✅ | ✅ | ✅ | ❌ |
| Cap rate, CoC, ROI, gross/net yield | ❌ | ✅ | ⚠️ (input, no output) | ✅ | ❌ |
| Break-even occupancy | ❌ | ❌ | ✅ | ❌ | ❌ |
| Multi-year projection | ❌ | ✅ 5/10 yr | ❌ | ✅ 5 yr | ❌ |
| Multiple units | ❌ | ❌ | ❌ | ❌ | ✅ |
| Currency | $ | $ | $ | $ (+ intl markets) | € (example $) |

---

## 3. Feature matrix — content and trust

| Item | PriceLabs | Airbtics | EstatePass | BNBCalc | Boostly | Your.Rentals | Guesty |
|---|---|---|---|---|---|---|---|
| Revenue formula | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ (example wrong) | ✅ |
| Occupancy / ADR definitions | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Expenses free calculators miss | ⚠️ | ⚠️ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Regulations / permits | ⚠️ | ⚠️ | ✅ generic | ⚠️ | ⚠️ | ❌ | ❌ |
| STR vs LTR comparison | ❌ | ❌ | ✅ (overstated) | ❌ | ✅ FAQ | ❌ | ❌ |
| Scenario / sensitivity | ❌ | ❌ | ❌ | ❌ | ✅ (3 scenarios text) | ❌ | ❌ |
| FAQ count | 4 | 10 | 6 (answers missing) | ~20 | 7 | 0 | 0 |
| Named author | ✅ | ❌ | ⚠️ team | ❌ | ✅ founder | ❌ | ⚠️ team |
| Date | ✅ Oct 2026 | ❌ | ✅ Sep 2026 | ❌ | ✅ Jul 2026 | ❌ | ✅ Aug 2026 |
| Sources | ❌ | ❌ | ❌ | ❌ | ⚠️ vendor stats | ⚠️ own study | ❌ |

---

## 4. Competitor-by-competitor detail

### PriceLabs — airbnb-calculator blog (pricing SaaS)
- Gated “Revenue Estimator Pro” (location, property type, beds/baths/guests, amenities, seasonality). Outputs claimed incl. net profit, but FAQ says expenses excluded. **FAQs (4):** what is it · does it include all expenses · how often to update · any US city?
- **Weak points:** no tool on page; contradictory profit claims; typos.

### Airbtics — vacation-rental-calculator (STR data)
- Bedrooms + goal (buy/rent/manage) → app. Outputs listed: occupancy, ADR, seasonality, revenue, opex, NOI, gross/net yield, ROI, 5-yr cash flow, 10-yr return, **regulations**. Formulas: revenue = ADR × booked nights; cap rate; ROI (different bases).
- **FAQs (10):** how to calculate · best way · average Airbnb income · how taxed · maximise income · cap rate for vacation rental · good ROI · make more money · accuracy · limitations.

### EstatePass — airbnb calculator — **best free tool**
- Inputs/outputs listed in §2 (most complete free model). Example $180 × 65% × 365 = $42,705 vs LTR $2,400 × 12 = $28,800.
- **Errors:** says STR revenue “2–3×” LTR while its own example is ~1.5×; LTR assumes 0 vacancy; profit formula subtracts mortgage and calls it profit (NOI excludes debt); property value input but no cap-rate output; FAQ answers empty.

### BNBCalc — homepage (paid analytics)
- Address, beds, baths, guests, price → comps, revenue, ADR, occupancy, cash flow, CoC, cap rate, ROI, seasonality, 5-yr forecast, depreciation. Paid. **Publishes users' analysed street addresses publicly** (privacy issue — we must never store/share addresses).

### Boostly — airbnb-calculator article (UK agency)
- No tool. Strong content: inputs that matter, **expenses free calculators miss** (permits, occupancy tax, STR insurance), cap rate vs CoC vs ROI, fees and market data, **multi-year projection with 3 scenarios and sensitivity**, payouts reconciliation. FAQs (7). US-focused despite .co.uk; vendor-sourced fee stats.

### Your.Rentals — airbnb revenue calculator (PM)
- Units, ADR (€), occupancy %, nights available → annual gross revenue, monthly, per unit, booked nights. **Math error:** 0.52 × 150 × 200 × 2 = **$31,200**, page says $15,600. Currency €/$ mismatch. No expenses despite “profit” title.

### Guesty — STR revenue and occupancy (PMS)
- Article only. Revenue = ADR × occupancy × days ($250 × 60% × 365 = $54,750); occupancy = booked ÷ available; expenses and channel fees; break-even (“night 13”) without numbers; static vs dynamic tools.

---

## 5. Patterns

- **Maths:** booked nights = available nights × occupancy · stays = booked nights ÷ avg stay · revenue = booked nights × ADR (+ weekend uplift) + stays × cleaning fee charged · platform fee = revenue × host fee % · variable costs = stays × cleaning cost + revenue × management % · fixed = utilities, internet, supplies, insurance, maintenance, licences, property tax, HOA · NOI = revenue − fees − operating costs · cash flow = NOI − debt service · break-even occupancy = fixed costs ÷ (available nights × net contribution per night) · RevPAR = ADR × occupancy.
- **Common gaps:** lodging/occupancy tax, permits, STR insurance, furnishing/start-up cost, vacancy ramp in year 1, seasonality.

| Section | Pages (of 7) |
|---|:---:|
| Free full-expense tool | 1 |
| Break-even occupancy | 1 |
| STR vs LTR | 2 |
| Occupancy tax input | **0** |
| Start-up cost & payback | **0** |
| Seasonality (manual) | **0** |

---

## 6. FAQ question bank

★ = asked on 2+ pages. Map to the 38 keywords (airbnb income calculator, short term rental calculator, vacation rental calculator, etc.).

| # | Question | Seen on |
|---:|---|---|
| 1 | ★ How do I calculate Airbnb / vacation rental income? | Airbtics, PriceLabs, Guesty |
| 2 | ★ Does the calculator include all expenses and fees? | PriceLabs, Boostly |
| 3 | ★ Is Airbnb more profitable than a long-term rental? | EstatePass, Boostly |
| 4 | ★ What is a good occupancy rate / ROI / cap rate for a vacation rental? | EstatePass, Airbtics |
| 5 | ★ How accurate are free Airbnb calculators? | Boostly, Airbtics |
| 6 | What percentage does Airbnb charge hosts? | Boostly |
| 7 | How is STR income taxed? | Airbtics |
| 8 | What expenses should I budget for? | EstatePass |
| 9 | Do I need a permit / what about local regulations? | EstatePass, Boostly |
| 10 | Should I use a property manager? | EstatePass |
| 11 | What is break-even occupancy? | — (EstatePass tool only) |
| 12 | How much does it cost to furnish an Airbnb and when does it pay back? | — (nobody) |

---

## 7. Gaps nobody fills — our opportunities

1. **Free, full, honest profit model** (EstatePass-level + fixes): revenue → fees → variable & fixed costs → NOI → cash flow, no sign-up.
2. **Occupancy/lodging tax and permits** as inputs (0 competitors).
3. **Start-up costs** (furnishing, setup, photography) → payback months & first-year cash.
4. **Seasonality:** 12-month (or high/low season) ADR and occupancy entry.
5. **STR vs LTR comparison** done fairly (LTR vacancy, LTR costs).
6. **Break-even occupancy and break-even ADR.**
7. **Returns:** cap rate, cash-on-cash, gross/net yield (link Rental Property #7).
8. **Scenarios:** conservative / expected / optimistic + sensitivity (occupancy −5 pts, ADR −10%).
9. **Currency (UK/EU/AU hosts)** and per-unit/multi-unit.
10. **Privacy-first:** no address lookup, no data stored (contrast with BNBCalc).

---

## 8. Blueprint for the KKCTools Airbnb Profit Calculator

### 8.1 SEO

- **URL:** `/airbnb-calculator/`
- **Title/H1/Meta:** from Batch 3 keyword file; descriptive “Airbnb” use only.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Revenue | ADR (weekday/weekend or 12 months), occupancy %, nights available, avg stay, cleaning fee charged, other income |
| Fees | platform/host fee %, payment fees |
| Variable costs | cleaning cost/turnover, laundry, consumables per stay, management % |
| Fixed costs | utilities, internet, insurance, maintenance %, licences/permits, software, property tax, HOA |
| Taxes | occupancy/lodging tax (if host remits) |
| Financing | mortgage payment or rent (rental arbitrage) |
| Start-up | furnishing, setup → payback |
| Outputs | revenue, NOI, monthly/annual cash flow, RevPAR, break-even occupancy & ADR, cap rate, CoC, yield |
| Compare | STR vs LTR (with LTR vacancy & costs) |
| Scenarios | 3 scenarios + sensitivity |
| UX | currency, share URL, print, no network, nothing stored |

### 8.3 Content outline (≈ 2,000–2,400 words, original)

1. Intro (primary keyword)
2. How to use
3. How Airbnb profit is calculated (formula + engine example)
4. Occupancy, ADR and RevPAR explained
5. The expenses most calculators leave out
6. Break-even occupancy
7. Short-term vs long-term rental — a fair comparison
8. Furnishing costs and payback
9. Rules, permits and taxes (general; check local)
10. FAQ (10–12)
11. Related tools — Rental Property (#7), Cap Rate (#6), Compound Interest (#21), Percentage Change
12. Disclaimer

### 8.4 Quality checks

- Unit tests for every revenue/cost line, break-even, comparison, scenarios.
- No unsourced market averages.
- No competitor wording copied. `npm run check:no-network` passes.
- `TODO(owner): pull Google top-10 SERP for airbnb profit calculator.`
