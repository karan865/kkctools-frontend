import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { ROUTES } from '@/lib/routes';
import { OWNER_EMAIL } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: ROUTES.tools.title,
  description: ROUTES.tools.description,
  path: '/tools/',
});

const BREADCRUMBS = [{ name: 'All Tools', path: '/tools/' }];

export default function ToolsIndexPage() {
  return (
    <main id="main-content">
      <Section variant="hero">
        <Container>
          <Breadcrumbs items={BREADCRUMBS} />
          <h1 style={{ marginTop: 'var(--space-4)' }}>All Free Online Tools & Generators</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--ink-2)', maxWidth: '780px', lineHeight: 1.6 }}>
            Welcome to our central utilities directory. Every tool on our platform is engineered from the ground up to operate strictly inside your web browser. That means zero server-side processing delays, zero data collection on what you enter, and completely unrestricted access without paywalls, subscriptions, or login forms.
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--ink-2)', maxWidth: '780px', marginTop: 'var(--space-2)', lineHeight: 1.6 }}>
            Whether you are a songwriter brainstorming monikers for a new musical project, an indie author naming fictional bands for a novel, or a creator looking for instant naming inspiration, our generators combine authentic stylistic phrasing with instantaneous performance. Explore our published utilities below.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)' }}>
              Category
            </span>
            <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--space-1)' }}>Creative Naming Generators</h2>
            <p style={{ color: 'var(--ink-2)', maxWidth: '680px' }}>
              Specialized algorithmic generators built with custom grammatical patterns, genre-accurate vocabulary pools, and real-time availability search links.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
            {/* Tool #1: Band Name Generator */}
            <Card hoverable>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: '2.25rem' }} role="img" aria-label="Electric guitar">🎸</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.375rem' }}>Band Name Generator</h3>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Music • Branding • Creative Tools</span>
                </div>
              </div>

              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
                Generate original band names across rock, metal, heavy metal, K-pop, boy bands, and random styles. Features customizable starting letters, required keyword injection, local favorite saving, text exports, and instant streaming availability lookups.
              </p>

              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', margin: 'var(--space-4) 0' }}>
                <Link href="/band-name-generator/rock/" style={{ fontSize: '0.8125rem', textDecoration: 'none', background: 'var(--surface-2)', padding: '4px 10px', borderRadius: '4px', color: 'var(--ink)' }}>Rock</Link>
                <Link href="/band-name-generator/metal/" style={{ fontSize: '0.8125rem', textDecoration: 'none', background: 'var(--surface-2)', padding: '4px 10px', borderRadius: '4px', color: 'var(--ink)' }}>Metal</Link>
                <Link href="/band-name-generator/heavy-metal/" style={{ fontSize: '0.8125rem', textDecoration: 'none', background: 'var(--surface-2)', padding: '4px 10px', borderRadius: '4px', color: 'var(--ink)' }}>Heavy Metal</Link>
                <Link href="/band-name-generator/kpop/" style={{ fontSize: '0.8125rem', textDecoration: 'none', background: 'var(--surface-2)', padding: '4px 10px', borderRadius: '4px', color: 'var(--ink)' }}>K-pop</Link>
                <Link href="/band-name-generator/boy-band/" style={{ fontSize: '0.8125rem', textDecoration: 'none', background: 'var(--surface-2)', padding: '4px 10px', borderRadius: '4px', color: 'var(--ink)' }}>Boy Band</Link>
                <Link href="/band-name-generator/random/" style={{ fontSize: '0.8125rem', textDecoration: 'none', background: 'var(--surface-2)', padding: '4px 10px', borderRadius: '4px', color: 'var(--ink)' }}>Random</Link>
              </div>

              <div style={{ marginTop: 'var(--space-4)' }}>
                <Link href="/band-name-generator/">
                  <Button variant="primary">Launch Band Name Generator →</Button>
                </Link>
              </div>
            </Card>

            {/* Tool #2: Construction Estimate Template */}
            <Card hoverable>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: '2.25rem' }} role="img" aria-label="Drafting compass and ruler">📐</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.375rem' }}>Construction Estimate Template</h3>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Business • Contracting • Estimating</span>
                </div>
              </div>

              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
                Build detailed residential and commercial construction estimates with dynamic line-item calculations, material rates, labor hours, tax percentages, and contractor profit markups. Features print-to-PDF formatting, CSV spreadsheet downloads, and private browser storage.
              </p>

              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', margin: 'var(--space-4) 0' }}>
                <span style={{ fontSize: '0.8125rem', background: 'var(--surface-2)', padding: '4px 10px', borderRadius: '4px', color: 'var(--ink)' }}>Materials &amp; Labor</span>
                <span style={{ fontSize: '0.8125rem', background: 'var(--surface-2)', padding: '4px 10px', borderRadius: '4px', color: 'var(--ink)' }}>Tax &amp; Markup</span>
                <span style={{ fontSize: '0.8125rem', background: 'var(--surface-2)', padding: '4px 10px', borderRadius: '4px', color: 'var(--ink)' }}>Print to PDF</span>
                <span style={{ fontSize: '0.8125rem', background: 'var(--surface-2)', padding: '4px 10px', borderRadius: '4px', color: 'var(--ink)' }}>Download CSV</span>
              </div>

              <div style={{ marginTop: 'var(--space-4)' }}>
                <Link href="/construction-estimate-template/">
                  <Button variant="primary">Launch Estimate Builder →</Button>
                </Link>
              </div>
            </Card>
          </div>

          <div style={{ marginTop: 'var(--space-7)', padding: 'var(--space-5)', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
            <h2 style={{ fontSize: '1.25rem', margin: '0 0 var(--space-2) 0' }}>Upcoming Utilities</h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>
              We are actively developing additional lightweight, privacy-focused online tools, including code formatters, text transformations, and data converters. Have a specific tool request that you would like us to build?{' '}
              <a href={`mailto:${OWNER_EMAIL}?subject=Tool%20Suggestion`} style={{ color: 'var(--accent)', fontWeight: 600 }}>
                Suggest a new tool via email
              </a>.
            </p>
          </div>
        </Container>
      </Section>
    </main>
  );
}

