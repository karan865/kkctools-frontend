import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import EpoxyTableCalculator from '@/components/tool/epoxy-table-calculator';
import ToolShell from '@/components/tool/shared/ToolShell';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import styles from './page.module.css';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';

export const dynamic = 'force-static';

const route = ROUTES.epoxyTableCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const faqs = [
  {
    q: 'How much epoxy do I need for a river table?',
    a: 'River volume = length × average river width × depth. If you also flood-coat the whole top, add table length × width × coat thickness. Then add a waste allowance (10% by default). Example: a 48 × 6 × 1 in river plus a 1/8 in flood coat on a 48 × 24 in table is 432 in³; with 10% waste that is 475.2 in³ = 2.06 US gallons (7.79 liters) of mixed epoxy.',
  },
  {
    q: 'How do I measure an irregular river?',
    a: 'Live edges curve, so one width reading can be far off. Measure the river width at regular points along its whole length (for example every 6 to 12 inches), add the readings and divide by how many you took. Enter the readings and the calculator averages them for you.',
  },
  {
    q: 'How much extra epoxy should I add for waste and seepage?',
    a: 'The calculator starts with a 10% waste allowance; raise it if your past pours used more. If epoxy can creep under the slabs, enter an estimated gap in the seepage field, or clamp and seal the slabs to the mold so the gap is zero.',
  },
  {
    q: 'How deep can I pour epoxy in one layer?',
    a: 'Only your product’s technical data sheet can tell you. Coating resins are made for thin layers and deep-pour casting resins for thicker ones, and the limits differ between brands. Enter the maximum layer depth from the data sheet and the calculator plans the number of pours.',
  },
  {
    q: 'How much does an epoxy river table cost to make?',
    a: 'Add up your own prices: the slabs, the epoxy (use the calculator’s gallon total × your price per gallon), the mold materials and the finishing supplies. Prices vary so much by wood species, region and brand that we don’t publish an average.',
  },
  {
    q: 'How much epoxy for a coffee table vs a dining table?',
    a: 'It depends on the river size, so run your own dimensions. Two examples with a 1/8 in flood coat and 10% waste: a 48 × 24 in coffee table with a 6 in wide, 1 in deep river needs about 2.06 gallons; a 72 × 36 in dining table with an 8 in wide, 1.75 in deep river needs about 6.34 gallons (24.0 liters).',
  },
  {
    q: 'How much epoxy for a table-top flood coat?',
    a: 'Multiply the top area by the coat thickness. A 48 × 24 in top at 1/8 inch is 144 in³ = 0.62 US gallons (79.8 fl oz) before waste, or about 88 fl oz with 10% waste. Use the thickness your product label recommends.',
  },
  {
    q: 'Do I need a seal coat on the wood first?',
    a: 'Often, yes: raw wood and live edges release air as epoxy flows into the pores, which can leave bubbles in a clear pour. Many makers brush a thin seal coat first. Follow your resin maker’s instructions for whether to seal and how long to wait before the main pour.',
  },
  {
    q: 'What mold should I use, and how big?',
    a: 'Use a rigid, flat mold with a surface epoxy won’t stick to (for example a release-taped or waxed board, or a plastic sheet sold for epoxy molds), and seal the inside corners. Making the mold a little longer and wider than the finished top leaves room to trim the ends square; enter the mold size you actually build.',
  },
  {
    q: 'Deep-pour vs table-top epoxy: which one?',
    a: 'Many builders use a deep-pour casting resin for the thick river and a coating (table-top) resin for the thin flood coat, because each is formulated for that layer thickness. Check both products’ data sheets for layer limits, recoat windows and cure times.',
  },
  {
    q: 'How many liters or gallons is a river table?',
    a: 'There’s no typical figure: it depends on the river width, depth and whether you flood-coat the top. The two examples above come to about 7.8 liters and 24 liters. Enter your measurements for your table’s number.',
  },
  {
    q: 'What size epoxy table kit should I buy?',
    a: 'Compare the calculator’s total (with waste) with the kit sizes you can buy and round up, so you don’t run short mid-pour. Mixing a second batch partway through can be harder to match, especially with pigments.',
  },
];

export default function EpoxyTableCalculatorPage() {
  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'Tools', path: '/tools/' },
            { name: '3D Printing & CNC', path: '/tools/#engineering' },
            { name: 'Epoxy River Table Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>Epoxy River Table Calculator: Resin for the River, Pour and Top Coat</h1>
          <p className={styles.subtitle}>
            Accurate resin quantities for live-edge river tables, voids, and furniture tops. Calculate irregular river volume from multiple width readings, plan multi-layer pour schedules, and include top flood coats in one estimate.
          </p>

          <div className={styles.bluf}>
            <strong>Bottom Line Up Front (BLUF):</strong> For an epoxy resin table, multiply river length × average width × depth, then add the flood coat (table area × thickness) and about 10% waste. A 48 × 6 × 1 in river plus a 1/8 in top coat needs about 2.06 US gallons.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'River segments & width readings',
              'Pour planner',
              'Full build in one result',
              'Printable pour plan',
            ]}
          >
            <EpoxyTableCalculator />
          </ToolShell>
        </div>

        <AdSlot slotId="epoxy-table-ad-mid" format="horizontal" />

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>How to Use the Epoxy Table Calculator</h2>
            <p>
              Building an epoxy river table is one of woodworking&apos;s most rewarding projects, but resin is the single most expensive consumable. Running out of mixed resin midway through a pour ruins translucent color matching, while overbuying wastes money. Our calculator handles every phase of the build across three dedicated modes:
            </p>
            <ul>
              <li>
                <strong>River Channel Only:</strong> Perfect when you only plan to pour the central resin canyon and will finish the wood slabs with hardwax oil (such as Rubio Monocoat or Odie&apos;s Oil) rather than a resin flood coat.
              </li>
              <li>
                <strong>Flood Coat Only:</strong> For surfacing an existing wooden slab, bar top, or previously poured river table with a crystal-clear, self-leveling 1/8-inch protective glass coat.
              </li>
              <li>
                <strong>Full Build (River + Top Coat):</strong> Combines the deep river casting volume, under-slab seepage allowance, and the final all-over flood coat into one complete shopping list and pour plan.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How Much Epoxy for a River Table? The Formula</h2>
            <p>
              Calculating river table epoxy involves separating the physical geometry into distinct volume sections and summing them:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.contentTable}>
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Volume Formula</th>
                    <th>Example (48 × 24 in Table)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>River Channel</td>
                    <td>Length × Average Width × Slab Depth</td>
                    <td>48 in × 6 in × 1 in = <strong>288.0 in³</strong></td>
                  </tr>
                  <tr>
                    <td>Surface Flood Coat</td>
                    <td>Table Length × Table Width × Thickness</td>
                    <td>48 in × 24 in × 0.125 in = <strong>144.0 in³</strong></td>
                  </tr>
                  <tr>
                    <td>Combined Base Volume</td>
                    <td>River Volume + Flood Coat Volume</td>
                    <td>288.0 + 144.0 = <strong>432.0 in³</strong></td>
                  </tr>
                  <tr>
                    <td>Total with 10% Waste</td>
                    <td>Base Volume × 1.10</td>
                    <td>432.0 × 1.10 = <strong>475.2 in³ (2.057 US gal / 7.79 L)</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              To convert total cubic inches into purchase quantities:
              <br />
              <code>US Gallons = in³ ÷ 231.000</code>
              <br />
              <code>Liters = (in³ × 16.387064) ÷ 1,000</code>
            </p>
          </section>

          <section className={styles.section}>
            <h2>Measuring an Irregular River Correctly: Width Readings</h2>
            <p>
              The most common error woodworkers make is measuring the river width at only one narrow or wide spot. Live-edge timber naturally curves and flares. Taking only a single measurement can skew your resin calculation by 20% to 30%.
            </p>
            <p>
              <strong>The Multi-Reading Average Method:</strong>
            </p>
            <ol>
              <li>Lay your live edge slabs inside your leveled mold box in their final intended positions.</li>
              <li>Using a tape measure, measure the distance between the two live edges every 6 to 12 inches along the entire length of the table.</li>
              <li>Sum all width measurements and divide by the count of readings. For example, if you take 5 measurements along a 48-inch table: <code>5.5 in + 7.0 in + 6.2 in + 5.0 in + 6.8 in = 30.5 in ÷ 5 = 6.1 inches average width</code>.</li>
              <li>Input either your average width or click &ldquo;+ Enter multiple readings&rdquo; in the calculator to let our engine compute the exact arithmetic mean automatically.</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2>Epoxy for a Table Top: Calculating the Flood Coat</h2>
            <p>
              A table-top flood coat creates a seamless, high-gloss protective barrier that bonds the river and wood into a single monolithic surface. Many coating resins are made for a flood coat of about <strong>1/8 inch (0.125 in / 3.2 mm)</strong>; use the thickness on your product label.
            </p>
            <p>
              Self-leveling coating resins spread to an even layer, and pouring too thin can leave dry spots. If you let the flood coat run over the edges, raise the edge allowance in the calculator to cover the drips; your past projects are the best guide to how much.
            </p>
            <p>
              For general tabletop coatings without a river, you can also use our standalone <Link href="/epoxy-resin-calculator/">Epoxy Resin Calculator</Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>How Many Pours? Layer Depth and Exotherm Heat</h2>
            <p>
              Large volumes of curing epoxy generate substantial heat. In deep river channels, heat cannot escape quickly from the center of the pour. Pouring a coating resin much thicker than its label allows can overheat it, which can yellow, crack or bubble the pour.
            </p>
            <p>
              To cast thick rivers safely:
            </p>
            <ul>
              <li><strong>Use Dedicated Deep Pour Casting Resin:</strong> They cure more slowly, so heat builds up less; the data sheet gives the cure time.</li>
              <li><strong>Respect the Maximum Layer Depth:</strong> Always check your resin container&apos;s technical data sheet for its maximum single-layer pour depth (it varies a lot between products).</li>
              <li><strong>Follow the Pour Schedule:</strong> Our calculator automatically divides your total depth by your product&apos;s maximum allowable thickness. For instance, a 1.5-inch deep river with a 0.5-inch max layer requires 3 separate pours. Wait between pours as long as the data sheet says.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Live-Edge Slabs: Wood Sealing, Seepage and Mold Building</h2>
            <p>
              Successful river table fabrication requires careful slab preparation before a single drop of casting resin enters the mold:
            </p>
            <ul>
              <li><strong>Moisture Content:</strong> Use properly dried slabs; check them with a moisture meter and follow your wood supplier&apos;s and resin maker&apos;s guidance. Moisture coming out of the wood can cloud clear epoxy.</li>
              <li><strong>Bark Removal and Wire Brushing:</strong> All loose bark, cambium layer, and decayed punky wood must be chiseled and wire-brushed down to solid live timber. Epoxy will not adhere to decaying bark.</li>
              <li><strong>Edge Sealing:</strong> Brush a generous seal coat of mixed epoxy onto the live edges. Let it cure tacky to lock in trapped wood air before the main deep pour.</li>
              <li><strong>Under-Slab Seepage:</strong> Clamping hardwood slabs down to the mold base with silicone caulk prevents resin from creeping under the boards and raising your slabs. If a small gap exists, our calculator includes a seepage allowance field.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Building the Epoxy Table Mold Box</h2>
            <p>
              The mold form holds liquid epoxy in place until it solidifies. Build the mold base and walls from 3/4-inch white melamine board or high-density polyethylene (HDPE).
            </p>
            <p>
              <strong>Sizing the Mold:</strong> Construct the mold interior approximately <strong>1 inch longer and 1 inch wider</strong> than your finished table target. This extra perimeter allowance ensures that you can trim the table ends square with a track saw or router jig after demolding.
            </p>
            <p>
              <strong>Mold Release:</strong> Cover all melamine interior surfaces with polypropylene sheathing tape (Tuck tape). Seal every interior seam and screw hole with 100% pure silicone caulk. Apply two coats of paste wax or PVA mold release over the taped form.
            </p>
            <p>
              For project area and framing estimation, explore our <Link href="/square-footage-calculator/">Square Footage Calculator</Link> and <Link href="/board-and-batten-calculator/">Board and Batten Calculator</Link>. If pricing custom furniture for clients, use our <Link href="/construction-estimate-template/">Construction Estimate Template</Link>.
            </p>
          </section>

          <section className={styles.faqSection}>
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqGrid}>
              {faqs.map((faq, i) => (
                <div key={i} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{faq.q}</h3>
                  <p className={styles.faqAnswer}>{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        <HowWeCalculate slug="epoxy-table-calculator" />
      </div>

      <JsonLd data={buildWebApplicationSchema({ name: route.title, path: route.path, description: route.description })} />
      <JsonLd data={buildFaqSchema(faqs)} />
    </main>
  );
}
