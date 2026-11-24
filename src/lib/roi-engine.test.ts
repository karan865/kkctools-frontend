import { describe, it, expect } from 'vitest';
import {
  calculateRoi,
  calculateMarketingRoi,
  calculateProjectRoi,
  compareInvestments,
  calculateTargetValue,
} from './roi-engine';

describe('ROI Engine', () => {
  it('calculates standard ROI: $10,000 to $15,000 in 3 years = ROI 50%, annualized 14.47%', () => {
    const res = calculateRoi({
      cost: 10000,
      finalValue: 15000,
      years: 3,
    });

    expect(res).not.toBeNull();
    expect(res?.netGain).toBe(5000);
    expect(res?.roiPct).toBe(50.0);
    expect(res?.annualizedRoiPct).toBe(14.47);
  });

  it('calculates real ROI adjusted for inflation', () => {
    // 14.47% nominal annualized, 3% inflation -> (1.1447 / 1.03) - 1 = 11.1359... -> 11.14%
    const res = calculateRoi({
      cost: 10000,
      finalValue: 15000,
      years: 3,
      inflationPct: 3,
    });

    expect(res?.realRoiPct).toBe(11.14);
  });

  it('calculates marketing ROI fixture: $20k rev, $5k cost, 40% margin = ROI margin 60%, rev 300%, ROAS 4.0', () => {
    const res = calculateMarketingRoi({
      revenue: 20000,
      adCost: 5000,
      grossMarginPct: 40,
    });

    expect(res).not.toBeNull();
    expect(res?.grossProfit).toBe(8000);
    expect(res?.netProfit).toBe(3000);
    expect(res?.roiOnMarginPct).toBe(60.0);
    expect(res?.roiOnRevenuePct).toBe(300.0);
    expect(res?.roas).toBe(4.0);
  });

  it('calculates project ROI fixture: $12k cost, $4k/yr saving = payback 3 yrs, 5-yr ROI 66.7%', () => {
    const res = calculateProjectRoi({
      cost: 12000,
      annualBenefit: 4000,
      projectLifeYears: 5,
    });

    expect(res).not.toBeNull();
    expect(res?.paybackYears).toBe(3.0);
    expect(res?.totalBenefits).toBe(20000);
    expect(res?.netProfit).toBe(8000);
    expect(res?.roiPct).toBe(66.67);
  });

  it('calculates target ending value for desired ROI', () => {
    const target = calculateTargetValue(10000, 50);
    expect(target).toBe(15000.0);
  });

  it('compares options and warns about mismatched holding periods', () => {
    const analysis = compareInvestments([
      { name: 'Stock A', cost: 10000, finalValue: 15000, years: 3 }, // 14.47% annualized
      { name: 'Real Estate B', cost: 100000, finalValue: 160000, years: 5 }, // 9.86% annualized
    ]);

    expect(analysis.options).toHaveLength(2);
    expect(analysis.hasMismatchedDurations).toBe(true);
    expect(analysis.bestOptionByAnnualized?.name).toBe('Stock A');
    expect(analysis.options[0].rank).toBe(1);
    expect(analysis.options[1].rank).toBe(2);
  });
});

describe('real ROI uses the unrounded annual rate (review 2026-11-24)', () => {
  it('matches (1 + annualized) ÷ (1 + inflation) − 1', () => {
    const r = calculateRoi({ cost: 10000, finalValue: 15000, years: 3, inflationPct: 3 })!;
    const ann = Math.pow(1.5, 1 / 3) - 1;
    expect(r.realRoiPct).toBe(Number((((1 + ann) / 1.03 - 1) * 100).toFixed(2)));
  });
});
