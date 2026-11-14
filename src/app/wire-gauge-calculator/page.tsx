import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import WireGaugeCalculator from '@/components/tool/wire-gauge-calculator';
import { CircuitDiagram, GaugeScaleDiagram, TwoChecksDiagram } from '@/components/tool/wire-gauge-calculator/WireDiagram';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  AWG_SIZES,
  M_PER_FT,
  conductorById,
  currentFromPower,
  nearestMetricUp,
  resistancePerM,
  sizeWire,
  type SizeInput,
} from '@/lib/wire-gauge-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.wireGaugeCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

// ---------- every number below is computed by the same engine as the tool ----------
const n = (v: number, dp = 0) => v.toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: dp });
const base: SizeInput = {
  sizeSystem: 'awg',
  system: 'ac1',
  volts: 120,
  amps: 20,
  oneWayM: 100 * M_PER_FT,
  maxDropPct: 3,
  continuous: false,
  metal: 'cu',
  insulation: 75,
  terminal: 60,
  ambientC: 30,
  conductors: 3,
};
const size = (over: Partial<SizeInput>) => sizeWire({ ...base, ...over });
const label = (r: ReturnType<typeof sizeWire>) => (r.chosen ? r.chosen.label.replace(' AWG', '') : '—');

const ex120 = size({});
const exShort = size({ oneWayM: 15 * M_PER_FT });
const exCont = size({ oneWayM: 15 * M_PER_FT, continuous: true });
const exDc = size({ system: 'dc', volts: 12, amps: 20, oneWayM: 15 * M_PER_FT, terminal: 75 });
const exMetric = size({ sizeSystem: 'mm2', volts: 230, amps: 16, oneWayM: 30 });
const exThree = size({ system: 'ac3', volts: 400, amps: currentFromPower(15000, 400, 'ac3', 0.9), oneWayM: 50, sizeSystem: 'mm2' });
const exAl = size({ amps: 100, oneWayM: 50 * M_PER_FT, terminal: 75, metal: 'al', volts: 240 });
const exCu = size({ amps: 100, oneWayM: 50 * M_PER_FT, terminal: 75, volts: 240 });

// size by current alone (very short run)
const byAmps = [15, 20, 30, 40, 50, 60, 70, 100, 125, 150, 200].map((a) => ({
  a,
  t60: size({ amps: a, oneWayM: 0.01, terminal: 60 }),
  t75: size({ amps: a, oneWayM: 0.01, terminal: 75 }),
  al75: size({ amps: a, oneWayM: 0.01, terminal: 75, metal: 'al' }),
}));
const distFt = [25, 50, 100, 150, 200];
const byDistance = [
  { v: 120, a: 15 },
  { v: 120, a: 20 },
  { v: 240, a: 20 },
  { v: 240, a: 30 },
  { v: 240, a: 50 },
].map((row) => ({ ...row, cells: distFt.map((d) => size({ volts: row.v, amps: row.a, oneWayM: d * M_PER_FT, terminal: row.a > 30 ? 75 : 60 })) }));
const dcFt = [5, 10, 15, 25];
const dcRows = [5, 10, 20, 30, 50, 100].map((a) => ({
  a,
  cells: dcFt.map((d) => size({ system: 'dc', volts: 12, amps: a, oneWayM: d * M_PER_FT, terminal: 75 })),
}));
const awgTable = AWG_SIZES.slice(0, 13).map((c) => ({ c, metric: nearestMetricUp(c.areaMm2), r: resistancePerM(c, 'cu')! * 304.8 }));
const lad = ex120.rows.slice(0, 9).map((r) => r.c.label);
const idx = (id?: string) => ex120.rows.findIndex((r) => r.c.id === id);
const r30 = byAmps.find((x) => x.a === 30)!;
const r50 = byAmps.find((x) => x.a === 50)!;
const r100 = byAmps.find((x) => x.a === 100)!;
const a14 = conductorById('awg14')!.amp!.cu;
const a12 = conductorById('awg12')!.amp!.cu;
const a10 = conductorById('awg10')!.amp!.cu;

// ---------- FAQ ----------
const faqs = [
  {
    q: 'What size wire do I need for 30 amps?',
    a: `For copper on a typical branch circuit, ${label(r30.t60)} AWG — its rating is 30 A in the 60 °C column, and 10 AWG copper may be protected at up to 30 A. Long runs need a larger wire to keep the voltage drop under 3%; enter your distance in the calculator.`,
  },
  {
    q: 'What size wire do I need for 50 amps?',
    a: `Copper ${label(r50.t75)} AWG where the terminals are rated 75 °C, or ${label(r50.t60)} AWG with 60 °C terminals; aluminium ${label(r50.al75)} AWG at 75 °C. Distance can push it up — a 50 A, 240 V run of 100 ft needs ${label(byDistance[4].cells[2])} AWG copper to stay under 3%.`,
  },
  {
    q: 'What size wire do I need for 100 amps?',
    a: `By current alone, ${label(r100.t75)} AWG copper or ${label(r100.al75)} AWG aluminium with 75 °C terminals. Service and feeder conductors for dwellings can be sized under special NEC rules, so a 100 A service is a job for your electrician and the local inspector.`,
  },
  {
    q: 'How do you calculate voltage drop?',
    a: 'For DC and single-phase circuits, voltage drop = 2 × current × resistance per foot (or metre) × one-way length — the 2 counts the wire out and back. For three-phase, use √3 instead of 2. Divide by the supply voltage for the percentage.',
  },
  {
    q: 'What voltage drop is acceptable?',
    a: 'A common target is 3% on a branch circuit and 5% for feeder and branch together, from an informational note in the NEC. It is guidance, not a rule in most cases, but lower drop means equipment runs better. Low-voltage DC systems often aim for 2–3% or less.',
  },
  {
    q: 'What size wire for 12 V DC?',
    a: `Much bigger than at 120 V, because each volt lost is a bigger share. A 20 A, 12 V load 15 ft away needs ${label(exDc)} AWG copper to stay within 3%; the same current at 120 V over the same distance needs only ${label(exShort)} AWG. Use the 12 V table on this page or the calculator.`,
  },
  {
    q: 'How many amps can 14, 12 and 10 AWG copper carry?',
    a: `From NEC Table 310.16 at 30 °C: 14 AWG ${a14[0]}/${a14[1]}/${a14[2]} A, 12 AWG ${a12[0]}/${a12[1]}/${a12[2]} A and 10 AWG ${a10[0]}/${a10[1]}/${a10[2]} A in the 60/75/90 °C columns. But the breaker is limited to 15 A, 20 A and 30 A for these sizes (NEC 240.4(D)).`,
  },
  {
    q: 'How do I convert AWG to mm²?',
    a: 'AWG area in mm² = π ÷ 4 × (0.127 mm × 92^((36 − AWG) ÷ 39))². 12 AWG is 3.31 mm² and 10 AWG is 5.26 mm². Metric cable comes in fixed sizes (1.5, 2.5, 4, 6, 10 mm²…), so round up to the next size: 12 AWG ≈ 4 mm².',
  },
  {
    q: 'Can I use aluminium wire instead of copper?',
    a: `Yes, if it is rated for the job and the terminals are listed for aluminium. Aluminium conducts about 61% as well as copper, so it needs to be larger — for 100 A at 240 V over 50 ft, ${exAl.chosen?.label ?? '—'} aluminium versus ${exCu.chosen?.label ?? '—'} copper.`,
  },
  {
    q: 'What is the difference between wire gauge and wire size in mm²?',
    a: 'They measure the same thing — the conductor’s cross-section — in two systems. AWG is a number where smaller means thicker; mm² is the area itself. The US uses AWG and kcmil; most of the world uses mm².',
  },
  {
    q: 'Does this calculator replace an electrician?',
    a: 'No. It is a planning tool. Real installations depend on the cable type, how it is installed, local code, equipment ratings and inspection. Use it to understand the numbers, then have a licensed electrician design or check the circuit.',
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Wire Gauge Calculator',
  path: route.path,
  description:
    'Free wire gauge calculator: suggested AWG or mm² wire size from amps (or watts), voltage and distance, with voltage drop, NEC ampacity with temperature and bundling corrections, breaker size, a voltage-drop check and an AWG gauge lookup.',
});
const faqSchema = buildFaqSchema(faqs);

export default function WireGaugeCalculatorPage() {
  return (
    <>
      <JsonLd data={[webAppSchema, faqSchema]} />
      <main id="main-content" className={styles.main}>
        <Breadcrumbs items={[{ name: 'Tools', path: '/tools/' }, { name: 'Wire Gauge Calculator', path: route.path }]} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Wire Gauge Calculator: Wire Size by Amps, Voltage &amp; Distance</h1>
          <p className={styles.lead}>
            This free <strong>wire gauge calculator</strong> suggests a wire size — in AWG or mm² — from the current (or watts), the voltage and the
            length of the run. It checks the two things that matter: the <strong>voltage drop</strong> over the distance and the{' '}
            <strong>current rating</strong> of the wire with temperature and bundling corrections, then picks the larger and suggests a breaker. You can also
            check a wire you already have, or look up any gauge’s diameter, area and resistance. DC, single-phase and three-phase are all covered.
          </p>
          <p className={styles.meta}>
            Last updated: {new Date(route.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} ·
            Runs in your browser — nothing you enter is sent anywhere.
          </p>
        </header>

        <section aria-label="Wire gauge calculator tool">
          <WireGaugeCalculator />
        </section>

        <div className={styles.adBlock}>
          <AdSlot slotId="wire-gauge-calculator-middle" />
        </div>

        <article className={styles.article}>
          <h2>How to use the wire size calculator</h2>
          <ol>
            <li>
              <strong>Choose what you need:</strong> size a new wire, check one you already have, or look up a gauge.
            </li>
            <li>
              <strong>Set the circuit:</strong> DC, AC single-phase or three-phase, and the voltage (12/24/48 V, 120/230/240 V, 208/400/480 V or your own).
            </li>
            <li>
              <strong>Enter the load and the one-way distance.</strong> Use amps, or watts and the calculator works out the current. The return conductor
              is added for you.
            </li>
            <li>
              <strong>Pick copper or aluminium and AWG or mm².</strong> For AWG, set the insulation and terminal ratings, the room temperature and how many
              current-carrying wires run together.
            </li>
            <li>
              <strong>Read the suggested size</strong>, the voltage drop and the voltage left at the load, which check controls, and a breaker size. Then have
              an electrician confirm it.
            </li>
          </ol>

          <h2>How wire size is worked out: two checks</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <TwoChecksDiagram sizes={lad} dropIndex={idx(ex120.byDrop?.id)} ampIndex={idx(ex120.byAmpacity?.id)} chosenIndex={idx(ex120.chosen?.id)} />
              <figcaption>
                20 A at 120 V over 100 ft: current alone needs {ex120.byAmpacity?.label}, but voltage drop needs {ex120.byDrop?.label} — so{' '}
                {ex120.chosen?.label} it is.
              </figcaption>
            </figure>
            <div>
              <p>
                <strong>1. Current rating (ampacity).</strong> A wire carrying more current than it is rated for runs hot. NEC Table 310.16 lists ratings
                for 60, 75 and 90 °C insulation at 30 °C. Hot rooms and many wires bundled together lower the rating, and the result can’t be higher than
                the temperature rating of the terminals it connects to. Loads that run for 3 hours or more are sized at 125%.
              </p>
              <p>
                <strong>2. Voltage drop.</strong> Every foot of wire has resistance, so some voltage is lost on the way. On a long run the wire must be
                bigger than the current alone needs, so the motor, light or charger at the end still gets enough voltage.
              </p>
              <p>
                The calculator works out both and uses the <strong>larger</strong> size. On short runs the current rating usually decides; on long or
                low-voltage runs, voltage drop does.
              </p>
            </div>
          </div>

          <h2>Voltage drop formula</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <CircuitDiagram lengthLabel="100 ft one way" ampsLabel="20 A" sourceLabel="120 V" dropLabel={`${n(ex120.chosenRow!.dropPct, 1)}%`} loadLabel={`${n(120 - ex120.chosenRow!.dropV, 1)} V`} />
              <figcaption>Current flows out and back, so a single-phase or DC circuit has twice the one-way length of wire.</figcaption>
            </figure>
            <div>
              <code className={styles.formula}>
                DC and single-phase: VD = 2 × I × R × L
                <br />
                Three-phase: VD = √3 × I × R × L
                <br />
                Drop % = VD ÷ supply voltage × 100
              </code>
              <p>
                I is the current, L the one-way length and R the resistance of one conductor per foot or metre. <strong>Example:</strong> 20 A over 100
                ft on {ex120.chosen?.label} copper (about {n(resistancePerM(ex120.chosen!, 'cu')! * 304.8, 3)} Ω per 1,000 ft at 75 °C): 2 × 20 ×{' '}
                {n(resistancePerM(ex120.chosen!, 'cu')! * 304.8, 3)} ÷ 1,000 × 100 = <strong>{n(ex120.chosenRow!.dropV, 2)} V</strong>, or{' '}
                {n(ex120.chosenRow!.dropPct, 2)}% of 120 V. On 12 AWG the same run would lose {n(ex120.rows.find((r) => r.c.id === 'awg12')!.dropPct, 1)}%.
              </p>
            </div>
          </div>
          <div className={styles.examples}>
            <div className={styles.exampleCard}>
              <h3>Short kitchen circuit</h3>
              <p className={styles.exampleMeta}>20 A · 120 V · 15 ft · copper</p>
              <ul>
                <li>
                  Use <strong>{exShort.chosen?.label}</strong> on a {exShort.breaker} A breaker
                </li>
                <li>Drop: {n(exShort.chosenRow!.dropPct, 2)}% — current rating controls</li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>Same circuit, continuous load</h3>
              <p className={styles.exampleMeta}>20 A × 125% = {n(exCont.requiredAmps)} A</p>
              <ul>
                <li>
                  Use <strong>{exCont.chosen?.label}</strong> on a {exCont.breaker} A breaker
                </li>
                <li>Loads on for 3+ hours are sized at 125%</li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>Metric socket circuit</h3>
              <p className={styles.exampleMeta}>16 A · 230 V · 30 m · copper</p>
              <ul>
                <li>
                  Voltage drop needs <strong>{exMetric.chosen?.label}</strong>
                </li>
                <li>Drop: {n(exMetric.chosenRow!.dropPct, 2)}%. Check current capacity for your installation method (BS 7671 / IEC 60364)</li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>Three-phase motor feed</h3>
              <p className={styles.exampleMeta}>15 kW · 400 V · pf 0.9 · 50 m</p>
              <ul>
                <li>Current: {n(currentFromPower(15000, 400, 'ac3', 0.9), 1)} A</li>
                <li>
                  Voltage drop needs <strong>{exThree.chosen?.label}</strong> ({n(exThree.chosenRow!.dropPct, 2)}%)
                </li>
                <li>Motor circuits follow special rules (NEC Article 430, BS 7671) — use the nameplate current</li>
              </ul>
            </div>
          </div>

          <h2>Wire size by amps</h2>
          <p>
            Smallest copper and aluminium size by current rating alone (NEC Table 310.16, 30 °C, no more than 3 current-carrying conductors, and a standard
            breaker that fits). Distance is not included here — long runs need larger wire. Circuits over 100 A are terminated at 75 °C (NEC
            110.14(C)(1)(b)), so the 60 °C column stops at 100 A.
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Load</th>
                  <th scope="col">Copper, 60 °C terminals</th>
                  <th scope="col">Copper, 75 °C terminals</th>
                  <th scope="col">Aluminium, 75 °C terminals</th>
                </tr>
              </thead>
              <tbody>
                {byAmps.map((r) => (
                  <tr key={r.a}>
                    <td>{r.a} A</td>
                    <td>{r.a <= 100 ? (r.t60.chosen?.label ?? '—') : '— (use 75 °C)'}</td>
                    <td>{r.t75.chosen?.label ?? '—'}</td>
                    <td>{r.al75.chosen?.label ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Wire gauge by length: how distance changes the size</h2>
          <p>Copper AWG needed to stay within 3% voltage drop, single-phase, one-way distance (current rating also checked).</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Circuit</th>
                  {distFt.map((d) => (
                    <th scope="col" key={d}>
                      {d} ft
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {byDistance.map((row) => (
                  <tr key={`${row.v}-${row.a}`}>
                    <td>
                      {row.a} A @ {row.v} V
                    </td>
                    {row.cells.map((c, i) => (
                      <td key={distFt[i]}>{label(c)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>12 V DC wire size (solar, RV, boat, car)</h2>
          <p>
            Low-voltage DC needs much thicker wire for the same current. Copper AWG to stay within 3% at 12 V, one-way distance. At 24 V you can use the
            column for twice the distance; at 48 V, four times. The smallest size listed is 14 AWG — very small loads can use thinner wire rated for
            the current. Boats should follow ABYC E-11; vehicles, the wire maker’s ratings.
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Current</th>
                  {dcFt.map((d) => (
                    <th scope="col" key={d}>
                      {d} ft
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dcRows.map((row) => (
                  <tr key={row.a}>
                    <td>{row.a} A</td>
                    {row.cells.map((c, i) => (
                      <td key={dcFt[i]}>{label(c)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>AWG vs mm²</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <GaugeScaleDiagram />
              <figcaption>Copper conductors drawn to scale.</figcaption>
            </figure>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">AWG</th>
                    <th scope="col">Area</th>
                    <th scope="col">Nearest metric up</th>
                    <th scope="col">Cu Ω/1000 ft @ 75 °C</th>
                  </tr>
                </thead>
                <tbody>
                  {awgTable.map((r) => (
                    <tr key={r.c.id}>
                      <td>{r.c.label.replace(' AWG', '')}</td>
                      <td>{n(r.c.areaMm2, 2)} mm²</td>
                      <td>{r.metric?.label ?? '—'}</td>
                      <td>{n(r.r, 4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p>
            AWG numbers go down as wires get thicker, and every 3 gauges roughly doubles the area. Metric cable is sold in fixed sizes, so when you convert,
            always round <strong>up</strong> to the next metric size. Each region has its own rules: the NEC in the US, BS 7671 in the UK, IEC 60364 across
            much of Europe and AS/NZS 3000/3008 in Australia and New Zealand.
          </p>

          <h2>Copper vs aluminium</h2>
          <p>
            Aluminium is lighter and cheaper but conducts about 61% as well as copper, so it needs a larger size for the same current and the same voltage
            drop. It also needs terminals listed for aluminium (marked AL or AL/CU) and correct torque. It is common for larger feeders and service
            conductors; most branch circuits in homes use copper.
          </p>

          <h2>Breakers, fuses and the 125% rule</h2>
          <p>
            The breaker or fuse protects the wire, so it must not be bigger than the wire’s allowable current — and for 14, 12 and 10 AWG copper the NEC caps
            it at 15, 20 and 30 A whatever the table says. For loads that run 3 hours or more, both the wire and the breaker are sized for 125% of the load.
            The calculator suggests the smallest standard breaker that covers the load and stays within the wire’s limit; equipment instructions and motor
            rules can change this.
          </p>

          <h2>Frequently asked questions</h2>
          <div className={styles.faqList}>
            {faqs.map((f) => (
              <div key={f.q} className={styles.faqItem}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>

          <HowWeCalculate slug="wire-gauge-calculator" />

          <h2>Related calculators</h2>
          <ul className={styles.related}>
            <li>
              <Link href="/pipe-volume-calculator/">
                Pipe &amp; Tube Volume Calculator<span>Conduit and pipe capacity</span>
              </Link>
            </li>
            <li>
              <Link href="/linear-foot-calculator/">
                Linear Foot Calculator<span>Total cable runs in feet</span>
              </Link>
            </li>
            <li>
              <Link href="/stud-calculator/">
                Stud Calculator<span>Framing you will run cable through</span>
              </Link>
            </li>
            <li>
              <Link href="/drywall-calculator/">
                Drywall Calculator<span>Close up the walls afterwards</span>
              </Link>
            </li>
            <li>
              <Link href="/square-footage-calculator/">
                Square Footage Calculator<span>Room areas for load planning</span>
              </Link>
            </li>
            <li>
              <Link href="/construction-estimate-template/">
                Construction Estimate Template<span>Price the materials and labour</span>
              </Link>
            </li>
          </ul>

          <p className={styles.note}>
            Disclaimer: results are planning estimates based on the published tables and formulas listed above. They do not cover every case (cable type,
            installation method, motors, reactance on large feeders, local amendments). Follow the electrical code adopted where you live and have a licensed
            electrician design or check the work.
          </p>
        </article>

        <div className={styles.adBlock}>
          <AdSlot slotId="wire-gauge-calculator-bottom" />
        </div>
      </main>
    </>
  );
}
