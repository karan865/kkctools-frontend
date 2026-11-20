/**
 * Business Valuation Engine
 * Pure mathematical models for small and mid-market business appraisals:
 * 1. Seller's Discretionary Earnings (SDE) calculation and add-back bridge
 * 2. Earnings Before Interest, Taxes, Depreciation, and Amortization (EBITDA) & Adjusted EBITDA
 * 3. Enterprise Value (EV) multiple valuation (Low, High, Midpoint)
 * 4. Equity Value / Net Proceeds Bridge (EV − Debt + Cash ± Working Capital Variance)
 * 5. 5×5 Valuation Sensitivity Matrix (Earnings ±10% vs Multiples ±0.5×)
 * 6. Asset-Based Floor Valuation (Tangible Assets − Total Liabilities)
 * 7. Deal Structure Model (Cash at close + Seller Financed Note + Earn-out)
 *
 * Rules:
 * - 100% pure TypeScript. Zero I/O, zero network, zero side effects.
 * - Handles negative earnings gracefully (flags that earnings multiples do not apply; defers to asset approach).
 * - Avoids floating-point precision artifacts.
 */

import { payment as calculateAmortPayment } from './loan-engine';

export interface SdeAddBacksInput {
  netProfit: number; // Pre-tax ordinary net profit from P&L
  ownerSalary: number; // W-2 / draw of one full-time owner-operator
  ownerBenefits: number; // Health insurance, personal vehicle, retirement
  personalExpenses: number; // Discretionary expenses run through company accounts
  oneOffExpenses: number; // Non-recurring litigation, moving, extraordinary repairs
  depreciationAmortization: number; // Non-cash D&A write-offs
  interestExpense: number; // Debt servicing interest expense
}

export interface SdeResult {
  sde: number;
  bridge: Array<{
    category: string;
    label: string;
    amount: number;
    description: string;
    buyerAcceptance: 'generally-accepted' | 'often-scrutinized' | 'strictly-examined';
  }>;
}

export interface EbitdaInput {
  netProfit: number;
  interestExpense: number;
  incomeTaxes?: number;
  depreciationAmortization: number;
  sde: number;
  replacementManagerSalary: number; // Market rate to hire a general manager
}

export interface EbitdaResult {
  reportedEbitda: number;
  adjustedEbitda: number; // SDE − Replacement Manager Salary
}

export interface ValuationMultipleInput {
  earnings: number; // Either SDE or Adjusted EBITDA
  multipleLow: number; // e.g. 2.0
  multipleHigh: number; // e.g. 3.0
  debtToRepay?: number; // Company debt to be extinguished at close
  cashKeptBySeller?: number; // Retained cash
  workingCapitalActual?: number;
  workingCapitalTarget?: number;
}

export interface ValuationMultipleResult {
  earnings: number;
  multipleLow: number;
  multipleHigh: number;
  multipleMid: number;
  enterpriseValueLow: number;
  enterpriseValueHigh: number;
  enterpriseValueMid: number;
  workingCapitalAdjustment: number;
  equityValueLow: number;
  equityValueHigh: number;
  equityValueMid: number;
  isEarningsPositive: boolean;
}

export interface SensitivityMatrixCell {
  earnings: number;
  earningsDeltaPct: number;
  multiple: number;
  enterpriseValue: number;
}

export interface AssetValuationInput {
  equipmentValue: number; // Orderly liquidation or FMV
  inventoryValue: number; // Cost basis of salable inventory
  accountsReceivable: number; // Collectible receivables
  cashAndEquivalents: number;
  otherTangibleAssets: number;
  totalLiabilities: number; // Short and long term obligations
}

export interface AssetValuationResult {
  totalTangibleAssets: number;
  totalLiabilities: number;
  netAssetValue: number; // Liquidation / asset-based equity floor
}

export interface DealStructureInput {
  totalPurchasePrice: number;
  cashAtClosePercent: number; // e.g. 70 for 70%
  sellerNotePercent: number; // e.g. 20 for 20%
  sellerNoteInterestRate: number; // e.g. 7.0 for 7%
  sellerNoteTermYears: number; // e.g. 5 for 5 years
  earnOutPercent: number; // e.g. 10 for 10%
}

export interface DealStructureResult {
  cashAtCloseAmount: number;
  sellerNoteAmount: number;
  sellerNoteMonthlyPayment: number;
  sellerNoteTotalInterest: number;
  earnOutAmount: number;
}

function round2(v: number): number {
  if (Object.is(v, -0) || Math.abs(v) < 1e-12) return 0;
  return Math.round(v * 100) / 100;
}

/**
 * Calculates Seller's Discretionary Earnings (SDE) and creates an itemized add-back bridge.
 */
export function calculateSde(input: SdeAddBacksInput): SdeResult {
  const netProfit = input.netProfit || 0;
  const ownerSalary = Math.max(0, input.ownerSalary || 0);
  const ownerBenefits = Math.max(0, input.ownerBenefits || 0);
  const personal = Math.max(0, input.personalExpenses || 0);
  const oneOff = Math.max(0, input.oneOffExpenses || 0);
  const da = Math.max(0, input.depreciationAmortization || 0);
  const interest = Math.max(0, input.interestExpense || 0);

  const sde = round2(
    netProfit + ownerSalary + ownerBenefits + personal + oneOff + da + interest
  );

  const bridge: SdeResult['bridge'] = [
    {
      category: 'Net Profit',
      label: 'Pre-Tax Net Operating Income',
      amount: netProfit,
      description: 'Reported ordinary earnings before taxes from year-end P&L',
      buyerAcceptance: 'generally-accepted',
    },
    {
      category: 'Owner Compensation',
      label: 'Primary Owner Salary & Draws',
      amount: ownerSalary,
      description: 'W-2 salary or distributions paid to single primary operator',
      buyerAcceptance: 'generally-accepted',
    },
    {
      category: 'Owner Benefits',
      label: 'Owner Perks & Fringe Benefits',
      amount: ownerBenefits,
      description: 'Personal health insurance, company vehicle, retirement matches',
      buyerAcceptance: 'generally-accepted',
    },
    {
      category: 'Discretionary',
      label: 'Personal & Non-Business Expenses',
      amount: personal,
      description: 'Cell phones, club memberships, family travel run through books',
      buyerAcceptance: 'often-scrutinized',
    },
    {
      category: 'Non-Recurring',
      label: 'One-Off & Extraordinary Expenses',
      amount: oneOff,
      description: 'One-time legal defense, office relocation, storm damage repairs',
      buyerAcceptance: 'often-scrutinized',
    },
    {
      category: 'Non-Cash',
      label: 'Depreciation & Amortization',
      amount: da,
      description: 'Non-cash accounting write-downs of capital machinery & intangibles',
      buyerAcceptance: 'generally-accepted',
    },
    {
      category: 'Financing',
      label: 'Interest Expense',
      amount: interest,
      description: 'Existing debt servicing; buyer establishes their own debt capital structure',
      buyerAcceptance: 'generally-accepted',
    },
  ];

  return {
    sde,
    bridge,
  };
}

/**
 * Calculates reported and adjusted EBITDA for management-operated businesses.
 */
export function calculateEbitda(input: EbitdaInput): EbitdaResult {
  const netProfit = input.netProfit || 0;
  const interest = Math.max(0, input.interestExpense || 0);
  const taxes = Math.max(0, input.incomeTaxes || 0);
  const da = Math.max(0, input.depreciationAmortization || 0);
  const managerSalary = Math.max(0, input.replacementManagerSalary || 0);

  const reportedEbitda = round2(netProfit + interest + taxes + da);
  const adjustedEbitda = round2(input.sde - managerSalary);

  return {
    reportedEbitda,
    adjustedEbitda,
  };
}

/**
 * Computes Enterprise Value range and Net Equity proceeds to seller.
 */
export function calculateBusinessValuation(input: ValuationMultipleInput): ValuationMultipleResult {
  const earnings = input.earnings || 0;
  const isEarningsPositive = earnings > 0;

  const multLow = Math.max(0.1, input.multipleLow || 0);
  const multHigh = Math.max(multLow, input.multipleHigh || multLow);
  const multMid = round2((multLow + multHigh) / 2);

  const evLow = isEarningsPositive ? round2(earnings * multLow) : 0;
  const evHigh = isEarningsPositive ? round2(earnings * multHigh) : 0;
  const evMid = isEarningsPositive ? round2(earnings * multMid) : 0;

  const debt = Math.max(0, input.debtToRepay || 0);
  const cash = Math.max(0, input.cashKeptBySeller || 0);

  const wcActual = input.workingCapitalActual || 0;
  const wcTarget = input.workingCapitalTarget || 0;
  const wcAdjustment = round2(wcActual - wcTarget);

  const equityValueLow = isEarningsPositive ? round2(evLow - debt + cash + wcAdjustment) : 0;
  const equityValueHigh = isEarningsPositive ? round2(evHigh - debt + cash + wcAdjustment) : 0;
  const equityValueMid = isEarningsPositive ? round2(evMid - debt + cash + wcAdjustment) : 0;

  return {
    earnings,
    multipleLow: multLow,
    multipleHigh: multHigh,
    multipleMid: multMid,
    enterpriseValueLow: evLow,
    enterpriseValueHigh: evHigh,
    enterpriseValueMid: evMid,
    workingCapitalAdjustment: wcAdjustment,
    equityValueLow,
    equityValueHigh,
    equityValueMid,
    isEarningsPositive,
  };
}

/**
 * Builds a 5x5 sensitivity matrix around base earnings and midpoint multiple.
 */
export function generateValuationSensitivity(
  baseEarnings: number,
  baseMultiple: number
): {
  earningsSteps: number[];
  multipleSteps: number[];
  grid: SensitivityMatrixCell[][];
} {
  const earnMultipliers = [-10, -5, 0, 5, 10]; // % deltas
  const multDeltas = [-0.5, -0.25, 0, 0.25, 0.5]; // Multiple deltas

  const earningsSteps = earnMultipliers.map((pct) => round2(baseEarnings * (1 + pct / 100)));
  const multipleSteps = multDeltas.map((d) => Math.max(0.5, round2(baseMultiple + d)));

  const grid: SensitivityMatrixCell[][] = [];

  for (let r = 0; r < earnMultipliers.length; r++) {
    const row: SensitivityMatrixCell[] = [];
    const currentEarn = earningsSteps[r];
    const pct = earnMultipliers[r];

    for (let c = 0; c < multDeltas.length; c++) {
      const currentMult = multipleSteps[c];
      const ev = round2(currentEarn * currentMult);
      row.push({
        earnings: currentEarn,
        earningsDeltaPct: pct,
        multiple: currentMult,
        enterpriseValue: Math.max(0, ev),
      });
    }
    grid.push(row);
  }

  return {
    earningsSteps,
    multipleSteps,
    grid,
  };
}

/**
 * Computes Asset-Based Valuation (Net Asset Value floor).
 */
export function calculateAssetValuation(input: AssetValuationInput): AssetValuationResult {
  const equip = Math.max(0, input.equipmentValue || 0);
  const inv = Math.max(0, input.inventoryValue || 0);
  const ar = Math.max(0, input.accountsReceivable || 0);
  const cash = Math.max(0, input.cashAndEquivalents || 0);
  const other = Math.max(0, input.otherTangibleAssets || 0);
  const liab = Math.max(0, input.totalLiabilities || 0);

  const totalTangibleAssets = round2(equip + inv + ar + cash + other);
  const netAssetValue = round2(totalTangibleAssets - liab);

  return {
    totalTangibleAssets,
    totalLiabilities: liab,
    netAssetValue,
  };
}

/**
 * Calculates Deal Structure breakdown: Cash at close, Seller Note, and Earn-Out.
 */
export function calculateDealStructure(input: DealStructureInput): DealStructureResult {
  const price = Math.max(0, input.totalPurchasePrice || 0);
  const cashPct = Math.max(0, Math.min(100, input.cashAtClosePercent || 0));
  const notePct = Math.max(0, Math.min(100 - cashPct, input.sellerNotePercent || 0));
  const earnPct = Math.max(0, Math.min(100 - cashPct - notePct, input.earnOutPercent || 0));

  const cashAtCloseAmount = round2(price * (cashPct / 100));
  const sellerNoteAmount = round2(price * (notePct / 100));
  const earnOutAmount = round2(price * (earnPct / 100));

  let sellerNoteMonthlyPayment = 0;
  let sellerNoteTotalInterest = 0;

  if (sellerNoteAmount > 0 && input.sellerNoteTermYears > 0) {
    const termMonths = Math.round(input.sellerNoteTermYears * 12);
    const pmt = calculateAmortPayment(sellerNoteAmount, input.sellerNoteInterestRate || 0, termMonths);
    if (pmt) {
      sellerNoteMonthlyPayment = round2(pmt);
      const totalPayments = round2(pmt * termMonths);
      sellerNoteTotalInterest = round2(Math.max(0, totalPayments - sellerNoteAmount));
    }
  }

  return {
    cashAtCloseAmount,
    sellerNoteAmount,
    sellerNoteMonthlyPayment,
    sellerNoteTotalInterest,
    earnOutAmount,
  };
}
