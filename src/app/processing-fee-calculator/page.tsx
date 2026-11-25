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
import ProcessingFeeCalculator from '@/components/tool/processing-fee-calculator';
import styles from './page.module.css';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';

const PAGE_TITLE = 'Card Processing Fee Calculator – Square & Any Processor';
const PAGE_DESC =
  'Free credit card processing fee calculator. See the fee and net on any sale, what to charge to receive a set amount, and compare Square with your own rate.';
const PAGE_PATH = '/processing-fee-calculator/';

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: PAGE_PATH,
  absoluteTitle: true,
});

const FAQS = [
  {
    q: 'How are credit card processing fees calculated?',
    a: 'Credit card processing fees consist of a variable percentage fee plus a fixed dollar fee per transaction: Fee = (Sale Amount × Percentage Rate) + Fixed Fee. The net amount deposited into the merchant bank account is Net = Sale Amount − Fee. The effective fee rate is calculated as Fee ÷ Sale Amount.',
  },
  {
    q: "What are Square's credit card processing fees?",
    a: 'On Square’s standard free tier (verified November 2026), in-person card transactions (tap, dip, swipe) cost 2.6% + $0.15. Online store checkouts and digital invoices cost 3.3% + $0.30. Manually keyed virtual terminal entries cost 3.5% + $0.15. Square Plus subscribers ($49/month) receive a discounted in-person rate of 2.5% + $0.15.',
  },
  {
    q: 'How much does Square charge per transaction?',
    a: 'For an in-person $100 swipe or chip sale on Square Free, Square charges 2.6% of $100 ($2.60) plus a $0.15 fixed fee, totaling $2.75. The merchant receives $97.25 net. For a $100 online sale, Square charges 3.3% ($3.30) plus $0.30, totaling $3.60, netting $96.40.',
  },
  {
    q: 'What is the fee on a $100 sale?',
    a: 'At an example flat rate of 2.9% + $0.30 (enter your own processor’s rate in the calculator), a $100 sale incurs $3.20 in processing fees ($2.90 percentage cut + $0.30 fixed fee). The merchant nets $96.80, representing an effective processing fee rate of 3.20%.',
  },
  {
    q: 'How do I work out what to charge to receive a set amount?',
    a: 'To receive a target net amount after processing fees, use the gross-up formula: Charge = (Target Net + Fixed Fee) ÷ (1 − Percentage Rate as a Decimal). For example, to net exactly $100 when your processor charges 2.9% + $0.30: ($100 + $0.30) ÷ (1 − 0.029) = $100.30 ÷ 0.971 = $103.30.',
  },
  {
    q: 'Are there extra fees for international cards?',
    a: 'Often, yes. Many processors add an extra percentage when the card was issued in another country, and another when a currency conversion is needed. The amounts differ by processor and plan, so check your provider’s pricing page and enter them in the International and Conversion fields.',
  },
  {
    q: 'Is a monthly plan worth it? (break-even)',
    a: 'A paid subscription plan (like Square Plus at $49/month) is worth it only when your monthly transaction savings exceed the fixed monthly fee. For instance, if an upgraded plan saves $0.05 per transaction on a $50 ticket, you need at least 980 transactions ($49,000 monthly sales volume) to break even.',
  },
  {
    q: 'Can I add a surcharge to cover card fees?',
    a: 'Sometimes. Whether you may add a surcharge, how much, and on which cards depends on the card networks’ rules, your processor’s terms and the laws where you sell, and these differ by state and country. The calculator shows the percentage that would cover your fee; check the current rules with your processor before adding one.',
  },
  {
    q: 'Do I get the fee back on a refund?',
    a: 'It depends on the processor. Some keep the original processing fee when you refund a sale, so a $100 refund on a sale that cost $3.20 in fees still costs you the $3.20. Check your provider’s refund policy before you assume the fee comes back.',
  },
  {
    q: 'What does Square POS pricing include?',
    a: 'Square’s pricing page (checked November 2026) lists a Square Free plan at $0 a month and Square Plus at $49 a month per location, each with its own card rates (see the table above). Hardware and add-ons are priced separately; see squareup.com/us/en/pricing for the current list.',
  },
];

export default function ProcessingFeePage() {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Business & Finance', path: '/tools/' },
    { name: 'Card Processing Fee Calculator', path: PAGE_PATH },
  ];

  const appSchema = buildWebApplicationSchema({
    name: 'Card Processing Fee Calculator',
    path: PAGE_PATH,
    description: PAGE_DESC,
    applicationCategory: 'BusinessApplication',
  });

  const faqSchema = buildFaqSchema(FAQS);

  return (
    <main className={`${styles.page} ${toolDisplayFont.variable} ${typo.scope}`}>
      <JsonLd data={appSchema} />
      <JsonLd data={faqSchema} />

      <Container>
        <div className={styles.breadcrumbs}>
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <header className={styles.hero}>
          <h1 className={styles.title}>Credit Card Processing Fee Calculator: Fees, Net and Charge-to-Receive</h1>
          <p className={styles.bluf}>
            Card fee = sale × percentage rate + fixed fee. At 2.9% + $0.30, a $100 sale costs $3.20, so you get $96.80.
            To receive $100 after fees, charge (100 + 0.30) ÷ (1 − 0.029) = $103.30.
          </p>
        </header>

        <ToolShell
          features={[
            'Fee, net & charge-to-receive',
            'Compare providers',
            'Monthly cost & plans',
            'Any processor, any currency',
          ]}
        >
          <ProcessingFeeCalculator />
        </ToolShell>

        <div className={styles.adBand}>
          <AdSlot slotId="after-tool" />
        </div>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. How to Use the Card Processing Fee Calculator</h2>
            <div className={styles.prose}>
              <p>
                Every card swipe, dip, tap, and online checkout incurs transaction processing overhead. Our calculator
                empowers small business owners, freelancers, and e-commerce operators to model payment costs accurately
                across four interactive operational modes:
              </p>
              <ul>
                <li>
                  <strong>Fee on a Sale Tab:</strong> Calculate the exact processing fee deducted, net bank proceeds, and
                  effective percentage for any single transaction. Select a verified preset (Square) or
                  input a custom rate structure.
                </li>
                <li>
                  <strong>Charge to Receive (Gross-Up) Tab:</strong> Determine the exact customer invoice amount required
                  to net a specific take-home dollar figure, preventing payment fees from eroding your target profits.
                </li>
                <li>
                  <strong>Compare Processors Tab:</strong> View side-by-side transaction costs and monthly overhead across
                  major payment gateways on the same sales ticket, with the most economical option automatically highlighted.
                </li>
                <li>
                  <strong>Monthly Volume &amp; Plans Tab:</strong> Model your complete annual processing overhead and
                  calculate the exact break-even sales volume required before a paid subscription plan pays for itself.
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. How Credit Card Processing Fees Are Calculated</h2>
            <div className={styles.prose}>
              <p>
                Behind every card transaction lies a three-part fee structure, commonly bundled by payment service
                providers into a single predictable flat rate:
              </p>

              <div className={styles.formulaBox}>
                Processing Fee = (Sale Amount × Percentage Rate) + Fixed Fee per Transaction
                <br />
                Net Merchant Settlement = Sale Amount − Processing Fee
                <br />
                Effective Processing Rate (%) = (Total Fee ÷ Sale Amount) × 100
              </div>

              <p>The components of this fee are split among multiple financial entities:</p>
              <ul>
                <li>
                  <strong>Interchange Fee:</strong> The wholesale fee paid directly to the customer’s issuing bank (e.g.,
                  Chase, Bank of America, Capital One) to cover credit risk, fraud management, and rewards programs.
                  Regulated debit cards generally carry lower interchange than premium rewards credit cards.
                </li>
                <li>
                  <strong>Card Network Assessment Fee:</strong> The non-negotiable toll charged by card brands (Visa,
                  Mastercard, American Express, Discover) for routing transactions through their networks.
                </li>
                <li>
                  <strong>Processor Markup:</strong> The margin retained by your merchant processor or payment gateway
                  for software infrastructure, point-of-sale hardware, settlement logistics,
                  and customer support.
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Square Credit Card Processing Fees</h2>
            <div className={styles.prose}>
              <p>
                Square (Block, Inc.) operates a flat-rate pricing model that eliminates separate merchant account setup
                fees and monthly gateway charges on its base tier. The table below outlines verified standard US rates:
              </p>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Transaction Channel</th>
                      <th>Contract Rate</th>
                      <th>Fee on $50 Sale</th>
                      <th>Fee on $100 Sale</th>
                      <th className={styles.numCell}>Effective Rate ($100)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>In-Person (Tap, Chip, Swipe)</td>
                      <td>2.6% + $0.15</td>
                      <td>$1.45</td>
                      <td>$2.75</td>
                      <td className={styles.numCell}>2.75%</td>
                    </tr>
                    <tr>
                      <td>Online Checkout &amp; Invoices</td>
                      <td>3.3% + $0.30</td>
                      <td>$1.95</td>
                      <td>$3.60</td>
                      <td className={styles.numCell}>3.60%</td>
                    </tr>
                    <tr>
                      <td>Manually Keyed / Virtual Terminal</td>
                      <td>3.5% + $0.15</td>
                      <td>$1.90</td>
                      <td>$3.65</td>
                      <td className={styles.numCell}>3.65%</td>
                    </tr>
                    <tr>
                      <td>Square Plus Plan ($49/mo) In-Person</td>
                      <td>2.5% + $0.15</td>
                      <td>$1.40</td>
                      <td>$2.65</td>
                      <td className={styles.numCell}>2.65%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                Square’s fixed transaction fee of $0.15 on in-person card payments makes it particularly economical for
                small-ticket microtransactions (such as coffee shops and food trucks) compared to traditional 30-cent fixed
                fees. Always confirm your merchant dashboard rates on the official{' '}
                <a href="https://squareup.com/us/en/pricing" target="_blank" rel="noopener noreferrer">
                  Square Pricing Hub
                </a>.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. PayPal, Stripe and Other Processors</h2>
            <div className={styles.prose}>
              <p>
                We only list a processor&rsquo;s rates as a preset after reading them on its official pricing page, with
                the date we checked. We couldn&rsquo;t read PayPal&rsquo;s or Stripe&rsquo;s US pricing pages for this
                review, so they are not presets yet. To compare them, open their official pricing pages, then type the
                percentage and fixed fee into the <strong>Custom rate</strong> fields.
              </p>
              <p>
                Pay attention to the fixed fee on small orders. On a $20 sale, a $0.49 fixed fee alone is 2.45% of the
                sale before any percentage fee is added, so a processor with a higher percentage but a lower fixed fee
                can be cheaper for small tickets. The Compare tab shows this for your own average sale.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. How Much to Charge to Receive a Set Amount (Gross-Up Math)</h2>
            <div className={styles.prose}>
              <p>
                A frequent blunder made by contractors, service providers, and freelancers is calculating fees on the net
                target rather than the final gross invoice.
              </p>
              <p>
                If you want to receive $100 and your processor charges 2.9% + $0.30, simply adding $3.20 results in an
                invoice of $103.20. However, the processor will then deduct 2.9% + $0.30 from the full $103.20 (which is
                $3.29), leaving you with only $99.91—short of your target!
              </p>
              <p>The mathematically exact gross-up equation is:</p>

              <div className={styles.formulaBox}>Gross Charge = (Target Net + Fixed Fee) ÷ (1 − Rate as a Decimal)</div>

              <p>
                For our benchmark: <code>($100 + $0.30) ÷ (1 − 0.029) = $100.30 ÷ 0.971 = $103.30</code>. When the client
                pays $103.30, the 2.9% fee is $3.00 plus $0.30 fixed fee, totaling exactly $3.30, and leaving you with
                precisely <strong>$100.00 in cash</strong>.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. International Cards and Currency Conversion Cross-Border Surcharges</h2>
            <div className={styles.prose}>
              <p>
                Cross-border e-commerce transactions carry additional fees imposed by card networks and merchant
                aggregators:
              </p>
              <ul>
                <li>
                  <strong>International card fee:</strong> many processors add a percentage when the card was issued
                  outside your country.
                </li>
                <li>
                  <strong>Currency conversion fee:</strong> another percentage may apply when the customer pays in a
                  different currency from your payout currency.
                </li>
              </ul>
              <p>
                The amounts vary by processor and plan, so take them from your provider&rsquo;s pricing page. For
                example, if a 2.9% + $0.30 rate had an extra 1.5% international fee and a 1% conversion fee (example
                figures only), a $100 sale would cost <code>(2.9% + 1.5% + 1%) × $100 + $0.30 = $5.70</code> instead of
                $3.20.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Monthly Software Plans vs. Flat-Rate Pay-As-You-Go: Calculating Break-Even</h2>
            <div className={styles.prose}>
              <p>
                Many point-of-sale providers offer tiered software plans with reduced transaction fees in exchange for a
                monthly subscription fee. To evaluate whether upgrading is financially rational, use the break-even formula:
              </p>

              <div className={styles.formulaBox}>
                Savings per Transaction = Standard Fee per Ticket − Upgraded Fee per Ticket
                <br />
                Break-Even Monthly Transactions = Plan Monthly Fee ÷ Savings per Transaction
                <br />
                Break-Even Sales Volume = Break-Even Transactions × Average Ticket Size
              </div>

              <p>
                For instance, consider Square Free (2.6% + $0.15) versus Square Plus ($49/month, 2.5% + $0.15) for a retail
                shop with an average ticket of $50:
              </p>
              <ul>
                <li>Square Free fee per ticket: $50 × 2.6% + $0.15 = $1.45</li>
                <li>Square Plus fee per ticket: $50 × 2.5% + $0.15 = $1.40</li>
                <li>Savings per ticket: $0.05</li>
                <li>Break-even transactions: $49 ÷ $0.05 = <strong>980 transactions per month</strong></li>
                <li>Break-even monthly sales: 980 × $50 = <strong>$49,000 per month</strong></li>
              </ul>
              <p>
                If your business processes less than $49,000 monthly, staying on the free tier results in lower total costs.
                Once volume exceeds $49,000, every additional transaction generates net profit above the subscription cost.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Passing Fees to Customers: Surcharges, Cash Discounts, and Card Network Rules</h2>
            <div className={styles.prose}>
              <p>
                Merchants looking to protect profit margins often consider passing processing fees directly to customers.
                However, strict legal and card network constraints govern these practices:
              </p>
              <ul>
                <li>
                  <strong>Credit Card Surcharge:</strong> A fee added directly to a credit card transaction. Under Visa
                  and Mastercard operating rules, surcharges cannot exceed the merchant’s actual cost of acceptance or a{' '}
                  <strong>maximum cap of 3.0%</strong> in the United States.
                </li>
                <li>
                  <strong>Debit Cards Are Strictly Excluded:</strong> Federal law (Dodd-Frank / Durbin Amendment) and
                  card network rules strictly prohibit surcharging debit cards, even when run as &ldquo;credit&rdquo;
                  without a PIN.
                </li>
                <li>
                  <strong>Cash Discount Programs:</strong> An alternative compliant model where listed prices are standard
                  card prices, and customers paying with cash or ACH receive a discount at checkout.
                </li>
                <li>
                  <strong>Disclosure Requirements:</strong> Merchants must notify card networks 30 days prior to surcharging
                  and post clear, conspicuous signage at the store entrance, point of sale, and on customer receipts.
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Frequently Asked Questions</h2>
            <Faq items={FAQS} withSchema={false} />
          </section>

          <HowWeCalculate slug="processing-fee-calculator" />

          <div className={styles.disclaimer}>
            <strong>Disclaimer:</strong> This payment processing fee calculator is provided for informational and
            educational purposes only. Published provider rates reflect public standard US pricing schedules verified in
            November 2026. Custom enterprise tiers, interchange-plus contracts, chargeback fees, and regional taxes may
            alter your actual merchant settlement. Consult your merchant agreement for exact contracted rates.
          </div>

          <section className={styles.section} style={{ marginTop: '2.5rem' }}>
            <h3 className={styles.sectionTitle}>Explore Related Business &amp; Invoicing Calculators</h3>
            <div className={styles.relatedGrid}>
              <Link href="/invoice-generator/" className={styles.relatedCard}>
                <h4 className={styles.relatedCardTitle}>Free Invoice Generator</h4>
                <p className={styles.relatedCardDesc}>
                  Generate hourly, freelance, and contractor invoices with itemized rates, sales tax, discount logic, and
                  PDF print export.
                </p>
              </Link>
              <Link href="/markup-calculator/" className={styles.relatedCard}>
                <h4 className={styles.relatedCardTitle}>Markup Calculator</h4>
                <p className={styles.relatedCardDesc}>
                  Determine optimal selling prices from cost and desired markup percentage, incorporating payment
                  processing fees into your margin.
                </p>
              </Link>
              <Link href="/profit-margin-calculator/" className={styles.relatedCard}>
                <h4 className={styles.relatedCardTitle}>Profit Margin Calculator</h4>
                <p className={styles.relatedCardDesc}>
                  Analyze multi-tier profit cascades from gross revenue down to net income, accounting for merchant gateway
                  costs.
                </p>
              </Link>
              <Link href="/percentage-change-calculator/" className={styles.relatedCard}>
                <h4 className={styles.relatedCardTitle}>Percentage Change Calculator</h4>
                <p className={styles.relatedCardDesc}>
                  Calculate percentage increases, sales commission variations, price point differences, and cumulative
                  revenue growth.
                </p>
              </Link>
            </div>
          </section>
        </article>
      </Container>
    </main>
  );
}
