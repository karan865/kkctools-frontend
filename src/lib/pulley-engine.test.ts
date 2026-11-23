import { describe, it, expect } from 'vitest';
import {
  solvePulley,
  calculateBeltLength,
  centreDistancefromBeltLength,
  calculateMultiStage,
  wheelRpmToSpeed,
} from './pulley-engine';

describe('pulley-engine', () => {
  it('solves worked example from build spec: 2 in driver at 1725 RPM, 4 in driven', () => {
    // 2 in driver at 1,725 RPM -> 4 in driven = 862.5 RPM (2:1 reduction)
    // Belt speed 903.2 ft/min
    // Open belt at 20 in centre: 49.47 in
    // Small pulley wrap ~ 174.3 deg
    const res = solvePulley(2, 4, 1725, 0, 'drivenRpm');
    expect(res).not.toBeNull();
    expect(res?.drivenRpm).toBe(862.5);
    expect(res?.diameterRatio).toBe(2);
    expect(res?.isReduction).toBe(true);
    expect(res?.beltSpeedFtPerMin).toBeCloseTo(903.208, 2);

    const geo = calculateBeltLength(2, 4, 20);
    expect(geo).not.toBeNull();
    expect(geo?.openLength).toBeCloseTo(49.475, 2);
    expect(geo?.driverWrapDeg).toBeCloseTo(174.27, 1);
  });

  it('proves belt speed depends strictly on driver, not driven diameter', () => {
    // Firgelli mistake check: changing driven pulley from 4 in to 8 in does NOT change belt speed
    const res1 = solvePulley(2, 4, 1725, 0, 'drivenRpm');
    const res2 = solvePulley(2, 8, 1725, 0, 'drivenRpm');
    expect(res1?.beltSpeedFtPerMin).toBe(res2?.beltSpeedFtPerMin);
  });

  it('round-trips 4-way solve', () => {
    const s1 = solvePulley(3, 6, 1200, 0, 'drivenRpm');
    expect(s1?.drivenRpm).toBe(600);

    const s2 = solvePulley(3, 6, 0, 600, 'driverRpm');
    expect(s2?.driverRpm).toBe(1200);

    const s3 = solvePulley(3, 0, 1200, 600, 'drivenDia');
    expect(s3?.drivenDia).toBe(6);

    const s4 = solvePulley(0, 6, 1200, 600, 'driverDia');
    expect(s4?.driverDia).toBe(3);
  });

  it('calculates belt length and round-trips centre distance', () => {
    const d1 = 3;
    const d2 = 6;
    const c = 18;
    const geo = calculateBeltLength(d1, d2, c);
    expect(geo).not.toBeNull();
    if (!geo) return;

    const roundTripC = centreDistancefromBeltLength(d1, d2, geo.openLength);
    expect(roundTripC).not.toBeNull();
    expect(roundTripC).toBeCloseTo(c, 4);
  });

  it('returns null when centre distance causes collision or belt is too short', () => {
    expect(calculateBeltLength(4, 4, 3)).toBeNull(); // min C is 4, 3 collides
    expect(centreDistancefromBeltLength(4, 4, 10)).toBeNull(); // too short for 4+4
  });

  it('computes 2-stage multi-stage drive ratios correctly', () => {
    // Stage 1: 2" -> 4" (2:1 reduction)
    // Stage 2: 3" -> 6" (2:1 reduction)
    // Total reduction: 4:1
    // Motor 1800 RPM -> Stage 1 shaft 900 RPM -> Stage 2 final 450 RPM
    const multi = calculateMultiStage(1800, [
      { driverDia: 2, drivenDia: 4 },
      { driverDia: 3, drivenDia: 6 },
    ]);
    expect(multi).not.toBeNull();
    expect(multi?.totalRatio).toBe(4);
    expect(multi?.finalRpm).toBe(450);
    expect(multi?.shaftRpms).toEqual([1800, 900, 450]);
  });

  it('converts wheel RPM to mph accurately', () => {
    // 26" bicycle wheel at 200 RPM:
    // circumference = 26 * pi = 81.681 in
    // 200 rev/min * 60 min/hr * 81.681 in / 63360 in/mile = 15.4697 mph
    const wheel = wheelRpmToSpeed(26, 200);
    expect(wheel).not.toBeNull();
    expect(wheel?.mph).toBeCloseTo(15.47, 2);
    expect(wheel?.kmh).toBeCloseTo(24.90, 2);
  });
});
