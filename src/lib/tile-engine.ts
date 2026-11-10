/**
 * Tile Calculator Engine
 *
 * Implements pure mathematics for floor, shower, and backsplash tile calculations:
 * - Room dimensions (L x W) or direct square footage input.
 * - Standard US tile size presets (12x12, 12x24, 6x24, 3x6 subway, 4x12, 4x4, 24x24, 6x6, custom).
 * - Single tile face area in square feet.
 * - Pattern waste factor allowance (10% grid, 12% running bond, 15% diagonal/herringbone, or custom).
 * - Base tiles vs Total tiles with waste.
 * - Whole retail box packaging rounding.
 * - Thin-set mortar (50 lb bags) and grout (25 lb bags) requirements.
 * - Total material costs & Professional contractor labor benchmark comparisons.
 *
 * Adheres strictly to Zero-Network policy (client-side pure math).
 */

export interface TilePreset {
  id: string;
  name: string;
  lengthInches: number;
  widthInches: number;
  defaultTilesPerBox: number;
  description: string;
}

export const TILE_PRESETS: Record<string, TilePreset> = {
  tile12x12: {
    id: 'tile12x12',
    name: '12" × 12" (Standard Floor Tile)',
    lengthInches: 12,
    widthInches: 12,
    defaultTilesPerBox: 10,
    description: '1.00 sq ft per tile — Ideal for bathroom & utility floors',
  },
  tile12x24: {
    id: 'tile12x24',
    name: '12" × 24" (Large Format Modern)',
    lengthInches: 24,
    widthInches: 12,
    defaultTilesPerBox: 8,
    description: '2.00 sq ft per tile — Modern living rooms & shower walls',
  },
  tile6x24: {
    id: 'tile6x24',
    name: '6" × 24" (Wood-Look Plank)',
    lengthInches: 24,
    widthInches: 6,
    defaultTilesPerBox: 12,
    description: '1.00 sq ft per tile — Timber look for kitchens & basements',
  },
  subway3x6: {
    id: 'subway3x6',
    name: '3" × 6" (Classic Subway Tile)',
    lengthInches: 6,
    widthInches: 3,
    defaultTilesPerBox: 80,
    description: '0.125 sq ft per tile (8 tiles/sq ft) — Backsplashes & tub surrounds',
  },
  subway4x12: {
    id: 'subway4x12',
    name: '4" × 12" (Modern Subway Tile)',
    lengthInches: 12,
    widthInches: 4,
    defaultTilesPerBox: 30,
    description: '0.333 sq ft per tile (3 tiles/sq ft) — Contemporary shower walls',
  },
  tile4x4: {
    id: 'tile4x4',
    name: '4" × 4" (Square Wall / Accent)',
    lengthInches: 4,
    widthInches: 4,
    defaultTilesPerBox: 90,
    description: '0.111 sq ft per tile (9 tiles/sq ft) — Retro bathroom walls & niches',
  },
  tile24x24: {
    id: 'tile24x24',
    name: '24" × 24" (Extra-Large Format)',
    lengthInches: 24,
    widthInches: 24,
    defaultTilesPerBox: 4,
    description: '4.00 sq ft per tile — Open concept main floors & showrooms',
  },
  tile6x6: {
    id: 'tile6x6',
    name: '6" × 6" (Square Floor / Wall)',
    lengthInches: 6,
    widthInches: 6,
    defaultTilesPerBox: 40,
    description: '0.25 sq ft per tile (4 tiles/sq ft) — Compact bathrooms & laundry',
  },
};

export interface TileCalculationInput {
  mode: 'room' | 'direct';
  roomLengthFeet?: number;
  roomWidthFeet?: number;
  directAreaSqFt?: number;
  tilePresetId: string; // keyof TILE_PRESETS or 'custom'
  customLengthInches?: number;
  customWidthInches?: number;
  groutJointInches?: number; // e.g. 0.0625 (1/16"), 0.125 (1/8"), 0.1875 (3/16"), 0.25 (1/4")
  wastePercentage: number; // e.g. 10 (grid), 12 (offset), 15 (diagonal/herringbone)
  tilesPerBox?: number;
  pricePerBox?: number;
  pricePerSqFt?: number;
  includeInstallationMaterials?: boolean; // mortar & grout estimate
}

export interface TileCalculationResult {
  netAreaSqFt: number;
  grossAreaSqFt: number;
  singleTileAreaSqInches: number;
  singleTileAreaSqFt: number;
  tilesPerSqFt: number;
  baseTilesNeeded: number;
  wasteTiles: number;
  totalTilesNeeded: number;
  boxesNeeded: number;
  totalTilesInBoxes: number;
  surplusTiles: number;
  thinsetBags50lb: number;
  groutBags25lb: number;
  tileMaterialCost: number;
  mortarGroutCost: number;
  totalDiyCost: number;
  proEstimatedCostLow: number;
  proEstimatedCostHigh: number;
}

export function calculateTiles(input: TileCalculationInput): TileCalculationResult {
  const {
    mode,
    roomLengthFeet = 0,
    roomWidthFeet = 0,
    directAreaSqFt = 0,
    tilePresetId,
    customLengthInches,
    customWidthInches,
    wastePercentage = 10,
    tilesPerBox,
    pricePerBox = 0,
    pricePerSqFt = 0,
    includeInstallationMaterials = false,
  } = input;

  // Determine net area
  let netAreaSqFt = 0;
  if (mode === 'room') {
    const len = Math.max(0, roomLengthFeet || 0);
    const wid = Math.max(0, roomWidthFeet || 0);
    netAreaSqFt = parseFloat((len * wid).toFixed(2));
  } else {
    netAreaSqFt = parseFloat(Math.max(0, directAreaSqFt || 0).toFixed(2));
  }

  // Determine tile dimensions
  let lengthInches = 12;
  let widthInches = 12;
  let defaultBoxCount = 10;

  if (tilePresetId === 'custom') {
    lengthInches = Math.max(0.5, customLengthInches || 12);
    widthInches = Math.max(0.5, customWidthInches || 12);
    defaultBoxCount = 10;
  } else if (TILE_PRESETS[tilePresetId]) {
    const preset = TILE_PRESETS[tilePresetId];
    lengthInches = preset.lengthInches;
    widthInches = preset.widthInches;
    defaultBoxCount = preset.defaultTilesPerBox;
  }

  // Single tile face area
  const singleTileAreaSqInches = parseFloat((lengthInches * widthInches).toFixed(3));
  const singleTileAreaSqFt = parseFloat((singleTileAreaSqInches / 144).toFixed(4));
  const tilesPerSqFt = singleTileAreaSqFt > 0 ? parseFloat((1 / singleTileAreaSqFt).toFixed(2)) : 0;

  // Base tiles needed (without waste)
  const baseTilesNeeded = singleTileAreaSqFt > 0 ? Math.ceil(netAreaSqFt / singleTileAreaSqFt) : 0;

  // Waste multiplier (rounded to clean precision to avoid IEEE 754 float drift)
  const validWaste = Math.max(0, wastePercentage || 0);
  const grossAreaSqFt = parseFloat((netAreaSqFt * (1 + validWaste / 100)).toFixed(2));
  const rawTotalTiles = baseTilesNeeded * (1 + validWaste / 100);
  const totalTilesNeeded = Math.ceil(parseFloat(rawTotalTiles.toFixed(4)));
  const wasteTiles = Math.max(0, totalTilesNeeded - baseTilesNeeded);

  // Boxes calculation
  const unitsInBox = Math.max(1, tilesPerBox || defaultBoxCount);
  const boxesNeeded = totalTilesNeeded > 0 ? Math.ceil(totalTilesNeeded / unitsInBox) : 0;
  const totalTilesInBoxes = boxesNeeded * unitsInBox;
  const surplusTiles = Math.max(0, totalTilesInBoxes - totalTilesNeeded);

  // Mortar & Grout estimates:
  // 50 lb thinset bag covers ~60 sq ft
  const thinsetBags50lb = grossAreaSqFt > 0 ? Math.ceil(grossAreaSqFt / 60) : 0;
  // 25 lb grout bag covers ~150 sq ft
  const groutBags25lb = grossAreaSqFt > 0 ? Math.ceil(grossAreaSqFt / 150) : 0;

  // Cost calculation
  let tileMaterialCost = 0;
  if (pricePerBox && pricePerBox > 0) {
    tileMaterialCost = parseFloat((boxesNeeded * pricePerBox).toFixed(2));
  } else if (pricePerSqFt && pricePerSqFt > 0) {
    tileMaterialCost = parseFloat((grossAreaSqFt * pricePerSqFt).toFixed(2));
  }

  let mortarGroutCost = 0;
  if (includeInstallationMaterials && grossAreaSqFt > 0) {
    // ~$28 per 50 lb thinset + ~$20 per 25 lb grout bag
    mortarGroutCost = parseFloat((thinsetBags50lb * 28 + groutBags25lb * 20).toFixed(2));
  }

  const totalDiyCost = parseFloat((tileMaterialCost + mortarGroutCost).toFixed(2));

  // Professional labor benchmarks:
  // Typical pro contractor charges ~$7.00 - $15.00 per sq ft for floor tile installation
  const proEstimatedCostLow = Math.round(netAreaSqFt * 7.0);
  const proEstimatedCostHigh = Math.round(netAreaSqFt * 15.0);

  return {
    netAreaSqFt,
    grossAreaSqFt,
    singleTileAreaSqInches,
    singleTileAreaSqFt,
    tilesPerSqFt,
    baseTilesNeeded,
    wasteTiles,
    totalTilesNeeded,
    boxesNeeded,
    totalTilesInBoxes,
    surplusTiles,
    thinsetBags50lb,
    groutBags25lb,
    tileMaterialCost,
    mortarGroutCost,
    totalDiyCost,
    proEstimatedCostLow,
    proEstimatedCostHigh,
  };
}
