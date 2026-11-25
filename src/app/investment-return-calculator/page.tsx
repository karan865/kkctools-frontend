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
import InvestmentReturnCalculator from '@/components/tool/investment-return-calculator';
import styles from './page.module.css';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';

const PAGE_TITLE = 'Investment Calculator – S&P 500, T-Bills & Money Market';
const PAGE_DESC =
  'Free investment calculator. Project growth at an assumed S&P 500-style return, compare it with T-bills and money market interest, and see fees and inflation.';
const PAGE_PATH = '/investment-return-calculator/';

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: PAGE_PATH,
  absoluteTitle: true,
});

const FAQS = [
  {
    q: 'How do I calculate investment returns?',
    a: 'Investment returns are calculated using compound interest formulas combining initial principal and regular contributions: FV = PV × (1 + r/m)^(m×t) + PMT × [((1 + r/m)^(m×t) − 1) ÷ (r/m)]. For example, investing a $10,000 lump sum plus $300 per month for 20 years at an assumed 7.0% nominal return compounded monthly yields approximately $196,665 total accumulated capital from $82,000 in total out-of-pocket contributions.',
  },
  {
    q: 'What return should I use for the S&P 500?',
    a: 'There is no correct number: future returns are unknown, and this page doesn’t quote historical averages it can’t compute from a dated dataset. Choose an assumption you can defend, then test a lower one with the Compare tab or the quick-rate chips. Past performance does not guarantee future results, and this is not investment advice.',
  },
  {
    q: 'How do I calculate money market interest?',
    a: 'To calculate money market interest, convert the stated Annual Percentage Yield (APY) into an effective monthly compounding rate using: r_monthly = (1 + APY)^(1/12) − 1. For example, a $25,000 balance in a money market account paying a 4.50% APY generates exactly $1,125.00 in total interest over 12 months with no additional deposits, resulting in an ending cash balance of $26,125.00.',
  },
  {
    q: 'How do T-bill yields work?',
    a: 'U.S. Treasury bills (T-bills) do not pay regular coupon interest; instead, they are sold at a discount to their face (par) value and mature at full face value. The Treasury Discount Rate is calculated on a 360-day bank basis: Discount Rate = [(Face − Price) ÷ Face] × (360 ÷ Days). The Investment Yield (Coupon Equivalent Yield) standardizes returns on a 365-day basis: Investment Yield = [(Face − Price) ÷ Price] × (365 ÷ Days). For a 26-week ($10,000 par) bill purchased for $9,750 with 182 days to maturity, the discount rate is 4.945% and the investment yield is 5.142%.',
  },
  {
    q: 'Do investment fees really make a big difference?',
    a: 'Yes. Even seemingly small expense ratios create substantial wealth drag over long compounding horizons. For instance, on a $50,000 initial balance with $500 monthly contributions over 25 years at an 8.0% gross return, paying a 0.75% annual fee (expense ratio plus advisor fee) reduces the final portfolio by over $116,400 compared to a zero-fee index fund. Keeping expense ratios low is one of the most reliable variables investors can control.',
  },
  {
    q: 'What is an inflation-adjusted (real) return?',
    a: 'An inflation-adjusted (real) return reflects the true purchasing power of your future wealth by discounting future dollars against consumer price increases: Real FV = Nominal FV ÷ (1 + Inflation Rate)^Years. If a $20,000 investment grows nominally to $36,388 over 10 years at a 6.0% return, 3.0% annual inflation reduces its purchasing power in today’s dollars to $27,076.',
  },
  {
    q: 'Lump sum or monthly investing: which grows more?',
    a: 'With a steady positive assumed return, investing a lump sum earlier grows more than spreading the same money out, because it is invested for longer (the calculator shows the difference). However, monthly dollar-cost averaging minimizes the psychological regret of investing immediately prior to a market correction and provides disciplined savings habits.',
  },
  {
    q: 'Can I use this as a Roth IRA return calculator?',
    a: 'Yes. You can use the Projection tab to model Roth IRA portfolio growth by setting your starting balance, annual contributions (up to IRS statutory limits), assumed return, and years to retirement. Because qualified Roth IRA distributions are completely tax-free in retirement, set the Tax Drag field to 0% to reflect pure tax-sheltered compounding.',
  },
  {
    q: 'Can I model regular withdrawals?',
    a: 'Yes. The Projection tab includes an optional monthly withdrawal field to simulate portfolio decumulation, supplemental retirement income, or periodic distributions. If your monthly withdrawals exceed investment growth plus contributions, your ending balance will decline over time.',
  },
  {
    q: 'Is this tool providing financial or investment advice?',
    a: 'No. This calculator is strictly an educational tool provided for illustrative scenario planning. It does not provide personalized investment advice, tax counseling, or endorse specific securities. Equity investments involve risk of loss, including loss of principal capital. Consult a qualified, fiduciary financial advisor or tax specialist before making investment decisions.',
  },
];

export default function InvestmentReturnPage() {
  const jsonLdData = [
    buildWebApplicationSchema({
      name: 'Investment Return Calculator',
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
              { name: 'Investment Return Calculator', path: PAGE_PATH },
            ]}
          />
        </div>

        <div className={styles.hero}>
          <h1 className={styles.title}>Investment Return Calculator: S&amp;P 500, T-Bills and Money Market</h1>
          <p className={styles.bluf}>
            Future portfolio wealth depends on capital invested, compounding returns, expense ratios, and time. An
            initial $10,000 lump sum plus $300 per month at an assumed 7% nominal annual return grows to approximately
            $196,665 over 20 years ($120,019 in today&apos;s purchasing power). A 4.5% money market cash account pays
            $1,125 in annual interest on a $25,000 deposit.
          </p>
        </div>

        <ToolShell
          features={[
            'Stocks vs cash compare',
            'Fees & inflation',
            'Money market & T-bills',
            'Yearly table & chart',
          ]}
        >
          <InvestmentReturnCalculator />
        </ToolShell>

        <div className={styles.adBand}>
          <AdSlot slotId="investment-return-top" />
        </div>

        {/* Editorial Content */}
        <div className={styles.content}>
          {/* Section 1: How to Use */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. How to Use the Investment Calculator</h2>
            <div className={styles.prose}>
              <p>
                Navigating long-term wealth accumulation requires balancing realistic market growth against the certainty
                of cash yields and the eroding effects of fees and inflation. This calculator features four dedicated modes:
              </p>
              <ul>
                <li>
                  <strong>Growth Projection &amp; S&amp;P 500:</strong> Model compound growth on initial savings plus recurring
                  monthly or annual deposits. Incorporate annual contribution step-ups, fund expense ratios, tax drag, and
                  inflation discounting.
                </li>
                <li>
                  <strong>Money Market &amp; Savings:</strong> Calculate zero-risk interest earned on liquid cash reserves
                  held in high-yield savings accounts or money market funds across any holding period.
                </li>
                <li>
                  <strong>Treasury Bills (T-Bills):</strong> Convert discounted auction purchase prices into true annualized
                  discount rates and coupon-equivalent investment yields on 4-week to 52-week federal paper.
                </li>
                <li>
                  <strong>Stocks vs. Cash Compare:</strong> Directly benchmark an equity-tilted growth portfolio against a
                  capital-preservation cash account on identical contributions.
                </li>
              </ul>
              <div className={styles.exampleBox}>
                <strong>Honesty &amp; Transparency Standard:</strong> Market equity returns are non-linear and volatile.
                Selecting a 7% or 10% rate represents an illustrative modeling assumption, not a forecast. No algorithm
                can guarantee future equity market trajectories.
              </div>
            </div>
          </section>

          {/* Section 2: How Investment Growth is Calculated */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. How Investment Growth Is Calculated</h2>
            <div className={styles.prose}>
              <p>
                Portfolio growth occurs through exponential compounding: earnings generated in previous periods generate
                their own subsequent returns. When regular contributions are added, future value combines a single lump-sum
                compounding formula with an ordinary annuity:
              </p>
              <div className={styles.formulaBox}>
                FV = PV × (1 + r/m)^(m×t) + PMT × [((1 + r/m)^(m×t) − 1) ÷ (r/m)]
              </div>
              <p>
                Where <strong>PV</strong> is initial principal, <strong>r</strong> is the nominal annual rate of return,{' '}
                <strong>m</strong> is the compounding frequency (12 for monthly), <strong>t</strong> is time in years, and{' '}
                <strong>PMT</strong> is the periodic contribution made at the end of each period.
              </p>
              <p>
                Consider an investor starting with $10,000 who contributes $300 every month for 20 years at an assumed 7.0%
                annual return compounded monthly (0.5833% per month):
              </p>
              <ul>
                <li>
                  <strong>Starting Lump Sum Growth:</strong> $10,000 × (1 + 0.07/12)^240 = $40,387.39
                </li>
                <li>
                  <strong>Future Value of $300/mo Deposits:</strong> $300 × [((1 + 0.07/12)^240 − 1) ÷ (0.07/12)] =
                  $156,278.00
                </li>
                <li>
                  <strong>Total Accumulated Portfolio:</strong> $40,387.39 + $156,278.00 = <strong>$196,665.39</strong>
                </li>
                <li>
                  <strong>Total Out-of-Pocket Contributed:</strong> $10,000 + (240 × $300) = $82,000.00
                </li>
                <li>
                  <strong>Net Investment Earnings (Growth):</strong> $196,665.39 − $82,000.00 = $114,665.39 (58.3% of the
                  entire balance consists of compounded earnings).
                </li>
              </ul>
              <p>
                To explore different compounding frequencies (daily, quarterly, or continuous), visit our dedicated{' '}
                <Link href="/compound-interest-calculator/">Compound Interest Calculator</Link>. Planning retirement distributions? See how long your portfolio will last with our{' '}
                <Link href="/how-long-will-my-money-last/">Retirement Drawdown Calculator</Link>.
              </p>
            </div>
          </section>

          {/* Section 3: Using an S&P 500-Style Return */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Using an S&amp;P 500-Style Return</h2>
            <div className={styles.prose}>
              <p>
                The S&amp;P 500 is an index of large US companies. This calculator does not include historical index data, so
                it doesn&apos;t quote past S&amp;P 500 averages. Instead you choose an <strong>assumed</strong> yearly return and
                see what it would mean for your money.
              </p>
              <p>
                Returns vary a lot from year to year, and a long-run average hides big ups and downs. A sensible way to use
                the tool is to try a cautious assumption first, then a higher one, and plan around the cautious result. Fees
                and inflation both reduce what you end up with, so set them too.
              </p>
              <p>
                To evaluate how lump sums discount back to present value at different required discount rates, utilize our{' '}
                <Link href="/present-value-calculator/">Present Value &amp; NPV Calculator</Link>.
              </p>
            </div>
          </section>

          {/* Section 4: Money Market Interest */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Money Market Interest: How to Calculate It</h2>
            <div className={styles.prose}>
              <p>
                Money market accounts (MMAs) and money market mutual funds (MMMFs) invest in short-term, high-credit debt
                instruments such as Treasury bills, commercial paper, and certificates of deposit. Unlike volatile equities,
                money market funds prioritize liquidity and principal stability while compounding monthly interest.
              </p>
              <p>
                Because money market yields are published as Annual Percentage Yields (APY), compounding is already
                embedded in the headline rate. To calculate month-by-month accrual:
              </p>
              <div className={styles.formulaBox}>
                Monthly Interest Rate = (1 + APY)^(1/12) − 1
              </div>
              <p>
                On a $25,000 cash balance placed at a 4.50% APY for 12 months with no additional deposits:
              </p>
              <ul>
                <li>
                  <strong>Effective Monthly Rate:</strong> (1 + 0.045)^(1/12) − 1 = 0.3675% per month
                </li>
                <li>
                  <strong>Month 1 Interest:</strong> $25,000 × 0.3675% = $91.87
                </li>
                <li>
                  <strong>Month 12 Ending Balance:</strong> $25,000 × 1.045 = <strong>$26,125.00</strong>
                </li>
                <li>
                  <strong>Total Annual Interest Earned:</strong> $1,125.00 in guaranteed yield.
                </li>
              </ul>
              <p>
                Money market accounts at FDIC-insured banks or NCUA-insured credit unions protect deposits up to $250,000 per
                depositor, per insurable ownership category.
              </p>
            </div>
          </section>

          {/* Section 5: T-Bill Calculator */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. T-Bill Calculator: Price and Yield Mechanics</h2>
            <div className={styles.prose}>
              <p>
                United States Treasury bills are short-term sovereign debt securities issued with maturities of 4, 8, 13, 17,
                26, or 52 weeks. Backed by the full faith and credit of the federal government, T-bills carry zero default
                risk and are exempt from all state and local income taxes.
              </p>
              <p>
                Treasury bills are sold at an original issue discount (OID) below their $1,000 par face value. Official
                TreasuryDirect auctions quote two distinct metrics:
              </p>
              <ul>
                <li>
                  <strong>Treasury Discount Rate (Bank Basis):</strong> Calculated using a simplified 360-day calendar year
                  based on par value:
                  <div className={styles.formulaBox}>
                    Discount Rate (%) = [(Par − Price) ÷ Par] × (360 ÷ Days to Maturity) × 100
                  </div>
                </li>
                <li>
                  <strong>Investment Yield (Coupon Equivalent Yield):</strong> Standardized using an actual 365-day year
                  based on the purchase price paid, allowing direct comparison with bonds and bank CDs:
                  <div className={styles.formulaBox}>
                    Investment Yield (%) = [(Par − Price) ÷ Price] × (365 ÷ Days to Maturity) × 100
                  </div>
                </li>
              </ul>
              <p>
                <strong>Worked Treasury Example:</strong> An investor purchases a 26-week ($10,000 face value) Treasury bill
                for $9,750 at auction with 182 days remaining until maturity:
              </p>
              <ul>
                <li>
                  <strong>Dollar Gain at Maturity:</strong> $10,000 − $9,750 = $250.00
                </li>
                <li>
                  <strong>Discount Rate:</strong> ($250 ÷ $10,000) × (360 ÷ 182) × 100 = <strong>4.945%</strong>
                </li>
                <li>
                  <strong>Investment Yield:</strong> ($250 ÷ $9,750) × (365 ÷ 182) × 100 = <strong>5.142%</strong>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6: Stocks vs Cash */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Stocks vs Cash: Comparing Growth and Volatility</h2>
            <div className={styles.prose}>
              <p>
                Choosing between equities and liquid cash is fundamentally a trade-off between purchasing power risk and
                volatility risk. Over short horizons (1 to 3 years), cash equivalents protect capital from market downturns.
                Over multi-decade horizons, however, holding excess cash exposes capital to purchasing power destruction:
              </p>
              <table className={styles.proseTable}>
                <thead>
                  <tr>
                    <th>Dimension</th>
                    <th>Equities (S&amp;P 500 Index Funds)</th>
                    <th>Cash / Money Market / T-Bills</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Expected Long-Term Return</strong></td>
                    <td>Higher (Historical 7%–10% nominal)</td>
                    <td>Lower (Tracks short-term Fed policy, ~3%–5%)</td>
                  </tr>
                  <tr>
                    <td><strong>Short-Term Volatility</strong></td>
                    <td>High (Frequent annual fluctuations of ±20%)</td>
                    <td>Negligible (Stable $1.00 net asset value)</td>
                  </tr>
                  <tr>
                    <td><strong>Inflation Protection</strong></td>
                    <td>Strong (Corporate earnings &amp; dividends adjust to pricing)</td>
                    <td>Weak (Fails to compound above inflation over decades)</td>
                  </tr>
                  <tr>
                    <td><strong>Tax Treatment</strong></td>
                    <td>Preferential long-term capital gains &amp; qualified dividends</td>
                    <td>Ordinary income rates (T-bills exempt from state/local)</td>
                  </tr>
                  <tr>
                    <td><strong>Optimal Time Horizon</strong></td>
                    <td>5+ to 30+ Years</td>
                    <td>Emergency funds, short-term savings (&lt; 3 Years)</td>
                  </tr>
                </tbody>
              </table>
              <p>
                For complete household wealth balance sheet modeling, see our{' '}
                <Link href="/net-worth-calculator/">Net Worth Calculator</Link>.
              </p>
            </div>
          </section>

          {/* Section 7: Fees and Inflation */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Fees and Inflation: The Real Cost of Drag</h2>
            <div className={styles.prose}>
              <p>
                Two silent friction factors systematically reduce nominal portfolio returns: investment expense ratios and
                macroeconomic inflation.
              </p>
              <p>
                <strong>The Cost of Expense Ratios:</strong> Broad-market index ETFs charge as little as 0.03% annually
                ($3 per $10,000 invested). In contrast, actively managed mutual funds and advisory wraps commonly charge
                0.75% to 1.50%. On a 25-year investment accumulating $500 monthly, an extra 0.75% in fees surrenders over
                $116,400 in compound growth directly to financial intermediaries.
              </p>
              <p>
                <strong>Inflation Discounting:</strong> Consumer price inflation diminishes what each dollar can purchase.
                At a 2.5% inflation rate, $196,665 in 20 years purchases what $120,019 purchases today. Always evaluate
                future retirement goals in constant purchasing power.
              </p>
            </div>
          </section>

          {/* Section 8: Lump Sum vs Monthly DCA */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Lump Sum vs. Monthly Investing: Dollar-Cost Averaging</h2>
            <div className={styles.prose}>
              <p>
                When deploying capital, investors face the decision of whether to invest a lump sum immediately or dollar-cost
                average (DCA) over 6 to 12 monthly installments:
              </p>
              <ul>
                <li>
                  <strong>Mathematical Advantage of Lump Sum:</strong> Vanguard empirical studies demonstrate that lump-sum
                  investing outperforms DCA approximately 68% of the time across global stock markets because equities
                  trend upward over time, maximizing compounding duration.
                </li>
                <li>
                  <strong>Psychological Advantage of DCA:</strong> DCA minimizes downside regret if the market experiences
                  a sharp correction immediately after investing. For wage earners, ongoing monthly contributions automate
                  wealth accumulation by buying more shares during market dips and fewer shares at market peaks.
                </li>
              </ul>
              <p>
                If borrowing against existing property equity to fund capital investments, review borrowing limits and
                payment shock hazards using our <Link href="/heloc-calculator/">HELOC Loan Calculator</Link>.
              </p>
            </div>
          </section>

          {/* Section 9: How We Calculate Component */}
          <section className={styles.section}>
            <HowWeCalculate slug="investment-return-calculator" />
          </section>

          {/* Section 10: Frequently Asked Questions */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Frequently Asked Questions</h2>
            <Faq items={FAQS} withSchema={false} />
          </section>

          {/* Section 11: Regulatory Disclosures & Last Reviewed */}
          <div className={styles.disclaimerNotice}>
            <p>
              <strong>Regulatory &amp; Editorial Disclosures:</strong> This tool is published for educational and financial
              modeling purposes only and does not constitute financial, investment, legal, or tax advice. Market projections
              rely on user-supplied variables and standard compound interest mathematics. Past market performance is no
              guarantee of future returns. KKCTools does not sell investment securities, broker accounts, or receive affiliate
              commissions from lenders or fund managers.
            </p>
            <p>
              <strong>Last Reviewed &amp; Verified:</strong> November 2026. Formulas aligned with Federal Reserve Economic Data
              (FRED), U.S. Department of the Treasury (TreasuryDirect) debt auction circulars, and FINRA investor education standards.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
