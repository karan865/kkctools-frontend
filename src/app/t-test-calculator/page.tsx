import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import ToolShell from '@/components/tool/shared/ToolShell';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import TTestCalculator from '@/components/tool/t-test-calculator';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import AdSlot from '@/components/ads/AdSlot';
import { ROUTES } from '@/lib/routes';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.tTestCalculator ?? {
  path: '/t-test-calculator/',
  title: 'T-Test Calculator – One, Two-Sample & Paired',
  description:
    'Free t-test calculator. Paste two groups or enter summary stats to get the t value, degrees of freedom and p-value for one-sample, Welch and paired tests.',
  updated: '2026-11-23',
  type: 'tool' as const,
  indexable: true,
};

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: false,
});

const FAQ_ITEMS = [
  {
    q: 'What is a t-test?',
    a: 'A t-test is an inferential statistical test that assesses whether the difference between sample means is statistically significant or could reasonably be attributed to random sampling variability. Introduced by William Sealy Gosset in 1908 under the pen name "Student", the test relies on the Student-t distribution when population standard deviations are unknown and estimated from sample data.',
  },
  {
    q: 'Which t-test should I use: one-sample, two-sample, or paired?',
    a: 'Use a one-sample t-test when comparing a single group mean against a known constant benchmark (μ₀). Use a paired t-test when observations are matched or come in pairs (such as pre-test and post-test scores from the same subjects). Use an independent two-sample t-test when comparing two completely distinct, unrelated participant or experimental groups.',
  },
  {
    q: 'Why does this calculator default to Welch’s t-test instead of Student’s pooled t-test?',
    a: 'Classical Student’s t-test assumes homogeneity of variance (equal variances across both groups). When the variances differ, and especially when the group sizes differ too, the pooled test’s false-positive rate can drift away from the α you chose. Welch’s test does not assume equal variances and gives almost the same answer as the pooled test when the variances are equal, so this calculator uses Welch by default. Pick the pooled test only if you have a reason to assume equal variances.',
  },
  {
    q: 'What is the correct statistical interpretation of a p-value?',
    a: 'The p-value is the probability of observing a test statistic at least as extreme as the one calculated, assuming that the null hypothesis (H₀) of no true difference is completely true. It is NOT the probability that the null hypothesis itself is true, nor does it measure the magnitude or practical importance of the observed difference.',
  },
  {
    q: 'When should I choose a one-tailed versus a two-tailed hypothesis test?',
    a: 'A two-tailed test evaluates for differences in either direction (x̄₁ ≠ x̄₂) and is the standard scientific default. A one-tailed test (x̄₁ > x̄₂ or x̄₁ < x̄₂) should only be chosen prior to data collection when an effect in the opposing direction is theoretically impossible or completely irrelevant to decision-making.',
  },
  {
    q: 'What are the core mathematical assumptions of a t-test?',
    a: 'The primary assumptions include: (1) Continuous interval or ratio data, (2) Independence of observations (or paired independence for paired designs), (3) Approximate normality of data distributions (or normality of pairwise differences), and (4) Homogeneity of variance (required only for Student’s pooled test, but avoided by using Welch’s t-test).',
  },
  {
    q: 'What is Cohen’s d and Hedges’ g effect size?',
    a: 'While the p-value evaluates statistical significance, effect size quantifies practical magnitude. Cohen’s d measures the standardized difference between means in units of pooled standard deviation. For smaller sample sizes (n < 20), Cohen’s d exhibits a slight upward bias; Hedges’ g multiplies d by a small-sample correction factor to reduce that bias.',
  },
  {
    q: 'How are degrees of freedom (df) calculated in Welch’s t-test?',
    a: 'While Student’s pooled test uses the integer df = n₁ + n₂ − 2, Welch’s t-test computes fractional degrees of freedom using the Welch–Satterthwaite equation based on the variance and sample size of each group. This fractional df adjusts the shape of the t-distribution curve to accurately reflect the true uncertainty of the unequal variance components.',
  },
  {
    q: 'Can I calculate a t-test using only sample size, mean, and standard deviation?',
    a: 'Yes. Because the t-statistic, degrees of freedom, standard error, and p-value depend entirely on the sample sizes (n), arithmetic means (x̄), and sample standard deviations (s), you do not need raw individual records if these summary statistics are already available.',
  },
  {
    q: 'What should I do if my sample size is small or data are non-normal?',
    a: 'When sample sizes exceed 30, the Central Limit Theorem helps ensure that the sampling distribution of the mean is approximately normal even if the underlying data exhibit moderate skewness. For very small sample sizes (n < 15) with heavy skewness or severe outliers, consider non-parametric alternatives such as the Mann–Whitney U test (for two independent groups) or Wilcoxon signed-rank test (for paired data).',
  },
  {
    q: 'How does a t-test differ from a z-test or ANOVA?',
    a: 'A z-test requires known population standard deviation (σ), which is rarely available in real-world research. A t-test uses the sample standard deviation (s) and Student-t distribution. One-Way ANOVA extends this comparison to three or more simultaneous groups without compounding Type I error rates.',
  },
];

export default function TTestCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'T-Test Calculator',
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
            { name: 'T-Test', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>T-Test Calculator: One-Sample, Two-Sample and Paired t-Tests</h1>
          <p className={styles.subtitle}>
            Compute Student-t and Welch&apos;s t-statistics, degrees of freedom, exact p-values, confidence intervals of
            differences, and standardized effect sizes from summary statistics or raw observations.
          </p>

          <div className={styles.bluf}>
            <strong>Bottom Line Up Front (BLUF):</strong> A t-test checks whether two means differ by more than chance.
            Group means of 75 and 70 (SD 10 and 12, 30 each) give Welch&apos;s t = 1.753 with about 56 degrees of freedom:
            a two-sided p-value of 0.085, so the difference is not significant at the 5% level.
          </div>
        </div>

        <ToolShell
          features={[
            'Welch, pooled & paired',
            'Raw data or summary stats',
            'p-value, CI & effect size',
            't-curve chart',
          ]}
        >
          <div className={styles.calculatorWrapper}>
            <TTestCalculator />
          </div>
        </ToolShell>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className={styles.contentSection}>
          <article className={styles.prose}>
            <h2>How to Use the T-Test Calculator</h2>
            <p>
              This statistical calculator allows researchers, analysts, and students to evaluate statistical hypotheses
              across three testing methodologies:
            </p>
            <ol>
              <li>
                <strong>Select your test structure:</strong> Choose <em>Two-Sample</em> for comparing two distinct groups,{' '}
                <em>Paired</em> for matched or repeated-measures samples, or <em>One-Sample</em> to compare a single sample
                against a hypothesized benchmark mean (μ₀).
              </li>
              <li>
                <strong>Choose your input format:</strong> Use <strong>Summary Stats</strong> if you already have the sample
                size (n), sample mean (x̄), and standard deviation (s). Alternatively, toggle to <strong>Raw Data</strong> to
                paste comma-separated or whitespace-separated numbers directly.
              </li>
              <li>
                <strong>Configure hypothesis parameters:</strong> Adjust the significance threshold (α = 0.05 standard,
                0.01, or 0.10) and hypothesis direction (two-tailed non-directional vs. one-tailed directional).
              </li>
              <li>
                <strong>Review the findings:</strong> Analyze the hero statistical verdict, the exact p-value, critical t
                thresholds, confidence intervals, and the visual Student-t distribution curve.
              </li>
            </ol>

            <h2>Which T-Test Should I Use?</h2>
            <p>
              Selecting the appropriate t-test depends on your experimental design and whether observations are linked:
            </p>
            <ul>
              <li>
                <strong>Independent Two-Sample Test:</strong> Participants in Group A are entirely separate individuals from
                participants in Group B (e.g., comparing user retention across two distinct interface designs or test
                scores between two different classrooms).
              </li>
              <li>
                <strong>Paired (Dependent) Test:</strong> Each observation in Group 1 matches an observation in Group 2 (e.g.,
                measuring blood pressure before and after medical treatment on the same patient cohort, or comparing
                twin studies).
              </li>
              <li>
                <strong>One-Sample Test:</strong> You have a single observed sample and want to determine whether its mean
                deviates significantly from a known historical standard, regulatory requirement, or manufacturing
                specification (e.g., testing if machine parts average 100 mm in diameter).
              </li>
            </ul>

            <h2>Two-Sample T-Test: Welch vs. Student&apos;s Pooled</h2>
            <p>
              When comparing two independent sample means, classical statistics provides two distinct approaches:
            </p>

            <div className={styles.formulaBox}>
              Welch&apos;s t = (x̄₁ − x̄₂ − Δ) ÷ √[ (s₁² ÷ n₁) + (s₂² ÷ n₂) ]
              <br />
              df_Welch = [ (s₁²/n₁ + s₂²/n₂)² ] ÷ [ (s₁²/n₁)² ÷ (n₁ − 1) + (s₂²/n₂)² ÷ (n₂ − 1) ]
            </div>

            <p>
              The classical Student&apos;s t-test pools sample variances into a single estimate (s_p²), requiring the strict
              assumption of equal population variances (σ₁² = σ₂²). However, when group sample sizes or variances are
              unequal, Student&apos;s t-test exhibits compromised Type I error control.
            </p>
            <p>
              Methods papers such as Delacre, Lakens &amp; Leys (2017) and Ruxton (2006){' '}
              <strong>recommend Welch&apos;s t-test as the default</strong> for two independent groups. Welch&apos;s test does
              not assume equal variances; when the variances are equal it gives nearly the same result as the pooled test,
              and when they differ it keeps the false-positive rate closer to the α you chose. This calculator uses Welch by default.
            </p>

            <h2>Paired T-Test Methodology</h2>
            <p>
              A paired t-test calculates pairwise differences for each subject: dᵢ = x₁ᵢ − x₂ᵢ. The test evaluates
              whether the mean difference (d̄) differs from the hypothesized difference (under standard null testing, Δ = 0):
            </p>
            <div className={styles.formulaBox}>
              t = (d̄ − Δ) ÷ (s_d ÷ √n), with df = n − 1
            </div>
            <p>
              Because each participant acts as their own control, between-subject variance is mathematically eliminated,
              frequently providing higher statistical power to detect small experimental effects.
            </p>

            <h2>One-Sample T-Test Methodology</h2>
            <p>
              A one-sample t-test evaluates whether the sample average (x̄) differs from an external target or known
              constant benchmark (μ₀):
            </p>
            <div className={styles.formulaBox}>
              t = (x̄ − μ₀) ÷ (s ÷ √n), with df = n − 1
            </div>
            <p>
              For instance, if a sample of 25 precision bolts has an average diameter of 104 mm with a standard deviation of
              10 mm, testing against a specification benchmark of μ₀ = 100 mm yields t = (104 − 100) ÷ (10 ÷ √25) = 2.000
              with df = 24.
            </p>

            <h2>Reading the Results: p-Value, Confidence Interval, and Effect Size</h2>
            <p>
              Proper statistical reporting requires interpreting three complementary metrics:
            </p>
            <ul>
              <li>
                <strong>p-Value:</strong> Indicates the probability of observing data this extreme if no true difference
                existed in the population. If p &lt; α, the difference is statistically significant (we reject the null
                hypothesis H₀). If p ≥ α, we fail to reject H₀. We never &quot;accept the null hypothesis&quot;.
              </li>
              <li>
                <strong>Confidence Interval of the Difference:</strong> Reflects the precision of our estimate. A 95%
                confidence interval indicates that under repeated sampling, 95% of such calculated intervals would cover the
                true population mean difference.
              </li>
              <li>
                <strong>Standardized Effect Size (Cohen&apos;s d &amp; Hedges&apos; g):</strong> Measures magnitude
                independent of sample size: d = (x̄₁ − x̄₂) ÷ s_pooled. Hedges&apos; g applies a sample-size correction factor
                j = 1 − 3 ÷ (4·df − 1) to eliminate small-sample bias.
              </li>
            </ul>

            <h2>Degrees of Freedom (df)</h2>
            <p>
              Degrees of freedom represent the number of independent values or quantities that can vary in an analysis
              without violating given mathematical constraints. In a one-sample or paired t-test, once the sample mean or
              mean difference is fixed, exactly n − 1 observations are free to vary. In Welch&apos;s t-test, the
              Welch–Satterthwaite approximation produces non-integer degrees of freedom that precisely calibrate the tail
              probabilities of the t-distribution curve.
            </p>

            <h2>Assumptions and Practical Considerations</h2>
            <p>
              Before drawing definitive conclusions from a t-test, verify the following experimental conditions:
            </p>
            <ul>
              <li>
                <strong>Continuous Scale:</strong> The dependent variable should be measured on an interval or ratio scale.
              </li>
              <li>
                <strong>Independent Observations:</strong> Data collection must ensure that observations are mutually
                independent within and between groups.
              </li>
              <li>
                <strong>Outlier Sensitivity:</strong> Because the arithmetic mean and sample variance are sensitive to extreme
                values, examine your data for extreme outliers using our{' '}
                <Link href="/iqr-calculator/">IQR Calculator</Link> or{' '}
                <Link href="/standard-deviation-calculator/">Standard Deviation Calculator</Link>.
              </li>
              <li>
                <strong>Testing Proportions:</strong> If you are comparing conversion rates or categorical proportions
                rather than numerical averages, use our{' '}
                <Link href="/ab-test-significance-calculator/">A/B Test Significance Calculator</Link>.
              </li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {FAQ_ITEMS.map((item, idx) => (
                <div key={idx} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{item.q}</h3>
                  <div className={styles.faqAnswer}>
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <HowWeCalculate slug="t-test-calculator" />
        <AdSlot slotId="t-test-calc-ad-bottom" format="horizontal" />
      </div>
    </main>
  );
}
