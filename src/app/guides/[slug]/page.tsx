import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { ROUTES } from '@/lib/routes';
import { SITE_NAME, SITE_URL } from '@/config/site';
import { getAllGuides, getGuideBySlug } from '@/lib/guides';

export const dynamicParams = false;

export async function generateStaticParams() {
  const guides = getAllGuides();
  return guides.map((g) => ({ slug: g.frontmatter.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

const GUIDE_ROUTE_MAP: Record<string, string> = {
  'how-to-choose-a-band-name': 'guideChoose',
  'band-name-ideas-by-genre': 'guideIdeasByGenre',
  'how-to-check-if-a-band-name-is-taken': 'guideCheckTaken',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  const routeKey = GUIDE_ROUTE_MAP[slug];
  const title = (routeKey && ROUTES[routeKey]) ? ROUTES[routeKey].title : guide.frontmatter.title;

  return buildMetadata({
    title,
    description: guide.frontmatter.description,
    path: `/guides/${guide.frontmatter.slug}/`,
  });
}

export default async function GuideArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'Guides', path: '/guides/' },
    { name: guide.frontmatter.title, path: `/guides/${guide.frontmatter.slug}/` },
  ];

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.frontmatter.title,
    description: guide.frontmatter.description,
    datePublished: guide.frontmatter.date,
    dateModified: guide.frontmatter.updated,
    mainEntityOfPage: `${SITE_URL}/guides/${guide.frontmatter.slug}/`,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
  };

  const otherGuides = getAllGuides().filter((g) => g.frontmatter.slug !== guide.frontmatter.slug);

  return (
    <main id="main-content">
      <JsonLd data={articleSchema} />

      <Section variant="hero">
        <Container size="prose">
          <Breadcrumbs items={breadcrumbItems} />
          <h1 style={{ marginTop: 'var(--space-4)', fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>
            {guide.frontmatter.title}
          </h1>
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', marginTop: 'var(--space-3)', color: 'var(--muted)', fontSize: '0.875rem' }}>
            <span>Last Updated: {guide.frontmatter.updated}</span>
            <span>•</span>
            <span>{guide.readingTime}</span>
            <span>•</span>
            <span>By {SITE_NAME} Editorial</span>
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="prose">
          {/* Table of Contents */}
          {guide.toc.length > 0 && (
            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4) var(--space-5)',
                marginBottom: 'var(--space-6)',
              }}
            >
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)' }}>
                Table of Contents
              </span>
              <ul style={{ margin: 'var(--space-2) 0 0', paddingLeft: 'var(--space-4)', lineHeight: 1.8 }}>
                {guide.toc.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} style={{ color: 'var(--ink)', textDecoration: 'none', fontWeight: 500 }}>
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Guide HTML Content */}
          <div className="prose" dangerouslySetInnerHTML={{ __html: guide.html }} />

          {/* Call to Action Card */}
          <div style={{ margin: 'var(--space-8) 0' }}>
            <Card style={{ padding: 'var(--space-6)', background: 'var(--surface-2)', border: '2px solid var(--accent)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: '2rem' }} role="img" aria-label="Music notes">🎵</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Brainstorm Names for Your Project</h3>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Free • Private • Zero Network Calls</span>
                </div>
              </div>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)', lineHeight: 1.6, margin: 'var(--space-2) 0 var(--space-4)' }}>
                Put these naming principles to the test. Generate original, rhythmically balanced band name ideas with custom starting letters, required keywords, and availability lookups.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <Link href="/band-name-generator/">
                  <Button variant="primary">Launch Band Name Generator →</Button>
                </Link>
                <Link href="/band-name-generator/random/">
                  <Button variant="secondary">Try Random Generator</Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Related Guides Section */}
          <div style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border)' }}>
            <h3>Continue Reading: Related Guides</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
              {otherGuides.map((g) => (
                <Card key={g.frontmatter.slug} hoverable>
                  <h4 style={{ margin: '0 0 var(--space-2)', fontSize: '1rem' }}>
                    <Link href={`/guides/${g.frontmatter.slug}/`}>{g.frontmatter.title}</Link>
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--ink-2)', margin: 0, lineHeight: 1.5 }}>
                    {g.frontmatter.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
