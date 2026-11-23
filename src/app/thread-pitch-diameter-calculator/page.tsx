import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import ThreadCalculator from '@/components/tool/thread-pitch-diameter-calculator';
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

const route = ROUTES.threadPitchDiameterCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const faqs = [
  {
    q: 'What is the pitch diameter of a thread?',
    a: 'The pitch diameter (effective diameter, d₂ for external or D₂ for internal) is the diameter of an imaginary coaxial cylinder that cuts through the thread flanks at the exact depth where the width of the thread ridge equals the width of the intervening thread groove.',
  },
  {
    q: 'How do you calculate pitch diameter (formula)?',
    a: 'For standard 60° V-threads (ISO Metric and Unified UN/UNC/UNF): Pitch Diameter = Major Diameter − [2 × (3/8) × H] = Major Diameter − (0.649519 × Pitch). For an M10 × 1.5 bolt: d₂ = 10 − (0.6495 × 1.5) = 9.026 mm.',
  },
  {
    q: 'What is the difference between major, minor and pitch diameter?',
    a: 'Major diameter (d / D) is the largest outside diameter measured across thread crests on a bolt. Minor diameter (d₁/d₃ / D₁) is the smallest root diameter at the bottom of the thread valley. Pitch diameter lies halfway down the flanks and determines thread fit, pitch engagement, and strength.',
  },
  {
    q: 'How do I measure pitch diameter (three-wire method)?',
    a: 'Place three precision ground pins (wires) of known diameter W into the thread grooves—two wires on one side and one wire on the opposite side. Measure the outside distance M over the wires with a micrometer. For 60° threads, the basic pitch diameter is: d₂ = M − 3W + (0.86603 × Pitch).',
  },
  {
    q: 'How is pitch diameter measured on Acme threads?',
    a: 'On 29° Acme threads, pitch diameter is measured using the three-wire method or thread micrometers. The best wire size for 29° Acme is W = 0.51645 × Pitch, and measurement over wires M = d₂ + 4.99393W − 1.93336P.',
  },
  {
    q: 'What tap drill size do I need for a given % thread?',
    a: 'In metric units: Tap Drill Size (mm) = Nominal Tap Diameter − (0.01299 × Target % Thread × Pitch). For imperial threads: Tap Drill (in) = Nominal Tap Diameter − (0.01299 × Target % Thread ÷ TPI). A 75% thread is standard for general steel and aluminum.',
  },
  {
    q: 'What do 6g/6H and 2A/2B mean?',
    a: 'They designate manufacturing tolerance classes. In ISO metric: lowercase letters (e.g. 6g) denote external male bolts, while uppercase letters (e.g. 6H) denote internal female tapped nuts. In American Unified threads: 2A denotes standard commercial bolts, and 2B denotes mating nuts.',
  },
  {
    q: 'Pitch vs TPI: how do I convert?',
    a: 'To convert Threads Per Inch to metric pitch: Pitch (mm) = 25.4 ÷ TPI. To convert metric pitch to TPI: TPI = 25.4 ÷ Pitch (mm). For example, 20 TPI equals 25.4 ÷ 20 = 1.27 mm pitch.',
  },
  {
    q: 'What is the blank diameter for rolled threads?',
    a: 'Because thread rolling displaces rather than cuts metal, the raw unthreaded blank rod diameter must roughly equal the thread pitch diameter (d₂), rather than the finished major diameter. Consult thread roll die manufacturer charts for precise alloy tolerances.',
  },
  {
    q: 'Thread pitch diameter vs gear pitch diameter',
    a: 'On screw threads, pitch diameter is the cylinder where ridge and groove widths are equal. On spur gears or timing pulleys, pitch diameter is the theoretical diameter where two meshing gears roll together without slipping.',
  },
  {
    q: 'Why are my calculated values different from a chart?',
    a: 'Our calculator outputs the theoretical "basic" size (zero clearance/tolerance). Industrial handbook charts show maximum and minimum manufacturing limits after applying class clearances (such as 2A allowance on bolts to prevent binding).',
  },
];

export default function ThreadCalculatorPage() {
  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'Tools', path: '/tools/' },
            { name: '3D Printing & CNC', path: '/tools/#engineering' },
            { name: 'Thread Pitch Diameter Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>Thread Pitch Diameter Calculator: UN, Metric and Acme Threads</h1>
          <p className={styles.subtitle}>
            Calculate exact basic pitch diameter, minor root diameters, and tap drill sizes for Unified (UNC/UNF), ISO Metric, Acme 29°, and Trapezoidal 30° screw threads.
          </p>

          <div className={styles.bluf}>
            <strong>Bottom Line Up Front (BLUF):</strong> Pitch diameter is the diameter where a thread&apos;s ridge and groove are equally wide. For 60° UN and metric threads, basic pitch diameter = major diameter − 0.6495 × pitch, so an M10 × 1.5 thread has a pitch diameter of 9.026 mm.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'UN, metric & Acme',
              'Tap drill for any % thread',
              'Three-wire helper',
              'Inch & mm',
            ]}
          >
            <ThreadCalculator />
          </ToolShell>
        </div>

        <AdSlot slotId="thread-calc-ad-mid" format="horizontal" />

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>1. What is Pitch Diameter?</h2>
            <p>
              In fastener engineering and precision machining, <strong>pitch diameter</strong> (effective diameter, denoted <em>d₂</em> for external bolts and <em>D₂</em> for internal nuts) is the theoretical cylinder where the physical thickness of the thread tooth ridge is exactly equal to the width of the space (groove) between teeth.
            </p>
            <p>
              While major diameter defines whether a bolt will pass through a clearance hole, pitch diameter dictates mechanical engagement, shear strength, and backlash between mating threads.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. How to Use the Thread Calculator</h2>
            <p>Our tool covers four essential precision machining workflows:</p>
            <ul>
              <li>
                <strong>Pitch Diameter:</strong> Work out basic major, pitch, and minor diameters for ISO Metric, Unified National (UNC / UNF / UNEF), Acme 29°, and Trapezoidal 30° profiles.
              </li>
              <li>
                <strong>Tap Drill Size:</strong> Determine the theoretical tap drill diameter for any percentage thread engagement (default 75%), alongside nearest standard workshop drill bits.
              </li>
              <li>
                <strong>Three-Wire Measurement:</strong> Calculate the best wire diameter (0.57735 × P) and the target micrometer measurement <em>M</em> over wires for external threads.
              </li>
              <li>
                <strong>Pitch ↔ TPI:</strong> Fast bidirectional conversion between metric pitch (mm) and imperial threads per inch.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. Pitch Diameter Formula for UN and Metric Threads</h2>
            <p>
              Both ISO metric (ISO 68-1) and American Unified threads (ASME B1.1) share the fundamental 60° symmetrical triangular thread form. The height of the fundamental sharp-V triangle is:
            </p>
            <div className={styles.callout}>
              <code>H = (√3 ÷ 2) × Pitch ≈ 0.866025 × Pitch</code>
            </div>
            <p>
              The pitch diameter line lies at a radial depth of <code>(3 ÷ 8) × H</code> below the sharp apex on each side (totaling <code>3/4 H</code> across the diameter):
            </p>
            <div className={styles.callout}>
              <strong>Basic Pitch Diameter Formula:</strong><br />
              <code>d₂ = d − [2 × (3 ÷ 8) × H] = d − (0.649519 × Pitch)</code>
            </div>
            <p>
              <strong>Worked Examples:</strong>
            </p>
            <ul>
              <li>
                <strong>M10 × 1.5 Metric:</strong> <code>d₂ = 10 − (0.649519 × 1.5) = 10 − 0.9743 = 9.026 mm</code>.
              </li>
              <li>
                <strong>1/4-20 UNC:</strong> Pitch = 1 ÷ 20 = 0.050 in. <code>d₂ = 0.250 − (0.649519 × 0.050) = 0.2175 in</code>.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Minor and Major Diameters: Internal vs External</h2>
            <p>
              Because internal and external threads must mate without interference at the root and crest, minor diameters are calculated with specific truncation standards:
            </p>
            <ul>
              <li>
                <strong>External Bolt Minor Diameter (d₃ / ISO rounded root):</strong> Truncated by H/6 at the root to reduce stress concentration:
                <br />
                <code>d₃ = d − (1.226869 × Pitch)</code> (For M10×1.5: <code>10 − 1.840 = 8.160 mm</code>).
              </li>
              <li>
                <strong>Internal Nut Minor Diameter (D₁):</strong> Truncated by H/4 at the crest:
                <br />
                <code>D₁ = D − (1.082532 × Pitch)</code> (For M10×1.5: <code>10 − 1.624 = 8.376 mm</code>).
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Tap Drill Size for a Target % Thread Engagement</h2>
            <p>
              Tap drill charts are commonly based on about <strong>75% thread</strong>. More thread engagement means a smaller drill and more tapping effort; less means an easier cut and a shallower thread. Set the percentage your job or standard calls for:
            </p>
            <div className={styles.callout}>
              <strong>Metric Tap Drill (mm)</strong> = Nominal Tap Diameter − (0.01299 × %Thread × Pitch)<br />
              <strong>Imperial Tap Drill (in)</strong> = Nominal Tap Diameter − (0.01299 × %Thread ÷ TPI)
            </div>
            <p>
              For an M10 × 1.5 thread at 75%:
              <br />
              <code>Tap Drill = 10 − (0.01299 × 75 × 1.5) = 10 − 1.461 = 8.539 mm</code>.
              <br />
              The nearest standard workshop drill is <strong>8.5 mm</strong>, which yields a healthy 77.0% thread engagement.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Measuring Pitch Diameter: The Three-Wire Method</h2>
            <p>
              Because caliper jaws cannot reach inside V-grooves accurately, machinists measure external threads using three precision ground pins (wires) calibrated to contact the flanks at the pitch line:
            </p>
            <div className={styles.callout}>
              <strong>Best Wire Diameter (60° thread):</strong> <code>W_best = (Pitch ÷ 2) × sec(30°) ≈ 0.57735 × Pitch</code><br />
              <strong>Measurement Over Wires (M):</strong> <code>M = d₂ + 3W − (1.51554 × Pitch)</code>
            </div>
            <p>
              For our M10 × 1.5 bolt:
              <br />
              <code>Best Wire = 0.57735 × 1.5 = 0.866 mm</code>.
              <br />
              <code>M = 9.026 + (3 × 0.866) − (1.51554 × 1.5) = 9.026 + 2.598 − 2.273 = 9.350 mm</code>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Acme 29° and Trapezoidal 30° Power Screws</h2>
            <p>
              Unlike V-threads used for clamping, lead screws on machine tool slides require flat-crest profiles with high load-bearing capacity:
            </p>
            <ul>
              <li>
                <strong>Acme 29° (American Standard):</strong> Features a 29° included angle. Basic pitch diameter is <code>d₂ = d − 0.5 × Pitch</code>.
              </li>
              <li>
                <strong>Trapezoidal 30° (ISO 2901 Metric):</strong> Features a 30° included angle. Basic pitch diameter is <code>d₂ = d − 0.5 × Pitch</code>.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>8. Thread Classes and Tolerances (2A/2B and 6g/6H)</h2>
            <p>
              Real-world threads are manufactured within tolerance bands specified by standards organizations:
            </p>
            <ul>
              <li>
                <strong>ASME B1.1 Classes (Unified):</strong> Class 1A/1B (loose fit for quick assembly), Class 2A/2B (standard commercial bolts and nuts), Class 3A/3B (close tolerance for aerospace).
              </li>
              <li>
                <strong>ISO 965 Classes (Metric):</strong> External threads (lowercase, e.g. 6g) provide an allowance gap; internal threads (uppercase, e.g. 6H) have zero fundamental deviation.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>9. Thread vs Gear vs Pulley Pitch Diameter</h2>
            <p>
              The term <em>pitch diameter</em> is used across multiple mechanical domains with distinct physical meanings:
            </p>
            <ul>
              <li><strong>Screw Thread:</strong> Diameter where ridge thickness equals groove space.</li>
              <li><strong>Spur Gear:</strong> Theoretical diameter of the pitch circle where gear teeth roll smoothly without slipping.</li>
              <li><strong>Timing Pulley / V-Belt Sheave:</strong> Effective diameter at the neutral bending line of the belt cords (see our <Link href="/pulley-calculator/">Pulley Calculator</Link>).</li>
            </ul>
          </section>

          {/* Related Tools Cross-Links */}
          <section className={styles.section}>
            <h2>Related Engineering &amp; CNC Tools</h2>
            <p>Explore our full manufacturing and workshop calculation suite:</p>
            <ul>
              <li>
                <Link href="/speeds-and-feeds-calculator/">
                  <strong>Speeds and Feeds Calculator:</strong>
                </Link>{' '}
                Determine rigid tapping spindle RPM and feed rates for inch and metric threads.
              </li>
              <li>
                <Link href="/pulley-calculator/">
                  <strong>Pulley Calculator:</strong>
                </Link>{' '}
                Calculate pulley speed ratios, belt lengths, centre distances, and multi-stage drives.
              </li>
              <li>
                <Link href="/steps-per-mm-calculator/">
                  <strong>Steps per mm Calculator:</strong>
                </Link>{' '}
                Calibrate lead screw Z-axes, timing belts, and 3D printer extruders.
              </li>
              <li>
                <Link href="/sfm-to-rpm-calculator/">
                  <strong>SFM to RPM Calculator:</strong>
                </Link>{' '}
                Convert surface feet per minute to spindle RPM and roller line speeds.
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

        <HowWeCalculate slug="thread-pitch-diameter-calculator" />
      </div>

      <JsonLd data={buildWebApplicationSchema({ name: route.title, path: route.path, description: route.description })} />
      <JsonLd data={buildFaqSchema(faqs)} />
    </main>
  );
}
