import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import { UnitPriceCalculator } from '@/components/tool/unit-price-calculator';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  compareUnitPrices,
  calculateShrinkflation,
  calculateSellerUnitCost,
} from '@/lib/unit-price-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.unitPriceCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

// Dynamic engine computations for factual accuracy across editorial copy
const exCoffeeCompare = compareUnitPrices([
  { id: 'a', label: 'Option A (12 oz)', price: 8.99, sizePerItem: 12, unit: 'oz' },
  { id: 'b', label: 'Option B (32 oz)', price: 18.49, sizePerItem: 32, unit: 'oz' },
  { id: 'c', label: 'Option C (2-pack 16 oz)', price: 17.99, packCount: 2, sizePerItem: 16, unit: 'oz' },
]);

const exSodaCompare = compareUnitPrices(
  [
    { id: 'cans', label: '6-pack (330 ml cans)', price: 4.5, packCount: 6, sizePerItem: 330, unit: 'ml' },
    { id: 'bottle', label: '2 Liter Bottle', price: 2.1, packCount: 1, sizePerItem: 2, unit: 'l' },
  ],
  'l'
);

const exBulkTrap = compareUnitPrices([
  { id: 'small', label: 'Standard Jar (16 oz)', price: 2.49, sizePerItem: 16, unit: 'oz' },
  { id: 'bulk', label: 'Club-Size Tub (48 oz)', price: 8.49, sizePerItem: 48, unit: 'oz' },
]);

const exShrink = calculateShrinkflation({
  oldPrice: 4.99,
  oldSize: 16,
  newPrice: 4.99,
  newSize: 14.2,
  unitLabel: 'oz',
});

const exSeller = calculateSellerUnitCost({
  batchTotalCost: 240,
  unitsProduced: 80,
  packageSize: 250,
  packageUnit: 'g',
});

const faqs = [
  {
    q: 'How do you calculate unit price?',
    a: 'To calculate unit price, divide the total item price by the total quantity or volume: Unit Price = Price ÷ Quantity. For example, if a 24-ounce box of cereal costs $4.80, the unit price is $4.80 ÷ 24 oz = $0.20 per ounce. When comparing two items, convert them to the same base measurement first so you compare identical units.',
  },
  {
    q: 'How do I calculate price per ounce?',
    a: 'To calculate price per ounce (oz), divide the total price by the weight in ounces: Price per Oz = Total Price ÷ Ounces. For example, a 12-ounce bag of gourmet coffee priced at $8.99 has a unit price of $8.99 ÷ 12 oz = $0.7492 per ounce ($0.75/oz). If the package is labeled in pounds, multiply pounds by 16 to get ounces before dividing (e.g. 2 lb = 32 oz).',
  },
  {
    q: 'Is the bigger size always cheaper per unit?',
    a: 'No. Retailers frequently leverage the "bulk assumption" that shoppers believe larger containers are automatically cheaper. Promotional discounts on standard sizes, package manufacturing variations, or higher wholesale demand for club sizes can make the larger pack more expensive per unit. For example, three standard 16 oz jars at $2.49 ($0.1556/oz) cost $7.47 for 48 oz, whereas a single 48 oz "value tub" priced at $8.49 costs $0.1769/oz—13.7% more per ounce.',
  },
  {
    q: 'How do I compare a multi-pack with a single big bottle?',
    a: 'Multiply the individual container size by the number of units in the multi-pack to determine its total volume, then divide total price by total volume. For example, a 6-pack of 330 ml cans provides 1,980 ml (1.98 L). At $4.50, that equals $2.27 per liter. A 2-liter bottle at $2.10 equals $1.05 per liter, making the single large bottle 53.8% cheaper per liter than the canned multi-pack.',
  },
  {
    q: 'How do I compare products sold in grams and ounces?',
    a: 'Convert both quantities into the exact same unit using the international standard conversion factor: 1 avoirdupois ounce = 28.349523125 grams (or 1 pound = 453.59237 grams). If Product A costs $5.00 for 14 oz (396.89 g) and Product B costs $6.00 for 400 g, Product A costs $0.0126/g while Product B costs $0.0150/g. Product A is approximately 16% cheaper per gram.',
  },
  {
    q: 'Are fluid ounces and ounces the same thing?',
    a: 'No. An ounce (oz) is a measure of weight (mass), while a fluid ounce (fl oz) is a measure of liquid volume. In US customary measurement, 1 fluid ounce equals 29.5735 milliliters, while 1 ounce of weight equals 28.3495 grams. Unless the product has the exact physical density of pure water at 4°C, 16 fl oz will not weigh 16 oz. Never compare an ounce price directly against a fluid ounce price.',
  },
  {
    q: 'How do coupons, BOGO deals, and sales change the unit price?',
    a: 'Sales promotions reduce the effective total price paid. In a "Buy One, Get One Free" (BOGO) promotion, you receive two items for the price of one, which cuts your effective price per unit in half (50% discount). A "3 for $5" multi-buy deal gives an effective unit cost of $1.67 per item regardless of individual list price.',
  },
  {
    q: 'What is shrinkflation and how can I spot it?',
    a: 'Shrinkflation occurs when a manufacturer reduces the physical quantity or net weight of a product while keeping the retail price unchanged (or slightly higher). Because the shelf price looks identical, consumers perceive no inflation. To spot it, compare unit price (price per ounce or gram). If a 16 oz box shrinks to 14.2 oz at an unchanged $4.99, the unit price increases from $0.3119/oz to $0.3514/oz—an effective 12.68% hidden price rise.',
  },
  {
    q: 'How do I work out cost per unit for my products?',
    a: 'To work out cost per unit as a maker or seller, divide the total production batch cost by the number of finished sellable units produced: Cost per Unit = Batch Total Production Cost ÷ Units Produced. For instance, a batch of handcrafted candles costing $240 in raw wax, fragrance, wicks, and vessels that yields 80 candles has a unit manufacturing cost of $240 ÷ 80 = $3.00 per unit.',
  },
  {
    q: 'Why do stores show a unit price on the shelf tag?',
    a: 'Retail shelf-tag unit pricing is required by consumer protection regulations in many jurisdictions (such as the UK Price Marking Order 2004, EU Directive 98/6/EC, and state-level laws following NIST Handbook 130 in the US). It allows consumers to compare competing brands and package sizes on an objective, apples-to-apples basis per ounce, pound, kilogram, or liter without doing mental math.',
  },
];

export default function UnitPriceCalculatorPage() {
  const breadcrumbItems = [
    { name: 'Home', path: ROUTES.home.path },
    { name: 'Tools', path: ROUTES.tools.path },
    { name: 'Unit Price Calculator', path: route.path },
  ];

  const webAppSchema = buildWebApplicationSchema({
    name: 'Unit Price Calculator',
    description: route.description,
    path: route.path,
    applicationCategory: 'BusinessApplication',
  });

  const faqSchema = buildFaqSchema(faqs);

  const bestCoffee = exCoffeeCompare.cheapestItem;
  const bestOptionA = exCoffeeCompare.items.find((i) => i.id === 'a');

  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={faqSchema} />

      <main className={styles.main}>
        <Breadcrumbs items={breadcrumbItems} />

      <header className={styles.header}>
        <h1 className={styles.h1}>Unit Price Calculator: Compare Price per Ounce, Pound or Unit</h1>
        <p className={styles.lead}>
          Compare 2 to 6 product sizes side-by-side by price per ounce, pound, gram, liter, or
          individual item. Apply coupons, BOGO deals, detect shrinkflation, and find the true best
          value on grocery and retail shelves.
        </p>
        <div className={styles.meta}>
          <span>Published: 2026-11-18</span> • <span>Standard: NIST Handbook 130 &amp; SP 811</span>
        </div>
      </header>

      {/* BLUF Summary Box */}
      <aside className={styles.blufBox}>
        <strong>Bottom Line Up Front (BLUF):</strong> Unit price equals total retail price divided by
        total net quantity (<code>Unit Price = Price ÷ Quantity</code>). When comparing different
        package sizes or multi-packs, always convert quantities into a uniform unit of measure (such
        as price per ounce, pound, or kilogram). For example, a 12 oz bag of coffee priced at $8.99
        costs <strong>${bestOptionA?.unitPrice.toFixed(4)}/oz</strong>, whereas a twin-pack of 16 oz
        bags (32 oz total) at $17.99 costs <strong>${bestCoffee?.unitPrice.toFixed(4)}/oz</strong>
        —saving you <strong>${bestOptionA ? (bestOptionA.unitPrice - (bestCoffee?.unitPrice || 0)).toFixed(4) : '0.19'}/oz</strong>{' '}
        (a <strong>{bestOptionA?.percentMoreThanCheapest.toFixed(1)}% premium</strong> on the smaller bag).
      </aside>

      {/* Interactive Calculator Component */}
      <section className={styles.toolSection}>
        <UnitPriceCalculator />
      </section>

      {/* Editorial Content */}
      <article className={styles.article}>
        {/* Section 1: How to use */}
        <section className={styles.section}>
          <h2 className={styles.h2}>How to Use the Unit Price Calculator</h2>
          <p className={styles.p}>
            Grocery stores and online retailers display products in wildly differing package sizes,
            multi-pack bundles, and metric or imperial units. Our unit price comparison tool standardizes
            every option into an objective cost-per-unit metric:
          </p>
          <ol className={styles.p} style={{ paddingLeft: '24px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Select your active calculation mode:</strong> Choose <em>Compare Products</em>{' '}
              to evaluate 2 to 6 package sizes, <em>Shrinkflation Check</em> to analyze package
              downsizing, or <em>Seller: Cost &amp; Shelf Tag</em> to establish unit manufacturing costs
              and statutory shelf prices.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Input price and net contents:</strong> Enter the price paid, pack count (e.g. 6 for
              a 6-pack), package size per item, and measurement unit (ounces, pounds, grams, kilograms,
              fluid ounces, quarts, gallons, liters, sheets, or rolls).
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Factor in promotions:</strong> Expand the deal toggle on any item to incorporate
              percentage discounts (e.g., 20% off), dollar coupons ($1.50 off), BOGO promotions
              (&ldquo;Buy 1 Get 1 Free&rdquo;), or multi-buy bundle prices (&ldquo;3 for $5&rdquo;).
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Review the ranked results:</strong> Review the interactive comparison chart and
              ranked breakdown table. The calculator highlights the top-value item with an emerald badge
              and displays exact dollar savings and percentage premiums for every other option.
            </li>
          </ol>
        </section>

        {/* Section 2: How to calculate price per unit */}
        <section className={styles.section}>
          <h2 className={styles.h2}>How to Calculate Price per Unit (Formulas &amp; Examples)</h2>
          <p className={styles.p}>
            The fundamental mathematical formula for determining unit cost is straightforward:
          </p>
          <div className={styles.formulaBox}>
            Unit Price = Total Effective Price ÷ Total Net Standardized Quantity
            <br />
            Total Quantity = Pack Count × Size per Item × Metric/Imperial Conversion Factor
          </div>
          <p className={styles.p}>
            Here are three common shopping scenarios calculated using verified engine mathematics:
          </p>

          <h3 className={styles.h3}>Example 1: Single Containers (Price per Ounce)</h3>
          <p className={styles.p}>
            A 12 oz jar of peanut butter costs $3.49, while a 28 oz jar of the same brand costs $6.99:
          </p>
          <ul className={styles.p} style={{ paddingLeft: '24px' }}>
            <li>
              <strong>12 oz Jar:</strong> $3.49 ÷ 12 oz = <strong>$0.2908 per oz</strong>
            </li>
            <li>
              <strong>28 oz Jar:</strong> $6.99 ÷ 28 oz = <strong>$0.2496 per oz</strong>
            </li>
            <li>
              <strong>Verdict:</strong> The 28 oz jar saves $0.0412 per ounce (16.5% cheaper per ounce).
            </li>
          </ul>

          <h3 className={styles.h3}>Example 2: Canned Multi-Pack vs Large Beverage Bottle</h3>
          <p className={styles.p}>
            Shoppers frequently debate whether to purchase individual soda cans in multi-packs or a
            single large plastic bottle. Consider a 6-pack of 330 ml cans for $4.50 versus a 2-liter
            bottle for $2.10:
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Packaging Format</th>
                  <th>List Price</th>
                  <th>Total Milliliters</th>
                  <th>Price per Liter</th>
                  <th>Relative Difference</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>6-pack (330 ml cans)</strong></td>
                  <td>$4.50</td>
                  <td>1,980 ml (1.98 L)</td>
                  <td>${exSodaCompare.items[1].unitPrice.toFixed(4)}/L</td>
                  <td>+116.5% more expensive</td>
                </tr>
                <tr style={{ background: '#f0fdf4' }}>
                  <td><strong>2 Liter Bottle (1 bottle)</strong></td>
                  <td>$2.10</td>
                  <td>2,000 ml (2.00 L)</td>
                  <td>${exSodaCompare.items[0].unitPrice.toFixed(4)}/L</td>
                  <td><strong>Best Deal (53.8% savings)</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className={styles.h3}>Example 3: Bulk Weight Comparison (Pounds vs Ounces)</h3>
          <p className={styles.p}>
            A butcher sells chicken breast in a 1.5 lb tray for $5.99, while the club-pack warehouse
            offers a 6 lb family pack for $20.94:
          </p>
          <ul className={styles.p} style={{ paddingLeft: '24px' }}>
            <li>
              <strong>1.5 lb tray:</strong> $5.99 ÷ 1.5 lb = <strong>$3.9933 per lb</strong> ($0.2496/oz)
            </li>
            <li>
              <strong>6.0 lb family pack:</strong> $20.94 ÷ 6.0 lb = <strong>$3.4900 per lb</strong> ($0.2181/oz)
            </li>
            <li>
              <strong>Verdict:</strong> The family pack saves $0.5033 per pound (12.6% cheaper).
            </li>
          </ul>
        </section>

        {/* Section 3: Conversion Table & NIST Standards */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Price per Ounce, Pound and 100 g: Exact Conversion Constants</h2>
          <p className={styles.p}>
            To compare products accurately across international boundaries or varying packaging units,
            our engine applies exact conversion definitions established by the{' '}
            <strong>National Institute of Standards and Technology (NIST SP 811 / Handbook 130)</strong>:
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Measurement Group</th>
                  <th>Standard Unit</th>
                  <th>Exact International Metric Equivalent</th>
                  <th>Base Units per Standard</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Weight</td>
                  <td>1 Avoirdupois Ounce (oz)</td>
                  <td>28.349 523 125 grams</td>
                  <td>0.0625 lb</td>
                </tr>
                <tr>
                  <td>Weight</td>
                  <td>1 Avoirdupois Pound (lb)</td>
                  <td>453.592 37 grams</td>
                  <td>16.0 oz</td>
                </tr>
                <tr>
                  <td>Weight</td>
                  <td>1 Kilogram (kg)</td>
                  <td>1,000.0 grams</td>
                  <td>2.204 622 62 lb / 35.274 oz</td>
                </tr>
                <tr>
                  <td>Liquid Volume</td>
                  <td>1 US Fluid Ounce (fl oz)</td>
                  <td>29.573 529 562 5 milliliters</td>
                  <td>0.125 US cup</td>
                </tr>
                <tr>
                  <td>Liquid Volume</td>
                  <td>1 US Liquid Gallon (gal)</td>
                  <td>3,785.411 784 milliliters (3.785 L)</td>
                  <td>128.0 fl oz / 4.0 qt</td>
                </tr>
                <tr>
                  <td>Liquid Volume</td>
                  <td>1 Liter (L)</td>
                  <td>1,000.0 milliliters</td>
                  <td>33.814 022 7 US fl oz</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.callout}>
            <div className={styles.calloutTitle}>⚠️ The Common Trap: Ounces (Weight) vs Fluid Ounces (Volume)</div>
            <p className={styles.p} style={{ margin: 0 }}>
              Never compare a price per ounce (oz) against a price per fluid ounce (fl oz). An ounce
              measures mass (weight), while a fluid ounce measures liquid capacity (volume). Unless a
              liquid has the exact specific gravity of pure water at 4°C (1 g/ml), 16 fluid ounces will
              not weigh 16 ounces. For example, honey weighs approximately 1.42 grams per milliliter,
              meaning a 12 fl oz jar holds roughly 17 ounces of weight!
            </p>
          </div>
        </section>

        {/* Section 4: When bigger isn't cheaper */}
        <section className={styles.section}>
          <h2 className={styles.h2}>When the Bigger Pack Isn&rsquo;t Cheaper (The Bulk Trap)</h2>
          <p className={styles.p}>
            Many shoppers assume the larger pack is always the better deal, but that is not guaranteed.
            Sometimes a bulk or &ldquo;family size&rdquo; pack costs more per ounce than the standard size,
            so it is worth checking the unit price every time.
          </p>
          <p className={styles.p}>
            Here is an illustrative example (example prices, not a real store) for salsa:
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Retail Price</th>
                  <th>Net Weight</th>
                  <th>Unit Price per Oz</th>
                  <th>Outcome</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: '#f0fdf4' }}>
                  <td><strong>Standard Jar</strong></td>
                  <td>$2.49</td>
                  <td>16 oz</td>
                  <td>${exBulkTrap.items[0].unitPrice.toFixed(4)}/oz</td>
                  <td><strong>Cheapest Option (12.1% lower unit cost)</strong></td>
                </tr>
                <tr>
                  <td><strong>Club-Size Value Tub</strong></td>
                  <td>$8.49</td>
                  <td>48 oz</td>
                  <td>${exBulkTrap.items[1].unitPrice.toFixed(4)}/oz</td>
                  <td>+13.7% more expensive per ounce!</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={styles.p}>
            Buying three 16 oz jars yields 48 oz for <strong>$7.47</strong> (3 × $2.49), saving{' '}
            <strong>$1.02</strong> compared to the $8.49 bulk tub. Always calculate unit price rather
            than trusting package size labels.
          </p>
        </section>

        {/* Section 5: Coupons & Multi-Buy Deals */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Coupons, Sales Promotions and Multi-Buy Deals (BOGO Math)</h2>
          <p className={styles.p}>
            Retail promotions alter the effective transaction price. Here is how standard marketing
            deals mathematically impact your unit price:
          </p>
          <ul className={styles.p} style={{ paddingLeft: '24px' }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>Buy One, Get One Free (BOGO):</strong> In a true BOGO promotion, you receive two
              identical packages for the price of one. The effective unit price is halved (a 50%
              reduction). For example, two 32 oz detergent jugs priced at $11.99 BOGO result in an
              effective unit price of $5.995 per jug ($0.1873/oz instead of $0.3747/oz).
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Buy One, Get One 50% Off (BOGO 50%):</strong> You purchase two items: one at full
              price and the second at half price. Your total outlay is 1.5× the single unit price,
              yielding an effective 25% discount per unit across the two items.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Multi-Buy Bundles (&ldquo;3 for $5.00&rdquo;):</strong> When an individual item
              normally costs $1.99, a 3-for-$5 promotion establishes an effective unit price of $1.6667
              per item, saving $0.3233 per unit (16.2% discount), provided you purchase the full bundle
              quantity.
            </li>
          </ul>
        </section>

        {/* Section 6: Shelf Tags (US vs UK/EU) */}
        <section className={styles.section}>
          <h2 className={styles.h2}>How to Read Unit Prices on Retail Shelf Tags</h2>
          <p className={styles.p}>
            Most developed economies legally mandate standardized unit pricing to protect consumers:
          </p>
          <ul className={styles.p} style={{ paddingLeft: '24px' }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>United States:</strong> Unit pricing laws are enacted at state level, primarily
              adopting the guidelines of <em>NIST Handbook 130 (Uniform Unit Pricing Regulation)</em>.
              Shelf tags display the total retail price in large type, with the unit price printed in a
              smaller colored border box (typically per pound, per ounce, or per 100 count for paper
              goods).
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>United Kingdom:</strong> Under the <em>Price Marking Order 2004 (SI 2004/102)</em>,
              traders selling to consumers must indicate both the selling price and the unit price
              (usually expressed per kilogram or per liter, or per 100 grams / 100 ml for smaller
              specialty goods).
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>European Union:</strong> Governed by <em>Directive 98/6/EC</em>, European retail
              shelf tags require clear indication of unit price per kilogram or liter to facilitate
              frictionless price transparency across member states.
            </li>
          </ul>
        </section>

        {/* Section 7: Shrinkflation */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Shrinkflation: Spotting and Calculating Hidden Price Rises</h2>
          <p className={styles.p}>
            Shrinkflation is a stealth pricing tactic where manufacturers reduce the net content of a
            package while preserving the existing retail price point. Because the shelf price remains
            unaltered, consumers rarely notice the reduction at checkout.
          </p>
          <div className={styles.formulaBox}>
            Hidden Unit Price Increase (%) = ((New Unit Price ÷ Old Unit Price) − 1) × 100
            <br />
            Physical Size Reduction (%) = ((New Size − Old Size) ÷ Old Size) × 100
          </div>
          <p className={styles.p}>
            Consider a typical breakfast cereal downsized from 16.0 oz to 14.2 oz while keeping the
            $4.99 price tag:
          </p>
          <ul className={styles.p} style={{ paddingLeft: '24px' }}>
            <li>
              <strong>Original Package:</strong> $4.99 ÷ 16.0 oz = <strong>${exShrink.oldUnitPrice.toFixed(4)} per oz</strong>
            </li>
            <li>
              <strong>Downsized Package:</strong> $4.99 ÷ 14.2 oz = <strong>${exShrink.newUnitPrice.toFixed(4)} per oz</strong>
            </li>
            <li>
              <strong>Physical Volume Drop:</strong> {exShrink.sizeChangePercent.toFixed(2)}%
            </li>
            <li>
              <strong>Effective Hidden Price Hike:</strong>{' '}
              <strong>+{exShrink.unitPriceIncreasePercent.toFixed(2)}% per ounce!</strong>
            </li>
          </ul>
          <p className={styles.p}>
            Notice an essential mathematical property: an 11.25% reduction in size causes a{' '}
            <strong>12.68% price hike per ounce</strong>. If a package shrinks by 10% (from 1.0 to 0.9),
            the unit price increases by <code>(1 ÷ 0.9) − 1 = +11.11%</code>.
          </p>
        </section>

        {/* Section 8: Cost per Unit for Sellers */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Cost per Unit for Sellers &amp; Statutory Shelf Tagging</h2>
          <p className={styles.p}>
            For small manufacturers, bakers, craft makers, and wholesalers, calculating accurate cost per
            unit is the foundation of profitable retail pricing:
          </p>
          <div className={styles.formulaBox}>
            Cost per Finished Unit = Total Batch Production Cost ÷ Units Produced
          </div>
          <p className={styles.p}>
            If you spend $240.00 producing a batch of 80 artisanal soap bars (each 250 g net weight):
          </p>
          <ul className={styles.p} style={{ paddingLeft: '24px' }}>
            <li>
              <strong>Manufacturing Cost per Bar:</strong> $240 ÷ 80 = <strong>${exSeller.costPerUnit.toFixed(2)}</strong>
            </li>
            <li>
              <strong>Cost per Kilogram (1,000 g):</strong> $3.00 ÷ 0.25 kg = <strong>${exSeller.shelfTagPerKgOrLiter?.toFixed(2)}/kg</strong>
            </li>
            <li>
              <strong>Cost per 100 Grams:</strong> $3.00 ÷ 2.5 = <strong>${exSeller.shelfTagPer100gOr100ml?.toFixed(2)}/100g</strong>
            </li>
          </ul>
          <p className={styles.p}>
            Once your base unit cost is calculated, you can establish wholesale and retail pricing with
            sustainable profit margins using our companion{' '}
            <Link href={`/markup-calculator/?cost=${exSeller.costPerUnit.toFixed(2)}`} className={styles.pillLink}>
              Markup Calculator
            </Link>.
          </p>
        </section>

        {/* Section 9: FAQ */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {faqs.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{faq.q}</h3>
                <p className={styles.faqAnswer}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 10: Related Tools */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Related Business &amp; Commercial Calculators</h2>
          <p className={styles.p}>
            Check our suite of verified commercial calculation tools for retail, inventory, and
            estimating:
          </p>
          <div className={styles.internalLinks}>
            <Link href={ROUTES.discountCalculator.path} className={styles.pillLink}>
              Discount Calculator (Percent Off &amp; Sale Price)
            </Link>
            <Link href={ROUTES.hourlyToSalaryCalculator.path} className={styles.pillLink}>
              Hourly to Salary Calculator (Yearly Wage &amp; Overtime)
            </Link>
            <Link href={ROUTES.markupCalculator.path} className={styles.pillLink}>
              Markup Calculator (Selling Price &amp; Markup %)
            </Link>
            <Link href={ROUTES.profitMarginCalculator.path} className={styles.pillLink}>
              Profit Margin Calculator (Gross &amp; Net)
            </Link>
            <Link href={ROUTES.percentageChangeCalculator.path} className={styles.pillLink}>
              Percentage Change Calculator
            </Link>
            <Link href={ROUTES.constructionEstimateTemplate.path} className={styles.pillLink}>
              Construction Estimate Template
            </Link>
            <Link href={ROUTES.tools.path} className={styles.pillLink}>
              All Free Online Tools
            </Link>
          </div>
        </section>

        <HowWeCalculate slug="unit-price-calculator" />
      </article>

      <AdSlot slotId="after-content" />
    </main>
    </>
  );
}
