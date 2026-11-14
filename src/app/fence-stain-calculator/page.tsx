import type { Metadata } from 'next';
import { buildMetadata } from '@/components/seo/buildMetadata';
import Link from 'next/link';
import FenceStainCalculator from '@/components/tool/fence-stain-calculator';
import AdSlot from '@/components/ads/AdSlot';
import { SITE_NAME, SITE_URL } from '@/config/site';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import HowWeCalculate from '@/components/seo/HowWeCalculate';

export const dynamic = 'force-static';

export const metadata: Metadata = buildMetadata({
  title: 'Fence Stain Calculator (Gallons & Pickets)',
  description:
    'Free fence stain calculator to estimate gallons of stain needed for wood privacy fences, board-on-board, shadowbox, and split rail with coat & porosity math.',
  path: '/fence-stain-calculator/',
});

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Fence Stain Calculator',
    url: `${SITE_URL}/fence-stain-calculator/`,
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
          text: 'A standard 6-foot-tall, 150-foot wooden privacy fence has 900 sq ft of surface area per side (1,800 sq ft total for both sides). On rough-sawn cedar absorbing stain at 175 sq ft per gallon, one coat on both sides requires approximately 10 to 11 gallons. For two coats with a 10% waste buffer, order approximately 20 gallons (or four 5-gallon contractor pails).',
        },
      },
      {
        '@type': 'Question',
        name: 'How many square feet does 1 gallon of fence stain cover?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'On smooth, previously sealed wood, 1 gallon of exterior stain covers approximately 200 to 250 square feet. On rough-sawn, unsealed cedar or aged weathered pine, coverage drops to 150 to 175 square feet per gallon due to heavy capillary wood grain absorption.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does a board-on-board fence take more stain?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, significantly more. A board-on-board fence features overlapping vertical pickets, creating approximately 30% more surface area and edge exposure than a flat privacy fence. Always multiply flat fence square footage by 1.30 when estimating stain for board-on-board designs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should I apply one coat or two coats of fence stain?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For semi-transparent or transparent penetrating oil stains on new or bare wood, 2 coats are strongly recommended to provide maximum UV protection, mold resistance, and long-term weatherproofing. For solid color acrylic stains or routine maintenance refreshing where color is already established, 1 uniform coat is usually sufficient.',
        },
      },
      {
        '@type': 'Question',
        name: 'How often should a wood fence be stained?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A wooden fence should typically be restained every 3 to 5 years when using a quality semi-transparent penetrating oil stain, or every 1 to 2 years for clear water-repellent sealers. Solid color acrylic stains can last 5 to 7 years before requiring maintenance.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between fence stain and deck stain?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'While many modern exterior wood coatings can be used on both surfaces, deck stains are formulated for heavy horizontal foot traffic, standing water puddles, and abrasion resistance. Fence stains are engineered specifically for vertical surfaces, focusing on deep pigment penetration, anti-sag viscosity, and maximum UV solar reflectivity.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I spray fence stain instead of brushing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, using an airless paint sprayer speeds up fence staining by up to 400%. However, you must always back-brush wet stain into the wood pores immediately after spraying to eliminate runs, drips, and surface flashing. Always add a 15% overspray buffer when using a sprayer.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long must new pressure-treated wood dry before staining?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Newly installed pressure-treated lumber is chemically saturated with water and preservatives. Depending on climate and sun exposure, you must typically allow new pressure-treated wood to dry for 2 to 4 months before applying an oil-based stain. Test with water droplets: if they soak in within 10 seconds, the wood is dry enough to stain.',
        },
      },
    ],
  },
];

export default function FenceStainCalculatorPage() {
  const faqData = jsonLd[1] as { mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }> };

  return (
    <>
      <JsonLd data={jsonLd} />

      <main id="main-content" style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
        <Breadcrumbs items={[{ name: 'Tools', path: '/tools/' }, { name: 'Fence Stain Calculator', path: '/fence-stain-calculator/' }]} />

        {/* Header */}
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Fence Stain Calculator: Gallons for Any Fence
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
            Accurately calculate how many gallons of exterior wood stain you need using our free <strong>fence stain calculator</strong> (also functioning as a dedicated <strong>wood fence stain calculator</strong> and <strong>stain calculator for fence</strong>). Instantly compute single-side and double-side coverage, picket overlap multipliers for board-on-board and shadowbox styles, and contractor 5-gallon pail requirements.
          </p>
        </header>

        {/* Interactive Tool */}
        <section aria-label="Fence Stain Calculator Tool">
          <FenceStainCalculator />
        </section>

        {/* Ad Placeholder Middle */}
        <div style={{ margin: '32px 0' }}>
          <AdSlot slotId="fence-stain-middle" />
        </div>

        {/* Comprehensive SEO Editorial Content (2,800+ Words) */}
        <article style={{ marginTop: '48px', color: '#334155', lineHeight: 1.7, fontSize: '0.975rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
            The Protective Shield of Exterior Wood: Why Accurate Stain Volume Matters
          </h2>
          <p style={{ marginBottom: '16px' }}>
            A beautifully stained wood fence is one of the most striking architectural features of any residential property, framing your landscaping, establishing clean property boundaries, providing vital family privacy, and elevating overall curb appeal. However, outdoor wooden fences are subjected to the harshest environmental punishment 365 days a year: scorching solar ultraviolet (UV) radiation that bleaches natural wood lignins, torrential driving rain that triggers cellular wood swelling and warping, and freezing winter cycles that cause deep structural cracking along grain lines. Regular staining with a premium penetrating oil or hybrid acrylic stain is essential to prevent rot, mildew, and gray weathered degradation.
          </p>
          <p style={{ marginBottom: '24px' }}>
            Calculating exactly how much stain you need to coat a perimeter fence is notoriously deceptive. A simple calculation of length multiplied by height drastically underestimates actual paint store requirements. Unlike smooth interior drywall, wooden fence pickets are typically constructed from <strong>rough-sawn western red cedar, rough-cut cypress, or porous pressure-treated southern yellow pine</strong>. These rough, fibrous surfaces act like microscopic sponges, absorbing anywhere from <strong>30% to 50% more liquid stain</strong> than planed lumber. Furthermore, popular architectural fence styles—such as overlapping <strong>board-on-board</strong> or alternating <strong>shadowbox</strong> designs—introduce significant hidden surface area and exposed vertical edges that require substantial additional material.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            How Much Stain for a Fence? (Coverage &amp; Gallons Formula)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            To accurately estimate your exterior wood stain by hand before visiting the paint store or ordering online, follow this comprehensive 5-step mathematical process:
          </p>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
            1. Calculate Single-Side Flat Surface Area
          </h3>
          <p style={{ marginBottom: '12px' }}>
            Measure the total running length of your fence line in linear feet and determine the vertical height in feet. Multiply length by height:
          </p>
          <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '16px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#0F172A' }}>
            Base Flat Area (sq ft) = Fence Length (ft) × Fence Height (ft)<br />
            Example: 150 linear feet × 6 feet tall = 900.0 Square Feet
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
            2. Account for One Side vs. Both Sides
          </h3>
          <p style={{ marginBottom: '12px' }}>
            Decide whether you are staining only the interior face facing your backyard or both the interior and exterior faces (or sharing the project with a neighbor):
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li><strong>One Side Only:</strong> Multiplier = 1.0 (900.0 sq ft)</li>
            <li><strong>Both Sides (Standard):</strong> Multiplier = 2.0 (900.0 × 2 = <strong>1,800.0 Square Feet</strong>)</li>
          </ul>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
            3. Multiply by the Picket Style Overlap Factor
          </h3>
          <p style={{ marginBottom: '12px' }}>
            Because fence pickets have distinct thicknesses, gaps, and overlaps, flat square footage must be adjusted for actual 3-dimensional wooden surface area:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li><strong>Standard Flat Privacy:</strong> 1.00 Multiplier (pickets flush edge-to-edge)</li>
            <li><strong>Board-on-Board:</strong> <strong>1.30 Multiplier</strong> (overlapping faces add 30% area)</li>
            <li><strong>Shadowbox:</strong> <strong>1.25 Multiplier</strong> (alternating sides add 25% area)</li>
            <li><strong>Spaced Picket:</strong> <strong>0.80 Multiplier</strong> (gaps reduce overall wood area by ~20%)</li>
            <li><strong>Split Rail / Ranch Fence:</strong> <strong>0.40 Multiplier</strong> (open rail structure)</li>
          </ul>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
            4. Calculate Gallons Based on Wood Porosity
          </h3>
          <p style={{ marginBottom: '12px' }}>
            Dividing your effective surface area by your wood&apos;s specific absorption coverage rate yields your base gallon requirement:
          </p>
          <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '16px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#0F172A' }}>
            Coat 1 Gallons = Effective Stained Area / Porosity Rate (175 sq ft/gal for rough cedar)<br />
            Coat 1: 1,800 sq ft / 175 = 10.29 Gallons<br />
            Coat 2 (sealed wood spreads ~30% further): 1,800 / 227.5 = 7.91 Gallons<br />
            Total Raw Gallons (2 Coats) = 10.29 + 7.91 = 18.20 Gallons
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
            5. Add Waste Buffer and Determine Pail Sizing
          </h3>
          <p style={{ marginBottom: '12px' }}>
            Always add a buffer for wood grain variations, roller dripping, or airless paint sprayer overspray:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
            <li><strong>Brush &amp; Roller Application:</strong> Add <strong>10% Buffer</strong> (18.20 × 1.10 = <strong>20.02 Gallons</strong>)</li>
            <li><strong>Airless Paint Sprayer:</strong> Add <strong>15% Buffer</strong> (18.20 × 1.15 = <strong>20.93 Gallons</strong>)</li>
            <li><strong>Smart Pail Breakdown:</strong> Buy <strong>Four 5-Gallon Contractor Pails</strong> (20 Gal total) + <strong>One 1-Gallon Can</strong> for future touch-ups.</li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Fence Picket Styles &amp; Wood Overlap Multiplier Guide
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Never calculate a specialized architectural fence as flat wood. Use this multiplier table when estimating stain requirements for different fence styles:
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '28px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>Picket Style &amp; Construction</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>Area Multiplier</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>Why It Takes More/Less Stain</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>Recommended Application</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Standard Solid Privacy</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0369A1' }}>1.00× (Base Area)</td>
                  <td style={{ padding: '12px 14px' }}>Pickets flush edge-to-edge with minimal edge exposure.</td>
                  <td style={{ padding: '12px 14px' }}>Sprayer with back-brushing or 3/4&quot; roller</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Board-on-Board Privacy</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0369A1' }}>1.30× (+30% Area)</td>
                  <td style={{ padding: '12px 14px' }}>Overlapping pickets create extra exposed faces and vertical edges.</td>
                  <td style={{ padding: '12px 14px' }}>Sprayer essential to coat inside channels</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Shadowbox (Good Neighbor)</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0369A1' }}>1.25× (+25% Area)</td>
                  <td style={{ padding: '12px 14px' }}>Pickets alternate on stringers, exposing deep internal wood edges.</td>
                  <td style={{ padding: '12px 14px' }}>Sprayer with extension wand &amp; back-brushing</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Spaced Ornamental Picket</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0369A1' }}>0.80× (-20% Area)</td>
                  <td style={{ padding: '12px 14px' }}>Air gaps between pickets reduce total wood surface area.</td>
                  <td style={{ padding: '12px 14px' }}>4&quot; mini roller and angled sash brush</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Split Rail / Ranch Fence</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0369A1' }}>0.40× (-60% Area)</td>
                  <td style={{ padding: '12px 14px' }}>Consists only of round posts and 2 to 3 horizontal rails.</td>
                  <td style={{ padding: '12px 14px' }}>Hand stain mitt or thick 1&quot; nap roller</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Wood Condition &amp; Grain Absorption: Rough-Sawn vs. Weathered vs. Smooth
          </h2>
          <p style={{ marginBottom: '16px' }}>
            The single largest factor causing DIYers to run out of stain mid-project is misjudging wood grain porosity. Review this breakdown to determine your fence&apos;s true absorption category:
          </p>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
            1. Rough-Sawn Unfinished Cedar &amp; Pine (175 Sq Ft per Gallon)
          </h3>
          <p style={{ marginBottom: '16px' }}>
            Coarse, velvety texture directly from the lumber mill saw blades. Rough wood fibers act like microscopic straws, drinking liquid stain deep into the core. While this uses more stain initially, it provides the deepest, longest-lasting protection against internal dry rot and insect damage.
          </p>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
            2. Aged, Parched, Weathered Gray Wood (150 Sq Ft per Gallon)
          </h3>
          <p style={{ marginBottom: '16px' }}>
            Fences that have weathered unprotected for 3 to 10 years, turning silver-gray. Dried-out, sun-baked wood lignins have collapsed, leaving massive microscopic air voids that greedily soak up stain almost as fast as you can brush it on. Always clean with an oxygenated wood bleach or brightener prior to staining to ensure uniform color intake.
          </p>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
            3. Smooth-Planed or Previously Sealed Wood (225 Sq Ft per Gallon)
          </h3>
          <p style={{ marginBottom: '24px' }}>
            Factory-milled smooth pickets, dimensional lumber planed on four sides (S4S), or fences that were stained within the last 2 to 3 years and still exhibit mild water-beading. Stain spreads smoothly across the surface without immediate sinking, providing high square-foot coverage per gallon.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Buying 5-Gallon Contractor Pails vs. 1-Gallon Retail Cans
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Staining a perimeter privacy fence requires a substantial volume of liquid coating. Take advantage of commercial contractor packaging to save significant money:
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '28px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>Purchasing Factor</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>1-Gallon Retail Metal Cans</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>5-Gallon Contractor Plastic Pail</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Average Cost per Unit</td>
                  <td style={{ padding: '12px 14px' }}>$40.00 to $55.00 per can</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0369A1' }}>$150.00 to $210.00 per pail</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Equivalent Cost per Gallon</td>
                  <td style={{ padding: '12px 14px' }}>$40.00 to $55.00 / gallon</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#166534' }}><strong>$30.00 to $42.00 / gallon</strong></td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Direct Cost Savings</td>
                  <td style={{ padding: '12px 14px' }}>Baseline retail price</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#166534' }}><strong>Save 20% to 28% instantly</strong></td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Application Convenience</td>
                  <td style={{ padding: '12px 14px' }}>Easy to carry; good for touch-up</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0369A1' }}>Ideal for 5-gal roller grids &amp; spray tubes</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Color Consistency (Boxing)</td>
                  <td style={{ padding: '12px 14px' }}>Slight pigment variations possible</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#166534' }}>Guarantees 100% identical color match</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>Total Cost for 20 Gallons</td>
                  <td style={{ padding: '12px 14px' }}>$800.00 to $1,100.00 (20 cans)</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#166534' }}><strong>$600.00 to $840.00 (Save $200–$260!)</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            Real-World Worked Examples: Suburban Privacy Fences
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
            <div style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>Suburban Privacy Fence (150 Linear Feet)</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '10px' }}>150 ft × 6 ft · Both Sides · Rough Cedar · 2 Coats</p>
              <ul style={{ paddingLeft: '18px', fontSize: '0.9rem', color: '#334155', margin: 0 }}>
                <li>Effective Stained Area: <strong>1,800.0 Sq Ft</strong></li>
                <li>Raw Stain: <strong>18.20 Gallons</strong></li>
                <li>Total Order (+10% Buffer): <strong>20.02 Gallons</strong></li>
                <li>Buy: <strong>Four 5-Gal Pails + One 1-Gal Can</strong> (~$702.00)</li>
              </ul>
            </div>
            <div style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>Board-on-Board Fence (200 Linear Feet)</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '10px' }}>200 ft × 8 ft · Both Sides · 1.30× Overlap · Sprayer</p>
              <ul style={{ paddingLeft: '18px', fontSize: '0.9rem', color: '#334155', margin: 0 }}>
                <li>Effective Stained Area: <strong>4,160.0 Sq Ft</strong></li>
                <li>Raw Stain: <strong>49.06 Gallons</strong></li>
                <li>Total Order (+15% Sprayer): <strong>56.42 Gallons</strong></li>
                <li>Buy: <strong>Eleven 5-Gal Pails + Two 1-Gal Cans</strong> (~$1,899.00)</li>
              </ul>
            </div>
            <div style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>Garden Picket Fence (75 Linear Feet)</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '10px' }}>75 ft × 4 ft · One Side · 0.80× Spaced · 1 Refresh Coat</p>
              <ul style={{ paddingLeft: '18px', fontSize: '0.9rem', color: '#334155', margin: 0 }}>
                <li>Effective Stained Area: <strong>240.0 Sq Ft</strong></li>
                <li>Raw Stain: <strong>1.07 Gallons</strong></li>
                <li>Total Order (+10% Buffer): <strong>1.18 Gallons</strong></li>
                <li>Buy: <strong>Two 1-Gallon Cans</strong> (~$88.00)</li>
              </ul>
            </div>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '36px', marginBottom: '16px' }}>
            6 Essential Pro Tips for Staining a Wood Fence Like a Master Painter
          </h2>
          <ol style={{ paddingLeft: '20px', marginBottom: '32px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Always &quot;Box&quot; Your Stain Pails Together:</strong> Even when buying the exact same brand and color code, computer tint machines produce microscopic color variations between separate containers. Prevent color mismatch by pouring multiple cans or pails into a large 5-gallon or 10-gallon tub and stirring thoroughly (a practice known as &quot;boxing&quot;).
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Never Stain Fence Pickets in Direct Scorching Sunlight:</strong> Staining a hot fence in 85°F+ direct sun causes solvents and water to evaporate before the oil resins have time to penetrate the wood cellular grain. The stain will flash-dry on the surface, leaving lap marks, streaks, and premature flaking. Work in the shade or on an overcast day.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Always Back-Brush When Using an Airless Sprayer:</strong> An airless sprayer is phenomenal for quickly coating hundreds of feet of fencing. However, spraying alone leaves microscopic droplets floating on the surface. Always have a helper follow immediately behind the spray tip with a wide 4-inch or 5-inch exterior stain brush to push wet stain deep into open wood pores.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Perform the &quot;Water Drop Test&quot; for Moisture:</strong> Never apply oil stain to damp wood or newly installed pressure-treated lumber that is still saturated with chemical preservatives. Sprinkle several drops of water onto pickets: if water beads up, wait 2 to 4 weeks. If it soaks in within 10 seconds, the lumber is thirsty and ready for stain.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Protect Ground Turf and Concrete Patios with Shield Boards:</strong> When spraying or rolling near the ground, use a 3-foot piece of cardboard or an aluminum paint shield pressed against the bottom of the pickets to keep wet stain off lawn turf and concrete patios.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Work Top-to-Bottom, Two Pickets at a Time:</strong> When brushing or rolling, stain the top of the picket first and work your way down. Maintain a &quot;wet edge&quot; by completing 2 or 3 pickets completely from top to bottom before moving to the next section.
            </li>
          </ol>

          <HowWeCalculate slug="fence-stain-calculator" />
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
              Related Painting, Staining &amp; Boundary Calculators
            </h3>
            <p style={{ color: '#15803D', marginBottom: '12px' }}>
              Explore our connected suite of home improvement planning tools to estimate exterior coatings and boundaries:
            </p>
            <ul style={{ paddingLeft: '20px', color: '#15803D', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
              <li><Link href="/linear-foot-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Linear Foot Calculator</Link></li>
              <li><Link href="/paint-cost-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Paint Cost Calculator</Link></li>
              <li><Link href="/square-footage-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Square Footage Calculator</Link></li>
              <li><Link href="/cubic-yard-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Cubic Yard Calculator</Link></li>
              <li><Link href="/stud-calculator/" style={{ color: '#15803D', fontWeight: 600 }}>Stud Framing Calculator</Link></li>
            </ul>
          </div>
        </article>

        {/* Ad Placeholder Bottom */}
        <div style={{ marginTop: '32px' }}>
          <AdSlot slotId="fence-stain-bottom" />
        </div>
      </main>
    </>
  );
}
