/**
 * Sentence Statistics and Paragraph Analysis Engine.
 * Builds on shared extractSentences() to compute sentence word counts,
 * mean, median, length histogram, long sentence threshold detection,
 * and per-paragraph breakdown with plain-language guideline flags (>150w, >250w).
 */

import { extractSentences, countWords, countGraphemes } from './text-engine';

export interface SentenceItem {
  id: number;
  text: string;
  words: number;
  isLong: boolean;
}

export interface SentenceHistogram {
  bucket1_10: number;
  bucket11_20: number;
  bucket21_30: number;
  bucket31_40: number;
  bucket41Plus: number;
}

export interface SentenceStats {
  sentences: SentenceItem[];
  totalSentences: number;
  wordsPerSentence: number[];
  meanWords: number;
  medianWords: number;
  minWords: number;
  maxWords: number;
  histogram: SentenceHistogram;
  longSentencesCount: number;
}

export interface ParagraphItem {
  id: number;
  text: string;
  words: number;
  sentences: number;
  chars: number;
  flag150: boolean;
  flag250: boolean;
}

/**
 * Calculates sentence length statistics: mean, median, min, max, histogram.
 */
export function calculateSentenceStats(
  text: string,
  options: {
    threshold?: number;
    abbreviations?: ReadonlySet<string>;
    listLines?: boolean;
  } = {}
): SentenceStats {
  const { threshold = 25, abbreviations, listLines } = options;
  const sentenceTexts = extractSentences(text, { abbreviations, listLines });

  if (sentenceTexts.length === 0) {
    return {
      sentences: [],
      totalSentences: 0,
      wordsPerSentence: [],
      meanWords: 0,
      medianWords: 0,
      minWords: 0,
      maxWords: 0,
      histogram: {
        bucket1_10: 0,
        bucket11_20: 0,
        bucket21_30: 0,
        bucket31_40: 0,
        bucket41Plus: 0,
      },
      longSentencesCount: 0,
    };
  }

  const histogram: SentenceHistogram = {
    bucket1_10: 0,
    bucket11_20: 0,
    bucket21_30: 0,
    bucket31_40: 0,
    bucket41Plus: 0,
  };

  const sentences: SentenceItem[] = [];
  const wordsCounts: number[] = [];
  let longCount = 0;

  for (let i = 0; i < sentenceTexts.length; i++) {
    const sText = sentenceTexts[i].trim();
    const wCount = countWords(sText);
    const isLong = wCount > threshold;

    if (isLong) longCount++;
    wordsCounts.push(wCount);

    sentences.push({
      id: i + 1,
      text: sText,
      words: wCount,
      isLong,
    });

    if (wCount <= 10) histogram.bucket1_10++;
    else if (wCount <= 20) histogram.bucket11_20++;
    else if (wCount <= 30) histogram.bucket21_30++;
    else if (wCount <= 40) histogram.bucket31_40++;
    else histogram.bucket41Plus++;
  }

  // Mean
  const sum = wordsCounts.reduce((acc, curr) => acc + curr, 0);
  const meanWords = parseFloat((sum / wordsCounts.length).toFixed(1));

  // Median
  const sorted = [...wordsCounts].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const medianWords =
    sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

  const minWords = sorted[0];
  const maxWords = sorted[sorted.length - 1];

  return {
    sentences,
    totalSentences: sentences.length,
    wordsPerSentence: wordsCounts,
    meanWords,
    medianWords,
    minWords,
    maxWords,
    histogram,
    longSentencesCount: longCount,
  };
}

/**
 * Splits text into paragraphs and analyzes each paragraph's words, sentences, and guideline flags.
 */
export function analyzeParagraphs(
  text: string,
  mode: 'blankLine' | 'everyLine' = 'blankLine',
  options: { abbreviations?: ReadonlySet<string>; listLines?: boolean } = {}
): ParagraphItem[] {
  if (!text.trim()) return [];

  let rawParas: string[] = [];
  if (mode === 'everyLine') {
    rawParas = text.split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0);
  } else {
    rawParas = text.replace(/\r\n?/g, '\n').split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  }

  return rawParas.map((paraText, idx) => {
    const trimmed = paraText.trim();
    const w = countWords(trimmed);
    const s = extractSentences(trimmed, options).length;
    const c = countGraphemes(trimmed);

    return {
      id: idx + 1,
      text: trimmed,
      words: w,
      sentences: s,
      chars: c,
      flag150: w > 150,
      flag250: w > 250,
    };
  });
}
