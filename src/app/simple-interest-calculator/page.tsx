import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildWebApplicationSchema } from '@/components/seo/buildSchema';
import Link from 'next/link';
import ToolShell from '@/components/tool/shared/ToolShell';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { SimpleInterestCalculator } from '@/components/tool/simple-interest-calculator';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import AdSlot from '@/components/ads/AdSlot';
import { ROUTES } from '@/lib/routes';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.simpleInterestCalculator ?? {
  path: '/simple-interest-calculator/',
  title: 'Simple Interest Calculator – Accrued Interest',
  description:
    'Free simple interest calculator. Get interest on a principal for any number of days, months or years, and the accrued interest between two dates.',
};

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const FAQ_ITEMS = [
  {
    q: 'What is accrued interest?',
    a: 'Accrued interest is interest that has accumulated on an obligation (such as a loan, promissory note, certificate of deposit, or bond) since the principal was borrowed or the last coupon was paid, but has not yet been disbursed or settled.',
  },
  {
    q: 'What is the simple interest equation (I = Prt)?',
    a: 'The simple interest equation is I = P × r × t, where I is total interest earned or charged, P is the initial principal, r is the annual nominal interest rate in decimal form (rate % ÷ 100), and t is time measured in years.',
  },
  {
    q: 'How do I calculate interest for a specific number of days?',
    a: 'To calculate interest for days, multiply the principal by the annual rate and the day fraction: Interest = Principal × (Annual Rate ÷ 100) × (Days Elapsed ÷ Basis), where Basis is either 365 days (Actual/365) or 360 days (Actual/360).',
  },
  {
    q: 'What is the difference between simple and compound interest?',
    a: 'Simple interest is calculated exclusively on the original principal balance throughout the entire loan duration. Compound interest recalculates interest on both the principal and previously accumulated interest, accelerating total interest over time.',
  },
  {
    q: 'What is the difference between 30/360, Actual/360, and Actual/365?',
    a: 'Actual/365 divides exact calendar days by 365. Actual/360 divides exact calendar days by 360, increasing annual daily interest by approximately 1.39%. 30/360 counts every month as 30 days and the year as 360 days. Which one applies is set by your loan or bond documents.',
  },
  {
    q: 'How do I calculate accrued interest on a bond?',
    a: 'Accrued interest on a bond equals Face Value × (Coupon Rate ÷ Frequency) × (Days Accrued ÷ Days in Period). The buyer pays the clean bond price plus this accrued interest to the seller on settlement date.',
  },
  {
    q: 'How do I calculate accrued interest in Excel or Google Sheets?',
    a: 'Use =YEARFRAC(start_date, end_date, basis) × Principal × Rate to calculate accrued loan interest, or =ACCRINT(...) for periodic coupon bonds. For 30/360 calendar days, use =DAYS360(start_date, end_date).',
  },
  {
    q: 'Why does Actual/360 cost more interest than Actual/365?',
    a: 'Because Actual/360 uses 360 in the denominator, the effective daily interest rate is 1/360th instead of 1/365th. Over 365 calendar days, the borrower is billed for 365/360 = 1.01389 years of interest, adding ~1.39% more interest charges.',
  },
  {
    q: 'How do I find the rate or duration when the interest is known?',
    a: 'Rearrange the simple interest formula: Rate (r) = I ÷ (P × t) and Duration in years (t) = I ÷ (P × r). Our Simple Interest Solver tab computes any of these variables instantly.',
  },
  {
    q: 'Is accrued interest the same as interest paid?',
    a: 'No. Accrued interest represents an accounting liability or asset that grows continuously every day. Interest paid represents the actual cash transfer that clears or reduces that accumulated balance.',
  },
];

export default function SimpleInterestPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'Tools', path: '/tools/' },
            { name: 'Math & Finance', path: '/tools/#math' },
            { name: 'Simple Interest Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>
            Simple Interest Calculator: Interest and Accrued Interest by Day
          </h1>
          <p className={styles.subtitle}>
            Compute exact simple interest for loans, deposits, and promissory notes. Determine accrued
            interest between calendar dates using Actual/365, Actual/360, 30/360, or Actual/Actual day counts.
          </p>

          <div className={styles.bluf}>
            <strong>Bottom Line Up Front:</strong> Accrued interest is interest earned but not yet paid.
            Simple interest follows <em>Principal × Rate × Time</em>: a $10,000 principal at 5% simple
            interest for 3 years produces $1,500 in interest (total $11,500). Between 15 January 2026 and
            15 April 2026 (90 calendar days), $10,000 at 5% accrues $123.29 under Actual/365, or $125.00
            under Actual/360.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Accrued between two dates',
              '5 day-count conventions',
              'Bond accrued interest',
              'Excel formulas',
            ]}
          >
            <SimpleInterestCalculator />
          </ToolShell>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <HowWeCalculate slug="simple-interest-calculator" />

        <div className={styles.contentSection}>
          <article className={styles.prose}>
            <h2>What is Accrued Interest?</h2>
            <p>
              Accrued interest is interest that has accumulated on a debt or investment obligation since the
              initial loan issue or the last scheduled payment date, but has not yet been paid by the borrower
              or received by the lender.
            </p>
            <p>
              Under accrual accounting principles, interest begins accruing the moment funds are disbursed.
              For fixed-income bonds, commercial notes, and certificate of deposits (CDs), accrued interest
              accumulates continuously on a daily basis:
            </p>
            <ul>
              <li>
                <strong>Loans and Lines of Credit:</strong> If a borrower makes monthly payments on the 1st
                of each month and requests a payoff quote on the 18th, the payoff figure includes the principal
                balance plus 17 days of accrued interest.
              </li>
              <li>
                <strong>Bonds in Secondary Markets:</strong> When a bond is sold between coupon dates, the
                buyer pays the seller the agreed market price (the clean price) plus the interest that accrued
                from the last coupon date to the settlement date. The buyer then receives the full coupon payment
                from the bond issuer on the next scheduled payment date.
              </li>
              <li>
                <strong>Accrued vs. Paid Interest:</strong> Accrued interest represents an earned accounting
                liability or asset. Paid interest refers to the actual cash disbursement that clears the ledger.
              </li>
            </ul>

            <h2>How to Use the Calculator</h2>
            <p>
              This tool provides four dedicated calculation modes designed for borrowers, investors, accountants,
              and students:
            </p>
            <ol>
              <li>
                <strong>Accrued between Dates:</strong> Select a starting date, end date, principal, and annual
                rate to calculate elapsed calendar days, exact year fraction (τ), and total accrued interest.
              </li>
              <li>
                <strong>Simple Interest Solver:</strong> Choose to solve for any variable in the simple interest
                equation (<code>I</code>, <code>P</code>, <code>r</code>, or <code>t</code>) with flexible duration
                units (days, weeks, months, or years).
              </li>
              <li>
                <strong>Bond Accrued Interest:</strong> Calculate the clean vs. dirty price of a bond based on
                face value, coupon percentage, payment frequency, and elapsed days.
              </li>
              <li>
                <strong>Compare Day Counts:</strong> View a side-by-side reconciliation of all five standard
                financial day-count conventions on the same principal balance.
              </li>
            </ol>

            <h2>Simple Interest Equation (I = P × r × t)</h2>
            <p>
              Simple interest is calculated using one of the fundamental formulas in personal and corporate finance:
            </p>
            <p style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 700, margin: '20px 0' }}>
              I = P × r × t
            </p>
            <p>
              Where:
            </p>
            <ul>
              <li><strong>I:</strong> Total simple interest accrued or paid.</li>
              <li><strong>P:</strong> Principal balance (the initial amount borrowed or deposited).</li>
              <li><strong>r:</strong> Annual nominal interest rate expressed as a decimal (e.g. 5% = 0.05).</li>
              <li><strong>t:</strong> Term of the loan or investment in years (e.g. 6 months = 0.5 years).</li>
            </ul>
            <p>
              To find the total future amount (A) due at maturity:
            </p>
            <p style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 600 }}>
              A = P + I = P(1 + r × t)
            </p>
            <p>
              <strong>Worked Example:</strong> If an investor lends $10,000 for 3 years at an annual simple
              interest rate of 5%, the total interest earned is:
            </p>
            <p style={{ fontFamily: 'monospace', padding: '10px 14px', background: 'var(--surface-subtle)', borderRadius: '6px' }}>
              I = $10,000 × 0.05 × 3 = $1,500.00
              <br />
              Total Repayment (A) = $10,000 + $1,500 = $11,500.00
            </p>

            <h2>How to Calculate Interest for Any Number of Days</h2>
            <p>
              When interest accrues over an arbitrary number of days rather than whole calendar years, the annual
              rate is converted to a daily accrual factor:
            </p>
            <p style={{ textAlign: 'center', fontSize: '1.15rem', fontWeight: 600 }}>
              Daily Interest = (Principal × Annual Rate) ÷ Year Basis
            </p>
            <p>
              For example, on a $10,000 principal balance at 5% annual interest:
            </p>
            <ul>
              <li>
                <strong>Under Actual/365 basis:</strong> Daily Interest = ($10,000 × 0.05) ÷ 365 = $1.3699 per day.
                Over 90 elapsed days, accrued interest = 90 × $1.36986... = <strong>$123.29</strong>.
              </li>
              <li>
                <strong>Under Actual/360 basis:</strong> Daily Interest = ($10,000 × 0.05) ÷ 360 = $1.3889 per day.
                Over 90 elapsed days, accrued interest = 90 × $1.38888... = <strong>$125.00</strong>.
              </li>
            </ul>

            <h2>Day-Count Conventions Explained</h2>
            <p>
              In financial contracts, the exact definition of a &ldquo;day&rdquo; and a &ldquo;year&rdquo; is set by the
              day-count convention written into the loan or bond documents. The five conventions this
              calculator supports differ only in how they count days and the year:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.contentTable}>
                <thead>
                  <tr>
                    <th>Convention</th>
                    <th>Days Counted</th>
                    <th>Year Basis</th>
                    <th>Example: 15 Jan → 15 Apr 2026, $10,000 at 5%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Actual/365 (Fixed)</strong></td>
                    <td>Actual elapsed calendar days</td>
                    <td>365 days</td>
                    <td>90 ÷ 365 → $123.29</td>
                  </tr>
                  <tr>
                    <td><strong>Actual/360 (Banker’s Rule)</strong></td>
                    <td>Actual elapsed calendar days</td>
                    <td>360 days</td>
                    <td>90 ÷ 360 → $125.00</td>
                  </tr>
                  <tr>
                    <td><strong>30/360 US (NASD / Bond Basis)</strong></td>
                    <td>Each month treated as 30 days</td>
                    <td>360 days</td>
                    <td>90 ÷ 360 → $125.00</td>
                  </tr>
                  <tr>
                    <td><strong>30E/360 (Eurobond Basis)</strong></td>
                    <td>30 days/month (31st clamped to 30)</td>
                    <td>360 days</td>
                    <td>90 ÷ 360 → $125.00</td>
                  </tr>
                  <tr>
                    <td><strong>Actual/Actual (ISDA)</strong></td>
                    <td>Actual elapsed calendar days</td>
                    <td>365 or 366 (split by year)</td>
                    <td>90 ÷ 365 → $123.29</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>Accrued Interest Between Two Dates</h2>
            <p>
              Consider a commercial loan agreement where $10,000 principal begins accruing interest on
              15 January 2026 with a scheduled payoff date on 15 April 2026 at a 5% nominal annual rate.
            </p>
            <p>
              The actual elapsed calendar duration is exactly 90 days (16 days in January + 28 days in
              February + 31 days in March + 15 days in April = 90 days).
            </p>
            <ul>
              <li>
                <strong>Actual/365:</strong> <code>$10,000 × 0.05 × (90 ÷ 365) = $123.29</code>
              </li>
              <li>
                <strong>Actual/360:</strong> <code>$10,000 × 0.05 × (90 ÷ 360) = $125.00</code>
              </li>
              <li>
                <strong>30/360 US:</strong> Month difference is 3 months × 30 days = 90 days:{' '}
                <code>$10,000 × 0.05 × (90 ÷ 360) = $125.00</code>
              </li>
            </ul>

            <h2>Accrued Interest on a Bond</h2>
            <p>
              When an investor purchases a coupon-bearing bond between payment dates, the buyer must reimburse
              the seller for the interest accrued during the seller’s holding period.
            </p>
            <p>
              <strong>Standard Bond Accrual Fixture:</strong>
            </p>
            <ul>
              <li>Par / Face Value: $1,000.00</li>
              <li>Coupon Rate: 5.75% per annum</li>
              <li>Payment Frequency: Semi-Annual (2 disbursements per year)</li>
              <li>Periodic Coupon Payment: <code>$1,000 × (0.0575 ÷ 2) = $28.75</code></li>
              <li>Days Accrued since Last Coupon: 61 days</li>
              <li>Standard Semi-Annual Basis Days (30/360): 180 days (360 ÷ 2)</li>
            </ul>
            <p>
              The bond accrued interest is:
            </p>
            <p style={{ fontFamily: 'monospace', padding: '10px 14px', background: 'var(--surface-subtle)', borderRadius: '6px' }}>
              Accrued Interest = $28.75 × (61 ÷ 180) = $9.7424... ≈ $9.74
              <br />
              Dirty Settlement Price = $1,000.00 + $9.74 = $1,009.74
            </p>

            <h2>Accrued Interest in Excel and Google Sheets</h2>
            <p>
              Spreadsheet applications include native financial functions to compute accrued interest without
              manual day-counting errors:
            </p>
            <ul>
              <li>
                <code>=YEARFRAC(start_date, end_date, [basis])</code>: Computes the exact year fraction.
                Use <code>basis = 3</code> for Actual/365, <code>basis = 2</code> for Actual/360,
                <code>basis = 0</code> for 30/360 US, or <code>basis = 1</code> for Actual/Actual.
              </li>
              <li>
                <code>=DAYS360(start_date, end_date, [method])</code>: Returns the number of days between two
                dates based on a 360-day year (false = US method, true = European method).
              </li>
              <li>
                <code>=ACCRINT(issue, first_interest, settlement, rate, par, frequency, [basis])</code>:
                Returns the accrued interest for a security that pays periodic interest.
              </li>
            </ul>

            <h2>Simple vs. Compound Interest</h2>
            <p>
              The difference between simple and compound interest becomes substantial over longer loan horizons:
            </p>
            <ul>
              <li>
                <strong>Simple Interest:</strong> Interest earned in year 1 does not generate interest in year 2.
                The rate is applied strictly to the original principal. Over 3 years at 5%, $10,000 earns
                <strong>$1,500.00</strong>.
              </li>
              <li>
                <strong>Compound Interest:</strong> Interest is added back to the principal at each compounding
                interval. At monthly compounding, the same $10,000 earns <strong>$1,614.72</strong> over 3 years
                (an additional $114.72 in interest).
              </li>
            </ul>
            <p>
              To model compounding deposits or investment portfolios, explore our dedicated{' '}
              <Link href="/compound-interest-calculator/" style={{ color: 'var(--cat-math)', fontWeight: 700 }}>
                Compound Interest Calculator
              </Link>{' '}
              or analyze annualized returns with the{' '}
              <Link href="/cagr-calculator/" style={{ color: 'var(--cat-math)', fontWeight: 700 }}>
                CAGR Calculator
              </Link>.
            </p>

            <section className={styles.faqSection}>
              <h2>Frequently Asked Questions</h2>
              {FAQ_ITEMS.map((item, index) => (
                <div key={index} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{item.q}</h3>
                  <div className={styles.faqAnswer}>
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </section>
          </article>
        </div>

        <AdSlot slotId="simple-interest-ad-bottom" format="horizontal" />
      </div>
      <JsonLd
          data={buildWebApplicationSchema({
            name: route.title,
            description: route.description,
            path: route.path,
            applicationCategory: 'FinanceApplication',
          })}
        />
      </main>
  );
}
