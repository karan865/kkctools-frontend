import { describe, it, expect } from 'vitest';
import { calculatePaverBase } from './paver-base-engine';

describe('Paver Base Engine', () => {
  it('calculates 384 sq ft patio with 4" base and 15% compaction accurately', () => {
    // 384 sq ft * (4 / 12) = 128.0 cu ft compacted (4.74 cu yds).
    // Loose (+15%) = 128.0 * 1.15 = 147.2 cu ft (5.45 cu yds).
    // Tons: 5.45 * 1.40 = 7.63 tons.
    // Bags (0.5 cu ft): 147.2 / 0.5 = 295 bags.
    // Pricing: 7.63 * 42 = $320.46 + $60 = $380.46.
    const result = calculatePaverBase({
      areaSqFt: 384,
      baseDepthInches: 4,
      compactionPercent: 15,
      costPerTon: 42,
      deliveryFee: 60,
    });

    expect(result.compactedCuFt).toBe(128.0);
    expect(result.compactedCubicYards).toBe(4.74);
    expect(result.looseCuFt).toBe(147.2);
    expect(result.looseCubicYards).toBe(5.45);
    expect(result.looseTons).toBe(7.63);
    expect(result.bags05CuFtCount).toBe(295);
    expect(result.materialCost).toBe(320.46);
    expect(result.totalCost).toBe(380.46);
  });

  it('matches worked example for 247 sq ft on clay soil (6" depth, 20% compaction)', () => {
    // 247 * 0.5 = 123.5 cu ft.
    // With 20%: 123.5 * 1.20 = 148.2 cu ft.
    // Cu yds: 148.2 / 27 = 5.49 cu yds.
    // Tons: 5.49 * 1.40 = 7.69 tons.
    const result = calculatePaverBase({
      areaSqFt: 247,
      baseDepthInches: 6,
      compactionPercent: 20,
    });

    expect(result.compactedCuFt).toBe(123.5);
    expect(result.looseCuFt).toBe(148.2);
    expect(result.looseCubicYards).toBe(5.49);
    expect(result.looseTons).toBe(7.69);
  });

  it('handles zero or minimal inputs gracefully', () => {
    const result = calculatePaverBase({
      areaSqFt: 0,
      baseDepthInches: 4,
      compactionPercent: 15,
    });

    expect(result.areaSqFt).toBe(0);
    expect(result.compactedCuFt).toBe(0);
    expect(result.looseTons).toBe(0);
    expect(result.bags05CuFtCount).toBe(0);
  });
});

