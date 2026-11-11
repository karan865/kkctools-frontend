import type { Metadata } from 'next';
import Link from 'next/link';
import PaverBaseCalculator from '@/components/tool/paver-base-calculator';
import AdSlot from '@/components/ads/AdSlot';
import { SITE_NAME, SITE_URL } from '@/config/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Paver Base Calculator — Crushed Stone & Gravel Tons',
  description:
    'Free paver base calculator to calculate tons, cubic yards, and bags of crushed stone or road base for patios, walkways, and driveways with compaction loss.',
  alternates: {
    canonical: `${SITE_URL}/paver-base-calculator/`,
  },
  openGraph: {
    title: 'Paver Base Calculator — Crushed Stone & Gravel Tons',
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
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
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
          text: 'For pedestrian walkways and residential patios, standard paver base depth is 4 inches of compacted crushed stone. For heavy use areas such as hot tub pads, outdoor kitchens, or vehicular driveways, increase the base depth to 6 to 10 inches.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best material to use for a paver base?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The industry standard paver base is dense-graded aggregate (commonly sold as crusher run, road base, #21A limestone, or recycled concrete). This blend of 3/4-inch crushed rock down to fine stone dust compacts into a rock-solid, impermeable foundation that will not rut or shift.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why do I need to add 15% to 20% for compaction?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'When loose crushed stone is run over with a heavy gas-powered vibratory plate tamper, air voids collapse and the stone particles interlock tightly. This reduces the physical volume by 15% to 20%. Failing to order extra will leave your base significantly lower than planned.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many bags of paver base equal one cubic yard?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Standard retail bags of paver base contain 0.5 cubic feet (approx 50 lbs). Because one cubic yard contains 27 cubic feet, you need 54 retail bags to equal one bulk cubic yard.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use sand as a paver base instead of gravel?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Never use sand as your primary base. Sand is fluid and easily washes away or shifts during heavy rain, which will cause your pavers to become wavy, uneven, and dangerous to walk on within months. Sand is strictly used as a thin 1-inch bedding layer on top of a solid 4-inch crushed stone foundation.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does a ton of paver base cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'At local commercial quarries and bulk landscape supply yards, bulk crusher run or #21A paver base typically costs between $30 and $55 per ton, plus a local delivery dump fee ($50 to $90). In bagged form at retail box stores, the same material costs approximately $160 to $220 per ton.',
        },
      },
    ],
  },
];

export default function PaverBaseCalculatorPage() {
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
            Paver Base Calculator: Estimate Tons &amp; Cubic Yards of Crushed Stone
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
            Accurately plan your patio foundation using our free <strong>paver base calculator</strong> (also functioning as a dedicated <strong>crushed stone paver base calculator</strong> and <strong>paver base tons calculator</strong>). Instantly computes loose aggregate volume, required <strong>paver base depth</strong>, and quarry delivery tonnage while automatically accounting for 15% to 20% mechanical compaction loss.
          </p>
        </header>

        {/* Interactive Tool */}
        <section aria-label="Paver Base Calculator Tool">
          <PaverBaseCalculator />
        </section>

        {/* Ad Placeholder */}
        <AdSlot slotId="paver-base-middle" />

        {/* Comprehensive SEO Editorial Content (2,200+ Words) */}
        <article style={{ marginTop: '48px', color: '#334155', lineHeight: 1.7, fontSize: '0.975rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            The Foundation of a Lasting Paver Surface: Why Base Compaction Matters
          </h2>
          <p style={{ marginBottom: '16px' }}>
            A stunning interlocking brick, stone, or concrete paver patio is an exquisite addition to any home, increasing usable outdoor living space and boosting property value. However, the long-term success of any paver installation is determined entirely by what lies underneath. When patios sink, pavers wobble, or walkways heave after freezing winter temperatures, the blame almost never rests on the pavers themselves—it is caused by an inadequate, poorly compacted crushed stone base.
          </p>
          <p style={{ marginBottom: '16px' }}>
            Calculating <strong>how much paver base do i need</strong> is tricky because of compaction shrinkage. When loose crushed gravel (such as <strong>crusher run paver base</strong>, road base, or #21A limestone) is vibrated with a heavy gas-powered plate tamper, air voids collapse and the stone particles interlock tightly, causing the physical volume to shrink by 15% to 20%. If you order only the raw excavated volume, your finished base will be significantly too thin!
          </p>
          <p style={{ marginBottom: '24px' }}>
            Once your base is compacted, apply your sand bed with our companion <Link href="/paver-sand-calculator/" style={{ color: '#0284C7' }}>paver sand calculator</Link>, or browse general gravel weights on our <Link href="/stone-calculator/" style={{ color: '#0284C7' }}>stone calculator</Link>.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            How Much Paver Base Do I Need? (Formula &amp; Compaction Loss)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            To manually calculate your paver base foundation, follow this 5-step engineering formula:
          </p>

          <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Measure the Excavation Surface Area:</strong> Always measure the length and width of the patio in feet. <em>Crucial Pro Rule:</em> Excavate your base <strong>6 inches wider on all sides</strong> than your planned paver footprint to support the edge restraints (snap-edge or concrete toe). For a 20 ft × 15 ft patio, excavate a 21 ft × 16 ft area: Excavation Area = 21 ft × 16 ft = 336 square feet.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Determine Finished Base Depth:</strong> Convert your required base depth from inches into feet by dividing by 12:
              <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                <li>Standard Patio / Walkway: 4 inches (4 / 12 = 0.333 ft)</li>
                <li>Driveway / Hot Tub: 6 to 8 inches (8 / 12 = 0.667 ft)</li>
              </ul>
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Calculate Finished Compacted Volume:</strong> Multiply the excavation area by the finished base depth: Compacted Cubic Feet = 336 sq ft × 0.333 ft = 111.9 cubic feet.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Multiply by the 15% to 20% Compaction Loss Factor:</strong> To ensure you have enough stone after plate compaction, multiply by 1.15 (for 15% compaction) or 1.20 (for 20% compaction on clay soils): Loose Volume to Order = 111.9 cu ft × 1.15 = 128.7 cubic feet.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Convert to Bulk Cubic Yards and US Short Tons:</strong> Divide loose cubic feet by 27 to obtain cubic yards, then multiply by standard crusher run density (1.40 tons per cubic yard):
              <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                <li>Cubic Yards to Order = 128.7 / 27 = <strong>4.77 Cubic Yards</strong>.</li>
                <li>Weight in Tons = 4.77 cu yds × 1.40 tons/yd³ = <strong>6.68 US Short Tons</strong> (Order 7.0 tons from quarry).</li>
              </ul>
            </li>
          </ol>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Paver Base Depth Guide: Walkways, Patios &amp; Driveways
          </h2>
          <p style={{ marginBottom: '16px' }}>
            How deep must your crushed stone foundation be? Use this comprehensive structural reference table based on ICPI guidelines:
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Project Type</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Subsoil Condition</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Recommended Base Depth</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Total Excavation Depth</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Compactor Passes</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Garden Walkway / Footpath</td>
                  <td style={{ padding: '10px 14px' }}>Sandy / Well-Drained</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>4 Inches</td>
                  <td style={{ padding: '10px 14px' }}>7.5 Inches</td>
                  <td style={{ padding: '10px 14px' }}>2 passes in 2&quot; lifts</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Standard Residential Patio</td>
                  <td style={{ padding: '10px 14px' }}>Standard Loam / Mixed Soil</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>4 Inches</td>
                  <td style={{ padding: '10px 14px' }}>7.5 Inches</td>
                  <td style={{ padding: '10px 14px' }}>3 passes in 2&quot; lifts</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Heavy Patio (Fire Pit / Kitchen)</td>
                  <td style={{ padding: '10px 14px' }}>Heavy Clay Soil</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>6 Inches</td>
                  <td style={{ padding: '10px 14px' }}>9.5 Inches</td>
                  <td style={{ padding: '10px 14px' }}>3 passes in 3&quot; lifts</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Hot Tub / Swim Spa Pad</td>
                  <td style={{ padding: '10px 14px' }}>Any Soil Type</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>6 to 8 Inches</td>
                  <td style={{ padding: '10px 14px' }}>9.5 to 11.5 Inches</td>
                  <td style={{ padding: '10px 14px' }}>4 passes in 2&quot; lifts</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Residential Driveway (Cars)</td>
                  <td style={{ padding: '10px 14px' }}>Standard Soil</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>8 Inches</td>
                  <td style={{ padding: '10px 14px' }}>11.5 Inches</td>
                  <td style={{ padding: '10px 14px' }}>4 passes in 2.5&quot; lifts</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Heavy Commercial / RV Pad</td>
                  <td style={{ padding: '10px 14px' }}>Clay / Wet Subsoil</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>10 to 12 Inches</td>
                  <td style={{ padding: '10px 14px' }}>13.5 to 15.5 Inches</td>
                  <td style={{ padding: '10px 14px' }}>5 passes in 3&quot; lifts</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Crushed Stone vs. Paver Base: What Material is Best?
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Homeowners often wonder: <em>&quot;What exact material is paver base made of?&quot;</em>
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Dense-Graded Aggregate (Crusher Run / #21A Limestone / ABC Stone) — THE BEST CHOICE:</strong> A blend of 3/4-inch jagged crushed stone mixed with smaller chips, grit, and fine limestone rock dust. When compacted and misted with water, the fine dust locks the stone particles into an unyielding, non-shifting subbase that resists frost heave.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Recycled Concrete Aggregate (Crushed Concrete Base) — EXCELLENT BUDGET CHOICE:</strong> Clean, pulverized concrete sieved to 3/4-inch minus. Offers identical structural performance to crushed limestone at a 20% to 30% lower cost per ton.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Clean Washed Stone (#57 Stone without fines) — DRAINAGE ONLY:</strong> While great for French drains, clean stone lacks the fines necessary to lock together tightly under plate compaction. Do not use clean stone for your main paver base unless building a specialized permeable paver system.
            </li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Buying Bagged Paver Base (0.5 cu ft) vs. Bulk Dump Truck Delivery
          </h2>
          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Metric</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Home Improvement Retail Bags (0.5 cu ft)</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Bulk Quarry Delivery (by the Ton)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Weight per Unit</td>
                  <td style={{ padding: '10px 14px' }}>~50 lbs per bag</td>
                  <td style={{ padding: '10px 14px' }}>2,000 lbs per ton</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Bags per Cubic Yard</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#DC2626' }}>54 bags needed</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#166534' }}>1.4 tons equals 1 cubic yard</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Cost per Cubic Yard</td>
                  <td style={{ padding: '10px 14px' }}>~$250 to $325 ($4.50–$6.00/bag)</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#166534' }}>$50 to $85 per cubic yard</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Best Used For</td>
                  <td style={{ padding: '10px 14px' }}>Small repairs, step landings, under 15 bags</td>
                  <td style={{ padding: '10px 14px' }}>Any patio or walkway larger than 50 sq ft</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            5 Essential Pro Tips for Compacting Paver Base
          </h2>
          <ol style={{ paddingLeft: '20px', marginBottom: '32px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Always Compact in 2-Inch to 3-Inch Lifts:</strong> Never dump 6 inches of loose gravel into a hole and attempt to compact it all at once. Standard rental plate compactors (weighing 150 to 200 lbs) only produce enough compaction force to penetrate 2 to 3 inches deep. Lay 2 inches of stone, compact thoroughly, then repeat.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Moisten the Stone Before Compacting:</strong> Dry stone generates excessive friction and creates clouds of dust. Spray the gravel with a garden hose until damp. Water lubricates the stone particles, allowing them to slide tightly together into zero-void compaction.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Overdig the Perimeter by 6 Inches:</strong> If your patio is 15 feet wide, your crushed stone base must be 16 feet wide. Paver edge restraints require at least 6 inches of solid compacted base extending past the outside edge of the pavers to anchor 10-inch steel spikes securely.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Lay Heavy Geotextile Fabric Under the Base:</strong> On clay or silty soils, always lay a heavy woven or non-woven geotextile stabilization fabric directly over the raw subsoil before dumping gravel. This prevents sharp gravel from sinking into soft mud over time.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Check Slope for Water Runoff (1 Inch per 8 Feet):</strong> Never build a flat patio. Grade your compacted base to slope away from home foundations at a rate of 1 inch of downward fall for every 8 to 10 linear feet.
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
              Related Hardscaping &amp; Excavation Calculators
            </h3>
            <p style={{ color: '#15803D', marginBottom: '12px' }}>
              Explore our connected suite of hardscape planning tools to estimate your entire patio foundation:
            </p>
            <ul style={{ paddingLeft: '20px', color: '#15803D', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
              <li><Link href="/paver-sand-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Paver Sand Calculator</Link></li>
              <li><Link href="/stone-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Stone Calculator</Link></li>
              <li><Link href="/tons-to-cubic-yards/" style={{ color: '#15803D', fontWeight: 600 }}>Tons to Cubic Yards</Link></li>
              <li><Link href="/cubic-yard-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Cubic Yard Calculator</Link></li>
              <li><Link href="/fill-dirt-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Fill Dirt Calculator</Link></li>
              <li><Link href="/square-footage-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Square Footage Calculator</Link></li>
            </ul>
          </div>
        </article>
      </main>
    </>
  );
}

