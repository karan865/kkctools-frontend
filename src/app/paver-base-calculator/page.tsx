import type { Metadata } from 'next';
import Link from 'next/link';
import PaverBaseCalculator from '@/components/tool/paver-base-calculator';
import AdSlot from '@/components/ads/AdSlot';
import { SITE_NAME, SITE_URL } from '@/config/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Paver Base Calculator (Tons & Cubic Yards)',
  description:
    'Free paver base calculator to calculate tons, cubic yards, and bags of crushed stone or road base for patios, walkways, and driveways with compaction loss.',
  alternates: {
    canonical: `${SITE_URL}/paver-base-calculator/`,
  },
  openGraph: {
    title: 'Paver Base Calculator (Tons & Cubic Yards)',
    description:
      'Calculate crushed stone paver base, crusher run, road base (#21A), and gravel tonnage with 15% to 20% mechanical plate compaction factor.',
    url: `${SITE_URL}/paver-base-calculator/`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Paver Base Calculator',
    url: `${SITE_URL}/paver-base-calculator/`,
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
      'Interactive paver base calculator to estimate crushed stone, crusher run, and gravel foundation tonnage and cubic yards with plate compaction shrinkage.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How deep should a paver base be?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For standard pedestrian foot traffic such as backyard dining patios, garden walkways, and step landings, the universal standard is 4 inches of compacted dense-graded crushed stone. For heavy applications including outdoor kitchens, stone masonry fire pits, hot tub pads, or residential car driveways, increase your crushed stone base depth to 6 to 8 inches. For commercial vehicular parking or motorhome pads, ICPI standards specify 10 to 12 inches of compacted aggregate.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best material to use for a paver base?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The industry standard and most widely recommended material is dense-graded aggregate (DGA), commonly sold under regional names such as crusher run, road base, #21A limestone, ABC stone, or quarry process. This aggregate consists of jagged 3/4-inch crushed stone blended with smaller rock chips, coarse grit, and fine limestone rock dust. When vibrated with moisture, the fine dust locks the angular stones into an unyielding, concrete-like foundation that resists frost heave.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why do I need to add 15% to 20% for compaction shrinkage?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'When loose crushed stone aggregate is spread across a project site, it contains significant air voids between particles. When run over multiple times with a heavy, gas-powered vibratory plate tamper, these air voids collapse and the stone fragments nest tightly together. This physical consolidation shrinks the total loose volume by 15% to 20%. If you do not account for compaction loss when placing your quarry order, your finished base will be roughly one inch thinner than required.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many bags of paver base equal one cubic yard?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Standard retail paver base bags sold at home improvement warehouses contain 0.5 cubic feet of aggregate and weigh approximately 50 pounds. Because one bulk cubic yard contains exactly 27 cubic feet, you will need 54 individual retail bags to equal one cubic yard of volume. Because of this high ratio, bagged aggregate is four to five times more expensive than ordering bulk delivery from a local landscape yard.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use sand as a paver base instead of gravel?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. You should never use sand as your primary paver base. Sand particles are fluid and easily wash out or shift horizontally when saturated with heavy rain or subjected to foot traffic. Building a patio over 4 inches of sand will cause pavers to become wavy, uneven, and hazardous within months. Sand is strictly intended for a uniform, 1-inch bedding cushion placed on top of a solid 4-inch to 8-inch compacted gravel base.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between paver base and paver sand?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Paver base consists of 4 to 8 inches of 3/4-inch crushed gravel mixed with rock dust, designed to provide structural load-bearing capacity and frost protection. Paver sand (specifically ASTM C33 washed concrete sand) is a thin, 1-inch screeded cushion placed directly on top of the base to provide a smooth, workable setting bed for the pavers. After the pavers are placed, polymeric joint sand is swept between paver gaps to lock them firmly in place.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does a ton of paver base cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'At local commercial quarries and landscape supply yards, bulk crusher run or #21A paver base typically costs between $30 and $55 per ton, plus a local delivery dump fee ranging from $50 to $90. In bagged form at retail box stores, the same material costs approximately $160 to $220 per ton ($4.50 to $6.00 per 50 lb bag).',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need to compact paver base in layers (lifts)?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, absolutely. You must compact your crushed stone base in layers no deeper than 2 to 3 inches at a time (known as lifts). Standard residential rental plate compactors only have sufficient centrifugal vibration force to penetrate 2 to 3 inches into loose aggregate. If you attempt to compact 6 inches of loose gravel all at once, only the top 2 inches will consolidate, while the bottom 4 inches will remain loose and settle over time.',
        },
      },
    ],
  },
];

export default function PaverBaseCalculatorPage() {
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
            <li style={{ color: '#0F172A', fontWeight: 500 }} aria-current="page">Paver Base Calculator</li>
          </ol>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Free Paver Base Calculator: Estimate Tons &amp; Cubic Yards of Crushed Stone
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
            Accurately plan your patio foundation using our free <strong>paver base calculator</strong> (also functioning as a dedicated <strong>crushed stone paver base calculator</strong> and <strong>paver base tons calculator</strong>). Instantly compute loose aggregate volume, required <strong>paver base depth</strong>, and quarry delivery tonnage while automatically accounting for 15% to 20% mechanical compaction loss.
          </p>
        </header>

        {/* Interactive Tool */}
        <section aria-label="Paver Base Calculator Tool">
          <PaverBaseCalculator />
        </section>

        {/* Ad Placeholder Middle */}
        <div style={{ margin: '32px 0' }}>
          <AdSlot slotId="paver-base-middle" />
        </div>

        {/* Comprehensive SEO Editorial Content (2,800+ Words) */}
        <article style={{ marginTop: '48px', color: '#334155', lineHeight: 1.7, fontSize: '0.975rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            The Foundation of a Lasting Paver Surface: Why Base Compaction Matters
          </h2>
          <p style={{ marginBottom: '16px' }}>
            A stunning interlocking brick, concrete paver, or natural stone patio is an exquisite addition to any home, dramatically expanding outdoor living space, improving functional backyard aesthetics, and boosting overall property appraisal value. However, the lasting structural integrity of any paver installation is determined entirely by what lies beneath the surface. When patios develop unsightly ruts, pavers begin wobbling underfoot, edges kick outward, or walkways heave violently after winter freezing cycles, the fault almost never lies with the paving stones themselves. In over 90% of documented hardscape failures, the underlying culprit is an inadequate, poorly compacted, or incorrectly graded crushed stone base.
          </p>
          <p style={{ marginBottom: '24px' }}>
            Calculating exactly how much base aggregate to purchase is notoriously difficult because of <strong>mechanical compaction shrinkage</strong>. When loose, jagged crushed gravel (such as crusher run, road base, dense-graded aggregate, or #21A limestone) is vibrated with a heavy gas-powered plate tamper, natural air pockets and loose voids collapse completely. The sharp stone fragments interlock tightly with fine rock dust, causing the loose physical volume to shrink by <strong>15% to 20%</strong>. If an installer or homeowner orders only the raw excavated dimensions, their delivered pile of gravel will fall short by several inches of finished thickness, forcing costly secondary delivery fees and halting job-site momentum.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            How Much Paver Base Do I Need? (Formula &amp; Compaction Loss)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            To accurately calculate your subbase aggregate by hand or verify material quotes from landscape supply yards, follow this comprehensive 5-step engineering formula:
          </p>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
            1. Measure the Excavation Surface Area (Including Perimeter Overdig)
          </h3>
          <p style={{ marginBottom: '12px' }}>
            Start by measuring the planned exterior length and width of your finished patio, walkway, or driveway in feet. 
          </p>
          <p style={{ marginBottom: '12px' }}>
            <strong>The Essential 6-Inch Overdig Rule:</strong> Concrete pavers require rigid plastic or aluminum edge restraints anchored with 10-inch steel spikes to prevent outward horizontal shifting. You cannot hammer a structural spike into soft topsoil or garden mulch. Therefore, you must excavate your crushed stone foundation <strong>6 inches wider on all open perimeter edges</strong> than the finished paver layout.
          </p>
          <div style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '16px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#0F172A' }}>
            Excavation Length = Finished Length + 1.0 ft (0.5 ft each side)<br />
            Excavation Width = Finished Width + 1.0 ft (0.5 ft each side)<br />
            Excavation Surface Area = Excavation Length × Excavation Width
          </div>
          <p style={{ marginBottom: '16px' }}>
            <em>Example:</em> A 20 ft × 15 ft patio with lawn on all sides requires an excavation footprint of 21 ft × 16 ft = <strong>336.0 Square Feet</strong>.
          </p>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
            2. Determine Finished Compacted Base Depth
          </h3>
          <p style={{ marginBottom: '12px' }}>
            Select your required base depth based on the planned load and existing soil conditions. Convert this depth from inches into fractional feet by dividing by 12:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li>Standard Pedestrian Patio or Garden Walkway: 4 inches = 4 / 12 = <strong>0.3333 Feet</strong></li>
            <li>Heavy Residential Patio (Hot Tub, Fire Pit, Outdoor Kitchen): 6 inches = 6 / 12 = <strong>0.5000 Feet</strong></li>
            <li>Passenger Vehicle Driveway or RV Parking Pad: 8 to 10 inches = 8 / 12 = <strong>0.6667 Feet</strong></li>
          </ul>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
            3. Calculate Finished Compacted Volume in Cubic Feet
          </h3>
          <p style={{ marginBottom: '12px' }}>
            Multiply your total excavation area by the required base depth in feet:
          </p>
          <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '16px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#0F172A' }}>
            Compacted Volume (cu ft) = Excavation Area (sq ft) × Base Depth (ft)<br />
            Example: 336.0 sq ft × 0.3333 ft = 112.0 Cubic Feet
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
            4. Multiply by the Compaction Shrinkage Factor
          </h3>
          <p style={{ marginBottom: '12px' }}>
            Because plate compactors consolidate aggregate by forcing fine particles into open voids, you must increase your order volume. For standard plate tampers on loam or well-drained soil, use a <strong>15% compaction allowance (1.15 multiplier)</strong>. For heavy expansive clay soil or deep vehicular bases, use a <strong>20% compaction allowance (1.20 multiplier)</strong>:
          </p>
          <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '16px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#0F172A' }}>
            Loose Volume to Order (cu ft) = Compacted Volume × (1 + Compaction Factor % / 100)<br />
            Example: 112.0 cu ft × 1.15 = 128.8 Loose Cubic Feet
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
            5. Convert to Bulk Cubic Yards and US Short Tons
          </h3>
          <p style={{ marginBottom: '12px' }}>
            Commercial quarries and landscape bulk yards sell aggregate either by the cubic yard (volume) or by the ton (weight). Because 1 cubic yard equals exactly 27 cubic feet:
          </p>
          <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '16px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#0F172A' }}>
            Total Loose Cubic Yards = Loose Volume (cu ft) / 27 = 128.8 / 27 = 4.77 Cubic Yards<br />
            Total Weight in Tons = Cubic Yards × 1.40 tons/yd³ = 4.77 × 1.40 = 6.68 US Short Tons
          </div>
          <p style={{ marginBottom: '24px' }}>
            <strong>Quarry Ordering Rule:</strong> Quarries rarely deliver partial fractions of a ton. Always round up to the nearest half-ton or full ton: place an order for <strong>7.0 Tons</strong>.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Paver Base Depth Guide: Walkways, Patios &amp; Driveways
          </h2>
          <p style={{ marginBottom: '16px' }}>
            How deep must your crushed stone foundation be? The required thickness depends on three critical environmental variables: subgrade soil moisture retention (clay vs. sand), regional frost depth, and the maximum dynamic weight the surface must support. Refer to this comprehensive engineering matrix aligned with Interlocking Concrete Pavement Institute (ICPI) recommendations:
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '28px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>Project Type</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>Subsoil Condition</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>Recommended Base Depth</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>Total Excavation Depth</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>Compaction Method</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Garden Walkway / Light Footpath</td>
                  <td style={{ padding: '12px 14px' }}>Well-Drained Sandy Loam</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0284C7' }}>4 Inches (100 mm)</td>
                  <td style={{ padding: '12px 14px' }}>7.5 Inches</td>
                  <td style={{ padding: '12px 14px' }}>2 passes in two 2-inch lifts</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Standard Residential Patio</td>
                  <td style={{ padding: '12px 14px' }}>Normal Soil / Mixed Loam</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0284C7' }}>4 Inches (100 mm)</td>
                  <td style={{ padding: '12px 14px' }}>7.5 Inches</td>
                  <td style={{ padding: '12px 14px' }}>3 passes in two 2-inch lifts</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Patio with Fire Pit / Outdoor Kitchen</td>
                  <td style={{ padding: '12px 14px' }}>Heavy Clay or Wet Subsoil</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0284C7' }}>6 Inches (150 mm)</td>
                  <td style={{ padding: '12px 14px' }}>9.5 Inches</td>
                  <td style={{ padding: '12px 14px' }}>3 passes in two 3-inch lifts</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Hot Tub / Swim Spa Concrete Paver Pad</td>
                  <td style={{ padding: '12px 14px' }}>Any Stable Soil Type</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0284C7' }}>6 to 8 Inches (150–200 mm)</td>
                  <td style={{ padding: '12px 14px' }}>9.5 to 11.5 Inches</td>
                  <td style={{ padding: '12px 14px' }}>4 passes in 2.5-inch lifts</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Residential Driveway (Cars &amp; Light Trucks)</td>
                  <td style={{ padding: '12px 14px' }}>Standard Well-Drained Soil</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0284C7' }}>8 Inches (200 mm)</td>
                  <td style={{ padding: '12px 14px' }}>11.5 Inches</td>
                  <td style={{ padding: '12px 14px' }}>4 passes in 2.5 to 3-inch lifts</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Heavy Commercial / RV Parking Pad</td>
                  <td style={{ padding: '12px 14px' }}>Clay / High Water Table</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0284C7' }}>10 to 12 Inches (250–300 mm)</td>
                  <td style={{ padding: '12px 14px' }}>13.5 to 15.5 Inches</td>
                  <td style={{ padding: '12px 14px' }}>5 passes in 2.5 to 3-inch lifts</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Crushed Stone vs. Paver Base: What Material is Best?
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Homeowners and DIY hardscapers frequently ask: <em>&quot;What exact material should I ask for when calling the local quarry or gravel yard?&quot;</em> Aggregate naming conventions vary significantly across North America. Below is a breakdown of the three primary aggregate categories used in hardscaping:
          </p>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
            1. Dense-Graded Aggregate (Crusher Run / #21A / ABC Stone / DGA) — THE GOLD STANDARD
          </h3>
          <p style={{ marginBottom: '12px' }}>
            <strong>Regional Aliases:</strong> Crusher run, dense graded aggregate (DGA), #21A limestone, crusher dust blend, quarry process (QP), shoulder stone, or road base.
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>Why It Outperforms Everything Else:</strong> Dense-graded aggregate contains a continuous distribution of particle sizes, ranging from angular 3/4-inch crushed rock down to fine sand, grit, and pulverized mineral rock flour. When compacted with water, the smaller chips and dust particles wedge tightly between larger rocks, eliminating all microscopic voids. Once cured, it forms a rock-solid, impermeable subterranean foundation that resists frost heave, settles evenly, and prevents paver rutting.
          </p>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
            2. Recycled Crushed Concrete Aggregate (RCA / Crushed Concrete Base) — BEST VALUE
          </h3>
          <p style={{ marginBottom: '12px' }}>
            <strong>Regional Aliases:</strong> 21AA crushed concrete, recycled road base, crushed miscellaneous base (CMB).
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>Why Contractors Love It:</strong> RCA is manufactured by crushing clean demolished commercial slabs and pavements, sieved to 3/4-inch minus with fine concrete dust. It offers load-bearing capacity and compaction characteristics identical to virgin crushed limestone, but typically costs <strong>20% to 35% less per ton</strong>. Furthermore, residual unhydrated cement particles in the dust can slowly hydrate over time, creating an exceptionally stiff subbase that is ideal for clay soils and driveways.
          </p>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
            3. Clean Open-Graded Stone (#57 Crushed Stone) — SPECIALIZED PERMEABLE APPLICATIONS ONLY
          </h3>
          <p style={{ marginBottom: '12px' }}>
            <strong>Regional Aliases:</strong> #57 stone, 3/4-inch clean washed gravel, drainage stone.
          </p>
          <p style={{ marginBottom: '24px' }}>
            <strong>When to Use:</strong> Standard interlocking pavers should <strong>NEVER</strong> be installed over clean stone without an engineering design. Because clean stone lacks fine bonding dust, it remains open and free-flowing. While exceptional for French drains and permeable green hardscaping that filters rainwater into stormwater aquifers, it requires a geotextile grid and specialized chip-stone bedding rather than standard concrete sand.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Buying Bagged Paver Base (0.5 cu ft) vs. Bulk Dump Truck Delivery
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Before heading to a retail home improvement warehouse to load dozens of 50-pound plastic bags into your vehicle, compare the economics, logistics, and labor involved in bagged versus bulk aggregate:
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '28px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>Key Comparison Metric</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>Retail Bags (0.5 cu ft)</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>Bulk Quarry Delivery (by the Ton)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Packaging &amp; Unit Size</td>
                  <td style={{ padding: '12px 14px' }}>Heavy plastic bag (0.5 cu ft / ~50 lbs)</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0284C7' }}>Loose open aggregate in dump truck bed</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Bags Needed per Cubic Yard</td>
                  <td style={{ padding: '12px 14px' }}><strong>54 bags</strong> (27 cu ft / 0.5 cu ft)</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0284C7' }}>1.40 tons equals 1 cubic yard</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Material Cost per Cubic Yard</td>
                  <td style={{ padding: '12px 14px' }}><strong>$240.00 to $330.00</strong> ($4.50–$6.00/bag)</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#166534' }}><strong>$45.00 to $70.00</strong> ($32–$50/ton)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Cost for 300 Sq Ft Patio (6.7 Tons)</td>
                  <td style={{ padding: '12px 14px' }}><strong>$1,480.00 to $1,950.00</strong> (324 bags)</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#166534' }}><strong>$380.00 to $480.00</strong> (including $75 delivery)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Vehicle Transport Requirements</td>
                  <td style={{ padding: '12px 14px' }}>Requires multiple pickup truck trips</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0284C7' }}>Single commercial dump truck delivery</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Packaging Waste</td>
                  <td style={{ padding: '12px 14px' }}>Hundreds of empty plastic bags</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0284C7' }}>Zero packaging waste</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Best Application</td>
                  <td style={{ padding: '12px 14px' }}>Small repairs, step landings (&lt; 15 bags)</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#166534' }}>Any patio or walkway larger than 50 sq ft</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ marginBottom: '24px' }}>
            <strong>The Bottom Line:</strong> Buying individual retail bags of paver base aggregate is nearly <strong>four to five times more expensive</strong> than ordering bulk gravel delivered to your driveway. On a standard 300 square foot patio, bulk ordering saves you over <strong>$1,000 in raw material expenses</strong> while sparing you the back-breaking physical labor of loading, carting, and slicing open hundreds of plastic bags.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Real-World Worked Examples: Patios, Walkways &amp; Driveways
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
            <div style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>Backyard Dining Patio (300 Sq Ft)</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '10px' }}>21 ft × 16 ft excavation · 4&quot; Base · 15% Compaction</p>
              <ul style={{ paddingLeft: '18px', fontSize: '0.9rem', color: '#334155', margin: 0 }}>
                <li>Compacted Volume: <strong>112.0 Cu Ft</strong> (4.15 cu yds)</li>
                <li>Loose Volume (+15%): <strong>128.8 Cu Ft</strong> (4.77 cu yds)</li>
                <li>Total Base Weight: <strong>6.68 Tons</strong> (Order 7.0 Tons)</li>
                <li>Est. Delivered Cost: <strong>~$359.00</strong></li>
              </ul>
            </div>
            <div style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>Clay Soil Fire Pit Patio (400 Sq Ft)</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '10px' }}>21 ft × 21 ft excavation · 6&quot; Base · 20% Compaction</p>
              <ul style={{ paddingLeft: '18px', fontSize: '0.9rem', color: '#334155', margin: 0 }}>
                <li>Compacted Volume: <strong>220.5 Cu Ft</strong> (8.17 cu yds)</li>
                <li>Loose Volume (+20%): <strong>264.6 Cu Ft</strong> (9.80 cu yds)</li>
                <li>Total Base Weight: <strong>13.72 Tons</strong> (Order 14.0 Tons)</li>
                <li>Est. Delivered Cost: <strong>~$607.00</strong></li>
              </ul>
            </div>
            <div style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>Two-Car Paver Driveway (600 Sq Ft)</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '10px' }}>31 ft × 21 ft excavation · 8&quot; Base · 20% Compaction</p>
              <ul style={{ paddingLeft: '18px', fontSize: '0.9rem', color: '#334155', margin: 0 }}>
                <li>Compacted Volume: <strong>434.0 Cu Ft</strong> (16.07 cu yds)</li>
                <li>Loose Volume (+20%): <strong>520.8 Cu Ft</strong> (19.29 cu yds)</li>
                <li>Total Base Weight: <strong>27.01 Tons</strong> (Order 28.0 Tons)</li>
                <li>Est. Delivered Cost: <strong>~$1,148.00</strong></li>
              </ul>
            </div>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            6 Essential Pro Tips for Compacting Paver Base Like a Master Hardscaper
          </h2>
          <ol style={{ paddingLeft: '20px', marginBottom: '32px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Always Compact Aggregate in 2-Inch to 3-Inch Lifts:</strong> Never dump 6 inches of loose crusher run into an excavation hole and expect a plate compactor to consolidate it in a single pass. Standard commercial rental plate compactors (delivering 3,000 to 4,500 lbs of centrifugal force) only penetrate effectively to a depth of 2.5 to 3 inches. The bottom layer will remain loose, creating severe settling and sunken ruts within two years. Spread 2 to 3 inches of stone, compact thoroughly, then add the next lift.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Moisten the Stone Before Running the Plate Compactor:</strong> Dry aggregate creates excessive friction and clouds of choking mineral dust. Lightly spray your gravel bed with a garden hose until it is uniformly damp (like moist brownie mix or a wrung-out sponge). Water acts as a microscopic hydraulic lubricant, allowing angular stones to glide past one another and pack into zero-void density.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Always Overdig the Perimeter by 6 Inches:</strong> A paver patio is only as strong as its edges. Edge restraint systems (commercial plastic or aluminum snap-edge profiles) require 10-inch steel spikes driven vertically every 12 to 18 inches. If your compacted stone stops right at the paver edge, your spikes will drive into soft garden dirt, allowing the outer perimeter row of pavers to roll over and separate.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Lay Heavy Geotextile Stabilization Fabric Over Native Subgrade:</strong> Before spreading your first wheelbarrow of aggregate, lay a durable woven or non-woven geotextile filter fabric directly over the raw excavated subsoil. On silt or expansive clay soils, moisture causes sharp base rocks to punch downward into the mud while squishy mud pumps upward into your clean stone base. Geotextile fabric permanently separates these layers, dramatically extending the lifespan of your patio.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Establish a Proper Slope for Drainage (1 Inch per 8 Feet):</strong> Never build a perfectly flat outdoor hardscape. Standing water will seep into bedding sand and freeze in winter. Always pitch your subbase and finished surface away from house foundations, retaining walls, or basement entries at a minimum downward grade of 1 inch for every 8 to 10 linear feet (a 1% to 1.5% slope).
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Double-Check Base Smoothness with an 8-Foot Screed Board:</strong> Before laying your 1-inch concrete sand bedding layer, place an 8-foot or 10-foot straight aluminum screed board across your compacted gravel. There should be no high ridges or deep birdbath hollows exceeding 1/4 inch. Your bedding sand should remain a perfectly uniform 1-inch cushion; never use sand to fill low depressions in an uneven gravel base.
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
              Related Hardscaping &amp; Excavation Calculators
            </h3>
            <p style={{ color: '#15803D', marginBottom: '12px' }}>
              Explore our connected suite of hardscape planning tools to estimate your entire patio foundation:
            </p>
            <ul style={{ paddingLeft: '20px', color: '#15803D', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
              <li><Link href="/paver-sand-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Paver Sand Calculator</Link></li>
              <li><Link href="/stone-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Stone &amp; Gravel Calculator</Link></li>
              <li><Link href="/tons-to-cubic-yards/" style={{ color: '#15803D', fontWeight: 600 }}>Tons to Cubic Yards</Link></li>
              <li><Link href="/cubic-yard-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Cubic Yard Calculator</Link></li>
              <li><Link href="/fill-dirt-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Fill Dirt Calculator</Link></li>
              <li><Link href="/square-footage-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Square Footage Calculator</Link></li>
            </ul>
          </div>
        </article>

        {/* Ad Placeholder Bottom */}
        <div style={{ marginTop: '32px' }}>
          <AdSlot slotId="paver-base-bottom" />
        </div>
      </main>
    </>
  );
}
