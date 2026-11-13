import { Metadata } from 'next';
import Link from 'next/link';
import LinearFootCalculator from '@/components/tool/linear-foot-calculator/LinearFootCalculator';
import { linearFootPageContent } from '@/content/pages/linear-foot-calculator';
import Faq from '@/components/ui/Faq';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import {
  buildWebApplicationSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from '@/components/seo/buildSchema';
import styles from './page.module.css';
import JsonLd from '@/components/seo/JsonLd';
import HowWeCalculate from '@/components/seo/HowWeCalculate';

export const metadata: Metadata = buildMetadata({
  title: 'Linear Foot Calculator (Sq Ft to Linear Ft)',
  description:
    'Free linear foot calculator. Add up lengths in feet, inches, yards or meters, or convert square feet to linear feet using width. Includes waste % and cost.',
  path: '/linear-foot-calculator/',
});

export default function LinearFootCalculatorPage() {
  const content = linearFootPageContent;

  const webAppSchema = buildWebApplicationSchema({
    name: 'Linear Foot Calculator',
    path: '/linear-foot-calculator/',
    description:
      'Add up multi-piece lengths in feet, inches, yards, and meters, or convert square feet to linear feet with material width, waste allowance, and cost estimation.',
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools/' },
    { name: 'Linear Foot Calculator', path: '/linear-foot-calculator/' },
  ]);

  const faqSchema = buildFaqSchema(content.faqs);

  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <main id="main-content" className={styles.container}>
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <Link href="/tools/">Tools</Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <span aria-current="page">Linear Foot Calculator</span>
        </nav>

        {/* Hero Section */}
        <header className={styles.header}>
          <span className={styles.badge}>{content.hero.badge}</span>
          <h1 className={styles.title}>{content.hero.title}</h1>
          <p className={styles.description}>{content.hero.description}</p>
        </header>

        {/* Above-the-fold Interactive Tool */}
        <section aria-label="Linear Foot Calculator Tool" className={styles.toolSection}>
          <LinearFootCalculator />
        </section>

        {/* Ad Slot A */}
        <div className={styles.adSlotWrap}>
          <AdSlot slotId="linear-foot-top" />
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

          {/* Section 2: What is a linear foot */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[1].heading}</h2>
            {content.sections[1].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
          </section>

          {/* Section 3: How to calculate */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[2].heading}</h2>
            {content.sections[2].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
            {content.sections[2].subsections?.map((sub, sIdx: number) => (
              <div key={sIdx} className={styles.subBlock}>
                <h3>{sub.heading}</h3>
                {sub.paragraphs.map((p: string, pIdx: number) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            ))}
          </section>

          {/* Ad Slot B */}
          <div className={styles.adSlotWrap}>
            <AdSlot slotId="linear-foot-mid" />
          </div>

          {/* Section 4: Square feet to linear feet */}
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

                {/* Render quick conversion table inside Subsection 3 */}
                {sub.heading === 'Quick Conversion Table' && (
                  <div className={styles.tableResponsive}>
                    <table className={styles.specTable}>
                      <thead>
                        <tr>
                          <th>Material Width</th>
                          <th style={{ textAlign: 'right' }}>Sq Ft per Linear Foot</th>
                          <th style={{ textAlign: 'right' }}>Linear Feet per Sq Ft</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>3 in</td>
                          <td style={{ textAlign: 'right' }}>0.25</td>
                          <td style={{ textAlign: 'right' }}>4.00</td>
                        </tr>
                        <tr>
                          <td>4 in</td>
                          <td style={{ textAlign: 'right' }}>0.33</td>
                          <td style={{ textAlign: 'right' }}>3.00</td>
                        </tr>
                        <tr>
                          <td>6 in</td>
                          <td style={{ textAlign: 'right' }}>0.50</td>
                          <td style={{ textAlign: 'right' }}>2.00</td>
                        </tr>
                        <tr>
                          <td>8 in</td>
                          <td style={{ textAlign: 'right' }}>0.67</td>
                          <td style={{ textAlign: 'right' }}>1.50</td>
                        </tr>
                        <tr>
                          <td>12 in (1 ft)</td>
                          <td style={{ textAlign: 'right' }}>1.00</td>
                          <td style={{ textAlign: 'right' }}>1.00</td>
                        </tr>
                        <tr>
                          <td>24 in (2 ft)</td>
                          <td style={{ textAlign: 'right' }}>2.00</td>
                          <td style={{ textAlign: 'right' }}>0.50</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* Section 5: Linear vs square vs board foot */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[4].heading}</h2>
            {content.sections[4].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
          </section>

          {/* Section 6: Tips */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[5].heading}</h2>
            {content.sections[5].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
          </section>

          {/* Section 7: Related calculators */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[6].heading}</h2>
            <ul className={styles.linkList}>
              <li>
                <Link href="/cubic-yard-calculator/">
                  <strong>Cubic Yard Calculator:</strong>
                </Link>{' '}
                Volume for concrete, soil, mulch, gravel and excavation.
              </li>
              <li>
                <Link href="/sand-calculator/">
                  <strong>Sand Calculator:</strong>
                </Link>{' '}
                Yards, tons and bags of sand for pavers, sandboxes and leveling.
              </li>
              <li>
                <Link href="/fill-dirt-calculator/">
                  <strong>Fill Dirt Calculator:</strong>
                </Link>{' '}
                Cubic yards and truckloads for holes, grading and garden beds.
              </li>
              <li>
                <Link href="/construction-estimate-template/">
                  <strong>Construction Estimate Template:</strong>
                </Link>{' '}
                Line-item cost builder with printable PDF and CSV invoices.
              </li>
            </ul>
          </section>

          <HowWeCalculate slug="linear-foot-calculator" />

          {/* FAQ Section */}
          <section className={styles.sectionBlock}>
            <h2>Linear Foot Calculator FAQ</h2>
            <Faq items={content.faqs} title="" withSchema={false} />
          </section>

          {/* Disclaimer & Footer Line */}
          <footer className={styles.disclaimerBlock}>
            <p>
              <strong>Disclaimer:</strong> This calculator provides estimates only. Results depend
              on the measurements you enter, and real projects need an allowance for cuts, joints
              and offcuts. Confirm quantities with your supplier before ordering.
            </p>
            <p className={styles.lastUpdated}>Last updated: November 2026</p>
          </footer>
        </article>
      </main>
    </>
  );
}

