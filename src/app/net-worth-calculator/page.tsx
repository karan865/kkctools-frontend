import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Container from '@/components/ui/Container';
import ToolShell from '@/components/tool/shared/ToolShell';
import AdSlot from '@/components/ads/AdSlot';
import Faq from '@/components/ui/Faq';
import NetWorthCalculator from '@/components/tool/net-worth-calculator';
import styles from './page.module.css';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';

const PAGE_TITLE = 'Net Worth Calculator – Calculate Your Net Worth';
const PAGE_DESC =
  'Free net worth calculator. Add up what you own and owe to calculate your net worth, liquid net worth and debt-to-asset ratio, privately in your browser.';
const PAGE_PATH = '/net-worth-calculator/';

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: PAGE_PATH,
  absoluteTitle: true,
});

const FAQS = [
  {
    q: 'What does net worth mean?',
    a: 'Net worth is the total dollar value of everything you own (your assets) minus everything you owe (your liabilities and debt). It serves as the primary metric of overall financial health and accumulated wealth, providing a comprehensive snapshot of your balance sheet at a single point in time.',
  },
  {
    q: 'How do I figure out my net worth?',
    a: 'To calculate your net worth, follow three simple steps: (1) Total up your assets, including checking accounts, savings, taxable investments, retirement accounts, home value, and vehicles. (2) Total up all debts, including mortgages, HELOCs, car loans, student loans, and credit card balances. (3) Subtract your total debt from your total assets: Net Worth = Assets − Liabilities.',
  },
  {
    q: 'Do retirement accounts count toward net worth?',
    a: 'Yes. Both pre-tax retirement accounts (Traditional 401k, 403b, Traditional IRA) and post-tax accounts (Roth IRA, Roth 401k) count toward your net worth. In our calculator, you can optionally apply a tax haircut (your expected tax rate in retirement) to pre-tax accounts to estimate their after-tax purchasing power when withdrawn in retirement.',
  },
  {
    q: 'Should I include my house at full value or just the equity?',
    a: 'Include your home at its full estimated fair market value under Assets, and record your remaining mortgage balance under Liabilities. The calculator will automatically subtract the mortgage from the home value to determine your net home equity ($350,000 value − $260,000 mortgage = $90,000 home equity).',
  },
  {
    q: 'Does my car count toward net worth?',
    a: 'Yes, but only at its current fair market resale value (e.g., Kelley Blue Book private party value), not what you originally paid for it. Vehicles are depreciating assets. If you have an outstanding auto loan, list the remaining balance under liabilities.',
  },
  {
    q: 'Can net worth be negative?',
    a: 'Yes, and a negative net worth is very common among young adults, recent college graduates, and medical residents who carry student loans before accumulating substantial savings. As you earn income, pay down principal balances, and invest, your net worth will steadily cross into positive territory.',
  },
  {
    q: 'What is liquid net worth?',
    a: 'Liquid net worth measures the wealth you can convert into cash quickly without selling illiquid property or paying early retirement withdrawal penalties. By standard financial planning definition, Liquid Net Worth = Cash + Savings + Taxable Brokerage − Non-Mortgage Debt (credit cards, auto loans, student loans).',
  },
  {
    q: 'How often should I calculate my net worth?',
    a: 'Reviewing your net worth once every quarter or at the end of each year is ideal. Tracking it too frequently (such as daily or weekly) introduces noise from stock market fluctuations and normal payroll cycles that can cause unnecessary stress.',
  },
  {
    q: 'Net worth vs income: what is the difference?',
    a: 'Income is the cash flow you earn over a period of time (e.g., $90,000 per year from your salary). Net worth is the accumulated wealth you keep and build over time ($250,000 in assets minus debts). Someone with a high income who spends everything has a low net worth, while someone with a moderate income who saves consistently can amass a large net worth.',
  },
  {
    q: 'Is my financial data stored anywhere?',
    a: 'No. This calculator runs 100% client-side inside your browser. None of your account values, names, or notes are transmitted across a network or stored on any server. If you click "Save Snapshot," it is stored strictly in your local device’s browser storage.',
  },
];

export default function NetWorthPage() {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Business & Finance', path: '/tools/' },
    { name: 'Net Worth Calculator', path: PAGE_PATH },
  ];

  const appSchema = buildWebApplicationSchema({
    name: 'Net Worth Calculator',
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
          <h1 className={styles.title}>Net Worth Calculator: Calculate Your Net Worth in Minutes</h1>
          <p className={styles.bluf}>
            Net worth means everything you own minus everything you owe. To calculate net worth, add up your cash,
            investments, retirement accounts, home and other assets, then subtract your mortgage, loans and card
            balances. $550,000 − $294,000 = $256,000.
          </p>
        </header>

        <ToolShell
          features={[
            'Total, liquid & investable',
            'Household mode',
            'Track changes privately',
            'Printable statement',
          ]}
        >
          <NetWorthCalculator />
        </ToolShell>

        <div className={styles.adBand}>
          <AdSlot slotId="after-tool" />
        </div>

        <article className={styles.content}>
          {/* Section 1: What is Net Worth */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. What Is Net Worth?</h2>
            <div className={styles.prose}>
              <p>
                <strong>Net worth</strong> represents the fundamental arithmetic measure of your accumulated personal
                wealth: the dollar value of everything you own (your assets) minus everything you owe to creditors (your
                liabilities).
              </p>
              <div className={styles.formulaBox}>Net Worth = Total Assets − Total Liabilities</div>
              <p>
                Unlike annual salary or monthly gross revenue — which measure the velocity of money passing through your
                hands — net worth reveals what remains after all expenditures, debt obligations, and living costs are
                met. A household earning $250,000 per year that spends $260,000 carries a declining net worth, whereas a
                household earning $75,000 that steadily directs 20% into diversified index funds and home equity builds
                substantial long-term financial security.
              </p>
            </div>
          </section>

          {/* Section 2: How to Calculate Net Worth */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. How to Calculate Net Worth</h2>
            <div className={styles.prose}>
              <p>
                Calculating your personal balance sheet requires systematically taking inventory of your financial assets
                and subtracting all outstanding debt obligations:
              </p>
              <ol>
                <li>
                  <strong>Tally Liquid Assets:</strong> Sum up checking balances, high-yield savings accounts, certificates
                  of deposit (CDs), money market funds, and taxable brokerage investment accounts.
                </li>
                <li>
                  <strong>Add Long-Term Capital &amp; Real Estate:</strong> Include retirement accounts (401k, 403b,
                  Traditional and Roth IRAs), primary home fair market value, secondary real estate, and vehicle equity.
                </li>
                <li>
                  <strong>Sum Secured Debt:</strong> Record your primary mortgage principal balance and home equity lines of
                  credit (HELOCs).
                </li>
                <li>
                  <strong>Sum Unsecured &amp; Consumer Debt:</strong> Total auto financing loans, federal and private student
                  loans, revolving credit card balances, and personal loans.
                </li>
                <li>
                  <strong>Subtract Total Liabilities from Total Assets:</strong> The resulting figure is your baseline net
                  worth.
                </li>
              </ol>
              <p>
                Consider our worked example: with $25,000 in cash and savings, $40,000 in taxable brokerage investments,
                $120,000 across retirement accounts, a $350,000 home, and a $15,000 vehicle, total assets equal{' '}
                <strong>$550,000</strong>. Subtracting a $260,000 mortgage, $10,000 car loan, $20,000 student debt, and
                $4,000 in credit card balances ($294,000 total debt) yields an exact net worth of{' '}
                <strong>$256,000</strong>.
              </p>
            </div>
          </section>

          {/* Section 3: What Counts as an Asset */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. What Counts as an Asset, and How to Value It</h2>
            <div className={styles.prose}>
              <p>
                An economic asset is any resource with cash or exchange value that you own outright or in which you hold
                equity. However, valuing assets conservatively is critical to avoiding an inflated picture of wealth:
              </p>
              <ul>
                <li>
                  <strong>Cash &amp; Cash Equivalents:</strong> Checking, savings, Treasury bills, and money market funds
                  are recorded at exact statement value.
                </li>
                <li>
                  <strong>Taxable Brokerage Accounts:</strong> Value stocks, bonds, mutual funds, and ETFs at current market
                  prices. To model future portfolio growth and compare equities against cash yields, use our{' '}
                  <Link href="/investment-return-calculator/">Investment Return Calculator</Link>.
                </li>
                <li>
                  <strong>Pre-Tax Retirement Accounts (401k, 403b, IRA):</strong> Because withdrawals from traditional
                  retirement vehicles are taxed as ordinary income, some financial planners recommend applying an estimated
                  tax haircut (your expected tax rate) to reflect after-tax spendable value.
                </li>
                <li>
                  <strong>Primary Residence:</strong> Value your home using conservative recent comparable sales (comps) or
                  property appraisal estimates, rather than aspirational list prices.
                </li>
                <li>
                  <strong>Vehicles:</strong> Use private-party resale valuations (such as Kelley Blue Book or Edmunds), not
                  dealer retail prices. Remember that cars lose value every year.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: What Counts as a Liability */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. What Counts as a Liability</h2>
            <div className={styles.prose}>
              <p>
                A liability is any legal financial obligation or debt owed to an external lender or creditor:
              </p>
              <ul>
                <li>
                  <strong>Mortgages &amp; Real Estate Liens:</strong> Outstanding principal balance on your primary mortgage,
                  second mortgage, or home equity line of credit. To model credit lines, payment shock, and equity borrowing limits, use our{' '}
                  <Link href="/heloc-calculator/">HELOC Loan Calculator</Link>.
                </li>
                <li>
                  <strong>Vehicle Loans:</strong> Remaining loan payoff amount across all family cars, trucks, or
                  motorcycles.
                </li>
                <li>
                  <strong>Student Debt:</strong> Cumulative principal and accrued interest on federal and private student
                  loans.
                </li>
                <li>
                  <strong>Revolving Credit Card Balances:</strong> Total balance carried past the grace period on your most
                  recent billing statements. To model paydown strategies for high-interest debt, use our{' '}
                  <Link href="/credit-card-payoff-calculator/">Credit Card Payoff Calculator</Link>.
                </li>
                <li>
                  <strong>Personal &amp; Medical Debt:</strong> Unsecured bank notes, 401(k) loans, tax liabilities owed to
                  the IRS, or outstanding medical bills.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5: Liquid vs Total vs Investable */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Liquid vs. Total vs. Investable Net Worth</h2>
            <div className={styles.prose}>
              <p>
                Headline net worth can often be misleading if 80% of your wealth is locked in home equity or illiquid
                pension structures. For precise financial planning, we break net worth into three distinct tiers:
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Tier</th>
                      <th>Formula &amp; Inclusions</th>
                      <th className={styles.numCell}>Worked Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Total Net Worth</strong>
                      </td>
                      <td>All Assets (Cash + Investments + Retirement + Home + Vehicles) − All Liabilities</td>
                      <td className={styles.numCell} style={{ fontWeight: 700 }}>
                        $256,000
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Liquid Net Worth</strong>
                      </td>
                      <td>
                        (Cash &amp; Savings + Taxable Brokerage) − Non-Mortgage Consumer Debt ($65,000 − $34,000)
                      </td>
                      <td className={styles.numCell} style={{ color: '#2563eb', fontWeight: 700 }}>
                        $31,000
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Investable Net Worth</strong>
                      </td>
                      <td>
                        Liquid Assets + Retirement Accounts − Non-Mortgage Debt ($65,000 + $120,000 − $34,000)
                      </td>
                      <td className={styles.numCell} style={{ color: '#16a34a', fontWeight: 700 }}>
                        $151,000
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                <strong>Liquid Net Worth</strong> represents your ultimate safety buffer. If you faced an immediate job
                loss or economic downturn, liquid net worth measures the cash you can access within 3 to 5 business days
                without taking early 10% IRS penalties on retirement plans or being forced into an emergency home sale.
              </p>
            </div>
          </section>

          {/* Section 6: Benchmarks & Age Comparisons */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Net Worth Benchmarks and Why Age Comparisons Mislead</h2>
            <div className={styles.prose}>
              <p>
                Comparing your net worth to national averages can provide broad context, but standard averages are
                notoriously skewed by ultra-wealthy outliers. According to the Federal Reserve&apos;s Survey of Consumer
                Finances (SCF), the <em>median</em> net worth of American families is substantially lower than the{' '}
                <em>mean</em> (average):
              </p>
              <ul>
                <li>
                  <strong>Median vs. Mean Distortion:</strong> In the Federal Reserve&apos;s SCF data the mean (average) is far
                  above the median for every age group, because a small number of very wealthy households pull the average up.
                  If you compare yourself with national figures, use the median from the latest SCF tables on federalreserve.gov.
                </li>
                <li>
                  <strong>Cost of Living Variations:</strong> A $200,000 net worth in an affordable Midwest community
                  represents far greater purchasing power and housing security than the same dollar net worth in San
                  Francisco or New York City.
                </li>
                <li>
                  <strong>The Real Benchmark:</strong> Rather than comparing yourself against strangers, compare your
                  current net worth against your own trajectory from 12 and 24 months ago using our private local snapshot
                  tracker.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 7: Negative Net Worth */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. What a Negative Net Worth Really Means</h2>
            <div className={styles.prose}>
              <p>
                If your liabilities exceed your assets, your net worth will calculate as a negative number. This is a
                common mathematical outcome, particularly for individuals in their twenties and early thirties:
              </p>
              <p>
                A 26-year-old nurse or software engineer who graduates with $60,000 in student loans and $5,000 in cash
                holds a net worth of <strong>−$55,000</strong>. Yet that individual possesses high future earning potential
                (human capital) that balance sheets cannot measure. A negative net worth is not a moral failing; it is
                simply an indicator that debt repayment and initial cash accumulation must take priority.
              </p>
            </div>
          </section>

          {/* Section 8: How to Grow Net Worth */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Actionable Habits to Grow Your Net Worth</h2>
            <div className={styles.prose}>
              <p>
                Growing net worth does not require timing financial markets. It relies on consistent mathematical levers:
              </p>
              <ul>
                <li>
                  <strong>Automate the Savings Rate:</strong> Route 15% to 20% of gross pay directly into retirement and
                  brokerage accounts before discretionary funds hit your checking account.
                </li>
                <li>
                  <strong>Eliminate High-Interest Revolving Debt:</strong> Paying off a 22% APR credit card delivers a
                  guaranteed, risk-free 22% return on investment that no stock market index can match.
                </li>
                <li>
                  <strong>Capture Employer Matches:</strong> Contributing enough to your 401(k) to secure an employer match
                  yields an immediate 50% to 100% return on invested capital.
                </li>
                <li>
                  <strong>Allow Compound Interest Time to Work:</strong> Explore our{' '}
                  <Link href="/compound-interest-calculator/">Compound Interest Calculator</Link> to visualize how modest
                  monthly deposits compound exponentially into six- and seven-figure wealth over 20 to 30 years.
                </li>
                <li>
                  <strong>Establish a Monthly Cash Flow Plan:</strong> Manage household income and allocate surplus cash
                  using our <Link href="/budget-calculator/">Monthly Budget Calculator (50/30/20)</Link>.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 9: FAQ */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Frequently Asked Questions</h2>
            <Faq items={FAQS} withSchema={false} />
          </section>

          {/* How We Calculate */}
          <HowWeCalculate slug="net-worth-calculator" />

          {/* YMYL Disclosures */}
          <div className={styles.ymylBox}>
            <div className={styles.ymylTitle}>
              <span>⚖</span> Sources, Methodology &amp; Financial Disclosures
            </div>
            <p>
              <strong>Accounting Standards:</strong> Balance sheet calculations adhere to standard personal financial
              accounting principles (GAAP/AICPA personal balance sheet guidelines). National net worth distributions and
              benchmark references cite the Federal Reserve Board Survey of Consumer Finances (SCF) and Federal Reserve
              Statistical Release Z.1 (Financial Accounts of the United States).
            </p>
            <p>
              <strong>Data Privacy Guarantee:</strong> KKCTools does not connect to Plaid, bank APIs, or external brokers.
              All data entered in this calculator exists solely in your browser memory and will never be tracked, sold, or
              monetized.
            </p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
              <em>Last reviewed &amp; verified: November 2026. This tool is provided for financial estimation and educational
              planning, not formal legal, tax, or investment advice.</em>
            </p>
          </div>
        </article>
      </Container>
    </main>
  );
}
