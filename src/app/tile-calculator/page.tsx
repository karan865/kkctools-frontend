import { Metadata } from 'next';
import Link from 'next/link';
import { TileCalculator } from '@/components/tool/tile-calculator';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { SITE_NAME, SITE_URL } from '@/config/site';
import { TILE_FAQS, RELATED_TILE_TOOLS } from '@/content/pages/tile-calculator';
import styles from './page.module.css';
import JsonLd from '@/components/seo/JsonLd';
import HowWeCalculate from '@/components/seo/HowWeCalculate';

// Title: 47 chars (with template | KKC Tools = 59 chars <= 65)
// Meta Description: exactly 160 chars
export const metadata: Metadata = buildMetadata({
  title: 'Tile Calculator (Tile Sq Ft & Boxes)',
  description:
    'Free tile calculator to estimate tiles, square footage, boxes, and grout needed for floors, showers, and backsplashes. Accounts for patterns, waste %, and cost.',
  path: '/tile-calculator/',
});

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Tile Calculator',
    url: `${SITE_URL}/tile-calculator/`,
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
      'Calculate exact tile quantity, boxes to order, total square footage with pattern waste, grout bags, and material costs for floors, showers, and kitchen backsplashes.',
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
        name: 'Tools',
        item: `${SITE_URL}/tools/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Tile Calculator',
        item: `${SITE_URL}/tile-calculator/`,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: TILE_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  },
];

export default function TileCalculatorPage() {
  return (
    <>
      <JsonLd data={jsonLd} />

      <main id="main-content" className={styles.container}>
        {/* Breadcrumbs */}
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <ol className={styles.breadcrumbList}>
            <li className={styles.breadcrumbItem}>
              <Link href="/">Home</Link>
            </li>
            <li className={styles.breadcrumbSeparator}>/</li>
            <li className={styles.breadcrumbItem}>
              <Link href="/tools/">Tools</Link>
            </li>
            <li className={styles.breadcrumbSeparator}>/</li>
            <li className={`${styles.breadcrumbItem} ${styles.breadcrumbItemActive}`} aria-current="page">
              Tile Calculator
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <header className={styles.hero}>
          <span className={styles.badge}>Flooring &amp; Tiling Estimator</span>
          <h1 className={styles.title}>
            Tile Calculator: Square Feet, Tiles, Boxes &amp; Grout
          </h1>
          <p className={styles.subtitle} style={{ marginBottom: '16px' }}>
            Accurately calculate tiles, boxes, thin-set mortar, and grout needed for floors, shower walls, and backsplashes using our free <strong>tile calculator</strong>.
          </p>
        </header>

        {/* Interactive Tile Calculator Tool */}
        <TileCalculator />

        {/* Top AdSlot */}
        <AdSlot slotId="tile-calc-top" />

        {/* Comprehensive SEO Content & Reference Guide */}
        <article className={styles.content}>
          <p className={styles.dateVerified} style={{ marginTop: '16px', marginBottom: '8px' }}>
            Last updated: November 2026. Prices are typical US ranges.
          </p>
          <div className={styles.intro} style={{ marginBottom: '28px' }}>
            <p>
              This free tile sq ft calculator tells you how many tiles, boxes, thin-set bags and grout you need for floors, shower walls and backsplashes. Whether you are laying classic 12&quot; × 12&quot; ceramic floor tiles, installing large-format 12&quot; × 24&quot; porcelain in an open bathroom, or refreshing a kitchen splash with classic 3&quot; × 6&quot; subway tile, ordering the exact quantity protects your budget and prevents mid-project delays.
            </p>
            <p>
              Our comprehensive tile square footage calculator accounts for real-world installation factors: staggered layouts, angled perimeter cuts, manufacturer packaging yields (tiles per box vs sq ft per box), mortar trowel coverage, and sanded grout requirements. Use our verified calculations below to plan your installation.
            </p>
          </div>

          <section>
            <h2>How Many Tiles Do I Need? (Step-by-Step Formula)</h2>
            <p>
              To calculate how many tiles you need for any floor or wall, follow this verified four-step mathematical formula. Grout joint width is not subtracted from the tile count; the waste allowance covers it.
            </p>

            <h3>Step 1: Calculate the Net Surface Area</h3>
            <p>
              Measure the length and width of each rectangular section in feet. If measuring in inches, divide the final product by 144 to convert square inches into square feet:
            </p>
            <div className={styles.formulaBox}>
              Surface Area (sq ft) = Length (ft) × Width (ft)
              <br />
              Or: Surface Area (sq ft) = [Length (in) × Width (in)] ÷ 144
            </div>
            <p>
              For example, a bathroom floor measuring 10 feet long by 8 feet wide equals: 10 × 8 = 80 square feet. Deduct any permanent obstructions that won&apos;t be tiled (such as a 3 ft × 3 ft shower pan: 80 − 9 = 71 net sq ft).
            </p>

            <h3>Step 2: Calculate the Area of One Tile</h3>
            <p>
              Tile dimensions are virtually always sold in inches. Multiply tile length by width in inches, then divide by 144:
            </p>
            <div className={styles.formulaBox}>
              Tile Face Area (sq ft) = [Tile Length (in) × Tile Width (in)] ÷ 144
            </div>
            <p>Standard examples:</p>
            <ul>
              <li><strong>12&quot; × 12&quot; tile:</strong> (12 × 12) ÷ 144 = 1.000 sq ft per tile (1.0 tile per sq ft).</li>
              <li><strong>12&quot; × 24&quot; tile:</strong> (12 × 24) ÷ 144 = 2.000 sq ft per tile (0.5 tiles per sq ft).</li>
              <li><strong>3&quot; × 6&quot; subway tile:</strong> (3 × 6) ÷ 144 = 0.125 sq ft per tile (8.0 tiles per sq ft).</li>
              <li><strong>4&quot; × 12&quot; subway tile:</strong> (4 × 12) ÷ 144 = 0.333 sq ft per tile (3.0 tiles per sq ft).</li>
            </ul>

            <h3>Step 3: Determine Base Tiles Needed</h3>
            <p>
              Divide your net surface square footage by the area of a single tile:
            </p>
            <div className={styles.formulaBox}>
              Base Tiles = Net Surface Area (sq ft) ÷ Single Tile Area (sq ft)
            </div>
            <p>
              For our 80 sq ft bathroom with 12&quot; × 12&quot; tile: 80 ÷ 1.00 = 80 base tiles.
            </p>

            <h3>Step 4: Factor in Pattern Waste &amp; Box Packaging</h3>
            <p>
              Never buy only the base tile count. Every room requires cutting tiles around edges, door thresholds, drains, and corners. Inevitably, tiles chip during wet-saw cutting or transit.
            </p>
            <div className={styles.formulaBox}>
              Total Tiles Needed = Base Tiles × (1 + Waste Percentage ÷ 100)
              <br />
              Whole Retail Boxes to Buy = Ceiling(Total Tiles Needed ÷ Tiles per Box)
            </div>
            <p>
              For straight grid laying, add 10% (80 × 1.10 = 88 tiles). If boxes contain 10 tiles, divide 88 by 10 = 8.8, rounded up to 9 whole boxes (90 tiles total). For herringbone/chevron patterns, use a 20% waste factor.
            </p>
          </section>

          {/* Quick Reference Table */}
          <section>
            <h2>Tiles Needed by Size and Area (Quick Reference)</h2>
            <p>
              This reference chart shows the exact number of tiles needed for common residential room sizes (50, 100, and 200 sq ft). All figures assume a standard straight-lay grid pattern with a 10% waste factor and single rounding based on nominal face area. Click &quot;Use this size&quot; to load any dimension directly into the calculator.
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.comparisonTable}>
                <thead>
                  <tr>
                    <th>Tile Size (in)</th>
                    <th>Tiles per Sq Ft</th>
                    <th>50 Sq Ft Room</th>
                    <th>100 Sq Ft Room</th>
                    <th>200 Sq Ft Room</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>12&quot; × 12&quot;</strong></td>
                    <td>1.00</td>
                    <td>55 tiles</td>
                    <td>110 tiles</td>
                    <td>220 tiles</td>
                    <td>
                      <a href="#tile-calc-app" className={styles.tableActionBtn}>
                        Use this size
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>12&quot; × 24&quot;</strong></td>
                    <td>0.50</td>
                    <td>28 tiles</td>
                    <td>55 tiles</td>
                    <td>110 tiles</td>
                    <td>
                      <a href="#tile-calc-app" className={styles.tableActionBtn}>
                        Use this size
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>6&quot; × 24&quot;</strong></td>
                    <td>1.00</td>
                    <td>55 tiles</td>
                    <td>110 tiles</td>
                    <td>220 tiles</td>
                    <td>
                      <a href="#tile-calc-app" className={styles.tableActionBtn}>
                        Use this size
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>24&quot; × 24&quot;</strong></td>
                    <td>0.25</td>
                    <td>14 tiles</td>
                    <td>28 tiles</td>
                    <td>55 tiles</td>
                    <td>
                      <a href="#tile-calc-app" className={styles.tableActionBtn}>
                        Use this size
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>6&quot; × 6&quot; Square</strong></td>
                    <td>4.00</td>
                    <td>220 tiles</td>
                    <td>440 tiles</td>
                    <td>880 tiles</td>
                    <td>
                      <a href="#tile-calc-app" className={styles.tableActionBtn}>
                        Use this size
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>4&quot; × 12&quot;</strong></td>
                    <td>3.00</td>
                    <td>165 tiles</td>
                    <td>330 tiles</td>
                    <td>660 tiles</td>
                    <td>
                      <a href="#tile-calc-app" className={styles.tableActionBtn}>
                        Use this size
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>4&quot; × 4&quot;</strong></td>
                    <td>9.00</td>
                    <td>495 tiles</td>
                    <td>990 tiles</td>
                    <td>1,980 tiles</td>
                    <td>
                      <a href="#tile-calc-app" className={styles.tableActionBtn}>
                        Use this size
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>3&quot; × 6&quot; Subway</strong></td>
                    <td>8.00</td>
                    <td>440 tiles</td>
                    <td>880 tiles</td>
                    <td>1,760 tiles</td>
                    <td>
                      <a href="#tile-calc-app" className={styles.tableActionBtn}>
                        Use this size
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Standard Tile Sizes & Packaging Reference Chart */}
          <section>
            <h2>Standard Tile Sizes &amp; Packaging Reference Chart</h2>
            <p>
              Different tile materials and dimensions come in distinct box configurations. Use this reference when planning your retail purchase at home centers or tile suppliers:
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.comparisonTable}>
                <thead>
                  <tr>
                    <th>Tile Nominal Size</th>
                    <th>Face Area (sq ft)</th>
                    <th>Pieces per Sq Ft</th>
                    <th>Typical Box Packaging</th>
                    <th>Common Application</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>12&quot; × 12&quot; Floor</strong></td>
                    <td>1.000 sq ft</td>
                    <td>1.00 pcs</td>
                    <td>10–15 pcs (10–15 sq ft)</td>
                    <td>Standard residential bathrooms, utility rooms</td>
                  </tr>
                  <tr>
                    <td><strong>12&quot; × 24&quot; Large Format</strong></td>
                    <td>2.000 sq ft</td>
                    <td>0.50 pcs</td>
                    <td>7–8 pcs (14–16 sq ft)</td>
                    <td>Modern open living floors, walk-in shower walls</td>
                  </tr>
                  <tr>
                    <td><strong>6&quot; × 24&quot; Wood Plank</strong></td>
                    <td>1.000 sq ft</td>
                    <td>1.00 pcs</td>
                    <td>10–14 pcs (10–14 sq ft)</td>
                    <td>Wood-look porcelain floors, basements</td>
                  </tr>
                  <tr>
                    <td><strong>3&quot; × 6&quot; Subway</strong></td>
                    <td>0.125 sq ft</td>
                    <td>8.00 pcs</td>
                    <td>80–100 pcs (10–12.5 sq ft)</td>
                    <td>Kitchen backsplashes, traditional tub surrounds</td>
                  </tr>
                  <tr>
                    <td><strong>4&quot; × 12&quot; Modern Subway</strong></td>
                    <td>0.333 sq ft</td>
                    <td>3.00 pcs</td>
                    <td>24–30 pcs (8–10 sq ft)</td>
                    <td>Contemporary shower surrounds, vertical stack walls</td>
                  </tr>
                  <tr>
                    <td><strong>4&quot; × 4&quot; Square Accent</strong></td>
                    <td>0.111 sq ft</td>
                    <td>9.00 pcs</td>
                    <td>90–100 pcs (10–11 sq ft)</td>
                    <td>Retro bathroom walls, decorative border inserts</td>
                  </tr>
                  <tr>
                    <td><strong>6&quot; × 6&quot; Square</strong></td>
                    <td>0.250 sq ft</td>
                    <td>4.00 pcs</td>
                    <td>32–40 pcs (8–10 sq ft)</td>
                    <td>Laundry rooms, compact half baths, entryways</td>
                  </tr>
                  <tr>
                    <td><strong>24&quot; × 24&quot; Extra-Large</strong></td>
                    <td>4.000 sq ft</td>
                    <td>0.25 pcs</td>
                    <td>4 pcs (16 sq ft)</td>
                    <td>High-end open great rooms, luxury commercial foyers</td>
                  </tr>
                  <tr>
                    <td><strong>Mosaic Sheet 12&quot; × 12&quot;</strong></td>
                    <td>1.000 sq ft</td>
                    <td>1.00 sheet</td>
                    <td>10 sheets (10 sq ft, check label)</td>
                    <td>Shower pans, accent niches, backsplash feature strips</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Pattern Waste Factors */}
          <section>
            <h2>Tile Layout Patterns &amp; How They Affect Waste</h2>
            <p>
              Your layout pattern directly dictates the cutoff waste factor you must add to the base tile count:
            </p>
            <ul>
              <li>
                <strong>Straight Grid / Stack Bond (10% waste):</strong> Tiles are aligned in simple rows and columns. Cutoffs along one wall can often be reused on the opposing side, keeping waste minimal.
              </li>
              <li>
                <strong>Running Bond / Offset Brick (12% waste):</strong> Each row is shifted by 1/3 or 1/2 the tile length. Cutting around corners produces irregular offcuts that cannot always be reused.
              </li>
              <li>
                <strong>Diagonal / Diamond 45° (15% waste):</strong> Tiles are laid at a 45-degree angle to the walls. Every single border tile must be cut diagonally, generating substantial scrap.
              </li>
              <li>
                <strong>Herringbone &amp; Chevron (20% waste):</strong> Rectangular tiles interlock at 90-degree angles on a 45-degree diagonal grid. Triangular end offcuts cannot be turned around and reused, requiring a full 20% waste factor.
              </li>
            </ul>

            <h3>Herringbone Tile Waste Factor</h3>
            <p>
              When installing herringbone or chevron patterns, expect between 15% and 20% total material waste. Because every perimeter edge requires precise 45-degree angled cuts, offcut pieces are rarely reusable in other locations. Our calculator defaults to 20% for herringbone and chevron patterns, and 15% for standard diagonal layouts. For very large open rooms over 300 square feet with few alcoves, installers can sometimes achieve a 15% cutoff rate.
            </p>
          </section>

          {/* Worked Examples */}
          <section>
            <h2>Worked Examples</h2>

            <div className={styles.exampleCard}>
              <h3>Worked Example 1: Kitchen Backsplash with 3&quot; × 6&quot; Subway Tile</h3>
              <p>
                <strong>Room measurements:</strong> A countertop wall run measuring 14 feet long by 1.5 feet high between the counter and upper cabinets equals 21 net square feet.
              </p>
              <p>
                <strong>Tile calculation:</strong> Classic 3&quot; × 6&quot; subway tile has a face area of 0.125 sq ft (8 tiles per sq ft). Base tiles needed: 21 × 8 = 168 tiles. With a staggered running bond layout (12% waste), total tiles needed = 168 × 1.12 = 188.16, rounded up to 189 tiles. Packaged at 100 tiles per retail box, you must buy <strong>2 boxes (200 tiles total)</strong>, leaving 11 surplus tiles for future repairs.
              </p>
            </div>

            <div className={styles.exampleCard}>
              <h3>Worked Example 2: Walk-In Shower Walls with 12&quot; × 24&quot; Large-Format Tile</h3>
              <p>
                <strong>Room measurements:</strong> Two side walls measuring 3 ft × 8 ft (24 sq ft each = 48 sq ft) plus one rear wall measuring 5 ft × 8 ft (40 sq ft) give 88 gross square feet. Deducting a 1 ft × 2 ft built-in shower niche (2 sq ft) leaves 86 net square feet.
              </p>
              <p>
                <strong>Tile calculation:</strong> 12&quot; × 24&quot; tile covers 2.0 sq ft per piece (0.5 tiles/sq ft). Base tiles needed: 86 ÷ 2.0 = 43 tiles. Applying a 12% running bond waste margin equals 48.16, rounded up to 49 tiles. Sold in boxes of 8 tiles (16 sq ft/box), the project requires Ceiling(49 ÷ 8) = <strong>7 boxes (56 tiles total)</strong>. Thin-set mortar coverage for 12&quot; × 24&quot; tile is 50 sq ft per 50 lb bag, requiring 86 ÷ 50 = <strong>2 bags</strong>.
              </p>
            </div>
          </section>

          {/* Mortar & Grout Guide */}
          <section>
            <h2>How Much Grout and Thin-Set Do I Need?</h2>
            <p>
              Tile adhesive and grout requirements depend heavily on tile face dimensions, joint width, and tile thickness. The formula for sanded grout weight is:
            </p>
            <div className={styles.formulaBox}>
              Grout Weight (lb) = Net Area (sq ft) × [(Length + Width) ÷ (Length × Width)] × Joint Width (in) × Thickness (in) × 8.3333 × 1.10
            </div>
            <p>
              Here is typical grout consumption for 100 square feet with standard 1/8&quot; joints and 10% overage:
            </p>
            <ul>
              <li><strong>12&quot; × 24&quot; tile (3/8&quot; thick):</strong> ~5.4 lb sanded grout (buy 1 bag of 10 or 25 lb).</li>
              <li><strong>12&quot; × 12&quot; tile (3/8&quot; thick):</strong> ~7.2 lb sanded grout (buy 1 bag of 10 or 25 lb).</li>
              <li><strong>3&quot; × 6&quot; subway tile (5/16&quot; thick):</strong> ~17.9 lb sanded grout (buy 1 bag of 25 lb).</li>
              <li><strong>2&quot; × 2&quot; mosaic pieces (1/4&quot; thick):</strong> ~28.7 lb sanded grout (buy 2 bags of 25 lb).</li>
            </ul>
            <p>
              <strong>Thin-Set Mortar Coverage by Tile Size (50 lb bag):</strong>
            </p>
            <ul>
              <li><strong>Tiles up to 8&quot; (e.g. 3×6, 4×4):</strong> ~80 sq ft per 50 lb bag using a 1/4&quot; × 1/4&quot; square-notch trowel.</li>
              <li><strong>Tiles over 8&quot; to 15&quot; (e.g. 12×12, 4×12):</strong> ~60 sq ft per 50 lb bag using a 1/4&quot; × 3/8&quot; square-notch trowel.</li>
              <li><strong>Tiles over 15&quot; (e.g. 12×24, 6×24, 24×24):</strong> ~50 sq ft per 50 lb bag using a 1/2&quot; × 1/2&quot; square-notch trowel, plus back-buttering the tile backs.</li>
            </ul>
            <p>
              <em>Note: These are standard industry coverage guidelines. Specific formulations and subfloor porosity vary; always check the manufacturer label on your mortar and grout packaging.</em>
            </p>
          </section>

          {/* Cost Breakdown */}
          <section>
            <h2>Tile Installation Cost Breakdown: DIY vs. Hiring a Professional</h2>
            <p>
              Tiling can either be an affordable DIY weekend project or a significant investment when hiring experienced tile artisans. In 2026 cost guides, total all-in installation costs commonly range from $9 to $25 per square foot depending on tile material, room complexity, and regional trade rates:
            </p>
            <ul>
              <li>
                <strong>DIY Materials (100 sq ft room):</strong> Typically costs $350 to $750. This assumes mid-grade ceramic or porcelain tile ($2 to $5/sq ft), 10% waste, 2 bags of polymer-modified thin-set ($56), 1 bag of grout ($22), and an $85 allowance for sponges, spacers, trowels, and bucket supplies. (Underlayment like cement board or uncoupling membrane is not included in this tool, adding roughly $1.20 to $2.00 per sq ft).
              </li>
              <li>
                <strong>Professional Contractor Installation:</strong> Professional labor typically charges $5 to $15 per square foot of net area for standard straight-lay floor tile. Diagonal and herringbone layouts add a ~20% labor surge ($6 to $18/sq ft). For a 100 sq ft room, contractor labor ranges from $500 to $1,500, producing an all-in completed price of $800 to $2,100 including materials.
              </li>
              <li>
                <strong>Wet Area Waterproofing:</strong> Waterproofing a walk-in shower enclosure (hot-mop, liquid membrane like RedGard, or sheet membrane like Schluter Kerdi) represents a specialized trade service typically costing an extra $450 to $750.
              </li>
            </ul>
          </section>

          <HowWeCalculate slug="tile-calculator" />

          {/* FAQ Section */}
          <section className={styles.faqSection}>
            <h2>Frequently Asked Questions (FAQ)</h2>
            {TILE_FAQS.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{faq.q}</h3>
                <p className={styles.faqAnswer}>{faq.a}</p>
              </div>
            ))}
          </section>

          {/* Related Tools */}
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>Related Home Improvement Calculators</h2>
            <div className={styles.relatedGrid}>
              {RELATED_TILE_TOOLS.map((tool, idx) => (
                <Link key={idx} href={tool.href} className={styles.relatedCard}>
                  <div className={styles.relatedName}>{tool.label}</div>
                  <div className={styles.relatedDesc}>{tool.description}</div>
                </Link>
              ))}
            </div>
          </section>

          {/* Closing Paragraph */}
          <div className={styles.closingNote}>
            <p>
              Bookmark this <strong>tile sq ft calculator</strong> whenever you plan a kitchen remodel, master bathroom update, or commercial floor replacement. For surrounding surfaces, calculate wall and ceiling baseboard trims with our <Link href="/linear-foot-calculator/">Linear Foot Calculator</Link>, plan whole-room dimensions with our <Link href="/square-footage-calculator/">Square Footage Calculator</Link>, evaluate moisture-resistant bathroom paints with our <Link href="/paint-cost-calculator/">Paint Cost Calculator</Link>, or estimate carton quantities for floating wood planks using our <Link href="/laminate-flooring-calculator/">laminate flooring calculator</Link>.
            </p>
          </div>
        </article>

        {/* Bottom AdSlot */}
        <AdSlot slotId="tile-calc-bottom" />
      </main>
    </>
  );
}
