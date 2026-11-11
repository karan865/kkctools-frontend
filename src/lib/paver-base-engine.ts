export interface PaverBaseInput {
  areaSqFt: number;
  baseDepthInches: number; // 4, 6, 8, 10, or custom
  compactionPercent: number; // 0, 10, 15, 20 (default 15)
  densityTonsPerYard?: number; // default 1.40
  costPerTon?: number; // optional
  deliveryFee?: number; // optional
}

export interface PaverBaseResult {
  areaSqFt: number;
  compactedCuFt: number;
  compactedCubicYards: number;
  looseCuFt: number;
  looseCubicYards: number;
  looseTons: number;
  loosePounds: number;
  bags05CuFtCount: number;
  materialCost?: number;
  deliveryFee?: number;
  totalCost?: number;
}

export function calculatePaverBase(input: PaverBaseInput): PaverBaseResult {
  const area = Math.max(0, input.areaSqFt || 0);
  const depth = Math.max(1, input.baseDepthInches || 4);
  const compactionPct = Math.max(0, input.compactionPercent ?? 15);
  const density = input.densityTonsPerYard && input.densityTonsPerYard > 0 ? input.densityTonsPerYard : 1.40;

  // 1. Compacted Finished Volume
  const compactedCuFt = parseFloat((area * (depth / 12)).toFixed(2));
  const compactedCubicYards = parseFloat((compactedCuFt / 27).toFixed(2));

  // 2. Loose Volume to Order with compaction shrinkage
  const looseCuFt = parseFloat((compactedCuFt * (1 + compactionPct / 100)).toFixed(2));
  const looseCubicYards = parseFloat((looseCuFt / 27).toFixed(2));

  // 3. Weight
  const looseTons = parseFloat((looseCubicYards * density).toFixed(2));
  const loosePounds = Math.round(looseTons * 2000);

  // 4. Retail 0.5 cu ft bags
  const bags05CuFtCount = Math.ceil(looseCuFt / 0.5);

  // 5. Costs
  let materialCost: number | undefined;
  let totalCost: number | undefined;
  const deliveryFee = input.deliveryFee !== undefined && input.deliveryFee > 0 ? input.deliveryFee : undefined;

  if (input.costPerTon !== undefined && input.costPerTon > 0) {
    materialCost = parseFloat((looseTons * input.costPerTon).toFixed(2));
    totalCost = parseFloat((materialCost + (deliveryFee || 0)).toFixed(2));
  } else if (deliveryFee !== undefined) {
    totalCost = deliveryFee;
  }

  return {
    areaSqFt: area,
    compactedCuFt,
    compactedCubicYards,
    looseCuFt,
    looseCubicYards,
    looseTons,
    loosePounds,
    bags05CuFtCount,
    materialCost,
    deliveryFee,
    totalCost,
  };
}

