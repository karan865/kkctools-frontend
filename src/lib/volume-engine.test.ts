import { describe, it, expect } from 'vitest';
import {
  calcVolume,
  VolumeCalcInput,
  VolumeCalcResult,
} from './volume-engine';

describe('Cubic Yard / Volume Engine (Spec B5 Test Cases)', () => {
  // T1: Slab 10×10 ft, 4 in, waste 0
  // Expected: 33.33 ft³ · 1.235 yd³ · bags 80/60/50/40 lb = 56 / 75 / 89 / 112 · weight 5,000 lb (2.5 tons) · guidance compare
  it('T1: Slab 10x10 ft, 4 in, waste 0', () => {
    const input: VolumeCalcInput = {
      material: 'concrete',
      wastePct: 0,
      sections: [
        {
          shape: 'rectangle',
          length: 10,
          lengthUnit: 'ft',
          width: 10,
          widthUnit: 'ft',
          depth: 4,
          depthUnit: 'in',
        },
      ],
    };
    const res = calcVolume(input) as VolumeCalcResult;
    expect(res.ok).toBe(true);
    expect(res.exact.ft3).toBeCloseTo(33.333, 2);
    expect(res.exact.yd3).toBeCloseTo(1.235, 3);

    const b80 = res.bags?.find((b) => b.sizeLb === 80)?.bags;
    const b60 = res.bags?.find((b) => b.sizeLb === 60)?.bags;
    const b50 = res.bags?.find((b) => b.sizeLb === 50)?.bags;
    const b40 = res.bags?.find((b) => b.sizeLb === 40)?.bags;
    expect(b80).toBe(56);
    expect(b60).toBe(75);
    expect(b50).toBe(89);
    expect(b40).toBe(112);

    expect(Math.round(res.weightExact?.pounds || 0)).toBe(5000);
    expect(res.weightExact?.tons).toBeCloseTo(2.5, 4);
    expect(res.guidance).toBe('compare');
  });

  // T2: T1 + waste 10%
  // Expected: order 1.358 yd³ · suggested 1.5 · 80 lb bags = 62
  it('T2: T1 + waste 10%', () => {
    const input: VolumeCalcInput = {
      material: 'concrete',
      wastePct: 10,
      sections: [
        {
          shape: 'rectangle',
          length: 10,
          lengthUnit: 'ft',
          width: 10,
          widthUnit: 'ft',
          depth: 4,
          depthUnit: 'in',
        },
      ],
    };
    const res = calcVolume(input) as VolumeCalcResult;
    expect(res.ok).toBe(true);
    expect(res.order.yd3).toBeCloseTo(1.358, 3);
    expect(res.suggestedOrderYd3).toBe(1.5);
    const b80 = res.bags?.find((b) => b.sizeLb === 80)?.bags;
    expect(b80).toBe(62);
  });

  // T3: Known volume 27 ft³, waste 0
  // Expected: exactly 1 yd³ · 80 lb bags = 45 (float-safe) · 60 lb = 60 · 40 lb = 90 · 50 lb = 72 · suggested 1 · weight 4,050 lb = 2.025 tons = 1.837 tonnes
  it('T3: Known volume 27 ft3, waste 0', () => {
    const input: VolumeCalcInput = {
      material: 'concrete',
      wastePct: 0,
      sections: [{ shape: 'volume', volume: 27, volumeUnit: 'ft3' }],
    };
    const res = calcVolume(input) as VolumeCalcResult;
    expect(res.ok).toBe(true);
    expect(res.exact.yd3).toBe(1);
    expect(res.suggestedOrderYd3).toBe(1);

    const b80 = res.bags?.find((b) => b.sizeLb === 80)?.bags;
    const b60 = res.bags?.find((b) => b.sizeLb === 60)?.bags;
    const b50 = res.bags?.find((b) => b.sizeLb === 50)?.bags;
    const b40 = res.bags?.find((b) => b.sizeLb === 40)?.bags;
    expect(b80).toBe(45);
    expect(b60).toBe(60);
    expect(b50).toBe(72);
    expect(b40).toBe(90);

    expect(res.weightExact?.pounds).toBe(4050);
    expect(res.weightExact?.tons).toBe(2.025);
    expect(res.weightExact?.tonnes).toBeCloseTo(1.837, 3);
  });

  // T4: Footing 100 ft × 16 in × 8 in -> 3.292 yd³
  it('T4: Footing 100 ft x 16 in x 8 in', () => {
    const input: VolumeCalcInput = {
      material: 'concrete',
      wastePct: 0,
      sections: [
        {
          shape: 'rectangle',
          length: 100,
          lengthUnit: 'ft',
          width: 16,
          widthUnit: 'in',
          depth: 8,
          depthUnit: 'in',
        },
      ],
    };
    const res = calcVolume(input) as VolumeCalcResult;
    expect(res.ok).toBe(true);
    expect(res.exact.yd3).toBeCloseTo(3.292, 3);
  });

  // T5: Wall 20 ft × 4 ft × 8 in -> 1.975 yd³
  it('T5: Wall 20 ft x 4 ft x 8 in', () => {
    const input: VolumeCalcInput = {
      material: 'concrete',
      wastePct: 0,
      sections: [
        {
          shape: 'rectangle',
          length: 20,
          lengthUnit: 'ft',
          width: 4,
          widthUnit: 'ft',
          depth: 8,
          depthUnit: 'in',
        },
      ],
    };
    const res = calcVolume(input) as VolumeCalcResult;
    expect(res.ok).toBe(true);
    expect(res.exact.yd3).toBeCloseTo(1.975, 3);
  });

  // T6: 4 columns Ø12 in × 4 ft -> 12.566 ft³ · 0.465 yd³ · guidance bags
  it('T6: 4 columns diameter 12 in x 4 ft', () => {
    const input: VolumeCalcInput = {
      material: 'concrete',
      wastePct: 0,
      sections: [
        {
          shape: 'circle',
          diameter: 12,
          diameterUnit: 'in',
          depth: 4,
          depthUnit: 'ft',
          qty: 4,
        },
      ],
    };
    const res = calcVolume(input) as VolumeCalcResult;
    expect(res.ok).toBe(true);
    expect(res.exact.ft3).toBeCloseTo(12.566, 3);
    expect(res.exact.yd3).toBeCloseTo(0.465, 3);
    expect(res.guidance).toBe('bags');
  });

  // T7: T1 slab + T4 footing (labels "Slab", "Footing") -> 122.222 ft³ · 4.527 yd³ · breakdown labels kept
  it('T7: Multi-section slab + footing', () => {
    const input: VolumeCalcInput = {
      material: 'concrete',
      wastePct: 0,
      sections: [
        {
          shape: 'rectangle',
          length: 10,
          lengthUnit: 'ft',
          width: 10,
          widthUnit: 'ft',
          depth: 4,
          depthUnit: 'in',
          label: 'Slab',
        },
        {
          shape: 'rectangle',
          length: 100,
          lengthUnit: 'ft',
          width: 16,
          widthUnit: 'in',
          depth: 8,
          depthUnit: 'in',
          label: 'Footing',
        },
      ],
    };
    const res = calcVolume(input) as VolumeCalcResult;
    expect(res.ok).toBe(true);
    expect(res.exact.ft3).toBeCloseTo(122.222, 3);
    expect(res.exact.yd3).toBeCloseTo(4.527, 3);
    expect(res.breakdown[0].label).toBe('Slab');
    expect(res.breakdown[1].label).toBe('Footing');
  });

  // T8: Other material, 5 m × 4 m × 100 mm -> 2 m³ · 2.616 yd³ · no bags, no weight
  it('T8: Other material, 5 m x 4 m x 100 mm', () => {
    const input: VolumeCalcInput = {
      material: 'other',
      wastePct: 0,
      sections: [
        {
          shape: 'rectangle',
          length: 5,
          lengthUnit: 'm',
          width: 4,
          widthUnit: 'm',
          depth: 100,
          depthUnit: 'mm',
        },
      ],
    };
    const res = calcVolume(input) as VolumeCalcResult;
    expect(res.ok).toBe(true);
    expect(res.exact.m3).toBeCloseTo(2.0, 2);
    expect(res.exact.yd3).toBeCloseTo(2.616, 3);
    expect(res.bags).toBeUndefined();
    expect(res.weightExact).toBeUndefined();
  });

  // T9: Known volume 100 ft³ -> 3.704 yd³
  it('T9: Known volume 100 ft3', () => {
    const input: VolumeCalcInput = {
      material: 'concrete',
      wastePct: 0,
      sections: [{ shape: 'volume', volume: 100, volumeUnit: 'ft3' }],
    };
    const res = calcVolume(input) as VolumeCalcResult;
    expect(res.ok).toBe(true);
    expect(res.exact.yd3).toBeCloseTo(3.704, 3);
  });

  // T10: Known volume 2 yd³ -> 54 ft³
  it('T10: Known volume 2 yd3', () => {
    const input: VolumeCalcInput = {
      material: 'concrete',
      wastePct: 0,
      sections: [{ shape: 'volume', volume: 2, volumeUnit: 'yd3' }],
    };
    const res = calcVolume(input) as VolumeCalcResult;
    expect(res.ok).toBe(true);
    expect(res.exact.ft3).toBe(54);
  });

  // T11: Known volume 3.2 yd³ -> suggested 3.25; 3.25 yd³ -> stays 3.25
  it('T11: 1/4-yd round-up logic', () => {
    const res1 = calcVolume({
      material: 'concrete',
      wastePct: 0,
      sections: [{ shape: 'volume', volume: 3.2, volumeUnit: 'yd3' }],
    }) as VolumeCalcResult;
    expect(res1.suggestedOrderYd3).toBe(3.25);

    const res2 = calcVolume({
      material: 'concrete',
      wastePct: 0,
      sections: [{ shape: 'volume', volume: 3.25, volumeUnit: 'yd3' }],
    }) as VolumeCalcResult;
    expect(res2.suggestedOrderYd3).toBe(3.25);
  });

  // T12: Depth 0 · qty 1.5 · waste 80% -> each rejected with a message
  it('T12: Depth 0, qty 1.5, waste 80% rejected', () => {
    const res = calcVolume({
      material: 'concrete',
      wastePct: 80,
      sections: [
        {
          shape: 'rectangle',
          length: 10,
          lengthUnit: 'ft',
          width: 10,
          widthUnit: 'ft',
          depth: 0,
          depthUnit: 'in',
          qty: 1.5,
        },
      ],
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.errors.some((e) => e.includes('dimensions'))).toBe(true);
      expect(res.errors.some((e) => e.includes('quantity'))).toBe(true);
      expect(res.errors.some((e) => e.includes('Waste'))).toBe(true);
    }
  });

  // T13: Slab 10×12 ft, 4 in -> 1.481 yd³
  it('T13: Slab 10x12 ft, 4 in', () => {
    const input: VolumeCalcInput = {
      material: 'concrete',
      wastePct: 0,
      sections: [
        {
          shape: 'rectangle',
          length: 10,
          lengthUnit: 'ft',
          width: 12,
          widthUnit: 'ft',
          depth: 4,
          depthUnit: 'in',
        },
      ],
    };
    const res = calcVolume(input) as VolumeCalcResult;
    expect(res.ok).toBe(true);
    expect(res.exact.yd3).toBeCloseTo(1.481, 3);
  });

  // T14: Other material, density 100 lb/ft³, 1 yd³, waste 5% -> weight 2,835 lb
  it('T14: Other material with density 100 lb/ft3, 1 yd3, 5% waste', () => {
    const input: VolumeCalcInput = {
      material: 'other',
      wastePct: 5,
      density: 100,
      densityUnit: 'lb/ft3',
      sections: [{ shape: 'volume', volume: 1, volumeUnit: 'yd3' }],
    };
    const res = calcVolume(input) as VolumeCalcResult;
    expect(res.ok).toBe(true);
    expect(res.weightOrder?.pounds).toBeCloseTo(2835, 1);
  });

  // T15: Post hole Ø10 in × 30 in -> 1.3635 ft³ · 80 lb bags = 3
  it('T15: Post hole diameter 10 in x 30 in depth', () => {
    const input: VolumeCalcInput = {
      material: 'concrete',
      wastePct: 0,
      sections: [
        {
          shape: 'circle',
          diameter: 10,
          diameterUnit: 'in',
          depth: 30,
          depthUnit: 'in',
        },
      ],
    };
    const res = calcVolume(input) as VolumeCalcResult;
    expect(res.ok).toBe(true);
    expect(res.exact.ft3).toBeCloseTo(1.3635, 3);
    const b80 = res.bags?.find((b) => b.sizeLb === 80)?.bags;
    expect(b80).toBe(3);
  });

  // T16: 6 yd³ -> guidance ready-mix · 0.9 yd³ -> guidance bags
  it('T16: Guidance thresholds', () => {
    const res1 = calcVolume({
      material: 'concrete',
      wastePct: 0,
      sections: [{ shape: 'volume', volume: 6, volumeUnit: 'yd3' }],
    }) as VolumeCalcResult;
    expect(res1.guidance).toBe('ready-mix');

    const res2 = calcVolume({
      material: 'concrete',
      wastePct: 0,
      sections: [{ shape: 'volume', volume: 0.9, volumeUnit: 'yd3' }],
    }) as VolumeCalcResult;
    expect(res2.guidance).toBe('bags');
  });
});
