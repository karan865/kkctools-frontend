import type { Metadata } from 'next';
import Link from 'next/link';
import StudCalculator from '@/components/tool/stud-calculator';
import AdSlot from '@/components/ads/AdSlot';
import { SITE_NAME, SITE_URL } from '@/config/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Stud Calculator — Wall Framing & Lumber',
  description:
    'Free stud calculator and wall framing calculator. Calculate 2x4 and 2x6 studs needed for 16" or 24" OC walls, corners, doors, windows, and plates.',
  alternates: {
    canonical: `${SITE_URL}/stud-calculator/`,
  },
  openGraph: {
    title: 'Stud Calculator — Wall Framing & Lumber',
    description:
      'Calculate studs, corner assemblies, door/window headers, king and jack studs, top and bottom plates, and framing lumber costs.',
    url: `${SITE_URL}/stud-calculator/`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Stud Framing Calculator',
    url: `${SITE_URL}/stud-calculator/`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
    description:
      'Interactive wall framing calculator to calculate 2x4 or 2x6 field studs, 3-stud California corners, partition intersections, king and jack trimmer studs, top/bottom plates, and lumber costs.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How many studs do I need for a 10-foot wall?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For a 10-foot wall with 16-inch on-center spacing, multiply 10 by 0.75 and add 1 stud to get approximately 9 field studs. If the wall has corners or doors, add 3 studs per corner and 4 studs per door, plus 10% for waste (typically 10 to 12 studs total).',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the simple rule of thumb for calculating studs?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A standard framing contractor rule of thumb is one stud for every linear foot of wall (1 stud per linear foot). While field studs only occur every 16 inches (0.75 studs/ft), the extra 0.25 studs/ft accurately accounts for the extra lumber needed for corners, wall junctions, door trimmers, and scrap waste.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should I use 2x4 or 2x6 lumber for framing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use 2x4 lumber for interior non-bearing partition walls, basement divider walls, and standard interior closet framing. Use 2x6 lumber for exterior walls (to accommodate high-R-value R-19 or R-21 fiberglass insulation batts), second-story load-bearing exterior walls, and plumbing wet walls containing large 3-inch PVC sewer drain pipes.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I calculate wall plates for framing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Multiply your total wall run length by 3 for standard residential construction (which requires 1 bottom sole plate and a double top plate). Divide total linear footage by 16 to determine how many 16-foot stock lumber boards to purchase.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why do framed walls need a double top plate?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A single top plate would buckle under heavy roof truss or second-story joist point loads that do not land directly over a wall stud. The second overlapping top plate distributes heavy roof loads across adjacent studs and interlocks adjoining perpendicular walls at corners, preventing cracking drywall joints.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many king and jack studs are needed for a door?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Every standard door rough opening requires 2 king studs (one full stud running ceiling-to-floor on each side) and 2 jack/trimmer studs (cut to the exact height of the door header and nailed inside the king studs to support the header).',
        },
      },
    ],
  },
];

export default function StudCalculatorPage() {
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
            <li style={{ color: '#0F172A', fontWeight: 500 }} aria-current="page">Stud Calculator</li>
          </ol>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Stud Calculator: Estimate Wall Framing Lumber, Studs &amp; Plates
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
            Accurately plan your framing projects using our free <strong>stud calculator</strong> (also known as a <strong>wall stud calculator</strong>, <strong>stud wall calculator</strong>, and comprehensive <strong>framing calculator</strong>). Instantly compute vertical studs, corner assemblies, rough opening trimmers, top/bottom plates, and material costs with our built-in <strong>framing cost calculator</strong>.
          </p>
        </header>

        {/* Interactive Tool */}
        <section aria-label="Stud and Framing Calculator Tool">
          <StudCalculator />
        </section>

        {/* Ad Placeholder */}
        <AdSlot slotId="stud-calc-middle" />

        {/* Comprehensive SEO Editorial Content (2,200+ Words) */}
        <article style={{ marginTop: '48px', color: '#334155', lineHeight: 1.7, fontSize: '0.975rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            Wall Stud Calculator Guide: Accurately Estimating Framing Lumber
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Whether you are finishing an unfinished basement, partitioning an open room, framing a garage workshop, or constructing a full home addition from the ground up, accurately estimating your framing lumber is the foundation of any carpentry project. Nothing stalls a job faster than running out of 2x4 or 2x6 studs halfway through an installation, requiring emergency trips to the lumberyard and halting your drywall schedule. Conversely, over-purchasing leaves expensive lumber rotting on site.
          </p>
          <p style={{ marginBottom: '16px' }}>
            Our professional <strong>stud calculator for wall</strong> assemblies calculates far more than a simplistic length-divided-by-spacing estimate. By factoring in international residential building code (IRC) framing practices, this tool computes exact counts for vertical field studs, 3-stud California corner assemblies, partition T-junction nailers, king and jack trimmer studs for rough openings, horizontal bottom sole plates, and overlapping double top plates. For roofing structures, link seamlessly with our <Link href="/rafter-calculator/" style={{ color: '#0284C7' }}>rafter calculator</Link>, or use our <Link href="/linear-foot-calculator/" style={{ color: '#0284C7' }}>linear foot calculator</Link> for plate board lumber runs.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            How to Calculate Studs for a Wall (Step-by-Step Framing Formula)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Framing carpenters follow a precise mathematical sequence to frame structurally sound, code-compliant walls. Follow these 7 steps to <strong>calculate studs</strong> for any wood-framed wall:
          </p>

          <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Convert Wall Length to Inches:</strong> Measure the linear run of your wall in feet and multiply by 12 to convert to inches: Length in Inches = Wall Length (ft) × 12. For example, a 20-foot basement partition wall equals 20 × 12 = 240 inches.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Divide by On-Center Stud Spacing:</strong> Divide total inches by your chosen on-center spacing (typically 16 inches for load-bearing walls or 24 inches for utility partitions): Spacing Intervals = Length in Inches / Stud Spacing (16 or 24). For example, for a 240-inch wall at 16 inches on-center: 240 / 16 = 15 spaces.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Add One Stud for the Wall End:</strong> A row of studs requires an extra stud at the terminal end to close the final stud bay cavity: Base Field Studs = 15 + 1 = 16 studs.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Add Studs for 90-Degree Corners (+3 Studs Each):</strong> Where two walls meet at a 90-degree corner, you cannot simply butt two single studs together, or there will be no solid nailing edge inside the room for attaching drywall. Modern framing utilizes a <strong>three-stud California corner</strong>, which requires 3 full-length studs per corner to lock the walls together and provide solid drywall backing. For 2 corners: 2 × 3 = 6 additional studs.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Add Studs for Doors and Window Openings (+4 Studs Each):</strong> Every door and window rough opening requires structural framing to support the wall load above:
              <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                <li><strong>2 King Studs:</strong> Full-height vertical studs nailed on the outside of the opening.</li>
                <li><strong>2 Jack / Trimmer Studs:</strong> Shortened vertical studs nailed inside the king studs to support the horizontal header beam.</li>
              </ul>
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Calculate Top and Bottom Plates:</strong> Walls require horizontal lumber plates at the floor and ceiling:
              <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                <li><strong>Bottom Sole Plate:</strong> 1 continuous horizontal board anchored to the subfloor (must be pressure-treated if laid over concrete).</li>
                <li><strong>Double Top Plate:</strong> 2 horizontal boards at the top of the wall that overlap at corners to tie the entire room into a rigid structural box.</li>
                <li>Total Plates Linear Feet = Wall Length × 3. For a 20-foot wall: 20 × 3 = 60 linear feet. If purchasing standard 16-foot stock boards: 60 / 16 = 3.75 → 4 boards.</li>
              </ul>
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Include a 10% Waste Buffer:</strong> Lumber is an organic natural product. In any bundle of dimensional framing lumber, 5% to 10% of boards will suffer from severe bowing, crowning, checking, or large bark wanes that render them unusable as full-height studs. Always add a 10% waste buffer to your order.
            </li>
          </ol>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Framing Calculator: 16-Inch vs. 24-Inch On-Center Spacing
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Understanding when to frame at 16 inches on-center versus 24 inches on-center is essential for code compliance and structural stability:
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Framing Standard</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Stud Spacing (OC)</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Studs per 10 Linear Feet</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Recommended Applications</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Advantages &amp; Considerations</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>16&quot; On-Center (OC)</td>
                  <td style={{ padding: '10px 14px' }}>16 inches (406 mm)</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>~8.5 studs</td>
                  <td style={{ padding: '10px 14px' }}>Exterior load-bearing walls, 2-story homes, tiled bathroom walls, heavy cabinetry walls</td>
                  <td style={{ padding: '10px 14px' }}>Maximum shear strength; prevents drywall bowing; universal standard for residential construction.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>24&quot; On-Center (OC)</td>
                  <td style={{ padding: '10px 14px' }}>24 inches (610 mm)</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>~6.0 studs</td>
                  <td style={{ padding: '10px 14px' }}>Non-load-bearing interior partition walls, basement dividers, detached utility sheds</td>
                  <td style={{ padding: '10px 14px' }}>Saves ~25% lumber cost; allows thicker insulation batts (Advanced Framing / OVE); requires 5/8&quot; drywall to avoid sagging.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Anatomy of a Framed Wall Opening: King, Jack &amp; Cripple Studs
          </h2>
          <p style={{ marginBottom: '16px' }}>
            When framing rough openings for doors and windows, standard wall studs are cut away, requiring specialized framing members to transfer floor and roof loads around the opening:
          </p>

          <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>King Studs (Full Studs):</strong> Full-height studs running from bottom plate to top plate on either side of the rough opening. They maintain wall verticality and provide attachment points for casing trim.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Jack Studs / Trimmers:</strong> Cut to fit directly underneath each end of the horizontal header beam. Jack studs carry the entire downward gravitational load from the header down to the bottom sole plate.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Rough Header:</strong> A solid beam (commonly two 2x6, 2x8, 2x10, or 2x12 boards sandwiched with 1/2-inch plywood spacer) spanning across the top of the opening to bridge the structural load across the span.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Cripple Studs:</strong> Shortened studs installed on 16-inch centers above the header or below window sills to maintain drywall nailing spacing without carrying structural weight.
            </li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Framing Cost Calculator: Estimating DIY vs. Professional Contractor Costs
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Lumber pricing fluctuates based on regional commodity timber markets, but material budgeting follows consistent ratios:
          </p>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0F172A', marginBottom: '10px' }}>
            DIY Material Costs ($1.00 – $2.50 per sq ft of wall area)
          </h3>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li><strong>Standard 2x4x8&apos; Studs (Spruce-Pine-Fir / Hem-Fir):</strong> $3.50 to $6.00 per stud.</li>
            <li><strong>Heavy-Duty 2x6x8&apos; Studs:</strong> $6.00 to $9.50 per stud.</li>
            <li><strong>Pressure-Treated 2x4x16&apos; Bottom Plates:</strong> $12.00 to $18.00 per board.</li>
            <li><strong>Fasteners (3&quot; 16D Common Nails / Framing Screws):</strong> $30 to $50 per 5 lb box.</li>
          </ul>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0F172A', marginBottom: '10px' }}>
            Professional Framing Labor ($5.00 – $10.00 per linear foot)
          </h3>
          <p style={{ marginBottom: '24px' }}>
            Professional carpentry framing crews charge between $5 and $10 per linear foot of framed interior wall for labor, or $8 to $16 per linear foot for exterior walls including window setting and plywood sheathing. A typical 200-linear-foot basement framing project costs approximately $1,200 to $2,000 for materials, and $2,500 to $4,500 if hiring a licensed carpentry sub-contractor. Use our <Link href="/construction-estimate-template/" style={{ color: '#0284C7' }}>construction estimate template</Link> to build comprehensive client quotes.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Worked Example: Framing a 28 ft × 14 ft Basement Living Area
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Let&apos;s calculate the exact lumber order for finishing an L-shaped basement wall section:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li><strong>Total Wall Length:</strong> 28 feet (main wall) + 14 feet (return wall) = 42 linear feet.</li>
            <li><strong>Wall Height:</strong> 8 feet.</li>
            <li><strong>Stud Spacing:</strong> 16 inches on-center.</li>
            <li><strong>Corners:</strong> 2 outside 90-degree corners.</li>
            <li><strong>Partitions:</strong> 1 intersecting closet wall (T-junction).</li>
            <li><strong>Openings:</strong> 1 pre-hung interior door (32&quot; door) + 1 egress window.</li>
          </ul>

          <p style={{ marginBottom: '10px', fontWeight: 600 }}>Step-by-Step Math:</p>
          <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li>Wall Length in Inches = 42 ft × 12 = 504 inches.</li>
            <li>Base Field Studs = Math.ceil(504 / 16) + 1 = 32 + 1 = 33 studs.</li>
            <li>Corners (2 corners × 3 studs) = 6 studs.</li>
            <li>T-Junctions (1 wall × 2 studs) = 2 studs.</li>
            <li>Openings (2 openings × 4 studs) = 8 studs.</li>
            <li>Subtotal Studs = 33 + 6 + 2 + 8 = 49 studs.</li>
            <li>Add 10% Waste = 49 × 1.10 = 53.9 → <strong>54 Studs (2x4x8&apos;)</strong>.</li>
            <li>
              Plates Linear Feet = 42 ft × 3 plates = 126 Linear Feet.
              <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                <li>Bottom Plates (Pressure-Treated): 42 / 16 = <strong>3 Boards (2x4x16&apos;)</strong>.</li>
                <li>Top Plates (Standard Framing): (42 × 2) / 16 = 84 / 16 = <strong>6 Boards (2x4x16&apos;)</strong>.</li>
              </ul>
            </li>
          </ol>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            5 Essential Pro Tips for Framing Wood Walls
          </h2>
          <ol style={{ paddingLeft: '20px', marginBottom: '32px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Crown Every Stud Before Nailing:</strong> Natural lumber boards are rarely perfectly straight; they have a slight edge bow called a &quot;crown&quot;. Lay each stud on edge, sight down the length, and mark an arrow pointing toward the crown. When framing walls, always install all studs with their crowns facing the same direction (facing outside or facing up) to ensure your drywall hangs on a uniformly flat plane without alternating ripples.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Use Pressure-Treated Wood on Concrete Floors:</strong> Building codes strictly prohibit untreated wood from making direct contact with slab concrete because concrete wicks moisture from the earth. Always use ACQ or copper-azole pressure-treated lumber for your bottom sole plate, and use hot-dipped galvanized or ceramic-coated fasteners that resist corrosion from chemical wood treatments.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Lap Top Plates at Wall Intersections:</strong> When framing two walls that meet at a corner, extend the lower top plate to the wall edge, but leave the second upper top plate 3.5 inches short. The upper top plate of the adjoining wall overlaps across this gap, tying the two separate walls into an earthquake- and wind-resistant structural corner.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Layout Plates Together:</strong> Lay your bottom sole plate and top plate side-by-side on the floor and hook your tape measure from one end. Mark both plates simultaneously with a speed square at 15-1/4 inches, 31-1/4 inches, and every 16 inches thereafter. This guarantees perfect vertical plumb alignment when studs are raised.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Pre-Cut Window and Door Sills:</strong> Sloping window sills slightly outward (about 1/4 inch per foot) directs incidental rainwater away from interior framing, preventing hidden wall cavity dry rot.
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
              Related Framing &amp; Construction Calculators
            </h3>
            <p style={{ color: '#15803D', marginBottom: '12px' }}>
              Explore our complete suite of trade calculators to plan every phase of your residential or commercial build:
            </p>
            <ul style={{ paddingLeft: '20px', color: '#15803D', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
              <li><Link href="/rafter-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Rafter Calculator</Link></li>
              <li><Link href="/linear-foot-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Linear Foot Calculator</Link></li>
              <li><Link href="/square-footage-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Square Footage Calculator</Link></li>
              <li><Link href="/paint-cost-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Paint Cost Calculator</Link></li>
              <li><Link href="/cinder-block-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Cinder Block Calculator</Link></li>
              <li><Link href="/construction-estimate-template/" style={{ color: '#15803D', fontWeight: 600 }}>Estimate Template</Link></li>
            </ul>
          </div>
        </article>
      </main>
    </>
  );
}
