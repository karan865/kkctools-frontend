import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import ConcreteCalculator from '@/components/tool/concrete-calculator';
import ShapeDiagram, { InsideFormsDiagram } from '@/components/tool/concrete-calculator/ShapeDiagram';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  BAGS,
  M_PER_FT,
  M_PER_IN,
  SHAPES,
  SHAPE_ORDER,
  bagsNeeded,
  calculateJob,
  m3ToFt3,
  m3ToYd3,
  roundUpTo,
  yd3ToM3,
  type JobItem,
} from '@/lib/concrete-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.concreteCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

// ---------- numbers used in the article: all computed by the same engine as the tool ----------
const ft = (v: number) => v * M_PER_FT;
const inch = (v: number) => v * M_PER_IN;
const n = (v: number, max = 2) => v.toLocaleString('en-US', { maximumFractionDigits: max });

function job(items: Omit<JobItem, 'id'>[], waste = 10) {
  const r = calculateJob({
    items: items.map((it, i) => ({ ...it, id: `x${i}` })),
    wastePercent: waste,
    densityKgM3: 2400,
    truckCapacityM3: yd3ToM3(10),
  });
  const bag = (id: string) => r.bags.find((b) => b.id === id)?.count ?? 0;
  return {
    netFt3: m3ToFt3(r.netM3),
    netYd3: m3ToYd3(r.netM3),
    totalFt3: m3ToFt3(r.totalM3),
    totalYd3: m3ToYd3(r.totalM3),
    totalM3: r.totalM3,
    netM3: r.netM3,
    bag,
  };
}

const exSlab = job([{ shape: 'slab', qty: 1, values: { length: ft(10), width: ft(10), thickness: inch(4) } }]);
const exSlabNoWaste = job([{ shape: 'slab', qty: 1, values: { length: ft(10), width: ft(10), thickness: inch(4) } }], 0);
const exFooting = job([{ shape: 'footing', qty: 1, values: { length: ft(20), width: inch(16), depth: inch(8) } }]);
const exPosts = job([{ shape: 'postHoles', qty: 8, values: { diameter: inch(10), depth: inch(24), postSize: inch(3.5) } }]);
const exOnePost = job([{ shape: 'postHoles', qty: 1, values: { diameter: inch(10), depth: inch(24), postSize: inch(3.5) } }], 0);
const exTubes = job([{ shape: 'roundColumn', qty: 4, values: { diameter: inch(12), height: ft(4) } }]);
const exSteps = job([{ shape: 'steps', qty: 1, values: { stepCount: 3, rise: inch(7), run: inch(11), width: ft(4) } }]);
const exMetric = job([{ shape: 'slab', qty: 1, values: { length: 4, width: 3, thickness: 0.1 } }]);
const exCombo = job([
  { shape: 'slab', qty: 1, values: { length: ft(12), width: ft(12), thickness: inch(4) } },
  { shape: 'postHoles', qty: 4, values: { diameter: inch(10), depth: inch(30), postSize: inch(5.5) } },
]);

const ONE_YD3 = yd3ToM3(1);
const bagRows = BAGS.map((b) => ({
  label: b.label,
  system: b.system,
  yieldFt3: m3ToFt3(b.yieldM3),
  yieldL: b.yieldM3 * 1000,
  perYd3: bagsNeeded(ONE_YD3, b.yieldM3),
  perM3: bagsNeeded(1, b.yieldM3),
}));

const slabSizes: [number, number][] = [[10, 10], [10, 12], [12, 12], [12, 20], [20, 20], [24, 24]];
const slabRows = slabSizes.map(([l, w]) => {
  const four = job([{ shape: 'slab', qty: 1, values: { length: ft(l), width: ft(w), thickness: inch(4) } }], 0);
  const six = job([{ shape: 'slab', qty: 1, values: { length: ft(l), width: ft(w), thickness: inch(6) } }], 0);
  return { l, w, four, six };
});

const bagsPerYd80 = bagsNeeded(ONE_YD3, BAGS.find((b) => b.id === 'lb80')!.yieldM3);
const bagsPerYd80Plus10 = bagsNeeded(ONE_YD3 * 1.1, BAGS.find((b) => b.id === 'lb80')!.yieldM3);

// ---------- FAQ (answers built from the engine numbers above) ----------
const faqs = [
  {
    q: 'How many 80 lb bags of concrete are in a cubic yard?',
    a: `An 80 lb bag yields about 0.60 cubic feet, and a cubic yard is 27 cubic feet, so one cubic yard takes ${bagsPerYd80} bags of 80 lb mix. Add 10% for waste and buy ${bagsPerYd80Plus10}. The same yard takes ${bagRows.find((r) => r.label === '60 lb')!.perYd3} bags of 60 lb mix or ${bagRows.find((r) => r.label === '40 lb')!.perYd3} bags of 40 lb mix.`,
  },
  {
    q: 'How do you figure concrete in yards?',
    a: 'Multiply length in feet by width in feet by thickness in feet (inches ÷ 12) to get cubic feet, then divide by 27. A 10 × 10 ft slab 4 inches thick is 10 × 10 × 0.333 = 33.3 cubic feet, and 33.3 ÷ 27 = 1.23 cubic yards before any extra.',
  },
  {
    q: 'How much concrete do I need for a 10×10 slab that is 4 inches thick?',
    a: `${n(exSlabNoWaste.netFt3, 1)} cubic feet, or ${n(exSlabNoWaste.netYd3)} cubic yards. With 10% extra that becomes ${n(exSlab.totalYd3)} cubic yards: ${exSlab.bag('lb80')} bags of 80 lb mix, ${exSlab.bag('lb60')} bags of 60 lb mix, or a ready-mix order of ${n(roundUpTo(exSlab.totalYd3, 0.25))} cubic yards.`,
  },
  {
    q: 'How much extra concrete should I order?',
    a: 'Add 5% when the forms are straight and the base is flat and compacted, 10% for most home projects, and 15–20% when the ground is uneven or the holes are dug by hand. Running short in the middle of a pour causes a weak cold joint, so a few spare bags are cheap insurance.',
  },
  {
    q: 'How many bags of concrete do I need for a fence post?',
    a: `A 10-inch-wide, 24-inch-deep hole around a 4×4 post holds about ${n(exOnePost.netFt3)} cubic feet of concrete. That is ${exOnePost.bag('lb80')} bags of 80 lb mix or ${exOnePost.bag('lb50')} bags of 50 lb mix per post. Bigger holes or longer posts need more — use the post-hole shape in the calculator, which subtracts the space the post takes up.`,
  },
  {
    q: 'How many yards of concrete are in a cement truck?',
    a: 'There is no single size. Many standard mixer trucks carry roughly 8 to 10 cubic yards per load, smaller trucks carry less, and local road weight limits can reduce a full load. Ask your supplier for their load size and enter it in the calculator’s advanced settings to get the number of truck loads.',
  },
  {
    q: 'Should I use bagged concrete or order ready-mix?',
    a: `As a rule of thumb, bags make sense up to about one cubic yard (${bagsPerYd80} × 80 lb bags) — fence posts, small pads, steps and repairs. Above that, mixing by hand gets slow and the first batches can start to set before the last ones are placed, so get a ready-mix quote. Ask about minimum orders and short-load fees.`,
  },
  {
    q: 'How thick should a concrete slab be?',
    a: 'Patios, walkways and shed bases are commonly poured 4 inches (10 cm) thick. Driveways for cars are often 4–5 inches and 6 inches where heavier vehicles park. Footings and structural slabs should follow your plans and local building code.',
  },
  {
    q: 'Is concrete the same as cement?',
    a: 'No. Cement is the fine grey powder that acts as the glue. Concrete is the finished material: cement mixed with sand, gravel or crushed stone, and water. A bag labelled “concrete mix” already contains all the dry ingredients — you only add water.',
  },
  {
    q: 'How many cubic yards are in a cubic metre?',
    a: 'One cubic metre equals about 1.31 cubic yards, and one cubic yard equals about 0.76 cubic metres (27 cubic feet). The calculator shows yd³, ft³ and m³ side by side, so you can order in whichever unit your supplier uses.',
  },
  {
    q: 'How much water goes in an 80 lb bag of concrete?',
    a: 'The QUIKRETE data sheet for its Concrete Mix suggests starting with about 6 pints (2.8 litres) of water per 80 lb bag and not going past about 9 pints (4.3 litres). Too much water makes the mix easier to pour but weaker once it cures.',
  },
  {
    q: 'Does the calculator include rebar or wire mesh?',
    a: 'No. Rebar and mesh take up very little of the slab’s volume, so the concrete estimate stays the same. Plan reinforcement, forms, gravel base and labour separately.',
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Concrete Calculator',
  path: route.path,
  description:
    'Free concrete volume calculator for slabs, footings, round pads, walls, columns, Sonotubes, post holes and steps. Shows cubic yards, cubic feet, cubic metres, bag counts and ready-mix truck loads.',
});
const faqSchema = buildFaqSchema(faqs);

const shapeNotes: Record<string, string> = {
  slab: 'Patios, driveways, shed bases and garage floors. Enter the inside size of the forms and the finished thickness.',
  footing: 'Strip footings and trenches under walls. Width and depth are usually set by your plans or local code.',
  circle: 'Round pads for fire pits, hot tubs or planters. Measure straight across the centre for the diameter.',
  wall: 'Poured walls and kerbs. Use the thickness between the inside faces of the wall forms.',
  squareColumn: 'Square piers and columns. Measure the inside of the form, not the finished cladding.',
  roundColumn: 'Sonotubes and round piers for decks and porches. Use the tube’s inside diameter.',
  postHoles: 'Fence and deck posts set in concrete. The calculator subtracts the post so you don’t over-buy.',
  steps: 'Solid steps poured on the ground. Each step is a block that sits on the one below, so volume grows with every step.',
};

export default function ConcreteCalculatorPage() {
  return (
    <>
      <JsonLd data={[webAppSchema, faqSchema]} />
      <main id="main-content" className={styles.main}>
        <Breadcrumbs items={[{ name: 'Tools', path: '/tools/' }, { name: 'Concrete Calculator', path: route.path }]} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Concrete Calculator: Volume in Cubic Yards, m³ &amp; Bags</h1>
          <p className={styles.lead}>
            This free <strong>concrete volume calculator</strong> works out how much concrete you need for slabs, footings, round
            pads, walls, columns, Sonotubes, fence-post holes and steps. Add as many pours as your project has, pick how much extra to
            allow, and get the total in cubic yards, cubic feet and cubic metres — plus the number of 40, 50, 60, 80 or 90 lb bags (or
            20–40 kg bags) and how many ready-mix truck loads to order.
          </p>
          <p className={styles.meta}>Last updated: {new Date(route.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} · Runs in your browser — nothing you enter is sent anywhere.</p>
        </header>

        <section aria-label="Concrete calculator tool">
          <ConcreteCalculator />
        </section>

        <div className={styles.adBlock}>
          <AdSlot slotId="concrete-calculator-middle" />
        </div>

        <article className={styles.article}>
          <h2>How to use this concrete calculator</h2>
          <ol>
            <li>
              <strong>Pick your units.</strong> Use feet and inches or metres and centimetres. Switching later converts the sizes you
              have already typed.
            </li>
            <li>
              <strong>Choose a shape for each pour</strong> and fill in the sizes shown on its diagram. Most jobs have more than one
              part — a patio plus its footing, or a deck with eight post holes — so press <em>Add another pour</em> for each part.
            </li>
            <li>
              <strong>Set the extra for waste.</strong> 10% is a sensible default. The total, bag counts and truck loads update as you
              type.
            </li>
            <li>
              <strong>Decide how to buy.</strong> Compare the bag count with the ready-mix order, add your local prices if you want a
              cost, then copy, print or share the result.
            </li>
          </ol>

          <h2>Concrete volume formulas for every shape</h2>
          <p>
            Every concrete estimate starts with the same idea: volume = area × thickness. The shape only changes how you get the area.
            Convert every measurement to the same unit first — feet for a result in cubic feet, metres for cubic metres — and divide
            cubic feet by 27 to get cubic yards.
          </p>
          <div className={styles.shapeGrid}>
            {SHAPE_ORDER.map((id) => (
              <figure key={id} className={styles.shapeCard}>
                <ShapeDiagram shape={id} />
                <figcaption>
                  <h3>{SHAPES[id].label}</h3>
                  <code>{SHAPES[id].formula}</code>
                  <p>{shapeNotes[id]}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <p>
            For round shapes, π is about 3.1416 and the radius is half the diameter. For post holes, the calculator works out the
            volume of the hole and takes away the part of the post that sits below ground (P × P × H for a square post). For solid steps,
            the bottom step is one rise tall, the next is two rises tall and so on, which is where N × (N + 1) ÷ 2 comes from.
          </p>

          <h2>Measure inside the forms</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <InsideFormsDiagram />
              <figcaption>Length and width are the inside faces of the form boards.</figcaption>
            </figure>
            <div>
              <p>
                Concrete fills the space between your form boards, so measure from the inside face of one board to the inside face of
                the opposite board. Measuring the outside adds the thickness of two boards to each side and can push a small slab’s
                estimate up by several percent.
              </p>
              <p>
                Check the depth in a few places too. A base that dips by half an inch over a 12 × 12 ft patio adds about 6 cubic feet of
                concrete — roughly ten 80 lb bags — which is why a waste allowance matters.
              </p>
            </div>
          </div>

          <h2>Worked examples</h2>
          <p>All examples use 10% extra for waste unless stated. They are calculated with the same code that runs the tool above.</p>
          <div className={styles.examples}>
            <div className={styles.exampleCard}>
              <h3>10 × 10 ft patio, 4 in thick</h3>
              <p className={styles.exampleMeta}>Slab · imperial</p>
              <ul>
                <li>Volume: {n(exSlab.netFt3, 1)} ft³ = {n(exSlab.netYd3)} yd³</li>
                <li>With 10%: <strong>{n(exSlab.totalYd3)} yd³</strong></li>
                <li>Bags: {exSlab.bag('lb80')} × 80 lb or {exSlab.bag('lb60')} × 60 lb</li>
                <li>Ready-mix: order {n(roundUpTo(exSlab.totalYd3, 0.25))} yd³</li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>20 ft footing, 16 in wide, 8 in deep</h3>
              <p className={styles.exampleMeta}>Footing · imperial</p>
              <ul>
                <li>Volume: {n(exFooting.netFt3, 1)} ft³ = {n(exFooting.netYd3)} yd³</li>
                <li>With 10%: <strong>{n(exFooting.totalYd3)} yd³</strong></li>
                <li>Bags: {exFooting.bag('lb80')} × 80 lb</li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>8 fence posts (4×4) in 10 × 24 in holes</h3>
              <p className={styles.exampleMeta}>Post holes · post subtracted</p>
              <ul>
                <li>Volume: {n(exPosts.netFt3)} ft³</li>
                <li>With 10%: <strong>{n(exPosts.totalFt3)} ft³</strong></li>
                <li>Bags: {exPosts.bag('lb80')} × 80 lb or {exPosts.bag('lb50')} × 50 lb</li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>4 Sonotubes, 12 in × 4 ft</h3>
              <p className={styles.exampleMeta}>Round columns · deck footings</p>
              <ul>
                <li>Volume: {n(exTubes.netFt3)} ft³</li>
                <li>With 10%: <strong>{n(exTubes.totalFt3)} ft³</strong></li>
                <li>Bags: {exTubes.bag('lb80')} × 80 lb</li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>3 solid steps, 4 ft wide</h3>
              <p className={styles.exampleMeta}>7 in rise · 11 in run</p>
              <ul>
                <li>Volume: {n(exSteps.netFt3)} ft³</li>
                <li>With 10%: <strong>{n(exSteps.totalFt3)} ft³</strong></li>
                <li>Bags: {exSteps.bag('lb80')} × 80 lb</li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>4 × 3 m slab, 10 cm thick</h3>
              <p className={styles.exampleMeta}>Slab · metric</p>
              <ul>
                <li>Volume: {n(exMetric.netM3)} m³</li>
                <li>With 10%: <strong>{n(exMetric.totalM3)} m³</strong></li>
                <li>Bags: {exMetric.bag('kg25')} × 25 kg (estimated yield)</li>
                <li>Ready-mix: order {n(roundUpTo(exMetric.totalM3, 0.25))} m³</li>
              </ul>
            </div>
          </div>
          <p className={styles.callout}>
            <strong>Combining pours:</strong> a 12 × 12 ft, 4 in patio plus four 10 × 30 in post holes for 6×6 pergola posts comes to{' '}
            {n(exCombo.totalYd3)} yd³ with 10% extra ({exCombo.bag('lb80')} × 80 lb bags). Add both parts in the calculator instead of
            running two separate estimates.
          </p>

          <h2>How many bags of concrete are in a yard?</h2>
          <p>
            Bagged concrete is sold by weight, but what you need is volume. The US yields below come from the QUIKRETE Concrete Mix data
            sheet. Metric bag yields are estimated with the same yield per kilogram, so check the label on the bag you buy. Counts are
            rounded up to whole bags and do not include extra for waste.
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Bag size</th>
                  <th scope="col">Yield per bag</th>
                  <th scope="col">Bags per cubic yard</th>
                  <th scope="col">Bags per cubic metre</th>
                </tr>
              </thead>
              <tbody>
                {bagRows.map((r) => (
                  <tr key={r.label}>
                    <td>
                      {r.label}
                      {r.system === 'metric' ? ' (estimated)' : ''}
                    </td>
                    <td>
                      {n(r.yieldFt3, 3)} ft³ · {n(r.yieldL, 1)} L
                    </td>
                    <td>{r.perYd3}</td>
                    <td>{r.perM3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Cubic yards for common slab sizes</h2>
          <p>
            Exact volumes with no waste added. Multiply by 1.10 for 10% extra, or let the calculator do it. The bag column assumes 80 lb
            bags.
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Slab size</th>
                  <th scope="col">4 in thick</th>
                  <th scope="col">80 lb bags (4 in)</th>
                  <th scope="col">6 in thick</th>
                  <th scope="col">80 lb bags (6 in)</th>
                </tr>
              </thead>
              <tbody>
                {slabRows.map((r) => (
                  <tr key={`${r.l}x${r.w}`}>
                    <td>
                      {r.l} × {r.w} ft
                    </td>
                    <td>{n(r.four.netYd3)} yd³</td>
                    <td>{r.four.bag('lb80')}</td>
                    <td>{n(r.six.netYd3)} yd³</td>
                    <td>{r.six.bag('lb80')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>How thick should a concrete slab be?</h2>
          <p>
            Thickness has the biggest effect on volume: going from 4 to 6 inches adds 50% more concrete. These are common starting
            points for residential work. Your plans, soil and local building code have the final say, especially for footings and
            anything that carries a structure.
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Project</th>
                  <th scope="col">Typical thickness</th>
                  <th scope="col">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Walkway, patio, shed base</td>
                  <td>4 in (10 cm)</td>
                  <td>On a compacted gravel base</td>
                </tr>
                <tr>
                  <td>Driveway (cars)</td>
                  <td>4–5 in (10–13 cm)</td>
                  <td>Thicker at edges and where water collects</td>
                </tr>
                <tr>
                  <td>Driveway or pad for heavier vehicles</td>
                  <td>6 in (15 cm)</td>
                  <td>RVs, trucks, trailers</td>
                </tr>
                <tr>
                  <td>Garage floor</td>
                  <td>4–6 in (10–15 cm)</td>
                  <td>Check local code</td>
                </tr>
                <tr>
                  <td>Footings, foundation walls</td>
                  <td>As specified</td>
                  <td>Set by plans and building code</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Bags or ready-mix: which should you buy?</h2>
          <p>
            The calculator shows both so you can compare. For small jobs, bags win: you can buy exactly what you need, mix in a
            wheelbarrow or small mixer, and work at your own pace. A cubic yard of bagged mix is {bagsPerYd80} bags of 80 lb — roughly
            3,600 lb to lift, carry and mix — so check your vehicle’s payload rating before you load it all at once.
          </p>
          <p>
            Past about a cubic yard, ready-mix is usually easier. The concrete arrives mixed and is placed in one go, which avoids joints
            between batches. Suppliers sell by the cubic yard or cubic metre and often in steps such as a quarter yard, which is why the
            calculator rounds the order up. Many charge extra for small loads, so ask about minimum orders, delivery and pump charges when
            you get a quote.
          </p>

          <h2>How much extra concrete to order</h2>
          <ul>
            <li>
              <strong>5%</strong> — straight, rigid forms on a flat, compacted base.
            </li>
            <li>
              <strong>10%</strong> — most home slabs, footings and steps. This is the calculator’s default.
            </li>
            <li>
              <strong>15–20%</strong> — uneven ground, hand-dug post holes, curved forms or your first pour.
            </li>
          </ul>
          <p>
            Running short is worse than having a little left over. If a pour stops halfway, the first part starts to harden before the
            rest arrives, leaving a weak seam. Leftover bags keep for later repairs if you store them dry.
          </p>

          <h2>Common mistakes</h2>
          <ul>
            <li>
              <strong>Mixing inches and feet.</strong> A 4-inch slab is 0.333 ft thick, not 4 ft. Entering thickness in the inches box
              avoids this.
            </li>
            <li>
              <strong>Measuring the outside of the forms.</strong> Always use the inside faces.
            </li>
            <li>
              <strong>Forgetting the extra parts.</strong> Thickened slab edges, footings and post holes are often left out — add them
              as separate pours.
            </li>
            <li>
              <strong>Rounding bags down.</strong> 61.1 bags means buying 62. The calculator always rounds up.
            </li>
            <li>
              <strong>Ignoring the post in a post hole.</strong> A 6×6 post in a 12-inch hole takes up about a quarter of the space.
            </li>
          </ul>

          <h2>Mixing concrete from cement, sand and gravel</h2>
          <p>
            If you mix your own instead of buying premixed bags, open the <em>Mixing from scratch</em> panel in the results. It splits
            the total into cement, sand and gravel for a chosen ratio such as 1 : 2 : 4, using the common site rule that loose dry
            materials take about 54% more space than the finished concrete. These are nominal mixes for general work; anything
            structural should use the mix your engineer or local code specifies.
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

          <h2>Related calculators</h2>
          <ul className={styles.related}>
            <li>
              <Link href="/cubic-yard-calculator/">
                Cubic Yard Calculator<span>Soil, mulch, gravel and other bulk materials</span>
              </Link>
            </li>
            <li>
              <Link href="/cinder-block-calculator/">
                Cinder Block Calculator<span>Blocks and mortar for CMU walls</span>
              </Link>
            </li>
            <li>
              <Link href="/brick-calculator/">
                Brick Calculator<span>Bricks and mortar for walls</span>
              </Link>
            </li>
            <li>
              <Link href="/paver-base-calculator/">
                Paver Base Calculator<span>Gravel base under slabs and patios</span>
              </Link>
            </li>
            <li>
              <Link href="/stone-calculator/">
                Stone Calculator<span>Crushed stone in tons and yards</span>
              </Link>
            </li>
            <li>
              <Link href="/tons-to-cubic-yards/">
                Tons to Cubic Yards<span>Convert material weight to volume</span>
              </Link>
            </li>
          </ul>

          <h2>Sources and how we calculate</h2>
          <div className={styles.sources}>
            <ul>
              <li>
                Bag yields (40 lb 0.30 ft³, 50 lb 0.375 ft³, 60 lb 0.45 ft³, 80 lb 0.60 ft³, 90 lb 0.675 ft³), mixing water and curing
                guidance:{' '}
                <a href="https://www.quikrete.com/pdfs/DATA_SHEET-Concrete%20Mix%201101.pdf" rel="nofollow noopener" target="_blank">
                  QUIKRETE Concrete Mix No. 1101 data sheet
                </a>{' '}
                (revised October 2022). The same sheet lists a unit weight of about 140 lb/ft³ for that mix.
              </li>
              <li>
                Metric bag yields are not from a manufacturer: they apply the same yield per kilogram (≈ 0.47 L of concrete per kg of dry
                mix). Use your bag’s printed yield if it differs.
              </li>
              <li>
                Weight uses 150 lb/ft³ (2,400 kg/m³) by default, a common figure for normal-weight concrete; change it in the advanced
                settings.
              </li>
              <li>Conversions: 1 yd³ = 27 ft³ = 0.7646 m³; 1 ft = 0.3048 m; 1 in = 2.54 cm.</li>
              <li>
                Results are planning estimates. They do not replace engineering design, local building code or your supplier’s advice.
              </li>
            </ul>
          </div>
        </article>

        <div className={styles.adBlock}>
          <AdSlot slotId="concrete-calculator-bottom" />
        </div>
      </main>
    </>
  );
}
