import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import TwitterCharacterCounter from '@/components/tool/twitter-character-counter';
import ToolShell from '@/components/tool/shared/ToolShell';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import { TEXT_LIMIT_PRESETS } from '@/data/text-limits';
import styles from './page.module.css';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';

export const dynamic = 'force-static';

const route = ROUTES.twitterCharacterCounter;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const faqs = [
  {
    q: 'What is the Twitter (X) character limit?',
    a: '280 weighted characters (X developer docs, checked 2026-11-22). Letters, numbers, common punctuation and spaces count as 1 each, emoji as 2, and any link as 23.',
  },
  {
    q: 'How many characters are in a tweet?',
    a: 'Up to 280 weighted characters. One link uses 23 of them, which leaves 257 for text, including the space before the link.',
  },
  {
    q: 'How does X count emoji, links and mentions?',
    a: 'Under the official twitter-text v3 algorithm: every emoji glyph (including compound zero-width joiner sequences, skin-tone modifiers, and national flags) counts as exactly 2 characters. Every valid URL (http, https, www, or bare domain) is automatically wrapped by t.co and counts as 23 characters. Inline @mentions count as normal characters; however, automated reply handle prefixes in conversation threads do not consume your 280-character allowance.',
  },
  {
    q: 'What is the Instagram caption character limit?',
    a: 'According to Meta’s official Graph API developer documentation, the Instagram caption limit is exactly 2,200 characters (including spaces and line breaks). Instagram also enforces a hard limit of no more than 30 hashtags (#) and no more than 20 @ tags per post.',
  },
  {
    q: 'Do spaces count on Twitter (X)?',
    a: 'Yes. Every space bar press and line return carries a weight of 1 character on X, exactly identical to letters and digits.',
  },
  {
    q: 'What is the X Premium post limit?',
    a: 'We have not been able to confirm the current Premium limit from an official page, so we don’t publish a number. Check X’s help center for your plan.',
  },
  {
    q: 'What is the Discord message limit?',
    a: 'The Other Platforms tab has Discord presets, but they are marked unverified because we could not confirm them from an official page. Check Discord’s help page before relying on them.',
  },
  {
    q: 'Why do different counters show different numbers for Twitter?',
    a: 'Most generic online character counters simply measure string length or Unicode code points, counting links character by character and emoji as 1 (or 4 UTF-8 bytes). X uses a specialized weighted scoring algorithm where links are transformed to 23 and all emoji weigh 2. KKC Tools implements the published X weighting rules.',
  },
  {
    q: 'How do I split a long post into an X thread?',
    a: 'Use our Thread Splitter tab! Paste your long essay or article, select your preferred numbering format (such as " 1/n"), and the engine automatically divides your prose at sentence and word boundaries, ensuring no single post exceeds 280 weighted characters and no URLs or emoji are broken.',
  },
  {
    q: 'How much of an Instagram caption shows before "...more"?',
    a: 'Meta doesn’t document the exact cut, and it can change with the screen. Put the important words first. The preview tile in the tool uses 125 characters as a rough guide only.',
  },
  {
    q: 'Do hashtags count toward the character limit?',
    a: 'Yes. On both X and Instagram, hashtag characters (including the # symbol and letters) count toward your total character limit. On Instagram, you are also restricted to a maximum of 30 hashtag tags per post regardless of remaining character space.',
  },
];

export default function TwitterCharacterCounterPage() {
  const breadcrumbs = [
    { name: 'Tools', path: '/tools/' },
    { name: 'Text & Writing', path: '/tools/#writing' },
    { name: 'Twitter Character Counter', path: route.path },
  ];

  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`} id="main-content">
      <JsonLd
        data={buildWebApplicationSchema({
          name: route.title,
          description: route.description,
          path: route.path,
          applicationCategory: 'UtilityApplication',
        })}
      />
      <JsonLd data={buildFaqSchema(faqs)} />

      <div className="container">
        <Breadcrumbs items={breadcrumbs} />

        <header className={styles.intro}>
          <h1 className={styles.title}>Twitter (X) Character Counter: Tweets, Threads and Instagram Captions</h1>
          <p className={styles.subtitle}>
            Count posts using authentic X weighted scoring (links 23, emoji 2), split long text into numbered threads,
            and monitor Instagram caption, hashtag, and mention boundaries.
          </p>

          <div className={styles.bluf}>
            Type or paste your post and this Twitter character counter counts it
            the way X does: <strong>280 weighted characters</strong>, every web link counts as <strong>23</strong>, and
            each emoji counts as <strong>2</strong>. A sample like &quot;Hello, world! 👋&quot; counts as{' '}
            <strong>16</strong>, not 15. Switch tabs to check Instagram&apos;s 2,200-character caption limit or split
            articles into threads.
          </div>
        </header>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Counts like X: links 23, emoji 2',
              'Instagram caption & hashtag limits',
              'Thread splitter with 1/n',
              'Limits dated & sourced',
            ]}
          >
            <TwitterCharacterCounter />
          </ToolShell>
        </div>

        <AdSlot slotId="twitter-counter-top" />

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>How to Count Characters for Twitter (X) and Social Media</h2>
            <p>
              Composing social media copy across diverse platforms requires understanding different counting
              architectures. Our specialized counter provides four dedicated tools:
            </p>
            <ol>
              <li>
                <strong>X (Twitter) Post Mode (Default):</strong> Evaluates your tweet against X’s official 280-weighted
                limit to verify your exact tweet character count. It automatically recognizes web URLs (attributing 23 characters) and weights emoji as 2
                characters, providing an exact preview of what X’s composer calculates.
              </li>
              <li>
                <strong>Instagram Mode:</strong> Monitors your draft against the official 2,200-character caption
                boundary, while actively counting hashtags (capped at 30) and account mentions (capped at 20). It also
                indicates where the feed truncation fold (&quot;...more&quot;) typically cuts off.
              </li>
              <li>
                <strong>Thread Splitter Mode:</strong> Have a 1,000-word essay or complex insight? Paste it here to
                automatically partition your prose into a sequential thread (1/n). It splits between sentences first, then words, and never inside a link or emoji.
              </li>
              <li>
                <strong>Other Platforms Mode:</strong> Test your copy against verified platform limits for Threads,
                LinkedIn, YouTube titles and descriptions, and Mastodon, with transparent developer citations.
              </li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2>The Twitter (X) Character Limit: 280 Weighted Characters</h2>
            <p>
              A standard X post can hold 280 weighted characters. X does not count them one by one like a text editor.
            </p>
            <p>
              According to the{' '}
              <a href="https://docs.x.com/fundamentals/counting-characters" target="_blank" rel="noopener noreferrer">
                Official X Developer Documentation on Counting Characters
              </a>{' '}
              (checked 2026-11-22), X applies a weighted scoring system designed to normalize informational density
              across languages and media types:
            </p>
            <ul>
              <li>
                <strong>Weight = 1:</strong> Standard Latin alphabetic glyphs (A–Z, a–z), Western European accented
                letters, digits (0–9), standard punctuation marks, and whitespace spaces.
              </li>
              <li>
                <strong>Weight = 2:</strong> East Asian logographic scripts (Chinese Hanzi, Japanese Kanji/Kana, Korean
                Hangul) and all Unicode emoji symbols.
              </li>
              <li>
                <strong>Weight = 23 (Fixed Link Length):</strong> Every web link starting with <code>http://</code>,{' '}
                <code>https://</code>, or valid domain extensions is shortened by Twitter’s internal t.co service and
                occupies exactly 23 weighted characters, regardless of whether the original URL was 12 characters or 150
                characters long.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How X Counts Characters: Emoji, Links, and International Scripts</h2>
            <p>
              Understanding why simple character counters fail on X prevents unexpected truncation upon posting. Here
              are specific worked examples evaluated by our engine:
            </p>
            <ul>
              <li>
                <code>Hello, world! 👋</code>: Contains 14 Latin letters, punctuation, and spaces (weight 14) plus 1
                waving hand emoji (weight 2), yielding <strong>16 weighted characters</strong>. A basic string counter
                would incorrectly report 15.
              </li>
              <li>
                <code>你好世界</code>: Four Chinese Hanzi characters. Because East Asian characters convey higher
                information density per glyph, each carries a weight of 2, yielding <strong>8 weighted characters</strong>.
              </li>
              <li>
                <code>Read this https://www.example.com/a/very/long/path?utm_source=x 🚀</code>: Contains 10 letters and
                spaces (10) + a long URL (23) + space (1) + rocket emoji (2) ={' '}
                <strong>36 weighted characters</strong>. A plain counter shows 65.
              </li>
              <li>
                <code>👨‍👩‍👧‍👦 (Family Emoji)</code>: Even though this compound glyph consists of 7 Unicode code points
                joined by zero-width joiners and occupies 25 UTF-8 bytes, X’s rule states: <em>&quot;All emojis count as 2
                characters, regardless of complexity.&quot;</em> It consumes exactly 2 characters on X.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Writing an X Thread: How to Split Long Thoughts</h2>
            <p>
              When an idea exceeds 280 characters, breaking it into an engaging, readable thread is far more effective
              than posting an unreadable wall of text or taking a screenshot of your notes app.
            </p>
            <p>
              Our Thread Splitter automates this process using strict typographic invariants:
            </p>
            <ol>
              <li>
                <strong>Greedy Sentence Packing:</strong> The algorithm packs complete sentences into each post until the
                next sentence would breach the 280-weighted ceiling.
              </li>
              <li>
                <strong>Suffix Reserve:</strong> It reserves buffer space for sequential numbering (such as &quot; 1/4&quot;
                or &quot; (1/4)&quot;), ensuring that appending the counter never pushes a tweet past the limit.
              </li>
              <li>
                <strong>Nothing is cut in half:</strong> links and emoji stay whole, and your line breaks are kept. To inspect individual sentence lengths and structure before composing a thread, use our <Link href="/sentence-counter/">Sentence Counter</Link>.
              </li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2>Instagram Character Counter: Captions, Hashtags, and Mentions</h2>
            <p>
              When drafting your IG captions or planning carousel slides, these limits apply. According to{' '}
              <a
                href="https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media"
                target="_blank"
                rel="noopener noreferrer"
              >
                Meta’s Official Instagram Graph API Documentation
              </a>{' '}
              (checked 2026-11-22):
            </p>
            <ul>
              <li>
                <strong>Caption Limit:</strong> Exactly <strong>2,200 characters</strong> with spaces included.
              </li>
              <li>
                <strong>Hashtags:</strong> up to <strong>30</strong> per post.
              </li>
              <li>
                <strong>Account Mentions:</strong> You can tag up to <strong>20 user accounts</strong> in a single
                caption.
              </li>
              <li>
                <strong>The &quot;...more&quot; cut:</strong> not documented. Put the important words first.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Instagram, LinkedIn, Threads and YouTube Character Limits</h2>
            <p>
              The table below summarizes character constraints across leading digital platforms, documented with
              official developer sources and checked verification status:
            </p>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <caption>
                  Social platform character limits (numbers shown only where an official source was checked on 2026-11-22)
                </caption>
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>Field / Placement</th>
                    <th>Character Limit</th>
                    <th>Counting Unit</th>
                    <th>Verification Status</th>
                  </tr>
                </thead>
                <tbody>
                  {TEXT_LIMIT_PRESETS.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.platform}</strong>
                      </td>
                      <td>{p.field}</td>
                      <td>
                        <strong>{p.verified ? p.limit.toLocaleString('en-US') : '—'}</strong>
                      </td>
                      <td>{p.unit === 'x-weighted' ? 'X-Weighted' : 'Standard Characters'}</td>
                      <td>
                        {p.verified ? (
                          <span className={styles.verifiedBadge}>✓ Verified ({p.checkedOn})</span>
                        ) : (
                          <span className={styles.unverifiedBadge}>⚠ Unverified: check {p.platform}’s help page</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Why Character Counters Disagree: The Technical Breakdown</h2>
            <p>
              Digital
              text can be measured across four distinct layers:
            </p>
            <ul>
              <li>
                <strong>Grapheme Clusters (Human Vision):</strong> What human readers perceive as one symbol. A waving
                hand with skin tone (👋🏽) is 1 grapheme.
              </li>
              <li>
                <strong>Unicode Code Points:</strong> The underlying numeric identifiers in the Unicode database. The
                family emoji (👨‍👩‍👧‍👦) contains 7 code points.
              </li>
              <li>
                <strong>UTF-16 Code Units:</strong> Native JavaScript string length (<code>string.length</code>).
                High-plane emoji occupy 2 surrogate units each.
              </li>
              <li>
                <strong>Platform-Weighted Units:</strong> Custom business logic like X’s algorithm, which normalizes
                links to 23 and doubles emoji weights.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {faqs.map((faq, index) => (
                <details key={index} className={styles.faqItem}>
                  <summary>{faq.q}</summary>
                  <div className={styles.faqAnswer}>
                    <p>{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          <HowWeCalculate slug="twitter-character-counter" />

          <section className={styles.section}>
            <h2>Related Writing &amp; Text Calculators</h2>
            <p>
              Explore our full suite of free client-side writing and editing tools:
            </p>
            <ul>
              <li>
                <Link href="/character-counter/">
                  <strong>Character Counter:</strong>
                </Link>{' '}
                Count characters with and without spaces, words, sentences, and UTF-8 storage bytes.
              </li>
              <li>
                <Link href="/sentence-counter/">
                  <strong>Sentence Counter:</strong>
                </Link>{' '}
                Count sentences, paragraphs and lines with editable abbreviation rules.
              </li>
              <li>
                <Link href="/word-counter/">
                  <strong>Word Counter:</strong>
                </Link>{' '}
                Count words, characters, and reading time with essay quotas.
              </li>
              <li>
                <Link href="/characters-to-words/">
                  <strong>Characters to Words Converter:</strong>
                </Link>{' '}
                Convert character counts to words and calibrate against your personal writing average.
              </li>
              <li>
                <Link href="/words-to-pages/">
                  <strong>Words to Pages Calculator:</strong>
                </Link>{' '}
                Convert word counts to printed pages for single, 1.5, and double spacing.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
