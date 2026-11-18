import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import CarpetCostCalculator from '@/components/tool/carpet-cost-calculator';
import ToolShell from '@/components/tool/shared/ToolShell';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  generateRoomBenchmarks,
  CARPET_FIBRES,
} from '@/lib/carpet-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.carpetCostCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const benchmarks = generateRoomBenchmarks();

const faqs = [
  {
    q: 'How much does carpet cost per square foot installed?',
    a: `On average, new carpet costs $3.50 to $9.50 per square foot installed ($31.50 to $85.50 per square yard). This typical total includes $2.00 to $5.50 for the carpet material, $0.75 to $1.50 for high-density underlayment padding, and $0.75 to $2.50 for professional installation labour. Luxury wool or designer cut-and-loop styles can range from $10.00 to $20.00+ per square foot.`,
  },
  {
    q: 'How much does carpet replacement cost, including removal?',
    a: `Carpet replacement usually costs between $4.15 and $10.50 per square foot. In addition to new carpet and pad, replacement adds $0.25 to $0.60 per square foot for ripping out old carpet and pad, plus $0.15 to $0.40 per square foot for dumpster haul-away and disposal fees. For an average 1,000 sq ft home, replacement costs approximately $4,500 to $8,500 total.`,
  },
  {
    q: 'How much does it cost to carpet a 12×12 room?',
    a: `Carpeting a standard 12×12 bedroom (144 net square feet) typically costs between $650 and $1,350 installed, with an average midpoint around $950 for mid-grade nylon. Because carpet is sold in 12-foot-wide rolls, a 12×12 room requires roughly 150 square feet of purchased broadloom to account for 6 inches of perimeter cut-and-tuck allowance.`,
  },
  {
    q: 'How much does it cost to carpet stairs?',
    a: `Carpeting a standard flight of 13 stairs typically costs $250 to $650, or roughly $15 to $45 per step for carpet, padding, and labour combined. Simple waterfall installation (where carpet cascades over treads and risers) costs about $5 to $12 per step in labour, while tailored box / cap-and-band stairs cost $10 to $25 per step due to hand wrapping around spindles.`,
  },
  {
    q: 'How much carpet do I need for my room, and why do I need extra?',
    a: `You will almost always purchase 10% to 20% more square footage than your room's actual net floor area. Broadloom carpet comes in fixed roll widths (most commonly 12 feet, occasionally 13'6" or 15'). If your room is 14×16 feet, installers must cut two separate 12-foot strips and seam them together, paying for the unused roll remnants. Extra allowance is also required for trimming and pattern matching.`,
  },
  {
    q: 'What is the difference between price per square yard and per square foot?',
    a: `One square yard equals exactly 9 square feet (3 ft × 3 ft). Carpet retailers and commercial suppliers frequently quote prices per square yard, while residential installers and big-box stores quote per square foot. To convert, multiply a square foot price by 9 to get the square yard rate, or divide a square yard price by 9 (for example, $4.00/sq ft equals $36.00/sq yd).`,
  },
  {
    q: 'How much does carpet padding cost, and which pad should I choose?',
    a: `Carpet padding costs between $0.60 and $1.50 per square foot ($5.40 to $13.50 per square yard). For residential homes, an 8-pound density rebond foam cushion with a thickness of 7/16-inch is recommended by major manufacturers (such as Shaw and Mohawk). Going thicker than 1/2-inch or using soft 4-pound foam can void manufacturer wear warranties and cause carpet wrinkling.`,
  },
  {
    q: 'Is Berber carpet cheaper than plush carpet?',
    a: `Yes, Berber loop carpet is often 15% to 30% less expensive than plush or textured cut pile. Entry-level olefin (polypropylene) Berber costs around $1.50 to $3.00 per square foot for material, making it one of the most economical floor coverings. However, premium wool Berber is significantly more expensive, running $6.00 to $18.00+ per square foot.`,
  },
  {
    q: 'How much do carpet removal and disposal cost?',
    a: `Professional tear-out and removal costs $0.25 to $0.60 per square foot, and landfill disposal or dumpster haul-away adds another $0.15 to $0.40 per square foot. For a typical 500 sq ft project, expect removal and disposal to add $200 to $500 to your contractor invoice. DIY removal with a utility knife and pry bar is one of the easiest ways to save money on a flooring project.`,
  },
  {
    q: 'How much does carpet tile installation cost?',
    a: `Modular carpet tiles cost $2.00 to $5.00 per square foot for materials and $1.00 to $2.00 per square foot for installation labour. Unlike broadloom carpet rolls, carpet tiles produce only about 5% cutting waste, require no heavy roll power-stretching, and have attached backing cushions that eliminate separate underlayment costs. Damaged tiles can also be individually replaced without re-carpeting the entire room.`,
  },
  {
    q: 'Is carpet cheaper than luxury vinyl plank (LVP) or laminate flooring?',
    a: `Mid-grade carpet ($3.50 to $9.50/sq ft installed) is comparable to laminate ($3.50 to $8.00/sq ft) and slightly cheaper than luxury vinyl plank ($4.50 to $10.00/sq ft). While carpet has a lower initial entry price in builder-grade options, vinyl and laminate last 15 to 25 years with waterproof protection, whereas residential carpet typically requires replacement after 8 to 12 years.`,
  },
  {
    q: 'Can carpet be repaired instead of replaced?',
    a: `Yes. Minor issues such as small burns, pet tears, or permanent stains can often be fixed with a bonded carpet insert (patch) for $150 to $300 using leftover remnants from the original install. Loose wrinkles and ripples can be corrected with a power stretcher for $100 to $250. However, if the padding has degraded or the pile is heavily crushed across walkways, full replacement is more cost-effective.`,
  },
];

export default function CarpetCostCalculatorPage() {
  const breadcrumbItems = [
    { name: 'Tools', path: '/tools/' },
    { name: 'Carpet Cost Calculator', path: route.path },
  ];

  const webAppSchema = buildWebApplicationSchema({
    name: 'Carpet Cost Calculator',
    description: route.description,
    path: route.path,
    applicationCategory: 'HomeImprovementApplication',
  });

  const faqSchema = buildFaqSchema(faqs);

  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <JsonLd data={webAppSchema} />
      <JsonLd data={faqSchema} />

      <Breadcrumbs items={breadcrumbItems} />

      <header className={styles.header}>
        <h1 className={styles.h1}>Carpet Cost Calculator</h1>
        <p className={styles.lead}>
          Estimate carpet installation and replacement costs by room dimensions: broadloom roll layout,
          seam calculation, padding options, stair runners, and old-carpet tear-out fees.
        </p>
        <div className={styles.meta}>
          Updated November 2026 · Based on BLS wage data, CRI 105 installation standards, and national supplier pricing
        </div>
      </header>

      {/* BLUF Direct Answer Box */}
      <div className={styles.blufBox}>
        <strong>Quick Answer:</strong> New carpet typically costs <strong>$3.50 to $9.50 per square foot installed</strong> ($31.50 to $85.50 per square yard), including quality carpet material, 8-lb underlayment cushion, and professional trade installation. For a standard 10×12 bedroom, expect an installed total of <strong>$420 to $1,140</strong>. Because carpet is manufactured in fixed 12-foot rolls, you purchase cut rectangle overage (typically 10%–20% above net floor area) rather than exact floor measurements.
      </div>

      {/* Interactive Tool Section */}
      <section className={styles.toolSection} id="calculator">
        <ToolShell
          features={[
            'Room takeoff & stairs',
            'Cushion pad & waste',
            'Tear-out & installation',
            'Material grade tiers',
          ]}
        >
          <CarpetCostCalculator />
        </ToolShell>
      </section>

      <AdSlot slotId="carpet-cost-top" />

      {/* Long-Form In-Depth Content */}
      <article className={styles.article}>
        <h2 className={styles.h2}>How to Use This Carpet Cost Calculator</h2>
        <p className={styles.p}>
          Estimating carpet requires more than simply multiplying room length by width. Broadloom carpet is manufactured in continuous 12-foot rolls (and occasionally 13&apos;6&quot; or 15&apos;), meaning room cuts leave off-cuts and require planned heat-tape seams. This tool calculates both net room area and actual roll purchase requirements in five simple steps:
        </p>
        <ol className={styles.stepsList}>
          <li><strong>Select Project Type:</strong> Choose between &quot;Replace Carpet&quot; (which automatically enables old carpet tear-out and haul-away disposal) or &quot;New Carpet&quot; for bare subfloors.</li>
          <li><strong>Enter Room Dimensions:</strong> Add your bedrooms, living areas, closets, and hallways. You can enter length and width in feet or fractional dimensions.</li>
          <li><strong>Add Flight of Stairs:</strong> Toggle the stairs module if you have steps. Specify step count and choose between a straight waterfall runner or a custom hand-tailored box style.</li>
          <li><strong>Select Carpet Grade &amp; Cushion:</strong> Choose builder-grade, mid-grade, or luxury carpet, along with your preferred padding density (6-lb, 8-lb, or 10-lb).</li>
          <li><strong>Review the Takeoff Breakdown:</strong> Inspect your total installed budget, itemized line items, roll strip layout diagram, and quote verification check.</li>
        </ol>

        <h2 className={styles.h2}>Carpet Cost per Square Foot and Square Yard</h2>
        <p className={styles.p}>
          Carpet installation costs are divided into three core categories: carpet material, cushion padding, and labour. Because some carpet stores quote by the square foot while others quote by the square yard, understanding the conversion factor (<strong>1 square yard = 9 square feet</strong>) prevents sticker shock.
        </p>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Quality Tier</th>
                <th>Carpet Material</th>
                <th>Underlayment Pad</th>
                <th>Installation Labour</th>
                <th>Total Installed / sq ft</th>
                <th>Total Installed / sq yd</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Builder / Budget</strong>
                  <div className={styles.meta}>Polyester / Olefin loop</div>
                </td>
                <td>$1.00 – $2.50</td>
                <td>$0.50 – $0.75</td>
                <td>$0.75 – $1.50</td>
                <td><strong>$2.25 – $4.75</strong></td>
                <td>$20.25 – $42.75</td>
              </tr>
              <tr>
                <td>
                  <strong>Mid-Grade (Popular)</strong>
                  <div className={styles.meta}>Nylon / Triexta textured twist</div>
                </td>
                <td>$2.50 – $5.50</td>
                <td>$0.75 – $1.25</td>
                <td>$1.25 – $2.00</td>
                <td><strong>$4.50 – $8.75</strong></td>
                <td>$40.50 – $78.75</td>
              </tr>
              <tr>
                <td>
                  <strong>Premium / Luxury</strong>
                  <div className={styles.meta}>High-twist nylon / Wool blend</div>
                </td>
                <td>$5.50 – $12.00+</td>
                <td>$1.00 – $1.75</td>
                <td>$1.75 – $3.00</td>
                <td><strong>$8.25 – $16.75+</strong></td>
                <td>$74.25 – $150.75+</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className={styles.h2}>How Much Does It Cost to Carpet a Room?</h2>
        <p className={styles.p}>
          Room dimensions directly determine carpet yardage, roll seams, and cut waste. The benchmark table below reflects average installed costs (mid-grade nylon, 8-lb pad, installation, and removal of existing carpet) across standard residential room sizes:
        </p>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Room Type &amp; Dimensions</th>
                <th>Net Area (sq ft)</th>
                <th>Square Yards</th>
                <th>Budget Range</th>
                <th>Typical Average</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((row, i) => (
                <tr key={i}>
                  <td>
                    <strong>{row.roomLabel}</strong>
                    <div className={styles.meta}>{row.dimensions}</div>
                  </td>
                  <td>{row.netSqFt} sq ft</td>
                  <td>{row.sqYd} sq yd</td>
                  <td>${row.lowCost.toLocaleString()} – ${row.highCost.toLocaleString()}</td>
                  <td style={{ fontWeight: 700, color: 'var(--ink)' }}>
                    ${row.typicalCost.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className={styles.h2}>Why You Buy More Carpet Than Your Room Measures</h2>
        <p className={styles.p}>
          Homeowners frequently calculate their room area (for example, 14 ft × 16 ft = 224 sq ft) and expect to pay for exactly 224 square feet. In reality, you will almost always buy <strong>10% to 25% extra carpet</strong>. Here is why:
        </p>
        <div className={styles.callout}>
          <h4>The 12-Foot Roll Constraint Explained</h4>
          <p>
            Unlike tiles or laminate planks that assemble from small cartons, broadloom carpet is manufactured in massive continuous rolls, standardly 12 feet wide. If your room is 14 feet wide and 16 feet long, a single 12-foot pass leaves a 2-foot strip uncovered. The installer must run a second 12-foot drop along the length of the room, cutting a 2-foot piece to fill the gap. Because carpet cannot be bought in piecemeal fragments, you must purchase the entire 12-foot width for that cut, leaving a 10-foot by 16-foot remnant off-cut.
          </p>
        </div>
        <p className={styles.p}>
          Additionally, carpet pile has a distinct natural grain and lay direction. All drops within a room (and between adjacent hallways) must run in the exact same pile direction. Rotating an off-cut sideways creates an optical shade difference that looks like two completely different carpets were installed. Our calculator tests both room orientations to automatically identify the cut path that minimizes purchased yardage.
        </p>

        <h2 className={styles.h2}>Carpet Replacement Cost: Tear-Out, Disposal and Prep</h2>
        <p className={styles.p}>
          When replacing existing carpet, your contractor quote will include several preparatory line items. In the trade, these are billed separately from new installation labour:
        </p>
        <ul className={styles.stepsList}>
          <li>
            <strong>Old Carpet &amp; Pad Removal ($0.25 – $0.60 / sq ft):</strong> Involves slicing old carpet into manageable 3-foot rolls, ripping up compressed padding, and prying hundreds of perimeter staples out of the subfloor.
          </li>
          <li>
            <strong>Landfill Disposal &amp; Haul-Away ($0.15 – $0.40 / sq ft):</strong> Covers trash bags, transport, and municipal landfill tipping fees. A standard home generates several hundred pounds of bulky synthetic carpet waste.
          </li>
          <li>
            <strong>Tack Strip Replacement ($0.50 – $1.50 / lin ft):</strong> Reusable wooden tack strips are anchored around the perimeter. However, strips damaged by pet urine, previous water leaks, or delamination must be replaced before stretching new carpet.
          </li>
          <li>
            <strong>Subfloor Leveling &amp; Squeak Repair ($2.00 – $6.00 / sq ft):</strong> Carpet cushions slight subfloor imperfections, but loose joists, rotting OSB sheets, or dips greater than 1/4 inch require screw reinforcement or self-leveling patch.
          </li>
          <li>
            <strong>Doorway Transition Thresholds ($15 – $35 each):</strong> Metal clamp strips, wooden T-moldings, or rubber reducers installed where carpet meets hardwood, tile, or laminate in door openings.
          </li>
        </ul>

        <h2 className={styles.h2}>Cost to Carpet Stairs: Waterfall vs. Box Style</h2>
        <p className={styles.p}>
          Stairs represent the most labour-intensive portion of any carpet installation. A typical residential staircase has 12 to 14 steps, requiring specialized padding cuts, knee-kicking, and staple anchoring beneath every tread nosing.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Stair Style</th>
                <th>Labour Rate / Step</th>
                <th>13 Steps Labour</th>
                <th>Features &amp; Best Uses</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Waterfall Style</strong>
                  <div className={styles.meta}>Continuous cascade</div>
                </td>
                <td>$5 – $12</td>
                <td>$65 – $156</td>
                <td>
                  Carpet drops cleanly from the tread nosing down the riser to the next step. Most economical, ideal for dense loop or textured carpets without side spindles.
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Box (Cap &amp; Band)</strong>
                  <div className={styles.meta}>Hand-wrapped contour</div>
                </td>
                <td>$10 – $25</td>
                <td>$130 – $325</td>
                <td>
                  Carpet is tightly molded around the tread nosing and tucked under the bullnose before descending the riser. Necessary for stairs with open railings, spindles, or bullnose returns.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className={styles.h2}>Carpet Cost by Fibre and Style</h2>
        <p className={styles.p}>
          The fibre composition and tufting style dictate 70% of carpet&apos;s material price and long-term durability:
        </p>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Fibre Type</th>
                <th>Material Cost / sq ft</th>
                <th>Key Advantages</th>
                <th>Considerations</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(CARPET_FIBRES).map((f) => (
                <tr key={f.id}>
                  <td><strong>{f.name}</strong></td>
                  <td>${f.low.toFixed(2)} – ${f.high.toFixed(2)}</td>
                  <td>{f.pros}</td>
                  <td className={styles.meta}>{f.cons}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className={styles.h3}>Style Variations: Plush, Berber and Frieze</h3>
        <p className={styles.p}>
          <strong>Plush / Texture ($2.00 – $6.00/sq ft):</strong> Smooth, level cut-pile yarn. Textured variations twist fibres slightly to diffuse light, hiding vacuum marks and footprints in bedrooms and formal living rooms.
        </p>
        <p className={styles.p}>
          <strong>Berber / Loop ($1.50 – $5.00/sq ft):</strong> High-density uncut loops. Outstanding resistance to crushing in basements and home offices. However, looped yarns can snag on pet claws and require firm, thin padding (maximum 3/8-inch, 8-lb density).
        </p>
        <p className={styles.p}>
          <strong>Frieze / Twisted Shag ($2.50 – $7.00/sq ft):</strong> Yarns with extreme twist levels that curl in random directions. Excellent resilience that conceals tracked-in soil and heavy furniture depressions.
        </p>

        <h2 className={styles.h2}>Carpet Tile Installation Cost</h2>
        <p className={styles.p}>
          Modular carpet tiles (squares measuring 19.7×19.7 in or 24×24 in) cost <strong>$2.00 to $5.00 per square foot</strong> for materials and <strong>$1.00 to $2.00 per square foot</strong> for installation labour. While the material price per square foot is comparable to mid-grade broadloom, tiles eliminate several costly expenses:
        </p>
        <ul className={styles.stepsList}>
          <li><strong>Virtually Zero Roll Waste:</strong> Tiles are cut only at room perimeters, reducing material cutting waste from 15% down to just 5%.</li>
          <li><strong>Integrated Backing:</strong> Carpet tiles feature vulcanized vinyl or composite backing cushions, eliminating the need to purchase separate underlayment pad.</li>
          <li><strong>Modular Spot Maintenance:</strong> When a stain or tear occurs, you simply peel up and replace the single damaged tile rather than replacing an entire room.</li>
        </ul>

        <h2 className={styles.h2}>Carpet vs. Luxury Vinyl Plank, Laminate and Hardwood</h2>
        <p className={styles.p}>
          Before committing to new carpet, many homeowners compare the total installed cost and lifecycle value against hard-surface alternatives:
        </p>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Flooring Type</th>
                <th>Installed Cost / sq ft</th>
                <th>Typical Lifespan</th>
                <th>Water Resistance</th>
                <th>Sound &amp; Comfort</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Carpet (Mid-Grade)</strong></td>
                <td>$3.50 – $9.50</td>
                <td>8 – 15 Years</td>
                <td>Low (absorbs liquids)</td>
                <td>Best thermal &amp; sound insulation</td>
              </tr>
              <tr>
                <td><strong>Luxury Vinyl Plank (LVP)</strong></td>
                <td>$4.50 – $10.00</td>
                <td>15 – 25 Years</td>
                <td>100% Waterproof</td>
                <td>Hard underfoot, easy cleaning</td>
              </tr>
              <tr>
                <td><strong>Laminate Flooring</strong></td>
                <td>$3.50 – $8.00</td>
                <td>15 – 25 Years</td>
                <td>Moderate surface resistance</td>
                <td>High scratch resistance, hollow sound</td>
              </tr>
              <tr>
                <td><strong>Hardwood Refinishing</strong></td>
                <td>$3.00 – $6.50</td>
                <td>10 – 20 Years (per sand)</td>
                <td>Low (standing water damages)</td>
                <td>Classic elegance, highest resale value</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className={styles.h2}>Smart Ways to Save on Carpet Replacement</h2>
        <p className={styles.p}>
          You can significantly reduce carpet installation costs without sacrificing comfort or carpet longevity by following these professional trade strategies:
        </p>
        <ul className={styles.stepsList}>
          <li>
            <strong>Do Your Own Tear-Out:</strong> Stripping old carpet, ripping up pad, and sweeping the subfloor takes a Saturday afternoon and saves $0.40 to $0.85 per square foot ($300 to $600 on an average project).
          </li>
          <li>
            <strong>Never Skimp on the Pad:</strong> Upgrading from a 6-lb pad to an 8-lb bonded cushion costs only $0.25 to $0.40 extra per square foot, but can double the lifespan of mid-grade carpet by absorbing foot impact before it crushes the carpet pile.
          </li>
          <li>
            <strong>Shop Warehouse Remnants for Small Rooms:</strong> Carpet retail warehouses regularly discount end-of-roll remnants (pieces under 12×15 feet) at 40% to 60% off list prices—ideal for individual bedrooms, home offices, and nursery rooms.
          </li>
          <li>
            <strong>Move Breakables &amp; Small Furniture:</strong> Contractors charge $25 to $60 per room for moving heavy furniture. Clearing nightstands, lamps, electronics, and closets yourself avoids unnecessary hourly labour surcharges.
          </li>
        </ul>

        <h2 className={styles.h2}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <h3 className={styles.faqQ}>{faq.q}</h3>
              <p className={styles.faqA}>{faq.a}</p>
            </div>
          ))}
        </div>

        <HowWeCalculate slug="carpet-cost-calculator" />

        <h2 className={styles.h2}>Related Flooring &amp; Renovation Calculators</h2>
        <p className={styles.p}>
          Plan your home remodeling projects with our verified trade estimation tools:
        </p>
        <div className={styles.relatedGrid}>
          <Link href="/square-footage-calculator/" className={styles.relatedCard}>
            <span className={styles.relatedCardTitle}>Square Footage Calculator →</span>
            <p className={styles.relatedCardDesc}>
              Calculate room areas, irregular shapes, and waste factors for material estimates.
            </p>
          </Link>
          <Link href="/laminate-flooring-calculator/" className={styles.relatedCard}>
            <span className={styles.relatedCardTitle}>Laminate Flooring Calculator →</span>
            <p className={styles.relatedCardDesc}>
              Determine box counts, underlayment rolls, and DIY vs professional installation costs.
            </p>
          </Link>
          <Link href="/floor-refinishing-cost-calculator/" className={styles.relatedCard}>
            <span className={styles.relatedCardTitle}>Floor Refinishing Cost Calculator →</span>
            <p className={styles.relatedCardDesc}>
              Compare screen-and-recoat, full sanding, and dustless hardwood floor restoration prices.
            </p>
          </Link>
          <Link href="/tile-calculator/" className={styles.relatedCard}>
            <span className={styles.relatedCardTitle}>Tile Calculator →</span>
            <p className={styles.relatedCardDesc}>
              Estimate ceramic, porcelain, and subway tiles, grout bags, and carton coverage.
            </p>
          </Link>
          <Link href="/bathroom-remodel-cost-calculator/" className={styles.relatedCard}>
            <span className={styles.relatedCardTitle}>Bathroom Remodel Cost Calculator →</span>
            <p className={styles.relatedCardDesc}>
              Itemize plumbing fixtures, tiling, vanities, and trade labour across finish grades.
            </p>
          </Link>
        </div>
      </article>
    </main>
  );
}
