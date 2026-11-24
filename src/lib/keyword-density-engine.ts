import { extractWords, extractSentences } from './text-engine';
import { STOP_WORDS_EN } from '@/data/stop-words-en';

export interface KeywordDensityOptions {
  caseSensitive?: boolean;
  ignoreStopWords?: boolean;
  stopWords?: ReadonlySet<string>;
  groupVariants?: boolean;
  minFrequency?: number;
  targetPhrase?: string;
}

export interface NgramTableRow {
  term: string;
  count: number;
  density: number; // occurrences / totalWords * 100
  share: number; // occurrences * n / totalWords * 100
}

export interface KwicMatch {
  before: string;
  match: string;
  after: string;
  wordIndex: number; // 1-based index
}

export interface TargetAnalysis {
  phrase: string;
  count: number;
  density: number;
  share: number;
  firstPosition: number; // 1-based index or 0
  positions: number[]; // 1-based indices
  heat: number[]; // 10 buckets for deciles
  kwic: KwicMatch[];
}

export interface KeywordDensityReport {
  totalWords: number;
  uniqueWords: number;
  sentences: number;
  oneGrams: NgramTableRow[];
  twoGrams: NgramTableRow[];
  threeGrams: NgramTableRow[];
  topWord: NgramTableRow | null;
  topTwoGram: NgramTableRow | null;
  targetAnalysis: TargetAnalysis | null;
}

/**
 * Lightweight English plural stemmer per Spec 10:
 * -ies -> -y (stories -> story)
 * -xes, -ches, -shes -> drop "es" (boxes -> box, watches -> watch, dishes -> dish)
 * -s -> drop "s" when stem >= 3 chars, except words ending in ss, us, is
 */
export function stemPlural(word: string): string {
  const lower = word.toLowerCase();
  // Never strip words ending in ss, us, is
  if (lower.endsWith('ss') || lower.endsWith('us') || lower.endsWith('is')) {
    return lower;
  }
  // -ies -> -y
  if (lower.endsWith('ies') && lower.length > 4) {
    return lower.slice(0, -3) + 'y';
  }
  // -xes, -ches, -shes -> drop "es"
  if (
    (lower.endsWith('xes') || lower.endsWith('ches') || lower.endsWith('shes')) &&
    lower.length > 4
  ) {
    return lower.slice(0, -2);
  }
  // -s -> "" when stem has >= 3 letters
  if (lower.endsWith('s') && !lower.endsWith('ss') && lower.length > 3) {
    return lower.slice(0, -1);
  }
  return lower;
}

/**
 * Analyzes keyword density and n-grams across 1-, 2-, and 3-word combinations.
 * N-grams are bounded within sentences (never cross sentence breaks).
 */
export function calculateKeywordDensity(
  text: string,
  options: KeywordDensityOptions = {}
): KeywordDensityReport {
  if (!text || !text.trim()) {
    return {
      totalWords: 0,
      uniqueWords: 0,
      sentences: 0,
      oneGrams: [],
      twoGrams: [],
      threeGrams: [],
      topWord: null,
      topTwoGram: null,
      targetAnalysis: null,
    };
  }

  const caseSensitive = options.caseSensitive ?? false;
  const ignoreStopWords = options.ignoreStopWords ?? true;
  const stopWords = options.stopWords || STOP_WORDS_EN;
  const groupVariants = options.groupVariants ?? false;
  const minFrequency = options.minFrequency ?? 2;
  const targetPhrase = options.targetPhrase?.trim() || '';

  // 1. Extract sentences with shared engine abbreviation handling
  const rawSentences = extractSentences(text);
  const sentenceList = rawSentences.length > 0 ? rawSentences : [text];

  // 2. Extract words per sentence so n-grams do not cross sentence boundaries
  const sentenceWords: string[][] = [];
  const allTokens: string[] = [];

  for (const sentence of sentenceList) {
    const words = extractWords(sentence);
    if (words.length > 0) {
      sentenceWords.push(words);
      for (const w of words) {
        allTokens.push(w);
      }
    }
  }

  const totalWords = allTokens.length;

  if (totalWords === 0) {
    return {
      totalWords: 0,
      uniqueWords: 0,
      sentences: 0,
      oneGrams: [],
      twoGrams: [],
      threeGrams: [],
      topWord: null,
      topTwoGram: null,
      targetAnalysis: null,
    };
  }

  // 3. Count unique words (case-normalized)
  const uniqueWordSet = new Set(allTokens.map((w) => w.toLowerCase()));
  const uniqueWords = uniqueWordSet.size;

  // Normalize a token for comparison/aggregation
  const normalizeToken = (token: string): string => {
    let t = caseSensitive ? token : token.toLowerCase();
    if (groupVariants) {
      t = stemPlural(t);
    }
    return t;
  };

  // Helper to build n-gram table
  const buildNgramTable = (n: number): NgramTableRow[] => {
    const freqMap = new Map<string, number>();

    for (const words of sentenceWords) {
      if (words.length < n) continue;

      for (let i = 0; i <= words.length - n; i++) {
        const slice = words.slice(i, i + n);
        const lowerSlice = slice.map((w) => w.toLowerCase());

        // Stop word filtering
        if (ignoreStopWords) {
          if (n === 1) {
            // 1-grams: drop if in stopWords
            if (stopWords.has(lowerSlice[0])) {
              continue;
            }
          } else {
            // 2- and 3-grams: drop if every word is a stop word, or starts/ends with a stop word
            const allStop = lowerSlice.every((w) => stopWords.has(w));
            const startStop = stopWords.has(lowerSlice[0]);
            const endStop = stopWords.has(lowerSlice[lowerSlice.length - 1]);
            if (allStop || startStop || endStop) {
              continue;
            }
          }
        }

        const normSlice = slice.map((w) => normalizeToken(w));
        const phrase = normSlice.join(' ');
        freqMap.set(phrase, (freqMap.get(phrase) || 0) + 1);
      }
    }

    const rows: NgramTableRow[] = [];
    for (const [term, count] of freqMap.entries()) {
      if (count >= minFrequency) {
        const density = Number(((count / totalWords) * 100).toFixed(2));
        const share = Number(((count * n / totalWords) * 100).toFixed(2));
        rows.push({ term, count, density, share });
      }
    }

    // Sort by count desc, then density desc, then alphabetically
    rows.sort((a, b) => b.count - a.count || b.density - a.density || a.term.localeCompare(b.term, 'en'));
    return rows;
  };

  const oneGrams = buildNgramTable(1);
  const twoGrams = buildNgramTable(2);
  const threeGrams = buildNgramTable(3);

  const topWord = oneGrams.length > 0 ? oneGrams[0] : null;
  const topTwoGram = twoGrams.length > 0 ? twoGrams[0] : null;

  // 4. Target keyword analysis
  let targetAnalysis: TargetAnalysis | null = null;
  if (targetPhrase) {
    const targetWords = extractWords(targetPhrase);
    if (targetWords.length > 0) {
      const normTarget = targetWords.map((w) => normalizeToken(w));
      const targetLen = normTarget.length;
      const positions: number[] = [];
      const heat = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const kwic: KwicMatch[] = [];

      // Word positions where a sentence starts: a phrase never crosses one.
      const sentenceStarts = new Set<number>();
      let offset = 0;
      for (const words of sentenceWords) {
        sentenceStarts.add(offset);
        offset += words.length;
      }

      for (let i = 0; i <= allTokens.length - targetLen; i++) {
        let match = true;
        for (let j = 0; j < targetLen; j++) {
          if ((j > 0 && sentenceStarts.has(i + j)) || normalizeToken(allTokens[i + j]) !== normTarget[j]) {
            match = false;
            break;
          }
        }

        if (match) {
          const wordIndex = i + 1; // 1-based
          positions.push(wordIndex);

          // Decile bucket (0 to 9)
          const decile = Math.min(9, Math.floor((i / totalWords) * 10));
          heat[decile]++;

          // KWIC: ±5 words around hit
          const beforeStart = Math.max(0, i - 5);
          const afterEnd = Math.min(allTokens.length, i + targetLen + 5);
          const before = allTokens.slice(beforeStart, i).join(' ');
          const matchedText = allTokens.slice(i, i + targetLen).join(' ');
          const after = allTokens.slice(i + targetLen, afterEnd).join(' ');

          kwic.push({
            before,
            match: matchedText,
            after,
            wordIndex,
          });
        }
      }

      const count = positions.length;
      const density = Number(((count / totalWords) * 100).toFixed(2));
      const share = Number(((count * targetLen / totalWords) * 100).toFixed(2));
      const firstPosition = positions.length > 0 ? positions[0] : 0;

      targetAnalysis = {
        phrase: targetPhrase,
        count,
        density,
        share,
        firstPosition,
        positions,
        heat,
        kwic,
      };
    }
  }

  return {
    totalWords,
    uniqueWords,
    sentences: sentenceList.length,
    oneGrams,
    twoGrams,
    threeGrams,
    topWord,
    topTwoGram,
    targetAnalysis,
  };
}
