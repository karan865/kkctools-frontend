import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import AirbnbCalculator from '@/components/tool/airbnb-calculator';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.airbnbCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const faqs = [
  {
    q: 'How do I calculate Airbnb profit?',
    a: `To calculate short-term rental profit accurately, subtract all platform fees, direct turnover expenses, fixed monthly overhead, and financing debt from gross guest revenue. The core formula is: Net Cash Flow = (Booked Nights × Average Daily Rate + Cleaning Fees Collected + Other Income) − Platform Host Fees − Turnover Cleanings & Supplies − Maintenance Reserve − Fixed Bills (Utilities, Wi-Fi, STR Insurance, Permits) − Mortgage Debt Service or Master Lease Rent. In our verified benchmark, a property at $180/night and 65% occupancy generates $49,822.50 in gross revenue, pays $16,623.30 in total operating costs, and yields $11,599.20 in annual cash flow ($966.60/month) after an $1,800/month mortgage payment.`,
  },
  {
    q: 'How much can I make on Airbnb?',
    a: `Your actual Airbnb earnings depend strictly on three variables: your Average Daily Rate (ADR), your annual occupancy percentage, and your total operating expense structure. Rather than relying on generic national averages that obscure local market realities, research live comparable listings on Airbnb or Vrbo in your immediate sub-market across both peak season and off-season. Multiply your realistic expected occupancy by 365 to determine booked nights, multiply by ADR, and subtract true operating expenses. Enter every running cost in the calculator, because they take a large share of revenue before the mortgage is paid.`,
  },
  {
    q: 'How do I estimate vacation rental income?',
    a: `To estimate vacation rental revenue: 1) Identify 3 to 5 active competitor listings with identical bedroom counts, bathroom counts, and amenity quality within 0.5 miles of your property; 2) Review their public booking calendars to observe weekend versus weekday pricing and minimum stay requirements; 3) Estimate occupancy for peak and off-peak seasons from those calendars; 4) Calculate gross nightly revenue; 5) Add cleaning fees charged to guests; and 6) Deduct your platform’s current host fee (check the platform’s fee page).`,
  },
  {
    q: 'Does this calculator include all costs and fees?',
    a: `Yes. Unlike many promotional short-term rental calculators that only display gross booking volume or omit recurring operational expenses, this calculator models the full institutional profit waterfall: platform host fees (enter your platform’s current fee), actual turnover cleaner fees, guest supplies (coffee, toiletries, paper products), a 5% ongoing maintenance reserve, fixed monthly utilities (power, natural gas, water, trash), high-speed Wi-Fi, commercial STR liability insurance, municipal permit fees, and financing debt service or master lease arbitrage rent.`,
  },
  {
    q: 'Is Airbnb more profitable than a long-term rental?',
    a: `Short-term rentals frequently generate 1.5× to 2.5× the gross top-line revenue of a traditional 12-month residential lease on the same property. However, STRs incur significantly higher operating costs—including full utility bills, frequent turnover cleaning, consumables restocking, commercial insurance premiums, and platform commissions. In our verified comparison, a property generating $4,151/month gross on Airbnb netting $966.60/month cash flow compares to the same home generating $2,400/month long-term rent netting $183.60/month after standard management and vacancy reserves—delivering an extra $783/month in cash flow for the active host.`,
  },
  {
    q: 'What is break-even occupancy?',
    a: `Break-even occupancy is the minimum percentage of calendar nights you must book each year to generate enough contribution margin to cover 100% of your fixed operating expenses and debt service, resulting in exactly zero cash flow. In our standard benchmark ($5,520 in fixed bills plus $21,600 in annual mortgage debt), the property requires a 45.53% break-even occupancy (166 booked nights). Any booking beyond the 167th night generates pure net profit.`,
  },
  {
    q: 'What is a good occupancy rate for a short-term rental?',
    a: `There is no single good occupancy rate: it depends on the market, the season and your pricing, and we don’t print averages we can’t cite. Compare your result with the break-even occupancy shown by the calculator and with the booked calendars of comparable listings. Leisure markets tend to be more seasonal than city or business-travel markets. Pricing strategy should dynamically balance ADR against occupancy to maximize RevPAR (Revenue Per Available Night).`,
  },
  {
    q: 'How does Airbnb rental arbitrage work?',
    a: `Rental arbitrage is an investment strategy where an operator signs a long-term commercial or residential lease with a property owner (with explicit written contractual permission to sublease) and furnishes the space to host short-term or mid-term guests. The operator does not purchase real estate or take on a mortgage; instead, they invest $5,000 to $12,000 in furnishings, decor, and security deposits. Profit equals gross guest revenue minus operating expenses and the monthly fixed rent paid to the landlord.`,
  },
  {
    q: 'Does this calculator work for Vrbo and other booking platforms?',
    a: `Yes. The underlying mathematical model applies universally to Airbnb, Vrbo, Booking.com, and direct booking websites. Simply adjust the platform host fee percentage input: standard Airbnb host split-fee is typically 3%, Airbnb host-only fee is 14% to 16%, and Vrbo charges approximately 5% plus 3% credit card processing for pay-per-booking listings. Enter your specific platform fee to see exact net proceeds.`,
  },
  {
    q: 'Do I have to collect and remit occupancy tax?',
    a: `In many jurisdictions, major platforms like Airbnb and Vrbo automatically collect state and municipal Transient Occupancy Tax (TOT), lodging taxes, or sales taxes from the guest at checkout and remit them directly to state and local tax authorities on your behalf. However, in certain cities, counties, or unincorporated areas, hosts are required to register for an STR tax certificate and manually collect and remit local lodging taxes. Check your municipal code; our calculator provides an occupancy tax input for hosts who remit directly.`,
  },
  {
    q: 'How much does it cost to furnish a short-term rental, and when does it pay back?',
    a: `Initial setup and furnishing costs typically range from $10,000 to $25,000 for a 2-to-3-bedroom property, covering commercial-grade mattresses, durable furniture, smart locks, noise sensors, kitchen cookware, hotel-quality linens, wall art, and professional photography. In our baseline scenario ($15,000 setup capital generating $966.60 in net monthly cash flow), the startup investment pays back in full in approximately 15.5 months of operations.`,
  },
  {
    q: 'How accurate are free Airbnb calculators?',
    a: `A calculator is only as accurate as the operational assumptions and local rate data you supply. Automated algorithms that estimate revenue purely from a street address frequently make erroneous assumptions regarding luxury finishes, view premiums, parking availability, or local regulatory restrictions. By entering verified nightly rates, realistic local occupancy rates, and itemized operating expenses into our transparent client-side model, you obtain an exact mathematical projection free from promotional exaggeration.`,
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Airbnb Profit Calculator',
  applicationCategory: 'BusinessApplication',
  path: route.path,
  description: route.description,
});

const faqSchema = buildFaqSchema(faqs);

export default function AirbnbCalculatorPage() {
  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={faqSchema} />

      <main className={styles.main}>
        <Breadcrumbs
          items={[
            { name: 'Calculators', path: ROUTES.tools.path },
            { name: 'Airbnb Profit Calculator', path: route.path },
          ]}
        />

        <header className={styles.header}>
          <h1 className={`${styles.h1} ${toolDisplayFont.className}`}>
            Airbnb Profit Calculator: Short-Term Rental Income, Costs &amp; ROI
          </h1>
          <p className={styles.lead}>
            Calculate true short-term rental net cash flow, Net Operating Income (NOI), and cash-on-cash return.
            Model Airbnb host fees, turnover cleaning, guest supplies, utility overhead, break-even occupancy, and
            side-by-side long-term rental comparisons.
          </p>
          <div className={styles.meta}>
            Published by KKC Tools Hospitality &amp; Real Estate Analytics Team · Institutional STR Underwriting Standards
          </div>
        </header>

        {/* BLUF Summary Box */}
        <div className={styles.blufBox}>
          <strong>Bottom Line Up Front (BLUF):</strong> Short-term rental profit equals gross guest bookings plus cleaning
          fees minus platform host fees, variable turnover costs, fixed bills, and financing. In our verified benchmark, a
          property at <strong>$180/night ADR</strong> and <strong>65% annual occupancy</strong> (237.25 booked nights) earns{' '}
          <strong>$49,822.50 in gross revenue</strong> ($4,151.88/mo). After paying <strong>$16,623.30 in annual operating expenses</strong> (3% platform fees, $80 cleaner fees, supplies, utilities, Wi-Fi, STR insurance, and 5% maintenance reserve), the property produces{' '}
          <strong>$33,199.20 in annual NOI</strong>. After an <strong>$1,800/month mortgage ($21,600/yr)</strong>, it nets{' '}
          <strong>$11,599.20 in annual cash flow ($966.60/month)</strong>, yielding a <strong>15.47% cash-on-cash return</strong> on $75,000 total capital ($60k down/closing + $15k furniture) with a{' '}
          <strong>45.53% break-even occupancy hurdle</strong>.
        </div>

        {/* Interactive Calculator Shell */}
        <section className={styles.toolSection} aria-label="Interactive Airbnb Profit Calculator">
          <AirbnbCalculator />
        </section>

        <AdSlot slotId="airbnb-calculator-top" />

        {/* Editorial Guide & Reference Content */}
        <article className={styles.article}>
          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>How to Use This Airbnb Profit Calculator</h2>
            <p className={styles.p}>
              Accurately evaluating a short-term rental (STR) requires examining both top-line guest spending and the
              operational frictions unique to hospitality management. This calculator provides four specialized underwriting
              modes tailored to modern real estate investment:
            </p>
            <ol style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li>
                <strong>Tab 1 — Buy &amp; Host:</strong> Model purchasing an investment property with mortgage financing.
                Enter purchase price, down payment, monthly debt service, furnishing capital, and operating costs to evaluate
                cash flow, cash-on-cash return, and break-even occupancy.
              </li>
              <li>
                <strong>Tab 2 — Rental Arbitrage:</strong> Analyze leasing an apartment or single-family home from a master
                landlord and subleasing it on short-term platforms. Replaces mortgage debt with monthly lease rent to calculate
                payback on furniture and lease deposits.
              </li>
              <li>
                <strong>Tab 3 — Mid-Term Rental (MTR):</strong> Model 30+ day furnished executive rentals, traveling nurse
                housing, and corporate relocation leases. Adjusts stay lengths to 30–90 days, dramatically reducing turnover
                cleaning expenses while testing lower monthly rates.
              </li>
              <li>
                <strong>Tab 4 — STR vs. Long-Term Rental:</strong> Directly compare your projected short-term returns against
                a conventional 12-month tenant lease on the same asset, accounting for long-term vacancy and property management.
              </li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>How Airbnb Profit Is Calculated</h2>
            <p className={styles.p}>
              Unlike conventional residential real estate where rent is paid once per month under a single contract,
              vacation rentals generate revenue across dozens of individual transactions while incurring variable per-stay
              cleaning and supply costs. The complete accounting waterfall operates as follows:
            </p>
            <div className={styles.formulaBox}>
              Booked Nights = Nights Available × (Occupancy % ÷ 100)
              <br />
              Stays Count = Booked Nights ÷ Average Stay Duration (Nights)
              <br />
              Gross Revenue = (Booked Nights × Nightly ADR) + (Stays Count × Cleaning Fee Charged) + Other Income
              <br />
              Platform Host Fees = Gross Revenue × (Platform Fee % + Payment Processing %)
              <br />
              Variable Costs = (Stays Count × Cleaning Cost) + (Stays Count × Supplies) + Maintenance Reserve
              <br />
              Fixed Costs = 12 × (Utilities + Internet + STR Insurance + Software + HOA) + Permits + Property Tax
              <br />
              Net Operating Income (NOI) = Gross Revenue − Platform Fees − Variable Costs − Fixed Costs − Remitted Taxes
              <br />
              Net Cash Flow = NOI − Annual Mortgage Debt Service (or Master Lease Rent)
              <br />
              Cash-on-Cash Return (%) = (Annual Cash Flow ÷ Total Capital Invested) × 100
              <br />
              Break-Even Occupancy (%) = Fixed Annual Burden ÷ (Nights Available × Net Contribution Margin Per Night)
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Occupancy Rate, Nightly Rate (ADR) and RevPAR</h2>
            <p className={styles.p}>
              Three key metrics dictate short-term rental performance across the hospitality industry:
            </p>
            <ul style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li>
                <strong>Average Daily Rate (ADR):</strong> The average rental income realized per paid occupied room in a given
                time period. ADR excludes cleaning fees and platform commissions. In our baseline example, the ADR is $180.00.
              </li>
              <li>
                <strong>Occupancy Rate:</strong> The percentage of available calendar nights that are booked by paying guests.
                At 65% occupancy over 365 available nights, the property logs 237.25 booked nights and 127.75 unbooked vacant nights.
              </li>
              <li>
                <strong>RevPAR (Revenue Per Available Night):</strong> Calculated as <code>ADR × Occupancy %</code> (or Total Room
                Revenue ÷ Total Available Nights). RevPAR provides the truest measure of pricing efficiency. At $180 ADR and 65% occupancy,
                RevPAR equals $117.00. A property with $220 ADR at 50% occupancy achieves a RevPAR of $110.00, generating less gross revenue
                than a lower-rate listing with superior occupancy.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>How Much Can I Make on Airbnb? Real Data vs. National Averages</h2>
            <p className={styles.p}>
              Promotional articles on the internet often quote national average earnings such as &ldquo;hosts make $14,000 per year&rdquo;
              or &ldquo;superhosts earn $50,000.&rdquo; These aggregated figures are mathematically meaningless for underwriting a specific
              investment because short-term rental yields vary wildly based on micro-location, bedroom count, design aesthetic, and seasonality.
            </p>
            <p className={styles.p}>
              To determine your true earning potential without relying on fabricated averages:
            </p>
            <ol style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li>
                <strong>Inspect Live Local Listings:</strong> Search Airbnb and Vrbo for properties with identical bedroom and bathroom
                counts within 1 mile of your subject property. Filter for listings with over 40 reviews and Superhost badges to identify top performers.
              </li>
              <li>
                <strong>Sample Peak and Off-Peak Dates:</strong> Check calendar availability and quoted rates for a weekend in July, a
                midweek stay in October, and a holiday week in December. Note the difference between weekday and weekend rates.
              </li>
              <li>
                <strong>Review Regulatory Ceilings:</strong> Confirm whether your target municipality enforces caps on un-hosted short-term
                rental nights (e.g., London&apos;s 90-day rule, San Francisco&apos;s 90-day limit, or Los Angeles&apos;s 120-day cap) which limit total annual available nights.
              </li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>The Operating Costs Most Calculators Leave Out</h2>
            <p className={styles.p}>
              Novice operators frequently underestimate ongoing operating expenses by only subtracting mortgage payments and platform fees.
              In reality, short-term rentals are active hospitality businesses that carry substantial operational friction:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Expense Category</th>
                    <th>Typical Cost Range</th>
                    <th>Why It Must Be Budgeted</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Turnover Cleaning</strong></td>
                    <td>$75 – $250 per stay</td>
                    <td>Cleaners charge per turnover regardless of stay length. Passing 100% of the cost to guests through high cleaning fees depresses search ranking.</td>
                  </tr>
                  <tr>
                    <td><strong>Consumable Supplies</strong></td>
                    <td>$8 – $20 per stay</td>
                    <td>High-quality coffee, bath amenities, paper towels, trash bags, dish soap, and laundry pods must be restocked continuously.</td>
                  </tr>
                  <tr>
                    <td><strong>Utility Premiums</strong></td>
                    <td>$200 – $450 per month</td>
                    <td>Guests do not conserve power or air conditioning. Electric and gas bills in vacation rentals run 30% to 50% higher than owner-occupied homes.</td>
                  </tr>
                  <tr>
                    <td><strong>Commercial STR Insurance</strong></td>
                    <td>$1,200 – $3,000 per year</td>
                    <td>Standard homeowner policies strictly exclude short-term commercial hosting. Dedicated commercial liability and property coverage is required.</td>
                  </tr>
                  <tr>
                    <td><strong>Maintenance Reserve</strong></td>
                    <td>5% – 10% of gross revenue</td>
                    <td>Heavy guest luggage scuffs baseboards, high washer/dryer usage accelerates appliance wear, and plumbing stoppages occur frequently.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Break-Even Occupancy Analysis</h2>
            <p className={styles.p}>
              Break-even occupancy is your financial safety margin. It answers the question: <em>&ldquo;How many nights per year must I book
              just to keep the lights on and pay the mortgage?&rdquo;</em>
            </p>
            <p className={styles.p}>
              To determine break-even occupancy, divide your total fixed burden (all annualized fixed bills plus annual debt service minus
              any other income) by the net contribution margin generated per booked night. In our verified baseline:
            </p>
            <ul style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li><strong>Fixed Operating Overhead:</strong> $5,520.00 per year ($460.00/month)</li>
              <li><strong>Mortgage Debt Service:</strong> $21,600.00 per year ($1,800.00/month)</li>
              <li><strong>Total Fixed Burden:</strong> $27,120.00 per year</li>
              <li><strong>Net Contribution per Booked Night:</strong> $163.20 (after deducting platform fees, cleaning, supplies, and maintenance reserves)</li>
              <li><strong>Required Booked Nights:</strong> $27,120.00 ÷ $163.20 = 166.18 nights</li>
              <li><strong>Break-Even Occupancy:</strong> 166.18 nights ÷ 365 nights = <strong>45.53% occupancy</strong></li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Short-Term Rental vs. Long-Term Rental: An Objective Comparison</h2>
            <p className={styles.p}>
              Choosing between short-term hosting and traditional 12-month tenant leasing involves balancing higher cash flow against
              operational workload and regulatory risk:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Underwriting Factor</th>
                    <th>Short-Term Rental (Airbnb / Vrbo)</th>
                    <th>Long-Term Rental (12-Mo Lease)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Cash Flow Potential</strong></td>
                    <td>Significantly higher (1.5× to 2.5× gross revenue)</td>
                    <td>Predictable, steady monthly rental payment</td>
                  </tr>
                  <tr>
                    <td><strong>Operating Workload</strong></td>
                    <td>High: messaging guests, turnover scheduling, restocking</td>
                    <td>Low: occasional repair requests, annual renewal</td>
                  </tr>
                  <tr>
                    <td><strong>Property Wear &amp; Tear</strong></td>
                    <td>Inspected every 3 to 4 days; deep cleaned weekly</td>
                    <td>Infrequent inspections; damage discovered at move-out</td>
                  </tr>
                  <tr>
                    <td><strong>Tenant Eviction Risk</strong></td>
                    <td>Minimal: transient guests have no tenancy rights (under 28 days)</td>
                    <td>Subject to formal eviction processes if tenant defaults</td>
                  </tr>
                  <tr>
                    <td><strong>Regulatory Exposure</strong></td>
                    <td>High: municipal bans, permit moratoriums, HOA restrictions</td>
                    <td>Protected by established landlord-tenant statutory framework</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Rental Arbitrage: Subleasing Without Ownership</h2>
            <p className={styles.p}>
              Rental arbitrage allows entrepreneurs to build hospitality cash flow without purchasing real estate or qualifying
              for commercial bank loans. By signing a master lease on an apartment or single-family residence and outfitting it with
              curated furnishings, operators can capture the spread between monthly residential rent and short-term guest revenue.
            </p>
            <p className={styles.p}>
              <strong>Critical Risk Control:</strong> Never engage in &ldquo;covert&rdquo; or unauthorized arbitrage. Always obtain
              an explicit commercial subleasing addendum from the property landlord or management company. Unauthorized subleasing
              violates standard residential lease covenants, leading to immediate eviction, forfeiture of security deposits, and
              account deactivation by booking platforms.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Mid-Term Rentals (30+ Day Stays): The Hybrid Model</h2>
            <p className={styles.p}>
              Mid-term rentals (MTRs), catering to stays between 30 and 120 days, represent a rapidly growing segment of the furnished housing market.
              Primary tenant profiles include traveling medical professionals (nurses, physicians), corporate relocations, digital nomads,
              and homeowners displaced by insurance renovation claims.
            </p>
            <p className={styles.p}>
              While mid-term rentals command lower nightly rates than vacation rentals (typically $100–$140/night vs. $180–$220/night), they
              offer substantial operational advantages:
            </p>
            <ul style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li><strong>Dramatically Lower Turnover Expenses:</strong> Only 4 to 8 turnovers per year instead of 60 to 90 cleanings.</li>
              <li><strong>Regulatory Exemption:</strong> Most municipal short-term rental bans and hotel taxes strictly apply only to stays under 30 days. Stays of 30 days or longer are legally exempt from STR permit caps in most jurisdictions.</li>
              <li><strong>Higher Occupancy Stability:</strong> Monthly bookings reduce shoulder-season vacancy cliffs.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Furnishing Capital &amp; Payback Period</h2>
            <p className={styles.p}>
              Furnishing a short-term rental requires upfront capital for durable commercial-grade goods. Skimping on furniture quality
              leads to poor guest reviews, broken bed frames, and depressed pricing power. Standard furnishing budgets range from $6,000
              for a studio apartment to $15,000 for a 2-bedroom home, and $25,000+ for a luxury 4-bedroom property.
            </p>
            <p className={styles.p}>
              To evaluate investment viability, calculate your furniture payback period: <code>Startup Furnishing Cost ÷ Monthly Net Cash Flow</code>.
              In our baseline model ($15,000 startup generating $966.60 net monthly cash flow), the host recoups 100% of their out-of-pocket setup
              capital in <strong>15.5 months</strong>.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Municipal Regulations, Permits and Lodging Taxes</h2>
            <p className={styles.p}>
              Before acquiring property or signing master leases for short-term rental operations, conduct thorough due diligence on
              three regulatory layers:
            </p>
            <ol style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li><strong>Municipal Zoning &amp; STR Permits:</strong> Verify whether the municipality requires an annual Short-Term Rental operating license, limits licenses per geographic zone, or mandates primary-residency requirements.</li>
              <li><strong>HOA &amp; Condo Bylaws:</strong> Homeowners associations frequently enforce minimum lease durations (e.g., &ldquo;no leases under 30 days&rdquo; or &ldquo;minimum 6-month rental&rdquo;). HOA restrictions supersede municipal permits.</li>
              <li><strong>Transient Occupancy Tax (TOT):</strong> Check whether Airbnb and Vrbo have voluntary collection agreements (VCAs) with your local county or city to automatically collect lodging taxes, or whether you must remit them directly.</li>
            </ol>
          </section>

          {/* FAQ Accordion Section */}
          <section className={styles.faqSection}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Frequently Asked Questions About Airbnb &amp; Short-Term Rentals</h2>
            {faqs.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <details>
                  <summary>{faq.q}</summary>
                  <div className={styles.faqAnswer}>{faq.a}</div>
                </details>
              </div>
            ))}
          </section>

          {/* Method and Citations Component */}
          <HowWeCalculate slug="airbnb-calculator" />

          {/* Legal Disclaimer */}
          <div style={{ margin: '32px 0', padding: '16px', background: 'var(--surface-2, #f8fafc)', borderRadius: '8px', fontSize: '0.825rem', color: 'var(--muted, #64748b)', lineHeight: 1.5 }}>
            <strong>Legal &amp; Financial Disclaimer:</strong> This short-term rental profit calculator provides mathematical estimates for informational and educational planning purposes only. It does not constitute investment, tax, or legal advice. Real estate revenues and expenses fluctuate based on macroeconomic conditions, seasonal travel demand, and local regulatory changes. Consult a qualified certified public accountant (CPA), real estate attorney, and licensed insurance broker before deploying capital.
          </div>

          {/* Related Calculators Cross-Links */}
          <section className={styles.relatedSection}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Related Real Estate &amp; Investment Calculators</h2>
            <div className={styles.relatedGrid}>
              <Link href={ROUTES.rentalPropertyCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Rental Property Calculator</div>
                <div className={styles.relatedDesc}>
                  Underwrite residential long-term rental cash flow, cash-on-cash return, DSCR, and 10-year equity pro forma models.
                </div>
              </Link>
              <Link href={ROUTES.capRateCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Cap Rate Calculator</div>
                <div className={styles.relatedDesc}>
                  Calculate capitalization rates, estimate building value from Net Operating Income, and evaluate market exit yields.
                </div>
              </Link>
              <Link href={ROUTES.commercialLeaseCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Commercial Lease Calculator</div>
                <div className={styles.relatedDesc}>
                  Model commercial rent per square foot, NNN and CAM pass-through expenses, escalations, and net effective rent.
                </div>
              </Link>
              <Link href={ROUTES.percentageChangeCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Percentage Change Calculator</div>
                <div className={styles.relatedDesc}>
                  Calculate seasonal occupancy shifts, year-over-year revenue fluctuations, and nightly rate increase percentages.
                </div>
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
