/**
 * Sand calculation engine for kkctools.com
 * Handles:
 * 1. Sand Volume (Rectangle, Circle, Multi-area sum) with Dry / Damp / Wet / Custom densities
 * 2. Paver Sand (Bedding layer)
 * 3. Polymeric Sand (Joints calculation based on paver dimensions, joint width, joint depth)
 */

export type UnitSystem = 'us' | 'metric';
export type SandCondition = 'dry' | 'damp' | 'wet' | 'custom';
export type AreaShape = 'rectangle' | 'circle';

export interface AreaSection {
  id: string;
  label?: string;
  shape: AreaShape;
  lengthFt?: number;
  widthFt?: number;
  diameterFt?: number;
  // Metric
  lengthM?: number;
  widthM?: number;
  diameterM?: number;
}

export interface SandVolumeInputs {
  unitSystem: UnitSystem;
  sections: AreaSection[];
  depthInches?: number; // US depth in inches (or ft if converted)
  depthCm?: number; // Metric depth in cm
  sandCondition: SandCondition;
  customDensityLbPerYd3?: number;
  customDensityKgPerM3?: number;
  wastePercent: number; // e.g. 10 for 10%
  bagSizeOption: '40' | '50' | '60' | '80' | 'customLb' | 'customCuFt' | '25kg';
  customBagWeightLb?: number;
  customBagVolumeCuFt?: number;
}

export interface PaverSandInputs {
  unitSystem: UnitSystem;
  areaSqFt?: number;
  areaSqM?: number;
  beddingDepthInches: number; // typical 1 in
  beddingDepthCm?: number;
  sandCondition: SandCondition;
  customDensityLbPerYd3?: number;
  wastePercent: number;
  bagSizeOption: '40' | '50' | '60' | '80' | '25kg';
}

export interface PolymericSandInputs {
  unitSystem: UnitSystem;
  totalAreaSqFt?: number;
  totalAreaSqM?: number;
  paverLengthInches: number; // e.g. 6 in
  paverWidthInches: number; // e.g. 9 in
  jointWidthInches: number; // e.g. 0.25 in
  jointDepthInches: number; // e.g. 2 in
  // Metric paver dimensions if metric
  paverLengthCm?: number;
  paverWidthCm?: number;
  jointWidthMm?: number;
  jointDepthCm?: number;
  wastePercent: number;
  bagWeightLb?: number; // default 50 lb
  optionalCoverageSqFtPerBag?: number;
}

export interface MathStep {
  step: string;
  formula: string;
  result: string;
}

export interface SandVolumeResult {
  rawVolumeCuFt: number;
  rawVolumeCuYd: number;
  volumeCuFtWithWaste: number;
  volumeCuYdWithWaste: number;
  // Metric
  rawVolumeM3: number;
  volumeM3WithWaste: number;
  // Weights
  densityLbPerYd3: number;
  densityKgPerM3: number;
  weightLbWithWaste: number;
  weightTonsWithWaste: number;
  weightKgWithWaste: number;
  weightTonnesWithWaste: number;
  // Bags
  totalBags: number;
  bagWeightOrVolLabel: string;
  mathSteps: MathStep[];
}

export interface PolymericSandResult {
  jointFraction: number; // fraction of surface that is joint
  jointVolumeCuFtRaw: number;
  jointVolumeCuFtWithWaste: number;
  jointVolumeCuYdWithWaste: number;
  jointWeightLbWithWaste: number;
  totalBags: number;
  // Metric
  jointVolumeM3WithWaste: number;
  jointWeightKgWithWaste: number;
  // Optional coverage calculation
  coverageBags?: number;
  mathSteps: MathStep[];
}

// Density table (US, lb per yd3): Dry 2,600 · Damp 2,900 · Wet 3,200 · Polymeric / joint sand 2,700 (~100 lb/ft3)
// Metric: kg/m3 = lb/yd3 * 0.593276
export const DENSITIES_LB_PER_YD3 = {
  dry: 2600,
  damp: 2900,
  wet: 3200,
  polymeric: 2700,
};

export const LB_PER_YD3_TO_KG_PER_M3 = 0.593276421;

// Float-safe ceiling
export function ceilSafe(val: number): number {
  if (val <= 0 || !Number.isFinite(val)) return 0;
  return Math.ceil(val - 1e-9);
}

/**
 * Calculate Sand Volume for multi-section areas
 */
export function calculateSandVolume(inputs: SandVolumeInputs): SandVolumeResult {
  const isMetric = inputs.unitSystem === 'metric';
  const waste = Math.max(0, Math.min(50, inputs.wastePercent || 0)) / 100;
  const wasteMultiplier = 1 + waste;

  let totalRawCuFt = 0;
  const mathSteps: MathStep[] = [];

  // Compute depth in feet (US) or meters (Metric)
  const depthFt = isMetric
    ? ((inputs.depthCm || 0) / 100) * 3.28084
    : (inputs.depthInches || 0) / 12;

  inputs.sections.forEach((sec, idx) => {
    let sectionAreaSqFt = 0;
    const label = sec.label || `Area ${idx + 1}`;

    if (isMetric) {
      if (sec.shape === 'circle') {
        const dM = sec.diameterM || 0;
        const rM = dM / 2;
        const areaM2 = Math.PI * rM * rM;
        sectionAreaSqFt = areaM2 * 10.7639104; // m2 to sq ft
      } else {
        const lM = sec.lengthM || 0;
        const wM = sec.widthM || 0;
        const areaM2 = lM * wM;
        sectionAreaSqFt = areaM2 * 10.7639104;
      }
    } else {
      if (sec.shape === 'circle') {
        const dFt = sec.diameterFt || 0;
        const rFt = dFt / 2;
        sectionAreaSqFt = Math.PI * rFt * rFt;
      } else {
        const lFt = sec.lengthFt || 0;
        const wFt = sec.widthFt || 0;
        sectionAreaSqFt = lFt * wFt;
      }
    }

    const secCuFt = sectionAreaSqFt * depthFt;
    totalRawCuFt += secCuFt;

    mathSteps.push({
      step: `${label} (${sec.shape})`,
      formula: isMetric
        ? `Area = ${(sectionAreaSqFt / 10.7639104).toFixed(2)} m², Depth = ${inputs.depthCm} cm`
        : `Area = ${sectionAreaSqFt.toFixed(2)} sq ft, Depth = ${inputs.depthInches} in`,
      result: `${secCuFt.toFixed(3)} cu ft (${(secCuFt / 27).toFixed(3)} cu yd)`,
    });
  });

  const rawVolumeCuFt = totalRawCuFt;
  const rawVolumeCuYd = rawVolumeCuFt / 27;
  const volumeCuFtWithWaste = rawVolumeCuFt * wasteMultiplier;
  const volumeCuYdWithWaste = rawVolumeCuYd * wasteMultiplier;

  // Metric volumes (1 m3 = 35.3146667 cu ft)
  const rawVolumeM3 = rawVolumeCuFt / 35.3146667;
  const volumeM3WithWaste = volumeCuFtWithWaste / 35.3146667;

  // Density lookup
  let densityLbPerYd3 = DENSITIES_LB_PER_YD3.dry;
  if (inputs.sandCondition === 'damp') densityLbPerYd3 = DENSITIES_LB_PER_YD3.damp;
  else if (inputs.sandCondition === 'wet') densityLbPerYd3 = DENSITIES_LB_PER_YD3.wet;
  else if (inputs.sandCondition === 'custom' && inputs.customDensityLbPerYd3) {
    densityLbPerYd3 = inputs.customDensityLbPerYd3;
  }

  const densityKgPerM3 = densityLbPerYd3 * LB_PER_YD3_TO_KG_PER_M3;

  // Weight calculations
  const weightLbWithWaste = volumeCuYdWithWaste * densityLbPerYd3;
  const weightTonsWithWaste = weightLbWithWaste / 2000;
  const weightKgWithWaste = volumeM3WithWaste * densityKgPerM3;
  const weightTonnesWithWaste = weightKgWithWaste / 1000;

  // Bag calculations
  let totalBags = 0;
  let bagWeightOrVolLabel = '50 lb';

  if (isMetric) {
    // 25 kg bags default
    totalBags = ceilSafe(weightKgWithWaste / 25);
    bagWeightOrVolLabel = '25 kg';
  } else {
    if (inputs.bagSizeOption === 'customCuFt') {
      const volCuFt = inputs.customBagVolumeCuFt || 0.5;
      totalBags = ceilSafe(volumeCuFtWithWaste / volCuFt);
      bagWeightOrVolLabel = `${volCuFt} cu ft`;
    } else {
      let bagLb = 50;
      if (inputs.bagSizeOption === '40') bagLb = 40;
      else if (inputs.bagSizeOption === '60') bagLb = 60;
      else if (inputs.bagSizeOption === '80') bagLb = 80;
      else if (inputs.bagSizeOption === 'customLb' && inputs.customBagWeightLb) {
        bagLb = inputs.customBagWeightLb;
      }
      totalBags = ceilSafe(weightLbWithWaste / bagLb);
      bagWeightOrVolLabel = `${bagLb} lb`;
    }
  }

  mathSteps.push(
    {
      step: 'Total Raw Volume',
      formula: 'Sum of all section volumes',
      result: `${rawVolumeCuFt.toFixed(2)} ft³ (${rawVolumeCuYd.toFixed(2)} yd³) [${rawVolumeM3.toFixed(2)} m³]`,
    },
    {
      step: `Waste Allowance (${inputs.wastePercent}%)`,
      formula: `Volume × (1 + ${inputs.wastePercent}/100)`,
      result: `${volumeCuFtWithWaste.toFixed(2)} ft³ (${volumeCuYdWithWaste.toFixed(2)} yd³) [${volumeM3WithWaste.toFixed(2)} m³]`,
    },
    {
      step: 'Estimated Weight',
      formula: `yd³ × ${densityLbPerYd3.toLocaleString()} lb/yd³ ÷ 2,000`,
      result: `${weightLbWithWaste.toFixed(0)} lb (${weightTonsWithWaste.toFixed(2)} tons) [${weightKgWithWaste.toFixed(0)} kg]`,
    },
    {
      step: 'Bag Quantity',
      formula: `Total Weight ÷ Bag Size (${bagWeightOrVolLabel}) rounded up`,
      result: `${totalBags} bags`,
    }
  );

  return {
    rawVolumeCuFt,
    rawVolumeCuYd,
    volumeCuFtWithWaste,
    volumeCuYdWithWaste,
    rawVolumeM3,
    volumeM3WithWaste,
    densityLbPerYd3,
    densityKgPerM3,
    weightLbWithWaste,
    weightTonsWithWaste,
    weightKgWithWaste,
    weightTonnesWithWaste,
    totalBags,
    bagWeightOrVolLabel,
    mathSteps,
  };
}

/**
 * Calculate Paver Sand (Bedding Layer)
 */
export function calculatePaverSand(inputs: PaverSandInputs): SandVolumeResult {
  const isMetric = inputs.unitSystem === 'metric';
  let lengthFt = 0;
  let widthFt = 0;

  if (isMetric) {
    const areaSqM = inputs.areaSqM || 0;
    const areaSqFt = areaSqM * 10.7639104;
    lengthFt = Math.sqrt(areaSqFt);
    widthFt = lengthFt;
  } else {
    const areaSqFt = inputs.areaSqFt || 0;
    lengthFt = Math.sqrt(areaSqFt);
    widthFt = lengthFt;
  }

  const volInputs: SandVolumeInputs = {
    unitSystem: inputs.unitSystem,
    sections: [
      {
        id: 'bedding-1',
        label: 'Paver Bedding Area',
        shape: 'rectangle',
        lengthFt,
        widthFt,
        lengthM: isMetric ? Math.sqrt(inputs.areaSqM || 0) : undefined,
        widthM: isMetric ? Math.sqrt(inputs.areaSqM || 0) : undefined,
      },
    ],
    depthInches: inputs.beddingDepthInches,
    depthCm: inputs.beddingDepthCm,
    sandCondition: inputs.sandCondition,
    customDensityLbPerYd3: inputs.customDensityLbPerYd3,
    wastePercent: inputs.wastePercent,
    bagSizeOption: inputs.bagSizeOption,
  };

  return calculateSandVolume(volInputs);
}

/**
 * Calculate Polymeric Sand for joints:
 * Joint fraction = 1 - (L * W) / ((L + j) * (W + j))
 * Joint volume (ft3) = area (ft2) * joint fraction * joint depth (in) / 12
 */
export function calculatePolymericSand(inputs: PolymericSandInputs): PolymericSandResult {
  const isMetric = inputs.unitSystem === 'metric';
  const waste = Math.max(0, Math.min(50, inputs.wastePercent || 0)) / 100;
  const wasteMultiplier = 1 + waste;

  let areaSqFt = inputs.totalAreaSqFt || 0;
  let L = inputs.paverLengthInches || 6;
  let W = inputs.paverWidthInches || 9;
  let j = inputs.jointWidthInches || 0.25;
  let dInches = inputs.jointDepthInches || 2;

  if (isMetric) {
    areaSqFt = (inputs.totalAreaSqM || 0) * 10.7639104;
    L = (inputs.paverLengthCm || 15) / 2.54;
    W = (inputs.paverWidthCm || 23) / 2.54;
    j = (inputs.jointWidthMm || 6) / 25.4;
    dInches = (inputs.jointDepthCm || 5) / 2.54;
  }

  // Prevent divide by zero or negative
  const denom = (L + j) * (W + j);
  const jointFraction = denom > 0 ? 1 - (L * W) / denom : 0;

  // Joint volume in cu ft raw
  const jointVolumeCuFtRaw = (areaSqFt * jointFraction * dInches) / 12;
  const jointVolumeCuFtWithWaste = jointVolumeCuFtRaw * wasteMultiplier;
  const jointVolumeCuYdWithWaste = jointVolumeCuFtWithWaste / 27;

  // Polymeric sand density: 2,700 lb/yd3 or 100 lb/ft3
  const densityLbPerCuFt = 100; // 2,700 / 27
  const jointWeightLbWithWaste = jointVolumeCuFtWithWaste * densityLbPerCuFt;

  // Bag count: standard 50 lb bag
  const bagWeightLb = inputs.bagWeightLb || 50;
  const totalBags = ceilSafe(jointWeightLbWithWaste / bagWeightLb);

  // Metric conversion
  const jointVolumeM3WithWaste = jointVolumeCuFtWithWaste / 35.3146667;
  const jointWeightKgWithWaste = jointWeightLbWithWaste * 0.45359237;

  // Optional bag coverage calculation
  let coverageBags: number | undefined;
  if (inputs.optionalCoverageSqFtPerBag && inputs.optionalCoverageSqFtPerBag > 0) {
    const rawCovBags = areaSqFt / inputs.optionalCoverageSqFtPerBag;
    coverageBags = ceilSafe(rawCovBags * wasteMultiplier);
  }

  const mathSteps: MathStep[] = [
    {
      step: 'Joint Fraction',
      formula: `1 - (${L} × ${W}) ÷ ((${L} + ${j}) × (${W} + ${j}))`,
      result: `${(jointFraction * 100).toFixed(2)}% of total surface area`,
    },
    {
      step: 'Raw Joint Volume',
      formula: `${areaSqFt} sq ft × ${(jointFraction * 100).toFixed(2)}% × ${dInches} in ÷ 12`,
      result: `${jointVolumeCuFtRaw.toFixed(2)} cu ft (${(jointVolumeCuFtRaw / 27).toFixed(2)} yd³)`,
    },
    {
      step: `Waste Allowance (${inputs.wastePercent}%)`,
      formula: `Raw Volume × (1 + ${inputs.wastePercent}/100)`,
      result: `${jointVolumeCuFtWithWaste.toFixed(2)} cu ft (${jointVolumeCuYdWithWaste.toFixed(2)} yd³)`,
    },
    {
      step: 'Joint Sand Weight',
      formula: `${jointVolumeCuFtWithWaste.toFixed(2)} cu ft × 100 lb/cu ft`,
      result: `${jointWeightLbWithWaste.toFixed(0)} lb (${(jointWeightLbWithWaste / 2000).toFixed(2)} tons)`,
    },
    {
      step: 'Bags Required (Formula)',
      formula: `${jointWeightLbWithWaste.toFixed(0)} lb ÷ ${bagWeightLb} lb/bag rounded up`,
      result: `${totalBags} bags`,
    },
  ];

  if (coverageBags !== undefined) {
    mathSteps.push({
      step: 'Bags Required (Manufacturer Coverage)',
      formula: `${areaSqFt} sq ft ÷ ${inputs.optionalCoverageSqFtPerBag} sq ft/bag × (1 + ${inputs.wastePercent}/100)`,
      result: `${coverageBags} bags`,
    });
  }

  return {
    jointFraction,
    jointVolumeCuFtRaw,
    jointVolumeCuFtWithWaste,
    jointVolumeCuYdWithWaste,
    jointWeightLbWithWaste,
    totalBags,
    jointVolumeM3WithWaste,
    jointWeightKgWithWaste,
    coverageBags,
    mathSteps,
  };
}

