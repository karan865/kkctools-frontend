import { describe, it, expect } from 'vitest';
import {
  calculateCinderBlocks,
  CinderBlockInput,
  parseDimension,
  guardedCeil,
} from './cinder-block-engine';

describe('cinder-block-engine', () => {
  it('handles comma as decimal separator', () => {
    expect(parseDimension('12,5')).toBe(12.5);
    expect(parseDimension('30.0')).toBe(30.0);
    expect(parseDimension('')).toBe(0);
    expect(parseDimension(null)).toBe(0);
  });

  it('guards ceil against floating-point precision artifacts', () => {
    expect(guardedCeil(270 - 1e-11)).toBe(270);
    expect(guardedCeil(270.0001)).toBe(271);
  });

  it('calculates 30x8 wall, no openings, 3/8" joint, 10% waste: net 270, order 297', () => {
    const input: CinderBlockInput = {
      walls: [{ id: 'w1', name: 'Main Wall', lengthFeet: 30, heightFeet: 8, quantity: 1 }],
      presetKey: 'standard_8',
      mortarJointInches: 0.375, // 3/8" -> unit: 15.625+0.375=16", 7.625+0.375=8" -> 1.125 blocks/sqft
      wastePercent: 10,
      coreFillFrequency: 'none',
    };

    const res = calculateCinderBlocks(input);
    expect(res.grossWallAreaSqFt).toBe(240);
    expect(res.netWallAreaSqFt).toBe(240);
    expect(res.blocksPerSqFt).toBe(1.125);
    expect(res.netBlocks).toBe(270); // 240 * 1.125 = 270
    expect(res.totalBlocksWithWaste).toBe(297); // 270 * 1.10 = 297
  });

  it('calculates 30x8 with 3x7 door & 4x3 window: 207 sq ft, net 232.875, order 257, mortar 20/8, weight 9,252 lb, 3 pallets, cost $578.25', () => {
    const input: CinderBlockInput = {
      walls: [{ id: 'w1', name: 'Garage Wall', lengthFeet: 30, heightFeet: 8, quantity: 1 }],
      presetKey: 'standard_8',
      mortarJointInches: 0.375,
      openings: [
        { id: 'd1', name: 'Entry Door', type: 'door', widthFeet: 3, heightFeet: 7, count: 1 }, // 21 sq ft
        { id: 'win1', name: 'Window', type: 'window', widthFeet: 4, heightFeet: 3, count: 1 }, // 12 sq ft
      ],
      wastePercent: 10,
      mortarType: 'preblended',
      coreFillFrequency: 'none',
      costPerBlock: 2.25,
      blocksPerPallet: 90,
    };

    const res = calculateCinderBlocks(input);
    expect(res.grossWallAreaSqFt).toBe(240);
    expect(res.openingsAreaSqFt).toBe(33);
    expect(res.netWallAreaSqFt).toBe(207);
    expect(res.netBlocks).toBe(232.875);
    expect(res.totalBlocksWithWaste).toBe(257); // ceil(232.875 * 1.10) = ceil(256.1625) = 257
    expect(res.mortarBags80lb).toBe(20); // ceil(257 / 13) = ceil(19.769) = 20
    expect(res.totalWeightLbs).toBe(9252); // 257 * 36 lb = 9252 lb
    expect(res.totalWeightTons).toBeCloseTo(4.626, 3);
    expect(res.palletsCount).toBe(3); // ceil(257 / 90) = 3
    expect(res.estimatedBlockCost).toBe(578.25); // 257 * 2.25 = 578.25

    // Also check masonry cement mode on same block count
    const resMasonry = calculateCinderBlocks({ ...input, mortarType: 'masonry_cement' });
    expect(resMasonry.mortarBags80lb).toBe(8); // ceil(257 / 35) = ceil(7.34) = 8
  });

  it('calculates 1/2" joint: 1.0991 blocks per sq ft across all standard size presets', () => {
    // 15.625 + 0.5 = 16.125; 7.625 + 0.5 = 8.125
    // 144 / (16.125 * 8.125) = 144 / 131.015625 ≈ 1.0991055...
    const presets = ['standard_8', 'partition_4', 'medium_6', 'heavy_10', 'extra_heavy_12'] as const;

    for (const p of presets) {
      const res = calculateCinderBlocks({
        walls: [{ id: '1', name: 'Test', lengthFeet: 10, heightFeet: 10, quantity: 1 }],
        presetKey: p,
        mortarJointInches: 0.5, // 1/2"
        wastePercent: 0,
        coreFillFrequency: 'none',
      });
      expect(res.blocksPerSqFt).toBeCloseTo(1.0991, 4);
    }
  });

  it('calculates core fill for 100 blocks of 8": fully grouted 27 cu ft (1.0 cu yd), 32" oc 6.75 cu ft, 48" oc 4.5 cu ft before waste', () => {
    // 8" block core volume = 0.27 cu ft
    // 100 blocks * 0.27 = 27 cu ft = 1.0 cu yd
    const inputBase: CinderBlockInput = {
      walls: [{ id: '1', name: 'W', lengthFeet: 10, heightFeet: 8.888889, quantity: 1 }], // ~88.89 sq ft * 1.125 = 100 net blocks
      presetKey: 'standard_8',
      wastePercent: 0,
      groutWastePercent: 0, // before waste
      coreFillFrequency: 'all',
    };

    const resAll = calculateCinderBlocks(inputBase);
    expect(resAll.netBlocks).toBeCloseTo(100, 1);
    expect(resAll.coreFillCuFt).toBeCloseTo(27.0, 1);
    expect(resAll.coreFillCuYds).toBeCloseTo(1.0, 2);

    // 32" o.c. (25%) -> 27 * 0.25 = 6.75 cu ft
    const res32 = calculateCinderBlocks({ ...inputBase, coreFillFrequency: 'every_32' });
    expect(res32.coreFillCuFt).toBeCloseTo(6.75, 2);

    // 48" o.c. (1/6 = 16.6667%) -> 27 * (1/6) = 4.5 cu ft
    const res48 = calculateCinderBlocks({ ...inputBase, coreFillFrequency: 'every_48' });
    expect(res48.coreFillCuFt).toBeCloseTo(4.5, 2);
  });

  it('calculates courses and blocks per row correctly (7.5 ft height -> 12 courses, 30 ft length -> 23 blocks per row)', () => {
    const res = calculateCinderBlocks({
      walls: [{ id: '1', name: 'Wall', lengthFeet: 30, heightFeet: 7.5, quantity: 1 }],
      presetKey: 'standard_8',
      mortarJointInches: 0.375, // unit height = 8", unit length = 16"
      wastePercent: 0,
      coreFillFrequency: 'none',
    });

    // 7.5 ft = 90 in; 90 / 8 = 11.25 -> ceil = 12 courses
    expect(res.maxCourses).toBe(12);
    // 30 ft = 360 in; 360 / 16 = 22.5 -> ceil = 23 blocks per row
    expect(res.maxBlocksPerRow).toBe(23);
  });

  it('handles multiple walls with different heights and warns when openings exceed gross area', () => {
    const resMulti = calculateCinderBlocks({
      walls: [
        { id: 'w1', name: 'Front Wall', lengthFeet: 20, heightFeet: 10, quantity: 1 }, // 200 sq ft
        { id: 'w2', name: 'Side Wall', lengthFeet: 15, heightFeet: 8, quantity: 2 }, // 120 * 2 = 240 sq ft
      ],
      presetKey: 'standard_8',
      wastePercent: 0,
      coreFillFrequency: 'none',
    });

    expect(resMulti.grossWallAreaSqFt).toBe(440); // 200 + 240 = 440
    expect(resMulti.netWallAreaSqFt).toBe(440);
    expect(resMulti.isOpeningExceeding).toBe(false);

    // Opening exceeding gross area
    const resExceeding = calculateCinderBlocks({
      walls: [{ id: 'w1', name: 'Small Wall', lengthFeet: 10, heightFeet: 8, quantity: 1 }], // 80 sq ft
      openings: [{ id: 'op1', name: 'Huge Gate', type: 'door', widthFeet: 12, heightFeet: 8, count: 1 }], // 96 sq ft
      presetKey: 'standard_8',
      wastePercent: 0,
      coreFillFrequency: 'none',
    });

    expect(resExceeding.isOpeningExceeding).toBe(true);
    expect(resExceeding.netWallAreaSqFt).toBe(0);
    expect(resExceeding.netBlocks).toBe(0);
    expect(resExceeding.totalBlocksWithWaste).toBe(0);
  });
});
