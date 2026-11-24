import { describe, it, expect } from 'vitest';
import {
  calculateTankVolume,
  generateDipstickChart,
  solveTankSize,
} from './tank-engine';

describe('tank-engine', () => {
  it('calculates horizontal cylinder 6 ft x 12 ft flat ends (full 2,538.1 gal, at 2 ft 740.6 gal)', () => {
    // Full
    const full = calculateTankVolume({
      shape: 'horizontal-cylinder',
      diameter: 6,
      length: 12,
      headType: 'flat',
    });
    expect(full.totalUsGal).toBeCloseTo(2538.1, 1);

    // At 2 ft depth
    const partial = calculateTankVolume(
      {
        shape: 'horizontal-cylinder',
        diameter: 6,
        length: 12,
        headType: 'flat',
      },
      2
    );
    expect(partial.filledUsGal).toBeCloseTo(740.6, 1);
    expect(partial.percentFull).toBeCloseTo(29.18, 1);
    expect(partial.ullageFt).toBe(4);
  });

  it('calculates horizontal tank 10 ft diameter at 3 ft depth as 25.2% full', () => {
    const res = calculateTankVolume(
      {
        shape: 'horizontal-cylinder',
        diameter: 10,
        length: 20,
        headType: 'flat',
      },
      3
    );
    expect(res.percentFull).toBeCloseTo(25.2, 1);
  });

  it('calculates vertical cylinder 4 ft x 6 ft as 564.0 US gal', () => {
    const res = calculateTankVolume({
      shape: 'vertical-cylinder',
      diameter: 4,
      height: 6,
    });
    expect(res.totalUsGal).toBeCloseTo(564.0, 1);
  });

  it('calculates horizontal cylinder 4 ft x 10 ft (full 940.0 gal, at 1 ft 183.8 gal)', () => {
    const full = calculateTankVolume({
      shape: 'horizontal-cylinder',
      diameter: 4,
      length: 10,
      headType: 'flat',
    });
    expect(full.totalUsGal).toBeCloseTo(940.0, 1);

    const partial = calculateTankVolume(
      {
        shape: 'horizontal-cylinder',
        diameter: 4,
        length: 10,
        headType: 'flat',
      },
      1
    );
    expect(partial.filledUsGal).toBeCloseTo(183.8, 1);
  });

  it('handles hemispherical heads on horizontal tanks', () => {
    const res = calculateTankVolume({
      shape: 'horizontal-cylinder',
      diameter: 6,
      length: 12,
      headType: 'hemispherical',
    });
    // Hemisphere heads add 1 full sphere of diameter 6 (r=3) = (4/3)*pi*27 = 113.097 cu ft = 846.0 gal
    // Total = 2538.1 + 846.0 = 3384.1 gal
    expect(res.totalUsGal).toBeGreaterThan(2538.1);
    expect(res.totalUsGal).toBeCloseTo(3384.1, 0);
  });

  it('handles ASME 2:1 elliptical heads on horizontal tanks', () => {
    const res = calculateTankVolume({
      shape: 'horizontal-cylinder',
      diameter: 6,
      length: 12,
      headType: 'elliptical-2-1',
    });
    // Elliptical heads add half a sphere volume = 423.0 gal -> 2961.1 gal
    expect(res.totalUsGal).toBeCloseTo(2961.1, 0);
  });

  it('calculates cone-bottom tanks accurately', () => {
    const res = calculateTankVolume(
      {
        shape: 'cone-bottom',
        diameter: 6,
        height: 10, // cylinder height
        coneHeight: 3, // cone height
      },
      2 // depth inside cone
    );
    expect(res.filledUsGal).toBeGreaterThan(0);
    expect(res.percentFull).toBeLessThan(20);
  });

  it('generates a monotonic dipstick strapping table', () => {
    const chart = generateDipstickChart(
      {
        shape: 'horizontal-cylinder',
        diameter: 6,
        length: 12,
        headType: 'flat',
      },
      6 // 6-inch increments
    );
    expect(chart.length).toBe(13); // 0 to 72 inches in 6" steps
    expect(chart[0].gallons).toBe(0);
    expect(chart[chart.length - 1].gallons).toBeCloseTo(2538.1, 1);

    // Verify monotonic increasing
    for (let i = 0; i < chart.length - 1; i++) {
      expect(chart[i + 1].gallons).toBeGreaterThanOrEqual(chart[i].gallons);
      expect(chart[i + 1].percentFull).toBeGreaterThanOrEqual(chart[i].percentFull);
    }
  });

  it('solves required tank length from target volume', () => {
    // 500 gallons in a 4 ft diameter cylinder
    const solved = solveTankSize(500, 4);
    expect(solved.requiredLengthFt).toBeCloseTo(5.318, 2);
  });
});

describe('fill depth limits per shape (review 2026-11-24)', () => {
  it('a vertical tank fills to its height, not its diameter', () => {
    const r = calculateTankVolume({ shape: 'vertical-cylinder', diameter: 4, height: 6 }, 5);
    expect(r.filledUsGal).toBeCloseTo(470.0, 1); // π·2²·5 ft³ × 1728/231
    expect(r.percentFull).toBeCloseTo(83.33, 2);
    expect(r.ullageFt).toBeCloseTo(1, 10);
  });
  it('a cone-bottom tank fills to cylinder height + cone height', () => {
    const dims = { shape: 'cone-bottom' as const, diameter: 4, height: 6, coneHeight: 2 };
    const full = calculateTankVolume(dims);
    const at7 = calculateTankVolume(dims, 7);
    expect(at7.depthFt).toBe(7);
    expect(at7.percentFull).toBeLessThan(100);
    expect(calculateTankVolume(dims, 8).filledUsGal).toBeCloseTo(full.totalUsGal, 8);
  });
  it('uses the exact 1728/231 gallon factor', () => {
    expect(calculateTankVolume({ shape: 'rectangle', length: 1, width: 1, height: 1 }).totalUsGal).toBe(1728 / 231);
  });
});
