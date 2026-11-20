import { describe, it, expect } from 'vitest';
import {
  calculateSde,
  calculateEbitda,
  calculateBusinessValuation,
  generateValuationSensitivity,
  calculateAssetValuation,
  calculateDealStructure,
} from './business-valuation-engine';

describe('business-valuation-engine', () => {
  it('calculates SDE matching spec defaults and bridge items', () => {
    // Defaults: $120k profit, $80k salary, $10k benefits, $5k personal, $8k one-off, $12k D&A, $6k interest
    // Total SDE = 120 + 80 + 10 + 5 + 8 + 12 + 6 = 241k
    const sdeResult = calculateSde({
      netProfit: 120000,
      ownerSalary: 80000,
      ownerBenefits: 10000,
      personalExpenses: 5000,
      oneOffExpenses: 8000,
      depreciationAmortization: 12000,
      interestExpense: 6000,
    });

    expect(sdeResult.sde).toBe(241000);
    expect(sdeResult.bridge.length).toBe(7);
    expect(sdeResult.bridge[0].amount).toBe(120000);
    expect(sdeResult.bridge[1].amount).toBe(80000);
  });

  it('calculates Enterprise Value range and Net Equity proceeds matching spec', () => {
    // SDE = $241,000, multiple 2.0x to 3.0x (mid 2.5x)
    // EV: low = 482k, high = 723k, mid = 602.5k
    // Debt: 50k, Cash: 30k -> Equity: mid = 602.5k - 50k + 30k = 582.5k
    const val = calculateBusinessValuation({
      earnings: 241000,
      multipleLow: 2.0,
      multipleHigh: 3.0,
      debtToRepay: 50000,
      cashKeptBySeller: 30000,
    });

    expect(val.enterpriseValueLow).toBe(482000);
    expect(val.enterpriseValueHigh).toBe(723000);
    expect(val.enterpriseValueMid).toBe(602500);
    expect(val.equityValueMid).toBe(582500);
    expect(val.isEarningsPositive).toBe(true);
  });

  it('calculates Adjusted EBITDA with replacement manager salary', () => {
    // SDE = $241,000, replacement manager salary = $75,000
    // Adjusted EBITDA = $241,000 - $75,000 = $166,000
    const ebitda = calculateEbitda({
      netProfit: 120000,
      interestExpense: 6000,
      incomeTaxes: 0,
      depreciationAmortization: 12000,
      sde: 241000,
      replacementManagerSalary: 75000,
    });

    expect(ebitda.reportedEbitda).toBe(138000); // 120 + 6 + 12
    expect(ebitda.adjustedEbitda).toBe(166000); // 241 - 75
  });

  it('generates 5x5 valuation sensitivity matrix where center equals base', () => {
    const matrix = generateValuationSensitivity(200000, 3.0);

    expect(matrix.grid.length).toBe(5);
    expect(matrix.grid[0].length).toBe(5);

    // Center cell: 0% earnings delta, 0 multiple delta (200k @ 3.0x = 600k)
    const centerCell = matrix.grid[2][2];
    expect(centerCell.earnings).toBe(200000);
    expect(centerCell.multiple).toBe(3.0);
    expect(centerCell.enterpriseValue).toBe(600000);

    // Bottom-right: +10% earnings (220k), +0.5x multiple (3.5x) = 770k
    const maxCell = matrix.grid[4][4];
    expect(maxCell.earnings).toBe(220000);
    expect(maxCell.multiple).toBe(3.5);
    expect(maxCell.enterpriseValue).toBe(770000);
  });

  it('calculates Asset-Based floor valuation (Net Asset Value)', () => {
    const assets = calculateAssetValuation({
      equipmentValue: 150000,
      inventoryValue: 50000,
      accountsReceivable: 40000,
      cashAndEquivalents: 20000,
      otherTangibleAssets: 10000,
      totalLiabilities: 70000,
    });

    expect(assets.totalTangibleAssets).toBe(270000);
    expect(assets.totalLiabilities).toBe(70000);
    expect(assets.netAssetValue).toBe(200000);
  });

  it('calculates Deal Structure financing and seller note payments', () => {
    // $600,000 price: 70% cash ($420k), 20% seller note ($120k at 7% for 5 yrs), 10% earn-out ($60k)
    const deal = calculateDealStructure({
      totalPurchasePrice: 600000,
      cashAtClosePercent: 70,
      sellerNotePercent: 20,
      sellerNoteInterestRate: 7.0,
      sellerNoteTermYears: 5,
      earnOutPercent: 10,
    });

    expect(deal.cashAtCloseAmount).toBe(420000);
    expect(deal.sellerNoteAmount).toBe(120000);
    expect(deal.earnOutAmount).toBe(60000);
    // $120,000 at 7% over 60 months = $2,376.14/mo
    expect(deal.sellerNoteMonthlyPayment).toBe(2376.14);
    expect(deal.sellerNoteTotalInterest).toBeCloseTo(22568.4, 0);
  });

  it('handles negative earnings by returning 0 EV and setting isEarningsPositive false', () => {
    const val = calculateBusinessValuation({
      earnings: -50000,
      multipleLow: 2.0,
      multipleHigh: 3.0,
    });

    expect(val.enterpriseValueLow).toBe(0);
    expect(val.enterpriseValueHigh).toBe(0);
    expect(val.isEarningsPositive).toBe(false);
  });
});
