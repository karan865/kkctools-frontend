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

export const metadata: Metadata = buildMetadata({
  title: ROUTES.contact.title,
  description: ROUTES.contact.description,
  path: '/contact/',
});

const BREADCRUMBS = [{ name: 'Contact', path: '/contact/' }];

export default function ContactPage() {
  return (
    <main id="main-content">
      <Section variant="hero">
        <Container>
          <Breadcrumbs items={BREADCRUMBS} />
          <h1 style={{ marginTop: 'var(--space-4)' }}>Contact {SITE_NAME}</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--ink-2)', maxWidth: '780px', lineHeight: 1.6 }}>
            Have a question, feedback, bug report, or a suggestion for a new generator? We are always happy to hear from creators and visitors.
          </p>
        </Container>
      </Section>

      <Section>
        <Container size="prose">
          <div className="prose">
            <h2>Get in Touch via Email</h2>
            <p>
              To maintain our strict commitment to zero third-party tracking scripts, we do not use intrusive third-party contact form widgets or external ticketing databases. The fastest, most direct way to reach our team is via direct email:
            </p>

            <Card style={{ margin: 'var(--space-5) 0', padding: 'var(--space-5)' }}>
              <h3 style={{ marginTop: 0 }}>Direct Support & Editorial Inquiries</h3>
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
              We typically review incoming correspondence and respond within 24 to 48 business hours (Monday through Friday). If you are submitting a bug report, including the browser version and device type you were using helps us identify and patch issues quickly.
            </p>

            <h2>Feature & Tool Suggestions</h2>
            <p>
              We are actively expanding our catalog of browser-based utilities. If there is a specific creative naming formula, text converter, or music branding calculator you would like to see added to our platform, please describe your use case in an email. We prioritize tools that can run entirely client-side with zero latency.
            </p>

            <p style={{ marginTop: 'var(--space-6)' }}>
              Looking for our tools in the meantime? Explore our{' '}
              <Link href="/band-name-generator/" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                Band Name Generator
              </Link>{' '}
              or browse the complete directory on our{' '}
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

