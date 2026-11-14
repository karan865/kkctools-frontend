import React from 'react';
import type { Metadata } from 'next';
import { Bricolage_Grotesque, Inter } from 'next/font/google';
import './globals.css';
import { SITE_NAME, SITE_URL, SITE_TAGLINE, SITE_DESCRIPTION, OWNER_EMAIL, ORG_ID, WEBSITE_ID, SITE_LOGO_URL, FOUNDER, FOUNDER_ID } from '@/config/site';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SkipLink from '@/components/layout/SkipLink';
import JsonLd from '@/components/seo/JsonLd';
import FloatingPill from '@/components/ui/FloatingPill';

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-heading-loaded',
  display: 'optional',
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
  description: SITE_DESCRIPTION,
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
  // One sitewide graph. Pages reference these nodes by @id (see normalizeSchema.ts).
  // `founder` is the real owner (supplied 2026-11-15). The Instagram profile is personal, so it sits on the
  // Person node, not on the Organization. TODO(owner): add Organization `sameAs` if the site gets its own profiles.
  const globalSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description: SITE_DESCRIPTION,
        email: OWNER_EMAIL,
        logo: {
          '@type': 'ImageObject',
          '@id': `${SITE_URL}/#logo`,
          url: SITE_LOGO_URL,
          contentUrl: SITE_LOGO_URL,
          width: 512,
          height: 512,
          caption: SITE_NAME,
        },
        image: { '@id': `${SITE_URL}/#logo` },
        founder: { '@id': FOUNDER_ID },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: OWNER_EMAIL,
          url: `${SITE_URL}/contact/`,
          availableLanguage: 'English',
        },
      },
      {
        '@type': 'Person',
        '@id': FOUNDER_ID,
        name: FOUNDER.name,
        jobTitle: FOUNDER.role,
        hasOccupation: { '@type': 'Occupation', name: FOUNDER.qualification },
        description: `${FOUNDER.qualification}; ${FOUNDER.role.toLowerCase()} of ${SITE_NAME}.`,
        url: `${SITE_URL}/about/`,
        email: FOUNDER.email,
        sameAs: [FOUNDER.instagram],
        worksFor: { '@id': ORG_ID },
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: SITE_NAME,
        alternateName: 'KKCTools',
        url: `${SITE_URL}/`,
        description: SITE_TAGLINE,
        inLanguage: 'en-US',
        publisher: { '@id': ORG_ID },
      },
    ],
  };


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
        <style
          dangerouslySetInnerHTML={{
            __html: `
              [data-netlify-drawer], [id^="netlify-"], [class*="netlify-badge"], [id*="netlify-badge"], netlify-drawer, iframe[src*="netlify.com"], a[href*="netlify.com"][style*="fixed"] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
                width: 0 !important;
                height: 0 !important;
              }
            `,
          }}
        />
      </head>
      <body>
        <JsonLd data={globalSchema} raw />
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
