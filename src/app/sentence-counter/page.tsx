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
import { SentenceCounter } from '@/components/tool/sentence-counter';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.sentenceCounter || {
  title: 'Sentence Counter – Count Sentences and Paragraphs',
  description:
    'Free sentence counter. Count sentences, paragraphs and lines in any text, see average sentence length and spot long sentences that need splitting.',
  path: '/sentence-counter/',
};

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const faqs = [
  {
    q: 'How do I count sentences in my text?',
    a: 'Paste or type your text directly into the input area. Our engine splits your prose into discrete grammatical sentences in real time. Unlike simplistic counters that split at every single period, our tool recognizes abbreviations like "Dr." or "Mr.", currency amounts like "$4.50", decimal numbers, email addresses, and website domains, keeping your sentence count completely accurate.',
  },
  {
    q: 'How many sentences are in a paragraph?',
    a: 'The digital.gov plain-language guide asks for paragraphs of no more than 150 words in three to eight sentences, and never longer than 250 words (checked 2026-11-22). Outside that guide there is no fixed number.',
  },
  {
    q: 'How long should a sentence be?',
    a: 'The plain-language guide we cite gives no word limit. It asks for one idea per sentence. Set your own threshold here (25 words to start) and look at what it highlights.',
  },
  {
    q: 'How does the counter handle abbreviations like "Mr." or decimal numbers like "3.14"?',
    a: 'We use a two-pass sentence detection architecture. First, the browser segmenter identifies candidate sentence boundaries. Next, our engine runs an abbreviation merge pass: never-final abbreviations (such as Mr., Mrs., Dr., Prof., Sr., Jr.) never terminate a sentence, while maybe-final abbreviations (such as etc., Inc., a.m., p.m.) only end a sentence if followed by an uppercase letter. Decimals and numeric amounts like 3.14 or $4.50 are recognized as numbers and never trigger sentence breaks.',
  },
  {
    q: 'What counts as a paragraph?',
    a: 'By default, our tool defines a paragraph as a block of text separated by a blank line (two line breaks: \\n\\s*\\n). If your text uses single line returns for each new paragraph (common in poem stanzas, dialogue, or spreadsheet data), you can switch the mode to every line in the Paragraphs tab.',
  },
  {
    q: 'How long is 20 sentences in words and pages?',
    a: 'At an assumed 20 words per sentence, 20 sentences are 400 words: about 0.8 pages single-spaced or 1.6 double-spaced, by the 500-words-per-page convention. Change the assumption to your own average.',
  },
  {
    q: 'How long is an average sentence, in words?',
    a: 'It depends on the writer and the text, so we don’t quote one figure. Paste your text and read your own average and median from the tiles.',
  },
  {
    q: 'What is the difference between average and median sentence length?',
    a: 'The average (mean) sentence length is calculated by dividing total words by total sentences. However, a single 60-word run-on sentence can artificially inflate your mean. The median represents the middle sentence length when all sentences are sorted from shortest to longest. If your mean is substantially higher than your median, you have a few unusually long sentences skewing your document.',
  },
  {
    q: 'What is a run-on sentence, and how does this tool find them?',
    a: 'A run-on sentence occurs grammatically when two or more independent clauses are joined without appropriate punctuation or coordinating conjunctions. While an automated tool cannot judge your grammatical intent, our sentence counter highlights all sentences exceeding your custom word threshold (default 25 words). This lets you immediately spot wordy passages and split them.',
  },
  {
    q: 'How do I count lines in my text?',
    a: 'Our built-in lines counter calculates line counts based on physical newline characters (both Unix \\n and Windows \\r\\n). In the Paragraphs tab and the top stat tiles, you can see total physical lines alongside your paragraph and sentence counts.',
  },
];

export default function SentenceCounterPage() {
  const webAppSchema = buildWebApplicationSchema({
    name: 'Sentence Counter',
    description: route.description,
    path: route.path,
    applicationCategory: 'UtilityApplication',
  });

  const faqSchema = buildFaqSchema(faqs);

  const breadcrumbs = [
    { name: 'Tools', path: '/tools/' },
    { name: 'Text & Writing', path: '/tools/#writing' },
    { name: 'Sentence Counter', path: route.path },
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
              Sentence Counter: Count Sentences, Paragraphs and Lines
            </h1>
            <p className={styles.subtitle}>
              Analyze your prose with real-time sentence splitting, paragraph density monitoring,
              and customizable word threshold alerts.
            </p>

            <div className={styles.bluf}>
              Paste your text to count sentences, paragraphs,
              and lines, with your average and longest sentence metrics. Abbreviations like
              &ldquo;Dr.&rdquo; and &ldquo;Mr.&rdquo;, numeric values like 3.14, and initials like
              &ldquo;J. K.&rdquo; do not break a sentence. Sentences longer than your custom limit
              are automatically highlighted so you can refine and split them smoothly.
            </div>
          </header>

          <div className={styles.calculatorWrapper}>
            <ToolShell
              features={[
                'Handles Mr., 3.14 & initials',
                'Editable sentence rules',
                'Long sentences highlighted',
                'Paragraph & line counts',
              ]}
            >
              <SentenceCounter />
            </ToolShell>
          </div>

          <AdSlot slotId="sentence-counter-mid" />

          <article className={`${styles.content} ${typo.prose}`}>
            <section className={styles.section}>
              <h2>How to Use the Paragraph and Sentence Counter</h2>
              <p>
                Our sentence and paragraph counter gives writers, students, editors, and digital
                marketers complete clarity over the structural rhythm of their prose. The interface
                is organized into four specialized tabs:
              </p>
              <ul>
                <li>
                  <strong>Count Tab:</strong> Provides high-level summary tiles including total
                  sentences, paragraphs, lines, words, average sentence length, and longest sentence.
                  Below the tiles, your text is shown with alternating tints, and sentences over your limit are outlined.
                </li>
                <li>
                  <strong>Sentences Tab:</strong> Displays an ordered, numbered breakdown of every
                  sentence in your document alongside its exact word count, an interactive sentence
                  length histogram, and a filtered list of all sentences exceeding your threshold.
                </li>
                <li>
                  <strong>Paragraphs Tab:</strong> Assigns an indexed paragraph number (¶1, ¶2, etc.) to each block
                  and reports its word count, sentence count, and character density. Paragraphs that
                  exceed federal plain-language readability thresholds are flagged with helpful
                  editing notices.
                </li>
                <li>
                  <strong>Rules &amp; Settings Tab:</strong> Gives you total control over sentence
                  tokenization. You can customize the long-sentence threshold (5 to 60 words), enable or disable list-line
                  sentence counting, and add custom abbreviations.
                </li>
              </ul>
              <p>
                Best of all, your writing never leaves your computer. The entire analysis runs
                client-side inside your browser’s JavaScript engine, ensuring total privacy for
                sensitive manuscripts, confidential legal briefs, and proprietary business reports.
              </p>
            </section>

            <section className={styles.section}>
              <h2>How the Sentence Counter Works: Rules and Abbreviation Merging</h2>
              <p>
                Counting sentences sounds deceptively simple: find the periods, exclamation points,
                and question marks, and count them. However, standard browser segmentation APIs
                (such as <code>Intl.Segmenter</code>) frequently fail on everyday text.
              </p>
              <p>
                Consider this real-world test sentence:
              </p>
              <div className={styles.calloutCard}>
                <code>
                  Dr. Smith arrived at 3.30 p.m. on Monday. He paid $4.50 for coffee! Was it worth it?
                  J. K. Rowling wrote it... and then she left. Visit example.com/a.b for more.
                </code>
              </div>
              <p>
                The browser’s own sentence splitter cuts this passage into <strong>8 pieces</strong>, because it stops after &ldquo;Dr.&rdquo;, &ldquo;J.&rdquo; and &ldquo;K.&rdquo;. Our rules give <strong>5 sentences</strong>.
              </p>
              <p>
                These are the rules, with the count before and after:
              </p>

              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Text Sample</th>
                      <th>Browser alone</th>
                      <th>Our rules</th>
                      <th>Rule</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>Dr. Smith arrived at 3.30 p.m. on Monday.</code></td>
                      <td>2</td>
                      <td><strong>1</strong></td>
                      <td>Never-final abbreviation &ldquo;Dr.&rdquo; and numeric time preserved</td>
                    </tr>
                    <tr>
                      <td><code>Mr. and Mrs. Lee met Prof. Ray at 9 a.m. on Monday.</code></td>
                      <td>3</td>
                      <td><strong>1</strong></td>
                      <td>Honorific titles (Mr., Mrs., Prof.) merged unconditionally</td>
                    </tr>
                    <tr>
                      <td><code>The meeting starts at 9 a.m. Bring the slides.</code></td>
                      <td>2</td>
                      <td><strong>2</strong></td>
                      <td>Maybe-final &ldquo;a.m.&rdquo; followed by uppercase letter terminates</td>
                    </tr>
                    <tr>
                      <td><code>We sell apples, pears, etc. and more.</code></td>
                      <td>1</td>
                      <td><strong>1</strong></td>
                      <td>Maybe-final &ldquo;etc.&rdquo; followed by lowercase letter merged</td>
                    </tr>
                    <tr>
                      <td><code>It costs $4.50 per unit. That is fair.</code></td>
                      <td>2</td>
                      <td><strong>2</strong></td>
                      <td>Currency symbol and decimal points recognized as numeric tokens</td>
                    </tr>
                    <tr>
                      <td><code>J. K. Rowling wrote it... and then she left.</code></td>
                      <td>3</td>
                      <td><strong>1</strong></td>
                      <td>Single initials and mid-sentence ellipsis joined to main clause</td>
                    </tr>
                    <tr>
                      <td><code>He shouted, &ldquo;Stop!&rdquo; Then he fled.</code></td>
                      <td>2</td>
                      <td><strong>2</strong></td>
                      <td>Closing quotation marks bound directly to the preceding terminal punctuation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className={styles.section}>
              <h2>What Counts as a Paragraph?</h2>
              <p>
                Different text editors and word processors define paragraphs in conflicting ways.
                In classical typography and digital content management systems (CMS), a paragraph is
                defined by a <strong>blank line</strong> (a double newline sequence <code>\n\s*\n</code>).
                This ensures that visual spacing corresponds to discrete thematic units.
              </p>
              <p>
                However, when copying text from terminal outputs, CSV logs, or poetic verse, each
                single line return represents a distinct line item. Our tool supports both
                conventions seamlessly:
              </p>
              <ul>
                <li>
                  <strong>Blank Line Mode (Default):</strong> Consecutive lines of text are treated
                  as a single paragraph until a blank line is encountered. Use it for text with a gap between paragraphs.
                </li>
                <li>
                  <strong>Every Line Mode:</strong> Every non-empty line is counted as its own
                  individual paragraph. This is ideal for analyzing song lyrics, bulleted lists, and
                  dialogue scripts.
                </li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>Counting Lines vs. Sentences vs. Paragraphs</h2>
              <p>
                Understanding the distinction between lines, sentences, and paragraphs is essential
                when formatting submissions for publishers or academic portals:
              </p>
              <ul>
                <li>
                  <strong>Lines:</strong> Physical layout rows determined by explicit hard breaks
                  (newline characters). On responsive screens, soft wraps do not increment physical
                  line counts.
                </li>
                <li>
                  <strong>Sentences:</strong> Syntactic units conveying a complete thought, typically
                  containing a subject and predicate and ending with terminal punctuation (. ? !).
                </li>
                <li>
                  <strong>Paragraphs:</strong> Thematic groupings of sentences that develop a
                  single central argument or narrative point.
                </li>
              </ul>
              <p>
                If you need to convert lists of items into comma-delimited strings or SQL queries,
                visit our companion <Link href="/comma-separator/">Comma Separator</Link> utility.
              </p>
            </section>

            <section className={styles.section}>
              <h2>How Long Should a Sentence Be?</h2>
              <p>
                There is no fixed limit. The{' '}
                <a
                  href="https://digital.gov/guides/plain-language/writing/clear-short"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  digital.gov plain-language guide
                </a>{' '}
                (checked 2026-11-22) asks for one idea per sentence and sets no word count.
              </p>
              <p>
                So use your own text as the yardstick. Look at your average and your median first. If the average is well
                above the median, a few long sentences are pulling it up, and those are the ones worth reading again. Set the
                threshold a little above your average, then go through the highlighted sentences. Keep a long one when it
                reads easily in one pass. Split it when it holds two ideas, or when you have to go back to its start to
                follow it.
              </p>
            </section>

            <section className={styles.section}>
              <h2>How Many Sentences Are in a Paragraph?</h2>
              <p>
                The digital.gov plain-language guide (checked 2026-11-22) says:
              </p>
              <div className={styles.calloutCard}>
                <p>
                  &ldquo;paragraphs of no more than 150 words in three to eight sentences&rdquo; and &ldquo;never longer than 250 words&rdquo;
                </p>
              </div>
              <p>
                Our Paragraphs tab automatically scans every paragraph block in your document. If a
                paragraph exceeds 150 words, an informational badge indicates that the section may
                benefit from being divided. If a paragraph exceeds 250 words, a prominent warning
                flags the block as exceeding plain-language readability ceilings.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Finding and Fixing Long Sentences</h2>
              <p>
                Our tool simplifies structural editing by providing visual cues and interactive
                navigation:
              </p>
              <ol>
                <li>
                  <strong>Set Your Personal Threshold:</strong> Under the Rules tab, adjust your
                  warning threshold (default: 25 words). It is your number, not a rule.
                </li>
                <li>
                  <strong>Inspect Highlighted Alerts:</strong> Any sentence that surpasses your
                  chosen limit is rendered with an outline and an explicit word badge.
                </li>
                <li>
                  <strong>Read the list:</strong> the Sentences tab numbers every sentence with its word count and marks
                  the long ones.
                </li>
                <li>
                  <strong>Split where the idea changes:</strong> end the sentence before words such as
                  &ldquo;which&rdquo;, &ldquo;and&rdquo; or &ldquo;whereas&rdquo;, then check that each half stands alone.
                </li>
              </ol>
              <p>
                Need to monitor full document metrics? Pair this tool with our free{' '}
                <Link href="/word-counter/">Word Counter</Link>, convert your text into printed sheets with our{' '}
                <Link href="/words-to-pages/">Words to Pages Calculator</Link>, check repeated phrases with our{' '}
                <Link href="/keyword-density-checker/">Keyword Density Checker</Link>, or time a speech with our{' '}
                <Link href="/reading-time-calculator/">Reading &amp; Speaking Time Calculator</Link>.
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

            <section className={styles.section}>
              <h2>Related Writing &amp; Text Calculators</h2>
              <p>
                Explore our full suite of free client-side writing and editing tools:
              </p>
              <ul>
                <li>
                  <Link href="/word-counter/">
                    <strong>Word Counter:</strong>
                  </Link>{' '}
                  Count words, characters, sentences, paragraphs and reading time with essay limits.
                </li>
                <li>
                  <Link href="/words-to-pages/">
                    <strong>Words to Pages Calculator:</strong>
                  </Link>{' '}
                  Convert word counts to printed pages for single, 1.5, and double line spacing.
                </li>
                <li>
                  <Link href="/reading-time-calculator/">
                    <strong>Reading &amp; Speaking Time Calculator:</strong>
                  </Link>{' '}
                  Convert word counts to estimated reading duration and speech practice pacing.
                </li>
                <li>
                  <Link href="/keyword-density-checker/">
                    <strong>Keyword Density Checker:</strong>
                  </Link>{' '}
                  Analyze 1-, 2-, and 3-word n-gram frequencies and track target keyword distribution.
                </li>
                <li>
                  <Link href="/character-counter/">
                    <strong>Character Counter:</strong>
                  </Link>{' '}
                  Count characters with and without spaces, words, sentences, and UTF-8 storage bytes.
                </li>
              </ul>
            </section>
          </article>

          <HowWeCalculate slug="sentence-counter" />
        </div>
      </main>
    </>
  );
}
