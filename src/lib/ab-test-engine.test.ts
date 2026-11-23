import { describe, it, expect } from 'vitest';
import {
  calculateAbTest,
  calculateSampleSize,
  checkSrm,
  calculateMultiVariantTest,
} from './ab-test-engine';

describe('A/B Test Engine (Spec Worked Examples & Mathematical Rigor)', () => {
  it('Worked Example 1: 5.0% vs 5.7% (10,000 each) yields z = 2.20, p = 0.028, +14.0% lift', () => {
    const res = calculateAbTest({
      controlVisitors: 10000,
      controlConversions: 500,
      variantVisitors: 10000,
      variantConversions: 570,
      confidenceLevel: 0.95,
      isTwoSided: true,
    });

    expect(res.controlRate).toBeCloseTo(0.05, 4);
    expect(res.variantRate).toBeCloseTo(0.057, 4);
    expect(res.relativeLift).toBeCloseTo(14.0, 1);
    expect(res.zScore).toBeCloseTo(2.20, 2);
    expect(res.pValueTwoSided).toBeCloseTo(0.028, 3);
    expect(res.isSignificant).toBe(true);
    expect(res.ciLower).toBeGreaterThan(0); // Entire 95% CI is strictly positive
  });

  it('Worked Example 2: 1.00% vs 1.14% (50,000 each) yields z = 2.152, p = 0.031', () => {
    const res = calculateAbTest({
      controlVisitors: 50000,
      controlConversions: 500, // 1.00%
      variantVisitors: 50000,
      variantConversions: 570, // 1.14%
      confidenceLevel: 0.95,
      isTwoSided: true,
    });

    expect(res.controlRate).toBeCloseTo(0.0100, 4);
    expect(res.variantRate).toBeCloseTo(0.0114, 4);
    expect(res.relativeLift).toBeCloseTo(14.0, 1);
    expect(res.zScore).toBeCloseTo(2.152, 2);
    expect(res.pValueTwoSided).toBeCloseTo(0.031, 3);
    expect(res.isSignificant).toBe(true);
  });

  it('Worked Example 3: Sample Size Calculation for 5% baseline, 10% rel MDE, 80% power yields ~31,234 per arm', () => {
    const res = calculateSampleSize({
      baselineRate: 0.05,
      relativeMde: 0.10, // target = 0.055
      alpha: 0.05,
      power: 0.80,
      isTwoSided: true,
      dailyTraffic: 2000,
    });

    // Fleiss/Miller formula exact value: 31,234
    expect(res.sampleSizePerArm).toBe(31234);
    expect(res.totalSampleSize).toBe(62468);
    expect(res.daysNeeded).toBe(32); // 62468 / 2000 = 31.234 -> 32 days
  });

  it('checks Sample Ratio Mismatch (SRM) on balanced vs imbalanced traffic', () => {
    // Exactly 50/50 split
    const srmBalanced = checkSrm({
      controlVisitors: 10000,
      variantVisitors: 10000,
      plannedControlRatio: 0.5,
    });
    expect(srmBalanced.chiSquare).toBeCloseTo(0, 4);
    expect(srmBalanced.pValue).toBeCloseTo(1, 4);
    expect(srmBalanced.isMismatch).toBe(false);

    // Severe mismatch: expected 10,000 / 10,000, actual 10,000 / 9,200
    const srmSevere = checkSrm({
      controlVisitors: 10000,
      variantVisitors: 9200,
      plannedControlRatio: 0.5,
    });
    expect(srmSevere.chiSquare).toBeGreaterThan(30);
    expect(srmSevere.pValue).toBeLessThan(0.001);
    expect(srmSevere.isMismatch).toBe(true);
  });

  it('handles multi-variant A/B/C testing with Bonferroni correction', () => {
    const res = calculateMultiVariantTest(
      { name: 'Control', visitors: 10000, conversions: 500 },
      [
        { name: 'Variant B', visitors: 10000, conversions: 570 },
        { name: 'Variant C', visitors: 10000, conversions: 610 },
      ],
      0.05,
      'bonferroni'
    );

    expect(res.variants).toHaveLength(2);
    expect(res.nominalAlpha).toBe(0.05);
    expect(res.adjustedAlpha).toBe(0.025); // 0.05 / 2
  });

  it('validates guards and input validation', () => {
    expect(() =>
      calculateAbTest({
        controlVisitors: 1000,
        controlConversions: 1500, // conversions > visitors
        variantVisitors: 1000,
        variantConversions: 50,
        confidenceLevel: 0.95,
        isTwoSided: true,
      })
    ).toThrow();

    expect(() =>
      calculateAbTest({
        controlVisitors: 0,
        controlConversions: 0,
        variantVisitors: 1000,
        variantConversions: 50,
        confidenceLevel: 0.95,
        isTwoSided: true,
      })
    ).toThrow();
  });

  it('states the plain p-value meaning from spec 04 §3.5 (never "X% chance B is better")', () => {
    const res = calculateAbTest({
      controlVisitors: 10000, controlConversions: 500,
      variantVisitors: 10000, variantConversions: 570,
      confidenceLevel: 0.95, isTwoSided: true,
    });
    expect(res.meaning).toBe('If there were truly no difference, a gap this large (in either direction) would show up about 2.8% of the time.');
    expect(res.meaning).not.toMatch(/chance/i);
  });
});

