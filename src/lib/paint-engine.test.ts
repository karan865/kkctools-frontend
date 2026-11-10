import { describe, it, expect } from 'vitest';
import { calculatePaint, SURFACE_TEXTURES } from './paint-engine';

describe('Paint Calculator Engine', () => {
  it('calculates paint volume for standard 12x12 room accurately', () => {
    // 12x12 room, 8 ft ceiling, 1 door (21 sq ft), 2 windows (30 sq ft), 2 coats, smooth drywall (380 sq ft/gal)
    const result = calculatePaint({
      mode: 'room',
      roomLengthFeet: 12,
      roomWidthFeet: 12,
      ceilingHeightFeet: 8,
      doorsCount: 1,
      windowsCount: 2,
      texturePresetId: 'smooth',
      coats: 2,
      includeCeiling: false,
    });

    // Perimeter = 2 * (12 + 12) = 48 ft
    expect(result.perimeterFeet).toBe(48);
    // Gross Wall Area = 48 * 8 = 384 sq ft
    expect(result.grossWallAreaSqFt).toBe(384);
    // Openings = 21 + 30 = 51 sq ft
    expect(result.openingsDeductionSqFt).toBe(51);
    // Net Wall Area = 384 - 51 = 333 sq ft
    expect(result.netWallAreaSqFt).toBe(333);
    // Total Coat Area = 333 * 2 = 666 sq ft
    expect(result.totalCoatAreaSqFt).toBe(666);
    // Exact Gallons = 666 / 380 ≈ 1.75 gallons
    expect(result.exactPaintGallons).toBeCloseTo(1.75, 1);
    // Recommended to buy: ceil(1.75) = 2 gallons
    expect(result.recommendedGallons).toBe(2);
  });

  it('correctly adds ceiling surface area when toggled', () => {
    const withoutCeiling = calculatePaint({
      mode: 'room',
      roomLengthFeet: 10,
      roomWidthFeet: 10,
      ceilingHeightFeet: 8,
      includeCeiling: false,
      texturePresetId: 'smooth',
      coats: 1,
    });

    const withCeiling = calculatePaint({
      mode: 'room',
      roomLengthFeet: 10,
      roomWidthFeet: 10,
      ceilingHeightFeet: 8,
      includeCeiling: true,
      texturePresetId: 'smooth',
      coats: 1,
    });

    // Ceiling area = 10 * 10 = 100 sq ft
    expect(withCeiling.ceilingAreaSqFt).toBe(100);
    expect(withCeiling.singleCoatAreaSqFt).toBe(withoutCeiling.singleCoatAreaSqFt + 100);
  });

  it('handles direct square footage mode', () => {
    const result = calculatePaint({
      mode: 'direct',
      directWallAreaSqFt: 500,
      texturePresetId: 'smooth',
      coats: 2,
    });

    expect(result.netWallAreaSqFt).toBe(500);
    // Total area for 2 coats = 1,000 sq ft
    expect(result.totalCoatAreaSqFt).toBe(1000);
    // 1000 / 380 ≈ 2.63 gal -> 3 gallons
    expect(result.recommendedGallons).toBe(3);
  });

  it('adjusts coverage rate based on surface texture presets', () => {
    const smooth = calculatePaint({
      mode: 'direct',
      directWallAreaSqFt: 1000,
      texturePresetId: 'smooth', // 380 sq ft/gal
      coats: 1,
    });

    const porous = calculatePaint({
      mode: 'direct',
      directWallAreaSqFt: 1000,
      texturePresetId: 'porous', // 250 sq ft/gal
      coats: 1,
    });

    expect(smooth.exactPaintGallons).toBeCloseTo(1000 / 380, 2);
    expect(porous.exactPaintGallons).toBeCloseTo(1000 / 250, 2);
    expect(porous.exactPaintGallons).toBeGreaterThan(smooth.exactPaintGallons);
  });

  it('calculates separate primer gallons when enabled', () => {
    const result = calculatePaint({
      mode: 'direct',
      directWallAreaSqFt: 600,
      texturePresetId: 'smooth',
      coats: 2,
      includePrimer: true,
      pricePerPrimerGallon: 25,
    });

    // 1 coat of primer over 600 sq ft @ 300 sq ft/gal = 2 gallons
    expect(result.exactPrimerGallons).toBe(2.0);
    expect(result.recommendedPrimerGallons).toBe(2);
    expect(result.primerCost).toBe(50.0);
  });

  it('computes total DIY material cost and contractor comparison benchmarks', () => {
    const result = calculatePaint({
      mode: 'direct',
      directWallAreaSqFt: 400,
      texturePresetId: 'smooth',
      coats: 2,
      pricePerGallon: 45,
      suppliesCost: 30,
    });

    // 400 * 2 = 800 sq ft. 800 / 380 ≈ 2.11 -> 3 gallons
    expect(result.recommendedGallons).toBe(3);
    expect(result.paintCost).toBe(135.0); // 3 * 45
    expect(result.totalDiyCost).toBe(165.0); // 135 + 30
    // Pro estimate for 400 sq ft ($1.50 - $3.00/sq ft)
    expect(result.proEstimatedCostLow).toBe(600);
    expect(result.proEstimatedCostHigh).toBe(1200);
  });
});

