import { describe, it, expect } from 'vitest';
import {
  parseRatioTerm,
  gcd,
  gcdAll,
  simplifyRatio,
  solveProportion,
  splitTotalByRatio,
  generateEquivalents,
  areRatiosEquivalent,
  ratioToFractionsAndPercentages,
} from './ratio-engine';

describe('ratio-engine', () => {
  describe('parseRatioTerm', () => {
    it('parses integers, decimals, simple fractions and mixed fractions', () => {
      expect(parseRatioTerm('12')).toBe(12);
      expect(parseRatioTerm('1.5')).toBe(1.5);
      expect(parseRatioTerm('1/2')).toBe(0.5);
      expect(parseRatioTerm('3/4')).toBe(0.75);
      expect(parseRatioTerm('1 1/4')).toBe(1.25);
      expect(parseRatioTerm('2 1/2')).toBe(2.5);
      expect(parseRatioTerm('0')).toBe(0);
      expect(parseRatioTerm('')).toBeNull();
      expect(parseRatioTerm('invalid')).toBeNull();
      expect(parseRatioTerm('1/0')).toBeNull();
    });
  });

  describe('gcd and gcdAll', () => {
    it('computes gcd correctly', () => {
      expect(gcd(12, 18)).toBe(6);
      expect(gcd(24, 36)).toBe(12);
      expect(gcdAll([12, 18])).toBe(6);
      expect(gcdAll([10, 20, 30])).toBe(10);
      expect(gcdAll([1, 2, 3])).toBe(1);
    });
  });

  describe('Spec Worked Examples', () => {
    // 1. Simplify 12:18 -> 2:3 (GCD 6)
    it('simplifies 12:18 to 2:3 with GCD 6', () => {
      const res = simplifyRatio([12, 18]);
      expect(res).not.toBeNull();
      expect(res?.simplifiedTerms).toEqual([2, 3]);
      expect(res?.gcd).toBe(6);
      expect(res?.ratioString).toBe('2 : 3');
      expect(res?.oneToN).toBe('1 : 1.50');
    });

    // 2. Simplify 1/2 : 3/4 -> 2:3
    it('simplifies 1/2 : 3/4 to 2:3', () => {
      const t1 = parseRatioTerm('1/2')!;
      const t2 = parseRatioTerm('3/4')!;
      const res = simplifyRatio([t1, t2]);
      expect(res).not.toBeNull();
      expect(res?.simplifiedTerms).toEqual([2, 3]);
      expect(res?.ratioString).toBe('2 : 3');
    });

    // 3. Solve 2:3 = 10:x -> x = 15
    it('solves 2:3 = 10:x to get x = 15', () => {
      const res = solveProportion([2, 3], [10, null]);
      expect(res).not.toBeNull();
      expect(res?.xValue).toBe(15);
      expect(res?.crossMultiplication).toContain('x = 30 / 2 = 15');
    });

    // 4. Split 60 kg as 1:2:3 -> 10 / 20 / 30 kg
    it('splits 60 kg in ratio 1:2:3 into 10, 20, 30 kg', () => {
      const res = splitTotalByRatio(60, [1, 2, 3], 'kg');
      expect(res).not.toBeNull();
      expect(res?.shares[0].amount).toBe(10);
      expect(res?.shares[1].amount).toBe(20);
      expect(res?.shares[2].amount).toBe(30);
      expect(res?.shares[0].percentage).toBeCloseTo(16.67, 1);
      expect(res?.shares[1].percentage).toBeCloseTo(33.33, 1);
      expect(res?.shares[2].percentage).toBeCloseTo(50.0, 1);
      expect(res?.unroundedSum).toBe(60);
    });

    // 5. 3:4 as shares -> 42.86% / 57.14% (not 75/25)
    it('converts 3:4 into part-of-whole shares of 42.86% and 57.14%', () => {
      const res = ratioToFractionsAndPercentages([3, 4]);
      expect(res).not.toBeNull();
      expect(res?.partOfWhole[0].percentage).toBe(42.86);
      expect(res?.partOfWhole[1].percentage).toBe(57.14);
      expect(res?.partOfWhole[0].fraction).toBe('3/7');
      expect(res?.partOfWhole[1].fraction).toBe('4/7');
      // Part-to-part ratio is 75%
      expect(res?.partToPart.percentage).toBe(75);
    });

    // 6. Check 4:6 vs 6:9 -> equivalent (both 2:3)
    it('verifies 4:6 and 6:9 are equivalent', () => {
      expect(areRatiosEquivalent([4, 6], [6, 9])).toBe(true);
      expect(areRatiosEquivalent([4, 6], [6, 10])).toBe(false);
    });
  });

  describe('generateEquivalents', () => {
    it('generates equivalents for 5:2 with multipliers 1 through 5', () => {
      const list = generateEquivalents([5, 2], 5);
      expect(list.length).toBe(5);
      expect(list[0].terms).toEqual([5, 2]);
      expect(list[1].terms).toEqual([10, 4]);
      expect(list[2].terms).toEqual([15, 6]);
      expect(list[3].terms).toEqual([20, 8]);
      expect(list[4].terms).toEqual([25, 10]);
    });
  });

  describe('Edge cases and N-part ratios', () => {
    it('simplifies 3-part ratio 24:36:48 to 2:3:4', () => {
      const res = simplifyRatio([24, 36, 48]);
      expect(res?.simplifiedTerms).toEqual([2, 3, 4]);
      expect(res?.gcd).toBe(12);
    });

    it('rejects zero or negative terms in simplifyRatio', () => {
      expect(simplifyRatio([0, 5])).toBeNull();
      expect(simplifyRatio([-2, 6])).toBeNull();
    });

    it('solves proportion when unknown is in ratio 1', () => {
      const res = solveProportion([null, 3], [10, 15]);
      expect(res).not.toBeNull();
      expect(res?.xValue).toBe(2);
    });
  });
});

describe('fraction and decimal terms (spec 01 §3.4: LCM of denominators)', () => {
  it('scales 1/7 : 2/7 by 7 and simplifies to 1 : 2', () => {
    const res = simplifyRatio([1 / 7, 2 / 7]);
    expect(res?.multiplier).toBe(7);
    expect(res?.ratioString).toBe('1 : 2');
  });

  it('gives exact part-of-whole fractions for decimal terms', () => {
    const res = ratioToFractionsAndPercentages([1.5, 2.5]);
    expect(res?.partOfWhole.map((p) => p.fraction)).toEqual(['3/8', '5/8']);
    expect(res?.partOfWhole[0].percentage).toBe(37.5);
  });
});
