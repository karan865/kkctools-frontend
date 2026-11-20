import { describe, it, expect } from 'vitest';
import {
  calculateClosedFormYears,
  calculateDrawdown,
  solveMaxSpending,
  calculateScenarios,
} from './drawdown-engine';

describe('drawdown-engine', () => {
  describe('calculateClosedFormYears', () => {
    it('matches spec benchmark: $500k, flat $40k/yr, 5% return gives 20.1 years', () => {
      const years = calculateClosedFormYears(500000, 40000, 5.0);
      expect(years).toBe(20.1);
    });

    it('returns Infinity when annual withdrawal is less than or equal to annual interest', () => {
      // 5% of $500k = $25,000
      expect(calculateClosedFormYears(500000, 25000, 5.0)).toBe(Infinity);
      expect(calculateClosedFormYears(500000, 20000, 5.0)).toBe(Infinity);
    });
  });

  describe('calculateDrawdown', () => {
    it('matches closed-form analytical years within ±0.2 years for flat case', () => {
      const closed = calculateClosedFormYears(500000, 40000, 5.0)!;
      const sim = calculateDrawdown({
        initialSavings: 500000,
        currentAge: 65,
        spendingAnnual: 40000,
        inflationAdjusted: false,
        expectedReturnPct: 5.0,
        inflationPct: 0.0,
      });

      expect(Math.abs(sim.yearsLasted - closed)).toBeLessThanOrEqual(0.2);
      expect(sim.depletedAge).toBeCloseTo(65 + closed, 0);
    });

    it('matches spec benchmark: $500k with spending rising 3% a year at 5% return lasts about 15 years', () => {
      const sim = calculateDrawdown({
        initialSavings: 500000,
        currentAge: 65,
        spendingAnnual: 40000,
        inflationAdjusted: true,
        expectedReturnPct: 5.0,
        inflationPct: 3.0,
      });

      expect(Math.round(sim.yearsLasted)).toBe(15);
      expect(sim.schedule.length).toBe(15);
      expect(sim.depletedAge).toBeCloseTo(80.2, 0);
    });

    it('matches spec benchmark: $1,000,000 with $40,000 rising 3% lasts about 36 years', () => {
      const sim = calculateDrawdown({
        initialSavings: 1000000,
        currentAge: 65,
        spendingAnnual: 40000,
        inflationAdjusted: true,
        expectedReturnPct: 5.0,
        inflationPct: 3.0,
      });

      expect(Math.round(sim.yearsLasted)).toBe(36);
    });

    it('detects indefinite portfolio preservation when spending is under growth', () => {
      const sim = calculateDrawdown({
        initialSavings: 1000000,
        currentAge: 65,
        spendingAnnual: 30000,
        inflationAdjusted: false,
        expectedReturnPct: 6.0,
        inflationPct: 0.0,
      });

      expect(sim.isIndefinite).toBe(true);
      expect(sim.schedule[sim.schedule.length - 1].endingBalance).toBeGreaterThan(1000000);
    });

    it('extends portfolio life when other income (Social Security) activates', () => {
      const withoutSs = calculateDrawdown({
        initialSavings: 500000,
        currentAge: 62,
        spendingAnnual: 45000,
        inflationAdjusted: true,
        expectedReturnPct: 5.0,
        inflationPct: 3.0,
        otherIncomes: [],
      });

      const withSs = calculateDrawdown({
        initialSavings: 500000,
        currentAge: 62,
        spendingAnnual: 45000,
        inflationAdjusted: true,
        expectedReturnPct: 5.0,
        inflationPct: 3.0,
        otherIncomes: [
          {
            label: 'Social Security',
            annualAmount: 20000,
            startAge: 67,
            annualIncreasePct: 2.5,
          },
        ],
      });

      expect(withSs.yearsLasted).toBeGreaterThan(withoutSs.yearsLasted);
    });
  });

  describe('solveMaxSpending', () => {
    it('matches spec benchmark: $500k lasting 30 years at 5% with 3% inflation allows $22,810.94 year 1 spending (4.56% withdrawal rate)', () => {
      const res = solveMaxSpending({
        initialSavings: 500000,
        currentAge: 65,
        targetAge: 95,
        inflationAdjusted: true,
        expectedReturnPct: 5.0,
        inflationPct: 3.0,
        feesPct: 0.0,
      });

      // Analytical formula: $22,810.02 to $22,810.94
      expect(res.maxInitialAnnualSpending).toBeCloseTo(22810.94, -1);
      expect(res.initialWithdrawalRatePct).toBeCloseTo(4.56, 1);

      // Verify that this spending sustains the portfolio through age 95
      const check = calculateDrawdown({
        initialSavings: 500000,
        currentAge: 65,
        spendingAnnual: res.maxInitialAnnualSpending,
        inflationAdjusted: true,
        expectedReturnPct: 5.0,
        inflationPct: 3.0,
        maxYears: 30,
      });
      expect(check.yearsLasted).toBeGreaterThanOrEqual(29.8);
    });
  });

  describe('calculateScenarios', () => {
    it('demonstrates sequence of returns risk: bad-start scenario depletes capital earlier than expected', () => {
      const res = calculateScenarios({
        initialSavings: 500000,
        currentAge: 65,
        spendingAnnual: 40000,
        inflationAdjusted: true,
        expectedReturnPct: 5.0,
        inflationPct: 3.0,
      });

      expect(res.expectedYears).toBeCloseTo(15.2, 0);
      expect(res.lowerReturnYears).toBeLessThan(res.expectedYears);
      expect(res.badStartYears).toBeLessThan(res.expectedYears);
    });
  });
});
