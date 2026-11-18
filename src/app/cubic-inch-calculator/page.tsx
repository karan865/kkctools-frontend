import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import CubicInchCalculator from '@/components/tool/cubic-inch-calculator';
import ToolShell from '@/components/tool/shared/ToolShell';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import { CylinderDiagram, ShapeDiagram } from '@/components/tool/cubic-inch-calculator/CubicInchDiagram';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  CC_PER_IN3,
  IN3_PER_FT3,
  IN3_PER_USGAL,
  IN3_PER_YD3,
  PRESETS,
  VOLUME_UNITS,
  boreFor,
  cidChart,
  engine,
  fromCubicInches,
  presetEngine,
  shapeVolume,
  strokeFor,
  whatIf,
} from '@/lib/cubic-inch-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.cubicInchCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

// ---------- every number below comes from the same engine as the tool ----------
const f = (v: number, dp = 0) => v.toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: dp });
const zero = { length: 0, width: 0, height: 0, diameter: 0, inner: 0, quantity: 1 };

const box = shapeVolume({ ...zero, shape: 'box', length: 12, width: 10, height: 8 }).total;
const boxSet = fromCubicInches(box);
const cyl = shapeVolume({ ...zero, shape: 'cylinder', diameter: 4, length: 10 }).total;
const cylSet = fromCubicInches(cyl);
const tube = shapeVolume({ ...zero, shape: 'tube', diameter: 2, inner: 1.75, length: 36 });
const sphere = shapeVolume({ ...zero, shape: 'sphere', diameter: 6 }).total;
const litreIn3 = VOLUME_UNITS.litres.in3;
const impGalIn3 = VOLUME_UNITS.impGal.in3;
const m3In3 = VOLUME_UNITS.m3.in3;

const sbc = engine(4, 3.48, 8);
const honda = presetEngine(PRESETS.find((p) => p.id === 'k20c1')!);
const hemi = presetEngine(PRESETS.find((p) => p.id === 'hemi392')!);
const classics = [302, 318, 327, 350, 383, 400, 427, 440, 454, 502].map((ci) => ({ ci, set: fromCubicInches(ci) }));
const mods = [
  { label: 'Stock 350 (4.000 × 3.480 in)', w: whatIf(4, 3.48, 8, 0) },
  { label: '.030 in overbore', w: whatIf(4, 3.48, 8, 0.03) },
  { label: '.040 in overbore', w: whatIf(4, 3.48, 8, 0.04) },
  { label: '.060 in overbore', w: whatIf(4, 3.48, 8, 0.06) },
  { label: '.030 over + 3.750 in crank (“383”)', w: whatIf(4, 3.48, 8, 0.03, 3.75) },
  { label: '.030 over + 3.875 in crank', w: whatIf(4, 3.48, 8, 0.03, 3.875) },
];
const stroker = mods[4].w;
const chartBores = [3.875, 4.0, 4.03, 4.06, 4.125, 4.155, 4.25];
const chartStrokes = [3.0, 3.25, 3.48, 3.622, 3.75, 4.0];
const chart = cidChart(chartBores, chartStrokes);
const need383Stroke = strokeFor(383, 4.03, 8);
const need400Bore = boreFor(400, 3.75, 8);

// ---------- FAQ ----------
const faqs = [
  {
    q: 'How do you calculate cubic inches?',
    a: `Measure in inches and multiply length × width × height. A 12 × 10 × 8 in box is ${f(box)} cubic inches. If you measured in feet or centimetres, convert to inches first (or pick the unit in the calculator), because multiplying mixed units gives a meaningless number.`,
  },
  {
    q: 'How do I calculate engine displacement?',
    a: `Displacement = π/4 × bore² × stroke × number of cylinders, with bore and stroke in inches for cubic inches (π/4 ≈ 0.7854). A V8 with a 4.000 in bore and 3.480 in stroke: 0.7854 × 4² × 3.48 × 8 = ${f(sbc.ci, 1)} ci, or ${f(sbc.litres, 2)} litres.`,
  },
  {
    q: 'How many cc are in a cubic inch?',
    a: `Exactly ${CC_PER_IN3} cc (cubic centimetres), because an inch is defined as exactly 2.54 cm and 2.54³ = ${CC_PER_IN3}. Going the other way, one litre (1,000 cc) is ${f(litreIn3, 3)} cubic inches.`,
  },
  {
    q: 'How many litres is a 350?',
    a: `${f(fromCubicInches(350).litres, 2)} litres, usually rounded to 5.7 L. Likewise a 302 is ${f(fromCubicInches(302).litres, 2)} L (sold as a “5.0”), a 454 is ${f(fromCubicInches(454).litres, 2)} L and a 427 is ${f(fromCubicInches(427).litres, 2)} L.`,
  },
  {
    q: 'How much displacement does boring .030 over add?',
    a: `On a 350 small-block (4.000 × 3.480 in), a .030 in overbore adds about ${f(mods[1].w.addedCi, 1)} cubic inches, to ${f(mods[1].w.after.ci, 1)} ci. A .060 in overbore adds about ${f(mods[3].w.addedCi, 1)} ci. Bore size counts twice in the formula (it is squared), so small overbores add a little more than you might expect.`,
  },
  {
    q: 'What is a 383 stroker?',
    a: `A 350 small-block bored .030 in over (4.030 in) and fitted with a longer 3.750 in stroke crankshaft. That works out to ${f(stroker.after.ci, 1)} ci — ${f(stroker.addedCi, 1)} ci (${f(stroker.pct, 1)}%) more than the stock 350. Any engine with a longer-than-stock stroke is called a stroker.`,
  },
  {
    q: 'How many cubic inches are in a cubic foot, a gallon or a litre?',
    a: `A cubic foot is ${f(IN3_PER_FT3)} in³ (12 × 12 × 12), a US gallon is exactly ${IN3_PER_USGAL} in³, an imperial gallon about ${f(impGalIn3, 2)} in³, and a litre about ${f(litreIn3, 2)} in³. A cubic yard is ${f(IN3_PER_YD3)} in³.`,
  },
  {
    q: 'How do I find the cubic inches of a cylinder?',
    a: `Multiply 0.7854 × diameter² × height (all in inches). A can 4 in across and 10 in tall holds ${f(cyl, 2)} in³ — about ${f(cylSet.usGal, 2)} US gallons or ${f(cylSet.litres, 2)} litres. For a pipe or tube, use the inside diameter for what it holds and both diameters for the material itself.`,
  },
  {
    q: 'What is the difference between square inches and cubic inches?',
    a: 'Square inches (in²) measure a flat area — length × width. Cubic inches (in³) measure a volume — length × width × height. A 10 × 10 in tile is 100 in²; a 10 × 10 × 10 in box is 1,000 in³.',
  },
  {
    q: 'Is engine displacement the same as engine size?',
    a: `Yes — “engine size” almost always means displacement, the total volume all the pistons sweep. Advertised sizes are rounded: the 392 HEMI’s published bore and stroke (4.09 × 3.72 in) work out to ${f(hemi.ci, 1)} ci, or ${f(hemi.litres, 2)} L, sold as a 6.4.`,
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Cubic Inch Calculator',
  path: route.path,
  description:
    'Free cubic inch calculator: volume of a box, cylinder, tube or sphere in cubic inches with conversions to cubic feet, gallons, litres and cc, plus an engine displacement calculator from bore, stroke and cylinders with presets, overbore and stroker what-if, and bore or stroke solver.',
});
const faqSchema = buildFaqSchema(faqs);

export default function CubicInchCalculatorPage() {
  return (
    <>
      <JsonLd data={[webAppSchema, faqSchema]} />
      <main id="main-content" className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
        <Breadcrumbs items={[{ name: 'Tools', path: '/tools/' }, { name: 'Cubic Inch Calculator', path: route.path }]} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Cubic Inch Calculator (Volume &amp; Engine Displacement)</h1>
          <p className={styles.lead}>
            This <strong>cubic inch calculator</strong> does both jobs people mean by “cubic inches”: the volume of a box, cylinder, tube or sphere — with
            instant conversion to cubic feet, gallons, litres and cc — and engine displacement from bore, stroke and cylinder count, with factory presets,
            an overbore and stroker what-if, and a solver for the bore or stroke you need.
          </p>
          <p className={styles.meta}>
            Last updated: {new Date(route.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} · Exact
            conversion factors · Runs in your browser — nothing you enter is sent anywhere.
          </p>
        </header>

        <section aria-label="Cubic inch and engine displacement calculator tool">
          <ToolShell
            features={[
              'Engine displacement CID',
              'Box, cylinder & sphere',
              'Liters, cc & cubic feet',
              'Fractional inch support',
            ]}
          >
            <CubicInchCalculator />
          </ToolShell>
        </section>

        <div className={styles.adBlock}>
          <AdSlot slotId="cubic-inch-calculator-middle" />
        </div>

        <article className={styles.article}>
          <h2>How to use the cubic inch calculator</h2>
          <ol>
            <li>
              <strong>Pick a mode:</strong> <em>Volume</em> for boxes, containers, tanks and pipes, or <em>Engine displacement</em> for motors.
            </li>
            <li>
              <strong>Volume:</strong> choose the shape and the unit you measured in, enter the dimensions and how many pieces. Results appear in cubic
              inches and seven other units, with the working shown.
            </li>
            <li>
              <strong>Engine:</strong> start from a factory preset or enter bore, stroke (inches or millimetres) and cylinders. Add an overbore or a new
              stroke to see what a rebuild adds, or enter a target size to find the bore or stroke you need.
            </li>
            <li>
              <strong>Copy or share</strong> the result — the share link restores every input.
            </li>
          </ol>

          <h2>How to calculate cubic inches of a box</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <ShapeDiagram shape="box" a="12 in" b="10 in" c="8 in" />
              <figcaption>A 12 × 10 × 8 in box.</figcaption>
            </figure>
            <div>
              <p>Measure each side in inches and multiply:</p>
              <p className={styles.formula}>
                12 × 10 × 8 = <strong>{f(box)} in³</strong>
              </p>
              <p>
                That is {f(boxSet.ft3, 3)} ft³, {f(boxSet.usGal, 2)} US gallons or {f(boxSet.litres, 2)} litres. Shipping companies, aquarium makers and
                speaker-box builders all quote volumes this way. Measure inside dimensions when you want what a container holds, and outside dimensions for
                the space it takes up.
              </p>
            </div>
          </div>

          <h2>Cubic inches of a cylinder, tube or sphere</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <ShapeDiagram shape="tube" a="2 in" b="36 in" d="1.75 in" />
              <figcaption>A tube: the wall uses both diameters, the hollow inside uses only the inside diameter.</figcaption>
            </figure>
            <div>
              <ul>
                <li>
                  <strong>Cylinder:</strong> 0.7854 × D² × H. A 4 in × 10 in can: 0.7854 × 16 × 10 = {f(cyl, 2)} in³.
                </li>
                <li>
                  <strong>Tube or pipe:</strong> wall = 0.7854 × (OD² − ID²) × L; inside = 0.7854 × ID² × L. A 36 in tube, 2 in outside and 1.75 in
                  inside: wall {f(tube.each, 2)} in³, inside {f(tube.capacityEach, 2)} in³.
                </li>
                <li>
                  <strong>Sphere:</strong> 0.5236 × D³ (that is π/6). A 6 in ball: {f(sphere, 2)} in³.
                </li>
              </ul>
              <p>
                The 0.7854 is π ÷ 4 — it turns a diameter squared into the area of a circle. For pipes in common schedules and tubing sizes, the{' '}
                <Link href="/pipe-volume-calculator/">pipe volume calculator</Link> has the inside diameters built in.
              </p>
            </div>
          </div>

          <h2>Cubic inch conversions</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">1 of this…</th>
                  <th scope="col">…is this many cubic inches</th>
                  <th scope="col">Exact or rounded</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cubic centimetre (cc, mL)</td>
                  <td>{f(1 / CC_PER_IN3, 6)}</td>
                  <td>1 in³ = {CC_PER_IN3} cc exactly</td>
                </tr>
                <tr>
                  <td>Litre</td>
                  <td>{f(litreIn3, 4)}</td>
                  <td>rounded</td>
                </tr>
                <tr>
                  <td>US gallon</td>
                  <td>{IN3_PER_USGAL}</td>
                  <td>exact (definition)</td>
                </tr>
                <tr>
                  <td>Imperial gallon</td>
                  <td>{f(impGalIn3, 3)}</td>
                  <td>rounded (4.54609 L exactly)</td>
                </tr>
                <tr>
                  <td>Cubic foot</td>
                  <td>{f(IN3_PER_FT3)}</td>
                  <td>exact (12³)</td>
                </tr>
                <tr>
                  <td>Cubic yard</td>
                  <td>{f(IN3_PER_YD3)}</td>
                  <td>exact (36³)</td>
                </tr>
                <tr>
                  <td>Cubic metre</td>
                  <td>{f(m3In3, 1)}</td>
                  <td>rounded</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            For bigger jobs — soil, gravel or concrete — cubic inches get unwieldy; the <Link href="/cubic-yard-calculator/">cubic yard calculator</Link> and
            the <Link href="/cubic-feet-to-square-feet/">cubic feet to square feet converter</Link> work in the units suppliers sell by.
          </p>

          <h2>Engine displacement calculator: the formula</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <CylinderDiagram bore="4.000 in" stroke="3.480 in" cylinders={8} ratio={4 / 3.48} />
              <figcaption>Bore is the cylinder’s diameter; stroke is how far the piston travels. The shaded volume is swept on every stroke.</figcaption>
            </figure>
            <div>
              <p>
                An engine displacement calculator multiplies the area of one cylinder by the distance the piston moves, then by the number of cylinders:
              </p>
              <p className={styles.formula}>displacement = π/4 × bore² × stroke × cylinders</p>
              <p>
                <strong>A V8:</strong> 4.000 in bore, 3.480 in stroke: 0.7854 × 16 × 3.48 × 8 = <strong>{f(sbc.ci, 2)} ci</strong> = {f(sbc.cc, 0)} cc ={' '}
                {f(sbc.litres, 2)} L — the Chevrolet 350.
              </p>
              <p>
                <strong>A metric four:</strong> 86.0 mm bore, 85.9 mm stroke (Honda Civic Type R): 0.7854 × 8.6² × 8.59 × 4 = {f(honda.cc, 0)} cc (in
                centimetres) = {f(honda.ci, 1)} ci.
              </p>
            </div>
          </div>

          <h2>Cubic inches to cc and litres for common engines</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.note}>Bore and stroke as published by the manufacturer; displacement calculated with the formula above</caption>
              <thead>
                <tr>
                  <th scope="col">Engine</th>
                  <th scope="col">Bore × stroke</th>
                  <th scope="col">Cyl.</th>
                  <th scope="col">ci</th>
                  <th scope="col">cc</th>
                  <th scope="col">Litres</th>
                </tr>
              </thead>
              <tbody>
                {PRESETS.map((p) => {
                  const e = presetEngine(p);
                  return (
                    <tr key={p.id}>
                      <td>
                        <a href={p.url} target="_blank" rel="noopener noreferrer">
                          {p.name}
                        </a>
                      </td>
                      <td>
                        {p.bore} × {p.stroke} {p.unit}
                      </td>
                      <td>{p.cylinders}</td>
                      <td>{f(e.ci, 1)}</td>
                      <td>{f(e.cc, 0)}</td>
                      <td>{f(e.litres, 2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p>
            Engines are usually named by a rounded figure, so calculated values can differ by a cubic inch or two — the 392 HEMI calculates to{' '}
            {f(hemi.ci, 1)} ci.
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.note}>Classic size names converted to litres and cc</caption>
              <thead>
                <tr>
                  <th scope="col">Cubic inches</th>
                  <th scope="col">cc</th>
                  <th scope="col">Litres</th>
                </tr>
              </thead>
              <tbody>
                {classics.map(({ ci, set }) => (
                  <tr key={ci}>
                    <td>{ci} ci</td>
                    <td>{f(set.cc, 0)}</td>
                    <td>{f(set.litres, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Overboring and stroking: how much do they add?</h2>
          <p>
            Rebuilders bore worn cylinders oversize, and stroker kits use a crankshaft with a longer throw. Both raise displacement; here is what each does
            to a 350:
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Build</th>
                  <th scope="col">ci</th>
                  <th scope="col">Litres</th>
                  <th scope="col">Added</th>
                </tr>
              </thead>
              <tbody>
                {mods.map(({ label, w }) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td>{f(w.after.ci, 1)}</td>
                    <td>{f(w.after.litres, 2)}</td>
                    <td>{w.addedCi > 0 ? `+${f(w.addedCi, 1)} ci (+${f(w.pct, 1)}%)` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Stroke adds displacement in a straight line, while bore is squared — but blocks only allow a small overbore before the cylinder walls get too
            thin, which is why big gains come from stroke. Check the block and piston maker’s limits before choosing an oversize.
          </p>

          <h2>Bore and stroke chart (V8, cubic inches)</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Bore ↓ / stroke →</th>
                  {chartStrokes.map((s) => (
                    <th scope="col" key={s}>
                      {s.toFixed(3)} in
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chartBores.map((b, i) => (
                  <tr key={b}>
                    <th scope="row">{b.toFixed(3)} in</th>
                    {chart[i].map((v, j) => (
                      <td key={j}>{f(v, 1)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>For a six-cylinder multiply by 0.75, for a four-cylinder by 0.5 — or switch the cylinder count in the calculator.</p>

          <h2>Finding the bore or stroke for a target size</h2>
          <p>Turn the formula around when you know the size you want:</p>
          <p className={styles.formula}>
            stroke = displacement ÷ (0.7854 × bore² × cylinders) · bore = √(displacement ÷ (0.7854 × stroke × cylinders))
          </p>
          <p>
            For a 383 V8 with a 4.030 in bore, stroke = 383 ÷ (0.7854 × 4.03² × 8) = <strong>{f(need383Stroke, 3)} in</strong> — the 3.750 in crank. For
            400 ci with that same 3.750 in stroke, you would need a {f(need400Bore, 3)} in bore. The calculator’s solver does this in inches or
            millimetres, for any cylinder count.
          </p>

          <h2>Oversquare and undersquare engines</h2>
          <p>
            Dividing bore by stroke tells you an engine’s shape. Above 1 it is <strong>oversquare</strong> (the bore is bigger than the stroke, like the 350 at{' '}
            {f(sbc.boreStrokeRatio, 3)}); about 1 is <strong>square</strong> (the Honda 2.0 at {f(honda.boreStrokeRatio, 3)}); below 1 is{' '}
            <strong>undersquare</strong>. The calculator shows the ratio with every result. Displacement is the same either way — the ratio only tells you
            how it is achieved.
          </p>

          <h2>Frequently asked questions</h2>
          <div className={styles.faqList}>
            {faqs.map((x) => (
              <div key={x.q} className={styles.faqItem}>
                <h3>{x.q}</h3>
                <p>{x.a}</p>
              </div>
            ))}
          </div>

          <HowWeCalculate slug="cubic-inch-calculator" />

          <h2>Related calculators</h2>
          <ul className={styles.related}>
            <li>
              <Link href="/pipe-volume-calculator/">
                Pipe &amp; Tube Volume Calculator<span>Gallons in any pipe</span>
              </Link>
            </li>
            <li>
              <Link href="/cubic-feet-to-square-feet/">
                Cubic Feet ↔ Square Feet<span>Spread a volume over an area</span>
              </Link>
            </li>
            <li>
              <Link href="/cubic-yard-calculator/">
                Cubic Yard Calculator<span>Soil, mulch, gravel</span>
              </Link>
            </li>
            <li>
              <Link href="/wire-gauge-calculator/">
                Wire Gauge Calculator<span>AWG by amps and distance</span>
              </Link>
            </li>
            <li>
              <Link href="/square-footage-calculator/">
                Square Footage Calculator<span>Flat areas</span>
              </Link>
            </li>
            <li>
              <Link href="/concrete-calculator/">
                Concrete Calculator<span>Cubic yards and bags</span>
              </Link>
            </li>
          </ul>

          <p className={styles.note}>
            Disclaimer: results are calculations from the dimensions you enter. For engine work, use measured bore and stroke and the limits given by your
            block, piston and crank manufacturers. See our <Link href="/disclaimer/">disclaimer</Link>.
          </p>
        </article>

        <div className={styles.adBlock}>
          <AdSlot slotId="cubic-inch-calculator-bottom" />
        </div>
      </main>
    </>
  );
}
