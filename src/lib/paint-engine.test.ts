import { describe, it, expect } from 'vitest';
import {
  calculatePaint,
  calculateContainerBreakdown,
  parseDimension,
  PaintCalculationInput,
} from './paint-engine';
import { COVERAGE } from './paint-constants';

describe('paint-engine', () => {
  it('handles comma as decimal separator and safe fallback', () => {
    expect(parseDimension('12,5')).toBe(12.5);
    expect(parseDimension('10.25')).toBe(10.25);
    expect(parseDimension('')).toBe(0);
    expect(parseDimension(null)).toBe(0);
  });

  // Test vector 1: 12x12 -> net wall 333; exact 1.753; buy 2 gal
  it('vector 1: 12x12 room -> net wall 333, exact 1.753, buy 2 gal', () => {
    const input: PaintCalculationInput = {
      rooms: [
        {
          id: '1',
          name: '12x12 Room',
          lengthFeet: 12,
          widthFeet: 12,
          heightFeet: 8,
          doorsCount: 1,
          windowsCount: 2,
          includeCeiling: false,
        },
      ],
      textureKey: 'smooth', // 380
      coats: 2,
      includePrimer: false,
      wallPricePerGallon: 45,
    };
    const res = calculatePaint(input);
    // Perimeter = 2*(12+12)=48; gross = 48*8 = 384; openings = 1*21 + 2*15 = 51; net wall = 333
    expect(res.totalNetWallSqFt).toBe(333);
    // 333 * 2 / 380 = 666 / 380 = 1.75263... -> exact 1.753
    expect(res.wallExactGallons).toBeCloseTo(1.753, 2);
    // frac = 0.7526 > 0.50 -> whole + 1 = 2 gal
    expect(res.wallContainers.wholeGallons).toBe(2);
    expect(res.wallContainers.quarts).toBe(0);
    expect(res.wallContainers.displayLabel).toBe('2 Gallons');
  });

  // Test vector 2: 14x12 with ceiling ON -> net wall 365, wall exact 1.921 -> 2 gal; ceiling 168 sq ft, exact 0.884 -> 1 gal
  it('vector 2: 14x12 with ceiling ON -> net wall 365, wall 2 gal; ceiling 168 sq ft, 1 gal', () => {
    const input: PaintCalculationInput = {
      rooms: [
        {
          id: '1',
          name: '14x12 Room',
          lengthFeet: 14,
          widthFeet: 12,
          heightFeet: 8,
          doorsCount: 1,
          windowsCount: 2,
          includeCeiling: true,
        },
      ],
      textureKey: 'smooth',
      coats: 2,
      ceilingCoats: 2,
      includePrimer: false,
      wallPricePerGallon: 45,
    };
    const res = calculatePaint(input);
    // Perimeter = 2*(14+12)=52; gross = 52*8 = 416; openings = 51; net wall = 365
    expect(res.totalNetWallSqFt).toBe(365);
    // 365 * 2 / 380 = 730 / 380 = 1.92105...
    expect(res.wallExactGallons).toBeCloseTo(1.921, 2);
    expect(res.wallContainers.wholeGallons).toBe(2);
    expect(res.wallContainers.quarts).toBe(0);

    // Ceiling: 14*12 = 168 sq ft; 168 * 2 / 380 = 336 / 380 = 0.8842...
    expect(res.totalCeilingSqFt).toBe(168);
    expect(res.ceilingExactGallons).toBeCloseTo(0.884, 2);
    // frac = 0.884 > 0.50 -> 1 gal
    expect(res.ceilingContainers.wholeGallons).toBe(1);
    expect(res.ceilingContainers.quarts).toBe(0);
    expect(res.ceilingContainers.displayLabel).toBe('1 Gallon');
  });

  // Test vector 3: 14x14 -> exact 2.09 -> 2 gal + 1 qt -> paint cost = 2*45 + 1*(45*0.40) = $108
  it('vector 3: 14x14 room -> exact 2.09 -> 2 gal + 1 qt -> paint cost = $108', () => {
    const input: PaintCalculationInput = {
      rooms: [
        {
          id: '1',
          name: '14x14 Room',
          lengthFeet: 14,
          widthFeet: 14,
          heightFeet: 8,
          doorsCount: 1,
          windowsCount: 2,
          includeCeiling: false,
        },
      ],
      textureKey: 'smooth',
      coats: 2,
      includePrimer: false,
      wallPricePerGallon: 45,
    };
    const res = calculatePaint(input);
    // Perimeter = 56; gross = 448; openings = 51; net = 397
    // 397 * 2 / 380 = 794 / 380 = 2.08947... -> exact 2.089 -> ~2.09
    expect(res.totalNetWallSqFt).toBe(397);
    expect(res.wallExactGallons).toBeCloseTo(2.089, 2);
    // frac = 0.089 <= 0.25 -> 2 gal + 1 qt
    expect(res.wallContainers.wholeGallons).toBe(2);
    expect(res.wallContainers.quarts).toBe(1);
    expect(res.wallContainers.displayLabel).toBe('2 Gallons + 1 Quart');
    // cost = 2 * 45 + 1 * (45 * 0.40) = 90 + 18 = 108
    expect(res.wallPaintCost).toBe(108);
  });

  // Test vector 4: 16x16 -> exact 2.43 -> 2 gal + 2 qt -> cost $126
  it('vector 4: 16x16 room -> exact 2.43 -> 2 gal + 2 qt -> cost $126', () => {
    const input: PaintCalculationInput = {
      rooms: [
        {
          id: '1',
          name: '16x16 Room',
          lengthFeet: 16,
          widthFeet: 16,
          heightFeet: 8,
          doorsCount: 1,
          windowsCount: 2,
          includeCeiling: false,
        },
      ],
      textureKey: 'smooth',
      coats: 2,
      includePrimer: false,
      wallPricePerGallon: 45,
    };
    const res = calculatePaint(input);
    // Perimeter = 64; gross = 512; openings = 51; net = 461
    // 461 * 2 / 380 = 922 / 380 = 2.4263... -> exact 2.426 -> ~2.43
    expect(res.totalNetWallSqFt).toBe(461);
    expect(res.wallExactGallons).toBeCloseTo(2.426, 2);
    // frac = 0.426 <= 0.50 -> 2 gal + 2 qt
    expect(res.wallContainers.wholeGallons).toBe(2);
    expect(res.wallContainers.quarts).toBe(2);
    expect(res.wallContainers.displayLabel).toBe('2 Gallons + 2 Quarts');
    // cost = 2 * 45 + 2 * (45 * 0.40) = 90 + 36 = 126
    expect(res.wallPaintCost).toBe(126);
  });

  // Test vector 5: 10x10 -> exact 1.42 -> 1 gal + 2 qt -> cost $81
  it('vector 5: 10x10 room -> exact 1.42 -> 1 gal + 2 qt -> cost $81', () => {
    const input: PaintCalculationInput = {
      rooms: [
        {
          id: '1',
          name: '10x10 Room',
          lengthFeet: 10,
          widthFeet: 10,
          heightFeet: 8,
          doorsCount: 1,
          windowsCount: 2,
          includeCeiling: false,
        },
      ],
      textureKey: 'smooth',
      coats: 2,
      includePrimer: false,
      wallPricePerGallon: 45,
    };
    const res = calculatePaint(input);
    // Perimeter = 40; gross = 320; openings = 51; net = 269
    // 269 * 2 / 380 = 538 / 380 = 1.4157... -> exact 1.416
    expect(res.totalNetWallSqFt).toBe(269);
    expect(res.wallExactGallons).toBeCloseTo(1.416, 2);
    // frac = 0.416 <= 0.50 -> 1 gal + 2 qt
    expect(res.wallContainers.wholeGallons).toBe(1);
    expect(res.wallContainers.quarts).toBe(2);
    expect(res.wallContainers.displayLabel).toBe('1 Gallon + 2 Quarts');
    // cost = 1 * 45 + 2 * (45 * 0.40) = 45 + 36 = 81
    expect(res.wallPaintCost).toBe(81);
  });

  // Test vector 6: Primer for 14x12 with ceiling -> (365 + 168) / 300 = 1.78 -> 2 gal
  it('vector 6: primer for 14x12 with ceiling -> (365 + 168) / 300 = 1.78 -> 2 gal', () => {
    const input: PaintCalculationInput = {
      rooms: [
        {
          id: '1',
          name: '14x12 Room',
          lengthFeet: 14,
          widthFeet: 12,
          heightFeet: 8,
          doorsCount: 1,
          windowsCount: 2,
          includeCeiling: true,
        },
      ],
      textureKey: 'smooth',
      coats: 2,
      includePrimer: true,
      primerCoverageSqFt: 300,
    };
    const res = calculatePaint(input);
    // Total primer area = 365 + 168 = 533 sq ft
    // 533 / 300 = 1.7766... -> 1.78
    expect(res.primerExactGallons).toBeCloseTo(1.777, 2);
    expect(res.primerGallonsToBuy).toBe(2);
  });

  // Test vector 7: Pro benchmark for 12x12 -> $330-$830; for 14x12 (365 sq ft) -> $370-$910
  it('vector 7: pro benchmark for 12x12 -> $330-$830; for 14x12 -> $370-$910', () => {
    // 12x12: net wall 333, ceiling OFF -> 333 sq ft
    // proLow = round10(333 * 1.00) = 330; proHigh = round10(333 * 2.50) = 832.5 -> 830
    const res12 = calculatePaint({
      rooms: [{ id: '1', name: '12x12', lengthFeet: 12, widthFeet: 12, heightFeet: 8, doorsCount: 1, windowsCount: 2, includeCeiling: false }],
      textureKey: 'smooth',
      coats: 2,
      includePrimer: false,
    });
    expect(res12.proEstimateLow).toBe(330);
    expect(res12.proEstimateHigh).toBe(830);

    // 14x12: net wall 365, ceiling OFF -> 365 sq ft
    // proLow = round10(365 * 1.00) = 370; proHigh = round10(365 * 2.50) = 912.5 -> 910
    const res14 = calculatePaint({
      rooms: [{ id: '1', name: '14x12', lengthFeet: 14, widthFeet: 12, heightFeet: 8, doorsCount: 1, windowsCount: 2, includeCeiling: false }],
      textureKey: 'smooth',
      coats: 2,
      includePrimer: false,
    });
    expect(res14.proEstimateLow).toBe(370);
    expect(res14.proEstimateHigh).toBe(910);
  });

  // Test vector 8: Multi-room 12x12 + 10x10 -> totals 602 net wall; 1,204 / 380 = 3.168 -> 3 gal + 1 qt (rounding on sum, not per room)
  it('vector 8: multi-room 12x12 + 10x10 -> 602 net wall, 3.168 gal -> 3 gal + 1 qt', () => {
    const input: PaintCalculationInput = {
      rooms: [
        { id: '1', name: 'Room 1', lengthFeet: 12, widthFeet: 12, heightFeet: 8, doorsCount: 1, windowsCount: 2, includeCeiling: false }, // 333 net
        { id: '2', name: 'Room 2', lengthFeet: 10, widthFeet: 10, heightFeet: 8, doorsCount: 1, windowsCount: 2, includeCeiling: false }, // 269 net
      ],
      textureKey: 'smooth',
      coats: 2,
      includePrimer: false,
    };
    const res = calculatePaint(input);
    expect(res.totalNetWallSqFt).toBe(602); // 333 + 269 = 602
    // 602 * 2 / 380 = 1204 / 380 = 3.16842...
    expect(res.wallExactGallons).toBeCloseTo(3.168, 2);
    // frac = 0.168 <= 0.25 -> 3 gal + 1 qt
    expect(res.wallContainers.wholeGallons).toBe(3);
    expect(res.wallContainers.quarts).toBe(1);
    expect(res.wallContainers.displayLabel).toBe('3 Gallons + 1 Quart');
  });

  // Test vector 9: Opening deductions never push net wall below 0
  it('vector 9: opening deductions never push net wall below 0', () => {
    const input: PaintCalculationInput = {
      rooms: [
        { id: '1', name: 'Tiny Closet with Huge Door', lengthFeet: 3, widthFeet: 3, heightFeet: 8, doorsCount: 4, windowsCount: 4, includeCeiling: false },
      ],
      textureKey: 'smooth',
      coats: 2,
      includePrimer: false,
    };
    const res = calculatePaint(input);
    expect(res.totalNetWallSqFt).toBe(0);
    expect(res.wallExactGallons).toBe(0);
    expect(res.wallContainers.wholeGallons).toBe(0);
  });

  // Test vector 10: Empty, NaN and negative inputs are treated as 0 and do not crash
  it('vector 10: empty, NaN and negative inputs are treated as 0 and do not crash', () => {
    const input: PaintCalculationInput = {
      rooms: [
        { id: '1', name: 'Invalid', lengthFeet: -10, widthFeet: NaN, heightFeet: -8, doorsCount: -2, windowsCount: NaN, includeCeiling: false },
      ],
      textureKey: 'smooth',
      coats: -2,
      includePrimer: false,
    };
    const res = calculatePaint(input);
    expect(res.totalNetWallSqFt).toBe(0);
    expect(res.totalDIYCost).toBeGreaterThanOrEqual(0);
  });

  // Test vector 11: Unprimed (250) + primer ON triggers the conflict hint flag
  it('vector 11: unprimed (250) + primer ON triggers conflict flag', () => {
    const resConflict = calculatePaint({
      rooms: [{ id: '1', name: 'R', lengthFeet: 12, widthFeet: 12, heightFeet: 8, doorsCount: 1, windowsCount: 2, includeCeiling: false }],
      textureKey: 'unprimed',
      coats: 2,
      includePrimer: true,
    });
    expect(resConflict.unprimedPrimerConflict).toBe(true);

    const resNoConflict = calculatePaint({
      rooms: [{ id: '1', name: 'R', lengthFeet: 12, widthFeet: 12, heightFeet: 8, doorsCount: 1, windowsCount: 2, includeCeiling: false }],
      textureKey: 'smooth',
      coats: 2,
      includePrimer: true,
    });
    expect(resNoConflict.unprimedPrimerConflict).toBe(false);
  });

  // Test vector 12: The room-size reference table values equal engine output for every row
  it('vector 12: room-size reference table values match engine output for all 8 rows', () => {
    const tableData = [
      { l: 10, w: 10, net: 269, coat1: 0.71, wallBuy: '1 Gallon + 2 Quarts', ceilBuy: '1 Gallon' },
      { l: 10, w: 12, net: 301, coat1: 0.79, wallBuy: '2 Gallons', ceilBuy: '1 Gallon' },
      { l: 12, w: 12, net: 333, coat1: 0.88, wallBuy: '2 Gallons', ceilBuy: '1 Gallon' },
      { l: 12, w: 14, net: 365, coat1: 0.96, wallBuy: '2 Gallons', ceilBuy: '1 Gallon' },
      { l: 14, w: 14, net: 397, coat1: 1.04, wallBuy: '2 Gallons + 1 Quart', ceilBuy: '1 Gallon + 1 Quart' },
      { l: 14, w: 16, net: 429, coat1: 1.13, wallBuy: '2 Gallons + 2 Quarts', ceilBuy: '1 Gallon + 1 Quart' },
      { l: 16, w: 16, net: 461, coat1: 1.21, wallBuy: '2 Gallons + 2 Quarts', ceilBuy: '1 Gallon + 2 Quarts' },
      { l: 16, w: 20, net: 525, coat1: 1.38, wallBuy: '3 Gallons', ceilBuy: '2 Gallons' },
    ];

    for (const row of tableData) {
      // 1 coat test
      const res1 = calculatePaint({
        rooms: [{ id: '1', name: 'R', lengthFeet: row.l, widthFeet: row.w, heightFeet: 8, doorsCount: 1, windowsCount: 2, includeCeiling: false }],
        textureKey: 'smooth',
        coats: 1,
        includePrimer: false,
      });
      expect(res1.totalNetWallSqFt).toBe(row.net);
      expect(res1.wallExactGallons).toBeCloseTo(row.coat1, 2);

      // 2 coats test with ceiling
      const res2 = calculatePaint({
        rooms: [{ id: '1', name: 'R', lengthFeet: row.l, widthFeet: row.w, heightFeet: 8, doorsCount: 1, windowsCount: 2, includeCeiling: true }],
        textureKey: 'smooth',
        coats: 2,
        ceilingCoats: 2,
        includePrimer: false,
      });
      expect(res2.wallContainers.displayLabel).toBe(row.wallBuy);
      expect(res2.ceilingContainers.displayLabel).toBe(row.ceilBuy);
    }
  });

  // Test vector 13: Default state on load produces: 2 gal, paint $90, total DIY $115, pro $370-$910
  it('vector 13: default state on load produces: 2 gal, paint $90, total DIY $115, pro $370-$910', () => {
    // 14x12, 8 ft ceiling, 1 door, 2 windows, ceiling OFF, 2 coats, Smooth (380), primer OFF, paint $45, primer $25, sundries $25
    const defaultInput: PaintCalculationInput = {
      rooms: [
        { id: '1', name: 'Main Room', lengthFeet: 14, widthFeet: 12, heightFeet: 8, doorsCount: 1, windowsCount: 2, includeCeiling: false },
      ],
      textureKey: 'smooth',
      coats: 2,
      includePrimer: false,
      wallPricePerGallon: 45,
      primerPricePerGallon: 25,
      sundriesCost: 25,
    };
    const res = calculatePaint(defaultInput);
    expect(res.wallContainers.displayLabel).toBe('2 Gallons');
    expect(res.wallPaintCost).toBe(90); // 2 * 45 = 90
    expect(res.sundriesCost).toBe(25);
    expect(res.totalDIYCost).toBe(115); // 90 + 25 = 115
    expect(res.proEstimateLow).toBe(370);
    expect(res.proEstimateHigh).toBe(910);
  });
});
