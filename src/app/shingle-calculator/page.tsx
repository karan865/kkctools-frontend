import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import ShingleCalculator from '@/components/tool/shingle-calculator';
import { LayersDiagram, PitchDiagram, RoofPlanDiagram, SquareDiagram } from '@/components/tool/shingle-calculator/ShingleDiagram';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  FT_PER_M,
  M2_PER_SQUARE,
  SHINGLE_TYPES,
  calculateShingles,
  defaultSection,
  defaultShingleInput,
  degreesToPitch,
  pitchFactor,
  pitchToDegrees,
  type RoofSection,
  type ShingleInput,
} from '@/lib/shingle-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.shingleCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

// ---------- every number below is computed by the same engine as the tool ----------
const n = (v: number, dp = 0) => v.toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: dp });
const est = (sections: RoofSection[], over: Partial<ShingleInput> = {}) => calculateShingles(defaultShingleInput(sections, over));

const ranchSection = defaultSection('a'); // 40 × 28 ft, 1 ft overhang, 6/12 gable
const exRanch = est([ranchSection]);
const exHip = est([{ ...ranchSection, shape: 'hip' }], { wastePercent: 15 });
const porch = defaultSection('p', { shape: 'shed', length: 16, width: 8, overhang: 1, pitch: 3 });
const exTwo = est([ranchSection, porch], { wastePercent: 15 });
const exThreeTab = est([ranchSection], { bundlesPerSquare: 3, shinglesPerSquare: 80 });
const metricSection = defaultSection('m', { length: 12 * FT_PER_M, width: 8 * FT_PER_M, overhang: 0.4 * FT_PER_M, pitch: degreesToPitch(30) });
const exMetric = est([metricSection]);
const exIce = est([ranchSection], { iceCourses: 2 });

const pitchRows = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18].map((p) => ({ p, deg: pitchToDegrees(p), f: pitchFactor(p) }));
const sizeRows = [1000, 1500, 2000, 2500, 3000].map((a) => {
  const area = [defaultSection('x', { shape: 'area', area: a })];
  return {
    a,
    simple: est(area).bundles,
    hip: est(area, { wastePercent: 15 }).bundles,
    premium: est(area, { bundlesPerSquare: 4 }).bundles,
  };
});
const arch = SHINGLE_TYPES[0];
const threeTab = SHINGLE_TYPES[1];

// ---------- FAQ ----------
const faqs = [
  {
    q: 'How many bundles of shingles are in a square?',
    a: 'Most asphalt shingles — both 3-tab and architectural — come 3 bundles to a square, so one bundle covers about 33⅓ sq ft. Some heavier designer and premium lines need 4 or more bundles per square. The number is printed on every bundle wrapper; the calculator lets you change it.',
  },
  {
    q: 'How many shingles are in a bundle?',
    a: `It depends on the shingle size. A 12 × 36 in 3-tab shingle laid at a 5 in exposure needs ${threeTab.shinglesPerSquare} per square, so about ${n(threeTab.shinglesPerSquare / 3)} per bundle. A 13¼ × 39⅜ in architectural shingle at a 5⅝ in exposure needs ${arch.shinglesPerSquare} per square, about ${n(arch.shinglesPerSquare / 3)} per bundle. Check the wrapper — counts vary by brand.`,
  },
  {
    q: 'How do you calculate shingles for a roof?',
    a: `Measure the building’s length and width, add the overhang, multiply to get the footprint, then multiply by the slope factor for your pitch to get the real roof area. Divide by 100 for squares, add waste, and multiply by bundles per square. For a 40 × 28 ft ranch with a 1 ft overhang and a 6/12 pitch that is ${n(exRanch.roofArea)} sq ft, ${n(exRanch.squares, 2)} squares and ${exRanch.bundles} bundles with 10% waste.`,
  },
  {
    q: 'What is a roofing square?',
    a: `A roofing square is 100 sq ft of roof surface (a 10 × 10 ft area), which is ${n(M2_PER_SQUARE, 2)} m². Shingles, underlayment and roofing labor are usually priced and ordered by the square.`,
  },
  {
    q: 'How do I measure my roof for shingles without climbing on it?',
    a: 'Measure the house’s outside walls from the ground, add the overhang on each side, and find the pitch (from the plans, a pitch gauge in the attic, or by counting siding courses on a gable end). The calculator turns the footprint and pitch into roof area. If you can safely measure each roof face, use “Measured area” instead.',
  },
  {
    q: 'How much waste should I add for shingles?',
    a: `A common allowance is about 10% for a simple gable roof and 15% or more for hip roofs and roofs with valleys and dormers, because more shingles are cut at every angle. For the same 40 × 28 ft house, a gable needs ${exRanch.bundles} bundles at 10% while a hip roof needs ${exHip.bundles} at 15%.`,
  },
  {
    q: 'Does the shingle count include starter strip and ridge cap?',
    a: 'No — they are counted separately because they come in their own bundles. The calculator adds starter strip for the eaves (and rakes, if you choose) and hip & ridge cap for every ridge and hip, using feet per bundle from the manufacturer.',
  },
  {
    q: 'How does roof pitch change how many shingles I need?',
    a: `A steeper roof has more surface over the same footprint. At 4/12 the roof is about ${n((pitchFactor(4) - 1) * 100, 1)}% bigger than its footprint, at 6/12 about ${n((pitchFactor(6) - 1) * 100, 1)}%, at 8/12 about ${n((pitchFactor(8) - 1) * 100, 1)}% and at 12/12 about ${n((pitchFactor(12) - 1) * 100, 1)}%.`,
  },
  {
    q: 'How many bundles of shingles do I need for a 2,000 sq ft roof?',
    a: `For 2,000 sq ft of roof surface (20 squares) at 3 bundles per square: ${sizeRows[2].simple} bundles with 10% waste or ${sizeRows[2].hip} with 15%. Note that a 2,000 sq ft house usually has more than 2,000 sq ft of roof once overhangs and pitch are added.`,
  },
  {
    q: 'How many rolls of underlayment do I need?',
    a: `Divide the roof area by the roll’s coverage after laps: about 1,000 sq ft for a typical synthetic roll, 400 sq ft for #15 felt and 200 sq ft for #30 felt. The ${n(exRanch.roofArea)} sq ft ranch roof needs ${exRanch.underlaymentRolls} synthetic roll${exRanch.underlaymentRolls === 1 ? '' : 's'}.`,
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Shingle Roof Calculator',
  path: route.path,
  description:
    'Free shingle roof calculator. Turn roof size and pitch into roof area, roofing squares and shingle bundles, plus starter strip, hip and ridge cap, drip edge, underlayment, ice & water barrier and nails.',
});
const faqSchema = buildFaqSchema(faqs);

export default function ShingleCalculatorPage() {
  return (
    <>
      <JsonLd data={[webAppSchema, faqSchema]} />
      <main id="main-content" className={styles.main}>
        <Breadcrumbs items={[{ name: 'Tools', path: '/tools/' }, { name: 'Shingle Roof Calculator', path: route.path }]} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Shingle Roof Calculator: Bundles &amp; Roofing Squares</h1>
          <p className={styles.lead}>
            This free <strong>shingle roof calculator</strong> turns your roof size and pitch into roof area, roofing squares and the number of
            shingle bundles to buy — then adds the parts most calculators forget: starter strip, hip and ridge cap, drip edge, underlayment, ice
            &amp; water barrier and nails. Add as many roof sections as your house has, pick your shingle type and waste, and get a complete
            shopping list in feet or metres.
          </p>
          <p className={styles.meta}>
            Last updated: {new Date(route.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} ·
            Runs in your browser — nothing you enter is sent anywhere.
          </p>
        </header>

        <section aria-label="Shingle roof calculator tool">
          <ShingleCalculator />
        </section>

        <div className={styles.adBlock}>
          <AdSlot slotId="shingle-calculator-middle" />
        </div>

        <article className={styles.article}>
          <h2>How to use the shingle calculator</h2>
          <ol>
            <li>
              <strong>Pick the roof shape</strong> — gable, hip or shed — and enter the building’s length and width plus the overhang. Already
              know the area of a roof face? Choose <em>Measured area</em>.
            </li>
            <li>
              <strong>Set the pitch.</strong> Tap a common pitch or type your own; the slope factor and angle update as you go.
            </li>
            <li>
              <strong>Add more sections</strong> for a porch, garage or dormer. Each can have its own shape and pitch.
            </li>
            <li>
              <strong>Choose the shingle type and waste.</strong> Bundles per square and shingles per square fill in from manufacturer data and
              can be changed to match your wrapper.
            </li>
            <li>
              <strong>Read the shopping list</strong>: bundles, starter, ridge cap, drip edge, underlayment, ice &amp; water and nails. Add prices
              for a material total.
            </li>
          </ol>

          <h2>How to calculate shingles for a roof</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <PitchDiagram rise={6} factorLabel={`6/12 → factor ${n(pitchFactor(6), 3)}`} />
              <figcaption>A 6/12 roof rises 6 in for every 12 in across. Its sloped surface is {n((pitchFactor(6) - 1) * 100, 1)}% longer than the run.</figcaption>
            </figure>
            <div>
              <p>
                You cannot measure a pitched roof from its footprint alone — the slope adds surface. Work out the footprint (including the
                overhang), multiply by the slope factor for your pitch, and you have the roof area:
              </p>
              <code className={styles.formula}>
                Slope factor = √(1 + (rise ÷ 12)²)
                <br />
                Roof area = (L + 2 × overhang) × (W + 2 × overhang) × slope factor
                <br />
                Squares = roof area ÷ 100
                <br />
                Bundles = squares × (1 + waste) × bundles per square, rounded up
              </code>
              <p>
                The slope factor is the same whether the roof is a gable or a hip — only the edges (and the waste) change. That is why the
                calculator works out the area first and the shape-specific parts second.
              </p>
            </div>
          </div>
          <h3>Roof pitch multiplier table</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Pitch</th>
                  <th scope="col">Angle</th>
                  <th scope="col">Slope factor</th>
                  <th scope="col">Roof vs footprint</th>
                </tr>
              </thead>
              <tbody>
                {pitchRows.map((row) => (
                  <tr key={row.p}>
                    <td>{row.p}/12</td>
                    <td>{n(row.deg, 1)}°</td>
                    <td>{n(row.f, 3)}</td>
                    <td>+{n((row.f - 1) * 100, 1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>How many bundles of shingles in a square?</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <SquareDiagram bundles={3} />
              <figcaption>One square is a 10 × 10 ft patch of roof. Most shingles cover it with 3 bundles.</figcaption>
            </figure>
            <div>
              <p>
                <strong>Most asphalt shingles are packed 3 bundles to a square</strong>, so each bundle covers about 33⅓ sq ft. That holds for
                standard 3-tab shingles and for most architectural (laminated) shingles. Heavier designer and premium lines are thicker, so
                fewer fit in a bundle and some need <strong>4 bundles per square</strong>.
              </p>
              <p>
                The bundles-per-square number is printed on every wrapper. If yours says something else, type it into the calculator — every
                other number updates.
              </p>
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Shingle type</th>
                  <th scope="col">Bundles per square</th>
                  <th scope="col">Shingles per square</th>
                  <th scope="col">Per bundle (about)</th>
                  <th scope="col">Example</th>
                </tr>
              </thead>
              <tbody>
                {SHINGLE_TYPES.map((t) => (
                  <tr key={t.id}>
                    <td>{t.label}</td>
                    <td>{t.bundlesPerSquare}</td>
                    <td>{t.shinglesPerSquare}</td>
                    <td>{n(t.shinglesPerSquare / t.bundlesPerSquare)}</td>
                    <td>{t.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>How many shingles are in a bundle?</h2>
          <p>
            The count follows from the shingle’s size and how much of it is left showing (the exposure). A 12 × 36 in 3-tab shingle at a 5 in
            exposure shows 36 × 5 = 180 sq in, so a 100 sq ft square takes {threeTab.shinglesPerSquare} shingles — about{' '}
            {n(threeTab.shinglesPerSquare / 3)} per bundle. A 13¼ × 39⅜ in architectural shingle at a 5⅝ in exposure takes{' '}
            {arch.shinglesPerSquare} per square — about {n(arch.shinglesPerSquare / 3)} per bundle. You do not need the piece count to buy shingles
            (you buy bundles), but it is what sets the nail count.
          </p>

          <h2>What is a roofing square?</h2>
          <p>
            A <strong>roofing square</strong> is 100 sq ft of roof surface — a 10 × 10 ft area, or {n(M2_PER_SQUARE, 2)} m². Roofers measure,
            order and price in squares, so a “25-square roof” has 2,500 sq ft of roof surface, not 2,500 sq ft of floor. To turn the calculator’s
            square metres into squares, divide by {n(M2_PER_SQUARE, 2)}.
          </p>

          <h2>Gable vs hip roofs</h2>
          <div className={styles.figGrid}>
            <figure className={styles.figureBox}>
              <RoofPlanDiagram shape="gable" />
              <figcaption>Gable: eaves on two sides, rakes up the gable ends, one long ridge.</figcaption>
            </figure>
            <figure className={styles.figureBox}>
              <RoofPlanDiagram shape="hip" />
              <figcaption>Hip: eaves all round, a short ridge and four hips.</figcaption>
            </figure>
          </div>
          <p>
            On the same house and pitch, both shapes have the same roof area — but a hip roof has more eave (more starter and drip edge), no
            rakes, and four hips that need ridge cap and angled cuts. That is why hip roofs get a bigger waste allowance. For the 40 × 28 ft house
            below, the gable needs {exRanch.ridgeBundles} bundle{exRanch.ridgeBundles === 1 ? '' : 's'} of ridge cap and the hip roof needs{' '}
            {exHip.ridgeBundles}.
          </p>

          <h2>How much waste to add</h2>
          <ul>
            <li>
              <strong>About 10% — simple gable roofs.</strong> Straight runs, cuts only at the rakes.
            </li>
            <li>
              <strong>About 15% — hip roofs.</strong> Every course is cut at an angle where it meets a hip.
            </li>
            <li>
              <strong>About 20% — complex roofs.</strong> Valleys, dormers, turrets and short runs all add offcuts.
            </li>
          </ul>
          <p>These are common trade allowances, not a rule. Your roofer’s number — or what you know about your roof — is always better.</p>

          <h2>What else you need besides shingles</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <LayersDiagram />
              <figcaption>The layers on a shingle roof, from the deck up.</figcaption>
            </figure>
            <ul>
              <li>
                <strong>Starter strip</strong> along the eaves (and usually the rakes) seals the first course. Bundles cover about 100–120 linear
                ft depending on the brand.
              </li>
              <li>
                <strong>Hip &amp; ridge cap</strong> covers the ridge and every hip — roughly 25–33 linear ft per bundle.
              </li>
              <li>
                <strong>Drip edge</strong> metal along the eaves and rakes, usually sold in 10 ft pieces.
              </li>
              <li>
                <strong>Underlayment</strong> over the whole deck: synthetic (about 10 squares a roll) or felt (#15 about 4, #30 about 2).
              </li>
              <li>
                <strong>Ice &amp; water barrier</strong> at the eaves and in valleys in cold climates — often 1–2 rows (3–6 ft) up from the edge.
              </li>
              <li>
                <strong>Nails</strong>: 4 per shingle on most roofs, 6 where the wrapper calls for high-wind nailing.
              </li>
            </ul>
          </div>

          <h2>Worked examples</h2>
          <p>Architectural shingles (3 bundles per square), synthetic underlayment, starter on eaves and rakes — computed by the same code as the tool.</p>
          <div className={styles.examples}>
            <div className={styles.exampleCard}>
              <h3>Ranch house, gable roof</h3>
              <p className={styles.exampleMeta}>40 × 28 ft · 1 ft overhang · 6/12 · 10% waste</p>
              <ul>
                <li>Roof area: {n(exRanch.roofArea)} sq ft ({n(exRanch.squares, 2)} squares)</li>
                <li>
                  Shingles: <strong>{exRanch.bundles} bundles</strong>
                </li>
                <li>
                  Starter {exRanch.starterBundles} · ridge cap {exRanch.ridgeBundles} · drip edge {exRanch.dripEdgePieces} × 10 ft
                </li>
                <li>Underlayment: {exRanch.underlaymentRolls} rolls · nails: {n(exRanch.nails)}</li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>Same house, hip roof</h3>
              <p className={styles.exampleMeta}>40 × 28 ft · 1 ft overhang · 6/12 · 15% waste</p>
              <ul>
                <li>Roof area: {n(exHip.roofArea)} sq ft (same as the gable)</li>
                <li>
                  Shingles: <strong>{exHip.bundles} bundles</strong>
                </li>
                <li>
                  Ridge + hips: {n(exHip.ridgeLf)} ft → {exHip.ridgeBundles} ridge cap bundles
                </li>
                <li>
                  Eaves all round: {n(exHip.eaves)} ft → {exHip.starterBundles} starter bundles
                </li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>House plus porch</h3>
              <p className={styles.exampleMeta}>Gable above + 16 × 8 ft shed porch at 3/12 · 15% waste</p>
              <ul>
                <li>Total roof: {n(exTwo.roofArea)} sq ft ({n(exTwo.squares, 2)} squares)</li>
                <li>
                  Shingles: <strong>{exTwo.bundles} bundles</strong>
                </li>
                <li>Starter: {exTwo.starterBundles} · drip edge: {exTwo.dripEdgePieces} pieces</li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>Metric gable roof</h3>
              <p className={styles.exampleMeta}>12 × 8 m · 0.4 m overhang · 30° · 10% waste</p>
              <ul>
                <li>
                  Roof area: {n(exMetric.roofArea / (FT_PER_M * FT_PER_M), 1)} m² ({n(exMetric.squares, 2)} squares)
                </li>
                <li>
                  Shingles: <strong>{exMetric.bundles} bundles</strong>
                </li>
                <li>30° is a {n(degreesToPitch(30), 2)}/12 pitch</li>
              </ul>
            </div>
          </div>
          <p className={styles.callout}>
            <strong>Shingle type changes the bundle count very little:</strong> the ranch roof needs {exRanch.bundles} bundles of architectural
            or {exThreeTab.bundles} of 3-tab, because both are 3 bundles per square. What changes is the piece count ({n(exRanch.shingles)} vs{' '}
            {n(exThreeTab.shingles)}) and so the nails. In a cold climate, two rows of ice &amp; water barrier along those eaves add{' '}
            {exIce.iceRolls} rolls.
          </p>

          <h2>Bundles needed by roof size</h2>
          <p>Roof surface area (not floor area), 3 bundles per square unless noted, rounded up to whole bundles.</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Roof area</th>
                  <th scope="col">Squares</th>
                  <th scope="col">Bundles, 10% waste</th>
                  <th scope="col">Bundles, 15% waste</th>
                  <th scope="col">4 bundles/square, 10%</th>
                </tr>
              </thead>
              <tbody>
                {sizeRows.map((row) => (
                  <tr key={row.a}>
                    <td>{n(row.a)} sq ft</td>
                    <td>{n(row.a / 100)}</td>
                    <td>
                      <strong>{row.simple}</strong>
                    </td>
                    <td>{row.hip}</td>
                    <td>{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Measuring your roof safely</h2>
          <p>
            You can get everything the calculator needs from the ground. Measure the outside walls for length and width, and estimate the
            overhang at the eaves and rakes (often 1–2 ft). For the pitch, check the house plans, measure the rise over 12 in on a rafter in the
            attic, or use a phone level on a gable end from a ladder. Our <Link href="/rafter-calculator/">Rafter Calculator</Link> also converts
            between pitch, angle and rafter length. Never walk a roof without fall protection.
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

          <HowWeCalculate slug="shingle-calculator" />

          <h2>Related calculators</h2>
          <ul className={styles.related}>
            <li>
              <Link href="/rafter-calculator/">
                Rafter Calculator<span>Rafter length, pitch and cut angles</span>
              </Link>
            </li>
            <li>
              <Link href="/square-footage-calculator/">
                Square Footage Calculator<span>Footprints and odd-shaped areas</span>
              </Link>
            </li>
            <li>
              <Link href="/stud-calculator/">
                Stud Calculator<span>Wall framing below the roof</span>
              </Link>
            </li>
            <li>
              <Link href="/drywall-calculator/">
                Drywall Calculator<span>Ceilings and walls inside</span>
              </Link>
            </li>
            <li>
              <Link href="/paint-cost-calculator/">
                Paint Cost Calculator<span>Fascia, soffits and siding</span>
              </Link>
            </li>
            <li>
              <Link href="/construction-estimate-template/">
                Construction Estimate Template<span>Turn the shopping list into a quote</span>
              </Link>
            </li>
          </ul>

          <p className={styles.note}>
            Quantities are planning estimates. Shingle sizes, bundle counts and accessory coverage differ between brands — always check the
            wrapper and follow the manufacturer’s installation instructions and your local building code.
          </p>
        </article>

        <div className={styles.adBlock}>
          <AdSlot slotId="shingle-calculator-bottom" />
        </div>
      </main>
    </>
  );
}
