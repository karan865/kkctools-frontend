import { pick, randomInt, type ByteSource } from './secure-random';
import { DEFAULT_SYMBOL_CHARS } from './password-engine';

/** Checked against the real list in passphrase-engine.test.ts. */
export const EFF_LONG_LIST_SIZE = 7776;

export type SeparatorMode =
  | 'hyphen'
  | 'space'
  | 'dot'
  | 'underscore'
  | 'none'
  | 'random-digit'
  | 'random-symbol'
  | 'custom';

export type CapitalMode = 'none' | 'first-each' | 'one-random';

export interface PassphraseOptions {
  wordCount: number; // 3..10, default 6
  separator: SeparatorMode;
  customSeparator?: string;
  capitals: CapitalMode;
  addNumber: boolean; // 0..99 at random gap
  addSymbol: boolean; // symbol at random gap
  customSymbolSet?: string;
  noRepeat: boolean;
}

export interface PassphraseEntropyBreakdown {
  wordsBits: number;
  separatorBits: number;
  capitalsBits: number;
  numberBits: number;
  symbolBits: number;
  totalBits: number;
  perWordBits: number;
  listSize: number;
}

export interface PassphraseResult {
  passphrase: string;
  words: string[];
  breakdown: PassphraseEntropyBreakdown;
  warning?: string;
}

export const DEFAULT_PASSPHRASE_OPTIONS: PassphraseOptions = {
  wordCount: 6,
  separator: 'hyphen',
  customSeparator: '-',
  capitals: 'none',
  addNumber: false,
  addSymbol: false,
  customSymbolSet: DEFAULT_SYMBOL_CHARS,
  noRepeat: false,
};

function sanitizeSymbolPool(custom?: string): string[] {
  const raw = custom && custom.length > 0 ? custom : DEFAULT_SYMBOL_CHARS;
  const seen = new Set<string>();
  const out: string[] = [];
  for (const ch of Array.from(raw)) {
    if (ch !== ' ' && !seen.has(ch)) {
      seen.add(ch);
      out.push(ch);
    }
  }
  return out.length > 0 ? out : Array.from(DEFAULT_SYMBOL_CHARS);
}

/**
 * Resolves conflicting options so entropy is never overstated:
 * - random-digit separator cannot combine with addNumber (would create ambiguous digit boundaries).
 * - random-symbol separator cannot combine with addSymbol (would create ambiguous symbol boundaries).
 */
export function resolvePassphraseOptions(opts: PassphraseOptions): {
  effective: PassphraseOptions;
  warning?: string;
} {
  const clampedCount = Math.max(3, Math.min(10, Math.floor(opts.wordCount || 6)));
  let addNumber = Boolean(opts.addNumber);
  let addSymbol = Boolean(opts.addSymbol);
  const warnings: string[] = [];

  if (opts.separator === 'random-digit' && addNumber) {
    addNumber = false;
    warnings.push('Extra number (0–99) is disabled when using random digit separators to avoid ambiguous boundaries.');
  }
  if (opts.separator === 'random-symbol' && addSymbol) {
    addSymbol = false;
    warnings.push('Extra symbol is disabled when using random symbol separators to avoid ambiguous boundaries.');
  }

  return {
    effective: {
      ...opts,
      wordCount: clampedCount,
      addNumber,
      addSymbol,
    },
    warning: warnings.length > 0 ? warnings.join(' ') : undefined,
  };
}

export function calculatePassphraseEntropy(
  opts: PassphraseOptions,
  listSize: number = EFF_LONG_LIST_SIZE
): PassphraseEntropyBreakdown {
  const { effective } = resolvePassphraseOptions(opts);
  const k = effective.wordCount;
  const N = Math.max(2, listSize);
  const perWordBits = Math.log2(N);

  let wordsBits = 0;
  if (effective.noRepeat && k <= N) {
    for (let i = 0; i < k; i++) {
      wordsBits += Math.log2(N - i);
    }
  } else {
    wordsBits = k * perWordBits;
  }

  const symbolPool = sanitizeSymbolPool(effective.customSymbolSet);
  let separatorBits = 0;
  if (effective.separator === 'random-digit') {
    separatorBits = (k - 1) * Math.log2(10);
  } else if (effective.separator === 'random-symbol') {
    separatorBits = (k - 1) * Math.log2(symbolPool.length);
  }

  const capitalsBits = effective.capitals === 'one-random' ? Math.log2(k) : 0;
  const numberBits = effective.addNumber ? Math.log2(100 * (k + 1)) : 0;
  const symbolBits = effective.addSymbol ? Math.log2(symbolPool.length * (k + 1)) : 0;

  const totalBits = wordsBits + separatorBits + capitalsBits + numberBits + symbolBits;

  return {
    wordsBits,
    separatorBits,
    capitalsBits,
    numberBits,
    symbolBits,
    totalBits,
    perWordBits,
    listSize: N,
  };
}

function getFixedSeparator(opts: PassphraseOptions): string {
  switch (opts.separator) {
    case 'hyphen':
      return '-';
    case 'space':
      return ' ';
    case 'dot':
      return '.';
    case 'underscore':
      return '_';
    case 'none':
      return '';
    case 'custom':
      return (opts.customSeparator ?? '-').slice(0, 4);
    default:
      return '-';
  }
}

function capitalizeWord(word: string, mode: 'first' | 'all'): string {
  if (!word) return word;
  if (mode === 'all') return word.toUpperCase();
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function generatePassphrase(
  opts: PassphraseOptions,
  source: ByteSource | undefined,
  wordList: readonly string[]
): PassphraseResult {
  const { effective, warning } = resolvePassphraseOptions(opts);
  const k = effective.wordCount;
  const N = wordList.length;

  // 1. Draw words
  const words: string[] = [];
  if (effective.noRepeat && k <= N) {
    const used = new Set<number>();
    while (words.length < k) {
      const idx = randomInt(N, source);
      if (!used.has(idx)) {
        used.add(idx);
        words.push(wordList[idx]);
      }
    }
  } else {
    for (let i = 0; i < k; i++) {
      words.push(pick(wordList, source));
    }
  }

  // 2. Apply capitalization
  const styledWords = words.slice();
  if (effective.capitals === 'first-each') {
    for (let i = 0; i < k; i++) {
      styledWords[i] = capitalizeWord(styledWords[i], 'first');
    }
  } else if (effective.capitals === 'one-random') {
    const capIdx = randomInt(k, source);
    styledWords[capIdx] = capitalizeWord(styledWords[capIdx], 'all');
  }

  // 3. Extra number / symbol at random gaps among k+1 positions
  // Gaps: 0 (before word 0), 1 (between 0 and 1), ..., k (after word k-1)
  const symbolPool = sanitizeSymbolPool(effective.customSymbolSet);
  const gapExtras: string[][] = Array.from({ length: k + 1 }, () => []);

  if (effective.addNumber) {
    const numVal = randomInt(100, source);
    const numGap = randomInt(k + 1, source);
    gapExtras[numGap].push(String(numVal).padStart(2, '0'));
  }

  if (effective.addSymbol) {
    const symVal = pick(symbolPool, source);
    const symGap = randomInt(k + 1, source);
    gapExtras[symGap].push(symVal);
  }

  // 4. Assemble with separators
  const parts: string[] = [];
  if (gapExtras[0].length > 0) {
    parts.push(gapExtras[0].join(''));
  }

  for (let i = 0; i < k; i++) {
    parts.push(styledWords[i]);
    if (i < k - 1) {
      let sep = '';
      if (effective.separator === 'random-digit') {
        sep = String(randomInt(10, source));
      } else if (effective.separator === 'random-symbol') {
        sep = pick(symbolPool, source);
      } else {
        sep = getFixedSeparator(effective);
      }
      const midExtra = gapExtras[i + 1].join('');
      parts.push(midExtra ? `${sep}${midExtra}${sep}` : sep);
    }
  }

  if (gapExtras[k].length > 0) {
    parts.push(gapExtras[k].join(''));
  }

  const breakdown = calculatePassphraseEntropy(effective, N);
  return {
    passphrase: parts.join(''),
    words: styledWords,
    breakdown,
    warning,
  };
}

export function generateBulkPassphrases(
  count: number,
  opts: PassphraseOptions,
  source: ByteSource | undefined,
  wordList: readonly string[]
): PassphraseResult[] {
  const safeCount = Math.max(1, Math.min(20, Math.floor(count || 1)));
  const out: PassphraseResult[] = [];
  for (let i = 0; i < safeCount; i++) {
    out.push(generatePassphrase(opts, source, wordList));
  }
  return out;
}
