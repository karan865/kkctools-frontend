import { Metadata } from 'next';
import Link from 'next/link';
import FillDirtCalculator from '@/components/tool/fill-dirt-calculator/FillDirtCalculator';
import { fillDirtPageContent } from '@/content/pages/fill-dirt-calculator';
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
  title: 'Fill Dirt Calculator: Cubic Yards & Tons of Dirt',
  description:
    'Free fill dirt calculator. Find how many cubic yards or tons of dirt you need for holes, grading and garden beds, with settling % and truckload estimate.',
  path: '/fill-dirt-calculator/',
});

export default function FillDirtCalculatorPage() {
  const content = fillDirtPageContent;

  const webAppSchema = buildWebApplicationSchema({
    name: 'Fill Dirt Calculator',
    path: '/fill-dirt-calculator/',
    description:
      'Calculate cubic yards, tons, and truckloads of fill dirt or topsoil for holes, grading, lawns, and raised beds with sloped depths and settling buffers.',
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools/' },
    { name: 'Fill Dirt Calculator', path: '/fill-dirt-calculator/' },
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
          <span aria-current="page">Fill Dirt Calculator</span>
        </nav>

        {/* Hero Section */}
        <header className={styles.header}>
          <span className={styles.badge}>{content.hero.badge}</span>
          <h1 className={styles.title}>{content.hero.title}</h1>
          <p className={styles.description}>{content.hero.description}</p>
        </header>

        {/* Interactive Tool Above-the-fold */}
        <section aria-label="Fill Dirt Calculator Tool" className={styles.toolSection}>
          <FillDirtCalculator />
        </section>

        {/* Ad Slot A */}
        <div className={styles.adSlotWrap}>
          <AdSlot slotId="fill-dirt-top" />
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

          {/* Section 3: How to Estimate Dirt Yardage */}
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

          {/* Section 4: Common Projects Table */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[3].heading}</h2>
            <p>{content.sections[3].paragraphs[0]}</p>

            <div className={styles.tableResponsive}>
              <table className={styles.specTable}>
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Size &amp; Depth</th>
                    <th style={{ textAlign: 'right' }}>Dirt Needed</th>
                    <th style={{ textAlign: 'right' }}>With 10% Extra</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Fill a hole</strong></td>
                    <td>4 ft × 4 ft × 1 ft deep</td>
                    <td style={{ textAlign: 'right' }}>0.59 yd³</td>
                    <td style={{ textAlign: 'right' }}>0.65 yd³</td>
                  </tr>
                  <tr>
                    <td><strong>Raised bed</strong></td>
                    <td>8 ft × 4 ft × 12 in deep</td>
                    <td style={{ textAlign: 'right' }}>1.19 yd³</td>
                    <td style={{ textAlign: 'right' }}>1.30 yd³</td>
                  </tr>
                  <tr>
                    <td><strong>Level a yard</strong></td>
                    <td>20 ft × 15 ft × 6 in deep</td>
                    <td style={{ textAlign: 'right' }}>5.56 yd³</td>
                    <td style={{ textAlign: 'right' }}>6.11 yd³</td>
                  </tr>
                  <tr>
                    <td><strong>Raise a lawn area</strong></td>
                    <td>30 ft × 40 ft × 2 in deep</td>
                    <td style={{ textAlign: 'right' }}>7.41 yd³</td>
                    <td style={{ textAlign: 'right' }}>8.15 yd³</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>{content.sections[3].paragraphs[1]}</p>
          </section>

          {/* Ad Slot B */}
          <div className={styles.adSlotWrap}>
            <AdSlot slotId="fill-dirt-mid" />
          </div>

          {/* Section 5: Fill dirt vs topsoil */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[4].heading}</h2>
            {content.sections[4].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
          </section>

          {/* Section 6: Weight */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[5].heading}</h2>
            {content.sections[5].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
          </section>

          {/* Section 7: Settling */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[6].heading}</h2>
            {content.sections[6].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
          </section>

          {/* Section 8: Truckloads */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[7].heading}</h2>
            {content.sections[7].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
          </section>

          {/* Section 9: Related Calculators */}
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
                <Link href="/sand-calculator/">
                  <strong>Sand Calculator:</strong>
                </Link>{' '}
                Yards, tons and bags of sand for pavers, sandboxes and leveling.
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

          <HowWeCalculate slug="fill-dirt-calculator" />

          {/* FAQ Section */}
          <section className={styles.sectionBlock}>
            <h2>Fill Dirt Calculator FAQ</h2>
            <Faq items={content.faqs} title="" withSchema={false} />
          </section>

          {/* Disclaimer & Footer Line */}
          <footer className={styles.disclaimerBlock}>
            <p>
              <strong>Disclaimer:</strong> This calculator provides estimates only. Actual
              quantities depend on soil type, moisture, compaction and how the dirt is delivered
              and placed. Confirm amounts with your supplier before ordering. This is not
              engineering or structural advice.
            </p>
            <p className={styles.lastUpdated}>Last updated: November 2026</p>
          </footer>
        </article>
      </main>
    </>
  );
}

