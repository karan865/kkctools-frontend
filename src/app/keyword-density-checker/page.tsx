import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ToolShell from '@/components/tool/shared/ToolShell';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import { KeywordDensityChecker } from '@/components/tool/keyword-density-checker';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.keywordDensityChecker || {
  title: 'Keyword Density Checker – Count Words in Text',
  description:
    'Free keyword density checker. Paste your text or article to see 1, 2 and 3-word phrase frequencies, filter stop words, and check overused terms, in your browser.',
  path: '/keyword-density-checker/',
};

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const faqs = [
  {
    q: 'How many keywords should I use for SEO?',
    a: 'There is no fixed number. Pick one main topic, answer it fully, and let related terms appear where they help the reader.',
  },
  {
    q: 'How many keywords should a single webpage target?',
    a: 'As a best practice in search engine optimization, a single page should focus on one primary search topic (or intent) along with a handful of naturally supporting sub-topics. Trying to target ten completely distinct concepts on one page confuses search engines and dilutes content relevance. Create dedicated, in-depth pages for distinct user intentions rather than forcing unrelated phrases into one article.',
  },
  {
    q: 'What is the ideal keyword density percentage?',
    a: 'There isn’t one. Google’s spam policies warn against filling a page with keywords and give no percentage. Use the counts to spot phrases you repeat without meaning to.',
  },
  {
    q: 'What is keyword stuffing according to Google?',
    a: 'Google’s spam policies describe it as filling a page with keywords or numbers to manipulate rankings. Their examples include lists of numbers with no added value, blocks of place names, and the same words repeated until the text sounds unnatural (checked 2026-11-22).',
  },
  {
    q: 'How is keyword density calculated?',
    a: 'Keyword density is calculated by dividing the number of times a specific word or phrase appears in your text by the total number of words in the document, then multiplying by 100: Density % = (Occurrences ÷ Total Words) × 100. Some SEO tools also calculate a second metric called "Share of Words", which factors in phrase length: Share % = (Occurrences × Words in Phrase ÷ Total Words) × 100.',
  },
  {
    q: 'Do stop words count in keyword density calculations?',
    a: 'In our tool, stop words (such as "the", "is", "at", "which", "and") are counted in the total word denominator so your overall document metrics remain 100% accurate. However, in the phrase tables, stop words are filtered out by default so you can focus on substantive topical keywords. You can edit, add, or reset stop words at any time in the Settings tab.',
  },
  {
    q: 'Why is keyword density misleading on short content?',
    a: 'On short copy (such as a 100-word product description or email), mentioning your product name just three times results in a 3.0% keyword density, which might look artificially high. Conversely, in a 5,000-word comprehensive white paper, mentioning your key subject 30 times yields only a 0.6% density. Percentages are highly sensitive to document length, which is why examining raw occurrence counts and context is far more actionable than watching percentages in isolation.',
  },
  {
    q: 'Can I check a live website URL directly with this tool?',
    a: 'Our keyword density checker is built with a zero-network privacy architecture: it runs completely client-side inside your browser without making external server calls. To analyze a live web page, simply copy the text from the page and paste it into the input area. This ensures that confidential drafts, unpublished blogs, and proprietary intranet documents remain 100% private on your machine.',
  },
  {
    q: 'Is adding too many keywords bad for Google Ads?',
    a: 'This tool only counts words in text you paste, so it can’t judge an ad account. On the landing page itself, repetition that reads badly helps nobody. Check Google Ads help for how keywords work in ad groups.',
  },
  {
    q: 'What are 1-word, 2-word, and 3-word n-grams?',
    a: 'In computational linguistics, an n-gram is a contiguous sequence of n items from a given sample of text. A 1-gram is a single standalone word ("counter"), a 2-gram is a two-word phrase ("word counter"), and a 3-gram is a three-word phrase ("free word counter"). Our engine slides an n-gram window across each sentence to uncover your most repeated multi-word phrases without crossing sentence boundaries.',
  },
];

export default function KeywordDensityPage() {
  const webAppSchema = buildWebApplicationSchema({
    name: 'Keyword Density Checker',
    description: route.description,
    path: route.path,
    applicationCategory: 'UtilityApplication',
  });

  const faqSchema = buildFaqSchema(faqs);

  const breadcrumbs = [
    { name: 'Tools', path: '/tools/' },
    { name: 'Text & Writing', path: '/tools/#writing' },
    { name: 'Keyword Density', path: route.path },
  ];

  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={faqSchema} />

      <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
        <div className="container">
          <Breadcrumbs items={breadcrumbs} />

          <header className={styles.intro}>
            <h1 className={styles.title}>
              Keyword Density Checker: How Often Each Word and Phrase Appears
            </h1>
            <p className={styles.subtitle}>
              Uncover 1-word, 2-word, and 3-word phrase frequencies, track target keyword distribution,
              and check for unnatural repetition with transparent mathematical formulas.
            </p>

            <div className={styles.bluf}>
              <strong>Bottom Line Up Front:</strong> Paste your text to see how often each word and
              2- or 3-word phrase appears, as a count and a percentage of all words, and where a
              target keyword shows up. Density here is calculated as{' '}
              <code>Occurrences ÷ Total Words × 100</code>. There is no &ldquo;ideal&rdquo; keyword
              percentage: Google&rsquo;s spam policies warn against stuffing keywords but publish no
              target number. Your text never leaves your browser.
            </div>
          </header>

          <div className={styles.calculatorWrapper}>
            <ToolShell
              features={[
                '1-, 2- & 3-word phrases',
                'Formula shown, no made-up targets',
                'Keyword heatmap & context',
                'Editable stop words',
              ]}
            >
              <KeywordDensityChecker />
            </ToolShell>
          </div>

          <AdSlot slotId="keyword-density-mid" />

          <article className={`${styles.content} ${typo.prose}`}>
            <section className={styles.section}>
              <h2>How to Use the Keyword Density Checker</h2>
              <p>
                Our keyword density checker is built for copywriters, SEO specialists, editors, and
                content marketers who want transparent insight into how frequently words and phrases
                appear across their articles. The tool is divided into three intuitive views:
              </p>
              <ul>
                <li>
                  <strong>All Words &amp; Phrases Tab:</strong> View tables
                  for single words (1-grams), 2-word phrases (2-grams), and 3-word phrases (3-grams).
                  Each table lists raw occurrence counts, standard density percentages, and total
                  word shares. You can instantly copy tables to your clipboard or download them as
                  CSV files for spreadsheet reporting.
                </li>
                <li>
                  <strong>Target Keyword Tab:</strong> Enter any specific term or multi-word phrase
                  to see its total occurrences, first position in the document, a 10-decile distribution
                  heatmap illustrating where the phrase appears throughout your article, and a Keyword
                  In Context (KWIC) feed displaying the ±5 words surrounding every mention.
                </li>
                <li>
                  <strong>Settings Tab:</strong> Fine-tune your analysis by customizing the stop-word
                  exclusion list, toggling case sensitivity, enabling plural variant grouping (e.g.,
                  merging &ldquo;keyword&rdquo; and &ldquo;keywords&rdquo;), and adjusting minimum
                  frequency thresholds.
                </li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>What Keyword Density Is and How It Is Calculated</h2>
              <p>
                Keyword density measures the relative frequency of a specific word or phrase in
                comparison to the total word count of a document. Calculating it is useful as an editorial diagnostic tool to prevent
                unnatural repetition and ensure diverse vocabulary.
              </p>
              <p>
                Different SEO utilities employ varying conventions when computing multi-word phrase
                densities. Our tool displays both transparently:
              </p>

              <div className={styles.calloutCard}>
                <p>
                  <strong>Convention A: Standard Density (Default)</strong><br />
                  <code>Density % = (Phrase Occurrences ÷ Total Document Words) × 100</code><br />
                  If your 1,000-word article mentions &ldquo;solar panels&rdquo; 15 times, the density
                  is <code>(15 ÷ 1,000) × 100 = 1.50%</code>.
                </p>
                <p>
                  <strong>Convention B: Share of Words</strong><br />
                  <code>Share % = (Phrase Occurrences × Words in Phrase ÷ Total Words) × 100</code><br />
                  Because &ldquo;solar panels&rdquo; contains 2 words, 15 occurrences account for 30
                  individual words: <code>(15 × 2 ÷ 1,000) × 100 = 3.00%</code> of the document’s total
                  vocabulary volume.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2>Is There an &ldquo;Ideal&rdquo; Keyword Density?</h2>
              <p>
                The short and honest answer is: <strong>No</strong>. There is no such thing as an
                &ldquo;ideal&rdquo; or &ldquo;perfect&rdquo; keyword density percentage. Any SEO vendor,
                course, or tool claiming that web pages must achieve exactly 1.5%, 2.0%, or 3.0% keyword
                density is relying on outdated myths from decades ago.
              </p>
              <p>
                Google’s official developer documentation and search quality evaluator guidelines
                contain zero references to recommended keyword density ratios. Search engines understand
                synonyms, co-occurring semantic concepts (entities), and context. Writing with an
                artificial density quota in mind almost always harms readability, producing robotic,
                repetitive sentences that alienate actual human readers.
              </p>
            </section>

            <section className={styles.section}>
              <h2>How Many Keywords Should a Webpage Have?</h2>
              <p>
                When planning search engine optimization for a new article or landing page, content
                strategists often ask: &ldquo;How many keywords should I target?&rdquo;
              </p>
              <p>
                Instead of compiling an arbitrary list of twenty keywords to sprinkle throughout your
                copy, adopt a simple plan:
              </p>
              <ul>
                <li>
                  <strong>One Primary Topic per URL:</strong> Every page should address one clear,
                  unambiguous user problem or search intent. If you are writing about how to calculate
                  reading duration, focus exclusively on reading rates, speech speeds, and word counts.
                </li>
                <li>
                  <strong>Natural Semantic Sub-Topics:</strong> Cover all logical secondary questions
                  associated with your core theme. For example, an article on &ldquo;commercial lease
                  agreements&rdquo; naturally mentions terms like &ldquo;security deposit&rdquo;,
                  &ldquo;maintenance obligations&rdquo;, &ldquo;subleasing rights&rdquo;, and
                  &ldquo;escalation clauses&rdquo; without requiring an artificial checklist.
                </li>
                <li>
                  <strong>Match Format to User Expectations:</strong> If searchers expect a quick
                  interactive calculator, provide a fast client-side tool. If searchers need an in-depth
                  legal explanation, provide structured headings, clear examples, and cited regulatory
                  sources.
                </li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>What Keyword Stuffing Looks Like: Google Search Guidelines</h2>
              <p>
                Google defines keyword stuffing as the practice of loading a webpage with keywords or
                numbers in an attempt to manipulate search engine rankings. Keyword stuffing creates an
                extremely negative user experience and can result in automated ranking demotions or
                manual spam actions.
              </p>
              <p>
                Common examples of keyword stuffing include:
              </p>
              <ul>
                <li>
                  <strong>City and State Lists:</strong> Blocks of repeated geographic terms without
                  added value (e.g., &ldquo;We provide plumbing services in Austin, plumbing in Round
                  Rock, plumbing in Cedar Park, and plumbing in Pflugerville&rdquo;).
                </li>
                <li>
                  <strong>Repetitive Phrasing:</strong> Forcing the primary phrase into every heading,
                  caption, and sentence (e.g., &ldquo;If you want the best custom custom shoes, our
                  custom shoe store crafts custom shoes for custom shoe lovers&rdquo;).
                </li>
                <li>
                  <strong>Hidden Text and Off-Screen Blocks:</strong> Hiding lists of keywords using
                  white text on white backgrounds, CSS positioning off-screen, or zero-pixel font sizes.
                </li>
              </ul>
              <p>
                Our tool helps you detect unintended over-repetition before publishing. By inspecting
                your 2-word and 3-word n-gram tables, you can spot repetitive verbal tics and replace
                them with varied phrasing.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Understanding N-Grams and Document Heatmaps</h2>
              <p>
                To provide a truly useful analysis, our engine implements two advanced structural
                features:
              </p>
              <ul>
                <li>
                  <strong>Sentence-Bounded N-Grams:</strong> Many basic online counters blindly slide
                  a multi-word window across an entire document. When sentence 1 ends with &ldquo;...counts
                  fast.&rdquo; and sentence 2 begins with &ldquo;A word counter...&rdquo;, a naive parser
                  creates the meaningless 2-gram &ldquo;fast a&rdquo;. Our engine bounds n-gram
                  generation within grammatical sentence boundaries, ensuring that every detected
                  phrase represents actual continuous prose.
                </li>
                <li>
                  <strong>Decile Heatmap Distribution:</strong> Even if a keyword appears only four
                  times in an article, having all four mentions clustered in the opening two paragraphs
                  feels repetitive to readers. Our 10-decile heatmap divides your document into ten equal
                  slices, highlighting whether your terminology is evenly distributed or clustered in
                  one section.
                </li>
              </ul>
              <p>
                Looking for additional writing utilities? Check out our dedicated{' '}
                <Link href="/word-counter/">Word Counter</Link>, analyze sentence rhythm with our{' '}
                <Link href="/sentence-counter/">Sentence Counter</Link>, verify precise character
                limits with our <Link href="/character-counter/">Character Counter</Link>, or convert
                vertical lists with our <Link href="/comma-separator/">Comma Separator</Link>.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Frequently Asked Questions</h2>
              <div className={styles.faqSection}>
                {faqs.map((faq, idx) => (
                  <div key={idx} className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>{faq.q}</h3>
                    <div className={styles.faqAnswer}>
                      <p>{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </article>

          <HowWeCalculate slug="keyword-density-checker" />
        </div>
      </main>
    </>
  );
}
