/**
 * Cap Rate Engine — Specialized calculations for the Cap Rate & Commercial Property Value Calculator.
 *
 * Implements 3 solve modes:
 * 1. Cap Rate from NOI + Purchase Price
 * 2. Property Value from NOI + Market Cap Rate
 * 3. Required NOI from Purchase Price + Target Cap Rate
 *
 * Plus:
 * - NOI build-up (units or rent/sqft + other income - vacancy - itemized expenses)
 * - Sensitivity Matrix (Property value grid at Cap Rate ±0.25/0.5/1% and NOI ±5/10%)
 * - Exit Valuation (Holding period + NOI growth + Exit cap rate)
 * - Secondary metrics: GRM, Price/SqFt, Price/Unit, Price-to-NOI (1 / cap rate)
 */

import {
  noi,
  calculateNoiBreakdown,
  capRate,
  valueFromCap,
  noiFromCap,
  grm,
  NoiInput,
  NoiBreakdown,
} from './real-estate-engine';

export type CapRateMode = 'cap-rate' | 'property-value' | 'required-noi';
export type IncomeBasis = 'units' | 'sqft';

export interface CapRateExpenseRow {
  id: string;
  name: string;
  amount: number;
}

export interface CapRateEngineInput {
  mode: CapRateMode;
  noiMode: 'direct' | 'builder';
  directNoi: number;

  // NOI Builder fields
  incomeBasis: IncomeBasis;
  unitCount: number;
  rentPerUnitMonthly: number;
  buildingSqft: number;
  rentPerSqftAnnual: number;
  otherIncomeAnnual: number;
  vacancyPercent: number;

  // Operating Expenses
  propertyTaxAnnual: number;
  insuranceAnnual: number;
  repairsAnnual: number;
  reservesAnnual: number;
  managementPercent: number;
  customExpenses?: CapRateExpenseRow[];

  // Price & Cap Rate inputs
  purchasePrice: number;
  targetCapRatePercent: number;

  // Optional Projections / Exit Analysis
  holdingPeriodYears?: number;
  annualNoiGrowthPercent?: number;
  exitCapRatePercent?: number;
}

export interface SensitivityCell {
  capRatePercent: number;
  capRateDelta: number;
  noiAmount: number;
  noiDeltaPercent: number;
  propertyValue: number | null;
  isBase: boolean;
}

export interface SensitivityGrid {
  capSteps: number[]; // e.g. [-1, -0.5, -0.25, 0, 0.25, 0.5, 1]
  noiSteps: number[]; // e.g. [-10, -5, 0, 5, 10]
  rows: {
    capRatePercent: number;
    capRateDelta: number;
    cells: SensitivityCell[];
  }[];
}

export interface CapRateEngineResult {
  mode: CapRateMode;
  effectiveNoi: number;
  noiBreakdown: NoiBreakdown | null;
  isNoiNegative: boolean;

  // Core Solve Outputs
  calculatedCapRate: number | null; // e.g. 5.315 (%)
  calculatedValue: number | null; // e.g. 1822285.71 ($)
  calculatedRequiredNoi: number | null; // e.g. 168000 ($)

  // Secondary Real Estate Metrics
  grm: number | null;
  pricePerSqft: number | null;
  pricePerUnit: number | null;
  priceToNoiMultiple: number | null;

  // Scenario & Exit Analysis
  exitValue: number | null;
  projectedExitNoi: number | null;

  // Sensitivity Matrix
  sensitivity: SensitivityGrid;
}

function cleanNumber(n: number): number {
  if (Object.is(n, -0) || Math.abs(n) < 1e-12) return 0;
  return Number(n.toFixed(10));
}

/**
 * Generates the 2-dimensional sensitivity grid:
 * Rows: Cap rate steps (base ± delta)
 * Columns: NOI steps (base ± percentage delta)
 * Values: Resulting commercial property valuation (NOI / Cap Rate)
 */
export function calculateSensitivityGrid(
  baseNoi: number,
  baseCapRate: number,
  capSteps = [-1, -0.5, -0.25, 0, 0.25, 0.5, 1],
  noiSteps = [-10, -5, 0, 5, 10]
): SensitivityGrid {
  const rows = capSteps.map((capDelta) => {
    const currentCap = cleanNumber(baseCapRate + capDelta);
    const cells: SensitivityCell[] = noiSteps.map((noiDeltaPct) => {
      const currentNoi = cleanNumber(baseNoi * (1 + noiDeltaPct / 100));
      const propVal = currentCap > 0 ? valueFromCap(currentNoi, currentCap) : null;
      const isBase = capDelta === 0 && noiDeltaPct === 0;

      return {
        capRatePercent: currentCap,
        capRateDelta: capDelta,
        noiAmount: currentNoi,
        noiDeltaPercent: noiDeltaPct,
        propertyValue: propVal,
        isBase,
      };
    });

    return {
      capRatePercent: currentCap,
      capRateDelta: capDelta,
      cells,
    };
  });

  return {
    capSteps,
    noiSteps,
    rows,
  };
}

/**
 * Calculates future exit property valuation based on compound NOI growth and exit cap rate:
 * Projected NOI = Current NOI * (1 + growthPct / 100)^years
 * Exit Value = Projected NOI / (exitCapRatePct / 100)
 */
export function calculateExitValue(
  currentNoi: number,
  annualGrowthPct: number,
  holdingYears: number,
  exitCapRatePct: number
): { exitValue: number | null; projectedNoi: number | null } {
  if (exitCapRatePct <= 0 || holdingYears <= 0 || !Number.isFinite(currentNoi)) {
    return { exitValue: null, projectedNoi: null };
  }
  const projectedNoi = cleanNumber(currentNoi * Math.pow(1 + (annualGrowthPct / 100), holdingYears));
  const exitVal = valueFromCap(projectedNoi, exitCapRatePct);
  return { exitValue: exitVal, projectedNoi };
}

/**
 * Main calculation engine for Cap Rate Calculator tool
 */
export function calculateCapRateTool(input: CapRateEngineInput): CapRateEngineResult {
  let effectiveNoi = 0;
  let breakdown: NoiBreakdown | null = null;
  let grossAnnualRent = 0;

  if (input.noiMode === 'direct') {
    effectiveNoi = cleanNumber(input.directNoi || 0);
  } else {
    // Determine gross rent based on selected basis
    if (input.incomeBasis === 'units') {
      const units = Math.max(0, input.unitCount || 0);
      const rentPerMo = Math.max(0, input.rentPerUnitMonthly || 0);
      grossAnnualRent = cleanNumber(units * rentPerMo * 12);
    } else {
      const sqft = Math.max(0, input.buildingSqft || 0);
      const rentPerSqft = Math.max(0, input.rentPerSqftAnnual || 0);
      grossAnnualRent = cleanNumber(sqft * rentPerSqft);
    }

    const expensesList: { name: string; amount: number }[] = [
      { name: 'Property Tax', amount: Math.max(0, input.propertyTaxAnnual || 0) },
      { name: 'Property Insurance', amount: Math.max(0, input.insuranceAnnual || 0) },
      { name: 'Repairs & Maintenance', amount: Math.max(0, input.repairsAnnual || 0) },
      { name: 'Replacement Reserves', amount: Math.max(0, input.reservesAnnual || 0) },
    ];

    if (Array.isArray(input.customExpenses)) {
      for (const ce of input.customExpenses) {
        if (ce && ce.amount > 0) {
          expensesList.push({ name: ce.name || 'Other Expense', amount: ce.amount });
        }
      }
    }

    const noiInputParams: NoiInput = {
      grossRent: grossAnnualRent,
      otherIncome: Math.max(0, input.otherIncomeAnnual || 0),
      vacancyPct: Math.max(0, input.vacancyPercent || 0),
      expenses: expensesList,
      managementPct: Math.max(0, input.managementPercent || 0),
    };

    effectiveNoi = noi(noiInputParams);
    breakdown = calculateNoiBreakdown(noiInputParams);
  }

  const isNoiNegative = effectiveNoi < 0;

  // Solves
  let calculatedCapRate: number | null = null;
  let calculatedValue: number | null = null;
  let calculatedRequiredNoi: number | null = null;

  const price = Math.max(0, input.purchasePrice || 0);
  const cap = Math.max(0, input.targetCapRatePercent || 0);

  if (input.mode === 'cap-rate') {
    calculatedCapRate = capRate(effectiveNoi, price);
  } else if (input.mode === 'property-value') {
    calculatedValue = valueFromCap(effectiveNoi, cap);
  } else if (input.mode === 'required-noi') {
    calculatedRequiredNoi = noiFromCap(price, cap);
  }

  // Active property value to evaluate metrics against
  const activeValue = input.mode === 'property-value' ? (calculatedValue || 0) : price;
  const activeCap = input.mode === 'cap-rate' ? (calculatedCapRate || cap || 7) : cap;

  // Secondary metrics
  const calculatedGrm = grossAnnualRent > 0 && activeValue > 0 ? grm(activeValue, grossAnnualRent) : null;
  const pricePerSqft = input.buildingSqft > 0 && activeValue > 0 ? cleanNumber(activeValue / input.buildingSqft) : null;
  const pricePerUnit = input.unitCount > 0 && activeValue > 0 ? cleanNumber(activeValue / input.unitCount) : null;
  const priceToNoiMultiple = effectiveNoi > 0 && activeValue > 0 ? cleanNumber(activeValue / effectiveNoi) : null;

  // Exit analysis
  let exitValue: number | null = null;
  let projectedExitNoi: number | null = null;
  if (input.holdingPeriodYears && input.holdingPeriodYears > 0 && input.exitCapRatePercent && input.exitCapRatePercent > 0) {
    const exitCalc = calculateExitValue(
      effectiveNoi,
      input.annualNoiGrowthPercent || 0,
      input.holdingPeriodYears,
      input.exitCapRatePercent
    );
    exitValue = exitCalc.exitValue;
    projectedExitNoi = exitCalc.projectedNoi;
  }

  // Sensitivity Matrix based on active NOI & Cap Rate
  const sensitivityBaseCap = activeCap > 0 ? activeCap : 7.0;
  const sensitivity = calculateSensitivityGrid(effectiveNoi, sensitivityBaseCap);

  return {
    mode: input.mode,
    effectiveNoi,
    noiBreakdown: breakdown,
    isNoiNegative,
    calculatedCapRate,
    calculatedValue,
    calculatedRequiredNoi,
    grm: calculatedGrm,
    pricePerSqft,
    pricePerUnit,
    priceToNoiMultiple,
    exitValue,
    projectedExitNoi,
    sensitivity,
  };
}
