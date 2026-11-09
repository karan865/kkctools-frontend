import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Faq, { FaqItem } from '@/components/ui/Faq';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import BandNameGenerator from '@/components/tool/band-name-generator/BandNameGenerator';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { ROUTES } from '@/lib/routes';
import { SITE_URL } from '@/config/site';
import styles from './page.module.css';

export const metadata: Metadata = buildMetadata({
  title: ROUTES.bandNameGenerator.title,
  description: ROUTES.bandNameGenerator.description,
  path: ROUTES.bandNameGenerator.path,
});

const STATIC_SUGGESTED_NAMES = [
  'Crimson Highway',
  'Velvet Static',
  'The Iron Vultures',
  'Midnight Carousel',
  'Broken Voltage',
  'Obsidian Reapers',
  'The Starlit Nomads',
  'Rust & Anthem',
  'Neon Mirage',
  'The Savage Stallions',
  'Quiet Lighthouses',
  'Thunderbird Echo',
];

const MAIN_FAQ_ITEMS: FaqItem[] = [
  {
    q: 'Is the band name generator free to use?',
    a: 'Yes, this band name generator is completely free with no hidden fees, paywalls, or mandatory user accounts. You can generate as many musical group names as you need, customize styles and filters, save your favorite picks locally in your browser, and export them as a text file without ever reaching for a credit card.',
  },
  {
    q: 'Are the generated band names guaranteed to be unique?',
    a: 'No automated generator can guarantee complete global uniqueness. Our generator creates combinations from extensive, hand-curated vocabulary pools and musical patterns while filtering out more than 260 world-famous bands. However, independent and local bands form every day across the globe. You should always conduct thorough clearance searches on Spotify, Bandcamp, Google, and trademark registries before finalizing a name.',
  },
  {
    q: 'How do I check if a generated band name is already taken?',
    a: 'Click the availability search icon next to any generated name in our results table. This opens quick-launch lookup links for Google, Spotify, Bandcamp, and YouTube. In addition, search global social media handles on platforms like Instagram and TikTok, search domain registries for available web addresses, and consult your country trademark database.',
  },
  {
    q: 'Can I legally use these names for my band or commercial release?',
    a: 'You are welcome to use any name produced by this tool for your musical projects, album titles, or touring acts. However, this website does not provide legal advice. It remains your sole legal responsibility to ensure your selected moniker does not infringe on existing trademarks, copyrights, or registered business names in the territories where you perform and distribute music.',
  },
  {
    q: 'Does this band name generator use AI or external server APIs?',
    a: 'No, this tool does not use artificial intelligence, large language models, or remote API endpoints. Instead, it runs an ultra-fast deterministic algorithmic engine driven by curated musical word banks, genre-specific grammatical templates, and seeded pseudorandom number generators. Everything computes instantly inside your web browser, ensuring your search queries never leave your device.',
  },
  {
    q: 'Where are my saved favorite band names stored?',
    a: 'When you click the heart icon on any generated result, that name is stored privately in your browser local storage. We do not track or transmit your saved favorites to any server or third party. You can view, copy, or export your entire saved collection as a text file at any time from the Saved Favorites drawer below the tool.',
  },
  {
    q: 'Can I generate names specifically tailored to my musical genre?',
    a: 'Yes. Our generator features dedicated genre modes for Rock, Metal, Heavy Metal, Punk, Pop, K-pop, Boy Bands, and Indie. Each genre uses distinct vocabulary pools, thematic adjectives, rhythmic conventions, and syntax structures designed to match the authentic sonic identity of that musical tradition.',
  },
  {
    q: 'How many names can I generate at once?',
    a: 'You can choose to generate batches of 5, 10, or 20 names in a single click. The tool tracks names produced during your current session history to avoid repeating recent names, allowing you to cycle through dozens of fresh brainstorm batches in seconds.',
  },
];

export default function BandNameGeneratorPage() {
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Band Name Generator',
    url: `${SITE_URL}/band-name-generator/`,
    description: 'Generate original band names by genre and naming style. Runs 100% in your browser.',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any (web browser)',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <main id="main-content">
      <JsonLd data={webAppSchema} />

      {/* Top Hero Section with Breadcrumbs & Tool */}
      <Section variant="hero">
        <Container>
          <Breadcrumbs
            items={[
              { name: 'Tools', path: '/tools/' },
              { name: 'Band Name Generator', path: '/band-name-generator/' },
            ]}
          />

          <span className={styles.categoryTag}>Creative • Music • Naming</span>
          <h1>Band Name Generator</h1>
          <p style={{ maxWidth: '720px', fontSize: '1.1875rem', marginBottom: 'var(--space-6)' }}>
            Looking for good band names that feel original, memorable, and ready for the stage?
            Our free <strong>band name generator</strong> combines curated genre vocabulary and classic naming formulas to spark creative band name ideas in seconds—running entirely in your browser with zero tracking.
          </p>

          {/* Core Interactive Tool */}
          <BandNameGenerator initialGenre="any" />
        </Container>
      </Section>

      <AdSlot slotId="bng-top" />

      {/* Static Names List */}
      <Section variant="surface">
        <Container>
          <h2 style={{ marginTop: 0 }}>Curated Band Names You Might Like</h2>
          <p>
            Looking for immediate inspiration? Here are twelve hand-picked band name ideas crafted by our editors across diverse sonic aesthetics:
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 'var(--space-3)',
              marginTop: 'var(--space-4)',
            }}
          >
            {STATIC_SUGGESTED_NAMES.map((name) => (
              <div
                key={name}
                style={{
                  background: 'var(--bg)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-s)',
                  border: '1px solid var(--line)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--ink)',
                }}
              >
                🎸 {name}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Editorial Content Section (≥ 1,000 words) & Related Tools Sidebar */}
      <Section>
        <Container>
          <div className={styles.twoColLayout}>
            {/* Left Column: Educational Editorial Content */}
            <div className={styles.mainColumn}>
              <div className="prose">
                <h2>How to Use the Band Name Generator</h2>
                <p>
                  Finding the right band name maker often feels overwhelming when you stare at a blank notepad. Our generator simplifies the brainstorming process into five focused steps:
                </p>
            <ol>
              <li>
                <strong>Choose your genre:</strong> Select from Rock, Metal, Heavy Metal, Punk, Pop, K-pop, Boy Band, or Indie. If your project blends styles, keep the selector on &quot;Any&quot; for an eclectic mix.
              </li>
              <li>
                <strong>Select your naming formula:</strong> Narrow results to classic formats like &quot;The ...&quot; plural names, punchy one-word monikers, dynamic two-word combinations, or dramatic &quot;X of Y&quot; phrasing.
              </li>
              <li>
                <strong>Apply custom letters or keywords:</strong> Use the &quot;Starts with letter&quot; dropdown if you want alliteration, or type a signature term into &quot;Must include word&quot; to anchor the generator around a specific theme.
              </li>
              <li>
                <strong>Generate and refine:</strong> Click &quot;Generate Band Names&quot; or hit Enter. You can produce batches of 5, 10, or 20 names. Every click pulls fresh permutations while skipping names you have already seen in the current session.
              </li>
              <li>
                <strong>Save favorites and verify:</strong> Click the heart icon to bookmark standout candidates in your private Saved Favorites drawer, then use the magnifying glass button to search Spotify, YouTube, Bandcamp, and Google.
              </li>
            </ol>

            <h2>What Makes a Good Band Name?</h2>
            <p>
              A legendary band name is more than just words on a poster; it is the cornerstone of your visual branding, streaming identity, and audience perception. When evaluating ideas from any band names generator, keep these core principles in mind:
            </p>
            <ul>
              <li>
                <strong>Memorability and phonetics:</strong> The best band names stick in someone&apos;s mind after hearing them only once over a loud venue PA or during a radio introduction. Pay attention to rhythm, syllable cadence, and mouthfeel when speaking the name aloud.
              </li>
              <li>
                <strong>Spelling and clarity:</strong> Avoid overly clever intentional misspellings or confusing punctuation that makes searching difficult. If a listener cannot spell your band name into Spotify or YouTube on the first attempt, you risk losing potential fans.
              </li>
              <li>
                <strong>Genre authenticity:</strong> Your moniker should set honest expectations for your musical texture. A blistering death metal group rarely succeeds with a soft pastel pop title, just as a breezy acoustic duo will feel mismatched behind an apocalyptic gothic name.
              </li>
              <li>
                <strong>Digital searchability:</strong> In modern streaming culture, common generic nouns (like &quot;Bread&quot; or &quot;Live&quot;) face enormous competition in search engine algorithms. Distinctive compound phrases and evocative word combinations make discovering your music effortless.
              </li>
            </ul>

            <h2>Explore Band Name Ideas by Genre</h2>
            <p>
              Different musical subcultures follow distinct naming traditions. Explore our specialized genre guides and dedicated sub-generators to find sound-specific ideas:
            </p>

            {/* Genre Grid inside Main Column */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 'var(--space-4)',
                margin: 'var(--space-5) 0',
              }}
            >
            <Card hoverable>
              <h3>
                <Link href="/band-name-generator/rock/">Rock Band Name Generator</Link>
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)' }}>
                Electric, gritty rock and roll ideas blending vintage highway nostalgia, howling jackals, and raw amplifier overdrive.
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                Sample names: <em>The Diesel Rebels, Broken Voltage, Midnight Wolves</em>
              </p>
            </Card>

            <Card hoverable>
              <h3>
                <Link href="/band-name-generator/metal/">Metal Band Name Generator</Link>
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)' }}>
                Dark, abrasive monikers for death, black, doom, and thrash metal bands featuring abyssal tombs, rituals, and cursed legions.
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                Sample names: <em>Crimson Throne, Obsidian Altar, Bleeding Sepulcher</em>
              </p>
            </Card>

            <Card hoverable>
              <h3>
                <Link href="/band-name-generator/heavy-metal/">Heavy Metal Band Name Generator</Link>
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)' }}>
                Epic 80s-inspired NWOBHM and power metal titles packed with soaring dragons, iron stalliones, and chrome hammers.
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                Sample names: <em>Steel Dragon, Hammer of Glory, Armored Knights</em>
              </p>
            </Card>

            <Card hoverable>
              <h3>
                <Link href="/band-name-generator/kpop/">K-pop Band Name Generator</Link>
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)' }}>
                Sleek, futuristic idol group names utilizing astronomical concept words, high-energy syllables, and numeric branding formulas.
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                Sample names: <em>NOVA ONE, ZENITH-X, ORBIT SEVEN</em>
              </p>
            </Card>

            <Card hoverable>
              <h3>
                <Link href="/band-name-generator/boy-band/">Boy Band Name Generator</Link>
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)' }}>
                Smooth, infectious pop vocal group titles rooted in urban romance, twilight avenues, and heartfelt melodies.
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                Sample names: <em>Midnight Avenue, Sunday Street, Golden Dreamers</em>
              </p>
            </Card>

            <Card hoverable>
              <h3>
                <Link href="/band-name-generator/random/">Random Band Name Generator</Link>
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--ink-2)' }}>
                Unpredictable crossover combinations pulling from every sonic pool for experimental, avant-garde, and genre-defying acts.
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                Sample names: <em>Velvet Riots, Solar Jackals, Rust Carousel</em>
              </p>
            </Card>
          </div>

          <h2>How to Pick Your Final Band Name</h2>
            <p>
              Generating dozens of cool band names that aren&apos;t taken is only the first stage of the journey. Once you assemble a shortlist of candidates, run them through these validation tests:
            </p>
            <ol>
              <li>
                <strong>The &quot;Shout It in a Crowd&quot; Test:</strong> Tell your friends your potential band name in a bustling coffee shop or noisy rehearsal space. If they repeatedly ask you to repeat it or mishear the words, the name lacks phonetic punch.
              </li>
              <li>
                <strong>Streaming Platform Verification:</strong> Search Spotify, Apple Music, and Bandcamp. Discovering an obscure band with the same name from ten years ago might not stop you, but sharing a name with an active touring artist in your region creates confusing metadata and fragmented streaming revenue.
              </li>
              <li>
                <strong>Domain and Social Media Handle Audit:</strong> Check whether clean digital real estate is available. Can you secure <code>@YourBandName</code> or <code>@YourBandOfficial</code> on Instagram, YouTube, TikTok, and X? Is the <code>.com</code> or <code>.band</code> domain available?
              </li>
              <li>
                <strong>Trademark and Legal Due Diligence:</strong> Before investing heavily in merchandise, physical pressings, and stage backdrops, search official trademark registries such as the USPTO in the United States, EUIPO in Europe, or your domestic intellectual property office. <em>(Please note: this guide is provided for educational and creative purposes only and does not constitute formal legal counsel. Always consult a qualified entertainment attorney for trademark protection.)</em>
              </li>
            </ol>

            <h2>How This Generator Works Behind the Scenes</h2>
            <p>
              Unlike many generic web utilities that simply shuffle a random dictionary or query third-party cloud AI servers, our band name generator was architected specifically for musicians and creators with privacy and speed at its foundation:
            </p>
            <ul>
              <li>
                <strong>Curated Musical Lexicons:</strong> Every genre features isolated vocabulary pools containing more than 80 hand-selected adjectives, nouns, and sonic terms vetted for musical resonance.
              </li>
              <li>
                <strong>Syntactic Pattern Engine:</strong> We utilize structured grammatical templates that mirror authentic songwriting styles—from punchy garage punk verbs to ornate heavy metal genitive phrases (&quot;X of Y&quot;).
              </li>
              <li>
                <strong>Strict Quality & Blocklist Filtering:</strong> Every generated combination is normalized and screened against an internal blocklist of over 260 world-famous artists, explicit slurs, and repetitive word anomalies before appearing on your screen.
              </li>
              <li>
                <strong>100% Client-Side Browser Privacy:</strong> Nothing you enter, click, or generate is ever transmitted to a server or external analytics network. Your creative brainstorming remains entirely confidential on your own machine.
              </li>
            </ul>

            {/* Related Educational Guides */}
            <h2>Related Band Naming Guides</h2>
            <p>
              Deepen your branding knowledge with our complete editorial tutorials:
            </p>
            <ul>
              <li>
                <Link href="/guides/how-to-choose-a-band-name/">
                  How to Choose a Band Name: The Complete Step-by-Step Guide
                </Link>
              </li>
              <li>
                <Link href="/guides/band-name-ideas-by-genre/">
                  Band Name Ideas by Genre: Historical Trends, Rules, and Conventions
                </Link>
              </li>
              <li>
                <Link href="/guides/how-to-check-if-a-band-name-is-taken/">
                  How to Check If a Band Name Is Already Taken: Complete Verification Checklist
                </Link>
              </li>
            </ul>

            <h3>More Free Browser Utilities</h3>
            <p>
              Looking for professional business calculation utilities? Try our{' '}
              <Link href="/construction-estimate-template/">
                Free Construction Estimate Template
              </Link>{' '}
              for contractors, or browse all generators in our{' '}
              <Link href="/tools/">free tools directory</Link>.
            </p>
          </div>
        </div>

        {/* Right Column: Related Tools Card matching Reference Design */}
        <aside className={styles.sidebarColumn}>
          <div className={styles.relatedToolsCard}>
            <h3 className={styles.relatedToolsTitle}>Related tools</h3>
            <p className={styles.relatedToolsDesc}>
              Continue with calculators and practical tools that match this topic. Each link opens a free tool with its own explanation, FAQs, and planning notes.
            </p>
            <div className={styles.relatedToolsList}>
              <Link href="/construction-estimate-template/" className={styles.relatedToolItem}>
                <span className={styles.relatedToolName}>📐 Construction Estimate Template</span>
                <span className={styles.relatedToolExcerpt}>Contractor cost estimation with PDF &amp; CSV export</span>
                <span className={styles.relatedToolLink}>Open tool →</span>
              </Link>

              <Link href="/band-name-generator/rock/" className={styles.relatedToolItem}>
                <span className={styles.relatedToolName}>🎸 Rock Band Names</span>
                <span className={styles.relatedToolExcerpt}>Vintage highway, fuzz pedals, and overdrive formulas</span>
                <span className={styles.relatedToolLink}>Open tool →</span>
              </Link>

              <Link href="/band-name-generator/metal/" className={styles.relatedToolItem}>
                <span className={styles.relatedToolName}>⚡ Metal Band Names</span>
                <span className={styles.relatedToolExcerpt}>Dark abrasive monikers for death, doom, and thrash</span>
                <span className={styles.relatedToolLink}>Open tool →</span>
              </Link>

              <Link href="/band-name-generator/kpop/" className={styles.relatedToolItem}>
                <span className={styles.relatedToolName}>✨ K-pop Group Names</span>
                <span className={styles.relatedToolExcerpt}>Futuristic idol concepts with numeric formulas</span>
                <span className={styles.relatedToolLink}>Open tool →</span>
              </Link>

              <Link href="/tools/" className={styles.relatedToolItem}>
                <span className={styles.relatedToolName}>🗂️ All Online Tools Directory</span>
                <span className={styles.relatedToolExcerpt}>Explore all published and upcoming browser utilities</span>
                <span className={styles.relatedToolLink}>Browse all tools →</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  </Section>

      <AdSlot slotId="bng-bottom" />

      {/* Structured FAQ Section */}
      <Section variant="surface">
        <Container size="prose">
          <Faq items={MAIN_FAQ_ITEMS} title="Band Name Generator FAQ" withSchema={true} />
        </Container>
      </Section>
    </main>
  );
}

