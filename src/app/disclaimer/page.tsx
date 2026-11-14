import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { ROUTES } from '@/lib/routes';
import { SITE_NAME, SITE_URL, OWNER_EMAIL, ORG_ID, WEBSITE_ID } from '@/config/site';

const route = ROUTES.disclaimer;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const BREADCRUMBS = [{ name: 'Disclaimer', path: route.path }];
const updated = new Date(route.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

const webPage = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}${route.path}#webpage`,
  url: `${SITE_URL}${route.path}`,
  name: 'Disclaimer',
  description: route.description,
  isPartOf: { '@id': WEBSITE_ID },
  publisher: { '@id': ORG_ID },
  dateModified: route.updated,
};

export default function DisclaimerPage() {
  return (
    <main id="main-content">
      <JsonLd data={webPage} />
      <Section variant="hero">
        <Container>
          <Breadcrumbs items={BREADCRUMBS} />
          <h1 style={{ marginTop: 'var(--space-4)' }}>Disclaimer</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--ink-2)', maxWidth: '780px', lineHeight: 1.6 }}>
            Last updated: {updated}. What our calculators and guides can and cannot do, and how to use the results safely.
          </p>
        </Container>
      </Section>

      <Section>
        <Container size="prose">
          <div className="prose">
            <h2>1. Planning estimates, not professional advice</h2>
            <p>
              {SITE_NAME} provides free calculators, templates and guides for planning. Every result is an <strong>estimate</strong> based on the
              inputs you enter, the formulas shown on each page and the default values we list there. Results are not engineering, electrical,
              architectural, legal, financial or medical advice, and they are not a quote or a bid.
            </p>
            <p>
              Real projects depend on things a calculator cannot see: site conditions, product data, local building and electrical codes, permits,
              inspections and the skill of the people doing the work. Always check important numbers with a qualified professional and the product
              manufacturer before you buy materials or start work.
            </p>

            <h2>2. Safety-critical work</h2>
            <ul>
              <li>
                <strong>Electrical:</strong> wire sizes, voltage drop and breaker suggestions follow the published tables named on the{' '}
                <Link href="/wire-gauge-calculator/">Wire Gauge Calculator</Link> page, but codes differ by country and edition. Electrical work
                must follow your local code and should be designed or checked by a licensed electrician.
              </li>
              <li>
                <strong>Structural:</strong> footings, slabs, rebar, rafters, framing and retaining walls must follow your plans, a structural
                engineer where required, and your local building code. Our quantity estimates do not size members or check loads.
              </li>
              <li>
                <strong>Working at height and with tools:</strong> roofs, ladders, power tools and heavy materials are dangerous. Follow the safety
                instructions for your equipment and use fall protection.
              </li>
            </ul>

            <h2>3. Prices and cost estimates</h2>
            <p>
              Where a calculator shows a cost, it uses either the prices you enter or a starting value that we explain and cite on that page. Prices
              change and vary by region, supplier and season. Treat cost results as a rough guide and get real quotes.
            </p>

            <h2>4. Accuracy and corrections</h2>
            <p>
              We test our calculators and show the formulas, defaults and sources on every calculator page so you can check the maths. Even so,
              mistakes can happen, and standards and product data change. If you find an error, please email{' '}
              <a href={`mailto:${OWNER_EMAIL}?subject=Correction`}>{OWNER_EMAIL}</a> with the page and the numbers you used, and we will review it.
              We provide the website &ldquo;as is&rdquo; without warranties, as set out in our <Link href="/terms/">Terms of Service</Link>.
            </p>

            <h2>5. Names from the band name generator</h2>
            <p>
              Generated names are produced by combining word lists and patterns. We do not check whether a name is already used or registered. Check
              availability and trademarks yourself before using a name commercially; nothing on this site is legal or trademark advice.
            </p>

            <h2>6. External links</h2>
            <p>
              We link to standards bodies, manufacturers and other references so you can verify our numbers. Those sites are run by others; we are
              not responsible for their content, and a link is not an endorsement.
            </p>

            <h2>7. Advertising and affiliate links</h2>
            <p>
              {SITE_NAME} does not currently show advertising or use affiliate links. If we add advertising in the future (for example Google
              AdSense), ads will be clearly separated from our content, advertisers will have no say over our results, and our{' '}
              <Link href="/privacy-policy/">Privacy Policy</Link> will be updated first. Any affiliate link will be labelled.
            </p>

            <h2>8. No affiliation</h2>
            <p>
              Product, brand and standard names (for example manufacturer names, NEC, ASTM or IEC) are used only to identify the source of a number.
              {` ${SITE_NAME}`} is not affiliated with or endorsed by those companies or organisations.
            </p>

            <h2>9. Contact</h2>
            <p>
              Questions about this disclaimer: <a href={`mailto:${OWNER_EMAIL}`}>{OWNER_EMAIL}</a> or our <Link href="/contact/">contact page</Link>.
            </p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
