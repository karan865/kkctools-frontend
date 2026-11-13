import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Faq from '@/components/ui/Faq';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import AdSlot from '@/components/ads/AdSlot';
import BandNameGenerator from '@/components/tool/band-name-generator/BandNameGenerator';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { ROUTES } from '@/lib/routes';
import { SITE_URL } from '@/config/site';
import { GENRE_SLUGS, getGenreConfig } from '@/content/genres';

export const dynamicParams = false;

export async function generateStaticParams() {
  return GENRE_SLUGS.map((slug) => ({ genre: slug }));
}

interface PageProps {
  params: Promise<{ genre: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { genre } = await params;
  const config = getGenreConfig(genre);
  if (!config) return {};

  const routeDef = ROUTES[config.routeKey];
  return buildMetadata({
    title: routeDef ? routeDef.title : `${config.h1} – Free Name Ideas`,
    description: routeDef ? routeDef.description : config.intro,
    path: `/band-name-generator/${config.slug}/`,
  });
}

export default async function GenrePage({ params }: PageProps) {
  const { genre } = await params;
  const config = getGenreConfig(genre);

  if (!config) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'Tools', path: '/tools/' },
    { name: 'Band Name Generator', path: '/band-name-generator/' },
    { name: config.h1, path: `/band-name-generator/${config.slug}/` },
  ];

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: config.h1,
    url: `${SITE_URL}/band-name-generator/${config.slug}/`,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <main id="main-content">
      <JsonLd data={webAppSchema} />

      {/* Hero Section with Breadcrumbs, Title, and Tool */}
      <Section variant="hero">
        <Container>
          <Breadcrumbs items={breadcrumbItems} />
          <h1 style={{ marginTop: 'var(--space-4)' }}>{config.h1}</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--ink-2)', maxWidth: '780px', lineHeight: 1.6 }}>
            {config.intro}
          </p>

          <div style={{ marginTop: 'var(--space-6)' }}>
            <BandNameGenerator
              initialGenre={config.generatorGenre}
              starterNames={config.curatedExamples.slice(0, 10)}
            />
          </div>
        </Container>
      </Section>

      <AdSlot slotId={`bng-${config.slug}-top`} />

      {/* Hand-written Curated Starter Names (Static HTML) */}
      <Section variant="surface">
        <Container>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>
            Curated {config.h1.replace(' Band Name Generator', '')} Name Ideas
          </h2>
          <p style={{ color: 'var(--ink-2)', marginBottom: 'var(--space-4)' }}>
            Hand-crafted sample titles demonstrating stylistic cadence and thematic formulas for this genre:
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 'var(--space-3)',
            }}
          >
            {config.curatedExamples.map((name) => (
              <Card key={name} style={{ textAlign: 'center', padding: 'var(--space-3)' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink)' }}>{name}</span>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Deep Genre-Specific Content Sections */}
      <Section>
        <Container size="prose">
          <div className="prose">
            {config.sections.map((section) => (
              <div key={section.title} style={{ marginBottom: 'var(--space-7)' }}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            ))}

            {/* Related Generators & Hub-and-Spoke Links */}
            <div style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border)' }}>
              <h2>Related Band Name Generators</h2>
              <p>
                Looking for alternative musical styles or cross-genre fusion? Explore our dedicated generators or return to the main{' '}
                <Link href="/band-name-generator/" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  band name generator
                </Link>{' '}
                to customize all naming styles:
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 'var(--space-4)',
                  margin: 'var(--space-4) 0',
                }}
              >
                {config.siblings.map((sibling) => (
                  <Card key={sibling.slug} hoverable>
                    <h3 style={{ fontSize: '1.125rem', marginTop: 0 }}>
                      <Link href={`/band-name-generator/${sibling.slug}/`}>{sibling.title}</Link>
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--ink-2)', margin: 0 }}>
                      {sibling.description}
                    </p>
                  </Card>
                ))}
              </div>

              <h3 style={{ marginTop: 'var(--space-6)' }}>Educational Music Branding Guides</h3>
              <p>Deepen your naming strategy with our comprehensive guides written for independent musicians:</p>
              <ul>
                {config.guides.map((guide) => (
                  <li key={guide.path} style={{ marginBottom: 'var(--space-2)' }}>
                    <Link href={guide.path} style={{ fontWeight: 600, color: 'var(--accent)' }}>
                      {guide.title}
                    </Link>{' '}
                    — {guide.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <AdSlot slotId={`bng-${config.slug}-bottom`} />

      {/* FAQ Section */}
      <Section variant="surface">
        <Container size="prose">
          <Faq items={config.faq} title={`${config.h1.replace(' Band Name Generator', '')} Naming FAQ`} withSchema={true} />
        </Container>
      </Section>
    </main>
  );
}

