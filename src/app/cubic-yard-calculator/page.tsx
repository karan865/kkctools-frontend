import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Faq from '@/components/ui/Faq';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import CubicYardCalculator from '@/components/tool/cubic-yard-calculator/CubicYardCalculator';
import { CUBIC_YARD_PAGE_COPY } from '@/content/pages/cubic-yard-calculator';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { ROUTES } from '@/lib/routes';
import { SITE_URL } from '@/config/site';
import styles from '../asphalt-calculator/page.module.css';

export const metadata: Metadata = buildMetadata({
  title: ROUTES.cubicYardCalculator.title,
  description: ROUTES.cubicYardCalculator.description,
  path: ROUTES.cubicYardCalculator.path,
});

export default function CubicYardCalculatorPage() {
  const canonicalUrl = `${SITE_URL}/cubic-yard-calculator/`;

  // Schema 1: WebApplication
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Cubic Yard Calculator',
    url: canonicalUrl,
    description:
      'Free cubic yard calculator for concrete and other materials. Enter length, width and depth to get cubic yards, concrete bags and weight. Slab, footing, wall and column modes.',
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
        name: 'Cubic Yard Calculator',
        item: canonicalUrl,
      },
    ],
  };

  // Schema 3: FAQPage generated dynamically from CUBIC_YARD_PAGE_COPY.faqs
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: CUBIC_YARD_PAGE_COPY.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  const copy = CUBIC_YARD_PAGE_COPY;

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
              { name: 'Cubic Yard Calculator', path: '/cubic-yard-calculator/' },
            ]}
          />

          <header style={{ marginBottom: 'var(--space-4)', maxWidth: 'var(--prose)' }}>
            <span className={styles.categoryTag}>Materials • Concrete • Volume</span>
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
                marginBottom: 'var(--space-3)',
              }}
            >
              {copy.introText}
            </p>
          </header>

          {/* H2: Cubic Yard and Concrete Volume Calculator (Tool Card) */}
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

          <CubicYardCalculator />

          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 'var(--space-2) 0 var(--space-4)' }}>
            {copy.toolFootnote}
          </p>

          {/* Quick Answer Callout Box for AI Overviews / Featured Snippets */}
          <div
            style={{
              background: 'var(--surface-2)',
              borderLeft: '4px solid var(--accent)',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: '0 var(--radius-s) var(--radius-s) 0',
              marginBottom: 'var(--space-3)',
              fontSize: '0.9375rem',
              color: 'var(--ink)',
            }}
          >
            <strong>Quick answer:</strong> {copy.quickAnswer}
          </div>

          <p style={{ fontSize: '0.9375rem', color: 'var(--ink)', margin: '0 0 var(--space-3)' }}>
            Pouring concrete with several parts — a slab plus footings, post holes or steps? The{' '}
            <Link href="/concrete-calculator/">Concrete Calculator</Link> adds every pour together and shows bag counts and
            ready-mix truck loads in US or metric units.
          </p>

          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--muted)',
              fontStyle: 'italic',
              margin: '0 0 var(--space-5)',
            }}
          >
            {copy.trustLine}
          </p>

          {/* AD SLOT A — directly below tool card */}
          <AdSlot slotId="ad-slot-a-cubicyard" />
        </Container>
      </Section>

      {/* In-depth Editorial Content (Section B6 Verbatim Copy) */}
      <Section style={{ paddingTop: 'var(--space-2)', paddingBottom: 'var(--space-8)' }}>
        <Container>
          <div style={{ maxWidth: 'var(--prose)' }}>
            {/* Section 1: How to Calculate Cubic Yards (Formula and Examples) */}
            <h2>How to Calculate Cubic Yards (Formula and Examples)</h2>
            <p>
              Calculating cubic yards takes three steps: find the volume in cubic feet, divide by 27, then add extra for
              waste. The same method works for concrete, soil, mulch and gravel.
            </p>

            <h3>The cubic yard formula</h3>
            <div className={styles.formulaBox}>
              <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
                <li>Convert every measurement to feet (inches ÷ 12).</li>
                <li><strong>Volume (ft³)</strong> = length × width × depth.</li>
                <li><strong>Cubic yards</strong> = cubic feet ÷ 27.</li>
                <li><strong>Order quantity</strong> = cubic yards × (1 + waste %).</li>
              </ol>
              <p style={{ marginTop: 'var(--space-3)', marginBottom: 0 }}>
                Shortcut for a slab: <strong>cubic yards = length (ft) × width (ft) × thickness (in) ÷ 324.</strong>
              </p>
            </div>

            <h3>Worked example: 10 × 12 ft patio, 4 in thick (how to estimate concrete yards)</h3>
            <div className={styles.exampleBox}>
              <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                <li>Volume: 10 × 12 × (4 ÷ 12) = <strong>40 ft³</strong></li>
                <li>Cubic yards: 40 ÷ 27 = <strong>1.48 yd³</strong></li>
                <li>Add 10% waste: 1.48 × 1.10 = <strong>1.63 yd³</strong> (44 ft³)</li>
                <li>
                  To order: about <strong>1.75 yd³</strong> of ready-mix (rounded up to the next quarter yard), or{' '}
                  <strong>74 bags</strong> of 80 lb mix (44 ÷ 0.60 = 73.3, rounded up)
                </li>
                <li>Weight: about 6,000 lb (3 tons) before waste</li>
              </ul>
            </div>

            <h3>Figuring yards of concrete by shape</h3>
            <p>The formulas below use feet. Convert inches to feet by dividing by 12.</p>

            <div className={styles.tableWrapper}>
              <table className={styles.specTable}>
                <thead>
                  <tr>
                    <th scope="col">Shape</th>
                    <th scope="col">Formula</th>
                    <th scope="col">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {copy.shapeTable.map((row, idx) => (
                    <tr key={idx}>
                      <td><strong>{row.shape}</strong></td>
                      <td><code>{row.formula}</code></td>
                      <td>{row.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Section 2: How Much Is a Yard of Concrete? */}
            <h2>How Much Is a Yard of Concrete?</h2>
            <p>
              A yard of concrete means one cubic yard: a volume of 3 ft × 3 ft × 3 ft, or 27 cubic feet. At the usual density
              of 150 lb/ft³ it weighs about 4,050 lb, a little over 2 tons. You can mix it from roughly 45 bags of 80 lb mix,
              or order it from a ready-mix plant by the yard.
            </p>
            <p>
              People also ask this as a price question. Ready-mix is sold per cubic yard plus delivery, and what you pay
              depends on your region, the mix strength, the season and whether your order counts as a small load. Call two or
              three local suppliers for current prices, or use our [Concrete Slab Cost Calculator] to turn your yards into a
              budget.
            </p>

            <h3>How much does a yard of concrete weigh?</h3>
            <p>
              About 4,050 lb (1,837 kg) for normal-weight concrete at 150 lb/ft³. The exact figure shifts a little with the
              mix design, aggregate and moisture, and reinforcing steel adds more.
            </p>

            <h3>How much is a cubic yard?</h3>
            <p>A cubic yard is a unit of volume. These are the conversions you will use most:</p>

            <div className={styles.tableWrapper}>
              <table className={styles.specTable}>
                <thead>
                  <tr>
                    <th scope="col">1 cubic yard equals</th>
                    <th scope="col">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {copy.conversionTable.map((row, idx) => (
                    <tr key={idx}>
                      <td><strong>{row.unit}</strong></td>
                      <td>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>Going the other way, 1 cubic meter is about 1.308 cubic yards.</p>

            {/* AD SLOT B — after conversion table */}
            <AdSlot slotId="ad-slot-b-cubicyard" />

            {/* Section 3: How Many Bags of Concrete Do I Need? */}
            <h2>How Many Bags of Concrete Do I Need?</h2>
            <p>
              Bagged mix is sold by weight, but the number of bags you need depends on yield, the amount of mixed concrete one
              bag makes. Typical yields are below. Always confirm the yield printed on your bag, because it varies by product.
            </p>

            <div className={styles.tableWrapper}>
              <table className={styles.specTable}>
                <thead>
                  <tr>
                    <th scope="col">Bag size</th>
                    <th scope="col">Typical yield per bag</th>
                    <th scope="col" className={styles.numCell}>Bags per cubic yard</th>
                  </tr>
                </thead>
                <tbody>
                  {copy.bagTable.map((row, idx) => (
                    <tr key={idx}>
                      <td><strong>{row.size}</strong></td>
                      <td>{row.yield}</td>
                      <td className={styles.numCell}>{row.bagsPerYard}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              <strong>Bags needed = cubic feet ÷ yield per bag, rounded up.</strong> Add your waste percentage to the volume
              first. Bags work well for small jobs, but 45 bags per yard is about 3,600 lb of dry mix to lift and mix, which is
              why larger pours usually go to a ready-mix truck.
            </p>

            {/* Section 4: Cubic Yards of Concrete for Common Slab Sizes */}
            <h2>Cubic Yards of Concrete for Common Slab Sizes</h2>
            <p>Planning figures before waste. Add 5–10% when you order.</p>

            <div className={styles.tableWrapper}>
              <table className={styles.specTable}>
                <thead>
                  <tr>
                    <th scope="col">Slab size</th>
                    <th scope="col" className={styles.numCell}>4 in thick</th>
                    <th scope="col" className={styles.numCell}>6 in thick</th>
                  </tr>
                </thead>
                <tbody>
                  {copy.commonSlabTable.map((row, idx) => (
                    <tr key={idx}>
                      <td><strong>{row.size}</strong></td>
                      <td className={styles.numCell}>{row.d4}</td>
                      <td className={styles.numCell}>{row.d6}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              <strong>Rule of thumb:</strong> one cubic yard covers about 108 sq ft at 3 inches thick, 81 sq ft at 4 inches,
              and 54 sq ft at 6 inches. Patios and sidewalks are commonly poured about 4 inches thick, and driveways and
              garage floors about 4–6 inches. Your local code, soil and loads decide the real specification.
            </p>

            {/* Section 5: Concrete Footing Calculator */}
            <h2>Concrete Footing Calculator</h2>
            <p>
              A continuous (strip) footing is a long, narrow box. Choose <strong>Footing / trench</strong>, enter the total run
              as the length, then the footing width and depth. Use <strong>Add section</strong> for separate wall lines or
              footings of different sizes.
            </p>
            <p>
              <strong>Example:</strong> a 100 ft run that is 16 in wide and 8 in deep: 100 × (16 ÷ 12) × (8 ÷ 12) = 88.9 ft³ ={' '}
              <strong>3.29 yd³</strong>, or about <strong>3.6 yd³</strong> with 10% waste.
            </p>
            <p>
              Footing size is not a guess. Width, depth, steel and frost depth depend on your soil, loads and local building
              code, so confirm them with your building department or an engineer before you pour. This tool only turns your
              dimensions into volume.
            </p>
            <p>
              For piers, post holes and tube forms, choose <strong>Column / round hole</strong>. A post hole 10 in across and 30
              in deep holds 1.36 ft³, about 0.05 yd³, or roughly 3 bags of 80 lb mix. The post itself takes up space, so you
              will use a little less.
            </p>

            {/* Section 6: Bags or Ready-Mix? */}
            <h2>Bags or Ready-Mix?</h2>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: 'var(--space-4)' }}>
              <li style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Under about 1 cubic yard:</strong> bagged mix is usually the practical choice.
              </li>
              <li style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Roughly 1 to 5 cubic yards:</strong> compare both. Ready-mix saves labor, but many suppliers charge
                extra for small loads, so ask about minimum orders and short-load fees.
              </li>
              <li style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Over about 5 cubic yards:</strong> ready-mix delivery is usually the practical choice. A full mixer truck
                commonly holds around 8 to 10 cubic yards.
              </li>
            </ul>
            <p>
              Ready-mix is often ordered in quarter-yard steps, so the calculator shows a suggested quantity rounded up to the
              next ¼ yard. Confirm the details with your supplier.
            </p>

            {/* Section 7: Yardage Calculator for Soil, Mulch and Gravel */}
            <h2>Yardage Calculator for Soil, Mulch and Gravel</h2>
            <p>
              The same math gives the yardage for any bulk material. Switch <strong>Material</strong> to <strong>Other</strong>,
              enter your dimensions, and the result is cubic yards with no bag counts. Bulk soil, mulch and gravel are usually
              sold by the cubic yard, but some suppliers sell by the ton, and cubic yards only convert to tons when you know
              the density of that exact material.
            </p>
            <p>For materials with their own calculators, use these:</p>

            {/* Section 8: Tips Before You Order */}
            <h2>Tips Before You Order</h2>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: 'var(--space-4)' }}>
              <li style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Measure twice.</strong> Check thickness in several places, because subgrade is rarely perfectly flat.
              </li>
              <li style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Add 5–10% extra.</strong> The calculator starts at 10% for concrete and 5% for other materials.
              </li>
              <li style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Check the bag label.</strong> Yield differs between products.
              </li>
              <li style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Be ready when the truck arrives.</strong> Have forms, base and helpers in place before delivery,
                because waiting time may cost extra.
              </li>
              <li style={{ marginBottom: 'var(--space-2)' }}>
                <strong>Add every part of the job.</strong> Thickened edges, footings and steps need their own sections.
              </li>
            </ul>

            {/* Section 9: Frequently Asked Questions (10 FAQs) */}
            <Faq items={copy.faqs} title="Frequently Asked Questions" withSchema={false} />

            {/* Section 10: Related Calculators (Per B8) */}
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
                Additional aggregate and material calculators are currently in development.
              </p>
            )}

            {/* Section 11: About These Estimates */}
            <h2>About These Estimates</h2>
            <p>{copy.aboutText}</p>
          </div>
        </Container>
      </Section>
    </main>
  );
}

