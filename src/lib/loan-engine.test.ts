import { describe, it, expect } from 'vitest';
import {
  monthlyRate,
  payment,
  interestOnlyPayment,
  balanceAfter,
  maxLoanFromPayment,
  aprWithFees,
  factorRateToApr,
  schedule,
} from './loan-engine';

describe('loan-engine', () => {
  it('converts APR to monthly rate accurately', () => {
    expect(monthlyRate(6)).toBe(0.005);
    expect(monthlyRate(12)).toBe(0.01);
    expect(monthlyRate(0)).toBe(0);
    expect(monthlyRate(-5)).toBe(0);
  });

  it('calculates standard amortizing monthly payment (P & I)', () => {
    // $100,000 at 6% for 30 years (360 months) = $599.55
    const pmt = payment(100000, 6, 360);
    expect(pmt).toBeCloseTo(599.55, 2);

    // 0% interest loan: $120,000 / 60 months = $2,000
    expect(payment(120000, 0, 60)).toBe(2000);

    // Boundary conditions
    expect(payment(0, 6, 360)).toBeNull();
    expect(payment(-50000, 6, 360)).toBeNull();
    expect(payment(100000, 6, 0)).toBeNull();
  });

  it('calculates interest-only monthly payment', () => {
    // $100,000 at 6% IO = $500.00/mo
    expect(interestOnlyPayment(100000, 6)).toBe(500);
    expect(interestOnlyPayment(500000, 7.5)).toBeCloseTo(3125, 2);
    expect(interestOnlyPayment(0, 6)).toBeNull();
  });

  it('computes remaining balance after paid months', () => {
    // $100,000 at 6% for 360 months after 60 months (5 years) is approx $93,054
    const bal5yr = balanceAfter(100000, 6, 360, 60);
    expect(bal5yr).toBeCloseTo(93054.34, 1);

    // At 0 paid months -> principal
    expect(balanceAfter(100000, 6, 360, 0)).toBe(100000);
    // At end of term -> 0
    expect(balanceAfter(100000, 6, 360, 360)).toBe(0);
  });

  it('computes max loan borrowing capacity from payment', () => {
    // $599.55 at 6% for 360 months should yield $100,000
    const maxBorrow = maxLoanFromPayment(599.55, 6, 360);
    expect(maxBorrow).toBeCloseTo(100000, 0);

    // 0% interest
    expect(maxLoanFromPayment(1000, 0, 48)).toBe(48000);
    expect(maxLoanFromPayment(0, 5, 120)).toBeNull();
  });

  it('calculates APR with upfront points and lender fees', () => {
    // $200,000 loan, 6% nominal APR, 360 months, $4,000 upfront fees (2 points)
    // Effective APR should be higher than 6% (approx 6.18%)
    const effApr = aprWithFees(200000, 4000, 6, 360);
    expect(effApr).toBeGreaterThan(6.0);
    expect(effApr).toBeCloseTo(6.18, 1);

    // No fees -> same as nominal
    expect(aprWithFees(200000, 0, 6, 360)).toBe(6);
  });

  it('converts MCA factor rate to APR', () => {
    // $50,000 advance, 1.25 factor (total $62,500), 180 days
    const apr = factorRateToApr(50000, 1.25, 180, 1);
    expect(apr).not.toBeNull();
    expect(apr).toBeGreaterThan(50); // Daily remittance MCA APRs are typically high (70%+)
  });

  it('generates full amortization schedule with balloon payment', () => {
    // Commercial loan: $1,000,000 at 6.5%, 25-year amortization (300 months), 5-year balloon (60 months)
    const result = schedule({
      principal: 1000000,
      apr: 6.5,
      amortizationMonths: 300,
      termMonths: 60,
    });

    expect(result.monthlyPayment).toBeCloseTo(6752.09, 1);
    expect(result.monthlyRows.length).toBe(60);
    expect(result.payoffMonth).toBe(60);
    expect(result.balloonPayment).toBeGreaterThan(850000);
    expect(result.annualSummaries.length).toBe(5);
  });

  it('generates schedule with interest-only introductory period', () => {
    // $500,000 loan at 6%, 360 months total, 24 months interest-only
    const result = schedule({
      principal: 500000,
      apr: 6,
      amortizationMonths: 360,
      termMonths: 360,
      interestOnlyMonths: 24,
    });

    expect(result.interestOnlyPayment).toBe(2500);
    expect(result.monthlyRows[0].isInterestOnly).toBe(true);
    expect(result.monthlyRows[0].principal).toBe(0);
    expect(result.monthlyRows[23].isInterestOnly).toBe(true);
    expect(result.monthlyRows[24].isInterestOnly).toBe(false);
    expect(result.monthlyRows[24].principal).toBeGreaterThan(0);
  });
});
