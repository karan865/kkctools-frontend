import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import CharacterCounter from '@/components/tool/character-counter';
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

const route = ROUTES.characterCounter;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const faqs = [
  {
    q: 'Do spaces count as characters?',
    a: 'Yes. Every space, tab, non-breaking space and line break is a character. Some forms ask for characters without spaces, so the tool shows both counts.',
  },
  {
    q: 'What is the difference between characters and letters?',
    a: 'Letters refer specifically to alphabetic glyphs (A–Z and Unicode script equivalents like Greek, Cyrillic, or Han ideographs). Characters encompass letters, numeric digits (0–9), punctuation marks, whitespace, symbols, and emoji. A string like "Hi! 123" contains 2 letters, 3 digits, 1 punctuation symbol, and 1 space, totaling 7 characters.',
  },
  {
    q: 'How do I see how many characters I have left?',
    a: 'Switch to the "Check Limit" tab on this tool, choose a platform preset (such as 280 for an X post or 2,200 for an Instagram caption) or type your exact limit into the number box. The live badge calculates your remaining characters as you write and alerts you if your text exceeds the target boundary.',
  },
  {
    q: 'How do I count characters in Word or Google Docs?',
    a: 'In Google Docs, open the count dialog anytime by pressing Ctrl + Shift + C on Windows and ChromeOS, or ⌘ + Shift + C on macOS. In Microsoft Word, your live word count appears in the bottom status bar; click it to open the Word Count dialogue box showing character totals with and without spaces.',
  },
  {
    q: 'How are emoji counted in this character counter?',
    a: 'We count emoji according to user-perceived visual symbols (Unicode extended grapheme clusters). An emoji like a waving hand (👋), a skin-toned thumbs up (👍🏽), or even a multi-person family emoji (👨‍👩‍👧‍👦) counts as exactly 1 character, matching how human readers experience the text.',
  },
  {
    q: 'How do I count Chinese, Japanese, and Korean characters?',
    a: 'Our counter identifies East Asian scripts automatically using Unicode script detection. Han ideographs (Chinese characters and Kanji), Japanese Hiragana and Katakana, and Korean Hangul are counted accurately. In the Details tab, you can also toggle an option to count each CJK ideograph as a separate word.',
  },
  {
    q: 'Do line breaks count as characters?',
    a: 'Yes, paragraph line breaks (LF on Unix/macOS or CRLF on Windows) are characters in digital text. In accordance with Unicode standard grapheme segmentation rules, each line break sequence counts as 1 character in your total character count.',
  },
  {
    q: 'What is the difference between a character and a byte?',
    a: 'A character is a perceived human writing symbol (such as the letter "a" or the emoji "🚀"). A byte is a unit of digital storage (8 bits). In UTF-8 encoding, standard ASCII characters use 1 byte, accented European letters use 2 bytes, East Asian symbols use 3 bytes, and emoji use 4 bytes. Some systems set their limit in bytes, so check which one yours uses.',
  },
  {
    q: 'What do 100, 150, and 255 characters look like?',
    a: 'See the three sample blocks on this page. They are exactly 100, 150 and 255 characters long, with 16, 23 and 36 words.',
  },
  {
    q: 'Is my text stored or sent to a server?',
    a: 'No. This character counter executes 100% client-side inside your web browser using JavaScript. No text is ever uploaded, cached, logged, or transmitted across a network, ensuring complete privacy for sensitive emails, legal briefs, and creative manuscripts.',
  },
  {
    q: 'How do I build a character counter for a textarea in JavaScript?',
    a: 'To build a responsive textarea counter for an HTML textarea, avoid using naive string.length, which splits emoji and complex diacritics into surrogate pairs. Instead, listen for the input event on your textarea and count grapheme clusters using Intl.Segmenter: "const count = [...new Intl.Segmenter(\'en\', { granularity: \'grapheme\' }).segment(textarea.value)].length;". This textarea counter snippet guarantees that multi-byte emoji and accented letters count as single visible characters.',
  },
];

export default function CharacterCounterPage() {
  const breadcrumbs = [
    { name: 'Tools', path: '/tools/' },
    { name: 'Text & Writing', path: '/tools/#writing' },
    { name: 'Character Counter', path: route.path },
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
          <h1 className={styles.title}>
            Character Counter: Characters With and Without Spaces, Words and Limits
          </h1>
          <p className={styles.subtitle}>
            Analyze character length, words, sentences, whitespace, and storage bytes with real-time
            Unicode grapheme accuracy.
          </p>
          <div className={styles.bluf}>
            Paste or type below and the online
            character counter updates as you go: characters with and without spaces, words,
            sentences, lines, and UTF-8 bytes. Set a limit to see how many remaining characters you
            have left before hitting platform boundaries. All emoji count as one character each, the
            way people see them. Your text never leaves this browser.
          </div>
        </header>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Counts emoji correctly',
              'Characters left for any limit',
              'Bytes & CJK counts',
              'Text stays on your device',
            ]}
          >
            <CharacterCounter />
          </ToolShell>
        </div>

        <HowWeCalculate slug="character-counter" />

        <AdSlot slotId="char-calc-mid-ad" format="horizontal" />

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>How to Use the Online Character Counter</h2>
            <p>
              Our free <strong>online character counter</strong> provides instant, accurate text
              metrics without requiring sign-up or software installation. To get started, type or
              paste your draft into the text area above. As you enter text, every metric updates
              automatically in real time.
            </p>
            <p>
              The utility features three specialized workspaces accessible via the top navigation tabs:
            </p>
            <ul>
              <li>
                <strong>1. Character Count:</strong> The default workspace displaying core headline
                metrics including total characters, characters excluding whitespace, word count,
                sentence count, paragraph count, and estimated silent reading time.
              </li>
              <li>
                <strong>2. Check Limit:</strong> A dedicated limit monitoring interface. Set custom
                length limits or select one-click presets for popular social networks and publishing
                platforms to track your remaining character buffer.
              </li>
              <li>
                <strong>3. Text Details:</strong> In-depth linguistic and technical diagnostics,
                including Unicode classification breakdowns (letters, digits, punctuation, and
                symbols), East Asian script detection (Chinese, Japanese, and Korean), UTF-8 storage
                bytes, character frequency rankings, and per-paragraph lengths.
              </li>
            </ul>
            <p>
              Your text remains completely confidential. Because calculations run entirely in local
              browser memory using native Web APIs, zero bytes of text are ever uploaded to a remote
              server or stored in an external database.
            </p>
          </section>

          <section className={styles.section}>
            <h2>What Counts as a Character?</h2>
            <p>
              In digital typography and computer science, a <strong>character</strong> is an
              individual informational unit that represents a grapheme, punctuation glyph, numerical
              digit, or structural whitespace symbol. When using a <strong>characters counter</strong>,
              it is essential to recognize what elements contribute to your total:
            </p>
            <ul>
              <li>
                <strong>Alphabetic Letters:</strong> Standard Latin characters (A–Z, a–z) as well as
                international alphabets (Cyrillic, Greek, Arabic, Devanagari, etc.).
              </li>
              <li>
                <strong>Whitespace Characters:</strong> Standard horizontal spaces, tab stops
                (U+0009), non-breaking spaces (U+00A0), thin spaces (U+2009), and carriage returns
                or newline markers (U+000A).
              </li>
              <li>
                <strong>Punctuation &amp; Typography:</strong> Periods, commas, semicolons, colons,
                hyphens, en-dashes, em-dashes, and typographical quotes.
              </li>
              <li>
                <strong>Numbers &amp; Mathematical Symbols:</strong> Arabic numerals (0–9), math
                operators (+, −, ×, ÷, =), and fraction characters.
              </li>
              <li>
                <strong>Emoji &amp; Pictograms:</strong> Visually rendered pictographs, flag sequences,
                and modifier combinations.
              </li>
            </ul>
            <p>
              Unlike legacy counting scripts that evaluate raw UTF-16 code units, our engine follows
              the Unicode Standard Annex #29 specification to treat each human-perceived character
              unit (grapheme cluster) as a single character.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Characters With and Without Spaces</h2>
            <p>
              Understanding the difference between <strong>character counts with spaces</strong> and{' '}
              <strong>characters without spaces</strong> is critical when submitting work across
              various academic, literary, and commercial platforms.
            </p>
            <p>
              Consider the classic pangram sentence:
            </p>
            <div className={styles.sampleBlock}>
              &quot;The quick brown fox jumps over the lazy dog.&quot;
              <span className={styles.sampleMeta}>
                44 Characters with spaces · 36 Characters without spaces · 9 Words
              </span>
            </div>
            <p>
              In this sentence, there are 35 alphabetic letters, 1 terminal period, and 8 individual
              word spaces. If your submission guidelines evaluate characters with spaces, your total
              is 44. If the guidelines exclude whitespace, your total is 36.
            </p>
            <p>
              Some forms, journals and translation jobs ask for the count without spaces. If a limit doesn’t say which count it means, assume spaces count.
            </p>
          </section>

          <section className={styles.section}>
            <h2>How Many Characters Do I Have Left? (Checking Character Limits)</h2>
            <p>
              One of the most frequent writing challenges is tracking <strong>remaining characters</strong>{' '}
              against a strict publishing boundary. When preparing social posts, advertising
              copy, or meta tags, exceeding a limit can truncate your message or cause submission
              errors.
            </p>
            <p>
              Our <strong>character limit</strong> mode calculates your safety margin with live
              mathematical feedback:
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Platform / Format</th>
                    <th>Verified Character Limit</th>
                    <th>Counting Model</th>
                    <th>Source Reference</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>X (Twitter) Post</strong></td>
                    <td>280 weighted units</td>
                    <td>Links = 23, CJK/Emoji = 2</td>
                    <td>Official X Documentation</td>
                  </tr>
                  <tr>
                    <td><strong>Instagram Caption</strong></td>
                    <td>2,200 characters</td>
                    <td>Standard graphemes</td>
                    <td>Meta Graph API Reference</td>
                  </tr>
                  <tr>
                    <td><strong>Threads Post</strong></td>
                    <td>500 characters</td>
                    <td>Standard graphemes</td>
                    <td>Meta Developers Reference</td>
                  </tr>
                  <tr>
                    <td><strong>LinkedIn Post Update</strong></td>
                    <td>3,000 characters</td>
                    <td>Standard graphemes</td>
                    <td>LinkedIn Help Center</td>
                  </tr>
                  <tr>
                    <td><strong>YouTube Video Title</strong></td>
                    <td>100 characters</td>
                    <td>Standard graphemes</td>
                    <td>YouTube Support Documentation</td>
                  </tr>
                  <tr>
                    <td><strong>SMS Text (Single GSM-7)</strong></td>
                    <td>160 characters</td>
                    <td>GSM 7-bit character set</td>
                    <td>Telecommunications Standard</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              X counts links as 23 and emoji as 2, so use our <Link href="/twitter-character-counter/">Twitter (X) Character Counter</Link> for posts and threads.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Emoji, Accented Letters, and Unicode Graphemes</h2>
            <p>
              Modern digital communication relies heavily on emoji and multilingual typography.
              However, traditional counting software often miscounts these symbols.
            </p>
            <p>
              In JavaScript and standard UTF-16 encoding, characters outside the Basic Multilingual
              Plane are stored as two separate 16-bit code units known as surrogate pairs. A basic
              emoji like a smiling face (😀) has a <code>string.length</code> of 2. Complex emoji
              sequences—such as skin tone modifiers or family clusters—use zero-width joiners (ZWJ)
              to combine multiple scalar values into one symbol:
            </p>
            <div className={styles.sampleBlock}>
              👨‍👩‍👧‍👦 (Family: Man, Woman, Girl, Boy)
              <span className={styles.sampleMeta}>
                1 Human Character · 7 Code Points · 11 UTF-16 Units · 25 UTF-8 Bytes
              </span>
            </div>
            <p>
              A naive counter reports that the family emoji contains 11 characters. Our counter
              leverages modern internationalization standards (<code>Intl.Segmenter</code>) to
              recognize that the family symbol represents exactly <strong>1 visible character</strong>.
              Similarly, accented characters such as &quot;é&quot; can be written as a single code point
              (U+00E9 in NFC form) or as the letter &quot;e&quot; combined with an acute accent (U+0065
              + U+0301 in NFD form). Our tool normalizes text to Unicode NFC so character counts
              remain consistent regardless of how your operating system input method structures
              diacritics.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Counting Chinese, Japanese, and Korean Characters</h2>
            <p>
              Asian typography behaves differently from Western alphabetic languages. In Chinese
              (Hanzi), Japanese (Kanji, Hiragana, Katakana), and Korean (Hangul), words are rarely
              delimited by spaces.
            </p>
            <p>
              When utilizing our <strong>chinese character counter</strong> functionality, you can
              distinguish between different East Asian scripts in the Details tab. For instance, in
              the Japanese phrase:
            </p>
            <div className={styles.sampleBlock}>
              &quot;日本語 text 👍🏽!&quot;
              <span className={styles.sampleMeta}>
                11 Characters with spaces · 9 Characters without spaces · 3 Han (Kanji) Ideographs
              </span>
            </div>
            <p>
              In East Asian publishing, word counts are traditionally calculated on a per-character
              basis rather than by space-delimited word tokens. In the Details tab, you can enable
              the &quot;Count each CJK character as 1 word&quot; option to align with East Asian document
              metrics.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Characters vs. UTF-8 Bytes</h2>
            <p>
              Writers often assume that one character equals one byte of storage. While this was true
              under the historical ASCII standard of the 1960s, modern web infrastructure operates on
              variable-width encodings, most notably <strong>UTF-8</strong>.
            </p>
            <p>
              In UTF-8, characters consume between 1 and 4 bytes depending on their position in the
              Unicode code space:
            </p>
            <ul>
              <li><strong>1 Byte:</strong> Standard ASCII characters (A–Z, 0–9, basic English punctuation).</li>
              <li><strong>2 Bytes:</strong> Latin accented characters (é, ñ, ü), Greek, Cyrillic, Hebrew, and Arabic.</li>
              <li><strong>3 Bytes:</strong> Most Asian ideographs (Chinese, Japanese, Korean) and currency symbols like the Indian Rupee (₹) or Euro (€).</li>
              <li><strong>4 Bytes:</strong> Emoji, mathematical symbols, and historical scripts.</li>
            </ul>
            <p>
              Byte length matters when a database column or an API sets its limit in bytes. An SMS works differently again: one message holds 160 characters of the basic GSM alphabet, or 70 once it contains a character outside it.
            </p>
          </section>

          <section className={styles.section}>
            <h2>What 100, 150, and 255 Characters Look Like</h2>
            <p>
              When writing to a target length, having calibrated visual examples helps you gauge
              sentence rhythm and density. Below are three human-written sample blocks calibrated to
              exact character lengths (including spaces and punctuation):
            </p>

            <div className={styles.calloutCard}>
              <h4>100 Characters Text Example</h4>
              <p className={styles.sampleBlock}>
                Clear writing uses simple words, fresh verbs, and short sentences to convey ideas with direct punch.
              </p>
              <span className={styles.sampleMeta}>
                Exactly 100 Characters (with spaces) · 84 Without spaces · 16 Words
              </span>
            </div>

            <div className={styles.calloutCard}>
              <h4>150 Characters Text Example </h4>
              <p className={styles.sampleBlock}>
                Concise sentences keep readers engaged from start to finish. Focus on active verbs, cut unnecessary filler, and present your ideas with crisp clarity.
              </p>
              <span className={styles.sampleMeta}>
                Exactly 150 Characters (with spaces) · 127 Without spaces · 23 Words
              </span>
            </div>

            <div className={styles.calloutCard}>
              <h4>255 Characters Example </h4>
              <p className={styles.sampleBlock}>
                Writing effectively requires deliberate focus on clarity and structure. Every sentence must serve a distinct purpose, guiding the reader smoothly from one concept to the next. When drafts are trimmed of redundant filler, the core message shines clean.
              </p>
              <span className={styles.sampleMeta}>
                Exactly 255 Characters (with spaces) · 219 Without spaces · 36 Words
              </span>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Character Count in Microsoft Word and Google Docs</h2>
            <p>
              If you are drafting content in an office suite before publishing online, you can
              access built-in character count tools using standard application shortcuts:
            </p>
            <h3>Google Docs</h3>
            <p>
              Google Docs counts words, characters with spaces, and characters without spaces for
              your entire document or any highlighted passage:
            </p>
            <ul>
              <li><strong>Keyboard Shortcut:</strong> Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd> on Windows or ChromeOS, or <kbd>⌘</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd> on macOS.</li>
              <li><strong>Menu Navigation:</strong> Click <strong>Tools</strong> in the top menu and select <strong>Word count</strong>.</li>
              
            </ul>

            <h3>Microsoft Word</h3>
            <p>
              In Microsoft Word for Windows, macOS, and Word for the Web:
            </p>
            <ul>
              <li><strong>Status Bar:</strong> Look at the lower-left status bar to view your live word count.</li>
              <li><strong>Dialogue Box:</strong> Click the word count indicator on the status bar to open the full <strong>Word Count</strong> box, which reports pages, words, characters (no spaces), characters (with spaces), paragraphs, and lines.</li>
              <li><strong>Mac Menu:</strong> Select text, then choose <strong>Tools &gt; Word Count</strong> from the application menu bar.</li>
            </ul>
            <p>
              Looking for more specialized writing analysis? Check your vocabulary with our{' '}
              <Link href="/word-counter/">Word Counter</Link>, analyze sentence rhythm with our{' '}
              <Link href="/sentence-counter/">Sentence Counter</Link>, inspect phrase frequency with our{' '}
              <Link href="/keyword-density-checker/">Keyword Density Checker</Link>, optimize social media posts with our{' '}
              <Link href="/twitter-character-counter/">Twitter (X) Character Counter</Link>, or format columns with our{' '}
              <Link href="/comma-separator/">Comma Separator</Link>. When working with essay or form guidelines, you can also{' '}
              <Link href="/characters-to-words/">convert characters to words</Link> to estimate article length or{' '}
              <Link href="/words-to-pages/">calculate words to printed pages</Link>. Explore our full suite in the{' '}
              <Link href="/tools/#writing">Text &amp; Writing Directory</Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {faqs.map((faq, index) => (
                <div key={index} className={styles.calloutCard} style={{ marginBottom: '14px' }}>
                  <h4>{faq.q}</h4>
                  <p>{faq.a}</p>
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
                <Link href="/characters-to-words/">
                  <strong>Characters to Words Converter:</strong>
                </Link>{' '}
                Convert character counts to estimated words with and without spaces across various writing formats.
              </li>
              <li>
                <Link href="/words-to-pages/">
                  <strong>Words to Pages Calculator:</strong>
                </Link>{' '}
                Convert word counts to printed pages for single, 1.5, and double line spacing.
              </li>
              <li>
                <Link href="/sentence-counter/">
                  <strong>Sentence Counter:</strong>
                </Link>{' '}
                Count sentences, paragraphs and lines with editable abbreviation rules.
              </li>
              <li>
                <Link href="/reading-time-calculator/">
                  <strong>Reading &amp; Speaking Time Calculator:</strong>
                </Link>{' '}
                Convert word counts to estimated silent reading and spoken presentation durations.
              </li>
            </ul>
          </section>
        </article>
      </div>
    </main>
  );
}
