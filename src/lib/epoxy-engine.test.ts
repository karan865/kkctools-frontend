import { describe, it, expect } from 'vitest';
import {
  rectVolumeIn3,
  circleVolumeIn3,
  cylinderVolumeIn3,
  boxVolumeIn3,
  averageWidth,
  riverVolumeIn3,
  riverSegmentsVolumeIn3,
  applyAllowances,
  in3ToVolumes,
  mixSplit,
  pourPlan,
  kitPlan,
  IN3_PER_US_GAL,
  IN3_PER_FL_OZ,
  ML_PER_IN3,
} from './epoxy-engine';

describe('epoxy-engine', () => {
  describe('Unit conversions and constants', () => {
    it('uses exact constants per spec', () => {
      expect(IN3_PER_US_GAL).toBe(231);
      expect(IN3_PER_FL_OZ).toBe(1.8046875);
      expect(ML_PER_IN3).toBe(16.387064);
    });

    it('converts in3 to all units correctly', () => {
      const vol = in3ToVolumes(231);
      expect(vol.usGal).toBeCloseTo(1, 4);
      expect(vol.flOz).toBeCloseTo(231 / 1.804688, 2);
      expect(vol.ml).toBeCloseTo(231 * 16.387064, 2);
      expect(vol.liters).toBeCloseTo((231 * 16.387064) / 1000, 3);
    });
  });

  describe('Shape volume calculations', () => {
    it('calculates rectangle volume', () => {
      expect(rectVolumeIn3(48, 24, 0.125)).toBe(144);
    });

    it('calculates circle / cylinder volume', () => {
      // Circle diameter 12, thickness 1 -> radius 6 -> pi * 36 = 113.097
      expect(circleVolumeIn3(12, 1)).toBeCloseTo(Math.PI * 36, 4);
      expect(cylinderVolumeIn3(12, 1)).toBeCloseTo(Math.PI * 36, 4);
    });

    it('calculates box volume', () => {
      expect(boxVolumeIn3(10, 10, 5)).toBe(500);
    });

    it('handles negative or 0 inputs gracefully with 0', () => {
      expect(rectVolumeIn3(-5, 10, 1)).toBe(0);
      expect(circleVolumeIn3(0, 5)).toBe(0);
    });
  });

  describe('River and average width calculations', () => {
    it('calculates average width', () => {
      expect(averageWidth([6, 8, 10])).toBe(8);
      expect(averageWidth([])).toBeNull();
    });

    it('Blacktail case from spec: 432 / 35 = 12.34', () => {
      // 35 readings summing to 432
      const readings = Array(35).fill(432 / 35);
      const avg = averageWidth(readings);
      expect(avg).not.toBeNull();
      expect(avg!).toBeCloseTo(12.34, 2);
    });

    it('calculates river volume', () => {
      expect(riverVolumeIn3(48, 6, 1)).toBe(288);
    });

    it('calculates segmented river volume', () => {
      const segments = [
        { lengthIn: 24, widthsIn: [5, 7], depthIn: 1 }, // avg 6 -> 24*6*1 = 144
        { lengthIn: 24, widthsIn: [6, 10], depthIn: 2 }, // avg 8 -> 24*8*2 = 384
      ];
      expect(riverSegmentsVolumeIn3(segments)).toBe(528);
    });
  });

  describe('Spec 01 Worked Example (Epoxy Resin Calculator)', () => {
    it('matches 48 x 24 in at 1/8 in with 10% waste and 1:1 split', () => {
      // Spec:
      // 48 x 24 in at 1/8 in = 144 in³ = 0.623 US gal = 79.79 fl oz.
      // With 10% waste: 87.77 fl oz (2,596 mL).
      // 1:1 split -> about 43.9 fl oz each.
      const baseIn3 = rectVolumeIn3(48, 24, 0.125);
      expect(baseIn3).toBe(144);

      const baseVol = in3ToVolumes(baseIn3);
      expect(baseVol.usGal).toBeCloseTo(0.623, 3);
      expect(baseVol.flOz).toBeCloseTo(79.79, 2);

      const allowances = applyAllowances(baseIn3, 0, 10);
      expect(allowances.totalIn3).toBeCloseTo(158.4, 1);

      const totalVol = in3ToVolumes(allowances.totalIn3);
      expect(totalVol.flOz).toBeCloseTo(87.77, 2);
      expect(totalVol.ml).toBeCloseTo(2596, 0);

      const split = mixSplit(allowances.totalIn3, 1, 1);
      expect(split.volumeA.flOz).toBeCloseTo(43.89, 1);
      expect(split.volumeB.flOz).toBeCloseTo(43.89, 1);
    });
  });

  describe('Spec 05 Worked Example (Epoxy River Table Calculator)', () => {
    it('matches River 48 x 6 x 1 in + flood coat 48 x 24 x 1/8 in with 10% waste', () => {
      // Spec:
      // River: 48 x 6 x 1 = 288 in³
      // Flood: 48 x 24 x 1/8 = 144 in³
      // Total with 10% waste: 475.2 in³ = 2.057 US gal = 7.79 L
      // River 1 in at 0.5 in max layer -> 2 pours
      const river = riverVolumeIn3(48, 6, 1);
      expect(river).toBe(288);

      const flood = rectVolumeIn3(48, 24, 0.125);
      expect(flood).toBe(144);

      const totalBase = river + flood;
      expect(totalBase).toBe(432);

      const allowances = applyAllowances(totalBase, 0, 10);
      expect(allowances.totalIn3).toBeCloseTo(475.2, 1);

      const totalVol = in3ToVolumes(allowances.totalIn3);
      expect(totalVol.usGal).toBeCloseTo(2.057, 3);
      expect(totalVol.liters).toBeCloseTo(7.79, 2);

      // Pours for 1 in depth with 0.5 in max layer
      const plan = pourPlan(1, 0.5, river);
      expect(plan).not.toBeNull();
      expect(plan!.poursCount).toBe(2);
      expect(plan!.depthPerPourInches).toBe(0.5);
    });
  });

  describe('Pour plan and Kit plan', () => {
    it('returns null for non-positive depths', () => {
      expect(pourPlan(0, 0.5)).toBeNull();
      expect(pourPlan(1, -0.5)).toBeNull();
    });

    it('calculates kit plan with minimal waste', () => {
      const plan = kitPlan(150); // Need 150 in³
      expect(plan.totalVolumeIn3).toBeGreaterThanOrEqual(150);
      expect(plan.leftoverIn3).toBeGreaterThanOrEqual(0);
    });
  });
});
