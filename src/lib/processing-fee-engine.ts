/**
 * processing-fee-engine.ts — Credit Card Processing Fee & Merchant Math Engine
 *
 * Core engine for /processing-fee-calculator/
 * Pure functions only. Zero DOM, zero network, zero side-effects.
 */

import { ProcessorPreset } from '@/content/processing-fee-presets';

export interface FeeCalculationResult {
  fee: number;
  net: number;
  effectivePct: number;
  percentageCut: number;
  fixedCut: number;
  intlCut: number;
}

export interface MonthlyFeeResult {
  monthlyVolume: number;
  transactionFees: number;
  monthlyFixedFee: number;
  totalMonthlyFees: number;
  annualFees: number;
  netMonthly: number;
  effectiveRatePct: number;
}

export interface PlanBreakEvenResult {
  breakEvenTx: number | null;
  breakEvenVolume: number | null;
  stdFeePerTx: number;
  planFeePerTx: number;
  savingsPerTx: number;
  isViable: boolean;
}

export interface PresetComparisonRow {
  id: string;
  provider: string;
  type: string;
  planName?: string;
  rateLabel: string;
  saleFee: number;
  saleNet: number;
  effectivePct: number;
  monthlyCost: number;
  annualCost: number;
  isCheapest: boolean;
  sourceUrl: string;
  checked: string;
}

function cleanNumber(val: number): number {
  if (Object.is(val, -0) || Math.abs(val) < 1e-12) return 0;
  return Number(val.toFixed(2));
}

function cleanPrecision(val: number, decimals: number = 4): number {
  if (Object.is(val, -0) || Math.abs(val) < 1e-12) return 0;
  return Number(val.toFixed(decimals));
}

/**
 * Calculates payment processing fee, net proceeds, and effective percentage on a single sale.
 */
export function calculateSaleFee(
  saleAmount: number,
  pct: number,
  fixed: number,
  intlPct: number = 0,
  fxPct: number = 0
): FeeCalculationResult {
  if (saleAmount <= 0) {
    return {
      fee: 0,
      net: 0,
      effectivePct: 0,
      percentageCut: 0,
      fixedCut: 0,
      intlCut: 0,
    };
  }

  const basePctDec = Math.max(0, pct) / 100;
  const intlPctDec = (Math.max(0, intlPct) + Math.max(0, fxPct)) / 100;
  const fixedFee = Math.max(0, fixed);

  const percentageCut = saleAmount * basePctDec;
  const intlCut = saleAmount * intlPctDec;
  const totalFee = percentageCut + fixedFee + intlCut;
  const netProceeds = saleAmount - totalFee;

  return {
    fee: cleanNumber(totalFee),
    net: cleanNumber(netProceeds),
    effectivePct: cleanPrecision((totalFee / saleAmount) * 100, 2),
    percentageCut: cleanNumber(percentageCut),
    fixedCut: cleanNumber(fixedFee),
    intlCut: cleanNumber(intlCut),
  };
}

/**
 * Calculates the exact gross amount a merchant must charge so that net proceeds equal targetNet.
 * Gross = (TargetNet + FixedFee) / (1 - (Pct + IntlPct + FxPct))
 */
export function calculateGrossUp(
  targetNet: number,
  pct: number,
  fixed: number,
  intlPct: number = 0,
  fxPct: number = 0
): number | null {
  if (targetNet <= 0) return 0;

  const totalPctDec = (Math.max(0, pct) + Math.max(0, intlPct) + Math.max(0, fxPct)) / 100;
  if (totalPctDec >= 1) return null; // Impossible to gross-up if fee >= 100%

  const fixedFee = Math.max(0, fixed);
  const gross = (targetNet + fixedFee) / (1 - totalPctDec);
  return cleanNumber(gross);
}

/**
 * Computes monthly and annual merchant cost across sales volume and transaction count.
 */
export function calculateMonthlyFees(
  avgSale: number,
  txPerMonth: number,
  pct: number,
  fixed: number,
  monthlyFee: number = 0,
  intlPct: number = 0,
  fxPct: number = 0
): MonthlyFeeResult {
  const safeAvgSale = Math.max(0, avgSale);
  const safeTxCount = Math.max(0, txPerMonth);
  const safeMonthlyFee = Math.max(0, monthlyFee);

  const monthlyVolume = safeAvgSale * safeTxCount;
  const singleSale = calculateSaleFee(safeAvgSale, pct, fixed, intlPct, fxPct);
  const txTotalFees = singleSale.fee * safeTxCount;
  const totalMonthlyFees = txTotalFees + safeMonthlyFee;
  const annualFees = totalMonthlyFees * 12;
  const netMonthly = monthlyVolume - totalMonthlyFees;
  const effectiveRatePct = monthlyVolume > 0 ? (totalMonthlyFees / monthlyVolume) * 100 : 0;

  return {
    monthlyVolume: cleanNumber(monthlyVolume),
    transactionFees: cleanNumber(txTotalFees),
    monthlyFixedFee: cleanNumber(safeMonthlyFee),
    totalMonthlyFees: cleanNumber(totalMonthlyFees),
    annualFees: cleanNumber(annualFees),
    netMonthly: cleanNumber(netMonthly),
    effectiveRatePct: cleanPrecision(effectiveRatePct, 2),
  };
}

/**
 * Computes the break-even transaction count and sales volume for a paid subscription plan vs standard flat rate.
 * Example: Square Free (2.6% + $0.15) vs Square Plus ($49/mo, 2.5% + $0.15).
 */
export function calculatePlanBreakEven(
  stdPct: number,
  stdFixed: number,
  planPct: number,
  planFixed: number,
  planMonthlyFee: number,
  avgTicket: number
): PlanBreakEvenResult {
  const safeTicket = Math.max(0.01, avgTicket);
  const stdFeePerTx = safeTicket * (stdPct / 100) + stdFixed;
  const planFeePerTx = safeTicket * (planPct / 100) + planFixed;
  const savingsPerTx = stdFeePerTx - planFeePerTx;

  if (savingsPerTx <= 0 || planMonthlyFee <= 0) {
    return {
      breakEvenTx: null,
      breakEvenVolume: null,
      stdFeePerTx: cleanNumber(stdFeePerTx),
      planFeePerTx: cleanNumber(planFeePerTx),
      savingsPerTx: cleanNumber(savingsPerTx),
      isViable: false,
    };
  }

  const breakEvenTx = Math.ceil(planMonthlyFee / savingsPerTx);
  const breakEvenVolume = cleanNumber(breakEvenTx * safeTicket);

  return {
    breakEvenTx,
    breakEvenVolume,
    stdFeePerTx: cleanNumber(stdFeePerTx),
    planFeePerTx: cleanNumber(planFeePerTx),
    savingsPerTx: cleanPrecision(savingsPerTx, 4),
    isViable: true,
  };
}

/**
 * Calculates credit card surcharge percentage and dollar surcharge needed to offset processing costs.
 */
export function calculateSurcharge(
  saleAmount: number,
  pct: number,
  fixed: number,
  maxLegalCapPct: number = 0 // optional user-set cap; 0 = no cap. Surcharge rules vary by network, processor and location (not hard-coded)
): {
  surchargeNeededPct: number;
  appliedSurchargePct: number;
  surchargeAmount: number;
  finalCustomerTotal: number;
  isCapped: boolean;
} {
  if (saleAmount <= 0) {
    return {
      surchargeNeededPct: 0,
      appliedSurchargePct: 0,
      surchargeAmount: 0,
      finalCustomerTotal: 0,
      isCapped: false,
    };
  }

  const grossNeeded = calculateGrossUp(saleAmount, pct, fixed) ?? saleAmount;
  const feeDollar = grossNeeded - saleAmount;
  const surchargeNeededPct = (feeDollar / saleAmount) * 100;

  const isCapped = maxLegalCapPct > 0 && surchargeNeededPct > maxLegalCapPct;
  const appliedSurchargePct = isCapped ? maxLegalCapPct : surchargeNeededPct;
  const surchargeAmount = cleanNumber(saleAmount * (appliedSurchargePct / 100));
  const finalCustomerTotal = cleanNumber(saleAmount + surchargeAmount);

  return {
    surchargeNeededPct: cleanPrecision(surchargeNeededPct, 2),
    appliedSurchargePct: cleanPrecision(appliedSurchargePct, 2),
    surchargeAmount,
    finalCustomerTotal,
    isCapped,
  };
}

/**
 * Compares an array of processor presets for a given sale amount and monthly transaction profile.
 * Highlights the lowest monthly total cost.
 */
export function comparePresets(
  presets: ProcessorPreset[],
  saleAmount: number,
  monthlyTx: number = 200,
  avgSale?: number
): PresetComparisonRow[] {
  const safeAvg = avgSale !== undefined && avgSale > 0 ? avgSale : saleAmount;

  const rows = presets.map((p) => {
    const saleRes = calculateSaleFee(saleAmount, p.pct, p.fixed);
    const monthlyRes = calculateMonthlyFees(safeAvg, monthlyTx, p.pct, p.fixed, p.monthlyFee);

    return {
      id: p.id,
      provider: p.provider,
      type: p.type,
      planName: p.planName,
      rateLabel: `${p.pct}% + $${p.fixed.toFixed(2)}${p.monthlyFee > 0 ? ` + $${p.monthlyFee}/mo` : ''}`,
      saleFee: saleRes.fee,
      saleNet: saleRes.net,
      effectivePct: saleRes.effectivePct,
      monthlyCost: monthlyRes.totalMonthlyFees,
      annualCost: monthlyRes.annualFees,
      isCheapest: false,
      sourceUrl: p.sourceUrl,
      checked: p.checked,
    };
  });

  if (rows.length === 0) return [];

  // Determine lowest monthly cost
  let minCost = Infinity;
  rows.forEach((r) => {
    if (r.monthlyCost < minCost) minCost = r.monthlyCost;
  });

  return rows
    .map((r) => ({
      ...r,
      isCheapest: r.monthlyCost === minCost,
    }))
    .sort((a, b) => a.monthlyCost - b.monthlyCost);
}
