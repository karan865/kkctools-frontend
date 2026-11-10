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
  nominalFaceAreaSqFt: number; // usually (16 * 8) / 144 = 0.888889 sq ft
  coreVolumeCuFtPerBlock: number; // hollow core volume
  dryWeightLbs: number;
}

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
    nominalFaceAreaSqFt: (16 * 8) / 144, // 0.888889
    coreVolumeCuFtPerBlock: 0.22,
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
    nominalFaceAreaSqFt: (16 * 8) / 144,
    coreVolumeCuFtPerBlock: 0.10,
    dryWeightLbs: 22,
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
    nominalFaceAreaSqFt: (16 * 8) / 144,
    coreVolumeCuFtPerBlock: 0.16,
    dryWeightLbs: 29,
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
    nominalFaceAreaSqFt: (16 * 8) / 144,
    coreVolumeCuFtPerBlock: 0.28,
    dryWeightLbs: 43,
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
    nominalFaceAreaSqFt: (16 * 8) / 144,
    coreVolumeCuFtPerBlock: 0.35,
    dryWeightLbs: 52,
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
    nominalFaceAreaSqFt: (16 * 8) / 144,
    coreVolumeCuFtPerBlock: 0.22,
    dryWeightLbs: 36,
  },
};

export type CoreFillFrequency = 'none' | 'all' | 'every_32' | 'every_48';

export interface OpeningItem {
  id: string;
  name: string;
  widthFeet: number;
  heightFeet: number;
  count: number;
}

export interface CinderBlockInput {
  wallLengthFeet: number;
  wallHeightFeet: number;
  presetKey: BlockPresetKey;
  customNominalLengthInches?: number;
  customNominalHeightInches?: number;
  customNominalDepthInches?: number;
  mortarJointInches?: number; // default 0.375 (3/8")
  openings?: OpeningItem[];
  wastePercent: number; // e.g. 10
  coreFillFrequency: CoreFillFrequency;
  costPerBlock?: number;
  costPerMortarBag?: number;
}

export interface CinderBlockResult {
  grossWallAreaSqFt: number;
  openingsAreaSqFt: number;
  netWallAreaSqFt: number;
  nominalFaceAreaSqFt: number;
  blocksPerSqFt: number;
  netBlocks: number;
  totalBlocksWithWaste: number;
  coursesCount: number;
  blocksPerCourse: number;
  mortarBags80lb: number;
  mortarBags60lb: number;
  coreFillCuFt: number;
  coreFillCuYds: number;
  coreFillConcreteBags80lb: number;
  totalWeightLbs: number;
  totalWeightTons: number;
  estimatedBlockCost: number;
  estimatedMortarCost: number;
  totalEstimatedCost: number;
}

export function calculateCinderBlocks(input: CinderBlockInput): CinderBlockResult {
  const wallLength = Math.max(0, input.wallLengthFeet || 0);
  const wallHeight = Math.max(0, input.wallHeightFeet || 0);

  const grossWallAreaSqFt = wallLength * wallHeight;

  // Calculate openings area
  let openingsAreaSqFt = 0;
  if (input.openings && input.openings.length > 0) {
    for (const op of input.openings) {
      const w = Math.max(0, op.widthFeet || 0);
      const h = Math.max(0, op.heightFeet || 0);
      const c = Math.max(0, op.count || 0);
      openingsAreaSqFt += w * h * c;
    }
  }

  const netWallAreaSqFt = Math.max(0, grossWallAreaSqFt - openingsAreaSqFt);

  // Get block dimensions
  const preset = BLOCK_PRESETS[input.presetKey] || BLOCK_PRESETS.standard_8;
  const nomLengthInches =
    input.presetKey === 'custom'
      ? Math.max(1, input.customNominalLengthInches || 16)
      : preset.nominalLengthInches;
  const nomHeightInches =
    input.presetKey === 'custom'
      ? Math.max(1, input.customNominalHeightInches || 8)
      : preset.nominalHeightInches;

  const nominalFaceAreaSqFt = (nomLengthInches * nomHeightInches) / 144;
  const blocksPerSqFt = nominalFaceAreaSqFt > 0 ? 1 / nominalFaceAreaSqFt : 0;

  const netBlocks = netWallAreaSqFt * blocksPerSqFt;
  const wasteMultiplier = 1 + Math.max(0, input.wastePercent || 0) / 100;
  const totalBlocksWithWaste = Math.ceil(netBlocks * wasteMultiplier);

  // Courses and layout
  const coursesCount = nomHeightInches > 0 ? Math.round((wallHeight * 12) / nomHeightInches) : 0;
  const blocksPerCourse = nomLengthInches > 0 ? Math.round((wallLength * 12) / nomLengthInches) : 0;

  // Mortar calculation (~33 blocks per 80lb bag, ~25 blocks per 60lb bag)
  const mortarBags80lb = totalBlocksWithWaste > 0 ? Math.ceil(totalBlocksWithWaste / 33) : 0;
  const mortarBags60lb = totalBlocksWithWaste > 0 ? Math.ceil(totalBlocksWithWaste / 25) : 0;

  // Core fill calculation
  let fillFraction = 0;
  if (input.coreFillFrequency === 'all') fillFraction = 1.0;
  else if (input.coreFillFrequency === 'every_32') fillFraction = 0.5; // ~every 2nd block in 16" spacing
  else if (input.coreFillFrequency === 'every_48') fillFraction = 0.3333; // ~every 3rd block

  const coreVolPerBlock = preset.coreVolumeCuFtPerBlock;
  const coreFillCuFt = netBlocks * coreVolPerBlock * fillFraction;
  const coreFillCuYds = coreFillCuFt / 27;
  // One 80lb concrete mix yields ~0.60 cu ft
  const coreFillConcreteBags80lb = coreFillCuFt > 0 ? Math.ceil(coreFillCuFt / 0.60) : 0;

  // Weight estimation
  const blockWeightLbs = preset.dryWeightLbs;
  const totalWeightLbs = totalBlocksWithWaste * blockWeightLbs;
  const totalWeightTons = totalWeightLbs / 2000;

  // Costs
  const costPerBlock = Math.max(0, input.costPerBlock || 0);
  const costPerMortar = Math.max(0, input.costPerMortarBag || 0);
  const estimatedBlockCost = totalBlocksWithWaste * costPerBlock;
  const estimatedMortarCost = mortarBags80lb * costPerMortar;
  const totalEstimatedCost = estimatedBlockCost + estimatedMortarCost;

  return {
    grossWallAreaSqFt: Number(grossWallAreaSqFt.toFixed(2)),
    openingsAreaSqFt: Number(openingsAreaSqFt.toFixed(2)),
    netWallAreaSqFt: Number(netWallAreaSqFt.toFixed(2)),
    nominalFaceAreaSqFt: Number(nominalFaceAreaSqFt.toFixed(4)),
    blocksPerSqFt: Number(blocksPerSqFt.toFixed(3)),
    netBlocks: Number(netBlocks.toFixed(1)),
    totalBlocksWithWaste,
    coursesCount,
    blocksPerCourse,
    mortarBags80lb,
    mortarBags60lb,
    coreFillCuFt: Number(coreFillCuFt.toFixed(2)),
    coreFillCuYds: Number(coreFillCuYds.toFixed(2)),
    coreFillConcreteBags80lb,
    totalWeightLbs: Math.round(totalWeightLbs),
    totalWeightTons: Number(totalWeightTons.toFixed(2)),
    estimatedBlockCost: Number(estimatedBlockCost.toFixed(2)),
    estimatedMortarCost: Number(estimatedMortarCost.toFixed(2)),
    totalEstimatedCost: Number(totalEstimatedCost.toFixed(2)),
  };
}

