import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Faq from '@/components/ui/Faq';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import AsphaltCalculator from '@/components/tool/asphalt-calculator/AsphaltCalculator';
import { ASPHALT_PAGE_COPY } from '@/content/pages/asphalt-calculator';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { ROUTES } from '@/lib/routes';
import { SITE_URL } from '@/config/site';
import styles from './page.module.css';

export const metadata: Metadata = buildMetadata({
  title: ROUTES.asphaltCalculator.title,
  description: ROUTES.asphaltCalculator.description,
  path: ROUTES.asphaltCalculator.path,
});

export default function AsphaltCalculatorPage() {
  const canonicalUrl = `${SITE_URL}/asphalt-calculator/`;

  // Schema 1: WebApplication
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Asphalt Calculator',
    url: canonicalUrl,
    description:
      'Free asphalt calculator that estimates tons, cubic yards and cost from area, thickness and density. Includes millings mode and metric units.',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any (web browser)',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: {
      '@type': 'Organization',
      name: 'KKCTools',
      url: `${SITE_URL}/`,
    },
    inLanguage: 'en-US',
  };

  // Schema 2: BreadcrumbList
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
        name: 'Asphalt Calculator',
        item: canonicalUrl,
      },
    ],
  };

  // Schema 3: FAQPage generated dynamically from ASPHALT_PAGE_COPY.faqs
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ASPHALT_PAGE_COPY.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  const copy = ASPHALT_PAGE_COPY;

  // Filter live sister calculators per B8
  const liveRelatedCalculators = copy.relatedCalculators.filter((c) => c.live);

  return (
    <main id="main-content">
      <JsonLd data={webAppSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      {/* Hero & Interactive Tool Section */}
      <Section style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-6)' }}>
        <Container>
          <Breadcrumbs
            withSchema={false}
            items={[
              { name: 'Home', path: '/' },
              { name: 'Asphalt Calculator', path: '/asphalt-calculator/' },
            ]}
          />

          <header style={{ marginBottom: 'var(--space-4)', maxWidth: 'var(--prose)' }}>
            <span className={styles.categoryTag}>Materials • Paving • Construction</span>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: 'var(--ink)',
                marginBottom: 'var(--space-3)',
                letterSpacing: '-0.025em',
              }}
            >
              {copy.h1}
            </h1>
            <p
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.65,
                color: 'var(--ink-2)',
                marginBottom: 'var(--space-2)',
              }}
            >
              {copy.introText}
            </p>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--muted)',
                fontStyle: 'italic',
                margin: 0,
              }}
            >
              {copy.trustLine}
            </p>
          </header>

          {/* H2: Asphalt Tonnage Calculator (Tool Card) */}
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--ink)',
              margin: 'var(--space-4) 0 var(--space-2)',
            }}
          >
            {copy.toolH2}
          </h2>

          <AsphaltCalculator />

          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 'var(--space-2) 0 var(--space-5)' }}>
            {copy.toolFootnote}
          </p>

          {/* AD SLOT A — directly below tool card */}
          <AdSlot slotId="ad-slot-a-asphalt" />
        </Container>
      </Section>

      {/* In-depth Editorial Content (Section B6 Verbatim Copy) */}
      <Section style={{ paddingTop: 'var(--space-2)', paddingBottom: 'var(--space-8)' }}>
        <Container>
          <div style={{ maxWidth: 'var(--prose)' }}>
            {/* Section 1: How Much Does 1 Ton of Asphalt Cover? */}
            <h2>How Much Does 1 Ton of Asphalt Cover?</h2>
            <p>
              One ton of hot mix asphalt covers about 83 square feet at 2 inches thick. Coverage drops as thickness goes up,
              because every square foot needs more material. The table uses the standard planning density of 145 lb/ft³ and US
              short tons (2,000 lb).
            </p>

            <div className={styles.tableWrapper}>
              <table className={styles.specTable}>
                <thead>
                  <tr>
                    <th scope="col">Compacted thickness</th>
                    <th scope="col" className={styles.numCell}>Coverage per ton</th>
                    <th scope="col" className={styles.numCell}>Tons per 1,000 sq ft</th>
                    <th scope="col">Common use (typical, not a rule)</th>
                  </tr>
                </thead>
                <tbody>
                  {copy.coverageTable.map((row, idx) => (
                    <tr key={idx}>
                      <td><strong>{row.thickness}</strong></td>
                      <td className={styles.numCell}>{row.coverage}</td>
                      <td className={styles.numCell}>{row.tons1000}</td>
                      <td>{row.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Section 2: How to Calculate Asphalt Tonnage (Figuring Asphalt Step by Step) */}
            <h2>How to Calculate Asphalt Tonnage (Figuring Asphalt Step by Step)</h2>
            <p>
              Figuring asphalt comes down to three numbers: the area you are paving, the compacted thickness, and the density
              of the mix. Everything else is unit conversion.
            </p>

            <h3>The asphalt tonnage formula</h3>
            <div className={styles.formulaBox}>
              <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
                <li><strong>Area (sq ft)</strong> = length × width</li>
                <li><strong>Volume (ft³)</strong> = area × thickness in inches ÷ 12</li>
                <li><strong>Weight (lb)</strong> = volume × density (lb/ft³)</li>
                <li><strong>Tons</strong> = weight ÷ 2,000</li>
              </ol>
              <p style={{ marginTop: 'var(--space-3)', marginBottom: 0 }}>
                Combined: <strong>Tons = area (sq ft) × thickness (in) × density (lb/ft³) ÷ 24,000.</strong> To get cubic yards,
                divide cubic feet by 27. To get the quantity to order, multiply the tons by 1 plus your waste percentage.
              </p>
            </div>

            <h3>Worked example: 20 ft × 40 ft driveway, 2 in thick</h3>
            <div className={styles.exampleBox}>
              <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                <li>Area: 20 × 40 = <strong>800 sq ft</strong></li>
                <li>Volume: 800 × 2 ÷ 12 = <strong>133.3 ft³</strong> (4.94 yd³)</li>
                <li>Weight: 133.3 × 145 = <strong>19,333 lb</strong></li>
                <li>Tons: 19,333 ÷ 2,000 = <strong>9.67 tons</strong></li>
                <li>Add 5% waste: 9.67 × 1.05 = <strong>10.15 tons to order</strong></li>
              </ul>
              <p style={{ marginTop: 'var(--space-3)', marginBottom: 0 }}>
                Round up to about 10.5 tons and ask your plant about minimum load sizes.
              </p>
            </div>

            {/* AD SLOT B — after worked example */}
            <AdSlot slotId="ad-slot-b-asphalt" />

            {/* Section 3: Asphalt Density and Weight Reference */}
            <h2>Asphalt Density and Weight Reference</h2>
            <p>
              Hot mix asphalt is usually estimated at 145 lb/ft³ once compacted. That is about 3,915 lb, or 1.96 tons, per
              cubic yard, and roughly 2.32 metric tonnes per cubic meter. Real mixes vary with aggregate, binder content and
              compaction, so use your supplier&apos;s figure when you have one.
            </p>

            <div className={styles.tableWrapper}>
              <table className={styles.specTable}>
                <thead>
                  <tr>
                    <th scope="col">Material</th>
                    <th scope="col" className={styles.numCell}>Typical density (lb/ft³)</th>
                    <th scope="col" className={styles.numCell}>Tons per cubic yard</th>
                    <th scope="col" className={styles.numCell}>kg/m³</th>
                  </tr>
                </thead>
                <tbody>
                  {copy.densityTable.map((row, idx) => (
                    <tr key={idx}>
                      <td><strong>{row.material}</strong></td>
                      <td className={styles.numCell}>{row.density}</td>
                      <td className={styles.numCell}>{row.tonsPerCY}</td>
                      <td className={styles.numCell}>{row.kgM3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              A handy shortcut: at 145 lb/ft³, each inch of thickness weighs about 109 lb per square yard, which is the
              familiar &quot;110 lb per square yard per inch&quot; rule of thumb.
            </p>

            {/* Section 4: How Thick Should Asphalt Be? */}
            <h2>How Thick Should Asphalt Be?</h2>
            <p>
              Thickness moves your tonnage more than any other input, so confirm it before you order. These are common planning
              ranges for compacted surface course, not design rules. Your contractor, engineer or local agency sets the actual
              specification.
            </p>

            <div className={styles.tableWrapper}>
              <table className={styles.specTable}>
                <thead>
                  <tr>
                    <th scope="col">Project</th>
                    <th scope="col">Typical compacted thickness</th>
                    <th scope="col">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {copy.thicknessTable.map((row, idx) => (
                    <tr key={idx}>
                      <td><strong>{row.project}</strong></td>
                      <td>{row.thickness}</td>
                      <td>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Optional SVG cross-section diagram specified in B2 */}
            <div className={styles.diagramWrapper}>
              <svg
                className={styles.diagramSvg}
                viewBox="0 0 600 240"
                width="600"
                height="240"
                aria-label="Cross-section of an asphalt driveway showing the surface course over a compacted stone base and subgrade"
                role="img"
              >
                <rect width="600" height="240" fill="var(--surface-2)" rx="8" />
                {/* Surface Course */}
                <rect x="40" y="30" width="520" height="45" fill="#3D4758" rx="4" />
                <text x="300" y="58" fill="#F1F5F9" textAnchor="middle" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
                  Compacted Asphalt Surface Course (2–3 in)
                </text>
                {/* Stone Base */}
                <rect x="40" y="85" width="520" height="65" fill="#C4B9A7" rx="4" />
                <text x="300" y="122" fill="#17213A" textAnchor="middle" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
                  Compacted Crushed Stone Base (4–8 in)
                </text>
                {/* Subgrade Soil */}
                <rect x="40" y="160" width="520" height="55" fill="#8C7A6B" rx="4" />
                <text x="300" y="193" fill="#FFFFFF" textAnchor="middle" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
                  Prepared Subgrade Soil / Geotextile Fabric
                </text>
              </svg>
            </div>

            <p>
              The stone base under the asphalt is a separate material. Use the [Stone Calculator] to estimate it.
            </p>

            {/* Section 5: Asphalt Millings Calculator (Recycled Asphalt) */}
            <h2>Asphalt Millings Calculator (Recycled Asphalt)</h2>
            <p>
              Asphalt millings, also called reclaimed asphalt pavement (RAP), are ground-up old asphalt used for driveways,
              farm lanes and parking pads. Select <strong>Millings</strong> in the calculator to switch to a lighter default
              density of 110 lb/ft³, about 1.49 tons per cubic yard. Many millings driveways are laid roughly 2–4 inches
              compacted.
            </p>
            <p>
              Millings weight changes with moisture and gradation, and loose material on a delivery truck weighs less per cubic
              yard than compacted millings. Suppliers invoice by weight, so if yours quotes tons per cubic yard, enter that
              figure as a custom density.
            </p>

            {/* Section 6: Bitumen Calculator: Metric Units and Binder Estimate */}
            <h2>Bitumen Calculator: Metric Units and Binder Estimate</h2>
            <p>
              People searching for a bitumen calculator usually want one of two things: the weight of asphalt mix in metric
              units, or the amount of bitumen binder inside that mix. This tool does both.
            </p>
            <p>
              Switch to <strong>Metric</strong> to enter meters and millimeters and read the result in tonnes and cubic meters.
              Turn on <strong>Show bitumen (binder) estimate</strong> in the advanced options to see roughly how much binder is
              in your total mix. Typical hot mix contains about 4–6% binder by weight, so the tool starts at 5%. Replace it with
              the percentage from your mix design.
            </p>

            {/* Section 7: Asphalt Driveway Cost: From Tons to Dollars */}
            <h2>Asphalt Driveway Cost: From Tons to Dollars</h2>
            <p>
              To turn tonnage into a material estimate, enter your supplier&apos;s price per ton in the calculator. The price field is
              optional because prices vary by region, plant, mix type and delivery distance, so this tool does not guess a
              price for you.
            </p>
            <p>
              <strong>Material cost = tons to order × price per ton.</strong> For example, 10.15 tons at $100 per ton is
              $1,015. (The $100 is an example figure only.)
            </p>

            <h3>Asphalt for driveways cost: material vs. installed</h3>
            <p>
              Material is only one part of a paved driveway. A contractor&apos;s quote for the cost to asphalt a driveway usually also
              covers excavation, base stone, grading, compaction equipment, trucking, labor and cleanup. That is why an
              installed price is much higher than tons × price per ton. Get at least three written local quotes and ask what
              base thickness and asphalt thickness each one includes.
            </p>

            <h3>Asphalt overlay cost</h3>
            <p>
              An overlay places a new layer, commonly 1.5 to 2 inches, over existing pavement that is still structurally sound.
              It needs less material than a new driveway and skips the base, so enter the overlay thickness and your area to see
              the tonnage. Cracks and drainage problems in the old surface usually need repair first, and that work adds to the
              price.
            </p>

            {/* Section 8: Pavement Calculator for Driveways, Parking Lots and Paths */}
            <h2>Pavement Calculator for Driveways, Parking Lots and Paths</h2>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: 'var(--space-4)' }}>
              <li style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Driveways:</strong> measure the length and average width. For L-shaped or flared driveways, use{' '}
                <strong>Add section</strong> and enter each part separately.
              </li>
              <li style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Parking lots:</strong> enter the total paved area, or add sections for stalls, drive aisles and curved
                corners. Ask your paver whether different areas get different thickness.
              </li>
              <li style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Roads and paths:</strong> enter length and width. For long jobs, add your truck capacity in the advanced
                options to see roughly how many loads you will need.
              </li>
            </ul>

            {/* Section 9: Tips Before You Order */}
            <h2>Tips Before You Order</h2>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: 'var(--space-4)' }}>
              <li style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Measure twice.</strong> Add 5–10% for an uneven base, edges and spillage. The calculator starts at 5%.
              </li>
              <li style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Ask about minimum loads.</strong> Plants usually sell by the ton and may have minimum load sizes or
                charge extra for partial loads.
              </li>
              <li style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Check the weather window.</strong> Asphalt is commonly laid when the air temperature is above about 50°F
                (10°C) and rising. Your contractor will advise.
              </li>
              <li style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Price the extras separately.</strong> Tack coat, base stone, sealer and labor are not part of this
                tonnage.
              </li>
            </ul>

            {/* Section 10: Frequently Asked Questions (10 FAQs) */}
            <Faq items={copy.faqs} title="Frequently Asked Questions" withSchema={false} />

            {/* Section 11: Related Calculators (Per B8 only live ones) */}
            <h2>Related Calculators</h2>
            {liveRelatedCalculators.length > 0 ? (
              <ul className={styles.relatedList}>
                {liveRelatedCalculators.map((calc, idx) => (
                  <li key={idx}>
                    <Link href={calc.href} className={styles.relatedLink}>
                      {calc.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--ink-2)' }}>
                Additional aggregate and material calculators (including Cubic Yard, Stone, Sand, and Fill Dirt) are currently
                in development. Check back soon for the complete outdoor construction suite.
              </p>
            )}

            {/* Section 12: About These Estimates */}
            <h2>About These Estimates</h2>
            <p>{copy.aboutText}</p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
