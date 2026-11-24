import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import Link from 'next/link';
import ToolShell from '@/components/tool/shared/ToolShell';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import PythagoreanCalculator from '@/components/tool/pythagorean-calculator';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import AdSlot from '@/components/ads/AdSlot';
import { ROUTES } from '@/lib/routes';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.pythagoreanTheoremCalculator ?? {
  path: '/pythagorean-theorem-calculator/',
  title: 'Pythagorean Theorem Calculator – Right Triangles',
  description:
    'Free Pythagorean theorem calculator. Find the missing side of a right triangle, check a corner is square with the 3-4-5 method, and see every step.',
};

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const FAQ_ITEMS = [
  {
    q: 'What is the Pythagorean theorem (a² + b² = c²)?',
    a: 'The Pythagorean theorem states that in any right triangle (a triangle with one 90° angle), the square of the length of the hypotenuse (c, the side opposite the right angle) is strictly equal to the sum of the squares of the lengths of the two shorter sides (legs a and b): a² + b² = c².',
  },
  {
    q: 'How do I find the hypotenuse?',
    a: 'To solve for the hypotenuse c given legs a and b, square both legs, add the results together, and take the positive square root: c = √(a² + b²). For example, with legs of 3 and 4: 3² + 4² = 9 + 16 = 25, and √25 = 5.',
  },
  {
    q: 'How do I find a missing leg?',
    a: 'To solve for leg a given hypotenuse c and leg b, square the hypotenuse, subtract the square of leg b, and take the square root: a = √(c² − b²). Similarly, b = √(c² − a²). The hypotenuse must always be longer than either leg.',
  },
  {
    q: 'How do I check whether a triangle is a right triangle?',
    a: 'Identify the longest side as c and test whether a² + b² = c² (the Pythagorean converse). If a² + b² = c², it is a right triangle (90°). If a² + b² > c², it is an acute triangle (all angles < 90°). If a² + b² < c², it is an obtuse triangle (one angle > 90°).',
  },
  {
    q: 'What are Pythagorean triples?',
    a: 'A Pythagorean triple consists of three positive integers (a, b, c) that satisfy a² + b² = c². The most famous primitive triples are (3, 4, 5), (5, 12, 13), (8, 15, 17), and (7, 24, 25). Any whole-number multiple (such as 6-8-10 or 9-12-15) also forms a valid right triangle.',
  },
  {
    q: 'How do I use 3-4-5 to square a corner for a slab, deck or wall?',
    a: 'From the corner where two lines meet, measure 3 feet along one line and make a mark. Measure 4 feet along the perpendicular line and make a mark. Measure the direct diagonal distance between the two marks. If the diagonal measures exactly 5 feet, the corner forms an exact 90° right angle. For larger layouts, use scaled multiples such as 6-8-10 or 9-12-15.',
  },
  {
    q: 'What diagonal should an L × W rectangle have?',
    a: 'Because a rectangle splits diagonally into two identical right triangles with legs L and W, the diagonal length equals √(L² + W²). For example, a 12 × 16 ft concrete pad has a diagonal of √(144 + 256) = √400 = 20 ft. A 10 × 14 ft deck has a diagonal of √(100 + 196) = √296 ≈ 17.2047 ft (17′ 2-7/16″).',
  },
  {
    q: 'Does the theorem work for non-right triangles?',
    a: 'No. The pure formula a² + b² = c² applies exclusively to right triangles (where the included angle is 90° and cos(90°) = 0). For non-right triangles, use the generalized Law of Cosines: c² = a² + b² − 2ab·cos(C).',
  },
  {
    q: 'How do I find the angles of a right triangle?',
    a: 'Using basic trigonometry: angle α (opposite leg a) equals arctan(a ÷ b) in degrees. Because the three angles of any planar triangle sum to 180° and one angle is 90°, the remaining acute angle β is simply 90° − α.',
  },
  {
    q: 'What is the diagonal of a square or an isosceles right triangle?',
    a: 'In a square of side length s, the two legs are equal (a = b = s). Applying the theorem yields c = √(s² + s²) = √(2s²) = s√2. Therefore, multiplying the side length of any square by √2 (≈ 1.41421) gives its diagonal.',
  },
  {
    q: 'How do I write the answer in exact radical form?',
    a: 'To simplify √n, factor out the largest perfect square factor k² such that n = k² × m. Then √n = √(k² × m) = k√m. For example, with legs 3 and 6: c² = 3² + 6² = 9 + 36 = 45. Because 45 = 9 × 5 and 9 is a square, c = √45 = 3√5.',
  },
];

export default function PythagoreanTheoremPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Pythagorean Theorem Calculator',
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
            { name: 'Pythagorean Theorem', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>Pythagorean Theorem Calculator: Find Any Side of a Right Triangle</h1>
          <p className={styles.subtitle}>
            This Pythagoras equation solver finds hypotenuse c, leg a, leg b, both acute angles, area, perimeter, and altitude. Includes exact radicals and builder squaring checks.
          </p>

          <div className={styles.bluf}>
            <strong>Bottom Line Up Front (BLUF):</strong> The Pythagoras equation is a² + b² = c². With legs of 3 and 4, c = √(9 + 16) = 5. Builders use it to check a corner: a 12 × 16 ft slab is square when its diagonal is exactly 20 ft, and a 10 × 14 ft deck should measure 17′ 2-7/16″.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Any missing side & angles',
              '3-4-5 square check',
              'Feet-inches to 1/16"',
              'Steps & diagram',
            ]}
          >
            <PythagoreanCalculator />
          </ToolShell>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className={styles.contentSection}>
          <div className={styles.prose}>
            <h2>How to Use the Pythagoras Equation Solver</h2>
            <p>
              This right triangle and pythagorean equation solver handles four specialized calculation workflows:
            </p>
            <ol>
              <li>
                <strong>Find a Side (Default):</strong> Select which side is unknown (hypotenuse c, leg a, or leg b) and enter the two known lengths. The solver determines the missing side, exact square root radical, decimal approximation, both interior acute angles (α and β), total area, perimeter, and altitude.
              </li>
              <li>
                <strong>Side + Angle Mode:</strong> Enter any one side length and one acute angle (0° to 90°). Using trigonometry, the solver calculates the remaining two sides and opposite angle.
              </li>
              <li>
                <strong>Is It Square? (Builder Mode):</strong> Enter the length and width of any rectangular layout (concrete slab, foundation, framing wall, or deck). Get the exact cross-corner diagonal in decimal feet and fractional inches (rounded to 1/16″), plus a scaled 3-4-5 mark suggestion.
              </li>
              <li>
                <strong>Check a Triangle:</strong> Input any three side lengths to classify whether the triangle is right (90°), acute (&lt; 90°), obtuse (&gt; 90°), or geometrically invalid.
              </li>
            </ol>

            <h2>The Pythagoras Equation (a² + b² = c²)</h2>
            <p>
              Formulated by the ancient Greek mathematician Pythagoras of Samos (c. 570–495 BC), the theorem establishes a geometric equivalence: the area of a square constructed upon the hypotenuse is identically equal to the sum of the areas of squares constructed upon the other two legs.
            </p>
            <div className={styles.formulaBox}>
              a² + b² = c²
            </div>
            <p>
              Where:
            </p>
            <ul>
              <li><strong>a</strong> = length of first leg (perpendicular side)</li>
              <li><strong>b</strong> = length of second leg (base side)</li>
              <li><strong>c</strong> = length of hypotenuse (the longest side opposite the 90° right angle)</li>
            </ul>

            <h2>How to Find the Hypotenuse</h2>
            <p>
              To solve for the hypotenuse when both legs are known, take the square root of the sum of squared legs:
            </p>
            <div className={styles.formulaBox}>
              c = √(a² + b²)
            </div>
            <p>
              <strong>Worked Example with Exact Radicals:</strong> Suppose a right triangle has legs a = 3 and b = 6.
            </p>
            <ul>
              <li>Square leg a: 3² = 9</li>
              <li>Square leg b: 6² = 36</li>
              <li>Sum the squares: a² + b² = 9 + 36 = 45</li>
              <li>Hypotenuse: c = √45</li>
              <li>Simplify radical: 45 = 9 × 5 = 3² × 5 → <strong>c = 3√5</strong> ≈ <strong>6.7082</strong></li>
            </ul>

            <h2>How to Find a Missing Leg</h2>
            <p>
              When the hypotenuse c and one leg are known, subtract the square of the known leg from c²:
            </p>
            <div className={styles.formulaBox}>
              a = √(c² − b²) &nbsp;&nbsp;or&nbsp;&nbsp; b = √(c² − a²)
            </div>
            <p>
              <strong>Example:</strong> If a ladder measuring 13 feet (c = 13) reaches 12 feet up a vertical wall (b = 12), how far must its base sit from the wall?
            </p>
            <div className={styles.formulaBox}>
              a = √(13² − 12²) = √(169 − 144) = √25 = 5 feet.
            </div>

            <h2>Angles, Area, Perimeter and Altitude of a Right Triangle</h2>
            <p>
              A complete right triangle solution involves more than side lengths:
            </p>
            <ul>
              <li>
                <strong>Interior Angles:</strong> α = arctan(a ÷ b) and β = 90° − α. For a 3-4-5 triangle: α = arctan(3 ÷ 4) = 36.87°, β = 53.13°, and γ = 90°.
              </li>
              <li>
                <strong>Area:</strong> Because legs a and b are perpendicular, the area is simply (a × b) ÷ 2. For legs 3 and 4: Area = (3 × 4) ÷ 2 = 6 square units.
              </li>
              <li>
                <strong>Perimeter:</strong> P = a + b + c. For legs 3 and 4: 3 + 4 + 5 = 12 units.
              </li>
              <li>
                <strong>Altitude (h):</strong> The height perpendicular to the hypotenuse equals (a × b) ÷ c. For legs 3 and 4: (3 × 4) ÷ 5 = 2.4 units.
              </li>
            </ul>

            <h2>Pythagorean Triples (Integer Solutions)</h2>
            <p>
              Pythagorean triples are sets of three positive integers (a, b, c) that solve a² + b² = c² with zero remainder. Useful primitive triples include:
            </p>
            <ul>
              <li><strong>(3, 4, 5):</strong> 9 + 16 = 25</li>
              <li><strong>(5, 12, 13):</strong> 25 + 144 = 169</li>
              <li><strong>(8, 15, 17):</strong> 64 + 225 = 289</li>
              <li><strong>(7, 24, 25):</strong> 49 + 576 = 625</li>
              <li><strong>(20, 21, 29):</strong> 400 + 441 = 841</li>
            </ul>
            <p>
              Any scalar multiple of a triple is also a valid right triangle. Multiplying (3, 4, 5) by 2 yields (6, 8, 10); multiplying by 4 yields (12, 16, 20).
            </p>

            <h2>Squaring a Corner with the 3-4-5 Rule (Builder Layout)</h2>
            <p>
              In carpentry, foundation masonry, and hardscaping, ensuring formwork corners are perfectly square (90°) prevents structural misalignment.
            </p>
            <p>
              <strong>The 3-4-5 Method:</strong>
            </p>
            <ol>
              <li>From the target corner, pull a tape measure along one chalk line and mark a point at 3 feet (or 3 units).</li>
              <li>Pull a tape measure along the perpendicular chalk line and mark a point at 4 feet (or 4 units).</li>
              <li>Measure the diagonal span directly between the two marks. If the span equals exactly 5 feet, the corner is 90° square. If the span is longer than 5 feet, the corner angle is greater than 90° (obtuse); if shorter, it is acute.</li>
            </ol>
            <p>
              <strong>Checking Entire Rectangles:</strong> For a rectangular pad measuring L × W, both diagonal measurements from opposing corners must be equal:
            </p>
            <div className={styles.formulaBox}>
              Target Diagonal = √(Length² + Width²)
            </div>
            <p>
              For example, for a 10 × 14 ft deck, the diagonal must measure √(10² + 14²) = √296 ≈ <strong>17.2047 ft</strong>, which corresponds to <strong>17′ 2-7/16″</strong> on a standard builder&apos;s tape measure.
            </p>

            <h2>Is It a Right Triangle? (Converse of the Pythagorean Theorem)</h2>
            <p>
              Given any three positive numbers a, b, and c where c is the longest side:
            </p>
            <ul>
              <li>If a² + b² = c², the angle opposite c is exactly 90° (Right Triangle).</li>
              <li>If a² + b² &gt; c², all interior angles are less than 90° (Acute Triangle).</li>
              <li>If a² + b² &lt; c², the angle opposite c is strictly greater than 90° (Obtuse Triangle).</li>
            </ul>
            <p>
              For laying out foundations or calculating concrete material, pair this with our <Link href="/concrete-calculator/">Concrete Calculator</Link> and <Link href="/square-footage-calculator/">Square Footage Calculator</Link>.
            </p>

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

        <HowWeCalculate slug="pythagorean-theorem-calculator" />
        <AdSlot slotId="pythagorean-calc-ad-bottom" format="horizontal" />
      </div>
    </main>
  );
}
