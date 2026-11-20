import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import LaborCostCalculator from '@/components/tool/labor-cost-calculator';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.laborCostCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const faqs = [
  {
    q: 'What is labor burden and what is a burdened labor rate?',
    a: `Labor burden represents the indirect costs of employing a worker beyond their gross base wage or salary. This includes mandatory employer payroll taxes (Social Security, Medicare, FUTA, SUTA), workers' compensation insurance, general liability policies, paid time off (holidays, vacation, sick leave), and company-sponsored benefits such as health insurance and retirement plans. The burdened labor rate is the total annual cost of the employee divided by either their total paid hours or their actual productive (billable) hours.`,
  },
  {
    q: 'How do I calculate the true hourly cost of an employee?',
    a: `To calculate the true hourly cost of an employee: 1) Calculate total annual gross wages (hourly wage × paid hours + overtime); 2) Add mandatory employer payroll taxes (Social Security at 6.2% up to the wage base cap, Medicare at 1.45%, FUTA, and state SUTA); 3) Add workers' compensation insurance based on gross payroll; 4) Add employer-paid benefits (health insurance, 401k match); 5) Sum these to find the total annual employee cost; and 6) Divide the total cost by actual productive hours (paid hours minus paid holidays, vacation, and sick leave). For example, a $30/hour worker ($62,400 wages) costs $76,535.60 annually, or $39.86 per productive hour across 1,920 working hours.`,
  },
  {
    q: 'What payroll taxes does an employer pay in the United States?',
    a: `In the United States, employers pay matching FICA taxes and unemployment taxes under federal and state law: 1) Social Security (OASDI): 6.2% of wages up to the annual statutory wage base ($184,500 in 2026); 2) Medicare (Hospital Insurance): 1.45% of all wages with no wage base ceiling; 3) Federal unemployment tax (FUTA), paid on the first part of each employee’s wages, with an effective rate that depends on state credits (see the IRS FUTA guidance); and 4) State unemployment tax (SUTA), whose rate and taxable wage base are set by each state and your experience rating. Enter your FUTA and SUTA figures in the calculator.`,
  },
  {
    q: 'How do I estimate labor costs for construction projects?',
    a: `To estimate construction labor costs accurately: 1) Break the project into specific scopes of work (e.g., framing, drywall hanging, electrical rough-in); 2) Determine crew composition and labor hours needed per task based on historical production rates; 3) Multiply required hours by each crew member's fully burdened productive hourly rate (not their base take-home wage); 4) Add overtime allowances if the schedule requires weekend or 40+ hour weeks; 5) Combine direct labor with materials, equipment rentals, and subcontractor bids to find direct job costs; and 6) Apply company overhead markup (e.g., 10%–20%) and targeted profit margin (e.g., 10%–15%) to establish your final client quote.`,
  },
  {
    q: 'How much should I charge per hour for contract labor?',
    a: `What you charge per hour (your billing rate) must exceed your burdened labor cost to cover company overhead and generate a profit. The standard formula is: Hourly Billing Rate = (Burdened Productive Hourly Cost × (1 + Overhead Markup %)) ÷ (1 − Profit Margin %). For example, if your burdened productive cost is $39.86/hour, overhead is 15%, and your target profit margin is 10%, your baseline billing rate should be ($39.86 × 1.15) ÷ 0.90 = $50.93 per billable hour.`,
  },
  {
    q: 'Is labor cost a fixed or variable cost?',
    a: `Labor can be either fixed, variable, or semi-variable depending on employee classification and business model. Salaried administrative staff, estimators, and project managers represent fixed labor costs because their compensation remains constant regardless of production volume. Hourly field tradespeople, carpenters, and temporary labor are variable costs because total hours fluctuate directly with project workload. When evaluating project quotes, direct site labor is treated as a variable direct cost.`,
  },
  {
    q: 'How do overtime hours change labor cost under the FLSA?',
    a: `Under the Fair Labor Standards Act (FLSA), non-exempt employees must receive overtime pay at not less than 1.5 times their regular hourly rate for all hours worked over 40 in a workweek. Overtime increases direct hourly wages by 50%, which also increases wage-sensitive burden components such as Medicare (1.45%) and workers' compensation insurance. However, fixed annual benefits (such as health insurance) and capped taxes (Social Security once past the cap, FUTA) do not increase during overtime hours, creating a blended effective burden.`,
  },
  {
    q: 'Employee vs. subcontractor: which is cheaper for a small business?',
    a: `A 1099 subcontractor appears more expensive on an hourly basis (e.g., $50/hour vs. a $30/hour employee wage), but subcontractors cover their own payroll taxes (15.3% self-employment tax), workers' comp, health insurance, tools, and downtime. An employee carries a labor burden on top of the wage (in this calculator’s example, a $30/hour wage costs $39.86 per productive hour) and must be paid for non-billable downtime, holidays, and slow seasons. Compare the subcontractor’s hourly rate with your burdened cost per productive hour for the number of hours you actually need: occasional or specialised work often favours a sub, while steady full-time work often favours an employee. Note: Worker classification must adhere strictly to IRS Common Law Rules and DOL guidelines, not personal preference.`,
  },
  {
    q: 'How do I calculate labor cost as a percentage of sales?',
    a: `To calculate labor cost as a percentage of revenue: divide your total annual labor costs (gross payroll + all employer taxes + workers' comp + benefits) by total gross revenue, then multiply by 100. Formula: Labor Cost % = (Total Labor Cost ÷ Gross Revenue) × 100. For example, if a remodeling contractor generates $300,000 in annual revenue and incurs $76,536 in total labor costs, their labor percentage is ($76,536 ÷ $300,000) × 100 = 25.5%.`,
  },
  {
    q: 'Does this labor cost calculator work for businesses outside the United States?',
    a: `Yes. In Tab 1, switch the Country Mode toggle from "United States" to "International". This replaces specific US tax fields (FICA, FUTA, SUTA) with a single "Employer On-Costs %" field. Enter your jurisdiction's statutory employer surcharge—such as UK Employer National Insurance (~13.8%–15%), Australian Superannuation Guarantee (11.5%–12%), or Canadian CPP and EI—to compute your exact burdened rate anywhere in the world.`,
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Labor Cost Calculator',
  applicationCategory: 'BusinessApplication',
  path: route.path,
  description: route.description,
});

const faqSchema = buildFaqSchema(faqs);

export default function LaborCostCalculatorPage() {
  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={faqSchema} />

      <main className={styles.main}>
        <Breadcrumbs
          items={[
            { name: 'Calculators', path: ROUTES.tools.path },
            { name: 'Labor Cost Calculator', path: route.path },
          ]}
        />

        <header className={styles.header}>
          <h1 className={`${styles.h1} ${toolDisplayFont.className}`}>
            Labor Cost Calculator: True Hourly Cost of a Worker or Crew
          </h1>
          <p className={styles.lead}>
            Calculate the fully burdened hourly labor rate of any employee or construction trade. Account for US payroll
            tax caps (Social Security, Medicare, FUTA, SUTA), workers&apos; compensation insurance, paid time off, and
            estimate profitable crew quotes with customizable overhead and profit markups.
          </p>
          <div className={styles.meta}>
            Published by KKC Tools Financial &amp; Construction Engineering Team · Updated for 2026 Tax Rules (IRS Pub. 15, SSA Wage Base $184,500)
          </div>
        </header>

        {/* BLUF Summary Card */}
        <div className={styles.blufBox}>
          <strong>Bottom Line Up Front (BLUF):</strong> Labor cost is everything an employer pays to secure an hour of
          productive work, not just the base wage. A <strong>$30.00/hour</strong> employee costs{' '}
          <strong>$76,535.60 annually</strong> once mandatory employer payroll taxes ($5,015.60), workers&apos; compensation ($3,120.00),
          and benefits ($6,000.00) are added. When 160 hours of paid holidays and vacation are deducted, the employee yields{' '}
          <strong>1,920 productive hours</strong>, pushing the true burdened cost to{' '}
          <strong>$39.86 per billable hour</strong>—a <strong>22.65% labor burden</strong>.
        </div>

        {/* Interactive Calculator Shell */}
        <section className={styles.toolSection} aria-label="Interactive Labor Cost Calculator">
          <LaborCostCalculator />
        </section>

        <AdSlot slotId="labor-calculator-top" />

        {/* Comprehensive Editorial & Reference Guide */}
        <article className={styles.article}>
          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>What is Labor Cost? (Direct vs. Indirect Burden)</h2>
            <p className={styles.p}>
              In business accounting and construction management, <strong>labor cost</strong> represents the total economic
              expenditure required to employ human personnel. Many small business owners and independent contractors make
              the catastrophic mistake of equating labor cost with the hourly wage written on a paycheck. In reality, a
              worker earning $30 per hour costs their employer substantially more every single minute they are on the job.
            </p>
            <p className={styles.p}>
              Economists and certified cost estimators divide total labor into two distinct categories:
            </p>
            <ul style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li>
                <strong>Direct Labor:</strong> The wages paid directly for hours spent physically working on a client
                project, assembling products, framing walls, or delivering billable services.
              </li>
              <li>
                <strong>Labor Burden (Indirect Costs):</strong> The mandatory and customary overhead associated with employing
                that worker. This encompasses employer-side payroll taxes (FICA and unemployment), statutory workers&apos;
                compensation coverage, liability insurance, paid leave (holidays, vacation, sick days), retirement contributions,
                health insurance premiums, uniforms, and mandatory safety training.
              </li>
            </ul>
            <p className={styles.p}>
              When you fail to incorporate labor burden into your customer quotes, those statutory overhead costs come
              directly out of your company&apos;s net profit margin. Understanding your burdened labor rate is the single most
              critical prerequisite for sustainable business pricing.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>How to Use This Labor Cost Calculator</h2>
            <p className={styles.p}>
              This calculator provides three integrated calculation workflows tailored for business owners, contractors, and financial managers:
            </p>
            <ol style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li>
                <strong>Tab 1 — True Employee Cost:</strong> Enter an individual worker&apos;s hourly wage or annual salary,
                annual paid hours, non-billable time off, and specific insurance and benefit costs. The engine computes both
                the annual employer outlay and the true cost per productive hour.
              </li>
              <li>
                <strong>Tab 2 — Job Labor &amp; Quote:</strong> Build multi-person crew estimates. Enter hours and burdened
                rates for lead trades, journeymen, and helpers, add direct materials and subcontractor costs, and apply company
                overhead and profit margins to generate an exact client bid.
              </li>
              <li>
                <strong>Tab 3 — Labor % of Revenue:</strong> Compare your total payroll spending against gross business revenue
                to evaluate your company&apos;s labor efficiency ratio and identify potential payroll bloat.
              </li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>
              Fully Burdened Labor Rate: Mathematical Formula &amp; Step-by-Step Example
            </h2>
            <p className={styles.p}>
              The mathematical formula to determine the fully burdened hourly rate requires isolating total economic cost
              and dividing by productive working hours:
            </p>

            <div className={styles.formulaBox}>
              Total Annual Cost = Gross Wages + Payroll Taxes + Insurance + Benefits + Other On-Costs
              <br />
              Productive Hours = Total Paid Hours − (Holidays + Vacation/PTO + Sick Leave + Training)
              <br />
              Burdened Rate per Productive Hour = Total Annual Cost ÷ Productive Hours
              <br />
              Labor Burden % = [(Total Annual Cost − Gross Wages) ÷ Gross Wages] × 100
            </div>

            <p className={styles.p}>
              Let us walk through the exact numbers from our verified engine benchmark for a full-time tradesperson earning{' '}
              <strong>$30.00 per hour</strong> on a standard 2,080-hour work year (40 hours per week for 52 weeks):
            </p>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Cost Component</th>
                    <th>Calculation Basis</th>
                    <th>Annual Amount ($)</th>
                    <th>% of Base Wage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Gross Base Wages</strong></td>
                    <td>2,080 paid hours × $30.00/hr</td>
                    <td>$62,400.00</td>
                    <td>100.00%</td>
                  </tr>
                  <tr>
                    <td>Social Security (FICA)</td>
                    <td>6.2% of wages (capped at $184,500)</td>
                    <td>$3,868.80</td>
                    <td>6.20%</td>
                  </tr>
                  <tr>
                    <td>Medicare (FICA)</td>
                    <td>1.45% of wages (no statutory cap)</td>
                    <td>$904.80</td>
                    <td>1.45%</td>
                  </tr>
                  <tr>
                    <td>FUTA (Federal Unemployment)</td>
                    <td>0.6% effective on first $7,000</td>
                    <td>$42.00</td>
                    <td>0.07%</td>
                  </tr>
                  <tr>
                    <td>SUTA (State Unemployment)</td>
                    <td>2.0% state example on first $10,000</td>
                    <td>$200.00</td>
                    <td>0.32%</td>
                  </tr>
                  <tr>
                    <td>Workers&apos; Compensation</td>
                    <td>$5.00 per $100 of gross payroll</td>
                    <td>$3,120.00</td>
                    <td>5.00%</td>
                  </tr>
                  <tr>
                    <td>Healthcare &amp; Benefits</td>
                    <td>Employer premium contribution</td>
                    <td>$6,000.00</td>
                    <td>9.62%</td>
                  </tr>
                  <tr>
                    <td><strong>Total Annual Employer Outlay</strong></td>
                    <td>Sum of all direct and indirect costs</td>
                    <td><strong>$76,535.60</strong></td>
                    <td><strong>122.65%</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className={styles.p}>
              Notice the labor burden dollar amount: <strong>$14,135.60</strong> above wages, representing an additional{' '}
              <strong>22.65%</strong> cost burden.
            </p>
            <p className={styles.p}>
              Now examine hours. Out of 2,080 paid hours, the employee receives 80 hours of paid federal holidays (10 days) and
              80 hours of paid vacation (10 days). Total time off equals <strong>160 hours</strong>. The employee is physically
              on job sites performing billable work for only <strong>1,920 productive hours</strong> per year.
            </p>
            <p className={styles.p}>
              Dividing $76,535.60 by 2,080 paid hours yields $36.80/hour. But if you price customer projects at $36.80, you will
              fall short by $6,378 at the end of the year because you are not billing for the 160 hours the worker was on paid leave!
              Dividing by <strong>1,920 productive hours</strong> reveals the true breakeven cost:{' '}
              <strong>$39.86 per productive hour</strong>.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Employer Payroll Taxes and Statutory Wage Base Caps</h2>
            <p className={styles.p}>
              Unlike simplified online calculators that multiply wages by flat percentages, our engine strictly implements
              official federal and state statutory wage base ceilings:
            </p>
            <ul style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li>
                <strong>Social Security (OASDI):</strong> Employers pay a mandatory 6.2% matching tax. Under official Social
                Security Administration (SSA) rules, this tax applies only up to the statutory wage base cap—set at{' '}
                <strong>$184,500 for 2026</strong>. Any compensation paid to an executive or senior manager beyond $184,500 incurs{' '}
                <strong>$0 in additional employer Social Security tax</strong>.
              </li>
              <li>
                <strong>Medicare:</strong> Employers pay 1.45% on all employee wages. Under the Internal Revenue Code, there is{' '}
                <strong>no wage base limit</strong> for employer Medicare taxes. (Note: The 0.9% Additional Medicare Tax applies solely
                to high-earning employees and is withheld from their pay; employers do not match it).
              </li>
              <li>
                <strong>FUTA (Federal Unemployment Tax Act):</strong> The headline rate is 6.0% on the first $7,000 of wages per
                employee. However, employers in states without credit reductions receive a maximum 5.4% credit, resulting in an
                effective net federal tax rate of <strong>0.6%</strong>, or a flat <strong>$42.00 per worker per year</strong>.
              </li>
              <li>
                <strong>SUTA (State Unemployment Tax Act):</strong> Every state sets its own taxable wage base and assigns employers an experience-rated tax rate,
                so check your state&apos;s workforce agency for your figures. Once an employee&apos;s year-to-date earnings exceed the state threshold, SUTA contributions cease.
              </li>
              <li>
                <strong>Workers&apos; Compensation Insurance:</strong> Mandated in nearly all states, premiums are charged per $100
                of gross payroll based on classification codes (NAICS/NCCI). Clerical office staff may cost $0.25 per $100, while
                roofing, structural steel, or framing carpenters often exceed $12.00 to $25.00 per $100 of wages.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Paid Hours vs. Productive Hours (The Contractor&apos;s Blindspot)</h2>
            <p className={styles.p}>
              The single most common reason construction subcontractors and specialty trade contractors fail to achieve their
              projected profit margins is confusing <em>paid hours</em> with <em>productive (billable) hours</em>.
            </p>
            <p className={styles.p}>
              A full-time employee is typically paid for 52 weeks at 40 hours per week, totaling 2,080 paid hours. However, no human
              spends 2,080 hours swinging a hammer, pulling wire, or writing code on client jobs. Non-billable paid hours include:
            </p>
            <ul style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li>Statutory paid holidays (New Year&apos;s, Memorial Day, July 4th, Labor Day, Thanksgiving, Christmas): 48–80 hours.</li>
              <li>Paid vacation or paid time off (PTO): 80–120 hours.</li>
              <li>Paid sick leave and bereavement: 24–40 hours.</li>
              <li>Mandatory OSHA safety training, tool box talks, licensing continuing education: 16–32 hours.</li>
              <li>Shop maintenance, vehicle loading, warehouse inventory: 20–40 hours.</li>
            </ul>
            <p className={styles.p}>
              In practice, a full-time tradesperson yields between 1,750 and 1,920 productive billable hours per year. If you base your
              labor billing rates on 2,080 hours, you are absorbing 160 to 330 hours of compensation and payroll taxes entirely out of
              pocket. Always price your customer bids using the <strong>burdened rate per productive hour</strong>.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>How to Estimate Labor Costs for Construction Projects</h2>
            <p className={styles.p}>
              When creating competitive bids for residential remodeling, commercial tenant improvements, or new construction,
              follow this proven four-step labor estimating process:
            </p>
            <ol style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li>
                <strong>Define Crew Composition:</strong> Identify the specific team required for the scope. For example, a framing
                crew might consist of one Lead Carpenter ($45/hr burdened), one Journeyman ($38/hr burdened), and one Apprentice ($28/hr burdened).
              </li>
              <li>
                <strong>Calculate Total Man-Hours:</strong> Estimate the time needed based on production rates (e.g., framing 150 linear
                feet of exterior wall at 0.08 man-hours per linear foot = 12 total crew hours).
              </li>
              <li>
                <strong>Calculate Direct Labor Subtotal:</strong> Multiply each worker&apos;s hours by their burdened rate. In our worked
                example of three tradespeople working a 40-hour week (120 total labor hours at a $39.86 burdened rate), direct job
                labor equals <strong>$4,783.48</strong>.
              </li>
              <li>
                <strong>Stack Overhead and Profit:</strong> Add direct materials, equipment rentals, and subcontractor bids. Then apply
                company overhead markup (e.g., 15%) and target profit (e.g., 10%) to reach your final customer quote of{' '}
                <strong>$6,051.10</strong>.
              </li>
            </ol>
            <p className={styles.p}>
              To assemble comprehensive project estimates combining materials, equipment, and labor, utilize our free{' '}
              <Link href={ROUTES.constructionEstimateTemplate.path} style={{ color: 'var(--accent, #2563eb)', fontWeight: 600 }}>
                Construction Estimate Template
              </Link>{' '}
              and check your markups with the{' '}
              <Link href={ROUTES.markupCalculator.path} style={{ color: 'var(--accent, #2563eb)', fontWeight: 600 }}>
                Markup Calculator
              </Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Overhead, Profit, Markup vs. Margin in Labor Pricing</h2>
            <p className={styles.p}>
              One of the most dangerous arithmetic errors contractors commit is conflating <strong>markup</strong> with{' '}
              <strong>margin</strong> when pricing labor:
            </p>
            <ul style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li>
                <strong>Markup %</strong> is calculated as a percentage of your costs: <code>(Price − Cost) ÷ Cost</code>. Adding a
                25% markup to a $100 job yields a $125 price.
              </li>
              <li>
                <strong>Gross Margin %</strong> is calculated as a percentage of the final selling price:{' '}
                <code>(Price − Cost) ÷ Price</code>. On that same $125 price with $100 cost, your margin is only 20% ($25 ÷ $125).
              </li>
            </ul>
            <p className={styles.p}>
              Our calculator allows you to toggle between traditional sequential markup (Direct Cost × (1 + Overhead %) × (1 + Profit %))
              and margin pricing (ensuring your target profit percentage reflects actual bottom-line revenue). To explore the full
              mathematical relationship, refer to our{' '}
              <Link href={ROUTES.profitMarginCalculator.path} style={{ color: 'var(--accent, #2563eb)', fontWeight: 600 }}>
                Profit Margin Calculator
              </Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Labor Cost as a Percentage of Revenue</h2>
            <p className={styles.p}>
              Financial analysts and commercial lenders track <strong>Labor % of Revenue</strong> as a primary indicator of
              operational health. The formula is straightforward:
            </p>
            <div className={styles.formulaBox}>
              Labor Cost % of Revenue = (Total Annual Labor Cost ÷ Gross Annual Revenue) × 100
            </div>
            <p className={styles.p}>
              A &quot;good&quot; labor percentage depends heavily on the industry and business model, so we don&apos;t print
              benchmark ranges we can&apos;t cite. Useful comparisons are:
            </p>
            <ul style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li><strong>Your own history:</strong> track the percentage month by month and investigate jumps.</li>
              <li><strong>Your budget:</strong> set a target that still leaves room for materials, overhead and profit.</li>
              <li><strong>Industry data you can cite:</strong> trade associations and published financial benchmarks for your sector.</li>
            </ul>
            <p className={styles.p}>
              If your labor percentage creeps above historical industry norms, it indicates that field crews are underproducing,
              job pricing is too low, or non-billable overtime is eroding margins.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>
              Employee (W-2) vs. Subcontractor (1099): Which Actually Costs Less?
            </h2>
            <p className={styles.p}>
              Business owners often assume that hiring a 1099 independent subcontractor at $45 per hour is drastically more expensive
              than employing a W-2 worker at a $30 per hour base wage. Tab 1&apos;s comparison engine shows why this intuition is
              frequently backward:
            </p>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Factor</th>
                    <th>W-2 Employee ($30/hr Base)</th>
                    <th>1099 Subcontractor ($45/hr Flat)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Direct Hourly Rate Paid</td>
                    <td>$30.00 / hour</td>
                    <td>$45.00 / hour</td>
                  </tr>
                  <tr>
                    <td>Employer Payroll Taxes</td>
                    <td>7.65% FICA + FUTA + SUTA (~$2.41/hr)</td>
                    <td>$0.00 (sub pays own self-employment tax)</td>
                  </tr>
                  <tr>
                    <td>Workers&apos; Comp &amp; Insurance</td>
                    <td>$1.50 / hour ($5 per $100)</td>
                    <td>$0.00 (sub provides own certificate of insurance)</td>
                  </tr>
                  <tr>
                    <td>Benefits &amp; Health Insurance</td>
                    <td>$3.13 / hour ($6,000/yr)</td>
                    <td>$0.00</td>
                  </tr>
                  <tr>
                    <td>Paid Holidays &amp; Vacation</td>
                    <td>160 hours ($4,800 paid time off)</td>
                    <td>$0.00 (unbilled when not working)</td>
                  </tr>
                  <tr>
                    <td><strong>True Productive Hourly Cost</strong></td>
                    <td><strong>$39.86 / productive hour</strong></td>
                    <td><strong>$45.00 / billable hour</strong></td>
                  </tr>
                  <tr>
                    <td>Commitment / Downtime Risk</td>
                    <td>Must pay 2,080 hrs even during slow weeks</td>
                    <td>Zero payment when no projects are active</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className={styles.p}>
              For a full year of continuous 2,000-hour work, the employee costs <strong>$76,536</strong>, saving nearly{' '}
              <strong>$13,464</strong> compared to $90,000 for the subcontractor. However, for a 300-hour specialty installation,
              paying a subcontractor $13,500 eliminates the risk of carrying a year-round employee during seasonal winter downturns.
            </p>
            <p className={styles.p} style={{ fontSize: '0.875rem', color: 'var(--muted, #64748b)' }}>
              <em>Legal Notice:</em> The choice between hiring an employee or a contractor is governed by IRS Common Law Rules and the
              Department of Labor&apos;s Fair Labor Standards Act economic reality test, not employer preference. Misclassifying an employee
              as an independent contractor carries severe financial penalties.
            </p>
          </section>

          {/* FAQ Accordion Section */}
          <section className={styles.faqSection}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Frequently Asked Questions About Labor Costs</h2>
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
          <HowWeCalculate slug="labor-cost-calculator" />

          {/* Related Tools Cross-Links */}
          <section className={styles.relatedSection}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Related Business &amp; Construction Tools</h2>
            <div className={styles.relatedGrid}>
              <Link href={ROUTES.freelanceRateCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Freelance Rate Calculator</div>
                <div className={styles.relatedDesc}>
                  Calculate 1099 hourly rates from desired take-home pay, billable calendar hours, overhead, and self-employment taxes.
                </div>
              </Link>
              <Link href={ROUTES.constructionEstimateTemplate.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Construction Estimate Template</div>
                <div className={styles.relatedDesc}>
                  Itemized construction bids combining direct labor hours, materials takeoff, and client quote summaries.
                </div>
              </Link>
              <Link href={ROUTES.markupCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Markup Calculator</div>
                <div className={styles.relatedDesc}>
                  Convert cost markups to profit margins, calculate selling prices, and model 3-tier pricing chains.
                </div>
              </Link>
              <Link href={ROUTES.hourlyToSalaryCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Hourly to Salary Calculator</div>
                <div className={styles.relatedDesc}>
                  Convert wages across 8 pay frequencies, account for paid vs unpaid time off, and evaluate overtime.
                </div>
              </Link>
              <Link href={ROUTES.profitMarginCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Profit Margin Calculator</div>
                <div className={styles.relatedDesc}>
                  Analyze gross, operating, and net profit margins across complete P&amp;L expense waterfalls.
                </div>
              </Link>
              <Link href={ROUTES.equipmentLoanCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Equipment Loan Calculator</div>
                <div className={styles.relatedDesc}>
                  Calculate monthly machinery financing payments, lease vs buy comparison, balloon payoff, and MCA factor APR.
                </div>
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
