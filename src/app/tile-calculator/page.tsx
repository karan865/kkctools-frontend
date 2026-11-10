import { Metadata } from 'next';
import Link from 'next/link';
import { TileCalculator } from '@/components/tool/tile-calculator';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { SITE_NAME, SITE_URL } from '@/config/site';

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
        name: 'Calculators',
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
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I calculate how many tiles I need?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'To calculate the number of tiles needed: (1) Find your room surface area in square inches (Length in inches x Width in inches). (2) Calculate the area of a single tile in square inches (Tile Length x Tile Width). (3) Divide the total surface area by the single tile area. (4) Add 10% to 15% for cuts, corners, and breakage.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many 12x12 tiles do I need for a 100 square foot room?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A standard 12" x 12" tile covers exactly 1.0 square foot. For a 100 square foot room, you need 100 base tiles. With a standard 10% waste allowance for cuts along the walls, you should order 110 tiles (approximately 11 standard 10-tile boxes).',
        },
      },
      {
        '@type': 'Question',
        name: 'How much extra tile should I order for waste?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For standard grid or straight-lay patterns, order 10% extra tile. For staggered running bond or offset subway tile, plan for 10% to 12%. For diagonal, herringbone, chevron, or mosaic tile layouts requiring angled cuts along every wall perimeter, order 15% to 20% extra.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many tiles are in a box?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Box packaging varies by manufacturer and tile size. Standard 12" x 12" ceramic tiles usually come in boxes of 10 to 15 tiles (10 to 15 sq ft). Large-format 12" x 24" porcelain tiles typically come in boxes of 6 to 8 tiles (12 to 16 sq ft). Classic 3" x 6" subway tiles are often sold in boxes of 80 to 100 tiles (10 to 12.5 sq ft).',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does professional tile installation cost per square foot?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Professional tile installation typically costs between $7 and $15 per square foot for standard ceramic floor tile, and $10 to $25 per square foot for porcelain, natural stone, or intricate shower/backsplash patterns. Labor includes surface preparation, underlayment, thin-set mortar, tile laying, and grouting.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much grout and thin-set mortar do I need?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'As a general guideline: one 50-pound bag of polymer-modified thin-set mortar covers approximately 60 to 90 square feet using a 1/4" x 3/8" square-notched trowel. A standard 25-pound bag of sanded or unsanded grout covers between 100 and 200 square feet depending on tile size and grout joint width.',
        },
      },
    ],
  },
];

export default function TileCalculatorPage() {
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
            <li style={{ color: '#0F172A', fontWeight: 500 }} aria-current="page">Tile Calculator</li>
          </ol>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Tile Calculator (Tile Sq Ft &amp; Boxes Needed)
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
            Accurately calculate the exact number of tiles, retail box counts, thin-set mortar, and grout needed for your floor, shower wall, or kitchen backsplash project. Accounts for standard dimensions, custom formats, and layout pattern waste.
          </p>
        </header>

        {/* Interactive Tool */}
        <section aria-label="Tile Calculator Tool">
          <TileCalculator />
        </section>

        {/* Ad Placeholder */}
        <AdSlot slotId="tile-calc-middle" />

        {/* Comprehensive SEO Content */}
        <article style={{ marginTop: '48px', color: '#334155', lineHeight: 1.7, fontSize: '0.975rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            How Many Tiles Do I Need? (Step-by-Step Formula)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Whether you are remodeling a master bathroom, building a zero-threshold walk-in shower, updating a kitchen backsplash with classic subway tiles, or installing wood-look porcelain planks across an open-concept living room, our <strong>tile sq ft calculator</strong> ensures you order the exact amount of material. Underestimating tile leads to frustrating installation delays and the risk of mismatched factory dye-lots, while overestimating leaves you with heavy, unreturnable surplus boxes. Follow these five fundamental steps to calculate your requirements:
          </p>

          <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Measure Surface Dimensions &amp; Square Footage:</strong> Measure the length and width of the floor or wall in feet and multiply them together. For example, a 10 ft × 12 ft kitchen floor has a total area of 120 sq ft. For irregular, triangular, or multi-room layouts, use our <Link href="/square-footage-calculator/" style={{ color: '#0284C7' }}>square footage calculator</Link> to sum individual sections.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Calculate the Square Footage of a Single Tile:</strong> Multiply the tile&apos;s face length by its width in inches, then divide by 144 to convert to square feet. A standard 12&quot; × 12&quot; tile equals exactly 1.0 sq ft, a 12&quot; × 24&quot; tile equals 2.0 sq ft, and a 3&quot; × 6&quot; subway tile is 0.125 sq ft (meaning 8 subway tiles cover 1 sq ft).
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Divide Total Area by Single Tile Area:</strong> Dividing your total square footage by the area of a single tile yields your base tile requirement. For 120 sq ft with 12&quot; × 12&quot; tiles, the base requirement is 120 tiles.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Add the Pattern Waste Allowance (10% to 20%):</strong> Tiles must be cut along baseboards, door casings, vanity corners, and plumbing rough-ins. Add 10% for straight grid patterns, 12% for offset/running bond, and 15% to 20% for diagonal, chevron, or herringbone patterns.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Round Up to Whole Retail Boxes:</strong> Tiles are sold in cardboard boxes. Divide your total tile count by the tiles-per-box count on the packaging and round up to the nearest integer. Surplus tiles should always be saved for future plumbing repairs.
            </li>
          </ol>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Standard Tile Sizes &amp; Coverage Reference Chart
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Use the reference table below to check face dimensions, square foot coverage, and typical applications for popular residential and commercial tiles:
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Tile Format</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Dimensions (Inches)</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Area per Tile</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Tiles per Sq Ft</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Typical Application</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Standard Floor</td>
                  <td style={{ padding: '10px 14px' }}>12&quot; × 12&quot;</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>1.000 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>1.0</td>
                  <td style={{ padding: '10px 14px' }}>Bathroom floors, laundry rooms, utility spaces</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Large Format Modern</td>
                  <td style={{ padding: '10px 14px' }}>12&quot; × 24&quot;</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>2.000 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>0.5</td>
                  <td style={{ padding: '10px 14px' }}>Modern living spaces, master baths, shower walls</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Wood-Look Plank</td>
                  <td style={{ padding: '10px 14px' }}>6&quot; × 24&quot;</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>1.000 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>1.0</td>
                  <td style={{ padding: '10px 14px' }}>Kitchens, basements, hallways (timber aesthetic)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Classic Subway</td>
                  <td style={{ padding: '10px 14px' }}>3&quot; × 6&quot;</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>0.125 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>8.0</td>
                  <td style={{ padding: '10px 14px' }}>Kitchen backsplashes, shower walls, tub surrounds</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Modern Subway</td>
                  <td style={{ padding: '10px 14px' }}>4&quot; × 12&quot;</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>0.333 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>3.0</td>
                  <td style={{ padding: '10px 14px' }}>Contemporary backsplashes and vertical stack patterns</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Extra Large Format</td>
                  <td style={{ padding: '10px 14px' }}>24&quot; × 24&quot;</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>4.000 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>0.25</td>
                  <td style={{ padding: '10px 14px' }}>Commercial entries and seamless modern open-floors</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Tile Layout Patterns &amp; How They Affect Waste
          </h2>
          <p style={{ marginBottom: '16px' }}>
            The arrangement and angle of your tile installation determines the amount of off-cut scrap you produce:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Standard Straight Grid (10% Waste):</strong> Continuous straight rows with horizontal and vertical lines parallel to the walls. Simplest layout with minimal offcuts.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Running Bond / 50% Offset (12% Waste):</strong> Each row is offset by half a tile length, resembling traditional brickwork. Popular for subway and wood-plank tiles.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Diagonal / 45-Degree Angle (15% Waste):</strong> Tiles laid at a 45-degree angle to the room perimeter make compact rooms look wider, but require triangular cuts along every single perimeter edge.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Herringbone &amp; Chevron (15% to 20% Waste):</strong> Intricate V-shaped zigzag layout. Every end border requires 45-degree angled cuts, generating significant scrap.
            </li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Tile Installation Cost: DIY vs. Professional Labor (How Much Grout Do I Need)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Understanding your project budget and knowing <strong>how much grout do I need</strong> helps evaluate contractor quotes against DIY savings:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>DIY Tile Materials ($3.00 – $8.00 / sq ft)</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '8px' }}>
                Primary costs include tile boxes ($1.50–$6.00/sq ft for ceramic or porcelain), 50 lb bags of thin-set mortar (~$28/bag), and 25 lb bags of grout (~$20/bag).
              </p>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>Professional Installation ($7.00 – $15.00 / sq ft)</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '8px' }}>
                Contractors charge $7 to $15 per square foot for floor tiling and $12 to $25 per sq ft for shower enclosures. For creating itemized quotes, contractors use our <Link href="/construction-estimate-template/" style={{ color: '#0284C7' }}>construction estimate template</Link>.
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Subway Tile Backsplash &amp; Shower Calculations
          </h2>
          <p style={{ marginBottom: '16px' }}>
            When using our <strong>subway tile calculator</strong> mode for kitchen backsplashes or walk-in showers, take note of the area deductions and perimeter trims:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Backsplash Outlets &amp; Windows:</strong> Kitchen backsplashes typically span 30 to 45 square feet. Subtract window openings, but do not deduct small electrical outlet boxes because cutting around them creates waste rather than saves tiles.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Walk-in Shower Walls:</strong> Shower walls require waterproofing backer board (like cement board or Schluter Kerdi). For walls meeting ceilings, ensure you use moisture-resistant ceiling paint using our <Link href="/paint-cost-calculator/" style={{ color: '#0284C7' }}>paint cost calculator</Link>.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Tile Bullnose &amp; Schluter Trim:</strong> Measure the perimeter edges where raw tile edges will be exposed (shower niches, curb edges, backsplash ends) using our <Link href="/linear-foot-calculator/" style={{ color: '#0284C7' }}>linear foot calculator</Link> to order matching metal Schluter profiles or rounded bullnose trim.
            </li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                How do I calculate how many tiles I need?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                Measure your room square footage, calculate the area of one tile in square feet (Length × Width / 144), divide room area by single tile area, and add 10% to 15% for pattern cuts and breakage.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                How many 12x12 tiles do I need for a 100 square foot room?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                A 12&quot; × 12&quot; tile covers exactly 1.0 square foot. For 100 square feet, you need 100 base tiles. Adding a standard 10% waste factor equals 110 tiles (typically 11 boxes of 10 tiles).
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                How many tiles are in a box?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                Standard 12&quot; × 12&quot; tiles usually come 10 to 15 per box (10–15 sq ft). Large 12&quot; × 24&quot; tiles come 6 to 8 per box (12–16 sq ft), and 3&quot; × 6&quot; subway tiles come 80 to 100 per box.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                How much thin-set mortar and grout do I need?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                One 50-pound bag of polymer-modified thin-set mortar covers roughly 60 square feet. A 25-pound bag of grout covers approximately 150 square feet for 12x12 tiles with standard 1/8&quot; joints.
              </p>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
