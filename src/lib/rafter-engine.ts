/**
 * Pure Rafter Calculation Engine for kkctools.com
 * Evaluates gable & shed roofs, pitch/angle/rise-and-run, cut angles, birdsmouth,
 * buy lengths, and rafter quantities.
 * All internal geometry calculated in INCHES.
 */

const DEG = Math.PI / 180;
export const STOCK_LENGTHS_IN = [96, 120, 144, 168, 192, 216, 240]; // 8 to 20 ft

export type RoofType = 'gable' | 'shed';
export type PitchMode = 'pitch' | 'angle' | 'riseRun';

export interface RafterCalcInput {
  roofType: RoofType;
  span: number; // inches
  pitchMode: PitchMode;
  pitch?: number; // rise per 12 in of run (e.g. 6)
  angleDeg?: number; // angle in degrees (e.g. 26.57)
  totalRise?: number; // inches
  overhang?: number; // horizontal inches (default 0)
  ridgeThickness?: number; // inches (default 1.5, gable only)
  rafterDepth?: number; // actual depth in inches: 2x6=5.5, 2x8=7.25, 2x10=9.25, 2x12=11.25
  plateWidth?: number; // actual wall plate width: 2x4=3.5, 2x6=5.5
  spacing?: number; // on-center inches (12, 16, 19.2, 24)
  buildingLength?: number; // inches (optional, for rafter count)
}

export interface RafterCountResult {
  perSide: number;
  total: number;
}

export interface RafterCalcResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
  pitchPer12: number;
  slopePercent: number;
  angleDeg: number;
  slopeFactor: number;
  run: number;
  effRun: number;
  totalRise: number;
  mainLen: number;
  overhangLen: number;
  totalLen: number; // along top edge in inches
  longPoint: number; // tail long-point
  buyLen: number | null; // inches (96 to 240)
  plumbCutAngle: number; // degrees from square cut
  levelCutAngle: number; // degrees from square cut
  seatCut: number; // inches
  heelDepth: number; // inches
  heelRatio: number; // heelDepth / rafterDepth
  rafterCount: RafterCountResult | null;
}

export function calcRafter(i: RafterCalcInput): RafterCalcResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const isShed = i.roofType === 'shed';
  const span = Number(i.span);
  const overhang = Number(i.overhang ?? 0);
  const ridgeT = isShed ? 0 : Number(i.ridgeThickness ?? 1.5);
  const depth = Number(i.rafterDepth ?? 7.25);
  const plate = Number(i.plateWidth ?? 3.5);

  if (!(span > 0)) errors.push('Span must be greater than 0.');
  const run = isShed ? span : span / 2;

  let slope = 0;
  if (i.pitchMode === 'angle') {
    const a = Number(i.angleDeg);
    if (!(a > 0 && a < 80)) errors.push('Angle must be between 0° and 80°.');
    slope = Math.tan(a * DEG);
  } else if (i.pitchMode === 'riseRun') {
    const tr = Number(i.totalRise);
    if (!(tr > 0)) errors.push('Total rise must be greater than 0.');
    slope = tr / (run > 0 ? run : 1);
  } else {
    const p = Number(i.pitch);
    if (!(p > 0 && p <= 24)) errors.push('Pitch must be between 0 and 24 (rise per 12 in of run).');
    slope = p / 12;
  }

  if (overhang < 0) errors.push('Overhang cannot be negative.');
  if (overhang > run && run > 0) errors.push('Overhang is longer than the run — please check your values.');
  if (ridgeT < 0) errors.push('Ridge thickness cannot be negative.');
  if (!isShed && run - ridgeT / 2 <= 0 && run > 0) errors.push('Ridge thickness is too large for this span.');

  if (errors.length) {
    return {
      ok: false,
      errors,
      warnings,
      pitchPer12: 0,
      slopePercent: 0,
      angleDeg: 0,
      slopeFactor: 1,
      run: 0,
      effRun: 0,
      totalRise: 0,
      mainLen: 0,
      overhangLen: 0,
      totalLen: 0,
      longPoint: 0,
      buyLen: null,
      plumbCutAngle: 0,
      levelCutAngle: 90,
      seatCut: plate,
      heelDepth: 0,
      heelRatio: 0,
      rafterCount: null,
    };
  }

  const k = Math.sqrt(1 + slope * slope);
  const angle = Math.atan(slope) / DEG;
  const effRun = run - ridgeT / 2;
  const mainLen = effRun * k;
  const overhangLen = overhang * k;
  const totalLen = mainLen + overhangLen;
  const totalRise = run * slope;
  const longPoint = totalLen + depth * slope;
  const buyLen = STOCK_LENGTHS_IN.find((l) => l >= longPoint) ?? null;

  const heelDepth = plate * slope;
  const heelRatio = depth > 0 ? heelDepth / depth : 0;

  if (buyLen === null) {
    warnings.push(
      'Longer than standard 20 ft lumber — consider engineered lumber, a purlin/mid-support design, or ask a pro.'
    );
  }
  if (heelRatio >= 1) {
    warnings.push('Birdsmouth is as deep as the rafter — use a bigger rafter or a shorter seat.');
  } else if (heelRatio > 1 / 3) {
    warnings.push('Birdsmouth removes more than 1/3 of the rafter depth — use a deeper rafter or a shorter seat.');
  } else if (heelRatio > 1 / 4) {
    warnings.push('Birdsmouth is deeper than 1/4 of the rafter depth — check your local code.');
  }
  if (slope * 12 > 12) {
    warnings.push('Steep roof (over 12/12) — use fall protection and consult a pro.');
  }

  let rafterCount: RafterCountResult | null = null;
  if (i.buildingLength && i.buildingLength > 0 && i.spacing && i.spacing > 0) {
    const perSide = Math.floor(i.buildingLength / i.spacing) + 1;
    rafterCount = { perSide, total: isShed ? perSide : perSide * 2 };
  }

  return {
    ok: true,
    errors,
    warnings,
    pitchPer12: slope * 12,
    slopePercent: slope * 100,
    angleDeg: angle,
    slopeFactor: k,
    run,
    effRun,
    totalRise,
    mainLen,
    overhangLen,
    totalLen,
    longPoint,
    buyLen,
    plumbCutAngle: angle,
    levelCutAngle: 90 - angle,
    seatCut: plate,
    heelDepth,
    heelRatio,
    rafterCount,
  };
}

/**
 * Format decimal inches to clean Feet & Fractional Inches (e.g. 173.5748 -> "14' 5 9/16\"")
 */
export function formatFtIn(inches: number, denom = 16): string {
  if (!Number.isFinite(inches) || inches < 0) return '0\' 0"';
  const total = Math.round(inches * denom) / denom;
  let ft = Math.floor(total / 12);
  const rem = total - ft * 12;
  let whole = Math.floor(rem);
  let num = Math.round((rem - whole) * denom);
  if (num === denom) {
    whole += 1;
    num = 0;
  }
  if (whole === 12) {
    ft += 1;
    whole = 0;
  }
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  let frac = '';
  if (num) {
    const d = gcd(num, denom);
    frac = ` ${num / d}/${denom / d}`;
  }
  return `${ft}' ${whole}${frac}"`;
}

