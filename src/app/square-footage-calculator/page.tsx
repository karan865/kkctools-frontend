import { Metadata } from 'next';
import Link from 'next/link';
import SquareFootageCalculator from '@/components/tool/square-footage-calculator/SquareFootageCalculator';
import Faq from '@/components/ui/Faq';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { SITE_NAME, SITE_URL } from '@/config/site';
import {
  SQUARE_FOOTAGE_FAQS,
  RELATED_CONSTRUCTION_TOOLS,
} from '@/content/pages/square-footage-calculator';
import styles from './page.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Sqft Calculator – Square Footage Calculator',
  description:
    'Free sqft calculator to quickly calculate square footage of any room or house. Supports multi-room layouts, odd shapes, waste %, and price per square foot.',
  path: '/square-footage-calculator/',
});

// Generated conversion table values using exact 1 sq ft = 0.09290304 m²
const SQFT_TO_M2_DATA = [100, 250, 500, 1000, 1500, 2000].map((sqft) => ({
  sqft,
  m2: (sqft * 0.09290304).toFixed(2),
}));

// Common Room Sizes (Example dimensions, clearly labelled not as averages)
const COMMON_ROOM_SIZES = [
  { room: 'Small Half Bath / Powder Room', dimensions: '5 × 8 ft', sqft: 40, desc: 'Compact powder room with vanity and toilet' },
  { room: 'Standard Laundry / Utility Room', dimensions: '10 × 10 ft', sqft: 100, desc: 'Washer, dryer, folding counter, and storage' },
  { room: 'Home Office / Nursery', dimensions: '10 × 12 ft', sqft: 120, desc: 'Comfortable desk workstation, bookcase, or crib' },
  { room: 'Secondary / Guest Bedroom', dimensions: '12 × 12 ft', sqft: 144, desc: 'Fits a queen bed, twin nightstands, and small dresser' },
  { room: 'Primary / Master Bedroom', dimensions: '12 × 15 ft', sqft: 180, desc: 'King bed, walk-in circulation, nightstands, and dresser' },
  { room: 'Formal Dining Room', dimensions: '14 × 16 ft', sqft: 224, desc: 'Seats 8 guests comfortably with buffet sideboard space' },
  { room: 'Spacious Family / Living Room', dimensions: '16 × 20 ft', sqft: 320, desc: 'Full sectional sofa, entertainment center, and open pathway' },
  { room: 'Standard 2-Car Garage', dimensions: '20 × 20 ft', sqft: 400, desc: 'Two compact-to-midsize passenger vehicles' },
];

export default function SquareFootageCalculatorPage() {
  const canonicalUrl = `${SITE_URL}/square-footage-calculator/`;

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Square Footage Calculator',
    url: canonicalUrl,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
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
      'Free online sqft calculator for single or multiple rooms, odd geometric shapes, waste allowance, unit conversions (sq meters, yards, inches), and material cost estimation.',
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
        name: 'Square Footage Calculator',
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SQUARE_FOOTAGE_FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  // Only render live tools
  const liveRelatedTools = RELATED_CONSTRUCTION_TOOLS.filter((t) => t.live);

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
              Square Footage Calculator
            </li>
          </ol>
        </nav>

        {/* Section 1: H1 + Intro + Calculator Card */}
        <header className={styles.hero}>
          <div className={styles.badge}>Area &amp; Surface Estimator</div>
          <h1 className={styles.title}>Sqft Calculator – Free Square Footage Calculator</h1>
          <p className={styles.description}>
            Use this fast, client-side <strong>sqft calculator</strong> to accurately determine the exact area of any room, home renovation, or landscaping surface. Our free <strong>square footage calculator</strong> supports single rooms, full multi-room home projects with closet cutouts, and odd geometric shapes with instant waste percentage and material cost estimates.
          </p>
        </header>

        {/* Interactive Calculator Component */}
        <section aria-label="Square Footage Calculator Tool">
          <SquareFootageCalculator />
        </section>

        {/* Ad Slot 1: Below Calculator Results */}
        <AdSlot slotId="sqft-calc-top" />

        <div className={styles.contentWrapper}>
          {/* Section 2: How to Use the Square Footage Calculator */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>How to Use the Square Footage Calculator</h2>
            <p className={styles.paragraph}>
              Our free square footage calculator is engineered for quick, error-free estimation whether you are ordering hardwood flooring for a single bedroom, calculating paint coverage for multiple rooms, or measuring an irregular patio with curved borders. Follow these simple steps:
            </p>
            <ol className={styles.orderedList}>
              <li className={styles.listItem}>
                <strong>Select Your Layout Mode:</strong> Use <em>Single Room</em> for quick length × width calculations, <em>Multiple Rooms</em> to sum or subtract spaces across an entire floor plan, or <em>Shapes</em> for L-shaped rooms, triangles, circles, semi-circles, and trapezoids.
              </li>
              <li className={styles.listItem}>
                <strong>Choose Your Measurement Unit:</strong> Pick from 6 supported unit systems: Decimal Feet, Feet &amp; Inches (e.g., 12 ft 6 in), Inches, Yards, Meters, or Centimeters. All dimensions convert to standard decimal feet automatically without rounding errors.
              </li>
              <li className={styles.listItem}>
                <strong>Enter Room Dimensions:</strong> Type your length and width measurements. In <em>Multiple Rooms</em> mode, click <strong>+ Add Room</strong> for each space. If you need to subtract a closet, stairwell, kitchen island, or unfloored fireplace hearth, click the toggle to <strong>− Subtract</strong>.
              </li>
              <li className={styles.listItem}>
                <strong>Apply a Waste Percentage:</strong> Select standard waste allowances (0%, 5%, 10%, or 15%) or type a custom percentage. Offcuts, diagonal layouts, and wall trims always consume extra material.
              </li>
              <li className={styles.listItem}>
                <strong>Enter Unit Material Cost (Optional):</strong> Supply your estimated price per square foot to instantly see your total project budget for both net area and gross area with waste buffer.
              </li>
              <li className={styles.listItem}>
                <strong>Review, Copy, or Print:</strong> View your net square footage, square meters (m²), square yards (sq yd), square inches (sq in), and baseboard trim perimeter. Click <strong>Copy Summary</strong> or <strong>Print</strong> for your contractor invoice or shopping trip.
              </li>
            </ol>
          </section>

          {/* Section 3: What Is Square Footage and Why Does It Matter? */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>What Is Square Footage and Why Does It Matter?</h2>
            <p className={styles.paragraph}>
              Square footage (commonly abbreviated as sq ft, sq. ft., or ft²) is the standard imperial unit of two-dimensional surface area used throughout the United States, Canada, and parts of the United Kingdom. One square foot represents the exact surface area contained within a square whose four sides each measure one linear foot (12 inches or 0.3048 meters).
            </p>
            <p className={styles.paragraph}>
              Accurate square footage calculations form the bedrock of residential real estate, home renovations, and construction budgeting:
            </p>
            <ul className={styles.unorderedList}>
              <li className={styles.listItem}>
                <strong>Real Estate Valuations:</strong> Residential homes are valued and appraised primarily on price per square foot. Overestimating or underestimating square footage can skew home appraisals, property taxes, and mortgage underwriting by tens of thousands of dollars.
              </li>
              <li className={styles.listItem}>
                <strong>Flooring &amp; Tile Installation:</strong> Hardwood planks, luxury vinyl plank (LVP), ceramic tile, carpet, and laminate flooring are sold strictly by the square foot or square yard. Accurate measurements prevent under-ordering (which halts jobs and risks mismatched manufacturing dye lots) and costly over-purchasing.
              </li>
              <li className={styles.listItem}>
                <strong>Painting &amp; Drywall:</strong> Interior wall square footage directly governs how many gallons of paint, primer, and drywall boards you must purchase.
              </li>
              <li className={styles.listItem}>
                <strong>HVAC Sizing:</strong> Heating and air conditioning equipment tonnage and BTU capacities are engineered based directly on room square footage, ceiling heights, and exterior wall exposure.
              </li>
            </ul>
          </section>

          {/* Section 4: How to Calculate Square Feet of Any Space: Formulas by Shape */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>How to Calculate Square Feet of Any Space: Formulas by Shape</h2>
            <p className={styles.paragraph}>
              When working out square footage manually without a digital tool, your mathematical formula depends on the geometric shape of the space. Below are the verified geometric formulas for all common room layouts and site footprints:
            </p>

            <div className={styles.subsection}>
              <h3 className={styles.subHeading}>1. Rectangle or Square (Standard Rooms)</h3>
              <p className={styles.paragraph}>
                The vast majority of residential bedrooms, living rooms, and rectangular patios follow the basic rectangular area formula:
              </p>
              <div className={styles.formulaBox}>
                <code>Square Footage = Length (ft) × Width (ft)</code>
              </div>
              <p className={styles.paragraph}>
                <em>Example:</em> A standard rectangular master bedroom measuring 20 feet in length and 12 feet in width yields <code>20 × 12 = 240 sq ft</code>.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subHeading}>2. L-Shaped Spaces (Add / Subtract Method)</h3>
              <p className={styles.paragraph}>
                Many open living rooms and kitchen extensions form an &ldquo;L&rdquo; configuration. The cleanest way to work out square feet of an L-shaped room is to split it into two rectangular sections (Section A and Section B):
              </p>
              <div className={styles.formulaBox}>
                <code>Total Area = (Length A × Width A) + (Length B × Width B)</code>
              </div>
              <p className={styles.paragraph}>
                <em>Worked Example:</em> If Section A measures 10 ft × 12 ft (120 sq ft) and Section B measures 8 ft × 14 ft (112 sq ft), the total square footage equals <code>120 + 112 = 232 sq ft</code>. Alternatively, you can measure the outer bounding box and subtract the missing cutout corner using our calculator&apos;s subtract mode.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subHeading}>3. Triangle (Gable Walls, Corner Patios &amp; Roof Decks)</h3>
              <p className={styles.paragraph}>
                For triangular spaces, angled patio corners, or gable attic end-walls:
              </p>
              <div className={styles.formulaBox}>
                <code>Square Footage = (Base × Height) ÷ 2</code>
              </div>
              <p className={styles.paragraph}>
                <em>Worked Example:</em> An attic gable wall with an 18-foot base and a 10-foot perpendicular peak height yields <code>(18 × 10) ÷ 2 = 90 sq ft</code>.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subHeading}>4. Circle (Round Patios, Fire Pits &amp; Gazebos)</h3>
              <p className={styles.paragraph}>
                For full round areas such as circular paver patios or above-ground pool foundations:
              </p>
              <div className={styles.formulaBox}>
                <code>Square Footage = π × Radius² (where π ≈ 3.14159)</code>
              </div>
              <p className={styles.paragraph}>
                <em>Worked Example:</em> For a circular patio with a 14-foot diameter, the radius is half the diameter (7 feet). The square footage is <code>π × 7² = 3.14159 × 49 ≈ 153.94 sq ft</code>. The outer circumference is <code>2 × π × 7 ≈ 43.98 linear ft</code>.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subHeading}>5. Semi-Circle (Alcoves, Bay Window Nooks &amp; Arched Patios)</h3>
              <p className={styles.paragraph}>
                For semi-circular alcoves or arched door landing pads, take the full circle formula and divide by 2:
              </p>
              <div className={styles.formulaBox}>
                <code>Square Footage = (π × Radius²) ÷ 2</code>
              </div>
              <p className={styles.paragraph}>
                <em>Worked Example:</em> For a semi-circle alcove with a 5-foot radius (10-foot flat diameter along the wall), the square footage is <code>(3.14159 × 25) ÷ 2 ≈ 39.27 sq ft</code>.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subHeading}>6. Trapezoid (Slanted Boundary Yards &amp; Angled Rooms)</h3>
              <p className={styles.paragraph}>
                For trapezoid layouts where two opposing walls are parallel but of different lengths:
              </p>
              <div className={styles.formulaBox}>
                <code>Square Footage = ((Parallel Base 1 + Parallel Base 2) ÷ 2) × Perpendicular Height</code>
              </div>
              <p className={styles.paragraph}>
                <em>Worked Example:</em> A side yard with parallel side fence lines of 12 feet and 8 feet, separated by a perpendicular depth of 6 feet, equals <code>((12 + 8) ÷ 2) × 6 = 10 × 6 = 60 sq ft</code>.
              </p>
            </div>
          </section>

          {/* Section 5: How to Measure Square Footage of a Room (Step by Step) */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>How to Measure Square Footage of a Room (Step by Step)</h2>
            <p className={styles.paragraph}>
              Accurate results require disciplined measuring technique on the job site. Before calculating your materials, assemble the right tools: a 25-foot locking tape measure or laser distance measure, a notepad, and a pencil. Follow these practical contractor guidelines:
            </p>
            <ul className={styles.unorderedList}>
              <li className={styles.listItem}>
                <strong>Measure Wall to Wall at Floor Level:</strong> Measure along the baseboards from finished wall surface to finished wall surface. Do not measure across the middle of the room if furniture obstructs a straight line.
              </li>
              <li className={styles.listItem}>
                <strong>Sketch the Room Overhead:</strong> Draw a quick 2D sketch of the room outline on paper. Mark doorways, closet openings, bay windows, and fireplace hearths before writing down numbers.
              </li>
              <li className={styles.listItem}>
                <strong>Split Irregular Rooms:</strong> Break irregular shapes into clearly labelled rectangles on your sketch (e.g., &ldquo;Main Living Area&rdquo;, &ldquo;Entry Alcove&rdquo;, &ldquo;Coat Closet&rdquo;).
              </li>
              <li className={styles.listItem}>
                <strong>Measure Twice:</strong> Always verify each dimension twice. A 1-foot transcription mistake over a 20-foot span causes a 5% to 10% ordering error.
              </li>
              <li className={styles.listItem}>
                <strong>Record in Consistent Units:</strong> Record every measurement in feet and inches or decimal feet. Never mix inches and centimeters on the same job sheet.
              </li>
            </ul>

            <div className={styles.subsection}>
              <h3 className={styles.subHeading}>How to Figure Out Square Footage of a Room</h3>
              <p className={styles.paragraph}>
                To figure out the square footage of any standard room:
              </p>
              <ol className={styles.orderedList}>
                <li className={styles.listItem}>Extend your tape measure across the longest wall from corner to corner. Note the length (e.g., 15 feet).</li>
                <li className={styles.listItem}>Extend your tape measure across the adjacent perpendicular wall from corner to corner. Note the width (e.g., 12 feet).</li>
                <li className={styles.listItem}>Multiply length by width: <code>15 ft × 12 ft = 180 sq ft</code>.</li>
              </ol>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subHeading}>How to Work Out Square Feet of a Room with Closets &amp; Alcoves</h3>
              <p className={styles.paragraph}>
                When a bedroom includes an attached walk-in closet or recessed alcove, measure each section independently and use the add/subtract method:
              </p>
              <ul className={styles.unorderedList}>
                <li className={styles.listItem}><strong>Main Bedroom Area:</strong> 14 ft × 12 ft = <strong>168 sq ft</strong></li>
                <li className={styles.listItem}><strong>Walk-In Closet (Add):</strong> 6 ft × 5 ft = <strong>30 sq ft</strong></li>
                <li className={styles.listItem}><strong>Brick Fireplace Hearth (Subtract):</strong> 4 ft × 2 ft = <strong>−8 sq ft</strong> (no flooring installed over raised masonry)</li>
                <li className={styles.listItem}><strong>Net Finished Flooring Area:</strong> <code>168 + 30 − 8 = 190 sq ft</code></li>
              </ul>
            </div>
          </section>

          {/* Section 6: Practical Worked Example: How to Calculate Square Footage for Multiple Rooms */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Practical Worked Example: How to Calculate Square Footage for Multiple Rooms</h2>
            <p className={styles.paragraph}>
              When planning a whole-home flooring installation or complete interior painting project, calculating room by room ensures you order the correct quantities without unexpected budget shortfalls. Consider this real-world example for installing luxury vinyl plank (LVP) across a main level:
            </p>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Room / Space</th>
                    <th>Dimensions (ft)</th>
                    <th>Net Square Footage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Living Room</strong></td>
                    <td>18 ft × 14 ft</td>
                    <td>252 sq ft</td>
                  </tr>
                  <tr>
                    <td><strong>Master Bedroom</strong></td>
                    <td>15 ft × 13 ft</td>
                    <td>195 sq ft</td>
                  </tr>
                  <tr>
                    <td><strong>Guest Bedroom</strong></td>
                    <td>12 ft × 11 ft</td>
                    <td>132 sq ft</td>
                  </tr>
                  <tr>
                    <td><strong>Hallway</strong></td>
                    <td>3.5 ft × 16 ft</td>
                    <td>56 sq ft</td>
                  </tr>
                  <tr className={styles.highlightRow}>
                    <td><strong>Net Total Area</strong></td>
                    <td>Sum of all 4 spaces</td>
                    <td><strong>635 sq ft</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className={styles.paragraph}>
              <strong>Step 1: Calculate Net Area:</strong><br />
              <code>252 + 195 + 132 + 56 = 635 sq ft</code>
            </p>
            <p className={styles.paragraph}>
              <strong>Step 2: Add 10% Waste Factor for Planks &amp; Trims:</strong><br />
              <code>635 sq ft × 1.10 = 698.5 sq ft</code> (Always round up to the next full box or square foot: <strong>700 sq ft</strong>).
            </p>
            <p className={styles.paragraph}>
              <strong>Step 3: Calculate Total Material Cost at $3.25 / sq ft:</strong><br />
              <code>700 sq ft × $3.25 = $2,275.00</code> total material budget.
            </p>
          </section>

          {/* Section 7: Square Feet to Square Meters and Other Area Conversions */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Square Feet to Square Meters and Other Area Conversions</h2>
            <p className={styles.paragraph}>
              Because construction drawings and imported finishes frequently alternate between imperial and metric standards, converting square feet to square meters and other units is an essential contractor skill.
            </p>

            <div className={styles.subsection}>
              <h3 className={styles.subHeading}>Converting Square Feet to Square Meters (m²)</h3>
              <p className={styles.paragraph}>
                One international linear foot is defined as exactly 0.3048 meters. Squaring both sides yields <code>1 sq ft = 0.3048 × 0.3048 = 0.09290304 square meters</code>. To convert square feet to square meters, multiply square footage by 0.09290304 (or divide by 10.7639).
              </p>
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Square Feet (sq ft)</th>
                      <th>Square Meters (m²)</th>
                      <th>Formula Applied</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SQFT_TO_M2_DATA.map((row) => (
                      <tr key={row.sqft}>
                        <td><strong>{row.sqft.toLocaleString()} sq ft</strong></td>
                        <td>{row.m2} m²</td>
                        <td><code>{row.sqft} × 0.09290304</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subHeading}>Meters to Square Feet</h3>
              <p className={styles.paragraph}>
                To convert square meters to square feet, multiply the area in square meters by <strong>10.7639</strong> (or divide by 0.09290304). For example, a 75 m² European apartment equals <code>75 × 10.7639 ≈ 807.29 square feet</code>.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subHeading}>Square Inches to Square Feet</h3>
              <p className={styles.paragraph}>
                Because one linear foot equals 12 inches, one square foot equals <code>12 × 12 = 144 square inches</code>. To convert square inches to square feet, <strong>divide the square inches by 144</strong>. For instance, a granite countertop measuring 3,456 square inches equals <code>3,456 ÷ 144 = 24 square feet</code>.
              </p>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subHeading}>Master Area Conversion Factors</h3>
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Unit of Measurement</th>
                      <th>Equivalent in Square Feet (sq ft)</th>
                      <th>Conversion Formula</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>1 Square Foot (sq ft)</strong></td>
                      <td>1.00 sq ft</td>
                      <td>1 ft × 1 ft (144 sq in)</td>
                    </tr>
                    <tr>
                      <td><strong>1 Square Yard (sq yd)</strong></td>
                      <td>9.00 sq ft</td>
                      <td><code>Sq Yd × 9</code></td>
                    </tr>
                    <tr>
                      <td><strong>1 Square Meter (m²)</strong></td>
                      <td>10.7639 sq ft</td>
                      <td><code>m² × 10.7639</code></td>
                    </tr>
                    <tr>
                      <td><strong>144 Square Inches (sq in)</strong></td>
                      <td>1.00 sq ft</td>
                      <td><code>Sq In ÷ 144</code></td>
                    </tr>
                    <tr>
                      <td><strong>1 Acre</strong></td>
                      <td>43,560 sq ft</td>
                      <td><code>Acres × 43,560</code></td>
                    </tr>
                    <tr>
                      <td><strong>1 Square Mile</strong></td>
                      <td>27,878,400 sq ft</td>
                      <td><code>Sq Miles × 27,878,400</code> (640 Acres)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 8: Common Room Sizes in Square Feet */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Common Room Sizes in Square Feet</h2>
            <p className={styles.paragraph}>
              When planning a remodel or purchasing home furnishings, understanding typical room dimensions helps benchmark project scale. The table below provides <em>example dimensions</em> for reference—actual room sizes vary considerably based on architectural design and local building traditions:
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Room Type (Example Only)</th>
                    <th>Typical Dimensions (ft)</th>
                    <th>Total Square Footage</th>
                    <th>Typical Usage &amp; Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {COMMON_ROOM_SIZES.map((r, i) => (
                    <tr key={i}>
                      <td><strong>{r.room}</strong></td>
                      <td>{r.dimensions}</td>
                      <td><strong>{r.sqft} sq ft</strong></td>
                      <td>{r.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.noteText}>
              <em>Note:</em> The figures above are real-world design examples, not legal minimums or nationwide averages. Always measure your specific rooms with a tape measure or laser distance meter before purchasing materials.
            </p>
          </section>

          {/* Section 9: Related Calculators & Construction Tools */}
          <section className={styles.relatedSection}>
            <h2 className={styles.sectionHeading}>Related Calculators &amp; Construction Tools</h2>
            <p className={styles.paragraph}>
              Expand your estimating toolkit with our verified, live construction and material calculators:
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
          <AdSlot slotId="sqft-calc-middle" />

          {/* Section 10: Square Footage Calculator FAQ (Exact 8 questions) */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Square Footage Calculator FAQ</h2>
            <Faq items={SQUARE_FOOTAGE_FAQS} />
          </section>

          {/* Section 11: Real Estate GLA Rules & Closing Wrap-Up */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Real Estate Gross Living Area (GLA) Rules &amp; Final Thoughts</h2>
            <p className={styles.paragraph}>
              In United States residential real estate, house square footage is strictly defined by the American National Standards Institute (ANSI Z765) standard for Gross Living Area (GLA). Licensed appraisers and Multiple Listing Services (MLS) adhere to strict criteria when calculating official home square footage:
            </p>
            <ul className={styles.unorderedList}>
              <li className={styles.listItem}>
                <strong>Above-Grade Only:</strong> Any level of a house that is even partially below grade (ground level), such as walk-out or daylight basements, cannot be included in official above-grade GLA, even if fully finished to match main level luxury finishes.
              </li>
              <li className={styles.listItem}>
                <strong>Finished &amp; Heated Living Space:</strong> Spaces must be permanently finished, fully enclosed, and conditioned with a permanent heating system. Unfinished basements, storage sheds, open screened porches, and attached garages are excluded.
              </li>
              <li className={styles.listItem}>
                <strong>Minimum Ceiling Heights:</strong> Habitable rooms must have a minimum ceiling height of 7 feet (84 inches). For rooms with sloped ceilings (such as finished attic bedrooms), at least 50% of the room must have a ceiling height of 7 feet or higher, and floor space with ceiling height under 5 feet cannot be counted toward finished GLA.
              </li>
              <li className={styles.listItem}>
                <strong>Exterior Measurement Standard:</strong> Detached single-family homes are measured from exterior wall surfaces, which includes the thickness of exterior framing and drywall.
              </li>
            </ul>
            <p className={styles.closingParagraph}>
              Whether you are preparing a property listing, calculating vinyl plank flooring for three bedrooms, or measuring an irregular patio, having an accurate <strong>sqft calculator</strong> eliminates guesswork, prevents expensive contractor change orders, and saves hours of manual math. Bookmark this page for all your future home renovation and construction estimating needs.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
