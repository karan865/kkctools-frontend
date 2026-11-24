import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import HomeHero from '@/components/home/HomeHero';
import TrustStrip from '@/components/home/TrustStrip';
import SectionHeader from '@/components/home/SectionHeader';
import CategorySection from '@/components/home/CategorySection';
import CategoryTiles, { CATEGORY_ICONS } from '@/components/home/CategoryTiles';
import ToolCard from '@/components/home/ToolCard';
import AdPlaceholder from '@/components/home/AdPlaceholder';
import WhyUs from '@/components/home/WhyUs';
import SuggestBanner from '@/components/home/SuggestBanner';
import Faq from '@/components/ui/Faq';
import Icon, { type IconName } from '@/components/icons/Icons';
import { buildMetadata } from '@/components/seo/buildMetadata';
import {
  TOOLS_CATALOG,
  getToolsByCategory,
  getNewAndUpdatedTools,
  type CatalogTool,
  type CategoryId,
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

/** Category bands in page order. Layout and flip alternate so neighbouring sections never look the same. */
const CATEGORY_BANDS: { id: CategoryId; layout: 'split' | 'stack'; flip?: boolean; show: number; viewAllText: string }[] = [
  { id: 'concrete', layout: 'split', show: 4, viewAllText: 'All concrete tools' },
  { id: 'earthwork', layout: 'stack', show: 6, viewAllText: 'All paving & soil tools' },
  { id: 'gravel', layout: 'split', flip: true, show: 4, viewAllText: 'All gravel & sand tools' },
  { id: 'framing', layout: 'stack', show: 6, viewAllText: 'All framing & roofing tools' },
  { id: 'finishes', layout: 'split', show: 4, viewAllText: 'All finish tools' },
  { id: 'business', layout: 'stack', show: 2, viewAllText: 'All estimate & creative tools' },
  { id: 'engineering', layout: 'split', flip: true, show: 4, viewAllText: 'All 3D printing & CNC tools' },
  { id: 'math', layout: 'stack', show: 6, viewAllText: 'All math & financial calculators' },
  { id: 'writing', layout: 'split', show: 4, viewAllText: 'All text & writing tools' },
]

const GUIDES: { href: string; badge: string; title: string; excerpt: string; icon: IconName; tone: string }[] = [
  {
    href: '/guides/how-to-choose-a-band-name/',
    badge: 'Naming Guide',
    title: 'How to Choose a Band Name That Sticks',
    excerpt: 'Strategic naming principles, trademark safety, genre alignment, and phonetics for modern musicians.',
    icon: 'guitar',
    tone: 'toneFinishes',
  },
  {
    href: '/guides/band-name-ideas-by-genre/',
    badge: 'Trends',
    title: 'Genre-Specific Naming Trends',
    excerpt: 'From indie dream-pop to death metal: patterns, archetypes, and linguistic styling across genres.',
    icon: 'bookOpen',
    tone: 'toneBusiness',
  },
  {
    href: '/guides/how-to-check-if-a-band-name-is-taken/',
    badge: 'Legal & IP',
    title: 'Trademark & Social Handle Checklist',
    excerpt: 'Avoid disputes before printing merch or registering domains. A straightforward trademark guide.',
    icon: 'shield',
    tone: 'toneGravel',
  },
];

function Card({ tool }: { tool: CatalogTool }) {
  return (
    <ToolCard
      slug={tool.slug}
      name={tool.name}
      category={tool.category}
      description={tool.description}
      tags={tool.tags}
      icon={tool.icon}
      isNew={tool.isNew}
      isUpdated={tool.isUpdated}
    />
  );
}

function Band({ band, index }: { band: (typeof CATEGORY_BANDS)[number]; index: number }) {
  const tools = getToolsByCategory(band.id);
  const isBusiness = band.id === 'business';
  return (
    <CategorySection
      id={band.id}
      index={index}
      icon={CATEGORY_ICONS[band.id]}
      toolCount={tools.length}
      viewAllText={band.viewAllText}
      layout={band.layout}
      flip={band.flip}
    >
      {tools.slice(0, band.show).map((tool) => (
        <Card key={tool.slug} tool={tool} />
      ))}
      {isBusiness && (
        <ToolCard
          slug=""
          name="Suggest a Calculator"
          category="business"
          description="Need another calculator for your trade? Tell us what formula or tool to build next."
          icon="plus"
          variant="suggest"
        />
      )}
    </CategorySection>
  );
}

export default function Home() {
  // Keep the "new" grid to full rows of three.
  const newAndUpdated = getNewAndUpdatedTools();
  const newShown = newAndUpdated.slice(0, Math.max(3, newAndUpdated.length - (newAndUpdated.length % 3)));

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
      {/* 1. Hero with search and colourful category chips */}
      <HomeHero />

      {/* 2. Trust strip */}
      <TrustStrip />

      {/* 3. Colourful jump tiles, one per trade */}
      <CategoryTiles />

      {/* 4. New & updated tools: each card wears its own category colour */}
      <section className={styles.sectionNew} aria-labelledby="new-tools-title">
        <div className={styles.container}>
          <SectionHeader
            eyebrow="NEW &amp; UPDATED"
            categoryHue="framing"
            title="Recently Built &amp; Updated Tools"
            titleId="new-tools-title"
            subtitle="Fresh calculators and major feature upgrades engineered for fast jobsite math."
            viewAllLink="/tools/"
            viewAllText={`Explore all ${TOOLS_CATALOG.length} tools`}
          />
          <div className={styles.cardGrid}>
            {newShown.map((tool) => (
              <Card key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Category bands 01–03 */}
      {CATEGORY_BANDS.slice(0, 3).map((band, i) => (
        <Band key={band.id} band={band} index={i + 1} />
      ))}

      {/* Reserved ad slot (renders nothing until ads are enabled) */}
      <AdPlaceholder slotName="home-between-categories" />

      {/* 6. Dark "why us" band breaks up the colourful sections */}
      <WhyUs />

      {/* 7. Category bands 04–06 */}
      {CATEGORY_BANDS.slice(3).map((band, i) => (
        <Band key={band.id} band={band} index={i + 4} />
      ))}

      {/* 8. Guides with coloured covers */}
      <section className={styles.sectionGuides} aria-labelledby="guides-title">
        <div className={styles.container}>
          <SectionHeader
            eyebrow="KNOWLEDGE &amp; GUIDES"
            categoryHue="finishes"
            title="Band Naming Guides"
            titleId="guides-title"
            subtitle="Step-by-step guides for naming a band and checking that a name is free. Each calculator page also explains its own formula."
            viewAllLink="/guides/"
            viewAllText="Read all guides"
          />
          <div className={styles.guidesGrid}>
            {GUIDES.map((g) => (
              <Link key={g.href} href={g.href} className={`${styles.guideCard} ${styles[g.tone]}`}>
                <div className={styles.guideCover} aria-hidden="true">
                  <Icon name={g.icon} size={34} strokeWidth={1.7} />
                </div>
                <div className={styles.guideBody}>
                  <span className={styles.guideBadge}>{g.badge}</span>
                  <h3 className={styles.guideTitle}>{g.title}</h3>
                  <p className={styles.guideExcerpt}>{g.excerpt}</p>
                  <span className={styles.guideLink}>
                    Read article <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ with FAQ schema */}
      <section className={styles.sectionFaq} aria-labelledby="home-faq-title">
        <div className={styles.container}>
          <div className={styles.faqHeader}>
            <span className={styles.faqEyebrow}>FAQ</span>
            <h2 id="home-faq-title" className={styles.faqTitle}>
              Frequently Asked Questions
            </h2>
            <p className={styles.faqSubtitle}>
              Everything you need to know about our privacy-first tools, accuracy, and browser computation.
            </p>
          </div>
          <div className={styles.faqWrapper}>
            <Faq items={HOME_FAQ_ITEMS} title="" withSchema />
          </div>
        </div>
      </section>

      {/* 10. Suggest a tool banner */}
      <SuggestBanner />
    </main>
  );
}
