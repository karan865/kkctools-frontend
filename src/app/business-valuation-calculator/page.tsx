import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BusinessValuationCalculator } from '@/components/tool/business-valuation-calculator';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import styles from './page.module.css';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';

export const dynamic = 'force-static';

const route = ROUTES.businessValuationCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const faqs = [
  {
    q: "What is SDE and what does SDE mean?",
    a: "SDE stands for Seller's Discretionary Earnings. It measures the total financial benefit a single full-time owner-operator derives from a small business over a twelve-month period. Business brokerage listing sites (such as BizBuySell) frequently refer to SDE simply as 'Cash Flow'. SDE is calculated by taking pre-tax net profit from your income statement and adding back the owner's salary, personal health and auto perks, discretionary personal expenses, one-time extraordinary costs, depreciation, and interest expenses.",
  },
  {
    q: "How do I calculate SDE?",
    a: "To calculate SDE, begin with your company's pre-tax net income and systematically apply legitimate add-backs: SDE = Net Profit + Owner Salary & Draws + Owner Health & Retirement Perks + Personal/Discretionary Expenses + One-Time Extraordinary Costs + Depreciation & Amortization + Interest Expense. For example, a business with $120,000 in net profit, $80,000 in owner salary, $10,000 in personal health benefits, $5,000 in discretionary vehicle expenses, $8,000 in moving costs, $12,000 in depreciation, and $6,000 in interest generates exactly $241,000 in annual SDE.",
  },
  {
    q: "What is the difference between SDE and EBITDA?",
    a: "The core difference lies in how owner management is accounted for. SDE assumes the buyer will personally run the business as an active owner-operator; therefore, all owner compensation is added back into earnings. EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) assumes the business is managed by a hired executive team. Adjusted EBITDA equals SDE minus the market-rate salary required to hire a replacement general manager. In general, businesses generating under $1M in earnings are valued on SDE, while companies above $1M to $2M EBITDA are valued on EBITDA.",
  },
  {
    q: "How do you determine the value of a small business?",
    a: "Small business valuation typically follows the Market Approach using an earnings multiple: Enterprise Value = Earnings Base (SDE or Adjusted EBITDA) × Industry Valuation Multiple. The multiple reflects the risk profile, transferability, customer concentration, and historical growth rate of the enterprise. The resulting enterprise value is then converted into net owner equity proceeds by deducting outstanding corporate debt, adding retained cash, and reconciling working capital against normal peg requirements.",
  },
  {
    q: "How much can I sell my business for?",
    a: "Your take-home cash from selling your business equals: Net Proceeds = (SDE × Valuation Multiple) − Business Debt to be Extinguished at Close + Retained Cash & Working Capital Adjustments. If your business produces $241,000 in SDE and commands a 2.5× multiple ($602,500 enterprise value), and you pay off $50,000 in equipment notes while keeping $30,000 in cash, you take home approximately $582,500 before advisory fees and capital gains taxes.",
  },
  {
    q: "What multiple do small businesses sell for?",
    a: "There is no single multiple. It is whatever buyers have actually paid for comparable businesses: same industry, similar size, growth and owner involvement. We don’t print industry multiples we can’t cite. Get recent comparable sales from a business broker, a transaction database or a certified valuation analyst, and enter that low–high range in the calculator. Smaller owner-run firms are usually priced on SDE and larger managed firms on EBITDA.",
  },
  {
    q: "What factors increase a business's valuation multiple?",
    a: "Multiples expand toward the high end of the range when a business demonstrates: 1) Low owner dependence (the company operates smoothly when the founder takes a 3-week vacation); 2) High recurring contracted revenue (subscription models or annual service contracts); 3) Low customer concentration (no single client represents more than 10%–15% of annual revenue); 4) Verifiable, audited financial statements; 5) A capable middle management team; and 6) Documented standard operating procedures (SOPs).",
  },
  {
    q: "What add-backs do buyers accept and question?",
    a: "Institutional buyers and SBA lenders readily accept standard add-backs backed by documentation: the primary owner's W-2 wage, one owner's group health insurance, interest expenses, and tax depreciation. Conversely, buyers routinely question or reject aggressive add-backs such as personal travel, family cell phone plans, undocumented cash disbursements, above-market rent paid to an affiliated property entity, or 'future growth potential' adjustments.",
  },
  {
    q: "What is my company worth if it isn't profitable?",
    a: "When a business generates negative or break-even earnings, an income-based multiple cannot be applied. Instead, the business is appraised using the Asset-Based Approach (Net Asset Value): NAV = Fair Market Value of Tangible Assets (Equipment, Machinery, Inventory, Collectible AR, Cash) − Total Outstanding Liabilities. This establishes the liquidation floor value below which the owner should not sell.",
  },
  {
    q: "What is the difference between enterprise value and equity value?",
    a: "Enterprise Value (EV) measures the total operational value of the core business enterprise, free of cash and debt (the asset purchase price). Equity Value represents the actual net cash proceeds the owner receives after settling all balance sheet obligations: Equity Value = Enterprise Value − Debt to be Repaid at Close + Cash Kept by Seller ± Working Capital Adjustment vs Peg.",
  },
  {
    q: "What do P/EBITDA and EV/EBIT mean?",
    a: "P/EBITDA is Price-to-EBITDA, measuring market equity valuation divided by annual EBITDA. EV/EBIT is Enterprise Value divided by Earnings Before Interest and Taxes (operating profit). While SDE multiples are standard for owner-operator small businesses, EV/EBIT and EV/EBITDA are universal institutional metrics used in mid-market private equity and public stock market equity analysis.",
  },
  {
    q: "Do I need a professional business valuation?",
    a: "Online calculators provide essential ballpark estimates for pre-sale planning, succession brainstorming, and financial goal setting. However, formal certified appraisals (conducted by a CVA, ASA, or CPA/ABV) are legally required when securing SBA 7(a) acquisition financing ($350k+ loans), executing formal partner buy-outs, resolving shareholder litigation or divorce proceedings, or establishing tax bases for estate planning.",
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Business Valuation Calculator',
  applicationCategory: 'BusinessApplication',
  path: route.path,
  description: route.description,
});

const faqSchema = buildFaqSchema(faqs);

export default function BusinessValuationCalculatorPage() {
  const breadcrumbItems = [
    { name: 'Calculators', path: ROUTES.tools.path },
    { name: 'Business Valuation Calculator', path: route.path },
  ];

  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={faqSchema} />

      <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
        <Breadcrumbs items={breadcrumbItems} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Business Valuation Calculator: SDE, EBITDA and Multiples</h1>
          <p className={styles.lead}>
            Calculate small business valuation using Seller&rsquo;s Discretionary Earnings (SDE) and Adjusted EBITDA multiples.
            Itemize legitimate add-backs, model balance sheet debt-and-cash adjustments, run valuation sensitivity, and verify your net asset floor.
          </p>
          <div className={styles.meta}>
            <span>International Business Brokers Association (IBBA) Standards</span> &bull; <span>100% Client-Side Engine</span> &bull;{' '}
            <span>Updated November 2026</span>
          </div>
        </header>

        {/* Quick Answer BLUF Box */}
        <div className={styles.blufBox}>
          <strong>Bottom Line Up Front (BLUF):</strong> Most small business valuation starts with one foundational number: <strong>Seller&rsquo;s Discretionary Earnings (SDE)</strong>, multiplied by an industry multiple buyers will pay. To find SDE, add owner salary, personal perks, one-time expenses, depreciation, and interest back to reported net profit. An enterprise with <strong>$241,000 in SDE</strong> at a <strong>2.0× to 3.0× multiple</strong> is worth <strong>$482,000 to $723,000</strong> before debt repayment and cash adjustments.
        </div>

        {/* Interactive Tool Section */}
        <section className={styles.toolSection} aria-label="Interactive Business Valuation Calculator">
          <BusinessValuationCalculator />
        </section>

        <AdSlot slotId="after-tool" />

        {/* Long-Form Authoritative Editorial Guide */}
        <article className={styles.article}>
          {/* Section 1 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Small Business Valuation in One Minute</h2>
            <p className={styles.p}>
              Most small business valuation for owner-operated companies relies on the <strong>Market Approach</strong>. Unlike public conglomerates
              valued on discounted future cash flows or price-to-earnings ratios, private Main Street enterprises trade on a direct multiple of the
              cash flow available to a single working owner:
            </p>
            <div className={styles.formulaBox}>
              Enterprise Value = Seller&rsquo;s Discretionary Earnings (SDE) × Valuation Multiple
            </div>
            <p className={styles.p}>
              For businesses generating under $1,000,000 in annual net earnings—such as HVAC service contractors, plumbing firms, digital marketing agencies,
              independent retail storefronts, and dental clinics—buyers purchase cash flow to replace their corporate wage. If an enterprise generates
              <strong>$200,000 in verifiable SDE</strong> and comparable transactions in that trade close at a <strong>2.5× multiple</strong>, the baseline
              enterprise valuation is <strong>$500,000</strong>.
            </p>
          </section>

          {/* Section 2 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>What is SDE (Seller&rsquo;s Discretionary Earnings)?</h2>
            <p className={styles.p}>
              <strong>Seller&rsquo;s Discretionary Earnings (SDE)</strong>—often labeled simply as <em>Cash Flow</em> or <em>Adjusted Cash Flow</em> on
              business-for-sale marketplaces like BizBuySell—is the normalized pretax financial benefit generated by an enterprise for a single full-time
              owner-operator before interest, taxes, depreciation, and discretionary spending.
            </p>
            <p className={styles.p}>
              Small business owners deliberately minimize reported taxable profit on their IRS tax returns through aggressive deductions: writing off
              company vehicles, family cell phones, travel, and accelerated depreciation. While this reduces corporate tax liability, it makes the P&amp;L
              look artificially weak to prospective buyers. SDE recasts the financial statements to show true earning power:
            </p>
            <div className={styles.formulaBox}>
              SDE = Pre-Tax Net Profit + Owner Salary &amp; Payroll Taxes + Owner Perks &amp; Health Benefits + Discretionary Personal Expenses + One-Off Extraordinary Costs + Depreciation &amp; Amortization + Interest Expense
            </div>
          </section>

          {/* Section 3 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>How to Use This Business Valuation Calculator</h2>
            <p className={styles.p}>
              This calculator provides four integrated valuation perspectives across different ownership models and deal structures:
            </p>
            <ol className={styles.p} style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>SDE (Owner-Run Business):</strong> The standard model for firms where the buyer plans to work full-time as the primary operator.
                Itemize net profit and all standard add-backs to establish baseline cash flow, then apply your comparable multiple range.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>EBITDA (Managed Business):</strong> Tailored for companies generating $1M+ in earnings or absentee-owned businesses.
                The engine takes SDE and deducts the market salary required to hire a replacement General Manager, computing true institutional Adjusted EBITDA.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Asset Check (NAV Floor):</strong> Essential for asset-heavy firms or distressed businesses. Calculates the Net Asset Value (NAV)
                liquidation floor: equipment + inventory + receivables + cash − total liabilities.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Deal Structure:</strong> Models the closing capitalization stack: cash down payment wire at closing, seller-financed promissory note
                installments (with interest and term amortization), and contingent performance earn-outs.
              </li>
            </ol>
          </section>

          {/* Section 4 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Add-Backs: What Buyers Accept and What They Question</h2>
            <p className={styles.p}>
              The integrity of your business valuation hinges entirely on the defendability of your add-backs. During financial due diligence,
              a buyer&rsquo;s CPA and the bank&rsquo;s SBA underwriter will perform a Quality of Earnings (QofE) audit. Add-backs fall into two categories:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Add-Back Category</th>
                    <th>Audit Scrutiny</th>
                    <th>Standard Underwriting Rule</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Primary Owner W-2 / Salary</td>
                    <td><span style={{ color: '#16a34a', fontWeight: 700 }}>Generally Accepted</span></td>
                    <td>100% added back for ONE working owner. If two partners work, only one salary is added back.</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Interest Expense</td>
                    <td><span style={{ color: '#16a34a', fontWeight: 700 }}>Generally Accepted</span></td>
                    <td>Current debt is paid off at closing; buyer secures their own capital structure.</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Depreciation &amp; Amortization</td>
                    <td><span style={{ color: '#16a34a', fontWeight: 700 }}>Generally Accepted</span></td>
                    <td>Non-cash accounting expense added back per standard GAAP procedures.</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Owner Health &amp; Life Insurance</td>
                    <td><span style={{ color: '#16a34a', fontWeight: 700 }}>Generally Accepted</span></td>
                    <td>Direct personal fringe benefit of the primary owner-operator.</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Personal Auto &amp; Cell Phone</td>
                    <td><span style={{ color: '#d97706', fontWeight: 700 }}>Often Scrutinized</span></td>
                    <td>Must prove that vehicles are not required for ongoing commercial operations.</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>One-Off Litigation or Relocation</td>
                    <td><span style={{ color: '#d97706', fontWeight: 700 }}>Often Scrutinized</span></td>
                    <td>Must provide invoices proving the expense will never recur under new ownership.</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Family Members on Payroll</td>
                    <td><span style={{ color: '#dc2626', fontWeight: 700 }}>Strictly Examined</span></td>
                    <td>Only added back if family members perform zero essential business duties.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>SDE vs. EBITDA: When Does the Methodology Shift?</h2>
            <p className={styles.p}>
              A common source of confusion in business valuation is whether to price a company using an SDE multiple or an EBITDA multiple:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Use SDE when:</strong> Annual revenues are under $3,000,000, earnings are under $1,000,000, and the owner is active in daily operations.
                The buyer is typically an individual buying a job and career.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Use EBITDA when:</strong> Annual revenues exceed $5,000,000, earnings exceed $1,000,000, and an executive management layer handles
                daily sales and operations. Buyers are private equity groups, family offices, or strategic corporate competitors who will not sit in the founder&rsquo;s chair.
              </li>
            </ul>
            <div className={styles.formulaBox}>
              Adjusted EBITDA = SDE − Replacement General Manager Salary (Market Rate: $70,000 to $150,000)
            </div>
          </section>

          {/* Section 6 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Choosing a Multiple: What Drives Small Business Valuation Multiples?</h2>
            <p className={styles.p}>
              Valuation multiples reflect risk. Within whatever range your comparable sales show, a business with heavy owner dependence or uneven earnings sits toward the low end;
              one with stable, predictable, transferable cash flow sits toward the high end.
            </p>
            <p className={styles.p}>
              <strong>Where to Find Reliable Comps:</strong> Never rely on unverified internet claims or generic multiples. To determine realistic valuation
              multiples for your specific business, consult:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li><strong>DealStats (Business Valuation Resources):</strong> Subscription database of closed private-company transactions that can be filtered by industry.</li>
              <li><strong>IBBA Market Pulse Reports:</strong> Quarterly benchmarking data published by the International Business Brokers Association.</li>
              <li><strong>BizBuySell Insight Reports:</strong> Quarterly reports summarizing median sale price to SDE ratios across thousands of Main Street sales.</li>
              <li><strong>Certified Valuation Analysts (CVA) or M&amp;A Advisors:</strong> Professional intermediaries with proprietary closed transaction records in your geographic trade area.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Enterprise Value vs. What You Take Home (Equity Value)</h2>
            <p className={styles.p}>
              Enterprise Value (EV) is not the cash wire that enters your personal checking account at closing. Most small business acquisitions are structured
              as <em>Asset Sales</em> on a <strong>Cash-Free, Debt-Free basis</strong>:
            </p>
            <div className={styles.formulaBox}>
              Net Cash Proceeds = Enterprise Value − Funded Debt Repaid at Close + Retained Cash + (Closing Working Capital − Agreed Target Peg)
            </div>
            <p className={styles.p}>
              <strong>Worked Balance Sheet Example:</strong> If your company agrees to an enterprise sale price of <strong>$602,500</strong>:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li>You must pay off your existing equipment term loans and SBA lines of credit (e.g. <strong>−$50,000</strong>).</li>
              <li>You keep the cash balance sitting in your operating bank account (e.g. <strong>+$30,000</strong>).</li>
              <li>If your actual working capital delivered matches the agreed target peg, your net pretax proceeds equal <strong>$582,500</strong>.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>How Much Can I Sell My Business For? (Step-by-Step Guide)</h2>
            <p className={styles.p}>
              To determine your realistic market pricing before listing your company for sale, execute this four-step process:
            </p>
            <ol className={styles.p} style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Normalize 3 Years of Tax Returns:</strong> Pull your last 3 federal tax returns (Form 1120-S or 1065) and compile an itemized add-back schedule.
                Lenders weigh the most recent year heaviest, but look for a 3-year weighted average (50% Year 3, 30% Year 2, 20% Year 1).
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Identify Your Industry Multiple Range:</strong> Review recent closed sales in your trade category. Establish a conservative low and optimistic high multiple.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Evaluate Buyer Financing Feasibility (DSCR Check):</strong> 80%+ of Main Street acquisitions rely on SBA 7(a) loans. For an SBA loan to fund,
                your company&rsquo;s SDE must cover: 1) Debt service on the buyer&rsquo;s loan; 2) A reasonable living wage for the buyer; and 3) A 1.25× DSCR safety buffer.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Structure Seller Financing:</strong> Offering to carry part of the price as a seller note shows confidence to buyers and lenders, expanding your buyer pool
                and helping achieve pricing at the top of your multiple range.
              </li>
            </ol>
          </section>

          {/* Section 9 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Valuing a Trade Business (HVAC &amp; Plumbing Contractor Example)</h2>
            <p className={styles.p}>
              Trade and specialty construction contractors (HVAC, plumbing, electrical, roofing) represent one of the most active M&amp;A categories.
              Evaluating a trade business illustrates how operational drivers dictate multiples:
            </p>
            <p className={styles.p}>
              Consider an HVAC contractor generating $1,500,000 in gross revenue and $250,000 in SDE. Why would one HVAC firm sell for 2.0× SDE ($500,000)
              while an identical competitor commands 3.5× SDE ($875,000)?
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li><strong>The 2.0× Contractor:</strong> 90% of revenue comes from one-off emergency replacement calls. The founder quotes all bids and answers the phones. If the founder leaves, revenues drop 40%.</li>
              <li><strong>The 3.5× Contractor:</strong> 50% of revenue is generated by 1,200 residential preventative maintenance club agreements with automated recurring credit card billing. Two lead technicians handle quotes, and an office dispatcher manages scheduling. The company transfers seamlessly to a new owner.</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Alternative Valuation Approaches: Asset, Market &amp; Income (DCF)</h2>
            <p className={styles.p}>
              Certified business appraisers utilize three core valuation methodologies established by the American Society of Appraisers (ASA):
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>1. The Market Approach (Multiples):</strong> Benchmarks value against comparable actual sales of similar companies. This is the primary
                framework utilized by this calculator and commercial business brokers.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>2. The Income Approach (Discounted Cash Flow - DCF):</strong> Projects future free cash flows across a 5-year forecast horizon and
                discounts them back to present value using a Weighted Average Cost of Capital (WACC). Best for rapidly growing technology firms.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>3. The Asset-Based Approach (Cost):</strong> Restates all assets and liabilities to current Fair Market Value. Primarily used as a
                liquidation floor check for capital-heavy, low-earning companies.
              </li>
            </ul>
          </section>

          {/* Section 11 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Calculator Estimates vs. Certified Professional Appraisals</h2>
            <p className={styles.p}>
              Online valuation tools provide an indispensable starting point for exploratory planning and negotiation preparation. However, you should understand
              when to engage a professional appraisal firm:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li><strong>Pre-Sale Planning &amp; Broker Discussions:</strong> Use this free calculator to benchmark realistic price targets before signing listing agreements.</li>
              <li><strong>SBA Bank Financing &amp; Lender Compliance:</strong> When a buyer secures an SBA 7(a) loan over $350,000, federal regulations require an independent third-party appraisal conducted by a certified appraiser (CVA or AVA).</li>
              <li><strong>Divorce, Partner Disputes &amp; IRS Tax Audits:</strong> Legal proceedings demand formal, written appraisal reports that comply with Uniform Standards of Professional Appraisal Practice (USPAP).</li>
            </ul>
          </section>

          {/* Section 12: FAQ */}
          <section className={styles.faqSection}>
            <h2 className={styles.h2}>Frequently Asked Questions About Business Valuation</h2>
            {faqs.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <details>
                  <summary>{faq.q}</summary>
                  <div className={styles.faqAnswer}>{faq.a}</div>
                </details>
              </div>
            ))}
          </section>

          {/* How We Calculate Component */}
          <HowWeCalculate slug="business-valuation-calculator" />

          {/* Related Tools Cross-Links */}
          <section className={styles.relatedSection}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 16px', color: '#0f172a' }}>
              Related Business Financial &amp; Valuation Tools
            </h2>
            <div className={styles.relatedGrid}>
              <Link href={ROUTES.presentValueCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Present Value &amp; NPV Calculator</div>
                <div className={styles.relatedDesc}>
                  Discount future corporate cash flows, evaluate capital projects, and calculate discounted enterprise values.
                </div>
              </Link>
              <Link href={ROUTES.profitMarginCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Profit Margin Calculator</div>
                <div className={styles.relatedDesc}>
                  Analyze gross, operating, and net margins across complete P&amp;L waterfalls to evaluate earnings health.
                </div>
              </Link>
              <Link href={ROUTES.contributionMarginCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Contribution Margin Calculator</div>
                <div className={styles.relatedDesc}>
                  Calculate unit CM, break-even sales volume, margin of safety, and CVP operating leverage.
                </div>
              </Link>
              <Link href={ROUTES.equipmentLoanCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Equipment Loan Calculator</div>
                <div className={styles.relatedDesc}>
                  Model equipment financing debt service, lease vs buy decisions, and Section 179 depreciation benefits.
                </div>
              </Link>
              <Link href={ROUTES.commercialMortgageCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Commercial Mortgage Calculator</div>
                <div className={styles.relatedDesc}>
                  Calculate commercial property loan payments, balloon payoffs, LTV underwriting, and DSCR limits.
                </div>
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
