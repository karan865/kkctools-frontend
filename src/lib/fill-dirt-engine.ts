/**
 * Fill Dirt & Soil calculation engine for kkctools.com
 * Handles:
 * - Multi-section areas (Rectangle, Circle, Triangle, Known Area) up to 10 areas
 * - Uniform depth or Sloped depth (shallow + deep / 2)
 * - Settling / Extra allowance (0–50%)
 * - Optional Materials (None, Fill Dirt ~2,700 lb/yd3, Topsoil ~2,200 lb/yd3, Custom)
 * - Optional Truckloads from user capacity only
 * - US & Metric units
 */

export type UnitSystem = 'us' | 'metric';
export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'known';
export type DepthType = 'uniform' | 'sloped';
export type SoilMaterial = 'none' | 'fill-dirt' | 'topsoil' | 'custom';

export interface AreaRow {
  id: string;
  label?: string;
  shape: ShapeType;
  // Rectangle
  lengthFt?: number;
  widthFt?: number;
  lengthM?: number;
  widthM?: number;
  // Circle
  diameterFt?: number;
  diameterM?: number;
  // Triangle
  baseFt?: number;
  heightFt?: number;
  baseM?: number;
  heightM?: number;
  // Known area
  knownAreaSqFt?: number;
  knownAreaSqM?: number;
  // Depth
  depthType: DepthType;
  depthInches?: number; // for uniform
  depthCm?: number;
  shallowDepthInches?: number; // for sloped
  deepDepthInches?: number;
  shallowDepthCm?: number;
  deepDepthCm?: number;
}

export interface FillDirtInputs {
  unitSystem: UnitSystem;
  areas: AreaRow[];
  extraSettlingPercent: number; // default 10%
  material: SoilMaterial;
  customDensityLbPerYd3?: number;
  truckCapacityYd3?: number; // optional, blank by default
}

export interface MathStep {
  step: string;
  formula: string;
  result: string;
}

export interface FillDirtResult {
  totalRawVolumeCuFt: number;
  totalRawVolumeCuYd: number;
  volumeWithExtraCuFt: number;
  volumeWithExtraCuYd: number;
  // Metric
  totalRawVolumeM3: number;
  volumeWithExtraM3: number;
  // Optional Material Weight
  densityLbPerYd3?: number;
  weightLbWithExtra?: number;
  weightTonsWithExtra?: number;
  weightKgWithExtra?: number;
  weightTonnesWithExtra?: number;
  // Optional Truckloads
  truckloads?: number;
  truckCapacityYd3?: number;
  mathSteps: MathStep[];
}

export const DENSITIES_LB_PER_YD3 = {
  'fill-dirt': 2700,
  topsoil: 2200,
};

export const LB_PER_YD3_TO_KG_PER_M3 = 0.593276421;

export function ceilSafe(val: number): number {
  if (val <= 0 || !Number.isFinite(val)) return 0;
  return Math.ceil(val - 1e-9);
}

/**
 * Calculate Fill Dirt volume, weight, and truckloads
 */
export function calculateFillDirt(inputs: FillDirtInputs): FillDirtResult {
  const isMetric = inputs.unitSystem === 'metric';
  const extra = Math.max(0, Math.min(50, inputs.extraSettlingPercent || 0)) / 100;
  const extraMultiplier = 1 + extra;

  let totalRawCuFt = 0;
  let totalRawM3 = 0;
  const mathSteps: MathStep[] = [];

  inputs.areas.forEach((row, idx) => {
    const label = row.label || `Area ${idx + 1}`;
    let areaSqFt = 0;
    let areaM2 = 0;
    let effectiveDepthInches = 0;
    let effectiveDepthCm = 0;

    // 1. Calculate Area
    if (row.shape === 'rectangle') {
      if (isMetric) {
        areaM2 = (row.lengthM || 0) * (row.widthM || 0);
        areaSqFt = areaM2 * 10.7639104;
      } else {
        areaSqFt = (row.lengthFt || 0) * (row.widthFt || 0);
        areaM2 = areaSqFt / 10.7639104;
      }
    } else if (row.shape === 'circle') {
      if (isMetric) {
        const r = (row.diameterM || 0) / 2;
        areaM2 = Math.PI * r * r;
        areaSqFt = areaM2 * 10.7639104;
      } else {
        const r = (row.diameterFt || 0) / 2;
        areaSqFt = Math.PI * r * r;
        areaM2 = areaSqFt / 10.7639104;
      }
    } else if (row.shape === 'triangle') {
      if (isMetric) {
        areaM2 = 0.5 * (row.baseM || 0) * (row.heightM || 0);
        areaSqFt = areaM2 * 10.7639104;
      } else {
        areaSqFt = 0.5 * (row.baseFt || 0) * (row.heightFt || 0);
        areaM2 = areaSqFt / 10.7639104;
      }
    } else if (row.shape === 'known') {
      if (isMetric) {
        areaM2 = row.knownAreaSqM || 0;
        areaSqFt = areaM2 * 10.7639104;
      } else {
        areaSqFt = row.knownAreaSqFt || 0;
        areaM2 = areaSqFt / 10.7639104;
      }
    }

    // 2. Calculate Effective Depth
    if (row.depthType === 'sloped') {
      if (isMetric) {
        effectiveDepthCm = ((row.shallowDepthCm || 0) + (row.deepDepthCm || 0)) / 2;
        effectiveDepthInches = effectiveDepthCm / 2.54;
      } else {
        effectiveDepthInches = ((row.shallowDepthInches || 0) + (row.deepDepthInches || 0)) / 2;
        effectiveDepthCm = effectiveDepthInches * 2.54;
      }
    } else {
      if (isMetric) {
        effectiveDepthCm = row.depthCm || 0;
        effectiveDepthInches = effectiveDepthCm / 2.54;
      } else {
        effectiveDepthInches = row.depthInches || 0;
        effectiveDepthCm = effectiveDepthInches * 2.54;
      }
    }

    // 3. Compute Row Volume
    let rowCuFt = 0;
    let rowM3 = 0;

    if (isMetric) {
      // areaM2 * depthM
      rowM3 = areaM2 * (effectiveDepthCm / 100);
      rowCuFt = rowM3 * 35.3146667;
    } else {
      // areaSqFt * depthFt
      rowCuFt = areaSqFt * (effectiveDepthInches / 12);
      rowM3 = rowCuFt / 35.3146667;
    }

    totalRawCuFt += rowCuFt;
    totalRawM3 += rowM3;

    mathSteps.push({
      step: `${label} (${row.shape}, ${row.depthType})`,
      formula: isMetric
        ? `Area = ${areaM2.toFixed(2)} m², Depth = ${effectiveDepthCm.toFixed(1)} cm`
        : `Area = ${areaSqFt.toFixed(2)} sq ft, Depth = ${effectiveDepthInches.toFixed(2)} in`,
      result: `${rowCuFt.toFixed(2)} cu ft (${(rowCuFt / 27).toFixed(2)} cu yd) [${rowM3.toFixed(2)} m³]`,
    });
  });

  const totalRawVolumeCuFt = totalRawCuFt;
  const totalRawVolumeCuYd = totalRawVolumeCuFt / 27;
  const totalRawVolumeM3 = totalRawM3;

  const volumeWithExtraCuFt = totalRawVolumeCuFt * extraMultiplier;
  const volumeWithExtraCuYd = totalRawVolumeCuYd * extraMultiplier;
  const volumeWithExtraM3 = totalRawVolumeM3 * extraMultiplier;

  mathSteps.push(
    {
      step: 'Total Raw Volume',
      formula: 'Sum of all section volumes',
      result: `${totalRawVolumeCuFt.toFixed(2)} ft³ (${totalRawVolumeCuYd.toFixed(2)} yd³) [${totalRawVolumeM3.toFixed(2)} m³]`,
    },
    {
      step: `Extra for Settling (${inputs.extraSettlingPercent}%)`,
      formula: `Raw Volume × (1 + ${inputs.extraSettlingPercent}/100)`,
      result: `${volumeWithExtraCuFt.toFixed(2)} ft³ (${volumeWithExtraCuYd.toFixed(2)} yd³) [${volumeWithExtraM3.toFixed(2)} m³]`,
    }
  );

  // Optional Material Weight
  let densityLbPerYd3: number | undefined;
  let weightLbWithExtra: number | undefined;
  let weightTonsWithExtra: number | undefined;
  let weightKgWithExtra: number | undefined;
  let weightTonnesWithExtra: number | undefined;

  if (inputs.material !== 'none') {
    if (inputs.material === 'fill-dirt') {
      densityLbPerYd3 = DENSITIES_LB_PER_YD3['fill-dirt'];
    } else if (inputs.material === 'topsoil') {
      densityLbPerYd3 = DENSITIES_LB_PER_YD3['topsoil'];
    } else if (inputs.material === 'custom' && inputs.customDensityLbPerYd3) {
      densityLbPerYd3 = inputs.customDensityLbPerYd3;
    }

    if (densityLbPerYd3) {
      const densityKgPerM3 = densityLbPerYd3 * LB_PER_YD3_TO_KG_PER_M3;
      weightLbWithExtra = volumeWithExtraCuYd * densityLbPerYd3;
      weightTonsWithExtra = weightLbWithExtra / 2000;
      weightKgWithExtra = volumeWithExtraM3 * densityKgPerM3;
      weightTonnesWithExtra = weightKgWithExtra / 1000;

      mathSteps.push({
        step: `Estimated Weight (${inputs.material})`,
        formula: `${volumeWithExtraCuYd.toFixed(2)} yd³ × ${densityLbPerYd3.toLocaleString()} lb/yd³ ÷ 2,000`,
        result: `${weightTonsWithExtra.toFixed(2)} tons (${weightLbWithExtra.toFixed(0)} lb) [${weightTonnesWithExtra.toFixed(2)} tonnes]`,
      });
    }
  }

  // Optional Truckloads
  let truckloads: number | undefined;
  if (inputs.truckCapacityYd3 && inputs.truckCapacityYd3 > 0) {
    truckloads = ceilSafe(volumeWithExtraCuYd / inputs.truckCapacityYd3);
    mathSteps.push({
      step: 'Estimated Truckloads',
      formula: `${volumeWithExtraCuYd.toFixed(2)} yd³ ÷ ${inputs.truckCapacityYd3} yd³/load, rounded up`,
      result: `${truckloads} truckloads`,
    });
  }

  return {
    totalRawVolumeCuFt,
    totalRawVolumeCuYd,
    volumeWithExtraCuFt,
    volumeWithExtraCuYd,
    totalRawVolumeM3,
    volumeWithExtraM3,
    densityLbPerYd3,
    weightLbWithExtra,
    weightTonsWithExtra,
    weightKgWithExtra,
    weightTonnesWithExtra,
    truckloads,
    truckCapacityYd3: inputs.truckCapacityYd3,
    mathSteps,
  };
}

