import { describe, it, expect } from 'vitest';
import {
  calculatePrintableArea,
  calculateWordsPerPage,
  calculatePagesFromWords,
  calculateWordsFromPages,
  calculateBookPages,
  generateWordsToPagesTable,
} from './page-estimate-engine';

describe('Spec 01 Words to Pages Calculator Engine', () => {
  it('worked example 1: 1,000 words, 12 pt, single, Letter, 1 in gives 500 words/page -> 2.0 pages (range 1.8-2.2)', () => {
    const res = calculatePagesFromWords(1000, {
      fontSize: 12,
      lineSpacing: 'single',
      paper: 'letter',
      marginInches: 1.0,
    });
    expect(res.wordsPerPage).toBe(500);
    expect(res.pagesFormatted).toBe('2.0');
    expect(res.rangeFormatted).toBe('1.8 – 2.2');
  });

  it('worked example 2: same, double-spaced gives 250 words/page -> 4.0 pages', () => {
    const res = calculatePagesFromWords(1000, {
      fontSize: 12,
      lineSpacing: 'double',
      paper: 'letter',
      marginInches: 1.0,
    });
    expect(res.wordsPerPage).toBe(250);
    expect(res.pagesFormatted).toBe('4.0');
  });

  it('worked example 3: same, 1.5 spacing gives 333.3 words/page -> 3.0 pages', () => {
    const res = calculatePagesFromWords(1000, {
      fontSize: 12,
      lineSpacing: '1.5',
      paper: 'letter',
      marginInches: 1.0,
    });
    expect(res.wordsPerPage).toBe(333.3);
    expect(res.pagesFormatted).toBe('3.0');
  });

  it('worked example 4: 1,000 words at 11 pt single gives 595.0 words/page -> 1.68 pages', () => {
    const wpp = calculateWordsPerPage({ fontSize: 11, lineSpacing: 'single' });
    expect(wpp).toBe(595);
    const pages = 1000 / wpp;
    expect(Number(pages.toFixed(2))).toBe(1.68);
  });

  it('worked example 5: 10 pt and 14 pt single give 720.0 and 367.3 words/page', () => {
    expect(calculateWordsPerPage({ fontSize: 10, lineSpacing: 'single' })).toBe(720);
    expect(calculateWordsPerPage({ fontSize: 14, lineSpacing: 'single' })).toBe(367.3);
  });

  it('worked example 6: A4, 1 in, 12 pt single gives 519.3 words/page', () => {
    const wpp = calculateWordsPerPage({ paper: 'a4', marginInches: 1.0, fontSize: 12, lineSpacing: 'single' });
    expect(wpp).toBe(519.3);
  });

  it('worked example 7: Letter, 1.25 in margins gives 435.9 words/page', () => {
    const wpp = calculateWordsPerPage({ paper: 'letter', marginInches: 1.25, fontSize: 12, lineSpacing: 'single' });
    expect(wpp).toBe(435.9);
  });

  it('worked example 8: Reverse mode 5 pages double-spaced gives 1,250 words', () => {
    const words = calculateWordsFromPages(5, { lineSpacing: 'double' });
    expect(words).toBe(1250);
  });

  it('worked example 9: 1,000 words at 20 words/sentence and 100 words/paragraph gives 50 sentences and 10 paragraphs', () => {
    const res = calculatePagesFromWords(1000, {}, 20, 100);
    expect(res.sentences).toBe(50);
    expect(res.paragraphs).toBe(10);
  });

  it('worked example 10: 3,000 words single / double gives 6 / 12 pages', () => {
    const single = calculatePagesFromWords(3000, { lineSpacing: 'single' });
    const double = calculatePagesFromWords(3000, { lineSpacing: 'double' });
    expect(single.pagesFormatted).toBe('6.0');
    expect(double.pagesFormatted).toBe('12.0');
  });

  it('book trim mode: 75,000 words at 250 words/page gives 300 pages', () => {
    const book = calculateBookPages(75000, '6x9', 250);
    expect(book.pages).toBe(300);
  });

  it('generates the reference table with expected 22 rows', () => {
    const table = generateWordsToPagesTable();
    expect(table.length).toBe(22);
    expect(table[0].words).toBe(100);
    expect(table[table.length - 1].words).toBe(50000);
  });
});
