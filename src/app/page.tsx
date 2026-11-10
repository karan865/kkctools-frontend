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
import styles from './page.module.css';

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
              <div className={styles.heroBadge}>
                <span className={styles.badgeDot}></span>
                <span>100% Free · Client-Side Execution · Zero Tracking</span>
              </div>
              <h1 style={{ letterSpacing: '-0.035em', lineHeight: 1.15 }}>Free Online Tools That Just Work</h1>
              <p style={{ fontSize: '1.25rem', color: 'var(--ink-2)', marginBottom: 'var(--space-4)', lineHeight: 1.6 }}>
                Fast, browser-native utility generators engineered with privacy first. No sign-ups, no monthly subscriptions, and zero remote tracking.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                <div style={{ borderLeft: '3px solid var(--brand-orange)', paddingLeft: 'var(--space-3)', color: 'var(--ink-2)', fontSize: '0.96rem', lineHeight: 1.5 }}>
                  Deliver static and dynamic results at ultra-fast speeds directly in your browser.
                </div>
                <div style={{ borderLeft: '3px solid var(--brand-orange)', paddingLeft: 'var(--space-3)', color: 'var(--ink-2)', fontSize: '0.96rem', lineHeight: 1.5 }}>
                  Pure client-side computation with 0ms server latency and zero data tracking.
                </div>
              </div>

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
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-orange)' }}>
                    ⚡ Instant Live Preview
                  </span>
                  <h2 style={{ fontSize: '1.35rem', margin: '4px 0 0' }}>Quick Band Name Generator</h2>
                </div>
                <BandNameGenerator initialGenre="any" compact={true} />
              </Card>
            </div>
          </div>

          {/* Trust & Performance Proof Strip */}
          <div className={styles.trustStrip}>
            <div className={styles.trustItem}>
              <span className={styles.trustItemIcon}>⚡</span>
              <span>0ms Server Lag</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustItemIcon}>🔒</span>
              <span>100% Private In-Browser</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustItemIcon}>🚫</span>
              <span>No Sign-ups Needed</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustItemIcon}>📄</span>
              <span>Instant PDF &amp; CSV Export</span>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. Tools Section */}
      <Section id="tools">
        <Container>
          <div style={{ maxWidth: '680px', marginBottom: 'var(--space-5)' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)' }}>
              Core Utilities
            </span>
            <h2 style={{ marginTop: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>Featured Online Tools</h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--ink-2)' }}>
              We build focused utilities that solve specific creative and technical challenges without clutter or intrusive bloat.
            </p>
          </div>

          <div className={styles.toolGrid}>
            <Link href="/band-name-generator/" className={styles.toolCard}>
              <span className={styles.badgePopular}>🔥 Popular</span>
              <div className={styles.toolIconBox}>🎸</div>
              <span className={styles.toolCategory}>Music &amp; Creative Branding</span>
              <h3 className={styles.toolTitle}>Band Name Generator</h3>
              <p className={styles.toolDesc}>
                Generate original band names by genre and naming formula. Complete with availability lookup shortcuts, local favorites saving, and text export.
              </p>
              <div className={styles.chipsRow}>
                <span className={styles.chipItem}>Rock</span>
                <span className={styles.chipItem}>Metal</span>
                <span className={styles.chipItem}>K-pop</span>
                <span className={styles.chipItem}>Heavy Metal</span>
              </div>
              <div className={styles.openLink}>
                Launch Band Name Generator <span>→</span>
              </div>
            </Link>

            <Link href="/construction-estimate-template/" className={styles.toolCard}>
              <span className={styles.badgeBusiness}>💼 Business Ready</span>
              <div className={styles.toolIconBox}>📐</div>
              <span className={styles.toolCategory}>Contracting &amp; Estimating</span>
              <h3 className={styles.toolTitle}>Construction Estimate Template</h3>
              <p className={styles.toolDesc}>
                Create professional building and remodeling estimates with automated labor, materials, tax, and markup calculations. Export to PDF and CSV without signup.
              </p>
              <div className={styles.chipsRow}>
                <span className={styles.chipItem}>Residential</span>
                <span className={styles.chipItem}>Commercial</span>
                <span className={styles.chipItem}>Print-to-PDF</span>
                <span className={styles.chipItem}>CSV Export</span>
              </div>
              <div className={styles.openLink}>
                Launch Estimate Builder <span>→</span>
              </div>
            </Link>

            <Link href="/asphalt-calculator/" className={styles.toolCard}>
              <span className={styles.badgeBusiness}>🚜 Materials &amp; Paving</span>
              <div className={styles.toolIconBox}>🏗️</div>
              <span className={styles.toolCategory}>Outdoor &amp; Construction</span>
              <h3 className={styles.toolTitle}>Asphalt Calculator</h3>
              <p className={styles.toolDesc}>
                Calculate asphalt tons, cubic yards, and cost for driveways, parking lots, and paths. Includes millings mode, custom density, and binder estimates.
              </p>
              <div className={styles.chipsRow}>
                <span className={styles.chipItem}>Hot Mix</span>
                <span className={styles.chipItem}>Millings (RAP)</span>
                <span className={styles.chipItem}>Metric &amp; US Tons</span>
                <span className={styles.chipItem}>Cost &amp; Truckloads</span>
              </div>
              <div className={styles.openLink}>
                Launch Asphalt Calculator <span>→</span>
              </div>
            </Link>

            <Link href="/cubic-yard-calculator/" className={styles.toolCard}>
              <span className={styles.badgeBusiness}>📦 Volume &amp; Concrete</span>
              <div className={styles.toolIconBox}>🧱</div>
              <span className={styles.toolCategory}>Materials • Landscaping • Building</span>
              <h3 className={styles.toolTitle}>Cubic Yard Calculator</h3>
              <p className={styles.toolDesc}>
                Calculate cubic yards for concrete slabs, footings, walls, columns, soil, mulch, and gravel. Features multi-section projects and 40–80 lb concrete bag breakdowns.
              </p>
              <div className={styles.chipsRow}>
                <span className={styles.chipItem}>Slab &amp; Patio</span>
                <span className={styles.chipItem}>Footings &amp; Trench</span>
                <span className={styles.chipItem}>Columns &amp; Piers</span>
                <span className={styles.chipItem}>Concrete Bags</span>
              </div>
              <div className={styles.openLink}>
                Launch Cubic Yard Calculator <span>→</span>
              </div>
            </Link>

            <Link href="/sand-calculator/" className={styles.toolCard}>
              <span className={styles.badgeBusiness}>🏖️ Sand &amp; Masonry</span>
              <div className={styles.toolIconBox}>🏖️</div>
              <span className={styles.toolCategory}>Materials • Landscaping • Masonry</span>
              <h3 className={styles.toolTitle}>Sand Calculator</h3>
              <p className={styles.toolDesc}>
                Calculate cubic yards, tons, and bags of sand for paver bedding, polymeric joints, sandboxes, and site fill with editable densities and waste buffers.
              </p>
              <div className={styles.chipsRow}>
                <span className={styles.chipItem}>Sand Volume</span>
                <span className={styles.chipItem}>Paver Bedding</span>
                <span className={styles.chipItem}>Polymeric Sand</span>
                <span className={styles.chipItem}>Sandbox Preset</span>
              </div>
              <div className={styles.openLink}>
                Launch Sand Calculator <span>→</span>
              </div>
            </Link>

            <Link href="/fill-dirt-calculator/" className={styles.toolCard}>
              <span className={styles.badgeBusiness}>🌱 Soil &amp; Grading</span>
              <div className={styles.toolIconBox}>🚜</div>
              <span className={styles.toolCategory}>Materials • Excavation • Grading</span>
              <h3 className={styles.toolTitle}>Fill Dirt Calculator</h3>
              <p className={styles.toolDesc}>
                Calculate cubic yards, tons, and truckloads of fill dirt or topsoil for holes, grading, and lawn leveling with sloped depths and settling buffers.
              </p>
              <div className={styles.chipsRow}>
                <span className={styles.chipItem}>Fill Dirt</span>
                <span className={styles.chipItem}>Topsoil</span>
                <span className={styles.chipItem}>Sloped Depth</span>
                <span className={styles.chipItem}>Truckloads</span>
              </div>
              <div className={styles.openLink}>
                Launch Fill Dirt Calculator <span>→</span>
              </div>
            </Link>

            <Link href="/linear-foot-calculator/" className={styles.toolCard}>
              <span className={styles.badgeBusiness}>📏 Lumber &amp; Finishing</span>
              <div className={styles.toolIconBox}>📐</div>
              <span className={styles.toolCategory}>Construction • Lumber • Finishing</span>
              <h3 className={styles.toolTitle}>Linear Foot Calculator</h3>
              <p className={styles.toolDesc}>
                Add up multiple lengths across feet, inches, yards, and meters, calculate total costs with waste %, and convert between square feet and linear feet using material width.
              </p>
              <div className={styles.chipsRow}>
                <span className={styles.chipItem}>Linear Feet</span>
                <span className={styles.chipItem}>Sq Ft ↔ Linear Ft</span>
                <span className={styles.chipItem}>Mixed Units</span>
                <span className={styles.chipItem}>Cost &amp; Waste</span>
              </div>
              <div className={styles.openLink}>
                Launch Linear Foot Calculator <span>→</span>
              </div>
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-5)', color: 'var(--muted)', fontSize: '0.9375rem' }}>
            More tools are on the way. Have a tool request?{' '}
            <a href={`mailto:${OWNER_EMAIL}?subject=Tool%20Suggestion`} style={{ color: 'var(--accent)', fontWeight: 600 }}>
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
          <div style={{ maxWidth: '680px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-orange)' }}>
              Our Architecture
            </span>
            <h2 style={{ marginTop: 'var(--space-1)' }}>Why Choose Our Tools?</h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--ink-2)' }}>
              Built for creators and professionals who value speed, privacy, and clean software without distraction.
            </p>
          </div>
          <div className={styles.valuePropsGrid}>
            <div className={styles.valuePropCard}>
              <h3 className={styles.valuePropTitle}>🔒 Pure Client-Side Privacy</h3>
              <p className={styles.valuePropText}>
                Nothing you type leaves your device. All name generation logic runs locally inside JavaScript in your browser with zero remote calls.
              </p>
            </div>
            <div className={styles.valuePropCard}>
              <h3 className={styles.valuePropTitle}>⚡ Zero Bloat &amp; Instant Speed</h3>
              <p className={styles.valuePropText}>
                No heavy tracking scripts, no video ads, and no modal pop-ups. Pages load instantaneously and remain lightweight.
              </p>
            </div>
            <div className={styles.valuePropCard}>
              <h3 className={styles.valuePropTitle}>🎨 Curated Craftsmanship</h3>
              <p className={styles.valuePropText}>
                We avoid generic dictionary scrapers. Our word lists, formulas, and estimation algorithms are meticulously engineered.
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
