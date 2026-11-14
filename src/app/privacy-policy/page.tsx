import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { ROUTES } from '@/lib/routes';
import { SITE_NAME, OWNER_EMAIL } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: ROUTES.privacy.title,
  description: ROUTES.privacy.description,
  path: '/privacy-policy/',
});

const BREADCRUMBS = [{ name: 'Privacy Policy', path: '/privacy-policy/' }];

export default function PrivacyPolicyPage() {
  return (
    <main id="main-content">
      <Section variant="hero">
        <Container>
          <Breadcrumbs items={BREADCRUMBS} />
          <h1 style={{ marginTop: 'var(--space-4)' }}>Privacy Policy</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--ink-2)', maxWidth: '780px', lineHeight: 1.6 }}>
            Last Updated: November 15, 2026. This Privacy Policy outlines how {SITE_NAME} handles user data, respects your privacy, and safeguards your creative inputs.
          </p>
        </Container>
      </Section>

      <Section>
        <Container size="prose">
          <div className="prose">
            <h2>1. Our Fundamental Privacy Commitment</h2>
            <p>
              At {SITE_NAME}, we believe privacy is not an afterthought—it is the foundation of how our software is designed. Our website provides browser-based creative generators, text utilities, and educational guides. We operate on a data minimization standard: what you type into a tool stays in your browser, and the only visitor data we collect is anonymous-by-design usage statistics from Google Analytics, described in section 5.
            </p>

            <h2>2. Client-Side Tool Processing: No Remote Data Collection</h2>
            <p>
              When you use our utilities—such as the <Link href="/band-name-generator/">Band Name Generator</Link>—all algorithm operations, random seed calculations, word insertions, and filter configurations execute strictly within your local browser’s JavaScript environment.
            </p>
            <ul>
              <li><strong>Zero Transmission:</strong> The keywords, letters, or custom inputs you provide are never sent across the internet to our servers or any third-party computing systems.</li>
              <li><strong>Zero Logging:</strong> We do not log, review, index, or store the specific band names, phrases, or queries you generate.</li>
              <li><strong>Offline Capability:</strong> Once loaded, our tools function without requiring ongoing server communication for core generation features.</li>
            </ul>

            <h2>3. Local Device Storage (localStorage)</h2>
            <p>
              Our tools provide convenience features, such as bookmarking favorite generated names or remembering your preferred interface theme (Light or Dark mode). These preferences are stored exclusively on your local device using standard HTML5 web storage (<code>localStorage</code>).
            </p>
            <p>
              This information remains under your direct control inside your browser. We have zero remote access to your saved favorites list. You can clear this saved data at any time by clearing your browser cache and cookies, or by using the clear action inside the tool.
            </p>

            <h2>4. Server Log Information</h2>
            <p>
              Like almost all websites accessible over the internet, the infrastructure providers hosting our static web files (such as Netlify or Cloudflare) automatically record standard technical access logs when your browser requests web assets. These access logs may record:
            </p>
            <ul>
              <li>Your Internet Protocol (IP) address</li>
              <li>Browser type and version (User-Agent)</li>
              <li>Requested URL paths and timestamps</li>
              <li>Referring website addresses</li>
              <li>HTTP response status codes and byte transfers</li>
            </ul>
            <p>
              These server logs are utilized exclusively by our hosting providers for network security diagnostics, mitigating denial-of-service threats, and maintaining overall network reliability. They are not joined with any personal identities.
            </p>

            <h2>5. Analytics (Google Analytics)</h2>
            <p>
              We use Google Analytics 4, loaded through Google Tag Manager, to understand how many people visit, which pages and tools
              are used, and where visitors come from. This helps us decide which calculators to improve and build next.
            </p>
            <ul>
              <li>
                <strong>What is collected:</strong> pages viewed, time on page, approximate location (country or city level), device,
                browser and screen type, the referring website, and interactions such as scrolling or clicking a link.
              </li>
              <li>
                <strong>What is not collected:</strong> the numbers, names and other text you type into our tools. Calculations happen in
                your browser and we do not send tool inputs or results to Google Analytics.
              </li>
              <li>
                <strong>Cookies:</strong> Google Analytics may set first-party cookies named <code>_ga</code> and <code>_ga_*</code> to
                tell visits apart. According to Google, Google Analytics 4 does not log or store IP addresses.
              </li>
              <li>
                <strong>Visitors in the EEA, the UK and Switzerland:</strong> analytics cookies are switched off by default (Google Consent
                Mode). Google may still receive limited, cookieless signals that are used only in aggregate.
              </li>
              <li>
                <strong>Your choices:</strong> you can block or delete cookies in your browser settings, or install the{' '}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer nofollow">
                  Google Analytics opt-out browser add-on
                </a>
                . Learn more in{' '}
                <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer nofollow">
                  How Google uses information from sites that use its services
                </a>
                .
              </li>
            </ul>
            <p>
              Analytics data is kept for the retention period set in our Google Analytics account and is used only to run and improve
              this website. We do not sell it.
            </p>

            <h2>6. Advertising (Not Enabled Yet)</h2>
            <p>
              We do not show advertising today. In the future, to keep the tools free, we may display ads through Google AdSense.{' '}
              <strong>If and when advertising is enabled:</strong>
            </p>
            <ul>
              <li>Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this website or other websites on the internet.</li>
              <li>Google’s use of advertising cookies enables it and its partners to serve ads to our visitors based on their visit to our sites and/or other sites on the Internet.</li>
              <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer nofollow">Google Ads Settings</a> or through the <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer nofollow">Network Advertising Initiative</a>.</li>
              <li>For visitors located in the European Economic Area (EEA) and the United Kingdom (UK), a certified Consent Management Platform (CMP) will be presented to obtain valid consent prior to the storage of advertising cookies.</li>
            </ul>
            <p>We will update this policy before any advertising goes live.</p>

            <h2>7. External Links & Third-Party Services</h2>
            <p>
              Our generators feature availability lookup links that allow you to search for band names on third-party platforms (such as Spotify, YouTube, Bandcamp, and Google). When you click an external link, you leave our website and become subject to the respective privacy policies and terms of service of those third-party platforms. We encourage you to review their privacy practices.
            </p>

            <h2>8. Children’s Online Privacy Protection</h2>
            <p>
              Our website does not knowingly collect or solicit personal information from children under the age of 13. Our utilities are safe for general audiences of all ages, and no account creation or identity verification is ever requested.
            </p>

            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may occasionally update this Privacy Policy to reflect changes in our operational practices, new feature rollouts, or evolving legal requirements. Any modifications will be posted directly to this page with an updated &ldquo;Last Updated&rdquo; timestamp.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have any questions, clarifications, or privacy-related inquiries regarding this policy, please reach out to us at{' '}
              <a href={`mailto:${OWNER_EMAIL}`} style={{ color: 'var(--accent)', fontWeight: 600 }}>
                {OWNER_EMAIL}
              </a>.
            </p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
