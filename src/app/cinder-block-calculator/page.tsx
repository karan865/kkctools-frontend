import { Metadata } from 'next';
import Link from 'next/link';
import CinderBlockCalculator from '@/components/tool/cinder-block-calculator/CinderBlockCalculator';
import Faq from '@/components/ui/Faq';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { SITE_NAME, SITE_URL } from '@/config/site';
import {
  CINDER_BLOCK_FAQS,
  RELATED_MASONRY_TOOLS,
} from '@/content/pages/cinder-block-calculator';
import styles from './page.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Cinder Block Calculator – CMU & Concrete Block',
  description:
    'Free cinder block calculator to estimate CMU concrete blocks, mortar bags, core fill grout, and delivery weight for any wall, foundation, or retaining wall.',
  path: '/cinder-block-calculator/',
});

// Reference CMU Sizes Chart data
const CMU_SIZE_CHART = [
  { nominal: '4" × 8" × 16"', actual: '3-5/8" × 7-5/8" × 15-5/8"', weight: '25 lbs', coreVol: '0.06 cu ft', use: 'Interior partition walls, non-loadbearing veneer, curtain walls' },
  { nominal: '6" × 8" × 16"', actual: '5-5/8" × 7-5/8" × 15-5/8"', weight: '32 lbs', coreVol: '0.17 cu ft', use: 'Garage stem walls, residential crawlspaces, landscape planters' },
  { nominal: '8" × 8" × 16"', actual: '7-5/8" × 7-5/8" × 15-5/8"', weight: '36 lbs', coreVol: '0.27 cu ft', use: 'Standard home foundations, structural walls, security fences, retaining walls' },
  { nominal: '10" × 8" × 16"', actual: '9-5/8" × 7-5/8" × 15-5/8"', weight: '46 lbs', coreVol: '0.38 cu ft', use: 'Deep basement walls, heavy earth-retention structures, commercial load walls' },
  { nominal: '12" × 8" × 16"', actual: '11-5/8" × 7-5/8" × 15-5/8"', weight: '55 lbs', coreVol: '0.48 cu ft', use: 'Multi-story commercial foundations, shear walls, industrial storage bays' },
];

export default function CinderBlockCalculatorPage() {
  const canonicalUrl = `${SITE_URL}/cinder-block-calculator/`;

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Cinder Block Calculator',
    url: canonicalUrl,
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
      'Free online cinder block calculator and CMU estimator for wall dimensions, mortar bags, concrete core fill, delivery weight, and material budgeting.',
  };

  const breadcrumbSchema = {
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
        name: 'Cinder Block Calculator',
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: CINDER_BLOCK_FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  const liveRelatedTools = RELATED_MASONRY_TOOLS.filter((t) => t.live);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main id="main-content" className={styles.container}>
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
          <ol className={styles.breadcrumbList}>
            <li className={styles.breadcrumbItem}>
              <Link href="/">Home</Link>
            </li>
            <li className={styles.breadcrumbSeparator} aria-hidden="true">
              ›
            </li>
            <li className={styles.breadcrumbItem}>
              <Link href="/tools/">Calculators</Link>
            </li>
            <li className={styles.breadcrumbSeparator} aria-hidden="true">
              ›
            </li>
            <li className={`${styles.breadcrumbItem} ${styles.breadcrumbItemActive}`} aria-current="page">
              Concrete Block Calculator
            </li>
          </ol>
        </nav>

        {/* Section 1: H1 + Intro + Calculator Card */}
        <header className={styles.hero}>
          <div className={styles.badge}>Masonry &amp; Structural Estimator</div>
          <h1 className={styles.title}>Cinder Block Calculator – Concrete Block (CMU) Estimator</h1>
          <p className={styles.description}>
            Use this comprehensive <strong>cinder block calculator</strong> to quickly estimate how many concrete masonry units, mortar bags, and core fill grout you need for your construction project. Our free <strong>concrete block calculator</strong> accounts for multi-wall layouts, door and window deductions, cutting waste, and job site delivery weight.
          </p>
          <p className={styles.secondaryDescription}>
            Often searched interchangeably as a <strong>cement block calculator</strong>, this tool handles all standard ASTM C90 concrete masonry units—whether your project calls for standard 8x8x16 blocks, 4-inch partition units, or heavy 10-inch and 12-inch commercial blocks.
          </p>
        </header>

        {/* Interactive Calculator Component */}
        <section aria-label="Cinder Block Calculator Tool">
          <CinderBlockCalculator />
        </section>

        {/* Ad Slot 1: Below Calculator Results */}
        <AdSlot slotId="cinder-calc-top" />

        <div className={styles.contentWrapper}>
          {/* Section 2: How to Use the Cinder Block Calculator */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>How to Use the Cinder Block Calculator</h2>
            <p className={styles.paragraph}>
              Our free <strong>cmu block calculator</strong> is engineered to eliminate guesswork when ordering masonry supplies. Follow these straightforward steps to generate an itemized materials takeoff:
            </p>
            <ol className={styles.orderedList}>
              <li className={styles.listItem}>
                <strong>Input Wall Dimensions in the Cinder Blocks Calculator:</strong> Add each wall section separately. For each wall, enter the length in feet and either the height in feet or the target number of courses (horizontal block rows). For multi-wall perimeters (such as four sides of a workshop or garage), click <strong>+ Add Another Wall Row</strong> rather than manually averaging different wall heights.
              </li>
              <li className={styles.listItem}>
                <strong>Subtract Openings (Doors &amp; Windows):</strong> If your walls contain overhead garage doors, entry doors, or windows, add them under the deductions section. Our engine subtracts the exact square footage of openings from gross wall area so you never overpay for unlaid blocks.
              </li>
              <li className={styles.listItem}>
                <strong>Select CMU Block Dimensions:</strong> The industry standard is 8&quot; × 8&quot; × 16&quot; Standard CMU. If you are building a non-structural 4&quot; veneer or a heavy 10&quot; or 12&quot; foundation, select the appropriate nominal size or enter custom actual dimensions.
              </li>
              <li className={styles.listItem}>
                <strong>Set Mortar Joint Thickness &amp; Type:</strong> Select standard 3/8-inch joints (which yields 1.125 blocks per sq ft) or 1/2-inch joints (yielding 1.099 blocks per sq ft). Choose between convenient pre-blended mortar mix (sand included) or pure masonry cement (where you provide the sand).
              </li>
              <li className={styles.listItem}>
                <strong>Choose a Waste Allowance:</strong> Professional masons recommend a 10% waste buffer for standard straight walls to cover edge cuts, corner half-blocks, and transit chipping. For retaining walls with stepped footings or frequent pilasters, select 15%.
              </li>
              <li className={styles.listItem}>
                <strong>Configure Optional Core Fill Grouting:</strong> Expand the core fill section if your building plans require concrete grout inside hollow block cells (solid fill, 32&quot; on-center rebar, or 48&quot; on-center rebar) plus any bond beam rows.
              </li>
              <li className={styles.listItem}>
                <strong>Review Takeoff &amp; Pallet Logistics:</strong> Check your total blocks to order, 80 lb mortar bags, concrete core volume (cubic yards), total freight weight (lbs and tons), and pallet count. Click <strong>Copy Summary</strong> or <strong>Print</strong> for your materials supplier.
              </li>
            </ol>
          </section>

          {/* Section 3: Concrete Block vs Cinder Block: What's the Difference? */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Concrete Block vs Cinder Block: What&apos;s the Difference?</h2>
            <p className={styles.paragraph}>
              While the terms &ldquo;cinder block,&rdquo; &ldquo;concrete block,&rdquo; and &ldquo;cement block&rdquo; are commonly used interchangeably by homeowners and DIY builders today, they originally described very different building materials. Historically, genuine cinder blocks were produced using industrial coal cinders, ash, and water mixed with Portland cement. This made them lightweight, relatively inexpensive, and easy to handle, but also porous, brittle, and incapable of carrying heavy structural or earth-retaining loads.
            </p>
            <p className={styles.paragraph}>
              In modern residential and commercial construction, true cinder blocks have been entirely replaced by <strong>Concrete Masonry Units (CMUs)</strong>. Modern CMUs are manufactured using Portland cement, finely graded sand, and crushed gravel or stone aggregates, compressed under high pressure and steam-cured. CMUs adhere to strict structural standards (such as ASTM C90 in the United States), delivering compressive strengths of 1,900 to 3,000+ PSI. When people search for a cinder block calculator today, they are planning a project with modern, load-bearing CMU concrete blocks.
            </p>
          </section>

          {/* Section 4: Standard Cinder Block Dimensions & CMU Sizes Chart */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Standard Cinder Block Dimensions &amp; CMU Sizes Chart</h2>
            <p className={styles.paragraph}>
              In North America, concrete masonry units are categorized by their <strong>nominal dimensions</strong> (Width × Height × Length). The nominal size includes the physical block plus the standard 3/8-inch (0.375&quot;) mortar joint. Below is the standard size chart with typical dry weights and hollow core volumes:
            </p>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Nominal Size (W × H × L)</th>
                    <th>Actual Block Size (Inches)</th>
                    <th>Typical Concrete Block Weight</th>
                    <th>Core Volume (cu ft)</th>
                    <th>Common Construction Applications</th>
                  </tr>
                </thead>
                <tbody>
                  {CMU_SIZE_CHART.map((c, i) => (
                    <tr key={i}>
                      <td><strong>{c.nominal}</strong></td>
                      <td>{c.actual}</td>
                      <td><strong>{c.weight}</strong></td>
                      <td>{c.coreVol}</td>
                      <td>{c.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subHeading}>Concrete Block Dimensions: Nominal vs Actual Size</h3>
              <p className={styles.paragraph}>
                Why are actual block dimensions 3/8-inch smaller than their advertised names? Concrete masonry is designed around an 8-inch modular grid. A standard <code>8&quot; × 8&quot; × 16&quot;</code> block actually measures <code>7-5/8&quot; × 7-5/8&quot; × 15-5/8&quot;</code> (7.625&quot; × 7.625&quot; × 15.625&quot;). When laid with a standard 3/8-inch mortar joint along both the horizontal bed joint and the vertical head joint, the installed unit occupies exactly 8 inches in height and 16 inches in length along the wall elevation.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subHeading}>Specialized CMU Shapes &amp; Fittings</h3>
              <p className={styles.paragraph}>
                In addition to standard stretcher units (the two-core blocks that form the field of the wall), masonry projects utilize specialized shapes:
              </p>
              <ul className={styles.unorderedList}>
                <li className={styles.listItem}><strong>Half Blocks (8&quot; × 8&quot; × 8&quot;):</strong> Square half-units used at wall ends, window jambs, and door frames to maintain a running bond without job site cutting.</li>
                <li className={styles.listItem}><strong>Corner &amp; Bullnose Blocks:</strong> Feature flat or rounded finished ends where the wall terminates without an interlocking perpendicular wall.</li>
                <li className={styles.listItem}><strong>Bond Beam Blocks:</strong> Manufactured with open or knockout web channels to allow continuous horizontal rebar and grout encapsulation across the top of a wall.</li>
                <li className={styles.listItem}><strong>Lintel Blocks:</strong> U-shaped blocks placed over door and window headers to form reinforced structural concrete lintels.</li>
                <li className={styles.listItem}><strong>Solid Cap Blocks:</strong> Thin solid blocks (typically 2&quot; or 4&quot; thick by 8&quot; wide by 16&quot; long) placed across the top course to seal hollow cores from rain and pests.</li>
              </ul>
            </div>
          </section>

          {/* Section 5: How to Calculate Blocks for a Wall (Step-by-Step) */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>How to Calculate Blocks for a Wall (Step-by-Step)</h2>
            <p className={styles.paragraph}>
              Contractors and estimators calculate wall masonry materials using a disciplined three-step surface area method:
            </p>

            <div className={styles.subsection}>
              <h3 className={styles.subHeading}>Step 1: Calculate Net Wall Square Footage</h3>
              <p className={styles.paragraph}>
                Multiply total wall length by wall height in feet to determine gross surface area. Next, calculate the surface area of all openings (doors, windows, garage doors) and subtract them:
              </p>
              <div className={styles.formulaBox}>
                <code>Net Wall Area (sq ft) = Gross Wall Area − Total Openings Area</code>
              </div>
              <p className={styles.paragraph}>
                <em>Multi-Wall Note:</em> When estimating perimeter walls with varying rooflines, stepped foundations, or gable ends, calculate each wall row independently in our calculator to ensure precise course counts.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subHeading}>Step 2: Determine Block Coverage Rate</h3>
              <p className={styles.paragraph}>
                Each modular block face (including joint) covers <code>16 in × 8 in = 128 square inches</code>. Dividing by 144 square inches per square foot gives <code>128 ÷ 144 = 0.8889 sq ft per block</code>. Taking the reciprocal gives the coverage factor:
              </p>
              <div className={styles.formulaBox}>
                <code>Blocks per Sq Ft = 1 ÷ 0.888889 = 1.125 blocks / sq ft (with 3/8&quot; joint)</code>
              </div>
              <p className={styles.paragraph}>
                <em>Heavy Joint Note:</em> If your project specifies a thicker 1/2-inch mortar joint (e.g. for exterior architectural rustic bricking or masonry alignment), each unit occupies <code>16.125 in × 8.125 in = 131.02 sq in</code>, resulting in <strong>1.0991 blocks per square foot</strong>.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subHeading}>Step 3: Add Waste &amp; Order Quantity</h3>
              <p className={styles.paragraph}>
                Never order exact net block counts. Offcuts at window jambs, corner terminations, and transit breakage require an extra allowance:
              </p>
              <div className={styles.formulaBox}>
                <code>Total Blocks to Order = CEIL(Net Blocks × (1 + Waste % ÷ 100))</code>
              </div>
              <p className={styles.paragraph}>
                Always use a 10% waste buffer for straight walls, or 15% for complex stepped layouts.
              </p>
            </div>
          </section>

          {/* Section 6: Practical Worked Example: Building a 30 ft × 8 ft Garage Wall */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Practical Worked Example: Building a 30 ft × 8 ft Garage Wall</h2>
            <p className={styles.paragraph}>
              Suppose you are building a freestanding concrete block garage wall that is 30 feet long and 8 feet high, built with standard 8x8x16 CMU and 3/8-inch joints. The wall features one 3 ft × 7 ft entry door and one 4 ft × 3 ft window:
            </p>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Takeoff Parameter</th>
                    <th>Calculation &amp; Formula</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Gross Wall Area</strong></td>
                    <td>30 ft length × 8 ft height</td>
                    <td>240.00 sq ft</td>
                  </tr>
                  <tr>
                    <td><strong>Door Deduction (3×7 ft)</strong></td>
                    <td>3 ft × 7 ft × 1 opening</td>
                    <td>21.00 sq ft</td>
                  </tr>
                  <tr>
                    <td><strong>Window Deduction (4×3 ft)</strong></td>
                    <td>4 ft × 3 ft × 1 opening</td>
                    <td>12.00 sq ft</td>
                  </tr>
                  <tr className={styles.highlightRow}>
                    <td><strong>Net Wall Area</strong></td>
                    <td>240 sq ft − (21 + 12 sq ft)</td>
                    <td><strong>207.00 sq ft</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Net Blocks Required</strong></td>
                    <td>207 sq ft × 1.125 blocks/sq ft</td>
                    <td>232.88 blocks</td>
                  </tr>
                  <tr className={styles.highlightRow}>
                    <td><strong>Total Blocks to Order (+10% Waste)</strong></td>
                    <td>CEIL(232.88 × 1.10) = CEIL(256.16)</td>
                    <td><strong>257 blocks</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Pre-Blended Mortar Mix (80 lb)</strong></td>
                    <td>CEIL(257 ÷ 13 blocks per bag)</td>
                    <td><strong>20 bags</strong> (or 8 bags masonry cement + sand)</td>
                  </tr>
                  <tr>
                    <td><strong>Estimated Freight Weight</strong></td>
                    <td>257 blocks × 36 lbs</td>
                    <td><strong>9,252 lbs (4.63 tons)</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Estimated Pallet Count</strong></td>
                    <td>CEIL(257 ÷ 90 blocks per pallet)</td>
                    <td><strong>3 pallets</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Estimated Block Cost ($2.25/unit)</strong></td>
                    <td>257 blocks × $2.25</td>
                    <td><strong>$578.25</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.paragraph}>
              <em>Optional Core Fill Note:</em> If local codes require this 30×8 wall to be fully solid-grouted, the net core volume equals <code>232.88 blocks × 0.27 cu ft = 62.88 cu ft ≈ 2.33 cu yd</code>. With a 10% grout waste allowance, you would order <strong>2.56 cubic yards</strong> of ready-mix concrete.
            </p>
          </section>

          {/* Section 7: How Much Mortar for Cinder Blocks? */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>How Much Mortar for Cinder Blocks?</h2>
            <p className={styles.paragraph}>
              Estimating mortar correctly is essential to avoid job site delays. Mortar consumption depends heavily on whether you choose bagged pre-blended mix or mix raw masonry cement with bulk sand:
            </p>
            <ul className={styles.unorderedList}>
              <li className={styles.listItem}>
                <strong>Pre-Blended Mortar Mix (Sand Included):</strong> Pre-blended bags (such as Quikrete or Sakrete Mortar Mix) already contain the proper ratio of Portland cement, hydrated lime, and masonry sand. An <strong>80 lb bag yields approximately 13 standard 8-inch blocks</strong> (face-shell bedding with 3/8&quot; joints). A 60 lb bag yields approximately 9.75 blocks. For 100 blocks, order about 8 bags of 80 lb pre-blended mix.
              </li>
              <li className={styles.listItem}>
                <strong>Masonry Cement (Job Site Sand Mix):</strong> Pure masonry cement (Type N or Type S) contains only cement and plasticizers. You must mix it with clean masonry sand on site at a ratio of approximately 1 bag of cement to 2.25–3.0 cubic feet of sand. One <strong>80 lb bag of masonry cement yields approximately 35 standard blocks</strong>. For 100 blocks, you need approximately 3 bags of masonry cement plus about 0.35 tons of sand.
              </li>
              <li className={styles.listItem}>
                <strong>Mortar Types (Type S vs Type N):</strong> Use <strong>Type S mortar</strong> (minimum 1,800 PSI compressive strength) for below-grade foundation walls, retaining walls, and high-wind structural walls. Use <strong>Type N mortar</strong> (750 PSI) for above-grade interior partitions and exterior non-loadbearing walls.
              </li>
            </ul>
            <p className={styles.noteText}>
              <em>Note:</em> Thicker blocks (such as 10-inch and 12-inch CMUs) have wider face shells and cross webs, consuming roughly 15% to 25% more mortar per unit. Mortar yields vary with joint thickness, bedding depth, and mason technique—always follow manufacturer product label guidelines.
            </p>
          </section>

          {/* Section 8: Concrete Core Fill (Cinder Block Fill Calculator) & Reinforcement */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Concrete Core Fill (Cinder Block Fill Calculator) &amp; Reinforcement</h2>
            <p className={styles.paragraph}>
              Hollow concrete blocks are engineered with open internal cells so that vertical and horizontal steel rebar can be placed and encapsulated with fluid concrete grout. This transforms hollow masonry into a monolithic reinforced shear wall.
            </p>
            <p className={styles.paragraph}>
              Building plans and local structural codes dictate the exact rebar spacing and grouting frequency. This calculator estimates the volume of concrete required based on these standard engineering patterns:
            </p>
            <ul className={styles.unorderedList}>
              <li className={styles.listItem}>
                <strong>100% Solid Grout (All Cores Filled):</strong> Every vertical hollow core is filled with coarse grout. Used for structural basement retaining walls, storm shelters, and commercial blast walls. For 100 laid 8-inch blocks, total core volume equals <code>100 × 0.27 cu ft = 27.0 cu ft = 1.0 cu yd</code> (before waste).
              </li>
              <li className={styles.listItem}>
                <strong>Vertical Rebar at 32 Inches On-Center (25% of Cores):</strong> In a standard running bond, blocks are 16 inches long, meaning cells occur every 8 inches. Placing rebar every 32 inches fills <strong>1 cell in every 4 (25% share)</strong>. For 100 blocks, core volume equals <code>27 cu ft × 0.25 = 6.75 cu ft ≈ 0.25 cu yd</code>.
              </li>
              <li className={styles.listItem}>
                <strong>Vertical Rebar at 48 Inches On-Center (16.7% of Cores):</strong> Rebar placed every 48 inches fills <strong>1 cell in every 6 (16.67% share)</strong>. For 100 blocks, core volume equals <code>27 cu ft × 0.1667 = 4.5 cu ft ≈ 0.17 cu yd</code>.
              </li>
              <li className={styles.listItem}>
                <strong>Bond Beam Rows:</strong> Horizontal bond beams feature knocked-out cross webs to hold horizontal rebar. Each full bond beam course requires 100% solid grouting across its entire length.
              </li>
            </ul>
            <p className={styles.paragraph}>
              When total grout volume exceeds 0.5 to 1.0 cubic yard, mixing individual 80 lb concrete bags in a wheelbarrow becomes labor-intensive. Verify whether ready-mix truck delivery is more cost-effective using our companion <Link href="/cubic-yard-calculator/" className={styles.inlineLink}>Cubic Yard Calculator</Link>.
            </p>
          </section>

          {/* Section 9: Related Masonry & Construction Calculators */}
          <section className={styles.relatedSection}>
            <h2 className={styles.sectionHeading}>Related Masonry &amp; Construction Calculators</h2>
            <p className={styles.paragraph}>
              Explore our verified, live companion estimators for concrete, masonry, and foundation projects:
            </p>
            <div className={styles.relatedGrid}>
              {liveRelatedTools.map((tool, idx) => (
                <Link key={idx} href={tool.href} className={styles.relatedCard}>
                  <div className={styles.relatedCardTitle}>{tool.label}</div>
                  <div className={styles.relatedCardDesc}>{tool.description}</div>
                </Link>
              ))}
            </div>
          </section>

          {/* Ad Slot 2: Mid-Content Ad Slot */}
          <AdSlot slotId="cinder-calc-middle" />

          {/* Section 10: Cinder Block Calculator FAQ (Exact 8 questions) */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Cinder Block Calculator FAQ</h2>
            <Faq items={CINDER_BLOCK_FAQS} />
          </section>

          {/* Section 11: Closing Wrap-up, Last Updated, How We Calculate & Disclaimer */}
          <section className={styles.section}>
            <p className={styles.closingParagraph}>
              Whether you are laying a simple block stem wall for a garden shed or estimating a multi-room concrete basement, using this <strong>cinder block calculator</strong> ensures precise material orders, prevents costly delivery trips, and keeps your masonry budget strictly on track.
            </p>

            <div className={styles.disclaimerBox}>
              <div className={styles.disclaimerHeader}>
                <strong>How We Calculate &amp; Engineering Disclaimer</strong>
                <span className={styles.lastUpdated}>Last updated: November 11, 2026</span>
              </div>
              <p className={styles.disclaimerText}>
                <strong>How We Calculate:</strong> Material quantities are computed using true geometric face coverage (unit length × unit height including mortar joints) applied to net wall surface area, with CEIL-rounded waste buffers. Mortar yields and core grout volumes use standard industry benchmarks (0.27 cu ft per 8&quot; CMU core; 13 blocks per 80 lb pre-blended bag).
              </p>
              <p className={styles.disclaimerText}>
                <strong>Disclaimer:</strong> All calculations provided by this tool are estimates for planning and budgeting purposes only. Load-bearing foundation walls, structural stem walls, and earth-retaining walls must strictly comply with local building codes, structural engineering plans, and manufacturer specifications. Always confirm block dimensions, pallet quantities, and mortar requirements with your local building supplier or licensed structural engineer before placing orders.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
