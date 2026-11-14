import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import DeckStainCalculator from '@/components/tool/deck-stain-calculator';
import { DeckDiagram, RailingDiagram } from '@/components/tool/deck-stain-calculator/DeckStainDiagram';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  CONDITION_FACTOR,
  DEFAULT_COST,
  DEFAULT_RAILING,
  DEFAULT_STAIN,
  DEFAULT_STAIRS,
  METHOD_WASTE,
  OPACITIES,
  calculateDeckStain,
  defaultInput,
  floorGallons,
  railingArea,
} from '@/lib/deck-stain-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.deckStainCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

// ---------- every number below is computed by the same engine as the tool ----------
const n = (v: number, dp = 0) => v.toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: dp });
const $ = (v: number, dp = 0) => `$${n(v, dp)}`;
const C = DEFAULT_COST;
const noRail = { ...DEFAULT_RAILING, mode: 'none' as const };

const ex = calculateDeckStain(defaultInput()); // 16 × 20 ft + 40 ft railing
const floorOnly = (l: number, w: number) => calculateDeckStain(defaultInput({ sections: [{ lengthFt: l, widthFt: w }], railing: noRail }));
const d20 = floorOnly(20, 20);
const d20one = floorGallons(20, 20, { coats: 1 });
const d20weathered = floorGallons(20, 20, { condition: 'weathered' });
const d20rough = floorGallons(20, 20, { condition: 'rough' });
const spray = calculateDeckStain(defaultInput({ stain: { ...DEFAULT_STAIN, wastePct: METHOD_WASTE.spray } }));
const stairs4 = calculateDeckStain(defaultInput({ stairs: { ...DEFAULT_STAIRS, steps: 4 } }));
const rail40 = railingArea(DEFAULT_RAILING);
const rail40simple = railingArea({ ...DEFAULT_RAILING, mode: 'simple' });

const sizes = [
  [10, 10],
  [12, 12],
  [12, 16],
  [16, 20],
  [20, 20],
  [20, 24],
  [24, 30],
].map(([l, w]) => ({ l, w, r: floorOnly(l, w), one: floorGallons(l, w, { coats: 1 }) }));

const railRows = [20, 40, 60, 80].map((L) => {
  const area = railingArea({ ...DEFAULT_RAILING, lengthFt: L });
  const r = calculateDeckStain(defaultInput({ sections: [{ lengthFt: 0, widthFt: 0 }], railing: { ...DEFAULT_RAILING, lengthFt: L } }));
  return { L, area, gal: r.needGal };
});

// coverage of a 5-gallon pail of semi-transparent stain on smooth wood, after the 10% allowance
const cov1 = DEFAULT_STAIN.coverage;
const cov2 = cov1 * DEFAULT_STAIN.secondCoatFactor;
const pailOne = (5 * cov1) / 1.1;
const pailTwo = 5 / (1 / cov1 + 1 / cov2) / 1.1;

// ---------- FAQ ----------
const faqs = [
  {
    q: 'How much stain do I need for my deck?',
    a: `Add up the floor, railings, stairs and any skirting, then divide by the coverage on your can for each coat. A 16 × 20 ft deck with 40 ft of railing has about ${n(ex.areas.total)} sq ft to stain; two coats of semi-transparent stain at ${cov1} sq ft per gallon need ${n(ex.needGal, 2)} gallons with 10% extra — so buy ${ex.cans.boughtGal} gallons.`,
  },
  {
    q: 'How much does a gallon of deck stain cover?',
    a: `It depends on the type. BEHR lists about ${OPACITIES[0].coat1[0]}–${OPACITIES[0].coat1[1]} sq ft per gallon for the first coat of its transparent finish, ${OPACITIES[1].coat1[0]}–${OPACITIES[1].coat1[1]} for semi-transparent and ${OPACITIES[2].coat1[0]}–${OPACITIES[2].coat1[1]} for solid colour, with a thinner second coat going roughly twice as far. Rough or weathered wood can take much more.`,
  },
  {
    q: 'How much stain do I need for a 20 × 20 deck?',
    a: `The 400 sq ft floor needs about ${n(d20.needGal, 2)} gallons for two coats of semi-transparent stain on smooth wood (buy ${d20.cans.boughtGal}), or ${n(d20one, 2)} gallons for one coat. On weathered boards plan on about ${n(d20weathered, 2)} gallons, and on rough-sawn wood ${n(d20rough, 2)}. Railings and stairs are extra.`,
  },
  {
    q: 'How many square feet will 5 gallons of deck stain cover?',
    a: `At ${cov1} sq ft per gallon, 5 gallons covers about ${n(pailOne)} sq ft in one coat, or about ${n(pailTwo)} sq ft in two coats (with the second coat going ${DEFAULT_STAIN.secondCoatFactor}× further), after a 10% allowance for waste.`,
  },
  {
    q: 'Do I need two coats of deck stain?',
    a: 'Many semi-transparent and solid stains are made to go on as two thin coats — BEHR asks for two thin coats on its stain-and-sealer products — while some penetrating oils are one-coat products. Follow your can. Two thin coats look more even than one heavy coat that stays tacky.',
  },
  {
    q: 'How much stain do I need for deck railings?',
    a: `More than most people expect, because every post, rail and baluster has four sides. A 40 ft railing, 36 in high, with 4×4 posts every 6 ft, two rails and 2×2 balusters has about ${n(rail40.total)} sq ft of wood (${rail40.postCount} posts and ${rail40.balusterCount} balusters) — two coats of semi-transparent stain need about ${n(railRows[1].gal, 2)} gallons.`,
  },
  {
    q: 'How much does it cost to stain a deck?',
    a: `Doing it yourself, a 20 × 20 ft deck costs about ${$(d20.diyTotal)} in stain and cleaner at $${C.pricePerGal} a gallon. Hiring a pro adds labour — Angi’s 2026 data puts it at about $1–$2.50 per sq ft — so the same deck comes to roughly ${$(d20.proTotal)} with washing at our default rates.`,
  },
  {
    q: 'Does old or rough wood need more stain?',
    a: `Yes. Grey, weathered wood and rough-sawn boards soak up stain. The calculator multiplies the label coverage by ${CONDITION_FACTOR.weathered} for weathered wood and ${CONDITION_FACTOR.rough} for rough-sawn — the second figure comes from a brand that lists rough and smooth coverage separately (Duckback SuperDeck).`,
  },
  {
    q: 'Does spraying use more stain than brushing?',
    a: `Usually, because of overspray and the stain you back-brush into the boards. The calculator adds ${METHOD_WASTE.spray}% for a sprayer and ${METHOD_WASTE.brush}% for a brush, roller or pad — on the example deck that is ${n(spray.needGal, 2)} gallons instead of ${n(ex.needGal, 2)}.`,
  },
  {
    q: 'How much deck cleaner do I need?',
    a: `Olympic lists about 250–350 sq ft per gallon for its ready-to-use deck cleaner. At ${C.cleanerCoverage} sq ft per gallon the example deck needs ${ex.cleanerGal} gallons. Concentrates go much further once mixed — read the dilution on the label.`,
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Deck Stain Calculator',
  path: route.path,
  description:
    'Free deck stain calculator: gallons or litres of stain for deck floors, railings (posts, rails and balusters), stairs and skirting, with coats, coverage by stain type, wood condition, a can-size plan and DIY vs professional cost.',
});
const faqSchema = buildFaqSchema(faqs);

export default function DeckStainCalculatorPage() {
  return (
    <>
      <JsonLd data={[webAppSchema, faqSchema]} />
      <main id="main-content" className={styles.main}>
        <Breadcrumbs items={[{ name: 'Tools', path: '/tools/' }, { name: 'Deck Stain Calculator', path: route.path }]} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Deck Stain Calculator</h1>
          <p className={styles.lead}>
            This free <strong>deck stain calculator</strong> works out how much stain your deck needs — the floor, the railings with every post and
            baluster, the stairs and any skirting — for one or two coats. Pick transparent, semi-transparent or solid stain, tell it how weathered the
            wood is, and it gives you gallons or litres, the cans to buy, how much deck cleaner you need and what the job costs if you do it yourself
            or hire a pro.
          </p>
          <p className={styles.meta}>
            Last updated: {new Date(route.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} ·
            Runs in your browser — nothing you enter is sent anywhere.
          </p>
        </header>

        <section aria-label="Deck stain calculator tool">
          <DeckStainCalculator />
        </section>

        <div className={styles.adBlock}>
          <AdSlot slotId="deck-stain-calculator-middle" />
        </div>

        <article className={styles.article}>
          <h2>How to use the deck stain calculator</h2>
          <ol>
            <li>
              <strong>Enter the deck size.</strong> Add a section for each level or for an L-shaped deck.
            </li>
            <li>
              <strong>Add the railings.</strong> Quick mode uses length × height; detailed mode counts the posts, rails and balusters for you.
            </li>
            <li>
              <strong>Add stairs and skirting</strong> if you are staining them.
            </li>
            <li>
              <strong>Choose the stain and coats.</strong> The coverage fills in from manufacturer data — replace it with the number on your can — then set
              the wood condition and whether you brush or spray.
            </li>
            <li>
              <strong>Read the result:</strong> stain needed, the cans to buy, deck cleaner, and the DIY and professional cost. Copy, print or share it.
            </li>
          </ol>

          <h2>How to calculate how much deck stain you need</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <DeckDiagram
                railing
                stairs={false}
                skirting={false}
                labels={{ floor: `${n(ex.areas.floor)} ft²`, railing: `${n(ex.areas.railing.total)} ft²` }}
              />
              <figcaption>The example deck: a 16 × 20 ft floor and 40 ft of railing — the railing is almost three-quarters the area of the floor.</figcaption>
            </figure>
            <div>
              <code className={styles.formula}>
                Area = floor + railings + stairs + skirting
                <br />
                Coat 1 (gal) = area ÷ coverage
                <br />
                Coat 2 (gal) = area ÷ (coverage × second-coat factor)
                <br />
                To buy = (coat 1 + coat 2) × (1 + extra %)
              </code>
              <p>
                <strong>Example:</strong> the 16 × 20 ft floor is 320 sq ft and the 40 ft railing adds {n(ex.areas.railing.total, 1)} sq ft, for{' '}
                {n(ex.areas.total, 1)} sq ft. With semi-transparent stain at {cov1} sq ft per gallon, the first coat takes {n(ex.coat1Gal, 2)} gallons; the
                second coat, at {n(cov2)} sq ft per gallon, takes {n(ex.coat2Gal, 2)}. Add 10% and you need <strong>{n(ex.needGal, 2)} gallons</strong> — buy{' '}
                {ex.cans.boughtGal} one-gallon cans, or a 5-gallon pail if your store sells one for less.
              </p>
            </div>
          </div>

          <h2>How much does a gallon of deck stain cover?</h2>
          <p>
            The more pigment, the more the stain sits on the surface — but coverage depends far more on the <strong>wood</strong> than the label suggests.
            These are the published figures the calculator starts from, all from one manufacturer family so they compare fairly:
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.note}>Coverage per gallon by stain type (BEHR PREMIUM data) and what a 20 × 20 ft floor needs for two coats</caption>
              <thead>
                <tr>
                  <th scope="col">Stain type</th>
                  <th scope="col">1st coat</th>
                  <th scope="col">2nd coat</th>
                  <th scope="col">Calculator default</th>
                  <th scope="col">20 × 20 ft, 2 coats</th>
                </tr>
              </thead>
              <tbody>
                {OPACITIES.map((o) => (
                  <tr key={o.id}>
                    <td>{o.label}</td>
                    <td>
                      {o.coat1[0]}–{o.coat1[1]} ft²/gal
                    </td>
                    <td>
                      {o.coat2[0]}–{o.coat2[1]} ft²/gal
                    </td>
                    <td>{o.coverage} ft²/gal</td>
                    <td>
                      <strong>{n(floorGallons(20, 20, { opacity: o.id, coverage: o.coverage }), 2)} gal</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            The calculator uses the <strong>low end</strong> of each first-coat range so you are less likely to run short, and a second coat that goes{' '}
            {DEFAULT_STAIN.secondCoatFactor}× as far — between TWP’s figures (about 1.3–1.5×) and BEHR’s (about 2×). Then it adjusts for the wood:
          </p>
          <ul>
            <li>
              <strong>New or smooth boards</strong> — label coverage (× {CONDITION_FACTOR.smooth}).
            </li>
            <li>
              <strong>Weathered, grey wood</strong> — × {CONDITION_FACTOR.weathered}. A 20 × 20 deck goes from {n(d20.needGal, 2)} to {n(d20weathered, 2)}{' '}
              gallons.
            </li>
            <li>
              <strong>Rough-sawn or very porous wood</strong> — × {CONDITION_FACTOR.rough}, from Duckback SuperDeck’s published rough (175–225) vs smooth
              (275–375) coverage. The same deck needs {n(d20rough, 2)} gallons.
            </li>
          </ul>
          <p className={styles.callout}>
            Always brush a test board first. If the first coat disappears into the wood, use a lower coverage number in the calculator before you buy the
            rest.
          </p>

          <h2>Deck stain needed by deck size</h2>
          <p>
            Floor only, semi-transparent stain on smooth wood, 10% extra, at the calculator’s default prices (${C.pricePerGal} per gallon, cleaner at $
            {C.cleanerPricePerGal}, pro labour ${C.labourPerSqFt.toFixed(2)}/ft² plus washing). Add railings and stairs with the calculator.
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.note}>Deck stain by deck size</caption>
              <thead>
                <tr>
                  <th scope="col">Deck</th>
                  <th scope="col">Area</th>
                  <th scope="col">1 coat</th>
                  <th scope="col">2 coats</th>
                  <th scope="col">Buy (2 coats)</th>
                  <th scope="col">DIY cost</th>
                  <th scope="col">Pro cost</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map(({ l, w, r, one }) => (
                  <tr key={`${l}x${w}`}>
                    <td>
                      {l} × {w} ft
                    </td>
                    <td>{n(l * w)} ft²</td>
                    <td>{n(one, 2)} gal</td>
                    <td>
                      <strong>{n(r.needGal, 2)} gal</strong>
                    </td>
                    <td>{r.cans.boughtGal} gal</td>
                    <td>{$(r.diyTotal)}</td>
                    <td>{$(r.proTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>How to measure railings, balusters and stairs</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <RailingDiagram heightLabel="36 in" gapLabel="gap under 4 in" countLabel="4×4 posts every 6 ft · 2×4 rails · 2×2 balusters" />
              <figcaption>Every post, rail and baluster is stained on all four sides — that is where the stain goes.</figcaption>
            </figure>
            <div>
              <p>
                Measure the <strong>total length</strong> of railing, including the rails down the stairs, and its height. Most residential deck guards are
                at least 36 inches high, and the gaps between balusters must stop a 4-inch sphere passing through (IRC R312). Detailed mode then works out:
              </p>
              <ul>
                <li>
                  <strong>Posts</strong> — one every {DEFAULT_RAILING.postSpacingFt} ft plus one at the end, four faces each.
                </li>
                <li>
                  <strong>Rails</strong> — the full perimeter of each rail (top, bottom and both sides) times the length.
                </li>
                <li>
                  <strong>Balusters</strong> — length ÷ (baluster width + gap), four faces each (or π × diameter for round ones).
                </li>
              </ul>
              <p>
                For 40 ft that is {n(rail40.total)} sq ft — the quick “length × height × 2” estimate gives {n(rail40simple.total)} sq ft, close enough for a
                rough budget.
              </p>
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.note}>Railing area and stain (36 in high, 4×4 posts every 6 ft, two 2×4 rails, 2×2 balusters, semi-transparent, 2 coats)</caption>
              <thead>
                <tr>
                  <th scope="col">Railing length</th>
                  <th scope="col">Posts</th>
                  <th scope="col">Balusters</th>
                  <th scope="col">Area</th>
                  <th scope="col">Stain, 2 coats</th>
                </tr>
              </thead>
              <tbody>
                {railRows.map((r) => (
                  <tr key={r.L}>
                    <td>{r.L} ft</td>
                    <td>{r.area.postCount}</td>
                    <td>{r.area.balusterCount}</td>
                    <td>{n(r.area.total)} ft²</td>
                    <td>
                      <strong>{n(r.gal, 2)} gal</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            <strong>Stairs:</strong> each step has a tread and a riser, and the outside stringers show on both faces. Four steps, 4 ft wide, with 10½-inch
            treads and 7½-inch risers add {n(stairs4.areas.stairs.total, 1)} sq ft ({n(stairs4.areas.stairs.treads)} treads, {n(stairs4.areas.stairs.risers)}{' '}
            risers, {n(stairs4.areas.stairs.stringers, 1)} stringers).
          </p>

          <h2>One coat or two?</h2>
          <p>
            Read the can. Many water-based semi-transparent and solid stains are designed as <strong>two thin coats</strong>, the second applied while the
            first is still workable or soon after; some oil-based penetrating stains are one-coat products, and a second coat just sits on top and stays
            sticky. On a 20 × 20 ft deck the difference is {n(d20one, 2)} gallons for one coat against {n(d20.needGal, 2)} for two. The second coat needs
            less stain because the wood is already partly filled.
          </p>

          <h2>Prep: cleaner, brightener and stripper</h2>
          <p>
            Stain soaks into clean, dry wood. Wash the deck first — Olympic lists about 250–350 sq ft per gallon for its ready-to-use deck cleaner, so the
            example deck needs {ex.cleanerGal} gallons at {C.cleanerCoverage} sq ft per gallon. A brightener after a cleaner or stripper restores the wood’s
            colour. Old film-forming or solid stain usually has to be stripped before you change to a lighter or penetrating stain. If you hire a pro,
            Fixr lists washing at about $0.30–$0.40 per sq ft, stripping at $1–$3 and sanding at $1–$4.
          </p>

          <h2>Cost to stain a deck: DIY vs hiring a pro</h2>
          <p>
            Materials are the cheap part. Fixr lists deck stain at about $25–$90 a gallon depending on type and brand; the calculator defaults to $
            {C.pricePerGal}. Labour is where the money goes: Angi’s 2026 data puts professional staining labour at about $1–$2.50 per sq ft. For the
            example deck that means <strong>{$(ex.diyTotal)}</strong> doing it yourself (stain and cleaner) against <strong>{$(ex.proTotal)}</strong> for a
            pro at ${C.labourPerSqFt.toFixed(2)}/ft² with washing — {$(ex.proPerSqFt, 2)} per sq ft of deck once the railing is counted.
          </p>
          <ul>
            <li>
              <strong>Ask for a price per square foot and per linear foot of railing</strong> — railings take far longer than open floor.
            </li>
            <li>
              <strong>Check what prep is included:</strong> a wash, a strip or a sand change the price a lot.
            </li>
            <li>
              <strong>Buy by the pail when it is cheaper</strong> — enter the pail price and the calculator picks the cheapest mix of pails and gallons.
            </li>
          </ul>

          <h2>Tips for a better stain job</h2>
          <ul>
            <li>Stain when the wood is dry and the weather is mild — out of direct midday sun, with no rain forecast for a day or two.</li>
            <li>Work a few boards at a time, end to end, so you never leave a lap mark in the middle of a board.</li>
            <li>Do the railings first, then the floor, working towards the stairs so you don’t trap yourself.</li>
            <li>Keep a brush handy even if you spray or roll, to work stain into end grain and gaps.</li>
            <li>
              Fence too? Use the <Link href="/fence-stain-calculator/">fence stain calculator</Link> for the panels.
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

          <HowWeCalculate slug="deck-stain-calculator" />

          <h2>Related calculators</h2>
          <ul className={styles.related}>
            <li>
              <Link href="/fence-stain-calculator/">
                Fence Stain Calculator<span>Gallons for fence panels and pickets</span>
              </Link>
            </li>
            <li>
              <Link href="/paint-cost-calculator/">
                Paint Cost Calculator<span>Gallons and cost for walls</span>
              </Link>
            </li>
            <li>
              <Link href="/board-and-batten-calculator/">
                Board and Batten Calculator<span>Boards, battens and finish for a wall</span>
              </Link>
            </li>
            <li>
              <Link href="/square-footage-calculator/">
                Square Footage Calculator<span>Odd-shaped deck areas</span>
              </Link>
            </li>
            <li>
              <Link href="/linear-foot-calculator/">
                Linear Foot Calculator<span>Add up railing runs</span>
              </Link>
            </li>
            <li>
              <Link href="/concrete-slab-cost-calculator/">
                Concrete Slab Cost Calculator<span>Price a patio instead of a deck</span>
              </Link>
            </li>
          </ul>

          <p className={styles.note}>
            Disclaimer: results are estimates. Coverage varies with the product, the wood and how it is applied; follow the instructions and coverage on
            your stain can and test a small area first. Prices are US figures from the sources above and change over time. See our{' '}
            <Link href="/disclaimer/">disclaimer</Link>.
          </p>
        </article>

        <div className={styles.adBlock}>
          <AdSlot slotId="deck-stain-calculator-bottom" />
        </div>
      </main>
    </>
  );
}
