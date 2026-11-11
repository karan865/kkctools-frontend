import type { Metadata } from 'next';
import Link from 'next/link';
import CompostCalculator from '@/components/tool/compost-calculator';
import AdSlot from '@/components/ads/AdSlot';
import { SITE_NAME, SITE_URL } from '@/config/site';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Compost Calculator — Garden Beds, Lawns & Bags',
  description:
    'Free compost calculator to estimate cubic yards, cubic feet, and bags of organic compost needed for raised garden beds, lawns, and soil amending.',
  alternates: {
    canonical: `${SITE_URL}/compost-calculator/`,
  },
  openGraph: {
    title: 'Compost Calculator — Garden Beds, Lawns & Bags',
    description:
      'Calculate exact compost volume, bulk cubic yards, and 1 cu ft or 2 cu ft bag counts for vegetable gardens, Mel\'s Mix raised beds, and lawn top-dressing.',
    url: `${SITE_URL}/compost-calculator/`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Compost Calculator',
    url: `${SITE_URL}/compost-calculator/`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
    description:
      'Interactive compost calculator to calculate cubic feet, bulk cubic yards, and retail bag counts for raised garden beds, lawn top-dressing, and soil amending.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much compost do I need for my garden bed?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For existing vegetable and flower garden beds, spread a 1- to 2-inch layer of rich compost across the surface and fork it into the top 6 inches of soil. For a 100 square foot bed, a 2-inch layer requires approximately 16.7 cubic feet (or roughly 0.62 cubic yards) of compost.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many bags of compost equal one cubic yard?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'One cubic yard contains 27 cubic feet. If buying standard 1 cubic foot bags, you need 27 bags. If buying larger 2 cubic foot nursery bags, you need 14 bags to equal one cubic yard.',
        },
      },
      {
        '@type': 'Question',
        name: 'How deep should compost be for lawn top-dressing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'When top-dressing existing grass or after core aeration, apply a thin layer of strictly 1/4-inch to 1/2-inch of finely screened compost. Applying deeper than 1/2 inch can suffocate the grass blades, block sunlight, and promote fungal lawn diseases.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does a cubic yard of compost weigh?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A cubic yard of typical finished organic compost weighs between 1,200 and 1,600 pounds (0.60 to 0.80 US short tons), depending on moisture level. Extremely dry compost weighs around 1,000 lbs per yard, while saturated wet compost can exceed 1,800 lbs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I plant directly in 100% pure compost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'While seeds will sprout in pure compost, plants perform best in a blended soil mix. Pure compost can hold excessive moisture, dry out too quickly when exposed to direct wind, and lacks the structural mineral anchor particles found in silt and loam. For raised beds, use 33% compost mixed with peat moss and vermiculite.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between compost and topsoil?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Topsoil is the uppermost natural mineral layer of the earth (consisting of sand, silt, and clay particles) containing small amounts of organic matter. Compost is 100% decomposed organic matter (plant matter, aged manure, vegetable scraps) packed with beneficial microbial life and plant nutrients, used primarily as an amendment rather than structural soil.',
        },
      },
    ],
  },
];

export default function CompostCalculatorPage() {
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
            <li style={{ color: '#0F172A', fontWeight: 500 }} aria-current="page">Compost Calculator</li>
          </ol>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Compost Calculator: Estimate Cubic Yards &amp; Bags for Garden Beds &amp; Lawns
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
            Accurately calculate your organic soil amendments using our free <strong>compost calculator</strong> (also functioning as an interactive <strong>compost volume calculator</strong>, <strong>garden compost calculator</strong>, and <strong>raised bed compost calculator</strong>). Instantly compute <strong>cubic yards of compost</strong> alongside retail packaging using our built-in <strong>compost bags calculator</strong>.
          </p>
        </header>

        {/* Interactive Tool */}
        <section aria-label="Compost and Soil Amendment Calculator Tool">
          <CompostCalculator />
        </section>

        {/* Ad Placeholder */}
        <AdSlot slotId="compost-calc-middle" />

        {/* Comprehensive SEO Editorial Content (2,200+ Words) */}
        <article style={{ marginTop: '48px', color: '#334155', lineHeight: 1.7, fontSize: '0.975rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            How Much Compost Do I Need for Garden Beds &amp; Lawns?
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Rich, dark, well-rotted organic compost is frequently described by master horticulturists and organic farmers as &quot;black gold&quot;. Whether you are preparing a spring vegetable patch, building elevated cedar raised garden beds, establishing fruit tree orchards, or top-dressing your residential turfgrass after core aeration, applying the right amount of organic matter is the secret to thriving plants.
          </p>
          <p style={{ marginBottom: '16px' }}>
            When wondering <strong>how much compost do i need</strong>, estimating the exact volume to purchase is notoriously difficult. Buying too few bags starves seedlings of beneficial mycorrhizal microbes, humic acids, and moisture retention. Purchasing excessive bulk cubic yards leaves you with an overwhelming mountain of black compost rotting on your driveway or lawn. Our interactive <strong>compost calculator</strong> provides exact measurements in cubic feet, cubic yards, and commercial retail bag counts. For structural excavation dirt, visit our <Link href="/fill-dirt-calculator/" style={{ color: '#0284C7' }}>fill dirt calculator</Link>, or check bulk volume conversions on our <Link href="/cubic-yard-calculator/" style={{ color: '#0284C7' }}>cubic yard calculator</Link>.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            How to Calculate Compost Needed (Step-by-Step Volume Formula)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            To accurately determine the cubic yards or retail bags of compost needed for your garden or lawn, follow these 4 steps:
          </p>

          <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Measure Your Garden Bed or Lawn Dimensions:</strong> Measure the length and width of your planting space in feet: Surface Area = Length (ft) × Width (ft). If you have multiple raised beds of the exact same size, multiply by the number of beds: Total Area = (Length × Width) × Bed Count. For example, three 8 ft × 4 ft raised garden beds have a total surface area of (8 × 4) × 3 = 96 square feet.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Choose the Recommended Depth in Inches:</strong> Convert your desired application depth into feet by dividing by 12: Depth in Feet = Depth in Inches / 12. A standard 2-inch soil amendment layer equals 2 / 12 = 0.1667 feet.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Compute Total Cubic Feet:</strong> Multiply your total surface square footage by depth in feet: Cubic Feet = 96 sq ft × 0.1667 ft = <strong>16.0 Cubic Feet</strong>.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Convert to Bulk Cubic Yards or Retail Bags:</strong>
              <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                <li>For Bulk Delivery: Divide cubic feet by 27 (16.0 / 27 = <strong>0.59 Cubic Yards</strong>).</li>
                <li>For 1.0 Cu Ft Retail Bags: Divide cubic feet by 1.0 (16.0 / 1.0 = <strong>16 Bags</strong>).</li>
                <li>For 2.0 Cu Ft Nursery Bags: Divide cubic feet by 2.0 (16.0 / 2.0 = <strong>8 Bags</strong>).</li>
              </ul>
            </li>
          </ol>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Compost Depth &amp; Application Rate Guide
          </h2>
          <p style={{ marginBottom: '16px' }}>
            The ideal depth of compost depends entirely on how you are applying it to your soil:
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Application Type</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Recommended Depth</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Cu Ft per 100 Sq Ft</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>1 Cu Ft Bags per 100 Sq Ft</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Application Method</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Lawn Top-Dressing</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>1/4&quot; to 1/2&quot;</td>
                  <td style={{ padding: '10px 14px' }}>2.1 to 4.2 cu ft</td>
                  <td style={{ padding: '10px 14px' }}>3 to 5 bags</td>
                  <td style={{ padding: '10px 14px' }}>Once annually in Spring or Fall after aerating; rake into turf.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Flower Bed Maintenance</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>1.0 Inch</td>
                  <td style={{ padding: '10px 14px' }}>8.3 cu ft</td>
                  <td style={{ padding: '10px 14px' }}>9 bags</td>
                  <td style={{ padding: '10px 14px' }}>Spread evenly around perennials; scratch into top 2 inches.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Annual Vegetable Bed Amending</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>2.0 Inches</td>
                  <td style={{ padding: '10px 14px' }}>16.7 cu ft</td>
                  <td style={{ padding: '10px 14px' }}>17 bags</td>
                  <td style={{ padding: '10px 14px' }}>Spread in early Spring; till or fork into upper 6 inches of soil.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Heavy Clay / Sand Soil Renovation</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>3.0 Inches</td>
                  <td style={{ padding: '10px 14px' }}>25.0 cu ft</td>
                  <td style={{ padding: '10px 14px' }}>25 bags</td>
                  <td style={{ padding: '10px 14px' }}>For poor native dirt; mix deeply to improve aeration and drainage.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>New Raised Garden Bed Fill</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284C7' }}>8.0&quot; to 12.0&quot;</td>
                  <td style={{ padding: '10px 14px' }}>66.7 to 100 cu ft</td>
                  <td style={{ padding: '10px 14px' }}>67 to 100 bags</td>
                  <td style={{ padding: '10px 14px' }}>Mix 1/3 compost with 1/3 peat moss and 1/3 vermiculite (Mel&apos;s Mix).</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Raised Bed Compost Calculator: The Famous Mel&apos;s Mix Formula
          </h2>
          <p style={{ marginBottom: '16px' }}>
            If you are filling newly constructed wooden, galvanized metal, or stone raised garden beds, you should never fill them with heavy native topsoil or pure dirt from your yard. Native soil compacts into dense, impenetrable mud inside container walls, suffocating tender vegetable roots.
          </p>
          <p style={{ marginBottom: '16px' }}>
            Instead, square foot gardeners and master growers universally rely on <strong>Mel&apos;s Mix</strong>, an ultra-light, highly fertile raised bed potting soil blend developed by Mel Bartholomew:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>1/3 Coarse Horticultural Vermiculite (33%):</strong> Retains moisture and plant nutrients while keeping soil light and aerated.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>1/3 Sphagnum Peat Moss or Coconut Coir (33%):</strong> Provides water-holding capacity and structural soil loft.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>1/3 Blended Organic Compost (33%):</strong> Supplies all the organic macro- and micro-nutrients, beneficial soil bacteria, and fungi required for plant life.
            </li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Buying Bagged Compost vs. Bulk Dump Truck Delivery
          </h2>
          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Metric</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Bagged Retail Compost (1.0 or 2.0 cu ft)</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Bulk Compost Delivery (Cubic Yards)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Typical Price</td>
                  <td style={{ padding: '10px 14px' }}>$4.50 to $7.50 per 1 cu ft bag ($120–$200/yd³)</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#166534' }}>$30 to $55 per cubic yard</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Packaging Quality</td>
                  <td style={{ padding: '10px 14px' }}>Sealed plastic, sterile, pre-screened</td>
                  <td style={{ padding: '10px 14px' }}>Loose dump pile; may contain occasional wood chunks</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Ease of Transport</td>
                  <td style={{ padding: '10px 14px' }}>Fits inside car trunks, SUVs, truck beds</td>
                  <td style={{ padding: '10px 14px' }}>Delivered via heavy dump truck to driveway</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Best Choice For</td>
                  <td style={{ padding: '10px 14px' }}>1 to 4 raised beds, under 20 cubic feet</td>
                  <td style={{ padding: '10px 14px' }}>Entire garden renovations, large lawns (&gt; 1 yard)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            5 Essential Pro Tips for Using Compost
          </h2>
          <ol style={{ paddingLeft: '20px', marginBottom: '32px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Use Multiple Compost Sources for Biodiversity:</strong> If buying bagged compost, don&apos;t buy all 10 bags from the same brand. Mix cow manure compost, mushroom compost, worm castings, and decayed forest humus. Different feedstocks provide different microbial colonies and trace minerals.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Never Apply Immature Compost:</strong> Finished compost smells sweet and earthy like a forest floor after rain, and possesses a uniform dark brown or black crumbly texture. If compost smells sour, like rotten eggs, or strongly of ammonia, it is still decomposing. Applying hot, unfinished compost will tie up nitrogen and burn delicate plant roots.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Never Exceed 1/2 Inch on Lawns:</strong> While established garden beds love thick 2- to 3-inch compost layers, lawns can be easily smothered. Keep lawn top-dressing between 1/4 inch and 1/2 inch, and immediately drag a backside garden rake or leaf broom across the lawn to knock compost off grass blades down into the soil crowns.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Till Into Native Soil Gradually:</strong> When amending clay soil, don&apos;t dig a deep hole and fill it with pure compost (known as the &quot;bathtub effect&quot;, which traps standing water). Always thoroughly blend your 2-inch compost layer with the upper 4 to 6 inches of native dirt using a garden fork or rototiller.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Top With Mulch:</strong> In hot summer climates, bare compost exposed to intense direct sunlight dries out and loses microbial viability. Always cover your amended garden beds with 2 inches of shredded hardwood bark, straw, or cedar shavings to conserve moisture.
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
              Related Soil &amp; Landscaping Calculators
            </h3>
            <p style={{ color: '#15803D', marginBottom: '12px' }}>
              Plan all your gardening, turf, and bulk landscaping materials with our specialized suite:
            </p>
            <ul style={{ paddingLeft: '20px', color: '#15803D', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
              <li><Link href="/fill-dirt-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Fill Dirt Calculator</Link></li>
              <li><Link href="/sand-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Sand Calculator</Link></li>
              <li><Link href="/cubic-yard-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Cubic Yard Calculator</Link></li>
              <li><Link href="/stone-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Stone &amp; Gravel Calculator</Link></li>
              <li><Link href="/tons-to-cubic-yards/" style={{ color: '#15803D', fontWeight: 600 }}>Tons to Cubic Yards</Link></li>
              <li><Link href="/square-footage-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Square Footage Calculator</Link></li>
            </ul>
          </div>
        </article>
      </main>
    </>
  );
}

