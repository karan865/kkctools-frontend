/**
 * Tank Volume & Dipstick Calculation Engine
 * Pure TypeScript, zero network calls, fully deterministic.
 */

export type TankShape =
  | 'horizontal-cylinder'
  | 'vertical-cylinder'
  | 'rectangle'
  | 'sphere'
  | 'cone-bottom';

export type TankHeadType = 'flat' | 'hemispherical' | 'elliptical-2-1';

export interface TankDimensions {
  shape: TankShape;
  headType?: TankHeadType;
  // Dimensions in feet
  diameter?: number; // for cylinders, spheres, cones
  length?: number; // for horizontal tanks, rectangles
  height?: number; // for vertical tanks, rectangles
  width?: number; // for rectangles
  coneHeight?: number; // for cone-bottom tanks
}

export interface TankVolumeResult {
  totalCuFt: number;
  totalUsGal: number;
  totalImpGal: number;
  totalLiters: number;
  totalCuMeters: number;
  totalBarrels: number; // 42 US gal per bbl
  // Partial fill results (if depth provided)
  depthFt?: number;
  filledCuFt?: number;
  filledUsGal?: number;
  filledImpGal?: number;
  filledLiters?: number;
  filledCuMeters?: number;
  filledBarrels?: number;
  percentFull?: number;
  ullageFt?: number; // gap from liquid surface to top
  weightLbs?: number; // liquid weight if density provided
  steps: string[];
}

export interface DipstickEntry {
  depthInches: number;
  depthFormatted: string; // e.g. "12″" or "1′ 0″"
  gallons: number;
  liters: number;
  percentFull: number;
}

import {
  US_GAL_PER_FT3,
  EXACT_LITRES_PER_US_GAL,
  EXACT_LITRES_PER_IMP_GAL,
  EXACT_LITRES_PER_FT3,
  EXACT_US_GAL_PER_BARREL,
} from './volume-units-engine';

// Exact factors from the shared volume engine (1 US gal = 231 in³, 1 ft³ = 1,728 in³, 1 in = 2.54 cm).
export const CU_FT_TO_US_GAL = US_GAL_PER_FT3; // 1728 / 231 = 7.480519…
export const US_GAL_TO_LITERS = EXACT_LITRES_PER_US_GAL; // 3.785411784
export const US_GAL_TO_IMP_GAL = EXACT_LITRES_PER_US_GAL / EXACT_LITRES_PER_IMP_GAL;
export const US_GAL_TO_BARRELS = 1 / EXACT_US_GAL_PER_BARREL;
export const CU_M_TO_LITERS = 1000;
export const CU_FT_TO_CU_M = EXACT_LITRES_PER_FT3 / 1000; // 0.028316846592

/** The liquid depth at which each shape is full (ft). */
export function maxFillDepthFt(dimensions: TankDimensions): number {
  switch (dimensions.shape) {
    case 'rectangle':
    case 'vertical-cylinder':
      return dimensions.height ?? 0;
    case 'cone-bottom':
      return (dimensions.height ?? 0) + (dimensions.coneHeight ?? 0);
    default:
      return dimensions.diameter ?? 0; // horizontal cylinder, sphere
  }
}

/**
 * Calculates circular segment area for liquid depth h in a horizontal cylinder of radius r.
 * A(h) = r² * acos((r - h) / r) - (r - h) * sqrt(2rh - h²)
 */
export function circularSegmentArea(r: number, h: number): number {
  if (h <= 0) return 0;
  if (h >= 2 * r) return Math.PI * r * r;

  const cosArg = Math.max(-1, Math.min(1, (r - h) / r));
  const chordHalf = Math.sqrt(Math.max(0, 2 * r * h - h * h));
  return r * r * Math.acos(cosArg) - (r - h) * chordHalf;
}

/**
 * Partial fill volume of a spherical cap of depth h in a sphere of radius r:
 * V_cap = (pi * h^2 * (3r - h)) / 3
 */
export function sphericalCapVolume(r: number, h: number): number {
  if (h <= 0) return 0;
  if (h >= 2 * r) return (4 / 3) * Math.PI * r * r * r;
  return (Math.PI * h * h * (3 * r - h)) / 3;
}

/**
 * Primary tank capacity and partial fill calculation.
 * All dimensions passed to this function must be in FEET.
 */
export function calculateTankVolume(
  dimensions: TankDimensions,
  fillDepthFt?: number,
  liquidDensityLbsPerGal?: number
): TankVolumeResult {
  const steps: string[] = [];
  const { shape, headType = 'flat' } = dimensions;

  let totalCuFt = 0;
  let filledCuFt: number | undefined;
  const d = dimensions.diameter ?? 0;
  const r = d / 2;
  const L = dimensions.length ?? 0;
  const H = dimensions.height ?? 0;
  const W = dimensions.width ?? 0;
  const Hc = dimensions.coneHeight ?? 0;

  // Max depth check
  const maxDepthFt = maxFillDepthFt(dimensions);
  const depthFt = fillDepthFt !== undefined ? Math.max(0, Math.min(fillDepthFt, maxDepthFt)) : undefined;

  switch (shape) {
    case 'horizontal-cylinder': {
      if (r <= 0 || L <= 0) throw new Error('Diameter and length must be greater than zero.');

      // Main cylinder barrel
      const barrelCuFt = Math.PI * r * r * L;
      steps.push(`Cylinder barrel: π × r² × L = π × ${r}² × ${L} = ${barrelCuFt.toFixed(3)} cu ft`);

      // Head volumes (both ends combined)
      let headsTotalCuFt = 0;
      if (headType === 'hemispherical') {
        headsTotalCuFt = (4 / 3) * Math.PI * r * r * r;
        steps.push(`Hemispherical heads (both ends = 1 sphere): (4/3) × π × r³ = ${headsTotalCuFt.toFixed(3)} cu ft`);
      } else if (headType === 'elliptical-2-1') {
        // 2:1 elliptical head volume is half of a hemisphere: (2/3) * pi * r^3 for both heads
        headsTotalCuFt = (2 / 3) * Math.PI * r * r * r;
        steps.push(`2:1 elliptical heads (both ends): (2/3) × π × r³ = ${headsTotalCuFt.toFixed(3)} cu ft`);
      }

      totalCuFt = barrelCuFt + headsTotalCuFt;

      if (depthFt !== undefined) {
        const segArea = circularSegmentArea(r, depthFt);
        const barrelFilledCuFt = segArea * L;
        steps.push(
          `Filled circular segment area at ${depthFt} ft depth: A(h) = ${segArea.toFixed(4)} sq ft (barrel filled = ${barrelFilledCuFt.toFixed(3)} cu ft)`
        );

        let headsFilledCuFt = 0;
        if (headType === 'hemispherical') {
          // 2 caps of depth h
          // The two hemispherical heads together form one sphere: filled = one spherical cap of depth h.
          headsFilledCuFt = sphericalCapVolume(r, depthFt);
          steps.push(`Filled hemispherical heads: spherical cap at depth ${depthFt} ft = ${headsFilledCuFt.toFixed(3)} cu ft`);
        } else if (headType === 'elliptical-2-1') {
          // 2:1 elliptical cap is 0.5 * spherical cap
          headsFilledCuFt = 0.5 * sphericalCapVolume(r, depthFt);
          steps.push(`Filled 2:1 elliptical heads: 0.5 × spherical cap = ${headsFilledCuFt.toFixed(3)} cu ft`);
        }

        filledCuFt = barrelFilledCuFt + headsFilledCuFt;
      }
      break;
    }

    case 'vertical-cylinder': {
      if (r <= 0 || H <= 0) throw new Error('Diameter and height must be greater than zero.');
      totalCuFt = Math.PI * r * r * H;
      steps.push(`Vertical cylinder: π × r² × H = π × ${r}² × ${H} = ${totalCuFt.toFixed(3)} cu ft`);

      if (depthFt !== undefined) {
        filledCuFt = Math.PI * r * r * depthFt;
        steps.push(`Filled volume at ${depthFt} ft depth: π × r² × h = ${filledCuFt.toFixed(3)} cu ft`);
      }
      break;
    }

    case 'cone-bottom': {
      if (r <= 0 || H <= 0 || Hc <= 0) throw new Error('Diameter, cylinder height and cone height must be greater than zero.');
      const cylCuFt = Math.PI * r * r * H;
      const coneCuFt = (1 / 3) * Math.PI * r * r * Hc;
      totalCuFt = cylCuFt + coneCuFt;
      steps.push(`Cylinder section: π × r² × H = ${cylCuFt.toFixed(3)} cu ft`);
      steps.push(`Cone bottom: (1/3) × π × r² × H_cone = ${coneCuFt.toFixed(3)} cu ft`);
      steps.push(`Total tank capacity: ${totalCuFt.toFixed(3)} cu ft`);

      if (depthFt !== undefined) {
        if (depthFt <= Hc) {
          // Liquid is entirely in the cone
          const rh = (r * depthFt) / Hc;
          filledCuFt = (1 / 3) * Math.PI * rh * rh * depthFt;
          steps.push(`Depth ${depthFt} ft is inside cone bottom: filled = ${filledCuFt.toFixed(3)} cu ft`);
        } else {
          // Cone is full, plus partial cylinder above
          const cylDepth = depthFt - Hc;
          const cylPart = Math.PI * r * r * cylDepth;
          filledCuFt = coneCuFt + cylPart;
          steps.push(`Cone is full (${coneCuFt.toFixed(3)} cu ft) + cylinder filled ${cylDepth.toFixed(2)} ft (${cylPart.toFixed(3)} cu ft) = ${filledCuFt.toFixed(3)} cu ft`);
        }
      }
      break;
    }

    case 'rectangle': {
      if (L <= 0 || W <= 0 || H <= 0) throw new Error('Length, width and height must be greater than zero.');
      totalCuFt = L * W * H;
      steps.push(`Rectangular box: L × W × H = ${L} × ${W} × ${H} = ${totalCuFt.toFixed(3)} cu ft`);

      if (depthFt !== undefined) {
        filledCuFt = L * W * depthFt;
        steps.push(`Filled volume at depth ${depthFt} ft = ${filledCuFt.toFixed(3)} cu ft`);
      }
      break;
    }

    case 'sphere': {
      if (r <= 0) throw new Error('Diameter must be greater than zero.');
      totalCuFt = (4 / 3) * Math.PI * r * r * r;
      steps.push(`Sphere: (4/3) × π × r³ = ${totalCuFt.toFixed(3)} cu ft`);

      if (depthFt !== undefined) {
        filledCuFt = sphericalCapVolume(r, depthFt);
        steps.push(`Filled spherical cap at depth ${depthFt} ft = ${filledCuFt.toFixed(3)} cu ft`);
      }
      break;
    }
  }

  const totalUsGal = totalCuFt * CU_FT_TO_US_GAL;
  const totalImpGal = totalUsGal * US_GAL_TO_IMP_GAL;
  const totalLiters = totalUsGal * US_GAL_TO_LITERS;
  const totalCuMeters = totalCuFt * CU_FT_TO_CU_M;
  const totalBarrels = totalUsGal * US_GAL_TO_BARRELS;

  steps.push(`Converted to US Gallons: ${totalCuFt.toFixed(3)} cu ft × 7.48052 = ${totalUsGal.toFixed(1)} gal`);

  let filledUsGal: number | undefined;
  let filledImpGal: number | undefined;
  let filledLiters: number | undefined;
  let filledCuMeters: number | undefined;
  let filledBarrels: number | undefined;
  let percentFull: number | undefined;
  let ullageFt: number | undefined;
  let weightLbs: number | undefined;

  if (filledCuFt !== undefined && depthFt !== undefined) {
    filledUsGal = filledCuFt * CU_FT_TO_US_GAL;
    filledImpGal = filledUsGal * US_GAL_TO_IMP_GAL;
    filledLiters = filledUsGal * US_GAL_TO_LITERS;
    filledCuMeters = filledCuFt * CU_FT_TO_CU_M;
    filledBarrels = filledUsGal * US_GAL_TO_BARRELS;
    percentFull = totalCuFt > 0 ? (filledCuFt / totalCuFt) * 100 : 0;
    ullageFt = Math.max(0, maxDepthFt - depthFt);

    if (liquidDensityLbsPerGal && liquidDensityLbsPerGal > 0) {
      weightLbs = filledUsGal * liquidDensityLbsPerGal;
    }
  }

  return {
    totalCuFt,
    totalUsGal,
    totalImpGal,
    totalLiters,
    totalCuMeters,
    totalBarrels,
    depthFt,
    filledCuFt,
    filledUsGal,
    filledImpGal,
    filledLiters,
    filledCuMeters,
    filledBarrels,
    percentFull,
    ullageFt,
    weightLbs,
    steps,
  };
}

/**
 * Generates a dipstick strapping table (depth step in inches -> gallons, liters, % full).
 */
export function generateDipstickChart(
  dimensions: TankDimensions,
  stepInches = 1
): DipstickEntry[] {
  const maxDepthFt = maxFillDepthFt(dimensions);

  const maxInches = Math.round(maxDepthFt * 12);
  const entries: DipstickEntry[] = [];

  for (let inVal = 0; inVal <= maxInches; inVal += stepInches) {
    const curDepthFt = inVal / 12;
    const res = calculateTankVolume(dimensions, curDepthFt);

    const feet = Math.floor(inVal / 12);
    const remIn = inVal % 12;
    const formatted = feet > 0 ? `${feet}′ ${remIn}″` : `${remIn}″`;

    entries.push({
      depthInches: inVal,
      depthFormatted: formatted,
      gallons: Math.round((res.filledUsGal ?? 0) * 10) / 10,
      liters: Math.round((res.filledLiters ?? 0) * 10) / 10,
      percentFull: Math.round((res.percentFull ?? 0) * 10) / 10,
    });
  }

  return entries;
}

/**
 * Solves tank dimensions from a target volume (US Gallons):
 * e.g., given target 500 gallons and diameter 4 ft, calculates required cylinder length.
 */
export function solveTankSize(targetUsGal: number, knownDiameterFt: number): {
  requiredLengthFt: number;
  totalUsGal: number;
  totalCuFt: number;
} {
  if (targetUsGal <= 0 || knownDiameterFt <= 0) {
    throw new Error('Target gallons and diameter must be positive.');
  }

  const targetCuFt = targetUsGal / CU_FT_TO_US_GAL;
  const r = knownDiameterFt / 2;
  const crossSection = Math.PI * r * r;
  const requiredLengthFt = targetCuFt / crossSection;

  return {
    requiredLengthFt,
    totalUsGal: targetUsGal,
    totalCuFt: targetCuFt,
  };
}
