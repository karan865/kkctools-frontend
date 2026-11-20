import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ContributionMarginCalculator } from '@/components/tool/contribution-margin-calculator';
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

const route = ROUTES.contributionMarginCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const faqs = [
  {
    q: 'What is contribution margin?',
    a: 'Contribution margin is the dollar amount remaining from each unit sale after covering all direct variable costs associated with producing that unit (Selling Price minus Variable Cost per Unit). This residual cash contributes directly toward paying down fixed business overhead (rent, insurance, salaries) and, once overhead is covered, generates net operating profit.',
  },
  {
    q: 'What is the contribution margin ratio, and how is it used?',
    a: 'The contribution margin ratio (CM ratio) expresses contribution margin as a percentage of gross revenue: CM per Unit divided by Selling Price, or Total Contribution Margin divided by Total Sales Revenue. A 40% CM ratio signifies that 40 cents of every sales dollar generated is available to cover fixed operating expenses and produce net profit.',
  },
  {
    q: 'What is the contribution margin equation?',
    a: 'The foundational contribution margin equation is: Contribution Margin = Sales Revenue − Total Variable Costs. On a per-unit basis, the formula is: CM per Unit = Selling Price per Unit − Variable Cost per Unit. In ratio format, the equation is: CM Ratio = (Selling Price − Variable Cost) ÷ Selling Price.',
  },
  {
    q: 'How do I calculate the break-even point?',
    a: 'To calculate the break-even point in physical units, divide total fixed costs by the contribution margin per unit: Break-Even Units = Fixed Costs ÷ CM per Unit. To calculate the break-even point in sales dollars, divide total fixed costs by the contribution margin ratio: Break-Even Sales ($) = Fixed Costs ÷ CM Ratio.',
  },
  {
    q: 'Break-even in units or in dollars: which should I use?',
    a: 'Use break-even in units when manufacturing or distributing homogeneous physical goods (e.g., how many widgets, pizzas, or solar panels must be sold). Use break-even in sales dollars for multi-product retail stores, professional service firms, and restaurants where items have varying prices and individual unit tracking is less practical.',
  },
  {
    q: 'How many units do I need to sell to make a target profit?',
    a: 'To find the unit volume required for a target pre-tax operating profit, add the target profit to total fixed costs and divide by the contribution margin per unit: Required Units = (Fixed Costs + Target Profit) ÷ CM per Unit. If your goal is expressed as an after-tax net profit, first gross it up: Pre-Tax Profit = Target After-Tax Profit ÷ (1 − Effective Tax Rate).',
  },
  {
    q: 'What is margin of safety?',
    a: 'Margin of safety measures the cushion between your current (or projected) sales volume and the break-even point. It represents how much sales volume or revenue can drop before the company incurs an operating loss. It is calculated as: Margin of Safety (Units) = Actual Units − Break-Even Units, or as a percentage: (Actual Sales − Break-Even Sales) ÷ Actual Sales.',
  },
  {
    q: 'How does break-even work with several products?',
    a: 'When selling multiple products, break-even depends on the sales mix (the proportion of total unit sales contributed by each product). You calculate a company-wide weighted average contribution margin based on each product’s share of sales. Total break-even units equal Fixed Costs divided by the Weighted CM, which is then allocated back to each individual product according to its mix percentage.',
  },
  {
    q: "Contribution margin vs gross margin: what's the difference?",
    a: 'Gross margin is an external financial accounting metric (GAAP) defined as Revenue minus Cost of Goods Sold (COGS), where COGS includes both variable factory costs and fixed manufacturing overhead. Contribution margin is an internal managerial accounting metric (CVP) that subtracts ALL variable costs (both manufacturing and variable selling/admin expenses) while excluding ALL fixed costs.',
  },
  {
    q: 'Can contribution margin be negative?',
    a: 'Yes. A negative contribution margin occurs when the variable cost to produce and deliver a unit exceeds its selling price (e.g., selling an item for $20 that costs $25 in raw materials, shipping, and sales commission). In this scenario, every additional unit sold increases the company’s operating loss. Production should immediately be paused or re-priced.',
  },
  {
    q: 'How can I lower my break-even point?',
    a: 'You can lower your break-even point through three operational levers: 1) Increase selling prices without disproportionate volume loss; 2) Reduce variable costs per unit through bulk purchasing, efficient labor, or streamlined shipping; or 3) Cut recurring fixed overhead costs such as office leases, software subscriptions, or administrative salaries.',
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Contribution Margin & Break-Even Calculator',
  applicationCategory: 'BusinessApplication',
  path: route.path,
  description: route.description,
});

const faqSchema = buildFaqSchema(faqs);

export default function ContributionMarginCalculatorPage() {
  const breadcrumbItems = [
    { name: 'Calculators', path: ROUTES.tools.path },
    { name: 'Contribution Margin Calculator', path: route.path },
  ];

  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={faqSchema} />

      <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
        <Breadcrumbs items={breadcrumbItems} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Contribution Margin Calculator: Ratio and Break-Even Point</h1>
          <p className={styles.lead}>
            Calculate contribution margin per unit, contribution margin ratio, break-even unit volume, required sales revenue,
            margin of safety, and multi-product sales mix using verified Cost-Volume-Profit (CVP) managerial accounting formulas.
          </p>
          <div className={styles.meta}>
            <span>Managerial Accounting Standard</span> &bull; <span>100% Client-Side Engine</span> &bull;{' '}
            <span>Updated November 2026</span>
          </div>
        </header>

        {/* Quick Answer BLUF Box */}
        <div className={styles.blufBox}>
          <strong>Quick Definition (BLUF):</strong> Contribution margin is what each sale leaves after variable costs: price − variable cost per unit. The contribution margin ratio is that amount ÷ price. A $50 product with $30 of variable cost has a $20 contribution margin and a 40% ratio. With $20,000 of fixed overhead, the break-even point is exactly 1,000 units ($50,000 in gross revenue).
        </div>

        {/* Interactive Calculator Section */}
        <section className={styles.toolSection} aria-label="Contribution Margin & Break-Even Calculator">
          <ContributionMarginCalculator />
        </section>

        <AdSlot slotId="after-tool" />

        {/* Comprehensive Long-Form Guide */}
        <article className={styles.article}>
          {/* Section 1: Contribution margin and contribution margin ratio */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Contribution Margin and Contribution Margin Ratio</h2>
            <p className={styles.p}>
              In managerial accounting and corporate financial planning, <strong>contribution margin and contribution margin ratio</strong> form
              the bedrock of Cost-Volume-Profit (CVP) analysis. When evaluating business profitability, traditional financial statements
              often obscure operational reality by bundling fixed and variable expenses together into Cost of Goods Sold (COGS).
            </p>
            <p className={styles.p}>
              To <strong>define contribution margin</strong> precisely: it is the incremental dollar profit generated by selling an individual
              unit of product or service after covering every direct, variable expense required to produce that unit. The term &ldquo;contribution&rdquo;
              is literal—this margin represents the exact pool of capital that <em>contributes</em> toward absorbing fixed overhead (such as
              warehouse leases, general liability insurance, software licenses, and executive salaries). Once those fixed obligations are
              fully satisfied, every subsequent dollar of contribution margin drops straight to the bottom line as operating income (EBIT).
            </p>
            <p className={styles.p}>
              While the unit contribution margin provides a dollar-denominated figure per item sold, the <strong>contribution margin ratio</strong> expresses
              that margin as a percentage of total sales price. This percentage metric is invaluable for multi-product enterprises, eCommerce
              portfolios, and consulting agencies, allowing management to evaluate profitability across varying product lines independent of unit pricing scale.
            </p>
          </section>

          {/* Section 2: Contribution margin equation and ratio formula */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Contribution Margin Equation and Ratio Formula</h2>
            <p className={styles.p}>
              The mathematical relationship between unit selling price, variable costs, and contribution margin is governed by two foundational formulas.
              Understanding the <strong>contribution margin equation</strong> is essential for preparing accurate internal financial projections:
            </p>
            <div className={styles.formulaBox}>
              <strong>Unit Contribution Margin Equation:</strong>
              <br />
              Contribution Margin per Unit (CM) = Selling Price per Unit (P) − Variable Cost per Unit (VC)
              <br />
              <br />
              <strong>Total Contribution Margin Equation:</strong>
              <br />
              Total Contribution Margin = Total Sales Revenue − Total Variable Costs
            </div>
            <p className={styles.p}>
              To calculate the percentage share of revenue that flows to overhead coverage, use the <strong>contribution margin ratio formula</strong>:
            </p>
            <div className={styles.formulaBox}>
              <strong>Contribution Margin Ratio Formula:</strong>
              <br />
              Contribution Margin Ratio (CM Ratio) = Contribution Margin per Unit ÷ Selling Price per Unit
              <br />
              <em>or equivalently across an entire organization:</em>
              <br />
              CM Ratio = Total Contribution Margin ÷ Total Sales Revenue
            </div>
            <p className={styles.p}>
              Consider our engine benchmark: A manufacturing company manufactures ergonomic desk chairs priced at <strong>$50.00</strong> per unit.
              Direct raw materials, labor assembly, and shipping packaging total <strong>$30.00</strong> in variable costs per chair.
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li><strong>Unit Contribution Margin:</strong> $50.00 − $30.00 = <strong>$20.00 per unit</strong></li>
              <li><strong>Contribution Margin Ratio:</strong> $20.00 ÷ $50.00 = <strong>0.40 (or 40.0%)</strong></li>
            </ul>
            <p className={styles.p}>
              This confirms that for every chair shipped, $20.00 is generated to absorb overhead expenses, while 60% ($30.00) is consumed by direct production costs.
            </p>
          </section>

          {/* Section 3: How to use the calculator */}
          <section className={styles.section}>
            <h2 className={styles.h2}>How to Use This Contribution Margin Calculator</h2>
            <p className={styles.p}>
              Our verified calculator features three distinct analytical modes tailored to entrepreneurs, financial analysts, and accounting students:
            </p>
            <ol className={styles.p} style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Single Product &amp; Break-Even (Default):</strong> Enter your unit selling price, variable cost per unit, total fixed overhead,
                and current unit sales volume. The engine instantly computes your unit CM, CM ratio, break-even thresholds (units and dollars), margin
                of safety, degree of operating leverage (DOL), and an interactive SVG CVP graph.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Multi-Product Sales Mix:</strong> Model multi-SKU product portfolios. Enter the selling price, variable cost, and sales mix percentage
                for each product line. The engine computes the weighted contribution margin and allocates total corporate break-even units across your catalog.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>What-If Sensitivity Matrix:</strong> Test operational levers using interactive sliders for price changes, supply cost inflation,
                overhead adjustments, and sales volume swings to measure their immediate percentage impact on net operating income.
              </li>
            </ol>
          </section>

          {/* Section 4: Break-even point in units and dollars */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Break-Even Point in Units and Dollars</h2>
            <p className={styles.p}>
              The break-even point is the operational milestone where total revenues equal total expenses—meaning operating income is exactly zero.
              At this juncture, the business has absorbed all fixed costs but has not yet generated net profit.
            </p>
            <div className={styles.formulaBox}>
              Break-Even Point (Units) = Total Fixed Costs ÷ Contribution Margin per Unit
              <br />
              <br />
              Break-Even Point (Sales Dollars) = Total Fixed Costs ÷ Contribution Margin Ratio
            </div>
            <p className={styles.p}>
              Continuing with our verified engine benchmark, assuming fixed monthly operating costs of <strong>$20,000.00</strong> (facility lease,
              utilities, insurance, administrative staff) and a unit contribution margin of <strong>$20.00</strong> (40% CM ratio):
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li><strong>Break-Even Units:</strong> $20,000 ÷ $20.00 = <strong>1,000 units</strong></li>
              <li><strong>Break-Even Sales Revenue:</strong> $20,000 ÷ 0.40 = <strong>$50,000.00</strong> (or 1,000 units × $50.00)</li>
            </ul>
            <p className={styles.p}>
              If the company produces and sells 999 units, it operates at a net loss of $20.00. At exactly 1,000 units, operating income is $0.00.
              At 1,001 units, the company books its first $20.00 of net operating profit.
            </p>
          </section>

          {/* Section 5: Units needed for a target profit */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Units Needed for a Target Profit (Including After-Tax Gross-Up)</h2>
            <p className={styles.p}>
              Business operators rarely plan solely to break even; they set specific profitability targets for debt service, owner distributions,
              or capital reinvestment. CVP analysis allows you to calculate the precise sales volume required to hit any dollar profit target:
            </p>
            <div className={styles.formulaBox}>
              Target Sales Volume (Units) = (Total Fixed Costs + Target Pre-Tax Operating Profit) ÷ CM per Unit
            </div>
            <p className={styles.p}>
              If our manufacturer seeks a pre-tax operating profit of <strong>$15,000.00</strong>:
            </p>
            <div className={styles.formulaBox}>
              Target Units = ($20,000 + $15,000) ÷ $20.00 = $35,000 ÷ $20.00 = <strong>1,750 units ($87,500 sales)</strong>
            </div>

            <h3 className={styles.h3}>Accounting for After-Tax Profit Goals</h3>
            <p className={styles.p}>
              When owners establish a target net income after corporate or income taxes, the after-tax figure must first be converted to a pre-tax
              equivalent using the effective tax rate ($t$):
            </p>
            <div className={styles.formulaBox}>
              Pre-Tax Operating Profit Needed = Target After-Tax Profit ÷ (1 − Tax Rate)
            </div>
            <p className={styles.p}>
              For example, if your goal is <strong>$12,000.00</strong> in net take-home profit after paying a 20% corporate tax rate:
              <br />
              Pre-Tax Profit = $12,000 ÷ (1 − 0.20) = $12,000 ÷ 0.80 = <strong>$15,000.00</strong>.
              <br />
              Dividing ($20,000 fixed costs + $15,000 pre-tax) by the $20 unit CM confirms that <strong>1,750 units</strong> must be sold.
            </p>
          </section>

          {/* Section 6: Margin of safety */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Margin of Safety: Measuring Downside Risk</h2>
            <p className={styles.p}>
              The <strong>Margin of Safety (MOS)</strong> evaluates operational vulnerability to market downturns. It indicates the amount
              by which sales volume or revenue can contract before the enterprise dips below break-even into negative operating cash flow.
            </p>
            <div className={styles.formulaBox}>
              Margin of Safety (Units) = Current Actual Units − Break-Even Units
              <br />
              Margin of Safety (Sales Dollars) = Actual Revenue − Break-Even Revenue
              <br />
              Margin of Safety Ratio (%) = Margin of Safety (Sales $) ÷ Actual Revenue
            </div>
            <p className={styles.p}>
              In our benchmark example with current sales of <strong>1,500 units</strong> ($75,000 revenue) against a break-even threshold of <strong>1,000 units</strong> ($50,000 revenue):
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li><strong>Margin of Safety in Units:</strong> 1,500 − 1,000 = <strong>500 units</strong></li>
              <li><strong>Margin of Safety in Dollars:</strong> $75,000 − $50,000 = <strong>$25,000.00</strong></li>
              <li><strong>Margin of Safety Ratio:</strong> $25,000 ÷ $75,000 = <strong>33.33%</strong></li>
            </ul>
            <p className={styles.p}>
              A 33.33% margin of safety provides strong risk protection: chair demand could fall by one-third before the business experiences a financial loss.
            </p>
          </section>

          {/* Section 7: Operating leverage (DOL) */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Degree of Operating Leverage (DOL)</h2>
            <p className={styles.p}>
              <strong>Operating Leverage</strong> measures how sensitive a company&rsquo;s operating profit is to percentage changes in sales revenue.
              Firms with high fixed costs relative to variable costs exhibit high operating leverage: a modest increase in sales volume produces
              an outsized percentage surge in net profit.
            </p>
            <div className={styles.formulaBox}>
              Degree of Operating Leverage (DOL) = Total Contribution Margin ÷ Net Operating Income
            </div>
            <p className={styles.p}>
              Applying this to our benchmark at 1,500 units:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li><strong>Total Contribution Margin:</strong> 1,500 units × $20.00 = $30,000.00</li>
              <li><strong>Net Operating Income:</strong> $30,000 CM − $20,000 Fixed Costs = $10,000.00</li>
              <li><strong>Degree of Operating Leverage (DOL):</strong> $30,000 ÷ $10,000 = <strong>3.00</strong></li>
            </ul>
            <p className={styles.p}>
              A DOL of <strong>3.0</strong> means that for every 1.0% change in sales volume, net operating profit changes by <strong>3.0%</strong>.
              If sales volume increases by 10% (from 1,500 to 1,650 units), net operating profit will jump by 30% (from $10,000 to $13,000, an extra $3,000 in cash).
              However, leverage cuts both ways: a 10% drop in unit sales causes a 30% collapse in operating income.
            </p>
          </section>

          {/* Section 8: Several products: sales mix */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Multi-Product CVP Analysis: The Sales Mix</h2>
            <p className={styles.p}>
              Most commercial enterprises market multiple goods or services with varying prices, cost structures, and contribution margins.
              In multi-product environments, break-even cannot be calculated using a simple arithmetic average; it requires a <strong>weighted contribution margin</strong> based
              on the sales mix (the proportion of total unit sales represented by each product line).
            </p>
            <div className={styles.formulaBox}>
              Weighted CM per Unit = &Sigma; [ Product Mix Percentage &times; Product Unit CM ]
              <br />
              Total Portfolio Break-Even Units = Total Company Fixed Costs &divide; Weighted CM per Unit
              <br />
              Product Break-Even Units = Total Break-Even Units &times; Product Mix Percentage
            </div>
            <p className={styles.p}>
              Consider an agency offering two core solutions covering <strong>$90,000.00</strong> in corporate fixed overhead:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Product Line</th>
                    <th>Price</th>
                    <th>Variable Cost</th>
                    <th>Unit CM</th>
                    <th>Sales Mix %</th>
                    <th>Weighted CM</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Premium Solution</strong></td>
                    <td>$100.00</td>
                    <td>$40.00</td>
                    <td>$60.00</td>
                    <td>70.0%</td>
                    <td>$42.00</td>
                  </tr>
                  <tr>
                    <td><strong>Standard Package</strong></td>
                    <td>$50.00</td>
                    <td>$40.00</td>
                    <td>$10.00</td>
                    <td>30.0%</td>
                    <td>$3.00</td>
                  </tr>
                  <tr style={{ background: '#f8fafc', fontWeight: 'bold' }}>
                    <td><strong>Combined Portfolio</strong></td>
                    <td>$85.00 (avg)</td>
                    <td>$40.00</td>
                    <td>—</td>
                    <td><strong>100.0%</strong></td>
                    <td><strong>$45.00 / unit</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.p}>
              Notice that the weighted contribution margin ($45.00) differs significantly from the simple unweighted average (($60 + $10) / 2 = $35.00).
              Dividing $90,000 in fixed overhead by $45.00 yields a company-wide break-even of <strong>2,000 units</strong> ($170,000 in total sales revenue):
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li><strong>Premium Solution Break-Even:</strong> 2,000 units × 70% = <strong>1,400 units ($140,000)</strong></li>
              <li><strong>Standard Package Break-Even:</strong> 2,000 units × 30% = <strong>600 units ($30,000)</strong></li>
            </ul>
          </section>

          {/* Section 9: Contribution margin vs gross margin */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Contribution Margin vs. Gross Margin: The Crucial Distinction</h2>
            <p className={styles.p}>
              Business owners and accountants frequently conflate <strong>contribution margin</strong> with <strong>gross profit margin</strong>,
              leading to flawed pricing decisions. While both metrics measure profitability prior to deducting corporate overhead, their cost
              accounting classifications differ fundamentally:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Dimension</th>
                    <th>Contribution Margin (CVP)</th>
                    <th>Gross Profit Margin (GAAP)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Primary Purpose</strong></td>
                    <td>Internal managerial decisions, pricing, and break-even planning</td>
                    <td>External reporting to banks, tax authorities, and investors</td>
                  </tr>
                  <tr>
                    <td><strong>Cost Classification</strong></td>
                    <td>Behavioral: strictly splits costs into <strong>Variable vs. Fixed</strong></td>
                    <td>Functional: splits costs into <strong>Manufacturing (COGS) vs. Operating</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Treatment of Fixed Overhead</strong></td>
                    <td><strong>Excluded:</strong> Fixed factory overhead is treated as period cost</td>
                    <td><strong>Included:</strong> Factory rent/depreciation is allocated into unit COGS</td>
                  </tr>
                  <tr>
                    <td><strong>Treatment of Variable Admin/Sales</strong></td>
                    <td><strong>Deducted:</strong> Sales commissions, payment processing, shipping fees</td>
                    <td><strong>Excluded:</strong> Grouped under operating expenses (SG&amp;A) below gross margin</td>
                  </tr>
                  <tr>
                    <td><strong>Formula</strong></td>
                    <td>Revenue − All Variable Costs</td>
                    <td>Revenue − Cost of Goods Sold (COGS)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.p}>
              For a detailed exploration of gross, operating, and net profitability, explore our companion{' '}
              <Link href={ROUTES.profitMarginCalculator.path} style={{ color: '#0d9488', fontWeight: 600 }}>
                Profit Margin Calculator
              </Link>{' '}
              and{' '}
              <Link href={ROUTES.markupCalculator.path} style={{ color: '#0d9488', fontWeight: 600 }}>
                Markup Calculator
              </Link>.
            </p>
          </section>

          {/* Section 10: Limits of break-even analysis */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Operational Limitations of Break-Even Analysis</h2>
            <p className={styles.p}>
              While CVP modeling is an indispensable management tool, financial decision-makers must account for its real-world limitations:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Linearity Assumptions:</strong> Standard CVP models assume that selling price and variable cost per unit remain constant
                across all volumes. In practice, higher volumes often trigger volume discounts from suppliers (reducing variable cost) or require
                promotional discounting to stimulate demand (reducing selling price).
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Step Fixed Costs:</strong> Fixed costs are rarely completely fixed across unlimited production. Reaching higher unit volumes
                eventually triggers &ldquo;step costs&rdquo;—such as leasing a second warehouse, purchasing additional machinery, or hiring a shift supervisor.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Inventory Fluctuations:</strong> CVP analysis assumes that units produced equal units sold within the same accounting period.
                Large inventory buildups or sell-downs can distort reported profitability under standard absorption accounting.
              </li>
            </ul>
          </section>

          {/* Section 11: FAQ Accordion */}
          <section className={styles.faqSection}>
            <h2 className={styles.h2}>Frequently Asked Questions About Contribution Margin</h2>
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
          <HowWeCalculate slug="contribution-margin-calculator" />

          {/* Related Tools Cross-Links */}
          <section className={styles.relatedSection}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 16px', color: '#0f172a' }}>
              Related Business &amp; Pricing Calculators
            </h2>
            <div className={styles.relatedGrid}>
              <Link href={ROUTES.profitMarginCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Profit Margin Calculator</div>
                <div className={styles.relatedDesc}>
                  Analyze gross, operating, and net margins across complete P&amp;L expense waterfalls.
                </div>
              </Link>
              <Link href={ROUTES.markupCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Markup Calculator</div>
                <div className={styles.relatedDesc}>
                  Convert cost markups to profit margins, set retail selling prices, and model 3-tier wholesale pricing.
                </div>
              </Link>
              <Link href={ROUTES.laborCostCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Labor Cost Calculator</div>
                <div className={styles.relatedDesc}>
                  Calculate fully burdened employee hourly rates, payroll taxes, and contractor billing markups.
                </div>
              </Link>
              <Link href={ROUTES.freelanceRateCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Freelance Rate Calculator</div>
                <div className={styles.relatedDesc}>
                  Convert desired annual net income into billable hourly, daily, and weekly retainer rates.
                </div>
              </Link>
              <Link href={ROUTES.businessValuationCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Business Valuation Calculator</div>
                <div className={styles.relatedDesc}>
                  Calculate enterprise value and owner equity using SDE and EBITDA multiple benchmarks.
                </div>
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
