import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { ROUTES } from '@/lib/routes';
import { SITE_NAME, SITE_URL, OWNER_NAME, OWNER_EMAIL } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: ROUTES.about.title,
  description: ROUTES.about.description,
  path: '/about/',
});

const BREADCRUMBS = [{ name: 'About', path: '/about/' }];

export default function AboutPage() {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
  };

  return (
    <main id="main-content">
      <JsonLd data={orgSchema} />

      <Section variant="hero">
        <Container>
          <Breadcrumbs items={BREADCRUMBS} />
          <h1 style={{ marginTop: 'var(--space-4)' }}>About {SITE_NAME}</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--ink-2)', maxWidth: '780px', lineHeight: 1.6 }}>
            Building fast, distraction-free, browser-native tools that respect your privacy and spark creative breakthroughs without subscription walls.
          </p>
        </Container>
      </Section>

      <Section>
        <Container size="prose">
          <div className="prose">
            <h2>Why We Built This Platform</h2>
            <p>
              The modern web is filled with utility websites burdened by bloated JavaScript bundles, intrusive pop-up advertisements, forced account registrations, and hidden monthly subscriptions. Simple creative tasks—such as brainstorming a name for a new band or transforming a string of text—too often require navigating cookie consent mazes and invasive tracking scripts.
            </p>
            <p>
              {SITE_NAME} was founded to offer a refreshing alternative: single-purpose, blazing-fast generators engineered to run entirely inside your web browser. When you use our utilities, your inputs never leave your personal device. We do not maintain server-side databases of your creative ideas, we do not log your search keystrokes, and we never sell your data to marketing third parties.
            </p>

            <h2>Our Core Principles</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)', margin: 'var(--space-5) 0' }}>
              <Card>
                <h3 style={{ marginTop: 0 }}>🔒 Client-Side Execution</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)', margin: 0 }}>
                  Every algorithm and text generator executes 100% locally in your web browser. Zero network requests transmit your inputs to our servers.
                </p>
              </Card>
              <Card>
                <Card>
                  <h3 style={{ marginTop: 0 }}>⚡ Instant Performance</h3>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)', margin: 0 }}>
                    Our static export architecture and lightweight footprint guarantee sub-second load times on both mobile devices and desktop screens.
                  </p>
                </Card>
              </Card>
              <Card>
                <h3 style={{ marginTop: 0 }}>🚫 No Mandatory Accounts</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)', margin: 0 }}>
                  No logins, no password requirements, and no email gates. Every feature is immediately accessible to every visitor.
                </p>
              </Card>
              <Card>
                <h3 style={{ marginTop: 0 }}>🎨 Curated Craftsmanship</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)', margin: 0 }}>
                  We design our algorithmic patterns and vocabulary dictionaries manually to produce authentic, rhythmically pleasing creative results.
                </p>
              </Card>
            </div>

            <h2>How Our Generators Work</h2>
            <p>
              Our flagship utility, the <Link href="/band-name-generator/" style={{ color: 'var(--accent)', fontWeight: 600 }}>Band Name Generator</Link>, demonstrates our engineering philosophy. Rather than querying an unpredictable, slow, remote artificial intelligence API or scraping unvetted dictionary archives, our tool utilizes thousands of hand-curated vocabulary entries organized across nine distinct musical subcultures.
            </p>
            <p>
              When you click Generate, our deterministic pseudorandom engine pairs grammatical templates with weighted semantic categories, filtering results against offensive terms and a database of hundreds of existing famous musical acts. It saves your favorites directly to your device’s browser storage, allowing you to export your shortlisted titles without an internet connection.
            </p>

            <h2>Who We Are</h2>
            <p>
              {SITE_NAME} is developed and maintained by {OWNER_NAME}. We are independent software creators, musicians, and digital minimalists dedicated to building lightweight software that solves real creative challenges.
            </p>
            <p>
              We are constantly refining existing tools and researching new utility categories. If you have questions about our methodologies, encounter any bugs, or want to suggest a new tool, please reach out directly through our{' '}
              <Link href="/contact/" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                Contact page
              </Link>{' '}
              or email us at{' '}
              <a href={`mailto:${OWNER_EMAIL}`} style={{ color: 'var(--accent)', fontWeight: 600 }}>
                {OWNER_EMAIL}
              </a>.
            </p>
          </div>
        </Container>
      </Section>
    </main>
  );
}

