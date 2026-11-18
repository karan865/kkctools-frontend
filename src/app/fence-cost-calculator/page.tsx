import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import FenceCostCalculator from '@/components/tool/fence-cost-calculator';
import ToolShell from '@/components/tool/shared/ToolShell';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import { FenceElevation, FencePlan } from '@/components/tool/fence-cost-calculator/FenceDiagram';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  BAG_80LB_FT3,
  GATE_PRICES,
  MATERIALS,
  MATERIALS_SHARE_PCT,
  REMOVAL_PER_FT,
  calculateFence,
  defaultFenceInput,
  holeDepthIn,
  holeDiameterIn,
  materialById,
  straightFence,
} from '@/lib/fence-cost-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.fenceCostCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

// ---------- every number below is computed by the same engine as the tool ----------
const n = (v: number, dp = 0) => v.toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: dp });
const $ = (v: number, dp = 0) => `$${n(v, dp)}`;

const table = MATERIALS.map((m) => ({ m, r100: straightFence(m.id, 100), r150: straightFence(m.id, 150), r200: straightFence(m.id, 200) }));
const row = (id: string) => table.find((t) => t.m.id === id)!;
const chain = row('chainLink');
const woodP = row('woodPrivacy');
const woodPk = row('woodPicket');
const vinylP = row('vinylPrivacy');
const vinylPk = row('vinylPicket');
const alu = row('aluminum');

const ex = calculateFence(defaultFenceInput()); // backyard: 50 + 60 + 50 ft, one walk gate, wood privacy
const exInput = defaultFenceInput();
const replace = calculateFence(defaultFenceInput('woodPrivacy', { removal: true }));
const exChain = calculateFence(defaultFenceInput('chainLink'));
const wp = materialById('woodPrivacy');
const holeD = holeDiameterIn(wp.postIn);
const holeH = holeDepthIn(wp.heightFt);
const perPostBags = woodP.r100.concretePerPostFt3 / BAG_80LB_FT3;
const chainPerPostBags = chain.r100.concretePerPostFt3 / BAG_80LB_FT3;
const G = GATE_PRICES;

// ---------- FAQ ----------
const faqs = [
  {
    q: 'How much does a fence cost per linear foot?',
    a: `Installed, about $${chain.m.range[0]}–$${chain.m.range[1]} per foot for chain link, $${woodPk.m.range[0]}–$${woodPk.m.range[1]} for wood and $${woodP.m.range[0]}–$${woodP.m.range[1]} for a wood privacy fence, $${vinylPk.m.range[0]}–$${vinylPk.m.range[1]} for vinyl and $${vinylP.m.range[0]}–$${vinylP.m.range[1]} for vinyl privacy (This Old House, 2026), and $${alu.m.range[0]}–$${alu.m.range[1]} for aluminium (HomeGuide, 2026). Gates, corners, removal and slopes add to that.`,
  },
  {
    q: 'How much does a 150-foot fence cost?',
    a: `At the midpoint prices, about ${$(chain.r150.total)} for 4 ft chain link, ${$(woodP.r150.total)} for a 6 ft wood privacy fence and ${$(vinylP.r150.total)} for 6 ft vinyl privacy — before gates, removal or a permit. The calculator adds those and shows a low–high range for each material.`,
  },
  {
    q: 'How much does a chain link (cyclone) fence cost?',
    a: `Chain link — also called cyclone fence — runs about $${chain.m.range[0]}–$${chain.m.range[1]} per foot installed, depending on height and wire gauge. A 100 ft run of 4 ft chain link is about ${$(chain.r100.total)} at $${chain.m.pricePerFt}/ft; a walk gate adds roughly $${G.chain.walkRange[0]}–$${G.chain.walkRange[1]}.`,
  },
  {
    q: 'How much does a privacy fence cost?',
    a: `A 6 ft wood privacy fence costs about $${woodP.m.range[0]}–$${woodP.m.range[1]} per foot and vinyl privacy about $${vinylP.m.range[0]}–$${vinylP.m.range[1]} (This Old House, 2026). For 150 ft that is about ${$(woodP.r150.total)} in wood or ${$(vinylP.r150.total)} in vinyl at the midpoints. Taller fences cost more per foot.`,
  },
  {
    q: 'How much does it cost to install a vinyl fence?',
    a: `Vinyl (PVC) picket fencing runs about $${vinylPk.m.range[0]}–$${vinylPk.m.range[1]} per foot installed and vinyl privacy $${vinylP.m.range[0]}–$${vinylP.m.range[1]}. Roughly half of that is labour, so a 100 ft vinyl privacy fence at ${$(vinylP.r100.total)} installed is about ${$(vinylP.r100.diyTotal)} in materials if you install it yourself.`,
  },
  {
    q: 'How much does it cost to replace a fence?',
    a: `Add removal to the new fence. Angi’s 2026 data puts tearing out and hauling away an old fence at about $3–$5 per linear foot. For a ${n(ex.totalLengthFt)} ft backyard in wood privacy that is ${$(replace.removalCost)} on top of ${$(ex.total)}, or ${$(replace.total)} in total.`,
  },
  {
    q: 'How many fence posts do I need?',
    a: `Divide each straight run by the post spacing, round up, and add one post. A 100 ft run with posts every 8 ft needs ${woodP.r100.posts} posts. Corners share a post, and each gate adds a post because it splits the run. The calculator counts all of this, including the extra terminal posts chain link needs.`,
  },
  {
    q: 'How much concrete do I need per fence post?',
    a: `A common rule (Quikrete) is a hole three times the post’s width and about a third of the fence height deep. A 4×4 post in a ${holeD} in × ${holeH} in hole takes about ${n(woodP.r100.concretePerPostFt3, 2)} cubic feet of concrete — ${n(perPostBags, 1)} bags of 80 lb mix, so buy 2 per post. A chain link line post needs about ${n(chainPerPostBags, 1)} bags.`,
  },
  {
    q: 'Which is cheapest: chain link, wood or vinyl?',
    a: `Chain link is the cheapest to install, then wood picket, vinyl picket and wood privacy, with vinyl privacy and aluminium at the top. At the midpoints, 100 ft costs about ${$(chain.r100.total)} in chain link, ${$(woodP.r100.total)} in wood privacy and ${$(vinylP.r100.total)} in vinyl privacy. Vinyl costs more up front but needs no staining.`,
  },
  {
    q: 'How much does a fence gate cost?',
    a: `Angi’s 2026 data puts a chain link walk gate at about $${G.chain.walkRange[0]}–$${G.chain.walkRange[1]} and a double gate at $${G.chain.doubleRange[0]}–$${G.chain.doubleRange[1]}. HomeGuide lists wood or vinyl garden gates at $${G.wood.walkRange[0]}–$${G.wood.walkRange[1]} and manual driveway gates at $${G.wood.doubleRange[0]}–$${n(G.wood.doubleRange[1])}. Automatic gates cost much more.`,
  },
  {
    q: 'Can I install a fence myself to save money?',
    a: `Yes — labour is about half the cost of a professional install (This Old House). A 150 ft wood privacy fence at ${$(woodP.r150.total)} installed is about ${$(woodP.r150.diyTotal)} in materials. It is heavy work: digging ${woodP.r150.posts} post holes and setting them plumb in ${woodP.r150.bags} bags of concrete.`,
  },
  {
    q: 'Do I need a permit to build a fence?',
    a: 'Often, yes — many cities and counties require a permit or set height limits and setbacks, and HOAs may need to approve the style. Check your property line, and call 811 a few days before you dig so buried utility lines are marked for free.',
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Fence Cost Calculator',
  path: route.path,
  description:
    'Free fence cost calculator for chain link, wood privacy, wood picket, vinyl and aluminium fences: layout with sides, corners and gates, posts, pickets, panels and fabric, concrete per post, removal, materials vs labour and DIY vs installed cost.',
});
const faqSchema = buildFaqSchema(faqs);

export default function FenceCostCalculatorPage() {
  return (
    <>
      <JsonLd data={[webAppSchema, faqSchema]} />
      <main id="main-content" className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
        <Breadcrumbs items={[{ name: 'Tools', path: '/tools/' }, { name: 'Fence Cost Calculator', path: route.path }]} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Fence Cost Calculator: Chain Link, Vinyl, Wood &amp; Privacy Fences</h1>
          <p className={styles.lead}>
            Price a new fence in a couple of minutes. This free <strong>fence cost calculator</strong> takes your fence line side by side — with corners
            and walk or drive gates — and works out the installed cost for chain link, wood privacy, wood picket, vinyl or aluminium, the{' '}
            <strong>fence price per linear foot</strong>, a low–high range, and what you would spend doing it yourself. It also gives a materials list
            (posts, rails, pickets, panels or fabric) and the bags of concrete for the posts.
          </p>
          <p className={styles.meta}>
            Last updated: {new Date(route.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} ·
            Prices are typical US ranges, checked November 2026 (enter your local price) · Runs in your browser — nothing you enter is sent anywhere.
          </p>
        </header>

        <section aria-label="Fence cost calculator tool">
          <ToolShell
            features={[
              'Wood, vinyl & chain link',
              'Posts, rails & pickets',
              'Gate width & hardware',
              'Post hole concrete bags',
            ]}
          >
            <FenceCostCalculator />
          </ToolShell>
        </section>

        <div className={styles.adBlock}>
          <AdSlot slotId="fence-cost-calculator-middle" />
        </div>

        <article className={styles.article}>
          <h2>How to use the fence cost calculator</h2>
          <ol>
            <li>
              <strong>Pick the fence type and height.</strong> The price per foot fills in from 2026 cost guides — change it to your quote.
            </li>
            <li>
              <strong>Add each side of the fence</strong> with its length and any walk or double gates. Tick “sides meet at corners” so corner posts are
              shared, or “closed loop” if the fence goes all the way round.
            </li>
            <li>
              <strong>Check the post spacing and gate prices</strong>, then add removal of an old fence, a slope surcharge or a permit if you need them.
            </li>
            <li>
              <strong>Read the total</strong>, the price per foot, the range, the DIY cost and the materials list. Copy it, print the list for the store or
              share a link.
            </li>
          </ol>

          <h2>Fence cost per linear foot by material</h2>
          <p>
            Installed prices from This Old House (June 2026) and HomeGuide (2026), with the calculator’s default at the midpoint of each range. Straight
            runs with no gates, at each style’s usual height:
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.note}>Fence cost by material and length (installed, US 2026)</caption>
              <thead>
                <tr>
                  <th scope="col">Fence</th>
                  <th scope="col">Height</th>
                  <th scope="col">Per foot</th>
                  <th scope="col">100 ft</th>
                  <th scope="col">150 ft</th>
                  <th scope="col">200 ft</th>
                  <th scope="col">DIY materials, 150 ft</th>
                </tr>
              </thead>
              <tbody>
                {table.map(({ m, r100, r150, r200 }) => (
                  <tr key={m.id}>
                    <td>{m.label}</td>
                    <td>{m.heightFt} ft</td>
                    <td>
                      ${m.range[0]}–${m.range[1]}
                    </td>
                    <td>{$(r100.total)}</td>
                    <td>
                      <strong>{$(r150.total)}</strong>
                    </td>
                    <td>{$(r200.total)}</td>
                    <td>{$(r150.diyTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Height, style and access change the price within each range. Use the range in the calculator’s results as a sanity check on quotes: a quote
            far above the high figure usually includes something extra — removal, a steep slope, rock, a long carry or premium materials.
          </p>

          <h2>Chain link (cyclone) fence cost</h2>
          <p>
            Chain link is the cheapest fence to install: about <strong>${chain.m.range[0]}–${chain.m.range[1]} per foot</strong>, depending on height and the
            gauge of the wire, with vinyl-coated fabric costing more than plain galvanised. A 100 ft run of 4 ft chain link comes to about{' '}
            {$(chain.r100.total)} at ${chain.m.pricePerFt}/ft. The same {n(ex.totalLengthFt)} ft backyard layout as below costs {$(exChain.total)} in chain
            link, and needs {exChain.posts} posts (
            {exChain.materials.find((x) => x.label.startsWith('Terminal'))?.qty} terminal posts at ends, corners and the gate),{' '}
            {exChain.materials.find((x) => x.label === 'Chain link fabric')?.note} of fabric and {exChain.materials.find((x) => x.label === 'Top rail')?.qty}{' '}
            lengths of top rail.
          </p>

          <h2>Wood privacy and picket fence cost</h2>
          <p>
            A 6 ft wood privacy fence runs about <strong>${woodP.m.range[0]}–${woodP.m.range[1]} per foot</strong> installed; a 4 ft picket fence $
            {woodPk.m.range[0]}–${woodPk.m.range[1]}. Cedar and board-on-board styles sit at the top of the range, pressure-treated pine at the bottom. For 150
            ft that is about {$(woodP.r150.total)} for privacy and {$(woodPk.r150.total)} for picket at the midpoints. Plan to stain or seal it — the{' '}
            <Link href="/fence-stain-calculator/">fence stain calculator</Link> works out the gallons.
          </p>

          <h2>Vinyl (PVC) fence cost</h2>
          <p>
            Vinyl picket fencing costs about ${vinylPk.m.range[0]}–${vinylPk.m.range[1]} per foot installed and a 6 ft vinyl privacy fence ${vinylP.m.range[0]}–$
            {vinylP.m.range[1]}. Panels usually come 6 or 8 ft wide, so the calculator counts panels from the post spacing: the example backyard needs{' '}
            {calculateFence(defaultFenceInput('vinylPrivacy')).materials.find((x) => x.label === 'Panels')?.qty} panels and costs{' '}
            {$(calculateFence(defaultFenceInput('vinylPrivacy')).total)} in vinyl privacy. Vinyl costs more than wood up front but never needs staining.
            Aluminium and ornamental metal fences run about ${alu.m.range[0]}–${alu.m.range[1]} per foot.
          </p>

          <h2>Gates, corners and posts — what they add</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <FencePlan
                runs={exInput.runs.map((r) => ({ ...r, label: `${r.lengthFt} ft` }))}
                connected
                closed={false}
                spacingFt={exInput.spacingFt}
                walkW={exInput.walkGateWidthFt}
                dblW={exInput.doubleGateWidthFt}
              />
              <figcaption>
                The example backyard: 50 + 60 + 50 ft with one walk gate — {ex.posts} posts, of which {ex.terminalPosts} are end, corner and gate posts.
              </figcaption>
            </figure>
            <div>
              <p>
                <strong>Posts:</strong> each straight run needs one post per section plus one. Corners share a post, so connecting the three sides saves{' '}
                {ex.sharedPosts}. Each gate splits a run and adds a post.
              </p>
              <p>
                <strong>Gates:</strong> a gate replaces its width of fence and adds its own price. Angi’s 2026 data puts chain link walk gates at $
                {G.chain.walkRange[0]}–${G.chain.walkRange[1]} and double gates at ${G.chain.doubleRange[0]}–${G.chain.doubleRange[1]}; HomeGuide lists wood and
                vinyl garden gates at ${G.wood.walkRange[0]}–${G.wood.walkRange[1]} and manual driveway gates at ${G.wood.doubleRange[0]}–$
                {n(G.wood.doubleRange[1])}.
              </p>
              <p>
                <strong>Example:</strong> the backyard in wood privacy is {n(ex.fenceLengthFt)} ft of fence × ${wp.pricePerFt}/ft = {$(ex.fenceCost)} plus a{' '}
                {$(ex.gatesCost)} gate = <strong>{$(ex.total)}</strong>, or {$(ex.perFt, 2)} per foot of fence line. It needs {ex.posts} posts,{' '}
                {ex.materials.find((x) => x.label === 'Rails')?.qty} rails, {ex.materials.find((x) => x.label === 'Pickets')?.qty} pickets and {ex.bags}{' '}
                bags of concrete.
              </p>
            </div>
          </div>

          <h2>How much concrete per fence post?</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <FenceElevation kind="pickets" picketGap={false} heightLabel="6 ft" spacingLabel="8 ft post spacing" holeLabel={`${holeD} in hole`} depthLabel={`${holeH} in deep`} patternId="page-chain" />
              <figcaption>Posts set in concrete: hole about 3 × the post width, about ⅓ of the fence height deep.</figcaption>
            </figure>
            <div>
              <p>
                Quikrete’s rule of thumb is a hole <strong>three times the width of the post</strong> and about a <strong>third of the height above
                  ground</strong> deep; the calculator uses at least 24 inches, and you should go below the frost line where the ground freezes.
              </p>
              <code className={styles.formula}>
                Concrete per post = (π × r² − post area) × depth
                <br />
                Bags = posts × concrete per post ÷ bag yield
              </code>
              <p>
                For a 4×4 post (3.5 in) in a {holeD} in × {holeH} in hole: about {n(woodP.r100.concretePerPostFt3, 2)} ft³, which is{' '}
                {n(perPostBags, 1)} bags of 80 lb mix (0.60 ft³ each) — <strong>buy 2 per post</strong>. Chain link line posts are thinner and need about{' '}
                {n(chainPerPostBags, 1)} bags each. For other hole sizes use the <Link href="/concrete-calculator/">concrete calculator</Link>’s post-hole
                mode.
              </p>
            </div>
          </div>

          <h2>Cost to replace a fence</h2>
          <p>
            Replacing a fence is the new fence plus taking the old one out. Angi’s 2026 data puts removal and haul-away at about $3–$5 per linear foot;
            the calculator defaults to ${REMOVAL_PER_FT}. For the {n(ex.totalLengthFt)} ft backyard that adds {$(replace.removalCost)}, bringing the wood
            privacy fence to <strong>{$(replace.total)}</strong>. Old posts set in concrete take longer to pull, and some contractors charge a disposal fee
            on top.
          </p>

          <h2>How to measure your fence line</h2>
          <ul>
            <li>Find your property corners first (a survey or plat shows them). Many people set a new fence a few inches inside the line.</li>
            <li>Measure each straight side separately, corner to corner, with a long tape or measuring wheel, and round up to the next foot.</li>
            <li>Mark where gates go and how wide: about 4 ft for a walk gate, 10–12 ft for a drive gate.</li>
            <li>
              Add the sides up with the <Link href="/linear-foot-calculator/">linear foot calculator</Link> if you have many short runs.
            </li>
          </ul>

          <h2>DIY vs professional installation</h2>
          <p>
            This Old House puts professional installation at about half the cost of a fence, and the calculator uses a {MATERIALS_SHARE_PCT}% materials share by
            default. On a 150 ft wood privacy fence that means about {$(woodP.r150.diyTotal)} in materials against {$(woodP.r150.total)} installed. DIY
            makes sense on flat, open ground with soft soil; hire a pro for slopes, rock, long runs, or vinyl and aluminium systems that need precise post
            placement.
          </p>

          <h2>Permits, HOA rules, 811 and property lines</h2>
          <ul>
            <li>Many towns limit fence height (often lower in front yards) and require a permit — check before you order.</li>
            <li>HOAs often control style, colour and which side faces out.</li>
            <li>Call 811 a few days before you dig so buried gas, power and water lines are marked — it is free.</li>
            <li>Talk to neighbours about the line and the good side; a shared fence can split the cost.</li>
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

          <HowWeCalculate slug="fence-cost-calculator" />

          <h2>Related calculators</h2>
          <ul className={styles.related}>
            <li>
              <Link href="/deck-cost-calculator/">
                Deck Cost Calculator<span>Lumber, footings and boards for new decks</span>
              </Link>
            </li>
            <li>
              <Link href="/fence-stain-calculator/">
                Fence Stain Calculator<span>Gallons to stain the new fence</span>
              </Link>
            </li>
            <li>
              <Link href="/concrete-calculator/">
                Concrete Calculator<span>Post holes, footings and bags</span>
              </Link>
            </li>
            <li>
              <Link href="/linear-foot-calculator/">
                Linear Foot Calculator<span>Add up the fence line</span>
              </Link>
            </li>
            <li>
              <Link href="/deck-stain-calculator/">
                Deck Stain Calculator<span>Stain for the deck next to it</span>
              </Link>
            </li>
            <li>
              <Link href="/concrete-slab-cost-calculator/">
                Concrete Slab Cost Calculator<span>Price a patio or pad</span>
              </Link>
            </li>
            <li>
              <Link href="/construction-estimate-template/">
                Construction Estimate Template<span>Turn it into a written quote</span>
              </Link>
            </li>
          </ul>

          <p className={styles.note}>
            Disclaimer: results are planning estimates based on 2026 US cost guides; local prices, materials, ground conditions and rules vary. Confirm
            property lines and permits, call 811 before digging, and get written quotes. See our <Link href="/disclaimer/">disclaimer</Link>.
          </p>
        </article>

        <div className={styles.adBlock}>
          <AdSlot slotId="fence-cost-calculator-bottom" />
        </div>
      </main>
    </>
  );
}
