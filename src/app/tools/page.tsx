import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ToolsDirectory from '@/components/tools/ToolsDirectory';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { ROUTES } from '@/lib/routes';
import { OWNER_EMAIL } from '@/config/site';
import styles from '../page.module.css';

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
          <div className={styles.heroBadge} style={{ marginTop: 'var(--space-3)' }}>
            <span className={styles.badgeDot}></span>
            <span>Free tools · KKC Tools</span>
          </div>
          <h1 style={{ marginTop: 'var(--space-2)' }}>Practical tools for your website and everyday work.</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--ink-2)', maxWidth: '780px', lineHeight: 1.6 }}>
            Generate creative band names, calculate accurate construction estimates, or export formatted project documents. From KKC Tools. Nothing to install.
          </p>

          <p style={{ fontSize: '1rem', color: 'var(--muted)', maxWidth: '780px', marginTop: 'var(--space-3)', lineHeight: 1.6 }}>
            Every utility on our platform is engineered from the ground up to operate strictly inside your web browser. That means zero server-side processing delays, zero data collection on what you enter, and completely unrestricted access without paywalls, subscriptions, or login forms.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          {/* Interactive Live Search and Filterable Directory */}
          <ToolsDirectory />

          {/* Upcoming Section */}
          <div style={{ marginTop: 'var(--space-8)' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-orange)' }}>
              Roadmap
            </span>
            <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--space-1)' }}>Upcoming Utilities</h2>
            <p style={{ color: 'var(--ink-2)', maxWidth: '680px' }}>
              We are actively developing and vetting additional single-purpose browser utilities. No registration will ever be required.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)', marginTop: 'var(--space-5)' }}>
              <Card>
                <span style={{ fontSize: '1.75rem' }}>🎙️</span>
                <h3 style={{ margin: 'var(--space-2) 0', fontSize: '1.125rem' }}>Podcast Name Generator</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)', lineHeight: 1.5, margin: 0 }}>
                  Curated formulas for interview shows, storytelling podcasts, tech roundups, and comedy audio branding.
                </p>
              </Card>

              <Card>
                <span style={{ fontSize: '1.75rem' }}>🏷️</span>
                <h3 style={{ margin: 'var(--space-2) 0', fontSize: '1.125rem' }}>Brand &amp; Startup Name Generator</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)', lineHeight: 1.5, margin: 0 }}>
                  Modern, punchy, syllable-based naming engine for modern SaaS apps, digital agencies, and e-commerce stores.
                </p>
              </Card>

              <Card>
                <span style={{ fontSize: '1.75rem' }}>📊</span>
                <h3 style={{ margin: 'var(--space-2) 0', fontSize: '1.125rem' }}>Freelance Invoice &amp; Quote Builder</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)', lineHeight: 1.5, margin: 0 }}>
                  Client-side invoice generator with multi-currency support, payment terms, and instant PDF rendering.
                </p>
              </Card>
            </div>
          </div>

          {/* Suggest a tool box */}
          <div style={{ marginTop: 'var(--space-8)' }}>
            <Card style={{ background: 'var(--surface)', borderLeft: '4px solid var(--brand-orange)', padding: 'var(--space-6)' }}>
              <h3 style={{ marginTop: 0, fontSize: '1.25rem' }}>Need a specific browser tool?</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)', maxWidth: '640px', lineHeight: 1.6 }}>
                If you have a calculation, naming convention, or text utility that you use regularly and want a clean, zero-ad browser version for, reach out to our team at{' '}
                <a href={`mailto:${OWNER_EMAIL}?subject=Tool%20Request`} style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  {OWNER_EMAIL}
                </a>.
              </p>
            </Card>
          </div>
        </Container>
      </Section>
    </main>
  );
}
