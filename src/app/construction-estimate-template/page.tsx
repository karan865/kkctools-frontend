import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Faq from '@/components/ui/Faq';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import ConstructionEstimate from '@/components/tool/construction-estimate/ConstructionEstimate';
import { STARTER_ESTIMATE } from '@/components/tool/construction-estimate/constants';
import { CONSTRUCTION_ESTIMATE_COPY } from '@/content/pages/construction-estimate';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { ROUTES } from '@/lib/routes';
import { SITE_URL } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: ROUTES.constructionEstimateTemplate.title,
  description: ROUTES.constructionEstimateTemplate.description,
  path: ROUTES.constructionEstimateTemplate.path,
});

export default function ConstructionEstimatePage() {
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Free Construction Estimate Template',
    url: `${SITE_URL}/construction-estimate-template/`,
    description:
      'Create professional construction estimates with automatic calculations, tax, markup, and print-to-PDF — all free, no signup required.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any (web browser)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    browserRequirements: 'Requires JavaScript',
  };

  const copy = CONSTRUCTION_ESTIMATE_COPY;

  return (
    <main id="main-content">
      <JsonLd data={webAppSchema} />

      {/* Hero & Interactive Tool Section */}
      <Section style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-7)' }}>
        <Container>
          <Breadcrumbs
            items={[
              { name: 'Tools', path: '/tools/' },
              { name: 'Construction Estimate Template', path: '/construction-estimate-template/' },
            ]}
          />

          <header style={{ marginBottom: 'var(--space-5)', maxWidth: 'var(--prose)' }}>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: 'var(--ink)',
                marginBottom: 'var(--space-3)',
                letterSpacing: '-0.02em',
              }}
            >
              {copy.h1}
            </h1>
            <p
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: 'var(--ink-2)',
                marginBottom: 'var(--space-3)',
              }}
            >
              {copy.subtitle}
            </p>
            <p
              style={{
                fontSize: '0.98rem',
                lineHeight: 1.65,
                color: 'var(--muted)',
              }}
            >
              {copy.introText}
            </p>
          </header>

          {/* Interactive Tool Builder (Above the fold) */}
          <ConstructionEstimate starterEstimate={STARTER_ESTIMATE} />
        </Container>
      </Section>

      {/* Inert AdSlot */}
      <Section style={{ paddingTop: 0, paddingBottom: 'var(--space-5)' }}>
        <Container>
          <AdSlot slotId="ce-top" format="horizontal" />
        </Container>
      </Section>

      {/* Main Educational & Informational Guide Sections */}
      <Section style={{ paddingTop: 0 }}>
        <Container>
          <div style={{ maxWidth: 'var(--prose)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-7)' }}>
            
            {/* Section 1: What is a Construction Estimate? */}
            <article>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  marginBottom: 'var(--space-3)',
                  letterSpacing: '-0.01em',
                }}
              >
                {copy.whatIsSection.heading}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', lineHeight: 1.7, color: 'var(--ink-2)' }}>
                <p>{copy.whatIsSection.p1}</p>
                <p>{copy.whatIsSection.p2}</p>
                <p>{copy.whatIsSection.p3}</p>
              </div>
            </article>

            {/* Section 2: How to Use This Free Estimate Builder */}
            <article>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  marginBottom: 'var(--space-3)',
                  letterSpacing: '-0.01em',
                }}
              >
                {copy.howToUseSection.heading}
              </h2>
              <p style={{ lineHeight: 1.7, color: 'var(--ink-2)', marginBottom: 'var(--space-4)' }}>
                {copy.howToUseSection.intro}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                {copy.howToUseSection.steps.map((step, idx) => (
                  <Card key={idx} style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent)',
                          color: 'var(--accent-ink)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {idx + 1}
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
                        {step.title}
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--ink-2)', margin: 0 }}>
                      {step.description}
                    </p>
                  </Card>
                ))}
              </div>
            </article>

            {/* Section 3: What to Include in a Construction Estimate */}
            <article>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  marginBottom: 'var(--space-3)',
                  letterSpacing: '-0.01em',
                }}
              >
                {copy.whatToIncludeSection.heading}
              </h2>
              <p style={{ lineHeight: 1.7, color: 'var(--ink-2)', marginBottom: 'var(--space-4)' }}>
                {copy.whatToIncludeSection.intro}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {copy.whatToIncludeSection.elements.map((elem, idx) => (
                  <li
                    key={idx}
                    style={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius-s)',
                      padding: 'var(--space-3) var(--space-4)',
                    }}
                  >
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', margin: '0 0 var(--space-1)' }}>
                      ✓ {elem.name}
                    </h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--ink-2)', margin: 0 }}>
                      {elem.details}
                    </p>
                  </li>
                ))}
              </ul>
            </article>

            {/* Section 4: Estimate vs. Quote vs. Bid */}
            <article>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  marginBottom: 'var(--space-3)',
                  letterSpacing: '-0.01em',
                }}
              >
                {copy.comparisonSection.heading}
              </h2>
              <p style={{ lineHeight: 1.7, color: 'var(--ink-2)', marginBottom: 'var(--space-4)' }}>
                {copy.comparisonSection.intro}
              </p>
              <div style={{ overflowX: 'auto', border: '1px solid var(--line)', borderRadius: 'var(--radius-m)', marginBottom: 'var(--space-3)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--surface-2)', borderBottom: '2px solid var(--line)' }}>
                      {copy.comparisonSection.tableHeaders.map((th, idx) => (
                        <th key={idx} scope="col" style={{ padding: '10px 14px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)' }}>
                          {th}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {copy.comparisonSection.rows.map((r, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--line)', backgroundColor: idx % 2 === 0 ? 'var(--surface)' : 'var(--surface-2)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--ink)', fontSize: '0.9rem' }}>
                          {r.factor}
                        </td>
                        <td style={{ padding: '10px 14px', color: 'var(--ink-2)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                          {r.estimate}
                        </td>
                        <td style={{ padding: '10px 14px', color: 'var(--ink-2)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                          {r.quote}
                        </td>
                        <td style={{ padding: '10px 14px', color: 'var(--ink-2)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                          {r.bid}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--muted)' }}>
                {copy.comparisonSection.summary}
              </p>
            </article>

            {/* Mid-content AdSlot */}
            <AdSlot slotId="ce-mid" format="horizontal" />

            {/* Section 5: Tips for Accurate Construction Estimates */}
            <article>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  marginBottom: 'var(--space-3)',
                  letterSpacing: '-0.01em',
                }}
              >
                {copy.tipsSection.heading}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                {copy.tipsSection.tips.map((tip, idx) => (
                  <Card key={idx} style={{ padding: 'var(--space-4)' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 'var(--space-2)' }}>
                      {tip.title}
                    </h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--ink-2)', margin: 0 }}>
                      {tip.body}
                    </p>
                  </Card>
                ))}
              </div>
            </article>

            {/* Section 6: Construction Estimate Template for Excel and Spreadsheets */}
            <article>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  marginBottom: 'var(--space-3)',
                  letterSpacing: '-0.01em',
                }}
              >
                {copy.excelSection.heading}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', lineHeight: 1.7, color: 'var(--ink-2)' }}>
                <p>{copy.excelSection.p1}</p>
                <p>{copy.excelSection.p2}</p>
                <p>{copy.excelSection.p3}</p>
              </div>
            </article>

            {/* Section 7: Types of Construction Estimates */}
            <article>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  marginBottom: 'var(--space-3)',
                  letterSpacing: '-0.01em',
                }}
              >
                {copy.typesSection.heading}
              </h2>
              <p style={{ lineHeight: 1.7, color: 'var(--ink-2)', marginBottom: 'var(--space-4)' }}>
                {copy.typesSection.intro}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {copy.typesSection.typesList.map((t, idx) => (
                  <Card key={idx} style={{ padding: 'var(--space-4)' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 'var(--space-1)' }}>
                      {t.name}
                    </h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--ink-2)', margin: 0 }}>
                      {t.desc}
                    </p>
                  </Card>
                ))}
              </div>
            </article>

            {/* Section 8: FAQ */}
            <article>
              <Faq
                title={copy.faqHeading}
                items={copy.faqItems}
                withSchema={true}
              />
            </article>

            {/* Legal Disclaimer */}
            <div
              style={{
                backgroundColor: 'var(--surface-2)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-s)',
                padding: 'var(--space-4)',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                color: 'var(--muted)',
              }}
            >
              {copy.disclaimerText}
            </div>

            {/* Hub-and-Spoke Internal Links */}
            <section
              style={{
                borderTop: '2px solid var(--line)',
                paddingTop: 'var(--space-6)',
                marginTop: 'var(--space-4)',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                Explore More Free Utilities &amp; Guides
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-3)' }}>
                <Card style={{ padding: 'var(--space-3)' }}>
                  <Link href="/band-name-generator/" style={{ textDecoration: 'none' }}>
                    <span style={{ fontWeight: 700, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                      Band Name Generator →
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      Brainstorm creative musical monikers and group names by sonic style.
                    </span>
                  </Link>
                </Card>

                <Card style={{ padding: 'var(--space-3)' }}>
                  <Link href="/tools/" style={{ textDecoration: 'none' }}>
                    <span style={{ fontWeight: 700, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                      Browse All Online Tools →
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      Explore our complete catalog of private, in-browser utilities.
                    </span>
                  </Link>
                </Card>

                <Card style={{ padding: 'var(--space-3)' }}>
                  <Link href="/guides/" style={{ textDecoration: 'none' }}>
                    <span style={{ fontWeight: 700, color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                      Naming &amp; Business Guides →
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      In-depth educational articles, brainstorming tips, and tutorials.
                    </span>
                  </Link>
                </Card>
              </div>
            </section>

          </div>
        </Container>
      </Section>

      {/* Bottom Inert AdSlot */}
      <Section style={{ paddingTop: 0, paddingBottom: 'var(--space-7)' }}>
        <Container>
          <AdSlot slotId="ce-bottom" format="horizontal" />
        </Container>
      </Section>
    </main>
  );
}

