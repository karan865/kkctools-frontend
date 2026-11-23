import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PulleyCalculator from '@/components/tool/pulley-calculator';
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

const route = ROUTES.pulleyCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const faqs = [
  {
    q: 'How do I calculate pulley ratio?',
    a: 'Pulley ratio is determined by dividing the driven pulley pitch diameter by the driver pulley pitch diameter: Ratio = D_driven ÷ D_driver. For example, a 4-inch driven pulley powered by a 2-inch driver pulley produces a 2:1 speed reduction (doubling output torque while halving shaft RPM).',
  },
  {
    q: 'How do I find the driven pulley speed (RPM)?',
    a: 'Driven shaft speed is calculated by multiplying driver RPM by the driver diameter and dividing by the driven diameter: Driven RPM = (Driver RPM × Driver Diameter) ÷ Driven Diameter. Multiply by (1 − Slip%) if using non-positive V-belts or flat belts.',
  },
  {
    q: 'What pulley size do I need for a target RPM?',
    a: 'To achieve a specific output RPM on your machine shaft, solve for driven diameter: Driven Diameter = (Driver RPM × Driver Diameter) ÷ Target RPM. If sizing the motor pulley instead: Driver Diameter = (Driven RPM × Driven Diameter) ÷ Motor RPM.',
  },
  {
    q: 'How do I calculate belt speed?',
    a: 'Belt linear velocity is dictated purely by the driver pulley diameter and its rotational speed: Belt Speed (ft/min) = (π × Driver Diameter in inches × Driver RPM) ÷ 12. Because the belt forms a closed continuous loop, its linear speed is identical across both pulleys.',
  },
  {
    q: 'How do I calculate belt length for two pulleys?',
    a: 'For an open (non-crossed) belt: Length = 2C + [π × (D1 + D2) ÷ 2] + [(D2 − D1)² ÷ (4C)], where C is shaft centre distance, D1 is driver pitch diameter, and D2 is driven pitch diameter.',
  },
  {
    q: 'Does a bigger pulley increase torque?',
    a: 'Yes. Increasing the driven pulley diameter reduces output rotational speed while proportionally multiplying mechanical torque (Torque_output = Torque_motor × Ratio × Efficiency). Conversely, increasing the driver pulley creates an overdrive that increases speed at the expense of torque.',
  },
  {
    q: 'What centre distance do I need for my belt?',
    a: 'If you already own a stock belt of length L, the required shaft centre distance C is solved using the quadratic relation C = [K + √(K² − 2Δ²)] ÷ 4, where K = L − [π × (D1 + D2) ÷ 2] and Δ = |D2 − D1|.',
  },
  {
    q: 'Should I use outside or pitch diameter?',
    a: 'Always use pitch diameter (PD) for accurate speed and ratio calculations. The pitch line is the neutral axis of the belt cords where tension is transmitted without stretching or compressing. For V-belts, pitch diameter is slightly smaller than outside rim diameter (OD).',
  },
  {
    q: 'How do I calculate a two-stage (compound) pulley drive?',
    a: 'Multiply the individual stage ratios together: Total Ratio = (D2a ÷ D1a) × (D2b ÷ D1b). The final output shaft RPM equals Motor RPM ÷ Total Ratio. Compound drives achieve massive 10:1 to 50:1 reductions in compact machine footprints.',
  },
  {
    q: 'How do I convert wheel RPM to mph?',
    a: 'Vehicle linear speed in miles per hour is calculated from tire diameter and axle rotation: Speed (mph) = (Axle RPM × π × Wheel Diameter in inches × 60) ÷ 63,360. A 26-inch bicycle wheel spinning at 200 RPM travels at 15.47 mph (24.90 km/h).',
  },
  {
    q: 'How much does belt slip reduce speed?',
    a: 'Toothed timing belts don’t slip. V-belts and flat belts can creep a little under load, which makes the driven pulley turn slightly slower than the ratio says. How much depends on the belt, tension and load, so enter your own slip percentage (or measure the driven RPM with a tachometer and compare).',
  },
  {
    q: 'How do I slow down a drill press, lathe or router spindle with pulleys?',
    a: 'To reduce spindle speed for drilling large metal holes or turning large wood bowls, install a smaller pulley on the motor shaft and a larger stepped pulley on the machine spindle. A 2:1 diameter increase cuts spindle RPM in half while doubling available cutting torque.',
  },
];

export default function PulleyCalculatorPage() {
  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'Tools', path: '/tools/' },
            { name: '3D Printing & CNC', path: '/tools/#engineering' },
            { name: 'Pulley Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>Pulley Ratio Calculator: Driven Speed, Pulley Size and Belt Speed</h1>
          <p className={styles.subtitle}>
            Comprehensive mechanical drive calculator for two-pulley systems, stock belt length and centre distance, multi-stage compound reductions, and wheel RPM to vehicle mph.
          </p>

          <div className={styles.bluf}>
            <strong>Bottom Line Up Front (BLUF):</strong> Driven RPM = driver RPM × driver diameter ÷ driven diameter. A 2-inch pulley at 1,725 RPM turning a 4-inch pulley gives 862.5 RPM, a 2:1 reduction, and the belt runs at about 903 feet per minute.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Solve any pulley value',
              'Belt length & centre distance',
              'Multi-stage drives',
              'Live diagram',
            ]}
          >
            <PulleyCalculator />
          </ToolShell>
        </div>

        <AdSlot slotId="pulley-calc-ad-mid" format="horizontal" />

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>1. How to Use the Pulley Ratio Calculator</h2>
            <p>
              Pulley systems are fundamental mechanical power transmission drives found in drill presses, lathes, air compressors, table saws, and conveyor systems. Our tool supports four specialized calculation workflows:
            </p>
            <ul>
              <li>
                <strong>Pulley Speed &amp; Size:</strong> Select any variable to solve for: driven shaft speed, driver motor speed, or required pulley diameters for a target RPM.
              </li>
              <li>
                <strong>Belt Length &amp; Centre Distance:</strong> Calculate exact open and crossed belt lengths from shaft centres, or reverse-calculate the required centre distance to fit a standard off-the-shelf belt.
              </li>
              <li>
                <strong>Multi-Stage Drives:</strong> Model 2-stage and 3-stage compound countershaft pulley arrangements with total reduction ratios and intermediate shaft RPMs.
              </li>
              <li>
                <strong>Wheel RPM to Speed:</strong> Convert wheel or roller rotation into vehicle ground velocity (mph / km/h).
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>2. Pulley Ratio Formula: Reduction vs Overdrive</h2>
            <p>
              In mechanical power transmission, the speed ratio expresses the proportional change in velocity between the driving motor and the driven machine shaft:
            </p>
            <div className={styles.callout}>
              <strong>Diameter Ratio (i)</strong> = D₂ (Driven Diameter) ÷ D₁ (Driver Diameter)<br />
              <strong>Driven Speed (N₂)</strong> = N₁ (Driver RPM) ÷ Ratio = N₁ × (D₁ ÷ D₂)<br />
              <strong>Mechanical Torque Ratio</strong> = Output Torque ≈ Motor Torque × (D₂ ÷ D₁) × Efficiency
            </div>
            <ul>
              <li>
                <strong>Speed Reduction (D₂ &gt; D₁):</strong> The driven pulley is larger than the motor pulley. Output speed decreases while mechanical torque multiplies (e.g. 2:1 reduction cuts speed in half and doubles torque).
              </li>
              <li>
                <strong>Overdrive (D₂ &lt; D₁):</strong> The driven pulley is smaller than the motor pulley. Output speed increases while torque decreases (e.g. 1:2 step-up doubles output RPM).
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. Pulley Speed: Finding the Driven RPM</h2>
            <p>
              Because the linear surface speed of the belt must match the peripheral speed of both pulleys, the product of diameter and RPM is conserved across the drive:
            </p>
            <div className={styles.callout}>
              <code>D₁ × N₁ = D₂ × N₂</code>
            </div>
            <p>
              <strong>Worked Example:</strong> A standard 4-pole electric motor running at 1,725 RPM is equipped with a 2-inch driver pulley powering a 4-inch driven pulley on an air compressor pump:
              <br />
              <code>Driven RPM = (2 in × 1,725 RPM) ÷ 4 in = 862.5 RPM</code> (a 2:1 reduction).
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Pulley Size for a Target RPM</h2>
            <p>
              When modifying shop tools (such as slowing down a high-speed wood lathe to safely turn large out-of-balance bowls), you often know your target spindle RPM and need to find the necessary pulley diameter:
            </p>
            <div className={styles.callout}>
              <strong>Required Driven Pulley Diameter (D₂)</strong> = (Driver RPM × Driver Diameter) ÷ Target Driven RPM
            </div>
            <p>
              If your motor turns at 1,725 RPM with a 2.5-inch pulley and you need exactly 500 RPM on your drill press spindle:
              <br />
              <code>D₂ = (1,725 × 2.5) ÷ 500 = 8.625 inches</code>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Belt Speed (and Why It Doesn&apos;t Change with Driven Size)</h2>
            <p>
              A common misconception among beginner machinists is that changing the driven pulley size changes the speed of the belt. <strong>In physics, belt speed is fixed exclusively by the driver pulley.</strong>
            </p>
            <div className={styles.callout}>
              <strong>Linear Belt Speed (ft/min)</strong> = (π × D_driver in inches × Motor RPM) ÷ 12
            </div>
            <p>
              For our 2-inch driver at 1,725 RPM:
              <br />
              <code>Belt Speed = (π × 2 × 1,725) ÷ 12 = 903.2 feet per minute</code> (4.59 m/s).
              <br />
              Swapping the driven pulley from 4 inches to 8 inches or 12 inches will change the driven shaft RPM, but the belt continues to travel at exactly 903.2 ft/min.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Belt Length and Centre Distance Formulas</h2>
            <p>
              The pitch length of an open continuous belt connecting two pulleys separated by shaft centre distance <em>C</em> is calculated using standard ANSI/RMA engineering geometry:
            </p>
            <div className={styles.callout}>
              <strong>Open Belt Length (L)</strong> = 2C + [π × (D₁ + D₂) ÷ 2] + [(D₂ − D₁)² ÷ (4C)]<br />
              <strong>Crossed Belt Length (L)</strong> = 2C + [π × (D₁ + D₂) ÷ 2] + [(D₁ + D₂)² ÷ (4C)]
            </div>
            <p>
              For 2-inch and 4-inch pulleys spaced at a 20-inch centre distance:
              <br />
              <code>L = 2(20) + [π × (2 + 4) ÷ 2] + [(4 − 2)² ÷ (4 × 20)] = 40 + 9.425 + 0.05 = 49.47 inches</code>.
            </p>
            <p>
              <strong>Wrap Angle:</strong> The small pulley wrap angle is <code>180° − 2 × arcsin[(D₂ − D₁) ÷ (2C)] = 174.3°</code>. Less wrap on the small pulley means less grip; if your drive slips, a longer centre distance or an idler adds wrap. Check your belt maker&apos;s minimum.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Multi-Stage Compound Pulley Drives</h2>
            <p>
              When a single-stage pulley pair would require an impractically large driven wheel (e.g., trying to achieve a 10:1 reduction in a compact drill press housing), compound multi-stage jackshafts are used:
            </p>
            <ul>
              <li><strong>Stage 1:</strong> Motor pulley (2&quot;) drives jackshaft driven pulley (4&quot;) → 2:1 reduction.</li>
              <li><strong>Stage 2:</strong> Jackshaft driver pulley (3&quot;) drives spindle pulley (6&quot;) → 2:1 reduction.</li>
              <li><strong>Overall Ratio:</strong> 2:1 × 2:1 = <strong>4:1 total reduction</strong> (1,800 RPM motor outputs 450 RPM).</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>8. Wheel RPM to Vehicle Speed (mph)</h2>
            <p>
              Calculating ground velocity from wheel diameter and axle RPM is identical to pulley rim speed converted to miles per hour:
            </p>
            <div className={styles.callout}>
              <strong>Velocity (mph)</strong> = (Axle RPM × π × Wheel Diameter in inches × 60) ÷ 63,360
            </div>
            <p>
              A 26-inch bicycle wheel at 200 RPM: <code>(200 × π × 26 × 60) ÷ 63,360 = 15.47 mph</code> (24.90 km/h).
            </p>
          </section>

          {/* Related Tools Cross-Links */}
          <section className={styles.section}>
            <h2>Related Engineering &amp; CNC Tools</h2>
            <p>Explore our complete suite of manufacturing and precision engineering calculators:</p>
            <ul>
              <li>
                <Link href="/sfm-to-rpm-calculator/">
                  <strong>SFM to RPM Calculator:</strong>
                </Link>{' '}
                Convert surface feet per minute to spindle RPM and roller line speeds.
              </li>
              <li>
                <Link href="/speeds-and-feeds-calculator/">
                  <strong>Speeds and Feeds Calculator:</strong>
                </Link>{' '}
                Calculate tooth chip load, feed rate (IPM), radial chip thinning, and material removal rates.
              </li>
              <li>
                <Link href="/3d-print-cost-calculator/">
                  <strong>3D Print Cost Calculator:</strong>
                </Link>{' '}
                Estimate filament, resin, electricity, and machine wear costs.
              </li>
              <li>
                <Link href="/tools/#engineering">
                  <strong>3D Printing &amp; CNC Hub:</strong>
                </Link>{' '}
                Explore all engineering, stepper calibration, pulley drive, and thread calculation tools.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Frequently Asked Questions</h2>
            <div className="faqGrid">
              {faqs.map((faq, idx) => (
                <div key={idx} className="faqItem">
                  <h3 className="faqQuestion">{faq.q}</h3>
                  <p className="faqAnswer">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        <HowWeCalculate slug="pulley-calculator" />
      </div>

      <JsonLd data={buildWebApplicationSchema({ name: route.title, path: route.path, description: route.description })} />
      <JsonLd data={buildFaqSchema(faqs)} />
    </main>
  );
}
