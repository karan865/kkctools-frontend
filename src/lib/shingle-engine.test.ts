import { describe, it, expect } from 'vitest';
import {
  M2_PER_SQUARE,
  SHINGLE_TYPES,
  calculateShingles,
  defaultSection,
  defaultShingleInput,
  degreesToPitch,
  estimateShingleCost,
  pitchFactor,
  pitchToDegrees,
  sectionGeometry,
} from './shingle-engine';

describe('pitch', () => {
  it('factor = √(1 + (rise/12)²)', () => {
    expect(pitchFactor(0)).toBe(1);
    expect(pitchFactor(12)).toBeCloseTo(Math.SQRT2, 9);
    expect(pitchFactor(6)).toBeCloseTo(1.118034, 6);
    expect(pitchFactor(4)).toBeCloseTo(1.054093, 6);
  });
  it('converts pitch ↔ degrees', () => {
    expect(pitchToDegrees(12)).toBeCloseTo(45, 9);
    expect(degreesToPitch(45)).toBeCloseTo(12, 9);
    expect(pitchToDegrees(6)).toBeCloseTo(26.565, 3);
  });
  it('1 square = 100 ft² = 9.290304 m²', () => {
    expect(M2_PER_SQUARE).toBeCloseTo(100 * 0.3048 ** 2, 9);
  });
});

describe('sectionGeometry', () => {
  it('gable: footprint plus overhang × pitch factor; eaves, rakes, ridge', () => {
    const g = sectionGeometry(defaultSection('a')); // 40 × 28, 1 ft overhang, 6/12
    expect(g.planArea).toBe(42 * 30);
    expect(g.roofArea).toBeCloseTo(1260 * pitchFactor(6), 9);
    expect(g.eaves).toBe(84);
    expect(g.ridge).toBe(42);
    expect(g.rakes).toBeCloseTo(4 * 15 * pitchFactor(6), 9);
    expect(g.hips).toBe(0);
  });
  it('hip: same area as gable, eaves all round, ridge = long − short, 4 hips', () => {
    const g = sectionGeometry(defaultSection('h', { shape: 'hip' }));
    expect(g.roofArea).toBeCloseTo(1260 * pitchFactor(6), 9);
    expect(g.eaves).toBe(2 * (42 + 30));
    expect(g.ridge).toBe(12);
    expect(g.rakes).toBe(0);
    const run = 15;
    expect(g.hips).toBeCloseTo(4 * Math.sqrt(2 * run * run + (run * 0.5) ** 2), 9);
  });
  it('12/12 hip rafter on a 15 ft run is √(15² + 15² + 15²)', () => {
    const g = sectionGeometry(defaultSection('h', { shape: 'hip', length: 30, width: 30, overhang: 0, pitch: 12 }));
    expect(g.hips / 4).toBeCloseTo(Math.sqrt(3 * 225), 9);
    expect(g.ridge).toBe(0);
  });
  it('shed: one eave, two rakes, no ridge', () => {
    const g = sectionGeometry(defaultSection('s', { shape: 'shed', length: 20, width: 10, overhang: 0, pitch: 3 }));
    expect(g.eaves).toBe(20);
    expect(g.rakes).toBeCloseTo(2 * 10 * pitchFactor(3), 9);
    expect(g.ridge).toBe(0);
  });
  it('measured area: area used as is, no edges', () => {
    const g = sectionGeometry(defaultSection('m', { shape: 'area', area: 1800 }));
    expect(g.roofArea).toBe(1800);
    expect(g.eaves + g.rakes + g.ridge + g.hips).toBe(0);
  });
  it('zero size gives zero', () => {
    expect(sectionGeometry(defaultSection('z', { length: 0 })).roofArea).toBe(0);
  });
});

describe('calculateShingles', () => {
  const ranch = defaultShingleInput([defaultSection('a')]);

  it('squares → bundles, rounded up, with waste', () => {
    const r = calculateShingles(ranch);
    const area = 1260 * pitchFactor(6);
    expect(r.roofArea).toBeCloseTo(area, 9);
    expect(r.squares).toBeCloseTo(area / 100, 9);
    expect(r.squaresWithWaste).toBeCloseTo((area / 100) * 1.1, 9);
    expect(r.bundles).toBe(Math.ceil((area / 100) * 1.1 * 3));
    expect(r.orderSquares).toBeCloseTo(r.bundles / 3, 9);
    expect(r.shingles).toBe(Math.round((r.bundles / 3) * 64));
  });

  it('known example: 40×28 ft ranch, 1 ft overhang, 6/12, 10% waste → 47 bundles', () => {
    const r = calculateShingles(ranch);
    expect(r.roofArea).toBeCloseTo(1408.72, 2);
    expect(r.bundles).toBe(47);
  });

  it('accessories from edge lengths', () => {
    const r = calculateShingles(ranch);
    expect(r.starterLf).toBeCloseTo(r.eaves + r.rakes, 9);
    expect(r.starterBundles).toBe(Math.ceil(r.starterLf / 105));
    expect(r.ridgeBundles).toBe(Math.ceil(42 / 33));
    expect(r.dripEdgePieces).toBe(Math.ceil((r.eaves + r.rakes) / 10));
    expect(r.underlaymentRolls).toBe(Math.ceil(r.roofArea / 1000));
    expect(r.iceRolls).toBe(0);
  });

  it('starter only on eaves when rakes are switched off', () => {
    const r = calculateShingles({ ...ranch, starterOnRakes: false });
    expect(r.starterLf).toBe(84);
  });

  it('ice & water at the eaves is taken off the underlayment area', () => {
    const r = calculateShingles({ ...ranch, iceCourses: 1, valleyLf: 10 });
    expect(r.iceSqft).toBeCloseTo(84 * 3 + 10 * 3, 9);
    expect(r.iceRolls).toBe(Math.ceil(282 / 200));
    expect(r.underlaymentSqft).toBeCloseTo(r.roofArea - 282, 9);
  });

  it('nails = shingles in squares with waste × nails each (256 per square for 64 × 4)', () => {
    const r = calculateShingles(defaultShingleInput([defaultSection('m', { shape: 'area', area: 1000 })], { wastePercent: 0 }));
    expect(r.nails).toBe(10 * 256);
  });

  it('sections add up', () => {
    const a = calculateShingles(defaultShingleInput([defaultSection('a')]));
    const b = calculateShingles(defaultShingleInput([defaultSection('b', { length: 12, width: 8, pitch: 4 })]));
    const both = calculateShingles(defaultShingleInput([defaultSection('a'), defaultSection('b', { length: 12, width: 8, pitch: 4 })]));
    expect(both.roofArea).toBeCloseTo(a.roofArea + b.roofArea, 9);
    expect(both.eaves).toBeCloseTo(a.eaves + b.eaves, 9);
  });

  it('manual edge lengths override the estimate', () => {
    const r = calculateShingles({ ...ranch, edgeOverride: { ridge: 60, hips: 0 } });
    expect(r.ridgeLf).toBe(60);
    expect(r.ridgeBundles).toBe(2);
  });

  it('4 bundles per square products', () => {
    const r = calculateShingles(defaultShingleInput([defaultSection('m', { shape: 'area', area: 1500 })], { bundlesPerSquare: 4, wastePercent: 0 }));
    expect(r.bundles).toBe(60);
  });

  it('every preset has 3 or 4 bundles per square', () => {
    for (const t of SHINGLE_TYPES) expect([3, 4]).toContain(t.bundlesPerSquare);
  });

  it('cost multiplies whole units by prices', () => {
    const r = calculateShingles(ranch);
    const c = estimateShingleCost(r, { bundle: 40, starter: 50, ridge: 70, dripEdge: 10, underlayment: 120 });
    expect(c.shingles).toBe(r.bundles * 40);
    expect(c.total).toBe(c.shingles + c.starter + c.ridge + c.dripEdge + c.underlayment);
    expect(c.ice).toBe(0);
  });
});
