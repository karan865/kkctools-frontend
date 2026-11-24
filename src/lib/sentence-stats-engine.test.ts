import { describe, it, expect } from 'vitest';
import { calculateSentenceStats, analyzeParagraphs } from './sentence-stats-engine';
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
