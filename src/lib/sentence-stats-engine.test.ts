import { describe, it, expect } from 'vitest';
import {
  calculateSentenceStats,
  analyzeParagraphs,
  extractSentenceOffsets,
} from './sentence-stats-engine';
import { extractSentences, countWords } from './text-engine';

describe('sentence-stats-engine', () => {
  describe('Worked examples from Spec 09 §3.4', () => {
    const fixture =
      'Dr. Smith arrived at 3.30 p.m. on Monday. He paid $4.50 for coffee! Was it worth it? J. K. Rowling wrote it... and then she left. Visit example.com/a.b for more.';

    it('splits the 5-sentence fixture correctly where raw Intl yields 8', () => {
      const sentences = extractSentences(fixture);
      expect(sentences.length).toBe(5);
    });

    it('calculates exact stats for the 5-sentence fixture', () => {
      const sentences = extractSentences(fixture);
      // console.log sentences and their words
      const words = sentences.map((s) => ({ s: s.trim(), w: countWords(s.trim()) }));
      // console.log(words);
      const stats = calculateSentenceStats(fixture, { threshold: 25 });
      expect(stats.totalSentences).toBe(5);
      expect(stats.wordsPerSentence).toEqual(words.map((x) => x.w));
    });

    it('Mr. and Mrs. Lee met Prof. Ray at 9 a.m. on Monday -> 1 sentence', () => {
      const text = 'Mr. and Mrs. Lee met Prof. Ray at 9 a.m. on Monday.';
      const s = extractSentences(text);
      expect(s.length).toBe(1);
    });

    it('handles quotes staying with sentence', () => {
      const text = 'He said “Stop!” Then he left.';
      const s = extractSentences(text);
      expect(s.length).toBe(2);
    });

    it('maps source offsets accurately including repeated sentences', () => {
      const sample = 'First test sentence. Second test sentence! First test sentence.';
      const offsets = extractSentenceOffsets(sample);
      expect(offsets.length).toBe(3);

      expect(offsets[0].text).toBe('First test sentence.');
      expect(offsets[0].startIndex).toBe(0);
      expect(offsets[0].endIndex).toBe(20);
      expect(sample.slice(offsets[0].startIndex, offsets[0].endIndex)).toBe('First test sentence.');

      expect(offsets[1].text).toBe('Second test sentence!');
      expect(offsets[1].startIndex).toBe(21);
      expect(offsets[1].endIndex).toBe(42);
      expect(sample.slice(offsets[1].startIndex, offsets[1].endIndex)).toBe('Second test sentence!');

      // The repeated sentence must disambiguate to the second occurrence
      expect(offsets[2].text).toBe('First test sentence.');
      expect(offsets[2].startIndex).toBe(43);
      expect(offsets[2].endIndex).toBe(63);
      expect(sample.slice(offsets[2].startIndex, offsets[2].endIndex)).toBe('First test sentence.');

      // Also verify calculateSentenceStats carries the offsets
      const stats = calculateSentenceStats(sample);
      expect(stats.sentences[0].startIndex).toBe(0);
      expect(stats.sentences[1].startIndex).toBe(21);
      expect(stats.sentences[2].startIndex).toBe(43);
    });
  });

  describe('Paragraph breakdown & guideline flags', () => {
    it('analyzes paragraphs and flags blocks over 150 words', () => {
      const shortP = 'This is a brief introductory paragraph.';
      const longP = Array(155).fill('word').join(' ') + '.';
      const multi = `${shortP}\n\n${longP}`;

      const paras = analyzeParagraphs(multi, 'blankLine');
      expect(paras.length).toBe(2);
      expect(paras[0].flag150).toBe(false);
      expect(paras[1].flag150).toBe(true);
      expect(paras[1].flag250).toBe(false);
    });
  });
});
