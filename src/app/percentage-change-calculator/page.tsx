import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import PercentageChangeCalculator from '@/components/tool/percentage-change-calculator';
import ToolShell from '@/components/tool/shared/ToolShell';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  pctChange,
  pctDifference,
  applyPct,
  reversePct,
  pctOf,
  formatPct,
  formatNumber,
} from '@/lib/percent-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.percentageChangeCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

// Dynamic engine calculations for build-time content accuracy
const ex80to100 = pctChange(80, 100); // 25
const ex100to80 = pctChange(100, 80); // -20
const exPriceOld = 50;
const exPriceNew = 65;
const exPriceChange = pctChange(exPriceOld, exPriceNew); // 30%

const exSalaryOld = 60000;
const exSalaryNew = 66000;
const exSalaryChange = pctChange(exSalaryOld, exSalaryNew); // 10%

const exScoreOld = 70;
const exScoreNew = 84;
const exScoreChange = pctChange(exScoreOld, exScoreNew); // 20%

const exDiff80_100 = pctDifference(80, 100); // 22.22%

const exRev115_15 = reversePct(115, 15); // 100
const exRev80_20 = reversePct(80, -20); // 100

const ex10PctOf50 = pctOf(10, 50); // 5

const faqs = [
  {
    q: 'How do you find percent change?',
    a: `To find percent change, subtract the old value from the new value, divide the difference by the absolute value of the old value, and multiply by 100. For example, moving from 80 to 100: (100 − 80) ÷ 80 × 100 = 20 ÷ 80 × 100 = ${formatPct(
      ex80to100
    )} increase. If the new value is lower than the old value, the result is negative, indicating a percentage decrease.`,
  },
  {
    q: 'What is the percentage change formula?',
    a: `The standard percentage change formula is: Percentage Change = ((New Value − Old Value) ÷ |Old Value|) × 100. The old value is placed in the denominator because it represents the initial baseline from which change is measured. The absolute value |Old Value| ensures that calculations starting from negative numbers produce mathematically consistent directions.`,
  },
  {
    q: 'How do you calculate percentage difference between two numbers?',
    a: `Percentage difference is calculated using the formula: Percentage Difference = (|Value A − Value B| ÷ ((Value A + Value B) ÷ 2)) × 100. Unlike percentage change, percentage difference is symmetric: order does not matter. The denominator is the average of both values. Between 80 and 100, the percentage difference is ${formatNumber(
      exDiff80_100 ?? 0,
      2
    )}%.`,
  },
  {
    q: 'Is percent difference the same as percent change?',
    a: `No. Percent change requires an old (initial) value and a new (final) value to determine direction (increase or decrease). Percent difference is used when neither number is the baseline—for example, comparing prices or capacities between two competing stores. While moving from 80 to 100 is a ${formatPct(
      ex80to100
    )} change, the symmetric percent difference between 80 and 100 is ${formatNumber(
      exDiff80_100 ?? 0,
      2
    )}%.`,
  },
  {
    q: 'How do I calculate percent decrease?',
    a: `To calculate a percent decrease, subtract the new value from the old value, divide by the old value, and multiply by 100. For example, if a price drops from 100 to 80: (100 − 80) ÷ 100 × 100 = 20%. Expressed as a signed percent change, this is ${formatPct(
      ex100to80
    )}. Notice that going from 100 to 80 is a 20% drop, even though going from 80 to 100 was a 25% gain.`,
  },
  {
    q: 'How do I add 10% (or 15%, 20%) to a number?',
    a: `To add a percentage to a number, convert the percentage into a decimal factor by adding 1. For a 10% increase, multiply by 1.10. For a 15% increase, multiply by 1.15. For a 20% increase, multiply by 1.20. For example, adding 15% to $100 equals $100 × 1.15 = $${formatNumber(
      applyPct(100, 15)
    )}. To decrease by 20%, multiply by (1 − 0.20) = 0.80.`,
  },
  {
    q: 'How do I find the original price before a percentage increase?',
    a: `To find the original price before a percentage increase, divide the final price by (1 + percentage ÷ 100). Never simply subtract the percentage from the final price. For example, if an item costs $115 after a 15% sales tax, the pre-tax price was $115 ÷ 1.15 = $${formatNumber(
      exRev115_15 ?? 0
    )}. Subtracting 15% from $115 would give $97.75, which is incorrect.`,
  },
  {
    q: 'How do I calculate percentage change in Excel or Google Sheets?',
    a: `In Excel or Google Sheets, if the initial value is in cell A2 and the final value is in cell B2, enter the formula: =(B2-A2)/ABS(A2). Then format the cell as Percentage (Ctrl+Shift+%). Do NOT multiply by 100 inside the formula; Excel's percentage formatting automatically multiplies cell values by 100 and appends the % symbol.`,
  },
  {
    q: 'Can a percentage increase be more than 100%?',
    a: `Yes. A percentage increase exceeds 100% whenever the final value is more than double the original value. For example, if a metric increases from 50 to 125, the change is (125 − 50) ÷ 50 × 100 = +150% (meaning 2.5× the original baseline). Conversely, a standard percentage decrease cannot exceed 100% unless dealing with negative quantities, because a 100% decrease reduces any positive number to zero.`,
  },
  {
    q: 'What is the percent change when the starting value is zero?',
    a: `Percent change from zero is mathematically undefined. Because division by zero is impossible in arithmetic, you cannot compute a percentage increase from $0 to $50. In financial and business reports, this is stated as "undefined", "N/A", or reported simply as the absolute change (+50).`,
  },
  {
    q: "What's the difference between percent and percentage points?",
    a: `A percentage point (pp) measures the simple arithmetic difference between two percentages, whereas percent measures the relative change. If a mortgage interest rate moves from 4% to 5%, it increased by 1 percentage point (5 − 4 = 1 pp). However, the relative surge in your interest cost is ((5 − 4) ÷ 4) × 100 = +25%. Confusing the two is one of the most common statistical errors in media and finance.`,
  },
  {
    q: 'What is 10% of 50, and 10 is 25% of what number?',
    a: `10% of 50 equals ${formatNumber(
      ex10PctOf50
    )} (calculated as 0.10 × 50). To find what number 10 is 25% of, divide 10 by 0.25 (or 25 ÷ 100), which equals 40 (meaning 10 is 25% of 40).`,
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: route.title,
  path: route.path,
  description: route.description,
  applicationCategory: 'BusinessApplication',
});

const faqSchema = buildFaqSchema(faqs);

const breadcrumbList = [
  { name: 'Home', path: '/' },
  { name: 'Tools', path: '/tools/' },
  { name: 'Percentage Change Calculator', path: route.path },
];

export default function PercentageChangePage() {
  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <JsonLd data={webAppSchema} />
      <JsonLd data={faqSchema} />

      <Breadcrumbs items={breadcrumbList} />

      <header className={styles.header}>
        <h1 className={styles.h1}>Percentage Change Calculator: Increase, Decrease &amp; Difference</h1>
        <p className={styles.lead}>
          Calculate the exact percentage increase, percentage decrease, or symmetric difference between two numbers.
          Includes step-by-step math, reverse percentages, percentage points (pp), batch list comparisons, and copyable Excel formulas.
        </p>
        <div className={styles.meta}>
          <span>Category: Business &amp; Everyday Utilities</span>
          <span> · </span>
          <span>Updated: November 2026</span>
          <span> · </span>
          <span>Client-Side Verified</span>
        </div>
      </header>

      {/* BLUF Box (Bottom Line Up Front) */}
      <div className={styles.blufBox}>
        <strong>Quick Answer:</strong> To find percent change, subtract the old value from the new value, divide by the
        old value, and multiply by 100. From 80 to 100, the calculation is (100 − 80) ÷ 80 × 100 = 20 ÷ 80 × 100 ={' '}
        <strong>{formatPct(ex80to100)} increase</strong>. If the new value is smaller (e.g. from 100 to 80), the result is{' '}
        <strong>{formatPct(ex100to80)} decrease</strong>. Order matters because the initial number is the baseline.
      </div>

      <AdSlot slotId="before-calculator" />

      {/* Interactive Tool Component */}
      <section className={styles.toolSection} aria-label="Interactive Percentage Calculator">
        <ToolShell
          features={[
            '8 calculators in one',
            'Step-by-step working',
            'Excel & Sheets formula',
            'Phone, tablet & PC',
          ]}
        >
          <PercentageChangeCalculator />
        </ToolShell>
      </section>

      <AdSlot slotId="after-calculator" />

      {/* In-Depth Educational Guide & Authoritative Content */}
      <article className={styles.article}>
        {/* Section 1 */}
        <section className={styles.section}>
          <h2 className={styles.h2}>How to Find Percent Change</h2>
          <p className={styles.p}>
            Finding the percentage change between two values is the foundational calculation for tracking price increases,
            pay raises, business revenue growth, stock returns, and project estimates. Percentage change measures the
            relative shift between a starting quantity (the baseline) and an ending quantity, expressed as a fraction of 100.
          </p>
          <p className={styles.p}>
            To calculate percentage change manually, follow these three sequential steps:
          </p>
          <ol style={{ paddingLeft: '24px', margin: '0 0 16px', lineHeight: '1.7' }}>
            <li>
              <strong>Find the absolute delta:</strong> Subtract the initial (old) value from the final (new) value:
              <code> Delta = New − Old</code>.
            </li>
            <li>
              <strong>Divide by the starting baseline:</strong> Divide the delta by the absolute value of the original number:
              <code> Ratio = Delta ÷ |Old|</code>.
            </li>
            <li>
              <strong>Convert to a percentage:</strong> Multiply the ratio by 100:
              <code> Percent Change = Ratio × 100</code>.
            </li>
          </ol>

          <h3 className={styles.h3}>Three Real-World Engine Examples</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>Old Value</th>
                  <th>New Value</th>
                  <th>Step-by-Step Arithmetic</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Retail Price Increase</strong>
                  </td>
                  <td>${formatNumber(exPriceOld)}</td>
                  <td>${formatNumber(exPriceNew)}</td>
                  <td>((${exPriceNew} − ${exPriceOld}) ÷ ${exPriceOld}) × 100 = (15 ÷ 50) × 100</td>
                  <td style={{ fontWeight: 700, color: '#166534' }}>{formatPct(exPriceChange)}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Annual Salary Raise</strong>
                  </td>
                  <td>${formatNumber(exSalaryOld)}</td>
                  <td>${formatNumber(exSalaryNew)}</td>
                  <td>
                    (({formatNumber(exSalaryNew)} − {formatNumber(exSalaryOld)}) ÷ {formatNumber(exSalaryOld)}) × 100
                  </td>
                  <td style={{ fontWeight: 700, color: '#166534' }}>{formatPct(exSalaryChange)}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Exam Score Improvement</strong>
                  </td>
                  <td>{exScoreOld} pts</td>
                  <td>{exScoreNew} pts</td>
                  <td>(({exScoreNew} − {exScoreOld}) ÷ {exScoreOld}) × 100 = (14 ÷ 70) × 100</td>
                  <td style={{ fontWeight: 700, color: '#166534' }}>{formatPct(exScoreChange)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2 */}
        <section className={styles.section}>
          <h2 className={styles.h2}>The Percentage Change Formula</h2>
          <p className={styles.p}>
            The universal mathematical formula for percentage change is written as:
          </p>
          <div className={styles.codeBox}>
            <code>Percentage Change (%) = ((V₂ − V₁) ÷ |V₁|) × 100</code>
          </div>
          <p className={styles.p}>
            Where <code>V₁</code> is the initial (original) value and <code>V₂</code> is the final (subsequent) value.
          </p>
          <p className={styles.p}>
            The most critical element of this equation is the denominator: <strong>the old value always goes on the bottom</strong>.
            Why? Because percentage change answers the specific question: <em>&quot;By what proportion did the original quantity expand
            or contract?&quot;</em> If you mistakenly place the new value in the denominator, you are no longer measuring growth relative
            to where you began; you are calculating a backwards fraction that invalidates financial and statistical comparisons.
          </p>
        </section>

        {/* Section 3 */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Percent Increase vs. Percent Decrease (The Mathematical Asymmetry)</h2>
          <p className={styles.p}>
            One of the most counter-intuitive facts in commercial arithmetic is that percentage increase and percentage
            decrease are <strong>not symmetric</strong>. An increase of 25% followed by a decrease of 25% does not return you
            to your starting balance.
          </p>
          <div className={styles.callout}>
            <strong>Example of Asymmetry:</strong>
            <br />
            • Starting at <strong>80</strong> and rising to <strong>100</strong> is an increase of 20 units:
            <code> (20 ÷ 80) × 100 = +25.00%</code>.
            <br />
            • Starting at <strong>100</strong> and falling back to <strong>80</strong> is a drop of the exact same 20 units:
            <code> (−20 ÷ 100) × 100 = −20.00%</code>.
          </div>
          <p className={styles.p}>
            Even though the dollar or unit change is identical (20 units), the percentages differ because the baseline shifted.
            In the first case, you measured 20 against a small denominator of 80 (yielding one-fourth, or 25%). In the second case,
            you measured 20 against a larger denominator of 100 (yielding one-fifth, or 20%).
          </p>
          <p className={styles.p}>
            This asymmetry explains why investment drawdowns require disproportionately larger recoveries: a portfolio that loses
            50% of its capital requires a <strong>+100% gain</strong> just to break even.
          </p>
        </section>

        {/* Section 4 */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Percentage Difference Between Two Numbers</h2>
          <p className={styles.p}>
            People frequently search for &quot;percentage change&quot; when they actually need <strong>percentage difference</strong>.
            The difference between the two concepts is simple:
          </p>
          <ul style={{ paddingLeft: '24px', margin: '0 0 16px', lineHeight: '1.7' }}>
            <li>
              <strong>Percentage Change</strong> implies an order or timeline: there is an &quot;earlier&quot; value and a &quot;later&quot; value.
              It produces a directional sign (positive increase or negative decrease).
            </li>
            <li>
              <strong>Percentage Difference</strong> is symmetric and order-independent: it compares two parallel quantities where neither
              can claim to be the primary baseline.
            </li>
          </ul>
          <p className={styles.p}>
            Because neither value is the baseline, percentage difference divides the absolute difference by the <em>average</em> of the two values:
          </p>
          <div className={styles.codeBox}>
            <code>Percentage Difference (%) = (|A − B| ÷ ((A + B) ÷ 2)) × 100</code>
          </div>
          <p className={styles.p}>
            For numbers 80 and 100: the absolute difference is <code>|80 − 100| = 20</code>. The average is <code>(80 + 100) ÷ 2 = 90</code>.
            The percentage difference is <code>(20 ÷ 90) × 100 = {formatNumber(exDiff80_100 ?? 0, 2)}%</code>.
            Whether you enter 80 first or 100 first, the result remains exactly {formatNumber(exDiff80_100 ?? 0, 2)}%.
          </p>
        </section>

        {/* Section 5 */}
        <section className={styles.section}>
          <h2 className={styles.h2}>How to Increase or Decrease a Number by a Percentage</h2>
          <p className={styles.p}>
            When adding sales tax, contractor markup, inflation adjustments, or discounts, you often need to calculate the final
            number directly without computing the intermediate dollar fee first. The fastest method is using a decimal multiplier:
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Desired Action</th>
                  <th>Multiplier Formula</th>
                  <th>Example on $100</th>
                  <th>Final Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Add 5% (Sales Tax)</td>
                  <td><code>× 1.05</code></td>
                  <td>$100 × 1.05</td>
                  <td>${formatNumber(applyPct(100, 5))}</td>
                </tr>
                <tr>
                  <td>Add 15% (Contractor Contingency)</td>
                  <td><code>× 1.15</code></td>
                  <td>$100 × 1.15</td>
                  <td>${formatNumber(applyPct(100, 15))}</td>
                </tr>
                <tr>
                  <td>Add 50% (Standard Retail Markup)</td>
                  <td><code>× 1.50</code></td>
                  <td>$100 × 1.50</td>
                  <td>${formatNumber(applyPct(100, 50))}</td>
                </tr>
                <tr>
                  <td>Subtract 10% (Loyalty Discount)</td>
                  <td><code>× 0.90</code></td>
                  <td>$100 × 0.90</td>
                  <td>${formatNumber(applyPct(100, -10))}</td>
                </tr>
                <tr>
                  <td>Subtract 20% (Seasonal Sale)</td>
                  <td><code>× 0.80</code></td>
                  <td>$100 × 0.80</td>
                  <td>${formatNumber(applyPct(100, -20))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 6 */}
        <section className={styles.section}>
          <h2 className={styles.h2}>How to Find the Original Number (Reverse Percentage)</h2>
          <p className={styles.p}>
            Reverse percentage calculations arise when you have an invoice total, sale receipt, or inflated price and need to determine
            what the starting amount was before the percentage was applied.
          </p>
          <p className={styles.p}>
            <strong>The #1 Mistake:</strong> If an item costs $115 after a 15% markup, many people mistakenly calculate <code>$115 × 0.15 = $17.25</code>
            and subtract that to guess $97.75. That is completely wrong because the 15% was originally calculated on the smaller, unknown baseline,
            not on the $115 total!
          </p>
          <div className={styles.codeBox}>
            <code>Original Value = Final Value ÷ (1 + (Percentage ÷ 100))</code>
          </div>
          <p className={styles.p}>
            Correct calculation: <code>$115 ÷ 1.15 = ${formatNumber(exRev115_15 ?? 0)}</code>. To verify: $100 + 15% = $115.
            Similarly, if an item is $80 after a 20% discount, the original pre-sale price was <code>$80 ÷ (1 − 0.20) = $80 ÷ 0.80 = ${formatNumber(exRev80_20 ?? 0)}</code>.
          </p>
        </section>

        {/* Section 7 */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Percentage Change in Excel and Google Sheets</h2>
          <p className={styles.p}>
            Spreadsheets are where most professional percentage calculations take place. However, Excel and Google Sheets have a built-in
            formatting behavior that causes frequent errors:
          </p>
          <div className={styles.callout}>
            <strong>The &quot;Multiply by 100&quot; Pitfall:</strong> In pure math, you multiply by 100 to convert decimals into percentages.
            However, when you apply Excel&apos;s <strong>Percentage Format</strong> (Ctrl+Shift+%), Excel automatically multiplies the cell value
            by 100 and adds the <code>%</code> symbol. If you multiply by 100 inside the formula and then apply the Percentage format, a 25% change
            will display as <strong>2,500%</strong>!
          </div>

          <h3 className={styles.h3}>Correct Spreadsheet Formulas:</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Calculation Type</th>
                  <th>Cell Formula (Old in A2, New in B2)</th>
                  <th>Cell Formatting</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Percentage Change</strong>
                  </td>
                  <td>
                    <code>=(B2-A2)/ABS(A2)</code>
                  </td>
                  <td>Format → Number → Percentage (0 or 2 decimals)</td>
                </tr>
                <tr>
                  <td>
                    <strong>Percentage Difference</strong>
                  </td>
                  <td>
                    <code>=ABS(A2-B2)/AVERAGE(A2,B2)</code>
                  </td>
                  <td>Format → Number → Percentage</td>
                </tr>
                <tr>
                  <td>
                    <strong>Increase by % in B2</strong>
                  </td>
                  <td>
                    <code>=A2*(1+B2)</code> <em>(if B2 is 15%)</em>
                  </td>
                  <td>Currency or General Number</td>
                </tr>
                <tr>
                  <td>
                    <strong>Reverse (Find Original)</strong>
                  </td>
                  <td>
                    <code>=B2/(1+A2)</code> <em>(where A2 is %)</em>
                  </td>
                  <td>Currency or General Number</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={styles.p}>
            Notice the <code>ABS(A2)</code> function in the denominator. If your initial financial value in A2 is negative (e.g. net loss
            of -$50k moving to a profit of +$50k), omitting <code>ABS</code> will result in a negative growth percentage when your earnings
            actually improved. Using <code>ABS(A2)</code> preserves correct algebraic direction.
          </p>
        </section>

        {/* Section 8 */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Percent vs. Percentage Points (The Vital Distinction)</h2>
          <p className={styles.p}>
            Confusing &quot;percent&quot; with &quot;percentage points&quot; is one of the most widespread numerical blunders in financial
            journalism, economics, and real estate reporting.
          </p>
          <ul style={{ paddingLeft: '24px', margin: '0 0 16px', lineHeight: '1.7' }}>
            <li>
              <strong>Percentage Points (pp):</strong> The absolute linear difference between two percentages (calculated as simple subtraction:
              <code> Rate B − Rate A</code>).
            </li>
            <li>
              <strong>Percent Change (%):</strong> The relative rate of expansion or contraction between those two percentages (calculated as:
              <code> ((Rate B − Rate A) ÷ Rate A) × 100</code>).
            </li>
          </ul>
          <div className={styles.callout}>
            <strong>Mortgage Rate Case Study:</strong>
            <br />
            Suppose a bank&apos;s 30-year fixed mortgage rate climbs from <strong>4.0%</strong> to <strong>5.0%</strong>.
            <br />
            • The rate climbed by <strong>1.0 percentage point</strong> (5.0 − 4.0 = 1.0 pp).
            <br />
            • But the relative increase in interest charges is:
            <code> ((5.0 − 4.0) ÷ 4.0) × 100 = +25.00%</code>.
            <br />
            Saying the rate &quot;went up by 1%&quot; is incorrect; an increase of 1% on a 4.0% rate would only equal 4.04%! The true borrowing cost
            jumped by twenty-five percent.
          </div>
        </section>

        {/* Section 9 */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Zero, Negative, and Over-100% Edge Cases</h2>
          <p className={styles.p}>
            Calculators that do not handle mathematical edge cases produce confusing errors like <code>NaN</code>, <code>Infinity</code>, or
            misleading signs. Here is how rigorous business math resolves each boundary condition:
          </p>
          <h3 className={styles.h3}>1. Starting from Zero</h3>
          <p className={styles.p}>
            If you start with $0 and now have $100, what is your percentage gain? It is <strong>mathematically undefined</strong>.
            Division by zero is impossible in arithmetic. While some informal writers say &quot;infinite gain,&quot; formal financial reporting
            marks the cell as <em>N/A</em> or simply states: &quot;New revenue is $100 (prior period was $0).&quot;
          </p>
          <h3 className={styles.h3}>2. Negative Starting Values</h3>
          <p className={styles.p}>
            If a business has a net loss of -$20,000 in Year 1 and reaches +$10,000 in Year 2, the change is positive (performance improved by $30,000).
            Without absolute value formatting in the denominator, the formula yields <code>(10,000 − (−20,000)) ÷ (−20,000) = 30,000 ÷ (−20,000) = −150%</code>,
            which incorrectly suggests performance deteriorated. Standard financial math uses <code>|Old|</code> so that moving from -$20k to +$10k correctly
            reports as a <strong>+150% improvement</strong>.
          </p>
          <h3 className={styles.h3}>3. Increases Greater Than 100%</h3>
          <p className={styles.p}>
            A percentage increase can reach any positive number. A +100% change represents a doubling of the starting value. A +200% change represents
            a tripling. A +1,000% increase means the final value is 11 times the original baseline.
          </p>
        </section>

        {/* Section 10: FAQ */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>{faq.q}</h3>
              <div className={styles.faqAnswer}>
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </section>

        {/* How We Calculate Section */}
        <HowWeCalculate slug="percentage-change-calculator" />

        {/* Related Business & Estimating Tools */}
        <section className={styles.section} style={{ marginTop: '40px' }}>
          <h2 className={styles.h2}>Related Business &amp; Construction Calculators</h2>
          <p className={styles.p}>
            Explore our companion calculators for material takeoffs, contractor billing, and commercial pricing:
          </p>
          <div className={styles.relatedGrid}>
            <Link href="/credit-card-payoff-calculator/" className={styles.relatedCard}>
              <span className={styles.relatedTitle}>Credit Card Payoff Calculator</span>
              <span className={styles.relatedDesc}>
                Model credit card APR, payoff timelines, minimum payment traps, and avalanche vs snowball debt reduction.
              </span>
            </Link>
            <Link href="/compound-interest-calculator/" className={styles.relatedCard}>
              <span className={styles.relatedTitle}>Compound Interest Calculator</span>
              <span className={styles.relatedDesc}>
                Model multi-year exponential compound growth with daily, monthly, and continuous compounding intervals.
              </span>
            </Link>
            <Link href="/present-value-calculator/" className={styles.relatedCard}>
              <span className={styles.relatedTitle}>Present Value Calculator</span>
              <span className={styles.relatedDesc}>
                Discount future lump sums and annuities to present dollars, calculate capital project NPV, and print PV tables.
              </span>
            </Link>
            <Link href="/rental-property-calculator/" className={styles.relatedCard}>
              <span className={styles.relatedTitle}>Rental Property Calculator</span>
              <span className={styles.relatedDesc}>
                Calculate monthly rental cash flow, cash-on-cash return, cap rate, and 10-year pro forma equity.
              </span>
            </Link>
            <Link href="/cap-rate-calculator/" className={styles.relatedCard}>
              <span className={styles.relatedTitle}>Cap Rate Calculator</span>
              <span className={styles.relatedDesc}>
                Calculate un-leveraged commercial capitalization rate, fair property value from NOI, and investment yield spreads.
              </span>
            </Link>
            <Link href="/hourly-to-salary-calculator/" className={styles.relatedCard}>
              <span className={styles.relatedTitle}>Hourly to Salary Calculator</span>
              <span className={styles.relatedDesc}>
                Convert hourly wages to annual salary, calculate pay raise percentages, and evaluate job offers.
              </span>
            </Link>
            <Link href="/unit-price-calculator/" className={styles.relatedCard}>
              <span className={styles.relatedTitle}>Unit Price Calculator</span>
              <span className={styles.relatedDesc}>
                Compare price per ounce, pound, or litre across competing products and calculate shrinkflation percentage hikes.
              </span>
            </Link>
            <Link href="/profit-margin-calculator/" className={styles.relatedCard}>
              <span className={styles.relatedTitle}>Profit Margin Calculator</span>
              <span className={styles.relatedDesc}>
                Calculate gross profit margin, operating margin (EBIT), net income, and analyze full multi-tier P&amp;L cascades.
              </span>
            </Link>
            <Link href="/markup-calculator/" className={styles.relatedCard}>
              <span className={styles.relatedTitle}>Markup Calculator</span>
              <span className={styles.relatedDesc}>
                Determine exact selling prices from cost and markup %, compare gross margin side-by-side, and calculate price multipliers.
              </span>
            </Link>
            <Link href="/construction-estimate-template/" className={styles.relatedCard}>
              <span className={styles.relatedTitle}>Construction Estimate Template</span>
              <span className={styles.relatedDesc}>
                Build professional contractor estimates with customizable markup %, sales tax, and print-ready PDF export.
              </span>
            </Link>
            <Link href="/square-footage-calculator/" className={styles.relatedCard}>
              <span className={styles.relatedTitle}>Square Footage Calculator</span>
              <span className={styles.relatedDesc}>
                Compute area across multi-room floor plans with unit conversions and waste percentages.
              </span>
            </Link>
            <Link href="/tile-calculator/" className={styles.relatedCard}>
              <span className={styles.relatedTitle}>Tile Calculator</span>
              <span className={styles.relatedDesc}>
                Estimate floor and wall tile boxes with precise 10% to 15% cutting overage calculations.
              </span>
            </Link>
            <Link href="/carpet-cost-calculator/" className={styles.relatedCard}>
              <span className={styles.relatedTitle}>Carpet Cost Calculator</span>
              <span className={styles.relatedDesc}>
                Full broadloom roll takeoff with seam placement and materials vs installation breakdown.
              </span>
            </Link>
          </div>
        </section>
      </article>

      <AdSlot slotId="after-content" />
    </main>
  );
}
