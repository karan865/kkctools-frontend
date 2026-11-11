/**
 * Stone / Rock / Aggregate Calculation Engine (Tool #13)
 *
 * Implements pure mathematics for multi-area gravel, crushed stone, and river rock takeoffs,
 * float-safe bag and ton rounding, bulk pricing, and bulk-vs-bag cost comparisons.
 * Strictly 0-network, 100% client side.
 */

import {
  STONE_PRESETS,
  StonePreset,
  BagSizeBasis,
} from './stone-constants';

export type AreaShape = 'rectangle' | 'circle' | 'direct';

export interface StoneAreaRow {
  id: string;
  label?: string;
  shape: AreaShape;
  lengthFt?: number;
  widthFt?: number;
  diameterFt?: number;
  areaSqFt?: number;
  depthInches: number;
}

export type PricingUnit = 'ton' | 'cubicYard';
export type DensityInputUnit = 'tonsPerYd3' | 'lbPerCuFt';
export type OrderRoundingStep = 0.25 | 0.5 | 1.0;

export interface StoneCalculationInput {
  areas: StoneAreaRow[];
  presetId: string;
  customDensityUnit?: DensityInputUnit;
  customDensityValue?: number; // tons/yd3 or lb/cu ft based on unit
  wastePercent: number;
  bagBasis?: BagSizeBasis;
  orderRoundingStep?: OrderRoundingStep;
  pricing?: {
    basis: PricingUnit;
    price: number;
    deliveryFee?: number;
    salesTaxPercent?: number;
    pricePerBag?: number;
  };
}

export interface StoneCalculationResult {
  netAreaSqFt: number;
  netVolumeCuFt: number;
  wastePercent: number;
  grossVolumeCuFt: number;
  volumeCuYards: number;
  densityTonsPerYd3: number;
  densityLbPerCuFt: number;
  totalWeightTons: number;
  suggestedTons: number;
  suggestedYards: number;
  totalWeightPounds: number;
  totalMetricTonnes: number;
  totalKilograms: number;
  bagBasis: BagSizeBasis;
  bagsCount: number;
  materialCost: number;
  deliveryFee: number;
  salesTaxAmount: number;
  totalDeliveredCost: number;
  bagPurchaseCost: number;
  bulkWiseSavings: number;
  hintMessages: string[];
  warningMessage?: string;
}

export const EPSILON = 1e-9;

/**
 * Calculates net square feet and volume in cu ft for a single area row.
 */
export function calculateRowVolume(row: StoneAreaRow): { areaSqFt: number; volumeCuFt: number } {
  let areaSqFt = 0;
  const depthIn = Math.max(0, row.depthInches || 0);
  const depthFt = depthIn / 12;

  if (row.shape === 'circle') {
    const d = Math.max(0, row.diameterFt || 0);
    const radius = d / 2;
    areaSqFt = Math.PI * radius * radius;
  } else if (row.shape === 'direct') {
    areaSqFt = Math.max(0, row.areaSqFt || 0);
  } else {
    // rectangle default
    const l = Math.max(0, row.lengthFt || 0);
    const w = Math.max(0, row.widthFt || 0);
    areaSqFt = l * w;
  }

  const volumeCuFt = areaSqFt * depthFt;
  return { areaSqFt, volumeCuFt };
}

/**
 * Pure calculation function for Stone, Rock & Aggregate.
 */
export function calculateStone(input: StoneCalculationInput): StoneCalculationResult {
  const {
    areas = [],
    presetId = 'crushedStone57',
    customDensityUnit = 'tonsPerYd3',
    customDensityValue,
    wastePercent = 10,
    bagBasis = '50lb',
    orderRoundingStep = 0.5,
    pricing,
  } = input;

  const hintMessages: string[] = [];
  let warningMessage: string | undefined;

  // 1. Resolve Material Density (tons/yd³ and lb/cu ft)
  let densityTonsPerYd3 = 1.40;
  let densityLbPerCuFt = (1.40 * 2000) / 27;

  if (presetId === 'custom') {
    const rawVal = typeof customDensityValue === 'number' && customDensityValue > 0 ? customDensityValue : 1.40;
    if (customDensityUnit === 'lbPerCuFt') {
      densityLbPerCuFt = Math.max(10, Math.min(250, rawVal));
      densityTonsPerYd3 = (densityLbPerCuFt * 27) / 2000;
    } else {
      densityTonsPerYd3 = Math.max(0.2, Math.min(3.5, rawVal));
      densityLbPerCuFt = (densityTonsPerYd3 * 2000) / 27;
    }
  } else {
    const p: StonePreset = STONE_PRESETS[presetId] || STONE_PRESETS.crushedStone57;
    densityTonsPerYd3 = p.tonsPerYd3;
    densityLbPerCuFt = (p.tonsPerYd3 * 2000) / 27;
  }

  // 2. Sum Net Area and Volume across all area rows
  let totalNetAreaSqFt = 0;
  let totalNetVolumeCuFt = 0;

  for (const row of areas) {
    const { areaSqFt, volumeCuFt } = calculateRowVolume(row);
    totalNetAreaSqFt += areaSqFt;
    totalNetVolumeCuFt += volumeCuFt;

    // Hints checks per row
    if (row.depthInches > 0) {
      if (presetId === 'ripRap' && row.depthInches < 8) {
        if (!hintMessages.includes('Rip rap layers are usually 12 in or thicker; ask your supplier.')) {
          hintMessages.push('Rip rap layers are usually 12 in or thicker; ask your supplier.');
        }
      }
      if (presetId === 'peaGravel' && row.depthInches > 3) {
        if (!hintMessages.includes('Deep pea gravel shifts underfoot (2–2.5 in is typical for walking comfort).')) {
          hintMessages.push('Deep pea gravel shifts underfoot (2–2.5 in is typical for walking comfort).');
        }
      }
      if (row.depthInches < 1) {
        if (!hintMessages.includes('Very thin layers under 1 inch are difficult to spread evenly without bare spots.')) {
          hintMessages.push('Very thin layers under 1 inch are difficult to spread evenly without bare spots.');
        }
      }
      if (row.depthInches > 24) {
        if (!hintMessages.includes('Depth exceeds 24 inches. Ensure deep fills are placed and compacted in 6-inch lifts.')) {
          hintMessages.push('Depth exceeds 24 inches. Ensure deep fills are placed and compacted in 6-inch lifts.');
        }
      }
    }
  }

  if (areas.length > 10) {
    warningMessage = 'Maximum 10 area rows supported.';
  }

  // Round net area and volume cleanly
  const netAreaSqFt = parseFloat(totalNetAreaSqFt.toFixed(2));
  const netVolumeCuFt = parseFloat(totalNetVolumeCuFt.toFixed(2));

  // 3. Gross Volume = netVolumeCuFt * (100 + waste) / 100
  const validWaste = Math.min(30, Math.max(0, wastePercent || 0));
  const grossVolumeCuFt = parseFloat((netVolumeCuFt * ((100 + validWaste) / 100)).toFixed(2));

  // 4. Cubic Yards = gross / 27
  const rawYards = grossVolumeCuFt / 27;
  const volumeCuYards = parseFloat(rawYards.toFixed(2));

  // 5. Weight in Tons, Pounds, Metric Tonnes, and Kilograms
  // Formula: Tons = rawYards * densityTonsPerYd3
  // (55 / 27) * 1.40 = 2.85185... tons -> 2.85 tons! (5,703.7 lb -> 5,704 lb)
  const rawTons = rawYards * densityTonsPerYd3;
  const totalWeightTons = parseFloat(rawTons.toFixed(2));
  const totalWeightPounds = Math.round(rawTons * 2000);
  const totalMetricTonnes = parseFloat((totalWeightPounds / 2204.62).toFixed(2));
  const totalKilograms = Math.round(totalWeightPounds / 2.20462);

  // 6. Float-safe bag rounding
  let bagsCount = 0;
  if (totalWeightPounds > 0) {
    if (bagBasis === '40lb') {
      bagsCount = Math.ceil(totalWeightPounds / 40 - EPSILON);
    } else if (bagBasis === '0.5cuft') {
      bagsCount = Math.ceil(grossVolumeCuFt / 0.5 - EPSILON);
    } else if (bagBasis === '1cuft') {
      bagsCount = Math.ceil(grossVolumeCuFt / 1.0 - EPSILON);
    } else {
      // default '50lb'
      bagsCount = Math.ceil(totalWeightPounds / 50 - EPSILON);
    }
  }

  // 7. Suggested order quantities (rounded UP to selectable step 0.25, 0.5, or 1.0)
  const step = orderRoundingStep || 0.5;
  const suggestedTons =
    totalWeightTons > 0 ? parseFloat((Math.ceil(totalWeightTons / step - EPSILON) * step).toFixed(2)) : 0;
  const suggestedYards =
    volumeCuYards > 0 ? parseFloat((Math.ceil(volumeCuYards / step - EPSILON) * step).toFixed(2)) : 0;

  // 8. Cost calculations based on Suggested Order Quantity
  let materialCost = 0;
  let deliveryFee = 0;
  let salesTaxAmount = 0;
  let totalDeliveredCost = 0;
  let bagPurchaseCost = 0;
  let bulkWiseSavings = 0;

  if (pricing && pricing.price > 0) {
    if (pricing.basis === 'cubicYard') {
      materialCost = parseFloat((suggestedYards * pricing.price).toFixed(2));
    } else {
      // default 'ton'
      materialCost = parseFloat((suggestedTons * pricing.price).toFixed(2));
    }

    deliveryFee = typeof pricing.deliveryFee === 'number' && pricing.deliveryFee > 0 ? pricing.deliveryFee : 0;

    if (pricing.salesTaxPercent && pricing.salesTaxPercent > 0) {
      salesTaxAmount = parseFloat(((materialCost * pricing.salesTaxPercent) / 100).toFixed(2));
    }

    totalDeliveredCost = parseFloat((materialCost + deliveryFee + salesTaxAmount).toFixed(2));

    if (typeof pricing.pricePerBag === 'number' && pricing.pricePerBag > 0 && bagsCount > 0) {
      bagPurchaseCost = parseFloat((bagsCount * pricing.pricePerBag).toFixed(2));
      bulkWiseSavings = parseFloat(Math.max(0, bagPurchaseCost - totalDeliveredCost).toFixed(2));
    }
  }

  return {
    netAreaSqFt,
    netVolumeCuFt,
    wastePercent: validWaste,
    grossVolumeCuFt,
    volumeCuYards,
    densityTonsPerYd3: parseFloat(densityTonsPerYd3.toFixed(2)),
    densityLbPerCuFt: parseFloat(densityLbPerCuFt.toFixed(2)),
    totalWeightTons,
    suggestedTons,
    suggestedYards,
    totalWeightPounds,
    totalMetricTonnes,
    totalKilograms,
    bagBasis,
    bagsCount,
    materialCost,
    deliveryFee,
    salesTaxAmount,
    totalDeliveredCost,
    bagPurchaseCost,
    bulkWiseSavings,
    hintMessages,
    warningMessage,
  };
}

/**
 * Helper to compute theoretical coverage in sq ft for 1 ton of rock at a given depth in inches.
 * 1 ton = 2000 lbs. Volume = 2000 / densityLbFt3 (cu ft). Area = Volume / (depth / 12)
 */
export function calculateCoveragePerTon(densityTonsPerYd3: number, depthInches: number): number {
  if (densityTonsPerYd3 <= 0 || depthInches <= 0) return 0;
  const densityLbFt3 = (densityTonsPerYd3 * 2000) / 27;
  const cuFtInTon = 2000 / densityLbFt3;
  const depthFt = depthInches / 12;
  const area = cuFtInTon / depthFt;
  return Math.round(area);
}
