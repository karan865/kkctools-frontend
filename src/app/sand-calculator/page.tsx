import { Metadata } from 'next';
import Link from 'next/link';
import SandCalculator from '@/components/tool/sand-calculator/SandCalculator';
import { sandCalculatorPageContent } from '@/content/pages/sand-calculator';
import Faq from '@/components/ui/Faq';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { SITE_NAME, SITE_URL } from '@/config/site';
import styles from './page.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Sand Calculator: Cubic Yards, Tons & Bags',
  description:
    'Free sand calculator & estimator. Get cubic yards, tons and bags of sand for pavers, sandboxes and base layers, with waste % and editable density.',
  path: '/sand-calculator/',
});

export default function SandCalculatorPage() {
  const content = sandCalculatorPageContent;

  const canonicalUrl = `${SITE_URL}/sand-calculator/`;

  // JSON-LD Schemas: WebApplication, BreadcrumbList
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Sand Calculator',
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
      'Calculate cubic yards, tons, and bags of sand needed for general landscaping, sandboxes, paver bedding, and polymeric joint sand with live waste buffers.',
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
        name: 'Sand Calculator',
        item: canonicalUrl,
      },
    ],
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

      <main id="main-content" className={styles.container}>
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <Link href="/tools/">Calculators</Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <span aria-current="page">Sand Calculator</span>
        </nav>

        {/* Hero Section */}
        <header className={styles.header}>
          <span className={styles.badge}>{content.hero.badge}</span>
          <h1 className={styles.title}>{content.hero.title}</h1>
          <p className={styles.description}>{content.hero.description}</p>
        </header>

        {/* Above-the-fold Interactive Tool */}
        <section aria-label="Sand Calculator Tool" className={styles.toolSection}>
          <SandCalculator />
        </section>

        {/* Ad Slot A — Reserved height right below result card */}
        <div className={styles.adSlotWrap}>
          <AdSlot slotId="sand-calc-top" />
        </div>

        {/* Editorial Content Sections */}
        <article className={styles.contentArticle}>
          {/* Section 1: How to use */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[0].heading}</h2>
            {content.sections[0].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
          </section>

          {/* Section 2: Formula & Worked Example */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[1].heading}</h2>
            {content.sections[1].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
            {content.sections[1].subsections?.map((sub, sIdx: number) => (
              <div key={sIdx} className={styles.subBlock}>
                <h3>{sub.heading}</h3>
                {sub.paragraphs.map((p: string, pIdx: number) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            ))}
          </section>

          {/* Section 3: Units / Estimator */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[2].heading}</h2>
            {content.sections[2].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
          </section>

          {/* Section 4: Paver Sand & Polymeric Sand */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[3].heading}</h2>
            {content.sections[3].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
            {content.sections[3].subsections?.map((sub, sIdx: number) => (
              <div key={sIdx} className={styles.subBlock}>
                <h3>{sub.heading}</h3>
                {sub.paragraphs.map((p: string, pIdx: number) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            ))}
          </section>

          {/* Section 5: Weight Table (How Much Does a Yard of Sand Weigh?) */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[4].heading}</h2>
            {content.sections[4].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}

            <div className={styles.tableResponsive}>
              <table className={styles.specTable}>
                <thead>
                  <tr>
                    <th>Sand Condition</th>
                    <th style={{ textAlign: 'right' }}>Weight per Cubic Yard</th>
                    <th style={{ textAlign: 'right' }}>Tons per Cubic Yard</th>
                    <th style={{ textAlign: 'right' }}>Cubic Yards per Ton</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Dry Sand</strong></td>
                    <td style={{ textAlign: 'right' }}>2,600 lb</td>
                    <td style={{ textAlign: 'right' }}>1.30</td>
                    <td style={{ textAlign: 'right' }}>0.77</td>
                  </tr>
                  <tr>
                    <td><strong>Damp Sand</strong></td>
                    <td style={{ textAlign: 'right' }}>2,900 lb</td>
                    <td style={{ textAlign: 'right' }}>1.45</td>
                    <td style={{ textAlign: 'right' }}>0.69</td>
                  </tr>
                  <tr>
                    <td><strong>Wet Sand</strong></td>
                    <td style={{ textAlign: 'right' }}>3,200 lb</td>
                    <td style={{ textAlign: 'right' }}>1.60</td>
                    <td style={{ textAlign: 'right' }}>0.63</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Ad Slot B — Reserved height below Weight Table */}
          <div className={styles.adSlotWrap}>
            <AdSlot slotId="sand-calc-mid" />
          </div>

          {/* Section 6: Sandbox */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[5].heading}</h2>
            {content.sections[5].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
          </section>

          {/* Section 7: Types of Sand */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[6].heading}</h2>
            {content.sections[6].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
          </section>

          {/* Section 8: Tips */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[7].heading}</h2>
            {content.sections[7].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
          </section>

          {/* Section 9: Related Calculators (Only link live pages per spec) */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[8].heading}</h2>
            <ul className={styles.linkList}>
              <li>
                <Link href="/cubic-yard-calculator/">
                  <strong>Cubic Yard Calculator:</strong>
                </Link>{' '}
                Volume for concrete, soil, mulch, gravel and excavation.
              </li>
              <li>
                <Link href="/asphalt-calculator/">
                  <strong>Asphalt Calculator:</strong>
                </Link>{' '}
                Tonnage and area estimator for driveways and paving projects.
              </li>
              <li>
                <Link href="/construction-estimate-template/">
                  <strong>Construction Estimate Template:</strong>
                </Link>{' '}
                Line-item cost builder with printable PDF and CSV invoices.
              </li>
            </ul>
          </section>

          {/* FAQ Section */}
          <section className={styles.sectionBlock}>
            <h2>Sand Calculator FAQ</h2>
            <Faq items={content.faqs} />
          </section>

          {/* Disclaimer & Footer Line */}
          <footer className={styles.disclaimerBlock}>
            <p>
              <strong>Disclaimer:</strong> This calculator provides estimates only. Actual
              quantities depend on sand type, moisture, compaction and supplier bag sizes.
              Confirm amounts with your supplier before ordering. This is not engineering or
              structural advice.
            </p>
            <p className={styles.lastUpdated}>Last updated: November 2026</p>
          </footer>
        </article>
      </main>
    </>
  );
}
