export interface CompostInput {
  areaSqFt: number;
  bedMultiplier: number; // default 1
  compostDepthInches: number; // default 2
  preferredBagSizeCuFt?: 1.0 | 1.5 | 2.0; // default 1.0
  costPerBag?: number;
  costPerBulkCubicYard?: number;
}

export interface CompostResult {
  totalAreaSqFt: number;
  depthInches: number;
  volumeCuFt: number;
  volumeCubicYards: number;
  estimatedWeightTons: number;
  estimatedWeightLbs: number;
  bags10CuFt: number;
  bags15CuFt: number;
  bags20CuFt: number;
  selectedBagsCount: number;
  totalCost?: number;
}

export function calculateCompost(input: CompostInput): CompostResult {
  const singleArea = Math.max(0, input.areaSqFt || 0);
  const multiplier = Math.max(1, Math.floor(input.bedMultiplier || 1));
  const totalAreaSqFt = singleArea * multiplier;
  const depthInches = Math.max(0.1, input.compostDepthInches || 2);
  const bagSize = input.preferredBagSizeCuFt || 1.0;

  // 1. Volume
  const rawCuFt = totalAreaSqFt * (depthInches / 12);
  const volumeCuFt = parseFloat(rawCuFt.toFixed(2));
  const volumeCubicYards = parseFloat((volumeCuFt / 27).toFixed(2));

  // 2. Weight (organic compost density ~0.65 tons/yd³ or ~48 lbs/cu ft)
  const estimatedWeightTons = parseFloat((volumeCubicYards * 0.65).toFixed(2));
  const estimatedWeightLbs = Math.round(volumeCuFt * 48);

  // 3. Bag counts
  const bags10CuFt = Math.ceil(volumeCuFt / 1.0);
  const bags15CuFt = Math.ceil(volumeCuFt / 1.5);
  const bags20CuFt = Math.ceil(volumeCuFt / 2.0);

  const selectedBagsCount =
    bagSize === 1.5 ? bags15CuFt : bagSize === 2.0 ? bags20CuFt : bags10CuFt;

  // 4. Costs
  let totalCost: number | undefined;

  if (input.costPerBag !== undefined && input.costPerBag > 0) {
    totalCost = parseFloat((selectedBagsCount * input.costPerBag).toFixed(2));
  } else if (input.costPerBulkCubicYard !== undefined && input.costPerBulkCubicYard > 0) {
    totalCost = parseFloat((volumeCubicYards * input.costPerBulkCubicYard).toFixed(2));
  }

  return {
    totalAreaSqFt,
    depthInches,
    volumeCuFt,
    volumeCubicYards,
    estimatedWeightTons,
    estimatedWeightLbs,
    bags10CuFt,
    bags15CuFt,
    bags20CuFt,
    selectedBagsCount,
    totalCost,
  };
}

