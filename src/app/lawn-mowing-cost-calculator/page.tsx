import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import LawnMowingCalculator from '@/components/tool/lawn-mowing-calculator';
import { GrowthDiagram, MeasureDiagram, MowerPathDiagram } from '@/components/tool/lawn-mowing-calculator/LawnDiagram';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  MOWERS,
  SQFT_PER_ACRE,
  acresPerHour,
  calculateLawn,
  defaultInput,
  mowerById,
  priceRange,
  type LawnInput,
} from '@/lib/lawn-mowing-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.lawnMowingCostCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

// ---------- every number in the article comes from the same engine as the tool ----------
const usd = (v: number, dp = 0) => `$${v.toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: dp })}`;
const n = (v: number, dp = 0) => v.toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: dp });
const job = (sqft: number, over: Partial<LawnInput> = {}) => {
  const i = defaultInput(sqft, over);
  return { i, r: calculateLawn(i), range: priceRange(i) };
};

const QUARTER = SQFT_PER_ACRE / 4;
const HALF = SQFT_PER_ACRE / 2;

const sizeRows = [
  { label: '2,500 sq ft', sqft: 2500 },
  { label: '5,000 sq ft', sqft: 5000 },
  { label: '7,500 sq ft', sqft: 7500 },
  { label: '¼ acre (10,890 sq ft)', sqft: QUARTER },
  { label: '½ acre (21,780 sq ft)', sqft: HALF },
  { label: '1 acre (43,560 sq ft)', sqft: SQFT_PER_ACRE },
].map((row) => ({ ...row, ...job(row.sqft) }));

const acreRows = [0.5, 1, 2, 3, 5].map((ac) => ({ ac, ...job(ac * SQFT_PER_ACRE) }));

const freqRows = (['weekly', 'tenDays', 'biweekly', 'monthly', 'once'] as const).map((f) => ({ f, ...job(QUARTER, { frequency: f }) }));
const freqLabel: Record<string, string> = { weekly: 'Weekly', tenDays: 'Every 10 days', biweekly: 'Every 2 weeks', monthly: 'Monthly', once: 'One-time' };

const ex5k = job(5000);
const exQuarter = job(QUARTER);
const exHalf = job(HALF);
const exAcre = job(SQFT_PER_ACRE);
const exOvergrown = job(QUARTER, { frequency: 'once', grass: 'overgrown', extras: ['trim', 'edge', 'blow', 'bag'] });
const exHard = job(QUARTER, { slope: 'steep', obstacles: 'many' });
const exGate = job(QUARTER, { mower: mowerById('push21') });
const proJob = job(HALF, { mode: 'pro', hourlyRate: 60, travelMin: 15, costPerHour: 35 });
const pushRate = acresPerHour(mowerById('push21'));
const zt48Rate = acresPerHour(mowerById('zt48'));

// ---------- FAQ ----------
const faqs = [
  {
    q: 'How much does lawn mowing cost per visit?',
    a: `With this calculator's average settings (weekly, trimming, edging and blowing included, $50 an hour), a 5,000 sq ft lawn comes to about ${usd(ex5k.r.pricePerVisit)} a visit, a ¼-acre lawn about ${usd(exQuarter.r.pricePerVisit)} and a 1-acre lawn about ${usd(exAcre.r.pricePerVisit)}. In lower-cost areas expect less, in higher-cost areas more — the calculator shows the range for your lawn.`,
  },
  {
    q: 'How much does it cost to mow an acre?',
    a: `About ${usd(exAcre.r.pricePerVisit)} per weekly visit at an average rate (range ${usd(exAcre.range.low)}–${usd(exAcre.range.high)}), assuming a 48 in zero-turn mower on flat, open grass. Per acre gets cheaper on bigger properties: 5 acres works out to about ${usd(acreRows[4].r.pricePerAcre)} per acre.`,
  },
  {
    q: 'How much should I charge to mow a lawn?',
    a: 'Work out how long the job takes — mowing time from your mower’s width and speed, plus trimming, setup and drive time — and multiply by an hourly rate that covers your wages, fuel, equipment, insurance and profit. Set a minimum charge so small lawns still pay for the stop. Switch the calculator to “What should I charge?” to do this for any lawn.',
  },
  {
    q: 'How much does lawn mowing cost per square foot?',
    a: `For a typical yard it is about ${usd(exQuarter.r.pricePer1000, 2)} per 1,000 sq ft (¼ acre, weekly, average rate) — roughly ${usd(exQuarter.r.pricePer1000 / 1000, 4)} per sq ft. Small lawns cost more per square foot because the minimum charge, drive and setup time are the same whatever the size.`,
  },
  {
    q: 'Is bi-weekly mowing cheaper than weekly?',
    a: `Per season, yes; per visit, no. Grass is longer after two weeks, so each cut takes longer. For a ¼-acre lawn the calculator gives ${usd(freqRows[0].r.pricePerVisit)} a visit weekly (${usd(freqRows[0].r.pricePerSeason)} a season) versus ${usd(freqRows[2].r.pricePerVisit)} a visit every two weeks (${usd(freqRows[2].r.pricePerSeason)} a season).`,
  },
  {
    q: 'Do lawn services charge more for overgrown grass?',
    a: `Usually, yes. Tall grass is slower to cut and often needs bagging. The calculator adds 50% mowing time for overgrown grass; a one-time cut of an overgrown ¼-acre lawn with bagging comes to about ${usd(exOvergrown.r.pricePerVisit)} at the average rate.`,
  },
  {
    q: 'How much does lawn care cost per month?',
    a: `For weekly mowing over a 30-week season, a ¼-acre lawn averages about ${usd(exQuarter.r.pricePerMonth)} a month and a ½-acre lawn about ${usd(exHalf.r.pricePerMonth)}. That is mowing only — fertilizing, weed control and aeration are separate services.`,
  },
  {
    q: 'How long does it take to mow an acre?',
    a: `It depends on the mower. On flat, open grass a 21 in push mower covers about ${n(pushRate, 2)} acres an hour (over 2 hours per acre), while a 48 in zero-turn covers about ${n(zt48Rate, 1)} acres an hour (under 30 minutes). Slopes, obstacles and long grass slow every mower down.`,
  },
  {
    q: 'How do I measure my lawn size?',
    a: 'Split the lawn into rectangles, measure or pace the length and width of each, multiply, and add them up. Take away beds, patios or a pool inside those rectangles. The “Measure in rectangles” option in the calculator does the adding for you. Your lot size is not your lawn size — the house and driveway take a big share.',
  },
  {
    q: 'How accurate is this lawn mowing cost estimate?',
    a: 'It is a planning estimate. The time model is based on mower width and speed, and the hourly presets come from published 2026 industry ranges, but local prices, crew equipment and how your lawn is laid out all change the real quote. Treat the range as a guide and compare two or three local quotes.',
  },
  {
    q: 'Is it cheaper to mow my own lawn?',
    a: 'In cash, usually yes — you pay for the mower, fuel, upkeep and your own time instead of a service. Whether it is worth it depends on how much your time is worth to you, the size of the lawn and whether you already own a mower.',
  },
  {
    q: 'Should I tip my lawn mowing crew?',
    a: 'Tipping is optional and varies by area. Many people tip at the end of the season or the holidays rather than at every visit. The calculator does not include tips.',
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Lawn Mowing Cost Calculator',
  path: route.path,
  description:
    'Free lawn mowing cost calculator. Estimate the price per visit, per month and per season from lawn size, frequency, grass condition and extras — as a homeowner, or as a lawn-care pro working out what to charge.',
});
const faqSchema = buildFaqSchema(faqs);

export default function LawnMowingCostCalculatorPage() {
  return (
    <>
      <JsonLd data={[webAppSchema, faqSchema]} />
      <main id="main-content" className={styles.main}>
        <Breadcrumbs items={[{ name: 'Tools', path: '/tools/' }, { name: 'Lawn Mowing Cost Calculator', path: route.path }]} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Lawn Mowing Cost Calculator</h1>
          <p className={styles.lead}>
            This free <strong>lawn mowing cost calculator</strong> estimates what mowing costs per visit, per month and per season from your
            lawn size, how often it is cut, its condition and the extras you want. Homeowners can see a fair price range before asking for
            quotes; lawn-care pros can switch to <em>What should I charge?</em> and price a job from their own mower, hourly target and drive
            time. Every rate is shown and can be changed — no sign-up.
          </p>
          <p className={styles.meta}>
            Last updated: {new Date(route.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} ·
            Runs in your browser — nothing you enter is sent anywhere.
          </p>
        </header>

        <section aria-label="Lawn mowing cost calculator tool">
          <LawnMowingCalculator />
        </section>

        <div className={styles.adBlock}>
          <AdSlot slotId="lawn-mowing-cost-calculator-middle" />
        </div>

        <article className={styles.article}>
          <h2>How to use the lawn mowing cost calculator</h2>
          <div className={styles.figGrid}>
            <div>
              <h3>If you are hiring a service</h3>
              <ol>
                <li>
                  Keep <strong>What will I pay?</strong> selected.
                </li>
                <li>Enter your lawn area, pick a common size, or add up rectangles.</li>
                <li>Choose how often you want it cut and how long your mowing season is.</li>
                <li>Set the lawn’s condition and extras, then pick your area’s price level.</li>
              </ol>
            </div>
            <div>
              <h3>If you run a lawn-care business</h3>
              <ol>
                <li>
                  Switch to <strong>What should I charge?</strong>
                </li>
                <li>Enter the lawn and choose the mower you will use.</li>
                <li>Set your hourly target, minimum charge and drive time to the job.</li>
                <li>Add your cost per hour to see profit per visit and per season.</li>
              </ol>
            </div>
          </div>

          <h2>How lawn mowing prices are worked out</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <MowerPathDiagram deckLabel="deck width" rateLabel={`48 in zero-turn ≈ ${n(zt48Rate, 2)} acres/hour`} />
              <figcaption>Each pass cuts one deck width; turns and overlap are not new grass, so real speed is lower than the top speed.</figcaption>
            </figure>
            <div>
              <p>
                Lawn-care companies mostly price by <strong>time</strong>. How long a lawn takes depends on its size and the mower: a wider
                deck cuts more grass per pass, and a riding mower moves faster than a person pushing one. The calculator turns that into acres
                per hour, then adds the time for trimming, edging, blowing, unloading and driving to the job.
              </p>
              <code className={styles.formula}>
                Minutes = mowing + extras + setup + drive
                <br />
                Price per visit = minutes ÷ 60 × hourly rate (at least the minimum)
                <br />
                Season cost = price per visit × visits
              </code>
              <p>
                Because setup and drive time are the same on every stop, small lawns cost more per square foot than big ones. That is also why
                most services have a <strong>minimum charge</strong>.
              </p>
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Mower</th>
                  <th scope="col">Cutting width</th>
                  <th scope="col">Acres per hour*</th>
                  <th scope="col">Minutes per acre</th>
                </tr>
              </thead>
              <tbody>
                {MOWERS.map((m) => {
                  const aph = acresPerHour(m);
                  return (
                    <tr key={m.id}>
                      <td>{m.label}</td>
                      <td>{m.deckIn} in</td>
                      <td>{n(aph, 2)}</td>
                      <td>{n(60 / aph)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className={styles.note}>
            *Flat, open grass at {MOWERS.map((m) => `${m.mph} mph`).join(' / ')} with 75–80% of the time spent cutting new grass. These are
            working assumptions, not published standards — change the mower in the calculator to match yours.
          </p>

          <h2>Lawn mowing cost by lawn size</h2>
          <p>
            Weekly mowing with trimming, edging and blowing, 30-week season, flat open lawn. “Typical” uses $50 an hour; the range runs from a
            lower-cost area ($32/h) to a higher-cost area ($68/h), all with a $35 minimum.
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Lawn size</th>
                  <th scope="col">Mower</th>
                  <th scope="col">Time per visit</th>
                  <th scope="col">Per visit (range)</th>
                  <th scope="col">Typical per visit</th>
                  <th scope="col">Per season</th>
                </tr>
              </thead>
              <tbody>
                {sizeRows.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td>{mowerById(MOWERS.find((m) => m.deckIn === row.i.mower.deckIn)?.id || 'push21').label}</td>
                    <td>{n(row.r.totalMin)} min</td>
                    <td>
                      {usd(row.range.low)}–{usd(row.range.high)}
                    </td>
                    <td>
                      <strong>{usd(row.r.pricePerVisit)}</strong>
                    </td>
                    <td>{usd(row.r.pricePerSeason)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.callout}>
            <strong>Check the season maths:</strong> a weekly lawn over 30 weeks has 30 visits, so {usd(ex5k.r.pricePerVisit)} a visit is{' '}
            {usd(ex5k.r.pricePerSeason)} a season — not less. Some online calculators show a season total smaller than per-visit × visits;
            this one always multiplies.
          </p>

          <h2>Lawn mowing cost per acre</h2>
          <p>
            Larger properties are usually cut with wider zero-turn mowers, and the fixed drive and setup time is spread over more grass, so the
            price per acre drops as the property grows.
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Property</th>
                  <th scope="col">Time per visit</th>
                  <th scope="col">Typical per visit</th>
                  <th scope="col">Per acre</th>
                  <th scope="col">Range per visit</th>
                </tr>
              </thead>
              <tbody>
                {acreRows.map((row) => (
                  <tr key={row.ac}>
                    <td>
                      {row.ac} acre{row.ac === 1 ? '' : 's'}
                    </td>
                    <td>{n(row.r.totalMin)} min</td>
                    <td>
                      <strong>{usd(row.r.pricePerVisit)}</strong>
                    </td>
                    <td>{usd(row.r.pricePerAcre)}</td>
                    <td>
                      {usd(row.range.low)}–{usd(row.range.high)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Weekly vs every two weeks vs one-time</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <GrowthDiagram />
              <figcaption>Longer gaps mean taller grass, and taller grass takes longer to cut.</figcaption>
            </figure>
            <div>
              <p>
                A longer gap between cuts means fewer visits, but each visit takes longer and can need bagging. That is why many services charge{' '}
                <strong>more per visit</strong> for every-two-weeks mowing than for weekly — the opposite of a discount. Over a season,
                bi-weekly is still cheaper because there are half as many visits.
              </p>
              <p>Lawn grows fastest in spring. Many lawns need weekly cuts then, and every 10–14 days in a hot, dry summer.</p>
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">¼-acre lawn</th>
                  <th scope="col">Visits (30 weeks)</th>
                  <th scope="col">Per visit</th>
                  <th scope="col">Per season</th>
                </tr>
              </thead>
              <tbody>
                {freqRows.map((row) => (
                  <tr key={row.f}>
                    <td>{freqLabel[row.f]}</td>
                    <td>{row.r.visits}</td>
                    <td>{usd(row.r.pricePerVisit)}</td>
                    <td>
                      <strong>{usd(row.r.pricePerSeason)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>What raises the price</h2>
          <ul>
            <li>
              <strong>Overgrown grass.</strong> Tall grass is slow to cut and often has to be bagged. A one-time cut of an overgrown ¼-acre lawn
              with bagging comes to about {usd(exOvergrown.r.pricePerVisit)}, against {usd(exQuarter.r.pricePerVisit)} for a regular weekly cut.
            </li>
            <li>
              <strong>Slopes and obstacles.</strong> Hills, flower beds, trees and play equipment all mean slower passes and more trimming. A
              steep ¼-acre lawn with many obstacles: about {usd(exHard.r.pricePerVisit)} a visit.
            </li>
            <li>
              <strong>Narrow gates.</strong> If a riding or walk-behind mower cannot get into the back yard, the crew has to use a push mower:
              about {usd(exGate.r.pricePerVisit)} instead of {usd(exQuarter.r.pricePerVisit)} for the same ¼ acre.
            </li>
            <li>
              <strong>Extras.</strong> Bagging and hauling clippings adds about a quarter to the mowing time. Leaf removal, fertilizing and
              aeration are usually priced as separate jobs.
            </li>
            <li>
              <strong>Where you live.</strong> Labor and fuel costs vary a lot between regions — that is the biggest reason quotes differ.
            </li>
          </ul>

          <h2>How much to charge for cutting grass</h2>
          <p>
            If you mow for a living, price every lawn from time, not a guess. Start with a target hourly rate that pays you, your equipment,
            fuel, insurance and a profit. Then:
          </p>
          <ol>
            <li>Measure the lawn and pick the mower you will use. Width and speed give acres per hour.</li>
            <li>Add time for trimming, edging and blowing, plus unloading and walking the lawn.</li>
            <li>Add your drive time — it is part of every stop, even if you never show it as a line item.</li>
            <li>Multiply by your hourly rate and round up to your minimum charge.</li>
          </ol>
          <div className={styles.examples}>
            <div className={styles.exampleCard}>
              <h3>Worked example: ½-acre lawn</h3>
              <p className={styles.exampleMeta}>48 in zero-turn · $60/h target · 15 min drive · $35/h costs</p>
              <ul>
                <li>Mowing: {n(proJob.r.mowMin)} min</li>
                <li>Trim, edge, blow: {n(proJob.r.extrasMin)} min</li>
                <li>
                  Setup + drive: {n(proJob.r.setupMin + proJob.r.travelMin)} min → total {n(proJob.r.totalMin)} min
                </li>
                <li>
                  Charge: <strong>{usd(proJob.r.pricePerVisit)}</strong> a visit ({usd(proJob.r.pricePerSeason)} for 30 weekly visits)
                </li>
                <li>Profit after $35/h costs: {usd(proJob.r.profitPerVisit ?? 0)} a visit</li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>Set a minimum charge</h3>
              <p className={styles.exampleMeta}>Why tiny lawns still cost real money</p>
              <ul>
                <li>A 2,500 sq ft lawn takes only a few minutes to mow,</li>
                <li>but drive and setup still take {n(sizeRows[0].r.setupMin + sizeRows[0].r.travelMin)} min.</li>
                <li>
                  At $50/h that is less than the stop is worth, so the {usd(35)} minimum applies — {usd(sizeRows[0].r.pricePerVisit)} a visit.
                </li>
              </ul>
            </div>
          </div>
          <p>
            Published 2026 guides from lawn-care software makers put typical rates at roughly $30–$68 per hour. Check what local companies charge
            before you set yours, and review your prices each season as fuel and wages change.
          </p>

          <h2>Mowing it yourself vs hiring a service</h2>
          <p>
            Doing it yourself swaps a service bill for the cost of a mower, a trimmer, fuel, blades and repairs — plus your time. For a small,
            flat lawn and an existing mower, DIY is usually cheaper. For a large or hilly lawn, or a busy schedule, a service can be worth it. A
            simple test: take the season cost from the calculator and compare it with what you would spend on equipment over its life, then
            decide what your time is worth.
          </p>

          <h2>How to measure your lawn</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <MeasureDiagram />
              <figcaption>Break the lawn into rectangles. Leave out the house, driveway, patio and beds.</figcaption>
            </figure>
            <div>
              <p>You do not need an app. A tape measure or a steady pace (about 2½–3 ft per step for most adults) is enough:</p>
              <ol>
                <li>Sketch the yard and split the grass into rectangles: front, back, sides.</li>
                <li>Measure the length and width of each and multiply.</li>
                <li>Add the rectangles; subtract any beds, pools or patios inside them.</li>
              </ol>
              <p>
                1 acre is 43,560 sq ft (about 4,047 m²). A “quarter-acre lot” is about 10,890 sq ft of land, but the lawn is often only half of
                that once the house and driveway are taken out. Use the <em>Measure in rectangles</em> option, or our{' '}
                <Link href="/square-footage-calculator/">Square Footage Calculator</Link> for odd shapes.
              </p>
            </div>
          </div>

          <h2>Average lawn mowing cost: the short version</h2>
          <p>
            Using this calculator’s average settings, a weekly cut of a 5,000 sq ft lawn is about {usd(ex5k.r.pricePerVisit)}, a ¼-acre lawn
            about {usd(exQuarter.r.pricePerVisit)}, a ½-acre lawn about {usd(exHalf.r.pricePerVisit)} and a full acre about{' '}
            {usd(exAcre.r.pricePerVisit)}. These sit inside the per-visit ranges published by lawn-care industry guides in 2026, but your real
            price depends on your area — so use them to sanity-check quotes, not replace them.
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

          <HowWeCalculate slug="lawn-mowing-cost-calculator" />

          <h2>Related calculators</h2>
          <ul className={styles.related}>
            <li>
              <Link href="/square-footage-calculator/">
                Square Footage Calculator<span>Measure odd-shaped lawns and yards</span>
              </Link>
            </li>
            <li>
              <Link href="/compost-calculator/">
                Compost Calculator<span>Top-dress the lawn after aeration</span>
              </Link>
            </li>
            <li>
              <Link href="/fill-dirt-calculator/">
                Fill Dirt &amp; Topsoil Calculator<span>Level low spots before seeding</span>
              </Link>
            </li>
            <li>
              <Link href="/sand-calculator/">
                Sand Calculator<span>Sand for top-dressing and leveling</span>
              </Link>
            </li>
            <li>
              <Link href="/paver-base-calculator/">
                Paver Base Calculator<span>Patios and paths that cut mowing area</span>
              </Link>
            </li>
            <li>
              <Link href="/fence-stain-calculator/">
                Fence Stain Calculator<span>Gallons for the fence around the yard</span>
              </Link>
            </li>
          </ul>

          <p className={styles.note}>
            Results are planning estimates, not quotes. Prices vary by area, crew, equipment and the lawn itself. Mower speeds and condition
            factors are working assumptions you can change; hourly presets come from the sources listed above.
          </p>
        </article>

        <div className={styles.adBlock}>
          <AdSlot slotId="lawn-mowing-cost-calculator-bottom" />
        </div>
      </main>
    </>
  );
}
