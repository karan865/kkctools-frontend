import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import SlabCostCalculator from '@/components/tool/slab-cost-calculator';
import { CostBar, SlabSectionDiagram, TruckDiagram } from '@/components/tool/slab-cost-calculator/SlabCostDiagram';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  BAG_YIELD_FT3,
  DEFAULT_RATES,
  FT3_PER_YD3,
  NRMCA_AVG_2025,
  PROJECTS,
  PSI_PRICES,
  PUBLISHED_INSTALLED,
  concretePerSqFt,
  psiPrice,
  quickEstimate,
  sqFtPerYd3,
} from '@/lib/slab-cost-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.concreteSlabCostCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

// ---------- every number below comes from the same engine as the tool ----------
const R = DEFAULT_RATES;
const n = (v: number, dp = 0) => v.toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: dp });
const $ = (v: number, dp = 0) => `$${n(v, dp)}`;

const ex = quickEstimate(20, 20, 4); // worked example
const ten = quickEstimate(10, 10, 4);
const thick6 = quickEstimate(20, 20, 6);
const demo = quickEstimate(20, 20, 4, { demolition: true });
const stamped = quickEstimate(20, 20, 4, { finish: 'stamped' });
const big = quickEstimate(30, 40, 4);
const pad = quickEstimate(6, 4, 4, { reinforcement: 'none' }, { concretePerYd3: psiPrice(3000).typical });
const line = (r: typeof ex, id: string) => r.lines.find((l) => l.id === id)?.amount ?? 0;

const sizes = [
  [10, 10],
  [12, 12],
  [12, 20],
  [20, 20],
  [24, 24],
  [30, 30],
  [30, 40],
].map(([l, w]) => ({ l, w, r: quickEstimate(l, w, 4) }));

const thicknesses = [4, 5, 6, 8].map((t) => ({ t, r: quickEstimate(20, 20, t), conc: concretePerSqFt(t, R.concretePerYd3) }));

const projects = PROJECTS.map((p) => ({
  p,
  r: quickEstimate(p.lengthFt, p.widthFt, p.thicknessIn, { reinforcement: p.reinforcement, vaporBarrier: p.vaporBarrier }, { concretePerYd3: psiPrice(p.psi).typical }),
}));
const patio = projects.find((x) => x.p.id === 'patio')!;
const drive = projects.find((x) => x.p.id === 'driveway')!;

const bagPerYd3 = R.bagPrice * (FT3_PER_YD3 / BAG_YIELD_FT3.lb80); // $ of bagged concrete per yd³
const truck = (p: number) => psiPrice(p);
const segOf = (r: typeof ex) => [
  { label: 'Concrete & delivery', amount: r.lines.filter((l) => l.group === 'concrete').reduce((a, l) => a + l.amount, 0), tone: 'concrete' as const },
  { label: 'Base & reinforcement', amount: r.lines.filter((l) => l.group === 'prep').reduce((a, l) => a + l.amount, 0), tone: 'prep' as const },
  { label: 'Labour & finish', amount: r.lines.filter((l) => l.group === 'labour').reduce((a, l) => a + l.amount, 0), tone: 'labour' as const },
];

// ---------- FAQ ----------
const faqs = [
  {
    q: 'How much is a yard of concrete?',
    a: `Ready-mix concrete cost about ${$(PSI_PRICES[0].low)}–${$(PSI_PRICES[4].high)} per cubic yard in the US in 2026, depending on strength (LawnStarter, Sep 2026), and the NRMCA national average for 2025 was ${$(NRMCA_AVG_2025, 2)} (reported by Concrete Network). Small orders add a short-load fee, and some suppliers charge delivery, so a partial load often works out nearer ${$(R.concretePerYd3 + R.shortLoadAmount)} per yard.`,
  },
  {
    q: 'How much does a concrete slab cost per square foot?',
    a: `Published 2026 averages for a plain installed slab run from ${$(PUBLISHED_INSTALLED.lawnStarter.low, 2)} to ${$(PUBLISHED_INSTALLED.lawnStarter.high, 2)} per square foot (LawnStarter, national average ${$(PUBLISHED_INSTALLED.lawnStarter.avg, 2)}) up to ${$(PUBLISHED_INSTALLED.concreteNetwork.low, 2)}–${$(PUBLISHED_INSTALLED.concreteNetwork.high, 2)} (Concrete Network). With this calculator’s default prices, a 20 × 20 ft, 4-inch slab comes to ${$(ex.perSqFt, 2)} per square foot.`,
  },
  {
    q: 'How much does it cost to pour a 20 × 20 concrete slab?',
    a: `About ${$(ex.total)} with a contractor at our default prices (4 in thick, gravel base and wire mesh), or ${$(ex.compare[1].total)} if you place it yourself with ready-mix. It needs ${n(ex.orderYd3, 2)} cubic yards — or ${ex.bags} bags of 80 lb mix, costing ${$(ex.compare[0].total)} with the same base and mesh.`,
  },
  {
    q: 'How much does a 10 × 10 concrete slab cost?',
    a: `Around ${$(ten.total)} installed at 4 inches (${$(ten.perSqFt, 2)} per square foot). Small slabs cost more per square foot because the short-load fee and forms are spread over less area. You would order ${n(ten.orderYd3, 2)} cubic yards or buy ${ten.bags} bags of 80 lb mix.`,
  },
  {
    q: 'How much is a 10-yard truck of concrete?',
    a: `At 2026 prices, 10 cubic yards of ${n(4000)} psi ready-mix comes to about ${$(truck(4000).typical * 10)} (${$(truck(4000).low * 10)}–${$(truck(4000).high * 10)}), and ${$(truck(3000).low * 10)}–${$(truck(5000).high * 10)} across 3,000–5,000 psi mixes. A full truck normally avoids the short-load fee; delivery, waiting time and a pump are extra.`,
  },
  {
    q: 'What is a short-load fee?',
    a: `A charge for ordering less than a full truck, because the truck and driver cost the same either way. LawnStarter lists about $${R.shortLoadAmount} per cubic yard for orders under a 10-yard truckload; other suppliers charge a flat fee. The calculator lets you choose either and set the threshold.`,
  },
  {
    q: 'Is it cheaper to use bags or ready-mix concrete?',
    a: `For most slabs, ready-mix. At ${$(R.bagPrice, 2)} per 80 lb bag (0.60 ft³ each), bagged concrete works out to about ${$(bagPerYd3)} per cubic yard, against ${$(R.concretePerYd3)} for ready-mix plus a short-load fee. On a tiny 6 × 4 ft pad the two come within a few dollars (${$(pad.compare[0].total)} with bags vs ${$(pad.compare[1].total)} with ready-mix), so bags win there on convenience.`,
  },
  {
    q: 'Does the estimate include labour?',
    a: `The contractor total does: placing and finishing labour is set to ${$(R.laborPerSqFt, 2)} per square foot by default, plus forms. The two DIY options leave labour out. Change the labour rate to your contractor’s quote, or set it to 0.`,
  },
  {
    q: 'How much does a concrete patio cost?',
    a: `A ${patio.p.lengthFt} × ${patio.p.widthFt} ft patio, 4 inches thick with mesh and a gravel base, comes to about ${$(patio.r.total)} (${$(patio.r.perSqFt, 2)} per square foot) at our default prices. A stamped finish adds about $${R.stampedPerSqFt} per square foot; colour or stain about ${$(R.coloredPerSqFt, 2)}.`,
  },
  {
    q: 'How much does a concrete driveway cost?',
    a: `A ${drive.p.lengthFt} × ${drive.p.widthFt} ft driveway at ${drive.p.thicknessIn} inches with a rebar grid comes to about ${$(drive.r.total)}, or ${$(drive.r.perSqFt, 2)} per square foot. Thicker concrete, rebar, removing an old driveway and a pump for a long carry all push the price up.`,
  },
  {
    q: 'How much does it cost to remove and replace a concrete slab?',
    a: `Removal and haul-away ran about $2–$6 per square foot in 2026 (Angi; LawnStarter). At the $${R.demoPerSqFt} default, removing a 20 × 20 ft slab adds ${$(line(demo, 'demo'))}, so a remove-and-replace job comes to about ${$(demo.total)}.`,
  },
  {
    q: 'Does a thicker slab cost much more?',
    a: `Less than you might think, because labour and prep stay the same. Going from 4 to 6 inches on a 20 × 20 ft slab raises the concrete from ${$(concretePerSqFt(4, R.concretePerYd3), 2)} to ${$(concretePerSqFt(6, R.concretePerYd3), 2)} per square foot and the total from ${$(ex.total)} to ${$(thick6.total)} (+${n(((thick6.total - ex.total) / ex.total) * 100)}%).`,
  },
  {
    q: 'Do I need a permit for a concrete slab?',
    a: 'It depends on where you live and what the slab is for. Driveways, garage floors and anything structural often need a permit and inspection; a small patio may not. Ask your local building department and enter the fee in the calculator.',
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Concrete Slab Cost Calculator',
  path: route.path,
  description:
    'Free concrete slab cost calculator: itemised estimate for slabs, patios, pads and driveways with editable price per cubic yard, short-load fee, delivery, pump, gravel base, reinforcement, labour, finish and removal, plus DIY bags vs ready-mix vs contractor comparison.',
});
const faqSchema = buildFaqSchema(faqs);

export default function ConcreteSlabCostCalculatorPage() {
  return (
    <>
      <JsonLd data={[webAppSchema, faqSchema]} />
      <main id="main-content" className={styles.main}>
        <Breadcrumbs items={[{ name: 'Tools', path: '/tools/' }, { name: 'Concrete Slab Cost Calculator', path: route.path }]} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Concrete Slab Cost Calculator</h1>
          <p className={styles.lead}>
            Use this free <strong>concrete slab cost calculator</strong> to price a patio, pad, garage floor or driveway before you call for quotes. Enter
            the size and thickness and you get an itemised estimate — concrete by the yard, short-load fee, delivery, pump, gravel base, mesh or rebar,
            labour, finish and removal of an old slab — with the total, the <strong>cost per square foot</strong> and the cost per cubic yard. It also
            shows what the same slab costs if you do it yourself with bags or with ready-mix.
          </p>
          <p className={styles.meta}>
            Last updated: {new Date(route.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} ·
            Prices are typical US ranges, checked November 2026 (enter your local price) · Runs in your browser — nothing you enter is sent anywhere.
          </p>
        </header>

        <section aria-label="Concrete slab cost calculator tool">
          <SlabCostCalculator />
        </section>

        <div className={styles.adBlock}>
          <AdSlot slotId="concrete-slab-cost-calculator-middle" />
        </div>

        <article className={styles.article}>
          <h2>How to use the concrete cost calculator</h2>
          <ol>
            <li>
              <strong>Pick a project</strong> — patio, driveway, garage floor, shed base, walkway or equipment pad. It fills in a typical size,
              thickness, strength and reinforcement that you can change.
            </li>
            <li>
              <strong>Enter your slab size.</strong> Add more slabs if the job has several pours (a patio and a path, say). Choose US or metric units and
              your currency.
            </li>
            <li>
              <strong>Set your local prices.</strong> The defaults are 2026 US averages. Put in your supplier’s price per yard, their short-load rule
              and delivery charge, and your contractor’s labour rate if you have them.
            </li>
            <li>
              <strong>Add what the job needs</strong> — gravel base, vapour barrier, mesh or rebar, a pump, a decorative finish, sealer, removal of an old
              slab, a permit.
            </li>
            <li>
              <strong>Read the total</strong>, the price per square foot and per yard, the itemised list and the bags vs ready-mix vs contractor
              comparison. Copy it, print it or share a link.
            </li>
          </ol>
          <p className={styles.callout}>
            Only need the volume or the number of bags? The <Link href="/concrete-calculator/">concrete calculator</Link> handles slabs, footings,
            columns and post holes. This page is about <strong>cost</strong>.
          </p>

          <h2>How much is a yard of concrete?</h2>
          <p>
            Ready-mix is priced per cubic yard (or cubic metre), and the main thing that moves the price is <strong>strength</strong>. A 3,000 psi mix
            is fine for walkways and most patios; driveways and garage floors usually get 4,000 psi or more. The NRMCA national average for 2025 was{' '}
            <strong>{$(NRMCA_AVG_2025, 2)} per yard</strong>, as reported by Concrete Network, and LawnStarter’s September 2026 guide lists these ranges:
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.note}>Ready-mix price per cubic yard by strength (US, 2026) and what it adds per square foot of a 4-inch slab</caption>
              <thead>
                <tr>
                  <th scope="col">Strength</th>
                  <th scope="col">Price per yd³</th>
                  <th scope="col">Typical (midpoint)</th>
                  <th scope="col">Concrete only, per ft² at 4 in</th>
                  <th scope="col">Full 10-yd truck</th>
                </tr>
              </thead>
              <tbody>
                {PSI_PRICES.map((p) => (
                  <tr key={p.psi}>
                    <td>{n(p.psi)} psi</td>
                    <td>
                      {$(p.low)}–{$(p.high)}
                    </td>
                    <td>
                      <strong>{$(p.typical)}</strong>
                    </td>
                    <td>{$(concretePerSqFt(4, p.typical), 2)}</td>
                    <td>{$(p.typical * 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            One cubic yard covers <strong>{n(sqFtPerYd3(4))} ft² at 4 inches</strong> (or {n(sqFtPerYd3(6))} ft² at 6 inches), which is why concrete
            alone is only about {$(concretePerSqFt(4, R.concretePerYd3), 2)} of a slab’s cost per square foot at 4 inches. The rest is fees, prep and
            labour.
          </p>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <TruckDiagram
                order={ex.orderYd3}
                capacity={R.truckCapacityYd3}
                threshold={R.shortLoadThresholdYd3}
                orderLabel={`20 × 20 ft slab: ${n(ex.orderYd3, 2)} yd³`}
                capLabel="full truck ≈ 10 yd³ · dashed line = short-load limit"
                clipId="page-drum"
              />
              <figcaption>A 20 × 20 ft, 4-inch slab only half-fills a mixer, so the short-load fee applies.</figcaption>
            </figure>
            <div>
              <h3>Short loads, delivery and minimums</h3>
              <p>
                A mixer truck carries about 10 cubic yards. Order less and most plants add a <strong>short-load fee</strong> — LawnStarter lists about $
                {R.shortLoadAmount} per yard under a full truckload — because the truck, driver and fuel cost the same. On the 20 × 20 ft example that is{' '}
                {$(line(ex, 'shortLoad'))}, more than a quarter of the concrete bill.
              </p>
              <p>
                Delivery within about 20 miles is often included; beyond that, or for weekend pours, expect extra charges. Ask about a minimum order
                too: some plants won’t send less than a set amount. A <strong>30 × 40 ft</strong> slab needs {n(big.orderYd3, 2)} yd³ in {big.trucks}{' '}
                trucks and no short-load fee, which is why it costs {$(big.perSqFt, 2)} per ft² against {$(ten.perSqFt, 2)} for a 10 × 10.
              </p>
            </div>
          </div>

          <h2>Concrete slab cost per square foot</h2>
          <p>
            Contractors quote flatwork per square foot, so that is the easiest number to compare. Published 2026 averages for a plain slab, materials and
            labour included, are <strong>{$(PUBLISHED_INSTALLED.lawnStarter.avg, 2)} per ft²</strong> (LawnStarter, typical{' '}
            {$(PUBLISHED_INSTALLED.lawnStarter.low, 2)}–{$(PUBLISHED_INSTALLED.lawnStarter.high, 2)}) and {$(PUBLISHED_INSTALLED.concreteNetwork.low, 2)}–
            {$(PUBLISHED_INSTALLED.concreteNetwork.high, 2)} per ft² (Concrete Network). Thickness changes the concrete line but not the labour, so the
            price per square foot rises more slowly than the volume:
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.note}>20 × 20 ft slab at default prices, by thickness</caption>
              <thead>
                <tr>
                  <th scope="col">Thickness</th>
                  <th scope="col">Concrete to order</th>
                  <th scope="col">Concrete only, per ft²</th>
                  <th scope="col">Installed total</th>
                  <th scope="col">Installed per ft²</th>
                </tr>
              </thead>
              <tbody>
                {thicknesses.map(({ t, r, conc }) => (
                  <tr key={t}>
                    <td>{t} in</td>
                    <td>
                      {n(r.orderYd3, 2)} yd³{r.shortLoad ? '' : ' (no short-load fee)'}
                    </td>
                    <td>{$(conc, 2)}</td>
                    <td>{$(r.total)}</td>
                    <td>
                      <strong>{$(r.perSqFt, 2)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Notice the 8-inch row: at 11 yd³ the order fills a truck, the short-load fee disappears, and the total barely rises over 6 inches. It is
            worth checking whether a slightly bigger order would cross your supplier’s threshold.
          </p>

          <h2>Concrete slab cost by size</h2>
          <p>
            All slabs below are 4 inches thick with a 4-inch gravel base, wire mesh, a broom finish and 10% extra concrete, at the calculator’s default
            prices. Your local prices will differ — the point is how size changes the price per square foot.
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.note}>Concrete slab cost by size, 4 in thick (US 2026 default prices)</caption>
              <thead>
                <tr>
                  <th scope="col">Slab</th>
                  <th scope="col">Area</th>
                  <th scope="col">Order</th>
                  <th scope="col">DIY, 80 lb bags</th>
                  <th scope="col">DIY, ready-mix</th>
                  <th scope="col">Contractor</th>
                  <th scope="col">Per ft²</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map(({ l, w, r }) => (
                  <tr key={`${l}x${w}`}>
                    <td>
                      {l} × {w} ft
                    </td>
                    <td>{n(r.areaSqFt)} ft²</td>
                    <td>{n(r.orderYd3, 2)} yd³</td>
                    <td>
                      {$(r.compare[0].total)} <span className={styles.note}>({r.bags} bags)</span>
                    </td>
                    <td>{$(r.compare[1].total)}</td>
                    <td>
                      <strong>{$(r.total)}</strong>
                    </td>
                    <td>{$(r.perSqFt, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Cost by project: patio, driveway, garage floor, shed base</h2>
          <p>
            Each project preset in the calculator uses a typical size, thickness, strength and reinforcement. These are starting points, not
            specifications — follow your plans and local code, especially for driveways and garage floors.
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.note}>Typical projects at default prices</caption>
              <thead>
                <tr>
                  <th scope="col">Project</th>
                  <th scope="col">Size &amp; thickness</th>
                  <th scope="col">Mix &amp; reinforcement</th>
                  <th scope="col">Contractor</th>
                  <th scope="col">Per ft²</th>
                  <th scope="col">DIY ready-mix</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(({ p, r }) => (
                  <tr key={p.id}>
                    <td>{p.label}</td>
                    <td>
                      {p.lengthFt} × {p.widthFt} ft, {p.thicknessIn} in
                    </td>
                    <td>
                      {n(p.psi)} psi, {p.reinforcement === 'none' ? 'no steel' : p.reinforcement === 'mesh' ? 'wire mesh' : 'rebar'}
                      {p.vaporBarrier ? ', vapour barrier' : ''}
                    </td>
                    <td>
                      <strong>{$(r.total)}</strong>
                    </td>
                    <td>{$(r.perSqFt, 2)}</td>
                    <td>{$(r.compare[1].total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Decorative work changes the picture: stamping the same 20 × 20 ft slab adds {$(line(stamped, 'finish'))} at ${R.stampedPerSqFt}/ft², taking it
            to {$(stamped.total)} ({$(stamped.perSqFt, 2)} per ft²). Colour or stain is about {$(R.coloredPerSqFt, 2)}/ft² and a sealer about{' '}
            {$(R.sealerPerSqFt, 2)}/ft².
          </p>

          <h2>What a contractor’s quote includes</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <SlabSectionDiagram thicknessLabel="4 in slab" baseLabel="4 in" reinforcement="mesh" vapor hasBase />
              <figcaption>A typical slab build-up: compacted soil, gravel base, vapour barrier (indoors), mesh or rebar, concrete.</figcaption>
            </figure>
            <div>
              <p>Quotes are rarely just “concrete”. These are the lines to look for, with the default price the calculator uses:</p>
              <ul>
                <li>
                  <strong>Concrete</strong> per yard, plus any <strong>short-load</strong>, delivery, weekend or waiting-time charges.
                </li>
                <li>
                  <strong>Pump</strong> when the truck can’t reach — about $400–$600 minimum for a line pump and $800–$1,000 for a boom pump (Angi, 2026).
                </li>
                <li>
                  <strong>Gravel base</strong> — {DEFAULT_RATES.baseCompactionPct}% extra for compaction at {DEFAULT_RATES.baseTonsPerYd3} tons per yard; ${R.basePerTon}
                  /ton delivered.
                </li>
                <li>
                  <strong>Reinforcement</strong> — wire mesh about {$(R.meshPerSqFt, 2)}/ft², a rebar grid $2–$3/ft² (This Old House, 2026). Size steel with the{' '}
                  <Link href="/rebar-calculator/">rebar calculator</Link>.
                </li>
                <li>
                  <strong>Vapour barrier</strong> under interior slabs, about {$(R.vaporPerSqFt, 2)}/ft².
                </li>
                <li>
                  <strong>Forms, stakes and joint material</strong>, and <strong>placing and finishing labour</strong>.
                </li>
                <li>
                  <strong>Removal</strong> of an old slab, <strong>permits</strong>, and the contractor’s <strong>overhead and profit</strong> if not built into
                  their rates.
                </li>
              </ul>
            </div>
          </div>
          <h3>Worked example: 20 × 20 ft slab, 4 inches</h3>
          <p>
            Volume: 20 × 20 × 4 ÷ 324 = {n(ex.netYd3, 2)} yd³. Add 10% = {n(ex.withWasteYd3, 2)} yd³, rounded up to <strong>{n(ex.orderYd3, 2)} yd³</strong>.
            Gravel base: 4 inches compacted × 1.15 × 1.4 = {n(ex.baseTons, 2)} tons. Then:
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.note}>Itemised estimate for the 20 × 20 ft example</caption>
              <thead>
                <tr>
                  <th scope="col">Line</th>
                  <th scope="col">Working</th>
                  <th scope="col">Cost</th>
                </tr>
              </thead>
              <tbody>
                {ex.lines.map((l) => (
                  <tr key={l.id}>
                    <td>{l.label}</td>
                    <td>{l.detail}</td>
                    <td>{$(l.amount, 2)}</td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
                  <td>
                    {$(ex.perSqFt, 2)} per ft² · {$(ex.perOrderedYd3)} per yard ordered
                  </td>
                  <td>
                    <strong>{$(ex.total, 2)}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <figure className={styles.figureBox}>
            <CostBar segments={segOf(ex)} format={(v) => $(v)} />
            <figcaption>
              Labour is the biggest single line ({n((ex.labourTotal / ex.total) * 100)}% of the total); concrete with its short-load fee is{' '}
              {n((ex.concreteOnly / ex.total) * 100)}%.
            </figcaption>
          </figure>

          <h2>Bags vs ready-mix vs hiring a contractor</h2>
          <p>
            Bagged concrete is convenient but expensive by volume: at {$(R.bagPrice, 2)} per 80 lb bag and 0.60 ft³ per bag, it costs about{' '}
            <strong>{$(bagPerYd3)} per cubic yard</strong> — compared with {$(R.concretePerYd3)} for ready-mix, or {$(R.concretePerYd3 + R.shortLoadAmount)}{' '}
            with a short-load fee. On a 6 × 4 ft pad the two are within a few dollars ({$(pad.compare[0].total)} vs {$(pad.compare[1].total)}), so bags make
            sense for small pads, post bases and repairs. From a 10 × 10 slab up, ready-mix is cheaper ({$(ten.compare[1].total)} vs{' '}
            {$(ten.compare[0].total)}) and far less work: {ten.bags} bags is roughly {n((ten.bags * 80) / 2000, 1)} tons to lift and mix.
          </p>
          <p>
            Hiring a contractor adds labour, but you get the forms, the finishing skill and, often, a warranty. For a 20 × 20 slab the difference between
            DIY ready-mix and a contractor is {$(ex.total - ex.compare[1].total)} at our default labour rate. Concrete sets on a schedule — a big pour
            needs several experienced people working at once, so be honest about the help you have.
          </p>

          <h2>Ways to save on a concrete slab</h2>
          <ul>
            <li>
              <strong>Fill a truck or share one.</strong> The short-load fee disappears at a full load; neighbours sometimes split a delivery.
            </li>
            <li>
              <strong>Avoid the pump</strong> by keeping a clear path for the truck chute — or by using wheelbarrows for a short carry.
            </li>
            <li>
              <strong>Do the prep yourself:</strong> digging, the gravel base and forms are slow, low-risk work; leave placing and finishing to people
              who do it every day.
            </li>
            <li>
              <strong>Choose the right thickness and strength</strong> — over-specifying adds cost, under-specifying cracks. Follow your plans and local
              code.
            </li>
            <li>
              <strong>Get two or three itemised quotes</strong> and compare them line by line with the estimate from this page.
            </li>
          </ul>

          <h2>Removing and replacing an old slab</h2>
          <p>
            Breaking out and hauling away old concrete cost about $2–$6 per ft² in 2026, more for thick or reinforced slabs and in big cities (Angi;
            LawnStarter). Tick <strong>Remove an old slab first</strong> in the calculator: at the ${R.demoPerSqFt}/ft² default, a 20 × 20 ft replacement
            comes to {$(demo.total)}, of which {$(line(demo, 'demo'))} is removal.
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

          <HowWeCalculate slug="concrete-slab-cost-calculator" />

          <h2>Related calculators</h2>
          <ul className={styles.related}>
            <li>
              <Link href="/concrete-calculator/">
                Concrete Calculator<span>Volume and bags for any shape</span>
              </Link>
            </li>
            <li>
              <Link href="/rebar-calculator/">
                Rebar Calculator<span>Bars, laps and weight for the slab</span>
              </Link>
            </li>
            <li>
              <Link href="/stone-calculator/">
                Stone &amp; Gravel Calculator<span>Base stone in tons and yards</span>
              </Link>
            </li>
            <li>
              <Link href="/paver-base-calculator/">
                Paver Base Calculator<span>Compacted base with compaction allowance</span>
              </Link>
            </li>
            <li>
              <Link href="/cubic-yard-calculator/">
                Cubic Yard Calculator<span>Yards of soil, mulch or fill</span>
              </Link>
            </li>
            <li>
              <Link href="/construction-estimate-template/">
                Construction Estimate Template<span>Turn the numbers into a quote</span>
              </Link>
            </li>
          </ul>

          <p className={styles.note}>
            Disclaimer: results are planning estimates. Default prices are US national figures from the 2026 cost guides listed above and will not match
            every market; they do not include taxes. Slab design (thickness, strength, reinforcement, joints, base) should follow your plans, local code
            and, for structural slabs, an engineer. Get itemised quotes before you order. See our <Link href="/disclaimer/">disclaimer</Link>.
          </p>
        </article>

        <div className={styles.adBlock}>
          <AdSlot slotId="concrete-slab-cost-calculator-bottom" />
        </div>
      </main>
    </>
  );
}
