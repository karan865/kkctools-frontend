import { describe, it, expect } from 'vitest';
import { calculateFillDirt, FillDirtInputs } from './fill-dirt-engine';

describe('Fill Dirt Engine Spec Test Cases (Section 6.3)', () => {
  // Test Case 1: Rectangle 20 × 15 ft, depth 6 in, extra 10%, material Fill dirt (2,700), truck 5 yd³
  // Expected: 6.11 yd³ · 165.00 ft³ · 8.25 tons · 2 loads
  it('Test Case 1: Rectangle 20x15 ft, 6 in depth, 10% extra, Fill dirt, 5 yd³ truck', () => {
    const inputs: FillDirtInputs = {
      unitSystem: 'us',
      areas: [
        {
          id: '1',
          shape: 'rectangle',
          lengthFt: 20,
          widthFt: 15,
          depthType: 'uniform',
          depthInches: 6,
        },
      ],
      extraSettlingPercent: 10,
      material: 'fill-dirt',
      truckCapacityYd3: 5,
    };

    const res = calculateFillDirt(inputs);

    // 20 * 15 * (6/12) = 150 ft3. Extra 10% = 165.00 ft3
    expect(res.volumeWithExtraCuFt).toBeCloseTo(165.0, 2);
    // 165 / 27 = 6.1111 yd3 => 6.11 yd3
    expect(res.volumeWithExtraCuYd).toBeCloseTo(6.11, 2);
    // 6.1111 * 2700 = 16500 lb / 2000 = 8.25 tons
    expect(res.weightTonsWithExtra).toBeCloseTo(8.25, 2);
    // 6.1111 / 5 = 1.22 loads => 2 loads
    expect(res.truckloads).toBe(2);
  });

  // Test Case 2: Circle diameter 12 ft, depth 12 in, extra 10%, material Topsoil (2,200)
  // Expected: 4.61 yd³ · 124.41 ft³ · 5.07 tons
  it('Test Case 2: Circle diameter 12 ft, 12 in depth, 10% extra, Topsoil (2,200)', () => {
    const inputs: FillDirtInputs = {
      unitSystem: 'us',
      areas: [
        {
          id: 'c1',
          shape: 'circle',
          diameterFt: 12,
          depthType: 'uniform',
          depthInches: 12,
        },
      ],
      extraSettlingPercent: 10,
      material: 'topsoil',
    };

    const res = calculateFillDirt(inputs);

    // r = 6 ft. Area = pi * 36 = 113.0973 sq ft. Depth 1 ft => raw 113.0973 ft3.
    // with 10% extra = 124.407 ft3 => 124.41 ft3
    expect(res.volumeWithExtraCuFt).toBeCloseTo(124.41, 1);
    // 124.407 / 27 = 4.6076 yd3 => 4.61 yd3
    expect(res.volumeWithExtraCuYd).toBeCloseTo(4.61, 2);
    // 4.6076 * 2200 / 2000 = 5.068 tons => 5.07 tons
    expect(res.weightTonsWithExtra).toBeCloseTo(5.07, 2);
  });

  // Test Case 3: Triangle base 10 ft, height 8 ft, depth 4 in, extra 0%
  // Expected: 0.49 yd³ · 13.33 ft³
  it('Test Case 3: Triangle base 10 ft, height 8 ft, depth 4 in, extra 0%', () => {
    const inputs: FillDirtInputs = {
      unitSystem: 'us',
      areas: [
        {
          id: 't1',
          shape: 'triangle',
          baseFt: 10,
          heightFt: 8,
          depthType: 'uniform',
          depthInches: 4,
        },
      ],
      extraSettlingPercent: 0,
      material: 'none',
    };

    const res = calculateFillDirt(inputs);

    // Area = 0.5 * 10 * 8 = 40 sq ft. Depth = 4/12 = 0.3333 ft.
    // Volume = 13.3333 ft3. Extra 0% = 13.33 ft3.
    expect(res.volumeWithExtraCuFt).toBeCloseTo(13.33, 2);
    // 13.3333 / 27 = 0.4938 yd3 => 0.49 yd3
    expect(res.volumeWithExtraCuYd).toBeCloseTo(0.49, 2);
  });

  // Test Case 4: Two areas, depth 3 in each: rectangle 10 × 10 ft + circle 6 ft diameter, extra 10%
  // Expected: 1.31 yd³ · 35.28 ft³
  it('Test Case 4: Two areas (10x10 ft rect + 6 ft dia circle, depth 3 in, 10% extra)', () => {
    const inputs: FillDirtInputs = {
      unitSystem: 'us',
      areas: [
        {
          id: 'r1',
          shape: 'rectangle',
          lengthFt: 10,
          widthFt: 10,
          depthType: 'uniform',
          depthInches: 3,
        },
        {
          id: 'c1',
          shape: 'circle',
          diameterFt: 6,
          depthType: 'uniform',
          depthInches: 3,
        },
      ],
      extraSettlingPercent: 10,
      material: 'none',
    };

    const res = calculateFillDirt(inputs);

    // Rect = 100 * (3/12) = 25 ft3. Circle = pi * 3^2 * (3/12) = 7.06858 ft3.
    // Total raw = 32.06858 ft3. Extra 10% = 35.2754 ft3 => 35.28 ft3.
    expect(res.volumeWithExtraCuFt).toBeCloseTo(35.28, 2);
    // 35.2754 / 27 = 1.3065 yd3 => 1.31 yd3
    expect(res.volumeWithExtraCuYd).toBeCloseTo(1.31, 2);
  });

  // Test Case 5: Sloped: rectangle 30 × 10 ft, depth 2 in (shallow) to 8 in (deep), extra 15%
  // Expected: 5.32 yd³ · 143.75 ft³
  it('Test Case 5: Sloped rectangle 30x10 ft, 2 in to 8 in depth, 15% extra', () => {
    const inputs: FillDirtInputs = {
      unitSystem: 'us',
      areas: [
        {
          id: 's1',
          shape: 'rectangle',
          lengthFt: 30,
          widthFt: 10,
          depthType: 'sloped',
          shallowDepthInches: 2,
          deepDepthInches: 8,
        },
      ],
      extraSettlingPercent: 15,
      material: 'none',
    };

    const res = calculateFillDirt(inputs);

    // Average depth = (2 + 8) / 2 = 5 in = 5/12 ft.
    // Area = 300 sq ft. Volume raw = 300 * (5/12) = 125 ft3.
    // With 15% extra = 125 * 1.15 = 143.75 ft3.
    expect(res.volumeWithExtraCuFt).toBeCloseTo(143.75, 2);
    // 143.75 / 27 = 5.324 yd3 => 5.32 yd3
    expect(res.volumeWithExtraCuYd).toBeCloseTo(5.32, 2);
  });

  // Test Case 6: Metric: rectangle 5 × 4 m, depth 15 cm, extra 10%
  // Expected: 3.30 m³ (≈ 4.32 yd³)
  it('Test Case 6: Metric rectangle 5x4 m, 15 cm depth, 10% extra', () => {
    const inputs: FillDirtInputs = {
      unitSystem: 'metric',
      areas: [
        {
          id: 'm1',
          shape: 'rectangle',
          lengthM: 5,
          widthM: 4,
          depthType: 'uniform',
          depthCm: 15,
        },
      ],
      extraSettlingPercent: 10,
      material: 'none',
    };

    const res = calculateFillDirt(inputs);

    // Area = 20 m2. Depth = 0.15 m. Raw = 3.0 m3.
    // With 10% extra = 3.30 m3.
    expect(res.volumeWithExtraM3).toBeCloseTo(3.3, 2);
    // 3.3 m3 * 1.30795 = 4.316 yd3 => 4.32 yd3
    expect(res.volumeWithExtraCuYd).toBeCloseTo(4.32, 2);
  });
});

