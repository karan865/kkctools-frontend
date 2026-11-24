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
import {
  calculateSpeechTime,
  generateSpeechTable,
  DEFAULT_SILENT_WPM,
  DEFAULT_ALOUD_WPM,
  DEFAULT_PRESENTATION_WPM,
  DEFAULT_SLOW_SPEECH_WPM,
} from '@/lib/reading-time-engine';
import { ReadingTimeCalculator } from '@/components/tool/reading-time-calculator';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.readingTimeCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const faqs = [
  {
    q: 'How long does it take to read 500, 1,000, or 2,000 words?',
    a: 'At 238 words per minute (a published estimate, being verified), 500 words take about 2 minutes 6 seconds, 1,000 words 4 minutes 12 seconds and 2,000 words 8 minutes 24 seconds. At an example presentation pace of 130, they take 3:51, 7:42 and 15:23. Both paces are editable.',
  },
  {
    q: 'How many words is a 4, 5, or 7-minute speech?',
    a: 'At an example pace of 130 words per minute: 520 words for 4 minutes, 650 for 5 and 910 for 7. At a slower 110: 440, 550 and 770. Time yourself to find your own pace.',
  },
  {
    q: 'What is the average silent reading speed?',
    a: 'A published meta-analysis (Brysbaert, 2019) is often cited for about 238 words per minute for non-fiction and 260 for fiction. We have not confirmed those figures from the paper yet, so the calculator labels them as estimates and lets you change them.',
  },
  {
    q: 'What is the average speaking rate for presentations?',
    a: 'We found no official source for one average, so our 110, 130 and 150 words per minute are labelled example paces. Use the Measure My Pace tab, read the passage aloud, and use your own number.',
  },
  {
    q: 'How long is 500 words in time and printed pages?',
    a: 'About 2 minutes 6 seconds to read at 238 words per minute (a published estimate, being verified) and 3 minutes 51 seconds to say at 130. On paper it is about 1 page single-spaced or 2 double-spaced, by the 500-words-per-page convention.',
  },
  {
    q: 'How many printed pages is a 5-minute speech?',
    a: 'At 130 words per minute a 5-minute speech is 650 words: about 1.3 pages single-spaced or 2.6 double-spaced, by the 500-words-per-page convention.',
  },
  {
    q: 'How long does it take to read 50, 100, or 300 words?',
    a: 'At 238 words per minute (a published estimate, being verified): 13 seconds, 25 seconds and 1 minute 16 seconds. Spoken at 130 words per minute: 23 seconds, 46 seconds and 2 minutes 18 seconds.',
  },
  {
    q: 'What is the difference between reading silently and reading aloud?',
    a: 'Reading aloud is slower for most people because every word has to be spoken. The calculator keeps separate, editable paces for each.',
  },
  {
    q: 'How do I accurately time my own speech rehearsal?',
    a: 'Use the Practice Timer tab in this tool. Set your target duration, press Start, and rehearse your speech aloud with normal vocal inflection and pauses. If your elapsed delivery overruns the target, our timer flags the exact excess so you know whether to trim sentences or adjust your pacing.',
  },
  {
    q: 'How do pauses and slide transitions affect speech duration?',
    a: 'They add to the base time: total = base × (1 + pause %) + slides × seconds per slide. Set both from your own rehearsal.',
  },
  {
    q: 'Can this tool read my text aloud using text-to-speech audio?',
    a: 'No. This tool calculates time estimates and provides a rehearsal stopwatch for human speakers and readers. It does not play synthesized computer audio or store your text.',
  },
];

const REFERENCE_WORD_COUNTS = [50, 100, 300, 500, 1000, 2000, 5000];

export default function ReadingTimeCalculatorPage() {
  const speechTable = generateSpeechTable();

  const breadcrumbs = [
    { name: 'Tools', path: '/tools/' },
    { name: 'Text & Writing', path: '/tools/#writing' },
    { name: 'Reading Time Calculator', path: route.path },
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

        <div className={styles.intro}>
          <h1 className={styles.title}>
            Reading Time Calculator: How Long to Read or Say Any Text
          </h1>
          <p className={styles.subtitle}>
            Accurate reading duration and speaking time calculator. Turn any word count into minutes and seconds,
            calculate the exact words needed for timed speeches, and rehearse with an interactive practice stopwatch.
          </p>

          <div className={styles.bluf}>
            <strong>Quick Answer (BLUF):</strong> Reading time equals total words divided by words per minute (<code>Time = Words ÷ WPM</code>).
            Enter any word count or paste your script to instantly see how long it takes to read silently, narrate aloud, or deliver as a public presentation,
            or switch to Speech Length to calculate the exact words required for a 3, 5, or 10-minute talk.
            At an example pace of 130 words per minute, a 5-minute speech is <strong>650 words</strong>.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Silent, aloud & speech times',
              'Words for any speech length',
              'Practice timer',
              'Measure your own pace',
            ]}
          >
            <ReadingTimeCalculator />
          </ToolShell>
        </div>

        <AdSlot slotId="reading-time-ad-1" />

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>How to Use the Reading Time Calculator</h2>
            <p>
              Whether you are preparing a corporate keynote, timing a podcast script, determining an estimated reading time
              badge for a blog post, or pacing an academic lecture, this calculator gives you realistic, multi-scenario durations:
            </p>
            <ol>
              <li>
                <strong>Words → Time:</strong> Enter your document word count or use the quick buttons (50, 100, 300, 500, 1,000, 2,000, or 5,000 words).
                The calculator displays four distinct durations simultaneously: silent reading, spoken narration, stage presentation, and formal keynote.
              </li>
              <li>
                <strong>Speech Length (Minutes → Words):</strong> Plan in reverse. Enter your allotted stage slot (e.g., 5 minutes or 10 minutes)
                to see exactly how many words to write for each speaking tempo.
              </li>
              <li>
                <strong>Paste Text:</strong> Paste an entire article or script to run real-time word counting without uploading data to external servers.
                Review both global delivery times and a per-paragraph breakdown showing timing for each subsection.
              </li>
              <li>
                <strong>Practice Timer:</strong> Rehearse aloud with an interactive stopwatch dial. Built-in pace tracking highlights overruns if your
                speaking speed trails your scheduled slot.
              </li>
              <li>
                <strong>Measure My Pace:</strong> Read our short passage at your comfortable pace to measure your exact personal WPM,
                then apply that custom speed across all calculator modes.
              </li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2>Reading Time Calculation: The Formula and Mathematics</h2>
            <p>
              The fundamental equation underlying all reading and speech timing calculations is straightforward:
            </p>
            <div className={styles.calloutCard}>
              <p><code>Reading Time (Minutes) = Total Word Count ÷ Reading Rate (WPM)</code></p>
              <p><code>Total Duration = Base Minutes × (1 + Pause Buffer %) + (Slides × Seconds Per Slide ÷ 60)</code></p>
            </div>
            <p>
              For example, calculating the silent reading time for a 1,000-word article at 238 words per minute (a published estimate, being verified):
            </p>
            <ul>
              <li><code>Base Minutes = 1,000 ÷ 238 = 4.2017 minutes</code></li>
              <li><code>Total Seconds = 4.2017 × 60 = 252.1 seconds ≈ 4 minutes 12 seconds</code></li>
              <li><code>Blog Reading Badge (&quot;X min read&quot;) = ceil(4.2017) = 5 min read</code></li>
            </ul>
            <p>
              For public speaking, factoring in pauses is vital. If delivering a 700-word script at 140 WPM with a 10% pause buffer for rhetorical emphasis:
            </p>
            <ul>
              <li><code>Base Minutes = 700 ÷ 140 = 5.0 minutes</code></li>
              <li><code>Buffered Duration = 5.0 × (1 + 0.10) = 5.5 minutes = 5 minutes 30 seconds</code></li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Average Silent Reading Speed and Comprehension Benchmarks</h2>
            <p>
              Reading speed changes with the reader, the text and the language, so no single number fits everyone. The
              starting values come from a published meta-analysis (Brysbaert, 2019,{' '}
              <a href="https://doi.org/10.1016/j.jml.2019.104047" target="_blank" rel="noopener noreferrer">
                Journal of Memory and Language
              </a>
              ). We have not yet confirmed the figures from the paper itself, so treat them as estimates:
            </p>
            <ul>
              <li><strong>Non-fiction, silent:</strong> about 238 words per minute (being verified).</li>
              <li><strong>Fiction, silent:</strong> about 260 words per minute (being verified).</li>
              <li><strong>Reading aloud:</strong> about 183 words per minute (being verified).</li>
            </ul>
            <p>
              The tool adds a ±15% range, because difficulty, familiarity and audience all move the result. For 1,000 words
              at 238, that is 3 minutes 34 seconds to 4 minutes 50 seconds. If you time yourself on a page of your own
              text, use that number instead: it beats any average.
            </p>
            </section>

          <section className={styles.section}>
            <h2>Average Speaking Rate for Presentations, Keynotes and Podcasts</h2>
            <p>
              We found no official source for an average speaking rate, so these are example paces. Edit them to match you.
            </p>
            <ul>
              <li><strong>Slow, 110 words per minute:</strong> a careful pace for formal talks or an audience listening in a second language.</li>
              <li><strong>Presentation, 130 words per minute:</strong> the default for talks with slides.</li>
              <li><strong>Conversational, 150 words per minute:</strong> a relaxed, informal delivery.</li>
            </ul>
            <p>
              To find your own pace, read a page aloud the way you would on the day, divide the words by the minutes, and
              type the result into the calculator. A script read in a quiet room is often faster than the same script in
              front of people, so rehearse standing up and out loud before you trust the number.
            </p>
            </section>

          <section className={styles.section}>
            <h2>How Long Is 50, 100, 300, 500, 1,000, 2,000 and 5,000 Words?</h2>
            <p>
              The query &quot;how long is X words&quot; is inherently twofold: speakers want to know the delivery time, while authors
              and students often need to know the printed page equivalent. The table below provides both measurements side-by-side:
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <caption>Words to Duration &amp; Page Yield Reference Table</caption>
                <thead>
                  <tr>
                    <th>Word Count</th>
                    <th>Silent Read (238 wpm)</th>
                    <th>Reading Aloud (183 wpm)</th>
                    <th>Presentation (130 wpm)</th>
                    <th>Slow Speech (110 wpm)</th>
                    <th>Single-Spaced Pages</th>
                    <th>Double-Spaced Pages</th>
                  </tr>
                </thead>
                <tbody>
                  {REFERENCE_WORD_COUNTS.map((cnt) => {
                    const s = calculateSpeechTime(cnt, { wpm: DEFAULT_SILENT_WPM });
                    const a = calculateSpeechTime(cnt, { wpm: DEFAULT_ALOUD_WPM });
                    const p = calculateSpeechTime(cnt, { wpm: DEFAULT_PRESENTATION_WPM });
                    const sl = calculateSpeechTime(cnt, { wpm: DEFAULT_SLOW_SPEECH_WPM });
                    const singlePages = (cnt / 500).toFixed(1);
                    const doublePages = (cnt / 250).toFixed(1);

                    return (
                      <tr key={cnt}>
                        <td><strong>{cnt.toLocaleString('en-US')} words</strong></td>
                        <td>{s.formatted}</td>
                        <td>{a.formatted}</td>
                        <td><strong>{p.formatted}</strong></td>
                        <td>{sl.formatted}</td>
                        <td>≈ {singlePages} {parseFloat(singlePages) === 1.0 ? 'page' : 'pages'}</td>
                        <td>≈ {doublePages} pages</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p>
              Need detailed typographical options (font size, margins, A4 vs. Letter paper)? Use our dedicated{' '}
              <Link href="/words-to-pages/" style={{ color: 'var(--cat-writing)', fontWeight: 700 }}>
                Words to Pages Calculator →
              </Link>{' '}
              Or check your overall vocabulary with our <Link href="/word-counter/">Word Counter</Link> and monitor sentence cadence with our <Link href="/sentence-counter/">Sentence Counter</Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>How Many Words for a 3, 4, 5, 7, 10, 15, or 20-Minute Speech?</h2>
            <p>
              When an event organizer gives you a 5-minute lightning talk or a 20-minute keynote slot, writing to length is crucial.
              Overrunning your scheduled time disrupts the schedule, while rushing leaves your audience disconnected.
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <caption>Speech Length Reference Table (Target Minutes to Required Words)</caption>
                <thead>
                  <tr>
                    <th>Duration</th>
                    <th>Slow (110 wpm)</th>
                    <th>Presentation (130 wpm)</th>
                    <th>Conversational (150 wpm)</th>
                    <th>Reading Aloud (183 wpm)</th>
                    <th>Standard Page Yield</th>
                  </tr>
                </thead>
                <tbody>
                  {speechTable.slice(0, 9).map((row) => (
                    <tr key={row.minutes}>
                      <td><strong>{row.minutes} {row.minutes === 1 ? 'minute' : 'minutes'}</strong></td>
                      <td>{row.slow.toLocaleString('en-US')} w</td>
                      <td><strong>{row.presentation.toLocaleString('en-US')} words</strong></td>
                      <td>{row.conversational.toLocaleString('en-US')} w</td>
                      <td>{row.aloud.toLocaleString('en-US')} w</td>
                      <td>≈ {(row.presentation / 500).toFixed(1)} single / {(row.presentation / 250).toFixed(1)} double</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Accounting for Pauses, Slides, and Audience Interaction</h2>
            <p>
              A common error among novice speakers is calculating rehearsal time based solely on uninterrupted script reading.
              Live presentations require substantial buffer time:
            </p>
            <ul>
              <li><strong>Pauses:</strong> set a pause buffer between 0% and 30%. Time one rehearsal with and without your pauses to find your own figure.</li>
              <li><strong>Slides:</strong> enter the number of slides and the seconds each change takes. Ten slides at 5 seconds each add 50 seconds.</li>
              <li><strong>Reactions and questions:</strong> laughter, applause and questions are hard to predict, so leave time unplanned at the end.</li>
            </ul>
            <p>
              <em>Example:</em> A 650-word talk delivered at 130 WPM takes exactly 5:00 minutes of pure speaking. Adding 10 slides at 5 seconds per slide (50 seconds) brings total stage time to <strong>5 minutes 50 seconds</strong>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Practising with a Speech Timer: Rehearsal and Pacing Routine</h2>
            <p>
              Reading a script in your head is not the same as saying it.
              Follow this structured routine using the <strong>Practice Timer</strong> tab:
            </p>
            <ol>
              <li><strong>Stand and Speak Aloud:</strong> Rehearse while standing in the physical posture you will use on stage. Articulate every syllable clearly.</li>
              <li><strong>Track the Pace Ring:</strong> Observe the visual progress ring. If you reach your final slide and the timer has turned red (overrun indicator), identify paragraphs that can be pruned or consolidated.</li>
              <li><strong>Mark Breathing Checkpoints:</strong> Insert visual cues (like <code>[PAUSE]</code> or <code>{'//'}</code>) in your speaker notes where you intend to take deliberate breaths or advance slides.</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2>Why Measuring Your Personal Pace Beats Statistical Averages</h2>
            <p>
              The default paces are only starting points. Your own pace on your own text is the better number.
            </p>
            <p>
              By navigating to our <strong>Measure My Pace</strong> tab and reading our short passage,
              the stopwatch works out your words per minute. Then choose whether you read silently or aloud, and the matching pace is updated in the calculator.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqSection}>
              {faqs.map((item, idx) => (
                <div key={idx} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{item.q}</h3>
                  <div className={styles.faqAnswer}>
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <HowWeCalculate slug="reading-time-calculator" />
        </article>
      </div>
    </main>
  );
}
