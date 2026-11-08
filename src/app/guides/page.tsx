import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { ROUTES } from '@/lib/routes';
import { getAllGuides } from '@/lib/guides';

export const metadata: Metadata = buildMetadata({
  title: ROUTES.guides.title,
  description: ROUTES.guides.description,
  path: '/guides/',
});

const BREADCRUMBS = [{ name: 'Guides', path: '/guides/' }];

export default function GuidesIndexPage() {
  const guides = getAllGuides();

  return (
    <main id="main-content">
      <Section variant="hero">
        <Container>
          <Breadcrumbs items={BREADCRUMBS} />
          <h1 style={{ marginTop: 'var(--space-4)' }}>Band Naming & Music Branding Guides</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--ink-2)', maxWidth: '780px', lineHeight: 1.6 }}>
            Welcome to our comprehensive library of practical, in-depth music branding resources. Choosing an enduring moniker for your musical project requires balancing sonic authenticity, phonetic rhythm, live audience recall, and international legal clearance.
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--ink-2)', maxWidth: '780px', marginTop: 'var(--space-2)', lineHeight: 1.6 }}>
            Our editorial guides are crafted by independent musicians and digital strategists to help you navigate every stage of the branding journey—from brainstorming initial concept lists and analyzing genre-specific linguistic trends to verifying streaming platform exclusivity and conducting preliminary government trademark searches. Explore our published guides below.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
            {guides.map((guide) => (
              <Card key={guide.frontmatter.slug} hoverable>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--muted)', fontWeight: 600 }}>
                    {guide.frontmatter.date}
                  </span>
                  <span style={{ fontSize: '0.8125rem', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent)', fontWeight: 600 }}>
                    {guide.readingTime}
                  </span>
                </div>

                <h2 style={{ fontSize: '1.25rem', margin: 'var(--space-2) 0' }}>
                  <Link href={`/guides/${guide.frontmatter.slug}/`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {guide.frontmatter.title}
                  </Link>
                </h2>

                <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                  {guide.frontmatter.description}
                </p>

                <Link href={`/guides/${guide.frontmatter.slug}/`} style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--accent)', textDecoration: 'none' }}>
                  Read Complete Guide →
                </Link>
              </Card>
            ))}
          </div>

          <div style={{ marginTop: 'var(--space-8)', padding: 'var(--space-6)', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', marginTop: 0 }}>Ready to Generate Band Names?</h2>
            <p style={{ maxWidth: '640px', margin: 'var(--space-2) auto var(--space-4)', color: 'var(--ink-2)' }}>
              Put these naming principles into action. Explore thousands of algorithmic combinations tailored across rock, metal, K-pop, and more using our free browser-based generator.
            </p>
            <Link href="/band-name-generator/" style={{ display: 'inline-block' }}>
              <span style={{ background: 'var(--accent)', color: 'white', padding: '10px 20px', borderRadius: 'var(--radius-sm)', fontWeight: 700, textDecoration: 'none' }}>
                Open Band Name Generator →
              </span>
            </Link>
          </div>
        </Container>
      </Section>
    </main>
  );
}

