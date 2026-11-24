/**
 * Reading & Speaking Time engine.
 * Pure mathematical functions for calculating duration, words needed, buffer adjustments,
 * speech tables, personal pace measurement, and an injectable timer reducer.
 */

export const DEFAULT_SILENT_WPM = 238;
export const DEFAULT_FICTION_WPM = 260;
export const DEFAULT_ALOUD_WPM = 183;
export const DEFAULT_PRESENTATION_WPM = 130;
export const DEFAULT_SLOW_SPEECH_WPM = 110;
export const DEFAULT_CONVERSATIONAL_WPM = 150;

export interface SpeechTimeOptions {
  wpm?: number;
  pauseBufferPercent?: number; // 0 to 30%
  slidesCount?: number;
  secPerSlide?: number;
}

export interface SpeechTimeResult {
  baseMinutes: number;
  totalMinutes: number;
  totalSeconds: number;
  minutes: number;
  seconds: number;
  formatted: string; // m:ss (or mm:ss)
  rangeLowFormatted: string; // -15%
  rangeHighFormatted: string; // +15%
  minRead: number; // ceil(minutes)
}

export interface SpeechTableRow {
  minutes: number;
  slow: number; // 110 wpm
  presentation: number; // 130 wpm
  conversational: number; // 150 wpm
  aloud: number; // 183 wpm
}

export const DEFAULT_SPEECH_MINUTES: number[] = [1, 2, 3, 4, 5, 7, 10, 15, 20, 30, 45, 60];

/**
 * Formats seconds into "m:ss" (e.g. 250s -> "4:10", 13s -> "0:13").
 */
export function formatDuration(totalSeconds: number): string {
  const rounded = Math.max(0, Math.round(totalSeconds));
  const mins = Math.floor(rounded / 60);
  const secs = rounded % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculates time for a given word count and options:
 * minutes = words / wpm
 * total = minutes * (1 + pause) + slides * secPerSlide / 60
 */
export function calculateSpeechTime(words: number, options: SpeechTimeOptions = {}): SpeechTimeResult {
  const {
    wpm = DEFAULT_PRESENTATION_WPM,
    pauseBufferPercent = 0,
    slidesCount = 0,
    secPerSlide = 0,
  } = options;

  if (words <= 0 || isNaN(words)) {
    return {
      baseMinutes: 0,
      totalMinutes: 0,
      totalSeconds: 0,
      minutes: 0,
      seconds: 0,
      formatted: '0:00',
      rangeLowFormatted: '0:00',
      rangeHighFormatted: '0:00',
      minRead: 0,
    };
  }

  const safeWpm = wpm > 0 ? wpm : DEFAULT_PRESENTATION_WPM;
  const baseMinutes = words / safeWpm;
  const pauseFactor = 1 + Math.max(0, pauseBufferPercent) / 100;
  const slideMinutes = (Math.max(0, slidesCount) * Math.max(0, secPerSlide)) / 60;

  const totalMinutes = baseMinutes * pauseFactor + slideMinutes;
  const totalSeconds = Math.round(totalMinutes * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const rangeLowSeconds = Math.round(totalMinutes * 0.85 * 60);
  const rangeHighSeconds = Math.round(totalMinutes * 1.15 * 60);

  return {
    baseMinutes,
    totalMinutes,
    totalSeconds,
    minutes,
    seconds,
    formatted: formatDuration(totalSeconds),
    rangeLowFormatted: formatDuration(rangeLowSeconds),
    rangeHighFormatted: formatDuration(rangeHighSeconds),
    minRead: Math.max(1, Math.ceil(baseMinutes)),
  };
}

/**
 * Reverse calculation: words needed for a speech of M minutes at WPM pace.
 * wordsNeeded = minutes * wpm
 */
export function calculateWordsNeeded(minutes: number, wpm: number): number {
  if (minutes <= 0 || wpm <= 0) return 0;
  return Math.round(minutes * wpm);
}

/**
 * Generates the full reference speech table (minutes to words needed).
 */
export function generateSpeechTable(
  minutesList: number[] = DEFAULT_SPEECH_MINUTES,
  paces = {
    slow: DEFAULT_SLOW_SPEECH_WPM,
    presentation: DEFAULT_PRESENTATION_WPM,
    conversational: DEFAULT_CONVERSATIONAL_WPM,
    aloud: DEFAULT_ALOUD_WPM,
  }
): SpeechTableRow[] {
  return minutesList.map((mins) => ({
    minutes: mins,
    slow: calculateWordsNeeded(mins, paces.slow),
    presentation: calculateWordsNeeded(mins, paces.presentation),
    conversational: calculateWordsNeeded(mins, paces.conversational),
    aloud: calculateWordsNeeded(mins, paces.aloud),
  }));
}

/**
 * Measures personal reading/speaking pace from reading a sample passage.
 * wpm = sampleWords / (elapsedMs / 60000)
 * Returns null if elapsed time is less than 5 seconds (insufficient test duration).
 */
export function calculatePaceWpm(words: number, elapsedMs: number): number | null {
  if (words <= 0 || elapsedMs < 5000) {
    return null;
  }
  const minutes = elapsedMs / 60000;
  return Math.round(words / minutes);
}

// -------------------------------------------------------------
// Pure Timer Reducer with Injectable Clock
// -------------------------------------------------------------

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

export interface TimerState {
  status: TimerStatus;
  elapsedMs: number;
  targetMs: number;
}

export type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'TICK'; deltaMs: number }
  | { type: 'SET_TARGET'; targetMs: number };

export const initialTimerState: TimerState = {
  status: 'idle',
  elapsedMs: 0,
  targetMs: 300000, // default 5 minutes
};

export function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'START':
      if (state.status === 'running' || state.status === 'finished') return state;
      return { ...state, status: 'running' };

    case 'PAUSE':
      if (state.status !== 'running') return state;
      return { ...state, status: 'paused' };

    case 'RESET':
      return { ...state, status: 'idle', elapsedMs: 0 };

    case 'TICK': {
      if (state.status !== 'running') return state;
      const nextElapsed = state.elapsedMs + Math.max(0, action.deltaMs);
      if (state.targetMs > 0 && nextElapsed >= state.targetMs) {
        return { ...state, elapsedMs: state.targetMs, status: 'finished' };
      }
      return { ...state, elapsedMs: nextElapsed };
    }

    case 'SET_TARGET':
      return { ...state, targetMs: Math.max(0, action.targetMs) };

    default:
      return state;
  }
}
