import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import ProfitMarginCalculator from '@/components/tool/profit-margin-calculator';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  calculateGrossMargin,
  calculatePnL,
  priceForTargetMargin,
} from '@/lib/margin-engine';
import { formatCurrency, formatPercent } from '@/lib/pricing-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.profitMarginCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

// Dynamic engine computations for factual accuracy
const exGrossStandard = calculateGrossMargin({ revenue: 100, cogs: 60 });
const exGrossWholesale = calculateGrossMargin({ revenue: 25000, cogs: 18750 });

const exPnlFull = calculatePnL({
  grossSales: 100000,
  returnsAndAllowances: 0,
  cogs: 60000,
  operatingExpenses: 20000,
  depreciationAmortization: 0,
  interest: 3000,
  taxes: 3500,
});

const exTarget40 = priceForTargetMargin(60, 40);

const faqs = [
  {
    q: 'How do you calculate profit margin?',
    a: `To calculate profit margin, divide your profit by your total revenue, and multiply by 100 to get a percentage. The formula is: Profit Margin (%) = (Profit ÷ Revenue) × 100. If a business earns $40 profit on $100 in sales, the profit margin is ($40 ÷ $100) × 100 = 40%. Depending on whether you deduct only direct product costs (COGS), operating expenses, or all taxes and interest, you obtain gross margin, operating margin, or net profit margin.`,
  },
  {
    q: 'What is the gross profit margin formula?',
    a: `The gross profit margin formula is: Gross Margin (%) = ((Revenue − Cost of Goods Sold) ÷ Revenue) × 100. For example, if you sell an item for $100 and the direct inventory cost was $60, your gross profit is $40, yielding a gross profit margin of ($40 ÷ $100) × 100 = 40%.`,
  },
  {
    q: 'What is the net profit margin formula?',
    a: `The net profit margin formula is: Net Margin (%) = (Net Income ÷ Total Revenue) × 100. Net income represents the bottom line after subtracting all expenses: COGS, operating overhead (rent, salaries, marketing), depreciation, interest, and income taxes. For a company with $100,000 revenue and $13,500 net income, the net profit margin is 13.5%.`,
  },
  {
    q: 'What is the operating profit margin formula?',
    a: `The operating profit margin formula is: Operating Margin (%) = (Operating Profit (EBIT) ÷ Revenue) × 100, where Operating Profit equals Gross Profit minus Operating Expenses (OPEX). It measures how efficiently a company manages day-to-day business operations before accounting for financing debt costs or corporate taxes.`,
  },
  {
    q: 'How do you determine gross margin from price and cost?',
    a: `To determine gross margin from selling price and unit cost, subtract the unit cost from the selling price to find dollar gross profit, and divide that profit by the selling price. For example, if unit price is $50 and unit cost is $30: ($50 − $30) ÷ $50 = $20 ÷ $50 = 0.40, or 40% gross margin.`,
  },
  {
    q: 'What is a good profit margin?',
    a: `What qualifies as a "good" profit margin depends entirely on your industry and capital structure. According to public dataset benchmarks compiled by NYU Stern School of Business (Damodaran, US Margins by Sector), grocery stores and food wholesalers operate on narrow 1.5% to 3.0% net margins due to rapid inventory turnover, while commercial software and SaaS enterprises frequently achieve 70%+ gross margins and 20%+ net margins. Across general US businesses, a 10% net profit margin is considered healthy, while 20% is excellent.`,
  },
  {
    q: "What's the difference between gross sales and net sales?",
    a: `Gross sales represents the total unadjusted revenue from all customer invoices before any deductions. Net sales represents actual realized revenue after subtracting customer product returns, damaged item allowances, and early payment discounts: Net Sales = Gross Sales − (Returns + Allowances + Discounts). Profit margins should always be calculated against net sales.`,
  },
  {
    q: 'Is profit margin the same as markup?',
    a: `No. Profit margin and markup use the exact same dollar profit, but different denominators. Margin calculates profit as a percentage of the selling price (Profit ÷ Revenue), whereas markup calculates profit as a percentage of cost (Profit ÷ Cost). Because cost is lower than selling price, markup percentage is always higher than profit margin for any profitable transaction. A 50% markup produces a 33.33% margin, while a 50% margin requires a 100% markup (keystone pricing).`,
  },
  {
    q: 'Can profit margin be negative?',
    a: `Yes. When total costs exceed sales revenue, gross profit or net income becomes negative, resulting in a negative profit margin. A negative margin indicates that the business is losing money on every sale. For instance, selling an item that costs $100 for $80 results in a -$20 loss, which is a -25% gross margin.`,
  },
  {
    q: 'How do I work out GP% in UK business accounting?',
    a: `In British commerce and retail, "GP" stands for Gross Profit, and "GP%" stands for Gross Profit Percentage (Gross Margin). To work out a GP%, subtract your cost of sales (excluding VAT) from your turnover (excluding VAT), divide the result by the turnover, and multiply by 100: GP% = ((Turnover − Cost) ÷ Turnover) × 100.`,
  },
  {
    q: 'How do I find the price for a 30%, 40%, or 50% target margin?',
    a: `To find the required selling price for a target margin, divide the cost by (1 minus the target margin expressed as a decimal): Selling Price = Cost ÷ (1 − (Target Margin % ÷ 100)). For an item costing $60: to achieve a 30% margin, price at $60 ÷ 0.70 = $85.71; for a 40% margin, price at $60 ÷ 0.60 = $100.00; for a 50% margin, price at $60 ÷ 0.50 = $120.00.`,
  },
];

export default function ProfitMarginCalculatorPage() {
  const breadcrumbItems = [
    { name: 'Home', path: ROUTES.home.path },
    { name: 'Tools', path: ROUTES.tools.path },
    { name: 'Profit Margin Calculator', path: route.path },
  ];

  const webAppSchema = buildWebApplicationSchema({
    name: 'Profit Margin Calculator & Gross Margin Tool',
    description: route.description,
    path: route.path,
    applicationCategory: 'BusinessApplication',
  });

  const faqSchema = buildFaqSchema(faqs);

  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={faqSchema} />

      <main className={styles.main}>
        <Breadcrumbs items={breadcrumbItems} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Profit Margin Calculator: Gross, Operating &amp; Net Margin</h1>
          <p className={styles.lead}>
            Our free <strong>gross margin calculator</strong> enables businesses, retailers, and entrepreneurs to instantly calculate gross profit margin, operating margin (EBIT), and net profit margin. Analyze full multi-tier P&amp;L waterfalls, determine prices for target margins, and compute blended margins across multiple products.
          </p>
          <div className={styles.meta}>
            Published by KKC Tools · Updated {route.updated} · Mathematical Verification Guaranteed
          </div>
        </header>

        {/* BLUF Box */}
        <div className={styles.blufBox}>
          <strong>Bottom Line Up Front (BLUF):</strong> Gross margin = (revenue − cost of goods sold) ÷ revenue × 100.
          For example, selling an item for <strong>{formatCurrency(exGrossStandard.revenue)}</strong> that costs{' '}
          <strong>{formatCurrency(exGrossStandard.cogs)}</strong> generates{' '}
          <strong>{formatCurrency(exGrossStandard.grossProfit)}</strong> in gross profit, yielding an exact{' '}
          <strong>{formatPercent(exGrossStandard.grossMarginPercent)}</strong> gross profit margin and a{' '}
          <strong>{formatPercent(exGrossStandard.markupPercent)}</strong> markup on cost.
        </div>

        {/* Top Ad Slot */}
        <AdSlot slotId="before-calculator" />

        {/* Interactive Tool Component */}
        <section className={styles.toolSection} aria-label="Interactive Profit Margin Calculator">
          <ProfitMarginCalculator />
        </section>

        {/* In-Content Ad Slot */}
        <AdSlot slotId="after-calculator" />

        {/* Authoritative Educational Content */}
        <article className={styles.article}>
          {/* Section 1 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>How to Use the Profit Margin Calculator</h2>
            <p className={styles.p}>
              Evaluating profitability requires analyzing margins at different levels of your financial statements. Our calculator features four distinct operational modes:
            </p>
            <ul className={styles.p}>
              <li>
                <strong>Gross Profit Margin Mode (Default):</strong> Enter sales revenue and Cost of Goods Sold (COGS) to find gross profit, margin percentage, markup on cost, and per-unit profitability.
              </li>
              <li>
                <strong>Full P&amp;L Waterfall Mode:</strong> Enter gross sales, returns, direct inventory costs, operating overhead (rent, payroll, marketing), depreciation, interest, and taxes to trace the cascade from gross margin down to net margin.
              </li>
              <li>
                <strong>Price for Target Margin Mode:</strong> Enter your unit acquisition cost and your desired profit margin (e.g. 40%) to calculate the necessary customer ticket price and equivalent markup.
              </li>
              <li>
                <strong>Product Mix &amp; Blended Margin Mode:</strong> Enter sales volume, selling prices, and unit costs across multiple inventory lines to calculate your true portfolio-wide blended margin.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Gross Profit Margin Formula (Gross Margin Calculation)</h2>
            <p className={styles.p}>
              Gross profit margin measures how efficiently a business converts raw materials and direct labor into gross profit before paying administrative overhead:
            </p>
            <div className={styles.formulaHighlight}>
              Gross Profit = Revenue − Cost of Goods Sold (COGS)
              <br />
              Gross Profit Margin (%) = (Gross Profit ÷ Revenue) × 100
            </div>
            <h3 className={styles.h3}>Real-World Gross Margin Calculations</h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Business Model</th>
                    <th>Sales Revenue</th>
                    <th>COGS</th>
                    <th>Gross Profit</th>
                    <th>Gross Margin %</th>
                    <th>Equivalent Markup %</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Retail Boutique</strong></td>
                    <td>{formatCurrency(exGrossStandard.revenue)}</td>
                    <td>{formatCurrency(exGrossStandard.cogs)}</td>
                    <td>{formatCurrency(exGrossStandard.grossProfit)}</td>
                    <td><strong>{formatPercent(exGrossStandard.grossMarginPercent)}</strong></td>
                    <td>{formatPercent(exGrossStandard.markupPercent)}</td>
                  </tr>
                  <tr>
                    <td><strong>Wholesale Distributor</strong></td>
                    <td>{formatCurrency(exGrossWholesale.revenue)}</td>
                    <td>{formatCurrency(exGrossWholesale.cogs)}</td>
                    <td>{formatCurrency(exGrossWholesale.grossProfit)}</td>
                    <td><strong>{formatPercent(exGrossWholesale.grossMarginPercent)}</strong></td>
                    <td>{formatPercent(exGrossWholesale.markupPercent)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Operating Profit Margin Formula (EBIT Margin)</h2>
            <p className={styles.p}>
              Operating profit margin (also known as Earnings Before Interest and Taxes, or EBIT margin) measures profitability after deducting regular business operating expenses (OPEX):
            </p>
            <div className={styles.formulaHighlight}>
              Operating Profit (EBIT) = Gross Profit − Operating Expenses (OPEX)
              <br />
              Operating Margin (%) = (Operating Profit ÷ Revenue) × 100
            </div>
            <p className={styles.p}>
              Operating expenses include commercial rent, non-production administrative salaries, marketing, software subscriptions, insurance, and utilities. A company can maintain a healthy 50% gross margin yet face financial insolvency if uncontrolled operating expenses consume 55% of revenue.
            </p>
          </section>

          {/* Section 4 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Net Profit Margin Formula: How to Calculate Net Profit Margin</h2>
            <p className={styles.p}>
              Net profit margin represents the ultimate bottom-line profitability of an organization after all financial obligations have been satisfied:
            </p>
            <div className={styles.formulaHighlight}>
              Net Income = Operating Profit − Debt Interest − Income Taxes
              <br />
              Net Profit Margin (%) = (Net Income ÷ Total Revenue) × 100
            </div>
            <p className={styles.p}>
              In our verified P&amp;L benchmark: with <strong>{formatCurrency(exPnlFull.netRevenue)}</strong> net revenue,{' '}
              <strong>{formatCurrency(exPnlFull.cogs)}</strong> COGS, and <strong>{formatCurrency(exPnlFull.operatingExpenses)}</strong> OPEX, the operating profit is $20,000. Deducting $3,000 interest and $3,500 corporate income tax leaves{' '}
              <strong>{formatCurrency(exPnlFull.netProfit)}</strong> in net income, yielding an exact{' '}
              <strong>{formatPercent(exPnlFull.netMarginPercent)}</strong> net profit margin.
            </p>
          </section>

          {/* Section 5 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Gross vs Operating vs Net Margin: The Profit Waterfall</h2>
            <p className={styles.p}>
              Financial margins compress as revenue moves down the income statement. Understanding each tier helps pinpoint exactly where business capital is consumed:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Profit Metric</th>
                    <th>Expenses Deducted</th>
                    <th>What It Measures</th>
                    <th>Decision Role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Gross Margin</strong></td>
                    <td>COGS (Direct materials &amp; direct labor)</td>
                    <td>Production &amp; inventory efficiency</td>
                    <td>Product pricing &amp; supplier negotiations</td>
                  </tr>
                  <tr>
                    <td><strong>Operating Margin</strong></td>
                    <td>COGS + Operating Overhead (OPEX)</td>
                    <td>Operational cost discipline &amp; scale</td>
                    <td>Workforce headcount &amp; marketing spend</td>
                  </tr>
                  <tr>
                    <td><strong>Net Margin</strong></td>
                    <td>All costs, interest on loans, &amp; taxes</td>
                    <td>Total business viability &amp; shareholder returns</td>
                    <td>Dividends, reinvestment &amp; valuation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Gross Sales vs Net Sales: The Starting Line</h2>
            <p className={styles.p}>
              Many retail operators incorrectly compute profit margins against gross sales invoices rather than net sales:
            </p>
            <ul className={styles.p}>
              <li><strong>Gross Sales:</strong> The raw total of all customer charges before adjustments.</li>
              <li><strong>Customer Returns:</strong> Refunds issued for defective or returned inventory.</li>
              <li><strong>Sales Allowances:</strong> Partial price reductions granted for minor cosmetic flaws.</li>
              <li><strong>Discounts:</strong> Early payment terms (e.g., 2/10 net 30) or promotional coupons.</li>
            </ul>
            <div className={styles.formulaHighlight}>
              Net Sales = Gross Sales − (Customer Returns + Allowances + Discounts)
            </div>
            <p className={styles.p}>
              Always calculate your profit margins using net sales. If gross sales are $105,000 but returns total $5,000, calculating margin against $105,000 artificially overstates your revenue baseline.
            </p>
          </section>

          {/* Section 7 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Margin vs Markup: The 40% vs 66.7% Confusion</h2>
            <p className={styles.p}>
              Gross margin and markup are frequently confused because both describe profitability. However, their mathematical basis is completely different:
            </p>
            <div className={styles.callout}>
              <div className={styles.calloutTitle}>The Mathematical Difference</div>
              <p>
                <strong>Markup</strong> is the percentage added to cost: <code>Profit ÷ Cost</code>.
                <br />
                <strong>Margin</strong> is the percentage of selling price kept as profit: <code>Profit ÷ Selling Price</code>.
              </p>
            </div>
            <p className={styles.p}>
              If an item costs $60 and sells for $100, the profit is $40. The gross margin is <strong>40%</strong> ($40 ÷ $100), but the markup is <strong>66.67%</strong> ($40 ÷ $60). For a deeper breakdown of markup mathematics and price multipliers, visit our dedicated <Link href={ROUTES.markupCalculator.path} className={styles.pillLink}>Markup Calculator</Link>.
            </p>
          </section>

          {/* Section 8 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>How to Price for a Target Profit Margin</h2>
            <p className={styles.p}>
              To establish a retail selling price that guarantees a specific profit margin, use the target margin formula:
            </p>
            <div className={styles.formulaHighlight}>
              Required Selling Price = Unit Cost ÷ (1 − (Target Margin % ÷ 100))
            </div>
            <p className={styles.p}>
              If an item costs {formatCurrency(60)} and your business model requires a 40% gross margin, you must price the item at <strong>{formatCurrency(exTarget40.sellingPrice ?? 100)}</strong>. Merely adding 40% to your cost would give $84, yielding only a 28.57% gross margin!
            </p>
          </section>

          {/* Section 9 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>What is a Good Profit Margin? Sourced Industry Benchmarks</h2>
            <p className={styles.p}>
              Profit margins vary drastically across economic sectors based on capital intensity, asset turnover, and competitive barriers. According to corporate financial datasets published by the <strong>NYU Stern School of Business (Aswath Damodaran, Margins by Sector)</strong>:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Industry Sector</th>
                    <th>Typical Gross Margin</th>
                    <th>Typical Net Margin</th>
                    <th>Economic Operating Model</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Grocery &amp; Food Retail</strong></td>
                    <td>20% – 25%</td>
                    <td>1.5% – 3.0%</td>
                    <td>High volume, rapid inventory turns, slim net margins</td>
                  </tr>
                  <tr>
                    <td><strong>Building Materials &amp; Construction</strong></td>
                    <td>25% – 35%</td>
                    <td>5.0% – 8.0%</td>
                    <td>Project-based contracts, equipment depreciation, bonding costs</td>
                  </tr>
                  <tr>
                    <td><strong>Apparel &amp; Specialty Retail</strong></td>
                    <td>45% – 55%</td>
                    <td>6.0% – 10.0%</td>
                    <td>Seasonal inventory risk, fashion trends, clearance markdowns</td>
                  </tr>
                  <tr>
                    <td><strong>General Commercial Manufacturing</strong></td>
                    <td>30% – 40%</td>
                    <td>7.0% – 11.0%</td>
                    <td>Plant tooling, raw material commodities, factory labor</td>
                  </tr>
                  <tr>
                    <td><strong>Software &amp; Digital Services</strong></td>
                    <td>65% – 80%</td>
                    <td>15.0% – 25.0%</td>
                    <td>Zero marginal unit cost, high initial engineering R&amp;D</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.p}>
              Evaluating your business against companies with identical cost structures provides actionable insights. A 4% net margin in grocery is exceptional, whereas a 4% net margin in enterprise software indicates severe operational distress.
            </p>
          </section>

          {/* Section 10 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>GP and GP% in UK Business Accounting</h2>
            <p className={styles.p}>
              In the United Kingdom and Commonwealth jurisdictions, financial professionals frequently refer to gross margin as <strong>GP%</strong> (Gross Profit Percentage):
            </p>
            <div className={styles.formulaHighlight}>
              GP (£) = Turnover (ex-VAT) − Cost of Sales (ex-VAT)
              <br />
              GP% = (GP ÷ Turnover) × 100
            </div>
            <p className={styles.p}>
              British trade businesses, pubs, and wholesalers regularly discuss &ldquo;GP targets&rdquo; (e.g. aiming for a 65% GP on beverage service or 25% GP on commercial building supplies). Remember to always exclude Value Added Tax (VAT) from both turnover and cost of sales before working out your GP%.
            </p>
          </section>

          {/* Section 11: FAQ */}
          <section className={styles.section} id="faq">
            <h2 className={styles.h2}>Frequently Asked Questions About Profit Margins</h2>
            {faqs.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <h3 className={styles.faqQ}>{faq.q}</h3>
                <p className={styles.faqA}>{faq.a}</p>
              </div>
            ))}
          </section>

          {/* Related Tools Navigation */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Related Business &amp; Financial Calculators</h2>
            <p className={styles.p}>
              Explore our other free commercial tools:
            </p>
            <div className={styles.internalLinks}>
              <Link href={ROUTES.unitPriceCalculator.path} className={styles.pillLink}>
                Unit Price Calculator
              </Link>
              <Link href={ROUTES.markupCalculator.path} className={styles.pillLink}>
                Markup Calculator
              </Link>
              <Link href={ROUTES.percentageChangeCalculator.path} className={styles.pillLink}>
                Percentage Change Calculator
              </Link>
              <Link href={ROUTES.constructionEstimateTemplate.path} className={styles.pillLink}>
                Construction Estimate Template
              </Link>
              <Link href={ROUTES.tools.path} className={styles.pillLink}>
                All Free Tools
              </Link>
            </div>
          </section>

          {/* How We Calculate Section */}
          <HowWeCalculate slug="profit-margin-calculator" />
        </article>

        <AdSlot slotId="after-content" />
      </main>
    </>
  );
}
