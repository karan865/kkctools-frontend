'use client';

import React, { useState, useMemo, useDeferredValue, useEffect, useRef, useCallback } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import { useTabParam } from '@/components/tool/text/useTabParam';
import Link from 'next/link';
import {
  calculateSpeechTime,
  calculateWordsNeeded,
  generateSpeechTable,
  calculatePaceWpm,
  formatDuration,
  DEFAULT_SILENT_WPM,
  DEFAULT_ALOUD_WPM,
  DEFAULT_PRESENTATION_WPM,
  DEFAULT_SLOW_SPEECH_WPM,
  DEFAULT_CONVERSATIONAL_WPM,
  SpeechTableRow,
} from '@/lib/reading-time-engine';
import { countWords } from '@/lib/text-engine';
import TextInputPanel from '@/components/tool/text/TextInputPanel';
import StatTiles, { StatTileItem } from '@/components/tool/text/StatTiles';
import ReadingTimeInputGuide from './ReadingTimeInputGuide';
import styles from './ReadingTimeCalculator.module.css';

type ActiveTab = 'wordsToTime' | 'speechLength' | 'pasteText' | 'practiceTimer' | 'measurePace';

const TABS: TabItem<ActiveTab>[] = [
  { id: 'wordsToTime', label: '1. Words → Time' },
  { id: 'speechLength', label: '2. Speech Length (Minutes → Words)' },
  { id: 'pasteText', label: '3. Paste Text' },
  { id: 'practiceTimer', label: '4. Practice Timer' },
  { id: 'measurePace', label: '5. Measure My Pace' },
];
const TAB_IDS = TABS.map((t) => t.id);

// Our own passage for measuring pace
const SAMPLE_CALIBRATION_PASSAGE =
  'Effective communication is rooted in clarity, pace, and purposeful rhythm. Whether delivering a keynote, ' +
  'narrating an audio story, or explaining technical architecture, speech cadence shapes how audiences absorb ' +
  'ideas. A rapid tempo creates urgency but risks losing listeners during complex points, while a deliberate, ' +
  'measured cadence provides room for emphasis and reflection. Strategic pauses act as auditory punctuation, ' +
  'letting core themes resonate before transitioning to new arguments. Great speakers align their delivery ' +
  'with cognitive capacity, ensuring every sentence delivers its intended impact with grace and authority.';
const SAMPLE_PASSAGE_WORD_COUNT = countWords(SAMPLE_CALIBRATION_PASSAGE);

export default function ReadingTimeCalculator() {
  const [activeTab, setActiveTab] = useTabParam<ActiveTab>(TAB_IDS, 'wordsToTime');

  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Core Inputs
  const [words, setWords] = useState<number>(1000);
  const [speechMinutes, setSpeechMinutes] = useState<number>(5);
  const [livePastedText, setPastedText] = useState<string>('');
  const pastedText = useDeferredValue(livePastedText);

  // Pace Rates
  const [silentWpm, setSilentWpm] = useState<number>(DEFAULT_SILENT_WPM);
  const [aloudWpm, setAloudWpm] = useState<number>(DEFAULT_ALOUD_WPM);
  const [presentationWpm, setPresentationWpm] = useState<number>(DEFAULT_PRESENTATION_WPM);
  const [slowWpm, setSlowWpm] = useState<number>(DEFAULT_SLOW_SPEECH_WPM);
  const [conversationalWpm, setConversationalWpm] = useState<number>(DEFAULT_CONVERSATIONAL_WPM);

  // Buffer
  const [pauseBuffer, setPauseBuffer] = useState<number>(0);
  const [slidesCount, setSlidesCount] = useState<number>(0);
  const [secPerSlide, setSecPerSlide] = useState<number>(5);

  // Practice Timer State
  const [timerTargetSec, setTimerTargetSec] = useState<number>(300); // 5 min default
  const [timerElapsedSec, setTimerElapsedSec] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerElapsedRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Measure Pace State
  const [measureElapsedMs, setMeasureElapsedMs] = useState<number>(0);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [measureTooShort, setMeasureTooShort] = useState<boolean>(false);
  const [measuredWpm, setMeasuredWpm] = useState<number | null>(null);
  const measureStartRef = useRef<number | null>(null);
  const measureIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Copy Feedback
  const [copied, setCopied] = useState<boolean>(false);

  // Sync target duration when switching to timer tab or calculating speech
  const updateTargetFromWords = useCallback((w: number, wpmRate: number) => {
    const res = calculateSpeechTime(w, {
      wpm: wpmRate,
      pauseBufferPercent: pauseBuffer,
      slidesCount,
      secPerSlide,
    });
    setTimerTargetSec(res.totalSeconds || 60);
  }, [pauseBuffer, slidesCount, secPerSlide]);

  // Words count for pasted text
  const pastedWordsCount = useMemo(() => {
    if (!pastedText.trim()) return 0;
    return countWords(pastedText);
  }, [pastedText]);

  // Active word count based on tab
  const effectiveWords = activeTab === 'pasteText' ? pastedWordsCount : words;

  // Reading time calculations
  const silentResult = useMemo(
    () => calculateSpeechTime(effectiveWords, { wpm: silentWpm, pauseBufferPercent: pauseBuffer }),
    [effectiveWords, silentWpm, pauseBuffer]
  );

  const aloudResult = useMemo(
    () => calculateSpeechTime(effectiveWords, { wpm: aloudWpm, pauseBufferPercent: pauseBuffer }),
    [effectiveWords, aloudWpm, pauseBuffer]
  );

  const presentationResult = useMemo(
    () =>
      calculateSpeechTime(effectiveWords, {
        wpm: presentationWpm,
        pauseBufferPercent: pauseBuffer,
        slidesCount,
        secPerSlide,
      }),
    [effectiveWords, presentationWpm, pauseBuffer, slidesCount, secPerSlide]
  );

  const slowResult = useMemo(
    () =>
      calculateSpeechTime(effectiveWords, {
        wpm: slowWpm,
        pauseBufferPercent: pauseBuffer,
        slidesCount,
        secPerSlide,
      }),
    [effectiveWords, slowWpm, pauseBuffer, slidesCount, secPerSlide]
  );

  // Speech length words needed
  const speechWordsNeeded = useMemo(() => {
    return {
      presentation: calculateWordsNeeded(speechMinutes, presentationWpm),
      slow: calculateWordsNeeded(speechMinutes, slowWpm),
      conversational: calculateWordsNeeded(speechMinutes, conversationalWpm),
      aloud: calculateWordsNeeded(speechMinutes, aloudWpm),
    };
  }, [speechMinutes, presentationWpm, slowWpm, conversationalWpm, aloudWpm]);

  // Speech table
  const speechTableData: SpeechTableRow[] = useMemo(() => {
    return generateSpeechTable(undefined, {
      slow: slowWpm,
      presentation: presentationWpm,
      conversational: conversationalWpm,
      aloud: aloudWpm,
    });
  }, [slowWpm, presentationWpm, conversationalWpm, aloudWpm]);

  // Per-paragraph breakdown for paste tab
  const paragraphBreakdown = useMemo(() => {
    if (!pastedText.trim()) return [];
    const paras = pastedText.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    return paras.map((p, idx) => {
      const pWords = countWords(p);
      const pTime = calculateSpeechTime(pWords, { wpm: presentationWpm });
      return {
        id: idx + 1,
        snippet: p.trim().slice(0, 75) + (p.trim().length > 75 ? '...' : ''),
        words: pWords,
        timing: pTime.formatted,
      };
    });
  }, [pastedText, presentationWpm]);

  const handleTab = (next: ActiveTab) => {
    setActiveTab(next);
    if (next === 'practiceTimer' && timerElapsedSec === 0) updateTargetFromWords(words, presentationWpm);
  };

  // Stop the pace clock when the page unmounts
  useEffect(
    () => () => {
      if (measureIntervalRef.current) clearInterval(measureIntervalRef.current);
    },
    []
  );

  // Practice Timer handlers
  useEffect(() => {
    if (isTimerRunning) {
      // Wall clock, so a throttled background tab does not lose time
      const startedAt = Date.now() - timerElapsedRef.current * 1000;
      timerIntervalRef.current = setInterval(() => {
        timerElapsedRef.current = Math.floor((Date.now() - startedAt) / 1000);
        setTimerElapsedSec(timerElapsedRef.current);
      }, 250);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  const handleStartPauseTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    timerElapsedRef.current = 0;
    setTimerElapsedSec(0);
  };

  // Keyboard shortcut for practice timer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'practiceTimer') return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLButtonElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsTimerRunning((prev) => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleResetTimer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  // Measure Pace handlers
  const handleStartMeasure = () => {
    setIsMeasuring(true);
    setMeasuredWpm(null);
    setMeasureTooShort(false);
    setMeasureElapsedMs(0);
    measureStartRef.current = Date.now();
    measureIntervalRef.current = setInterval(() => {
      if (measureStartRef.current) {
        setMeasureElapsedMs(Date.now() - measureStartRef.current);
      }
    }, 100);
  };

  const handleFinishMeasure = () => {
    setIsMeasuring(false);
    if (measureIntervalRef.current) clearInterval(measureIntervalRef.current);
    const totalMs = measureStartRef.current ? Date.now() - measureStartRef.current : measureElapsedMs;
    setMeasureElapsedMs(totalMs);

    setMeasureTooShort(totalMs < 5000);
    const wpm = calculatePaceWpm(SAMPLE_PASSAGE_WORD_COUNT, totalMs);
    setMeasuredWpm(wpm);
  };

  const handleApplyMeasuredPace = (mode: 'silent' | 'aloud') => {
    if (measuredWpm && measuredWpm > 0) {
      if (mode === 'silent') {
        setSilentWpm(measuredWpm);
      } else {
        setAloudWpm(measuredWpm);
        setPresentationWpm(measuredWpm);
      }
      setActiveTab('wordsToTime');
    }
  };

  // Copy shareable summary
  const handleCopySummary = async () => {
    const summary =
      activeTab === 'speechLength'
        ? `${speechMinutes} minute speech: ${speechWordsNeeded.presentation} words (presentation pace at ${presentationWpm} wpm). Generated by KKCTools Reading Time Calculator.`
        : `${effectiveWords.toLocaleString('en-US')} words: Silent read ≈ ${silentResult.formatted} (${silentResult.minRead} min read), Presentation ≈ ${presentationResult.formatted}. Generated by KKCTools.`;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // StatTiles items for Tab 1 / Tab 3
  const statItems: StatTileItem[] = [
    {
      id: 'presentation',
      label: 'Presentation',
      value: presentationResult.formatted,
      sublabel: `Range: ${presentationResult.rangeLowFormatted} – ${presentationResult.rangeHighFormatted}`,
      highlight: true,
    },
    {
      id: 'silent',
      label: 'Silent Reading',
      value: silentResult.formatted,
      sublabel: `${silentResult.minRead} min read • ${silentWpm} wpm (estimate)`,
    },
    {
      id: 'aloud',
      label: 'Reading Aloud',
      value: aloudResult.formatted,
      sublabel: `${aloudWpm} wpm (estimate)`,
    },
    {
      id: 'slow',
      label: 'Slow / Keynote',
      value: slowResult.formatted,
      sublabel: `${slowWpm} wpm (example pace)`,
    },
  ];

  // StatTiles for Tab 2 (Speech Length)
  const speechStatItems: StatTileItem[] = [
    {
      id: 'speech-presentation',
      label: 'Presentation Pace',
      value: `${speechWordsNeeded.presentation.toLocaleString('en-US')} words`,
      sublabel: `${presentationWpm} wpm (example pace)`,
      highlight: true,
    },
    {
      id: 'speech-slow',
      label: 'Slow / Keynote',
      value: `${speechWordsNeeded.slow.toLocaleString('en-US')} words`,
      sublabel: `${slowWpm} wpm (example pace)`,
    },
    {
      id: 'speech-conversational',
      label: 'Conversational',
      value: `${speechWordsNeeded.conversational.toLocaleString('en-US')} words`,
      sublabel: `${conversationalWpm} wpm (example pace)`,
    },
    {
      id: 'speech-aloud',
      label: 'Reading Aloud',
      value: `${speechWordsNeeded.aloud.toLocaleString('en-US')} words`,
      sublabel: `${aloudWpm} wpm (estimate)`,
    },
  ];

  // Timer calculations
  const timerRadius = 70;
  const timerCircumference = 2 * Math.PI * timerRadius;
  const timerProgressRatio = timerTargetSec > 0 ? Math.min(timerElapsedSec / timerTargetSec, 1) : 0;
  const timerStrokeDashoffset = timerCircumference * (1 - timerProgressRatio);
  const isOverrun = timerElapsedSec > timerTargetSec;

  return (
    <div className={styles.container}>
      {/* Visual Input Guide */}
      <ReadingTimeInputGuide
        focusedField={focusedField}
        activeTab={activeTab}
        words={effectiveWords}
        minutes={speechMinutes}
        silentTime={silentResult.formatted}
        aloudTime={aloudResult.formatted}
        presentationTime={presentationResult.formatted}
        slowTime={slowResult.formatted}
        pauseBuffer={pauseBuffer}
      />

      {/* Mode Navigation Tabs */}
      <TabSlider tabs={TABS} activeId={activeTab} onChange={handleTab} ariaLabel="Reading time modes" />

      <div className={styles.actionRow} style={{ justifyContent: 'flex-end' }}>
        <button className={styles.btnSecondary} onClick={handleCopySummary}>
          {copied ? '✓ Copied Summary' : '📋 Copy Summary'}
        </button>
      </div>

      {/* Tab 1: Words to Time */}
      {activeTab === 'wordsToTime' && (
        <div className={styles.card}>
          <div className={styles.field}>
            <label htmlFor="word-count-input" className={styles.label}>
              1. Word Count
            </label>
            <input
              id="word-count-input"
              type="number"
              min={1}
              max={1000000}
              value={words}
              onFocus={() => setFocusedField('words')}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setWords(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className={styles.input}
              placeholder="e.g. 1000"
            />
            <div className={styles.quickPills}>
              {[50, 100, 300, 500, 1000, 2000, 5000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`${styles.pillBtn} ${words === preset ? styles.pillBtnActive : ''}`}
                  onClick={() => setWords(preset)}
                >
                  {preset.toLocaleString('en-US')} w
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Speeds & Buffer */}
          <details className={styles.detailsAccordion}>
            <summary className={styles.detailsSummary}>⚙️ Customize Speaking Rates &amp; Pause Buffer</summary>
            <div className={styles.advancedGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Presentation (WPM)</label>
                <input
                  type="number"
                  min={60}
                  max={300}
                  value={presentationWpm}
                  onFocus={() => setFocusedField('presentation')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setPresentationWpm(parseInt(e.target.value, 10) || 130)}
                  className={styles.input}
                />
                <span className={styles.fieldHint}>Example pace, edit</span>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Silent Reading (WPM)</label>
                <input
                  type="number"
                  min={100}
                  max={600}
                  value={silentWpm}
                  onFocus={() => setFocusedField('silent')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setSilentWpm(parseInt(e.target.value, 10) || 238)}
                  className={styles.input}
                />
                <span className={styles.fieldHint}>≈ 238 (published estimate, being verified)</span>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Reading Aloud (WPM)</label>
                <input
                  type="number"
                  min={80}
                  max={300}
                  value={aloudWpm}
                  onFocus={() => setFocusedField('aloud')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setAloudWpm(parseInt(e.target.value, 10) || 183)}
                  className={styles.input}
                />
                <span className={styles.fieldHint}>≈ 183 (published estimate, being verified)</span>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Slow Speech (WPM)</label>
                <input
                  type="number"
                  min={60}
                  max={250}
                  value={slowWpm}
                  onFocus={() => setFocusedField('slow')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setSlowWpm(parseInt(e.target.value, 10) || 110)}
                  className={styles.input}
                />
                <span className={styles.fieldHint}>Example pace, edit</span>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Conversational (WPM)</label>
                <input
                  type="number"
                  min={80}
                  max={300}
                  value={conversationalWpm}
                  onChange={(e) => setConversationalWpm(parseInt(e.target.value, 10) || 150)}
                  className={styles.input}
                />
                <span className={styles.fieldHint}>Example pace, edit</span>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Pause Buffer (%)</label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={pauseBuffer}
                  onChange={(e) => setPauseBuffer(Math.min(30, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                  className={styles.input}
                />
                <span className={styles.fieldHint}>Audience laughter &amp; pauses (0–30%)</span>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Slides Count</label>
                <input
                  type="number"
                  min={0}
                  max={200}
                  value={slidesCount}
                  onChange={(e) => setSlidesCount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className={styles.input}
                />
                <span className={styles.fieldHint}>Slide transitions</span>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Seconds Per Slide</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={secPerSlide}
                  onChange={(e) => setSecPerSlide(Math.max(1, parseInt(e.target.value, 10) || 5))}
                  className={styles.input}
                />
                <span className={styles.fieldHint}>Slide transition lag</span>
              </div>
            </div>
          </details>

          {/* Results Grid */}
          <div style={{ marginTop: '16px' }}>
            <StatTiles stats={statItems} columns={4} />
          </div>

          <div className={styles.summaryCallout} style={{ marginTop: '12px' }}>
            <strong>{words.toLocaleString('en-US')} words</strong> takes about{' '}
            <strong>{silentResult.minutes} minutes {silentResult.seconds} seconds</strong> to read silently and about{' '}
            <strong>{presentationResult.minutes} minutes {presentationResult.seconds} seconds</strong> to deliver as a presentation.
            <div className={styles.rangeNote}>
              Page yield estimate: ≈ {(words / 500).toFixed(1)} pages single-spaced or {(words / 250).toFixed(1)} pages double-spaced.
              {' '}<Link href="/words-to-pages/" style={{ color: 'var(--cat-writing)', textDecoration: 'underline' }}>View full page calculation →</Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Speech Length (Minutes to Words) */}
      {activeTab === 'speechLength' && (
        <div className={styles.card}>
          <div className={styles.field}>
            <label htmlFor="speech-minutes-input" className={styles.label}>
              Speech Duration (Minutes)
            </label>
            <input
              id="speech-minutes-input"
              type="number"
              min={1}
              max={180}
              value={speechMinutes}
              onChange={(e) => setSpeechMinutes(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className={styles.input}
            />
            <div className={styles.quickPills}>
              {[1, 2, 3, 4, 5, 7, 10, 15, 20, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  className={`${styles.pillBtn} ${speechMinutes === mins ? styles.pillBtnActive : ''}`}
                  onClick={() => setSpeechMinutes(mins)}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <StatTiles stats={speechStatItems} columns={4} />
          </div>

          <div className={styles.summaryCallout} style={{ marginTop: '12px' }}>
            For a <strong>{speechMinutes}-minute speech</strong> at {presentationWpm} words per minute, prepare about{' '}
            <strong>{speechWordsNeeded.presentation.toLocaleString('en-US')} words</strong>.
            <div className={styles.rangeNote}>
              At 500 words per single-spaced page (a common convention), that is about{' '}
              {(speechWordsNeeded.presentation / 500).toFixed(1)} typed pages single-spaced or{' '}
              {(speechWordsNeeded.presentation / 250).toFixed(1)} pages double-spaced.
            </div>
          </div>

          {/* Printable Reference Table */}
          <div style={{ marginTop: '16px' }}>
            <div className={styles.actionRow} style={{ marginBottom: '8px' }}>
              <span className={styles.label}>Speech Words Reference Table (1 to 60 Minutes)</span>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => window.print()}
              >
                🖨️ Print Speech Reference
              </button>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Duration</th>
                    <th>Slow ({slowWpm} wpm)</th>
                    <th>Presentation ({presentationWpm} wpm)</th>
                    <th>Conversational ({conversationalWpm} wpm)</th>
                    <th>Reading Aloud ({aloudWpm} wpm)</th>
                  </tr>
                </thead>
                <tbody>
                  {speechTableData.map((row) => (
                    <tr
                      key={row.minutes}
                      className={row.minutes === speechMinutes ? styles.highlightRow : undefined}
                    >
                      <td>{row.minutes} {row.minutes === 1 ? 'minute' : 'minutes'}</td>
                      <td>{row.slow.toLocaleString('en-US')} w</td>
                      <td><strong>{row.presentation.toLocaleString('en-US')} w</strong></td>
                      <td>{row.conversational.toLocaleString('en-US')} w</td>
                      <td>{row.aloud.toLocaleString('en-US')} w</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Paste Text */}
      {activeTab === 'pasteText' && (
        <div className={styles.card}>
          <TextInputPanel
            value={livePastedText}
            onChange={setPastedText}
            label="Paste Your Speech, Article or Script"
            placeholder="Paste text here to compute real-time reading duration, speaking tempo, and per-paragraph timings..."
            rows={7}
          />

          <div style={{ marginTop: '16px' }}>
            <StatTiles stats={statItems} columns={4} />
          </div>

          {paragraphBreakdown.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <span className={styles.label}>Per-Paragraph Speaking Breakdown</span>
              <div className={styles.paragraphBreakdown}>
                {paragraphBreakdown.map((item) => (
                  <div key={item.id} className={styles.paragraphItem}>
                    <span className={styles.paragraphText}>
                      <strong>¶{item.id}:</strong> {item.snippet}
                    </span>
                    <span className={styles.paragraphTiming}>
                      {item.words} w • {item.timing}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Practice Timer */}
      {activeTab === 'practiceTimer' && (
        <div className={`${styles.card} ${styles.timerCard}`}>
          <div className={styles.actionRow} style={{ width: '100%', justifyContent: 'center' }}>
            <div className={styles.field} style={{ maxWidth: '200px' }}>
              <label className={styles.label}>Target Time (Seconds)</label>
              <input
                type="number"
                min={10}
                max={7200}
                value={timerTargetSec}
                onChange={(e) => setTimerTargetSec(Math.max(10, parseInt(e.target.value, 10) || 60))}
                className={styles.input}
              />
            </div>
          </div>

          {/* Circular Progress Ring */}
          <div className={styles.dialWrapper}>
            <svg className={styles.dialSvg} viewBox="0 0 160 160">
              <circle cx="80" cy="80" r={timerRadius} className={styles.dialBg} />
              <circle
                cx="80"
                cy="80"
                r={timerRadius}
                className={`${styles.dialProgress} ${isOverrun ? styles.dialOverrun : ''}`}
                strokeDasharray={timerCircumference}
                strokeDashoffset={timerStrokeDashoffset}
              />
            </svg>
            <div className={styles.dialCenter}>
              <span className={styles.dialDigits}>{formatDuration(timerElapsedSec)}</span>
              <span className={styles.dialTarget}>Target: {formatDuration(timerTargetSec)}</span>
            </div>
          </div>

          {isOverrun && (
            <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.875rem' }}>
              ⚠️ Target Exceeded by {formatDuration(timerElapsedSec - timerTargetSec)}! Shorten pauses or edit content.
            </div>
          )}

          <div className={styles.timerControls}>
            <button type="button" className={styles.btnPrimary} onClick={handleStartPauseTimer}>
              {isTimerRunning ? '⏸️ Pause (Space)' : '▶️ Start Practice (Space)'}
            </button>
            <button type="button" className={styles.btnSecondary} onClick={handleResetTimer}>
              🔄 Reset (R)
            </button>
          </div>

          <span className={styles.fieldHint}>
            Rehearse aloud. Shortcuts: <code>Space</code> to Start/Pause, <code>R</code> to Reset.
          </span>
        </div>
      )}

      {/* Tab 5: Measure My Pace */}
      {activeTab === 'measurePace' && (
        <div className={styles.card}>
          <div className={styles.field}>
            <span className={styles.label}>Benchmark Calibration Passage ({SAMPLE_PASSAGE_WORD_COUNT} words)</span>
            <div className={styles.passageCard}>
              {SAMPLE_CALIBRATION_PASSAGE}
            </div>
          </div>

          <div className={styles.actionRow} style={{ marginTop: '12px' }}>
            {!isMeasuring ? (
              <button type="button" className={styles.btnPrimary} onClick={handleStartMeasure}>
                ▶️ Start Reading Test
              </button>
            ) : (
              <button type="button" className={styles.btnPrimary} style={{ background: '#10b981' }} onClick={handleFinishMeasure}>
                ⏹️ I&apos;m Done Reading! (Elapsed: {(measureElapsedMs / 1000).toFixed(1)}s)
              </button>
            )}
            <span className={styles.fieldHint}>
              Read at your natural, comfortable pace — whether silently or aloud.
            </span>
          </div>

          {(measuredWpm !== null || measureTooShort) && (
            <div style={{ marginTop: '16px' }}>
              {measureTooShort ? (
                <div className={styles.summaryCallout} style={{ borderColor: '#ef4444' }}>
                  ⚠️ Test was under 5 seconds! Please read the full passage naturally and retry for an accurate measurement.
                </div>
              ) : (
                <div className={styles.paceResultBadge}>
                  <div>
                    <span>Your Measured Speed: </span>
                    <strong>{measuredWpm} Words Per Minute</strong>
                    <div style={{ fontSize: '0.75rem', fontWeight: 400, marginTop: '2px' }}>
                      Completed {SAMPLE_PASSAGE_WORD_COUNT} words in {(measureElapsedMs / 1000).toFixed(1)} seconds.
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button type="button" className={styles.btnPrimary} onClick={() => handleApplyMeasuredPace('silent')}>
                      I read silently: use it
                    </button>
                    <button type="button" className={styles.btnPrimary} onClick={() => handleApplyMeasuredPace('aloud')}>
                      I read aloud: use it
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
