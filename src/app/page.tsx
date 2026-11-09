import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Faq from '@/components/ui/Faq';
import BandNameGenerator from '@/components/tool/band-name-generator/BandNameGenerator';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { ROUTES } from '@/lib/routes';
import { OWNER_EMAIL } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: ROUTES.home.title,
  description: ROUTES.home.description,
  path: '/',
});

const HOME_FAQ_ITEMS = [
  {
    q: 'Are all the tools on this website free to use?',
    a: 'Yes, every tool and generator published on our platform is 100% free with no hidden subscriptions, credit card prompts, or mandatory account creation.',
  },
  {
    q: 'Do these tools send my personal data or entries to a server?',
    a: 'No. All calculations, word combinations, and text transformations execute strictly inside your local web browser. We do not store, inspect, or transmit the words or options you enter.',
  },
  {
    q: 'Can I suggest a new tool or feature?',
    a: 'We welcome suggestions from creators and developers. Feel free to use the contact email in our footer to propose new generator categories, developer utilities, or usability improvements.',
  },
  {
    q: 'Are these tools mobile friendly?',
    a: 'Yes, every generator is engineered to be fully responsive and accessible across modern smartphones, tablets, laptops, and wide-screen desktop displays.',
  },
];

export default function Home() {
  return (
    <main id="main-content">
      {/* 1. Hero Section */}
      <Section variant="hero">
        <Container>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)', alignItems: 'center' }}>
            <div>
              <h1>Free Online Tools That Just Work</h1>
              <p style={{ fontSize: '1.25rem', color: 'var(--ink-2)', marginBottom: 'var(--space-5)' }}>
                Fast, browser-based creative generators built with privacy first. No sign-ups, no pop-ups, and zero network tracking.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <Link href="/band-name-generator/">
                  <Button variant="primary" size="lg">
                    Try the Band Name Generator →
                  </Button>
                </Link>
                <Link href="#tools">
                  <Button variant="secondary" size="lg">
                    Browse All Tools
                  </Button>
                </Link>
              </div>
            </div>

            {/* Compact Live Tool in Hero */}
            <div>
              <Card>
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent)' }}>
                    Live Preview
                  </span>
                  <h2 style={{ fontSize: '1.25rem', margin: '4px 0 0' }}>Quick Band Name Generator</h2>
                </div>
                <BandNameGenerator initialGenre="any" compact={true} />
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. Tools Section */}
      <Section id="tools">
        <Container>
          <h2>Featured Online Tools</h2>
          <p style={{ maxWidth: '640px' }}>
            We build focused utilities that solve specific creative and technical challenges without clutter or intrusive bloat.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-5)', margin: 'var(--space-5) 0' }}>
            <Card hoverable>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: '2rem' }}>🎸</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Band Name Generator</h3>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Music & Creative Branding</span>
                </div>
              </div>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)' }}>
                Generate original band names by genre and naming formula. Complete with availability lookup shortcuts, local favorites saving, and text export.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', margin: 'var(--space-3) 0' }}>
                <Link href="/band-name-generator/rock/" style={{ fontSize: '0.8125rem', textDecoration: 'none', background: 'var(--surface-2)', padding: '4px 8px', borderRadius: '4px' }}>Rock</Link>
                <Link href="/band-name-generator/metal/" style={{ fontSize: '0.8125rem', textDecoration: 'none', background: 'var(--surface-2)', padding: '4px 8px', borderRadius: '4px' }}>Metal</Link>
                <Link href="/band-name-generator/kpop/" style={{ fontSize: '0.8125rem', textDecoration: 'none', background: 'var(--surface-2)', padding: '4px 8px', borderRadius: '4px' }}>K-pop</Link>
                <Link href="/band-name-generator/heavy-metal/" style={{ fontSize: '0.8125rem', textDecoration: 'none', background: 'var(--surface-2)', padding: '4px 8px', borderRadius: '4px' }}>Heavy Metal</Link>
              </div>
              <Link href="/band-name-generator/">
                <Button variant="primary" size="sm">Open Tool →</Button>
              </Link>
            </Card>

            <Card hoverable>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: '2rem' }}>📐</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Construction Estimate Template</h3>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Contracting &amp; Estimating</span>
                </div>
              </div>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)' }}>
                Create professional building and remodeling estimates with automated labor, materials, tax, and markup calculations. Export to PDF and CSV without signup.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', margin: 'var(--space-3) 0' }}>
                <span style={{ fontSize: '0.8125rem', background: 'var(--surface-2)', padding: '4px 8px', borderRadius: '4px' }}>Residential</span>
                <span style={{ fontSize: '0.8125rem', background: 'var(--surface-2)', padding: '4px 8px', borderRadius: '4px' }}>Commercial</span>
                <span style={{ fontSize: '0.8125rem', background: 'var(--surface-2)', padding: '4px 8px', borderRadius: '4px' }}>Print-to-PDF</span>
                <span style={{ fontSize: '0.8125rem', background: 'var(--surface-2)', padding: '4px 8px', borderRadius: '4px' }}>CSV Export</span>
              </div>
              <Link href="/construction-estimate-template/">
                <Button variant="primary" size="sm">Open Tool →</Button>
              </Link>
            </Card>
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-5)', color: 'var(--muted)', fontSize: '0.9375rem' }}>
            More tools are on the way. Have a tool request?{' '}
            <a href={`mailto:${OWNER_EMAIL}?subject=Tool%20Suggestion`} style={{ color: 'var(--accent)' }}>
              Suggest a tool
            </a>.
          </div>
        </Container>
      </Section>

      {/* 3. Popular Genres */}
      <Section variant="surface">
        <Container>
          <h2>Popular Genre Generators</h2>
          <p>Explore specialized word banks engineered for specific music styles:</p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
            <Link href="/band-name-generator/rock/"><Button variant="secondary">🎸 Rock Band Names</Button></Link>
            <Link href="/band-name-generator/metal/"><Button variant="secondary">⚡ Metal Band Names</Button></Link>
            <Link href="/band-name-generator/heavy-metal/"><Button variant="secondary">⚔️ Heavy Metal Names</Button></Link>
            <Link href="/band-name-generator/kpop/"><Button variant="secondary">✨ K-pop Group Names</Button></Link>
            <Link href="/band-name-generator/boy-band/"><Button variant="secondary">🎤 Boy Band Names</Button></Link>
            <Link href="/band-name-generator/random/"><Button variant="secondary">🎲 Random Generator</Button></Link>
          </div>
        </Container>
      </Section>

      {/* 4. How It Works */}
      <Section>
        <Container>
          <h2>How It Works in 3 Simple Steps</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-5)', marginTop: 'var(--space-5)' }}>
            <Card>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)' }}>01</span>
              <h3 style={{ marginTop: 'var(--space-2)' }}>Choose Your Options</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)' }}>
                Pick your target musical genre, select a structural naming formula, or optionally specify starting letters and keywords.
              </p>
            </Card>
            <Card>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)' }}>02</span>
              <h3 style={{ marginTop: 'var(--space-2)' }}>Instant Generation</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)' }}>
                Click Generate or press Enter. Our deterministic engine assembles harmonious, rhythmically balanced titles right in your browser.
              </p>
            </Card>
            <Card>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)' }}>03</span>
              <h3 style={{ marginTop: 'var(--space-2)' }}>Save & Check Availability</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)' }}>
                Bookmark your favorite names to your local device, export them as text, and launch direct searches on Spotify, YouTube, and Google.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 5. Why Use These Tools */}
      <Section variant="surface">
        <Container>
          <h2>Why Choose Our Tools?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-5)', marginTop: 'var(--space-5)' }}>
            <div>
              <h3>🔒 Pure Client-Side Privacy</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)' }}>
                Nothing you type leaves your device. All name generation logic runs locally inside JavaScript in your browser with zero remote calls.
              </p>
            </div>
            <div>
              <h3>⚡ Zero Bloat & Instant Speed</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)' }}>
                No heavy tracking scripts, no video ads, and no modal pop-ups. Pages load instantaneously and remain lightweight.
              </p>
            </div>
            <div>
              <h3>🎨 Curated Quality</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)' }}>
                We avoid generic dictionary scrapers. Our word lists and patterns are meticulously designed for authentic musical cadence.
              </p>
            </div>
            <div>
              <h3>🚫 No Mandatory Accounts</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)' }}>
                No sign-up forms, email gates, or passwords required. Access all features directly without hurdles.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 6. From the Guides */}
      <Section>
        <Container>
          <h2>Educational Band Naming Guides</h2>
          <p>Read our in-depth guides crafted by our editorial team to help you navigate music branding:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
            <Card hoverable>
              <h3><Link href="/guides/how-to-choose-a-band-name/">How to Choose a Band Name</Link></h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)' }}>
                A step-by-step masterclass on brainstorming memorable monikers, testing pronunciation, and checking identity fit.
              </p>
            </Card>
            <Card hoverable>
              <h3><Link href="/guides/band-name-ideas-by-genre/">Band Name Ideas by Genre</Link></h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)' }}>
                Analyze convention patterns across Rock, Metal, K-pop, and Indie to match your band name to your sonic universe.
              </p>
            </Card>
            <Card hoverable>
              <h3><Link href="/guides/how-to-check-if-a-band-name-is-taken/">Check If a Band Name Is Taken</Link></h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)' }}>
                A practical checklist for searching Spotify, Bandcamp, social media handles, domains, and trademark registries.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 7. FAQ */}
      <Section variant="surface">
        <Container size="prose">
          <Faq items={HOME_FAQ_ITEMS} title="Frequently Asked Questions" withSchema={true} />
        </Container>
      </Section>
    </main>
  );
}
