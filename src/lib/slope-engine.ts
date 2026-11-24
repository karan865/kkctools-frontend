/**
 * Slope & Rise over Run Calculation Engine
 * Pure TypeScript, zero network calls, fully deterministic.
 */

export interface SlopeConversions {
  rise: number;
  run: number;
  slope: number; // m = rise / run
  percentGrade: number; // 100 * m
  degrees: number; // atan(m) in degrees
  radians: number;
  ratio1ToN: string; // "1 : N"
  roofPitch: number; // x in x/12
  roofPitchFormatted: string; // "x/12"
  inchesPerFoot: number; // 12 * m
  slopeLength: number; // sqrt(rise^2 + run^2)
  isVertical: boolean;
  isHorizontal: boolean;
  steps: string[];
}

export interface RampPlannerResult {
  totalRiseInches: number;
  maxSlopeRatio: number; // e.g. 12 for 1:12
  minRunFeet: number;
  minRunInches: number;
  runsCount: number; // number of ramp segments (each <= maxRisePerRun)
  landingsCount: number; // intermediate landings needed
  maxRisePerRunInches: number;
  actualSlopePct: number;
  isCompliant: boolean;
  citation: string;
  notes: string[];
}

export interface TwoPointSlopeResult {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  deltaX: number;
  deltaY: number;
  slope: number;
  isVertical: boolean;
  yIntercept: number | null; // b in y = mx + b
  equation: string;
  distance: number;
  rateOfChange: number;
  steps: string[];
}

export interface TableSlopeResult {
  points: Array<{ x: number; y: number }>;
  slopes: number[];
  isLinear: boolean;
  averageSlope: number;
  equation?: string;
  notes: string[];
}

/**
 * Calculates all slope metrics from rise and run.
 */
export function calculateSlopeFromRiseRun(rise: number, run: number): SlopeConversions {
  const steps: string[] = [];

  if (run === 0) {
    if (rise === 0) {
      throw new Error('Rise and run cannot both be zero.');
    }
    return {
      rise,
      run: 0,
      slope: Infinity,
      percentGrade: Infinity,
      degrees: 90,
      radians: Math.PI / 2,
      ratio1ToN: 'Vertical (undefined)',
      roofPitch: Infinity,
      roofPitchFormatted: 'Vertical',
      inchesPerFoot: Infinity,
      slopeLength: Math.abs(rise),
      isVertical: true,
      isHorizontal: false,
      steps: ['Slope is vertical (run = 0). Division by zero yields an undefined / infinite slope (90°).'],
    };
  }

  const m = rise / run;
  const isHorizontal = m === 0;
  const pct = m * 100;
  const rad = Math.atan(Math.abs(m));
  const deg = (rad * 180) / Math.PI;

  const n = m !== 0 ? Math.abs(run / rise) : 0;
  const ratio1ToN = m !== 0 ? `1 : ${Math.round(n * 100) / 100}` : '1 : ∞ (Flat)';

  const pitch = Math.abs(m * 12);
  const pitchFormatted = `${(Math.round(pitch * 100) / 100).toFixed(pitch % 1 === 0 ? 0 : 2)}/12`;
  const inPerFt = Math.abs(m * 12);
  const length = Math.sqrt(rise * rise + run * run);

  steps.push(`Formula: Slope m = Rise ÷ Run = ${rise} ÷ ${run} = ${m.toFixed(4)}`);
  steps.push(`Percentage Grade = m × 100% = ${m.toFixed(4)} × 100% = ${pct.toFixed(2)}%`);
  steps.push(`Angle in Degrees = arctan(|m|) = arctan(${Math.abs(m).toFixed(4)}) ≈ ${deg.toFixed(2)}°`);
  steps.push(`Ratio 1:N = 1 : (${Math.abs(run)} ÷ ${Math.abs(rise)}) = ${ratio1ToN}`);
  steps.push(`Roof Pitch = |m| × 12 = ${pitchFormatted} (or ${inPerFt.toFixed(2)} in per foot of run)`);
  steps.push(`Slope Length = √(Rise² + Run²) = √(${rise * rise} + ${run * run}) ≈ ${length.toFixed(4)}`);

  return {
    rise,
    run,
    slope: m,
    percentGrade: pct,
    degrees: deg,
    radians: rad,
    ratio1ToN,
    roofPitch: pitch,
    roofPitchFormatted: pitchFormatted,
    inchesPerFoot: inPerFt,
    slopeLength: length,
    isVertical: false,
    isHorizontal,
    steps,
  };
}

/**
 * Solves for the missing parameter given any combination of two inputs:
 * Knowns can be:
 * - 'run' and 'percentGrade' -> finds rise
 * - 'rise' and 'percentGrade' -> finds run
 * - 'run' and 'degrees' -> finds rise
 * - 'rise' and 'degrees' -> finds run
 * - 'pitch' (x in x/12) -> finds % and degrees
 */
export function solveSlopeAnyTwo(params: {
  rise?: number;
  run?: number;
  percentGrade?: number;
  degrees?: number;
  pitch?: number;
}): SlopeConversions {
  let { rise, run } = params;
  const { percentGrade, degrees, pitch } = params;

  if (pitch !== undefined) {
    const m = pitch / 12;
    if (run !== undefined) {
      rise = run * m;
    } else if (rise !== undefined) {
      run = rise / m;
    } else {
      // Default to 12 run
      run = 12;
      rise = pitch;
    }
  } else if (percentGrade !== undefined) {
    const m = percentGrade / 100;
    if (run !== undefined) {
      rise = run * m;
    } else if (rise !== undefined) {
      if (m === 0) throw new Error('Cannot calculate run with 0% grade and non-zero rise.');
      run = rise / m;
    } else {
      run = 100;
      rise = percentGrade;
    }
  } else if (degrees !== undefined) {
    if (degrees < 0 || degrees >= 90) {
      throw new Error('Degrees must be between 0° and strictly less than 90°.');
    }
    const rad = (degrees * Math.PI) / 180;
    const m = Math.tan(rad);
    if (run !== undefined) {
      rise = run * m;
    } else if (rise !== undefined) {
      if (m === 0) throw new Error('Cannot calculate run with 0° angle and non-zero rise.');
      run = rise / m;
    } else {
      run = 100;
      rise = 100 * m;
    }
  }

  if (rise === undefined || run === undefined) {
    throw new Error('Provide at least two valid parameters to solve slope.');
  }

  return calculateSlopeFromRiseRun(rise, run);
}

/**
 * Plans and evaluates an accessible wheelchair ramp against the 2010 ADA Standards:
 * - Running slope: maximum 1:12 (8.333% grade) (§405.2)
 * - Maximum rise per ramp run: 30 inches (760 mm) (§405.6)
 */
export function planAccessibleRamp(totalRiseInches: number, maxSlopeRatio = 12): RampPlannerResult {
  if (totalRiseInches <= 0) {
    throw new Error('Total rise must be greater than zero.');
  }

  const maxRisePerRun = 30; // inches (ADA §405.6)
  const runsCount = Math.ceil(totalRiseInches / maxRisePerRun);
  const landingsCount = Math.max(0, runsCount - 1);

  // At 1:12, each 1 inch of rise requires 12 inches (1 foot) of horizontal run
  const minRunInches = totalRiseInches * maxSlopeRatio;
  const minRunFeet = minRunInches / 12;

  const actualSlopePct = (1 / maxSlopeRatio) * 100;

  // 2010 ADA Standards §405.2: running slope not steeper than 1:12 (checked on access-board.gov, 2026-11-24).
  const isCompliant = maxSlopeRatio >= 12;
  const notes: string[] = [
    `Under 2010 ADA Standards §405.2, ramp runs must have a running slope not steeper than 1:12 (8.33%).`,
    ...(isCompliant
      ? []
      : [
          `A 1:${maxSlopeRatio} slope is steeper than 1:12, so it does not meet §405.2 for new construction (§405.2 has a limited exception for existing sites only).`,
        ]),
    `A total rise of ${totalRiseInches} in requires a minimum total horizontal ramp run of ${minRunFeet} ft (${minRunInches} in).`,
  ];

  if (runsCount > 1) {
    notes.push(
      `Because total rise exceeds 30 in (ADA §405.6), the ramp must be split into at least ${runsCount} runs, separated by at least ${landingsCount} level intermediate landing(s) of at least 60 in length (ADA §405.7).`
    );
  } else {
    notes.push(`The total rise is within the 30 in single-run maximum (ADA §405.6). A single continuous run is compliant.`);
  }

  return {
    totalRiseInches,
    maxSlopeRatio,
    minRunFeet,
    minRunInches,
    runsCount,
    landingsCount,
    maxRisePerRunInches: maxRisePerRun,
    actualSlopePct,
    isCompliant,
    citation: '2010 ADA Standards for Accessible Design §§405.2, 405.6, 405.7',
    notes,
  };
}

/**
 * Calculates two-point linear equation, slope, and distance:
 * m = (y2 - y1) / (x2 - x1)
 * b = y1 - m * x1
 * distance = sqrt((x2 - x1)^2 + (y2 - y1)^2)
 */
export function calculateTwoPointSlope(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): TwoPointSlopeResult {
  const steps: string[] = [];
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;

  steps.push(`Point 1: (${x1}, ${y1}); Point 2: (${x2}, ${y2})`);
  steps.push(`Change in y (Δy) = y₂ − y₁ = ${y2} − ${y1} = ${deltaY}`);
  steps.push(`Change in x (Δx) = x₂ − x₁ = ${x2} − ${x1} = ${deltaX}`);

  if (deltaX === 0) {
    steps.push(`Vertical line (Δx = 0). Slope is undefined; equation is x = ${x1}.`);
    return {
      x1,
      y1,
      x2,
      y2,
      deltaX: 0,
      deltaY,
      slope: Infinity,
      isVertical: true,
      yIntercept: null,
      equation: `x = ${x1}`,
      distance: Math.abs(deltaY),
      rateOfChange: Infinity,
      steps,
    };
  }

  const m = deltaY / deltaX;
  const b = y1 - m * x1;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  steps.push(`Slope m = Δy ÷ Δx = ${deltaY} ÷ ${deltaX} = ${m.toFixed(4)}`);
  steps.push(`y-intercept b = y₁ − m × x₁ = ${y1} − (${m.toFixed(4)} × ${x1}) = ${b.toFixed(4)}`);

  let equation: string;
  if (m === 0) {
    equation = `y = ${b.toFixed(4)}`;
  } else {
    const sign = b >= 0 ? '+' : '−';
    const absB = Math.abs(b);
    equation = b === 0 ? `y = ${m.toFixed(4)}x` : `y = ${m.toFixed(4)}x ${sign} ${absB.toFixed(4)}`;
  }

  steps.push(`Slope-Intercept Equation: ${equation}`);
  steps.push(`Euclidean Distance = √(Δx² + Δy²) = √(${deltaX * deltaX} + ${deltaY * deltaY}) ≈ ${distance.toFixed(4)}`);

  return {
    x1,
    y1,
    x2,
    y2,
    deltaX,
    deltaY,
    slope: m,
    isVertical: false,
    yIntercept: b,
    equation,
    distance,
    rateOfChange: m,
    steps,
  };
}

/**
 * Checks a table of (x, y) coordinates for linearity and rates of change.
 */
export function analyzeTableSlope(points: Array<{ x: number; y: number }>): TableSlopeResult {
  if (points.length < 2) {
    throw new Error('Table must contain at least 2 coordinate points.');
  }

  // Sort ascending by x
  const sorted = [...points].sort((a, b) => a.x - b.x);
  const slopes: number[] = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const dx = sorted[i + 1].x - sorted[i].x;
    const dy = sorted[i + 1].y - sorted[i].y;
    if (dx === 0) {
      slopes.push(Infinity);
    } else {
      slopes.push(dy / dx);
    }
  }

  const firstSlope = slopes[0];
  const isLinear = slopes.every((s) => Math.abs(s - firstSlope) < 1e-6);
  const validSlopes = slopes.filter((s) => isFinite(s));
  const avgSlope = validSlopes.length > 0 ? validSlopes.reduce((acc, v) => acc + v, 0) / validSlopes.length : 0;

  const notes: string[] = [];
  if (isLinear) {
    const b = sorted[0].y - firstSlope * sorted[0].x;
    const sign = b >= 0 ? '+' : '−';
    const absB = Math.abs(b);
    const eq = b === 0 ? `y = ${firstSlope}x` : `y = ${firstSlope}x ${sign} ${absB.toFixed(2)}`;
    notes.push(`The relationship is perfectly linear with constant rate of change m = ${firstSlope}. Equation: ${eq}`);
    return {
      points: sorted,
      slopes,
      isLinear: true,
      averageSlope: firstSlope,
      equation: eq,
      notes,
    };
  } else {
    notes.push(`The relationship is non-linear. The rate of change varies between consecutive intervals (average rate of change ≈ ${avgSlope.toFixed(4)}).`);
    return {
      points: sorted,
      slopes,
      isLinear: false,
      averageSlope: avgSlope,
      notes,
    };
  }
}
