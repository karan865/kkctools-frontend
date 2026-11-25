'use client';

import React, { useState, useEffect, useMemo, useId, useSyncExternalStore } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import { useTabParam } from '@/components/tool/shared/useTabParam';
import { isAvailable } from '@/lib/secure-random';
import {
  DEFAULT_PASSWORD_OPTIONS,
  DEFAULT_SYMBOL_CHARS,
  MAX_BULK_COUNT,
  MAX_PASSWORD_LENGTH,
  MAX_PIN_LENGTH,
  MAX_WIFI_LENGTH,
  MIN_BULK_COUNT,
  MIN_PASSWORD_LENGTH,
  MIN_PIN_LENGTH,
  MIN_WIFI_LENGTH,
  PasswordOptions,
  PasswordPresetId,
  PasswordResult,
  entropyBits,
  generateBulkPasswords,
  generatePassword,
  generatePin,
  generateWifiPassword,
  getPresetOptions,
  resolvePasswordPool,
} from '@/lib/password-engine';
import { ATTACK_SCENARIOS, formatGuessTime } from '@/data/attack-scenarios';
import PasswordInputGuide from './PasswordInputGuide';
import styles from './PasswordGenerator.module.css';

type TabId = 'password' | 'pin' | 'wifi' | 'bulk';

const TABS: TabItem<TabId>[] = [
  { id: 'password', label: '1. Password' },
  { id: 'pin', label: '2. PIN' },
  { id: 'wifi', label: '3. Wi-Fi' },
  { id: 'bulk', label: '4. Bulk (1–50)' },
];

const TAB_IDS: TabId[] = ['password', 'pin', 'wifi', 'bulk'];
const emptySubscribe = () => () => {};

function parseBoundedInt(raw: string, min: number, max: number): number | null {
  const cleaned = raw.replace(/,/g, '').trim();
  if (!cleaned || !/^-?\d+$/.test(cleaned)) return null;
  const n = Number(cleaned);
  if (!Number.isSafeInteger(n) || n < min || n > max) return null;
  return n;
}

function getEntropyRating(bits: number): { label: string; color: string; pct: number } {
  if (bits < 36) return { label: 'Very Weak', color: 'var(--danger)', pct: 20 };
  if (bits < 60) return { label: 'Weak', color: '#D97706', pct: 42 };
  if (bits < 80) return { label: 'Moderate', color: '#0369A1', pct: 66 };
  if (bits < 100) return { label: 'Strong', color: 'var(--cat-developer)', pct: 84 };
  return { label: 'Very Strong', color: 'var(--success)', pct: 100 };
}

export default function PasswordGenerator() {
  const uid = useId();
  const [tab, setTab] = useTabParam<TabId>(TAB_IDS, 'password');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Password & Bulk options
  const [lengthInput, setLengthInput] = useState<string>('16');
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [customSymbols, setCustomSymbols] = useState(DEFAULT_SYMBOL_CHARS);
  const [excludeLookAlikes, setExcludeLookAlikes] = useState(false);
  const [requireEach, setRequireEach] = useState(true);
  const [hexOnly, setHexOnly] = useState(false);

  // PIN options
  const [pinLengthInput, setPinLengthInput] = useState<string>('6');

  // Wi-Fi options
  const [wifiLengthInput, setWifiLengthInput] = useState<string>('20');
  const [wifiSymbols, setWifiSymbols] = useState(false);
  const [wifiExcludeLookAlikes, setWifiExcludeLookAlikes] = useState(true);

  // Bulk options
  const [bulkCountInput, setBulkCountInput] = useState<string>('10');

  // Secret display state (never initialized with real secret in SSR HTML)
  const [hidden, setHidden] = useState(false);
  const [singleResult, setSingleResult] = useState<PasswordResult | null>(null);
  const [bulkResults, setBulkResults] = useState<PasswordResult[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [regenTick, setRegenTick] = useState(0);

  // Editable attack rates
  const [rates, setRates] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const s of ATTACK_SCENARIOS) init[s.id] = s.guessesPerSecond;
    return init;
  });

  // Read non-secret options from URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const qLen = params.get('length');
      if (qLen && parseBoundedInt(qLen, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH) !== null) {
        setLengthInput(qLen.trim());
      }
      if (params.get('upper') === '0') setUpper(false);
      if (params.get('lower') === '0') setLower(false);
      if (params.get('digits') === '0') setDigits(false);
      if (params.get('symbols') === '0') setSymbols(false);
      if (params.get('lookalikes') === '1') setExcludeLookAlikes(true);
      if (params.get('each') === '0') setRequireEach(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const validLength = useMemo(
    () => parseBoundedInt(lengthInput, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH),
    [lengthInput]
  );
  const validPinLength = useMemo(
    () => parseBoundedInt(pinLengthInput, MIN_PIN_LENGTH, MAX_PIN_LENGTH),
    [pinLengthInput]
  );
  const validWifiLength = useMemo(
    () => parseBoundedInt(wifiLengthInput, MIN_WIFI_LENGTH, MAX_WIFI_LENGTH),
    [wifiLengthInput]
  );
  const validBulkCount = useMemo(
    () => parseBoundedInt(bulkCountInput, MIN_BULK_COUNT, MAX_BULK_COUNT),
    [bulkCountInput]
  );

  const currentPasswordOpts: PasswordOptions | null = useMemo(() => {
    if (tab === 'pin') {
      if (validPinLength === null) return null;
      return {
        length: validPinLength,
        upper: false,
        lower: false,
        digits: true,
        symbols: false,
        excludeLookAlikes: false,
        requireEach: false,
      };
    }
    if (tab === 'wifi') {
      if (validWifiLength === null) return null;
      return {
        length: validWifiLength,
        upper: true,
        lower: true,
        digits: true,
        symbols: wifiSymbols,
        customSymbols: DEFAULT_SYMBOL_CHARS,
        excludeLookAlikes: wifiExcludeLookAlikes,
        requireEach: true,
      };
    }
    if (validLength === null) return null;
    return {
      length: validLength,
      upper,
      lower,
      digits,
      symbols,
      customSymbols,
      excludeLookAlikes,
      requireEach,
      hexOnly,
    };
  }, [
    tab,
    validPinLength,
    validWifiLength,
    validLength,
    wifiSymbols,
    wifiExcludeLookAlikes,
    upper,
    lower,
    digits,
    symbols,
    customSymbols,
    excludeLookAlikes,
    requireEach,
    hexOnly,
  ]);

  // Compute entropy & pool preview safely
  const previewMetrics = useMemo(() => {
    if (!currentPasswordOpts) {
      return { poolSize: 0, bits: 0, error: null as string | null };
    }
    try {
      const resolved = resolvePasswordPool(currentPasswordOpts);
      const bits = entropyBits(currentPasswordOpts);
      return { poolSize: resolved.pool.length, bits, error: null as string | null };
    } catch (err) {
      return {
        poolSize: 0,
        bits: 0,
        error: err instanceof Error ? err.message : 'Invalid password options.',
      };
    }
  }, [currentPasswordOpts]);

  // Generate client-side after mount whenever options or regenTick change
  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => {
      if (!isAvailable()) {
        setErrorMsg("Your browser can't generate secure random values");
        setSingleResult(null);
        setBulkResults([]);
        return;
      }

      if (tab === 'pin') {
        if (validPinLength === null) {
          setErrorMsg(`Enter a whole PIN length between ${MIN_PIN_LENGTH} and ${MAX_PIN_LENGTH}.`);
          setSingleResult(null);
          return;
        }
        try {
          setErrorMsg(null);
          setSingleResult(generatePin(validPinLength));
        } catch (err) {
          setErrorMsg(err instanceof Error ? err.message : 'Failed to generate PIN.');
          setSingleResult(null);
        }
        return;
      }

      if (tab === 'wifi') {
        if (validWifiLength === null) {
          setErrorMsg(`Enter a whole Wi-Fi length between ${MIN_WIFI_LENGTH} and ${MAX_WIFI_LENGTH}.`);
          setSingleResult(null);
          return;
        }
        try {
          setErrorMsg(null);
          setSingleResult(generateWifiPassword(validWifiLength, wifiSymbols, wifiExcludeLookAlikes));
        } catch (err) {
          setErrorMsg(err instanceof Error ? err.message : 'Failed to generate Wi-Fi password.');
          setSingleResult(null);
        }
        return;
      }

      if (!currentPasswordOpts || validLength === null) {
        setErrorMsg(`Enter a whole password length between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH}.`);
        setSingleResult(null);
        setBulkResults([]);
        return;
      }

      if (tab === 'bulk') {
        if (validBulkCount === null) {
          setErrorMsg(`Enter a bulk count between ${MIN_BULK_COUNT} and ${MAX_BULK_COUNT}.`);
          setBulkResults([]);
          return;
        }
        try {
          setErrorMsg(null);
          setBulkResults(generateBulkPasswords(currentPasswordOpts, validBulkCount));
        } catch (err) {
          setErrorMsg(err instanceof Error ? err.message : 'Failed to generate passwords.');
          setBulkResults([]);
        }
        return;
      }

      try {
        setErrorMsg(null);
        setSingleResult(generatePassword(currentPasswordOpts));
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Failed to generate password.');
        setSingleResult(null);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [
    mounted,
    tab,
    validPinLength,
    validWifiLength,
    wifiSymbols,
    wifiExcludeLookAlikes,
    validLength,
    validBulkCount,
    currentPasswordOpts,
    regenTick,
  ]);

  const applyPreset = (preset: PasswordPresetId) => {
    const opts = getPresetOptions(preset);
    setHexOnly(Boolean(opts.hexOnly));
    setUpper(opts.upper);
    setLower(opts.lower);
    setDigits(opts.digits);
    setSymbols(opts.symbols);
    setCustomSymbols(opts.customSymbols ?? DEFAULT_SYMBOL_CHARS);
    setExcludeLookAlikes(opts.excludeLookAlikes);
    setRequireEach(opts.requireEach);
    if (preset === 'pin') {
      setTab('pin');
      setPinLengthInput(String(opts.length));
    } else if (preset === 'wifi') {
      setTab('wifi');
      setWifiLengthInput(String(opts.length));
      setWifiSymbols(false);
      setWifiExcludeLookAlikes(true);
    } else {
      if (tab === 'pin' || tab === 'wifi') setTab('password');
      setLengthInput(String(opts.length));
    }
    setRegenTick((t) => t + 1);
  };

  const handleCopyText = async (text: string, label: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopiedId(label);
        setTimeout(() => setCopiedId(null), 1800);
      }
    } catch {
      setCopiedId(null);
    }
  };

  const handleDownloadBulk = () => {
    if (bulkResults.length === 0) return;
    try {
      const content = bulkResults.map((r) => r.password).join('\n');
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `passwords-${bulkResults.length}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // ignore download errors
    }
  };

  const handleShareOptions = async () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    if (validLength !== null) url.searchParams.set('length', String(validLength));
    url.searchParams.set('upper', upper ? '1' : '0');
    url.searchParams.set('lower', lower ? '1' : '0');
    url.searchParams.set('digits', digits ? '1' : '0');
    url.searchParams.set('symbols', symbols ? '1' : '0');
    url.searchParams.set('lookalikes', excludeLookAlikes ? '1' : '0');
    url.searchParams.set('each', requireEach ? '1' : '0');
    await handleCopyText(url.toString(), 'share');
  };

  const handleClear = () => {
    setSingleResult(null);
    setBulkResults([]);
    setErrorMsg(null);
  };

  const activeLength =
    tab === 'pin'
      ? validPinLength ?? 6
      : tab === 'wifi'
        ? validWifiLength ?? 20
        : validLength ?? 16;

  const bits = singleResult?.entropyBits ?? previewMetrics.bits;
  const rating = getEntropyRating(bits);
  const fastRate = rates['offline-fast-hash'] ?? 1e11;

  return (
    <div className={styles.container}>
      <TabSlider
        tabs={TABS}
        activeId={tab}
        onChange={setTab}
        ariaLabel="Password Generator Modes"
      />

      <PasswordInputGuide
        tab={tab}
        length={activeLength}
        entropyBits={bits}
        excludeLookAlikes={tab === 'wifi' ? wifiExcludeLookAlikes : excludeLookAlikes}
        requireEach={tab === 'pin' ? false : tab === 'wifi' ? true : requireEach}
        bulkCount={validBulkCount ?? 10}
        focusedField={focusedField}
      />

      {/* Output Card (single tabs) */}
      {tab !== 'bulk' && (
        <div className={styles.card}>
          <div className={styles.outputBox}>
            <div className={styles.passwordDisplay} aria-live="polite">
              {!mounted
                ? '••••••••••••••••'
                : errorMsg
                  ? '—'
                  : singleResult
                    ? hidden
                      ? '•'.repeat(singleResult.password.length)
                      : singleResult.password
                    : 'Cleared'}
            </div>
            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => setRegenTick((t) => t + 1)}
              >
                Generate secure password
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                disabled={!singleResult}
                onClick={() => singleResult && handleCopyText(singleResult.password, 'main')}
              >
                {copiedId === 'main' ? '✓ Copied' : 'Copy'}
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setHidden((h) => !h)}
              >
                {hidden ? 'Show' : 'Hide'}
              </button>
              <button type="button" className={styles.secondaryBtn} onClick={handleClear}>
                Clear
              </button>
              <button type="button" className={styles.secondaryBtn} onClick={handleShareOptions}>
                {copiedId === 'share' ? '✓ Options URL copied' : 'Share options'}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className={styles.errorBox} role="alert">
              {errorMsg}
            </div>
          )}

          {!errorMsg && previewMetrics.poolSize > 0 && (
            <>
              <div className={styles.meterTrack} aria-hidden="true">
                <div
                  className={styles.meterFill}
                  style={{ width: `${rating.pct}%`, background: rating.color }}
                />
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Strength</div>
                  <div className={styles.statValue}>{rating.label}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Entropy</div>
                  <div className={styles.statValue}>{bits.toFixed(2)} bits</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Character Pool</div>
                  <div className={styles.statValue}>{previewMetrics.poolSize} chars</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Fast-Hash Guess Avg</div>
                  <div className={styles.statValue}>{formatGuessTime(bits, fastRate)}</div>
                </div>
              </div>

              <p className={styles.hint}>
                This {activeLength}-character password was drawn from {previewMetrics.poolSize} possible characters ({bits.toFixed(1)} bits). On average, half the possibilities would take about {formatGuessTime(bits, fastRate)} at {fastRate.toLocaleString('en-US')} guesses/sec.
              </p>
            </>
          )}
        </div>
      )}

      {/* Controls Card */}
      <div className={styles.card}>
        {(tab === 'password' || tab === 'bulk') && (
          <>
            <div className={styles.presetRow}>
              <span className={styles.presetLabel}>Presets:</span>
              <button type="button" className={styles.presetBtn} onClick={() => applyPreset('strong')}>
                Strong (16)
              </button>
              <button type="button" className={styles.presetBtn} onClick={() => applyPreset('nist')}>
                15 (NIST minimum)
              </button>
              <button type="button" className={styles.presetBtn} onClick={() => applyPreset('alphanumeric')}>
                Letters + digits (16)
              </button>
              <button type="button" className={styles.presetBtn} onClick={() => applyPreset('hex')}>
                Hex (32)
              </button>
              <button type="button" className={styles.presetBtn} onClick={() => applyPreset('wifi')}>
                Wi-Fi (20)
              </button>
              <button type="button" className={styles.presetBtn} onClick={() => applyPreset('pin')}>
                PIN (6)
              </button>
            </div>

            <div className={styles.controlGroup}>
              <div className={styles.labelRow}>
                <label htmlFor={`${uid}-pw-len`}>1. Password Length ({MIN_PASSWORD_LENGTH}–{MAX_PASSWORD_LENGTH})</label>
                <input
                  id={`${uid}-pw-len`}
                  type="text"
                  inputMode="numeric"
                  className={styles.numberInput}
                  value={lengthInput}
                  onFocus={() => setFocusedField('length')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setLengthInput(e.target.value)}
                />
              </div>
              <div className={styles.rangeRow}>
                <input
                  type="range"
                  aria-label="Password Length Slider"
                  min={MIN_PASSWORD_LENGTH}
                  max={MAX_PASSWORD_LENGTH}
                  value={validLength ?? 16}
                  className={styles.rangeInput}
                  onChange={(e) => setLengthInput(e.target.value)}
                />
              </div>
            </div>

            <div
              className={styles.checkboxGrid}
              onFocus={() => setFocusedField('sets')}
              onBlur={() => setFocusedField(null)}
            >
              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={upper && !hexOnly}
                  disabled={hexOnly}
                  onChange={(e) => {
                    setHexOnly(false);
                    setUpper(e.target.checked);
                  }}
                />
                <span>2a. Uppercase (A–Z)</span>
              </label>
              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={lower && !hexOnly}
                  disabled={hexOnly}
                  onChange={(e) => {
                    setHexOnly(false);
                    setLower(e.target.checked);
                  }}
                />
                <span>2b. Lowercase (a–z)</span>
              </label>
              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={digits && !hexOnly}
                  disabled={hexOnly}
                  onChange={(e) => {
                    setHexOnly(false);
                    setDigits(e.target.checked);
                  }}
                />
                <span>2c. Numbers (0–9)</span>
              </label>
              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={symbols && !hexOnly}
                  disabled={hexOnly}
                  onChange={(e) => {
                    setHexOnly(false);
                    setSymbols(e.target.checked);
                  }}
                />
                <span>2d. Symbols</span>
              </label>
              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={excludeLookAlikes}
                  disabled={hexOnly}
                  onChange={(e) => setExcludeLookAlikes(e.target.checked)}
                />
                <span>3. Exclude look-alikes (O 0 I l 1)</span>
              </label>
              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={requireEach}
                  disabled={hexOnly}
                  onChange={(e) => setRequireEach(e.target.checked)}
                />
                <span>4. At least one of each set</span>
              </label>
            </div>

            {symbols && !hexOnly && (
              <div className={styles.controlGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor={`${uid}-custom-sym`}>Custom Symbol Set</label>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => setCustomSymbols(DEFAULT_SYMBOL_CHARS)}
                  >
                    Reset symbols
                  </button>
                </div>
                <input
                  id={`${uid}-custom-sym`}
                  type="text"
                  className={styles.textInput}
                  value={customSymbols}
                  onChange={(e) => setCustomSymbols(e.target.value)}
                />
                <p className={styles.hint}>
                  Duplicates and characters already in active letter/digit sets are automatically excluded.
                </p>
              </div>
            )}

            {hexOnly && (
              <div className={styles.actionRow}>
                <span className={styles.hint}>Hex mode active (0–9, a–f).</span>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => applyPreset('strong')}
                >
                  Return to standard sets
                </button>
              </div>
            )}
          </>
        )}

        {tab === 'pin' && (
          <div className={styles.controlGroup}>
            <div className={styles.labelRow}>
              <label htmlFor={`${uid}-pin-len`}>1. PIN Length ({MIN_PIN_LENGTH}–{MAX_PIN_LENGTH} digits)</label>
              <input
                id={`${uid}-pin-len`}
                type="text"
                inputMode="numeric"
                className={styles.numberInput}
                value={pinLengthInput}
                onFocus={() => setFocusedField('pinLength')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setPinLengthInput(e.target.value)}
              />
            </div>
            <input
              type="range"
              aria-label="PIN Length Slider"
              min={MIN_PIN_LENGTH}
              max={MAX_PIN_LENGTH}
              value={validPinLength ?? 6}
              className={styles.rangeInput}
              onChange={(e) => setPinLengthInput(e.target.value)}
            />
            <p className={styles.hint}>
              Digits 0–9 only. Avoid predictable patterns like 1234, 0000, or birth years.
            </p>
          </div>
        )}

        {tab === 'wifi' && (
          <>
            <div className={styles.controlGroup}>
              <div className={styles.labelRow}>
                <label htmlFor={`${uid}-wifi-len`}>1. Wi-Fi WPA2 Length ({MIN_WIFI_LENGTH}–{MAX_WIFI_LENGTH} chars)</label>
                <input
                  id={`${uid}-wifi-len`}
                  type="text"
                  inputMode="numeric"
                  className={styles.numberInput}
                  value={wifiLengthInput}
                  onChange={(e) => setWifiLengthInput(e.target.value)}
                />
              </div>
              <input
                type="range"
                aria-label="Wi-Fi Length Slider"
                min={MIN_WIFI_LENGTH}
                max={MAX_WIFI_LENGTH}
                value={validWifiLength ?? 20}
                className={styles.rangeInput}
                onChange={(e) => setWifiLengthInput(e.target.value)}
              />
            </div>
            <div className={styles.checkboxGrid}>
              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={wifiExcludeLookAlikes}
                  onChange={(e) => setWifiExcludeLookAlikes(e.target.checked)}
                />
                <span>Exclude look-alikes (O 0 I l 1)</span>
              </label>
              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={wifiSymbols}
                  onChange={(e) => setWifiSymbols(e.target.checked)}
                />
                <span>Include symbols</span>
              </label>
            </div>
          </>
        )}

        {tab === 'bulk' && (
          <>
            <div className={styles.controlGroup}>
              <div className={styles.labelRow}>
                <label htmlFor={`${uid}-bulk-count`}>Bulk Count ({MIN_BULK_COUNT}–{MAX_BULK_COUNT} passwords)</label>
                <input
                  id={`${uid}-bulk-count`}
                  type="text"
                  inputMode="numeric"
                  className={styles.numberInput}
                  value={bulkCountInput}
                  onChange={(e) => setBulkCountInput(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => setRegenTick((t) => t + 1)}
              >
                Generate {validBulkCount ?? 10} passwords
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                disabled={bulkResults.length === 0}
                onClick={() =>
                  handleCopyText(
                    bulkResults.map((r) => r.password).join('\n'),
                    'bulk-all'
                  )
                }
              >
                {copiedId === 'bulk-all' ? '✓ All copied' : 'Copy all'}
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                disabled={bulkResults.length === 0}
                onClick={handleDownloadBulk}
              >
                Download .txt
              </button>
            </div>

            {errorMsg && (
              <div className={styles.errorBox} role="alert">
                {errorMsg}
              </div>
            )}

            <div className={styles.bulkList}>
              {bulkResults.map((item, idx) => (
                <div key={idx} className={styles.bulkRow}>
                  <span>{hidden ? '•'.repeat(item.password.length) : item.password}</span>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => handleCopyText(item.password, `bulk-${idx}`)}
                  >
                    {copiedId === `bulk-${idx}` ? '✓' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Guess-Time Scenario Table Card */}
      {!errorMsg && bits > 0 && (
        <div className={styles.card}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption>Estimated average guess times (assumptions, editable below)</caption>
              <thead>
                <tr>
                  <th>Attack Scenario</th>
                  <th>Assumed Rate</th>
                  <th>Average Time (50% space)</th>
                </tr>
              </thead>
              <tbody>
                {ATTACK_SCENARIOS.map((s) => {
                  const rate = rates[s.id] ?? s.guessesPerSecond;
                  return (
                    <tr key={s.id}>
                      <td><strong>{s.label}</strong></td>
                      <td>{rate.toLocaleString('en-US', { maximumFractionDigits: 4 })} / sec</td>
                      <td><strong>{formatGuessTime(bits, rate)}</strong></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <details>
            <summary className={styles.hint} style={{ cursor: 'pointer', fontWeight: 700 }}>
              Assumptions: edit guesses/second
            </summary>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              {ATTACK_SCENARIOS.map((s) => (
                <div key={s.id} className={styles.labelRow}>
                  <span className={styles.hint}>{s.label}:</span>
                  <input
                    type="number"
                    min="0.001"
                    step="any"
                    aria-label={`${s.label} guesses per second`}
                    className={styles.rateInput}
                    value={rates[s.id] ?? s.guessesPerSecond}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (Number.isFinite(val) && val > 0) {
                        setRates((prev) => ({ ...prev, [s.id]: val }));
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      <p className={styles.privacyNote}>
        Made in your browser with Web Crypto (`crypto.getRandomValues`). Nothing is saved or sent.
      </p>
    </div>
  );
}
