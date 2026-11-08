import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Page Not Found – 404',
  description: 'The requested page could not be found. Explore our free band name generators and creative tools.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main id="main-content" style={{ padding: 'var(--space-8) 0', textAlign: 'center' }}>
      <Container size="narrow">
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '4rem',
            fontWeight: 800,
            color: 'var(--accent)',
            display: 'block',
            lineHeight: 1,
            marginBottom: 'var(--space-3)',
          }}
        >
          404
        </span>
        <h1>Page Not Found</h1>
        <p style={{ fontSize: '1.125rem', marginBottom: 'var(--space-6)', color: 'var(--ink-2)' }}>
          We could not find the page you were looking for. It may have been moved or renamed.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/">
            <Button variant="primary">Return Home</Button>
          </Link>
          <Link href="/band-name-generator/">
            <Button variant="secondary">Band Name Generator</Button>
          </Link>
          <Link href="/guides/">
            <Button variant="ghost">Browse Guides</Button>
          </Link>
        </div>
      </Container>
    </main>
  );
}
