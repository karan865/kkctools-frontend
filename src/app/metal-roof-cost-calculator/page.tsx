import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import MetalRoofCalculator from '@/components/tool/metal-roof-calculator';
import { CompareBars, PanelDiagram } from '@/components/tool/metal-roof-calculator/MetalRoofDiagram';
import { PitchDiagram } from '@/components/tool/shingle-calculator/ShingleDiagram';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import { ASPHALTS, METALS, METAL_LIFE, TEAR_OFF_RANGE, calculateMetalRoof, defaultMetalInput, metalById, roofOfArea } from '@/lib/metal-roof-engine';
import { pitchFactor } from '@/lib/shingle-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.metalRoofCostCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

// ---------- every number below comes from the same engine as the tool ----------
const n = (v: number, dp = 0) => v.toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: dp });
const $ = (v: number, dp = 0) => `$${n(v, dp)}`;

const ex = calculateMetalRoof(defaultMetalInput()); // 40 × 28 ft gable, 6/12, standing seam, tear-off
const byType = METALS.map((m) => ({ m, r: calculateMetalRoof(defaultMetalInput({ metal: m.id, metalPrice: m.price, coverageIn: m.coverageIn })) }));
const corr = byType.find((x) => x.m.id === 'corrugated')!;
const ss = metalById('standingSeam');
const arch = ASPHALTS[0];
const noTear = calculateMetalRoof(defaultMetalInput({ tearOff: false }));
const sizes = [1000, 1500, 2000, 2500, 3000].map((A) => ({ A, metals: METALS.map((m) => roofOfArea(A, { metal: m.id, metalPrice: m.price }).metal.total), asphalt: roofOfArea(A).asphalt.total }));
const r2000 = sizes.find((x) => x.A === 2000)!;
const f6 = pitchFactor(6);

// ---------- FAQ ----------
const faqs = [
  {
    q: 'How much does a metal roof cost?',
    a: `Installed, about $${METALS[1].range[0]}–$${METALS[1].range[1]} per sq ft for corrugated (exposed-fastener) metal, $${METALS[2].range[0]}–$${METALS[2].range[1]} for metal shingles and $${ss.range[0]}–$${ss.range[1]} for standing seam (HomeGuide, 2026), plus $${TEAR_OFF_RANGE[0]}–$${TEAR_OFF_RANGE[1]} per sq ft to tear off the old roof. A ${n(ex.roofArea)} sq ft roof (about ${n(ex.squares)} squares) comes to roughly ${$(ex.metal.total)} in standing seam at the midpoints.`,
  },
  {
    q: 'How much is a metal roof per square foot?',
    a: `At the midpoints, ${$(METALS[1].price, 2)} for corrugated, ${$(METALS[2].price, 2)} for metal shingles and ${$(ss.price, 2)} for standing seam — or ${$(METALS[1].price * 100)}, ${$(METALS[2].price * 100)} and ${$(ss.price * 100)} per square (100 sq ft). Tear-off adds about $2 per sq ft.`,
  },
  {
    q: 'How much does a standing seam metal roof cost?',
    a: `About $${ss.range[0]}–$${ss.range[1]} per sq ft installed (HomeGuide, 2026). For a 2,000 sq ft roof that is about ${$(r2000.metals[0])} at the ${$(ss.price, 2)} midpoint including tear-off; copper or zinc standing seam costs much more.`,
  },
  {
    q: 'Is a metal roof cheaper than shingles?',
    a: `Not up front: on the example roof, standing seam costs ${n(ex.ratio, 1)}× as much as architectural shingles (${$(ex.metal.total)} vs ${$(ex.asphalt.total)}). Spread over its longer life it costs ${$(ex.metal.perYear)} a year against ${$(ex.asphalt.perYear)} for shingles, and corrugated metal comes close to shingles at ${$(corr.r.metal.perYear)} a year.`,
  },
  {
    q: 'What is the cost of a metal roof vs shingles on a 2,000 sq ft roof?',
    a: `About ${$(r2000.metals[1])} for corrugated, ${$(r2000.metals[2])} for metal shingles and ${$(r2000.metals[0])} for standing seam (all with tear-off), against about ${$(r2000.asphalt)} for an architectural shingle tear-off and replacement at HomeGuide’s 2026 midpoints.`,
  },
  {
    q: 'How long does a metal roof last?',
    a: `This Old House puts metal roofs at ${METAL_LIFE[0]}–${METAL_LIFE[1]} years, against 15–30 years for asphalt; Fixr gives architectural shingles 25–30 years and 3-tab 15–20. Over one metal roof’s life you would replace a shingle roof about ${ex.asphaltOverMetalLife.roofs} times.`,
  },
  {
    q: 'Can a metal roof go over shingles?',
    a: `Often, if there is only one layer of shingles and the deck is sound — but it depends on your local code and the panel maker’s instructions. Skipping the tear-off on the example roof saves ${$(ex.metal.total - noTear.metal.total)}. Untick “remove the old roof” in the calculator to see the difference.`,
  },
  {
    q: 'How many metal roof panels do I need?',
    a: `Divide each slope’s eave length by the panel’s coverage width and round up. A 42 ft eave with 16-inch standing seam panels needs ${ex.panels.panels / 2} panels per slope (${ex.panels.panels} for a gable roof), each about ${n(ex.panels.panelLengthsFt[0], 1)} ft long on a 6/12 pitch with a 30 ft wide building.`,
  },
  {
    q: 'What is a square in roofing?',
    a: 'A roofing square is 100 square feet of roof surface. Roofers price and order by the square, so a 2,000 sq ft roof is 20 squares.',
  },
  {
    q: 'How do I work out my roof area from the house footprint?',
    a: `Multiply the footprint (including overhangs) by the pitch factor √(1 + (rise ÷ 12)²). For a 6/12 roof the factor is ${n(f6, 3)}, so a 42 × 30 ft footprint has ${n(42 * 30 * f6)} sq ft of roof.`,
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Metal Roof Cost Calculator',
  path: route.path,
  description:
    'Free metal roof cost calculator: roof area from footprint and pitch, standing seam, corrugated or metal shingle cost with tear-off, a side-by-side comparison with asphalt shingles, cost per year of life, panel count and trim lengths.',
});
const faqSchema = buildFaqSchema(faqs);

export default function MetalRoofCostCalculatorPage() {
  return (
    <>
      <JsonLd data={[webAppSchema, faqSchema]} />
      <main id="main-content" className={styles.main}>
        <Breadcrumbs items={[{ name: 'Tools', path: '/tools/' }, { name: 'Metal Roof Cost Calculator', path: route.path }]} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Metal Roof Cost Calculator</h1>
          <p className={styles.lead}>
            Find out what a new metal roof will cost on your house. This free <strong>metal roof cost calculator</strong> works out your sloped roof area
            from the footprint and pitch, prices <strong>standing seam</strong>, corrugated or metal shingle roofing with tear-off, and puts it side by side
            with an asphalt shingle roof — upfront and per year of life. It also counts the panels and trim you need.
          </p>
          <p className={styles.meta}>
            Last updated: {new Date(route.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} ·
            Prices are typical US ranges, checked November 2026 (enter your local price) · Runs in your browser — nothing you enter is sent anywhere.
          </p>
        </header>

        <section aria-label="Metal roof cost calculator tool">
          <MetalRoofCalculator />
        </section>

        <div className={styles.adBlock}>
          <AdSlot slotId="metal-roof-cost-calculator-middle" />
        </div>

        <article className={styles.article}>
          <h2>How to use the metal roof cost calculator</h2>
          <ol>
            <li>
              <strong>Describe the roof:</strong> gable, hip or shed, with the building’s length, width, overhang and pitch — or type the sloped area if you
              know it. Add sections for wings and garages.
            </li>
            <li>
              <strong>Pick the metal:</strong> standing seam, corrugated (exposed fastener) or metal shingles. The price per sq ft fills in from 2026 cost
              guides — change it to your quote.
            </li>
            <li>
              <strong>Choose the shingle roof to compare with</strong>, and whether the old roof is being torn off.
            </li>
            <li>
              <strong>Read the result:</strong> the metal roof cost and range, metal vs shingles upfront and per year, and the panels and trim to order.
            </li>
          </ol>

          <h2>How much does a metal roof cost?</h2>
          <p>
            Most of the price comes from the system you choose. These are HomeGuide’s 2026 installed ranges — the calculator starts at each midpoint —
            and what they mean for the example roof: a 40 × 28 ft house with 1 ft overhangs and a 6/12 pitch, {n(ex.roofArea)} sq ft ({n(ex.squares, 1)}{' '}
            squares) of roof, with tear-off.
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.note}>Metal roof cost by type (US 2026)</caption>
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Installed per sq ft</th>
                  <th scope="col">Per square</th>
                  <th scope="col">Example roof</th>
                  <th scope="col">Per year of life</th>
                </tr>
              </thead>
              <tbody>
                {byType.map(({ m, r }) => (
                  <tr key={m.id}>
                    <td>{m.label}</td>
                    <td>
                      ${m.range[0]}–${m.range[1]}
                    </td>
                    <td>
                      {$(m.range[0] * 100)}–{$(m.range[1] * 100)}
                    </td>
                    <td>
                      <strong>{$(r.metal.total)}</strong>
                    </td>
                    <td>{$(r.metal.perYear)}</td>
                  </tr>
                ))}
                <tr>
                  <td>{arch.label} (for comparison)</td>
                  <td>
                    ${arch.range[0]}–${arch.range[1]}
                  </td>
                  <td>
                    {$(arch.range[0] * 100)}–{$(arch.range[1] * 100)}
                  </td>
                  <td>{$(ex.asphalt.total)}</td>
                  <td>{$(ex.asphalt.perYear)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The shingle figures are HomeGuide’s tear-off-and-replace prices, so both rows include removing the old roof. Steel with a factory paint finish
            is the usual choice; aluminium costs more, and copper or zinc standing seam far more.
          </p>

          <h2>Metal roof cost by roof size</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.note}>Installed cost including tear-off, at the midpoint prices</caption>
              <thead>
                <tr>
                  <th scope="col">Roof area</th>
                  {METALS.map((m) => (
                    <th scope="col" key={m.id}>
                      {m.label}
                    </th>
                  ))}
                  <th scope="col">Architectural shingles</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map((r) => (
                  <tr key={r.A}>
                    <td>
                      {n(r.A)} sq ft ({r.A / 100} squares)
                    </td>
                    {r.metals.map((v, i) => (
                      <td key={i}>{$(v)}</td>
                    ))}
                    <td>{$(r.asphalt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Standing seam metal roof cost</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <PanelDiagram kind="standingSeam" countLabel={`${ex.panels.panels / 2} panels per slope`} lengthLabel={`${n(ex.panels.panelLengthsFt[0], 1)} ft`} widthLabel="16 in" />
              <figcaption>Standing seam: raised seams lock the panels together over hidden clips.</figcaption>
            </figure>
            <div>
              <p>
                Standing seam panels run from eave to ridge, joined by raised seams over concealed clips, so there are no exposed screws to leak or work
                loose. That is why it costs more — about <strong>${ss.range[0]}–${ss.range[1]} per sq ft</strong> installed — and why it is the usual choice
                for homes.
              </p>
              <p>
                On the example roof that is {$(ex.metal.installed)} for the roof plus {$(ex.metal.tearOff)} of tear-off: <strong>{$(ex.metal.total)}</strong>,
                or {$(ex.metal.perSqFt, 2)} per sq ft. The roof takes {ex.panels.panels} panels 16 inches wide and {n(ex.panels.panelLengthsFt[0], 1)} ft long,
                with {n(ex.ridge)} ft of ridge cap and {n(ex.eaves)} ft of eave trim.
              </p>
            </div>
          </div>
          <p>
            <strong>Corrugated and other exposed-fastener panels</strong> are screwed through the face into the deck. They go on faster and cost less (
            {$(corr.r.metal.total)} on the example roof), but the screw washers need checking over the years. <strong>Metal shingles</strong> are stamped to
            look like shingles, slate or tile and sit in between on price.
          </p>

          <h2>Metal roof vs shingle cost</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <CompareBars
                rows={[
                  { label: 'Upfront', metal: ex.metal.total, asphalt: ex.asphalt.total },
                  { label: 'Per year of life', metal: ex.metal.perYear, asphalt: ex.asphalt.perYear },
                ]}
                format={(v) => $(v)}
              />
              <figcaption>The example roof: standing seam vs architectural shingles.</figcaption>
            </figure>
            <div>
              <p>
                Up front, metal costs about <strong>{n(ex.ratio, 1)} times</strong> as much as architectural shingles on the example roof. The case for
                metal is its life: This Old House puts metal at {METAL_LIFE[0]}–{METAL_LIFE[1]} years and asphalt at 15–30, so one metal roof outlasts
                about {ex.asphaltOverMetalLife.roofs} shingle roofs.
              </p>
              <p>
                Divided by its life, standing seam still costs a little more per year ({$(ex.metal.perYear)} vs {$(ex.asphalt.perYear)}) at these prices,
                while corrugated metal is close to shingles ({$(corr.r.metal.perYear)}). Metal tends to win if you plan to stay a long time, live where
                shingles age fast, or would rather not face a second tear-off.
              </p>
            </div>
          </div>

          <h2>How to measure a roof for metal</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <PitchDiagram rise={6} factorLabel={`× ${n(f6, 3)}`} />
              <figcaption>Pitch factor for a 6/12 roof: every square foot of footprint is {n(f6, 3)} sq ft of roof.</figcaption>
            </figure>
            <div>
              <p>
                Measure the house footprint plus the overhang on each side, then multiply by the pitch factor √(1 + (rise ÷ 12)²). A 6/12 roof has a
                factor of {n(f6, 3)}: the example’s 42 × 30 ft footprint becomes {n(ex.roofArea)} sq ft. Divide by 100 for squares.
              </p>
              <p>
                For hips, valleys and dormers, add each part as its own section, or use our{' '}
                <Link href="/shingle-calculator/">shingle roof calculator</Link> to measure it plane by plane. If you are framing or checking timber lengths, see our{' '}
                <Link href="/rafter-calculator/">rafter calculator</Link> for rafter spans, bird&apos;s mouth cuts and overhangs. Never walk a steep roof to measure — use
                the footprint from the ground.
              </p>
            </div>
          </div>

          <h2>Panels, trim and underlayment</h2>
          <ul>
            <li>
              <strong>Panels:</strong> eave length ÷ coverage width, rounded up, per slope; length = eave-to-ridge distance including the overhang. Hip roofs
              need panels cut to many lengths, so the calculator gives total panel length instead.
            </li>
            <li>
              <strong>Trim:</strong> ridge and hip cap, eave trim and rake (gable) trim, from the roof’s edge lengths.
            </li>
            <li>
              <strong>Underlayment:</strong> synthetic underlayment, about 10 squares per roll — the example roof needs {ex.underlaymentRolls} rolls.
            </li>
          </ul>

          <h2>Tear-off or go over the old roof?</h2>
          <p>
            Tearing off the old roof costs about ${TEAR_OFF_RANGE[0]}–${TEAR_OFF_RANGE[1]} per sq ft (HomeGuide, 2026) — {$(ex.metal.tearOff)} on the example
            roof. Some codes and panel makers allow metal over a single layer of shingles, which saves that cost, but it hides any rot in the deck. Have
            the deck inspected, and follow your local code and the manufacturer’s installation guide.
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

          <HowWeCalculate slug="metal-roof-cost-calculator" />

          <h2>Related calculators</h2>
          <ul className={styles.related}>
            <li>
              <Link href="/shingle-calculator/">
                Shingle Roof Calculator<span>Bundles, starter and ridge cap</span>
              </Link>
            </li>
            <li>
              <Link href="/rafter-calculator/">
                Rafter Calculator<span>Pitch, rafter length and angles</span>
              </Link>
            </li>
            <li>
              <Link href="/square-footage-calculator/">
                Square Footage Calculator<span>Footprints of odd shapes</span>
              </Link>
            </li>
            <li>
              <Link href="/board-and-batten-calculator/">
                Board and Batten Calculator<span>Siding to match the new roof</span>
              </Link>
            </li>
            <li>
              <Link href="/fence-cost-calculator/">
                Fence Cost Calculator<span>Price the next outdoor project</span>
              </Link>
            </li>
            <li>
              <Link href="/construction-estimate-template/">
                Construction Estimate Template<span>Turn it into a written quote</span>
              </Link>
            </li>
          </ul>

          <p className={styles.note}>
            Disclaimer: results are planning estimates from 2026 US cost guides. Prices vary by region, metal, gauge, finish, roof complexity and access.
            Roofing is dangerous work; use licensed, insured contractors and follow local code. See our <Link href="/disclaimer/">disclaimer</Link>.
          </p>
        </article>

        <div className={styles.adBlock}>
          <AdSlot slotId="metal-roof-cost-calculator-bottom" />
        </div>
      </main>
    </>
  );
}
