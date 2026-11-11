import { describe, it, expect } from 'vitest';
import { calculateLaminateFlooring } from './laminate-engine';

describe('Laminate Flooring Calculator Engine', () => {
  it('calculates 18x14 room with 10% waste and 20 sq ft boxes accurately', () => {
    // 18x14 = 252 sq ft. With 10% waste = 277.2 sq ft.
    // 277.2 / 20 = 13.86 -> 14 boxes (280 sq ft)
    const result = calculateLaminateFlooring({
      mode: 'room',
      roomLengthFeet: 18,
      roomWidthFeet: 14,
      gradePresetId: 'waterproof',
      wastePercentage: 10,
    });

    expect(result.netAreaSqFt).toBe(252);
    expect(result.grossAreaSqFt).toBe(277.2);
    expect(result.perimeterLinearFeet).toBe(64.0); // 2 * (18 + 14)
    expect(result.sqFtPerBox).toBe(20.0);
    expect(result.boxesNeeded).toBe(14);
    expect(result.totalPurchasedSqFt).toBe(280.0);
    expect(result.surplusSqFt).toBeCloseTo(2.8, 1);
    expect(result.underlaymentRolls).toBe(3); // 277.2 / 100 = 3 rolls
  });

  it('handles direct square footage mode', () => {
    const result = calculateLaminateFlooring({
      mode: 'direct',
      directAreaSqFt: 500,
      gradePresetId: 'waterproof',
      wastePercentage: 10,
    });

    expect(result.netAreaSqFt).toBe(500);
    // Gross area: 500 * 1.10 = 550 sq ft
    expect(result.grossAreaSqFt).toBe(550);
    // 550 / 20 = 27.5 -> 28 boxes (560 sq ft)
    expect(result.boxesNeeded).toBe(28);
    expect(result.surplusSqFt).toBe(10);
    expect(result.underlaymentRolls).toBe(6);
  });

  it('adjusts box counts based on plank thickness and grade presets', () => {
    // Premium 12mm covers 18.5 sq ft per box
    const result = calculateLaminateFlooring({
      mode: 'direct',
      directAreaSqFt: 300,
      gradePresetId: 'premium12mm',
      wastePercentage: 10,
    });

    expect(result.sqFtPerBox).toBe(18.5);
    // Gross = 330 sq ft. 330 / 18.5 ≈ 17.83 -> 18 boxes
    expect(result.boxesNeeded).toBe(18);
  });

  it('computes material costs and DIY contractor savings benchmarks', () => {
    const result = calculateLaminateFlooring({
      mode: 'room',
      roomLengthFeet: 20,
      roomWidthFeet: 15,
      gradePresetId: 'waterproof',
      wastePercentage: 10,
      pricePerBox: 42.0,
      includeUnderlayment: true,
      moldingsAllowance: 50.0,
    });

    // 20x15 = 300 sq ft. Gross = 330 sq ft. 330 / 20 = 16.5 -> 17 boxes
    expect(result.boxesNeeded).toBe(17);
    expect(result.flooringMaterialCost).toBe(17 * 42.0); // 714.00
    // Underlayment: ceil(330/100) = 4 rolls * 40 = 160.00
    expect(result.underlaymentCost).toBe(160.0);
    expect(result.moldingsCost).toBe(50.0);
    expect(result.totalDiyCost).toBe(924.0);
    // Pro labor benchmarks: 300 sq ft * ($2 - $5) = $600 - $1500
    expect(result.proEstimatedCostLow).toBe(600);
    expect(result.proEstimatedCostHigh).toBe(1500);
  });
});

