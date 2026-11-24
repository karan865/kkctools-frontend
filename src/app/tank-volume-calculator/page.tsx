import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import Link from 'next/link';
import ToolShell from '@/components/tool/shared/ToolShell';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import TankCalculator from '@/components/tool/tank-calculator';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import AdSlot from '@/components/ads/AdSlot';
import { ROUTES } from '@/lib/routes';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.tankVolumeCalculator ?? {
  path: '/tank-volume-calculator/',
  title: 'Tank Volume Calculator – Gallons in Any Tank',
  description:
    'Free tank volume calculator. Find the capacity and the filled volume of round, horizontal, oval, rectangular and cone-bottom tanks in gallons and litres.',
};

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const FAQ_ITEMS = [
  {
    q: 'How do I calculate the volume of a cylindrical tank in gallons?',
    a: 'For a vertical or full cylindrical tank, calculate volume in cubic feet using V = π × radius² × length (or height), then multiply by 7.48052 (the number of US gallons in one cubic foot). For example, a 4 ft diameter cylinder (radius = 2 ft) that is 6 ft tall has a volume of π × 4 × 6 = 75.398 cu ft, which equals 564.0 US gallons.',
  },
  {
    q: 'How much liquid is in a horizontal tank at a given depth?',
    a: 'In a horizontal cylinder, partial fill does not scale linearly because the tank curves. Liquid volume equals the circular cross-sectional segment area times the cylinder length: V = [r² × arccos((r − h) ÷ r) − (r − h) × √(2rh − h²)] × L. For example, a 6 × 12 ft horizontal tank (2,538.1 gal full) filled to a 2 ft depth holds 740.6 gallons (29.2% full).',
  },
  {
    q: 'How do I make or read a dipstick chart?',
    a: 'A dipstick chart (or strapping table) maps the vertical liquid depth in inches directly to gallons. Use our “Dipstick Chart” tab to generate a custom 1-inch or 2-inch increment table for your exact tank dimensions, which can be printed and mounted directly beside the tank gauge.',
  },
  {
    q: 'How do domed or elliptical ends change capacity?',
    a: 'Standard dished heads add volume beyond the straight cylinder shell. Hemispherical heads at both ends add the volume of one complete sphere: (4/3) × π × r³. 2:1 semi-elliptical heads (head depth = diameter ÷ 4) have half the depth of hemispherical heads and add (2/3) × π × r³ to total capacity.',
  },
  {
    q: 'How do I calculate a cone-bottom tank?',
    a: 'A cone-bottom tank combines an upper cylinder with a lower conical hopper. Total capacity is (π × r² × H_cylinder) + ((1/3) × π × r² × H_cone). If liquid depth is below the cone height, calculate volume using the cone formula with proportional radius rh = r × (depth ÷ H_cone). If depth exceeds cone height, add the full cone volume to the filled portion of the cylinder.',
  },
  {
    q: 'Why isn’t a half-full gauge exactly half the gallons?',
    a: 'In upright vertical tanks and rectangular cisterns, a half-height gauge is exactly half the gallons. In horizontal cylindrical tanks, however, the cross-section is widest in the middle. For flat ends, at 25% of the depth the tank holds about 19.6% of its capacity, and at 50% depth it holds exactly 50%.',
  },
  {
    q: 'What size tank do I need?',
    a: 'To size a tank, divide your target volume in US gallons by 7.48052 to find required cubic feet. Choose a practical diameter (e.g., 4 ft or 6 ft), determine the cross-sectional area (π × r²), and divide required cubic feet by area to get required cylinder length: Length = Target cu ft ÷ (π × r²).',
  },
  {
    q: 'How many gallons are in a cubic foot?',
    a: 'One cubic foot contains 1,728 ÷ 231 = 7.48052 US liquid gallons (or 6.22883 Imperial gallons and 28.31685 litres). To convert between cubic measurements and liquid volume, use our Gallons to Cubic Feet Converter.',
  },
  {
    q: 'How much does the liquid in my tank weigh?',
    a: 'Liquid weight equals filled gallons multiplied by density. Fresh water is about 8.34 lb per US gallon. For any other liquid, choose “Other liquid” and enter its density from the product’s safety data sheet or your supplier, because fuels and oils vary by grade and temperature.',
  },
  {
    q: 'What is ullage in tank measurement?',
    a: 'Ullage (also called outage) is the empty air space between the top of the liquid surface and the top interior of the tank. Ullage equals the full height of the tank (the diameter for a horizontal tank) minus the liquid depth, so you can measure from the top instead of the bottom.',
  },
];

export default function TankVolumePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Tank Volume Calculator',
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
            { name: 'Tank Volume Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>Tank Volume Calculator: Gallons and Litres in Round, Oval and Box Tanks</h1>
          <p className={styles.subtitle}>
            Calculate total storage capacity and partial liquid volume for horizontal cylinders, upright silos, cone-bottom hoppers, and rectangular tanks. Includes printable dipstick strapping charts.
          </p>

          <div className={styles.bluf}>
            <strong>Bottom Line Up Front (BLUF):</strong> For a vertical round tank, volume = π × radius² × height: 4 ft across and 6 ft tall holds about 564 US gallons. A horizontal 6 × 12 ft tank holds about 2,538 gallons, and at 2 ft of liquid it contains 740.6 gallons; the calculator does that partial-fill maths for any depth.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Every tank shape & head',
              'Volume at any depth',
              'Printable dipstick chart',
              'Gallons, litres & barrels',
            ]}
          >
            <TankCalculator />
          </ToolShell>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className={styles.contentSection}>
          <div className={styles.prose}>
            <h2>How to Use the Tank Volume Calculator</h2>
            <p>
              This tank volume and sizing calculator solves storage requirements across three specialized tabs:
            </p>
            <ol>
              <li>
                <strong>Capacity &amp; Partial Fill (Default):</strong> Select your tank geometry (horizontal cylinder, vertical upright silo, rectangular cistern, cone-bottom hopper, or sphere). Enter diameter, length, height, and head style (flat, hemispherical, or 2:1 elliptical). Specify liquid depth from the bottom or ullage air gap from the top.
              </li>
              <li>
                <strong>Dipstick (Strapping) Chart:</strong> Generate a complete incremental calibration table in 1-inch, 2-inch, or 6-inch steps. Copy the data as CSV or print a reference card to attach to your storage tank.
              </li>
              <li>
                <strong>Tank Sizing:</strong> Enter your required storage capacity in gallons and available diameter to determine the exact required tank length or height.
              </li>
            </ol>

            <h2>Volume of a Vertical Tank</h2>
            <p>
              In an upright vertical cylinder, the cross-sectional area is uniform from bottom to top. Liquid volume scales linearly with depth:
            </p>
            <div className={styles.formulaBox}>
              Total Volume = π × r² × Height<br />
              Filled Volume = π × r² × Liquid Depth
            </div>
            <p>
              To convert cubic feet into US liquid gallons, multiply by 7.48052 (or multiply cubic metres by 1,000 for litres).
            </p>
            <p>
              <strong>Example:</strong> An upright agricultural water tank measuring 4 feet in diameter (radius = 2 ft) and 6 feet in height:
            </p>
            <ul>
              <li>Volume = π × 2² × 6 = 24π ≈ 75.398 cubic feet</li>
              <li>Gallons = 75.398 × 7.48052 ≈ <strong>564.0 US gallons</strong></li>
              <li>If filled to 3 feet (half depth), it holds exactly 564.0 ÷ 2 = <strong>282.0 gallons</strong> (50% full).</li>
            </ul>

            <h2>Volume of a Horizontal Tank: Full and Partly Filled</h2>
            <p>
              For a horizontal cylindrical tank, total full capacity equals the circle area times length (π × r² × L). However, calculating liquid at partial depth requires finding the area of a circular segment:
            </p>
            <div className={styles.formulaBox}>
              Segment Area A(h) = r² × arccos((r − h) ÷ r) − (r − h) × √(2rh − h²)<br />
              Filled Volume = A(h) × Length
            </div>
            <p>
              Where:
            </p>
            <ul>
              <li><strong>r:</strong> Tank radius (half of diameter)</li>
              <li><strong>h:</strong> Liquid depth from the bottom</li>
              <li><strong>L:</strong> Length of the cylindrical shell</li>
            </ul>
            <p>
              <strong>Worked Example:</strong> Consider a horizontal tank with diameter D = 6 ft (radius r = 3 ft) and length L = 12 ft filled to a depth of h = 2 ft:
            </p>
            <ul>
              <li>Full Capacity: π × 3² × 12 = 108π ≈ 339.292 cu ft × 7.48052 = <strong>2,538.1 US gallons</strong></li>
              <li>r − h = 3 − 2 = 1 ft</li>
              <li>Segment Area A(2) = 3² × arccos(1 ÷ 3) − 1 × √(2 × 3 × 2 − 2²) = 9 × 1.23096 − √8 = 11.0786 − 2.8284 = 8.2502 sq ft</li>
              <li>Filled Volume: 8.2502 sq ft × 12 ft = 99.0024 cu ft × 7.48052 ≈ <strong>740.6 US gallons</strong></li>
              <li>Percentage Full: 740.6 ÷ 2,538.1 = <strong>29.2% full</strong> (even though 2 ft is 33.3% of the 6 ft diameter)</li>
            </ul>

            <h2>Tanks with Domed or Elliptical Heads</h2>
            <p>
              Industrial pressure vessels and transport tankers feature curved dished heads to withstand internal pressure:
            </p>
            <ul>
              <li>
                <strong>Hemispherical Heads:</strong> Both heads together form a full sphere of radius r. Total head volume equals (4/3) × π × r³. Partial fill in both heads equals the volume of a spherical cap: V = (π × h² × (3r − h)) ÷ 3.
              </li>
              <li>
                <strong>2:1 Semi-Elliptical Heads:</strong> The head depth equals one-fourth of the diameter (r ÷ 2). Both heads together hold half the volume of a sphere: (2/3) × π × r³.
              </li>
            </ul>

            <h2>Rectangular, Spherical and Cone-Bottom Tanks</h2>
            <p>
              Our calculator also handles non-cylindrical configurations:
            </p>
            <ul>
              <li>
                <strong>Rectangular Cisterns:</strong> Volume = Length × Width × Depth. Liquid volume is perfectly proportional to depth.
              </li>
              <li>
                <strong>Spherical Globes:</strong> Total capacity = (4/3) × π × r³. Partial fill at depth h follows the spherical cap formula: V = (π × h² × (3r − h)) ÷ 3.
              </li>
              <li>
                <strong>Cone-Bottom Tanks:</strong> Common in brewing, grain storage, and wastewater clarifiers. The conical bottom drains completely via gravity. Volume equals the sum of the conical hopper ((1/3) × π × r² × H_cone) and the upper cylindrical barrel.
              </li>
            </ul>

            <h2>Making and Reading a Dipstick Chart</h2>
            <p>
              Because horizontal tanks curve inward toward the top and bottom, dipping a measuring stick into the tank does not produce a linear reading. One inch of liquid near the center line (depth = 3 ft in a 6 ft tank) contains substantially more gallons than one inch at the bottom.
            </p>
            <p>
              Using the “Dipstick Chart” tab, you can generate a custom strapping table for any tank geometry to print or laminate for maintenance personnel.
            </p>

            <h2>What Size Tank Do I Need?</h2>
            <p>
              When planning an installation, size the tank by working backward from required storage volume:
            </p>
            <div className={styles.formulaBox}>
              Required Length = (Target Gallons ÷ 7.48052) ÷ (π × (Diameter ÷ 2)²)
            </div>
            <p>
              For additional volume conversions between gallons, cubic feet, and cubic yards, explore our <Link href="/gallons-to-cubic-feet/">Gallons to Cubic Feet Converter</Link>, <Link href="/pipe-volume-calculator/">Pipe Volume Calculator</Link>, <Link href="/cubic-yard-calculator/">Cubic Yard Calculator</Link>, and universal <Link href="/metric-conversion-calculator/">Metric Conversion Calculator</Link>.
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

        <HowWeCalculate slug="tank-volume-calculator" />
        <AdSlot slotId="tank-calc-ad-bottom" format="horizontal" />
      </div>
    </main>
  );
}
