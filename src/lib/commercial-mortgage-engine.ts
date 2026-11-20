/**
 * Commercial Mortgage & LTV Engine
 *
 * Implements commercial real estate loan underwriting:
 * - Payment and balloon payment calculations (loan term vs amortization)
 * - Interest-only periods (e.g. construction or bridge draws)
 * - LTV, DSCR, and Debt Yield underwriting constraints
 * - "How much can I borrow?" max loan sizing (lowest of LTV, DSCR, and Debt Yield)
 * - APR with points and closing costs (effective borrowing rate)
 * - Balloon refinancing projections
 *
 * Reuses verified primitives from `loan-engine.ts` and `real-estate-engine.ts`.
 * 100% client-side, zero network calls.
 */

import {
  payment as calcPayment,
  interestOnlyPayment as calcIoPayment,
  balanceAfter,
  schedule as calcSchedule,
  maxLoanFromPayment,
  aprWithFees,
  LoanScheduleResult,
} from './loan-engine';
import { dscr as calcDscr, debtYield as calcDebtYield } from './real-estate-engine';

export interface CommercialMortgageInput {
  propertyValue: number;
  loanAmount?: number;
  ltvPct?: number; // e.g. 75 for 75%
  ratePct: number; // Annual Percentage Rate, e.g. 7.0 for 7.0%
  termYears: number; // e.g. 10
  amortizationYears: number; // e.g. 25
  interestOnlyMonths?: number; // e.g. 0 or 12
  pointsPct?: number; // Origination points, e.g. 1 for 1%
  otherClosingCosts?: number;
  annualNoi?: number;
}

export interface MaxLoanSizingInput {
  propertyValue: number;
  annualNoi: number;
  ratePct: number;
  amortizationYears: number;
  maxLtvPct: number; // e.g. 75 for 75%
  minDscr: number; // e.g. 1.25
  minDebtYieldPct: number; // e.g. 9.0 for 9%
}

export interface MaxLoanSizingResult {
  propertyValue: number;
  annualNoi: number;
  maxLoanByLtv: number;
  maxLoanByDscr: number;
  maxLoanByDebtYield: number;
  bindingMaxLoan: number;
  bindingConstraint: 'ltv' | 'dscr' | 'debtYield';
  bindingConstraintLabel: string;
  requiredEquity: number;
  actualLtvAtMaxLoan: number;
  actualDscrAtMaxLoan: number | null;
  actualDebtYieldAtMaxLoan: number;
  monthlyPaymentAtMaxLoan: number;
}

export interface CommercialMortgageResult {
  propertyValue: number;
  loanAmount: number;
  ltvPct: number;
  ratePct: number;
  termYears: number;
  termMonths: number;
  amortizationYears: number;
  amortizationMonths: number;
  interestOnlyMonths: number;

  monthlyPayment: number;
  annualDebtService: number;
  interestOnlyMonthlyPayment: number | null;

  balloonBalance: number;
  principalPaidInTerm: number;
  interestPaidInTerm: number;
  totalPaidInTerm: number;

  dscr: number | null;
  debtYieldPct: number | null;
  effectiveRatePct: number | null; // APR accounting for fees over loan term

  feesTotal: number;
  pointsAmount: number;

  schedule: LoanScheduleResult;
}

export interface RefinanceBalloonInput {
  balloonBalance: number;
  newRatePct: number;
  newAmortizationYears: number;
  newTermYears?: number;
  refinanceClosingCosts?: number;
}

export interface RefinanceBalloonResult {
  originalBalloon: number;
  refinancedLoanAmount: number;
  newMonthlyPayment: number;
  newAnnualDebtService: number;
  newBalloonBalance: number;
  newPayoffYears: number;
}

function cleanNumber(n: number): number {
  if (Object.is(n, -0) || Math.abs(n) < 1e-12) return 0;
  return Number(n.toFixed(2));
}

/**
 * Calculate commercial mortgage loan underwriting
 */
export function calculateCommercialMortgage(input: CommercialMortgageInput): CommercialMortgageResult {
  const value = Math.max(0, input.propertyValue);
  let loan = 0;

  if (input.loanAmount !== undefined && input.loanAmount > 0) {
    loan = input.loanAmount;
  } else if (input.ltvPct !== undefined && input.ltvPct > 0) {
    loan = value * (input.ltvPct / 100);
  } else {
    loan = value * 0.75;
  }

  const ltvPct = value > 0 ? (loan / value) * 100 : 0;
  const rate = Math.max(0, input.ratePct);
  const termYrs = Math.max(1, input.termYears);
  const amortYrs = Math.max(termYrs, input.amortizationYears);
  const termMonths = termYrs * 12;
  const amortMonths = amortYrs * 12;
  const ioMonths = Math.min(termMonths, Math.max(0, input.interestOnlyMonths ?? 0));

  // Regular monthly amortizing payment (P&I)
  const regularPmt = calcPayment(loan, rate, amortMonths) ?? 0;
  const ioPmt = ioMonths > 0 ? calcIoPayment(loan, rate) : null;

  // Generate full schedule
  const loanSchedule = calcSchedule({
    principal: loan,
    apr: rate,
    amortizationMonths: amortMonths,
    termMonths: termMonths,
    interestOnlyMonths: ioMonths,
  });

  // Calculate balloon at maturity (accounting for IO period)
  // During IO period, principal is unchanged. Then amortization begins.
  const amortizingMonthsElapsed = Math.max(0, termMonths - ioMonths);
  const balloon = balanceAfter(loan, rate, amortMonths, amortizingMonthsElapsed) ?? 0;

  // Interest and principal paid over the term
  let interestPaid = 0;
  let principalPaid = 0;
  let totalPaid = 0;

  for (let m = 0; m < Math.min(termMonths, loanSchedule.monthlyRows.length); m++) {
    const row = loanSchedule.monthlyRows[m];
    interestPaid += row.interest;
    principalPaid += row.principal;
    totalPaid += row.payment;
  }

  // Fees and effective rate
  const pointsPct = Math.max(0, input.pointsPct ?? 0);
  const pointsAmount = loan * (pointsPct / 100);
  const otherCosts = Math.max(0, input.otherClosingCosts ?? 0);
  const totalFees = pointsAmount + otherCosts;

  let effApr: number | null = null;
  if (totalFees > 0) {
    effApr = aprWithFees(loan, totalFees, rate, termMonths);
  } else {
    effApr = rate;
  }

  // Underwriting metrics: DSCR and Debt Yield
  const annualNoi = input.annualNoi ?? 0;
  const annualDebtService = regularPmt * 12;
  const dscrVal = annualNoi > 0 && annualDebtService > 0 ? calcDscr(annualNoi, annualDebtService) : null;
  const debtYieldVal = annualNoi > 0 && loan > 0 ? calcDebtYield(annualNoi, loan) : null;

  return {
    propertyValue: value,
    loanAmount: cleanNumber(loan),
    ltvPct: Number(ltvPct.toFixed(2)),
    ratePct: rate,
    termYears: termYrs,
    termMonths,
    amortizationYears: amortYrs,
    amortizationMonths: amortMonths,
    interestOnlyMonths: ioMonths,
    monthlyPayment: cleanNumber(regularPmt),
    annualDebtService: cleanNumber(annualDebtService),
    interestOnlyMonthlyPayment: ioPmt !== null ? cleanNumber(ioPmt) : null,
    balloonBalance: cleanNumber(balloon),
    principalPaidInTerm: cleanNumber(principalPaid),
    interestPaidInTerm: cleanNumber(interestPaid),
    totalPaidInTerm: cleanNumber(totalPaid),
    dscr: dscrVal !== null ? Number(dscrVal.toFixed(2)) : null,
    debtYieldPct: debtYieldVal !== null ? Number(debtYieldVal.toFixed(2)) : null,
    effectiveRatePct: effApr !== null ? Number(effApr.toFixed(2)) : null,
    feesTotal: cleanNumber(totalFees),
    pointsAmount: cleanNumber(pointsAmount),
    schedule: loanSchedule,
  };
}

/**
 * Sizing: "How much can I borrow?"
 * Finds maximum loan capacity constrained by:
 * 1. Max LTV
 * 2. Min DSCR
 * 3. Min Debt Yield
 * Lowest of the three limits determines borrowing capacity.
 */
export function calculateMaxLoanSizing(input: MaxLoanSizingInput): MaxLoanSizingResult {
  const value = Math.max(0, input.propertyValue);
  const noi = Math.max(0, input.annualNoi);
  const rate = Math.max(0, input.ratePct);
  const amortMonths = Math.max(1, input.amortizationYears) * 12;

  // 1. LTV Limit
  const maxLtv = Math.max(0, input.maxLtvPct) / 100;
  const loanByLtv = value * maxLtv;

  // 2. DSCR Limit
  // Max Annual Debt Service = NOI / minDscr
  // Max Monthly Payment = (NOI / minDscr) / 12
  const minDscr = Math.max(1.0, input.minDscr);
  const maxMonthlyPmtByDscr = minDscr > 0 ? (noi / minDscr) / 12 : 0;
  const loanByDscr = maxLoanFromPayment(maxMonthlyPmtByDscr, rate, amortMonths) ?? 0;

  // 3. Debt Yield Limit
  // Debt Yield = NOI / Loan  =>  Max Loan = NOI / minDebtYield
  const minDyPct = Math.max(0.1, input.minDebtYieldPct) / 100;
  const loanByDy = minDyPct > 0 ? noi / minDyPct : 0;

  // The binding constraint is the minimum of the three
  const bindingLoan = Math.min(loanByLtv, loanByDscr, loanByDy);
  let constraint: 'ltv' | 'dscr' | 'debtYield' = 'ltv';
  let constraintLabel = `Max LTV Limit (${input.maxLtvPct}%)`;

  if (bindingLoan === loanByDscr) {
    constraint = 'dscr';
    constraintLabel = `Min DSCR Limit (${minDscr}× Coverage)`;
  } else if (bindingLoan === loanByDy) {
    constraint = 'debtYield';
    constraintLabel = `Min Debt Yield Limit (${input.minDebtYieldPct}%)`;
  }

  const requiredEquity = Math.max(0, value - bindingLoan);
  const actualLtvAtMax = value > 0 ? (bindingLoan / value) * 100 : 0;
  const pmtAtMax = calcPayment(bindingLoan, rate, amortMonths) ?? 0;
  const actualDscrAtMax = pmtAtMax > 0 && noi > 0 ? noi / (pmtAtMax * 12) : null;
  const actualDyAtMax = bindingLoan > 0 ? (noi / bindingLoan) * 100 : 0;

  return {
    propertyValue: value,
    annualNoi: noi,
    maxLoanByLtv: Math.round(loanByLtv),
    maxLoanByDscr: Math.round(loanByDscr),
    maxLoanByDebtYield: Math.round(loanByDy),
    bindingMaxLoan: Math.round(bindingLoan),
    bindingConstraint: constraint,
    bindingConstraintLabel: constraintLabel,
    requiredEquity: Math.round(requiredEquity),
    actualLtvAtMaxLoan: Number(actualLtvAtMax.toFixed(2)),
    actualDscrAtMaxLoan: actualDscrAtMax !== null ? Number(actualDscrAtMax.toFixed(2)) : null,
    actualDebtYieldAtMaxLoan: Number(actualDyAtMax.toFixed(2)),
    monthlyPaymentAtMaxLoan: Number(pmtAtMax.toFixed(2)),
  };
}

/**
 * Refinance the balloon payment at maturity
 */
export function calculateBalloonRefinance(input: RefinanceBalloonInput): RefinanceBalloonResult {
  const origBalloon = Math.max(0, input.balloonBalance);
  const closingCosts = Math.max(0, input.refinanceClosingCosts ?? 0);
  const refiLoanAmount = origBalloon + closingCosts;

  const rate = Math.max(0, input.newRatePct);
  const amortYears = Math.max(1, input.newAmortizationYears);
  const termYears = input.newTermYears ?? amortYears;
  const amortMonths = amortYears * 12;
  const termMonths = termYears * 12;

  const newPmt = calcPayment(refiLoanAmount, rate, amortMonths) ?? 0;
  const newAnnualDebt = newPmt * 12;
  const newBalloon = balanceAfter(refiLoanAmount, rate, amortMonths, termMonths) ?? 0;

  return {
    originalBalloon: cleanNumber(origBalloon),
    refinancedLoanAmount: cleanNumber(refiLoanAmount),
    newMonthlyPayment: cleanNumber(newPmt),
    newAnnualDebtService: cleanNumber(newAnnualDebt),
    newBalloonBalance: cleanNumber(newBalloon),
    newPayoffYears: termYears,
  };
}
