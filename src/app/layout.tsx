import React from 'react';
import type { Metadata } from 'next';
import { Bricolage_Grotesque, Inter } from 'next/font/google';
import './globals.css';
import { SITE_NAME, SITE_URL, SITE_TAGLINE } from '@/config/site';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SkipLink from '@/components/layout/SkipLink';
import JsonLd from '@/components/seo/JsonLd';
import FloatingPill from '@/components/ui/FloatingPill';

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-heading-loaded',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body-loaded',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} – ${SITE_TAGLINE}`,
  },
  description: 'Free online browser-based generators and utilities. Fast, privacy-friendly, zero network calls.',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: {
      'msvalidate.01': 'FA0261B08D394DFD4C117F158B1A04A8',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      description: SITE_TAGLINE,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
  ];

  return (
    <html lang="en" className={`${bricolageGrotesque.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('kkc_theme_pref');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');}else{document.documentElement.removeAttribute('data-theme');if(localStorage.getItem('theme')){localStorage.removeItem('theme');}}}catch(e){}})();`,
          }}
        />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="msvalidate.01" content="FA0261B08D394DFD4C117F158B1A04A8" />
      </head>
      <body>
        <JsonLd data={globalSchema} />
        <SkipLink />
        <Header />
        <div style={{ flex: '1 0 auto' }}>
          {children}
        </div>
        <Footer />
        <FloatingPill />
      </body>
    </html>
  );
}
