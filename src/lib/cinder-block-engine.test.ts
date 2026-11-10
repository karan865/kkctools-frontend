import { describe, it, expect } from 'vitest';
import { calculateCinderBlocks, CinderBlockInput } from './cinder-block-engine';

describe('cinder-block-engine', () => {
  it('calculates standard 8x8x16 wall without openings accurately', () => {
    const input: CinderBlockInput = {
      wallLengthFeet: 30,
      wallHeightFeet: 8,
      presetKey: 'standard_8',
      wastePercent: 0,
      coreFillFrequency: 'none',
    };

    const res = calculateCinderBlocks(input);
    expect(res.grossWallAreaSqFt).toBe(240);
    expect(res.netWallAreaSqFt).toBe(240);
    // 240 * 1.125 = 270 blocks
    expect(res.netBlocks).toBe(270);
    expect(res.totalBlocksWithWaste).toBe(270);
    expect(res.coursesCount).toBe(12); // (8 * 12) / 8 = 12 courses
    expect(res.blocksPerCourse).toBe(23); // round((30 * 12) / 16) = 23
    expect(res.mortarBags80lb).toBe(Math.ceil(270 / 33)); // 9 bags
  });

  it('handles 10% waste buffer correctly', () => {
    const input: CinderBlockInput = {
      wallLengthFeet: 30,
      wallHeightFeet: 8,
      presetKey: 'standard_8',
      wastePercent: 10,
      coreFillFrequency: 'none',
    };

    const res = calculateCinderBlocks(input);
    // 270 * 1.10 = 297
    expect(res.totalBlocksWithWaste).toBe(297);
  });

  it('deducts doors and windows from wall area accurately', () => {
    const input: CinderBlockInput = {
      wallLengthFeet: 30,
      wallHeightFeet: 8,
      presetKey: 'standard_8',
      wastePercent: 10,
      coreFillFrequency: 'none',
      openings: [
        { id: '1', name: 'Door', widthFeet: 3, heightFeet: 7, count: 1 }, // 21 sq ft
        { id: '2', name: 'Window', widthFeet: 4, heightFeet: 3, count: 1 }, // 12 sq ft
      ],
    };

    const res = calculateCinderBlocks(input);
    expect(res.grossWallAreaSqFt).toBe(240);
    expect(res.openingsAreaSqFt).toBe(33); // 21 + 12
    expect(res.netWallAreaSqFt).toBe(207); // 240 - 33
    // 207 * 1.125 = 232.875
    expect(res.netBlocks).toBeCloseTo(232.9, 1);
    // 232.875 * 1.10 = 256.16 -> ceil 257
    expect(res.totalBlocksWithWaste).toBe(257);
    expect(res.mortarBags80lb).toBe(8); // ceil(257 / 33) = 8
  });

  it('calculates core fill concrete volume correctly', () => {
    const input: CinderBlockInput = {
      wallLengthFeet: 10,
      wallHeightFeet: 8,
      presetKey: 'standard_8',
      wastePercent: 0,
      coreFillFrequency: 'all', // 100% solid filled
    };

    const res = calculateCinderBlocks(input);
    // Net blocks = 80 * 1.125 = 90
    // Core vol = 90 * 0.22 = 19.8 cu ft
    expect(res.coreFillCuFt).toBeCloseTo(19.8, 1);
    // Yards = 19.8 / 27 = 0.73 cu yds
    expect(res.coreFillCuYds).toBeCloseTo(0.73, 2);
  });

  it('calculates dry weight and costs correctly', () => {
    const input: CinderBlockInput = {
      wallLengthFeet: 20,
      wallHeightFeet: 10,
      presetKey: 'standard_8',
      wastePercent: 10,
      coreFillFrequency: 'none',
      costPerBlock: 2.5,
      costPerMortarBag: 8.0,
    };

    const res = calculateCinderBlocks(input);
    // 200 * 1.125 = 225 net * 1.10 = 247.5 -> 248 blocks
    expect(res.totalBlocksWithWaste).toBe(248);
    expect(res.totalWeightLbs).toBe(248 * 36);
    expect(res.estimatedBlockCost).toBe(248 * 2.5);
    expect(res.estimatedMortarCost).toBe(res.mortarBags80lb * 8.0);
    expect(res.totalEstimatedCost).toBe(res.estimatedBlockCost + res.estimatedMortarCost);
  });
});

