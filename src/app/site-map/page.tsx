import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { INDEXABLE_ROUTES, ROUTES } from '@/lib/routes';
import { CATEGORIES, TOOLS_CATALOG, type CategoryId } from '@/lib/tools-catalog';
import { SITE_URL, ORG_ID, WEBSITE_ID } from '@/config/site';

/** HTML site map: every indexable page, grouped. Built from the route list so it never goes stale. */

const route = ROUTES.siteMap;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const BREADCRUMBS = [{ name: 'Site Map', path: route.path }];
const shortTitle = (t: string) => t.split(/ [–—|:] /)[0];

const categoryOrder = (Object.keys(CATEGORIES) as CategoryId[]).sort((a, b) => CATEGORIES[a].order - CATEGORIES[b].order);
const toolGroups = categoryOrder
  .map((id) => ({ id, name: CATEGORIES[id].name, tools: TOOLS_CATALOG.filter((t) => t.category === id).sort((a, b) => a.name.localeCompare(b.name)) }))
  .filter((g) => g.tools.length > 0);
const genres = INDEXABLE_ROUTES.filter((r) => r.type === 'genre');
const guides = INDEXABLE_ROUTES.filter((r) => r.type === 'guide' || r.type === 'guide-index');
const company = INDEXABLE_ROUTES.filter((r) => r.type === 'trust' || r.type === 'legal' || r.type === 'home' || r.type === 'tool-index');

const webPage = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}${route.path}#webpage`,
  url: `${SITE_URL}${route.path}`,
  name: 'Site Map',
  description: route.description,
  isPartOf: { '@id': WEBSITE_ID },
  publisher: { '@id': ORG_ID },
};

const list: React.CSSProperties = { columns: '2 260px', columnGap: 32, paddingLeft: 20 };

export default function SiteMapPage() {
  return (
    <main id="main-content">
      <JsonLd data={webPage} />
      <Section variant="hero">
        <Container>
          <Breadcrumbs items={BREADCRUMBS} />
          <h1 style={{ marginTop: 'var(--space-4)' }}>Site Map</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--ink-2)', maxWidth: '780px', lineHeight: 1.6 }}>
            Every page on KKC Tools in one place: {TOOLS_CATALOG.length} tools, {guides.length - 1} guides and our company and legal pages.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="prose" style={{ maxWidth: 'none' }}>
            {toolGroups.map((g) => (
              <section key={g.id} aria-labelledby={`sm-${g.id}`}>
                <h2 id={`sm-${g.id}`}>{g.name}</h2>
                <ul style={list}>
                  {g.tools.map((t) => (
                    <li key={t.slug}>
                      <Link href={t.slug}>{t.name}</Link> — {t.description}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {genres.length > 0 && (
              <section aria-labelledby="sm-genres">
                <h2 id="sm-genres">Band name generator by genre</h2>
                <ul style={list}>
                  {genres.map((r) => (
                    <li key={r.path}>
                      <Link href={r.path}>{shortTitle(r.title)}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="sm-guides">
              <h2 id="sm-guides">Guides</h2>
              <ul style={list}>
                {guides.map((r) => (
                  <li key={r.path}>
                    <Link href={r.path}>{shortTitle(r.title)}</Link>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="sm-company">
              <h2 id="sm-company">Company &amp; legal</h2>
              <ul style={list}>
                {company.map((r) => (
                  <li key={r.path}>
                    <Link href={r.path}>{r.path === '/' ? 'Home' : shortTitle(r.title)}</Link>
                  </li>
                ))}
              </ul>
            </section>

            <p>
              Search engines can use the <a href="/sitemap.xml">XML sitemap</a>.
            </p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
