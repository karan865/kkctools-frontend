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
import DrawdownCalculator from '@/components/tool/how-long-will-my-money-last';
import styles from './page.module.css';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';

const PAGE_TITLE = 'How Long Will My Money Last? Retirement Calculator';
const PAGE_DESC =
  'Free calculator: enter savings, yearly withdrawals, return and inflation to see how many years your money will last, with a year-by-year balance table.';
const PAGE_PATH = '/how-long-will-my-money-last/';

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: PAGE_PATH,
  absoluteTitle: true,
});

const FAQS = [
  {
    q: 'How long will my money last in retirement?',
    a: 'How long your money lasts depends on four interconnected variables: your initial portfolio balance, your annual spending rate, your net investment return, and consumer price inflation. For example, a $500,000 portfolio earning a steady 5.0% return with $40,000 annual withdrawals lasts approximately 20.1 years if spending remains flat. If annual withdrawals increase by 3.0% each year to match inflation, the portfolio depletes in approximately 15.2 years (at age 80 for a 65-year-old retiree).',
  },
  {
    q: 'How long will $500,000 last?',
    a: 'At an assumed 5.0% annual investment return: (1) Withdrawing $25,000 per year (5.0% initial rate) with flat spending lasts indefinitely because earnings equal withdrawals. (2) Withdrawing $30,000 per year rising with 3.0% inflation lasts approximately 23.5 years. (3) Withdrawing $40,000 per year rising with 3.0% inflation lasts approximately 15.2 years. (4) Withdrawing $50,000 per year (10.0% initial rate) rising with 3.0% inflation lasts approximately 11.2 years.',
  },
  {
    q: 'How long will $1 million last?',
    a: 'With a $1,000,000 nest egg earning an assumed 5.0% annual return: (1) Withdrawing $40,000 per year (a 4.0% initial withdrawal rate) rising with 3.0% inflation lasts approximately 36.4 years, sustaining retirement well past age 100 for a 65-year-old. (2) Withdrawing $60,000 per year rising with 3.0% inflation lasts approximately 20.5 years. (3) Withdrawing $80,000 per year lasts approximately 14.1 years.',
  },
  {
    q: 'What is the 4% rule?',
    a: 'The 4% rule is an empirical retirement guideline established by financial planner William Bengen in his landmark 1994 paper. Bengen examined historical 30-year rolling retirement periods back to 1926 and found that a retiree with a 50/50 stock/bond asset allocation could withdraw 4.0% of their initial portfolio in Year 1, increase subsequent dollar withdrawals by the exact rate of inflation each year, and never exhaust their money over 30 years.',
  },
  {
    q: 'Is the 4% rule still useful today?',
    a: 'The 4% rule remains a helpful benchmark, but it is a static rule of thumb rather than an immutable law. It was based on past US market returns over 30-year periods, so it is not a guarantee. People retiring early, or planning for a longer retirement, often test a lower starting rate, or spending rules that trim withdrawals after bad market years. Use the scenarios in this calculator to see how sensitive your plan is.',
  },
  {
    q: 'What return should I assume for my retirement portfolio?',
    a: 'No one knows future returns, and the right assumption depends on how your savings are invested. Cash-like savings earn roughly what savings accounts pay today; a mix with stocks may earn more over time but swings more. Try a cautious figure, then use the “lower return” scenario to see how much your plan depends on it. This is not a forecast or advice.',
  },
  {
    q: 'Should I include Social Security or a pension in the calculation?',
    a: 'Yes. Guaranteed lifetime income from Social Security, defined-benefit pensions, or annuities directly offsets how much cash you must draw from your personal investment portfolio. For example, if you require $50,000 annual spending and receive $20,000 from Social Security starting at age 67, your portfolio only needs to provide $30,000, significantly extending your nest egg’s longevity.',
  },
  {
    q: 'How does inflation change how long my money lasts?',
    a: 'Inflation compounds expenses over time. At 3.0% annual inflation, a $40,000 annual budget in Year 1 requires $53,757 by Year 10 and $72,244 by Year 20 to purchase the identical basket of goods. Failing to account for inflation creates a false sense of security; an unadjusted portfolio lasting 20 years often runs dry 5 to 6 years sooner under persistent 3% inflation.',
  },
  {
    q: 'How much can I withdraw so my money lasts until I am 95?',
    a: 'Using the "How Much Can I Spend?" tab, a 65-year-old with $500,000 earning an assumed 5.0% return with 3.0% inflation can sustainably spend $22,810.94 in Year 1 (approximately $1,901/month), escalating with inflation each year to maintain purchasing power through age 95.',
  },
  {
    q: 'What is sequence-of-returns risk?',
    a: 'Sequence-of-returns risk refers to the danger that negative investment returns occur early in your retirement when you are actively selling assets. Even if long-term average returns match historical expectations, suffering steep market drops in Years 1 and 2 permanently depletes unit shares, leaving fewer assets to participate in subsequent recoveries. Our built-in stress test demonstrates this impact numerically.',
  },
  {
    q: 'Are the withdrawals calculated before or after tax?',
    a: 'The calculator models withdrawals in pre-tax or after-tax terms depending on your situation. If withdrawing from traditional tax-deferred accounts (Traditional IRA, 401k), ordinary income taxes will be withheld, requiring a higher gross distribution to achieve your take-home living budget. Qualified Roth IRA distributions, in contrast, are completely tax-free.',
  },
  {
    q: 'Can my money last forever?',
    a: 'Yes. If your annual withdrawal rate is less than or equal to your portfolio’s net annual earnings (e.g. withdrawing $25,000 on a $500,000 portfolio earning 5.0%), the principal capital remains untouched. In that scenario, your savings will last indefinitely under steady return assumptions.',
  },
];

export default function HowLongPage() {
  const jsonLdData = [
    buildWebApplicationSchema({
      name: 'How Long Will My Money Last Calculator',
      description: PAGE_DESC,
      path: PAGE_PATH,
    }),
    buildFaqSchema(FAQS),
  ];

  return (
    <main className={`${styles.page} ${toolDisplayFont.variable} ${typo.scope}`}>
      <JsonLd data={jsonLdData} />

      <Container>
        <div className={styles.breadcrumbs}>
          <Breadcrumbs
            items={[
              { name: 'Home', path: '/' },
              { name: 'Tools Directory', path: '/tools/' },
              { name: 'How Long Will My Money Last Calculator', path: PAGE_PATH },
            ]}
          />
        </div>

        <div className={styles.hero}>
          <h1 className={styles.title}>How Long Will My Money Last Calculator</h1>
          <p className={styles.bluf}>
            Your retirement savings last until ongoing living expenses exhaust accumulated principal and investment
            growth. A $500,000 nest egg earning an assumed 5% return with $40,000 annual withdrawals lasts approximately
            20.1 years with flat spending; if withdrawals increase with 3% annual inflation, the money lasts
            approximately 15.2 years (until age 80 for a 65-year-old retiree).
          </p>
        </div>

        <ToolShell
          features={[
            'Years left or max spending',
            'Inflation & pensions',
            'Bad-start scenario',
            'Year-by-year table',
          ]}
        >
          <DrawdownCalculator />
        </ToolShell>

        <div className={styles.adBand}>
          <AdSlot slotId="drawdown-top" />
        </div>

        {/* Editorial Content */}
        <div className={styles.content}>
          {/* Section 1: Quick Answer */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Quick Answer: How Long Will My Money Last?</h2>
            <div className={styles.prose}>
              <p>
                In retirement planning, capital longevity is determined by the dynamic interplay between your starting
                portfolio, ongoing withdrawals, net investment compounding, and consumer price inflation:
              </p>
              <ul>
                <li>
                  <strong>Fixed (Flat) Withdrawals:</strong> When annual spending remains completely level without inflation
                  adjustments, capital depletion follows a logarithmic closed-form formula:
                  <div className={styles.formulaBox}>
                    Years = ln[W ÷ (W − r × P)] ÷ ln(1 + r)
                  </div>
                  Where <strong>P</strong> is your starting capital, <strong>W</strong> is annual spending, and{' '}
                  <strong>r</strong> is your net annual investment return. For $500,000 invested at 5.0% with $40,000 flat
                  annual withdrawals, the portfolio lasts exactly <strong>20.1 years</strong>.
                </li>
                <li>
                  <strong>Inflation-Adjusted Withdrawals:</strong> Because retirees must pay higher prices over time,
                  adjusting withdrawals each year by 3% inflation accelerates depletion, exhausting the same $500,000 portfolio
                  in approximately <strong>15.2 years</strong>.
                </li>
                <li>
                  <strong>Perpetual Capital:</strong> If annual withdrawals are less than or equal to annual interest earnings
                  (i.e., W ≤ r × P, or $25,000/year on $500,000 at 5%), your principal is never touched and the money lasts
                  indefinitely under consistent market conditions.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2: How to Use */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. How to Use the Calculator</h2>
            <div className={styles.prose}>
              <p>
                This calculator provides three distinct perspectives on retirement spending and capital preservation:
              </p>
              <ol>
                <li>
                  <strong>How Many Years Will It Last? (Default):</strong> Enter your existing savings pot, current age,
                  target annual budget, and expected return rate to see the exact year and age when your portfolio will run dry.
                </li>
                <li>
                  <strong>How Much Can I Spend?:</strong> Enter a target life expectancy (such as age 90 or 95). The engine
                  uses growing annuity mathematics to solve for the maximum sustainable Year 1 spending that keeps your portfolio
                  solvent throughout your retirement horizon.
                </li>
                <li>
                  <strong>4% Rule Baseline:</strong> Automatically models William Bengen&apos;s historic 4.0% initial withdrawal
                  rate guideline ($20,000/year on $500k) adjusted annually for inflation.
                </li>
              </ol>
              <p>
                To model broader asset allocation, compound growth, and T-bill yields, visit our{' '}
                <Link href="/investment-return-calculator/">Investment Return Calculator</Link>.
              </p>
            </div>
          </section>

          {/* Section 3: What Decides How Long Your Savings Last */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. What Decides How Long Your Savings Last</h2>
            <div className={styles.prose}>
              <p>
                Six primary financial forces dictate retirement portfolio survivability:
              </p>
              <ul>
                <li>
                  <strong>1. Initial Withdrawal Rate:</strong> The percentage of savings drawn in Year 1 (e.g. $40,000 on $500k
                  = 8.0%). Initial withdrawal rates above 6.0% dramatically increase the probability of early portfolio exhaustion.
                </li>
                <li>
                  <strong>2. Rate of Return:</strong> The compound interest and dividends earned on remaining capital. A 1%
                  difference in annual return often extends portfolio life by 3 to 5 full years.
                </li>
                <li>
                  <strong>3. Inflation Escalation:</strong> Increases in the cost of groceries, utilities, and healthcare.
                  Compounding at 3% per year doubles living costs every 24 years.
                </li>
                <li>
                  <strong>4. Investment Fees &amp; Expense Ratios:</strong> Asset management fees (such as 1.0% advisory fees
                  or high mutual fund expense ratios) reduce net portfolio compounding dollar-for-dollar.
                </li>
                <li>
                  <strong>5. Guaranteed Supplemental Income:</strong> Lifetime Social Security checks, government pensions,
                  or private annuities provide a spending floor that shields your portfolio from liquidation.
                </li>
                <li>
                  <strong>6. Sequence of Returns:</strong> The chronological order of market gains and losses. Experiencing
                  steep market declines in early retirement impairs capital far more than identical drops later in life.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Benchmark Table */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. How Long Will $500,000 or $1 Million Last?</h2>
            <div className={styles.prose}>
              <p>
                The table below benchmarks portfolio longevity across common savings levels at an assumed 5.0% annual
                investment return with 3.0% annual inflation adjustments:
              </p>
              <table className={styles.proseTable}>
                <thead>
                  <tr>
                    <th>Starting Portfolio</th>
                    <th>Initial Year 1 Withdrawal</th>
                    <th>Initial Withdrawal Rate</th>
                    <th>Longevity (Flat Spending)</th>
                    <th>Longevity (3% Inflation)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>$250,000</strong></td>
                    <td>$20,000 / year</td>
                    <td>8.00%</td>
                    <td>20.1 Years</td>
                    <td>15.2 Years</td>
                  </tr>
                  <tr>
                    <td><strong>$500,000</strong></td>
                    <td>$25,000 / year</td>
                    <td>5.00%</td>
                    <td>Indefinite (W ≤ rP)</td>
                    <td>28.5 Years</td>
                  </tr>
                  <tr>
                    <td><strong>$500,000</strong></td>
                    <td>$35,000 / year</td>
                    <td>7.00%</td>
                    <td>25.7 Years</td>
                    <td>18.1 Years</td>
                  </tr>
                  <tr>
                    <td><strong>$500,000</strong></td>
                    <td>$40,000 / year</td>
                    <td>8.00%</td>
                    <td>20.1 Years</td>
                    <td>15.2 Years</td>
                  </tr>
                  <tr>
                    <td><strong>$1,000,000</strong></td>
                    <td>$40,000 / year</td>
                    <td>4.00%</td>
                    <td>Indefinite (W ≤ rP)</td>
                    <td>36.4 Years</td>
                  </tr>
                  <tr>
                    <td><strong>$1,000,000</strong></td>
                    <td>$50,000 / year</td>
                    <td>5.00%</td>
                    <td>Indefinite (W ≤ rP)</td>
                    <td>26.2 Years</td>
                  </tr>
                  <tr>
                    <td><strong>$1,000,000</strong></td>
                    <td>$65,000 / year</td>
                    <td>6.50%</td>
                    <td>29.2 Years</td>
                    <td>19.2 Years</td>
                  </tr>
                </tbody>
              </table>
              <p>
                For estimating percentage shifts in spending across retirement phases, use our{' '}
                <Link href="/percentage-change-calculator/">Percentage Change Calculator</Link>.
              </p>
            </div>
          </section>

          {/* Section 5: Other Incomes */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. How Long Will My Retirement Savings Last? (Adding Social Security)</h2>
            <div className={styles.prose}>
              <p>
                Most retirees do not live exclusively on private savings. Social Security benefits and employer pensions
                provide guaranteed, lifetime income that substantially prolongs portfolio durability.
              </p>
              <p>
                <strong>Worked Supplemental Income Example:</strong> Consider a retiree at age 62 with $500,000 in savings
                who spends $45,000 per year (rising with 3% inflation at a 5% portfolio return):
              </p>
              <ul>
                <li>
                  <strong>Without Social Security:</strong> Drawing the entire $45,000 from portfolio savings causes full
                  depletion in approximately 13.1 years (exhausted at age 75).
                </li>
                <li>
                  <strong>With $20,000 Social Security at Age 67:</strong> For the first 5 years (ages 62 to 67), the retiree
                  draws the full amount from savings. At age 67, Social Security activates, reducing portfolio withdrawals to
                  just $25,000 plus inflation.
                </li>
                <li>
                  <strong>Longevity Impact:</strong> The nest egg lasts until age 84—providing an extra <strong>9 years of
                  portfolio solvency</strong>.
                </li>
              </ul>
              <p>
                If you have passive rental properties generating consistent cash flow, evaluate your real estate yield with our{' '}
                <Link href="/rental-property-calculator/">Rental Property Calculator</Link>.
              </p>
            </div>
          </section>

          {/* Section 6: The 4% Rule */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. The 4% Rule: What It Is and What It Isn&apos;t</h2>
            <div className={styles.prose}>
              <p>
                The 4% rule originated from a 1994 research study by certified financial planner William P. Bengen published
                in the <em>Journal of Financial Planning</em>. Bengen sought to determine the maximum historical withdrawal rate
                that would survive any 30-year retirement window dating back to 1926—including catastrophic periods like the
                1929 Great Crash and the 1970s stagflation.
              </p>
              <p>
                His findings—later reinforced by the Trinity Study (Cooley, Hubbard, and Walz, 1998, <em>AAII Journal</em>)—established
                that a 4% initial withdrawal rate from a balanced portfolio (50% to 75% stocks, balance in intermediate bonds),
                escalated annually for CPI inflation, survived 100% of historical 30-year periods.
              </p>
              <div className={styles.exampleBox}>
                <strong>Crucial Limitations of the 4% Rule:</strong>
                <ul>
                  <li>It is not a guarantee of future safety; past market returns do not dictate future market performance.</li>
                  <li>It assumes a fixed 30-year horizon. Early retirees planning for 40 to 50 years face higher failure rates.</li>
                  <li>It assumes constant, rigid spending adjustments regardless of market volatility. In reality, retirees can
                  adapt by pausing inflation bumps during bear markets.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 7: Sequence of Returns */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Sequence-of-Returns Risk: The Hidden Danger of Early Drawdowns</h2>
            <div className={styles.prose}>
              <p>
                During your wealth accumulation years, the chronological order of annual returns does not affect your final
                portfolio balance. However, once you enter the distribution phase, <strong>the sequence of returns is
                critical</strong>.
              </p>
              <p>
                If a major market downturn occurs in the first two to three years of retirement, you are forced to liquidate
                shares at depressed prices to meet living expenses. This locks in capital losses and permanently reduces the
                number of shares available to compound when markets rebound.
              </p>
              <p>
                Our built-in stress test simulates an initial two-year market contraction of −15% per year. On a $500,000
                portfolio, this early shock accelerates depletion by approximately 4 to 5 years compared to steady compounding,
                highlighting the importance of maintaining a 1-to-2 year cash buffer in retirement.
              </p>
            </div>
          </section>

          {/* Section 8: Longevity */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. How Long Might Retirement Last? Longevity Expectations</h2>
            <div className={styles.prose}>
              <p>
                According to the Social Security Administration (SSA) actuarial tables, a 65-year-old American male has an
                average life expectancy of approximately 84 years, while a 65-year-old female has an average life expectancy
                of approximately 87 years.
              </p>
              <p>
                Crucially, these are statistical medians. For a 65-year-old married couple, there is a 50% probability that at
                least one spouse will survive past age 92, and a 25% chance one will survive past age 95. Planning for an asset
                lifespan through age 95 or 100 provides essential protection against longevity risk.
              </p>
            </div>
          </section>

          {/* Section 9: Practical Strategies */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Practical Strategies to Make Savings Last Longer</h2>
            <div className={styles.prose}>
              <p>
                Retirees can employ several non-advisory, empirical strategies to defend capital longevity:
              </p>
              <ul>
                <li>
                  <strong>Adopt Dynamic Spending Guardrails:</strong> Instead of automatically taking 3% inflation increases
                  every year, skip inflation adjustments following negative market return years (the Guyton-Klinger guardrails method).
                </li>
                <li>
                  <strong>Maintain a 1–2 Year Cash Buffer:</strong> Holding 12 to 24 months of essential living expenses in liquid
                  money market accounts prevents forced asset sales during equity market downturns.
                </li>
                <li>
                  <strong>Optimize Social Security Claiming:</strong> Delaying Social Security benefits from age 62 to age 70
                  increases your monthly guaranteed payout by approximately 8% for each year delayed, significantly reducing
                  portfolio reliance in later decades.
                </li>
                <li>
                  <strong>Consider Part-Time Consulting:</strong> Earning even $10,000 to $15,000 per year from freelance work
                  or consulting during early retirement dramatically dampens early portfolio depletion. To model freelance billing,
                  use our <Link href="/hourly-to-salary-calculator/">Hourly to Salary Calculator</Link>.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 10: What This Tool Doesn't Model */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. What This Calculator Doesn&apos;t Model</h2>
            <div className={styles.prose}>
              <p>
                To maintain transparency, keep in mind that this calculator uses deterministic scenario modeling. It does not
                incorporate:
              </p>
              <ul>
                <li>
                  <strong>Complex Tax Brackets:</strong> Detailed federal and state graduated tax brackets, Medicare IRMAA
                  surcharges, or required minimum distribution (RMD) rules.
                </li>
                <li>
                  <strong>Stochastic (Monte Carlo) Randomness:</strong> Random daily or monthly market walk simulations.
                </li>
                <li>
                  <strong>Catastrophic Long-Term Care:</strong> Nursing home or assisted living expenses, which must be planned
                  via dedicated insurance or reserve capital.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 11: How We Calculate Component */}
          <section className={styles.section}>
            <HowWeCalculate slug="how-long-will-my-money-last" />
          </section>

          {/* Section 12: Frequently Asked Questions */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Frequently Asked Questions</h2>
            <Faq items={FAQS} withSchema={false} />
          </section>

          {/* Regulatory Disclosures & Last Reviewed */}
          <div className={styles.disclaimerNotice}>
            <p>
              <strong>Regulatory &amp; Editorial Disclosures:</strong> This calculator is published strictly for educational,
              illustrative scenario planning and does not constitute personalized financial, retirement, tax, or investment advice.
              Calculations are deterministic illustrations based on user-supplied variables. Past historical performance (including
              the 4% rule) does not guarantee future results. KKCTools does not sell financial products, broker retirement accounts,
              or endorse specific financial advisors.
            </p>
            <p>
              <strong>Last Reviewed &amp; Verified:</strong> November 2026. Mathematics aligned with Bengen (1994) retirement
              drawdown research, the Trinity Study (1998), and Social Security Administration (SSA) actuarial period life tables.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
