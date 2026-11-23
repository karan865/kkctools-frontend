import { describe, it, expect } from 'vitest';
import {
  convertVolume,
  calculateBoxVolume,
  calculateCylinderVolume,
  calculateHorizontalTankFilledVolume,
  calculateWaterWeight,
  US_GAL_PER_FT3,
  FT3_PER_US_GAL,
} from './volume-units-engine';

describe('volume-units-engine', () => {
  describe('Spec 05 worked examples (NIST exact conversions)', () => {
    it('1 ft³ = 7.48052 US gal', () => {
      const gal = convertVolume(1, 'ft3', 'us_gal');
      expect(parseFloat(gal.toFixed(5))).toBe(7.48052);
      expect(parseFloat(US_GAL_PER_FT3.toFixed(5))).toBe(7.48052);
    });

    it('1 US gal = 0.133681 ft³', () => {
      const ft3 = convertVolume(1, 'us_gal', 'ft3');
      expect(parseFloat(ft3.toFixed(6))).toBe(0.133681);
      expect(parseFloat(FT3_PER_US_GAL.toFixed(6))).toBe(0.133681);
    });

    it('100 US gal = 13.3681 ft³ = 0.378541 m³ = 378.541 L', () => {
      const ft3 = convertVolume(100, 'us_gal', 'ft3');
      const m3 = convertVolume(100, 'us_gal', 'm3');
      const l = convertVolume(100, 'us_gal', 'litres');

      expect(parseFloat(ft3.toFixed(4))).toBe(13.3681);
      expect(parseFloat(m3.toFixed(6))).toBe(0.378541);
      expect(parseFloat(l.toFixed(3))).toBe(378.541);
    });

    it('5 US gal = 0.668403 ft³', () => {
      const ft3 = convertVolume(5, 'us_gal', 'ft3');
      expect(parseFloat(ft3.toFixed(6))).toBe(0.668403);
    });

    it('Box 4 × 2 × 2 ft = 16 ft³ = 119.69 US gal', () => {
      const gal = calculateBoxVolume(4, 2, 2, 'ft', 'us_gal');
      expect(parseFloat(gal.toFixed(2))).toBe(119.69);
    });
  });

  describe('Spec 16 tank geometry', () => {
    it('Tank 6 ft diameter × 12 ft length horizontal cylinder = 2,538.1 gal', () => {
      // Cylindrical tank: π * (3)² * 12 = 108 * π ft³ ≈ 339.292 ft³
      // 339.292 * 7.480519 ≈ 2538.08 gal
      const tank = calculateHorizontalTankFilledVolume(6, 12, 6, 'ft', 'us_gal');
      expect(parseFloat(tank.totalVolume.toFixed(1))).toBe(2538.1);
      expect(parseFloat(tank.filledVolume.toFixed(1))).toBe(2538.1);
      expect(tank.filledPercentage).toBe(100);
    });

    it('calculates half-filled tank accurately', () => {
      // When filled to depth = radius (3 ft), filled volume should be exactly 50%
      const halfTank = calculateHorizontalTankFilledVolume(6, 12, 3, 'ft', 'us_gal');
      expect(Math.round(halfTank.filledPercentage)).toBe(50);
      expect(parseFloat((halfTank.totalVolume / 2).toFixed(1))).toBe(parseFloat(halfTank.filledVolume.toFixed(1)));
    });
  });

  describe('Water weight', () => {
    it('100 US gallons of water weighs ~834 lb', () => {
      const weightLb = calculateWaterWeight(100, 'us_gal', 'lb');
      expect(Math.round(weightLb)).toBe(834);
    });
  });
});
