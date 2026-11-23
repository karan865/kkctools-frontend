import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import SpeedsFeedsCalculator from '@/components/tool/speeds-and-feeds-calculator';
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

const route = ROUTES.speedsAndFeedsCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const faqs = [
  {
    q: 'How do you calculate spindle RPM from surface speed?',
    a: 'In imperial units, Spindle RPM = (12 × SFM) ÷ (π × Tool Diameter in inches). A practical workshop approximation is (SFM × 3.82) ÷ Tool Diameter. In metric units, Spindle RPM = (1,000 × Vc in m/min) ÷ (π × Tool Diameter in mm), or approximately (Vc × 318.3) ÷ Tool Diameter.',
  },
  {
    q: 'How do you calculate feed rate (IPM or mm/min)?',
    a: 'Feed rate is calculated by multiplying Spindle RPM by the number of cutting flutes (teeth) and the chip load per tooth: Feed Rate (IPM) = RPM × Flutes × Chip Load (in/tooth). In metric: Feed Rate (mm/min) = RPM × Flutes × Chip Load (mm/tooth).',
  },
  {
    q: 'What is chip load, and how do I calculate it?',
    a: 'Chip load (feed per tooth or fz) is the physical thickness of material sheared off by each individual cutting edge as it sweeps through the workpiece. If you know your machine feed rate and RPM, you can reverse-calculate chip load: Chip Load = Feed Rate ÷ (RPM × Number of Flutes).',
  },
  {
    q: "What if the calculated RPM is higher than my machine's maximum?",
    a: 'If your calculated RPM exceeds your spindle ceiling, cap your spindle at its maximum rating and re-scale your feed rate downward using Feed = Max_RPM × Flutes × Target_Chip_Load. This maintains proper tooth chip thickness and prevents catastrophic tool rubbing and thermal wear.',
  },
  {
    q: 'Why is my cut making dust, burning or chattering?',
    a: 'Dust and burning indicate that chip load is too thin—the tool edge is scraping and friction-heating rather than cutting clean chips (cure: increase feed or drop RPM). Chatter and screaming indicate tool deflection, excessive stickout, loose workholding, or an overloaded flute gullet (cure: reduce depth of cut or check tool stickout).',
  },
  {
    q: 'What chip load should I use for wood, MDF, acrylic and aluminum on a router?',
    a: 'Use the chip load from your cutter maker’s chart for that exact tool (diameter, flute count, coating) and material. It varies a lot between tools, so this calculator doesn’t assume one: enter the maker’s starting value, make a test cut, then adjust. Dust or burning usually means the chip is too thin (feed up or RPM down); chatter or a squealing tool usually means it is too heavy.',
  },
  {
    q: 'How does carbide vs HSS or a coating change SFM?',
    a: 'Solid carbide tools generally withstand 2× to 3× higher surface speeds (SFM) than High-Speed Steel (HSS) because carbide retains hot hardness up to 800°C–1000°C. Advanced PVD coatings like TiAlN (Titanium Aluminum Nitride) or AlTiN allow another 20% to 50% increase in SFM by forming an aluminum oxide thermal barrier in high-temperature metal cuts.',
  },
  {
    q: 'What is radial chip thinning (high speed machining)?',
    a: 'When radial width of cut (stepover / WOC) is less than 50% of cutter diameter, the cutter centerline never enters the cut, and the maximum chip thickness generated is physically thinner than the programmed linear advance. To maintain true chip thickness and avoid rubbing, multiply programmed feed by the thinning factor: D ÷ [2 × √(D × WOC − WOC²)].',
  },
  {
    q: 'How do I calculate drilling feed per revolution?',
    a: 'Drilling feed is programmed as Feed Rate = Spindle RPM × Feed per Revolution (IPR or mm/rev). For twist drills with 2 cutting lips, chip load per lip is simply half of the feed per revolution (IPR ÷ 2).',
  },
  {
    q: 'How do I calculate tapping feed rate?',
    a: 'For unified inch threads: Feed Rate (IPM) = Spindle RPM × (1 ÷ TPI). For metric threads: Feed Rate (mm/min) = Spindle RPM × Thread Pitch (mm). Linear axis travel must stay precisely synchronized to spindle rotation during rigid tapping.',
  },
  {
    q: 'How do I convert SFM to m/min?',
    a: 'Multiply Surface Feet per Minute (SFM) by 0.3048 to obtain cutting speed in meters per minute (Vc). Conversely, multiply meters per minute by 3.28084 to obtain SFM.',
  },
  {
    q: 'How does depth of cut change feeds, MRR and power?',
    a: 'Axial Depth of Cut (DOC) and radial Width of Cut (WOC) determine Material Removal Rate: MRR = WOC × DOC × Feed Rate. Increasing DOC increases spindle horsepower torque requirements and tool bending deflection without altering per-tooth chip thickness.',
  },
  {
    q: 'Where do cutting-data charts come from, and can I trust them?',
    a: 'Tool maker cutting charts originate from controlled dynamometer laboratory tests measuring cutting forces, tool wear progression, and temperature rise in specific alloy grades. Always treat catalog charts as baseline starting values; adjust for your specific machine rigidity, workholding setup, and tool stickout.',
  },
];

export default function SpeedsFeedsCalculatorPage() {
  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'Tools', path: '/tools/' },
            { name: '3D Printing & CNC', path: '/tools/#engineering' },
            { name: 'Speeds and Feeds Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>Speeds and Feeds Calculator: CNC Spindle RPM, Feed Rate and Chip Load</h1>
          <p className={styles.subtitle}>
            Comprehensive machining calculator for CNC milling, CNC wood routers, drilling, and rigid tapping. Calculate exact spindle RPM, table feed rate, radial chip thinning, and material removal rates.
          </p>

          <div className={styles.bluf}>
            <strong>Bottom Line Up Front (BLUF):</strong> RPM = (12 × SFM) ÷ (π × tool diameter), and feed rate = RPM × flutes × chip load. A 1/2-inch 3-flute end mill at 600 SFM runs 4,584 RPM; at 0.002 in per tooth that&apos;s a 27.5 IPM feed.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Mill, router, drill & tap',
              'Machine-limit scaling',
              'Chip thinning',
              'Inch or metric',
            ]}
          >
            <SpeedsFeedsCalculator />
          </ToolShell>
        </div>

        <AdSlot slotId="speeds-feeds-ad-mid" format="horizontal" />

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>1. How to Use the Feeds and Speeds Calculator</h2>
            <p>
              Dialing in the correct speeds and feeds is the single most important factor for achieving superior surface finish, tight dimensional tolerances, and long tool life in CNC machining. Our calculator is engineered to handle four core machining workflows:
            </p>
            <ul>
              <li>
                <strong>CNC Milling (Metals &amp; Engineering Plastics):</strong> Dial in end mill diameter, flutes, surface speed (SFM), and per-tooth chip load. The engine computes spindle RPM, table feed (IPM / mm/min), and material removal rate (MRR).
              </li>
              <li>
                <strong>CNC Router (Wood, MDF, Acrylic &amp; Aluminum):</strong> Tailored for high-RPM router spindles (10,000–24,000 RPM) with single, double, or upcut/downcut spiral geometries.
              </li>
              <li>
                <strong>Drilling:</strong> Work out twist drill spindle speeds from surface feet per minute and calculate axial feed rates from feed-per-revolution (IPR).
              </li>
              <li>
                <strong>Tapping:</strong> Synchronize spindle RPM with imperial threads per inch (TPI) or metric thread pitch (mm) for rigid tapping cycles.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>2. Spindle Speed (RPM) from Surface Speed</h2>
            <p>
              Spindle speed defines how fast the tool or workpiece rotates to achieve the manufacturer&apos;s recommended peripheral cutting velocity (Surface Feet per Minute or SFM). The mathematical formula is:
            </p>
            <div className={styles.callout}>
              <strong>Imperial:</strong> Spindle RPM = (12 × SFM) ÷ (π × Tool Diameter in inches)<br />
              <strong>Practical Workshop Shortcut:</strong> RPM ≈ (SFM × 3.82) ÷ Tool Diameter<br />
              <strong>Metric (ISO):</strong> Spindle RPM = (1,000 × Vc in m/min) ÷ (π × Tool Diameter in mm)
            </div>
            <p>
              For example, a 0.5-inch end mill run at 600 SFM (an example value; use your tool maker&apos;s figure for your material) needs <code>(12 × 600) ÷ (π × 0.5) = 7,200 ÷ 1.5708 = 4,584 RPM</code>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. How to Calculate Feed Rate</h2>
            <p>
              Feed rate is the linear velocity at which the machine axis moves the cutting tool through the stock material. It is directly proportional to spindle RPM, the number of cutting flutes on the cutter, and the desired chip thickness per tooth:
            </p>
            <div className={styles.callout}>
              <strong>Feed Rate (IPM)</strong> = Spindle RPM × Number of Flutes × Chip Load (inches/tooth)<br />
              <strong>Feed Rate (mm/min)</strong> = Spindle RPM × Number of Flutes × Chip Load (mm/tooth)
            </div>
            <p>
              Using our 4,584 RPM spindle speed on a 3-flute end mill with an example chip load of 0.002 inches per tooth gives:
              <br />
              <code>Feed Rate = 4,584 RPM × 3 flutes × 0.002 in/tooth = 27.50 Inches Per Minute (IPM)</code> (or 698.5 mm/min).
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Chip Load: What It Is and Why It Matters</h2>
            <p>
              Chip load (feed per tooth, or <em>fz</em>) represents the physical thickness of the metal or wood chip sheared off by each tooth during one revolution. Maintaining the proper chip load is critical for heat evacuation: roughly 80% of cutting friction heat is carried away in the sheared chip itself.
            </p>
            <ul>
              <li>
                <strong>Chip Load Too Low (Rubbing):</strong> When feed rate is too slow for the spindle RPM, the cutting edge rubs against the stock instead of shearing a clean chip. This causes intense friction heat, edge dulling, work hardening, and surface burning.
              </li>
              <li>
                <strong>Chip Load Too High (Overload):</strong> When feed rate is too fast, the physical chip volume exceeds the flute gullet capacity, leading to tool deflection, chatter, surface gouging, and catastrophic end mill breakage.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Chip Thinning and High Speed Machining</h2>
            <p>
              Radial chip thinning occurs whenever the radial width of cut (stepover or WOC) is less than 50% of the cutter diameter (WOC &lt; D/2). As stepover decreases, the cutter tooth enters and exits the cut before reaching maximum chip thickness. The actual chip produced is significantly thinner than the programmed linear advance.
            </p>
            <div className={styles.callout}>
              <strong>Radial Chip Thinning Factor:</strong> Factor = Cutter Diameter ÷ [2 × √(D × WOC − WOC²)]<br />
              <strong>Adjusted Feed Rate:</strong> Feed<sub>adj</sub> = Programmed Feed × Factor
            </div>
            <p>
              In high speed machining (HSM) dynamic trochoidal toolpaths with 10% radial stepover, the thinning factor is approximately 1.67×. Compensating with a higher table feed maintains correct chip thickness and prevents tool rubbing.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Speeds and Feeds for CNC Routers</h2>
            <p>
              Hobby and industrial CNC wood routers operate under different physical constraints than rigid metal-cutting vertical machining centers (VMCs). Router spindles usually run fast with little low-end torque, so check your spindle&apos;s own RPM range and enter it under machine limits.
            </p>
            <ul>
              <li>
                <strong>Single Flute (O-Flute) Cutters:</strong> Often chosen for plastics and soft metals on fast router spindles. With fewer flutes, each tooth takes a bigger chip at the same RPM and feed (chip load = feed ÷ (RPM × flutes)), which helps when your machine can&apos;t feed fast enough for a multi-flute cutter.
              </li>
              <li>
                <strong>Upcut vs Downcut Bits:</strong> Upcut spirals evacuate chips upward toward dust collectors (ideal for deep pockets and mortises). Downcut spirals force chips downward to deliver razor-clean top veneer surfaces without tearout.
              </li>
              <li>
                <strong>Compression Bits:</strong> Feature an upcut tip and downcut upper body, creating opposing shear vectors that keep both top and bottom laminates clean in melamine and double-sided plywood.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>7. Drill Speeds and Feeds</h2>
            <p>
              Drilling requires balancing surface speed at the drill perimeter with linear penetration per revolution:
            </p>
            <div className={styles.callout}>
              <strong>Drill Feed Rate (IPM)</strong> = Spindle RPM × Feed per Revolution (IPR)<br />
              <strong>Drill Feed Rate (mm/min)</strong> = Spindle RPM × Feed per Revolution (mm/rev)
            </div>
            <p>
              Because standard twist drills feature two cutting lips, the chip load per lip is simply <code>IPR ÷ 2</code>. For holes deeper than 3× tool diameter, incorporate peck drilling cycles (G83 / G73) to break stringy chips and clear flutes.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Tapping Feed Rate</h2>
            <p>
              In CNC rigid tapping, the spindle rotation and Z-axis feed must stay mathematically locked to prevent thread stripping:
            </p>
            <ul>
              <li><strong>Inch Taps (UNC / UNF):</strong> Feed Rate (IPM) = Spindle RPM × (1 ÷ TPI)</li>
              <li><strong>Metric Taps (ISO M-Profile):</strong> Feed Rate (mm/min) = Spindle RPM × Metric Pitch (mm)</li>
            </ul>
            <p>
              For a 1/4-20 UNC tap running at 500 RPM, the synchronous feed rate is <code>500 × (1 ÷ 20) = 25.00 IPM</code>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Machine Limits: When Your Spindle Can&apos;t Reach the RPM</h2>
            <p>
              Small desktop CNC mills and gearhead machines often cannot reach the RPM that a small-diameter cutter needs at its rated surface speed. When your spindle hits its maximum RPM, the calculator does this for you:
            </p>
            <ol>
              <li>Cap the spindle speed at your machine&apos;s physical maximum RPM.</li>
              <li>Recompute your feed rate using that maximum RPM: <code>Feed = Max_RPM × Flutes × Target_Chip_Load</code>.</li>
              <li>Never keep feed rate high while reducing RPM, as this causes catastrophic flute overload and tool snap.</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2>10. Troubleshooting Your Cut: Symptoms &amp; Fixes</h2>
            <div className={styles.tableWrap}>
              <table className={styles.contentTable}>
                <thead>
                  <tr>
                    <th>Symptom</th>
                    <th>Probable Cause</th>
                    <th>Remedy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Burning / Scorching / Smoke</strong></td>
                    <td>Too high RPM, too slow feed, or dull bit (rubbing)</td>
                    <td>Increase feed rate or decrease spindle RPM; inspect cutting edge</td>
                  </tr>
                  <tr>
                    <td><strong>Chatter / High Vibration</strong></td>
                    <td>Tool deflection, excessive stickout, loose fixture</td>
                    <td>Reduce depth of cut (DOC), shorten cutter stickout, increase workpiece clamping rigidity</td>
                  </tr>
                  <tr>
                    <td><strong>Melted Plastic / Clogged Flutes</strong></td>
                    <td>Frictional heat welding chips into cutter flutes</td>
                    <td>Switch to single-flute O-flute bit, increase feed per tooth, add compressed air blast</td>
                  </tr>
                  <tr>
                    <td><strong>Premature Tool Wear</strong></td>
                    <td>Improper surface speed (SFM) or chip thinning rubbing</td>
                    <td>Lower SFM; apply chip thinning compensation factor on light stepover passes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Related Tools Cross-Links */}
          <section className={styles.section}>
            <h2>Related Engineering &amp; CNC Tools</h2>
            <p>Explore our complete suite of manufacturing and precision calculation tools:</p>
            <ul>
              <li>
                <Link href="/sfm-to-rpm-calculator/">
                  <strong>SFM to RPM Calculator:</strong>
                </Link>{' '}
                Convert surface feet per minute to spindle RPM for any diameter, with line speed and RPM matrix.
              </li>
              <li>
                <Link href="/3d-print-cost-calculator/">
                  <strong>3D Print Cost Calculator:</strong>
                </Link>{' '}
                Price filament, resin, machine depreciation, and labor for 3D prints.
              </li>
              <li>
                <Link href="/epoxy-resin-calculator/">
                  <strong>Epoxy Resin Calculator:</strong>
                </Link>{' '}
                Calculate exact liquid epoxy volume, deep pour schedules, and mix ratios.
              </li>
              <li>
                <Link href="/epoxy-table-calculator/">
                  <strong>Epoxy River Table Calculator:</strong>
                </Link>{' '}
                Plan live-edge river tables, multi-point channel profiles, and flood coats.
              </li>
              <li>
                <Link href="/tools/#engineering">
                  <strong>3D Printing &amp; CNC Hub:</strong>
                </Link>{' '}
                Explore all engineering, stepper motor, pulley drive, and thread calculation tools.
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

        <HowWeCalculate slug="speeds-and-feeds-calculator" />
      </div>

      <JsonLd data={buildWebApplicationSchema({ name: route.title, path: route.path, description: route.description })} />
      <JsonLd data={buildFaqSchema(faqs)} />
    </main>
  );
}
