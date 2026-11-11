import { Metadata } from 'next';
import Link from 'next/link';
import PaintCalculator from '@/components/tool/paint-calculator/PaintCalculator';
import Faq from '@/components/ui/Faq';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { SITE_NAME, SITE_URL } from '@/config/site';
import {
  PAINT_FAQS,
  RELATED_FINISHING_TOOLS,
} from '@/content/pages/paint-calculator';
import styles from './page.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Paint Cost Calculator (Coverage & Price)',
  description:
    'Free paint cost calculator to estimate gallons, quarts, and total costs for any room or house. Accounts for 1-3 coats, doors, windows, ceilings, and primer.',
  path: '/paint-cost-calculator/',
});

// Quick Reference Room Table data (matches engine calculations: 8ft ceiling, 1 door + 2 windows deducted = 51 sq ft, 380 sq ft/gal, 2 coats)
const QUICK_ROOM_REFERENCE_TABLE = [
  { size: '10 × 10', netWall: 269, coat1: 0.71, coat2Exact: 1.42, coat2Buy: '1 gal + 2 qt', ceilBuy: '1 gal', l: 10, w: 10 },
  { size: '10 × 12', netWall: 301, coat1: 0.79, coat2Exact: 1.58, coat2Buy: '2 gal', ceilBuy: '1 gal', l: 12, w: 10 },
  { size: '12 × 12', netWall: 333, coat1: 0.88, coat2Exact: 1.75, coat2Buy: '2 gal', ceilBuy: '1 gal', l: 12, w: 12 },
  { size: '12 × 14', netWall: 365, coat1: 0.96, coat2Exact: 1.92, coat2Buy: '2 gal', ceilBuy: '1 gal', l: 14, w: 12 },
  { size: '14 × 14', netWall: 397, coat1: 1.04, coat2Exact: 2.09, coat2Buy: '2 gal + 1 qt', ceilBuy: '1 gal + 1 qt', l: 14, w: 14 },
  { size: '14 × 16', netWall: 429, coat1: 1.13, coat2Exact: 2.26, coat2Buy: '2 gal + 2 qt', ceilBuy: '1 gal + 1 qt', l: 16, w: 14 },
  { size: '16 × 16', netWall: 461, coat1: 1.21, coat2Exact: 2.43, coat2Buy: '2 gal + 2 qt', ceilBuy: '1 gal + 2 qt', l: 16, w: 16 },
  { size: '16 × 20', netWall: 525, coat1: 1.38, coat2Exact: 2.76, coat2Buy: '3 gal', ceilBuy: '2 gal', l: 20, w: 16 },
];

export default function PaintCostCalculatorPage() {
  const canonicalUrl = `${SITE_URL}/paint-cost-calculator/`;

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Paint Cost Calculator',
    url: canonicalUrl,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
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
      'Free online paint cost calculator and coverage estimator for walls, ceilings, multi-room projects, primer, and contractor labor comparisons.',
  };

  const breadcrumbSchema = {
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
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: PAINT_FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  const liveRelatedTools = RELATED_FINISHING_TOOLS.filter((t) => t.live);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main id="main-content" className={styles.container}>
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
          <ol className={styles.breadcrumbList}>
            <li className={styles.breadcrumbItem}>
              <Link href="/">Home</Link>
            </li>
            <li className={styles.breadcrumbSeparator} aria-hidden="true">
              ›
            </li>
            <li className={styles.breadcrumbItem}>
              <Link href="/tools/">Calculators</Link>
            </li>
            <li className={styles.breadcrumbSeparator} aria-hidden="true">
              ›
            </li>
            <li className={`${styles.breadcrumbItem} ${styles.breadcrumbItemActive}`} aria-current="page">
              Paint Cost Calculator
            </li>
          </ol>
        </nav>

        {/* Section 1: Hero + Intro */}
        <header className={styles.hero}>
          <div className={styles.badge}>Interior Finishes &amp; Wall Estimator</div>
          <h1 className={styles.title}>Free Paint Cost Calculator: Estimate Gallons, Quarts &amp; Total Project Costs</h1>
          <p className={styles.dateVerified}>Last updated: November 2026. Prices are typical US retail and contractor ranges.</p>
          <p className={styles.description}>
            This free <strong>paint cost calculator</strong> tells you how many gallons and quarts of paint you need, and what the job will cost, for walls, ceilings and primer. Whether you are redecorating a single bedroom or estimating a full whole-home makeover, our tool accounts for multi-room floor plans, door and window deductions, wall textures, and professional contractor labor comparisons.
          </p>
          <p className={styles.secondaryDescription}>
            As an easy-to-use <strong>interior paint cost calculator</strong>, it converts raw room dimensions into exact shopping quantities—so you know whether to order single gallon cans, quarts for touch-ups, or bulk 5-gallon buckets.
          </p>
        </header>

        {/* Interactive Calculator Component */}
        <section aria-label="Paint Cost Calculator Tool">
          <PaintCalculator />
        </section>

        {/* Ad Slot 1: Below Calculator */}
        <AdSlot slotId="paint-calc-top" />

        <div className={styles.contentWrapper}>
          {/* Section 2: How Much Paint Do I Need? (Gallons & Quarts Formula) */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>How Much Paint Do I Need? (Gallons &amp; Quarts Formula)</h2>
            <p className={styles.paragraph}>
              Determining exact paint requirements manually relies on straightforward geometry. To figure out how much paint you need for any room, follow this 4-step formula:
            </p>
            <div className={styles.formulaBox}>
              <code>Perimeter = 2 × (Length + Width)</code><br />
              <code>Gross Wall Area = Perimeter × Ceiling Height</code><br />
              <code>Net Wall Area = Gross Wall Area − (Doors × 21 sq ft + Windows × 15 sq ft)</code><br />
              <code>Total Gallons = (Net Wall Area × Coats) ÷ Coverage Rate (sq ft / gal)</code>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subHeading}>Worked Example: Standard 14 ft × 12 ft Bedroom</h3>
              <p className={styles.paragraph}>
                Consider a typical 14 ft by 12 ft bedroom with 8-foot ceilings, containing one standard interior door and two windows:
              </p>
              <ul className={styles.unorderedList}>
                <li className={styles.listItem}><strong>Perimeter:</strong> 2 × (14 + 12) = 52 linear feet.</li>
                <li className={styles.listItem}><strong>Gross Wall Area:</strong> 52 ft × 8 ft height = 416 sq ft.</li>
                <li className={styles.listItem}><strong>Openings Deductions:</strong> 1 door (21 sq ft) + 2 windows (30 sq ft) = 51 sq ft of unpainted space.</li>
                <li className={styles.listItem}><strong>Net Wall Area:</strong> 416 − 51 = <strong>365 sq ft</strong> of paintable drywall.</li>
                <li className={styles.listItem}><strong>Wall Paint (Two Coats):</strong> 365 sq ft × 2 coats = 730 sq ft total coverage. At the standard smooth drywall rate (380 sq ft/gal): 730 ÷ 380 = 1.92 gallons → <strong>buy 2 gallons</strong>. (At a conservative 350 sq ft/gal rate, 730 ÷ 350 = 2.09 gal → buy 2 gallons + 1 quart).</li>
                <li className={styles.listItem}><strong>Ceiling Paint (Optional, Two Coats):</strong> 14 ft × 12 ft = 168 sq ft ceiling area. Two coats = 336 sq ft ÷ 380 = 0.88 gallons → <strong>buy 1 gallon</strong> of flat ceiling paint.</li>
                <li className={styles.listItem}><strong>Primer Coat (If Bare Drywall or Dark Color):</strong> Walls (365) + Ceiling (168) = 533 sq ft. At 300 sq ft/gal primer coverage: 533 ÷ 300 = 1.78 gallons → <strong>buy 2 gallons</strong> of primer.</li>
              </ul>
            </div>
          </section>

          {/* Section 3: How Much Does a Gallon of Paint Cover? (The 350–400 Sq Ft Rule) */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>How Much Does a Gallon of Paint Cover? (The 350–400 Sq Ft Rule)</h2>
            <p className={styles.paragraph}>
              As a universal rule of thumb, one standard gallon of interior architectural paint covers approximately <strong>350 to 400 square feet</strong> on smooth drywall. However, surface porosity and wall texture dramatically change how much paint the substrate absorbs:
            </p>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Wall Surface Texture</th>
                    <th>Average Coverage (Sq Ft / Gal)</th>
                    <th>Substrate Characteristics &amp; Absorption</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Smooth Drywall (Standard)</strong></td>
                    <td>350 – 400 sq ft (Tool default: 380)</td>
                    <td>Previously painted or pre-primed smooth drywall with minimal absorption.</td>
                  </tr>
                  <tr>
                    <td><strong>Light Texture (Orange Peel)</strong></td>
                    <td>325 – 350 sq ft (Tool uses: 350)</td>
                    <td>Light spray texture creates microscopic hills and valleys, increasing surface area.</td>
                  </tr>
                  <tr>
                    <td><strong>Heavy Texture (Knockdown / Stucco)</strong></td>
                    <td>275 – 300 sq ft (Tool uses: 300)</td>
                    <td>Deep crevices require thicker roller naps (1/2&quot; to 3/4&quot;), consuming more paint.</td>
                  </tr>
                  <tr>
                    <td><strong>Unprimed Fresh Drywall</strong></td>
                    <td>225 – 250 sq ft (Tool uses: 250)</td>
                    <td>Raw paper and joint compound thirstily suck paint into the wall. Always prime first!</td>
                  </tr>
                  <tr>
                    <td><strong>Rough Masonry / Brick / Cinder Block</strong></td>
                    <td>200 – 250 sq ft (Tool uses: 225)</td>
                    <td>Highly porous concrete blocks absorb paint quickly. Requires high-build masonry primer.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.noteText}>
              <em>Pro Tip:</em> Use <strong>350 sq ft per gallon</strong> if you want a conservative buying estimate that guarantees you won&apos;t run out of paint before completing the final corner.
            </p>

            <div className={styles.subsection}>
              <h3 className={styles.subHeading}>Primer Paint Coverage</h3>
              <p className={styles.paragraph}>
                Most dedicated stain-blocking and PVA drywall primers list a coverage rate of approximately 250 to 400 square feet per gallon. Because unprimed surfaces absorb resin aggressively, our calculator uses <strong>300 sq ft per gallon</strong> as a dependable, safe default. Always verify coverage on your specific primer can label.
              </p>
            </div>
          </section>

          {/* Section 4: Paint Needed by Room Size (Quick Reference) */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Paint Needed by Room Size (Quick Reference)</h2>
            <p className={styles.paragraph}>
              Use this benchmark reference table for typical room footprints with standard 8-foot ceilings and average door and window openings:
            </p>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Room Dimensions (ft)</th>
                    <th>Net Wall Area (sq ft)</th>
                    <th>1 Coat (Exact Gal)</th>
                    <th>2 Coats (Exact → Buy)</th>
                    <th>Ceiling, 2 Coats (Buy)</th>
                  </tr>
                </thead>
                <tbody>
                  {QUICK_ROOM_REFERENCE_TABLE.map((row) => (
                    <tr key={row.size}>
                      <td><strong>{row.size} ft</strong></td>
                      <td>{row.netWall} sq ft</td>
                      <td>{row.coat1} gal</td>
                      <td><strong>{row.coat2Exact} gal → {row.coat2Buy}</strong></td>
                      <td>{row.ceilBuy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.noteText}>
              <em>Assumptions:</em> 8 ft ceiling height, 1 standard door (21 sq ft) + 2 standard windows (30 sq ft) deducted (51 sq ft total openings), standard smooth drywall coverage of 380 sq ft/gal. Ceiling paint calculated separately.
            </p>
          </section>

          {/* Section 5: Planning to Paint the Inside of Your Home */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Planning to Paint the Inside of Your Home</h2>
            <p className={styles.paragraph}>
              When painting the inside of your home, professional contractors recommend a strict top-to-bottom sequence: patch and prep drywall first, paint the ceiling next, roll the walls third, and finish with baseboards and door casings last.
            </p>
            <p className={styles.paragraph}>
              When tackling an entire floor plan, use our calculator&apos;s <strong>multi-room mode</strong> to aggregate bedrooms, hallways, and living rooms into one combined material order. For accurate dimensions, calculate total room floor space with our <Link href="/square-footage-calculator/" className={styles.inlineLink}>Square Footage Calculator</Link>, estimate trim and baseboard molding with the <Link href="/linear-foot-calculator/" className={styles.inlineLink}>Linear Foot Calculator</Link>, or draft a formal project bid using the <Link href="/construction-estimate-template/" className={styles.inlineLink}>Construction Estimate Template</Link>.
            </p>
          </section>

          {/* Section 6: DIY vs Professional Cost Breakdown */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Interior Painting Cost Breakdown: DIY vs. Hiring a Professional</h2>
            <p className={styles.paragraph}>
              Painting is one of the most accessible home improvement projects for DIYers. Here is how material and labor expenses compare for standard room renovations:
            </p>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Project Scope</th>
                    <th>DIY Material Budget (Mid-Grade)</th>
                    <th>Professional Painter Turnkey Cost</th>
                    <th>Estimated DIY Cash Savings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Small Room (10 × 10 ft)</strong></td>
                    <td>$80 – $130</td>
                    <td>$270 – $670</td>
                    <td>Save $190 – $540</td>
                  </tr>
                  <tr>
                    <td><strong>Standard Bedroom (12 × 12 ft)</strong></td>
                    <td>$115 – $170</td>
                    <td>$330 – $830</td>
                    <td>Save $215 – $660</td>
                  </tr>
                  <tr>
                    <td><strong>Master Suite (14 × 16 ft)</strong></td>
                    <td>$145 – $210</td>
                    <td>$430 – $1,070</td>
                    <td>Save $285 – $860</td>
                  </tr>
                  <tr>
                    <td><strong>Whole House (2,000–2,300 sq ft)</strong></td>
                    <td>$650 – $1,200</td>
                    <td>$4,000 – $11,000</td>
                    <td>Save $3,350 – $9,800</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className={styles.paragraph}>
              <strong>DIY Cost Structure per Room:</strong> For a typical 12x14 room, two gallons of mid-grade interior latex paint cost about $90 ($45/gal). Sundries (painter&apos;s tape, 3/8&quot; microfiber roller covers, metal tray liners, drop cloths) add about $25 to $50. If applying primer, add $25 to $50. Your total out-of-pocket DIY cost is <strong>about $115 to $190</strong> per room (premium boutique paints can push this toward ~$230).
            </p>
            <p className={styles.paragraph}>
              <strong>Professional Contractor Pricing:</strong> Professional painters typically charge <strong>$1.00 to $2.50 per square foot</strong> of paintable surface area (or $35 to $60 per hour per painter). That equates to $330–$830 for a 12×12 room and $370–$910 for a 12×14 room. Homeowners who supply their own labor save roughly <strong>50% to 80%</strong> compared to professional contractor quotes.
            </p>
          </section>

          {/* Section 7: Paint Sheen Selection Guide */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Paint Sheen Selection Guide: Which Finish Goes Where?</h2>
            <p className={styles.paragraph}>
              Choosing the right sheen is just as critical as picking the right color. Sheen affects both light reflectance and scrubbability:
            </p>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Sheen Level</th>
                    <th>Best Rooms &amp; Surfaces</th>
                    <th>Pros &amp; Cons Overview</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Flat / Matte</strong></td>
                    <td>Ceilings, master bedrooms, low-traffic areas</td>
                    <td>Hides wall imperfections completely; difficult to clean or wipe without burnishing.</td>
                  </tr>
                  <tr>
                    <td><strong>Eggshell</strong></td>
                    <td>Living rooms, bedrooms, hallways, home offices</td>
                    <td>Soft, velvety look with low glare; washable enough for everyday family living.</td>
                  </tr>
                  <tr>
                    <td><strong>Satin</strong></td>
                    <td>Kitchens, kids&apos; rooms, bathrooms, laundry rooms</td>
                    <td>Resists moisture, mildew, and fingerprint grease; shows slight surface imperfections.</td>
                  </tr>
                  <tr>
                    <td><strong>Semi-Gloss</strong></td>
                    <td>Doors, baseboards, window trim, cabinets</td>
                    <td>Highly durable and scrubbable; reflective shine highlights drywall dips and seams.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 8: Related Calculators */}
          <section className={styles.relatedSection}>
            <h2 className={styles.sectionHeading}>Related Finishing &amp; Estimation Calculators</h2>
            <p className={styles.paragraph}>
              Coordinate your interior renovation with our other live browser-based estimators:
            </p>
            <div className={styles.relatedGrid}>
              {liveRelatedTools.map((tool, idx) => (
                <Link key={idx} href={tool.href} className={styles.relatedCard}>
                  <div className={styles.relatedCardTitle}>{tool.label}</div>
                  <div className={styles.relatedCardDesc}>{tool.description}</div>
                </Link>
              ))}
            </div>
          </section>

          {/* Ad Slot 2: Mid Content */}
          <AdSlot slotId="paint-calc-middle" />

          {/* Section 9: FAQ */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Paint Cost Calculator FAQ</h2>
            <Faq items={PAINT_FAQS} />
          </section>

          {/* Section 10: Closing Wrap-up */}
          <section className={styles.section}>
            <p className={styles.closingParagraph}>
              Taking accurate wall measurements and using this free <strong>paint cost calculator</strong> prevents costly mid-project supply runs and ensures your decorating budget stays on track. For baseboard trim and whole-room estimates, explore our companion <Link href="/linear-foot-calculator/" className={styles.inlineLink}>Linear Foot Calculator</Link> and <Link href="/square-footage-calculator/" className={styles.inlineLink}>Square Footage Calculator</Link>.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
