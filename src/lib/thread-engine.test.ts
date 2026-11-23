import { describe, it, expect } from 'vitest';
import {
  calculateThreadDimensions,
  calculateTapDrill,
  calculateThreeWire,
  convertPitchTpi,
} from './thread-engine';

describe('thread-engine', () => {
  it('solves M10×1.5 worked example from build spec', () => {
    // M10×1.5 external: d2 = 9.026 mm, d3 = 8.160 mm
    // M10×1.5 internal: D1 = 8.376 mm
    const res = calculateThreadDimensions(10, 1.5, false, 'metric');
    expect(res).not.toBeNull();
    expect(res?.external.pitchDia).toBeCloseTo(9.0257, 3); // 9.026 mm
    expect(res?.external.minorDiaIso).toBeCloseTo(8.1597, 3); // 8.160 mm
    expect(res?.internal.minorDia).toBeCloseTo(8.3762, 3); // 8.376 mm
  });

  it('calculates tap drill at 75% for M10×1.5: 8.539 mm -> nearest 8.5 mm', () => {
    const tap = calculateTapDrill(10, 1.5, 75, false);
    expect(tap).not.toBeNull();
    expect(tap?.idealDrillSize).toBeCloseTo(8.5386, 3); // 8.539 mm
    expect(tap?.nearestStandardDrill).toBe(8.5);
    expect(tap?.resultingPercentThread).toBeCloseTo(76.98, 1);
  });

  it('calculates three-wire method for M10×1.5: best wire 0.866 mm, M = 9.350 mm', () => {
    const d2 = 9.02572;
    const wire = calculateThreeWire(d2, 1.5);
    expect(wire).not.toBeNull();
    expect(wire?.bestWireDia).toBeCloseTo(0.866, 3);
    expect(wire?.measurementOverWires).toBeCloseTo(9.350, 3);

    // Round-trip from M back to d2
    const rev = calculateThreeWire(0, 1.5, wire?.bestWireDia, wire?.measurementOverWires);
    expect(rev?.computedPitchDiaFromM).toBeCloseTo(d2, 3);
  });

  it('solves 1/4-20 UNC worked example: d2 = 0.2175 in', () => {
    // 1/4" = 0.25", 20 TPI
    const res = calculateThreadDimensions(0.25, 20, true, 'unified');
    expect(res).not.toBeNull();
    expect(res?.external.pitchDia).toBeCloseTo(0.2175, 4);
  });

  it('calculates Acme 29° basic pitch diameter: d2 = d - 0.5 * P', () => {
    // 1"-5 Acme: d = 1.0, P = 0.2 in -> d2 = 1.0 - 0.1 = 0.9 in
    const acme = calculateThreadDimensions(1.0, 5, true, 'acme');
    expect(acme).not.toBeNull();
    expect(acme?.external.pitchDia).toBe(0.9);
  });

  it('trapezoidal minor diameter uses the pitch-dependent crest clearance', () => {
    // Tr8×2: a_c 0.25 -> d3 = 8 − (2 + 0.5) = 5.5 ; Tr40×7: a_c 0.5 -> d3 = 40 − (7 + 1) = 32
    expect(calculateThreadDimensions(8, 2, false, 'trapezoidal')?.external.minorDiaIso).toBeCloseTo(5.5, 6);
    expect(calculateThreadDimensions(40, 7, false, 'trapezoidal')?.external.minorDiaIso).toBeCloseTo(32, 6);
    expect(calculateThreadDimensions(20, 4, false, 'trapezoidal')?.external.pitchDia).toBeCloseTo(18, 6);
  });

  it('1/4-20 tap drill: ideal 0.2013 in, nearest fractional 13/64 in', () => {
    const tap = calculateTapDrill(0.25, 20, 75, true);
    expect(tap?.idealDrillSize).toBeCloseTo(0.25 - (0.01299 * 75) / 20, 6); // 0.2013
    expect(tap?.nearestStandardDrill).toBeCloseTo(13 / 64, 9);
    expect(tap?.nearestLabel).toBe('13/64"');
    expect(tap?.resultingPercentThread).toBeCloseTo((0.25 - 13 / 64) / (0.01299 / 20), 6); // ≈ 72.2%
  });

  it('converts pitch to TPI and vice versa', () => {
    const fromMm = convertPitchTpi(1.5, 'pitchMm');
    expect(fromMm?.tpi).toBeCloseTo(16.933, 3);

    const fromTpi = convertPitchTpi(20, 'tpi');
    expect(fromTpi?.pitchIn).toBe(0.05);
    expect(fromTpi?.pitchMm).toBe(1.27);
  });
});
