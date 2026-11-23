import { describe, it, expect } from 'vitest';
import {
  parseFractionInput,
  calculateFractionToPercent,
  calculateScore,
  percentOf,
  whatPercentIs,
  wholeFromPartAndPercent,
  addPercent,
  subtractPercent,
  gcd,
  isRepeatingDenominator,
} from './fraction-percent-engine';

describe('fraction-percent-engine', () => {
  describe('Spec 07 worked examples', () => {
    it('calculates 4/5 = 80%', () => {
      const res = calculateFractionToPercent(4, 5)!;
      expect(res.percent).toBe(80);
      expect(res.isRepeating).toBe(false);
      expect(res.simplifiedNum).toBe(4);
      expect(res.simplifiedDen).toBe(5);
    });

    it('calculates 3/5 = 60% and 3/4 = 75%', () => {
      expect(calculateFractionToPercent(3, 5)!.percent).toBe(60);
      expect(calculateFractionToPercent(3, 4)!.percent).toBe(75);
    });

    it('calculates 1/3 = 33.3̅% (repeating decimal)', () => {
      const res = calculateFractionToPercent(1, 3)!;
      expect(parseFloat(res.percent.toFixed(2))).toBe(33.33);
      expect(res.isRepeating).toBe(true);
      expect(res.repeatString).toBe('33.3̅%');
    });

    it('calculates 3/8 = 37.5%', () => {
      const res = calculateFractionToPercent(3, 8)!;
      expect(res.percent).toBe(37.5);
      expect(res.isRepeating).toBe(false);
    });

    it('calculates improper fractions: 3/2 = 150%, 5/4 = 125%, 8/3 = 266.6̅%', () => {
      expect(calculateFractionToPercent(3, 2)!.percent).toBe(150);
      expect(calculateFractionToPercent(5, 4)!.percent).toBe(125);
      const res83 = calculateFractionToPercent(8, 3)!;
      expect(parseFloat(res83.percent.toFixed(2))).toBe(266.67);
      expect(res83.isRepeating).toBe(true);
    });

    it('parses mixed numbers: 1 1/4 = 125% and 4 3/4 = 475%', () => {
      const p1 = parseFractionInput('1 1/4')!;
      expect(p1.numerator).toBe(5);
      expect(p1.denominator).toBe(4);
      expect(calculateFractionToPercent(p1.numerator, p1.denominator)!.percent).toBe(125);

      const p2 = parseFractionInput('4 3/4')!;
      expect(p2.numerator).toBe(19);
      expect(p2.denominator).toBe(4);
      expect(calculateFractionToPercent(p2.numerator, p2.denominator)!.percent).toBe(475);
    });

    it('calculates test scores and letter grades', () => {
      // 16 out of 20 = 80% (B)
      const s1 = calculateScore(16, 20)!;
      expect(s1.percent).toBe(80);
      expect(s1.letterGrade).toBe('B');
      expect(s1.nextGradeLetter).toBe('A');
      expect(s1.pointsToNextGrade).toBe(2); // needs 18 for A (90%)

      // 18 out of 20 = 90% (A)
      const s2 = calculateScore(18, 20)!;
      expect(s2.percent).toBe(90);
      expect(s2.letterGrade).toBe('A');
      expect(s2.pointsToNextGrade).toBe(0);

      // 11 out of 15 = 73.33% (C)
      const s3 = calculateScore(11, 15)!;
      expect(parseFloat(s3.percent.toFixed(2))).toBe(73.33);
      expect(s3.letterGrade).toBe('C');

      // 13 out of 15 = 86.67% (B)
      const s4 = calculateScore(13, 15)!;
      expect(parseFloat(s4.percent.toFixed(2))).toBe(86.67);
      expect(s4.letterGrade).toBe('B');

      // 20 out of 25 = 80% (B)
      const s5 = calculateScore(20, 25)!;
      expect(s5.percent).toBe(80);
      expect(s5.letterGrade).toBe('B');

      // 21 out of 25 = 84% (B)
      const s6 = calculateScore(21, 25)!;
      expect(s6.percent).toBe(84);
      expect(s6.letterGrade).toBe('B');

      // 12 of 20 = 60% (D)
      const s7 = calculateScore(12, 20)!;
      expect(s7.percent).toBe(60);
      expect(s7.letterGrade).toBe('D');
    });

    it('handles wrong count mode and bonus points in test scores', () => {
      // 4 wrong out of 20 = 16 right = 80%
      const s = calculateScore(4, 20, true)!;
      expect(s.earned).toBe(16);
      expect(s.percent).toBe(80);

      // 16 out of 20 with 2 bonus points = 18/20 = 90% (A)
      const sBonus = calculateScore(16, 20, false, 2)!;
      expect(sBonus.effectiveEarned).toBe(18);
      expect(sBonus.percent).toBe(90);
      expect(sBonus.letterGrade).toBe('A');
    });

    it('calculates percent of a number operations', () => {
      // 15% of 80 = 12
      expect(percentOf(15, 80)).toBe(12);

      // 12 is what percent of 80? -> 15%
      expect(whatPercentIs(12, 80)).toBe(15);

      // 12 is 15% of what? -> 80
      expect(wholeFromPartAndPercent(12, 15)).toBe(80);

      // Add / Subtract percentage: 80 + 15% = 92; 80 - 15% = 68
      expect(addPercent(80, 15)).toBe(92);
      expect(subtractPercent(80, 15)).toBe(68);

      // 1/4 of 1 percent = 0.25%
      expect(percentOf(0.25, 1)).toBe(0.0025);
    });
  });

  describe('Edge cases and helpers', () => {
    it('handles division by zero cleanly', () => {
      expect(calculateFractionToPercent(5, 0)).toBeNull();
      expect(calculateScore(10, 0)).toBeNull();
      expect(whatPercentIs(10, 0)).toBeNull();
      expect(wholeFromPartAndPercent(10, 0)).toBeNull();
    });

    it('calculates GCD accurately', () => {
      expect(gcd(4, 8)).toBe(4);
      expect(gcd(12, 18)).toBe(6);
      expect(gcd(7, 13)).toBe(1);
    });

    it('detects repeating denominators accurately', () => {
      expect(isRepeatingDenominator(3)).toBe(true);
      expect(isRepeatingDenominator(6)).toBe(true);
      expect(isRepeatingDenominator(7)).toBe(true);
      expect(isRepeatingDenominator(9)).toBe(true);
      expect(isRepeatingDenominator(15)).toBe(true);
      expect(isRepeatingDenominator(2)).toBe(false);
      expect(isRepeatingDenominator(4)).toBe(false);
      expect(isRepeatingDenominator(5)).toBe(false);
      expect(isRepeatingDenominator(8)).toBe(false);
      expect(isRepeatingDenominator(10)).toBe(false);
      expect(isRepeatingDenominator(16)).toBe(false);
      expect(isRepeatingDenominator(20)).toBe(false);
    });
  });
});

describe('repeating percent strings (spec 07 §3.4, exact long division)', () => {
  it('marks the true repeating digit, not a rounded one', () => {
    expect(calculateFractionToPercent(1, 3)!.repeatString).toBe('33.3̅%');
    expect(calculateFractionToPercent(2, 3)!.repeatString).toBe('66.6̅%');
    expect(calculateFractionToPercent(8, 3)!.repeatString).toBe('266.6̅%');
    expect(calculateFractionToPercent(13, 15)!.repeatString).toBe('86.6̅%');
    expect(calculateFractionToPercent(11, 15)!.repeatString).toBe('73.3̅%');
    expect(calculateFractionToPercent(1, 6)!.repeatString).toBe('16.6̅%');
    expect(calculateFractionToPercent(5, 12)!.repeatString).toBe('41.6̅%');
  });

  it('marks multi-digit cycles and falls back for long ones', () => {
    expect(calculateFractionToPercent(1, 22)!.repeatString).toBe('4.5̅4̅%');
    expect(calculateFractionToPercent(1, 7)!.repeatString).toBe('14.2̅8̅5̅7̅1̅4̅%');
    // 1/17 has a 16-digit cycle: rounded with an ellipsis
    expect(calculateFractionToPercent(1, 17)!.repeatString).toBe('5.88…%');
  });
});
