import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import ToolShell from '@/components/tool/shared/ToolShell';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import StandardDeviationCalculator from '@/components/tool/standard-deviation-calculator';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import AdSlot from '@/components/ads/AdSlot';
import { ROUTES } from '@/lib/routes';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.standardDeviationCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const FAQ_ITEMS = [
  {
    q: 'What is standard deviation, and what does it measure?',
    a: 'Standard deviation is a fundamental statistical metric that quantifies the dispersion or spread of data points around their arithmetic mean. A low standard deviation indicates that values cluster tightly near the mean, while a high standard deviation reveals greater dispersion and variability across the dataset.',
  },
  {
    q: 'What is the difference between sample and population standard deviation?',
    a: 'Population standard deviation (σ) is used when you possess the complete dataset for an entire group, dividing the sum of squared deviations by N. Sample standard deviation (s) applies when your data is a random subset of a larger population, dividing by n − 1 (Bessel’s correction). That makes the sample variance an unbiased estimate of the population variance; the sample SD is still very slightly low on average.',
  },
  {
    q: 'What is Bessel’s correction, and why do we divide by n − 1?',
    a: 'When estimating population variance from a sample, the sample mean naturally sits closer to sample observations than the true population mean does. Dividing by n would systematically underestimate variance. Dividing by n − 1 (the degrees of freedom) expands the calculated variance slightly, correcting this negative bias.',
  },
  {
    q: 'What is variance, and how does it relate to standard deviation?',
    a: 'Variance is the average of squared deviations from the mean (s² or σ²). Standard deviation is simply the positive square root of variance: s = √s². While variance measures dispersion in squared units (e.g., dollars squared), standard deviation restores the measurement to the original unit (e.g., dollars), making it directly interpretable.',
  },
  {
    q: 'What is standard error of the mean (SE)?',
    a: 'Standard error of the mean (SE = s ÷ √n) measures the precision of the sample mean as an estimate of the true population mean. It reflects how much the sample mean would vary if you repeatedly drew new random samples of size n from the population.',
  },
  {
    q: 'What is the empirical rule (68-95-99.7 rule)?',
    a: 'For data that follows an approximately bell-shaped normal distribution, approximately 68.27% of observations fall within one standard deviation of the mean (μ ± 1σ), approximately 95.45% fall within two standard deviations (μ ± 2σ), and approximately 99.73% fall within three standard deviations (μ ± 3σ).',
  },
  {
    q: 'What is a z-score, and how is it calculated?',
    a: 'A z-score (standard score) indicates how many standard deviations an individual observation lies above or below the mean: z = (x − x̄) ÷ s. A z-score of 0 is exactly at the mean, +2.0 indicates two standard deviations above the mean, and −1.5 indicates 1.5 standard deviations below the mean.',
  },
  {
    q: 'Can standard deviation ever be negative or zero?',
    a: 'Standard deviation can never be negative because squared deviations and square roots are non-negative in real numbers. Standard deviation is zero if and only if all numbers in the dataset are completely identical (e.g., 7, 7, 7, 7), representing zero dispersion.',
  },
  {
    q: 'What is the coefficient of variation (CV)?',
    a: 'The coefficient of variation (CV = (s ÷ x̄) × 100%) expresses standard deviation as a percentage of the mean. It allows researchers to compare relative variability between datasets with vastly different scales or measurement units.',
  },
  {
    q: 'How do standard deviation and interquartile range (IQR) compare?',
    a: 'Standard deviation incorporates every data value and is sensitive to extreme outliers. The interquartile range (IQR = Q3 − Q1) measures the middle 50% of sorted data and is highly robust against outliers. For skewed distributions, IQR and median often summarize spread better than standard deviation and mean.',
  },
];

export default function StandardDeviationPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Standard Deviation Calculator',
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
            { name: 'Standard Deviation', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>Standard Deviation Calculator: Variance, Standard Error, Mean and Median</h1>
          <p className={styles.subtitle}>
            Paste your data to get sample and population standard deviation, variance, standard error, mean, median and mode.
          </p>

          <div className={styles.bluf}>
            <strong>Bottom Line Up Front (BLUF):</strong> This stdev calculator shows how spread out your numbers are. For 2, 4, 4, 4, 5, 5, 7, 9 the mean is 5 and the population standard deviation is 2; treated as a sample it is 2.138, because the sample formula divides by n − 1 instead of n.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Sample & population SD',
              'Variance, SE, mean, median, mode',
              'Step-by-step table',
              'Frequency & grouped data',
            ]}
          >
            <StandardDeviationCalculator />
          </ToolShell>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className={styles.contentSection}>
          <div className={styles.prose}>
            <h2>Standard Deviation and Variance Formulas</h2>
            <p>
              Standard deviation is the most widely applied measure of variability in statistical analysis. It quantifies how much individual data points deviate from the arithmetic mean.
            </p>

            <div className={styles.formulaBox}>
              Sample Standard Deviation (s) = √[ Σ(x_i − x̄)² ÷ (n − 1) ]
              <br />
              Population Standard Deviation (σ) = √[ Σ(x_i − μ)² ÷ N ]
            </div>

            <p>Where:</p>
            <ul>
              <li><strong>x_i:</strong> Each individual observation or data point.</li>
              <li><strong>x̄ (or μ):</strong> The arithmetic mean of the sample (x̄) or population (μ).</li>
              <li><strong>n (or N):</strong> The total number of observations in the sample (n) or population (N).</li>
              <li><strong>Σ(x_i − x̄)²:</strong> The sum of squared deviations from the mean (Sum of Squares, SS).</li>
            </ul>

            <h2>How to Use the Standard Deviation Calculator</h2>
            <p>
              This calculator accepts numeric data in three convenient input formats:
            </p>
            <ol>
              <li><strong>Raw Data List:</strong> Enter or paste numbers separated by commas, spaces, tabs, or newlines (e.g. <code>2, 4, 4, 4, 5, 5, 7, 9</code>). You can switch between Sample (n − 1) and Population (n) scopes.</li>
              <li><strong>Frequency Table:</strong> Enter value:count pairs (such as <code>85:14, 90:18</code>) to evaluate weighted frequency distributions without entering repeating digits manually.</li>
              <li><strong>Grouped Classes:</strong> Enter continuous class interval ranges and frequencies (e.g., <code>10-20: 5</code>). The engine uses class midpoints to compute estimated standard deviation.</li>
            </ol>

            <AdSlot slotId="stdev-calc-ad-mid" format="horizontal" />

            <h2>Sample vs Population Standard Deviation (Bessel&apos;s Correction)</h2>
            <p>
              The choice between sample and population formulas depends strictly on your data collection scope:
            </p>
            <ul>
              <li><strong>Use Population (σ):</strong> When you have recorded measurements for every single member of the entire group of interest (e.g., test scores of all 24 students in a specific classroom, or all 50 states in the US). Here, N is the true population size.</li>
              <li><strong>Use Sample (s):</strong> When your data represents a random or representative sample drawn from a larger target population (e.g., polling 1,000 voters to infer the sentiment of 50 million citizens). The formula divides by <code>n − 1</code> rather than <code>n</code>.</li>
            </ul>
            <p>
              Dividing by <code>n − 1</code> is known as <strong>Bessel&apos;s correction</strong>. Because sample data tends to cluster closer to its own sample mean than to the unknown true population mean, dividing by n results in a systematically underestimated variance. Bessel&apos;s correction provides an unbiased estimator.
            </p>

            <h2>Standard Deviation Calculation Step by Step</h2>
            <p>
              Consider our default dataset: <code>2, 4, 4, 4, 5, 5, 7, 9</code> (8 values).
            </p>
            <ol>
              <li><strong>Calculate the Mean (x̄):</strong><br />
                Sum = 2 + 4 + 4 + 4 + 5 + 5 + 7 + 9 = 40.<br />
                Mean = 40 ÷ 8 = <strong>5.000</strong>.
              </li>
              <li><strong>Calculate Deviations from the Mean (x_i − x̄):</strong><br />
                (2 − 5 = −3), (4 − 5 = −1), (4 − 5 = −1), (4 − 5 = −1), (5 − 5 = 0), (5 − 5 = 0), (7 − 5 = +2), (9 − 5 = +4).
              </li>
              <li><strong>Square Each Deviation:</strong><br />
                (−3)² = 9, (−1)² = 1, (−1)² = 1, (−1)² = 1, (0)² = 0, (0)² = 0, (+2)² = 4, (+4)² = 16.
              </li>
              <li><strong>Sum the Squared Deviations (Sum of Squares, SS):</strong><br />
                SS = 9 + 1 + 1 + 1 + 0 + 0 + 4 + 16 = <strong>32.000</strong>.
              </li>
              <li><strong>Divide by Degrees of Freedom:</strong><br />
                For Sample Variance (s²): 32 ÷ (8 − 1) = 32 ÷ 7 = <strong>4.571</strong>.<br />
                For Population Variance (σ²): 32 ÷ 8 = <strong>4.000</strong>.
              </li>
              <li><strong>Take the Square Root:</strong><br />
                Sample SD (s) = √4.571 = <strong>2.138</strong>.<br />
                Population SD (σ) = √4.000 = <strong>2.000</strong>.
              </li>
            </ol>

            <h2>Standard Error of the Mean (SE)</h2>
            <p>
              While standard deviation measures the dispersion of individual data points, the <strong>standard error of the mean (SE)</strong> measures the precision of the estimated mean itself:
            </p>
            <div className={styles.formulaBox}>
              SE = s ÷ √n
            </div>
            <p>
              For our dataset with s = 2.138 and n = 8: <code>SE = 2.138 ÷ √8 = 2.138 ÷ 2.8284 = 0.756</code>. As sample size grows larger, standard error decreases in proportion to √n, reflecting greater confidence in the sample mean.
            </p>

            <h2>Mean, Median, and Mode: Central Tendency vs Dispersion</h2>
            <p>
              A complete data overview pairs measures of dispersion (standard deviation, variance, IQR) with measures of central tendency:
            </p>
            <ul>
              <li><strong>Mean:</strong> The arithmetic balance point (5.000).</li>
              <li><strong>Median:</strong> The middle value of sorted numbers (4.500).</li>
              <li><strong>Mode:</strong> The most frequently occurring value (4, appearing 3 times).</li>
            </ul>

            <h2>The Empirical Rule (68-95-99.7) and z-Scores</h2>
            <p>
              For data that follows a normal (bell-shaped) distribution, about 68%, 95% and 99.7% of values fall within 1, 2 and 3 standard deviations of the mean. With only 8 values the example data is too small to check for normality, so the ranges below show only how the rule is applied (using the sample SD):
            </p>
            <ul>
              <li><strong>About 68%</strong> within 1 standard deviation: <code>5.000 ± 2.138 = [2.862, 7.138]</code>.</li>
              <li><strong>About 95%</strong> within 2 standard deviations: <code>5.000 ± 4.276 = [0.724, 9.276]</code>.</li>
              <li><strong>About 99.7%</strong> within 3 standard deviations: <code>5.000 ± 6.414 = [−1.414, 11.414]</code>.</li>
            </ul>
            <p>
              An observation with a z-score greater than +3.0 or less than −3.0 is commonly flagged as an extreme statistical outlier.
            </p>

            <h2>Coefficient of Variation (Relative Dispersion)</h2>
            <p>
              The <strong>coefficient of variation (CV)</strong> standardizes variability relative to the magnitude of the mean:
            </p>
            <div className={styles.formulaBox}>
              CV = (s ÷ x̄) × 100%
            </div>
            <p>
              For our example: <code>(2.138 ÷ 5.000) × 100% = 42.76%</code>. CV is particularly useful when comparing the volatility of assets priced in different currencies or across different orders of magnitude.
            </p>

            <p>
              For non-parametric outlier analysis, explore our <Link href="/iqr-calculator/">IQR Calculator</Link>. For comparing two sample means, see our <Link href="/t-test-calculator/">T-Test Calculator</Link>, or check statistical significance for conversion rates with our <Link href="/ab-test-significance-calculator/">A/B Test Significance Calculator</Link>.
            </p>

            <h2>Frequently Asked Questions</h2>
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className={styles.faqItem}>
                <div className={styles.faqQuestion}>{item.q}</div>
                <div className={styles.faqAnswer}>
                  <p>{item.a}</p>
                </div>
              </div>
            ))}

            <HowWeCalculate slug="standard-deviation-calculator" />
            <AdSlot slotId="stdev-calc-ad-bottom" format="horizontal" />
          </div>
        </div>
      </div>
    </main>
  );
}
