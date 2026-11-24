import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/components/seo/buildMetadata';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Faq from '@/components/ui/Faq';
import JsonLd from '@/components/seo/JsonLd';
import { buildWebApplicationSchema } from '@/components/seo/buildSchema';
import ToolShell from '@/components/tool/shared/ToolShell';
import MetricCalculator from '@/components/tool/metric-calculator';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import { ROUTES } from '@/lib/routes';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.metricConversionCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

export default function MetricConversionCalculatorPage() {
  const faqs = [
    {
      q: 'How do I convert cm to inches (and back)?',
      a: 'To convert centimetres to inches, divide by 2.54 (or multiply by 0.393701). To convert inches to centimetres, multiply by exactly 2.54, as established by the 1959 International Yard and Pound Agreement.',
    },
    {
      q: 'How do I convert kg to pounds (and stone)?',
      a: 'To convert kilograms to avoirdupois pounds, multiply by 2.20462 (or divide by the exact international factor 0.45359237). In the UK, 1 stone equals exactly 14 pounds (approx. 6.35029 kg).',
    },
    {
      q: 'How do I convert Celsius to Fahrenheit?',
      a: 'For absolute temperature points: °F = (°C × 9/5) + 32, and °C = (°F − 32) × 5/9. For example, 20 °C equals 68 °F, and 100 °C equals 212 °F (standard boiling point of water at 1 atm).',
    },
    {
      q: 'What are the metric prefixes (kilo, centi, milli)?',
      a: 'Standard SI metric prefixes are decimal powers of 10: kilo (k = 10³, 1,000×), hecto (h = 10², 100×), deka (da = 10¹, 10×), deci (d = 10⁻¹, 0.1×), centi (c = 10⁻², 0.01×), and milli (m = 10⁻³, 0.001×).',
    },
    {
      q: 'US gallon vs imperial gallon: what’s the difference?',
      a: 'A US liquid gallon is legally defined as exactly 231 cubic inches (approx. 3.78541 litres). An Imperial gallon is legally defined as exactly 4.54609 litres (approx. 277.42 cubic inches). Consequently, a US gallon is approximately 16.65% smaller than an Imperial gallon.',
    },
    {
      q: 'Why do area and volume conversions use squared or cubed factors?',
      a: 'Because area represents a two-dimensional quantity (length × width), its conversion factor is the square of the linear factor: (0.3048 m/ft)² = 0.09290304 m²/ft². Volume represents three dimensions, so its factor is cubed: (0.3048 m/ft)³ = 0.028316846592 m³/ft³.',
    },
    {
      q: 'Fluid ounces vs ounces: what’s the difference?',
      a: 'A fluid ounce (fl oz) is a measure of liquid volume, whereas an avoirdupois ounce (oz) is a measure of weight/mass (28.3495 grams). In the US system, 1 fluid ounce of water weighs approximately 1.043 dry ounces.',
    },
    {
      q: 'How do I convert feet and inches to metres?',
      a: 'Convert the feet and inches into total inches (feet × 12 + inches), then multiply by 0.0254 to obtain metres. For example, 5 ft 10 in equals 70 inches × 0.0254 = 1.778 metres.',
    },
    {
      q: 'Short ton vs long ton vs tonne?',
      a: 'A US short ton equals 2,000 pounds (907.185 kg). A UK/Imperial long ton equals 2,240 pounds (1,016.047 kg). A metric tonne (symbol t) equals 1,000 kilograms (approx. 2,204.62 pounds).',
    },
    {
      q: 'Which conversion factors are exact?',
      a: 'Under the 1959 treaty and NIST standards, 1 inch = 25.4 mm (exact), 1 foot = 0.3048 m (exact), 1 yard = 0.9144 m (exact), 1 pound = 0.45359237 kg (exact), 1 US gallon = 231 in³ (exact), and 1 Imperial gallon = 4.54609 L (exact).',
    },
  ];

  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'Tools', path: '/tools/' },
            { name: 'Math & Finance', path: '/tools/#math' },
            { name: 'Metric Conversion Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>
            Metric Conversion Calculator: Length, Weight, Volume, Area and Temperature
          </h1>
          <p className={styles.description}>
            Free metric conversion calculator. Convert length, weight, volume, area, temperature,
            and velocity between US customary, imperial, and metric SI units using exact NIST
            definitions, mixed feet-inches parsing, and printable charts.
          </p>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Length, weight, volume, area & temp',
              'Feet-inches & fractions',
              'Exact NIST factors',
              'Printable charts',
            ]}
          >
            <MetricCalculator />
          </ToolShell>
        </div>

        <div className={styles.content}>
          <section className="prose">
            <h2>How to Use the Metric Conversion Calculator</h2>
            <p>
              This universal unit converter provides bidirectional transitions between the
              International System of Units (SI metric) and US customary / Imperial measures:
            </p>
            <ul>
              <li>
                <strong>Category Navigation:</strong> Select from Length, Weight &amp; Mass, Volume,
                Surface Area, Temperature, or Velocity tabs.
              </li>
              <li>
                <strong>Mixed Notation Parsing:</strong> On the length tab, enter standard decimals
                (e.g. <code>10</code>) or architectural notation like <code>5&apos; 10&quot;</code> or{' '}
                <code>5 ft 10 1/2 in</code>.
              </li>
              <li>
                <strong>Temperature Modes:</strong> Toggle between point temperatures (e.g. 68 &deg;F
                to 20 &deg;C) and temperature differences (where a 10 &deg;C rise equals an 18 &deg;F
                rise).
              </li>
              <li>
                <strong>Precision Control:</strong> Adjust output formatting across 2, 4, or 6
                decimal places, and export clean CSV tables for workshop or laboratory records.
              </li>
            </ul>

            <h2>Metric System Basics and Prefixes</h2>
            <p>
              The International System of Units (SI) is organized around decimal multiples and
              physical fundamental constants. Following the 2019 BIPM redefinition, the metre is
              defined through the invariant speed of light in a vacuum (c = 299,792,458 m/s), and the
              kilogram is defined through the Planck constant (h = 6.62607015 &times; 10<sup>-34</sup> J&middot;s).
            </p>
            <p>Common metric prefixes include:</p>
            <ul>
              <li><strong>Kilo (k):</strong> 10<sup>3</sup> = 1,000 (e.g. 1 kilometre = 1,000 metres)</li>
              <li><strong>Centi (c):</strong> 10<sup>-2</sup> = 0.01 (e.g. 1 metre = 100 centimetres)</li>
              <li><strong>Milli (m):</strong> 10<sup>-3</sup> = 0.001 (e.g. 1 litre = 1,000 millilitres)</li>
            </ul>

            <h2>Length Conversions: Feet, Inches, Metres</h2>
            <p>
              By international agreement established in 1959 among the United States, United
              Kingdom, Canada, Australia, and New Zealand, the yard is defined as exactly 0.9144
              metres. Consequently:
            </p>
            <ul>
              <li><code>1 inch = 0.0254 m = 2.54 cm = 25.4 mm</code> (exact)</li>
              <li><code>1 foot = 12 inches = 0.3048 m</code> (exact)</li>
              <li><code>10 feet = 3.048 m</code> (exact)</li>
              <li><code>5 ft 10 in = 70 inches = 1.778 m</code></li>
            </ul>

            <h2>Weight and Mass: Pounds, Kilograms and Tons</h2>
            <p>
              The avoirdupois pound is defined exactly in kilograms (since the 1959 international yard and pound agreement):
            </p>
            <ul>
              <li><code>1 pound (lb) = 0.45359237 kg</code> (exact)</li>
              <li><code>100 kg = 220.462 lb</code></li>
              <li><strong>US Short Ton:</strong> 2,000 lb = 907.185 kg (common in US freight and aggregate hauling)</li>
              <li><strong>UK Long Ton:</strong> 2,240 lb = 1,016.047 kg (imperial historical measure)</li>
              <li><strong>Metric Tonne (t):</strong> 1,000 kg = 2,204.62 lb</li>
            </ul>

            <h2>Volume: US vs Imperial Units</h2>
            <p>
              US customary and British imperial liquid measurements share similar unit names but
              differ in physical capacity:
            </p>
            <ul>
              <li><strong>US Liquid Gallon:</strong> Legally defined as 231 cubic inches (approx. 3.78541 litres).</li>
              <li><strong>Imperial Gallon:</strong> Legally defined as 4.54609 litres (approx. 277.42 cubic inches).</li>
              <li><strong>Fluid Ounces:</strong> A US fl oz is 29.5735 mL, whereas an Imperial fl oz is 28.4131 mL.</li>
            </ul>
            <p>
              For industrial and container capacity estimates, see our specialized{' '}
              <Link href={ROUTES.gallonsToCubicFeetConverter.path}>Gallons to Cubic Feet Calculator</Link> and{' '}
              <Link href={ROUTES.tankVolumeCalculator.path}>Tank Volume Calculator</Link>.
            </p>

            <h2>Area Conversions</h2>
            <p>
              Because surface area involves two orthogonal spatial dimensions, linear scaling factors
              must be squared:
            </p>
            <ul>
              <li><code>1 ft = 0.3048 m &rarr; 1 ft&sup2; = (0.3048)&sup2; = 0.09290304 m&sup2;</code> (exact)</li>
              <li><code>1 m&sup2; = 10.76391 ft&sup2;</code></li>
              <li><code>1 Acre = 43,560 ft&sup2; = 4,046.8564 m&sup2;</code> (approx. 0.4047 hectares)</li>
              <li><code>1 Hectare (ha) = 10,000 m&sup2; = 2.47105 acres</code></li>
            </ul>

            <h2>Temperature: Readings vs Differences</h2>
            <p>
              A frequent source of engineering error arises when converting temperature changes versus
              absolute gauge readings:
            </p>
            <ul>
              <li>
                <strong>Absolute Reading:</strong> Converts specific thermodynamic states via{' '}
                <code>&deg;C = (&deg;F &minus; 32) &times; 5/9</code>. For instance, 68 &deg;F converts to 20 &deg;C.
              </li>
              <li>
                <strong>Temperature Difference (&Delta;T):</strong> Converts thermal fluctuations or
                gradients. Because the zero-point offset (+32) cancels out during subtraction, 1 &deg;C
                of temperature change corresponds to exactly 1.8 &deg;F of change.
              </li>
            </ul>

            <h2>Exact Factors and Rounding Standards</h2>
            <p>
              All computations on this page rely on the definitive constants compiled in National
              Institute of Standards and Technology (NIST) Special Publication 811 (Guide for the Use
              of the International System of Units) and NIST Handbook 44 Appendix C. Values are
              maintained at full IEEE 754 64-bit floating point precision throughout the pipeline and
              rounded only at final UI display.
            </p>

            <h2>All Unit Calculators on KKC Tools</h2>
            <p>
              Explore our comprehensive suite of material, geometric, and scientific conversion tools:
            </p>
            <div className={styles.hubGrid}>
              <Link href={ROUTES.gallonsToCubicFeetConverter.path} className={styles.hubCard}>
                <span className={styles.hubCardTitle}>Gallons to Cubic Feet</span>
                <span className={styles.hubCardDesc}>Exact US &amp; Imperial fluid conversions</span>
              </Link>
              <Link href={ROUTES.tankVolumeCalculator.path} className={styles.hubCard}>
                <span className={styles.hubCardTitle}>Tank Volume Calculator</span>
                <span className={styles.hubCardDesc}>Cylindrical, rectangular &amp; dipstick volumes</span>
              </Link>
              <Link href={ROUTES.concreteSlabCostCalculator.path} className={styles.hubCard}>
                <span className={styles.hubCardTitle}>Concrete Slab Calculator</span>
                <span className={styles.hubCardDesc}>Cubic yards, mix bags &amp; slab dimensions</span>
              </Link>
              <Link href={ROUTES.ratioCalculator.path} className={styles.hubCard}>
                <span className={styles.hubCardTitle}>Ratio Calculator</span>
                <span className={styles.hubCardDesc}>Proportional scaling, aspect ratios &amp; part ratios</span>
              </Link>
              <Link href={ROUTES.booleanCalculator.path} className={styles.hubCard}>
                <span className={styles.hubCardTitle}>Boolean Algebra Calculator</span>
                <span className={styles.hubCardDesc}>Logic gates, truth tables &amp; binary arithmetic</span>
              </Link>
            </div>

            <h2>Frequently Asked Questions</h2>
            <Faq items={faqs} />
          </section>

          <HowWeCalculate slug="metric-conversion-calculator" />
        </div>
      </div>
      <JsonLd
          data={buildWebApplicationSchema({
            name: route.title,
            description: route.description,
            path: route.path,
            applicationCategory: 'EducationalApplication',
          })}
        />
      </main>
  );
}
