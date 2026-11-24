import React, { Suspense } from 'react';
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
import CompoundInterestCalculator from '@/components/tool/compound-interest-calculator';
import styles from './page.module.css';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';

const PAGE_TITLE = 'Compound Interest Calculator – Daily, Monthly & Growth';
const PAGE_DESC =
  'Free compound interest calculator. See how savings grow with daily or monthly compounding and regular deposits, or work out the deposit needed for a goal.';
const PAGE_PATH = '/compound-interest-calculator/';

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: PAGE_PATH,
  absoluteTitle: true,
});

const FAQS = [
  {
    q: 'How do I calculate future value (future value calc)?',
    a: 'To calculate future value (FV) with compound interest, use the formula FV = P × (1 + r/n)^(n×t) for a single lump sum, or add the future value annuity formula if making regular monthly additions. For example, $10,000 invested at 5% APR for 10 years compounded daily yields a future value of $16,486.65.',
  },
  {
    q: 'How does compound interest work?',
    a: 'Compound interest occurs when the interest earned on an investment is credited back to the principal balance, so subsequent interest calculations apply to both the original principal and accumulated interest. This creates an exponential growth curve over time rather than the flat linear growth seen with simple interest.',
  },
  {
    q: 'How do I calculate compound interest? (formula)',
    a: 'For a lump-sum deposit, the compound interest formula is A = P × (1 + r/n)^(n×t), where A is future value, P is principal, r is annual nominal interest rate (decimal), n is compounding periods per year, and t is time in years. Total interest earned equals A − P. When recurring contributions are made, an annuity future value factor is added.',
  },
  {
    q: 'How do I calculate interest compounded monthly?',
    a: 'To calculate interest compounded monthly, set n = 12 in the compounding formula: A = P × (1 + r/12)^(12×t). For example, $10,000 at 5% compounded monthly for 10 years equals $10,000 × (1 + 0.05/12)^120 = $16,470.09. If you also make monthly contributions PMT, multiply PMT by [((1 + r/12)^120 − 1) ÷ (r/12)].',
  },
  {
    q: 'Is daily compounding much better than monthly?',
    a: 'Daily compounding produces higher returns than monthly compounding, but the dollar difference is surprisingly modest. For example, $10,000 invested at 5% for 10 years yields $16,470.09 compounded monthly versus $16,486.65 compounded daily (365 days)—an advantage of only $16.56 over an entire decade. Compounding frequency cannot compensate for a low interest rate.',
  },
  {
    q: 'What does compounded continuously mean?',
    a: 'Continuous compounding represents the mathematical upper bound where interest compounds every infinitesimal fraction of a second. It is calculated using Euler’s constant e (approx. 2.71828): A = P × e^(r×t). Even with infinite compounding cycles, the final return is only marginally higher than daily compounding (e.g. $16,487.21 vs $16,486.65 on $10,000 over 10 years).',
  },
  {
    q: "What's the difference between simple and compound interest?",
    a: 'Simple interest pays returns exclusively on the original principal: Total = P × (1 + r×t). Compound interest pays returns on both the principal and all previously accumulated interest. Over short horizons (e.g. 1 year), the difference is negligible, but over 10 to 30 years, compound interest generates vastly superior total wealth.',
  },
  {
    q: 'APR vs APY: which should I enter?',
    a: 'Enter APR (Annual Percentage Rate) when quoting nominal contractual interest before compounding, common for bank certificates and loans. Enter APY (Annual Percentage Yield) when using the effective annual return that already accounts for compounding. If your bank states an APY of 5.12%, our calculator lets you toggle "Quoted as APY" to prevent double-counting compounding.',
  },
  {
    q: 'How long does it take money to double? (Rule of 72 vs exact)',
    a: 'The Rule of 72 provides a quick mental estimate: Years ≈ 72 ÷ Interest Rate (e.g., 72 ÷ 5 = 14.4 years). The mathematically exact doubling time is calculated as ln(2) ÷ ln(1 + APY). At 5% APR compounded monthly (5.116% APY), exact doubling takes 13.89 years, showing that the Rule of 72 is accurate within a few months.',
  },
  {
    q: 'How much do I need to save each month to reach $X?',
    a: 'To find your required monthly savings, switch to the "Savings Goal Solver" tab. The calculator inverts the future value annuity formula: PMT = (Target − P×(1+r/n)^(nt)) ÷ [((1+i)^(mt) − 1) ÷ i]. For instance, starting with $10,000, you need to save $450.81 per month at 7% return to reach $100,000 in 10 years.',
  },
  {
    q: 'How does inflation affect my savings?',
    a: 'Inflation diminishes the future purchasing power of your money. While your nominal dollar balance may grow to $47,526.55, a 2.5% annual inflation rate reduces the real purchasing power of that money to approximately $37,128.53 in today’s dollars. Our calculator includes an optional inflation input so you can track real, inflation-adjusted wealth.',
  },
  {
    q: 'Does deposit timing (start vs end of month) matter?',
    a: 'Yes. In an annuity due (deposits made at the beginning of each month), every contribution earns an extra month of compound interest compared to an ordinary annuity (deposits made at the end of each month). Over 10 years with $200 monthly contributions at 5%, beginning-of-month timing adds approximately $140 extra in interest.',
  },
];

export default function CompoundInterestPage() {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Business & Finance', path: '/tools/' },
    { name: 'Compound Interest Calculator', path: PAGE_PATH },
  ];

  const appSchema = buildWebApplicationSchema({
    name: 'Compound Interest Calculator',
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
          <h1 className={styles.title}>Compound Interest Calculator: Daily, Monthly and Compound Growth</h1>
          <p className={styles.bluf}>
            Use this <strong>compound calculator</strong> and <strong>compounding calculator</strong> to figure compound interest with daily, monthly, or annual intervals. Future value = P × (1 + r/n)^(n×t), plus your deposits
            grown the same way. $10,000 plus $200 a month at 5% compounded monthly grows to $47,526.55 in 10 years.
          </p>
        </header>

        <ToolShell
          features={[
            'Solve for deposit, rate or time',
            'Daily to continuous',
            'Inflation-adjusted value',
            'Yearly table & chart',
          ]}
        >
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading calculator...</div>}>
            <CompoundInterestCalculator />
          </Suspense>
        </ToolShell>

        <div className={styles.adBand}>
          <AdSlot slotId="after-tool" />
        </div>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. How to Use the Compound Interest Calculator</h2>
            <div className={styles.prose}>
              <p>
                Our compound interest tool is engineered to model wealth accumulation across multiple real-world
                scenarios. It is organized into four interactive modules:
              </p>
              <ul>
                <li>
                  <strong>Compound Growth Tab:</strong> Project future wealth from an initial principal sum combined
                  with recurring deposits. Features mixed-frequency compounding (e.g. daily interest with monthly
                  contributions), annual step-up deposit increases, tax on interest, and inflation adjustment.
                </li>
                <li>
                  <strong>Savings Goal Solver Tab:</strong> Work backwards from a specific target wealth figure. Solve
                  for the exact monthly contribution needed, the minimum annual return required, or the timeline
                  necessary to achieve financial independence.
                </li>
                <li>
                  <strong>Simple vs. Compound Tab:</strong> Compare linear simple interest side by side against
                  exponential compound growth to visualize the exact dollar advantage created by reinvested interest.
                </li>
                <li>
                  <strong>APR ↔ APY Converter:</strong> Seamlessly translate nominal annual percentage rates into true
                  effective annual yields across any compounding interval, preventing double-compounding errors.
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. The Compound Interest Formula: Behind the Exponential Math</h2>
            <div className={styles.prose}>
              <p>
                When a single principal balance grows under discrete compound interest without intermediate withdrawals
                or deposits, the terminal future value is determined by the classic exponential relationship:
              </p>

              <div className={styles.formulaBox}>A = P × (1 + r / n)^(n × t)</div>

              <p>Where the mathematical components represent:</p>
              <ul>
                <li>
                  <strong>A:</strong> Future value (the ending balance after t years).
                </li>
                <li>
                  <strong>P:</strong> Starting principal (the initial lump-sum deposit).
                </li>
                <li>
                  <strong>r:</strong> Annual nominal interest rate expressed as a decimal (e.g. 5% = 0.05).
                </li>
                <li>
                  <strong>n:</strong> Compounding frequency per year (1 for annual, 4 for quarterly, 12 for monthly, 365
                  for daily).
                </li>
                <li>
                  <strong>t:</strong> Total investment horizon in years.
                </li>
              </ul>
              <p>
                Total compound interest earned is simply the net gain: <code>Interest = A − P</code>. Because each
                compounding period credits newly minted interest directly to the principal balance, the subsequent period
                calculates returns on an expanded capital base.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Compound Growth with Regular Monthly Contributions</h2>
            <div className={styles.prose}>
              <p>
                Most investors build substantial wealth not solely through a static initial lump sum, but through
                consistent, dollar-cost-averaged periodic contributions. When contributions (PMT) occur at frequency m
                (e.g., 12 monthly deposits) while interest compounds at frequency n, exact financial maths requires
                computing the effective periodic interest rate per deposit cycle:
              </p>

              <div className={styles.formulaBox}>
                i = (1 + r / n)^(n / m) − 1
                <br />
                FV_deposits = PMT × [((1 + i)^(m × t) − 1) ÷ i] × (1 + i)^timing
              </div>

              <p>
                In this equation, <code>timing = 0</code> for ordinary end-of-period deposits (standard paycheck
                transfers), and <code>timing = 1</code> for beginning-of-period deposits (annuity due). Combining the
                lump sum with the stream of contributions gives the complete portfolio value:
              </p>
              <div className={styles.formulaBox}>FV_total = P × (1 + r / n)^(n × t) + FV_deposits</div>
              <p>
                For example, an investor starting with $10,000 who deposits $200 at the end of each month at 5% APR
                compounded monthly will accumulate <strong>$47,526.55</strong> over 10 years. Total out-of-pocket cash
                deposited is $34,000 ($10,000 starting + 120 × $200), meaning <strong>$13,526.55</strong> of the final
                balance represents pure compound interest profit.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Daily Compounding Interest Calculator (Compound Daily Calculator) vs. Monthly</h2>
            <div className={styles.prose}>
              <p>
                When using a <strong>compound daily calculator</strong> (365 cycles per year), interest is computed and added to your balance every day.
                A widespread question among retail savers is whether moving from monthly compounding to daily compounding generates enormous windfalls. While higher compounding frequencies mathematically
                increase yield, the law of diminishing returns sets in rapidly.
              </p>
              <p>
                The table below benchmarks a single $10,000 lump sum invested at 5% annual interest over a 10-year period
                across different compounding intervals:
              </p>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Compounding Interval</th>
                      <th>Cycles per Year (n)</th>
                      <th>Effective APY</th>
                      <th className={styles.numCell}>10-Year Balance</th>
                      <th className={styles.numCell}>Advantage vs Annual</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Annually</td>
                      <td>1</td>
                      <td>5.000%</td>
                      <td className={styles.numCell}>$16,288.95</td>
                      <td className={styles.numCell}>Baseline</td>
                    </tr>
                    <tr>
                      <td>Semi-Annually</td>
                      <td>2</td>
                      <td>5.063%</td>
                      <td className={styles.numCell}>$16,386.16</td>
                      <td className={styles.numCell}>+$97.21</td>
                    </tr>
                    <tr>
                      <td>Quarterly</td>
                      <td>4</td>
                      <td>5.095%</td>
                      <td className={styles.numCell}>$16,436.19</td>
                      <td className={styles.numCell}>+$147.24</td>
                    </tr>
                    <tr>
                      <td>Monthly</td>
                      <td>12</td>
                      <td>5.116%</td>
                      <td className={styles.numCell}>$16,470.09</td>
                      <td className={styles.numCell}>+$181.14</td>
                    </tr>
                    <tr>
                      <td>Daily (365 days)</td>
                      <td>365</td>
                      <td>5.127%</td>
                      <td className={styles.numCell}>$16,486.65</td>
                      <td className={styles.numCell}>+$197.70</td>
                    </tr>
                    <tr>
                      <td>Continuous</td>
                      <td>∞</td>
                      <td>5.127%</td>
                      <td className={styles.numCell}>$16,487.21</td>
                      <td className={styles.numCell}>+$198.26</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                Notice that jumping from annual to monthly compounding increases 10-year wealth by $181.14. However,
                jumping all the way from monthly compounding to daily compounding gains only <strong>$16.56</strong> over
                an entire decade. The nominal interest rate you earn and your personal savings rate matter exponentially
                more than the difference between daily and monthly compounding intervals.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Savings Account Interest Calculator (APY &amp; Bank Deposits)</h2>
            <div className={styles.prose}>
              <p>
                When searching for a <strong>saving account calculator</strong>, look closely at how the financial institution quotes returns. US savings accounts quote an Annual Percentage Yield (APY), which already includes the effect of compounding at whatever frequency the bank uses.
              </p>
              <p>
                For one year with no deposits or withdrawals: <code>Interest Earned = Principal Balance × APY</code>. For multi-year projections with regular paycheck deposits, enter the stated APY into our calculator and toggle the rate basis to &ldquo;Quoted as APY&rdquo; to project savings growth without double-compounding.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Continuous Compounding ($P \times e^{'{rt}'}$) and the Euler Constant</h2>
            <div className={styles.prose}>
              <p>
                What happens when interest is compounded every second, every millisecond, or every continuous instant?
                In calculus, as n approaches infinity, the limit of <code>(1 + r/n)^(nt)</code> converges to the
                exponential function <code>e^(rt)</code>, where <code>e</code> is Euler’s number (approximately
                2.718281828).
              </p>

              <div className={styles.formulaBox}>A = P × e^(r × t)</div>

              <p>
                Continuous compounding represents the absolute theoretical ceiling of compound interest. Even with
                infinite compounding cycles, $10,000 at 5% over 10 years tops out at $16,487.21—just 56 cents higher
                than daily compounding. In institutional derivatives pricing and options models (such as Black-Scholes),
                continuous compounding is used as the standard mathematical baseline.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Compound Interest vs. Simple Interest: The Growth Gap</h2>
            <div className={styles.prose}>
              <p>
                Simple interest is calculated strictly on original principal, regardless of how much interest has
                previously accrued. Calculate exact linear accruals between dates using our{' '}
                <Link href="/simple-interest-calculator/" style={{ color: 'var(--cat-math)', fontWeight: 600 }}>
                  Simple Interest Calculator
                </Link>. The growth formula is linear:
              </p>
              <div className={styles.formulaBox}>Simple Future Value = P × (1 + r × t)</div>
              <p>
                Under simple interest, $10,000 invested at 5% earns exactly $500 per year, every year. After 10 years, it
                totals $15,000. Under compound interest, that same $10,000 yields $16,470.09. The $1,470.09 surplus is
                the compounding premium.
              </p>
              <p>
                When regular monthly deposits are involved, the gap widens dramatically. On our benchmark scenario of
                $10,000 starting principal plus $200 per month at 5% for 10 years, simple interest yields $43,200.00
                total balance, while monthly compound interest yields $47,526.55. That is a <strong>$4,326.55 advantage
                (+10.0%)</strong> produced solely by the compounding mechanic.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. APR vs. APY: How Compounding Changes Effective Yield</h2>
            <div className={styles.prose}>
              <p>
                Financial institutions often present rates in two distinct formats, and conflating them leads to
                inaccurate financial planning:
              </p>
              <ul>
                <li>
                  <strong>Annual Percentage Rate (APR):</strong> The nominal stated rate without compounding. If a
                  credit card charges 24% APR compounded monthly, the monthly periodic rate is 2% (24% ÷ 12).
                </li>
                <li>
                  <strong>Annual Percentage Yield (APY):</strong> The true effective annual rate reflecting compounding.
                  A 24% nominal APR compounded monthly produces an effective APY of{' '}
                  <code>(1 + 0.24/12)^12 − 1 = 26.82%</code>.
                </li>
              </ul>
              <p>
                Under the federal Truth in Savings Act, banks must disclose APY on deposit accounts so consumers can
                compare certificates of deposit (CDs) and high-yield savings accounts on an apples-to-apples basis. Our
                APR ↔ APY tab lets you convert instantly between both conventions. If you are calculating revolving debt
                repayment schedules, explore our dedicated{' '}
                <Link href="/credit-card-payoff-calculator/">Credit Card Payoff &amp; APR Calculator</Link>, or model
                market-based portfolio growth and T-bill yields with our{' '}
                <Link href="/investment-return-calculator/">Investment Return Calculator</Link>.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Rule of 72 vs. Exact Doubling Time</h2>
            <div className={styles.prose}>
              <p>
                The Rule of 72 is an intuitive mental shorthand used by investors to approximate the time required for an
                asset to double in value at a constant annual growth rate:
              </p>
              <div className={styles.formulaBox}>Doubling Years ≈ 72 ÷ Annual Return Rate (%)</div>
              <p>
                At a 6% return rate, the Rule of 72 suggests your money will double in approximately 12 years (72 ÷ 6). At
                8%, it takes roughly 9 years (72 ÷ 8).
              </p>
              <p>
                The mathematically exact doubling formula is derived directly from logarithms:
              </p>
              <div className={styles.formulaBox}>Exact Doubling Years = ln(2) ÷ ln(1 + APY)</div>
              <p>
                For our benchmark 5% nominal rate compounded monthly (5.116% APY), exact doubling requires{' '}
                <strong>13.89 years</strong>, compared to the Rule of 72 estimate of 14.4 years. The Rule of 72 is most
                accurate for interest rates between 5% and 10%; outside that range, the exact logarithmic formula should
                always be consulted.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Real Growth: Accounting for Inflation and Taxes</h2>
            <div className={styles.prose}>
              <p>
                Nominal investment gains only tell half the story. Real purchasing power depends on two critical
                drags: inflation and taxation.
              </p>
              <ul>
                <li>
                  <strong>Inflation Drag:</strong> As prices rise over time, the purchasing power of each dollar erodes.
                  To find your real, inflation-adjusted wealth, future nominal dollars are deflated using the Fisher
                  equation: <code>Real Value = Nominal Balance ÷ (1 + Inflation)^t</code>.
                </li>
                <li>
                  <strong>Tax Drag:</strong> In taxable brokerage accounts or high-yield savings accounts, interest is
                  taxed annually as ordinary income. A 20% effective tax bracket reduces a 5% yield to an after-tax
                  yield of 4.0% [5% × (1 − 0.20)], significantly dampening the compounding curve over 20+ years.
                </li>
              </ul>
              <p>
                In our calculator, inputting an estimated inflation rate and marginal tax rate updates both the visual
                accumulation schedule and the real purchasing power metric in real time.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Reverse Goal Planning: How Much Do I Need to Save Each Month?</h2>
            <div className={styles.prose}>
              <p>
                Rather than asking &ldquo;how much will I have?&rdquo;, practical financial planning usually starts with a target:
                &ldquo;I want $100,000 for a down payment in 10 years&mdash;how much must I save every month?&rdquo;
              </p>
              <p>
                Our <strong>Savings Goal Solver</strong> tab solves this equation directly. Assuming an initial $10,000
                nest egg and a 7% expected annual return compounded monthly, reaching $100,000 in 10 years requires
                contributing exactly <strong>$450.81 per month</strong>.
              </p>
              <p>
                If $450.81 exceeds your current monthly budget, the solver can dynamically solve for the required time
                horizon or the necessary rate of return, empowering you to adjust your financial roadmap with clarity.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Frequently Asked Questions</h2>
            <Faq items={FAQS} withSchema={false} />
          </section>

          <HowWeCalculate slug="compound-interest-calculator" />

          <div className={styles.disclaimer}>
            <strong>Disclaimer:</strong> This compound interest calculator is provided for illustrative and educational
            purposes only. Calculations do not constitute personal financial, tax, or investment advice. Actual market
            returns fluctuate, and investment yields are not guaranteed. Always consult a licensed fiduciary or certified
            financial planner before making major investment decisions.
          </div>

          <section className={styles.section} style={{ marginTop: '2.5rem' }}>
            <h3 className={styles.sectionTitle}>Explore Related Financial Calculators</h3>
            <div className={styles.relatedGrid}>
              <Link href="/cagr-calculator/" className={styles.relatedCard}>
                <h4 className={styles.relatedCardTitle}>CAGR Calculator</h4>
                <p className={styles.relatedCardDesc}>
                  Work backwards from a start and end value to the compound annual growth rate, with the Rule of 72.
                </p>
              </Link>
              <Link href="/present-value-calculator/" className={styles.relatedCard}>
                <h4 className={styles.relatedCardTitle}>Present Value & NPV Calculator</h4>
                <p className={styles.relatedCardDesc}>
                  Discount future lump sums and cash flow annuities to present dollars, calculate capital project NPV,
                  and generate printable discount tables.
                </p>
              </Link>
              <Link href="/percentage-change-calculator/" className={styles.relatedCard}>
                <h4 className={styles.relatedCardTitle}>Percentage Change Calculator</h4>
                <p className={styles.relatedCardDesc}>
                  Calculate percentage increases, decreases, relative differences, and cumulative growth rates across
                  multiple values.
                </p>
              </Link>
              <Link href="/cap-rate-calculator/" className={styles.relatedCard}>
                <h4 className={styles.relatedCardTitle}>Cap Rate Calculator</h4>
                <p className={styles.relatedCardDesc}>
                  Analyze commercial and multifamily real estate yields with NOI bridges and sensitivity matrices.
                </p>
              </Link>
              <Link href="/business-valuation-calculator/" className={styles.relatedCard}>
                <h4 className={styles.relatedCardTitle}>Business Valuation Calculator</h4>
                <p className={styles.relatedCardDesc}>
                  Estimate small business worth using SDE and EBITDA multiples, balance sheet adjustments, and seller
                  financing structures.
                </p>
              </Link>
            </div>
          </section>
        </article>
      </Container>
    </main>
  );
}
