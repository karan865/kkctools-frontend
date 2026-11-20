import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import FreelanceRateCalculator from '@/components/tool/freelance-rate-calculator';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.freelanceRateCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const faqs = [
  {
    q: 'How do I calculate my freelance hourly rate?',
    a: `To calculate your minimum viable freelance hourly rate, work backwards from the annual net take-home pay you need to support your household, add necessary business expenses and health/retirement benefits, gross up for income and self-employment taxes, and divide by your realistic annual billable hours. The core formula is: Hourly Rate = [ (Target Take-Home Pay ÷ (1 − Effective Tax Rate)) + Business Costs + Benefits ] ÷ Billable Working Hours. In our verified baseline, taking home $70,000 net after 25% tax requires $93,333 in profit plus $6,000 in overhead and $9,500 in benefits ($108,833 gross revenue). Dividing across 1,260 billable hours yields an $86.38/hr break-even rate, or $99.33/hr with a 15% profit buffer.`,
  },
  {
    q: 'What business expenses should I include in my freelance rate?',
    a: `Unlike W-2 employees who receive company-provided hardware and workspace, freelancers must fund 100% of their operational infrastructure. You should itemize: 1) Software subscriptions and digital tools (Adobe Creative Cloud, Figma, QuickBooks, project management); 2) Hardware depreciation (amortizing laptops, monitors, phones over 3 years); 3) Professional liability / Errors & Omissions insurance; 4) Coworking space or dedicated home office costs; 5) Professional services (CPA tax preparation, legal contracts); and 6) Marketing, web hosting, and client banking fees. In our standard model, baseline overhead averages $6,000 annually ($500/month).`,
  },
  {
    q: 'How many billable hours should I assume per year?',
    a: `A typical full-time year contains 2,080 calendar hours (52 weeks × 40 hours). However, no solo freelancer bills 40 hours every week. First, deduct 35 days (280 hours) for holidays, vacation, sick leave, and skills training, leaving 1,800 working hours. Second, apply a realistic billable percentage, because part of your working time goes to unbillable work (invoicing, sales proposals, marketing, client emails, bookkeeping). At 70% billability across 225 working days, you have exactly 1,260 billable hours per year (approximately 24 to 28 billable hours per active week).`,
  },
  {
    q: 'How much should I set aside for taxes as a freelancer?',
    a: `As an independent contractor or sole proprietor in the United States, you are responsible for both ordinary federal/state income tax and the 15.3% Self-Employment Tax (SECA), which covers both employee and employer halves of Social Security (12.4%) and Medicare (2.9%). Because self-employment tax is computed on 92.35% of your net business profit and half of it is deductible above-the-line on IRS Form 1040, your total tax rate depends on your income, deductions and state, so use your own effective rate in the calculator (last year’s return is a good starting point). Always pay quarterly estimated taxes (Form 1040-ES) to avoid IRS underpayment penalties.`,
  },
  {
    q: 'Should I charge hourly, per project, or a monthly retainer?',
    a: `Each pricing model serves distinct client engagements: 1) Hourly pricing ($80–$150/hr) is best for consulting, maintenance, ongoing troubleshooting, or open-ended projects where scope is unpredictable; 2) Project / Fixed-fee pricing (estimated hours × hourly rate + 15% revision buffer + fixed expenses) is ideal for discrete deliverables (websites, brand identities, audit reports) where clients demand budget certainty; 3) Monthly retainers (weekly billable hours × hourly rate × 4.33 weeks) are optimal for dedicated strategic retainers, ongoing SEO, or content retainers providing recurring baseline cash flow.`,
  },
  {
    q: 'How do I turn an hourly rate into a day rate?',
    a: `To convert an hourly rate to a daily rate, multiply your recommended hourly rate by the number of hours in a standard billable day (typically 7 to 8 hours). For example, at a recommended rate of $99.33/hr, a full 8-hour day rate is $99.33 × 8 = $794.66 (commonly rounded to $795.00 or $800.00/day). Day rates simplify billing for workshops, full-day on-site consulting, or intensive creative sprints.`,
  },
  {
    q: 'How much do copywriters charge?',
    a: `Copywriting fees vary based on scope, technical complexity, and distribution impact rather than generic industry averages. A practical method: take your hourly rate from this calculator, estimate the hours a piece really takes (research, drafting, revisions, calls) and quote hours × rate plus a revision buffer. Per-word pricing is also common, and you can convert it to an hourly equivalent to check it covers your costs. We don’t print market rates we can’t cite.`,
  },
  {
    q: 'Why is SEO consulting expensive?',
    a: `SEO work combines several skills (technical site work, analytics, keyword research and content strategy), takes months to show results, and usually needs paid software subscriptions. Those hours and tool costs go into the rate, which is exactly what this calculator adds up. Clients invest in SEO because achieving page-one organic rankings delivers compound commercial enterprise value over months and years.`,
  },
  {
    q: 'How does a freelance hourly rate compare to a corporate employee salary?',
    a: `A freelance hourly rate is typically 2.0× to 2.5× higher than a simple corporate salary divided by 2,080 hours. A full-time employee earning $70,000 per year makes $33.65/hour on paper. However, their employer also pays: 1) 7.65% matching payroll taxes (FICA); 2) 15 to 25 days of paid time off; 3) $5,000 to $9,000 in subsidized group health insurance; 4) 401(k) matching; and 5) Office space and equipment. When a freelancer provides all of these benefits independently and accounts for 30% unbillable administrative time, an equivalent target hourly rate is $85 to $100/hr.`,
  },
  {
    q: 'Should I add VAT or sales tax to my freelance rate?',
    a: `In the UK, European Union, Australia, and Canada, freelance service rates are typically quoted net of VAT/GST (e.g., £750/day + VAT). Once your annual taxable turnover exceeds statutory registration thresholds (e.g., £90,000 in the UK, A$75,000 in Australia), you are legally required to register for VAT/GST, charge it on invoices, and remit it to the tax authorities. In the United States, pure professional and creative services are exempt from sales tax in most states, though several jurisdictions (e.g., New Mexico, Hawaii, South Dakota) tax broad services. Check with your accountant.`,
  },
  {
    q: 'How often should I raise my freelance rates?',
    a: `You should review and adjust your freelance rates at least once per calendar year or whenever you achieve consistent full booking capacity. When your schedule is booked 85%+ for three consecutive months and you are turning down project inquiries, your market demand justifies a 10% to 20% rate increase. Existing retainer clients should be given 30 to 60 days of written advance notice, while all new incoming leads should immediately be quoted at your updated rate card.`,
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Freelance Rate Calculator',
  applicationCategory: 'BusinessApplication',
  path: route.path,
  description: route.description,
});

const faqSchema = buildFaqSchema(faqs);

export default function FreelanceRateCalculatorPage() {
  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={faqSchema} />

      <main className={styles.main}>
        <Breadcrumbs
          items={[
            { name: 'Calculators', path: ROUTES.tools.path },
            { name: 'Freelance Rate Calculator', path: route.path },
          ]}
        />

        <header className={styles.header}>
          <h1 className={`${styles.h1} ${toolDisplayFont.className}`}>
            Freelance Hourly Rate Calculator: What to Charge per Hour
          </h1>
          <p className={styles.lead}>
            Calculate the exact hourly rate, day rate, and project quote you need to earn your target take-home pay.
            Factor in taxes, health insurance, retirement, business overhead, vacation days, and realistic billable hours.
          </p>
          <div className={styles.meta}>
            Published by KKC Tools Business Advisory Team · Sole Proprietorship &amp; Independent Contractor Standards
          </div>
        </header>

        {/* BLUF Summary Card */}
        <div className={styles.blufBox}>
          <strong>Bottom Line Up Front (BLUF):</strong> Your freelance rate equals (Target Take-Home Pay ÷ (1 − Effective
          Tax Rate) + Business Overhead + Benefits) ÷ Annual Billable Hours. To net <strong>$70,000 per year after tax</strong> with{' '}
          <strong>1,260 billable hours</strong> (225 working days at 70% billability), you must generate{' '}
          <strong>$108,833.33 in gross revenue</strong> ($93,333.33 pre-tax profit at a 25% tax rate + $6,000 business overhead + $9,500 health &amp; retirement benefits).
          This requires a minimum break-even rate of <strong>$86.38 per hour</strong>, or <strong>$99.33 per hour</strong> with a 15% profit buffer ($794.66/day; $2,781.30/week).
        </div>

        {/* Interactive Calculator Shell */}
        <section className={styles.toolSection} aria-label="Interactive Freelance Rate Calculator">
          <FreelanceRateCalculator />
        </section>

        <AdSlot slotId="freelance-rate-calculator-top" />

        {/* Editorial Guide & Reference Content */}
        <article className={styles.article}>
          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>How to Use This Freelance Rate Calculator</h2>
            <p className={styles.p}>
              Transitioning from corporate employment to independent consulting or freelancing requires a fundamental
              shift in financial thinking. When you work for yourself, you must price in every expense an employer
              previously absorbed: payroll taxes, paid holidays, sick leave, healthcare premiums, software, and hardware depreciation.
              This calculator provides three bi-directional modes:
            </p>
            <ol style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li>
                <strong>Tab 1 — What Should I Charge? (Goal → Rate):</strong> Enter the annual take-home salary you want to
                deposit in your personal checking account. The engine adds estimated taxes, annual business overhead, health
                insurance, and retirement savings, then divides by your realistic billable hours to calculate your break-even
                floor and recommended hourly rate.
              </li>
              <li>
                <strong>Tab 2 — What Will I Earn? (Rate → Income):</strong> Enter your current or proposed hourly rate to see
                your projected gross billings, business operating expenses, tax liabilities, and true monthly take-home pay.
              </li>
              <li>
                <strong>Tab 3 — Project Quote Builder:</strong> Convert your hourly rate into a professional client deliverable
                quote by entering estimated project hours, a revision buffer (for scope creep protection), and direct third-party expenses.
              </li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>The Freelance Rate Formula: Complete Worked Example</h2>
            <p className={styles.p}>
              The mathematical formula behind sustainable freelance pricing works backwards from your personal living needs
              to your hourly billing rate:
            </p>
            <div className={styles.formulaBox}>
              Actual Work Days = 52 × (Work Days / Week) − (Holidays + Vacation + Sick Days + Training)
              <br />
              Billable Hours / Year = Actual Work Days × (Hours / Day) × (Billable % ÷ 100)
              <br />
              Pre-Tax Profit Needed = Target Take-Home Pay ÷ (1 − Effective Tax Rate %)
              <br />
              Required Gross Revenue = Pre-Tax Profit Needed + Business Overhead + Benefits
              <br />
              Break-Even Hourly Rate = Required Gross Revenue ÷ Billable Hours / Year
              <br />
              Recommended Hourly Rate = Break-Even Rate × (1 + Profit Buffer % ÷ 100)
              <br />
              Day Rate = Recommended Hourly Rate × Hours / Day
              <br />
              Weekly Retainer = Recommended Hourly Rate × Hours / Day × Work Days / Week × (Billable % ÷ 100)
            </div>
            <p className={styles.p}>
              In our verified baseline model:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Calculation Step</th>
                    <th>Formula / Input</th>
                    <th>Resulting Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Annual Work Days</strong></td>
                    <td>260 possible days − 10 holidays − 15 vacation − 5 sick − 5 training</td>
                    <td><strong>225 actual working days</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Annual Billable Hours</strong></td>
                    <td>225 days × 8 hours/day × 70% billable efficiency</td>
                    <td><strong>1,260 billable hours</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Pre-Tax Profit Needed</strong></td>
                    <td>$70,000 take-home goal ÷ (1 − 0.25 effective tax rate)</td>
                    <td><strong>$93,333.33</strong> ($23,333.33 tax set-aside)</td>
                  </tr>
                  <tr>
                    <td><strong>Overhead &amp; Benefits</strong></td>
                    <td>$6,000 business expenses + $6,000 health + $3,500 retirement</td>
                    <td><strong>$15,500.00</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Total Required Revenue</strong></td>
                    <td>$93,333.33 pre-tax profit + $15,500.00 expenses</td>
                    <td><strong>$108,833.33 gross billings</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Break-Even Hourly Rate</strong></td>
                    <td>$108,833.33 ÷ 1,260 billable hours</td>
                    <td><strong>$86.38 / hour</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Recommended Rate (+15% Buffer)</strong></td>
                    <td>$86.3756 × 1.15 buffer multiplier</td>
                    <td><strong>$99.33 / hour</strong> ($794.66/day; $2,781.30/wk)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>How Many Billable Hours Do You Really Have?</h2>
            <p className={styles.p}>
              The single most common mistake made by new freelancers is dividing their target income by 2,080 hours
              (40 hours × 52 weeks). Assuming you can bill 40 hours a week for 52 consecutive weeks leads to severe underpricing
              and burnout, because:
            </p>
            <ul style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li>
                <strong>You Must Take Time Off:</strong> Without paid vacation, sick leave, or company holidays, you must
                fund your own downtime. Taking 3 weeks of vacation (15 days), 10 federal holidays, 1 week of sick leave (5 days),
                and 1 week of training (5 days) deducts 35 days (280 hours) from your year.
              </li>
              <li>
                <strong>Non-Billable Administrative Work Consumes 30%:</strong> As a solo business operator, you wear every hat.
                Writing proposals, pitching new clients, attending discovery calls, invoicing, updating software, filing receipts,
                and chasing late payments takes 10 to 15 hours every single week.
              </li>
              <li>
                <strong>The 1,200 to 1,300 Billable Hour Rule:</strong> Across professional creative and technical fields,
                independent contractors average between 1,200 and 1,350 actual billable client hours per year (24 to 28 hours per active week).
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Business Costs and Benefits an Employer Would Cover</h2>
            <p className={styles.p}>
              In a corporate job, human resources and operations absorb overhead silently. When you freelance, you must directly
              budget for these essential items:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Item Category</th>
                    <th>Annual Budget (Benchmark)</th>
                    <th>Why You Must Fund It</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Health Insurance</strong></td>
                    <td>$4,800 – $9,600 / year</td>
                    <td>Individual and family health, dental, and vision insurance premiums must be purchased on private ACA health exchanges.</td>
                  </tr>
                  <tr>
                    <td><strong>Retirement Funding</strong></td>
                    <td>$3,000 – $10,000 / year</td>
                    <td>Without a corporate 401(k) match, you must contribute directly to a SEP-IRA or Solo 401(k) to secure your retirement future.</td>
                  </tr>
                  <tr>
                    <td><strong>Software &amp; Digital Tools</strong></td>
                    <td>$1,200 – $3,600 / year</td>
                    <td>Professional design suites (Adobe, Figma), accounting software (QuickBooks), project tracking, cloud storage, and video conferencing.</td>
                  </tr>
                  <tr>
                    <td><strong>Hardware Depreciation</strong></td>
                    <td>$1,000 – $2,500 / year</td>
                    <td>Laptops, secondary 4K displays, mobile devices, and camera equipment require replacement every 2 to 3 years.</td>
                  </tr>
                  <tr>
                    <td><strong>Professional Insurance</strong></td>
                    <td>$600 – $1,800 / year</td>
                    <td>Errors &amp; Omissions (E&amp;O) and general commercial liability insurance protects your personal assets against client lawsuits.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Freelance Taxes: Setting Aside an Effective Rate</h2>
            <p className={styles.p}>
              Taxes for self-employed individuals differ significantly from W-2 employee withholding. When you receive client payments,
              zero taxes are withheld at source. You must deposit a portion of every client check into a separate tax savings account.
            </p>
            <p className={styles.p}>
              <strong>The Self-Employment Tax (SECA) Reality:</strong> In the United States, employees only see a 7.65% FICA deduction
              on their paystubs because their employer pays the matching 7.65%. As an independent contractor, you pay both halves:
              <strong> 15.3% total</strong> (12.4% Social Security up to statutory wage base + 2.9% Medicare uncapped).
            </p>
            <p className={styles.p}>
              Because self-employment tax applies to 92.35% of your net business profit and 50% of the tax is deductible above-the-line
              from your Adjusted Gross Income (AGI) on IRS Form 1040, setting aside an effective rate of <strong>25% to 30%</strong> covers
              federal income tax and self-employment tax for the majority of solo operators.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Day Rates, Retainers, and Project Pricing</h2>
            <p className={styles.p}>
              Once you know your baseline hourly rate, you can easily translate it across common commercial billing structures:
            </p>
            <ul style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li>
                <strong>Day Rate:</strong> <code>Recommended Hourly Rate × 8 hours</code>. At $99.33/hr, charge $795.00/day.
                Day rates are standard for workshops, onsite training, or full-day shoot/production days.
              </li>
              <li>
                <strong>Weekly Dedicated Retainer:</strong> <code>Hourly Rate × Weekly Billable Hours</code>. At $99.33/hr for
                28 billable hours per week, charge $2,781.30 per week (or $12,050/month).
              </li>
              <li>
                <strong>Fixed-Price Project Quote:</strong> <code>(Estimated Hours × Hourly Rate) × (1 + Revision Buffer %) + Expenses</code>.
                For a 40-hour project with a 15% revision cushion and $250 in software/asset expenses: (40 × $99.33) × 1.15 + $250 = <strong>$4,819.18</strong>.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>How to Price Copywriting and Content Work</h2>
            <p className={styles.p}>
              Copywriters frequently ask whether to quote per word, per hour, or per project. While per-word rates ($0.20 to $0.50/word)
              are common in print journalism, commercial copywriting should always be priced from your hourly target and value delivered:
            </p>
            <ul style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li>
                <strong>A 1,000-word article</strong> that requires 6 hours of research, interviewing, writing, and editing
                at a $90/hr rate should be quoted at $540.00 ($0.54/word).
              </li>
              <li>
                <strong>A 300-word landing page hero section</strong> might take 10 hours of customer research and conversion testing.
                Quoting per word would yield only $150, whereas quoting per project from your hourly rate yields $900 to $1,500.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Setting a Consultant or SEO Rate</h2>
            <p className={styles.p}>
              Technical consultants, developers, and SEO practitioners often command rates between $100 and $250/hour. When setting
              consulting fees:
            </p>
            <ol style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li><strong>Factor in Tooling Overhead:</strong> SEO and technical consulting require specialized software subscriptions (data crawlers, API access, keyword databases) costing $300 to $800/month.</li>
              <li><strong>Consider Strategic Impact:</strong> If a technical migration or SEO audit prevents an e-commerce store from losing $100,000 in organic revenue, pricing at $150 to $200/hr is extraordinarily cost-effective for the client.</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Freelance Rate vs. Corporate Salary Equivalent</h2>
            <p className={styles.p}>
              A freelance rate of $99.33/hr might sound high compared to an employee making $35.00/hr ($72,800 salary). However,
              when you compare them on an equal after-tax, fully burdened basis:
            </p>
            <p className={styles.p}>
              To take home $70,000 net after tax, a W-2 employee needs a gross salary of approximately $93,333. Their employer
              additionally pays $7,140 in matching FICA taxes, $6,000 to $10,000 in health benefits, and covers 25+ days of paid
              leave—bringing the employer&apos;s true cost to over $115,000. The freelancer&apos;s $108,833 gross billings are virtually
              identical to the true cost of employing a full-time salaried worker.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>When and How to Raise Your Freelance Rates</h2>
            <p className={styles.p}>
              You should adjust your freelance rate card at least once every 12 months. Indicators that you are overdue for a rate hike include:
            </p>
            <ul style={{ margin: '0 0 16px 24px', lineHeight: 1.7, color: 'var(--ink-2, #334155)' }}>
              <li><strong>100% Proposal Acceptance:</strong> If every client accepts your proposal without hesitation, your rate is below market tolerance.</li>
              <li><strong>Full Calendar Capacity:</strong> When you are booked out 4 to 8 weeks in advance, raising your rates by 15% to 20% filters out low-margin clients while maintaining or increasing total gross income.</li>
              <li><strong>Advance Notice Policy:</strong> Always give existing loyal clients 30 to 60 days of written notice before applying updated rates to ongoing retainers.</li>
            </ul>
          </section>

          {/* FAQ Accordion Section */}
          <section className={styles.faqSection}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Frequently Asked Questions About Freelance Rates</h2>
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
          <HowWeCalculate slug="freelance-rate-calculator" />

          {/* Legal Disclaimer */}
          <div style={{ margin: '32px 0', padding: '16px', background: 'var(--surface-2, #f8fafc)', borderRadius: '8px', fontSize: '0.825rem', color: 'var(--muted, #64748b)', lineHeight: 1.5 }}>
            <strong>Legal &amp; Tax Disclaimer:</strong> This freelance hourly rate calculator provides mathematical planning estimates for informational purposes only. It does not constitute formal tax, legal, or financial accounting advice. Self-employment tax rates and deductions vary based on filing status, geographic location, and business entity structure (Sole Proprietorship vs. LLC vs. S-Corporation). Consult a certified public accountant (CPA) for specific tax advice.
          </div>

          {/* Related Tools Cross-Links */}
          <section className={styles.relatedSection}>
            <h2 className={`${styles.sectionTitle} ${typo.h2}`}>Related Business &amp; Wage Calculators</h2>
            <div className={styles.relatedGrid}>
              <Link href={ROUTES.hourlyToSalaryCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Hourly to Salary Calculator</div>
                <div className={styles.relatedDesc}>
                  Convert hourly wages to annual, monthly, and biweekly gross salary across all 8 pay frequencies.
                </div>
              </Link>
              <Link href={ROUTES.invoiceGenerator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Invoice Generator</div>
                <div className={styles.relatedDesc}>
                  Generate professional hourly and freelance invoices with printable PDF export and timesheet helper.
                </div>
              </Link>
              <Link href={ROUTES.laborCostCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Labor Cost Calculator</div>
                <div className={styles.relatedDesc}>
                  Calculate fully burdened employee hourly rates with US payroll tax caps, workers&apos; comp, and crew quotes.
                </div>
              </Link>
              <Link href={ROUTES.markupCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Markup Calculator</div>
                <div className={styles.relatedDesc}>
                  Calculate product markups, gross margins, wholesale-to-retail pricing tiers, and profit margins.
                </div>
              </Link>
              <Link href={ROUTES.percentageChangeCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Percentage Change Calculator</div>
                <div className={styles.relatedDesc}>
                  Calculate client rate increases, income growth percentages, and year-over-year revenue differences.
                </div>
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
