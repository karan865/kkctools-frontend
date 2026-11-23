import { describe, it, expect } from 'vitest';
import {
  parseNumbers,
  sum,
  mean,
  median,
  mode,
  calculateQuartiles,
  compareAllQuartileMethods,
  getSummaryStats,
  erf,
  normalCdf,
  normalInverse,
  studentTCdf,
  studentTInverse,
  binomialPmf,
  binomialCdf,
} from './stats-engine';

describe('stats-engine', () => {
  describe('parseNumbers', () => {
    it('parses mixed delimiters: commas, spaces, tabs, newlines', () => {
      const input = '1, 3 5\t7\n9;11  $13 (15)';
      const { numbers, rejectedTokens } = parseNumbers(input);
      expect(numbers).toEqual([1, 3, 5, 7, 9, 11, 13, 15]);
      expect(rejectedTokens).toEqual([]);
    });

    it('captures rejected non-numeric tokens', () => {
      const input = '10, foo, 25, bar, 30';
      const { numbers, rejectedTokens } = parseNumbers(input);
      expect(numbers).toEqual([10, 25, 30]);
      expect(rejectedTokens).toEqual(['foo', 'bar']);
    });
  });

  describe('Basic statistics', () => {
    const data = [1, 3, 5, 7, 9, 11, 13, 15];
    it('calculates sum and mean correctly', () => {
      expect(sum(data)).toBe(64);
      expect(mean(data)).toBe(8);
      expect(median(data)).toBe(8);
    });

    it('calculates mode correctly', () => {
      expect(mode([1, 2, 2, 3])).toEqual([2]);
      expect(mode([1, 2, 3])).toEqual([]); // no mode
      expect(mode([1, 1, 2, 2, 3])).toEqual([1, 2]); // bimodal
    });
  });

  describe('Quartiles worked examples from Spec 03', () => {
    const data1 = [1, 3, 5, 7, 9, 11, 13, 15];

    it('evaluates 1..15 with Tukey (median excluded)', () => {
      const q = calculateQuartiles(data1, 'tukey_exclusive')!;
      expect(q.q1).toBe(4);
      expect(q.q3).toBe(12);
      expect(q.iqr).toBe(8);
      expect(q.lowerInnerFence).toBe(-8);
      expect(q.upperInnerFence).toBe(24);
      expect(q.allOutliers).toEqual([]);
    });

    it('evaluates 1..15 with Inclusive (Excel QUARTILE.INC / R type 7)', () => {
      const q = calculateQuartiles(data1, 'inclusive')!;
      expect(q.q1).toBe(4.5);
      expect(q.q3).toBe(11.5);
      expect(q.iqr).toBe(7);
    });

    it('evaluates 1..15 with Exclusive (Excel QUARTILE.EXC / R type 6)', () => {
      const q = calculateQuartiles(data1, 'exclusive')!;
      expect(q.q1).toBe(3.5);
      expect(q.q3).toBe(12.5);
      expect(q.iqr).toBe(9);
    });

    const data2 = [5, 7, 8, 9];

    it('evaluates 5, 7, 8, 9 with Tukey', () => {
      const q = calculateQuartiles(data2, 'tukey_exclusive')!;
      expect(q.q1).toBe(6);
      expect(q.q3).toBe(8.5);
      expect(q.iqr).toBe(2.5);
    });

    it('evaluates 5, 7, 8, 9 with Exclusive (n+1)', () => {
      const q = calculateQuartiles(data2, 'exclusive')!;
      expect(q.q1).toBe(5.5);
      expect(q.q3).toBe(8.75);
      expect(q.iqr).toBe(3.25);
    });

    it('evaluates 5, 7, 8, 9 with Inclusive', () => {
      const q = calculateQuartiles(data2, 'inclusive')!;
      expect(q.q1).toBe(6.5);
      expect(q.q3).toBe(8.25);
      expect(q.iqr).toBe(1.75);
    });

    it('runs compareAllQuartileMethods returning all 4 rows', () => {
      const rows = compareAllQuartileMethods(data1);
      expect(rows.length).toBe(4);
      expect(rows[0].methodId).toBe('tukey_exclusive');
      expect(rows[0].iqr).toBe(8);
      expect(rows[1].methodId).toBe('inclusive');
      expect(rows[1].iqr).toBe(7);
      expect(rows[2].methodId).toBe('exclusive');
      expect(rows[2].iqr).toBe(9);
    });
  });

  describe('Outliers detection', () => {
    it('detects mild and extreme outliers', () => {
      const withOutliers = [10, 11, 12, 13, 14, 15, 16, 38, 55];
      const stats = getSummaryStats(withOutliers, 'tukey_exclusive')!;
      // Q1 = 11.5, Q3 = 27 (upper half: 15, 16, 38, 55 -> median is 27)
      // IQR = 15.5
      // inner = 27 + 1.5 * 15.5 = 50.25 -> 55 > 50.25
      expect(stats.quartiles.allOutliers.length).toBeGreaterThan(0);
    });
  });

  describe('Distribution functions', () => {
    it('calculates accurate erf and normal CDF', () => {
      expect(erf(0)).toBe(0);
      expect(Math.abs(erf(1) - 0.84270079)).toBeLessThan(1e-6);

      expect(normalCdf(0)).toBe(0.5);
      expect(Math.abs(normalCdf(1.96) - 0.975002)).toBeLessThan(1e-4);
      expect(Math.abs(normalInverse(0.975) - 1.95996)).toBeLessThan(1e-4);
    });

    it('calculates accurate Student t CDF and p-value', () => {
      // Worked example from Spec 13: Welch t = 1.753, df = 56.17 -> two-tailed p ≈ 0.085
      const t = 1.753;
      const df = 56.17;
      const cdf = studentTCdf(t, df);
      const twoTailedP = 2 * (1 - cdf);
      expect(parseFloat(twoTailedP.toFixed(3))).toBe(0.085);

      // Invert check
      const tInvert = studentTInverse(cdf, df);
      expect(Math.abs(tInvert - t)).toBeLessThan(1e-4);
    });

    it('calculates accurate Binomial PMF and CDF', () => {
      // 10 coin flips, 5 heads: P(X=5) = 252/1024 = 0.24609375
      const pmf = binomialPmf(5, 10, 0.5);
      expect(Math.abs(pmf - 0.24609375)).toBeLessThan(1e-6);

      // P(X <= 5) for B(10, 0.5) = 0.623046875
      const cdf = binomialCdf(5, 10, 0.5);
      expect(Math.abs(cdf - 0.623046875)).toBeLessThan(1e-6);
    });
  });

  describe('studentTInverse wide tails', () => {
    it('finds critical t far beyond 100 for df = 1', () => {
      // R: qt(0.9995, 1) = 636.6192
      expect(studentTInverse(0.9995, 1)).toBeCloseTo(636.6192, 2);
      expect(studentTInverse(0.0005, 1)).toBeCloseTo(-636.6192, 2);
      // R: qt(0.975, 56.17335) = 2.003104
      expect(studentTInverse(0.975, 56.17334721499219)).toBeCloseTo(2.003104, 5);
    });
  });
});
