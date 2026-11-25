import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import RatioCalculator from '@/components/tool/ratio-calculator';
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

const route = ROUTES.ratioCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const faqs = [
  {
    q: 'What does ratio mean?',
    a: 'A ratio is a mathematical comparison of two or more numbers showing how many times one value contains or relates to another. For example, a ratio of 2:3 means for every 2 parts of the first item, there are 3 parts of the second item, giving a total of 5 parts.',
  },
  {
    q: 'How do you calculate a ratio?',
    a: 'To calculate a ratio between two quantities, write them side by side separated by a colon (A : B) or as a fraction (A / B). To express it in simplest terms, divide both quantities by their greatest common divisor (GCD). For example, 12 and 18 share a GCD of 6, simplifying to 2 : 3.',
  },
  {
    q: 'How do you simplify a ratio?',
    a: 'Find the greatest common divisor (GCD) of all terms and divide each term by that number. If the ratio contains decimals or fractions, first multiply all terms by a common factor (such as 10 or the lowest common denominator) to convert them into whole numbers before dividing by their GCD.',
  },
  {
    q: 'How do you solve a proportion for x?',
    a: 'Set up the equality A / B = C / D and cross-multiply: A × D = B × C. If D is the unknown x, solve using x = (B × C) ÷ A. For example, in 2 : 3 = 10 : x, cross-multiplying gives 2x = 30, so x = 15.',
  },
  {
    q: 'What x-value makes two ratios equivalent?',
    a: 'Two ratios A:B and C:x are equivalent when their cross-products are equal: A × x = B × C. Dividing both sides by A yields the exact value of x that preserves the proportion. For instance, in 4:6 = 10:x, x = (6 × 10) ÷ 4 = 15.',
  },
  {
    q: 'What are equivalent ratios?',
    a: 'Equivalent ratios express the exact same proportional relationship even though their numbers differ. You produce equivalent ratios by multiplying or dividing each term by the same non-zero number. For example, multiplying 5:2 by 2, 3, and 4 yields 10:4, 15:6, and 20:8.',
  },
  {
    q: 'What does a 1:2:1 ratio mean?',
    a: 'A three-part ratio like 1:2:1 compares three distinct quantities. Together, they represent 1 + 2 + 1 = 4 total parts. Part 1 makes up 1/4 (25%), Part 2 makes up 2/4 (50%), and Part 3 makes up 1/4 (25%) of the total mixture.',
  },
  {
    q: 'How do I split an amount in a ratio like 1:2:3?',
    a: 'First, add all ratio parts together: 1 + 2 + 3 = 6 parts. Then divide your total quantity by 6 to find the value of one part. Finally, multiply each ratio number by that one-part value. For example, splitting 60 kg gives 10 kg, 20 kg, and 30 kg.',
  },
  {
    q: 'How do I turn a ratio into a percentage or a fraction?',
    a: 'There are two different ways: (1) Part-of-whole: divide each term by the sum of all terms. In a 3:4 ratio, total parts equal 7, so the shares are 3/7 (42.86%) and 4/7 (57.14%). (2) Part-to-part: compare the first term directly to the second term (3 ÷ 4 = 75%).',
  },
  {
    q: 'Can a ratio have decimals or fractions?',
    a: 'Yes. Ratios can be formed with any positive real numbers, including fractions like 1/2 : 3/4 or decimals like 1.5 : 2.5. To simplify them into standard whole-number integer ratios, multiply each term by the least common denominator or powers of 10.',
  },
  {
    q: 'Ratio vs proportion: what is the difference?',
    a: 'A ratio compares two or more numbers (such as 3 : 5). A proportion is an equation stating that two ratios are equal (such as 3 : 5 = 6 : 10). Ratios are individual relationships; proportions equate two relationships.',
  },
  {
    q: 'How do map scales like 1:50,000 work?',
    a: 'A representative fraction map scale like 1:50,000 means that 1 unit on the map equals 50,000 of the same units on the ground. For example, 1 cm on the map equals 50,000 cm (500 meters or 0.5 kilometers) in the real world.',
  },
];

export default function RatioCalculatorPage() {
  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'Tools', path: '/tools/' },
            { name: 'Math & Finance', path: '/tools/#math' },
            { name: 'Ratio Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>Ratio Calculator: Simplify Ratios, Find Equivalents and Solve for X</h1>
          <p className={styles.subtitle}>
            Use this ratio finder to simplify any ratio, solve a proportion for x, or split an amount by a ratio, with every step shown.
          </p>

          <div className={styles.bluf}>
            To simplify a ratio, divide every term by their greatest common factor: 12:18 ÷ 6 = 2:3. To solve a proportion a:b = c:x, cross-multiply: x = b × c ÷ a, so 2:3 = 10:x gives x = 15.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Simplify & solve for x',
              'Split a total by ratio',
              'Fractions & decimals',
              'Steps shown',
            ]}
          >
            <RatioCalculator />
          </ToolShell>
        </div>

        <AdSlot slotId="ratio-calc-ad-mid" format="horizontal" />

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>How to Use the Ratio Finder</h2>
            <p>
              This ratio calculator includes five dedicated mathematical modes accessible via the top tabs:
            </p>
            <ul>
              <li><strong>1. Simplify Ratio:</strong> Enter 2 to 6 terms (integers, decimals like 1.5, or fractions like 1/2) to reduce the ratio to simplest whole numbers with GCD steps and 1:n scaling.</li>
              <li><strong>2. Solve for X:</strong> Solve any unknown term in a 4-part proportion (A:B = C:D) using exact cross-multiplication.</li>
              <li><strong>3. Split a Total:</strong> Divide any batch quantity (kg, lbs, fl oz, or dollars) across multi-part ratios, with an unrounded sum check so the parts always add back to the total.</li>
              <li><strong>4. Equivalent Ratios:</strong> Generate an expansion table of equivalent ratios and test whether any two ratios are equivalent.</li>
              <li><strong>5. Ratio → Fraction &amp; %:</strong> Convert ratios into both part-of-whole shares and part-to-part relative percentages.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>What is a Ratio? (Definition)</h2>
            <p>
              In mathematics, a <strong>ratio</strong> is a relationship between two or more numbers indicating how many times the first value is contained within or compares to the others. When exploring what ratio means, it is useful to know that ratios can be expressed in three common notations:
            </p>
            <ul>
              <li><strong>Colon notation:</strong> 2 : 3 (read as &quot;two to three&quot;)</li>
              <li><strong>Word notation:</strong> 2 to 3</li>
              <li><strong>Fractional notation:</strong> 2 / 3</li>
            </ul>
            <p>
              Ratios compare quantities of the same kind or different kinds (rates). Unlike simple fractions that strictly represent a part of a single whole, ratios can describe comparisons between parts (e.g. 2 parts sand to 1 part cement) or comparisons between a part and a whole (e.g. 2 sand parts out of 3 total parts).
            </p>
          </section>

          <section className={styles.section}>
            <h2>How to Calculate and Simplify a Ratio</h2>
            <p>
              To simplify a ratio to lowest terms, divide each number by the greatest common divisor (GCD) of all numbers in the set. If the ratio contains decimal points or fractions, convert them to whole numbers first:
            </p>
            <div className={styles.exampleBox}>
              <div className={styles.exampleTitle}>Example 1: Whole Number Simplification (12 : 18)</div>
              <p style={{ margin: 0 }}>
                1. Identify factors of 12 (1, 2, 3, 4, 6, 12) and 18 (1, 2, 3, 6, 9, 18).<br />
                2. The Greatest Common Divisor is 6.<br />
                3. Divide each term by 6: 12 ÷ 6 = 2 and 18 ÷ 6 = 3.<br />
                4. Simplified ratio = <strong>2 : 3</strong>.
              </p>
            </div>
            <div className={styles.exampleBox}>
              <div className={styles.exampleTitle}>Example 2: Fractional Ratio Simplification (1/2 : 3/4)</div>
              <p style={{ margin: 0 }}>
                1. The denominators are 2 and 4. The least common multiple (LCM) is 4.<br />
                2. Multiply both terms by 4: (1/2 × 4) : (3/4 × 4) = 2 : 3.<br />
                3. GCD of 2 and 3 is 1.<br />
                4. Simplified ratio = <strong>2 : 3</strong>.
              </p>
            </div>
            <div className={styles.exampleBox}>
              <div className={styles.exampleTitle}>Example 3: Decimal Ratio Simplification (1.5 : 2.5)</div>
              <p style={{ margin: 0 }}>
                1. Each number has 1 decimal place. Multiply all terms by 10: 15 : 25.<br />
                2. The GCD of 15 and 25 is 5.<br />
                3. Divide each term by 5: 15 ÷ 5 = 3 and 25 ÷ 5 = 5.<br />
                4. Simplified ratio = <strong>3 : 5</strong>.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Equivalent Ratios</h2>
            <p>
              Equivalent ratios represent identical relationships scaled by a constant factor. Multiplying or dividing all terms of a ratio by the same non-zero number produces an equivalent ratio.
            </p>
            <h3>Ratios That Are Equivalent to 5 2</h3>
            <p>
              To find ratios that are equivalent to 5:2, multiply both terms by consecutive positive integers:
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.contentTable}>
                <caption>Ratios equivalent to 5:2 for scaling factors 1 through 5</caption>
                <thead>
                  <tr>
                    <th>Scaling Factor</th>
                    <th>Calculation</th>
                    <th>Equivalent Ratio</th>
                    <th>Decimal Form</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>× 1</td>
                    <td>(5 × 1) : (2 × 1)</td>
                    <td><strong>5 : 2</strong></td>
                    <td>2.500</td>
                  </tr>
                  <tr>
                    <td>× 2</td>
                    <td>(5 × 2) : (2 × 2)</td>
                    <td><strong>10 : 4</strong></td>
                    <td>2.500</td>
                  </tr>
                  <tr>
                    <td>× 3</td>
                    <td>(5 × 3) : (2 × 3)</td>
                    <td><strong>15 : 6</strong></td>
                    <td>2.500</td>
                  </tr>
                  <tr>
                    <td>× 4</td>
                    <td>(5 × 4) : (2 × 4)</td>
                    <td><strong>20 : 8</strong></td>
                    <td>2.500</td>
                  </tr>
                  <tr>
                    <td>× 5</td>
                    <td>(5 × 5) : (2 × 5)</td>
                    <td><strong>25 : 10</strong></td>
                    <td>2.500</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Ratios and Proportions: Solving for X</h2>
            <p>
              A proportion is an equality between two ratios: A / B = C / D (or A : B = C : D). When one of the four terms is unknown, you solve for x using cross-multiplication:
            </p>
            <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
              A × D = B × C
            </p>
            <h3>What X-Value Makes the Set of Ratios Equivalent?</h3>
            <p>
              Suppose you need to determine what x-value makes the set of ratios equivalent for 2:3 and 10:x:
            </p>
            <div className={styles.exampleBox}>
              <p style={{ margin: 0 }}>
                1. Write the proportion: 2 / 3 = 10 / x<br />
                2. Cross-multiply the opposite numerators and denominators: 2 × x = 3 × 10<br />
                3. Simplify the product: 2x = 30<br />
                4. Divide by 2: x = 30 ÷ 2 = <strong>15</strong>.<br />
                Therefore, x = 15 makes the ratio 10:15 equivalent to 2:3.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Splitting an Amount by a Ratio</h2>
            <p>
              Dividing a total quantity by a ratio is fundamental in construction mixing, cooking recipes, and resource budgeting:
            </p>
            <ol>
              <li>Calculate the sum of all ratio parts: <em>Sum = Part₁ + Part₂ + ... + Partₙ</em></li>
              <li>Determine the unit value per part: <em>Unit Value = Total Amount ÷ Sum</em></li>
              <li>Multiply each part by the unit value: <em>Shareᵢ = Partᵢ × Unit Value</em></li>
            </ol>
            <p>
              For example, splitting <strong>60 kg</strong> in a <strong>1 : 2 : 3</strong> ratio (an example mix of cement, sand and stone; use the ratio your mix design or product sheet gives):
            </p>
            <ul>
              <li>Sum of parts = 1 + 2 + 3 = 6 parts</li>
              <li>Each part = 60 kg ÷ 6 = 10 kg</li>
              <li>Part 1 (Cement) = 1 × 10 kg = <strong>10 kg</strong> (16.67%)</li>
              <li>Part 2 (Sand) = 2 × 10 kg = <strong>20 kg</strong> (33.33%)</li>
              <li>Part 3 (Coarse Aggregate) = 3 × 10 kg = <strong>30 kg</strong> (50.00%)</li>
            </ul>
            <p>
              Explore our dedicated <Link href="/concrete-calculator/">Concrete Calculator</Link> and <Link href="/epoxy-resin-calculator/">Epoxy Resin Calculator</Link> for trade-specific mix calculations.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Three-Part Ratios Like 1:2:1</h2>
            <p>
              A three-part ratio like <strong>1:2:1</strong> indicates three separate components whose sum equals 1 + 2 + 1 = 4 total parts. For example, in an agricultural soil mixture or garden potting mix:
            </p>
            <ul>
              <li>Component 1 = 1 / 4 = 25%</li>
              <li>Component 2 = 2 / 4 = 50%</li>
              <li>Component 3 = 1 / 4 = 25%</li>
            </ul>
            <p>
              To scale any three-part ratio, multiply or divide all three numbers by the exact same multiplier. Scaling 1:2:1 by 5 yields 5:10:5.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Ratios as Fractions and Percentages</h2>
            <p>
              A frequent point of confusion is mistaking a <strong>part-to-part ratio</strong> for a <strong>part-of-whole percentage</strong>. For example, consider the ratio <strong>3 : 4</strong>:
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.contentTable}>
                <caption>Part-of-whole shares vs part-to-part percentage for ratio 3:4</caption>
                <thead>
                  <tr>
                    <th>Interpretation</th>
                    <th>Mathematical Meaning</th>
                    <th>Fraction</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Part of Whole (Shares)</strong></td>
                    <td>Sum = 3 + 4 = 7 parts total</td>
                    <td>3/7 and 4/7</td>
                    <td><strong>42.86% and 57.14%</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Part to Part</strong></td>
                    <td>Term 1 relative to Term 2</td>
                    <td>3/4</td>
                    <td><strong>75.00%</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              When dividing a batch, budget, or recipe, always use the part-of-whole share (42.86% and 57.14%). For converting individual fractions or test scores directly into percentages, use our <Link href="/fraction-to-percent-calculator/">Fraction to Percent Calculator</Link>, or see our <Link href="/percentage-change-calculator/">Percentage Change Calculator</Link> for before-and-after changes.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Ratio vs Proportion</h2>
            <p>
              While often used interchangeably in casual conversation, ratios and proportions have distinct mathematical roles:
            </p>
            <ul>
              <li><strong>Ratio:</strong> An expression comparing two quantities (e.g., 3 : 5 or 3/5). It is a noun describing a relationship.</li>
              <li><strong>Proportion:</strong> An equation stating that two distinct ratios are equal (e.g., 3/5 = 6/10). It is a complete statement of equivalence.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Frequently Asked Questions</h2>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{faq.q}</h3>
                <p className={styles.faqAnswer}>{faq.a}</p>
              </div>
            ))}
          </section>

          <HowWeCalculate slug="ratio-calculator" />

          <section className={styles.section}>
            <h2>Related Calculators &amp; Converters</h2>
            <div className={styles.relatedGrid}>
              <Link href="/epoxy-resin-calculator/" className={styles.relatedCard}>
                <div className={styles.relatedCardTitle}>Epoxy Resin Calculator</div>
                <div className={styles.relatedCardDesc}>Calculate resin and hardener batch splits by volume or weight for 1:1, 2:1 and custom ratios.</div>
              </Link>
              <Link href="/percentage-change-calculator/" className={styles.relatedCard}>
                <div className={styles.relatedCardTitle}>Percentage Change Calculator</div>
                <div className={styles.relatedCardDesc}>Calculate percentage increases, percentage decreases, and differences between two values.</div>
              </Link>
              <Link href="/unit-price-calculator/" className={styles.relatedCard}>
                <div className={styles.relatedCardTitle}>Unit Price Calculator</div>
                <div className={styles.relatedCardDesc}>Compare grocery package sizes and bulk prices to find the lowest price per unit.</div>
              </Link>
              <Link href="/concrete-calculator/" className={styles.relatedCard}>
                <div className={styles.relatedCardTitle}>Concrete Calculator</div>
                <div className={styles.relatedCardDesc}>Estimate slab and footing concrete volume in cubic yards and bags.</div>
              </Link>
              <Link href="/fraction-to-percent-calculator/" className={styles.relatedCard}>
                <div className={styles.relatedCardTitle}>Fraction to Percent Calculator</div>
                <div className={styles.relatedCardDesc}>Turn a fraction or a score like 16 out of 20 into a percentage, with steps.</div>
              </Link>
            </div>
          </section>
        </article>

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
