import { describe, it, expect } from 'vitest';
import {
  calculateTwoSampleTTest,
  calculatePairedTTest,
  calculateOneSampleTTest,
} from './t-test-engine';

describe('t-test-engine', () => {
  describe('Spec 13 worked examples', () => {
    // Group 1: n = 30, mean = 75, sd = 10
    // Group 2: n = 30, mean = 70, sd = 12
    it('calculates Welch t-test: t = 1.753, df = 56.17, p = 0.085 (two-tailed)', () => {
      const res = calculateTwoSampleTTest(30, 75, 10, 30, 70, 12, true, 0.05, 'two')!;
      expect(parseFloat(res.t.toFixed(3))).toBe(1.753);
      expect(parseFloat(res.df.toFixed(2))).toBe(56.17);
      expect(parseFloat(res.pValue.toFixed(3))).toBe(0.085);
      expect(res.isSignificant).toBe(false);
      expect(res.testType).toBe('welch');
    });

    it('calculates Pooled variance t-test: t = 1.753, df = 58, p = 0.0848 (two-tailed)', () => {
      const res = calculateTwoSampleTTest(30, 75, 10, 30, 70, 12, false, 0.05, 'two')!;
      expect(parseFloat(res.t.toFixed(3))).toBe(1.753);
      expect(res.df).toBe(58);
      expect(parseFloat(res.pValue.toFixed(4))).toBe(0.0848);
      expect(res.isSignificant).toBe(false);
      expect(res.testType).toBe('pooled');
    });

    it('calculates one-tailed Welch t-test correctly', () => {
      const res = calculateTwoSampleTTest(30, 75, 10, 30, 70, 12, true, 0.05, 'one_greater')!;
      expect(parseFloat(res.pValue.toFixed(3))).toBe(0.043); // 0.085 / 2
      expect(res.isSignificant).toBe(true);
    });

    it('calculates paired t-test correctly', () => {
      // 20 pairs with mean difference of 2.5 and sd of difference = 4.0
      const res = calculatePairedTTest(20, 2.5, 4.0, 0.05, 'two')!;
      // t = 2.5 / (4.0 / sqrt(20)) = 2.5 / 0.8944 = 2.795
      expect(parseFloat(res.t.toFixed(3))).toBe(2.795);
      expect(res.df).toBe(19);
      expect(res.isSignificant).toBe(true);
      expect(res.testType).toBe('paired');
    });

    it('calculates one-sample t-test correctly', () => {
      // Sample of 25 with mean 104, sd 10, hypothesized mu0 = 100
      const res = calculateOneSampleTTest(25, 104, 10, 100, 0.05, 'two')!;
      // t = (104 - 100) / (10 / 5) = 4 / 2 = 2.0
      expect(res.t).toBe(2.0);
      expect(res.df).toBe(24);
      expect(parseFloat(res.pValue.toFixed(3))).toBe(0.057);
      expect(res.isSignificant).toBe(false);
      expect(res.testType).toBe('one_sample');
    });
  });

  describe('Edge cases and guards', () => {
    it('returns null for insufficient sample size or invalid standard deviation', () => {
      expect(calculateTwoSampleTTest(1, 10, 2, 10, 8, 2)).toBeNull();
      expect(calculateTwoSampleTTest(10, 10, 0, 10, 8, 2)).toBeNull();
      expect(calculatePairedTTest(1, 2, 2)).toBeNull();
      expect(calculateOneSampleTTest(1, 10, 2, 5)).toBeNull();
    });
  });
});
