import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import RebarCalculator from '@/components/tool/rebar-calculator';
import { BarSizesDiagram, CoverDiagram, ItemDiagram, LapDiagram } from '@/components/tool/rebar-calculator/RebarDiagram';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  BARS,
  M_PER_FT,
  M_PER_IN,
  barById,
  calculateRebar,
  defaultItem,
  kgPerMToLbPerFt,
  kgToLb,
  mToFt,
  type RebarInput,
  type RebarItem,
} from '@/lib/rebar-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.rebarCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

// ---------- numbers used in the article: computed by the same engine as the tool ----------
const ft = (v: number) => v * M_PER_FT;
const inch = (v: number) => v * M_PER_IN;
const n = (v: number, max = 0) => v.toLocaleString('en-US', { maximumFractionDigits: max });

function job(items: RebarItem[], over: Partial<RebarInput> = {}) {
  return calculateRebar({ items, stockLengthM: ft(20), lapDiameters: 40, wastePercent: 10, ...over });
}
const slab = (l: number, w: number, s: number, bar = 'us4'): RebarItem => ({
  ...defaultItem('slab', `s${l}x${w}x${s}`),
  barId: bar,
  length: ft(l),
  width: ft(w),
  spacing: inch(s),
  cover: inch(3),
});

const exPatio = job([slab(12, 12, 18)]);
const exPatioNoWaste = job([slab(12, 12, 18)], { wastePercent: 0 });
const exDrive = job([slab(20, 24, 18)]);
const footing: RebarItem = { ...defaultItem('footing', 'f'), length: ft(40), cover: inch(3), count: 2, spacing: 0 };
const exFooting = job([footing]);
const wall: RebarItem = { ...defaultItem('wall', 'w'), length: ft(20), height: ft(8), spacing: inch(16), spacing2: inch(16), cover: inch(2) };
const exWall = job([wall]);
const metricSlab: RebarItem = { ...defaultItem('slab', 'm', 'metric'), length: 6, width: 4, spacing: 0.4, cover: 0.08 };
const exMetric = job([metricSlab], { stockLengthM: 6 });
const exMetricNoWaste = job([metricSlab], { stockLengthM: 6, wastePercent: 0 });
const barList: RebarItem = { ...defaultItem('bars', 'b', 'metric'), barId: 'mm12', length: 6, count: 50 };
const exList = job([barList], { stockLengthM: 6, wastePercent: 0 });

// Tables
const usRows = BARS.filter((b) => b.system === 'imperial').map((b) => ({
  label: b.label,
  dIn: b.diameterM / M_PER_IN,
  dMm: b.diameterM * 1000,
  lbft: b.lbPerFt!,
  kgm: b.kgPerM,
  stick: b.lbPerFt! * 20,
  lap: (40 * b.diameterM) / M_PER_IN,
}));
const metricRows = BARS.filter((b) => b.system === 'metric').map((b) => ({
  label: b.label,
  kgm: b.kgPerM,
  lbft: kgPerMToLbPerFt(b.kgPerM),
  six: b.kgPerM * 6,
  twelve: b.kgPerM * 12,
  lap: 40 * b.diameterM * 1000,
}));
const slabSizes: [number, number][] = [[10, 10], [12, 12], [12, 20], [20, 20], [24, 24]];
const slabRows = slabSizes.map(([l, w]) => ({
  l,
  w,
  s12: job([slab(l, w, 12)]),
  s18: job([slab(l, w, 18)]),
  s24: job([slab(l, w, 24)]),
}));

const b4 = barById('us4');
const b12 = barById('mm12');

// ---------- FAQ ----------
const faqs = [
  {
    q: 'How do I calculate how much rebar I need for a slab?',
    a: `Take the cover off each edge, then count the bars each way: span ÷ spacing, rounded up, plus one. Multiply each count by the bar length and add the two directions. A 12×12 ft slab with #4 bars 18 in apart and 3 in cover has ${exPatioNoWaste.bars} bars and ${n(mToFt(exPatioNoWaste.netLengthM))} ft of steel. With 10% extra that is ${exPatio.pieces} bars of 20 ft.`,
  },
  {
    q: 'How much does rebar weigh per foot?',
    a: 'Standard US bars weigh about: #3 0.376 lb/ft, #4 0.668 lb/ft, #5 1.043 lb/ft, #6 1.502 lb/ft, #7 2.044 lb/ft and #8 2.670 lb/ft. A 20 ft #4 bar weighs about 13.4 lb.',
  },
  {
    q: 'How do I calculate reinforcement steel weight in kg?',
    a: `Multiply the total length in metres by the mass per metre of the bar. Mass per metre comes from the bar's cross-section × 7,850 kg/m³, which is close to diameter² ÷ 162 with the diameter in mm. A 12 mm bar is ${n(b12.kgPerM, 3)} kg/m, so 50 bars of 6 m weigh about ${n(exList.weightKg)} kg.`,
  },
  {
    q: 'What size rebar should I use for a slab or driveway?',
    a: 'Many home slabs, patios and driveways use #3 or #4 bars (10 or 12 mm in metric), and heavier slabs use larger sizes. The right size depends on slab thickness, loads and soil, so use what your plans, engineer or local code specify.',
  },
  {
    q: 'How far apart should rebar be in a slab?',
    a: 'Grids in home slabs are commonly placed somewhere between 12 and 24 in apart each way. Closer spacing means more bars and more steel — the calculator shows how much. Follow the spacing on your drawings where you have them.',
  },
  {
    q: 'How much should rebar overlap?',
    a: `A common field rule of thumb is a lap of about 40 bar diameters — about ${n(40 * 0.5)} in for a #4 bar or ${n(40 * 12)} mm for a 12 mm bar. Required laps vary with bar size, concrete strength and the design code, so the lap shown on your drawings always takes priority. You can change the lap in the calculator.`,
  },
  {
    q: 'How much concrete cover does rebar need?',
    a: 'ACI 318 calls for 3 in (75 mm) of cover where concrete is cast against and permanently in contact with the ground, such as footings. Other locations need different covers. In slabs on the ground, bars sit on chairs so concrete surrounds them.',
  },
  {
    q: 'What do rebar numbers like #4 and #5 mean?',
    a: 'In the US the bar number is the diameter in eighths of an inch: #4 is 4/8 = ½ in (12.7 mm) and #5 is ⅝ in (15.9 mm). The nearest metric sizes are 12 mm and 16 mm, which is what the calculator picks when you switch units.',
  },
  {
    q: 'How many 20 ft bars of rebar do I need?',
    a: `Add up the total length of steel including laps, add an allowance for offcuts, and divide by 20 ft, rounding up. For a 20×24 ft driveway with #4 bars at 18 in that is ${n(mToFt(exDrive.orderLengthM))} ft with 10% extra — ${exDrive.pieces} bars of 20 ft.`,
  },
  {
    q: 'Should I use rebar or wire mesh?',
    a: 'Both reinforce concrete. Welded wire mesh is quick to lay in thin slabs, while rebar is stronger per piece and easier to keep at the right height on chairs. Many plans call for one or the other — follow yours.',
  },
  {
    q: 'Does the calculator include hooks, bends, stirrups or tie wire?',
    a: 'No. It counts straight bars and laps. Add extra for hooked or bent bars, footing stirrups and column ties, and buy tie wire and chairs separately.',
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Rebar & Reinforcement Steel Calculator',
  path: route.path,
  description:
    'Free reinforcement steel calculator for slabs, strip footings, walls and bar lists. Counts bars, adds laps and waste, shows stock bars to buy and steel weight for US # bars or metric mm bars.',
});
const faqSchema = buildFaqSchema(faqs);

export default function RebarCalculatorPage() {
  return (
    <>
      <JsonLd data={[webAppSchema, faqSchema]} />
      <main id="main-content" className={styles.main}>
        <Breadcrumbs items={[{ name: 'Tools', path: '/tools/' }, { name: 'Rebar Calculator', path: route.path }]} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Reinforcement Steel Calculator: Rebar Quantity &amp; Weight</h1>
          <p className={styles.lead}>
            This free <strong>reinforcement steel calculator</strong> — a <strong>rebar calculator</strong> that also does weight — counts the
            bars in a slab grid, a strip footing or a wall, adds laps where a run is longer than one bar, and tells you how many stock bars to
            buy and how much the steel weighs. Use US bar numbers (#3–#11) or metric bars (8–40 mm), and add every part of your job to one
            estimate.
          </p>
          <p className={styles.meta}>
            Last updated: {new Date(route.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} ·
            Runs in your browser — nothing you enter is sent anywhere.
          </p>
        </header>

        <section aria-label="Rebar calculator tool">
          <RebarCalculator />
        </section>

        <div className={styles.adBlock}>
          <AdSlot slotId="rebar-calculator-middle" />
        </div>

        <article className={styles.article}>
          <h2>How to use this rebar calculator</h2>
          <ol>
            <li>
              <strong>Pick US or metric.</strong> Bar sizes switch between bar numbers and millimetres; your sizes convert.
            </li>
            <li>
              <strong>Choose what you are reinforcing:</strong> a slab grid, a strip footing, a wall, or a bar list if you already know the
              bars and just need the weight.
            </li>
            <li>
              <strong>Enter the sizes, bar size, spacing and cover</strong> shown on the diagram. Add footings and walls as extra parts.
            </li>
            <li>
              <strong>Set the stock bar length and lap.</strong> Runs longer than one bar get a lap at each joint.
            </li>
            <li>
              <strong>Read the bars to buy and the weight</strong> for each bar size. Add prices if you want a cost.
            </li>
          </ol>

          <h2>How rebar quantity is calculated</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <ItemDiagram kind="slab" />
              <figcaption>A slab grid: bars both ways at spacing S, kept a cover c in from the edges.</figcaption>
            </figure>
            <div>
              <p>
                A grid has bars running in two directions. For each direction, take the cover off both edges to get the span the bars sit in,
                then work out how many bars fit without any gap being wider than the spacing:
              </p>
              <code className={styles.formula}>
                Bars = (span ÷ spacing, rounded up) + 1
                <br />
                Length = bars × (slab size − 2 × cover)
              </code>
              <p>
                The “+ 1” is the bar at the far edge — leaving it out is one of the most common mistakes in hand counts. Do both directions,
                add them, and multiply by two if there are top and bottom mats.
              </p>
            </div>
          </div>
          <div className={styles.figGrid}>
            <figure className={styles.figureBox}>
              <ItemDiagram kind="footing" />
              <figcaption>Strip footing: N long bars, plus optional cross bars.</figcaption>
            </figure>
            <figure className={styles.figureBox}>
              <ItemDiagram kind="wall" />
              <figcaption>Wall: vertical bars at Sv and horizontal bars at Sh.</figcaption>
            </figure>
          </div>

          <h2>Worked examples</h2>
          <p>Examples use 20 ft (or 6 m) stock bars, laps of 40 bar diameters and 10% extra, calculated with the same code as the tool.</p>
          <div className={styles.examples}>
            <div className={styles.exampleCard}>
              <h3>12×12 ft patio slab</h3>
              <p className={styles.exampleMeta}>#4 at 18 in · 3 in cover</p>
              <ul>
                <li>Bars placed: {exPatio.bars}</li>
                <li>Steel: {n(mToFt(exPatio.orderLengthM))} ft</li>
                <li>
                  Buy: <strong>{exPatio.pieces} × 20 ft #4</strong>
                </li>
                <li>Weight: {n(kgToLb(exPatio.weightKg))} lb</li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>20×24 ft driveway</h3>
              <p className={styles.exampleMeta}>#4 at 18 in · 3 in cover</p>
              <ul>
                <li>Bars placed: {exDrive.bars}</li>
                <li>
                  Laps: {exDrive.laps} (24 ft runs are longer than a 20 ft bar)
                </li>
                <li>
                  Buy: <strong>{exDrive.pieces} × 20 ft #4</strong>
                </li>
                <li>Weight: {n(kgToLb(exDrive.weightKg))} lb</li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>40 ft strip footing</h3>
              <p className={styles.exampleMeta}>2 continuous #4 bars · 3 in end cover</p>
              <ul>
                <li>Laps: {exFooting.laps} (two per bar line)</li>
                <li>Steel: {n(mToFt(exFooting.orderLengthM))} ft</li>
                <li>
                  Buy: <strong>{exFooting.pieces} × 20 ft #4</strong>
                </li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>20×8 ft wall</h3>
              <p className={styles.exampleMeta}>#4 at 16 in both ways · 2 in cover</p>
              <ul>
                <li>Bars placed: {exWall.bars}</li>
                <li>Steel: {n(mToFt(exWall.orderLengthM))} ft</li>
                <li>
                  Buy: <strong>{exWall.pieces} × 20 ft #4</strong>
                </li>
                <li>Weight: {n(kgToLb(exWall.weightKg))} lb</li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>6 × 4 m slab, metric</h3>
              <p className={styles.exampleMeta}>12 mm at 400 mm · 80 mm cover · 6 m bars</p>
              <ul>
                <li>
                  Steel: {n(exMetricNoWaste.netLengthM, 2)} m → {exMetricNoWaste.pieces} bars with no extra
                </li>
                <li>
                  With 10%: <strong>{exMetric.pieces} × 6 m</strong>
                </li>
                <li>Weight: {n(exMetric.weightKg)} kg</li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>Bar list: weight only</h3>
              <p className={styles.exampleMeta}>50 bars · 12 mm · 6 m each</p>
              <ul>
                <li>Total length: {n(exList.netLengthM)} m</li>
                <li>
                  Weight: <strong>{n(exList.weightKg)} kg</strong>
                </li>
              </ul>
            </div>
          </div>
          <p className={styles.callout}>
            <strong>Check the rounding:</strong> {n(exMetricNoWaste.netLengthM, 2)} m of steel ÷ 6 m bars = {n(exMetricNoWaste.netLengthM / 6, 2)}
            , which means {exMetricNoWaste.pieces} bars — you cannot buy part of a bar. Some online examples round this down; the calculator
            always rounds up.
          </p>

          <h2>Rebar sizes and weight per foot</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <BarSizesDiagram />
              <figcaption>US bars #3–#8 drawn to scale.</figcaption>
            </figure>
            <p>
              US bars are named by number: the number is the nominal diameter in eighths of an inch, so a #4 bar is ½ in across. The ribs
              make the real bar bumpy, so “nominal” means the diameter of a smooth round bar that weighs the same per foot. That is why
              weight is tied directly to bar size.
            </p>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">US bar</th>
                  <th scope="col">Diameter</th>
                  <th scope="col">Weight per foot</th>
                  <th scope="col">Weight per metre</th>
                  <th scope="col">One 20 ft bar</th>
                </tr>
              </thead>
              <tbody>
                {usRows.map((r) => (
                  <tr key={r.label}>
                    <td>{r.label}</td>
                    <td>
                      {n(r.dIn, 3)} in ({n(r.dMm, 1)} mm)
                    </td>
                    <td>{r.lbft} lb/ft</td>
                    <td>{n(r.kgm, 3)} kg/m</td>
                    <td>{n(r.stick, 1)} lb</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Metric bar</th>
                  <th scope="col">Mass per metre</th>
                  <th scope="col">Weight per foot</th>
                  <th scope="col">One 6 m bar</th>
                  <th scope="col">One 12 m bar</th>
                </tr>
              </thead>
              <tbody>
                {metricRows.map((r) => (
                  <tr key={r.label}>
                    <td>{r.label}</td>
                    <td>{n(r.kgm, 3)} kg/m</td>
                    <td>{n(r.lbft, 3)} lb/ft</td>
                    <td>{n(r.six, 2)} kg</td>
                    <td>{n(r.twelve, 2)} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <code className={styles.formula}>
            Metric mass per metre = π ÷ 4 × d² × 7,850 kg/m³ ≈ d² ÷ 162 (d in mm)
            <br />
            Weight = total length × mass per metre (or weight per foot)
          </code>

          <h2>How many bars for common slab sizes</h2>
          <p>#4 bars, 3 in cover, 20 ft stock bars, laps of 40 diameters and 10% extra. Figures are bars to buy.</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Slab</th>
                  <th scope="col">At 12 in</th>
                  <th scope="col">At 18 in</th>
                  <th scope="col">At 24 in</th>
                  <th scope="col">Weight at 18 in</th>
                </tr>
              </thead>
              <tbody>
                {slabRows.map((r) => (
                  <tr key={`${r.l}x${r.w}`}>
                    <td>
                      {r.l} × {r.w} ft
                    </td>
                    <td>{r.s12.pieces}</td>
                    <td>{r.s18.pieces}</td>
                    <td>{r.s24.pieces}</td>
                    <td>{n(kgToLb(r.s18.weightKg))} lb</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Laps: joining bars that are too short</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <LapDiagram lapLabel={`40 × d = ${n(40 * 0.5)} in`} />
              <figcaption>Two #4 bars lapped 40 diameters and tied.</figcaption>
            </figure>
            <div>
              <p>
                When a run is longer than the bars you buy, two bars overlap and are tied together. That overlap is extra steel the count has
                to include. A common field rule of thumb is about 40 bar diameters; the calculator uses that as its starting value and lets you
                change it.
              </p>
              <p>
                Required lap lengths depend on bar size, concrete strength, bar position and the design code, so always use the lap on your
                drawings when you have one.
              </p>
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Bar</th>
                  <th scope="col">Lap at 40 × d</th>
                  <th scope="col">Bar</th>
                  <th scope="col">Lap at 40 × d</th>
                </tr>
              </thead>
              <tbody>
                {usRows.slice(0, 6).map((r, i) => (
                  <tr key={r.label}>
                    <td>{r.label}</td>
                    <td>{n(r.lap, 1)} in</td>
                    <td>{metricRows[i + 1]?.label}</td>
                    <td>{metricRows[i + 1] ? `${n(metricRows[i + 1].lap)} mm` : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Concrete cover and chairs</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <CoverDiagram />
              <figcaption>Bars sit on chairs; cover keeps them away from the edges and the ground.</figcaption>
            </figure>
            <p>
              Cover is the concrete between the steel and the outside surface. It protects the bars from rust and lets them work with the
              concrete. ACI 318 asks for 3 in (75 mm) where concrete is cast against and stays in contact with the ground, as in footings, which
              is the calculator’s default edge cover. Walls and other formed surfaces need less. Lift slab bars off the ground on chairs or
              blocks so they end up inside the concrete, not under it.
            </p>
          </div>

          <h2>Rebar or wire mesh?</h2>
          <p>
            Both are used to reinforce concrete. Welded wire mesh comes in sheets and is quick to lay in thin slabs; rebar comes as separate bars
            that you tie into a grid, is stiffer, and is easier to hold at the right height. Footings and walls almost always use rebar. Which
            one a slab needs — and how much — is set by the plans or local practice, not by the calculator.
          </p>

          <h2>Common rebar estimating mistakes</h2>
          <ul>
            <li>
              <strong>Forgetting the last bar.</strong> Bars across a span are span ÷ spacing <em>plus one</em>.
            </li>
            <li>
              <strong>Ignoring laps.</strong> A 24 ft run with 20 ft bars needs a lap — extra steel and an extra bar.
            </li>
            <li>
              <strong>Measuring to the edge.</strong> Bars stop at the cover, not at the form.
            </li>
            <li>
              <strong>Rounding bars down.</strong> 20.9 bars means buying 21.
            </li>
            <li>
              <strong>Mixing bar sizes in one count.</strong> Keep each size separate — the calculator groups them for you.
            </li>
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

          <h2>Related calculators</h2>
          <ul className={styles.related}>
            <li>
              <Link href="/concrete-calculator/">
                Concrete Calculator<span>Cubic yards and bags for the same slab</span>
              </Link>
            </li>
            <li>
              <Link href="/cinder-block-calculator/">
                Cinder Block Calculator<span>Blocks, mortar and core fill for CMU walls</span>
              </Link>
            </li>
            <li>
              <Link href="/paver-base-calculator/">
                Paver Base Calculator<span>Gravel base under slabs and patios</span>
              </Link>
            </li>
            <li>
              <Link href="/cubic-yard-calculator/">
                Cubic Yard Calculator<span>Volumes for soil, gravel and fill</span>
              </Link>
            </li>
            <li>
              <Link href="/tons-to-cubic-yards/">
                Tons to Cubic Yards<span>Convert material weight to volume</span>
              </Link>
            </li>
            <li>
              <Link href="/drywall-calculator/">
                Drywall Calculator<span>Sheets, mud and tape for finished walls</span>
              </Link>
            </li>
          </ul>

          <h2>Sources and how we calculate</h2>
          <div className={styles.sources}>
            <ul>
              <li>
                US bar sizes and weights: ASTM A615/A615M — bar numbers are the nominal diameter in eighths of an inch, and nominal dimensions
                equal a plain round bar of the same weight per foot. Weights used: #3 0.376 … #11 5.313 lb/ft.
              </li>
              <li>Metric bars: mass per metre = cross-section × 7,850 kg/m³, the basis of BS 4449 nominal masses (e.g. 12 mm = 0.888 kg/m).</li>
              <li>Default edge cover: 3 in (75 mm), the ACI 318 cover for concrete cast against and permanently in contact with the ground.</li>
              <li>Default lap: 40 bar diameters, a common field rule of thumb — not a code requirement. Your drawings govern.</li>
              <li>
                Bars across a span = span ÷ spacing rounded up, plus one. Laps are added when a run is longer than the stock bar. Bars to buy =
                total length (with laps and extra) ÷ stock length, rounded up.
              </li>
              <li>
                Conversions: 1 ft = 0.3048 m; 1 lb = 0.4536 kg. #4 = {n(b4.diameterM * 1000, 1)} mm.
              </li>
              <li>
                Results are quantity estimates for planning and ordering. They are not structural design; follow your engineer’s drawings and
                local building code.
              </li>
            </ul>
          </div>
        </article>

        <div className={styles.adBlock}>
          <AdSlot slotId="rebar-calculator-bottom" />
        </div>
      </main>
    </>
  );
}
