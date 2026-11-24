import { describe, it, expect } from 'vitest';
import {
  calculateKeywordDensity,
  stemPlural,
} from './keyword-density-engine';

describe('Keyword Density Engine', () => {
  const SAMPLE_SPEC =
    'Our word counter counts words fast. A word counter also counts characters. Use the word counter free.';

  it('calculates the worked example for target "word counter" exactly as in Spec 10', () => {
    const report = calculateKeywordDensity(SAMPLE_SPEC, {
      targetPhrase: 'word counter',
    });

    expect(report.totalWords).toBe(17);
    expect(report.targetAnalysis).not.toBeNull();
    expect(report.targetAnalysis?.count).toBe(3);
    expect(report.targetAnalysis?.density).toBe(17.65);
    expect(report.targetAnalysis?.share).toBe(35.29);
    expect(report.targetAnalysis?.firstPosition).toBe(2);
    expect(report.targetAnalysis?.positions).toEqual([2, 8, 15]);
  });

  it('calculates the worked example for target "counts" exactly as in Spec 10', () => {
    const report = calculateKeywordDensity(SAMPLE_SPEC, {
      targetPhrase: 'counts',
    });

    expect(report.totalWords).toBe(17);
    expect(report.targetAnalysis?.count).toBe(2);
    expect(report.targetAnalysis?.density).toBe(11.76);
  });

  it('ensures 2-grams do not cross sentence boundaries and respects stop words toggle', () => {
    const text = 'The cat sat. The cat ran. A dog sat.';

    // With stop words kept (ignoreStopWords: false)
    const reportKept = calculateKeywordDensity(text, {
      ignoreStopWords: false,
      minFrequency: 1,
    });

    expect(reportKept.totalWords).toBe(9);
    const twoGramTerms = reportKept.twoGrams.map((r) => r.term);
    expect(twoGramTerms).toContain('the cat');
    expect(twoGramTerms).toContain('cat sat');
    expect(twoGramTerms).toContain('cat ran');
    expect(twoGramTerms).toContain('a dog');
    expect(twoGramTerms).toContain('dog sat');
    // "sat the" must NOT exist because it crosses sentence boundaries!
    expect(twoGramTerms).not.toContain('sat the');
    expect(twoGramTerms).not.toContain('ran a');

    const theCatRow = reportKept.twoGrams.find((r) => r.term === 'the cat');
    expect(theCatRow?.count).toBe(2);
    expect(theCatRow?.density).toBe(22.22); // 2 / 9 * 100
    expect(theCatRow?.share).toBe(44.44); // 4 / 9 * 100

    // With stop words ignored (default)
    const reportIgnored = calculateKeywordDensity(text, {
      ignoreStopWords: true,
      minFrequency: 1,
    });

    // Total words remains 9 (totals unchanged by stop words filter)
    expect(reportIgnored.totalWords).toBe(9);
    const oneGramTerms = reportIgnored.oneGrams.map((r) => r.term);
    expect(oneGramTerms).toContain('cat');
    expect(oneGramTerms).toContain('sat');
    expect(oneGramTerms).toContain('ran');
    expect(oneGramTerms).toContain('dog');
    expect(oneGramTerms).not.toContain('the');
    expect(oneGramTerms).not.toContain('a');
  });

  it('applies plural stemming rules correctly and avoids stripping protected endings', () => {
    expect(stemPlural('keywords')).toBe('keyword');
    expect(stemPlural('boxes')).toBe('box');
    expect(stemPlural('stories')).toBe('story');
    expect(stemPlural('dishes')).toBe('dish');
    expect(stemPlural('watches')).toBe('watch');

    // Words ending in ss, us, is must never be stripped
    expect(stemPlural('glass')).toBe('glass');
    expect(stemPlural('bus')).toBe('bus');
    expect(stemPlural('analysis')).toBe('analysis');
    expect(stemPlural('status')).toBe('status');
  });

  it('groups plural variants when option is enabled', () => {
    const text = 'The box contained three smaller boxes. Store each story with other stories.';
    const reportWithout = calculateKeywordDensity(text, {
      groupVariants: false,
      minFrequency: 1,
      ignoreStopWords: false,
    });
    const reportWith = calculateKeywordDensity(text, {
      groupVariants: true,
      minFrequency: 1,
      ignoreStopWords: false,
    });

    expect(reportWithout.oneGrams.find((r) => r.term === 'box')?.count).toBe(1);
    expect(reportWithout.oneGrams.find((r) => r.term === 'boxes')?.count).toBe(1);

    expect(reportWith.oneGrams.find((r) => r.term === 'box')?.count).toBe(2);
    expect(reportWith.oneGrams.find((r) => r.term === 'story')?.count).toBe(2);
  });

  it('handles empty or whitespace text gracefully without NaN', () => {
    const empty = calculateKeywordDensity('');
    expect(empty.totalWords).toBe(0);
    expect(empty.oneGrams).toEqual([]);
    expect(empty.targetAnalysis).toBeNull();

    const spaces = calculateKeywordDensity('   \n\t  ');
    expect(spaces.totalWords).toBe(0);
    expect(spaces.targetAnalysis).toBeNull();
  });

  it('generates KWIC windows and 10-decile heatmap accurately', () => {
    const text =
      'One two three four five target six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty.';
    const report = calculateKeywordDensity(text, { targetPhrase: 'target' });

    expect(report.totalWords).toBe(21);
    expect(report.targetAnalysis?.count).toBe(1);
    expect(report.targetAnalysis?.firstPosition).toBe(6);
    expect(report.targetAnalysis?.heat).toEqual([0, 0, 1, 0, 0, 0, 0, 0, 0, 0]);

    const kwic = report.targetAnalysis?.kwic[0];
    expect(kwic?.before).toBe('One two three four five');
    expect(kwic?.match).toBe('target');
    expect(kwic?.after).toBe('six seven eight nine ten');
    expect(kwic?.startIndex).toBe(24);
    expect(kwic?.endIndex).toBe(30);
    expect(text.slice(kwic!.startIndex, kwic!.endIndex)).toBe('target');
  });
});
