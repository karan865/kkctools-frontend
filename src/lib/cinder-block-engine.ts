export type BlockPresetKey = 'standard_8' | 'partition_4' | 'medium_6' | 'heavy_10' | 'extra_heavy_12' | 'custom';

export interface BlockPreset {
  key: BlockPresetKey;
  label: string;
  nominalDepthInches: number;
  nominalHeightInches: number;
  nominalLengthInches: number;
  actualDepthInches: number;
  actualHeightInches: number;
  actualLengthInches: number;
  coreVolumeCuFtPerBlock: number; // hollow core volume (typical)
  dryWeightLbs: number; // typical normal-weight hollow block
}

// Typical normal-weight hollow CMU presets
// Core volumes (cu ft, typical & approximate): 4" 0.06, 6" 0.17, 8" 0.27, 10" 0.38, 12" 0.48
// Weights (lb, typical normal-weight): 4" 25, 6" 32, 8" 36, 10" 46, 12" 55
export const BLOCK_PRESETS: Record<BlockPresetKey, BlockPreset> = {
  standard_8: {
    key: 'standard_8',
    label: '8" × 8" × 16" Standard CMU (Most Common)',
    nominalDepthInches: 8,
    nominalHeightInches: 8,
    nominalLengthInches: 16,
    actualDepthInches: 7.625,
    actualHeightInches: 7.625,
    actualLengthInches: 15.625,
    coreVolumeCuFtPerBlock: 0.27,
    dryWeightLbs: 36,
  },
  partition_4: {
    key: 'partition_4',
    label: '4" × 8" × 16" Partition CMU (Veneer & Interior)',
    nominalDepthInches: 4,
    nominalHeightInches: 8,
    nominalLengthInches: 16,
    actualDepthInches: 3.625,
    actualHeightInches: 7.625,
    actualLengthInches: 15.625,
    coreVolumeCuFtPerBlock: 0.06,
    dryWeightLbs: 25,
  },
  medium_6: {
    key: 'medium_6',
    label: '6" × 8" × 16" Medium CMU (Retaining / Garage)',
    nominalDepthInches: 6,
    nominalHeightInches: 8,
    nominalLengthInches: 16,
    actualDepthInches: 5.625,
    actualHeightInches: 7.625,
    actualLengthInches: 15.625,
    coreVolumeCuFtPerBlock: 0.17,
    dryWeightLbs: 32,
  },
  heavy_10: {
    key: 'heavy_10',
    label: '10" × 8" × 16" Heavy CMU (Basements & Earth)',
    nominalDepthInches: 10,
    nominalHeightInches: 8,
    nominalLengthInches: 16,
    actualDepthInches: 9.625,
    actualHeightInches: 7.625,
    actualLengthInches: 15.625,
    coreVolumeCuFtPerBlock: 0.38,
    dryWeightLbs: 46,
  },
  extra_heavy_12: {
    key: 'extra_heavy_12',
    label: '12" × 8" × 16" Extra Heavy CMU (Commercial Foundations)',
    nominalDepthInches: 12,
    nominalHeightInches: 8,
    nominalLengthInches: 16,
    actualDepthInches: 11.625,
    actualHeightInches: 7.625,
    actualLengthInches: 15.625,
    coreVolumeCuFtPerBlock: 0.48,
    dryWeightLbs: 55,
  },
  custom: {
    key: 'custom',
    label: 'Custom Block Dimensions',
    nominalDepthInches: 8,
    nominalHeightInches: 8,
    nominalLengthInches: 16,
    actualDepthInches: 7.625,
    actualHeightInches: 7.625,
    actualLengthInches: 15.625,
    coreVolumeCuFtPerBlock: 0.27,
    dryWeightLbs: 36,
  },
};

export type CoreFillFrequency = 'none' | 'all' | 'every_32' | 'every_48';

// Share of hollow cells grouted based on spacing
// Every core = 100%; 32" o.c. (1 cell in 4) = 25%; 48" o.c. (1 cell in 6) = 16.6667%
export const CORE_FILL_SHARE: Record<CoreFillFrequency, number> = {
  none: 0,
  all: 1.0,
  every_32: 0.25,
  every_48: 1 / 6, // ~0.166667
};

export type MortarType = 'preblended' | 'masonry_cement';

// Mortar yields:
// Pre-blended mortar mix (sand included): 80 lb bag = 13 blocks; 60 lb bag = 9.75 blocks
// Masonry cement (you add sand): 80 lb bag = 35 blocks
// Note: typical; varies with joint size, bedding, and mason; follow product label.
export const MORTAR_YIELDS = {
  preblended_80: 13,
  preblended_60: 9.75,
  masonry_cement_80: 35,
};

export interface WallItem {
  id: string;
  name: string;
  lengthFeet: number;
  heightFeet?: number;
  courses?: number; // if entered as courses
  heightMode?: 'feet' | 'courses';
  quantity: number; // default 1
}

export interface OpeningItem {
  id: string;
  name: string;
  type: 'door' | 'window' | 'custom';
  widthFeet: number;
  heightFeet: number;
  count: number;
  customAreaSqFt?: number;
}

export interface CinderBlockInput {
  walls: WallItem[];
  presetKey: BlockPresetKey;
  // Custom actual block dimensions entered by user (inches)
  customActualLengthInches?: number;
  customActualHeightInches?: number;
  customActualDepthInches?: number;
  mortarJointInches?: number; // default 0.375 (3/8")
  openings?: OpeningItem[];
  wastePercent: number; // e.g. 10
  mortarType?: MortarType; // default 'preblended'
  coreFillFrequency: CoreFillFrequency; // default 'none'
  bondBeamCourses?: number; // default 0
  groutWastePercent?: number; // default 10%
  blocksPerPallet?: number; // default 90
  costPerBlock?: number;
  costPerMortarBag?: number;
}

export interface CinderBlockResult {
  grossWallAreaSqFt: number;
  openingsAreaSqFt: number;
  netWallAreaSqFt: number;
  unitLengthInches: number;
  unitHeightInches: number;
  blocksPerSqFt: number;
  netBlocks: number;
  totalBlocksWithWaste: number;
  // Layout info for primary / first wall
  maxCourses: number;
  maxBlocksPerRow: number;
  // Mortar
  mortarType: MortarType;
  mortarBags80lb: number;
  mortarBags60lb: number;
  // Core fill
  coreFillEnabled: boolean;
  coreFillCuFt: number;
  coreFillCuYds: number;
  coreFillWithWasteCuYds: number;
  coreFillBags80lb: number;
  coreFillBags60lb: number;
  suggestReadyMix: boolean;
  // Weight & Pallets
  totalWeightLbs: number;
  totalWeightTons: number;
  palletsCount: number;
  blocksPerPallet: number;
  // Costs
  costPerBlock: number;
  costPerMortarBag: number;
  estimatedBlockCost: number;
  estimatedMortarCost: number;
  totalEstimatedCost: number;
  // Validation
  isOpeningExceeding: boolean;
}

/**
 * Converts string or number input to float, handling comma decimal separators
 */
export function parseDimension(value: string | number | undefined | null): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  const cleaned = value.toString().trim().replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Robust ceil to guard against floating-point noise e.g. Math.ceil(270 - 1e-9) = 270
 */
export function guardedCeil(x: number): number {
  if (x <= 0) return 0;
  return Math.ceil(x - 1e-9);
}

export function calculateCinderBlocks(input: CinderBlockInput): CinderBlockResult {
  const joint = Math.max(0, input.mortarJointInches !== undefined ? input.mortarJointInches : 0.375);
  const preset = BLOCK_PRESETS[input.presetKey] || BLOCK_PRESETS.standard_8;

  // Actual block dimensions
  const actualLength =
    input.presetKey === 'custom'
      ? Math.max(1, input.customActualLengthInches || preset.actualLengthInches)
      : preset.actualLengthInches;
  const actualHeight =
    input.presetKey === 'custom'
      ? Math.max(1, input.customActualHeightInches || preset.actualHeightInches)
      : preset.actualHeightInches;
  // Custom depth is supported for custom block specs and potential future volumetric calculations
  const actualDepth =
    input.presetKey === 'custom'
      ? Math.max(1, input.customActualDepthInches || preset.actualDepthInches)
      : preset.actualDepthInches;
  void actualDepth;

  // Unit nominal dimensions with mortar joint (inches)
  const unitLength = actualLength + joint;
  const unitHeight = actualHeight + joint;

  // Face coverage: blocksPerSqFt = 144 / (unitLength * unitHeight)
  const blocksPerSqFt = (unitLength * unitHeight) > 0 ? 144 / (unitLength * unitHeight) : 0;

  // Gross wall area & max course / blocks per row
  let grossWallAreaSqFt = 0;
  let maxCourses = 0;
  let maxBlocksPerRow = 0;

  for (const wall of input.walls || []) {
    const qty = Math.max(1, wall.quantity || 1);
    const l = Math.max(0, wall.lengthFeet || 0);

    let h = 0;
    if (wall.heightMode === 'courses') {
      const courses = Math.max(0, wall.courses || 0);
      h = (courses * unitHeight) / 12;
      if (courses > maxCourses) maxCourses = courses;
    } else {
      h = Math.max(0, wall.heightFeet || 0);
      const courses = unitHeight > 0 ? guardedCeil((h * 12) / unitHeight) : 0;
      if (courses > maxCourses) maxCourses = courses;
    }

    const blocksPerRow = unitLength > 0 ? guardedCeil((l * 12) / unitLength) : 0;
    if (blocksPerRow > maxBlocksPerRow) maxBlocksPerRow = blocksPerRow;

    grossWallAreaSqFt += l * h * qty;
  }

  // Openings deductions
  let openingsAreaSqFt = 0;
  for (const op of input.openings || []) {
    const c = Math.max(0, op.count || 0);
    if (op.type === 'custom' && op.customAreaSqFt !== undefined) {
      openingsAreaSqFt += Math.max(0, op.customAreaSqFt) * c;
    } else {
      const w = Math.max(0, op.widthFeet || 0);
      const h = Math.max(0, op.heightFeet || 0);
      openingsAreaSqFt += w * h * c;
    }
  }

  const isOpeningExceeding = openingsAreaSqFt > grossWallAreaSqFt;
  const netWallAreaSqFt = Math.max(0, grossWallAreaSqFt - openingsAreaSqFt);

  // Net blocks and order quantity with waste
  const netBlocks = netWallAreaSqFt * blocksPerSqFt;
  const wasteMultiplier = 1 + Math.max(0, input.wastePercent || 0) / 100;
  const totalBlocksWithWaste = guardedCeil(netBlocks * wasteMultiplier);

  // Mortar
  const mortarType = input.mortarType || 'preblended';
  let mortarBags80lb = 0;
  let mortarBags60lb = 0;

  if (totalBlocksWithWaste > 0) {
    if (mortarType === 'masonry_cement') {
      mortarBags80lb = guardedCeil(totalBlocksWithWaste / MORTAR_YIELDS.masonry_cement_80);
      mortarBags60lb = 0;
    } else {
      mortarBags80lb = guardedCeil(totalBlocksWithWaste / MORTAR_YIELDS.preblended_80);
      mortarBags60lb = guardedCeil(totalBlocksWithWaste / MORTAR_YIELDS.preblended_60);
    }
  }

  // Core fill (grout)
  const coreFillEnabled = input.coreFillFrequency !== 'none';
  const fillShare = CORE_FILL_SHARE[input.coreFillFrequency] || 0;
  const coreVolPerBlock = preset.coreVolumeCuFtPerBlock;

  // Base core fill on net laid blocks (not waste-inflated order)
  let baseCoreFillCuFt = netBlocks * coreVolPerBlock * fillShare;

  // Bond beam addition: courses * blocksPerRow * full core volume
  const bondBeamCourses = Math.max(0, input.bondBeamCourses || 0);
  if (bondBeamCourses > 0 && maxBlocksPerRow > 0) {
    baseCoreFillCuFt += bondBeamCourses * maxBlocksPerRow * coreVolPerBlock;
  }

  const groutWasteMult = 1 + Math.max(0, input.groutWastePercent !== undefined ? input.groutWastePercent : 10) / 100;
  const coreFillCuFt = baseCoreFillCuFt;
  const coreFillWithWasteCuFt = coreFillCuFt * groutWasteMult;

  const coreFillCuYds = coreFillCuFt / 27;
  const coreFillWithWasteCuYds = coreFillWithWasteCuFt / 27;

  // Concrete bag yields: 80 lb bag = 0.60 cu ft; 60 lb bag = 0.45 cu ft
  const coreFillBags80lb = coreFillWithWasteCuFt > 0 ? guardedCeil(coreFillWithWasteCuFt / 0.60) : 0;
  const coreFillBags60lb = coreFillWithWasteCuFt > 0 ? guardedCeil(coreFillWithWasteCuFt / 0.45) : 0;
  const suggestReadyMix = coreFillWithWasteCuYds >= 0.5;

  // Weight
  const blockWeightLbs = preset.dryWeightLbs;
  const totalWeightLbs = totalBlocksWithWaste * blockWeightLbs;
  const totalWeightTons = totalWeightLbs / 2000;

  // Pallets (approx)
  const blocksPerPallet = Math.max(1, input.blocksPerPallet || 90);
  const palletsCount = totalBlocksWithWaste > 0 ? guardedCeil(totalBlocksWithWaste / blocksPerPallet) : 0;

  // Costs
  const costPerBlock = Math.max(0, input.costPerBlock || 0);
  const costPerMortarBag = Math.max(0, input.costPerMortarBag || 0);
  const estimatedBlockCost = totalBlocksWithWaste * costPerBlock;
  const estimatedMortarCost = mortarBags80lb * costPerMortarBag;
  const totalEstimatedCost = estimatedBlockCost + estimatedMortarCost;

  return {
    grossWallAreaSqFt: Number(grossWallAreaSqFt.toFixed(2)),
    openingsAreaSqFt: Number(openingsAreaSqFt.toFixed(2)),
    netWallAreaSqFt: Number(netWallAreaSqFt.toFixed(2)),
    unitLengthInches: Number(unitLength.toFixed(3)),
    unitHeightInches: Number(unitHeight.toFixed(3)),
    blocksPerSqFt: Number(blocksPerSqFt.toFixed(4)),
    netBlocks: Number(netBlocks.toFixed(3)),
    totalBlocksWithWaste,
    maxCourses,
    maxBlocksPerRow,
    mortarType,
    mortarBags80lb,
    mortarBags60lb,
    coreFillEnabled,
    coreFillCuFt: Number(coreFillCuFt.toFixed(2)),
    coreFillCuYds: Number(coreFillCuYds.toFixed(2)),
    coreFillWithWasteCuYds: Number(coreFillWithWasteCuYds.toFixed(2)),
    coreFillBags80lb,
    coreFillBags60lb,
    suggestReadyMix,
    totalWeightLbs: Math.round(totalWeightLbs),
    totalWeightTons: Number(totalWeightTons.toFixed(3)),
    palletsCount,
    blocksPerPallet,
    costPerBlock,
    costPerMortarBag,
    estimatedBlockCost: Number(estimatedBlockCost.toFixed(2)),
    estimatedMortarCost: Number(estimatedMortarCost.toFixed(2)),
    totalEstimatedCost: Number(totalEstimatedCost.toFixed(2)),
    isOpeningExceeding,
  };
}
