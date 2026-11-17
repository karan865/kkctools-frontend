import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import { HourlyToSalaryCalculator } from '@/components/tool/hourly-to-salary-calculator';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  calculateWage,
  generateWageTable,
} from '@/lib/wage-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.hourlyToSalaryCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

// Dynamic engine computations for factual accuracy across editorial copy
const exStandard40 = calculateWage({ amount: 25, period: 'hour', hoursPerWeek: 40, weeksPerYear: 52 });
const exPartTime = calculateWage({ amount: 18, period: 'hour', hoursPerWeek: 25, weeksPerYear: 52 });
const exSalary65k = calculateWage({ amount: 65000, period: 'year', hoursPerWeek: 40, weeksPerYear: 52 });

const exOvertime = calculateWage({
  amount: 20,
  period: 'hour',
  hoursPerWeek: 40,
  overtimeHoursPerWeek: 5,
  overtimeMultiplier: 1.5,
});

const exPtoPaid = calculateWage({
  amount: 25,
  period: 'hour',
  paidHolidaysDays: 10,
  paidVacationDays: 15,
});

const exPtoUnpaid = calculateWage({
  amount: 25,
  period: 'hour',
  unpaidDaysOff: 5,
});

const tableSample = generateWageTable(40, 52);

const faqs = [
  {
    q: 'How much is $20 an hour a year?',
    a: 'At standard full-time hours (40 hours per week for 52 weeks = 2,080 hours per year), $20 an hour equals $41,600 per year before taxes. That translates to approximately $3,467 per month, $1,600 biweekly (every two weeks), or $800 per week. Similarly, $15/hr is $31,200/year, $25/hr is $52,000/year, and $30/hr is $62,400/year.',
  },
  {
    q: 'How do I calculate my annual salary from hourly pay?',
    a: 'To calculate your annual salary from hourly pay, multiply your hourly rate by the number of hours you work each week, then multiply that result by the number of weeks you work in a year (typically 52): Annual Salary = Hourly Wage × Hours per Week × Weeks per Year. For standard 40-hour workweeks, the shortcut is multiplying your hourly wage by 2,080.',
  },
  {
    q: 'How do I convert my salary to an hourly rate?',
    a: 'To convert an annual salary to an hourly rate, divide your total annual gross salary by the total number of working hours in your year: Hourly Rate = Annual Salary ÷ (Hours per Week × Weeks per Year). For a typical full-time schedule of 2,080 annual hours, a $65,000 salary equals $65,000 ÷ 2,080 = $31.25 per hour.',
  },
  {
    q: 'How many working hours are in a year?',
    a: 'In a standard full-time US work schedule of 40 hours per week across 52 weeks, there are exactly 2,080 working hours in a year (40 × 52 = 2,080). In the UK, standard 37.5-hour contracts total 1,950 hours per year. In Australia, the standard 38-hour workweek equals 1,976 hours. The US Federal Government (OPM) uses a statutory 2,087-hour divisor to account for 365-day leap-year calendar shifts.',
  },
  {
    q: 'How do I calculate annual income from biweekly pay?',
    a: 'To calculate annual income from biweekly pay, multiply your biweekly gross paycheck amount by 26: Annual Gross Income = Biweekly Pay × 26. Because there are 52 weeks in a year and biweekly pay occurs every 2 weeks, there are always 26 biweekly pay periods in a standard year (unlike semi-monthly pay, which has 24 pay periods).',
  },
  {
    q: "What's the difference between biweekly and semi-monthly pay?",
    a: 'Biweekly pay is disbursed every two weeks, resulting in 26 paychecks per year, including two months each year with three paychecks ("three-paycheck months"). Semi-monthly pay is disbursed exactly twice per month (typically on the 1st and 15th, or 15th and last day), resulting in exactly 24 paychecks per year. For a $52,000 salary, a biweekly paycheck is $2,000.00 ($52,000 ÷ 26), whereas a semi-monthly paycheck is $2,166.67 ($52,000 ÷ 24).',
  },
  {
    q: 'Does this calculator include overtime pay?',
    a: 'Yes. Under the Overtime section, you can input your weekly overtime hours and rate multiplier. In the United States, the Fair Labor Standards Act (FLSA) mandates overtime pay of at least 1.5× the regular rate ("time and a half") for all hours worked exceeding 40 hours in a single workweek.',
  },
  {
    q: 'Should I include paid holidays and vacation in the calculation?',
    a: 'For salaried or full-time hourly employees who receive Paid Time Off (PTO), paid vacation and holidays do not reduce your annual gross salary—you are paid for those hours regardless. However, they reduce the number of hours you physically work on the clock, raising your effective "pay per hour actually worked". In contrast, unpaid days off reduce your annual earnings directly.',
  },
  {
    q: 'Is the calculated salary before or after taxes?',
    a: 'All figures produced by this calculator represent gross earnings before deductions for federal income tax, state/provincial tax, Social Security, Medicare (FICA), or retirement contributions. Take-home pay will be lower depending on your tax filing status, dependents, and voluntary benefit deductions.',
  },
  {
    q: 'How do I work out my monthly gross income for a rent or mortgage application?',
    a: 'Lenders and landlords evaluate your Monthly Gross Income (MGI) to calculate debt-to-income (DTI) ratios. If you are paid hourly, calculate your annual gross earnings first (Hourly Wage × Hours/Week × Weeks/Year), then divide that annual total by 12. Do not multiply a single biweekly paycheck by two, because multiplying by two accounts for only 24 paychecks ($4,000/mo) rather than the true annual 26-paycheck total ($4,333.33/mo).',
  },
  {
    q: 'How do I compare an hourly job with a salaried offer?',
    a: 'Use our Job Offer Comparison tab. An hourly position often includes overtime potential and paid break requirements under labor laws, but may not include paid sick leave or vacation. A salaried offer provides predictable year-round income, but exempt employees rarely receive overtime pay for working 45+ hours per week. Always compare total annual gross alongside paid time off and expected weekly hours.',
  },
];

export default function HourlyToSalaryCalculatorPage() {
  const breadcrumbItems = [
    { name: 'Home', path: ROUTES.home.path },
    { name: 'Tools', path: ROUTES.tools.path },
    { name: 'Hourly to Salary Calculator', path: route.path },
  ];

  const webAppSchema = buildWebApplicationSchema({
    name: 'Hourly to Salary Calculator & Yearly Wage Tool',
    description: route.description,
    path: route.path,
    applicationCategory: 'BusinessApplication',
  });

  const faqSchema = buildFaqSchema(faqs);

  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={faqSchema} />

      <main className={styles.main}>
        <Breadcrumbs items={breadcrumbItems} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Hourly to Salary Calculator (Yearly Wage Calculator)</h1>
          <p className={styles.lead}>
            Convert hourly wages into annual salary, monthly gross income, biweekly, and weekly pay
            (or convert salary back to hourly). Factor in overtime multipliers (FLSA 1.5×), paid holidays,
            unpaid days off, and evaluate job offer pay raises before tax.
          </p>
          <div className={styles.meta}>
            <span>Published: 2026-11-18</span> • <span>Standard: US DOL FLSA &amp; OPM 2,087-Hour Divisor</span>
          </div>
        </header>

        {/* BLUF Summary Box */}
        <aside className={styles.blufBox}>
          <strong>Bottom Line Up Front (BLUF):</strong> To turn an hourly wage into a yearly salary,
          multiply your hourly rate by the number of hours you work each week, then multiply by 52
          (<code>Annual Gross = Hourly Rate × Hours/Week × 52</code>). At standard full-time hours
          (40 hours/week), the annual multiplier is exactly <strong>2,080 hours</strong>. Thus,{' '}
          <strong>$25.00 an hour</strong> equals <strong>${exStandard40.totalAnnualGross.toLocaleString()} a year</strong> before
          taxes, which breaks down to <strong>${Math.round(exStandard40.periods.monthly).toLocaleString()} per month</strong>,{' '}
          <strong>${Math.round(exStandard40.periods.biweekly).toLocaleString()} biweekly</strong> (every two weeks), or{' '}
          <strong>${Math.round(exStandard40.periods.weekly).toLocaleString()} per week</strong>.
        </aside>

        {/* Interactive Calculator Component */}
        <section className={styles.toolSection}>
          <HourlyToSalaryCalculator />
        </section>

        {/* Editorial Content */}
        <article className={styles.article}>
          {/* Section 1: How to use */}
          <section className={styles.section}>
            <h2 className={styles.h2}>How to Use the Hourly to Salary Wage Calculator</h2>
            <p className={styles.p}>
              Whether you are evaluating a new job offer, planning an annual household budget, or
              calculating your debt-to-income ratio for a rental application, converting compensation
              between payment cycles requires precise scheduling math:
            </p>
            <ol className={styles.p} style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Select your pay frequency:</strong> Enter your wage amount and select the
                frequency you are paid in (per hour, day, week, biweekly, semi-monthly, month, quarter,
                or annual salary).
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Customize your working schedule:</strong> Set your weekly hours (default is
                standard 40 hours) or pick an international preset (UK 37.5h, AU 38h, India 48h, or
                part-time 20h). You can also click <em>Variable Hours Each Day</em> to enter custom
                schedules from Monday through Sunday.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Incorporate time off &amp; overtime:</strong> Open the Time Off tab to specify
                paid vacation days, national holidays, or unpaid absences. If you routinely work extra
                hours, open Overtime to add weekly OT hours at 1.5× time-and-a-half or 2.0× double-time.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Explore all 8 payroll frequencies:</strong> Review the results dashboard for
                your total annual gross, paycheck breakdowns across all 8 frequencies, and the visual
                disbursement diagram.
              </li>
            </ol>
          </section>

          {/* Section 2: How to calculate annual salary */}
          <section className={styles.section}>
            <h2 className={styles.h2}>How to Calculate Annual Salary from Hourly Pay</h2>
            <p className={styles.p}>
              To determine your total gross annual compensation from an hourly wage rate, use the
              foundational payroll formula:
            </p>
            <div className={styles.formulaBox}>
              Annual Salary = Hourly Wage × Weekly Working Hours × Weeks Worked per Year
            </div>
            <p className={styles.p}>
              Here is how that formula operates across standard commercial employment arrangements:
            </p>

            <h3 className={styles.h3}>Full-Time Example (40 Hours per Week)</h3>
            <p className={styles.p}>
              An employee earning $25.00 per hour working standard full-time hours (40 hours per week,
              52 weeks per year):
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li>
                <strong>Weekly Gross:</strong> $25.00 × 40 hrs = <strong>${exStandard40.periods.weekly.toLocaleString()}</strong>
              </li>
              <li>
                <strong>Annual Gross:</strong> $1,000 × 52 weeks = <strong>${exStandard40.totalAnnualGross.toLocaleString()}</strong> (or 2,080 hrs × $25.00)
              </li>
              <li>
                <strong>Monthly Average:</strong> $52,000 ÷ 12 months = <strong>${exStandard40.periods.monthly.toFixed(2)}</strong>
              </li>
              <li>
                <strong>Biweekly Paycheck:</strong> $52,000 ÷ 26 paychecks = <strong>${exStandard40.periods.biweekly.toFixed(2)}</strong>
              </li>
            </ul>

            <h3 className={styles.h3}>Part-Time Example (25 Hours per Week)</h3>
            <p className={styles.p}>
              A part-time team member earning $18.00 per hour working 25 hours per week year-round:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li>
                <strong>Annual Working Hours:</strong> 25 hrs × 52 weeks = <strong>1,300 hours</strong>
              </li>
              <li>
                <strong>Annual Gross:</strong> 1,300 hrs × $18.00 = <strong>${exPartTime.totalAnnualGross.toLocaleString()}</strong>
              </li>
              <li>
                <strong>Monthly Gross:</strong> $23,400 ÷ 12 months = <strong>${exPartTime.periods.monthly.toFixed(2)}</strong>
              </li>
            </ul>
          </section>

          {/* Section 3: Salary to hourly reverse */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Salary to Hourly: The Reverse Calculation</h2>
            <p className={styles.p}>
              If you receive an annual salary offer and need to understand the equivalent hourly wage
              for freelance consulting, contract bidding, or overtime comparison, invert the formula:
            </p>
            <div className={styles.formulaBox}>
              Equivalent Hourly Wage = Annual Salary ÷ Total Scheduled Annual Working Hours
            </div>
            <p className={styles.p}>
              For a professional offered a $65,000 annual salary under a 40-hour weekly contract:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li>
                <strong>Scheduled Hours:</strong> 40 hrs/wk × 52 weeks = <strong>2,080 hours</strong>
              </li>
              <li>
                <strong>Hourly Rate:</strong> $65,000 ÷ 2,080 = <strong>${exSalary65k.periods.hourly.toFixed(2)} per hour</strong>
              </li>
              <li>
                <strong>Biweekly Gross:</strong> $65,000 ÷ 26 = <strong>${exSalary65k.periods.biweekly.toFixed(2)}</strong>
              </li>
              <li>
                <strong>Monthly Gross:</strong> $65,000 ÷ 12 = <strong>${exSalary65k.periods.monthly.toFixed(2)}</strong>
              </li>
            </ul>
          </section>

          {/* Section 4: Working hours in a year */}
          <section className={styles.section}>
            <h2 className={styles.h2}>How Many Working Hours Are in a Year?</h2>
            <p className={styles.p}>
              The standard commercial calculation used across US private enterprise assumes 52 weeks of
              40 hours each, yielding exactly <strong>2,080 hours per year</strong>. However, standard
              work hours vary based on public sector rules and international statutory definitions:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Jurisdiction / Sector</th>
                    <th>Weekly Full-Time Standard</th>
                    <th>Annual Hours Divisor</th>
                    <th>Statutory Basis / Source</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>US Private Sector (Standard)</strong></td>
                    <td>40.0 hours / week</td>
                    <td>2,080 hours</td>
                    <td>Commercial standard (40 hrs × 52 wks)</td>
                  </tr>
                  <tr>
                    <td><strong>US Federal Government</strong></td>
                    <td>40.0 hours / week</td>
                    <td>2,087 hours</td>
                    <td>US Office of Personnel Management (OPM 5 U.S.C. 5504)</td>
                  </tr>
                  <tr>
                    <td><strong>United Kingdom</strong></td>
                    <td>37.5 hours / week</td>
                    <td>1,950 hours</td>
                    <td>UK Working Time Regulations 1998</td>
                  </tr>
                  <tr>
                    <td><strong>Australia</strong></td>
                    <td>38.0 hours / week</td>
                    <td>1,976 hours</td>
                    <td>Fair Work Commission National Employment Standards</td>
                  </tr>
                  <tr>
                    <td><strong>France</strong></td>
                    <td>35.0 hours / week</td>
                    <td>1,820 hours</td>
                    <td>French Labor Code (Lois Aubry)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.p}>
              Why does the US Federal Government use 2,087 hours instead of 2,080? A solar calendar year
              contains 365 days (or 366 in a leap year), which equals 52 weeks plus 1 or 2 extra days
              (260 to 262 work days). Over a 28-year cycle, the exact average is 2,087.1 hours per year.
            </p>
          </section>

          {/* Section 5: Paid vs unpaid time off */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Paid vs Unpaid Time Off: The Mistake Competitors Make</h2>
            <p className={styles.p}>
              Many online wage calculators incorrectly subtract paid vacation days from annual salary,
              artificially reducing your stated earnings. In employment reality:
            </p>
            <div className={styles.callout}>
              <div className={styles.calloutTitle}>💡 The Fundamental Rule of Paid Time Off (PTO)</div>
              <p className={styles.p} style={{ margin: 0 }}>
                <strong>Paid vacation and paid bank holidays do NOT reduce your annual salary.</strong> You
                are paid your normal paycheck whether you are sitting at your desk or taking leave. What
                PTO actually changes is your <em>effective pay per hour on the clock</em>.
              </p>
            </div>
            <p className={styles.p}>
              Observe how our engine mathematically handles paid versus unpaid leave for a $25.00/hr
              worker:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>With 25 Days Paid Leave (10 holidays + 15 vacation):</strong> Total annual pay
                remains <strong>${exPtoPaid.totalAnnualGross.toLocaleString()}</strong>. However, because
                you only work 1,880 hours on the clock, your effective wage per hour actually worked
                climbs to <strong>${exPtoPaid.effectiveHourlyWorked.toFixed(2)}/hour</strong>.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>With 5 Unpaid Days Off:</strong> 5 unpaid days equal 40 unworked hours. Your annual
                earnings drop by <code>40 hrs × $25.00 = $1,000.00</code>, resulting in an annual gross of{' '}
                <strong>${exPtoUnpaid.totalAnnualGross.toLocaleString()}</strong>.
              </li>
            </ul>
          </section>

          {/* Section 6: Overtime Pay */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Overtime Pay Calculation (FLSA 1.5× Rule)</h2>
            <p className={styles.p}>
              In the United States, non-exempt hourly employees are legally entitled to overtime
              compensation under the{' '}
              <a
                href="https://www.dol.gov/agencies/whd/overtime"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.pillLink}
                style={{ display: 'inline-flex', padding: '2px 8px', fontSize: '0.8rem' }}
              >
                Fair Labor Standards Act (FLSA)
              </a>. Unless exempt, any time worked exceeding 40 hours in a single 7-day workweek must be
              compensated at not less than <strong>1.5× your regular hourly rate</strong> (&ldquo;time
              and a half&rdquo;).
            </p>
            <div className={styles.formulaBox}>
              Total Annual Gross = (Regular Hours × Base Rate × 52) + (OT Hours × Base Rate × 1.5 × 52)
            </div>
            <p className={styles.p}>
              If an employee earns a base wage of $20.00 per hour and works 5 overtime hours every week:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li>
                <strong>Regular Pay (40 hrs/wk):</strong> 40 × $20.00 × 52 = <strong>${exOvertime.regularAnnualGross.toLocaleString()}</strong>
              </li>
              <li>
                <strong>Overtime Hourly Rate:</strong> $20.00 × 1.5 = <strong>$30.00 / hour</strong>
              </li>
              <li>
                <strong>Annual Overtime Pay:</strong> 5 hrs × $30.00 × 52 weeks = <strong>${exOvertime.overtimeAnnualGross.toLocaleString()}</strong>
              </li>
              <li>
                <strong>Total Combined Annual Gross:</strong> $41,600 + $7,800 = <strong>${exOvertime.totalAnnualGross.toLocaleString()}</strong>
              </li>
            </ul>
          </section>

          {/* Section 7: Paycheck Frequencies */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Weekly, Biweekly, Semi-Monthly and Monthly Pay Frequencies</h2>
            <p className={styles.p}>
              A widespread financial mistake is assuming biweekly and semi-monthly paychecks are
              identical. While both disburse income approximately twice a month, their calendars differ
              significantly:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Payroll Frequency</th>
                    <th>Paychecks / Year</th>
                    <th>How It Is Scheduled</th>
                    <th>$52,000 Salary Check Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Weekly</strong></td>
                    <td>52</td>
                    <td>Every Friday (or regular weekday)</td>
                    <td>$1,000.00</td>
                  </tr>
                  <tr style={{ background: '#f0fdf4' }}>
                    <td><strong>Biweekly</strong></td>
                    <td>26</td>
                    <td>Every other week (every 14 days)</td>
                    <td>$2,000.00</td>
                  </tr>
                  <tr>
                    <td><strong>Semi-Monthly</strong></td>
                    <td>24</td>
                    <td>1st &amp; 15th, or 15th &amp; last day of month</td>
                    <td>$2,166.67</td>
                  </tr>
                  <tr>
                    <td><strong>Monthly</strong></td>
                    <td>12</td>
                    <td>Last day of each calendar month</td>
                    <td>$4,333.33</td>
                  </tr>
                  <tr>
                    <td><strong>Quarterly</strong></td>
                    <td>4</td>
                    <td>End of Q1, Q2, Q3, Q4</td>
                    <td>$13,000.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h3 className={styles.h3}>The &ldquo;Three-Paycheck Month&rdquo; Phenomenon</h3>
            <p className={styles.p}>
              Because a year has 52 weeks rather than 48, employees paid biweekly receive{' '}
              <strong>26 paychecks</strong>. That means in 10 months of the year you receive 2 paychecks,
              while in 2 calendar months you receive 3 paychecks. Budgeting against the standard 2-paycheck
              income allows you to direct those two &ldquo;bonus&rdquo; paychecks straight into emergency
              savings or debt reduction.
            </p>
          </section>

          {/* Section 8: Wage Reference Table */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Hourly Wage to Salary Reference Table ($10 to $100 / hr)</h2>
            <p className={styles.p}>
              The table below summarizes annual, monthly, biweekly, and weekly gross earnings for common
              hourly wage benchmarks based on a standard 40-hour workweek (2,080 annual working hours):
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Hourly Rate</th>
                    <th>Weekly Gross</th>
                    <th>Biweekly Gross (26x)</th>
                    <th>Monthly Gross (12x)</th>
                    <th>Annual Salary (2,080 h)</th>
                  </tr>
                </thead>
                <tbody>
                  {[15, 20, 25, 30, 35, 40, 50, 60, 75, 100].map((rate) => {
                    const row = tableSample.find((r) => r.hourlyRate === rate);
                    if (!row) return null;
                    return (
                      <tr key={rate}>
                        <td><strong>${row.hourlyRate.toFixed(2)} / hr</strong></td>
                        <td>${row.weeklyGross.toLocaleString()}</td>
                        <td>${Math.round(row.biweeklyGross).toLocaleString()}</td>
                        <td>${Math.round(row.monthlyGross).toLocaleString()}</td>
                        <td><strong>${row.annualGross.toLocaleString()}</strong></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className={styles.p}>
              Use the <em>Wage Table ($10–$100)</em> tab in the calculator above to browse all 35+ wage
              levels in $1 and $5 increments or search any customized rate.
            </p>
          </section>

          {/* Section 9: Gross vs Take-Home Pay */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Gross Pay vs Take-Home Pay: Understanding Tax Deductions</h2>
            <p className={styles.p}>
              Every figure computed on this page represents <strong>gross compensation</strong>—your total
              contractual pay before statutory withholdings. Your net take-home pay deposited into your
              checking account is determined by several mandatory deductions:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Federal Income Tax:</strong> Progressive tax brackets ranging from 10% to 37%
                (in the US) based on your W-4 allowances and marital filing status.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>FICA Payroll Taxes:</strong> 6.2% for Social Security (up to the annual wage cap)
                and 1.45% for Medicare.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>State &amp; Local Income Taxes:</strong> Ranging from 0% in states without
                personal income tax (such as Texas, Florida, and Washington) to over 10% in high-bracket
                states.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Voluntary Pre-Tax Deductions:</strong> Traditional 401(k) retirement
                contributions, health insurance premiums, Health Savings Accounts (HSA), and Flexible
                Spending Accounts (FSA).
              </li>
            </ul>
            <p className={styles.p}>
              Because tax liability depends on your unique household status and state residence, we
              deliberately avoid fabricating tax estimates. For an authoritative calculation of your net
              take-home pay, visit the official{' '}
              <a
                href="https://www.irs.gov/individuals/tax-withholding-estimator"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.noticeLink}
              >
                IRS Tax Withholding Estimator
              </a>.
            </p>
          </section>

          {/* Section 10: Monthly Gross Income */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Monthly Gross Income: Applying for Rent &amp; Mortgages</h2>
            <p className={styles.p}>
              When applying for an apartment lease, auto loan, or home mortgage, financial underwriters
              evaluate your <strong>Monthly Gross Income (MGI)</strong> to calculate your Debt-to-Income
              (DTI) ratio.
            </p>
            <div className={styles.formulaBox}>
              Monthly Gross Income = (Hourly Rate × Weekly Hours × 52 Weeks) ÷ 12 Months
            </div>
            <p className={styles.p}>
              Many apartment communities require a prospective tenant&apos;s monthly gross income to equal
              at least <strong>3× monthly rent</strong>. For an apartment renting at $1,500/month, the
              household must demonstrate an MGI of at least $4,500 ($54,000 annual gross, or roughly
              $26.00/hour full-time).
            </p>
          </section>

          {/* Section 11: FAQ */}
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

          {/* Related Tools */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Related Business &amp; Commercial Calculators</h2>
            <p className={styles.p}>
              Explore our complementary suite of verified business, pricing, and contractor
              calculators:
            </p>
            <div className={styles.internalLinks}>
              <Link href={ROUTES.percentageChangeCalculator.path} className={styles.pillLink}>
                Percentage Change Calculator (Calculate Pay Raises %)
              </Link>
              <Link href={ROUTES.unitPriceCalculator.path} className={styles.pillLink}>
                Unit Price Calculator (Price per Ounce &amp; Shrinkflation)
              </Link>
              <Link href={ROUTES.markupCalculator.path} className={styles.pillLink}>
                Markup Calculator (Pricing &amp; Margins)
              </Link>
              <Link href={ROUTES.profitMarginCalculator.path} className={styles.pillLink}>
                Profit Margin Calculator (Gross &amp; Net)
              </Link>
              <Link href={ROUTES.constructionEstimateTemplate.path} className={styles.pillLink}>
                Construction Estimate Template (Contractor Labor Billing)
              </Link>
            </div>
          </section>

          <HowWeCalculate slug="hourly-to-salary-calculator" />
        </article>

        <AdSlot slotId="after-content" />
      </main>
    </>
  );
}
