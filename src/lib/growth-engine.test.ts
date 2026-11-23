import { describe, it, expect } from 'vitest';
import {
  calculateCagr,
  calculateEndFromCagr,
  calculateStartFromCagr,
  calculateYearsFromCagr,
  calculateRealCagr,
  calculateCagrFromSeries,
  calculateDoubling,
  annualizeRoi,
} from './growth-engine';

describe('growth-engine', () => {
  describe('Spec 06 worked examples', () => {
    it('calculates 10,000 to 20,000 in 5 years = 14.87% CAGR', () => {
      const rate = calculateCagr(10000, 20000, 5)!;
      expect(parseFloat((rate * 100).toFixed(2))).toBe(14.87);
    });

    it('round trips Start, End, and Years', () => {
      const cagr = 0.148698354997035;
      const end = calculateEndFromCagr(10000, cagr, 5)!;
      expect(Math.round(end)).toBe(20000);

      const start = calculateStartFromCagr(20000, cagr, 5)!;
      expect(Math.round(start)).toBe(10000);

      const years = calculateYearsFromCagr(10000, 20000, cagr)!;
      expect(parseFloat(years.toFixed(2))).toBe(5.0);
    });

    it('calculates series: 100 -> 50 -> 65 -> 78 with -7.95% CAGR vs 0% average', () => {
      const series = [100, 50, 65, 78];
      const res = calculateCagrFromSeries(series)!;
      expect(parseFloat((res.cagr * 100).toFixed(2))).toBe(-7.95);
      expect(parseFloat((res.arithmeticAverage * 100).toFixed(2))).toBe(0.0);
    });

    it('calculates exact doubling time vs Rule of 72 at 8%', () => {
      const d = calculateDoubling(0.08)!;
      expect(parseFloat(d.exactYears.toFixed(2))).toBe(9.01);
      expect(parseFloat(d.rule72Years.toFixed(2))).toBe(9.0);
    });

    it('annualizes total ROI', () => {
      // 100% total ROI in 5 years is identical to 10k -> 20k in 5 years (14.87%)
      const ann = annualizeRoi(100, 5)!;
      expect(parseFloat(ann.toFixed(2))).toBe(14.87);
    });
  });

  describe('Edge cases and guards', () => {
    it('handles zero or negative inputs cleanly', () => {
      expect(calculateCagr(0, 100, 5)).toBeNull();
      expect(calculateCagr(100, 100, 0)).toBeNull();
      expect(calculateCagr(100, 0, 5)).toBe(-1.0); // 100% loss
      expect(calculateCagr(100, -10, 5)).toBeNull();
    });

    it('calculates real inflation-adjusted CAGR correctly', () => {
      // Nominal 10%, inflation 3% -> (1.10 / 1.03) - 1 ≈ 6.796%
      const real = calculateRealCagr(0.1, 0.03)!;
      expect(parseFloat((real * 100).toFixed(2))).toBe(6.8);
    });
  });
});
