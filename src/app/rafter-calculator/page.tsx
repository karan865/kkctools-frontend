import { Metadata } from 'next';
import Link from 'next/link';
import RafterCalculator from '@/components/tool/rafter-calculator/RafterCalculator';
import { rafterPageContent, PITCH_CHART_DATA } from '@/content/pages/rafter-calculator';
import Faq from '@/components/ui/Faq';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import {
  buildWebApplicationSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from '@/components/seo/buildSchema';
import styles from './page.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Rafter Calculator: Length, Pitch & Cut Angles',
  description:
    'Free rafter calculator. Enter span, pitch and overhang to get rafter length, cut angles, ridge height and rafter count. Includes roof pitch chart.',
  path: '/rafter-calculator/',
});

export default function RafterCalculatorPage() {
  const content = rafterPageContent;

  const webAppSchema = buildWebApplicationSchema({
    name: 'Rafter Calculator',
    path: '/rafter-calculator/',
    description:
      'Free online rafter calculator that finds common rafter length, roof pitch, cut angles, birdsmouth depth and rafter count.',
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Calculators', path: '/tools/' },
    { name: 'Rafter Calculator', path: '/rafter-calculator/' },
  ]);

  const faqSchema = buildFaqSchema(content.faqs);

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
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <Link href="/tools/">Calculators</Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <span aria-current="page">Rafter Calculator</span>
        </nav>

        {/* Hero Section */}
        <header className={styles.header}>
          <span className={styles.badge}>{content.hero.badge}</span>
          <h1 className={styles.title}>{content.hero.title}</h1>
          <p className={styles.description}>{content.hero.p1}</p>
          <p className={styles.description} style={{ marginTop: '0.5rem' }}>
            {content.hero.p2}
          </p>
        </header>

        {/* Above-the-fold Interactive Tool */}
        <section aria-label="Rafter Calculator Tool" className={styles.toolSection}>
          <RafterCalculator />
        </section>

        {/* Quick Answer Snippet Box */}
        <aside className={styles.quickAnswerCard} aria-label="Quick Answer Summary">
          <div className={styles.quickAnswerLabel}>Quick Answer</div>
          <div className={styles.quickAnswerText}>{content.quickAnswer}</div>
        </aside>

        {/* Ad Slot A */}
        <div className={styles.adSlotWrap}>
          <AdSlot slotId="rafter-top" />
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

          {/* Section 2: Understanding Results */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[1].heading}</h2>
            {content.sections[1].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
          </section>

          {/* Section 3: Formula & Worked Example */}
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
            <AdSlot slotId="rafter-mid" />
          </div>

          {/* Section 4: Roof Pitch Chart */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[3].heading}</h2>
            {content.sections[3].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}

            <div className={styles.tableResponsive}>
              <table className={styles.specTable}>
                <caption>Roof slope chart: pitch, angle, slope percent and rafter length per 12 in of run</caption>
                <thead>
                  <tr>
                    <th>Pitch</th>
                    <th style={{ textAlign: 'right' }}>Angle (°)</th>
                    <th style={{ textAlign: 'right' }}>Slope (%)</th>
                    <th style={{ textAlign: 'right' }}>Slope Factor</th>
                    <th style={{ textAlign: 'right' }}>Rafter Length per 12″ Run</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {PITCH_CHART_DATA.map((row, rIdx) => {
                    const isHighlight = row.pitch === '4/12' || row.pitch === '6/12';
                    return (
                      <tr key={rIdx} className={isHighlight ? styles.highlightRow : ''}>
                        <td><strong>{row.pitch}</strong></td>
                        <td style={{ textAlign: 'right' }}>{row.angle}</td>
                        <td style={{ textAlign: 'right' }}>{row.slope}</td>
                        <td style={{ textAlign: 'right' }}>{row.slopeFactor}</td>
                        <td style={{ textAlign: 'right' }}>{row.rafterPer12Run}</td>
                        <td>{row.category}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {content.sections[3].subsections?.map((sub, sIdx: number) => (
              <div key={sIdx} className={styles.subBlock}>
                <h3>{sub.heading}</h3>
                {sub.paragraphs.map((p: string, pIdx: number) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            ))}
          </section>

          {/* Section 5: How to calculate roof pitch */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[4].heading}</h2>
            {content.sections[4].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
            {content.sections[4].subsections?.map((sub, sIdx: number) => (
              <div key={sIdx} className={styles.subBlock}>
                <h3>{sub.heading}</h3>
                {sub.paragraphs.map((p: string, pIdx: number) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            ))}
          </section>

          {/* Section 6: Rafter Span & Sizing */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[5].heading}</h2>
            {content.sections[5].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
            {content.sections[5].subsections?.map((sub, sIdx: number) => (
              <div key={sIdx} className={styles.subBlock}>
                <h3>{sub.heading}</h3>
                {sub.paragraphs.map((p: string, pIdx: number) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            ))}
          </section>

          {/* Section 7: How to mark & cut */}
          <section className={styles.sectionBlock}>
            <h2>{content.sections[6].heading}</h2>
            {content.sections[6].paragraphs.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
          </section>

          {/* Section 8: Mistakes to avoid */}
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
              {content.relatedCalculators.map((rc, rIdx) => (
                <li key={rIdx}>
                  <Link href={rc.href}>
                    <strong>{rc.label}:</strong>
                  </Link>{' '}
                  {rc.desc}
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ Section */}
          <section className={styles.sectionBlock}>
            <h2>Rafter Calculator FAQ</h2>
            <Faq items={content.faqs} />
          </section>

          {/* Disclaimer & Footer */}
          <footer className={styles.disclaimerBlock}>
            <p>
              <strong>Disclaimer:</strong> This calculator provides estimates for planning and
              material takeoffs. It does not size rafters or check structural loads, connections,
              snow or wind requirements or local building codes. Always verify dimensions on site
              and confirm your design with your local building department or a licensed
              professional before cutting or building.
            </p>
            <p className={styles.lastUpdated}>Last updated: November 2026</p>
          </footer>
        </article>
      </main>
    </>
  );
}

