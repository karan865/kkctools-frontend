import { describe, it, expect } from 'vitest';
import {
  calculateEquipmentLoan,
  calculatePaymentWithBalloon,
  calculateLeaseVsLoanVsCash,
  calculateEquipmentRoi,
  calculateMca,
  calculateLineOfCredit,
} from './equipment-loan-engine';

describe('equipment-loan-engine', () => {
  it('calculates baseline equipment loan matches spec defaults', () => {
    // Spec defaults: $80,000 price, 6% tax, $500 fees, $10,000 down, $0 trade-in, 8.5% rate, 60 mo
    // Gross: $80,000 + $4,800 + $500 = $85,300
    // Financed: $85,300 - $10,000 = $75,300
    const result = calculateEquipmentLoan({
      equipmentPrice: 80000,
      salesTaxPercent: 6,
      lenderFees: 500,
      downPayment: 10000,
      tradeInValue: 0,
      annualInterestRate: 8.5,
      termMonths: 60,
    });

    expect(result.salesTaxAmount).toBe(4800);
    expect(result.grossCost).toBe(85300);
    expect(result.amountFinanced).toBe(75300);
    expect(result.monthlyPayment).toBe(1544.89);
    expect(result.periodicPayment).toBe(1544.89);
    expect(result.totalPaymentsCount).toBe(60);
    // Total cost = 1544.89 * 60 = 92693.40; interest = 92693.40 - 75300 = 17393.40
    expect(result.totalCostOfLoan).toBeCloseTo(92693.4, 1);
    expect(result.totalInterest).toBeCloseTo(17393.4, 1);

    // Term table checks from spec
    const t24 = result.termOptions.find((t) => t.months === 24);
    const t36 = result.termOptions.find((t) => t.months === 36);
    const t48 = result.termOptions.find((t) => t.months === 48);
    const t60 = result.termOptions.find((t) => t.months === 60);
    const t72 = result.termOptions.find((t) => t.months === 72);
    const t84 = result.termOptions.find((t) => t.months === 84);

    expect(t24?.payment).toBe(3422.81);
    expect(t36?.payment).toBe(2377.04);
    expect(t48?.payment).toBe(1856.02);
    expect(t60?.payment).toBe(1544.89);
    expect(t72?.payment).toBe(1338.71);
    expect(t84?.payment).toBe(1192.49);
  });

  it('handles balloon payments correctly by reducing monthly payment', () => {
    // $100,000 financed, 8% rate, 60 mo, with $20,000 balloon
    const withoutBalloon = calculatePaymentWithBalloon(100000, 0.08 / 12, 60, 0);
    const withBalloon = calculatePaymentWithBalloon(100000, 0.08 / 12, 60, 20000);

    expect(withoutBalloon).toBe(2027.64);
    expect(withBalloon).toBe(1755.44); // Lower monthly payment because $20k deferred
    expect(withBalloon).toBeLessThan(withoutBalloon);
  });

  it('handles non-monthly payment frequencies for farm equipment', () => {
    // Annual payment for farm combine/tractor: $100,000 at 7% for 5 years (60 months)
    const annualResult = calculateEquipmentLoan({
      equipmentPrice: 100000,
      salesTaxPercent: 0,
      downPayment: 0,
      annualInterestRate: 7,
      termMonths: 60,
      frequency: 'annual',
    });

    expect(annualResult.paymentsPerYear).toBe(1);
    expect(annualResult.totalPaymentsCount).toBe(5);
    // Standard annual payment = 100000 * (0.07 / (1 - 1.07^-5)) = 24389.07
    expect(annualResult.periodicPayment).toBe(24389.07);
  });

  it('calculates Lease vs Loan vs Cash comparison matching spec defaults', () => {
    // Defaults from spec:
    // Equipment Price: $80,000, 6% tax ($84,800 cash)
    // Loan: $10,000 down, 8.5% rate, 60 mo -> $102,693.40 gross
    // Lease: $1,450/mo, 60 mo, $2,900 upfront, $1 buyout -> $2,900 + $87,000 + $1 = $89,901
    const comp = calculateLeaseVsLoanVsCash({
      equipmentPrice: 80000,
      salesTaxPercent: 6,
      loanDownPayment: 10000,
      loanFees: 500,
      loanInterestRate: 8.5,
      loanTermMonths: 60,
      leaseMonthlyPayment: 1450,
      leaseTermMonths: 60,
      leaseUpfrontCosts: 2900,
      leaseBuyoutType: '$1',
    });

    expect(comp.cash.totalGrossCost).toBe(84800);
    expect(comp.lease.totalGrossCost).toBe(89901);
    expect(comp.loan.totalGrossCost).toBeCloseTo(102693.4, 0);
    expect(comp.cheapestOption).toBe('cash');
    expect(comp.savingsVsHighest).toBeCloseTo(102693.4 - 84800, 0);
  });

  it('calculates Equipment ROI and Payback months', () => {
    const roi = calculateEquipmentRoi({
      equipmentPrice: 80000,
      downPayment: 10000,
      lenderFees: 500,
      monthlyLoanPayment: 1544.89,
      monthlyRevenueOrSavings: 4000, // generates $4k gross
      monthlyOperatingCost: 1000, // $1k operating cost
    });

    expect(roi.upfrontInvestment).toBe(10500);
    expect(roi.netOperatingCashFlow).toBe(3000);
    expect(roi.netMonthlyCashFlowAfterLoan).toBe(1455.11);
    // Payback: 10500 / 1455.11 = 7.22 months
    expect(roi.paybackMonths).toBe(7.22);
    expect(roi.annualRoiPercent).toBeCloseTo(166.3, 1);
  });

  it('calculates MCA advance and APR conversion matching spec worked example', () => {
    // Spec: $50,000 advance, 1.35 factor, 180 days daily -> $375/day
    const mca = calculateMca({
      advanceAmount: 50000,
      factorRate: 1.35,
      repaymentDays: 180,
      remittanceFrequency: 'daily',
    });

    expect(mca.totalPayback).toBe(67500);
    expect(mca.totalFinanceCost).toBe(17500);
    expect(mca.paymentCount).toBe(180);
    expect(mca.paymentPerRemittance).toBe(375);
    // Nominal APR = daily IRR × 365 ≈ 127.90% (spec worked example; simple fee ÷ years would wrongly give 70.97%)
    expect(mca.nominalApr).toBeCloseTo(127.9, 0);
    // Effective APR = (1 + daily IRR)^365 − 1 ≈ 258.5%
    expect(mca.effectiveApr).toBeCloseTo(258.5, 0);
  });

  it('calculates Line of Credit draw interest and amortizing repayment', () => {
    const loc = calculateLineOfCredit({
      creditLimit: 100000,
      amountDrawn: 40000,
      annualInterestRate: 9,
      repaymentMonths: 36,
    });

    expect(loc.availableCredit).toBe(60000);
    // 40000 * 0.09 / 12 = 300
    expect(loc.drawPeriodMonthlyInterest).toBe(300);
    // PMT for $40,000 at 9% over 36 mo = 1271.99
    expect(loc.repaymentPeriodMonthlyPayment).toBe(1271.99);
    expect(loc.totalRepaymentInterest).toBeCloseTo(5791.64, 1);
  });
});
