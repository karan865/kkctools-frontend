import { describe, it, expect } from 'vitest';
import { calculateStone, STONE_MATERIAL_PRESETS } from './stone-engine';

describe('stone-engine', () => {
  it('calculates standard crushed limestone for a 20x10 ft patio border at 3 inches depth with 10% waste', () => {
    // 20 ft x 10 ft = 200 sq ft
    // Depth = 3 in = 0.25 ft
    // Net Cu Ft = 50 cu ft
    // +10% waste = 55 cu ft
    // Cu Yds = 55 / 27 ≈ 2.037 cu yds
    // Density #57 Limestone = 95 lbs/cu ft
    // Total Weight = 55 * 95 = 5,225 lbs
    // Short Tons = 5,225 / 2000 = 2.6125 tons
    // 50 lb bags = 5225 / 50 = 105 bags
    const result = calculateStone({
      mode: 'dimensions',
      lengthFt: 20,
      widthFt: 10,
      depthInches: 3,
      densityLbFt3: 95,
      wastePercent: 10,
      pricingMode: 'ton',
      unitPrice: 80,
      deliveryFee: 65,
    });

    expect(result.netAreaSqFt).toBe(200);
    expect(result.grossVolumeCuFt).toBe(55);
    expect(result.volumeCuYds).toBe(2.04);
    expect(result.totalWeightLbs).toBe(5225);
    expect(result.weightUSShortTons).toBe(2.61);
    expect(result.bags50lb).toBe(105);
    expect(result.materialCost).toBe(208.8); // 2.61 * 80 = 208.8
    expect(result.totalCost).toBe(273.8); // 208.8 + 65
  });

  it('supports direct square footage mode', () => {
    // 300 sq ft, 2 inches (0.1667 ft), 0% waste
    // Net Volume = 300 * (2/12) = 50 cu ft
    // River rock density = 100 lbs/cu ft
    // Total Weight = 50 * 100 = 5,000 lbs (2.5 tons)
    const result = calculateStone({
      mode: 'area',
      areaSqFt: 300,
      depthInches: 2,
      densityLbFt3: 100,
      wastePercent: 0,
    });

    expect(result.netAreaSqFt).toBe(300);
    expect(result.grossVolumeCuFt).toBe(50);
    expect(result.totalWeightLbs).toBe(5000);
    expect(result.weightUSShortTons).toBe(2.5);
    expect(result.bags50lb).toBe(100);
  });

  it('calculates lightweight lava rock correctly', () => {
    // Lava rock = 45 lbs/cu ft
    const lava = STONE_MATERIAL_PRESETS.find((p) => p.id === 'lava-rock');
    expect(lava?.densityLbFt3).toBe(45);

    const result = calculateStone({
      mode: 'dimensions',
      lengthFt: 10,
      widthFt: 10,
      depthInches: 3,
      densityLbFt3: lava!.densityLbFt3,
      wastePercent: 0,
    });

    // 100 sq ft * 0.25 ft = 25 cu ft
    // 25 * 45 = 1,125 lbs = 0.56 tons
    expect(result.totalWeightLbs).toBe(1125);
    expect(result.weightUSShortTons).toBe(0.56);
    expect(result.bags50lb).toBe(23);
  });

  it('handles cubic yard pricing mode', () => {
    const result = calculateStone({
      mode: 'area',
      areaSqFt: 270,
      depthInches: 12, // 1 ft
      densityLbFt3: 100,
      wastePercent: 0,
      pricingMode: 'cubicYard',
      unitPrice: 50,
      deliveryFee: 40,
    });

    // 270 cu ft / 27 = 10 cu yds
    expect(result.volumeCuYds).toBe(10);
    expect(result.materialCost).toBe(500);
    expect(result.totalCost).toBe(540);
  });
});

