import { describe, it, expect } from 'vitest';
import { calculateStudFraming } from './stud-engine';

describe('Stud Framing Engine', () => {
  it('calculates standard 24 ft wall at 16" OC correctly', () => {
    // 24 ft = 288 in. 288 / 16 = 18 intervals + 1 = 19 field studs.
    // 2 corners = 6 studs. 1 T-junction = 2 studs. 1 door + 1 window = 8 studs.
    // Subtotal = 19 + 6 + 2 + 8 = 35 studs.
    // Waste 10% = 35 * 1.10 = 38.5 -> 39 studs.
    const result = calculateStudFraming({
      wallLengthFeet: 24,
      wallHeightFeet: 8,
      onCenterSpacingInches: 16,
      lumberSize: '2x4',
      cornersCount: 2,
      tJunctionsCount: 1,
      doorsCount: 1,
      windowsCount: 1,
      plateType: 'double-top',
      wastePercent: 10,
      costPerStud: 4.5,
      costPerPlateBoard: 9.5,
    });

    expect(result.baseFieldStuds).toBe(19);
    expect(result.cornerStuds).toBe(6);
    expect(result.tJunctionStuds).toBe(2);
    expect(result.roughOpeningStuds).toBe(8);
    expect(result.subtotalStuds).toBe(35);
    expect(result.totalStudsToOrder).toBe(39);
    expect(result.wasteStuds).toBe(4);
    // Plates: 24 ft * 3 = 72 linear ft. 72 / 16 = 4.5 -> 5 boards.
    expect(result.totalPlatesLinearFeet).toBe(72);
    expect(result.plateBoards16Ft).toBe(5);
    // Costs: 39 * 4.50 = 175.50. 5 * 9.50 = 47.50. Total = 223.00.
    expect(result.studsCost).toBe(175.5);
    expect(result.platesCost).toBe(47.5);
    expect(result.totalLumberCost).toBe(223);
  });

  it('calculates 24" OC spacing accurately', () => {
    // 24 ft = 288 in. 288 / 24 = 12 intervals + 1 = 13 field studs.
    const result = calculateStudFraming({
      wallLengthFeet: 24,
      wallHeightFeet: 8,
      onCenterSpacingInches: 24,
      lumberSize: '2x4',
      cornersCount: 0,
      tJunctionsCount: 0,
      doorsCount: 0,
      windowsCount: 0,
      plateType: 'single-top',
      wastePercent: 0,
    });

    expect(result.baseFieldStuds).toBe(13);
    expect(result.totalStudsToOrder).toBe(13);
    // Single top plate = 2 plates: 24 * 2 = 48 linear ft. 48 / 16 = 3 boards.
    expect(result.totalPlatesLinearFeet).toBe(48);
    expect(result.plateBoards16Ft).toBe(3);
  });

  it('matches worked example from specification (42 linear ft)', () => {
    // 42 ft = 504 in. 504 / 16 = 31.5 -> Math.ceil(31.5) = 32 + 1 = 33 field studs.
    // 2 corners = 6 studs. 1 T-junction = 2 studs. 2 openings = 8 studs.
    // Subtotal = 33 + 6 + 2 + 8 = 49 studs.
    // 10% waste = 49 * 1.10 = 53.9 -> 54 studs.
    const result = calculateStudFraming({
      wallLengthFeet: 42,
      wallHeightFeet: 8,
      onCenterSpacingInches: 16,
      lumberSize: '2x4',
      cornersCount: 2,
      tJunctionsCount: 1,
      doorsCount: 1,
      windowsCount: 1,
      plateType: 'double-top',
      wastePercent: 10,
    });

    expect(result.baseFieldStuds).toBe(33);
    expect(result.cornerStuds).toBe(6);
    expect(result.tJunctionStuds).toBe(2);
    expect(result.roughOpeningStuds).toBe(8);
    expect(result.subtotalStuds).toBe(49);
    expect(result.totalStudsToOrder).toBe(54);
    // Plates: 42 * 3 = 126 linear ft. 126 / 16 = 7.875 -> 8 boards.
    expect(result.totalPlatesLinearFeet).toBe(126);
    expect(result.plateBoards16Ft).toBe(8);
  });

  it('handles zero or empty values gracefully', () => {
    const result = calculateStudFraming({
      wallLengthFeet: 0,
      wallHeightFeet: 8,
      onCenterSpacingInches: 16,
      lumberSize: '2x4',
      cornersCount: 0,
      tJunctionsCount: 0,
      doorsCount: 0,
      windowsCount: 0,
      plateType: 'double-top',
      wastePercent: 10,
    });

    expect(result.baseFieldStuds).toBe(0);
    expect(result.totalStudsToOrder).toBe(0);
    expect(result.totalPlatesLinearFeet).toBe(0);
    expect(result.plateBoards16Ft).toBe(0);
  });
});

