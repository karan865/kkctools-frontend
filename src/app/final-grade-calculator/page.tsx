import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import Link from 'next/link';
import ToolShell from '@/components/tool/shared/ToolShell';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { FinalGradeCalculator } from '@/components/tool/final-grade-calculator';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import AdSlot from '@/components/ads/AdSlot';
import { ROUTES } from '@/lib/routes';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.finalGradeCalculator ?? {
  path: '/final-grade-calculator/',
  title: 'Final Grade Calculator – What Do I Need on My Final?',
  description:
    "Free final grade calculator. Enter your current grade, the final's weight and the grade you want, and see the score you need on the final exam.",
};

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const FAQ_ITEMS = [
  {
    q: 'What do I need on my final to get an A, B or C?',
    a: 'To calculate your required final exam score, use the formula: Needed Score = [Target Grade − Current Grade × (1 − Final Weight)] ÷ Final Weight. For example, if you hold an 85% and the final is worth 20%, you need 95% on the final to finish with an 87%, or 60% to secure an 80% (B).',
  },
  {
    q: 'How is the needed final score calculated?',
    a: 'Your course grade is a weighted average of your coursework so far and your final exam. The formula isolates the final exam score: Needed = [Target − Current × (1 − Weight)] ÷ Weight, where Weight is expressed as a decimal (e.g. 20% = 0.20).',
  },
  {
    q: 'What will my grade be after the final exam?',
    a: 'To project your final course grade after taking the exam, use: Projected Grade = Current Grade × (1 − Final Weight) + Final Exam Score × Final Weight. Our What-If tab simulates your exact grade across any exam outcome from 0% to 100%.',
  },
  {
    q: 'What if the calculator says I need more than 100%?',
    a: 'If your required score exceeds 100%, the target grade is mathematically unreachable without extra credit. The calculator displays your maximum possible grade (achieved with a 100% on the final) so you know your highest possible outcome.',
  },
  {
    q: 'Where do I find my final exam’s weight?',
    a: 'Check your course syllabus under the grading policy or assessment breakdown section. If it is not listed, ask your teacher; the calculator needs that weight to give a correct answer.',
  },
  {
    q: 'What if my final counts as a test, or my lowest test is dropped?',
    a: 'When a final counts as a test, add the final to your test count. For instance, if you have taken 3 unit tests and the final counts as 2 tests, your total test denominator is 5. If your professor drops the lowest test, substitute your lowest score with your final score if the final is higher.',
  },
  {
    q: 'How do weighted categories (homework, quizzes, exams) work?',
    a: 'In a weighted category system, each assignment group represents a fixed percentage of your total course grade regardless of points. Calculate your weighted average: Coursework Average = Σ (Category Average × Category Weight) ÷ Total Weight.',
  },
  {
    q: 'How do I calculate a semester exam grade?',
    a: 'Some schools combine two quarter grades and a semester exam, for example Quarter 1 = 40%, Quarter 2 = 40%, Semester Exam = 20% (check your school’s split). Enter your average quarter grade as your current grade (80% total weight) and the exam weight as 20%.',
  },
  {
    q: 'Does my current grade include the final exam?',
    a: 'No. Your current grade represents the cumulative percentage earned on all coursework, homework, labs, and midterms submitted before sitting for the final exam.',
  },
  {
    q: 'How do points-based classes work compared to weighted classes?',
    a: 'In a total points system, every assignment carries a specific point value. Your final exam weight equals (Final Exam Points ÷ Total Course Points). Divide your total accumulated points by total possible points to find your current grade.',
  },
];

export default function FinalGradePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Final Grade Calculator',
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
            { name: 'Final Grade Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>
            Final Grade Calculator: What Score Do I Need on My Final?
          </h1>
          <p className={styles.subtitle}>
            Determine the exact score required on your final exam to pass or secure an A, B, or C.
            Supports weighted categories, points-based classes, and letter grade cutoff tables.
          </p>

          <div className={styles.bluf}>
            What do I need on my final? Needed score = (grade you want − current grade × (1 − final weight)) ÷ final weight.
            With an 85% now and a final worth 20%, you need 95% on the final to finish with an 87%; an A (90%) is
            unreachable (max possible 88%), while a B (80%) requires 60% and a D (60%) is already secured.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Score needed for every letter',
              'Weighted categories',
              'What-if slider',
              'Dropped-test & points modes',
            ]}
          >
            <FinalGradeCalculator />
          </ToolShell>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <HowWeCalculate slug="final-grade-calculator" />

        <div className={styles.contentSection}>
          <article className={styles.prose}>
            <h2>How to Use the Final Grade Calculator</h2>
            <p>
              Whether studying for college finals, high school semester exams, or AP tests, this tool models
              your exact grading situation across four specialized modes:
            </p>
            <ol>
              <li>
                <strong>Score Needed:</strong> Enter your current class grade, the percentage weight of your
                final exam, and your desired target grade. The calculator instantly generates your required
                exam score alongside a full letter-grade cutoff table.
              </li>
              <li>
                <strong>Weighted Categories:</strong> Enter your syllabus categories (homework, quizzes, unit
                tests, labs) and their respective weights to determine your current baseline and needed final score.
              </li>
              <li>
                <strong>Points-Based:</strong> For classes graded on total accumulated points rather than percentage
                weights, enter points earned, points possible to date, and the final exam points.
              </li>
              <li>
                <strong>What-If Projection:</strong> Drag the interactive slider from 0% to 100% to preview your
                exact overall course grade across various exam performances.
              </li>
            </ol>

            <h2>What Do I Need on My Final? The Formula</h2>
            <p>
              Your final course grade is a weighted linear combination of your prior coursework and your final exam score:
            </p>
            <p style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 600, margin: '16px 0' }}>
              Final Grade = Current Grade × (1 − w) + Final Exam × w
            </p>
            <p>
              To solve for the score required on the final exam (<code>F</code>) to achieve your target grade (<code>T</code>):
            </p>
            <p style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 700, margin: '16px 0' }}>
              F = [T − Current Grade × (1 − w)] ÷ w
            </p>
            <p>
              Where:
            </p>
            <ul>
              <li><strong>F:</strong> Required score on the final exam (in %).</li>
              <li><strong>T:</strong> Target overall course grade (in %).</li>
              <li><strong>Current Grade:</strong> Your percentage grade entering the exam.</li>
              <li><strong>w:</strong> Weight of the final exam expressed as a decimal (e.g. 20% = 0.20).</li>
            </ul>
            <p>
              <strong>Worked Example:</strong> If your current grade is 85%, your final is worth 20% (w = 0.20),
              and you want an 87% final grade:
            </p>
            <p style={{ fontFamily: 'monospace', padding: '10px 14px', background: 'var(--surface-subtle)', borderRadius: '6px' }}>
              F = [87 − 85 × (1 − 0.20)] ÷ 0.20
              <br />
              F = [87 − 85 × 0.80] ÷ 0.20
              <br />
              F = [87 − 68] ÷ 0.20 = 19 ÷ 0.20 = <strong>95.00%</strong>
            </p>

            <h2>Score Needed for an A, B, C or D</h2>
            <p>
              Grading scales differ by educational institution, but standard college and secondary school cutoff
              thresholds demonstrate how exam weighting impacts achievable outcomes:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.contentTable}>
                <caption>Sample letter grade cutoffs and required final exam scores from an 85% current grade</caption>
                <thead>
                  <tr>
                    <th>Letter Grade</th>
                    <th>Standard Cutoff</th>
                    <th>Score Needed on 20% Final (from 85% Current)</th>
                    <th>Feasibility Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>A</strong></td>
                    <td>90%</td>
                    <td><strong>110.00%</strong></td>
                    <td style={{ color: '#DC2626', fontWeight: 600 }}>Not reachable (max possible 88.0%)</td>
                  </tr>
                  <tr>
                    <td><strong>B</strong></td>
                    <td>80%</td>
                    <td><strong>60.00%</strong></td>
                    <td style={{ color: '#0D9488', fontWeight: 600 }}>Achievable</td>
                  </tr>
                  <tr>
                    <td><strong>C</strong></td>
                    <td>70%</td>
                    <td><strong>10.00%</strong></td>
                    <td style={{ color: '#0D9488', fontWeight: 600 }}>Achievable</td>
                  </tr>
                  <tr>
                    <td><strong>D</strong></td>
                    <td>60%</td>
                    <td><strong>−40.00%</strong></td>
                    <td style={{ color: '#2563EB', fontWeight: 600 }}>Already secured (min possible 68.0%)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>Weighted Grades: Homework, Quizzes, Tests and the Final</h2>
            <p>
              Most university STEM and humanities courses split evaluations into weighted syllabus categories.
              Consider a representative college course distribution:
            </p>
            <ul>
              <li><strong>Homework (20% weight):</strong> 92% average (contributes <code>0.20 × 92 = 18.40</code> points)</li>
              <li><strong>Quizzes (20% weight):</strong> 85% average (contributes <code>0.20 × 85 = 17.00</code> points)</li>
              <li><strong>Midterms (35% weight):</strong> 80% average (contributes <code>0.35 × 80 = 28.00</code> points)</li>
              <li><strong>Final Exam (25% weight):</strong> Remaining assessment</li>
            </ul>
            <p>
              Summing completed coursework: <code>18.40 + 17.00 + 28.00 = 63.40</code> points earned out of 75% total.
              To reach an 85% final course grade, you need <code>85.00 − 63.40 = 21.60</code> points from the final.
              The required exam percentage is:
            </p>
            <p style={{ fontFamily: 'monospace', padding: '10px 14px', background: 'var(--surface-subtle)', borderRadius: '6px' }}>
              Final Exam Score = 21.60 ÷ 0.25 = <strong>86.40%</strong>
            </p>

            <h2>Points-Based Classes</h2>
            <p>
              In points-based courses, each assignment contributes directly to a running cumulative total.
              For instance, if your class has 500 total points before the final, you have earned 420 points,
              and the final is worth 100 points:
            </p>
            <ul>
              <li>Total possible points at semester conclusion: <code>500 + 100 = 600 points</code>.</li>
              <li>To earn an 85% (B) in the course: <code>600 × 0.85 = 510 points</code> required.</li>
              <li>Points needed on final exam: <code>510 − 420 = 90 points</code> (or 90.00%).</li>
            </ul>

            <h2>When the Final Counts as a Test, or the Lowest Test is Dropped</h2>
            <p>
              Instructors occasionally apply specialized exam policies outlined in their course syllabus:
            </p>
            <ul>
              <li>
                <strong>Final Counts as N Tests:</strong> If your teacher gives 3 regular unit tests and states
                the cumulative final counts as 2 regular tests, your exam block has 5 equal units. Calculate
                your current test sum, multiply target average by 5, subtract your current sum, and divide by 2.
              </li>
              <li>
                <strong>Lowest Test Dropped:</strong> If your final exam score exceeds your lowest midterm score,
                the lower score is discarded and replaced by the final score. In this policy, your final exam
                effectively carries double weight.
              </li>
            </ul>

            <h2>What If You Need More Than 100%?</h2>
            <p>
              When mathematical requirements exceed 100%, the target grade cannot be achieved through standard
              testing alone. In this scenario, examine two critical benchmarks:
            </p>
            <ul>
              <li>
                <strong>Maximum Possible Grade:</strong> Calculated assuming a perfect 100% on the final.
                If your maximum possible grade is 88%, an A (90%) is out of reach, but a high B+ remains attainable.
              </li>
              <li>
                <strong>Minimum Guaranteed Grade:</strong> Calculated assuming a 0% on the final. Knowing your
                guaranteed floor grade provides confidence when prioritizing study time across competing subjects.
              </li>
            </ul>

            <h2>Where to Find Your Final Exam’s Weight</h2>
            <p>
              Your final exam weighting is documented in your official course syllabus, learning management
              portal (Canvas, Blackboard, Moodle), or course orientation sheet. If your syllabus states
              separate lab or recitation percentages, combine them using our Weighted Categories tab.
            </p>
            <p>
              To convert fractional scores into percentages, use our{' '}
              <Link href="/fraction-to-percent-calculator/" style={{ color: 'var(--cat-math)', fontWeight: 600 }}>
                Fraction to Percent Calculator
              </Link>{' '}
              or assess class score spreads with our{' '}
              <Link href="/standard-deviation-calculator/" style={{ color: 'var(--cat-math)', fontWeight: 600 }}>
                Standard Deviation Calculator
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

        <AdSlot slotId="final-grade-ad-bottom" format="horizontal" />
      </div>
    </main>
  );
}
