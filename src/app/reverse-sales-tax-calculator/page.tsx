import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import ToolShell from '@/components/tool/shared/ToolShell';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ReverseTaxCalculator from '@/components/tool/reverse-tax-calculator';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import AdSlot from '@/components/ads/AdSlot';
import { ROUTES } from '@/lib/routes';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.reverseSalesTaxCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const FAQ_ITEMS = [
  {
    q: 'How do I calculate the price before tax from the total paid?',
    a: 'To calculate the price before tax, divide the total tax-inclusive amount by 1 plus the decimal tax rate: Pre-Tax Price = Total Paid ÷ (1 + Tax Rate ÷ 100). For example, if you paid $107.25 with a 7.25% tax rate, calculate $107.25 ÷ 1.0725 = $100.00 before tax, meaning the sales tax was $7.25.',
  },
  {
    q: 'What is the reverse sales tax formula?',
    a: 'The reverse sales tax formula is: Pre-Tax Price = Total ÷ (1 + r), and Sales Tax Amount = Total − Pre-Tax Price, where r is the sales tax rate expressed as a decimal (e.g., 0.0725 for 7.25%).',
  },
  {
    q: 'Why can I not simply multiply the total by the tax rate and subtract it?',
    a: 'Multiplying the total by the tax rate calculates tax on the tax itself, yielding an incorrect, overly high tax amount and an artificially low pre-tax price. For example, 7.25% of $107.25 is $7.78, which would suggest a pre-tax price of $99.47. But adding 7.25% back to $99.47 only gives $106.68, not $107.25. Tax is charged exclusively on the original pre-tax base, so you must divide by (1 + rate).',
  },
  {
    q: 'How do I find the sales tax rate from two prices?',
    a: 'If you know the pre-tax price and the final total paid, find the tax rate by dividing total by pre-tax and subtracting 1: Tax Rate = (Total ÷ Pre-Tax − 1) × 100. For example, if an item was $100.00 before tax and $108.875 total, the tax rate was ($108.875 ÷ $100.00 − 1) × 100 = 8.875%.',
  },
  {
    q: 'How do I back out sales tax from a receipt with multiple items?',
    a: 'Calculate the pre-tax price for each item individually, especially if some items are taxed at different rates or are exempt (which items are exempt depends on where you buy). Then sum the pre-tax prices and the tax amounts. Individual rounding on each line may occasionally cause a one-cent variance compared to calculating tax on the receipt total.',
  },
  {
    q: 'How do I combine state, county, and city sales tax rates?',
    a: 'In the United States, sales tax rates are additive. To find your combined rate, add together the state statutory rate, the county rate, the municipal city rate, and any special district transit or school levies: Combined Rate = State + County + City + District. Look up your exact local rate on your state department of revenue website.',
  },
  {
    q: 'How do I remove VAT or GST from a gross price?',
    a: 'The mathematical formula for removing VAT (Value Added Tax) or GST (Goods and Services Tax) is identical to reverse sales tax: Net Price = Gross Price ÷ (1 + VAT Rate ÷ 100). For standard 20% VAT, a convenient shortcut is dividing the gross total by 6: 20% ÷ 120% = 1/6, so the VAT paid is exactly one-sixth of the total price.',
  },
  {
    q: 'How do I calculate reverse sales tax in Excel or Google Sheets?',
    a: 'If your total price is in cell B2 and your tax rate is in cell C2 (formatted as a percentage), use: =ROUND(B2 / (1 + C2), 2) for the pre-tax price, and =B2 - ROUND(B2 / (1 + C2), 2) for the exact sales tax amount.',
  },
  {
    q: 'Why is my calculated tax result sometimes off by one cent?',
    a: 'One-cent differences come from rounding. Some systems round the tax on each item and add the rounded amounts, while others add the pre-tax amounts first and round the tax once on the subtotal. The two methods can differ by a cent; your state’s rules say which one applies.',
  },
  {
    q: 'Is sales tax charged on delivery fees, shipping, or restaurant tips?',
    a: 'It depends on where you are: states and cities treat tips, service charges, shipping and delivery fees differently. Check your state revenue agency’s guidance, then mark each line as taxable or exempt in the Receipt tab.',
  },
];

export default function ReverseSalesTaxPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Reverse Sales Tax Calculator',
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
            { name: 'Reverse Sales Tax', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>Reverse Sales Tax Calculator: Find the Price Before Tax</h1>
          <p className={styles.subtitle}>
            Enter the total paid and the tax rate to get the price before tax and the tax amount, or work out the rate from two prices.
          </p>

          <div className={styles.bluf}>
            To remove sales tax, divide the total by 1 plus the tax rate. $107.25 with a 7.25% rate is $107.25 ÷ 1.0725 = $100.00 before tax, so the tax was $7.25. Don&apos;t subtract 7.25% of the total: that gives the wrong answer.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Price before tax',
              'Find the rate from two prices',
              'Receipt mode',
              'Sales tax, VAT or GST',
            ]}
          >
            <ReverseTaxCalculator />
          </ToolShell>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className={styles.contentSection}>
          <div className={styles.prose}>
            <h2>How to Use the Reverse Sales Tax Calculator</h2>
            <p>
              This calculator provides four comprehensive calculation modes to remove, determine, or check sales tax, VAT, or GST:
            </p>
            <ol>
              <li><strong>Price Before Tax:</strong> Enter your total tax-inclusive receipt or invoice amount along with your local tax percentage. The tool calculates the exact pre-tax price and sales tax paid, reconciling every cent so that the two components equal your total amount. You can also expand the optional rate builder to combine state, county, municipal, and district rates.</li>
              <li><strong>Find Tax Rate:</strong> Determine the hidden or unknown tax percentage by entering the pre-tax and total prices, or the tax amount paid and total price.</li>
              <li><strong>Multi-Item Receipt:</strong> Audit itemized receipts containing multiple purchases, custom line-item rates, or tax-exempt groceries and prescriptions.</li>
              <li><strong>Add Tax (Forward):</strong> Enter a pre-tax amount to compute standard forward sales tax and verify merchant invoices.</li>
            </ol>

            <AdSlot slotId="reverse-tax-ad-mid" format="horizontal" />

            <h2>Reverse Sales Tax Formula</h2>
            <p>
              When a sales tax rate is applied to a purchase, the merchant multiplies the original pre-tax price by the tax rate and adds the result to the pre-tax price:
            </p>
            <div className={styles.formulaBox}>
              Total Paid = Pre-Tax Price × (1 + Tax Rate)
            </div>
            <p>
              To work backwards and find the original price before tax, rearrange the equation by dividing both sides by <code>(1 + Tax Rate)</code>:
            </p>
            <div className={styles.formulaBox}>
              Pre-Tax Price = Total Paid ÷ (1 + Tax Rate)
            </div>
            <p>
              Once you have the pre-tax price, the sales tax amount is found by subtracting the pre-tax price from the total paid:
            </p>
            <div className={styles.formulaBox}>
              Sales Tax Amount = Total Paid − Pre-Tax Price
            </div>

            <h2>Why Subtracting the Tax Rate from the Total is Wrong</h2>
            <p>
              A common misconception when reversing sales tax is multiplying the final total by the tax rate and subtracting that figure. Doing so results in a mathematical error because sales tax is levied on the <em>pre-tax base</em>, not on the total tax-inclusive amount.
            </p>
            <p>
              Consider a worked example: an item costs <strong>$107.25</strong> total with a <strong>7.25%</strong> sales tax rate.
            </p>
            <ul>
              <li><strong>Incorrect Method:</strong> Multiplying $107.25 × 0.0725 gives $7.78. Subtracting $7.78 from $107.25 results in $99.47. If a store cashier adds 7.25% tax to $99.47, the tax is $7.21 and the total is $106.68—meaning you undercounted the true base price by 53 cents.</li>
              <li><strong>Correct Method:</strong> Dividing $107.25 ÷ 1.0725 gives exactly <strong>$100.00</strong>. Subtracting $100.00 from $107.25 yields <strong>$7.25</strong> in tax. When 7.25% is added back to $100.00, it equals $107.25 perfectly.</li>
            </ul>

            <h2>Finding the Tax Rate from Two Prices</h2>
            <p>
              If a receipt shows a pre-tax subtotal of $100.00 and a final total of $108.88 (or $108.875 before cent rounding), you can determine the effective tax rate using:
            </p>
            <div className={styles.formulaBox}>
              Tax Rate (%) = ((Total Paid ÷ Pre-Tax Price) − 1) × 100
            </div>
            <p>
              Applying this to the numbers: <code>($108.875 ÷ $100.00 − 1) × 100 = 8.875%</code>.
            </p>

            <h2>Combining State, County, and City Rates</h2>
            <p>
              In the United States, sales tax is rarely a single statewide rate. Instead, it is an aggregate levy comprising multiple governmental jurisdictions:
            </p>
            <ul>
              <li><strong>State Sales Tax:</strong> The statewide statutory base levy established by the legislature.</li>
              <li><strong>County Tax:</strong> Additional percentage enacted by the county commission.</li>
              <li><strong>City / Municipal Tax:</strong> Local tax levied by city or town government.</li>
              <li><strong>Special District Taxes:</strong> Dedicated taxes for regional transportation authorities, flood control, stadium funding, or emergency medical districts.</li>
            </ul>
            <p>
              Because sales tax rates change frequently and vary by street address within the same zip code, our calculator allows you to type and sum your exact components rather than relying on outdated static tables.
            </p>

            <h2>Receipts with Several Items or Tax-Exempt Purchases</h2>
            <p>
              Receipts frequently contain a combination of taxable goods, reduced-rate merchandise, and tax-exempt items. In many US states, unprepared groceries, prescription drugs, and certain clothing items are exempt from sales tax. When backing out taxes from a mixed purchase, calculate the pre-tax price for taxable items separately from exempt goods.
            </p>

            <h2>Reverse Tax for VAT and GST</h2>
            <p>
              In countries using Value Added Tax (VAT) or Goods and Services Tax (GST)—such as the United Kingdom, European Union member states, Canada, Australia, and New Zealand—consumer price tags are legally required to be tax-inclusive.
            </p>
            <p>
              The reverse tax calculation is identical:
            </p>
            <div className={styles.formulaBox}>
              Net Price (Excluding VAT) = Gross Price ÷ (1 + VAT Rate)
            </div>
            <p>
              For example, at a 20% VAT rate a £120.00 purchase has a net price of <code>£120 ÷ 1.20 = £100.00</code>, with £20.00 in VAT. Notice that <code>20 ÷ 120 = 1/6</code>, meaning VAT constitutes exactly one-sixth of the gross shelf price.
            </p>

            <h2>Reverse Sales Tax in Excel and Google Sheets</h2>
            <p>
              To back out sales tax in spreadsheet software without rounding errors, use the <code>ROUND</code> function to keep currency rounded to two decimal places:
            </p>
            <ul>
              <li><strong>Pre-tax Price:</strong> <code>=ROUND(Total_Cell / (1 + Rate_Cell), 2)</code></li>
              <li><strong>Sales Tax Amount:</strong> <code>=Total_Cell - ROUND(Total_Cell / (1 + Rate_Cell), 2)</code></li>
              <li><strong>Solved Tax Rate:</strong> <code>=(Total_Cell / PreTax_Cell) - 1</code></li>
            </ul>

            <h2>Why Your Result Can Be Off by a Cent: Rounding Rules</h2>
            <p>
              Because tax calculations involve multiplication and division with fractional cents, rounding can cause a one-cent discrepancy. State taxing authorities generally permit two rounding approaches:
            </p>
            <ul>
              <li><strong>Item-by-Item Rounding:</strong> The merchant rounds the sales tax on each separate line item to the nearest cent, then sums the taxes.</li>
              <li><strong>Subtotal Rounding:</strong> The merchant sums all pre-tax prices and calculates tax on the aggregated subtotal.</li>
            </ul>
            <p>
              Our reverse tax engine guarantees exact reconciliation by calculating the pre-tax price to the nearest cent and assigning the exact remainder to the sales tax amount.
            </p>

            <p>
              To calculate retail discounts, try our <Link href="/discount-calculator/">Discount Calculator</Link>. To set a selling price from cost, use the <Link href="/markup-calculator/">Markup Calculator</Link>, and to compare pack sizes use the <Link href="/unit-price-calculator/">Unit Price Calculator</Link>. For percentage increases or drops, visit our <Link href="/percentage-change-calculator/">Percentage Change Calculator</Link>, or check fractional proportions with our <Link href="/fraction-to-percent-calculator/">Fraction to Percent Calculator</Link>.
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

            <HowWeCalculate slug="reverse-sales-tax-calculator" />
            <AdSlot slotId="reverse-tax-ad-bottom" format="horizontal" />
          </div>
        </div>
      </div>
    </main>
  );
}
