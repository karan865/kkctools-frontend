import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';
import DeckCostCalculator from '@/components/tool/deck-cost-calculator';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import AdSlot from '@/components/ads/AdSlot';
import JsonLd from '@/components/seo/JsonLd';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildWebApplicationSchema, buildFaqSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  DECK_MATERIALS,
  DECK_SIZE_BENCHMARKS,
} from '@/lib/deck-cost-engine';

export const dynamic = 'force-static';

const route = ROUTES.deckCostCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const FAQS = [
  {
    q: 'How much does a 12×12, 16×20, or 20×20 deck cost?',
    a: 'Based on national 2026 contractor averages, a 12×12 deck (144 sq ft) costs $3,100 to $6,100 in pressure-treated pine or $5,100 to $9,700 in composite. A mid-sized 16×20 deck (320 sq ft) ranges from $6,600 to $12,800 for wood and $10,800 to $20,600 for capped composite. A large 20×20 deck (400 sq ft) typically costs $8,100 to $15,800 in treated pine and $13,300 to $25,400 in composite with code-compliant railings and stairs included.',
  },
  {
    q: 'What is the average labor cost to build a deck per square foot?',
    a: 'Professional deck labor typically runs between $12 and $25 per square foot for standard ground-level or low-elevation builds. Based on US Bureau of Labor Statistics (BLS) carpenter wage data (SOC 47-2031) and contractor overhead burdens, labor scales with elevation: ground decks cost $12–$20/sq ft, while second-story or elevated decks over 8 feet carry a 25%–45% labor premium ($18–$35/sq ft) due to scaffolding, heavy bracing, and harness safety requirements.',
  },
  {
    q: 'How much does Trex or composite decking cost per square foot?',
    a: 'Composite decking boards (such as Trex, TimberTech, or Deckorators) cost between $8.50 and $26.00 per square foot for materials alone. Basic uncapped or scalloped boards start around $8.50–$14.00/sq ft, while premium 4-sided capped composites with natural embossed grain range from $14.00–$26.00/sq ft. When combined with pressure-treated framing substructure and professional installation, full composite deck projects range from $35 to $75 per square foot installed.',
  },
  {
    q: 'Is composite decking worth the extra cost over pressure-treated wood?',
    a: 'For long-term homeowners, yes. While a pressure-treated wood deck costs 40% to 50% less upfront, it requires power washing, staining, and sealing every 2 to 3 years (averaging $1.25 to $1.75/sq ft annually in supplies or contractor maintenance). Over a 25-year lifespan, the recurring maintenance on wood eliminates initial upfront savings. Composite decking requires only soap-and-water washing and resists rotting, warping, and insect infestation.',
  },
  {
    q: 'How much does a pressure-treated wood deck cost?',
    a: 'Pressure-treated Southern yellow pine or fir is the most economical decking material in North America. Installed costs average $15 to $35 per square foot ($3.00 to $8.00/sq ft for decking boards, $8.00 to $12.00/sq ft for joist and beam framing lumber, and $10.00 to $20.00/sq ft for professional installation labor).',
  },
  {
    q: 'How much does it cost to replace an existing deck?',
    a: 'Full deck replacement involves tearing down the old structure, hauling away debris to a landfill, and building anew. Complete demolition and disposal typically costs $4.00 to $10.00 per square foot depending on height and accessibility. A 300 sq ft deck replacement costs $1,200 to $3,000 for demolition plus $7,500 to $18,000 for the new deck, totaling approximately $8,700 to $21,000.',
  },
  {
    q: 'How much does it cost to resurface (re-deck) a deck on existing framing?',
    a: 'If your posts, concrete footings, and joists are structurally sound without rot, you can resurface the deck by removing only the surface boards and railing. Resurfacing costs $15 to $35 per square foot ($2.00–$4.00/sq ft for board removal and disposal, plus new boards and fasteners). This saves 40% to 60% compared to a complete ground-up build.',
  },
  {
    q: 'How much does it cost to fix or repair minor deck damage?',
    a: 'Minor deck repairs average $500 to $1,800. Replacing isolated rotted deck boards costs $25 to $45 per board installed. Replacing a weakened joist or sistering an existing joist costs $150 to $350. Repairing a wobbly handrail section runs $150 to $400, while re-securing or flashing a loose ledger board costs $300 to $700.',
  },
  {
    q: 'How many deck boards and screws do I need?',
    a: 'To calculate deck boards, divide the deck projection width across joists by the board pitch (board width + gap). A 12 ft wide deck using 5.5-inch boards with 3/16-inch gaps requires 26 rows. Multiply rows by the boards needed along the length, plus 10% waste (15% for diagonal). For fasteners, plan on 2 screws per board at every joist crossing, requiring approximately 350 screws per 100 square feet.',
  },
  {
    q: 'How much gap should I leave between deck boards?',
    a: 'For wet, freshly treated pine boards, leave a narrow 1/16-inch to 1/8-inch gap (or butt them hand-tight), as wet lumber shrinks significantly as it dries in the sun. For kiln-dried lumber, cedar, and composite boards, leave a 3/16-inch to 1/4-inch side-to-side gap to allow water drainage and thermal expansion. Always leave a 1/8-inch to 3/16-inch gap where board ends butt together.',
  },
  {
    q: 'Do I need a building permit to build or replace a deck?',
    a: 'In most North American jurisdictions governed by the International Residential Code (IRC), a permit is mandatory if the deck is attached to the house, exceeds 200 square feet in area, or is elevated more than 30 inches above the surrounding grade. Standalone freestanding platform decks under 30 inches in height and under 200 sq ft frequently qualify for permit exemptions. Permits typically cost $150 to $600.',
  },
  {
    q: 'How much do stairs and railing add to total deck cost?',
    a: 'Railing systems range from $30 to $50 per linear foot for pressure-treated wood, $80 to $165/LF for composite, $55 to $115/LF for powder-coated aluminum, and $75 to $160/LF for stainless steel cable. For an average 16×20 deck with 40 linear feet of exposed perimeter, railings add $1,200 to $4,500. A standard flight of 4 to 6 deck stairs adds $600 to $1,800 for stringers, treads, and handrails.',
  },
];

export default function DeckCostCalculatorPage() {
  const breadcrumbList = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools/' },
    { name: 'Deck Cost Calculator', path: route.path },
  ];

  const webAppSchema = buildWebApplicationSchema({
    path: route.path,
    name: 'Deck Cost Calculator & Estimator',
    description: route.description,
    applicationCategory: 'UtilitiesApplication',
  });

  const faqSchema = buildFaqSchema(FAQS);

  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={faqSchema} />

      <main className={styles.main}>
        <Breadcrumbs items={breadcrumbList} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Deck Cost Calculator &amp; Estimator</h1>
          <p className={styles.lead}>
            Estimate the complete cost to build, replace, or resurface an outdoor deck. Calculate
            detailed lumber framing, concrete footings, decking takeoff, railing systems, fasteners,
            and contractor labor side-by-side with DIY savings.
          </p>
          <div className={styles.meta}>
            Last updated: November 17, 2026 · Based on 2026 HomeGuide, Fixr, This Old House &amp; US BLS
            Carpenter wage data
          </div>
        </header>

        {/* BLUF Direct Answer Box */}
        <div className={styles.blufBox}>
          <strong>Direct Answer:</strong> A new residential deck typically costs between{' '}
          <strong>$25 and $55 per square foot installed</strong>. Standard pressure-treated wood decks
          average <strong>$15 to $35 per sq ft</strong>, while low-maintenance composite (such as
          Trex-style or TimberTech boards) and cellular PVC range from{' '}
          <strong>$35 to $75+ per sq ft</strong>. For a standard 16×20 ft (320 sq ft) deck, expect a
          total investment of <strong>$6,600 to $12,800 for wood</strong> or{' '}
          <strong>$10,800 to $20,600 for composite</strong>, with substructure framing, pier footings,
          railings, stairs, and professional carpenter labor included.
        </div>

        <AdSlot slotId="before-calculator" />

        <div className={styles.toolSection}>
          <DeckCostCalculator />
        </div>

        <AdSlot slotId="after-calculator" />

        {/* Long-Form In-Depth Editorial Content */}
        <article className={styles.article}>
          <h2>How to Use This Deck Cost Estimator</h2>
          <p>
            Unlike retailer or manufacturer calculators that restrict you to their own branded products or
            omit framing lumber entirely, this tool provides an <strong>unbiased, brand-neutral</strong> structural
            estimate. It accounts for all six major components of deck construction:
          </p>
          <ol>
            <li>
              <strong>Select your project scope:</strong> Choose between a brand new ground-up build, a
              cost-effective resurfacing (re-decking sound existing framing), a full tear-down and replacement,
              or targeted repairs.
            </li>
            <li>
              <strong>Enter deck dimensions and elevation:</strong> Enter length along the house wall and
              projection width. Choose your elevation band (ground level, 2–4 ft, 4–8 ft, or elevated second-story)
              to automatically scale structural post sizes, labor multipliers, and mandatory code guardrails.
            </li>
            <li>
              <strong>Choose your decking material and layout:</strong> Compare pressure-treated pine, western red
              cedar, redwood, uncapped composite, 4-sided capped composite, cellular PVC, or exotic ipe hardwood.
              Specify straight, diagonal (45°), or herringbone board patterns.
            </li>
            <li>
              <strong>Configure framing and frost depth:</strong> Adjust joist spacing (12&quot;, 16&quot;, or 24&quot;
              on-center) and footing depth to match your municipality&apos;s local winter frost line.
            </li>
            <li>
              <strong>Review the Bill of Materials (BOM) &amp; Contractor Verifier:</strong> Check our generated
              shopping list of joists, beams, posts, concrete bags, fasteners, and railing footage against any
              contractor bid to ensure fair pricing.
            </li>
          </ol>

          <h2>Deck Cost per Square Foot by Material</h2>
          <p>
            The decking surface material you select is the primary driver of both upfront investment and ongoing
            maintenance requirements. Below are the verified 2026 industry benchmark ranges for materials and
            labor per square foot:
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.proseTable}>
              <thead>
                <tr>
                  <th>Decking Material</th>
                  <th>Category</th>
                  <th>Materials Only</th>
                  <th>Installed Total</th>
                  <th>Expected Lifespan</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(DECK_MATERIALS) as (keyof typeof DECK_MATERIALS)[]).map((mKey) => {
                  const m = DECK_MATERIALS[mKey];
                  return (
                    <tr key={m.id}>
                      <td>
                        <strong>{m.label}</strong>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{m.category}</td>
                      <td>
                        ${m.materialCostPerSqFt.low.toFixed(2)} – ${m.materialCostPerSqFt.high.toFixed(2)} / sq ft
                      </td>
                      <td>
                        <strong>
                          ${(m.materialCostPerSqFt.low + m.laborCostPerSqFt.low).toFixed(2)} – $
                          {(m.materialCostPerSqFt.high + m.laborCostPerSqFt.high).toFixed(2)} / sq ft
                        </strong>
                      </td>
                      <td>{m.lifespanYears} Years</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <h2>How Much Does a Deck Cost? (Cost by Deck Size)</h2>
          <p>
            Deck size determines the number of structural post footings, multi-ply beam rows, and total square
            footage of boards required. The table below outlines typical installed costs across the six most popular
            residential deck dimensions with standard railings, steps, and hardware included:
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.proseTable}>
              <thead>
                <tr>
                  <th>Deck Dimensions</th>
                  <th>Square Footage</th>
                  <th>Pressure-Treated Pine</th>
                  <th>Western Red Cedar</th>
                  <th>Capped Composite</th>
                  <th>Cellular PVC</th>
                </tr>
              </thead>
              <tbody>
                {DECK_SIZE_BENCHMARKS.map((b) => (
                  <tr key={b.dimensions}>
                    <td>
                      <strong>{b.dimensions} ft</strong>
                    </td>
                    <td>{b.areaSqFt} sq ft</td>
                    <td>
                      ${b.ptPineCost.low.toLocaleString()} – ${b.ptPineCost.high.toLocaleString()}
                    </td>
                    <td>
                      ${b.cedarCost.low.toLocaleString()} – ${b.cedarCost.high.toLocaleString()}
                    </td>
                    <td>
                      ${b.compositeCost.low.toLocaleString()} – ${b.compositeCost.high.toLocaleString()}
                    </td>
                    <td>
                      ${b.pvcCost.low.toLocaleString()} – ${b.pvcCost.high.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Labor Cost to Build a Deck per Square Foot</h2>
          <p>
            Labor typically represents <strong>45% to 55%</strong> of the total cost on a professionally built
            deck. According to the US Bureau of Labor Statistics (BLS) Occupational Employment and Wage Statistics
            (SOC 47-2031), experienced construction carpenters command a national median wage of $28.50 per hour.
            When factoring in licensed general contractor overhead, worker&apos;s compensation insurance, employer taxes,
            and specialized decking equipment, contractor billing rates range from $65 to $110 per man-hour.
          </p>
          <p>
            On a per-square-foot basis, labor is influenced heavily by the deck&apos;s physical elevation above grade:
          </p>
          <ul>
            <li>
              <strong>Ground-Level Platform Decks (&lt;2 ft):</strong> $10 to $18 per sq ft. Carpenters work
              directly from the ground without safety harnesses, scaffolding, or complex stair stringers.
            </li>
            <li>
              <strong>Low-Elevation Decks (2–4 ft):</strong> $12 to $22 per sq ft. Standard height requiring 2 to 4
              concrete footings, joist hangers, and basic step construction.
            </li>
            <li>
              <strong>Mid-Elevation Decks (4–8 ft):</strong> $15 to $26 per sq ft. Requires 6×6 post bracing,
              sturdy diagonal knee braces, and taller safety guardrails.
            </li>
            <li>
              <strong>Elevated Second-Story Walkouts (8+ ft):</strong> $18 to $35 per sq ft. Requires specialized
              fall-protection harnesses, heavy lifting equipment for multi-ply carrier beams, and multi-landing
              staircases.
            </li>
          </ul>

          <h2>What Makes Up the Cost of a Deck?</h2>
          <p>
            A common misconception is that decking surface boards make up the bulk of a deck&apos;s price tag. In
            reality, a durable deck consists of five core cost categories:
          </p>
          <div className={styles.callout}>
            <h4>Standard Deck Budget Allocation:</h4>
            <ul>
              <li>
                <strong>Substructure &amp; Framing (30% – 40%):</strong> Pressure-treated ground-contact 2×8/2×10
                joists, doubled or tripled carrier beams, 6×6 support posts, metal joist hangers, tension ties, and
                flashing tape.
              </li>
              <li>
                <strong>Decking Surface Boards (20% – 35%):</strong> The visible walking surface boards (PT pine,
                cedar, composite, or PVC) along with hidden fasteners or color-matched face screws.
              </li>
              <li>
                <strong>Railing Systems (12% – 20%):</strong> Posts, post sleeves, top and bottom rails, and
                balusters (wood, aluminum, stainless steel cable, or tempered glass).
              </li>
              <li>
                <strong>Stairs &amp; Landings (5% – 12%):</strong> 2×12 treated stringers, stair treads, risers,
                and dedicated stair handrails.
              </li>
              <li>
                <strong>Footings, Site Prep &amp; Permits (5% – 10%):</strong> Sonotube cardboard forms, concrete
                mix bags, excavating below the local frost depth, weed barrier fabric, gravel beds, and municipal
                building permits.
              </li>
            </ul>
          </div>

          <h2>Pressure-Treated vs. Cedar vs. Composite vs. PVC</h2>
          <p>
            Choosing the best outdoor decking material involves balancing immediate construction budget against
            25-year lifecycle maintenance.
          </p>
          <h3>1. Pressure-Treated Southern Pine (Best Budget Choice)</h3>
          <p>
            Treated with chemical preservatives (such as micronized copper azole) to resist fungal decay and
            termites, pressure-treated pine is the most popular decking material in the United States. While
            affordable, it is prone to surface checking, warping, and splintering if not maintained. Expect to apply
            a protective stain and water repellent every 2 to 3 years. Use our companion{' '}
            <Link href="/deck-stain-calculator/">Deck Stain Calculator</Link> to budget ongoing wood maintenance.
          </p>

          <h3>2. Western Red Cedar &amp; Redwood (Best Natural Aesthetics)</h3>
          <p>
            Cedar and redwood contain natural tannins that resist decay without chemical treatment. They remain
            cooler underfoot in hot summers than synthetic plastics and offer rich wood grain. However, cedar is a
            softwood that dents easily from pet claws or high-heeled shoes, requiring annual washings and UV-inhibiting
            finishes to prevent weathering to a dull grey.
          </p>

          <h3>3. Capped Composite (Best Overall Value for Homeowners)</h3>
          <p>
            Engineered from a blend of recycled wood sawdust and polyethylene plastic, modern capped composite
            decking features an impermeable 3-sided or 4-sided polymer shell. It never requires sanding, staining, or
            painting, and top manufacturers back their boards with 25- to 30-year fade and stain warranties.
          </p>

          <h3>4. Capped Cellular PVC (Premium Moisture Resistance)</h3>
          <p>
            Unlike composite, cellular PVC contains zero organic wood fibers. It is 100% moisture-proof, making it
            the premier choice for swimming pool surrounds, hot tub pads, and coastal waterfront environments. PVC
            expands and contracts along its length during seasonal temperature swings, necessitating proper fastener
            spacing.
          </p>

          <h2>Deck Replacement vs. Resurfacing (Re-Decking)</h2>
          <p>
            If your deck has soft, splintered, or weathered surface boards, you may not need to demolish the entire
            substructure. Re-decking involves unfastening the old boards and railing while preserving the existing
            framing.
          </p>
          <p>
            <strong>Before deciding to resurface, perform this 4-point structural safety check:</strong>
          </p>
          <ol>
            <li>
              <strong>Joist Probe Test:</strong> Press an awl or flathead screwdriver into the top edges of the
              joists, especially around old screw holes. If the wood is soft, punky, or penetrates easily more than
              1/4 inch, the joists have rot and must be replaced.
            </li>
            <li>
              <strong>Ledger Connection:</strong> Inspect where the deck attaches to the house wall. Verify that it
              is secured with 1/2-inch structural lag screws or through-bolts with proper flashing, rather than
              unapproved smooth nails.
            </li>
            <li>
              <strong>Joist Spacing Compatibility:</strong> Standard wood decking often spans joists spaced 16 inches
              on-center. However, if you plan to upgrade to composite boards laid on a 45° diagonal, building codes
              require 12-inch on-center joist spacing. You may need to sister additional joists into the existing
              frame.
            </li>
            <li>
              <strong>Footing Stability:</strong> Ensure that concrete pier footings remain level without cracking or
              heaving from frost. Calculate required footing concrete using our{' '}
              <Link href="/concrete-calculator/">Concrete Calculator</Link>.
            </li>
          </ol>

          <h2>How Many Boards, Joists, and Screws Do You Need?</h2>
          <p>
            Accurate material takeoff prevents costly project delays and minimizes off-cut lumber waste:
          </p>
          <ul>
            <li>
              <strong>Decking Boards:</strong> A nominal 6-inch deck board measures 5.5 inches wide. When factoring
              in a 3/16-inch drainage gap, each board covers approximately 5.6875 inches (0.474 feet) of deck width.
              To calculate rows, divide the projection width by 0.474. For example, a 12-foot wide deck requires 26
              continuous rows of boards.
            </li>
            <li>
              <strong>Joists:</strong> Divide the deck length in inches by the joist spacing (16 inches) and add 1,
              then add 2 for the outer rim joists. A 16-foot (192-inch) deck requires (192 ÷ 16) + 1 + 2 = 15 joists.
              Calculate individual board and lumber lengths using our{' '}
              <Link href="/linear-foot-calculator/">Linear Foot Calculator</Link>.
            </li>
            <li>
              <strong>Fasteners:</strong> Face-screwed decks require two screws at every joist crossing. Hidden clip
              systems require one clip and screw per crossing. Multiply total board rows by the number of joists to
              determine total crossings.
            </li>
          </ul>

          <h2>How Much Gap Should You Leave Between Deck Boards?</h2>
          <p>
            Proper board spacing is essential for water drainage, airflow to prevent joist rot, and seasonal
            expansion:
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.proseTable}>
              <thead>
                <tr>
                  <th>Decking Material Condition</th>
                  <th>Recommended Side-to-Side Gap</th>
                  <th>End-to-End Butt Gap</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Wet / Fresh Pressure-Treated Pine</strong>
                  </td>
                  <td>1/16 in to 1/8 in (or hand tight; shrinks as it dries)</td>
                  <td>1/16 in</td>
                </tr>
                <tr>
                  <td>
                    <strong>Kiln-Dried Wood / Seasoned Cedar</strong>
                  </td>
                  <td>3/16 in to 1/4 in</td>
                  <td>1/8 in</td>
                </tr>
                <tr>
                  <td>
                    <strong>Composite Decking (Trex / TimberTech)</strong>
                  </td>
                  <td>3/16 in to 1/4 in (set by hidden clip spacers)</td>
                  <td>1/8 in to 3/16 in (thermal movement)</td>
                </tr>
                <tr>
                  <td>
                    <strong>Cellular PVC Decking</strong>
                  </td>
                  <td>1/8 in to 3/16 in</td>
                  <td>1/8 in (expansion along length)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Building Codes, Permits, and Guardrails (IRC Standards)</h2>
          <p>
            Deck safety is strictly regulated under the <strong>International Residential Code (IRC Section R312
            and Section R507)</strong>. Non-compliant decks represent one of the leading causes of outdoor home
            accidents. Keep these non-negotiable code rules in mind:
          </p>
          <ul>
            <li>
              <strong>30-Inch Guardrail Rule (IRC R312.1.1):</strong> Any deck walking surface situated more than 30
              inches above the adjacent grade must have safety guardrails at least 36 inches in height (42 inches in
              commercial jurisdictions).
            </li>
            <li>
              <strong>4-Inch Baluster Sphere Rule (IRC R312.1.3):</strong> Guardrail balusters, pickets, or cables
              must be spaced closely enough that a 4-inch sphere cannot pass through any opening, preventing small
              children from slipping through.
            </li>
            <li>
              <strong>Frost Depth Footings (IRC R507.3):</strong> Support posts cannot rest on loose topsoil. Pier
              footings must extend below your local frost line (often 36 to 48 inches deep in northern states) to
              prevent winter ground heave.
            </li>
            <li>
              <strong>Ledger Fastening (IRC R507.9):</strong> Ledger boards must be attached directly to the home&apos;s
              rim joist using 1/2-inch hot-dip galvanized lag screws or through-bolts staggered in an approved
              pattern. Nailing a ledger board to the house is prohibited by code.
            </li>
          </ul>

          {/* FAQ Accordion Section */}
          <section className={styles.faqSection}>
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {FAQS.map((faq, idx) => (
                <details key={`faq-${idx}`} className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>{faq.q}</summary>
                  <div className={styles.faqAnswer}>{faq.a}</div>
                </details>
              ))}
            </div>
          </section>

          {/* Sourced Methodology Component */}
          <HowWeCalculate slug="deck-cost-calculator" />

          {/* Inbound Related Tools Navigation */}
          <section className={styles.relatedSection}>
            <h2>Related Outdoor Construction Calculators</h2>
            <div className={styles.relatedGrid}>
              <Link href="/deck-stain-calculator/" className={styles.relatedCard}>
                <h4>Deck Stain Calculator</h4>
                <p>Calculate stain gallons, coats, and maintenance sealing costs for outdoor wood decks.</p>
              </Link>
              <Link href="/fence-cost-calculator/" className={styles.relatedCard}>
                <h4>Fence Cost Calculator</h4>
                <p>Estimate materials, posts, pickets, and labor for wood, vinyl, and chain link fencing.</p>
              </Link>
              <Link href="/concrete-calculator/" className={styles.relatedCard}>
                <h4>Concrete Calculator</h4>
                <p>Calculate cubic yards and QUIKRETE 80 lb bags for pier footings, pads, and slabs.</p>
              </Link>
              <Link href="/linear-foot-calculator/" className={styles.relatedCard}>
                <h4>Linear Foot Calculator</h4>
                <p>Convert area to linear feet and calculate board footage for joists and decking boards.</p>
              </Link>
              <Link href="/stud-calculator/" className={styles.relatedCard}>
                <h4>Stud &amp; Framing Calculator</h4>
                <p>Calculate wall studs, plates, and rough framing lumber requirements.</p>
              </Link>
              <Link href="/square-footage-calculator/" className={styles.relatedCard}>
                <h4>Square Footage Calculator</h4>
                <p>Calculate multi-room square footage and surface areas for outdoor projects.</p>
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
