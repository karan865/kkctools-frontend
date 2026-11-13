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
import { OWNER_EMAIL, SITE_NAME } from '@/config/site';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_URL as LD_SITE_URL, WEBSITE_ID as LD_WEBSITE_ID, ORG_ID as LD_ORG_ID } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: ROUTES.contact.title,
  description: ROUTES.contact.description,
  path: '/contact/',
});

const BREADCRUMBS = [{ name: 'Contact', path: '/contact/' }];

export default function ContactPage() {
  return (
    <main id="main-content">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          '@id': `${LD_SITE_URL}/contact/#webpage`,
          url: `${LD_SITE_URL}/contact/`,
          name: ROUTES.contact.title,
          description: ROUTES.contact.description,
          inLanguage: 'en-US',
          isPartOf: { '@id': LD_WEBSITE_ID },
          breadcrumb: { '@id': `${LD_SITE_URL}/contact/#breadcrumb` },
          about: { '@id': LD_ORG_ID },
        }}
      />
      <Section variant="hero">
        <Container>
          <Breadcrumbs items={BREADCRUMBS} />
          <h1 style={{ marginTop: 'var(--space-4)' }}>Contact {SITE_NAME}</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--ink-2)', maxWidth: '780px', lineHeight: 1.6 }}>
            Found a number that looks wrong, hit a bug, or want a calculator we do not have yet? Email us. Every message is read.
          </p>
        </Container>
      </Section>

      <Section>
        <Container size="prose">
          <div className="prose">
            <h2>Get in Touch via Email</h2>
            <p>
              We do not use third-party contact forms or ticket systems (they would add tracking scripts to the site), so email is the way to reach us:
            </p>

            <Card style={{ margin: 'var(--space-5) 0', padding: 'var(--space-5)' }}>
              <h3 style={{ marginTop: 0 }}>Questions, corrections and suggestions</h3>
              <p style={{ fontSize: '1.125rem', margin: 'var(--space-2) 0 var(--space-4)' }}>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${OWNER_EMAIL}`} style={{ color: 'var(--accent)', fontWeight: 700 }}>
                  {OWNER_EMAIL}
                </a>
              </p>
              <a href={`mailto:${OWNER_EMAIL}?subject=Inquiry%20regarding%20${encodeURIComponent(SITE_NAME)}`}>
                <Button variant="primary">Send Us an Email →</Button>
              </a>
            </Card>

            <h2>Expected Response Time</h2>
            <p>
              We read every email and reply as soon as we can. For a bug report, please include the page address, what you entered, what you expected, and your browser and device. For a wrong result, the material, your supplier’s figure, or the standard you are working to helps us check it quickly.
            </p>

            <h2>Feature & Tool Suggestions</h2>
            <p>
              We keep adding construction, landscaping and everyday calculators. If there is one you need, describe the job and the numbers you work with in an email. We build tools that can run entirely in the browser.
            </p>

            <p style={{ marginTop: 'var(--space-6)' }}>
              Looking for a tool in the meantime? Try the{' '}
              <Link href="/concrete-calculator/" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                Concrete Calculator
              </Link>{' '}
              or browse every calculator on our{' '}
              <Link href="/tools/" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                Tools page
              </Link>.
            </p>
          </div>
        </Container>
      </Section>
    </main>
  );
}

