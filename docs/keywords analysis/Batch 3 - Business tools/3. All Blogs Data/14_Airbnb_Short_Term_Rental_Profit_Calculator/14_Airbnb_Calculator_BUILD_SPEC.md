# Airbnb (Short-Term Rental) Profit Calculator — Build Spec

> **URL:** `/airbnb-calculator/` · Batch 3 Part 2 · Tier 1 · **Build order 5**
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + Part 2; §10.4 brand rule)
> **Inputs used:** `14_Airbnb_Short_Term_Rental_Profit_Calculator_Competitor_Analysis.md` (7 pages), `KKCTools_Batch3_Final_Tool_Keywords.md` §2 #7
> **Written:** 2026-11-20

---

## 0. Strategy note

- **SERP has no strong domain at all.** Every result is AS 14–47 (alltherooms, your.rentals, Airbtics, PriceLabs, Mashvisor, Hostfully, listingok, Rabbu).
- **CPC is $3–9:** commercial value.

**Intent gap, say it honestly:** many searchers want AirDNA-style market data ("how much can I make in my city"). We have **zero network**, so the page says up front: "You enter your nightly rate and occupancy, from your own listing, comparable listings or a market report." Our advantage is that we deliver a **real profit model** where most competitors give gross revenue or sit behind a gate.

**Brand use:**
- "Airbnb" appears descriptively only ("Airbnb profit calculator", "for Airbnb, Vrbo and other short-term rentals").
- No logo; no "official".
- Competitor brands (AirDNA, BNBCalc, Rabbu, Mashvisor, BiggerPockets) are never targeted.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | airbnb profit calculator | 880 | 19 | title, H1, first sentence |
| Secondary | free airbnb calculator · airbnb calc · airbnb estimate calculator · airbnb price estimator | 480 · 320 · 140 · 320 | 0–9 | intro, tool heading, H2 |
| Secondary | airbnb how much can i make · how much can i earn with airbnb · how much can you make on airbnb · estimating airbnb income · how to estimate vacation rental income | 260 · 110 · 210 · 110 · 110 | 0–19 | H2 "How much can I make on Airbnb?" (method, **no averages**) + FAQ |
| Secondary | airbnb property analysis · airbnb investment analysis · how to analyze a short term rental | 590 · 260 · 140 | 3–18 | H2 "How to analyze a short-term rental" |
| Secondary | vacation rental investment calculator · vacation rental property calculator · vacation rental pro forma | 320 · 210 · 170 | 5–21 | H2 + the yearly pro forma table |
| Secondary | vrbo calculator · vrbo income / profit / rental calculator | 390 · 210 · 210 · 170 | 12–21 | intro line "works for Vrbo and other platforms" + FAQ |
| Secondary | airbnb arbitrage calculator | 260 | 4 | Arbitrage mode + H2 |
| Secondary | mid term rental calculator · midterm rental calculator | 170 · 170 | 2–5 | Mid-term (monthly stays) mode + H2 |
| Secondary | airbnb cash flow calculator · airbnb return on investment · airbnb return calculator · airbnb mortgage calculator | 170 · 170 · 210 · 110 | 5–22 | outputs + H2 |
| Secondary | short term rental investment (calculator) · free short term rental calculator · str income | 320 · 390 · 140 · 140 | 0–29 | H2 wording |
| FAQ only | airbnb tax calculator | 320 | 28 | occupancy-tax intent: FAQ only (an input exists; no tax rules) |
| Skip | airbnb demand map · average airbnb price · bnb calculator (nav) | — | — | market-data / navigational intent |

## 2. Our edge

- **Free, full, honest profit model:** revenue → platform fees → variable costs per stay → fixed costs → NOI → cash flow. Only EstatePass does this for free. PriceLabs admits it excludes cleaning and fees.
- **Occupancy / lodging tax and permits** as inputs (0 competitors).
- **Start-up costs** (furniture, setup, photos) → payback months (0 competitors).
- **Seasonality:** high-season / low-season ADR and occupancy, or 12 months.
- **Break-even occupancy and break-even nightly rate.**
- **Three modes:** Buy (mortgage), Arbitrage (rent paid to the landlord), Mid-term (monthly stays).
- **Fair STR vs long-term rental comparison** (LTR vacancy and costs included).
- **Scenarios:** conservative / expected / optimistic + sensitivity (occupancy −5 pts, ADR −10%).
- Privacy: no address lookup, nothing stored, any currency.

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **Buy & host** (default)
2. **Rental arbitrage**
3. **Mid-term rental**
4. **STR vs long-term**

### 3.2 Input guide diagram (above the inputs, rules §9)

`AirbnbInputGuide.tsx`: a 30-day calendar strip (one row of small squares).

- **Booked squares** are filled to match the "2 Occupancy %". Groups of filled squares show "3 Average stay", with a broom icon at each turnover ("6 Cleaning cost").
- **Above the strip:** a price tag "1 Nightly rate" + "4 Cleaning fee charged".
- **Below the strip, the money flow:**

```
Revenue ─ [5 Platform fee %] ─ [6 Cleaning per stay + supplies] ─ [7 Fixed bills: utilities · internet · insurance · maintenance %] ─ [8 Occupancy tax*] = NOI ─ [9 Mortgage or rent] = Cash flow
```

- "*only if you remit it yourself".
- **Arbitrage tab:** the "9" label becomes "Rent to landlord".
- **Mid-term tab:** the calendar shows one block per monthly guest.

Live values; the focused field highlights.

### 3.3 Inputs (defaults = examples, labelled)

| Group | Fields | Defaults |
|---|---|---|
| Revenue | nightly rate (ADR), weekend uplift % (optional), occupancy %, nights available/yr, average stay (nights), cleaning fee charged per stay, other income | $180, 0%, 65%, 365, 3, $90, $0 |
| Seasonality (optional) | high/low season months, ADR and occupancy each, or 12-month grid | off |
| Platform | host/platform fee % (label: "check your platform's current fee"), payment fees % | 3%, 0% |
| Variable | cleaning cost per turnover, supplies per stay, management % of revenue | $80, $10, 0% |
| Fixed (monthly unless noted) | utilities, internet, insurance, maintenance % of revenue, licences/permits per yr, software, property tax/yr, HOA | $250, $60, $150, 5%, $0, $0, $0, $0 |
| Tax | occupancy/lodging tax % (only if the host remits) | 0% |
| Financing (Buy) | price, down %, rate, term → payment via `loan-engine` (or type the payment) | payment $1,800 typed (example) |
| Arbitrage | monthly rent to landlord, deposit | — |
| Start-up | furniture & setup, cash invested (down + closing) | $15,000, $60,000 |
| LTR compare | monthly long-term rent, LTR vacancy %, LTR management %, LTR maintenance % | — |

### 3.4 Engine (`src/lib/str-engine.ts`)

Uses `real-estate-engine` (cap, CoC, yields) and `loan-engine` (payment).

```ts
bookedNights = nightsAvailable * occupancy ; stays = bookedNights / avgStay
revenue = bookedNights * adr * (1 + weekendShare*uplift) + stays * cleaningFee + other
platformFees = revenue * (platformPct + paymentPct)
variable = stays * (cleaningCost + supplies) + revenue * (mgmtPct + maintPct)
fixed = 12*(utilities + internet + insurance + software + hoa) + licences + propertyTax
occTax = revenue * occTaxPct
noi = revenue - platformFees - variable - fixed - occTax
cashFlow = noi - 12 * (mortgagePayment | rentToLandlord)
revpar = adr * occupancy
contributionPerNight = (adr + cleaningFee/avgStay) * (1 - platformPct - paymentPct - mgmtPct - maintPct - occTaxPct) - (cleaningCost + supplies)/avgStay
breakEvenOccupancy = (fixed + 12*debtOrRent) / (nightsAvailable * contributionPerNight)  // null if contribution <= 0
breakEvenAdr = solve adr so that cashFlow = 0 (closed form from the same terms)
coc = cashFlow / (cashInvested + startup) ; paybackMonths = startup / (cashFlow/12)   // null if cashFlow <= 0
scenarios: expected; conservative (occ −10 pts, ADR −10%); optimistic (occ +5 pts, ADR +5%) — all editable
ltr: rent*12*(1-vac) - mgmt - maint - fixed(LTR subset) - debt
```

**Worked example (defaults, checked 2026-11-20):**

| Item | Value |
|---|---|
| Booked nights | 237.25 |
| Stays | 79.08 |
| Revenue | $49,822.50 |
| Platform fee | $1,494.67 |
| Variable costs | $9,608.63 |
| Fixed costs | $5,520 |
| **NOI** | **$33,199.20** |
| Cash flow after a $1,800/mo mortgage | $11,599.20/yr ($966.60/mo) |
| **Cash-on-cash** on $75,000 | **15.47%** |
| RevPAR | $117 |
| **Break-even occupancy** | **45.53%** |
| Furniture payback | 15.5 months |

Computed on the page from the engine.

### 3.5 Outputs

- **Headline cards:** monthly cash flow · annual NOI · break-even occupancy · cash-on-cash.
- **Sentence:** "At $180 a night and 65% occupancy, this short-term rental earns about $49,823 a year and keeps about $967 a month after costs and the mortgage. It breaks even at 45.5% occupancy."
- **Waterfall (inline SVG)** in the results column: revenue → fees → variable → fixed → NOI → debt → cash flow.
- Scenario table (3 columns) + sensitivity mini-grid.
- STR vs LTR: two columns, with a "difference per year" banner. It shows that STR has more work and more variable risk (text, no numbers invented).
- Share URL, Copy, Print.

### 3.6 Tests

- Revenue with cleaning fees; zero average stay → `null`.
- Each cost line.
- Break-even occupancy and ADR: plugging them back in gives cash flow ≈ 0.
- Arbitrage path; mid-term path (monthly rent × occupied months).
- Payback `null` when cash flow ≤ 0.
- Scenarios; the worked example. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Airbnb Calculator – Short-Term Rental Profit & ROI` (50, over 60 with the suffix → `absoluteTitle`) |
| Meta | `Free Airbnb calculator. Enter nightly rate, occupancy, fees and costs to see monthly income, cash flow and cash-on-cash return for a short-term rental.` (151) |
| H1 | `Airbnb Profit Calculator: Short-Term Rental Income, Costs & ROI` |
| BLUF | "Airbnb profit = booked nights × nightly rate + cleaning fees − platform fees − cleaning and running costs − mortgage or rent. At $180 a night and 65% occupancy, this example keeps about $967 a month and breaks even at 45.5% occupancy." (engine) |
| ToolShell pills | `Full expense model`, `Break-even occupancy`, `Arbitrage & mid-term modes`, `STR vs long-term` |
| Links out | Rental Property, Cap Rate, Percentage Change (occupancy change), Commercial Mortgage (when built) |
| Links in | Rental Property, Cap Rate, Tools hub "Real estate" |

## 5. Content (~2,100–2,400 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the Airbnb profit calculator | 4 tabs; "you enter rate and occupancy" honesty note | 150 |
| 2 | How Airbnb profit is calculated | Formula + engine example | 250 |
| 3 | Occupancy, nightly rate (ADR) and RevPAR | Definitions, engine numbers | 180 |
| 4 | How much can I make on Airbnb? | Method: where to get your own ADR and occupancy (comparable listings, your history, market reports); **no averages** | 200 |
| 5 | The costs most Airbnb calculators leave out | Cleaning per turnover, supplies, platform fee, occupancy tax, permits, insurance, furniture | 220 |
| 6 | Break-even occupancy | Engine example | 150 |
| 7 | Airbnb vs long-term rental: a fair comparison | Engine comparison; workload and regulation risk in words | 200 |
| 8 | Rental arbitrage: renting to sublet | Lease permission note (general, no legal advice) | 150 |
| 9 | Mid-term rentals (monthly stays) | When it fits; engine example | 130 |
| 10 | Furnishing costs and payback | Engine example | 120 |
| 11 | Rules, permits and occupancy taxes | General: check your city/county; no state lists | 120 |
| 12 | FAQ | §6 | 450 |
| — | Disclaimer | Estimate, pre-tax, not investment advice | 30 |

## 6. FAQ (12)

1. How do I calculate Airbnb profit? (`airbnb profit calculator`)
2. How much can I make on Airbnb? (`airbnb how much can i make`: method, not averages)
3. How do I estimate vacation rental income? (`how to estimate vacation rental income`)
4. Does this calculator include all costs and fees?
5. Is Airbnb more profitable than a long-term rental?
6. What is break-even occupancy?
7. What is a good occupancy rate? (depends on market and season; how to check yours; no invented %)
8. How does Airbnb arbitrage work? (`airbnb arbitrage calculator`)
9. Does it work for Vrbo or other platforms? (yes; enter that platform's fee)
10. Do I have to collect occupancy tax? (depends on location and platform; check locally; the input exists) (`airbnb tax calculator`)
11. How much does it cost to furnish a short-term rental, and when does it pay back? (the input is yours; payback from the engine)
12. How accurate are free Airbnb calculators? (only as good as the rate and occupancy you enter)

## 7. Done when

- [x] `str-engine.ts` + tests; `loan-engine` + `real-estate-engine` reused; `npm run verify` passes.
- [x] Input guide diagram per tab, above the inputs; waterfall in results; ToolShell + TabSlider used.
- [x] No market averages; descriptive brand use only; "you enter the rate" note visible near the tool.
- [x] Registrations + docs updated; `graphify update .`.
