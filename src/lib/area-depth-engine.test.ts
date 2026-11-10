import { describe, it, expect } from 'vitest';
import {
  calcMaterial,
  sectionAreaSqFt,
  MaterialCalcInput,
  MaterialCalcResult,
} from './area-depth-engine';

describe('Asphalt / Area-Depth Engine (Spec B5 Test Cases)', () => {
  // T1: 40×20 ft, 2 in, 145 lb/ft³, waste 0
  // Expected: 9.67 tons · 4.94 yd³ · 19,333 lb · coverage 82.8 sq ft/ton
  it('T1: 40x20 ft, 2 in, 145 lb/ft3, waste 0', () => {
    const input: MaterialCalcInput = {
      sections: [{ shape: 'rectangle', length: 40, lengthUnit: 'ft', width: 20, widthUnit: 'ft' }],
      thickness: 2,
      thicknessUnit: 'in',
      density: 145,
      densityUnit: 'lb/ft3',
      wastePct: 0,
    };
    const res = calcMaterial(input) as MaterialCalcResult;
    expect(res.ok).toBe(true);
    expect(res.exact.tons).toBeCloseTo(9.6667, 2);
    expect(res.exact.cubicYards).toBeCloseTo(4.938, 2);
    expect(Math.round(res.exact.pounds)).toBe(19333);
    expect(res.coverageSqFtPerTon).toBeCloseTo(82.758, 1);
  });

  // T2: T1 + waste 5%, price $100, binder 5%, truck 20 t
  // Expected: order 10.15 tons · 5.19 yd³ · suggested 10.5 t · cost $1,015.00 · binder 0.5075 t · 0.51 loads
  it('T2: T1 with waste 5%, price $100, binder 5%, truck 20 t', () => {
    const input: MaterialCalcInput = {
      sections: [{ shape: 'rectangle', length: 40, lengthUnit: 'ft', width: 20, widthUnit: 'ft' }],
      thickness: 2,
      thicknessUnit: 'in',
      density: 145,
      densityUnit: 'lb/ft3',
      wastePct: 5,
      pricePerTon: 100,
      binderPct: 5,
      truckCapacityTons: 20,
    };
    const res = calcMaterial(input) as MaterialCalcResult;
    expect(res.ok).toBe(true);
    expect(res.order.tons).toBeCloseTo(10.15, 2);
    expect(res.order.cubicYards).toBeCloseTo(5.185, 2);
    expect(res.suggestedOrderTons).toBe(10.5);
    expect(res.materialCost).toBeCloseTo(1015.0, 2);
    expect(res.binderTons).toBeCloseTo(0.5075, 4);
    expect(res.truckloads).toBeCloseTo(0.5075, 2);
  });

  // T3: 1,000 sq ft (known area), 3 in, 145
  // Expected: 18.125 tons
  it('T3: 1,000 sq ft (known area), 3 in, 145 lb/ft3', () => {
    const input: MaterialCalcInput = {
      sections: [{ shape: 'area', area: 1000, areaUnit: 'sqft' }],
      thickness: 3,
      thicknessUnit: 'in',
      density: 145,
      densityUnit: 'lb/ft3',
      wastePct: 0,
    };
    const res = calcMaterial(input) as MaterialCalcResult;
    expect(res.ok).toBe(true);
    expect(res.exact.tons).toBeCloseTo(18.125, 3);
  });

  // T4: 50×12 ft, 2 in, 145
  // Expected: 7.25 tons
  it('T4: 50x12 ft, 2 in, 145 lb/ft3', () => {
    const input: MaterialCalcInput = {
      sections: [{ shape: 'rectangle', length: 50, lengthUnit: 'ft', width: 12, widthUnit: 'ft' }],
      thickness: 2,
      thicknessUnit: 'in',
      density: 145,
      densityUnit: 'lb/ft3',
      wastePct: 0,
    };
    const res = calcMaterial(input) as MaterialCalcResult;
    expect(res.ok).toBe(true);
    expect(res.exact.tons).toBeCloseTo(7.25, 2);
  });

  // T5: 10 m × 5 m, 50 mm, 2,322.7 kg/m³
  // Expected: 5.807 metric tonnes · 6.401 short tons · 2.5 m³
  it('T5: 10 m x 5 m, 50 mm, 2322.7 kg/m3', () => {
    const input: MaterialCalcInput = {
      sections: [{ shape: 'rectangle', length: 10, lengthUnit: 'm', width: 5, widthUnit: 'm' }],
      thickness: 50,
      thicknessUnit: 'mm',
      density: 2322.7,
      densityUnit: 'kg/m3',
      wastePct: 0,
    };
    const res = calcMaterial(input) as MaterialCalcResult;
    expect(res.ok).toBe(true);
    expect(res.exact.tonnes).toBeCloseTo(5.807, 2);
    expect(res.exact.tons).toBeCloseTo(6.401, 2);
    expect(res.exact.cubicMeters).toBeCloseTo(2.5, 2);
  });

  // T6: 600 sq ft, 3 in, 110 lb/ft³ (millings), waste 10%
  // Expected: exact 8.25 tons · order 9.075 tons
  it('T6: 600 sq ft, 3 in, 110 lb/ft3 (millings), waste 10%', () => {
    const input: MaterialCalcInput = {
      sections: [{ shape: 'area', area: 600, areaUnit: 'sqft' }],
      thickness: 3,
      thicknessUnit: 'in',
      density: 110,
      densityUnit: 'lb/ft3',
      wastePct: 10,
    };
    const res = calcMaterial(input) as MaterialCalcResult;
    expect(res.ok).toBe(true);
    expect(res.exact.tons).toBeCloseTo(8.25, 2);
    expect(res.order.tons).toBeCloseTo(9.075, 3);
  });

  // T7: circle Ø 20 ft, 2 in, 145
  // Expected: area 314.16 sq ft · 3.796 tons
  it('T7: circle diameter 20 ft, 2 in, 145 lb/ft3', () => {
    const input: MaterialCalcInput = {
      sections: [{ shape: 'circle', diameter: 20, diameterUnit: 'ft' }],
      thickness: 2,
      thicknessUnit: 'in',
      density: 145,
      densityUnit: 'lb/ft3',
      wastePct: 0,
    };
    const res = calcMaterial(input) as MaterialCalcResult;
    expect(res.ok).toBe(true);
    expect(res.areaSqFt).toBeCloseTo(314.159, 2);
    expect(res.exact.tons).toBeCloseTo(3.796, 2);
  });

  // T8: triangle base 30 ft × height 20 ft
  // Expected: area 300 sq ft
  it('T8: triangle base 30 ft x height 20 ft', () => {
    const area = sectionAreaSqFt({
      shape: 'triangle',
      base: 30,
      baseUnit: 'ft',
      height: 20,
      heightUnit: 'ft',
    });
    expect(area).toBe(300);
  });

  // T9: sections 40×20 ft + 10×10 ft
  // Expected: total area 900 sq ft
  it('T9: sections 40x20 ft + 10x10 ft', () => {
    const input: MaterialCalcInput = {
      sections: [
        { shape: 'rectangle', length: 40, lengthUnit: 'ft', width: 20, widthUnit: 'ft' },
        { shape: 'rectangle', length: 10, lengthUnit: 'ft', width: 10, widthUnit: 'ft' },
      ],
      thickness: 2,
      thicknessUnit: 'in',
      density: 145,
      densityUnit: 'lb/ft3',
      wastePct: 0,
    };
    const res = calcMaterial(input) as MaterialCalcResult;
    expect(res.ok).toBe(true);
    expect(res.areaSqFt).toBe(900);
  });

  // T10: 800 sq ft, 2 in, density 1.96 tons/yd³
  // Expected: ≈ 9.68 tons (within 0.02 of 9.67)
  it('T10: 800 sq ft, 2 in, density 1.96 tons/yd3', () => {
    const input: MaterialCalcInput = {
      sections: [{ shape: 'area', area: 800, areaUnit: 'sqft' }],
      thickness: 2,
      thicknessUnit: 'in',
      density: 1.96,
      densityUnit: 'tons/yd3',
      wastePct: 0,
    };
    const res = calcMaterial(input) as MaterialCalcResult;
    expect(res.ok).toBe(true);
    expect(Math.abs(res.exact.tons - 9.67)).toBeLessThanOrEqual(0.02);
  });

  // T11: thickness 0 -> rejected with message
  it('T11: thickness 0 rejected', () => {
    const input: MaterialCalcInput = {
      sections: [{ shape: 'area', area: 800, areaUnit: 'sqft' }],
      thickness: 0,
      thicknessUnit: 'in',
      density: 145,
      densityUnit: 'lb/ft3',
      wastePct: 0,
    };
    const res = calcMaterial(input);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.errors.some((e) => e.includes('thickness'))).toBe(true);
    }
  });

  // T12: density 20 lb/ft³ -> rejected with message
  it('T12: density 20 lb/ft3 rejected', () => {
    const input: MaterialCalcInput = {
      sections: [{ shape: 'area', area: 800, areaUnit: 'sqft' }],
      thickness: 2,
      thicknessUnit: 'in',
      density: 20,
      densityUnit: 'lb/ft3',
      wastePct: 0,
    };
    const res = calcMaterial(input);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.errors.some((e) => e.includes('Density'))).toBe(true);
    }
  });
});

