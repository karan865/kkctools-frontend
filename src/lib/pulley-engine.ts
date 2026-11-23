/**
 * pulley-engine.ts
 * Pure calculation engine for pulley speed ratios, belt lengths, centre distances,
 * multi-stage drives, and wheel RPM to linear vehicle velocity.
 * 
 * Rules:
 * - Exact π maths everywhere (never rounded shortcuts in calculations).
 * - Return null for physically impossible or non-positive dimensions; never NaN or Infinity.
 * - Normalize -0 to 0.
 */

export interface PulleySolveResult {
  driverDia: number;
  drivenDia: number;
  driverRpm: number;
  drivenRpm: number;
  speedRatio: number; // Driven RPM / Driver RPM
  diameterRatio: number; // Driven Dia / Driver Dia (e.g. 2:1 reduction)
  isReduction: boolean;
  beltSpeedFtPerMin: number;
  beltSpeedMPerMin: number;
  beltSpeedMPerSec: number;
}

export interface BeltGeometryResult {
  openLength: number;
  crossedLength: number;
  centreDistance: number;
  driverWrapDeg: number;
  drivenWrapDeg: number;
  isLowWrapWarning: boolean; // wrap on small pulley < 120°
}

export interface MultiStageResult {
  stageRatios: number[];
  totalRatio: number;
  shaftRpms: number[];
  finalRpm: number;
}

/**
 * 4-Way solve for two-pulley drive:
 * D1 = Driver Dia, D2 = Driven Dia, N1 = Driver RPM, N2 = Driven RPM.
 */
export function solvePulley(
  d1: number,
  d2: number,
  n1: number,
  n2: number,
  solveFor: 'drivenRpm' | 'driverRpm' | 'drivenDia' | 'driverDia',
  slipPct = 0
): PulleySolveResult | null {
  const slipFactor = 1 - Math.min(0.99, Math.max(0, slipPct / 100));

  let calcD1 = d1;
  let calcD2 = d2;
  let calcN1 = n1;
  let calcN2 = n2;

  if (solveFor === 'drivenRpm') {
    if (d1 <= 0 || d2 <= 0 || n1 <= 0) return null;
    calcN2 = (n1 * d1 / d2) * slipFactor;
  } else if (solveFor === 'driverRpm') {
    if (d1 <= 0 || d2 <= 0 || n2 <= 0 || slipFactor <= 0) return null;
    calcN1 = (n2 * d2 / d1) / slipFactor;
  } else if (solveFor === 'drivenDia') {
    if (d1 <= 0 || n1 <= 0 || n2 <= 0) return null;
    calcD2 = (d1 * n1 / n2) * slipFactor;
  } else if (solveFor === 'driverDia') {
    if (d2 <= 0 || n1 <= 0 || n2 <= 0 || slipFactor <= 0) return null;
    calcD1 = (d2 * n2 / n1) / slipFactor;
  }

  if (calcD1 <= 0 || calcD2 <= 0 || calcN1 <= 0 || calcN2 <= 0) return null;

  const diameterRatio = calcD2 / calcD1;
  const speedRatio = calcN2 / calcN1;
  const isReduction = calcN2 < calcN1;

  // Belt speed is fixed by the driver pulley surface speed
  const beltSpeedFtPerMin = (Math.PI * calcD1 * calcN1) / 12;
  const beltSpeedMPerMin = beltSpeedFtPerMin * 0.3048;
  const beltSpeedMPerSec = beltSpeedMPerMin / 60;

  return {
    driverDia: calcD1,
    drivenDia: calcD2,
    driverRpm: calcN1,
    drivenRpm: calcN2,
    speedRatio,
    diameterRatio,
    isReduction,
    beltSpeedFtPerMin,
    beltSpeedMPerMin,
    beltSpeedMPerSec,
  };
}

/**
 * Open and crossed belt length given diameters and centre distance C.
 * Open length formula: L = 2C + π(D1+D2)/2 + (D2-D1)² / (4C)
 * Crossed length formula: L = 2C + π(D1+D2)/2 + (D1+D2)² / (4C)
 */
export function calculateBeltLength(
  d1: number,
  d2: number,
  centreDistance: number
): BeltGeometryResult | null {
  if (d1 <= 0 || d2 <= 0 || centreDistance <= 0) return null;
  const c = centreDistance;
  const minC = (d1 + d2) / 2;
  if (c <= minC) {
    // Pulleys collide or overlap physically
    return null;
  }

  const dSum = d1 + d2;
  const dDiff = Math.abs(d2 - d1);

  const openLength = 2 * c + (Math.PI * dSum) / 2 + (dDiff * dDiff) / (4 * c);
  const crossedLength = 2 * c + (Math.PI * dSum) / 2 + (dSum * dSum) / (4 * c);

  // Wrap angle on small pulley: 180° - 2 * arcsin((D_large - D_small) / (2C))
  const sinAlpha = dDiff / (2 * c);
  const alphaRad = Math.asin(Math.min(1, Math.max(0, sinAlpha)));
  const alphaDeg = (alphaRad * 180) / Math.PI;

  const smallWrap = 180 - 2 * alphaDeg;
  const largeWrap = 360 - smallWrap;

  const driverIsSmaller = d1 <= d2;
  const driverWrapDeg = driverIsSmaller ? smallWrap : largeWrap;
  const drivenWrapDeg = driverIsSmaller ? largeWrap : smallWrap;

  return {
    openLength,
    crossedLength,
    centreDistance: c,
    driverWrapDeg,
    drivenWrapDeg,
    isLowWrapWarning: smallWrap < 120,
  };
}

/**
 * Solve centre distance C from stock open belt length L and diameters.
 * Equation: 2C + π(D1+D2)/2 + (D2-D1)² / (4C) = L
 * Quadratic: 8C² - 4KC + Δ² = 0, where K = L - π(D1+D2)/2 and Δ = |D2 - D1|
 * C = [K + √(K² - 2Δ²)] / 4
 */
export function centreDistancefromBeltLength(
  d1: number,
  d2: number,
  beltLength: number
): number | null {
  if (d1 <= 0 || d2 <= 0 || beltLength <= 0) return null;
  const dSum = d1 + d2;
  const dDiff = Math.abs(d2 - d1);

  const k = beltLength - (Math.PI * dSum) / 2;
  const radical = k * k - 2 * dDiff * dDiff;
  if (radical < 0) return null;

  const c = (k + Math.sqrt(radical)) / 4;
  const minC = dSum / 2;
  if (c <= minC) return null;

  return c;
}

/**
 * Multi-stage drive calculation (up to 3 compound stages).
 * stages: array of { driverDia: number, drivenDia: number }
 */
export function calculateMultiStage(
  motorRpm: number,
  stages: { driverDia: number; drivenDia: number }[]
): MultiStageResult | null {
  if (motorRpm <= 0 || stages.length === 0) return null;

  const stageRatios: number[] = [];
  const shaftRpms: number[] = [motorRpm];
  let currentRpm = motorRpm;
  let totalRatio = 1;

  for (const stage of stages) {
    if (stage.driverDia <= 0 || stage.drivenDia <= 0) return null;
    const ratio = stage.drivenDia / stage.driverDia;
    stageRatios.push(ratio);
    totalRatio *= ratio;
    currentRpm = currentRpm / ratio;
    shaftRpms.push(currentRpm);
  }

  return {
    stageRatios,
    totalRatio,
    shaftRpms,
    finalRpm: currentRpm,
  };
}

/**
 * Convert wheel / roller diameter and RPM to linear speed (mph and km/h).
 * Formula: mph = (RPM × π × D_in × 60) / 63,360
 */
export function wheelRpmToSpeed(diaIn: number, rpm: number): { mph: number; kmh: number; ftPerMin: number } | null {
  if (diaIn <= 0 || rpm <= 0) return null;
  const ftPerMin = (Math.PI * diaIn * rpm) / 12;
  const mph = (ftPerMin * 60) / 5280;
  const kmh = mph * 1.609344;

  return {
    mph,
    kmh,
    ftPerMin,
  };
}
