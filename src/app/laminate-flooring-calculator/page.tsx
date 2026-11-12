import { Metadata } from 'next';
import Link from 'next/link';
import { LaminateCalculator } from '@/components/tool/laminate-calculator';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { SITE_NAME, SITE_URL } from '@/config/site';
import { LAMINATE_FAQS, RELATED_LAMINATE_TOOLS } from '@/content/pages/laminate-calculator';
import styles from './page.module.css';

// Title: 44 chars (with template | KKC Tools = 56 chars <= 60 chars)
// Meta Description: 143 chars (within 155 limit)
export const metadata: Metadata = buildMetadata({
  title: 'Laminate Flooring Calculator (Boxes & Cost)',
  description:
    'Free laminate flooring calculator: enter room size, waste % and box coverage to get boxes, underlayment rolls and total cost. Multi-room ready.',
  path: '/laminate-flooring-calculator/',
});

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Laminate Flooring Calculator',
    url: `${SITE_URL}/laminate-flooring-calculator/`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    description:
      'Calculate exact laminate flooring boxes, square footage with pattern waste, underlayment rolls, perimeter baseboard trims, and material costs.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Calculators',
        item: `${SITE_URL}/tools/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Laminate Flooring Calculator',
        item: `${SITE_URL}/laminate-flooring-calculator/`,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: LAMINATE_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  },
];

export default function LaminateFlooringCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main-content" className={styles.container}>
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <ol className={styles.breadcrumbList}>
            <li className={styles.breadcrumbItem}>
              <Link href="/">Home</Link>
            </li>
            <li className={styles.breadcrumbSeparator}>/</li>
            <li className={styles.breadcrumbItem}>
              <Link href="/tools/">Calculators</Link>
            </li>
            <li className={styles.breadcrumbSeparator}>/</li>
            <li className={`${styles.breadcrumbItem} ${styles.breadcrumbItemActive}`} aria-current="page">
              Laminate Flooring Calculator
            </li>
          </ol>
        </nav>

        {/* Hero Header */}
        <header className={styles.hero}>
          <span className={styles.badge}>Flooring Estimator</span>
          <h1 className={styles.title}>
            Laminate Flooring Calculator: How Many Boxes Do You Need?
          </h1>
          <p className={styles.subtitle} style={{ marginBottom: '16px' }}>
            Instantly calculate boxes, square footage, underlayment, and moldings needed for your room with our free <strong>laminate flooring calculator</strong>.
          </p>
        </header>

        {/* Interactive Tool Above the Fold */}
        <LaminateCalculator />

        {/* Top AdSlot */}
        <AdSlot slotId="laminate-calc-top" />

        {/* Comprehensive SEO Content & Reference Guide */}
        <article className={styles.content}>
          <p className={styles.dateVerified} style={{ marginTop: '16px', marginBottom: '8px' }}>
            Last updated: November 2026. Estimates based on typical US retail standards.
          </p>
          <div className={styles.intro} style={{ marginBottom: '28px' }}>
            <p>
              This free <strong>laminate flooring calculator</strong> instantly computes the exact number of cartons, gross square footage, underlayment rolls, and molding pieces you need to order for your next flooring installation. Whether you are re-flooring a single bedroom or taking off a multi-room open floor plan, ordering with precision ensures you finish without expensive dye-lot mismatches or heavy surplus boxes.
            </p>
            <p>
              Our comprehensive guide accounts for multi-room floor plans, pattern waste margins, underlayment rolls, transitions, and professional contractor benchmarks.
            </p>
          </div>

          {/* Section 2: Quick Answer */}
          <section>
            <h2>Quick answer: How much laminate flooring do I need?</h2>
            <p>
              To quickly find how many boxes of laminate flooring you need, locate your room dimensions or total square footage in the verified reference table below. All calculations assume standard cartons containing 20 square feet per box and a standard 10% straight-lay waste allowance:
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.comparisonTable}>
                <thead>
                  <tr>
                    <th>Room Dimensions</th>
                    <th>Net Surface Area</th>
                    <th>Gross Area (+10% Waste)</th>
                    <th>Boxes Needed (20 sq ft/box)</th>
                    <th>Total Sq Ft Purchased</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>10&apos; × 10&apos; Room</strong></td>
                    <td>100 sq ft</td>
                    <td>110.0 sq ft</td>
                    <td><strong>6 boxes</strong></td>
                    <td>120 sq ft</td>
                  </tr>
                  <tr>
                    <td><strong>10&apos; × 12&apos; Bedroom</strong></td>
                    <td>120 sq ft</td>
                    <td>132.0 sq ft</td>
                    <td><strong>7 boxes</strong></td>
                    <td>140 sq ft</td>
                  </tr>
                  <tr>
                    <td><strong>12&apos; × 12&apos; Bedroom</strong></td>
                    <td>144 sq ft</td>
                    <td>158.4 sq ft</td>
                    <td><strong>8 boxes</strong></td>
                    <td>160 sq ft</td>
                  </tr>
                  <tr>
                    <td><strong>12&apos; × 15&apos; Master Bed</strong></td>
                    <td>180 sq ft</td>
                    <td>198.0 sq ft</td>
                    <td><strong>10 boxes</strong></td>
                    <td>200 sq ft</td>
                  </tr>
                  <tr>
                    <td><strong>12&apos; × 16&apos; Living Area</strong></td>
                    <td>192 sq ft</td>
                    <td>211.2 sq ft</td>
                    <td><strong>11 boxes</strong></td>
                    <td>220 sq ft</td>
                  </tr>
                  <tr>
                    <td><strong>14&apos; × 16&apos; Family Room</strong></td>
                    <td>224 sq ft</td>
                    <td>246.4 sq ft</td>
                    <td><strong>13 boxes</strong></td>
                    <td>260 sq ft</td>
                  </tr>
                  <tr>
                    <td><strong>15&apos; × 20&apos; Great Room</strong></td>
                    <td>300 sq ft</td>
                    <td>330.0 sq ft</td>
                    <td><strong>17 boxes</strong></td>
                    <td>340 sq ft</td>
                  </tr>
                  <tr>
                    <td><strong>20&apos; × 20&apos; Open Plan</strong></td>
                    <td>400 sq ft</td>
                    <td>440.0 sq ft</td>
                    <td><strong>22 boxes</strong></td>
                    <td>440 sq ft</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p><strong>Quick Reference by Total Square Footage:</strong></p>
            <ul>
              <li><strong>100 sq ft:</strong> 6 boxes (120 sq ft purchased)</li>
              <li><strong>200 sq ft:</strong> 11 boxes (220 sq ft purchased)</li>
              <li><strong>300 sq ft:</strong> 17 boxes (340 sq ft purchased)</li>
              <li><strong>400 sq ft:</strong> 22 boxes (440 sq ft purchased)</li>
              <li><strong>500 sq ft:</strong> 28 boxes (560 sq ft purchased)</li>
              <li><strong>1,000 sq ft:</strong> 55 boxes (1,100 sq ft purchased)</li>
            </ul>
          </section>

          {/* Section 3: Step-by-Step Formula */}
          <section>
            <h2>How to Calculate Laminate Flooring (Step-by-Step Formula)</h2>
            <p>
              Calculating your order involves five straightforward mathematical steps using plain-text formulas:
            </p>

            <h3>Step 1: Measure Net Floor Area</h3>
            <p>
              Measure room length and width in feet. Multiply them together to find the surface square footage, and deduct any permanent architectural obstacles:
            </p>
            <div className={styles.formulaBox}>
              Net Area (sq ft) = [Length (ft) × Width (ft)] − Deducted Areas (sq ft)
            </div>

            <h3>Step 2: Add the Pattern Waste Factor</h3>
            <p>
              Planks must be trimmed at wall ends, doorways, and radiator pipes. Multiply net square footage by your pattern waste factor:
            </p>
            <div className={styles.formulaBox}>
              Gross Area (sq ft) = Net Area (sq ft) × (1 + Waste Percentage ÷ 100)
            </div>

            <h3>Step 3: Check Carton Packaging Yield</h3>
            <p>
              Cartons vary between 17 and 27 square feet. Divide gross area by the carton coverage, rounding up to the next whole number:
            </p>
            <div className={styles.formulaBox}>
              Boxes to Buy = RoundUp(Gross Area ÷ Carton Coverage)
            </div>

            <h3>Step 4: Calculate Purchased Square Footage &amp; Surplus</h3>
            <p>
              Multiply whole boxes by carton coverage. Subtract gross area to see your leftover attic stock:
            </p>
            <div className={styles.formulaBox}>
              Purchased Area = Boxes to Buy × Carton Coverage
              <br />
              Surplus Area = Purchased Area − Gross Area
            </div>

            <h3>Step 5: Determine Underlayment &amp; Perimeter Moldings</h3>
            <p>
              Underlayment rolls cover 100 net square feet (not needed if planks have attached acoustic pads). Perimeter baseboards or shoe molding cover room perimeters with a 10% cutting margin:
            </p>
            <div className={styles.formulaBox}>
              Underlayment Rolls = RoundUp(Net Area ÷ 100)
              <br />
              Molding Pieces (7.8 ft lengths) = RoundUp([Perimeter (ft) × 1.10] ÷ 7.8)
            </div>

            <p>
              <strong>Worked Example (18 ft × 14 ft Room):</strong> Net area = 18 × 14 = 252 sq ft. At 10% waste, gross area = 252 × 1.10 = 277.2 sq ft. With 20 sq ft per box, divide 277.2 by 20 = 13.86, rounded up to <strong>14 boxes</strong> (280 sq ft purchased, leaving 2.8 sq ft surplus). Underlayment requires RoundUp(252 ÷ 100) = <strong>3 rolls</strong>. Perimeter = 2 × (18 + 14) = 64 ft, requiring <strong>10 molding pieces</strong>.
            </p>
          </section>

          {/* Section 4: How Many Boxes Do I Need */}
          <section>
            <h2>How Many Boxes of Laminate Flooring Do I Need?</h2>
            <p>
              Laminate planks are packaged in rigid cardboard cartons. You can never purchase a fraction of a box. Even if your calculation requires 10.1 boxes, retailers require purchasing 11 full cartons.
            </p>
            <p>
              <strong>The Importance of Dye Lots and Attic Stock:</strong> Manufacturers produce laminate flooring in designated factory batches with distinct dye lots. If you run out of flooring two rows from your far wall, buying an additional box weeks later frequently leads to subtle color, sheen, or locking groove variations. We strongly recommend purchasing one extra carton beyond your minimum calculation to store in an attic or closet for future water leak repairs or board replacements.
            </p>
          </section>

          {/* Section 5: Waste Factor */}
          <section>
            <h2>Laminate Flooring Waste Factor: How Much Extra to Buy</h2>
            <p>
              Your layout pattern and room architecture dictate your waste factor. While published trade guidelines recommend 5% to 10% for simple straight rows and 15% to 20% for herringbone, our calculator defaults to a dependable 10% margin:
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.comparisonTable}>
                <thead>
                  <tr>
                    <th>Installation Pattern</th>
                    <th>Recommended Waste %</th>
                    <th>Why This Allowance Is Necessary</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Straight Lay (Parallel)</strong></td>
                    <td>10%</td>
                    <td>Planks run parallel to longest wall; cutoffs from row ends start subsequent rows.</td>
                  </tr>
                  <tr>
                    <td><strong>Complex Room / Multi-Door</strong></td>
                    <td>12%</td>
                    <td>Rooms with closets, bay windows, stair landings, and multiple room transitions.</td>
                  </tr>
                  <tr>
                    <td><strong>Diagonal 45° Angle</strong></td>
                    <td>15%</td>
                    <td>Every perimeter plank requires a 45-degree angle cut, generating triangular cutoff scrap.</td>
                  </tr>
                  <tr>
                    <td><strong>Herringbone &amp; Chevron</strong></td>
                    <td>20%</td>
                    <td>Complex interlocking 90° angles with directional grooves; end offcuts cannot be inverted.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Inline SVG Diagram */}
            <div className={styles.diagramContainer}>
              <svg
                className={styles.diagramSvg}
                width="640"
                height="140"
                viewBox="0 0 640 140"
                role="img"
                aria-label="laminate flooring layout patterns: straight lay 10% waste, diagonal 45 degree 15% waste, and herringbone 20% waste"
              >
                <rect width="640" height="140" fill="#f8fafc" rx="8" />
                {/* Straight Lay */}
                <g transform="translate(20, 20)">
                  <rect width="180" height="80" fill="#e2e8f0" stroke="#94a3b8" />
                  <rect x="0" y="0" width="90" height="20" fill="#cbd5e1" stroke="#64748b" />
                  <rect x="90" y="0" width="90" height="20" fill="#cbd5e1" stroke="#64748b" />
                  <rect x="0" y="20" width="60" height="20" fill="#cbd5e1" stroke="#64748b" />
                  <rect x="60" y="20" width="90" height="20" fill="#cbd5e1" stroke="#64748b" />
                  <rect x="150" y="20" width="30" height="20" fill="#cbd5e1" stroke="#64748b" />
                  <rect x="0" y="40" width="100" height="20" fill="#cbd5e1" stroke="#64748b" />
                  <rect x="100" y="40" width="80" height="20" fill="#cbd5e1" stroke="#64748b" />
                  <rect x="0" y="60" width="70" height="20" fill="#cbd5e1" stroke="#64748b" />
                  <rect x="70" y="60" width="90" height="20" fill="#cbd5e1" stroke="#64748b" />
                  <text x="90" y="105" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a">
                    Straight Lay (10% Waste)
                  </text>
                </g>
                {/* Diagonal Lay */}
                <g transform="translate(230, 20)">
                  <rect width="180" height="80" fill="#e2e8f0" stroke="#94a3b8" />
                  <line x1="20" y1="80" x2="100" y2="0" stroke="#0284c7" strokeWidth="6" />
                  <line x1="60" y1="80" x2="140" y2="0" stroke="#0284c7" strokeWidth="6" />
                  <line x1="100" y1="80" x2="180" y2="0" stroke="#0284c7" strokeWidth="6" />
                  <line x1="0" y1="60" x2="60" y2="0" stroke="#0284c7" strokeWidth="6" />
                  <text x="90" y="105" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a">
                    Diagonal 45° (15% Waste)
                  </text>
                </g>
                {/* Herringbone */}
                <g transform="translate(440, 20)">
                  <rect width="180" height="80" fill="#e2e8f0" stroke="#94a3b8" />
                  <path d="M20 20 L50 50 L80 20 L110 50 L140 20" stroke="#047857" strokeWidth="4" fill="none" />
                  <path d="M20 50 L50 80 L80 50 L110 80 L140 50" stroke="#047857" strokeWidth="4" fill="none" />
                  <text x="90" y="105" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a">
                    Herringbone (20% Waste)
                  </text>
                </g>
              </svg>
            </div>
          </section>

          {/* Section 6: Plank Sizes & Coverage */}
          <section>
            <h2>Laminate Plank Sizes &amp; Box Coverage</h2>
            <p>
              A common misconception among homeowners is that carton coverage depends on plank thickness (7mm, 8mm, 10mm, or 12mm). In reality, <strong>box coverage is strictly determined by plank face width, plank length, and the count of pieces packaged per box</strong>.
            </p>
            <p>
              Standard planks range from 5 to 8 inches in width (with 7.5&quot; being very common) and 47 to 54 inches in length. Retail cartons typically cover between 17 and 27 square feet:
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.comparisonTable}>
                <thead>
                  <tr>
                    <th>Plank Category</th>
                    <th>Nominal Width × Length</th>
                    <th>Planks per Box</th>
                    <th>Typical Box Coverage</th>
                    <th>Typical Application</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Standard Narrow</strong></td>
                    <td>5.25&quot; × 47.25&quot;</td>
                    <td>10 planks</td>
                    <td>17.18 sq ft</td>
                    <td>Compact bedrooms, formal dining rooms</td>
                  </tr>
                  <tr>
                    <td><strong>Waterproof Laminate</strong></td>
                    <td>6.00&quot; × 47.25&quot;</td>
                    <td>9 planks</td>
                    <td>18.14 sq ft</td>
                    <td>Water-resistant bathroom and entryway floors</td>
                  </tr>
                  <tr>
                    <td><strong>Classic Residential</strong></td>
                    <td>7.00&quot; × 48.00&quot;</td>
                    <td>8–10 planks</td>
                    <td>19.63 – 23.91 sq ft</td>
                    <td>Standard residential living rooms and basements</td>
                  </tr>
                  <tr>
                    <td><strong>Modern Wide Plank</strong></td>
                    <td>7.50&quot; × 47.25&quot;</td>
                    <td>9 planks</td>
                    <td>22.09 – 22.15 sq ft</td>
                    <td>Contemporary open-concept homes and great rooms</td>
                  </tr>
                  <tr>
                    <td><strong>Wide Board Format</strong></td>
                    <td>8.00&quot; × 48.00&quot;</td>
                    <td>8 planks</td>
                    <td>21.26 – 23.91 sq ft</td>
                    <td>Suburban main-level residential renovations</td>
                  </tr>
                  <tr>
                    <td><strong>Long Plank Format</strong></td>
                    <td>7.00&quot; × 50.00&quot;</td>
                    <td>11 planks</td>
                    <td>26.80 sq ft</td>
                    <td>Large open halls and continuous open layouts</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              <em>Always verify the exact &quot;Sq. Ft. per Carton&quot; printed on the packaging label of your purchased flooring.</em>
            </p>
          </section>

          {/* Section 7: Square Footage Net vs Gross */}
          <section>
            <h2>Laminate Flooring Square Footage Calculator: Net vs Gross Area</h2>
            <p>
              When planning a laminate flooring renovation, understanding the distinction between net floor area and gross order area saves money and prevents waste:
            </p>
            <ul>
              <li>
                <strong>Net Surface Area:</strong> The actual walkable square footage of the room where planks will be laid. If your living room contains a built-in entertainment center, fireplace hearth, or permanent kitchen island, subtract those sections from your total.
              </li>
              <li>
                <strong>Gross Area:</strong> The total square footage you must purchase, which includes the additional 10% to 20% waste allowance to cover angle cuts, perimeter trim, and shipping chips.
              </li>
            </ul>
            <p>
              For measuring complex multi-room spaces, irregular L-shapes, or calculating room square footage before shopping, check our dedicated <Link href="/square-footage-calculator/">Square Footage Calculator</Link>.
            </p>
          </section>

          {/* Section 8: Underlayment */}
          <section>
            <h2>Underlayment for Laminate Flooring</h2>
            <p>
              Underlayment provides sound dampening, thermal insulation, and smoothing over minor subfloor imperfections. Standard retail underlayment rolls cover approximately 100 square feet.
            </p>
            <p>
              <strong>Pre-Attached Pad Planks:</strong> Many contemporary laminate products include an attached foam backing pad. If your planks have an attached pad, do not install a separate foam underlayment. Adding a second layer of foam creates excessive vertical deflection under foot, which can snap the tongue-and-groove click joints and void your warranty.
            </p>
            <p>
              <strong>Concrete Subfloors:</strong> When installing over concrete slabs or unconditioned basements, moisture vapor from the slab will damage laminate cores. In these installations, a 6-mil polyethylene vapor barrier is mandatory, regardless of whether your planks have an attached foam pad.
            </p>
          </section>

          {/* Section 9: Installation Cost DIY vs Pro */}
          <section>
            <h2>Laminate Flooring Installation Cost: DIY vs Professional</h2>
            <p>
              Laminate flooring remains one of the most budget-friendly flooring upgrades in North America. In 2026 pricing benchmarks, turnkey installed projects typically range from $3.00 to $12.00 per square foot:
            </p>
            <ul>
              <li>
                <strong>Laminate Flooring Material:</strong> $1.00 to $4.00 per square foot depending on brand, AC abrasion rating (AC3 for bedrooms up to AC5 for commercial), and water resistance.
              </li>
              <li>
                <strong>Underlayment &amp; Vapor Barrier:</strong> $0.35 to $0.65 per square foot (approx. $40 per 100 sq ft roll).
              </li>
              <li>
                <strong>Transitions &amp; Moldings:</strong> Approximately $1.50 per linear foot ($30 to $80 per room for quarter-round and T-moldings).
              </li>
              <li>
                <strong>Professional Installation Labor:</strong> Mid-range contractor labor typically ranges from $2.00 to $5.00 per square foot for straightforward rectangular installations (full national ranges span $1.50 to $8.00/sq ft for complex layouts with furniture moving and old carpet removal).
              </li>
            </ul>

            <h3>Laminate floor cost calculator: how we estimate your budget</h3>
            <p>
              Our cost engine calculates materials based on full cartons bought (never partial cartons) and applies your local unit prices. For a standard 18 × 14 ft room (252 net sq ft): 14 boxes at $38/box = $532, 3 rolls of underlayment at $40/roll = $120, and $45 for perimeter trim give a total DIY materials cost of <strong>$697.00</strong>. Professional installation for the same room benchmarks at <strong>$504.00 to $1,260.00</strong> in labor fees alone, illustrating that DIYers save the entire contractor labor charge.
            </p>
          </section>

          {/* Section 10: Installation Tips */}
          <section>
            <h2>5 Essential Laminate Flooring Installation Tips</h2>
            <ol>
              <li>
                <strong>Acclimate the Cartons:</strong> Store sealed cartons flat in the climate-controlled installation room for a minimum of 48 hours prior to unboxing so planks adapt to indoor humidity.
              </li>
              <li>
                <strong>Maintain the Expansion Gap:</strong> Always insert 3/8-inch spacers along every wall, pipe, and cabinet perimeter. Without an expansion gap, seasonal swelling will cause floors to buckle and tent.
              </li>
              <li>
                <strong>Ensure Subfloor Flatness:</strong> Subfloors must be flat within 3/16 inch across a 10-foot radius. Grind down high spots on concrete or sand plywood seams before laying planks.
              </li>
              <li>
                <strong>Stagger End Joints:</strong> Always maintain a minimum of 8 to 12 inches between end joints in adjacent rows to ensure optimal structural locking strength.
              </li>
              <li>
                <strong>Use T-Moldings on Long Runs:</strong> Continuous runs exceeding 30 to 40 feet require transition T-moldings at doorways to relieve internal expansion pressure.
              </li>
            </ol>
          </section>

          {/* Section 11: Methodology */}
          <div className={styles.methodologyCard}>
            <h3>How We Calculate: Accurate Flooring Computation</h3>
            <p>
              Our calculation engine executes verified flooring computation algorithms using single-rounding floating-point guards. Unlike naive web calculators that double-round intermediate steps, our engine calculates net square footage, applies layout waste, and rounds to whole cartons using an epsilon guard (1e-9) to eliminate float distortion. All professional benchmarks are verified against 2026 US remodeling industry guides.
            </p>
          </div>

          {/* Section 12: FAQ */}
          <section className={styles.faqSection}>
            <h2>Frequently Asked Questions (FAQ)</h2>
            {LAMINATE_FAQS.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{faq.q}</h3>
                <p className={styles.faqAnswer}>{faq.a}</p>
              </div>
            ))}
          </section>

          {/* Section 13: Related Tools */}
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>Related Home Renovation Calculators</h2>
            <div className={styles.relatedGrid}>
              {RELATED_LAMINATE_TOOLS.map((tool, idx) => (
                <Link key={idx} href={tool.href} className={styles.relatedCard}>
                  <div className={styles.relatedName}>{tool.label}</div>
                  <div className={styles.relatedDesc}>{tool.description}</div>
                </Link>
              ))}
            </div>
          </section>

          {/* Section 14: Closing Note */}
          <div className={styles.closingNote}>
            <p>
              Ready to begin your project? Return to the interactive <a href="#laminate-calc-app">laminate flooring calculator</a> above to calculate your carton quantities and shopping list. For surrounding trim, baseboards, and quarter-round molding, use our <Link href="/linear-foot-calculator/">Linear Foot Calculator</Link>. For tiling wet zones like bathrooms and laundry rooms, visit our <Link href="/tile-calculator/">Tile Calculator</Link>, or plan entire project budgets with our <Link href="/construction-estimate-template/">Construction Estimate Template</Link>.
            </p>
          </div>
        </article>

        {/* Bottom AdSlot */}
        <AdSlot slotId="laminate-calc-bottom" />
      </main>
    </>
  );
}
