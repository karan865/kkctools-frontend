import { describe, it, expect } from 'vitest';
import {
  calculateRentalProperty,
  RentalPropertyInput,
} from './rental-property-engine';

describe('rental-property-engine', () => {
  const specDefaults: RentalPropertyInput = {
    purchasePrice: 250000,
    closingCosts: 7500,
    upfrontRepairs: 5000,

    isFinanced: true,
    downPaymentPercent: 25,
    interestRatePercent: 7,
    loanTermYears: 30,
    loanPointsPercent: 0,

    monthlyRent: 2400,
    otherIncomeMonthly: 0,
    vacancyPercent: 5,

    propertyTaxAnnual: 3000,
    insuranceAnnual: 1400,
    hoaMonthly: 0,
    utilitiesMonthly: 0,
    maintenancePercentOfRent: 5,
    capexPercentOfRent: 5,
    managementPercentOfEgi: 8,
    otherExpensesAnnual: 0,

    proFormaYears: 10,
    annualRentGrowthPercent: 3,
    annualExpenseGrowthPercent: 3,
    annualAppreciationPercent: 3,
    sellingCostPercent: 6,
  };

  it('verifies spec worked example numbers exactly', () => {
    const result = calculateRentalProperty(specDefaults);

    // Financing
    expect(result.downPaymentAmount).toBe(62500);
    expect(result.loanAmount).toBe(187500);
    expect(result.totalCashInvested).toBe(75000);

    // Income
    expect(result.grossRentAnnual).toBe(28800);
    expect(result.vacancyLossAnnual).toBe(1440);
    expect(result.effectiveGrossIncomeAnnual).toBe(27360);

    // Operating expenses
    expect(result.expenses.propertyTaxAnnual).toBe(3000);
    expect(result.expenses.insuranceAnnual).toBe(1400);
    expect(result.expenses.maintenanceAnnual).toBe(1440);
    expect(result.expenses.capexAnnual).toBe(1440);
    expect(result.expenses.managementAnnual).toBeCloseTo(2188.8, 1);
    expect(result.expenses.totalOperatingExpensesAnnual).toBeCloseTo(9468.8, 1);

    // NOI
    expect(result.noiAnnual).toBeCloseTo(17891.2, 1);

    // Debt service
    expect(result.monthlyMortgagePayment).toBeCloseTo(1247.44, 2);
    expect(result.annualDebtService).toBeCloseTo(14969.31, 2);

    // Cash flow
    expect(result.annualCashFlow).toBeCloseTo(2921.89, 2);
    expect(result.monthlyCashFlow).toBeCloseTo(243.49, 2);

    // Ratios
    expect(result.cashOnCashPercent).toBeCloseTo(3.9, 2);
    expect(result.capRatePercent).toBeCloseTo(7.16, 2);
    expect(result.grossYieldPercent).toBeCloseTo(11.52, 2);
    expect(result.dscr).toBeCloseTo(1.2, 2);
    expect(result.rentToPricePercent).toBeCloseTo(0.96, 2);
    expect(result.meetsOnePercentRule).toBe(false);
    expect(result.grm).toBeCloseTo(8.68, 2);
  });

  it('handles all-cash purchase mode correctly', () => {
    const allCashInput: RentalPropertyInput = {
      ...specDefaults,
      isFinanced: false,
    };
    const result = calculateRentalProperty(allCashInput);

    expect(result.loanAmount).toBe(0);
    expect(result.annualDebtService).toBe(0);
    expect(result.monthlyMortgagePayment).toBe(0);
    expect(result.dscr).toBeNull();

    // Cash flow equals NOI
    expect(result.annualCashFlow).toBeCloseTo(17891.2, 1);

    // Total cash invested = price + closing + repairs
    expect(result.totalCashInvested).toBe(262500);

    // Cash-on-cash = NOI / 262,500 = 6.8157%
    expect(result.cashOnCashPercent).toBeCloseTo(6.82, 2);
    expect(result.capRatePercent).toBeCloseTo(7.16, 2);
  });

  it('returns null for cash-on-cash when cash invested is zero or negative', () => {
    const zeroCashInput: RentalPropertyInput = {
      ...specDefaults,
      purchasePrice: 0,
      closingCosts: 0,
      upfrontRepairs: 0,
    };
    const result = calculateRentalProperty(zeroCashInput);
    expect(result.totalCashInvested).toBe(0);
    expect(result.cashOnCashPercent).toBeNull();
  });

  it('handles negative cash flow gracefully', () => {
    const negativeFlowInput: RentalPropertyInput = {
      ...specDefaults,
      monthlyRent: 1200, // Very low rent compared to mortgage + expenses
    };
    const result = calculateRentalProperty(negativeFlowInput);

    expect(result.annualCashFlow).toBeLessThan(0);
    expect(result.cashOnCashPercent).toBeLessThan(0);
    expect(result.dscr).toBeLessThan(1.0);
  });

  it('ensures pro forma Year 1 values match the main year 1 returns tab', () => {
    const result = calculateRentalProperty(specDefaults);
    const yr1 = result.proFormaYears[0];

    expect(yr1.year).toBe(1);
    expect(yr1.grossRent).toBe(result.grossRentAnnual);
    expect(yr1.effectiveGrossIncome).toBe(result.effectiveGrossIncomeAnnual);
    expect(yr1.operatingExpenses).toBeCloseTo(result.expenses.totalOperatingExpensesAnnual, 1);
    expect(yr1.noi).toBeCloseTo(result.noiAnnual, 1);
    expect(yr1.debtService).toBeCloseTo(result.annualDebtService, 2);
    expect(yr1.annualCashFlow).toBeCloseTo(result.annualCashFlow, 2);
  });

  it('verifies pro forma equity and loan balance amortization tracking', () => {
    const result = calculateRentalProperty(specDefaults);
    const yr1 = result.proFormaYears[0];
    const yr10 = result.proFormaYears[9];

    // Loan balance decreases over 10 years
    expect(yr1.loanBalance).toBeLessThan(187500);
    expect(yr10.loanBalance).toBeLessThan(yr1.loanBalance);

    // Property value appreciates at 3%
    const expectedYr10Val = 250000 * Math.pow(1.03, 10);
    expect(yr10.propertyValue).toBeCloseTo(expectedYr10Val, 0);

    // Equity = Value - Loan balance
    expect(yr10.equity).toBeCloseTo(yr10.propertyValue - yr10.loanBalance, 0);

    // Total return and IRR exist and are positive
    expect(yr10.totalReturn).toBeGreaterThan(0);
    expect(yr10.irrPercent).toBeGreaterThan(0);
  });

  it('calculates break-even occupancy accurately', () => {
    const result = calculateRentalProperty(specDefaults);
    expect(result.breakEvenOccupancyPercent).toBeGreaterThan(70);
    expect(result.breakEvenOccupancyPercent).toBeLessThan(95);
    // Checked earlier formula: approx 83.97%
    expect(result.breakEvenOccupancyPercent).toBeCloseTo(83.97, 1);
  });

  it('correctly flags the 1% rule', () => {
    // 2400 / 250000 = 0.96% -> false
    const r1 = calculateRentalProperty(specDefaults);
    expect(r1.meetsOnePercentRule).toBe(false);

    // 2500 / 250000 = 1.0% -> true
    const r2 = calculateRentalProperty({
      ...specDefaults,
      monthlyRent: 2500,
    });
    expect(r2.meetsOnePercentRule).toBe(true);
  });

  it('provides side-by-side financed vs all-cash comparison', () => {
    const result = calculateRentalProperty(specDefaults);
    const comp = result.comparison;

    expect(comp.financed.cashInvested).toBe(75000);
    expect(comp.allCash.cashInvested).toBe(262500);

    // Financed has higher leverage / higher cash flow yield spread
    expect(comp.financed.annualCashFlow).toBeCloseTo(2921.89, 2);
    expect(comp.allCash.annualCashFlow).toBeCloseTo(17891.2, 1);
    expect(comp.allCash.dscr).toBeNull();
    expect(comp.financed.dscr).toBeCloseTo(1.2, 2);
  });
});
