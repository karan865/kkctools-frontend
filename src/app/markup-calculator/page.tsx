import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import MarkupCalculator from '@/components/tool/markup-calculator';
import ToolShell from '@/components/tool/shared/ToolShell';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  priceFromMarkup,
  marginFromPrice,
  multiplier,
  calculateLandedCost,
  generateMarkupMarginTable,
  formatCurrency,
  formatPercent,
} from '@/lib/pricing-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.markupCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

// Dynamic engine calculations for build-time content accuracy
const exBaseCost = 40;
const exBaseMarkup = 50;
const exBasePrice = priceFromMarkup(exBaseCost, exBaseMarkup); // 60
const exBaseMargin = marginFromPrice(exBaseCost, exBasePrice) ?? 0; // 33.333%
const exBaseProfit = exBasePrice - exBaseCost; // 20
const exBaseMult = multiplier(exBaseCost, exBasePrice) ?? 1.5; // 1.5x

// Keystone Benchmark
const exKeystoneCost = 100;
const exKeystonePrice = priceFromMarkup(exKeystoneCost, 100); // 200
const exKeystoneMargin = marginFromPrice(exKeystoneCost, exKeystonePrice) ?? 50; // 50%

// Example 1: Retail Item
const exRetailCost = 40;
const exRetailMarkup = 50;
const exRetailPrice = priceFromMarkup(exRetailCost, exRetailMarkup); // 60

// Example 2: Handmade Product
const exHandmadeCost = 15;
const exHandmadeMarkup = 150;
const exHandmadePrice = priceFromMarkup(exHandmadeCost, exHandmadeMarkup); // 37.50
const exHandmadeProfit = exHandmadePrice - exHandmadeCost; // 22.50

// Example 3: Contractor Job
const exContractorCost = 1200;
const exContractorMarkup = 35;
const exContractorPrice = priceFromMarkup(exContractorCost, exContractorMarkup); // 1620
const exContractorProfit = exContractorPrice - exContractorCost; // 420

// Benchmark reference table generated from engine
const referenceRows = generateMarkupMarginTable(100);

// Fee landed example
const exFeeLanded = calculateLandedCost({
  baseCost: 40,
  feePercent: 10,
});
const exFeePrice = exFeeLanded.requiredPriceMarkup(50) ?? 66.67;

const faqs = [
  {
    q: 'How do you calculate markup percentage?',
    a: `To figure markup percentage from cost and selling price, subtract the cost from the selling price to find your dollar profit, divide that profit by the cost, and multiply by 100. The formula is: Markup% = ((Selling Price − Cost) ÷ Cost) × 100. For instance, if an item costs $40 and you sell it for $60, the markup is (($60 − $40) ÷ $40) × 100 = ($20 ÷ $40) × 100 = 50%.`,
  },
  {
    q: 'What is the difference between markup and margin?',
    a: `Markup expresses profit as a percentage of your cost, whereas gross margin expresses profit as a percentage of your selling price (revenue). For example, on a $40 cost item sold at $60, your dollar profit is $20. Your markup is 50% ($20 ÷ $40), but your gross margin is 33.33% ($20 ÷ $60). Because cost is almost always lower than selling price, markup percentage is always mathematically higher than gross margin percentage for any profitable sale.`,
  },
  {
    q: 'How do I convert margin to markup (and back)?',
    a: `To convert gross margin percentage (g) to markup percentage (m): Markup = (Margin ÷ (100 − Margin)) × 100. For example, a 50% margin equals (50 ÷ 50) × 100 = 100% markup. To convert markup (m) to gross margin (g): Margin = (Markup ÷ (100 + Markup)) × 100. For example, a 50% markup equals (50 ÷ 150) × 100 = 33.33% margin.`,
  },
  {
    q: 'What does a 100% markup mean?',
    a: `A 100% markup means you add 100% of the cost as profit, which exactly doubles the cost of the item. An item purchased for $50 with a 100% markup sells for $100. In retail terminology, this is known as keystone pricing, yielding an exact 50% gross margin and a 2.0× pricing multiplier.`,
  },
  {
    q: 'What is keystone pricing?',
    a: `Keystone pricing is a traditional retail pricing method where merchandise is priced at double the wholesale purchase price (a 100% markup, or a 2.0× multiplier). When a retailer buys a shirt at wholesale for $25 and prices it at $50, they are using keystone pricing. This 50% gross margin provides an operating cushion to cover store overhead, employee wages, and occasional clearance markdowns.`,
  },
  {
    q: 'How much should I sell my product for?',
    a: `To determine how much to sell your product for, first calculate your complete landed cost per unit (materials, manufacturing, packaging, inbound freight, and customs). Next, factor in platform or credit card transaction fees (e.g., 3% for payment processing or 15% for marketplaces). Finally, apply your target gross margin or markup: Selling Price = (Landed Cost × (1 + Markup% ÷ 100)) ÷ (1 − Platform Fee% ÷ 100). For example, a $40 landed product with a 50% markup on a platform with 10% transaction fees must sell for $66.67 to protect your target margin.`,
  },
  {
    q: 'What is retail price?',
    a: `Retail price (also called the selling price, sticker price, or MSRP) is the final price that an end-consumer pays when purchasing goods or services. It covers the retailer's wholesale inventory cost, shipping and operational overhead, and profit margin. Retail prices are usually quoted exclusive of sales tax in North America and inclusive of VAT or GST in the UK, Europe, Australia, and New Zealand.`,
  },
  {
    q: 'Is markup calculated before or after VAT or sales tax?',
    a: `Markup must always be calculated before VAT, GST, or sales tax (on the ex-tax price). Taxes belong to the government and do not represent business revenue or cost. Applying markup to tax-inclusive amounts inflates your cost basis and distorts profit reporting. Calculate your selling price ex-tax first: Price (ex-tax) = Cost × (1 + Markup%), and then append sales tax: Consumer Price (inc-tax) = Price (ex-tax) × (1 + Tax Rate%).`,
  },
  {
    q: 'How do card or marketplace fees change my price?',
    a: `Because payment processors (like Stripe or PayPal) and marketplaces (like Amazon or eBay) charge a percentage of the total final transaction value, subtracting fees after using a basic markup formula erodes your net profit. To maintain your desired markup on a product with landed cost C, target markup m, and fee rate f, use the gross-up formula: Price = (C × (1 + m)) ÷ (1 − f). For example, on a $40 cost with 50% target markup and a 10% fee, pricing at $66.67 ensures you receive exactly $60 after the $6.67 fee is deducted.`,
  },
  {
    q: 'How do wholesale and retail markups stack?',
    a: `In multi-tier distribution, markups compound sequentially along the supply chain. If a factory makes an item for $10 and applies a 100% markup, it sells to a wholesaler for $20. If the wholesaler applies a 50% markup, it sells to a retailer for $30. If the retailer applies a 100% keystone markup, the consumer pays $60. The total multiplier from factory cost to consumer price is 6.0× ($60 ÷ $10), because each tier calculates markup on its own acquisition cost.`,
  },
  {
    q: 'Can a service business or contractor use markup?',
    a: `Yes. Contractors, tradespeople, and service businesses regularly markup direct project expenses (subcontractor invoices, materials, equipment rentals, and specialized supplies). An electrical contractor who purchases $1,200 of commercial fixtures may apply a 35% markup, billing the client $1,620 ($420 gross profit). This markup compensates for procurement time, warranty risk, storage, and handling costs.`,
  },
];

export default function MarkupCalculatorPage() {
  const breadcrumbItems = [
    { name: 'Home', path: ROUTES.home.path },
    { name: 'Tools', path: ROUTES.tools.path },
    { name: 'Markup Calculator', path: route.path },
  ];

  const webAppSchema = buildWebApplicationSchema({
    name: 'Markup Calculator & Selling Price Tool',
    description: route.description,
    path: route.path,
    applicationCategory: 'BusinessApplication',
  });

  const faqSchema = buildFaqSchema(faqs);

  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={faqSchema} />

      <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
        <Breadcrumbs items={breadcrumbItems} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Markup Calculator: Selling Price from Cost and Markup %</h1>
          <p className={styles.lead}>
            Calculate the exact selling price for your products, services, or wholesale inventory.
            Instantly determine markup percentage, gross margin, dollar profit, and price multipliers,
            with full support for landed freight costs, marketplace fees, sales tax, and price endings.
          </p>
          <div className={styles.meta}>
            Published by KKC Tools · Updated {route.updated} · Mathematical Verification Guaranteed
          </div>
        </header>

        {/* BLUF Box */}
        <div className={styles.blufBox}>
          <strong>Bottom Line Up Front (BLUF):</strong> Selling price = cost × (1 + markup %).
          For example, a <strong>{formatCurrency(exBaseCost)}</strong> item marked up by{' '}
          <strong>{formatPercent(exBaseMarkup)}</strong> sells for{' '}
          <strong>{formatCurrency(exBasePrice)}</strong>, generating{' '}
          <strong>{formatCurrency(exBaseProfit)}</strong> in gross profit per unit at an exact{' '}
          <strong>{formatPercent(exBaseMargin)}</strong> gross margin and a{' '}
          <strong>{exBaseMult.toFixed(2)}×</strong> pricing multiplier.
        </div>

        {/* Ad Placement Top */}
        <AdSlot slotId="before-calculator" />

        {/* Interactive Tool Component */}
        <section className={styles.toolSection} aria-label="Interactive Markup Calculator">
          <ToolShell
            features={[
              'Markup & margin sync',
              'Landed cost & fees',
              'Multi-item spreadsheet',
              'Wholesale tier chain',
            ]}
          >
            <MarkupCalculator />
          </ToolShell>
        </section>

        {/* Ad Placement In-Content */}
        <AdSlot slotId="after-calculator" />

        {/* Comprehensive SEO Content Articles */}
        <article className={styles.article}>
          {/* Section 1 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>How to Use the Markup Calculator</h2>
            <p className={styles.p}>
              Pricing merchandise correctly is essential for business longevity. This calculator operates across four flexible modes to solve any pricing equation:
            </p>
            <ul className={styles.p}>
              <li>
                <strong>Cost &amp; Markup % Mode (Default):</strong> Enter your unit cost and desired markup percentage to calculate the customer selling price and gross profit.
              </li>
              <li>
                <strong>Cost &amp; Target Margin % Mode:</strong> Enter your unit cost and the gross profit margin required by your business model (e.g., 40% margin) to compute the required selling price.
              </li>
              <li>
                <strong>Cost &amp; Selling Price Mode:</strong> Enter what you paid and what you charge to discover your effective markup percentage and gross margin.
              </li>
              <li>
                <strong>Target Price to Max Cost Mode (Reverse):</strong> If market competition caps your retail price at $100 and you need a 50% markup, discover the maximum unit production cost you can afford.
              </li>
              <li>
                <strong>Multi-Item Spreadsheet Mode:</strong> Paste tabular rows directly from Microsoft Excel or Google Sheets to calculate unit prices and gross margins for your entire product catalogue simultaneously.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Markup Formula: How to Figure Markup</h2>
            <p className={styles.p}>
              Markup represents the percentage added to the cost of an item to establish its selling price. It reflects the gross profit earned relative to the money spent acquiring or producing the product:
            </p>

            <div className={styles.formulaHighlight}>
              Selling Price = Cost × (1 + (Markup % ÷ 100))
              <br />
              Markup % = ((Selling Price − Cost) ÷ Cost) × 100
              <br />
              Gross Profit = Selling Price − Cost
            </div>

            <h3 className={styles.h3}>Real-World Mathematical Examples</h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Base Cost</th>
                    <th>Markup %</th>
                    <th>Calculation</th>
                    <th>Selling Price</th>
                    <th>Gross Profit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Retail Goods</strong></td>
                    <td>{formatCurrency(exRetailCost)}</td>
                    <td>{formatPercent(exRetailMarkup)}</td>
                    <td>{formatCurrency(exRetailCost)} × 1.50</td>
                    <td><strong>{formatCurrency(exRetailPrice)}</strong></td>
                    <td>{formatCurrency(exRetailPrice - exRetailCost)}</td>
                  </tr>
                  <tr>
                    <td><strong>Handmade Craft</strong></td>
                    <td>{formatCurrency(exHandmadeCost)}</td>
                    <td>{formatPercent(exHandmadeMarkup)}</td>
                    <td>{formatCurrency(exHandmadeCost)} × 2.50</td>
                    <td><strong>{formatCurrency(exHandmadePrice)}</strong></td>
                    <td>{formatCurrency(exHandmadeProfit)}</td>
                  </tr>
                  <tr>
                    <td><strong>Contractor Job</strong></td>
                    <td>{formatCurrency(exContractorCost)}</td>
                    <td>{formatPercent(exContractorMarkup)}</td>
                    <td>{formatCurrency(exContractorCost)} × 1.35</td>
                    <td><strong>{formatCurrency(exContractorPrice)}</strong></td>
                    <td>{formatCurrency(exContractorProfit)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Markup vs Margin: Understanding the Critical Difference</h2>
            <p className={styles.p}>
              Confusing markup with gross margin is one of the most common causes of retail underpricing. While both metrics evaluate the same dollar profit, their mathematical base is completely different:
            </p>
            <ul className={styles.p}>
              <li>
                <strong>Markup</strong> divides dollar profit by <em>Cost</em>: <code>Profit ÷ Cost</code>.
              </li>
              <li>
                <strong>Gross Margin</strong> divides dollar profit by <em>Revenue (Selling Price)</em>: <code>Profit ÷ Selling Price</code>.
              </li>
            </ul>

            <div className={styles.callout}>
              <div className={styles.calloutTitle}>⚠️ The 50% Fallacy</div>
              <p>
                A 50% markup does <strong>not</strong> produce a 50% margin! If an item costs $100 and you apply a 50% markup, your price is $150 and profit is $50. Your gross margin is $50 ÷ $150 = <strong>33.33%</strong>. To achieve a true 50% gross margin on a $100 item, you must apply a <strong>100% markup</strong> (selling at $200).
              </p>
            </div>

            <h3 className={styles.h3}>Markup to Margin Conversion Table</h3>
            <p className={styles.p}>
              This benchmark reference table generated by our pricing engine shows the exact mathematical relationship across common retail tiers based on a $100 cost:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Markup %</th>
                    <th>Gross Margin %</th>
                    <th>Multiplier</th>
                    <th>Cost Basis</th>
                    <th>Selling Price</th>
                    <th>Gross Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {referenceRows.map((r, i) => (
                    <tr key={i}>
                      <td><strong>{formatPercent(r.markupPercent)}</strong></td>
                      <td>{formatPercent(r.marginPercent)}</td>
                      <td>{r.multiplier.toFixed(2)}×</td>
                      <td>{formatCurrency(r.exampleCost)}</td>
                      <td><strong>{formatCurrency(r.examplePrice)}</strong></td>
                      <td>{formatCurrency(r.exampleProfit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Multipliers and Keystone Pricing</h2>
            <p className={styles.p}>
              A pricing multiplier expresses the selling price as a multiple of product cost: <code>Multiplier = Selling Price ÷ Cost</code>.
            </p>
            <p className={styles.p}>
              In traditional brick-and-mortar retail, <strong>Keystone Pricing</strong> refers to an exact <strong>2.0× multiplier</strong> (a 100% markup). Purchasing inventory at {formatCurrency(exKeystoneCost)} wholesale and applying keystone pricing places the retail price tag at {formatCurrency(exKeystonePrice)}, establishing an exact {formatPercent(exKeystoneMargin)} gross margin. This 50% spread historically covered physical store rent, floor staff payroll, display depreciation, and seasonal markdown clearance.
            </p>
            <ul className={styles.p}>
              <li><strong>1.5× Multiplier:</strong> 50% Markup = 33.33% Margin</li>
              <li><strong>2.0× Multiplier (Keystone):</strong> 100% Markup = 50.00% Margin</li>
              <li><strong>2.5× Multiplier:</strong> 150% Markup = 60.00% Margin</li>
              <li><strong>3.0× Multiplier:</strong> 200% Markup = 66.67% Margin</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>How to Price Your Product: What Goes into Real Cost</h2>
            <p className={styles.p}>
              A common pricing mistake is applying your markup solely to the factory invoice price. To protect your bottom line, markup must be calculated against your total <strong>Landed Cost</strong>:
            </p>
            <ol className={styles.p}>
              <li><strong>Cost of Goods Sold (COGS):</strong> The raw manufacturing or wholesale purchase price.</li>
              <li><strong>Inbound Freight &amp; Shipping:</strong> Port-to-warehouse or factory-to-door carrier delivery fees.</li>
              <li><strong>Customs, Tariffs &amp; Duties:</strong> Non-refundable border duties on imported inventory.</li>
              <li><strong>Packaging &amp; Prep:</strong> Hangtags, branded poly mailers, protective bubble wrap, and barcode labels.</li>
              <li><strong>Platform &amp; Payment Processing Fees:</strong> Card processing fees and marketplace selling fees, usually charged as a percentage of the selling price (check your own provider&rsquo;s current fee schedule).</li>
            </ol>
            <p className={styles.p}>
              When selling through platforms that charge a percentage of the customer ticket price, use the fee-adjusted pricing formula:
            </p>
            <div className={styles.formulaHighlight}>
              Fee-Adjusted Price = (Landed Cost × (1 + Markup % ÷ 100)) ÷ (1 − Platform Fee % ÷ 100)
            </div>
            <p className={styles.p}>
              If your landed cost is {formatCurrency(40)}, desired markup is 50%, and the sales channel charges a 10% fee on revenue, setting your price at <strong>{formatCurrency(exFeePrice)}</strong> ensures you pocket exactly $20 profit after the channel deducts its cut.
            </p>
          </section>

          {/* Section 6 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Wholesale vs Retail Price (Retail Math Chain)</h2>
            <p className={styles.p}>
              Products rarely travel straight from maker to end-consumer. Each intermediary in the distribution network requires an operating margin to sustain their business:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Distribution Stage</th>
                    <th>Acquisition Cost</th>
                    <th>Applied Markup</th>
                    <th>Outbound Price</th>
                    <th>Gross Margin %</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>1. Manufacturer / Factory</strong></td>
                    <td>$10.00 (Production)</td>
                    <td>100% Markup</td>
                    <td>$20.00 (Factory Sale)</td>
                    <td>50.00%</td>
                  </tr>
                  <tr>
                    <td><strong>2. Wholesaler / Distributor</strong></td>
                    <td>$20.00 (Purchase)</td>
                    <td>50% Wholesale Markup</td>
                    <td>$30.00 (Wholesale Price)</td>
                    <td>33.33%</td>
                  </tr>
                  <tr>
                    <td><strong>3. Retail Store (MSRP)</strong></td>
                    <td>$30.00 (Wholesale In)</td>
                    <td>100% Keystone Markup</td>
                    <td>$60.00 (Consumer Price)</td>
                    <td>50.00%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.p}>
              Notice how the retail price of $60 is <strong>6.0×</strong> the original factory production cost of $10. Markups compound exponentially across supply chains because each stakeholder prices goods relative to their own acquisition cost.
            </p>
          </section>

          {/* Section 7 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>What is Retail Price and Selling Price?</h2>
            <p className={styles.p}>
              In commercial transactions, several terms are frequently used to describe pricing structures:
            </p>
            <ul className={styles.p}>
              <li>
                <strong>Retail Price:</strong> The final transaction price paid by the individual consumer for personal use. It is established to absorb wholesale purchasing expenses, operating overhead, and retail profit.
              </li>
              <li>
                <strong>Selling Price:</strong> The actual contracted exchange price between any buyer and seller. A manufacturer&apos;s selling price is the wholesaler&apos;s cost price.
              </li>
              <li>
                <strong>Manufacturer&apos;s Suggested Retail Price (MSRP):</strong> The standard recommended consumer price recommended by a brand manufacturer to standardize market pricing across competing retail storefronts.
              </li>
              <li>
                <strong>Average Pricing:</strong> The weighted average price at which an item sells across multiple sales channels or seasonal discount cycles.
              </li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Markup and VAT, GST, or Sales Tax</h2>
            <p className={styles.p}>
              Taxes belong to government authorities and must never be treated as revenue or product cost. Markup must always be applied to the <strong>net (ex-tax) cost</strong> to establish the <strong>net (ex-tax) selling price</strong>:
            </p>
            <div className={styles.callout}>
              <div className={styles.calloutTitle}>Official Tax Authority Treatment</div>
              <p>
                In the United Kingdom, HM Revenue &amp; Customs (HMRC) specifies that standard VAT (20%) is appended to the taxable turnover amount (<a href="https://www.gov.uk/vat-rates" target="_blank" rel="noopener noreferrer">gov.uk</a>). Similarly, the Australian Taxation Office (<a href="https://www.ato.gov.au/business/gst/" target="_blank" rel="noopener noreferrer">ato.gov.au</a>) and New Zealand Inland Revenue (<a href="https://www.ird.govt.nz/gst" target="_blank" rel="noopener noreferrer">ird.govt.nz</a>) assess 10% and 15% GST respectively on the final taxable supply.
              </p>
            </div>
            <p className={styles.p}>
              If a product costs $50 ex-tax and you want a 50% markup, your ex-tax selling price is $75 ($25 gross profit). If your local jurisdiction requires a 20% VAT or sales tax, the consumer pays <code>$75 × 1.20 = $90</code> at the checkout register. You remit the $15 tax to the revenue department and retain $75 ($25 profit). Never compute markup on the $90 figure.
            </p>
          </section>

          {/* Section 9 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Price Endings like $9.99 and What They Do to Your Margin</h2>
            <p className={styles.p}>
              Many sellers adjust a calculated price to a familiar ending, such as <code>.99</code>, <code>.95</code>, or whole round numbers.
            </p>
            <p className={styles.p}>
              Whenever you adjust a calculated price from $59.20 to $59.99, your realized profit increases from $19.20 to $19.99, bumping your effective markup from 48.0% to 49.98%. Conversely, rounding down from $60.10 to $59.95 slightly trims margin. Our calculator automatically recomputes the true resulting markup and gross margin percentages whenever a price ending is selected.
            </p>
          </section>

          {/* Section 10 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Common Markup Mistakes to Avoid</h2>
            <ul className={styles.p}>
              <li>
                <strong>Applying markup to tax-inclusive amounts:</strong> Adding markup to tax artificially inflates prices and creates accounting reconciliation errors.
              </li>
              <li>
                <strong>Targeting margin but using markup formulas:</strong> Setting a 30% markup when your business requires a 30% gross profit margin leaves you with only a 23.08% margin, creating an operating deficit.
              </li>
              <li>
                <strong>Ignoring payment processor and marketplace take-rates:</strong> Payment gateway fees charged against gross transaction volume eat directly into net margin unless accounted for during initial pricing.
              </li>
              <li>
                <strong>Failing to account for shrinkage and customer returns:</strong> Every retail operation experiences minor freight damages, returns, or spoilage. Build a realistic waste buffer into your landed cost basis.
              </li>
            </ul>
          </section>

          {/* Section 11: FAQ */}
          <section className={styles.section} id="faq">
            <h2 className={styles.h2}>Frequently Asked Questions About Markup &amp; Pricing</h2>
            {faqs.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <h3 className={styles.faqQ}>{faq.q}</h3>
                <p className={styles.faqA}>{faq.a}</p>
              </div>
            ))}
          </section>

          {/* Related Tools Navigation */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Explore Related Business &amp; Construction Calculators</h2>
            <p className={styles.p}>
              Complement your pricing strategy with our other verified calculators:
            </p>
            <div className={styles.internalLinks}>
              <Link href={ROUTES.discountCalculator.path} className={styles.pillLink}>
                Discount Calculator (Percent Off &amp; Sale Price)
              </Link>
              <Link href={ROUTES.unitPriceCalculator.path} className={styles.pillLink}>
                Unit Price Calculator (Price per Ounce &amp; Unit Cost)
              </Link>
              <Link href={ROUTES.profitMarginCalculator.path} className={styles.pillLink}>
                Profit Margin Calculator (Gross &amp; Net)
              </Link>
              <Link href={ROUTES.percentageChangeCalculator.path} className={styles.pillLink}>
                Percentage Change Calculator
              </Link>
              <Link href={ROUTES.constructionEstimateTemplate.path} className={styles.pillLink}>
                Construction Estimate Template (Contractor Markup)
              </Link>
              <Link href={ROUTES.tools.path} className={styles.pillLink}>
                All Free Tools
              </Link>
            </div>
          </section>

          {/* How We Calculate Section */}
          <HowWeCalculate slug="markup-calculator" />
        </article>

        <AdSlot slotId="after-content" />
      </main>
    </>
  );
}
