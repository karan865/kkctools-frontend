import { describe, it, expect } from 'vitest';
import {
  calculateSaleFee,
  calculateGrossUp,
  calculateMonthlyFees,
  calculatePlanBreakEven,
  calculateSurcharge,
  comparePresets,
} from './processing-fee-engine';
import { VERIFIED_PROCESSOR_PRESETS } from '@/content/processing-fee-presets';

describe('processing-fee-engine', () => {
  it('verifies spec worked example: 2.9% + $0.30 on a $100 sale', () => {
    const res = calculateSaleFee(100, 2.9, 0.30);
    expect(res.fee).toBe(3.20);
    expect(res.net).toBe(96.80);
    expect(res.effectivePct).toBe(3.20);
  });

  it('verifies spec gross-up worked example: charge needed to receive $100 net', () => {
    const gross = calculateGrossUp(100, 2.9, 0.30);
    expect(gross).toBe(103.30);

    // Round-trip check: fee on $103.30 should net $100.00
    const feeOnGross = calculateSaleFee(gross!, 2.9, 0.30);
    expect(Math.round(feeOnGross.net)).toBe(100);
  });

  it('handles fee >= 100% gracefully by returning null for gross-up', () => {
    expect(calculateGrossUp(100, 100, 0.30)).toBeNull();
    expect(calculateGrossUp(100, 105, 0.30)).toBeNull();
  });

  it('handles zero and negative amounts safely', () => {
    const zeroRes = calculateSaleFee(0, 2.9, 0.30);
    expect(zeroRes.fee).toBe(0);
    expect(zeroRes.net).toBe(0);
    expect(calculateGrossUp(0, 2.9, 0.30)).toBe(0);
  });

  it('calculates international card and currency conversion fees correctly', () => {
    // $100 sale at 2.9% + $0.30 + 1.5% intl + 1.0% FX = 5.4% + $0.30 = $5.70 fee
    const res = calculateSaleFee(100, 2.9, 0.30, 1.5, 1.0);
    expect(res.fee).toBe(5.70);
    expect(res.net).toBe(94.30);
    expect(res.intlCut).toBe(2.50);
  });

  it('computes monthly and annual merchant costs accurately', () => {
    // 200 tx/mo @ $100 avg sale = $20,000 monthly volume
    // Each tx at 2.9% + $0.30 = $3.20 fee -> 200 * $3.20 = $640 monthly fee
    const res = calculateMonthlyFees(100, 200, 2.9, 0.30, 0);
    expect(res.monthlyVolume).toBe(20000);
    expect(res.totalMonthlyFees).toBe(640);
    expect(res.annualFees).toBe(7680);
    expect(res.netMonthly).toBe(19360);
    expect(res.effectiveRatePct).toBe(3.20);
  });

  it('calculates plan break-even point for Square Plus ($49/mo, 2.5% vs 2.6%)', () => {
    // Avg ticket $50:
    // Square Free: 2.6% + 0.15 = $1.45
    // Square Plus: 2.5% + 0.15 = $1.40
    // Savings per tx = $0.05
    // Break-even tx = $49 / $0.05 = 980 transactions ($49,000 volume)
    const res = calculatePlanBreakEven(2.6, 0.15, 2.5, 0.15, 49, 50);
    expect(res.isViable).toBe(true);
    expect(res.breakEvenTx).toBe(980);
    expect(res.breakEvenVolume).toBe(49000);
    expect(res.savingsPerTx).toBe(0.05);
  });

  it('handles unviable plan break-even when plan fees are higher or equal', () => {
    const res = calculatePlanBreakEven(2.6, 0.15, 2.9, 0.30, 49, 50);
    expect(res.isViable).toBe(false);
    expect(res.breakEvenTx).toBeNull();
  });

  it('calculates surcharge with legal cap correctly', () => {
    // $100 sale at 2.9% + $0.30 requires $103.30 gross (3.30% surcharge)
    // With an explicit user-set 3.0% cap: applied is 3.0% = $3.00, customer pays $103.00
    const res = calculateSurcharge(100, 2.9, 0.30, 3.0);
    expect(res.surchargeNeededPct).toBe(3.30);
    expect(res.isCapped).toBe(true);
    expect(res.appliedSurchargePct).toBe(3.00);
    expect(res.surchargeAmount).toBe(3.00);
    expect(res.finalCustomerTotal).toBe(103.00);
  });

  it('verifies verified presets catalog integrity and comparison sorting', () => {
    expect(VERIFIED_PROCESSOR_PRESETS.length).toBeGreaterThanOrEqual(4);

    // Ensure every single preset has an official source URL and verified date
    VERIFIED_PROCESSOR_PRESETS.forEach((p) => {
      expect(p.sourceUrl).toMatch(/^https:\/\//);
      expect(p.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(p.pct).toBeGreaterThan(0);
      expect(p.fixed).toBeGreaterThanOrEqual(0);
    });

    // Comparison ranking
    const compared = comparePresets(VERIFIED_PROCESSOR_PRESETS, 100, 200, 100);
    expect(compared.length).toBe(VERIFIED_PROCESSOR_PRESETS.length);
    expect(compared[0].isCheapest).toBe(true);

    // Monotonic order: cheapest monthly cost first
    for (let i = 0; i < compared.length - 1; i++) {
      expect(compared[i].monthlyCost).toBeLessThanOrEqual(compared[i + 1].monthlyCost);
    }
  });
});
