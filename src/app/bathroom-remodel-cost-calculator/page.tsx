import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import BathroomRemodelCalculator from '@/components/tool/bathroom-remodel-calculator';
import { BathroomPlan, SpendBar } from '@/components/tool/bathroom-remodel-calculator/BathroomDiagram';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import { BATHING, CONTINGENCY_PCT, FINISH_FACTOR, FINISH_LABEL, ITEMS, REFERENCE_SQFT, calculateRemodel, defaultRemodelInput, quickRemodel, type Bathing, type Finish } from '@/lib/bathroom-remodel-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.bathroomRemodelCostCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

// ---------- every number below comes from the same engine as the tool ----------
const n = (v: number, dp = 0) => v.toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: dp });
const $ = (v: number, dp = 0) => `$${n(v, dp)}`;
const finishes: Finish[] = ['basic', 'mid', 'high'];

const ex = calculateRemodel(defaultRemodelInput()); // 5 × 8 ft full bath, mid-range, tub/shower combo
const half = calculateRemodel(defaultRemodelInput('half'));
const primary = calculateRemodel(defaultRemodelInput('primary'));
const cosmetic = quickRemodel(40, 'mid', 'combo', 'cosmetic').total;
const cosmeticBasic = quickRemodel(40, 'basic', 'combo', 'cosmetic').total;
const basicFull = quickRemodel(40, 'basic').total;
const shower40 = quickRemodel(40, 'mid', 'shower').total;
const sizes = [25, 40, 60, 80, 100, 130].map((A) => ({ A, row: finishes.map((f) => quickRemodel(A, f, A <= 25 ? 'none' : 'combo').total) }));
const bathOpts = (Object.keys(BATHING) as Bathing[]).map((b) => ({ b, total: quickRemodel(40, 'mid', b).total }));
const plumbing = ITEMS.find((i) => i.id === 'plumbing')!.average;
const segOf = (ids: string[]) => ex.lines.filter((l) => ids.includes(l.id)).reduce((a, l) => a + l.amount, 0);

// ---------- FAQ ----------
const faqs = [
  {
    q: 'How much does it cost to remodel a bathroom?',
    a: `This Old House puts the 2026 national average at about $15,600, with most projects between about $6,500 and $24,700. Using its line-item averages, a 5 × 8 ft full bathroom with a tub/shower combo comes to about ${$(ex.total)} at mid-range finishes, or ${$(ex.budget)} with a ${CONTINGENCY_PCT}% contingency.`,
  },
  {
    q: 'How much does a small bathroom remodel cost?',
    a: `A full remodel of a 40 sq ft bathroom is about ${$(basicFull)} with budget finishes and ${$(ex.total)} mid-range. A cosmetic refresh — new vanity, toilet, floor, tile and paint, keeping the tub and plumbing — is about ${$(cosmeticBasic)} to ${$(cosmetic)}.`,
  },
  {
    q: 'How much does a half bath or powder room remodel cost?',
    a: `About ${$(half.total)} at mid-range for a 5 × 5 ft room with new plumbing. Half baths cost less mainly because there is no tub or shower; if the pipes stay where they are, plumbing — ${$(plumbing)} on average — can be much lower, so adjust that line.`,
  },
  {
    q: 'How much does a primary (master) bathroom remodel cost?',
    a: `A 10 × 13 ft primary bath with a freestanding tub and a separate shower comes to about ${$(primary.total)} at mid-range (${$(primary.budget)} with contingency). This Old House lists $22,370–$24,715 for primary baths of 130 sq ft and up before tub and shower upgrades.`,
  },
  {
    q: 'How much does a tub-to-shower conversion cost?',
    a: `On a 40 sq ft bathroom, choosing a walk-in shower instead of a tub/shower combo raises the estimate from ${$(ex.total)} to ${$(shower40)}, because This Old House’s average complete shower remodel is ${$(BATHING.shower.average)} against ${$(BATHING.combo.average)} for a combo unit.`,
  },
  {
    q: 'What can I get for $5,000, $10,000 or $20,000?',
    a: `Roughly: $5,000 covers a budget cosmetic refresh of a small bathroom (${$(cosmeticBasic)} for 40 sq ft); $10,000 covers a budget full remodel (${$(basicFull)}) or a mid-range refresh (${$(cosmetic)}); $20,000 covers a mid-range full remodel of most bathrooms up to about 100 sq ft (${$(quickRemodel(100).total)}).`,
  },
  {
    q: 'How much contingency should I add?',
    a: `This Old House recommends setting aside 20% for surprises such as rot under the floor, old wiring or pipes that must move. The calculator adds ${CONTINGENCY_PCT}% by default and shows the budget with and without it.`,
  },
  {
    q: 'What costs the most in a bathroom remodel?',
    a: `Plumbing (${$(plumbing)} on average) and a new walk-in shower (${$(BATHING.shower.average)}) are the biggest single lines, followed by cabinetry and drywall. Moving the toilet, shower or sink drain is what pushes plumbing up most.`,
  },
  {
    q: 'Is a bathroom remodel worth it when selling?',
    a: 'This Old House reports that a mid-range bathroom remodel recoups about 80% of its cost in resale value. The rest of the value is in your own use and comfort while you live there.',
  },
  {
    q: 'How accurate is a bathroom remodel calculator?',
    a: 'It gives a planning budget, not a quote. The defaults are national averages; local labour rates, the condition behind the walls and your exact fixtures can move the price a lot. Replace the line prices with real quotes as you get them — and use the quote checker to see whether a bid is in range.',
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Bathroom Remodel Cost Calculator',
  path: route.path,
  description:
    'Free bathroom remodel cost calculator: half, full or primary bath, cosmetic refresh or full remodel, budget/mid/high finishes, editable line items (fixtures, vanity, plumbing, electrical, flooring, tile, paint, drywall, tub or shower), region, contingency and a quote checker.',
});
const faqSchema = buildFaqSchema(faqs);

export default function BathroomRemodelCostCalculatorPage() {
  return (
    <>
      <JsonLd data={[webAppSchema, faqSchema]} />
      <main id="main-content" className={styles.main}>
        <Breadcrumbs items={[{ name: 'Tools', path: '/tools/' }, { name: 'Bathroom Remodel Cost Calculator', path: route.path }]} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Bathroom Remodel Cost Calculator</h1>
          <p className={styles.lead}>
            This <strong>cost to remodel a bathroom calculator</strong> builds your budget line by line: pick a half, full or primary bath, a cosmetic
            refresh or a full remodel, and budget, mid-range or high-end finishes. Every price — toilet, vanity, plumbing, electrical, flooring, tile,
            paint, drywall and the tub or shower — is shown and editable, and you get a low–high range, a budget with contingency and a check for any
            quote you have.
          </p>
          <p className={styles.meta}>
            Last updated: {new Date(route.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} ·
            Prices from This Old House’s 2026 averages · Runs in your browser — nothing you enter is sent anywhere.
          </p>
        </header>

        <section aria-label="Bathroom remodel cost calculator tool">
          <BathroomRemodelCalculator />
        </section>

        <div className={styles.adBlock}>
          <AdSlot slotId="bathroom-remodel-cost-calculator-middle" />
        </div>

        <article className={styles.article}>
          <h2>How to use the bathroom remodel calculator</h2>
          <ol>
            <li>
              <strong>Pick the bathroom type</strong> and enter its length and width (feet or metres).
            </li>
            <li>
              <strong>Choose the scope:</strong> a cosmetic refresh that keeps the tub, plumbing and walls, or a full remodel down to the studs.
            </li>
            <li>
              <strong>Choose the finish level.</strong> It refills every price from 2026 national averages; then edit any line, or untick what you are
              keeping or doing yourself.
            </li>
            <li>
              <strong>Pick the tub and shower</strong>, add a water heater, permit, region factor and contingency.
            </li>
            <li>
              <strong>Read the estimate</strong>, the range and the budget with contingency — and paste in a contractor’s quote to see whether it is in
              range.
            </li>
          </ol>

          <h2>How much does a bathroom remodel cost?</h2>
          <p>
            This Old House’s July 2026 guide puts the average bathroom remodel at about <strong>$15,600</strong>, with most between about $6,500 and
            $24,700. The calculator starts from its line-item averages and spreads the floor-area items (flooring, tile, paint, drywall) over a{' '}
            {REFERENCE_SQFT} sq ft reference room, so small and large rooms are priced fairly. Finish levels scale everything by the ratio of This Old
            House’s budget and high-end ranges to its mid-range (×{FINISH_FACTOR.basic} and ×{FINISH_FACTOR.high}).
          </p>

          <h2>Bathroom renovation cost by size and finish</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.note}>Full remodel, tub/shower combo (no tub for 25 sq ft), before contingency</caption>
              <thead>
                <tr>
                  <th scope="col">Floor area</th>
                  {finishes.map((f) => (
                    <th scope="col" key={f}>
                      {FINISH_LABEL[f]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizes.map(({ A, row }) => (
                  <tr key={A}>
                    <td>
                      {A} sq ft{A === 25 ? ' (half bath)' : A === 40 ? ' (5 × 8 ft)' : A === 130 ? ' (primary)' : ''}
                    </td>
                    {row.map((v, i) => (
                      <td key={i}>{i === 1 ? <strong>{$(v)}</strong> : $(v)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            These line up with This Old House’s own size table — about $12,700–$14,800 for 40–60 sq ft, $19,200–$21,300 for 100–120 sq ft and $22,400–$24,700
            for primary baths at mid-range — and with its finish-level table for a 50 sq ft room.
          </p>

          <h2>Where the money goes</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <SpendBar
                segments={[
                  { label: 'Fixtures & vanity', amount: segOf(['toilet', 'vanity', 'top', 'faucets']), tone: 'a' },
                  { label: 'Plumbing & electrical', amount: segOf(['plumbing', 'electrical']), tone: 'b' },
                  { label: 'Floors, walls & paint', amount: segOf(['flooring', 'tile', 'paint', 'drywall']), tone: 'c' },
                  { label: 'Tub / shower', amount: segOf(['bathing']), tone: 'd' },
                ]}
                format={(v) => $(v)}
              />
              <figcaption>The 5 × 8 ft mid-range example: plumbing is the biggest single line.</figcaption>
            </figure>
            <div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <caption className={styles.note}>Line items for the 5 × 8 ft example</caption>
                  <thead>
                    <tr>
                      <th scope="col">Line</th>
                      <th scope="col">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ex.lines.map((l) => (
                      <tr key={l.id}>
                        <td>{l.label}</td>
                        <td>{$(l.amount)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td>
                        <strong>Estimate</strong>
                      </td>
                      <td>
                        <strong>{$(ex.total)}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <h2>Tub, shower or both?</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <BathroomPlan bathing="combo" lengthLabel="8 ft" widthLabel="5 ft" ratio={8 / 5} />
              <figcaption>A standard 5 × 8 ft full bath: tub/shower combo on the end wall, vanity and toilet along the side.</figcaption>
            </figure>
            <div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <caption className={styles.note}>40 sq ft full remodel, mid-range, by bathing option</caption>
                  <thead>
                    <tr>
                      <th scope="col">Option</th>
                      <th scope="col">Installed (average)</th>
                      <th scope="col">Whole remodel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bathOpts.map(({ b, total }) => (
                      <tr key={b}>
                        <td>{BATHING[b].label}</td>
                        <td>{$(BATHING[b].average)}</td>
                        <td>{$(total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <p>
            A tub/shower combo is the cheapest way to keep both; a tiled walk-in shower costs far more because of waterproofing, tile and glass.
          </p>

          <h2>What pushes the price up</h2>
          <ul>
            <li>
              <strong>Moving plumbing</strong> — relocating the toilet, shower or sink drain means opening floors and walls.
            </li>
            <li>
              <strong>Hidden damage</strong> — rot under the toilet or behind the shower is common in older bathrooms; it is why the contingency exists.
            </li>
            <li>
              <strong>Custom tile and stone</strong> — large-format or patterned tile takes longer to set; use the{' '}
              <Link href="/tile-calculator/">tile calculator</Link> to price materials.
            </li>
            <li>
              <strong>Electrical upgrades</strong> — new circuits, heated floors or extra lighting.
            </li>
            <li>
              <strong>Location</strong> — labour rates vary a lot from city to city; use the region factor to scale the whole estimate.
            </li>
          </ul>

          <h2>DIY vs hiring pros</h2>
          <p>
            Untick the lines you will do yourself — painting and demolition are the usual DIY jobs. Leave plumbing, electrical, waterproofing and tile in
            wet areas to licensed pros: mistakes there cause leaks and failed inspections, and in many places the work must be done or signed off by a
            licensed tradesperson. Painting alone is {$(ex.lines.find((l) => l.id === 'paint')?.amount ?? 0)} of the example estimate; the{' '}
            <Link href="/paint-cost-calculator/">paint cost calculator</Link> prices the materials.
          </p>

          <h2>Permits, timeline and contingency</h2>
          <p>
            Moving plumbing or adding circuits usually needs a permit; a like-for-like swap of fixtures often does not — ask your building department and
            enter the fee. This Old House recommends a <strong>20% contingency</strong>, which the calculator adds by default (the example’s{' '}
            {$(ex.total)} becomes {$(ex.budget)}). Cosmetic refreshes can take days; full remodels usually take several weeks, longer if fixtures are on
            back-order.
          </p>

          <h2>Is a bathroom remodel worth it?</h2>
          <p>
            For resale, This Old House reports that a mid-range bathroom remodel recoups about 80% of its cost. Its budgeting rule of thumb is 5–10% of
            the home’s value for a primary bathroom and 3–5% for others.
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

          <HowWeCalculate slug="bathroom-remodel-cost-calculator" />

          <h2>Related calculators</h2>
          <ul className={styles.related}>
            <li>
              <Link href="/tile-calculator/">
                Tile Calculator<span>Tiles, grout and boxes</span>
              </Link>
            </li>
            <li>
              <Link href="/paint-cost-calculator/">
                Paint Cost Calculator<span>Gallons and cost for walls</span>
              </Link>
            </li>
            <li>
              <Link href="/drywall-calculator/">
                Drywall Calculator<span>Sheets and mud for the walls</span>
              </Link>
            </li>
            <li>
              <Link href="/laminate-flooring-calculator/">
                Laminate Flooring Calculator<span>Boxes of flooring</span>
              </Link>
            </li>
            <li>
              <Link href="/square-footage-calculator/">
                Square Footage Calculator<span>Odd-shaped rooms</span>
              </Link>
            </li>
            <li>
              <Link href="/construction-estimate-template/">
                Construction Estimate Template<span>Write up the quote</span>
              </Link>
            </li>
          </ul>

          <p className={styles.note}>
            Disclaimer: results are planning estimates from national averages; your costs depend on local labour, the condition of the room and the
            products you choose. Plumbing and electrical work must meet local code. Get itemized quotes. See our{' '}
            <Link href="/disclaimer/">disclaimer</Link>.
          </p>
        </article>

        <div className={styles.adBlock}>
          <AdSlot slotId="bathroom-remodel-cost-calculator-bottom" />
        </div>
      </main>
    </>
  );
}
