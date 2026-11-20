import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { EquipmentLoanCalculator } from '@/components/tool/equipment-loan-calculator';
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

const route = ROUTES.equipmentLoanCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const faqs = [
  {
    q: 'How is an equipment loan payment calculated?',
    a: 'An equipment loan payment is calculated using standard compound amortization formulas based on net amount financed (equipment purchase price + sales tax + documentation fees − down payment − trade-in allowance), annual interest rate (APR), and loan term. The monthly payment formula is PMT = P × [r(1+r)^n] ÷ [(1+r)^n − 1], where P is amount financed, r is monthly interest rate, and n is number of monthly installments. If the loan structure includes a balloon balance at maturity, the payment is lowered to amortize only the difference between principal and the present value of the balloon.',
  },
  {
    q: 'Should I lease or finance equipment?',
    a: 'Financing is best when you plan to keep the machinery long-term (5+ years), want to claim full depreciation tax write-offs through IRS Section 179, and desire 100% equity retention when payments conclude. Leasing is optimal when you want to minimize upfront cash requirements, need to preserve working capital credit lines, upgrade technology every 2 to 3 years to avoid obsolescence, or prefer treating monthly payments as 100% deductible operating expenses on your business income statement.',
  },
  {
    q: "What's the difference between a finance lease and an operating lease?",
    a: 'Under accounting standards (ASC 842 / IFRS 16), a finance lease (capital lease) transfers substantially all ownership benefits and risks to the lessee, commonly featuring a nominal $1 buyout at lease end where you keep the machine. An operating lease is a rental structure where the lessor retains asset ownership and salvage risk; at maturity, you either return the machinery, purchase it at Fair Market Value (FMV), or extend the lease term.',
  },
  {
    q: 'How much down payment do I need for an equipment loan?',
    a: 'It depends on the lender, your time in business, your credit and the equipment. Easy-to-resell equipment and established businesses usually need less down; start-ups and specialised machines usually need more. Ask lenders for quotes and enter the down payment they require.',
  },
  {
    q: 'What is a balloon payment on equipment financing?',
    a: 'A balloon payment is an agreed-upon lump-sum balance due at the end of the loan term. By deferring part of the loan principal to final maturity, your monthly payments during the operational life of the equipment are substantially reduced, freeing up monthly cash flow. When the balloon matures, you pay the balance in cash, sell or trade in the machine to cover the payoff, or refinance into a secondary loan.',
  },
  {
    q: 'What is a $1 buyout lease vs an FMV lease?',
    a: 'A $1 buyout lease functions identically to an equipment loan: you pay higher monthly lease payments, but once the lease term expires, you purchase full legal title for exactly $1.00. A Fair Market Value (FMV) lease offers lower monthly payments because you only pay for the expected depreciation of the machine; at term end, buying it requires paying its fair market value at that time.',
  },
  {
    q: 'Can I use this as a farm loan calculator?',
    a: 'Yes. Agricultural machinery financing often utilizes seasonal payment structures due to crop harvest and livestock sale cycles. This calculator features an annual and semi-annual payment frequency selector specifically calibrated for tractors, combines, grain dryers, and implement loans, amortizing debt service across yearly farm revenue events.',
  },
  {
    q: 'How do I convert an MCA factor rate to an APR?',
    a: 'Merchant Cash Advances (MCAs) quote costs as a decimal factor rate (e.g. 1.35 on a $50,000 advance equals $67,500 total payback). Because the $17,500 financing fee is fixed and repaid rapidly through daily or weekly ACH deductions from business revenue over a short period (such as 6 months), the principal balance declines while the fee remains constant. Converting that into an annual rate (as the MCA tab does) often shows a far higher APR than the factor rate suggests: in this page’s example, about 127.9%.',
  },
  {
    q: 'How does a business line of credit payment work?',
    a: 'A business line of credit (LOC) is a revolving borrowing facility. During the active draw period, you only make monthly interest payments on the precise dollar amount drawn—undrawn credit incurs zero interest. Once the draw window closes or you enter repayment, the outstanding principal converts into an amortizing term loan with fixed monthly payments of principal and interest over 12 to 60 months.',
  },
  {
    q: 'Are equipment loans tax-deductible?',
    a: 'Yes, through two distinct mechanisms: 1) Interest paid on business equipment loans is deductible as an ordinary business operating expense; and 2) The purchase price of qualifying new or used commercial machinery can often be 100% written off upfront in the year acquired under IRS Section 179 and Bonus Depreciation rules. Consult your tax professional regarding annual capital expenditure caps.',
  },
  {
    q: 'Will the equipment pay for itself?',
    a: 'Equipment pays for itself when the incremental monthly cash flow it generates—either through new billable revenue or internal operational savings (such as eliminating high third-party subcontractor fees)—exceeds its monthly debt service and operating expenses. Our built-in ROI module models upfront equity against monthly net benefit to project your exact break-even payback period in months.',
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Equipment Loan Calculator',
  applicationCategory: 'BusinessApplication',
  path: route.path,
  description: route.description,
});

const faqSchema = buildFaqSchema(faqs);

export default function EquipmentLoanCalculatorPage() {
  const breadcrumbItems = [
    { name: 'Calculators', path: ROUTES.tools.path },
    { name: 'Equipment Loan Calculator', path: route.path },
  ];

  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={faqSchema} />

      <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
        <Breadcrumbs items={breadcrumbItems} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Equipment Loan Calculator: Payments for Equipment and Business Loans</h1>
          <p className={styles.lead}>
            Calculate monthly equipment financing payments, total interest, and complete amortization schedules.
            Compare equipment loans against leasing and cash, model Section 179 tax benefits, and convert MCA factor rates into true APR.
          </p>
          <div className={styles.meta}>
            <span>Equipment Leasing &amp; Finance Association (ELFA) Standards</span> &bull; <span>100% Client-Side Engine</span> &bull;{' '}
            <span>Updated November 2026</span>
          </div>
        </header>

        {/* Quick Answer BLUF Box */}
        <div className={styles.blufBox}>
          <strong>Bottom Line Up Front (BLUF):</strong> Your equipment loan payment depends on the amount financed (purchase price + sales tax + fees − down payment − trade-in equity), the annual interest rate, and the term. Financing <strong>$75,300</strong> ($80,000 machinery + 6% tax + $500 doc fees − $10,000 cash down) at <strong>8.5% APR</strong> over a <strong>60-month term</strong> costs <strong>$1,544.89 per month</strong> and <strong>$17,394</strong> in total financing interest.
        </div>

        {/* Interactive Tool Section */}
        <section className={styles.toolSection} aria-label="Interactive Equipment Loan Calculator">
          <EquipmentLoanCalculator />
        </section>

        <AdSlot slotId="after-tool" />

        {/* Long-Form Authoritative Editorial Guide */}
        <article className={styles.article}>
          {/* Section 1 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>How to Use This Equipment Loan Calculator</h2>
            <p className={styles.p}>
              Acquiring productive commercial equipment—such as excavators, skid steers, CNC milling machinery, medical imaging systems,
              commercial trucks, and agricultural tractors—is fundamental to scaling operational capacity. This calculator provides four
              integrated financing analysis modes tailored to commercial decision-making:
            </p>
            <ol className={styles.p} style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Equipment Loan (Default):</strong> Enter machinery price, local sales tax %, lender documentation fees, cash down payment,
                and trade-in allowance. The engine computes your net amount financed, periodic payment, total interest, and effective APR. It supports
                monthly, quarterly, semi-annual, and annual payment schedules, along with an optional balloon payoff at maturity.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Lease vs Loan vs Cash:</strong> Compare all three acquisition pathways side-by-side. See upfront capital outlays, lifetime
                cash outflows, ownership title at maturity ($1 buyout vs FMV return), and total net cost after salvage resale value.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Business Line of Credit:</strong> Model revolving credit facility requirements. Calculate interest-only carrying costs
                during active draw periods alongside amortizing monthly repayment schedules when term loans commence.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Merchant Cash Advance (MCA):</strong> Demystify high-cost working capital. Enter funding advance and factor rate to compute
                daily or weekly remittance debits and convert confusing factor pricing into annualized nominal and compounding APR.
              </li>
            </ol>
          </section>

          {/* Section 2 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Equipment Loan Payment Formula &amp; Mathematical Example</h2>
            <p className={styles.p}>
              Equipment loans are structured as fixed-rate installment contracts governed by standard compound amortization mathematics.
              Before computing debt service, you must establish the exact principal amount financed by accounting for acquisition overhead and credits:
            </p>
            <div className={styles.formulaBox}>
              Amount Financed = Purchase Price × (1 + Sales Tax %) + Lender Fees − Cash Down Payment − Trade-In Allowance
            </div>
            <p className={styles.p}>
              Once net principal is established, periodic installment payments are calculated using the standard annuity formula:
            </p>
            <div className={styles.formulaBox}>
              PMT = Principal × [ r(1 + r)^n ] ÷ [ (1 + r)^n − 1 ]
            </div>
            <p className={styles.p}>
              Where <em>r</em> represents the periodic interest rate (annual APR ÷ payment periods per year) and <em>n</em> represents the total
              number of scheduled installments across the loan lifetime.
            </p>
            <p className={styles.p}>
              <strong>Worked Mathematical Baseline:</strong> Consider a contractor purchasing an <strong>$80,000</strong> mini-excavator in a state with
              a <strong>6.0%</strong> sales tax rate ($4,800) and <strong>$500</strong> in lender documentation and UCC-1 lien filing fees. Providing a
              <strong>$10,000</strong> cash down payment results in a net amount financed of <strong>$75,300</strong> ($80,000 + $4,800 + $500 − $10,000).
              At an <strong>8.50%</strong> annual interest rate over a <strong>60-month</strong> term (5 years), the monthly periodic rate is
              0.085 ÷ 12 = 0.0070833. Compounding across 60 months produces an exact monthly payment of <strong>$1,544.89</strong>, yielding
              <strong>$92,693.40</strong> in total lifetime payments and <strong>$17,393.40</strong> in total financing interest.
            </p>
          </section>

          {/* Section 3 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Down Payments, Trade-In Equity, and Balloon Financing</h2>
            <p className={styles.p}>
              Commercial lenders require equity skin-in-the-game to protect against rapid equipment depreciation and default risk. Understanding how
              equity levers alter debt service is essential when structuring quotes:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Cash Down Payment:</strong> Lenders set the down payment they require. Injecting cash equity directly reduces financed
                principal dollar-for-dollar, decreasing monthly debt service and lowering the lender&rsquo;s loan-to-value (LTV) exposure.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Trade-In Allowance:</strong> Trading in aged equipment functions identically to a cash down payment. If a dealer grants you
                $15,000 for an older skid steer, that equity reduces your taxable purchase basis in many states and offsets the required cash injection.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Balloon Payment Structures:</strong> For seasonal contractors or capital-constrained firms, lenders offer balloon structures.
                By deferring a lump-sum balance (e.g. $15,000 to $25,000) to final maturity, monthly installments are calculated as if amortizing a smaller
                principal balance. At the end of the term, you must pay the balloon in cash, refinance it into a secondary facility, or trade in the
                machinery toward a newer model.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Lease vs Finance vs Paying Cash: Which Strategy Wins?</h2>
            <p className={styles.p}>
              Business owners frequently debate whether to buy equipment with cash, finance through an equipment loan, or execute a commercial lease.
              Each strategy optimizes for different financial priorities:
            </p>
            <div style={{ overflowX: 'auto', margin: '20px 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-2, #f8fafc)', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Acquisition Path</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Upfront Cash Outflow</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Monthly Debt Outflow</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Ownership at Maturity</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Tax Treatment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700 }}>Cash Purchase</td>
                    <td style={{ padding: '10px 14px' }}>Highest (100% price + tax)</td>
                    <td style={{ padding: '10px 14px' }}>$0.00 / month</td>
                    <td style={{ padding: '10px 14px' }}>Immediate 100% Title</td>
                    <td style={{ padding: '10px 14px' }}>Section 179 + MACRS depreciation</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700 }}>Equipment Loan</td>
                    <td style={{ padding: '10px 14px' }}>Moderate (10%–20% down)</td>
                    <td style={{ padding: '10px 14px' }}>Moderate (P &amp; I amortized)</td>
                    <td style={{ padding: '10px 14px' }}>Owned upon loan payoff</td>
                    <td style={{ padding: '10px 14px' }}>Interest expense + Sec 179 write-off</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700 }}>Equipment Lease</td>
                    <td style={{ padding: '10px 14px' }}>Lowest (1st mo + doc fee)</td>
                    <td style={{ padding: '10px 14px' }}>Lowest to Moderate</td>
                    <td style={{ padding: '10px 14px' }}>$1 Buyout or Return FMV</td>
                    <td style={{ padding: '10px 14px' }}>100% deductible operating expense</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.p}>
              <strong>The True Lifecycle Cost:</strong> While paying cash avoids financing interest, tying up $80,000 in working capital can starve your business
              of cash needed for emergency payroll, inventory purchases, or contractor bonds. Equipment loans offer a middle ground: preserving most
              of your liquid liquidity while building tangible asset equity on your corporate balance sheet.
            </p>
          </section>

          {/* Section 5 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Will the Equipment Pay for Itself? (Payback &amp; ROI Modeling)</h2>
            <p className={styles.p}>
              Productive machinery should never be viewed as an overhead expense; it is a revenue-generating capital investment. Equipment pays for itself
              when incremental operational cash flow exceeds debt service:
            </p>
            <div className={styles.formulaBox}>
              Net Monthly Cash Flow = Monthly Revenue / Subcontractor Savings − Monthly Operating Expenses − Monthly Loan Payment
            </div>
            <p className={styles.p}>
              For example, suppose purchasing an $80,000 backhoe allows your construction firm to internalize trenching rather than paying a subcontractor
              $4,000 per month. If monthly fuel, insurance, and routine maintenance total $800, your net operating cash flow is $3,200/month.
              Deducting your $1,544.89 monthly loan payment leaves <strong>$1,655.11 in net positive monthly cash flow</strong> from day one.
              Dividing your initial $10,500 cash investment (down payment + fees) by $1,655.11 reveals a rapid <strong>6.3-month capital payback period</strong>,
              delivering an astounding <strong>189% annualized cash-on-cash return</strong>.
            </p>
          </section>

          {/* Section 6 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Heavy Equipment, Construction &amp; Farm Equipment Financing</h2>
            <p className={styles.p}>
              Different industrial sectors require distinct financing underwriting conventions:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Heavy &amp; Construction Equipment:</strong> Yellow-iron machinery (Caterpillar, Komatsu, Bobcat, Deere) retains robust resale value
                due to active secondary auction markets. Consequently, lenders comfortably write 60- to 72-month terms on new units, with LTVs up to 100% for
                experienced operators with active bonded jobs.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Farm &amp; Agricultural Machinery:</strong> Crop and livestock farming cash flow is inherently seasonal. Agricultural lenders
                (Farm Credit System, AgDirect) structure debt with <strong>annual or semi-annual installment payments</strong> timed to align with harvest
                settlements in the autumn. Our tool includes an agricultural frequency toggle to calculate exact annual farm debt service.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Medical &amp; Dental Equipment:</strong> Practice equipment (chairs, digital X-ray, surgical lasers) carries high purchase costs ($150,000+)
                with minimal salvage value. Specialized practice lenders frequently offer extended 7- to 10-year amortizations with 6-month deferred payment
                windows while patient volume ramps up.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Business Loans and Lines of Credit (LOC)</h2>
            <p className={styles.p}>
              When financing generalized operational expansion rather than titled equipment, commercial enterprises evaluate term loans versus revolving lines of credit:
            </p>
            <p className={styles.p}>
              A <strong>Business Line of Credit (LOC)</strong> provides a revolving capital reserve. You pay interest strictly on funds currently drawn.
              For example, on a $100,000 credit line with $40,000 drawn at 9.5% APR, your monthly carrying cost is just $316.67 in interest-only servicing.
              The remaining $60,000 available limit incurs zero interest until deployed. When cash flow stabilizes, you repay the draw, instantly replenishing
              your borrowing capacity.
            </p>
          </section>

          {/* Section 8 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Merchant Cash Advance (MCA): Factor Rate vs. True APR</h2>
            <p className={styles.p}>
              When conventional banks reject loan applications, many small businesses turn to Merchant Cash Advances (MCAs). MCAs market their financing
              using <em>factor rates</em> rather than annual percentage rates (APRs), obscuring the true cost of capital:
            </p>
            <div className={styles.formulaBox}>
              Total Payback = Advance Amount × Factor Rate (e.g. $50,000 × 1.35 = $67,500)
            </div>
            <p className={styles.p}>
              While a 1.35 factor sounds like &ldquo;35% interest,&rdquo; the advance is repaid rapidly through daily ACH deductions from your bank account over
              120 to 180 business days. Because your outstanding principal declines daily while the $17,500 fee remains fixed, the effective annualized borrowing
              rate is dramatic: a $50,000 advance with a 1.35 factor repaid over 180 days works out to about a <strong>127.9% nominal APR</strong> (daily rate × 365) and roughly a
              <strong>258% effective annual rate</strong> once daily compounding is counted. Use our MCA calculator tab before signing merchant agreements to verify your true cost of capital.
            </p>
          </section>

          {/* Section 9 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Tax Deductions: IRS Section 179 &amp; Bonus Depreciation</h2>
            <p className={styles.p}>
              The United States tax code provides massive incentives for purchasing business machinery. Under <strong>IRS Section 179</strong>, eligible businesses
              can deduct 100% of the purchase price of qualifying new or used commercial equipment acquired or financed during the tax year.
            </p>
            <p className={styles.p}>
              Because you can deduct the full purchase price in Year 1 even if you financed 90% of the cost with an equipment loan, the immediate tax savings
              frequently exceed your first-year loan payments, creating a net positive cash flow event. For current deduction thresholds, phase-out limits,
              and eligible asset classifications, review the official guidance at{' '}
              <a href="https://www.irs.gov/newsroom/heres-what-businesses-need-to-know-about-the-section-179-deduction" target="_blank" rel="noopener noreferrer" style={{ color: '#0284c7', textDecoration: 'underline' }}>
                IRS.gov Section 179 Overview
              </a>.
            </p>
          </section>

          {/* Section 10: FAQ */}
          <section className={styles.faqSection}>
            <h2 className={styles.h2}>Frequently Asked Questions About Equipment Financing</h2>
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
          <HowWeCalculate slug="equipment-loan-calculator" />

          {/* Related Tools Cross-Links */}
          <section className={styles.relatedSection}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 16px', color: '#0f172a' }}>
              Related Business &amp; Construction Financing Tools
            </h2>
            <div className={styles.relatedGrid}>
              <Link href={ROUTES.commercialMortgageCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Commercial Mortgage Calculator</div>
                <div className={styles.relatedDesc}>
                  Calculate debt service, balloon payments, LTV ratios, and DSCR limits for commercial property loans.
                </div>
              </Link>
              <Link href={ROUTES.commercialLeaseCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Commercial Lease Calculator</div>
                <div className={styles.relatedDesc}>
                  Analyze triple-net (NNN) pass-throughs, rentable square footage, and net effective commercial lease rates.
                </div>
              </Link>
              <Link href={ROUTES.laborCostCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Labor Cost Calculator</div>
                <div className={styles.relatedDesc}>
                  Determine true burdened labor rates, payroll taxes, insurance overhead, and crew project billing rates.
                </div>
              </Link>
              <Link href={ROUTES.constructionEstimateTemplate.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Construction Estimate Template</div>
                <div className={styles.relatedDesc}>
                  Generate professional contractor bids, line-item material lists, labor markups, and printable PDF quotes.
                </div>
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
