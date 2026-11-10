import { Metadata } from 'next';
import Link from 'next/link';
import { BrickCalculator } from '@/components/tool/brick-calculator';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { SITE_NAME, SITE_URL } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: 'Brick Calculator (Brick Wall & Mortar)',
  description:
    'Free brick calculator to estimate bricks, mortar bags, and pallets for any wall. Supports standard, modular, king sizes, window deductions, waste, and costs.',
  path: '/brick-calculator/',
});

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Brick Calculator',
    url: `${SITE_URL}/brick-calculator/`,
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
      'Calculate exact brick count, mortar bags, pallet quantities, and total material costs for single and double wythe brick walls with opening deductions.',
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
        name: 'Brick Calculator',
        item: `${SITE_URL}/brick-calculator/`,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How many bricks do I need per square foot?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For standard US Modular bricks (3-5/8" x 2-1/4" x 7-5/8") laid with a standard 3/8" mortar joint, you need exactly 6.86 bricks per square foot of wall area. For Standard US bricks (3-5/8" x 2-1/4" x 8"), you need approximately 6.55 bricks per square foot. Always add a 5% to 10% waste factor for cutting and breakage.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many bricks are in a full pallet?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most manufacturers pack standard US modular bricks in pallets (or cubes) of 500 to 534 bricks. King size and Queen size brick pallets typically hold 400 to 500 bricks depending on brick weight, keeping the total pallet weight under 2,000 to 2,400 lbs for standard forklift handling.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much mortar do I need for 1,000 bricks?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'As a reliable industry rule of thumb, you will need approximately 7 to 8 standard 80-pound bags (or 9 to 11 60-pound bags) of pre-mixed Type N or Type S masonry mortar per 1,000 standard modular bricks laid with a 3/8-inch mortar joint. If using site-mixed mortar, plan on approximately 1 cubic yard of mixed mortar per 1,000 bricks.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between single wythe and double wythe brick walls?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A single wythe wall is a single layer of brick (typically 3-5/8" to 4" thick), commonly used as an exterior aesthetic brick veneer over wood framing, steel studs, or concrete block backings. A double wythe wall consists of two parallel layers of brick tied together with masonry ties, forming a thick, self-supporting structural solid masonry wall that requires exactly double the number of bricks.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the standard mortar joint thickness for brick masonry?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The standard mortar joint thickness in the United States and Canada is 3/8 inch (0.375 inches or ~9.5 mm). Some historic or rustic brick profiles utilize a thicker 1/2-inch joint. When you add a 3/8-inch mortar bed to a standard modular brick (7-5/8" length x 2-1/4" height), the nominal modular dimensions become exactly 8 inches long by 2-2/3 inches high, allowing exactly 3 vertical brick courses every 8 inches.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much waste should I allow when buying bricks?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We recommend a standard waste factor of 10% for straight rectangular walls. For complex architectural layouts featuring arches, multiple window returns, gables, soldier courses, or herringbone patterns requiring extensive wet-saw cuts, increase the waste factor to 15%. Leftover bricks should always be saved for future repairs.',
        },
      },
    ],
  },
];

export default function BrickCalculatorPage() {
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
            <li style={{ color: '#0F172A', fontWeight: 500 }} aria-current="page">Brick Calculator</li>
          </ol>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Brick Calculator (Brick Wall &amp; Mortar Estimator)
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
            Accurately calculate the exact number of bricks, pre-mixed mortar bags, and pallets needed for your wall project using our free <strong>brick wall calculator</strong>. Supports standard US modular, king, queen sizes, single vs double wythe construction, and window/door deductions.
          </p>
        </header>

        {/* Interactive Tool */}
        <section aria-label="Brick Calculator Tool">
          <BrickCalculator />
        </section>

        {/* Ad Placeholder */}
        <AdSlot slotId="brick-calc-middle" />

        {/* Informational SEO Content */}
        <article style={{ marginTop: '48px', color: '#334155', lineHeight: 1.7, fontSize: '0.975rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            How to Calculate Bricks for a Wall (Step-by-Step)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Whether you are building an exterior brick veneer siding, a front porch planter box, or a freestanding double-wythe garden perimeter, estimating masonry quantities requires calculating four fundamental dimensions:
          </p>

          <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Measure Wall Dimensions &amp; Gross Surface Area:</strong> Measure the planned wall length and height in feet. Multiply them together to find the gross wall face area in square feet. For instance, a 20-foot wall that stands 8 feet high has a gross surface area of 160 sq ft. For complex room or perimeter measurements, use our <Link href="/square-footage-calculator/" style={{ color: '#0284C7' }}>square footage calculator</Link>.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Deduct Door &amp; Window Openings:</strong> Calculate the square footage of any openings (e.g., standard exterior door = 20.4 sq ft, window = 12 sq ft) and subtract this from the gross surface area to find your true <em>net wall area</em>.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Determine Bricks per Square Foot:</strong> In the United States, modular bricks have an actual face of 7-5/8&quot; length by 2-1/4&quot; height. Adding a standard 3/8&quot; (0.375&quot;) mortar joint results in a nominal face of 8&quot; × 2-5/8&quot; (21 sq inches). Dividing 144 sq inches by 21 gives exactly <strong>6.86 bricks per square foot</strong>.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Add a 10% Waste Factor:</strong> Masonry work involves cutting half-bricks at corner leads, cutting angles around jambs, and natural transit breakage. Ordering 10% additional bricks ensures you have identical kiln color batching without mid-project work stoppages.
            </li>
          </ol>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Standard US Brick Dimensions &amp; How Many Bricks Per Square Foot
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Wondering <strong>how many bricks per square foot</strong> you need for different masonry bonds? Use the chart below to compare dimensions, coverage rates, and <strong>how many bricks in a pallet</strong> for common North American masonry units:
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Brick Type</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Actual Dimensions (D × H × L)</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Nominal Face (H × L)</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Bricks / Sq Ft</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Typical Application</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Modular (Default)</td>
                  <td style={{ padding: '10px 14px' }}>3-5/8&quot; × 2-1/4&quot; × 7-5/8&quot;</td>
                  <td style={{ padding: '10px 14px' }}>2-5/8&quot; × 8&quot;</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>6.86</td>
                  <td style={{ padding: '10px 14px' }}>Most popular US residential veneer; 3 courses = 8&quot;</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Standard US</td>
                  <td style={{ padding: '10px 14px' }}>3-5/8&quot; × 2-1/4&quot; × 8&quot;</td>
                  <td style={{ padding: '10px 14px' }}>2-5/8&quot; × 8-3/8&quot;</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>6.55</td>
                  <td style={{ padding: '10px 14px' }}>Traditional home brickwork and garden edges</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Queen</td>
                  <td style={{ padding: '10px 14px' }}>2-3/4&quot; × 2-3/4&quot; × 7-5/8&quot;</td>
                  <td style={{ padding: '10px 14px' }}>3-1/8&quot; × 8&quot;</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>5.76</td>
                  <td style={{ padding: '10px 14px' }}>Economical residential veneer; faster coverage</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>King</td>
                  <td style={{ padding: '10px 14px' }}>2-5/8&quot; × 2-5/8&quot; × 9-5/8&quot;</td>
                  <td style={{ padding: '10px 14px' }}>3&quot; × 10&quot;</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>4.80</td>
                  <td style={{ padding: '10px 14px' }}>Large commercial facades &amp; modern suburban builds</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Closure / Engineer</td>
                  <td style={{ padding: '10px 14px' }}>3-5/8&quot; × 3-1/4&quot; × 7-5/8&quot;</td>
                  <td style={{ padding: '10px 14px' }}>3-5/8&quot; × 8&quot;</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>4.97</td>
                  <td style={{ padding: '10px 14px' }}>Structural columns, heavy headers, foundation veneer</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Roman</td>
                  <td style={{ padding: '10px 14px' }}>3-5/8&quot; × 1-5/8&quot; × 11-5/8&quot;</td>
                  <td style={{ padding: '10px 14px' }}>2&quot; × 12&quot;</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>6.00</td>
                  <td style={{ padding: '10px 14px' }}>Mid-century modern homes and long linear accents</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Utility</td>
                  <td style={{ padding: '10px 14px' }}>3-5/8&quot; × 3-5/8&quot; × 11-5/8&quot;</td>
                  <td style={{ padding: '10px 14px' }}>4&quot; × 12&quot;</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>3.00</td>
                  <td style={{ padding: '10px 14px' }}>Acoustic barrier walls, rapid commercial construction</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            How Much Mortar Do I Need for Bricks? (How Much Mortar for 1000 Bricks)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            If you need to know <strong>how much mortar for 1000 bricks</strong>, masonry mortar binds the bricks together and provides compressive load transfer and water resistance. As a standard rule of thumb:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>80 lb Pre-Mixed Mortar Bags (Type N or S):</strong> One 80 lb bag lays approximately 120 to 140 modular bricks with 3/8&quot; joints. That equates to roughly <strong>7.5 bags per 1,000 bricks</strong>.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>60 lb Pre-Mixed Mortar Bags:</strong> One 60 lb bag lays approximately 90 to 105 modular bricks, or roughly <strong>10 bags per 1,000 bricks</strong>.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Site-Mixed Mortar:</strong> If mixing mortar on site from bulk masonry cement and sand, calculate using our <Link href="/sand-calculator/" style={{ color: '#0284C7' }}>sand calculator</Link>. A batch for 1,000 bricks typically requires 1 ton of masonry sand and 7 bags of cement.
            </li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Single Wythe vs. Double Wythe Brick Walls
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Understanding wall structure determines whether you multiply your brick total by 1 or 2:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>Single Wythe (1 Brick Thick)</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '8px' }}>
                A single outer brick skin (~3-5/8&quot; thick) anchored to an interior timber, steel, or <Link href="/cinder-block-calculator/" style={{ color: '#0284C7' }}>concrete cinder block backing wall</Link> using wall ties. This is the standard construction for residential home veneers.
              </p>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>Double Wythe (2 Bricks Thick)</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '8px' }}>
                A solid masonry wall built with two parallel layers of brick (~8&quot; thick) tied together. These walls are self-supporting and structural, meaning you must order <strong>exactly double the number of bricks</strong>.
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                How many bricks do I need per square foot?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                For standard US Modular bricks (3-5/8&quot; × 2-1/4&quot; × 7-5/8&quot;) laid with a standard 3/8&quot; mortar joint, you need exactly 6.86 bricks per square foot of wall area. For Standard US bricks (3-5/8&quot; × 2-1/4&quot; × 8&quot;), you need approximately 6.55 bricks per square foot.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                How many bricks are in a full pallet?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                Most masonry yards package standard modular bricks in pallets of 500 to 534 bricks. King size and Queen size pallets typically hold 400 to 500 bricks to keep total pallet weight under 2,400 lbs for standard forklift unloading.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                How much mortar do I need for 1,000 bricks?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                You will need approximately 7 to 8 standard 80-pound bags (or 9 to 11 60-pound bags) of pre-mixed Type N or Type S mortar per 1,000 standard modular bricks laid with 3/8-inch joints.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                What is the difference between single wythe and double wythe brick walls?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                A single wythe wall is a single layer of brick (typically 3-5/8&quot; thick) used as an aesthetic veneer over wood or CMU blocks. A double wythe wall consists of two parallel brick courses tied together to create a solid load-bearing wall, requiring double the bricks.
              </p>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
