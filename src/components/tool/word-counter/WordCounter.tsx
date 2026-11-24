'use client';

import React, { useState, useMemo, useDeferredValue, useEffect } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import TextInputPanel from '@/components/tool/text/TextInputPanel';
import StatTiles, { StatTileItem } from '@/components/tool/text/StatTiles';
import WordCountInputGuide from './WordCountInputGuide';
import {
  extractWords,
  countGraphemes,
  charsNoSpaces,
  extractSentences,
  countParagraphs,
  calculateReadingTime,
  classCounts,
  getNgrams,
  NgramItem,
} from '@/lib/text-engine';
import { STOP_WORDS_EN } from '@/data/stop-words-en';
import styles from './WordCounter.module.css';

type TabType = 'count' | 'essay' | 'frequency' | 'reading';

const TABS: TabItem<TabType>[] = [
  { id: 'count', label: '1. Word Count' },
  { id: 'essay', label: '2. Essay Limit' },
  { id: 'frequency', label: '3. Word Frequency' },
  { id: 'reading', label: '4. Reading & Speaking Time' },
];

const ESSAY_PRESETS = [250, 300, 500, 750, 1000, 1500, 2000];

const DEFAULT_SAMPLE_TEXT = `Effective writing relies on clear sentence structure and purposeful vocabulary. When you draft an essay, thesis, or business presentation, every sentence should communicate a defined thought.

In academic and professional writing, word counters help you respect length constraints. Hyphenated compounds like well-known or state-of-the-art count as single words, while numbers such as 2,500 provide quantitative evidence.

By monitoring unique words and sentence rhythms, you can avoid repetitive phrasing. Clear writing respects the reader's attention and conveys ideas with confidence.`;

export default function WordCounter() {
  const [tab, setTab] = useState<TabType>('count');
  const [liveText, setText] = useState<string>(DEFAULT_SAMPLE_TEXT);
  const text = useDeferredValue(liveText);
  const [hyphenJoin, setHyphenJoin] = useState<boolean>(true);
  const [countNumbers, setCountNumbers] = useState<boolean>(true);
  const [essayTarget, setEssayTarget] = useState<number>(500);
  const [essayMin, setEssayMin] = useState<number>(0);
  const [essayMax, setEssayMax] = useState<number>(0);
  const [extraIgnore, setExtraIgnore] = useState<string>('');
  const [ngramSize, setNgramSize] = useState<1 | 2 | 3>(1);
  const [ignoreStopWords, setIgnoreStopWords] = useState<boolean>(true);
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [readingWpm, setReadingWpm] = useState<number>(238);
  const [speakingWpm, setSpeakingWpm] = useState<number>(130);

  // Sync tab with URL parameter ?tab=
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const syncFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        const urlTab = params.get('tab') as TabType;
        if (urlTab && TABS.some((t) => t.id === urlTab)) {
          setTab(urlTab);
        }
      };
      const timer = setTimeout(syncFromUrl, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTabChange = (newTab: TabType) => {
    setTab(newTab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', newTab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Text analysis calculations
  const words = useMemo(
    () => extractWords(text, { hyphenJoin, countNumbers }),
    [text, hyphenJoin, countNumbers]
  );
  const totalWords = words.length;
  const totalChars = useMemo(() => countGraphemes(text), [text]);
  const charsWithoutSpaces = useMemo(() => charsNoSpaces(text), [text]);
  const sentences = useMemo(() => extractSentences(text), [text]);
  const totalSentences = sentences.length;
  const totalParagraphs = useMemo(() => countParagraphs(text), [text]);

  const uniqueWords = useMemo(
    () => new Set(words.map((w) => w.toLowerCase())).size,
    [words]
  );

  const avgWordLength = useMemo(
    () => (totalWords > 0 ? (classCounts(text).letters / totalWords).toFixed(1) : '0.0'),
    [text, totalWords]
  );

  const avgSentenceLength = useMemo(
    () => (totalSentences > 0 ? (totalWords / totalSentences).toFixed(1) : '0.0'),
    [totalWords, totalSentences]
  );

  // Essay calculations
  const wordsLeft = essayTarget - totalWords;
  const essayPercent = Math.min(100, Math.round(essayTarget > 0 ? (totalWords / essayTarget) * 100 : 0));

  // Reading time calculations
  const readingTime = useMemo(
    () => calculateReadingTime(totalWords, readingWpm),
    [totalWords, readingWpm]
  );
  const speakingTime = useMemo(
    () => calculateReadingTime(totalWords, speakingWpm),
    [totalWords, speakingWpm]
  );

  // N-gram frequency calculations
  const ngrams: NgramItem[] = useMemo(
    () =>
      getNgrams(
        sentences.map((s) => extractWords(s, { hyphenJoin, countNumbers })).filter((s) => s.length > 0),
        ngramSize,
        {
          stopWords: new Set([
            ...(ignoreStopWords ? Array.from(STOP_WORDS_EN) : []),
            ...extraIgnore.toLowerCase().split(/[\s,]+/).filter(Boolean),
          ]),
          caseSensitive,
        }
      ).slice(0, 15),
    [sentences, hyphenJoin, countNumbers, ngramSize, ignoreStopWords, extraIgnore, caseSensitive]
  );

  // Primary Stat Tiles
  const primaryStats: StatTileItem[] = useMemo(
    () => [
      {
        id: 'words',
        label: 'Total Words',
        value: totalWords.toLocaleString('en-US'),
        highlight: true,
      },
      {
        id: 'chars',
        label: 'Characters (Spaces)',
        value: totalChars.toLocaleString('en-US'),
      },
      {
        id: 'charsNoSpaces',
        label: 'Without Spaces',
        value: charsWithoutSpaces.toLocaleString('en-US'),
      },
      {
        id: 'sentences',
        label: 'Sentences',
        value: totalSentences.toLocaleString('en-US'),
      },
    ],
    [totalWords, totalChars, charsWithoutSpaces, totalSentences]
  );

  // Secondary Stat Tiles
  const secondaryStats: StatTileItem[] = useMemo(
    () => [
      {
        id: 'paragraphs',
        label: 'Paragraphs',
        value: totalParagraphs.toLocaleString('en-US'),
      },
      {
        id: 'unique',
        label: 'Unique Words',
        value: uniqueWords.toLocaleString('en-US'),
        sublabel: totalWords > 0 ? `${Math.round((uniqueWords / totalWords) * 100)}% vocabulary ratio` : undefined,
      },
      {
        id: 'avgWord',
        label: 'Avg Word Length',
        value: `${avgWordLength} letters`,
      },
      {
        id: 'avgSentence',
        label: 'Avg Sentence',
        value: `${avgSentenceLength} words`,
      },
    ],
    [totalParagraphs, uniqueWords, totalWords, avgWordLength, avgSentenceLength]
  );

  return (
    <div className={styles.calculator}>
      <TabSlider tabs={TABS} activeId={tab} onChange={handleTabChange} ariaLabel="Word Counter Modes" />

      {/* Visual Input Guide */}
      <WordCountInputGuide
        activeTab={tab}
        hyphenJoin={hyphenJoin}
        countNumbers={countNumbers}
        totalWords={totalWords}
        totalChars={totalChars}
        essayTarget={essayTarget}
        wordsLeft={wordsLeft}
      />

      {/* Word Options Bar */}
      <div className={styles.optionsBar}>
        <div className={styles.toggleGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={hyphenJoin}
              onChange={(e) => setHyphenJoin(e.target.checked)}
            />
            Hyphenated words as one (e.g. well-known)
          </label>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={countNumbers}
              onChange={(e) => setCountNumbers(e.target.checked)}
            />
            Count numbers as words (e.g. 2,500)
          </label>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
          Contractions (it’s, don’t) count as 1 word
        </div>
      </div>

      {/* TAB 1: Main Word Count */}
      {tab === 'count' && (
        <>
          <div className={styles.resultHero}>
            <div className={styles.headlineRow}>
              <div className={styles.resultPrimary}>
                {totalWords.toLocaleString('en-US')} <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>words</span>
              </div>
              <div className={styles.resultSecondary}>
                Silent reading: ≈ {readingTime.formatted} · Speaking: ≈ {speakingTime.formatted}
              </div>
            </div>

            <div className={styles.sentenceBox}>
              Your text has <strong>{totalWords.toLocaleString('en-US')} words</strong>,{' '}
              <strong>{totalChars.toLocaleString('en-US')} characters</strong> ({charsWithoutSpaces.toLocaleString('en-US')}{' '}
              without spaces), <strong>{totalSentences} sentences</strong>, and <strong>{totalParagraphs} paragraphs</strong>.
            </div>
          </div>

          <TextInputPanel
            value={liveText}
            onChange={setText}
            label="Your Text to Count"
            placeholder="Type or paste your essay, article, or speech here..."
          />

          <StatTiles stats={primaryStats} columns={4} />

          <div className={styles.sectionHeader}>
            <h3 className={styles.subsectionTitle}>Structural &amp; Vocabulary Statistics</h3>
          </div>

          <StatTiles stats={secondaryStats} columns={4} />
        </>
      )}

      {/* TAB 2: Essay Limit */}
      {tab === 'essay' && (
        <>
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="essay-target-input" className={styles.label}>
                <span>Essay Target Word Count</span>
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input
                  id="essay-target-input"
                  type="number"
                  min="1"
                  max="50000"
                  value={essayTarget}
                  onChange={(e) => setEssayTarget(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className={styles.input}
                  style={{ width: '130px' }}
                />
                <select
                  aria-label="Common target presets"
                  value={ESSAY_PRESETS.includes(essayTarget) ? essayTarget : 'custom'}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val !== 'custom') setEssayTarget(parseInt(val, 10));
                  }}
                  className={styles.select}
                  style={{ width: 'auto', flex: 1 }}
                >
                  <option value="custom">Common presets...</option>
                  {ESSAY_PRESETS.map((p) => (
                    <option key={p} value={p}>
                      {p.toLocaleString('en-US')} words
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="essay-min-input" className={styles.label}>
                <span>Minimum (optional)</span>
              </label>
              <input
                id="essay-min-input"
                type="number"
                min="0"
                value={essayMin || ''}
                onChange={(e) => setEssayMin(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className={styles.input}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="essay-max-input" className={styles.label}>
                <span>Maximum (optional)</span>
              </label>
              <input
                id="essay-max-input"
                type="number"
                min="0"
                value={essayMax || ''}
                onChange={(e) => setEssayMax(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.resultHero}>
            <div className={styles.headlineRow}>
              <div className={styles.resultPrimary}>
                {totalWords.toLocaleString('en-US')} / {essayTarget.toLocaleString('en-US')} words
              </div>
              <div className={styles.resultSecondary}>
                {wordsLeft > 0 ? `${wordsLeft.toLocaleString('en-US')} words to go (${essayPercent}%)` : `${Math.abs(wordsLeft).toLocaleString('en-US')}${wordsLeft === 0 ? ' words left: target reached' : ' words over target'}`}
              </div>
            </div>

            <div className={styles.progressBarContainer}>
              <div className={styles.progressBarTrack}>
                <div
                  className={`${styles.progressBarFill} ${wordsLeft < 0 ? styles.progressBarFillOver : ''}`}
                  style={{ width: `${Math.min(100, essayTarget > 0 ? (totalWords / essayTarget) * 100 : 0)}%` }}
                />
              </div>
            </div>

            <div className={styles.sentenceBox}>
              {essayMax > 0 && totalWords > essayMax ? (
                <span>
                  ⚠️ <strong>{(totalWords - essayMax).toLocaleString('en-US')} over</strong> the {essayMax.toLocaleString('en-US')}-word maximum.
                </span>
              ) : essayMin > 0 && totalWords < essayMin ? (
                <span>
                  <strong>{(essayMin - totalWords).toLocaleString('en-US')} words to go</strong> to the {essayMin.toLocaleString('en-US')}-word minimum.
                </span>
              ) : essayMin > 0 || essayMax > 0 ? (
                <span>✓ Your text is inside the range you set.</span>
              ) : wordsLeft > 0 ? (
                <span>
                  You need <strong>{wordsLeft.toLocaleString('en-US')} more words</strong> to reach your {essayTarget.toLocaleString('en-US')}-word requirement.
                </span>
              ) : wordsLeft === 0 ? (
                <span>
                  🎯 <strong>Target Achieved!</strong> You have reached exactly {essayTarget.toLocaleString('en-US')} words.
                </span>
              ) : (
                <span>
                  ⚠️ You have exceeded your target by <strong>{Math.abs(wordsLeft).toLocaleString('en-US')} words</strong>.
                </span>
              )}
            </div>
          </div>

          <TextInputPanel
            value={liveText}
            onChange={setText}
            label="Your Draft Essay"
            placeholder="Paste your essay to monitor your target word count in real time..."
          />

          <StatTiles stats={primaryStats} columns={4} />
        </>
      )}

      {/* TAB 3: Frequency & N-grams */}
      {tab === 'frequency' && (
        <>
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="phrase-length-select" className={styles.label}>
                <span>Phrase Length (N-gram)</span>
              </label>
              <select
                id="phrase-length-select"
                value={ngramSize}
                onChange={(e) => setNgramSize(parseInt(e.target.value, 10) as 1 | 2 | 3)}
                className={styles.select}
              >
                <option value={1}>Single Words (1-grams)</option>
                <option value={2}>2-Word Phrases (2-grams)</option>
                <option value={3}>3-Word Phrases (3-grams)</option>
              </select>
            </div>

            <div className={styles.fieldGroup} style={{ justifyContent: 'center' }}>
              <label className={styles.checkboxLabel} style={{ paddingTop: '1.25rem' }}>
                <input
                  type="checkbox"
                  checked={ignoreStopWords}
                  onChange={(e) => setIgnoreStopWords(e.target.checked)}
                />
                Filter common English stop words (the, and, is, in...)
              </label>
            </div>

            <div className={styles.fieldGroup} style={{ justifyContent: 'center' }}>
              <label className={styles.checkboxLabel} style={{ paddingTop: '1.25rem' }}>
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                />
                Case-sensitive frequency matching
              </label>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="extra-ignore-input" className={styles.label}>
                <span>Also ignore these words</span>
              </label>
              <input
                id="extra-ignore-input"
                type="text"
                value={extraIgnore}
                onChange={(e) => setExtraIgnore(e.target.value)}
                className={styles.input}
                placeholder="e.g. chapter, figure"
              />
            </div>
          </div>

          <TextInputPanel
            value={liveText}
            onChange={setText}
            label="Text for Frequency Analysis"
            placeholder="Type or paste text to inspect keyword density and phrase frequency..."
          />

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Term / Phrase</th>
                  <th>Occurrences</th>
                  <th>Density %</th>
                </tr>
              </thead>
              <tbody>
                {ngrams.length > 0 ? (
                  ngrams.map((item: NgramItem, idx: number) => (
                    <tr key={item.phrase}>
                      <td>#{idx + 1}</td>
                      <td>
                        <strong>{item.phrase}</strong>
                      </td>
                      <td>{item.count}</td>
                      <td>{item.density}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--ink-soft)' }}>
                      No phrases matched the current filter. Try unchecking stop words or typing more text.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* TAB 4: Reading & Speaking Time */}
      {tab === 'reading' && (
        <>
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="reading-wpm-input" className={styles.label}>
                <span>Silent Reading Speed (WPM)</span>
              </label>
              <input
                id="reading-wpm-input"
                type="number"
                min="50"
                max="800"
                value={readingWpm}
                onChange={(e) => setReadingWpm(Math.max(1, parseInt(e.target.value, 10) || 238))}
                className={styles.input}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="speaking-wpm-input" className={styles.label}>
                <span>Speaking / Presentation Pace (WPM)</span>
              </label>
              <input
                id="speaking-wpm-input"
                type="number"
                min="50"
                max="300"
                value={speakingWpm}
                onChange={(e) => setSpeakingWpm(Math.max(1, parseInt(e.target.value, 10) || 130))}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.resultHero}>
            <div className={styles.headlineRow}>
              <div className={styles.resultPrimary}>
                Silent Reading: ≈ {readingTime.formatted}
              </div>
              <div className={styles.resultSecondary}>
                Speaking aloud: ≈ {speakingTime.formatted}
              </div>
            </div>

            <div className={styles.sentenceBox}>
              At {readingWpm} words per minute (an editable estimate), your {totalWords.toLocaleString('en-US')}-word text takes approximately <strong>{readingTime.formatted}</strong> to read. If presented aloud at {speakingWpm} words per minute, it takes approximately <strong>{speakingTime.formatted}</strong>.
            </div>
          </div>

          <TextInputPanel
            value={liveText}
            onChange={setText}
            label="Speech or Manuscript Text"
            placeholder="Type or paste your speech text here to estimate reading duration..."
          />
        </>
      )}
    </div>
  );
}
