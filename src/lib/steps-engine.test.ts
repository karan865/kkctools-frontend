import { describe, it, expect } from 'vitest';
import {
  beltStepsPerMm,
  leadScrewStepsPerMm,
  extruderHwStepsPerMm,
  calibrateESteps,
  calibrateAxis,
  klipperRotationDistance,
  generateFirmwareCommands,
} from './steps-engine';

describe('steps-engine', () => {
  it('solves worked example 1: 1.8° motor, 16 µsteps, 2 mm GT2 belt, 20-tooth pulley', () => {
    // 200 steps × 16 µsteps ÷ (2 mm × 20 teeth) = 80 steps/mm
    // Klipper rotation_distance = 40
    const steps = beltStepsPerMm(1.8, 16, 2, 20);
    expect(steps).toBe(80);

    const rotDist = klipperRotationDistance(1.8, 16, 80);
    expect(rotDist).toBe(40);

    const fw = generateFirmwareCommands('X', 80, 1.8, 16);
    expect(fw.marlin).toBe('M92 X80.00');
    expect(fw.marlinSave).toBe('M92 X80.00\nM500');
    expect(fw.klipper).toContain('rotation_distance: 40.000');
    expect(fw.grbl).toBe('$100=80.000');
  });

  it('solves worked example 2: T8 lead screw with 8 mm lead', () => {
    // 200 steps × 16 µsteps ÷ 8 mm lead = 400 steps/mm
    const steps = leadScrewStepsPerMm(1.8, 16, 8);
    expect(steps).toBe(400);

    const fw = generateFirmwareCommands('Z', 400, 1.8, 16);
    expect(fw.marlin).toBe('M92 Z400.00');
    expect(fw.grbl).toBe('$102=400.000');
  });

  it('solves worked example 3: E-steps calibration with 93 current, 100 requested, 95 actual', () => {
    // current 93, requested 100 mm, mark 120 mm, remaining 25 mm -> actual 95 mm
    // new e-steps = 93 * 100 / 95 = 97.8947... -> 97.89
    const cal = calibrateESteps(93, 100, 120, 25);
    expect(cal).not.toBeNull();
    expect(cal?.actualExtrudedMm).toBe(95);
    expect(cal?.newESteps).toBeCloseTo(97.8947, 4);
    expect(cal?.isUnderExtruding).toBe(true);
    expect(cal?.errorPct).toBeCloseTo(-5.0, 1);

    const fw = generateFirmwareCommands('E', cal!.newESteps, 1.8, 16);
    expect(fw.marlin).toBe('M92 E97.89');
  });

  it('proves under-extrusion increases e-steps and over-extrusion decreases e-steps', () => {
    // Firgelli mistake check: if printer under-extrudes (actual 90 vs 100), new e-steps MUST be higher
    const under = calibrateESteps(100, 100, 120, 30); // actual 90
    expect(under?.newESteps).toBeGreaterThan(100);

    const over = calibrateESteps(100, 100, 120, 10); // actual 110
    expect(over?.newESteps).toBeLessThan(100);
  });

  it('calculates axis calibration from 20 mm test cube', () => {
    // If cube measures 19.8 mm instead of 20 mm at 80 steps/mm:
    // new = 80 * 20 / 19.8 = 80.808 steps/mm
    const cal = calibrateAxis(80, 20, 19.8);
    expect(cal).not.toBeNull();
    expect(cal?.newStepsPerMm).toBeCloseTo(80.808, 3);
    expect(cal?.isUndersized).toBe(true);
  });

  it('computes extruder hardware steps/mm from drive gear and ratio', () => {
    // Bondtech BMG style: 3:1 gear ratio, 7.3 mm effective gear diameter, 1.8° motor, 16 µsteps
    // steps/mm = 3200 * 3 / (π * 7.3) = 9600 / 22.9336 = 418.6
    const steps = extruderHwStepsPerMm(1.8, 16, 3, 7.3);
    expect(steps).toBeCloseTo(418.6, 1);
  });
});
