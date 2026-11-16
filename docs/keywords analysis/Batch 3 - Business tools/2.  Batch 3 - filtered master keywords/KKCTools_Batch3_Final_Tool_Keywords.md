# KKCTools — Batch 3 Final Tool Keywords (Business Tools)

> **Keyword data:** `1. All Keywords from Semrush/` — 12 Semrush US exports (Oct 2026 snapshot), two KD bands per seed (≈ 0–15% and 15–30%)  
> **Seeds:** #1 freelance hourly rate calculator · #2 product markup calculator · #3 late payment interest calculator · #4 commercial lease calculator + rental yield calculator · #5 business valuation calculator  
> **Rows read:** 1,200 rows → **1,186 unique keywords** after removing duplicates across files  
> **Site:** KKCTools, DA 1, tools-only, 24 calculators live (construction + Business & Creative)  
> **SERP filter (2026-11-16):** every primary keyword was checked, the final 14 against the owner’s Semrush SERP exports (positions + Domain AS) with a relevance-first check; 18 of 27 tools are kept. Method and limits in “SERP filter — how it was done” below.  
> **Updated:** 2026-11-16

## SERP filter — how it was done (2026-11-16)

- **Rule (owner):** a DA 1 site only builds tools where the top 10 is weak: few strong domains, or pages that do not really match the keyword. One of our pages reached the top 10 at KD 45 with DA 10 and no backlinks because the top 10 had no truly relevant page. Keyword difficulty alone is not trusted.
- **Relevance first (owner rule):** before AS or KD, every result is checked against the keyword. Reddit, Facebook, Quora, YouTube, app-store listings, off-topic pages and forms are treated as open slots and their AS is ignored. Articles on a calculator query, listicles and calculators for a different metric count as semi-relevant (weak). Only relevant pages are judged by AS.
- **Data:** `percentage increase calculator`: the owner’s Semrush SERP export (positions and Domain AS). The other 26 primaries: web-search result sets, which show which domains and page types rank, but not Google’s exact order or Domain AS.
- **Strong (removed):** most of the top 10 is calculator giants (Omni, Calculator.net, CalculatorSoup, Inch Calculator), big finance publishers (NerdWallet, Bankrate, Fool), banks or big software brands, on exactly the right topic.
- **Weak (kept):** small SaaS lead-magnet pages, personal blogs, `*.pages.dev` mini-sites, spam, PDFs or documentation, or pages that answer a different intent.
- **Before building any kept tool,** pull its Semrush SERP (positions + Domain AS) to confirm, the same way as for `percentage increase calculator`. Any tool whose real top 5 has 3+ domains at AS ≥ 60 on the exact topic moves to Section 2b.

## What these exports tell us (read first)

- **The seed keywords themselves are not in the files.** `freelance hourly rate calculator`, `product markup calculator`, `late payment interest calculator`, `rental yield calculator` and `business valuation calculator` do not appear. Only `commercial lease calculator` does (390 / KD 17). The exports are “related keywords” filtered to **KD 0–30**, so any head term with KD > 30 is missing too: `margin calculator`, `compound interest calculator`, `discount calculator`, `break even calculator`, `paypal fee calculator` and others. Section 6 lists what to pull.
- **Seed #3 (late payment interest) produced almost nothing usable.** Semrush filled that export with US tax and paycheck searches. There is no late-payment-interest demand in this data. Pull the exact term before planning a page.
- **Half the rows are not tools:** freelance job boards, accounting software, businesses for sale, brand names. They are dropped (Section 5), with counts so nothing is silently lost.
- **Many big numbers are YMYL finance** (paycheck, tax, retirement). Google holds “Your Money or Your Life” pages to a higher trust bar. A DA 1 site with no named financial expert should start with **business-math tools** (markup, margin, unit price, cap rate), which carry less risk. Paycheck and tax sit in Hold (Section 3).
- **Volumes overlap.** Close variants (“cash on cash return” / “cash on cash calculator”) share one SERP, so real traffic is far below the cluster sums.

## How to read the tables

- **Role:** Primary = the page’s main target · Secondary – easy = KD ≤ 15 · Secondary – medium = KD 16–24 · Support = KD 25–30, use in H2 / FAQ.
- **Intent** (Semrush codes in the export, decoded as 0 = Info, 1 = Nav, 2 = Comm, 3 = Trans — checked against obvious rows: `superpages` = 1, `business for sale` = 3, `what is net worth` = 0, `best bookkeeping software…` = 2). Info = informational · Comm = commercial · Trans = transactional · Nav = navigational / brand.
- **Trend** from the 12-month Semrush trend: ⚠ irregular = 4+ months at zero (volume unreliable) · ⚠ declining = last 3 months under half of the first 3 · ↑ rising = last 3 months over 1.6× the first 3.
- **Note:** FAQ / H2 = question-type keyword; use it as a heading or FAQ, not as the page target. 🌍 = non-US or non-English phrasing.
- **Ad comp** = Semrush competition (0–1) for paid ads; high values + high CPC = buyers with money, good for future AdSense RPM.

### Already live — not repeated

Asphalt · Band Name Generator · Brick · Cinder Block · Compost · Concrete · Construction Estimate Template · Cubic Yard · Drywall · Fence Stain · Fill Dirt · Laminate Flooring · Linear Foot · Paint Cost · Paver Base · Paver Sand · Rafter · Rebar · Sand · Square Footage · Stone & Gravel · Stud Framing · Tile · Tons to Cubic Yards

---

## 1. Primary keywords — master table (after the Semrush SERP check)

Checked against the owner’s Semrush SERP exports (positions + Domain AS), 2026-11-16. **18 tools kept**; 9 tools are in Section 2b with their evidence. Goal: top 10 after building a few backlinks to each page.

### Relevance check (done before looking at AS or KD)

Each result was first sorted by **relevance to the keyword**. Irrelevant results (forums, social, video, app stores, other topics, forms) and semi-relevant ones (an article or listicle on a calculator query, a gated download, a calculator for a different metric) are **open slots**: their AS does not matter, because a relevant page can take their place. Only relevant pages were then judged by AS.

| Keyword | Irrelevant → open slot | Semi-relevant → weak | Relevant, strong (AS ≥ 60) | Relevant, mid (45–59) | Relevant, weak (AS < 45) | Result |
|---|---|---|---|---|---|---|
| `markup calculator` | — | Shopify profit-margin calculator (margin, not markup); CFI markup article (no tool) | Xero 72 | CSG Network 47 | userjot 33 (#1), storeradar 14 (#2), Upmetrics 38, activecalculator 27, feeqd 19, roxanlabs 15 | **8 open** · only 1 strong relevant tool → ✅ Tier 1 |
| `unit price calculator` | Google Play app listing | — | Omni 84 (×2 URLs), Inch Calculator 81 | — | unitpricecalculator.com 14, unitpriceapp 9, calctrail 10, calckit 22, sparkcalc 9, bangyourbuck 9 | **7 open** → ✅ Tier 1 |
| `cap rate calculator` | — | — | Omni 84 | — | mynd 40, commercialrealestate.loans 37, RentSpree 41, commercialloandirect 28, Landlord Studio 38, propmetrics.co 9, Northpoint 29, reinvestorguide 7, thesisdriven 31 | **9 open** → ✅ Tier 1 |
| `labor cost` | duplicate ezclocker URL (wasted slot) | — | Indeed 100, Gusto 60 | Homebase 52 | submittallink 11 (#3), SimplyWise 35, Miter 37, 247pro 25, ezclocker 29, estimationpro 20 | **7 open** → ✅ Tier 1 |
| `commercial lease calculator` | cell-tower lease calculator, Calculator.net car/general lease, YouTube, NZ water-company form | Huntington lease-vs-own tool 65; nycrgroup price-per-sq-ft tool 23 | Omni 84 | — | q4realestate 21 (#1), Austin Tenant Advisors 26, Tyler Cauble 25 | **9 open** · only Omni is a strong, on-topic page → ✅ Tier 1 |
| `airbnb profit calculator` | — | eFinancialModels spreadsheet post; Mashvisor “best calculators” listicle; Rabbu homepage | — | PriceLabs 47 | alltherooms 30, your.rentals 31, Airbtics 33, Mashvisor 42, Hostfully 38, listingok 14 | **9 open** · no strong page at all → ✅ Tier 1 |
| `freelance rate calculator` | YouTube | HubSpot gated download page 79 | Upwork 73 | Harvest 54 | freelancehourlyrate 7 (#2), contractrates 22, freelanceratecalculator 15, virtual-headquarters 28, Appizy 22, PineBill 29 | **8 open** → ✅ Tier 1 |
| `small business valuation` | Reddit thread, YouTube | — (informational query: guides are the right format) | M&T Bank 64, The Hartford 64, business.gov.au 69 | — | CRI 40, OK SBDC 26, Morgan & Westfield 34, Williams Keepers 23, gvalue 20 | **7 open** · no calculator in the top 10 → 🟡 Tier 2 (guide + calculator) |
| `discount computation` | — | — | Calculator.net 90, Omni 84, percentagecalculator.net 67, CalculatorSoup 80, GIGAcalculator 66, Pearson 77, Zoho 81 | — | docelf 35 (#4), dothecalculation 11 (#6), Enerpize 36 (#10) | **3 open** · 7 strong relevant tools → 🟡 Tier 2 (target #6–10) |
| `gross margin calculator` | — | Investopedia definition article 91 (no tool) | Omni 84, CalculatorSoup 80, Xero 72, Calculator.net 90, Canva 100, Sage 67 | Mercury 51 | retaildogma 38 (#8), margincalculator.cc 22 (#10) | **3 open** · 6 strong relevant tools → 🟡 Tier 2 (bottom of page 1) |
| `how long will my money last` | — | — | Regions 63 | Mutual of Omaha 55, TowneBank 45 | CalcXML 39, UMCU 43, SYB 36, Pittsford FCU 30, Fidelity Bank 39, Sentry 42, USAA EF 42 | **7 open** · weak domains, YMYL → 🟡 Tier 3 |
| `sba 504 loan` | — | Wells Fargo general SBA page 80; sba.gov general loans page 69 | sba.gov 504 page 69, Wikipedia 100, Investopedia 91 | — | Texas First Bank 35, Live Oak 43, AMPAC 26, evergreen504 calculator 29 (#7), NADCO 32 | **7 open** · a small calculator ranks #7 → 🟡 Tier 3 (YMYL) |
| `1099 tax calculator` | — | IRS W-4 withholding estimator 92 (not a 1099 tool); Liberty Tax article 49 | ADP 81, Nationwide 68 | Jackson Hewitt 57 | Everlance 40, Keeper 40, Pilot 40, usetabby 25, sequifi 27 | **7 open** · SERP beatable, but yearly tax updates + YMYL → 🟡 Tier 3 |
| `investment return calculator` | — | — | Calculator.net 90, investor.gov 70, NerdWallet 80, iShares 61, Ramsey 64 | Ameriprise 52, Fidelity.ca 48, MDM 45 | Red River Bank 38, CNB 40 | **2 open** · KD 62, YMYL → ❌ removed |
| `cash on cash return calculator` | — | Wall Street Prep article 56; Investopedia article 91; LoopNet explainer 72 | — | — | proapod 18 (#1), multifamily.loans 35, hud.loans 31, industrialproperty.loan 21, Airbtics 33, ajdesigner 43, doorvest 24 | **10 open** · no strong calculator → ✅ Tier 1 (restored) |
| `contribution margin calculator` | — | Wall Street Prep ×2 and Investopedia articles; Omni and CalculatorSoup gross-margin tools; Wayflyer blog | Omni 84 | Keka 58 | pushowl 29 (#3), accountingaitools 9 | **8 open** · small volume → ✅ Tier 1 (restored) |
| `commercial mortgage calculator` | — | cbscuso generic amortization 23 | mortgagecalculator.org 62, Nationwide 68 | Lendio 47, Local First Bank 47 | thecommercialbank 28, CommLoan 31, commercialrealestate.loans 37, F&M Bank 38, commercialloandirect 28 | **6 open** → 🟡 Tier 2 (restored) |
| `equipment loan calculator` | — | AgDirect calculator index; gocurrency generic loan tool | Cat 61, Citizens Bank 65, SoFi 73 | Lendio 47 | FCS America 43, GenEquip 25, Oakmont 25, AgCountry 33 | **6 open** → 🟡 Tier 2 (restored) |
| `hourly invoice template` | — | QuickBooks freelance 86; Adobe general 100; Harvest glossary 54; InvoiceQuick general 31 | eForms 62, Vertex42 62 | Invoice Simple 48, FreshBooks 52 | Portant 38, InvoiceMaker 29 | **6 open** → 🟡 Tier 2 (restored) |
| `wage calculator` | YouTube | — (Google shows take-home paycheck tools) | ADP 81 ×2, Calculator.net 90, SmartAsset 67, Gusto 60 | PaycheckCity 50, SurePayroll 45 | esmartpaycheck 30, Ordio 41 | **3 open** · tax tables needed → ❌ |
| `square reader fees` | Reddit | — | Square 76 ×4, NerdWallet 80, Jotform 75 | Bluevine 47 | SwipeSum 35, ebayfeescalculator 41 | **3 open** → ❌ |
| `net worth calculator` | diabetes.org glucose calculator | net-worth percentile tool 27 | Ramsey 64, NerdWallet 80, AARP 80, SEBI 67 | Ameriprise 52, Empower 59 | Paducah Bank 30, KEMBA 42 | **4 open** · KD 51 → ❌ |
| `compound calculator` | Treasury prompt-payment page | — | investor.gov 70, NerdWallet 80, Bankrate 78, TheCalculatorSite 78 | Landmark CU 45, MoneyChimp 47, MDM 45 | MCNB 42, Lake City Bank 40 | **3 open** → ❌ |
| `heloc calculator` | duplicate Flagstar URL | Truist how-to article 68 | Bank of America 85, Calculator.net 90, Bankrate 78, Chase 85, U.S. Bank 76 | Flagstar 52 | myfsbonline 38, UNFCU 44 | **4 open** · YMYL → ❌ |
| `credit card apr calculator` | — | Chase how-to article 85 | Discover 71, NerdWallet 80, Calculator.net 90, Bankrate 78, SoFi 73, Lloyds 70, Credit Karma 68 | Ameriprise 52 | mycentral 35 | **2 open** · YMYL → ❌ |
| `present value calculator` | — | Investopedia article 91 | Calculator.net 90, Stanford 84, SEBI 67, Omni 84, CalculatorSoup 80 | MoneyChimp 47, Fiserv 49 | fncalculator 38, Financial Mentor 39 | **3 open** · KD 50 → ❌ |

**Open slots** = irrelevant + semi-relevant + weak relevant results. 7 or more open slots with at most 1–2 strong relevant pages = Tier 1.

### Master table

| # | Tier | SERP (Semrush) | New tool | Primary keyword | US Vol | KD | CPC | Ad comp | Keywords | Cluster US vol | Easy vol (KD ≤15) | YMYL | URL |
|---:|:---:|:---:|---|---|---:|---:|---:|---:|---:|---:|---:|:---:|---|
| 1 | **1** | ✅ weak | Markup Calculator | `markup calculator` | 14,800 | 24 | $5.16 | 0.03 | 16 | 61,200 | 11,600 | none | `/markup-calculator/` |
| 2 | **1** | ✅ weak | Unit Price Calculator | `unit price calculator` | 1,900 | 14 | $0.00 | 0.33 | 5 | 5,680 | 5,680 | none | `/unit-price-calculator/` |
| 3 | **1** | ✅ weak | Cap Rate & Commercial Property Value Calculator | `cap rate calculator` | 6,600 | 24 | $0.87 | 0.12 | 27 | 26,070 | 12,790 | low | `/cap-rate-calculator/` |
| 4 | **1** | ✅ weak | Rental Property Calculator (Cash Flow, Cash-on-Cash, ROI, Yield) | `cash on cash return calculator` | 1,300 | 17 | $0.81 | 0.27 | 52 | 21,590 | 15,940 | low | `/rental-property-calculator/` |
| 5 | **1** | ✅ weak | Labor Cost Calculator (Construction & Business) | `labor cost` | 1,900 | 14 | $6.43 | 0.33 | 2 | 2,900 | 2,900 | none | `/labor-cost-calculator/` |
| 6 | **1** | ✅ very weak | Commercial Lease Calculator (Rent per Sq Ft, NNN, CAM) | `commercial lease calculator` | 390 | 17 | $2.46 | 0.06 | 12 | 14,810 | 8,320 | none | `/commercial-lease-calculator/` |
| 7 | **1** | ✅ weak | Short-Term Rental (Airbnb) Profit Calculator | `airbnb profit calculator` | 880 | 19 | $2.94 | 0.52 | 38 | 11,010 | 6,890 | low | `/airbnb-calculator/` |
| 8 | **1** | ✅ weak | Freelance Hourly Rate Calculator | `freelance rate calculator` | 320 | 19 | $0.00 | 0.01 | 32 | 5,040 | 2,420 | none | `/freelance-rate-calculator/` |
| 9 | **1** | ✅ weak (small) | Contribution Margin & Break-Even Calculator | `contribution margin and contribution margin ratio` | 2,400 | 4 | $0.00 | 0.33 | 4 | 7,500 | 3,700 | none | `/contribution-margin-calculator/` |
| 10 | **2** | 🟡 possible | Commercial Mortgage & LTV Calculator | `commercial mortgage calculator` | 8,100 | 6 | $2.15 | 0.15 | 16 | 47,510 | 36,210 | medium | `/commercial-mortgage-calculator/` |
| 11 | **2** | 🟡 guide gap | Business Valuation Calculator (SDE / EBITDA multiple) | `small business valuation` | 1,600 | 26 | $5.35 | 0.40 | 37 | 40,650 | 4,140 | low | `/business-valuation-calculator/` |
| 12 | **2** | 🟡 possible | Discount / Percent Off Calculator | `discount computation` | 14,800 | 6 | $0.94 | 1.00 | 51 | 102,960 | 31,060 | none | `/discount-calculator/` |
| 13 | **2** | 🟡 hard | Profit Margin Calculator (Gross / Operating / Net) | `gross margin calculator` | 8,100 | 8 | $1.65 | 0.02 | 19 | 62,640 | 31,540 | none | `/profit-margin-calculator/` |
| 14 | **2** | 🟡 possible | Equipment & Business Loan Calculator | `equipment loan calculator` | 1,900 | 6 | $1.98 | 0.35 | 13 | 20,910 | 7,910 | medium | `/equipment-loan-calculator/` |
| 15 | **2** | 🟡 possible | Invoice Generator (Hourly & Freelance) | `hourly invoice template` | 1,600 | 26 | $4.28 | 0.95 | 16 | 3,540 | 960 | none | `/invoice-generator/` |
| 16 | **3** | 🟡 YMYL | Retirement Drawdown – “How Long Will My Money Last?” Calculator | `how long will my money last` | 12,100 | 0 | $1.20 | 0.09 | 15 | 46,090 | 24,190 | **high** | `/how-long-will-my-money-last/` |
| 17 | **3** | 🟡 YMYL | SBA Loan Calculator (7(a) & 504) | `sba 504 loan` | 4,400 | 5 | $7.65 | 0.51 | 9 | 15,860 | 12,160 | medium | `/sba-loan-calculator/` |
| 18 | **3** | 🟡 YMYL | Self-Employment (1099) Tax Calculator | `1099 tax calculator` | 9,900 | 6 | $0.70 | 0.11 | 7 | 27,600 | 23,200 | **high** | `/self-employment-tax-calculator/` |

**Totals (kept tools):** 18 tools · 371 keywords · 523,560 combined US volume · 241,610 on KD ≤ 15. Close variants overlap, so real traffic will be lower than these sums.

**Tiers:** **1** = weak SERP (several AS < 40 tool pages in the top 10, often in the top 3), build first · **2** = possible with links (giants on top, weak sites lower on page 1, or a guide gap) · **3** = weak domains but YMYL.

**How to read “weak”:** a site at AS 7–40 holding a top-10 spot with an exact-match tool page means Google has no better page to show. A new, better page with a handful of relevant links can take that spot.

---

## 2. Tool-by-tool detail (kept tools)

## Tier 1 — weak SERP, build first

### 1. Markup Calculator

- **URL:** `/markup-calculator/`
- **SEO title (50 chars, 62 with “ | KKC Tools”):** Markup Calculator – Selling Price, Markup & Margin
- **H1:** Markup Calculator: Selling Price from Cost and Markup %
- **Meta description (155 chars):** Free markup calculator. Enter cost and markup to get the selling price, or cost and price to get markup %, with gross margin and profit shown side by side.
- **Primary keyword:** `markup calculator` — US 14,800 · KD 24 · CPC $5.16 · ad comp 0.03
- **Export seed:** #2 product markup calculator
- **Cluster:** 16 keywords · 61,200 US searches · 11,600 on KD ≤ 15
- **SERP (Semrush, 2026-11-16):** ✅ weak — Avg AS 41. #1 userjot.com AS 33, #2 storeradar.com AS 14, #4 Upmetrics 38, #7 activecalculator 27, #8 feeqd 19, #10 roxanlabs 15. Strong: Xero 72, Shopify 84, CFI 70. **Verdict:** Six of ten slots are small tool sites (AS 14–38), including #1 and #2. Biggest volume we can win (14.8K). Build first.

**Why this tool:** Exact-match tool keyword: **14,800 US, CPC $5.16** (high CPC = business buyers). It is the seed topic of export #2. The retail-price and selling-price terms add about 40,000 more searches as H2 and FAQ support.

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`markup calculator`** | **Primary** | 14,800 | 24 | $5.16 | 0.03 | Info |  |  |
| `figuring markup` | Secondary – easy (KD ≤15) | 2,400 | 12 | $5.16 | 0.03 | Info | ⚠ declining |  |
| `what is retail price` | Secondary – easy (KD ≤15) | 2,400 | 7 | $0.00 | 0.33 | Info | ↑ rising | FAQ / H2 |
| `average pricing` | Secondary – easy (KD ≤15) | 1,900 | 15 | $2.50 | 0.33 | Info | ↑ rising |  |
| `definition retail price` | Secondary – easy (KD ≤15) | 1,300 | 10 | $0.00 | 0.33 | Info |  | FAQ / H2 |
| `how much should i sell it for` | Secondary – easy (KD ≤15) | 1,300 | 12 | $0.00 | 0.33 | Info | ↑ rising | FAQ / H2 |
| `prices to sell` | Secondary – easy (KD ≤15) | 1,300 | 9 | $0.00 | 0.33 | Info | ⚠ irregular |  |
| `omni markup calculator` | Secondary – easy (KD ≤15) | 1,000 | 0 | $0.00 | 0.33 | Info | ↑ rising | competitor brand — proves Omni ranks; do not use in copy |
| `retail math` | Secondary – medium (KD 16–24) | 1,900 | 16 | $3.33 | 0.01 | Info |  |  |
| `retail price` | Support – H2/FAQ (KD 25–30) | 14,800 | 26 | $6.93 | 0.33 | Info | ↑ rising | broad head — H2 only |
| `selling price` | Support – H2/FAQ (KD 25–30) | 6,600 | 25 | $1.99 | 0.33 | Info | ↑ rising | broad head — H2 only |
| `sell price` | Support – H2/FAQ (KD 25–30) | 2,900 | 27 | $1.99 | 0.33 | Info | ↑ rising |  |
| `markup vs margin` | Support – H2/FAQ (KD 25–30) | 2,400 | 25 | $0.47 | 0.11 | Comm |  | H2 + conversion table |
| `sales price` | Support – H2/FAQ (KD 25–30) | 2,400 | 25 | $0.00 | 0.33 | Trans | ↑ rising |  |
| `mark up` | Support – H2/FAQ (KD 25–30) | 1,900 | 29 | $6.17 | 0.02 | Info |  |  |
| `how to price your product` | Support – H2/FAQ (KD 25–30) | 1,900 | 26 | $2.60 | 0.12 | Info | ↑ rising | H2 / FAQ |

**Tool must include:**
- Cost + markup % → selling price; cost + price → markup %; price + markup → cost
- Always show gross margin next to markup (the #1 confusion), with a markup ↔ margin conversion table
- Price chain: maker → wholesale → retail, with a markup at each step
- Price endings: round to .99 / .95 / whole dollar
- List mode for a whole product list; copy / share / print

**Note:** KD 24 means it needs a few links. It pairs with the Profit Margin page (#13): build both together and cross-link them so each one owns its own term.

### 2. Unit Price Calculator

- **URL:** `/unit-price-calculator/`
- **SEO title (53 chars, 65 with “ | KKC Tools”):** Unit Price Calculator – Price per Ounce, Pound & Item
- **H1:** Unit Price Calculator: Compare Price per Ounce, Pound or Unit
- **Meta description (151 chars):** Free unit price calculator. Compare two or more products by price per ounce, pound, litre or item and see which one is the better deal and by how much.
- **Primary keyword:** `unit price calculator` — US 1,900 · KD 14 · CPC $0.00 · ad comp 0.33
- **Export seed:** #2 product markup (related)
- **Cluster:** 5 keywords · 5,680 US searches · 5,680 on KD ≤ 15
- **SERP (Semrush, 2026-11-16):** ✅ weak — Avg AS 42 (inflated by the Play Store). After Omni (84) and Inch Calculator (81): unitpricecalculator.com AS 14, unitpriceapp.com 9, calctrail 10, calckit 22, sparkcalc 9, bangyourbuck 9. **Verdict:** Six slots held by AS 9–22 sites. One of the weakest SERPs in the batch; `price per unit calculator` (1.3K, KD 0) shares the page.

**Why this tool:** Small, but **every keyword is KD ≤ 14** with transactional intent. It is a one-day build with unit conversion (oz, lb, g, kg, fl oz, L, count).

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`unit price calculator`** | **Primary** | 1,900 | 14 | $0.00 | 0.33 | Trans |  |  |
| `price per ounce calculator` | Secondary – easy (KD ≤15) | 1,300 | 11 | $0.00 | 0.33 | Trans |  |  |
| `price per unit calculator` | Secondary – easy (KD ≤15) | 1,300 | 0 | $0.00 | 0.33 | Trans |  |  |
| `calculate price per oz` | Secondary – easy (KD ≤15) | 590 | 11 | $0.00 | 0.33 | Trans | ↑ rising |  |
| `cost per unit` | Secondary – easy (KD ≤15) | 590 | 7 | $0.00 | 0.33 | Info | ↑ rising | H2 for sellers (cost per unit → link to Markup) |

**Tool must include:**
- 2–6 products: price + size + unit → price per chosen unit, cheapest highlighted, “% cheaper” shown
- Mixed units (16 oz vs 1 kg) converted automatically
- Multipacks (6 × 330 ml)
- Seller mode: batch cost ÷ units → cost per unit, then link to Markup

**Note:** Quick win: build it between bigger pages.

### 3. Cap Rate & Commercial Property Value Calculator

- **URL:** `/cap-rate-calculator/`
- **SEO title (53 chars, 65 with “ | KKC Tools”):** Cap Rate Calculator – NOI & Commercial Property Value
- **H1:** Cap Rate Calculator: Cap Rate, NOI and Property Value
- **Meta description (148 chars):** Free cap rate calculator. Work out net operating income, the cap rate from a price, or a commercial property’s value from NOI and a market cap rate.
- **Primary keyword:** `cap rate calculator` — US 6,600 · KD 24 · CPC $0.87 · ad comp 0.12
- **Export seed:** #4 commercial lease / rental yield (related)
- **Cluster:** 27 keywords · 26,070 US searches · 12,790 on KD ≤ 15
- **SERP (Semrush, 2026-11-16):** ✅ weak — Avg AS 34. mynd 40, Omni 84, commercialrealestate.loans 37, RentSpree 41, commercialloandirect 28, Landlord Studio 38, propmetrics.co 9, Northpoint 29, reinvestorguide 7, thesisdriven 31. **Verdict:** Only Omni is strong; the rest are AS 7–41 real-estate tool pages. 6.6K volume.

**Why this tool:** About **26,000 combined US searches**, almost all KD ≤ 28. The commercial “value estimator” searches are solved by the same formula (value = NOI ÷ cap rate), so one page covers them all instead of 10 thin pages.

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`cap rate calculator`** | **Primary** | 6,600 | 24 | $0.87 | 0.12 | Info |  |  |
| `cap rate california` | Secondary – easy (KD ≤15) | 5,400 | 12 | $0.87 | 0.12 | Info |  | ⚠ ambiguous (likely “average cap rate in California”) — do not publish averages without a cited source |
| `whats a cap rate in real estate` | Secondary – easy (KD ≤15) | 1,600 | 1 | $0.12 | 0.36 | Info | ↑ rising | FAQ / H2 |
| `cap rate equation` | Secondary – easy (KD ≤15) | 1,600 | 6 | $0.23 | 0.16 | Info | ⚠ declining | FAQ / H2 |
| `what cap rate in real estate` | Secondary – easy (KD ≤15) | 1,000 | 4 | $0.12 | 0.36 | Info | ⚠ declining | FAQ / H2 |
| `commercial real estate calculator` | Secondary – easy (KD ≤15) | 590 | 5 | $1.80 | 0.30 | Info |  |  |
| `pro-forma noi` | Secondary – easy (KD ≤15) | 320 | 5 | $2.13 | 0.04 | Info | ⚠ declining | same H2 |
| `pro forma noi` | Secondary – easy (KD ≤15) | 260 | 5 | $2.13 | 0.04 | Info |  | H2: pro-forma vs actual NOI |
| `cap calculator` | Secondary – easy (KD ≤15) | 210 | 3 | $0.00 | 0.00 | Info | ⚠ declining | ⚠ ambiguous (could be a hat or rate cap) |
| `commercial real estate valuation calculator` | Secondary – easy (KD ≤15) | 210 | 9 | $2.31 | 0.31 | Info |  |  |
| `commercial land value calculator` | Secondary – easy (KD ≤15) | 210 | 10 | $2.31 | 0.31 | Info |  | land has little NOI — FAQ explains why the income approach fits buildings |
| `commercial land value estimator` | Secondary – easy (KD ≤15) | 210 | 13 | $2.00 | 0.62 | Info | ⚠ declining | same FAQ |
| `commercial real estate value calculator` | Secondary – easy (KD ≤15) | 170 | 8 | $2.36 | 0.32 | Info |  |  |
| `property value estimator commercial` | Secondary – easy (KD ≤15) | 170 | 10 | $2.00 | 0.62 | Comm | ↑ rising |  |
| `commercial real estate value estimates` | Secondary – easy (KD ≤15) | 170 | 3 | $2.12 | 0.71 | Info | ⚠ declining |  |
| `commercial building valuation calculator` | Secondary – easy (KD ≤15) | 140 | 7 | $2.33 | 0.31 | Info |  |  |
| `commercial building value calculator` | Secondary – easy (KD ≤15) | 140 | 8 | $2.33 | 0.31 | Info |  |  |
| `commercial property estimated values` | Secondary – easy (KD ≤15) | 140 | 10 | $2.00 | 0.62 | Info |  |  |
| `commercial real estate estimator` | Secondary – easy (KD ≤15) | 140 | 14 | $2.96 | 0.62 | Info |  |  |
| `pro forma noi meaning` | Secondary – easy (KD ≤15) | 110 | 9 | $0.00 | 0.02 | Info |  | FAQ / H2 |
| `commercial real estate valuation` | Secondary – medium (KD 16–24) | 590 | 23 | $3.96 | 0.51 | Info |  |  |
| `calculate cap rate` | Support – H2/FAQ (KD 25–30) | 1,900 | 28 | $0.87 | 0.12 | Info | ↑ rising |  |
| `cap rate real estate` | Support – H2/FAQ (KD 25–30) | 1,600 | 26 | $0.40 | 0.35 | Info |  |  |
| `commercial property value` | Support – H2/FAQ (KD 25–30) | 1,000 | 28 | $2.68 | 0.58 | Info | ⚠ declining |  |
| `commercial property value estimator` | Support – H2/FAQ (KD 25–30) | 720 | 27 | $2.00 | 0.62 | Info | ⚠ declining |  |
| `calculate cap rate calculator` | Support – H2/FAQ (KD 25–30) | 480 | 26 | $0.81 | 0.10 | Info |  |  |
| `cap rate calculator real estate` | Support – H2/FAQ (KD 25–30) | 390 | 25 | $1.17 | 0.26 | Info |  |  |

**Tool must include:**
- NOI builder: gross rent, vacancy %, other income − operating expenses (tax, insurance, CAM, management %, repairs, reserves)
- Three solves: cap rate = NOI ÷ price; value = NOI ÷ cap rate; NOI needed = price × cap rate
- Sensitivity table: value at cap rates ±0.5% / ±1%
- Clear note: an estimate, not an appraisal (the commercial appraisal searches in the exports are service searches, so they are dropped)

**Note:** Never print “average cap rates by city” unless they are cited with a date. Use user inputs only.

### 4. Rental Property Calculator (Cash Flow, Cash-on-Cash, ROI, Yield)

- **URL:** `/rental-property-calculator/`
- **SEO title (47 chars, 59 with “ | KKC Tools”):** Rental Property Calculator – Cash-on-Cash & ROI
- **H1:** Rental Property Calculator: Cash Flow, Cash-on-Cash Return & ROI
- **Meta description (155 chars):** Free rental property calculator. Enter price, loan, rent and expenses to get monthly cash flow, cash-on-cash return, cap rate and rental yield in one view.
- **Primary keyword:** `cash on cash return calculator` — US 1,300 · KD 17 · CPC $0.81 · ad comp 0.27 (was `cash on cash return`, an informational definition query)
- **Export seed:** #4 rental yield calculator
- **Cluster:** 52 keywords · 21,590 US searches · 15,940 on KD ≤ 15
- **SERP (Semrush, 2026-11-16):** ✅ weak — Avg AS 42. proapod 18 (#1), multifamily.loans 35, hud.loans 31, Wall Street Prep 56 (article), Investopedia 91 (article), industrialproperty.loan 21, LoopNet 72 (explainer), Airbtics glossary 33, ajdesigner 43, doorvest 24. **Verdict:** Relevance check: no strong relevant calculator at all. The three strong domains (Investopedia, LoopNet, Wall Street Prep) are articles, and seven calculators are AS 18–43. All 10 slots are open. Primary switched from the definition keyword to `cash on cash return calculator` (1.3K, KD 17).

**Why this tool:** The seed `rental yield calculator` is a UK term and is not in the exports, but the US version of the same intent is huge: about **20,000 combined** across cash-on-cash, rental ROI, cash flow and pro forma, with the head `cash on cash return` at **3,600 / KD 7**.

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`cash on cash return`** | **Primary** | 3,600 | 7 | $0.38 | 0.15 | Info |  |  |
| `calculate rental property` | Secondary – easy (KD ≤15) | 2,900 | 8 | $2.06 | 0.18 | Info | ⚠ declining |  |
| `investment property calculator` | Secondary – easy (KD ≤15) | 1,300 | 2 | $1.44 | 0.86 | Comm |  |  |
| `cash on cash roi` | Secondary – easy (KD ≤15) | 880 | 4 | $0.36 | 0.16 | Info |  |  |
| `cash on cash calculator` | Secondary – easy (KD ≤15) | 720 | 9 | $0.81 | 0.27 | Info | ↑ rising |  |
| `roi calculator real estate` | Secondary – easy (KD ≤15) | 480 | 1 | $1.18 | 0.30 | Info |  |  |
| `rental cash flow calculator` | Secondary – easy (KD ≤15) | 480 | 2 | $0.00 | 0.00 | Info |  |  |
| `real estate pro forma` | Secondary – easy (KD ≤15) | 480 | 13 | $4.34 | 0.13 | Info | ⚠ declining |  |
| `pro forma real estate` | Secondary – easy (KD ≤15) | 390 | 11 | $5.45 | 0.10 | Info |  |  |
| `cash in cash return` | Secondary – easy (KD ≤15) | 260 | 5 | $0.38 | 0.15 | Info |  |  |
| `what is a good roi in real estate` | Secondary – easy (KD ≤15) | 260 | 13 | $1.16 | 0.06 | Info |  | FAQ / H2 |
| `real estate proforma` | Secondary – easy (KD ≤15) | 260 | 12 | $5.45 | 0.10 | Info |  |  |
| `proforma for real estate` | Secondary – easy (KD ≤15) | 260 | 15 | $4.34 | 0.13 | Info |  |  |
| `return on investment real estate` | Secondary – easy (KD ≤15) | 210 | 3 | $1.19 | 0.11 | Info |  |  |
| `calculating rental income` | Secondary – easy (KD ≤15) | 210 | 5 | $1.83 | 0.17 | Info |  |  |
| `roi in real estate` | Secondary – easy (KD ≤15) | 210 | 12 | $2.38 | 0.05 | Info | ⚠ declining |  |
| `pro froma multi-family cost template for free` | Secondary – easy (KD ≤15) | 210 | 2 | $0.00 | 0.00 | Info | ⚠ irregular | misspelling — do not use in copy |
| `pro froma multi-family cost template program for free` | Secondary – easy (KD ≤15) | 210 | 7 | $0.00 | 0.00 | Info | ⚠ irregular | misspelling — do not use in copy |
| `cash flow in real estate` | Secondary – easy (KD ≤15) | 170 | 14 | $3.66 | 0.12 | Info |  |  |
| `cash flow property` | Secondary – easy (KD ≤15) | 170 | 11 | $3.87 | 0.12 | Info |  |  |
| `what is a proforma in real estate` | Secondary – easy (KD ≤15) | 170 | 13 | $1.46 | 0.04 | Info |  | FAQ / H2 |
| `multi family pro forma template` | Secondary – easy (KD ≤15) | 170 | 2 | $0.00 | 0.00 | Info | ⚠ irregular | same — printable pro forma |
| `rental roi` | Secondary – easy (KD ≤15) | 140 | 2 | $1.61 | 0.11 | Info |  |  |
| `cash on cash yield` | Secondary – easy (KD ≤15) | 140 | 0 | $0.46 | 0.05 | Info |  |  |
| `how to calculate roi for rental property` | Secondary – easy (KD ≤15) | 140 | 0 | $0.95 | 0.32 | Info |  | FAQ / H2 |
| `roi for real estate` | Secondary – easy (KD ≤15) | 140 | 7 | $4.15 | 0.04 | Info | ⚠ declining |  |
| `real estate proforma template` | Secondary – easy (KD ≤15) | 140 | 9 | $4.52 | 0.22 | Info | ↑ rising | offer “print / copy as pro forma” output |
| `property management cost calculator` | Secondary – easy (KD ≤15) | 140 | 6 | $3.24 | 0.26 | — |  | input: management % of rent |
| `cash flowing properties` | Secondary – easy (KD ≤15) | 110 | 11 | $3.87 | 0.12 | Info |  |  |
| `calculating roi on rental property` | Secondary – easy (KD ≤15) | 110 | 1 | $1.39 | 0.13 | Info |  |  |
| `rate of return on rental property` | Secondary – easy (KD ≤15) | 110 | 0 | $1.13 | 0.08 | Info | ↑ rising |  |
| `coc calculator` | Secondary – easy (KD ≤15) | 110 | 8 | $0.00 | 0.33 | Info |  |  |
| `coc formula` | Secondary – easy (KD ≤15) | 110 | 12 | $3.07 | 0.04 | Info |  | FAQ / H2 |
| `pro forma rental property` | Secondary – easy (KD ≤15) | 110 | 11 | $4.40 | 0.25 | Info |  |  |
| `pro forma rent` | Secondary – easy (KD ≤15) | 110 | 10 | $3.70 | 0.11 | Info |  |  |
| `how do you make money on rental property` | Secondary – easy (KD ≤15) | 110 | 5 | $2.00 | 0.36 | Info |  | FAQ / H2 |
| `how to make money from a rental property` | Secondary – easy (KD ≤15) | 110 | 8 | $1.54 | 0.32 | Info |  | FAQ / H2 |
| `real estate development pro forma` | Secondary – easy (KD ≤15) | 110 | 12 | $5.30 | 0.20 | Info |  | ⚠ development pro forma is a different model — FAQ only |
| `cash on cash return calculator` | Secondary – medium (KD 16–24) | 1,300 | 17 | $0.81 | 0.27 | Info |  |  |
| `what is roi in real estate` | Secondary – medium (KD 16–24) | 480 | 16 | $0.68 | 0.05 | Info | ↑ rising | FAQ / H2 |
| `property value to rent ratio` | Secondary – medium (KD 16–24) | 390 | 24 | $0.00 | 0.01 | Info |  |  |
| `cash flow real estate` | Secondary – medium (KD 16–24) | 320 | 17 | $3.66 | 0.12 | Info |  |  |
| `pro forma in real estate` | Secondary – medium (KD 16–24) | 320 | 18 | $4.34 | 0.13 | Info | ⚠ declining |  |
| `income producing real estate` | Secondary – medium (KD 16–24) | 320 | 17 | $3.77 | 0.34 | Info |  |  |
| `what is a good roi for rental property` | Secondary – medium (KD 16–24) | 260 | 23 | $0.75 | 0.08 | Info |  | FAQ — no invented benchmarks |
| `proforma real estate` | Secondary – medium (KD 16–24) | 260 | 16 | $4.34 | 0.13 | Info | ⚠ declining |  |
| `cash on cash roi calculator` | Secondary – medium (KD 16–24) | 210 | 23 | $0.75 | 0.22 | Info | ⚠ declining |  |
| `investment property analysis` | Secondary – medium (KD 16–24) | 210 | 23 | $5.04 | 0.48 | Info | ⚠ declining |  |
| `cash flow properties` | Secondary – medium (KD 16–24) | 170 | 20 | $3.38 | 0.21 | Info |  |  |
| `calculator real estate investment` | Support – H2/FAQ (KD 25–30) | 880 | 28 | $1.72 | 0.34 | Comm |  |  |
| `real estate roi` | Support – H2/FAQ (KD 25–30) | 320 | 27 | $4.91 | 0.05 | Info |  |  |
| `real estate investment roi` | Support – H2/FAQ (KD 25–30) | 210 | 26 | $1.50 | 0.11 | Info |  |  |

**Tool must include:**
- Purchase: price, closing costs, rehab; loan: down %, rate, term (P&I computed)
- Income: rent, other income, vacancy %; expenses: tax, insurance, HOA, management %, repairs %, capex %
- Outputs: monthly and annual cash flow, cash-on-cash, cap rate, gross and net yield (UK users), 1% rule, rent-to-price ratio
- A 5–10-year pro forma table (rent and expense growth, equity build-up), printable
- Share link + print; cross-link Cap Rate (#3) and Airbnb (#7)

**Note:** One strong page beats separate CoC, ROI and pro forma pages: Google groups these in one SERP. Re-check after the SERP pull.

### 5. Labor Cost Calculator (Construction & Business)

- **URL:** `/labor-cost-calculator/`
- **SEO title (50 chars, 62 with “ | KKC Tools”):** Labor Cost Calculator – Burdened Hourly Labor Rate
- **H1:** Labor Cost Calculator: True Hourly Cost of a Worker or Crew
- **Meta description (152 chars):** Free labor cost calculator. Add wages, payroll taxes, insurance and benefits to get the burdened hourly cost of a worker or crew, and the price per job.
- **Primary keyword:** `labor cost` — US 1,900 · KD 14 · CPC $6.43 · ad comp 0.33
- **Export seed:** #2 (related)
- **Cluster:** 2 keywords · 2,900 US searches · 2,900 on KD ≤ 15
- **SERP (Semrush, 2026-11-16):** ✅ weak — Avg AS 39. Indeed 100, Gusto 60, submittallink AS 11 (#3), SimplyWise 35, Miter 37, Homebase 52, 247pro 25, ezclocker 29 (×2), estimationpro 20. **Verdict:** Construction-flavoured labor calculators from AS 11–37 sites rank; fits our construction audience and links to the live estimate template.

**Why this tool:** Small (**2,900**) but both rows are rising, and it fits the existing construction audience exactly (links to Construction Estimate Template and every material calculator).

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`labor cost`** | **Primary** | 1,900 | 14 | $6.43 | 0.33 | Info | ↑ rising | broad term — H1 + definition |
| `how to estimate labor costs for construction` | Secondary – easy (KD ≤15) | 1,000 | 5 | $0.00 | 0.00 | Info | ↑ rising | FAQ / H2 |

**Tool must include:**
- Wage + payroll tax % + workers’ comp % + benefits → burdened hourly rate
- Crew builder (several roles), job hours → labor cost; overhead % and profit % → bid price
- Productive vs paid hours

**Note:** Pull `labor cost calculator` and `labor burden calculator` data. They are not in these exports.

### 6. Commercial Lease Calculator (Rent per Sq Ft, NNN, CAM)

- **URL:** `/commercial-lease-calculator/`
- **SEO title (50 chars, 62 with “ | KKC Tools”):** Commercial Lease Calculator – Rent per Sq Ft & NNN
- **H1:** Commercial Lease Calculator: Rent per Square Foot, NNN & CAM
- **Meta description (154 chars):** Free commercial lease calculator. Convert rent per square foot per year to monthly rent, add NNN or CAM charges and escalations, and see total lease cost.
- **Primary keyword:** `commercial lease calculator` — US 390 · KD 17 · CPC $2.46 · ad comp 0.06
- **Export seed:** #4 commercial lease calculator
- **Cluster:** 12 keywords · 14,810 US searches · 8,320 on KD ≤ 15
- **SERP (Semrush, 2026-11-16):** ✅ very weak — Avg AS 49 (YouTube / Calculator.net inflate it). #1 q4realestate AS 21, Austin Tenant Advisors 26, a cell-tower lease page 26, nycrgroup 23, Tyler Cauble 25, a NZ form page 39. Calculator.net is a car-lease page. **Verdict:** Several results do not even match the intent (cell-tower lease, car lease, a water-company form). A focused commercial lease calculator is the most relevant page. Small volume (390) but easy.

**Why this tool:** This is the exact seed of export #4. The head is small (**390 / KD 17**), but the lease vocabulary around it (CAM, NNN, gross lease, TI, $/SF/yr) adds about **14,000 easy searches**, and no one explains it with a working calculator.

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`commercial lease calculator`** | **Primary** | 390 | 17 | $2.46 | 0.06 | Comm |  |  |
| `net net net and triple net lease` | Secondary – easy (KD ≤15) | 2,400 | 5 | $0.52 | 0.28 | Info | ⚠ irregular | H2 “Gross vs modified gross vs NNN” |
| `cam expenses` | Secondary – easy (KD ≤15) | 1,900 | 4 | $1.29 | 0.09 | Info | ↑ rising |  |
| `rent for commercial` | Secondary – easy (KD ≤15) | 1,600 | 11 | $1.22 | 0.47 | Info | ⚠ declining |  |
| `sf/yr meaning` | Secondary – easy (KD ≤15) | 720 | 2 | $0.00 | 0.33 | Info |  | H2 “$/SF/yr explained” |
| `what is a gross lease` | Secondary – easy (KD ≤15) | 720 | 2 | $0.08 | 0.18 | Info |  | FAQ / H2 |
| `rent increase calculator` | Secondary – easy (KD ≤15) | 720 | 9 | $2.03 | 0.01 | Info | ⚠ declining | escalation mode (fixed % / CPI) |
| `commercial property rent calculator` | Secondary – easy (KD ≤15) | 260 | 10 | $3.50 | 0.14 | Comm |  |  |
| `tenant improvement` | Secondary – medium (KD 16–24) | 1,600 | 20 | $8.21 | 0.02 | Info |  | input: TI allowance + amortized TI |
| `modified gross lease` | Secondary – medium (KD 16–24) | 1,300 | 21 | $0.24 | 0.25 | Comm |  |  |
| `tenant improvements` | Secondary – medium (KD 16–24) | 1,300 | 22 | $8.21 | 0.02 | Info |  | same |
| `gross lease` | Support – H2/FAQ (KD 25–30) | 1,900 | 27 | $0.26 | 0.12 | Info/Comm |  |  |

**Tool must include:**
- $/SF/yr ↔ $/SF/month ↔ monthly rent ↔ annual rent; rentable vs usable sq ft (load factor)
- Lease types: gross, modified gross, NNN (tax + insurance + CAM per SF)
- Escalations (fixed % or $/SF per year), free-rent months, TI allowance → effective rent
- Total lease cost over the term, year-by-year table, printable

**Note:** It fits the site’s construction audience (contractors leasing a yard or shop) and links to Cap Rate (#3) and Rental Property (#4).

### 7. Short-Term Rental (Airbnb) Profit Calculator

- **URL:** `/airbnb-calculator/`
- **SEO title (50 chars, 62 with “ | KKC Tools”):** Airbnb Calculator – Short-Term Rental Profit & ROI
- **H1:** Airbnb Profit Calculator: Short-Term Rental Income, Costs & ROI
- **Meta description (151 chars):** Free Airbnb calculator. Enter nightly rate, occupancy, fees and costs to see monthly income, cash flow and cash-on-cash return for a short-term rental.
- **Primary keyword:** `airbnb profit calculator` — US 880 · KD 19 · CPC $2.94 · ad comp 0.52
- **Export seed:** #4 rental yield (related)
- **Cluster:** 38 keywords · 11,010 US searches · 6,890 on KD ≤ 15
- **SERP (Semrush, 2026-11-16):** ✅ weak — Avg AS 33. Every result is AS 14–47: alltherooms 30, your.rentals 31, Airbtics 33, PriceLabs 47, Mashvisor 42 (×2), eFinancialModels 27, Hostfully 38, listingok 14, Rabbu 34. **Verdict:** No strong domain at all. 880 volume.

**Why this tool:** About **15,000 searches with CPC $3–9** (high commercial value), and many rows are KD 0–5.

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`airbnb profit calculator`** | **Primary** | 880 | 19 | $2.94 | 0.52 | Info |  |  |
| `bnb calculator` | Secondary – easy (KD ≤15) | 1,900 | 12 | $0.00 | 0.00 | Nav | ⚠ declining |  |
| `airbnb property analysis` | Secondary – easy (KD ≤15) | 590 | 4 | $4.90 | 0.75 | Info | ⚠ declining |  |
| `free airbnb calculator` | Secondary – easy (KD ≤15) | 480 | 0 | $2.68 | 0.68 | Info |  |  |
| `airbnb calc` | Secondary – easy (KD ≤15) | 320 | 0 | $3.92 | 0.67 | Nav |  |  |
| `airbnb price estimator` | Secondary – easy (KD ≤15) | 320 | 9 | $3.61 | 0.41 | Trans |  |  |
| `vacation rental investment calculator` | Secondary – easy (KD ≤15) | 320 | 15 | $5.13 | 0.42 | Info | ⚠ declining |  |
| `airbnb arbitrage calculator` | Secondary – easy (KD ≤15) | 260 | 4 | $3.60 | 0.49 | Info | ⚠ declining | mode: rent the unit, then sublet |
| `airbnb how much can i make` | Secondary – easy (KD ≤15) | 260 | 8 | $3.53 | 0.43 | Info | ↑ rising |  |
| `vrbo income calculator` | Secondary – easy (KD ≤15) | 210 | 13 | $3.89 | 0.64 | Info | ⚠ declining |  |
| `vrbo profit calculator` | Secondary – easy (KD ≤15) | 210 | 12 | $5.29 | 0.68 | Info | ⚠ declining |  |
| `airbnb cash flow calculator` | Secondary – easy (KD ≤15) | 170 | 5 | $2.84 | 0.31 | Info | ⚠ declining |  |
| `airbnb return on investment` | Secondary – easy (KD ≤15) | 170 | 11 | $2.67 | 0.35 | Info |  |  |
| `mid term rental calculator` | Secondary – easy (KD ≤15) | 170 | 2 | $5.54 | 0.60 | Info |  | monthly-stay mode |
| `midterm rental calculator` | Secondary – easy (KD ≤15) | 170 | 5 | $8.49 | 0.34 | Info/Comm | ⚠ declining | same mode |
| `vrbo rental calculator` | Secondary – easy (KD ≤15) | 170 | 13 | $29.22 | 0.67 | Info |  |  |
| `vacation rental pro forma` | Secondary – easy (KD ≤15) | 170 | 5 | $0.00 | 0.33 | Info |  |  |
| `airbnb estimate calculator` | Secondary – easy (KD ≤15) | 140 | 0 | $4.52 | 0.60 | Comm |  |  |
| `free short term rental calculator` | Secondary – easy (KD ≤15) | 140 | 0 | $8.93 | 0.75 | Info |  |  |
| `how to analyze a short term rental` | Secondary – easy (KD ≤15) | 140 | 3 | $0.00 | 0.33 | Info |  | FAQ / H2 |
| `str income` | Secondary – easy (KD ≤15) | 140 | 1 | $7.80 | 0.08 | Info |  |  |
| `estimating airbnb income` | Secondary – easy (KD ≤15) | 110 | 4 | $4.77 | 0.57 | Info | ↑ rising |  |
| `how to estimate vacation rental income` | Secondary – easy (KD ≤15) | 110 | 0 | $5.56 | 0.64 | Info | ↑ rising | FAQ / H2 |
| `how much can i earn with airbnb` | Secondary – easy (KD ≤15) | 110 | 4 | $3.53 | 0.43 | Info |  | FAQ / H2 |
| `airbnb mortgage calculator` | Secondary – easy (KD ≤15) | 110 | 10 | $3.46 | 0.30 | Info |  |  |
| `vrbo calculator` | Secondary – medium (KD 16–24) | 390 | 21 | $9.74 | 0.56 | Info |  |  |
| `short term rental investment` | Secondary – medium (KD 16–24) | 320 | 19 | $4.85 | 0.34 | Info |  |  |
| `airbnb investment analysis` | Secondary – medium (KD 16–24) | 260 | 18 | $0.00 | 0.16 | Info |  |  |
| `airbnb return calculator` | Secondary – medium (KD 16–24) | 210 | 22 | $2.85 | 0.15 | Info |  |  |
| `how much can you make on airbnb` | Secondary – medium (KD 16–24) | 210 | 19 | $3.53 | 0.27 | Info |  | FAQ / H2 |
| `how much do airbnbs make` | Secondary – medium (KD 16–24) | 210 | 24 | $3.60 | 0.25 | Info |  | FAQ — no invented averages |
| `vacation rental property calculator` | Secondary – medium (KD 16–24) | 210 | 21 | $5.06 | 0.33 | Info | ⚠ declining |  |
| `how much can you make airbnb` | Secondary – medium (KD 16–24) | 170 | 17 | $3.67 | 0.36 | Info |  | FAQ / H2 |
| `how much can i earn on airbnb` | Secondary – medium (KD 16–24) | 170 | 20 | $4.22 | 0.47 | Info | ↑ rising | FAQ / H2 |
| `airbnb demand map` | Secondary – medium (KD 16–24) | 170 | 23 | $1.94 | 0.66 | Info |  | ⚠ market-data intent — drop from copy |
| `short term rental investment calculator` | Support – H2/FAQ (KD 25–30) | 390 | 29 | $5.05 | 0.28 | Info | ⚠ declining |  |
| `airbnb tax calculator` | Support – H2/FAQ (KD 25–30) | 320 | 28 | $11.95 | 0.15 | Info | ⚠ declining | ⚠ occupancy-tax intent — FAQ only |
| `average airbnb price` | Support – H2/FAQ (KD 25–30) | 210 | 29 | $5.20 | 0.17 | Info |  | ⚠ wants market data we cannot show (no network) |

**Tool must include:**
- Nightly rate, occupancy %, avg stay, cleaning fee, platform fee %, cleaning cost, utilities, supplies, management %
- Buy mode (mortgage) and arbitrage mode (monthly rent paid to a landlord)
- Outputs: monthly revenue, costs, cash flow, cash-on-cash, break-even occupancy
- Long-term rental comparison (links to Rental Property #7)

**Note:** **Intent gap:** many searchers want AirDNA-style *market data* (“how much can I make in my city”). We cannot fetch data (zero network), so the page must say “you enter the rate and occupancy”. Use “Short-term rental” in the H1/URL if trademark use of “Airbnb” worries you. Brand terms (bnbcalc, AirDNA Rentalizer, Rabbu, BiggerPockets) are dropped.

### 8. Freelance Hourly Rate Calculator

- **URL:** `/freelance-rate-calculator/`
- **SEO title (48 chars, 60 with “ | KKC Tools”):** Freelance Rate Calculator – Hourly Rate You Need
- **H1:** Freelance Hourly Rate Calculator: What to Charge per Hour
- **Meta description (149 chars):** Free freelance rate calculator. Start from the income you want, add expenses, taxes and time off, and get the hourly, day and project rate to charge.
- **Primary keyword:** `freelance rate calculator` — US 320 · KD 19 · CPC $0.00 · ad comp 0.01
- **Export seed:** #1 freelance hourly rate calculator
- **Cluster:** 32 keywords · 5,040 US searches · 2,420 on KD ≤ 15
- **SERP (Semrush, 2026-11-16):** ✅ weak — Avg AS 42. Upwork 73, #2 freelancehourlyrate.com AS 7, contractrates.fyi 22, freelanceratecalculator.com 15, YouTube, Harvest 54, HubSpot 79, virtual-headquarters 28, Appizy 22, PineBill 29. **Verdict:** AS 7–29 sites hold six slots, including #2. Small US volume (320; 1.2K global).

**Why this tool:** This is the seed of exports #1 and #1.1. The exact tool terms are small (**about 840**), but the “what should I charge” questions (copywriting / SEO / content rates) add about 3,000 more, and the tool solves them for any profession.

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`freelance rate calculator`** | **Primary** | 320 | 19 | $0.00 | 0.01 | Info |  |  |
| `why is seo expensive` | Secondary – easy (KD ≤15) | 480 | 14 | $0.00 | 0.01 | Info | ⚠ irregular | FAQ only |
| `website content writing cost` | Secondary – easy (KD ≤15) | 140 | 13 | $0.00 | 0.33 | Info | ⚠ declining |  |
| `copywriting cost` | Secondary – easy (KD ≤15) | 110 | 13 | $0.00 | 0.02 | Info | ⚠ declining |  |
| `website copywriting prices` | Secondary – easy (KD ≤15) | 110 | 5 | $0.00 | 0.33 | Info | ⚠ declining |  |
| `how much does website copywriting cost` | Secondary – easy (KD ≤15) | 110 | 6 | $0.00 | 0.33 | Info |  | FAQ / H2 |
| `freelance kmp app development rates prague 2026` | Secondary – easy (KD ≤15) | 110 | 11 | $0.00 | 0.00 | Info | ⚠ declining | 🌍 niche, skip |
| `copywriter rates` | Secondary – easy (KD ≤15) | 90 | 11 | $0.00 | 0.03 | Info | ⚠ declining |  |
| `copywriting fees` | Secondary – easy (KD ≤15) | 90 | 10 | $0.00 | 0.03 | Info | ⚠ declining |  |
| `copywriting prices` | Secondary – easy (KD ≤15) | 90 | 5 | $0.00 | 0.23 | Info |  |  |
| `website copywriting cost` | Secondary – easy (KD ≤15) | 90 | 2 | $0.00 | 0.33 | Info | ⚠ declining |  |
| `website copywriting rates` | Secondary – easy (KD ≤15) | 90 | 6 | $0.00 | 0.01 | Info |  |  |
| `seo copywriting prices` | Secondary – easy (KD ≤15) | 90 | 6 | $0.00 | 0.33 | Info |  |  |
| `standard professional rates website copywriting 2025` | Secondary – easy (KD ≤15) | 90 | 5 | $0.00 | 0.00 | Info | ⚠ irregular | dated query — skip in copy |
| `rock content calculadora freelancer` | Secondary – easy (KD ≤15) | 90 | 8 | $0.00 | 0.00 | Info | ⚠ irregular | 🌍 Portuguese, competitor brand |
| `copywriting charges` | Secondary – easy (KD ≤15) | 70 | 8 | $4.04 | 0.03 | Info |  |  |
| `how much do copywriters charge` | Secondary – easy (KD ≤15) | 70 | 9 | $0.00 | 0.33 | Info | ⚠ declining | FAQ / H2 |
| `how much is copywriting` | Secondary – easy (KD ≤15) | 70 | 6 | $0.00 | 0.33 | Info | ⚠ declining | FAQ / H2 |
| `web copywriting rates` | Secondary – easy (KD ≤15) | 70 | 11 | $0.00 | 0.01 | Info |  |  |
| `freelance rates copywriting` | Secondary – easy (KD ≤15) | 70 | 11 | $0.00 | 0.33 | Info |  |  |
| `copywriting costs` | Secondary – easy (KD ≤15) | 50 | 9 | $4.04 | 0.03 | Info |  |  |
| `website copywriting pricing` | Secondary – easy (KD ≤15) | 50 | 8 | $0.00 | 0.01 | Info | ⚠ declining |  |
| `ecommerce seo cost` | Secondary – easy (KD ≤15) | 50 | 14 | $0.00 | 0.33 | Info | ↑ rising |  |
| `copywriting services prices` | Secondary – easy (KD ≤15) | 50 | 5 | $0.00 | 0.33 | Info | ⚠ declining |  |
| `copywriting services rates` | Secondary – easy (KD ≤15) | 50 | 7 | $0.00 | 0.33 | Info | ⚠ declining |  |
| `content writing pricing` | Secondary – easy (KD ≤15) | 40 | 14 | $0.00 | 0.00 | Info | ⚠ declining |  |
| `seo consultant hourly rate` | Secondary – medium (KD 16–24) | 590 | 20 | $0.00 | 0.01 | Info | ⚠ declining | preset: “consultant” profile (user-entered market rate) |
| `freelance cost calculator` | Secondary – medium (KD 16–24) | 260 | 24 | $0.00 | 0.01 | Info |  |  |
| `freelance fee calculator` | Secondary – medium (KD 16–24) | 260 | 23 | $0.00 | 0.01 | Info |  |  |
| `copywriting rates` | Secondary – medium (KD 16–24) | 210 | 17 | $0.00 | 0.02 | Info | ⚠ declining |  |
| `ecommerce seo pricing` | Support – H2/FAQ (KD 25–30) | 590 | 27 | $0.00 | 0.04 | Trans | ⚠ declining |  |
| `freelance copywriter rates` | Support – H2/FAQ (KD 25–30) | 390 | 27 | $0.00 | 0.01 | Info | ⚠ declining |  |

**Tool must include:**
- Target take-home income → add business expenses, self-employment tax %, income tax % (user input), retirement % → gross needed
- Billable hours: weeks off, holidays, sick days, non-billable % (admin / sales)
- Outputs: hourly, day, weekly retainer and project price (hours × rate + buffer)
- Compare with a salaried job, and link to the Invoice Generator (#15) (the Hourly to Salary tool was removed after the SERP check)

**Note:** **Do not publish “average rates by profession”** unless they are cited (e.g. a named survey + year). `TODO(owner)` if you want a rate table. Most rows in exports #1 / #1.1 are job and platform searches (Upwork, Fiverr, writing jobs) and are dropped.

### 9. Contribution Margin & Break-Even Calculator

- **URL:** `/contribution-margin-calculator/`
- **SEO title (51 chars, 63 with “ | KKC Tools”):** Contribution Margin Calculator – Ratio & Break-Even
- **H1:** Contribution Margin Calculator: Ratio and Break-Even Point
- **Meta description (152 chars):** Free contribution margin calculator. Enter price, variable cost and fixed costs to get contribution margin per unit, the ratio and the break-even point.
- **Primary keyword:** `contribution margin and contribution margin ratio` — US 2,400 · KD 4 · CPC $0.00 · ad comp 0.33
- **Export seed:** #2 (related)
- **Cluster:** 4 keywords · 7,500 US searches · 3,700 on KD ≤ 15
- **SERP (Semrush, 2026-11-16):** ✅ weak (small) — Avg AS 58. Omni contribution-margin tool 84, Wall Street Prep articles (×2), pushowl tool 29 (#3), Investopedia article, Omni margin tool, CalculatorSoup margin tool, accountingaitools 9, Wayflyer blog 36, Keka tool 58. **Verdict:** Relevance check (SERP of `contribution margin calculator`): only one strong relevant tool (Omni). Six results are articles or calculators for a different metric (gross margin), and two relevant tools are AS 9–29: 8 open slots. Small head (260 US) but `calculate contribution margin` and `how to calculate contribution margin` are 1.6K each. Shares the Markup / Profit Margin engine.

**Why this tool:** About **7,500 searches at KD 4–22**. Students and owners both; a natural extension of Markup (#1) and Profit Margin (#13).

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`contribution margin and contribution margin ratio`** | **Primary** | 2,400 | 4 | $0.00 | 0.33 | Info | ⚠ declining |  |
| `define contribution margin` | Secondary – easy (KD ≤15) | 1,300 | 6 | $0.14 | 0.03 | Info | ⚠ declining | FAQ / H2 |
| `contribution margin equation` | Secondary – medium (KD 16–24) | 1,900 | 17 | $0.25 | 0.02 | Info | ⚠ declining | FAQ / H2 |
| `contribution margin ratio formula` | Secondary – medium (KD 16–24) | 1,900 | 22 | $0.00 | 0.33 | Info | ⚠ declining | FAQ / H2 |

**Tool must include:**
- Price, variable cost per unit, fixed costs → CM per unit, CM ratio, break-even units and sales $
- Target profit → units needed; multi-product (sales mix)

**Note:** All four rows are declining. `break even calculator` is not in the exports, so pull it: if it is large, this page becomes a Break-Even Calculator with CM as a section.

## Tier 2 — possible with links

### 10. Commercial Mortgage & LTV Calculator

- **URL:** `/commercial-mortgage-calculator/`
- **SEO title (50 chars, 62 with “ | KKC Tools”):** Commercial Mortgage Calculator – Payment & Balloon
- **H1:** Commercial Mortgage Calculator: Payment, Balloon, LTV & DSCR
- **Meta description (156 chars):** Free commercial mortgage calculator. Get the monthly payment, balloon balance, amortization schedule, loan-to-value and DSCR for a commercial property loan.
- **Primary keyword:** `commercial mortgage calculator` — US 8,100 · KD 6 · CPC $2.15 · ad comp 0.15
- **Export seed:** #4 commercial lease (related)
- **Cluster:** 16 keywords · 47,510 US searches · 36,210 on KD ≤ 15
- **SERP (Semrush, 2026-11-16):** 🟡 possible — Avg AS 40. mortgagecalculator.org 62, thecommercialbank 28, CommLoan 31, commercialrealestate.loans 37, F&M Bank debt-service tool 38, Lendio 47, Local First Bank 47, commercialloandirect 28, cbscuso generic amortization 23, Nationwide 68. **Verdict:** Relevance check: only 2 strong relevant tools (mortgagecalculator.org, Nationwide); 5 relevant tools are AS 23–38 and one is a generic amortization page: 6 open slots. NerdWallet is not in the real top 10. 8.1K at KD 6; users enter their own rate, so no rate data to maintain.

**Why this tool:** `commercial mortgage calculator` is **8,100 at KD 6** (CPC $2.15). The loan-to-value terms add about 23,000 more at KD 6–17, and LTV is an output of the same tool. Amortization maths is evergreen.

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`commercial mortgage calculator`** | **Primary** | 8,100 | 6 | $2.15 | 0.15 | Info/Comm |  |  |
| `ltv meaning` | Secondary – easy (KD ≤15) | 6,600 | 8 | $2.19 | 0.02 | Info |  | H2 “What LTV means” |
| `l.t.v.` | Secondary – easy (KD ≤15) | 5,400 | 12 | $5.72 | 0.01 | Info |  | same H2 |
| `ltv calculator` | Secondary – easy (KD ≤15) | 3,600 | 6 | $3.81 | 0.07 | Info |  |  |
| `what is ltv` | Secondary – easy (KD ≤15) | 3,600 | 15 | $3.67 | 0.02 | Info |  | same H2 |
| `land payment calculator` | Secondary – easy (KD ≤15) | 2,900 | 5 | $0.00 | 0.31 | Comm | ⚠ declining |  |
| `commercial mortgage rates` | Secondary – easy (KD ≤15) | 2,400 | 4 | $3.57 | 0.38 | Info |  | ⚠ rate-lookup intent; we show no live rates (zero network) — FAQ on what drives rates |
| `ltv loan to value` | Secondary – easy (KD ≤15) | 1,300 | 11 | $5.72 | 0.01 | Info | ↑ rising |  |
| `commercial mortgages` | Secondary – easy (KD ≤15) | 1,000 | 8 | $7.66 | 0.32 | Info |  |  |
| `buying commercial property` | Secondary – easy (KD ≤15) | 720 | 7 | $1.02 | 0.46 | Info |  |  |
| `business mortgage` | Secondary – easy (KD ≤15) | 590 | 8 | $9.19 | 0.35 | Info |  |  |
| `commercial real estate loans` | Secondary – medium (KD 16–24) | 4,400 | 20 | $9.06 | 0.34 | Info |  |  |
| `ltv loan` | Secondary – medium (KD 16–24) | 1,900 | 17 | $4.34 | 0.10 | Info | ↑ rising |  |
| `commercial construction loan` | Secondary – medium (KD 16–24) | 1,300 | 22 | $14.10 | 0.39 | Info |  | FAQ: interest-only draw period |
| `commercial construction loans` | Secondary – medium (KD 16–24) | 1,300 | 22 | $13.68 | 0.43 | Info |  | same FAQ |
| `commercial loan estimator` | Support – H2/FAQ (KD 25–30) | 2,400 | 25 | $2.77 | 0.35 | Info | ⚠ declining |  |

**Tool must include:**
- Loan amount or price + LTV %, rate, amortization years, term years → payment, balloon at maturity
- Interest-only period option; full amortization schedule (yearly / monthly), printable
- DSCR = NOI ÷ annual debt service (links to Cap Rate #6); max loan at a target DSCR and LTV
- Fees and points → effective cost

**Note:** Finance tool (YMYL-light). Present it as an estimator, with no rate claims. Rates are always typed in by the user.

### 11. Business Valuation Calculator (SDE / EBITDA multiple)

- **URL:** `/business-valuation-calculator/`
- **SEO title (44 chars, 56 with “ | KKC Tools”):** Business Valuation Calculator – SDE & EBITDA
- **H1:** Business Valuation Calculator: SDE, EBITDA and Multiples
- **Meta description (145 chars):** Free small business valuation calculator. Work out seller’s discretionary earnings (SDE) or EBITDA, apply a multiple range and get a value range.
- **Primary keyword:** `small business valuation` — US 1,600 · KD 26 · CPC $5.35 · ad comp 0.40
- **Export seed:** #5 business valuation calculator
- **Cluster:** 37 keywords · 40,650 US searches · 4,140 on KD ≤ 15
- **SERP (Semrush, 2026-11-16):** 🟡 guide gap — Avg AS 54. All articles, no calculator: Reddit, M&T Bank 64, The Hartford 64, CRI 40, OK SBDC 26, YouTube, Morgan & Westfield 34, Williams Keepers 23, business.gov.au 69, gvalue 20. **Verdict:** No calculator in the top 10 and four AS 20–34 articles rank. A strong guide + calculator page fits the gap (like our KD 45 win). Build it as a guide first, calculator second.

**Why this tool:** The seed head is not in the exports, but the **SDE cluster alone is about 21,000 searches** (`what is sde` 5,400, `sde meaning` 4,400…), and an SDE add-back builder is the tool those searchers need. HVAC business valuation is a clear niche (about 3,600).

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`small business valuation`** | **Primary** | 1,600 | 26 | $5.35 | 0.40 | Info/Comm |  |  |
| `how much can i sell my business for` | Secondary – easy (KD ≤15) | 1,000 | 14 | $3.13 | 0.59 | Info | ⚠ declining | FAQ / H2 |
| `value a business` | Secondary – easy (KD ≤15) | 480 | 11 | $3.26 | 0.15 | Info | ↑ rising |  |
| `how to value a business to sell` | Secondary – easy (KD ≤15) | 390 | 2 | $2.38 | 0.63 | Info |  | FAQ / H2 |
| `hvac business valuation calculator` | Secondary – easy (KD ≤15) | 320 | 9 | $4.65 | 0.08 | Info |  | industry preset (multiple entered by user) |
| `business valuation cost` | Secondary – easy (KD ≤15) | 260 | 14 | $5.47 | 0.41 | Info |  | ⚠ service-price intent — FAQ only |
| `how to calculate the value of a business for sale` | Secondary – easy (KD ≤15) | 210 | 0 | $2.20 | 0.57 | Info | ⚠ declining | FAQ / H2 |
| `valuing a business for sale` | Secondary – easy (KD ≤15) | 210 | 8 | $3.03 | 0.40 | Info | ⚠ declining |  |
| `valuation using multiples` | Secondary – easy (KD ≤15) | 210 | 8 | $3.15 | 0.02 | Info |  |  |
| `saas valuation calculator` | Secondary – easy (KD ≤15) | 210 | 13 | $10.39 | 0.25 | Info |  | ARR-multiple mode or FAQ |
| `free business valuation` | Secondary – easy (KD ≤15) | 170 | 3 | $7.98 | 0.66 | Info |  |  |
| `ecommerce business valuation` | Secondary – easy (KD ≤15) | 170 | 13 | $11.12 | 0.33 | Info |  |  |
| `what does cash flow sde mean` | Secondary – easy (KD ≤15) | 170 | 12 | $0.52 | 0.08 | Info |  | FAQ / H2 |
| `sde multiple` | Secondary – easy (KD ≤15) | 170 | 13 | $1.82 | 0.06 | Info/Comm |  |  |
| `business valuation services cost` | Secondary – easy (KD ≤15) | 170 | 9 | $7.18 | 0.83 | Info |  | ⚠ service-price intent — FAQ only |
| `sde meaning` | Secondary – medium (KD 16–24) | 4,400 | 24 | $0.04 | 0.01 | Info |  | FAQ / H2 |
| `meaning sde` | Secondary – medium (KD 16–24) | 1,900 | 23 | $0.56 | 0.01 | Info | ⚠ irregular | FAQ / H2 |
| `how to determine the value of a small business` | Secondary – medium (KD 16–24) | 720 | 22 | $2.25 | 0.35 | Info | ⚠ declining | FAQ / H2 |
| `what is my company worth` | Secondary – medium (KD 16–24) | 720 | 20 | $3.36 | 0.09 | Info | ↑ rising | FAQ / H2 |
| `ev/ebit` | Secondary – medium (KD 16–24) | 720 | 16 | $1.00 | 0.03 | Info | ⚠ declining | FAQ |
| `cash flow sde` | Secondary – medium (KD 16–24) | 590 | 24 | $1.97 | 0.06 | Info |  |  |
| `cash flow sde meaning` | Secondary – medium (KD 16–24) | 590 | 20 | $0.10 | 0.06 | Info |  | FAQ / H2 |
| `sde vs ebitda` | Secondary – medium (KD 16–24) | 480 | 18 | $3.43 | 0.04 | Comm | ↑ rising | FAQ / H2 |
| `ev ebit` | Secondary – medium (KD 16–24) | 480 | 20 | $1.04 | 0.04 | Info |  | FAQ |
| `how to calculate a value of a company` | Secondary – medium (KD 16–24) | 390 | 16 | $2.03 | 0.34 | Info |  | FAQ / H2 |
| `hvac business valuation` | Secondary – medium (KD 16–24) | 390 | 18 | $5.51 | 0.06 | Info | ↑ rising |  |
| `what is sde` | Support – H2/FAQ (KD 25–30) | 5,400 | 25 | $0.00 | 0.00 | Info | ↑ rising | H2 “What SDE is” + SDE add-back builder |
| `p/ebitda` | Support – H2/FAQ (KD 25–30) | 5,400 | 27 | $0.43 | 0.01 | Info |  | FAQ |
| `how to value a heating and air conditioning business` | Support – H2/FAQ (KD 25–30) | 2,900 | 25 | $0.00 | 0.43 | — | ⚠ declining | FAQ / H2 |
| `s d e meaning` | Support – H2/FAQ (KD 25–30) | 2,900 | 25 | $0.04 | 0.01 | Info | ⚠ irregular | FAQ / H2 |
| `what is the valuation of` | Support – H2/FAQ (KD 25–30) | 1,600 | 27 | $1.87 | 0.33 | Info | ⚠ irregular | ⚠ vague / irregular |
| `s.d.e meaning` | Support – H2/FAQ (KD 25–30) | 1,300 | 28 | $0.04 | 0.01 | Info | ⚠ irregular | FAQ / H2 |
| `seller's discretionary earnings` | Support – H2/FAQ (KD 25–30) | 1,000 | 27 | $0.85 | 0.09 | Info | ⚠ declining |  |
| `what is sde in business` | Support – H2/FAQ (KD 25–30) | 1,000 | 28 | $0.12 | 0.04 | Info | ↑ rising | FAQ / H2 |
| `how to valuate a small business` | Support – H2/FAQ (KD 25–30) | 720 | 28 | $2.36 | 0.53 | Info |  | FAQ / H2 |
| `define sde` | Support – H2/FAQ (KD 25–30) | 720 | 26 | $0.11 | 0.01 | Info | ↑ rising | FAQ / H2 |
| `what does sde mean` | Support – H2/FAQ (KD 25–30) | 590 | 25 | $0.00 | 0.01 | Info | ⚠ declining | FAQ / H2 |

**Tool must include:**
- SDE builder: net profit + owner pay + interest + depreciation/amortization + one-off and personal add-backs
- EBITDA builder for bigger firms; user-entered low / high multiple → value range
- Asset approach check (equipment + inventory) and an earnings vs asset floor
- Clear disclaimer: estimate only, not a formal valuation

**Note:** **Never print industry multiples we cannot cite.** If you show a range, source it (for example the BizBuySell Insight report, with date). `TODO(owner)`: confirm the source before publishing. Business-for-sale and broker searches are dropped (listing intent).

### 12. Discount / Percent Off Calculator

- **URL:** `/discount-calculator/`
- **SEO title (46 chars, 58 with “ | KKC Tools”):** Discount Calculator – Percent Off & Sale Price
- **H1:** Discount Calculator: Sale Price After a Percent Off
- **Meta description (152 chars):** Free discount calculator. Enter a price and percent off to get the sale price and savings, stack two discounts, or find the percent off from two prices.
- **Primary keyword:** `discount computation` — US 14,800 · KD 6 · CPC $0.94 · ad comp 1.00
- **Export seed:** #2 product markup (related)
- **Cluster:** 51 keywords · 102,960 US searches · 31,060 on KD ≤ 15
- **SERP (Semrush, 2026-11-16):** 🟡 possible — Avg AS 62. Calculator.net 90, Omni 84, percentagecalculator.net 67, docelf 35, CalculatorSoup 80, #6 dothecalculation.com AS 11, GIGAcalculator 66, Pearson 77, Zoho 81, Enerpize 36. **Verdict:** Giants hold the top 3, but AS 11–36 sites sit at #4, #6 and #10. Realistic target: positions 6–10 after a few links. 14.8K volume.

**Why this tool:** The exports are full of “30 off 50”-style searches (about 60,000 combined). People type a sum, not a tool name, so one page with a big example table can collect them.

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`discount computation`** | **Primary** | 14,800 | 6 | $0.94 | 1.00 | Info | ⚠ irregular | ⚠ irregular trend + odd phrasing; treat volume as unreliable |
| `discount on calculator` | Secondary – easy (KD ≤15) | 1,900 | 10 | $0.00 | 0.33 | Info | ⚠ irregular |  |
| `calculator percent off` | Secondary – easy (KD ≤15) | 590 | 1 | $0.00 | 0.33 | Info/Trans | ↑ rising |  |
| `how to do percentages off` | Secondary – medium (KD 16–24) | 1,900 | 24 | $0.43 | 0.33 | Info | ⚠ declining | FAQ / H2 |
| `off percent calculator` | Support – H2/FAQ (KD 25–30) | 6,600 | 28 | $0.00 | 0.33 | Info | ⚠ irregular |  |
| `how do you do percentages off` | Support – H2/FAQ (KD 25–30) | 4,400 | 26 | $0.43 | 0.33 | Info |  | FAQ / H2 |
| `how do you find percent off` | Support – H2/FAQ (KD 25–30) | 4,400 | 25 | $0.43 | 0.33 | Info |  | FAQ / H2 |
| `how to take percentage off` | Support – H2/FAQ (KD 25–30) | 2,400 | 25 | $0.43 | 0.33 | Info |  | FAQ / H2 |
| “X% off $Y” queries (43 phrases) | Long tail – one H2 + examples | 65,970 | 7–29 | — | — | Info | | Answer with a worked-example table (10–75% off common prices). e.g. `30 off of 50$`, `20$ with 30 off`, `60 off 25.00`, `30$ 30 off`, `70$ 40 off`, `70$ with 40 off` |

**Tool must include:**
- Price + % off → sale price and savings; two stacked discounts (20% + 10% ≠ 30%)
- Original + sale price → % off; sale price + % → original price
- Sales tax after discount (user rate)
- Example table generated by the engine (no thin pages per number)

**Note:** **Tier 2 because the real head terms are missing**: `discount calculator` and `percent off calculator` are not in these exports (likely KD > 30). Pull them before you build. Do **not** create one page per “X off Y” query: that is thin, doorway-style content.

### 13. Profit Margin Calculator (Gross / Operating / Net)

- **URL:** `/profit-margin-calculator/`
- **SEO title (49 chars, 61 with “ | KKC Tools”):** Profit Margin Calculator – Gross, Net & Operating
- **H1:** Profit Margin Calculator: Gross, Operating & Net Margin
- **Meta description (152 chars):** Free profit margin calculator. Enter revenue and costs to get gross, operating and net profit margin, or find the price you need to hit a target margin.
- **Primary keyword:** `gross margin calculator` — US 8,100 · KD 8 · CPC $1.65 · ad comp 0.02
- **Export seed:** #2 product markup (related)
- **Cluster:** 19 keywords · 62,640 US searches · 31,540 on KD ≤ 15
- **SERP (Semrush, 2026-11-16):** 🟡 hard — Avg AS 69. Top 7: Omni 84, CalculatorSoup 80, Xero 72, Calculator.net 90, Canva 100, Mercury 51, Investopedia 91. Weak: retaildogma 38 (#8), margincalculator.cc 22 (#10). **Verdict:** Only #8 and #10 are weak, so the realistic target is the bottom of page 1. Keep only because it shares the Markup engine (cheap to add); also target `gross profit margin calculator` (5.4K, KD 16).

**Why this tool:** The easiest real business-math cluster: the head `gross margin calculator` is **8,100 at KD 8**, and most of the cluster is KD ≤ 15. Low CPC, but very high intent to use a tool.

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`gross margin calculator`** | **Primary** | 8,100 | 8 | $1.65 | 0.02 | Comm |  |  |
| `gross profit margin formula` | Secondary – easy (KD ≤15) | 8,100 | 9 | $1.03 | 0.02 | Info |  | FAQ / H2 |
| `calculate profit margin` | Secondary – easy (KD ≤15) | 4,400 | 11 | $3.00 | 0.05 | Info |  |  |
| `net profit margin formula` | Secondary – easy (KD ≤15) | 3,600 | 11 | $1.87 | 0.03 | Info | ⚠ declining | FAQ / H2 |
| `gp profit` | Secondary – easy (KD ≤15) | 2,400 | 8 | $0.25 | 0.01 | Info | ⚠ irregular | 🌍 UK phrasing |
| `how to calculate net profit margin` | Secondary – easy (KD ≤15) | 1,900 | 11 | $4.53 | 0.06 | Info |  | FAQ / H2 |
| `gross margin calculation` | Secondary – easy (KD ≤15) | 1,600 | 9 | $1.65 | 0.02 | Info | ⚠ declining |  |
| `formula for profit margin` | Secondary – easy (KD ≤15) | 720 | 14 | $3.70 | 0.06 | Info |  | FAQ / H2 |
| `net profit margin equation` | Secondary – easy (KD ≤15) | 720 | 12 | $1.87 | 0.03 | Info |  | FAQ / H2 |
| `gross profit margin calculator` | Secondary – medium (KD 16–24) | 5,400 | 16 | $0.00 | 0.14 | Info | ⚠ declining |  |
| `how to work out a gp` | Secondary – medium (KD 16–24) | 3,600 | 17 | $1.31 | 0.02 | Info | ⚠ declining | 🌍 UK phrasing (“GP”) |
| `how do you determine gross margin` | Secondary – medium (KD 16–24) | 3,600 | 20 | $0.66 | 0.05 | Info |  | FAQ / H2 |
| `what is a good profit margin` | Secondary – medium (KD 16–24) | 3,600 | 20 | $1.31 | 0.04 | Info |  | FAQ — cite a real dataset (e.g. NYU Stern margins by sector); never invent averages |
| `how to calculate profit` | Secondary – medium (KD 16–24) | 2,900 | 21 | $3.20 | 0.04 | Info |  | FAQ / H2 |
| `gross sales` | Secondary – medium (KD 16–24) | 2,900 | 19 | $0.00 | 0.00 | Trans |  |  |
| `net sales formula` | Secondary – medium (KD 16–24) | 1,900 | 22 | $0.00 | 0.01 | Trans | ⚠ declining | FAQ / H2 |
| `operating profit margin formula` | Support – H2/FAQ (KD 25–30) | 2,900 | 29 | $3.29 | 0.01 | Info |  | FAQ / H2 |
| `gross sales vs net sales` | Support – H2/FAQ (KD 25–30) | 2,400 | 29 | $0.11 | 0.06 | — |  | FAQ / H2 |
| `profit margins` | Support – H2/FAQ (KD 25–30) | 1,900 | 27 | $3.24 | 0.03 | Info |  |  |

**Tool must include:**
- Revenue + COGS → gross profit and gross margin %; add operating costs → operating margin; add interest and tax → net margin
- Target mode: cost + target margin → required price (and the matching markup)
- Per-unit or totals; several products with a blended margin
- Gross vs net sales (returns, discounts, allowances) as an optional input

**Note:** Several rows are flagged declining. Volumes are still large, but expect less than the sum.

### 14. Equipment & Business Loan Calculator

- **URL:** `/equipment-loan-calculator/`
- **SEO title (50 chars, 62 with “ | KKC Tools”):** Equipment Loan Calculator – Business Loan Payments
- **H1:** Equipment Loan Calculator: Payments for Equipment and Business Loans
- **Meta description (157 chars):** Free equipment loan calculator. Get monthly payments, total interest and an amortization schedule for equipment, farm and business loans, or compare leasing.
- **Primary keyword:** `equipment loan calculator` — US 1,900 · KD 6 · CPC $1.98 · ad comp 0.35
- **Export seed:** #4 commercial lease (related)
- **Cluster:** 13 keywords · 20,910 US searches · 7,910 on KD ≤ 15
- **SERP (Semrush, 2026-11-16):** 🟡 possible — Avg AS 43. FCS America 43, GenEquip 25, AgDirect calculator index 35, Cat 61, Citizens Bank 65, Lendio 47, SoFi 73, Oakmont 25, AgCountry 33, gocurrency generic loan tool. **Verdict:** Relevance check: 3 strong relevant tools (Cat, Citizens, SoFi); 4 relevant tools are AS 25–43 and 2 results are an index page and a generic loan tool: 6 open slots. Shares the loan-payment engine with Commercial Mortgage.

**Why this tool:** About **17,000 searches**. The construction-equipment angle matches the site’s existing audience, and MCA factor-rate → APR is a real gap.

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`equipment loan calculator`** | **Primary** | 1,900 | 6 | $1.98 | 0.35 | — |  |  |
| `farm loan calculator` | Secondary – easy (KD ≤15) | 2,400 | 0 | $1.92 | 0.22 | Info |  |  |
| `finance lease vs operating lease` | Secondary – easy (KD ≤15) | 1,300 | 14 | $1.46 | 0.02 | Comm |  | FAQ (accounting view) |
| `dental loan calculator` | Secondary – easy (KD ≤15) | 1,000 | 2 | $2.66 | 0.18 | Comm | ⚠ declining |  |
| `business loan payment calculator` | Secondary – easy (KD ≤15) | 720 | 3 | $2.70 | 0.40 | Comm | ↑ rising |  |
| `business line of credit calculator` | Secondary – easy (KD ≤15) | 590 | 14 | $6.60 | 0.45 | Info |  |  |
| `finance vs lease` | Secondary – medium (KD 16–24) | 2,400 | 17 | $0.45 | 0.09 | Comm | ↑ rising | lease-vs-buy mode |
| `difference between lease and finance` | Secondary – medium (KD 16–24) | 2,400 | 23 | $0.98 | 0.03 | Comm |  | same mode / H2 |
| `heavy equipment financing` | Secondary – medium (KD 16–24) | 1,600 | 16 | $14.36 | 0.36 | Comm |  | H2 |
| `mca calculator` | Secondary – medium (KD 16–24) | 1,600 | 24 | $0.00 | 0.33 | Info | ⚠ declining | merchant cash advance mode: factor rate → APR |
| `operating lease vs finance lease` | Secondary – medium (KD 16–24) | 1,300 | 23 | $3.10 | 0.03 | Comm |  | FAQ |
| `farm equipment financing` | Support – H2/FAQ (KD 25–30) | 2,400 | 25 | $7.12 | 0.04 | Info |  | H2 |
| `construction equipment financing` | Support – H2/FAQ (KD 25–30) | 1,300 | 26 | $18.51 | 0.33 | Info |  | H2 — fits our construction audience |

**Tool must include:**
- Amount, rate, term, down payment, balloon → payment + schedule
- Lease vs buy: lease payment + residual vs loan + resale
- MCA mode: advance, factor rate, daily/weekly remittance → effective APR
- Line of credit: draw, rate → interest-only and repayment payment

**Note:** Merge with Commercial Mortgage (#10) only if the SERP shows the same sites ranking for both.

### 15. Invoice Generator (Hourly & Freelance)

- **URL:** `/invoice-generator/`
- **SEO title (52 chars, 64 with “ | KKC Tools”):** Free Invoice Generator – Hourly & Freelance Invoices
- **H1:** Invoice Generator: Make an Hourly or Freelance Invoice
- **Meta description (150 chars):** Free invoice generator. Add hours, rates, items, tax and discounts, then print or save a clean PDF invoice. Nothing you type ever leaves your browser.
- **Primary keyword:** `hourly invoice template` — US 1,600 · KD 26 · CPC $4.28 · ad comp 0.95
- **Export seed:** #1 freelance hourly rate (related)
- **Cluster:** 16 keywords · 3,540 US searches · 960 on KD ≤ 15
- **SERP (Semrush, 2026-11-16):** 🟡 possible — Avg AS 56. Invoice Simple 48, eForms 62, Portant 38, QuickBooks freelance template 86, Vertex42 hours-and-rate 62, Adobe Express general templates 100, InvoiceMaker 29, Harvest glossary 54, FreshBooks 52, InvoiceQuick general 31. **Verdict:** Relevance check: QuickBooks (freelance, not hourly), Adobe (general templates), Harvest (glossary) and InvoiceQuick (general) only partly match: with Portant 38 and InvoiceMaker 29 that is 6 open slots, against 2 strong relevant pages (eForms, Vertex42). Searchers expect a downloadable / printable template, so the page must offer print-to-PDF and CSV like our live estimate template.

**Why this tool:** The volume is modest (**about 3,700**), but ad competition is **0.9–1.0** with CPC $4–17: very high commercial value. It is a sibling of the live Construction Estimate Template (same print-to-PDF pattern).

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`hourly invoice template`** | **Primary** | 1,600 | 26 | $4.28 | 0.95 | Info | ↑ rising |  |
| `invoice sample freelance` | Secondary – easy (KD ≤15) | 170 | 4 | $6.76 | 0.92 | Info | ⚠ irregular |  |
| `time tracking for freelancer` | Secondary – easy (KD ≤15) | 140 | 11 | $10.44 | 0.30 | Comm | ↑ rising | ⚠ wants an app — FAQ only |
| `contractor timesheet` | Secondary – easy (KD ≤15) | 90 | 9 | $13.74 | 0.85 | Info |  | timesheet mode → feeds invoice lines |
| `hourly invoice` | Secondary – easy (KD ≤15) | 70 | 11 | $4.94 | 0.57 | Info |  |  |
| `invoice for freelance` | Secondary – easy (KD ≤15) | 70 | 9 | $12.41 | 0.48 | Info |  |  |
| `contractor time sheet` | Secondary – easy (KD ≤15) | 70 | 13 | $7.75 | 0.95 | Info | ⚠ declining |  |
| `contractor timesheet template` | Secondary – easy (KD ≤15) | 70 | 10 | $5.44 | 0.95 | Info |  |  |
| `hourly rate invoice template` | Secondary – easy (KD ≤15) | 50 | 9 | $4.82 | 1.00 | Info | ⚠ declining |  |
| `independent contractor invoice form` | Secondary – easy (KD ≤15) | 50 | 12 | $4.69 | 0.97 | Info |  |  |
| `freelance journalist invoice` | Secondary – easy (KD ≤15) | 50 | 5 | $4.28 | 0.23 | Info | ↑ rising |  |
| `freelance timesheet` | Secondary – easy (KD ≤15) | 50 | 14 | $6.68 | 0.21 | Comm | ⚠ declining |  |
| `freelance translation invoice template` | Secondary – easy (KD ≤15) | 40 | 7 | $0.00 | 0.50 | Info | ↑ rising |  |
| `freelancer tracking` | Secondary – easy (KD ≤15) | 40 | 14 | $16.55 | 0.39 | Comm |  | ⚠ software intent |
| `time tracking and invoicing for freelancers` | Secondary – medium (KD 16–24) | 590 | 20 | $11.48 | 0.35 | Info | ⚠ declining | ⚠ software intent — FAQ only |
| `freelance writer invoice template` | Support – H2/FAQ (KD 25–30) | 390 | 28 | $6.76 | 0.92 | Info |  |  |

**Tool must include:**
- From / to blocks, invoice number and date, due date, line items (hours × rate or qty × price), discount, tax %, notes / terms
- Timesheet entry that rolls up into hourly lines
- Print / Save as PDF via the browser (no libraries), local draft saved in the browser only
- Templates: freelance, contractor, translation

**Note:** Zero network is a selling point (“your client data never leaves your browser”). Reuse the Construction Estimate Template code.

## Tier 3 — weak domains but YMYL

### 16. Retirement Drawdown – “How Long Will My Money Last?” Calculator

- **URL:** `/how-long-will-my-money-last/`
- **SEO title (50 chars, 62 with “ | KKC Tools”):** How Long Will My Money Last? Retirement Calculator
- **H1:** How Long Will My Money Last Calculator
- **Meta description (151 chars):** Free calculator: enter savings, yearly withdrawals, return and inflation to see how many years your money will last, with a year-by-year balance table.
- **Primary keyword:** `how long will my money last` — US 12,100 · KD 0 · CPC $1.20 · ad comp 0.09
- **Export seed:** #4 (related)
- **Cluster:** 15 keywords · 46,090 US searches · 24,190 on KD ≤ 15
- **SERP (Semrush, 2026-11-16):** 🟡 YMYL — Avg AS 43. No giants: CalcXML 39, Mutual of Omaha 55, credit unions and banks AS 30–63 (UMCU, SYB, Pittsford FCU, TowneBank, Fidelity Bank, Regions, Sentry, USAA EF). **Verdict:** Weak domains but every result is a bank or insurer (trust signal) and the topic is retirement (YMYL). KD 0, 12.1K + 6.6K calculator variant. Build only with cited assumptions and a reviewer.

**Why this tool:** **12,100 + 6,600 searches at KD 0**, about 46,000 in all, one formula (annuity drawdown with inflation).

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`how long will my money last`** | **Primary** | 12,100 | 0 | $1.20 | 0.09 | Info |  | FAQ / H2 |
| `how long will my money last calculator` | Secondary – easy (KD ≤15) | 6,600 | 0 | $1.20 | 0.09 | Info |  | FAQ / H2 |
| `how long will my savings last calculator` | Secondary – easy (KD ≤15) | 3,600 | 1 | $0.00 | 0.33 | Info | ⚠ declining | FAQ / H2 |
| `how long will money last in retirement` | Secondary – easy (KD ≤15) | 1,300 | 14 | $1.18 | 0.17 | Info |  | FAQ / H2 |
| `4 percent rule calculator` | Secondary – easy (KD ≤15) | 590 | 0 | $1.34 | 0.05 | Info |  | mode: safe withdrawal at 4% (cite Bengen 1994 / Trinity study) |
| `how long will my retirement savings last` | Secondary – medium (KD 16–24) | 4,400 | 20 | $1.36 | 0.21 | Info |  | FAQ / H2 |
| `how long will my retirement savings last calculator` | Secondary – medium (KD 16–24) | 2,400 | 18 | $1.36 | 0.21 | Info |  | FAQ / H2 |
| `how long will retirement savings last calculator` | Secondary – medium (KD 16–24) | 2,400 | 22 | $1.36 | 0.21 | Info | ↑ rising | FAQ / H2 |
| `how long will money last` | Secondary – medium (KD 16–24) | 1,300 | 24 | $1.10 | 0.07 | Info |  | FAQ / H2 |
| `how long will retirement savings last` | Secondary – medium (KD 16–24) | 1,300 | 19 | $1.18 | 0.17 | Info |  | FAQ / H2 |
| `how long will money last calculator` | Support – H2/FAQ (KD 25–30) | 2,900 | 29 | $1.20 | 0.09 | Info |  | FAQ / H2 |
| `how long will my savings last` | Support – H2/FAQ (KD 25–30) | 2,400 | 27 | $1.20 | 0.09 | Info | ↑ rising | FAQ / H2 |
| `how long money last` | Support – H2/FAQ (KD 25–30) | 1,600 | 25 | $1.10 | 0.07 | Info |  | FAQ / H2 |
| `how long will my money last in retirement calculator` | Support – H2/FAQ (KD 25–30) | 1,600 | 25 | $1.18 | 0.17 | Info |  | FAQ / H2 |
| `investment calculator with withdrawals` | Support – H2/FAQ (KD 25–30) | 1,600 | 27 | $1.33 | 0.09 | Comm |  |  |

**Tool must include:**
- Balance, withdrawal (monthly / yearly), return %, inflation %, withdrawals rise with inflation → years until zero
- Reverse: withdrawal that lasts N years
- Year-by-year table + chart (CSS / SVG, no libraries)

**Note:** **YMYL (retirement money).** Google wants expert sources here: cite the formula, show assumptions, add a clear “not financial advice” note. Expect Schwab / Vanguard / Bankrate in the SERP. Tier 2 only because of YMYL; keyword data alone says Tier 1.

### 17. SBA Loan Calculator (7(a) & 504)

- **URL:** `/sba-loan-calculator/`
- **SEO title (48 chars, 60 with “ | KKC Tools”):** SBA Loan Calculator – 7(a) and 504 Loan Payments
- **H1:** SBA Loan Calculator: 7(a) and 504 Payments, Fees and Down Payment
- **Meta description (146 chars):** Free SBA loan calculator for 7(a) and 504 loans. See the monthly payment, the 504 bank / CDC / equity split, the guarantee fee and total interest.
- **Primary keyword:** `sba 504 loan` — US 4,400 · KD 5 · CPC $7.65 · ad comp 0.51
- **Export seed:** #4 commercial lease (related)
- **Cluster:** 9 keywords · 15,860 US searches · 12,160 on KD ≤ 15
- **SERP (Semrush, 2026-11-16):** 🟡 YMYL — Avg AS 57. sba.gov 69 (×2), Wells Fargo 80, Wikipedia 100, Investopedia 91, then Texas First Bank 35, Live Oak 43, AMPAC 26, evergreen504 calculator 29 (#7), NADCO 32. **Verdict:** Relevance check: 5 relevant pages are AS 26–43 and a small calculator (evergreen504, AS 29) already ranks #7, so a guide + calculator page can reach positions 4–10. YMYL and rates change, so build only with dated rates and a reviewer.

**Why this tool:** About **15,000 searches, mostly KD 3–11**, and nobody has a simple calculator that shows the 504 split (bank / CDC / borrower) next to a 7(a) payment.

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`sba 504 loan`** | **Primary** | 4,400 | 5 | $7.65 | 0.51 | Info |  |  |
| `sba 504 loans` | Secondary – easy (KD ≤15) | 2,400 | 7 | $7.65 | 0.51 | Info |  |  |
| `7a sba loan` | Secondary – easy (KD ≤15) | 1,300 | 3 | $6.34 | 0.60 | Info |  |  |
| `sba certified lender` | Secondary – easy (KD ≤15) | 1,300 | 7 | $12.29 | 0.10 | Info | ⚠ declining | ⚠ service/lender search — FAQ only |
| `sba loan 7a` | Secondary – easy (KD ≤15) | 1,000 | 11 | $7.89 | 0.26 | Info |  |  |
| `7 a loans` | Secondary – easy (KD ≤15) | 880 | 6 | $7.16 | 0.58 | Info | ⚠ declining |  |
| `sba 504 financing` | Secondary – easy (KD ≤15) | 880 | 6 | $7.65 | 0.51 | Info |  |  |
| `what is a sba loan` | Secondary – medium (KD 16–24) | 2,400 | 17 | $3.38 | 0.32 | Info | ↑ rising | FAQ / H2 |
| `sba 504 rates` | Support – H2/FAQ (KD 25–30) | 1,300 | 29 | $4.70 | 0.31 | Info |  | ⚠ rates change monthly — user input only |

**Tool must include:**
- 7(a): amount, rate, term (10 / 25 yr) → payment; guarantee fee input
- 504: project cost → bank (≈50%) / CDC (≈40%) / equity (≈10%) split, each with its own rate and term
- Compare 7(a) vs 504 for the same project

**Note:** SBA fee tables and splits must be cited from SBA.gov with a date. `TODO(owner)`: confirm the current fiscal-year fees before publishing. Informational intent is high, so the article matters as much as the tool.

### 18. Self-Employment (1099) Tax Calculator

- **URL:** `/self-employment-tax-calculator/`
- **SEO title (41 chars, 53 with “ | KKC Tools”):** 1099 Tax Calculator – Self-Employment Tax
- **H1:** 1099 Tax Calculator: Self-Employment Tax and Quarterly Estimates
- **Meta description (148 chars):** Free 1099 tax calculator. Estimate self-employment tax (Social Security + Medicare), the deduction for half of it, and quarterly estimated payments.
- **Primary keyword:** `1099 tax calculator` — US 9,900 · KD 6 · CPC $0.70 · ad comp 0.11
- **Export seed:** #3 (related)
- **Cluster:** 7 keywords · 27,600 US searches · 23,200 on KD ≤ 15
- **SERP (Semrush, 2026-11-16):** 🟡 YMYL — Avg AS 51. IRS withholding estimator 92 (not a 1099 tool), ADP 81, Everlance 40, Keeper 40, Nationwide 68, Liberty Tax blog 49, Jackson Hewitt 57, Pilot 40, usetabby 25, sequifi 27. **Verdict:** Relevance check: the SERP itself is beatable (the IRS page is a W-4 withholding tool, Liberty Tax is an article, 5 relevant calculators are AS 25–40). It sits in Tier 3 only because tax rates change every year and it is YMYL: build only if the owner commits to yearly updates.

**Why this tool:** `1099 tax calculator` is **9,900 at KD 6**; the cluster is about 30,000. It pairs with Freelance Rate (#8).

| Keyword | Role | US Vol | KD | CPC | Ad comp | Intent | Trend | Note |
|---|---|---:|---:|---:|---:|:---:|:---:|---|
| **`1099 tax calculator`** | **Primary** | 9,900 | 6 | $0.70 | 0.11 | Info |  |  |
| `estimate taxes` | Secondary – easy (KD ≤15) | 5,400 | 12 | $1.45 | 0.01 | Info |  |  |
| `estimated tax dates` | Secondary – easy (KD ≤15) | 2,900 | 2 | $0.22 | 0.04 | Info | ↑ rising | FAQ: quarterly due dates (from IRS, dated) |
| `1099 tax estimator` | Secondary – easy (KD ≤15) | 2,400 | 0 | $0.70 | 0.11 | Info |  |  |
| `self employed taxes calculator` | Secondary – easy (KD ≤15) | 1,300 | 5 | $1.58 | 0.12 | Info | ↑ rising |  |
| `estimate my taxes` | Secondary – easy (KD ≤15) | 1,300 | 1 | $1.52 | 0.12 | Info | ⚠ declining |  |
| `estimated taxes` | Secondary – medium (KD 16–24) | 4,400 | 24 | $1.45 | 0.01 | Info |  |  |

**Tool must include:**
- Net self-employment income → SE tax (15.3% on 92.35%, SS wage-base cap), half-SE deduction
- Optional federal income tax using the current brackets (needs a yearly update)
- Quarterly estimated payment plan

**Note:** **Needs a yearly update** (SS wage base, brackets) and is YMYL tax content. Build only if the owner commits to an annual review (`TODO(owner)`).

---

---

---

## 2b. Removed after the SERP check (strong top 10)

Each of these was checked on a real Semrush SERP with the relevance-first test (Percentage Change, Investment Return and the seven Semrush rows below). Their top 10 is held by strong, on-topic pages with few open slots, so a DA 1 site has little chance even with some links. Their keywords are no longer planned; revisit only after the site has authority.

| Tool (old #) | Primary keyword | US Vol | KD | Who holds the top 10 | Why removed |
|---|---|---:|---:|---|---|
| Investment Return Calculator (S&P 500, T-Bills, Money Market) (Semrush check) | `s and p 500 calculator` | 4,400 | 17 | KD 62, avg AS 58. Calculator.net 90, investor.gov 70, NerdWallet 80, iShares 61, Ameriprise 52, Fidelity, Ramsey 64, banks. | Relevance check: all 10 are relevant calculators and 5 of them are AS 61–90; only 2 weak relevant pages. KD 62 and YMYL. (`s and p 500 calculator` was not exported; revisit only with its own SERP.) |
| Percentage Change Calculator (Increase / Decrease / Difference) (#1) | `percentage increase calculator` | 74,000 | 2 | Semrush SERP: CalculatorSoup (AS 80), Omni (84), Britannica (100), Canva (100), percentageincreasecalculator.app (31), percentagecalculator.net (67), YouTube ×2, Pearson (77), Calculator.net (90). AI Overview. | 9 of 10 results are AS 67–100 and exactly on topic; only one weak slot. KD 2 is misleading. Keep the long tail (Excel / “how to calculate”) as a later idea. |
| Hourly to Salary (Wage) Calculator (#4) | `wage calculator` (Semrush) | 18,100 | 15 | ADP 81 (×2), Calculator.net 90, SmartAsset 67, PaycheckCity 50, SurePayroll 45, Gusto 60, esmartpaycheck 30, Ordio 41, YouTube. | Google reads this as a take-home paycheck query: 5 strong relevant tools, only 3 open slots (YouTube + 2 weak), and it needs federal and state tax tables every year. |
| Card Processing Fee Calculator (Square / PayPal) (#17) | `square reader fees` (Semrush) | 2,400 | 12 | Square 76 (×4 URLs), NerdWallet 80, Reddit, Jotform 75, Bluevine 47, SwipeSum 35, ebayfeescalculator 41. | Square’s own pages hold four slots and the fees change often: only 3 open slots (Reddit + 2 weak). |
| Net Worth Calculator (#19) | `net worth calculator` (Semrush) | 14,800 | 51 | Ramsey 64, NerdWallet 80, Paducah Bank 30, Ameriprise 52, KEMBA 42, AARP 80, SEBI 67, Empower 59, a percentile tool 27, an unrelated diabetes calculator. | KD 51, 4 strong relevant tools; only 4 open slots (one off-topic, one different tool, two weak). |
| Compound Interest Calculator (#21) | `compound calculator` (Semrush) | 18,100 | 7 | investor.gov 70, NerdWallet 80, MCNB 42, Lake City Bank 40, Bankrate 78, Landmark CU 45, MoneyChimp 47, MDM 45, TheCalculatorSite 78, an off-topic Treasury page. | 4 strong relevant tools and only 3 open slots. |
| HELOC & Home Equity Calculator (#23) | `heloc calculator` (Semrush) | 40,500 | 10 | Bank of America 85, Calculator.net 90, myfsbonline 38, Bankrate 78, Chase 85, Truist article 68, UNFCU 44, U.S. Bank 76, Flagstar 52 (×2). | 5 strong relevant tools from big banks and publishers; 4 open slots; YMYL. |
| Credit Card Payoff & APR Calculator (#24) | `credit card apr calculator` (Semrush) | 3,600 | 8 | Discover 71, NerdWallet 80, Calculator.net 90, Bankrate 78, mycentral 35, Ameriprise 52, Chase 85, SoFi 73, Lloyds 70, Credit Karma 68. | Card issuers and big publishers hold 9 of 10 slots with interest or payoff calculators; YMYL. |
| Present Value / NPV Calculator (#26) | `present value calculator` (Semrush) | 8,100 | 50 | Calculator.net 90, Stanford 84, MoneyChimp 47, Investopedia 91, SEBI 67, fncalculator 38, Fiserv 49, Omni 84, Financial Mentor 39, CalculatorSoup 80. | KD 50, 5 strong relevant tools, only 3 open slots. |

---

## 3. On hold — big volume, wrong fit for a DA 1 site now

| Group | Keywords | US vol | Top examples (US vol / KD) | Why on hold |
|---|---:|---:|---|---|
| State paycheck & salary calculators | 125 | 626,140 | `texas paycheck calculator` 40,500/24, `salary calculator arkansas` 33,100/20, `florida paycheck calculator` 22,200/19, `pay stub calculator ny` 22,200/29, `illinois paycheck calculator` 18,100/20 | Biggest volume in the batch, but it needs federal + 50 state tax tables updated every year, is YMYL, and SmartAsset / ADP / PaycheckCity own every SERP. Revisit only with an owner commitment to annual tax-table updates. |
| Federal & state income tax / brackets / IRS | 55 | 326,910 | `federal income tax` 27,100/15, `tax calculator tax calculator tax calculator` 27,100/23, `tax estimator 2025` 18,100/4, `irs fresh start program` 18,100/29, `us tax brackets` 14,800/15 | YMYL tax content with yearly changes; IRS, TurboTax, NerdWallet and H&R Block dominate. Sales-tax-by-city queries need local rate tables. |
| Retirement plan calculators (401k / 403b / 457 / TSP / pension / IRA) | 27 | 82,480 | `tsp calculator` 8,100/22, `bankrate 401k calculator` 8,100/28, `pension calculator` 6,600/7, `share incentive plan calculator` 6,600/10, `federal retirement calculator` 4,400/20 | Plan-specific rules and contribution limits change yearly; YMYL; Vanguard, Fidelity and Bankrate brand searches mixed in. |
| Mortgage / refinance / amortization (consumer) | 7 | 18,800 | `refi calculator` 5,400/9, `loan refinance calculator` 3,600/7, `amortization schedule excel` 2,400/23, `amortization table excel` 2,400/27, `home loan refinance rates calculator` 2,400/28 | Consumer mortgage SERPs are owned by Bankrate, NerdWallet, Zillow and lenders. The commercial version (old Tool #8) was also removed after the SERP check. |

---

## 4. Keywords for live pages (add to the page — no new URL)

### Stud Framing Calculator — `/stud-calculator/`

| Keyword | US Vol | KD | CPC | Trend |
|---|---:|---:|---:|:---:|
| `stud calculator` | 3,600 | 13 | $2.99 |  |
| `wall stud calculator` | 2,400 | 12 | $2.99 |  |
| `framing calculator` | 2,400 | 11 | $2.04 |  |

**Action:** Add “framing calculator” and “wall stud calculator” wording to H2s/FAQ; these are KD 11–13 and the page already does this.

### Square Footage Calculator — `/square-footage-calculator/`

| Keyword | US Vol | KD | CPC | Trend |
|---|---:|---:|---:|:---:|
| `square feet cost` | 1,600 | 15 | $1.39 | ↑ rising |
| `per sq ft` | 590 | 9 | $0.00 | ↑ rising |

**Action:** Add a “cost per square foot” mode (total price ÷ area, and price per sq ft × area).

### Construction Estimate Template — `/construction-estimate-template/`

| Keyword | US Vol | KD | CPC | Trend |
|---|---:|---:|---:|:---:|
| `how to calculate building materials for a site` | 3,600 | 24 | $0.00 |  |
| `house addition calculator` | 1,300 | 11 | $2.47 | ↑ rising |

**Action:** H2 on taking off materials for a site; FAQ pointing to the material calculators. “House addition calculator” wants a cost — only an FAQ until a cost tool exists.

### Linear Foot Calculator — `/linear-foot-calculator/`

| Keyword | US Vol | KD | CPC | Trend |
|---|---:|---:|---:|:---:|
| `length conversion calculator` | 1,900 | 12 | $0.00 | ↑ rising |

**Action:** Add a unit-conversion strip (ft / in / m / cm / yd) to the result.

**Totals (live pages):** 8 keywords · 17,390 combined US volume.

### Other non-business tool ideas spotted in the exports

Not business tools, but they turned up with low KD. Keep them for a future “maths & everyday” batch.

| Keyword | US Vol | KD | Trend | Note |
|---|---:|---:|:---:|---|
| `proportion calculator` | 1,220,000 | 26 | ⚠ irregular | ⚠ 1.22M with 6 zero months — Semrush data error |
| `average computation` | 22,200 | 3 | ⚠ irregular | ⚠ irregular — unreliable |
| `percent error calculator` | 5,400 | 11 | ⚠ irregular | science; Percentage Change tool removed after the SERP check (strong top 10) |
| `proportions calculator` | 5,400 | 24 | ↑ rising | maths |
| `iqr calculator` | 2,400 | 0 |  | stats tool, KD 0 — good low-effort page if you add a maths section |
| `golden ratio calculator` | 2,400 | 21 |  | design/maths |
| `court date calculator` | 2,400 | 19 |  | ⚠ legal deadlines vary by court — liability risk, skip |
| `court calendar calculator` | 2,400 | 20 |  | same — skip |
| `cv calculator` | 1,900 | 17 |  | ⚠ ambiguous (coefficient of variation vs résumé) |
| `legal deadline calculator` | 1,600 | 21 |  | same — skip |
| `ideal gas calculator` | 1,300 | 9 |  | chemistry |
| `work out average calculator` | 1,000 | 0 |  | maths |
| `chatham rate cap calculator` | 1,000 | 4 |  | brand + interest-rate-cap derivative — skip |
| `deadline calculator legal` | 1,000 | 12 |  | same — skip |
| `nj motion calendar` | 1,000 | 12 |  | same — skip |
| `se calculator` | 720 | 4 | ⚠ declining | standard error (stats) |
| `wrapping paper calculator` | 720 | 11 | ⚠ declining | fun / seasonal (Dec peak) |
| `money factor to interest rate` | 720 | 9 |  | car lease maths — small tool idea |
| `calculadder` | 720 | 8 |  | brand — skip |

---

## 5. Dropped — not a tool we can build or rank

| Group | Keywords | US vol | Top examples | Why dropped |
|---|---:|---:|---|---|
| Freelance jobs, platforms & writing careers | 151 | 115,180 | `jobs with writing` 18,100, `freelance platforms` 8,100, `odesk freelance jobs` 6,600, `freelance jobs remote` 5,400 | Job-search and platform intent (Upwork, Fiverr, “writing jobs”) — searchers want listings, not a calculator. |
| Accounting, invoicing, inventory & business software | 39 | 106,330 | `bill monitoring system` 22,200, `accounting packages` 8,100, `best bookkeeping software for small business` 4,400, `cloud based accounting software for small business` 4,400 | Software-shopping intent (CPC $15–60). A free tool cannot satisfy “best accounting software”; the invoice part is covered by Tool #16. |
| Businesses for sale, brokers & directories | 108 | 361,680 | `superpages` 165,000, `superpages business listing` 40,500, `business for sale` 40,500, `biz buy sell` 22,200 | Marketplace / listing / directory intent (BizBuySell, Superpages). The valuation intent was moved to Tool #11. |
| Brand / navigational searches | 29 | 61,190 | `payday social` 6,600, `unifin debt collector text` 6,600, `nerdwallet compound interest calculator` 6,600, `nerdwallet investment calculator` 5,400 | People want that brand’s site (NerdWallet, Bankrate, Zillow, AirDNA…). |
| Landlord / tenant how-to, notices & collections | 67 | 21,520 | `how to be a landlord` 1,300, `landlord friendly states` 1,300, `late rent notice template` 1,000, `late rent notice` 880 | Services, templates with legal risk (notices to quit vary by state) or how-to articles — no calculator need. |
| Real-estate market questions (best states, is it a good investment) | 17 | 4,420 | `best state to buy a house` 590, `best place to buy rental property` 480, `best states to invest in real estate` 390, `is rental property a good investment` 390 | Opinion / market-data articles; need data we cannot verify. |
| Revenue-scoring noise (looks auto-generated, flat trends) | 12 | 20,360 | `how to score companies based on revenue ranges` 3,600, `how to score companies based on revenue` 2,900, `how to score companies by revenue ranges` 2,400, `how to score company by revenue range 5-10 million` 2,400 | Odd machine-like queries (“how to score companies by revenue bands 0-1m to 200m”) with zero CPC — likely bot or AI traffic. |
| Excel / spreadsheet functions | 3 | 5,000 | `pmt function excel` 2,400, `excel pmt function` 1,300, `pmt formula excel` 1,300 | Excel-help intent; Microsoft and Exceljet own it. Excel formulas are shown on the Percentage page instead. |
| Commercial appraisal services | 12 | 19,610 | `commercial property appraisal` 2,900, `commercial appraisal` 2,400, `commercial real estate appraisal` 2,400, `commercial building appraisal` 1,900 | People are hiring an appraiser. Covered by an FAQ on Cap Rate (#6): “an estimate, not an appraisal”. |
| Definitions with no tool (market cap, residual, ROU asset, ASC 842) | 8 | 19,520 | `market cap definition` 4,400, `ltc meaning` 4,400, `what does market cap mean` 3,600, `how to calculate residual` 1,900 | Pure definitions; no calculation the visitor needs. |
| Everything else (off-topic, misc.) | 19 | 25,550 | `nerd wallet investment calculator` 2,900, `figuring out average percentages` 2,400, `how to calculate average from percentage` 2,400, `between which two years was the greatest percentage decrease` 2,400, `how to do proportions` 1,900, `lease extension premium 61 years uk calculator example` 1,600, `list your business` 1,600, `vat calculator` 1,300 | Unrelated or no tool intent. |

**Every keyword is accounted for:** New tools kept after SERP check (Section 1–2): 371 · Removed after SERP check (Section 2b): 109 · On hold (Section 3): 214 · Live pages + other ideas (Section 4): 27 · Dropped (Section 5): 465 · **Total: 1,186 of 1,186 unique keywords.**

---

## 6. Next steps

1. **Build order (Tier 1):** Markup (14.8K) → Unit Price → Cap Rate → Rental Property / Cash-on-Cash (shares the Cap Rate NOI engine) → Labor Cost → Commercial Lease → Airbnb Profit → Freelance Rate → Contribution Margin (shares the Markup engine). Then Tier 2: Commercial Mortgage + Equipment Loan (one loan-payment engine) → Business Valuation → Discount → Profit Margin → Invoice Generator. Tier 3 (How Long Will My Money Last, SBA 504, 1099 Tax) only with dated sources, a reviewer and an owner commitment to updates.
2. **Links plan:** each Tier 1 page should get a few relevant links (tool directories, a guest post or resource-page mention in its niche: retail / ecommerce for Markup and Unit Price, real estate for Cap Rate, Commercial Lease and Airbnb, construction for Labor Cost, freelancing for Freelance Rate). Tier 2 pages need more links because giants hold the top 3.
3. **Beat the weak pages on substance:** every weak competitor is a thin single-purpose tool. Win with a better calculator, a worked example, a formula section and FAQ answers taken from the “how to calculate …” questions (KD 16–47).
4. **Pull the variants before building:** `gross profit margin calculator`, `price per unit calculator`, `sba 504 loan calculator` (only if the program page idea returns), `s and p 500 calculator`.
5. **All 27 primaries now have a decision:** the 12 tools first removed on web-search data were re-checked on Semrush SERPs on 2026-11-16; 5 came back (Rental / Cash-on-Cash, Contribution Margin, Commercial Mortgage, Equipment Loan, Invoice Generator) and 7 stay removed (Section 2b).
6. **Never publish invented benchmarks** (average margins, cap rates, multiples, freelance rates). Use user inputs, or a cited and dated source.
