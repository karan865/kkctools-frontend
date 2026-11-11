import { describe, it, expect } from 'vitest';
import { convertTonsToCubicYards } from './tons-yards-engine';

describe('Tons to Cubic Yards Engine', () => {
  it('converts 14 tons of #57 limestone to cubic yards accurately', () => {
    // 14 tons / 1.35 tons/yd3 = 10.37 cu yds.
    const result = convertTonsToCubicYards({
      direction: 'tons-to-yards',
      amount: 14,
      materialId: 'clean-limestone-57',
    });

    expect(result.weightShortTons).toBe(14);
    expect(result.weightPounds).toBe(28000);
    expect(result.volumeCubicYards).toBe(10.37);
    expect(result.volumeCubicFeet).toBe(280);
    expect(result.bags50LbCount).toBe(560);
  });

  it('converts 12 tons of crushed stone at 1.4 tons/yd3', () => {
    // 12 tons / 1.4 = 8.57 cu yds.
    const result = convertTonsToCubicYards({
      direction: 'tons-to-yards',
      amount: 12,
      materialId: 'crushed-stone',
      unitPrice: 60,
    });

    expect(result.volumeCubicYards).toBe(8.57);
    expect(result.volumeCubicFeet).toBe(231.43);
    expect(result.totalCost).toBe(720);
  });

  it('converts cubic yards to tons accurately', () => {
    // 10 cubic yards of topsoil (1.1 tons/yd3) = 11.0 tons.
    const result = convertTonsToCubicYards({
      direction: 'yards-to-tons',
      amount: 10,
      materialId: 'topsoil-screened',
    });

    expect(result.weightShortTons).toBe(11);
    expect(result.weightPounds).toBe(22000);
    expect(result.volumeCubicYards).toBe(10);
  });

  it('handles custom density correctly', () => {
    const result = convertTonsToCubicYards({
      direction: 'tons-to-yards',
      amount: 10,
      materialId: 'custom',
      customDensityTonsPerYard: 2.0,
    });

    expect(result.volumeCubicYards).toBe(5);
  });
});

