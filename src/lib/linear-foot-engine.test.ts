import { describe, it, expect } from 'vitest';
import {
  calculateLinearFeet,
  calculateSqFtLinearFt,
  LinearFeetInputs,
  SqFtLinearFtInputs,
} from './linear-foot-engine';

describe('Linear Foot Calculator Spec Unit Tests (Section 6.3)', () => {
  // Test Case 1: Linear Feet: 12 ft × 4; 8 ft 6 in × 2; waste 0
  // Expected: 65.00 ft · 780.00 in · 21.67 yd · 19.81 m · 6 pieces
  it('Test Case 1: Linear Feet (12 ft x 4, 8 ft 6 in x 2, waste 0)', () => {
    const inputs: LinearFeetInputs = {
      rows: [
        { id: '1', length: 12, unit: 'ft', quantity: 4 },
        { id: '2', length: 8, inchesPart: 6, unit: 'ft-in', quantity: 2 },
      ],
      wastePercent: 0,
    };

    const res = calculateLinearFeet(inputs);

    // 4 * 12 + 2 * 8.5 = 48 + 17 = 65 ft
    expect(res.totalLinearFeetWithWaste).toBeCloseTo(65.0, 2);
    expect(res.totalInchesWithWaste).toBeCloseTo(780.0, 2);
    expect(res.totalYardsWithWaste).toBeCloseTo(21.67, 2);
    expect(res.totalMetersWithWaste).toBeCloseTo(19.81, 2);
    expect(res.totalPieces).toBe(6);
  });

  // Test Case 2: Same rows, waste 10%, price $2.50 per linear ft
  // Expected: 71.50 ft (65.00 without waste) · $178.75
  it('Test Case 2: Linear Feet with 10% waste and $2.50/lf price', () => {
    const inputs: LinearFeetInputs = {
      rows: [
        { id: '1', length: 12, unit: 'ft', quantity: 4 },
        { id: '2', length: 8, inchesPart: 6, unit: 'ft-in', quantity: 2 },
      ],
      wastePercent: 10,
      pricePerLinearFoot: 2.5,
    };

    const res = calculateLinearFeet(inputs);

    expect(res.rawLinearFeet).toBeCloseTo(65.0, 2);
    expect(res.totalLinearFeetWithWaste).toBeCloseTo(71.5, 2);
    expect(res.estimatedCost).toBeCloseTo(178.75, 2);
  });

  // Test Case 3: Mixed units: 3 yd × 1; 2 m × 2; 36 in × 1; waste 0
  // Expected: 25.12 ft
  it('Test Case 3: Mixed units (3 yd x 1, 2 m x 2, 36 in x 1, waste 0)', () => {
    const inputs: LinearFeetInputs = {
      rows: [
        { id: '1', length: 3, unit: 'yd', quantity: 1 }, // 9 ft
        { id: '2', length: 2, unit: 'm', quantity: 2 }, // 2 * 2 / 0.3048 = 13.12336 ft
        { id: '3', length: 36, unit: 'in', quantity: 1 }, // 3 ft
      ],
      wastePercent: 0,
    };

    const res = calculateLinearFeet(inputs);

    // 9 + 13.12336 + 3 = 25.12336 ft => 25.12 ft
    expect(res.totalLinearFeetWithWaste).toBeCloseTo(25.12, 2);
  });

  // Test Case 4: Sq ft → Linear ft: 200 sq ft, width 5 in, waste 0
  // Expected: 480.00 linear ft
  it('Test Case 4: Sq ft to Linear ft (200 sq ft, width 5 in, waste 0)', () => {
    const inputs: SqFtLinearFtInputs = {
      direction: 'sqft-to-linear',
      value: 200,
      widthValue: 5,
      widthUnit: 'in',
      wastePercent: 0,
    };

    const res = calculateSqFtLinearFt(inputs);
    expect(res).not.toBeNull();
    // 200 / (5/12) = 200 * 12 / 5 = 480 ft
    expect(res!.convertedValueWithWaste).toBeCloseTo(480.0, 2);
  });

  // Test Case 5: Same, waste 10%
  // Expected: 528.00 linear ft (480.00 without waste)
  it('Test Case 5: Sq ft to Linear ft with 10% waste', () => {
    const inputs: SqFtLinearFtInputs = {
      direction: 'sqft-to-linear',
      value: 200,
      widthValue: 5,
      widthUnit: 'in',
      wastePercent: 10,
    };

    const res = calculateSqFtLinearFt(inputs);
    expect(res).not.toBeNull();
    expect(res!.convertedValueRaw).toBeCloseTo(480.0, 2);
    expect(res!.convertedValueWithWaste).toBeCloseTo(528.0, 2);
  });

  // Test Case 6: Linear ft → Sq ft: 100 linear ft, width 6 in
  // Expected: 50.00 sq ft
  it('Test Case 6: Linear ft to Sq ft (100 linear ft, width 6 in)', () => {
    const inputs: SqFtLinearFtInputs = {
      direction: 'linear-to-sqft',
      value: 100,
      widthValue: 6,
      widthUnit: 'in',
    };

    const res = calculateSqFtLinearFt(inputs);
    expect(res).not.toBeNull();
    // 100 * (6/12) = 50 sq ft
    expect(res!.convertedValueWithWaste).toBeCloseTo(50.0, 2);
  });

  // Test Case 7: Sq ft → Linear ft, metric width: 120 sq ft, width 15 cm
  // Expected: 243.84 linear ft
  it('Test Case 7: Sq ft to Linear ft (120 sq ft, width 15 cm)', () => {
    const inputs: SqFtLinearFtInputs = {
      direction: 'sqft-to-linear',
      value: 120,
      widthValue: 15,
      widthUnit: 'cm',
      wastePercent: 0,
    };

    const res = calculateSqFtLinearFt(inputs);
    expect(res).not.toBeNull();
    // 15 cm = 15 / 30.48 ft = 0.49212598 ft
    // 120 / 0.49212598 = 243.84 linear ft
    expect(res!.convertedValueWithWaste).toBeCloseTo(243.84, 2);
  });

  // Test Case 8: Width 0 ya blank -> No result, null, no NaN/Infinity
  it('Test Case 8: Width 0 or blank handling', () => {
    const inputs: SqFtLinearFtInputs = {
      direction: 'sqft-to-linear',
      value: 200,
      widthValue: 0,
      widthUnit: 'in',
    };

    const res = calculateSqFtLinearFt(inputs);
    expect(res).toBeNull();
  });
});

