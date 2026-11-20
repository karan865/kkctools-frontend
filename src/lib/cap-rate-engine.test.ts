import { describe, it, expect } from 'vitest';
import {
  calculateCapRateTool,
  calculateSensitivityGrid,
  calculateExitValue,
  CapRateEngineInput,
} from './cap-rate-engine';

describe('cap-rate-engine', () => {
  const defaultInput: CapRateEngineInput = {
    mode: 'cap-rate',
    noiMode: 'builder',
    directNoi: 0,
    incomeBasis: 'units',
    unitCount: 10,
    rentPerUnitMonthly: 1500,
    buildingSqft: 12000,
    rentPerSqftAnnual: 15,
    otherIncomeAnnual: 3000,
    vacancyPercent: 5,
    propertyTaxAnnual: 18000,
    insuranceAnnual: 6000,
    repairsAnnual: 9000,
    reservesAnnual: 3000,
    managementPercent: 6,
    purchasePrice: 2400000,
    targetCapRatePercent: 7,
    holdingPeriodYears: 5,
    annualNoiGrowthPercent: 3,
    exitCapRatePercent: 6.5,
  };

  it('produces the exact BLUF numbers with the spec defaults', () => {
    const result = calculateCapRateTool(defaultInput);

    // NOI calculation:
    // Rent: 10 * 1500 * 12 = $180,000
    // Vacancy: 5% of $180k = $9,000
    // Other income: $3,000
    // Effective Income: $174,000
    // Expenses: $18k + $6k + $9k + $3k = $36,000
    // Management: 6% of $174,000 = $10,440
    // Total expenses: $46,440
    // NOI: $174,000 - $46,440 = $127,560
    expect(result.effectiveNoi).toBe(127560);
    expect(result.isNoiNegative).toBe(false);

    // BLUF: Cap rate on $2,400,000 price = 5.315% (rounds to 5.32%)
    expect(result.calculatedCapRate).toBeCloseTo(5.315, 3);

    // Secondary metrics
    expect(result.grm).toBeCloseTo(13.333, 3); // $2.4M / $180k
    expect(result.pricePerUnit).toBe(240000); // $2.4M / 10 units
    expect(result.pricePerSqft).toBe(200); // $2.4M / 12,000 sqft
    expect(result.priceToNoiMultiple).toBeCloseTo(18.8146, 3); // $2.4M / $127,560
  });

  it('solves Property Value mode correctly', () => {
    const valInput: CapRateEngineInput = {
      ...defaultInput,
      mode: 'property-value',
      targetCapRatePercent: 7,
    };
    const result = calculateCapRateTool(valInput);

    // $127,560 NOI / 7% = $1,822,285.71
    expect(result.calculatedValue).toBeCloseTo(1822285.714, 2);
  });

  it('solves Required NOI mode correctly', () => {
    const reqInput: CapRateEngineInput = {
      ...defaultInput,
      mode: 'required-noi',
      purchasePrice: 2400000,
      targetCapRatePercent: 7,
    };
    const result = calculateCapRateTool(reqInput);

    // $2,400,000 * 7% = $168,000
    expect(result.calculatedRequiredNoi).toBe(168000);
  });

  it('computes sensitivity grid with center cell matching base valuation', () => {
    const baseNoi = 127560;
    const baseCap = 7.0;
    const grid = calculateSensitivityGrid(baseNoi, baseCap);

    expect(grid.rows.length).toBe(7); // 7 cap rate steps
    expect(grid.rows[0].cells.length).toBe(5); // 5 NOI steps

    // Center cell is index row 3 (capDelta = 0), col 2 (noiDelta = 0)
    const centerCell = grid.rows[3].cells[2];
    expect(centerCell.isBase).toBe(true);
    expect(centerCell.capRatePercent).toBe(7.0);
    expect(centerCell.noiAmount).toBe(127560);
    expect(centerCell.propertyValue).toBeCloseTo(1822285.714, 2);

    // Cap rate up 1% (8%), NOI down 10% ($114,804) -> Value = $1,435,050
    const testCell = grid.rows[6].cells[0];
    expect(testCell.capRatePercent).toBe(8.0);
    expect(testCell.noiAmount).toBe(114804);
    expect(testCell.propertyValue).toBeCloseTo(1435050, 0);
  });

  it('computes exit property valuation with compounding growth', () => {
    // Current NOI $127,560, 3% annual growth for 5 years:
    // Future NOI = $127,560 * (1.03)^5 = $147,877.00
    // Exit value at 6.5% cap rate = $147,877.00 / 0.065 = $2,275,030.78
    const exit = calculateExitValue(127560, 3, 5, 6.5);
    expect(exit.projectedNoi).toBeCloseTo(147877.0, 1);
    expect(exit.exitValue).toBeCloseTo(2275030.78, 1);
  });

  it('handles Direct NOI mode without builder fields', () => {
    const directInput: CapRateEngineInput = {
      ...defaultInput,
      noiMode: 'direct',
      directNoi: 150000,
      purchasePrice: 2000000,
    };
    const result = calculateCapRateTool(directInput);
    expect(result.effectiveNoi).toBe(150000);
    expect(result.calculatedCapRate).toBe(7.5);
  });

  it('handles sqft commercial income basis', () => {
    const sqftInput: CapRateEngineInput = {
      ...defaultInput,
      incomeBasis: 'sqft',
      buildingSqft: 20000,
      rentPerSqftAnnual: 25, // $500,000 gross rent
      otherIncomeAnnual: 0,
      vacancyPercent: 10, // $50,000 loss -> $450,000 EGI
      propertyTaxAnnual: 50000,
      insuranceAnnual: 15000,
      repairsAnnual: 20000,
      reservesAnnual: 10000,
      managementPercent: 5, // 5% of $450,000 = $22,500
      purchasePrice: 5000000,
    };
    // Total expenses: $50k + $15k + $20k + $10k + $22.5k = $117,500
    // NOI: $450,000 - $117,500 = $332,500
    // Cap rate: $332,500 / $5,000,000 = 6.65%
    const result = calculateCapRateTool(sqftInput);
    expect(result.effectiveNoi).toBe(332500);
    expect(result.calculatedCapRate).toBe(6.65);
    expect(result.pricePerSqft).toBe(250); // $5M / 20k sqft
  });

  it('handles negative NOI properly', () => {
    const negativeInput: CapRateEngineInput = {
      ...defaultInput,
      noiMode: 'direct',
      directNoi: -25000,
      purchasePrice: 1000000,
    };
    const result = calculateCapRateTool(negativeInput);
    expect(result.isNoiNegative).toBe(true);
    expect(result.calculatedCapRate).toBe(-2.5);
    expect(result.priceToNoiMultiple).toBeNull();
  });

  it('returns null for zero/negative prices or cap rates', () => {
    const zeroPriceInput: CapRateEngineInput = {
      ...defaultInput,
      purchasePrice: 0,
    };
    expect(calculateCapRateTool(zeroPriceInput).calculatedCapRate).toBeNull();

    const zeroCapInput: CapRateEngineInput = {
      ...defaultInput,
      mode: 'property-value',
      targetCapRatePercent: 0,
    };
    expect(calculateCapRateTool(zeroCapInput).calculatedValue).toBeNull();
  });
});
