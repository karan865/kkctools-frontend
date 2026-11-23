/**
 * machining-engine.ts
 * Pure calculation engine for CNC speeds, feeds, surface speed (SFM), and line speeds.
 * Used by:
 * - /speeds-and-feeds-calculator/
 * - /sfm-to-rpm-calculator/
 * - /pulley-calculator/
 * 
 * Rules:
 * - Exact π maths everywhere (never 3.14, 3.82 or 0.262 shortcuts in engine calculations).
 * - Return null for zero or negative dimensions/speeds; never NaN or Infinity.
 * - Normalize -0 to 0.
 */

export interface LineSpeedResult {
  ftPerMin: number;
  mPerMin: number;
  mPerSec: number;
  mph: number;
}

export interface MachineLimits {
  minRpm?: number;
  maxRpm?: number;
  maxFeedIpm?: number;
}

export interface ScaledMachiningResult {
  targetRpm: number;
  actualRpm: number;
  targetFeedIpm: number;
  actualFeedIpm: number;
  targetChipLoad: number;
  actualChipLoad: number;
  targetSfm: number;
  actualSfm: number;
  isRpmCapped: boolean;
  isFeedCapped: boolean;
  warnings: string[];
}

/**
 * Spindle RPM from Surface Feet per Minute (SFM) and tool/workpiece diameter (inches).
 * Formula: RPM = (12 × SFM) / (π × D_in)
 */
export function rpmFromSfm(sfm: number, diaIn: number): number | null {
  if (sfm <= 0 || diaIn <= 0) return null;
  const rpm = (12 * sfm) / (Math.PI * diaIn);
  return rpm > 0 ? rpm : null;
}

/**
 * Surface Feet per Minute (SFM) from spindle RPM and diameter (inches).
 * Formula: SFM = (π × D_in × RPM) / 12
 */
export function sfmFromRpm(rpm: number, diaIn: number): number | null {
  if (rpm <= 0 || diaIn <= 0) return null;
  const sfm = (Math.PI * diaIn * rpm) / 12;
  return sfm > 0 ? sfm : null;
}

/**
 * Tool or workpiece diameter (inches) from SFM and RPM.
 * Formula: D_in = (12 × SFM) / (π × RPM)
 */
export function diaFromSfmRpm(sfm: number, rpm: number): number | null {
  if (sfm <= 0 || rpm <= 0) return null;
  const dia = (12 * sfm) / (Math.PI * rpm);
  return dia > 0 ? dia : null;
}

/**
 * Spindle RPM from cutting speed Vc (meters per minute) and diameter (mm).
 * Formula: RPM = (1000 × Vc) / (π × D_mm)
 */
export function rpmFromVc(vcMPerMin: number, diaMm: number): number | null {
  if (vcMPerMin <= 0 || diaMm <= 0) return null;
  const rpm = (1000 * vcMPerMin) / (Math.PI * diaMm);
  return rpm > 0 ? rpm : null;
}

/**
 * Cutting speed Vc (m/min) from spindle RPM and diameter (mm).
 * Formula: Vc = (π × D_mm × RPM) / 1000
 */
export function vcFromRpm(rpm: number, diaMm: number): number | null {
  if (rpm <= 0 || diaMm <= 0) return null;
  const vc = (Math.PI * diaMm * rpm) / 1000;
  return vc > 0 ? vc : null;
}

/**
 * Linear feed rate (inches/min or mm/min depending on chip load unit).
 * Formula: Feed = RPM × Flutes × Chip Load (feed per tooth)
 */
export function feedRate(rpm: number, flutes: number, chipLoad: number): number | null {
  if (rpm <= 0 || flutes <= 0 || chipLoad <= 0) return null;
  return rpm * flutes * chipLoad;
}

/**
 * Chip load per tooth from feed rate, RPM, and flute count.
 * Formula: Chip Load = Feed / (RPM × Flutes)
 */
export function chipLoadFromFeed(feed: number, rpm: number, flutes: number): number | null {
  if (feed <= 0 || rpm <= 0 || flutes <= 0) return null;
  return feed / (rpm * flutes);
}

/**
 * Radial chip thinning factor.
 * When radial depth of cut (width of cut / stepover WOC) is less than half the cutter diameter (WOC < D/2),
 * the actual chip thickness is less than programmed advance per tooth.
 * Thinning factor = D / (2 × √(D × WOC - WOC²))
 */
export function chipThinningFactor(woc: number, dia: number): number {
  if (woc <= 0 || dia <= 0) return 1;
  const radius = dia / 2;
  if (woc >= radius) return 1;
  const underRadical = dia * woc - woc * woc;
  if (underRadical <= 0) return 1;
  const factor = dia / (2 * Math.sqrt(underRadical));
  return factor >= 1 ? factor : 1;
}

/**
 * Material Removal Rate (MRR) in in³/min or mm³/min.
 * Formula: MRR = WOC × DOC × Feed
 */
export function materialRemovalRate(woc: number, doc: number, feed: number): number | null {
  if (woc <= 0 || doc <= 0 || feed <= 0) return null;
  return woc * doc * feed;
}

/**
 * Drilling feed rate.
 * Formula: Feed = RPM × IPR (inches per revolution or mm per revolution)
 */
export function drillFeed(rpm: number, ipr: number): number | null {
  if (rpm <= 0 || ipr <= 0) return null;
  return rpm * ipr;
}

/**
 * Tapping feed rate.
 * Formula: Feed = RPM × Pitch
 * If isTpi is true, pitch is 1 / TPI (threads per inch).
 */
export function tapFeed(rpm: number, pitchOrTpi: number, isTpi = false): number | null {
  if (rpm <= 0 || pitchOrTpi <= 0) return null;
  const pitch = isTpi ? 1 / pitchOrTpi : pitchOrTpi;
  return rpm * pitch;
}

/**
 * Line speed from roller/pulley diameter and RPM, with optional belt thickness, slip, and gear ratio.
 * Formula:
 * effective diameter = diaIn + beltThicknessIn
 * ft/min = (π × D_eff × RPM / 12) × (1 - slipPct/100) × gearRatio
 */
export function lineSpeed(
  rpm: number,
  diaIn: number,
  beltThicknessIn: number = 0,
  slipPct: number = 0,
  gearRatio: number = 1
): LineSpeedResult | null {
  if (rpm <= 0 || diaIn <= 0) return null;
  const effDia = diaIn + Math.max(0, beltThicknessIn);
  const safeSlip = Math.min(100, Math.max(0, slipPct)) / 100;
  const safeRatio = Math.max(0.0001, gearRatio);

  const ftPerMin = ((Math.PI * effDia * rpm) / 12) * (1 - safeSlip) * safeRatio;
  const mPerMin = ftPerMin * 0.3048;
  const mPerSec = mPerMin / 60;
  const mph = (ftPerMin * 60) / 5280;

  return {
    ftPerMin: ftPerMin === 0 ? 0 : ftPerMin,
    mPerMin: mPerMin === 0 ? 0 : mPerMin,
    mPerSec: mPerSec === 0 ? 0 : mPerSec,
    mph: mph === 0 ? 0 : mph,
  };
}

/**
 * Scale RPM and Feed against machine limits and recalculate actual chip load and SFM.
 *
 * Order (keeps the cut safe):
 * 1. Clamp RPM to the machine's min/max.
 * 2. If RPM changed, scale the feed with it so the chip load per tooth stays at the target
 *    (feed = actualRpm × flutes × targetChipLoad). Keeping the old feed at a lower RPM would
 *    silently overload each tooth.
 * 3. Clamp the feed to the machine's max feed; this lowers the chip load (warned).
 * Warnings are relative to the user's own target; no fixed material thresholds are assumed.
 */
export function scaleToLimits(
  idealRpm: number,
  idealFeedIpm: number,
  flutes: number,
  diaIn: number,
  limits: MachineLimits = {}
): ScaledMachiningResult {
  let actualRpm = idealRpm;
  const warnings: string[] = [];
  let isRpmCapped = false;
  let isFeedCapped = false;

  const targetChipLoad = chipLoadFromFeed(idealFeedIpm, idealRpm, flutes) || 0;

  if (limits.maxRpm && actualRpm > limits.maxRpm) {
    actualRpm = limits.maxRpm;
    isRpmCapped = true;
    warnings.push(
      `Target spindle RPM (${Math.round(idealRpm)}) exceeds machine maximum (${limits.maxRpm} RPM). Capped at ${limits.maxRpm} RPM; feed reduced to keep the same chip load, so surface speed is lower than planned.`
    );
  }

  if (limits.minRpm && actualRpm < limits.minRpm) {
    actualRpm = limits.minRpm;
    warnings.push(
      `Target spindle RPM (${Math.round(idealRpm)}) is below machine minimum (${limits.minRpm} RPM). Raised to ${limits.minRpm} RPM; feed raised to keep the same chip load, so surface speed is higher than planned.`
    );
  }

  // Keep the target chip load when RPM had to change.
  let actualFeed = actualRpm !== idealRpm && targetChipLoad > 0
    ? actualRpm * flutes * targetChipLoad
    : idealFeedIpm;

  if (limits.maxFeedIpm && actualFeed > limits.maxFeedIpm) {
    const wantedFeed = actualFeed;
    actualFeed = limits.maxFeedIpm;
    isFeedCapped = true;
    warnings.push(
      `Feed rate needed (${wantedFeed.toFixed(1)} IPM) exceeds machine maximum (${limits.maxFeedIpm} IPM). Capped at ${limits.maxFeedIpm} IPM.`
    );
  }

  const actualChipLoad = chipLoadFromFeed(actualFeed, actualRpm, flutes) || 0;
  const targetSfm = sfmFromRpm(idealRpm, diaIn) || 0;
  const actualSfm = sfmFromRpm(actualRpm, diaIn) || 0;

  if (targetChipLoad > 0 && actualChipLoad < targetChipLoad * 0.5) {
    warnings.push(
      `Actual chip load (${actualChipLoad.toFixed(4)}) is less than half your target (${targetChipLoad.toFixed(4)}). Thin chips can make the tool rub and heat up; check your tool maker's minimum chip load.`
    );
  }

  return {
    targetRpm: idealRpm,
    actualRpm,
    targetFeedIpm: idealFeedIpm,
    actualFeedIpm: actualFeed,
    targetChipLoad,
    actualChipLoad,
    targetSfm,
    actualSfm,
    isRpmCapped,
    isFeedCapped,
    warnings,
  };
}
