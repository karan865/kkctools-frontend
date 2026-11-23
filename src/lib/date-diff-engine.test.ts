import { describe, it, expect } from 'vitest';
import {
  parseISODate,
  formatISODate,
  calculateDateDiff,
  calculateBornOnOrBefore,
  calculateYearFraction,
  compareFamilyAges,
  isLeapYear,
} from './date-diff-engine';

describe('date-diff-engine', () => {
  describe('Spec 02 worked examples (Month-Stepping calendar math)', () => {
    it('1990-03-15 vs 1994-07-02 = 4 years, 3 months, 17 days (1,570 days)', () => {
      const a = parseISODate('1990-03-15')!;
      const b = parseISODate('1994-07-02')!;
      const diff = calculateDateDiff(a, b);

      expect(diff.years).toBe(4);
      expect(diff.months).toBe(3);
      expect(diff.days).toBe(17);
      expect(diff.totalDays).toBe(1570);
      expect(diff.isNegative).toBe(false);
    });

    it('Fixture: 1948-11-14 vs 1961-07-01 = 12 years, 7 months, 17 days', () => {
      const a = parseISODate('1948-11-14')!;
      const b = parseISODate('1961-07-01')!;
      const diff = calculateDateDiff(a, b);

      expect(diff.years).toBe(12);
      expect(diff.months).toBe(7);
      expect(diff.days).toBe(17);
    });

    it('Month-stepping: 2026-01-31 to 2026-03-01 = 0 y, 1 m, 1 d', () => {
      const a = parseISODate('2026-01-31')!;
      const b = parseISODate('2026-03-01')!;
      const diff = calculateDateDiff(a, b);

      expect(diff.years).toBe(0);
      expect(diff.months).toBe(1);
      expect(diff.days).toBe(1);
      expect(diff.totalDays).toBe(29);
    });

    it('Born on or before 21 years old as of 2026-11-22 = 2005-11-22', () => {
      const asOf = parseISODate('2026-11-22')!;
      const born = calculateBornOnOrBefore(21, asOf);
      expect(formatISODate(born)).toBe('2005-11-22');
    });

    it('handles reversed order dates without error', () => {
      const a = parseISODate('1990-03-15')!;
      const b = parseISODate('1994-07-02')!;
      const diffReversed = calculateDateDiff(b, a);

      expect(diffReversed.years).toBe(4);
      expect(diffReversed.months).toBe(3);
      expect(diffReversed.days).toBe(17);
      expect(diffReversed.isNegative).toBe(true);
    });

    it('compares family members sorted oldest to youngest with pairwise gaps and spread', () => {
      const asOf = parseISODate('2026-11-23')!;
      const fam = [
        { name: 'Sam', dob: parseISODate('1994-07-02')! },
        { name: 'Alex', dob: parseISODate('1990-03-15')! },
        { name: 'Charlie', dob: parseISODate('2000-01-01')! },
      ];
      const res = compareFamilyAges(fam, asOf);
      expect(res).not.toBeNull();
      // Oldest is Alex (1990)
      expect(res?.membersSorted[0].name).toBe('Alex');
      // Second is Sam (1994)
      expect(res?.membersSorted[1].name).toBe('Sam');
      // Youngest is Charlie (2000)
      expect(res?.membersSorted[2].name).toBe('Charlie');

      // Gap between Alex and Sam is 4 y 3 m 17 d
      expect(res?.membersSorted[0].gapToNext?.years).toBe(4);
      expect(res?.membersSorted[0].gapToNext?.months).toBe(3);
      expect(res?.membersSorted[0].gapToNext?.days).toBe(17);

      // Overall spread: Alex (1990-03-15) to Charlie (2000-01-01) = 9 y 9 m 17 d
      expect(res?.overallSpread?.years).toBe(9);
      expect(res?.overallSpread?.months).toBe(9);
      expect(res?.overallSpread?.days).toBe(17);
    });
  });

  describe('Financial Day-count conventions', () => {
    it('calculates ACT/365, ACT/360, and 30/360 correctly', () => {
      const start = parseISODate('2026-01-01')!;
      const end = parseISODate('2026-07-01')!; // 181 actual days

      expect(calculateYearFraction(start, end, 'ACT/365')).toBeCloseTo(181 / 365, 5);
      expect(calculateYearFraction(start, end, 'ACT/360')).toBeCloseTo(181 / 360, 5);
      expect(calculateYearFraction(start, end, '30/360')).toBeCloseTo(180 / 360, 5);
    });
  });

  describe('Leap year detection', () => {
    it('identifies leap years accurately', () => {
      expect(isLeapYear(2024)).toBe(true);
      expect(isLeapYear(2026)).toBe(false);
      expect(isLeapYear(2000)).toBe(true);
      expect(isLeapYear(1900)).toBe(false);
    });
  });
});
