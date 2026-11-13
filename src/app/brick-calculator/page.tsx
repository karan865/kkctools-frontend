import { Metadata } from 'next';
import Link from 'next/link';
import { BrickCalculator } from '@/components/tool/brick-calculator';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { SITE_NAME, SITE_URL } from '@/config/site';
import { BRICK_FAQS } from '@/content/pages/brick-calculator';
import JsonLd from '@/components/seo/JsonLd';
import { METRIC_BRICK_PRESETS, bricksPerSquareMetre } from '@/lib/brick-metric-engine';
import HowWeCalculate from '@/components/seo/HowWeCalculate';

export const metadata: Metadata = buildMetadata({
  title: 'Brick Calculator (Brick Wall & Mortar)',
  description:
    'Free brick calculator for bricks, mortar and pallets. US sizes in sq ft, or metric bricks per m² for UK, EU and Australian bricks, with openings and waste.',
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
      'Free brick calculator to estimate bricks, mortar bags, and pallets for any wall with door and window deductions, waste, and cost estimation.',
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
        name: 'Brick Calculator',
        item: `${SITE_URL}/brick-calculator/`,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: BRICK_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  },
];

export default function BrickCalculatorPage() {
  return (
    <>
      <JsonLd data={jsonLd} />

      <main id="main-content" style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '13px', color: '#64748B' }}>
          <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, alignItems: 'center' }}>
            <li>
              <Link href="/" style={{ color: '#0284C7', textDecoration: 'none' }}>Home</Link>
            </li>
            <li style={{ margin: '0 8px', color: '#94A3B8' }} aria-hidden="true">›</li>
            <li>
              <Link href="/tools/" style={{ color: '#0284C7', textDecoration: 'none' }}>Tools</Link>
            </li>
            <li style={{ margin: '0 8px', color: '#94A3B8' }} aria-hidden="true">›</li>
            <li style={{ color: '#0F172A', fontWeight: 500 }} aria-current="page">Brick Calculator</li>
          </ol>
        </nav>

        {/* Page Header */}
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Brick Calculator: Bricks, Mortar &amp; Cost (US or Metric)
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6, marginBottom: '12px' }}>
            Planning a new brick veneer siding, patio garden wall, retaining wall facade, or brick mailbox pillar and asking yourself: <em>how many bricks do I need?</em> Use our free <strong>brick calculator</strong> to quickly find your total brick order, pre-blended mortar bags, site-mixed cement and sand, pallet quantities, and total material budget.
          </p>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
            Whether you are using our <strong>calculator bricks</strong> feature for a single garden wall or configuring a multi-run <strong>brick wall calculator</strong> with window and door deductions, get an estimate in seconds below. Building in the UK, Europe or Australia? Switch to <strong>Metric</strong> for bricks per m² with millimetre brick sizes (<a href="#bricks-per-m2">how it works</a>).
          </p>
        </header>

        {/* Interactive Tool */}
        <section aria-label="Interactive Brick Calculator">
          <BrickCalculator />
        </section>

        {/* Ad Slot 1: Below results */}
        <AdSlot slotId="brick-calc-below-results" />

        {/* Editorial SEO Content */}
        <article style={{ marginTop: '48px', color: '#334155', lineHeight: 1.7, fontSize: '0.975rem' }}>
          {/* Section 2: How to Use */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              How to Use the Brick Calculator
            </h2>
            <ol style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Enter Wall Dimensions:</strong> Input the length and height in feet for each wall section. Add multiple wall runs if calculating an entire foundation or multi-sided perimeter.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Add Doors &amp; Windows:</strong> Click the quick opening buttons (exterior door = 20.0 sq ft, window = 12.0 sq ft) or enter custom rough opening dimensions to deduct unbuilt wall area.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Select Brick Size &amp; Mortar Joint:</strong> Choose your brick style (Modular, Standard, Queen, King, Utility, etc.) and joint thickness (standard 3/8&quot; or 1/2&quot;).
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Choose Wythe &amp; Waste Factor:</strong> Select Single Wythe for typical veneer siding or Double Wythe for solid 8-inch structural brick walls. We recommend a 10% waste factor for cutting scrap and corner pieces.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Review Live Order Quantities:</strong> The calculator updates in real time to show total bricks to order, pre-blended mortar bags (80 lb / 60 lb), pallet counts, dry weight in tons, and estimated material costs.
              </li>
            </ol>
          </section>

          {/* Section 3: How to Calculate Bricks for a Wall */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              How to Calculate Bricks for a Wall (Step-by-Step)
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Professional masons follow a reliable four-step formula to calculate brick quantity and mortar materials without running short mid-job:
            </p>
            <ol style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li style={{ marginBottom: '12px' }}>
                <strong>Calculate Gross Wall Area:</strong> Measure the length and height of each wall in feet and multiply: Gross Area = Length × Height. For complex buildings, sum individual wall segments with our companion <Link href="/square-footage-calculator/" style={{ color: '#0284C7' }}>square footage calculator</Link>.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Deduct Openings for Net Area:</strong> Measure every rough door and window opening. Deduct their combined area: Net Wall Area = Gross Area − Total Openings Area.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Determine Nominal Face Area and Coverage Rate:</strong> Add the mortar joint thickness (typically 3/8&quot; or 0.375&quot;) to both the actual length and actual height of the brick to find its nominal dimensions. Compute the face area in square inches: Nominal Face Area = (Length + Joint) × (Height + Joint). In our <strong>brick calculator sq ft</strong> formula, bricks per square foot = 144 ÷ Nominal Face Area. For standard Modular brick: 144 ÷ (8.0 × 2.625) = 144 ÷ 21 = 6.857 bricks per sq ft.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Multiply by Wythe and Add Waste:</strong> Multiply net wall square footage by bricks per square foot, multiply by 2 for double wythe walls, and add a 5% to 15% cutting allowance: Order Quantity = Net Area × Bricks/Sq Ft × Wythe Multiplier × (1 + Waste% ÷ 100).
              </li>
            </ol>
          </section>

          {/* Ad Slot 2: Mid content */}
          <AdSlot slotId="brick-calc-mid-content" />

          {/* Section 4: How Many Bricks Per Square Foot? */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              How Many Bricks Per Square Foot?
            </h2>
            <p style={{ marginBottom: '16px' }}>
              For standard US Modular brick (7-5/8&quot; × 2-1/4&quot; × 3-5/8&quot;) with a 3/8-inch joint, you need <strong>6.857 bricks per square foot</strong> (roughly 7 bricks per sq ft). Standard bricks require <strong>6.550 bricks per sq ft</strong>.
            </p>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginTop: '20px', marginBottom: '12px' }}>
              Standard Brick Dimensions &amp; Modular Brick Size Chart
            </h3>
            <p style={{ marginBottom: '12px', fontSize: '0.9rem', color: '#64748B' }}>
              Actual manufactured sizes vary by manufacturer; confirm dimensions with your supplier or use Custom size.
            </p>

            <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                    <th style={{ padding: '10px 12px', color: '#0F172A' }}>Brick Type</th>
                    <th style={{ padding: '10px 12px', color: '#0F172A' }}>Actual Dimensions (L × H × W)</th>
                    <th style={{ padding: '10px 12px', color: '#0F172A' }}>Nominal Face (3/8&quot; Joint)</th>
                    <th style={{ padding: '10px 12px', color: '#0F172A' }}>Bricks / Sq Ft</th>
                    <th style={{ padding: '10px 12px', color: '#0F172A' }}>Approx Weight</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>Modular</td>
                    <td style={{ padding: '10px 12px' }}>7-5/8&quot; × 2-1/4&quot; × 3-5/8&quot;</td>
                    <td style={{ padding: '10px 12px' }}>8&quot; × 2-5/8&quot; (21.0 sq in)</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0284C7' }}>6.857</td>
                    <td style={{ padding: '10px 12px' }}>~4.5 lb</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>Standard</td>
                    <td style={{ padding: '10px 12px' }}>8&quot; × 2-1/4&quot; × 3-5/8&quot;</td>
                    <td style={{ padding: '10px 12px' }}>8-3/8&quot; × 2-5/8&quot; (22.0 sq in)</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0284C7' }}>6.550</td>
                    <td style={{ padding: '10px 12px' }}>~4.8 lb</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>Engineer Modular</td>
                    <td style={{ padding: '10px 12px' }}>7-5/8&quot; × 2-13/16&quot; × 3-5/8&quot;</td>
                    <td style={{ padding: '10px 12px' }}>8&quot; × 3-3/16&quot; (25.5 sq in)</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0284C7' }}>5.647</td>
                    <td style={{ padding: '10px 12px' }}>~5.6 lb</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>Closure Modular</td>
                    <td style={{ padding: '10px 12px' }}>7-5/8&quot; × 3-5/8&quot; × 3-5/8&quot;</td>
                    <td style={{ padding: '10px 12px' }}>8&quot; × 4&quot; (32.0 sq in)</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0284C7' }}>4.500</td>
                    <td style={{ padding: '10px 12px' }}>~7.2 lb</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>Norman</td>
                    <td style={{ padding: '10px 12px' }}>11-5/8&quot; × 2-1/4&quot; × 3-5/8&quot;</td>
                    <td style={{ padding: '10px 12px' }}>12&quot; × 2-5/8&quot; (31.5 sq in)</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0284C7' }}>4.571</td>
                    <td style={{ padding: '10px 12px' }}>~6.9 lb</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>Roman</td>
                    <td style={{ padding: '10px 12px' }}>11-5/8&quot; × 1-5/8&quot; × 3-5/8&quot;</td>
                    <td style={{ padding: '10px 12px' }}>12&quot; × 2&quot; (24.0 sq in)</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0284C7' }}>6.000</td>
                    <td style={{ padding: '10px 12px' }}>~5.0 lb</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>Utility</td>
                    <td style={{ padding: '10px 12px' }}>11-5/8&quot; × 3-5/8&quot; × 3-5/8&quot;</td>
                    <td style={{ padding: '10px 12px' }}>12&quot; × 4&quot; (48.0 sq in)</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0284C7' }}>3.000</td>
                    <td style={{ padding: '10px 12px' }}>~11.0 lb</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>Queen</td>
                    <td style={{ padding: '10px 12px' }}>7-5/8&quot; × 2-3/4&quot; × 2-3/4&quot;</td>
                    <td style={{ padding: '10px 12px' }}>8&quot; × 3-1/8&quot; (25.0 sq in)</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0284C7' }}>5.760</td>
                    <td style={{ padding: '10px 12px' }}>~4.2 lb</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>King</td>
                    <td style={{ padding: '10px 12px' }}>9-5/8&quot; × 2-5/8&quot; × 2-5/8&quot;</td>
                    <td style={{ padding: '10px 12px' }}>10&quot; × 3&quot; (30.0 sq in)</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0284C7' }}>4.800</td>
                    <td style={{ padding: '10px 12px' }}>~5.5 lb</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Note: Some manufacturers make Queen larger (for example 9-5/8&quot; × 2-3/4&quot; × 3-1/8&quot; with ~4.61 bricks/sq ft) or King in proprietary regional dimensions. Use Custom size if your jobsite brick differs.
            </p>
          </section>

          {/* Section 5: How Much Mortar Do I Need for Bricks? */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              How Much Mortar Do I Need for Bricks?
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Using our <strong>brick mortar calculator</strong> feature, you can estimate mortar for either pre-blended bagged mortar or site-mixed masonry cement and sand:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Pre-Blended Mortar Mix (Sand Included):</strong> Just add clean water. One 80 lb bag of pre-blended mix lays about 35 standard modular bricks with a 3/8-inch joint. A 60 lb bag lays approximately 26.25 modular bricks.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Site-Mixed (Cement + Sand):</strong> Masons mixing on-site combine masonry cement (typically Type N or Type S in 70 lb bags) with clean washed masonry sand. If choosing bulk sand, use our <Link href="/sand-calculator/" style={{ color: '#0284C7' }}>sand calculator</Link> to coordinate quarry deliveries.
              </li>
            </ul>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginTop: '20px', marginBottom: '12px' }}>
              How Much Mortar for 1,000 Bricks?
            </h3>
            <p style={{ marginBottom: '16px' }}>
              For 1,000 standard modular bricks laid with 3/8-inch joints, you will need approximately <strong>28 to 29 bags of 80 lb pre-blended mix</strong> (or ~38 bags of 60 lb mix). If mixing site-mixed mortar, you will need roughly <strong>7.5 bags (70 lb) of masonry cement and about 1 cubic yard of mason sand</strong>.
            </p>
            <p style={{ marginBottom: '16px' }}>
              <strong>Type N vs. Type S Mortar:</strong> Type N mortar (medium strength, ~750 psi) is ideal for standard above-grade exterior veneers, residential chimneys, and garden walls. Type S mortar (high strength, ~1,800 psi) is required for below-grade foundations, structural retaining walls, or high-wind environments, always following structural project plans and local building code.
            </p>
          </section>

          {/* Section 6a: Metric bricks per m² (UK, Europe, Australia) */}
          <section style={{ marginBottom: '36px' }} id="bricks-per-m2">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              How Many Bricks Per m²? (UK, Europe &amp; Australia)
            </h2>
            <p style={{ color: '#334155', lineHeight: 1.7, marginBottom: '14px' }}>
              Outside the US, bricks are sold in millimetres and walls are measured in square metres. Switch the
              calculator above to <strong>Metric</strong> to use them. The rule is the same as in imperial units: divide
              one square metre by the face of one brick <em>plus</em> one joint.
            </p>
            <p style={{ color: '#334155', lineHeight: 1.7, marginBottom: '14px' }}>
              <strong>Bricks per m² = 1 ÷ ((length + joint) × (height + joint))</strong>, with sizes in metres. A UK
              standard brick is 215 × 102.5 × 65 mm; with 10 mm joints that is 1 ÷ (0.225 × 0.075) = 59.3, which is
              why bricklayers say “60 bricks per square metre” for a half-brick wall. A one-brick wall (two leaves, 215 mm
              thick) needs twice as many.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
                <thead>
                  <tr style={{ background: '#F1F5F9' }}>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Brick (work size)</th>
                    <th style={{ textAlign: 'right', padding: '8px' }}>Half-brick wall</th>
                    <th style={{ textAlign: 'right', padding: '8px' }}>One-brick wall</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(METRIC_BRICK_PRESETS).map((p) => {
                    const rate = bricksPerSquareMetre(p.lengthMm, p.heightMm, 10);
                    return (
                      <tr key={p.id} style={{ borderTop: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '8px' }}>{p.name}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{rate.toFixed(1)} per m²</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{(rate * 2).toFixed(1)} per m²</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '10px' }}>
              All rows use 10 mm joints and no allowance for cutting or breakage; add 5–10% when you order. Rates are
              calculated with the formula above, so they match the calculator exactly.
            </p>
            <p style={{ color: '#334155', lineHeight: 1.7, marginTop: '14px' }}>
              <strong>Mortar in metric:</strong> the calculator works out the joint volume each brick carries (one bed
              joint and one vertical joint) and multiplies by the number of bricks. For UK bricks and 10 mm joints that is
              about 0.018 m³ (18 litres) of mortar per m² of half-brick wall, before losses. Mortar bag yields differ by
              product, so enter the litres per bag printed on your bag to get a bag count.
            </p>
          </section>

          {/* Section 6: Single Wythe vs. Double Wythe */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              Single Wythe vs. Double Wythe Brick Walls
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Understanding your wall construction type is critical before ordering:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li style={{ marginBottom: '10px' }}>
                <strong>Single Wythe (Veneer Wall):</strong> A single thickness of brick (approx 3-5/8&quot; to 4&quot; thick). In modern residential construction, this serves as an exterior rainscreen and decorative skin tied back to wood studs, steel framing, or a <Link href="/cinder-block-calculator/" style={{ color: '#0284C7' }}>cinder block backup wall</Link> with corrugated metal masonry ties.
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Double Wythe (Solid Structural Wall):</strong> Two separate, parallel layers of brick bonded together with continuous wire ladder mesh or metal wall ties. Double wythe requires <strong>about twice the bricks and mortar</strong>. If the 3/4-inch space between wythes (the collar joint) is grouted full of mortar, check the &quot;Fill collar joint&quot; option in the calculator to add additional bags.
              </li>
            </ul>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Disclaimer: Free-standing garden walls, retaining walls, and load-bearing multi-wythe walls require a continuous concrete footing. Always check footing dimensions with our <Link href="/cubic-yard-calculator/" style={{ color: '#0284C7' }}>cubic yard calculator</Link> and consult a licensed structural engineer.
            </p>
          </section>

          {/* Section 7: How Many Bricks Are on a Pallet? Brick Weight */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              How Many Bricks Are on a Pallet? Brick Weight
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Brick suppliers ship orders strapped on wooden pallets (often called cubes or straps). Knowing pallet counts and weight prevents driveway damage and delivery access issues:
            </p>

            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                    <th style={{ padding: '10px 12px', color: '#0F172A' }}>Brick Style</th>
                    <th style={{ padding: '10px 12px', color: '#0F172A' }}>Typical Bricks per Pallet</th>
                    <th style={{ padding: '10px 12px', color: '#0F172A' }}>Avg Weight per Brick</th>
                    <th style={{ padding: '10px 12px', color: '#0F172A' }}>Total Pallet Weight</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>Modular</td>
                    <td style={{ padding: '10px 12px' }}>500 to 534 bricks</td>
                    <td style={{ padding: '10px 12px' }}>~4.5 lb</td>
                    <td style={{ padding: '10px 12px' }}>~2,250 to 2,400 lb</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>Standard</td>
                    <td style={{ padding: '10px 12px' }}>500 bricks</td>
                    <td style={{ padding: '10px 12px' }}>~4.8 lb</td>
                    <td style={{ padding: '10px 12px' }}>~2,400 lb</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>Queen / King</td>
                    <td style={{ padding: '10px 12px' }}>400 to 500 bricks</td>
                    <td style={{ padding: '10px 12px' }}>~4.2 to 5.5 lb</td>
                    <td style={{ padding: '10px 12px' }}>~2,100 to 2,400 lb</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>Utility</td>
                    <td style={{ padding: '10px 12px' }}>200 to 250 bricks</td>
                    <td style={{ padding: '10px 12px' }}>~11.0 lb</td>
                    <td style={{ padding: '10px 12px' }}>~2,200 to 2,750 lb</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Note: Pallet packaging varies by manufacturer; confirm with your supplier. Cored or frogged bricks weigh less than solid pavers. Use our built-in <strong>brick weight calculator</strong> feature to estimate haul truck requirements.
            </p>
          </section>

          {/* Section 8: Worked Example */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              Worked Example: Estimating a 20&apos; × 8&apos; Brick Garden Wall
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Let us walk through a complete real-world scenario: building a 20-foot long by 8-foot high decorative single-wythe garden wall featuring a 4 ft × 7 ft arched walk-through opening (28 sq ft opening).
            </p>

            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
              <p style={{ margin: '0 0 8px 0' }}><strong>1. Gross Wall Area:</strong> 20 ft × 8 ft = 160 sq ft.</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>2. Net Wall Area:</strong> 160 sq ft − 28 sq ft = <strong>132 sq ft</strong>.</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>3. Base Brick Count (Modular @ 6.857/sq ft):</strong> 132 sq ft × 6.857 = 905 net bricks.</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>4. Total Bricks to Order (+10% Waste):</strong> 905 × 1.10 = <strong>996 bricks</strong>.</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>5. Mortar Requirements:</strong> about 29 bags of 80 lb pre-blended mix (or about 38 bags of 60 lb mix), or about 8 bags of masonry cement plus about 1 cubic yard of sand.</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>6. Pallet Count (~500/pallet):</strong> 996 ÷ 500 = about 2.0 pallets (order 2 pallets).</p>
              <p style={{ margin: '0' }}><strong>7. Total Weight:</strong> 996 bricks × 4.5 lb = 4,482 lb (2.24 tons).</p>
            </div>
          </section>

          {/* Section 9: Related Masonry & Construction Calculators */}
          <section style={{ padding: '24px', backgroundColor: '#F0F9FF', borderRadius: '12px', border: '1px solid #BAE6FD', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0369A1', marginBottom: '8px' }}>
              Related Masonry &amp; Construction Calculators
            </h2>
            <p style={{ color: '#0C4A6E', marginBottom: '16px' }}>
              Calculate all phases of your masonry, concrete, and landscaping projects with our companion tools:
            </p>
            <ul style={{ paddingLeft: '20px', color: '#0369A1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
              <li>
                <Link href="/cinder-block-calculator/" style={{ color: '#0284C7', fontWeight: 600 }}>
                  Cinder Block Calculator
                </Link>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#475569' }}>CMU blocks, cores &amp; concrete fill for backup walls</span>
              </li>
              <li>
                <Link href="/sand-calculator/" style={{ color: '#0284C7', fontWeight: 600 }}>
                  Sand Calculator
                </Link>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#475569' }}>Mason sand, bedding sand &amp; mortar bulk deliveries</span>
              </li>
              <li>
                <Link href="/square-footage-calculator/" style={{ color: '#0284C7', fontWeight: 600 }}>
                  Square Footage Calculator
                </Link>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#475569' }}>Calculate multi-room surface areas &amp; wall square footage</span>
              </li>
              <li>
                <Link href="/cubic-yard-calculator/" style={{ color: '#0284C7', fontWeight: 600 }}>
                  Cubic Yard Calculator
                </Link>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#475569' }}>Concrete footings, slabs &amp; structural subgrades</span>
              </li>
            </ul>
          </section>

          {/* Ad Slot 3: Before FAQ */}
          <AdSlot slotId="brick-calc-before-faq" />

          <HowWeCalculate slug="brick-calculator" />

          {/* Section 10: FAQ */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              Brick Calculator FAQ
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {BRICK_FAQS.map((faq, idx) => (
                <div key={idx} style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
                    {faq.q}
                  </h3>
                  <p style={{ margin: 0, color: '#475569' }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 11: Closing Notes & Disclaimer */}
          <section style={{ marginTop: '36px', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
            <p style={{ marginBottom: '12px' }}>
              Whether ordering a single pallet for a decorative garden walkway or scheduling tandem dump truckloads for a full residential exterior veneer, our <strong>brick calculator</strong> ensures you order accurate materials and avoid costly jobsite delays.
            </p>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '6px' }}>
              <strong>Last updated:</strong> November 2026
            </p>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '8px' }}>
              <strong>How we calculate:</strong> Calculations use nominal face geometry (actual brick dimensions plus mortar joint thickness) and empirical material yields based on US masonry trade standards. All estimates compute client-side with zero external network requests.
            </p>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', fontStyle: 'italic', margin: 0 }}>
              Disclaimer: Results are estimates. Structural, load-bearing and retaining walls must follow engineered plans and local code; confirm brick size, weight, pallet count and mortar yield with your supplier or the product label.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}
