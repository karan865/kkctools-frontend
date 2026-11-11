import { describe, it, expect } from 'vitest';
import {
  calculateStone,
  calculateRowVolume,
  calculateCoveragePerTon,
} from './stone-engine';

describe('Stone / Rock / Aggregate Calculation Engine (Tool #13 Verification Suite)', () => {
  // Test 1: Default example
  // 20×10 ft × 3 in, #57 (1.40), 10% -> net 50.0 cu ft, gross 55.0, 2.04 yd³, 2.85 tons, 5,704 lb, 2.59 tonnes, 115 bags (50 lb), suggested 3.0 tons / 2.5 yd³
  it('Vector 1: Default example (20x10 ft x 3 in, #57, 10% waste)', () => {
    const res = calculateStone({
      areas: [
        {
          id: '1',
          shape: 'rectangle',
          lengthFt: 20,
          widthFt: 10,
          depthInches: 3,
        },
      ],
      presetId: 'crushedStone57',
      wastePercent: 10,
      bagBasis: '50lb',
      orderRoundingStep: 0.5,
    });

    expect(res.netAreaSqFt).toBe(200);
    expect(res.netVolumeCuFt).toBe(50.0);
    expect(res.grossVolumeCuFt).toBe(55.0);
    expect(res.volumeCuYards).toBe(2.04);
    expect(res.totalWeightTons).toBe(2.85); // 2.04 * 1.40 = 2.856 -> 2.85 (or 2.86)
    expect(res.suggestedTons).toBe(3.0);
    expect(res.suggestedYards).toBe(2.5);
    expect(res.bagsCount).toBe(115); // 5700 / 50 = 114 or 115
  });

  // Test 2: Float regression test
  // 20×10 ft × 3 in, 10%, custom 100 lb/cu ft -> exactly 5,500 lb -> exactly 110 bags (not 111) and 2.75 tons
  it('Vector 2: Float regression guard (5,500 lb gives exactly 110 bags, not 111)', () => {
    const res = calculateStone({
      areas: [
        {
          id: '1',
          shape: 'rectangle',
          lengthFt: 20,
          widthFt: 10,
          depthInches: 3,
        },
      ],
      presetId: 'custom',
      customDensityUnit: 'lbPerCuFt',
      customDensityValue: 100, // 100 lb/cu ft
      wastePercent: 10,
      bagBasis: '50lb',
    });

    // Gross cu ft = 55.0. Total weight = 55 * 100 = 5500 lb.
    // 5500 / 50 = 110. Floating point arithmetic must not produce 111!
    expect(res.grossVolumeCuFt).toBe(55.0);
    expect(res.bagsCount).toBe(110);
  });

  // Test 3: Worked example
  // 24×12 ft × 3 in, river rock 1.35, 10% -> gross 79.2 cu ft, 2.93 yd³, 3.96 tons, 7,920 lb, 159 bags, suggested 4.0 tons
  it('Vector 3: Worked Example (24x12 ft x 3 in river rock, 10% waste)', () => {
    const res = calculateStone({
      areas: [
        {
          id: '1',
          shape: 'rectangle',
          lengthFt: 24,
          widthFt: 12,
          depthInches: 3,
        },
      ],
      presetId: 'riverRock',
      wastePercent: 10,
      bagBasis: '50lb',
      orderRoundingStep: 0.5,
    });

    expect(res.netAreaSqFt).toBe(288);
    expect(res.grossVolumeCuFt).toBe(79.2); // 72 * 1.10 = 79.2
    expect(res.volumeCuYards).toBe(2.93); // 79.2 / 27 = 2.9333... -> 2.93
    expect(res.totalWeightTons).toBe(3.96); // 2.93 * 1.35 = 3.9555 -> 3.96
    expect(res.suggestedTons).toBe(4.0);
    expect(res.bagsCount).toBe(159); // 3.96 * 2000 = 7920 lb -> 7920 / 50 = 158.4 -> 159 bags
  });

  // Test 4: Circular & Multi-area calculations
  it('Vector 4: Circular area and multi-row combined volume', () => {
    const circle = calculateRowVolume({
      id: 'c1',
      shape: 'circle',
      diameterFt: 10,
      depthInches: 3,
    });
    // pi * 5^2 * (3/12) = 25 * pi * 0.25 = 19.63495... cu ft
    expect(circle.volumeCuFt).toBeCloseTo(19.63, 1);

    const multi = calculateStone({
      areas: [
        { id: '1', shape: 'rectangle', lengthFt: 20, widthFt: 10, depthInches: 3 }, // 50 cu ft
        { id: '2', shape: 'circle', diameterFt: 10, depthInches: 2 }, // pi * 25 * (2/12) = 13.0899 cu ft
      ],
      presetId: 'crushedStone57',
      wastePercent: 0,
    });
    // 50 + 13.09 = 63.09 cu ft
    expect(multi.netVolumeCuFt).toBeCloseTo(63.09, 1);
  });

  // Test 5: Bag basis selector
  it('Vector 5: Bag selector basis (40 lb and 0.5 cu ft)', () => {
    const res40lb = calculateStone({
      areas: [{ id: '1', shape: 'rectangle', lengthFt: 20, widthFt: 10, depthInches: 3 }],
      presetId: 'crushedStone57',
      wastePercent: 10,
      bagBasis: '40lb',
    });
    // 5700 lb / 40 = 142.5 -> 143 bags
    expect(res40lb.bagsCount).toBe(143);

    const resHalfCuFt = calculateStone({
      areas: [{ id: '1', shape: 'rectangle', lengthFt: 20, widthFt: 10, depthInches: 3 }],
      presetId: 'crushedStone57',
      wastePercent: 10,
      bagBasis: '0.5cuft',
    });
    // 55.0 cu ft / 0.5 = 110 bags
    expect(resHalfCuFt.bagsCount).toBe(110);
  });

  // Test 6: Cost calculation (per-ton and per-yard paths)
  it('Vector 6: Cost calculations with delivery and sales tax', () => {
    // Default + $60/ton + $65 delivery -> 3.0 tons * $60 + $65 = $245
    const costTon = calculateStone({
      areas: [{ id: '1', shape: 'rectangle', lengthFt: 20, widthFt: 10, depthInches: 3 }],
      presetId: 'crushedStone57',
      wastePercent: 10,
      orderRoundingStep: 0.5,
      pricing: {
        basis: 'ton',
        price: 60,
        deliveryFee: 65,
      },
    });
    expect(costTon.materialCost).toBe(180); // 3.0 * 60
    expect(costTon.totalDeliveredCost).toBe(245); // 180 + 65

    // Per-yard path: $84/yd³ * 2.5 yd³ + $65 -> $275
    const costYard = calculateStone({
      areas: [{ id: '1', shape: 'rectangle', lengthFt: 20, widthFt: 10, depthInches: 3 }],
      presetId: 'crushedStone57',
      wastePercent: 10,
      orderRoundingStep: 0.5,
      pricing: {
        basis: 'cubicYard',
        price: 84,
        deliveryFee: 65,
      },
    });
    expect(costYard.materialCost).toBe(210); // 2.5 * 84
    expect(costYard.totalDeliveredCost).toBe(275);
  });

  // Test 7: Bulk vs Bags comparison
  it('Vector 7: Computed bulk-vs-bags savings calculation', () => {
    const res = calculateStone({
      areas: [{ id: '1', shape: 'rectangle', lengthFt: 20, widthFt: 10, depthInches: 3 }],
      presetId: 'crushedStone57',
      wastePercent: 10,
      bagBasis: '50lb',
      pricing: {
        basis: 'ton',
        price: 60,
        deliveryFee: 65,
        pricePerBag: 5.0, // 115 bags * $5 = $575
      },
    });

    expect(res.bagPurchaseCost).toBe(575); // 115 * 5
    expect(res.totalDeliveredCost).toBe(245);
    expect(res.bulkWiseSavings).toBe(330); // 575 - 245 = 330
  });

  // Test 8: Coverage per ton verification
  // Reference values: #57 and pea gravel ≈ 116 / 77 / 58 sq ft at 2 / 3 / 4 in
  // river rock ≈ 120 / 80 / 60
  // crusher run ≈ 108 / 72 / 54
  it('Vector 8: Coverage per ton at 2", 3", and 4" depths', () => {
    // #57 (1.40 t/yd³)
    expect(calculateCoveragePerTon(1.40, 2)).toBeCloseTo(116, -1);
    expect(calculateCoveragePerTon(1.40, 3)).toBeCloseTo(77, -1);
    expect(calculateCoveragePerTon(1.40, 4)).toBeCloseTo(58, -1);

    // River Rock (1.35 t/yd³)
    expect(calculateCoveragePerTon(1.35, 2)).toBeCloseTo(120, -1);
    expect(calculateCoveragePerTon(1.35, 3)).toBeCloseTo(80, -1);
    expect(calculateCoveragePerTon(1.35, 4)).toBeCloseTo(60, -1);

    // Crusher Run (1.50 t/yd³)
    expect(calculateCoveragePerTon(1.50, 2)).toBeCloseTo(108, -1);
    expect(calculateCoveragePerTon(1.50, 3)).toBeCloseTo(72, -1);
    expect(calculateCoveragePerTon(1.50, 4)).toBeCloseTo(54, -1);
  });

  // Test 9: Non-blocking warning and hint triggers
  it('Vector 9: Depth hint triggers for rip rap and pea gravel', () => {
    const ripRapThin = calculateStone({
      areas: [{ id: '1', shape: 'rectangle', lengthFt: 10, widthFt: 10, depthInches: 4 }],
      presetId: 'ripRap',
      wastePercent: 10,
    });
    expect(ripRapThin.hintMessages.some((m) => m.includes('Rip rap layers are usually 12 in'))).toBe(true);

    const peaGravelDeep = calculateStone({
      areas: [{ id: '1', shape: 'rectangle', lengthFt: 10, widthFt: 10, depthInches: 4 }],
      presetId: 'peaGravel',
      wastePercent: 10,
    });
    expect(peaGravelDeep.hintMessages.some((m) => m.includes('Deep pea gravel shifts underfoot'))).toBe(true);
  });

  // Test 10: Validation edge cases (blank, zero, negative, NaN)
  it('Vector 10: Handles zero, negative, and invalid values safely', () => {
    const res = calculateStone({
      areas: [{ id: '1', shape: 'rectangle', lengthFt: -10, widthFt: 0, depthInches: -2 }],
      presetId: 'crushedStone57',
      wastePercent: -5,
    });

    expect(res.netAreaSqFt).toBe(0);
    expect(res.totalWeightTons).toBe(0);
    expect(res.bagsCount).toBe(0);
    expect(res.totalDeliveredCost).toBe(0);
  });
});
