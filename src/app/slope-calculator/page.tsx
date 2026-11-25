import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import Link from 'next/link';
import ToolShell from '@/components/tool/shared/ToolShell';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import SlopeCalculator from '@/components/tool/slope-calculator';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import AdSlot from '@/components/ads/AdSlot';
import { ROUTES } from '@/lib/routes';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.slopeCalculator ?? {
  path: '/slope-calculator/',
  title: 'Slope Calculator – Rise over Run, Percent & Angle',
  description:
    'Free slope calculator. Enter rise and run to get slope as a percent, ratio (1:12), angle and pitch, or find the rise for a ramp, drain or roof.',
};

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const FAQ_ITEMS = [
  {
    q: 'What is rise over run, and how do you find slope?',
    a: 'Rise over run is the foundational mathematical definition of slope (m = rise ÷ run). The “rise” measures the vertical elevation change (up or down), while the “run” measures the horizontal distance traveled. For example, a vertical climb of 1 foot over a 12-foot horizontal span gives a slope of 1 ÷ 12 ≈ 0.0833.',
  },
  {
    q: 'How do you convert slope to a percentage?',
    a: 'To convert slope to a percentage grade, divide the vertical rise by the horizontal run and multiply by 100: Percent Slope = (Rise ÷ Run) × 100%. A slope of 1 ÷ 12 equals 8.33% grade.',
  },
  {
    q: 'Is a 10% slope the same as 10°?',
    a: 'No. Slope percentage and angle in degrees use completely different scales. A 10% slope corresponds to an angle of arctan(0.10) ≈ 5.71°, not 10°. A 100% slope represents an angle of 45° (where rise equals run). An angle of 10° is approximately a 17.63% slope.',
  },
  {
    q: 'What is the maximum slope for a wheelchair ramp?',
    a: 'Under the 2010 ADA Standards for Accessible Design §405.2, the maximum running slope for an accessible ramp is 1:12 (8.33% grade). Furthermore, §405.6 mandates that the maximum vertical rise for any single ramp run shall not exceed 30 inches (760 mm) before requiring a level landing.',
  },
  {
    q: 'How do you find slope from two points or a table?',
    a: 'Given two points (x₁, y₁) and (x₂, y₂), the slope formula is m = (y₂ − y₁) ÷ (x₂ − x₁). For a table of values, pick any two consecutive rows and compute the difference in y divided by the difference in x. If the slope remains constant across all rows, the relationship is linear.',
  },
  {
    q: 'What is the rate of change formula?',
    a: 'The rate of change formula expresses how one quantity changes in relation to another: Rate of Change = Change in Output ÷ Change in Input = Δy ÷ Δx = (y₂ − y₁) ÷ (x₂ − x₁). In linear relationships, rate of change is identical to slope m.',
  },
  {
    q: 'What is the average rate of change formula?',
    a: 'For any continuous function y = f(x) over an interval [a, b], the average rate of change is [f(b) − f(a)] ÷ (b − a). It represents the slope of the secant line connecting the two endpoints on the function’s graph.',
  },
  {
    q: 'How do you convert slope to roof pitch (x/12)?',
    a: 'Roof pitch expresses how many inches of vertical rise occur per 12 inches (1 foot) of horizontal run. Multiply the decimal slope by 12: Pitch = m × 12. For example, a 33.33% grade (m = 0.3333) corresponds to a 4/12 roof pitch.',
  },
  {
    q: 'How much fall does a drain pipe need per foot?',
    a: 'The minimum fall is set by the plumbing code your area has adopted and depends on the pipe size, so check that code or your local inspector. The calculator converts whatever fall you need: 1/4 inch per foot is 0.25 ÷ 12 = 2.08%, and 1/8 inch per foot is 1.04%.',
  },
  {
    q: 'What does 1:12 mean?',
    a: 'A 1:12 ratio means there is 1 unit of vertical rise for every 12 units of horizontal run. For a ramp, it means 1 inch of rise requires 12 inches (1 foot) of horizontal length.',
  },
  {
    q: 'What is a steep driveway grade?',
    a: 'Driveway limits are set locally, so check your city or county rules before you build. To check a driveway, measure the rise and the run and enter them: for example, a 2 ft rise over 20 ft of run is 10%, or 5.71°.',
  },
  {
    q: 'What is a difference quotient?',
    a: 'In calculus, the difference quotient is the algebraic expression [f(x + h) − f(x)] ÷ h. It measures the average rate of change of f(x) over an increment of length h, and its limit as h approaches zero defines the instantaneous rate of change (derivative).',
  },
];

export default function SlopeCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Slope Calculator',
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
            { name: 'Slope Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>Slope Calculator: Rise over Run as Percent, Ratio and Angle</h1>
          <p className={styles.subtitle}>
            Calculate rise over run, percentage grade, angle in degrees, roof pitch (x/12), and inches per foot. Includes ADA ramp planning and two-point coordinate math.
          </p>

          <div className={styles.bluf}>
            Slope = rise ÷ run. A rise of 1 over a run of 12 is 1/12: an 8.33% slope, a 1:12 ratio, an angle of 4.76° or a 1/12 roof pitch. Multiply by 100 for percent; use the arctangent for degrees. A 10% slope is not 10°.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Percent, ratio, angle & pitch',
              'Ramp & drain checks',
              'Feet-inches input',
              'Two-point slope',
            ]}
          >
            <SlopeCalculator />
          </ToolShell>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className={styles.contentSection}>
          <div className={styles.prose}>
            <h2>How to Use the Slope Calculator</h2>
            <p>
              This rise over run calculator accommodates both construction grading and academic mathematics across three dedicated modes:
            </p>
            <ol>
              <li>
                <strong>Rise &amp; Run Mode (Default):</strong> Enter any vertical rise and horizontal run to instantly calculate slope as a percentage grade, ratio (1:N), angle in degrees, roof pitch (x/12), and inches per foot. You can input standard numbers or architectural feet-and-inches (e.g. <code>2&apos; 6&quot;</code>).
              </li>
              <li>
                <strong>Ramp, Drain &amp; Roof Presets:</strong> Plan accessible ramps against the 2010 ADA Standards (1:12 slope and 30-inch maximum run height), convert a drain fall such as 1/4″ per foot into a percent grade, or check roof pitch ratios.
              </li>
              <li>
                <strong>Two Points &amp; Rate of Change:</strong> Input two Cartesian coordinate points (x₁, y₁) and (x₂, y₂) to generate the slope m, y-intercept b, linear equation y = mx + b, Euclidean distance, and average rate of change.
              </li>
            </ol>

            <h2>Rise over Run Explained</h2>
            <p>
              Slope measures the steepness and direction of a line or physical incline. In algebra and building trades alike, slope is formally defined as the ratio of vertical change (rise) to horizontal change (run):
            </p>
            <div className={styles.formulaBox}>
              Slope (m) = Rise ÷ Run = Δy ÷ Δx
            </div>
            <p>
              Where:
            </p>
            <ul>
              <li><strong>Rise:</strong> The vertical difference in elevation between two points (positive for uphill, negative for downhill).</li>
              <li><strong>Run:</strong> The horizontal distance between the same two points.</li>
            </ul>

            <h2>Converting Slope: Percent, Degrees, Ratio and Pitch</h2>
            <p>
              Different industries express slope in different units:
            </p>
            <ul>
              <li><strong>Percentage Grade (%):</strong> m × 100. Used in civil engineering, road signage, and grading.</li>
              <li><strong>Angle in Degrees (°):</strong> arctan(m) × (180 ÷ π). Used in mechanical engineering and geometry.</li>
              <li><strong>Ratio (1:N):</strong> 1 unit of rise per N units of horizontal run (Run ÷ Rise). Standard in ADA ramp specifications.</li>
              <li><strong>Roof Pitch (x/12):</strong> m × 12. Expresses rise in inches per 12 inches (1 foot) of horizontal run.</li>
              <li><strong>Inches per Foot (in/ft):</strong> m × 12. Standard in plumbing drain codes.</li>
            </ul>

            <h2>Percent vs Degrees: A Common Mistake</h2>
            <p>
              A frequent misconception is assuming that a 10% grade equals a 10-degree angle. They are fundamentally different scales:
            </p>
            <div className={styles.formulaBox}>
              10% Grade = arctan(0.10) ≈ 5.71°<br />
              10° Angle = tan(10°) × 100% ≈ 17.63% Grade<br />
              45° Angle = 100% Grade (where rise equals run)
            </div>

            <h2>Ramp Slope and Planning an Accessible Ramp</h2>
            <p>
              For public accommodations and commercial buildings, wheelchair ramp design is governed strictly by the <strong>2010 ADA Standards for Accessible Design</strong>:
            </p>
            <ul>
              <li>
                <strong>Running Slope (§405.2):</strong> The maximum running slope for a ramp shall not be steeper than <strong>1:12</strong> (an 8.33% grade or 4.76° angle).
              </li>
              <li>
                <strong>Rise per Run (§405.6):</strong> The rise for any single ramp run shall be <strong>30 inches (760 mm) maximum</strong>. If total elevation rise exceeds 30 inches, the ramp must be divided into multiple runs separated by level landings.
              </li>
              <li>
                <strong>Landings (§405.7):</strong> Intermediate landings must have a clear length of at least 60 inches (1,525 mm) and be as wide as the widest ramp run leading to them.
              </li>
            </ul>
            <p>
              <strong>Worked Example:</strong> If your entrance has a 24-inch rise: at a 1:12 slope, the ramp requires 24 inches × 12 = 288 inches = <strong>24 feet of horizontal run</strong>. Because 24 inches is under the 30-inch limit, it can be built as a single continuous run.
            </p>

            <h2>Drain and Plumbing Pipe Slope</h2>
            <p>
              Drain fall is often written as inches of drop per foot of pipe. The minimum depends on the pipe size and on the plumbing code your area has adopted, so take it from that code or your inspector. The calculator turns any fall into a grade and a total drop:
            </p>
            <ul>
              <li><strong>1/4 inch per foot</strong> = 0.25 ÷ 12 = <strong>2.08%</strong>; over 20 ft that is a 5 in drop.</li>
              <li><strong>1/8 inch per foot</strong> = 0.125 ÷ 12 = <strong>1.04%</strong>; over 20 ft that is a 2.5 in drop.</li>
            </ul>

            <h2>Roof Pitch and Slope</h2>
            <p>
              Roofers describe steepness using inches of vertical rise per 12 inches of run. A 4/12 roof pitch means 4 inches of rise for every foot of run (an angle of 18.43° and a 33.33% slope). For rafters, combine this calculation with our <Link href="/rafter-calculator/">Rafter Calculator</Link> and <Link href="/pythagorean-theorem-calculator/">Pythagorean Theorem Calculator</Link>.
            </p>

            <h2>Driveway and Road Grades</h2>
            <p>
              Unlike ADA ramps, there is no universal federal limit for driveways; requirements are established by municipal zoning and fire marshal codes. In practice:
            </p>
            <ul>
              <li>Grades up to 10% are standard and comfortable for passenger vehicles in all weather.</li>
              <li>Grades between 10% and 15% are steep and often require transitional blending slopes at the curb to prevent car bumpers from scraping.</li>
              <li>Grades above 15% frequently require special fire department variances.</li>
            </ul>

            <h2>Rate of Change and Slope from Two Points or a Table</h2>
            <p>
              In algebra and statistics, slope represents the constant rate of change between two variables:
            </p>
            <div className={styles.formulaBox}>
              Rate of Change = Δy ÷ Δx = (y₂ − y₁) ÷ (x₂ − x₁)
            </div>
            <p>
              <strong>Worked Example:</strong> Find the slope and equation of the line passing through (1, 2) and (4, 11):
            </p>
            <ul>
              <li>Δy = 11 − 2 = 9</li>
              <li>Δx = 4 − 1 = 3</li>
              <li>Slope m = 9 ÷ 3 = <strong>3</strong></li>
              <li>y-intercept b = 2 − (3 × 1) = <strong>−1</strong></li>
              <li>Linear Equation: <strong>y = 3x − 1</strong></li>
              <li>Distance = √(3² + 9²) = √90 ≈ <strong>9.4868</strong></li>
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

        <HowWeCalculate slug="slope-calculator" />
        <AdSlot slotId="slope-calc-ad-bottom" format="horizontal" />
      </div>
    </main>
  );
}
