export type PaverStyle = 'standard-brick' | 'modular-3piece' | 'large-format' | 'flagstone';
export type JointWidth = '1/8' | '1/4' | '1/2';

export interface PaverSandInput {
  areaSqFt: number;
  beddingDepthInches: number; // 0.75, 1.0, 1.25 (default 1.0)
  includeJointSand: boolean;
  paverStyle: PaverStyle;
  jointWidth: JointWidth;
  bufferPercent: number; // 0, 5, 10, 15 (default 10)
  beddingCostPerTon?: number; // optional $/ton
  jointCostPerBag?: number; // optional $/50 lb bag
}

export interface PaverSandResult {
  areaSqFt: number;
  beddingCuFt: number;
  beddingCubicYards: number;
  beddingTons: number;
  beddingBags50Lb: number;
  jointSandBags50Lb: number;
  jointSandLbs: number;
  totalSandLbs: number;
  beddingCost?: number;
  jointCost?: number;
  totalCost?: number;
}

// 50 lb bag coverage in sq ft based on paver style and joint width
const JOINT_BAG_COVERAGE: Record<PaverStyle, Record<JointWidth, number>> = {
  'standard-brick': {
    '1/8': 85,
    '1/4': 45,
    '1/2': 25,
  },
  'modular-3piece': {
    '1/8': 75,
    '1/4': 40,
    '1/2': 22,
  },
  'large-format': {
    '1/8': 120,
    '1/4': 65,
    '1/2': 35,
  },
  flagstone: {
    '1/8': 50,
    '1/4': 35,
    '1/2': 20,
  },
};

export function calculatePaverSand(input: PaverSandInput): PaverSandResult {
  const area = Math.max(0, input.areaSqFt || 0);
  const depth = Math.max(0.25, input.beddingDepthInches || 1.0);
  const buffer = Math.max(0, input.bufferPercent || 0);

  // 1. Bedding Sand: Area * (depth / 12) * (1 + buffer%)
  const rawBeddingCuFt = area * (depth / 12);
  const beddingCuFt = parseFloat((rawBeddingCuFt * (1 + buffer / 100)).toFixed(2));
  const beddingCubicYards = parseFloat((beddingCuFt / 27).toFixed(2));
  // Concrete sand density ~1.35 tons/yd³
  const beddingTons = parseFloat((beddingCubicYards * 1.35).toFixed(2));
  const beddingLbs = beddingTons * 2000;
  const beddingBags50Lb = Math.ceil(beddingLbs / 50);

  // 2. Joint Sand: Bags = ceil((area / coverage) * (1 + buffer%))
  let jointSandBags50Lb = 0;
  let jointSandLbs = 0;

  if (input.includeJointSand && area > 0) {
    const coveragePerBag =
      JOINT_BAG_COVERAGE[input.paverStyle]?.[input.jointWidth] || 85;
    const bagsFloat = (area / coveragePerBag) * (1 + buffer / 100);
    jointSandBags50Lb = Math.ceil(bagsFloat);
    jointSandLbs = jointSandBags50Lb * 50;
  }

  const totalSandLbs = Math.round(beddingLbs + jointSandLbs);

  // 3. Costs
  let beddingCost: number | undefined;
  let jointCost: number | undefined;
  let totalCost: number | undefined;

  if (input.beddingCostPerTon !== undefined && input.beddingCostPerTon > 0) {
    beddingCost = parseFloat((beddingTons * input.beddingCostPerTon).toFixed(2));
  }

  if (
    input.includeJointSand &&
    input.jointCostPerBag !== undefined &&
    input.jointCostPerBag > 0
  ) {
    jointCost = parseFloat((jointSandBags50Lb * input.jointCostPerBag).toFixed(2));
  }

  if (beddingCost !== undefined || jointCost !== undefined) {
    totalCost = parseFloat(((beddingCost || 0) + (jointCost || 0)).toFixed(2));
  }

  return {
    areaSqFt: area,
    beddingCuFt,
    beddingCubicYards,
    beddingTons,
    beddingBags50Lb,
    jointSandBags50Lb,
    jointSandLbs,
    totalSandLbs,
    beddingCost,
    jointCost,
    totalCost,
  };
}

