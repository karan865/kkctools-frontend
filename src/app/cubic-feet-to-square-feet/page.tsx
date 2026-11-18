import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import CubicSquareConverter from '@/components/tool/cubic-square-converter';
import ToolShell from '@/components/tool/shared/ToolShell';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import { SpreadDiagram } from '@/components/tool/cubic-square-converter/CubicSquareDiagram';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  FT3_PER_M3,
  PRESETS,
  bagsFor,
  coverageFt2,
  depthToFt,
  ft2PerFt3AtInches,
  ft2To,
  ft3Per100Ft2,
  ft3To,
  volumeNeededFt3,
  volumeToFt3,
} from '@/lib/cubic-square-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.cubicFeetToSquareFeet;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

// ---------- every number below comes from the same engine as the tool ----------
const n = (v: number, dp = 2) => v.toLocaleString('en-US', { maximumFractionDigits: dp });
const inch = (d: number) => depthToFt(d, 'in');

const mulchBag = coverageFt2(2, inch(3)); // 2 ft³ bag at 3 in
const tenBags = coverageFt2(20, inch(3));
const yardAt4 = coverageFt2(27, inch(4));
const slab = volumeNeededFt3(100, inch(4)); // 10 × 10 at 4 in
const bed = volumeNeededFt3(200, inch(3)); // 200 ft² mulch bed at 3 in
const bedBags = bagsFor(bed, 2);
const lawn = volumeNeededFt3(1000, inch(6)); // Purdue cross-check
const cft1000at4 = volumeNeededFt3(1000, inch(4));
const cft1000at6 = volumeNeededFt3(1000, inch(6));
const m3at10cm = ft2To(coverageFt2(volumeToFt3(1, 'm3'), depthToFt(10, 'cm')), 'm2');

const depthsIn = [0.5, 1, 2, 3, 4, 6, 12];
const depthsCm = [2.5, 5, 7.5, 10, 15];

// ---------- FAQ ----------
const faqs = [
  {
    q: 'Can you convert cubic feet to square feet?',
    a: 'Not on their own — cubic feet measure volume and square feet measure area. You need a thickness (depth) to link them: square feet = cubic feet ÷ depth in feet. With a depth, the conversion is exact.',
  },
  {
    q: 'How do I convert cubic feet to square feet?',
    a: `Turn the depth into feet (inches ÷ 12) and divide: square feet = cubic feet ÷ depth. Example: 10 cubic feet spread 3 inches deep covers 10 ÷ 0.25 = ${n(coverageFt2(10, inch(3)))} square feet.`,
  },
  {
    q: 'How do I convert square feet to cubic feet?',
    a: `Multiply the area by the depth in feet: cubic feet = square feet × depth. A 10 × 10 ft slab 4 inches thick is 100 × 4 ÷ 12 = ${n(slab)} cubic feet, or ${n(ft3To(slab, 'yd3'))} cubic yards.`,
  },
  {
    q: 'How many square feet does 1 cubic foot cover?',
    a: `It depends on the depth: ${n(ft2PerFt3AtInches(1))} sq ft at 1 inch, ${n(ft2PerFt3AtInches(2))} at 2 inches, ${n(ft2PerFt3AtInches(3))} at 3 inches and ${n(ft2PerFt3AtInches(4))} at 4 inches. The rule is 12 ÷ depth in inches.`,
  },
  {
    q: 'How many square feet does a 2 cubic foot bag of mulch cover?',
    a: `About ${n(mulchBag)} square feet at 3 inches deep, or ${n(coverageFt2(2, inch(2)))} square feet at 2 inches. Ten bags at 3 inches cover about ${n(tenBags)} square feet.`,
  },
  {
    q: 'How many cubic feet is 100 square feet at 4 inches?',
    a: `${n(ft3Per100Ft2(4))} cubic feet (100 × 4 ÷ 12), which is ${n(ft3To(slab, 'yd3'))} cubic yards or ${n(ft3To(slab, 'm3'))} cubic metres.`,
  },
  {
    q: 'What is cft and how do I convert cft to square feet?',
    a: `cft is short for cubic feet, the unit often used in India for sand, aggregate and concrete. Convert it exactly as above: square feet = cft ÷ thickness in feet. For example, ${n(cft1000at4, 0)} cft laid 4 inches thick covers 1,000 sq ft. One cubic metre is ${n(FT3_PER_M3)} cft.`,
  },
  {
    q: 'How do I convert square metres to cubic metres?',
    a: `Multiply by the depth in metres: m³ = m² × depth. 1 m³ spread 10 cm (0.1 m) deep covers ${n(m3at10cm)} m². To go back, divide: m² = m³ ÷ depth in metres.`,
  },
  {
    q: 'How many cubic yards do I need for 1,000 square feet?',
    a: `At 6 inches deep, ${n(ft3To(lawn, 'yd3'))} cubic yards (${n(lawn, 0)} ft³) — Purdue Extension rounds this to about 19 cubic yards for 6 inches of topsoil over 1,000 sq ft. At 3 inches, half that.`,
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Cubic Feet to Square Feet Converter',
  path: route.path,
  description:
    'Free two-way converter: cubic feet to square feet and square feet to cubic feet using a depth or thickness, with cubic yards, cubic metres, litres, square metres, bag counts and material depth presets.',
});
const faqSchema = buildFaqSchema(faqs);

export default function CubicFeetToSquareFeetPage() {
  return (
    <>
      <JsonLd data={[webAppSchema, faqSchema]} />
      <main id="main-content" className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
        <Breadcrumbs items={[{ name: 'Tools', path: '/tools/' }, { name: 'Cubic Feet to Square Feet', path: route.path }]} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Cubic Feet to Square Feet Converter</h1>
          <p className={styles.lead}>
            Convert <strong>cubic feet to square feet</strong> — or square feet to cubic feet — for mulch, soil, gravel, sand, concrete and more. Because
            one is a volume and the other an area, the converter uses a <strong>depth or thickness</strong>: tell it how deep the material goes and it
            tells you how much ground a volume covers, or how much material an area needs, in feet, yards, metres, litres or bags.
          </p>
          <p className={styles.meta}>
            Last updated: {new Date(route.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} ·
            Runs in your browser — nothing you enter is sent anywhere.
          </p>
        </header>

        <section aria-label="Cubic feet to square feet converter">
          <ToolShell
            features={[
              'Volume to area by depth',
              'Cu Ft to Sq Ft & reverse',
              'Soil, mulch & concrete',
              'Imperial & metric units',
            ]}
          >
            <CubicSquareConverter />
          </ToolShell>
        </section>

        <div className={styles.adBlock}>
          <AdSlot slotId="cubic-feet-to-square-feet-middle" />
        </div>

        <article className={styles.article}>
          <p className={styles.callout}>
            <strong>Short answer:</strong> square feet = cubic feet ÷ depth (in feet), and cubic feet = square feet × depth. Without a depth there is no
            conversion — a cubic foot could cover 12 sq ft at 1 inch or 1 sq ft at 12 inches.
          </p>

          <h2>How to use the converter</h2>
          <ol>
            <li>
              <strong>Choose the direction:</strong> cubic → square to find the area a volume covers, or square → cubic to find the volume an area needs.
            </li>
            <li>
              <strong>Enter the volume</strong> (cubic feet, yards, metres, litres — or a number of bags), <strong>or the area</strong> (square feet,
              metres or yards, or length × width).
            </li>
            <li>
              <strong>Enter the depth</strong> in inches, feet, centimetres, millimetres or metres, or tap a material for a typical depth.
            </li>
            <li>
              <strong>Read the answer</strong> in every unit, with the working shown. Press <em>Reverse</em> to run it the other way.
            </li>
          </ol>

          <h2>Cubic feet to square feet</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <SpreadDiagram volumeLabel="2 ft³ bag" areaLabel={`${n(mulchBag)} ft²`} depthLabel="3 in" toArea />
              <figcaption>A 2 ft³ bag of mulch spread 3 inches deep covers {n(mulchBag)} sq ft.</figcaption>
            </figure>
            <div>
              <code className={styles.formula}>
                square feet = cubic feet ÷ depth (ft)
                <br />
                depth (ft) = depth (in) ÷ 12
              </code>
              <p>
                <strong>Mulch:</strong> a 2 ft³ bag at 3 inches (0.25 ft) covers 2 ÷ 0.25 = {n(mulchBag)} sq ft, so ten bags cover {n(tenBags)} sq ft.
              </p>
              <p>
                <strong>Topsoil by the yard:</strong> one cubic yard is 27 ft³; spread 4 inches deep it covers 27 ÷ (4 ÷ 12) = {n(yardAt4)} sq ft.
              </p>
            </div>
          </div>

          <h2>Square feet to cubic feet</h2>
          <code className={styles.formula}>
            cubic feet = square feet × depth (ft) &nbsp;·&nbsp; cubic yards = cubic feet ÷ 27
          </code>
          <ul>
            <li>
              <strong>Concrete slab:</strong> 10 × 10 ft at 4 inches = 100 × 4 ÷ 12 = {n(slab)} ft³ = {n(ft3To(slab, 'yd3'))} yd³. For bags and waste, use the{' '}
              <Link href="/concrete-calculator/">concrete calculator</Link>.
            </li>
            <li>
              <strong>Mulch bed:</strong> 200 sq ft at 3 inches = {n(bed)} ft³ — {bedBags} bags of 2 ft³.
            </li>
            <li>
              <strong>New lawn:</strong> 1,000 sq ft at 6 inches = {n(lawn, 0)} ft³ = {n(ft3To(lawn, 'yd3'))} yd³, which matches Purdue Extension’s figure of
              about 19 cubic yards for that job.
            </li>
          </ul>

          <h2>What one cubic foot covers at common depths</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.note}>Coverage and volume by depth</caption>
              <thead>
                <tr>
                  <th scope="col">Depth</th>
                  <th scope="col">1 ft³ covers</th>
                  <th scope="col">ft³ per 100 sq ft</th>
                  <th scope="col">yd³ per 100 sq ft</th>
                  <th scope="col">1 yd³ covers</th>
                </tr>
              </thead>
              <tbody>
                {depthsIn.map((d) => (
                  <tr key={d}>
                    <td>{d} in</td>
                    <td>{n(ft2PerFt3AtInches(d))} sq ft</td>
                    <td>{n(ft3Per100Ft2(d))}</td>
                    <td>{n(ft3To(ft3Per100Ft2(d), 'yd3'), 3)}</td>
                    <td>
                      <strong>{n(coverageFt2(27, inch(d)), 1)} sq ft</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.note}>Metric: what 1 m³ covers</caption>
              <thead>
                <tr>
                  <th scope="col">Depth</th>
                  <th scope="col">1 m³ covers</th>
                  <th scope="col">m³ per 10 m²</th>
                </tr>
              </thead>
              <tbody>
                {depthsCm.map((d) => (
                  <tr key={d}>
                    <td>{d} cm</td>
                    <td>
                      <strong>{n(1 / (d / 100), 1)} m²</strong>
                    </td>
                    <td>{n(10 * (d / 100), 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Typical depths by material</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.note}>Starting depths used by the presets — follow product labels and your plans</caption>
              <thead>
                <tr>
                  <th scope="col">Material</th>
                  <th scope="col">Depth</th>
                  <th scope="col">Per 100 sq ft</th>
                  <th scope="col">Guidance</th>
                </tr>
              </thead>
              <tbody>
                {PRESETS.map((p) => (
                  <tr key={p.id}>
                    <td>{p.label}</td>
                    <td>{p.depthIn} in</td>
                    <td>{n(ft3Per100Ft2(p.depthIn))} ft³</td>
                    <td>{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Loose materials settle and compact, so many people order 5–10% extra — the material calculators linked below build that in.
          </p>

          <h2>Metric conversions and cft (India)</h2>
          <p>
            The same rule works in metric: <strong>m³ = m² × depth in metres</strong> and m² = m³ ÷ depth. Remember to turn centimetres into metres
            first — 10 cm is 0.1 m, so 1 m³ covers {n(m3at10cm)} m² at 10 cm.
          </p>
          <p>
            In India, sand, aggregate and concrete are often quoted in <strong>cft</strong> (cubic feet). Square feet to cft is area × thickness in feet:
            a 1,000 sq ft area needs {n(cft1000at4, 0)} cft at 4 inches or {n(cft1000at6, 0)} cft at 6 inches. One cubic metre is {n(FT3_PER_M3)} cft, and
            in some regions loose material is sold by the <strong>brass</strong>, which is 100 cft (about {n(ft3To(100, 'm3'))} m³).
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

          <HowWeCalculate slug="cubic-feet-to-square-feet" />

          <h2>Related calculators</h2>
          <ul className={styles.related}>
            <li>
              <Link href="/cubic-yard-calculator/">
                Cubic Yard Calculator<span>Yards of soil, gravel or mulch</span>
              </Link>
            </li>
            <li>
              <Link href="/concrete-calculator/">
                Concrete Calculator<span>Slabs, footings and bags</span>
              </Link>
            </li>
            <li>
              <Link href="/compost-calculator/">
                Compost &amp; Soil Calculator<span>Beds, lawns and bag counts</span>
              </Link>
            </li>
            <li>
              <Link href="/sand-calculator/">
                Sand Calculator<span>Bedding and fill sand</span>
              </Link>
            </li>
            <li>
              <Link href="/stone-calculator/">
                Stone &amp; Gravel Calculator<span>Tons and yards of stone</span>
              </Link>
            </li>
            <li>
              <Link href="/square-footage-calculator/">
                Square Footage Calculator<span>Area of any shape first</span>
              </Link>
            </li>
          </ul>

          <p className={styles.note}>
            Disclaimer: conversions are exact for the numbers you enter; real materials settle, compact and vary by supplier. Check product labels and
            order a little extra. See our <Link href="/disclaimer/">disclaimer</Link>.
          </p>
        </article>

        <div className={styles.adBlock}>
          <AdSlot slotId="cubic-feet-to-square-feet-bottom" />
        </div>
      </main>
    </>
  );
}
