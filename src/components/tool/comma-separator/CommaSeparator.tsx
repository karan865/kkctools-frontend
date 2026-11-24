'use client';

import React, { useState, useMemo } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import { useTabParam } from '@/components/tool/text/useTabParam';
import {
  splitLines,
  cleanList,
  joinList,
  parseDelimited,
  detectDelimiter,
  toSqlPreset,
  toJsonPreset,
  toPythonPreset,
  toJsPreset,
  toExcelPreset,
  toMarkdownPreset,
  DedupeOption,
  SortOption,
  CaseOption,
  QuoteOption,
  WrapOption,
} from '@/lib/list-engine';
import CommaSeparatorInputGuide from './CommaSeparatorInputGuide';
import styles from './CommaSeparator.module.css';

type ActiveTab = 'linesToList' | 'listToLines' | 'presets';

const TABS: TabItem<ActiveTab>[] = [
  { id: 'linesToList', label: '1. Column → List' },
  { id: 'listToLines', label: '2. List → Column (Reverse)' },
  { id: 'presets', label: '3. Developer Presets (SQL, JSON, Python)' },
];
const TAB_IDS = TABS.map((t) => t.id);

const SAMPLE_COLUMN = `apple
Smith, John
say "hi"

apple
banana`;

const SAMPLE_DELIMITED = `apple, "Smith, John", "say ""hi""", pear`;

export default function CommaSeparator() {
  const [activeTab, setActiveTab] = useTabParam<ActiveTab>(TAB_IDS, 'linesToList');

  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Core Inputs
  const [inputText, setInputText] = useState<string>(SAMPLE_COLUMN);
  const [reverseInputText, setReverseInputText] = useState<string>(SAMPLE_DELIMITED);

  // Options
  const [delimiter, setDelimiter] = useState<string>(', ');
  const [customDelimiter, setCustomDelimiter] = useState<string>('');
  const [quoteOption, setQuoteOption] = useState<QuoteOption>('auto');
  const [customPrefix, setCustomPrefix] = useState<string>('');
  const [customSuffix, setCustomSuffix] = useState<string>('');
  const [wrapOption, setWrapOption] = useState<WrapOption>('none');
  const [customWrapPrefix, setCustomWrapPrefix] = useState<string>('');
  const [customWrapSuffix, setCustomWrapSuffix] = useState<string>('');

  // Clean Options
  const [trim, setTrim] = useState<boolean>(true);
  const [removeEmpty, setRemoveEmpty] = useState<boolean>(true);
  const [dedupe, setDedupe] = useState<DedupeOption>('off');
  const [sort, setSort] = useState<SortOption>('none');
  const [caseStyle, setCaseStyle] = useState<CaseOption>('none');
  const [itemsPerLine, setItemsPerLine] = useState<number>(0);

  // Reverse Options
  const [reverseDelimiter, setReverseDelimiter] = useState<string>('auto');

  // Copy Feedback
  const [copied, setCopied] = useState<boolean>(false);

  // Effective Delimiter
  const effectiveDelimiter = delimiter === 'custom' ? customDelimiter : delimiter;

  // Split lines
  const rawLines = useMemo(() => splitLines(inputText), [inputText]);

  // Clean list
  const cleanedResult = useMemo(() => {
    return cleanList(rawLines, {
      trim,
      removeEmpty,
      dedupe,
      sort,
      caseStyle,
    });
  }, [rawLines, trim, removeEmpty, dedupe, sort, caseStyle]);

  // Formatted list output
  const listOutput = useMemo(() => {
    return joinList(cleanedResult.items, {
      delimiter: effectiveDelimiter,
      quote: quoteOption,
      customPrefix,
      customSuffix,
      wrap: wrapOption,
      customWrapPrefix,
      customWrapSuffix,
      itemsPerLine,
    });
  }, [
    cleanedResult.items,
    effectiveDelimiter,
    quoteOption,
    customPrefix,
    customSuffix,
    wrapOption,
    customWrapPrefix,
    customWrapSuffix,
    itemsPerLine,
  ]);

  // Warning if values contain delimiter and quote is none
  const hasDelimiterConflict = useMemo(() => {
    if (quoteOption !== 'none' || !effectiveDelimiter) return false;
    return cleanedResult.items.some((it) => it.includes(effectiveDelimiter.trim() || effectiveDelimiter));
  }, [quoteOption, effectiveDelimiter, cleanedResult.items]);

  // Reverse Output (List to Column)
  const reverseItems = useMemo(() => {
    const delim =
      reverseDelimiter === 'auto' ? detectDelimiter(reverseInputText) : reverseDelimiter;
    return parseDelimited(reverseInputText, delim).map((v) => v.trim());
  }, [reverseInputText, reverseDelimiter]);
  const reverseOutput = reverseItems.join('\n');

  // Presets Output
  const [activePreset, setActivePreset] = useState<
    'sql' | 'json' | 'python' | 'js' | 'excel' | 'markdown'
  >('sql');

  const presetOutput = useMemo(() => {
    const items = cleanedResult.items;
    switch (activePreset) {
      case 'sql':
        return toSqlPreset(items);
      case 'json':
        return toJsonPreset(items);
      case 'python':
        return toPythonPreset(items);
      case 'js':
        return toJsPreset(items);
      case 'excel':
        return toExcelPreset(items);
      case 'markdown':
        return toMarkdownPreset(items);
      default:
        return toSqlPreset(items);
    }
  }, [cleanedResult.items, activePreset]);

  // Copy handler
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Download locally generated file
  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      {/* Visual Guide Header */}
      <CommaSeparatorInputGuide
        focusedField={focusedField}
        activeTab={activeTab}
        firstItems={cleanedResult.items.slice(0, 4)}
        delimiterLabel={delimiter === 'custom' ? customDelimiter || 'custom' : delimiter}
      />

      {/* Tabs */}
      <TabSlider tabs={TABS} activeId={activeTab} onChange={setActiveTab} ariaLabel="Comma separator modes" />

      <div className={styles.actionRow} style={{ justifyContent: 'flex-end' }}>
        <button
          className={styles.btnSecondary}
          onClick={() => {
            const copyContent =
              activeTab === 'linesToList'
                ? listOutput
                : activeTab === 'listToLines'
                ? reverseOutput
                : presetOutput;
            handleCopy(copyContent);
          }}
        >
          {copied ? '✓ Copied' : '📋 Copy Output'}
        </button>
      </div>

      {/* Tab 1: Column to List */}
      {activeTab === 'linesToList' && (
        <div className={styles.card}>
          <div className={styles.field}>
            <label htmlFor="column-input-area" className={styles.label}>
              1. Enter or Paste Column (One Item Per Line)
            </label>
            <textarea
              id="column-input-area"
              rows={6}
              value={inputText}
              onFocus={() => setFocusedField('input')}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setInputText(e.target.value)}
              className={styles.textarea}
              placeholder="Paste rows or vertical column here..."
            />
            <p className={styles.privacy}>🔒 Your text stays in this browser. Nothing is uploaded or stored.</p>
          </div>

          {/* Options Grid */}
          <div className={styles.gridCols4} style={{ marginTop: '12px' }}>
            <div className={styles.field}>
              <label className={styles.label}>Delimiter</label>
              <select
                value={delimiter}
                onFocus={() => setFocusedField('delim')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setDelimiter(e.target.value)}
                className={styles.select}
              >
                <option value=", ">Comma + Space (, )</option>
                <option value=",">Comma only (,)</option>
                <option value="; ">Semicolon (; )</option>
                <option value="|">Pipe (|)</option>
                <option value="&#9;">Tab</option>
                <option value=" ">Space</option>
                <option value={'\n'}>New line</option>
                <option value="custom">Custom Delimiter...</option>
              </select>
              {delimiter === 'custom' && (
                <input
                  type="text"
                  placeholder="Custom delimiter"
                  value={customDelimiter}
                  onChange={(e) => setCustomDelimiter(e.target.value)}
                  className={styles.input}
                  style={{ marginTop: '4px' }}
                />
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Quote Items</label>
              <select
                value={quoteOption}
                onFocus={() => setFocusedField('quote')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setQuoteOption(e.target.value as QuoteOption)}
                className={styles.select}
              >
                <option value="auto">Auto (RFC 4180 CSV)</option>
                <option value="none">None</option>
                <option value="double">Double quotes (&quot;)</option>
                <option value="single">Single quotes (&apos;)</option>
                <option value="backtick">Backticks (`) </option>
                <option value="custom">Custom Prefix / Suffix</option>
              </select>
              {quoteOption === 'custom' && (
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  <input
                    type="text"
                    placeholder="Prefix"
                    value={customPrefix}
                    onChange={(e) => setCustomPrefix(e.target.value)}
                    className={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Suffix"
                    value={customSuffix}
                    onChange={(e) => setCustomSuffix(e.target.value)}
                    className={styles.input}
                  />
                </div>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Wrap Result</label>
              <select
                value={wrapOption}
                onChange={(e) => setWrapOption(e.target.value as WrapOption)}
                className={styles.select}
              >
                <option value="none">None</option>
                <option value="parens">Parentheses ( ... )</option>
                <option value="brackets">Brackets [ ... ]</option>
                <option value="braces">Braces {'{ ... }'}</option>
                <option value="custom">Custom Wrap</option>
              </select>
              {wrapOption === 'custom' && (
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  <input
                    type="text"
                    aria-label="Wrap start"
                    placeholder="Start"
                    value={customWrapPrefix}
                    onChange={(e) => setCustomWrapPrefix(e.target.value)}
                    className={styles.input}
                  />
                  <input
                    type="text"
                    aria-label="Wrap end"
                    placeholder="End"
                    value={customWrapSuffix}
                    onChange={(e) => setCustomWrapSuffix(e.target.value)}
                    className={styles.input}
                  />
                </div>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Items Per Line</label>
              <select
                value={itemsPerLine}
                onChange={(e) => setItemsPerLine(parseInt(e.target.value, 10) || 0)}
                className={styles.select}
              >
                <option value={0}>All on one line</option>
                <option value={2}>2 items per line</option>
                <option value={5}>5 items per line</option>
                <option value={10}>10 items per line</option>
                <option value={25}>25 items per line</option>
              </select>
            </div>
          </div>

          {/* Clean Options & Sorting */}
          <div className={styles.checkboxRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={trim}
                onChange={(e) => setTrim(e.target.checked)}
              />
              Trim whitespace
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={removeEmpty}
                onChange={(e) => setRemoveEmpty(e.target.checked)}
              />
              Remove empty lines
            </label>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span className={styles.label} style={{ fontSize: '0.75rem', margin: 0 }}>
                Dedupe:
              </span>
              <select
                value={dedupe}
                onChange={(e) => setDedupe(e.target.value as DedupeOption)}
                className={styles.select}
                style={{ padding: '3px 8px', fontSize: '0.75rem' }}
              >
                <option value="off">Off</option>
                <option value="cs">Case-sensitive</option>
                <option value="ci">Case-insensitive</option>
              </select>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span className={styles.label} style={{ fontSize: '0.75rem', margin: 0 }}>
                Sort:
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className={styles.select}
                style={{ padding: '3px 8px', fontSize: '0.75rem' }}
              >
                <option value="none">None (Original)</option>
                <option value="asc">A → Z</option>
                <option value="desc">Z → A</option>
                <option value="natural">Natural (1, 2, 10)</option>
                <option value="numeric">Numeric</option>
              </select>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span className={styles.label} style={{ fontSize: '0.75rem', margin: 0 }}>
                Case:
              </span>
              <select
                value={caseStyle}
                onChange={(e) => setCaseStyle(e.target.value as CaseOption)}
                className={styles.select}
                style={{ padding: '3px 8px', fontSize: '0.75rem' }}
              >
                <option value="none">Keep original</option>
                <option value="lower">lowercase</option>
                <option value="upper">UPPERCASE</option>
              </select>
            </div>
          </div>

          {/* Conflict Warning */}
          {hasDelimiterConflict && (
            <div className={styles.warningChip} style={{ marginTop: '12px' }}>
              ⚠️ Some items contain the delimiter &quot;{effectiveDelimiter.trim()}&quot; without quoting! Consider turning on &quot;Auto (RFC 4180 CSV)&quot; quoting.
            </div>
          )}

          {/* Result Output */}
          <div style={{ marginTop: '16px' }}>
            <div className={styles.countsBanner}>
              <span>
                <strong>{rawLines.length}</strong> lines in →{' '}
                <strong>{cleanedResult.items.length}</strong> items out
                {cleanedResult.emptyRemoved > 0 && ` • ${cleanedResult.emptyRemoved} empty removed`}
                {cleanedResult.duplicatesRemoved > 0 && ` • ${cleanedResult.duplicatesRemoved} duplicate(s) removed`}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => handleDownload(listOutput, 'comma-delimited-list.txt')}
                >
                  📥 Download .txt
                </button>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => handleDownload(joinList(cleanedResult.items, { delimiter: ',' }), 'list.csv')}
                >
                  📥 Download .csv
                </button>
              </div>
            </div>

            <div className={styles.resultBox} style={{ marginTop: '8px' }}>
              {listOutput || '(Empty list)'}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: List to Column (Reverse) */}
      {activeTab === 'listToLines' && (
        <div className={styles.card}>
          <div className={styles.field}>
            <label htmlFor="reverse-input-area" className={styles.label}>
              Paste Delimited Text (CSV, Semicolon, Tab, Pipe)
            </label>
            <textarea
              id="reverse-input-area"
              rows={5}
              value={reverseInputText}
              onChange={(e) => setReverseInputText(e.target.value)}
              className={styles.textarea}
              placeholder="e.g. apple, &quot;Smith, John&quot;, &quot;say &quot;&quot;hi&quot;&quot;&quot;, pear"
            />
            <p className={styles.privacy}>🔒 Your text stays in this browser. Nothing is uploaded or stored.</p>
          </div>

          <div className={styles.gridCols2} style={{ marginTop: '10px' }}>
            <div className={styles.field}>
              <label className={styles.label}>Input Delimiter</label>
              <select
                value={reverseDelimiter}
                onChange={(e) => setReverseDelimiter(e.target.value)}
                className={styles.select}
              >
                <option value="auto">Auto-detect (Comma, Semicolon, Tab, Pipe)</option>
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="&#9;">Tab</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <div className={styles.countsBanner}>
              <span>
                <strong>{reverseItems.length}</strong> items found (RFC 4180 rules)
              </span>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => handleDownload(reverseOutput, 'column-lines.txt')}
              >
                📥 Download Lines .txt
              </button>
            </div>

            <div className={styles.resultBox} style={{ marginTop: '8px' }}>
              {reverseOutput}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Presets */}
      {activeTab === 'presets' && (
        <div className={styles.card}>
          <div className={styles.field} style={{ marginBottom: '14px' }}>
            <label htmlFor="preset-input-area" className={styles.label}>
              Your column (one item per line)
            </label>
            <textarea
              id="preset-input-area"
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className={styles.textarea}
            />
            <p className={styles.privacy}>🔒 Your text stays in this browser. Nothing is uploaded or stored.</p>
          </div>
          <span className={styles.label}>Select Output Code Preset</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
            <button
              type="button"
              className={`${styles.pillBtn} ${activePreset === 'sql' ? styles.pillBtnActive : ''}`}
              onClick={() => setActivePreset('sql')}
            >
              SQL IN (...)
            </button>
            <button
              type="button"
              className={`${styles.pillBtn} ${activePreset === 'json' ? styles.pillBtnActive : ''}`}
              onClick={() => setActivePreset('json')}
            >
              JSON Array
            </button>
            <button
              type="button"
              className={`${styles.pillBtn} ${activePreset === 'python' ? styles.pillBtnActive : ''}`}
              onClick={() => setActivePreset('python')}
            >
              Python List
            </button>
            <button
              type="button"
              className={`${styles.pillBtn} ${activePreset === 'js' ? styles.pillBtnActive : ''}`}
              onClick={() => setActivePreset('js')}
            >
              JavaScript Array
            </button>
            <button
              type="button"
              className={`${styles.pillBtn} ${activePreset === 'excel' ? styles.pillBtnActive : ''}`}
              onClick={() => setActivePreset('excel')}
            >
              Excel Constant {'{"a","b"}'}
            </button>
            <button
              type="button"
              className={`${styles.pillBtn} ${activePreset === 'markdown' ? styles.pillBtnActive : ''}`}
              onClick={() => setActivePreset('markdown')}
            >
              Markdown List
            </button>
          </div>

          <div style={{ marginTop: '16px' }}>
            <div className={styles.countsBanner}>
              <span>
                Formatted <strong>{cleanedResult.items.length}</strong> items for <strong>{activePreset.toUpperCase()}</strong>
              </span>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => handleCopy(presetOutput)}
              >
                📋 Copy Preset Code
              </button>
            </div>

            <div className={styles.resultBox} style={{ marginTop: '8px' }}>
              {presetOutput}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
