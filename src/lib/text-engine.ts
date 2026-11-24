import { ABBREVIATIONS_EN } from '@/data/abbreviations-en';
import { STOP_WORDS_EN } from '@/data/stop-words-en';

export const NEVER_FINAL_ABBREVIATIONS: ReadonlySet<string> = new Set([
  'mr',
  'mrs',
  'ms',
  'dr',
  'prof',
  'sr',
  'jr',
  'st',
  'vs',
  'e.g',
  'eg',
  'i.e',
  'ie',
  'rev',
  'hon',
  'gen',
  'col',
  'maj',
  'capt',
  'lt',
  'sgt',
]);

export interface NormalizeOptions {
  dashesToSpaces?: boolean;
  normalizeQuotes?: boolean;
  normalizeWhitespace?: boolean;
}

export interface WordCountOptions {
  hyphenJoin?: boolean;
  countNumbers?: boolean;
  cjkPerChar?: boolean;
}

export interface SentenceCountOptions {
  abbreviations?: ReadonlySet<string>;
  listLines?: boolean; // each list line is its own sentence (default true)
}

export interface TextClassCounts {
  letters: number;
  digits: number;
  punctuation: number;
  symbols: number;
  spaces: number;
}

export interface TextScriptCounts {
  han: number;
  hiragana: number;
  katakana: number;
  hangul: number;
  latin: number;
}

export interface ReadingTimeResult {
  totalMinutes: number;
  minutes: number;
  seconds: number;
  formatted: string;
}

export interface NgramItem {
  phrase: string;
  count: number;
  density: number; // percentage (0 - 100)
}

export interface TextAnalysis {
  characters: number; // Grapheme clusters
  charactersNoSpaces: number;
  codePoints: number;
  utf16Units: number;
  utf8Bytes: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  emojis: number;
  classCounts: TextClassCounts;
  scriptCounts: TextScriptCounts;
  readingTime: ReadingTimeResult;
  speakingTime: ReadingTimeResult;
}

/**
 * Normalizes text per Unicode standards without corrupting emoji ZWJ sequences.
 * Never strips U+200D (ZWJ) or U+200C.
 */
export function normalizeText(text: string, options: NormalizeOptions = {}): string {
  if (!text) return '';
  let result = text.normalize('NFC');

  if (options.normalizeQuotes !== false) {
    // Smart quotes to straight quotes
    result = result
      .replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'")
      .replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"');
  }

  if (options.dashesToSpaces) {
    // En-dash, em-dash, horizontal bar to space
    result = result.replace(/[\u2013\u2014\u2015]/g, ' ');
  }

  if (options.normalizeWhitespace !== false) {
    // Non-breaking spaces to standard space
    result = result.replace(/[\u00A0\u2007\u202F]/g, ' ');
  }

  return result;
}

/**
 * Normalizes text specifically for the word and sentence counting pipeline.
 * Strips soft hyphen U+00AD, zero-width space U+200B, and BOM U+FEFF.
 */
export function normalizeForWords(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFC')
    .replace(/[\u00AD\u200B\uFEFF]/g, '')
    .replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"')
    .replace(/[\u00A0\u2007\u202F]/g, ' ');
}

/** True when every UTF-16 unit is ASCII and there is no CR (CR LF is one grapheme). */
function isPlainAscii(text: string): boolean {
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c > 127 || c === 13) return false;
  }
  return true;
}

/**
 * Counts user-perceived character grapheme clusters using Intl.Segmenter.
 */
export function countGraphemes(text: string): number {
  if (!text) return 0;
  if (isPlainAscii(text)) return text.length;
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    let count = 0;
    for (const seg of segmenter.segment(text)) {
      if (seg) count++;
    }
    return count;
  }
  return Array.from(text).length;
}

/**
 * Counts Unicode code points.
 */
export function countCodePoints(text: string): number {
  if (!text) return 0;
  return Array.from(text).length;
}

/**
 * Counts UTF-16 code units (native JS string.length).
 */
export function countUtf16(text: string): number {
  return text ? text.length : 0;
}

/**
 * Counts UTF-8 encoded bytes.
 */
export function countUtf8Bytes(text: string): number {
  if (!text) return 0;
  return new TextEncoder().encode(text).length;
}

/**
 * Counts graphemes excluding whitespace and zero-width spaces.
 */
export function charsNoSpaces(text: string): number {
  if (!text) return 0;
  if (isPlainAscii(text)) return text.replace(/\s+/g, '').length;
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    let count = 0;
    for (const { segment } of segmenter.segment(text)) {
      if (!/^[\s\u200B]+$/u.test(segment)) {
        count++;
      }
    }
    return count;
  }
  return Array.from(text).filter((ch) => !/^[\s\u200B]+$/u.test(ch)).length;
}

/**
 * Tests whether a grapheme cluster is an emoji according to Section 3.2.
 */
export function isEmojiGrapheme(grapheme: string): boolean {
  if (!grapheme) return false;
  // Keycap sequence: e.g. 1️⃣ or #️⃣
  if (/[\u20E3]/.test(grapheme)) return true;
  // Regional indicator flag: 2 RI characters
  if (/^\p{RI}{2}$/u.test(grapheme)) return true;
  // Emoji presentation
  if (/\p{Emoji_Presentation}/u.test(grapheme)) return true;
  // Extended pictographic with variation selector-16 (U+FE0F) or ZWJ
  if (/\p{Extended_Pictographic}/u.test(grapheme) && /[\uFE0F\u200D]/.test(grapheme)) {
    return true;
  }
  return false;
}

/**
 * Counts emoji graphemes in text.
 */
export function emojiCount(text: string): number {
  if (!text || isPlainAscii(text)) return 0;
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    let count = 0;
    for (const { segment } of segmenter.segment(text)) {
      if (isEmojiGrapheme(segment)) {
        count++;
      }
    }
    return count;
  }
  return 0;
}

/**
 * Counts characters classified by Unicode general categories.
 */
export function classCounts(text: string): TextClassCounts {
  const result: TextClassCounts = {
    letters: 0,
    digits: 0,
    punctuation: 0,
    symbols: 0,
    spaces: 0,
  };
  if (!text) return result;

  for (const ch of Array.from(text)) {
    if (/\p{L}/u.test(ch)) {
      result.letters++;
    } else if (/\p{N}/u.test(ch)) {
      result.digits++;
    } else if (/\p{P}/u.test(ch)) {
      result.punctuation++;
    } else if (/\p{S}/u.test(ch)) {
      result.symbols++;
    } else if (/\s|\p{Z}/u.test(ch)) {
      result.spaces++;
    }
  }

  return result;
}

/**
 * Counts characters across major East Asian and Latin scripts.
 */
export function scriptCounts(text: string): TextScriptCounts {
  const result: TextScriptCounts = {
    han: 0,
    hiragana: 0,
    katakana: 0,
    hangul: 0,
    latin: 0,
  };
  if (!text) return result;

  for (const ch of Array.from(text)) {
    if (/\p{sc=Han}/u.test(ch)) {
      result.han++;
    } else if (/\p{sc=Hiragana}/u.test(ch)) {
      result.hiragana++;
    } else if (/\p{sc=Katakana}/u.test(ch)) {
      result.katakana++;
    } else if (/\p{sc=Hangul}/u.test(ch)) {
      result.hangul++;
    } else if (/\p{sc=Latin}/u.test(ch)) {
      result.latin++;
    }
  }

  return result;
}

// Links with a scheme or www, emails, and bare domains that carry a path.
const WORD_ATOM = /(?:https?:\/\/|www\.)[^\s]+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+|(?:[a-z0-9-]+\.)+[a-z]{2,}\/[^\s]*/gi;
const TRAILING_PUNCTUATION = /[.,!?;:'")\]}>]+$/;
const HYPHEN = /^[-‐‑]$/;
const CJK = /[\p{sc=Han}\p{sc=Hiragana}\p{sc=Katakana}\p{sc=Hangul}]/u;

function segmentPlainWords(text: string, options: WordCountOptions, out: string[]): void {
  const hyphenJoin = options.hyphenJoin !== false;
  const countNumbers = options.countNumbers !== false;
  const add = (word: string) => {
    if (countNumbers || !/^[\d,.\-‐‑]+$/.test(word)) out.push(word);
  };

  if (typeof Intl === 'undefined' || !Intl.Segmenter) {
    const pattern = hyphenJoin
      ? /[\p{L}\p{N}]+(?:['.,\-‐‑][\p{L}\p{N}]+)*/gu
      : /[\p{L}\p{N}]+(?:['.,][\p{L}\p{N}]+)*/gu;
    (text.match(pattern) || []).forEach(add);
    return;
  }

  const segments = Array.from(new Intl.Segmenter('en', { granularity: 'word' }).segment(text));
  for (let i = 0; i < segments.length; i++) {
    if (!segments[i].isWordLike) continue;
    let word = segments[i].segment;

    // Chrome splits "p.m." and "example.com" at the dot and Node does not, so always join across a
    // dot that has no space around it. Hyphens join the same way when the option is on.
    while (
      i + 2 < segments.length &&
      (segments[i + 1].segment === '.' || (hyphenJoin && HYPHEN.test(segments[i + 1].segment))) &&
      segments[i + 2].isWordLike
    ) {
      word += segments[i + 1].segment + segments[i + 2].segment;
      i += 2;
    }

    if (options.cjkPerChar && CJK.test(word)) {
      for (const ch of Array.from(word)) {
        if (/[\p{L}\p{N}]/u.test(ch)) out.push(ch);
      }
      continue;
    }
    add(word);
  }
}

/**
 * Extracts words. URLs and emails are one word each; hyphenated words are joined by default.
 */
export function extractWords(text: string, options: WordCountOptions = {}): string[] {
  if (!text) return [];
  const normalized = normalizeForWords(text);
  const words: string[] = [];
  const atoms = new RegExp(WORD_ATOM.source, 'gi');
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = atoms.exec(normalized)) !== null) {
    const atom = match[0].replace(TRAILING_PUNCTUATION, '');
    if (!atom) continue;
    segmentPlainWords(normalized.slice(last, match.index), options, words);
    words.push(atom);
    last = match.index + atom.length;
    atoms.lastIndex = last;
  }
  segmentPlainWords(normalized.slice(last), options, words);
  return words;
}

/**
 * Counts total words in text.
 */
export function countWords(text: string, options: WordCountOptions = {}): number {
  return extractWords(text, options).length;
}

const LIST_LINE = /^\s*(?:[-*•]|\d+[.)])\s/;

function shouldMergeSentence(
  current: string,
  next: string,
  abbreviations: ReadonlySet<string>,
  listLines: boolean
): boolean {
  if (/\n[^\S\n]*\n\s*$/.test(current)) return false; // a blank line always ends a sentence
  const head = current.trim();
  const nextStart = next.trimStart();
  const nextLower = /^\p{Ll}/u.test(nextStart);
  const nextDigit = /^\p{Nd}/u.test(nextStart);

  if (/\n\s*$/.test(current)) {
    if (LIST_LINE.test(next)) return !listLines && LIST_LINE.test(current);
    if (nextLower) return true; // hard-wrapped line
  }

  // "1." on its own is a list marker, not a sentence.
  if (/(?:^|\n)\s*\d+[.)]$/.test(head)) return true;
  if (/(?:\.\.\.|…)$/.test(head)) return nextLower;

  const match = head.match(/(\S+)\.$/);
  if (!match) return false;
  const token = match[1].replace(/^["'(\[“‘]+/, '');
  const key = token.toLowerCase();

  if (abbreviations.has(key)) {
    // Titles never end a sentence; abbreviations the user added behave the same way.
    if (NEVER_FINAL_ABBREVIATIONS.has(key) || !ABBREVIATIONS_EN.has(key)) return true;
    return nextLower || nextDigit;
  }

  // Initials: "J. K. Rowling", "J.K. Rowling". A lone "I" counts only at the start of a sentence.
  if (/^(?:[A-Z]\.)*[A-Z]$/.test(token) && /^\p{Lu}/u.test(nextStart)) {
    return token !== 'I' || head === match[0];
  }
  return false;
}

/**
 * Extracts sentences with abbreviation, initial, list and hard-wrap merge rules.
 * Returns the user's own characters (quotes are not rewritten).
 */
export function extractSentences(text: string, options: SentenceCountOptions = {}): string[] {
  if (!text) return [];
  const abbreviations = options.abbreviations || ABBREVIATIONS_EN;
  const listLines = options.listLines !== false;
  const source = text.replace(/\r\n?/g, '\n');

  const raw: string[] =
    typeof Intl === 'undefined' || !Intl.Segmenter
      ? source.match(/[^.!?\n]+[.!?]*\s*|[.!?\s]+/g) || []
      : Array.from(new Intl.Segmenter('en', { granularity: 'sentence' }).segment(source), (s) => s.segment);

  const sentences: string[] = [];
  let buffer = '';
  for (let i = 0; i < raw.length; i++) {
    buffer += raw[i];
    if (i + 1 < raw.length) {
      // Blank lines and bare punctuation join the neighbouring sentence.
      if (!raw[i + 1].trim() || !/[\p{L}\p{N}]/u.test(buffer)) continue;
      if (shouldMergeSentence(buffer, raw[i + 1], abbreviations, listLines)) continue;
    }
    if (/[\p{L}\p{N}]/u.test(buffer)) sentences.push(buffer);
    buffer = '';
  }
  return sentences;
}

/**
 * Counts total sentences in text.
 */
export function countSentences(text: string, options: SentenceCountOptions = {}): number {
  return extractSentences(text, options).length;
}

/**
 * Counts paragraphs separated by blank lines.
 */
export function countParagraphs(text: string): number {
  if (!text) return 0;
  const paras = text.split(/\r?\n\s*\r?\n/);
  return paras.filter((p) => /\S/.test(p)).length;
}

/**
 * Counts total lines.
 */
export function countLines(text: string): number {
  if (!text) return 0;
  return text.split(/\r\n|\n|\r/).length;
}

/**
 * Computes n-grams (1, 2, or 3-word combinations) with density percentages.
 */
export function getNgrams(
  words: string[] | string[][], // pass one array per sentence to keep phrases inside sentences
  n: number = 1,
  options: {
    stopWords?: ReadonlySet<string>;
    minFrequency?: number;
    caseSensitive?: boolean;
  } = {}
): NgramItem[] {
  if (!words || words.length === 0 || n < 1 || n > 3) return [];
  const stopWords = options.stopWords || STOP_WORDS_EN;
  const minFreq = options.minFrequency ?? 1;
  const caseSensitive = Boolean(options.caseSensitive);

  const freqMap = new Map<string, number>();
  const groups: string[][] = Array.isArray(words[0]) ? (words as string[][]) : [words as string[]];
  const totalWords = Math.max(1, groups.reduce((sum, g) => sum + g.length, 0));

  for (const group of groups) {
    for (let i = 0; i <= group.length - n; i++) {
      const slice = group.slice(i, i + n).map((w) => (caseSensitive ? w : w.toLowerCase()));
      // Skip stop words, and phrases made only of stop words
      if (slice.every((w) => stopWords.has(w.toLowerCase()))) continue;
      const phrase = slice.join(' ');
      freqMap.set(phrase, (freqMap.get(phrase) || 0) + 1);
    }
  }

  const items: NgramItem[] = [];
  for (const [phrase, count] of freqMap.entries()) {
    if (count >= minFreq) {
      items.push({
        phrase,
        count,
        density: Number(((count / totalWords) * 100).toFixed(2)),
      });
    }
  }

  // Sort by frequency descending, then alphabetically
  return items.sort((a, b) => b.count - a.count || a.phrase.localeCompare(b.phrase, 'en'));
}

/**
 * Calculates reading time formatted as mm:ss and human readable string.
 */
export function calculateReadingTime(wordCount: number, wpm: number = 238): ReadingTimeResult {
  const safeWpm = wpm > 0 ? wpm : 238;
  const totalMinutes = wordCount / safeWpm;
  const totalSeconds = Math.round(totalMinutes * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  let formatted = '';
  if (minutes === 0 && seconds === 0) {
    formatted = '0 sec';
  } else if (minutes === 0) {
    formatted = `${seconds} sec`;
  } else if (seconds === 0) {
    formatted = `${minutes} min`;
  } else {
    formatted = `${minutes} min ${seconds} sec`;
  }

  return {
    totalMinutes,
    minutes,
    seconds,
    formatted,
  };
}

/**
 * Calculates speaking time formatted as mm:ss and human readable string.
 */
export function calculateSpeakingTime(wordCount: number, wpm: number = 130): ReadingTimeResult {
  return calculateReadingTime(wordCount, wpm);
}

export interface TextAnalysisOptions {
  nfc?: boolean;
  ignorePunctuation?: boolean;
  ignoreDigits?: boolean;
  cjkPerChar?: boolean;
}

/**
 * Full snapshot analysis of text for fast UI rendering.
 */
export function analyzeText(text: string, options: TextAnalysisOptions = {}): TextAnalysis {
  const nfc = options.nfc !== false;
  const processedText = nfc ? (text ? text.normalize('NFC') : '') : text;

  let graphemes = 0;
  let charsWithoutSpaces = 0;

  if (options.ignorePunctuation || options.ignoreDigits) {
    const segmenter =
      typeof Intl !== 'undefined' && Intl.Segmenter
        ? new Intl.Segmenter('en', { granularity: 'grapheme' })
        : null;
    const parts = segmenter
      ? segmenter.segment(processedText)
      : Array.from(processedText).map((s) => ({ segment: s }));
    for (const { segment } of parts) {
      const isSpace = /^[\s\u200B]+$/u.test(segment);
      const isPunct = /^\p{P}+$/u.test(segment);
      const isDigit = /^\p{Nd}+$/u.test(segment);

      if (options.ignorePunctuation && isPunct) continue;
      if (options.ignoreDigits && isDigit) continue;

      graphemes++;
      if (!isSpace) charsWithoutSpaces++;
    }
  } else {
    graphemes = countGraphemes(processedText);
    charsWithoutSpaces = charsNoSpaces(processedText);
  }

  const words = countWords(processedText, { cjkPerChar: options.cjkPerChar });

  return {
    characters: graphemes,
    charactersNoSpaces: charsWithoutSpaces,
    codePoints: countCodePoints(processedText),
    utf16Units: countUtf16(processedText),
    utf8Bytes: countUtf8Bytes(processedText),
    words,
    sentences: countSentences(processedText),
    paragraphs: countParagraphs(processedText),
    lines: countLines(processedText),
    emojis: emojiCount(processedText),
    classCounts: classCounts(processedText),
    scriptCounts: scriptCounts(processedText),
    readingTime: calculateReadingTime(words, 238),
    speakingTime: calculateSpeakingTime(words, 130),
  };
}

export type OverflowUnit = 'graphemes' | 'noSpaces' | 'bytes' | 'words';

export interface OverflowOptions {
  nfc?: boolean;
  ignorePunctuation?: boolean;
  ignoreDigits?: boolean;
}

/** UTF-16 index where the text first passes the limit, or -1 when it fits. */
export function overflowIndex(
  text: string,
  limit: number,
  unit: OverflowUnit,
  options: OverflowOptions = {}
): number {
  if (!text) return -1;
  // Walk the text as typed, so the index is valid for the caller's own string.
  const nfc = options.nfc !== false;
  const byCharacter = unit === 'graphemes' || unit === 'noSpaces';
  let used = 0;

  if (unit === 'words') {
    const tokens = /\S+/g;
    let match: RegExpExecArray | null;
    while ((match = tokens.exec(text)) !== null) {
      used += countWords(match[0]);
      if (used > limit) return match.index;
    }
    return -1;
  }

  const parts: Iterable<{ segment: string }> =
    typeof Intl !== 'undefined' && Intl.Segmenter
      ? new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(text)
      : Array.from(text, (segment) => ({ segment }));
  let index = 0;
  for (const { segment } of parts) {
    const isSpace = /^[\s\u200B]+$/u.test(segment);
    const isPunct = /^\p{P}+$/u.test(segment);
    const isDigit = /^\p{Nd}+$/u.test(segment);

    if (byCharacter && options.ignorePunctuation && isPunct) {
      index += segment.length;
      continue;
    }
    if (byCharacter && options.ignoreDigits && isDigit) {
      index += segment.length;
      continue;
    }

    if (unit === 'bytes') used += countUtf8Bytes(nfc ? segment.normalize('NFC') : segment);
    else if (unit === 'noSpaces') {
      if (!isSpace) used += 1;
    } else {
      used += 1;
    }

    if (used > limit) return index;
    index += segment.length;
  }
  return -1;
}
