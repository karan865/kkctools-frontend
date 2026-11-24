import { describe, it, expect } from 'vitest';
import {
  calculateSimpleInterest,
  solveSimpleInterest,
  calculateDayCount,
  calculateAccruedInterest,
  compareDayCountConventions,
  calculateBondAccruedInterest,
} from './simple-interest-engine';

describe('Simple Interest Engine', () => {
  it('calculates standard simple interest: $10,000 at 5% for 3 years = $1,500 (total $11,500)', () => {
    const res = calculateSimpleInterest(10000, 5, 3);
    expect(res.interest).toBe(1500.0);
    expect(res.totalAmount).toBe(11500.0);
    expect(res.monthlyCompoundAmount).toBe(11614.72);
    expect(res.monthlyCompoundInterest).toBe(1614.72);
    expect(res.compoundDifference).toBe(114.72);
  });

  it('calculates accrued interest for 2026-01-15 to 2026-04-15 (90 days)', () => {
    // Act/365: 90 / 365 * 10000 * 0.05 = 123.2876... -> 123.29
    const act365 = calculateAccruedInterest(10000, 5, '2026-01-15', '2026-04-15', 'ACT/365');
    expect(act365).not.toBeNull();
    expect(act365?.actualDays).toBe(90);
    expect(act365?.accruedInterest).toBe(123.29);

    // Act/360: 90 / 360 * 10000 * 0.05 = 125.00
    const act360 = calculateAccruedInterest(10000, 5, '2026-01-15', '2026-04-15', 'ACT/360');
    expect(act360?.accruedInterest).toBe(125.0);

    // 30/360: 3 months * 30 days = 90 days. 90 / 360 * 500 = 125.00
    const basis30360 = calculateAccruedInterest(10000, 5, '2026-01-15', '2026-04-15', '30/360');
    expect(basis30360?.countedDays).toBe(90);
    expect(basis30360?.accruedInterest).toBe(125.0);
  });

  it('matches bond fixture: $1,000 face, 5.75% semi-annual, 61 of 360 days = $9.74', () => {
    // Semi-annual coupon = 57.50 / 2 = 28.75
    // Days in period = 180 (under 30/360 basis: 360 / 2)
    // 28.75 * (61 / 180) = 9.74236... -> 9.74
    const bond = calculateBondAccruedInterest(1000, 5.75, 2, 61);
    expect(bond.annualCoupon).toBe(57.5);
    expect(bond.periodicCoupon).toBe(28.75);
    expect(bond.accruedInterest).toBe(9.74);
    expect(bond.dirtyPricePerBond).toBe(1009.74);
  });

  it('solves for unknown variables correctly (round trip)', () => {
    // Solve I
    const resI = solveSimpleInterest({ solveFor: 'I', principal: 10000, annualRatePct: 5, time: 3, timeUnit: 'years' });
    expect(resI.solvedValue).toBe(1500.0);

    // Solve P
    const resP = solveSimpleInterest({ solveFor: 'P', interest: 1500, annualRatePct: 5, time: 3, timeUnit: 'years' });
    expect(resP.solvedValue).toBe(10000.0);

    // Solve r
    const resR = solveSimpleInterest({ solveFor: 'r', principal: 10000, interest: 1500, time: 3, timeUnit: 'years' });
    expect(resR.solvedValue).toBe(5.0);

    // Solve t
    const resT = solveSimpleInterest({ solveFor: 't', principal: 10000, annualRatePct: 5, interest: 1500, timeUnit: 'years' });
    expect(resT.solvedValue).toBe(3.0);

    // Solve t in months
    const resTMonths = solveSimpleInterest({ solveFor: 't', principal: 10000, annualRatePct: 5, interest: 1500, timeUnit: 'months' });
    expect(resTMonths.solvedValue).toBe(36.0);
  });

  it('handles 30/360 US end-of-month and February rules', () => {
    // 2024 (leap year): Feb 29 to Mar 31
    const febLeap = calculateDayCount(
      { year: 2024, month: 2, day: 29 },
      { year: 2024, month: 3, day: 31 },
      '30/360'
    );
    // In US 30/360: start Feb 29 is last day of Feb -> d1 becomes 30.
    // End Mar 31 with d1=30 -> d2 becomes 30.
    // (0*360 + 1*30 + (30 - 30)) = 30 days.
    expect(febLeap.countedDays).toBe(30);

    // 2023 (non-leap year): Feb 28 to Mar 31
    const febNonLeap = calculateDayCount(
      { year: 2023, month: 2, day: 28 },
      { year: 2023, month: 3, day: 31 },
      '30/360'
    );
    expect(febNonLeap.countedDays).toBe(30);
  });

  it('handles Actual/Actual across year boundaries', () => {
    // 2023-11-01 to 2024-03-01
    // 2023 has 365 days; 2024 is a leap year (366 days)
    const actAct = calculateDayCount(
      { year: 2023, month: 11, day: 1 },
      { year: 2024, month: 3, day: 1 },
      'ACT/ACT'
    );
    expect(actAct.actualDays).toBe(121);
    // 61 days in 2023 (Nov 1 to Dec 31 inclusive: Nov has 30, Dec has 31) -> 60 days diff? Let's check:
    // Nov 1 to Dec 31: 30-1 + 31 = 60 days. Dec 31 - Nov 1 + 1 = 61 days.
    // Jan 1 to Mar 1: 31 + 29 = 60 days. 60 / 366.
    expect(actAct.yearFraction).toBeGreaterThan(0.32);
    expect(actAct.yearFraction).toBeLessThan(0.34);
  });

  it('compares all 5 day-count conventions side by side', () => {
    const list = compareDayCountConventions(10000, 5, '2026-01-15', '2026-04-15');
    expect(list).toHaveLength(5);
    const act360 = list.find((c) => c.convention === 'ACT/360');
    const act365 = list.find((c) => c.convention === 'ACT/365');
    expect(act360?.accruedInterest).toBe(125.0);
    expect(act365?.accruedInterest).toBe(123.29);
    expect(act360?.differenceVsAct365).toBe(1.71);
  });
});
