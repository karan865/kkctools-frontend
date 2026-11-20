import { describe, it, expect } from 'vitest';
import {
  calculateBorrowingLimit,
  calculateHelocPayments,
  generateRateScenarios,
  compareHomeEquityOptions,
} from './heloc-engine';

describe('heloc-engine', () => {
  it('matches spec §3.4 worked example exactly', () => {
    // 1. Borrowing Limit
    const limit = calculateBorrowingLimit(400000, 250000, 85);
    expect(limit.maxCreditLine).toBe(90000);
    expect(limit.currentCltvPct).toBe(62.5);
    expect(limit.postHelocCltvPct).toBe(85.0);
    expect(limit.retainedEquity).toBe(60000);
    expect(limit.isEquityAvailable).toBe(true);

    // 2. Payments & Payment Shock ($50k at 8% for 10-year draw, 20-year repayment)
    const payments = calculateHelocPayments({
      drawnAmount: 50000,
      aprPct: 8.0,
      drawYears: 10,
      repayYears: 20,
      drawMethod: 'interest-only',
    });

    expect(payments.initialDrawPayment).toBe(333.33); // $50k * (0.08 / 12)
    expect(payments.lastDrawPayment).toBe(333.33);
    expect(payments.repaymentPayment).toBe(418.22); // payment(50000, 8, 240)
    expect(payments.paymentShockDollars).toBe(84.89); // 418.22 - 333.33
    expect(payments.paymentShockPct).toBe(25.5); // +25.5% jump
    expect(payments.balanceAtEndOfDraw).toBe(50000);
    expect(payments.totalDrawInterest).toBe(40000.0); // 120 * $333.3333
    expect(payments.totalRepaymentInterest).toBe(50372.82);
    expect(payments.totalInterest).toBe(90372.82);
    expect(payments.schedule.length).toBe(360); // 120 draw + 240 repayment
  });

  it('calculates 1/360 principal + interest draw payment method', () => {
    const res = calculateHelocPayments({
      drawnAmount: 50000,
      aprPct: 8.0,
      drawYears: 10,
      repayYears: 20,
      drawMethod: '1/360',
    });

    // Month 1: interest $333.33 + (50000 / 360 = $138.89) = $472.22
    expect(res.initialDrawPayment).toBe(472.22);
    // Principal was paid down each month during draw period, so balance at end of draw is lower than $50k
    expect(res.balanceAtEndOfDraw).toBeLessThan(50000);
    expect(res.repaymentPayment).toBeLessThan(418.22);
  });

  it('reduces repayment shock when extra principal is paid during draw period', () => {
    const base = calculateHelocPayments({
      drawnAmount: 50000,
      aprPct: 8.0,
      drawYears: 10,
      repayYears: 20,
      drawMethod: 'interest-only',
      extraPrincipalMonthly: 0,
    });

    const withExtra = calculateHelocPayments({
      drawnAmount: 50000,
      aprPct: 8.0,
      drawYears: 10,
      repayYears: 20,
      drawMethod: 'interest-only',
      extraPrincipalMonthly: 150, // $150 extra towards principal
    });

    expect(withExtra.balanceAtEndOfDraw).toBe(32000); // 50000 - 120 * 150 = 32000
    expect(withExtra.repaymentPayment).toBe(267.66); // much lower than base
    expect(withExtra.repaymentPayment).toBeLessThan(base.repaymentPayment);
    expect(withExtra.paymentShockDollars).toBeLessThan(0); // no shock, payment actually decreases
  });

  it('handles balloon payment structure at end of draw period', () => {
    const res = calculateHelocPayments({
      drawnAmount: 50000,
      aprPct: 8.0,
      drawYears: 10,
      repayYears: 0,
      isBalloon: true,
    });

    expect(res.isBalloon).toBe(true);
    expect(res.repaymentPayment).toBe(50000);
    expect(res.balanceAtEndOfDraw).toBe(50000);
    expect(res.schedule.length).toBe(120);
  });

  it('enforces interest rate cap when provided', () => {
    const uncapped = calculateHelocPayments({
      drawnAmount: 50000,
      aprPct: 15.0,
      drawYears: 10,
      repayYears: 20,
    });

    const capped = calculateHelocPayments({
      drawnAmount: 50000,
      aprPct: 15.0,
      rateCapPct: 12.0, // capped at 12%
      drawYears: 10,
      repayYears: 20,
    });

    expect(capped.initialDrawPayment).toBe(500.0); // 50000 * 0.12 / 12
    expect(uncapped.initialDrawPayment).toBe(625.0); // 50000 * 0.15 / 12
    expect(capped.initialDrawPayment).toBeLessThan(uncapped.initialDrawPayment);
  });

  it('generates rate rise scenarios correctly', () => {
    const scenarios = generateRateScenarios({
      drawnAmount: 50000,
      aprPct: 8.0,
      drawYears: 10,
      repayYears: 20,
    });

    expect(scenarios.length).toBe(4); // 0%, +1%, +2%, +3%
    expect(scenarios[0].ratePct).toBe(8.0);
    expect(scenarios[1].ratePct).toBe(9.0);
    expect(scenarios[2].ratePct).toBe(10.0);
    expect(scenarios[3].ratePct).toBe(11.0);

    // Each 1% rate rise increases interest-only payment by $50,000 * 0.01 / 12 = $41.67/mo
    expect(scenarios[1].drawPayment).toBe(375.0); // 333.33 + 41.67
    expect(scenarios[2].drawPayment).toBe(416.67);
  });

  it('calculates 3-way comparison between HELOC, Home Equity Loan, and Cash-Out Refinance', () => {
    const comp = compareHomeEquityOptions({
      borrowAmount: 50000,
      helocApr: 8.0,
      helocDrawYears: 10,
      helocRepayYears: 20,
      helocClosingCosts: 500,
      helocAnnualFee: 50,

      helRate: 7.5,
      helTermYears: 15,
      helClosingCosts: 1500,

      currentMortgageBalance: 250000,
      currentMortgageRate: 4.0,
      currentMortgageRemainingYears: 22,
      refiRate: 6.5,
      refiTermYears: 30,
      refiClosingCosts: 5000,
    });

    expect(comp.heloc.monthlyDraw).toBe(333.33);
    expect(comp.heloc.monthlyRepay).toBe(418.22);
    expect(comp.homeEquityLoan.monthlyPayment).toBe(463.51); // payment(50000, 7.5, 180)
    expect(comp.cashOutRefi.newMonthlyPayment).toBeGreaterThan(comp.cashOutRefi.oldMonthlyPayment);
  });
});
