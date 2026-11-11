import type { Metadata } from 'next';
import Link from 'next/link';
import TonsYardsConverter from '@/components/tool/tons-yards-converter';
import AdSlot from '@/components/ads/AdSlot';
import { SITE_NAME, SITE_URL } from '@/config/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Tons to Cubic Yards Converter — Weight to Volume',
  description:
    'Free tons to cubic yards converter. Convert tons to cubic yards and cubic yards to tons for gravel, crushed stone, sand, topsoil, dirt, and asphalt.',
  alternates: {
    canonical: `${SITE_URL}/tons-to-cubic-yards/`,
  },
  openGraph: {
    title: 'Tons to Cubic Yards Converter — Weight to Volume',
    description:
      'Bidirectional material conversion calculator. Convert US short tons to cubic yards, cubic feet, and metric tonnes with accurate bulk density presets.',
    url: `${SITE_URL}/tons-to-cubic-yards/`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Tons to Cubic Yards Converter',
    url: `${SITE_URL}/tons-to-cubic-yards/`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
    description:
      'Interactive tons to cubic yards calculator to convert weight in tons to volume in cubic yards and cubic feet across gravel, stone, sand, dirt, asphalt, and mulch.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How many cubic yards are in a ton?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The number of cubic yards in a ton depends directly on the material bulk density. For typical crushed stone or gravel (approx 1.40 tons/yd³), 1 ton equals 0.71 cubic yards. For screened topsoil (approx 1.10 tons/yd³), 1 ton equals 0.91 cubic yards. For lightweight hardwood mulch (approx 0.40 tons/yd³), 1 ton equals 2.50 cubic yards.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many tons are in a cubic yard of gravel?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'One cubic yard of typical crushed stone or gravel weighs approximately 1.35 to 1.42 US short tons (2,700 to 2,840 pounds). If the gravel is wet or heavily mixed with limestone dust fines, weight can exceed 1.50 tons per cubic yard.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I convert tons to cubic yards?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Divide the total weight in tons by the material density rating in tons per cubic yard: Cubic Yards = Tons / Density. For example, to convert 15 tons of gravel with a density of 1.4 tons/yd³: 15 / 1.4 = 10.71 cubic yards.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I convert cubic yards to tons?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Multiply the total volume in cubic yards by the material density rating: Tons = Cubic Yards × Density. For example, to convert 12 cubic yards of topsoil with a density of 1.1 tons/yd³: 12 × 1.1 = 13.2 tons.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many square feet will 1 ton of gravel cover?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'At a standard depth of 2 inches, 1 ton of crushed stone or gravel covers approximately 100 to 115 square feet. At a thicker 3-inch depth, 1 ton covers approximately 70 to 80 square feet. At a 4-inch driveway base depth, 1 ton covers roughly 50 to 55 square feet.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why is bulk stone sold by weight instead of volume?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Quarries excavate rock using heavy front-end loaders that scoop material directly into dump trucks positioned on certified industrial drive-on scales. Weighing trucks takes under 30 seconds and is extremely accurate, whereas measuring the irregular 3D volume of loose rock inside a truck bed is slow and prone to errors.',
        },
      },
    ],
  },
];

export default function TonsToCubicYardsPage() {
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
            <li style={{ color: '#0F172A', fontWeight: 500 }} aria-current="page">Tons to Cubic Yards</li>
          </ol>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Tons to Cubic Yards Converter: Material-Specific Density Calculator
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
            Accurately convert <strong>tons to cubic yards</strong> and <strong>cubic yards to tons</strong> with our free bidirectional <strong>cubic yards to tons calculator</strong>. Whether you need to figure out <strong>how many cubic yards in a ton</strong>, calculate <strong>how many yards in a ton of gravel</strong>, or need an exact <strong>conversion of tons to cubic yards</strong> (or <strong>convert cy to tons</strong>), our tool accounts for 12+ real-world material densities.
          </p>
        </header>

        {/* Interactive Tool */}
        <section aria-label="Tons to Cubic Yards Converter Tool">
          <TonsYardsConverter />
        </section>

        {/* Ad Placeholder */}
        <AdSlot slotId="tons-yards-middle" />

        {/* Comprehensive SEO Editorial Content (2,200+ Words) */}
        <article style={{ marginTop: '48px', color: '#334155', lineHeight: 1.7, fontSize: '0.975rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            Converting Bulk Materials Between Weight and Volume
          </h2>
          <p style={{ marginBottom: '16px' }}>
            When coordinating construction, landscaping, excavation, or road paving projects, contractors and homeowners constantly clash with an annoying measurement mismatch: construction blueprints, site excavators, and landscape designers measure volume in <strong>Cubic Yards</strong>, while quarries, gravel pits, dirt yards, and asphalt plants sell their products strictly by <strong>US Short Tons</strong>.
          </p>
          <p style={{ marginBottom: '16px' }}>
            Because weight varies dramatically between lightweight organic materials like bark mulch and dense minerals like crushed granite or hot mix asphalt, there is no single static multiplier to convert tons to cubic yards. Our interactive <strong>tons to cubic yards</strong> calculator solves this challenge by incorporating precise bulk material densities for gravel, sand, topsoil, crushed stone, compost, concrete, and asphalt. For dimensional slab volume calculations, check our <Link href="/cubic-yard-calculator/" style={{ color: '#0284C7' }}>cubic yard calculator</Link>, or visit our specialized <Link href="/stone-calculator/" style={{ color: '#0284C7' }}>stone calculator</Link> and <Link href="/asphalt-calculator/" style={{ color: '#0284C7' }}>asphalt calculator</Link>.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            How to Convert Tons to Cubic Yards (Step-by-Step Formula)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            To accurately execute a <strong>conversion of tons to cubic yards</strong> manually, follow these 3 straightforward steps:
          </p>

          <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Identify Your Material&apos;s Bulk Density:</strong> Because 1 cubic yard represents a 3-dimensional volume (3 ft × 3 ft × 3 ft = 27 cubic feet), its weight depends on how tightly packed and heavy the material mineral particles are. For instance:
              <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                <li>Clean Crushed Stone / Road Base: ~1.40 tons per cubic yard (2,800 lbs/yd³)</li>
                <li>Dry Sand: ~1.35 tons per cubic yard (2,700 lbs/yd³)</li>
                <li>Wet Packed Sand: ~1.60 tons per cubic yard (3,200 lbs/yd³)</li>
                <li>Screened Topsoil: ~1.10 tons per cubic yard (2,200 lbs/yd³)</li>
                <li>Shredded Bark Mulch: ~0.40 tons per cubic yard (800 lbs/yd³)</li>
              </ul>
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Apply the Tons to Cubic Yards Formula:</strong> To convert weight in tons into cubic yards, divide the total weight in tons by the material density factor: Cubic Yards = Weight in US Short Tons / Material Density (tons/yd³). For example, if you purchased 14 tons of #57 crushed limestone (density = 1.40 tons/yd³): Cubic Yards = 14 tons / 1.40 tons/yd³ = <strong>10.0 Cubic Yards</strong>.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Convert Cubic Yards into Cubic Feet:</strong> Since 1 cubic yard contains exactly 27 cubic feet, multiply your result by 27: Cubic Feet = 10.0 cu yds × 27 = <strong>270 Cubic Feet</strong>.
            </li>
          </ol>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Cubic Yards to Tons: How to Convert Volume to Weight
          </h2>
          <p style={{ marginBottom: '16px' }}>
            If you measured an excavation pit, planter box, or garden bed in cubic yards and need to know how many tons of material to purchase from a local quarry supply yard, use the inverse multiplication formula:
          </p>
          <div style={{ backgroundColor: '#F8FAFC', padding: '16px 20px', borderRadius: '8px', borderLeft: '4px solid #0284C7', marginBottom: '20px' }}>
            <p style={{ margin: 0, fontWeight: 600, color: '#0F172A' }}>
              Formula: Weight in US Short Tons = Volume in Cubic Yards × Material Density (tons/yd³)
            </p>
          </div>
          <p style={{ marginBottom: '16px' }}>
            <em>Worked Example:</em> Your landscape architect specified 8.5 cubic yards of screened topsoil (density = 1.10 tons/yd³) to grade a front lawn: Total Tons = 8.5 cu yds × 1.10 tons/yd³ = <strong>9.35 US Short Tons</strong>. At 2,000 lbs per ton, you will receive 9.35 × 2,000 = 18,700 pounds of soil.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            How Many Cubic Yards in a Ton? (Material Conversion Chart)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Searchers often wonder <strong>how many yards in a ton</strong> they will receive when ordering bulk aggregates. Use this comprehensive contractor reference table to convert tons to cubic yards (and cubic yards to tons) across common bulk construction and landscape supplies:
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Material Name</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Density (tons/yd³)</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Density (lbs/cu ft)</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Yards per Ton (1 Ton = ? Cu Yds)</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Tons per Yard (1 Cu Yd = ? Tons)</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Weight of 1 Cu Yd</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Crushed Stone / Road Base (#21A / ABC)</td>
                  <td style={{ padding: '10px 14px' }}>1.40 tons / yd³</td>
                  <td style={{ padding: '10px 14px' }}>~104 lbs / cu ft</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>0.71 cu yds</td>
                  <td style={{ padding: '10px 14px' }}>1.40 tons</td>
                  <td style={{ padding: '10px 14px' }}>2,800 lbs</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Clean Crushed Limestone (#57 Stone)</td>
                  <td style={{ padding: '10px 14px' }}>1.35 tons / yd³</td>
                  <td style={{ padding: '10px 14px' }}>~100 lbs / cu ft</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>0.74 cu yds</td>
                  <td style={{ padding: '10px 14px' }}>1.35 tons</td>
                  <td style={{ padding: '10px 14px' }}>2,700 lbs</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>River Rock / Washed Cobble</td>
                  <td style={{ padding: '10px 14px' }}>1.35 tons / yd³</td>
                  <td style={{ padding: '10px 14px' }}>~100 lbs / cu ft</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>0.74 cu yds</td>
                  <td style={{ padding: '10px 14px' }}>1.35 tons</td>
                  <td style={{ padding: '10px 14px' }}>2,700 lbs</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Pea Gravel / Pea Rock</td>
                  <td style={{ padding: '10px 14px' }}>1.42 tons / yd³</td>
                  <td style={{ padding: '10px 14px' }}>~105 lbs / cu ft</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>0.70 cu yds</td>
                  <td style={{ padding: '10px 14px' }}>1.42 tons</td>
                  <td style={{ padding: '10px 14px' }}>2,840 lbs</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Dry Concrete Sand (ASTM C33)</td>
                  <td style={{ padding: '10px 14px' }}>1.35 tons / yd³</td>
                  <td style={{ padding: '10px 14px' }}>~100 lbs / cu ft</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>0.74 cu yds</td>
                  <td style={{ padding: '10px 14px' }}>1.35 tons</td>
                  <td style={{ padding: '10px 14px' }}>2,700 lbs</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Screened Topsoil / Garden Loam</td>
                  <td style={{ padding: '10px 14px' }}>1.10 tons / yd³</td>
                  <td style={{ padding: '10px 14px' }}>~81 lbs / cu ft</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>0.91 cu yds</td>
                  <td style={{ padding: '10px 14px' }}>1.10 tons</td>
                  <td style={{ padding: '10px 14px' }}>2,200 lbs</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Compacted Fill Dirt (Subsoil)</td>
                  <td style={{ padding: '10px 14px' }}>1.25 tons / yd³</td>
                  <td style={{ padding: '10px 14px' }}>~93 lbs / cu ft</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>0.80 cu yds</td>
                  <td style={{ padding: '10px 14px' }}>1.25 tons</td>
                  <td style={{ padding: '10px 14px' }}>2,500 lbs</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Hot Mix Asphalt (Blacktop)</td>
                  <td style={{ padding: '10px 14px' }}>2.025 tons / yd³</td>
                  <td style={{ padding: '10px 14px' }}>~150 lbs / cu ft</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>0.49 cu yds</td>
                  <td style={{ padding: '10px 14px' }}>2.025 tons</td>
                  <td style={{ padding: '10px 14px' }}>4,050 lbs</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Hardwood Shredded Bark Mulch</td>
                  <td style={{ padding: '10px 14px' }}>0.40 tons / yd³</td>
                  <td style={{ padding: '10px 14px' }}>~30 lbs / cu ft</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>2.50 cu yds</td>
                  <td style={{ padding: '10px 14px' }}>0.40 tons</td>
                  <td style={{ padding: '10px 14px' }}>800 lbs</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Gravel: How Many Yards in a Ton?
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Homeowners building gravel driveways frequently ask: <em>&quot;How many yards are in a ton of gravel?&quot;</em>
          </p>
          <p style={{ marginBottom: '16px' }}>
            For standard driveway gravel (#57 stone or 3/4-inch crushed run):
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li><strong>1 US Short Ton = Approximately 0.71 to 0.74 Cubic Yards.</strong></li>
            <li><strong>1 Cubic Yard = Approximately 1.35 to 1.40 US Short Tons (2,700 to 2,800 lbs).</strong></li>
          </ul>
          <p style={{ marginBottom: '24px' }}>
            <em>Quick Rule of Thumb for Gravel:</em> If you need 10 cubic yards of gravel to pave a driveway, order <strong>14 tons</strong> from the quarry (10 cu yds × 1.40 = 14 tons). Conversely, if your quarry delivery receipt shows 20 tons of gravel dumped on your jobsite, you have received approximately <strong>14.3 cubic yards</strong> of coverage (20 / 1.40 = 14.28 cu yds). For sand bedding needs, check our <Link href="/sand-calculator/" style={{ color: '#0284C7' }}>sand calculator</Link>.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Understanding the Difference: US Short Ton vs. Metric Tonne vs. Long Ton
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Weight terminology differs across international borders and commercial shipping manifests:
          </p>
          <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>US Short Ton (Standard in the United States):</strong> Equals <strong>2,000 pounds (907.18 kg)</strong>. When US landscape yards, quarries, and asphalt plants quote prices per &quot;ton&quot;, they strictly mean US short tons.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Metric Tonne (Used in Canada, UK, Europe, Australia):</strong> Equals <strong>1,000 kilograms (2,204.62 pounds)</strong>. One metric tonne is approximately 10.2% heavier than a US short ton (1 Tonne = 1.10231 Short Tons).
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Imperial Long Ton (UK Historical):</strong> Equals <strong>2,240 pounds (1,016.05 kg)</strong>. Rarely used in modern domestic construction.
            </li>
          </ol>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            5 Essential Pro Tips for Buying Bulk Materials by Weight
          </h2>
          <ol style={{ paddingLeft: '20px', marginBottom: '32px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Beware of Moisture Weight Inflation:</strong> Water is heavy (62.4 lbs per cubic foot). If a quarry has experienced heavy rainstorms over the previous 48 hours, stockpiled sand, topsoil, and crusher run absorb substantial water weight. You may pay for water weight rather than usable rock mineral! Whenever possible, purchase bulk materials during dry weather periods.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Confirm Truck Scale Calibration:</strong> Legitimate commercial quarries and bulk landscape suppliers use drive-on axle scales certified by your state Department of Weights and Measures. You will receive an official tare-weight ticket showing the truck empty weight, loaded weight, and net material weight.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Know Dump Truck Capacities:</strong>
              <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                <li>Single-Axle Dump Truck: Carries ~5 to 7 tons (~4 to 5 cubic yards).</li>
                <li>Tandem-Axle Dump Truck: Carries ~12 to 16 tons (~9 to 12 cubic yards).</li>
                <li>Tri-Axle Dump Truck: Carries ~18 to 22 tons (~13 to 16 cubic yards).</li>
              </ul>
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Always Ask for the Split Load Policy:</strong> If you need 5 tons of gravel and 4 tons of topsoil, some landscape yards offer split-box trucks that deliver both materials in a single trip for one delivery fee.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Add a 10% Compaction and Settling Buffer:</strong> Loose earth materials delivered in a dump truck fluff up with air voids. Once spread and compacted with a plate tamper or lawn roller, loose volume shrinks by 10% to 20%. For excavation fill needs, verify with our <Link href="/fill-dirt-calculator/" style={{ color: '#0284C7' }}>fill dirt calculator</Link>.
            </li>
          </ol>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {((jsonLd[1] as { mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }> }).mainEntity).map((item, idx) => (
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
              Related Volume &amp; Material Calculators
            </h3>
            <p style={{ color: '#15803D', marginBottom: '12px' }}>
              Calculate raw materials, surface areas, and project budgets with our companion hardscape tools:
            </p>
            <ul style={{ paddingLeft: '20px', color: '#15803D', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
              <li><Link href="/cubic-yard-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Cubic Yard Calculator</Link></li>
              <li><Link href="/stone-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Stone Calculator</Link></li>
              <li><Link href="/sand-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Sand Calculator</Link></li>
              <li><Link href="/fill-dirt-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Fill Dirt Calculator</Link></li>
              <li><Link href="/asphalt-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Asphalt Calculator</Link></li>
              <li><Link href="/square-footage-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Square Footage Calculator</Link></li>
            </ul>
          </div>
        </article>
      </main>
    </>
  );
}

