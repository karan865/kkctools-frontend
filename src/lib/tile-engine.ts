/**
 * Tile Calculator Engine (Tool #11)
 *
 * Implements pure mathematics for tile planning, mortar, grout, packaging,
 * and cost benchmarking.
 * Strictly 0-network, 100% client side.
 */

import {
  TILE_PRESETS,
  DEFAULT_PRICES,
  TilePreset,
} from './tile-constants';

export interface TileAreaItem {
  id: string;
  name: string;
  lengthFeet: number;
  widthFeet: number;
  type: 'add' | 'subtract';
}

export type PricingUnit = 'sqft' | 'tile' | 'box';
export type BoxPackagingMode = 'tilesPerBox' | 'sqFtPerBox';

export interface TileCalculationInput {
  // Input mode: 'areas' or 'direct'
  mode?: 'areas' | 'direct';
  directAreaSqFt?: number;

  // Areas list
  areas?: TileAreaItem[];

  // Tile specifications
  tilePresetId: string;
  customLengthInches?: number;
  customWidthInches?: number;
  customThicknessInches?: number;

  // Grout & Pattern
  groutJointInches?: number;
  patternId?: string; // 'grid' | 'running-bond' | 'diagonal' | 'herringbone' | 'custom'
  wastePercentage?: number;

  // Packaging
  boxMode?: BoxPackagingMode;
  tilesPerBox?: number;
  sqFtPerBox?: number;

  // Pricing
  pricingUnit?: PricingUnit;
  tileUnitPrice?: number;
  thinsetPricePerBag?: number;
  groutPricePerBag?: number;
  toolsAllowance?: number;
  includeInstallationMaterials?: boolean;
}

export interface TileCalculationResult {
  netAreaSqFt: number;
  grossAreaSqFt: number;
  tileLengthInches: number;
  tileWidthInches: number;
  tileThicknessInches: number;
  singleTileAreaSqInches: number;
  singleTileAreaSqFt: number;
  tilesPerSqFt: number;
  baseTilesNeeded: number;
  wasteTiles: number;
  totalTilesNeeded: number;
  boxesNeeded: number;
  totalTilesInBoxes: number;
  surplusTiles: number;
  boxCoverageSqFt: number;
  groutJointInches: number;
  groutWeightLb: number;
  groutBags25lb: number;
  mortarCoverageSqFtPerBag: number;
  thinsetBags50lb: number;
  mortarTrowelSize: string;
  tileMaterialCost: number;
  mortarCost: number;
  groutCost: number;
  toolsCost: number;
  totalDiyCost: number;
  proLaborLow: number;
  proLaborHigh: number;
  proAllInLow: number;
  proAllInHigh: number;
  diySavingsLow: number;
  diySavingsHigh: number;
}

export const EPSILON = 1e-9;

/**
 * Calculates net surface area from add/subtract areas list.
 */
export function calculateNetArea(areas: TileAreaItem[]): number {
  if (!areas || areas.length === 0) return 0;

  let totalAdd = 0;
  let totalSub = 0;

  for (const a of areas) {
    const l = Math.max(0, a.lengthFeet || 0);
    const w = Math.max(0, a.widthFeet || 0);
    const area = l * w;
    if (a.type === 'subtract') {
      totalSub += area;
    } else {
      totalAdd += area;
    }
  }

  const net = Math.max(0, totalAdd - totalSub);
  return parseFloat(net.toFixed(2));
}

/**
 * Get mortar coverage and recommended trowel size based on longest tile side:
 * - <= 8" -> 80 sq ft per 50 lb bag (1/4" x 1/4" square-notch trowel)
 * - > 8" to 15" -> 60 sq ft per 50 lb bag (1/4" x 3/8" square-notch trowel)
 * - > 15" -> 50 sq ft per 50 lb bag (1/2" x 1/2" square-notch + back-butter)
 */
export function getMortarCoverage(longestSideInches: number): { coverageSqFt: number; trowelSize: string } {
  if (longestSideInches <= 8 + EPSILON) {
    return { coverageSqFt: 80, trowelSize: '1/4" × 1/4" square-notch' };
  } else if (longestSideInches <= 15 + EPSILON) {
    return { coverageSqFt: 60, trowelSize: '1/4" × 3/8" square-notch' };
  } else {
    return { coverageSqFt: 50, trowelSize: '1/2" × 1/2" square-notch (back-butter recommended)' };
  }
}

/**
 * Grout weight formula (sanded grout, density ~100 lb/ft^3, +10% standard overage):
 * Grout Lb = Net Area * ((L + W) / (L * W)) * JointWidth * Thickness * 8.3333 * 1.10
 * Where L and W are tile piece dimensions in inches, JointWidth & Thickness in inches.
 */
export function calculateGroutWeightLb(
  netAreaSqFt: number,
  pieceLengthInches: number,
  pieceWidthInches: number,
  jointWidthInches: number,
  thicknessInches: number
): number {
  if (netAreaSqFt <= 0 || pieceLengthInches <= 0 || pieceWidthInches <= 0) return 0;
  const joint = Math.max(0, jointWidthInches || 0);
  const thickness = Math.max(0, thicknessInches || 0);
  if (joint <= 0 || thickness <= 0) return 0;

  const numerator = pieceLengthInches + pieceWidthInches;
  const denominator = pieceLengthInches * pieceWidthInches;
  const factor = numerator / denominator;

  // 100 lb/cu ft / 12 in/ft = 8.3333333333 lb / (sq ft * in depth)
  // +10% overage multiplier = 1.10
  const groutLb = netAreaSqFt * factor * joint * thickness * (100 / 12) * 1.1;
  return parseFloat(groutLb.toFixed(2));
}

export function calculateTiles(input: TileCalculationInput): TileCalculationResult {
  const {
    mode = 'areas',
    directAreaSqFt = 0,
    areas = [],
    tilePresetId = 'tile12x12',
    customLengthInches,
    customWidthInches,
    customThicknessInches,
    groutJointInches = 0.125,
    patternId = 'grid',
    wastePercentage = 10,
    boxMode = 'tilesPerBox',
    tilesPerBox,
    sqFtPerBox,
    pricingUnit = 'sqft',
    tileUnitPrice = 3.0,
    thinsetPricePerBag = DEFAULT_PRICES.thinset50lbBag,
    groutPricePerBag = DEFAULT_PRICES.grout25lbBag,
    toolsAllowance = DEFAULT_PRICES.toolsAllowance,
    includeInstallationMaterials = true,
  } = input;

  // Calculate Net Area
  let netAreaSqFt = 0;
  if (mode === 'direct') {
    netAreaSqFt = Math.max(0, directAreaSqFt || 0);
  } else {
    netAreaSqFt = calculateNetArea(areas);
  }
  netAreaSqFt = parseFloat(netAreaSqFt.toFixed(2));

  // Preset lookup or custom
  let lengthInches = 12;
  let widthInches = 12;
  let thicknessInches = 0.375;
  let defaultTilesInBox = 10;
  let pieceLengthInches = 12;
  let pieceWidthInches = 12;

  const preset: TilePreset | undefined = TILE_PRESETS[tilePresetId];

  if (tilePresetId === 'custom' || !preset) {
    lengthInches = Math.max(0.5, customLengthInches || 12);
    widthInches = Math.max(0.5, customWidthInches || 12);
    thicknessInches = Math.max(0.0625, customThicknessInches || 0.375);
    defaultTilesInBox = 10;
    pieceLengthInches = lengthInches;
    pieceWidthInches = widthInches;
  } else {
    lengthInches = preset.lengthInches;
    widthInches = preset.widthInches;
    thicknessInches = preset.thicknessInches;
    defaultTilesInBox = preset.defaultTilesPerBox;

    if (preset.isMosaic && preset.pieceLengthInches && preset.pieceWidthInches) {
      pieceLengthInches = preset.pieceLengthInches;
      pieceWidthInches = preset.pieceWidthInches;
    } else {
      pieceLengthInches = lengthInches;
      pieceWidthInches = widthInches;
    }
  }

  // Tile dimensions and area
  const singleTileAreaSqInches = parseFloat((lengthInches * widthInches).toFixed(4));
  const singleTileAreaSqFt = parseFloat((singleTileAreaSqInches / 144).toFixed(4));
  const tilesPerSqFt = singleTileAreaSqFt > 0 ? parseFloat((1 / singleTileAreaSqFt).toFixed(4)) : 0;

  // Single-rounding tile counts
  // baseTiles = ceil(netArea * 144 / (L * W))
  // totalTiles = ceil(netArea * 144 * (1 + waste/100) / (L * W))
  const validWaste = Math.max(0, wastePercentage ?? 10);
  const grossAreaSqFt = parseFloat((netAreaSqFt * (1 + validWaste / 100)).toFixed(2));

  let baseTilesNeeded = 0;
  let totalTilesNeeded = 0;
  if (netAreaSqFt > 0 && singleTileAreaSqInches > 0) {
    const rawBase = (netAreaSqFt * 144) / singleTileAreaSqInches;
    baseTilesNeeded = Math.ceil(rawBase - EPSILON);

    const rawTotal = (netAreaSqFt * 144 * (1 + validWaste / 100)) / singleTileAreaSqInches;
    totalTilesNeeded = Math.ceil(rawTotal - EPSILON);
  }

  const wasteTiles = Math.max(0, totalTilesNeeded - baseTilesNeeded);

  // Box packaging calculation
  let boxesNeeded = 0;
  let totalTilesInBoxes = 0;
  let boxCoverageSqFt = 0;

  if (boxMode === 'sqFtPerBox' && sqFtPerBox && sqFtPerBox > 0) {
    boxCoverageSqFt = sqFtPerBox;
    if (grossAreaSqFt > 0) {
      boxesNeeded = Math.ceil(grossAreaSqFt / sqFtPerBox - EPSILON);
      const tilesPerBoxEquiv = singleTileAreaSqFt > 0 ? Math.round(sqFtPerBox / singleTileAreaSqFt) : 0;
      totalTilesInBoxes = boxesNeeded * tilesPerBoxEquiv;
    }
  } else {
    const perBox = Math.max(1, tilesPerBox || defaultTilesInBox);
    boxCoverageSqFt = parseFloat((perBox * singleTileAreaSqFt).toFixed(2));
    if (totalTilesNeeded > 0) {
      boxesNeeded = Math.ceil(totalTilesNeeded / perBox - EPSILON);
      totalTilesInBoxes = boxesNeeded * perBox;
    }
  }

  const surplusTiles = Math.max(0, totalTilesInBoxes - totalTilesNeeded);

  // Thin-set mortar calculation: net / coverageBySize
  const longestSide = Math.max(lengthInches, widthInches);
  const mortarInfo = getMortarCoverage(longestSide);
  const thinsetBags50lb =
    netAreaSqFt > 0 ? Math.ceil(netAreaSqFt / mortarInfo.coverageSqFt - EPSILON) : 0;

  // Grout weight calculation (using piece sizes for mosaic)
  const groutWeightLb = calculateGroutWeightLb(
    netAreaSqFt,
    pieceLengthInches,
    pieceWidthInches,
    groutJointInches,
    thicknessInches
  );
  const groutBags25lb = groutWeightLb > 0 ? Math.ceil(groutWeightLb / 25 - EPSILON) : 0;

  // Material Costs
  // Tile cost formula per section 3:
  // per sq ft -> boxes * boxCoverage * price
  // per tile  -> boxes * tilesPerBox * price
  // per box   -> boxes * price
  let tileMaterialCost = 0;
  const unitPrice = Math.max(0, tileUnitPrice || 0);

  if (pricingUnit === 'box') {
    tileMaterialCost = parseFloat((boxesNeeded * unitPrice).toFixed(2));
  } else if (pricingUnit === 'tile') {
    const perBox = Math.max(1, tilesPerBox || defaultTilesInBox);
    tileMaterialCost = parseFloat((boxesNeeded * perBox * unitPrice).toFixed(2));
  } else {
    // Default 'sqft': boxes * boxCoverage * price
    tileMaterialCost = parseFloat((boxesNeeded * boxCoverageSqFt * unitPrice).toFixed(2));
  }

  let mortarCost = 0;
  let groutCost = 0;
  let toolsCost = 0;

  if (includeInstallationMaterials && netAreaSqFt > 0) {
    mortarCost = parseFloat((thinsetBags50lb * thinsetPricePerBag).toFixed(2));
    groutCost = parseFloat((groutBags25lb * groutPricePerBag).toFixed(2));
    toolsCost = parseFloat((toolsAllowance || 0).toFixed(2));
  }

  const totalDiyCost = parseFloat((tileMaterialCost + mortarCost + groutCost + toolsCost).toFixed(2));

  // Professional labor benchmarks:
  // Baseline $5 - $15 / sq ft of net area, +20% for diagonal / herringbone
  const isDiagonalOrHerringbone = patternId === 'diagonal' || patternId === 'herringbone';
  const laborSurgeMultiplier = isDiagonalOrHerringbone ? 1 + DEFAULT_PRICES.proLaborDiagonalSurge : 1.0;

  const rawLaborLow = netAreaSqFt * DEFAULT_PRICES.proLaborRateLow * laborSurgeMultiplier;
  const rawLaborHigh = netAreaSqFt * DEFAULT_PRICES.proLaborRateHigh * laborSurgeMultiplier;

  // Rounded to nearest $10
  const proLaborLow = Math.round(rawLaborLow / 10) * 10;
  const proLaborHigh = Math.round(rawLaborHigh / 10) * 10;

  // Pro all-in: Labor + tile + mortar + grout (tools excluded since contractor brings their own)
  const proMaterialsOnly = tileMaterialCost + mortarCost + groutCost;
  const rawProAllInLow = proLaborLow + proMaterialsOnly;
  const rawProAllInHigh = proLaborHigh + proMaterialsOnly;

  // Rounded to nearest $10
  const proAllInLow = Math.round(rawProAllInLow / 10) * 10;
  const proAllInHigh = Math.round(rawProAllInHigh / 10) * 10;

  // DIY Savings = max(0, Pro Labor - Tools Allowance)
  const diySavingsLow = Math.max(0, proLaborLow - toolsCost);
  const diySavingsHigh = Math.max(0, proLaborHigh - toolsCost);

  return {
    netAreaSqFt,
    grossAreaSqFt,
    tileLengthInches: lengthInches,
    tileWidthInches: widthInches,
    tileThicknessInches: thicknessInches,
    singleTileAreaSqInches,
    singleTileAreaSqFt,
    tilesPerSqFt,
    baseTilesNeeded,
    wasteTiles,
    totalTilesNeeded,
    boxesNeeded,
    totalTilesInBoxes,
    surplusTiles,
    boxCoverageSqFt,
    groutJointInches,
    groutWeightLb,
    groutBags25lb,
    mortarCoverageSqFtPerBag: mortarInfo.coverageSqFt,
    thinsetBags50lb,
    mortarTrowelSize: mortarInfo.trowelSize,
    tileMaterialCost,
    mortarCost,
    groutCost,
    toolsCost,
    totalDiyCost,
    proLaborLow,
    proLaborHigh,
    proAllInLow,
    proAllInHigh,
    diySavingsLow,
    diySavingsHigh,
  };
}
