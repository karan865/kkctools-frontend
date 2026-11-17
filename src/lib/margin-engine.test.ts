import { describe, it, expect } from 'vitest';
import {
  calculateGrossMargin,
  calculatePnL,
  priceForTargetMargin,
  calculateProductMix,
} from './margin-engine';

describe('Margin Engine — Gross Margin Calculations', () => {
  it('calculates gross profit, gross margin %, and markup % correctly', () => {
    // Standard retail case: $100 revenue, $60 COGS -> $40 profit (40% margin, 66.67% markup)
    const res = calculateGrossMargin({ revenue: 100, cogs: 60 });
    expect(res.grossProfit).toBe(40);
    expect(res.grossMarginPercent).toBe(40);
    expect(Number(res.markupPercent?.toFixed(2))).toBe(66.67);
    expect(res.multiplier).toBe(1.666666666667);
    expect(res.isNegative).toBe(false);
  });

  it('handles per-unit breakdowns when units count is supplied', () => {
    // 500 units sold, $25,000 revenue, $15,000 COGS
    const res = calculateGrossMargin({ revenue: 25000, cogs: 15000, units: 500 });
    expect(res.revenuePerUnit).toBe(50);
    expect(res.costPerUnit).toBe(30);
    expect(res.profitPerUnit).toBe(20);
    expect(res.grossMarginPercent).toBe(40);
  });

  it('safely handles zero revenue (returns null for margin)', () => {
    const res = calculateGrossMargin({ revenue: 0, cogs: 50 });
    expect(res.grossProfit).toBe(-50);
    expect(res.grossMarginPercent).toBeNull();
    expect(res.isNegative).toBe(true);
  });

  it('calculates negative gross margin correctly when selling below cost', () => {
    // Clearance item: $80 revenue on $100 cost -> -$20 profit (-25% margin)
    const res = calculateGrossMargin({ revenue: 80, cogs: 100 });
    expect(res.grossProfit).toBe(-20);
    expect(res.grossMarginPercent).toBe(-25);
    expect(res.markupPercent).toBe(-20);
    expect(res.isNegative).toBe(true);
  });
});

describe('Margin Engine — Full P&L (Gross, Operating, EBITDA, Net)', () => {
  it('computes complete multi-tier income statement cascade', () => {
    const pnl = calculatePnL({
      grossSales: 105000,
      returnsAndAllowances: 5000, // Net revenue = 100,000
      cogs: 60000, // Gross profit = 40,000 (40%)
      operatingExpenses: {
        rent: 5000,
        salaries: 12000,
        marketing: 3000,
      }, // OPEX = 20,000 -> EBIT = 20,000 (20%)
      depreciationAmortization: 4000, // EBITDA = 24,000 (24%)
      interest: 2000,
      taxes: 3000, // Net profit = 15,000 (15%)
    });

    expect(pnl.netRevenue).toBe(100000);
    expect(pnl.grossProfit).toBe(40000);
    expect(pnl.grossMarginPercent).toBe(40);

    expect(pnl.operatingExpenses).toBe(20000);
    expect(pnl.operatingProfit).toBe(20000);
    expect(pnl.operatingMarginPercent).toBe(20);

    expect(pnl.ebitda).toBe(24000);
    expect(pnl.ebitdaMarginPercent).toBe(24);

    expect(pnl.netProfit).toBe(15000);
    expect(pnl.netMarginPercent).toBe(15);

    expect(pnl.waterfall).toHaveLength(7);
    expect(pnl.waterfall[0].label).toBe('Net Revenue');
    expect(pnl.waterfall[6].label).toBe('Net Profit');
    expect(pnl.waterfall[6].amount).toBe(15000);
  });
});

describe('Margin Engine — Price for Target Margin', () => {
  it('calculates selling price and equivalent markup for target gross margin', () => {
    // Cost $60, Target 40% margin -> Price = 60 / (1 - 0.40) = $100
    const res = priceForTargetMargin(60, 40);
    expect(res.sellingPrice).toBe(100);
    expect(res.grossProfit).toBe(40);
    expect(Number(res.equivalentMarkupPercent?.toFixed(2))).toBe(66.67);
  });

  it('adjusts price when platform fee % is present', () => {
    // Cost $50, target margin 30%, fee 10%
    // Price = 50 / (1 - 0.30 - 0.10) = 50 / 0.60 = $83.3333333333
    const res = priceForTargetMargin(50, 30, 10);
    expect(Number(res.sellingPrice?.toFixed(2))).toBe(83.33);
  });

  it('returns null when target margin + fee >= 100%', () => {
    const res = priceForTargetMargin(50, 95, 10);
    expect(res.sellingPrice).toBeNull();
  });
});

describe('Margin Engine — Multi-Product Mix & Blended Margin Proof', () => {
  it('proves that blended margin is weighted and NOT the simple average of margins', () => {
    // Product A (High Volume, Low Margin): 1,000 units @ $10 price ($8 cost) -> $10,000 rev, $2,000 profit (20% margin)
    // Product B (Low Volume, High Margin): 10 units @ $100 price ($20 cost) -> $1,000 rev, $800 profit (80% margin)
    // Simple average of margins = (20% + 80%) / 2 = 50.00%
    // Real Blended Margin = (2,000 + 800) / (10,000 + 1,000) = 2,800 / 11,000 = 25.45%
    const res = calculateProductMix([
      { name: 'Product A (Budget)', units: 1000, pricePerUnit: 10, costPerUnit: 8 },
      { name: 'Product B (Luxury)', units: 10, pricePerUnit: 100, costPerUnit: 20 },
    ]);

    expect(res.totalRevenue).toBe(11000);
    expect(res.totalCost).toBe(8200);
    expect(res.totalProfit).toBe(2800);

    expect(res.simpleAverageMarginPercent).toBe(50);
    expect(Number(res.blendedMarginPercent?.toFixed(2))).toBe(25.45);

    // Mathematical Proof: Blended margin is heavily skewed towards high-volume Product A
    expect(res.blendedMarginPercent).not.toBe(res.simpleAverageMarginPercent);
  });
});
