import { Metadata } from 'next';
import Link from 'next/link';
import { StoneCalculator } from '@/components/tool/stone-calculator';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { SITE_NAME, SITE_URL } from '@/config/site';
import { STONE_FAQS, RELATED_STONE_TOOLS } from '@/content/pages/stone-calculator';
import { STONE_MATERIALS, LAST_VERIFIED } from '@/lib/stone-constants';
import styles from './page.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Stone Calculator (Tons, Yards & Bags)',
  description:
    'Calculate how many tons of rock, stone, gravel, and river rock you need. Free stone calculator with cubic yards, bags, density chart, and cost estimate.',
  path: '/stone-calculator/',
});

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Stone Calculator',
    url: `${SITE_URL}/stone-calculator/`,
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
      'Free aggregate and rock calculator to convert length, width, and depth into cubic yards, tons, and 50 lb bags for landscape rock, #57 crushed stone, and river rock.',
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
        name: 'Stone Calculator',
        item: `${SITE_URL}/stone-calculator/`,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: STONE_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  },
];

export default function StoneCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main-content" className={styles.mainContainer}>
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className={styles.breadcrumbNav}>
          <ol className={styles.breadcrumbList}>
            <li>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            </li>
            <li className={styles.breadcrumbSeparator} aria-hidden="true">›</li>
            <li>
              <Link href="/tools/" className={styles.breadcrumbLink}>Calculators</Link>
            </li>
            <li className={styles.breadcrumbSeparator} aria-hidden="true">›</li>
            <li className={styles.breadcrumbCurrent} aria-current="page">Stone Calculator</li>
          </ol>
        </nav>

        {/* Page Header */}
        <header className={styles.header}>
          <h1 className={styles.h1Title}>
            Stone Calculator: How Many Tons of Rock Do You Need?
          </h1>
          <p className={styles.introParagraph}>
            Use our free <strong>stone calculator</strong> to figure out exactly how many tons, cubic yards, and 50 lb bags of rock or aggregate you need for your landscaping or driveway project. Whether you need a <strong>rock calculator</strong> for decorative river rock, a <strong>landscape rock calculator</strong> for garden beds, a <strong>crushed stone calculator</strong> for bases, or an <strong>aggregate calculator</strong> for commercial site work, calculate your materials instantly below with accurate quarry densities.
          </p>
        </header>

        {/* Interactive Tool */}
        <section aria-label="Interactive Stone and Rock Calculator">
          <StoneCalculator />
        </section>

        {/* Top Ad Slot */}
        <AdSlot slotId="stone-calc-middle" />

        {/* Main Editorial Content */}
        <article className={styles.editorialContent}>
          {/* Section 1: Quick Answer */}
          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionHeading}>
              Quick Answer: How Many Cubic Yards in a Ton of Rock?
            </h2>
            <p className={styles.paragraph}>
              On average, <strong>1 US short ton of crushed rock contains approximately 0.71 to 0.74 cubic yards</strong>. Conversely, <strong>1 cubic yard of standard crushed stone or gravel weighs between 1.35 and 1.50 tons</strong> (2,700 to 3,000 pounds).
            </p>
            <p className={styles.paragraph}>
              Because rock varieties have different porosities and mineral densities, the exact conversion depends on the material you order:
            </p>

            <div className={styles.tableResponsive}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Material Type</th>
                    <th>Tons per Cubic Yard</th>
                    <th>Cubic Yards per Ton</th>
                    <th>Pounds per Cubic Yard</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#57 Crushed Stone</td>
                    <td>1.40 tons</td>
                    <td>0.71 yd³</td>
                    <td>2,800 lbs</td>
                  </tr>
                  <tr>
                    <td>Crusher Run (with Fines)</td>
                    <td>1.50 tons</td>
                    <td>0.67 yd³</td>
                    <td>3,000 lbs</td>
                  </tr>
                  <tr>
                    <td>River Rock (Smooth)</td>
                    <td>1.35 tons</td>
                    <td>0.74 yd³</td>
                    <td>2,700 lbs</td>
                  </tr>
                  <tr>
                    <td>Pea Gravel</td>
                    <td>1.40 tons</td>
                    <td>0.71 yd³</td>
                    <td>2,800 lbs</td>
                  </tr>
                  <tr>
                    <td>Lava Rock (Volcanic)</td>
                    <td>0.61 tons</td>
                    <td>1.64 yd³</td>
                    <td>1,215 lbs</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.calloutText}>
              Need to convert pure bulk weight to volume for other materials like soil, sand, or mulch? Use our dedicated <Link href="/tons-to-cubic-yards/" className={styles.inlineLink}>tons to cubic yards calculator</Link> for comprehensive weight-to-volume charts.
            </p>
          </section>

          {/* Section 2: Step-by-Step Formula */}
          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionHeading}>
              How to Calculate Stone and Rock Needed (Step-by-Step Formula)
            </h2>
            <p className={styles.paragraph}>
              Quarries and aggregate supply yards sell bulk rock by weight (tons), but you measure your landscaping beds in feet and inches. Translating your jobsite dimensions into tons involves six straightforward steps:
            </p>

            {/* Inline SVG Diagram */}
            <div className={styles.diagramWrapper}>
              <svg
                viewBox="0 0 720 130"
                className={styles.flowDiagram}
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Steps to convert dimensions to tons of rock"
              >
                <rect x="10" y="20" width="120" height="85" rx="8" fill="#F8FAFC" stroke="#0284C7" strokeWidth="2" />
                <text x="70" y="52" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0F172A">1. Area</text>
                <text x="70" y="74" textAnchor="middle" fontSize="11" fill="#64748B">L × W (sq ft)</text>

                <path d="M 135 62 L 155 62" stroke="#0284C7" strokeWidth="2" markerEnd="url(#arrow)" />

                <rect x="160" y="20" width="120" height="85" rx="8" fill="#F8FAFC" stroke="#0284C7" strokeWidth="2" />
                <text x="220" y="52" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0F172A">2. Volume</text>
                <text x="220" y="74" textAnchor="middle" fontSize="11" fill="#64748B">Area × (Depth / 12)</text>

                <path d="M 285 62 L 305 62" stroke="#0284C7" strokeWidth="2" markerEnd="url(#arrow)" />

                <rect x="310" y="20" width="120" height="85" rx="8" fill="#F8FAFC" stroke="#0284C7" strokeWidth="2" />
                <text x="370" y="52" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0F172A">3. Cu Yards</text>
                <text x="370" y="74" textAnchor="middle" fontSize="11" fill="#64748B">Cu Ft ÷ 27</text>

                <path d="M 435 62 L 455 62" stroke="#0284C7" strokeWidth="2" markerEnd="url(#arrow)" />

                <rect x="460" y="20" width="120" height="85" rx="8" fill="#F8FAFC" stroke="#0284C7" strokeWidth="2" />
                <text x="520" y="52" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0F172A">4. Waste Factor</text>
                <text x="520" y="74" textAnchor="middle" fontSize="11" fill="#64748B">+5% to 10% Extra</text>

                <path d="M 585 62 L 605 62" stroke="#0284C7" strokeWidth="2" markerEnd="url(#arrow)" />

                <rect x="610" y="20" width="100" height="85" rx="8" fill="#0284C7" stroke="#0284C7" strokeWidth="2" />
                <text x="660" y="52" textAnchor="middle" fontSize="13" fontWeight="700" fill="#FFFFFF">5. Tons</text>
                <text x="660" y="74" textAnchor="middle" fontSize="11" fill="#E0F2FE">Yards × Density</text>

                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 8 5 L 0 9 z" fill="#0284C7" />
                  </marker>
                </defs>
              </svg>
            </div>

            <ol className={styles.orderedList}>
              <li>
                <strong>Measure Area in Square Feet:</strong> Multiply length by width in feet. For circular areas, measure diameter, calculate radius (diameter ÷ 2), and multiply 3.14159 × radius × radius. If you have several segmented areas, use our <Link href="/square-footage-calculator/" className={styles.inlineLink}>square footage calculator</Link> to sum your sub-zones.
              </li>
              <li>
                <strong>Convert Depth to Feet:</strong> Divide your depth in inches by 12. For instance, a 3-inch depth equals 3 ÷ 12 = 0.25 feet.
              </li>
              <li>
                <strong>Calculate Cubic Feet and Cubic Yards:</strong> Multiply square footage by depth in feet to get cubic feet, then divide by 27. For a 30 ft × 6 ft border (180 sq ft) at 3 inches deep: 180 × 0.25 = 45 cubic feet. Dividing 45 ÷ 27 gives 1.67 cubic yards. (Check general excavation quantities with our <Link href="/cubic-yard-calculator/" className={styles.inlineLink}>cubic yard calculator</Link>).
              </li>
              <li>
                <strong>Apply a Waste and Settling Allowance:</strong> Subgrades have uneven dips, and aggregate settles when walked on or driven over. Always add 5% for garden borders or 10% for driveways and trenches. 1.67 gross cubic yards becomes 1.83 cubic yards with 10% waste.
              </li>
              <li>
                <strong>Multiply by Stone Density:</strong> Multiply your gross cubic yards by the specific material density rating (in tons per cubic yard). At 1.35 tons per yard for river rock: 1.67 net yards × 1.35 = 2.25 net tons, or 1.83 gross yards × 1.35 = 2.48 gross tons (order 2.5 tons).
              </li>
            </ol>
          </section>

          {/* Section 3: Material Density & Weight Chart */}
          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionHeading}>
              Rock Calculator: Material Density &amp; Weight Chart
            </h2>
            <p className={styles.paragraph}>
              Aggregate density varies based on rock type, grain size, and whether the stones are crushed angular or river-rounded. Below are standard dry loose bulk densities used across North American quarries:
            </p>

            <div className={styles.tableResponsive}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Typical Size</th>
                    <th>Tons / yd³</th>
                    <th>lbs / cu ft</th>
                    <th>Coverage / Ton @ 2&quot;</th>
                    <th>Common Use Case</th>
                  </tr>
                </thead>
                <tbody>
                  {STONE_MATERIALS.map((mat) => (
                    <tr key={mat.id}>
                      <td style={{ fontWeight: 600 }}>{mat.name}</td>
                      <td>{mat.typicalSize}</td>
                      <td style={{ fontWeight: 600, color: '#0284C7' }}>{mat.tonsPerCuYard.toFixed(2)}</td>
                      <td>{mat.densityLbsPerCuFt} lbs</td>
                      <td>~{mat.coveragePerTonSqFtAt2In} sq ft</td>
                      <td>{mat.typicalUse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.helperNote}>
              Source: Aggregate bulk density standards compiled across US and Canadian suppliers. Last verified: {LAST_VERIFIED}.
            </p>
          </section>

          {/* Section 4: Stone Calculator Tons by Area & Depth */}
          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionHeading}>
              Stone Calculator Tons: How Many Tons Do I Need?
            </h2>
            <p className={styles.paragraph}>
              When ordering stone by the ton, homeowners frequently ask: &quot;How many tons do I need for my area?&quot; Below is a handy contractor reference table calculating net tons needed for common square footages using standard #57 stone / gravel (density of 1.40 tons/yd³, without waste):
            </p>

            <h3 className={styles.subHeading}>
              Stone Calculator Tons by Area and Depth (#57 Crushed Stone at 1.40 tons/yd³)
            </h3>
            <div className={styles.tableResponsive}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Area (sq ft)</th>
                    <th>Tons @ 2&quot; Depth</th>
                    <th>Tons @ 3&quot; Depth</th>
                    <th>Tons @ 4&quot; Depth</th>
                    <th>50 lb Bags @ 3&quot;</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>100 sq ft</strong></td>
                    <td>0.86 tons</td>
                    <td>1.30 tons</td>
                    <td>1.73 tons</td>
                    <td>52 bags</td>
                  </tr>
                  <tr>
                    <td><strong>200 sq ft</strong></td>
                    <td>1.73 tons</td>
                    <td>2.59 tons</td>
                    <td>3.46 tons</td>
                    <td>104 bags</td>
                  </tr>
                  <tr>
                    <td><strong>500 sq ft</strong></td>
                    <td>4.32 tons</td>
                    <td>6.48 tons</td>
                    <td>8.64 tons</td>
                    <td>260 bags</td>
                  </tr>
                  <tr>
                    <td><strong>1,000 sq ft</strong></td>
                    <td>8.64 tons</td>
                    <td>12.96 tons</td>
                    <td>17.28 tons</td>
                    <td>519 bags</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5: Landscape Rock Calculator - Depth Guide */}
          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionHeading}>
              Landscape Rock Calculator: How Deep Should Your Stone Be?
            </h2>
            <p className={styles.paragraph}>
              Depth is the most common factor DIYers get wrong. Too shallow, and underlying landscape fabric or soil shows through; too deep, and you waste hundreds of dollars on rock that sinks or creates an unstable, shifting walking surface.
            </p>

            <h3 className={styles.subHeading}>
              River Rock Calculator: Coverage &amp; Depth
            </h3>
            <p className={styles.paragraph}>
              When using a <strong>river rock calculator</strong> for decorative borders or dry creek beds, size dictates depth. For medium 1- to 3-inch river cobble, spread a minimum depth of <strong>3 inches</strong> (or twice the diameter of the largest rock). A 2-inch layer of 3-inch stones leaves noticeable bare voids. At 3 inches deep, 1 ton of river rock covers approximately 80 square feet.
            </p>

            <h3 className={styles.subHeading}>
              Crushed Stone Calculator: #57 vs Crusher Run
            </h3>
            <p className={styles.paragraph}>
              If you are using a <strong>crushed stone calculator</strong> or a dedicated <strong>57 stone calculator</strong>:
            </p>
            <ul className={styles.bulletList}>
              <li>
                <strong>#57 Stone (Clean angular 1/2&quot; to 1&quot;):</strong> Ideal for French drains, backfilling retaining walls, and clean decorative driveways. Recommended depth is <strong>3 to 4 inches</strong>. It has roughly 40% void space for rapid water drainage.
              </li>
              <li>
                <strong>Crusher Run / Dense Grade (3/4&quot; down to stone dust):</strong> Ideal for structural driveway sub-bases and paver patio foundations. Recommended depth is <strong>4 to 6 inches</strong>, compacted in 2-inch lifts. The dust particles pack tightly between rocks, forming a rock-hard unshifting base.
              </li>
              <li>
                <strong>Pea Gravel (3/8&quot; round pebbles):</strong> For patio floors and pathways, keep depth to <strong>2 to 2.5 inches</strong>. Any deeper and foot traffic will sink awkwardly into the loose stones.
              </li>
            </ul>
          </section>

          {/* Section 6: Aggregate Calculator - Contractor Estimating */}
          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionHeading}>
              Aggregate Calculator: How Contractors Estimate Stone
            </h2>
            <p className={styles.paragraph}>
              Professional excavators and landscape contractors use practical rules of thumb when ordering aggregate from commercial quarries:
            </p>
            <ul className={styles.bulletList}>
              <li>
                <strong>Certified Scale Tickets:</strong> Quarries weigh haul trucks on certified platform scales (gross weight minus empty tare weight). You pay for the scale weight, which includes natural stockpile moisture. After heavy rain, damp aggregate weighs 5% to 8% more.
              </li>
              <li>
                <strong>Subgrade Settling Allowance:</strong> Raw dirt subgrade yields when heavy stone is spread. Excavators routinely round up to the nearest half-ton or full ton to prevent shortages that halt skid-steer crews.
              </li>
              <li>
                <strong>Gradation Void Ratios:</strong> Clean single-size stone (#57) holds large voids, requiring less weight per yard than blended aggregates (crusher run or road base) where stone dust fills every pocket.
              </li>
            </ul>
          </section>

          {/* Section 7: Bulk vs Bags */}
          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionHeading}>
              Buying Bulk Stone vs Bags
            </h2>
            <p className={styles.paragraph}>
              Deciding between ordering bulk dump truck delivery or picking up 50 lb bags from the local home center comes down to two factors: total weight and site accessibility.
            </p>

            <div className={styles.comparisonGrid}>
              <div className={styles.comparisonCard}>
                <h3 className={styles.comparisonTitle}>When to Buy 50 lb Bags</h3>
                <ul className={styles.cardList}>
                  <li>Total project requirement is under 1,500 lbs (fewer than 30 bags).</li>
                  <li>Backyard has tight gate access where dump trucks or skid-steers cannot fit.</li>
                  <li>You plan to complete the work slowly over several weekends.</li>
                  <li>No space on your driveway or lawn to store a large loose rock pile.</li>
                </ul>
              </div>

              <div className={styles.comparisonCard}>
                <h3 className={styles.comparisonTitle}>When to Order Bulk Delivery</h3>
                <ul className={styles.cardList}>
                  <li>Total requirement exceeds 1 ton (40 bags or ~0.75 cubic yards).</li>
                  <li>Bulk quarry stone costs $35 to $75 per ton vs $160 to $240 per ton in retail bags.</li>
                  <li>Saves hours of lifting, opening, and disposing of plastic bags.</li>
                  <li>Truck can dump directly onto the driveway or near the installation trench.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 8: Worked Example */}
          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionHeading}>
              Worked Example: 24 ft × 12 ft River Rock Patio Border
            </h2>
            <p className={styles.paragraph}>
              Let us walk through a complete real-world project example using our landscape rock calculator:
            </p>
            <div className={styles.exampleBox}>
              <p><strong>Project:</strong> Decorative river rock border around a concrete patio</p>
              <p><strong>Dimensions:</strong> 24 feet long × 12 feet wide × 3 inches deep (0.25 ft)</p>
              <p><strong>Selected Material:</strong> Smooth River Rock (density = 1.35 tons / yd³)</p>
              <p><strong>Waste Factor:</strong> 10% (for subgrade dips and edging overlap)</p>
              <hr className={styles.divider} />
              <p><strong>Step 1 (Surface Area):</strong> 24 ft × 12 ft = 288 sq ft</p>
              <p><strong>Step 2 (Net Volume in Cu Ft):</strong> 288 sq ft × 0.25 ft = 72.0 cu ft</p>
              <p><strong>Step 3 (Gross Volume with 10% Waste):</strong> 72.0 cu ft × 1.10 = 79.2 cu ft</p>
              <p><strong>Step 4 (Cubic Yards):</strong> 79.2 cu ft ÷ 27 = 2.93 cubic yards</p>
              <p><strong>Step 5 (Tonnage):</strong> 2.93 yd³ × 1.35 tons/yd³ = <strong>3.96 gross tons</strong> (order 4.0 tons)</p>
              <p><strong>Step 6 (Bag Count Alternative):</strong> 3.96 tons = 7,920 lbs ÷ 50 lbs = <strong>159 bags</strong> (50 lb each)</p>
            </div>
          </section>

          {/* Section 9: 5 Pro Tips */}
          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionHeading}>
              5 Pro Tips for Laying Landscape Stone
            </h2>
            <ol className={styles.orderedList}>
              <li>
                <strong>Always Lay Heavy Commercial Geotextile Fabric First:</strong> Never spread rock directly onto raw subsoil. Without fabric, stones sink into mud while dirt worms migrate up. Use needle-punched non-woven landscape fabric secured with heavy 6-inch steel landscape staples every 3 feet.
              </li>
              <li>
                <strong>Install Rigid Deep Edging:</strong> Rounded river stones and pea gravel migrate into grass lawns during leaf blowing or heavy rains. Install commercial poly, steel, or stone edging standing 1/2 inch to 1 inch above the final stone surface.
              </li>
              <li>
                <strong>Lay Plywood Over Driveways Before Delivery:</strong> Dump truck wheel loads and tailgate dumps can scratch or crack concrete driveways. Lay two 4 ft × 8 ft sheets of 3/4-inch plywood on your driveway for the driver to dump the aggregate onto.
              </li>
              <li>
                <strong>Hose Off Quarry Dust After Spreading:</strong> Freshly delivered bulk stone is coated with fine pulverized rock dust from crushing plants. Thoroughly wash your newly installed rock beds with a garden hose to reveal brilliant natural mineral colors.
              </li>
              <li>
                <strong>Avoid Rounded River Rock on Slopes:</strong> Round river cobble rolls under gravity like marbles. For hillside swales, ditch linings, or slopes steeper than 3:1, always specify angular crushed stone or heavy rip rap that mechanically locks into place.
              </li>
            </ol>
          </section>

          {/* Section 10: Frequently Asked Questions */}
          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionHeading}>
              Frequently Asked Questions
            </h2>
            <div className={styles.faqList}>
              {STONE_FAQS.map((faq, idx) => (
                <div key={idx} className={styles.faqCard}>
                  <h3 className={styles.faqQuestion}>{faq.q}</h3>
                  <p className={styles.faqAnswer}>{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 11: Related Calculators */}
          <section className={styles.sectionBlock}>
            <h2 className={styles.sectionHeading}>
              Related Hardscaping &amp; Construction Calculators
            </h2>
            <p className={styles.paragraph}>
              Working on a multi-stage outdoor landscaping or building project? Explore our other free material calculators:
            </p>
            <div className={styles.relatedGrid}>
              {RELATED_STONE_TOOLS.map((tool) => (
                <div key={tool.href} className={styles.relatedCard}>
                  <h3 className={styles.relatedTitle}>
                    <Link href={tool.href} className={styles.relatedLink}>
                      {tool.label}
                    </Link>
                  </h3>
                  <p className={styles.relatedDesc}>{tool.description}</p>
                </div>
              ))}
            </div>

            <div className={styles.backToTopBox}>
              <a href="#main-content" className={styles.backToTopLink}>
                ↑ Back to Stone Calculator
              </a>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
