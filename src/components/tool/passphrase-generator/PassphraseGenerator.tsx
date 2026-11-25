'use client';

import React, { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import TabSlider from '@/components/tool/shared/TabSlider';
import { useTabParam } from '@/components/tool/shared/useTabParam';
import PassphraseInputGuide from './PassphraseInputGuide';
import {
  calculatePassphraseEntropy,
  DEFAULT_PASSPHRASE_OPTIONS,
  generateBulkPassphrases,
  generatePassphrase,
  resolvePassphraseOptions,
  type CapitalMode,
  type PassphraseOptions,
  type PassphraseResult,
  type SeparatorMode,
} from '@/lib/passphrase-core';
import { ATTACK_SCENARIOS, formatGuessTime } from '@/data/attack-scenarios';
import { isAvailable, SECURE_RANDOM_UNAVAILABLE_MSG } from '@/lib/secure-random';
import styles from './PassphraseGenerator.module.css';

type TabId = 'passphrase' | 'options' | 'bulk';

const TABS: { id: TabId; label: string }[] = [
  { id: 'passphrase', label: 'Passphrase' },
  { id: 'options', label: 'Options & strength' },
  { id: 'bulk', label: 'Bulk' },
];

const SEPARATOR_LABELS: Record<SeparatorMode, string> = {
  hyphen: 'Hyphen (-)',
  space: 'Space',
  dot: 'Dot (.)',
  underscore: 'Underscore (_)',
  none: 'None',
  'random-digit': 'Random digit (0–9)',
  'random-symbol': 'Random symbol',
  custom: 'Custom',
};

const CAPITAL_LABELS: Record<CapitalMode, string> = {
  none: 'lowercase',
  'first-each': 'Title Case',
  'one-random': '1 RANDOM',
};

const emptySubscribe = () => () => {};
function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function PassphraseGenerator() {
  const [activeTab, setActiveTab] = useTabParam<TabId>(['passphrase', 'options', 'bulk'], 'passphrase');
  const [options, setOptions] = useState<PassphraseOptions>(DEFAULT_PASSPHRASE_OPTIONS);
  const [bulkCount, setBulkCount] = useState<number>(5);
  const [wordList, setWordList] = useState<readonly string[] | null>(null);
  const [listMeta, setListMeta] = useState<{
    name: string;
    size: number;
    licence: string;
    diceUrl: string;
    licenceUrl: string;
  }>({
    name: 'EFF Long Wordlist',
    size: 7776,
    licence: 'CC BY',
    diceUrl: 'https://www.eff.org/dice',
    licenceUrl: 'https://www.eff.org/copyright',
  });
  const [result, setResult] = useState<PassphraseResult | null>(null);
  const [bulkResults, setBulkResults] = useState<PassphraseResult[]>([]);
  const [hidden, setHidden] = useState<boolean>(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [scenarioRates, setScenarioRates] = useState<Record<string, number>>(() =>
    Object.fromEntries(ATTACK_SCENARIOS.map((s) => [s.id, s.guessesPerSecond]))
  );
  const [cryptoError, setCryptoError] = useState<string | null>(null);
  const mounted = useIsMounted();

  const resolved = useMemo(() => resolvePassphraseOptions(options), [options]);
  const liveBreakdown = useMemo(
    () => calculatePassphraseEntropy(options, listMeta.size),
    [options, listMeta.size]
  );

  // Lazy-load the bundled EFF wordlist client-side so SSR stays lightweight
  useEffect(() => {
    let active = true;
    import('@/data/wordlist-passphrase').then((mod) => {
      if (!active) return;
      setWordList(mod.PASSPHRASE_WORDLIST);
      setListMeta({
        name: mod.PASSPHRASE_WORDLIST_META.name,
        size: mod.PASSPHRASE_WORDLIST_META.size,
        licence: mod.PASSPHRASE_WORDLIST_META.licence,
        diceUrl: mod.PASSPHRASE_WORDLIST_META.diceUrl,
        licenceUrl: mod.PASSPHRASE_WORDLIST_META.licenceUrl,
      });
    });
    return () => {
      active = false;
    };
  }, []);

  const regenerate = useCallback(
    (nextOpts: PassphraseOptions = options, nextBulk: number = bulkCount, list = wordList) => {
      if (!list) return;
      if (!isAvailable()) {
        setCryptoError(SECURE_RANDOM_UNAVAILABLE_MSG);
        return;
      }
      setCryptoError(null);
      setResult(generatePassphrase(nextOpts, undefined, list));
      setBulkResults(generateBulkPassphrases(nextBulk, nextOpts, undefined, list));
    },
    [options, bulkCount, wordList]
  );

  useEffect(() => {
    if (!mounted || !wordList) return;
    const t = setTimeout(() => {
      regenerate(options, bulkCount, wordList);
    }, 0);
    return () => clearTimeout(t);
  }, [mounted, wordList, options, bulkCount, regenerate]);

  const updateOptions = (patch: Partial<PassphraseOptions>) => {
    setOptions((prev) => ({ ...prev, ...patch }));
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied((prev) => (prev === id ? null : prev)), 1800);
    } catch {
      // Clipboard denied
    }
  };

  const fastScenario = ATTACK_SCENARIOS.find((s) => s.id === 'offline-fast-hash')!;
  const fastRate = scenarioRates[fastScenario.id] ?? fastScenario.guessesPerSecond;
  const extrasBits =
    liveBreakdown.separatorBits +
    liveBreakdown.capitalsBits +
    liveBreakdown.numberBits +
    liveBreakdown.symbolBits;

  return (
    <div className={styles.container}>
      <TabSlider
        tabs={TABS}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as TabId)}
        ariaLabel="Passphrase generator modes"
      />

      <PassphraseInputGuide
        activeTab={activeTab}
        wordCount={resolved.effective.wordCount}
        separatorLabel={SEPARATOR_LABELS[resolved.effective.separator]}
        capitalsLabel={CAPITAL_LABELS[resolved.effective.capitals]}
        addNumber={resolved.effective.addNumber}
        addSymbol={resolved.effective.addSymbol}
        listSize={listMeta.size}
        perWordBits={liveBreakdown.perWordBits}
        totalBits={liveBreakdown.totalBits}
        wordsBits={liveBreakdown.wordsBits}
        extrasBits={extrasBits}
        bulkCount={bulkCount}
        focusedField={focusedField}
      />

      {cryptoError && <div className={styles.errorBanner}>{cryptoError}</div>}

      {activeTab === 'passphrase' && (
        <div className={styles.card}>
          <div className={styles.outputBox}>
            <div className={styles.phraseDisplay} aria-live="polite">
              {result
                ? hidden
                  ? '•'.repeat(Math.min(36, result.passphrase.length))
                  : result.passphrase
                : 'Ready to generate passphrase'}
            </div>
            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => regenerate()}
              >
                Generate passphrase
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => result && handleCopy(result.passphrase, 'main')}
                disabled={!result}
              >
                {copied === 'main' ? 'Copied' : 'Copy'}
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setHidden((h) => !h)}
              >
                {hidden ? 'Show' : 'Hide'}
              </button>
            </div>
          </div>

          <p className={styles.summaryText}>
            <strong>{resolved.effective.wordCount} random words</strong> from a{' '}
            <strong>{listMeta.size.toLocaleString('en-US')}-word</strong> list:{' '}
            <strong>{liveBreakdown.totalBits.toFixed(1)} bits</strong>. Even at 100 billion guesses a second, someone who knows the list would need about{' '}
            <strong>{formatGuessTime(liveBreakdown.totalBits, fastRate)}</strong> on average.
          </p>

          {resolved.warning && (
            <div className={styles.warningBanner}>{resolved.warning}</div>
          )}

          <div className={styles.controlsGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="pp-words" className={styles.fieldLabel}>
                Number of words (3–10)
              </label>
              <div className={styles.rangeRow}>
                <input
                  id="pp-words"
                  type="range"
                  min={3}
                  max={10}
                  value={options.wordCount}
                  onFocus={() => setFocusedField('wordCount')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => updateOptions({ wordCount: Number(e.target.value) })}
                  className={styles.rangeInput}
                />
                <input
                  type="number"
                  min={3}
                  max={10}
                  aria-label="Number of words"
                  value={options.wordCount}
                  onChange={(e) => updateOptions({ wordCount: Number(e.target.value) })}
                  className={styles.numberInput}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="pp-sep" className={styles.fieldLabel}>
                Separator
              </label>
              <select
                id="pp-sep"
                value={options.separator}
                onFocus={() => setFocusedField('separator')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => updateOptions({ separator: e.target.value as SeparatorMode })}
                className={styles.selectInput}
              >
                {(Object.keys(SEPARATOR_LABELS) as SeparatorMode[]).map((mode) => (
                  <option key={mode} value={mode}>
                    {SEPARATOR_LABELS[mode]}
                  </option>
                ))}
              </select>
            </div>

            {options.separator === 'custom' && (
              <div className={styles.fieldGroup}>
                <label htmlFor="pp-custom-sep" className={styles.fieldLabel}>
                  Custom separator (1–4 chars)
                </label>
                <input
                  id="pp-custom-sep"
                  type="text"
                  maxLength={4}
                  value={options.customSeparator ?? '-'}
                  onChange={(e) => updateOptions({ customSeparator: e.target.value })}
                  className={styles.textInput}
                />
              </div>
            )}

            <div className={styles.fieldGroup}>
              <label htmlFor="pp-cap" className={styles.fieldLabel}>
                Capitals
              </label>
              <select
                id="pp-cap"
                value={options.capitals}
                onFocus={() => setFocusedField('capitals')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => updateOptions({ capitals: e.target.value as CapitalMode })}
                className={styles.selectInput}
              >
                <option value="none">None (lowercase)</option>
                <option value="first-each">First letter of each word (+0 bits)</option>
                <option value="one-random">One random word in CAPITALS (+log₂ k)</option>
              </select>
            </div>
          </div>

          <div className={styles.checkboxList}>
            <label
              className={`${styles.checkboxLabel} ${
                options.separator === 'random-digit' ? styles.checkboxDisabled : ''
              }`}
            >
              <input
                type="checkbox"
                checked={resolved.effective.addNumber}
                disabled={options.separator === 'random-digit'}
                onChange={(e) => updateOptions({ addNumber: e.target.checked })}
              />
              <span>
                Add a number (0–99)
                {options.separator === 'random-digit' ? ' (off with digit sep)' : ''}
              </span>
            </label>

            <label
              className={`${styles.checkboxLabel} ${
                options.separator === 'random-symbol' ? styles.checkboxDisabled : ''
              }`}
            >
              <input
                type="checkbox"
                checked={resolved.effective.addSymbol}
                disabled={options.separator === 'random-symbol'}
                onChange={(e) => updateOptions({ addSymbol: e.target.checked })}
              />
              <span>
                Add a symbol
                {options.separator === 'random-symbol' ? ' (off with symbol sep)' : ''}
              </span>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={options.noRepeat}
                onChange={(e) => updateOptions({ noRepeat: e.target.checked })}
              />
              <span>No repeated words</span>
            </label>
          </div>
        </div>
      )}

      {activeTab === 'options' && (
        <div className={styles.card}>
          <table className={styles.breakdownTable}>
            <thead>
              <tr>
                <th>Entropy Source</th>
                <th>Bits Added</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {resolved.effective.wordCount} words ({listMeta.size.toLocaleString('en-US')}-word list
                  {resolved.effective.noRepeat ? ', no repeats' : ', with replacement'})
                </td>
                <td>{liveBreakdown.wordsBits.toFixed(2)} bits</td>
              </tr>
              <tr>
                <td>Separator ({SEPARATOR_LABELS[resolved.effective.separator]})</td>
                <td>{liveBreakdown.separatorBits.toFixed(2)} bits</td>
              </tr>
              <tr>
                <td>Capitals ({CAPITAL_LABELS[resolved.effective.capitals]})</td>
                <td>{liveBreakdown.capitalsBits.toFixed(2)} bits</td>
              </tr>
              <tr>
                <td>Extra number (0–99 at random gap)</td>
                <td>{liveBreakdown.numberBits.toFixed(2)} bits</td>
              </tr>
              <tr>
                <td>Extra symbol (at random gap)</td>
                <td>{liveBreakdown.symbolBits.toFixed(2)} bits</td>
              </tr>
              <tr>
                <td>
                  <strong>Total Entropy</strong>
                </td>
                <td>
                  <strong>{liveBreakdown.totalBits.toFixed(2)} bits</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <p className={styles.summaryText}>
            Note: Guess-time scenarios assume <strong>the attacker knows the word list</strong> (Kerckhoffs&apos;s principle).
          </p>

          <table className={styles.breakdownTable}>
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Guesses / sec (editable)</th>
                <th>Average Guess Time</th>
              </tr>
            </thead>
            <tbody>
              {ATTACK_SCENARIOS.map((sc) => {
                const rate = scenarioRates[sc.id] ?? sc.guessesPerSecond;
                return (
                  <tr key={sc.id}>
                    <td>
                      <strong>{sc.label}</strong>
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0.001}
                        step="any"
                        aria-label={`${sc.label} rate`}
                        value={rate}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (Number.isFinite(v) && v > 0) {
                            setScenarioRates((prev) => ({ ...prev, [sc.id]: v }));
                          }
                        }}
                        className={styles.rateInput}
                      />
                    </td>
                    <td>{formatGuessTime(liveBreakdown.totalBits, rate)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'bulk' && (
        <div className={styles.card}>
          <div className={styles.actionRow}>
            <label htmlFor="pp-bulk" className={styles.fieldLabel}>
              Count (1–20):
            </label>
            <input
              id="pp-bulk"
              type="number"
              min={1}
              max={20}
              value={bulkCount}
              onChange={(e) => setBulkCount(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
              className={styles.numberInput}
            />
            <button type="button" className={styles.primaryBtn} onClick={() => regenerate()}>
              Generate {bulkCount}
            </button>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() =>
                handleCopy(bulkResults.map((r) => r.passphrase).join('\n'), 'bulk-all')
              }
              disabled={bulkResults.length === 0}
            >
              {copied === 'bulk-all' ? 'Copied all' : 'Copy all'}
            </button>
          </div>

          <div className={styles.bulkList}>
            {bulkResults.map((item, idx) => (
              <div key={idx} className={styles.bulkItem}>
                <span>{item.passphrase}</span>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => handleCopy(item.passphrase, `bulk-${idx}`)}
                >
                  {copied === `bulk-${idx}` ? 'Copied' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.metaBar}>
        <span>
          Word list:{' '}
          <a href={listMeta.diceUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
            {listMeta.name}
          </a>{' '}
          ({listMeta.size.toLocaleString('en-US')} words,{' '}
          <a href={listMeta.licenceUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
            {listMeta.licence}
          </a>
          ). Made in your browser with Web Crypto. Nothing is saved or sent.
        </span>
        <div className={styles.linkRow}>
          <Link href="/password-generator/" className={styles.link}>
            Need characters instead? Password Generator
          </Link>
          <Link href="/password-strength-checker/" className={styles.link}>
            Test a passphrase
          </Link>
        </div>
      </div>
    </div>
  );
}
