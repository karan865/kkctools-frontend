import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CommercialMortgageCalculator } from '@/components/tool/commercial-mortgage-calculator';
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

const route = ROUTES.commercialMortgageCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const faqs = [
  {
    q: 'How is a commercial mortgage payment calculated?',
    a: 'A commercial mortgage payment is calculated using standard loan amortization mathematics based on the loan amount, annual interest rate, and amortization period (typically 20 to 25 years). Even though the loan may mature in 5 or 10 years, monthly payments are calculated as if the debt will be repaid over 25 years: PMT = Principal × [r(1+r)^n] ÷ [(1+r)^n − 1], where r is the monthly interest rate and n is total amortization months.',
  },
  {
    q: 'What is the difference between loan term and amortization?',
    a: 'Amortization is the theoretical timeframe over which principal and interest payments are calculated to reach a zero balance (commonly 20, 25, or 30 years). The loan term is the actual duration of the legal loan contract before the entire remaining balance becomes due (typically 5, 7, or 10 years). When the term is shorter than the amortization, the unpaid balance must be paid in full at maturity as a balloon payment.',
  },
  {
    q: 'What is a balloon payment?',
    a: 'A balloon payment is the remaining unpaid principal balance due in a single lump sum at the end of a commercial loan term. For example, a $1,500,000 loan amortized over 25 years at 7% interest with a 10-year term leaves an unpaid balloon balance of approximately $1,179,501 when the loan contract matures.',
  },
  {
    q: 'What does LTV mean?',
    a: 'LTV stands for Loan-to-Value ratio. It measures the proportion of a commercial property’s appraised market value or purchase price financed through debt: LTV (%) = (Loan Amount ÷ Property Value) × 100. If you acquire a $2,000,000 retail building with a $1,500,000 mortgage, your LTV is exactly 75%. Each lender sets its own maximum LTV, so ask yours and enter it in the Max loan tab.',
  },
  {
    q: 'How much down payment do I need for a commercial property?',
    a: 'Down payment requirements equal 100% minus the lender’s maximum approved LTV. For a property with a 75% maximum LTV, a borrower must provide a 25% cash equity down payment. On a $2,000,000 asset, this requires $500,000 in equity plus additional capital for lender points, appraisal, environmental reports, and closing costs.',
  },
  {
    q: 'What is DSCR and what do lenders look for?',
    a: 'Debt Service Coverage Ratio (DSCR) measures the property’s ability to cover its annual mortgage debt service from Net Operating Income (NOI): DSCR = Annual NOI ÷ Annual Debt Service. Lenders set their own minimum DSCR; the higher the ratio above 1.00×, the bigger the buffer against vacancies or revenue drops.',
  },
  {
    q: 'What is debt yield?',
    a: 'Debt yield is the ratio of annual Net Operating Income (NOI) to total loan principal, expressed as a percentage: Debt Yield = (Annual NOI ÷ Loan Amount) × 100. Unlike DSCR, debt yield is independent of interest rates and amortization schedules. It tells the lender what their annual cash-on-cash return would be if they foreclosed on the property on day one. Lenders that use it set their own minimum.',
  },
  {
    q: 'How much can I borrow for a commercial property?',
    a: 'Your maximum commercial borrowing capacity is governed by the &ldquo;Underwriting Triad&rdquo;: 1) Max LTV limit; 2) Min DSCR requirement; and 3) Min Debt Yield hurdle. Lenders calculate your loan capacity under all three constraints, and whichever yields the lowest dollar figure is your binding maximum approved loan amount.',
  },
  {
    q: 'What is an interest-only period?',
    a: 'An interest-only (IO) period is a designated timeframe (often 12 to 36 months) during which borrower monthly payments cover accrued interest only, with zero reduction in loan principal. IO structures are standard in commercial construction loans and value-add bridge financing while properties undergo renovation or tenant stabilization.',
  },
  {
    q: 'Can I use this as a land payment calculator?',
    a: 'Yes. Commercial land loans utilize the exact same compound amortization formulas. However, because unimproved land generates no operating income and carries higher risk, lenders often ask for more equity and shorter amortization than for income-producing buildings. Enter the terms your lender quotes.',
  },
  {
    q: "Why doesn't this page show current commercial mortgage rates?",
    a: 'Commercial mortgage interest rates are not uniform; they are determined on a case-by-case basis based on asset class, anchor tenant credit, lease duration, market geography, loan sponsor net worth, and underlying benchmark spreads (10-Year Treasury or SOFR). Because KKC Tools operates 100% client-side with zero tracking or remote API lookups, you enter the exact rate quote provided by your lending officer.',
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Commercial Mortgage & LTV Calculator',
  applicationCategory: 'BusinessApplication',
  path: route.path,
  description: route.description,
});

const faqSchema = buildFaqSchema(faqs);

export default function CommercialMortgageCalculatorPage() {
  const breadcrumbItems = [
    { name: 'Calculators', path: ROUTES.tools.path },
    { name: 'Commercial Mortgage Calculator', path: route.path },
  ];

  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={faqSchema} />

      <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
        <Breadcrumbs items={breadcrumbItems} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Commercial Mortgage Calculator: Payment, Balloon, LTV &amp; DSCR</h1>
          <p className={styles.lead}>
            Calculate monthly commercial mortgage debt service, balloon payoff balances, loan-to-value (LTV),
            Debt Service Coverage Ratio (DSCR), debt yield, and maximum borrowing capacity using institutional underwriting standards.
          </p>
          <div className={styles.meta}>
            <span>Commercial Underwriting Standards</span> &bull; <span>100% Client-Side Engine</span> &bull;{' '}
            <span>Updated November 2026</span>
          </div>
        </header>

        {/* Quick Answer BLUF Box */}
        <div className={styles.blufBox}>
          <strong>Bottom Line Up Front (BLUF):</strong> Commercial mortgages are structured with amortizations of 20 to 25 years but actual loan terms of 5 to 10 years, leaving a large balloon balance due at maturity. A $1,500,000 commercial mortgage at 7% APR on a 25-year amortization costs $10,601.69 per month ($127,220/year). After the 10-year term, $1,179,501 remains unpaid and must be refinanced or paid in full.
        </div>

        {/* Interactive Tool Section */}
        <section className={styles.toolSection} aria-label="Commercial Mortgage & LTV Calculator">
          <CommercialMortgageCalculator />
        </section>

        <AdSlot slotId="after-tool" />

        {/* Long-Form Authoritative Editorial Guide */}
        <article className={styles.article}>
          {/* Section 1: How to use */}
          <section className={styles.section}>
            <h2 className={styles.h2}>How to Use This Commercial Mortgage Calculator</h2>
            <p className={styles.p}>
              Financing income-producing real estate—such as office buildings, industrial warehouses, multifamily developments,
              and retail shopping centers—requires specialized debt underwriting. This calculator provides three integrated analysis modes:
            </p>
            <ol className={styles.p} style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Payment &amp; Balloon (Default):</strong> Enter property value, loan amount (or target LTV %), interest rate quote,
                loan term, and amortization period. The engine projects your monthly debt service, balloon balance at maturity, effective APR
                with origination points, and full amortization schedule.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>How Much Can I Borrow? (Max Loan Sizing):</strong> Enter your asset&rsquo;s annual Net Operating Income (NOI) alongside
                lender underwriting limits (Max LTV, Min DSCR, and Min Debt Yield). The engine analyzes all three constraints simultaneously
                and identifies your binding maximum loan amount and required cash equity.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Refinance the Balloon:</strong> Plan ahead for loan maturity. The tool takes your projected balloon balance and models
                refinancing into a secondary commercial loan facility with new interest rates and amortizations.
              </li>
            </ol>
          </section>

          {/* Section 2: How payment is calculated */}
          <section className={styles.section}>
            <h2 className={styles.h2}>How Commercial Mortgage Payments Are Calculated</h2>
            <p className={styles.p}>
              Unlike residential 30-year fixed-rate mortgages that fully amortize to a $0 balance over the life of the loan, commercial loans
              decouple the <em>amortization schedule</em> from the <em>maturity term</em>.
            </p>
            <p className={styles.p}>
              Monthly principal and interest payments are calculated using standard compound annuity formulas over the amortization timeframe
              (commonly 25 years, or 300 monthly payments):
            </p>
            <div className={styles.formulaBox}>
              Monthly Payment (PMT) = P &times; [ r(1 + r)<sup>n</sup> ] &divide; [ (1 + r)<sup>n</sup> &minus; 1 ]
              <br />
              <br />
              Where:
              <br />
              P = Principal Loan Amount ($1,500,000)
              <br />
              r = Monthly Interest Rate (Annual Rate &divide; 12, e.g., 0.07 &divide; 12 = 0.0058333)
              <br />
              n = Total Amortization Months (25 years &times; 12 = 300 months)
            </div>
            <p className={styles.p}>
              Plugging in our baseline parameters ($1.5M loan, 7.00% APR, 300 months):
            </p>
            <div className={styles.formulaBox}>
              PMT = $1,500,000 &times; [ 0.0058333(1.0058333)<sup>300</sup> ] &divide; [ (1.0058333)<sup>300</sup> &minus; 1 ] = <strong>$10,601.69 / month</strong>
            </div>
            <p className={styles.p}>
              Annual debt service equals 12 &times; $10,601.69 = <strong>$127,220.26 per year</strong>.
            </p>
          </section>

          {/* Section 3: Loan term vs amortization */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Loan Term vs. Amortization: Why There Is a Balloon Payment</h2>
            <p className={styles.p}>
              The defining structural feature of commercial real estate finance is that the legal loan term is almost always substantially
              shorter than the amortization period.
            </p>
            <p className={styles.p}>
              Banks, life insurance companies, and CMBS lenders rarely lock long-term interest rates for 25 or 30 years due to interest rate risk
              and asset-liability matching constraints. Instead, lenders issue loans with <strong>5-, 7-, or 10-year terms</strong> while spreading
              payments across a <strong>25-year amortization</strong> to keep monthly debt service affordable for the property&rsquo;s cash flow.
            </p>
            <p className={styles.p}>
              Because payments over the first 10 years are weighted heavily toward interest rather than principal reduction, a large balance remains
              unpaid when the loan matures:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Loan Lifecycle Stage</th>
                    <th>Elapsed Time</th>
                    <th>Cumulative Principal Paid</th>
                    <th>Cumulative Interest Paid</th>
                    <th>Remaining Unpaid Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Loan Closing (Day 1)</td>
                    <td>0 Months</td>
                    <td>$0.00</td>
                    <td>$0.00</td>
                    <td>$1,500,000.00</td>
                  </tr>
                  <tr>
                    <td>Year 5 Midway</td>
                    <td>60 Months</td>
                    <td>$124,534.12</td>
                    <td>$511,567.28</td>
                    <td>$1,375,465.88</td>
                  </tr>
                  <tr>
                    <td><strong>Year 10 Maturity (Balloon)</strong></td>
                    <td><strong>120 Months</strong></td>
                    <td><strong>$320,499.05</strong></td>
                    <td><strong>$951,703.50</strong></td>
                    <td><strong>$1,179,500.95 (Balloon)</strong></td>
                  </tr>
                  <tr>
                    <td>Full Amortization (Hypothetical)</td>
                    <td>300 Months</td>
                    <td>$1,500,000.00</td>
                    <td>$1,680,506.40</td>
                    <td>$0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.p}>
              At Year 10 maturity, the borrower has paid <strong>$320,499.05</strong> in principal, leaving <strong>$1,179,500.95 (78.6% of original loan)</strong> due
              immediately as a balloon payment.
            </p>
          </section>

          {/* Section 4: Interest-only periods */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Interest-Only (IO) Periods in Commercial Financing</h2>
            <p className={styles.p}>
              Many commercial mortgage lenders provide an introductory <strong>Interest-Only (IO)</strong> period spanning 12 to 36 months.
              During an IO window, the borrower is excused from paying principal; monthly payments cover interest charges exclusively:
            </p>
            <div className={styles.formulaBox}>
              Monthly IO Payment = Loan Principal &times; (Annual APR &divide; 12)
              <br />
              Example: $1,500,000 &times; (0.07 &divide; 12) = <strong>$8,750.00 / month</strong>
            </div>
            <p className={styles.p}>
              This saves the sponsor $1,851.69 per month ($22,220 annually) during the critical lease-up or renovation phase. However, because
              zero principal is retired during the IO phase, the remaining loan balance is higher at maturity, resulting in a larger balloon payment.
            </p>
            <p className={styles.p}>
              <strong>Commercial Construction Loans:</strong> During ground-up construction or major structural renovations, loans operate
              on an interest-only draw schedule. Borrowers only pay interest on funds drawn from the construction facility as contractor phases
              are completed. Once construction achieves Certificate of Occupancy and tenant stabilization, the construction loan converts to or
              is refinanced into permanent commercial take-out financing.
            </p>
          </section>

          {/* Section 5: What LTV means */}
          <section className={styles.section}>
            <h2 className={styles.h2}>What LTV (Loan-to-Value) Means for Commercial Property</h2>
            <p className={styles.p}>
              When evaluating loan applications for <strong>buying commercial property</strong>, lenders first inspect the <strong>LTV ratio</strong>.
              LTV measures the financial leverage and collateral safety cushion backing the note:
            </p>
            <div className={styles.formulaBox}>
              Loan-to-Value (LTV %) = (Loan Amount &divide; Appraised Property Value) &times; 100
            </div>
            <p className={styles.p}>
              If a property is acquired or appraised at <strong>$2,000,000.00</strong> and the lender issues a <strong>$1,500,000.00</strong> mortgage:
              <br />
              LTV = ($1,500,000 &divide; $2,000,000) &times; 100 = <strong>75.00%</strong>.
            </p>
            <p className={styles.p}>
              A 75% LTV indicates that the property could suffer a 25% decline in fair market value before the lender&rsquo;s principal capital is exposed
              to loss in foreclosure. For this reason, conventional commercial real estate lenders strictly cap maximum LTVs:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li><strong>Multifamily (Apartments):</strong> 70% to 80% LTV (Fannie Mae / Freddie Mac agency loans)</li>
              <li><strong>Anchored Retail &amp; Industrial:</strong> 65% to 75% LTV</li>
              <li><strong>Office &amp; Hospitality (Hotels):</strong> 55% to 65% LTV (due to higher operating volatility)</li>
              <li><strong>Raw Land / Development:</strong> 50% to 60% LTV</li>
            </ul>
          </section>

          {/* Section 6: DSCR and debt yield */}
          <section className={styles.section}>
            <h2 className={styles.h2}>DSCR and Debt Yield: How Underwriters Size a Commercial Loan</h2>
            <p className={styles.p}>
              While residential mortgages are underwritten based on personal borrower debt-to-income (DTI) and W-2 tax returns,
              commercial mortgages are underwritten based on the property&rsquo;s independent capacity to generate operating cash flow.
              Underwriters evaluate the &ldquo;Underwriting Triad&rdquo;: LTV, DSCR, and Debt Yield.
            </p>

            <h3 className={styles.h3}>1. Debt Service Coverage Ratio (DSCR)</h3>
            <p className={styles.p}>
              DSCR measures the multiple by which annual Net Operating Income (NOI) covers annual debt payments:
            </p>
            <div className={styles.formulaBox}>
              DSCR = Annual Net Operating Income (NOI) &divide; Annual Principal &amp; Interest Debt Service
            </div>
            <p className={styles.p}>
              In our benchmark asset generating <strong>$160,000.00 in annual NOI</strong> with <strong>$127,220.26 in annual debt service</strong>:
              <br />
              DSCR = $160,000 &divide; $127,220.26 = <strong>1.26&times; Coverage</strong>.
              <br />
              This passes the standard institutional threshold of 1.25&times;, confirming that property cash flows exceed mortgage obligations by 26%.
              (If you need to determine your property&rsquo;s exact operating income, use our{' '}
              <Link href={ROUTES.capRateCalculator.path} style={{ color: '#2563eb', fontWeight: 600 }}>
                Cap Rate Calculator
              </Link>{' '}
              to build an itemized NOI schedule).
            </p>

            <h3 className={styles.h3}>2. Debt Yield</h3>
            <p className={styles.p}>
              Institutional lenders (particularly CMBS and life companies) rely on <strong>Debt Yield</strong> to eliminate interest rate distortion:
            </p>
            <div className={styles.formulaBox}>
              Debt Yield (%) = (Annual Net Operating Income &divide; Total Loan Amount) &times; 100
            </div>
            <p className={styles.p}>
              For our baseline:
              <br />
              Debt Yield = ($160,000 &divide; $1,500,000) &times; 100 = <strong>10.67%</strong>.
              <br />
              Because 10.67% exceeds typical lender minimum hurdles (8.5% to 9.5%), the loan satisfies institutional debt yield criteria.
            </p>
          </section>

          {/* Section 7: Fees, points and effective rate */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Origination Fees, Points, and the True Effective APR</h2>
            <p className={styles.p}>
              Commercial mortgages incur substantial closing fees that increase the true cost of capital beyond the nominal note rate:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li><strong>Lender Origination Points:</strong> Typically 0.5% to 1.5% of loan amount (1% on $1.5M = $15,000)</li>
              <li><strong>Appraisal &amp; Feasibility:</strong> $4,000 to $8,000 for MAI commercial valuation</li>
              <li><strong>Phase I Environmental Site Assessment (ESA):</strong> $2,500 to $5,000</li>
              <li><strong>Property Condition Assessment (PCA):</strong> $2,500 to $4,500</li>
              <li><strong>Lender Legal Fees:</strong> $5,000 to $15,000</li>
            </ul>
            <p className={styles.p}>
              Our engine utilizes bisection net present value solving via <code>aprWithFees()</code> to compute your true effective APR across the
              10-year holding period. On a $1,500,000 note at 7.00% with $15,000 in upfront origination points, the true effective borrowing cost is
              approximately <strong>7.15% APR</strong>.
            </p>
          </section>

          {/* Section 8: Refinancing the balloon */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Refinancing the Balloon Payment at Maturity</h2>
            <p className={styles.p}>
              Because few commercial property owners have $1,179,500 in liquid cash sitting idle to pay off a maturing balloon, commercial real
              estate operates on a perpetual refinance cycle. When your balloon matures, you typically execute one of three strategies:
            </p>
            <ol className={styles.p} style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Refinance with Permanent Debt:</strong> Secure a new 5- to 10-year commercial mortgage on the property. If the property
                appreciated in value or rents increased, you can execute a cash-out refinance to pull capital out tax-free.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Property Disposition (Sale):</strong> Sell the asset, using sales proceeds to satisfy the $1.18M balloon and distributing
                remaining equity gains to investors.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Loan Extension / Modification:</strong> If macro interest rates are temporarily elevated or debt markets are tight, lenders
                frequently grant 12- to 24-month loan extensions for a 0.5% to 1.0% extension fee.
              </li>
            </ol>
          </section>

          {/* Section 9: Commercial vs residential mortgages */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Commercial vs. Residential Mortgages: Structural Differences</h2>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Loan Feature</th>
                    <th>Commercial Mortgage</th>
                    <th>Residential Mortgage (Fannie/Freddie)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Underwriting Focus</strong></td>
                    <td>Property NOI, tenant leases, DSCR, and Debt Yield</td>
                    <td>Borrower personal income (W-2), personal DTI, credit score</td>
                  </tr>
                  <tr>
                    <td><strong>Loan Structure</strong></td>
                    <td>5–10 year terms with 20–25 year amortization (Balloon due)</td>
                    <td>Fully amortizing 15- or 30-year fixed loan (Zero balloon)</td>
                  </tr>
                  <tr>
                    <td><strong>Borrower Entity</strong></td>
                    <td>Special Purpose Entity (LLC, LP, Delaware Statutory Trust)</td>
                    <td>Individual natural persons</td>
                  </tr>
                  <tr>
                    <td><strong>Recourse Liability</strong></td>
                    <td>Frequently <strong>Non-Recourse</strong> (with standard &ldquo;bad boy&rdquo; carve-outs)</td>
                    <td>Full Personal Recourse</td>
                  </tr>
                  <tr>
                    <td><strong>Prepayment Penalties</strong></td>
                    <td>Defeasance, Yield Maintenance, or Step-Down (e.g. 5-4-3-2-1%)</td>
                    <td>Zero prepayment penalty by federal law (Dodd-Frank)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 10: What affects commercial mortgage rates */}
          <section className={styles.section}>
            <h2 className={styles.h2}>What Drives Commercial Mortgage Interest Rates?</h2>
            <p className={styles.p}>
              Unlike 30-year residential conforming mortgages that track 10-year Treasuries in lockstep, commercial mortgage pricing is determined
              as an index benchmark plus a credit risk spread:
            </p>
            <div className={styles.formulaBox}>
              Commercial Rate = Benchmark Index (10-Yr Treasury or SOFR) + Lender Credit Spread (150 to 350 bps)
            </div>
            <p className={styles.p}>
              Your loan spread expands or contracts based on:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li><strong>Property Type:</strong> Multifamily and grocery-anchored retail command tighter spreads; unanchored suburban strip malls and older offices carry higher risk premiums.</li>
              <li><strong>Lease Rollover Schedule:</strong> Long-term leases with creditworthy corporate tenants lower lender default risk.</li>
              <li><strong>Sponsor Financial Strength:</strong> Experienced developers with liquid net worth exceeding total loan size receive preferential pricing.</li>
            </ul>
          </section>

          {/* Section 11: FAQ Accordion */}
          <section className={styles.faqSection}>
            <h2 className={styles.h2}>Frequently Asked Questions About Commercial Mortgages</h2>
            {faqs.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <details>
                  <summary>{faq.q}</summary>
                  <div className={styles.faqAnswer}>{faq.a}</div>
                </details>
              </div>
            ))}
          </section>

          {/* Verification & Method Block */}
          <HowWeCalculate slug="commercial-mortgage-calculator" />

          {/* Related Tools Cross-Links */}
          <section className={styles.relatedSection}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 16px', color: '#0f172a' }}>
              Related Real Estate &amp; Commercial Calculators
            </h2>
            <div className={styles.relatedGrid}>
              <Link href={ROUTES.capRateCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Cap Rate Calculator</div>
                <div className={styles.relatedDesc}>
                  Determine property valuation, net operating income (NOI), and capitalization rates.
                </div>
              </Link>
              <Link href={ROUTES.sbaLoanCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>SBA Loan Calculator</div>
                <div className={styles.relatedDesc}>
                  Model SBA 504 bank/CDC two-loan splits and 7(a) small business loans with DSCR cash flow checks.
                </div>
              </Link>
              <Link href={ROUTES.rentalPropertyCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Rental Property Calculator</div>
                <div className={styles.relatedDesc}>
                  Analyze cash-on-cash return, monthly rental cash flow, DSCR, and 10-year wealth projections.
                </div>
              </Link>
              <Link href={ROUTES.commercialLeaseCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Commercial Lease Calculator</div>
                <div className={styles.relatedDesc}>
                  Model triple-net (NNN) pass-through expenses, usable vs rentable area, and free rent concessions.
                </div>
              </Link>
              <Link href={ROUTES.equipmentLoanCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Equipment Loan Calculator</div>
                <div className={styles.relatedDesc}>
                  Calculate equipment financing payments, lease vs buy comparison, balloon payoff, and MCA factor APR.
                </div>
              </Link>
              <Link href={ROUTES.contributionMarginCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Contribution Margin Calculator</div>
                <div className={styles.relatedDesc}>
                  Calculate unit CM, break-even sales volume, margin of safety, and CVP operating leverage.
                </div>
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
