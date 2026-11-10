import { Metadata } from 'next';
import Link from 'next/link';
import { PaintCalculator } from '@/components/tool/paint-calculator';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { SITE_NAME, SITE_URL } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: 'Paint Cost Calculator (Coverage & Price)',
  description:
    'Free paint cost calculator to estimate gallons, quarts, and total costs for any room or house. Accounts for 1-3 coats, doors, windows, ceilings, and primer.',
  path: '/paint-cost-calculator/',
});

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Paint Cost Calculator',
    url: `${SITE_URL}/paint-cost-calculator/`,
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
      'Calculate exact paint gallons, quarts, wall surface area, and total material costs for interior rooms, ceilings, and whole houses with door and window deductions.',
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
        name: 'Paint Cost Calculator',
        item: `${SITE_URL}/paint-cost-calculator/`,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much paint do I need for a 12x12 room?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For a standard 12 ft x 12 ft room with an 8-foot ceiling, total gross wall area is 384 sq ft. Subtracting one standard door (21 sq ft) and two windows (30 sq ft) leaves approximately 333 net sq ft. Because paint covers roughly 350 to 400 sq ft per gallon, you will need exactly 1 gallon for a single coat, or 2 full gallons for the recommended two coats.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many gallons of paint do I need for 1,000 square feet?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For 1,000 square feet of wall surface area, you will need approximately 2.5 to 2.85 gallons of paint per coat (based on standard coverage of 350 to 400 sq ft per gallon). For the industry-standard two coats, plan on purchasing 5 to 6 gallons of paint.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does a gallon of interior paint cover?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'One standard US gallon of interior latex or acrylic paint covers approximately 350 to 400 square feet on smooth, primed drywall. On unprimed drywall, textured walls, or porous surfaces (like rough plaster or masonry), coverage drops to 250 to 300 square feet per gallon.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I really need two coats of paint?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, in nearly all interior painting projects, two coats are strongly recommended. A single coat rarely achieves full color opacity, leaves roller lap marks, and fails to provide uniform durability. Even self-priming "paint-and-primer-in-one" formulas require two coats when transitioning between contrasting colors.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does it cost to paint a room yourself vs hiring a painter?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'DIY painting for an average 12x12 room costs between $70 and $180 total for two gallons of mid-to-premium paint plus basic supplies (roller, tape, drop cloth). In contrast, hiring a professional painting contractor typically costs between $350 and $900 for the same room, including labor, wall prep, patching, and two coats.',
        },
      },
      {
        '@type': 'Question',
        name: 'When is a dedicated primer coat required?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A separate primer coat is essential when: (1) painting brand new unpainted drywall or fresh skim coats, (2) transitioning from a dark paint color to a light color, (3) painting over repaired drywall patches, stains, or smoke damage, or (4) applying water-based latex paint over older oil-based enamel.',
        },
      },
    ],
  },
];

export default function PaintCostCalculatorPage() {
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
            <li style={{ color: '#0F172A', fontWeight: 500 }} aria-current="page">Paint Cost Calculator</li>
          </ol>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Paint Cost Calculator (Coverage &amp; Price Estimator)
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
            Accurately calculate how much paint you need in gallons and quarts, plus estimated DIY material and professional painter labor costs for walls, ceilings, and trim.
          </p>
        </header>

        {/* Interactive Tool */}
        <section aria-label="Paint Cost and Coverage Calculator Tool">
          <PaintCalculator />
        </section>

        {/* Ad Placeholder */}
        <AdSlot slotId="paint-calc-middle" />

        {/* Long-form Informational SEO Content */}
        <article style={{ marginTop: '48px', color: '#334155', lineHeight: 1.7, fontSize: '0.975rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            How to Calculate Paint for a Room (Step-by-Step)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Whether you are freshening up an apartment bedroom, planning an interior renovation, or estimating paint costs for an entire home, computing precise gallon coverage prevents mid-job paint runs and color mismatch batches. Follow these four fundamental steps:
          </p>

          <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Measure Room Perimeter and Ceiling Height:</strong> Measure the length and width of your room in feet. Add the four wall lengths together to determine the total room perimeter: 2 × (Length + Width). Multiply by the ceiling height to get gross wall area. For room surface details or multi-room layouts, check our <Link href="/square-footage-calculator/" style={{ color: '#0284C7' }}>square footage calculator</Link>.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Deduct Doors and Windows:</strong> Don&apos;t pay for paint you won&apos;t apply. Deduct standard openings: standard interior doors take up 21 sq ft (3&apos; × 7&apos;), while windows average 15 sq ft (3&apos; × 5&apos;).
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Account for Ceilings (Optional):</strong> If painting the ceiling, simply add Length × Width in square feet to your paintable area.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Multiply by Coats and Divide by Coverage:</strong> Quality interior latex paint covers between 350 and 400 square feet per gallon on primed drywall. For the recommended two coats, multiply net area by 2, then divide by your coverage rate to find total gallons needed.
            </li>
          </ol>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            How Much Does a Gallon of Paint Cover? (The 350–400 Sq Ft Rule)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            The universal rule of thumb in the painting industry is that <strong>one gallon of quality interior paint covers approximately 350 to 400 square feet</strong> on smooth, non-porous surfaces. Wall texture and surface porosity alter real-world spread rates:
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Wall Surface Type</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Spread Rate per Gallon</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Best Suited Paint Finish</th>
                  <th style={{ padding: '10px 14px', color: '#0F172A' }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Smooth Drywall (Primed)</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>380 – 400 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>Eggshell, Satin, Matte</td>
                  <td style={{ padding: '10px 14px' }}>Standard newly painted or primed modern drywall</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Light Texture (Orange Peel)</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>340 – 360 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>Eggshell, Satin</td>
                  <td style={{ padding: '10px 14px' }}>Slight surface ripples increase surface area by ~10–15%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Heavy Texture (Knockdown)</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>280 – 320 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>Flat, Matte</td>
                  <td style={{ padding: '10px 14px' }}>Deep crevices absorb paint rapidly</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Unprimed Drywall / Plaster</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>250 – 300 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>PVA Drywall Primer</td>
                  <td style={{ padding: '10px 14px' }}>Highly porous paper and mud suck in moisture thirsty</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Rough Masonry / Brick / CMU</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0284C7' }}>200 – 250 sq ft</td>
                  <td style={{ padding: '10px 14px' }}>Masonry Primer / Acrylic</td>
                  <td style={{ padding: '10px 14px' }}>For block foundations, use our <Link href="/cinder-block-calculator/" style={{ color: '#0284C7' }}>cinder block calculator</Link></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Interior Painting Cost Breakdown: DIY vs. Hiring a Professional
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Evaluating material expenses against contractor quotes helps you make the most cost-effective renovation choice:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>DIY Painting Costs ($145 – $190 / room)</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '8px' }}>
                Primary costs are paint ($40–$65/gal) and application tools (painters tape, microfiber roller covers, angle sash brush, drop cloths). DIY saves 70% to 80% compared to professional labor.
              </p>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>Professional Painter Costs ($450 – $900 / room)</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '8px' }}>
                Contractors charge $1.50 to $3.50 per square foot of wall space ($40–$70/hour). For drafting professional proposals, contractors use our <Link href="/construction-estimate-template/" style={{ color: '#0284C7' }}>construction estimate template</Link>.
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Paint Sheen Guide: Which Finish Should You Choose?
          </h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Flat / Matte (0–5% gloss):</strong> Best for ceilings and low-traffic formal bedrooms. Hides drywall flaws and surface bumps exceptionally well.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Eggshell (10–25% gloss):</strong> America&apos;s #1 choice for living rooms, dining rooms, and adult bedrooms. Soft sheen that wipes clean gently.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Satin (25–35% gloss):</strong> Ideal for high-traffic hallways, kids&apos; rooms, and laundry spaces. Resists water splashes and fingerprints.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Semi-Gloss (35–60% gloss):</strong> The standard for baseboards, doors, trim, and kitchen/bathroom humidity zones. Highly scrubbable.
            </li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                How much paint do I need for a 12x12 room?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                For a standard 12 ft × 12 ft room with an 8-foot ceiling, total gross wall area is 384 sq ft. Subtracting one standard door (21 sq ft) and two windows (30 sq ft) leaves approximately 333 net sq ft. Because paint covers roughly 350 to 400 sq ft per gallon, you will need exactly 1 gallon for a single coat, or 2 full gallons for the recommended two coats.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                How many gallons of paint do I need for 1,000 square feet?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                For 1,000 square feet of wall surface area, you will need approximately 2.5 to 2.85 gallons of paint per coat (based on standard coverage of 350 to 400 sq ft per gallon). For the industry-standard two coats, plan on purchasing 5 to 6 gallons of paint.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                How much does a gallon of interior paint cover?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                One standard US gallon of interior latex or acrylic paint covers approximately 350 to 400 square feet on smooth, primed drywall. On unprimed drywall, textured walls, or porous surfaces (like rough plaster or masonry), coverage drops to 250 to 300 square feet per gallon.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                Do I really need two coats of paint?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem' }}>
                Yes, in nearly all interior painting projects, two coats are strongly recommended. A single coat rarely achieves full color opacity, leaves roller lap marks, and fails to provide uniform durability. Even self-priming &quot;paint-and-primer-in-one&quot; formulas require two coats when transitioning between contrasting colors.
              </p>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}

