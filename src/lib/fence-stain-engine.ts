export type PicketStyle =
  | 'flat-privacy'
  | 'board-on-board'
  | 'shadowbox'
  | 'split-rail'
  | 'spaced-picket';

export type WoodPorosity = 'rough-sawn' | 'weathered' | 'smooth-planed';

export interface FenceStainInput {
  fenceLengthFeet: number;
  fenceHeightFeet: number;
  bothSides: boolean;
  picketStyle: PicketStyle;
  woodPorosity: WoodPorosity;
  coatsCount: 1 | 2;
  applicationMethod: 'brush-roller' | 'sprayer'; // 10% vs 15% buffer
  costPer1GalCan?: number;
  costPer5GalPail?: number;
}

export interface FenceStainResult {
  baseFlatAreaSqFt: number;
  sidesMultiplier: number;
  styleMultiplier: number;
  effectiveStainedAreaSqFt: number;
  coat1Gallons: number;
  coat2Gallons: number;
  totalRawGallons: number;
  bufferPercent: number;
  totalOrderGallons: number;
  pails5GalCount: number;
  cans1GalCount: number;
  pailsCost?: number;
  cansCost?: number;
  totalCost?: number;
}

const STYLE_MULTIPLIERS: Record<PicketStyle, number> = {
  'flat-privacy': 1.0,
  'board-on-board': 1.3,
  shadowbox: 1.25,
  'split-rail': 0.4,
  'spaced-picket': 0.8,
};

// Coverage rates in sq ft per gallon for Coat 1
const POROSITY_COVERAGE: Record<WoodPorosity, number> = {
  'rough-sawn': 175,
  weathered: 150,
  'smooth-planed': 225,
};

export function calculateFenceStain(input: FenceStainInput): FenceStainResult {
  const lengthFeet = Math.max(0, input.fenceLengthFeet || 0);
  const heightFeet = Math.max(0, input.fenceHeightFeet || 0);

  const baseFlatAreaSqFt = parseFloat((lengthFeet * heightFeet).toFixed(2));
  const sidesMultiplier = input.bothSides ? 2 : 1;
  const styleMultiplier = STYLE_MULTIPLIERS[input.picketStyle] || 1.0;

  const effectiveStainedAreaSqFt = parseFloat(
    (baseFlatAreaSqFt * sidesMultiplier * styleMultiplier).toFixed(2)
  );

  const baseCoverage = POROSITY_COVERAGE[input.woodPorosity] || 175;

  let coat1Gallons = 0;
  let coat2Gallons = 0;

  if (effectiveStainedAreaSqFt > 0 && baseCoverage > 0) {
    coat1Gallons = parseFloat((effectiveStainedAreaSqFt / baseCoverage).toFixed(2));

    if (input.coatsCount === 2) {
      // Second coat is ~30% more efficient due to sealed wood pores
      const coat2Coverage = baseCoverage * 1.3;
      coat2Gallons = parseFloat((effectiveStainedAreaSqFt / coat2Coverage).toFixed(2));
    }
  }

  const totalRawGallons = parseFloat((coat1Gallons + coat2Gallons).toFixed(2));
  const bufferPercent = input.applicationMethod === 'sprayer' ? 15 : 10;
  const totalOrderGallons = parseFloat(
    (totalRawGallons * (1 + bufferPercent / 100)).toFixed(2)
  );

  // Package sizing recommendations: 5-gal pails + 1-gal cans
  const ceilTotalGallons = Math.ceil(totalOrderGallons);
  const pails5GalCount = Math.floor(ceilTotalGallons / 5);
  const cans1GalCount = ceilTotalGallons % 5;

  // Costs
  let pailsCost: number | undefined;
  let cansCost: number | undefined;
  let totalCost: number | undefined;

  if (input.costPer5GalPail !== undefined && input.costPer5GalPail > 0) {
    pailsCost = parseFloat((pails5GalCount * input.costPer5GalPail).toFixed(2));
  }

  if (input.costPer1GalCan !== undefined && input.costPer1GalCan > 0) {
    cansCost = parseFloat((cans1GalCount * input.costPer1GalCan).toFixed(2));
  }

  if (pailsCost !== undefined || cansCost !== undefined) {
    totalCost = parseFloat(((pailsCost || 0) + (cansCost || 0)).toFixed(2));
  }

  return {
    baseFlatAreaSqFt,
    sidesMultiplier,
    styleMultiplier,
    effectiveStainedAreaSqFt,
    coat1Gallons,
    coat2Gallons,
    totalRawGallons,
    bufferPercent,
    totalOrderGallons,
    pails5GalCount,
    cans1GalCount,
    pailsCost,
    cansCost,
    totalCost,
  };
}

