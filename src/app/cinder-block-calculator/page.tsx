import { Metadata } from 'next';
import Link from 'next/link';
import CinderBlockCalculator from '@/components/tool/cinder-block-calculator/CinderBlockCalculator';
import { cinderBlockPageContent } from '@/content/pages/cinder-block-calculator';
import Faq from '@/components/ui/Faq';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { SITE_NAME, SITE_URL } from '@/config/site';
import styles from './page.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Cinder Block Calculator (CMU Wall)',
  description:
    'Free cinder block calculator to estimate blocks, mortar bags, and concrete core-fill for any wall. Supports 8x8x16, window deductions, waste %, and costs.',
  path: '/cinder-block-calculator/',
});

export default function CinderBlockCalculatorPage() {
  const content = cinderBlockPageContent;
  const canonicalUrl = `${SITE_URL}/cinder-block-calculator/`;

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Cinder Block Calculator',
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
      'Free online cinder block and CMU wall calculator to estimate blocks, mortar bags, core fill concrete volume, and material costs with door and window cutout deductions.',
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
        name: 'Cinder Block Calculator',
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
              Cinder Block Calculator
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
        <section aria-label="Cinder Block Calculator Tool">
          <CinderBlockCalculator />
        </section>

        {/* Ad Slot A */}
        <AdSlot slotId="cinder-block-top" />

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

          {/* Standard CMU Sizes Table */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Standard CMU Block Dimensions &amp; Specifications Chart</h2>
            <p className={styles.paragraph}>
              Reference specifications for standard Concrete Masonry Units manufactured according to ASTM C90 standards:
            </p>
            <div className={styles.dimensionsTableWrapper}>
              <table className={styles.dimensionsTable}>
                <thead>
                  <tr>
                    <th>Nominal Block Size</th>
                    <th>Actual Manufactured Size</th>
                    <th>Face Area (sq ft)</th>
                    <th>Blocks per 100 sq ft</th>
                    <th>Average Dry Weight</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>4&quot; × 8&quot; × 16&quot; CMU</strong></td>
                    <td>3-5/8&quot; × 7-5/8&quot; × 15-5/8&quot;</td>
                    <td>0.889 sq ft</td>
                    <td>112.5 blocks</td>
                    <td>22 lbs (10 kg)</td>
                  </tr>
                  <tr>
                    <td><strong>6&quot; × 8&quot; × 16&quot; CMU</strong></td>
                    <td>5-5/8&quot; × 7-5/8&quot; × 15-5/8&quot;</td>
                    <td>0.889 sq ft</td>
                    <td>112.5 blocks</td>
                    <td>29 lbs (13 kg)</td>
                  </tr>
                  <tr>
                    <td><strong>8&quot; × 8&quot; × 16&quot; Standard CMU</strong></td>
                    <td>7-5/8&quot; × 7-5/8&quot; × 15-5/8&quot;</td>
                    <td>0.889 sq ft</td>
                    <td>112.5 blocks</td>
                    <td>36 lbs (16 kg)</td>
                  </tr>
                  <tr>
                    <td><strong>10&quot; × 8&quot; × 16&quot; CMU</strong></td>
                    <td>9-5/8&quot; × 7-5/8&quot; × 15-5/8&quot;</td>
                    <td>0.889 sq ft</td>
                    <td>112.5 blocks</td>
                    <td>43 lbs (19.5 kg)</td>
                  </tr>
                  <tr>
                    <td><strong>12&quot; × 8&quot; × 16&quot; Extra Heavy</strong></td>
                    <td>11-5/8&quot; × 7-5/8&quot; × 15-5/8&quot;</td>
                    <td>0.889 sq ft</td>
                    <td>112.5 blocks</td>
                    <td>52 lbs (23.5 kg)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Ad Slot B */}
          <AdSlot slotId="cinder-block-middle" />

          {/* FAQ Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Cinder Block Calculator FAQ</h2>
            <Faq items={content.faqs} />
          </section>

          {/* Related Calculators */}
          <section className={styles.relatedSection}>
            <h2 className={styles.sectionHeading}>Related Masonry &amp; Construction Calculators</h2>
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
