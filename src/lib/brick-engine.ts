/**
 * Brick Calculator Engine
 *
 * Implements standard US masonry math for brick estimation:
 * - Nominal face calculation based on actual dimensions + mortar joint thickness.
 * - Bricks per square foot.
 * - Single wythe vs. double wythe multipliers.
 * - Door and window deductions.
 * - Waste factor allowance (0%, 5%, 10%, 15%, 20%).
 * - Mortar bags requirement (80 lb and 60 lb Type N/S).
 * - Pallet count estimation (~500 modular bricks/pallet).
 * - Approximate dry weight estimation (~4.5 lbs/brick).
 * - Optional material cost estimation.
 *
 * Adheres strictly to Zero-Network policy (client-side only pure math).
 */

export interface BrickPreset {
  id: string;
  name: string;
  actualLengthInches: number;
  actualHeightInches: number;
  actualDepthInches: number;
  description: string;
  weightLbs: number;
}

export const BRICK_PRESETS: Record<string, BrickPreset> = {
  modular: {
    id: 'modular',
    name: 'Modular (Most Common US)',
    actualLengthInches: 7.625, // 7-5/8"
    actualHeightInches: 2.25,  // 2-1/4"
    actualDepthInches: 3.625,  // 3-5/8"
    description: '3-5/8" × 2-1/4" × 7-5/8" (Standard veneer, 3 courses = 8")',
    weightLbs: 4.5,
  },
  standard: {
    id: 'standard',
    name: 'Standard US',
    actualLengthInches: 8.0,   // 8"
    actualHeightInches: 2.25,  // 2-1/4"
    actualDepthInches: 3.625,  // 3-5/8"
    description: '3-5/8" × 2-1/4" × 8" (Traditional residential brick)',
    weightLbs: 4.8,
  },
  queen: {
    id: 'queen',
    name: 'Queen',
    actualLengthInches: 7.625, // 7-5/8"
    actualHeightInches: 2.75,  // 2-3/4"
    actualDepthInches: 2.75,   // 2-3/4"
    description: '2-3/4" × 2-3/4" × 7-5/8" (Fast residential coverage)',
    weightLbs: 4.2,
  },
  king: {
    id: 'king',
    name: 'King',
    actualLengthInches: 9.625, // 9-5/8"
    actualHeightInches: 2.625, // 2-5/8"
    actualDepthInches: 2.625,  // 2-5/8"
    description: '2-5/8" × 2-5/8" × 9-5/8" (Economical large commercial/home size)',
    weightLbs: 5.5,
  },
  closure: {
    id: 'closure',
    name: 'Closure / Engineer',
    actualLengthInches: 7.625, // 7-5/8"
    actualHeightInches: 3.25,  // 3-1/4"
    actualDepthInches: 3.625,  // 3-5/8"
    description: '3-5/8" × 3-1/4" × 7-5/8" (Commercial facades & foundations)',
    weightLbs: 5.8,
  },
  roman: {
    id: 'roman',
    name: 'Roman',
    actualLengthInches: 11.625, // 11-5/8"
    actualHeightInches: 1.625,  // 1-5/8"
    actualDepthInches: 3.625,   // 3-5/8"
    description: '3-5/8" × 1-5/8" × 11-5/8" (Mid-century & linear accents)',
    weightLbs: 5.0,
  },
  utility: {
    id: 'utility',
    name: 'Utility',
    actualLengthInches: 11.625, // 11-5/8"
    actualHeightInches: 3.625,  // 3-5/8"
    actualDepthInches: 3.625,   // 3-5/8"
    description: '3-5/8" × 3-5/8" × 11-5/8" (Commercial & structural utility)',
    weightLbs: 9.5,
  },
};

export interface WallOpening {
  id: string;
  name: string;
  widthFeet: number;
  heightFeet: number;
  quantity: number;
}

export interface BrickCalculationInput {
  wallLengthFeet: number;
  wallHeightFeet: number;
  brickPresetId: string; // keyof BRICK_PRESETS or 'custom'
  customLengthInches?: number;
  customHeightInches?: number;
  customWeightLbs?: number;
  mortarJointInches: number; // e.g. 0.375 (3/8") or 0.5 (1/2")
  isDoubleWythe: boolean; // false = single wythe (veneer), true = double wythe (solid wall)
  wastePercentage: number; // e.g. 0, 5, 10, 15, 20
  openings?: WallOpening[];
  pricePerBrick?: number;
  pricePerMortarBag?: number;
}

export interface BrickCalculationResult {
  grossWallAreaSqFt: number;
  openingsAreaSqFt: number;
  netWallAreaSqFt: number;
  nominalLengthInches: number;
  nominalHeightInches: number;
  bricksPerSqFt: number;
  baseBricksNeeded: number;
  wasteBricks: number;
  totalBricksNeeded: number;
  mortarBags80lb: number;
  mortarBags60lb: number;
  palletsNeeded: number;
  totalWeightLbs: number;
  totalWeightTons: number;
  brickCost: number;
  mortarCost: number;
  totalCost: number;
}

/**
 * Calculates all brick masonry requirements for a given wall configuration.
 */
export function calculateBricks(input: BrickCalculationInput): BrickCalculationResult {
  const {
    wallLengthFeet,
    wallHeightFeet,
    brickPresetId,
    customLengthInches,
    customHeightInches,
    customWeightLbs,
    mortarJointInches,
    isDoubleWythe,
    wastePercentage,
    openings = [],
    pricePerBrick = 0,
    pricePerMortarBag = 0,
  } = input;

  const validLength = Math.max(0, wallLengthFeet || 0);
  const validHeight = Math.max(0, wallHeightFeet || 0);
  const grossWallAreaSqFt = validLength * validHeight;

  // Deduct openings
  const openingsAreaSqFt = openings.reduce((acc, op) => {
    const w = Math.max(0, op.widthFeet || 0);
    const h = Math.max(0, op.heightFeet || 0);
    const q = Math.max(1, op.quantity || 1);
    return acc + w * h * q;
  }, 0);

  const netWallAreaSqFt = Math.max(0, grossWallAreaSqFt - openingsAreaSqFt);

  // Brick dimensions
  let actualLength = 7.625;
  let actualHeight = 2.25;
  let unitWeight = 4.5;

  if (brickPresetId === 'custom') {
    actualLength = Math.max(1, customLengthInches || 7.625);
    actualHeight = Math.max(1, customHeightInches || 2.25);
    unitWeight = Math.max(1, customWeightLbs || 4.5);
  } else if (BRICK_PRESETS[brickPresetId]) {
    const preset = BRICK_PRESETS[brickPresetId];
    actualLength = preset.actualLengthInches;
    actualHeight = preset.actualHeightInches;
    unitWeight = preset.weightLbs;
  }

  const validJoint = Math.max(0.125, mortarJointInches || 0.375);
  const nominalLengthInches = actualLength + validJoint;
  const nominalHeightInches = actualHeight + validJoint;

  // Single unit face area in sq ft = (L_nom * H_nom) / 144
  const unitFaceSqFt = (nominalLengthInches * nominalHeightInches) / 144;
  const bricksPerSqFt = unitFaceSqFt > 0 ? 1 / unitFaceSqFt : 0;

  // Wythe multiplier: Single wythe = 1, Double wythe = 2
  const wytheMultiplier = isDoubleWythe ? 2 : 1;

  const singleWytheBase = Math.ceil(netWallAreaSqFt * bricksPerSqFt);
  const baseBricksNeeded = singleWytheBase * wytheMultiplier;
  const wasteMultiplier = 1 + Math.max(0, wastePercentage || 0) / 100;
  const totalBricksNeeded = Math.ceil(baseBricksNeeded * wasteMultiplier);
  const wasteBricks = Math.max(0, totalBricksNeeded - baseBricksNeeded);

  // Mortar calculation:
  // Industry standard: ~7.5 bags of 80 lb Type N/S mortar per 1000 modular bricks (~10 bags of 60 lb)
  // Adjusted proportionally by surface area ratio vs modular brick face (21 sq in)
  const modularNominalArea = 8.0 * 2.625; // 21 sq in
  const currentNominalArea = nominalLengthInches * nominalHeightInches;
  const mortarAreaFactor = currentNominalArea > 0 ? Math.sqrt(currentNominalArea / modularNominalArea) : 1;

  const mortarBags80lb = parseFloat(((totalBricksNeeded / 1000) * 7.5 * mortarAreaFactor).toFixed(1));
  const mortarBags60lb = parseFloat(((totalBricksNeeded / 1000) * 10.0 * mortarAreaFactor).toFixed(1));

  // Pallet calculation: Standard pallets are typically ~500 modular bricks
  const bricksPerPallet = brickPresetId === 'king' || brickPresetId === 'utility' ? 400 : 500;
  const palletsNeeded = parseFloat((totalBricksNeeded / bricksPerPallet).toFixed(1));

  // Weight calculation
  const totalWeightLbs = Math.round(totalBricksNeeded * unitWeight);
  const totalWeightTons = parseFloat((totalWeightLbs / 2000).toFixed(2));

  // Costs
  const brickCost = parseFloat((totalBricksNeeded * Math.max(0, pricePerBrick || 0)).toFixed(2));
  // Order full bags of 80 lb mortar for cost calculation
  const roundedMortarBags = Math.ceil(mortarBags80lb);
  const mortarCost = parseFloat((roundedMortarBags * Math.max(0, pricePerMortarBag || 0)).toFixed(2));
  const totalCost = parseFloat((brickCost + mortarCost).toFixed(2));

  return {
    grossWallAreaSqFt: parseFloat(grossWallAreaSqFt.toFixed(2)),
    openingsAreaSqFt: parseFloat(openingsAreaSqFt.toFixed(2)),
    netWallAreaSqFt: parseFloat(netWallAreaSqFt.toFixed(2)),
    nominalLengthInches: parseFloat(nominalLengthInches.toFixed(3)),
    nominalHeightInches: parseFloat(nominalHeightInches.toFixed(3)),
    bricksPerSqFt: parseFloat(bricksPerSqFt.toFixed(2)),
    baseBricksNeeded,
    wasteBricks,
    totalBricksNeeded,
    mortarBags80lb,
    mortarBags60lb,
    palletsNeeded,
    totalWeightLbs,
    totalWeightTons,
    brickCost,
    mortarCost,
    totalCost,
  };
}
