import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import HomeHero from '@/components/home/HomeHero';
import TrustStrip from '@/components/home/TrustStrip';
import SectionHeader from '@/components/home/SectionHeader';
import ToolCard from '@/components/home/ToolCard';
import AdPlaceholder from '@/components/home/AdPlaceholder';
import WhyUs from '@/components/home/WhyUs';
import SuggestBanner from '@/components/home/SuggestBanner';
import Faq from '@/components/ui/Faq';
import { buildMetadata } from '@/components/seo/buildMetadata';
import {
  CATEGORIES,
  TOOLS_CATALOG,
  getToolsByCategory,
  getNewAndUpdatedTools,
} from '@/lib/tools-catalog';
import styles from './page.module.css';
import JsonLd from '@/components/seo/JsonLd';
import { ROUTES } from '@/lib/routes';
import { SITE_URL as LD_SITE_URL, WEBSITE_ID as LD_WEBSITE_ID, ORG_ID as LD_ORG_ID } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: 'KKC Tools – Free Construction Calculators & Online Tools',
  absoluteTitle: true,
  description:
    'Free calculators for concrete, gravel, lumber, roofing, flooring and paint, plus creative tools. No sign-up — everything runs in your browser.',
  path: '/',
});

const HOME_FAQ_ITEMS = [
  {
    q: 'Are all the tools and calculators on KKC Tools free to use?',
    a: 'Yes, 100% free with no hidden subscriptions, paywalls, credit card requirements, or forced account creation. All calculators are unrestricted for trade pros, contractors, and DIY homeowners.',
  },
  {
    q: 'Do these tools store or send my dimensions and project entries anywhere?',
    a: 'No. All calculations, unit conversions, and estimate math execute strictly inside your local web browser using client-side JavaScript. We do not store, inspect, or transmit your numbers or project data.',
  },
  {
    q: 'Can I use these calculators on a phone at the jobsite?',
    a: 'Yes. Every tool is optimized for mobile touchscreens with 16px inputs, rapid calculations, and zero heavy dependencies, ensuring instant performance on construction sites even with weak data connections.',
  },
  {
    q: 'How accurate are the material quantities and bag counts?',
    a: 'Each calculator shows the formula and the default values it uses (for example bag yields for 40, 60 and 80 lb concrete bags, or material densities), and you can edit densities, compaction and waste percentages to match your supplier. Results are planning estimates: confirm final quantities with your supplier or contractor before you order.',
  },
  {
    q: 'Can I suggest a new calculator or contractor tool?',
    a: 'Absolutely! Use the Suggest a Tool button or email kkchub1@gmail.com to propose new construction trades, formulas, or material calculators.',
  },
];

export default function Home() {
  const newAndUpdated = getNewAndUpdatedTools();
  const concreteTools = getToolsByCategory('concrete');
  const gravelTools = getToolsByCategory('gravel');
  const earthworkTools = getToolsByCategory('earthwork');
  const framingTools = getToolsByCategory('framing');
  const finishesTools = getToolsByCategory('finishes');
  const businessTools = getToolsByCategory('business');

  return (
    <main id="main-content" className={styles.mainWrapper}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${LD_SITE_URL}/#webpage`,
          url: `${LD_SITE_URL}/`,
          name: ROUTES.home.title,
          description: ROUTES.home.description,
          inLanguage: 'en-US',
          isPartOf: { '@id': LD_WEBSITE_ID },
          about: { '@id': LD_ORG_ID },
        }}
      />
      {/* 1. Hero Banner with Instant LCP Headline & Unified Search */}
      <HomeHero />

      {/* 2. Trust Strip */}
      <TrustStrip />

      {/* 3. New & Updated Tools Section (No duplicate static cards) */}
      <section className={styles.sectionCanvas}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow="NEW &amp; UPDATED"
            categoryHue="concrete"
            title="Recently Built &amp; Updated Tools"
            subtitle="Fresh calculators and major feature upgrades engineered for fast jobsite math."
            viewAllLink="/tools/"
            viewAllText={`Explore all ${TOOLS_CATALOG.length} tools →`}
          />
          <div className={styles.cardGrid}>
            {newAndUpdated.map((tool) => (
              <ToolCard
                key={tool.slug}
                slug={tool.slug}
                name={tool.name}
                category={tool.category}
                description={tool.description}
                tags={tool.tags}
                icon={tool.icon}
                isNew={tool.isNew}
                isUpdated={tool.isUpdated}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Category Sections — Exactly 4 Cards Each */}

      {/* Category 1: Concrete & Masonry */}
      <section id="concrete" className={styles.sectionBand}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow={CATEGORIES.concrete.name}
            categoryHue="concrete"
            title={CATEGORIES.concrete.headline}
            subtitle={CATEGORIES.concrete.blurb}
            viewAllLink="/tools/#concrete"
            viewAllText="View concrete tools →"
          />
          <div className={styles.cardGrid}>
            {concreteTools.slice(0, 4).map((tool) => (
              <ToolCard
                key={tool.slug}
                slug={tool.slug}
                name={tool.name}
                category={tool.category}
                description={tool.description}
                tags={tool.tags}
                icon={tool.icon}
                isNew={tool.isNew}
                isUpdated={tool.isUpdated}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Category 2: Gravel, Sand & Pavers */}
      <section id="gravel" className={styles.sectionCanvas}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow={CATEGORIES.gravel.name}
            categoryHue="gravel"
            title={CATEGORIES.gravel.headline}
            subtitle={CATEGORIES.gravel.blurb}
            viewAllLink="/tools/#gravel"
            viewAllText="View gravel &amp; sand tools →"
          />
          <div className={styles.cardGrid}>
            {gravelTools.slice(0, 4).map((tool) => (
              <ToolCard
                key={tool.slug}
                slug={tool.slug}
                name={tool.name}
                category={tool.category}
                description={tool.description}
                tags={tool.tags}
                icon={tool.icon}
                isNew={tool.isNew}
                isUpdated={tool.isUpdated}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pre-reserved AdSlot to Prevent Future Cumulative Layout Shift (CLS) */}
      <AdPlaceholder slotName="home-between-categories" />

      {/* Category 3: Earthwork & Paving */}
      <section id="earthwork" className={styles.sectionBand}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow={CATEGORIES.earthwork.name}
            categoryHue="earthwork"
            title={CATEGORIES.earthwork.headline}
            subtitle={CATEGORIES.earthwork.blurb}
            viewAllLink="/tools/#earthwork"
            viewAllText="View paving tools →"
          />
          <div className={styles.cardGrid}>
            {earthworkTools.slice(0, 4).map((tool) => (
              <ToolCard
                key={tool.slug}
                slug={tool.slug}
                name={tool.name}
                category={tool.category}
                description={tool.description}
                tags={tool.tags}
                icon={tool.icon}
                isNew={tool.isNew}
                isUpdated={tool.isUpdated}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Category 4: Framing, Roofing & Measuring */}
      <section id="framing" className={styles.sectionCanvas}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow={CATEGORIES.framing.name}
            categoryHue="framing"
            title={CATEGORIES.framing.headline}
            subtitle={CATEGORIES.framing.blurb}
            viewAllLink="/tools/#framing"
            viewAllText="View framing tools →"
          />
          <div className={styles.cardGrid}>
            {framingTools.slice(0, 4).map((tool) => (
              <ToolCard
                key={tool.slug}
                slug={tool.slug}
                name={tool.name}
                category={tool.category}
                description={tool.description}
                tags={tool.tags}
                icon={tool.icon}
                isNew={tool.isNew}
                isUpdated={tool.isUpdated}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Category 5: Floors, Paint & Stain */}
      <section id="finishes" className={styles.sectionBand}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow={CATEGORIES.finishes.name}
            categoryHue="finishes"
            title={CATEGORIES.finishes.headline}
            subtitle={CATEGORIES.finishes.blurb}
            viewAllLink="/tools/#finishes"
            viewAllText="View finish tools →"
          />
          <div className={styles.cardGrid}>
            {finishesTools.slice(0, 4).map((tool) => (
              <ToolCard
                key={tool.slug}
                slug={tool.slug}
                name={tool.name}
                category={tool.category}
                description={tool.description}
                tags={tool.tags}
                icon={tool.icon}
                isNew={tool.isNew}
                isUpdated={tool.isUpdated}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Category 6: Business & Creative (4 Cards Grid) */}
      <section id="business" className={styles.sectionCanvas}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow={CATEGORIES.business.name}
            categoryHue="business"
            title={CATEGORIES.business.headline}
            subtitle={CATEGORIES.business.blurb}
            viewAllLink="/tools/#business"
            viewAllText="View all directory →"
          />
          <div className={styles.cardGrid}>
            {/* 1. Construction Estimate Template */}
            <ToolCard
              slug={businessTools[0].slug}
              name={businessTools[0].name}
              category={businessTools[0].category}
              description={businessTools[0].description}
              tags={businessTools[0].tags}
              icon={businessTools[0].icon}
            />

            {/* 2. Band Name Generator */}
            <ToolCard
              slug={businessTools[1].slug}
              name={businessTools[1].name}
              category={businessTools[1].category}
              description={businessTools[1].description}
              tags={businessTools[1].tags}
              icon={businessTools[1].icon}
            />

            {/* 3. Browse All Tools Directory Card (4th Card Fix) */}
            <ToolCard
              slug="/tools/"
              name="Browse All Tools"
              category="business"
              description="Explore the complete directory of 22 calculators, converters and creative utilities."
              tags={['Directory', 'All Tools']}
              icon="gridSearch"
            />

            {/* 4. Suggest a Tool Card */}
            <ToolCard
              slug=""
              name="Suggest a Calculator"
              category="business"
              description="Need another calculator for your trade? Tell us what formula or tool to build next."
              icon="plus"
              variant="suggest"
            />
          </div>
        </div>
      </section>

      {/* 5. Why KKC Tools (Replaces redundant 3-step How It Works) */}
      <WhyUs />

      {/* 6. Guides & Knowledge Strip */}
      <section className={styles.sectionCanvas}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow="KNOWLEDGE &amp; GUIDES"
            title="Band Naming Guides"
            subtitle="Step-by-step guides for naming a band and checking that a name is free. Each calculator page also explains its own formula."
            viewAllLink="/guides/"
            viewAllText="Read all guides →"
          />
          <div className={styles.guidesGrid}>
            <Link href="/guides/how-to-choose-a-band-name/" className={styles.guideCard}>
              <div className={styles.guideCover}>
                <span className={styles.guideBadge}>Naming Guide</span>
              </div>
              <h3 className={styles.guideTitle}>How to Choose a Band Name That Sticks</h3>
              <p className={styles.guideExcerpt}>
                Strategic naming principles, trademark safety, genre alignment, and phonetics for modern musicians.
              </p>
              <span className={styles.guideLink}>Read article →</span>
            </Link>

            <Link href="/guides/band-name-ideas-by-genre/" className={styles.guideCard}>
              <div className={styles.guideCover}>
                <span className={styles.guideBadge}>Trends</span>
              </div>
              <h3 className={styles.guideTitle}>Genre-Specific Naming Trends</h3>
              <p className={styles.guideExcerpt}>
                From indie dream-pop to death metal: patterns, archetypes, and linguistic styling across genres.
              </p>
              <span className={styles.guideLink}>Read article →</span>
            </Link>

            <Link href="/guides/how-to-check-if-a-band-name-is-taken/" className={styles.guideCard}>
              <div className={styles.guideCover}>
                <span className={styles.guideBadge}>Legal &amp; IP</span>
              </div>
              <h3 className={styles.guideTitle}>Trademark &amp; Social Handle Checklist</h3>
              <p className={styles.guideExcerpt}>
                Avoid disputes before printing merch or registering domains. A straightforward trademark guide.
              </p>
              <span className={styles.guideLink}>Read article →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Frequently Asked Questions with FAQ Schema */}
      <section className={styles.sectionBand}>
        <div className={styles.container}>
          <div className={styles.faqHeader}>
            <span className={styles.faqEyebrow}>FAQ</span>
            <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
            <p className={styles.faqSubtitle}>
              Everything you need to know about our privacy-first tools, accuracy, and browser computation.
            </p>
          </div>
          <div className={styles.faqWrapper}>
            <Faq items={HOME_FAQ_ITEMS} title="" withSchema />
          </div>
        </div>
      </section>

      {/* 8. Suggest a Tool Banner */}
      <SuggestBanner />
    </main>
  );
}
