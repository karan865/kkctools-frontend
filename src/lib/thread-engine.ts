/**
 * thread-engine.ts
 * Pure calculation engine for screw thread geometry:
 * - Basic major, pitch, and minor diameters for 60° (UN/Metric), Acme 29°, and Trapezoidal 30°
 * - Tap drill calculation for any target % thread engagement
 * - Three-wire pitch diameter measurement method
 * - Pitch (mm/in) ↔ Threads Per Inch (TPI) conversion
 * 
 * Rules:
 * - Exact mathematical formulas (ASME B1.1 / ISO 68-1 / ISO 724 / ISO 2901 basic sizes).
 * - No copyrighted tolerance class tables; calculate basic theoretical diameters.
 * - Return null for zero or negative dimensions; never NaN or Infinity.
 */

export interface ThreadDimensions {
  standard: 'metric' | 'unified' | 'acme' | 'trapezoidal';
  nominalDia: number; // d or D (mm or in)
  pitch: number; // P (mm or in)
  tpi?: number;
  triangleHeight: number; // H
  external: {
    majorDia: number; // d
    pitchDia: number; // d2
    minorDiaIso: number; // d3 (rounded root)
    minorDiaFlat: number; // d1 (flat root)
  };
  internal: {
    majorDia: number; // D
    pitchDia: number; // D2
    minorDia: number; // D1
  };
}

export interface TapDrillResult {
  idealDrillSize: number;
  targetPercentThread: number;
  nearestStandardDrill: number;
  /** Human label for the nearest drill, e.g. 13/64" (inch) */
  nearestLabel?: string;
  resultingPercentThread: number;
  unit: 'mm' | 'inch';
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export interface ThreeWireResult {
  bestWireDia: number;
  measurementOverWires: number; // M
  computedPitchDiaFromM: number;
}

/** Standard metric drill bit sizes commonly found in machine shops (0.5 mm to 30 mm) */
export const STANDARD_METRIC_DRILLS = [
  1.0, 1.2, 1.5, 1.6, 2.0, 2.5, 2.9, 3.0, 3.3, 3.5, 4.0, 4.2, 4.5, 5.0, 5.5,
  6.0, 6.5, 6.8, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 10.2, 10.5, 11.0, 11.5,
  12.0, 12.5, 13.0, 14.0, 15.0, 16.0, 17.5, 18.0, 19.0, 20.0, 22.0, 25.0,
];

/**
 * Compute basic thread diameters for 60° (Metric ISO / Unified UN), Acme 29°, or Trapezoidal 30°.
 */
export function calculateThreadDimensions(
  nominalDia: number,
  pitchOrTpi: number,
  isTpi = false,
  standard: 'metric' | 'unified' | 'acme' | 'trapezoidal' = 'metric'
): ThreadDimensions | null {
  if (nominalDia <= 0 || pitchOrTpi <= 0) return null;

  let p = pitchOrTpi;
  let tpiVal: number | undefined;

  if (isTpi) {
    tpiVal = pitchOrTpi;
    p = 1 / pitchOrTpi; // pitch in inches
  } else if (standard === 'unified') {
    tpiVal = 1 / p;
  }

  const d = nominalDia;
  let H = 0;
  let d2 = 0;
  let d3 = 0;
  let d1 = 0;
  let D1 = 0;

  if (standard === 'acme') {
    // 29° Acme general-purpose basic profile
    H = 0.5 * p;
    d2 = d - 0.5 * p;
    d3 = d - p;
    d1 = d - p;
    D1 = d - p;
  } else if (standard === 'trapezoidal') {
    // 30° metric trapezoidal (ISO 2901 profile, ISO 2904 basic dimensions).
    // Fundamental triangle height H = 1.866 P. Crest clearance a_c depends on pitch
    // (0.15 mm for P 1.5; 0.25 for P 2–5; 0.5 for P 6–12; 1 for P 14–44).
    // TODO(owner): confirm the a_c steps against the ISO 2904 table before launch.
    const ac = p <= 1.5 ? 0.15 : p <= 5 ? 0.25 : p <= 12 ? 0.5 : 1;
    H = 1.866 * p;
    d2 = d - 0.5 * p;
    d3 = d - (p + 2 * ac); // external minor: d − 2·h3, h3 = 0.5P + a_c
    d1 = d - p;
    D1 = d - p; // internal minor (basic)
  } else {
    // Standard 60° V-Thread (ISO 68-1 / ASME B1.1)
    H = 0.8660254 * p;
    d2 = d - 0.64951905 * p;
    d3 = d - 1.2268693 * p;
    d1 = d - 1.08253175 * p;
    D1 = d - 1.08253175 * p;
  }

  return {
    standard,
    nominalDia: d,
    pitch: p,
    tpi: tpiVal,
    triangleHeight: H,
    external: {
      majorDia: d,
      pitchDia: d2,
      minorDiaIso: d3,
      minorDiaFlat: d1,
    },
    internal: {
      majorDia: d,
      pitchDia: d2,
      minorDia: D1,
    },
  };
}

/**
 * Tap drill size for target % thread engagement (standard workshop default 75%).
 * Metric: Tap Drill = D - (0.01299 × %thread × P)
 * Inch: Tap Drill = D - (0.01299 × %thread / TPI)
 */
export function calculateTapDrill(
  majorDia: number,
  pitchOrTpi: number,
  targetPercent = 75,
  isTpi = false
): TapDrillResult | null {
  if (majorDia <= 0 || pitchOrTpi <= 0 || targetPercent <= 0 || targetPercent > 100) return null;

  const p = isTpi ? 25.4 / pitchOrTpi : pitchOrTpi; // mm
  const diaMm = isTpi ? majorDia * 25.4 : majorDia;

  // Ideal drill size in mm
  const idealMm = diaMm - 0.01299 * targetPercent * p;

  if (isTpi) {
    // Imperial calculation in inches
    const idealIn = majorDia - (0.01299 * targetPercent) / pitchOrTpi;
    if (idealIn <= 0) return null;
    // Nearest fractional drill (fractional drills come in 1/64-inch steps). Number and
    // letter drills fill the gaps; the UI tells the user to check a drill chart for those.
    const n64 = Math.max(1, Math.round(idealIn * 64));
    const nearestIn = n64 / 64;
    const g = gcd(n64, 64);
    const resultingPct = (majorDia - nearestIn) / (0.01299 / pitchOrTpi);

    return {
      idealDrillSize: idealIn,
      targetPercentThread: targetPercent,
      nearestStandardDrill: nearestIn,
      nearestLabel: `${n64 / g}/${64 / g}"`,
      resultingPercentThread: resultingPct,
      unit: 'inch',
    };
  }

  // Find nearest standard metric drill
  let nearest = STANDARD_METRIC_DRILLS[0];
  let minDiff = Math.abs(idealMm - nearest);
  for (const dr of STANDARD_METRIC_DRILLS) {
    const diff = Math.abs(idealMm - dr);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = dr;
    }
  }

  // Resulting % thread with this physical drill
  const resultingPct = (diaMm - nearest) / (0.01299 * p);

  return {
    idealDrillSize: idealMm,
    targetPercentThread: targetPercent,
    nearestStandardDrill: nearest,
    resultingPercentThread: resultingPct,
    unit: 'mm',
  };
}

/**
 * Three-wire method for 60° screw threads.
 * Best wire size W_best = 0.57735 × P.
 * Measurement over wires M = d2 + 3W - 1.51554·P
 * Reverse pitch diameter from measured M = M - 3W + 1.51554·P
 */
export function calculateThreeWire(
  pitchDia: number,
  pitch: number,
  customWireDia?: number,
  measuredM?: number
): ThreeWireResult | null {
  if (pitch <= 0) return null;

  const bestWire = 0.57735 * pitch;
  const w = customWireDia && customWireDia > 0 ? customWireDia : bestWire;

  // M = d2 + 3W - 1.51554 * P (spec formula)
  const m = pitchDia + 3 * w - 1.51554 * pitch;

  // Reverse d2 if a physical measurement M was provided
  const d2Rev = measuredM && measuredM > 0 ? measuredM - 3 * w + 1.51554 * pitch : pitchDia;

  return {
    bestWireDia: bestWire,
    measurementOverWires: m,
    computedPitchDiaFromM: d2Rev,
  };
}

/**
 * Pitch ↔ TPI conversion.
 */
export function convertPitchTpi(value: number, from: 'pitchMm' | 'tpi'): { pitchMm: number; tpi: number; pitchIn: number } | null {
  if (value <= 0) return null;
  if (from === 'pitchMm') {
    const tpi = 25.4 / value;
    return {
      pitchMm: value,
      tpi,
      pitchIn: value / 25.4,
    };
  } else {
    const pitchMm = 25.4 / value;
    return {
      pitchMm,
      tpi: value,
      pitchIn: 1 / value,
    };
  }
}
