import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import ToolShell from '@/components/tool/shared/ToolShell';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import FractionPercentCalculator from '@/components/tool/fraction-percent-calculator';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import AdSlot from '@/components/ads/AdSlot';
import { ROUTES } from '@/lib/routes';
import { generateCommonFractionsTable } from '@/lib/fraction-percent-engine';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.fractionToPercentCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const FAQ_ITEMS = [
  {
    q: 'How do you turn a fraction into a percentage?',
    a: 'To convert any fraction a/b into a percentage, divide the numerator by the denominator to obtain a decimal, then multiply by 100%. For example, with 4/5: 4 ÷ 5 = 0.80, and 0.80 × 100% = 80%.',
  },
  {
    q: 'What is 16 out of 20 as a percentage and letter grade?',
    a: '16 out of 20 is exactly 80.0%. On the example US 10-point scale (A 90+, B 80+, C 70+, D 60+), 80.0% is a B (B− on the example plus/minus scale), and you need 2 more points (18/20) for an A. Your school’s scale may differ, so you can enter your own cutoffs.',
  },
  {
    q: 'What is 4/5 as a percent?',
    a: '4/5 is equal to 80%. When you divide 4 by 5 you get 0.80, which represents 80 out of 100 parts.',
  },
  {
    q: 'What is 1/3 as a percent, and why does it repeat?',
    a: '1/3 is equal to 33.3̅% (approximately 33.33%). It repeats indefinitely because 3 is not a prime factor of 10 (the base of our decimal system, which only factors into 2 and 5). Any fraction whose reduced denominator has prime factors other than 2 or 5 creates a non-terminating, repeating decimal.',
  },
  {
    q: 'What is the "X is what percent of Y" formula?',
    a: 'The formula is: Percentage = (X ÷ Y) × 100. For example, to find what percentage 12 is of 80: (12 ÷ 80) × 100 = 0.15 × 100 = 15%.',
  },
  {
    q: 'How do you find the percentage of a number?',
    a: 'To calculate P% of X, convert the percentage into a decimal by dividing by 100, then multiply by the base number: Result = (P ÷ 100) × X. For instance, 15% of 80 is 0.15 × 80 = 12.',
  },
  {
    q: 'How do you subtract a percentage from a number?',
    a: 'To subtract P% from a number X, calculate X × (1 − P ÷ 100). For example, subtracting 15% from 80 gives 80 × (1 − 0.15) = 80 × 0.85 = 68. Conversely, adding 15% gives 80 × 1.15 = 92.',
  },
  {
    q: 'How do I convert a mixed number like 1 1/4 to a percent?',
    a: 'First convert the mixed number into an improper fraction or decimal: 1 1/4 = 1 + 1/4 = 1.25. Then multiply by 100%: 1.25 × 100% = 125%. Any mixed number with a whole number greater than or equal to 1 will produce a percentage greater than or equal to 100%.',
  },
  {
    q: 'Can a percentage be greater than 100%?',
    a: 'Yes. A percentage greater than 100% simply means the part is larger than the base reference whole. For example, 5/4 = 125%, 3/2 = 150%, and 8/3 = 266.6̅%.',
  },
  {
    q: 'What letter grade corresponds to my percentage?',
    a: 'Grading policies vary by institution, country, and course syllabus. There is no single standard. This calculator offers an example US 10-point scale (A 90% and above, B 80% up to 90%, C 70% up to 80%, D 60% up to 70%, F below 60%), an example plus/minus scale, and a “My own cutoffs” option so you can match your syllabus.',
  },
  {
    q: 'How do I convert a percentage back into a simplified fraction?',
    a: 'Place the percentage number over 100, then divide both numerator and denominator by their greatest common divisor (GCD). For example, 37.5% = 37.5/100 = 375/1000. Dividing both by 125 yields 3/8.',
  },
  {
    q: 'How do I find the whole number when given a part and a percentage?',
    a: 'To find the base whole when X represents P% of it, divide the part by the decimal percentage: Whole = X ÷ (P ÷ 100). For example, if 12 is 15% of a total, the total is 12 ÷ 0.15 = 80.',
  },
];

export default function FractionToPercentPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Fraction to Percent Calculator',
        applicationCategory: 'EducationalApplication',
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
            { name: 'Fraction to Percent', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>Fraction to Percent Calculator: X out of Y as a Percentage</h1>
          <p className={styles.subtitle}>
            Use this percentage finder to turn any fraction or test score into a percentage, or to find a percent of a number.
          </p>

          <div className={styles.bluf}>
            To turn a fraction or score into a percentage, divide the part by the whole and multiply by 100. For example: 4/5 = 80%, 16 out of 20 = 80%, 3/8 = 37.5%, and 1/3 = 33.3̅% (repeating decimal).
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Fractions & mixed numbers',
              'Scores with letter grade',
              'Percent of a number',
              'Printable fraction & score tables',
            ]}
          >
            <FractionPercentCalculator />
          </ToolShell>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className={styles.contentSection}>
          <div className={styles.prose}>
            <h2>What is a Percentage?</h2>
            <p>
              A <strong>percentage</strong> is a dimensionless ratio expressing a fraction of 100. The word originates from the Latin <em>per centum</em>, meaning &quot;by the hundred.&quot; Whether you are calculating exam grades, statistical test rates, cooking proportions, or financial returns, converting numbers to percentages creates a standardized scale where disparate values can be compared directly.
            </p>

            <h2>How to Use the Percentage Finder</h2>
            <p>
              This tool unites three essential mathematical conversions onto a single, unified interface:
            </p>
            <ol>
              <li><strong>Fraction → Percent:</strong> Enter any proper fraction (e.g. <code>4/5</code>, <code>3/8</code>), improper fraction (e.g. <code>5/4</code>, <code>8/3</code>), mixed number (e.g. <code>1 1/4</code>, <code>4 3/4</code>), or decimal (e.g. <code>0.375</code>). The engine displays the exact percentage, decimal value, simplified fraction, and flags repeating decimals with explicit repetend notation.</li>
              <li><strong>Score → Percent &amp; Grade:</strong> Enter test scores or exam questions. Supports both &quot;points earned&quot; and &quot;questions missed&quot; modes, includes optional extra credit/bonus points, assigns letter grades using configurable boundary scales, and tells you exactly how many additional points were needed to achieve the next grade bracket.</li>
              <li><strong>Percent of a Number:</strong> Quickly answer five universal percentage questions: What is P% of X? X is what percent of Y? X is P% of what number? Add P% to X, or Subtract P% from X.</li>
            </ol>

            <AdSlot slotId="fraction-calc-ad-mid" format="horizontal" />

            <h2>How to Turn a Fraction into a Percent</h2>
            <p>
              Converting a fraction to a percentage involves a simple two-step mathematical procedure:
            </p>
            <div className={styles.formulaBox}>
              Percentage (%) = (Numerator ÷ Denominator) × 100
            </div>

            <p>Here are several practical examples:</p>
            <ul>
              <li><strong>4/5 to a percent:</strong> 4 ÷ 5 = 0.80 → 0.80 × 100 = <strong>80%</strong></li>
              <li><strong>3/5 to a percent:</strong> 3 ÷ 5 = 0.60 → 0.60 × 100 = <strong>60%</strong></li>
              <li><strong>3/4 to a percent:</strong> 3 ÷ 4 = 0.75 → 0.75 × 100 = <strong>75%</strong></li>
              <li><strong>3/8 to a percent:</strong> 3 ÷ 8 = 0.375 → 0.375 × 100 = <strong>37.5%</strong></li>
              <li><strong>Mixed number 1 1/4:</strong> (1 × 4 + 1) ÷ 4 = 5/4 = 1.25 → 1.25 × 100 = <strong>125%</strong></li>
              <li><strong>Mixed number 4 3/4:</strong> (4 × 4 + 3) ÷ 4 = 19/4 = 4.75 → 4.75 × 100 = <strong>475%</strong></li>
              <li><strong>Improper fraction 3/2:</strong> 3 ÷ 2 = 1.50 → 1.50 × 100 = <strong>150%</strong></li>
              <li><strong>Improper fraction 8/3:</strong> 8 ÷ 3 = 2.6666... → <strong>266.6̅%</strong> (or 266.67%)</li>
            </ul>

            <h2>Repeating Decimals: 1/3, 2/3, and 1/7</h2>
            <p>
              In our base-10 positional numeral system, a reduced fraction a/b will produce a terminating decimal if and only if the prime factors of the denominator b are exclusively 2 and/or 5 (the prime factors of 10).
            </p>
            <p>
              Whenever the denominator contains any other prime factor (such as 3, 7, 11, or 13), the division never terminates and forms a recurring sequence of digits known as a <strong>period</strong> or <strong>repetend</strong>:
            </p>
            <ul>
              <li><strong>1/3 as a percent:</strong> 1 ÷ 3 = 0.3333... → <strong>33.3̅%</strong> (written with a vinculum or overline bar). Truncating this to 33.3% loses precision; rounding to two decimal places yields 33.33%.</li>
              <li><strong>2/3 as a percent:</strong> 2 ÷ 3 = 0.6666... → <strong>66.6̅%</strong> (rounds to 66.67%).</li>
              <li><strong>11/15 as a percent:</strong> 11 ÷ 15 = 0.7333... → <strong>73.3̅%</strong> (rounds to 73.33%).</li>
              <li><strong>13/15 as a percent:</strong> 13 ÷ 15 = 0.8666... → <strong>86.6̅%</strong> (rounds to 86.67%).</li>
            </ul>

            <h2>X out of Y as a Percentage (Test Scores)</h2>
            <p>
              Students and teachers frequently convert raw point tallies into standardized percentages and letter grades. To calculate your test score:
            </p>
            <div className={styles.formulaBox}>
              Test Score (%) = (Points Earned ÷ Total Points) × 100
            </div>

            <p>Common test score conversions (letter grades use the example US 10-point scale; yours may differ):</p>
            <ul>
              <li><strong>16 out of 20:</strong> (16 ÷ 20) × 100 = <strong>80.0% (B on the example scale)</strong>. To reach an A (90%), 0.90 × 20 = 18 points, meaning 2 more points were needed.</li>
              <li><strong>18 out of 20:</strong> (18 ÷ 20) × 100 = <strong>90.0% (Grade A)</strong>.</li>
              <li><strong>11 out of 15:</strong> (11 ÷ 15) × 100 = <strong>73.3̅% (Grade C)</strong>.</li>
              <li><strong>13 out of 15:</strong> (13 ÷ 15) × 100 = <strong>86.6̅% (Grade B)</strong>.</li>
              <li><strong>20 out of 25:</strong> (20 ÷ 25) × 100 = <strong>80.0% (Grade B)</strong>.</li>
              <li><strong>21 out of 25:</strong> (21 ÷ 25) × 100 = <strong>84.0% (Grade B)</strong>.</li>
              <li><strong>12 out of 20:</strong> (12 ÷ 20) × 100 = <strong>60.0% (Grade D)</strong>.</li>
            </ul>
            <p>
              To determine what exam score you need to pass a class or achieve a desired course grade, use our dedicated{' '}
              <Link href="/final-grade-calculator/" style={{ color: 'var(--cat-math)', fontWeight: 600 }}>
                Final Grade Calculator
              </Link>.
            </p>

            <h2>X is What Percent of Y?</h2>
            <p>
              When comparing two numbers where one represents a subset or portion of another, use the proportion formula:
            </p>
            <div className={styles.formulaBox}>
              P = (X ÷ Y) × 100
            </div>
            <p>
              For example, if an e-commerce store records 12 conversions out of 80 visitors, the conversion rate is <code>(12 ÷ 80) × 100 = 15.0%</code>.
            </p>

            <h2>How to Find a Percentage of a Number</h2>
            <p>
              To find a specific percentage of a known number, multiply the number by the percentage divided by 100:
            </p>
            <div className={styles.formulaBox}>
              Result = (P ÷ 100) × Base Number
            </div>
            <p>
              For example, finding 15% of 80: <code>(15 ÷ 100) × 80 = 0.15 × 80 = 12</code>.
            </p>
            <p>
              If you need to work backwards—finding the base whole when you know that 12 represents 15% of the total—divide by the decimal rate: <code>12 ÷ 0.15 = 80</code>.
            </p>

            <h2>Adding or Subtracting a Percentage</h2>
            <p>
              Adding or subtracting percentages is fundamental to calculating retail sales markups, customer discounts, and restaurant tips:
            </p>
            <ul>
              <li><strong>Adding P%:</strong> <code>New Value = Base × (1 + P ÷ 100)</code>. Example: adding 15% to 80 yields <code>80 × 1.15 = 92</code>.</li>
              <li><strong>Subtracting P%:</strong> <code>New Value = Base × (1 − P ÷ 100)</code>. Example: taking a 15% discount off 80 yields <code>80 × 0.85 = 68</code>.</li>
            </ul>
            <p>
              For calculating differences between two time periods or values, explore our <Link href="/percentage-change-calculator/">Percentage Change Calculator</Link>. For scaling recipe mixtures or concrete blends, visit our <Link href="/ratio-calculator/">Ratio Calculator</Link>. To take a percentage off a price, use the <Link href="/discount-calculator/">Discount Calculator</Link>.
            </p>

            <h2>Fraction to Percent Conversion Table</h2>
            <p>
              This reference table lists common fractions converted to decimals and exact percentages (including repeating decimals marked with an overline bar) using the engine above.
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.contentTable}>
                <caption>Common fractions converted to decimals and percentages</caption>
                <thead>
                  <tr>
                    <th>Fraction</th>
                    <th>Decimal</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {generateCommonFractionsTable().map((row) => (
                    <tr key={row.fraction}>
                      <td><strong>{row.fraction}</strong></td>
                      <td>{row.decimal}</td>
                      <td><strong>{row.percent}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2>Frequently Asked Questions</h2>
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className={styles.faqItem}>
                <div className={styles.faqQuestion}>{item.q}</div>
                <div className={styles.faqAnswer}>
                  <p>{item.a}</p>
                </div>
              </div>
            ))}

            <HowWeCalculate slug="fraction-to-percent-calculator" />
            <AdSlot slotId="fraction-calc-ad-bottom" format="horizontal" />
          </div>
        </div>
      </div>
    </main>
  );
}
