import { describe, expect, it } from 'vitest';
import {
  FT2_PER_M2,
  FT3_PER_M3,
  L_PER_FT3,
  PRESETS,
  areaToFt2,
  bagsFor,
  coverageFt2,
  depthToFt,
  ft2PerFt3AtInches,
  ft2To,
  ft3Per100Ft2,
  ft3To,
  ftTo,
  volumeNeededFt3,
  volumeToFt3,
} from './cubic-square-engine';

describe('unit conversions', () => {
  it('depth', () => {
    expect(depthToFt(6, 'in')).toBeCloseTo(0.5, 12);
    expect(depthToFt(30.48, 'cm')).toBeCloseTo(1, 12);
    expect(depthToFt(304.8, 'mm')).toBeCloseTo(1, 12);
    expect(depthToFt(0.3048, 'm')).toBeCloseTo(1, 12);
    expect(depthToFt(-2, 'in')).toBe(0);
    expect(ftTo(1, 'in')).toBeCloseTo(12, 12);
  });
  it('volume', () => {
    expect(volumeToFt3(1, 'yd3')).toBe(27);
    expect(volumeToFt3(1, 'm3')).toBeCloseTo(35.3147, 4);
    expect(volumeToFt3(L_PER_FT3, 'L')).toBeCloseTo(1, 12);
    expect(ft3To(27, 'yd3')).toBe(1);
    expect(ft3To(FT3_PER_M3, 'm3')).toBeCloseTo(1, 12);
  });
  it('area', () => {
    expect(areaToFt2(1, 'm2')).toBeCloseTo(10.7639, 4);
    expect(areaToFt2(1, 'yd2')).toBe(9);
    expect(ft2To(FT2_PER_M2, 'm2')).toBeCloseTo(1, 12);
  });
});

describe('both directions', () => {
  it('cubic feet to square feet', () => {
    // 10 ft³ spread 3 in deep covers 40 ft²
    expect(coverageFt2(10, depthToFt(3, 'in'))).toBeCloseTo(40, 10);
    // a 2 ft³ bag of mulch at 3 in covers 8 ft²
    expect(coverageFt2(2, depthToFt(3, 'in'))).toBeCloseTo(8, 10);
  });
  it('square feet to cubic feet', () => {
    // 10 × 10 slab, 4 in thick = 33.33 ft³ = 1.235 yd³
    const v = volumeNeededFt3(100, depthToFt(4, 'in'));
    expect(v).toBeCloseTo(33.333, 3);
    expect(ft3To(v, 'yd3')).toBeCloseTo(1.2346, 4);
    // Purdue: about 19 yd³ of topsoil for 6 in over 1,000 ft²
    expect(ft3To(volumeNeededFt3(1000, depthToFt(6, 'in')), 'yd3')).toBeCloseTo(18.52, 2);
  });
  it('round trip', () => {
    const d = depthToFt(7.5, 'cm');
    expect(coverageFt2(volumeNeededFt3(123.4, d), d)).toBeCloseTo(123.4, 9);
  });
  it('metric: 1 m³ at 10 cm covers 10 m²', () => {
    expect(ft2To(coverageFt2(volumeToFt3(1, 'm3'), depthToFt(10, 'cm')), 'm2')).toBeCloseTo(10, 9);
  });
  it('zero or missing depth gives zero, never infinity', () => {
    expect(coverageFt2(10, 0)).toBe(0);
    expect(volumeNeededFt3(100, 0)).toBe(0);
  });
});

describe('bags and tables', () => {
  it('bags round up', () => {
    expect(bagsFor(33.333, 2)).toBe(17);
    expect(bagsFor(4, 2)).toBe(2);
    expect(bagsFor(0, 2)).toBe(0);
  });
  it('coverage per cubic foot', () => {
    expect(ft2PerFt3AtInches(1)).toBe(12);
    expect(ft2PerFt3AtInches(3)).toBe(4);
    expect(ft2PerFt3AtInches(4)).toBe(3);
    expect(ft3Per100Ft2(3)).toBe(25);
    expect(ft3Per100Ft2(4)).toBeCloseTo(33.333, 3);
  });
  it('presets have sensible depths', () => {
    for (const p of PRESETS) {
      expect(p.depthIn).toBeGreaterThan(0);
      expect(p.depthIn).toBeLessThanOrEqual(6);
    }
  });
});
