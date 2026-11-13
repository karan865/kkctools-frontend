import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { ROUTES } from '@/lib/routes';
import { SITE_NAME, SITE_URL, OWNER_NAME, OWNER_EMAIL, ORG_ID, WEBSITE_ID } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: ROUTES.about.title,
  description: ROUTES.about.description,
  path: '/about/',
});

const BREADCRUMBS = [{ name: 'About', path: '/about/' }];

export default function AboutPage() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${SITE_URL}/about/#webpage`,
    url: `${SITE_URL}/about/`,
    name: `About ${SITE_NAME}`,
    inLanguage: 'en-US',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    breadcrumb: { '@id': `${SITE_URL}/about/#breadcrumb` },
  };

  const link = { color: 'var(--accent)', fontWeight: 600 } as const;

  return (
    <main id="main-content">
      <JsonLd data={aboutSchema} />

      <Section variant="hero">
        <Container>
          <Breadcrumbs items={BREADCRUMBS} />
          <h1 style={{ marginTop: 'var(--space-4)' }}>About {SITE_NAME}</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--ink-2)', maxWidth: '780px', lineHeight: 1.6 }}>
            {SITE_NAME} is a free collection of construction and landscaping calculators, plus a few naming
            generators. Every tool runs in your browser, shows how it works, and asks for nothing in return.
          </p>
        </Container>
      </Section>

      <Section>
        <Container size="prose">
          <div className="prose">
            <h2>What you will find here</h2>
            <p>
              Most of the site is <strong>construction and landscaping calculators</strong>: concrete, rebar,
              drywall, brick, cinder block, gravel and stone, sand, paver base, asphalt, fill dirt, compost, studs,
              rafters, paint, tile, laminate, square footage and more. There is also a free{' '}
              <Link href="/construction-estimate-template/" style={link}>construction estimate template</Link> and a{' '}
              <Link href="/band-name-generator/" style={link}>band name generator</Link> with genre pages. The full
              list is on the <Link href="/tools/" style={link}>Tools page</Link>.
            </p>

            <h2>How the calculators work</h2>
            <p>
              Each calculator is a small, tested piece of code that runs on your device. It uses the standard
              geometry for the job (for example length × width × depth for a slab) and a set of default values,
              such as bag yields, material densities, coverage rates and waste allowances. Every calculator page
              explains its formula and the defaults it uses, and most of those defaults can be edited, because your
              supplier’s numbers are always the ones that count.
            </p>
            <p>
              The results are <strong>planning estimates</strong>. They are meant to help you order the right amount
              and compare options, not to replace an engineer, a building inspector or your local code. For structural
              work (footings, retaining walls, rebar, rafters) always follow your plans and local building code.
            </p>

            <h2>How the band name generator works</h2>
            <p>
              The <Link href="/band-name-generator/" style={link}>Band Name Generator</Link> does not use AI or any
              online service. It combines word lists for 9 genres (about 4,000 entries in total) with naming patterns,
              then removes offensive words and names that match a list of 306 well-known bands. It cannot check
              trademarks, so before you commit to a name, follow our guide on{' '}
              <Link href="/guides/how-to-check-if-a-band-name-is-taken/" style={link}>how to check if a band name is taken</Link>.
            </p>

            <h2>Privacy</h2>
            <p>
              Nothing you type into a tool is sent to us or anyone else. There are no accounts, no tracking scripts
              and no third-party widgets. Saved items (such as favourite band names) stay in your own browser’s
              storage. The details are in our <Link href="/privacy-policy/" style={link}>privacy policy</Link>.
            </p>

            <h2>Who runs {SITE_NAME}</h2>
            {/* TODO(owner): replace this paragraph with the real owner / author name, role and relevant
                background (and add matching Person + sameAs schema). Do not invent any of these details. */}
            <p>
              {SITE_NAME} is an independent project run by the {OWNER_NAME}. We build and test every calculator
              ourselves and keep this page up to date as the site grows.
            </p>

            <h2>Found a mistake?</h2>
            <p>
              If a number, formula or default looks wrong for your area or material, please tell us. Email{' '}
              <a href={`mailto:${OWNER_EMAIL}`} style={link}>{OWNER_EMAIL}</a> with the page and what you expected,
              or use the <Link href="/contact/" style={link}>contact page</Link>. We check every report, fix confirmed
              errors, and update the “Last updated” date on the page.
            </p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
