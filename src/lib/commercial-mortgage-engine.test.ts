import { describe, it, expect } from 'vitest';
import {
  calculateCommercialMortgage,
  calculateMaxLoanSizing,
  calculateBalloonRefinance,
} from './commercial-mortgage-engine';

describe('commercial-mortgage-engine', () => {
  // Test case 1: Spec worked example defaults
  // $2M value, 75% LTV ($1.5M loan), 7% rate, 10-yr term, 25-yr amortization, 0 IO, 1% points, $160k NOI
  it('calculates spec worked example defaults accurately', () => {
    const result = calculateCommercialMortgage({
      propertyValue: 2000000,
      loanAmount: 1500000,
      ratePct: 7.0,
      termYears: 10,
      amortizationYears: 25,
      interestOnlyMonths: 0,
      pointsPct: 1,
      annualNoi: 160000,
    });

    expect(result.loanAmount).toBe(1500000);
    expect(result.ltvPct).toBe(75);
    expect(result.termMonths).toBe(120);
    expect(result.amortizationMonths).toBe(300);

    // Monthly payment: $10,601.69
    expect(result.monthlyPayment).toBeCloseTo(10601.69, 1);
    expect(result.annualDebtService).toBeCloseTo(127220.26, 1);

    // Balloon payment at end of 10-year term: $1,179,500.95
    expect(result.balloonBalance).toBeCloseTo(1179500.95, 0);

    // Interest and principal in term
    expect(result.interestPaidInTerm).toBeCloseTo(951703.5, 0);
    expect(result.principalPaidInTerm).toBeCloseTo(320499.05, 0);

    // Underwriting metrics: DSCR = 160k / 127.2k = 1.26
    expect(result.dscr).toBe(1.26);

    // Debt yield = 160k / 1.5M = 10.67%
    expect(result.debtYieldPct).toBe(10.67);

    // Effective APR with 1% origination fee ($15,000) over 10-year term should exceed note rate (7.00%)
    expect(result.effectiveRatePct).toBeGreaterThan(7.0);
    expect(result.pointsAmount).toBe(15000);
  });

  // Test case 2: Interest-only period
  it('handles interest-only period correctly without reducing principal during IO phase', () => {
    const result = calculateCommercialMortgage({
      propertyValue: 2000000,
      loanAmount: 1500000,
      ratePct: 7.0,
      termYears: 10,
      amortizationYears: 25,
      interestOnlyMonths: 12, // 1 year IO
    });

    // Monthly IO payment: 1,500,000 * (0.07 / 12) = $8,750.00
    expect(result.interestOnlyMonthlyPayment).toBe(8750);

    // Because 12 months were IO, principal amortization only runs for 120 - 12 = 108 months
    // Balloon must be higher than without IO ($1,179,500.95)
    expect(result.balloonBalance).toBeGreaterThan(1179500.95);
  });

  // Test case 3: Max Loan Sizing (LTV vs DSCR vs Debt Yield)
  it('correctly determines max borrowing capacity and identifies the binding constraint', () => {
    // Case 3a: Default where LTV (75% -> $1.5M) is the binding constraint
    const sizingLtvBinds = calculateMaxLoanSizing({
      propertyValue: 2000000,
      annualNoi: 160000,
      ratePct: 7.0,
      amortizationYears: 25,
      maxLtvPct: 75,
      minDscr: 1.25,
      minDebtYieldPct: 9.0,
    });

    expect(sizingLtvBinds.maxLoanByLtv).toBe(1500000);
    expect(sizingLtvBinds.maxLoanByDscr).toBeCloseTo(1509194, -2);
    expect(sizingLtvBinds.maxLoanByDebtYield).toBeCloseTo(1777778, -2);
    expect(sizingLtvBinds.bindingConstraint).toBe('ltv');
    expect(sizingLtvBinds.bindingMaxLoan).toBe(1500000);
    expect(sizingLtvBinds.requiredEquity).toBe(500000);

    // Case 3b: Lower NOI ($130,000) causes DSCR to bind
    const sizingDscrBinds = calculateMaxLoanSizing({
      propertyValue: 2000000,
      annualNoi: 130000,
      ratePct: 7.0,
      amortizationYears: 25,
      maxLtvPct: 75,
      minDscr: 1.25,
      minDebtYieldPct: 8.0,
    });

    expect(sizingDscrBinds.bindingConstraint).toBe('dscr');
    expect(sizingDscrBinds.bindingMaxLoan).toBeLessThan(1500000);

    // Case 3c: Stricter Debt Yield (12%) causes Debt Yield to bind
    const sizingDyBinds = calculateMaxLoanSizing({
      propertyValue: 2000000,
      annualNoi: 160000,
      ratePct: 7.0,
      amortizationYears: 25,
      maxLtvPct: 80,
      minDscr: 1.15,
      minDebtYieldPct: 12.0, // $160,000 / 0.12 = $1,333,333
    });

    expect(sizingDyBinds.bindingConstraint).toBe('debtYield');
    expect(sizingDyBinds.bindingMaxLoan).toBe(1333333);
  });

  // Test case 4: Balloon Refinance
  it('calculates refinance of remaining balloon balance at maturity', () => {
    const refi = calculateBalloonRefinance({
      balloonBalance: 1179500.95,
      newRatePct: 6.5,
      newAmortizationYears: 20,
      refinanceClosingCosts: 10000,
    });

    // Total refinanced amount: $1,179,500.95 + $10,000 = $1,189,500.95
    expect(refi.refinancedLoanAmount).toBeCloseTo(1189500.95, 1);
    expect(refi.newMonthlyPayment).toBeGreaterThan(0);
    expect(refi.newAnnualDebtService).toBeCloseTo(refi.newMonthlyPayment * 12, 1);
  });
});
