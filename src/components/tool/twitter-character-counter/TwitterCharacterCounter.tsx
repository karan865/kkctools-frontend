'use client';

import React, { useState, useMemo, useDeferredValue, useEffect } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import TextInputPanel from '@/components/tool/text/TextInputPanel';
import OverflowPreview from '@/components/tool/text/OverflowPreview';
import StatTiles, { StatTileItem } from '@/components/tool/text/StatTiles';
import XCountInputGuide from './XCountInputGuide';
import { xWeightedLength, xOverflowIndex, splitThread, ThreadNumbering } from '@/lib/x-count-engine';
import { countGraphemes, countCodePoints, countUtf16, overflowIndex } from '@/lib/text-engine';
import { TEXT_LIMIT_PRESETS, TextLimitPreset } from '@/data/text-limits';
import styles from './TwitterCharacterCounter.module.css';

type TabType = 'xpost' | 'instagram' | 'thread' | 'other';

const TABS: TabItem<TabType>[] = [
  { id: 'xpost', label: '1. X (Twitter) Post' },
  { id: 'instagram', label: '2. Instagram' },
  { id: 'thread', label: '3. Thread Splitter' },
  { id: 'other', label: '4. Other Platforms' },
];

const DEFAULT_POST = 'Hello, world! 👋';

export default function TwitterCharacterCounter() {
  const [tab, setTab] = useState<TabType>('xpost');
  const [liveText, setText] = useState<string>(DEFAULT_POST);
  const text = useDeferredValue(liveText);
  const [threadNumbering, setThreadNumbering] = useState<ThreadNumbering>('fraction');
  const [igField, setIgField] = useState<'caption' | 'bio'>('caption');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('threads-post');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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

  // Metrics
  const xWeighted = useMemo(() => xWeightedLength(text), [text]);
  const graphemes = useMemo(() => countGraphemes(text), [text]);
  const codePoints = useMemo(() => countCodePoints(text), [text]);
  const utf16Units = useMemo(() => countUtf16(text), [text]);

  // Instagram metrics
  const hashtags = useMemo(() => text.match(/#[\p{L}\p{N}_]+/gu) || [], [text]);
  const mentions = useMemo(() => text.match(/(?:^|[^\p{L}\p{N}_.@])@[\p{L}\p{N}_.]+/gu) || [], [text]);
  const igLimit = igField === 'caption' ? 2200 : 150;
  const igCharsLeft = igLimit - graphemes;

  // Thread split
  const threadPosts = useMemo(
    () => splitThread(text, { limit: 280, numbering: threadNumbering }),
    [text, threadNumbering]
  );

  // Selected other platform preset
  const currentPreset = useMemo(
    () => TEXT_LIMIT_PRESETS.find((p) => p.id === selectedPresetId) || TEXT_LIMIT_PRESETS[0],
    [selectedPresetId]
  );

  // SMS counts UTF-16 units; the rest count visible characters.
  const presetCount =
    currentPreset.unit === 'x-weighted'
      ? xWeighted
      : currentPreset.id === 'sms-unicode' || currentPreset.id === 'sms-gsm'
      ? utf16Units
      : graphemes;
  const presetLeft = currentPreset.limit - presetCount;

  // Active limit and remaining for X
  const xLeft = 280 - xWeighted;

  // Stat tiles for X Post
  const xStatTiles: StatTileItem[] = useMemo(
    () => [
      {
        id: 'xWeighted',
        label: 'X-Weighted Count',
        value: `${xWeighted} / 280`,
        highlight: xLeft >= 0,
        warning: xLeft < 0,
        sublabel: xLeft >= 0 ? `${xLeft} characters left` : `${Math.abs(xLeft)} over limit`,
      },
      {
        id: 'graphemes',
        label: 'Human Characters',
        value: graphemes.toString(),
        sublabel: 'Perceived symbols (graphemes)',
      },
      {
        id: 'status',
        label: 'Post Status',
        value: xLeft >= 0 ? '✓ Ready' : '⚠ Over Limit',
        warning: xLeft < 0,
      },
      {
        id: 'codePoints',
        label: 'Code Points',
        value: codePoints.toString(),
        sublabel: `${utf16Units} UTF-16 units`,
      },
    ],
    [xWeighted, xLeft, graphemes, codePoints, utf16Units]
  );

  // Stat tiles for Instagram
  const igStatTiles: StatTileItem[] = useMemo(
    () => [
      {
        id: 'chars',
        label: `${igField === 'caption' ? 'Caption' : 'Bio'} Characters`,
        value: `${graphemes} / ${igLimit}`,
        highlight: igCharsLeft >= 0,
        warning: igCharsLeft < 0,
        sublabel: igCharsLeft >= 0 ? `${igCharsLeft} left` : `${Math.abs(igCharsLeft)} over`,
      },
      {
        id: 'hashtags',
        label: 'Hashtags',
        value: `${hashtags.length} / 30`,
        warning: hashtags.length > 30,
        sublabel: `${Math.max(0, 30 - hashtags.length)} remaining`,
      },
      {
        id: 'mentions',
        label: 'Account Tags',
        value: `${mentions.length} / 20`,
        warning: mentions.length > 20,
        sublabel: `${Math.max(0, 20 - mentions.length)} remaining`,
      },
      {
        id: 'preview',
        label: 'Feed Fold (...more)',
        value: graphemes > 125 ? 'Truncated' : 'Full Preview',
        sublabel: 'Rough guide: 125 characters',
      },
    ],
    [igField, graphemes, igLimit, igCharsLeft, hashtags.length, mentions.length]
  );

  const handleCopyThreadPost = (postText: string, index: number) => {
    navigator.clipboard?.writeText(postText).then(
      () => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      },
      () => {}
    );
  };

  return (
    <div className={styles.calculator}>
      <TabSlider tabs={TABS} activeId={tab} onChange={handleTabChange} ariaLabel="Social Platform Counter Modes" />

      {/* Visual Guide above inputs */}
      <XCountInputGuide
        activeTab={tab}
        xWeighted={xWeighted}
        charsLeft={xLeft}
        hashtagsCount={hashtags.length}
        mentionsCount={mentions.length}
        threadCount={threadPosts.length}
        focusedField={focusedField}
      />

      {/* Tab 1: X (Twitter) Post */}
      {tab === 'xpost' && (
        <>
          <div className={styles.resultHero}>
            <div className={styles.headlineRow}>
              <div className={styles.resultPrimary}>
                {xWeighted} / 280 <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>weighted</span>
              </div>
              <div className={`${styles.resultRange} ${xLeft >= 0 ? styles.toneOk : styles.toneOver}`}>
                {xLeft >= 0 ? `${xLeft} characters left` : `${Math.abs(xLeft)} characters over limit`}
              </div>
            </div>

            <div className={styles.sentenceBox}>
              This post counts <strong>{xWeighted} of 280</strong> characters on X. All web links count as exactly 23
              characters, and each emoji counts as 2 characters.
            </div>
          </div>

          <TextInputPanel
            value={liveText}
            onChange={setText}
            label="Your X Post (Tweet)"
            sampleText={DEFAULT_POST}
            placeholder="What's happening? Type or paste your tweet to count weighted characters..."
            onFocus={() => setFocusedField('post')}
            onBlur={() => setFocusedField(null)}
          />
          <OverflowPreview text={text} start={xOverflowIndex(text, 280)} />

          <StatTiles stats={xStatTiles} columns={4} />

          <div className={styles.transparencyPanel}>
            <div className={styles.transparencyTitle}>🔍 Character Breakdown &amp; Transparency Panel</div>
            <div className={styles.transparencyGrid}>
              <div className={styles.transBox}>
                <span className={styles.transLabel}>X-Weighted</span>
                <span className={styles.transVal}>{xWeighted}</span>
              </div>
              <div className={styles.transBox}>
                <span className={styles.transLabel}>Graphemes (Visual)</span>
                <span className={styles.transVal}>{graphemes}</span>
              </div>
              <div className={styles.transBox}>
                <span className={styles.transLabel}>Code Points</span>
                <span className={styles.transVal}>{codePoints}</span>
              </div>
              <div className={styles.transBox}>
                <span className={styles.transLabel}>UTF-16 Units</span>
                <span className={styles.transVal}>{utf16Units}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tab 2: Instagram */}
      {tab === 'instagram' && (
        <>
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="ig-field-select" className={styles.label}>
                <span>Instagram Field</span>
              </label>
              <select
                id="ig-field-select"
                aria-label="Instagram Field"
                value={igField}
                onChange={(e) => setIgField(e.target.value as 'caption' | 'bio')}
                className={styles.select}
              >
                <option value="caption">Caption (2,200 chars · 30 hashtags · 20 mentions)</option>
                <option value="bio">Profile Bio (150, unverified: check Instagram&apos;s help page)</option>
              </select>
            </div>
          </div>

          <div className={styles.resultHero}>
            <div className={styles.headlineRow}>
              <div className={styles.resultPrimary}>
                {graphemes} / {igLimit} <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>characters</span>
              </div>
              <div className={`${styles.resultRange} ${igCharsLeft >= 0 ? styles.toneOk : styles.toneOver}`}>
                {igCharsLeft >= 0 ? `${igCharsLeft} chars left` : `${Math.abs(igCharsLeft)} over limit`}
              </div>
            </div>

            <div className={styles.sentenceBox}>
              Instagram caption limit is <strong>2,200 characters</strong> with up to <strong>30 hashtags</strong> and{' '}
              <strong>20 account tags</strong>. Where the feed shows &quot;...more&quot; is not documented; the preview tile below uses 125
              characters as a rough guide.
            </div>
          </div>

          <TextInputPanel
            value={liveText}
            onChange={setText}
            label="Your Instagram Caption or Bio"
            placeholder="Write your caption with #hashtags and @mentions..."
          />
          <OverflowPreview text={text} start={overflowIndex(text, igLimit, 'graphemes')} />

          <StatTiles stats={igStatTiles} columns={4} />
        </>
      )}

      {/* Tab 3: Thread Splitter */}
      {tab === 'thread' && (
        <>
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="thread-numbering-select" className={styles.label}>
                <span>Thread Post Numbering Style</span>
              </label>
              <select
                id="thread-numbering-select"
                aria-label="Thread Post Numbering Style"
                value={threadNumbering}
                onChange={(e) => setThreadNumbering(e.target.value as ThreadNumbering)}
                className={styles.select}
              >
                <option value="fraction">Fraction suffix: &quot; 1/n&quot;</option>
                <option value="bracket">Bracketed suffix: &quot; (1/n)&quot;</option>
                <option value="emoji">Thread emoji: &quot; 🧵 1/n&quot;</option>
                <option value="none">No numbering suffix</option>
              </select>
            </div>
          </div>

          <TextInputPanel
            value={liveText}
            onChange={setText}
            label="Long text to split into an X Thread"
            placeholder="Paste your article or long thoughts here. The thread splitter will automatically divide it into tweet-sized segments without breaking URLs or emoji..."
            rows={6}
          />

          <div className={styles.threadList}>
            <div className={styles.headlineRow}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                Thread Breakdown ({threadPosts.length} {threadPosts.length === 1 ? 'post' : 'posts'})
              </h3>
            </div>

            {threadPosts.map((post, idx) => {
              const postWeight = xWeightedLength(post);
              return (
                <div key={idx} className={styles.threadCard}>
                  <div className={styles.threadCardHeader}>
                    <span className={styles.threadBadge}>
                      Post {idx + 1} of {threadPosts.length} ({postWeight} / 280 weighted)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyThreadPost(post, idx)}
                      className={styles.copyButton}
                    >
                      {copiedIndex === idx ? '✓ Copied' : 'Copy Post'}
                    </button>
                  </div>
                  <div className={styles.threadContent}>{post}</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Tab 4: Other Platforms */}
      {tab === 'other' && (
        <>
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="platform-preset-select" className={styles.label}>
                <span>Choose Platform Preset</span>
              </label>
              <select
                id="platform-preset-select"
                aria-label="Choose Platform Preset"
                value={selectedPresetId}
                onChange={(e) => setSelectedPresetId(e.target.value)}
                className={styles.select}
              >
                {TEXT_LIMIT_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.platform} – {preset.field} ({preset.limit.toLocaleString('en-US')}{' '}
                    {preset.unit === 'x-weighted' ? 'weighted' : 'chars'}
                    {preset.verified ? ' · Verified' : ' · Unverified'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!currentPreset.verified && (
            <div className={styles.unverifiedWarning}>
              ⚠️ <strong>Unverified Platform Limit:</strong> The limit for {currentPreset.platform}{' '}
              {currentPreset.field} ({currentPreset.limit.toLocaleString('en-US')}) is not confirmed from an official page. Unverified: check {currentPreset.platform}&apos;s help page.
            </div>
          )}

          <div className={styles.resultHero}>
            <div className={styles.headlineRow}>
              <div className={styles.resultPrimary}>
                {presetCount} / {currentPreset.limit.toLocaleString('en-US')}{' '}
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                  {currentPreset.unit === 'x-weighted' ? 'weighted' : 'chars'}
                </span>
              </div>
              <div className={`${styles.resultRange} ${presetLeft >= 0 ? styles.toneOk : styles.toneOver}`}>
                {presetLeft >= 0 ? `${presetLeft.toLocaleString('en-US')} left` : `${Math.abs(presetLeft)} over`}
              </div>
            </div>

            <div className={styles.sentenceBox}>
              Platform: <strong>{currentPreset.platform}</strong> ({currentPreset.field}) · Checked on:{' '}
              <strong>{currentPreset.checkedOn}</strong>
              {currentPreset.sourceUrl && (
                <>
                  {' '}
                  ·{' '}
                  <a href={currentPreset.sourceUrl} target="_blank" rel="noopener noreferrer">
                    Official Documentation Source ↗
                  </a>
                </>
              )}
            </div>
          </div>

          <TextInputPanel
            value={liveText}
            onChange={setText}
            label={`Text for ${currentPreset.platform}`}
            placeholder={`Type or paste text for ${currentPreset.platform}...`}
          />
        </>
      )}
    </div>
  );
}
