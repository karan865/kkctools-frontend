/**
 * heloc-engine.ts — Home Equity Line of Credit (HELOC) & Home Equity Engine
 *
 * Core mathematical engine for /heloc-calculator/
 * Pure functions only. Zero DOM, zero network, zero side-effects.
 * Reuses loan-engine.payment and loan-engine.interestOnlyPayment.
 */

import { payment, monthlyRate } from './loan-engine';

export type DrawPaymentMethod = 'interest-only' | '1/360' | 'pct-of-balance';

export interface HelocBorrowLimitResult {
  homeValue: number;
  mortgageBalance: number;
  maxCltvPct: number;
  maxCreditLine: number;
  currentCltvPct: number;
  postHelocCltvPct: number;
  retainedEquity: number;
  isEquityAvailable: boolean;
}

export interface HelocPaymentOpts {
  drawnAmount: number;
  aprPct: number;
  drawYears: number; // e.g. 10 years
  repayYears: number; // e.g. 20 years
  drawMethod?: DrawPaymentMethod;
  pctOfBalance?: number; // e.g. 1.5% if drawMethod is pct-of-balance
  extraPrincipalMonthly?: number;
  isBalloon?: boolean;
  closingCosts?: number;
  annualFee?: number;
  rateCapPct?: number; // max lifetime APR
}

export interface HelocScheduleRow {
  month: number;
  year: number;
  phase: 'draw' | 'repayment';
  startingBalance: number;
  payment: number;
  principal: number;
  interest: number;
  endingBalance: number;
}

export interface HelocPaymentResult {
  initialDrawPayment: number;
  lastDrawPayment: number;
  repaymentPayment: number;
  paymentShockDollars: number;
  paymentShockPct: number;
  balanceAtEndOfDraw: number;
  totalDrawInterest: number;
  totalRepaymentInterest: number;
  totalInterest: number;
  totalCostWithFees: number;
  isBalloon: boolean;
  schedule: HelocScheduleRow[];
}

export interface RateScenarioResult {
  ratePct: number;
  label: string;
  drawPayment: number;
  repaymentPayment: number;
  paymentShockDollars: number;
  totalInterest: number;
}

export interface HelocCompareOpts {
  borrowAmount: number;
  helocApr: number;
  helocDrawYears: number;
  helocRepayYears: number;
  helocClosingCosts: number;
  helocAnnualFee: number;

  helRate: number;
  helTermYears: number;
  helClosingCosts: number;

  currentMortgageBalance: number;
  currentMortgageRate: number;
  currentMortgageRemainingYears: number;
  refiRate: number;
  refiTermYears: number;
  refiClosingCosts: number;
}

export interface HelocCompareResult {
  heloc: {
    monthlyDraw: number;
    monthlyRepay: number;
    totalInterest: number;
    closingCosts: number;
    totalCost: number;
  };
  homeEquityLoan: {
    monthlyPayment: number;
    totalInterest: number;
    closingCosts: number;
    totalCost: number;
  };
  cashOutRefi: {
    oldMonthlyPayment: number;
    newMonthlyPayment: number;
    monthlyPaymentDiff: number;
    totalInterest: number;
    closingCosts: number;
    totalCost: number;
  };
}

function cleanMoney(val: number): number {
  if (Object.is(val, -0) || Math.abs(val) < 1e-12) return 0;
  return Number(val.toFixed(2));
}

function cleanPct(val: number, decimals: number = 2): number {
  if (Object.is(val, -0) || Math.abs(val) < 1e-12) return 0;
  return Number(val.toFixed(decimals));
}

/**
 * Calculates maximum available HELOC credit line based on Home Value,
 * existing first mortgage, and lender Maximum Combined Loan-to-Value (CLTV).
 */
export function calculateBorrowingLimit(
  homeValue: number,
  mortgageBalance: number,
  maxCltvPct: number = 85
): HelocBorrowLimitResult {
  const safeHome = Math.max(0, homeValue);
  const safeMortgage = Math.max(0, mortgageBalance);
  const safeCltvDec = Math.max(0, Math.min(100, maxCltvPct)) / 100;

  const maxTotalDebt = safeHome * safeCltvDec;
  const rawMaxLine = maxTotalDebt - safeMortgage;
  const maxCreditLine = cleanMoney(Math.max(0, rawMaxLine));

  const currentCltvPct = safeHome > 0 ? cleanPct((safeMortgage / safeHome) * 100) : 0;
  const postHelocCltvPct = safeHome > 0 ? cleanPct(((safeMortgage + maxCreditLine) / safeHome) * 100) : 0;
  const retainedEquity = cleanMoney(Math.max(0, safeHome - (safeMortgage + maxCreditLine)));

  return {
    homeValue: cleanMoney(safeHome),
    mortgageBalance: cleanMoney(safeMortgage),
    maxCltvPct: cleanPct(maxCltvPct),
    maxCreditLine,
    currentCltvPct,
    postHelocCltvPct,
    retainedEquity,
    isEquityAvailable: maxCreditLine > 0,
  };
}

/**
 * Calculates two-phase HELOC payments (draw period vs repayment period)
 * with payment shock quantification.
 */
export function calculateHelocPayments(opts: HelocPaymentOpts): HelocPaymentResult {
  const safeAmount = Math.max(0, opts.drawnAmount);
  const rawApr = Math.max(0, opts.aprPct);
  const effectiveApr = opts.rateCapPct ? Math.min(opts.rateCapPct, rawApr) : rawApr;
  const r = monthlyRate(effectiveApr);

  const drawMonths = Math.max(0, Math.round(opts.drawYears * 12));
  const repayMonths = Math.max(0, Math.round(opts.repayYears * 12));
  const method = opts.drawMethod || 'interest-only';
  const safeExtraPrincipal = Math.max(0, opts.extraPrincipalMonthly || 0);
  const isBalloon = !!opts.isBalloon;

  if (safeAmount <= 0) {
    return {
      initialDrawPayment: 0,
      lastDrawPayment: 0,
      repaymentPayment: 0,
      paymentShockDollars: 0,
      paymentShockPct: 0,
      balanceAtEndOfDraw: 0,
      totalDrawInterest: 0,
      totalRepaymentInterest: 0,
      totalInterest: 0,
      totalCostWithFees: 0,
      isBalloon: false,
      schedule: [],
    };
  }

  const schedule: HelocScheduleRow[] = [];
  let currentBalance = safeAmount;
  let totalDrawInterest = 0;
  let initialDrawPayment = 0;
  let lastDrawPayment = 0;

  // Phase 1: Draw Period Amortization
  for (let m = 1; m <= drawMonths; m++) {
    const startBal = currentBalance;
    const interest = startBal * r;
    totalDrawInterest += interest;

    let basePmt = 0;
    if (method === 'interest-only') {
      basePmt = interest;
    } else if (method === '1/360') {
      // 1/360th of balance principal plus interest (standard Regions Bank formula)
      basePmt = startBal / 360 + interest;
    } else {
      // Fixed percentage of balance (e.g. 1.5%)
      const pctDec = Math.max(0.5, opts.pctOfBalance || 1.5) / 100;
      basePmt = Math.max(interest, startBal * pctDec);
    }

    let actualPmt = basePmt + safeExtraPrincipal;
    if (actualPmt > startBal + interest) {
      actualPmt = startBal + interest;
    }

    const principal = Math.max(0, actualPmt - interest);
    currentBalance = Math.max(0, startBal - principal);

    if (m === 1) initialDrawPayment = cleanMoney(actualPmt);
    lastDrawPayment = cleanMoney(actualPmt);

    schedule.push({
      month: m,
      year: Math.ceil(m / 12),
      phase: 'draw',
      startingBalance: cleanMoney(startBal),
      payment: cleanMoney(actualPmt),
      principal: cleanMoney(principal),
      interest: cleanMoney(interest),
      endingBalance: cleanMoney(currentBalance),
    });

    if (currentBalance <= 0.005) {
      break;
    }
  }

  const balanceAtEndOfDraw = cleanMoney(currentBalance);

  // Phase 2: Repayment Period Amortization
  let repaymentPayment = 0;
  let totalRepayInterest = 0;

  if (balanceAtEndOfDraw > 0.005) {
    if (isBalloon) {
      // Balloon payment due in full at end of draw period
      repaymentPayment = balanceAtEndOfDraw;
    } else if (repayMonths > 0) {
      // Standard fully amortizing monthly payment (P&I)
      const pmt = payment(balanceAtEndOfDraw, effectiveApr, repayMonths);
      repaymentPayment = cleanMoney(pmt || 0);

      let repayBal = balanceAtEndOfDraw;
      for (let m = 1; m <= repayMonths && repayBal > 0.005; m++) {
        const monthIndex = drawMonths + m;
        const startBal = repayBal;
        const interest = startBal * r;
        totalRepayInterest += interest;

        let actualPmt = repaymentPayment;
        if (startBal + interest <= actualPmt || m === repayMonths) {
          actualPmt = startBal + interest;
        }

        const principal = Math.max(0, actualPmt - interest);
        repayBal = Math.max(0, startBal - principal);

        schedule.push({
          month: monthIndex,
          year: Math.ceil(monthIndex / 12),
          phase: 'repayment',
          startingBalance: cleanMoney(startBal),
          payment: cleanMoney(actualPmt),
          principal: cleanMoney(principal),
          interest: cleanMoney(interest),
          endingBalance: cleanMoney(repayBal),
        });
      }
    }
  }

  // Payment Shock: Jump from final draw month to initial repayment payment
  const paymentShockDollars = cleanMoney(repaymentPayment - lastDrawPayment);
  const paymentShockPct =
    lastDrawPayment > 0 ? cleanPct((paymentShockDollars / lastDrawPayment) * 100, 1) : 0;

  const totalInterest = cleanMoney(totalDrawInterest + totalRepayInterest);
  const closingCosts = Math.max(0, opts.closingCosts || 0);
  const annualFeesTotal = Math.max(0, opts.annualFee || 0) * opts.drawYears;
  const totalCostWithFees = cleanMoney(totalInterest + closingCosts + annualFeesTotal);

  return {
    initialDrawPayment,
    lastDrawPayment,
    repaymentPayment,
    paymentShockDollars,
    paymentShockPct,
    balanceAtEndOfDraw,
    totalDrawInterest: cleanMoney(totalDrawInterest),
    totalRepaymentInterest: cleanMoney(totalRepayInterest),
    totalInterest,
    totalCostWithFees,
    isBalloon,
    schedule,
  };
}

/**
 * Generates Rate-Rise Scenarios (+0%, +1%, +2%, +3%) to illustrate
 * variable rate vulnerability during both draw and repayment phases.
 */
export function generateRateScenarios(
  opts: HelocPaymentOpts,
  rateDeltas: number[] = [0, 1.0, 2.0, 3.0]
): RateScenarioResult[] {
  return rateDeltas.map((delta) => {
    const testApr = opts.aprPct + delta;
    const res = calculateHelocPayments({ ...opts, aprPct: testApr });
    return {
      ratePct: cleanPct(testApr),
      label: delta === 0 ? 'Current Base Rate' : `+${delta.toFixed(1)}% Rate Rise`,
      drawPayment: res.initialDrawPayment,
      repaymentPayment: res.repaymentPayment,
      paymentShockDollars: res.paymentShockDollars,
      totalInterest: res.totalInterest,
    };
  });
}

/**
 * Three-Way Comparison: HELOC vs Home Equity Loan vs Cash-Out Refinance
 */
export function compareHomeEquityOptions(opts: HelocCompareOpts): HelocCompareResult {
  // 1. HELOC
  const helocRes = calculateHelocPayments({
    drawnAmount: opts.borrowAmount,
    aprPct: opts.helocApr,
    drawYears: opts.helocDrawYears,
    repayYears: opts.helocRepayYears,
    drawMethod: 'interest-only',
    closingCosts: opts.helocClosingCosts,
    annualFee: opts.helocAnnualFee,
  });

  // 2. Fixed-Rate Home Equity Loan
  const helMonths = Math.max(12, opts.helTermYears * 12);
  const helPmt = payment(opts.borrowAmount, opts.helRate, helMonths) || 0;
  const helTotalPayments = helPmt * helMonths;
  const helTotalInterest = Math.max(0, helTotalPayments - opts.borrowAmount);
  const helTotalCost = helTotalInterest + opts.helClosingCosts;

  // 3. Cash-Out Refinance
  const oldMonths = Math.max(12, opts.currentMortgageRemainingYears * 12);
  const oldPmt = payment(opts.currentMortgageBalance, opts.currentMortgageRate, oldMonths) || 0;

  const newRefiBalance = opts.currentMortgageBalance + opts.borrowAmount + opts.refiClosingCosts;
  const refiMonths = Math.max(12, opts.refiTermYears * 12);
  const newPmt = payment(newRefiBalance, opts.refiRate, refiMonths) || 0;
  const refiTotalPayments = newPmt * refiMonths;
  const refiTotalInterest = Math.max(0, refiTotalPayments - newRefiBalance);

  return {
    heloc: {
      monthlyDraw: helocRes.initialDrawPayment,
      monthlyRepay: helocRes.repaymentPayment,
      totalInterest: helocRes.totalInterest,
      closingCosts: opts.helocClosingCosts,
      totalCost: helocRes.totalCostWithFees,
    },
    homeEquityLoan: {
      monthlyPayment: cleanMoney(helPmt),
      totalInterest: cleanMoney(helTotalInterest),
      closingCosts: opts.helClosingCosts,
      totalCost: cleanMoney(helTotalCost),
    },
    cashOutRefi: {
      oldMonthlyPayment: cleanMoney(oldPmt),
      newMonthlyPayment: cleanMoney(newPmt),
      monthlyPaymentDiff: cleanMoney(newPmt - oldPmt),
      totalInterest: cleanMoney(refiTotalInterest),
      closingCosts: opts.refiClosingCosts,
      totalCost: cleanMoney(refiTotalInterest + opts.refiClosingCosts),
    },
  };
}
