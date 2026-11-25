'use client';

import React, { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import TabSlider from '@/components/tool/shared/TabSlider';
import { useTabParam } from '@/components/tool/shared/useTabParam';
import HackerNameInputGuide from './HackerNameInputGuide';
import {
  DEFAULT_HACKER_OPTIONS,
  generateHackerNames,
  type CaseStyle,
  type GeneratedHackerName,
  type HackerNameOptions,
  type HackerNameResult,
  type HackerStyle,
  type LeetLevel,
} from '@/lib/hacker-name-engine';
import styles from './HackerNameGenerator.module.css';

type TabId = 'generate' | 'favourites';

const TABS: { id: TabId; label: string }[] = [
  { id: 'generate', label: 'Generate' },
  { id: 'favourites', label: 'Favourites' },
];

const FAV_STORAGE_KEY = 'kkctools_hacker_favourites_v1';

const emptySubscribe = () => () => {};
function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function loadFavourites(): string[] {
  try {
    const raw = window.localStorage.getItem(FAV_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function saveFavourites(items: string[]) {
  try {
    window.localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage blocked or quota exceeded
  }
}

export default function HackerNameGenerator() {
  const [activeTab, setActiveTab] = useTabParam<TabId>(['generate', 'favourites'], 'generate');
  const [options, setOptions] = useState<HackerNameOptions>(DEFAULT_HACKER_OPTIONS);
  const [result, setResult] = useState<HackerNameResult | null>(null);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const mounted = useIsMounted();

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => {
      const saved = loadFavourites();
      setFavourites(saved);
      setResult(generateHackerNames({ ...DEFAULT_HACKER_OPTIONS, excludeNames: saved }));
    }, 0);
    return () => clearTimeout(t);
  }, [mounted]);

  const handleGenerate = useCallback(
    (nextOpts: HackerNameOptions = options, favs: string[] = favourites) => {
      setResult(generateHackerNames({ ...nextOpts, excludeNames: favs }));
    },
    [options, favourites]
  );

  const updateOptions = (patch: Partial<HackerNameOptions>) => {
    const next = { ...options, ...patch };
    setOptions(next);
    if (mounted) {
      handleGenerate(next, favourites);
    }
  };

  const toggleFavourite = (name: string) => {
    const exists = favourites.includes(name);
    const next = exists ? favourites.filter((n) => n !== name) : [name, ...favourites];
    setFavourites(next);
    saveFavourites(next);
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1800);
    } catch {
      // Clipboard denied
    }
  };

  const styleDesc =
    options.style === 'any'
      ? 'all 5 styles'
      : `the ${options.style} style`;

  return (
    <div className={styles.container}>
      <TabSlider
        tabs={TABS}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as TabId)}
        ariaLabel="Hacker name generator tabs"
      />

      <HackerNameInputGuide
        activeTab={activeTab}
        styleChoice={options.style}
        seedWord={options.seedWord ?? ''}
        leetLevel={options.leetLevel}
        minLength={options.minLength}
        maxLength={options.maxLength}
        allowUnderscore={options.allowUnderscore}
        allowSpaces={options.allowSpaces}
        favouritesCount={favourites.length}
        focusedField={focusedField}
      />

      {activeTab === 'generate' && (
        <div className={styles.card}>
          <div className={styles.controlsGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="hn-style" className={styles.fieldLabel}>
                Style
              </label>
              <select
                id="hn-style"
                value={options.style}
                onFocus={() => setFocusedField('style')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => updateOptions({ style: e.target.value as HackerStyle })}
                className={styles.selectInput}
              >
                <option value="any">Any (mix all 5)</option>
                <option value="l33t">l33t (leet speak)</option>
                <option value="cyberpunk">Cyberpunk</option>
                <option value="minimal">Minimal</option>
                <option value="gamerTag">Gamer tag</option>
                <option value="terminal">Terminal</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="hn-seed" className={styles.fieldLabel}>
                Seed word (optional, max 20)
              </label>
              <input
                id="hn-seed"
                type="text"
                maxLength={20}
                placeholder="e.g. ghost"
                value={options.seedWord ?? ''}
                onFocus={() => setFocusedField('seed')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => updateOptions({ seedWord: e.target.value })}
                className={styles.textInput}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="hn-count" className={styles.fieldLabel}>
                Count
              </label>
              <select
                id="hn-count"
                value={options.count}
                onChange={(e) => updateOptions({ count: Number(e.target.value) })}
                className={styles.selectInput}
              >
                <option value={5}>5 names</option>
                <option value={10}>10 names</option>
                <option value={20}>20 names</option>
                <option value={30}>30 names</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="hn-leet" className={styles.fieldLabel}>
                Leet level
              </label>
              <select
                id="hn-leet"
                value={options.leetLevel}
                onFocus={() => setFocusedField('leet')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => updateOptions({ leetLevel: e.target.value as LeetLevel })}
                className={styles.selectInput}
              >
                <option value="none">None</option>
                <option value="light">Light (o→0, e→3)</option>
                <option value="heavy">Heavy (a/e/i/o/s/t)</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>Length (min–max)</span>
              <div className={styles.lengthRow}>
                <input
                  type="number"
                  min={3}
                  max={24}
                  aria-label="Minimum length"
                  value={options.minLength}
                  onFocus={() => setFocusedField('rules')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => updateOptions({ minLength: Number(e.target.value) || 4 })}
                  className={styles.numberInput}
                />
                <span>–</span>
                <input
                  type="number"
                  min={4}
                  max={32}
                  aria-label="Maximum length"
                  value={options.maxLength}
                  onFocus={() => setFocusedField('rules')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => updateOptions({ maxLength: Number(e.target.value) || 16 })}
                  className={styles.numberInput}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="hn-case" className={styles.fieldLabel}>
                Case
              </label>
              <select
                id="hn-case"
                value={options.caseStyle}
                onChange={(e) => updateOptions({ caseStyle: e.target.value as CaseStyle })}
                className={styles.selectInput}
              >
                <option value="as-generated">As generated</option>
                <option value="lower">lowercase</option>
                <option value="camel">CamelCase</option>
                <option value="upper">UPPERCASE</option>
              </select>
            </div>
          </div>

          <div className={styles.checkboxRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={options.allowUnderscore}
                onChange={(e) => updateOptions({ allowUnderscore: e.target.checked })}
              />
              <span>Allow underscores (_)</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={options.allowSpaces}
                onChange={(e) => updateOptions({ allowSpaces: e.target.checked })}
              />
              <span>Allow spaces</span>
            </label>
          </div>

          <div className={styles.actionRow}>
            <button type="button" className={styles.primaryBtn} onClick={() => handleGenerate()}>
              Generate hacker names
            </button>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() =>
                result &&
                handleCopy(
                  result.names.map((n) => n.name).join('\n'),
                  'copy-all'
                )
              }
              disabled={!result || result.names.length === 0}
            >
              {copiedId === 'copy-all' ? 'Copied all' : 'Copy all'}
            </button>
          </div>

          {result?.seedWarning && <div className={styles.warningBanner}>{result.seedWarning}</div>}
          {result?.filterWarning && <div className={styles.warningBanner}>{result.filterWarning}</div>}

          {result && (
            <p className={styles.summaryText}>
              {result.names.length} hacker names in {styleDesc}
              {options.seedWord?.trim() && !result.seedWarning
                ? `, made from your word '${options.seedWord.trim()}'`
                : ''}
              .
            </p>
          )}

          <div className={styles.namesGrid}>
            {(result?.names ?? []).map((item: GeneratedHackerName, idx: number) => {
              const isFav = favourites.includes(item.name);
              const showReadable = item.style === 'l33t' && item.readable !== item.name;
              return (
                <div key={`${item.name}-${idx}`} className={styles.nameCard}>
                  <div className={styles.nameTop}>
                    <span className={styles.nameText}>{item.name}</span>
                    <span className={styles.styleBadge}>{item.style}</span>
                  </div>
                  {showReadable && (
                    <span className={styles.readableNote}>Readable: {item.readable}</span>
                  )}
                  <div className={styles.cardActions}>
                    <button
                      type="button"
                      className={styles.smallBtn}
                      onClick={() => handleCopy(item.name, `copy-${idx}`)}
                    >
                      {copiedId === `copy-${idx}` ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      type="button"
                      className={styles.smallBtn}
                      onClick={() => toggleFavourite(item.name)}
                    >
                      {isFav ? '★ Saved' : '☆ Save'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'favourites' && (
        <div className={styles.card}>
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => handleCopy(favourites.join('\n'), 'fav-all')}
              disabled={favourites.length === 0}
            >
              {copiedId === 'fav-all' ? 'Copied all' : 'Copy all'}
            </button>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => {
                setFavourites([]);
                saveFavourites([]);
              }}
              disabled={favourites.length === 0}
            >
              Clear all
            </button>
          </div>

          {favourites.length === 0 ? (
            <p className={styles.summaryText}>
              No saved names yet. Click ☆ Save on any generated handle to store it on this device.
            </p>
          ) : (
            <div className={styles.namesGrid}>
              {favourites.map((name, idx) => (
                <div key={`${name}-${idx}`} className={styles.nameCard}>
                  <span className={styles.nameText}>{name}</span>
                  <div className={styles.cardActions}>
                    <button
                      type="button"
                      className={styles.smallBtn}
                      onClick={() => handleCopy(name, `fav-${idx}`)}
                    >
                      {copiedId === `fav-${idx}` ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      type="button"
                      className={styles.smallBtn}
                      onClick={() => toggleFavourite(name)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={styles.funNote}>
        <span>Names are made up for games, stories and usernames. Nothing here is about real hacking.</span>
        <div className={styles.linkRow}>
          <Link href="/band-name-generator/" className={styles.link}>
            Band Name Generator
          </Link>
          <Link href="/password-generator/" className={styles.link}>
            Need a password for that new account?
          </Link>
          <Link href="/passphrase-generator/" className={styles.link}>
            Passphrase Generator
          </Link>
        </div>
      </div>
    </div>
  );
}
