import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import ToolShell from '@/components/tool/shared/ToolShell';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import CagrCalculator from '@/components/tool/cagr-calculator';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import AdSlot from '@/components/ads/AdSlot';
import { ROUTES } from '@/lib/routes';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.cagrCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const FAQ_ITEMS = [
  {
    q: 'What is the CAGR formula?',
    a: 'The compound annual growth rate (CAGR) formula is: CAGR = (Ending Value ÷ Starting Value)^(1 ÷ Years) − 1. It calculates the constant annual rate of return that would take an investment or revenue figure from its beginning balance to its ending balance over a specified number of years.',
  },
  {
    q: 'How do you calculate CAGR in Excel or Google Sheets?',
    a: 'In Excel or Google Sheets, calculate CAGR using direct power math: =(Ending_Cell / Starting_Cell)^(1 / Years_Cell) - 1. Alternatively, use the built-in function =RRI(Years, Starting_Value, Ending_Value) or the financial rate function =RATE(Years, 0, -Starting_Value, Ending_Value).',
  },
  {
    q: 'CAGR vs average annual growth rate: what is the difference?',
    a: 'Average annual growth is the simple arithmetic mean of individual annual percentage changes, while CAGR is the geometric mean. Arithmetic averages routinely overstate growth because they ignore the compounding loss of drawdowns. For example, a sequence of −50%, +30%, and +20% has an arithmetic average of 0.0%, but the actual CAGR is −7.95% because 100 drops to 50, then recovers to 65, and finishes at 78.',
  },
  {
    q: 'What is the Rule of 72, and how accurate is it?',
    a: 'The Rule of 72 is a quick mental-math approximation to estimate doubling time: Years to Double ≈ 72 ÷ Annual Growth Rate (%). For instance, at 8% annual growth, 72 ÷ 8 = 9.00 years. The mathematically exact doubling time is ln(2) ÷ ln(1 + 0.08) = 9.01 years, meaning the Rule of 72 is accurate to within 0.01 years for rates near 8%.',
  },
  {
    q: 'What is considered a good CAGR?',
    a: 'A "good" CAGR depends entirely on the asset class, macroeconomic inflation, risk level, and time horizon. Broad market equity indices, venture portfolios, commercial real estate, and government treasury bonds each carry distinct historical returns and risk profiles. CAGR measures the geometric return achieved, but does not measure the risk or volatility taken to achieve it.',
  },
  {
    q: 'How do I calculate CAGR for months or fractional days?',
    a: 'To calculate CAGR for fractional periods, convert the duration into fractional years. If an asset grew over 18 months, use Years = 18 ÷ 12 = 1.5. If measuring between calendar dates, divide the elapsed calendar days by 365.25: Years = Elapsed Days ÷ 365.25. The CAGR formula remains unchanged: (End ÷ Start)^(1 ÷ Years) − 1.',
  },
  {
    q: 'How do I find the ending value from a known CAGR?',
    a: 'To project future value using CAGR, rearrange the equation: Ending Value = Starting Value × (1 + CAGR)^Years. For example, $10,000 growing at an 8% CAGR over 5 years yields 10,000 × (1.08)^5 = $14,693.28.',
  },
  {
    q: 'Does CAGR account for interim dividends or cash distributions?',
    a: 'Standard CAGR calculations only compare the starting balance to the final balance. If dividends or cash flows are paid out and reinvested back into the asset, they should be included in the ending value. If dividends are withdrawn and spent elsewhere, CAGR will understate the total return of the position.',
  },
  {
    q: 'Can CAGR be negative? What happens if the start value is negative?',
    a: 'Yes, CAGR is negative whenever the ending value is lower than the starting value, representing a compound rate of capital loss. However, CAGR cannot be computed if the starting value is zero or negative, because taking a fractional root of a negative ratio is mathematically undefined in real numbers.',
  },
  {
    q: 'CAGR vs IRR (Internal Rate of Return): when should I use each?',
    a: 'Use CAGR when evaluating a single lump-sum investment with no intermediate deposits or withdrawals. Use IRR (or XIRR for irregular dates) whenever there are multiple cash inflows, ongoing monthly dollar-cost averaging, dividend disbursements, or partial capital liquidations during the investment lifecycle.',
  },
  {
    q: 'What is the exact doubling time formula?',
    a: 'The mathematically exact formula for doubling time is: Doubling Time = ln(2) ÷ ln(1 + r), where ln is the natural logarithm and r is the annual growth rate as a decimal (e.g. 0.07 for 7%). For example, at 7%, ln(2) ÷ ln(1.07) = 0.69315 ÷ 0.06766 = 10.24 years.',
  },
  {
    q: 'What is the compound growth formula?',
    a: 'The general compound growth formula is A = P × (1 + r ÷ n)^(n × t), where A is final amount, P is initial principal, r is nominal annual interest rate, n is compounding frequency per year, and t is time in years. In CAGR, annual compounding is assumed (n = 1), simplifying to A = P × (1 + CAGR)^t.',
  },
];

export default function CagrCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'CAGR Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: ROUTES.cagrCalculator.description,
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'Tools', path: '/tools/' },
            { name: 'Math & Finance', path: '/tools/#math' },
            { name: 'CAGR Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>CAGR Calculator: Compound Annual Growth Rate, Formula and Rule of 72</h1>
          <p className={styles.subtitle}>
            Calculate compound annual growth rate (CAGR), ending value, years, or doubling time with the Rule of 72.
          </p>

          <div className={styles.bluf}>
            <strong>Bottom Line Up Front (BLUF):</strong> The compound annual growth rate (CAGR) formula is CAGR = (Ending Value ÷ Starting Value)^(1 ÷ Years) − 1. Growing from 10,000 to 20,000 in 5 years is a compound annual growth rate of 14.87%. In Excel or Google Sheets, calculate this directly using =(20000/10000)^(1/5)-1 or the built-in function =RRI(5, 10000, 20000).
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Solve CAGR, value or years',
              'Series vs average growth',
              'Excel & Sheets formulas',
              'Rule of 72 check',
            ]}
          >
            <CagrCalculator />
          </ToolShell>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className={styles.contentSection}>
        <div className={styles.prose}>
          <h2>CAGR Formula</h2>
          <p>
            The <strong>Compound Annual Growth Rate (CAGR) formula</strong> is the standard geometric metric used by investors, financial analysts, and corporate strategists to measure smoothed annualized growth over multiple time periods. Because investment returns vary from year to year, CAGR determines the steady equivalent rate at which an initial capital base would have grown had it compounded at a constant rate every single year.
          </p>

          <div className={styles.formulaBox}>
            CAGR = (Ending Value ÷ Starting Value)^(1 ÷ Years) − 1
          </div>

          <p>Where:</p>
          <ul>
            <li><strong>Starting Value (Beginning Value):</strong> The initial investment, capital balance, or company revenue at the start of the measured timeframe.</li>
            <li><strong>Ending Value (Final Value):</strong> The net portfolio balance, asset valuation, or revenue at the conclusion of the timeframe.</li>
            <li><strong>Years (Duration):</strong> The total time elapsed in years, which can be an integer or fractional decimal (e.g. 3.5 years for 42 months).</li>
          </ul>

          <h2>How to Use the CAGR Calculator</h2>
          <p>
            This calculator provides three versatile modes to evaluate financial and business trajectory:
          </p>
          <ol>
            <li><strong>CAGR Solver:</strong> Solves for any one of the four core variables: compound annual growth rate, required ending value, necessary starting capital, or the number of years needed to reach your financial target. You can input duration as direct years or exact calendar dates, select your preferred currency symbol, and include an optional inflation rate to calculate real purchasing-power growth.</li>
            <li><strong>Series Mode:</strong> Paste a sequence of historical annual values (e.g., <code>100, 50, 65, 78</code>) to compare the true geometric CAGR against the misleading simple arithmetic average, displaying the exact percentage gain or drawdown for each transition.</li>
            <li><strong>Doubling Time &amp; Rule of 72:</strong> Enter any growth rate percentage to compare the exact logarithmic doubling period against classic financial heuristics like the Rule of 72, Rule of 70, and Rule of 69.3.</li>
          </ol>

          <AdSlot slotId="cagr-calc-ad-mid" format="horizontal" />

          <h2>CAGR Calculation Step by Step</h2>
          <p>
            To understand how compound annual growth rate works, consider a concrete worked example: an investment grows from a starting balance of <strong>$10,000</strong> to an ending balance of <strong>$20,000</strong> over a <strong>5-year</strong> holding period.
          </p>
          <ol>
            <li><strong>Divide the ending value by the starting value:</strong><br />
              Ratio = $20,000 ÷ $10,000 = 2.0 (representing a 100% total gain or a 2× multiple on invested capital).
            </li>
            <li><strong>Calculate the exponent (1 ÷ Years):</strong><br />
              Exponent = 1 ÷ 5 = 0.20.
            </li>
            <li><strong>Raise the ratio to the power of the exponent:</strong><br />
              (2.0)^0.20 = 1.148698...
            </li>
            <li><strong>Subtract 1 to convert the multiplier into a rate:</strong><br />
              1.148698 − 1 = 0.148698, or <strong>14.87% per year</strong>.
            </li>
          </ol>
          <p>
            If you start with $10,000 and it compounds at exactly 14.87% each year, your balance at Year 1 is $11,487, at Year 2 is $13,195, at Year 3 is $15,157, at Year 4 is $17,411, and at Year 5 reaches $20,000.
          </p>

          <h2>How to Calculate CAGR in Excel and Google Sheets</h2>
          <p>
            Spreadsheets offer multiple methods to calculate CAGR. The most common error in Excel tutorials is attempting to use the <code>FV</code> or <code>PV</code> functions incorrectly by misconfiguring signs or cash flow periods.
          </p>
          <ul>
            <li><strong>Direct Mathematical Formula:</strong> If your starting value is in cell <code>A2</code>, ending value in cell <code>B2</code>, and duration in years in cell <code>C2</code>, enter:<br />
              <code>=(B2/A2)^(1/C2) - 1</code>
            </li>
            <li><strong>The RRI Function:</strong> Modern versions of Microsoft Excel and Google Sheets feature the dedicated <code>RRI</code> function, designed specifically to return the equivalent interest rate for the growth of an investment:<br />
              <code>=RRI(C2, A2, B2)</code> (Syntax: <code>RRI(nper, pv, fv)</code>).
            </li>
            <li><strong>The RATE Function:</strong> You can also use the financial <code>RATE</code> function. Note that Excel requires the present value (initial investment) to be entered as a negative cash outflow:<br />
              <code>=RATE(C2, 0, -A2, B2)</code>
            </li>
            <li><strong>Exact Dates with YEARFRAC:</strong> If you have calendar dates in cells <code>D2</code> (start date) and <code>E2</code> (end date), use <code>YEARFRAC</code> to calculate exact fractional years:<br />
              <code>=(B2/A2)^(1/YEARFRAC(D2, E2)) - 1</code>
            </li>
          </ul>

          <h2>CAGR vs Average Annual Growth Rate</h2>
          <p>
            A common trap in marketing materials and portfolio presentations is conflating the <strong>simple arithmetic average annual return</strong> with the <strong>compound annual growth rate (CAGR)</strong>. Arithmetic averages do not account for the asymmetry of losses and gains.
          </p>
          <p>
            Consider a portfolio that starts at $100 and experiences three consecutive annual returns:
          </p>
          <ul>
            <li><strong>Year 1:</strong> −50% drawdown (balance falls from $100 to $50).</li>
            <li><strong>Year 2:</strong> +30% recovery (balance grows from $50 to $65).</li>
            <li><strong>Year 3:</strong> +20% gain (balance grows from $65 to $78).</li>
          </ul>
          <p>
            Calculating the arithmetic average of these three returns gives:
            <br />
            <code>(−50% + 30% + 20%) ÷ 3 = 0% ÷ 3 = 0.00%</code>.
          </p>
          <p>
            An arithmetic average suggests that the investor broke even. In reality, the initial $100 shrank to $78, a net capital loss of 22%. The true annualized rate of return is the geometric CAGR:
            <br />
            <code>(78 ÷ 100)^(1 ÷ 3) − 1 = (0.78)^(0.3333) − 1 = −7.95% per year</code>.
            <br />
            CAGR reflects real wallet performance, whereas arithmetic averages disguise volatility and drawdown damage.
          </p>

          <h2>Rule of 72 vs Exact Doubling Time</h2>
          <p>
            The <strong>Rule of 72</strong> is an intuitive mental-math shortcut used to determine how many years it will take for an investment to double at a given compound annual interest rate:
          </p>
          <div className={styles.formulaBox}>
            Doubling Time (Years) ≈ 72 ÷ Growth Rate (%)
          </div>
          <p>
            The mathematically rigorous doubling time equation derived from compound growth is:
          </p>
          <div className={styles.formulaBox}>
            Exact Doubling Time = ln(2) ÷ ln(1 + r)
          </div>
          <p>
            Because <code>ln(2) ≈ 0.693147</code>, the exact numerator for continuous compounding is 69.3. However, for annual compounding at realistic interest rates between 6% and 10%, 72 provides a remarkably accurate approximation that easily divides by 2, 3, 4, 6, 8, 9, and 12:
          </p>

          <div className={styles.tableWrapper}>
            <table className={styles.contentTable}>
              <thead>
                <tr>
                  <th>Annual Growth Rate</th>
                  <th>Exact Doubling Time</th>
                  <th>Rule of 72 Estimate</th>
                  <th>Rule of 70 Estimate</th>
                  <th>Accuracy Error</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>4.0%</td>
                  <td>17.67 years</td>
                  <td>18.00 years</td>
                  <td>17.50 years</td>
                  <td>+0.33 yrs</td>
                </tr>
                <tr>
                  <td>6.0%</td>
                  <td>11.90 years</td>
                  <td>12.00 years</td>
                  <td>11.67 years</td>
                  <td>+0.10 yrs</td>
                </tr>
                <tr>
                  <td>8.0%</td>
                  <td>9.01 years</td>
                  <td>9.00 years</td>
                  <td>8.75 years</td>
                  <td>−0.01 yrs</td>
                </tr>
                <tr>
                  <td>10.0%</td>
                  <td>7.27 years</td>
                  <td>7.20 years</td>
                  <td>7.00 years</td>
                  <td>−0.07 yrs</td>
                </tr>
                <tr>
                  <td>12.0%</td>
                  <td>6.12 years</td>
                  <td>6.00 years</td>
                  <td>5.83 years</td>
                  <td>−0.12 yrs</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>CAGR for Months, Days or Exact Calendar Dates</h2>
          <p>
            Investments rarely begin on January 1st and liquidate exactly on December 31st. When calculating CAGR across irregular calendar dates, compute the fractional years using exact elapsed calendar days:
          </p>
          <div className={styles.formulaBox}>
            Fractional Years = Elapsed Calendar Days ÷ 365.25
          </div>
          <p>
            Using 365.25 days accounts for leap years over multi-year holding periods. For example, if an investment of $50,000 made on March 15, 2021 grew to $75,000 by September 15, 2024 (1,280 days), the duration is <code>1,280 ÷ 365.25 = 3.504 years</code>. The annualized CAGR is <code>(75,000 ÷ 50,000)^(1 ÷ 3.504) − 1 = 12.24%</code>.
          </p>

          <h2>Real CAGR: Adjusting for Inflation</h2>
          <p>
            Nominal CAGR reflects the dollar growth of your portfolio, but inflation erodes the actual purchasing power of those returns. To find the real purchasing-power growth rate, apply the <strong>Fisher Equation</strong>:
          </p>
          <div className={styles.formulaBox}>
            Real CAGR = (1 + Nominal CAGR) ÷ (1 + Annual Inflation Rate) − 1
          </div>
          <p>
            For example, if an asset achieves an 8.0% nominal CAGR during a period where inflation averages 3.0% annually, the real compound growth rate is:
            <br />
            <code>(1 + 0.08) ÷ (1 + 0.03) − 1 = 1.08 ÷ 1.03 − 1 = 4.85%</code> per year.
          </p>

          <h2>When CAGR Misleads: Volatility and Ongoing Contributions</h2>
          <p>
            While CAGR is an indispensable benchmark, it has specific structural limitations:
          </p>
          <ul>
            <li><strong>Insensitivity to Volatility:</strong> CAGR only looks at the initial and terminal values. An investment that grew steadily by 10% each year has the exact same CAGR as an extremely volatile asset that experienced violent 50% drawdowns and wild surges before arriving at the same final balance. To measure path risk, evaluate metrics like maximum drawdown or the Sharpe ratio alongside CAGR.</li>
            <li><strong>Interim Cash Inflows and Outflows:</strong> CAGR assumes zero capital additions or withdrawals between the start date and the end date. If you make regular monthly contributions (dollar-cost averaging) or withdraw profits along the way, CAGR will give an inaccurate picture of your actual money-weighted returns. In such cases, use <strong>Internal Rate of Return (IRR)</strong> or <strong>XIRR</strong>.</li>
            <li><strong>Dependency on Endpoints:</strong> Shifting the end date by just a few months (for example, ending during a temporary market panic vs. a peak) can dramatically skew the calculated CAGR, an effect known as endpoint sensitivity.</li>
          </ul>

          <p>
            To compare CAGR with compound interest with regular contributions, use our <Link href="/compound-interest-calculator/">Compound Interest Calculator</Link>, evaluate total percentage growth with our <Link href="/percentage-change-calculator/">Percentage Change Calculator</Link>, discount future cash flows using our <Link href="/present-value-calculator/">Present Value Calculator</Link>, or measure an investment&apos;s total and annualized return with the <Link href="/investment-return-calculator/">Investment Return Calculator</Link>.
          </p>

          <h2>Frequently Asked Questions</h2>
          {FAQ_ITEMS.map((item, idx) => (
            <div key={idx} className={styles.faqItem}>
              <div className={styles.faqQuestion}>{item.q}</div>
              <div className={styles.faqAnswer}>
                <p>{item.a}</p>
              </div>
            </div>
          ))}

          <HowWeCalculate slug="cagr-calculator" />
          <AdSlot slotId="cagr-calc-ad-bottom" format="horizontal" />
        </div>
      </div>
    </div>
  </main>
);
}
