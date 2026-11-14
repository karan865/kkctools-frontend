import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import PipeVolumeCalculator from '@/components/tool/pipe-volume-calculator';
import { CapacityDiagram, CrossSectionDiagram, SizesDiagram } from '@/components/tool/pipe-volume-calculator/PipeDiagram';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  MATERIALS,
  MM_PER_IN,
  PIPE_PRESETS,
  calculatePipes,
  perLength,
  presetById,
  presetId,
  presetRun,
  weightPerLength,
  type PipeRun,
} from '@/lib/pipe-volume-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.pipeVolumeCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

// ---------- every number below is computed by the same engine as the tool ----------
const n = (v: number, dp = 0) => v.toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: dp });
const sig = (v: number) => (v >= 100 ? n(v, 0) : v >= 10 ? n(v, 1) : v >= 1 ? n(v, 2) : n(v, 4));
const calc = (runs: PipeRun[], materialKgPerM3 = 7850) => calculatePipes({ runs, liquidKgPerL: 1, materialKgPerM3 });
const round = (over: Partial<PipeRun>): PipeRun => ({ id: 'x', shape: 'round', odIn: 0, idIn: 1, widthIn: 0, heightIn: 0, wallIn: 0, lengthIn: 12, qty: 1, ...over });

const ex2in = calc([presetRun('a', 'sch40-2', 100 * 12)]);
const exMetric = calc([round({ idIn: 100 / MM_PER_IN, lengthIn: 10000 / MM_PER_IN })]);
const exTube = calc([round({ odIn: 2, idIn: 1.5, lengthIn: 120 })]);
const exHouse = calc(
  [presetRun('a', 'cuL-3/4', 40 * 12), presetRun('b', 'cuL-1', 25 * 12), presetRun('c', 'pex-1/2', 60 * 12)],
  8940,
);
const exRect = calc([{ id: 'r', shape: 'rect', odIn: 0, idIn: 0, widthIn: 4, heightIn: 2, wallIn: 0.125, lengthIn: 240, qty: 1 }]);
const exRectAl = calculatePipes({ runs: [{ id: 'r', shape: 'rect', odIn: 0, idIn: 0, widthIn: 4, heightIn: 2, wallIn: 0.125, lengthIn: 240, qty: 1 }], liquidKgPerL: 1, materialKgPerM3: 2700 });

const sch40 = PIPE_PRESETS.filter((p) => p.group === 'Steel / PVC Schedule 40');
const sch80 = PIPE_PRESETS.filter((p) => p.group === 'Steel / PVC Schedule 80');
const copperL = PIPE_PRESETS.filter((p) => p.group === 'Copper Type L');
const pex = PIPE_PRESETS.filter((p) => p.group.startsWith('PEX'));
const pe = PIPE_PRESETS.filter((p) => p.group.startsWith('PE pipe'));
const steelDensity = MATERIALS.find((m) => m.id === 'steel')!.kgPerM3;
const p1 = presetById('sch40-1')!;
const gal1 = perLength(presetId(p1)).galPerFt;
const gal2 = perLength(presetId(presetById('sch40-2')!)).galPerFt;
const gal4 = perLength(presetId(presetById('sch40-4')!)).galPerFt;
const halfL = perLength(presetId(presetById('cuL-1/2')!)).galPerFt;

// ---------- FAQ ----------
const faqs = [
  {
    q: 'How do you calculate the volume of a pipe?',
    a: `Use the inside diameter: volume = π × (ID ÷ 2)² × length. Keep the units the same, then convert — in cubic inches, divide by 231 for US gallons. 100 ft of 2 in Schedule 40 pipe (ID 2.067 in) holds ${n(ex2in.usGal, 1)} US gallons (${n(ex2in.litres)} L).`,
  },
  {
    q: 'How do you calculate the volume of a tube (hollow cylinder)?',
    a: `The material in a tube is the outer cylinder minus the hole: V = π ÷ 4 × (OD² − ID²) × length. A tube 2 in OD, 1.5 in ID and 10 ft long has ${n(exTube.materialIn3, 1)} in³ of material — about ${n(exTube.materialLb, 1)} lb in steel.`,
  },
  {
    q: 'How many gallons per foot are in a pipe?',
    a: `It depends on the inside diameter. Schedule 40 pipe holds about ${sig(gal1)} gal/ft at 1 in, ${sig(gal2)} gal/ft at 2 in and ${sig(gal4)} gal/ft at 4 in. ½ in Type L copper holds about ${sig(halfL)} gal/ft. See the tables on this page.`,
  },
  {
    q: 'How many litres per metre are in a pipe?',
    a: 'Litres per metre = π × (ID in mm ÷ 2)² ÷ 1,000. A 100 mm inside diameter holds 7.85 L per metre; a 32 mm × 2.9 mm PE pipe (ID 26.2 mm) holds about 0.54 L per metre.',
  },
  {
    q: 'Should I use the inside or outside diameter?',
    a: 'Inside diameter for how much a pipe holds; outside diameter (with the inside) for how much material the tube contains and what it weighs. The difference matters — a 1 in Schedule 40 pipe is 1.315 in outside but only 1.049 in inside.',
  },
  {
    q: 'What is nominal pipe size, and why isn’t it the real diameter?',
    a: 'Nominal pipe size is a name, not a measurement. For steel and PVC pipe the outside diameter is fixed for each size (1 in = 1.315 in OD) and heavier schedules add wall on the inside, so the inside diameter shrinks. Copper tube is different again: its outside diameter is the nominal size plus ⅛ in.',
  },
  {
    q: 'How much water is in my house’s pipes?',
    a: `Add up every run by size. For example 40 ft of ¾ in and 25 ft of 1 in Type L copper plus 60 ft of ½ in PEX hold about ${n(exHouse.usGal, 1)} US gallons. Add the water heater and any tanks separately.`,
  },
  {
    q: 'How do I find the inside diameter from the outside diameter and wall thickness?',
    a: 'Inside diameter = outside diameter − 2 × wall thickness. A 2.375 in pipe with a 0.154 in wall has a 2.067 in inside diameter. Choose “Outside diameter + wall” in the calculator to do this automatically.',
  },
  {
    q: 'How do I calculate the volume of a square or rectangular tube?',
    a: `Inside area = (width − 2 × wall) × (height − 2 × wall); multiply by length for capacity. A 4 × 2 in tube with ⅛ in walls, 20 ft long, holds ${n(exRect.usGal, 2)} US gallons and its wall weighs about ${n(exRectAl.materialLb, 1)} lb in aluminium (sharp corners assumed).`,
  },
  {
    q: 'How much does a pipe full of water weigh?',
    a: `Water weighs about 1 kg per litre (≈ 8.34 lb per US gallon), so 100 ft of 2 in Schedule 40 pipe carries about ${n(ex2in.liquidLb)} lb of water on top of about ${n(ex2in.materialLb)} lb of steel.`,
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Pipe & Tube Volume Calculator',
  path: route.path,
  description:
    'Free pipe and tube volume calculator: liquid capacity in US gallons, litres, imperial gallons and cubic feet, tube wall volume and weight, Schedule 40/80, copper K/L/M, PEX and metric PE sizes, several runs and fill time.',
});
const faqSchema = buildFaqSchema(faqs);

export default function PipeVolumeCalculatorPage() {
  return (
    <>
      <JsonLd data={[webAppSchema, faqSchema]} />
      <main id="main-content" className={styles.main}>
        <Breadcrumbs items={[{ name: 'Tools', path: '/tools/' }, { name: 'Pipe & Tube Volume Calculator', path: route.path }]} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Pipe &amp; Tube Volume Calculator</h1>
          <p className={styles.lead}>
            This free <strong>tube volume calculator</strong> works out how much liquid a pipe or tube holds — in US gallons, litres, imperial gallons
            and cubic feet — and how much material is in the tube wall and what it weighs. Pick a standard size (steel or PVC Schedule 40/80, copper
            Type K/L/M, PEX or metric PE) or enter your own diameters, add as many runs as your system has, and see the total, the weight of the water
            and the time to fill.
          </p>
          <p className={styles.meta}>
            Last updated: {new Date(route.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} ·
            Runs in your browser — nothing you enter is sent anywhere.
          </p>
        </header>

        <section aria-label="Pipe and tube volume calculator tool">
          <PipeVolumeCalculator />
        </section>

        <div className={styles.adBlock}>
          <AdSlot slotId="pipe-volume-calculator-middle" />
        </div>

        <article className={styles.article}>
          <h2>How to use the pipe volume calculator</h2>
          <ol>
            <li>
              <strong>Choose US or metric.</strong> Diameters switch between inches and millimetres, lengths between feet and metres.
            </li>
            <li>
              <strong>Pick the pipe.</strong> Choose a standard size, enter a custom round pipe (outside diameter + wall, outside + inside, or just the
              inside), or a square/rectangular tube.
            </li>
            <li>
              <strong>Enter the length</strong> and how many pieces. Add more runs to total a whole plumbing or heating loop.
            </li>
            <li>
              <strong>Read the capacity</strong> in every unit, the liquid weight, the tube weight for your material and — if you enter a flow rate —
              the time to fill.
            </li>
          </ol>

          <h2>Pipe volume formula</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <CapacityDiagram />
              <figcaption>Capacity is the inside cross-section times the length.</figcaption>
            </figure>
            <div>
              <p>How much a pipe holds depends only on its inside diameter and its length:</p>
              <code className={styles.formula}>
                Capacity = π × (ID ÷ 2)² × L
                <br />
                US gallons = cubic inches ÷ 231
                <br />
                Litres = cubic inches × 0.016387
              </code>
              <p>
                <strong>Example (US):</strong> 100 ft of 2 in Schedule 40 steel pipe has a 2.067 in inside diameter. π × 1.0335² × 1,200 in ={' '}
                {n(ex2in.capacityIn3)} in³ ÷ 231 = <strong>{n(ex2in.usGal, 1)} US gallons</strong> ({n(ex2in.litres)} L).
              </p>
              <p>
                <strong>Example (metric):</strong> a 100 mm inside diameter, 10 m long: π × 0.05² × 10 = 0.0785 m³ ={' '}
                <strong>{n(exMetric.litres, 2)} L</strong>, or 7.85 L per metre.
              </p>
            </div>
          </div>

          <h2>Tube volume calculator: the hollow cylinder</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <CrossSectionDiagram shape="round" od={2} id={1.5} labels={{ od: '2 in', id: '1.5 in', wall: '0.25 in' }} />
              <figcaption>The tube wall is the ring between the outside and inside diameters.</figcaption>
            </figure>
            <div>
              <p>
                When you need the material — to work out weight, coating or cost — you want the volume of the wall, not the hole. That is the outer
                cylinder minus the inner one:
              </p>
              <code className={styles.formula}>
                Wall volume = π ÷ 4 × (OD² − ID²) × L
                <br />
                ID = OD − 2 × wall thickness
                <br />
                Weight = wall volume × density
              </code>
              <p>
                A tube 2 in OD × 1.5 in ID × 10 ft has {n(exTube.materialIn3, 1)} in³ of material — about {n(exTube.materialLb, 1)} lb in carbon steel
                — and holds {n(exTube.usGal, 2)} US gallons inside.
              </p>
            </div>
          </div>

          <h2>Inside diameter vs outside diameter vs nominal size</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <SizesDiagram />
              <figcaption>For steel and PVC, the outside stays the same for a size; thicker walls eat into the inside.</figcaption>
            </figure>
            <ul>
              <li>
                <strong>Outside diameter (OD)</strong> is fixed for each nominal size, so fittings fit every schedule. A 1 in pipe is 1.315 in OD.
              </li>
              <li>
                <strong>Inside diameter (ID)</strong> is what holds water. Schedule 40 1 in pipe is 1.049 in inside; Schedule 80 is 0.957 in.
              </li>
              <li>
                <strong>Nominal size</strong> is a name. For steel and PVC it matches neither diameter from ⅛ to 12 in. For copper tube, the OD is the
                nominal size plus ⅛ in (½ in copper is ⅝ in OD).
              </li>
              <li>
                <strong>Use the inside diameter for capacity.</strong> Using the outside diameter overstates a ½ in Schedule 40 pipe by about{' '}
                {n(((0.84 / presetId(presetById('sch40-1/2')!)) ** 2 - 1) * 100)}%, and the nominal size can be wrong in either direction.
              </li>
            </ul>
          </div>

          <h2>Gallons per foot and litres per metre by pipe size</h2>
          <h3>Steel and PVC pipe, Schedule 40 and 80</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Size</th>
                  <th scope="col">OD</th>
                  <th scope="col">Sch 40 ID</th>
                  <th scope="col">Sch 40 gal/ft</th>
                  <th scope="col">Sch 40 L/m</th>
                  <th scope="col">Sch 80 gal/ft</th>
                  <th scope="col">Steel Sch 40 lb/ft</th>
                </tr>
              </thead>
              <tbody>
                {sch40.map((p, i) => {
                  const a = perLength(presetId(p));
                  const b = perLength(presetId(sch80[i]));
                  return (
                    <tr key={p.id}>
                      <td>{p.label.replace(' Sch 40', '')}</td>
                      <td>{n(p.odIn, 3)} in</td>
                      <td>{n(presetId(p), 3)} in</td>
                      <td>{sig(a.galPerFt)}</td>
                      <td>{sig(a.lPerM)}</td>
                      <td>{sig(b.galPerFt)}</td>
                      <td>{n(weightPerLength(p.odIn, p.wallIn, steelDensity).lbPerFt, 2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <h3>Copper tube Type L and PEX</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Tube</th>
                  <th scope="col">OD</th>
                  <th scope="col">ID</th>
                  <th scope="col">gal/ft</th>
                  <th scope="col">gal per 100 ft</th>
                  <th scope="col">L/m</th>
                </tr>
              </thead>
              <tbody>
                {[...copperL, ...pex].map((p) => {
                  const a = perLength(presetId(p));
                  return (
                    <tr key={p.id}>
                      <td>{p.label}</td>
                      <td>{n(p.odIn, 3)} in</td>
                      <td>{n(presetId(p), 3)} in</td>
                      <td>{sig(a.galPerFt)}</td>
                      <td>{sig(a.galPerFt * 100)}</td>
                      <td>{sig(a.lPerM)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <h3>Metric PE pipe, SDR 11</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">OD × wall</th>
                  <th scope="col">ID</th>
                  <th scope="col">Litres per metre</th>
                  <th scope="col">Litres per 100 m</th>
                </tr>
              </thead>
              <tbody>
                {pe.map((p) => {
                  const a = perLength(presetId(p));
                  return (
                    <tr key={p.id}>
                      <td>
                        {n(p.odIn * MM_PER_IN)} × {n(p.wallIn * MM_PER_IN, 1)} mm
                      </td>
                      <td>{n(presetId(p) * MM_PER_IN, 1)} mm</td>
                      <td>{sig(a.lPerM)}</td>
                      <td>{sig(a.lPerM * 100)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <h2>How much water is in my pipes?</h2>
          <p>
            Total every run by size. A typical example: 40 ft of ¾ in Type L copper, 25 ft of 1 in Type L copper and 60 ft of ½ in PEX hold{' '}
            <strong>
              {n(exHouse.usGal, 1)} US gallons ({n(exHouse.litres, 1)} L)
            </strong>
            , about {n(exHouse.liquidLb)} lb of water. That is the volume to flush, drain or fill with antifreeze for a heating loop — add the boiler,
            water heater and radiators separately. Use <em>Add another run</em> in the calculator to total your own system.
          </p>

          <h2>Tube weight by material</h2>
          <p>
            Weight = wall volume × density. The calculator uses typical densities: carbon steel 7,850 kg/m³, stainless 8,000, copper 8,940, brass
            8,500, aluminium 2,700, PVC 1,400 and HDPE 950. As a check, it gives {n(weightPerLength(p1.odIn, p1.wallIn, steelDensity).lbPerFt, 2)} lb/ft
            for 1 in Schedule 40 steel, matching the plain-end weight published for that size (1.68 lb/ft). Coatings, galvanizing and
            threads add a little.
          </p>

          <h2>Square and rectangular tubes</h2>
          <p>
            For box section, the inside is (width − 2 × wall) × (height − 2 × wall). A 4 × 2 in tube with a ⅛ in wall, 20 ft long, holds{' '}
            {n(exRect.usGal, 2)} US gallons; its wall is {n(exRect.materialIn3, 1)} in³ — about {n(exRectAl.materialLb, 1)} lb in aluminium or{' '}
            {n(exRect.materialLb, 1)} lb in steel. Real tubes have rounded corners, which slightly increase the inside and reduce the wall.
          </p>

          <h2>Unit conversions used</h2>
          <ul>
            <li>1 US gallon = 231 in³ = 3.785411784 L (exact)</li>
            <li>1 imperial gallon = 4.54609 L (exact)</li>
            <li>1 ft³ = 1,728 in³ ≈ 7.48052 US gallons ≈ 28.3168 L</li>
            <li>1 L = 1,000 cm³ = 61.0237 in³; 1 m³ = 1,000 L</li>
            <li>Water ≈ 1 kg per litre ≈ 8.34 lb per US gallon</li>
          </ul>

          <h2>Frequently asked questions</h2>
          <div className={styles.faqList}>
            {faqs.map((f) => (
              <div key={f.q} className={styles.faqItem}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>

          <HowWeCalculate slug="pipe-volume-calculator" />

          <h2>Related calculators</h2>
          <ul className={styles.related}>
            <li>
              <Link href="/cubic-yard-calculator/">
                Cubic Yard Calculator<span>Volumes for soil, gravel and fill</span>
              </Link>
            </li>
            <li>
              <Link href="/concrete-calculator/">
                Concrete Calculator<span>Round columns and Sonotubes</span>
              </Link>
            </li>
            <li>
              <Link href="/tons-to-cubic-yards/">
                Tons to Cubic Yards<span>Weight ↔ volume for bulk materials</span>
              </Link>
            </li>
            <li>
              <Link href="/linear-foot-calculator/">
                Linear Foot Calculator<span>Total lengths of pipe and trim</span>
              </Link>
            </li>
            <li>
              <Link href="/rebar-calculator/">
                Rebar Calculator<span>Steel bar weight per foot and metre</span>
              </Link>
            </li>
            <li>
              <Link href="/square-footage-calculator/">
                Square Footage Calculator<span>Areas for any shape</span>
              </Link>
            </li>
          </ul>

          <p className={styles.note}>
            Pipe dimensions are nominal values from the published standards; real pipes vary within the standard’s tolerances. Results are for
            planning — check product data for critical work.
          </p>
        </article>

        <div className={styles.adBlock}>
          <AdSlot slotId="pipe-volume-calculator-bottom" />
        </div>
      </main>
    </>
  );
}
