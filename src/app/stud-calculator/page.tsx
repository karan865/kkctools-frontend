import type { Metadata } from 'next';
import { buildMetadata } from '@/components/seo/buildMetadata';
import Link from 'next/link';
import StudCalculator from '@/components/tool/stud-calculator';
import AdSlot from '@/components/ads/AdSlot';
import { SITE_NAME, SITE_URL } from '@/config/site';
import JsonLd from '@/components/seo/JsonLd';
import HowWeCalculate from '@/components/seo/HowWeCalculate';

export const dynamic = 'force-static';

export const metadata: Metadata = buildMetadata({
  title: 'Stud Calculator: Wall Framing & Lumber Cost',
  description:
    'Free stud calculator for wall framing. Get the exact stud count for 16" or 24" OC spacing, corners, doors, windows, plates and lumber cost.',
  path: '/stud-calculator/',
});

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Stud Calculator',
    url: `${SITE_URL}/stud-calculator/`,
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
      'Free stud calculator for wall framing. Calculate 2x4 and 2x6 field studs, corners, partition T-junctions, doors, windows, and plate boards with cost estimation.',
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
        name: 'Stud Calculator',
        item: `${SITE_URL}/stud-calculator/`,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I use a stud calculator for a wall with doors and windows?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Enter your total wall run length, height, and stud spacing (16" or 24" OC). Then enter the number of wall corners, partition T-intersections, door openings, and window openings. The calculator adds the required king studs, jack trimmer studs, header boards, and a waste allowance (10% recommended) so you order the exact lumber needed without shortages.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many studs do I need for a 10-foot wall?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'About 9 field studs (10 with 10% waste). With 1 corner and 1 door: 15 studs, about 17 with waste.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the rule of thumb for calculating studs?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A common rule of thumb is one stud per linear foot of wall (1 stud per linear foot). While 16-inch on-center field framing only places a stud every 1.33 feet (0.75 studs per linear foot), the extra 0.25 studs per foot serves as a quick ballpark for walls with a few openings and corners. For an exact lumber list and cost estimate, always use the calculator.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why do framed walls need a double top plate?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A double top plate ties wall sections together, interlocks intersecting partition walls and corners, and distributes concentrated weight from roof trusses or floor joists evenly across adjacent studs. A single top plate is allowed in some cases (in-line framing with approved plate ties). Check local code.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need a pressure-treated bottom plate?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, pressure-treated lumber is required by most building codes where the bottom plate sits directly on interior concrete slabs or basement floors in contact with the ground, unless separated by an approved continuous moisture-barrier sill gasket.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should I use 2x4 or 2x6 lumber for framing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use 2x4 lumber for standard interior non-bearing partition walls, basement divider walls, and closet framing (3.5-inch finished cavity depth). Use 2x6 lumber for exterior walls to accommodate high-R-value R-19 or R-21 insulation batts, tall walls over 10 feet, second-story exterior load-bearing walls, and plumbing wet walls containing 3-inch drain pipes.',
        },
      },
    ],
  },
];

export default function StudCalculatorPage() {
  return (
    <>
      <JsonLd data={jsonLd} />

      <main id="main-content" style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--muted)' }}>
          <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, alignItems: 'center' }}>
            <li>
              <Link href="/" style={{ color: '#0369A1', textDecoration: 'none' }}>Home</Link>
            </li>
            <li style={{ margin: '0 8px', color: '#94A3B8' }} aria-hidden="true">›</li>
            <li>
              <Link href="/tools/" style={{ color: '#0369A1', textDecoration: 'none' }}>Tools</Link>
            </li>
            <li style={{ margin: '0 8px', color: '#94A3B8' }} aria-hidden="true">›</li>
            <li style={{ color: '#0F172A', fontWeight: 500 }} aria-current="page">Stud Calculator</li>
          </ol>
        </nav>

        {/* Page Header */}
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Stud Calculator: Wall Framing Studs, Plates &amp; Cost
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6, marginBottom: '12px' }}>
            Built around common International Residential Code (IRC) framing practices, this tool estimates counts for standard 2x4 and 2x6 wall runs.
          </p>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
            Looking for a stud wall calculator that handles real walls, not just a straight run? Enter your wall length, height and stud spacing, and this stud calculator for wall framing adds the extra studs for corners, partition tie-ins, doors and windows. It then shows how many 16-foot plate boards to buy and what the lumber will cost.
          </p>
          <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--muted)' }}>
            <span>Last updated: November 2026</span>
          </div>
        </header>

        {/* Interactive Tool */}
        <section aria-label="Interactive Stud Framing Calculator">
          <StudCalculator />
        </section>

        {/* Ad Placeholder */}
        <AdSlot slotId="stud-calc-middle" />

        {/* Editorial SEO Content */}
        <article style={{ marginTop: '48px', color: '#334155', lineHeight: 1.7, fontSize: '0.975rem' }}>
          {/* Section: What this tool counts */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              Wall Stud Calculator: What This Tool Counts
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Simple straight-line calculators divide total length by 16 inches and leave you 20% short at the jobsite. A real framed wall requires lumber for structural assemblies and fastening surfaces. Our calculator accounts for:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Field Studs:</strong> Regular recurring vertical studs spaced at 16 inches or 24 inches on-center along the entire wall length, plus one starter stud.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Corner Studs:</strong> Extra studs for three-stud corner posts (such as California corners) that provide solid interior drywall backing.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>T-Wall Studs:</strong> Additional framing members at intersecting partition wall tie-ins.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>King &amp; Jack (Trimmer) Studs:</strong> 4 full vertical studs for each rough door or window opening (2 full-height king studs + 2 trimmer jack studs supporting the header).
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Header Boards:</strong> Two 2x lumber boards per opening to build load-bearing lintels across spans.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Bottom &amp; Top Plates:</strong> Total linear footage and individual 16-foot stock boards needed for the bottom sole plate and single or double top plates.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Jobsite Waste:</strong> A realistic 5% to 15% allowance (10% recommended) for warped boards, crowns, and cutting scrap.
              </li>
            </ul>
          </section>

          {/* Section: 16 vs 24 OC */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              Framing Calculator for 2x4 &amp; 2x6 Walls: 16-Inch vs. 24-Inch On-Center Spacing
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Stud count is the same for 2x4 and 2x6 walls at the same spacing. 2x6 changes wall thickness (5.5 in vs 3.5 in), stud price and insulation space. The primary difference in lumber quantities comes from your choice of on-center (OC) spacing:
            </p>

            <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                    <th style={{ padding: '10px 14px', color: '#0F172A' }}>Framing System</th>
                    <th style={{ padding: '10px 14px', color: '#0F172A' }}>Common Applications</th>
                    <th style={{ padding: '10px 14px', color: '#0F172A' }}>Stud Density</th>
                    <th style={{ padding: '10px 14px', color: '#0F172A' }}>Pros &amp; Code Nuances</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>16 Inches OC (Standard)</td>
                    <td style={{ padding: '10px 14px' }}>Load-bearing exterior walls, multi-story buildings, heavy drywall tile backer</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0369A1' }}>0.75 studs/LF + 1</td>
                    <td style={{ padding: '10px 14px' }}>Universal code compliance, solid nailing for 1/2&quot; drywall, rigid tile and cabinet support</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>24 Inches OC (Advanced Framing)</td>
                    <td style={{ padding: '10px 14px' }}>Interior non-bearing partitions, single-story exterior walls, garage walls</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0369A1' }}>0.50 studs/LF + 1</td>
                    <td style={{ padding: '10px 14px' }}>Uses roughly 25-30% fewer field studs; less wood means less thermal bridging (Advanced Framing / OVE); 5/8&quot; drywall is often recommended for a flatter finish.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: Wall Length Chart */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              How Many Studs Do I Need? Wall Length Chart (Field Studs Only)
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Use this quick reference table to find base field studs for standard wall run lengths. <em>Add 2 per corner, 2 per T-wall, 4 per door or window, then waste.</em>
            </p>

            <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                    <th style={{ padding: '10px 14px', color: '#0F172A' }}>Wall Run Length</th>
                    <th style={{ padding: '10px 14px', color: '#0F172A' }}>16-Inch OC Field Studs</th>
                    <th style={{ padding: '10px 14px', color: '#0F172A' }}>24-Inch OC Field Studs</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>4 Feet</td>
                    <td style={{ padding: '10px 14px' }}>4 studs</td>
                    <td style={{ padding: '10px 14px' }}>3 studs</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>6 Feet</td>
                    <td style={{ padding: '10px 14px' }}>6 studs</td>
                    <td style={{ padding: '10px 14px' }}>4 studs</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>8 Feet</td>
                    <td style={{ padding: '10px 14px' }}>7 studs</td>
                    <td style={{ padding: '10px 14px' }}>5 studs</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>10 Feet</td>
                    <td style={{ padding: '10px 14px' }}>9 studs</td>
                    <td style={{ padding: '10px 14px' }}>6 studs</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>12 Feet</td>
                    <td style={{ padding: '10px 14px' }}>10 studs</td>
                    <td style={{ padding: '10px 14px' }}>7 studs</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>14 Feet</td>
                    <td style={{ padding: '10px 14px' }}>12 studs</td>
                    <td style={{ padding: '10px 14px' }}>8 studs</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>16 Feet</td>
                    <td style={{ padding: '10px 14px' }}>13 studs</td>
                    <td style={{ padding: '10px 14px' }}>9 studs</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>20 Feet</td>
                    <td style={{ padding: '10px 14px' }}>16 studs</td>
                    <td style={{ padding: '10px 14px' }}>11 studs</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>24 Feet</td>
                    <td style={{ padding: '10px 14px' }}>19 studs</td>
                    <td style={{ padding: '10px 14px' }}>13 studs</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>30 Feet</td>
                    <td style={{ padding: '10px 14px' }}>24 studs</td>
                    <td style={{ padding: '10px 14px' }}>16 studs</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>40 Feet</td>
                    <td style={{ padding: '10px 14px' }}>31 studs</td>
                    <td style={{ padding: '10px 14px' }}>21 studs</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>50 Feet</td>
                    <td style={{ padding: '10px 14px' }}>39 studs</td>
                    <td style={{ padding: '10px 14px' }}>26 studs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: Step-by-Step Framing Calculation Method */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              How to Calculate Studs for a Wall (Step-by-Step Formula)
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Carpenters use this standard six-step formula to calculate framing lumber accurately:
            </p>
            <ol style={{ paddingLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>
                <strong>Calculate Total Wall Length in Inches:</strong> Convert your run length to inches: Total Inches = Length in Feet × 12 + Inches. For example, a 24-foot wall equals 24 × 12 = 288 inches.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Determine Base Field Studs:</strong> Divide total length in inches by your stud spacing (16 or 24), round up to the next whole number, and add one starter stud: Field Studs = RoundUp(Total Inches / Spacing) + 1. For a 24-ft wall at 16&quot; OC: 288 / 16 = 18 + 1 = 19 field studs.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Add Studs for Corners:</strong> Each corner is built as a three-stud assembly so drywall has solid nailing on both sides (the California corner is a popular variant). One of those three studs is already counted in the field studs, so the calculator adds 2 extra studs per corner. Example: 2 corners = 2 × 2 = 4 additional studs.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Add Studs for T-Wall Partition Tie-Ins:</strong> Where an interior wall intersects perpendicular to another wall, carpenters nail blocking or a 3-stud backing channel. Add 2 studs per T-junction.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Add Studs for Rough Openings (Doors &amp; Windows):</strong> Add 4 full studs per door or window (2 king + 2 jack). Studs that would have fallen inside the opening are cut into cripples, so no deduction is needed. Headers are separate boards, 2 per opening.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Calculate Plate Boards (Sole Plate &amp; Top Plates):</strong> Standard walls require 1 bottom sole plate and 2 top plates (3 plate layers total). For a 20-ft wall: total plate LF is 20 × 3 = 60 LF. Ordering standard 16-foot lumber boards: bottom plate = 20 / 16 = 1.25 → 2 boards; top plates = 40 / 16 = 2.5 → 3 boards; total = 5 boards (reusing offcuts, the absolute minimum is 60 / 16 = 3.75 → 4 boards). A pressure-treated bottom plate is required by most codes where the plate sits on concrete in contact with the ground, unless separated by a moisture barrier.
              </li>
            </ol>
          </section>

          {/* Section: Cost Estimation */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              Framing Cost Calculator: Estimating Lumber Expenses
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Framing lumber costs fluctuate with seasonal supply and demand. Prices are approximate and vary by region and season; check your local lumberyard:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>2x4x92-5/8&quot; Precut Studs:</strong> ~$3.50 to $6.00 per stud (average ~$4.50).
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>2x6x92-5/8&quot; Precut Studs:</strong> ~$6.00 to $9.50 per stud (average ~$7.50).
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>16-ft Top Plate Boards (2x4 / 2x6 SPF):</strong> ~$8.00 to $12.00 per board.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>16-ft Pressure-Treated Bottom Plate Boards:</strong> ~$12.00 to $18.00 per board.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Framing Fasteners:</strong> Budget ~$30 to $50 for a box of 3-1/2&quot; 16d common nails or structural screws.
              </li>
            </ul>
            <p style={{ marginBottom: '16px' }}>
              On average, DIY framing material costs range from roughly <strong>$0.75 to $1.50 per sq ft of wall area (lumber only)</strong>. Professional carpentry labor typically adds <strong>$5 to $10 per linear foot</strong> for interior non-bearing walls, and <strong>$8 to $16 per linear foot</strong> for exterior load-bearing walls. For a 200 linear foot home addition or full basement finish, expect materials to run about $1,200 to $2,000, and labor to run about $1,000 to $2,000.
            </p>
          </section>

          {/* Section: Worked Example */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              Worked Example: Framing a 42-Foot L-Shaped Basement Partition Run
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Consider a real-world DIY project: finishing a basement with a 42-foot L-shaped partition wall (28 ft on one run + 14 ft on the other) with 8-foot ceilings, 16&quot; OC spacing, 1 exterior corner, 1 closet T-wall tie-in, 2 interior door openings, and a concrete slab floor.
            </p>

            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
              <p style={{ margin: '0 0 8px 0' }}><strong>1. Total Length:</strong> 42 ft = 504 inches.</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>2. Base Field Studs:</strong> 504 / 16 = 31.5 → Round up to 32 + 1 = <strong>33 field studs</strong>.</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>3. Corner Studs:</strong> 1 corner × 2 = <strong>2 extra studs</strong>.</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>4. T-Wall Partition Studs:</strong> 1 T-wall × 2 = <strong>2 extra studs</strong>.</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>5. Door Openings:</strong> 2 doors × 4 = <strong>8 studs</strong> (4 king + 4 jack).</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>6. Subtotal Vertical Studs:</strong> 33 + 2 + 2 + 8 = <strong>45 studs</strong>.</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>7. Waste Factor (+10%):</strong> 45 × 1.10 = 49.5 → Round up to <strong>50 studs</strong> (2x4x92-5/8&quot; precuts).</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>8. Plate Lumber:</strong> 42 ft × 3 plates = 126 Linear Feet.</p>
              <p style={{ margin: '0 0 8px 0' }}>&bull; Bottom Plate (Pressure-Treated): 42 / 16 = 2.6 → <strong>3 boards</strong> (16-ft PT).</p>
              <p style={{ margin: '0 0 8px 0' }}>&bull; Double Top Plate: 84 / 16 = 5.25 → <strong>6 boards</strong> (16-ft standard SPF).</p>
              <p style={{ margin: '0' }}><strong>9. Header Boards:</strong> 2 doors × 2 = <strong>4 boards</strong>.</p>
            </div>
          </section>

          {/* Section: 5 Pro Tips */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              5 Essential Pro Tips for Wall Framing
            </h2>
            <ol style={{ paddingLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>
                <strong>Always Sight and Crown Your Studs:</strong> Lumber is rarely perfectly straight. Sight down each stud edge and mark the &quot;crown&quot; (the bowed curve) with a pencil arrow. Frame all wall studs with crowns facing the same exterior direction so the finished wall bows uniformly rather than producing irregular waves behind drywall.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Protect Bottom Plates Against Slab Moisture:</strong> Most codes require pressure-treated lumber (or a moisture barrier) where a plate sits on slab concrete. Use fasteners rated for treated wood (hot-dip galvanized or stainless), and anchor the bottom plate to concrete with concrete fasteners.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Lap Top Plates at Wall Intersections:</strong> When framing corners and T-intersections, leave the upper plate short by the width of the intersecting wall (3.5 in for 2x4 walls, 5.5 in for 2x6). The overlapping plate from the adjoining wall locks the framework into a rigid structural diaphragm.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Buy Pre-Cut 92-5/8&quot; Studs for Standard 8-Foot Ceilings:</strong> Do not buy standard 8-foot (96-inch) 2x4 lumber for vertical studs! A standard wall assembly features three 1.5-inch plates (bottom sole plate + double top plate = 4.5 inches). Adding 4.5 inches to standard 92-5/8-inch precut studs produces a finished wall height of 97-1/8 inches, accommodating two 48-inch drywall sheets with a 1/2-inch floor gap.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Flash the Rough Window Sill:</strong> Apply sill-pan or flashing tape over the rough sill before setting the window, and set windows level and plumb. This sends incidental water out and protects framing from rot.
              </li>
            </ol>
          </section>

          <HowWeCalculate slug="stud-calculator" />

          {/* Section: FAQ */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
                  How do I use a stud calculator for a wall with doors and windows?
                </h3>
                <p style={{ margin: 0, color: '#475569' }}>
                  Enter total length, spacing, corners, T-walls, doors and windows; the calculator adds king/jack studs and waste.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
                  How many studs do I need for a 10-foot wall?
                </h3>
                <p style={{ margin: 0, color: '#475569' }}>
                  About 9 field studs (10 with 10% waste). With 1 corner and 1 door: 15 studs, about 17 with waste.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
                  What is the rule of thumb for calculating studs?
                </h3>
                <p style={{ margin: 0, color: '#475569' }}>
                  A common contractor rule of thumb is 1 stud per linear foot of wall. It serves as a quick ballpark for walls with a few openings; use the calculator for the exact count.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
                  Why do framed walls need a double top plate?
                </h3>
                <p style={{ margin: 0, color: '#475569' }}>
                  A double top plate ties wall sections together, interlocks intersecting partition walls and corners, and distributes concentrated weight from roof trusses or floor joists evenly across adjacent studs. A single top plate is allowed in some cases (in-line framing with approved plate ties). Check local code.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
                  Do I need a pressure-treated bottom plate?
                </h3>
                <p style={{ margin: 0, color: '#475569' }}>
                  Most building codes require pressure-treated lumber where a plate sits on concrete in contact with the ground, unless separated by an approved moisture barrier or sill gasket.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
                  Should I use 2x4 or 2x6 lumber for framing?
                </h3>
                <p style={{ margin: 0, color: '#475569' }}>
                  Use 2x4 lumber for interior non-bearing partition walls, divider walls, and standard closets. Use 2x6 lumber for exterior walls to accommodate high-R-value insulation batts, load-bearing exterior walls, and plumbing wet walls.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Related Framing & Building Calculators */}
          <section style={{ padding: '24px', backgroundColor: '#F0F9FF', borderRadius: '12px', border: '1px solid #BAE6FD', marginTop: '40px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#075985', marginBottom: '8px' }}>
              Related Framing &amp; Building Calculators
            </h2>
            <p style={{ color: '#0C4A6E', marginBottom: '16px' }}>
              Plan all stages of your carpentry and home renovation project with our companion tools:
            </p>
            <ul style={{ paddingLeft: '20px', color: '#075985', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
              <li>
                <Link href="/rafter-calculator/" style={{ color: '#0369A1', fontWeight: 600 }}>
                  Rafter Calculator
                </Link>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#475569' }}>Calculate roof rafter lengths, pitch &amp; overhangs</span>
              </li>
              <li>
                <Link href="/linear-foot-calculator/" style={{ color: '#0369A1', fontWeight: 600 }}>
                  Linear Foot Calculator
                </Link>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#475569' }}>Estimate wall runs, baseboard trim &amp; plate lumber</span>
              </li>
              <li>
                <Link href="/square-footage-calculator/" style={{ color: '#0369A1', fontWeight: 600 }}>
                  Square Footage Calculator
                </Link>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#475569' }}>Drywall and exterior wall sheathing square footage</span>
              </li>
              <li>
                <Link href="/paint-cost-calculator/" style={{ color: '#0369A1', fontWeight: 600 }}>
                  Paint Cost Calculator
                </Link>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#475569' }}>Calculate paint gallons and costs for finished walls</span>
              </li>
            </ul>
          </section>
        </article>
      </main>
    </>
  );
}
