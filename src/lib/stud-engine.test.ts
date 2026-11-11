import { describe, it, expect } from 'vitest';
import { calculateStuds } from './stud-engine';

describe('Stud Wall Framing Engine (Tool #14)', () => {
  it('T1: calculates defaults (24 ft, 8 ft high, 16" OC, 2 corners, 1 T, 1 door, 1 window, 10%, double plate)', () => {
    // 24 ft = 288 in. 288 / 16 = 18 intervals + 1 = 19 field studs.
    // 2 corners * 2 = 4. 1 T * 2 = 2. 2 openings * 4 = 8.
    // Subtotal = 19 + 4 + 2 + 8 = 33.
    // Total = ceil(33 * 110 / 100) = ceil(36.3) = 37. Waste = 4.
    // Plates: 24 ft * 3 = 72 LF. Bottom = ceil(24/16) = 2. Top = ceil(48/16) = 3. Boards = 5.
    // Header boards = 2 openings * 2 = 4.
    // Costs: stud $4.50, bottom $14.00, top $9.50:
    // Studs: 37 * 4.50 = 166.50
    // Bottom: 2 * 14.00 = 28.00
    // Top: 3 * 9.50 = 28.50
    // Grand total: 166.50 + 28.00 + 28.50 = 223.00.
    const res = calculateStuds({
      lengthFt: 24,
      heightChoice: '8',
      spacing: 16,
      lumber: '2x4',
      corners: 2,
      tJunctions: 1,
      doors: 1,
      windows: 1,
      plateConfig: 'double',
      wastePct: 10,
      studPrice: 4.5,
      bottomPlatePrice: 14.0,
      topPlatePrice: 9.5,
    });

    expect(res.fieldStuds).toBe(19);
    expect(res.cornerStuds).toBe(4);
    expect(res.tStuds).toBe(2);
    expect(res.openingStuds).toBe(8);
    expect(res.subtotal).toBe(33);
    expect(res.totalStuds).toBe(37);
    expect(res.wasteStuds).toBe(4);
    expect(res.totalPlateLf).toBe(72);
    expect(res.bottomBoards).toBe(2);
    expect(res.topBoards).toBe(3);
    expect(res.totalPlateBoards).toBe(5);
    expect(res.headerBoards).toBe(4);
    expect(res.studsCost).toBe(166.5);
    expect(res.bottomPlatesCost).toBe(28.0);
    expect(res.topPlatesCost).toBe(28.5);
    expect(res.grandTotalCost).toBe(223.0);
  });

  it('T2: calculates L=38 ft, no extras, 10% waste, and verifies integer ceil math without float bug', () => {
    // 38 ft = 456 in. 456 / 16 = 28.5 -> ceil(28.5) = 29 + 1 = 30 field studs.
    // Subtotal 30 -> ceil(30 * 110 / 100) = 33 total studs.
    const res1 = calculateStuds({
      lengthFt: 38,
      heightChoice: '8',
      spacing: 16,
      lumber: '2x4',
      corners: 0,
      tJunctions: 0,
      doors: 0,
      windows: 0,
      plateConfig: 'double',
      wastePct: 10,
    });

    expect(res1.fieldStuds).toBe(30);
    expect(res1.totalStuds).toBe(33);

    // Verify subtotal 50 at 10% must give exactly 55, not 56
    // Construct input where subtotal is 50:
    // e.g. 50 field studs -> 49 intervals * 16 = 784 in = 65 ft 4 in
    const res2 = calculateStuds({
      lengthFt: 65,
      lengthIn: 4,
      heightChoice: '8',
      spacing: 16,
      lumber: '2x4',
      corners: 0,
      tJunctions: 0,
      doors: 0,
      windows: 0,
      plateConfig: 'double',
      wastePct: 10,
    });

    expect(res2.subtotal).toBe(50);
    expect(res2.totalStuds).toBe(55); // MUST be 55, not 56!
  });

  it('T3: calculates L=42 ft, 1 corner, 1 T, 2 doors, 0 windows, 10% (Worked Example)', () => {
    // 42 ft = 504 in. 504 / 16 = 31.5 -> ceil(31.5) = 32 + 1 = 33 field studs.
    // 1 corner = 2. 1 T = 2. 2 doors = 8.
    // Subtotal = 33 + 2 + 2 + 8 = 45.
    // Total = ceil(45 * 110 / 100) = ceil(49.5) = 50 studs. Waste = 5.
    // Plates: 42 ft * 3 = 126 LF.
    // Bottom = ceil(42 / 16) = 3 boards.
    // Top = ceil(84 / 16) = 6 boards.
    // Boards = 3 + 6 = 9 boards.
    // Headers = 2 * 2 = 4.
    const res = calculateStuds({
      lengthFt: 42,
      heightChoice: '8',
      spacing: 16,
      lumber: '2x4',
      corners: 1,
      tJunctions: 1,
      doors: 2,
      windows: 0,
      plateConfig: 'double',
      wastePct: 10,
    });

    expect(res.fieldStuds).toBe(33);
    expect(res.cornerStuds).toBe(2);
    expect(res.tStuds).toBe(2);
    expect(res.openingStuds).toBe(8);
    expect(res.subtotal).toBe(45);
    expect(res.totalStuds).toBe(50);
    expect(res.wasteStuds).toBe(5);
    expect(res.totalPlateLf).toBe(126);
    expect(res.bottomBoards).toBe(3);
    expect(res.topBoards).toBe(6);
    expect(res.totalPlateBoards).toBe(9);
    expect(res.headerBoards).toBe(4);
    expect(res.studLengthOutput).toBe('92-5/8" precut stud');
  });

  it('T4: calculates L=20 ft, 24" OC, 5% waste', () => {
    // 20 ft = 240 in. 240 / 24 = 10 + 1 = 11 field studs.
    // Subtotal = 11. Total = ceil(11 * 105 / 100) = ceil(11.55) = 12 studs.
    const res = calculateStuds({
      lengthFt: 20,
      heightChoice: '8',
      spacing: 24,
      lumber: '2x4',
      corners: 0,
      tJunctions: 0,
      doors: 0,
      windows: 0,
      plateConfig: 'double',
      wastePct: 5,
    });

    expect(res.fieldStuds).toBe(11);
    expect(res.totalStuds).toBe(12);
  });

  it('T5: calculates L=20 ft with single top plate', () => {
    // Plate layers = 2.
    // LF = 20 * 2 = 40 LF.
    // Bottom = ceil(20 / 16) = 2 boards.
    // Top = ceil(20 * 1 / 16) = 2 boards.
    const res = calculateStuds({
      lengthFt: 20,
      heightChoice: '8',
      spacing: 16,
      lumber: '2x4',
      corners: 0,
      tJunctions: 0,
      doors: 0,
      windows: 0,
      plateConfig: 'single',
      wastePct: 10,
    });

    expect(res.plateLayers).toBe(2);
    expect(res.totalPlateLf).toBe(40);
    expect(res.bottomBoards).toBe(2);
    expect(res.topBoards).toBe(2);
    expect(res.totalPlateBoards).toBe(4);
  });

  it('T6: calculates L=10 ft plain vs L=10 ft with 1 corner + 1 door', () => {
    // 10 ft plain: 120 / 16 = 7.5 -> 8 + 1 = 9 field studs. Total = ceil(9 * 1.1) = 10 studs.
    const plain = calculateStuds({
      lengthFt: 10,
      heightChoice: '8',
      spacing: 16,
      lumber: '2x4',
      corners: 0,
      tJunctions: 0,
      doors: 0,
      windows: 0,
      plateConfig: 'double',
      wastePct: 10,
    });
    expect(plain.fieldStuds).toBe(9);
    expect(plain.totalStuds).toBe(10);

    // 10 ft with 1 corner + 1 door:
    // field 9, corner 2, door 4 -> subtotal = 15. Total = ceil(15 * 110 / 100) = ceil(16.5) = 17 studs.
    const withExtras = calculateStuds({
      lengthFt: 10,
      heightChoice: '8',
      spacing: 16,
      lumber: '2x4',
      corners: 1,
      tJunctions: 0,
      doors: 1,
      windows: 0,
      plateConfig: 'double',
      wastePct: 10,
    });
    expect(withExtras.fieldStuds).toBe(9);
    expect(withExtras.subtotal).toBe(15);
    expect(withExtras.totalStuds).toBe(17);
  });

  it('handles custom heights and edge-case zero inputs cleanly without NaN', () => {
    const custom = calculateStuds({
      lengthFt: 16,
      heightChoice: 'custom',
      customHeightIn: 114, // 9.5 ft wall
      spacing: 16,
      lumber: '2x6',
      corners: 0,
      tJunctions: 0,
      doors: 0,
      windows: 0,
      plateConfig: 'double',
      wastePct: 10,
    });

    expect(custom.heightFt).toBe(9.5);
    expect(custom.wallAreaSqFt).toBe(152);
    // Double plate thickness = 3 * 1.5 = 4.5 in. Cut length = 114 - 4.5 = 109.5 in.
    expect(custom.studLengthOutput).toContain('109.5"');
    expect(custom.recommendedStockLength).toBe('10-ft stock lumber');

    // Zero input test
    const zero = calculateStuds({
      lengthFt: 0,
      heightChoice: '8',
      spacing: 16,
      lumber: '2x4',
      corners: 0,
      tJunctions: 0,
      doors: 0,
      windows: 0,
      plateConfig: 'double',
      wastePct: 10,
    });
    expect(zero.totalStuds).toBe(0);
    expect(zero.subtotal).toBe(0);
    expect(zero.bottomBoards).toBe(0);
    expect(zero.topBoards).toBe(0);
    expect(zero.wallAreaSqFt).toBe(0);
  });
});
