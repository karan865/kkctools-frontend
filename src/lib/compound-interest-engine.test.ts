import { describe, it, expect } from 'vitest';
import {
  calculateCompoundGrowth,
  compareFrequencies,
  compareSimpleVsCompound,
  solveDepositForGoal,
  solveRateForGoal,
  solveTimeForGoal,
  getNominalRate,
  getApy,
} from './compound-interest-engine';

describe('compound-interest-engine', () => {
  describe('Spec Worked Examples (§3.4)', () => {
    it('$10,000 at 5% monthly + $200/mo for 10 years yields $47,526.55', () => {
      const result = calculateCompoundGrowth({
        initialPrincipal: 10000,
        ratePct: 5,
        rateType: 'apr',
        years: 10,
        compounding: 'monthly',
        depositAmount: 200,
        depositFrequency: 'monthly',
        depositTiming: 'end',
      });

      expect(Number(result.futureValue.toFixed(2))).toBe(47526.55);
      expect(result.totalDeposits).toBe(34000); // 10k + (200 * 120)
      expect(Number(result.totalInterest.toFixed(2))).toBe(13526.55);
    });

    it('$10,000 for 10 years at 5% no deposits: Annual ($16,288.95), Monthly ($16,470.09), Daily ($16,486.65)', () => {
      const annual = calculateCompoundGrowth({
        initialPrincipal: 10000,
        ratePct: 5,
        years: 10,
        compounding: 'annually',
        depositAmount: 0,
      });
      const monthly = calculateCompoundGrowth({
        initialPrincipal: 10000,
        ratePct: 5,
        years: 10,
        compounding: 'monthly',
        depositAmount: 0,
      });
      const daily = calculateCompoundGrowth({
        initialPrincipal: 10000,
        ratePct: 5,
        years: 10,
        compounding: 'daily365',
        depositAmount: 0,
      });

      expect(Number(annual.futureValue.toFixed(2))).toBe(16288.95);
      expect(Number(monthly.futureValue.toFixed(2))).toBe(16470.09);
      expect(Number(daily.futureValue.toFixed(2))).toBe(16486.65);

      // Daily beats monthly by approx $16.56 over a full decade
      const diff = daily.futureValue - monthly.futureValue;
      expect(Math.abs(diff - 16.56)).toBeLessThanOrEqual(0.02);
    });

    it('APY of 5% compounded monthly is 5.116%', () => {
      const apy = getApy(5, 'monthly');
      expect(Number(apy.toFixed(3))).toBe(5.116);
    });

    it('Doubling time at 5% compounded monthly is ~13.89 years', () => {
      const result = calculateCompoundGrowth({
        initialPrincipal: 10000,
        ratePct: 5,
        years: 10,
        compounding: 'monthly',
      });
      expect(Number(result.doublingYears.toFixed(2))).toBe(13.89);
    });
  });

  describe('Mixed Frequencies & Deposit Timings', () => {
    it('handles daily compounding with monthly deposits cleanly', () => {
      const result = calculateCompoundGrowth({
        initialPrincipal: 5000,
        ratePct: 6,
        years: 5,
        compounding: 'daily365',
        depositAmount: 150,
        depositFrequency: 'monthly',
        depositTiming: 'end',
      });
      expect(result.futureValue).toBeGreaterThan(5000 + 150 * 60);
      expect(result.schedule.length).toBe(5);
    });

    it('deposit at start of month yields higher balance than end of month', () => {
      const startRes = calculateCompoundGrowth({
        initialPrincipal: 10000,
        ratePct: 5,
        years: 10,
        depositAmount: 200,
        depositTiming: 'start',
      });
      const endRes = calculateCompoundGrowth({
        initialPrincipal: 10000,
        ratePct: 5,
        years: 10,
        depositAmount: 200,
        depositTiming: 'end',
      });
      expect(startRes.futureValue).toBeGreaterThan(endRes.futureValue);
    });

    it('handles continuous compounding with regular deposits', () => {
      const cont = calculateCompoundGrowth({
        initialPrincipal: 10000,
        ratePct: 5,
        years: 10,
        compounding: 'continuous',
        depositAmount: 200,
        depositTiming: 'end',
      });
      // Continuous yields slightly higher than daily
      const daily = calculateCompoundGrowth({
        initialPrincipal: 10000,
        ratePct: 5,
        years: 10,
        compounding: 'daily365',
        depositAmount: 200,
        depositTiming: 'end',
      });
      expect(cont.futureValue).toBeGreaterThan(daily.futureValue);
    });
  });

  describe('APY vs APR Input Mode', () => {
    it('avoids double compounding when user enters APY', () => {
      // If user inputs 5.116% APY with monthly compounding, the nominal rate is 5.0%
      const nominal = getNominalRate(5.116189, 'apy', 'monthly');
      expect(Number(nominal.toFixed(2))).toBe(5.0);

      const res = calculateCompoundGrowth({
        initialPrincipal: 10000,
        ratePct: 5.116189,
        rateType: 'apy',
        years: 10,
        compounding: 'monthly',
        depositAmount: 0,
      });
      expect(Number(res.futureValue.toFixed(2))).toBe(16470.09);
    });
  });

  describe('Step-Up Deposits, Inflation & Taxes', () => {
    it('applies annual deposit increase percentage', () => {
      const stepUpRes = calculateCompoundGrowth({
        initialPrincipal: 1000,
        ratePct: 5,
        years: 3,
        depositAmount: 100,
        annualDepositIncreasePct: 10, // 10% raise each year
      });
      // Year 1: $100/mo = $1200
      // Year 2: $110/mo = $1320
      // Year 3: $121/mo = $1452
      expect(stepUpRes.schedule[0].deposits).toBe(1200);
      expect(stepUpRes.schedule[1].deposits).toBe(1320);
      expect(stepUpRes.schedule[2].deposits).toBe(1452);
    });

    it('calculates real inflation-adjusted balance', () => {
      const res = calculateCompoundGrowth({
        initialPrincipal: 10000,
        ratePct: 6,
        years: 10,
        inflationPct: 3,
        depositAmount: 0,
      });
      // Nominal FV = 10000 * (1 + 0.06/12)^120 = 18193.97
      // Real FV = Nominal / (1.03)^10 = 18193.97 / 1.343916 = 13538.02
      expect(Number(res.realPurchasingPower.toFixed(2))).toBe(13538.02);
    });

    it('deducts tax on interest earned', () => {
      const noTax = calculateCompoundGrowth({
        initialPrincipal: 10000,
        ratePct: 5,
        years: 10,
        taxPct: 0,
      });
      const withTax = calculateCompoundGrowth({
        initialPrincipal: 10000,
        ratePct: 5,
        years: 10,
        taxPct: 25, // 25% capital gains / income tax
      });
      expect(withTax.futureValue).toBeLessThan(noTax.futureValue);
    });
  });

  describe('Frequency Comparison Table', () => {
    it('generates comparison across 7 standard compounding frequencies', () => {
      const list = compareFrequencies(10000, 5, 10);
      expect(list.length).toBe(7);
      expect(list[0].frequency).toBe('annually');
      expect(list[3].frequency).toBe('monthly');
      expect(list[4].frequency).toBe('daily365');
      expect(list[6].frequency).toBe('continuous');
      expect(list[6].endingBalance).toBeGreaterThan(list[0].endingBalance);
    });
  });

  describe('Simple vs. Compound Interest Comparison', () => {
    it('proves the compound interest advantage over simple interest', () => {
      const comp = compareSimpleVsCompound(10000, 7, 20, 200);
      // Over 20 years, compound interest vastly outperforms simple interest
      expect(comp.compoundTotal).toBeGreaterThan(comp.simpleTotal);
      expect(comp.advantage).toBeGreaterThan(0);
      expect(comp.advantagePct).toBeGreaterThan(20);
    });
  });

  describe('Goal Solvers', () => {
    it('solves required monthly deposit to reach target savings goal', () => {
      // Reach $50,000 in 10 years starting with $10,000 at 5% monthly
      const solvedDeposit = solveDepositForGoal(50000, 10000, 5, 10, 'monthly', 'end');
      expect(solvedDeposit).not.toBeNull();

      // Check round-trip
      const checkRes = calculateCompoundGrowth({
        initialPrincipal: 10000,
        ratePct: 5,
        years: 10,
        depositAmount: solvedDeposit!,
      });
      expect(Number(checkRes.futureValue.toFixed(0))).toBe(50000);
    });

    it('solves required interest rate to reach target', () => {
      // Reach $20,000 from $10,000 in 10 years with no deposits
      const solvedRate = solveRateForGoal(20000, 10000, 10, 0, 'monthly');
      expect(solvedRate).not.toBeNull();
      // Around 6.95% - 7.0%
      expect(solvedRate!).toBeGreaterThan(6.8);
      expect(solvedRate!).toBeLessThan(7.2);
    });

    it('solves required time to reach target', () => {
      // Reach $20,000 from $10,000 at 7% monthly
      const solvedYears = solveTimeForGoal(20000, 10000, 7, 0, 'monthly');
      expect(solvedYears).not.toBeNull();
      // Around 9.9 - 10 years (doubling time at 7% monthly)
      expect(Math.round(solvedYears!)).toBe(10);
    });
  });
});
