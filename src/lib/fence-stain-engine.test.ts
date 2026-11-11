import { describe, it, expect } from 'vitest';
import { calculateFenceStain } from './fence-stain-engine';

describe('Fence Stain Engine', () => {
  it('calculates 150 ft x 6 ft fence on both sides accurately', () => {
    // 150 ft * 6 ft = 900 sq ft flat.
    // Both sides = 1800 sq ft.
    // Flat privacy = 1.0x -> 1800 sq ft.
    // Rough-sawn: 1800 / 175 = 10.29 gal coat 1.
    // Coat 2: 1800 / (175 * 1.30) = 7.91 gal.
    // Raw = 10.29 + 7.91 = 18.2 gal.
    // Buffer (brush/roller 10%) = 18.2 * 1.10 = 20.02 gal.
    // Ceil = 21 -> 4 pails + 1 can (or 4 * 5 = 20 + 1).
    const result = calculateFenceStain({
      fenceLengthFeet: 150,
      fenceHeightFeet: 6,
      bothSides: true,
      picketStyle: 'flat-privacy',
      woodPorosity: 'rough-sawn',
      coatsCount: 2,
      applicationMethod: 'brush-roller',
      costPer5GalPail: 165,
      costPer1GalCan: 42,
    });

    expect(result.baseFlatAreaSqFt).toBe(900);
    expect(result.effectiveStainedAreaSqFt).toBe(1800);
    expect(result.coat1Gallons).toBe(10.29);
    expect(result.coat2Gallons).toBe(7.91);
    expect(result.totalRawGallons).toBe(18.2);
    expect(result.totalOrderGallons).toBe(20.02);
    expect(result.pails5GalCount).toBe(4);
    expect(result.cans1GalCount).toBe(1);
    expect(result.totalCost).toBe(4 * 165 + 1 * 42); // 660 + 42 = 702
  });

  it('matches board-on-board worked example (120 ft x 6 ft, 1.30x multiplier)', () => {
    // 120 * 6 = 720 * 2 = 1440 * 1.30 = 1872 sq ft effective.
    // Coat 1: 1872 / 175 = 10.70 gal.
    // Coat 2: 1872 / (175 * 1.30) = 8.23 gal.
    // Raw = 18.93 gal.
    // 10% buffer = 18.93 * 1.10 = 20.82 gal -> Ceil 21 gal -> 4 pails + 1 can.
    const result = calculateFenceStain({
      fenceLengthFeet: 120,
      fenceHeightFeet: 6,
      bothSides: true,
      picketStyle: 'board-on-board',
      woodPorosity: 'rough-sawn',
      coatsCount: 2,
      applicationMethod: 'brush-roller',
    });

    expect(result.effectiveStainedAreaSqFt).toBe(1872);
    expect(result.coat1Gallons).toBe(10.7);
    expect(result.coat2Gallons).toBe(8.23);
    expect(result.totalOrderGallons).toBe(20.82);
    expect(result.pails5GalCount).toBe(4);
    expect(result.cans1GalCount).toBe(1);
  });

  it('handles single coat and one side correctly', () => {
    const result = calculateFenceStain({
      fenceLengthFeet: 100,
      fenceHeightFeet: 6,
      bothSides: false,
      picketStyle: 'flat-privacy',
      woodPorosity: 'smooth-planed',
      coatsCount: 1,
      applicationMethod: 'brush-roller',
    });

    expect(result.sidesMultiplier).toBe(1);
    expect(result.effectiveStainedAreaSqFt).toBe(600);
    expect(result.coat2Gallons).toBe(0);
    // 600 / 225 = 2.67 gal * 1.10 = 2.94 gal -> 0 pails + 3 cans.
    expect(result.pails5GalCount).toBe(0);
    expect(result.cans1GalCount).toBe(3);
  });
});

