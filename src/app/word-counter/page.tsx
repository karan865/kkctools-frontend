import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import WordCounter from '@/components/tool/word-counter';
import ToolShell from '@/components/tool/shared/ToolShell';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import styles from './page.module.css';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';

export const dynamic = 'force-static';

const route = ROUTES.wordCounter;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const faqs = [
  {
    q: 'How does this free word counter work?',
    a: 'Simply type or paste your prose into the text box. The counter analyzes your text client-side using Unicode-standard lexical segmentation, instantly calculating words, characters with and without spaces, sentences, paragraphs, and reading duration.',
  },
  {
    q: 'How do I check the word count on Google Docs?',
    a: 'In Google Docs on your desktop, click "Tools" in the top navigation bar, then select "Word count". You can also check the box that says "Display word count while typing" to keep a live tracker pinned to the lower-left corner of your document. On ChromeOS and Windows, press Ctrl + Shift + C; on macOS, press ⌘ + Shift + C.',
  },
  {
    q: 'How do I check the word count in Microsoft Word?',
    a: 'In Microsoft Word, the status bar at the bottom of the window shows the word count. Click it to open the Word Count box with characters, lines and paragraphs. On a Mac you can also select text and choose Tools, then Word Count.',
  },
  {
    q: 'Do hyphenated words count as one word or two?',
    a: 'This counter treats a hyphenated compound such as well-known or state-of-the-art as one word by default. Turn the option off to count each part separately. If a grader or editor gave you a rule, follow that rule.',
  },
  {
    q: 'Do numbers count as words in an essay?',
    a: 'In this counter, yes: figures such as 2026, 2,500 and 15.4 each count as one word. A toggle leaves standalone numbers out. Check your assignment rules, because some instructors exclude numbers.',
  },
  {
    q: 'How are contractions counted?',
    a: 'It’s, don’t, we’ve and they’re count as one word each, with straight or curly apostrophes.',
  },
  {
    q: 'What is the ideal word count for a college essay?',
    a: 'There is no single ideal length. Use the limit printed in your prompt or syllabus: type it as the target in the Essay Limit tab, and add a minimum and maximum if you were given a range. The bar then shows how many words are left or over.',
  },
  {
    q: 'How fast does the average person read?',
    a: 'Pace varies by reader and text. The reading-time default here is an editable 238 words per minute, a published estimate we are still verifying, so treat the minutes as a rough guide. You can measure your own pace with our Reading Time Calculator.',
  },
  {
    q: 'Why does my word count differ between Google Docs and Microsoft Word?',
    a: 'Tools use different rules for hyphens, numbers, dashes and links. Google Docs also leaves headers, footers and footnotes out of its count unless you select that text. Compare the same text under the same rules before worrying about a small gap.',
  },
  {
    q: 'What are stop words, and why ignore them?',
    a: 'Stop words are high-frequency grammatical particles—such as "the", "and", "is", "in", and "of"—that provide syntactic structure but carry little topical meaning. In keyword density and phrase frequency analysis, ignoring stop words lets you see the core thematic vocabulary driving your draft rather than common English function words. In this tool, filtering stop words affects only the frequency table and never changes your headline word count.',
  },
  {
    q: 'Is my text safe and private on this site?',
    a: 'Yes. The counting runs in your browser. Your text is not uploaded or stored.',
  },
];

export default function WordCounterPage() {
  const breadcrumbs = [
    { name: 'Tools', path: '/tools/' },
    { name: 'Text & Writing', path: '/tools/#writing' },
    { name: 'Word Counter', path: route.path },
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
          <h1 className={styles.title}>Word Counter: Count Words, Characters and Reading Time</h1>
          <p className={styles.subtitle}>
            A fast, private online word counter and text analyzer. Track word quotas, check essay limits, inspect
            keyword density, and calculate speech durations in your browser.
          </p>

          <div className={styles.bluf}>
            Paste or type below and this free word counter shows words,
            characters, sentences, paragraphs, and reading time as you write. Set an essay word limit to track how many
            words you have left. Hyphenated words count as one and numbers count as words by default, with instant
            toggles to customize rules. Your text stays entirely on your device.
          </div>
        </header>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Essay word limit bar',
              'Reading & speaking time',
              'Word frequency with ignore list',
              'Text stays on your device',
            ]}
          >
            <WordCounter />
          </ToolShell>
        </div>

        <AdSlot slotId="word-counter-top" />

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>How to Use the Free Online Word Counter</h2>
            <p>
              For university research essays, manuscript chapters, and web articles, our tool gives you four dedicated analytical perspectives:
            </p>
            <ol>
              <li>
                <strong>Word Count Mode (Default):</strong> Type or paste your document to view live word counts,
                character totals (with and without spaces), sentence frequencies, paragraph numbers, and reading
                durations.
              </li>
              <li>
                <strong>Essay Limit Mode:</strong> Choose a target assignment limit (such as 500, 1,000, or 2,500
                words) or enter a custom requirement. The live progress bar shows your percentage completion and tells
                you exactly how many words remain or how much you have overshot your ceiling.
              </li>
              <li>
                <strong>Word Frequency &amp; N-Gram Mode:</strong> Identify overused vocabulary, repetitive phrasing,
                and keyword distributions. View 1-word, 2-word, and 3-word phrase rankings with an editable stop-words
                filter.
              </li>
              <li>
                <strong>Reading &amp; Speaking Time Mode:</strong> Plan speeches, podcast scripts, and executive
                briefings with confidence. Adjust silent reading and verbal speaking tempos to gauge presentation
                timing down to the exact second.
              </li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2>Word Counter vs Character Counter: Which Metric Matters?</h2>
            <p>
              Writers frequently ask when they should track words versus characters. The choice is governed by the
              medium and submission guidelines:
            </p>
            <ul>
              <li>
                <strong>When Words Matter:</strong> Academic essays, journal submissions, novels, magazine features,
                and speechwriting are almost universally evaluated by word count. Words measure human intellectual
                scope and narrative pacing. For example, a 1,000-word essay requires consistent depth regardless of
                whether you use short or long vocabulary.
              </li>
              <li>
                <strong>When Characters Matter:</strong> Digital input fields, online forms, database entries, SMS
                text messaging, and social media platforms (such as X/Twitter and Instagram) enforce strict character
                boundaries. In digital systems, storage memory and visual layout boxes have fixed character constraints.
              </li>
            </ul>
            <p>
              Our tool displays both metrics simultaneously, ensuring your text satisfies academic guidelines while
              fitting technical form constraints.
            </p>
          </section>

          <section className={styles.section}>
            <h2>How Words Are Counted: Hyphens, Numbers, and Contractions</h2>
            <p>
              Counting words might seem straightforward, but digital boundary rules vary across software programs. Our
              engine adheres to recognized academic standards:
            </p>
            <ul>
              <li>
                <strong>Contractions (Count = 1):</strong> Words containing apostrophes—such as <em>it’s</em>,{' '}
                <em>don’t</em>, <em>they’re</em>, or <em>o’clock</em>—count as a single word. Both straight ASCII quotes
                (<code>&apos;</code>) and typographic curly quotes (<code>’</code>) are supported.
              </li>
              <li>
                <strong>Hyphenated Compounds (Count = 1):</strong> Multi-part compound adjectives like{' '}
                <em>state-of-the-art</em>, <em>well-known</em>, or <em>first-rate</em> are joined into single words,
                so the count matches how most people read them. You can toggle this off in
                our settings bar if your grader treats hyphens as word separators.
              </li>
              <li>
                <strong>Numbers and Numerals (Count = 1):</strong> Numeric strings like <em>2026</em>, <em>2,500</em>,
                or <em>99.9%</em> represent standalone lexical quantities and count as words. To write out numeric amounts as spelled words or check formats, use our <Link href="/numbers-to-words/">Numbers to Words Converter</Link>. If your document contains data lists or column items, you can clean them up with our <Link href="/comma-separator/">Comma Separator</Link>.
              </li>
              <li>
                <strong>Dashes and Punctuation (Count = 0):</strong> Em dashes (—) and en dashes (–) serve as syntactic
                breaks and are never counted as words themselves.
              </li>
              <li>
                <strong>Web URLs and Email Addresses (Count = 1):</strong> Complex links like{' '}
                <code>https://www.example.com/research</code> are pre-tokenized to count as single words rather than
                being broken into multiple slash-separated fragments.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Essay Word Counter: Hitting Your Target Word Limit</h2>
            <p>
              The right length is the one your prompt states. Open the <strong>Essay Limit</strong> tab, type the target
              and, if you have them, the minimum and maximum. The bar fills as you write.
            </p>
            <ul>
              <li>
                <strong>Under:</strong> a 380-word draft with a 500-word target shows 120 words to go (76%).
              </li>
              <li>
                <strong>Over:</strong> a 535-word draft with a 500-word maximum shows 35 over.
              </li>
              <li>
                <strong>In range:</strong> between your minimum and maximum, the box confirms that the text fits.
              </li>
            </ul>
            <p>
              When you are over, cut repeated points first, then shorten sentences that say one thing twice. When you are
              under, look for a claim that still needs an example or a reason instead of padding the sentences you
              already have. Leave a small margin if the form that receives the essay may count hyphens or numbers
              differently.
            </p>
            </section>

          <section className={styles.section}>
            <h2>How to Check and Show Word Count in Google Docs</h2>
            <p>
              To check, view, or continuously display word count in Google Docs on desktop, follow these steps:
            </p>
            <ol>
              <li>
                Open your document in <strong>Google Docs</strong> in a desktop web browser.
              </li>
              <li>
                Click the <strong>Tools</strong> menu located in the top application navigation bar.
              </li>
              <li>
                Select <strong>Word count</strong> from the drop-down list.
              </li>
              <li>
                The box shows words, characters and pages.
              </li>
              <li>
                <strong>Show word count while typing:</strong> In the Word count dialogue, check the box labelled <strong>&quot;Display word count while typing&quot;</strong> and click <strong>OK</strong>. A persistent word counter will remain visible in the lower-left corner of your document window.
              </li>
              <li>
                <strong>Keyboard shortcuts:</strong> Press <span className={styles.kbd}>Ctrl</span> + <span className={styles.kbd}>Shift</span> + <span className={styles.kbd}>C</span> on Windows and ChromeOS, or <span className={styles.kbd}>⌘ Command</span> + <span className={styles.kbd}>Shift</span> + <span className={styles.kbd}>C</span> on macOS to open the count.
              </li>
              <li>
                <strong>Count specific sections:</strong> Select the text before opening the box. Google Docs leaves out headers, footers, and footnotes from its count unless you select a section.
              </li>
            </ol>
            <p>
              <small>Source: Google Docs Help (support.google.com/docs/answer/39003, checked 2026-11-25; answer/179738, checked 2026-11-22).</small>
            </p>
          </section>

          <section className={styles.section}>
            <h2>How to Check and Show Word Count in Microsoft Word</h2>
            <p>
              To view or inspect live word counts in Microsoft Word follow these steps:
            </p>
            <ol>
              <li>
                Look at the <strong>Status Bar</strong> located at the very bottom left of your Microsoft Word window. The total word count is displayed continuously in real time as you type.
              </li>
              <li>
                Click directly on the word count indicator on the status bar to open the full <strong>Word Count</strong> dialogue box. It lists characters, paragraphs, and lines.
              </li>
              <li>
                <strong>Count selected text:</strong> Highlight any sentence or paragraph. The status bar shows the count for the selection and for the whole document.
              </li>
              <li>
                <strong>macOS menu:</strong> In Microsoft Word for Mac, you can also select your text and click <strong>Tools</strong> &gt; <strong>Word Count</strong> from the top menu bar.
              </li>
            </ol>
            <p>
              <small>Source: Microsoft Support, &quot;Show word count&quot;, checked 2026-11-25. The page lists no keyboard shortcut.</small>
            </p>
          </section>

          <section className={styles.section}>
            <h2>Why Word Counts Differ Between Tools</h2>
            <p>
              If you paste the exact same article into Google Docs, Microsoft Word, and an online text editor, you will frequently observe small differences in total word count. These discrepancies occur because different software programs apply contrasting lexical rules:
            </p>
            <ul>
              <li>
                <strong>Hyphenated compound words:</strong> Our default rule treats compound adjectives like <em>well-known</em> or <em>state-of-the-art</em> as single words, matching reader perception. With hyphen join turned off, they split into multiple individual words.
              </li>
              <li>
                <strong>Numbers and digits:</strong> Our engine counts standalone figures like <em>2,500</em> or <em>2026</em> as words by default, while some academic essay checkers exclude standalone digits.
              </li>
              <li>
                <strong>Headers, footers, and footnotes:</strong> Google Docs excludes headers, footers, and footnotes from its headline word count by default.
              </li>
              <li>
                <strong>Web links and email addresses:</strong> Modern text analyzers treat full URLs (e.g. <code>https://example.com/research</code>) as single lexical tokens, whereas older tools split links at punctuation marks, periods, and forward slashes.
              </li>
            </ul>
            <p>
              To see these rules in action, consider our engine&apos;s benchmark fixture sentence:
            </p>
            <div className={styles.calloutCard}>
              <p>
                <code>&quot;It’s a well-known fact — numbers like 2,500 and e-mail count.&quot;</code>
              </p>
              <ul>
                <li><strong>Our engine default (hyphens joined, numbers counted):</strong> exactly <strong>10 words</strong>.</li>
                <li><strong>Hyphen join OFF:</strong> <em>well-known</em> and <em>e-mail</em> split, producing <strong>12 words</strong>.</li>
                <li><strong>Numbers toggle OFF:</strong> <em>2,500</em> is excluded, yielding <strong>9 words</strong>.</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Reading and Speaking Time Estimates</h2>
            <p>
              Minutes = words ÷ words per minute. The tab uses two editable paces, and neither is a fact about you:
            </p>
            <ul>
              <li>
                <strong>Reading, 238 words per minute:</strong> a published estimate we are still verifying. At that pace
                1,000 words take about 4 minutes 12 seconds.
              </li>
              <li>
                <strong>Speaking, 130 words per minute:</strong> an example pace. At that pace 650 words take 5 minutes.
              </li>
            </ul>
            <p>
              For pauses, slides, a rehearsal timer and a way to measure your own pace, use the{' '}
              <Link href="/reading-time-calculator/">Reading &amp; Speaking Time Calculator</Link>.
            </p>
            </section>

          <section className={styles.section}>
            <h2>Word Frequency and Keyword Density Analysis</h2>
            <p>
              Good writing balances vocabulary variety with thematic focus. Overusing specific adjectives or nouns can
              make prose feel monotonous, while digital copywriters need to ensure target search terms are represented
              organically.
            </p>
            <p>
              Our &quot;Word Frequency&quot; tab analyzes 1-word, 2-word, and 3-word n-gram combinations across your
              text. By enabling the curated English stop-words filter, common grammatical particles (like <em>the</em>,{' '}
              <em>and</em>, <em>is</em>, and <em>of</em>) are excluded, instantly revealing the core conceptual nouns
              and verbs driving your manuscript.
            </p>
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

          <HowWeCalculate slug="word-counter" />

          <section className={styles.section}>
            <h2>Related Writing &amp; Text Calculators</h2>
            <p>
              Explore our full suite of free client-side writing and editing tools:
            </p>
            <ul>
              <li>
                <Link href="/sentence-counter/">
                  <strong>Sentence Counter:</strong>
                </Link>{' '}
                Count sentences, paragraphs and lines, with smart abbreviation rules and long-sentence alerts.
              </li>
              <li>
                <Link href="/reading-time-calculator/">
                  <strong>Reading &amp; Speaking Time Calculator:</strong>
                </Link>{' '}
                Convert word counts to minutes and rehearse speeches with an interactive timer.
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
              <li>
                <Link href="/words-to-pages/">
                  <strong>Words to Pages Calculator:</strong>
                </Link>{' '}
                Convert word counts to printed pages for single, 1.5, and double spacing across Letter and A4 paper.
              </li>
              <li>
                <Link href="/characters-to-words/">
                  <strong>Characters to Words Converter:</strong>
                </Link>{' '}
                Convert character counts to words and calibrate against your personal writing average.
              </li>
              <li>
                <Link href="/twitter-character-counter/">
                  <strong>Twitter (X) Character Counter:</strong>
                </Link>{' '}
                Count tweets with authentic X weighted rules and split long text into sequential threads.
              </li>
              <li>
                <Link href="/tools/#writing">
                  <strong>Text &amp; Writing Hub:</strong>
                </Link>{' '}
                Browse all writing utilities.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
