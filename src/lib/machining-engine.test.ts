import { describe, it, expect } from 'vitest';
import {
  rpmFromSfm,
  sfmFromRpm,
  diaFromSfmRpm,
  rpmFromVc,
  vcFromRpm,
  feedRate,
  chipLoadFromFeed,
  chipThinningFactor,
  materialRemovalRate,
  drillFeed,
  tapFeed,
  lineSpeed,
  scaleToLimits,
} from './machining-engine';

describe('machining-engine', () => {
  describe('Spec 03 Worked Example (Speeds & Feeds)', () => {
    it('matches 0.5 in, 3 flutes, 600 SFM -> 4,584 RPM and 27.50 IPM at 0.002 in/tooth', () => {
      // 0.5 in, 3 flutes, 600 SFM
      const rpm = rpmFromSfm(600, 0.5);
      expect(rpm).not.toBeNull();
      expect(Math.round(rpm!)).toBe(4584);
      expect(rpm!).toBeCloseTo(4583.66, 1);

      // At 0.002 in/tooth chip load:
      const feed = feedRate(rpm!, 3, 0.002);
      expect(feed).not.toBeNull();
      expect(feed!).toBeCloseTo(27.50, 2);

      // And reverse calculation:
      const cl = chipLoadFromFeed(feed!, rpm!, 3);
      expect(cl).not.toBeNull();
      expect(cl!).toBeCloseTo(0.002, 4);
    });
  });

  describe('Spec 04 Worked Examples (SFM to RPM)', () => {
    it('matches 1 in at 1,000 RPM -> 261.8 SFM', () => {
      const sfm = sfmFromRpm(1000, 1.0);
      expect(sfm).not.toBeNull();
      expect(sfm!).toBeCloseTo(261.8, 1);
    });

    it('matches 0.5 in at 300 SFM -> 2,292 RPM', () => {
      const rpm = rpmFromSfm(300, 0.5);
      expect(rpm).not.toBeNull();
      expect(Math.round(rpm!)).toBe(2292);
      expect(rpm!).toBeCloseTo(2291.83, 1);
    });

    it('round-trips 3-way solve between SFM, RPM, and Diameter', () => {
      const sfm = 400;
      const dia = 0.75;
      const rpm = rpmFromSfm(sfm, dia)!;
      const calcDia = diaFromSfmRpm(sfm, rpm)!;
      const calcSfm = sfmFromRpm(rpm, dia)!;

      expect(calcDia).toBeCloseTo(dia, 4);
      expect(calcSfm).toBeCloseTo(sfm, 4);
    });
  });

  describe('Metric cutting speed (Vc) and RPM', () => {
    it('calculates RPM from Vc (m/min) and diameter (mm)', () => {
      // 100 m/min with 10 mm cutter: RPM = (1000 * 100) / (pi * 10) = 3183.1
      const rpm = rpmFromVc(100, 10);
      expect(rpm).not.toBeNull();
      expect(rpm!).toBeCloseTo(3183.1, 1);

      const vc = vcFromRpm(rpm!, 10);
      expect(vc).not.toBeNull();
      expect(vc!).toBeCloseTo(100, 2);
    });
  });

  describe('Chip thinning, MRR, Drilling, Tapping', () => {
    it('calculates radial chip thinning when WOC < D/2', () => {
      // D = 0.5 in. If WOC = 0.05 in (10% stepover, which is < 0.25):
      // D / (2 * sqrt(D * WOC - WOC^2)) = 0.5 / (2 * sqrt(0.5*0.05 - 0.0025))
      // = 0.5 / (2 * sqrt(0.0225)) = 0.5 / (2 * 0.15) = 0.5 / 0.3 = 1.6667
      const factor = chipThinningFactor(0.05, 0.5);
      expect(factor).toBeCloseTo(1.6667, 3);
    });

    it('returns factor 1 when WOC >= D/2', () => {
      expect(chipThinningFactor(0.25, 0.5)).toBe(1);
      expect(chipThinningFactor(0.4, 0.5)).toBe(1);
    });

    it('calculates MRR correctly', () => {
      // 0.25 in WOC, 0.5 in DOC, 30 IPM feed -> 0.25 * 0.5 * 30 = 3.75 in³/min
      expect(materialRemovalRate(0.25, 0.5, 30)).toBe(3.75);
    });

    it('calculates drilling feed', () => {
      // 2000 RPM, 0.004 IPR -> 8 IPM
      expect(drillFeed(2000, 0.004)).toBe(8);
    });

    it('calculates tapping feed for pitch and TPI', () => {
      // 1/4-20 UNC: 500 RPM, 20 TPI -> 500 * (1/20) = 25 IPM
      expect(tapFeed(500, 20, true)).toBe(25);
      // M6x1.0: 600 RPM, 1.0 mm pitch -> 600 mm/min
      expect(tapFeed(600, 1.0, false)).toBe(600);
    });
  });

  describe('Spec 07 Belt line speed and Pulley speed', () => {
    it('matches 2 in driver at 1,725 RPM -> belt speed 903.2 ft/min', () => {
      // Belt speed = pi * 2 * 1725 / 12 = 903.2078... ft/min
      const res = lineSpeed(1725, 2.0);
      expect(res).not.toBeNull();
      expect(res!.ftPerMin).toBeCloseTo(903.2, 1);
    });
  });

  describe('Machine limits scaling', () => {
    it('caps RPM and recalculates chip load', () => {
      // Target: 4584 RPM, 27.5 IPM on 3 flutes (chip load 0.002)
      // Cap max RPM at 3000
      const scaled = scaleToLimits(4584, 27.5, 3, 0.5, { maxRpm: 3000 });
      expect(scaled.isRpmCapped).toBe(true);
      expect(scaled.actualRpm).toBe(3000);
      // Feed is scaled with RPM so each tooth keeps the target chip load (no silent overload):
      // target chip load = 27.5 / (4584 × 3) ≈ 0.0020 ; feed = 3000 × 3 × 0.0020 ≈ 18.0 IPM
      expect(scaled.actualChipLoad).toBeCloseTo(27.5 / (4584 * 3), 6);
      expect(scaled.actualFeedIpm).toBeCloseTo(3000 * 3 * (27.5 / (4584 * 3)), 6);
      expect(scaled.actualSfm).toBeCloseTo((Math.PI * 0.5 * 3000) / 12, 4);
      expect(scaled.warnings.length).toBeGreaterThan(0);
    });

    it('caps feed after RPM scaling and warns when the chip gets too thin', () => {
      // Feed needed 27.5 IPM, machine max feed 10 IPM -> chip load drops below half the target
      const scaled = scaleToLimits(4584, 27.5, 3, 0.5, { maxFeedIpm: 10 });
      expect(scaled.isFeedCapped).toBe(true);
      expect(scaled.actualFeedIpm).toBe(10);
      expect(scaled.actualChipLoad).toBeCloseTo(10 / (4584 * 3), 6);
      expect(scaled.warnings.some((w) => w.includes('less than half your target'))).toBe(true);
    });

    it('raises feed with RPM when below the machine minimum', () => {
      const scaled = scaleToLimits(4584, 27.5, 3, 0.5, { minRpm: 8000 });
      expect(scaled.actualRpm).toBe(8000);
      expect(scaled.actualChipLoad).toBeCloseTo(27.5 / (4584 * 3), 6);
      expect(scaled.actualFeedIpm).toBeCloseTo(8000 * 3 * (27.5 / (4584 * 3)), 6);
    });
  });
});
