import { describe, it, expect } from 'vitest';
import {
  pctChange,
  pctDifference,
  applyPct,
  reversePct,
  pctOf,
  whatPct,
  ppDifference,
  listChanges,
  excelFormula,
  formatPct,
  formatNumber,
} from './percent-engine';

describe('Percent Engine — Pure Math & Formula Verification', () => {
  describe('pctChange (Signed Percentage Change)', () => {
    it('calculates 80 -> 100 as exactly +25%', () => {
      expect(pctChange(80, 100)).toBe(25);
    });

    it('calculates 100 -> 80 as exactly -20% (demonstrates asymmetry)', () => {
      expect(pctChange(100, 80)).toBe(-20);
    });

    it('returns null when oldVal is 0 (division by zero is mathematically undefined)', () => {
      expect(pctChange(0, 50)).toBeNull();
      expect(pctChange(0, 0)).toBeNull();
      expect(pctChange(0, -10)).toBeNull();
    });

    it('handles negative starting values correctly using absolute value denominator', () => {
      // From -50 to -25 is an increase of 25 towards zero: (-25 - (-50)) / |-50| = +50%
      expect(pctChange(-50, -25)).toBe(50);
      // From -50 to -75 is a decrease of 25: (-75 - (-50)) / |-50| = -50%
      expect(pctChange(-50, -75)).toBe(-50);
      // From -50 to +50 is an increase of 100: (50 - (-50)) / |-50| = +200%
      expect(pctChange(-50, 50)).toBe(200);
    });

    it('normalises -0 to 0', () => {
      const res = pctChange(10, 10);
      expect(res).toBe(0);
      expect(Object.is(res, -0)).toBe(false);
    });

    it('handles increases greater than 100%', () => {
      // 50 to 125 = +150% increase (2.5x)
      expect(pctChange(50, 125)).toBe(150);
    });
  });

  describe('pctDifference (Symmetric Difference)', () => {
    it('calculates percentage difference of 80 and 100 as ~22.22%', () => {
      const diff1 = pctDifference(80, 100);
      const diff2 = pctDifference(100, 80);
      expect(diff1).not.toBeNull();
      expect(diff2).not.toBeNull();
      // |80 - 100| / ((80 + 100)/2) * 100 = 20 / 90 * 100 = 22.2222%
      expect(diff1!).toBeCloseTo(22.2222, 3);
      // Order does not matter for difference
      expect(diff1).toBe(diff2);
    });

    it('returns null if both values are 0', () => {
      expect(pctDifference(0, 0)).toBeNull();
    });

    it('returns 0 when both values are identical', () => {
      expect(pctDifference(50, 50)).toBe(0);
    });
  });

  describe('applyPct (Increase / Decrease by %)', () => {
    it('increases a number by positive percentage', () => {
      // 100 + 15% = 115
      expect(applyPct(100, 15)).toBe(115);
      // 80 + 25% = 100
      expect(applyPct(80, 25)).toBe(100);
    });

    it('decreases a number with negative percentage (discount)', () => {
      // 100 - 20% = 80
      expect(applyPct(100, -20)).toBe(80);
      // 50 - 30% = 35
      expect(applyPct(50, -30)).toBe(35);
    });

    it('returns 0 if 100% decrease', () => {
      expect(applyPct(100, -100)).toBe(0);
    });
  });

  describe('reversePct (Find Original Value)', () => {
    it('reverses 115 after +15% to give 100', () => {
      const orig = reversePct(115, 15);
      expect(orig).not.toBeNull();
      expect(orig!).toBeCloseTo(100, 4);
    });

    it('reverses 80 after -20% to give 100', () => {
      const orig = reversePct(80, -20);
      expect(orig).not.toBeNull();
      expect(orig!).toBeCloseTo(100, 4);
    });

    it('returns null if p is -100 (original cannot be recovered from 0)', () => {
      expect(reversePct(0, -100)).toBeNull();
    });
  });

  describe('pctOf & whatPct', () => {
    it('calculates X% of Y', () => {
      // 10% of 50 = 5
      expect(pctOf(10, 50)).toBe(5);
      // 25% of 200 = 50
      expect(pctOf(25, 200)).toBe(50);
    });

    it('calculates X is what % of Y', () => {
      // 10 is what % of 40 = 25%
      expect(whatPct(10, 40)).toBe(25);
      // 20 is what % of 80 = 25%
      expect(whatPct(20, 80)).toBe(25);
    });

    it('returns null for whatPct when Y is 0', () => {
      expect(whatPct(10, 0)).toBeNull();
    });
  });

  describe('ppDifference (Percentage Points)', () => {
    it('calculates 4% to 5% as +1 pp but +25% relative increase', () => {
      const res = ppDifference(4, 5);
      expect(res.points).toBe(1);
      expect(res.percent).toBe(25);
    });

    it('calculates 10% to 8% as -2 pp and -20% relative change', () => {
      const res = ppDifference(10, 8);
      expect(res.points).toBe(-2);
      expect(res.percent).toBe(-20);
    });
  });

  describe('listChanges (List Mode Aggregation)', () => {
    it('demonstrates that average of % changes does NOT equal total aggregate % change', () => {
      // Item A: 10 -> 20 (+100%)
      // Item B: 1000 -> 1010 (+1%)
      const pairs = [
        { oldVal: 10, newVal: 20, label: 'Small Item' },
        { oldVal: 1000, newVal: 1010, label: 'Large Item' },
      ];
      const result = listChanges(pairs);

      expect(result.rows.length).toBe(2);
      expect(result.rows[0].pctChange).toBe(100);
      expect(result.rows[1].pctChange).toBe(1);

      // Average of individual changes: (100% + 1%) / 2 = 50.5%
      expect(result.averagePctChange).toBe(50.5);

      // True aggregate total change: (1030 - 1010) / 1010 * 100 = 20 / 1010 * 100 = ~1.9802%
      expect(result.totalOld).toBe(1010);
      expect(result.totalNew).toBe(1030);
      expect(result.totalAbsChange).toBe(20);
      expect(result.totalPctChange).not.toBeNull();
      expect(result.totalPctChange!).toBeCloseTo(1.9802, 3);

      // Mathematically they must NOT be equal!
      expect(result.averagePctChange).not.toBe(result.totalPctChange);
    });

    it('handles empty list gracefully', () => {
      const empty = listChanges([]);
      expect(empty.rows.length).toBe(0);
      expect(empty.totalOld).toBe(0);
      expect(empty.totalPctChange).toBeNull();
      expect(empty.averagePctChange).toBeNull();
    });
  });

  describe('excelFormula (Spreadsheet Formula Output)', () => {
    it('generates correct percentage change formula with default and custom cells', () => {
      const def = excelFormula('change');
      expect(def.formula).toBe('=(B2-A2)/ABS(A2)');
      expect(def.note).toContain('Format the formula cell as Percentage');

      const custom = excelFormula('change', { oldCell: 'C5', newCell: 'D5' });
      expect(custom.formula).toBe('=(D5-C5)/ABS(C5)');
    });

    it('generates correct difference formula', () => {
      const diff = excelFormula('difference', { oldCell: 'X1', newCell: 'Y1' });
      expect(diff.formula).toBe('=ABS(X1-Y1)/AVERAGE(X1,Y1)');
    });

    it('generates correct reverse percentage formula', () => {
      const rev = excelFormula('original', { oldCell: 'B2', newCell: 'A2' });
      expect(rev.formula).toBe('=A2/(1+B2)');
    });
  });

  describe('Formatting Utilities', () => {
    it('formats percentage with sign and decimals', () => {
      expect(formatPct(25)).toBe('+25.00%');
      expect(formatPct(-20)).toBe('-20.00%');
      expect(formatPct(0)).toBe('0.00%');
      expect(formatPct(null)).toBe('Undefined');
    });

    it('formats numbers cleanly', () => {
      expect(formatNumber(12500.5)).toBe('12,500.5');
      expect(formatNumber(100)).toBe('100');
    });
  });
});
