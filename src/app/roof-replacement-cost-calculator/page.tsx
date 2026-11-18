import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import RoofReplacementCalculator from '@/components/tool/roof-replacement-cost-calculator';
import ToolShell from '@/components/tool/shared/ToolShell';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  quickEstimate,
  homeSizeTable,
  materialComparison,
  laborPerSquare,
} from '@/lib/roof-replacement-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.roofReplacementCostCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

// Helper formatters
const n = (v: number, dp = 0) =>
  v.toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: dp });
const $ = (v: number, dp = 0) => `$${n(v, dp)}`;

// Dynamic calculations for copy & tables (all sourced from pure engine)
const home2000 = quickEstimate(2000, 6, 'architectural', 1, '1');
const home2000ThreeTab = quickEstimate(2000, 6, 'threeTab', 1, '1');
const home2000StandingSeam = quickEstimate(2000, 6, 'standingSeam', 1, '1');
const home2000Slate = quickEstimate(2000, 6, 'slate', 1, '1');

const homeSizes = homeSizeTable('architectural');
const matMatrix = materialComparison(2000, 6, 1);
const laborRate = laborPerSquare('architectural', '1', 6, 'hip');

// 12 Comprehensive FAQs matching SPEC §6
const faqs = [
  {
    q: 'How much does it cost to replace a roof on a 2,000 sq ft house?',
    a: `Replacing an architectural asphalt shingle roof on a 2,000 sq ft home (which requires ~25 roofing squares due to pitch and overhangs) typically costs ${$(
      home2000.total
    )}, with an expected range of ${$(home2000.low)} to ${$(
      home2000.high
    )}. Economy 3-tab shingles cost about ${$(
      home2000ThreeTab.total
    )}, while standing seam metal averages ${$(
      home2000StandingSeam.total
    )} and natural slate reaches ${$(home2000Slate.total)}.`,
  },
  {
    q: 'What is the average roofing cost per square in 2026?',
    a: `Nationwide, the average cost to tear off and replace a roof ranges from $400 to $700 per roofing square (100 sq ft) for standard architectural shingles. High-end materials cost significantly more: standing seam metal runs $900 to $1,600 per square, concrete tile runs $800 to $1,800 per square, and natural slate costs $1,500 to $3,500 per square installed.`,
  },
  {
    q: 'What is the roofing labor cost per square?',
    a: `Professional roofing labor averages ${$(laborRate.typical)} per square (${$(
      laborRate.low
    )} to ${$(
      laborRate.high
    )}/sq), representing roughly 45% to 60% of your total invoice. Labor costs increase by 15% to 25% for two-story homes, 20% for steep slopes (8/12 pitch and greater) requiring safety harnesses, and 15% to 20% for complex roof geometries with multiple valleys and dormers.`,
  },
  {
    q: 'Can I layer new shingles over old shingles (reroof / overlay)?',
    a: 'An overlay (reroofing without tearing off the old layer) is only legal if the roof currently has exactly ONE layer of asphalt shingles. Under International Residential Code (IRC) Section R908.3.1.1, roofs with two or more existing layers cannot be overlaid and must be stripped down to the decking. While an overlay saves $1,000 to $2,500 in tear-off costs, it prevents inspection of rotted wood decking, voids some manufacturer warranties, and traps heat.',
  },
  {
    q: 'How much does it cost to replace plywood roof decking?',
    a: 'Replacing damaged or water-rotted roof decking typically costs $70 to $110 per 4×8 ft sheet of 7/16-inch OSB or CDX plywood installed, including labor and materials. On a typical 20-year-old roof, contractors anticipate replacing 10% to 20% of the decking sheets (typically 2 to 6 sheets, costing $170 to $510). If an entire 2,000 sq ft roof deck requires replacement, expect an additional $5,000 to $7,000.',
  },
  {
    q: 'How does roof pitch affect replacement cost?',
    a: 'Roof pitch affects replacement cost in two major ways: surface area and labor rates. First, steep slopes increase surface area: a 12/12 pitch has 41.4% more square footage than a flat footprint. Second, pitches of 8/12 or steeper trigger steep-slope safety surcharges (+20% labor) because roofers must use toe boards, safety harnesses, and ropes, significantly slowing installation speed.',
  },
  {
    q: 'How do I know if my roof needs replacement or just repair?',
    a: 'Spot repair is appropriate if the roof is under 15 years old, leaks are localized to a single flashing penetration or a few missing shingles, and surrounding shingles remain supple. Full replacement is necessary if shingles are curling, cupping, or losing excessive granules, multiple leaks occur in valleys or living areas, or the roof has reached 80% to 100% of its rated lifespan (20–25 years for 3-tab, 25–30 years for architectural).',
  },
  {
    q: 'Does homeowners insurance cover roof replacement?',
    a: 'Homeowners insurance policies typically cover sudden, accidental damage caused by unpreventable perils like wind, fallen trees, tornado, or hail storms. Insurance does NOT cover general wear and tear, age-related deterioration, rot, or maintenance neglect. Depending on your policy, you may be reimbursed for Replacement Cost Value (RCV) or Actual Cash Value (ACV, which deducts depreciation based on age).',
  },
  {
    q: 'What roofing material has the best return on investment?',
    a: 'Architectural asphalt shingles offer the best balance of upfront affordability and resale ROI (recouping 60% to 68% of cost at sale according to Remodeling Magazine). Standing seam metal provides the lowest annualized lifecycle cost because it lasts 50+ years and requires virtually zero maintenance, though its upfront cost is roughly 2.5× higher than asphalt.',
  },
  {
    q: 'How long does a roof replacement take?',
    a: 'A standard single-family residential roof replacement (1,500 to 2,500 sq ft) takes 1 to 2 days for an experienced crew of 5 to 7 roofers working in favorable weather. Complex roofs with multiple dormers, steep pitches, slate, or tile installations can take 3 to 7 days. Tear-off typically finishes on day one, followed by decking inspection, dry-in underlayment, and shingle installation.',
  },
  {
    q: 'What is the difference between synthetic underlayment and felt?',
    a: 'Traditional #15 or #30 asphalt-saturated organic felt absorbs moisture, wrinkles when wet, and tears easily during foot traffic. Modern synthetic underlayment (woven polypropylene) is 4× lighter, 20× more tear-resistant, impervious to water pooling, and UV-resistant for up to 6 months of outdoor exposure. Synthetic costs only $30 to $50 more per roll and is now industry standard.',
  },
  {
    q: 'How do I know if a contractor roof replacement quote is fair?',
    a: `A fair quote should fall within 10% to 15% of regional averages (${$(
      home2000.low
    )} to ${$(
      home2000.high
    )} for a 2,000 sq ft home) and contain itemized line items specifying shingle brand, underlayment type, ice & water shield footage, drip edge, ridge ventilation, per-sheet decking replacement rates, permit fees, and disposal. Bids significantly below this range frequently indicate unlicensed labor, omitted permits, or missing liability insurance.`,
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Roof Replacement Cost Calculator',
  path: route.path,
  description:
    'Free interactive roof replacement cost calculator. Estimate total new roof cost, cost per square, labor, tear-off, and decking with zero signup.',
});

const faqSchema = buildFaqSchema(faqs);

export default function RoofReplacementCostCalculatorPage() {
  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <JsonLd data={[webAppSchema, faqSchema]} />

      <Breadcrumbs
        items={[
          { name: 'Tools', path: '/tools/' },
          { name: 'Roof Replacement Cost Calculator', path: route.path },
        ]}
      />

      <header className={styles.header}>
        <h1 className={styles.h1}>Roof Replacement Cost Calculator</h1>
        <p className={styles.lead}>
          Estimate the total cost to tear off and replace your roof. Calculate accurate costs per roofing square,
          compare 10 materials (asphalt, standing seam metal, tile, slate, cedar), adjust for pitch and stories, and
          verify contractor bids with zero sales calls.
        </p>
        <p className={styles.meta}>
          Updated for 2026 construction pricing · Sourced from BLS wage surveys, Fixr &amp; HomeGuide industry data
        </p>
      </header>

      {/* BLUF / Quick Answer Box */}
      <div className={styles.blufBox}>
        <strong>Quick Answer:</strong> Replacing an asphalt shingle roof on a typical 2,000 sq ft home costs{' '}
        <strong>{$(home2000.low)} to {$(home2000.high)}</strong> (national average ~{$(home2000.total)}), or{' '}
        <strong>$450 to $700 per roofing square</strong> ($4.50 to $7.00 per sq ft) fully installed. Costs range from{' '}
        {$(home2000ThreeTab.total)} for economy 3-tab shingles up to {$(home2000StandingSeam.total)}+ for standing seam
        metal or tile. Pitch, story height, tear-off layers, and rotten decking directly determine your final invoice.
      </div>

      {/* Primary Tool Component */}
      <section className={styles.toolSection} aria-label="Interactive Roof Replacement Cost Calculator">
        <ToolShell
          features={[
            'Roof squares & pitch',
            'Tear-off & decking',
            '8 roofing materials',
            'Detailed cost takeoff',
          ]}
        >
          <RoofReplacementCalculator />
        </ToolShell>
      </section>

      <AdSlot slotId="roof-replacement-mid" />

      {/* Comprehensive SEO Content Article */}
      <article className={styles.article}>
        <h2>How to Use This Roof Replacement Cost Calculator</h2>
        <p>
          Calculating a new roof estimate accurately requires accounting for both horizontal building dimensions and the
          three-dimensional geometric slope of your roofline. Our calculator provides two operational modes to fit where
          you are in your planning process:
        </p>
        <ul>
          <li>
            <strong>Quick Estimate Mode:</strong> Enter your ground-level home footprint (e.g. 2,000 sq ft), select your
            roof pitch (such as 6/12), and choose your desired roofing material. The engine applies standard eave
            overhangs, waste factors (10%–15%), and single-layer tear-off to give an immediate budget range.
          </li>
          <li>
            <strong>Detailed Breakdown Mode:</strong> Unfold advanced job site parameters including multi-story access
            surcharges, hip-and-valley complexity, decking wood rot percentage, synthetic versus felt underlayment, ice
            &amp; water barrier rolls, continuous ridge vents, and regional labor multipliers.
          </li>
          <li>
            <strong>Contractor Quote Verification:</strong> Enter any written bid you receive from a local roofer. The
            tool checks whether the price falls within typical fair-market standards or exhibits suspicious pricing
            indicators.
          </li>
        </ul>

        <h2>Roof Replacement Cost by Home Size</h2>
        <p>
          Roof surface area is always larger than the living area beneath it because of pitch slopes, overhangs, and
          attached garages or porches. The benchmark table below illustrates typical replacement costs for architectural
          asphalt shingles across popular American single-family home sizes (based on a standard 6/12 pitch and single-layer
          tear-off):
        </p>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Home Footprint</th>
                <th>Estimated Roof Area</th>
                <th>Roofing Squares</th>
                <th>Low Range</th>
                <th>Typical Cost</th>
                <th>High Range</th>
              </tr>
            </thead>
            <tbody>
              {homeSizes.map((row) => (
                <tr key={row.homeFootprintSqFt}>
                  <td>
                    <strong>{n(row.homeFootprintSqFt)} sq ft</strong>
                  </td>
                  <td>{n(row.roofAreaSqFt)} sq ft</td>
                  <td>{n(row.squares, 1)} sq</td>
                  <td>{$(row.lowCost)}</td>
                  <td>
                    <strong>{$(row.typicalCost)}</strong>
                  </td>
                  <td>{$(row.highCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Need to verify the exact surface area of your rafters or roof planes? Use our dedicated{' '}
          <Link href="/shingle-calculator/">Shingle Roof Calculator</Link> or calculate framing rafter lengths with our{' '}
          <Link href="/rafter-calculator/">Rafter Calculator</Link>.
        </p>

        <h2>Roofing Cost Per Square Explained</h2>
        <p>
          In the roofing industry, materials and labor are quoted by the <strong>&ldquo;Square&rdquo;</strong>. One roofing
          square equals <strong>100 square feet</strong> of roof surface area (a 10-foot by 10-foot section). For
          example, a 2,400 sq ft roof equals exactly 24 squares.
        </p>
        <p>A typical architectural asphalt shingle quote breaks down into three core components per square:</p>
        <ul>
          <li>
            <strong>Materials (40% to 45% of total):</strong> Approximately $150 to $250 per square. This includes 3
            bundles of shingles, synthetic underlayment, ice and water shield, starter strip shingles, ridge cap shingles,
            drip edge flashing, and roofing nails.
          </li>
          <li>
            <strong>Installation Labor (45% to 50% of total):</strong> Approximately $180 to $320 per square. Based on
            U.S. Bureau of Labor Statistics wage benchmarks, professional roofers handle stripping old shingles, carrying
            bundles up ladders, laying underlayment, chalking courses, and hand-nailing or gun-nailing shingles.
          </li>
          <li>
            <strong>Tear-Off, Disposal &amp; Permits (10% to 15% of total):</strong> Approximately $100 to $300 per
            square per layer. Covers stripping down to sheathing, roll-off dumpster haul-away, disposal tonnage fees, and municipal
            building inspection permits.
          </li>
        </ul>

        <h2>Roof Replacement Cost by Material (10 Options Compared)</h2>
        <p>
          Selecting the right roofing material involves balancing upfront construction expense against longevity and
          annualized ownership cost. The table below compares 10 roofing materials calculated for a standard 2,000 sq ft
          home (~25 squares):
        </p>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Roofing Material</th>
                <th>Cost / Square</th>
                <th>Typical 2,000 ft² Total</th>
                <th>Lifespan</th>
                <th>Annual Cost / Year</th>
              </tr>
            </thead>
            <tbody>
              {matMatrix.map((m) => (
                <tr key={m.id}>
                  <td>
                    <strong>{m.label}</strong>
                  </td>
                  <td>{$(m.costPerSquare)}</td>
                  <td>{$(m.totalCost)}</td>
                  <td>{m.lifespanYears} years</td>
                  <td>
                    <strong>${n(m.costPerYear, 0)}/yr</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Looking to compare lifetime metal roofing specifically against asphalt shingles? Explore our specialized{' '}
          <Link href="/metal-roof-cost-calculator/">Metal Roof Cost Calculator</Link> for detailed seam widths, gauges,
          and lifecycle graphs.
        </p>

        <h2>Key Cost Factors That Increase Your Roof Price</h2>
        <p>
          Two neighboring houses with identical square footages can receive vastly different contractor bids. The primary
          variables that drive roofing price differences include:
        </p>

        <div className={styles.cardsGrid}>
          <div className={styles.cardItem}>
            <h3 className={styles.cardTitle}>1. Pitch &amp; Steep-Slope Surcharges</h3>
            <p className={styles.cardText}>
              A walk-able roof (3/12 to 6/12) allows roofers to move swiftly. Once slope reaches 8/12 or greater, safety
              regulations require fall-arrest harness rigging, roof jacks, and staging boards, adding a 15% to 25% labor
              surcharge.
            </p>
          </div>

          <div className={styles.cardItem}>
            <h3 className={styles.cardTitle}>2. Number of Stories &amp; Access</h3>
            <p className={styles.cardText}>
              Two- and three-story homes require longer ladder climbs, safety netting, and specialized conveyor boom
              trucks to hoist 70-pound shingle bundles onto the ridge, adding $20 to $50 per square in handling.
            </p>
          </div>

          <div className={styles.cardItem}>
            <h3 className={styles.cardTitle}>3. Valleys, Dormers &amp; Complexity</h3>
            <p className={styles.cardText}>
              A simple two-plane gable roof has minimal waste (8%–10%). A hip roof with dormers, skylights, and valleys
              requires extensive step-flashing, lead boots, and cut angles, increasing material waste to 15%–20%.
            </p>
          </div>

          <div className={styles.cardItem}>
            <h3 className={styles.cardTitle}>4. Multiple Tear-Off Layers</h3>
            <p className={styles.cardText}>
              Stripping one layer costs about $200/square in this calculator ($100–$300). If a prior owner installed an overlay, removing two layers doubles
              the manual labor and dumpster weight fees, adding $1,000 to $2,000 to your disposal bill.
            </p>
          </div>
        </div>

        <h2>How to Calculate Roof Square Footage from Ground Footprint</h2>
        <p>
          Homeowners frequently underestimate roof size by assuming it matches ground square footage. Because roofs
          incline at an angle, the sloped hypotenuse is longer than the horizontal flat run. The geometric pitch multiplier
          formula is:
        </p>
        <code className={styles.formula}>Pitch Multiplier = √(1 + (Rise ÷ 12)²)</code>
        <p>
          Multiply your horizontal projected footprint (including 12-inch eave overhangs) by the multiplier below to
          find your true surface area:
        </p>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Roof Pitch</th>
                <th>Slope Angle</th>
                <th>Multiplier</th>
                <th>2,000 ft² Footprint Area</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>3/12 (Low Slope)</td>
                <td>14.0°</td>
                <td>1.031</td>
                <td>2,062 sq ft (20.6 sq)</td>
              </tr>
              <tr>
                <td>4/12 (Standard)</td>
                <td>18.4°</td>
                <td>1.054</td>
                <td>2,108 sq ft (21.1 sq)</td>
              </tr>
              <tr>
                <td>6/12 (Common Gable)</td>
                <td>26.6°</td>
                <td>1.118</td>
                <td>2,236 sq ft (22.4 sq)</td>
              </tr>
              <tr>
                <td>8/12 (Steep Slope)</td>
                <td>33.7°</td>
                <td>1.202</td>
                <td>2,404 sq ft (24.0 sq)</td>
              </tr>
              <tr>
                <td>10/12 (Very Steep)</td>
                <td>39.8°</td>
                <td>1.302</td>
                <td>2,604 sq ft (26.0 sq)</td>
              </tr>
              <tr>
                <td>12/12 (45° Pitch)</td>
                <td>45.0°</td>
                <td>1.414</td>
                <td>2,828 sq ft (28.3 sq)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          You can also measure individual floor or ceiling sections using our{' '}
          <Link href="/square-footage-calculator/">Square Footage Calculator</Link>.
        </p>

        <h2>Roofing Components &amp; Accessories Explained</h2>
        <p>
          A durable roof replacement is a comprehensive weatherproofing system, not just shingles nailed to boards. A
          complete quote includes:
        </p>
        <ul>
          <li>
            <strong>Roof Decking (Sheathing):</strong> 7/16-inch OSB or CDX plywood fastened to rafters. Any sheets
            rotted from past leaks must be replaced at $70–$110/sheet.
          </li>
          <li>
            <strong>Drip Edge Flashing:</strong> L-shaped or T-shaped galvanized metal installed along eaves and rakes to
            prevent rainwater from curling behind gutters and rotting the fascia board.
          </li>
          <li>
            <strong>Ice &amp; Water Shield:</strong> A self-adhering modified bitumen rubber membrane required by building
            codes in snow-belt climates. Installed at least 24 inches inside the interior heated wall line and inside all
            valleys to protect against winter ice dam backups.
          </li>
          <li>
            <strong>Synthetic Underlayment:</strong> Heavy-duty water-resistant barrier installed over the remaining deck
            to guard against wind-driven rain.
          </li>
          <li>
            <strong>Continuous Ridge Ventilation:</strong> Installed along the peak to allow hot, humid attic air to
            escape, preserving shingle adhesive and lowering summer cooling bills.
          </li>
          <li>
            <strong>Pipe Boots &amp; Chimney Step Flashing:</strong> Neoprene collars and galvanized step flashing that
            seal plumbing vent stacks and masonry walls against water entry.
          </li>
        </ul>

        <h2>Repair vs. Overlay vs. Full Replacement</h2>
        <p>Before committing to a full replacement, evaluate your roof against all three alternatives:</p>

        <div className={styles.callout}>
          <strong>When to Spot Repair:</strong> If your roof is less than 15 years old, shingles remain flexible, and
          damage is confined to a localized area (such as a fallen tree branch or pipe boot failure), a spot repair costing
          $300 to $1,000 can extend your roof&apos;s lifespan for several years.
        </div>

        <div className={styles.calloutWarning}>
          <strong>Building Code Restriction (IRC R908.3.1.1):</strong> A reroof / overlay (installing new shingles directly
          over old ones) is legally permissible ONLY if there is currently just ONE layer of roofing. Section R908.3.1.1
          of the International Residential Code strictly prohibits adding a third layer. If two layers already exist, a
          complete tear-off down to the decking is mandatory by law.
        </div>

        <p>
          Even when legal, most experienced roofing professionals advise against overlays because you cannot inspect the
          underlying wood decking for dry rot or sagging rafters. Additionally, double layers retain heat, shortening the
          new shingle lifespan by 20% to 30%.
        </p>

        <h2>Flat &amp; Low-Slope Roof Replacement</h2>
        <p>
          Standard asphalt shingles rely on gravity and water shed; they are not waterproof membranes. If any section of
          your roof has a pitch lower than <strong>2/12</strong> (such as flat patio extensions, porches, or commercial
          additions), shingles cannot be installed by code.
        </p>
        <p>Low-slope surfaces require continuous membrane roofing systems:</p>
        <ul>
          <li>
            <strong>TPO (Thermoplastic Polyolefin):</strong> Single-ply white reflective membrane with heat-welded seams.
            Costs $6.00 to $11.00 per sq ft ($600–$1,100/sq) and excels in warm climates.
          </li>
          <li>
            <strong>EPDM (Rubber Roofing):</strong> Extremely durable synthetic vulcanized rubber membrane. Costs $5.00 to
            $10.00 per sq ft ($500–$1,000/sq) and withstands hail and freezing temperatures for 30+ years.
          </li>
          <li>
            <strong>Modified Bitumen:</strong> Multi-layer asphalt rolls installed with self-adhering adhesive or torch-down
            heat. Costs $4.50 to $8.50 per sq ft ($450–$850/sq).
          </li>
        </ul>

        <h2>Insurance Claims, Building Permits &amp; Financing</h2>
        <p>
          If your roof replacement was triggered by a recent storm event, file a claim promptly with your homeowners
          insurance carrier:
        </p>
        <ul>
          <li>
            <strong>RCV vs. ACV Policies:</strong> Replacement Cost Value (RCV) policies pay the full current cost to
            rebuild your roof minus your deductible. Actual Cash Value (ACV) policies deduct annual depreciation based on
            roof age, leaving homeowners to pay the remaining gap out of pocket.
          </li>
          <li>
            <strong>Building Permits:</strong> Municipal permits range from $150 to $500 depending on your city. Reputable
            contractors always pull permits in their own company name. If a contractor asks you to pull an &ldquo;owner-builder&rdquo;
            permit, it often means they lack proper state licensing or liability bonding.
          </li>
          <li>
            <strong>Project Proposals:</strong> Preparing an itemized scope of work? Use our free{' '}
            <Link href="/construction-estimate-template/">Construction Estimate Template</Link> to generate professional,
            printable quotes with tax and margin calculations.
          </li>
        </ul>

        <h2>How to Compare Contractor Quotes &amp; Avoid Scams</h2>
        <p>
          A new roof is one of the largest capital investments you will ever make in your home. Protect your budget by
          following these four vetting rules:
        </p>
        <ol>
          <li>
            <strong>Require Itemized Line Items:</strong> Never accept a single lump-sum figure. Your quote must specify the
            shingle brand and series (e.g. GAF Timberline HDZ, Owens Corning Duration), underlayment type, ice &amp; water
            shield rows, per-sheet decking replacement rate ($75–$110), and warranty terms.
          </li>
          <li>
            <strong>Verify Active Workers&apos; Comp &amp; General Liability Insurance:</strong> Roofing is inherently
            hazardous. If an uninsured roofer slips on your roof, their medical bills could become a lien against your
            property. Ask the contractor&apos;s insurance agency to email you a Certificate of Insurance (COI) directly.
          </li>
          <li>
            <strong>Watch for Door-to-Door &ldquo;Storm Chasers&rdquo;:</strong> Following severe hail storms, out-of-town
            crews flood neighborhoods offering &ldquo;free roofs&rdquo; by waiving insurance deductibles (which is illegal in
            most states). Choose established local roofers with at least 5 years in your community.
          </li>
          <li>
            <strong>Never Pay 100% Upfront:</strong> Standard payment terms are 10%–20% upon signing, 40%–50% upon material
            delivery, and the final balance ONLY after the roof passes municipal building inspection and your magnetic
            roller yard cleanup is completed.
          </li>
        </ol>

        {/* 12 FAQs */}
        <section className={styles.faqSection} aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions About Roof Replacement</h2>
          {faqs.map((faq) => (
            <div key={faq.q} className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>{faq.q}</h3>
              <p className={styles.faqAnswer}>{faq.a}</p>
            </div>
          ))}
        </section>

        {/* How We Calculate Component */}
        <HowWeCalculate slug="roof-replacement-cost-calculator" />
      </article>
    </main>
  );
}
