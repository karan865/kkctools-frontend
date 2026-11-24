'use client';

import React, { useState, useMemo, useDeferredValue } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import { useTabParam } from '@/components/tool/text/useTabParam';
import {
  calculateKeywordDensity,
  NgramTableRow,
} from '@/lib/keyword-density-engine';
import { STOP_WORDS_EN } from '@/data/stop-words-en';
import TextInputPanel from '@/components/tool/text/TextInputPanel';
import StatTiles, { StatTileItem } from '@/components/tool/text/StatTiles';
import KeywordDensityInputGuide from './KeywordDensityInputGuide';
import styles from './KeywordDensityChecker.module.css';

type ActiveTab = 'all' | 'target' | 'settings';

const TABS: TabItem<ActiveTab>[] = [
  { id: 'all', label: '1. Words & Phrases' },
  { id: 'target', label: '2. Target Keyword' },
  { id: 'settings', label: '3. Settings & Stop Words' },
];
const TAB_IDS = TABS.map((t) => t.id);

const SAMPLE_TEXT = `Our word counter counts words fast. A word counter also counts characters. Use the word counter free.

Paste a draft to see which words you lean on. A long draft often repeats one phrase without the writer noticing. The tables below list each word and phrase with its count, so you can decide which repeats help the reader and which ones to cut.

The target view shows where a phrase appears. If every mention sits in the opening lines, the rest of the draft may have moved on to another topic. Read each mention in context before you change it.`;

export default function KeywordDensityChecker() {
  const [activeTab, setActiveTab] = useTabParam<ActiveTab>(TAB_IDS, 'all');

  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Inputs
  const [liveText, setText] = useState<string>(SAMPLE_TEXT);
  const text = useDeferredValue(liveText);
  const [targetPhrase, setTargetPhrase] = useState<string>('word counter');
  const [minFrequency, setMinFrequency] = useState<number>(2);
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [groupVariants, setGroupVariants] = useState<boolean>(false);
  const [ignoreStopWords, setIgnoreStopWords] = useState<boolean>(true);
  const [showShareCol, setShowShareCol] = useState<boolean>(true);

  // Stop words customization
  const [customStopWords, setCustomStopWords] = useState<Set<string>>(new Set(STOP_WORDS_EN));
  const [newStopWord, setNewStopWord] = useState<string>('');

  const [copied, setCopied] = useState<string | null>(null);

  // Analysis
  const report = useMemo(() => {
    return calculateKeywordDensity(text, {
      caseSensitive,
      ignoreStopWords,
      stopWords: customStopWords,
      groupVariants,
      minFrequency,
      targetPhrase,
    });
  }, [
    text,
    caseSensitive,
    ignoreStopWords,
    customStopWords,
    groupVariants,
    minFrequency,
    targetPhrase,
  ]);

  // Stat Tiles
  const statTiles: StatTileItem[] = [
    {
      id: 'words',
      label: 'Total Words',
      value: report.totalWords.toLocaleString('en-US'),
      sublabel: 'Document size',
    },
    {
      id: 'unique',
      label: 'Unique Words',
      value: report.uniqueWords.toLocaleString('en-US'),
      sublabel: report.totalWords > 0
        ? `${((report.uniqueWords / report.totalWords) * 100).toFixed(0)}% vocabulary`
        : '0%',
    },
    {
      id: 'sentences',
      label: 'Sentences',
      value: report.sentences.toLocaleString('en-US'),
      sublabel: 'Bounded n-grams',
    },
    {
      id: 'top-word',
      label: 'Top Word',
      value: report.topWord ? report.topWord.term : '—',
      sublabel: report.topWord
        ? `${report.topWord.count}× (${report.topWord.density}%)`
        : 'None listed',
    },
    {
      id: 'top-2gram',
      label: 'Top 2-Word Phrase',
      value: report.topTwoGram ? report.topTwoGram.term : '—',
      sublabel: report.topTwoGram
        ? `${report.topTwoGram.count}× (${report.topTwoGram.density}%)`
        : 'None listed',
    },
  ];

  // CSV Exporter
  const downloadCsv = (rows: NgramTableRow[], nGramName: string) => {
    if (rows.length === 0) return;
    const header = ['Term', 'Count', 'Density (%)', 'Share of Words (%)'].join(',');
    const body = rows.map((r) => `"${r.term.replace(/"/g, '""')}",${r.count},${r.density},${r.share}`).join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(header + '\n' + body);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `keyword-density-${nGramName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyTable = async (rows: NgramTableRow[], label: string) => {
    if (rows.length === 0) return;
    const textData = rows.map((r) => `${r.term}: ${r.count} (${r.density}%)`).join('\n');
    try {
      await navigator.clipboard.writeText(textData);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Clipboard blocked
    }
  };

  const handleAddStopWord = (e: React.FormEvent) => {
    e.preventDefault();
    const word = newStopWord.trim().toLowerCase();
    if (word && !customStopWords.has(word)) {
      const next = new Set(customStopWords);
      next.add(word);
      setCustomStopWords(next);
      setNewStopWord('');
    }
  };

  const handleRemoveStopWord = (word: string) => {
    const next = new Set(customStopWords);
    next.delete(word);
    setCustomStopWords(next);
  };

  const handleResetStopWords = () => {
    setCustomStopWords(new Set(STOP_WORDS_EN));
  };

  return (
    <div className={styles.container}>
      {/* 1. Input Guide Diagram */}
      <KeywordDensityInputGuide
        focusedField={focusedField}
        activeTab={activeTab}
        targetPhrase={targetPhrase || 'word counter'}
        totalWords={report.totalWords}
        targetCount={report.targetAnalysis ? report.targetAnalysis.count : 0}
      />

      {/* 2. Top Summary Stat Tiles */}
      <StatTiles stats={statTiles} columns={5} />

      {/* 3. Text Input Panel */}
      <TextInputPanel
        value={liveText}
        onChange={setText}
        onFocus={() => setFocusedField('text')}
        onBlur={() => setFocusedField(null)}
        placeholder="Paste or type your content to analyze keyword density, n-grams, and phrase distribution..."
        label="Input Content for Keyword Analysis"
      />

      {/* 4. Tab Navigation */}
      <TabSlider tabs={TABS} activeId={activeTab} onChange={setActiveTab} ariaLabel="Keyword density views" />

      {/* TAB 1: ALL WORDS & PHRASES */}
      {activeTab === 'all' && (
        <div className={styles.tableSection}>
          {report.topTwoGram && (
            <div className={styles.summarySentence}>
              <strong>Observation:</strong> &ldquo;{report.topTwoGram.term}&rdquo; appears{' '}
              {report.topTwoGram.count} times across {report.totalWords} words ({report.topTwoGram.density}%),{' '}
              {report.twoGrams.filter((g) => g.count === report.topTwoGram?.count).length > 1 ? 'the highest count for a 2-word phrase (tied).' : 'more than any other 2-word phrase.'}
            </div>
          )}

          {/* 1-Word Table */}
          <div className={styles.tableSection}>
            <div className={styles.tableSubheader}>
              <h3 className={styles.tableTitle}>1-Word Terms ({report.oneGrams.length})</h3>
              <div className={styles.tableActions}>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => copyTable(report.oneGrams, '1-word')}
                >
                  {copied === '1-word' ? 'Copied!' : 'Copy 1-Words'}
                </button>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => downloadCsv(report.oneGrams, '1-word')}
                >
                  CSV
                </button>
              </div>
            </div>

            {report.oneGrams.length > 0 ? (
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Term</th>
                      <th>Count</th>
                      <th>Density (%)</th>
                      {showShareCol && <th>Share of Words (%)</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {report.oneGrams.slice(0, 30).map((r, idx) => (
                      <tr key={idx}>
                        <td className={styles.termCell}>{r.term}</td>
                        <td><span className={styles.countBadge}>{r.count}</span></td>
                        <td className={styles.densityValue}>{r.density}%</td>
                        {showShareCol && <td className={styles.shareValue}>{r.share}%</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.emptyState}>
                No 1-word terms meet the minimum frequency of {minFrequency}.
              </div>
            )}
          </div>

          {/* 2-Word Table */}
          <div className={styles.tableSection}>
            <div className={styles.tableSubheader}>
              <h3 className={styles.tableTitle}>2-Word Phrases ({report.twoGrams.length})</h3>
              <div className={styles.tableActions}>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => copyTable(report.twoGrams, '2-word')}
                >
                  {copied === '2-word' ? 'Copied!' : 'Copy 2-Words'}
                </button>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => downloadCsv(report.twoGrams, '2-word')}
                >
                  CSV
                </button>
              </div>
            </div>

            {report.twoGrams.length > 0 ? (
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Phrase (2 Words)</th>
                      <th>Count</th>
                      <th>Density (%)</th>
                      {showShareCol && <th>Share of Words (%)</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {report.twoGrams.slice(0, 25).map((r, idx) => (
                      <tr key={idx}>
                        <td className={styles.termCell}>{r.term}</td>
                        <td><span className={styles.countBadge}>{r.count}</span></td>
                        <td className={styles.densityValue}>{r.density}%</td>
                        {showShareCol && <td className={styles.shareValue}>{r.share}%</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.emptyState}>
                No 2-word phrases meet the minimum frequency of {minFrequency}.
              </div>
            )}
          </div>

          {/* 3-Word Table */}
          <div className={styles.tableSection}>
            <div className={styles.tableSubheader}>
              <h3 className={styles.tableTitle}>3-Word Phrases ({report.threeGrams.length})</h3>
              <div className={styles.tableActions}>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => copyTable(report.threeGrams, '3-word')}
                >
                  {copied === '3-word' ? 'Copied!' : 'Copy 3-Words'}
                </button>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => downloadCsv(report.threeGrams, '3-word')}
                >
                  CSV
                </button>
              </div>
            </div>

            {report.threeGrams.length > 0 ? (
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Phrase (3 Words)</th>
                      <th>Count</th>
                      <th>Density (%)</th>
                      {showShareCol && <th>Share of Words (%)</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {report.threeGrams.slice(0, 20).map((r, idx) => (
                      <tr key={idx}>
                        <td className={styles.termCell}>{r.term}</td>
                        <td><span className={styles.countBadge}>{r.count}</span></td>
                        <td className={styles.densityValue}>{r.density}%</td>
                        {showShareCol && <td className={styles.shareValue}>{r.share}%</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.emptyState}>
                No 3-word phrases meet the minimum frequency of {minFrequency}.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TARGET KEYWORD */}
      {activeTab === 'target' && (
        <div className={styles.targetCard}>
          <div className={styles.targetInputRow}>
            <label htmlFor="target-keyword-input" className={styles.targetInputLabel}>
              Target Keyword or Phrase to Track:
            </label>
            <input
              id="target-keyword-input"
              type="text"
              value={targetPhrase}
              onChange={(e) => setTargetPhrase(e.target.value)}
              className={styles.targetInput}
              placeholder="e.g. word counter, search engines..."
            />
          </div>

          {report.targetAnalysis ? (
            <>
              <div className={styles.summarySentence}>
                <strong>Target Stats:</strong> &ldquo;{report.targetAnalysis.phrase}&rdquo; occurs{' '}
                <strong>{report.targetAnalysis.count} times</strong> ({report.targetAnalysis.density}% density · {report.targetAnalysis.share}% share of words).{' '}
                {report.targetAnalysis.firstPosition > 0
                  ? `First appears at word position #${report.targetAnalysis.firstPosition}.`
                  : 'Does not appear in text.'}
              </div>

              {/* Position Heatmap (10 Deciles) */}
              <div className={styles.heatmapContainer}>
                <div className={styles.heatmapTitle}>
                  Distribution Heatmap (10 Document Segments):
                </div>
                <div className={styles.heatmapBar} role="img" aria-label="Document deciles heatmap">
                  {report.targetAnalysis.heat.map((hits, idx) => (
                    <div
                      key={idx}
                      className={`${styles.heatmapCell} ${hits > 0 ? styles.heatmapCellHit : styles.heatmapCellEmpty}`}
                      title={`Decile ${idx + 1} (${idx * 10}–${(idx + 1) * 10}%): ${hits} occurrences`}
                    >
                      <span>{hits > 0 ? `${hits}×` : '0'}</span>
                      <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>{(idx + 1) * 10}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* KWIC (Keyword In Context) */}
              <div className={styles.heatmapContainer}>
                <div className={styles.heatmapTitle}>
                  Keyword In Context (KWIC) — ±5 Words:
                </div>
                {report.targetAnalysis.kwic.length > 0 ? (
                  <div className={styles.kwicList}>
                    {report.targetAnalysis.kwic.map((k, idx) => (
                      <div key={idx} className={styles.kwicItem}>
                        <span className={styles.kwicIndex}>Word #{k.wordIndex}</span>
                        ...{k.before} <span className={styles.kwicMatch}>{k.match}</span> {k.after}...
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>Target phrase not found in document.</div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              Enter a target phrase above to inspect frequency, heatmap distribution, and context.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SETTINGS */}
      {activeTab === 'settings' && (
        <div className={styles.settingsGrid}>
          {/* Options Card */}
          <div className={styles.settingsCard}>
            <h3 className={styles.cardHeading}>Analysis Controls</h3>

            <div className={styles.toggleRow}>
              <div>
                <label htmlFor="ignore-stopwords" className={styles.toggleLabel}>Filter Stop Words in Tables</label>
                <div className={styles.toggleSub}>Hides &ldquo;the&rdquo;, &ldquo;and&rdquo; etc. Total words stay unchanged.</div>
              </div>
              <input
                id="ignore-stopwords"
                type="checkbox"
                checked={ignoreStopWords}
                onChange={(e) => setIgnoreStopWords(e.target.checked)}
              />
            </div>

            <div className={styles.toggleRow}>
              <div>
                <label htmlFor="group-variants" className={styles.toggleLabel}>Group Plural Variants</label>
                <div className={styles.toggleSub}>Merges -s, -es, -ies (e.g. keywords → keyword).</div>
              </div>
              <input
                id="group-variants"
                type="checkbox"
                checked={groupVariants}
                onChange={(e) => setGroupVariants(e.target.checked)}
              />
            </div>

            <div className={styles.toggleRow}>
              <div>
                <label htmlFor="case-sensitive" className={styles.toggleLabel}>Case-Sensitive Matching</label>
                <div className={styles.toggleSub}>Distinguishes &ldquo;Apple&rdquo; from &ldquo;apple&rdquo;.</div>
              </div>
              <input
                id="case-sensitive"
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
              />
            </div>

            <div className={styles.toggleRow}>
              <div>
                <label htmlFor="show-share" className={styles.toggleLabel}>Show &ldquo;Share of Words&rdquo; Column</label>
                <div className={styles.toggleSub}>Includes count × phrase words ÷ total.</div>
              </div>
              <input
                id="show-share"
                type="checkbox"
                checked={showShareCol}
                onChange={(e) => setShowShareCol(e.target.checked)}
              />
            </div>

            <div className={styles.toggleRow}>
              <div>
                <label htmlFor="min-freq" className={styles.toggleLabel}>Minimum Frequency Filter</label>
                <div className={styles.toggleSub}>Phrases must appear at least this many times.</div>
              </div>
              <select
                id="min-freq"
                value={minFrequency}
                onChange={(e) => setMinFrequency(Number(e.target.value))}
                className={styles.actionBtn}
              >
                <option value={1}>1 (all occurrences)</option>
                <option value={2}>2 (default)</option>
                <option value={3}>3+</option>
                <option value={5}>5+</option>
              </select>
            </div>
          </div>

          {/* Stop Words Editor Card */}
          <div className={styles.settingsCard}>
            <div className={styles.tableSubheader}>
              <h3 className={styles.cardHeading}>Editable Stop Words ({customStopWords.size})</h3>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={handleResetStopWords}
              >
                Reset
              </button>
            </div>

            <form onSubmit={handleAddStopWord} className={styles.addChipRow}>
              <input
                type="text"
                value={newStopWord}
                onChange={(e) => setNewStopWord(e.target.value)}
                placeholder="Add stop word..."
                className={styles.chipInput}
              />
              <button type="submit" className={styles.actionBtn}>
                + Add
              </button>
            </form>

            <div className={styles.chipList}>
              {Array.from(customStopWords).sort().map((word) => (
                <span key={word} className={styles.chip}>
                  {word}
                  <button
                    type="button"
                    className={styles.chipRemove}
                    onClick={() => handleRemoveStopWord(word)}
                    aria-label={`Remove ${word}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Mathematical Formula Box */}
      <div className={styles.formulaBox}>
        <div className={styles.formulaTitle}>Transparent Mathematical Formulas</div>
        <div className={styles.formulaText}>
          • Density % (Standard) = (Occurrences ÷ Total Words) × 100<br />
          • Share of Words % = (Occurrences × Words in Phrase ÷ Total Words) × 100<br />
          • N-Gram Bounding: Phrases are evaluated strictly within individual sentences and never cross periods or terminal punctuation.
        </div>
      </div>

      {/* 6. Google Search Central Fact Box */}
      <div className={styles.googleBox}>
        <div className={styles.googleTitle}>
          <span>ℹ️</span> What Google says
        </div>
        <div className={styles.googleDesc}>
          Google&rsquo;s spam policies describe keyword stuffing as filling a page with keywords or numbers to manipulate rankings. They don&rsquo;t give a percentage. (<a href="https://developers.google.com/search/docs/essentials/spam-policies" target="_blank" rel="noopener noreferrer">Google spam policies</a>, checked 2026-11-22.)
        </div>
      </div>
    </div>
  );
}
