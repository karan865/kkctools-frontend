import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { ROUTES } from '@/lib/routes';

export const metadata: Metadata = buildMetadata({
  title: ROUTES.home.title,
  description: ROUTES.home.description,
  path: '/',
});

export default function Home() {
  return (
    <main id="main-content">
      <Section variant="hero">
        <Container>
          <h1>Free Online Tools That Just Work</h1>
          <p style={{ maxWidth: '640px', fontSize: '1.25rem' }}>
            Fast, browser-based creative tools and generators designed for musicians, artists, and creators. Completely private with zero tracking.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
            <Link href="/band-name-generator/">
              <Button size="lg" variant="primary">
                Try Band Name Generator →
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </main>
  );
}
