import { describe, it, expect } from 'vitest';
import { calculateCompost } from './compost-engine';

describe('Compost Engine', () => {
  it('calculates 3 raised beds of 32 sq ft at 2" depth accurately', () => {
    // 3 beds * 32 sq ft = 96 sq ft.
    // 96 * (2 / 12) = 16.0 cu ft.
    // Cu yds: 16.0 / 27 = 0.59 cu yds.
    // 1 cu ft bags = 16 bags. 1.5 cu ft bags = 11 bags. 2 cu ft bags = 8 bags.
    // Pricing: 16 bags * $5.99 = $95.84.
    const result = calculateCompost({
      areaSqFt: 32,
      bedMultiplier: 3,
      compostDepthInches: 2,
      preferredBagSizeCuFt: 1.0,
      costPerBag: 5.99,
    });

    expect(result.totalAreaSqFt).toBe(96);
    expect(result.volumeCuFt).toBe(16.0);
    expect(result.volumeCubicYards).toBe(0.59);
    expect(result.bags10CuFt).toBe(16);
    expect(result.bags15CuFt).toBe(11);
    expect(result.bags20CuFt).toBe(8);
    expect(result.selectedBagsCount).toBe(16);
    expect(result.totalCost).toBe(95.84);
  });

  it('matches lawn top-dressing worked example (2,000 sq ft @ 0.25" depth)', () => {
    // 2,000 * (0.25 / 12) = 41.67 cu ft.
    // 41.67 / 27 = 1.54 cu yds.
    const result = calculateCompost({
      areaSqFt: 2000,
      bedMultiplier: 1,
      compostDepthInches: 0.25,
      preferredBagSizeCuFt: 1.0,
    });

    expect(result.volumeCuFt).toBe(41.67);
    expect(result.volumeCubicYards).toBe(1.54);
    expect(result.bags10CuFt).toBe(42);
    expect(result.bags20CuFt).toBe(21);
  });

  it('handles zero or minimal inputs gracefully', () => {
    const result = calculateCompost({
      areaSqFt: 0,
      bedMultiplier: 1,
      compostDepthInches: 2,
    });

    expect(result.totalAreaSqFt).toBe(0);
    expect(result.volumeCuFt).toBe(0);
    expect(result.volumeCubicYards).toBe(0);
    expect(result.bags10CuFt).toBe(0);
  });
});

