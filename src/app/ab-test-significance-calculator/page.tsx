import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import AbTestCalculator from '@/components/tool/ab-test-calculator';
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

const route = ROUTES.abTestSignificanceCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const faqs = [
  {
    q: 'What does statistically significant mean in an A/B test?',
    a: 'In an A/B test, statistical significance means the observed difference in conversion rates between variant A and variant B is large enough that it is unlikely to have arisen purely from random sampling variation under the null hypothesis of equal performance. At 95% confidence (α = 0.05), a statistically significant result means p < 0.05.',
  },
  {
    q: 'What is a p-value, and what is it not?',
    a: 'A p-value is the probability of observing a difference at least as large as the one seen in your experiment, assuming the null hypothesis (that there is zero true difference between A and B) is true. It is NOT the probability that variant B is better than A, nor is it the probability that the null hypothesis is true. A p-value of 0.03 means that if A and B were identical, an effect this large would occur 3% of the time purely by chance.',
  },
  {
    q: 'One-sided or two-sided: which should I use?',
    a: 'A two-sided test is the standard default for online experimentation because it detects both positive lifts and unexpected negative drops. A one-sided test assumes from the outset that the variant cannot perform worse than control; while it requires slightly less sample size to achieve significance in the expected direction, it inflates false positive risk if the direction was chosen after inspecting the data.',
  },
  {
    q: 'How many visitors do I need for an A/B test?',
    a: 'Required sample size depends on four mathematical parameters: (1) baseline conversion rate, (2) minimum detectable effect (MDE), (3) significance level α (such as 0.05 for 95% confidence), and (4) statistical power 1 − β (such as 0.80 or 80% power). Use Tab 2 of our calculator to compute the exact visitor count per arm before launching your test.',
  },
  {
    q: 'Can I stop an A/B test as soon as it becomes significant?',
    a: 'No. Stopping an experiment the moment p drops below 0.05 (known as continuous peeking or early stopping) inflates the false positive rate well above the 5% you planned for, and the more often you check, the higher it goes. You must determine your required sample size in advance and run the test until that sample size is reached across complete business cycles (such as full 7-day weeks).',
  },
  {
    q: 'How do I test more than two variants (A/B/C testing)?',
    a: 'When testing multiple treatment arms against a single control, each extra comparison increases the family-wise error rate (the probability of at least one false positive). To correct for this multiplicity, apply a family-wise error correction such as Bonferroni (α ÷ m) or Šidák (1 − (1 − α)^(1/m)), available in Tab 3 of this calculator.',
  },
  {
    q: 'Which confidence level should I use (90%, 95%, or 99%)?',
    a: '95% confidence (significance level α = 0.05) is the most common convention, and it is this calculator’s default. 90% confidence (α = 0.10) requires smaller sample sizes and is sometimes used for rapid exploratory tests with lower business risk. 99% confidence (α = 0.01) is used when implementing a false winner carries substantial capital cost or brand liability.',
  },
  {
    q: 'Why is my test not significant even though variant B looks better?',
    a: 'A variant may show an apparent percentage lift (e.g., +8%), but if your sample size is insufficient, the confidence interval of the difference will still overlap zero. When this happens, random noise cannot be ruled out as the cause of the gap. The test is considered inconclusive or underpowered rather than a confirmed tie.',
  },
  {
    q: 'What is sample ratio mismatch (SRM)?',
    a: 'Sample Ratio Mismatch (SRM) occurs when the observed ratio of visitors between test variants deviates significantly from the planned split (e.g., expecting a 50/50 allocation but getting 52/48 across 50,000 visitors). Evaluated via a Pearson chi-square goodness-of-fit test, SRM indicates assignment bugs, tracking redirect failures, bot filtering biases, or server performance degradation.',
  },
  {
    q: 'Statistical vs practical significance: what is the difference?',
    a: 'Statistical significance tells you whether an observed difference is likely genuine rather than sampling noise. Practical significance assesses whether the absolute magnitude of that difference matters to your business economics. In very large samples (e.g., millions of visitors), a 0.02 percentage point lift may be statistically significant (p < 0.001) yet practically negligible for company revenue.',
  },
  {
    q: 'Frequentist vs Bayesian A/B testing: how do they differ?',
    a: 'This calculator uses frequentist hypothesis testing (z-scores and p-values), which evaluates long-run error rates assuming a fixed true parameter and zero prior assumptions. Bayesian A/B testing incorporates a prior probability distribution and updates it with data to compute the posterior probability that B is better than A, along with expected loss.',
  },
  {
    q: 'What is a z-score in an A/B test?',
    a: 'A z-score measures how many standard errors the difference between two conversion rates lies away from zero. For a two-sided test at 95% confidence, a z-score with an absolute value greater than 1.96 corresponds to a p-value below 0.05, signaling statistical significance.',
  },
];

export default function AbTestSignificanceCalculatorPage() {
  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'Tools', path: '/tools/' },
            { name: 'Math & Finance', path: '/tools/#math' },
            { name: 'A/B Test Significance Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>A/B Test Significance Calculator: Is Your Result Statistically Significant?</h1>
          <p className={styles.subtitle}>
            Enter visitors and conversions for control and variant arms to calculate conversion rates, uplift, two-proportion z-scores, p-values, confidence intervals, sample size requirements, and sample ratio mismatch (SRM).
          </p>

          <div className={styles.bluf}>
            <strong>Bottom Line Up Front (BLUF):</strong> This stat sig calculator runs a two-proportion z-test. For example: Control A converts at 5.0% (500 / 10,000) and Variant B converts at 5.7% (570 / 10,000), representing a +14.0% relative lift with a z-score of 2.20 and a two-sided p-value of 0.028. Because p &lt; 0.05, the result is statistically significant at 95% confidence.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'p-value & confidence interval',
              'Sample-size planner',
              'A/B/C with corrections',
              'Data stays in your browser',
            ]}
          >
            <AbTestCalculator />
          </ToolShell>
        </div>

        <AdSlot slotId="ab-test-calc-ad-mid" format="horizontal" />

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>How to Use the A/B Test Significance Calculator</h2>
            <p>
              This statistical significance calculator operates entirely client-side inside your browser. No visitor counts, business conversions, or proprietary metrics are ever transmitted over the network.
            </p>
            <ul>
              <li>
                <strong>Tab 1 (Test Significance):</strong> Enter your control visitors (nA) and conversions (cA), followed by your variant visitors (nB) and conversions (cB). Select your desired confidence level (90%, 95%, or 99%) and test direction (two-sided default).
              </li>
              <li>
                <strong>Tab 2 (Sample Size &amp; Duration):</strong> Plan an experiment before launch. Enter your baseline conversion rate, target minimum detectable effect (MDE), alpha, and desired statistical power (80% or 90%) to calculate total required visitors and estimated run time in days.
              </li>
              <li>
                <strong>Tab 3 (A/B/C Multi-Arm):</strong> Test multiple variant arms against a single control arm with automatic Bonferroni or Šidák multiplicity corrections to protect your false discovery rate.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How the Two-Proportion Z-Test Works</h2>
            <p>
              When evaluating conversion rates (binomial proportions of visitors who convert), the standard mathematical test is the <strong>two-proportion z-test</strong>.
            </p>
            <p>
              The null hypothesis (H₀) asserts that both designs share the exact same underlying conversion probability: pA = pB. The alternative hypothesis (H₁) asserts that they differ: pA ≠ pB.
            </p>
            <div className={styles.exampleBox}>
              <div className={styles.exampleTitle}>Mathematical Step-by-Step Breakdown</div>
              <ol>
                <li>
                  <strong>Observed Conversion Rates:</strong>
                  <br />
                  pA = cA ÷ nA = 500 ÷ 10,000 = 0.0500 (5.00%)
                  <br />
                  pB = cB ÷ nB = 570 ÷ 10,000 = 0.0570 (5.70%)
                </li>
                <li>
                  <strong>Relative Lift:</strong>
                  <br />
                  Lift = (pB − pA) ÷ pA × 100% = (0.057 − 0.050) ÷ 0.050 × 100% = <strong>+14.0%</strong>
                </li>
                <li>
                  <strong>Pooled Conversion Rate (p̄):</strong>
                  <br />
                  p̄ = (cA + cB) ÷ (nA + nB) = (500 + 570) ÷ 20,000 = 0.0535
                </li>
                <li>
                  <strong>Pooled Standard Error (SE_pool):</strong>
                  <br />
                  SE = sqrt[p̄(1 − p̄) × (1/nA + 1/nB)] = sqrt[0.0535 × 0.9465 × (2 / 10,000)] ≈ 0.00318
                </li>
                <li>
                  <strong>Test Statistic (Z-Score):</strong>
                  <br />
                  z = (pB − pA) ÷ SE = (0.0570 − 0.0500) ÷ 0.00318 ≈ <strong>2.20</strong>
                </li>
                <li>
                  <strong>Two-Sided P-Value:</strong>
                  <br />
                  p = 2 × [1 − Φ(|2.20|)] ≈ <strong>0.028</strong>
                </li>
              </ol>
            </div>
            <p>
              Because the resulting p-value (0.028) is less than the significance threshold α = 0.05, we reject the null hypothesis and conclude that Variant B demonstrates a statistically significant uplift at 95% confidence.
            </p>
          </section>

          <section className={styles.section}>
            <h2>What the P-Value and Confidence Level Really Mean</h2>
            <p>
              Statistical terminology in digital experimentation is widely misunderstood. Results are often summarized with inaccurate phrasing such as &ldquo;there is a 95% chance B is better than A.&rdquo;
            </p>
            <p>
              In frequentist statistics, hypotheses do not have probabilities. The correct scientific definitions are:
            </p>
            <ul>
              <li>
                <strong>What the p-value is:</strong> The exact probability of observing a difference at least as large as the one seen in your sample, given that the null hypothesis is true (there is zero genuine difference between A and B).
              </li>
              <li>
                <strong>What the p-value is NOT:</strong> It is not the probability that the variant is superior, not the probability that your experiment was a fluke, and not the magnitude of business impact.
              </li>
              <li>
                <strong>Confidence Level (1 − α):</strong> The long-run proportion of repeated experiments that will correctly avoid making a false positive (Type I error) when no true difference exists.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>One-Sided vs Two-Sided Tests: Why We Default to Two-Sided</h2>
            <p>
              A two-sided hypothesis test evaluates whether Variant B is <em>different</em> from Control A (either significantly better or significantly worse). A one-sided hypothesis test evaluates only whether Variant B is strictly better.
            </p>
            <p>
              While a one-sided test produces a smaller p-value for a positive difference (cutting the two-sided p-value in half), it introduces substantial risks in production environments:
            </p>
            <ul>
              <li>
                <strong>Risk of missing detrimental changes:</strong> If a redesigned checkout flow inadvertently breaks on specific browsers, a two-sided test flags the statistically significant loss, whereas a one-sided test dismisses negative outcomes as non-significant.
              </li>
              <li>
                <strong>Confirmation bias:</strong> Deciding to run a one-sided test after observing an initial upward trend in the data doubles your false positive rate, violating core statistical assumptions.
              </li>
            </ul>
            <p>
              For these reasons, experimentation leaders at Microsoft, Google, and academic institutions mandate two-sided hypothesis tests as the scientific default.
            </p>
          </section>

          <section className={styles.section}>
            <h2>How Many Visitors Do You Need? (Sample Size &amp; Duration)</h2>
            <p>
              Running an underpowered test is one of the most common mistakes in conversion rate optimization. If your sample size is too small, your experiment will lack the statistical power (1 − β) required to detect real lifts.
            </p>
            <p>
              Our sample size calculator implements the unpooled Fleiss formula:
            </p>
            <div className={styles.exampleBox}>
              <div className={styles.exampleTitle}>Sample Size Worked Example</div>
              <p>
                Suppose your baseline conversion rate is <strong>5.0%</strong> (p₁ = 0.05) and you want to detect a <strong>10% relative lift</strong> (reaching p₂ = 0.055, an absolute lift of 0.5 percentage points) with 80% statistical power (β = 0.20) and 95% confidence (α = 0.05, two-sided):
              </p>
              <ul>
                <li>p̄ = (0.05 + 0.055) ÷ 2 = 0.0525</li>
                <li>z_crit (two-sided α = 0.05) = 1.95996 and z_power (80% power) = 0.84162</li>
                <li>Required sample size = <strong>31,234 visitors per arm</strong> (62,468 total visitors).</li>
                <li>At 2,000 visitors per day, this test requires approximately <strong>32 days</strong> of runtime.</li>
              </ul>
            </div>
            <p>
              To compare two groups’ means (for example, average order value) rather than conversion rates, use the <Link href="/t-test-calculator/">T-Test Calculator</Link>. For a plain before-and-after change, use the <Link href="/percentage-change-calculator/">Percentage Change Calculator</Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Testing More Than Two Variants: A/B/C Multiplicity Corrections</h2>
            <p>
              When comparing multiple variants (A vs B, A vs C, A vs D) simultaneously, the probability of at least one false positive increases rapidly:
            </p>
            <p style={{ textAlign: 'center', fontWeight: 600 }}>
              Family-Wise Error Rate (FWER) = 1 − (1 − α)^m
            </p>
            <p>
              With 3 variants tested against control (m = 3) at α = 0.05, your cumulative false positive risk jumps from 5% to approximately 14.3%.
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.contentTable}>
                <thead>
                  <tr>
                    <th>Correction Method</th>
                    <th>Adjusted Alpha (α_adj)</th>
                    <th>Characteristics</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Bonferroni</strong></td>
                    <td>α ÷ m</td>
                    <td>Conservative and universally accepted; strictly bounds family-wise error.</td>
                  </tr>
                  <tr>
                    <td><strong>Šidák</strong></td>
                    <td>1 − (1 − α)^(1/m)</td>
                    <td>Slightly more statistical power than Bonferroni under independent comparisons.</td>
                  </tr>
                  <tr>
                    <td><strong>None (Unadjusted)</strong></td>
                    <td>α</td>
                    <td>Inflates false discovery rate; should only be used in non-critical exploratory screens.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Sample Ratio Mismatch (SRM): Why It Invalidates Tests</h2>
            <p>
              A <strong>Sample Ratio Mismatch (SRM)</strong> occurs when the observed traffic split differs significantly from the configured assignment ratio (e.g., 50/50).
            </p>
            <p>
              SRM is assessed using a Pearson chi-square goodness-of-fit test:
            </p>
            <p style={{ textAlign: 'center', fontWeight: 600 }}>
              χ² = Σ [ (O_i − E_i)² ÷ E_i ] with degrees of freedom df = 1
            </p>
            <p>
              If the resulting p-value falls below 0.001, an SRM is confirmed. Common root causes include:
            </p>
            <ul>
              <li><strong>Redirect latency:</strong> Slower load times on variant URLs causing visitors to bounce before tracking scripts execute.</li>
              <li><strong>Bot filtering discrepancies:</strong> Automated crawlers interacting disproportionately with one variation.</li>
              <li><strong>Browser extension blocking:</strong> Ad-blockers suppressing experimental JavaScript on specific paths.</li>
            </ul>
            <p>
              An experiment with a confirmed SRM cannot be trusted, regardless of how high the observed uplift appears.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Common A/B Testing Pitfalls to Avoid</h2>
            <p>
              Even mathematically sound calculators cannot rescue poorly executed experiments. Watch out for these four common procedural errors:
            </p>
            <ol>
              <li>
                <strong>Continuous Peeking:</strong> Checking test results daily and stopping the moment p &lt; 0.05 creates severe selection bias. Always wait until pre-planned sample sizes are achieved.
              </li>
              <li>
                <strong>Ignoring Seasonality:</strong> If your traffic changes between weekdays and weekends, run whole weeks (7, 14 or 21 days) so each day of the week is counted equally.
              </li>
              <li>
                <strong>Novelty Effects:</strong> Existing users may temporarily click new UI elements purely because they look unfamiliar. Allow tests sufficient runtime for initial curiosity to normalize.
              </li>
              <li>
                <strong>Conflating Statistical and Practical Significance:</strong> A 0.05% lift that achieves p = 0.01 across 5 million visitors may not generate enough profit to justify ongoing code maintenance costs.
              </li>
            </ol>
            <p>
              To describe the spread of a metric, try the <Link href="/standard-deviation-calculator/">Standard Deviation Calculator</Link> or the <Link href="/iqr-calculator/">IQR Calculator</Link>. To see what a lift is worth, use the <Link href="/profit-margin-calculator/">Profit Margin Calculator</Link>.
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
        </article>

        <HowWeCalculate slug="ab-test-significance-calculator" />

        <JsonLd
          data={buildWebApplicationSchema({
            name: route.title,
            description: route.description,
            path: route.path,
            applicationCategory: 'BusinessApplication',
          })}
        />
        <JsonLd data={buildFaqSchema(faqs)} />
      </div>
    </main>
  );
}
