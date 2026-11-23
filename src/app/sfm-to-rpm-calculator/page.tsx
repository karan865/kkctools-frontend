import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import SfmCalculator from '@/components/tool/sfm-to-rpm-calculator';
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

const route = ROUTES.sfmToRpmCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const faqs = [
  {
    q: 'How do I convert SFM to RPM?',
    a: 'Multiply Surface Feet per Minute (SFM) by 12, then divide by (π × Diameter in inches). The mathematical formula is RPM = (12 × SFM) ÷ (π × D). A common workshop approximation is RPM ≈ (SFM × 3.82) ÷ D.',
  },
  {
    q: 'How do I calculate RPM (revolutions per minute)?',
    a: 'In imperial machining: RPM = (12 × SFM) ÷ (π × D_inches). In metric machining: Spindle RPM = (1,000 × Vc in m/min) ÷ (π × D_mm). For pulleys and gears: RPM_driven = RPM_driver × (Driver_diameter ÷ Driven_diameter).',
  },
  {
    q: 'What does SFM (SFPM) mean?',
    a: 'SFM stands for Surface Feet per Minute (also abbreviated SFPM). It measures the linear distance in feet that a point on the outer perimeter of a rotating tool or workpiece travels in one minute.',
  },
  {
    q: 'How do I convert RPM to feet per minute?',
    a: 'Multiply spindle RPM by the circumference of the rotating cylinder in feet: Feet per Minute (SFM) = (π × Diameter in inches × RPM) ÷ 12. Alternatively, multiply RPM by diameter and 0.2618.',
  },
  {
    q: 'How do I convert m/min to SFM?',
    a: 'Multiply cutting speed in meters per minute (m/min or Vc) by 3.28084 to obtain SFM. Conversely, multiply SFM by 0.3048 to obtain m/min.',
  },
  {
    q: 'Why is the constant 3.82 (or 0.262)?',
    a: 'The number 12 divided by π (3.14159...) equals approximately 3.8197, rounded to 3.82 for mental shop math: RPM ≈ 3.82 × SFM ÷ D. In reverse, π divided by 12 is approximately 0.2618 (rounded to 0.262): SFM ≈ D × RPM × 0.262.',
  },
  {
    q: 'Which diameter do I use: tool or workpiece?',
    a: 'In milling and routing operations where the cutter spins, use the cutting tool diameter. In lathe turning operations where the raw stock spins against a stationary bit, use the workpiece outside diameter at the cut line.',
  },
  {
    q: 'How do I calculate conveyor or line speed from roller RPM?',
    a: 'Line speed is the linear travel of the conveyor belt per minute: Line Speed (ft/min) = [π × (Roller Diameter + Belt Thickness in inches) × Shaft RPM] ÷ 12. Multiply by (1 − Slip%) if friction loss occurs.',
  },
  {
    q: 'How does a gearbox change line speed?',
    a: 'A reduction gearbox reduces output shaft RPM while multiplying motor torque. If a motor spins at 1,750 RPM into a 10:1 reducer, the drive roller turns at 175 RPM, directly reducing belt line speed by a factor of 10.',
  },
  {
    q: 'What SFM should I use for aluminum, steel or stainless?',
    a: 'Use the surface speed from your cutting tool maker’s chart for that tool and material. It depends on the tool material, coating, coolant and the exact alloy, so this calculator doesn’t assume a value: enter the maker’s figure and it converts it to RPM for your diameter. Start at the conservative end and make a test cut.',
  },
  {
    q: "What if the RPM is above my machine's maximum?",
    a: 'When the theoretical RPM exceeds your spindle limits, cap your spindle at its physical maximum speed and reduce your axis feed rate proportionally to maintain proper chip load and prevent tool rubbing.',
  },
  {
    q: 'What is the difference between SFM and SCFM?',
    a: 'SFM (Surface Feet per Minute) measures linear velocity on a rotating circumference in machining. SCFM (Standard Cubic Feet per Minute) measures volumetric gas or compressed air flow under standardized temperature and atmospheric pressure.',
  },
];

export default function SfmCalculatorPage() {
  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'Tools', path: '/tools/' },
            { name: '3D Printing & CNC', path: '/tools/#engineering' },
            { name: 'SFM to RPM Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>SFM to RPM Calculator: Surface Speed, RPM and Feet per Minute</h1>
          <p className={styles.subtitle}>
            Convert Surface Feet per Minute (SFM) to spindle RPM for milling and lathe turning, calculate line speed for conveyor rollers, or generate a full speeds matrix.
          </p>

          <div className={styles.bluf}>
            <strong>Bottom Line Up Front (BLUF):</strong> RPM = (12 × SFM) ÷ (π × diameter in inches), about 3.82 × SFM ÷ D. A 0.5-inch tool at 300 SFM runs at 2,292 RPM; a 1-inch tool at 1,000 RPM moves at 261.8 surface feet per minute.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'SFM, RPM or diameter',
              'Inch & metric units',
              'Line speed mode',
              'Printable RPM chart',
            ]}
          >
            <SfmCalculator />
          </ToolShell>
        </div>

        <AdSlot slotId="sfm-calc-ad-mid" format="horizontal" />

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>1. How to Use the SFM Calculator</h2>
            <p>
              Surface speed is the foundational metric of modern machining science. Whether you are running an industrial machining center, an engine lathe, or a conveyor roller drive, our tool provides four specialized calculation modes:
            </p>
            <ul>
              <li>
                <strong>SFM → RPM:</strong> Enter cutter or workpiece diameter and your material&apos;s recommended surface feet per minute to calculate exact spindle RPM.
              </li>
              <li>
                <strong>RPM → SFM:</strong> Reverse-calculate peripheral surface speed and cutting velocity from a known tachometer or spindle speed.
              </li>
              <li>
                <strong>Belt &amp; Line Speed:</strong> Determine conveyor belt speed, web processing velocity, and peripheral roller speed with optional belt thickness, slip %, and gearbox reduction ratios.
              </li>
              <li>
                <strong>RPM Reference Chart:</strong> View, print, or export a complete RPM matrix cross-referencing standard inch and metric tool diameters across common cutting speeds.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>2. What is Surface Feet per Minute (SFM)?</h2>
            <p>
              Surface Feet per Minute (SFM or SFPM) is the measure of cutting speed that accounts for both rotational speed and the circumference of the tool. Specifically, it represents the linear distance in feet that a cutting tooth travels through the stock material in one minute.
            </p>
            <p>
              Tool manufacturers specify cutting parameters in SFM rather than RPM because a 0.125-inch miniature end mill and a 3.0-inch face mill rotating at the identical 5,000 RPM produce vastly different edge velocities:
            </p>
            <ul>
              <li>0.125&quot; end mill at 5,000 RPM travels at <strong>163.6 SFM</strong>.</li>
              <li>3.0&quot; face mill at 5,000 RPM travels at <strong>3,927.0 SFM</strong> (twenty-four times faster!).</li>
            </ul>
            <div className={styles.callout}>
              <strong>Note on Terminology:</strong> Do not confuse SFM (Surface Feet per Minute, a velocity) with <em>SCFM</em> (Standard Cubic Feet per Minute), which is a volumetric unit of pneumatic compressed air flow.
            </div>
          </section>

          <section className={styles.section}>
            <h2>3. SFM to RPM Formula</h2>
            <p>
              To derive spindle RPM from surface footage, divide total linear travel in inches per minute by the circumference of the circle:
            </p>
            <div className={styles.callout}>
              <strong>Exact Formula:</strong> Spindle RPM = (12 × SFM) ÷ (π × Tool Diameter in inches)<br />
              <strong>Shop Math Constant:</strong> Since 12 ÷ π ≈ 3.8197, machinists use: <code>RPM ≈ (SFM × 3.82) ÷ Diameter</code>
            </div>
            <p>
              <strong>Worked Example:</strong> Cutting 4140 pre-hardened steel with a 0.5-inch coated carbide end mill rated at 300 SFM:
              <br />
              <code>RPM = (12 × 300) ÷ (π × 0.5) = 3,600 ÷ 1.570796 = 2,292 RPM</code>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. RPM to SFM (Feet per Minute)</h2>
            <p>
              If your CNC lathe is running a workpiece at 1,000 RPM, how many surface feet per minute are passing the carbide insert? Reverse the formula:
            </p>
            <div className={styles.callout}>
              <strong>Exact Formula:</strong> SFM = (π × Diameter in inches × Spindle RPM) ÷ 12<br />
              <strong>Shop Constant:</strong> Since π ÷ 12 ≈ 0.2618, use: <code>SFM ≈ Diameter × RPM × 0.262</code>
            </div>
            <p>
              <strong>Worked Example:</strong> Turning a 1.0-inch diameter aluminum round bar at 1,000 RPM:
              <br />
              <code>SFM = (π × 1.0 × 1,000) ÷ 12 = 3,141.59 ÷ 12 = 261.8 SFM</code>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Metric: m/min to SFM and RPM</h2>
            <p>
              In ISO metric technical data sheets, cutting velocity is designated as <strong>Vc</strong> in meters per minute (m/min). The metric formulas are:
            </p>
            <div className={styles.callout}>
              <strong>Metric RPM:</strong> Spindle RPM = (1,000 × Vc in m/min) ÷ (π × Diameter in mm)<br />
              <strong>Metric Cutting Speed:</strong> Vc (m/min) = (π × Diameter in mm × RPM) ÷ 1,000<br />
              <strong>Unit Conversion:</strong> 1 m/min = 3.28084 SFM · 1 SFM = 0.3048 m/min
            </div>
            <p>
              A 12 mm end mill running at 180 m/min cutting speed turns at <code>(1,000 × 180) ÷ (π × 12) = 4,775 RPM</code>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Which Diameter to Use: Milling vs Lathe Turning</h2>
            <p>
              Selecting the proper reference diameter depends on your machine kinematics:
            </p>
            <ul>
              <li>
                <strong>Milling &amp; Routing:</strong> The cutter spins while the stock is clamped stationary. Always use the <em>outer cutting diameter of the end mill or router bit</em>.
              </li>
              <li>
                <strong>Lathe Turning:</strong> The workpiece spins in the chuck while the cutting tool is stationary. Always use the <em>current outside diameter of the workpiece at the cut line</em>. On CNC lathes equipped with Constant Surface Speed (CSS / G96), the spindle automatically accelerates as the diameter decreases toward center.
              </li>
              <li>
                <strong>Ball End Mills:</strong> When profiling shallow 3D contours, the effective cutting diameter is smaller than the nominal ball radius. Use the effective contact diameter to prevent tool rubbing.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>7. Line Speed from Roller RPM</h2>
            <p>
              In conveyor engineering, web printing presses, and belt drives, line speed represents the linear advance of the belt:
            </p>
            <div className={styles.callout}>
              <strong>Line Speed (ft/min)</strong> = [π × (Roller Diameter + Belt Thickness) × Shaft RPM ÷ 12] × (1 − Slip%) × Gearbox Ratio
            </div>
            <p>
              A 4-inch drive roller running at 100 RPM propels the belt at <code>(π × 4 × 100) ÷ 12 = 104.7 feet per minute</code> (or 31.9 m/min / 1.19 mph).
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Spindle RPM Reference Matrix</h2>
            <p>
              Review the matrix on Tab 4 of the calculator for quick workshop lookup. As tool diameter cuts in half, spindle RPM must double to sustain the same peripheral surface footage. Small tools (&lt; 1/4&quot;) demand high-RPM spindles, whereas large cutters (&gt; 1&quot;) require high-torque low-RPM gear ranges.
            </p>
          </section>

          {/* Related Tools Cross-Links */}
          <section className={styles.section}>
            <h2>Related CNC &amp; Machining Tools</h2>
            <p>Optimize your complete machining and workshop workflow:</p>
            <ul>
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
                <Link href="/epoxy-resin-calculator/">
                  <strong>Epoxy Resin Calculator:</strong>
                </Link>{' '}
                Calculate liquid epoxy volumes, pour depth layers, and mix ratios.
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

        <HowWeCalculate slug="sfm-to-rpm-calculator" />
      </div>

      <JsonLd data={buildWebApplicationSchema({ name: route.title, path: route.path, description: route.description })} />
      <JsonLd data={buildFaqSchema(faqs)} />
    </main>
  );
}
