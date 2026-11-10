import { describe, it, expect } from 'vitest';
import { calcRafter, formatFtIn } from './rafter-engine';

describe('Rafter Calculator Spec Unit Tests (Section 6.8)', () => {
  // T1: gable, span 288", pitch 6, OH 12", ridge 1.5", 2x8 (7.25), 2x4 wall (3.5), 16 o.c., length 360"
  // Expected: totalLen 173.5748" (= 14' 5 9/16"), rise 72", angle 26.565°, buy 16 ft (192"), heel 1.75" (24.1% - no warning), rafters 46 (23/side)
  it('T1: standard gable 24 ft span, 6/12 pitch, 12 in overhang', () => {
    const res = calcRafter({
      roofType: 'gable',
      span: 288,
      pitchMode: 'pitch',
      pitch: 6,
      overhang: 12,
      ridgeThickness: 1.5,
      rafterDepth: 7.25,
      plateWidth: 3.5,
      spacing: 16,
      buildingLength: 360,
    });

    expect(res.ok).toBe(true);
    expect(res.totalLen).toBeCloseTo(173.575, 2);
    expect(formatFtIn(res.totalLen)).toBe("14' 5 9/16\"");
    expect(res.totalRise).toBeCloseTo(72.0, 2);
    expect(res.angleDeg).toBeCloseTo(26.565, 2);
    expect(res.buyLen).toBe(192); // 16 ft
    expect(res.heelDepth).toBeCloseTo(1.75, 2);
    expect(res.heelRatio).toBeCloseTo(0.241, 2);
    expect(res.warnings.length).toBe(0);
    expect(res.rafterCount).toEqual({ perSide: 23, total: 46 });
  });

  // T2: same, angle mode 26.56505° -> totalLen same as T1
  it('T2: same parameters in angle mode', () => {
    const res = calcRafter({
      roofType: 'gable',
      span: 288,
      pitchMode: 'angle',
      angleDeg: 26.565051,
      overhang: 12,
      ridgeThickness: 1.5,
      rafterDepth: 7.25,
      plateWidth: 3.5,
    });

    expect(res.ok).toBe(true);
    expect(res.totalLen).toBeCloseTo(173.575, 2);
  });

  // T3: same, rise & run mode, total rise 72" -> pitch = 6.00, totalLen same as T1
  it('T3: same parameters in rise & run mode', () => {
    const res = calcRafter({
      roofType: 'gable',
      span: 288,
      pitchMode: 'riseRun',
      totalRise: 72,
      overhang: 12,
      ridgeThickness: 1.5,
      rafterDepth: 7.25,
      plateWidth: 3.5,
    });

    expect(res.ok).toBe(true);
    expect(res.pitchPer12).toBeCloseTo(6.0, 2);
    expect(res.totalLen).toBeCloseTo(173.575, 2);
  });

  // T4: gable, span 24", pitch 4, OH 0, ridge 0 -> totalLen 12.649", angle 18.435°
  it('T4: small gable span 24 in, pitch 4, 0 OH, 0 ridge', () => {
    const res = calcRafter({
      roofType: 'gable',
      span: 24,
      pitchMode: 'pitch',
      pitch: 4,
      overhang: 0,
      ridgeThickness: 0,
    });

    expect(res.ok).toBe(true);
    // run = 12. k = sqrt(1 + (4/12)^2) = sqrt(1 + 1/9) = sqrt(10/9) = 1.05409255
    // 12 * 1.05409255 = 12.6491 in
    expect(res.totalLen).toBeCloseTo(12.649, 3);
    expect(res.angleDeg).toBeCloseTo(18.435, 3);
  });

  // T5: shed, span 144", pitch 4, OH 12" -> totalLen 164.438", rise 48"
  it('T5: shed roof span 144 in, pitch 4, 12 in OH', () => {
    const res = calcRafter({
      roofType: 'shed',
      span: 144,
      pitchMode: 'pitch',
      pitch: 4,
      overhang: 12,
    });

    expect(res.ok).toBe(true);
    // run = 144. effRun = 144. totalRun = 156. 156 * 1.05409255 = 164.438 in
    expect(res.totalLen).toBeCloseTo(164.438, 3);
    expect(res.totalRise).toBeCloseTo(48.0, 2);
  });

  // T6: span 0 / pitch 30 / overhang 200" on 288" span -> ok:false + error message
  it('T6: validation error checks', () => {
    const res1 = calcRafter({
      roofType: 'gable',
      span: 0,
      pitchMode: 'pitch',
      pitch: 6,
    });
    expect(res1.ok).toBe(false);
    expect(res1.errors).toContain('Span must be greater than 0.');

    const res2 = calcRafter({
      roofType: 'gable',
      span: 288,
      pitchMode: 'pitch',
      pitch: 30,
    });
    expect(res2.ok).toBe(false);
    expect(res2.errors).toContain('Pitch must be between 0 and 24 (rise per 12 in of run).');

    const res3 = calcRafter({
      roofType: 'gable',
      span: 288,
      pitchMode: 'pitch',
      pitch: 6,
      overhang: 200, // run is 144
    });
    expect(res3.ok).toBe(false);
    expect(res3.errors).toContain('Overhang is longer than the run — please check your values.');
  });

  // T7: gable, span 720", pitch 12 -> buyLen = null + 20 ft warning
  it('T7: large span warning for stock lumber exceeding 20 ft', () => {
    const res = calcRafter({
      roofType: 'gable',
      span: 720,
      pitchMode: 'pitch',
      pitch: 12,
    });

    expect(res.ok).toBe(true);
    expect(res.buyLen).toBeNull();
    expect(res.warnings.some((w) => w.includes('Longer than standard 20 ft lumber'))).toBe(true);
  });

  // T8: 2x6 rafter (5.5"), 2x4 wall (3.5"), 6/12 -> heel 32% -> 1/4 warning
  it('T8: birdsmouth deeper than 1/4 depth warning', () => {
    const res = calcRafter({
      roofType: 'gable',
      span: 288,
      pitchMode: 'pitch',
      pitch: 6,
      rafterDepth: 5.5,
      plateWidth: 3.5,
    });

    expect(res.ok).toBe(true);
    // heel = 3.5 * 0.5 = 1.75. 1.75 / 5.5 = 0.31818 (31.8%)
    expect(res.warnings.some((w) => w.includes('deeper than 1/4'))).toBe(true);
  });

  // T9: 2x8 rafter (7.25"), 2x6 wall (5.5"), 6/12 -> heel 37.9% -> 1/3 warning
  it('T9: birdsmouth removes more than 1/3 depth warning', () => {
    const res = calcRafter({
      roofType: 'gable',
      span: 288,
      pitchMode: 'pitch',
      pitch: 6,
      rafterDepth: 7.25,
      plateWidth: 5.5,
    });

    expect(res.ok).toBe(true);
    // heel = 5.5 * 0.5 = 2.75. 2.75 / 7.25 = 0.3793 (37.9%)
    expect(res.warnings.some((w) => w.includes('more than 1/3'))).toBe(true);
  });

  // T10: 2x6 rafter (5.5"), 2x6 wall (5.5"), 12/12 -> as deep as the rafter warning
  it('T10: birdsmouth as deep as the rafter warning', () => {
    const res = calcRafter({
      roofType: 'gable',
      span: 288,
      pitchMode: 'pitch',
      pitch: 12,
      rafterDepth: 5.5,
      plateWidth: 5.5,
    });

    expect(res.ok).toBe(true);
    // heel = 5.5 * 1 = 5.5. 5.5 / 5.5 = 1.0 (100%)
    expect(res.warnings.some((w) => w.includes('as deep as the rafter'))).toBe(true);
  });

  // T11: formatFtIn(11.99) / (12) / (6.5) -> "1' 0\"" / "1' 0\"" / "0' 6 1/2\""
  it('T11: formatFtIn precision and rounding checks', () => {
    expect(formatFtIn(11.99)).toBe("1' 0\"");
    expect(formatFtIn(12)).toBe("1' 0\"");
    expect(formatFtIn(6.5)).toBe("0' 6 1/2\"");
  });
});

