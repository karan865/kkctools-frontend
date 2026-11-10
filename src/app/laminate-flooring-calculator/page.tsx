import { Metadata } from 'next';
import Link from 'next/link';
import { LaminateCalculator } from '@/components/tool/laminate-calculator';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { SITE_NAME, SITE_URL } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: 'Laminate Flooring Calculator (Boxes & Cost)',
  description:
    'Free laminate flooring calculator to estimate square footage, boxes needed, underlayment rolls, and total costs. Accounts for room shape, waste %, and pricing.',
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
      'Calculate exact laminate flooring square footage, boxes to purchase, underlayment rolls, and total DIY material and professional contractor costs.',
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
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I calculate how many boxes of laminate flooring I need?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'To calculate boxes of laminate flooring: (1) Multiply room length by width in feet to find net square footage. (2) Add a 10% waste factor for straight installation (or 15% for diagonal/herringbone layouts). (3) Check the box coverage on your chosen flooring (typically 18 to 24 sq ft per box). (4) Divide the gross square footage by the box coverage and round up to the nearest whole box.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many square feet are in a typical box of laminate flooring?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most standard retail boxes of laminate flooring contain between 18 and 24 square feet of coverage, with 20 to 22 square feet being the most common industry average. Wide-plank or thicker 12mm laminate boxes often cover 14 to 18 square feet due to carton weight limitations.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much extra laminate flooring should I order for waste?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For standard straight-run installations in rectangular rooms, add a 10% waste factor to account for end-of-row cuts, doorway transitions, and minor plank damage. For rooms with multiple angled walls, closets, hallway alcoves, or diagonal/herringbone patterns, increase the waste factor to 15% to 20%.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need underlayment for laminate flooring?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, laminate flooring always requires underlayment to provide sound dampening, thermal insulation, and a smooth subfloor cushion. However, many modern laminate planks come with pre-attached acoustic padding. If your flooring has pre-attached pad, you only need to lay a 6-mil poly vapor barrier over concrete subfloors.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does professional laminate flooring installation cost per square foot?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Professional laminate flooring installation typically costs between $2.00 and $5.00 per square foot for labor alone. For a typical 400 square foot living room, labor runs between $800 and $2,000. Basic DIY installation saves approximately 60% to 75% of the total project expense.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why do I need to leave an expansion gap around the perimeter?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Laminate flooring consists of high-density fiberboard (HDF) that naturally expands and contracts with changes in room temperature and seasonal humidity. Always leave a 3/8-inch (or 1/4-inch) expansion gap along all walls, doorframes, and vertical obstacles, which will be concealed by baseboards or quarter-round shoe molding.',
        },
      },
    ],
  },
];

export default function LaminateFlooringCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main-content" style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '13px', color: '#64748B' }}>
          <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, alignItems: 'center' }}>
            <li>
              <Link href="/" style={{ color: '#0284C7', textDecoration: 'none' }}>Home</Link>
            </li>
            <li style={{ margin: '0 8px', color: '#94A3B8' }} aria-hidden="true">›</li>
            <li>
              <Link href="/tools/" style={{ color: '#0284C7', textDecoration: 'none' }}>Calculators</Link>
            </li>
            <li style={{ margin: '0 8px', color: '#94A3B8' }} aria-hidden="true">›</li>
            <li style={{ color: '#0F172A', fontWeight: 500 }} aria-current="page">Laminate Flooring Calculator</li>
          </ol>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Laminate Flooring Calculator (Boxes, Sq Ft &amp; Cost)
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
            Accurately calculate <strong>how much laminate flooring do I need</strong> in total square feet and full retail boxes. This comprehensive <strong>laminate flooring square footage calculator</strong> and <strong>laminate floor cost calculator</strong> factors in pattern cut waste, underlayment rolls, perimeter baseboard lengths, and total DIY vs professional installation costs.
          </p>
        </header>

        {/* Interactive Tool */}
        <section aria-label="Laminate Flooring Calculator Tool">
          <LaminateCalculator />
        </section>

        {/* Ad Placeholder */}
        <AdSlot slotId="laminate-calc-middle" />

        {/* Comprehensive SEO Content */}
        <article style={{ marginTop: '48px', color: '#334155', lineHeight: 1.7, fontSize: '0.975rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            How Many Boxes of Laminate Flooring Do I Need? (How to Calculate Laminate Flooring)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Planning to upgrade your living room, bedroom, or entire home with durable, modern floating laminate flooring? When homeowners ask <em>&quot;how many boxes of laminate flooring do I need?&quot;</em>, the answer depends on your net floor dimensions, scrap cuts, and individual carton packaging. Underestimating materials leads to stressful mid-project halts, backordered dye-lots, and mismatched plank textures. Overestimating leaves you with heavy, expensive boxes taking up storage space. Our <strong>laminate flooring calculator</strong> streamlines your entire <strong>flooring computation</strong> through five simple mathematical steps:
          </p>

          <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Measure Room Dimensions &amp; Calculate Net Square Footage:</strong> Measure the maximum length and width of the room in feet. Multiply them together to find the net floor surface area in square feet: Length × Width. For example, an 18 ft × 14 ft master bedroom has a net area of 252 sq ft. For irregular rooms, hallway alcoves, or multi-room layouts, sum individual zones using our <Link href="/square-footage-calculator/" style={{ color: '#0284C7' }}>square footage calculator</Link>.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Add the Laminate Flooring Waste Factor (10% to 18%):</strong> Laminate planks must be cut at the end of every row, around door jambs, heating vents, and closet angles. Incorporating an accurate <strong>laminate flooring waste factor</strong> is essential: add 10% for straight parallel installations, 12% for random staggered offset, 15% for 45-degree diagonal layouts, and 18% for herringbone or chevron patterns.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Check Box Coverage (How Many Square Feet in a Box of Laminate Flooring):</strong> If you are wondering <em>how many square feet in a box of laminate flooring</em>, laminate flooring is packaged and sold in cardboard cartons based on thickness and <strong>laminate plank sizes</strong>. Standard 8mm laminate usually contains 20 to 24 sq ft per box, while thicker 12mm or waterproof planks provide 16 to 19 sq ft per box.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Divide Gross Area by Box Coverage and Round Up:</strong> Divide your total gross square footage (including waste) by the box coverage rate, then round up to the nearest whole integer: (Gross Area / Box Coverage). For 277.2 gross sq ft with 20 sq ft boxes, order 14 full boxes (providing 280 sq ft).
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Estimate Underlayment and Perimeter Moldings:</strong> Unless your laminate comes with pre-attached acoustic padding, standard foam rolls cover 100 sq ft each. Additionally, measure your room&apos;s perimeter using our <Link href="/linear-foot-calculator/" style={{ color: '#0284C7' }}>linear foot calculator</Link> to buy baseboards or quarter-round shoe molding to cover the expansion gap.
            </li>
          </ol>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Laminate Flooring Box Coverage &amp; Thickness Comparison Chart
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Laminate flooring cartons vary substantially based on board thickness, core density, and plank width:
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Laminate Type</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Thickness</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Typical Box Coverage</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Planks Per Box</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Ideal Room / Use Case</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Standard 8mm</td>
                  <td style={{ padding: '10px 14px' }}>7mm – 8mm</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>21.5 – 24.0 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>8 – 10 planks</td>
                  <td style={{ padding: '10px 14px' }}>Guest bedrooms, low-traffic apartments, budget renovations</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Mid-Grade 10mm</td>
                  <td style={{ padding: '10px 14px' }}>10mm</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>19.5 – 21.5 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>7 – 9 planks</td>
                  <td style={{ padding: '10px 14px' }}>Master bedrooms, dining rooms, home offices</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Premium 12mm AC4/AC5</td>
                  <td style={{ padding: '10px 14px' }}>12mm</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>16.0 – 18.5 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>6 – 8 planks</td>
                  <td style={{ padding: '10px 14px' }}>High-traffic living spaces, busy hallways, homes with large pets</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Waterproof Rigid Core</td>
                  <td style={{ padding: '10px 14px' }}>10mm – 12mm</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>18.0 – 20.5 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>6 – 8 planks</td>
                  <td style={{ padding: '10px 14px' }}>Kitchens, finished basements, laundry entryways</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Wide-Plank (7&quot; – 9&quot; Wide)</td>
                  <td style={{ padding: '10px 14px' }}>12mm</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>15.0 – 18.0 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>5 – 7 planks</td>
                  <td style={{ padding: '10px 14px' }}>Modern open-concept floor plans and expansive suites</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Layout Patterns &amp; How They Affect Waste Allowance
          </h2>
          <p style={{ marginBottom: '16px' }}>
            How you lay your laminate boards significantly alters the amount of off-cut scrap produced:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Straight Run (10% Waste):</strong> Planks run parallel to the longest wall or primary light source. The cutoff piece from the end of one row starts the next row, producing minimal scrap.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Random Staggered Offset (12% Waste):</strong> Ensures natural hardwood visual appeal while preventing weak &quot;H-joints&quot; or stair-step patterns across the floor.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Diagonal 45-Degree Layout (15% Waste):</strong> Boards run diagonally across the room, requiring triangular 45-degree cuts at both ends of every single row.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Herringbone &amp; Chevron (18% to 20% Waste):</strong> Requires specialized left-and-right tongue-and-groove planks with intricate perimeter angle trimming.
            </li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Cost to Install Laminate Flooring: DIY vs. Professional Labor
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Understanding the true <strong>cost to install laminate flooring</strong> helps budget trade-offs between a weekend DIY build and hiring a bonded flooring contractor:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>DIY Installation Costs ($1.50 – $3.50 / sq ft)</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '8px' }}>
                Primary costs include flooring cartons ($25–$80/box), foam underlayment rolls (~$40/roll), and transition trims ($15–$30/strip). DIY saves between 60% and 75% overall.
              </p>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>Professional Labor Costs ($2.00 – $5.00 / sq ft)</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '8px' }}>
                Flooring contractors charge $2 to $5 per square foot for click-lock floating floors, plus subfloor prep. For preparing detailed estimates, contractors use our <Link href="/construction-estimate-template/" style={{ color: '#0284C7' }}>construction estimate template</Link>.
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            4 Essential Pro Tips for a Flawless Laminate Installation
          </h2>
          <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Acclimate Your Flooring (48 Hours Minimum):</strong> Laminate planks expand and contract with temperature and humidity. Store unopened boxes flat in the installation room for at least 48 hours before installation.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Leave a 3/8-Inch Expansion Gap:</strong> Never install laminate tight against walls, door jambs, or posts. Always place plastic spacers along all wall edges to leave a continuous 3/8-inch expansion gap, which will be concealed by baseboards or quarter-round shoe molding.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Check Subfloor Flatness:</strong> High spots or low depressions greater than 3/16 inch over a 10-foot span must be sanded down or filled with self-leveling underlayment to prevent hollow clicking noises or seam separation.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Touch-Up Baseboards and Walls:</strong> After reinstalling baseboards and trims, touch up fresh nail holes and caulk lines with matching wall paint using our <Link href="/paint-cost-calculator/" style={{ color: '#0284C7' }}>paint cost calculator</Link>.
            </li>
          </ol>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                How do I calculate how many boxes of laminate flooring I need?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                Multiply room length by width to get net square footage, add a 10% waste factor for straight lay, check your chosen flooring&apos;s box coverage (typically 18 to 24 sq ft/box), and divide gross sq ft by box coverage rounding up to the nearest box.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                How many square feet are in a typical box of laminate flooring?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                Most standard retail boxes of laminate flooring contain between 18 and 24 square feet of coverage, with 20 to 22 square feet being the most common industry average.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                How much extra laminate flooring should I order for waste?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                Add 10% for standard straight-run installations in rectangular rooms. For rooms with multiple angled walls, closets, hallway alcoves, or diagonal/herringbone patterns, increase the waste factor to 15% to 20%.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                Do I need underlayment for laminate flooring?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                Yes, laminate flooring always requires underlayment for sound dampening and subfloor cushioning. If your laminate planks come with pre-attached acoustic padding, you only need to lay a 6-mil poly vapor barrier over concrete subfloors.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                Why do I need to leave an expansion gap around the perimeter?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                Laminate expands and contracts with changes in room temperature and humidity. A continuous 3/8-inch expansion gap along all walls prevents buckling and peaking, and is concealed by baseboards.
              </p>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
