import { describe, it, expect } from 'vitest';
import {
  calculateSandVolume,
  calculatePaverSand,
  calculatePolymericSand,
  SandVolumeInputs,
  PaverSandInputs,
  PolymericSandInputs,
} from './sand-engine';

describe('Sand Engine Test Cases from Spec 6.3', () => {
  // Test Case 1: Sand Volume: 10 × 10 ft, 2 in, waste 10%, dry, 50 lb bags
  // Expected: 0.68 yd³ · 18.33 ft³ · 0.88 tons · 36 bags
  it('Test Case 1: Sand Volume (10 x 10 ft, 2 in, 10% waste, dry, 50 lb bags)', () => {
    const inputs: SandVolumeInputs = {
      unitSystem: 'us',
      sections: [
        {
          id: '1',
          shape: 'rectangle',
          lengthFt: 10,
          widthFt: 10,
        },
      ],
      depthInches: 2,
      sandCondition: 'dry',
      wastePercent: 10,
      bagSizeOption: '50',
    };

    const res = calculateSandVolume(inputs);

    // 10 * 10 * (2/12) = 16.6667 ft3. With 10% waste = 18.3333 ft3.
    expect(res.volumeCuFtWithWaste).toBeCloseTo(18.33, 1);
    // 18.3333 / 27 = 0.679 yd3 => 0.68 yd3
    expect(res.volumeCuYdWithWaste).toBeCloseTo(0.68, 2);
    // Dry sand = 2600 lb/yd3. 0.6790 * 2600 = 1765.43 lb / 2000 = 0.8827 tons => 0.88 tons
    expect(res.weightTonsWithWaste).toBeCloseTo(0.88, 2);
    // Bags = ceil(1765.43 / 50) = 36 bags
    expect(res.totalBags).toBe(36);
  });

  // Test Case 2: Paver Sand: 300 sq ft, 1 in, waste 10%, dry, 50 lb bags
  // Expected: 1.02 yd³ · 27.50 ft³ · 1.32 tons · 53 bags
  it('Test Case 2: Paver Sand (300 sq ft, 1 in, 10% waste, dry, 50 lb bags)', () => {
    const inputs: PaverSandInputs = {
      unitSystem: 'us',
      areaSqFt: 300,
      beddingDepthInches: 1,
      sandCondition: 'dry',
      wastePercent: 10,
      bagSizeOption: '50',
    };

    const res = calculatePaverSand(inputs);

    // 300 * (1/12) = 25 ft3. With 10% waste = 27.5 ft3.
    expect(res.volumeCuFtWithWaste).toBeCloseTo(27.5, 2);
    // 27.5 / 27 = 1.0185 yd3 => 1.02 yd3
    expect(res.volumeCuYdWithWaste).toBeCloseTo(1.02, 2);
    // 1.0185 * 2600 = 2648.14 lb / 2000 = 1.324 tons => 1.32 tons
    expect(res.weightTonsWithWaste).toBeCloseTo(1.32, 2);
    // Bags = ceil(2648.14 / 50) = 53 bags
    expect(res.totalBags).toBe(53);
  });

  // Test Case 3: Polymeric: 200 sq ft, 6 × 9 in pavers, ¼ in joint, 2 in deep, waste 10%, 50 lb bags
  // Expected: 2.20 ft³ before waste, 2.42 ft³ with waste · 0.09 yd³ · ≈ 242 lb · 5 bags
  it('Test Case 3: Polymeric Sand (200 sq ft, 6x9 in pavers, 0.25 in joint, 2 in deep, 10% waste, 50 lb bags)', () => {
    const inputs: PolymericSandInputs = {
      unitSystem: 'us',
      totalAreaSqFt: 200,
      paverLengthInches: 6,
      paverWidthInches: 9,
      jointWidthInches: 0.25,
      jointDepthInches: 2,
      wastePercent: 10,
      bagWeightLb: 50,
    };

    const res = calculatePolymericSand(inputs);

    // denom = (6 + 0.25) * (9 + 0.25) = 6.25 * 9.25 = 57.8125
    // jointFraction = 1 - 54 / 57.8125 = 0.0659459
    // raw joint volume = 200 * 0.0659459 * 2 / 12 = 2.1982 ft3 => 2.20 ft3
    expect(res.jointVolumeCuFtRaw).toBeCloseTo(2.2, 1);
    // with 10% waste = 2.1982 * 1.1 = 2.418 ft3 => 2.42 ft3
    expect(res.jointVolumeCuFtWithWaste).toBeCloseTo(2.42, 2);
    // 2.418 / 27 = 0.08955 yd3 => 0.09 yd3
    expect(res.jointVolumeCuYdWithWaste).toBeCloseTo(0.09, 2);
    // weight = 2.418 * 100 = 241.8 lb => ~242 lb
    expect(res.jointWeightLbWithWaste).toBeCloseTo(241.8, 1);
    // bags = ceil(241.8 / 50) = 5 bags
    expect(res.totalBags).toBe(5);
  });

  // Test Case 4: Round sandbox: 5 ft diameter, 6 in, waste 10%, dry, 50 lb bags
  // Expected: 0.40 yd³ · 10.80 ft³ · 0.52 tons · 21 bags
  it('Test Case 4: Round sandbox (5 ft diameter, 6 in depth, 10% waste, dry, 50 lb bags)', () => {
    const inputs: SandVolumeInputs = {
      unitSystem: 'us',
      sections: [
        {
          id: 'sandbox-1',
          shape: 'circle',
          diameterFt: 5,
        },
      ],
      depthInches: 6,
      sandCondition: 'dry',
      wastePercent: 10,
      bagSizeOption: '50',
    };

    const res = calculateSandVolume(inputs);

    // r = 2.5 ft. Area = pi * 2.5^2 = 19.63495 sq ft.
    // depth = 0.5 ft. Raw volume = 19.63495 * 0.5 = 9.817477 ft3.
    // with 10% waste = 10.7992 ft3 => 10.80 ft3
    expect(res.volumeCuFtWithWaste).toBeCloseTo(10.8, 2);
    // 10.7992 / 27 = 0.39997 yd3 => 0.40 yd3
    expect(res.volumeCuYdWithWaste).toBeCloseTo(0.4, 2);
    // 0.39997 * 2600 = 1039.92 lb / 2000 = 0.51996 tons => 0.52 tons
    expect(res.weightTonsWithWaste).toBeCloseTo(0.52, 2);
    // bags = ceil(1039.92 / 50) = 21 bags
    expect(res.totalBags).toBe(21);
  });

  // Test Case 5: Metric: 3 × 2 m, 5 cm, waste 10%, dry, 25 kg bags
  // Expected: 0.33 m³ · ≈ 509 kg (0.51 tonnes) · 21 bags
  it('Test Case 5: Metric (3 x 2 m, 5 cm depth, 10% waste, dry, 25 kg bags)', () => {
    const inputs: SandVolumeInputs = {
      unitSystem: 'metric',
      sections: [
        {
          id: 'm1',
          shape: 'rectangle',
          lengthM: 3,
          widthM: 2,
        },
      ],
      depthCm: 5,
      sandCondition: 'dry',
      wastePercent: 10,
      bagSizeOption: '25kg',
    };

    const res = calculateSandVolume(inputs);

    // 3 * 2 * 0.05 = 0.30 m3 raw. With 10% waste = 0.33 m3.
    expect(res.volumeM3WithWaste).toBeCloseTo(0.33, 2);
    // Dry sand density metric: 2600 * 0.593276 = 1542.518 kg/m3
    // Weight = 0.33 m3 * 1542.518 = 509.03 kg => ~509 kg (0.51 tonnes)
    expect(res.weightKgWithWaste).toBeCloseTo(509, 0);
    expect(res.weightTonnesWithWaste).toBeCloseTo(0.51, 2);
    // bags = ceil(509.03 / 25) = 21 bags
    expect(res.totalBags).toBe(21);
  });
});

