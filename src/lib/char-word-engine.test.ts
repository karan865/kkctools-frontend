import { describe, it, expect } from 'vitest';
import {
  DEFAULT_AVERAGE_WORD_LENGTH,
  calculateWordsFromChars,
  calculateCharsFromWords,
  measureWritingAverages,
  generateCharWordTable,
  CHAR_WORD_TABLE_COUNTS,
  getEffectivePerWord,
} from './char-word-engine';

describe('char-word-engine', () => {
  describe('Worked examples from Spec 02 §3.4 (L = 4.7, p = 0)', () => {
    it('1,000 characters with spaces → ≈ 175 words (range 149–213)', () => {
      const result = calculateWordsFromChars(1000, { countSpaces: true, avgLetters: 4.7, punctuation: 0 });
      expect(result.words).toBe(175);
      expect(result.rangeLow).toBe(149);
      expect(result.rangeHigh).toBe(213);
      expect(result.rangeFormatted).toBe('149–213');
    });

    it('1,000 characters without spaces → ≈ 213 words (175–270)', () => {
      const result = calculateWordsFromChars(1000, { countSpaces: false, avgLetters: 4.7, punctuation: 0 });
      expect(result.words).toBe(213);
      expect(result.rangeLow).toBe(175);
      expect(result.rangeHigh).toBe(270);
      expect(result.rangeFormatted).toBe('175–270');
    });

    it('2,000 characters with spaces → ≈ 351 words (299–426)', () => {
      const result = calculateWordsFromChars(2000, { countSpaces: true, avgLetters: 4.7, punctuation: 0 });
      expect(result.words).toBe(351);
      expect(result.rangeLow).toBe(299);
      expect(result.rangeHigh).toBe(426);
    });

    it('500 characters with spaces → ≈ 88 words (75–106)', () => {
      const result = calculateWordsFromChars(500, { countSpaces: true, avgLetters: 4.7, punctuation: 0 });
      expect(result.words).toBe(88);
      expect(result.rangeLow).toBe(75);
      expect(result.rangeHigh).toBe(106);
    });

    it('5,000 characters with spaces → ≈ 877 words (746–1,064)', () => {
      const result = calculateWordsFromChars(5000, { countSpaces: true, avgLetters: 4.7, punctuation: 0 });
      expect(result.words).toBe(877);
      expect(result.rangeLow).toBe(746);
      expect(result.rangeHigh).toBe(1064);
    });

    it('Reverse: 500 words → ≈ 2,850 chars with spaces · 2,350 without', () => {
      const withSpaces = calculateCharsFromWords(500, { countSpaces: true, avgLetters: 4.7, punctuation: 0 });
      const withoutSpaces = calculateCharsFromWords(500, { countSpaces: false, avgLetters: 4.7, punctuation: 0 });
      expect(withSpaces.characters).toBe(2850);
      expect(withoutSpaces.characters).toBe(2350);
    });

    it('Reverse: 250 words → ≈ 1,425 chars with spaces · 1,175 without', () => {
      const withSpaces = calculateCharsFromWords(250, { countSpaces: true, avgLetters: 4.7, punctuation: 0 });
      const withoutSpaces = calculateCharsFromWords(250, { countSpaces: false, avgLetters: 4.7, punctuation: 0 });
      expect(withSpaces.characters).toBe(1425);
      expect(withoutSpaces.characters).toBe(1175);
    });
  });

  describe('Edge cases and guards', () => {
    it('handles zero and negative characters gracefully without NaN', () => {
      const zero = calculateWordsFromChars(0);
      expect(zero.words).toBe(0);
      expect(zero.rangeLow).toBe(0);
      expect(zero.rangeHigh).toBe(0);

      const neg = calculateWordsFromChars(-50);
      expect(neg.words).toBe(0);
    });

    it('handles zero and negative reverse words gracefully without NaN', () => {
      const zero = calculateCharsFromWords(0);
      expect(zero.characters).toBe(0);

      const neg = calculateCharsFromWords(-10);
      expect(neg.characters).toBe(0);
    });

    it('guards perWord - 1 <= 0 when average letter length is very small without spaces', () => {
      const small = calculateWordsFromChars(100, { countSpaces: false, avgLetters: 0.8, punctuation: 0 });
      expect(small.rangeHigh).toBeGreaterThan(0);
      expect(Number.isFinite(small.rangeHigh)).toBe(true);
    });
  });

  describe('Table generation matches Spec 02 §3.4 reference table', () => {
    const table = generateCharWordTable({ avgLetters: 4.7, punctuation: 0 });

    it('generates rows for all 19 target character counts', () => {
      expect(table).toHaveLength(19);
      expect(table.map((r) => r.chars)).toEqual(CHAR_WORD_TABLE_COUNTS);
    });

    it('verifies exact reference values for 100, 280, 1000, 5300, 10000', () => {
      const r100 = table.find((r) => r.chars === 100)!;
      expect(r100.withSpaces.est).toBe(18);
      expect(r100.withSpaces.low).toBe(15);
      expect(r100.withSpaces.high).toBe(21);
      expect(r100.withoutSpaces.est).toBe(21);
      expect(r100.withoutSpaces.low).toBe(18);
      expect(r100.withoutSpaces.high).toBe(27);

      const r280 = table.find((r) => r.chars === 280)!;
      expect(r280.withSpaces.est).toBe(49);
      expect(r280.withSpaces.low).toBe(42);
      expect(r280.withSpaces.high).toBe(60);
      expect(r280.withoutSpaces.est).toBe(60);
      expect(r280.withoutSpaces.low).toBe(49);
      expect(r280.withoutSpaces.high).toBe(76);

      const r1000 = table.find((r) => r.chars === 1000)!;
      expect(r1000.withSpaces.est).toBe(175);
      expect(r1000.withSpaces.low).toBe(149);
      expect(r1000.withSpaces.high).toBe(213);
      expect(r1000.withoutSpaces.est).toBe(213);
      expect(r1000.withoutSpaces.low).toBe(175);
      expect(r1000.withoutSpaces.high).toBe(270);

      const r5300 = table.find((r) => r.chars === 5300)!;
      expect(r5300.withSpaces.est).toBe(930);
      expect(r5300.withSpaces.low).toBe(791);
      expect(r5300.withSpaces.high).toBe(1128);
      expect(r5300.withoutSpaces.est).toBe(1128);
      expect(r5300.withoutSpaces.low).toBe(930);
      expect(r5300.withoutSpaces.high).toBe(1432);

      const r10000 = table.find((r) => r.chars === 10000)!;
      expect(r10000.withSpaces.est).toBe(1754);
      expect(r10000.withSpaces.low).toBe(1493);
      expect(r10000.withSpaces.high).toBe(2128);
      expect(r10000.withoutSpaces.est).toBe(2128);
      expect(r10000.withoutSpaces.low).toBe(1754);
      expect(r10000.withoutSpaces.high).toBe(2703);
    });
  });

  describe('Input guide sample check (Spec 02 §3.2)', () => {
    it('verifies "Write clear, short answers." phrase properties', () => {
      const phrase = 'Write clear, short answers.';
      const calibration = measureWritingAverages(phrase);
      expect(calibration).not.toBeNull();
      // 27 characters with spaces, 24 without spaces, 4 words
      expect(calibration!.totalCharsWithSpaces).toBe(27);
      expect(calibration!.totalCharsNoSpaces).toBe(24);
      expect(calibration!.totalWords).toBe(4);
      // 27 / 5.7 ≈ 4.7 words estimated
      const est = calculateWordsFromChars(27, { countSpaces: true, avgLetters: 4.7, punctuation: 0 });
      expect(est.words).toBe(5); // Math.round(27 / 5.7 = 4.7368) = 5
    });
  });

  describe('measureWritingAverages ("Use my writing" calibration)', () => {
    it('accurately derives average letters and characters per word from text', () => {
      const text = 'Quick brown fox jumped.';
      // 4 words: Quick (5), brown (5), fox (3), jumped (6) + '.'
      // Total chars with spaces: 23, without spaces: 20
      const stats = measureWritingAverages(text)!;
      expect(stats.totalWords).toBe(4);
      expect(stats.totalCharsWithSpaces).toBe(23);
      expect(stats.totalCharsNoSpaces).toBe(20);
      expect(stats.avgLettersPerWord).toBe(5.0); // 20 / 4
      expect(stats.charsWithSpacesPerWord).toBe(5.8); // 23 / 4 = 5.75 -> 5.8
    });

    it('returns null for empty or whitespace-only text', () => {
      expect(measureWritingAverages('')).toBeNull();
      expect(measureWritingAverages('   \n\t  ')).toBeNull();
    });
  });
});
