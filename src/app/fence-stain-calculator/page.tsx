import type { Metadata } from 'next';
import Link from 'next/link';
import FenceStainCalculator from '@/components/tool/fence-stain-calculator';
import AdSlot from '@/components/ads/AdSlot';
import { SITE_NAME, SITE_URL } from '@/config/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Fence Stain Calculator — Gallons & Picket Coverage',
  description:
    'Free fence stain calculator to estimate gallons of stain needed for wood privacy fences, board-on-board, shadowbox, and split rail with coat & porosity math.',
  alternates: {
    canonical: `${SITE_URL}/fence-stain-calculator/`,
  },
  openGraph: {
    title: 'Fence Stain Calculator — Gallons & Picket Coverage',
    description:
      'Calculate exact exterior wood stain gallons, 5-gallon pails, 1-gallon cans, and total costs for cedar, pine, and redwood fences.',
    url: `${SITE_URL}/fence-stain-calculator/`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Fence Stain Calculator',
    url: `${SITE_URL}/fence-stain-calculator/`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
    description:
      'Interactive fence stain calculator to estimate gallons of exterior stain and sealer for wooden fences based on linear footage, height, picket style, and wood porosity.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How many gallons of stain do I need for a 150-foot fence?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A standard 6-foot-tall, 150-foot wooden privacy fence has 900 sq ft per side (1,800 sq ft total for both sides). On rough-sawn cedar absorbing stain at 175 sq ft per gallon, one coat on both sides requires approximately 10 to 11 gallons. For two coats with a 10% buffer, order approximately 20 gallons (or four 5-gallon contractor pails).',
        },
      },
      {
        '@type': 'Question',
        name: 'How many square feet does 1 gallon of fence stain cover?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'On smooth, previously sealed wood, 1 gallon covers approximately 200 to 250 square feet. On rough-sawn, unsealed cedar or aged weathered pine, coverage drops to 150 to 175 square feet per gallon due to heavy wood grain absorption.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does a board-on-board fence take more stain?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. A board-on-board fence features overlapping vertical pickets, creating approximately 30% more surface area and edge exposure than a flat privacy fence. Always multiply flat fence square footage by 1.30 when estimating stain for board-on-board designs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should I apply one coat or two coats of stain?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For semi-transparent or transparent penetrating oil stains on new or bare wood, 2 coats provide maximum UV protection and weatherproofing. For solid color acrylic stains or routine maintenance refreshing, 1 uniform coat is usually sufficient.',
        },
      },
      {
        '@type': 'Question',
        name: 'How often should a wood fence be stained?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A wooden fence should typically be restained every 3 to 5 years when using a quality semi-transparent penetrating oil stain, or every 1 to 2 years for clear sealers. Solid color acrylic stains can last 5 to 7 years before requiring maintenance.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I spray fence stain with a pump garden sprayer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, but only if you use a thin, penetrating oil-based stain (such as Ready Seal or TWP). Thick water-based acrylic stains will clog the small plastic nozzle of a pump sprayer. For thick stains, use an airless paint sprayer (such as a Graco Magnum X5) or a 3/4-inch nap paint roller with back-brushing.',
        },
      },
    ],
  },
];

export default function FenceStainCalculatorPage() {
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
            <li style={{ color: '#0F172A', fontWeight: 500 }} aria-current="page">Fence Stain Calculator</li>
          </ol>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Fence Stain Calculator: Estimate Gallons, Coverage &amp; Costs
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
            Accurately plan your outdoor staining project using our free <strong>fence stain calculator</strong> (also functioning as an interactive <strong>wood fence stain calculator</strong> and <strong>deck stain calculator</strong>). Figure out exactly <strong>how much stain for a fence</strong> you need, calculate required <strong>gallons of stain for fence</strong> runs, and compare 5-gallon contractor pails vs. 1-gallon cans.
          </p>
        </header>

        {/* Interactive Tool */}
        <section aria-label="Fence Stain Calculator Tool">
          <FenceStainCalculator />
        </section>

        {/* Ad Placeholder */}
        <AdSlot slotId="fence-stain-middle" />

        {/* Comprehensive SEO Editorial Content (2,200+ Words) */}
        <article style={{ marginTop: '48px', color: '#334155', lineHeight: 1.7, fontSize: '0.975rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            Protecting Outdoor Wood: Why Staining Calculations Matter
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Applying a protective coat of premium exterior wood stain to your fence is one of the most cost-effective home improvement projects you can complete. Quality wood stain penetrates deep into the cellular structure of cedar, redwood, pine, and pressure-treated lumber, providing essential water-repellent protection against wood rot, mildew, splitting, and grey ultraviolet sun fading while highlighting the gorgeous natural grain of the wood.
          </p>
          <p style={{ marginBottom: '16px' }}>
            However, accurately calculating how many gallons of fence stain to buy is notoriously frustrating. Unlike flat interior drywall, outdoor wooden fences have two broad sides, vertical fence posts, horizontal structural stringers, and rough-sawn wood fibers that drink liquid stain like a sponge. Furthermore, overlapping architectural styles like board-on-board or shadowbox contain substantially more surface area than a flat board.
          </p>
          <p style={{ marginBottom: '24px' }}>
            Our specialized <strong>stain calculator for fence</strong> projects removes the guesswork by factoring in linear footage, height, picket designs, wood porosity, and second-coat absorption rates. For measuring fence run perimeters, use our <Link href="/linear-foot-calculator/" style={{ color: '#0284C7' }}>linear foot calculator</Link>, or check interior painting estimates with our <Link href="/paint-cost-calculator/" style={{ color: '#0284C7' }}>paint cost calculator</Link>.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            How Much Stain for a Fence? (Coverage &amp; Gallons Formula)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            To accurately calculate <strong>how much stain for a fence</strong> before driving to the home improvement center:
          </p>

          <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Measure Total Linear Footage:</strong> Measure the total running length of the fence in feet: Total Linear Feet = Perimeter Run (ft). For example, a standard suburban backyard fence measuring 150 linear feet.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Multiply by Fence Height to Get Single-Side Area:</strong> Multiply the length by the fence height in feet: Single-Side Area = Linear Feet × Height (ft). For a 6-foot-tall fence: 150 ft × 6 ft = 900 square feet.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Multiply by 2 for Both Sides:</strong> Unless your fence directly borders a neighbor property line that you cannot legally or physically access, you will need to stain both the interior and exterior faces: Both-Sides Area = 900 sq ft × 2 = 1,800 square feet.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Apply Your Fence Picket Style Multiplier:</strong> Different fencing styles possess varying amounts of exposed board edges and overlaps:
              <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                <li>Standard Flat Privacy: Multiply by 1.0× (1,800 sq ft).</li>
                <li>Board-on-Board (Overlapping): Multiply by 1.30× (1,800 × 1.30 = 2,340 sq ft).</li>
                <li>Shadowbox (Alternating Pickets): Multiply by 1.25× (1,800 × 1.25 = 2,250 sq ft).</li>
                <li>Split Rail (3-Rail): Multiply by 0.40× (1,800 × 0.40 = 720 sq ft).</li>
              </ul>
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Factor in Wood Porosity and Grain Absorption:</strong>
              <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                <li>Rough-Sawn Cedar or Unfinished Pine: Absorbs stain heavily, yielding roughly 175 sq ft per gallon.</li>
                <li>Aged, Dry, Weathered Wood: Highly porous, yielding roughly 150 sq ft per gallon.</li>
                <li>Smooth Planed or Previously Sealed Wood: Yields 200 to 250 sq ft per gallon.</li>
              </ul>
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Calculate First Coat and Second Coat Gallons:</strong>
              <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                <li>First Coat: Divide total effective area by wood absorption rate (1,800 / 175 = 10.3 gallons).</li>
                <li>Second Coat: The second coat absorbs less liquid because the wood pores are partially sealed. Increase coverage by 30% (1,800 / (175 × 1.30) = 7.9 gallons).</li>
                <li>Total Gallons (2 Coats): 10.3 + 7.9 = 18.2 gallons.</li>
              </ul>
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Add 10% to 15% for Sprayer Overspray and Drips:</strong> If applying with an airless paint sprayer on an outdoor windy day, up to 15% of the stain can be lost to airborne overspray. When using brushes and rollers, add 10%: Total Gallons to Order = 18.2 × 1.10 = <strong>20.0 Gallons</strong>.
            </li>
          </ol>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Fence Picket Styles &amp; Surface Area Multiplier Chart
          </h2>
          <p style={{ marginBottom: '16px' }}>
            The way your fence pickets are constructed dramatically affects total stain consumption:
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Fence Style</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Description</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Surface Multiplier</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Why It Takes More Stain</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Standard Solid Privacy</td>
                  <td style={{ padding: '10px 14px' }}>Pickets abut edge-to-edge on one side of horizontal 2x4 rails</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>1.0×</td>
                  <td style={{ padding: '10px 14px' }}>Baseline standard; flat continuous face.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Board-on-Board</td>
                  <td style={{ padding: '10px 14px' }}>Vertical pickets overlap by 1 to 1.5 inches to eliminate shrinkage gaps</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>1.30×</td>
                  <td style={{ padding: '10px 14px' }}>30% extra surface area due to overlapping hidden board faces and exposed edges.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Shadowbox (Good Neighbor)</td>
                  <td style={{ padding: '10px 14px' }}>Pickets alternate on opposite sides of 2x4 rails for privacy from both sides</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>1.25×</td>
                  <td style={{ padding: '10px 14px' }}>25% extra surface area due to fully exposed picket side edges and internal voids.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Spaced Picket (Dog Ear)</td>
                  <td style={{ padding: '10px 14px' }}>2&quot; to 3&quot; gaps between pickets (classic front-yard picket fence)</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>0.80×</td>
                  <td style={{ padding: '10px 14px' }}>Reduced surface area due to air gaps, but requires painting 4 vertical edges per picket.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Post and Split Rail</td>
                  <td style={{ padding: '10px 14px' }}>2 or 3 horizontal rough-hewn cedar or pine rails anchored to heavy posts</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>0.40×</td>
                  <td style={{ padding: '10px 14px' }}>Far less wood surface area, but highly porous rough-sawn grain absorbs heavily.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Choosing the Right Stain: Transparent vs. Semi-Transparent vs. Solid
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Selecting the proper stain formulation impacts durability, aesthetic appearance, and recoat frequency:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>Clear / Transparent Water Repellents (1 to 2 Year Life):</strong> Contains minimal pigment. Highlights 100% of the natural wood grain and knots. Provides minimal UV sun protection. Best for high-end Western Red Cedar or Redwood that you are willing to re-seal every 12 to 18 months.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Semi-Transparent Penetrating Oil Stains (3 to 5 Year Life) — THE BEST ALL-AROUND CHOICE:</strong> Contains finely ground iron oxide pigments that tint the wood while letting natural grain patterns show through. Soaks deep into wood pores without forming a surface film. Never peels, chips, or blisters; to re-apply in 4 years, simply clean the fence and spray a fresh coat directly over top.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Solid Color Acrylic Stains (5 to 7 Year Life):</strong> Looks like flat exterior house paint, completely masking the wood grain while showing texture. Provides maximum UV and moisture defense. Best for older, discolored, or mismatched weathered fences.
            </li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Buying 5-Gallon Pails vs. 1-Gallon Cans
          </h2>
          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Package Size</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Typical Retail Cost</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Cost per Gallon</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Total Project Cost (20 Gallons)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>1-Gallon Cans</td>
                  <td style={{ padding: '10px 14px' }}>$40.00 to $55.00 per can</td>
                  <td style={{ padding: '10px 14px' }}>$45.00 / gal</td>
                  <td style={{ padding: '10px 14px' }}>$900.00</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>5-Gallon Contractor Pails</td>
                  <td style={{ padding: '10px 14px' }}>$160.00 to $210.00 per pail</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#166534' }}>$36.00 / gal</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#166534' }}>$720.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            5 Essential Pro Tips for Staining a Wood Fence
          </h2>
          <ol style={{ paddingLeft: '20px', marginBottom: '32px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Test Wood Moisture Before Staining (The Water Drop Test):</strong> Never stain new pressure-treated lumber immediately after installation. Pressure-treated wood is injected with liquid preservatives and takes 2 to 4 months of warm, dry weather to dry out. Splash water droplets onto the wood: if the water beads up into droplets, the wood is too wet to absorb stain; if the water immediately absorbs into the wood, it is ready to stain.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Wash the Fence Before Staining:</strong> Gray weathered wood is coated in oxidized, dead wood cellulose fibers. Spray the fence with an oxygenated wood bleach or exterior wood cleaner, let it sit for 15 minutes, and gently pressure wash at low pressure (under 1,500 PSI) with a wide 40-degree green nozzle tip. Let the fence dry for at least 48 hours before applying oil stain.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Always Back-Brush When Spraying:</strong> While using an airless paint sprayer speeds up application significantly, never just spray and walk away. Have a partner follow immediately behind the sprayer with a 4-inch wide synthetic bristle stain brush to back-brush the wet stain deep into the wood pores, vertical picket seams, and nail holes.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Stain Vertically from Top to Bottom:</strong> Always work along 2 to 3 pickets at a time from the top of the fence down to the bottom. Never stop midway down a picket to take a break; always stain pickets to completion to maintain a &quot;wet edge&quot; and prevent dark overlapping lap marks.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Protect Grass and Concrete Borders:</strong> Penetrating oil stain will permanently discolor concrete walkways and kill lawn grass. Lay heavy canvas drop cloths or sheets of cardboard along the base of the fence line, and wet down adjacent shrubs with water from a garden hose before spraying so any stray droplets rinse off easily.
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
              Related Painting &amp; Carpentry Calculators
            </h3>
            <p style={{ color: '#15803D', marginBottom: '12px' }}>
              Plan your outdoor construction and coating projects with our companion suite:
            </p>
            <ul style={{ paddingLeft: '20px', color: '#15803D', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
              <li><Link href="/paint-cost-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Paint Cost Calculator</Link></li>
              <li><Link href="/linear-foot-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Linear Foot Calculator</Link></li>
              <li><Link href="/stud-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Stud &amp; Framing Calculator</Link></li>
              <li><Link href="/square-footage-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Square Footage Calculator</Link></li>
              <li><Link href="/rafter-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Rafter Calculator</Link></li>
              <li><Link href="/construction-estimate-template/" style={{ color: '#15803D', fontWeight: 600 }}>Estimate Template</Link></li>
            </ul>
          </div>
        </article>
      </main>
    </>
  );
}

