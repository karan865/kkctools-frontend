import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import StepsCalculator from '@/components/tool/steps-per-mm-calculator';
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

const route = ROUTES.stepsPerMmCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const faqs = [
  {
    q: 'How do I calculate steps per mm for a GT2 belt with a 20-tooth pulley?',
    a: 'For a standard 1.8° stepper motor (200 full steps/rev) running at 16 microsteps with a GT2 belt (2 mm pitch) and 20-tooth pulley: Steps/mm = (200 × 16) ÷ (2 × 20) = 3,200 ÷ 40 = 80.00 steps per mm.',
  },
  {
    q: 'How do I calculate steps per mm for a lead screw (T8, multi-start)?',
    a: 'For a standard T8x8 lead screw (8 mm linear lead per revolution) with a 1.8° motor at 16 microsteps: Steps/mm = (200 × 16) ÷ 8 = 3,200 ÷ 8 = 400.00 steps per mm. For a T8x4 screw (4 mm lead), steps/mm is 800.00.',
  },
  {
    q: 'How do I calibrate extruder e-steps?',
    a: 'Measure and mark 120 mm on your filament from the extruder entrance. Command the printer to extrude 100 mm (G1 E100 F100). Measure the remaining distance from the entrance to your mark. If 25 mm remains, the printer extruded 95 mm (120 − 25). Calculate: New E-steps = Current E-steps × (100 ÷ Actual Extruded).',
  },
  {
    q: 'What is microstepping, and which setting should I use?',
    a: 'Microstepping electronically divides full mechanical motor steps by varying coil current sine waves, increasing positioning resolution and reducing mechanical vibration and noise. 1/16 microstepping is the industry standard for 8-bit and 32-bit motion boards. Higher microstepping (1/32, 1/64) runs quieter but increases step pulse frequency on your microcontroller.',
  },
  {
    q: 'How do I convert steps/mm to Klipper rotation_distance?',
    a: 'In Klipper firmware: rotation_distance = (full_steps_per_rotation × microsteps) ÷ steps_per_mm. For an 80 steps/mm axis with a 200-step motor and 16 microsteps: rotation_distance = (200 × 16) ÷ 80 = 40.000.',
  },
  {
    q: 'How do I save new values (M92, M500, M503)?',
    a: 'In Marlin or RepRapFirmware, send M92 followed by the axis letter and value (e.g. M92 E97.89), then send M500 to save the values to non-volatile EEPROM memory. Send M503 to verify that the stored settings loaded properly.',
  },
  {
    q: 'My parts are too big or too small: should I raise or lower steps/mm?',
    a: 'If a printed 20 mm test cube measures too small (e.g. 19.8 mm), you must RAISE your steps per mm so the axis moves further. If the cube measures too large (e.g. 20.2 mm), LOWER your steps per mm: New Steps = Current Steps × (Commanded ÷ Measured). Always check belt tension and eliminate mechanical backlash before altering linear axis steps.',
  },
  {
    q: 'What are the default e-steps for my printer?',
    a: 'Read the value your printer actually uses: send M503 (Marlin) and look for the E value on the M92 line, or check printer.cfg (Klipper). Defaults differ between printers, extruders and firmware builds, so don’t copy a number from another machine. If you know your extruder’s gear ratio and drive-gear diameter, the From hardware tab works out a starting value.',
  },
  {
    q: 'Should I calibrate e-steps hot or cold?',
    a: 'Follow the calibration guide you use (for example your printer maker’s or a well-known tuning guide). A common method is to heat the hotend to printing temperature and extrude slowly, so back-pressure doesn’t skew the result; another is to remove the nozzle or tube and measure extrusion in free air. Use the same method each time you re-check.',
  },
  {
    q: "E-steps vs flow rate: what's the difference?",
    a: 'E-steps is a fixed physical machine calibration of your stepper motor teeth and filament drive gear circumference. Flow rate (extrusion multiplier in your slicer) is a per-spool tuning variable that compensates for filament diameter tolerance and material expansion.',
  },
  {
    q: 'How do I calibrate a 3D printer (e-steps, flow, axes, bed)?',
    a: 'Always calibrate in proper sequence: 1) Bed leveling and Z-offset; 2) Extruder physical E-steps; 3) Temperature PID tuning; 4) Filament flow rate (extrusion multiplier); 5) Linear axes dimensional verification.',
  },
  {
    q: 'What does a stepper motor calculator compute (step angle, RPM, pulse rate)?',
    a: 'It links rotational electromechanical parameters (step angle, microstepping, and motor RPM) to physical linear mechanics (lead screw pitch, belt pulley tooth pitch) and computes MCU pulse frequency (Hz) at peak axis speed.',
  },
];

export default function StepsCalculatorPage() {
  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'Tools', path: '/tools/' },
            { name: '3D Printing & CNC', path: '/tools/#engineering' },
            { name: 'Steps per mm Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>Steps per mm Calculator: Stepper Motors, E-steps and Calibration</h1>
          <p className={styles.subtitle}>
            Calculate exact stepper motor steps per millimeter for timing belt axes, lead screws, and extruders, or calibrate physical E-steps and test cubes with copy-ready Marlin, Klipper, and GRBL commands.
          </p>

          <div className={styles.bluf}>
            <strong>Bottom Line Up Front (BLUF):</strong> Steps per mm = (motor steps per revolution × microsteps) ÷ (belt pitch × pulley teeth). A 1.8° motor at 16 microsteps with a GT2 belt and 20-tooth pulley needs 80 steps/mm. To fix e-steps: new = current × requested ÷ measured.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Belt, lead screw & extruder',
              'E-steps & axis calibration',
              'Marlin, Klipper & GRBL lines',
              'Copy-ready G-code',
            ]}
          >
            <StepsCalculator />
          </ToolShell>
        </div>

        <AdSlot slotId="steps-calc-ad-mid" format="horizontal" />

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>1. How to Use the Stepper Motor Calculator</h2>
            <p>
              Accurate motion calibration is required for dimensional accuracy in 3D printing, laser engraving, and CNC routing. Our calculator handles five essential motion configurations:
            </p>
            <ul>
              <li>
                <strong>Belt Axis (X / Y / CoreXY):</strong> Enter motor step angle, driver microstepping, belt tooth pitch (e.g. GT2 2 mm), and pulley tooth count.
              </li>
              <li>
                <strong>Lead Screw (Z Axis / CNC Z):</strong> Enter lead screw lead in mm per revolution (or pitch and thread starts) to solve vertical travel steps.
              </li>
              <li>
                <strong>E-Steps Calibration:</strong> Perform the physical 100 mm extrusion test using a ruler mark to eliminate under-extrusion and over-extrusion.
              </li>
              <li>
                <strong>Axis Calibration:</strong> Fine-tune printed test cube dimensions (measured vs commanded).
              </li>
              <li>
                <strong>Extruder Hardware:</strong> Determine theoretical steps per mm from gear reduction ratios (BMG, Titan) and hobbed drive gear effective pitch diameter.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>2. Steps per mm for Belt-Driven Axes</h2>
            <p>
              Linear motion in timing belt systems converts rotational steps into forward linear advance:
            </p>
            <div className={styles.callout}>
              <strong>Formula:</strong> Steps/mm = (Steps per Revolution × Microsteps) ÷ (Belt Pitch in mm × Pulley Teeth)<br />
              <strong>Steps per Revolution</strong> = 360° ÷ Step Angle (200 for 1.8°, 400 for 0.9°)
            </div>
            <p>
              <strong>Worked Example:</strong> A standard 1.8° stepper motor with 16 microsteps, running a 2 mm pitch GT2 belt around a 20-tooth aluminum timing pulley:
              <br />
              <code>Steps/mm = (200 × 16) ÷ (2.0 mm × 20 teeth) = 3,200 ÷ 40 = 80.00 steps per mm</code>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Steps per mm for Lead Screws</h2>
            <p>
              Lead screw driven axes (such as the Z-axis on bed flingers and CNC gantries) advance by their linear lead on each 360° rotation:
            </p>
            <div className={styles.callout}>
              <strong>Formula:</strong> Steps/mm = (Steps per Revolution × Microsteps) ÷ Lead in mm<br />
              <strong>Note on Lead vs Pitch:</strong> Lead = Pitch × Number of Thread Starts. Standard T8 lead screws have 2 mm pitch with 4 starts, yielding an <strong>8 mm lead</strong>.
            </div>
            <p>
              For a T8x8 lead screw on a 1.8° motor at 16 microsteps:
              <br />
              <code>Steps/mm = (200 × 16) ÷ 8.0 mm = 3,200 ÷ 8 = 400.00 steps per mm</code>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. How to Calibrate Extruder E-Steps</h2>
            <p>
              Calibrating extruder steps per mm ensures that when your slicer requests 100 mm of plastic, exactly 100 mm of raw filament enters the drive gears:
            </p>
            <ol>
              <li>Preheat your hotend to printing temperature (e.g. 200°C for PLA) or detach the Bowden tube.</li>
              <li>Using digital calipers or a steel ruler, make a distinct mark on the filament exactly 120 mm above the extruder intake.</li>
              <li>Through your machine control screen or OctoPrint terminal, command 100 mm of extrusion: <code>G1 E100 F100</code>.</li>
              <li>Measure the remaining distance between the intake and your mark.</li>
              <li>Calculate actual extruded length: <code>Actual = 120 mm − Remaining Distance</code>.</li>
              <li>Calculate new E-steps: <code>New E-Steps = Current E-Steps × (100 ÷ Actual Extruded)</code>.</li>
            </ol>
            <p>
              <strong>Worked Example:</strong> If current E-steps is 93.0 and remaining distance is 25.0 mm (meaning actual extruded was 95.0 mm):
              <br />
              <code>New E-Steps = 93.0 × (100 ÷ 95.0) = 97.89 steps per mm</code>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Calibration Order: E-steps, Flow, then Axes</h2>
            <p>
              Calibrating in the incorrect order leads to compounded error:
            </p>
            <ul>
              <li>
                <strong>Step 1: Extruder E-steps:</strong> Calibrate physical filament feed distance. This is a hardware constant that does not change between slicer profiles.
              </li>
              <li>
                <strong>Step 2: Slicer Flow Rate (Extrusion Multiplier):</strong> Tune extrusion volume per material to account for filament diameter tolerances and thermal die swell.
              </li>
              <li>
                <strong>Step 3: Mechanical Axes:</strong> Verify that belts are properly tensioned, lead screw couplers are tight, and frame is square before adjusting X/Y/Z steps.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>6. Axis Calibration with a Test Cube</h2>
            <p>
              If a printed 20 × 20 × 20 mm calibration cube measures 19.80 mm along the X-axis:
            </p>
            <div className={styles.callout}>
              <strong>New Axis Steps/mm</strong> = Current Steps/mm × (Commanded Dimension ÷ Measured Dimension)<br />
              <code>New Steps = 80.00 × (20.00 ÷ 19.80) = 80.81 steps/mm</code>
            </div>
            <p>
              <em>Crucial caveat:</em> Never use axis step calibration to compensate for material shrinkage or loose belts. Fix belt tension and mechanical play first; steps/mm calculated from the belt pitch, pulley teeth and microsteps is usually right, so recalibrate only after ruling those out.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Marlin, Klipper and GRBL: Entering the Values</h2>
            <div className={styles.tableWrap}>
              <table className={styles.contentTable}>
                <thead>
                  <tr>
                    <th>Firmware</th>
                    <th>Configuration Format</th>
                    <th>Permanent Save Method</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Marlin / RRF</strong></td>
                    <td><code>M92 X80.00 Y80.00 Z400.00 E97.89</code></td>
                    <td>Send <code>M500</code> to store in EEPROM (read with <code>M503</code>)</td>
                  </tr>
                  <tr>
                    <td><strong>Klipper</strong></td>
                    <td><code>rotation_distance: 40.000</code> in <code>printer.cfg</code></td>
                    <td>Save configuration and issue <code>RESTART</code></td>
                  </tr>
                  <tr>
                    <td><strong>GRBL CNC</strong></td>
                    <td><code>$100=80.000</code> (X), <code>$101=80.000</code> (Y), <code>$102=400.000</code> (Z)</td>
                    <td>Automatically written to non-volatile controller memory</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <h2>8. Microstepping and Positioning Resolution</h2>
            <p>
              Linear resolution represents the smallest discrete distance an axis can advance for each step pulse sent by your controller:
            </p>
            <div className={styles.callout}>
              <strong>Resolution (µm)</strong> = (1 ÷ Steps per mm) × 1,000
            </div>
            <p>
              At 80 steps per mm, the single-step resolution is <code>1 ÷ 80 = 0.0125 mm = 12.5 microns</code>. Microstepping improves motion smoothness and eliminates resonance peaks; however, incremental positioning holding torque between full step detents decreases as microstep divisors increase.
            </p>
          </section>

          {/* Related Tools Cross-Links */}
          <section className={styles.section}>
            <h2>Related Maker &amp; Engineering Tools</h2>
            <p>Explore our complete manufacturing and 3D fabrication suite:</p>
            <ul>
              <li>
                <Link href="/3d-print-cost-calculator/">
                  <strong>3D Print Cost Calculator:</strong>
                </Link>{' '}
                Estimate filament, resin, electricity, wear, and pricing markup for 3D prints.
              </li>
              <li>
                <Link href="/pulley-calculator/">
                  <strong>Pulley Calculator:</strong>
                </Link>{' '}
                Calculate pulley speed ratios, belt lengths, centre distances, and multi-stage drives.
              </li>
              <li>
                <Link href="/speeds-and-feeds-calculator/">
                  <strong>Speeds and Feeds Calculator:</strong>
                </Link>{' '}
                Calculate tooth chip load, feed rate (IPM), radial chip thinning, and material removal rates.
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

        <HowWeCalculate slug="steps-per-mm-calculator" />
      </div>

      <JsonLd data={buildWebApplicationSchema({ name: route.title, path: route.path, description: route.description })} />
      <JsonLd data={buildFaqSchema(faqs)} />
    </main>
  );
}
