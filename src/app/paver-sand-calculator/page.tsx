import type { Metadata } from 'next';
import Link from 'next/link';
import PaverSandCalculator from '@/components/tool/paver-sand-calculator';
import AdSlot from '@/components/ads/AdSlot';
import { SITE_NAME, SITE_URL } from '@/config/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Paver Sand Calculator (Bedding & Polymeric)',
  description:
    'Free paver sand calculator to calculate bedding sand and polymeric sand needed for patios and walkways. Estimate tons, cubic yards, and 50 lb bags.',
  alternates: {
    canonical: `${SITE_URL}/paver-sand-calculator/`,
  },
  openGraph: {
    title: 'Paver Sand Calculator (Bedding & Polymeric)',
    description:
      'Estimate ASTM C33 coarse concrete bedding sand (cubic yards & tons) and 50 lb polymeric joint locking sand bags with compaction allowances.',
    url: `${SITE_URL}/paver-sand-calculator/`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Paver Sand Calculator',
    url: `${SITE_URL}/paver-sand-calculator/`,
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
      'Interactive paver sand calculator to calculate coarse ASTM C33 bedding sand volume and polymeric joint locking sand bags for patios and walkways.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How deep should the sand bed be under pavers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The universal industry standard set by the Interlocking Concrete Pavement Institute (ICPI) is strictly 1 inch (25 mm) of uncompacted coarse concrete sand. Never install less than 3/4 inch or more than 1.5 inches of bedding sand. Excessive bedding sand creates an unstable foundation that shifts, ruts, and dips over time.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much polymeric sand do I need for a patio?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For standard 4x8 inch brick pavers with 1/8-inch joints, one 50 lb bag of polymeric sand covers approximately 75 to 90 square feet. For a typical 400 square foot patio, you will need 5 to 6 bags. For wide 1/4-inch to 1/2-inch joints or irregular flagstone, coverage drops to 30 to 45 square feet per bag.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use regular sand instead of polymeric sand for paver joints?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can use plain fine silica or mason sand, but it will quickly wash away during heavy rainstorms, blow away during leaf blowing, and provide zero protection against weed seeds or ant colonies. Polymeric sand contains chemical polymers that cure into an elastic rubbery bond that locks pavers firmly in place for 5 to 10 years.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many bags of sand do I need for 1 cubic yard?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'One cubic yard contains 27 cubic feet and weighs approximately 2,700 pounds. It takes 54 standard 50-pound bags of sand to equal one bulk cubic yard. For projects requiring more than 1 cubic yard, buying bulk delivered by dump truck is significantly cheaper.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should I sweep polymeric sand before or after compacting?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You should do both. First, lay all pavers on the uncompacted bedding sand. Next, run the plate compactor over the pavers to embed them into the sand bed. Then, sweep polymeric sand into the joints, run the plate compactor again to vibrate the sand deep into the joints, sweep a final touch-up pass, blow off all surface dust with a leaf blower, and mist with water.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best sand for under pavers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Always use washed, coarse concrete sand meeting ASTM C33 specifications. Its angular, jagged crystalline particles interlock under pressure to provide maximum stability while allowing proper drainage. Never use play sand, beach sand, or limestone screenings.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does polymeric sand take to dry and cure?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most premium polymeric sands require 24 to 48 hours of rain-free drying to cure fully. Keep foot traffic off the newly installed patio for at least 24 hours, and avoid parking passenger vehicles on paver driveways for a minimum of 72 hours.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I install polymeric sand if rain is forecasted?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. You should never apply polymeric sand if rain is predicted within 24 hours. Premature exposure to heavy rain before polymers fully cure will wash the resins out of the joints and spread a sticky white haze across the paver faces.',
        },
      },
    ],
  },
];

export default function PaverSandCalculatorPage() {
  const faqData = jsonLd[1] as { mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }> };

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
            <li style={{ color: '#0F172A', fontWeight: 500 }} aria-current="page">Paver Sand Calculator</li>
          </ol>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Free Paver Sand Calculator: Estimate Bedding Sand &amp; Polymeric Joint Sand
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
            Accurately estimate how much sand you need for your patio, walkway, or driveway using our free <strong>paver sand calculator</strong> (also functioning as a dedicated <strong>polymeric sand calculator</strong>, <strong>sand for pavers calculator</strong>, and <strong>paver joint sand calculator</strong>). Instantly compute bedding layer volume in cubic yards and tons alongside 50 lb bags of joint locking sand.
          </p>
        </header>

        {/* Interactive Tool */}
        <section aria-label="Paver Sand Calculator Tool">
          <PaverSandCalculator />
        </section>

        {/* Ad Placeholder Top */}
        <AdSlot slotId="paver-sand-top" />

        {/* Comprehensive SEO Editorial Content (2,800+ Words) */}
        <article style={{ marginTop: '48px', color: '#334155', lineHeight: 1.7, fontSize: '0.975rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            How Much Paver Sand Do I Need? Understanding Hardscape Foundations
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Planning a stunning new backyard patio, swimming pool deck, garden pathway, or brick paver driveway? Wondering <strong>how much paver sand do i need</strong> to complete your hardscaping job? The enduring beauty and structural longevity of any interlocking concrete paver installation depends almost entirely on the sand foundation beneath the stones and the joint locking sand swept between them. Yet, one of the most common pitfalls in DIY hardscaping is ordering the wrong type or wrong quantity of sand.
          </p>
          <p style={{ marginBottom: '16px' }}>
            Many homeowners and first-time DIYers do not realize that a professional paver installation requires <strong>two completely different types of sand</strong>:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Coarse Bedding Sand (ASTM C33 Concrete Sand):</strong> A uniform 1-inch layer of uncompacted, sharp, coarse concrete sand screeded directly over your compacted gravel road base. This layer provides a flexible, forgiving bedding plane that cushions the pavers, bridges minor subbase imperfections, and locks the bottom edges in place.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Polymeric Joint Locking Sand:</strong> A specialized blend of calibrated fine silica sand and high-performance polymer binders that is swept into the vertical joints between pavers, compacted, and activated with a fine water mist. Once cured, it forms an elastomeric, erosion-proof seal that prevents weed growth, eliminates ant burrowing, and transfers wheel and foot loads evenly across the entire surface.
            </li>
          </ul>
          <p style={{ marginBottom: '24px' }}>
            For the gravel base under your sand layer, visit our <Link href="/paver-base-calculator/" style={{ color: '#0284C7' }}>paver base calculator</Link>. For irregular curved patio layouts, measure your surface with our <Link href="/square-footage-calculator/" style={{ color: '#0284C7' }}>square footage calculator</Link>.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            How to Calculate Paver Sand for Patios and Walkways (Step-by-Step Formula)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            To accurately <strong>calculate paver sand</strong> quantities for any residential or commercial project, follow these verified five-step mathematical instructions:
          </p>

          <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Calculate Your Net Surface Area:</strong> Measure the total length and width of your planned patio, walkway, or driveway in feet. Multiply them together to find total square footage: Area (sq ft) = Length (ft) × Width (ft). For example, a 20-foot-wide by 15-foot-long rectangular patio has an area of: 20 ft × 15 ft = 300 square feet.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Determine Bedding Sand Volume in Cubic Feet:</strong> The Interlocking Concrete Pavement Institute (ICPI) strictly mandates a nominal bedding layer thickness of 1 inch (0.0833 feet). Multiply your surface area by the depth in feet: Bedding Volume (cu ft) = Area (sq ft) × (1 inch / 12) = 300 sq ft × 0.0833 ft = 25.0 cubic feet.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Convert Bedding Sand into Bulk Cubic Yards and US Short Tons:</strong> Commercial gravel yards sell bulk sand by the cubic yard or by the ton. Because 1 cubic yard equals 27 cubic feet:
              <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                <li>Cubic Yards = 25.0 cu ft / 27 = 0.926 cubic yards.</li>
                <li>Weight in Tons = 0.926 cu yds × 1.35 tons/yd³ = 1.25 tons.</li>
              </ul>
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Apply a 10% Compaction and Joint-Intrusion Buffer:</strong> When you run a mechanical vibratory plate compactor over the tops of newly laid pavers, the loose bedding sand below vibrates upward roughly 1/4 to 3/8 inch into the bottom of the paver joints. In addition, minor screeding spillage along perimeter edge restraints always occurs. Always add a 10% safety buffer: Total Bedding Sand to Order = 1.25 tons × 1.10 = <strong>1.38 US Short Tons (1.02 Cubic Yards)</strong>.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Calculate Polymeric Joint Sand Bags:</strong> Determine the total number of 50-pound polymeric sand bags based on your paver style, paver thickness, and joint gap width. For standard 4&quot; × 8&quot; brick pavers with standard 1/8-inch joints, one 50 lb bag covers approximately 85 square feet: Bags Required = (300 sq ft / 85 sq ft per bag) × 1.10 = 3.88 bags → Round up to <strong>4 Bags (50 lb each)</strong>.
            </li>
          </ol>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Bedding Sand vs. Polymeric Sand: Understanding the Two Layers
          </h2>
          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Installation Feature</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Coarse Bedding Sand (ASTM C33)</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Polymeric Joint Sand</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Primary Placement</td>
                  <td style={{ padding: '10px 14px' }}>1-inch uniform layer beneath the pavers</td>
                  <td style={{ padding: '10px 14px' }}>Swept into vertical joints between pavers</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Material Composition</td>
                  <td style={{ padding: '10px 14px' }}>100% natural, washed coarse concrete sand</td>
                  <td style={{ padding: '10px 14px' }}>Clean silica sand blended with polymer resins &amp; binders</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Grain Geometry</td>
                  <td style={{ padding: '10px 14px' }}>Sharp, angular, rough-edged particles</td>
                  <td style={{ padding: '10px 14px' }}>Fine, rounded, calibrated particles with binder coating</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Compacted Prior to Pavers?</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#DC2626' }}>NO — Screeded loose; compacted after pavers laid</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#166534' }}>YES — Vibrated into joints using plate compactor</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Water Activation Needed?</td>
                  <td style={{ padding: '10px 14px' }}>No water required during installation</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>YES — Activated with a gentle water mist spray</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Weed &amp; Ant Protection</td>
                  <td style={{ padding: '10px 14px' }}>None (structural bedding function only)</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#166534' }}>100% impenetrable barrier against weeds and insects</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Packaging &amp; Delivery</td>
                  <td style={{ padding: '10px 14px' }}>Bulk dump truck delivery or 50 lb bagged</td>
                  <td style={{ padding: '10px 14px' }}>Sealed, moisture-resistant plastic 50 lb bags</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Typical Cost (US Avg)</td>
                  <td style={{ padding: '10px 14px' }}>$35 to $55 per ton ($45/cu yd)</td>
                  <td style={{ padding: '10px 14px' }}>$24 to $36 per 50 lb bag</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Polymeric Sand Calculator: Bag Coverage &amp; Joint Sizes
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Joint sand requirements vary significantly depending on paver geometry. Thicker pavers have deeper vertical joints, while smaller pavers have more joint linear feet per square yard. Refer to this verified coverage chart when estimating 50-pound bags of polymeric sand:
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Paver Style &amp; Dimensions</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Typical Joint Width</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Coverage per 50 lb Bag</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Bags per 300 Sq Ft</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Bags per 500 Sq Ft</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Standard Brick Paver (4&quot; × 8&quot;, 2-3/8&quot; thick)</td>
                  <td style={{ padding: '10px 14px' }}>1/8&quot; (tight joint)</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>75 to 90 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>4 bags</td>
                  <td style={{ padding: '10px 14px' }}>6 to 7 bags</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Standard Brick Paver (4&quot; × 8&quot;, 2-3/8&quot; thick)</td>
                  <td style={{ padding: '10px 14px' }}>1/4&quot; (tumbled / wide)</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>40 to 50 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>7 to 8 bags</td>
                  <td style={{ padding: '10px 14px' }}>10 to 12 bags</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Modular 3-Piece Pattern (6×6, 6×9, 9×9)</td>
                  <td style={{ padding: '10px 14px' }}>1/8&quot; to 3/16&quot;</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>65 to 80 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>4 to 5 bags</td>
                  <td style={{ padding: '10px 14px' }}>7 to 8 bags</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Large Format Slabs (12×12, 16×16, 24×24)</td>
                  <td style={{ padding: '10px 14px' }}>1/8&quot; (modern tight)</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>110 to 135 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>3 bags</td>
                  <td style={{ padding: '10px 14px' }}>4 to 5 bags</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Natural Irregular Flagstone (1.5&quot; to 2&quot; thick)</td>
                  <td style={{ padding: '10px 14px' }}>1/4&quot; to 1/2&quot;</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>25 to 40 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>9 to 12 bags</td>
                  <td style={{ padding: '10px 14px' }}>13 to 20 bags</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Heavy-Duty Vehicular Pavers (3-1/8&quot; / 80mm)</td>
                  <td style={{ padding: '10px 14px' }}>1/8&quot;</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>55 to 70 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>5 to 6 bags</td>
                  <td style={{ padding: '10px 14px' }}>8 to 10 bags</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Why You Must Use ASTM C33 Concrete Sand (and Avoid Mason Sand)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            One of the costliest mistakes a DIY homeowner can make is using the wrong sand for the bedding layer:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>Sharp, Angular Edges:</strong> Washed concrete sand contains jagged, fractured quartz particles that interlock tightly under pressure, creating a rigid bedding plane that will not liquefy or shift.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Superior Drainage:</strong> Coarse sand allows surface water that penetrates the paver joints to percolate downward into the gravel base without ponding.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Never Use Mason Sand:</strong> Grains are round, fine, and smooth. When subjected to rain, mason sand acts like fluid ball bearings, causing pavers to sink unevenly under foot traffic.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Never Use Stone Dust:</strong> Stone dust contains fine limestone and clay particles that hold water like a sponge. In freeze-thaw climates, water trapped in stone dust freezes, expands, and heaves pavers upward, destroying your patio surface.
            </li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Real-World Worked Examples: Patios, Walkways &amp; Driveways
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
            <div style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>Backyard Dining Patio (300 Sq Ft)</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '10px' }}>20 ft × 15 ft · 4&quot; × 8&quot; Pavers · 1/8&quot; Joints</p>
              <ul style={{ paddingLeft: '18px', fontSize: '0.9rem', color: '#334155', margin: 0 }}>
                <li>Bedding Sand: <strong>1.02 Cubic Yards</strong> (1.38 Tons)</li>
                <li>Polymeric Sand: <strong>4 Bags</strong> (50 lb each)</li>
                <li>Est. Total Cost: <strong>~$167.20</strong></li>
              </ul>
            </div>
            <div style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>Front Walkway (180 Sq Ft)</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '10px' }}>45 ft × 4 ft · 3-Piece Cobble · 3/16&quot; Joints</p>
              <ul style={{ paddingLeft: '18px', fontSize: '0.9rem', color: '#334155', margin: 0 }}>
                <li>Bedding Sand: <strong>0.61 Cubic Yards</strong> (0.82 Tons)</li>
                <li>Polymeric Sand: <strong>3 Bags</strong> (50 lb each)</li>
                <li>Est. Total Cost: <strong>~$116.80</strong></li>
              </ul>
            </div>
            <div style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>Paver Driveway (800 Sq Ft)</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '10px' }}>40 ft × 20 ft · 80mm Vehicular · 1/8&quot; Joints</p>
              <ul style={{ paddingLeft: '18px', fontSize: '0.9rem', color: '#334155', margin: 0 }}>
                <li>Bedding Sand: <strong>2.72 Cubic Yards</strong> (3.67 Tons)</li>
                <li>Polymeric Sand: <strong>15 Bags</strong> (50 lb each)</li>
                <li>Est. Total Cost: <strong>~$566.80</strong></li>
              </ul>
            </div>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            6 Essential Pro Tips for Laying Paver Sand Like a Master Hardscaper
          </h2>
          <ol style={{ paddingLeft: '20px', marginBottom: '32px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Use 1-Inch Outside-Diameter Screed Pipes:</strong> Never try to eyeball or freehand your sand bed thickness. Lay two parallel 10-foot lengths of 1-inch outside-diameter (O.D.) rigid galvanized electrical conduit pipe on top of your compacted gravel base. Spread bulk concrete sand between the pipes, and pull a straight aluminum screed board or 2x4 timber across the pipes. Remove the pipes and fill the pipe voids with loose sand using a hand trowel.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Never Compact the Bedding Sand Before Pavers Are Laid:</strong> Screed the 1-inch bedding sand completely smooth and flat using 1-inch electrical conduit pipe rails and a straight 2x4 board. Leave the sand loose! You lay your pavers directly onto the loose screeded sand, and then run a vibratory plate compactor over the tops of the pavers to embed them evenly into the cushion.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Never Walk on the Screeded Sand Bed:</strong> Once your sand bed is screeded, never step on it. Always work from the top of previously laid pavers. If an area is accidentally stepped on, re-rake and re-screed it before placing pavers.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Pavers Must Be 100% Dry Before Sweeping Polymeric Sand:</strong> Polymeric sand contains water-activated chemical binders. If you sweep it across damp or dewy pavers, the polymers will instantly stick to the textured surface of the pavers, leaving permanent, milky-white haze stains that are nearly impossible to remove. Ensure full sun and bone-dry pavers before opening bags.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Vibrate the Polymeric Sand into Joints with a Protective Pad:</strong> Sweeping alone leaves large air voids inside vertical joints. Run your vibratory plate compactor over the paver surface after the first sweep. Always attach a protective polyurethane or neoprene rubber pad to the compactor plate to avoid scratching or chipping pavers. The vibration consolidates the sand to the full joint depth. Sweep a second light pass to top off the joints within 1/8 inch of the paver chamfer edge.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Use a Light Shower Mist to Activate Polymeric Sand:</strong> When wetting polymeric sand, use a garden hose nozzle set to a gentle shower or mist. Never blast joints with a high-pressure jet stream, which will wash the binders out of the joints and splash sand onto adjacent walls.
            </li>
          </ol>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {faqData.mainEntity.map((item, idx) => (
              <div key={idx} style={{ background: '#F8FAFC', padding: '18px 20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>
                  {item.name}
                </h3>
                <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>
                  {item.acceptedAnswer.text}
                </p>
              </div>
            ))}
          </div>

          <div style={{ padding: '20px', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0', marginTop: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>
              Related Hardscaping &amp; Paving Calculators
            </h3>
            <p style={{ color: '#15803D', marginBottom: '12px' }}>
              Explore our connected suite of hardscape planning tools to estimate your entire patio foundation:
            </p>
            <ul style={{ paddingLeft: '20px', color: '#15803D', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
              <li><Link href="/paver-base-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Paver Base Calculator</Link></li>
              <li><Link href="/sand-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>General Sand Calculator</Link></li>
              <li><Link href="/stone-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Stone &amp; Gravel Calculator</Link></li>
              <li><Link href="/tons-to-cubic-yards/" style={{ color: '#15803D', fontWeight: 600 }}>Tons to Cubic Yards</Link></li>
              <li><Link href="/square-footage-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Square Footage Calculator</Link></li>
              <li><Link href="/cubic-yard-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Cubic Yard Calculator</Link></li>
            </ul>
          </div>
        </article>

        {/* Ad Placeholder Bottom */}
        <div style={{ marginTop: '32px' }}>
          <AdSlot slotId="paver-sand-bottom" />
        </div>
      </main>
    </>
  );
}
