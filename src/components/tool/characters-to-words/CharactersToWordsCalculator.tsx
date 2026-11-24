'use client';

import React, { useState, useMemo, useDeferredValue, useEffect, useId } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import TextInputPanel from '@/components/tool/text/TextInputPanel';
import OverflowPreview from '@/components/tool/text/OverflowPreview';
import StatTiles, { StatTileItem } from '@/components/tool/text/StatTiles';
import CharsToWordsInputGuide from './CharsToWordsInputGuide';
import {
  DEFAULT_AVERAGE_WORD_LENGTH,
  calculateWordsFromChars,
  calculateCharsFromWords,
  measureWritingAverages,
  generateCharWordTable,
  WritingCalibration,
} from '@/lib/char-word-engine';
import { countGraphemes, charsNoSpaces, countWords, overflowIndex } from '@/lib/text-engine';
import styles from './CharactersToWordsCalculator.module.css';

type TabType = 'charsToWords' | 'wordsToChars' | 'checkText';

const TABS: TabItem<TabType>[] = [
  { id: 'charsToWords', label: '1. Characters → Words' },
  { id: 'wordsToChars', label: '2. Words → Characters' },
  { id: 'checkText', label: '3. Check My Text' },
];

const LIMIT_PRESETS = [150, 200, 255, 280, 500, 1000, 1500, 2000, 3000, 4000, 5000];

export default function CharactersToWordsCalculator() {
  const id = useId();
  const [tab, setTab] = useState<TabType>('charsToWords');
  const [charsInput, setCharsInput] = useState<number>(1000);
  const [wordsInput, setWordsInput] = useState<number>(250);
  const [countSpaces, setCountSpaces] = useState<boolean>(true);
  const [avgLetters, setAvgLetters] = useState<number>(DEFAULT_AVERAGE_WORD_LENGTH);
  const [livePastedText, setPastedText] = useState<string>('');
  const pastedText = useDeferredValue(livePastedText);
  const [limit, setLimit] = useState<number>(1000);
  const [calibration, setCalibration] = useState<WritingCalibration | null>(null);
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

  // Live calculations for Tab 1 (Chars → Words)
  const estimateResult = useMemo(
    () =>
      calculateWordsFromChars(charsInput, {
        countSpaces,
        avgLetters,
        punctuation: 0,
      }),
    [charsInput, countSpaces, avgLetters]
  );

  // Live calculations for Tab 2 (Words → Chars)
  const reverseResult = useMemo(
    () =>
      calculateCharsFromWords(wordsInput, {
        countSpaces,
        avgLetters,
        punctuation: 0,
      }),
    [wordsInput, countSpaces, avgLetters]
  );

  // Live calculations for Tab 3 (Pasted text check)
  const textCharsWithSpaces = useMemo(() => countGraphemes(pastedText), [pastedText]);
  const textCharsNoSpaces = useMemo(() => charsNoSpaces(pastedText), [pastedText]);
  const textWords = useMemo(() => countWords(pastedText), [pastedText]);
  const activeCount = countSpaces ? textCharsWithSpaces : textCharsNoSpaces;
  const charsLeft = limit - activeCount;

  // Handle "Use my writing" calibration
  const handleCalibrate = () => {
    const stats = measureWritingAverages(pastedText);
    if (stats) {
      setCalibration(stats);
      setAvgLetters(stats.avgLettersPerWord);
    }
  };

  const handleResetCalibration = () => {
    setCalibration(null);
    setAvgLetters(DEFAULT_AVERAGE_WORD_LENGTH);
  };

  // Dynamic reference table generated from current calibration / settings
  const dynamicTable = useMemo(
    () => generateCharWordTable({ avgLetters, punctuation: 0 }),
    [avgLetters]
  );

  // Formatted sentence for Tab 1
  const summarySentence = useMemo(() => {
    const spacesText = countSpaces ? 'with spaces' : 'without spaces';
    return `${charsInput.toLocaleString('en-US')} characters ${spacesText} is about ${estimateResult.words.toLocaleString('en-US')} words (between ${estimateResult.rangeFormatted}), assuming an average word of ${avgLetters} letters${countSpaces ? ' plus a space' : ''}.`;
  }, [charsInput, countSpaces, estimateResult, avgLetters]);

  const handleCopySentence = () => {
    navigator.clipboard?.writeText(summarySentence).then(
      () => {
        setCopiedSentence(true);
        setTimeout(() => setCopiedSentence(false), 2000);
      },
      () => {}
    );
  };

  // Stat tiles for Tab 3
  const checkStatTiles: StatTileItem[] = useMemo(
    () => [
      {
        id: 'chars',
        label: countSpaces ? 'Characters (Spaces)' : 'Characters (No Spaces)',
        value: activeCount.toLocaleString('en-US'),
        sublabel: `${textCharsWithSpaces} with spaces · ${textCharsNoSpaces} no spaces`,
      },
      {
        id: 'words',
        label: 'Actual Words',
        value: textWords.toLocaleString('en-US'),
      },
      {
        id: 'left',
        label: charsLeft >= 0 ? 'Characters Left' : 'Over Limit',
        value: Math.abs(charsLeft).toLocaleString('en-US'),
        highlight: charsLeft >= 0,
        warning: charsLeft < 0,
      },
      {
        id: 'avgWord',
        label: 'Avg Length',
        value: textWords > 0 ? (textCharsNoSpaces / textWords).toFixed(1) : '—',
        sublabel: 'letters per word',
      },
    ],
    [activeCount, countSpaces, textCharsWithSpaces, textCharsNoSpaces, textWords, charsLeft, limit]
  );

  return (
    <div className={styles.calculator}>
      <TabSlider tabs={TABS} activeId={tab} onChange={handleTabChange} ariaLabel="Calculator Modes" />

      {/* Interactive visual guide */}
      <CharsToWordsInputGuide
        activeTab={tab}
        chars={tab === 'checkText' ? activeCount : charsInput}
        words={tab === 'checkText' ? textWords : estimateResult.words}
        avgLetters={avgLetters}
        countSpaces={countSpaces}
        focusedField={focusedField}
        limit={limit}
        charsLeft={charsLeft}
      />

      {/* Tab 1: Characters to Words */}
      {tab === 'charsToWords' && (
        <>
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor={`${id}-chars`} className={styles.label}>
                <span>Character Count</span>
                <span className={styles.labelHint}>e.g. 500, 1000, 2000</span>
              </label>
              <input
                id={`${id}-chars`}
                type="number"
                min="1"
                max="500000"
                value={charsInput || ''}
                onChange={(e) => setCharsInput(Math.max(0, parseInt(e.target.value, 10) || 0))}
                onFocus={() => setFocusedField('chars')}
                onBlur={() => setFocusedField(null)}
                className={styles.input}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span>Count Spaces?</span>
                <span className={styles.labelHint}>Included in limit</span>
              </label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name={`${id}-spaces`}
                    checked={countSpaces}
                    onChange={() => setCountSpaces(true)}
                    onFocus={() => setFocusedField('countSpaces')}
                    onBlur={() => setFocusedField(null)}
                  />
                  With spaces (default)
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name={`${id}-spaces`}
                    checked={!countSpaces}
                    onChange={() => setCountSpaces(false)}
                    onFocus={() => setFocusedField('countSpaces')}
                    onBlur={() => setFocusedField(null)}
                  />
                  Without spaces
                </label>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor={`${id}-avgLetters`} className={styles.label}>
                <span>Average Word Length</span>
                <span className={styles.labelHint}>Commonly used average: 4.7, edit</span>
              </label>
              <input
                id={`${id}-avgLetters`}
                type="number"
                step="0.1"
                min="2"
                max="12"
                value={avgLetters}
                onChange={(e) => setAvgLetters(parseFloat(e.target.value) || DEFAULT_AVERAGE_WORD_LENGTH)}
                onFocus={() => setFocusedField('avgLetters')}
                onBlur={() => setFocusedField(null)}
                className={styles.input}
              />
            </div>
          </div>

          {calibration && (
            <div className={styles.calibrationBanner}>
              <span>
                🎯 <strong>Custom Calibration Active:</strong> Using your writing’s measured average of{' '}
                <strong>{calibration.avgLettersPerWord} letters</strong> ({calibration.charsWithSpacesPerWord} chars
                with spaces) per word.
              </span>
              <button type="button" onClick={handleResetCalibration} className={styles.resetCalibBtn}>
                Reset to 4.7 default
              </button>
            </div>
          )}

          <div className={styles.resultHero}>
            <div className={styles.headlineRow}>
              <div className={styles.resultPrimary}>≈ {estimateResult.wordsFormatted} words</div>
              <div className={styles.resultRange}>Estimated Range: {estimateResult.rangeFormatted} words</div>
            </div>

            <div className={styles.sentenceBox}>
              <span>{summarySentence}</span>
              <button type="button" onClick={handleCopySentence} className={styles.copyButton}>
                {copiedSentence ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <div className={styles.methodLine}>
              Method: {charsInput.toLocaleString('en-US')} characters ÷ ({avgLetters} letters{' '}
              {countSpaces ? '+ 1 space' : ''}) = {(charsInput / estimateResult.perWordUsed).toFixed(1)} words
            </div>
          </div>
        </>
      )}

      {/* Tab 2: Words to Characters */}
      {tab === 'wordsToChars' && (
        <>
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor={`${id}-words`} className={styles.label}>
                <span>Word Count</span>
                <span className={styles.labelHint}>e.g. 250, 500, 1000</span>
              </label>
              <input
                id={`${id}-words`}
                type="number"
                min="1"
                max="100000"
                value={wordsInput || ''}
                onChange={(e) => setWordsInput(Math.max(0, parseInt(e.target.value, 10) || 0))}
                onFocus={() => setFocusedField('words')}
                onBlur={() => setFocusedField(null)}
                className={styles.input}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span>Include Spaces in Character Total?</span>
              </label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name={`${id}-rev-spaces`}
                    checked={countSpaces}
                    onChange={() => setCountSpaces(true)}
                  />
                  With spaces
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name={`${id}-rev-spaces`}
                    checked={!countSpaces}
                    onChange={() => setCountSpaces(false)}
                  />
                  Without spaces
                </label>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor={`${id}-rev-avgLetters`} className={styles.label}>
                <span>Average Word Length</span>
                <span className={styles.labelHint}>Commonly used average: 4.7, edit</span>
              </label>
              <input
                id={`${id}-rev-avgLetters`}
                type="number"
                step="0.1"
                min="2"
                max="12"
                value={avgLetters}
                onChange={(e) => setAvgLetters(parseFloat(e.target.value) || DEFAULT_AVERAGE_WORD_LENGTH)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.resultHero}>
            <div className={styles.headlineRow}>
              <div className={styles.resultPrimary}>≈ {reverseResult.charactersFormatted} characters</div>
              <div className={styles.resultRange}>
                {countSpaces ? 'With spaces included' : 'Without spaces'}
              </div>
            </div>

            <div className={styles.sentenceBox}>
              <span>
                {wordsInput.toLocaleString('en-US')} words produces approximately{' '}
                <strong>{reverseResult.charactersFormatted} characters</strong>{' '}
                {countSpaces ? 'with spaces' : 'without spaces'} (at {avgLetters} letters/word).
              </span>
            </div>

            <div className={styles.methodLine}>
              Method: {wordsInput.toLocaleString('en-US')} words × ({avgLetters} letters{' '}
              {countSpaces ? '+ 1 space' : ''}) = {reverseResult.characters.toLocaleString('en-US')} characters
            </div>
          </div>
        </>
      )}

      {/* Tab 3: Check My Text */}
      {tab === 'checkText' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor={`${id}-limit`} className={styles.label}>
                <span>Target Limit</span>
                <span className={styles.labelHint}>Presets or custom</span>
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input
                  id={`${id}-limit`}
                  type="number"
                  min="1"
                  max="500000"
                  value={limit}
                  onChange={(e) => setLimit(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  onFocus={() => setFocusedField('limit')}
                  onBlur={() => setFocusedField(null)}
                  className={styles.input}
                  style={{ width: '130px' }}
                />
                <select
                  aria-label="Common limit presets"
                  value={LIMIT_PRESETS.includes(limit) ? limit : 'custom'}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val !== 'custom') setLimit(parseInt(val, 10));
                  }}
                  className={styles.select}
                  style={{ width: 'auto', flex: 1 }}
                >
                  <option value="custom">Presets...</option>
                  {LIMIT_PRESETS.map((p) => (
                    <option key={p} value={p}>
                      {p.toLocaleString('en-US')} characters
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span>Count Spaces Toward Limit?</span>
              </label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name={`${id}-chk-spaces`}
                    checked={countSpaces}
                    onChange={() => setCountSpaces(true)}
                  />
                  With spaces
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name={`${id}-chk-spaces`}
                    checked={!countSpaces}
                    onChange={() => setCountSpaces(false)}
                  />
                  Without spaces
                </label>
              </div>
            </div>

            <div className={styles.fieldGroup} style={{ justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleCalibrate}
                disabled={!pastedText || textWords < 3}
                className={styles.copyButton}
                style={{ padding: '0.65rem 1rem', background: 'var(--cat-writing-soft)', color: 'var(--cat-writing-ink)' }}
              >
                🔬 Measure My Writing Average
              </button>
            </div>
          </div>

          <TextInputPanel
            value={livePastedText}
            onChange={setPastedText}
            label="Your drafted statement or essay"
            placeholder="Paste your application essay, job portal statement, or bio here to check exact character limits..."
          />

          <OverflowPreview text={pastedText} start={overflowIndex(pastedText, limit, countSpaces ? 'graphemes' : 'noSpaces')} />

          <StatTiles stats={checkStatTiles} columns={4} />

          {calibration && (
            <div className={styles.calibrationBanner}>
              <span>
                ✓ <strong>Writing Measured:</strong> Your text averages{' '}
                <strong>{calibration.avgLettersPerWord} letters</strong> per word. This custom average now applies
                to the conversion tables and calculator tabs.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Dynamic Conversion Table */}
      <div className={styles.tableSection}>
        <h3 className={styles.tableSectionTitle}>
          Common Character Limits to Words Reference Table ({avgLetters} letters/word)
        </h3>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Character Count</th>
                <th>Words (With Spaces)</th>
                <th>Range (With Spaces)</th>
                <th>Words (Without Spaces)</th>
                <th>Range (Without Spaces)</th>
              </tr>
            </thead>
            <tbody>
              {dynamicTable.map((row) => {
                const isHighlighted = row.chars === 1000;
                return (
                  <tr key={row.chars} className={isHighlighted ? styles.highlightRow : undefined}>
                    <td>
                      <strong>{row.chars.toLocaleString('en-US')} characters</strong>
                    </td>
                    <td>{row.withSpaces.est.toLocaleString('en-US')} words</td>
                    <td>
                      {row.withSpaces.low.toLocaleString('en-US')}–{row.withSpaces.high.toLocaleString('en-US')}
                    </td>
                    <td>{row.withoutSpaces.est.toLocaleString('en-US')} words</td>
                    <td>
                      {row.withoutSpaces.low.toLocaleString('en-US')}–{row.withoutSpaces.high.toLocaleString('en-US')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
