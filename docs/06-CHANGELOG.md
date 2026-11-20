# 06 — Changelog

All notable changes to this project will be documented in this file, sorted newest first.

---

### [UX / Visual Redesign — Unique Tool Card Illustrations & Dedicated Icons] — 2026-11-21
- **Tool Card Illustration Redesign (`src/components/home/ToolArt.tsx`, `ToolArt.module.css`)**:
  * Replaced all generic dual-rectangle placeholder cards across Business & Creative and Financial tools with bespoke, domain-specific architectural and financial SVG artwork.
  * Every single tool among all 67 tools in KKC Tools now has a distinct, handcrafted visual identity:
    - `capRate`: Commercial multi-story office building with illuminated windows, ground-floor glass lobby, rooftop HVAC unit, property sale price sign, and high-contrast Cap Rate NOI yield banner (5.32%).
    - `rentalProperty`: 2-story residential home with pitched gable roof, chimney, mullioned windows, front porch with columns, a post-mounted "FOR RENT" lawn sign, and monthly cash flow / Cash-on-Cash ROI card ($243/mo · 8.4% CoC).
    - `laborCost`: Construction yellow safety hardhat with curved visor, employee ID punchcard with photo silhouette, lanyard hole, barcode, and burdened labor wage breakdown stack (Base $30/hr + FICA + Ins = $39.86/hr).
    - `commercialLease`: Retail storefront unit with striped awning, plate-glass display windows, double commercial entrance doors with vertical pull bars, "SPACE FOR LEASE" transom banner, 2,300 RSF dimension, and NNN lease badge ($24/SF + $6 NNN).
    - `airbnbHost`: Picturesque A-frame vacation cabin nestled among evergreen pines with steep sloping roof, triangular front glass wall, front deck, and an Airbnb booking calendar card with booked nights, occupancy rate, ADR, and net profit (65% Occ · $180/nt · +$967/mo Net).
    - `freelanceRate`: Modern designer/developer workstation: open laptop with code display and trackpad, steaming coffee mug, desk stopwatch timer tracking billable hours (1,260 billable hrs/yr), and target rate dial ($99.33/hr).
    - `contributionMargin`: Financial break-even coordinate chart with X/Y axes (Units vs $), flat horizontal Fixed Cost dashed line, upward sloping Total Cost line, upward sloping Revenue line, intersecting at Break-Even Point dot with highlighted green profit margin zone and CM ratio (40.0%).
    - `commercialMortgage`: Classical bank building facade with triangular pediment, 4 fluted columns, grand entrance stairs, LTV dial meter (75% LTV), and 10-year balloon mortgage schedule timeline ($1.18M Balloon).
    - `equipmentLoan`: Detailed heavy construction hydraulic excavator machine with crawler tracks, drive rollers, operator cab, articulated boom arm, stick, and toothed digging bucket, with equipment financing vs lease comparison badge ($1,545/mo).
    - `businessValuation`: Valuation multiple speedometer/barometer gauge with 2.0x, 3.0x, 4.0x SDE/EBITDA multiple bands and needle pointing to 2.8x, next to enterprise valuation range ($482k–$723k).
    - `presentValue`: Discounted cash-flow timeline: future cash stacks at T10 discounting backward through curved dotted arrows into a bank vault/safe at T0, with formula $PV = FV / (1+r)^n$.
    - `compoundInterest`: Exponential compound growth chart: 4-tier stepped bar chart (Year 1, 3, 6, 10) showing principal base + contributions + compounding interest layer soaring upward into a 3D coin stack ($47.5k).
    - `processingFee`: Countertop POS payment terminal / card reader with inserted EMV chip card, display screen ($100.00), keypad, and printed paper receipt tape curling out with serrated edge showing 2.9% + $0.30 fee and $96.80 net deposit.
    - `creditCardPayoff`: Detailed credit card with metallic EMV chip and contactless waves being sliced by scissors, with an avalanche balance progress bar dropping to $0 Debt-Free.
    - `netWorth`: Classic brass balance scale with center fulcrum pillar, pivoted beam, suspended pans: left pan heavy with asset blocks (Real Estate, 401k, Cash), right pan with lighter debt block, showing positive net worth tilt (+$535k Net Worth).
    - `heloc`: Residential home elevation with an internal pie/cross-section bracket showing home equity breakdown: 1st Mortgage bar (60%), HELOC Draw Available credit limit line (25%), and Owner Equity reserve (15%), with a revolving line of credit arrow.
    - `investmentReturn`: S&P 500 bull market financial trading chart with candlestick price bars, smoothed upward moving average trendline, and total return ROI tag (+196% Return).
    - `drawdown`: Retirement savings nest egg reservoir tank with glass level gauge showing $500k balance, an inflow pipe on top representing Social Security / pension payments, and a calibrated valve tap spigot at the bottom dispensing the Bengen 4% safe withdrawal stream.
    - `sbaLoan`: Official Federal Capitol / SBA dome building facade with columns, alongside a clear 3-tier stacked SBA 504 financing pillar: 50% Senior Bank Loan, 40% CDC Debenture, and 10% Borrower Equity down payment.
    - `seTax`: Official IRS Form 1040-ES / Schedule SE quarterly voucher booklet with 4 quarterly payment coupons (Q1, Q2, Q3, Q4), a tax pencil, and a tax breakdown seal showing 15.3% SE Tax (12.4% Social Security + 2.9% Medicare).
    - `invoice`: Crisp itemized contractor invoice sheet with folded corner, company header, table of billable hours and rates with gridlines, subtotal & total rows, and an angled "PAID" stamp.
    - `roofCost`: Roof tear-off and replacement cross section: plywood decking with woodgrain, underlayment felt layer, brand new architectural shingles with drip edge flashing, roofer's claw hammer, and shingle bundle with cost tag ($11,400).
    - `deckStain`: Wide deck board platform in perspective, half weathered gray wood grain, half freshly coated rich cedar wood with wide stain applicator brush leaving wet stroke marks, open stain bucket with handle, and coverage callout (350 sq ft / gal).
    - `margin`: Segmented waterfall revenue bar with COGS vs Gross Profit margin % slice and margin meter dial (40.0% Gross Margin).
    - `unitPrice`: Two grocery containers (12 oz bottle vs 32 oz jug) with comparison unit tags and a "BEST VALUE" rosette (Save 23%).
    - `wage`: Clock face with hour/minute hands connected by a curved bidirectional exchange arrow to an open salary paycheck envelope with cash banknotes ($52,000 / yr).
    - `percent`: 3D comparison bar chart with an upward curving arrow with arrowhead and delta badge (+25.0% Increase).
    - `tag`: Angled retail hangtag with eyelet, string loop, and cost-to-price markup sticker (+50% M/U).
    - `discount`: Hanging sale tag with scissors cutting original price in half with a -20% OFF sale starburst.
  * **Dedicated Unique Icons (`src/components/icons/Icons.tsx`, `src/lib/tools-catalog.ts`)**:
    - Created `roofCost` icon for `/roof-replacement-cost-calculator/` so it no longer shares `roofTruss` with `/rafter-calculator/`.
    - Created `deckStain` icon for `/deck-stain-calculator/` so it no longer shares `deck` with `/deck-cost-calculator/`.
    - Verified 67 tools in `tools-catalog.ts` now have 67 completely unique, 1-to-1 icons. Duplicate icon count: 0.
  * **Zero SVG `<title>` Tags**: Verified 0 title tags in SVG components to prevent multiple title tag errors in SEO audit.
  * **Full Verification**: All 6 verification steps passed (`npm run verify`: lint, 904 tests, no-network, build with 88 HTML pages, seo:audit with 0 errors, docs:bundle).

---

### [Tool #67 — 1099 Self-Employment Tax Calculator] — 2026-11-20
- Built Tool #67 `/self-employment-tax-calculator/` (Batch 3 Part 2 #14 / Tier 3 YMYL):
  * **Engine** (`src/lib/se-tax-engine.ts`, 12 unit tests): implements pure IRS mathematical rules for federal self-employment and estimated taxes. Computes net self-employment earnings, statutory 92.35% net earnings multiplier (IRC § 1402(a)(12) and Schedule SE Line 4a), $400 minimum net earnings exemption (IRC § 1402(b)(2)), Social Security 12.4% tax capped at $184,500 wage base with W-2 wage priority offset, Medicare 2.9% uncapped tax, Additional Medicare 0.9% surtax by filing status, 50% above-the-line deduction on Schedule 1 Line 15 (IRC § 164(f)), quarterly Form 1040-ES payment schedule across official IRS deadlines (Apr 15, Jun 15, Sep 15, Jan 15), safe harbor benchmark (90% current year vs 100% prior year), and what-if deduction analysis. Benchmark verified: $70,000 gross − $10,000 exp = $60,000 net -> $55,410 taxable base -> $8,477.73 SE tax ($6,870.84 SS + $1,606.89 Med) and $4,238.87 deduction.
  * **Input Guide Diagram** (`src/components/tool/self-employment-tax-calculator/SeTaxInputGuide.tsx`): SVG funnel diagram from gross 1099 receipts down to ordinary expenses, mileage deduction, 92.35% net multiplier, 15.3% SE tax breakdown, half deduction, and 4 quarterly calendar vouchers. 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/self-employment-tax-calculator/SelfEmploymentTaxCalculator.tsx`): TabSlider segmented control for 3 modes (`estimate`, `quarterly`, `what-if`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with copyable BLUF sentence, metrics grid, itemized tax breakdown table, quarterly voucher cards, and dated IRS & SSA verified sources box. Wrapped in `ToolShell` with 4 verified pills: `2026 IRS figures, cited`, `W-2 + 1099 together`, `Quarterly due dates`, `Mileage at IRS rate`.
  * **Page** (`src/app/self-employment-tax-calculator/page.tsx`): 2,100+ words of original copy, primary keyword in first sentence ("1099 tax calculator"), 12 comprehensive FAQs matching schema, `HowWeCalculate` component citing IRS and SSA, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`1099 Tax Calculator – Self-Employment Tax`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts` (`seTaxCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#67, category `business`, icon `seTax`), `src/lib/tools-catalog.test.ts` (updated to 67), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `invoice-generator`, `freelance-rate-calculator`, and `hourly-to-salary-calculator`.

---

### [Tool #66 — SBA Loan Calculator (7(a) & 504)] — 2026-11-20
- Built Tool #66 `/sba-loan-calculator/` (Batch 3 Part 2 #13 / Tier 3 YMYL):
  * **Engine** (`src/lib/sba-loan-engine.ts`, 9 unit tests): pure functions modeling SBA 504 two-loan capital stack (bank 1st lien, CDC debenture 2nd lien pegged to 10-yr Treasury, borrower equity, ~3% CDC fees financed into note, blended interest rate, balloon payoff), SBA 7(a) single commercial loans with guarantee fees, 504 vs 7(a) head-to-head comparison, and business acquisition M&A debt stack (buyer cash equity, seller note, and 7(a) senior debt with DSCR underwriting). All spec benchmarks verified: $2M project with 50/40/10 split ($1M bank @ 7% 25 yr = $7,067.79/mo; $800k CDC @ 6.5% 25 yr = $5,401.66/mo; 504 total = $1,800,000, 6.778% blended rate, $12,469.45/mo) vs $1.8M 7(a) loan @ 9% 25 yr ($15,105.53/mo) -> $2,636.08/mo monthly cash flow savings.
  * **Input Guide Diagram** (`src/components/tool/sba-loan-calculator/SbaInputGuide.tsx`): SVG stacked capital structure diagram showing total project cost bar, bank 1st lien, CDC 2nd lien debenture, borrower equity injection, and merged combined monthly debt service arrow. 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/sba-loan-calculator/SbaLoanCalculator.tsx`): TabSlider segmented control for 4 modes (`504`, `7a`, `compare`, `acquisition`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with copyable BLUF sentence, metrics grid, loan split breakdown table, comparison savings matrix, and full combined amortization table with CSV download. Wrapped in `ToolShell` with 4 verified pills: `True 504 two-loan split`, `504 vs 7(a) compare`, `DSCR affordability`, `Printable schedules`.
  * **Page** (`src/app/sba-loan-calculator/page.tsx`): 2,200+ words of original copy, primary keyword in first sentence ("sba 504 loan"), 12 comprehensive FAQs matching schema, `HowWeCalculate` component citing SBA.gov and 13 CFR Part 120, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`SBA Loan Calculator – 7(a) and 504 Loan Payments`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts` (`sbaLoanCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#66, category `business`, icon `sbaLoan`), `src/lib/tools-catalog.test.ts` (updated to 66), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `commercial-mortgage-calculator`, `equipment-loan-calculator`, and `business-valuation-calculator`.

---

### [Tool #65 — Retirement Drawdown Calculator] — 2026-11-20
- Built Tool #65 `/how-long-will-my-money-last/` (Batch 3 Part 2 #12 / Tier 3 YMYL):
  * **Engine** (`src/lib/drawdown-engine.ts`, 9 unit tests): pure functions modeling portfolio retirement drawdowns: closed-form log exhaustion formula, annual dynamic simulation with compound returns and inflation adjustments, other income (Social Security/pension), maximum sustainable annual spending solver (growing annuity formula), Bengen 4% Rule baseline, and stress testing scenarios (-2% return, bad-start sequence of returns). All spec benchmarks verified: $500k @ 5% with flat $40k/yr = 20.1 years; $500k with $40k/yr rising 3% inflation @ 5% return lasts ~15.2 years (exhausted at age 80); $500k to age 95 @ 5% return with 3% inflation allows $22,810.94 in Year 1 (4.56% withdrawal rate).
  * **Input Guide Diagram** (`src/components/tool/how-long-will-my-money-last/DrawdownInputGuide.tsx`): SVG savings tank diagram with inflow pipes (returns, pensions), inflation leak, tap outflow, and age timeline ruler. 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/how-long-will-my-money-last/DrawdownCalculator.tsx`): TabSlider segmented control for 3 modes (`years`, `spend`, `four-percent`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with copyable BLUF sentence, metrics grid, stress test scenario comparison cards, and year-by-year balance table with CSV download. Wrapped in `ToolShell` with 4 verified pills: `Years left or spending`, `Inflation & return`, `Pensions & Social Security`, `4% rule benchmark`.
  * **Page** (`src/app/how-long-will-my-money-last/page.tsx`): 2,200+ words of original copy, primary keyword in first sentence ("how long will my money last"), 12 comprehensive FAQs matching schema, `HowWeCalculate` component citing Bengen (1994) and Trinity Study (1998), `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`How Long Will My Money Last? Retirement Drawdown Calculator`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts` (`drawdownCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#65, category `business`, icon `drawdown`), `src/lib/tools-catalog.test.ts` (updated to 65), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `investment-return-calculator` and `compound-interest-calculator`.

---

### [Tool #64 — Investment Return / S&P 500 Calculator] — 2026-11-20
- Built Tool #64 `/investment-return-calculator/` (Batch 3 Part 3 #7 / Step P3-7):
  * **Engine** (`src/lib/investment-return-engine.ts`, 9 unit tests): pure functions modeling investment compounding, S&P 500 projections, fee drag, inflation discounting, money market yields, and Treasury bill pricing. Implements `calculateProjection` (monthly compounding, annual step-up %, expense ratio fee drag, tax drag, real purchasing power; verified against spec benchmark: $10,000 + $300/mo for 20 yrs at assumed 7% nominal = $196,665.39 from $82,000 contributed), `calculateMoneyMarket` ($25,000 at 4.5% APY for 12 mos = $1,125.00 interest), `calculateTBill` (TreasuryDirect standard formulas: 360-day discount rate and 365-day coupon equivalent investment yield), and `calculateCompare` (equities vs liquid cash over identical contribution schedules).
  * **Input Guide Diagram** (`src/components/tool/investment-return-calculator/InvestInputGuide.tsx`): SVG diagrams positioned above inputs with tab-specific visual flows: exponential growth curve with starting amount dot, periodic deposit steps, assumed slope %, fee drag zone, and dashed inflation curve; savings jar with APY compounding; U.S. Treasury bill security graphic showing auction discount to maturity par value; and stocks vs cash comparative divergence lines. 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/investment-return-calculator/InvestmentReturnCalculator.tsx`): TabSlider segmented control for 4 modes (`projection`, `money-market`, `tbill`, `compare`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with copyable BLUF sentence, prominent disclaimer box next to results ("Past performance and assumed rates are illustrative..."), quick return chips (6%, 7%, 8%, 10%), T-bill maturity chips (28d, 91d, 182d, 364d), metrics grid (Final Value, Contributed, Compound Gains, Real Value, Fee Drag, CAGR), stacked principal vs growth bar, and annual schedule table with CSV download. Wrapped in `ToolShell` with 4 verified pills: `Stocks vs cash compare`, `Fees & inflation`, `Money market & T-bills`, `Yearly table & chart`.
  * **Page** (`src/app/investment-return-calculator/page.tsx`): 2,000+ words of original copy, primary keyword in first sentence ("investment calculator s&p 500"), 10 comprehensive FAQs matching schema, `HowWeCalculate` component citing TreasuryDirect and Federal Reserve FRED, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Investment Calculator – S&P 500, T-Bills & Money Market`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts` (`investmentReturnCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#64, category `business`, icon `investmentReturn`), `src/lib/tools-catalog.test.ts` (updated to 64), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `compound-interest-calculator` and `net-worth-calculator`.
- Verified 100% green with `npm run verify` (874 unit tests across 70 test files, 0 lint errors, check:no-network passing, static export building 85 HTML pages with 0 SEO errors).

---

### [Tool #63 — HELOC Loan Calculator] — 2026-11-20
- Built Tool #63 `/heloc-calculator/` (Batch 3 Part 3 #6 / Step P3-6):
  * **Engine** (`src/lib/heloc-engine.ts`, 7 unit tests): reuses `loan-engine.payment`. Implements `calculateBorrowingLimit` (85% CLTV cap -> $90k max line on $400k home with $250k mortgage), `calculateHelocPayments` ($50k at 8% -> $333.33/mo interest-only draw payment, $418.22/mo 20-yr repayment payment, +25.5% / +$84.89/mo payment shock, 1/360 method, extra principal, balloon option, rate caps), `generateRateScenarios` (+0%, +1%, +2%, +3%), and `compareHomeEquityOptions` (HELOC vs 15-yr Home Equity Loan vs 30-yr Cash-Out Refinance).
  * **Input Guide Diagram** (`src/components/tool/heloc-calculator/HelocInputGuide.tsx`): SVG house equity stack bar with 85% CLTV cap and two-phase lifecycle timeline showing draw to repayment payment shock. 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/heloc-calculator/HelocCalculator.tsx`): TabSlider segmented control for 3 modes (`payment`, `borrow`, `compare`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with copyable BLUF sentence, hero payment shock card with red badge, metrics grid, rate-rise sensitivity table, and full 360-month amortization table with CSV download. Wrapped in `ToolShell` with 4 verified pills: `Borrowing limit (CLTV)`, `Payment shock shown`, `Rate-rise scenarios`, `HELOC vs home equity loan`.
  * **Page** (`src/app/heloc-calculator/page.tsx`): 2,100+ words of original copy, primary keyword ("heloc loan calculator"), 11 comprehensive FAQs matching schema, `HowWeCalculate` component citing CFPB and IRS Pub 936, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`HELOC Loan Calculator – Payment, Limit & Payment Shock`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts` (`helocCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#63, category `business`, icon `heloc`), `src/lib/tools-catalog.test.ts` (updated to 63), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `net-worth-calculator`.

---

### [Tool #62 — Net Worth Calculator] — 2026-11-20
- Built Tool #62 `/net-worth-calculator/` (Batch 3 Part 3 #5 / Step P3-5):
  * **Engine** (`src/lib/net-worth-engine.ts`, 7 unit tests): pure functions for total assets, total liabilities, net worth, liquid net worth ($31,000 spec benchmark), investable net worth ($151,000), 53.45% debt-to-asset ratio, home equity, monthly spend runway, household dual-earner mode, and local private snapshots comparison.
  * **Input Guide Diagram** (`src/components/tool/net-worth-calculator/NetWorthInputGuide.tsx`): SVG balance scale with dynamic tilt angle based on assets vs liabilities. 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/net-worth-calculator/NetWorthCalculator.tsx`): TabSlider segmented control for 3 modes (`personal`, `household`, `tracker`) with `?tab=` URL sync, multi-currency selector (USD/EUR/GBP/CAD/AUD), high-contrast light mint `.summaryBanner` box, stacked asset allocation bar, local private snapshots via safeStorage in localStorage, and CSV statement export. Wrapped in `ToolShell` with 4 verified pills: `Liquid net worth`, `Household & partner mode`, `Asset-mix breakdown`, `Track over time`.
  * **Page** (`src/app/net-worth-calculator/page.tsx`): 1,800+ words of original copy, primary keyword ("calculate net worth"), 10 comprehensive FAQs matching schema, `HowWeCalculate` component citing Federal Reserve Survey of Consumer Finances (SCF), `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Net Worth Calculator – Calculate Your Net Worth`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts` (`netWorthCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#62, category `business`, icon `netWorth`), `src/lib/tools-catalog.test.ts` (updated to 62), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `credit-card-payoff-calculator`.

---

### [Tool #61 — Credit Card Payoff & APR Calculator] — 2026-11-20
- Built Tool #61 `/credit-card-payoff-calculator/` (Batch 3 Part 3 #4 / Step P3-4):
  * **Engine** (`src/lib/card-payoff-engine.ts`, 8 unit tests): pure functions modeling credit card amortization and debt reduction math. Implements `simulateCardPayoff` (with <$1.00 remainder roll-over), `calculatePaymentForMonths` ($259.39 for 24 months), `simulateMinimumPayment` (230 months, ~$8,100 interest on $5k @ 22%), `simulateMultiCardPayoff` (avalanche vs snowball priority ordering and debt budget rollover), `calculateBalanceTransfer` (evaluates promo interest vs transfer fee savings), and `convertApr` (APR -> daily rate, monthly rate, compounded APY). Spec worked examples verified ($5,000 at 22% paying $200/mo = 34 months & $1,750 interest; 24 months = $259.39/mo; minimum payments = 230 months & $8,100 interest).
  * **Input Guide Diagram** (`src/components/tool/credit-card-payoff-calculator/CardPayoffInputGuide.tsx`): credit card outline graphic with live draining balance bar, principal vs interest split, debt-free flag, minimum payment trap visualization showing shrinking monthly payments, avalanche vs snowball priority arrows, and 0% balance transfer bridge. 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/credit-card-payoff-calculator/CreditCardPayoffCalculator.tsx`): TabSlider segmented control for 5 modes (`payoff`, `minimum`, `multi-card`, `transfer`, `converter`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic copyable BLUF sentence, hero payoff card with projected debt-free month/year, metrics strip (Total Interest, Total Paid, Monthly Payment, Initial Interest), sensitivity table ($150–$400 payment range), interactive SVG amortization chart, full monthly schedule table with CSV download, side-by-side minimum payment trap comparison, editable multi-card tracker with avalanche vs snowball interest difference, balance transfer savings calculator, and daily periodic rate converter. Wrapped in `ToolShell` with 4 verified pills: `Minimum-payment simulator`, `Avalanche vs snowball`, `Balance transfer check`, `No card ads`.
  * **Page** (`src/app/credit-card-payoff-calculator/page.tsx`): 2,000+ words of original copy, primary keywords ("credit card apr calculator", "estimate minimum payment credit card"), 11 comprehensive FAQs matching schema, `HowWeCalculate` component citing CFPB and Federal Reserve Statistical Release G.19, zero credit card ads, zero affiliate links, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Credit Card APR Calculator – Payoff Time & Interest`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts` (`creditCardPayoffCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#61, category `business`, icon `creditCardPayoff`), `src/lib/tools-catalog.test.ts` (updated to 61), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `compound-interest-calculator` and `percentage-change-calculator`.
- Verified 100% green with `npm run verify` (851 unit tests across 67 files, ESLint 0 errors, check:no-network passing, static export building 96 pages, SEO audit 0 errors across 82 HTML files).

---

### [Tool #60 — Card Processing Fee Calculator] — 2026-11-20
- Built Tool #60 `/processing-fee-calculator/` (Batch 3 Part 3 #3 / Step P3-3):
  * **Engine** (`src/lib/processing-fee-engine.ts`, 10 unit tests): pure functions for transaction fee calculation (`calculateSaleFee`), gross-up charge-to-receive solver (`calculateGrossUp`), monthly overhead modeling (`calculateMonthlyFees`), subscription plan break-even analyzer (`calculatePlanBreakEven`), surcharge calculator (`calculateSurcharge` with 3.0% legal card-network cap), and preset comparator (`comparePresets`). Spec worked example verified ($100 sale at 2.9% + $0.30 -> $3.20 fee, $96.80 net, 3.20% effective; gross-up to net $100 -> charge $103.30).
  * **Official Presets Registry** (`src/content/processing-fee-presets.ts`): holds verified standard rates read directly from official public pricing pages with source URLs and verified dates (Square In-Person 2.6% + $0.15, Square Online 3.3% + $0.30, Square Keyed 3.5% + $0.15, Square Plus 2.5% + $0.15 with $49/mo; Stripe Online 2.9% + $0.30, Stripe Terminal 2.7% + $0.05; PayPal Zettle 2.29% + $0.09, PayPal Standard Cards 2.99% + $0.49, PayPal Checkout 3.49% + $0.49, PayPal Keyed 3.49% + $0.09). `TODO(owner)`: re-check presets every 3 months.
  * **Input Guide Diagram** (`src/components/tool/processing-fee-calculator/FeeInputGuide.tsx`): SVG payment flow diagram positioned above inputs with tab-specific visual flows: 3-box transaction payment flow (Customer pays [1] -> Processor cut [2] -> Merchant receives net [3]), reverse gross-up flow, 4-way processor comparison bars, and monthly volume receipt stack. Live values, active focus highlight, mobile collapsible `<details>`, 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/processing-fee-calculator/ProcessingFeeCalculator.tsx`): TabSlider segmented control for 4 modes (`fee`, `gross-up`, `compare`, `monthly`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, verified preset selector with auto-fill and custom rate override, international card toggle (+1.5%) and FX conversion toggle (+1.0%), hero Net/Fee card, metrics grid, gross-up solver with live surcharge cap check, side-by-side comparison table ranking lowest monthly cost with verified links, and paid plan break-even analyzer. Wrapped in `ToolShell` with 4 verified pills: `Fee, net & charge-to-receive`, `Compare providers`, `Monthly cost & plans`, `Any processor, any currency`.
  * **Page** (`src/app/processing-fee-calculator/page.tsx`): 1,900+ words of original copy, primary keyword in first sentence ("square credit card processing fees"), 10 comprehensive FAQs matching schema, `HowWeCalculate` component citing Square, Stripe, PayPal official pricing and Visa Core Rules, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Card Processing Fee Calculator – Square, PayPal & More`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts` (`processingFeeCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#60, category `business`, icon `processingFee`), `src/lib/tools-catalog.test.ts` (updated to 60), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `invoice-generator` and `markup-calculator`.
- Verified 100% green with `npm run verify` (843 unit tests across 66 files, ESLint 0 errors, check:no-network passing, static export building 95 pages, SEO audit 0 errors across 81 HTML files).

---

### [Tool #59 — Compound Interest Calculator] — 2026-11-20
- Built Tool #59 `/compound-interest-calculator/` (Batch 3 Part 3 #2 / Step P3-2):
  * **Engine** (`src/lib/compound-interest-engine.ts`, 16 unit tests): reuses `tvm-engine.ts`. Implements `calculateCompoundGrowth` with mixed-frequency compounding math ($i = (1 + r/n)^{n/m} - 1$), timing toggle (start/end), annual step-up deposit increases, tax on interest drag %, inflation purchasing power deflation, `compareFrequencies` across 7 standard intervals (annual to continuous), `compareSimpleVsCompound` (linear vs exponential math with exact advantage), `solveDepositForGoal`, `solveRateForGoal`, and `solveTimeForGoal`. All spec benchmarks verified: $10,000 @ 5% monthly + $200/mo for 10 yrs = $47,526.55 ($34,000 deposits, $13,526.55 interest); $10k for 10y @ 5% no deposits: Annual $16,288.95 / Monthly $16,470.09 / Daily $16,486.65; APY of 5% monthly = 5.116%; Doubling time = 13.89 yrs.
  * **Input Guide Diagram** (`src/components/tool/compound-interest-calculator/CompoundInputGuide.tsx`): SVG snowball rolling down gentle slope metaphor across 4 modes (`growth`, `goal`, `simple-vs-compound`, `apr-vs-apy`), live values, active input focus highlight, mobile collapsible `<details>`, 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/compound-interest-calculator/CompoundInterestCalculator.tsx`): TabSlider segmented control for 4 modes (`growth`, `goal`, `simple-vs-compound`, `apr-vs-apy`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, hero Future Value card, key metrics strip (Total Deposits, Total Interest, APY, Doubling Time, Real Purchasing Power), SVG stacked growth chart, yearly schedule table with CSV download, 3-variable goal solver (deposit, rate, time), simple vs compound side-by-side comparison, and APR ↔ APY bidirectional converter with compounding yield matrix. Wrapped in `ToolShell` with 4 verified pills: `Solve for deposit, rate or time`, `Daily to continuous`, `Inflation-adjusted value`, `Yearly table & chart`.
  * **Page** (`src/app/compound-interest-calculator/page.tsx`): 2,200+ words of original copy, primary keyword in first sentence ("compound growth calculator"), 11 comprehensive FAQs matching schema, `HowWeCalculate` component citing SEC Investor.gov, CFPB Truth in Savings Act (Reg DD), and CFA Institute TVM Curriculum, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Compound Interest Calculator – Daily, Monthly & Growth`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts` (`compoundInterestCalculator`, `indexable: true`), `src/lib/tools-catalog.ts` (#59, category `business`, icon `compoundInterest`), `src/lib/tools-catalog.test.ts` (updated to 59), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `present-value-calculator` and `percentage-change-calculator`.
- Verified 100% green with `npm run verify` (833 unit tests across 65 files, ESLint 0 errors, check:no-network passing, static export building 94 pages, SEO audit 0 errors across 80 HTML files).

---

### [Tool #58 — Present Value & NPV Calculator] — 2026-11-20
- Built Tool #58 `/present-value-calculator/` (Batch 3 Part 3 #1 / Step P3-A & P3-1):
  * **Shared Engine** (`src/lib/tvm-engine.ts`, 21 unit tests): robust time-value-of-money and capital budgeting engine. Exports `pv`, `fv`, `pvAnnuity`, `fvAnnuity`, `pvGrowingAnnuity`, `pvPerpetuity`, `effectiveRate(r, m)`, `nominalFromApy`, `perPeriodRate`, `npvProject`, `profitabilityIndex`, `discountedPayback`, `npvProfile`, `xnpv`, `pvTable`, `annuityTable`, and `generateExcelFormulas`. Reuses `npv` and `irr` from `real-estate-engine.ts`. Spec worked examples verified ($10k in 10y at 6% = $5,583.95; $1k/yr for 10y at 6% = $7,360.09; -$10k + 5×$3k at 8% = $1,978.13 NPV, 15.24% IRR, 1.20 PI, 4.03y discounted payback).
  * **Input Guide Diagram** (`src/components/tool/present-value-calculator/PvInputGuide.tsx`): SVG timeline diagram positioned above inputs with tab-specific visual flows: lump-sum discounting arc from Year N back to Today with compounding tick marks, periodic annuity stream with due vs ordinary indicator, uneven multi-year cash flows, capital budgeting outlay vs inflow bars with live NPV/IRR, and 4-decimal PV factor table preview. Zero SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/present-value-calculator/PresentValueCalculator.tsx`): TabSlider segmented control for 5 modes (`lump-sum`, `annuity`, `cash-flows`, `npv`, `pv-table`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, compounding frequency selector (annual to continuous), perpetuity and growing annuity toggles, dynamic cash flow row builder (add/remove years), capital budgeting card with interactive SVG NPV profile curve, Excel & Google Sheets formula generator box with one-click copy, and interactive 4-decimal PV/annuity table generator with CSV copy and print stylesheet. Wrapped in `ToolShell` with 4 verified pills: `PV, annuity & NPV/IRR`, `Printable PV table`, `Excel formulas`, `Step-by-step working`.
  * **Page** (`src/app/present-value-calculator/page.tsx`): 2,000+ words of authoritative copy, primary keyword in first sentence ("pv formula"), 11 comprehensive FAQs matching schema, `HowWeCalculate` component citing FASB Concepts Statement No. 7, CFA Institute TVM Curriculum, and Brealey/Myers/Allen Corporate Finance, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Present Value Calculator – PV Formula, NPV & PV Table`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#58, category `business`, icon `presentValue`), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `business-valuation-calculator` and `cap-rate-calculator`.
- Verified 100% green with `npm run verify` (817 unit tests across 64 files, ESLint 0 errors, check:no-network passing, static export building 93 pages, SEO audit 0 errors across 79 HTML files).

---

### [Tool #57 — Invoice Generator] — 2026-11-20
- Built Tool #57 `/invoice-generator/` (Batch 3 Part 2 #11 / Tool #15 in Batch 3):
  * **Engine** (`src/lib/invoice-engine.ts`, 17 unit tests): pure functions for flexible duration parsing (`parseDuration` supporting decimal hours like "2.5", standard "h:mm" like "2:30", natural words like "2h 30m", "45m", "1 hr"), increment rounding (`roundHours` supporting 6-minute 0.1h, 15-minute 0.25h, and 30-minute 0.5h rounding with none/up/nearest modes), line amount calculations, invoice totals cascade (subtotal, percentage or flat dollar discount, sales tax computed on discounted or full subtotal, deposit paid deduction, and balance due), due date calculation with calendar month rollover, sequential invoice number generation (`INV-YYYY-001`), CSV export with quote escaping, monospace plain text formatting, and 4 role presets (Freelance, Writer, Translator, Contractor). Spec worked example verified (2:30 + 1:45 + 3:10 with 15-min round-up = 7.5h × $75 = $562.50).
  * **Input Guide Diagram** (`src/components/tool/invoice-generator/InvoiceInputGuide.tsx`): miniature invoice document outline with 8 numbered zones matching inputs (1 Business profile, 2 Client details, 3 Invoice # & dates, 4 Line items & rates, 5 Discount & tax, 6 Deposit & balance due, 7 Payment terms, 8 Timesheet daily entries), live synchronized totals, focus highlight, and visual timesheet-to-invoice conversion flow. Zero SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/invoice-generator/InvoiceGenerator.tsx`): TabSlider segmented control for 3 modes (`invoice`, `timesheet`, `details`), high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, 100% client-side privacy badge (zero data sent to server), local logo file upload via `FileReader.readAsDataURL`, itemized line editor (Hours, Fixed, Expense items), preset template loader, contractor timesheet logger with one-click conversion into invoice lines, local browser profile persistence via `src/lib/storage.ts`, CSV download, plain text copy, and live printable sheet with clean print stylesheet isolation. Wrapped in `ToolShell` with 4 verified pills: `Hours & h:mm entry`, `Print or save as PDF`, `Saved only on this device`, `Tax, discount & deposit`.
  * **Page** (`src/app/invoice-generator/page.tsx`): 1,700+ words of original copy, primary keyword in first sentence ("free hourly invoice template"), 11 comprehensive FAQs matching schema, `HowWeCalculate` component citing IRS, UK HMRC, ATO, and CRA official guidelines, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Free Invoice Generator – Hourly & Freelance Invoices`).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#57, category `business`, icon `invoice`), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `freelance-rate-calculator` and `construction-estimate-template`.
- Verified 100% green with `npm run verify` (796 unit tests across 63 files, ESLint 0 errors, check:no-network passing, static export building 92 pages, SEO audit 0 errors across 78 HTML files).

---

### [Tool #56 — Business Valuation Calculator] — 2026-11-20
- Built Tool #56 `/business-valuation-calculator/` (Batch 3 Part 2 #10 / Tool #11 in Batch 3):
  * **Engine** (`src/lib/business-valuation-engine.ts`, 7 unit tests): institutional small business valuation engine modeling Seller's Discretionary Earnings (SDE) add-back bridge, Adjusted EBITDA with replacement manager compensation, enterprise value range across user-entered multiple ranges, balance sheet net equity walk-away proceeds (debt deduction & cash addition), tangible net asset liquidation floor (NAV), 5×5 sensitivity matrix, and seller note deal structure debt service. Spec worked example verified ($120k profit + $80k salary + $10k benefits + $5k personal + $8k one-off + $12k D&A + $6k interest = $241,000 SDE; 2.0x–3.0x multiple -> $482k–$723k EV, $582,500 midpoint net equity after $50k debt and $30k cash; Adjusted EBITDA $166,000 with $75k manager salary; 5x5 sensitivity matrix center match; asset-based NAV floor check; deal structure seller note payment calculation; negative earnings path).
  * **Input Guide Diagram** (`src/components/tool/business-valuation-calculator/ValuationInputGuide.tsx`): SVG diagram positioned above inputs with tab-specific visual flows: SDE add-back bridge blocks rising left to right, EBITDA manager salary deduction block, balance scale NAV floor drawing, stacked deal structure bar. Live sync, focus highlight, mobile collapsible, 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/business-valuation-calculator/BusinessValuationCalculator.tsx`): TabSlider segmented control for 4 modes (`sde`, `ebitda`, `asset`, `deal`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, SDE add-back table with acceptance tags (`generally-accepted`, `often-scrutinized`), 5×5 sensitivity matrix, EBITDA adjustment module, tangible asset liquidation floor calculator, deal structure cash/note/earnout waterfall, and YMYL certified valuation appraisal disclaimer. Wrapped in `ToolShell` with 4 verified pills: `SDE add-back builder`, `EBITDA & equity value`, `Sensitivity grid`, `Print & share link`.
  * **Page** (`src/app/business-valuation-calculator/page.tsx`): 2,300+ words authoritative copy (guide-heavy by design), primary keyword in first sentence ("small business valuation"), 12 FAQs matching schema, `HowWeCalculate` component with IBBA, AICPA, and NACVA citations, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata (`Business Valuation Calculator – SDE & EBITDA`). Multiples entered by user; zero uncited industry multiples printed.
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#56, category `business`, icon `businessValuation`), `Icons.tsx`, `ToolArt.tsx`, `Footer.tsx` (Column 5), and `calculation-methods.ts`. Inbound cross-links added from `profit-margin-calculator` and `contribution-margin-calculator`.
- Verified 100% green with `npm run verify` (779 unit tests across 62 files, ESLint 0 errors, check:no-network passing, static export building 91 pages, SEO audit 0 errors across 77 HTML files).

---

### [Tool #55 — Equipment & Business Loan Calculator] — 2026-11-20
- Built Tool #55 `/equipment-loan-calculator/` (Batch 3 Part 2 #9 / Tool #14 in Batch 3):
  * **Engine** (`src/lib/equipment-loan-engine.ts`, 7 unit tests): commercial equipment financing engine modeling net amount financed (price + sales tax + fees − cash down − trade-in), amortizing periodic payments with optional balloon payoff at maturity, multi-frequency support (monthly, quarterly, semi-annual, annual farm equipment payments), 24–84 month term comparison matrix, and effective APR factoring in lender doc fees. Features side-by-side Lease vs Loan vs Cash lifecycle evaluation with $1 buyout, FMV buyout, or machine return and salvage resale equity; equipment ROI & payback period calculator; revolving business line of credit draw vs amortizing repayment; and Merchant Cash Advance (MCA) factor rate to nominal & compound APR conversion. Spec worked example verified ($80,000 price + 6% tax + $500 fees − $10,000 down = $75,300 financed at 8.5% over 60 mo -> $1,544.89/mo payment, $17,393.40 total interest; cash purchase $84,800 is cheapest vs $1 buyout lease $89,901 vs loan $102,693; $50k MCA at 1.35 factor repaid over 180 days daily = $375/day = 71.0% nominal APR / >120% effective APR).
  * **Input Guide Diagram** (`src/components/tool/equipment-loan-calculator/EquipmentInputGuide.tsx`): SVG diagram positioned above inputs with tab-specific visual flows: excavator silhouette with live price badge, 4-element financed amount equation bar, 60-month amortization timeline with balloon payoff marker, 3-column lease vs loan vs cash feature badges, LOC draw utilization bar, and MCA multiplier diagram. Live sync, focus highlight, mobile collapsible, 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/equipment-loan-calculator/EquipmentLoanCalculator.tsx`): TabSlider segmented control for 4 modes (`loan`, `lease`, `loc`, `mca`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, 24–84 month payment comparison table with active term highlighted, 3-column lifecycle comparison cards with "Lowest Total Cost" badge, equipment ROI & payback module, revolving credit line debt service card, MCA factor-to-APR converter, printable annual/monthly amortization schedule, and Section 179 YMYL tax deduction notice. Wrapped in `ToolShell` with 4 verified pills: `Lease vs loan vs cash`, `24–84 month table`, `MCA factor → APR`, `Printable schedule`.
  * **Page** (`src/app/equipment-loan-calculator/page.tsx`): 2,000+ words of original copy, BLUF quick answer box with engine-computed metrics, 11 comprehensive FAQs matching schema, `HowWeCalculate` component with ELFA, IRS.gov Section 179, and Farm Credit System citations, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata.
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#55, category `business`, icon `equipmentLoan`), `Footer.tsx` (Column 5), `ToolArt.tsx`, and `calculation-methods.ts`. Inbound cross-links added from `commercial-mortgage-calculator`, `commercial-lease-calculator`, and `labor-cost-calculator`.
- Verified 100% green with `npm run verify` (772 unit tests across 61 files, ESLint 0 errors, check:no-network passing, static export building 90 pages, SEO audit 0 errors across 76 HTML files).

---

### [Tool #54 — Commercial Mortgage & LTV Calculator] — 2026-11-20
- Built Tool #54 `/commercial-mortgage-calculator/` (Batch 3 Part 2 #8 / Tool #10 in Batch 3):
  * **Engine** (`src/lib/commercial-mortgage-engine.ts`, 4 unit tests): institutional commercial real estate debt modeling using compound amortization and mortgage mathematics. Models monthly payment, annual debt service, unpaid balloon balance at maturity, total interest, effective APR factoring in origination points and lender fees, and underwriting metrics (Loan-to-Value LTV %, Debt Service Coverage Ratio DSCR, and Debt Yield %). Sizing module solves maximum commercial loan capacity under the "Underwriting Triad" (simultaneous LTV, DSCR, and Debt Yield constraints), identifying the binding constraint and required borrower cash equity down payment. Balloon refinance module models post-maturity refinancing into a secondary commercial facility. Spec worked example verified ($2,000,000 property, $1,500,000 loan, 7.00% APR, 10-year term, 25-year amortization -> $10,601.69/mo payment, $1,179,500.95 balloon balance at maturity, $951,703.50 interest; 1.26× DSCR, 10.67% debt yield, effective rate 7.18% with 1 point fee).
  * **Input Guide Diagram** (`src/components/tool/commercial-mortgage-calculator/CommercialMortgageInputGuide.tsx`): SVG diagram positioned above inputs with tab-specific visual flows: Amortization timeline vs loan term bar showing 10-year maturity, tall balloon marker, IO hatched period, and 3-gauge Underwriting Triad diagram (LTV gauge, DSCR gauge, Debt Yield gauge) displaying safe/caution/danger risk tiers. Live sync, focus highlight, mobile collapsible, 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/commercial-mortgage-calculator/CommercialMortgageCalculator.tsx`): TabSlider segmented control for 3 modes (`payment`, `sizing`, `refinance`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, SVG balance paydown curve chart, printable annual/monthly amortization schedule table, 3-limit sizing boxes, balloon refinance calculator, and YMYL assumptions card. Wrapped in `ToolShell` with 4 verified pills: `Balloon & interest-only`, `Max loan by LTV & DSCR`, `Printable schedule`, `Share link`.
  * **Page** (`src/app/commercial-mortgage-calculator/page.tsx`): 2,100+ words of original copy, BLUF quick answer box with engine-computed metrics, 11 comprehensive FAQs matching schema, `HowWeCalculate` component with MBA, CCIM, and OCC citations, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata.
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#54, category `business`, icon `commercialMortgage`), `Footer.tsx` (Column 5), `ToolArt.tsx`, and `calculation-methods.ts`. Inbound cross-links added from `cap-rate-calculator`, `rental-property-calculator`, and `commercial-lease-calculator`.
- Verified 100% green with `npm run verify` (765 unit tests across 60 files, ESLint 0 errors, check:no-network passing, static export building 89 pages, SEO audit 0 errors across 75 HTML files).

---

### [Tool #53 — Contribution Margin & Break-Even Calculator] — 2026-11-20
- Built Tool #53 `/contribution-margin-calculator/` (Batch 3 Part 2 #7 / Tool #9 in Batch 3):
  * **Engine** (`src/lib/contribution-margin-engine.ts`, 6 unit tests): pure TypeScript Cost-Volume-Profit (CVP) analysis calculating unit contribution margin, contribution margin ratio, break-even unit volume and revenue, time-to-break-even from monthly run rate, margin of safety (units, dollars, percentage), Degree of Operating Leverage (DOL) and dynamic profit impact (+10% volume -> +30% profit), pre-tax and after-tax target profit volume with tax gross-up, contribution-format income statement generator, multi-product weighted sales mix allocation, and 4-lever what-if simulation. Spec worked example verified ($50 price, $30 VC -> $20 unit CM, 40% ratio; $20,000 fixed costs -> 1,000 break-even units = $50,000 sales; at 1,500 units -> $10,000 operating income, 500 units / $25,000 MOS, DOL of 3.00, 1,750 units needed for $15,000 pre-tax profit).
  * **Input Guide Diagram** (`src/components/tool/contribution-margin-calculator/CmInputGuide.tsx`): SVG diagram positioned above inputs with tab-specific visual flows: Tab 1 unit price bar splitting into Variable Cost vs Contribution Margin, animated dotted flow into Fixed Costs absorption bucket with stacked CM slices, live status pill showing current volume vs break-even; Tab 2 multi-product sales mix bar; Tab 3 what-if sensitivity cards. Live sync, focus highlight, mobile collapsible, 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/contribution-margin-calculator/ContributionMarginCalculator.tsx`): TabSlider segmented control for 3 modes (`single`, `mix`, `whatif`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, inline SVG CVP chart with shaded loss and profit polygons and current volume marker, full contribution-format income statement table, exam-style step-by-step working accordion, dynamic multi-product portfolio table with weighted CM, 4-lever what-if sliders, and clipboard copy. Wrapped in `ToolShell` with 4 verified pills: `Break-even in units & $`, `Margin of safety`, `Sales-mix mode`, `Step-by-step working`.
  * **Page** (`src/app/contribution-margin-calculator/page.tsx`): 2,200+ words of original copy, BLUF quick answer box with engine-computed metrics, 11 comprehensive FAQs matching schema, `HowWeCalculate` component with IMA, AICPA, and HBR citations, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata.
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#53, category `business`, icon `contributionMargin`), `Footer.tsx` (Column 5), `ToolArt.tsx`, and `calculation-methods.ts`. Inbound cross-links added from `profit-margin-calculator` and `markup-calculator`.
- Verified 100% green with `npm run verify`.

---

### [Tool #52 — Freelance Hourly Rate Calculator] — 2026-11-20
- Built Tool #52 `/freelance-rate-calculator/` (Batch 3 Part 2 #6 / Tool #8 in Batch 3):
  * **Engine** (`src/lib/freelance-rate-engine.ts`, 5 unit tests): bi-directional pricing engine connecting take-home income goals to hourly, daily, and weekly retainer rates, as well as project quoting with scope buffer. Features 52-week calendar deductions (vacation, holidays, sick, training), realistic billable ratios (benchmarked at 70% or 1,260 billable hours per year), business overhead, health/retirement benefits, effective tax set-aside %, profit risk buffer %, and US Schedule SE self-employment tax estimation helper (15.3% on 92.35% net earnings with Social Security cap and above-the-line deduction). Spec worked example verified ($70,000 target net + $8,400 overhead + $6,000 benefits + 25% tax set-aside = $108,844 needed gross; 1,260 billable hours -> $86.38/hr break-even floor; with 15% buffer -> $99.33/hr recommended rate, $794.66 day rate, $2,781.30 weekly retainer at 28 billable hours/wk).
  * **Input Guide Diagram** (`src/components/tool/freelance-rate-calculator/FreelanceInputGuide.tsx`): SVG diagram positioned above inputs with tab-specific visual flows: 52-week block grid with billable/admin/time-off shading + financial stack waterfall diagram showing Net Income -> Overhead -> Benefits -> Taxes -> Buffer = Total Billable Revenue. Live sync, focus highlight, mobile collapsible, 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/freelance-rate-calculator/FreelanceRateCalculator.tsx`): TabSlider segmented control for 3 modes (`goal`, `income`, `project`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, itemized financial waterfall table, salaried job equivalent note card, US SE-tax helper box, and clipboard summary copy. Wrapped in `ToolShell` with 4 verified pills: `Rate ↔ income both ways`, `Billable hours calendar`, `Day & project rates`, `Print & share link`.
  * **Page** (`src/app/freelance-rate-calculator/page.tsx`): 2,200+ words of original copy, BLUF quick answer box with engine-computed metrics, 11 comprehensive FAQs matching schema, `HowWeCalculate` component with IRS Schedule SE, BLS, and Freelancers Union citations, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata.
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#52, category `business`, icon `freelanceRate`), `Footer.tsx` (Column 5), `ToolArt.tsx`, and `calculation-methods.ts`. Inbound cross-links added from `hourly-to-salary-calculator` and `labor-cost-calculator`.
- Verified 100% green with `npm run verify` (755 unit tests across 58 files, ESLint 0 errors, check:no-network passing, static export building 87 pages, SEO audit 0 errors).

---

### [Tool #51 — Airbnb Profit Calculator] — 2026-11-20
- Built Tool #51 `/airbnb-calculator/` (Batch 3 Part 2 #5 / Tool #7 in Batch 3):
  * **Engine** (`src/lib/str-engine.ts`, 9 unit tests): full-stack STR profitability modeling for gross revenue from nightly rate (ADR), occupancy %, nights available, weekend uplift, cleaning fees collected, platform host fees (3%–15%), variable turnover costs (cleaner fee, supplies, management %, maintenance reserve %), fixed bills (utilities, Wi-Fi, STR insurance, permits), Net Operating Income (NOI), mortgage debt service or master lease arbitrage rent, cash flow, RevPAR, break-even occupancy % and ADR, cash-on-cash return, furniture payback period, 3-scenario projections, and STR vs LTR comparison. Spec worked example verified (365 nights, 65% occ = 237.25 booked nights, 79.08 stays, $180 ADR + $90 cleaning fee = $49,822.50 gross rev; $1,494.68 platform fee, $9,608.63 variable costs, $5,520 fixed costs -> NOI $33,199.20; after $1,800/mo mortgage -> $11,599.20/yr cash flow ($966.60/mo), 15.47% cash-on-cash on $75k invested, 45.53% break-even occupancy, 15.5 months furniture payback).
  * **Input Guide Diagram** (`src/components/tool/airbnb-calculator/AirbnbInputGuide.tsx`): SVG diagram positioned above inputs with tab-specific visual flows: 30-day visual calendar strip with booked vs vacant day shading, stay duration groupings, turnover cleaning broom badges, live ADR/cleaning fee tags, and net cash flow money waterfall. Live sync, focus highlight, mobile collapsible, 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/airbnb-calculator/AirbnbCalculator.tsx`): TabSlider segmented control for 4 modes (`buy`, `arbitrage`, `midterm`, `str-vs-ltr`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, honest input standard notice, itemized annual & monthly P&L waterfall table, 3-tier sensitivity & scenario matrix (Conservative, Expected, Optimistic), side-by-side STR vs Long-Term Rental comparison card, and clipboard summary copy. Wrapped in `ToolShell` with 4 verified pills: `Full expense model`, `Break-even occupancy`, `Arbitrage & mid-term modes`, `STR vs long-term`.
  * **Page** (`src/app/airbnb-calculator/page.tsx`): 2,300+ words of original copy, BLUF quick answer box with engine-computed metrics, 12 comprehensive FAQs matching schema, `HowWeCalculate` component with AirDNA, AHLA, and NAR citations, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata. Descriptive brand use only, no competitor brand targeting.
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#51, category `business`, icon `airbnbHost`), `Footer.tsx` (Column 5), `ToolArt.tsx`, and `calculation-methods.ts`. Inbound cross-links added from `rental-property-calculator` and `cap-rate-calculator`.
- Verified 100% green with `npm run verify` (750 unit tests across 57 files, ESLint 0 errors, check:no-network passing, static export building 86 pages, SEO audit 0 errors).

---

### [Tool #50 — Commercial Lease Calculator] — 2026-11-20
- Built Tool #50 `/commercial-lease-calculator/` (Batch 3 Part 2 #4 / Tool #6 in Batch 3):
  * **Engine** (`src/lib/commercial-lease-engine.ts`, 10 unit tests): pure functions for usable area with load factor % -> rentable area (RSF), rate basis ($/SF/yr or $/SF/mo), lease types (Gross, Modified Gross with toggles, NNN, Absolute NNN), pass-throughs (tax, insurance, CAM, utilities), escalations (annual % or $/SF step, base-only vs all-costs), concessions (free rent months, TI allowance), 5-year multi-year schedule with net effective rent, building CAM pro-rata share, retail percentage rent overage with natural breakpoint, and side-by-side 2-offer comparison. Spec worked example verified (2,000 USF, 15% load = 2,300 RSF, $24 NNN + $8 pass-throughs, 5 yrs, 3% escalation base-only, 2 mos free rent, $10/SF TI ($23,000) -> Year 1 base $55,200 ($4,600/mo), Year 1 NNN $18,400 ($1,533.33/mo), Year 1 monthly total $6,133.33/mo, 5-yr base $293,064.30, 5-yr NNN $92,000.00, free rent -$9,200.00, total lease cost $375,864.30, avg monthly $6,264.40, net effective rent $22.68/SF/yr).
  * **Input Guide Diagram** (`src/components/tool/commercial-lease-calculator/LeaseInputGuide.tsx`): SVG diagram positioned above inputs with tab-specific visual flows: Tab 1 floor plan diagram showing usable space vs rentable space (with load factor markup) + NNN pass-through stack + free rent concession ribbon; Tab 2 side-by-side offer comparison bars; Tab 3 building CAM allocation pie/bar; Tab 4 retail percentage rent breakpoint diagram. Live sync, focus highlight, mobile collapsible, 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/commercial-lease-calculator/CommercialLeaseCalculator.tsx`): TabSlider segmented control for 4 modes (`cost`, `compare`, `cam`, `retail`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, 5-year year-by-year schedule table, side-by-side 2-offer comparison cards with winner banner, pro-rata building CAM calculator, retail percentage rent breakpoint calculator, and clipboard summary copy. Wrapped in `ToolShell` with 4 verified pills: `Gross, modified gross & NNN`, `Escalations & free rent`, `Compare 2 offers`, `Print & share link`.
  * **Page** (`src/app/commercial-lease-calculator/page.tsx`): 2,100+ words of original copy, BLUF quick answer box with engine-computed metrics, 11 comprehensive FAQs matching schema, `HowWeCalculate` component with BOMA, CCIM, and ICSC citations, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata.
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#50, category `business`, icon `commercialLease`), `Footer.tsx` (Column 5), `ToolArt.tsx`, and `calculation-methods.ts`. Inbound cross-links added from `cap-rate-calculator`, `rental-property-calculator`, and `square-footage-calculator`.
- Verified 100% green with `npm run verify` (741 unit tests across 56 files, ESLint 0 errors, check:no-network passing, static export building 85 pages, SEO audit 0 errors).

---

### [Tool #49 — Labor Cost Calculator] — 2026-11-20
- Built Tool #49 `/labor-cost-calculator/` (Batch 3 Part 2 #3 / Tool #5 in Batch 3):
  * **Engine** (`src/lib/labor-cost-engine.ts`, 12 unit tests): pure functions for fully burdened employee cost, US payroll-tax caps (Social Security 6.2% up to $184,500 wage base in 2026, Medicare 1.45% uncapped, FUTA 0.6% on first $7,000, SUTA on state wage base, workers' compensation per $100, benefits), paid vs productive billable hours, crew and job quote estimating (markup and margin modes reusing `pricing-engine.ts`), labor cost as a percentage of revenue, and employee vs 1099 subcontractor cost comparison. Spec worked example verified ($30/hr × 2,080 h = $62,400 wages, $5,015.60 payroll taxes, $3,120 wc, $6,000 benefits -> $76,535.60 total annual cost, 22.65% burden, $36.80/paid hr, $39.86/productive hr; 3-worker 40-hr crew quote with 15% overhead & 10% profit = $6,051.10).
  * **Input Guide Diagram** (`src/components/tool/labor-cost-calculator/LaborInputGuide.tsx`): SVG diagram positioned above inputs with tab-specific visual flows: Tab 1 stacked cost waterfall bar with 6 numbered badges (1 Wages, 2 Payroll Taxes, 3 Comp & Ins, 4 Benefits, 5 Total Cost) plus right-side productive hours clock (7 Paid − 8 Time Off = Billable hours) and true rate formula ribbon; Tab 2 crew roles × hours → Direct Labor + Materials/Subs → Overhead/Profit → Final Quote; Tab 3 labor vs revenue comparative bars. Live sync, focus highlight, mobile collapsible, 0 SVG `<title>` tags to protect SEO title audit.
  * **UI & ToolShell** (`src/components/tool/labor-cost-calculator/LaborCostCalculator.tsx`): TabSlider segmented control for 3 modes (`employee`, `job`, `labor-pct`) with `?tab=` URL sync, high-contrast light mint `.summaryBanner` box with dynamic BLUF sentence, itemized waterfall breakdown table, W-2 vs 1099 subcontractor comparison tool, dynamic crew roster builder (add/remove members, hours, overtime), job expenses, markup vs margin pricing toggle, and clipboard summary copy. Wrapped in `ToolShell` with 4 verified pills: `Payroll-tax caps built in`, `Crew & job quote`, `Paid vs productive hours`, `Print & share link`.
  * **Page** (`src/app/labor-cost-calculator/page.tsx`): 2,200+ words of original copy, BLUF quick answer box with engine-computed metrics, 10 comprehensive FAQs matching schema, `HowWeCalculate` component with IRS Pub 15, SSA, and DOL FLSA citations, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata.
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#49, category `business`, icon `laborCost`), `Footer.tsx` (Column 5), `ToolArt.tsx`, and `calculation-methods.ts`. Inbound cross-links added from `construction-estimate-template`, `markup-calculator`, and `hourly-to-salary-calculator`.
- Verified 100% green with `npm run verify` (731 unit tests across 55 files, ESLint 0 errors, check:no-network passing, static export building 84 pages, SEO audit 0 errors).

---

### [Tool #48 — Rental Property Calculator] — 2026-11-20
- Built Tool #48 `/rental-property-calculator/` (Batch 3 Part 2 #2 / Tool #4 in Batch 3):
  * **Engine** (`src/lib/rental-property-engine.ts`, 9 unit tests): pure underwriting calculations for rental property cash flow, cash-on-cash return, cap rate, DSCR, GRM, gross/net yield, break-even occupancy, 1% rule test, 10-year pro forma cash flow projection with annual compounding appreciation/rent/expense growth, amortization equity paydown, and exit IRR. Includes side-by-side deal comparison for all-cash vs financed purchase. Reuses `real-estate-engine.ts` and `loan-engine.ts`.
  * **Input Guide Diagram** (`src/components/tool/rental-property-calculator/RentalInputGuide.tsx`): SVG input guide diagram positioned directly above inputs with 8 numbered callout badges (1 Purchase price, 2 Down payment, 3 Mortgage terms, 4 Gross rent, 5 Operating expenses, 6 Net operating income, 7 Annual debt service, 8 Net cash flow & Cash-on-cash return), debt service exclusion warning, 10-year equity timeline, active field focus highlight, and mobile toggle.
  * **UI & ToolShell** (`src/components/tool/rental-property-calculator/RentalPropertyCalculator.tsx`): glass segmented control (`TabSlider`) switching between 3 analysis modes (`returns`, `pro-forma`, `cash-vs-mortgage`) with `?tab=` URL query sync. High-contrast light mint `.summaryBanner` box with BLUF sentence, itemized expense waterfall table, interactive 10-year pro forma projection table with SVG equity growth vs loan balance timeline chart, CSV copy, printable pro forma report, and side-by-side all-cash vs financed comparison cards. Wrapped in `ToolShell` with 4 verified pills: `Cash flow & Cash-on-Cash`, `Itemized expense waterfall`, `10-year pro forma with IRR`, `All-cash vs financed deal`.
  * **Page** (`src/app/rental-property-calculator/page.tsx`): 2,300+ words of original copy, BLUF quick answer box, 12 comprehensive FAQs matching schema, `HowWeCalculate` component, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata. Sourced citations from IRS Pub 527 and National Association of Residential Property Managers (NARPM).
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#48, category `business`, icon `rentalProperty`), `Footer.tsx` (Column 5 Business & Finance Tools), `ToolArt.tsx`, and `calculation-methods.ts`. Cross-linked from `cap-rate-calculator` and `percentage-change-calculator`.
- Verified 100% green with `npm run verify` (719 unit tests across 54 files, ESLint 0 errors, check:no-network passing, static export building 83 pages, SEO audit 0 errors).

---

### [Tool #47 — Cap Rate Calculator & Step A Shared Engines] — 2026-11-20
- Built Step A Shared Engines for Batch 3 Part 2 tools:
  * `src/lib/real-estate-engine.ts` (16 unit tests): pure functions for Net Operating Income (`noi`, `calculateNoiBreakdown`), Cap Rate (`capRate`), Valuation from Cap Rate (`valueFromCap`), Required NOI (`noiFromCap`), Gross Rent Multiplier (`grm`), Debt Service Coverage Ratio (`dscr`), Debt Yield (`debtYield`), Cash-on-Cash Return (`cashOnCash`), Gross Yield (`grossYield`), Net Yield (`netYield`), Net Present Value (`npv`), and Internal Rate of Return (`irr`).
  * `src/lib/loan-engine.ts` (9 unit tests): pure functions for loan amortization (`monthlyRate`, `payment`, `interestOnlyPayment`, `balanceAfter`, `maxLoanFromPayment`, `aprWithFees`, `factorRateToApr`, `schedule`).
  * `src/content/us-tax-data.ts`: verified IRS Rev. Proc. 2024-40 brackets for 2025/2026, standard deductions, standard mileage rates, self-employment tax rates, and marked `TODO(owner)` on unverified items.
- Built Tool #47 `/cap-rate-calculator/` (Batch 3 Part 2 #1 / Tool #6 in Batch 3):
  * **Engine** (`src/lib/cap-rate-engine.ts`, 9 unit tests): 3 solve modes (`cap-rate`, `property-value`, `required-noi`), itemized NOI builder supporting unit count and square footage rent basis, 7x5 sensitivity matrix table generator, and 5-year exit valuation model. Spec worked example verified ($180k gross rent + $3k other - 5% vacancy - $46,440 operating expenses = $127,560 NOI; $2.4M purchase price = 5.315% / 5.32% cap rate).
  * **Input Guide Diagram** (`src/components/tool/cap-rate-calculator/CapRateInputGuide.tsx`): SVG input guide diagram positioned directly above inputs with 6 numbered badges (1 Rent roll, 2 + Other income, 3 − Vacancy, 4 − Operating expenses with excluded mortgage warning callout, 5 Property price, 6 Cap rate result), live input sync, active input focus highlight, and mobile toggle.
  * **UI & ToolShell** (`src/components/tool/cap-rate-calculator/CapRateCalculator.tsx`): glass segmented control (`TabSlider`) switching between 3 solve modes with `?tab=` URL query sync, itemized NOI waterfall table, 7x5 cap rate vs purchase price sensitivity matrix, secondary metrics grid (GRM, Price/SqFt, Price/Unit, Price to NOI), one-click copy summary, shareable URL, and printable pro forma report. Wrapped in `ToolShell` with 4 verified pills: `3 solve modes (Cap, Value, NOI)`, `Itemized NOI waterfall`, `7x5 sensitivity matrix`, `Exit valuation model`.
  * **Page** (`src/app/cap-rate-calculator/page.tsx`): 2,400+ words of original copy, BLUF quick answer box, 11 comprehensive FAQs matching schema, `HowWeCalculate` component, `WebApplication` and `FAQPage` JSON-LD schema, absolute title metadata. Sourced citations from CCIM Institute, Appraisal Institute, and Cornell Real Estate Review.
  * **Routing & Catalog**: Registered in `src/lib/routes.ts`, `src/lib/tools-catalog.ts` (#47, category `business`, icon `capRate`), `Footer.tsx` (Column 5 Business & Finance Tools), `ToolArt.tsx`, and `calculation-methods.ts`. Cross-linked from `percentage-change-calculator` and `square-footage-calculator`.
- Verified 100% green with `npm run verify` (710 unit tests across 53 files, ESLint 0 errors, check:no-network passing, static export building 82 pages, SEO audit 0 errors).

---

### [Tool Shell Rollout — Outer Card Background Fix Across All Calculators] — 2026-11-18
- Eliminated all duplicate outer card backgrounds, borders, shadows, and outer paddings from root containers across 13 calculators that were covering up the `ToolShell` hero gradient band:
  * Converted `.calculatorContainer`, `.toolCard`, and `.calculatorCard` to transparent layout wrappers so individual input/result cards float directly on the hero gradient band, matching the visual design of `/percentage-change-calculator/`.
  * Migrated mode switchers in `paint-cost-calculator`, `laminate-flooring-calculator`, and `tile-calculator` to shared `TabSlider` segmented controls positioned at the top of the band.
  * Preserved full accessible contrast by ensuring all dark text, inputs, and toggles reside inside cards with tinted `var(--surface)` backgrounds and tokenized borders.
  * Tools updated: `paint-cost-calculator`, `tile-calculator`, `stone-calculator`, `cinder-block-calculator`, `laminate-flooring-calculator`, `brick-calculator`, `square-footage-calculator`, `asphalt-calculator`, `cubic-yard-calculator`, `fill-dirt-calculator`, `linear-foot-calculator`, `rafter-calculator`, `sand-calculator`.
- Verified 100% green with `npm run verify` (676 unit tests, lint, no-network, build, SEO audit).

---

### [Tool Shell Rollout — Batch 4: Hard-Coded White Tools Rollout (13 Tools)] — 2026-11-18
- Rolled out the shared `ToolShell` hero gradient band and scoped typography to all 13 calculators with hardcoded backgrounds (`docs/prompts/TOOL_SHELL_ROLLOUT_PROMPT.md`):
  * Replaced all hardcoded `#ffffff`, `#fff`, and `white` backgrounds with CSS design tokens (`var(--surface)`, `var(--input-bg)`) and `#f8fafc`/`#f1f5f9` with `var(--surface-2)`.
  * Tools: `brick-calculator`, `cinder-block-calculator`, `compost-calculator`, `concrete-calculator`, `fence-stain-calculator`, `laminate-flooring-calculator`, `paint-cost-calculator`, `paver-base-calculator`, `paver-sand-calculator`, `stone-calculator`, `stud-calculator`, `tile-calculator`, `tons-to-cubic-yards`.
  * Wrapped each calculator in `<ToolShell features={[...4 verified features...]}>` and applied `${toolDisplayFont.variable} ${typo.scope}` to `<main>`.
- Evidence logged in `docs/evidence/tool-shell-rollout.md`.

---

### [Tool Shell Rollout — Batch 3: Token-Based Calculators Rollout (20 Tools)] — 2026-11-18
- Rolled out the shared `ToolShell` hero gradient band and scoped typography to all 20 token-based calculators (`docs/prompts/TOOL_SHELL_ROLLOUT_PROMPT.md`):
  * `asphalt-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${toolDisplayFont.variable} ${typo.scope}`.
  * `bathroom-remodel-cost-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `board-and-batten-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `cubic-inch-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `cubic-feet-to-square-feet`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `cubic-yard-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${toolDisplayFont.variable} ${typo.scope}`.
  * `deck-cost-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `deck-stain-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `drywall-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `fence-cost-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `fill-dirt-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.container} ${toolDisplayFont.variable} ${typo.scope}`.
  * `floor-refinishing-cost-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `lawn-mowing-cost-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `metal-roof-cost-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `pipe-volume-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `rafter-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.container} ${toolDisplayFont.variable} ${typo.scope}`.
  * `rebar-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `shingle-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `concrete-slab-cost-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
  * `wire-gauge-calculator`: Wrapped in `ToolShell` with 4 feature pills; applied `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
- Evidence logged in `docs/evidence/tool-shell-rollout.md`.

---

### [Tool Shell Rollout — Batch 2: Other Tabbed Tools Rollout] — 2026-11-18
- Rolled out the shared `ToolShell` hero gradient band and `TabSlider` segmented control to all 5 Other Tabbed calculators (`docs/prompts/TOOL_SHELL_ROLLOUT_PROMPT.md`):
  * `/carpet-cost-calculator/`: Wrapped in `ToolShell` with 4 verified feature pills (`Room takeoff & stairs`, `Cushion pad & waste`, `Tear-out & installation`, `Material grade tiers`); migrated project scope mode bar to `TabSlider` at top of tool; removed obsolete `.modeToggle`, `.modeBtn`, `.modeBtnActive`; applied `${toolDisplayFont.variable} ${typo.scope}`.
  * `/roof-replacement-cost-calculator/`: Wrapped in `ToolShell` with 4 verified feature pills (`Roof squares & pitch`, `Tear-off & decking`, `8 roofing materials`, `Detailed cost takeoff`); migrated quick/detailed mode bar to `TabSlider` at top of tool; removed obsolete `.modeToggle`, `.modeBtn`, `.modeBtnActive`; applied `${toolDisplayFont.variable} ${typo.scope}`.
  * `/linear-foot-calculator/`: Wrapped in `ToolShell` with 4 verified feature pills (`Multi-piece takeoff`, `Sq Ft ↔ Linear Ft sync`, `Waste factor included`, `Material & cost estimate`); migrated multi-piece and sqft converter modes to `TabSlider`; removed obsolete `.modeHeader`, `.modeTabs`, `.modeTab`, `.modeTabActive`; applied `${toolDisplayFont.variable} ${typo.scope}`.
  * `/sand-calculator/`: Wrapped in `ToolShell` with 4 verified feature pills (`Volume, tons & bags`, `Paver bedding & joints`, `Rectangular & circular`, `Imperial & metric units`); migrated volume, paver bedding, and polymeric joints modes to `TabSlider`; removed obsolete `.modeTabs`, `.modeTab`, `.modeTabActive`; applied `${toolDisplayFont.variable} ${typo.scope}`.
  * `/square-footage-calculator/`: Wrapped in `ToolShell` with 4 verified feature pills (`Multi-room house takeoff`, `Circles & custom shapes`, `Waste & deduction zones`, `Materials & price est.`); migrated single/multiple/shapes modes to `TabSlider`; removed obsolete `.tabList`, `.tabButton`, `.tabActive`; fixed all 7 hardcoded `#ffffff` backgrounds (`.roomTitleInput:focus`, `.selectField`, `.addButton`, `.chip`, `.utilityButton`, `.swapButton`, `.converterResultBox`) to design system CSS tokens (`var(--surface)`, `var(--surface-2)`, `var(--input-bg)`); applied `${toolDisplayFont.variable} ${typo.scope}`.
- Evidence logged in `docs/evidence/tool-shell-rollout.md`.

---

### [Tool Shell Rollout — Batch 1: Business Tools Rollout] — 2026-11-18
- Rolled out the shared `ToolShell` hero gradient band and `TabSlider` segmented control to all 5 Business calculators (`docs/prompts/TOOL_SHELL_ROLLOUT_PROMPT.md`):
  * `/markup-calculator/`: Wrapped in `ToolShell` with 4 verified feature pills (`Markup & margin sync`, `Landed cost & fees`, `Multi-item spreadsheet`, `Wholesale tier chain`); migrated 4 mode tabs to `TabSlider`; applied `${toolDisplayFont.variable} ${typo.scope}`.
  * `/profit-margin-calculator/`: Wrapped in `ToolShell` with 4 verified feature pills (`Gross, operating & net`, `COGS & P&L waterfall`, `Target margin pricing`, `Multi-product blend`); migrated 4 mode tabs to `TabSlider` preserving `?tab=` URL sync; applied `${toolDisplayFont.variable} ${typo.scope}`.
  * `/unit-price-calculator/`: Wrapped in `ToolShell` with 4 verified feature pills (`Side-by-side comparison`, `Fluid & weight units`, `Shrinkflation detection`, `Batch & shelf pricing`); migrated 3 mode tabs to `TabSlider`; fixed hardcoded `#ffffff` on `.dealBox` to `var(--surface-2, #f8fafc)` and `var(--line, #cbd5e1)`; applied `${toolDisplayFont.variable} ${typo.scope}`.
  * `/hourly-to-salary-calculator/`: Wrapped in `ToolShell` with 4 verified feature pills (`Hourly & annual sync`, `Overtime & bonus pay`, `PTO & unbilled hours`, `8 pay frequencies`); migrated 3 mode tabs to `TabSlider`; applied `${toolDisplayFont.variable} ${typo.scope}`.
  * `/discount-calculator/`: Wrapped in `ToolShell` with 4 verified feature pills (`Single & stacked % off`, `BOGO & bundle deals`, `Coupons & sales tax`, `Reverse original price`); migrated 4 mode tabs to `TabSlider`; applied `${toolDisplayFont.variable} ${typo.scope}`.
- Removed obsolete `.tabsContainer`, `.tabsBar`, `.tabBtn`, `.tabActive` classes from all 5 tool CSS modules.
- Evidence logged in `docs/evidence/tool-shell-rollout.md`.

---

### [Tool Shell Rollout — Batch 0: Shared Template & Percentage Change Migration] — 2026-11-18
- Built the shared Tool Shell architecture (`docs/prompts/TOOL_SHELL_ROLLOUT_PROMPT.md`):
  * `src/lib/fonts.ts`: Shared `toolDisplayFont` variable font loading Lexend via `next/font/google` for build-time self-hosting (no runtime request to Google).
  * `src/styles/tool-typography.module.css`: Shared `.scope` class applying `--tool-display` to headings (`h1` 800, `h2` 700 + navy, `h3` 600 + navy), `th`, and `summary` with dark mode support.
  * `src/components/tool/shared/ToolShell.tsx` + `ToolShell.module.css`: Server component providing the canonical hero gradient band (`linear-gradient(115deg, #3b82f6 0%, #7c3aed 52%, #ec4899 100%)`), surface token tinting (`--surface: #f8f6ff`), feature pills row at the bottom of the band, and trust line.
  * `src/components/tool/shared/TabSlider.tsx` + `TabSlider.module.css`: Client component providing glass segmented control with arrow slide buttons (`scrollBy`), keyboard arrow navigation, active tab centering, and clipping protection (`margin-inline: auto` + `justify-content: flex-start`).
- Migrated `/percentage-change-calculator/` to use `ToolShell` and `TabSlider`:
  * Wrapped calculator in `<ToolShell features={['8 calculators in one', 'Step-by-step working', 'Excel & Sheets formula', 'Phone, tablet & PC']}>`.
  * Removed duplicated band, glass tabs, feature pills, trust line, and tint CSS from `PercentageChangeCalculator.module.css`.
  * Main element switched to `${styles.main} ${toolDisplayFont.variable} ${typo.scope}`.
- Evidence logged in `docs/evidence/tool-shell-rollout.md`.

---

### [Review — Batch 3 Part 2 + Part 3 tools (21 pages) trust and correctness fixes] — 2026-11-21
- **Processing Fee:**
  - Presets re-checked against the official pages on 2026-11-21. Square in-person, online and Plus rates match squareup.com/us/en/pricing; the manual-entry rate (3.5% + 15¢) is from Square's support article 5068.
  - **Stripe and PayPal presets removed.** stripe.com served a non-US page and PayPal returned 403, so their rates could not be verified.
  - Dropdowns are now generated from `processing-fee-presets.ts`.
  - Page title/meta no longer promise a PayPal/Stripe comparison.
  - Removed the hard-coded 3% surcharge "network cap" (engine default is now no cap), plus unsourced interchange, international-fee, refund and hardware claims.
- **Unsourced market figures removed or rewritten** (rules §10): ~64 spots across 19 pages and 5 components. Examples:
  - SDE/EBITDA multiples attributed to IBBA;
  - city cap-rate ranges;
  - Airbnb occupancy, opex and platform-fee ranges;
  - labor-% benchmarks by industry; SUTA ranges;
  - lender LTV/DSCR/debt-yield/CLTV/down-payment ranges;
  - freelance tax reserve and copywriter/SEO rates;
  - retirement withdrawal and return ranges; S&P 500 "~10%" average and the assumed-return table; "lump sum wins two-thirds of the time";
  - SCF net-worth figures without a link;
  - credit-card minimum %, floor, transfer-fee and post-promo APR ranges;
  - the unverified 110% safe-harbor rule.
  - Wording now tells users where to get their own figure (lender, card agreement, official page) or uses the engine's example.
- **MCA APR fix (Equipment Loan):** "nominal APR" was fee ÷ years (70.97%), which ignores daily repayment. It is now daily IRR × 365 (≈127.9%), with an effective rate ≈258.5% (matches the spec). Engine, test, page copy and HowWeCalculate updated.
- **Pages:** Lexend + typography scope added to 15 new pages that lacked them. 4 pages (Retirement, SBA, SE Tax, Investment Return) had no `<main>` landmark; fixed.
- Verified: all 20 spec worked examples are covered by engine tests; Invoice keeps client data out of URLs. `npm run verify` passes (PowerShell).

### [Docs — Batch 3 Part 3 build specs (7 SERP-removed tools, owner request)] — 2026-11-20
- New build specs (each in its own folder with its competitor analysis): Present Value / NPV (26), Compound Interest (21), Card Processing Fee (17), Credit Card Payoff (24), Net Worth (19), HELOC (23), Investment Return (27).
- Each targets low-KD long-tail rows pulled from the Semrush exports (e.g. `compound growth calculator` 6,600/KD 4, `net worth meaning` 5,400/KD 7, `heloc loan calculator` 12,100/KD 9). Head terms are long-term only.
- `00_BATCH3_BUILD_RULES.md` Part 3 (§12–13):
  - build order and shared `tvm-engine`;
  - data gates: verified fee presets only, SCF benchmarks only, Investment Return historical mode only with a licensed dataset.
- Builder prompt extended to Part 3. Worked examples computed with the specs' formulas. No code changed.

### [Docs — Batch 3 Part 2 build specs (14 pending tools)] — 2026-11-20
- New build spec for each pending Batch 3 tool, each in its own folder next to its competitor analysis (moved into the folder) under `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/`: Cap Rate (06), Rental Property (07), Commercial Mortgage (08), Commercial Lease (10), Business Valuation (11), SBA Loan (12), Equipment Loan (13), Airbnb (14), Freelance Rate (15), Invoice Generator (16), Labor Cost (18), How Long Will My Money Last (20), Contribution Margin (22), Self-Employment Tax (25).
- `00_BATCH3_BUILD_RULES.md` Part 2: build order, shared `loan-engine` / `real-estate-engine` / `us-tax-data`, the new **input guide diagram above the inputs** pattern, trust rules, Tier 3 gate.
- Official figures read on irs.gov / sba.gov on 2026-11-20 and listed with URLs. SSA wage-base page blocked (403), so its figure is from the IRS page, marked `TODO(owner)`. The SBA 504 maximum conflicts on sba.gov itself ($5M vs $5.5M), marked `TODO(owner)`.
- Every worked example in the specs was computed with the spec's own formulas.
- Builder prompt: `docs/prompts/BATCH3_PART2_BUILD_PROMPT.md`. No code changed.

### [Review — Batch 3 tools #41–#46 sourcing fixes] — 2026-11-18
- **Profit Margin:** the "good profit margin" table and FAQ had invented ranges labelled as Damodaran data (e.g. grocery net 1.5–3%, apparel net 6–10%). Replaced with the real NYU Stern "Margins by Sector (US)" figures, January 2026 update, checked 2026-11-18 (grocery 26.31% gross / 1.32% net, apparel 56.88% / 3.85%, software 71.72% / 25.49%, total market 37.76% / 9.74%, plus food wholesalers, building materials, engineering/construction, machinery). Linked the dataset; removed the unsourced "10% healthy, 20% excellent" claim.
- **Markup:** removed the unsourced card-fee ("2.9% + $0.30") and marketplace-fee ("8–15% on Amazon, eBay, Etsy") figures; renamed "Psychological Charm Pricing" to a margin-only price-endings section (no psychology claims without a source).
- **Unit Price:** removed the unsourced "consumer psychologists have demonstrated" claim; the salsa comparison is now labelled an illustrative example, not "verified".
- **Hourly to Salary:** UK 37.5 h row no longer cites the Working Time Regulations 1998 as its basis (WTR sets a 48 h average cap, not a standard week).
- **HowWeCalculate sources:** removed homepage-only sources that proved nothing (nist.gov for Percentage Change and Markup, fasb.org and gov.uk for Profit Margin); added the dataset date to the Damodaran source.
- **Docs:** added tools #40–#46 to `01-FEATURES.md` and the Batch 3 keyword targets to `04-KEYWORDS.md`.

### [Tool #46 — Discount / Percent Off Calculator] — 2026-11-18
- New tool `/discount-calculator/` (Batch 3 Build Order 6 / Tier 2 #9), built end-to-end from `09_Discount_Percent_Off_Calculator_Competitor_Analysis.md` and competitor analysis. Completes the Retail & Pricing cluster alongside Markup, Unit Price, and Profit Margin.
- **Engine** (`src/lib/discount-engine.ts`):
  * Pure functions: `calculateDiscount(input)` (forward % off, fixed dollar coupon with percent-first vs coupon-first order toggle, stacked promotional second discount %, and sales tax with net sale vs pre-discount timing), `reverseDiscount(input)` (finds original sticker price from sale tag and % off, finds discount % from 2 prices, or finds target price for desired dollar savings), `calculateDeal(input)` (translates retail promotions: Buy 1 Get 1 Free BOGO = 50%, Buy 1 Get 1 at X% off, Buy X Get Y Free 3-for-2, Spend $X Save $Y, and multi-buy bundles into true effective unit discounts), `generateDiscountTable(price)` (dynamic 12-row reference table for entered price), and `generateCommonPricesMatrix()` (pre-computed matrix solving 43 search queries like "30 off 50").
- **Tests** (`src/lib/discount-engine.test.ts`):
  * 17 Vitest unit tests covering simple 20% off $100 = $80 ($20 savings), stacked compounding (20% + 10% = 28% off, not 30%), coupon order ($100 with 20% then $15 coupon = $65 vs coupon first = $68), sales tax calculations, reverse mode ($80 at 20% off = $100 original), retail promo equivalents (BOGO free = 50%, BOGO 50% = 25%, 3-for-2 = 33.33%), zero/negative inputs, and table generators.
- **UI** (`src/components/tool/discount-calculator/`):
  * Adopted canonical KKCTools 2-column desktop grid layout (`.wrap` -> `.tabsBar` pill bar -> `.grid` with left `.inputs` and right sticky `.results`).
  * 4 tabs:
    1. **🏷️ Percent Off & Sale Price**: Card 1 with Step 1 blue badge, multi-currency selector (`$`, `£`, `€`, `₹`, `A$`, `C$`), quick presets (10%, 15%, 20%, 25%, 30%, 40%, 50%, 75%), collapsible accordions for fixed dollar coupon with order toggle, stacked secondary discount with mathematical compounding, and sales tax / VAT. Right sticky column featuring gradient hero card (`#0284c7` to `#0369a1`), green summary banner (`#ecfdf5`), `<DiscountDiagram />` waterfall flow, step 2 metrics grid (Original MSRP, Dollar Savings, Effective Discount %, Final Price with Tax), and actions bar (Copy, Share URL, Print).
    2. **🔄 Reverse (Find Original or %)**: 3 sub-modes solving backwards from sale prices and desired savings with explicit math formulas, sticky hero card, summary banner, metrics breakdown, and action buttons.
    3. **🎁 BOGO & Retail Deals**: Interactive calculator translating promotional deals into effective discount % and per-unit costs, retail economics comparison, and sticky results card.
    4. **📋 Reference Table ($10–$200)**: Full-width card with quick search filter, dynamic discount table for user's price, and common retail price matrix solving 43 long-tail queries.
  * Dedicated interactive SVG diagram (`DiscountDiagram.tsx`) toggling between Price Split Bar (You Pay vs You Save vs Tax) and Waterfall Deduction Flow.
  * Actions: Copy Summary, Shareable URL with query parameter sync, Print receipt.
- **Page** (`src/app/discount-calculator/`):
  * Title 46 chars (`Discount Calculator – Percent Off & Sale Price` with `absoluteTitle`), meta 152 chars, H1 67 chars, ~1,850 original words.
  * Direct BLUF box computing live numbers from engine.
  * 11 H2 content sections matching SPEC §8 and 11 FAQs with WebApplication + FAQPage JSON-LD schema, HowWeCalculate component.
  * Sourced metrology and consumer protection citations: US FTC Guides Against Deceptive Pricing (16 CFR Part 233) and UK Price Marking Order 2004 (SI 2004/102).
  * FAQ answers formatted with pure white background cards (`#ffffff`).
  * Registered in `routes.ts`, `tools-catalog.ts` (#46, category `business`, icon `discount`), `tools-catalog.test.ts` updated to 46, `calculation-methods.ts`, `Footer.tsx`, and `ToolArt.tsx` (`discount` art). Inbound contextual links from `markup-calculator`, `profit-margin-calculator`, `unit-price-calculator`, and `percentage-change-calculator`.
- **Verification**: `npm run verify` passed all 6 steps with zero errors. 676 vitest tests passing across 50 files. 81 static pages generated in export. Knowledge graph updated via `graphify update .`.

---

### [Design & UI — FAQ Answer Pure White Background Fix] — 2026-11-18
- **User Feedback Addressed**: Fixed FAQ question & answer card styling across the site where answer sections lacked an explicit white background and rendered directly on the warm beige canvas (`--bg: #EBE4D6`).
- **Files Updated**:
  * `src/components/ui/Faq.module.css`: Set `.details` background to `#ffffff`, `<summary>` to subtle header `var(--surface-2, #f8fafc)` with bottom border on open, and `.answer` to explicit `background: #ffffff;`.
  * `src/app/hourly-to-salary-calculator/page.module.css`: Converted FAQ list into crisp card layout with `.faqItem` (`background: #ffffff`, border, radius 12px, shadow), `.faqQuestion` header bar (`background: var(--surface-2, #f8fafc)`), and `.faqAnswer` (`background: #ffffff`, padding 16px 20px).
  * `src/app/unit-price-calculator/page.module.css`: Converted FAQ list into crisp card layout with `.faqItem` (`background: #ffffff`), `.faqQuestion` header bar (`#f8fafc`), and `.faqAnswer` (`background: #ffffff`).
  * `src/app/markup-calculator/page.module.css`: Added card styling to `.faqItem` (`background: #ffffff`), `.faqQ` header bar (`#f8fafc`), and `.faqA` (`background: #ffffff`).
  * `src/app/profit-margin-calculator/page.module.css`: Added card styling to `.faqItem` (`background: #ffffff`), `.faqQ` header bar (`#f8fafc`), and `.faqA` (`background: #ffffff`).
  * `src/app/percentage-change-calculator/page.module.css`: Added explicit `background: #ffffff;` to `.faqAnswer` and updated `.faqItem` shadow and radius.
  * `src/app/roof-replacement-cost-calculator/page.module.css`: Converted FAQ list to modern card layout with header bar and `.faqAnswer` (`background: #ffffff`).
  * `src/app/tile-calculator/page.module.css`: Converted FAQ list to modern card layout with header bar and `.faqAnswer` (`background: #ffffff`).
  * `src/app/laminate-flooring-calculator/page.module.css`: Converted FAQ list to modern card layout with header bar and `.faqAnswer` (`background: #ffffff`).
  * `src/app/concrete-calculator/page.module.css`, `src/app/carpet-cost-calculator/page.module.css`, `src/app/deck-cost-calculator/page.module.css`, `src/app/stone-calculator/page.module.css`: Explicit `background: #ffffff;` added to `.faqItem` and `.faqAnswer` / `.faqA`.
- **Verification**: `npm run verify` passed all 6 steps. All vitest tests passing (659 tests), 0 lint errors, no-network clean, SEO audit clean.

---

### [Tool #45 — Hourly to Salary Calculator] — 2026-11-18
- New tool `/hourly-to-salary-calculator/` (Batch 3 Build Order 5), built end-to-end from `04_Hourly_to_Salary_Calculator_BUILD_SPEC.md` and competitor analysis.
- **Engine** (`src/lib/wage-engine.ts`):
  * Pure functions: `calculateWage(input)` (converts any period across all 8 frequencies: hour, day, week, biweek, semi-month, month, quarter, year; handles custom hours/week, variable daily schedule Mon–Sun, paid vs unpaid time off, and overtime with FLSA multipliers), `compareWages(input)` (compares baseline against offer B or raise %), `generateWageTable(hoursPerWeek, weeksPerYear)` (generates $10 to $100/hr reference table).
- **Tests** (`src/lib/wage-engine.test.ts`):
  * 11 Vitest unit tests covering full-time $25/hr = $52,000 annual gross, reverse salary to hourly, biweekly (26 paychecks) vs semi-monthly (24 paychecks) differentiation, paid leave preserving salary while raising effective worked hourly rate, unpaid days docking annual gross, overtime 1.5× compounding, variable daily schedules, international presets, raise %, and wage table generator.
- **UI** (`src/components/tool/hourly-to-salary-calculator/`):
  * 3 tabs:
    1. **Convert (Hourly ↔ Salary)**: 8 pay frequencies, schedule presets (US 40h, UK 37.5h, AU 38h, India 48h, Part-time 20h), variable daily schedule input, time off and overtime accordions, hero annual gross card, 8-period table, and tax notices with official links.
    2. **Job Offer & Raise Comparison**: Compares current baseline vs second offer or percentage raise with annual, monthly, and hourly difference metrics.
    3. **Wage Table ($10–$100)**: Search-filterable interactive table with anchor links `#hourly-25`.
  * Dedicated interactive SVG diagram (`WageDiagram.tsx`) toggling between Paycheck Frequencies (Monthly, Semi-Monthly, Biweekly, Weekly) and Annual Hours Breakdown (hours on the clock vs paid leave vs overtime).
  * Actions: Copy summary/table, Shareable URL with query parameter sync, Print breakdown.
- **Page** (`src/app/hourly-to-salary-calculator/`):
  * Title 55 chars (`Hourly to Salary Calculator – Yearly Wage & Monthly Pay` with `absoluteTitle`), meta 151 chars, H1 57 chars, ~1,900 original words.
  * Direct BLUF box computing live numbers from engine.
  * 11 H2 content sections matching BUILD SPEC §5 and 11 FAQs matching SPEC §6 with WebApplication + FAQPage JSON-LD schema, HowWeCalculate component.
  * Sourced metrology and labor citations: US DOL FLSA (dol.gov), US OPM 2,087-hour divisor (opm.gov), UK Working Time Regulations 1998, and official IRS/GOV.UK tax links.
  * Registered in `routes.ts`, `tools-catalog.ts` (#45, category `business`, icon `wage`), `tools-catalog.test.ts` updated to 45, `calculation-methods.ts`, `Footer.tsx`, and `ToolArt.tsx`. Inbound contextual links from `percentage-change-calculator`, `unit-price-calculator`, and `construction-estimate-template`.
- **Verification**: `npm run verify` passed all 6 steps with zero errors. 659 vitest tests passing across 49 files. 80 static pages generated in export. Knowledge graph updated via `graphify update .`.

---

### [Tool #44 — Unit Price Calculator] — 2026-11-18
- New tool `/unit-price-calculator/` (Batch 3 Build Order 4), built end-to-end from `05_Unit_Price_Calculator_BUILD_SPEC.md` and competitor analysis.
- **Engine** (`src/lib/unit-price-engine.ts`):
  * Pure functions: `toBaseQuantity(qty, unit)` & `fromBaseQuantity(baseQty, unit)` applying exact NIST Handbook 130 / SP 811 conversions (Weight: oz, lb, g, kg; Volume: fl oz, cup, pt, qt, gal, ml, L; Count: item, sheet, roll, load, pc), `applyDeal(price, deal)` (handles percentage off, dollar coupon, Buy X Get Y Free BOGO per-unit amortisation, and X for $Y multi-buy bundles), `compareUnitPrices(items, outputUnit, targetQuantity)` (ranks items from cheapest, detects mismatched measurement groups, calculates unit savings and % premium over cheapest, and solves quantity-to-buy pack counts and total purchase costs), `calculateShrinkflation(input)` (calculates package physical size reduction % vs true hidden unit price inflation % and generates plain-English summary), and `calculateSellerUnitCost(input)` (computes manufacturing cost per finished unit and statutory retail shelf tags per kg/L and per 100g/ml).
- **Tests** (`src/lib/unit-price-engine.test.ts`):
  * 11 Vitest unit tests covering NIST exact conversions (1 lb = 16 oz = 453.59237 g, 1 gal = 128 fl oz), multi-pack comparison (6 × 330 ml vs 2 L bottle), deal mathematics (20% off, $1 coupon, BOGO halves effective price, 3 for $5), mismatched group warnings (weight vs volume), zero price/size validation (no NaN or Infinity), shrinkflation hidden inflation (10% smaller at same price = 11.11% price hike), and quantity-to-buy solver.
- **UI** (`src/components/tool/unit-price-calculator/`):
  * 3 tabs:
    1. **Compare Products**: 2 to 6 product rows (default 3 rows), deal accordion per row, group-aware output unit dropdown (per oz, lb, kg, L, item), optional quantity needed solver, and ranked table with cheapest badge.
    2. **Shrinkflation Check**: Compares original and downsized package specs, displaying physical size drop % alongside hidden price rise %.
    3. **Seller Cost & Shelf Tag**: Calculates unit production cost from batch expenses and generates statutory shelf-tag prices per kg/L and per 100g/ml with direct deep link to the Markup Calculator.
  * Dedicated interactive SVG diagram (`UnitPriceDiagram.tsx`) supporting comparative price bars and yield per dollar views in Compare mode, and a visual package downsizing comparison in Shrinkflation mode.
  * Actions: Copy Table/Summary to clipboard, Shareable URL with query parameter synchronisation, and Print sheet.
- **Page** (`src/app/unit-price-calculator/`):
  * Title 53 chars (`Unit Price Calculator – Price per Ounce, Pound & Item` with `absoluteTitle`), meta 157 chars, H1 62 chars, ~1,850 original words.
  * Direct BLUF summary box with live engine computations.
  * 10 H2 content sections matching BUILD SPEC §5 and 10 FAQs matching SPEC §6 with WebApplication + FAQPage JSON-LD schema, HowWeCalculate component.
  * Metrology & statutory law citations: NIST Handbook 130, UK Price Marking Order 2004 (SI 2004/102), and EU Directive 98/6/EC.
  * Registered in `routes.ts`, `tools-catalog.ts` (#44, category `business`, icon `unitPrice`), `tools-catalog.test.ts` updated to 44, `calculation-methods.ts`, `Footer.tsx`, and `ToolArt.tsx`. Inbound contextual links from `markup-calculator`, `profit-margin-calculator`, and `percentage-change-calculator`.
- **Verification**: `npm run verify` passed all 6 steps with zero errors. 648 vitest tests passing across 48 files. 79 static pages generated in export. Knowledge graph updated via `graphify update .`.

---

### [Tool #43 — Profit Margin Calculator] — 2026-11-18
- New tool `/profit-margin-calculator/` (Batch 3 Build Order 3), built end-to-end from `03_Profit_Margin_Calculator_BUILD_SPEC.md` and competitor analysis.
- **Engine** (`src/lib/margin-engine.ts`):
  * Pure functions: `calculateGrossMargin(input)` (handles revenue, COGS, gross profit, gross margin %, markup %, multiplier, units sold, and negative margin detection), `calculatePnL(input)` (gross sales, returns/discounts, net revenue, COGS, gross profit, OPEX [rent, salaries, marketing], operating profit EBIT, D&A, EBITDA, interest, taxes, net profit, and 7-step P&L waterfall structure), `priceForTargetMargin(cost, targetMargin, feePercent)` (calculates required ticket price with gross-up fee protection), and `calculateProductMix(items)` (computes multi-product revenue share, individual margins, and weighted blended portfolio margin).
- **Tests** (`src/lib/margin-engine.test.ts`):
  * 9 Vitest unit tests covering retail gross margin ($100/$60 = 40%), per-unit volume breakdown, zero revenue null handling, negative margin detection on clearance loss, full 7-step P&L cascade with OPEX/EBITDA/tax, target margin pricing with platform fees, and mathematical proof that blended margin is weighted by revenue and strictly not the simple arithmetic average of margins.
- **UI** (`src/components/tool/profit-margin-calculator/`):
  * 4 modes: Gross Profit Margin, Full P&L (Gross, Operating, Net), Price for Target Margin, and Product Mix & Blended Margin.
  * Dedicated interactive SVG diagram (`MarginDiagram.tsx`) with toggle between "P&L Waterfall" (revenue → COGS → gross → OPEX → net profit) and "Margin Tiers" (comparative gross, operating, and net margin retention bars).
  * Presets for Standard Retail (40%), Software/SaaS (60%), Grocery/Volume (15%), currency switcher ($ / £ / € / ₹), copy summary, share URL with query params, print sheet, and warning callout on blended margin vs simple averages.
- **Page** (`src/app/profit-margin-calculator/`):
  * Title 49 chars (`Profit Margin Calculator – Gross, Net & Operating` with `absoluteTitle`), meta 155 chars, H1 57 chars, ~2,200 original words.
  * Direct BLUF intro with live dynamic engine values.
  * Primary keyword `gross margin calculator` placed in intro, H2, and tool heading.
  * 11 H2 content sections matching SPEC §5 and 11 FAQs matching SPEC §6 with WebApplication + FAQPage JSON-LD schema, HowWeCalculate component.
  * Academic dataset benchmark citations: NYU Stern School of Business (Damodaran US margins by sector), FASB, and HMRC.
  * Registered in `routes.ts`, `tools-catalog.ts` (#43, category `business`, icon `margin`), `tools-catalog.test.ts` updated to 43, `calculation-methods.ts`, `Footer.tsx`, and `ToolArt.tsx`. Inbound contextual links from `markup-calculator` and `percentage-change-calculator`.
- **Verification**: `npm run verify` passed all 6 steps with zero errors. 637 vitest tests passing across 47 files. 78 static pages generated in export. Knowledge graph updated via `graphify update .`.

---

### [Tool #42 — Markup Calculator] — 2026-11-18
- New tool `/markup-calculator/` (Batch 3 Build Order 2), built end-to-end from `02_Markup_Calculator_BUILD_SPEC.md` and competitor analysis.
- **Engine** (`src/lib/pricing-engine.ts`):
  * Pure functions: `priceFromMarkup(cost, markupPercent)`, `markupFromPrice(cost, price)`, `costFromPrice(price, markupPercent)`, `priceFromMargin(cost, marginPercent)`, `marginFromPrice(cost, price)`, `marginFromMarkup(m)`, `markupFromMargin(g)`, `multiplier(cost, price)`, `calculateLandedCost(input)` (handles shipping, packaging, and gross-up platform/card fee % on selling price), `addTax(price, rate)` & `stripTax(priceInc, rate)`, `roundPriceEnding(price, ending, cost)` (rounds to .99, .95, .49, whole dollar, nearest 5 with constraint never dropping below cost and recomputes actual margin/markup), `calculatePriceChain(initialCost, tiers)` (3-tier Maker → Wholesaler → Retailer sequential markup compounding), `calculateProductList(rows, defaultMarkup)`, and `parsePastedSpreadsheet(text)` (TSV/CSV parser).
- **Tests** (`src/lib/pricing-engine.test.ts`):
  * 20 Vitest unit tests covering 4-way linked solve (cost 40, markup 50% → price 60, profit 20, margin 33.33%), keystone 100% markup = 50% margin = 2.0× multiplier, fee-adjusted pricing formula, margin fee boundary check, tax add/strip round-trips, price endings with cost floor protection, 3-tier price chain compounding (8× total keystone chain), spreadsheet parsing, and reference table generator.
- **UI** (`src/components/tool/markup-calculator/`):
  * 5 modes: Cost & Markup %, Cost & Target Margin %, Cost & Selling Price, Target Price to Max Cost (reverse), and Multi-Item Spreadsheet mode.
  * Dedicated interactive SVG diagram (`MarkupDiagram.tsx`) with toggle between "Price Stack & Margin Flow" (stacked cost + profit bar with markup/margin badges) and "3-Tier Distribution Chain" (Factory → Wholesaler → Retailer compounding flow).
  * 4 modular accordions:
    1. Landed Cost & Marketplace Fees (shipping + packaging + % fee on selling price).
    2. Psychological Price Endings (.99, .95, .49, whole dollar, nearest $5) with live recalculated margin.
    3. Sales Tax / VAT / GST with presets for UK VAT (20%), AU GST (10%), NZ GST (15%), US state average (7%), and ex-tax vs inc-tax toggle.
    4. 3-Tier Distribution Chain with custom markups and tabular margin breakdown.
  * Presets for Keystone (100%), Retail Standard (50%), Wholesale (30%), Boutique (200%), currency switcher ($ / £ / € / ₹), copy summary, share URL with query params, print sheet, and batch CSV export.
- **Page** (`src/app/markup-calculator/`):
  * Title 50 chars (`Markup Calculator – Selling Price, Markup & Margin` with `absoluteTitle`), meta 155 chars, H1 49 chars, ~2,250 original words.
  * Direct BLUF intro computing live numbers from engine.
  * 11 H2 content sections matching SPEC §5 and 11 FAQs matching SPEC §6 with WebApplication + FAQPage JSON-LD schema, HowWeCalculate component.
  * Registered in `routes.ts`, `tools-catalog.ts` (#42, category `business`, icon `tag`), `tools-catalog.test.ts` updated to 42, `calculation-methods.ts`, `Footer.tsx`, and `ToolArt.tsx`. Inbound contextual links from `construction-estimate-template` and `percentage-change-calculator`.
- **Verification**: `npm run verify` passed all 6 steps with zero errors. 628 vitest tests passing across 46 files. 77 static pages generated in export. Knowledge graph updated via `graphify update .`.

---

### [Tool #41 — Percentage Change Calculator] — 2026-11-18
- New tool `/percentage-change-calculator/` (Batch 3 Build Order 5), built end-to-end from `01_Percentage_Change_Calculator_BUILD_SPEC.md` and competitor analysis.
- **Engine** (`src/lib/percent-engine.ts`):
  * Pure functions: `pctChange(oldVal, newVal)` (signed, handling zero-division with null and -0 normalization), `pctDifference(a, b)` (symmetric with average denominator), `applyPct(x, p)` (increase/decrease by %), `reversePct(newVal, p)` (finding original before percentage), `pctOf(p, y)`, `whatPct(x, y)`, `ppDifference(a, b)` (percentage points difference alongside relative percentage change), `listChanges(pairs)` (batch row changes, arithmetic average of percentages, and true aggregate portfolio change), `excelFormula(mode, cells)` (dynamic copyable spreadsheet formulas with custom cell references).
- **Tests** (`src/lib/percent-engine.test.ts`):
  * 27 Vitest unit tests covering 80→100 (+25%), 100→80 (−20% asymmetry), 0-start division by zero null handling, negative start handling with `|old|` denominator, symmetric difference order invariance (22.22%), reverse percentages, percentage points (4%→5% = +1 pp vs +25% relative change), list aggregation proving average of % changes ≠ total aggregate % change, Excel formula string generation with custom cells, and formatting utilities.
- **UI** (`src/components/tool/percentage-change-calculator/`):
  * 8 distinct modes accessed via responsive horizontal tab bar (`#change`, `#difference`, `#increase-decrease`, `#find-original`, `#pct-of`, `#what-pct`, `#percentage-points`, `#list`) with URL hash persistence.
  * Aligned strictly with KKCTools design system:
    - 28px circular numbered step badges in card headers.
    - All numeric inputs wrapped in `.inputWrap` with trailing `.unitBadge` pills (`Base`, `New`, `Amount`, `%`, `Part`, `Whole`).
    - Signature radiant cobalt blue hero banner (`linear-gradient(135deg, #0369a1 0%, #075985 100%)`) with direction badges (Increase/Decrease), absolute deltas, and 3-metric subgrids.
    - Plain-English snippet sentence for Google featured snippets under every result.
    - Step-by-step math breakdown with user's actual numbers.
    - CSS-only proportional visual comparison bar (`VisualPercentBar.tsx`).
    - Interactive Excel & Google Sheets formula generator with editable cell inputs and one-click copy button.
    - List mode with dynamic add/remove rows and aggregate vs average explanation.
    - Share URL (encoded state), Print, and Quick Preset chips.
- **Page** (`src/app/percentage-change-calculator/`):
  * 2,100+ words of original copy, title 50 chars (`Percentage Change Calculator – Increase & Decrease` with `absoluteTitle`), meta 154 chars, H1 62 chars.
  * Direct BLUF intro (50–60 words) computing figures dynamically via the engine.
  * 10 structured sections covering manual calculation, formula anatomy, mathematical asymmetry, symmetric difference, multiplier shortcuts, reverse percentages, spreadsheet formulas & formatting pitfalls, percent vs percentage points, boundary edge cases (0, negatives, >100%), and 12 FAQ items matching SPEC §6.
  * Registered in `routes.ts`, `tools-catalog.ts` (#41, category `business`, icon `percent`), `tools-catalog.test.ts` updated to 41, `calculation-methods.ts`, `Footer.tsx`, and `ToolArt.tsx`. Inbound contextual links from `construction-estimate-template`.
- **Verification**: `npm run verify` passed all 6 steps with zero errors. 608 vitest tests passing across 45 files. 76 static pages generated in export.

---

### [Review — Batch 2 tools #17–#19 price and content fixes] — 2026-11-17
- Deck engine: pressure-treated and cedar decking material ranges and wood/composite railing rates now match the Fixr deck cost guide (checked 2026-11-17). The old values didn't match the source they cited.
- Roof and Deck "How we calculate" values now equal the engine defaults (architectural $500/sq = $195 material + $305 labour, tear-off $200/sq per layer, dumpster $475, decking $80/sheet).
- Roof page tear-off text ($125 → $200/sq, $100–$300) and Deck FAQ railing/PT figures now match the engine.
- Header "New:" pill now shows the most recently added tool instead of the first catalog entry.
- `npm run verify`: all 6 steps pass.

### [Tool #38 — Deck Cost Calculator] — 2026-11-17
- New flagship page `/deck-cost-calculator/` (Batch 2 Tier 3 #18), built end-to-end exactly from `18_Deck_Cost_Calculator_BUILD_SPEC.md` and competitor analysis.
- **Engine** (`src/lib/deck-cost-engine.ts`):
  * 4 project modes: New deck, Resurface (re-decking sound existing framing), Full replacement (demo + new), and Repairs.
  * Structural framing takeoff: joist count by spacing (12", 16", 24" o.c.) & rim joists, doubled/tripled beam rows, 4x4/6x6 posts, and pier footings.
  * Concrete footing calculations: cylinder volume formula with frost-depth scaling, cubic yards, and 80 lb QUIKRETE #1101 bag yield via `concrete-engine.ts`.
  * Decking board takeoff: 5.5" / 3.5" boards, stock lengths (12', 16', 20'), pattern waste (straight 10%, diagonal 15%, herringbone 20%), and picture-frame border perimeter.
  * Fastener takeoff: face screws (2/crossing) vs hidden clips (1/crossing) with box counts.
  * Railing (exposed perimeter minus house ledger and stair opening) and stairs (risers, treads, 2x12 stringers at 16" o.c.).
  * 7 materials: Pressure-Treated Pine, Western Red Cedar, California Redwood, Basic Composite, 4-Sided Capped Composite, Cellular PVC, and Tropical Ipe Hardwood.
  * Height band labor multipliers (ground 1.0×, low 1.1×, mid 1.25×, elevated 1.45×), regional multiplier, contingency %, contractor quote verifier, 25-yr lifetime cost comparison, and printable Bill of Materials (BOM).
- **Tests** (`src/lib/deck-cost-engine.test.ts`): 15 Vitest unit tests covering 12x12 16" o.c. joists hand calculation, row count pitch, diagonal waste, picture frame border, footing concrete volume & QUIKRETE bags, railing perimeter exclusions, resurface vs replace mode logic, height multipliers on labor only, DIY savings, zero dimensions, benchmark tables, lifetime comparison, quote verifier, and BOM categories.
- **UI** (`src/components/tool/deck-cost-calculator/`):
  * Aligned strictly with KKCTools design tokens and visual architecture:
    - 28px circular numbered step badges (`1` to `6`) in card headers.
    - All numeric inputs wrapped in `.inputWrap` with trailing `.unitBadge` pills (`ft`, `in`, `steps`, `$/sq ft`, `$/LF`, `in`).
    - Signature radiant cobalt blue hero banner (`linear-gradient(135deg, #0369a1 0%, #075985 100%)`) with total price, range, and 3-column subgrid metrics.
    - Interactive SVG `DeckDiagram` with toggleable views: "Decking & Railing" vs "Joists & Footings".
    - Structured `.breakdownTable` with itemized line items.
    - Printable Bill of Materials (BOM) table.
    - Contractor quote verifier card and 25-yr wood vs composite comparison table.
    - Copy summary, Print BOM, and 5-currency switcher.
- **Page** (`src/app/deck-cost-calculator/`): 4,200+ words of thorough original copy, title 52 chars, meta 154 chars, H1 33 chars, 12 FAQs matching SPEC §6 with live calculated figures, benchmark size table (10x10 to 20x20), 7-material cost matrix, BLS carpenter labor economics, substructure budget breakdown, wood vs composite vs PVC guide, 4-point structural safety inspection checklist for resurfacing, board spacing & gap recommendations table, IRC code compliance guide, HowWeCalculate component.
- **Wiring & Inbound Links**: Registered in `routes.ts`, `tools-catalog.ts` (#40, category `framing`, icon `deck`), `tools-catalog.test.ts` updated to 40, footer link added under "Framing & Finishes", calculation-methods entry added, inbound contextual links added from `deck-stain-calculator`, `fence-cost-calculator`, `concrete-calculator`, `linear-foot-calculator`, and `stud-calculator`.
- **Verification**: `npm run verify` passed all 6 steps (lint, tests, check:no-network, build, seo:audit, docs:bundle) with zero errors. 581 unit tests passing across 44 files.

---

### [Tool #37 — Carpet Cost Calculator] — 2026-11-17
- New flagship page `/carpet-cost-calculator/` (Batch 2 Tier 3 #17), built end-to-end exactly from `17_Carpet_Cost_Calculator_BUILD_SPEC.md` and competitor analysis.
- **Engine** (`src/lib/carpet-engine.ts`): Pure mathematical takeoff for multi-room roll layout (12 ft, 13.5 ft, 15 ft) testing both orientations and minimizing purchased carpet square footage; seam calculation and off-cut waste %; stairs runner geometry (13 standard steps, tread depth, riser height, nosing wrap, landing, waterfall vs box/cap & band); 3 material grades (builder, mid, premium), 5 fibres (nylon, polyester, triexta, olefin, wool), 5 styles (plush, berber, frieze, pattern, carpet tiles); padding specifications (6 lb, 8 lb, 10 lb) per CRI standards; itemized labour and extras (removal, disposal, furniture, tack strips, transitions, subfloor leveling, doors); room benchmarks (10x10 to whole house); contractor quote verifier; flooring comparisons (carpet vs LVP vs laminate vs hardwood refinish).
- **Tests** (`src/lib/carpet-engine.test.ts`): 16 Vitest unit tests covering 12x12 1-drop 0-seams baseline, 14x16 orientation optimization, boundary tests (12.0 vs 12.01 ft), stairs hand calculations, replace vs new mode toggles, carpet tiles mode, edge cases, quote checker, and price sanity checks.
- **UI Aligned to KKCTools Design System** (`src/components/tool/carpet-cost-calculator/`): Fully aligned with KKCTools design tokens and visual architecture:
  - Added standard 28px circular numbered step badges (`.cardHead > .step`, steps 1 through 6).
  - Encapsulated all numeric inputs in `.inputWrap` with trailing `.unitBadge` pills (`ft`, `in`, `steps`, `$/sq ft`, `$/sq yd`, `%`).
  - Implemented signature radiant cobalt blue hero banner (`linear-gradient(135deg, #0369a1 0%, #075985 100%)` with white value `$1,240.96`, `#bae6fd` subheadings, and 3-metric subgrid for unit rates and area).
  - Converted loose tiles to structured `.breakdownTable` with itemized materials/pad/labor/stairs/prep lines.
  - Interactive SVG `CarpetDiagram` showing room boundary, roll drops, heat-tape seams, off-cut waste, and stair runner profile.
  - Contractor quote verifier, flooring comparison table, regional index slider, and copy/print/share actions.
- **Page** (`src/app/carpet-cost-calculator/`): 3,858 words of thorough original copy, title 56 chars, meta 156 chars, H1 25 chars, 12 FAQs matching SPEC §6 with live figures, room size benchmark matrix, roll width constraint guide, stairs style table, fibre & style matrices, HowWeCalculate component.
- **Wiring & Inbound Links**: Registered in `routes.ts`, `tools-catalog.ts` (#39, category `finishes`, icon `carpetRoll`), `tools-catalog.test.ts` updated to 39, footer link added under "Framing & Finishes", calculation-methods entry added, inbound contextual links added from `laminate-flooring-calculator`, `floor-refinishing-cost-calculator`, `square-footage-calculator`, and `tile-calculator`.
- **Verification**: `npm run verify` passed all 6 steps (lint, tests, check:no-network, build, seo:audit, docs:bundle) with zero errors. 566 unit tests passing across 43 files.

---

### [New Tools Priority & Directory Sorting] — 2026-11-17
- Implemented global newest-first sorting and quick-discovery across KKCTools:
  - **Single Source of Truth (`src/lib/tools-catalog.ts`):** `TOOLS_CATALOG` is now sorted by `added` date descending (latest first, e.g., 2026-11-17 -> 2026-11-08), with `isNew` priority and alphabetical tie-breaker.
  - **Tools Directory (`/tools/`):** Added a dynamic sort selector with "Newest First" as the default, alongside "Name (A-Z)" and "By Category". Added a dedicated "✨ New Tools (17)" quick filter pill next to trade category pills.
  - **Home Page (`/`):** "Recently Built & Updated Tools" showcase and category bands surface the freshest tools at the front of each collection.
  - **Header & Mobile Navigation:** Header mega-menu category columns show the 5 newest tools per trade; mega-menu highlight dynamically links to the newest tool (`TOOLS_CATALOG[0]`); Mobile menu shows dynamic tool count (`All 38 Tools Directory`) and newest tools in accordions.
  - **Tests:** Added `src/lib/tools-catalog.test.ts` monotonic date test asserting newest tool is at index 0 (`/roof-replacement-cost-calculator/`) and oldest tools are at the end. All 549 unit tests pass.

---

### [Tool #36 — Roof Replacement Cost Calculator] — 2026-11-17
- New flagship page `/roof-replacement-cost-calculator/` (Batch 2 Tier 3 #19), built end-to-end exactly from `19_Roof_Replacement_Cost_Calculator_BUILD_SPEC.md` and competitor analysis.
- **Engine** (`src/lib/roof-replacement-engine.ts`): Reuses verified pitch geometry from `shingle-engine` (`pitchFactor`), multi-plane sections or direct ground footprint entry, 10 material classes (3-tab, architectural, luxury/designer, standing seam, corrugated metal, clay tile, concrete tile, natural slate, cedar shake, flat membrane), labor multipliers (stories 1/1.5/2/3, steep-slope ≥ 8/12 pitch +20%, complexity simple/hip/complex), tear-off scaling by layer ($125/sq/layer), dumpster fees ($450), decking repair sheets, accessories (synthetic vs felt underlayment, ice & water shield, drip edge, ridge vent, pipe boots/chimney flashing, gutters), 3-way comparison (spot repair vs overlay vs full replacement with IRC Section R908.3.1.1 2-layer code prohibition), and contractor quote verifier.
- **Tests** (`src/lib/roof-replacement-engine.test.ts`): 17 Vitest unit tests covering pitch geometry, 2,000 sq ft hand calculation verification, linear tear-off scaling, 2-layer overlay code block, decking sheet calculations, stories/steep multipliers on labour only, shared pricing checks with metal-roof engine, quote checker, and snapshot table integrity.
- **UI** (`src/components/tool/roof-replacement-cost-calculator/`): Quick and Detailed modes, pitch preset buttons (3/12 through 12/12) + custom input, material selector with descriptions, tear-off layer buttons (0, 1, 2) with warning banner, stories, complexity, decking % input, accessories checkboxes, region index, custom price overrides accordion; hero result with total, range, cost/sq, cost/sq ft, labor/sq; interactive SVG pitch diagram and cross-section diagram; itemized line-items table; 3-way comparison cards with visual bar chart; contractor quote verifier; share URL, print, copy summary.
- **Page** (`src/app/roof-replacement-cost-calculator/`): 4,101 words, title 53 chars, meta 156 chars, H1 32 chars, 12 FAQs matching SPEC §6 with live calculated figures from engine, benchmark size table (1,000–3,000 sq ft), 10-material comparison matrix, pitch multiplier table, components guide, flat/commercial section, insurance/permits advice, contractor quote comparison tips, HowWeCalculate component.
- **Wiring & Inbound Links**: Registered in `routes.ts`, `tools-catalog.ts` (#38, category `framing`, icon `roofTruss`), `tools-catalog.test.ts` updated to 38, footer link added under "Framing & Finishes", calculation-methods entry added, inbound contextual links added from `shingle-calculator`, `metal-roof-cost-calculator`, `rafter-calculator`, and `square-footage-calculator`.
- **Verification**: `npm run verify` passed all 6 steps (lint, tests, check:no-network, build, seo:audit, docs:bundle) with zero errors. 549 unit tests passing across 42 files.

### [CueAudit action implementation] — 2026-11-16
- Implemented and verified code-level recommendations from `docs/seo/CUE - new audit/CueAudit_Action_Report.md`:
  - **P0-3 Privacy & analytics accuracy:** Removed all misleading "zero tracking" claims (`construction-estimate.ts`, `site.ts`, `band-name-generator/page.tsx`); updated copy to accurately describe browser execution + Google Analytics visit metrics.
  - **P0-4 Legal wording on band guides:** Updated `content/guides/how-to-check-if-a-band-name-is-taken.md` and routes registry with trademark attorney guidance and clear common-law disclaimers.
  - **P0-5 Softened absolute claims:** Replaced "accurately calculate" and "exact area" across 7 pages; added official ANSI Z765 appraisal disclaimer to Square Footage GLA section.
  - **P0-6 Mobile 390px enhancements:** Added `inputMode="decimal"` and `inputMode="numeric"` to all numeric inputs on key tools (Linear Foot, Brick, Tile); added compact mobile media queries to `FloatingPill.module.css`.
  - **P1-2 Topical hubs:** Implemented natural in-body contextual links across all 5 topic clusters (Measuring, Concrete & Masonry, Finishes, Roofing, Estimating).
  - **P1-3 BLUF direct answers:** Added immediate formula & worked example answers directly under H1 heroes for Square Footage, Linear Foot, Paint, Tile, Cinder Block, and Cubic Yard.
  - **P1-4 Pricing benchmarks:** Added explicit "Prices are typical US ranges, checked November 2026 (enter your local price)" notes on all 9 cost estimator pages.
  - **P1-6 GSC query mapping:** Integrated high-opportunity search terms into on-page headings and body copy (Paint, Linear Foot, Tile, Square Footage).
- Verification: 532 Vitest unit tests passing, `npm run verify` passed all 6 steps with 0 SEO errors.

### [Band Name Generator improvements] — 2026-11-15
- Fixed a generator bug that left `{Noun}` placeholders in names whose pattern used the same slot twice; joining words now stay lower-case; removed a slur from the punk word list and widened the offensive filter.
- Added a "How these names are built" panel and a formula label on every result.
- Page: new title/meta, last-updated line, 80 tested band name ideas by genre, two new FAQs, cleaner wording, relevant sidebar links.
- New tests: generator slot filling and title case; band name ideas vs blocklist/offensive filter.

### [Calculator diagrams] — 2026-11-15
- Added a large, live "how it is calculated" diagram inside the input area of 17 calculators that had none, plus a result meter in the cubic yard calculator.
- New shared components (`src/components/tool/shared/`): `AreaDepthDiagram`, `StepFrame`/`StepsList`, `PaverJointDiagram`, `ConversionDiagram`, `WallDiagram`; tool-specific diagrams for fence stain, laminate, linear foot, paint, square footage, stud and tile.
- Responsive: drawing and steps sit side by side on wide containers and stack on narrow ones (container query at 540 px).
- `npm run verify` passed; accessibility 100 on all affected pages.

### [Tool #35 — Cubic Inch & Engine Displacement Calculator] — 2026-11-15
- New page `/cubic-inch-calculator/` (Batch 2 Tier 3 #16), built from `16_Cubic_Inch_Engine_Displacement_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/cubic-inch-engine.ts`): box, cylinder, tube (wall and inside capacity) and sphere volume; exact unit conversions; displacement = π/4 × bore² × stroke × cylinders; bore/stroke solvers; overbore and stroker what-if; CID chart; 6 presets with manufacturer-published bore and stroke.
- UI with Volume / Engine modes, shape and cylinder-cutaway diagrams, working shown, share links. Page ~1,700 words with 10 FAQs; title 64 chars incl. brand (blueprint title shortened).
- 17 new tests (528 total); `npm run verify` all passed.

### [Tool #34 — Hardwood Floor Refinishing Cost Calculator] — 2026-11-15
- New page `/floor-refinishing-cost-calculator/` (Batch 2 Tier 2 #15), built from `15_Hardwood_Floor_Refinishing_Cost_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/floor-refinish-engine.ts`): screen & recoat $1.50, full sand $4.25, dustless $6.50 per ft² (This Old House midpoints) × species factor for sanding; stain +$2; repairs, board replacement, subfloor, carpet, stairs ($35/step, Fixr), furniture, baseboards; region factor and minimum job charge; low/high from the published range ends; refinish vs replace ($12/ft² installed); DIY list (rentals, abrasives, finish and stain gallons at 500 ft²/gal, supplies).
- UI with rooms or total area, extras toggles, DIY card, quote checker, option bars, board cross-section and room plan diagrams. Page ~2,200 words with 10 FAQs; title 54 chars incl. brand.
- 19 new tests (511 total); `npm run verify` all passed.

### [Tool #33 — Bathroom Remodel Cost Calculator] — 2026-11-15
- New page `/bathroom-remodel-cost-calculator/` (Batch 2 Tier 2 #14), built from `14_Bathroom_Remodel_Cost_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/bathroom-remodel-engine.ts`): fixed items (toilet, vanity, top, faucets, electrical, plumbing, tub/shower) + per-ft² items (flooring, wall tile, paint, drywall) from This Old House’s Jul 2026 averages over a 70 ft² reference room; finish factors 0.575 / 1 / 1.881 from its finish table; cosmetic vs full scope; water heater, permit, region, 20% contingency; ±13% range; quote checker. Reproduces This Old House’s size and finish tables (tested).
- UI with editable line items, spend bar and bathroom plan; page with size × finish table, tub/shower options, budget scenarios, DIY, permits and resale notes, 10 FAQs; ~1,460 words. Title 64 chars incl. brand.
- 12 new tests (492 total); `npm run verify` all passed.

### [Tool #32 — Metal Roof Cost Calculator] — 2026-11-15
- New page `/metal-roof-cost-calculator/` (Batch 2 Tier 2 #13), built from `13_Metal_Roof_Cost_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/metal-roof-engine.ts`): roof area and edges from the Shingle engine's section geometry; metal total with tear-off and permit; asphalt tear-off-and-replace comparison; cost per year of life; panels per slope and length (gable/shed), total panel length on hips; trim and underlayment; low–high ranges.
- **Data:** HomeGuide 2026 installed ranges (midpoints) for standing seam, corrugated, metal shingles and asphalt; tear-off $1–$3; lifespans from This Old House and Fixr.
- UI with comparison bars, materials list, panel diagram and roof plan; page with cost-by-type and cost-by-size tables, standing seam and metal-vs-shingle sections (honest per-year comparison), measuring and tear-off guidance, 10 FAQs; ~1,610 words.
- 13 new tests (480 total); `npm run verify` all passed.

### [Tool #31 — Cubic Feet ↔ Square Feet Converter] — 2026-11-15
- New page `/cubic-feet-to-square-feet/` (Batch 2 Tier 2 #12), built from `12_Cubic_Feet_to_Square_Feet_Converter_Competitor_Analysis.md`.
- **Engine** (`src/lib/cubic-square-engine.ts`): area = volume ÷ depth and volume = area × depth with exact factors for in/ft/cm/mm/m, ft³/yd³/m³/L and ft²/m²/yd²; bags; coverage tables.
- UI: two-way with a Reverse button, volume or bag count, area or length × width, material presets (slab, mulch, topsoil, base, bedding sand, stone mulch) with sourced notes, working shown and a spread diagram.
- Page: short-answer box (“you need a depth”), worked examples (mulch bag, topsoil yard, slab, mulch bed, Purdue lawn check), coverage tables in imperial and metric, material depths, cft/brass section for India, 9 FAQs; ~1,340 words.
- 11 new tests (467 total); `npm run verify` all passed.

### [Tool #30 — Fence Cost Calculator] — 2026-11-15
- New page `/fence-cost-calculator/` (Batch 2 Tier 2 #11), built from `11_Fence_Cost_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/fence-cost-engine.ts`): fence sides with walk/double gates (gates split a side and add a post), shared corner posts and closed loops, terminal vs line posts, materials list by type (pickets + rails, panels, chain link fabric + top rail), concrete per post from hole and post size, slope surcharge, removal, permit, materials vs labour share, DIY cost and a low–high range from published prices.
- **Prices:** This Old House (Jun 2026) and HomeGuide 2026 per-foot ranges (midpoints as defaults), Angi/HomeGuide gate prices, Angi removal, QUIKRETE hole sizing; all editable.
- UI with live plan view (posts, corners, gate swings) and front view (post set in concrete); page with cost-by-material table, worked backyard example, concrete per post, replace, DIY vs pro, permits/811 and 12 FAQs; ~2,200 words.
- `--danger` token darkened to `#B91C1C` (remove buttons failed contrast).
- 15 new tests (456 total); `npm run verify` all passed.

### [Tool #29 — Deck Stain Calculator] — 2026-11-15
- New page `/deck-stain-calculator/` (Batch 2 Tier 1 #10), built from `10_Deck_Stain_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/deck-stain-engine.ts`): floor sections and optional board edges; railings quick (L × H × 2) or detailed (posts every N ft, rail perimeters, square or round balusters from width + gap); stairs (treads, risers, visible stringers); skirting; coverage by opacity × wood condition, second coat × factor, extra %; cheapest 5-gal/1-gal mix or 5/2.5/1 L tins; deck cleaner; DIY vs pro with wash/strip/sand prep.
- **Data:** BEHR PREMIUM coverage ranges (low end used), Duckback rough vs smooth, IRC R312 railing defaults, Fixr and Angi 2026 prices.
- UI with live isometric deck diagram and railing diagram; page with coverage-by-type, stain-by-deck-size and railing tables, worked example, 10 FAQs; ~2,290 words. Title 60 chars incl. brand.
- **Analytics:** GTM now loads on first interaction or 5 s after load (was 1.5 s) — mobile Lighthouse on tool pages 79–86 → 89–90.
- 23 new tests (441 total); `npm run verify` all passed.

### [Tool #28 — Concrete Slab Cost Calculator] — 2026-11-15
- New page `/concrete-slab-cost-calculator/` (Batch 2 Tier 1 #9), built from `09_Concrete_Slab_Cost_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/slab-cost-engine.ts`): itemised estimate — ready-mix by the yard (¼ yd³ rounding, trucks), short-load fee (per yard or flat, editable threshold), delivery, line/boom pump minimum, gravel base (15% compaction, 1.40 t/yd³), mesh or rebar, vapour barrier, forms, labour, coloured/stamped finish, sealer, removal, region factor, overhead & profit, permit; totals per ft² and per yard ordered; DIY bags vs DIY ready-mix vs contractor; check against 2026 published installed prices.
- **Prices:** every default is inside a dated 2026 published range (LawnStarter, Concrete Network/NRMCA, This Old House, Angi, HomeGuide, Inch Calculator) and editable; sources listed in "How This Calculator Works".
- UI: 6 project presets, several slabs, US/metric with price conversion, 7 currency symbols, psi presets, cost bar, comparison, truck and slab-section diagrams, copy / share / print.
- Page: price per yard by psi, cost per ft² by thickness, cost by size and by project, quote line items, worked 20 × 20 example, bags vs ready-mix vs contractor, saving tips, remove & replace, 13 FAQs + schema; ~2,760 words. Title shortened to 60 chars incl. brand (blueprint title was 66).
- Wiring: routes (48), catalog (30 tools), new `slabCost` icon and card diagram, footer. 26 new tests (418 total); `npm run verify` all passed; Lighthouse mobile 90 / 100 / 96 / 100, desktop 100 / 100 / 96 / 100.

### [Google Analytics via Google Tag Manager] — 2026-11-15
- Installed the owner's Google tag (`GTM-5CDW8CXG` → GA4 `G-DVNM8TFRQE`) in the root layout with Consent Mode v2 defaults: analytics cookies off in the EEA, UK and Switzerland; ad storage off everywhere.
- `gtm.js` is injected on first interaction or 1.5 s after `load` (in `<head>` it dropped mobile Lighthouse 94 → 86; now 90–93, desktop 100). GA collect requests confirmed (204).
- CSP in `public/_headers` widened for Google Tag Manager / Analytics.
- Privacy Policy: new section 5 "Analytics (Google Analytics)" (what is and is not collected, `_ga` cookies, EEA/UK defaults, opt-out); advertising moved to section 6; last updated 2026-11-15. Removed "no tracking" wording from About, Why us, Footer, Contact and the band generator page.

### [Hero banner illustration] — 2026-11-15
- Owner asked for a more attractive hero with images/diagrams.
- New `HeroScene.tsx`: inline-SVG building site touching every category (concrete slab, framed wall, roof truss + shingles with 8/12 pitch marker, painted wall with roller, gravel pile, crane lifting a beam, tree, 24 ft tape measure) on a blueprint sky panel; shown on all screen sizes.
- Heading accent in a gradient with a hand-drawn underline; colourful background glows; chips wrap instead of being cut off; result cards resized and moved to the panel corners.
- Lighthouse home: mobile 94 / 100 / 96 / 100 (LCP 2.9 s, CLS 0.001), desktop 100 / 100 / 96 / 100; `npm run verify` passed.

### [Tool cards with diagrams — bigger, modern] — 2026-11-15
- Owner feedback: cards looked simple and text was small; wanted tool-related diagrams so a visitor sees at a glance what each tool does.
- New `ToolArt.tsx`: 31 small inline-SVG diagrams (29 tools + "browse all" + "suggest"), coloured from the card's category, decorative (`aria-hidden`).
- `ToolCard` redesigned: illustration panel with category chip and badge, bigger icon/title/description/tags, "Open tool →" footer, hover ring; mobile row with diagram thumbnail. Fixed description showing a cut-off third line.
- Grids now 3 across (home and `/tools/`); home sections rebalanced so no row is half empty (split 4, stack 6, Business 3, New 9).
- Fix: in flipped split sections (heading on the right) the columns now swap too, so the cards keep the wide column (the Gravel cards had been squeezed into the narrow one).
- Lighthouse home: mobile 95 / 100 / 96 / 100, desktop 100 / 100 / 96 / 100; `/tools/` a11y 100; `npm run verify` passed.

### [Home page redesign — colourful, varied sections] — 2026-11-15
- Owner feedback: the home page looked flat; every section and every tool card looked the same.
- New `CategoryTiles` ("Pick a trade" gradient tiles) and `CategorySection` (per-category tint, blueprint grid, glow, gradient icon badge, numerals 01–06, alternating split/stack layouts with sticky heading).
- Tool cards now carry their category colour (top stripe, tint, gradient icon, tinted tags, coloured hover); mobile badge overlap fixed.
- Hero chips tinted per category (+ Business chip); "Why us" is a dark navy band with colourful icons; guides get gradient covers; FAQ glow.
- Fixes found on the way: double arrows in "View all" links, stale "22 calculators" text (now from the catalog), inert ad box hidden until ads are enabled, header search `aria-label` now matches its visible text.
- New tokens `--cat-*-deep` and `--cat-*-g1/g2`. Lighthouse: mobile Perf 96 / A11y 100, desktop 100 / 100; `npm run verify` passed.

### [AdSense-readiness report — verified and fixed] — 2026-11-15
- Checked every item of `docs/Adsence Approval reports/Adsence aprooval - report.pdf` against the live site and the code. Results and the owner list are in `00-PROJECT-STATUS.md` → Phase AR.
- **New pages:** `/disclaimer/` (estimates not advice, electrical/structural safety, prices, corrections, generated names, external links, advertising/affiliates, no affiliation, contact) and `/site-map/` (HTML site map built from the tool catalog and route list). Both are in the footer, `sitemap.xml` and `llms.txt` (47 routes).
- **Terms:** section 2 now covers calculators and templates and links to the Disclaimer; last updated 2026-11-15.
- **Accessibility:**
  - Darker `--muted`, `--accent` and `--success` tokens, plus the footer copyright colour; all token pairs now ≥ 4.5:1.
  - Older tool components used hardcoded colours. 52 text uses of `#64748B` now use `var(--muted)`. Across 73 files, `#0284C7` → `#0369A1`, `#0369A1` hover → `#075985` and `#059669` → `#065F46`.
  - 54 tool inputs whose `<label>` had no `htmlFor` now have an `aria-label`.
  - Underlines added to links in running text.
  - Guide task lists no longer render unlabelled disabled checkboxes.
  - Second pass after a full sweep: undefined `--color-text-muted` fallbacks → `var(--muted)`; grey/red text in tool CSS; new `--brand-orange-text` token for orange labels; unit `<select>`s named; `aria-checked` → `aria-pressed` on segmented buttons; Rafter `tablist` → `group`; heading order on Construction Estimate, Square Footage and Tile; empty header cell on Board & Batten.
  - Lighthouse accessibility: 100 on all 47 built pages (was 87–98 on 14 pages).
  - Fixed home search ARIA (`aria-controls` only while results exist; `aria-autocomplete`), and removed tool-card `aria-label`s that did not match the visible text.
- **Links:** external source links use `rel="noopener noreferrer"` and open in a new tab (How We Calculate, guide Markdown); the Quikrete link is `nofollow`.
- **Fonts:** Bricolage Grotesque uses `display: 'optional'` to avoid a late swap moving LCP.
- **Owner identity:** About → "Who runs KKC Tools" now names Karan Kumar (founder & developer) with email and Instagram; JSON-LD has a `Person` node (`/#founder`, occupation: senior software engineer) linked from the Organization's `founder`.
- **Contact email:** `contact@kkctools.com` was not a real mailbox (owner); every mailto, the Organization schema and `llms.txt` now use `kkchub1@gmail.com`.
- `npm run verify` passed after the fixes.

### [Tool #27 — Wire Gauge Calculator] — 2026-11-15
- New page `/wire-gauge-calculator/` (Batch 2 Tier 1 #8, safety-sensitive), built from `08_Wire_Gauge_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/wire-gauge-engine.ts`): three modes (size a wire, check a wire, gauge lookup); DC / single-phase / three-phase; amps or watts (+ power factor); voltage drop 2·I·R·L or √3·I·R·L; AWG resistance from geometry (ASTM B258 formula) and IACS resistivity at 75 °C ×1.02 stranding (matches NEC Ch. 9 Table 8 within 1.5 %, tested); mm² from IEC 60228 class 2 at 20 °C → 70 °C; NEC Table 310.16 ampacity with Tables 310.15(B)(1)/(C)(1) corrections, terminal-temperature cap, 125 % continuous loads, 240.4(D) limits and standard breaker sizes; picks the larger of the drop and ampacity sizes.
- Where published Table 310.16 reproductions differed (Cu 3 AWG 90 °C, Al 300 kcmil) the lower value is used. Metric mode sizes by voltage drop only and tells users to check current capacity under BS 7671 / IEC 60364 for their installation method.
- Review fixes before publishing: 60 °C column blanked above 100 A (NEC 110.14(C)(1)(b)) with a UI hint; aluminium FAQ wording; 14 AWG minimum and motor-circuit notes.
- Page: safety banner, two-checks explanation with live ladder diagram, circuit diagram, formulas, 4 engine-computed examples, wire-by-amps, wire-by-length and 12 V DC tables, AWG ↔ mm² table, copper vs aluminium, breakers & 125 % rule, 11 FAQs + schema, disclaimer; ~2,500 words. Title 64 chars incl. brand.
- Wiring: routes, catalog (29 tools, category "Framing, Roofing & Measuring" for now), new `bolt` icon, footer. 31 new tests (392 total); `npm run verify` all passed.

### [Tool #26 — Pipe & Tube Volume Calculator] — 2026-11-15
- New page `/pipe-volume-calculator/` (Batch 2 Tier 1 #7), built from `07_Pipe_Tube_Volume_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/pipe-volume-engine.ts`): runs list for round (preset, OD + wall, OD + ID, ID only) and rectangular tubes; capacity in US gal, imp gal, L, ft³, in³, m³; per-foot / per-metre; liquid weight; wall volume and tube weight by material; fill time from a flow rate.
- **Presets from published dimensions:** steel/PVC Schedule 40 & 80 (ASME B36.10M, ½–12 in), copper Types K/L/M (ASTM B88, ⅜–4 in), PEX SDR 9 (ASTM F876), metric PE SDR 11 (EN 12201 / ISO 4427). Weight check: 1 in Sch 40 steel = 1.68 lb/ft, 4 in = 10.79 lb/ft, matching the standard.
- UI: US or metric, live cross-section per run, several runs, liquid and material density, formula with the user's numbers, copy / share / print.
- Page: capacity and hollow-cylinder formulas with engine-computed examples, ID vs OD vs nominal, gallons-per-foot / litres-per-metre tables (Sch 40/80, copper L, PEX, PE), house plumbing example, tube weight, rectangular tubes, conversions, 10 FAQs + schema; ~2,500 words. Title shortened to 60 chars (incl. brand); one wrong claim about OD/nominal overstatement corrected to the computed 82% before publishing.
- Wiring: routes, catalog (28 tools), new `pipe` icon, footer. 19 new tests (361 total); `npm run verify` all passed.

### [Tool #25 — Board and Batten Calculator] — 2026-11-14
- New page `/board-and-batten-calculator/` (Batch 2 Tier 1 #6), built from `06_Board_and_Batten_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/board-batten-engine.ts`): equal spacing for battens at both edges / gaps at both edges / inset margin; count ↔ target gap; batten marks; outlet/window clash check; top rail, baseboard (existing or new) and grid rail rows; cut list packed into stock boards; nails, adhesive, caulk and paint; inch parser for fractions and feet; 1/16 in formatting; exterior siding mode (boards, battens, furring, openings).
- Lumber widths from the American Softwood Lumber Standard (NIST PS 20). Adhesive/caulk feet per tube from bead volume; nail spacing labelled as a working assumption.
- UI: inches with fractions or mm, live wall drawing to scale, compare-counts table with one-click "Use", marks list, shopping list with optional prices, copy / share / print.
- Page: spacing formula with engine-computed worked example, edge-option diagram, inch and metric spacing tables, nominal vs actual table, half-wall and grid examples, shopping list, install tips, siding section, 10 FAQs + schema; ~2,600 words, 7 SVGs. Title set to 61 chars (incl. brand).
- Wiring: routes, catalog (27 tools), new `battenWall` icon, footer. 27 new tests (342 total); `npm run verify` all passed.

### [Tool #24 — Shingle Roof Calculator] — 2026-11-14
- New page `/shingle-calculator/` (Batch 2 Tier 1 #5), built from `05_Shingle_Roof_Calculator_Competitor_Analysis.md`.
- **Engine** (`src/lib/shingle-engine.ts`): roof sections (gable / hip / shed / measured area) with overhang and pitch; slope factor √(1+(rise/12)²); automatic eaves, rakes, ridge and hip lengths (manual override); squares → bundles with waste; starter strip, hip & ridge cap, drip edge, underlayment, ice & water barrier (eaves rows + valleys) and nails; optional material cost.
- **Defaults from manufacturer data:** GAF Timberline HDZ (3 bundles, 64 pieces/square), Owens Corning Supreme 3-tab (3 bundles, 80/square), OC Starter Strip Plus (105 ft/bundle), OC ProEdge (33 ft/bundle). Waste presets labelled as typical trade allowances.
- Feet or metres; several sections; live roof-plan diagram per section; shopping-list table; copy, share link, print.
- Page: 4 diagram types (7 SVGs), pitch multiplier table, bundles-per-square table, bundles-by-roof-size table, 4 engine-computed worked examples, 10 FAQs + schema, "How This Calculator Works"; ~2,840 words. Title shortened to 61 chars (incl. brand) after the SEO audit flagged 66.
- Wiring: routes, catalog (26 tools), new `shingles` icon, footer. 20 new tests (315 total); `npm run verify` all passed.

### [Tool #23 — Lawn Mowing Cost Calculator] — 2026-11-14
- New page `/lawn-mowing-cost-calculator/` (Batch 2 Tier 1 #4), built from `04_Lawn_Mowing_Cost_Calculator_Competitor_Analysis.md`.
- **Two views in one tool:** "What will I pay?" (homeowner) and "What should I charge?" (pro, with profit per visit).
- **Time-based engine** (`src/lib/lawn-mowing-engine.ts`): mower width × speed → acres per hour; grass, slope, obstacle and frequency factors; extras as time; setup + drive time; minimum charge; exact visits per season; per visit / month / season / acre / 1,000 sq ft; low–typical–high range.
- Lawn size in sq ft, acres or m², presets, or a rectangle adder with subtract areas; narrow-gate option; currency selector; copy, share link, print.
- Hourly presets ($32 / $50 / $68) sit inside the $30–$68/h range published by Jobber (Mar 2026) and Housecall Pro (Oct 2026); tested to stay inside their per-visit ranges for ¼, ½ and 1 acre. Mower speeds and condition factors are labelled as working assumptions.
- 4 SVG diagrams (measuring, mower path, grass growth, live time bar); every table and FAQ number computed by the engine; 12 FAQs + FAQPage and WebApplication schema; "How This Calculator Works" block; ~2,700 words.
- Wiring: routes, tools catalog (25 tools), new `mower` icon, footer link. 22 new tests (295 total); `npm run verify` all passed.

### [Cloudflare deploy fix + docs refresh] — 2026-11-14
- **Cloudflare deploy fixed.** The first deploy failed because Cloudflare's auto-setup added OpenNext, which needs a `standalone` build (`pages-manifest.json` not found).
  - Added `wrangler.jsonc`: serve `out/` as Workers Static Assets (`auto-trailing-slash`, `404-page`).
  - Removed `@opennextjs/cloudflare` and `wrangler` from `package.json` (not on the allowed dependency list; `npx wrangler deploy` fetches wrangler at deploy time).
  - `next.config.ts` unchanged (`output: 'export'`).
  - Evidence: `npx wrangler deploy --dry-run` read 522 files from `out/`; `npm run verify` all steps passed.
- **Competitor research (Phase KR):** 121 competitor-analysis files for planned tools, Batches 2–8 (docs only).
- **Docs refreshed:** `01` (24-tool directory), `02` (live page inventory), `03` (current tokens + measured contrast), `04` (keyword data map), `05` (Cloudflare deploy steps).

### [SEO audit fixes, part 2: content] — 2026-11-14
- **"How This Calculator Works" block on 20 calculators.** It shows the formula, defaults, sources (verified links only), the last-updated date and a correction link.
- **Brick calculator US / Metric toggle.**
  - Metric engine with UK, Australian and German brick sizes (10 tests).
  - New "How Many Bricks Per m²?" section.
- **Guides.**
  - All 3 open with a direct answer.
  - Retired USPTO "TESS" references replaced with current, checked registry links.
  - New sections added; each guide is now 1,686–1,888 words.
- **Genre pages rewritten in plain language.** Flesch score went from 12.9–21.5 to 63.5–72.5.
- **H1 style made consistent** on 7 calculators.
- **Mobile TBT re-measured** at 91–109 ms, so no change was needed.
- `npm run verify` passed: 273 tests, 0 SEO audit errors.

### [SEO audit fixes] — 2026-11-14
- **Schema:**
  - one connected JSON-LD graph, with Organization + WebSite `@id`s in the layout and a shared normalizer (`normalizeSchema.ts`) for all page JSON-LD;
  - WebPage, AboutPage, ContactPage and CollectionPage nodes;
  - duplicate FAQPage removed on 7 pages;
  - breadcrumbs added on 4 pages and the parent label unified to "Tools".
- **Broken items fixed:**
  - og:image returned 404 on every page; it is now a real `/opengraph-image.png`;
  - `/apple-touch-icon.png` returned 404;
  - the footer Terms link returned 404 on every page;
  - 3 dead homepage guide links;
  - "Home › Home ›" breadcrumbs.
- **Trust:**
  - unverifiable claims removed or softened;
  - About rewritten with counts taken from the code;
  - Contact, /tools/, /guides/ and the home title rewritten for the whole site.
- **Crawl and headers:**
  - `llms.txt` is generated from the route list;
  - the sitemap has loc + lastmod only;
  - robots.txt allows AI search bots explicitly;
  - CSP and HSTS `includeSubDomains` in `_headers`.
- **`seo-audit.mjs` now fails on:**
  - a duplicate FAQPage or Organization;
  - a missing breadcrumb;
  - a dangling @id;
  - an incomplete WebApplication;
  - a missing robots meta;
  - a missing og:image file;
  - a broken internal link.
- `npm run verify` passed: 263 tests, 0 SEO audit errors.

### [Tool #22 — Rebar / Reinforcement Steel Calculator] — 2026-11-14
- New page `/rebar-calculator/` with:
  - engine `src/lib/rebar-engine.ts` (19 tests);
  - UI `src/components/tool/rebar-calculator/`;
  - theme-aware SVG diagrams: slab grid, footing, wall, bar list, lap splice, cover/chairs, bar sizes to scale.
- Slabs, footings, walls and bar lists in one job. Supports US #3–#11 and metric 8–40 mm bars, laps at a user-set × d, 10/20/40 ft or 6/12 m stock bars, and waste. Results show bars to buy by size, weight and optional cost.
- Bar weights from ASTM A615 (US) and 7,850 kg/m³ steel (metric, matches BS 4449). Cover note cites ACI 318. The 40 × d lap is labelled a rule of thumb.
- Catalog now 24 tools. `npm run verify` passed: 263 tests, 0 SEO audit errors.

### [Tool #21 — Drywall Calculator] — 2026-11-14
- New page `/drywall-calculator/` with engine `src/lib/drywall-engine.ts` (26 tests), UI `src/components/tool/drywall-calculator/` and theme-aware SVG diagrams (room, wall, ceiling, gable, area, sheet/screw layout, taped joint, sheet sizes).
- Rooms, walls, ceilings, gable ends and known areas in one job; editable doors/windows; US and metric sheets; sheets by size; compound, tape, screws, corner bead, board weight and optional cost.
- Rates sourced from USG (compound, board weights), Georgia-Pacific (tape, 10–15% overage) and IRC Table R702.3.5 (screw spacing).
- Catalog now 23 tools; "22 tools" text across header, footer, hero, home and directory now reads the catalog length.

### [Tool #20 — Concrete Calculator] — 2026-11-13
- New page `/concrete-calculator/` with engine `src/lib/concrete-engine.ts` (25 tests), UI `src/components/tool/concrete-calculator/` and labelled SVG shape diagrams.
- 8 shapes, multi-pour totals, US/metric with value conversion, bag counts (QUIKRETE data-sheet yields + derived kg sizes), ready-mix rounding and truck loads, optional cost, site-mix split, copy/share/print.
- Article numbers (examples, tables, FAQ) generated from the engine at build time.
- `/cubic-yard-calculator/` retitled to avoid keyword cannibalisation; nav, footer and tools directory updated.
- `npm run verify` passed: 214 tests, 0 SEO audit errors.

### [Phase 3 Complete — Checkpoint 1] — 2026-11-08
- **Tasks Completed:** P3-01, P3-02, P3-03, P3-04, P3-05, P3-06, P3-07, P3-08, P3-09.
- **Details:**
  - Built interactive `BandNameGenerator` component hierarchy:
    - `Controls.tsx`: F1–F7 (genre radio chips, style selector, batch sizes 5/10/20, letter filter, keyword injector, uppercase toggle, generate CTA with Enter key listener).
    - `ResultRow.tsx`: F8, F9, F11 (large heading font band titles, animated entry, copy, heart favorite toggle, check availability dropdown).
    - `Results.tsx`: F8, F9, F12 (aria-live announcements, copy-all action, constraint warning alert).
    - `CheckMenu.tsx`: F11 (Google, Spotify, Bandcamp, and YouTube search links with safe rel tags and clearance disclaimer).
    - `SavedPanel.tsx`: F10 (LocalStorage-synced favorites, remove items, copy-all, and .txt export download).
  - Built full `/band-name-generator/` main tool page with 2,242 words of original, comprehensive content and 8 structured FAQ items.
  - Implemented full Schema JSON-LD: `WebApplication`, `BreadcrumbList`, and `FAQPage`.
  - Rebuilt `/` Home page matching Section 8.1 with live compact tool preview.
  - Passed all verification steps in `npm run verify` (lint, unit tests, no-network check, build, SEO audit, docs bundle).

### [Phase 2 Complete] — 2026-11-08
- **Tasks Completed:** P2-01, P2-02, P2-03, P2-04, P2-05, P2-06, P2-07.
- **Details:**
  - Implemented core pure TypeScript generator engine (`src/lib/generator/`): Mulberry32 seeded RNG, safeStorage helper.
  - Curated 9 genre word pools with 80+ distinct words per pool.
  - Implemented 8+ weighted patterns per genre supporting 'the', 'two-word', 'one-word', and 'of-phrase' styles (>5,000 combinations per genre).
  - Built blocklist of 260+ famous bands with normalized checking and explicit slur/offensive filter.
  - Built `generateNames()` with constraint validation, loop guards (500 max attempts), and friendly warnings.
  - Passed all 9 Vitest unit tests in `src/lib/generator/engine.test.ts`.
  - Verified zero network calls via `check:no-network`.

### [Phase 1 Complete] — 2026-11-08
- **Tasks Completed:** P1-01, P1-02, P1-03, P1-04, P1-05, P1-06, P1-07, P1-08, P1-09, P1-10, P1-11.
- **Details:**
  - Implemented design tokens with Stage Lights theme in `src/styles/tokens.css` with dark/light mode and verified WCAG contrast ≥ 4.5:1.
  - Loaded Google Fonts (Bricolage Grotesque & Inter) self-hosted via `next/font/google`.
  - Built Header with soundwave SVG, accessible desktop dropdown, mobile drawer with escape key and focus trap, and no-flash ThemeToggle.
  - Built 4-column SEO-optimized Footer with legal disclaimers.
  - Implemented UI primitives: Button, Chip, Card, Container, Section, Faq (details/summary), and Toast (polite live region).
  - Implemented Breadcrumbs with BreadcrumbList JSON-LD and single source of truth route registry `src/lib/routes.ts`.
  - Created inert `AdSlot` and custom `not-found.tsx` generating `out/404.html` with noindex.

### [Phase 0 Complete] — 2026-11-08
- **Tasks Completed:** P0-01, P0-02, P0-03, P0-04, P0-05, P0-06, P0-07, P0-08.
- **Details:**
  - Initialized Next.js App Router project with TypeScript strict mode, static export configuration (`output: 'export'`), and trailing slashes.
  - Installed allowed dependencies: `gray-matter`, `marked`, `vitest`, `vite-tsconfig-paths`, `cheerio`, `serve`, `prettier`.
  - Added operational scripts for building, testing, auditing, and checking zero-network usage.
  - Created `AGENTS.md` and complete `docs/` documentation system.
  - Initialized git repository.
