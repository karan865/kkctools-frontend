import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import ToolShell from '@/components/tool/shared/ToolShell';
import SelfEmploymentTaxCalculator from '@/components/tool/self-employment-tax-calculator';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import styles from './page.module.css';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';

export const dynamic = 'force-static';

const route = {
  path: '/self-employment-tax-calculator/',
  title: '1099 Tax Calculator – Self-Employment Tax',
  description:
    'Free 1099 tax calculator. Estimate self-employment tax (Social Security + Medicare), the deduction for half of it, and quarterly estimated payments.',
};

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const faqs = [
  {
    q: 'How is self-employment tax calculated on 1099 income?',
    a: 'Self-employment tax (SE tax) is calculated under Internal Revenue Code Section 1401 and 1402. First, calculate your net earnings from self-employment: Gross 1099 revenue minus allowable Schedule C business expenses and vehicle mileage. Second, multiply net profit by 92.35% (0.9235), which accounts for the deduction of half your SE tax. Third, apply the combined 15.3% tax rate: 12.4% for Social Security (capped at the annual wage base of $184,500 in 2026) plus 2.9% for Medicare (uncapped). If your net earnings exceed $200,000 ($250,000 for married couples filing jointly), an Additional Medicare tax of 0.9% applies to the excess.',
  },
  {
    q: 'Why do I multiply my net earnings by 92.35%?',
    a: 'Per IRS Schedule SE Line 4a and IRC § 1402(a)(12), you only pay self-employment tax on 92.35% of your net profit. This statutory multiplier exists to put self-employed individuals on equal tax footing with W-2 corporate employers, who deduct their 7.65% employer share of FICA payroll taxes as an ordinary business expense (100% − 7.65% = 92.35%).',
  },
  {
    q: 'What is the deduction for half of self-employment tax?',
    a: 'Under IRC § 164(f), self-employed taxpayers are allowed an "above-the-line" income tax deduction equal to exactly 50% of their total regular self-employment tax (the employer-equivalent portion). You claim this on Schedule 1 (Form 1040), Line 15. It lowers your Adjusted Gross Income (AGI) and reduces your federal income tax, regardless of whether you take the standard deduction or itemize deductions.',
  },
  {
    q: 'What is the minimum net income threshold to owe self-employment tax?',
    a: 'Under IRC § 1402(b)(2), you do not owe any self-employment tax if your net profit from self-employment is less than $400 for the tax year. However, if your net earnings reach $400.00 or more, you must file Schedule SE and pay self-employment tax on the entire amount.',
  },
  {
    q: 'How do W-2 wages affect my 1099 self-employment tax?',
    a: 'If you work a W-2 job and freelance on the side, your W-2 wages count toward the annual Social Security wage base ($184,500 for 2026) first. For example, if you earn $150,000 in W-2 salary, only $34,500 ($184,500 − $150,000) of your 1099 net earnings is subject to the 12.4% Social Security tax. Once your combined W-2 and 1099 income exceeds $184,500, you pay 0% Social Security tax on subsequent freelance profits, paying only the 2.9% Medicare tax.',
  },
  {
    q: 'What are the official IRS estimated tax due dates for 2026?',
    a: 'Estimated quarterly tax payments (Form 1040-ES) must be postmarked or submitted electronically via IRS Direct Pay or EFTPS by four statutory deadlines: Quarter 1 is due April 15, 2026; Quarter 2 is due June 15, 2026; Quarter 3 is due September 15, 2026; and Quarter 4 is due January 15, 2027.',
  },
  {
    q: 'What is the IRS safe harbor rule for quarterly estimated taxes?',
    a: 'To avoid underpayment penalties under IRC § 6654, the IRS requires you to prepay your taxes throughout the year. You meet the &ldquo;safe harbor&rdquo; standard if your total withholding and timely quarterly estimated payments equal at least: 1) 90% of the tax shown on your current year return; OR 2) 100% of the tax shown on your prior year 12-month return (increased to 110% if your prior year Adjusted Gross Income exceeded $150,000 for married couples or $75,000 for singles).',
  },
  {
    q: 'How much should I set aside from each 1099 paycheck?',
    a: 'There is no single right percentage: it depends on your profit, deductions, filing status and state. This calculator works it out for you from your own numbers (self-employment tax at 15.3% on 92.35% of net earnings, plus the income-tax rate you enter) and shows the share of your income to set aside.',
  },
  {
    q: 'What business expenses can I deduct to lower my 1099 tax?',
    a: 'Under IRC § 162, you can deduct all ordinary and necessary expenses incurred in carrying on your trade or business. Common deductions include business vehicle mileage at the standard IRS rate (72.5¢/mi for Jan–Jun 2026; 76.0¢/mi for Jul–Dec 2026), computer equipment, software subscriptions, office supplies, advertising, website hosting, client invoicing software, accounting fees, and the home office deduction.',
  },
  {
    q: 'Can a retirement contribution reduce my self-employment tax?',
    a: 'Contributions to a Traditional IRA, SEP-IRA, or Solo 401(k) reduce your taxable federal income and lower your federal income tax liability. However, retirement contributions do NOT reduce your net business profit on Schedule C and do NOT reduce your 15.3% self-employment tax. Ordinary business expenses are the only way to lower self-employment tax.',
  },
  {
    q: 'What is the Additional Medicare Tax and when does it apply?',
    a: 'The Affordable Care Act instituted an Additional Medicare Tax of 0.9% on earned income (wages and net self-employment earnings combined) that exceeds statutory statutory thresholds: $200,000 for single taxpayers, $250,000 for married taxpayers filing jointly, and $125,000 for married taxpayers filing separately. Unlike regular Medicare tax, there is no employer deduction for this 0.9% surtax.',
  },
  {
    q: 'Do I need to pay state estimated taxes as well?',
    a: 'If you reside in a state with an individual earned income tax (all states except AK, FL, NV, NH, SD, TN, TX, WA, WY), you must also make quarterly estimated tax vouchers to your state department of revenue. Most states align their estimated due dates with the federal April 15, June 15, September 15, and January 15 schedule.',
  },
];

export default function SelfEmploymentTaxCalculatorPage() {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Business & Finance Tools', path: '/tools/' },
    { name: '1099 Tax Calculator', path: '/self-employment-tax-calculator/' },
  ];

  return (
    <main className={`${styles.page} ${toolDisplayFont.variable} ${typo.scope}`}>
      <div className="container">
        <Breadcrumbs items={breadcrumbItems} />

        <div className={styles.intro}>
          <h1 className={styles.title}>
            1099 Tax Calculator: Self-Employment Tax and Quarterly Estimates
          </h1>
          <p className={styles.subtitle}>
            Accurately estimate your 1099 contractor taxes, self-employment tax (FICA), 50% above-the-line deduction, and Form 1040-ES quarterly estimated tax payments using official 2026 IRS rates and wage caps.
          </p>

          <div className={styles.bluf}>
            <strong>Bottom Line Up Front (BLUF):</strong> Self-employment tax is 15.3% (12.4% Social Security + 2.9% Medicare) applied to 92.35% of your net 1099 profit. On $60,000 of net earnings ($70,000 gross minus $10,000 ordinary expenses), your self-employment tax is exactly $8,478. You receive an above-the-line deduction for half of it ($4,239), which lowers your federal income tax base. At an assumed 12% effective federal rate, your total annual tax liability is approximately $15,169 (21.7% of gross receipts), requiring four quarterly estimated tax vouchers of $3,792 each.
          </div>
        </div>

        <ToolShell
          features={[
            '2026 IRS figures, cited',
            'W-2 + 1099 together',
            'Quarterly due dates',
            'Mileage at IRS rate',
          ]}
        >
          <SelfEmploymentTaxCalculator />
        </ToolShell>

        <AdSlot />

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>1099 Tax Estimator: How Self-Employment Tax is Calculated</h2>
            <p>
              When working as an independent contractor, sole proprietor, or freelancer receiving Form 1099-NEC or 1099-K, no employer withholds taxes from your paychecks. As a result, you are responsible for paying both the employer and employee portions of federal payroll taxes through the <strong>Self-Employment (SE) tax</strong>.
            </p>
            <p>
              Under Internal Revenue Code (IRC) Sections 1401 and 1402, the self-employment tax rate is <strong>15.3%</strong>, composed of two distinct federal trust fund taxes:
            </p>
            <ul>
              <li>
                <strong>12.4% Social Security Tax (OASDI):</strong> Funds old-age, survivors, and disability benefits. This tax is capped at the annual statutory wage base ($184,500 in 2026). Any net earnings above this ceiling pay 0% Social Security tax.
              </li>
              <li>
                <strong>2.9% Medicare Tax (Hospital Insurance):</strong> Funds Medicare Part A hospital coverage. Unlike Social Security, the Medicare tax is completely uncapped—every dollar of net earnings is subject to at least 2.9%.
              </li>
              <li>
                <strong>0.9% Additional Medicare Surtax:</strong> Enacted under the Affordable Care Act, an extra 0.9% tax applies to net earnings exceeding $200,000 for single filers ($250,000 for married couples filing jointly).
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>The 92.35% Factor and the 50% Above-the-Line Deduction</h2>
            <p>
              Many 1099 contractors assume they owe 15.3% on 100% of their net profit. Fortunately, federal tax law provides two critical tax relief mechanisms:
            </p>
            <h3>1. The Statutory 92.35% Multiplier (Schedule SE Line 4a)</h3>
            <p>
              Under IRC § 1402(a)(12), you multiply your net profit by <strong>92.35%</strong> (0.9235) before calculating SE tax. This mathematical adjustment gives self-employed taxpayers the equivalent benefit that W-2 corporate employers receive when they deduct their 7.65% payroll tax contributions as a business expense (100% − 7.65% = 92.35%).
            </p>

            <h3>2. The Half-SE Tax Deduction (Form 1040 Schedule 1 Line 15)</h3>
            <p>
              Under IRC § 164(f), you are entitled to deduct exactly half of your total regular self-employment tax from your gross income. Because this is an &ldquo;above-the-line&rdquo; adjustment to income, you receive the full tax benefit even if you take the standard deduction rather than itemizing on Schedule A. On $8,478 of SE tax, you deduct $4,239 directly from your taxable income base.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Quarterly Estimated Taxes (Form 1040-ES) &amp; Deadlines</h2>
            <p>
              Because the United States operates a &ldquo;pay-as-you-go&rdquo; tax system, individuals who expect to owe at least $1,000 in federal tax after subtracting withholding and refundable credits must make quarterly estimated payments using <strong>Form 1040-ES</strong>.
            </p>
            <p>
              The IRS divides the calendar year into four distinct payment periods, each with its own strict due date:
            </p>

            <div className={styles.tableWrapper}>
              <table className={styles.dateTable}>
                <thead>
                  <tr>
                    <th>Payment Period</th>
                    <th>Income Earned Between</th>
                    <th>IRS Statutory Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>1st Quarter (Q1)</strong></td>
                    <td>January 1 – March 31, 2026</td>
                    <td><strong>April 15, 2026</strong></td>
                  </tr>
                  <tr>
                    <td><strong>2nd Quarter (Q2)</strong></td>
                    <td>April 1 – May 31, 2026</td>
                    <td><strong>June 15, 2026</strong></td>
                  </tr>
                  <tr>
                    <td><strong>3rd Quarter (Q3)</strong></td>
                    <td>June 1 – August 31, 2026</td>
                    <td><strong>September 15, 2026</strong></td>
                  </tr>
                  <tr>
                    <td><strong>4th Quarter (Q4)</strong></td>
                    <td>September 1 – December 31, 2026</td>
                    <td><strong>January 15, 2027</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Payments can be submitted electronically in seconds through IRS Direct Pay (direct bank transfer from checking or savings) or the Electronic Federal Tax Payment System (EFTPS).
            </p>
          </section>

          <section className={styles.section}>
            <h2>Safe Harbor Rules: Avoiding Underpayment Penalties</h2>
            <p>
              If your business income fluctuates seasonally, predicting your exact year-end tax liability can be difficult. To protect taxpayers from unexpected interest penalties, IRC § 6654 provides the <strong>Safe Harbor Rule</strong>.
            </p>
            <p>
              You will not face any IRS underpayment penalty if you pay in four equal installments that total at least:
            </p>
            <ul>
              <li><strong>90% of your current year tax liability:</strong> Pay 90% of the actual total tax you end up owing for the 2026 tax year; OR</li>
              <li><strong>100% of your prior year tax liability:</strong> Pay 100% of the total tax shown on your 2025 Form 1040 (provided your prior tax year covered a full 12-month period).</li>
              <li><strong>Higher incomes:</strong> taxpayers with higher prior-year income may need to pay a higher percentage of last year&apos;s tax to qualify; see IRS Publication 505 for the current rule.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Maximizing Deductions to Lower 1099 Taxes</h2>
            <p>
              Every allowable dollar of business expenses reduces your net self-employment earnings on Schedule C, saving both 15.3% in self-employment tax and your marginal federal and state income tax rates. Explore our connected suite of business calculators to optimize your independent contractor finances:
            </p>
            <ul>
              <li>
                <Link href="/freelance-rate-calculator/">Freelance Hourly Rate Calculator</Link> — Benchmark your hourly pricing to account for unpaid vacation, health insurance, and 15.3% self-employment taxes.
              </li>
              <li>
                <Link href="/invoice-generator/">Free Invoice Generator</Link> — Create professional client invoices with itemized hours, mileage reimbursements, and printable PDF timesheets.
              </li>
              <li>
                <Link href="/hourly-to-salary-calculator/">Hourly to Salary Calculator</Link> — Compare W-2 employee salary packages with 1099 contractor billable rates.
              </li>
              <li>
                <Link href="/labor-cost-calculator/">Labor Cost Calculator</Link> — Calculate true employer burdened payroll taxes, FUTA, SUTA, and workers’ compensation insurance.
              </li>
            </ul>
          </section>

          <section className={styles.faqSection}>
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqGrid}>
              {faqs.map((faq, i) => (
                <div key={i} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{faq.q}</h3>
                  <p className={styles.faqAnswer}>{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        <HowWeCalculate slug="self-employment-tax-calculator" />
      </div>

      <JsonLd data={buildWebApplicationSchema({ name: route.title, path: route.path, description: route.description })} />
      <JsonLd data={buildFaqSchema(faqs)} />
    </main>
  );
}
