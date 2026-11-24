export type PaperSize = 'letter' | 'a4';
export type LineSpacing = 'single' | '1.15' | '1.5' | 'double';
export type BookTrimSize = '5x8' | '5.5x8.5' | '6x9' | '7x10' | 'custom';

export interface PageEstimateOptions {
  fontSize?: number; // 10 to 14 pt, default 12
  lineSpacing?: LineSpacing;
  paper?: PaperSize;
  marginInches?: number; // default 1.0
}

export interface PageEstimateResult {
  pages: number;
  pagesFormatted: string; // e.g. "2.0"
  rangeFormatted: string; // e.g. "1.8 – 2.2"
  wordsPerPage: number;
  wordsPerPageFormatted: string;
  sentences: number;
  paragraphs: number;
}

export interface BookEstimateResult {
  pages: number;
  trimLabel: string;
  wordsPerPage: number;
}

export interface TableRowEstimate {
  words: number;
  singlePages: string;
  onePointFivePages: string;
  doublePages: string;
}

export const TABLE_WORD_COUNTS: number[] = [
  100, 200, 250, 300, 400, 500, 600, 700, 750, 800,
  1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000,
  7500, 10000, 20000, 50000
];

export const BOOK_TRIM_PRESETS: Record<BookTrimSize, { label: string; width: number; height: number }> = {
  '5x8': { label: '5 × 8 in (Mass Market Paperback)', width: 5, height: 8 },
  '5.5x8.5': { label: '5.5 × 8.5 in (Trade Paperback)', width: 5.5, height: 8.5 },
  '6x9': { label: '6 × 9 in (Standard Trade Non-Fiction)', width: 6, height: 9 },
  '7x10': { label: '7 × 10 in (Textbook / Handbook)', width: 7, height: 10 },
  'custom': { label: 'Custom Dimensions', width: 6, height: 9 },
};

/**
 * Calculates printable text area in square inches after subtracting margins.
 */
export function calculatePrintableArea(paper: PaperSize = 'letter', marginInches: number = 1.0): number {
  const paperDims = paper === 'a4' ? { w: 8.27, h: 11.69 } : { w: 8.5, h: 11.0 };
  const safeMargin = Math.max(0.25, Math.min(2.5, marginInches));
  const w = Math.max(1.0, paperDims.w - 2 * safeMargin);
  const h = Math.max(1.0, paperDims.h - 2 * safeMargin);
  return w * h;
}

/**
 * Line spacing multiplier (divisor for words per page).
 */
export function getSpacingMultiplier(spacing: LineSpacing = 'single'): number {
  switch (spacing) {
    case '1.15':
      return 1.15;
    case '1.5':
      return 1.5;
    case 'double':
      return 2.0;
    case 'single':
    default:
      return 1.0;
  }
}

/**
 * Calculates estimated words per page based on typography, paper size, and margins.
 * Convention baseline: 12 pt, single spacing, Letter paper, 1-inch margins = 500 words per page.
 */
export function calculateWordsPerPage(options: PageEstimateOptions = {}): number {
  const base = 500;
  const fontSize = options.fontSize && options.fontSize > 0 ? options.fontSize : 12;
  const lineSpacing = options.lineSpacing || 'single';
  const paper = options.paper || 'letter';
  const marginInches = typeof options.marginInches === 'number' ? options.marginInches : 1.0;

  const letterDefaultArea = (8.5 - 2) * (11.0 - 2); // 58.5 sq in
  const area = calculatePrintableArea(paper, marginInches);

  // Font size is squared because font size scales both characters per line and lines per page
  const sizeFactor = Math.pow(12 / fontSize, 2);
  const areaFactor = area / letterDefaultArea;
  const spacingDivisor = getSpacingMultiplier(lineSpacing);

  const wordsPerPage = (base * sizeFactor * areaFactor) / spacingDivisor;
  return Number(wordsPerPage.toFixed(1));
}

/**
 * Calculates pages, ±10% range, sentences, and paragraphs for a given word count.
 */
export function calculatePagesFromWords(
  words: number,
  options: PageEstimateOptions = {},
  wordsPerSentence: number = 20,
  wordsPerParagraph: number = 100
): PageEstimateResult {
  const safeWords = Math.max(0, words);
  const wordsPerPage = calculateWordsPerPage(options);
  const rawPages = wordsPerPage > 0 ? safeWords / wordsPerPage : 0;

  const lowRange = (rawPages * 0.9).toFixed(1);
  const highRange = (rawPages * 1.1).toFixed(1);

  const safeWps = wordsPerSentence > 0 ? wordsPerSentence : 20;
  const safeWpp = wordsPerParagraph > 0 ? wordsPerParagraph : 100;

  return {
    pages: rawPages,
    pagesFormatted: rawPages.toFixed(1),
    rangeFormatted: `${lowRange} – ${highRange}`,
    wordsPerPage,
    wordsPerPageFormatted: wordsPerPage.toFixed(1),
    sentences: Math.round(safeWords / safeWps),
    paragraphs: Math.round(safeWords / safeWpp),
  };
}

/**
 * Calculates total words needed to reach a target page count (Reverse Mode).
 */
export function calculateWordsFromPages(pages: number, options: PageEstimateOptions = {}): number {
  const safePages = Math.max(0, pages);
  const wordsPerPage = calculateWordsPerPage(options);
  return Math.round(safePages * wordsPerPage);
}

/**
 * Estimates book page count for commercial trim sizes.
 */
export function calculateBookPages(words: number, trim: BookTrimSize = '6x9', wordsPerPage: number = 250): BookEstimateResult {
  const safeWords = Math.max(0, words);
  const safeWpp = wordsPerPage > 0 ? wordsPerPage : 250;
  const pages = Math.ceil(safeWords / safeWpp);
  return {
    pages,
    trimLabel: BOOK_TRIM_PRESETS[trim]?.label || '6 × 9 in',
    wordsPerPage: safeWpp,
  };
}

/**
 * Generates the full reference table rows for single, 1.5, and double spacing.
 */
export function generateWordsToPagesTable(options: PageEstimateOptions = {}): TableRowEstimate[] {
  return TABLE_WORD_COUNTS.map((words) => {
    const single = calculatePagesFromWords(words, { ...options, lineSpacing: 'single' });
    const onePointFive = calculatePagesFromWords(words, { ...options, lineSpacing: '1.5' });
    const double = calculatePagesFromWords(words, { ...options, lineSpacing: 'double' });

    return {
      words,
      singlePages: single.pagesFormatted,
      onePointFivePages: onePointFive.pagesFormatted,
      doublePages: double.pagesFormatted,
    };
  });
}
