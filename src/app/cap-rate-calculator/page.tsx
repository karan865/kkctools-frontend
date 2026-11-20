import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import CapRateCalculator from '@/components/tool/cap-rate-calculator';
import ToolShell from '@/components/tool/shared/ToolShell';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  noi,
  capRate,
  valueFromCap,
} from '@/lib/real-estate-engine';
import {
  calculateExitValue,
} from '@/lib/cap-rate-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.capRateCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

// Engine-computed reference examples for build-time accuracy
const exBaseRent = 180000;
const exOtherIncome = 3000;
const exBaseNoi = noi({
  grossRent: exBaseRent,
  otherIncome: exOtherIncome,
  vacancyPct: 5,
  expenses: [18000, 6000, 9000, 3000],
  managementPct: 6,
}); // 127,560

const exBasePrice = 2400000;
const exBaseCap = capRate(exBaseNoi, exBasePrice) ?? 5.315; // 5.315%
const exBaseCapFormatted = exBaseCap.toFixed(2); // "5.32"

const exTargetCap = 7.0;
const exValuationAtTarget = valueFromCap(exBaseNoi, exTargetCap) ?? 1822286;

// Exit projection
const exExit = calculateExitValue(exBaseNoi, 3, 5, 6.5);

const faqs = [
  {
    q: 'How do you calculate cap rate?',
    a: `To calculate capitalization rate, divide the property's annual Net Operating Income (NOI) by its total purchase price or current market value, then multiply by 100. The mathematical equation is: Cap Rate % = (Annual NOI ÷ Property Value) × 100. For example, a commercial building generating $127,560 in annual NOI purchased for $2,400,000 has a cap rate of ($127,560 ÷ $2,400,000) × 100 = 5.32%.`,
  },
  {
    q: 'What is the cap rate equation?',
    a: `The fundamental commercial real estate capitalization rate equation is Cap Rate = Net Operating Income (NOI) ÷ Current Market Value (or Acquisition Cost). Rearranging this three-way formula allows investors to solve for property value (Value = NOI ÷ Cap Rate) or determine the necessary income needed to meet an investment hurdle (Required NOI = Value × Cap Rate).`,
  },
  {
    q: 'What is a cap rate in real estate?',
    a: `In real estate, capitalization rate (cap rate) is the un-leveraged rate of return expected on an income-producing property assuming it was purchased entirely with cash. It measures the fundamental operational earning power of the real estate asset relative to its acquisition price, completely independent of mortgage financing, depreciation deductions, and individual income tax circumstances.`,
  },
  {
    q: 'What does a 7% cap rate mean?',
    a: `A 7% cap rate means the property generates 7 cents of net operating income annually for every dollar invested in its purchase ($70,000 annual NOI per $1,000,000 of property value). Taking the inverse (1 ÷ 0.07) reveals a price-to-NOI valuation multiple of 14.29×. In general commercial terms, higher cap rates reflect higher perceived tenant risk, older building age, or secondary geographic markets, whereas lower cap rates represent stable, prime-location assets with high institutional demand.`,
  },
  {
    q: 'What is a good cap rate?',
    a: `There is no universal "good" cap rate because market yields vary directly with asset class (multifamily, industrial, grocery-anchored retail, or suburban office), geographic market tier (primary metro vs. secondary or tertiary cities), lease structure (NNN vs. full-service gross), and credit quality of tenants. A 4.5% cap rate might be an excellent, safe return on a long-term medical office lease in a Tier-1 city, while a value-add warehouse in a tertiary market might require an 8.5% cap rate to compensate for vacancy and leasing risk.`,
  },
  {
    q: 'Does cap rate include the mortgage?',
    a: `No. Cap rate explicitly excludes mortgage payments (debt service), loan interest, and principal amortization. Cap rate evaluates the asset's intrinsic operational performance as if bought for 100% cash. Including debt service distorts asset comparison because loan terms vary by buyer credit, loan-to-value ratio, and lender relationships. To measure returns after debt service, use Cash-on-Cash Return instead.`,
  },
  {
    q: 'How do I estimate a commercial property’s value from NOI?',
    a: `To estimate property value using the income capitalization approach, divide the property's normalized annual Net Operating Income (NOI) by the prevailing market capitalization rate for comparable local assets: Property Value = NOI ÷ Market Cap Rate. For example, if a multi-tenant retail center produces $127,560 in verified NOI and comparable local strip centers trade at a 7.0% cap rate, its estimated commercial valuation is $127,560 ÷ 0.07 = $1,822,286.`,
  },
  {
    q: 'What is pro forma NOI?',
    a: `Pro forma NOI represents projected future net operating income based on stabilized rental rates, scheduled lease renewals, or operational expense efficiencies after an acquisition. It differs sharply from "actual" or "trailing 12-month" (T-12) NOI, which reflects historical dollars already collected and spent. Prudent commercial real estate underwriters evaluate both: T-12 NOI to confirm in-place downside protection, and pro forma NOI to model upside potential.`,
  },
  {
    q: 'Do cap rates go up when interest rates rise?',
    a: `Historically, commercial cap rates correlate positively with benchmark interest rates and 10-year Treasury yields, although often with a multi-quarter time lag. When borrowing costs increase, lenders demand higher debt service coverage, reducing the mortgage amount an asset can support and forcing investors to seek higher cap rate yields (lower asset valuations) to maintain positive financial leverage. However, strong market rental growth can partially offset interest rate expansion.`,
  },
  {
    q: 'Can I use a cap rate to value land?',
    a: `No. Cap rates are strictly designed for income-generating physical improvements with documented tenant cash flows. Vacant or raw commercial land produces zero or negligible operating revenue while incurring holding expenses (property taxes and insurance), rendering income capitalization mathematically ineffective. Raw land is valued using the Sales Comparison Approach (price per acre or square foot of comparable recent land sales) or the Residual Land Value Method.`,
  },
  {
    q: 'Is this calculation an official appraisal?',
    a: `No. This calculator provides an automated mathematical estimation based on the inputs and assumptions you enter. It is intended solely for initial financial screening, underwriting analysis, and scenario modeling. An official commercial property appraisal requires inspection by a certified real estate appraiser (MAI-designated) adhering to Uniform Standards of Professional Appraisal Practice (USPAP), incorporating sales comps, replacement costs, and formal lease audits.`,
  },
];

export default function CapRateCalculatorPage() {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools/' },
    { name: 'Cap Rate Calculator', path: route.path },
  ];

  const webAppSchema = buildWebApplicationSchema({
    name: 'Cap Rate Calculator – Commercial Property Value & NOI',
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
          <h1 className={styles.h1}>Cap Rate Calculator: Cap Rate, NOI and Property Value</h1>
          <p className={styles.lead}>
            Free commercial real estate capitalization rate calculator. Solve for un-leveraged cap rate yield, estimate
            fair commercial property value from NOI, or calculate required operating income across residential,
            multi-family, retail, and industrial properties.
          </p>
          <p className={styles.meta}>
            Updated for 2026 · Pure Client-Side Real Estate Math · Zero Data Transferred
          </p>
        </header>

        {/* BLUF Answer Block */}
        <div className={styles.blufBox}>
          <strong>Quick Answer (BLUF):</strong> Cap rate = net operating income ÷ property price × 100. A building with{' '}
          <strong>${exBaseNoi.toLocaleString('en-US')}</strong> of annual NOI priced at{' '}
          <strong>${(exBasePrice / 1000000).toFixed(1)} million</strong> has a <strong>{exBaseCapFormatted}%</strong> cap
          rate. Turn the formula around to estimate fair commercial property value: <strong>Value = NOI ÷ Cap Rate</strong>
          . At a {exTargetCap}% market cap rate, that same ${exBaseNoi.toLocaleString('en-US')} NOI delivers a{' '}
          <strong>${Math.round(exValuationAtTarget).toLocaleString('en-US')}</strong> valuation.
        </div>

        {/* Ad slot before interactive tool */}
        <AdSlot slotId="cap-rate-top" />

        {/* Interactive Tool wrapped in shared ToolShell */}
        <section className={styles.toolSection} aria-label="Interactive Cap Rate & Property Value Tool">
          <ToolShell
            features={[
              '3 ways to solve',
              'NOI builder',
              '7×5 sensitivity matrix',
              '5-yr exit valuation',
            ]}
          >
            <CapRateCalculator />
          </ToolShell>
        </section>

      {/* In-depth Authoritative Content Guide */}
      <article className={styles.article}>
        {/* Section 1 */}
        <section className={styles.section}>
          <h2 className={styles.h2}>How to Use the Cap Rate Calculator</h2>
          <p className={styles.p}>
            Commercial real estate underwriting requires evaluating assets from multiple angles depending on whether
            you are acquiring, pricing, refinancing, or negotiating a commercial or multi-family property. Our
            calculator provides three interconnected solve modes:
          </p>
          <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', lineHeight: '1.75' }}>
            <li>
              <strong>Cap Rate (Solve Yield):</strong> Enter the property&apos;s annual Net Operating Income (NOI) and the
              purchase or asking price. The calculator delivers the un-leveraged cash-on-cash yield and investment
              multiples.
            </li>
            <li>
              <strong>Property Value (Solve Price):</strong> Enter the in-place or projected NOI and your local market
              cap rate (derived from comparable recent sales). The tool computes the commercial property value
              indicated by the income capitalization approach.
            </li>
            <li>
              <strong>Required NOI (Target Yield):</strong> Enter your acquisition budget and minimum investment hurdle
              cap rate. The tool determines the exact net operating income required to achieve your target yield.
            </li>
          </ul>
          <p className={styles.p}>
            If you already know your property&apos;s normalized income, select <em>&quot;I know my NOI&quot;</em> for rapid single-field
            analysis. If you are analyzing a rent roll or property brochure, select <em>&quot;Build my NOI&quot;</em> to itemize unit
            rents, square footage rates, laundry/parking income, vacancy loss, and operating expense line items.
          </p>
        </section>

        {/* Section 2 */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Cap Rate Equation: How to Calculate Cap Rate</h2>
          <p className={styles.p}>
            The capitalization rate equation is the cornerstone of commercial real estate finance. It establishes the
            direct mathematical relationship between an asset&apos;s net operational cash flow and its capital value:
          </p>
          <div className={styles.formulaBox}>
            <strong>Cap Rate Equation:</strong>
            <br />
            Cap Rate (%) = [ Net Operating Income (NOI) ÷ Property Purchase Price ] × 100
            <br />
            <br />
            <strong>Worked Example (Our Engine Defaults):</strong>
            <br />
            1. Gross Rental Income: 10 units × $1,500/mo × 12 months = $180,000/yr
            <br />
            2. Plus Other Income: Laundry &amp; Parking = +$3,000/yr
            <br />
            3. Less Vacancy &amp; Credit Loss (5% on rent): −$9,000/yr
            <br />
            4. Effective Gross Income (EGI): $180,000 + $3,000 − $9,000 = $174,000/yr
            <br />
            5. Less Operating Expenses: Tax ($18k) + Ins ($6k) + Repairs ($9k) + Reserves ($3k) + Mgmt ($10,440) = −$46,440/yr
            <br />
            6. Net Operating Income (NOI): $174,000 − $46,440 = $127,560/yr
            <br />
            7. Cap Rate: ($127,560 ÷ $2,400,000) × 100 = <strong>{exBaseCapFormatted}%</strong>
          </div>
          <p className={styles.p}>
            Because cap rate represents the un-leveraged yield of the physical asset, it allows commercial brokers,
            lenders, and private investors to compare real estate investments across different capital structures,
            financing packages, and state tax situations on an identical baseline.
          </p>
        </section>

        {/* Section 3 */}
        <section className={styles.section}>
          <h2 className={styles.h2}>What is a Cap Rate in Real Estate?</h2>
          <p className={styles.p}>
            A capitalization rate represents the percentage rate of return an investor would earn on a commercial or
            residential investment property in one year if purchased entirely in cash. Think of it as the real estate
            equivalent of an equity dividend yield or a corporate bond yield.
          </p>
          <p className={styles.p}>
            The cap rate also reflects the market&apos;s assessment of risk and future income durability:
          </p>
          <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', lineHeight: '1.75' }}>
            <li>
              <strong>Lower cap rates</strong> (relative to your local market) usually indicate premium &quot;Class A&quot; assets, prime urban
              locations, long-term credit-tenant leases (e.g., corporate bank branches or national pharmacy chains), and
              minimal vacancy risk. Investors accept lower cash returns in exchange for capital safety, liquidity, and
              future appreciation.
            </li>
            <li>
              <strong>Higher cap rates</strong> (relative to your local market) usually signal older &quot;Class C&quot; properties, secondary or
              rural markets, short remaining lease terms, high deferred maintenance, or higher tenant default risk.
              Investors demand higher annual cash flow to compensate for operational uncertainty.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className={styles.section}>
          <h2 className={styles.h2}>How to Calculate NOI: What&apos;s In and What&apos;s Out</h2>
          <p className={styles.p}>
            The single most common error in real estate underwriting is miscalculating Net Operating Income. In commercial
            property finance, NOI measures <em>operational</em> profitability. Capital structure costs, owner tax
            liabilities, and long-term capital replacements must not be mixed into operating expenses.
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Item Description</th>
                  <th>Include in NOI?</th>
                  <th>Why / Underwriting Rule</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Operating Revenue</td>
                  <td>Contractual Tenant Rents</td>
                  <td><span className={styles.badgeYes}>Included</span></td>
                  <td>Base rent roll collected from active leases</td>
                </tr>
                <tr>
                  <td>Operating Revenue</td>
                  <td>Parking, Laundry &amp; Storage Fees</td>
                  <td><span className={styles.badgeYes}>Included</span></td>
                  <td>Recurring ancillary operational property income</td>
                </tr>
                <tr>
                  <td>Revenue Deduction</td>
                  <td>Vacancy &amp; Credit Loss Allowance</td>
                  <td><span className={styles.badgeYes}>Deducted</span></td>
                  <td>Accounts for economic vacancy and tenant uncollectibility</td>
                </tr>
                <tr>
                  <td>Operating Expense</td>
                  <td>Property Taxes &amp; Assessments</td>
                  <td><span className={styles.badgeYes}>Deducted</span></td>
                  <td>Direct municipal operational cost of holding real estate</td>
                </tr>
                <tr>
                  <td>Operating Expense</td>
                  <td>Hazard &amp; Liability Insurance</td>
                  <td><span className={styles.badgeYes}>Deducted</span></td>
                  <td>Required annual casualty coverage</td>
                </tr>
                <tr>
                  <td>Operating Expense</td>
                  <td>Routine Maintenance &amp; Landscaping</td>
                  <td><span className={styles.badgeYes}>Deducted</span></td>
                  <td>Ongoing minor repairs needed to keep the property operational</td>
                </tr>
                <tr>
                  <td>Operating Expense</td>
                  <td>Professional Property Management</td>
                  <td><span className={styles.badgeYes}>Deducted</span></td>
                  <td>Deducted even if self-managed to normalize market value</td>
                </tr>
                <tr>
                  <td>Financing Cost</td>
                  <td>Mortgage Principal &amp; Interest (Debt Service)</td>
                  <td><span className={styles.badgeNo}>Excluded</span></td>
                  <td>Specific to the buyer&apos;s loan, not the asset&apos;s physical operations</td>
                </tr>
                <tr>
                  <td>Capital Expense</td>
                  <td>Roof Replacement / Structural Addition</td>
                  <td><span className={styles.badgeNo}>Excluded</span></td>
                  <td>Capital expenditures (CapEx) are capitalized and depreciated over time</td>
                </tr>
                <tr>
                  <td>Accounting Non-Cash</td>
                  <td>Depreciation &amp; Amortization</td>
                  <td><span className={styles.badgeNo}>Excluded</span></td>
                  <td>Non-cash tax accounting deductions do not consume operating cash</td>
                </tr>
                <tr>
                  <td>Owner Entity</td>
                  <td>Income Taxes (Federal / State)</td>
                  <td><span className={styles.badgeNo}>Excluded</span></td>
                  <td>Taxes depend on the owner&apos;s tax bracket and entity structure</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5 */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Commercial Property Value from NOI</h2>
          <p className={styles.p}>
            Professional commercial appraisers, institutional lenders, and Real Estate Investment Trusts (REITs)
            primarily value income properties using the direct capitalization method. Rather than relying on emotional
            residential bidding, commercial building valuation is determined by answering: <em>&quot;How much income does this
            building generate, and what return yield does the market require to hold that income stream?&quot;</em>
          </p>
          <div className={styles.formulaBox}>
            <strong>Direct Capitalization Formula:</strong>
            <br />
            Commercial Property Value = Net Operating Income (NOI) ÷ Market Cap Rate
            <br />
            <br />
            <strong>Valuation Example:</strong>
            <br />
            A multi-family apartment building produces <strong>${exBaseNoi.toLocaleString('en-US')}</strong> in stabilized annual NOI.
            <br />
            • In an aggressive 5.0% cap rate market: ${exBaseNoi.toLocaleString('en-US')} ÷ 0.05 = <strong>$2,551,200</strong>
            <br />
            • In a moderate 6.0% cap rate market: ${exBaseNoi.toLocaleString('en-US')} ÷ 0.06 = <strong>$2,126,000</strong>
            <br />
            • In a conservative 7.0% cap rate market: ${exBaseNoi.toLocaleString('en-US')} ÷ 0.07 = <strong>$1,822,286</strong>
          </div>
          <p className={styles.p}>
            Notice that a mere 1.0% shift in market cap rate alters the property&apos;s valuation by over $300,000. This
            demonstrates why understanding local cap rate spreads is vital during contract negotiations and appraisal
            reviews.
          </p>
        </section>

        {/* Section 6 */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Pro Forma vs. Actual (T-12) NOI</h2>
          <p className={styles.p}>
            When reviewing real estate marketing memorandums from commercial brokers, investors encounter two distinct
            financial metrics:
          </p>
          <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', lineHeight: '1.75' }}>
            <li>
              <strong>Trailing 12 Months (T-12 Actual):</strong> The actual dollars received in the landlord&apos;s bank
              account and paid to vendors over the preceding 365 days, verified by income statements and tax returns.
              Lenders size their commercial loans against T-12 actuals.
            </li>
            <li>
              <strong>Pro Forma (Year 1 Forward):</strong> An underwriting projection of what the property <em>could</em> earn
              after renovating units, raising rents to prevailing market levels, billing back utilities (RUBS), or
              reducing bloated management fees.
            </li>
          </ul>
          <p className={styles.p}>
            <strong>Underwriting Rule of Thumb:</strong> Never pay a cap rate based on the broker&apos;s pro forma NOI. If you pay
            for the upside before completing the renovations, you are taking all the renovation execution risk while the
            seller captures all the profit.
          </p>
        </section>

        {/* Section 7 */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Going-in vs. Exit Cap Rate</h2>
          <p className={styles.p}>
            Sophisticated financial models distinguish between the <strong>going-in cap rate</strong> (the yield based
            on Year 1 acquisition price) and the <strong>exit cap rate</strong> (the terminal yield assumed when selling
            the building 5 to 10 years later).
          </p>
          <p className={styles.p}>
            Because buildings age and macro interest rate environments fluctuate, conservative investors apply an
            buffer to their exit cap rate, assuming it will be somewhat higher than the going-in cap rate.
            In our calculator&apos;s exit valuation model, a property generating ${exBaseNoi.toLocaleString('en-US')} NOI with 3%
            annual rent growth will produce <strong>${Math.round(exExit.projectedNoi ?? 147877).toLocaleString('en-US')}</strong> in
            Year 5. Capitalizing that Year 5 income at a conservative 6.5% exit cap rate indicates a disposition price of{' '}
            <strong>${Math.round(exExit.exitValue ?? 2275031).toLocaleString('en-US')}</strong>.
          </p>
        </section>

        {/* Section 8 */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Cap Rate vs. Cash-on-Cash, GRM and IRR</h2>
          <p className={styles.p}>
            Cap rate should never be evaluated in isolation. Different commercial real estate ratios answer different
            questions for an acquisition team:
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Formula</th>
                  <th>What It Measures</th>
                  <th>Best Used For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Cap Rate</strong></td>
                  <td>NOI ÷ Purchase Price</td>
                  <td>Un-leveraged asset earning power</td>
                  <td>Comparing different commercial properties regardless of financing</td>
                </tr>
                <tr>
                  <td><strong>Cash-on-Cash</strong></td>
                  <td>Pre-Tax Cash Flow ÷ Cash Invested</td>
                  <td>Direct return on actual equity out-of-pocket</td>
                  <td>Evaluating leveraged mortgage performance and dividend yields</td>
                </tr>
                <tr>
                  <td><strong>Gross Rent Multiplier (GRM)</strong></td>
                  <td>Property Price ÷ Gross Rent</td>
                  <td>Rough price-to-revenue ratio</td>
                  <td>Quick screening of multi-family listings before running full expenses</td>
                </tr>
                <tr>
                  <td><strong>Internal Rate of Return (IRR)</strong></td>
                  <td>Discount rate where NPV = 0</td>
                  <td>Total annualized return including exit sale proceeds</td>
                  <td>Multi-year institutional investment funds and private syndications</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 9 */}
        <section className={styles.section}>
          <h2 className={styles.h2}>How to Find Local Cap Rates</h2>
          <p className={styles.p}>
            Because cap rates are not published on public government databases like residential home sales, finding
            reliable local capitalization rates requires market legwork:
          </p>
          <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', lineHeight: '1.75' }}>
            <li>
              <strong>Quarterly Broker Reports:</strong> National commercial brokerages (such as CBRE, Colliers, JLL,
              Marcus &amp; Millichap, and Newmark) publish quarterly cap rate surveys segmented by MSA, property sub-type,
              and building vintage.
            </li>
            <li>
              <strong>Recent Closed Sales Comps:</strong> Call active commercial brokers in your immediate sub-market.
              Ask for closed sale comparables and request the confirmed in-place NOI at the time of closing.
            </li>
            <li>
              <strong>Commercial Appraisers:</strong> Licensed MAI appraisers track verified closed transactions and
              underwriting cap rates across local bank appraisals every week.
            </li>
          </ul>
          <p className={styles.p}>
            <em>Note on regional searches (e.g. &quot;cap rate California&quot;):</em> A state-wide cap rate average says little
            about your building, because cap rates differ a lot between high-demand core metros and smaller inland markets,
            and between property types. We don&apos;t print market averages we can&apos;t cite with a date. Always underwrite
            against recent sales in your specific local sub-market.
          </p>
        </section>

        {/* Section 10 */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Common Cap Rate Mistakes to Avoid</h2>
          <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', lineHeight: '1.75' }}>
            <li>
              <strong>The Payback Period Fallacy:</strong> Claiming that a &quot;10% cap rate means the building pays for itself
              in 10 years&quot; assumes zero rent changes, zero tenant vacancy, and zero capital replacements over a decade.
              Cap rate is a single-year snapshot, not a cumulative cash flow projection.
            </li>
            <li>
              <strong>Using Gross Income Instead of NOI:</strong> Confusing gross yield (Rent ÷ Price) with cap rate (NOI
              ÷ Price) artificially inflates your perceived return and leads to severe overpayment on properties with
              heavy utility, insurance, or tax burdens.
            </li>
            <li>
              <strong>Deducting Mortgage Payments:</strong> Including loan payments in NOI deflates your cap rate and
              makes leveraged deals appear artificially weak compared to cash purchases.
            </li>
            <li>
              <strong>Ignoring Replacement Reserves:</strong> Failing to allocate reserves ($250 to $500 per unit per
              year for multi-family; $0.15 to $0.35 per sq ft for commercial) masks true long-term roof, parking lot, and
              HVAC capital expenditures.
            </li>
          </ul>
        </section>

        {/* Section 11: FAQ */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <h3 className={styles.faqQ}>{faq.q}</h3>
                <p className={styles.faqA}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <div className={styles.disclaimerBox}>
          <strong>Underwriting Disclaimer:</strong> This calculator provides mathematical estimates for educational and
          preliminary investment screening purposes only. It does not constitute formal commercial property appraisal,
          financial analysis, tax advice, or legal guidance. Commercial property values depend on verified lease
          structures, tenant creditworthiness, physical building condition, and local zoning laws. Consult a licensed MAI
          appraiser, commercial real estate attorney, and CPA before entering into binding real estate transactions.
        </div>

        {/* How We Calculate Section */}
        <HowWeCalculate slug="cap-rate-calculator" />

        {/* Related Real Estate & Business Tools */}
        <section className={styles.section} style={{ marginTop: '36px' }}>
          <h2 className={styles.h2}>Related Real Estate &amp; Business Math Calculators</h2>
          <p className={styles.p}>
            Explore our companion calculators for commercial property underwriting and business planning:
          </p>
          <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.8' }}>
            <li>
              <Link href={ROUTES.presentValueCalculator.path}>
                Present Value &amp; NPV Calculator
              </Link>{' '}
              — Discount multi-year property cash flows, terminal residual values, and capital project hurdles.
            </li>
            <li>
              <Link href={ROUTES.commercialMortgageCalculator.path}>
                Commercial Mortgage Calculator
              </Link>{' '}
              — Model balloon payments, LTV, DSCR coverage, and maximum commercial loan capacity.
            </li>
            <li>
              <Link href={ROUTES.rentalPropertyCalculator.path}>
                Rental Property Calculator
              </Link>{' '}
              — Calculate residential and multi-family cash-on-cash return, cash flow, DSCR, and 10-year pro forma equity.
            </li>
            <li>
              <Link href={ROUTES.airbnbCalculator.path}>
                Airbnb Profit Calculator
              </Link>{' '}
              — Model vacation rental nightly rates, occupancy, cleaning fees, and short-term hospitality cash flow.
            </li>
            <li>
              <Link href={ROUTES.commercialLeaseCalculator.path}>
                Commercial Lease Calculator
              </Link>{' '}
              — Calculate commercial rent per square foot, NNN and CAM pass-throughs, annual escalations, and net effective rent.
            </li>
            <li>
              <Link href={ROUTES.percentageChangeCalculator.path}>
                Percentage Change Calculator
              </Link>{' '}
              — Measure rent growth, revenue fluctuations, and year-over-year NOI shifts.
            </li>
            <li>
              <Link href={ROUTES.squareFootageCalculator.path}>
                Square Footage Calculator
              </Link>{' '}
              — Calculate gross building area, rentable square feet, and cost per square foot.
            </li>
            <li>
              <Link href={ROUTES.constructionEstimateTemplate.path}>
                Construction Estimate Template
              </Link>{' '}
              — Model tenant improvement (TI) budgets and commercial capital expenditure build-outs.
            </li>
            <li>
              <Link href={ROUTES.tools.path}>All KKC Tools Calculators</Link> — Browse our full directory of construction and business tools.
            </li>
          </ul>
        </section>
      </article>
    </main>
    </>
  );
}
