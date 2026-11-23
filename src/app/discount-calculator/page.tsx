import React from 'react';
import type { Metadata } from 'next';
import { buildMetadata } from '@/components/seo/buildMetadata';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  calculateDiscount,
  reverseDiscount,
  calculateDeal,
  generateCommonPricesMatrix,
} from '@/lib/discount-engine';
import { DiscountCalculator } from '@/components/tool/discount-calculator';
import ToolShell from '@/components/tool/shared/ToolShell';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.discountCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

// Dynamic pre-computed examples from engine to prevent hardcoded drift
const ex100at20 = calculateDiscount({ originalPrice: 100, discountPercent: 20 });
const exStacked20and10 = calculateDiscount({ originalPrice: 100, discountPercent: 20, stackedDiscountPercent: 10 });
const exCouponPercentFirst = calculateDiscount({ originalPrice: 100, discountPercent: 20, couponAmount: 15, couponOrder: 'percent-first' });
const exCouponFirst = calculateDiscount({ originalPrice: 100, discountPercent: 20, couponAmount: 15, couponOrder: 'coupon-first' });
const exReverse80at20 = reverseDiscount({ mode: 'find-original', salePrice: 80, discountPercent: 20 });
const exFindPct120to90 = reverseDiscount({ mode: 'find-percent', originalPrice: 120, salePrice: 90 });
const exBogoFree = calculateDeal({ type: 'bogo-free', itemPrice: 40 });
const exBogo50 = calculateDeal({ type: 'bogo-percent', itemPrice: 60, secondItemDiscountPercent: 50 });
const exBuy2Get1 = calculateDeal({ type: 'buy-x-get-y', itemPrice: 30, buyQty: 2, getQty: 1 });
const ex30off50 = calculateDiscount({ originalPrice: 50, discountPercent: 30 });
const commonMatrix = generateCommonPricesMatrix();

const faqs = [
  {
    q: 'How do you calculate percent off and sale price?',
    a: `To calculate percent off, multiply the original price by the discount percentage expressed as a decimal, then subtract that amount from the original price: Sale Price = Original Price × (1 − Discount% ÷ 100). For example, a 20% discount on a $100 item saves $100 × 0.20 = $${ex100at20.totalSavings.toFixed(2)}, resulting in a final sale price of $${ex100at20.salePrice.toFixed(2)}.`,
  },
  {
    q: 'How do you find the original price before a discount?',
    a: `To find the original price before a discount was applied, divide the final sale price by (1 minus the discount percentage as a decimal): Original Price = Sale Price ÷ (1 − Discount% ÷ 100). For example, if you paid $${exReverse80at20.salePrice.toFixed(2)} after a 20% discount, the original price was $${exReverse80at20.salePrice.toFixed(2)} ÷ 0.80 = $${exReverse80at20.originalPrice.toFixed(2)}.`,
  },
  {
    q: 'How do you find the discount percentage from two prices?',
    a: `To determine the percentage discount between two prices, subtract the sale price from the original price, divide by the original price, and multiply by 100: Discount% = ((Original − Sale) ÷ Original) × 100. For instance, if an item marked down from $120 to $90 saves $30, the discount is ($30 ÷ $120) × 100 = ${exFindPct120to90.discountPercent.toFixed(2)}% off.`,
  },
  {
    q: 'How do stacked discounts work (e.g. 20% off plus an extra 10% off)?',
    a: `Stacked discounts compound sequentially rather than adding together. A 20% discount followed by an extra 10% discount on a $100 item does NOT equal 30% off ($70). Instead, the first 20% off reduces $100 to $80; the extra 10% off is then applied to the remaining $80, saving an additional $8.00. The final sale price is $${exStacked20and10.salePrice.toFixed(2)}, representing an effective ${exStacked20and10.effectiveDiscountPercent.toFixed(2)}% total discount.`,
  },
  {
    q: 'Is it better to apply a dollar coupon before or after a percentage discount?',
    a: `For shoppers, applying a percentage discount FIRST gives a lower total whenever the percentage discount exceeds the coupon fraction of the original price. For example, on a $100 item with 20% off and a $15 coupon: applying the 20% first drops the price to $80, and subtracting $15 gives $${exCouponPercentFirst.salePrice.toFixed(2)}. Applying the $15 coupon first reduces $100 to $85, and taking 20% off $85 gives $${exCouponFirst.salePrice.toFixed(2)} ($3.00 more expensive). Most retail POS systems automatically apply percentage store sales before manufacturer coupons.`,
  },
  {
    q: 'Is sales tax calculated before or after the discount?',
    a: `In almost all US states and Canadian provinces, state and local sales tax is calculated on the net discounted price paid by the customer for store-funded sales and retailer discounts. For example, on a $100 item discounted to $80 with an 8% sales tax, tax is $6.40 (total $86.40). However, if a manufacturer coupon is used where the retailer is reimbursed by the manufacturer, some state tax authorities (like California and New York) require sales tax to be assessed on the pre-coupon retail value.`,
  },
  {
    q: 'How do BOGO and 3-for-2 deals translate into real percentage discounts?',
    a: `Buy 1 Get 1 Free (BOGO) equals an exact 50.00% discount across 2 items ($${exBogoFree.pricePerUnit.toFixed(2)}/unit on a $${exBogoFree.totalOriginalCost / 2} item). Buy 1 Get 1 at 50% Off equals an effective ${exBogo50.effectiveDiscountPercent.toFixed(2)}% discount across both items ($${exBogo50.pricePerUnit.toFixed(2)}/unit on $60 items). Buy 2 Get 1 Free (3-for-2) yields a ${exBuy2Get1.effectiveDiscountPercent.toFixed(2)}% discount across all three units.`,
  },
  {
    q: 'How much is 30% off $50?',
    a: `30% off $50 is exactly $${ex30off50.salePrice.toFixed(2)}. To calculate it: 30% of $50 is $50 × 0.30 = $${ex30off50.totalSavings.toFixed(2)} in savings. Subtracting $${ex30off50.totalSavings.toFixed(2)} from $50 gives a final checkout price of $${ex30off50.salePrice.toFixed(2)}.`,
  },
  {
    q: 'Why does the percentage discount matter if I already know the dollar savings?',
    a: `The percentage discount reveals the proportional value of the deal relative to the investment. Saving $20 on a $40 shirt is a massive 50% discount, whereas saving $20 on a $2,000 refrigerator is a negligible 1% discount. Comparing percentages enables you to prioritize deals across different budget categories and spot genuine clearance bargains.`,
  },
  {
    q: 'How does offering a discount impact a business owner’s profit margin?',
    a: `Discounts erode profit margins much faster than top-line revenue because product costs (COGS) remain fixed. For example, if you sell an item for $100 that costs $60 to produce, your gross profit is $40 (40% margin). If you offer a 20% discount (sale price $80), your cost is still $60, leaving just $20 in profit—a 50% plunge in dollar earnings, dropping your profit margin to 25%.`,
  },
  {
    q: 'How do you calculate a discount in Excel or Google Sheets?',
    a: `In Excel or Google Sheets, if cell A2 contains the original price ($100) and cell B2 contains the discount percentage (20 or 20%), calculate the sale price using the formula =A2*(1-B2/100) (or =A2*(1-B2) if formatted as a percentage). To calculate total dollar savings, use =A2*(B2/100).`,
  },
];

export default function DiscountCalculatorPage() {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools/' },
    { name: 'Discount Calculator', path: route.path },
  ];

  const webAppSchema = buildWebApplicationSchema({
    name: 'Discount Calculator – Percent Off & Sale Price',
    path: route.path,
    description: route.description,
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
          <h1 className={styles.h1}>Discount Calculator: Percent Off, Sale Price &amp; Stacked Deals</h1>
          <p className={styles.subtitle}>
            Calculate your final sale price, dollar savings, and effective percentage off. Supports stacked clearance discounts, dollar coupons, sales tax, and retail promotions like BOGO and 3-for-2.
          </p>

          <div className={styles.blufBox}>
            <strong>Bottom Line Up Front:</strong> To calculate a discount, multiply the original price by the discount percentage divided by 100 to get your dollar savings, then subtract that amount from the original price: <code>Sale Price = Original Price × (1 − Discount% ÷ 100)</code>. For example, a 20% discount on a $100 item saves ${ex100at20.totalSavings.toFixed(2)}, leaving a final sale price of ${ex100at20.salePrice.toFixed(2)}. Use our interactive calculator below to stack promotional codes, deduct coupons, and calculate sales tax.
          </div>
        </header>

        {/* Primary Interactive Tool Component */}
        <ToolShell
          features={[
            'Single & stacked % off',
            'BOGO & bundle deals',
            'Coupons & sales tax',
            'Reverse original price',
          ]}
        >
          <DiscountCalculator />
        </ToolShell>

        {/* Rich SEO Content Guide */}
        <article className={styles.content}>
          {/* Section 1 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>How to Calculate a Discount (The Core Formula)</h2>
            <p className={styles.p}>
              Discount computation is one of the most practical everyday math skills in commerce. Whether you are shopping a seasonal clearance rack, verifying an invoice discount, or setting retail markdown promotions, calculating a discount requires two fundamental steps: finding the dollar amount deducted, and subtracting that deduction from the sticker price.
            </p>
            <div className={styles.formulaBox}>
              <strong>Step 1 (Savings in Dollars):</strong> Savings = Original Price × (Discount Percentage ÷ 100)
              <br />
              <strong>Step 2 (Sale Price):</strong> Sale Price = Original Price − Savings
              <br />
              <strong>Unified Equation:</strong> Sale Price = Original Price × (1 − Discount% ÷ 100)
            </div>
            <p className={styles.p}>
              For example, imagine a winter jacket with an original retail MSRP of $150.00 is discounted by 30%:
            </p>
            <ul style={{ paddingLeft: 20, margin: '12px 0 16px', lineHeight: 1.7, color: 'var(--ink-2)' }}>
              <li>Convert the percentage to a decimal: 30% ÷ 100 = 0.30.</li>
              <li>Multiply by original price: $150.00 × 0.30 = $45.00 saved.</li>
              <li>Subtract savings from original price: $150.00 − $45.00 = $105.00 final sale price.</li>
              <li>Or use the unified multiplier: $150.00 × (1 − 0.30) = $150.00 × 0.70 = $105.00.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>How to Find the Original Price Before a Discount (Reverse Mode)</h2>
            <p className={styles.p}>
              Frequently, shoppers find a clearance item where the tag only shows the discounted sale price and a banner stating &ldquo;Take 20% Off at Register,&rdquo; or an invoice lists only the discounted net cost. To find the original pre-discount sticker price, you reverse the equation:
            </p>
            <div className={styles.formulaBox}>
              <strong>Original Price Formula:</strong> Original Price = Sale Price ÷ (1 − Discount% ÷ 100)
            </div>
            <p className={styles.p}>
              <strong>Worked Example:</strong> If you paid ${exReverse80at20.salePrice.toFixed(2)} for a pair of running shoes during a 20% off flash sale:
            </p>
            <div className={styles.formulaBox}>
              Original Price = ${exReverse80at20.salePrice.toFixed(2)} ÷ (1 − 0.20) = ${exReverse80at20.salePrice.toFixed(2)} ÷ 0.80 = ${exReverse80at20.originalPrice.toFixed(2)}
            </div>
            <p className={styles.p}>
              You saved ${exReverse80at20.savingsDollars.toFixed(2)} off the original sticker price. Notice that you divide by 0.80 (the complement of the discount), never by 1.20. Dividing by 1.20 would incorrectly treat the discount as a markup.
            </p>
          </section>

          {/* Section 3 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Stacked Discounts Explained: Why 20% + 10% Does NOT Equal 30%</h2>
            <p className={styles.p}>
              A common misconception among shoppers is that stacking promotional codes results in additive discounts. If a department store offers 20% off storewide and gives loyalty members an additional 10% coupon, customers frequently expect a 30% discount. In reality, retail POS systems compound discounts sequentially:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Calculation Step</th>
                    <th>Base Amount</th>
                    <th>Discount Applied</th>
                    <th>Dollar Savings</th>
                    <th>Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Initial MSRP</td>
                    <td>$100.00</td>
                    <td>—</td>
                    <td>—</td>
                    <td>$100.00</td>
                  </tr>
                  <tr>
                    <td>1st Discount (Storewide 20%)</td>
                    <td>$100.00</td>
                    <td>20% of $100.00</td>
                    <td>$20.00</td>
                    <td>$80.00</td>
                  </tr>
                  <tr>
                    <td>2nd Discount (Loyalty 10%)</td>
                    <td>$80.00</td>
                    <td>10% of $80.00</td>
                    <td>$8.00</td>
                    <td><strong>${exStacked20and10.salePrice.toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.p}>
              Because the second 10% discount applies only to the remaining $80.00 rather than the original $100.00, it saves $8.00 instead of $10.00. The combined savings is $28.00, resulting in an effective total discount of <strong>{exStacked20and10.effectiveDiscountPercent.toFixed(1)}%</strong>, not 30.0%.
            </p>
            <div className={styles.formulaBox}>
              <strong>Compound Discount Formula:</strong> Effective Discount% = [1 − (1 − d₁) × (1 − d₂)] × 100
              <br />
              = [1 − (1 − 0.20) × (1 − 0.10)] × 100 = [1 − (0.80 × 0.90)] × 100 = [1 − 0.72] × 100 = <strong>28.0%</strong>
            </div>
          </section>

          {/* Section 4 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Percent Off vs Fixed Dollar Coupon: Which Order Is Best?</h2>
            <p className={styles.p}>
              When you have both a percentage discount (e.g., 20% off) and a flat dollar coupon (e.g., $15 off), the sequence in which they are deducted impacts your final checkout price:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Sequence</th>
                    <th>Step 1</th>
                    <th>Step 2</th>
                    <th>Final Sale Price</th>
                    <th>Total Saved</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Percent Discount First</strong></td>
                    <td>$100 − 20% = $80.00</td>
                    <td>$80.00 − $15 coupon = <strong>${exCouponPercentFirst.salePrice.toFixed(2)}</strong></td>
                    <td>${exCouponPercentFirst.salePrice.toFixed(2)}</td>
                    <td style={{ color: '#16a34a', fontWeight: 700 }}>$35.00 (Best for Shopper)</td>
                  </tr>
                  <tr>
                    <td><strong>Dollar Coupon First</strong></td>
                    <td>$100 − $15 coupon = $85.00</td>
                    <td>$85.00 − 20% = <strong>${exCouponFirst.salePrice.toFixed(2)}</strong></td>
                    <td>${exCouponFirst.salePrice.toFixed(2)}</td>
                    <td>$32.00 ($3.00 less saved)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.p}>
              Applying the percentage discount first maximizes your savings because the 20% applies to the larger $100 base ($20 saved). When the coupon is applied first, the 20% applies to a smaller $85 base ($17 saved).
            </p>
          </section>

          {/* Section 5 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Sales Tax and Discounts: When Is Tax Calculated?</h2>
            <p className={styles.p}>
              Sales tax regulations vary by jurisdiction, but in most US states and international sales tax systems, two standard principles dictate how taxes are assessed on discounted purchases:
            </p>
            <ul style={{ paddingLeft: 20, margin: '12px 0 16px', lineHeight: 1.7, color: 'var(--ink-2)' }}>
              <li>
                <strong>Store Discounts &amp; Retailer Markdown:</strong> Tax is assessed on the <em>net price actually paid</em>. If a $100 sweater is marked down 20% to $80 in an 8% sales tax jurisdiction, tax is $80 × 0.08 = $6.40, bringing the total register price to $86.40.
              </li>
              <li>
                <strong>Manufacturer Coupons:</strong> In states such as California, Texas, and New York, if the retailer is reimbursed by a third-party manufacturer for a coupon (e.g. Procter &amp; Gamble coupon clipped from a mailer), sales tax must be paid on the <em>full pre-coupon retail value</em>.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Retail Promotions Translated: BOGO, 3-for-2 &amp; Bundles</h2>
            <p className={styles.p}>
              Retailers use creative promotion names to encourage larger basket sizes. Here is how common marketing promos convert into genuine percentage savings per unit:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Promotion Offer</th>
                    <th>Effective % Off</th>
                    <th>Unit Cost Example ($40 Item)</th>
                    <th>Shopper Condition</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Buy 1, Get 1 Free (BOGO)</strong></td>
                    <td><strong>50.00% Off</strong></td>
                    <td>$20.00 / unit (Pay $40 for 2)</td>
                    <td>Must purchase exactly 2 units</td>
                  </tr>
                  <tr>
                    <td><strong>Buy 1, Get 1 at 50% Off</strong></td>
                    <td><strong>25.00% Off</strong></td>
                    <td>$30.00 / unit (Pay $60 for 2)</td>
                    <td>Cheaper item receives the 50% cut</td>
                  </tr>
                  <tr>
                    <td><strong>Buy 2, Get 1 Free (3-for-2)</strong></td>
                    <td><strong>33.33% Off</strong></td>
                    <td>$26.67 / unit (Pay $80 for 3)</td>
                    <td>Must purchase exactly 3 units</td>
                  </tr>
                  <tr>
                    <td><strong>Spend $100, Save $20</strong></td>
                    <td><strong>20.00% Off (at threshold)</strong></td>
                    <td>Decreases as cart total exceeds $100</td>
                    <td>Optimal savings right at $100 threshold</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 7 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>For Sellers: How Discounts Impact Your Gross Margin</h2>
            <p className={styles.p}>
              While discounts are powerful sales triggers for ecommerce and brick-and-mortar merchants, price cuts erode profits much faster than top-line revenue. Because cost of goods sold (COGS) remains static, every dollar discounted comes 100% out of net gross profit:
            </p>
            <div className={styles.formulaBox}>
              <strong>Margin After Discount:</strong> New Gross Margin% = [(Sale Price − Cost) ÷ Sale Price] × 100
            </div>
            <p className={styles.p}>
              Consider an item retailing for $100 that costs $60 to manufacture:
            </p>
            <ul style={{ paddingLeft: 20, margin: '12px 0 16px', lineHeight: 1.7, color: 'var(--ink-2)' }}>
              <li>At normal price: $100 revenue − $60 cost = $40 profit (<strong>40.0% gross margin</strong>).</li>
              <li>At 10% discount: $90 revenue − $60 cost = $30 profit (<strong>33.3% gross margin</strong>). Profit dropped 25%.</li>
              <li>At 20% discount: $80 revenue − $60 cost = $20 profit (<strong>25.0% gross margin</strong>). Profit was cut in half (50% drop).</li>
            </ul>
            <p className={styles.p}>
              To offset a 20% price cut on a 40% margin product, unit sales volume must surge by <strong>100%</strong> just to break even in total dollar profit! To plan profitable markups before discounting, use our <a href="/markup-calculator/" style={{ color: '#0284c7', fontWeight: 600 }}>Markup Calculator</a> and <a href="/profit-margin-calculator/" style={{ color: '#0284c7', fontWeight: 600 }}>Profit Margin Calculator</a>.
            </p>
          </section>

          {/* Section 8 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Common &ldquo;X% Off $Y&rdquo; Quick Reference Table</h2>
            <p className={styles.p}>
              Here is a quick reference table showing exact sale prices and dollar savings for common retail prices across standard markdown percentages:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Original MSRP</th>
                    <th>10% Off</th>
                    <th>20% Off</th>
                    <th>25% Off</th>
                    <th>30% Off</th>
                    <th>40% Off</th>
                    <th>50% Off</th>
                  </tr>
                </thead>
                <tbody>
                  {commonMatrix.slice(0, 8).map((row) => (
                    <tr key={row.price}>
                      <td style={{ fontWeight: 700, background: 'var(--surface-2, #f8fafc)' }}>${row.price.toFixed(2)}</td>
                      <td>${row.discounts[10].salePrice.toFixed(2)}</td>
                      <td>${row.discounts[20].salePrice.toFixed(2)}</td>
                      <td>${row.discounts[25].salePrice.toFixed(2)}</td>
                      <td>${row.discounts[30].salePrice.toFixed(2)}</td>
                      <td>${row.discounts[40].salePrice.toFixed(2)}</td>
                      <td style={{ fontWeight: 700, color: '#16a34a' }}>${row.discounts[50].salePrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.p}>
              For instance, if you are looking up <em>&ldquo;30 off of 50$&rdquo;</em>, locate $50.00 in the left column and trace across to the 30% Off column: you pay <strong>$35.00</strong> (saving $15.00).
            </p>
          </section>

          {/* Section 9 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>How to Calculate Discounts in Excel and Google Sheets</h2>
            <p className={styles.p}>
              You can quickly calculate discounts across hundreds of inventory rows in Microsoft Excel or Google Sheets using standard spreadsheet formulas:
            </p>
            <div className={styles.formulaBox}>
              <strong>Sale Price (if discount is whole number like 20):</strong>
              <br />
              <code>=A2*(1 - B2/100)</code>
              <br /><br />
              <strong>Sale Price (if cell B2 is formatted as percentage 20%):</strong>
              <br />
              <code>=A2*(1 - B2)</code>
              <br /><br />
              <strong>Dollar Amount Saved:</strong>
              <br />
              <code>=A2 * (B2/100)</code>
              <br /><br />
              <strong>Reverse Original Price from Sale Price:</strong>
              <br />
              <code>=A2 / (1 - B2/100)</code>
            </div>
          </section>

          {/* Section 10 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Common Discounting Mistakes to Avoid</h2>
            <ul style={{ paddingLeft: 20, margin: '12px 0 16px', lineHeight: 1.7, color: 'var(--ink-2)' }}>
              <li>
                <strong>Adding stacked discounts together:</strong> Assuming 25% + 15% = 40% off. As demonstrated above, stacked promos compound, giving 36.25% off.
              </li>
              <li>
                <strong>Dividing by (1 + d) instead of (1 − d) for reverse pricing:</strong> A 20% discount on $100 gives $80. To reverse, divide $80 by (1 − 0.20) = 0.80 ($100). Dividing by 1.20 gives $66.67, which is incorrect.
              </li>
              <li>
                <strong>Ignoring shipping and minimum basket thresholds:</strong> Spending $30 on extra items just to get a $10 discount or free shipping often costs more than the original delivery charge.
              </li>
              <li>
                <strong>Confusing price per unit with discount percentage:</strong> Multi-buy bundles (e.g. 3 for $10 vs $3.50 each) save only 50¢ per bundle (4.76% off), not 15%. Always verify unit pricing using our <a href="/unit-price-calculator/" style={{ color: '#0284c7', fontWeight: 600 }}>Unit Price Calculator</a>.
              </li>
            </ul>
          </section>

          {/* Section 11: FAQ */}
          <section className={styles.section} id="faq">
            <h2 className={styles.h2}>Frequently Asked Questions About Discounts &amp; Percent Off</h2>
            <div className={styles.faqList}>
              {faqs.map((faq, idx) => (
                <div key={idx} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{faq.q}</h3>
                  <div className={styles.faqAnswer}>
                    <p style={{ margin: 0 }}>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Related Tools */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Related Business &amp; Pricing Calculators</h2>
            <p className={styles.p}>
              Explore our connected suite of business math and pricing tools to optimize your margins, compare unit costs, and evaluate revenue:
            </p>
            <div className={styles.internalLinks}>
              <a href="/markup-calculator/" className={styles.pillLink}>
                Markup Calculator
              </a>
              <a href="/reverse-sales-tax-calculator/" className={styles.pillLink}>
                Reverse Sales Tax Calculator
              </a>
              <a href="/fraction-to-percent-calculator/" className={styles.pillLink}>
                Fraction to Percent Calculator
              </a>
              <a href="/profit-margin-calculator/" className={styles.pillLink}>
                Profit Margin Calculator
              </a>
              <a href="/unit-price-calculator/" className={styles.pillLink}>
                Unit Price Calculator
              </a>
              <a href="/percentage-change-calculator/" className={styles.pillLink}>
                Percentage Change Calculator
              </a>
              <a href="/hourly-to-salary-calculator/" className={styles.pillLink}>
                Hourly to Salary Calculator
              </a>
              <a href="/construction-estimate-template/" className={styles.pillLink}>
                Construction Estimate Template
              </a>
            </div>
          </section>

          <HowWeCalculate slug="discount-calculator" />
        </article>
      </main>
    </>
  );
}
