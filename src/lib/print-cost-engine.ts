/**
 * print-cost-engine.ts
 * Pure calculation engine for 3D printing cost estimation, pricing, and print farm output.
 * Used by:
 * - /3d-print-cost-calculator/
 */

export interface FilamentInput {
  gramsUsed: number;
  spoolPrice: number;
  spoolWeightGrams: number;
}

export interface ResinInput {
  mlUsed: number;
  bottlePrice: number;
  bottleMl: number;
  washAndCureCostPerPrint?: number;
}

export interface ElectricityInput {
  printerWatts: number;
  printHours: number;
  pricePerKwh: number;
}

export interface MachineWearInput {
  printerPurchasePrice: number;
  lifetimeHours: number;
  maintenancePerHour?: number;
  printHours: number;
}

export interface PrintCostParams {
  materialType: 'filament' | 'resin';
  filament?: FilamentInput;
  resin?: ResinInput;
  electricity: ElectricityInput;
  wear: MachineWearInput;
  failurePct: number;
  laborHours: number;
  laborRatePerHour: number;
  packagingCost?: number;
  markupPct: number;
  taxPct?: number;
  partsPerPlate?: number;
}

export interface PrintCostBreakdown {
  materialCost: number;
  electricityCost: number;
  wearCost: number;
  baseConsumables: number;
  failureAllowanceCost: number;
  totalConsumablesWithFailure: number;
  laborCost: number;
  packagingCost: number;
  totalCost: number;
  markupAmount: number;
  subtotalPrice: number;
  taxAmount: number;
  finalPriceToCharge: number;
  costPerPart: number;
  pricePerPart: number;
}

export interface FarmOutputResult {
  partsPerDay: number;
  dailyRevenue: number;
  dailyProfit: number;
  monthlyRevenue: number;
  monthlyProfit: number;
}

/** Calculate filament weight in grams from length in meters, diameter in mm, and density in g/cm³. */
export function filamentGramsFromLength(
  lengthMeters: number,
  diameterMm = 1.75,
  densityGCm3 = 1.24
): number {
  if (lengthMeters <= 0 || diameterMm <= 0 || densityGCm3 <= 0) return 0;
  const radiusMm = diameterMm / 2;
  const areaMm2 = Math.PI * radiusMm * radiusMm;
  const volumeMm3 = lengthMeters * 1000 * areaMm2;
  const volumeCm3 = volumeMm3 / 1000;
  return volumeCm3 * densityGCm3;
}

/** Calculate length in meters from grams, diameter in mm, and density in g/cm³. */
export function filamentLengthFromGrams(
  grams: number,
  diameterMm = 1.75,
  densityGCm3 = 1.24
): number {
  if (grams <= 0 || diameterMm <= 0 || densityGCm3 <= 0) return 0;
  const volumeCm3 = grams / densityGCm3;
  const volumeMm3 = volumeCm3 * 1000;
  const radiusMm = diameterMm / 2;
  const areaMm2 = Math.PI * radiusMm * radiusMm;
  return volumeMm3 / areaMm2 / 1000;
}

/** Main print cost calculator. */
export function calculatePrintCost(params: PrintCostParams): PrintCostBreakdown {
  // 1. Material cost
  let materialCost = 0;
  if (params.materialType === 'filament' && params.filament) {
    const f = params.filament;
    if (f.spoolWeightGrams > 0) {
      materialCost = (f.gramsUsed / f.spoolWeightGrams) * f.spoolPrice;
    }
  } else if (params.materialType === 'resin' && params.resin) {
    const r = params.resin;
    if (r.bottleMl > 0) {
      materialCost = (r.mlUsed / r.bottleMl) * r.bottlePrice + (r.washAndCureCostPerPrint || 0);
    }
  }

  // 2. Electricity cost
  const totalHours = Math.max(0, params.electricity.printHours);
  const electricityKwh = (params.electricity.printerWatts / 1000) * totalHours;
  const electricityCost = electricityKwh * params.electricity.pricePerKwh;

  // 3. Machine wear & maintenance
  let wearCost = 0;
  const lifeHours = Math.max(1, params.wear.lifetimeHours);
  const hourlyDepreciation = params.wear.printerPurchasePrice / lifeHours;
  const hourlyMaintenance = params.wear.maintenancePerHour || 0;
  wearCost = (hourlyDepreciation + hourlyMaintenance) * totalHours;

  // 4. Base consumables & failure rate
  const baseConsumables = materialCost + electricityCost + wearCost;
  const safeFailurePct = Math.min(99.9, Math.max(0, params.failurePct));
  const failureMultiplier = safeFailurePct > 0 ? 1 / (1 - safeFailurePct / 100) : 1;
  const totalConsumablesWithFailure = baseConsumables * failureMultiplier;
  const failureAllowanceCost = totalConsumablesWithFailure - baseConsumables;

  // 5. Labor
  const laborCost = Math.max(0, params.laborHours) * Math.max(0, params.laborRatePerHour);
  const packagingCost = Math.max(0, params.packagingCost || 0);

  // 6. Total cost
  const totalCost = totalConsumablesWithFailure + laborCost + packagingCost;

  // 7. Markup & Price
  const safeMarkupPct = Math.max(0, params.markupPct);
  const markupAmount = totalCost * (safeMarkupPct / 100);
  const subtotalPrice = totalCost + markupAmount;

  const safeTaxPct = Math.max(0, params.taxPct || 0);
  const taxAmount = subtotalPrice * (safeTaxPct / 100);
  const finalPriceToCharge = subtotalPrice + taxAmount;

  // 8. Per part metrics
  const parts = Math.max(1, params.partsPerPlate || 1);
  const costPerPart = totalCost / parts;
  const pricePerPart = finalPriceToCharge / parts;

  return {
    materialCost,
    electricityCost,
    wearCost,
    baseConsumables,
    failureAllowanceCost,
    totalConsumablesWithFailure,
    laborCost,
    packagingCost,
    totalCost,
    markupAmount,
    subtotalPrice,
    taxAmount,
    finalPriceToCharge,
    costPerPart,
    pricePerPart,
  };
}

/** Calculate print farm scale outputs. */
export function calculateFarmOutput(
  printersCount: number,
  printsPerDayPerPrinter: number,
  partsPerPlate: number,
  costPerPart: number,
  pricePerPart: number
): FarmOutputResult {
  const safePrinters = Math.max(1, printersCount);
  const safePrints = Math.max(0, printsPerDayPerPrinter);
  const safeParts = Math.max(1, partsPerPlate);

  const partsPerDay = safePrinters * safePrints * safeParts;
  const dailyRevenue = partsPerDay * pricePerPart;
  const dailyCost = partsPerDay * costPerPart;
  const dailyProfit = dailyRevenue - dailyCost;

  const monthlyRevenue = dailyRevenue * 30;
  const monthlyProfit = dailyProfit * 30;

  return {
    partsPerDay,
    dailyRevenue,
    dailyProfit,
    monthlyRevenue,
    monthlyProfit,
  };
}
