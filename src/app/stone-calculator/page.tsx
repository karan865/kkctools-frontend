import { Metadata } from 'next';
import Link from 'next/link';
import { StoneCalculator } from '@/components/tool/stone-calculator';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { SITE_NAME, SITE_URL } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: 'Stone Calculator — Crushed Rock, Gravel & Tons',
  description:
    'Free stone calculator to estimate cubic yards, tons, and 50 lb bags for river rock, crushed stone, landscape rock, and aggregate. Instant weight & cost math.',
  path: '/stone-calculator/',
});

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Stone Calculator',
    url: `${SITE_URL}/stone-calculator/`,
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
      'Calculate exact stone, gravel, and crushed rock tonnage, cubic yards, and bag requirements for landscaping and driveway projects.',
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
        name: 'Stone Calculator',
        item: `${SITE_URL}/stone-calculator/`,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How many cubic yards are in a ton of rock?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'On average, one US ton of crushed stone or gravel equals approximately 0.71 to 0.74 cubic yards (or roughly 1.35 to 1.4 tons per cubic yard). For lightweight volcanic lava rock, one ton equals approximately 1.6 cubic yards.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I calculate how much rock I need?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Multiply project length by width in feet to determine square footage, multiply by depth in feet (inches / 12) to get cubic feet, divide by 27 for cubic yards, and multiply cubic yards by your rock specific density (typically 1.35 to 1.4 tons per cubic yard). Finally, add 5% to 10% for ground settling.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many square feet does 1 ton of rock cover?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'At a standard depth of 2 inches, 1 ton of typical crushed gravel or river rock covers approximately 100 to 115 square feet. At a thicker 3-inch depth, 1 ton covers approximately 70 to 80 square feet. At a deep 4-inch driveway depth, 1 ton covers roughly 50 to 55 square feet.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many 50 lb bags of stone make a cubic yard?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'One cubic yard of typical landscape rock weighs roughly 2,700 pounds. Dividing 2,700 by 50 pounds yields 54 bags. Therefore, you need 54 standard 50-pound bags to equal one bulk cubic yard.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between #57 stone and river rock?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '#57 stone refers to crushed angular limestone or granite machine-sieved to approximately 1/2-inch to 1-inch sizes. Its sharp, jagged edges interlock tightly, making it the premier choice for driveways, shed bases, and drainage. River rock consists of naturally weathered, smooth, rounded pebbles harvested from river valleys, prized primarily for barefoot-friendly pathways and decorative flower bed landscaping.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I put landscape rock directly on dirt?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'While possible, it is strongly discouraged. Without a commercial-grade landscape underlayment fabric, stone quickly sinks into the soil after rainy weather, while weeds grow aggressively through the gaps. A breathable needle-punched landscape fabric prevents weed growth while allowing rain to filter down into the subsoil.',
        },
      },
    ],
  },
];

export default function StoneCalculatorPage() {
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
            <li style={{ color: '#0F172A', fontWeight: 500 }} aria-current="page">Stone Calculator</li>
          </ol>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Stone Calculator: Estimate Tons, Cubic Yards &amp; Bags of Rock
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
            Accurately estimate how much stone, river rock, gravel, and crushed aggregate you need for your project using our free <strong>stone calculator</strong> (also functioning as a <strong>rock calculator</strong>, <strong>landscape rock calculator</strong>, and <strong>aggregate calculator</strong>). Instantly converts dimensions to cubic feet, cubic yards, and <strong>stone calculator tons</strong>.
          </p>
        </header>

        {/* Interactive Tool */}
        <section aria-label="Stone and Rock Calculator Tool">
          <StoneCalculator />
        </section>

        {/* Ad Placeholder */}
        <AdSlot slotId="stone-calc-middle" />

        {/* Comprehensive SEO Editorial Content (2,200+ Words) */}
        <article style={{ marginTop: '48px', color: '#334155', lineHeight: 1.7, fontSize: '0.975rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            How to Calculate Stone and Rock Needed (Step-by-Step Formula)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Planning a brand-new gravel driveway, backyard flagstone patio base, French drain trench, or decorative river rock garden border? One of the most critical steps in any hardscaping or landscaping project is calculating the exact quantity of bulk aggregate to purchase. Our comprehensive <strong>stone calculator</strong> serves as a reliable <strong>rock calculator</strong>, <strong>river rock calculator</strong>, and <strong>crushed stone calculator</strong> to estimate bulk quarry loads without expensive guesswork.
          </p>
          <p style={{ marginBottom: '16px' }}>
            Whether you need a dedicated <strong>57 stone calculator</strong> for base trenches or wonder <strong>how many cubic yards in a ton of rock</strong> are delivered to your jobsite, quarries and commercial landscape supply yards quote and sell bulk aggregate by the ton rather than by the cubic foot. Calculating materials accurately requires translating three-dimensional volume into weight through these six contractor steps:
          </p>

          <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Measure Surface Dimensions in Feet:</strong> Measure the length and width of the coverage area in feet. Multiply them together to find surface area in square feet: Length × Width. For example, a landscape border measuring 30 feet long by 6 feet wide has a surface area of 180 sq ft. For irregular curved garden beds or multi-zone layouts, sum individual sections using our <Link href="/square-footage-calculator/" style={{ color: '#0284C7' }}>square footage calculator</Link>.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Determine Recommended Layer Depth in Inches:</strong> Convert your desired thickness from inches into feet by dividing by 12: Depth in Feet = Depth in Inches / 12. For example, a 3-inch layer of river rock equals 3 / 12 = 0.25 feet.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Calculate Cubic Feet and Cubic Yards:</strong> Multiply surface area by depth to find total cubic feet, then divide by 27 (since there are 27 cubic feet in one cubic yard). For 180 sq ft at 0.25 ft depth: 180 × 0.25 = 45 cubic feet. Then 45 / 27 = 1.67 cubic yards. For general volume conversions, use our companion <Link href="/cubic-yard-calculator/" style={{ color: '#0284C7' }}>cubic yard calculator</Link>.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Multiply by Material Density (Pounds per Cubic Foot):</strong> Every rock variety possesses a distinct bulk density based on mineral composition, aggregate sizing, and void ratios. Dense crushed limestone weighs approximately 95 lbs per cubic foot, while smooth rounded river rock averages 100 lbs per cubic foot. 45 cu ft × 100 lbs/cu ft = 4,500 pounds.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Convert Pounds to US Short Tons:</strong> Because 1 US short ton equals 2,000 pounds, divide the total weight in pounds by 2,000: 4,500 / 2,000 = 2.25 tons. For fast bidirectional weight-volume math, check our <Link href="/tons-to-cubic-yards/" style={{ color: '#0284C7' }}>tons to cubic yards</Link> tool.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Factor in Compaction and Ground Settling (5% to 10%):</strong> Ground subgrades are never laser-flat. Natural subsoil settling, tire ruts, and trench compaction consume extra material. Always add 5% for flat flower beds or 10% for driveways and sloped pathways: 2.25 tons × 1.10 = 2.48 tons (order 2.5 tons from the quarry).
            </li>
          </ol>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Material Density &amp; Rock Weight Comparison Chart
          </h2>
          <p style={{ marginBottom: '16px' }}>
            The density of stone is governed by rock type, moisture content, and whether the stones are crushed (angular with interlocking faces) or river-washed (rounded with open voids). Use this contractor reference table:
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Material Type</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Sizing / Description</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Density (lbs / cu ft)</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Tons per Cubic Yard</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Coverage per Ton @ 2&quot;</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Common Applications</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>#57 Crushed Limestone</td>
                  <td style={{ padding: '10px 14px' }}>1/2&quot; to 1&quot; angular stone</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>95 lbs</td>
                  <td style={{ padding: '10px 14px' }}>1.28 tons</td>
                  <td style={{ padding: '10px 14px' }}>~120 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>Driveway base, French drains, concrete aggregate</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>River Rock (Smooth)</td>
                  <td style={{ padding: '10px 14px' }}>1&quot; to 3&quot; rounded cobble</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>100 lbs</td>
                  <td style={{ padding: '10px 14px' }}>1.35 tons</td>
                  <td style={{ padding: '10px 14px' }}>~110 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>Decorative landscape beds, dry riverbeds</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Pea Rock / Pea Gravel</td>
                  <td style={{ padding: '10px 14px' }}>3/8&quot; smooth round pebbles</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>105 lbs</td>
                  <td style={{ padding: '10px 14px' }}>1.42 tons</td>
                  <td style={{ padding: '10px 14px' }}>~100 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>Walkways, patios, dog runs, playgrounds</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Crushed Granite / Trap Rock</td>
                  <td style={{ padding: '10px 14px' }}>3/4&quot; angular durable rock</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>105 lbs</td>
                  <td style={{ padding: '10px 14px' }}>1.42 tons</td>
                  <td style={{ padding: '10px 14px' }}>~100 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>Heavy-duty driveways, commercial foundations</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Decomposed Granite (DG)</td>
                  <td style={{ padding: '10px 14px' }}>Fine granite with natural fines</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>110 lbs</td>
                  <td style={{ padding: '10px 14px' }}>1.48 tons</td>
                  <td style={{ padding: '10px 14px' }}>~95 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>Pathways, bocce ball courts, xeriscaping</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Heavy Rip Rap</td>
                  <td style={{ padding: '10px 14px' }}>4&quot; to 8&quot;+ massive stone</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>115 lbs</td>
                  <td style={{ padding: '10px 14px' }}>1.55 tons</td>
                  <td style={{ padding: '10px 14px' }}>~80 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>Shoreline erosion control, culverts, steep slopes</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Volcanic Lava Rock</td>
                  <td style={{ padding: '10px 14px' }}>Porous, lightweight pumice</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>45 lbs</td>
                  <td style={{ padding: '10px 14px' }}>0.61 tons</td>
                  <td style={{ padding: '10px 14px' }}>~220 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>Lightweight planter mulch, gas fire pits</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Landscape Rock Calculator: How Deep Should Your Stone Be?
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Selecting the correct depth ensures complete weed suppression without wasting money on buried, unseen rock:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Decorative River Rock Beds (3&quot; to 4&quot; Depth):</strong> When replacing wood mulch with 1- to 3-inch river cobble, a shallow 2-inch layer leaves visible gaps where underlying landscape fabric peeks through. A generous 3- to 4-inch layer guarantees dense, overlapping coverage that completely hides the ground and blocks sunlight from germinating weed seeds.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Pea Gravel Walkways and Patios (2&quot; to 2.5&quot; Depth):</strong> Pea gravel is naturally round and tends to shift underfoot like dry beach sand. If installed deeper than 2.5 inches, pedestrians will experience excessive foot sinkage, making walking difficult and pushing strollers or wheelbarrows impossible.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Crushed Stone Driveways (#57 Stone: 4&quot; Depth):</strong> Residential driveways require angular crushed stone (#57 limestone or crushed granite) that mechanically locks together under vehicle tires. Install a minimum 4-inch layer over a stable road base to distribute tire weight and prevent mud churning.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>French Drains and Drainage Swales (6&quot; to 12&quot; Depth):</strong> Washed river rock or clean #57 stone without fines provides a 40% void ratio, allowing ground water to rush rapidly into perforated drainage pipes wrapped inside geotextile fabric.
            </li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Buying Bulk Stone by the Ton vs. 50 lb Retail Bags
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Understanding when to purchase bagged rock at home improvement stores versus ordering bulk dump truck delivery saves significant money:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>When to Buy 50 lb Bags</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '8px' }}>
                Ideal when your requirement is under 1,500 lbs (less than 30 bags), when your project site has restricted access where a 10-wheel dump truck cannot enter without cracking sidewalks or lawns, or when you are completing work solo over multiple weekends.
              </p>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>When to Order Bulk Delivery</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '8px' }}>
                Essential for projects exceeding 1 ton (40 bags or ~0.75 cu yds). Bagged rock at retail stores costs $4.00–$6.00 per bag ($160–$240/ton), while quarries sell bulk stone for $35–$75 per ton. On a 5-ton driveway, ordering bulk saves over $600!
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            5 Essential Pro Tips for Laying Landscape Stone
          </h2>
          <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Always Lay Heavy Commercial Geotextile Fabric First:</strong> Never spread rock directly onto raw topsoil. Over time, heavy rocks sink into mud while earthworms bring dirt to the surface, creating a seedbed for weeds. Use heavy non-woven landscape fabric secured with steel landscape staples.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Install Rigid Edging Borders:</strong> Round river rock and pea gravel migrate into adjacent grass lawns during heavy rainstorms or leaf blowing. Install commercial metal, poly, or concrete paver edging standing 1/2 inch above the finished rock line.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Wash the Stone After Installation:</strong> Bulk rock delivered directly from quarries contains stone dust from crushing and screening. Hose down your newly spread rock bed thoroughly with a garden hose nozzle to reveal vibrant natural mineral colors.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Use Plywood to Protect Driveways:</strong> When having 5 to 10 tons of rock delivered, ask the dump truck driver to dump the load on heavy sheets of 3/4-inch plywood laid over your concrete or asphalt driveway to avoid surface gouges.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Account for Slope Runoff:</strong> On steep slopes exceeding 15 degrees, avoid small pea gravel or rounded river rock, which will wash downhill during torrential downpours. Use jagged, angular crushed rock (#57 or rip rap) that interlocks.
            </li>
          </ol>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                How many cubic yards are in a ton of rock?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                On average, one US ton of standard crushed stone or river rock equals approximately 0.71 to 0.74 cubic yards. Conversely, one cubic yard of crushed stone weighs approximately 1.35 to 1.40 tons (2,700 to 2,800 pounds). For ultra-lightweight volcanic lava rock, one ton yields approximately 1.64 cubic yards.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                How do I calculate how much rock I need?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                Multiply project length by width in feet to determine square footage, multiply by depth in feet (inches / 12) to get cubic feet, divide by 27 for cubic yards, and multiply cubic yards by your rock&apos;s specific density (typically 1.35 to 1.4 tons per cubic yard). Finally, add 5% to 10% for ground settling.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                How many square feet does 1 ton of rock cover?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                At a standard depth of 2 inches, 1 ton of typical crushed gravel or river rock covers approximately 100 to 115 square feet. At a thicker 3-inch depth, 1 ton covers approximately 70 to 80 square feet. At a 4-inch driveway base depth, 1 ton covers roughly 50 to 55 square feet.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                How many 50 lb bags of stone make a cubic yard?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                One cubic yard of typical landscape rock weighs roughly 2,700 pounds. Dividing 2,700 by 50 pounds yields 54 bags. Therefore, you need 54 standard 50-pound bags to equal one bulk cubic yard.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                What is the difference between #57 stone and river rock?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                #57 stone refers to crushed angular limestone or granite machine-sieved to approximately 1/2-inch to 1-inch sizes. Its sharp, jagged edges interlock tightly, making it the premier choice for driveways, shed bases, and drainage. River rock consists of naturally weathered, smooth, rounded pebbles harvested from river valleys, prized primarily for barefoot-friendly pathways and decorative flower bed landscaping.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                Can I put landscape rock directly on dirt?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                While possible, it is strongly discouraged. Without a commercial-grade landscape underlayment fabric, stone quickly sinks into the soil after rainy weather, while weeds grow aggressively through the gaps. A breathable needle-punched landscape fabric prevents weed growth while allowing rain to filter down into the subsoil.
              </p>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
