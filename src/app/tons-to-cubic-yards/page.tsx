import type { Metadata } from 'next';
import { buildMetadata } from '@/components/seo/buildMetadata';
import Link from 'next/link';
import TonsYardsConverter from '@/components/tool/tons-yards-converter';
import AdSlot from '@/components/ads/AdSlot';
import { SITE_NAME, SITE_URL } from '@/config/site';
import JsonLd from '@/components/seo/JsonLd';
import HowWeCalculate from '@/components/seo/HowWeCalculate';

export const dynamic = 'force-static';

export const metadata: Metadata = buildMetadata({
  title: 'Tons to Cubic Yards Converter by Material',
  description:
    'Free tons to cubic yards converter with real material densities for gravel, sand, topsoil, mulch and asphalt. Also converts cubic yards to tons.',
  path: '/tons-to-cubic-yards/',
});

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Tons to Cubic Yards Converter',
    url: `${SITE_URL}/tons-to-cubic-yards/`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
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
      'Interactive tons to cubic yards converter. Convert US short tons or metric tonnes to cubic yards, cubic feet, and cubic meters across 12 bulk material densities.',
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
        name: 'Tons to Cubic Yards Converter',
        item: `${SITE_URL}/tons-to-cubic-yards/`,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How many cubic yards in a ton?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The number of cubic yards in a ton depends directly on the material bulk density. For typical crushed stone or gravel (approx 1.40 tons/yd³), 1 ton equals 0.71 cubic yards. For screened topsoil (approx 1.10 tons/yd³), 1 ton equals 0.91 cubic yards. For lightweight hardwood mulch (approx 0.40 tons/yd³), 1 ton equals 2.50 cubic yards.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is a ton the same as a yard?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No: a ton is a unit of weight (2,000 pounds), while a cubic yard is a unit of volume (27 cubic feet). Converting between the two always requires knowing the specific density of the material you are buying.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many yards in a ton of gravel?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'One US short ton of typical crushed gravel or road base equals approximately 0.71 to 0.74 cubic yards. Conversely, one cubic yard of gravel weighs about 1.35 to 1.40 tons (2,700 to 2,800 pounds).',
        },
      },
      {
        '@type': 'Question',
        name: 'How many tons in a cubic yard of sand / topsoil / mulch?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'One cubic yard of dry concrete sand weighs approximately 1.35 tons (2,700 lb), wet packed sand weighs 1.60 tons (3,200 lb), screened topsoil weighs 1.10 tons (2,200 lb), and shredded hardwood mulch weighs approximately 0.40 tons (800 lb).',
        },
      },
      {
        '@type': 'Question',
        name: 'Do metric tonnes change the answer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes: one metric tonne equals 1,000 kilograms or 2,204.62 pounds, which is approximately 10.2% heavier than a standard US short ton (2,000 pounds). Our calculator features a dedicated metric unit toggle so you can convert directly from metric tonnes to cubic yards.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many square feet does 1 ton of gravel cover?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '1 ton of gravel covers about 231-240 sq ft at 1 inch, 116-120 sq ft at 2 inches, 77-80 sq ft at 3 inches, 58-60 sq ft at 4 inches and 39-40 sq ft at 6 inches (theoretical, from 1.40 to 1.35 tons/yd3). Add about 10% for compaction and waste. For an exact area x depth quantity use our stone calculator.',
        },
      },
    ],
  },
];

export default function TonsToCubicYardsPage() {
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
            <li style={{ color: '#0F172A', fontWeight: 500 }} aria-current="page">Tons to Cubic Yards</li>
          </ol>
        </nav>

        {/* Page Header */}
        <header style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
            Tons to Cubic Yards Converter
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
            Convert US short tons or metric tonnes into cubic yards, cubic feet, and cubic meters with our free <strong>tons to cubic yards</strong> converter (cubic yards to tons calculator included).
          </p>
        </header>

        {/* Interactive Tool */}
        <section aria-label="Tons to Cubic Yards Converter Tool">
          <TonsYardsConverter />
        </section>

        {/* Ad Placeholder */}
        <AdSlot slotId="tons-yards-calc-middle" />

        {/* Editorial SEO Content */}
        <article style={{ marginTop: '36px', color: '#334155', lineHeight: 1.7, fontSize: '0.975rem' }}>
          {/* Quick Answer Callout Box */}
          <div style={{ padding: '16px 20px', backgroundColor: '#F0F9FF', border: '1.5px solid #BAE6FD', borderRadius: '8px', marginBottom: '24px' }}>
            <p style={{ margin: 0, color: '#0369A1', fontSize: '0.975rem', lineHeight: 1.6 }}>
              <strong>How many yards in a ton of gravel?</strong> About 0.71 cubic yards (1 cubic yard of gravel is about 1.4 tons, or 2,800 lb). Sand, topsoil and mulch weigh differently, so pick your material above or in the reference charts below.
            </p>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '24px' }}>
            Last updated: November 2026 · Densities are typical loose (bulk) values; your supplier’s figure for their material always wins.
          </p>

          {/* Section 1: How Many Yards in a Ton of Gravel? */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              How Many Yards in a Ton of Gravel?
            </h2>
            <p style={{ marginBottom: '16px' }}>
              One US short ton of standard crushed gravel or road base equals approximately 0.71 cubic yards. For rounded river gravel or clean washed stone, one ton equals approximately 0.74 cubic yards. Conversely, one cubic yard of gravel weighs between 1.35 and 1.40 tons.
            </p>
            <p style={{ marginBottom: '16px' }}>
              Because quarries weigh delivery trucks on certified platform scales in tons, while landscaping areas are measured in cubic yards, this 0.71 multiplier is the industry benchmark for estimating driveway gravel and sub-base deliveries.
            </p>
          </section>

          {/* Section 2: How to Convert Tons to Cubic Yards */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              How to Convert Tons to Cubic Yards (Step-by-Step Formula)
            </h2>
            <p style={{ marginBottom: '16px' }}>
              The conversion of tons to cubic yards always needs one extra number, the material density. To convert weight to volume:
            </p>
            <ol style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li style={{ marginBottom: '10px' }}>
                <strong>Determine Weight in Pounds:</strong> If you have US short tons, multiply by 2,000 (Pounds = Tons × 2,000). For metric tonnes, multiply by 2,204.62.
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Find Material Density in Pounds per Cubic Yard:</strong> Every aggregate has a distinct bulk density rating. For example, crushed stone / road base (1.40 tons/yd³) weighs 2,800 lb per cubic yard.
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Divide Weight by Density:</strong> Volume (Cubic Yards) = Weight in Pounds ÷ Density in lb/yd³. Alternatively: Volume (Cubic Yards) = Tons ÷ Density in tons/yd³. For example, 14 tons of crushed stone / road base (1.40 tons/yd³): 14 ÷ 1.40 = 10.0 cy.
              </li>
            </ol>
          </section>

          {/* Section 3: Cubic Yards to Tons */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              Cubic Yards to Tons: How to Convert Volume to Weight
            </h2>
            <p style={{ marginBottom: '16px' }}>
              When you measure a garden bed or excavation trench, your dimensions yield cubic yards, but your supplier bills by the ton. When you convert CY to tons:
            </p>
            <p style={{ marginBottom: '16px', background: '#F8FAFC', padding: '14px 18px', borderRadius: '8px', border: '1px solid #E2E8F0', fontFamily: 'monospace' }}>
              Tons = Cubic Yards × Density (tons per cubic yard)
            </p>
            <p style={{ marginBottom: '16px' }}>
              For example, if you need 8.5 cubic yards of screened topsoil (density = 1.10 tons/yd³): 8.5 × 1.10 = 9.35 US short tons (18,700 pounds).
            </p>
          </section>

          {/* Section 4: Material Conversion Chart */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              How Many Cubic Yards in a Ton? Material Conversion Chart
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Use this comprehensive reference table for standard dry, loose bulk materials sold at quarries and landscape supply yards:
            </p>

            <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                    <th style={{ padding: '10px 14px', color: '#0F172A' }}>Material Name</th>
                    <th style={{ padding: '10px 14px', color: '#0F172A' }}>Tons per Cu Yd</th>
                    <th style={{ padding: '10px 14px', color: '#0F172A' }}>Cu Yds per Ton</th>
                    <th style={{ padding: '10px 14px', color: '#0F172A' }}>lb per Cu Yd</th>
                    <th style={{ padding: '10px 14px', color: '#0F172A' }}>lb per Cu Ft</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>Crushed Stone / Road Base</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>1.40 tons</td>
                    <td style={{ padding: '10px 14px' }}>0.71 yd³</td>
                    <td style={{ padding: '10px 14px' }}>2,800 lb</td>
                    <td style={{ padding: '10px 14px' }}>103.7 lb</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>River Rock / Washed Cobble</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>1.35 tons</td>
                    <td style={{ padding: '10px 14px' }}>0.74 yd³</td>
                    <td style={{ padding: '10px 14px' }}>2,700 lb</td>
                    <td style={{ padding: '10px 14px' }}>100.0 lb</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>Clean Crushed Limestone (#57)</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>1.35 tons</td>
                    <td style={{ padding: '10px 14px' }}>0.74 yd³</td>
                    <td style={{ padding: '10px 14px' }}>2,700 lb</td>
                    <td style={{ padding: '10px 14px' }}>100.0 lb</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>Pea Gravel</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>1.42 tons</td>
                    <td style={{ padding: '10px 14px' }}>0.70 yd³</td>
                    <td style={{ padding: '10px 14px' }}>2,840 lb</td>
                    <td style={{ padding: '10px 14px' }}>105.2 lb</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>Dry Concrete Sand</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>1.35 tons</td>
                    <td style={{ padding: '10px 14px' }}>0.74 yd³</td>
                    <td style={{ padding: '10px 14px' }}>2,700 lb</td>
                    <td style={{ padding: '10px 14px' }}>100.0 lb</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>Wet Packed Masonry Sand</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>1.60 tons</td>
                    <td style={{ padding: '10px 14px' }}>0.63 yd³</td>
                    <td style={{ padding: '10px 14px' }}>3,200 lb</td>
                    <td style={{ padding: '10px 14px' }}>118.5 lb</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>Screened Topsoil / Garden Loam</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>1.10 tons</td>
                    <td style={{ padding: '10px 14px' }}>0.91 yd³</td>
                    <td style={{ padding: '10px 14px' }}>2,200 lb</td>
                    <td style={{ padding: '10px 14px' }}>81.5 lb</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>Fill Dirt (delivered, loose)</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>1.25 tons</td>
                    <td style={{ padding: '10px 14px' }}>0.80 yd³</td>
                    <td style={{ padding: '10px 14px' }}>2,500 lb</td>
                    <td style={{ padding: '10px 14px' }}>92.6 lb</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>Hot Mix Asphalt</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>2.025 tons</td>
                    <td style={{ padding: '10px 14px' }}>0.49 yd³</td>
                    <td style={{ padding: '10px 14px' }}>4,050 lb</td>
                    <td style={{ padding: '10px 14px' }}>150.0 lb</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>Poured Cured Concrete</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>2.02 tons</td>
                    <td style={{ padding: '10px 14px' }}>0.50 yd³</td>
                    <td style={{ padding: '10px 14px' }}>4,040 lb</td>
                    <td style={{ padding: '10px 14px' }}>149.6 lb</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>Dark Aged Organic Compost</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>0.65 tons</td>
                    <td style={{ padding: '10px 14px' }}>1.54 yd³</td>
                    <td style={{ padding: '10px 14px' }}>1,300 lb</td>
                    <td style={{ padding: '10px 14px' }}>48.1 lb</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>Hardwood Shredded Bark Mulch</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>0.40 tons</td>
                    <td style={{ padding: '10px 14px' }}>2.50 yd³</td>
                    <td style={{ padding: '10px 14px' }}>800 lb</td>
                    <td style={{ padding: '10px 14px' }}>29.6 lb</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
              How many yards in a ton of sand?
            </h3>
            <p style={{ marginBottom: '16px' }}>
              One ton of dry concrete sand yields approximately 0.74 cubic yards. For wet packed sand, one ton yields approximately 0.63 cubic yards.
            </p>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
              How many yards in a ton of topsoil?
            </h3>
            <p style={{ marginBottom: '16px' }}>
              One ton of screened topsoil yields approximately 0.91 cubic yards (about 2,200 lb per cubic yard).
            </p>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
              How many yards in a ton of mulch?
            </h3>
            <p style={{ marginBottom: '16px' }}>
              One ton of shredded hardwood bark mulch yields approximately 2.50 cubic yards because dried organic mulch is lightweight (roughly 800 lb per cubic yard).
            </p>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
              How many yards in a ton of asphalt?
            </h3>
            <p style={{ marginBottom: '16px' }}>
              One ton of hot mix asphalt yields approximately 0.49 cubic yards due to its high compacted density (4,050 lb per cubic yard).
            </p>
          </section>

          {/* Section 5: How Many Tons in a Yard? */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              How Many Tons in a Yard?
            </h2>
            <p style={{ marginBottom: '16px' }}>
              When ordering by the cubic yard, here is the quick weight reference for common landscape and building materials:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '6px' }}><strong>Gravel / Crushed Stone:</strong> 1.40 tons per cubic yard (2,800 lb)</li>
              <li style={{ marginBottom: '6px' }}><strong>Dry Sand:</strong> 1.35 tons per cubic yard (2,700 lb)</li>
              <li style={{ marginBottom: '6px' }}><strong>Screened Topsoil:</strong> 1.10 tons per cubic yard (2,200 lb)</li>
              <li style={{ marginBottom: '6px' }}><strong>Fill Dirt (delivered, loose):</strong> 1.25 tons per cubic yard (2,500 lb). Compacted fill is denser, so you need more tons for the same finished volume.</li>
              <li style={{ marginBottom: '6px' }}><strong>Bark Mulch:</strong> 0.40 tons per cubic yard (800 lb)</li>
              <li style={{ marginBottom: '6px' }}><strong>Hot Mix Asphalt:</strong> 2.025 tons per cubic yard (4,050 lb)</li>
            </ul>
          </section>

          {/* Section 6: Tons to Cubic Yards Chart for Gravel */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              Tons to Cubic Yards Chart for Gravel
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Quick reference conversions comparing standard crushed stone (1.40 tons/yd³) with rounded river rock (1.35 tons/yd³):
            </p>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginBottom: '10px' }}>
              Tons to Cubic Yards (1.40 vs 1.35 tons/yd³)
            </h3>
            <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                    <th style={{ padding: '8px 12px' }}>Tons</th>
                    <th style={{ padding: '8px 12px' }}>Crushed Stone (1.40)</th>
                    <th style={{ padding: '8px 12px' }}>River Rock (1.35)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: '8px 12px', fontWeight: 600 }}>1 ton</td><td style={{ padding: '8px 12px' }}>0.71 yd³</td><td style={{ padding: '8px 12px' }}>0.74 yd³</td></tr>
                  <tr style={{ backgroundColor: '#F8FAFC' }}><td style={{ padding: '8px 12px', fontWeight: 600 }}>2 tons</td><td style={{ padding: '8px 12px' }}>1.43 yd³</td><td style={{ padding: '8px 12px' }}>1.48 yd³</td></tr>
                  <tr><td style={{ padding: '8px 12px', fontWeight: 600 }}>3 tons</td><td style={{ padding: '8px 12px' }}>2.14 yd³</td><td style={{ padding: '8px 12px' }}>2.22 yd³</td></tr>
                  <tr style={{ backgroundColor: '#F8FAFC' }}><td style={{ padding: '8px 12px', fontWeight: 600 }}>5 tons</td><td style={{ padding: '8px 12px' }}>3.57 yd³</td><td style={{ padding: '8px 12px' }}>3.70 yd³</td></tr>
                  <tr><td style={{ padding: '8px 12px', fontWeight: 600 }}>8 tons</td><td style={{ padding: '8px 12px' }}>5.71 yd³</td><td style={{ padding: '8px 12px' }}>5.93 yd³</td></tr>
                  <tr style={{ backgroundColor: '#F8FAFC' }}><td style={{ padding: '8px 12px', fontWeight: 600 }}>10 tons</td><td style={{ padding: '8px 12px' }}>7.14 yd³</td><td style={{ padding: '8px 12px' }}>7.41 yd³</td></tr>
                  <tr><td style={{ padding: '8px 12px', fontWeight: 600 }}>12 tons</td><td style={{ padding: '8px 12px' }}>8.57 yd³</td><td style={{ padding: '8px 12px' }}>8.89 yd³</td></tr>
                  <tr style={{ backgroundColor: '#F8FAFC' }}><td style={{ padding: '8px 12px', fontWeight: 600 }}>14 tons</td><td style={{ padding: '8px 12px' }}>10.00 yd³</td><td style={{ padding: '8px 12px' }}>10.37 yd³</td></tr>
                  <tr><td style={{ padding: '8px 12px', fontWeight: 600 }}>15 tons</td><td style={{ padding: '8px 12px' }}>10.71 yd³</td><td style={{ padding: '8px 12px' }}>11.11 yd³</td></tr>
                  <tr style={{ backgroundColor: '#F8FAFC' }}><td style={{ padding: '8px 12px', fontWeight: 600 }}>20 tons</td><td style={{ padding: '8px 12px' }}>14.29 yd³</td><td style={{ padding: '8px 12px' }}>14.81 yd³</td></tr>
                  <tr><td style={{ padding: '8px 12px', fontWeight: 600 }}>25 tons</td><td style={{ padding: '8px 12px' }}>17.86 yd³</td><td style={{ padding: '8px 12px' }}>18.52 yd³</td></tr>
                  <tr style={{ backgroundColor: '#F8FAFC' }}><td style={{ padding: '8px 12px', fontWeight: 600 }}>30 tons</td><td style={{ padding: '8px 12px' }}>21.43 yd³</td><td style={{ padding: '8px 12px' }}>22.22 yd³</td></tr>
                  <tr><td style={{ padding: '8px 12px', fontWeight: 600 }}>40 tons</td><td style={{ padding: '8px 12px' }}>28.57 yd³</td><td style={{ padding: '8px 12px' }}>29.63 yd³</td></tr>
                  <tr style={{ backgroundColor: '#F8FAFC' }}><td style={{ padding: '8px 12px', fontWeight: 600 }}>50 tons</td><td style={{ padding: '8px 12px' }}>35.71 yd³</td><td style={{ padding: '8px 12px' }}>37.04 yd³</td></tr>
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginBottom: '10px' }}>
              Cubic Yards to Tons (1.40 vs 1.35 tons/yd³)
            </h3>
            <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                    <th style={{ padding: '8px 12px' }}>Cubic Yards</th>
                    <th style={{ padding: '8px 12px' }}>Crushed Stone (1.40)</th>
                    <th style={{ padding: '8px 12px' }}>River Rock (1.35)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: '8px 12px', fontWeight: 600 }}>1 yd³</td><td style={{ padding: '8px 12px' }}>1.40 tons</td><td style={{ padding: '8px 12px' }}>1.35 tons</td></tr>
                  <tr style={{ backgroundColor: '#F8FAFC' }}><td style={{ padding: '8px 12px', fontWeight: 600 }}>2 yd³</td><td style={{ padding: '8px 12px' }}>2.80 tons</td><td style={{ padding: '8px 12px' }}>2.70 tons</td></tr>
                  <tr><td style={{ padding: '8px 12px', fontWeight: 600 }}>3 yd³</td><td style={{ padding: '8px 12px' }}>4.20 tons</td><td style={{ padding: '8px 12px' }}>4.05 tons</td></tr>
                  <tr style={{ backgroundColor: '#F8FAFC' }}><td style={{ padding: '8px 12px', fontWeight: 600 }}>5 yd³</td><td style={{ padding: '8px 12px' }}>7.00 tons</td><td style={{ padding: '8px 12px' }}>6.75 tons</td></tr>
                  <tr><td style={{ padding: '8px 12px', fontWeight: 600 }}>8 yd³</td><td style={{ padding: '8px 12px' }}>11.20 tons</td><td style={{ padding: '8px 12px' }}>10.80 tons</td></tr>
                  <tr style={{ backgroundColor: '#F8FAFC' }}><td style={{ padding: '8px 12px', fontWeight: 600 }}>10 yd³</td><td style={{ padding: '8px 12px' }}>14.00 tons</td><td style={{ padding: '8px 12px' }}>13.50 tons</td></tr>
                  <tr><td style={{ padding: '8px 12px', fontWeight: 600 }}>12 yd³</td><td style={{ padding: '8px 12px' }}>16.80 tons</td><td style={{ padding: '8px 12px' }}>16.20 tons</td></tr>
                  <tr style={{ backgroundColor: '#F8FAFC' }}><td style={{ padding: '8px 12px', fontWeight: 600 }}>15 yd³</td><td style={{ padding: '8px 12px' }}>21.00 tons</td><td style={{ padding: '8px 12px' }}>20.25 tons</td></tr>
                  <tr><td style={{ padding: '8px 12px', fontWeight: 600 }}>20 yd³</td><td style={{ padding: '8px 12px' }}>28.00 tons</td><td style={{ padding: '8px 12px' }}>27.00 tons</td></tr>
                  <tr style={{ backgroundColor: '#F8FAFC' }}><td style={{ padding: '8px 12px', fontWeight: 600 }}>25 yd³</td><td style={{ padding: '8px 12px' }}>35.00 tons</td><td style={{ padding: '8px 12px' }}>33.75 tons</td></tr>
                  <tr><td style={{ padding: '8px 12px', fontWeight: 600 }}>30 yd³</td><td style={{ padding: '8px 12px' }}>42.00 tons</td><td style={{ padding: '8px 12px' }}>40.50 tons</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 7: Pro Tips */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              5 Essential Pro Tips for Buying Bulk Materials by Weight
            </h2>
            <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
              <li style={{ marginBottom: '12px' }}>
                <strong>Beware of Moisture Weight Inflation:</strong> Water weighs 62.4 lb per cubic foot. If a quarry experienced rain over the past 48 hours, stockpiled sand, topsoil, and crusher run absorb substantial water weight. Whenever possible, purchase bulk materials during dry weather periods.
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
                <p style={{ marginTop: '6px', fontSize: '0.875rem', color: '#64748B' }}>
                  Check your state&apos;s legal load limits; real loads are often lower.
                </p>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Always Ask for the Split Load Policy:</strong> If you need gravel and topsoil, some suppliers offer split-box trucks that deliver both materials in a single trip for one delivery fee.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Factor in Compaction and Settling:</strong> Use the order buffer in the calculator for settling and compaction (commonly 10-20% for loose gravel and soil). Loose earth materials delivered in a dump truck fluff up with air voids. Once spread and compacted with a plate tamper or lawn roller, loose volume shrinks.
              </li>
            </ol>
          </section>

          <HowWeCalculate slug="tons-to-cubic-yards" />

          {/* Section 8: FAQ */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
                  How many cubic yards in a ton?
                </h3>
                <p style={{ margin: 0, color: '#475569' }}>
                  For typical crushed stone or gravel (approx 1.40 tons/yd³), 1 ton equals 0.71 cubic yards. For screened topsoil (approx 1.10 tons/yd³), 1 ton equals 0.91 cubic yards. For lightweight hardwood mulch (approx 0.40 tons/yd³), 1 ton equals 2.50 cubic yards.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
                  Is a ton the same as a yard?
                </h3>
                <p style={{ margin: 0, color: '#475569' }}>
                  No: a ton is a unit of weight (2,000 pounds), while a cubic yard is a unit of volume (27 cubic feet). Converting between the two always requires knowing the specific density of the material you are buying.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
                  How many yards in a ton of gravel?
                </h3>
                <p style={{ margin: 0, color: '#475569' }}>
                  One US short ton of typical crushed gravel or road base equals approximately 0.71 to 0.74 cubic yards. Conversely, one cubic yard of gravel weighs about 1.35 to 1.40 tons (2,700 to 2,800 pounds).
                </p>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
                  How many tons in a cubic yard of sand / topsoil / mulch?
                </h3>
                <p style={{ margin: 0, color: '#475569' }}>
                  One cubic yard of dry concrete sand weighs 1.35 tons (2,700 lb), wet packed sand weighs 1.60 tons (3,200 lb), screened topsoil weighs 1.10 tons (2,200 lb), and shredded hardwood mulch weighs 0.40 tons (800 lb).
                </p>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
                  Do metric tonnes change the answer?
                </h3>
                <p style={{ margin: 0, color: '#475569' }}>
                  Yes: one metric tonne equals 1,000 kilograms or 2,204.62 pounds, which is approximately 10.2% heavier than a standard US short ton (2,000 pounds). Our calculator features a dedicated metric unit toggle so you can convert directly from metric tonnes to cubic yards.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
                  How many square feet does 1 ton of gravel cover?
                </h3>
                <p style={{ margin: 0, color: '#475569' }}>
                  1 ton of gravel covers about 231-240 sq ft at 1 inch, 116-120 sq ft at 2 inches, 77-80 sq ft at 3 inches, 58-60 sq ft at 4 inches and 39-40 sq ft at 6 inches (theoretical, from 1.40 to 1.35 tons/yd3). Add about 10% for compaction and waste. For an exact area x depth quantity use our <Link href="/stone-calculator/" style={{ color: '#0284C7' }}>stone calculator</Link>.
                </p>
              </div>
            </div>
          </section>

          {/* Section 9: Related Volume & Material Calculators */}
          <section style={{ padding: '24px', backgroundColor: '#F0FDF4', borderRadius: '12px', border: '1px solid #BBF7D0', marginTop: '40px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>
              Related Volume &amp; Material Calculators
            </h2>
            <p style={{ color: '#15803D', marginBottom: '16px' }}>
              Calculate raw materials, surface areas, and project budgets with our companion hardscape tools:
            </p>
            <ul style={{ paddingLeft: '20px', color: '#15803D', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              <li>
                <Link href="/cubic-yard-calculator/" style={{ color: '#166534', fontWeight: 600 }}>
                  Cubic Yard Calculator
                </Link>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#15803D' }}>Calculate concrete slab &amp; footing yardage</span>
              </li>
              <li>
                <Link href="/sand-calculator/" style={{ color: '#166534', fontWeight: 600 }}>
                  Sand Calculator
                </Link>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#15803D' }}>Masonry sand, bedding sand &amp; tons</span>
              </li>
              <li>
                <Link href="/stone-calculator/" style={{ color: '#166534', fontWeight: 600 }}>
                  Stone Calculator
                </Link>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#15803D' }}>Crushed rock, river rock &amp; aggregate tons</span>
              </li>
              <li>
                <Link href="/fill-dirt-calculator/" style={{ color: '#166534', fontWeight: 600 }}>
                  Fill Dirt Calculator
                </Link>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#15803D' }}>Subsoil fill volume, compaction &amp; truckloads</span>
              </li>
              <li>
                <Link href="/asphalt-calculator/" style={{ color: '#166534', fontWeight: 600 }}>
                  Asphalt Calculator
                </Link>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#15803D' }}>Hot mix driveway tonnage &amp; paving costs</span>
              </li>
            </ul>
          </section>
        </article>
      </main>
    </>
  );
}
