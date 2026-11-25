import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import Link from 'next/link';
import ToolShell from '@/components/tool/shared/ToolShell';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import BinomialCalculator from '@/components/tool/binomial-calculator';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import AdSlot from '@/components/ads/AdSlot';
import { ROUTES } from '@/lib/routes';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.binomialProbabilityCalculator ?? {
  path: '/binomial-probability-calculator/',
  title: 'Binomial Probability Calculator – P(X = k)',
  description:
    'Free binomial probability calculator. Enter trials, successes and probability to get P(X = k), P(X ≤ k) and P(X ≥ k), with the mean, variance and a chart.',
};

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const FAQ_ITEMS = [
  {
    q: 'What is a binomial distribution, and when does it apply?',
    a: 'A binomial distribution models the number of successes in a sequence of n independent trials where each trial has exactly two complementary outcomes (commonly labelled success and failure) and a constant probability of success p throughout all trials. Real-world applications include quality inspection testing, A/B testing conversions, survey responses, and genetics.',
  },
  {
    q: 'What is the binomial probability formula?',
    a: 'The probability of observing exactly k successes in n trials is computed by P(X = k) = C(n, k) × pᵏ × (1 − p)ⁿ⁻ᵏ, where C(n, k) = n! ÷ (k!(n − k)!) represents the binomial coefficient (combinations of n items taken k at a time).',
  },
  {
    q: 'Exactly vs at most vs at least: what is the difference?',
    a: '“Exactly k” (P(X = k)) evaluates only the single outcome k. “At most k” (P(X ≤ k)) is the cumulative probability summing outcomes from 0 up to k. “At least k” (P(X ≥ k)) sums all outcomes from k through n, equivalent to 1 − P(X ≤ k − 1).',
  },
  {
    q: 'What are the mean and variance of a binomial distribution?',
    a: 'The expected value (mean) is μ = n × p. The variance is σ² = n × p × (1 − p), and the standard deviation is σ = √(n × p × (1 − p)). The distribution mode occurs at ⌊(n + 1)p⌋.',
  },
  {
    q: 'When can I use the normal approximation?',
    a: 'The normal distribution closely approximates the binomial distribution when both np ≥ 10 and n(1 − p) ≥ 10 (a common rule of thumb; some textbooks use 5). To account for transitioning from discrete integers to a continuous curve, apply continuity correction by adding or subtracting 0.5: P(X ≤ k) ≈ Φ((k + 0.5 − np) ÷ σ).',
  },
  {
    q: 'How do I calculate "at least one success"?',
    a: 'The simplest method uses the complement rule: the complement of “at least one success” is “zero successes”. Because P(X = 0) = (1 − p)ⁿ, the probability of at least one success is P(X ≥ 1) = 1 − (1 − p)ⁿ.',
  },
  {
    q: 'How many trials do I need for a target probability?',
    a: 'To guarantee at least a target probability P of seeing at least one success with success probability p, solve 1 − (1 − p)ⁿ ≥ P, yielding n = ⌈ln(1 − P) ÷ ln(1 − p)⌉. For example, ensuring a 99.99% chance of observing an event with p = 0.01 (1%) requires ⌈ln(0.0001) ÷ ln(0.99)⌉ = 917 trials.',
  },
  {
    q: 'What makes a problem not binomial?',
    a: 'A problem violates binomial assumptions if trials are dependent (e.g., sampling without replacement from a finite batch, which requires the hypergeometric distribution), if probabilities shift between trials, or if outcomes exceed two categories (which requires the multinomial distribution).',
  },
  {
    q: 'What is a cumulative binomial probability?',
    a: 'A cumulative binomial probability is the total probability that the number of successes falls within a given range, such as less than or equal to k (the cumulative distribution function, or CDF). It equals the sum of the individual probability mass function (PMF) terms from 0 to k.',
  },
  {
    q: 'Binomial vs Poisson vs normal: which should I use?',
    a: 'Use binomial when you have a fixed number of trials n with binary outcomes. Use Poisson when events occur continuously over a fixed interval of time or space with a known rate λ and no fixed maximum n (or when n is large and p is very small). Use normal when n is large and you need a continuous approximation with continuity correction.',
  },
];

export default function BinomialProbabilityPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Binomial Probability Calculator',
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
            { name: 'Binomial Probability', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>Binomial Probability Calculator: Exactly, At Most and At Least k</h1>
          <p className={styles.subtitle}>
            Calculate binomial probability mass function P(X = k), cumulative P(X ≤ k) and tail P(X ≥ k), with distribution moments, normal approximation and trials needed.
          </p>

          <div className={styles.bluf}>
            This binomial probability distribution calculator uses P(X = k) = C(n, k) × pᵏ × (1 − p)ⁿ⁻ᵏ. For 10 fair coin flips, the chance of exactly 3 heads is 0.1172, and of 3 or fewer is 0.1719.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Exactly, at most, at least & between',
              'Distribution chart',
              'Steps with your numbers',
              'Trials needed',
            ]}
          >
            <BinomialCalculator />
          </ToolShell>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className={styles.contentSection}>
          <div className={styles.prose}>
            <h2>How to Use the Binomial Probability Distribution Calculator</h2>
            <p>
              This calculator provides three comprehensive modes to solve discrete probability problems:
            </p>
            <ol>
              <li>
                <strong>Probability Tab:</strong> Enter the number of trials (n), probability of success (p as a decimal or percentage), and the target successes (k). Choose your comparison condition: exactly (=), at most (≤), at least (≥), strictly less than (&lt;), strictly greater than (&gt;), or between two values [k₁, k₂].
              </li>
              <li>
                <strong>Trials Needed / Inverse Tab:</strong> Calculate how many independent trials you must conduct to achieve at least one success with a target certainty (such as 99% or 99.99%), or determine the minimum successes required for a cumulative threshold.
              </li>
              <li>
                <strong>Normal Approximation Tab:</strong> Evaluate whether your experiment satisfies the formal criteria (np ≥ 10 and n(1 − p) ≥ 10) to approximate binomial probabilities using the continuous Gaussian bell curve with continuity correction.
              </li>
            </ol>

            <h2>When Is a Problem Binomial? (The 4 Assumptions)</h2>
            <p>
              A statistical experiment qualifies as a binomial experiment if and only if it satisfies four conditions:
            </p>
            <ul>
              <li>
                <strong>1. Fixed Number of Trials (n):</strong> The experiment consists of a predetermined, finite number of identical trials.
              </li>
              <li>
                <strong>2. Two Mutually Exclusive Outcomes:</strong> Every trial results in one of exactly two possibilities, classified conventionally as &ldquo;success&rdquo; or &ldquo;failure&rdquo;.
              </li>
              <li>
                <strong>3. Constant Probability of Success (p):</strong> The probability p remains strictly identical on each trial; the probability of failure is always 1 − p (often denoted q).
              </li>
              <li>
                <strong>4. Independent Trials:</strong> The outcome of any single trial has zero influence on the outcome of any other trial.
              </li>
            </ul>

            <h2>The Binomial Probability Formula</h2>
            <p>
              The probability of observing exactly k successes in n independent trials is defined by:
            </p>
            <div className={styles.formulaBox}>
              P(X = k) = C(n, k) × pᵏ × (1 − p)ⁿ⁻ᵏ
            </div>
            <p>
              Where the binomial coefficient C(n, k) represents the number of ways to choose k successes out of n trials:
            </p>
            <div className={styles.formulaBox}>
              C(n, k) = n! ÷ (k! × (n − k)!)
            </div>
            <p>
              <strong>Worked Example:</strong> Consider flipping a fair coin 10 times (n = 10, p = 0.5). What is the probability of obtaining exactly 3 heads (k = 3)?
            </p>
            <ul>
              <li>C(10, 3) = 10! ÷ (3! × 7!) = (10 × 9 × 8) ÷ (3 × 2 × 1) = 120</li>
              <li>p³ = 0.5³ = 0.125</li>
              <li>(1 − p)¹⁰⁻³ = 0.5⁷ = 0.0078125</li>
              <li>P(X = 3) = 120 × 0.125 × 0.0078125 = 0.1171875 (≈ <strong>0.1172</strong> or 11.72%)</li>
            </ul>

            <h2>Exactly, At Most, At Least and Between</h2>
            <p>
              Practical experiments rarely ask solely for an exact count. Instead, decision-makers evaluate risk boundaries:
            </p>
            <ul>
              <li>
                <strong>Exactly k:</strong> P(X = k). The chance of hitting that precise count.
              </li>
              <li>
                <strong>At Most k (Cumulative CDF):</strong> P(X ≤ k) = P(X = 0) + P(X = 1) + ... + P(X = k). For 10 fair flips, the chance of 3 or fewer heads is 0.000977 + 0.009766 + 0.043945 + 0.117188 = <strong>0.1719</strong> (17.19%).
              </li>
              <li>
                <strong>At Least k (Tail Probability):</strong> P(X ≥ k) = 1 − P(X ≤ k − 1). For 10 fair flips, the chance of at least 3 heads is 1 − P(X ≤ 2) = 1 − 0.054688 = <strong>0.9453</strong> (94.53%).
              </li>
              <li>
                <strong>Between k₁ and k₂:</strong> P(k₁ ≤ X ≤ k₂) = P(X ≤ k₂) − P(X ≤ k₁ − 1).
              </li>
            </ul>

            <h2>Mean, Variance and Shape of the Binomial Distribution</h2>
            <p>
              The binomial distribution&apos;s shape depends entirely on n and p:
            </p>
            <div className={styles.formulaBox}>
              Mean (Expected Value): μ = n × p<br />
              Variance: σ² = n × p × (1 − p)<br />
              Standard Deviation: σ = √(n × p × (1 − p))<br />
              Mode: ⌊(n + 1) × p⌋<br />
              Skewness: γ₁ = (1 − 2p) ÷ √(n × p × (1 − p))
            </div>
            <p>
              When p = 0.5, skewness is 0, making the distribution perfectly symmetric. When p &lt; 0.5, the distribution is positively skewed (right-tailed). When p &gt; 0.5, it is negatively skewed (left-tailed).
            </p>

            <h2>Normal Approximation and Continuity Correction</h2>
            <p>
              When sample size n is large, computing exact factorials becomes computationally intensive. According to the De Moivre–Laplace theorem, the binomial distribution approaches a continuous normal distribution with mean μ = np and standard deviation σ = √(np(1 − p)).
            </p>
            <p>
              <strong>Rule of thumb used here:</strong> the approximation is shown when (some textbooks use 5 instead of 10):
            </p>
            <div className={styles.formulaBox}>
              np ≥ 10 &nbsp;and&nbsp; n(1 − p) ≥ 10
            </div>
            <p>
              Because the binomial distribution is discrete (taking only integer values) while the normal distribution is continuous, a <em>continuity correction</em> of ±0.5 must be applied to the boundaries:
            </p>
            <div className={styles.formulaBox}>
              P(X ≤ k) ≈ Φ((k + 0.5 − np) ÷ σ)<br />
              P(X ≥ k) ≈ 1 − Φ((k − 0.5 − np) ÷ σ)<br />
              P(X = k) ≈ Φ((k + 0.5 − np) ÷ σ) − Φ((k − 0.5 − np) ÷ σ)
            </div>

            <h2>&ldquo;At Least One&rdquo; and How Many Trials You Need</h2>
            <p>
              In quality control and reliability engineering, a frequent question is: <em>How many trials do we need to be 99.99% confident that at least one defective item is detected?</em>
            </p>
            <p>
              Using the complement rule, P(at least one success) = 1 − (1 − p)ⁿ. Setting 1 − (1 − p)ⁿ ≥ P and solving for n yields:
            </p>
            <div className={styles.formulaBox}>
              n = ⌈ln(1 − P) ÷ ln(1 − p)⌉
            </div>
            <p>
              <strong>Worked Example:</strong> If an event has a 1% chance per trial (p = 0.01) and we demand 99.99% certainty (P = 0.9999):
            </p>
            <ul>
              <li>1 − P = 0.0001</li>
              <li>1 − p = 0.99</li>
              <li>n = ⌈ln(0.0001) ÷ ln(0.99)⌉ = ⌈(−9.21034) ÷ (−0.01005)⌉ = ⌈916.42⌉ = <strong>917 trials</strong>.</li>
            </ul>

            <h2>Binomial vs Poisson vs Normal Distributions</h2>
            <p>
              Understanding when to choose which distribution prevents modeling errors:
            </p>
            <ul>
              <li>
                <strong>Binomial:</strong> Discrete count of successes in a fixed number of trials n with binary outcomes. Explore our <Link href="/standard-deviation-calculator/">Standard Deviation Calculator</Link> and <Link href="/t-test-calculator/">T-Test Calculator</Link> for parametric testing.
              </li>
              <li>
                <strong>Poisson:</strong> Discrete count of occurrences across a continuous interval of time, length, or area with an average arrival rate λ.
              </li>
              <li>
                <strong>Normal:</strong> Continuous symmetric bell-shaped curve governed by mean μ and standard deviation σ. For testing differences in proportions, refer to our <Link href="/ab-test-significance-calculator/">A/B Test Significance Calculator</Link>.
              </li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {FAQ_ITEMS.map((item, idx) => (
                <div key={idx} className={styles.faqItem}>
                  <div className={styles.faqQuestion}>{item.q}</div>
                  <div className={styles.faqAnswer}>
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <HowWeCalculate slug="binomial-probability-calculator" />
        <AdSlot slotId="binomial-calc-ad-bottom" format="horizontal" />
      </div>
    </main>
  );
}
