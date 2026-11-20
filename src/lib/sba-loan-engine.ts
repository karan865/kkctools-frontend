/**
 * SBA Loan Engine (7(a) and 504)
 *
 * Implements mathematical underwriting for Small Business Administration (SBA) loans:
 * 1. SBA 504 two-loan structure:
 *    - Bank 1st lien (typically ~50% of project, commercial bank terms)
 *    - CDC / SBA 2nd lien debenture (typically ~40% of project, 10/20/25 yr pegged to Treasury)
 *    - Borrower equity (typically ~10% standard, 15% special-use/startup)
 *    - CDC guarantee / debenture fees (~3% per SBA.gov, can be financed into CDC note)
 *    - Blended interest rate, combined monthly payment, amortization schedule, and bank balloon payoff
 * 2. SBA 7(a) general small business loan:
 *    - Term loan with fixed or variable rate (base + spread)
 *    - SBA guarantee fee (upfront % or $, can be financed) and packaging fees
 * 3. 504 vs 7(a) head-to-head comparison:
 *    - Monthly debt service savings and lifetime interest differential
 * 4. Business acquisition (7(a) acquisition financing):
 *    - Purchase price, buyer equity injection, seller note (subordinated debt), and 7(a) senior loan
 *    - Combined debt service and Debt Service Coverage Ratio (DSCR) against cash flow / SDE
 *
 * References:
 * - SBA.gov 504 Loan Program Guidelines (10, 20, 25-yr terms, ~3% fee structure)
 * - SBA.gov 7(a) Loan Program Guidelines ($5M max statutory cap)
 *
 * Reuses verified primitives from `loan-engine.ts` and `real-estate-engine.ts`.
 * 100% client-side, zero network calls.
 */

import {
  payment as calcPayment,
  balanceAfter,
  schedule as calcSchedule,
  LoanScheduleResult,
  AnnualScheduleSummary,
} from './loan-engine';
import { dscr as calcDscr } from './real-estate-engine';

export interface Sba504Input {
  projectCost: number; // e.g. 2000000
  bankPct: number; // e.g. 50
  bankRatePct: number; // e.g. 7.0
  bankTermYears: number; // e.g. 25 (or balloon term like 10)
  bankAmortYears: number; // e.g. 25
  cdcPct: number; // e.g. 40
  cdcRatePct: number; // e.g. 6.5
  cdcTermYears: number; // 10, 20, or 25 per SBA rules
  cdcFeePct?: number; // e.g. 3.0% (per SBA.gov ~3% debt)
  cdcFeeFinanced?: boolean; // if true, fees are rolled into CDC loan balance
  annualCashFlow?: number; // optional NOI or operating cash flow for DSCR
}

export interface Sba504Result {
  projectCost: number;
  bankPct: number;
  cdcPct: number;
  equityPct: number;
  bankLoanAmount: number;
  cdcBaseLoanAmount: number;
  cdcFees: number;
  cdcTotalLoanAmount: number;
  equityAmount: number;
  totalLoanAmount: number;
  bankMonthlyPayment: number;
  cdcMonthlyPayment: number;
  totalMonthlyPayment: number;
  blendedRatePct: number;
  bankBalloonPayment: number;
  totalBankInterest: number;
  totalCdcInterest: number;
  totalInterest: number;
  totalPayments: number;
  dscr: number | null;
  bankSchedule: LoanScheduleResult | null;
  cdcSchedule: LoanScheduleResult | null;
  combinedAnnualSchedule: AnnualScheduleSummary[];
}

export interface Sba7aInput {
  loanAmount: number; // e.g. 1800000
  ratePct: number; // e.g. 9.0 (either fixed or base + spread)
  termYears: number; // e.g. 10 (working cap/equipment) or 25 (real estate)
  guaranteeFeePct?: number; // e.g. 0 to 3.75
  otherFees?: number; // closing or packaging fees
  feesFinanced?: boolean;
  annualCashFlow?: number;
}

export interface Sba7aResult {
  baseLoanAmount: number;
  guaranteeFee: number;
  otherFees: number;
  totalFinancedAmount: number;
  ratePct: number;
  termYears: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayments: number;
  dscr: number | null;
  schedule: LoanScheduleResult | null;
}

export interface SbaCompareResult {
  projectCost: number;
  totalDebt: number;
  sba504: Sba504Result;
  sba7a: Sba7aResult;
  monthlyPaymentSavings504: number; // positive means 504 is cheaper per month
  totalInterestSavings504: number; // positive means 504 saves interest overall
  annualPaymentSavings504: number;
}

export interface SbaAcquisitionInput {
  purchasePrice: number; // e.g. 1500000
  buyerEquityPct: number; // e.g. 10
  sellerNotePct: number; // e.g. 15
  sellerNoteRatePct: number; // e.g. 8.0
  sellerNoteTermYears: number; // e.g. 5
  sellerNoteInterestOnly?: boolean;
  sbaRatePct: number; // e.g. 10.5
  sbaTermYears: number; // e.g. 10
  annualSdeOrCashFlow: number; // Seller's Discretionary Earnings or EBITDA
  minDscr?: number; // e.g. 1.25 benchmark
}

export interface SbaAcquisitionResult {
  purchasePrice: number;
  buyerEquityAmount: number;
  sellerNoteAmount: number;
  sbaLoanAmount: number;
  sbaMonthlyPayment: number;
  sellerNoteMonthlyPayment: number;
  totalMonthlyDebtService: number;
  annualDebtService: number;
  annualSdeOrCashFlow: number;
  dscr: number | null;
  meetsMinDscr: boolean;
  postDebtAnnualCashFlow: number;
}

function clean(n: number): number {
  if (Object.is(n, -0) || Math.abs(n) < 1e-10) return 0;
  return Number(n.toFixed(6));
}

/**
 * Calculates full SBA 504 loan structure.
 */
export function calculateSba504(input: Sba504Input): Sba504Result | null {
  const {
    projectCost,
    bankPct,
    bankRatePct,
    bankTermYears,
    bankAmortYears,
    cdcPct,
    cdcRatePct,
    cdcTermYears,
    cdcFeePct = 0,
    cdcFeeFinanced = false,
    annualCashFlow,
  } = input;

  if (projectCost <= 0 || bankPct <= 0 || cdcPct <= 0 || bankPct + cdcPct > 100) {
    return null;
  }
  if (bankAmortYears <= 0 || cdcTermYears <= 0 || bankTermYears <= 0) {
    return null;
  }

  const equityPct = clean(Math.max(0, 100 - bankPct - cdcPct));
  const bankLoanAmount = clean(projectCost * (bankPct / 100));
  const cdcBaseLoanAmount = clean(projectCost * (cdcPct / 100));
  const cdcFees = clean(cdcBaseLoanAmount * (Math.max(0, cdcFeePct) / 100));
  const cdcTotalLoanAmount = clean(cdcBaseLoanAmount + (cdcFeeFinanced ? cdcFees : 0));
  const equityAmount = clean(projectCost * (equityPct / 100));
  const totalLoanAmount = clean(bankLoanAmount + cdcTotalLoanAmount);

  // Bank loan payment & schedule
  const bankAmortMonths = Math.round(bankAmortYears * 12);
  const bankTermMonths = Math.round(bankTermYears * 12);
  const bankMonthlyPayment = calcPayment(bankLoanAmount, bankRatePct, bankAmortMonths);
  if (bankMonthlyPayment === null) return null;

  // Bank balloon if balloon term < amortization term
  let bankBalloonPayment = 0;
  if (bankTermMonths < bankAmortMonths) {
    const bal = balanceAfter(bankLoanAmount, bankRatePct, bankAmortMonths, bankTermMonths);
    bankBalloonPayment = bal !== null ? clean(bal) : 0;
  }

  const bankSchedule = calcSchedule({
    principal: bankLoanAmount,
    apr: bankRatePct,
    amortizationMonths: bankAmortMonths,
    termMonths: bankTermMonths < bankAmortMonths ? bankTermMonths : undefined,
  });

  // CDC debenture payment & schedule
  const cdcTermMonths = Math.round(cdcTermYears * 12);
  const cdcMonthlyPayment = calcPayment(cdcTotalLoanAmount, cdcRatePct, cdcTermMonths);
  if (cdcMonthlyPayment === null) return null;

  const cdcSchedule = calcSchedule({
    principal: cdcTotalLoanAmount,
    apr: cdcRatePct,
    amortizationMonths: cdcTermMonths,
  });

  const totalMonthlyPayment = clean(bankMonthlyPayment + cdcMonthlyPayment);

  // Blended interest rate weighted by principal
  const blendedRatePct = totalLoanAmount > 0
    ? clean(((bankLoanAmount * bankRatePct) + (cdcTotalLoanAmount * cdcRatePct)) / totalLoanAmount)
    : 0;

  const totalBankInterest = bankSchedule ? bankSchedule.totalInterest : 0;
  const totalCdcInterest = cdcSchedule ? cdcSchedule.totalInterest : 0;
  const totalInterest = clean(totalBankInterest + totalCdcInterest);
  const totalPayments = clean(
    (bankSchedule ? bankSchedule.totalPayments : 0) +
    (cdcSchedule ? cdcSchedule.totalPayments : 0)
  );

  // DSCR if cash flow supplied
  const annualDebtService = totalMonthlyPayment * 12;
  const dscr = (annualCashFlow && annualCashFlow > 0)
    ? calcDscr(annualCashFlow, annualDebtService)
    : null;

  // Merge annual summaries for combined view
  const combinedAnnualSchedule: AnnualScheduleSummary[] = [];
  const maxYears = Math.max(
    bankSchedule ? bankSchedule.annualSummaries.length : 0,
    cdcSchedule ? cdcSchedule.annualSummaries.length : 0
  );

  for (let y = 1; y <= maxYears; y++) {
    const bRow = bankSchedule?.annualSummaries.find((r) => r.year === y);
    const cRow = cdcSchedule?.annualSummaries.find((r) => r.year === y);

    const startingBalance = (bRow?.startingBalance || 0) + (cRow?.startingBalance || 0);
    const payments = (bRow?.totalPayments || 0) + (cRow?.totalPayments || 0);
    const principalPaid = (bRow?.principalPaid || 0) + (cRow?.principalPaid || 0);
    const interestPaid = (bRow?.interestPaid || 0) + (cRow?.interestPaid || 0);
    const endingBalance = (bRow?.endingBalance || 0) + (cRow?.endingBalance || 0);

    combinedAnnualSchedule.push({
      year: y,
      startingBalance: clean(startingBalance),
      totalPayments: clean(payments),
      principalPaid: clean(principalPaid),
      interestPaid: clean(interestPaid),
      endingBalance: clean(endingBalance),
    });
  }

  return {
    projectCost,
    bankPct,
    cdcPct,
    equityPct,
    bankLoanAmount,
    cdcBaseLoanAmount,
    cdcFees,
    cdcTotalLoanAmount,
    equityAmount,
    totalLoanAmount,
    bankMonthlyPayment: clean(bankMonthlyPayment),
    cdcMonthlyPayment: clean(cdcMonthlyPayment),
    totalMonthlyPayment,
    blendedRatePct,
    bankBalloonPayment,
    totalBankInterest: clean(totalBankInterest),
    totalCdcInterest: clean(totalCdcInterest),
    totalInterest,
    totalPayments,
    dscr,
    bankSchedule,
    cdcSchedule,
    combinedAnnualSchedule,
  };
}

/**
 * Calculates SBA 7(a) loan.
 */
export function calculateSba7a(input: Sba7aInput): Sba7aResult | null {
  const {
    loanAmount,
    ratePct,
    termYears,
    guaranteeFeePct = 0,
    otherFees = 0,
    feesFinanced = false,
    annualCashFlow,
  } = input;

  if (loanAmount <= 0 || termYears <= 0 || ratePct < 0) {
    return null;
  }

  const guaranteeFee = clean(loanAmount * (Math.max(0, guaranteeFeePct) / 100));
  const safeOtherFees = Math.max(0, otherFees);
  const totalFees = guaranteeFee + safeOtherFees;
  const totalFinancedAmount = clean(loanAmount + (feesFinanced ? totalFees : 0));

  const months = Math.round(termYears * 12);
  const pmt = calcPayment(totalFinancedAmount, ratePct, months);
  if (pmt === null) return null;

  const schedule = calcSchedule({
    principal: totalFinancedAmount,
    apr: ratePct,
    amortizationMonths: months,
  });

  const totalInterest = schedule ? schedule.totalInterest : 0;
  const totalPayments = schedule ? schedule.totalPayments : 0;

  const annualDebtService = pmt * 12;
  const dscr = (annualCashFlow && annualCashFlow > 0)
    ? calcDscr(annualCashFlow, annualDebtService)
    : null;

  return {
    baseLoanAmount: loanAmount,
    guaranteeFee,
    otherFees: safeOtherFees,
    totalFinancedAmount,
    ratePct,
    termYears,
    monthlyPayment: clean(pmt),
    totalInterest: clean(totalInterest),
    totalPayments: clean(totalPayments),
    dscr,
    schedule,
  };
}

/**
 * Compares 504 vs 7(a) for the same project size and borrowing amount.
 */
export function compareSba504Vs7a(
  sba504Input: Sba504Input,
  rate7aPct: number,
  term7aYears: number = 25,
  guaranteeFee7aPct: number = 0,
  feesFinanced7a: boolean = false
): SbaCompareResult | null {
  const res504 = calculateSba504(sba504Input);
  if (!res504) return null;

  // The debt amount for 7(a) matches the 504 total debt (project cost minus equity)
  const totalDebt = res504.bankLoanAmount + res504.cdcBaseLoanAmount;

  const res7a = calculateSba7a({
    loanAmount: totalDebt,
    ratePct: rate7aPct,
    termYears: term7aYears,
    guaranteeFeePct: guaranteeFee7aPct,
    feesFinanced: feesFinanced7a,
    annualCashFlow: sba504Input.annualCashFlow,
  });
  if (!res7a) return null;

  const monthlyPaymentSavings504 = clean(res7a.monthlyPayment - res504.totalMonthlyPayment);
  const totalInterestSavings504 = clean(res7a.totalInterest - res504.totalInterest);
  const annualPaymentSavings504 = clean(monthlyPaymentSavings504 * 12);

  return {
    projectCost: sba504Input.projectCost,
    totalDebt,
    sba504: res504,
    sba7a: res7a,
    monthlyPaymentSavings504,
    totalInterestSavings504,
    annualPaymentSavings504,
  };
}

/**
 * Calculates Business Acquisition Financing (7(a) senior loan + Seller Note + Buyer Equity).
 */
export function calculateSbaAcquisition(input: SbaAcquisitionInput): SbaAcquisitionResult | null {
  const {
    purchasePrice,
    buyerEquityPct,
    sellerNotePct,
    sellerNoteRatePct,
    sellerNoteTermYears,
    sellerNoteInterestOnly = false,
    sbaRatePct,
    sbaTermYears,
    annualSdeOrCashFlow,
    minDscr = 1.25,
  } = input;

  if (purchasePrice <= 0 || buyerEquityPct < 0 || sellerNotePct < 0 || buyerEquityPct + sellerNotePct >= 100) {
    return null;
  }
  if (sbaTermYears <= 0 || sellerNoteTermYears <= 0) {
    return null;
  }

  const buyerEquityAmount = clean(purchasePrice * (buyerEquityPct / 100));
  const sellerNoteAmount = clean(purchasePrice * (sellerNotePct / 100));
  const sbaLoanAmount = clean(purchasePrice - buyerEquityAmount - sellerNoteAmount);

  // SBA 7(a) payment
  const sbaPmt = calcPayment(sbaLoanAmount, sbaRatePct, Math.round(sbaTermYears * 12));
  if (sbaPmt === null) return null;

  // Seller Note payment
  let sellerPmt = 0;
  if (sellerNoteAmount > 0) {
    if (sellerNoteInterestOnly) {
      sellerPmt = (sellerNoteAmount * (sellerNoteRatePct / 100)) / 12;
    } else {
      const p = calcPayment(sellerNoteAmount, sellerNoteRatePct, Math.round(sellerNoteTermYears * 12));
      sellerPmt = p || 0;
    }
  }

  const totalMonthlyDebtService = clean(sbaPmt + sellerPmt);
  const annualDebtService = clean(totalMonthlyDebtService * 12);
  const dscr = (annualDebtService > 0 && annualSdeOrCashFlow > 0)
    ? calcDscr(annualSdeOrCashFlow, annualDebtService)
    : null;

  const meetsMinDscr = dscr !== null && dscr >= minDscr;
  const postDebtAnnualCashFlow = clean(annualSdeOrCashFlow - annualDebtService);

  return {
    purchasePrice,
    buyerEquityAmount,
    sellerNoteAmount,
    sbaLoanAmount,
    sbaMonthlyPayment: clean(sbaPmt),
    sellerNoteMonthlyPayment: clean(sellerPmt),
    totalMonthlyDebtService,
    annualDebtService,
    annualSdeOrCashFlow,
    dscr,
    meetsMinDscr,
    postDebtAnnualCashFlow,
  };
}
