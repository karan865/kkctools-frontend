'use client';

import React, { useState, useMemo, useDeferredValue, useEffect, useId } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import TextInputPanel from '@/components/tool/text/TextInputPanel';
import OverflowPreview from '@/components/tool/text/OverflowPreview';
import StatTiles, { StatTileItem } from '@/components/tool/text/StatTiles';
import CharacterInputGuide from './CharacterInputGuide';
import { TEXT_LIMIT_PRESETS, TextLimitPreset } from '@/data/text-limits';
import {
  analyzeText,
  countGraphemes,
  countWords,
  overflowIndex,
} from '@/lib/text-engine';
import styles from './CharacterCounter.module.css';

type TabType = 'count' | 'limit' | 'details';

const TABS: TabItem<TabType>[] = [
  { id: 'count', label: '1. Character Count' },
  { id: 'limit', label: '2. Check Limit' },
  { id: 'details', label: '3. Text Details' },
];

const LIMIT_PRESETS = [100, 150, 160, 200, 255, 280, 500, 1000, 2000, 5000];

type LimitUnit = 'graphemes' | 'noSpaces' | 'words' | 'bytes';

export default function CharacterCounter() {
  const id = useId();
  const [tab, setTab] = useState<TabType>('count');
  const [liveText, setText] = useState<string>('The quick brown fox jumps over the lazy dog.');
  const text = useDeferredValue(liveText);
  const [limit, setLimit] = useState<number>(500);
  const [limitUnit, setLimitUnit] = useState<LimitUnit>('graphemes');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('custom');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [caseSensitiveFreq, setCaseSensitiveFreq] = useState<boolean>(false);
  const [cjkPerChar, setCjkPerChar] = useState<boolean>(false);
  const [ignorePunctuation, setIgnorePunctuation] = useState<boolean>(false);
  const [ignoreDigits, setIgnoreDigits] = useState<boolean>(false);
  const [nfcNormalization, setNfcNormalization] = useState<boolean>(true);
  const [copiedSentence, setCopiedSentence] = useState<boolean>(false);

  // Sync tab with URL parameter ?tab=
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const syncFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab') as TabType;
        if (tabParam && ['count', 'limit', 'details'].includes(tabParam)) {
          setTab(tabParam);
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

  // Perform full text analysis with options
  const analysis = useMemo(() => {
    return analyzeText(text, {
      nfc: nfcNormalization,
      ignorePunctuation,
      ignoreDigits,
      cjkPerChar,
    });
  }, [text, nfcNormalization, ignorePunctuation, ignoreDigits, cjkPerChar]);

  // Determine current count against selected limit unit
  const currentCountForLimit = useMemo(() => {
    switch (limitUnit) {
      case 'noSpaces':
        return analysis.charactersNoSpaces;
      case 'words':
        return analysis.words;
      case 'bytes':
        return analysis.utf8Bytes;
      case 'graphemes':
      default:
        return analysis.characters;
    }
  }, [analysis, limitUnit]);

  const remaining = limit - currentCountForLimit;
  const isOverLimit = remaining < 0;
  const overflowStart = useMemo(
    () =>
      tab === 'limit' && isOverLimit
        ? overflowIndex(text, limit, limitUnit, {
            nfc: nfcNormalization,
            ignorePunctuation,
            ignoreDigits,
          })
        : -1,
    [tab, isOverLimit, text, limit, limitUnit, nfcNormalization, ignorePunctuation, ignoreDigits]
  );
  const unitLabel = { graphemes: 'Characters', noSpaces: 'Characters (no spaces)', words: 'Words', bytes: 'Bytes' }[limitUnit];
  const percentUsed = limit > 0 ? Math.min(100, Math.round((currentCountForLimit / limit) * 100)) : 0;

  // Primary Headline Stat Tiles
  const headlineStats: StatTileItem[] = useMemo(() => {
    return [
      {
        id: 'characters',
        label: 'Characters (with spaces)',
        value: analysis.characters,
        sublabel: 'Emoji count as 1',
        highlight: true,
      },
      {
        id: 'noSpaces',
        label: 'Without Spaces',
        value: analysis.charactersNoSpaces,
        sublabel: 'Whitespace excluded',
      },
      {
        id: 'words',
        label: 'Words',
        value: analysis.words,
        sublabel: cjkPerChar ? 'Each CJK character = 1' : 'Hyphenated = 1 word',
      },
      {
        id: 'sentences',
        label: 'Sentences',
        value: analysis.sentences,
        sublabel: `${analysis.lines} ${analysis.lines === 1 ? 'line' : 'lines'}`,
      },
    ];
  }, [analysis]);

  // Secondary metrics
  const secondaryStats: StatTileItem[] = useMemo(() => {
    const items: StatTileItem[] = [
      { id: 'paragraphs', label: 'Paragraphs', value: analysis.paragraphs },
      { id: 'bytes', label: 'UTF-8 Bytes', value: analysis.utf8Bytes },
      { id: 'emojis', label: 'Emoji Symbols', value: analysis.emojis },
      { id: 'letters', label: 'Letters', value: analysis.classCounts.letters },
      { id: 'digits', label: 'Digits', value: analysis.classCounts.digits },
      { id: 'punct', label: 'Punctuation & Symbols', value: analysis.classCounts.punctuation + analysis.classCounts.symbols },
    ];

    if (analysis.scriptCounts.han > 0 || analysis.scriptCounts.hiragana > 0 || analysis.scriptCounts.katakana > 0 || analysis.scriptCounts.hangul > 0) {
      items.push({
        id: 'cjk',
        label: 'CJK Characters',
        value: analysis.scriptCounts.han + analysis.scriptCounts.hiragana + analysis.scriptCounts.katakana + analysis.scriptCounts.hangul,
        sublabel: `Han ${analysis.scriptCounts.han} · Kana ${analysis.scriptCounts.hiragana + analysis.scriptCounts.katakana} · Hangul ${analysis.scriptCounts.hangul}`,
      });
    }

    return items;
  }, [analysis]);

  // Top character frequency list (Details tab)
  const characterFrequencies = useMemo(() => {
    if (!text) return [];
    const map = new Map<string, number>();
    const graphemeList = Array.from(
      typeof Intl !== 'undefined' && Intl.Segmenter
        ? new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(text)
        : Array.from(text).map((ch) => ({ segment: ch }))
    );

    for (const item of graphemeList) {
      let char = item.segment;
      if (!caseSensitiveFreq) {
        char = char.toLowerCase();
      }
      if (char === ' ') char = '(space)';
      else if (char === '\n') char = '(newline)';
      else if (char === '\t') char = '(tab)';

      map.set(char, (map.get(char) || 0) + 1);
    }

    const total = graphemeList.length;
    return Array.from(map.entries())
      .map(([char, count]) => ({
        char,
        count,
        percentage: ((count / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }, [text, caseSensitiveFreq]);

  // Paragraph lengths list (Details tab)
  const paragraphLengths = useMemo(() => {
    if (!text.trim()) return [];
    const rawParas = text.split(/\r?\n\s*\r?\n/);
    return rawParas.map((para, idx) => ({
      index: idx + 1,
      snippet: para.trim().slice(0, 48) + (para.length > 48 ? '...' : ''),
      characters: countGraphemes(para),
      words: countWords(para),
    }));
  }, [text]);

  const activeFiltersNote = useMemo(() => {
    const filters: string[] = [];
    if (ignorePunctuation) filters.push('punctuation ignored');
    if (ignoreDigits) filters.push('digits ignored');
    if (!nfcNormalization) filters.push('NFC disabled');
    return filters.length > 0 ? ` [${filters.join(', ')}]` : '';
  }, [ignorePunctuation, ignoreDigits, nfcNormalization]);

  const summarySentence = `Your text has ${analysis.characters.toLocaleString('en-US')} characters (${analysis.charactersNoSpaces.toLocaleString('en-US')} without spaces) and ${analysis.words.toLocaleString('en-US')} words.${activeFiltersNote}`;

  const handleCopySentence = async () => {
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

  const handlePlatformPreset = (preset: TextLimitPreset) => {
    setLimit(preset.limit);
    setSelectedPresetId(preset.id);
    if (preset.unit === 'chars' || preset.unit === 'graphemes' || preset.unit === 'x-weighted') {
      setLimitUnit('graphemes');
    } else if (preset.unit === 'bytes') {
      setLimitUnit('bytes');
    }
  };

  return (
    <div className={styles.container}>
      <TabSlider
        tabs={TABS}
        activeId={tab}
        onChange={handleTabChange}
        ariaLabel="Character counter workspaces"
      />

      {/* Input Guide Diagram */}
      <CharacterInputGuide
        focusedField={focusedField}
        activeTab={tab}
        userText={text}
        limit={limit}
      />

      {/* TAB 1: COUNT */}
      {tab === 'count' && (
        <div className={styles.tabContent}>
          <TextInputPanel
            value={liveText}
            onChange={setText}
            label="1. Enter or paste text to count"
            onFocus={() => setFocusedField('characters')}
            onBlur={() => setFocusedField(null)}
          />

          {/* Counting Options */}
          <div className={styles.optionsBar}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={ignorePunctuation}
                onChange={(e) => setIgnorePunctuation(e.target.checked)}
              />
              <span>Ignore punctuation</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={ignoreDigits}
                onChange={(e) => setIgnoreDigits(e.target.checked)}
              />
              <span>Ignore digits (0–9)</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={nfcNormalization}
                onChange={(e) => setNfcNormalization(e.target.checked)}
              />
              <span>Unicode NFC normalization</span>
            </label>
          </div>

          <div className={styles.summaryBar}>
            <p className={styles.summaryText}>{summarySentence}</p>
            <button
              type="button"
              className={styles.copySummaryBtn}
              onClick={handleCopySentence}
            >
              {copiedSentence ? '✓ Copied' : '📋 Copy Summary'}
            </button>
          </div>

          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>Key Character Metrics</div>
          </div>

          <StatTiles stats={headlineStats} columns={4} />

          <div className={styles.sectionHeader} style={{ marginTop: '16px' }}>
            <div className={styles.subsectionTitle}>Structural &amp; Encoding Breakdown</div>
          </div>

          <StatTiles stats={secondaryStats} columns={3} />
        </div>
      )}

      {/* TAB 2: LIMIT */}
      {tab === 'limit' && (
        <div className={styles.tabContent}>
          {/* Limit Bar Configuration */}
          <div className={styles.limitControlCard}>
            <div className={styles.limitSettingsRow}>
              <div className={styles.field}>
                <label htmlFor={`${id}-limit-input`} className={styles.fieldLabel}>
                  Character Limit
                </label>
                <div className={styles.inputWithControls}>
                  <input
                    id={`${id}-limit-input`}
                    type="number"
                    min="1"
                    max="1000000"
                    className={styles.limitNumberInput}
                    value={limit}
                    onChange={(e) => {
                      setLimit(Math.max(1, parseInt(e.target.value, 10) || 1));
                      setSelectedPresetId('custom');
                    }}
                  />
                  <select
                    className={styles.unitSelect}
                    value={limitUnit}
                    onChange={(e) => setLimitUnit(e.target.value as LimitUnit)}
                    aria-label="Count limit unit"
                  >
                    <option value="graphemes">Characters</option>
                    <option value="noSpaces">Chars (no spaces)</option>
                    <option value="words">Words</option>
                    <option value="bytes">UTF-8 Bytes</option>
                  </select>
                </div>
              </div>

              {/* Live Remaining Badge */}
              <div
                className={`${styles.remainingBadge} ${
                  isOverLimit ? styles.badgeOver : styles.badgeUnder
                }`}
              >
                <div className={styles.remainingVal}>
                  {isOverLimit ? `+${Math.abs(remaining).toLocaleString('en-US')}` : remaining.toLocaleString('en-US')}
                </div>
                <div className={styles.remainingLabel}>
                  {unitLabel} {isOverLimit ? 'over limit' : 'left'}
                </div>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className={styles.progressBarWrapper}>
              <div
                className={`${styles.progressBarFill} ${
                  isOverLimit ? styles.progressOver : ''
                }`}
                style={{ width: `${percentUsed}%` }}
              />
            </div>
            <div className={styles.progressLabels}>
              <span>{currentCountForLimit.toLocaleString('en-US')} counted</span>
              <span>{limit.toLocaleString('en-US')} max ({percentUsed}%)</span>
            </div>

            {/* Quick Limit Presets */}
            <div className={styles.presetsBlock}>
              <span className={styles.presetsLabel}>Common Lengths:</span>
              <div className={styles.presetButtons}>
                {LIMIT_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`${styles.presetBtn} ${limit === p ? styles.activePreset : ''}`}
                    onClick={() => {
                      setLimit(p);
                      setSelectedPresetId('custom');
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Limit Counting Options */}
            <div className={styles.optionsBar} style={{ marginTop: '8px' }}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={ignorePunctuation}
                  onChange={(e) => setIgnorePunctuation(e.target.checked)}
                />
                <span>Ignore punctuation</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={ignoreDigits}
                  onChange={(e) => setIgnoreDigits(e.target.checked)}
                />
                <span>Ignore digits (0–9)</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={nfcNormalization}
                  onChange={(e) => setNfcNormalization(e.target.checked)}
                />
                <span>Unicode NFC</span>
              </label>
            </div>

            {/* Platform Presets */}
            <div className={styles.presetsBlock}>
              <span className={styles.presetsLabel}>Social Platforms:</span>
              <div className={styles.presetButtons}>
                {TEXT_LIMIT_PRESETS.filter((p) => p.verified && p.unit !== 'x-weighted').map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={`${styles.presetBtn} ${
                      selectedPresetId === preset.id ? styles.activePreset : ''
                    }`}
                    onClick={() => handlePlatformPreset(preset)}
                    title={`${preset.platform} - ${preset.field} (${preset.limit} ${preset.unit})`}
                  >
                    {preset.platform} {preset.field} ({preset.limit.toLocaleString('en-US')})
                  </button>
                ))}
              </div>
            </div>
          </div>

          <TextInputPanel
            value={liveText}
            onChange={setText}
            label="Your text with live limit monitoring"
            placeholder="Type or paste to monitor remaining character buffer..."
          />
          <OverflowPreview text={text} start={overflowStart} />
        </div>
      )}

      {/* TAB 3: DETAILS */}
      {tab === 'details' && (
        <div className={styles.tabContent}>
          <TextInputPanel
            value={liveText}
            onChange={setText}
            label="Text to inspect in detail"
            rows={5}
          />

          {/* CJK Configuration Toggle */}
          <div className={styles.optionsBar}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={cjkPerChar}
                onChange={(e) => setCjkPerChar(e.target.checked)}
              />
              <span>Count each Chinese / Japanese / Korean character as 1 word</span>
            </label>
          </div>

          {/* Encodings Comparison Grid */}
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>Unicode Length by Encoding Model</div>
          </div>
          <div className={styles.encodingGrid}>
            <div className={styles.encodingCard}>
              <div className={styles.encHeader}>Grapheme Clusters</div>
              <div className={styles.encValue}>{analysis.characters.toLocaleString('en-US')}</div>
              <div className={styles.encDesc}>User-perceived characters. Each emoji and diacritic counts as 1.</div>
            </div>
            <div className={styles.encodingCard}>
              <div className={styles.encHeader}>Unicode Code Points</div>
              <div className={styles.encValue}>{analysis.codePoints.toLocaleString('en-US')}</div>
              <div className={styles.encDesc}>Individual Unicode scalar values. Accents and ZWJ parts are separated.</div>
            </div>
            <div className={styles.encodingCard}>
              <div className={styles.encHeader}>UTF-16 Units</div>
              <div className={styles.encValue}>{analysis.utf16Units.toLocaleString('en-US')}</div>
              <div className={styles.encDesc}>JavaScript native string.length. Emojis and rare symbols use 2 units.</div>
            </div>
            <div className={styles.encodingCard}>
              <div className={styles.encHeader}>UTF-8 Bytes</div>
              <div className={styles.encValue}>{analysis.utf8Bytes.toLocaleString('en-US')}</div>
              <div className={styles.encDesc}>Storage size in databases and JSON payloads (1 to 4 bytes per symbol).</div>
            </div>
          </div>

          {/* Character Frequency Table */}
          <div className={styles.sectionHeader} style={{ marginTop: '24px' }}>
            <div className={styles.headerWithAction}>
              <div className={styles.sectionTitle}>Top 20 Character Frequencies</div>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={caseSensitiveFreq}
                  onChange={(e) => setCaseSensitiveFreq(e.target.checked)}
                />
                <span>Case-sensitive</span>
              </label>
            </div>
          </div>

          {characterFrequencies.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Character</th>
                    <th>Occurrences</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {characterFrequencies.map((f, i) => (
                    <tr key={i}>
                      <td className={styles.charCell}>
                        <code>{f.char}</code>
                      </td>
                      <td>{f.count.toLocaleString('en-US')}</td>
                      <td>{f.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={styles.emptyNote}>Enter text above to inspect character frequency.</p>
          )}

          {/* Per-Paragraph Breakdown */}
          {paragraphLengths.length > 1 && (
            <div style={{ marginTop: '24px' }}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitle}>Per-Paragraph Character Breakdown</div>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Paragraph</th>
                      <th>Snippet</th>
                      <th>Characters</th>
                      <th>Words</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paragraphLengths.map((p) => (
                      <tr key={p.index}>
                        <td>#{p.index}</td>
                        <td className={styles.snippetCell}>{p.snippet}</td>
                        <td>{p.characters.toLocaleString('en-US')}</td>
                        <td>{p.words.toLocaleString('en-US')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
