/**
 * Laminate Flooring Calculator Engine
 *
 * Implements pure mathematics for laminate and floating floor installations:
 * - Room dimensions (L x W) or direct square footage input.
 * - Pattern waste factor allowance (10% straight, 12% staggered, 15% diagonal, 18% herringbone).
 * - Gross square footage required with waste.
 * - Box coverage yields with standard presets (8mm, 10mm-12mm, waterproof, custom).
 * - Whole box packaging rounding (ceil(grossArea / boxCoverage)).
 * - Extra leftover/surplus square footage for future repairs.
 * - Underlayment roll counts (100 sq ft rolls).
 * - Perimeter linear foot length for baseboards, expansion gaps, and shoe molding.
 * - Total material costs & Professional contractor labor benchmark comparisons.
 *
 * Adheres strictly to Zero-Network policy (client-side pure math).
 */

export interface LaminateGradePreset {
  id: string;
  name: string;
  sqFtPerBox: number;
  description: string;
}

export const LAMINATE_PRESETS: Record<string, LaminateGradePreset> = {
  waterproof: {
    id: 'waterproof',
    name: 'Waterproof / Rigid Core (Most Common)',
    sqFtPerBox: 20.0,
    description: '20.0 sq ft per box — Kitchens, basements, living areas',
  },
  economy8mm: {
    id: 'economy8mm',
    name: 'Standard 8mm Laminate',
    sqFtPerBox: 21.5,
    description: '21.5 sq ft per box — Bedrooms and rental properties',
  },
  premium12mm: {
    id: 'premium12mm',
    name: 'Premium 10mm–12mm AC4/AC5',
    sqFtPerBox: 18.5,
    description: '18.5 sq ft per box — Heavy traffic, authentic wood feel',
  },
  widePlank: {
    id: 'widePlank',
    name: 'Wide Plank (7"–9" width)',
    sqFtPerBox: 16.5,
    description: '16.5 sq ft per box — Modern open-concept floor plans',
  },
};

export interface LaminateCalculationInput {
  mode: 'room' | 'direct';
  roomLengthFeet?: number;
  roomWidthFeet?: number;
  directAreaSqFt?: number;
  gradePresetId: string; // keyof LAMINATE_PRESETS or 'custom'
  customSqFtPerBox?: number;
  wastePercentage: number; // e.g. 10, 12, 15, 18, 20
  pricePerBox?: number;
  pricePerSqFt?: number;
  includeUnderlayment?: boolean; // 100 sq ft rolls @ $40/roll
  moldingsAllowance?: number; // $ allowance for transitions & baseboards
}

export interface LaminateCalculationResult {
  netAreaSqFt: number;
  grossAreaSqFt: number;
  perimeterLinearFeet: number;
  sqFtPerBox: number;
  boxesNeeded: number;
  totalPurchasedSqFt: number;
  surplusSqFt: number;
  underlaymentRolls: number;
  flooringMaterialCost: number;
  underlaymentCost: number;
  moldingsCost: number;
  totalDiyCost: number;
  proEstimatedCostLow: number;
  proEstimatedCostHigh: number;
}

export function calculateLaminateFlooring(input: LaminateCalculationInput): LaminateCalculationResult {
  const {
    mode,
    roomLengthFeet = 0,
    roomWidthFeet = 0,
    directAreaSqFt = 0,
    gradePresetId,
    customSqFtPerBox,
    wastePercentage = 10,
    pricePerBox = 0,
    pricePerSqFt = 0,
    includeUnderlayment = false,
    moldingsAllowance = 0,
  } = input;

  let netAreaSqFt = 0;
  let perimeterLinearFeet = 0;

  if (mode === 'room') {
    const len = Math.max(0, roomLengthFeet || 0);
    const wid = Math.max(0, roomWidthFeet || 0);
    netAreaSqFt = parseFloat((len * wid).toFixed(2));
    perimeterLinearFeet = parseFloat((2 * (len + wid)).toFixed(1));
  } else {
    netAreaSqFt = parseFloat(Math.max(0, directAreaSqFt || 0).toFixed(2));
    // Approximate perimeter for direct mode assuming ~1:1.3 ratio
    const approxSide = Math.sqrt(netAreaSqFt);
    perimeterLinearFeet = parseFloat((4 * approxSide).toFixed(1));
  }

  // Determine box coverage
  let sqFtPerBox = 20.0;
  if (gradePresetId === 'custom') {
    sqFtPerBox = Math.max(1.0, customSqFtPerBox || 20.0);
  } else if (LAMINATE_PRESETS[gradePresetId]) {
    sqFtPerBox = LAMINATE_PRESETS[gradePresetId].sqFtPerBox;
  }

  // Waste multiplier
  const validWaste = Math.max(0, wastePercentage || 0);
  const grossAreaSqFt = parseFloat((netAreaSqFt * (1 + validWaste / 100)).toFixed(2));

  // Boxes calculation (clean float rounding check)
  const rawBoxes = sqFtPerBox > 0 ? grossAreaSqFt / sqFtPerBox : 0;
  const boxesNeeded = Math.ceil(parseFloat(rawBoxes.toFixed(4)));
  const totalPurchasedSqFt = parseFloat((boxesNeeded * sqFtPerBox).toFixed(2));
  const surplusSqFt = parseFloat(Math.max(0, totalPurchasedSqFt - grossAreaSqFt).toFixed(2));

  // Underlayment rolls: standard retail rolls cover 100 sq ft
  const underlaymentRolls = grossAreaSqFt > 0 ? Math.ceil(grossAreaSqFt / 100) : 0;

  // Cost calculations
  let flooringMaterialCost = 0;
  if (pricePerBox && pricePerBox > 0) {
    flooringMaterialCost = parseFloat((boxesNeeded * pricePerBox).toFixed(2));
  } else if (pricePerSqFt && pricePerSqFt > 0) {
    flooringMaterialCost = parseFloat((grossAreaSqFt * pricePerSqFt).toFixed(2));
  }

  const underlaymentCost = includeUnderlayment ? underlaymentRolls * 40.0 : 0; // ~$40 per 100 sq ft roll
  const moldingsCost = Math.max(0, moldingsAllowance || 0);
  const totalDiyCost = parseFloat((flooringMaterialCost + underlaymentCost + moldingsCost).toFixed(2));

  // Professional installation benchmarks:
  // Typical pro contractor charges ~$2.00 - $5.00 per sq ft for laminate labor
  const proEstimatedCostLow = Math.round(netAreaSqFt * 2.0);
  const proEstimatedCostHigh = Math.round(netAreaSqFt * 5.0);

  return {
    netAreaSqFt,
    grossAreaSqFt,
    perimeterLinearFeet,
    sqFtPerBox,
    boxesNeeded,
    totalPurchasedSqFt,
    surplusSqFt,
    underlaymentRolls,
    flooringMaterialCost,
    underlaymentCost,
    moldingsCost,
    totalDiyCost,
    proEstimatedCostLow,
    proEstimatedCostHigh,
  };
}

