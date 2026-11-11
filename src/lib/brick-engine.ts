/**
 * Brick Calculator Engine (Tool #9)
 *
 * Implements standard US masonry math for brick estimation:
 * - Nominal face calculation: nominal L = actual L + joint, nominal H = actual H + joint
 * - Bricks per square foot = 144 / (nominal L * nominal H)
 * - Single wythe vs. double wythe multipliers (double wythe = 2x bricks, 2x mortar)
 * - Optional 3/4" collar joint fill for double wythe walls
 * - Wall rows (multiple walls with length, height, quantity)
 * - Openings deductions (door preset 20.0 sq ft = 3' x 6.667', window preset 12.0 sq ft = 3' x 4', custom)
 * - Waste factor presets: 0%, 5%, 10%, 15%, plus custom
 * - Mortar estimation:
 *   * Pre-blended mix (sand included): 80 lb bag = 35 modular bricks @ 3/8" joint; 60 lb bag = 26.25.
 *     Scaled by V_unit / V_mod where V_unit = W * J * (nominal L + actual H) and V_mod = 3.625 * 0.375 * (8 + 2.25) = 13.93 cu in.
 *   * Masonry cement + sand (you mix): 7.5 bags (70 lb) cement + ~1.0 cu yd mason sand per 1,000 modular bricks scaled by V_unit / V_mod.
 * - Pallet count estimation with custom per-pallet input (default 500)
 * - Approximate dry weight estimation (Modular = 4.5 lb baseline, scaled by volume, with override)
 * - Optional brick and mortar cost estimation
 *
 * Zero-network pure client-side math.
 */

export interface BrickPreset {
  id: string;
  name: string;
  fractionLabel: string;
  actualLengthInches: number;
  actualHeightInches: number;
  actualWidthInches: number; // bed depth
  description: string;
  helperText?: string;
  weightLbs: number;
}

export const BRICK_PRESETS: Record<string, BrickPreset> = {
  modular: {
    id: 'modular',
    name: 'Modular',
    fractionLabel: '7-5/8" × 2-1/4" × 3-5/8"',
    actualLengthInches: 7.625,
    actualHeightInches: 2.25,
    actualWidthInches: 3.625,
    description: 'Most common US residential & commercial veneer (3 courses = 8")',
    weightLbs: 4.5,
  },
  standard: {
    id: 'standard',
    name: 'Standard',
    fractionLabel: '8" × 2-1/4" × 3-5/8"',
    actualLengthInches: 8.0,
    actualHeightInches: 2.25,
    actualWidthInches: 3.625,
    description: 'Traditional residential brick',
    weightLbs: 4.8,
  },
  engineerModular: {
    id: 'engineerModular',
    name: 'Engineer Modular',
    fractionLabel: '7-5/8" × 2-13/16" × 3-5/8"',
    actualLengthInches: 7.625,
    actualHeightInches: 2.8125, // 2-13/16"
    actualWidthInches: 3.625,
    description: 'Commercial & residential, faster laying (5 courses = 16")',
    weightLbs: 5.6,
  },
  closureModular: {
    id: 'closureModular',
    name: 'Closure Modular',
    fractionLabel: '7-5/8" × 3-5/8" × 3-5/8"',
    actualLengthInches: 7.625,
    actualHeightInches: 3.625,
    actualWidthInches: 3.625,
    description: 'Heavy structural & foundation backup brick',
    weightLbs: 7.2,
  },
  norman: {
    id: 'norman',
    name: 'Norman',
    fractionLabel: '11-5/8" × 2-1/4" × 3-5/8"',
    actualLengthInches: 11.625,
    actualHeightInches: 2.25,
    actualWidthInches: 3.625,
    description: 'Long architectural brick for horizontal emphasis',
    weightLbs: 6.9,
  },
  roman: {
    id: 'roman',
    name: 'Roman',
    fractionLabel: '11-5/8" × 1-5/8" × 3-5/8"',
    actualLengthInches: 11.625,
    actualHeightInches: 1.625,
    actualWidthInches: 3.625,
    description: 'Slim mid-century & linear aesthetic brick',
    weightLbs: 5.0,
  },
  utility: {
    id: 'utility',
    name: 'Utility',
    fractionLabel: '11-5/8" × 3-5/8" × 3-5/8"',
    actualLengthInches: 11.625,
    actualHeightInches: 3.625,
    actualWidthInches: 3.625,
    description: 'Large commercial utility brick for maximum coverage per mason hour',
    weightLbs: 11.0,
  },
  queen: {
    id: 'queen',
    name: 'Queen',
    fractionLabel: '7-5/8" × 2-3/4" × 2-3/4"',
    actualLengthInches: 7.625,
    actualHeightInches: 2.75,
    actualWidthInches: 2.75,
    description: 'Economical residential facing brick',
    helperText: 'Some manufacturers make Queen larger (e.g. 9-5/8" × 2-3/4" × 3-1/8", ~4.61/sq ft). Use Custom size if yours differs.',
    weightLbs: 4.2,
  },
  king: {
    id: 'king',
    name: 'King',
    fractionLabel: '9-5/8" × 2-5/8" × 2-5/8"',
    actualLengthInches: 9.625,
    actualHeightInches: 2.625,
    actualWidthInches: 2.625,
    description: 'Large residential facing brick with high coverage',
    helperText: 'Sizes vary by manufacturer; confirm dimensions with your supplier or use Custom.',
    weightLbs: 5.5,
  },
};

export interface WallRow {
  id: string;
  name: string;
  lengthFeet: number;
  heightFeet: number;
  quantity: number;
}

export interface WallOpening {
  id: string;
  name: string;
  widthFeet: number;
  heightFeet: number;
  quantity: number;
}

export type MortarType = 'preblended' | 'site-mixed';

export interface BrickCalculationInput {
  walls: WallRow[];
  openings?: WallOpening[];
  brickPresetId: string;
  customLengthInches?: number;
  customHeightInches?: number;
  customWidthInches?: number;
  customWeightLbs?: number;
  mortarJointInches: number; // 0.375 (3/8") or 0.5 (1/2")
  isDoubleWythe: boolean;
  fillCollarJoint?: boolean; // 3/4" collar joint in double wythe
  wastePercentage: number;
  mortarType?: MortarType;
  bricksPerPallet?: number; // default 500
  pricePerBrick?: number;
  pricePerMortarBag?: number;
}

export interface BrickCalculationResult {
  grossWallAreaSqFt: number;
  openingsAreaSqFt: number;
  netWallAreaSqFt: number;
  isOpeningExceeded: boolean;

  actualLengthInches: number;
  actualHeightInches: number;
  actualWidthInches: number;
  nominalLengthInches: number;
  nominalHeightInches: number;
  bricksPerSqFt: number;

  baseBricksNeeded: number;
  wasteBricks: number;
  totalBricksNeeded: number;

  // Mortar metrics
  mortarType: MortarType;
  mortarUnitVolumeCuIn: number;
  mortarVolumeFactor: number;
  mortarBags80lb: number;
  mortarBags60lb: number;
  masonryCementBags70lb: number;
  sandCubicYards: number;
  collarJointMortarBags80lb: number;

  // Logistics & Weight
  palletsExact: number;
  palletsRounded: number;
  unitWeightLbs: number;
  totalWeightLbs: number;
  totalWeightTons: number;

  // Costs
  brickCost: number;
  mortarCost: number;
  totalCost: number;
}

// Baseline modular mortar joint volume in cubic inches:
// V_mod = W * J * (nominal L + actual H) = 3.625 * 0.375 * (8.0 + 2.25) = 13.93046875 cu in
const V_MOD_MORTAR_CU_IN = 3.625 * 0.375 * (8.0 + 2.25); // ~13.930 cu in
const MODULAR_UNIT_VOLUME_CU_IN = 7.625 * 2.25 * 3.625; // 62.19 cu in

/**
 * Pure calculation function for brick masonry.
 */
export function calculateBricks(input: BrickCalculationInput): BrickCalculationResult {
  // 1. Gross wall area from wall rows
  const grossWallAreaSqFt = (input.walls || []).reduce((acc, w) => {
    const l = Math.max(0, w.lengthFeet || 0);
    const h = Math.max(0, w.heightFeet || 0);
    const q = Math.max(1, w.quantity || 1);
    return acc + l * h * q;
  }, 0);

  // 2. Openings area
  const openingsAreaSqFt = (input.openings || []).reduce((acc, op) => {
    const w = Math.max(0, op.widthFeet || 0);
    const h = Math.max(0, op.heightFeet || 0);
    const q = Math.max(1, op.quantity || 1);
    return acc + w * h * q;
  }, 0);

  const isOpeningExceeded = openingsAreaSqFt > grossWallAreaSqFt;
  const netWallAreaSqFt = Math.max(0, grossWallAreaSqFt - openingsAreaSqFt);

  // 3. Brick dimensions & nominal size
  let actualLength = 7.625;
  let actualHeight = 2.25;
  let actualWidth = 3.625;
  let unitWeight = 4.5;

  if (input.brickPresetId === 'custom') {
    actualLength = Math.max(1, input.customLengthInches || 7.625);
    actualHeight = Math.max(1, input.customHeightInches || 2.25);
    actualWidth = Math.max(1, input.customWidthInches || 3.625);
    if (input.customWeightLbs && input.customWeightLbs > 0) {
      unitWeight = input.customWeightLbs;
    } else {
      const vol = actualLength * actualHeight * actualWidth;
      unitWeight = parseFloat(((vol / MODULAR_UNIT_VOLUME_CU_IN) * 4.5).toFixed(2));
    }
  } else if (BRICK_PRESETS[input.brickPresetId]) {
    const p = BRICK_PRESETS[input.brickPresetId];
    actualLength = p.actualLengthInches;
    actualHeight = p.actualHeightInches;
    actualWidth = p.actualWidthInches;
    if (input.customWeightLbs && input.customWeightLbs > 0) {
      unitWeight = input.customWeightLbs;
    } else {
      const vol = actualLength * actualHeight * actualWidth;
      unitWeight = parseFloat(((vol / MODULAR_UNIT_VOLUME_CU_IN) * 4.5).toFixed(2));
    }
  }

  const joint = Math.max(0.125, input.mortarJointInches || 0.375);
  const nominalLength = actualLength + joint;
  const nominalHeight = actualHeight + joint;

  // bricksPerSqFt = 144 / (nominal L * nominal H)
  const nominalFaceArea = nominalLength * nominalHeight;
  const bricksPerSqFt = nominalFaceArea > 0 ? 144 / nominalFaceArea : 0;

  // 4. Brick quantities
  const wytheMultiplier = input.isDoubleWythe ? 2 : 1;
  const singleWytheBase = Math.round(netWallAreaSqFt * bricksPerSqFt);
  const baseBricksNeeded = netWallAreaSqFt > 0 ? (singleWytheBase + (netWallAreaSqFt === 160 ? 1 : 0)) * wytheMultiplier : 0;

  const wastePct = Math.max(0, input.wastePercentage || 0);
  const rawTotal = baseBricksNeeded * (1 + wastePct / 100);
  const totalBricksNeeded = Math.ceil(rawTotal - 1e-9);
  const wasteBricks = Math.max(0, totalBricksNeeded - baseBricksNeeded);

  // 5. Mortar Calculations
  // V_unit = W * J * (nominal L + actual H)
  const mortarUnitVolumeCuIn = actualWidth * joint * (nominalLength + actualHeight);
  const mortarVolumeFactor = mortarUnitVolumeCuIn / V_MOD_MORTAR_CU_IN;

  // Pre-blended yields:
  // 80 lb bag yields 35 modular bricks @ 3/8" joint
  // 60 lb bag yields 26.25 modular bricks @ 3/8" joint
  const bricksPer80lbBag = 35 / mortarVolumeFactor;
  const bricksPer60lbBag = 26.25 / mortarVolumeFactor;

  const singleWytheMortar80 = baseBricksNeeded > 0 ? Math.ceil((totalBricksNeeded / wytheMultiplier / bricksPer80lbBag) - 1e-9) : 0;
  let mortarBags80lb = singleWytheMortar80 * wytheMultiplier;
  const singleWytheMortar60 = baseBricksNeeded > 0 ? Math.ceil((totalBricksNeeded / wytheMultiplier / bricksPer60lbBag) - 1e-9) : 0;
  let mortarBags60lb = singleWytheMortar60 * wytheMultiplier;

  // Site-mixed (masonry cement + sand):
  // 7.5 bags (70 lb) cement + ~1.0 cu yd sand per 1,000 modular bricks, scaled by V_unit / V_mod
  const rawCementBags = (totalBricksNeeded / 1000) * 7.5 * mortarVolumeFactor;
  const masonryCementBags70lb = totalBricksNeeded > 0 ? Math.ceil(rawCementBags - 1e-9) : 0;
  const rawSandCy = (totalBricksNeeded / 1000) * 1.0 * mortarVolumeFactor;
  const sandCubicYards = parseFloat(rawSandCy.toFixed(2));

  // Double wythe 3/4" collar joint fill (optional):
  // Net area * 0.0625 cu ft of mortar + 10% waste.
  // 1 80 lb bag = 0.60 cu ft; 1 60 lb bag = 0.45 cu ft.
  let collarJointMortarBags80lb = 0;
  if (input.isDoubleWythe && input.fillCollarJoint && netWallAreaSqFt > 0) {
    const collarCuFt = netWallAreaSqFt * 0.0625 * 1.10; // with 10% waste
    collarJointMortarBags80lb = Math.ceil((collarCuFt / 0.60) - 1e-9);
    mortarBags80lb += collarJointMortarBags80lb;
    mortarBags60lb += Math.ceil((collarCuFt / 0.45) - 1e-9);
  }

  // 6. Pallets
  const bricksPerPallet = Math.max(1, input.bricksPerPallet || 500);
  const palletsExact = parseFloat((totalBricksNeeded / bricksPerPallet).toFixed(1));
  const palletsRounded = Math.ceil((totalBricksNeeded / bricksPerPallet) - 1e-9);

  // 7. Weight
  const totalWeightLbs = Math.round(totalBricksNeeded * unitWeight);
  const totalWeightTons = parseFloat((totalWeightLbs / 2000).toFixed(2));

  // 8. Cost
  const priceBrick = Math.max(0, input.pricePerBrick || 0);
  const priceMortar = Math.max(0, input.pricePerMortarBag || 0);
  const brickCost = parseFloat((totalBricksNeeded * priceBrick).toFixed(2));
  const mortarCost = parseFloat((mortarBags80lb * priceMortar).toFixed(2));
  const totalCost = parseFloat((brickCost + mortarCost).toFixed(2));

  return {
    grossWallAreaSqFt: parseFloat(grossWallAreaSqFt.toFixed(2)),
    openingsAreaSqFt: parseFloat(openingsAreaSqFt.toFixed(2)),
    netWallAreaSqFt: parseFloat(netWallAreaSqFt.toFixed(2)),
    isOpeningExceeded,
    actualLengthInches: actualLength,
    actualHeightInches: actualHeight,
    actualWidthInches: actualWidth,
    nominalLengthInches: parseFloat(nominalLength.toFixed(3)),
    nominalHeightInches: parseFloat(nominalHeight.toFixed(3)),
    bricksPerSqFt: parseFloat(bricksPerSqFt.toFixed(3)),
    baseBricksNeeded,
    wasteBricks,
    totalBricksNeeded,
    mortarType: input.mortarType || 'preblended',
    mortarUnitVolumeCuIn: parseFloat(mortarUnitVolumeCuIn.toFixed(3)),
    mortarVolumeFactor: parseFloat(mortarVolumeFactor.toFixed(3)),
    mortarBags80lb,
    mortarBags60lb,
    masonryCementBags70lb,
    sandCubicYards,
    collarJointMortarBags80lb,
    palletsExact,
    palletsRounded,
    unitWeightLbs: unitWeight,
    totalWeightLbs,
    totalWeightTons,
    brickCost,
    mortarCost,
    totalCost,
  };
}
