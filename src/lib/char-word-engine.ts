/**
 * Characters to Words estimation and calibration engine.
 * Pure mathematical functions for converting between character counts and word counts.
 */

import { countGraphemes, charsNoSpaces, countWords } from './text-engine';

export const DEFAULT_AVERAGE_WORD_LENGTH = 4.7;
export const DEFAULT_PUNCTUATION_ALLOWANCE = 0;

export interface CharWordOptions {
  countSpaces?: boolean;
  avgLetters?: number;
  punctuation?: number;
}

export interface EstimateResult {
  words: number;
  wordsFormatted: string;
  rangeLow: number;
  rangeHigh: number;
  rangeFormatted: string;
  perWordUsed: number;
}

export interface ReverseResult {
  characters: number;
  charactersFormatted: string;
  perWordUsed: number;
}

export interface CharWordTableRow {
  chars: number;
  withSpaces: {
    est: number;
    low: number;
    high: number;
  };
  withoutSpaces: {
    est: number;
    low: number;
    high: number;
  };
}

export const CHAR_WORD_TABLE_COUNTS: number[] = [
  100, 150, 200, 250, 280, 500, 650, 750, 1000, 1200, 1500, 2000, 2500, 3000, 3500, 4000, 5000, 5300, 10000,
];

/**
 * Calculates effective characters per word:
 * perWord = L + (spaces ? 1 : 0) + p
 */
export function getEffectivePerWord(options: CharWordOptions = {}): number {
  const { countSpaces = true, avgLetters = DEFAULT_AVERAGE_WORD_LENGTH, punctuation = DEFAULT_PUNCTUATION_ALLOWANCE } =
    options;
  const L = avgLetters > 0 ? avgLetters : DEFAULT_AVERAGE_WORD_LENGTH;
  const s = countSpaces ? 1 : 0;
  const p = punctuation >= 0 ? punctuation : 0;
  return L + s + p;
}

/**
 * Converts character count to estimated word count and ±1 variance range.
 * Range: [chars / (perWord + 1), chars / (perWord - 1)] with guard for perWord - 1 > 0.
 */
export function calculateWordsFromChars(chars: number, options: CharWordOptions = {}): EstimateResult {
  if (chars <= 0 || isNaN(chars)) {
    return {
      words: 0,
      wordsFormatted: '0',
      rangeLow: 0,
      rangeHigh: 0,
      rangeFormatted: '0–0',
      perWordUsed: getEffectivePerWord(options),
    };
  }

  const perWord = getEffectivePerWord(options);
  const wordsRaw = chars / perWord;
  const words = Math.round(wordsRaw);

  const lowDenominator = perWord + 1;
  const highDenominator = Math.max(0.1, perWord - 1);

  const rangeLow = Math.round(chars / lowDenominator);
  const rangeHigh = Math.round(chars / highDenominator);

  return {
    words,
    wordsFormatted: words.toLocaleString('en-US'),
    rangeLow,
    rangeHigh,
    rangeFormatted: `${rangeLow.toLocaleString('en-US')}–${rangeHigh.toLocaleString('en-US')}`,
    perWordUsed: perWord,
  };
}

/**
 * Reverse conversion: words to estimated characters.
 * chars = words * perWord
 */
export function calculateCharsFromWords(words: number, options: CharWordOptions = {}): ReverseResult {
  if (words <= 0 || isNaN(words)) {
    return {
      characters: 0,
      charactersFormatted: '0',
      perWordUsed: getEffectivePerWord(options),
    };
  }

  const perWord = getEffectivePerWord(options);
  const chars = Math.round(words * perWord);

  return {
    characters: chars,
    charactersFormatted: chars.toLocaleString('en-US'),
    perWordUsed: perWord,
  };
}

export interface WritingCalibration {
  avgLettersPerWord: number;
  charsWithSpacesPerWord: number;
  totalCharsWithSpaces: number;
  totalCharsNoSpaces: number;
  totalWords: number;
}

/**
 * Measures the user's actual writing statistics from pasted text.
 */
export function measureWritingAverages(text: string): WritingCalibration | null {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const words = countWords(text);
  if (words <= 0) {
    return null;
  }

  const totalCharsWithSpaces = countGraphemes(text);
  const totalCharsNoSpaces = charsNoSpaces(text);

  const avgLettersPerWord = totalCharsNoSpaces / words;
  const charsWithSpacesPerWord = totalCharsWithSpaces / words;

  return {
    avgLettersPerWord: Math.round(avgLettersPerWord * 10) / 10,
    charsWithSpacesPerWord: Math.round(charsWithSpacesPerWord * 10) / 10,
    totalCharsWithSpaces,
    totalCharsNoSpaces,
    totalWords: words,
  };
}

/**
 * Generates the full static/dynamic reference table for characters to words.
 */
export function generateCharWordTable(options: { avgLetters?: number; punctuation?: number } = {}): CharWordTableRow[] {
  const { avgLetters = DEFAULT_AVERAGE_WORD_LENGTH, punctuation = DEFAULT_PUNCTUATION_ALLOWANCE } = options;

  return CHAR_WORD_TABLE_COUNTS.map((chars) => {
    const withSpacesRes = calculateWordsFromChars(chars, {
      countSpaces: true,
      avgLetters,
      punctuation,
    });

    const withoutSpacesRes = calculateWordsFromChars(chars, {
      countSpaces: false,
      avgLetters,
      punctuation,
    });

    return {
      chars,
      withSpaces: {
        est: withSpacesRes.words,
        low: withSpacesRes.rangeLow,
        high: withSpacesRes.rangeHigh,
      },
      withoutSpaces: {
        est: withoutSpacesRes.words,
        low: withoutSpacesRes.rangeLow,
        high: withoutSpacesRes.rangeHigh,
      },
    };
  });
}
