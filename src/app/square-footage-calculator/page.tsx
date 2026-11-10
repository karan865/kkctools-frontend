import { Metadata } from 'next';
import Link from 'next/link';
import SquareFootageCalculator from '@/components/tool/square-footage-calculator/SquareFootageCalculator';
import { squareFootagePageContent } from '@/content/pages/square-footage-calculator';
import Faq from '@/components/ui/Faq';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { SITE_NAME, SITE_URL } from '@/config/site';
import styles from './page.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Square Footage Calculator (SqFt)',
  description:
    'Free sqft calculator to quickly calculate the square footage of any room or house. Supports multiple rooms, odd shapes, waste %, and price per square foot.',
  path: '/square-footage-calculator/',
});

export default function SquareFootageCalculatorPage() {
  const content = squareFootagePageContent;
  const canonicalUrl = `${SITE_URL}/square-footage-calculator/`;

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Square Footage Calculator',
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
      'Free online sqft calculator for single or multiple rooms, odd geometric shapes, waste allowance, unit conversions (sq meters, yards, inches), and material cost estimation.',
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
        name: 'Square Footage Calculator',
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

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
              Square Footage Calculator
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <header className={styles.hero}>
          <div className={styles.badge}>{content.hero.badge}</div>
          <h1 className={styles.title}>{content.hero.title}</h1>
          <p className={styles.description}>{content.hero.description}</p>
        </header>

        {/* Interactive Calculator */}
        <section aria-label="Square Footage Calculator Tool">
          <SquareFootageCalculator />
        </section>

        {/* Ad Slot A */}
        <AdSlot slotId="sqft-calc-top" />

        {/* Long-form Editorial and Educational Content */}
        <div className={styles.contentWrapper}>
          {content.sections.map((section, idx) => (
            <section key={idx} className={styles.section}>
              <h2 className={styles.sectionHeading}>{section.heading}</h2>
              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className={styles.paragraph}>
                  {p}
                </p>
              ))}

              {section.subsections &&
                section.subsections.map((sub, sIdx) => (
                  <div key={sIdx} className={styles.subsection}>
                    <h3 className={styles.subHeading}>{sub.heading}</h3>
                    {sub.paragraphs.map((subP, spIdx) => (
                      <p key={spIdx} className={styles.paragraph}>
                        {subP}
                      </p>
                    ))}
                  </div>
                ))}
            </section>
          ))}

          {/* Quick Area and Unit Conversion Table */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Square Feet Area Conversion Table</h2>
            <p className={styles.paragraph}>
              Reference conversions for standard imperial and metric area units:
            </p>
            <div className={styles.conversionTableWrapper}>
              <table className={styles.conversionTable}>
                <thead>
                  <tr>
                    <th>Unit of Measurement</th>
                    <th>Equivalent in Square Feet (sq ft)</th>
                    <th>Conversion Formula</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>1 Square Foot (sq ft)</strong></td>
                    <td>1.00 sq ft</td>
                    <td>1 ft × 1 ft (144 sq in)</td>
                  </tr>
                  <tr>
                    <td><strong>1 Square Yard (sq yd)</strong></td>
                    <td>9.00 sq ft</td>
                    <td>Sq Yd × 9</td>
                  </tr>
                  <tr>
                    <td><strong>1 Square Meter (m²)</strong></td>
                    <td>10.764 sq ft</td>
                    <td>m² × 10.7639</td>
                  </tr>
                  <tr>
                    <td><strong>144 Square Inches (sq in)</strong></td>
                    <td>1.00 sq ft</td>
                    <td>Sq In ÷ 144</td>
                  </tr>
                  <tr>
                    <td><strong>1 Acre</strong></td>
                    <td>43,560 sq ft</td>
                    <td>Acres × 43,560</td>
                  </tr>
                  <tr>
                    <td><strong>1 Square Mile</strong></td>
                    <td>27,878,400 sq ft</td>
                    <td>Sq Miles × 27,878,400</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Ad Slot B */}
          <AdSlot slotId="sqft-calc-middle" />

          {/* FAQ Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Square Footage Calculator FAQ</h2>
            <Faq items={content.faqs} />
          </section>

          {/* Related Calculators */}
          <section className={styles.relatedSection}>
            <h2 className={styles.sectionHeading}>Related Construction &amp; Material Calculators</h2>
            <div className={styles.relatedList}>
              {content.relatedCalculators.map((calc, cIdx) => (
                <Link key={cIdx} href={calc.href} className={styles.relatedLink}>
                  {calc.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

