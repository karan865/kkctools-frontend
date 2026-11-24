'use client';

import React, { useState, useMemo, useDeferredValue, useEffect, useId } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import TextInputPanel from '@/components/tool/text/TextInputPanel';
import StatTiles, { StatTileItem } from '@/components/tool/text/StatTiles';
import WordsToPagesInputGuide from './WordsToPagesInputGuide';
import {
  PaperSize,
  LineSpacing,
  BookTrimSize,
  BOOK_TRIM_PRESETS,
  calculateWordsPerPage,
  calculatePagesFromWords,
  calculateWordsFromPages,
  calculateBookPages,
  generateWordsToPagesTable,
} from '@/lib/page-estimate-engine';
import { countWords } from '@/lib/text-engine';
import styles from './WordsToPagesCalculator.module.css';

type TabType = 'wordsToPages' | 'pagesToWords' | 'pasteText' | 'bookPages';

const TABS: TabItem<TabType>[] = [
  { id: 'wordsToPages', label: '1. Words → Pages' },
  { id: 'pagesToWords', label: '2. Pages → Words' },
  { id: 'pasteText', label: '3. Paste Text' },
  { id: 'bookPages', label: '4. Book Pages' },
];

export default function WordsToPagesCalculator() {
  const id = useId();
  const [tab, setTab] = useState<TabType>('wordsToPages');
  const [wordsInput, setWordsInput] = useState<number>(1000);
  const [pagesInput, setPagesInput] = useState<number>(5);
  const [livePastedText, setPastedText] = useState<string>('');
  const pastedText = useDeferredValue(livePastedText);
  const [fontSize, setFontSize] = useState<number>(12);
  const [lineSpacing, setLineSpacing] = useState<LineSpacing>('single');
  const [paper, setPaper] = useState<PaperSize>('letter');
  const [marginInches, setMarginInches] = useState<number>(1.0);
  const [wordsPerSentence, setWordsPerSentence] = useState<number>(20);
  const [wordsPerParagraph, setWordsPerParagraph] = useState<number>(100);
  const [bookTrim, setBookTrim] = useState<BookTrimSize>('6x9');
  const [bookWordsPerPage, setBookWordsPerPage] = useState<number>(250);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [copiedSentence, setCopiedSentence] = useState<boolean>(false);

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

  const currentOptions = useMemo(
    () => ({
      fontSize,
      lineSpacing,
      paper,
      marginInches,
    }),
    [fontSize, lineSpacing, paper, marginInches]
  );

  const wordsPerPage = useMemo(() => calculateWordsPerPage(currentOptions), [currentOptions]);

  // Tab 1 & Tab 3: Calculate pages from words
  const activeWordCount = tab === 'pasteText' ? countWords(pastedText, { hyphenJoin: true }) : wordsInput;
  const pageResult = useMemo(
    () => calculatePagesFromWords(activeWordCount, currentOptions, wordsPerSentence, wordsPerParagraph),
    [activeWordCount, currentOptions, wordsPerSentence, wordsPerParagraph]
  );

  // Tab 2: Calculate words from pages
  const reverseWords = useMemo(
    () => calculateWordsFromPages(pagesInput, currentOptions),
    [pagesInput, currentOptions]
  );

  // Tab 4: Calculate book pages
  const bookResult = useMemo(
    () => calculateBookPages(activeWordCount, bookTrim, bookWordsPerPage),
    [activeWordCount, bookTrim, bookWordsPerPage]
  );

  // Big reference table generated dynamically
  const tableRows = useMemo(() => generateWordsToPagesTable(currentOptions), [currentOptions]);

  const layoutText = `${fontSize} pt, ${marginInches}-inch margins, ${paper === 'a4' ? 'A4' : 'Letter'} paper`;
  const singlePages = calculatePagesFromWords(activeWordCount, { ...currentOptions, lineSpacing: 'single' });
  const doublePages = calculatePagesFromWords(activeWordCount, { ...currentOptions, lineSpacing: 'double' });

  const summarySentence =
    tab === 'pagesToWords'
      ? `${pagesInput} pages is approximately ${reverseWords.toLocaleString('en-US')} words (${lineSpacing === 'single' || lineSpacing === 'double' ? lineSpacing : lineSpacing + '-line'} spacing, ${layoutText}).`
      : tab === 'bookPages'
      ? `${activeWordCount.toLocaleString('en-US')} words is about ${bookResult.pages} pages in a ${BOOK_TRIM_PRESETS[bookTrim].label} book (${bookWordsPerPage} words per page).`
      : `${activeWordCount.toLocaleString('en-US')} words is about ${singlePages.pagesFormatted} pages single-spaced or ${doublePages.pagesFormatted} pages double-spaced (${layoutText}).`;

  const handleCopySummary = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(summarySentence);
        setCopiedSentence(true);
        setTimeout(() => setCopiedSentence(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  // Primary Headline Stat Tiles
  const headlineStats: StatTileItem[] = useMemo(() => {
    return [
      {
        id: 'pages',
        label: 'Estimated Pages',
        value: pageResult.pagesFormatted,
        sublabel: `Range: ${pageResult.rangeFormatted} pages`,
        highlight: true,
      },
      {
        id: 'wpp',
        label: 'Words Per Page',
        value: pageResult.wordsPerPageFormatted,
        sublabel: `${lineSpacing} spacing yield`,
      },
      {
        id: 'paragraphs',
        label: 'Estimated Paragraphs',
        value: pageResult.paragraphs,
        sublabel: `~${wordsPerParagraph} words/para`,
      },
      {
        id: 'sentences',
        label: 'Estimated Sentences',
        value: pageResult.sentences,
        sublabel: `~${wordsPerSentence} words/sent`,
      },
    ];
  }, [pageResult, lineSpacing, wordsPerParagraph, wordsPerSentence]);

  return (
    <div className={styles.container}>
      <TabSlider tabs={TABS} activeId={tab} onChange={handleTabChange} ariaLabel="Words to pages modes" />

      {/* Input Guide Diagram */}
      <WordsToPagesInputGuide
        focusedField={focusedField}
        activeTab={tab}
        paper={paper}
        spacing={lineSpacing}
        fontSize={fontSize}
        marginInches={marginInches}
        trim={bookTrim}
        wordsPerPage={tab === 'bookPages' ? bookWordsPerPage : wordsPerPage}
      />

      {/* Model Convention Label */}
      <div className={styles.conventionCard}>
        <span className={styles.conventionDot} aria-hidden="true" />
        <span>
          <strong>Typographical Model:</strong> Based on the common 500-words-per-page convention
          (12 pt, single-spaced, Letter paper, 1-inch margins).
        </span>
      </div>

      {/* Common Controls Row */}
      {tab !== 'bookPages' && (
        <div className={styles.controlsCard}>
          <div className={styles.controlsGrid}>
            <div className={styles.field}>
              <label htmlFor={`${id}-spacing`} className={styles.label}>
                Line Spacing
              </label>
              <select
                id={`${id}-spacing`}
                className={styles.select}
                value={lineSpacing}
                onChange={(e) => setLineSpacing(e.target.value as LineSpacing)}
                onFocus={() => setFocusedField('spacing')}
                onBlur={() => setFocusedField(null)}
              >
                <option value="single">Single (1.0)</option>
                <option value="1.15">1.15 Spacing</option>
                <option value="1.5">1.5 Spacing</option>
                <option value="double">Double (2.0)</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-size`} className={styles.label}>
                Font Size
              </label>
              <select
                id={`${id}-size`}
                className={styles.select}
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                onFocus={() => setFocusedField('fontSize')}
                onBlur={() => setFocusedField(null)}
              >
                <option value="10">10 pt</option>
                <option value="11">11 pt</option>
                <option value="12">12 pt (standard)</option>
                <option value="13">13 pt</option>
                <option value="14">14 pt</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-wps`} className={styles.label}>
                Words per sentence
              </label>
              <input
                id={`${id}-wps`}
                type="number"
                min="1"
                max="100"
                className={styles.numberInput}
                value={wordsPerSentence}
                onChange={(e) => setWordsPerSentence(Math.max(1, parseInt(e.target.value, 10) || 1))}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-wpp`} className={styles.label}>
                Words per paragraph
              </label>
              <input
                id={`${id}-wpp`}
                type="number"
                min="1"
                max="1000"
                className={styles.numberInput}
                value={wordsPerParagraph}
                onChange={(e) => setWordsPerParagraph(Math.max(1, parseInt(e.target.value, 10) || 1))}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-paper`} className={styles.label}>
                Paper Size
              </label>
              <select
                id={`${id}-paper`}
                className={styles.select}
                value={paper}
                onChange={(e) => setPaper(e.target.value as PaperSize)}
                onFocus={() => setFocusedField('paper')}
                onBlur={() => setFocusedField(null)}
              >
                <option value="letter">Letter (8.5 × 11 in)</option>
                <option value="a4">A4 (8.27 × 11.69 in)</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-margins`} className={styles.label}>
                Margins (inches)
              </label>
              <select
                id={`${id}-margins`}
                className={styles.select}
                value={marginInches}
                onChange={(e) => setMarginInches(parseFloat(e.target.value))}
                onFocus={() => setFocusedField('margins')}
                onBlur={() => setFocusedField(null)}
              >
                <option value="0.5">0.5 in (Narrow)</option>
                <option value="0.75">0.75 in</option>
                <option value="1">1.0 in (Standard)</option>
                <option value="1.25">1.25 in (Wide)</option>
                <option value="1.5">1.5 in (Large)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: WORDS TO PAGES */}
      {tab === 'wordsToPages' && (
        <div className={styles.tabContent}>
          <div className={styles.mainInputCard}>
            <div className={styles.inputGroup}>
              <label htmlFor={`${id}-words`} className={styles.mainLabel}>
                Word Count
              </label>
              <input
                id={`${id}-words`}
                type="number"
                min="1"
                max="500000"
                step="50"
                className={styles.mainInput}
                value={wordsInput}
                onChange={(e) => setWordsInput(Math.max(0, parseInt(e.target.value, 10) || 0))}
              />
            </div>
            <div className={styles.presetButtons}>
              {[250, 500, 750, 1000, 1500, 2000, 2500, 3000, 5000].map((w) => (
                <button
                  key={w}
                  type="button"
                  className={`${styles.presetBtn} ${wordsInput === w ? styles.activePreset : ''}`}
                  onClick={() => setWordsInput(w)}
                >
                  {w.toLocaleString('en-US')}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.summaryBar}>
            <p className={styles.summaryText}>{summarySentence}</p>
            <button type="button" className={styles.copyBtn} onClick={handleCopySummary}>
              {copiedSentence ? '✓ Copied' : '📋 Copy Summary'}
            </button>
          </div>

          <StatTiles stats={headlineStats} columns={4} />
        </div>
      )}

      {/* TAB 2: PAGES TO WORDS */}
      {tab === 'pagesToWords' && (
        <div className={styles.tabContent}>
          <div className={styles.mainInputCard}>
            <div className={styles.inputGroup}>
              <label htmlFor={`${id}-pages-rev`} className={styles.mainLabel}>
                Target Page Count
              </label>
              <input
                id={`${id}-pages-rev`}
                type="number"
                min="0.5"
                max="1000"
                step="0.5"
                className={styles.mainInput}
                value={pagesInput}
                onChange={(e) => setPagesInput(Math.max(0, parseFloat(e.target.value) || 0))}
              />
            </div>
            <div className={styles.presetButtons}>
              {[1, 2, 3, 4, 5, 10, 15, 20].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`${styles.presetBtn} ${pagesInput === p ? styles.activePreset : ''}`}
                  onClick={() => setPagesInput(p)}
                >
                  {p} {p === 1 ? 'page' : 'pages'}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.summaryBar}>
            <p className={styles.summaryText}>{summarySentence}</p>
            <button type="button" className={styles.copyBtn} onClick={handleCopySummary}>
              {copiedSentence ? '✓ Copied' : '📋 Copy Summary'}
            </button>
          </div>

          <div className={styles.reverseHeroCard}>
            <div className={styles.reverseHeroLabel}>Required Word Count</div>
            <div className={styles.reverseHeroValue}>≈ {reverseWords.toLocaleString('en-US')} words</div>
            <div className={styles.reverseHeroDesc}>
              Range: {Math.round(reverseWords * 0.9).toLocaleString('en-US')} –{' '}
              {Math.round(reverseWords * 1.1).toLocaleString('en-US')} words based on standard density.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PASTE TEXT */}
      {tab === 'pasteText' && (
        <div className={styles.tabContent}>
          <TextInputPanel
            value={livePastedText}
            onChange={setPastedText}
            label="Paste your essay, article, or manuscript"
            placeholder="Paste text here to instantly see how many pages it fills..."
          />

          <div className={styles.summaryBar}>
            <p className={styles.summaryText}>{summarySentence}</p>
            <button type="button" className={styles.copyBtn} onClick={handleCopySummary}>
              {copiedSentence ? '✓ Copied' : '📋 Copy Summary'}
            </button>
          </div>

          <StatTiles stats={headlineStats} columns={4} />
        </div>
      )}

      {/* TAB 4: BOOK PAGES */}
      {tab === 'bookPages' && (
        <div className={styles.tabContent}>
          <div className={styles.controlsCard}>
            <div className={styles.controlsGrid}>
              <div className={styles.field}>
                <label htmlFor={`${id}-book-words`} className={styles.label}>
                  Manuscript Words
                </label>
                <input
                  id={`${id}-book-words`}
                  type="number"
                  min="1000"
                  max="1000000"
                  step="5000"
                  className={styles.numberInput}
                  value={activeWordCount}
                  onChange={(e) => setWordsInput(Math.max(0, parseInt(e.target.value, 10) || 0))}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor={`${id}-trim`} className={styles.label}>
                  Trim Size
                </label>
                <select
                  id={`${id}-trim`}
                  className={styles.select}
                  value={bookTrim}
                  onChange={(e) => setBookTrim(e.target.value as BookTrimSize)}
                >
                  {Object.entries(BOOK_TRIM_PRESETS).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor={`${id}-density`} className={styles.label}>
                  Words Per Book Page
                </label>
                <input
                  id={`${id}-density`}
                  type="number"
                  min="150"
                  max="400"
                  className={styles.numberInput}
                  value={bookWordsPerPage}
                  onChange={(e) => setBookWordsPerPage(Math.max(100, parseInt(e.target.value, 10) || 250))}
                />
                <span className={styles.fieldHint}>example figure, edit to match your layout</span>
              </div>
            </div>
          </div>

          <div className={styles.reverseHeroCard}>
            <div className={styles.reverseHeroLabel}>Estimated Typeset Book Pages</div>
            <div className={styles.reverseHeroValue}>≈ {bookResult.pages} pages</div>
            <div className={styles.reverseHeroDesc}>
              Calculated at {bookWordsPerPage} words per page for a {BOOK_TRIM_PRESETS[bookTrim].label} trim.
            </div>
          </div>
        </div>
      )}

      {/* Live Word-to-Pages Reference Table */}
      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>Words to Pages Reference Guide</div>
          <span className={styles.tableSubtitle}>
            Live table updated for {fontSize} pt, {paper === 'a4' ? 'A4' : 'Letter'} paper, {marginInches}-inch margins
          </span>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <caption>Pages, sentences and paragraphs by word count (500 words per single-spaced page convention)</caption>
            <thead>
              <tr>
                <th>Word Count</th>
                <th>Single Spaced (1.0)</th>
                <th>1.5 Spaced</th>
                <th>Double Spaced (2.0)</th>
                <th>Est. Sentences</th>
                <th>Est. Paragraphs</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.words}>
                  <td><strong>{row.words.toLocaleString('en-US')} words</strong></td>
                  <td>{row.singlePages} pages</td>
                  <td>{row.onePointFivePages} pages</td>
                  <td>{row.doublePages} pages</td>
                  <td>{Math.round(row.words / wordsPerSentence).toLocaleString('en-US')}</td>
                  <td>{Math.round(row.words / wordsPerParagraph).toLocaleString('en-US')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
