'use client';

import React, { useState, useEffect, useMemo, useId } from 'react';
import Link from 'next/link';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import { useTabParam } from '@/components/tool/shared/useTabParam';
import {
  DictionaryLookup,
  StrengthBandId,
  estimatePasswordStrength,
} from '@/lib/strength-engine';
import { ATTACK_SCENARIOS, formatGuessTime } from '@/data/attack-scenarios';
import StrengthInputGuide from './StrengthInputGuide';
import styles from './PasswordStrengthChecker.module.css';

type TabId = 'check' | 'breakdown' | 'scenarios';

const TABS: TabItem<TabId>[] = [
  { id: 'check', label: '1. Check' },
  { id: 'breakdown', label: '2. Breakdown' },
  { id: 'scenarios', label: '3. Attack Scenarios' },
];

const TAB_IDS: TabId[] = ['check', 'breakdown', 'scenarios'];

function bandColor(band: StrengthBandId): { color: string; pct: number } {
  switch (band) {
    case 'very-weak':
      return { color: 'var(--danger)', pct: 18 };
    case 'weak':
      return { color: '#D97706', pct: 36 };
    case 'fair':
      return { color: '#0369A1', pct: 58 };
    case 'strong':
      return { color: 'var(--cat-developer)', pct: 80 };
    case 'very-strong':
      return { color: 'var(--success)', pct: 100 };
  }
}

export default function PasswordStrengthChecker() {
  const uid = useId();
  const [tab, setTab] = useTabParam<TabId>(TAB_IDS, 'check');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNaive, setShowNaive] = useState(true);

  // Lazy-loaded same-origin dictionary chunks (never in initial page bundle)
  const [dictState, setDictState] = useState<{
    loaded: boolean;
    lookup?: DictionaryLookup;
    commonCount: number;
  }>({ loaded: false, commonCount: 0 });

  useEffect(() => {
    let active = true;
    Promise.all([
      import('@/data/common-passwords'),
      import('@/data/wordlist-passphrase'),
    ])
      .then(([commonMod, effMod]) => {
        if (!active) return;
        const effSet = new Set(effMod.PASSPHRASE_WORDLIST);
        setDictState({
          loaded: true,
          commonCount: commonMod.COMMON_PASSWORDS_COUNT,
          lookup: {
            getCommonRank: commonMod.getCommonPasswordRank,
            hasWord: (w) => effSet.has(w),
            wordListSize: effMod.PASSPHRASE_WORDLIST_META.size,
          },
        });
      })
      .catch(() => {
        if (active) setDictState({ loaded: true, commonCount: 0 });
      });
    return () => {
      active = false;
    };
  }, []);

  const [rates, setRates] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const s of ATTACK_SCENARIOS) init[s.id] = s.guessesPerSecond;
    return init;
  });

  const resetRates = () => {
    const init: Record<string, number> = {};
    for (const s of ATTACK_SCENARIOS) init[s.id] = s.guessesPerSecond;
    setRates(init);
  };

  const result = useMemo(
    () => estimatePasswordStrength(password, dictState.lookup),
    [password, dictState.lookup]
  );

  const meter = bandColor(result.bandId);
  const fastRate = rates['offline-fast-hash'] ?? 1e11;
  const targetGenLen = Math.min(128, Math.max(16, result.originalLength || 16));

  return (
    <div className={styles.container}>
      <TabSlider
        tabs={TABS}
        activeId={tab}
        onChange={setTab}
        ariaLabel="Password Strength Checker Tabs"
      />

      <StrengthInputGuide tab={tab} />

      <div className={styles.card}>
        <label htmlFor={`${uid}-pw-input`} style={{ fontWeight: 700, fontSize: '0.95rem' }}>
          Enter a test password (try one similar to yours, not your real one):
        </label>
        <div className={styles.inputRow}>
          <input
            id={`${uid}-pw-input`}
            type={showPassword ? 'text' : 'password'}
            autoComplete="off"
            spellCheck={false}
            autoCapitalize="off"
            placeholder="Type a password to test..."
            className={styles.passwordInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => setPassword('')}
          >
            Clear
          </button>
        </div>

        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showNaive}
            onChange={(e) => setShowNaive(e.target.checked)}
          />
          <span>Show naive character-count entropy beside pattern estimate</span>
        </label>

        {result.truncatedTo128 && (
          <p className={styles.hint}>
            Analyzed the first 128 code points of your {result.originalLength.toLocaleString('en-US')}-character input.
          </p>
        )}

        {password.length > 0 && (
          <>
            <div className={styles.meterTrack} aria-hidden="true">
              <div
                className={styles.meterFill}
                style={{ width: `${meter.pct}%`, background: meter.color }}
              />
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Our Band</div>
                <div className={styles.statValue}>{result.bandLabel}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Real Estimate</div>
                <div className={styles.statValue}>{result.guessesLog2.toFixed(2)} bits</div>
              </div>
              {showNaive && (
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Naive Estimate</div>
                  <div className={styles.statValue}>{result.naiveEntropyBits.toFixed(2)} bits</div>
                </div>
              )}
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Fast-Hash Avg Time</div>
                <div className={styles.statValue}>
                  {formatGuessTime(result.guessesLog2, fastRate)}
                </div>
              </div>
            </div>

            <p className={styles.hint}>
              {!dictState.loaded
                ? 'Checking common-password list…'
                : result.commonPasswordRank !== null
                  ? `Found at #${result.commonPasswordRank.toLocaleString('en-US')} in the ${dictState.commonCount.toLocaleString('en-US')}-entry common-password list.`
                  : `Not in the ${dictState.commonCount.toLocaleString('en-US')}-entry common-password list (that alone does not make a short or patterned password strong).`}
            </p>

            <p className={styles.hint}>
              This password would take about {formatGuessTime(result.guessesLog2, fastRate)} on average to guess offline with a fast hash ({fastRate.toLocaleString('en-US')} guesses/sec).
            </p>

            <div>
              <Link
                href={`/password-generator/?length=${targetGenLen}`}
                className={styles.primaryLink}
              >
                Make it stronger ({targetGenLen} chars) →
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Breakdown Tab (or always visible in breakdown tab) */}
      {password.length > 0 && (tab === 'breakdown' || tab === 'check') && (
        <div className={styles.card}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
            Pattern Breakdown ({result.matches.length} {result.matches.length === 1 ? 'segment' : 'segments'})
          </h3>
          {showNaive && (
            <p className={styles.hint}>
              Naive estimate (ignoring patterns): {result.naiveEntropyBits.toFixed(1)} bits · Real pattern-aware estimate: {result.guessesLog2.toFixed(1)} bits
            </p>
          )}
          <div className={styles.segmentList}>
            {result.matches.map((m, idx) => (
              <div key={idx} className={styles.segmentItem}>
                <div>
                  <span className={styles.segmentToken}>{m.token}</span>{' '}
                  <span className={styles.segmentReason}>— {m.reason}</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  ~{m.guessesDisplay} guesses
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attack Scenarios Card */}
      {(tab === 'scenarios' || password.length > 0) && (
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
                      <td>
                        {tab === 'scenarios' ? (
                          <input
                            type="number"
                            min="0.001"
                            step="any"
                            aria-label={`${s.label} guesses per second`}
                            className={styles.rateInput}
                            value={rate}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (Number.isFinite(val) && val > 0) {
                                setRates((prev) => ({ ...prev, [s.id]: val }));
                              }
                            }}
                          />
                        ) : (
                          `${rate.toLocaleString('en-US', { maximumFractionDigits: 4 })} / sec`
                        )}
                      </td>
                      <td>
                        <strong>
                          {password.length > 0 ? formatGuessTime(result.guessesLog2, rate) : '—'}
                        </strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {tab === 'scenarios' && (
            <div>
              <button type="button" className={styles.secondaryBtn} onClick={resetRates}>
                Reset default rates
              </button>
            </div>
          )}
        </div>
      )}

      <p className={styles.privacyBanner}>
        Checked on this device only. Nothing is stored or sent. To be extra safe, test a password that&apos;s <em>like</em> yours, not your real one.
      </p>
    </div>
  );
}
