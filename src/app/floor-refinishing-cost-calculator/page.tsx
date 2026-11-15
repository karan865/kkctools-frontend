import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import FloorRefinishingCalculator from '@/components/tool/floor-refinishing-calculator';
import { BoardSection, OptionBars, RoomsPlan } from '@/components/tool/floor-refinishing-calculator/FloorDiagram';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  EXTRAS,
  EXTRA_ORDER,
  FINISHES,
  FINISH_COVERAGE,
  LABOUR_HOURS_PER_100,
  METHODS,
  METHOD_ORDER,
  REPLACE,
  SPECIES,
  STAIN,
  calculateDiy,
  calculateRefinish,
  defaultDiyInput,
  defaultRefinishInput,
  quickRefinish,
  replaceCost,
  type Species,
} from '@/lib/floor-refinish-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.floorRefinishingCostCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

// ---------- every number below comes from the same engine as the tool ----------
const n = (v: number, dp = 0) => v.toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: dp });
const $ = (v: number, dp = 0) => `$${n(v, dp)}`;
const $r = (lo: number, hi: number) => `${$(lo, lo % 1 ? 2 : 0)}–${$(hi, hi % 1 ? 2 : 0)}`;

const room = quickRefinish(180); // 12 × 15 ft room, full sand
const roomStain = quickRefinish(180, 'sand', true);
const home = quickRefinish(1000);
const homeStain = quickRefinish(1000, 'sand', true);
const homeRecoat = quickRefinish(1000, 'recoat');
const homeDustless = quickRefinish(1000, 'dustless');
const sizes = [100, 200, 300, 500, 1000, 2000].map((A) => ({
  A,
  recoat: quickRefinish(A, 'recoat').total,
  sand: quickRefinish(A, 'sand').total,
  stain: quickRefinish(A, 'sand', true).total,
  dustless: quickRefinish(A, 'dustless').total,
}));
const stairs13 = calculateRefinish(defaultRefinishInput({ areaSqFt: 0, qty: { stairs: 13 } })).lines[0];
const ex500 = { A: 500, sand: quickRefinish(500, 'sand', true), replace: replaceCost(500), recoat: quickRefinish(500, 'recoat') };
const diy300 = calculateDiy(defaultDiyInput({ areaSqFt: 300, stain: true, buyVacuum: true }));
const pro300 = quickRefinish(300, 'sand', true);
const quote = { amount: 3650, area: 600 };
const quoteRange = quickRefinish(quote.area, 'sand', true);
const quoteRangeNoStain = quickRefinish(quote.area, 'sand', false);
const speciesList = Object.keys(SPECIES) as Species[];
// a typical full job with extras, for the worked example
const worked = calculateRefinish(defaultRefinishInput({ areaSqFt: 444, stain: true, qty: { furniture: 2, repair: 20, stairs: 13 } }));

// ---------- FAQ ----------
const faqs = [
  {
    q: 'How much does it cost to refinish hardwood floors?',
    a: `This Old House puts professional refinishing at $3–$8 per sq ft. With mid-range rates, a 12 × 15 ft room costs about ${$(room.total)} for a full sand and new finish, or ${$(roomStain.total)} with a stain colour change; 1,000 sq ft costs about ${$(home.total)} to ${$(homeStain.total)}.`,
  },
  {
    q: 'How much does hardwood floor resurfacing cost?',
    a: `Resurfacing usually means sanding the floor to bare wood and refinishing it — ${$r(METHODS.sand.low, METHODS.sand.high)} per sq ft, plus ${$r(STAIN.low, STAIN.high)} if you stain. For 500 sq ft that is about ${$(quickRefinish(500).total)} natural or ${$(ex500.sand.total)} stained. If a contractor uses “resurfacing” for a screen and recoat, the price is ${$r(METHODS.recoat.low, METHODS.recoat.high)} per sq ft instead.`,
  },
  {
    q: 'How much cheaper is a screen and recoat than a full refinish?',
    a: `Roughly a third of the price: ${$r(METHODS.recoat.low, METHODS.recoat.high)} per sq ft against ${$r(METHODS.sand.low, METHODS.sand.high)}. On 1,000 sq ft that is about ${$(homeRecoat.total)} versus ${$(home.total)}. It only works while the old finish is intact — it cannot remove scratches that go into the wood, and it cannot change the colour.`,
  },
  {
    q: 'Is dustless refinishing worth the extra cost?',
    a: `Dustless refinishing runs ${$r(METHODS.dustless.low, METHODS.dustless.high)} per sq ft against ${$r(METHODS.sand.low, METHODS.sand.high)} for a standard sand — about ${$(homeDustless.total - home.total)} more on 1,000 sq ft. It is worth it if you are living in the house during the work, have allergies or asthma in the family, or have open-plan rooms where dust would travel. The finished floor is the same.`,
  },
  {
    q: 'How much does it cost to refinish hardwood stairs?',
    a: `Fixr puts it at ${$r(EXTRAS.stairs.low, EXTRAS.stairs.high)} per step — far more per square foot than open floor, because every tread has edges and corners the big sander cannot reach. A 13-step staircase is about ${$(stairs13.amount)} (${$(stairs13.low)}–${$(stairs13.high)}). Painted risers, spindles and handrails cost extra.`,
  },
  {
    q: 'Is it cheaper to refinish or replace hardwood floors?',
    a: `Usually, by a wide margin. On 500 sq ft, a full sand with stain is about ${$(ex500.sand.total)} and a recoat about ${$(ex500.recoat.total)}; new hardwood at This Old House’s ${$r(REPLACE.low, REPLACE.high)} per sq ft installed is about ${$(ex500.replace.total)} at the midpoint (${$(ex500.replace.low)}–${$(ex500.replace.high)}). Replace only when the boards are cupped, rotten, too thin to sand or badly water-damaged.`,
  },
  {
    q: 'Can I refinish hardwood floors myself, and what does it cost?',
    a: `Yes, if you are patient. This Old House puts a DIY job at $500–$1,000 for rentals, abrasives, finish and safety gear. For 300 sq ft with stain, the calculator’s shopping list (including a shop vacuum) is about ${$(diy300.total)} against roughly ${$(pro300.total)} for a pro. The risk is the drum sander: let it stop on the floor and it cuts a dip that only more sanding removes.`,
  },
  {
    q: 'How many times can a hardwood floor be refinished?',
    a: 'This Old House says a solid hardwood floor can be refinished up to about 12 times, and engineered wood usually only once or twice, because each full sand removes a thin layer of wood. A screen and recoat removes no wood, so it does not use up that allowance.',
  },
  {
    q: 'How often should hardwood floors be refinished?',
    a: 'This Old House suggests every 7–10 years for a properly protected floor. Recoating more often — whenever the finish looks dull in the traffic lanes but has not worn through — stretches the time between full sandings.',
  },
  {
    q: 'Is my refinishing quote fair?',
    a: `Divide the quote by the area. ${$(quote.amount)} for ${n(quote.area)} sq ft is ${$(quote.amount / quote.area, 2)} per sq ft — within the range for a full sand with stain (${$(quoteRange.low)}–${$(quoteRange.high)}), and above the range without stain (${$(quoteRangeNoStain.low)}–${$(quoteRangeNoStain.high)}). Enter your own quote in the calculator to check it the same way.`,
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Hardwood Floor Refinishing Cost Calculator',
  path: route.path,
  description:
    'Free hardwood floor refinishing and resurfacing cost calculator: rooms or total area, screen & recoat, full sand or dustless, wood species, stain, repairs, stairs and furniture moving, DIY shopping list, refinish vs replace and a quote checker.',
});
const faqSchema = buildFaqSchema(faqs);

export default function FloorRefinishingCostCalculatorPage() {
  return (
    <>
      <JsonLd data={[webAppSchema, faqSchema]} />
      <main id="main-content" className={styles.main}>
        <Breadcrumbs items={[{ name: 'Tools', path: '/tools/' }, { name: 'Floor Refinishing Cost Calculator', path: route.path }]} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Hardwood Floor Refinishing &amp; Resurfacing Cost Calculator</h1>
          <p className={styles.lead}>
            Work out the <strong>cost to refinish hardwood floors</strong> room by room. Choose a screen and recoat, a full sand or a dustless sand, the wood,
            whether you want a new stain colour, and add repairs, stairs and furniture moving. Every rate is shown and editable, and you get a low–high range,
            a DIY shopping list, the cost of replacing instead and a check for any quote you have.
          </p>
          <p className={styles.meta}>
            Last updated: {new Date(route.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} · Prices
            from This Old House (June 2026) and Fixr · Runs in your browser — nothing you enter is sent anywhere.
          </p>
        </header>

        <section aria-label="Hardwood floor refinishing cost calculator tool">
          <FloorRefinishingCalculator />
        </section>

        <div className={styles.adBlock}>
          <AdSlot slotId="floor-refinishing-cost-calculator-middle" />
        </div>

        <article className={styles.article}>
          <h2>How to use the floor refinishing calculator</h2>
          <ol>
            <li>
              <strong>Enter the floor:</strong> length and width of each room (feet or metres), or the total area if you already know it.
            </li>
            <li>
              <strong>Pick the method</strong> — screen &amp; recoat, full sand &amp; refinish, or dustless — and the wood species. Tick the stain box if you
              want a new colour.
            </li>
            <li>
              <strong>Add the extras</strong> your floor needs: spot repairs, new boards, subfloor repair, carpet removal, stairs, furniture moving or
              baseboards. Each shows its typical price range.
            </li>
            <li>
              <strong>Adjust for your area</strong> with the region factor and any minimum charge your contractor quotes.
            </li>
            <li>
              <strong>Compare</strong> the pro estimate with the DIY shopping list and with replacing the floor — and paste a quote in to see whether it is in
              range.
            </li>
          </ol>

          <h2>Refinishing, resurfacing or recoating?</h2>
          <p>
            The words get mixed up in quotes, and the price difference between them is large, so it pays to ask which one you are being offered.
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Term</th>
                  <th scope="col">What is done</th>
                  <th scope="col">Fixes</th>
                  <th scope="col">Price per sq ft</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Screen &amp; recoat (buff and coat, “sandless”)</td>
                  <td>Old finish roughened with a buffer, cleaned, one or two fresh coats</td>
                  <td>Dullness, fine surface scratches</td>
                  <td>{$r(METHODS.recoat.low, METHODS.recoat.high)}</td>
                </tr>
                <tr>
                  <td>Full refinish / resurfacing</td>
                  <td>Sanded to bare wood in several grits, edged, optional stain, new finish</td>
                  <td>Deep scratches, worn lanes, grey wood, old colour</td>
                  <td>{$r(METHODS.sand.low, METHODS.sand.high)}</td>
                </tr>
                <tr>
                  <td>Dustless refinish</td>
                  <td>The same full sand with sanders hooked to dust-collection vacuums</td>
                  <td>As above, with far less dust</td>
                  <td>{$r(METHODS.dustless.low, METHODS.dustless.high)}</td>
                </tr>
                <tr>
                  <td>Stain colour change</td>
                  <td>Stain applied to the bare wood after a full sand</td>
                  <td>Changes the colour</td>
                  <td>+{$r(STAIN.low, STAIN.high)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <BoardSection method="recoat" engineered={false} stained idPrefix="pg-a" />
              <figcaption>Screen &amp; recoat: only the top of the old finish is scuffed so the new coats bond.</figcaption>
            </figure>
            <figure className={styles.figureBox}>
              <BoardSection method="sand" engineered={false} stained idPrefix="pg-b" />
              <figcaption>Full sand: every coat and the old stain come off, plus a thin skin of wood.</figcaption>
            </figure>
          </div>
          <p>
            A quick test tells you which you need: put a few drops of water on the most worn spot. If they bead, the finish is still sealing the wood and a
            recoat will do. If they soak in and darken the wood, the finish is worn through there and the floor needs a full sand.
          </p>

          <h2>Hardwood floor resurfacing cost per square foot</h2>
          <p>
            This Old House’s June 2026 guide puts professional refinishing at <strong>$3–$8 per sq ft</strong> all in. The calculator splits that into the
            parts you can choose, and starts each at the middle of its range:
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Work</th>
                  <th scope="col">Range per sq ft</th>
                  <th scope="col">Calculator default</th>
                </tr>
              </thead>
              <tbody>
                {METHOD_ORDER.map((m) => (
                  <tr key={m}>
                    <td>{METHODS[m].label}</td>
                    <td>{$r(METHODS[m].low, METHODS[m].high)}</td>
                    <td>{$(METHODS[m].rate, 2)}</td>
                  </tr>
                ))}
                <tr>
                  <td>Stain (added to a sand)</td>
                  <td>{$r(STAIN.low, STAIN.high)}</td>
                  <td>{$(STAIN.rate, 2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Labour is most of the bill — up to 80% according to This Old House, which also estimates about {LABOUR_HOURS_PER_100} hours of work per 100 sq ft.
            That is why the price per square foot barely falls for bigger jobs, and why small rooms can hit a contractor’s minimum charge.
          </p>

          <h2>Cost to refinish hardwood floors by room size</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.note}>Oak, mid-range rates, floor only (no repairs, stairs or furniture moving)</caption>
              <thead>
                <tr>
                  <th scope="col">Area</th>
                  <th scope="col">Screen &amp; recoat</th>
                  <th scope="col">Full sand</th>
                  <th scope="col">Sand + stain</th>
                  <th scope="col">Dustless</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map((r) => (
                  <tr key={r.A}>
                    <td>
                      {n(r.A)} sq ft{r.A === 200 ? ' (large bedroom)' : r.A === 1000 ? ' (main floor)' : ''}
                    </td>
                    <td>{$(r.recoat)}</td>
                    <td>
                      <strong>{$(r.sand)}</strong>
                    </td>
                    <td>{$(r.stain)}</td>
                    <td>{$(r.dustless)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>What the wood species does to the price</h2>
          <p>
            Hard, dense woods take longer to sand, and soft woods need more care not to gouge, so refinishing prices vary by species. The calculator applies
            This Old House’s species ranges as a factor on the sanding rate (a recoat is priced the same for every wood):
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Wood</th>
                  <th scope="col">Range per sq ft</th>
                  <th scope="col">Factor vs oak</th>
                  <th scope="col">Full sand, 300 sq ft</th>
                </tr>
              </thead>
              <tbody>
                {speciesList.map((k) => (
                  <tr key={k}>
                    <td>{SPECIES[k].label}</td>
                    <td>{$r(SPECIES[k].low, SPECIES[k].high)}</td>
                    <td>×{SPECIES[k].factor}</td>
                    <td>{$(quickRefinish(300, 'sand', false, k).total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Extra costs: repairs, stairs, carpet and furniture</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Extra</th>
                  <th scope="col">Typical price</th>
                  <th scope="col">Source</th>
                </tr>
              </thead>
              <tbody>
                {EXTRA_ORDER.map((k) => {
                  const e = EXTRAS[k];
                  const unit = e.unit === 'sqft' ? ' per sq ft' : e.unit === 'step' ? ' per step' : e.unit === 'room' ? ' per room' : ' per job';
                  return (
                    <tr key={k}>
                      <td>{e.label}</td>
                      <td>
                        {e.low === e.high ? `about ${$(e.rate)}` : $r(e.low, e.high)}
                        {unit}
                      </td>
                      <td>{e.source === 'TOH' ? 'This Old House' : 'Fixr'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p>
            Repairs are priced on the area actually repaired, not the whole floor. Ask whether moving furniture and removing the shoe moulding are included —
            they are common gaps between quotes.
          </p>

          <h2>A worked example</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <RoomsPlan
                rooms={[
                  { l: 20, w: 15, area: '300 ft²' },
                  { l: 12, w: 12, area: '144 ft²' },
                ]}
                unit="ft"
                areaLabel="Total 444 ft²"
                steps={13}
                idPrefix="pg-plan"
              />
              <figcaption>A 20 × 15 ft living room, a 12 × 12 ft bedroom and a 13-step staircase; furniture moved in both rooms.</figcaption>
            </figure>
            <div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <caption className={styles.note}>Sand + stain, oak, 20 sq ft of repairs</caption>
                  <tbody>
                    {worked.lines.map((l) => (
                      <tr key={l.id}>
                        <td>{l.label}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{$(l.amount)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td>
                        <strong>Estimate</strong>
                      </td>
                      <td>
                        <strong>{$(worked.total)}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>Range</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {$(worked.low)}–{$(worked.high)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <h2>Choosing a finish</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Finish</th>
                  <th scope="col">Price per gallon</th>
                  <th scope="col">Character</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{FINISHES.oil.label}</td>
                  <td>{$r(FINISHES.oil.low, FINISHES.oil.high)}</td>
                  <td>Warm amber tone that deepens with age; strong smell; longer wait between coats</td>
                </tr>
                <tr>
                  <td>{FINISHES.water.label}</td>
                  <td>{$r(FINISHES.water.low, FINISHES.water.high)}</td>
                  <td>Stays clear, keeps pale woods pale; low odour; dries fast, so several coats fit in a day</td>
                </tr>
                <tr>
                  <td>Hard-wax oil / penetrating oil</td>
                  <td>$40–$100 (penetrating oil); hard-wax oil varies widely</td>
                  <td>Soaks in for a matte, natural look; worn spots can be touched up without sanding the whole room</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            For coverage, the calculator uses about {FINISH_COVERAGE} sq ft per gallon per coat — the figure Sherwin-Williams gives for Minwax Ultimate Floor
            Finish — and the same for stain. The label on your can gives its own coverage and number of coats; change them in the DIY section if they
            differ.
          </p>

          <h2>DIY floor refinishing cost vs hiring a pro</h2>
          <p>
            Doing it yourself replaces most of the labour with rentals and materials. For a 300 sq ft room with a new stain colour, the DIY shopping list
            comes to about <strong>{$(diy300.total)}</strong> — inside This Old House’s $500–$1,000 DIY range — against roughly {$(pro300.total)} for a pro:
          </p>
          <ul>
            {diy300.lines.map((l) => (
              <li key={l.id}>
                {l.label} ({l.detail}): {$(l.amount)}
              </li>
            ))}
          </ul>
          <p>
            The savings are real, but so is the learning curve. A drum sander removes wood quickly; if it stops moving while the drum is down, it cuts a dip
            that only more sanding takes out. Practise in a closet, keep the machine moving with the grain, and use an edger along the walls. A recoat is a
            much safer first DIY job than a full sand.
          </p>

          <h2>Refinish or replace?</h2>
          <figure className={styles.figureBox}>
            <OptionBars
              bars={[
                { label: METHODS.recoat.label, amount: ex500.recoat.total, tone: 'recoat', sub: 'same colour' },
                { label: 'Full sand + stain', amount: ex500.sand.total, tone: 'sand', sub: 'new colour' },
                { label: 'Replace with new hardwood', amount: ex500.replace.total, tone: 'replace', sub: `${$(REPLACE.rate)}/sq ft installed` },
              ]}
              format={(v) => $(v)}
            />
            <figcaption>500 sq ft of oak: recoating, refinishing and replacing compared.</figcaption>
          </figure>
          <p>
            New hardwood costs {$r(REPLACE.low, REPLACE.high)} per sq ft installed (This Old House), so replacing 500 sq ft runs about{' '}
            {$(ex500.replace.total)} at the midpoint ({$(ex500.replace.low)}–{$(ex500.replace.high)}) against {$(ex500.sand.total)} to sand and stain, or{' '}
            {$(ex500.recoat.total)} to recoat. Refinish while the boards are flat and solid. Replace when they
            are cupped or buckled from water, soft or rotten, have been sanded so often that the tongues or nail heads show, or when you want a different
            floor altogether — the <Link href="/laminate-flooring-calculator/">laminate flooring calculator</Link> prices one alternative.
          </p>

          <h2>Engineered hardwood: how many times can you sand it?</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <BoardSection method="sand" engineered stained={false} idPrefix="pg-c" />
              <figcaption>Engineered boards have a hardwood wear layer on a plywood core — the wear layer is all that can ever be sanded.</figcaption>
            </figure>
            <div>
              <p>
                Solid hardwood can be sanded many times — up to about 12 according to This Old House — because there is wood all the way down to the
                tongue. Engineered boards only have a thin layer of real hardwood on top, and This Old House notes most can be refinished only once or twice.
              </p>
              <p>
                Before booking a full sand on an engineered floor, look at the edge of a board at a floor vent or threshold to see how thick the top layer
                is, or ask the manufacturer. If in doubt, a screen and recoat removes no wood at all.
              </p>
            </div>
          </div>

          <h2>Is my quote fair?</h2>
          <p>
            Turn every quote into a price per square foot and compare like with like. A quote of {$(quote.amount)} for {n(quote.area)} sq ft is{' '}
            {$(quote.amount / quote.area, 2)} per sq ft: within the range for a full sand with stain ({$(quoteRange.low)}–{$(quoteRange.high)}), but above
            the range for a natural-colour sand ({$(quoteRangeNoStain.low)}–{$(quoteRangeNoStain.high)}). When comparing quotes, check:
          </p>
          <ul>
            <li>the method (recoat or full sand) and how many coats of finish;</li>
            <li>whether stain, edging and corners are included;</li>
            <li>who moves the furniture and removes and refits the shoe moulding;</li>
            <li>how repairs and board replacements are charged;</li>
            <li>the minimum charge, and whether stairs are priced per step.</li>
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

          <HowWeCalculate slug="floor-refinishing-cost-calculator" />

          <h2>Related calculators</h2>
          <ul className={styles.related}>
            <li>
              <Link href="/square-footage-calculator/">
                Square Footage Calculator<span>Odd-shaped rooms</span>
              </Link>
            </li>
            <li>
              <Link href="/laminate-flooring-calculator/">
                Laminate Flooring Calculator<span>If you replace instead</span>
              </Link>
            </li>
            <li>
              <Link href="/paint-cost-calculator/">
                Paint Cost Calculator<span>Walls while the room is empty</span>
              </Link>
            </li>
            <li>
              <Link href="/bathroom-remodel-cost-calculator/">
                Bathroom Remodel Cost Calculator<span>Itemized remodel budget</span>
              </Link>
            </li>
            <li>
              <Link href="/board-and-batten-calculator/">
                Board &amp; Batten Calculator<span>Wall panelling</span>
              </Link>
            </li>
            <li>
              <Link href="/construction-estimate-template/">
                Construction Estimate Template<span>Write up the quote</span>
              </Link>
            </li>
          </ul>

          <p className={styles.note}>
            Disclaimer: results are planning estimates from national averages; your price depends on local labour, the condition of the floor and the
            products used. Get itemized quotes. See our <Link href="/disclaimer/">disclaimer</Link>.
          </p>
        </article>

        <div className={styles.adBlock}>
          <AdSlot slotId="floor-refinishing-cost-calculator-bottom" />
        </div>
      </main>
    </>
  );
}
