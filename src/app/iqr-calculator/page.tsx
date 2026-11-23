import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import IqrCalculator from '@/components/tool/iqr-calculator';
import ToolShell from '@/components/tool/shared/ToolShell';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import styles from './page.module.css';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';

export const dynamic = 'force-static';

const route = ROUTES.iqrCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const faqs = [
  {
    q: 'What is the interquartile range (IQR)?',
    a: 'The interquartile range (IQR) is a measure of statistical dispersion that equals the difference between the 75th percentile (third quartile, Q3) and the 25th percentile (first quartile, Q1): IQR = Q3 − Q1. It describes the spread of the middle 50% of your data values and is resistant to extreme outliers.',
  },
  {
    q: 'How do you calculate the IQR step by step?',
    a: 'To calculate the IQR by hand: (1) Sort your dataset in ascending order from smallest to largest. (2) Find the median (Q2) dividing the dataset into two halves. (3) Find Q1, which is the median of the lower half. (4) Find Q3, which is the median of the upper half. (5) Subtract Q1 from Q3: IQR = Q3 − Q1.',
  },
  {
    q: 'How do you find outliers with the IQR (1.5 × IQR rule)?',
    a: 'Under John Tukey’s rule, calculate the inner fences: Lower Inner Fence = Q1 − 1.5 × IQR and Upper Inner Fence = Q3 + 1.5 × IQR. Any data point falling below the lower fence or above the upper fence is identified as a mild outlier. Points beyond 3.0 × IQR (outer fences) are classified as extreme outliers.',
  },
  {
    q: 'Range vs IQR: what is the difference?',
    a: 'The full range is simply Maximum − Minimum, which depends entirely on the two extreme values in your sample. The interquartile range (Q3 − Q1) measures only the middle 50% of observations. Adding one extreme value can change the range a lot, while the IQR moves only slightly, because the quartiles shift by at most one data position.',
  },
  {
    q: 'Why do different calculators give different quartiles?',
    a: 'There is no single universally mandated algorithm for fractional ranks in discrete samples. Textbook methods (Tukey) divide the observations into two distinct halves. Statistical software packages like Microsoft Excel and R use continuous linear interpolation between points. For small datasets (such as 5, 7, 8, 9), methods can yield different quartiles, but all methods converge as sample sizes increase.',
  },
  {
    q: 'Which method do Excel, Google Sheets, R and a TI-84 use?',
    a: 'A TI-83/TI-84 graphing calculator uses Tukey’s method with the median excluded. Microsoft Excel provides two functions: QUARTILE.INC (which uses rank p(n−1)+1, identical to R Type 7 and Google Sheets) and QUARTILE.EXC (which uses rank p(n+1), identical to R Type 6). This calculator allows you to inspect and compare all of them.',
  },
  {
    q: 'How do I read a box plot, and where do the whiskers end?',
    a: 'In a standard Tukey box plot, the center box spans from Q1 to Q3 with an internal line marking the median. The whiskers extend outward to the smallest and largest actual data values that fall inside the 1.5 × IQR fences. Data points outside those fences are plotted individually as outlier dots.',
  },
  {
    q: 'What changes with an even vs odd number of values?',
    a: 'When n is even, the dataset splits cleanly into two equal halves. When n is odd, the exact center value is the median; in Tukey’s standard method (median excluded), that center value is omitted when finding Q1 and Q3. In some alternative textbook conventions, the median is included in both halves.',
  },
  {
    q: 'How do I work out the average (mean) of a data set?',
    a: 'To work out the arithmetic average (mean), add all numbers together to find their sum, then divide that sum by the total count of observations (n). This calculator reports the sample mean alongside the five-number summary so you can compare the mean to the median to assess skewness.',
  },
  {
    q: 'Can the IQR be zero or negative?',
    a: 'The IQR is zero when Q1 and Q3 land on the same value, which happens when the middle of the data is made of repeated values (for example, in 4, 5, 5, 5, 5, 6 both Q1 and Q3 are 5, so the IQR is 0). The IQR cannot be negative because data is sorted in ascending order, ensuring Q3 is always greater than or equal to Q1.',
  },
];

export default function IqrCalculatorPage() {
  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'Tools', path: '/tools/' },
            { name: 'Math & Finance', path: '/tools/#math' },
            { name: 'IQR Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>IQR Calculator: Interquartile Range, Quartiles and Outliers</h1>
          <p className={styles.subtitle}>
            Paste any dataset to instantly compute Q1, median, Q3, the interquartile range, Tukey outlier fences, and an interactive box plot with step-by-step arithmetic.
          </p>

          <div className={styles.bluf}>
            <strong>Bottom Line Up Front (BLUF):</strong> The interquartile range (IQR) equals Q3 − Q1, representing the spread of the middle 50% of your data. For the sample 1, 3, 5, 7, 9, 11, 13, 15, the lower half median Q1 is 4 and the upper half median Q3 is 12, yielding an IQR of 8. Different software algorithms (Excel, R, TI-84) can produce slight variations on small datasets; our calculator compares all four methods side by side.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Q1, median, Q3 & IQR',
              'Outlier fences',
              'Box plot',
              'Compare quartile methods',
            ]}
          >
            <IqrCalculator />
          </ToolShell>
        </div>

        <AdSlot slotId="iqr-calc-ad-mid" format="horizontal" />

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>How to Use the IQR Calculator</h2>
            <p>
              This free IQR calculator is designed to accept raw data in any standard format. You can paste numbers separated by commas, spaces, tabs, or multiline spreadsheet columns.
            </p>
            <ol>
              <li>
                <strong>Paste your data:</strong> Enter your numbers into the input box. The parser automatically strips extraneous characters and alerts you if any invalid tokens are detected.
              </li>
              <li>
                <strong>Select your quartile calculation method:</strong> Choose between standard textbook Tukey method (TI-84 style), Excel inclusive (<code>QUARTILE.INC</code> / R Type 7), or Excel exclusive (<code>QUARTILE.EXC</code> / R Type 6).
              </li>
              <li>
                <strong>Review your summary metrics:</strong> View the five-number summary (minimum, Q1, median, Q3, maximum), sample mean, total sum, range, and IQR.
              </li>
              <li>
                <strong>Inspect fences and box plot:</strong> Check lower and upper Tukey fences to see whether your sample contains mild or extreme outliers, visualized on the horizontal box plot.
              </li>
              <li>
                <strong>Switch to Tab 2 to compare methods:</strong> Compare the exact mathematical outputs of all four major industry algorithms side by side on your specific dataset.
              </li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2>What the Interquartile Range Tells You</h2>
            <p>
              The interquartile range is the distance between the first quartile (25th percentile) and the third quartile (75th percentile). While the standard range considers only the minimum and maximum values, the IQR focuses exclusively on the central 50% of observations.
            </p>
            <p>
              Because it ignores the lowest 25% and highest 25% of observations, the IQR is resistant to extreme values (outliers) and skewed distributions. In skewed datasets or real-world measurements with measurement noise, the IQR provides a more robust description of data dispersion than either the range or the standard deviation.
            </p>
          </section>

          <section className={styles.section}>
            <h2>How to Find Q1, Q3 and the IQR Step by Step</h2>
            <p>
              To find the IQR manually using the standard Tukey method:
            </p>
            <div className={styles.exampleBox}>
              <div className={styles.exampleTitle}>Worked Example: Even Sample Size (n = 8)</div>
              <p>Consider the dataset: <code>1, 3, 5, 7, 9, 11, 13, 15</code></p>
              <ul>
                <li><strong>Step 1 (Sort):</strong> The numbers are already in order: [1, 3, 5, 7, 9, 11, 13, 15].</li>
                <li><strong>Step 2 (Find Median Q2):</strong> With n = 8, the median is the midpoint of the 4th and 5th values: (7 + 9) ÷ 2 = 8.0.</li>
                <li><strong>Step 3 (Lower Half & Q1):</strong> The lower half consists of [1, 3, 5, 7]. Its median is (3 + 5) ÷ 2 = 4.0. Thus, Q1 = 4.0.</li>
                <li><strong>Step 4 (Upper Half & Q3):</strong> The upper half consists of [9, 11, 13, 15]. Its median is (11 + 13) ÷ 2 = 12.0. Thus, Q3 = 12.0.</li>
                <li><strong>Step 5 (Compute IQR):</strong> IQR = Q3 − Q1 = 12.0 − 4.0 = <strong>8.0</strong>.</li>
              </ul>
            </div>
            <div className={styles.exampleBox}>
              <div className={styles.exampleTitle}>Worked Example: Small Sample (n = 4)</div>
              <p>Consider the dataset: <code>5, 7, 8, 9</code></p>
              <ul>
                <li><strong>Lower Half:</strong> [5, 7] → Q1 = (5 + 7) ÷ 2 = 6.0.</li>
                <li><strong>Upper Half:</strong> [8, 9] → Q3 = (8 + 9) ÷ 2 = 8.5.</li>
                <li><strong>Tukey IQR:</strong> 8.5 − 6.0 = <strong>2.5</strong>.</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Why Calculators Give Different Quartiles</h2>
            <p>
              A frequent source of confusion in statistics homework and data analysis is that different calculators and software packages return different values for Q1, Q3, and IQR on the same sample.
            </p>
            <p>
              In a sample of discrete data points, percentiles rarely land exactly on an existing data index. Statistical systems resolve this using different mathematical conventions:
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.contentTable}>
                <thead>
                  <tr>
                    <th>Method Name</th>
                    <th>Standard Implementation</th>
                    <th>Formula / Rule</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Tukey (Median Excluded)</strong></td>
                    <td>TI-83, TI-84, standard US high school textbooks</td>
                    <td>Splits sorted list at median; excludes median when n is odd; computes medians of halves.</td>
                  </tr>
                  <tr>
                    <td><strong>Tukey (Median Included)</strong></td>
                    <td>Alternative introductory algebra textbooks</td>
                    <td>Includes the median in both the lower and upper halves when n is odd.</td>
                  </tr>
                  <tr>
                    <td><strong>Inclusive Interpolation</strong></td>
                    <td>Microsoft Excel <code>QUARTILE.INC</code>, Google Sheets, R Type 7</td>
                    <td>Continuous linear interpolation using rank position <code>p × (n − 1) + 1</code>.</td>
                  </tr>
                  <tr>
                    <td><strong>Exclusive Interpolation</strong></td>
                    <td>Microsoft Excel <code>QUARTILE.EXC</code>, R Type 6, Minitab</td>
                    <td>Continuous linear interpolation using rank position <code>p × (n + 1)</code>.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              For instance, on the dataset <code>5, 7, 8, 9</code>, Tukey’s method yields an IQR of <strong>2.5</strong>, Excel’s exclusive formula yields <strong>3.25</strong>, and Excel’s inclusive formula yields <strong>1.75</strong>. Our calculator provides a dedicated comparison tab so you can immediately verify the exact convention expected by your teacher, professor, or client.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Finding Outliers with the 1.5 × IQR Rule</h2>
            <p>
              In 1977, statistician John Tukey introduced the 1.5 × IQR rule as an objective criterion for identifying candidate outliers without assuming a normal distribution.
            </p>
            <ul>
              <li><strong>Interquartile Range:</strong> IQR = Q3 − Q1</li>
              <li><strong>Lower Inner Fence:</strong> Q1 − (1.5 × IQR)</li>
              <li><strong>Upper Inner Fence:</strong> Q3 + (1.5 × IQR)</li>
              <li><strong>Lower Outer Fence:</strong> Q1 − (3.0 × IQR)</li>
              <li><strong>Upper Outer Fence:</strong> Q3 + (3.0 × IQR)</li>
            </ul>
            <p>
              Values that fall between the inner and outer fences are classified as <em>mild outliers</em>. Values that lie beyond the outer fences (more than 3 times the IQR away from the quartiles) are classified as <em>extreme outliers</em>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>How to Read a Box Plot</h2>
            <p>
              A box plot (or box-and-whisker plot) provides a visual summary of your dataset’s distribution:
            </p>
            <ul>
              <li><strong>The Central Box:</strong> Spans from Q1 to Q3. The length of the box represents the IQR (the middle 50% of the sample).</li>
              <li><strong>The Median Line:</strong> A line drawn inside the box at the second quartile (50th percentile). If the line is off-center, the data exhibits skewness.</li>
              <li><strong>The Whiskers:</strong> Whiskers extend from each end of the box to the smallest and largest observations that remain within the 1.5 × IQR inner fences. They do not extend to theoretical fence values, but to actual data points.</li>
              <li><strong>Outlier Points:</strong> Any individual observations falling outside the whiskers are rendered as separate circular points.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>IQR vs Range vs Standard Deviation</h2>
            <p>
              Each measure of spread provides distinct diagnostic value depending on data characteristics:
            </p>
            <ul>
              <li>
                <strong>Range (Max − Min):</strong> Simplest to calculate, but sensitive to individual extreme values.
              </li>
              <li>
                <strong>Interquartile Range (Q3 − Q1):</strong> Robust against extreme outliers and skewed distributions. Pair with the median when analyzing non-normal distributions (e.g., house prices, incomes).
              </li>
              <li>
                <strong>Standard Deviation:</strong> Incorporates every data point and measures dispersion relative to the mean. Best suited for symmetric, roughly bell-shaped (normal) distributions.
              </li>
            </ul>
            <p>
              For the standard deviation, variance and standard error of the same data, use the <Link href="/standard-deviation-calculator/">Standard Deviation Calculator</Link>. To compare two groups&apos; means, use the <Link href="/t-test-calculator/">T-Test Calculator</Link>. For ratios, see the <Link href="/ratio-calculator/">Ratio Calculator</Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Working Out the Average (Mean) as Well</h2>
            <p>
              While the median represents the middle observation by rank, the arithmetic average (mean) incorporates the magnitude of every observation in your sample.
            </p>
            <p>
              Comparing the sample mean to the sample median reveals distribution symmetry:
            </p>
            <ul>
              <li><strong>Mean ≈ Median:</strong> consistent with roughly symmetric data.</li>
              <li><strong>Mean &gt; Median:</strong> a hint of right skew (a few high values pulling the mean up).</li>
              <li><strong>Mean &lt; Median:</strong> a hint of left skew (a few low values pulling the mean down).</li>
            </ul>
            <p>
              This is a rough check, not a rule: check the box plot as well.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {faqs.map((faq, i) => (
                <div key={i} className={styles.faqItem}>
                  <div className={styles.faqQuestion}>{faq.q}</div>
                  <div className={styles.faqAnswer}>{faq.a}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <HowWeCalculate slug="iqr-calculator" />

        <JsonLd
          data={buildWebApplicationSchema({
            name: route.title,
            description: route.description,
            path: route.path,
            applicationCategory: 'EducationalApplication',
          })}
        />
        <JsonLd data={buildFaqSchema(faqs)} />
      </div>
    </main>
  );
}
