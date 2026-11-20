import { describe, it, expect } from 'vitest';
import {
  calculateProjection,
  calculateMoneyMarket,
  calculateTBill,
  calculateCompare,
} from './investment-return-engine';
import { fv, fvAnnuity } from './tvm-engine';

describe('investment-return-engine', () => {
  describe('calculateProjection', () => {
    it('matches spec benchmark: $10k + $300/mo for 20 yrs at assumed 7% nominal gives $196,665.39 from $82k contributed', () => {
      const res = calculateProjection({
        startingAmount: 10000,
        contribution: 300,
        contributionFrequency: 'monthly',
        contributionTiming: 'end',
        assumedReturnPct: 7,
        feesPct: 0,
        inflationPct: 0,
        years: 20,
      });

      expect(res.finalBalance).toBe(196665.39);
      expect(res.totalContributed).toBe(82000);
      expect(res.totalGains).toBe(114665.39);
      expect(res.schedule.length).toBe(20);
    });

    it('matches tvm-engine fv and fvAnnuity calculation', () => {
      const fvLump = fv(10000, 7, 20, 'monthly')!;
      const rMonthly = 7 / 12;
      const fvPmt = fvAnnuity(300, rMonthly, 240, 'ordinary')!;
      const expectedTotal = Math.round((fvLump + fvPmt) * 100) / 100;

      const res = calculateProjection({
        startingAmount: 10000,
        contribution: 300,
        contributionFrequency: 'monthly',
        contributionTiming: 'end',
        assumedReturnPct: 7,
        years: 20,
      });

      expect(res.finalBalance).toBe(expectedTotal);
    });

    it('accounts for fee drag (expense ratio) reducing final wealth', () => {
      const noFee = calculateProjection({
        startingAmount: 50000,
        contribution: 500,
        assumedReturnPct: 8,
        feesPct: 0,
        years: 25,
      });

      const withFee = calculateProjection({
        startingAmount: 50000,
        contribution: 500,
        assumedReturnPct: 8,
        feesPct: 0.75, // 75 bps advisor/fund fee
        years: 25,
      });

      expect(withFee.finalBalance).toBeLessThan(noFee.finalBalance);
      expect(withFee.totalFeesPaid).toBeGreaterThan(0);
      expect(withFee.totalFeesPaid).toBeCloseTo(noFee.finalBalance - withFee.finalBalance, 1);
    });

    it('calculates inflation-adjusted real purchasing power', () => {
      const res = calculateProjection({
        startingAmount: 20000,
        contribution: 0,
        assumedReturnPct: 6,
        inflationPct: 3,
        years: 10,
      });

      // FV = 20000 * (1 + 0.06/12)^120 = 36387.93
      // Real = 36387.93 / (1.03^10) = 36387.93 / 1.343916 = 27076.04
      expect(res.finalBalance).toBe(36387.93);
      expect(res.realFinalBalance).toBe(27076.04);
    });
  });

  describe('calculateMoneyMarket', () => {
    it('matches spec benchmark: $25,000 at 4.5% APY for 12 months produces $1,125 interest', () => {
      const res = calculateMoneyMarket({
        initialBalance: 25000,
        apyPct: 4.5,
        monthlyDeposit: 0,
        months: 12,
      });

      expect(res.totalInterest).toBe(1125.00);
      expect(res.finalBalance).toBe(26125.00);
      expect(res.schedule.length).toBe(12);
    });

    it('handles ongoing monthly deposits in a money market account', () => {
      const res = calculateMoneyMarket({
        initialBalance: 10000,
        apyPct: 5.0,
        monthlyDeposit: 500,
        months: 24,
      });

      expect(res.totalDeposited).toBe(22000); // 10k + 24 * 500
      expect(res.finalBalance).toBeGreaterThan(23000);
      expect(res.totalInterest).toBeGreaterThan(1000);
    });
  });

  describe('calculateTBill', () => {
    it('computes Treasury discount rate and coupon-equivalent investment yield from purchase price', () => {
      // 26-week / 182-day T-Bill with $10,000 face value bought for $9,750
      const res = calculateTBill({
        faceValue: 10000,
        pricePaid: 9750,
        daysToMaturity: 182,
      });

      expect(res.totalInterest).toBe(250);
      // Discount Rate: (250 / 10000) * (360 / 182) * 100 = 4.945%
      expect(res.discountRatePct).toBe(4.945);
      // Investment Yield: (250 / 9750) * (365 / 182) * 100 = 5.142%
      expect(res.investmentYieldPct).toBe(5.142);
    });

    it('derives purchase price from discount rate input', () => {
      const res = calculateTBill({
        faceValue: 10000,
        discountRatePct: 5.0,
        daysToMaturity: 360,
      });

      // Price = 10000 * (1 - 0.05 * (360/360)) = 9500
      expect(res.pricePaid).toBe(9500);
      expect(res.totalInterest).toBe(500);
    });
  });

  describe('calculateCompare', () => {
    it('compares equity growth vs cash yields over identical horizons', () => {
      const res = calculateCompare({
        startingAmount: 10000,
        monthlyContribution: 300,
        years: 20,
        stockAssumedReturnPct: 7,
        cashApyPct: 4.5,
        inflationPct: 2.5,
      });

      expect(res.totalContributed).toBe(82000);
      expect(res.stockFinalBalance).toBe(196665.39);
      expect(res.cashFinalBalance).toBeGreaterThan(res.totalContributed);
      expect(res.difference).toBeGreaterThan(0);
      expect(res.stockFinalBalance).toBeGreaterThan(res.cashFinalBalance);
      expect(res.schedule.length).toBe(20);
    });
  });
});
