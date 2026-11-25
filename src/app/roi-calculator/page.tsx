import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import Link from 'next/link';
import ToolShell from '@/components/tool/shared/ToolShell';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { RoiCalculator } from '@/components/tool/roi-calculator';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import AdSlot from '@/components/ads/AdSlot';
import { ROUTES } from '@/lib/routes';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.roiCalculator ?? {
  path: '/roi-calculator/',
  title: 'ROI Calculator – Return on Investment & Annualized',
  description:
    'Free ROI calculator. Enter what you invested and what you got back to see ROI, net profit and annualized ROI over any period, with the formula shown.',
};

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const FAQ_ITEMS = [
  {
    q: 'How do you calculate ROI?',
    a: 'Return on Investment (ROI) is calculated as Net Profit divided by Initial Cost: ROI (%) = [(Final Value + Income − Expenses − Initial Cost) ÷ Initial Cost] × 100. For instance, investing $10,000 and returning $15,000 generates a 50% ROI.',
  },
  {
    q: 'What does ROI mean?',
    a: 'ROI (Return on Investment) is a performance metric used to evaluate the efficiency and profitability of an investment relative to its cost. It expresses net capital gain or loss as a percentage of the original capital expended.',
  },
  {
    q: 'What is annualized ROI, and why does it matter?',
    a: 'Annualized ROI translates cumulative multi-year returns into an equivalent compound annual rate: Annualized ROI = [(1 + Total ROI)^(1 ÷ Years)] − 1. It enables direct, fair comparisons between assets held for differing time horizons.',
  },
  {
    q: 'What is the difference between ROI, rate of return, and CAGR?',
    a: 'ROI (return on investment) measures cumulative percentage gain or loss over the entire holding period: (Ending − Starting) ÷ Starting. Rate of return often refers to an annualized or periodic return. CAGR (compound annual growth rate) is the geometric mean annual return assuming profits are reinvested each year: (Ending ÷ Starting)^(1/n) − 1. For example, a 50% cumulative ROI over 3 years corresponds to an annualized rate of return (CAGR) of 14.47% per year.',
  },
  {
    q: 'What is considered a positive or acceptable ROI?',
    a: 'Mathematically, any positive ROI (> 0%) means the investment returned more than its cost. In financial planning, an acceptable return is evaluated against an investor’s opportunity cost or benchmark hurdle rate—such as the risk-free rate on government bonds or broad market equity indices—adjusted for inflation and risk tolerance.',
  },
  {
    q: 'How do I calculate marketing ROI?',
    a: 'True marketing ROI accounts for gross product margin: Marketing ROI = [(Attributed Revenue × Gross Margin % − Ad Spend) ÷ Ad Spend] × 100. Comparing revenue directly to ad spend yields ROAS (Return on Ad Spend), which overstates profitability if product costs are ignored.',
  },
  {
    q: 'How do I compare investments held for different lengths of time?',
    a: 'To compare investments held for different lengths of time, compare their annualized ROI. For example, a 50% cumulative return achieved over 3 years equals 14.47% per year, which significantly outperforms a 60% cumulative return achieved over 5 years (9.86% per year).',
  },
  {
    q: 'Can ROI be negative?',
    a: 'Yes. If the final value plus distributions is less than the initial investment, the net gain is negative, producing a negative ROI. For example, losing $2,000 on a $10,000 investment equals a −20% ROI.',
  },
  {
    q: 'What does simple ROI leave out?',
    a: 'Simple ROI does not account for the time value of money, the timing of intermediate cash distributions, reinvestment risk, volatility, or inflation. For complex multi-period cash flows, use Net Present Value (NPV) or Internal Rate of Return (IRR).',
  },
  {
    q: 'How do I calculate ROI on capital equipment or software?',
    a: 'Equipment ROI equals [(Total Annual Operating Savings × Useful Lifespan − Equipment Cost) ÷ Equipment Cost] × 100. The simple payback period is Equipment Cost ÷ Annual Savings.',
  },
];

export default function RoiPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'ROI Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: route.description,
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
            { name: 'ROI Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>
            ROI Calculator: Return on Investment and Annualized ROI
          </h1>
          <p className={styles.subtitle}>
            Compute cumulative ROI, compound annualized rate of return, marketing ROI on gross margin,
            and equipment payback period. Compare up to four investment options side-by-side.
          </p>

          <div className={styles.bluf}>
            ROI = (what you got back − what you put in) ÷ what you put in.
            Turning $10,000 into $15,000 is a 50% return on investment; over 3 years that is 14.47% a year
            annualized. Compare up to four options, evaluate marketing campaigns by gross margin profit, or
            calculate equipment payback.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'ROI & annualized ROI',
              'Compare up to 4 options',
              'Marketing ROI & ROAS',
              'Payback period',
            ]}
          >
            <RoiCalculator />
          </ToolShell>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <HowWeCalculate slug="roi-calculator" />

        <div className={styles.contentSection}>
          <article className={styles.prose}>
            <h2>How to Use the ROI Calculator</h2>
            <p>
              This calculator provides multiple specialized evaluation modes for personal investments,
              corporate capital projects, and marketing campaigns:
            </p>
            <ol>
              <li>
                <strong>ROI & Annualized:</strong> Enter the initial amount invested, ending proceeds, and
                duration in years. Include dividends, rental income, or holding fees to compute net profit,
                cumulative ROI, and compound annualized return.
              </li>
              <li>
                <strong>Compare Options:</strong> Enter up to four opportunities with differing holding
                periods. The tool automatically ranks them by annualized rate and flags duration discrepancies.
              </li>
              <li>
                <strong>Marketing ROI & ROAS:</strong> Compare top-line attributed sales against ad spend
                and product gross margin to separate gross return on ad spend (ROAS) from true profit ROI.
              </li>
              <li>
                <strong>Project & Equipment ROI:</strong> Determine payback period and cumulative operational
                yield for capital asset investments.
              </li>
              <li>
                <strong>Target ROI Solver:</strong> Enter your cost basis and desired hurdle rate to determine
                the liquidation value required at exit.
              </li>
            </ol>

            <h2>What Does ROI Mean?</h2>
            <p>
              Return on Investment (ROI) is a standard financial metric that expresses the net gain or loss
              of an expenditure relative to its initial cost basis. By normalizing profit as a percentage of
              capital invested, ROI allows analysts and individuals to compare investments of completely
              different sizes.
            </p>
            <p>
              Whether purchasing publicly traded shares, acquiring real estate, launching a digital advertising
              campaign, or installing energy-efficient factory machinery, ROI provides an intuitive measure of
              capital efficiency.
            </p>

            <h2>How to Calculate ROI Step by Step</h2>
            <p>
              The basic formula for return on investment is:
            </p>
            <p style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 700, margin: '20px 0' }}>
              ROI = [(Final Value + Income − Expenses − Cost) ÷ Cost] × 100
            </p>
            <p>
              Where:
            </p>
            <ul>
              <li><strong>Cost:</strong> Total initial capital invested, purchase price, or cost basis.</li>
              <li><strong>Final Value:</strong> Proceeds from asset sale, liquidation, or current portfolio valuation.</li>
              <li><strong>Income:</strong> Intermediate cash distributions (dividends, bond coupons, gross rents).</li>
              <li><strong>Expenses:</strong> Advisory fees, maintenance, property taxes, or transaction commissions.</li>
            </ul>
            <p>
              <strong>Step-by-Step Worked Example:</strong>
            </p>
            <ol>
              <li>An investor purchases shares for an initial cost of <strong>$10,000</strong>.</li>
              <li>Three years later, the shares are sold for <strong>$15,000</strong>.</li>
              <li>Calculate Net Gain: <code>$15,000 − $10,000 = $5,000</code>.</li>
              <li>Divide Net Gain by Cost: <code>$5,000 ÷ $10,000 = 0.50</code>.</li>
              <li>Multiply by 100: <strong>50.00% Total ROI</strong>.</li>
            </ol>

            <h2>Annualized ROI: Comparing Different Holding Periods</h2>
            <p>
              A fundamental limitation of simple cumulative ROI is that it ignores time. A 50% return earned
              over 12 months represents extraordinary performance, whereas a 50% return earned over 20 years
              represents an annualized return of roughly 2.05%.
            </p>
            <p>
              To normalize returns across varying horizons, annualized ROI calculates the compound annual growth rate (CAGR):
            </p>
            <p style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 600 }}>
              Annualized ROI = [(Final Value ÷ Cost)^(1 ÷ Years)] − 1
            </p>
            <p>
              Applying this formula to our $10,000 investment that grew to $15,000 over 3 years:
            </p>
            <p style={{ fontFamily: 'monospace', padding: '10px 14px', background: 'var(--surface-subtle)', borderRadius: '6px' }}>
              Annualized ROI = ($15,000 ÷ $10,000)^(1 ÷ 3) − 1
              <br />
              = (1.50)^(0.3333) − 1 = 1.1447 − 1 = <strong>14.47% per year</strong>
            </p>

            <h2>ROI vs. Rate of Return vs. CAGR vs. IRR</h2>
            <div className={styles.tableWrap}>
              <table className={styles.contentTable}>
                <caption>Comparison of Simple ROI, Annualized ROI (CAGR), and IRR</caption>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Core Focus</th>
                    <th>Time Factor</th>
                    <th>Multi-Period Cash Flows</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Simple ROI</strong></td>
                    <td>Total percentage capital gain</td>
                    <td>Ignored</td>
                    <td>Total net gain only</td>
                  </tr>
                  <tr>
                    <td><strong>Annualized ROI (CAGR)</strong></td>
                    <td>Smoothed annual compound rate</td>
                    <td>Annualized</td>
                    <td>Assumes single lump sum exit</td>
                  </tr>
                  <tr>
                    <td><strong>Internal Rate of Return (IRR)</strong></td>
                    <td>Discount rate where NPV = 0</td>
                    <td>Exact cash flow dates</td>
                    <td>Fully handles irregular inflows & outflows</td>
                  </tr>
                  <tr>
                    <td><strong>Rate of Return (RoR)</strong></td>
                    <td>Broad umbrella term for net gains</td>
                    <td>Context dependent</td>
                    <td>May be nominal, annualized, or money-weighted</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>Marketing ROI and ROAS</h2>
            <p>
              In digital marketing and e-commerce, teams frequently conflate ROAS (Return on Ad Spend) with ROI:
            </p>
            <ul>
              <li>
                <strong>ROAS = Revenue ÷ Ad Spend:</strong> If $5,000 in advertising generates $20,000 in
                gross sales, ROAS is <code>$20,000 ÷ $5,000 = 4.0x</code> (or 300% top-line revenue ROI).
              </li>
              <li>
                <strong>ROI on Gross Margin:</strong> A business must cover the cost of goods sold (COGS). If
                the product carries a 40% gross margin, $20,000 in sales yields $8,000 in gross profit. True
                marketing net profit is <code>$8,000 − $5,000 = $3,000</code>, producing a true marketing ROI of{' '}
                <strong>60.00%</strong>.
              </li>
            </ul>

            <h2>Equipment and Project ROI with Payback</h2>
            <p>
              Capital budgeting decisions for enterprise tooling, solar arrays, or machinery focus on cost reduction:
            </p>
            <ul>
              <li>
                <strong>Initial Cost:</strong> $12,000 machine installation.
              </li>
              <li>
                <strong>Annual Benefit:</strong> $4,000 in recurring annual labor savings.
              </li>
              <li>
                <strong>Payback Period:</strong> <code>$12,000 ÷ $4,000 = 3.0 years</code> to break even.
              </li>
              <li>
                <strong>5-Year Cumulative ROI:</strong> Total savings over 5 years = $20,000. Net profit =
                $8,000. Five-year ROI = <code>($8,000 ÷ $12,000) × 100 = 66.67%</code>.
              </li>
            </ul>

            <h2>Real ROI After Inflation</h2>
            <p>
              Purchasing power erodes when inflation rates rise. To determine real purchasing power growth,
              apply the exact Fisher equation:
            </p>
            <p style={{ textAlign: 'center', fontSize: '1.15rem', fontWeight: 600 }}>
              Real ROI = [(1 + Nominal Annualized ROI) ÷ (1 + Annual Inflation)] − 1
            </p>
            <p>
              For example, our 14.47% nominal annualized return in an economy experiencing 3.0% annual inflation
              delivers a real purchasing power return of:
            </p>
            <p style={{ fontFamily: 'monospace', padding: '10px 14px', background: 'var(--surface-subtle)', borderRadius: '6px' }}>
              Real ROI = (1.1447 ÷ 1.0300) − 1 = 1.11136 − 1 = <strong>11.14% real return</strong>
            </p>

            <h2>What ROI Doesn&apos;t Tell You</h2>
            <p>
              While ROI is a versatile screening tool, comprehensive financial analysis requires assessing
              risk and capital structures:
            </p>
            <ul>
              <li>
                <strong>Risk & Volatility:</strong> A 20% return on an uncollateralized seed-stage loan carries
                vastly higher default risk than a 5% yield on sovereign debt.
              </li>
              <li>
                <strong>Multiple Cash Flows:</strong> When capital is drawn down or distributed unevenly across
                several years, simple ROI produces distortions. Model these scenarios using our{' '}
                <Link href="/present-value-calculator/" style={{ color: 'var(--cat-math)', fontWeight: 600 }}>
                  Present Value & NPV Calculator
                </Link>.
              </li>
              <li>
                <strong>Reinvestment Assumptions:</strong> Annualized ROI assumes interim proceeds can be
                reinvested at the identical rate of return, which may not hold in shifting interest rate environments.
              </li>
            </ul>

            <section className={styles.faqSection}>
              <h2>Frequently Asked Questions</h2>
              {FAQ_ITEMS.map((item, index) => (
                <div key={index} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{item.q}</h3>
                  <div className={styles.faqAnswer}>
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </section>
          </article>
        </div>

        <AdSlot slotId="roi-calc-ad-bottom" format="horizontal" />
      </div>
    </main>
  );
}
