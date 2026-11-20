import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import ToolShell from '@/components/tool/shared/ToolShell';
import SbaLoanCalculator from '@/components/tool/sba-loan-calculator';
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

const route = ROUTES.sbaLoanCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const faqs = [
  {
    q: 'What is an SBA 504 loan?',
    a: 'An SBA 504 loan is a specialized small business financing program designed for major fixed-asset investments such as commercial real estate acquisition, construction, modern building renovation, and long-term heavy machinery. Unlike traditional bank debt, an SBA 504 package is structured as two distinct loans: a first-lien loan from a bank and a second-lien loan from a Certified Development Company (CDC) backed by the SBA, plus a cash contribution from you. This calculator uses an editable 50% / 40% / 10% split as an example; confirm the actual split for your project with your lender or CDC (see SBA.gov).',
  },
  {
    q: 'What is the difference between an SBA 504 loan and an SBA 7(a) loan?',
    a: 'The primary difference lies in structure and permissible use of proceeds. The SBA 504 loan is tailored strictly for long-term fixed assets (real estate and long-life equipment), offering below-market fixed interest rates pegged to U.S. Treasury bonds over 10-, 20-, or 25-year terms through a bank/CDC split. In contrast, the SBA 7(a) loan is a flexible general-purpose commercial term loan (up to a $5,000,000 statutory limit) administered by a single lender. It can be used for working capital, business acquisitions (goodwill), inventory, partner buyouts, and refinancing existing debt, but usually carries variable interest rates pegged to the Wall Street Journal Prime Rate plus a lender spread.',
  },
  {
    q: 'How are SBA 504 interest rates determined?',
    a: 'SBA 504 rates are divided into two parts: 1) The commercial bank portion (50% first mortgage), where the interest rate, term, and amortization are negotiated directly between the borrower and the private bank; and 2) The CDC debenture portion (40% second mortgage), which is pegged to an increment above the 10-year U.S. Treasury rate on the date the bond pool debenture is sold to private institutional investors. This debenture rate is fixed for the full 10, 20, or 25-year term and includes ongoing CDC servicing and SBA guarantee fees.',
  },
  {
    q: 'What are the fees associated with an SBA 504 loan?',
    a: 'According to official SBA guidelines, CDC debenture financing fees total approximately 3% of the debenture debt. Crucially, the SBA permits borrowers to finance these upfront CDC fees directly into the debenture loan note, preserving working capital at closing. In addition, the private bank charges its own customary commercial closing fees and underwriting points on the first mortgage.',
  },
  {
    q: 'What is the maximum loan amount for SBA loans?',
    a: 'For SBA 7(a) loans, the statutory maximum gross loan amount is $5,000,000 per borrower. For SBA 504 loans, the CDC debenture portion generally maxes out at $5,000,000 for standard commercial projects, or up to $5,500,000 for small manufacturers and projects meeting designated green energy or energy-reduction goals. Because the CDC note accounts for only 40% of the project, total project sizes financed under the 504 program often exceed $12,000,000 to $20,000,000 with private bank participation.',
  },
  {
    q: 'How much down payment or equity injection is required for an SBA 504 loan?',
    a: 'The standard minimum equity injection for an SBA 504 loan is 10% of total eligible project costs for established, multi-purpose real estate. However, the equity requirement increases to 15% if the business is a startup (less than 2 years of operating history) OR if the property is a single-purpose special-use facility (such as a hotel, car wash, bowling alley, or assisted living facility). If both conditions apply (a startup acquiring a special-use building), the borrower must inject 20% equity.',
  },
  {
    q: 'What is an SBA certified lender and how do I find one?',
    a: 'An SBA Certified Lender (or Preferred Lender Program / PLP lender) is a financial institution authorized by the SBA to make credit decisions on 7(a) applications in-house without submitting packages to an SBA regional office for prior approval. This delegated underwriting authority drastically reduces approval times from months to weeks. Small business owners can locate authorized lenders and Certified Development Companies using the official SBA Lender Match tool at sba.gov.',
  },
  {
    q: 'What Debt Service Coverage Ratio (DSCR) is required for SBA approval?',
    a: 'Lenders set their own minimum Debt Service Coverage Ratio (DSCR) for historical or projected cash flow, so ask yours. DSCR is calculated as Annual Net Operating Income (or Adjusted EBITDA / SDE) divided by Total Annual Principal and Interest Debt Service across both bank and CDC loans. A 1.25× DSCR means the business generates $1.25 in operating cash flow for every $1.00 in required loan payments.',
  },
  {
    q: 'Can I use an SBA loan to buy an existing business?',
    a: 'Yes. SBA 7(a) loans can be used to buy a business, and SBA.gov lists the 7(a) maximum loan amount as $5 million. A purchase is often funded by a mix of buyer cash, sometimes a seller note, and the 7(a) loan. The required equity, seller-note terms and loan term depend on the lender and the deal, so enter the structure your lender quotes in the Buy a business tab.',
  },
  {
    q: 'What maturity terms are available on SBA 504 loans?',
    a: 'Per official SBA rules, CDC debentures are available in fixed 10-year, 20-year, and 25-year maturity terms. Real estate acquisitions and ground-up facilities qualify for 20- or 25-year debentures, while heavy machinery and equipment loans are tied to the economic useful life of the assets (typically 10 years).',
  },
  {
    q: 'Can an SBA 504 loan have a balloon payment?',
    a: 'The CDC debenture portion is fully amortizing over its entire 10, 20, or 25-year term with zero balloon payments. However, the commercial bank first mortgage often carries an initial 10-year balloon or fixed-rate reset period even though payments are amortized over 25 years. Borrowers must negotiate bank term lengths carefully or prepare for refinancing the remaining bank balance at year 10.',
  },
  {
    q: 'Are SBA loan interest rates fixed or variable?',
    a: 'SBA 504 CDC debentures are always 100% fixed-rate for their entire term. The private bank first lien can be fixed or variable based on lender preference. SBA 7(a) loans are overwhelmingly structured with variable rates pegged to WSJ Prime plus a negotiated lender spread, though fixed-rate 7(a) options exist from select institutions.',
  },
];

export default function SbaLoanCalculatorPage() {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Business & Finance Tools', path: '/tools/' },
    { name: 'SBA Loan Calculator', path: '/sba-loan-calculator/' },
  ];

  return (
    <main className={`${styles.page} ${toolDisplayFont.variable} ${typo.scope}`}>
      <div className="container">
        <Breadcrumbs items={breadcrumbItems} />

        <div className={styles.intro}>
          <h1 className={styles.title}>
            SBA Loan Calculator: 7(a) and 504 Payments, Fees and Down Payment
          </h1>
          <p className={styles.subtitle}>
            Accurately calculate monthly payments for U.S. Small Business Administration commercial loans. Model the true two-loan SBA 504 capital stack (bank first lien, CDC second lien, and borrower equity), evaluate SBA 7(a) variable rates with guarantee fees, run side-by-side cash flow comparisons, and underwrite business acquisitions.
          </p>

          <div className={styles.bluf}>
            <strong>Bottom Line Up Front (BLUF):</strong> An SBA 504 loan is really two separate loans: a conventional bank first lien and an SBA-backed CDC second lien debenture, plus your own equity injection. For a typical $2,000,000 commercial real estate project with a 50/40/10 split, the bank ($1,000,000 @ 7.0%) and CDC ($800,000 @ 6.5%) combine to cost $12,469 per month at a 6.78% blended rate. Financed under a single SBA 7(a) loan at 9.0%, the same $1,800,000 debt would cost $15,106 per month—a difference of $2,636 every month in preserved cash flow.
          </div>
        </div>

        <ToolShell
          features={[
            'True 504 two-loan split',
            '504 vs 7(a) compare',
            'DSCR affordability',
            'Printable schedules',
          ]}
        >
          <SbaLoanCalculator />
        </ToolShell>

        <AdSlot />

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>What is an SBA 504 Loan?</h2>
            <p>
              An <strong>SBA 504 loan</strong> is a flagship economic development financing program authorized by the U.S. Small Business Administration (SBA) to promote job creation and business expansion. Tailored specifically for owner-occupied commercial real estate and major capital equipment purchases, the 504 program provides long-term, fixed-rate financing with low down payment requirements.
            </p>
            <p>
              Unlike conventional commercial mortgages or standard business lines of credit, an SBA 504 loan is structured as a <strong>three-tier capital stack</strong>:
            </p>
            <ul>
              <li>
                <strong>Bank 1st Mortgage (Typically 50%):</strong> A private commercial bank, credit union, or institutional lender provides a conventional first mortgage covering approximately 50% of total project costs. The bank holds senior lien status on the property or assets.
              </li>
              <li>
                <strong>CDC / SBA 2nd Mortgage (Typically 40%):</strong> A Certified Development Company (CDC)—a nonprofit corporation certified and regulated by the SBA—issues a debenture bond covering up to 40% of the project (maximum $5,000,000 to $5,500,000). This second mortgage is 100% guaranteed by the federal government and sold to private institutional bond investors on Wall Street.
              </li>
              <li>
                <strong>Borrower Cash Equity (Typically 10%):</strong> The business owner provides a 10% cash equity down payment, significantly lower than the 20% to 35% equity down payments demanded by conventional commercial property lenders.
              </li>
            </ul>
            <p>
              Because the private bank takes first lien priority at an conservative 50% Loan-to-Value (LTV), banks face minimal credit risk, making them far more willing to approve growing businesses that would otherwise be rejected for conventional financing.
            </p>
          </section>

          <section className={styles.section}>
            <h2>SBA 504 vs SBA 7(a): Understanding the Differences</h2>
            <p>
              Choosing between an SBA 504 loan and an SBA 7(a) loan depends on your business objectives, collateral type, and capital deployment needs. While both programs are backed by the Small Business Administration, their mechanics and fee schedules differ substantially.
            </p>

            <div className={styles.tableWrapper}>
              <table className={styles.comparisonTable}>
                <thead>
                  <tr>
                    <th>Financing Feature</th>
                    <th>SBA 504 Loan Program</th>
                    <th>SBA 7(a) Loan Program</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Primary Purpose</strong></td>
                    <td>Owner-occupied real estate &amp; long-life heavy machinery</td>
                    <td>Working capital, business acquisitions (M&amp;A), debt refi, equipment, real estate</td>
                  </tr>
                  <tr>
                    <td><strong>Maximum Gross Limit</strong></td>
                    <td>CDC portion: $5M ($5.5M for manufacturers/green projects); Total project unlimited</td>
                    <td>$5,000,000 statutory maximum per small business borrower</td>
                  </tr>
                  <tr>
                    <td><strong>Lending Structure</strong></td>
                    <td>Two loans: 50% private bank + 40% CDC debenture + 10% borrower cash</td>
                    <td>Single commercial bank loan with an SBA federal guarantee (up to 75%–85%)</td>
                  </tr>
                  <tr>
                    <td><strong>Interest Rate Mechanism</strong></td>
                    <td>CDC debenture is 100% fixed (pegged to 10-yr U.S. Treasuries); Bank rate fixed or variable</td>
                    <td>Predominantly variable (pegged to WSJ Prime Rate + negotiated lender spread)</td>
                  </tr>
                  <tr>
                    <td><strong>Maturity Terms Available</strong></td>
                    <td>10, 20, or 25 years (per official SBA regulations)</td>
                    <td>Up to 25 years for real estate; up to 10 years for equipment &amp; acquisitions; 7 yrs for working capital</td>
                  </tr>
                  <tr>
                    <td><strong>Minimum Down Payment</strong></td>
                    <td>10% standard (15% for startups or special-use properties; 20% for both)</td>
                    <td>10% minimum for business purchases; variable for general credit</td>
                  </tr>
                  <tr>
                    <td><strong>Upfront Program Fees</strong></td>
                    <td>CDC debenture fees ~3% of debt (can be financed directly into the note)</td>
                    <td>SBA guarantee fee (tiered 0% to 3.75% based on loan size; can be financed)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <h2>SBA 7(a) Loan Payments and Interest Spreads</h2>
            <p>
              The <strong>SBA 7(a) loan</strong> is the most common commercial credit vehicle in the United States. Rather than lending government money directly, private banks, regional lenders, and non-bank credit institutions underwrite the loan while the SBA guarantees between 75% and 85% of the principal balance against borrower default.
            </p>
            <p>
              Most 7(a) loans carry variable interest rates tied to the Wall Street Journal Prime Rate. Under federal regulations (13 CFR Part 120), the SBA caps the maximum interest rate spread that commercial lenders can add above Prime based on loan amount and maturity:
            </p>
            <ul>
              <li><strong>Loans of $50,000 or less:</strong> Base rate + maximum allowable spread.</li>
              <li><strong>Loans between $50,001 and $250,000:</strong> Base rate + moderate spread.</li>
              <li><strong>Loans exceeding $250,000:</strong> Tightly capped spreads (often Prime + 2.25% to Prime + 2.75% for maturities over 7 years).</li>
            </ul>
            <p>
              Because 7(a) variable rates adjust quarterly or annually as the Federal Reserve shifts benchmark rates, debt service costs can fluctuate over the life of a 10- or 25-year term. For real estate acquisitions exceeding $1,000,000, locking in a predictable long-term fixed debenture through the 504 program often shields business owners from interest rate volatility.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Underwriting &amp; DSCR Affordability</h2>
            <p>
              Whether applying for a 504 debenture or a 7(a) credit facility, commercial underwriting revolves around your company’s <strong>Debt Service Coverage Ratio (DSCR)</strong>. Lenders want objective mathematical proof that your business produces enough Net Operating Income (NOI) or Seller’s Discretionary Earnings (SDE) to comfortably make all required loan payments.
            </p>
            <p>
              The standard commercial underwriting formula is:
            </p>
            <p style={{ padding: '0.75rem', background: 'var(--surface-2, #f8fafc)', borderRadius: '6px', fontFamily: 'monospace' }}>
              DSCR = Annual Operating Cash Flow (NOI / EBITDA) ÷ Annual Debt Service (Principal + Interest)
            </p>
            <p>
              SBA lenders typically enforce a minimum DSCR hurdle of <strong>1.25×</strong>. For example, if your combined bank and CDC monthly debt service equals $12,469 ($149,633 per year), your business must demonstrate at least $187,041 in annual cash flow ($149,633 × 1.25) to qualify.
            </p>
            <p>
              If your debt capacity is tight, explore our companion calculators to stress test your figures:
            </p>
            <ul>
              <li>
                <Link href="/commercial-mortgage-calculator/">Commercial Mortgage Calculator</Link> — Underwrite conventional commercial debt against LTV, DSCR, and Debt Yield limits.
              </li>
              <li>
                <Link href="/equipment-loan-calculator/">Equipment Business Loan Calculator</Link> — Model machinery leases, Section 179 tax depreciation write-offs, and chattel mortgages.
              </li>
              <li>
                <Link href="/business-valuation-calculator/">Business Valuation Calculator</Link> — Estimate SDE multiples, EBITDA valuation, and acquisition price targets.
              </li>
              <li>
                <Link href="/cap-rate-calculator/">Cap Rate Calculator</Link> — Analyze commercial property net operating income and capitalization yields.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Acquiring a Business: 7(a) M&amp;A Financing Structure</h2>
            <p>
              When buying an existing business, intangible assets (customer goodwill, proprietary processes, customer lists, and brand equity) frequently make up 60% to 90% of the total purchase price. Because conventional commercial banks cannot place physical liens on goodwill, standard commercial mortgages will not finance business acquisitions.
            </p>
            <p>
              The <strong>SBA 7(a) program</strong> resolves this bottleneck by allowing goodwill financing up to $5,000,000 over a 10-year repayment schedule. A typical small business acquisition capital stack comprises:
            </p>
            <ol>
              <li>
                <strong>Buyer Cash Equity Injection (10%–20%):</strong> Cash from savings, home equity, or 401(k) rollovers (ROBS). The SBA requires a minimum 10% equity injection for change-of-ownership transactions.
              </li>
              <li>
                <strong>Seller Promissory Note (10%–20%):</strong> A subordinated note provided by the outgoing business seller. If the seller agrees to place the note on &ldquo;full standby&rdquo; (receiving zero principal and interest payments for the life of the SBA loan or a designated introductory period), select lenders allow seller debt to satisfy up to half of the buyer’s required equity injection.
              </li>
              <li>
                <strong>SBA 7(a) Senior Loan (70%–80%):</strong> The primary term loan provided by the SBA preferred lender, holding first lien priority on all business assets.
              </li>
            </ol>
          </section>

          <section className={styles.faqSection}>
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqGrid}>
              {faqs.map((faq, i) => (
                <div key={i} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{faq.q}</h3>
                  <p className={styles.faqAnswer}>{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        <HowWeCalculate slug="sba-loan-calculator" />
      </div>

      <JsonLd data={buildWebApplicationSchema({ name: route.title, path: route.path, description: route.description })} />
      <JsonLd data={buildFaqSchema(faqs)} />
    </main>
  );
}
