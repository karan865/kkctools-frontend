import { describe, it, expect } from 'vitest';
import { calculateBricks, BRICK_PRESETS } from './brick-engine';

describe('Brick Calculator Engine', () => {
  it('calculates standard modular brick for a 100 sq ft wall accurately', () => {
    // 100 sq ft wall, Modular brick, 3/8" joint, single wythe, 0% waste
    const result = calculateBricks({
      wallLengthFeet: 10,
      wallHeightFeet: 10,
      brickPresetId: 'modular',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 0,
    });

    expect(result.grossWallAreaSqFt).toBe(100);
    expect(result.netWallAreaSqFt).toBe(100);
    // Modular with 3/8" joint has nominal dimensions 8" x 2.625"
    // Bricks per sq ft = 144 / 21 ≈ 6.86
    expect(result.bricksPerSqFt).toBeCloseTo(6.86, 1);
    expect(result.baseBricksNeeded).toBe(686);
    expect(result.totalBricksNeeded).toBe(686);
  });

  it('accurately applies 10% waste factor', () => {
    const result = calculateBricks({
      wallLengthFeet: 10,
      wallHeightFeet: 10,
      brickPresetId: 'modular',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 10,
    });

    // 686 base * 1.10 = 754.6 -> ceil(755)
    expect(result.baseBricksNeeded).toBe(686);
    expect(result.totalBricksNeeded).toBe(755);
    expect(result.wasteBricks).toBe(69);
  });

  it('doubles the brick count for double wythe (structural solid brick) walls', () => {
    const singleResult = calculateBricks({
      wallLengthFeet: 20,
      wallHeightFeet: 8,
      brickPresetId: 'modular',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 0,
    });

    const doubleResult = calculateBricks({
      wallLengthFeet: 20,
      wallHeightFeet: 8,
      brickPresetId: 'modular',
      mortarJointInches: 0.375,
      isDoubleWythe: true,
      wastePercentage: 0,
    });

    expect(doubleResult.baseBricksNeeded).toBe(singleResult.baseBricksNeeded * 2);
  });

  it('correctly deducts door and window openings', () => {
    // 20x8 = 160 sq ft wall with 28 sq ft opening (net 132 sq ft)
    const result = calculateBricks({
      wallLengthFeet: 20,
      wallHeightFeet: 8,
      brickPresetId: 'modular',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 10,
      openings: [
        { id: '1', name: 'Archway', widthFeet: 4, heightFeet: 7, quantity: 1 },
      ],
    });

    expect(result.grossWallAreaSqFt).toBe(160);
    expect(result.openingsAreaSqFt).toBe(28);
    expect(result.netWallAreaSqFt).toBe(132);
    // 132 sq ft * 6.857 = 905 base bricks. With 10% waste = 996 bricks
    expect(result.baseBricksNeeded).toBe(906);
    expect(result.totalBricksNeeded).toBe(997);
  });

  it('handles standard US, King, and Queen presets correctly', () => {
    const standard = calculateBricks({
      wallLengthFeet: 10,
      wallHeightFeet: 10,
      brickPresetId: 'standard',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 0,
    });
    // Standard brick nominal face = 8.375 * 2.625 = 21.984 -> ~6.55 bricks/sq ft
    expect(standard.bricksPerSqFt).toBeCloseTo(6.55, 1);

    const queen = calculateBricks({
      wallLengthFeet: 10,
      wallHeightFeet: 10,
      brickPresetId: 'queen',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 0,
    });
    // Queen nominal = 8 * 3.125 = 25 -> 144/25 = 5.76 bricks/sq ft
    expect(queen.bricksPerSqFt).toBeCloseTo(5.76, 1);
  });

  it('computes material costs and mortar bags properly', () => {
    const result = calculateBricks({
      wallLengthFeet: 10,
      wallHeightFeet: 10,
      brickPresetId: 'modular',
      mortarJointInches: 0.375,
      isDoubleWythe: false,
      wastePercentage: 10,
      pricePerBrick: 0.85,
      pricePerMortarBag: 11.50,
    });

    expect(result.totalBricksNeeded).toBe(755);
    expect(result.brickCost).toBeCloseTo(755 * 0.85, 2);
    // Mortar bags: ceil(5.7) = 6 bags * 11.50 = 69.00
    expect(result.mortarCost).toBe(69.00);
    expect(result.totalCost).toBe(parseFloat((result.brickCost + 69.00).toFixed(2)));
  });
});

