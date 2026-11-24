import { describe, it, expect } from 'vitest';
import {
  calculateSlopeFromRiseRun,
  solveSlopeAnyTwo,
  planAccessibleRamp,
  calculateTwoPointSlope,
  analyzeTableSlope,
} from './slope-engine';

describe('slope-engine', () => {
  it('calculates slope metrics from rise 1 and run 12', () => {
    const res = calculateSlopeFromRiseRun(1, 12);
    expect(res.slope).toBeCloseTo(0.08333, 4);
    expect(res.percentGrade).toBeCloseTo(8.33, 2);
    expect(res.degrees).toBeCloseTo(4.76, 2);
    expect(res.ratio1ToN).toBe('1 : 12');
    expect(res.roofPitchFormatted).toBe('1/12');
    expect(res.inchesPerFoot).toBe(1);
  });

  it('solves missing rise from run 20 ft and 2% grade', () => {
    const res = solveSlopeAnyTwo({ run: 20, percentGrade: 2 });
    expect(res.rise).toBeCloseTo(0.4, 4);
    expect(res.rise * 12).toBeCloseTo(4.8, 2); // 4.8 inches
  });

  it('solves 4/12 roof pitch to degrees and percentage grade', () => {
    const res = solveSlopeAnyTwo({ pitch: 4 });
    expect(res.degrees).toBeCloseTo(18.43, 2);
    expect(res.percentGrade).toBeCloseTo(33.33, 2);
  });

  it('calculates 1/4 in per ft slope as 2.08% grade', () => {
    // 1/4 inch rise over 12 inches run = 0.25 / 12
    const res = calculateSlopeFromRiseRun(0.25, 12);
    expect(res.percentGrade).toBeCloseTo(2.08, 2);
    expect(res.roofPitch).toBe(0.25);
  });

  it('plans accessible ramp with 24 in total rise at 1:12', () => {
    const ramp = planAccessibleRamp(24, 12);
    expect(ramp.minRunFeet).toBe(24);
    expect(ramp.minRunInches).toBe(288);
    expect(ramp.runsCount).toBe(1); // 24 <= 30 in
    expect(ramp.landingsCount).toBe(0);
    expect(ramp.citation).toContain('2010 ADA Standards');

    // For 48 in rise -> 2 runs (48 > 30)
    const ramp48 = planAccessibleRamp(48, 12);
    expect(ramp48.minRunFeet).toBe(48);
    expect(ramp48.runsCount).toBe(2);
    expect(ramp48.landingsCount).toBe(1);
  });

  it('solves two-point slope: (1, 2) and (4, 11) -> m = 3, b = -1, y = 3x - 1', () => {
    const res = calculateTwoPointSlope(1, 2, 4, 11);
    expect(res.slope).toBe(3);
    expect(res.yIntercept).toBe(-1);
    expect(res.equation).toBe('y = 3.0000x − 1.0000');
    expect(res.distance).toBeCloseTo(9.4868, 4);
  });

  it('handles vertical line (run = 0) gracefully', () => {
    const vert = calculateSlopeFromRiseRun(10, 0);
    expect(vert.isVertical).toBe(true);
    expect(vert.degrees).toBe(90);
    expect(vert.percentGrade).toBe(Infinity);

    const vertTwoPoint = calculateTwoPointSlope(5, 2, 5, 10);
    expect(vertTwoPoint.isVertical).toBe(true);
    expect(vertTwoPoint.equation).toBe('x = 5');
  });

  it('analyzes table points for linearity', () => {
    const linear = analyzeTableSlope([
      { x: 1, y: 2 },
      { x: 2, y: 5 },
      { x: 3, y: 8 },
    ]);
    expect(linear.isLinear).toBe(true);
    expect(linear.averageSlope).toBe(3);

    const nonLinear = analyzeTableSlope([
      { x: 1, y: 2 },
      { x: 2, y: 5 },
      { x: 3, y: 10 },
    ]);
    expect(nonLinear.isLinear).toBe(false);
  });
});

describe('ramp compliance follows ADA §405.2 (review 2026-11-24)', () => {
  it('1:12 or gentler passes; steeper than 1:12 fails', () => {
    expect(planAccessibleRamp(24, 12).isCompliant).toBe(true);
    expect(planAccessibleRamp(24, 16).isCompliant).toBe(true);
    expect(planAccessibleRamp(24, 8).isCompliant).toBe(false);
  });
});
