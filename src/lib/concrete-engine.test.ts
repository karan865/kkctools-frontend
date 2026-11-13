import { describe, it, expect } from 'vitest';
import {
  BAGS,
  M_PER_FT,
  M_PER_IN,
  SHAPES,
  SHAPE_ORDER,
  YD3_PER_M3,
  bagsNeeded,
  calculateJob,
  defaultValues,
  m3ToFt3,
  m3ToYd3,
  roundUpTo,
  shapeVolumeM3,
  siteMix,
  yd3ToM3,
} from './concrete-engine';

const ft = (v: number) => v * M_PER_FT;
const inch = (v: number) => v * M_PER_IN;
const bag = (id: string) => BAGS.find((b) => b.id === id)!;

describe('concrete engine — unit constants', () => {
  it('converts 1 m³ to 35.315 ft³ and 1.308 yd³', () => {
    expect(m3ToFt3(1)).toBeCloseTo(35.3147, 3);
    expect(m3ToYd3(1)).toBeCloseTo(1.30795, 4);
    expect(yd3ToM3(1)).toBeCloseTo(0.764555, 5);
    expect(YD3_PER_M3 * 27).toBeCloseTo(m3ToFt3(1), 6);
  });

  it('uses the Quikrete data-sheet yields for US bags', () => {
    expect(m3ToFt3(bag('lb40').yieldM3)).toBeCloseTo(0.3, 6);
    expect(m3ToFt3(bag('lb50').yieldM3)).toBeCloseTo(0.375, 6);
    expect(m3ToFt3(bag('lb60').yieldM3)).toBeCloseTo(0.45, 6);
    expect(m3ToFt3(bag('lb80').yieldM3)).toBeCloseTo(0.6, 6);
    expect(m3ToFt3(bag('lb90').yieldM3)).toBeCloseTo(0.675, 6);
  });

  it('estimates a 25 kg bag at about 11.7 litres', () => {
    expect(bag('kg25').yieldM3 * 1000).toBeCloseTo(11.7, 1);
  });
});

describe('concrete engine — shape volumes', () => {
  it('slab 10 ft × 10 ft × 4 in = 33.33 ft³ (1.235 yd³)', () => {
    const v = shapeVolumeM3('slab', { length: ft(10), width: ft(10), thickness: inch(4) });
    expect(m3ToFt3(v)).toBeCloseTo(33.333, 3);
    expect(m3ToYd3(v)).toBeCloseTo(1.2346, 4);
  });

  it('round slab 8 ft diameter × 4 in = 16.76 ft³', () => {
    const v = shapeVolumeM3('circle', { diameter: ft(8), thickness: inch(4) });
    expect(m3ToFt3(v)).toBeCloseTo(16.755, 3);
  });

  it('footing 20 ft × 16 in × 8 in = 17.78 ft³', () => {
    const v = shapeVolumeM3('footing', { length: ft(20), width: inch(16), depth: inch(8) });
    expect(m3ToFt3(v)).toBeCloseTo(17.778, 3);
  });

  it('wall 12 ft × 4 ft × 8 in = 32 ft³', () => {
    const v = shapeVolumeM3('wall', { length: ft(12), height: ft(4), thickness: inch(8) });
    expect(m3ToFt3(v)).toBeCloseTo(32, 6);
  });

  it('square column 12 in × 12 in × 8 ft = 8 ft³', () => {
    const v = shapeVolumeM3('squareColumn', { width: inch(12), depth: inch(12), height: ft(8) });
    expect(m3ToFt3(v)).toBeCloseTo(8, 6);
  });

  it('Sonotube 12 in × 4 ft = 3.14 ft³', () => {
    const v = shapeVolumeM3('roundColumn', { diameter: inch(12), height: ft(4) });
    expect(m3ToFt3(v)).toBeCloseTo(Math.PI, 6);
  });

  it('post hole 10 in × 24 in minus a 3.5 in post = 0.921 ft³', () => {
    const v = shapeVolumeM3('postHoles', { diameter: inch(10), depth: inch(24), postSize: inch(3.5) });
    expect(m3ToFt3(v)).toBeCloseTo(0.92069, 4);
  });

  it('post hole never goes negative when the post is wider than the hole', () => {
    const v = shapeVolumeM3('postHoles', { diameter: inch(4), depth: inch(24), postSize: inch(5.5) });
    expect(v).toBe(0);
  });

  it('3 steps, 7 in rise, 11 in run, 4 ft wide = 12.83 ft³', () => {
    const v = shapeVolumeM3('steps', { stepCount: 3, rise: inch(7), run: inch(11), width: ft(4) });
    expect(m3ToFt3(v)).toBeCloseTo(12.8333, 3);
  });

  it('metric slab 4 m × 3 m × 10 cm = 1.2 m³', () => {
    expect(shapeVolumeM3('slab', { length: 4, width: 3, thickness: 0.1 })).toBeCloseTo(1.2, 9);
  });

  it('treats negative, empty and NaN dimensions as zero', () => {
    expect(shapeVolumeM3('slab', { length: -3, width: 2, thickness: 0.1 })).toBe(0);
    expect(shapeVolumeM3('slab', { length: NaN, width: 2, thickness: 0.1 })).toBe(0);
    expect(shapeVolumeM3('slab', {})).toBe(0);
  });

  it('every shape has defaults that produce a positive volume', () => {
    for (const id of SHAPE_ORDER) {
      expect(shapeVolumeM3(id, defaultValues(id))).toBeGreaterThan(0);
      expect(SHAPES[id].fields.length).toBeGreaterThan(0);
    }
  });
});

describe('concrete engine — bags and rounding', () => {
  it('rounds bags up and ignores float noise', () => {
    expect(bagsNeeded(1, 0.5)).toBe(2);
    expect(bagsNeeded(1.0000000001, 0.5)).toBe(2);
    expect(bagsNeeded(1.01, 0.5)).toBe(3);
    expect(bagsNeeded(0, 0.5)).toBe(0);
  });

  it('rounds ready-mix orders up to 0.25 steps', () => {
    expect(roundUpTo(1.358, 0.25)).toBe(1.5);
    expect(roundUpTo(1.5, 0.25)).toBe(1.5);
    expect(roundUpTo(0, 0.25)).toBe(0);
  });
});

describe('concrete engine — full job', () => {
  const slab10x10 = { id: 'a', shape: 'slab' as const, qty: 1, values: { length: ft(10), width: ft(10), thickness: inch(4) } };

  it('10×10 ft × 4 in slab with 10% waste: 1.358 yd³, 62 × 80 lb, 82 × 60 lb', () => {
    const r = calculateJob({ items: [slab10x10], wastePercent: 10, densityKgM3: 2400, truckCapacityM3: yd3ToM3(10) });
    expect(m3ToYd3(r.totalM3)).toBeCloseTo(1.358, 3);
    expect(m3ToFt3(r.totalM3)).toBeCloseTo(36.667, 3);
    expect(r.bags.find((b) => b.id === 'lb80')!.count).toBe(62);
    expect(r.bags.find((b) => b.id === 'lb60')!.count).toBe(82);
    expect(r.bags.find((b) => b.id === 'lb40')!.count).toBe(123);
    expect(r.truckLoads).toBe(1);
  });

  it('same slab without waste needs 56 × 80 lb bags', () => {
    const r = calculateJob({ items: [slab10x10], wastePercent: 0, densityKgM3: 2400, truckCapacityM3: 0 });
    expect(r.wasteM3).toBe(0);
    expect(r.bags.find((b) => b.id === 'lb80')!.count).toBe(56);
    expect(r.truckLoads).toBe(0);
  });

  it('adds different shapes and quantities into one total', () => {
    const r = calculateJob({
      items: [
        slab10x10,
        { id: 'b', shape: 'postHoles', qty: 8, values: { diameter: inch(10), depth: inch(24), postSize: inch(3.5) } },
        { id: 'c', shape: 'roundColumn', qty: 4, values: { diameter: inch(12), height: ft(4) } },
      ],
      wastePercent: 0,
      densityKgM3: 2400,
      truckCapacityM3: yd3ToM3(10),
    });
    // 33.333 + 8 × 0.92069 + 4 × π
    expect(m3ToFt3(r.netM3)).toBeCloseTo(33.333 + 8 * 0.92069 + 4 * Math.PI, 2);
    expect(r.items).toHaveLength(3);
  });

  it('computes weight from density', () => {
    const r = calculateJob({
      items: [{ id: 'm', shape: 'slab', qty: 1, values: { length: 4, width: 3, thickness: 0.1 } }],
      wastePercent: 0,
      densityKgM3: 2400,
      truckCapacityM3: 7.5,
    });
    expect(r.weightKg).toBeCloseTo(2880, 6);
    expect(r.bags.find((b) => b.id === 'kg25')!.count).toBe(103);
  });

  it('counts truck loads from the given capacity', () => {
    const r = calculateJob({
      items: [{ id: 't', shape: 'slab', qty: 1, values: { length: ft(54), width: ft(20), thickness: inch(6) } }],
      wastePercent: 0,
      densityKgM3: 2400,
      truckCapacityM3: yd3ToM3(10),
    });
    expect(m3ToYd3(r.totalM3)).toBeCloseTo(20, 6);
    expect(r.truckLoads).toBe(2);
  });

  it('ignores zero quantity and clamps waste to 0–100%', () => {
    const r = calculateJob({ items: [{ ...slab10x10, qty: 0 }], wastePercent: 250, densityKgM3: 2400, truckCapacityM3: 1 });
    expect(r.totalM3).toBe(0);
    const r2 = calculateJob({ items: [slab10x10], wastePercent: 250, densityKgM3: 2400, truckCapacityM3: 1 });
    expect(r2.totalM3).toBeCloseTo(r2.netM3 * 2, 9);
  });
});

describe('concrete engine — site mix', () => {
  it('1 m³ of 1:2:4 needs ~317 kg cement, 0.44 m³ sand, 0.88 m³ gravel', () => {
    const m = siteMix(1, [1, 2, 4]);
    expect(m.cementKg).toBeCloseTo(316.8, 1);
    expect(m.cementBags50kg).toBe(7);
    expect(m.cementBags94lb).toBe(8);
    expect(m.sandM3).toBeCloseTo(0.44, 6);
    expect(m.gravelM3).toBeCloseTo(0.88, 6);
  });

  it('returns zero for zero volume', () => {
    const m = siteMix(0, [1, 2, 4]);
    expect(m.cementKg).toBe(0);
    expect(m.cementBags50kg).toBe(0);
  });
});
