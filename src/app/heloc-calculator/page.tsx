import React from 'react';
import type { Metadata } from 'next';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Container from '@/components/ui/Container';
import ToolShell from '@/components/tool/shared/ToolShell';
import AdSlot from '@/components/ads/AdSlot';
import Faq from '@/components/ui/Faq';
import HelocCalculator from '@/components/tool/heloc-calculator';
import styles from './page.module.css';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';

const PAGE_TITLE = 'HELOC Loan Calculator – Payment, Limit & Payment Shock';
const PAGE_DESC =
  'Free HELOC loan calculator. See how much you can borrow, your interest-only and repayment payments, the payment jump, and HELOC vs home equity loan.';
const PAGE_PATH = '/heloc-calculator/';

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: PAGE_PATH,
  absoluteTitle: true,
});

const FAQS = [
  {
    q: 'How do I calculate my HELOC payment?',
    a: 'HELOC payments depend on your lifecycle phase. During the draw period (typically the first 10 years), most lenders require only monthly interest on the outstanding balance: Monthly Draw Payment = Balance × (APR ÷ 12). Once the draw period closes and the repayment period begins (commonly 20 years), your payment converts to a fully amortizing principal and interest payment calculated using standard loan amortization formulas.',
  },
  {
    q: 'How is HELOC interest calculated?',
    a: 'HELOC interest is calculated daily based on your variable annual percentage rate (APR) and unpaid principal balance: Daily Interest = Balance × (APR ÷ 365). At the end of each billing cycle, daily charges are summed. For instance, borrowing $50,000 at an 8.0% variable APR incurs approximately $10.96 per day in interest, totaling $333.33 for a standard 30-day billing month.',
  },
  {
    q: 'How much can I borrow with a HELOC? (CLTV)',
    a: 'Borrowing capacity is capped by the lender’s maximum Combined Loan-to-Value (CLTV) limit, which each lender sets. The formula is: Max HELOC = (Home Value × Max CLTV %) − First Mortgage Balance. For a $400,000 home with an example 85% CLTV cap ($340,000 max total debt) and a $250,000 mortgage balance, your maximum credit line is $90,000.',
  },
  {
    q: 'What happens when the draw period ends?',
    a: 'When your draw period ends, you can no longer withdraw funds or write checks against the credit line. Your loan enters the repayment phase, requiring full monthly principal and interest payments designed to amortize the debt to zero over the remaining term (usually 10 to 20 years). This structural transition causes "payment shock" because payments increase sharply even if interest rates stay flat.',
  },
  {
    q: 'What is the payment on a $50,000 HELOC?',
    a: 'At an 8.0% APR with a 10-year draw and 20-year repayment schedule: (1) During the 10-year draw period, your interest-only payment is $333.33 per month. (2) During the 20-year repayment period, your payment jumps to $418.22 per month (a +25.5% payment shock of +$84.89/month) to pay off principal and interest.',
  },
  {
    q: 'What is the payment on a $100,000 HELOC?',
    a: 'At an 8.0% APR with a 10-year draw and 20-year repayment schedule: (1) During the 10-year draw period, the interest-only payment is $666.67 per month. (2) During the 20-year repayment period, the monthly payment increases to $836.44 per month (a +$169.77/month payment jump).',
  },
  {
    q: 'Are HELOC rates fixed or variable?',
    a: 'Most standard HELOCs carry variable interest rates indexed to the U.S. Prime Rate plus a lender margin (e.g., Prime + 0.50%). When the Federal Reserve raises or lowers the federal funds rate, your HELOC APR and monthly payment adjust accordingly. Some lenders offer fixed-rate lock options allowing you to convert portions of your drawn balance into a fixed-rate installment loan for a small fee.',
  },
  {
    q: "HELOC vs home equity loan: what's the difference?",
    a: 'A HELOC is a revolving credit line with a variable interest rate where you withdraw money as needed and make interest-only payments during the draw period. A Home Equity Loan is an installment loan disbursed as a single lump sum upfront with a fixed interest rate and fixed monthly payments over a set 10 to 30 year term.',
  },
  {
    q: 'What is CLTV?',
    a: 'Combined Loan-to-Value (CLTV) is the ratio of all secured liens against a property (your primary mortgage plus your HELOC credit line) divided by the home’s fair market value. Lenders set a CLTV cap so that an equity cushion remains to protect against falls in property value.',
  },
  {
    q: 'Is HELOC interest tax-deductible?',
    a: 'Under IRS Publication 936 and current tax law, HELOC interest is deductible only if the borrowed funds are used strictly to buy, build, or substantially improve the primary or secondary residence that secures the loan. If you use HELOC funds to pay off credit cards, purchase vehicles, or cover college tuition, the interest is not tax-deductible.',
  },
  {
    q: 'Do I need my home paid off to get a HELOC?',
    a: 'No. You do not need to own your home free and clear. You only need sufficient unencumbered home equity above your lender’s minimum after your first mortgage balance is counted.',
  },
];

export default function HelocPage() {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Business & Finance', path: '/tools/' },
    { name: 'HELOC Loan Calculator', path: PAGE_PATH },
  ];

  const appSchema = buildWebApplicationSchema({
    name: 'HELOC Loan Calculator',
    path: PAGE_PATH,
    description: PAGE_DESC,
    applicationCategory: 'FinanceApplication',
  });

  const faqSchema = buildFaqSchema(FAQS);

  return (
    <main className={`${styles.page} ${toolDisplayFont.variable} ${typo.scope}`}>
      <JsonLd data={appSchema} />
      <JsonLd data={faqSchema} />

      <Container>
        <div className={styles.breadcrumbs}>
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <header className={styles.hero}>
          <h1 className={styles.title}>HELOC Calculator: Borrowing Limit, Payments and Payment Shock</h1>
          <p className={styles.bluf}>
            Most HELOCs charge interest-only during the draw period, then a full principal-and-interest payment
            afterwards. $50,000 at 8% is about $333 a month at first and $418 a month over a 20-year repayment. Your
            limit is roughly home value × 85% − mortgage balance.
          </p>
        </header>

        <ToolShell
          features={[
            'Borrowing limit (CLTV)',
            'Payment shock shown',
            'Rate-rise scenarios',
            'HELOC vs home equity loan',
          ]}
        >
          <HelocCalculator />
        </ToolShell>

        <div className={styles.adBand}>
          <AdSlot slotId="after-tool" />
        </div>

        <article className={styles.content}>
          {/* Section 1: How to Use */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. How to Use the HELOC Loan Calculator</h2>
            <div className={styles.prose}>
              <p>
                A <strong>Home Equity Line of Credit (HELOC)</strong> is one of the most flexible financing tools
                available to homeowners, but its two-phase lifecycle and variable rate structure make budgeting complex.
                This calculator models the exact financial progression across three dedicated tabs:
              </p>
              <ul>
                <li>
                  <strong>Payments &amp; Payment Shock (Default):</strong> Input your borrowed amount, variable APR, draw
                  duration (e.g. 10 years), and repayment term (e.g. 20 years). See your initial interest-only payment,
                  quantify the exact dollar and percentage jump when repayment begins, and run rate-rise stress tests.
                </li>
                <li>
                  <strong>How Much Can I Borrow? (CLTV Limit):</strong> Enter your estimated home appraisal value, first
                  mortgage balance, and lender CLTV ceiling (ask your lender) to calculate your maximum available credit
                  line and unencumbered equity cushion.
                </li>
                <li>
                  <strong>HELOC vs. Loan vs. Refinance:</strong> Compare the total interest cost, closing fees, and monthly
                  payments of a revolving HELOC against a fixed second mortgage and a cash-out refinance on the same dollar
                  amount.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2: How Much Can You Borrow */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. How Much Can You Borrow with a HELOC? (CLTV Formula)</h2>
            <div className={styles.prose}>
              <p>
                Lenders determine your maximum borrowing capacity using the{' '}
                <strong>Combined Loan-to-Value (CLTV)</strong> ratio. Unlike your first mortgage, which looks only at the
                primary lien, CLTV evaluates all secured debt against your home:
              </p>
              <div className={styles.formulaBox}>
                Maximum Total Secured Debt = Home Market Value × Lender Maximum CLTV %
                <br />
                Maximum HELOC Line = Maximum Total Secured Debt − Existing Mortgage Balance
              </div>
              <p>
                Consider a typical scenario:
              </p>
              <ul>
                <li>
                  <strong>Appraised Home Value:</strong> $400,000
                </li>
                <li>
                  <strong>First Mortgage Balance:</strong> $250,000 (current 62.5% LTV)
                </li>
                <li>
                  <strong>Lender Maximum CLTV:</strong> 85%
                </li>
              </ul>
              <p>
                At an 85% ceiling, the bank permits total secured debt of $400,000 × 0.85 = <strong>$340,000</strong>.
                Subtracting the $250,000 first mortgage leaves a maximum available credit line of <strong>$90,000</strong>.
                The remaining 15% ($60,000) represents retained equity that the lender requires as a protective buffer
                against home price depreciation.
              </p>
            </div>
          </section>

          {/* Section 3: Draw Period Payment */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Estimating Your Home Equity Payment in the Draw Period</h2>
            <div className={styles.prose}>
              <p>
                During the initial draw period (most commonly 10 years), you can withdraw funds repeatedly up to your
                credit limit. You only pay interest on the money you actually draw, not the total approved credit limit.
              </p>
              <p>
                Lenders generally offer two primary payment structures during the draw phase:
              </p>
              <ol>
                <li>
                  <strong>Interest-Only (Standard):</strong> You pay only the accrued monthly finance charge:
                  <div className={styles.formulaBox}>
                    Monthly Interest-Only Payment = Outstanding Drawn Balance × (APR ÷ 12)
                  </div>
                  Borrowing $50,000 at an 8.0% variable APR requires an interest-only payment of exactly{' '}
                  <strong>$333.33 per month</strong>. None of this payment reduces your principal balance.
                </li>
                <li>
                  <strong>1/360th + Interest:</strong> A subset of regional and commercial banks (such as Regions Bank)
                  require a small principal repayment equal to 1/360th of the balance (0.278% per month) plus interest. On a
                  $50,000 balance, you pay $138.89 in principal plus $333.33 in interest ($472.22 total). This structure
                  gradually pays down $16,667 of principal over 10 years, softening the eventual repayment transition.
                </li>
              </ol>
            </div>
          </section>

          {/* Section 4: Repayment Period and Payment Shock */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. The Repayment Period and Understanding Payment Shock</h2>
            <div className={styles.prose}>
              <p>
                The most dangerous financial pitfall of a HELOC is <strong>payment shock</strong> — the sudden, mandatory
                increase in your monthly bill when the draw period closes and the repayment period begins.
              </p>
              <p>
                When year 11 arrives, your credit line freezes. You can no longer make withdrawals, and the loan converts
                into a fully amortizing installment schedule over the remaining term (usually 20 years). The borrower must
                now pay both principal and interest every single month:
              </p>
              <div className={styles.formulaBox}>
                Monthly Repayment PMT = r × Balance ÷ (1 − (1 + r)^−n)
                <br />
                Where r = APR ÷ 12, n = Repayment Months (20 years × 12 = 240)
              </div>
              <p>
                On our worked $50,000 balance at 8.0% APR:
              </p>
              <ul>
                <li>
                  <strong>Month 120 (End of Draw):</strong> You pay <strong>$333.33</strong> (interest-only).
                </li>
                <li>
                  <strong>Month 121 (Repayment Begins):</strong> Your payment jumps immediately to <strong>$418.22</strong>.
                </li>
                <li>
                  <strong>Payment Shock Impact:</strong> Your monthly obligation surges by <strong>+$84.89 per month</strong>{' '}
                  (+25.5%). On larger credit lines (e.g. $100,000), payments jump by +$169.77/month.
                </li>
              </ul>
              <p>
                If variable interest rates climb during the draw period, payment shock becomes significantly more severe.
                Our calculator allows you to stress-test your budget against +1%, +2%, and +3% rate-rise scenarios.
              </p>
            </div>
          </section>

          {/* Section 5: HELOC Amortization Schedule */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Reading the HELOC Amortization Schedule</h2>
            <div className={styles.prose}>
              <p>
                Reviewing the complete 360-month amortization schedule illustrates the dramatic shift in how your money is
                applied:
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Month / Year</th>
                      <th>Phase</th>
                      <th className={styles.numCell}>Payment</th>
                      <th className={styles.numCell}>Principal Paid</th>
                      <th className={styles.numCell}>Interest Paid</th>
                      <th className={styles.numCell}>Ending Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Month 1 (Year 1)</td>
                      <td>Draw (Interest-Only)</td>
                      <td className={styles.numCell}>$333.33</td>
                      <td className={styles.numCell}>$0.00</td>
                      <td className={styles.numCell} style={{ color: '#ef4444' }}>
                        $333.33
                      </td>
                      <td className={styles.numCell}>$50,000.00</td>
                    </tr>
                    <tr>
                      <td>Month 120 (Year 10)</td>
                      <td>Draw (Final Month)</td>
                      <td className={styles.numCell}>$333.33</td>
                      <td className={styles.numCell}>$0.00</td>
                      <td className={styles.numCell} style={{ color: '#ef4444' }}>
                        $333.33
                      </td>
                      <td className={styles.numCell}>$50,000.00</td>
                    </tr>
                    <tr style={{ background: '#fef2f2', fontWeight: 700 }}>
                      <td>Month 121 (Year 11)</td>
                      <td>Repayment (Shock)</td>
                      <td className={styles.numCell} style={{ color: '#b91c1c' }}>
                        $418.22
                      </td>
                      <td className={styles.numCell} style={{ color: '#16a34a' }}>
                        $84.89
                      </td>
                      <td className={styles.numCell} style={{ color: '#ef4444' }}>
                        $333.33
                      </td>
                      <td className={styles.numCell}>$49,915.11</td>
                    </tr>
                    <tr>
                      <td>Month 240 (Year 20)</td>
                      <td>Repayment (Midpoint)</td>
                      <td className={styles.numCell}>$418.22</td>
                      <td className={styles.numCell} style={{ color: '#16a34a' }}>
                        $188.75
                      </td>
                      <td className={styles.numCell} style={{ color: '#ef4444' }}>
                        $229.47
                      </td>
                      <td className={styles.numCell}>$34,232.14</td>
                    </tr>
                    <tr>
                      <td>Month 360 (Year 30)</td>
                      <td>Final Payoff</td>
                      <td className={styles.numCell}>$418.22</td>
                      <td className={styles.numCell} style={{ color: '#16a34a' }}>
                        $415.45
                      </td>
                      <td className={styles.numCell} style={{ color: '#ef4444' }}>
                        $2.77
                      </td>
                      <td className={styles.numCell}>$0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Over the 30-year lifecycle of borrowing $50,000 at 8.0%, you pay $40,000 in draw interest plus $50,373 in
                repayment interest, totaling <strong>$90,373 in pure interest</strong> ($140,373 total paid).
              </p>
            </div>
          </section>

          {/* Section 6: Variable Rates */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Variable Rates and Rate-Rise Vulnerability</h2>
            <div className={styles.prose}>
              <p>
                Unlike primary fixed-rate mortgages, HELOC rates are variable. When the Federal Open Market Committee
                adjusts benchmark rates, your borrowing costs adjust within 1 to 2 billing cycles:
              </p>
              <ul>
                <li>
                  <strong>A +1.0% Rate Rise (9.0% APR):</strong> Your draw payment climbs from $333.33 to{' '}
                  <strong>$375.00/month</strong>, and your repayment payment reaches <strong>$449.86/month</strong>.
                </li>
                <li>
                  <strong>A +2.0% Rate Rise (10.0% APR):</strong> Your draw payment hits <strong>$416.67/month</strong>, and
                  repayment surges to <strong>$482.47/month</strong>.
                </li>
                <li>
                  <strong>Rate Caps:</strong> State and federal regulations require lenders to establish a lifetime interest
                  rate cap (often 18% to 24%). Always check your loan disclosure to confirm your ceiling.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 7: HELOC vs Loan vs Refi */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. HELOC vs Home Equity Loan vs Cash-Out Refinance</h2>
            <div className={styles.prose}>
              <p>
                When tapping equity, homeowners choose between three major financing structures:
              </p>
              <ol>
                <li>
                  <strong>HELOC:</strong> Best for ongoing projects with uncertain timing (e.g., phased home renovations).
                  You pay interest only on funds as drawn.
                </li>
                <li>
                  <strong>Home Equity Loan (Fixed Second Mortgage):</strong> Best for single, fixed expenses (e.g. paying
                  a contractor a lump sum). You lock in a predictable fixed rate and payment for 10 to 20 years.
                </li>
                <li>
                  <strong>Cash-Out Refinance:</strong> Replaces your entire existing mortgage with a larger loan. This is
                  only advantageous when current mortgage market rates are lower than your existing mortgage rate. If you
                  currently hold a 3.5% or 4.0% first mortgage, doing a cash-out refi at 6.5%+ is financially counterproductive.
                </li>
              </ol>
            </div>
          </section>

          {/* Section 8: Fees */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Upfront Closing Costs and Ongoing Fees</h2>
            <div className={styles.prose}>
              <p>
                While some institutions offer &ldquo;no closing cost&rdquo; promotional HELOCs, borrowers must watch for
                secondary fees:
              </p>
              <ul>
                <li>
                  <strong>Appraisal &amp; Title Fees:</strong> Property valuations and title search fees ($300 to $1,000).
                </li>
                <li>
                  <strong>Annual Maintenance Fees:</strong> Recurring charges ($50 to $75/year) assessed simply for keeping
                  the credit line active.
                </li>
                <li>
                  <strong>Early Cancellation Penalties:</strong> Prepayment penalties ($300 to $500) if you close the
                  credit line within 24 to 36 months of opening.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 9: Tax Treatment */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Tax Treatment and IRS Publication 936 Rules</h2>
            <div className={styles.prose}>
              <p>
                Under the Tax Cuts and Jobs Act (TCJA) and IRS Publication 936 (Home Mortgage Interest Deduction), HELOC
                interest is deductible on federal tax returns <em>only</em> if the proceeds are used to buy, build, or
                substantially improve the home securing the loan.
              </p>
              <p>
                If you use a HELOC to consolidate credit card debt, pay educational expenses, or purchase consumer goods,
                the interest is completely non-deductible. Maintain detailed invoices and contractor receipts to support any
                itemized deduction claims during tax filing.
              </p>
            </div>
          </section>

          {/* Section 10: Critical Risks */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Critical Risks: Foreclosure, Freezes, and Balloon Payments</h2>
            <div className={styles.prose}>
              <p>
                Unlike unsecured personal loans, a HELOC uses your home as legal collateral:
              </p>
              <ul>
                <li>
                  <strong>Risk of Foreclosure:</strong> Defaulting on a HELOC allows the second lienholder to initiate
                  foreclosure proceedings, putting your primary residence at risk.
                </li>
                <li>
                  <strong>Lender Line Freezes:</strong> If local property values decline significantly or your credit score
                  drops, federal banking regulations permit lenders to freeze or reduce your credit limit without advance notice.
                </li>
                <li>
                  <strong>Balloon Payments:</strong> Some older or commercial HELOC structures do not amortize into a 20-year
                  repayment phase, requiring the entire balance in a single balloon payoff at the end of the draw period.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 11: FAQ */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Frequently Asked Questions</h2>
            <Faq items={FAQS} withSchema={false} />
          </section>

          {/* How We Calculate */}
          <HowWeCalculate slug="heloc-calculator" />

          {/* YMYL Disclosures */}
          <div className={styles.ymylBox}>
            <div className={styles.ymylTitle}>
              <span>⚖</span> Legal, Lending &amp; Consumer Disclosures
            </div>
            <p>
              <strong>Regulatory Framework:</strong> Amortization models comply with the federal Truth in Lending Act (TILA,
              Regulation Z) and Consumer Financial Protection Bureau (CFPB) guidelines on Home Equity Lines of Credit.
              Tax deductibility rules cite IRS Publication 936.
            </p>
            <p>
              <strong>Independent Calculations:</strong> KKCTools does not partner with mortgage brokers, capture consumer
              addresses, sell loan leads, or present sponsored rate tables. All calculations are performed client-side inside
              your browser with complete data privacy.
            </p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
              <em>Last reviewed &amp; verified: November 2026. This tool provides financial estimation and educational analysis,
              not formal mortgage underwriting, financial advisory, or legal counsel.</em>
            </p>
          </div>
        </article>
      </Container>
    </main>
  );
}
