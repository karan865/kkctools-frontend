import { describe, it, expect } from 'vitest';
import {
  calculateStrProfit,
  calculateStrScenarios,
  compareStrVsLtr,
  StrRevenueInput,
  StrPlatformFeesInput,
  StrVariableCostsInput,
  StrFixedCostsInput,
  StrTaxInput,
  StrFinancingInput,
  StrLtrComparisonInput,
} from './str-engine';

describe('Short-Term Rental (STR) Profit Engine', () => {
  const defaultRevenue: StrRevenueInput = {
    nightlyRate: 180,
    occupancyPct: 65,
    nightsAvailable: 365,
    avgStayNights: 3,
    cleaningFeeCharged: 90,
    weekendUpliftPct: 0,
    otherIncomeAnnual: 0,
  };

  const defaultPlatform: StrPlatformFeesInput = {
    hostFeePct: 3,
    paymentProcessingFeePct: 0,
  };

  const defaultVariable: StrVariableCostsInput = {
    cleaningCostPerTurnover: 80,
    suppliesPerStay: 10,
    managementFeePct: 0,
    maintenancePct: 5,
  };

  const defaultFixed: StrFixedCostsInput = {
    utilitiesMonthly: 250,
    internetMonthly: 60,
    insuranceMonthly: 150,
    softwareMonthly: 0,
    hoaMonthly: 0,
    licencesAnnual: 0,
    propertyTaxAnnual: 0,
  };

  const defaultTax: StrTaxInput = {
    occupancyTaxPct: 0,
  };

  const defaultFinancing: StrFinancingInput = {
    mode: 'buy',
    mortgagePaymentMonthly: 1800,
    cashInvested: 60000,
    startupCost: 15000,
    propertyPurchasePrice: 300000,
  };

  it('matches the BUILD SPEC §3.4 worked example exactly', () => {
    const res = calculateStrProfit(
      defaultRevenue,
      defaultPlatform,
      defaultVariable,
      defaultFixed,
      defaultTax,
      defaultFinancing
    );

    // Booked nights: 365 * 0.65 = 237.25
    expect(res.bookedNights).toBeCloseTo(237.25, 2);
    // Stays count: 237.25 / 3 = 79.0833
    expect(res.staysCount).toBeCloseTo(79.0833, 2);
    // Revenue: 237.25 * $180 ($42,705) + 79.0833 * $90 ($7,117.50) = $49,822.50
    expect(res.grossRevenueAnnual).toBeCloseTo(49822.5, 2);
    // Platform fee: $49,822.50 * 3% = $1,494.675
    expect(res.platformFeesAnnual).toBeCloseTo(1494.68, 1);
    // Variable costs: 79.0833 * $80 ($6,326.67) + 79.0833 * $10 ($790.83) + $49,822.50 * 5% ($2,491.13) = $9,608.63
    expect(res.totalVariableCostsAnnual).toBeCloseTo(9608.63, 1);
    // Fixed costs: 12 * ($250 + $60 + $150) = $5,520.00
    expect(res.totalFixedCostsAnnual).toBeCloseTo(5520, 1);
    // Total Opex: $1,494.68 + $9,608.63 + $5,520 = $16,623.30
    expect(res.totalOperatingExpensesAnnual).toBeCloseTo(16623.3, 1);
    // NOI: $49,822.50 - $16,623.30 = $33,199.20
    expect(res.noiAnnual).toBeCloseTo(33199.2, 1);
    // Annual Debt Service: 12 * $1,800 = $21,600
    expect(res.annualDebtServiceOrRent).toBe(21600);
    // Cash Flow: $33,199.20 - $21,600 = $11,599.20/yr
    expect(res.cashFlowAnnual).toBeCloseTo(11599.2, 1);
    // Monthly Cash Flow: $11,599.20 / 12 = $966.60/mo
    expect(res.cashFlowMonthly).toBeCloseTo(966.6, 1);
    // Total cash invested: $60,000 + $15,000 = $75,000
    expect(res.totalCashInvested).toBe(75000);
    // Cash-on-Cash Return: ($11,599.20 / $75,000) * 100 = 15.47%
    expect(res.cashOnCashReturnPct).toBeCloseTo(15.47, 1);
    // RevPAR: $180 * 0.65 = $117.00
    expect(res.revPar).toBeCloseTo(117, 1);
    // Break-even occupancy: 45.53%
    expect(res.breakEvenOccupancyPct).toBeCloseTo(45.53, 1);
    // Furniture payback: $15,000 / $966.60 = 15.52 months
    expect(res.paybackPeriodMonths).toBeCloseTo(15.52, 1);
  });

  it('validates break-even occupancy mathematically', () => {
    const baseline = calculateStrProfit(
      defaultRevenue,
      defaultPlatform,
      defaultVariable,
      defaultFixed,
      defaultTax,
      defaultFinancing
    );

    expect(baseline.breakEvenOccupancyPct).not.toBeNull();
    const beOcc = baseline.breakEvenOccupancyPct!;

    // When occupancy is set to break-even occupancy, cash flow should be zero (within cents)
    const atBreakEven = calculateStrProfit(
      { ...defaultRevenue, occupancyPct: beOcc },
      defaultPlatform,
      defaultVariable,
      defaultFixed,
      defaultTax,
      defaultFinancing
    );

    expect(atBreakEven.cashFlowAnnual).toBeCloseTo(0, 0);
  });

  it('validates break-even ADR mathematically', () => {
    const baseline = calculateStrProfit(
      defaultRevenue,
      defaultPlatform,
      defaultVariable,
      defaultFixed,
      defaultTax,
      defaultFinancing
    );

    expect(baseline.breakEvenAdr).not.toBeNull();
    const beAdr = baseline.breakEvenAdr!;

    // When ADR is set to break-even ADR, cash flow should be zero (within cents)
    const atBreakEven = calculateStrProfit(
      { ...defaultRevenue, nightlyRate: beAdr },
      defaultPlatform,
      defaultVariable,
      defaultFixed,
      defaultTax,
      defaultFinancing
    );

    expect(atBreakEven.cashFlowAnnual).toBeCloseTo(0, 0);
  });

  it('supports rental arbitrage mode with master lease rent', () => {
    const arbitrageFinancing: StrFinancingInput = {
      mode: 'arbitrage',
      rentToLandlordMonthly: 2000,
      cashInvested: 4000, // Security deposit
      startupCost: 8000, // Furnishing
    };

    const res = calculateStrProfit(
      defaultRevenue,
      defaultPlatform,
      defaultVariable,
      defaultFixed,
      defaultTax,
      arbitrageFinancing
    );

    // Annual Rent to Landlord: 12 * $2,000 = $24,000
    expect(res.annualDebtServiceOrRent).toBe(24000);
    // Cash Flow: $33,199.20 - $24,000 = $9,199.20
    expect(res.cashFlowAnnual).toBeCloseTo(9199.2, 1);
    expect(res.cashFlowMonthly).toBeCloseTo(766.6, 1);
    // Total capital: $4,000 + $8,000 = $12,000
    expect(res.totalCashInvested).toBe(12000);
    // Cash-on-cash: ($9,199.20 / $12,000) * 100 = 76.66%
    expect(res.cashOnCashReturnPct).toBeCloseTo(76.66, 1);
    // Payback: $8,000 / $766.60 = 10.44 months
    expect(res.paybackPeriodMonths).toBeCloseTo(10.44, 1);
  });

  it('calculates mid-term rental (30+ day stays) dynamics correctly', () => {
    const midtermRevenue: StrRevenueInput = {
      nightlyRate: 110, // $3,300/mo effective
      occupancyPct: 85,
      nightsAvailable: 365,
      avgStayNights: 45, // 1.5 month stays
      cleaningFeeCharged: 150,
      weekendUpliftPct: 0,
      otherIncomeAnnual: 0,
    };

    const res = calculateStrProfit(
      midtermRevenue,
      defaultPlatform,
      defaultVariable,
      defaultFixed,
      defaultTax,
      defaultFinancing
    );

    // Booked nights: 365 * 0.85 = 310.25
    expect(res.bookedNights).toBeCloseTo(310.25, 2);
    // Stays count: 310.25 / 45 = 6.89 stays (far fewer cleanings than STR)
    expect(res.staysCount).toBeCloseTo(6.89, 2);
    // Variable cleaning expense: 6.89 * $80 = $551.56 (vs $6,326.67 in STR)
    expect(res.cleaningExpensesAnnual).toBeCloseTo(551.56, 1);
    expect(res.noiAnnual).toBeGreaterThan(0);
  });

  it('handles weekend uplift pricing correctly', () => {
    const resNoUplift = calculateStrProfit(
      { ...defaultRevenue, weekendUpliftPct: 0 },
      defaultPlatform,
      defaultVariable,
      defaultFixed,
      defaultTax,
      defaultFinancing
    );

    const resWithUplift = calculateStrProfit(
      { ...defaultRevenue, weekendUpliftPct: 25 }, // +25% on weekends
      defaultPlatform,
      defaultVariable,
      defaultFixed,
      defaultTax,
      defaultFinancing
    );

    // Weekend uplift should increase gross revenue
    expect(resWithUplift.grossRevenueAnnual).toBeGreaterThan(resNoUplift.grossRevenueAnnual);
    // 2/7 of nights get +25%: blended uplift = 1 + (2/7)*0.25 = 1 + 0.0714 = 1.0714
    expect(resWithUplift.nightlyGrossRevenue / resNoUplift.nightlyGrossRevenue).toBeCloseTo(1 + (2 / 7) * 0.25, 4);
  });

  it('generates 3 distinct scenario projections', () => {
    const scenarios = calculateStrScenarios(
      defaultRevenue,
      defaultPlatform,
      defaultVariable,
      defaultFixed,
      defaultTax,
      defaultFinancing
    );

    expect(scenarios).toHaveLength(3);
    const [conservative, expected, optimistic] = scenarios;

    expect(conservative.label).toBe('Conservative');
    expect(expected.label).toContain('Expected');
    expect(optimistic.label).toBe('Optimistic');

    expect(conservative.grossRevenue).toBeLessThan(expected.grossRevenue);
    expect(expected.grossRevenue).toBeLessThan(optimistic.grossRevenue);

    expect(conservative.annualCashFlow).toBeLessThan(expected.annualCashFlow);
    expect(expected.annualCashFlow).toBeLessThan(optimistic.annualCashFlow);
  });

  it('compares STR vs Long-Term Rental (LTR) objectively', () => {
    const strRes = calculateStrProfit(
      defaultRevenue,
      defaultPlatform,
      defaultVariable,
      defaultFixed,
      defaultTax,
      defaultFinancing
    );

    const ltrInput: StrLtrComparisonInput = {
      monthlyLtrRent: 2400,
      ltrVacancyPct: 5,
      ltrManagementPct: 8,
      ltrMaintenancePct: 5,
      ltrFixedMonthlyUtilities: 0,
    };

    const comp = compareStrVsLtr(strRes, defaultFinancing, ltrInput);

    // LTR Potential: 12 * $2,400 = $28,800
    // Effective gross: $28,800 * 0.95 = $27,360
    expect(comp.ltrAnnualGrossRent).toBeCloseTo(27360, 2);
    // LTR Opex: 8% + 5% = 13% of $27,360 = $3,556.80
    expect(comp.ltrAnnualOpex).toBeCloseTo(3556.8, 1);
    // LTR NOI: $27,360 - $3,556.80 = $23,803.20
    // LTR Cash Flow after $21,600 mortgage: $23,803.20 - $21,600 = $2,203.20/yr ($183.60/mo)
    expect(comp.ltrAnnualCashFlow).toBeCloseTo(2203.2, 1);
    expect(comp.ltrMonthlyCashFlow).toBeCloseTo(183.6, 1);

    // STR generates $11,599.20 vs LTR $2,203.20 -> Difference = $9,396.00/yr ($783.00/mo)
    expect(comp.annualCashFlowDifference).toBeCloseTo(9396, 1);
    expect(comp.monthlyCashFlowDifference).toBeCloseTo(783, 1);
    expect(comp.strPremiumPct).toBeGreaterThan(0);
  });

  it('safely handles zero cash flow or negative cash flow for payback', () => {
    const highCostFinancing: StrFinancingInput = {
      mode: 'buy',
      mortgagePaymentMonthly: 5000, // Exceeds NOI -> negative cash flow
      cashInvested: 60000,
      startupCost: 15000,
    };

    const res = calculateStrProfit(
      defaultRevenue,
      defaultPlatform,
      defaultVariable,
      defaultFixed,
      defaultTax,
      highCostFinancing
    );

    expect(res.cashFlowAnnual).toBeLessThan(0);
    expect(res.paybackPeriodMonths).toBeNull(); // Cannot payback on negative cash flow
    expect(res.cashOnCashReturnPct).toBeLessThan(0);
  });
});
