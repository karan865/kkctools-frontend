/**
 * steps-engine.ts
 * Pure calculation engine for 3D printer and CNC stepper motor calibration:
 * belt axes, lead screws, extruder e-steps, test cube axis correction,
 * Klipper rotation_distance, and firmware configuration lines (Marlin, Klipper, GRBL).
 * 
 * Rules:
 * - Return null for non-positive dimensions, zero pitch, or non-positive measured distances.
 * - Exact π maths.
 * - Normalize -0 to 0.
 */

export interface EStepsCalibrationResult {
  actualExtrudedMm: number;
  newESteps: number;
  errorPct: number; // positive = over-extrusion, negative = under-extrusion
  isUnderExtruding: boolean;
}

export interface AxisCalibrationResult {
  newStepsPerMm: number;
  errorPct: number;
  isUndersized: boolean;
}

export interface FirmwareOutput {
  marlin: string;
  marlinSave: string;
  klipper: string;
  grbl: string;
  rotationDistance: number;
}

/**
 * Full steps per revolution from motor step angle.
 * 1.8° = 200 steps/rev, 0.9° = 400 steps/rev, 7.5° = 48 steps/rev.
 */
export function stepsPerRev(stepAngleDeg: number): number {
  if (stepAngleDeg <= 0) return 200;
  return 360 / stepAngleDeg;
}

/**
 * Steps per mm for belt-driven linear axes (e.g. GT2, GT3).
 * Formula: steps/mm = (stepsPerRev × microsteps) / (beltPitchMm × pulleyTeeth)
 */
export function beltStepsPerMm(
  stepAngleDeg: number,
  microsteps: number,
  beltPitchMm: number,
  pulleyTeeth: number
): number | null {
  if (stepAngleDeg <= 0 || microsteps <= 0 || beltPitchMm <= 0 || pulleyTeeth <= 0) return null;
  const spr = stepsPerRev(stepAngleDeg);
  return (spr * microsteps) / (beltPitchMm * pulleyTeeth);
}

/**
 * Steps per mm for lead screw driven axes (e.g. T8 lead screw).
 * Formula: steps/mm = (stepsPerRev × microsteps) / leadMm
 * Note: Lead = Pitch × Starts. If imperial TPI given, leadMm = 25.4 / TPI.
 */
export function leadScrewStepsPerMm(
  stepAngleDeg: number,
  microsteps: number,
  leadMm: number
): number | null {
  if (stepAngleDeg <= 0 || microsteps <= 0 || leadMm <= 0) return null;
  const spr = stepsPerRev(stepAngleDeg);
  return (spr * microsteps) / leadMm;
}

/**
 * Extruder steps per mm from physical drive gear geometry.
 * Formula: steps/mm = (stepsPerRev × microsteps × gearRatio) / (π × driveGearEffDiaMm)
 */
export function extruderHwStepsPerMm(
  stepAngleDeg: number,
  microsteps: number,
  gearRatio: number,
  driveGearEffDiaMm: number
): number | null {
  if (stepAngleDeg <= 0 || microsteps <= 0 || gearRatio <= 0 || driveGearEffDiaMm <= 0) return null;
  const spr = stepsPerRev(stepAngleDeg);
  return (spr * microsteps * gearRatio) / (Math.PI * driveGearEffDiaMm);
}

/**
 * Extruder E-steps calibration using the 100 mm mark method.
 * User marks filament at markDistanceMm (e.g. 120 mm from extruder intake),
 * commands requestedMm (e.g. 100 mm), and measures remainingDistanceMm.
 * Actual extruded = markDistanceMm - remainingDistanceMm.
 * New E-steps = Current E-steps × (requestedMm / actualExtrudedMm).
 */
export function calibrateESteps(
  currentESteps: number,
  requestedMm: number,
  markDistanceMm: number,
  remainingDistanceMm: number
): EStepsCalibrationResult | null {
  if (currentESteps <= 0 || requestedMm <= 0 || markDistanceMm <= 0 || remainingDistanceMm < 0) return null;
  const actualExtrudedMm = markDistanceMm - remainingDistanceMm;
  if (actualExtrudedMm <= 0) return null;

  const newESteps = (currentESteps * requestedMm) / actualExtrudedMm;
  const errorPct = ((actualExtrudedMm - requestedMm) / requestedMm) * 100;

  return {
    actualExtrudedMm,
    newESteps,
    errorPct,
    isUnderExtruding: actualExtrudedMm < requestedMm,
  };
}

/**
 * Linear axis calibration using printed test object (e.g. 20 mm calibration cube).
 * Formula: New steps/mm = Current steps/mm × (commandedMm / measuredMm)
 */
export function calibrateAxis(
  currentStepsPerMm: number,
  commandedMm: number,
  measuredMm: number
): AxisCalibrationResult | null {
  if (currentStepsPerMm <= 0 || commandedMm <= 0 || measuredMm <= 0) return null;
  const newStepsPerMm = (currentStepsPerMm * commandedMm) / measuredMm;
  const errorPct = ((measuredMm - commandedMm) / commandedMm) * 100;

  return {
    newStepsPerMm,
    errorPct,
    isUndersized: measuredMm < commandedMm,
  };
}

/**
 * Convert steps per mm to Klipper firmware rotation_distance.
 * Klipper formula: rotation_distance = (full_steps_per_rotation × microsteps) / steps_per_mm
 */
export function klipperRotationDistance(
  stepAngleDeg: number,
  microsteps: number,
  stepsPerMm: number
): number | null {
  if (stepAngleDeg <= 0 || microsteps <= 0 || stepsPerMm <= 0) return null;
  const spr = stepsPerRev(stepAngleDeg);
  return (spr * microsteps) / stepsPerMm;
}

/**
 * Pulse step frequency in Hertz (Hz) at a given travel speed (mm/s).
 * Formula: Step Frequency = steps/mm × speed (mm/s)
 */
export function stepFrequencyHz(stepsPerMm: number, speedMmPerSec: number): number | null {
  if (stepsPerMm <= 0 || speedMmPerSec <= 0) return null;
  return stepsPerMm * speedMmPerSec;
}

/**
 * Generate copy-ready configuration strings for Marlin, Klipper, and GRBL.
 */
export function generateFirmwareCommands(
  axis: 'X' | 'Y' | 'Z' | 'E',
  stepsPerMm: number,
  stepAngleDeg: number,
  microsteps: number
): FirmwareOutput {
  const spr = stepsPerRev(stepAngleDeg);
  const rotDist = stepsPerMm > 0 ? (spr * microsteps) / stepsPerMm : 0;
  // GRBL is CNC firmware with X/Y/Z only ($100–$102); it has no extruder axis.
  const grblCode = axis === 'X' ? '$100' : axis === 'Y' ? '$101' : axis === 'Z' ? '$102' : null;

  return {
    marlin: `M92 ${axis}${stepsPerMm.toFixed(2)}`,
    marlinSave: `M92 ${axis}${stepsPerMm.toFixed(2)}\nM500`,
    klipper: `rotation_distance: ${rotDist.toFixed(3)}\nmicrosteps: ${microsteps}\nfull_steps_per_rotation: ${spr}`,
    grbl: grblCode ? `${grblCode}=${stepsPerMm.toFixed(3)}` : '; GRBL has no extruder (E) axis',
    rotationDistance: rotDist,
  };
}
