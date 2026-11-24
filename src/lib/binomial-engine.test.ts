import { describe, it, expect } from 'vitest';
import {
  calculateBinomial,
  calculateTrialsNeeded,
  calculateInverseCdf,
} from './binomial-engine';

describe('binomial-engine', () => {
  describe('Spec 12 Worked Examples', () => {
    // Spec: n = 10, p = 0.5
    // P(X = 3) = 0.1172, P(X <= 3) = 0.1719, mean = 5, variance = 2.5, SD = 1.581, mode = 5
    it('calculates n = 10, p = 0.5, k = 3: P(X = 3) = 0.1172 and P(X <= 3) = 0.1719', () => {
      const res = calculateBinomial(10, 0.5, 3, 'exact')!;
      expect(parseFloat(res.selectedProbability.toFixed(4))).toBe(0.1172);
      expect(parseFloat(res.exactPmf.toFixed(4))).toBe(0.1172);
      expect(parseFloat(res.atMostCdf.toFixed(4))).toBe(0.1719);
      expect(res.moments.mean).toBe(5);
      expect(res.moments.variance).toBe(2.5);
      expect(parseFloat(res.moments.sd.toFixed(3))).toBe(1.581);
      expect(res.moments.modes).toContain(5);
    });

    it('calculates at_most comparison correctly: P(X <= 3) = 0.1719', () => {
      const res = calculateBinomial(10, 0.5, 3, 'at_most')!;
      expect(parseFloat(res.selectedProbability.toFixed(4))).toBe(0.1719);
    });

    it('calculates at_least comparison correctly: P(X >= 3) = 1 - P(X <= 2)', () => {
      const res = calculateBinomial(10, 0.5, 3, 'at_least')!;
      // P(X <= 2) = 0.0547, so P(X >= 3) = 0.9453
      expect(parseFloat(res.selectedProbability.toFixed(4))).toBe(0.9453);
    });

    it('calculates between comparison correctly: P(2 <= X <= 4)', () => {
      const res = calculateBinomial(10, 0.5, 2, 'between', 4)!;
      // P(X=2) = 0.0439, P(X=3) = 0.1172, P(X=4) = 0.2051 -> sum = 0.3662
      expect(parseFloat(res.selectedProbability.toFixed(4))).toBe(0.3662);
    });

    // Spec worked example 2: Trials needed for 99.99% chance of at least one success at p = 1%
    // Output: 917
    it('calculates trials needed for 99.99% at p = 1% => exactly 917 trials', () => {
      const trials = calculateTrialsNeeded(0.9999, 0.01)!;
      expect(trials).toBe(917);
    });
  });

  describe('Normal approximation with continuity correction', () => {
    it('flags not applicable when np < 10 (e.g. n = 10, p = 0.5 => np = 5)', () => {
      const res = calculateBinomial(10, 0.5, 3)!;
      expect(res.normalApprox.isApplicable).toBe(false);
      expect(res.normalApprox.np).toBe(5);
    });

    it('accurately computes normal approx when np >= 10 and n(1-p) >= 10 (e.g. n = 100, p = 0.5)', () => {
      const res = calculateBinomial(100, 0.5, 45, 'at_most')!;
      expect(res.normalApprox.isApplicable).toBe(true);
      expect(res.normalApprox.np).toBe(50);
      expect(res.normalApprox.nq).toBe(50);
      // Exact P(X <= 45) for B(100, 0.5) is 0.1841
      expect(parseFloat(res.exactPmf.toFixed(4))).toBeDefined();
      // Approx with continuity correction P(Z <= (45.5 - 50)/5) = P(Z <= -0.9) = 0.1841
      expect(parseFloat(res.normalApprox.approxProbability.toFixed(4))).toBe(0.1841);
      expect(res.normalApprox.absoluteError).toBeLessThan(0.005);
    });
  });

  describe('Inverse CDF & Edge cases', () => {
    it('finds smallest k for target cumulative probability', () => {
      // For n = 10, p = 0.5: P(X <= 5) = 0.6230 >= 0.5
      const k = calculateInverseCdf(10, 0.5, 0.5)!;
      expect(k).toBe(5);
    });

    it('handles p = 0 and p = 1 gracefully', () => {
      const res0 = calculateBinomial(10, 0, 0)!;
      expect(res0.selectedProbability).toBe(1);
      const res1 = calculateBinomial(10, 1, 10)!;
      expect(res1.selectedProbability).toBe(1);
    });

    it('returns null for invalid inputs', () => {
      expect(calculateBinomial(0, 0.5, 2)).toBeNull();
      expect(calculateBinomial(10, -0.1, 2)).toBeNull();
      expect(calculateBinomial(10, 1.2, 2)).toBeNull();
      expect(calculateTrialsNeeded(0, 0.5)).toBeNull();
    });
  });
});
