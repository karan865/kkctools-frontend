import { describe, it, expect } from 'vitest';
import {
  calculateSingleProductCvp,
  calculateSalesMixCvp,
  calculateWhatIfScenario,
} from './contribution-margin-engine';

describe('contribution-margin-engine', () => {
  // Test case 1: Spec worked example defaults
  // Price $50, VC $30, Fixed $20,000, Units 1,500, Target $15,000
  it('calculates spec worked example defaults accurately', () => {
    const result = calculateSingleProductCvp({
      sellingPrice: 50,
      variableCostPerUnit: 30,
      fixedCosts: 20000,
      unitsSold: 1500,
      targetProfit: 15000,
    });

    expect(result.cmPerUnit).toBe(20);
    expect(result.cmRatio).toBeCloseTo(0.40, 4);
    expect(result.totalRevenue).toBe(75000);
    expect(result.totalVariableCosts).toBe(45000);
    expect(result.totalCm).toBe(30000);
    expect(result.operatingIncome).toBe(10000);
    expect(result.isOperatingProfit).toBe(true);

    // Break-even
    expect(result.breakEvenUnits).toBe(1000);
    expect(result.breakEvenSales).toBe(50000);

    // Margin of safety
    expect(result.marginOfSafetyUnits).toBe(500);
    expect(result.marginOfSafetySales).toBe(25000);
    expect(result.marginOfSafetyRatio).toBeCloseTo(0.3333, 4);

    // DOL: $30,000 / $10,000 = 3.0
    expect(result.dol).toBe(3.0);
    expect(result.profitImpactWithTenPctSalesIncrease).toBe(3000); // 10,000 * 3.0 * 0.1 = 3000

    // Target profit: ($20,000 + $15,000) / $20 = 1,750 units
    expect(result.targetUnits).toBe(1750);
    expect(result.targetSales).toBe(87500);

    // Income statement check
    expect(result.statement.salesRevenue.total).toBe(75000);
    expect(result.statement.variableCosts.total).toBe(45000);
    expect(result.statement.contributionMargin.total).toBe(30000);
    expect(result.statement.fixedCosts.total).toBe(20000);
    expect(result.statement.operatingIncome.total).toBe(10000);
  });

  // Test case 2: Negative/zero CM per unit (loss-making)
  it('handles negative or zero contribution margin gracefully', () => {
    const result = calculateSingleProductCvp({
      sellingPrice: 25,
      variableCostPerUnit: 30,
      fixedCosts: 10000,
      unitsSold: 500,
    });

    expect(result.cmPerUnit).toBe(-5);
    expect(result.isLossMakingPerUnit).toBe(true);
    expect(result.breakEvenUnits).toBeNull();
    expect(result.breakEvenSales).toBeNull();
    expect(result.targetUnits).toBeNull();
    expect(result.operatingIncome).toBe(-12500); // (-5 * 500) - 10000 = -12500
  });

  // Test case 3: After-tax target profit calculation
  it('correctly gross-up after-tax target profit', () => {
    // If target after-tax profit is $12,000 with a 20% tax rate, pre-tax needed is $12,000 / (1 - 0.20) = $15,000
    const result = calculateSingleProductCvp({
      sellingPrice: 50,
      variableCostPerUnit: 30,
      fixedCosts: 20000,
      unitsSold: 1500,
      targetProfit: 12000,
      isTargetAfterTax: true,
      taxRatePercent: 20,
    });

    expect(result.targetProfitAfterTax).toBe(12000);
    expect(result.targetProfitPreTax).toBe(15000);
    expect(result.targetUnits).toBe(1750);
  });

  // Test case 4: Time to break-even from monthly run-rate
  it('computes time to break-even accurately when monthly volume provided', () => {
    const result = calculateSingleProductCvp({
      sellingPrice: 50,
      variableCostPerUnit: 30,
      fixedCosts: 20000,
      unitsSold: 1500,
      monthlyUnitVolume: 250,
    });

    // 1,000 break-even units / 250 units/month = 4.0 months
    expect(result.timeToBreakEvenMonths).toBe(4.0);
  });

  // Test case 5: Multi-product sales mix (weighted CM != simple average)
  it('calculates weighted sales mix and ensures weighted CM != simple average', () => {
    // Product A: Price $100, VC $40 -> CM $60, Mix 70%
    // Product B: Price $50, VC $40 -> CM $10, Mix 30%
    // Simple average CM = (60 + 10) / 2 = $35
    // Weighted CM = 0.70 * 60 + 0.30 * 10 = 42 + 3 = $45
    // Fixed costs = $90,000
    // Total Break-Even = 90,000 / 45 = 2,000 units
    // Product A BE = 2,000 * 0.70 = 1,400 units ($140,000)
    // Product B BE = 2,000 * 0.30 = 600 units ($30,000)
    // Total BE sales = $170,000
    const mixResult = calculateSalesMixCvp(
      [
        { id: '1', name: 'Premium Service', sellingPrice: 100, variableCostPerUnit: 40, mixPercent: 70 },
        { id: '2', name: 'Basic Service', sellingPrice: 50, variableCostPerUnit: 40, mixPercent: 30 },
      ],
      90000
    );

    expect(mixResult.weightedCmPerUnit).toBe(45);
    expect(mixResult.weightedCmPerUnit).not.toBe(35); // Confirms weighted != simple average
    expect(mixResult.breakEvenTotalUnits).toBe(2000);

    const prodA = mixResult.products[0];
    const prodB = mixResult.products[1];

    expect(prodA.breakEvenUnits).toBe(1400);
    expect(prodA.breakEvenSales).toBe(140000);
    expect(prodB.breakEvenUnits).toBe(600);
    expect(prodB.breakEvenSales).toBe(30000);
  });

  // Test case 6: What-If simulation
  it('calculates what-if scenario sensitivity against baseline', () => {
    const base = {
      sellingPrice: 50,
      variableCostPerUnit: 30,
      fixedCosts: 20000,
      unitsSold: 1500,
    };

    // +10% price, -5% variable cost, +0% fixed, +10% volume
    const whatIf = calculateWhatIfScenario({
      base,
      priceChangePct: 10, // $55
      variableCostChangePct: -5, // $28.50 -> CM = $26.50
      fixedCostChangePct: 0, // $20,000
      volumeChangePct: 10, // 1,650 units
    });

    expect(whatIf.sellingPrice).toBe(55);
    expect(whatIf.variableCostPerUnit).toBe(28.5);
    expect(whatIf.cmPerUnit).toBe(26.5);
    expect(whatIf.unitsSold).toBe(1650);

    // New operating income = 1,650 * 26.5 - 20,000 = 43,725 - 20,000 = 23,725
    expect(whatIf.operatingIncome).toBe(23725);
    // Base operating income was $10,000
    expect(whatIf.incomeChangeFromBase).toBe(13725);
    expect(whatIf.incomeChangePctFromBase).toBe(137.25);
  });
});
