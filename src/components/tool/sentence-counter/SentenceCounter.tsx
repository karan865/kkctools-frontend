'use client';

import React, { useState, useMemo, useDeferredValue } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import { useTabParam } from '@/components/tool/text/useTabParam';
import {
  calculateSentenceStats,
  analyzeParagraphs,
} from '@/lib/sentence-stats-engine';
import { countWords, countLines } from '@/lib/text-engine';
import { ABBREVIATIONS_EN } from '@/data/abbreviations-en';
import TextInputPanel from '@/components/tool/text/TextInputPanel';
import StatTiles, { StatTileItem } from '@/components/tool/text/StatTiles';
import SentenceInputGuide from './SentenceInputGuide';
import styles from './SentenceCounter.module.css';

type ActiveTab = 'count' | 'sentences' | 'paragraphs' | 'rules';

const TABS: TabItem<ActiveTab>[] = [
  { id: 'count', label: '1. Count & Highlight' },
  { id: 'sentences', label: '2. Sentence List & Histogram' },
  { id: 'paragraphs', label: '3. Paragraphs Table' },
  { id: 'rules', label: '4. Sentence Rules & Abbreviations' },
];
const TAB_IDS = TABS.map((t) => t.id);

const SAMPLE_TEXT = `Dr. Smith arrived at 3.30 p.m. on Monday. He paid $4.50 for coffee! Was it worth it? J. K. Rowling wrote it... and then she left. Visit example.com/a.b for more.

Writing in concise, punchy sentences maintains reader interest across digital devices. Long compound sentences spanning multiple clauses often confuse your audience and increase cognitive reading fatigue.

By monitoring sentence length and paragraph density, you can identify wordy passages that benefit from being split into clear, digestible thoughts.`;

export default function SentenceCounter() {
  const [activeTab, setActiveTab] = useTabParam<ActiveTab>(TAB_IDS, 'count');

  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Core Inputs
  const [liveText, setText] = useState<string>(SAMPLE_TEXT);
  const text = useDeferredValue(liveText);
  const [threshold, setThreshold] = useState<number>(25);
  const [paragraphMode, setParagraphMode] = useState<'blankLine' | 'everyLine'>('blankLine');

  const [listLines, setListLines] = useState<boolean>(true);

  // Custom Abbreviation Set
  const [customAbbrevs, setCustomAbbrevs] = useState<Set<string>>(new Set(ABBREVIATIONS_EN));
  const [newAbbrev, setNewAbbrev] = useState<string>('');

  const [copied, setCopied] = useState<boolean>(false);

  // Analysis
  const sentenceStats = useMemo(() => {
    return calculateSentenceStats(text, {
      threshold,
      abbreviations: customAbbrevs,
      listLines,
    });
  }, [text, threshold, customAbbrevs, listLines]);

  const paragraphList = useMemo(() => {
    return analyzeParagraphs(text, paragraphMode, { abbreviations: customAbbrevs, listLines });
  }, [text, paragraphMode, customAbbrevs, listLines]);

  const totalWords = useMemo(() => countWords(text), [text]);
  const totalLines = useMemo(() => countLines(text), [text]);

  // StatTiles items
  const statItems: StatTileItem[] = [
    {
      id: 'sentences',
      label: 'Sentences',
      value: sentenceStats.totalSentences,
      sublabel: `${sentenceStats.longSentencesCount} long (> ${threshold}w)`,
      highlight: true,
    },
    {
      id: 'paragraphs',
      label: 'Paragraphs',
      value: paragraphList.length,
      sublabel: paragraphMode === 'blankLine' ? 'Blank-line blocks' : 'Every line',
    },
    {
      id: 'lines',
      label: 'Lines',
      value: totalLines,
      sublabel: 'Line breaks',
    },
    {
      id: 'words',
      label: 'Total Words',
      value: totalWords,
      sublabel: `${(totalWords / Math.max(1, sentenceStats.totalSentences)).toFixed(1)} words/sent`,
    },
    {
      id: 'avg-sent',
      label: 'Average Sentence',
      value: `${sentenceStats.meanWords} words`,
      sublabel: `Median: ${sentenceStats.medianWords} words`,
    },
    {
      id: 'longest-sent',
      label: 'Longest Sentence',
      value: `${sentenceStats.maxWords} words`,
      sublabel: `Shortest: ${sentenceStats.minWords} words`,
    },
  ];

  // Copy handler
  const handleCopyStats = async () => {
    const summary = `Text Analysis: ${sentenceStats.totalSentences} sentences, ${paragraphList.length} paragraphs, ${totalWords} words. Average sentence: ${sentenceStats.meanWords} words (median ${sentenceStats.medianWords}, longest ${sentenceStats.maxWords} words). Analyzed by KKCTools Sentence Counter.`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Select sentence in textarea and scroll to it
  const handleSelectSentence = (sentence: (typeof sentenceStats.sentences)[0]) => {
    setActiveTab('count');
    setTimeout(() => {
      const textarea = document.querySelector<HTMLTextAreaElement>('main textarea');
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(sentence.startIndex, sentence.endIndex);
        const fullLength = textarea.value.length;
        if (fullLength > 0) {
          const ratio = sentence.startIndex / fullLength;
          textarea.scrollTop = ratio * textarea.scrollHeight;
        }
        textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  const handleAddAbbrev = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAbbrev.trim()) return;
    const clean = newAbbrev.trim().replace(/\.$/, '').toLowerCase();
    const nextSet = new Set(customAbbrevs);
    nextSet.add(clean);
    setCustomAbbrevs(nextSet);
    setNewAbbrev('');
  };

  const handleRemoveAbbrev = (abbrev: string) => {
    const nextSet = new Set(customAbbrevs);
    nextSet.delete(abbrev);
    setCustomAbbrevs(nextSet);
  };

  return (
    <div className={styles.container}>
      {/* Visual Guide Header */}
      <SentenceInputGuide
        focusedField={focusedField}
        activeTab={activeTab}
        sentenceCount={sentenceStats.totalSentences}
        paragraphCount={paragraphList.length}
      />

      {/* Tabs */}
      <TabSlider tabs={TABS} activeId={activeTab} onChange={setActiveTab} ariaLabel="Sentence counter modes" />

      <div className={styles.actionRow} style={{ justifyContent: 'flex-end' }}>
        <button className={styles.btnSecondary} onClick={handleCopyStats}>
          {copied ? '✓ Copied Stats' : '📋 Copy Statistics'}
        </button>
      </div>

      {/* Tab 1: Count & Highlight */}
      {activeTab === 'count' && (
        <div className={styles.card}>
          <TextInputPanel
            value={liveText}
            onChange={setText}
            label="Type or Paste Your Document"
            placeholder="Paste text here to inspect sentence boundaries, line counts, and paragraph structure..."
            rows={7}
            onFocus={() => setFocusedField('text')}
            onBlur={() => setFocusedField(null)}
          />

          <div style={{ marginTop: '16px' }}>
            <StatTiles stats={statItems} columns={3} />
          </div>

          <div className={styles.summaryCallout} style={{ marginTop: '14px' }}>
            Your text has <strong>{sentenceStats.totalSentences} sentences</strong> in{' '}
            <strong>{paragraphList.length} {paragraphList.length === 1 ? 'paragraph' : 'paragraphs'}</strong>.
            The average sentence is <strong>{sentenceStats.meanWords} words</strong> (median {sentenceStats.medianWords}); the longest is <strong>{sentenceStats.maxWords} words</strong>.
          </div>

          {/* Interactive Highlighted Text Viewer */}
          {sentenceStats.sentences.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <div className={styles.actionRow} style={{ marginBottom: '8px' }}>
                <span className={styles.label}>
                  Interactive Sentence Viewer (Long sentences outlined in red)
                </span>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <label htmlFor="sentence-thresh-input" className={styles.label} style={{ fontSize: '0.75rem', margin: 0 }}>
                    Long Sentence Limit:
                  </label>
                  <input
                    id="sentence-thresh-input"
                    type="number"
                    min={5}
                    max={60}
                    value={threshold}
                    onChange={(e) => setThreshold(Math.max(1, parseInt(e.target.value, 10) || 25))}
                    className={styles.input}
                    style={{ width: '64px', padding: '2px 6px', fontSize: '0.75rem' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>words</span>
                </div>
              </div>

              <div className={styles.highlightViewer}>
                {sentenceStats.sentences.map((item, idx) => (
                  <span
                    key={item.id}
                    className={`${styles.sentenceSpan} ${
                      idx % 2 === 0 ? styles.sentenceEven : styles.sentenceOdd
                    } ${item.isLong ? styles.sentenceLong : ''}`}
                    title={`Sentence #${item.id}: ${item.words} words. Click to select in text box.`}
                    onClick={() => handleSelectSentence(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.text}{' '}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Sentences List & Histogram */}
      {activeTab === 'sentences' && (
        <div className={styles.card}>
          <div className={styles.actionRow}>
            <span className={styles.label}>
              Sentence Breakdown ({sentenceStats.totalSentences} Total Sentences)
            </span>
            <span className={styles.fieldHint}>
              Threshold: {threshold} words • {sentenceStats.longSentencesCount} flagged
            </span>
          </div>

          {/* Histogram Summary */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Word Count Range</th>
                  <th>1–10 Words</th>
                  <th>11–20 Words</th>
                  <th>21–30 Words</th>
                  <th>31–40 Words</th>
                  <th>41+ Words</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Sentence Frequency</strong></td>
                  <td>{sentenceStats.histogram.bucket1_10}</td>
                  <td>{sentenceStats.histogram.bucket11_20}</td>
                  <td>{sentenceStats.histogram.bucket21_30}</td>
                  <td>{sentenceStats.histogram.bucket31_40}</td>
                  <td>{sentenceStats.histogram.bucket41Plus}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Numbered List of Sentences */}
          <div className={styles.sentenceList}>
            {sentenceStats.sentences.map((item) => (
              <div
                key={item.id}
                className={styles.sentenceListItem}
                onClick={() => handleSelectSentence(item)}
                style={{ cursor: 'pointer' }}
                title="Click to select and scroll in text box"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectSentence(item);
                  }
                }}
              >
                <span className={styles.sentenceListText}>
                  <strong>#{item.id}:</strong> {item.text}
                </span>
                <span
                  className={`${styles.sentenceBadge} ${
                    item.isLong ? styles.sentenceBadgeLong : ''
                  }`}
                >
                  {item.words} words {item.isLong ? '⚠️ (Long)' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Paragraphs Table */}
      {activeTab === 'paragraphs' && (
        <div className={styles.card}>
          <div className={styles.actionRow}>
            <span className={styles.label}>
              Paragraph Structure Analysis ({paragraphList.length} Total Paragraphs)
            </span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className={styles.fieldHint}>Mode:</span>
              <select
                value={paragraphMode}
                onChange={(e) => setParagraphMode(e.target.value as 'blankLine' | 'everyLine')}
                className={styles.select}
                style={{ padding: '3px 8px', fontSize: '0.75rem' }}
              >
                <option value="blankLine">Blank-line blocks (Standard)</option>
                <option value="everyLine">Every non-empty line</option>
              </select>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>¶ #</th>
                  <th>Snippet</th>
                  <th>Words</th>
                  <th>Sentences</th>
                  <th>Characters</th>
                  <th>Guideline Status</th>
                </tr>
              </thead>
              <tbody>
                {paragraphList.map((p) => (
                  <tr key={p.id}>
                    <td><strong>¶{p.id}</strong></td>
                    <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.text}
                    </td>
                    <td>{p.words}</td>
                    <td>{p.sentences}</td>
                    <td>{p.chars}</td>
                    <td>
                      {p.flag250 ? (
                        <span className={`${styles.flagBadge} ${styles.flag250}`}>
                          🚨 &gt; 250 Words (Too Long)
                        </span>
                      ) : p.flag150 ? (
                        <span className={`${styles.flagBadge} ${styles.flag150}`}>
                          ⚠️ &gt; 150 Words (Review)
                        </span>
                      ) : (
                        <span style={{ color: 'var(--ink-soft)', fontWeight: 600 }}>✓ Within 150 words</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.summaryCallout} style={{ marginTop: '12px' }}>
            <strong>digital.gov plain-language guide:</strong> &ldquo;paragraphs of no more than 150 words in three to eight sentences&rdquo;, and &ldquo;never longer than 250 words&rdquo; (<a href="https://digital.gov/guides/plain-language/writing/clear-short" target="_blank" rel="noopener noreferrer">source</a>, checked 2026-11-22).
          </div>
        </div>
      )}

      {/* Tab 4: Sentence Rules & Abbreviations */}
      {activeTab === 'rules' && (
        <div className={styles.card}>
          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginBottom: '14px' }}>
            <label className={styles.label} style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
              <input type="checkbox" checked={listLines} onChange={(e) => setListLines(e.target.checked)} />
              Count each list line as a sentence
            </label>
            <label className={styles.label} style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
              Long sentence (your threshold, words)
              <input
                type="number"
                min={5}
                max={60}
                value={threshold}
                onChange={(e) => setThreshold(Math.min(60, Math.max(5, parseInt(e.target.value, 10) || 25)))}
                className={styles.input}
                style={{ width: '72px', padding: '2px 6px' }}
              />
            </label>
          </div>
          <span className={styles.label}>Protected Abbreviation List</span>
          <p className={styles.fieldHint} style={{ margin: '4px 0 12px' }}>
            Titles such as Mr. and Dr., and any abbreviation you add, never end a sentence. Others (etc., Inc., a.m.) end one only when the next word starts with a capital, so “at 9 a.m. Monday” would split.
          </p>

          <form onSubmit={handleAddAbbrev} style={{ display: 'flex', gap: '8px', maxWidth: '360px', marginBottom: '14px' }}>
            <input
              type="text"
              placeholder="e.g. Gov or Dept"
              value={newAbbrev}
              onChange={(e) => setNewAbbrev(e.target.value)}
              className={styles.input}
              style={{ flex: 1 }}
            />
            <button type="submit" className={styles.btnPrimary}>
              + Add
            </button>
          </form>

          <div className={styles.chipList}>
            {Array.from(customAbbrevs)
              .sort()
              .map((abbrev) => (
                <span key={abbrev} className={styles.abbrevChip}>
                  {abbrev}.
                  <button
                    type="button"
                    onClick={() => handleRemoveAbbrev(abbrev)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--ink-soft)',
                      cursor: 'pointer',
                      padding: 0,
                      fontWeight: 700,
                    }}
                    aria-label={`Remove ${abbrev}`}
                  >
                    ×
                  </button>
                </span>
              ))}
          </div>

          <div style={{ marginTop: '16px' }}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => setCustomAbbrevs(new Set(ABBREVIATIONS_EN))}
            >
              Reset to Standard Abbreviations
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
