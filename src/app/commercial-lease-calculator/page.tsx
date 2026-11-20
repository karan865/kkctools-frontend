import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import CommercialLeaseCalculator from '@/components/tool/commercial-lease-calculator';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.commercialLeaseCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const faqs = [
  {
    q: 'How is commercial rent calculated per square foot?',
    a: `Commercial rent is typically quoted as an annual dollar rate per rentable square foot ($/SF/year). To determine annual base rent, multiply the quoted rate by the rentable square footage (RSF). To find the monthly base rent, divide that annual figure by 12. For example, a 2,300 RSF suite quoted at $24.00/SF/year costs 2,300 × $24 = $55,200 annually, or $55,200 ÷ 12 = $4,600 per month in base rent before pass-through charges.`,
  },
  {
    q: 'How do I convert annual rent per square foot to monthly rent?',
    a: `To convert an annual rate per square foot to monthly rent: 1) Divide the annual $/SF rate by 12 to find the monthly rate per square foot (e.g., $24.00 ÷ 12 = $2.00/SF/month); 2) Multiply by your rentable square footage (2,300 RSF × $2.00 = $4,600/month). Conversely, to convert a quoted monthly rate to an annual rate, multiply the monthly rate by 12.`,
  },
  {
    q: 'What does NNN (triple net) mean, and what is included?',
    a: `A Triple Net (NNN) lease is a lease agreement where the tenant pays base rent plus their pro-rata share of three operational expense categories: 1) Property Taxes (Net 1); 2) Building Insurance (Net 2); and 3) Common Area Maintenance (CAM, Net 3), which covers parking lots, roof repairs, landscaping, snow removal, and shared hallway upkeep. Operating expenses are typically billed monthly as estimated pass-throughs and reconciled annually.`,
  },
  {
    q: 'What is a gross lease (full service lease)?',
    a: `A Gross Lease (also called a Full Service Gross lease) is an agreement where the tenant pays a single flat rental rate, and the landlord covers all property taxes, hazard insurance, building maintenance, and often base utilities. Gross lease rental rates are higher per square foot (e.g., $32.00/SF vs. $24.00/SF NNN) because the landlord assumes the financial risk of operating expense increases.`,
  },
  {
    q: 'What is a modified gross lease?',
    a: `A Modified Gross lease is a hybrid commercial lease structure where operating expenses are divided between landlord and tenant. For example, the landlord may cover property taxes and structural insurance, while the tenant directly pays for their suite's electricity, janitorial service, and a proportionate share of common area maintenance (CAM). The specific division of costs is explicitly itemized in the lease contract.`,
  },
  {
    q: 'What are CAM expenses, and how is my share calculated?',
    a: `Common Area Maintenance (CAM) expenses encompass the operational costs of maintaining shared areas in a commercial office building, retail strip, or industrial park. This includes parking lot repaving, exterior lighting, security, snow removal, landscaping, lobby cleaning, and HVAC servicing. A tenant's CAM share is calculated using their pro-rata square footage: Pro-Rata Share % = (Tenant RSF ÷ Total Building RSF) × 100. If your suite is 2,300 RSF in a 50,000 RSF building, your share is 4.6% of the building's total CAM budget.`,
  },
  {
    q: 'What is a load factor, and what is the difference between usable and rentable sq ft?',
    a: `Usable Square Footage (USF) is the private space exclusively occupied by your business inside your suite walls. Rentable Square Footage (RSF) includes your usable area plus your proportionate share of shared building amenities (lobbies, public restrooms, mechanical rooms, corridors). The Load Factor (or core factor / add-on factor) is the percentage markup applied to usable space: RSF = USF × (1 + Load Factor %). For example, 2,000 USF with a 15% load factor equals 2,300 RSF. You pay rent on rentable square footage.`,
  },
  {
    q: 'What is a tenant improvement (TI) allowance?',
    a: `A Tenant Improvement (TI) allowance is a cash concession provided by the commercial landlord to help customize or build out the interior suite for the tenant's business. TI allowances are usually quoted as a dollar amount per square foot (e.g., $10/SF on 2,300 RSF = $23,000 credit). The allowance can be used for interior framing, flooring, paint, electrical drops, and plumbing, and effectively reduces the tenant's net capital outlay.`,
  },
  {
    q: 'What is net effective rent?',
    a: `Net Effective Rent is the true economic rent paid per square foot after accounting for landlord concessions such as free rent periods and tenant improvement (TI) allowances across the lease term. The equation is: Net Effective Rent = (Total Base Rent − Free Rent Value − TI Allowance) ÷ (Rentable Area × Lease Years). For a 2,300 RSF suite with $293,064 in 5-year base rent, 2 months free rent ($9,200), and a $23,000 TI allowance, the net effective rent is $22.68/SF/year compared to the $24.00 nominal quoted rate.`,
  },
  {
    q: 'How do commercial rent escalations work?',
    a: `Commercial leases almost always contain an escalation clause specifying how rent increases each year. Common escalation types include: 1) Fixed percentage increase each year (the rate is negotiated); 2) Fixed step dollar increase (e.g., +$1.00/SF each year); or 3) Consumer Price Index (CPI) adjustments linked to inflation. In NNN leases, escalations typically apply to base rent only, though some leases escalate all occupancy costs.`,
  },
  {
    q: 'Are utilities included in an NNN commercial lease?',
    a: `In most Triple Net (NNN) leases, utilities inside the tenant's private suite (electricity, natural gas, internet, interior water) are separately metered and paid directly by the tenant to utility providers. Common area utilities (parking lot lighting, exterior water for landscaping, lobby heating) are included within the building's CAM pass-through expenses. Always review Section 5 of your commercial lease agreement to verify utility metering responsibilities.`,
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Commercial Lease Calculator',
  applicationCategory: 'BusinessApplication',
  path: route.path,
  description: route.description,
});

const faqSchema = buildFaqSchema(faqs);

export default function CommercialLeaseCalculatorPage() {
  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={faqSchema} />

      <main className={styles.main}>
        <Breadcrumbs
          items={[
            { name: 'Calculators', path: ROUTES.tools.path },
            { name: 'Commercial Lease Calculator', path: route.path },
          ]}
        />

        <header className={styles.header}>
          <h1 className={`${styles.h1} ${toolDisplayFont.className}`}>
            Commercial Lease Calculator: Rent per Square Foot, NNN &amp; CAM
          </h1>
          <p className={styles.lead}>
            Calculate monthly and annual commercial rent per square foot. Model Triple Net (NNN), full-service Gross,
            and Modified Gross structures, factor in load factors (usable vs. rentable space), annual escalations, free rent,
            and tenant improvement (TI) allowances.
          </p>
          <div className={styles.meta}>
            Published by KKC Tools Commercial Real Estate Advisory Team · BOMA &amp; CCIM Standards Aligned
          </div>
        </header>

        {/* BLUF Summary Card */}
        <div className={styles.blufBox}>
          <strong>Bottom Line Up Front (BLUF):</strong> Commercial rent is typically quoted per rentable square foot per
          year ($/SF/yr). To find monthly rent, multiply the rate by your rentable area and divide by 12, then add NNN
          pass-throughs. In our verified benchmark, <strong>2,000 usable sq ft</strong> at a <strong>15% load factor</strong> equals{' '}
          <strong>2,300 rentable sq ft</strong>. At <strong>$24.00/SF/yr base rent</strong> plus <strong>$8.00/SF/yr NNN pass-throughs</strong> ($3 tax, $1 ins, $4 CAM), Year 1 costs{' '}
          <strong>$6,133.33 per month</strong>. Over a 5-year term with 3% annual base escalations, 2 months of free rent (−$9,200), and a $10/SF TI allowance ($23,000), total occupancy cost equals{' '}
          <strong>$375,864.30</strong> ($6,264.40/mo average) with a <strong>$22.68/SF/yr net effective rent</strong>.
        </div>

        {/* Interactive Calculator Shell */}
        <section className={styles.toolSection} aria-label="Interactive Commercial Lease Calculator">
          <CommercialLeaseCalculator />
        </section>

        <AdSlot slotId="lease-calculator-top" />

        {/* Comprehensive Editorial & Reference Guide */}
        <article className={styles.article}>
          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>How to Use This Commercial Lease Calculator</h2>
            <p className={styles.p}>
              Evaluating commercial real estate leases requires analyzing base rent, pass-through expenses, and landlord
              concessions over the entire term. This calculator offers four specialized underwriting tabs:
            </p>
            <ol style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li>
                <strong>Tab 1 — Lease Cost &amp; Occupancy:</strong> Enter your usable suite size, building load factor,
                quoted base rate, lease type (NNN, Gross, Modified Gross), operating pass-throughs, annual escalations, and
                concessions to generate a full multi-year schedule and calculate your true net effective rent.
              </li>
              <li>
                <strong>Tab 2 — Compare 2 Offers:</strong> Pit two competing property proposals side by side (for example,
                a $24/SF NNN lease with pass-throughs versus a $32/SF full-service Gross lease) to determine which space
                saves more total capital over the full lease commitment.
              </li>
              <li>
                <strong>Tab 3 — CAM Pro-Rata Share:</strong> Input your suite square footage, total building rentable area,
                and gross building maintenance budget to determine your exact mathematical CAM share percentage.
              </li>
              <li>
                <strong>Tab 4 — Percentage Rent (Retail):</strong> Model retail leases with natural or negotiated breakpoints
                to calculate potential overage rent owed on annual retail sales.
              </li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>How Commercial Rent is Calculated (per Square Foot)</h2>
            <p className={styles.p}>
              Unlike residential rentals where landlords quote a single monthly figure ($2,500/month), commercial office,
              industrial, and retail spaces are quoted on a unit-area basis. In the United States, rates are quoted as{' '}
              <strong>dollars per square foot per year ($/SF/year)</strong>. In some coastal markets (such as California
              industrial parks), brokers occasionally quote <strong>dollars per square foot per month ($/SF/month)</strong>.
            </p>
            <p className={styles.p}>The core commercial rent conversion formulas are:</p>

            <div className={styles.formulaBox}>
              Annual Base Rent = Rentable Square Footage (RSF) × Quoted $/SF/Year Rate
              <br />
              Monthly Base Rent = Annual Base Rent ÷ 12 = (RSF × Quoted $/SF/Year) ÷ 12
              <br />
              Annual $/SF/Year = Monthly $/SF/Month × 12
              <br />
              Total Monthly Occupancy Cost = Monthly Base Rent + Monthly NNN Pass-Through Charges
            </div>

            <p className={styles.p}>
              For example, if you lease a 2,300 RSF warehouse quoted at $24.00/SF/year base rent with $8.00/SF/year in
              pass-through taxes, insurance, and CAM, your breakdown is:
            </p>
            <ul style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li>Base Rent: 2,300 RSF × $24.00 = $55,200.00 / year ($4,600.00 / month).</li>
              <li>Pass-Through Charges: 2,300 RSF × $8.00 = $18,400.00 / year ($1,533.33 / month).</li>
              <li>Total Year 1 Occupancy Outlay: $55,200 + $18,400 = <strong>$73,600.00 / year ($6,133.33 / month)</strong>.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Gross vs. Modified Gross vs. Triple Net (NNN) Leases</h2>
            <p className={styles.p}>
              The lease structure determines who absorbs unexpected increases in property taxes, insurance premiums, and
              building maintenance:
            </p>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Lease Structure</th>
                    <th>Base Rent Level</th>
                    <th>Property Taxes</th>
                    <th>Building Insurance</th>
                    <th>CAM &amp; Maintenance</th>
                    <th>Suite Utilities</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Full Service Gross</strong></td>
                    <td>Highest ($$$)</td>
                    <td>Landlord pays</td>
                    <td>Landlord pays</td>
                    <td>Landlord pays</td>
                    <td>Landlord pays (often base)</td>
                  </tr>
                  <tr>
                    <td><strong>Modified Gross</strong></td>
                    <td>Medium ($$)</td>
                    <td>Negotiated (or Landlord)</td>
                    <td>Negotiated (or Landlord)</td>
                    <td>Tenant pays share</td>
                    <td>Tenant pays directly</td>
                  </tr>
                  <tr>
                    <td><strong>Triple Net (NNN)</strong></td>
                    <td>Lower base ($)</td>
                    <td>Tenant pays pro-rata</td>
                    <td>Tenant pays pro-rata</td>
                    <td>Tenant pays pro-rata</td>
                    <td>Tenant pays directly</td>
                  </tr>
                  <tr>
                    <td><strong>Absolute NNN</strong></td>
                    <td>Lowest base ($)</td>
                    <td>Tenant pays all</td>
                    <td>Tenant pays all</td>
                    <td>Tenant pays all (incl. roof/structure)</td>
                    <td>Tenant pays directly</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className={styles.p}>
              In a <strong>Triple Net (NNN)</strong> lease, the tenant bears all risk of escalating municipal property taxes
              or soaring insurance rates. If property taxes jump 20% following a municipal reassessment, the tenant&apos;s monthly
              operating charge increases immediately. In a <strong>Full Service Gross</strong> lease, the landlord absorbs that
              inflation risk, which is why gross base rates are higher upfront.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>
              Rentable vs. Usable Square Feet and the Building Load Factor (BOMA)
            </h2>
            <p className={styles.p}>
              One of the most frequent surprises for first-time commercial tenants is discovering that the square footage on
              their lease agreement exceeds the physical area inside their private office or suite doors.
            </p>
            <p className={styles.p}>
              Commercial property owners measure buildings using standards established by the Building Owners and Managers
              Association (BOMA):
            </p>
            <ul style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li>
                <strong>Usable Square Footage (USF):</strong> The actual private interior space your business occupies, measured
                from the interior finished surface of exterior walls to the centerline of shared partition demising walls.
              </li>
              <li>
                <strong>Rentable Square Footage (RSF):</strong> The usable square footage plus your proportionate share of
                shared common areas: multi-story entrance lobbies, public restrooms, elevators, stairwells, and mechanical rooms.
              </li>
              <li>
                <strong>Load Factor (Add-On Factor):</strong> The mathematical ratio used to convert usable space into rentable
                space. Formula: <code>Rentable Area = Usable Area × (1 + Load Factor %)</code>.
              </li>
            </ul>
            <p className={styles.p}>
              If your suite measures 2,000 USF and the office building has a 15% load factor, your lease is calculated on{' '}
              <strong>2,300 RSF</strong>. At $24/SF base rent, you pay $7,200 per year ($600/month) specifically for your
              proportionate share of the building&apos;s lobbies and hallways. To verify room dimensions, use our free{' '}
              <Link href={ROUTES.squareFootageCalculator.path} style={{ color: 'var(--accent, #2563eb)', fontWeight: 600 }}>
                Square Footage Calculator
              </Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>CAM Expenses: How Your Pro-Rata Share is Calculated</h2>
            <p className={styles.p}>
              Common Area Maintenance (CAM) charges cover the day-to-day operation and upkeep of shared facilities. In an NNN
              lease, each tenant pays their exact proportionate share:
            </p>
            <div className={styles.formulaBox}>
              Tenant Pro-Rata Share % = (Tenant RSF ÷ Total Building RSF) × 100
              <br />
              Tenant Annual CAM Charge = Total Building Annual CAM Budget × (Tenant Pro-Rata Share % ÷ 100)
            </div>
            <p className={styles.p}>
              For instance, if you occupy 2,300 RSF in a commercial building totaling 50,000 RSF, your share is{' '}
              <strong>4.60%</strong> (2,300 ÷ 50,000). If the landlord&apos;s total annual budget for parking lot maintenance, snow
              removal, landscaping, exterior security, and janitorial services equals $200,000, your annual CAM obligation is{' '}
              <strong>$9,200.00</strong> ($766.67 per month, or $4.00/RSF/year).
            </p>
            <p className={styles.p}>
              <em>Tenant Negotiation Tip:</em> Savvy commercial tenants insist on a <strong>CAM Cap</strong> during lease
              negotiations (a limit on how much controllable CAM charges can rise each year) and retain an audit right to
              inspect the landlord&apos;s itemized invoices.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Rent Escalations: Fixed %, Steps, and CPI</h2>
            <p className={styles.p}>
              Because commercial leases span 3, 5, 10, or 15 years, landlords mandate contractual annual price increases to
              protect against inflation:
            </p>
            <ul style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li>
                <strong>Fixed Percentage Increase:</strong> The most common structure. Rent increases by a compound percentage
                each anniversary (typically 2.5% to 3.5%). In our 5-year worked example with a 3% escalation, the base rate moves
                from $24.00 in Year 1 to $24.72 in Year 2, $25.46 in Year 3, $26.23 in Year 4, and $27.01 in Year 5.
              </li>
              <li>
                <strong>Fixed Dollar Steps:</strong> Base rent increases by a flat dollar rate per square foot each year (e.g.,
                +$1.00/SF annually), moving from $20.00 to $21.00, $22.00, etc.
              </li>
              <li>
                <strong>CPI Adjustments:</strong> Escalations tied to the Bureau of Labor Statistics Consumer Price Index. These
                often feature a collar—such as a 2% floor and a 5% ceiling—to maintain predictability.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Free Rent, TI Allowance, and Net Effective Rent</h2>
            <p className={styles.p}>
              Nominal quoted rates rarely tell the whole economic story. In soft commercial markets, landlords offer substantial
              upfront concessions to attract creditworthy tenants while keeping the headline rate high for property valuation purposes
              (see our{' '}
              <Link href={ROUTES.capRateCalculator.path} style={{ color: 'var(--accent, #2563eb)', fontWeight: 600 }}>
                Cap Rate Calculator
              </Link>):
            </p>
            <ul style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li>
                <strong>Free Rent (Rent Abatement):</strong> Landlords frequently grant 1 to 6 months of free base rent during
                the initial occupancy period. On a 2,300 RSF suite at $24/SF, 2 months of free base rent saves the tenant{' '}
                <strong>$9,200.00</strong>.
              </li>
              <li>
                <strong>Tenant Improvement (TI) Allowance:</strong> A cash construction contribution (e.g., $10/SF = $23,000.00)
                provided by the landlord to build out private offices, conference rooms, or client reception desks.
              </li>
            </ul>
            <p className={styles.p}>
              To compare lease proposals accurately, commercial underwriters compute <strong>Net Effective Rent</strong>:
            </p>
            <div className={styles.formulaBox}>
              Net Effective Rent ($/SF/year) = [Total Contract Base Rent − Free Rent Value − TI Allowance] ÷ [RSF × Lease Years]
            </div>
            <p className={styles.p}>
              In our baseline example: Total 5-year base rent ($293,064.30) minus free rent ($9,200.00) minus TI ($23,000.00) equals
              $260,864.30 net tenant outlay. Dividing by 11,500 total square-foot-years (2,300 RSF × 5 years) yields an effective rate of{' '}
              <strong>$22.68 per square foot per year</strong>—a full <strong>$1.32/SF discount</strong> below the nominal $24.00 headline rate.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Percentage Rent for Retail Shopping Centers</h2>
            <p className={styles.p}>
              In retail leases (such as shopping malls, lifestyle centers, and outlet villages), landlords frequently charge a base
              minimum rent plus <strong>percentage rent (overage rent)</strong> tied directly to gross sales receipts.
            </p>
            <p className={styles.p}>
              Percentage rent begins only after retail sales surpass a defined <strong>breakpoint</strong>:
            </p>
            <ul style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li>
                <strong>Natural Breakpoint:</strong> Calculated as <code>Annual Base Rent ÷ Percentage Rent Rate</code>. If base
                rent is $60,000/year and the lease specifies a 6% overage rate, the natural breakpoint is $1,000,000 ($60,000 ÷ 0.06).
              </li>
              <li>
                <strong>Overage Calculation:</strong> The retailer pays percentage rent only on sales exceeding $1,000,000. If gross
                sales reach $1,200,000, the overage rent is ($1,200,000 − $1,000,000) × 6% = <strong>$12,000.00</strong>, bringing
                total annual rent to $72,000.00.
              </li>
            </ul>
          </section>

          {/* FAQ Accordion Section */}
          <section className={styles.faqSection}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Frequently Asked Questions About Commercial Leases</h2>
            {faqs.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <details>
                  <summary>{faq.q}</summary>
                  <div className={styles.faqAnswer}>{faq.a}</div>
                </details>
              </div>
            ))}
          </section>

          {/* Method and Citations Block */}
          <HowWeCalculate slug="commercial-lease-calculator" />

          {/* Legal Disclaimer */}
          <div style={{ margin: '32px 0', padding: '16px', background: 'var(--surface-2, #f8fafc)', borderRadius: '8px', fontSize: '0.825rem', color: 'var(--muted, #64748b)', lineHeight: 1.5 }}>
            <strong>Legal &amp; Financial Disclaimer:</strong> This commercial lease calculator provides mathematical planning estimates for informational purposes only. Commercial lease agreements contain complex legal provisions, indemnification clauses, property tax assessment escalations, and operating expense exclusion definitions. Always retain a qualified commercial real estate attorney and tenant representation broker to review formal lease documentation before executing contracts.
          </div>

          {/* Related Tools Cross-Links */}
          <section className={styles.relatedSection}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Related Commercial &amp; Investment Calculators</h2>
            <div className={styles.relatedGrid}>
              <Link href={ROUTES.commercialMortgageCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Commercial Mortgage Calculator</div>
                <div className={styles.relatedDesc}>
                  Calculate monthly commercial debt service, balloon payments at maturity, LTV, and DSCR.
                </div>
              </Link>
              <Link href={ROUTES.capRateCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Cap Rate Calculator</div>
                <div className={styles.relatedDesc}>
                  Underwrite commercial property capitalization rates, estimate building value from NOI, and model exit cap rates.
                </div>
              </Link>
              <Link href={ROUTES.rentalPropertyCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Rental Property Calculator</div>
                <div className={styles.relatedDesc}>
                  Calculate monthly rental cash flow, cash-on-cash return, DSCR, and 10-year equity pro forma models.
                </div>
              </Link>
              <Link href={ROUTES.laborCostCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Labor Cost Calculator</div>
                <div className={styles.relatedDesc}>
                  Calculate fully burdened hourly labor rates with US payroll tax caps, overtime, and crew project estimates.
                </div>
              </Link>
              <Link href={ROUTES.equipmentLoanCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Equipment Loan Calculator</div>
                <div className={styles.relatedDesc}>
                  Calculate equipment financing payments, lease vs buy comparison, balloon payoff, and MCA factor APR.
                </div>
              </Link>
              <Link href={ROUTES.squareFootageCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Square Footage Calculator</div>
                <div className={styles.relatedDesc}>
                  Measure suite dimensions, room areas, and calculate square feet or square meters for commercial layouts.
                </div>
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
