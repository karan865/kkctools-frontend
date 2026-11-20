import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import RentalPropertyCalculator from '@/components/tool/rental-property-calculator';
import ToolShell from '@/components/tool/shared/ToolShell';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import { calculateRentalProperty } from '@/lib/rental-property-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.rentalPropertyCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

// Build-time engine-computed reference metrics for BLUF and worked examples
const ex = calculateRentalProperty({
  purchasePrice: 250000,
  closingCosts: 7500,
  upfrontRepairs: 5000,
  isFinanced: true,
  downPaymentPercent: 25,
  interestRatePercent: 7.0,
  loanTermYears: 30,
  loanPointsPercent: 0,
  monthlyRent: 2400,
  otherIncomeMonthly: 0,
  vacancyPercent: 5,
  propertyTaxAnnual: 3000,
  insuranceAnnual: 1400,
  hoaMonthly: 0,
  utilitiesMonthly: 0,
  maintenancePercentOfRent: 5,
  capexPercentOfRent: 5,
  managementPercentOfEgi: 8,
  otherExpensesAnnual: 0,
  proFormaYears: 10,
  annualRentGrowthPercent: 3,
  annualExpenseGrowthPercent: 3,
  annualAppreciationPercent: 3,
  sellingCostPercent: 6,
});

const faqs = [
  {
    q: 'How do you calculate cash-on-cash return?',
    a: `To calculate cash-on-cash (CoC) return, divide your net annual pre-tax cash flow by the total initial cash capital invested, then multiply by 100. The equation is: Cash-on-Cash Return % = (Annual Net Cash Flow ÷ Total Cash Invested) × 100. For example, if you invest $75,000 cash into down payment, closing costs, and upfront repairs on a $250,000 property, and it generates $2,922 in annual cash flow after all operating expenses and mortgage payments, your cash-on-cash return is ($2,922 ÷ $75,000) × 100 = 3.90%.`,
  },
  {
    q: 'What is a good cash-on-cash return for a rental property?',
    a: `There is no single universal "good" cash-on-cash return percentage because acceptable yields depend entirely on your local real estate market, cost of debt, and alternative opportunity costs (such as Treasury yields, index funds, or high-yield savings). Investors in high-appreciation markets often accept a lower starting cash-on-cash return in exchange for expected equity growth, while investors in slower-growing markets usually want more cash flow up front. Set your own target by comparing the result with what the same cash could earn elsewhere at a risk you are comfortable with.`,
  },
  {
    q: 'What is the difference between cash-on-cash return, cap rate, and ROI?',
    a: `Cap rate evaluates the property's intrinsic operational earning power as if bought for 100% cash (NOI ÷ Purchase Price), completely ignoring mortgage financing. Cash-on-cash return measures the actual cash yield specifically on the cash equity you personally wired at closing after deducting mortgage debt service (Net Cash Flow ÷ Cash Invested). Total ROI (Return on Investment) encompasses all wealth pillars: annual cash flow, principal loan paydown, property appreciation, and tax benefits over time.`,
  },
  {
    q: 'Does cash-on-cash return include property appreciation or principal paydown?',
    a: `No. Cash-on-cash return strictly measures immediate spendable cash in pocket relative to the physical cash invested. It does not account for unrealized equity growth through home price appreciation or the wealth accumulated as tenants pay down your mortgage principal balance. To evaluate equity growth and amortization alongside cash distributions, look at the multi-year Pro Forma total return and Internal Rate of Return (IRR).`,
  },
  {
    q: 'Can cash-on-cash return be negative?',
    a: `Yes. If a rental property's operating expenses and debt service exceed its collected rental income, the property produces negative cash flow, resulting in a negative cash-on-cash return. When this happens, the property owner must inject out-of-pocket personal funds each month to cover mortgage payments, property taxes, or emergency repairs (often called "feeding the beast").`,
  },
  {
    q: 'How do I calculate ROI on a rental property?',
    a: `To calculate comprehensive rental property ROI across a given holding period, sum your cumulative net cash flows plus total principal amortization paydown plus net capital appreciation upon sale (after deducting selling transaction costs), then divide by your initial cash outlay. Expressed as an annualized compound figure, this is evaluated using the Internal Rate of Return (IRR) calculation.`,
  },
  {
    q: 'What is the difference between gross rental yield and net rental yield?',
    a: `Gross rental yield divides annual gross scheduled rent by the property purchase price without deducting any expenses (Annual Rent ÷ Price × 100). Net rental yield divides Net Operating Income (NOI)—which subtracts vacancy, property taxes, insurance, repairs, and management fees—by the purchase price. In the UK, Australia, and New Zealand, gross and net rental yield are the primary metrics used instead of capitalization rate.`,
  },
  {
    q: 'What is the 1% rule in real estate investing?',
    a: `The 1% rule is a rapid preliminary screening guideline stating that a residential rental property should generate gross monthly rent equal to at least 1% of its total acquisition cost (Rent ÷ Purchase Price ≥ 0.01). On a $250,000 home, the 1% rule suggests a target rent of $2,500/month. While useful for filtering out properties in seconds, it does not replace a comprehensive pro forma analysis because it ignores property taxes, insurance, and maintenance variations.`,
  },
  {
    q: 'What is DSCR and why do mortgage lenders require it?',
    a: `Debt Service Coverage Ratio (DSCR) measures a rental property's ability to cover its annual mortgage obligations from its Net Operating Income: DSCR = Net Operating Income (NOI) ÷ Annual Debt Service. Lenders set their own minimum DSCR. A DSCR above 1.00× means NOI covers the mortgage; the higher it is, the bigger the buffer against vacancy or repair spikes. Ask your lender for their minimum and compare it with the calculator’s result.`,
  },
  {
    q: 'How much should I budget for property management?',
    a: `Property managers usually charge a percentage of collected rent, and some add leasing or tenant-placement fees. Get quotes from local managers and enter their rate. If you self-manage you can enter 0%, but testing the deal with a manager’s fee shows whether it still works as a passive investment.`,
  },
  {
    q: 'What is a real estate pro forma?',
    a: `A real estate pro forma is a forward-looking financial statement projecting a property's future revenues, expenses, debt obligations, equity accumulation, and net cash flows over a multi-year investment horizon (typically 5 to 10 years). Pro formas incorporate realistic assumptions for annual rent growth, expense inflation, vacancy rates, and market appreciation.`,
  },
  {
    q: 'How do you make money investing in rental real estate?',
    a: `Real estate investors build wealth through four distinct profit centers: 1) Cash Flow (regular spendable rental profits after paying operating expenses and mortgages), 2) Principal Paydown (tenants pay down your loan balance each month, increasing your equity), 3) Long-Term Appreciation (property value increases over time with inflation and economic growth), and 4) Tax Advantages (depreciation deductions, mortgage interest write-offs, and 1031 exchanges).`,
  },
];

export default function RentalPropertyCalculatorPage() {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools/' },
    { name: 'Rental Property Calculator', path: route.path },
  ];

  const webAppSchema = buildWebApplicationSchema({
    name: 'Rental Property Calculator – Cash Flow, Cash-on-Cash Return & ROI',
    path: route.path,
    description: route.description,
    applicationCategory: 'BusinessApplication',
  });

  const faqSchema = buildFaqSchema(faqs);

  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={faqSchema} />

      <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
        <Breadcrumbs items={breadcrumbItems} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Rental Property Calculator: Cash Flow, Cash-on-Cash Return &amp; ROI</h1>
          <p className={styles.lead}>
            Free comprehensive investment property calculator. Enter purchase price, financing, rental income, and operating
            expenses to calculate monthly cash flow, cash-on-cash return, cap rate, DSCR, and 10-year pro forma equity in one
            view.
          </p>
          <p className={styles.meta}>
            Updated for 2026 · Pure Browser Real Estate Math · Zero Data Sent to Servers
          </p>
        </header>

        {/* BLUF Answer Block */}
        <div className={styles.blufBox}>
          <strong>Quick Answer (BLUF):</strong> Cash-on-cash return is the yearly cash a rental puts in your pocket divided
          by the cash you put in. A <strong>${ex.comparison.financed.cashInvested.toLocaleString('en-US')}</strong> cash
          investment on a <strong>$250,000</strong> rental with 25% down that clears{' '}
          <strong>${Math.round(ex.annualCashFlow).toLocaleString('en-US')}</strong> a year after debt service returns{' '}
          <strong>{ex.cashOnCashPercent?.toFixed(2)}%</strong> cash-on-cash and a{' '}
          <strong>{ex.capRatePercent?.toFixed(2)}%</strong> cap rate before taxes.
        </div>

        {/* Ad slot before tool */}
        <AdSlot slotId="rental-property-top" />

        {/* Interactive Tool wrapped in shared ToolShell */}
        <section className={styles.toolSection} aria-label="Interactive Rental Property Calculator">
          <ToolShell
            features={[
              'Cash flow + 8 metrics',
              '10-year pro forma',
              'Cash vs mortgage',
              'Print & share link',
            ]}
          >
            <RentalPropertyCalculator />
          </ToolShell>
        </section>

        {/* Rich In-Depth Educational Guide */}
        <article className={styles.article}>
          {/* Section 1: Definition */}
          <section className={styles.section}>
            <h2 className={styles.h2}>What Is Cash-on-Cash Return in Real Estate?</h2>
            <p className={styles.p}>
              <strong>Cash-on-cash return (CoC)</strong> is the percentage rate of return measuring the net annual cash flow
              generated by an investment property relative to the total initial liquid cash out-of-pocket invested. Unlike
              traditional Return on Equity (ROE) or total Return on Investment (ROI), cash-on-cash return measures only the
              tangible, spendable cash distributions you receive after paying all operational property expenses and required
              mortgage debt service payments.
            </p>
            <div className={styles.formulaBox}>
              <div className={styles.formulaTitle}>Cash-on-Cash Return Formula</div>
              <code className={styles.formulaCode}>
                Cash-on-Cash Return % = (Annual Net Cash Flow ÷ Total Cash Invested) × 100
              </code>
              <p className={styles.formulaDesc}>
                Where <em>Annual Net Cash Flow</em> = Net Operating Income (NOI) − Annual Mortgage Debt Service (P&amp;I),
                and <em>Total Cash Invested</em> = Down Payment + Loan Closing Costs + Upfront Rehabilitation Repairs + Loan Points.
              </p>
            </div>
            <p className={styles.p}>
              Because cash-on-cash return incorporates the exact cost of mortgage financing (interest rate, amortization term,
              and down payment percentage), it illustrates how leverage magnifies or constrains the actual yield of your physical capital.
            </p>
          </section>

          {/* Section 2: How to Use */}
          <section className={styles.section}>
            <h2 className={styles.h2}>How to Use This Rental Property Calculator</h2>
            <p className={styles.p}>
              Our calculator provides three interactive analysis perspectives to underwrite residential and commercial rental deals:
            </p>
            <ol className={styles.numberedList}>
              <li>
                <strong>Returns &amp; Cash Flow (Tab 1):</strong> View your immediate Year 1 economics. Enter acquisition
                price, financing terms, scheduled rent roll, vacancy allowance, and operating expenses. The calculator computes
                your monthly cash in-pocket, cash-on-cash yield, cap rate, Debt Service Coverage Ratio (DSCR), and complete cash
                flow waterfall.
              </li>
              <li>
                <strong>10-Year Pro Forma (Tab 2):</strong> Project your wealth accumulation across a 5 or 10-year holding period.
                Model compound annual rent growth, expense inflation, and real estate appreciation. The table and interactive
                amortization chart track how tenant-funded principal paydown builds your property equity over time.
              </li>
              <li>
                <strong>Cash vs. Mortgage (Tab 3):</strong> Compare the exact same property side-by-side: purchasing with a
                traditional 25% down mortgage loan versus buying 100% all-cash. Evaluate the trade-off between higher monthly
                defensive cash cushion and leveraged long-term Internal Rate of Return (IRR).
              </li>
            </ol>
          </section>

          {/* Section 3: Worked Example */}
          <section className={styles.section}>
            <h2 className={styles.h2}>How to Calculate Rental Property Returns: Step-by-Step Worked Example</h2>
            <p className={styles.p}>
              To understand how the math works in real estate underwriting, consider a standard single-family residential rental
              property analyzed using our engine’s verified baseline parameters:
            </p>

            <div className={styles.tableWrap}>
              <table className={styles.contentTable}>
                <thead>
                  <tr>
                    <th scope="col">Underwriting Step</th>
                    <th scope="col">Line Item</th>
                    <th scope="col" style={{ textAlign: 'right' }}>
                      Calculation &amp; Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>1. Capital Invested</strong></td>
                    <td>Down Payment (25% on $250k)</td>
                    <td style={{ textAlign: 'right' }}>$62,500.00</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Closing Costs + Initial Repairs</td>
                    <td style={{ textAlign: 'right' }}>+$7,500 + $5,000 = $12,500.00</td>
                  </tr>
                  <tr className={styles.subtotalRow}>
                    <td></td>
                    <td><strong>Total Initial Cash Invested</strong></td>
                    <td style={{ textAlign: 'right' }}><strong>$75,000.00</strong></td>
                  </tr>
                  <tr>
                    <td><strong>2. Operating Income</strong></td>
                    <td>Gross Scheduled Rent ($2,400/mo)</td>
                    <td style={{ textAlign: 'right' }}>$28,800.00/yr</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Less Vacancy Allowance (5%)</td>
                    <td style={{ textAlign: 'right', color: '#d97706' }}>−$1,440.00/yr</td>
                  </tr>
                  <tr className={styles.subtotalRow}>
                    <td></td>
                    <td><strong>Effective Gross Income (EGI)</strong></td>
                    <td style={{ textAlign: 'right' }}><strong>$27,360.00/yr</strong></td>
                  </tr>
                  <tr>
                    <td><strong>3. Operating Expenses</strong></td>
                    <td>Property Taxes ($3,000) + Insurance ($1,400)</td>
                    <td style={{ textAlign: 'right' }}>$4,400.00/yr</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Maintenance (5%) + CapEx Reserves (5%)</td>
                    <td style={{ textAlign: 'right' }}>$2,880.00/yr</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Property Management Fee (8% of EGI)</td>
                    <td style={{ textAlign: 'right' }}>$2,188.80/yr</td>
                  </tr>
                  <tr className={styles.subtotalRow}>
                    <td></td>
                    <td><strong>Total Operating Expenses</strong></td>
                    <td style={{ textAlign: 'right' }}><strong>$9,468.80/yr</strong></td>
                  </tr>
                  <tr style={{ background: '#f5f3ff' }}>
                    <td><strong>4. Operational NOI</strong></td>
                    <td><strong>Net Operating Income (EGI − Expenses)</strong></td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: '#6b21a8' }}>
                      <strong>$17,891.20/yr</strong>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>5. Debt Service</strong></td>
                    <td>Mortgage P&amp;I ($187.5k loan, 7%, 30 yr)</td>
                    <td style={{ textAlign: 'right', color: '#7c3aed' }}>−$14,969.31/yr ($1,247.44/mo)</td>
                  </tr>
                  <tr style={{ background: '#ecfdf5' }}>
                    <td><strong>6. Net Cash Flow</strong></td>
                    <td><strong>Spendable Cash (NOI − Debt Service)</strong></td>
                    <td style={{ textAlign: 'right', fontWeight: 900, color: '#065f46' }}>
                      <strong>$2,921.89/yr ($243.49/mo)</strong>
                    </td>
                  </tr>
                  <tr style={{ background: '#eff6ff' }}>
                    <td><strong>7. Yield Returns</strong></td>
                    <td><strong>Cash-on-Cash Return ($2,921.89 ÷ $75k)</strong></td>
                    <td style={{ textAlign: 'right', fontWeight: 900, color: '#1e40af' }}>
                      <strong>3.90%</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: Monthly Cash Flow vs NOI */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Monthly Cash Flow vs. Net Operating Income (NOI): What’s Included?</h2>
            <p className={styles.p}>
              A frequent error made by beginner real estate investors is confusing <strong>Net Operating Income (NOI)</strong> with{' '}
              <strong>Net Cash Flow</strong>:
            </p>
            <ul className={styles.bulletList}>
              <li>
                <strong>Operating Expenses (Deducted to find NOI):</strong> Operating expenses encompass ordinary day-to-day costs
                required to maintain and run the physical property. These include municipal property taxes, hazard insurance,
                routine repairs, turnover maintenance, capital expenditure (CapEx) reserves, HOA dues, landscaping, owner-paid
                utilities, and third-party property management fees.
              </li>
              <li>
                <strong>Debt Service (Deducted AFTER NOI to find Cash Flow):</strong> Mortgage payments (principal amortization and
                interest) are strictly <em>capital financing costs</em>, not operating expenses. Two buyers purchasing identical units in
                the same building might have completely different loan structures (one pays all cash, another puts 10% down at 7.5%
                interest). NOI remains identical between both units, while their net cash flows differ dramatically.
              </li>
            </ul>
          </section>

          {/* Section 5: Metrics Comparison Table */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Cap Rate, Rental Yield, ROI, and DSCR: When to Use Each</h2>
            <p className={styles.p}>
              Professional commercial and residential investors use different financial metrics depending on whether they are
              comparing properties, applying for bank loans, or measuring investor returns:
            </p>

            <div className={styles.tableWrap}>
              <table className={styles.contentTable}>
                <thead>
                  <tr>
                    <th scope="col">Financial Metric</th>
                    <th scope="col">Formula</th>
                    <th scope="col">Primary Purpose &amp; Audience</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Cash-on-Cash (CoC)</strong></td>
                    <td><code>Net Cash Flow ÷ Cash Invested</code></td>
                    <td>Measures actual liquid cash yield on your deployed equity. Best for evaluating leveraged rentals.</td>
                  </tr>
                  <tr>
                    <td><strong>Cap Rate</strong></td>
                    <td><code>Net Operating Income ÷ Price</code></td>
                    <td>Measures intrinsic property profitability independent of financing. Best for comparing market assets.</td>
                  </tr>
                  <tr>
                    <td><strong>Gross Rental Yield</strong></td>
                    <td><code>Annual Gross Rent ÷ Price</code></td>
                    <td>Quick headline screening metric widely used in the UK, Australia, and New Zealand.</td>
                  </tr>
                  <tr>
                    <td><strong>Net Rental Yield</strong></td>
                    <td><code>NOI ÷ Property Price</code></td>
                    <td>Equivalent to capitalization rate in international property underwriting.</td>
                  </tr>
                  <tr>
                    <td><strong>Debt Coverage (DSCR)</strong></td>
                    <td><code>NOI ÷ Annual Debt Service</code></td>
                    <td>Evaluates debt safety margin. Required by commercial and DSCR mortgage lenders (target ≥ 1.20×).</td>
                  </tr>
                  <tr>
                    <td><strong>Gross Rent Multiplier</strong></td>
                    <td><code>Purchase Price ÷ Annual Rent</code></td>
                    <td>Evaluates pricing multiples relative to gross top-line revenue (e.g. 8.68×).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6: Leverage - Cash vs Mortgage */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Leverage: Buying with Cash vs. Taking a Mortgage</h2>
            <p className={styles.p}>
              Financial leverage is a double-edged sword in real estate investing:
            </p>
            <p className={styles.p}>
              When borrowing money at an interest rate lower than your property’s capitalization rate, leverage generates{' '}
              <em>positive leverage</em>, boosting your cash-on-cash yield and total return above that of an all-cash buyer.
              Conversely, when mortgage rates exceed property cap rates (such as during high interest rate environments),{' '}
              <em>negative leverage</em> occurs, where financing the deal produces a lower cash-on-cash percentage than purchasing for cash.
            </p>
            <p className={styles.p}>
              However, taking a mortgage allows an investor to purchase multiple properties with the same total capital, multiplying
              exposure to market appreciation and tax depreciation write-offs. Use <strong>Tab 3 (Cash vs. Mortgage)</strong> in our
              calculator to compare these dynamics on your exact deal.
            </p>
          </section>

          {/* Section 7: Pro Forma Long-Term Return */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Long-Term Returns: Understanding a 10-Year Real Estate Pro Forma</h2>
            <p className={styles.p}>
              Evaluating a rental property solely on its Year 1 cash-on-cash return ignores the primary wealth engines of real estate:
            </p>
            <ul className={styles.bulletList}>
              <li>
                <strong>Compounding Rent Growth:</strong> As market rents increase over time (enter your own growth rate), your revenue grows while
                your primary expense—fixed-rate mortgage principal and interest—remains unchanged for 30 years. This causes net cash
                flow to expand disproportionately over time.
              </li>
              <li>
                <strong>Amortization Paydown:</strong> Each month, a portion of the tenant’s rent payment reduces your remaining loan
                principal balance. In Year 10 of a 30-year loan, monthly principal paydown is significantly larger than in Year 1.
              </li>
              <li>
                <strong>Internal Rate of Return (IRR):</strong> The 10-year pro forma computes your true IRR, which calculates the
                annualized compound rate of return on your initial capital taking into account all periodic cash distributions and net
                capital gains realized upon property liquidation.
              </li>
            </ul>
          </section>

          {/* Section 8: 1% Rule */}
          <section className={styles.section}>
            <h2 className={styles.h2}>The 1% Rule and Rent-to-Price Ratio: Screening Guidelines</h2>
            <p className={styles.p}>
              The <strong>1% rule</strong> posits that a residential rental property should generate gross monthly rent equal to at
              least 1.0% of its purchase price (e.g., $2,500/month rent on a $250,000 house, or $1,500/month on a $150,000 duplex).
            </p>
            <p className={styles.p}>
              While properties meeting the 1% rule historically stood a strong likelihood of generating positive cash flow after
              mortgages and expenses, it is strictly a preliminary screening filter:
            </p>
            <ul className={styles.bulletList}>
              <li>
                <strong>High-Tax Jurisdictions:</strong> A property renting for 1.1% in an area with 3.0% property tax rates may
                cash-flow worse than a 0.85% property located in a state with 0.5% property taxes.
              </li>
              <li>
                <strong>Building Age and Utilities:</strong> Older properties requiring high capital reserves and structural repairs
                can quickly erode cash flows even if they surpass the 1% threshold.
              </li>
            </ul>
          </section>

          {/* Section 9: Common Mistakes */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Common Mistakes When Underwriting Rental Properties</h2>
            <ul className={styles.bulletList}>
              <li>
                <strong>Omitting Vacancy Allowances:</strong> Even in tight rental markets, tenant turnover, painting, and marketing
                incur downtime. Underwriting a minimum 5% to 8% vacancy allowance ensures your projections stay solvent.
              </li>
              <li>
                <strong>Ignoring Capital Expenditures (CapEx):</strong> Setting aside money for emergency repairs is not enough. Big-ticket
                items—such as roof replacements ($10,000+), HVAC systems ($7,000+), and water heaters—require monthly sinking fund
                reserves (typically 5% of gross rent).
              </li>
              <li>
                <strong>Forgetting Closing Costs &amp; Make-Ready Rehab:</strong> Calculating cash-on-cash return based only on your down
                payment understates your real cash investment. Always include title fees, transfer taxes, inspection costs, and immediate
                paint/flooring make-ready outlays.
              </li>
            </ul>
          </section>

          {/* Section 10: FAQ */}
          <section className={styles.section} id="faq">
            <h2 className={styles.h2}>Frequently Asked Questions About Rental Property Investing</h2>
            <div className={styles.faqList}>
              {faqs.map((faq, idx) => (
                <div key={idx} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{faq.q}</h3>
                  <div className={styles.faqAnswer}>
                    <p style={{ margin: 0 }}>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sourced References */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Authoritative Sources &amp; Underwriting Standards</h2>
            <p className={styles.p}>
              Our financial algorithms and underwriting definitions adhere to established real estate and tax standards:
            </p>
            <ul className={styles.bulletList}>
              <li>
                <a
                  href="https://www.irs.gov/publications/p527"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.citationLink}
                >
                  Internal Revenue Service (IRS) — Publication 527: Residential Rental Property
                </a>{' '}
                — Statutory federal guidelines governing rental income reporting, deductible operating expenses, repair vs.
                depreciation rules, and mortgage interest deductions.
              </li>
              <li>
                <a
                  href="https://www.narpm.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.citationLink}
                >
                  National Association of Residential Property Managers (NARPM)
                </a>{' '}
                — Professional industry standards for property management compensation, leasing operations, and maintenance budgeting.
              </li>
              <li>
                <a
                  href="https://corporatefinanceinstitute.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.citationLink}
                >
                  Corporate Finance Institute (CFI) — Commercial Real Estate Financial Modeling Standards
                </a>{' '}
                — Standard formulas for Net Operating Income, Debt Service Coverage Ratio (DSCR), and Internal Rate of Return (IRR).
              </li>
            </ul>
          </section>

          {/* Disclaimer */}
          <div className={styles.disclaimerBox}>
            <strong>Investment Disclaimer:</strong> This calculator provides mathematical simulations for educational, preliminary
            screening, and scenario modeling purposes only. It does not constitute formal real estate appraisals, licensed financial
            counsel, tax advice, or legal underwriting. Rental yields and cash flows depend on local tenancy laws, verified market leases,
            and borrower credit terms. Consult a licensed real estate broker, CPA, and MAI-certified appraiser before executing binding
            contracts.
          </div>

          {/* How We Calculate Section */}
          <HowWeCalculate slug="rental-property-calculator" />

          {/* Related Tools */}
          <section className={styles.section} style={{ marginTop: '36px' }}>
            <h2 className={styles.h2}>Related Real Estate &amp; Business Calculators</h2>
            <p className={styles.p}>
              Explore our connected suite of real estate underwriting and financial calculators:
            </p>
            <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.8' }}>
              <li>
                <Link href={ROUTES.commercialMortgageCalculator.path}>Commercial Mortgage Calculator</Link> — Calculate commercial
                loan balloon balances at maturity, LTV, DSCR, and multi-constraint borrowing capacity.
              </li>
              <li>
                <Link href={ROUTES.capRateCalculator.path}>Cap Rate Calculator</Link> — Calculate commercial capitalization rate,
                property valuation from NOI, and required operating income hurdles.
              </li>
              <li>
                <Link href={ROUTES.airbnbCalculator.path}>Airbnb Profit Calculator</Link> — Calculate short-term rental cash flow,
                nightly ADR, turnover cleaning costs, break-even occupancy, and STR vs. long-term comparison.
              </li>
              <li>
                <Link href={ROUTES.commercialLeaseCalculator.path}>Commercial Lease Calculator</Link> — Calculate commercial rent
                per square foot, NNN &amp; CAM pass-through expenses, escalations, and net effective rent.
              </li>
              <li>
                <Link href={ROUTES.percentageChangeCalculator.path}>Percentage Change Calculator</Link> — Calculate rent growth,
                expense inflation rates, and year-over-year revenue differences.
              </li>
              <li>
                <Link href={ROUTES.squareFootageCalculator.path}>Square Footage Calculator</Link> — Calculate gross building area,
                rentable square footage, and rent per square foot.
              </li>
              <li>
                <Link href={ROUTES.constructionEstimateTemplate.path}>Construction Estimate Template</Link> — Create detailed
                contractor estimates and material budgets for property rehabilitation.
              </li>
              <li>
                <Link href={ROUTES.tools.path}>All KKC Tools Calculators</Link> — Browse our full directory of business, construction,
                and financial tools.
              </li>
            </ul>
          </section>
        </article>
      </main>
    </>
  );
}
