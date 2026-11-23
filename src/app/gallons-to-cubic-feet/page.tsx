import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import GallonsConverter from '@/components/tool/gallons-converter';
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

const route = ROUTES.gallonsToCubicFeetConverter;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const faqs = [
  {
    q: 'How many gallons are in a cubic foot?',
    a: 'There are exactly 1,728 ÷ 231 ≈ 7.48051948 US liquid gallons in one cubic foot (commonly rounded to 7.48052 gallons). If you are using UK imperial gallons, one cubic foot equals approximately 6.22883 imperial gallons.',
  },
  {
    q: 'How many cubic feet are in a gallon?',
    a: 'One US liquid gallon equals exactly 231 ÷ 1,728 = 0.13368055... cubic feet (commonly rounded to 0.133681 ft³). To convert any gallon figure to cubic feet, multiply by 0.133681 or divide by 7.48052.',
  },
  {
    q: 'How do I convert gallons to cubic feet?',
    a: 'To convert gallons to cubic feet, multiply the number of US gallons by 0.133681 (or divide by 7.48052). For example, 100 US gallons × 0.133681 = 13.3681 cubic feet.',
  },
  {
    q: 'What is the difference between a US gallon and an imperial gallon?',
    a: 'A US liquid gallon is legally defined as exactly 231 cubic inches (3.785411784 litres). An imperial gallon (used in the UK and Canada) is defined as exactly 4.54609 litres (approximately 277.42 cubic inches). One imperial gallon is approximately 20.1% larger than a US liquid gallon.',
  },
  {
    q: 'How do I convert gallons to m³, and m³ to gallons?',
    a: 'One cubic metre (m³) contains exactly 1,000 litres, which equals approximately 264.172 US liquid gallons. To convert gallons to m³, multiply gallons by 0.00378541. To convert m³ to gallons, multiply cubic metres by 264.172.',
  },
  {
    q: 'How many gallons does a box of L × W × H hold?',
    a: 'First compute the volume in cubic feet: Length (ft) × Width (ft) × Height (ft) = Cubic Feet. Then multiply that volume by 7.48052 to find the capacity in US gallons. For example, a 4 ft × 2 ft × 2 ft box has a volume of 16 ft³, which holds 16 × 7.48052 = 119.69 US gallons.',
  },
  {
    q: 'How many litres are in a gallon?',
    a: 'One US liquid gallon equals exactly 3.785411784 litres. One UK imperial gallon equals exactly 4.54609 litres. One US dry gallon equals approximately 4.40488 litres.',
  },
  {
    q: 'What is a US dry gallon?',
    a: 'A US dry gallon is a historical unit of volume used for dry agricultural commodities (such as berries and grain). It is legally defined as 1/8 of a US Winchester bushel, equal to exactly 268.8025 cubic inches (approximately 4.40488 litres), making it about 16.4% larger than a liquid gallon.',
  },
  {
    q: 'How much does a cubic foot of water weigh?',
    a: 'At 60°F (15.6°C), one cubic foot of fresh water weighs approximately 62.37 pounds (28.29 kilograms). One US gallon of fresh water weighs approximately 8.337 pounds (3.782 kg). Actual water weight varies slightly with temperature and salinity.',
  },
  {
    q: 'How many cubic feet are in 5, 55 or 100 gallons?',
    a: 'Using the exact factor 0.13368055 ft³ per gallon: 5 gallons = 0.6684 ft³; 55 gallons (a standard drum) = 7.3524 ft³; and 100 gallons = 13.3681 ft³.',
  },
];

export default function GallonsToCubicFeetPage() {
  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'Tools', path: '/tools/' },
            { name: 'Math & Finance', path: '/tools/#math' },
            { name: 'Gallons to Cubic Feet', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>Gallons to Cubic Feet: Convert Gallons, Cubic Feet, m³ and Litres</h1>
          <p className={styles.subtitle}>
            Instantly convert US gallons to cubic feet (ft³), cubic metres, and litres with exact NIST conversion factors, or calculate gallon capacity directly from container dimensions.
          </p>

          <div className={styles.bluf}>
            <strong>Bottom Line Up Front (BLUF):</strong> One cubic foot holds <strong>7.48052 US gallons</strong>, and one US gallon equals <strong>0.133681 cubic feet</strong>. To convert gallons to feet³ / cubic feet, multiply by 0.133681: 100 US gallons = 13.37 cubic feet (378.5 litres). Enter container dimensions in Tab 2 to find the exact gallons of any box, tank, or pond.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Gallons, ft³, m³ & litres',
              'Box & cylinder to gallons',
              'Printable table',
              'US & imperial gallons',
            ]}
          >
            <GallonsConverter />
          </ToolShell>
        </div>

        <AdSlot slotId="gallons-calc-ad-mid" format="horizontal" />

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>How Many Gallons Are in a Cubic Foot?</h2>
            <p>
              There are <strong>7.48052 US liquid gallons</strong> in one cubic foot. Conversely, one US gallon occupies <strong>0.133681 cubic feet</strong>.
            </p>
            <p>
              These numbers are derived from the foundational legal definitions established by the National Institute of Standards and Technology (NIST Handbook 44):
            </p>
            <ul>
              <li><strong>1 Cubic Foot (ft³):</strong> Exactly 12 in × 12 in × 12 in = <strong>1,728 cubic inches</strong>.</li>
              <li><strong>1 US Liquid Gallon (gal):</strong> Defined in US measurement law as exactly <strong>231 cubic inches</strong>.</li>
              <li><strong>Exact Mathematical Ratio:</strong> 1,728 in³ ÷ 231 in³ = <strong>7.48051948... US gallons per ft³</strong>.</li>
              <li><strong>Reciprocal Ratio:</strong> 231 in³ ÷ 1,728 in³ = <strong>0.13368055... ft³ per US gallon</strong>.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How to Use the Gallons Converter</h2>
            <p>
              This converter includes three dedicated tabs designed for homeowners, pool builders, landscapers, and engineers:
            </p>
            <ol>
              <li>
                <strong>Tab 1 (Convert Units):</strong> Live synchronized multi-unit converter. Change any of the five fields (US gallons, cubic feet, cubic metres, litres, or imperial gallons) and all other four units update instantaneously.
              </li>
              <li>
                <strong>Tab 2 (From Dimensions):</strong> Enter the physical length, width, and depth of a rectangular planter, pond, aquarium, or the diameter and height of a round tank to find total gallons.
              </li>
              <li>
                <strong>Tab 3 (Conversion Table):</strong> Generate a clean, printable reference table for quick job-site lookups from 1 to 1,000 gallons.
              </li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2>Gallons to Cubic Feet Formula and Examples</h2>
            <p>
              To convert US gallons to cubic feet manually, multiply the volume in gallons by <strong>0.133681</strong> (or divide by 7.48052):
            </p>
            <p style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
              Cubic Feet (ft³) = US Gallons × 0.133681
            </p>
            <div className={styles.exampleBox}>
              <div className={styles.exampleTitle}>Standard Conversion Benchmarks</div>
              <ul>
                <li><strong>5 Gallon Bucket:</strong> 5 gal × 0.133681 = <strong>0.6684 ft³</strong> (1,155 in³)</li>
                <li><strong>55 Gallon Drum:</strong> 55 gal × 0.133681 = <strong>7.3524 ft³</strong> (12,705 in³)</li>
                <li><strong>100 US Gallons:</strong> 100 gal × 0.133681 = <strong>13.3681 ft³</strong> (0.3785 m³)</li>
                <li><strong>500 Gallon Propane/Water Tank:</strong> 500 gal × 0.133681 = <strong>66.8403 ft³</strong></li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Cubic Feet to Gallons Formula and Examples</h2>
            <p>
              To convert cubic feet to US liquid gallons, multiply the cubic footage by <strong>7.48052</strong>:
            </p>
            <p style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
              US Gallons = Cubic Feet (ft³) × 7.48052
            </p>
            <div className={styles.exampleBox}>
              <div className={styles.exampleTitle}>Practical Field Examples</div>
              <ul>
                <li><strong>1 ft³ Volume:</strong> 1 × 7.48052 = <strong>7.48 US gal</strong></li>
                <li><strong>10 ft³ Planter Box:</strong> 10 × 7.48052 = <strong>74.81 US gal</strong></li>
                <li><strong>27 ft³ (1 Cubic Yard):</strong> 27 × 7.48052 = <strong>201.97 US gal</strong></li>
                <li><strong>100 ft³ Hot Tub:</strong> 100 × 7.48052 = <strong>748.05 US gal</strong></li>
              </ul>
            </div>
            <p>
              Need to convert cubic feet into surface area or materials? Explore our <Link href="/cubic-feet-to-square-feet/">Cubic Feet to Square Feet Calculator</Link> or calculate bulk aggregate volume with the <Link href="/cubic-yard-calculator/">Cubic Yard Calculator</Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>US Liquid Gallons vs Imperial Gallons vs US Dry Gallons</h2>
            <p>
              The word &ldquo;gallon&rdquo; refers to three distinct units of measurement depending on the country and material:
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.contentTable}>
                <thead>
                  <tr>
                    <th>Gallon Variant</th>
                    <th>Cubic Inches</th>
                    <th>Litres</th>
                    <th>Cubic Feet (ft³)</th>
                    <th>Primary Usage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>US Liquid Gallon</strong></td>
                    <td>231.0 in³</td>
                    <td>3.7854 L</td>
                    <td>0.133681 ft³</td>
                    <td>US liquid volume (fuel, milk, water)</td>
                  </tr>
                  <tr>
                    <td><strong>Imperial Gallon (UK)</strong></td>
                    <td>277.42 in³</td>
                    <td>4.5461 L</td>
                    <td>0.160544 ft³</td>
                    <td>United Kingdom, Canada, Australia</td>
                  </tr>
                  <tr>
                    <td><strong>US Dry Gallon</strong></td>
                    <td>268.80 in³</td>
                    <td>4.4049 L</td>
                    <td>0.155557 ft³</td>
                    <td>US agricultural produce &amp; grain</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              An Imperial gallon is approximately <strong>20.1% larger</strong> than a US liquid gallon. When converting fluid volumes from British sources or specifications, make sure you choose the Imperial option in Tab 1.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Gallons to Cubic Metres (m³) and Litres</h2>
            <p>
              Under the International System of Units (SI), volume is rooted in cubic metres (1 m³ = 1,000 litres).
            </p>
            <ul>
              <li><strong>1 US Gallon = 3.785411784 Litres (exact):</strong> 0.003785411784 m³, often rounded to 0.00378541 m³.</li>
              <li><strong>1 Cubic Metre = 264.172 US Gallons:</strong> Or 219.969 Imperial gallons.</li>
              <li><strong>1 Litre = 0.264172 US Gallons:</strong> Roughly 1 US quart plus 1.8 fluid ounces.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How Many Gallons Fit in a Box or Round Tank?</h2>
            <p>
              To determine the holding capacity of physical containers:
            </p>
            <ul>
              <li>
                <strong>Rectangular Box (Aquarium or Tank):</strong>
                <br />
                Volume = Length × Width × Depth.
                <br />
                For an aquarium measuring 48 in × 24 in × 24 in (4 ft × 2 ft × 2 ft = 16 ft³), the capacity is 16 × 7.48052 = <strong>119.69 US gallons</strong>.
              </li>
              <li>
                <strong>Cylindrical Drum or Stock Tank:</strong>
                <br />
                Volume = π × (Diameter ÷ 2)² × Height.
                <br />
                For a round stock tank measuring 6 ft diameter by 2 ft depth:
                r = 3 ft; Area = π × 3² ≈ 28.274 sq ft; Volume = 28.274 × 2 = 56.549 ft³.
                Total capacity = 56.549 × 7.48052 ≈ <strong>423.01 US gallons</strong>.
              </li>
            </ul>
            <p>
              For calculating cylindrical tanks with dish heads, conical bottoms, or partial fill dipsticks, visit our dedicated <Link href="/pipe-volume-calculator/">Pipe Volume Calculator</Link> or <Link href="/concrete-calculator/">Concrete Calculator</Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Why Some Online Converters Show Slightly Different Numbers</h2>
            <p>
              You may occasionally notice slight discrepancies of 0.001 to 0.005 ft³ between online calculators. These differences occur because some generic tools round the conversion factor early:
            </p>
            <ul>
              <li><strong>Rounded Factor (7.48):</strong> 100 ÷ 7.48 = 13.36898 ft³</li>
              <li><strong>Exact Factor (1,728 ÷ 231):</strong> 100 × (231 ÷ 1,728) = <strong>13.368055... ft³</strong></li>
            </ul>
            <p>
              KKC Tools performs all internal calculations using full-precision IEEE 754 floating-point arithmetic with exact NIST integer fractions (231 / 1,728), rounding only in the final display presentation.
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

        <HowWeCalculate slug="gallons-to-cubic-feet" />

        <JsonLd
          data={buildWebApplicationSchema({
            name: route.title,
            description: route.description,
            path: route.path,
            applicationCategory: 'UtilityApplication',
          })}
        />
        <JsonLd data={buildFaqSchema(faqs)} />
      </div>
    </main>
  );
}
