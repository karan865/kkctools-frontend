/**
 * Laminate Flooring Calculation Engine (Tool #12)
 *
 * Implements pure mathematics for multi-room laminate flooring takeoffs,
 * float-safe box rounding, underlayment rolls, moldings, and DIY vs Pro benchmarks.
 * Strictly 0-network, 100% client side.
 */

import { LAMINATE_CONSTANTS } from './laminate-constants';

export interface LaminateAreaItem {
  id: string;
  label?: string;
  lengthFt: number;
  widthFt: number;
  mode: 'add' | 'subtract';
}

export type PricingBasis = 'perBox' | 'perSqFt';

export interface LaminatePricingInput {
  basis: PricingBasis;
  price: number;
  underlaymentPerRoll?: number;
  molding?: {
    allowance?: number;
    perLinearFt?: number;
    usePerimeter?: boolean;
  };
  salesTaxPercent?: number;
}

export interface LaminateInput {
  areas?: LaminateAreaItem[];
  directSqFt?: number;
  boxCoverageSqFt: number;
  wastePercent: number;
  attachedPad: boolean;
  rollCoverageSqFt?: number;
  pricing?: LaminatePricingInput;
}

export interface LaminateResult {
  netAreaSqFt: number;
  grossAreaSqFt: number;
  boxCoverageSqFt: number;
  boxesNeeded: number;
  purchasedAreaSqFt: number;
  surplusSqFt: number;
  attachedPad: boolean;
  underlaymentRolls: number;
  perimeterLinearFt: number;
  moldingPieces: number;
  flooringCost: number;
  underlaymentCost: number;
  moldingCost: number;
  materialsSubtotal: number;
  salesTaxAmount: number;
  totalDiyCost: number;
  proLaborLow: number;
  proLaborHigh: number;
  diySavingsLow: number;
  diySavingsHigh: number;
  warningMessage?: string;
}

export const EPSILON = 1e-9;

/**
 * Calculates plank coverage per carton from plank dimensions and count.
 * Coverage = (widthIn * lengthIn * planksPerBox) / 144
 */
export function calculatePlankCoverage(
  plankWidthIn: number,
  plankLengthIn: number,
  planksPerBox: number
): number {
  if (plankWidthIn <= 0 || plankLengthIn <= 0 || planksPerBox <= 0) return 0;
  const coverage = (plankWidthIn * plankLengthIn * planksPerBox) / 144;
  return parseFloat(coverage.toFixed(2));
}

/**
 * Pure calculation function for laminate flooring.
 */
export function calculateLaminate(input: LaminateInput): LaminateResult {
  const {
    areas = [],
    directSqFt,
    boxCoverageSqFt = LAMINATE_CONSTANTS.defaultBoxCoverageSqFt,
    wastePercent = 10,
    attachedPad = false,
    rollCoverageSqFt = LAMINATE_CONSTANTS.defaultRollCoverageSqFt,
    pricing,
  } = input;

  // 1. Determine Net Area and Approximate Perimeter
  let netAreaSqFt = 0;
  let perimeterLinearFt = 0;
  let warningMessage: string | undefined;

  if (typeof directSqFt === 'number' && directSqFt > 0) {
    netAreaSqFt = Math.max(0, directSqFt);
    // Approximate perimeter for a square room if direct sq ft entered
    perimeterLinearFt = Math.round(4 * Math.sqrt(netAreaSqFt));
  } else if (areas && areas.length > 0) {
    let totalAdd = 0;
    let totalSub = 0;
    let rawPerimeter = 0;

    for (const a of areas) {
      const l = Math.max(0, a.lengthFt || 0);
      const w = Math.max(0, a.widthFt || 0);
      const area = l * w;

      if (a.mode === 'subtract') {
        totalSub += area;
      } else {
        totalAdd += area;
        rawPerimeter += 2 * (l + w);
      }
    }

    if (totalSub >= totalAdd && totalSub > 0) {
      netAreaSqFt = 0;
      warningMessage = 'Subtracted areas are greater than or equal to total room area.';
    } else {
      netAreaSqFt = Math.max(0, totalAdd - totalSub);
    }
    perimeterLinearFt = Math.round(rawPerimeter);
  }

  netAreaSqFt = parseFloat(netAreaSqFt.toFixed(2));

  // 2. Gross Area = Net * (100 + Waste) / 100
  const validWaste = Math.min(LAMINATE_CONSTANTS.maxWastePercent, Math.max(0, wastePercent || 0));
  const grossAreaSqFt = parseFloat((netAreaSqFt * ((100 + validWaste) / 100)).toFixed(2));

  // 3. Floating-point safe box rounding
  // Critical fix: Math.ceil(gross / coverage - 1e-9)
  const validCoverage = boxCoverageSqFt > 0 ? boxCoverageSqFt : LAMINATE_CONSTANTS.defaultBoxCoverageSqFt;
  let boxesNeeded = 0;
  if (grossAreaSqFt > 0 && validCoverage > 0) {
    boxesNeeded = Math.ceil(grossAreaSqFt / validCoverage - EPSILON);
  }

  // 4. Purchased Area & Surplus
  const purchasedAreaSqFt = parseFloat((boxesNeeded * validCoverage).toFixed(2));
  const surplusSqFt = parseFloat(Math.max(0, purchasedAreaSqFt - grossAreaSqFt).toFixed(2));

  // 5. Underlayment (based on NET area)
  // If attachedPad is true, 0 rolls needed
  let underlaymentRolls = 0;
  if (!attachedPad && netAreaSqFt > 0) {
    const validRollCoverage = rollCoverageSqFt > 0 ? rollCoverageSqFt : LAMINATE_CONSTANTS.defaultRollCoverageSqFt;
    underlaymentRolls = Math.ceil(netAreaSqFt / validRollCoverage - EPSILON);
  }

  // 6. Moldings: ceil(perimeter * 1.10 / 7.8) using ~94 in (7.8 ft) pieces
  const moldingPieces =
    perimeterLinearFt > 0
      ? Math.ceil(
          (perimeterLinearFt * LAMINATE_CONSTANTS.moldingWasteMultiplier) /
            LAMINATE_CONSTANTS.moldingPieceLengthFt -
            EPSILON
        )
      : 0;

  // 7. Costs (whole boxes bought)
  let flooringCost = 0;
  let underlaymentCost = 0;
  let moldingCost = 0;

  if (pricing && pricing.price > 0 && boxesNeeded > 0) {
    if (pricing.basis === 'perBox') {
      flooringCost = parseFloat((boxesNeeded * pricing.price).toFixed(2));
    } else {
      // perSqFt: boxes * coverage * price
      flooringCost = parseFloat((boxesNeeded * validCoverage * pricing.price).toFixed(2));
    }

    if (!attachedPad && underlaymentRolls > 0) {
      const rollPrice =
        typeof pricing.underlaymentPerRoll === 'number'
          ? pricing.underlaymentPerRoll
          : LAMINATE_CONSTANTS.defaultUnderlaymentPricePerRoll;
      underlaymentCost = parseFloat((underlaymentRolls * rollPrice).toFixed(2));
    }

    if (pricing.molding) {
      if (typeof pricing.molding.allowance === 'number' && pricing.molding.allowance > 0) {
        moldingCost = parseFloat(pricing.molding.allowance.toFixed(2));
      } else if (pricing.molding.usePerimeter && perimeterLinearFt > 0) {
        const ftPrice =
          typeof pricing.molding.perLinearFt === 'number'
            ? pricing.molding.perLinearFt
            : LAMINATE_CONSTANTS.defaultMoldingPricePerLinearFt;
        moldingCost = parseFloat((perimeterLinearFt * ftPrice).toFixed(2));
      }
    }
  }

  const materialsSubtotal = parseFloat((flooringCost + underlaymentCost + moldingCost).toFixed(2));
  let salesTaxAmount = 0;
  if (pricing && typeof pricing.salesTaxPercent === 'number' && pricing.salesTaxPercent > 0) {
    salesTaxAmount = parseFloat(((materialsSubtotal * pricing.salesTaxPercent) / 100).toFixed(2));
  }

  const totalDiyCost = parseFloat((materialsSubtotal + salesTaxAmount).toFixed(2));

  // 8. Professional Labor Benchmark
  // Net * Low ($2.00) and Net * High ($5.00)
  const proLaborLow = Math.round(netAreaSqFt * LAMINATE_CONSTANTS.proLaborRateLow);
  const proLaborHigh = Math.round(netAreaSqFt * LAMINATE_CONSTANTS.proLaborRateHigh);

  const diySavingsLow = proLaborLow;
  const diySavingsHigh = proLaborHigh;

  return {
    netAreaSqFt,
    grossAreaSqFt,
    boxCoverageSqFt: validCoverage,
    boxesNeeded,
    purchasedAreaSqFt,
    surplusSqFt,
    attachedPad,
    underlaymentRolls,
    perimeterLinearFt,
    moldingPieces,
    flooringCost,
    underlaymentCost,
    moldingCost,
    materialsSubtotal,
    salesTaxAmount,
    totalDiyCost,
    proLaborLow,
    proLaborHigh,
    diySavingsLow,
    diySavingsHigh,
    warningMessage,
  };
}
