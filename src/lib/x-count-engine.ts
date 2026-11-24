import { extractSentences, isEmojiGrapheme } from './text-engine';

export type ThreadNumbering = 'fraction' | 'bracket' | 'emoji' | 'none';

export interface ThreadSplitOptions {
  limit?: number; // default 280
  numbering?: ThreadNumbering; // " 1/3", " (1/3)", " 🧵 1/3", or none
}

export interface XAtom {
  text: string;
  weight: number;
}

const URL_WEIGHT = 23;

// Scheme, www, or a bare domain on a common TLD. The first group is the character before the link,
// so emails, @handles and #tags are not read as links.
const URL_PATTERN =
  /(^|[^\w@.#$/-])((?:https?:\/\/|www\.)[^\s　-鿿＀-￯]+|(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:com|org|net|edu|gov|io|ai|app|dev|co|me|info|biz|tv|blog|shop|store|site|online|xyz|news|uk|us|ca|au|nz|in|de|fr|es|it|nl|eu|jp|cn|br)(?![\w-]|\.[a-z])(?:[/?#][^\s　-鿿＀-￯]*)?)/gi;

const isLight = (cp: number): boolean =>
  cp <= 0x10ff || (cp >= 0x2000 && cp <= 0x200d) || (cp >= 0x2010 && cp <= 0x201f) || (cp >= 0x2032 && cp <= 0x2037);

function pushGraphemes(text: string, out: XAtom[]): void {
  if (!text) return;
  const parts: Iterable<{ segment: string }> =
    typeof Intl !== 'undefined' && Intl.Segmenter
      ? new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(text)
      : Array.from(text, (segment) => ({ segment }));
  for (const { segment } of parts) {
    let weight = 0;
    if (isEmojiGrapheme(segment)) weight = 2;
    else for (const ch of Array.from(segment.normalize('NFC'))) weight += isLight(ch.codePointAt(0) || 0) ? 1 : 2;
    out.push({ text: segment, weight });
  }
}

/** The text as indivisible pieces (a link or one grapheme) with their X weight. */
export function xAtoms(text: string): XAtom[] {
  const out: XAtom[] = [];
  if (!text) return out;
  const pattern = new RegExp(URL_PATTERN.source, 'gi');
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const start = match.index + match[1].length;
    const url = match[2].replace(/[.,!?;:'")\]}>…]+$/, '');
    pushGraphemes(text.slice(last, start), out);
    out.push({ text: url, weight: URL_WEIGHT });
    last = start + url.length;
    pattern.lastIndex = last;
  }
  pushGraphemes(text.slice(last), out);
  return out;
}

/**
 * X weighted length (twitter-text v3 values): link 23, emoji 2,
 * code points in the weight-100 ranges 1, everything else 2.
 */
export function xWeightedLength(text: string): number {
  return xAtoms(text).reduce((sum, atom) => sum + atom.weight, 0);
}

/** UTF-16 index where the post passes the limit, or -1 when it fits. */
export function xOverflowIndex(text: string, limit: number): number {
  let used = 0;
  let index = 0;
  for (const atom of xAtoms(text)) {
    used += atom.weight;
    if (used > limit) return index;
    index += atom.text.length;
  }
  return -1;
}

function suffixFor(numbering: ThreadNumbering, index: number, total: number): string {
  switch (numbering) {
    case 'none':
      return '';
    case 'bracket':
      return ` (${index}/${total})`;
    case 'emoji':
      return ` 🧵 ${index}/${total}`;
    default:
      return ` ${index}/${total}`;
  }
}

/** Packs sentences, then words, then single atoms, keeping `total` as the number in the suffix. */
function pack(text: string, limit: number, numbering: ThreadNumbering, total: number): string[] {
  const posts: string[] = [];
  let current = '';
  const fits = (candidate: string) =>
    xWeightedLength(candidate.trim() + suffixFor(numbering, posts.length + 1, total)) <= limit;
  const flush = () => {
    if (current.trim()) posts.push(current.trim());
    current = '';
  };

  for (const sentence of extractSentences(text)) {
    if (fits(current + sentence)) {
      current += sentence;
      continue;
    }
    flush();
    if (fits(sentence)) {
      current = sentence;
      continue;
    }
    for (const word of sentence.match(/\s*\S+\s*/g) || []) {
      if (fits(current + word)) {
        current += word;
        continue;
      }
      flush();
      if (fits(word)) {
        current = word;
        continue;
      }
      for (const atom of xAtoms(word)) {
        if (!fits(current + atom.text)) flush();
        current += atom.text;
      }
    }
  }
  flush();
  return posts;
}

/**
 * Splits long text into posts at sentence, then word boundaries. The suffix counts toward the limit,
 * and a link or emoji is never cut. Text that already fits comes back as one post with no suffix.
 */
export function splitThread(text: string, options: ThreadSplitOptions = {}): string[] {
  if (!text || !text.trim()) return [];
  const limit = Math.max(40, options.limit || 280);
  const numbering = options.numbering || 'fraction';
  if (xWeightedLength(text.trim()) <= limit) return [text.trim()];

  // The suffix width depends only on how many digits the total has.
  for (let digits = 1; digits <= 6; digits++) {
    const posts = pack(text, limit, numbering, Math.pow(10, digits) - 1);
    if (String(posts.length).length <= digits) {
      return posts.map((post, i) => post + suffixFor(numbering, i + 1, posts.length));
    }
  }
  return [];
}
