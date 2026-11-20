/**
 * Loan Engine — Pure mathematical functions for commercial and consumer debt:
 * Monthly amortizing payments, interest-only periods, remaining balances, balloon payments,
 * full amortization schedules (monthly + annual summary), maximum loan capacity from payment,
 * effective APR with fees (bisection solver), and MCA factor rate to APR conversion.
 *
 * Shared engine across Rental Property Calculator, Airbnb Calculator,
 * Commercial Mortgage Calculator, Equipment Loan Calculator, SBA Loan Calculator,
 * HELOC Calculator, and Credit Card Payoff Calculator.
 *
 * Rules:
 * - Pure functions only. Zero I/O, zero network, zero state.
 * - Returns null for invalid or undefined scenarios (e.g. non-positive principal or terms).
 * - Normalises floating point artifacts and -0 to 0.
 * - Full precision maintained; display formatting handled by UI formatters.
 */

export interface LoanScheduleOpts {
  principal: number;
  apr: number; // Annual Percentage Rate in percent, e.g. 6.5 for 6.5%
  amortizationMonths: number; // e.g. 360 for 30 years or 300 for 25 years
  termMonths?: number; // Balloon payoff term (if less than amortizationMonths)
  interestOnlyMonths?: number; // Number of initial months with interest-only payments
  extraPrincipalMonthly?: number; // Optional extra principal added to regular payment
}

export interface MonthlyScheduleRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  extraPrincipal: number;
  endingBalance: number;
  isInterestOnly: boolean;
}

export interface AnnualScheduleSummary {
  year: number;
  startingBalance: number;
  totalPayments: number;
  principalPaid: number;
  interestPaid: number;
  endingBalance: number;
}

export interface LoanScheduleResult {
  monthlyPayment: number;
  interestOnlyPayment: number | null;
  totalPayments: number;
  totalInterest: number;
  balloonPayment: number;
  payoffMonth: number;
  monthlyRows: MonthlyScheduleRow[];
  annualSummaries: AnnualScheduleSummary[];
}

function cleanNumber(n: number): number {
  if (Object.is(n, -0) || Math.abs(n) < 1e-12) return 0;
  return Number(n.toFixed(10));
}

/**
 * Monthly interest rate as a decimal from nominal APR percentage.
 * e.g., 6% APR -> 0.06 / 12 = 0.005
 */
export function monthlyRate(apr: number): number {
  if (!Number.isFinite(apr) || apr < 0) return 0;
  return (apr / 100) / 12;
}

/**
 * Standard amortizing monthly payment (P & I):
 * PMT = P * [ r(1 + r)^n ] / [ (1 + r)^n - 1 ]
 * If APR = 0%, PMT = P / n.
 * Returns null if principal <= 0 or months <= 0.
 */
export function payment(principal: number, apr: number, months: number): number | null {
  if (principal <= 0 || months <= 0 || !Number.isFinite(principal) || !Number.isFinite(apr) || !Number.isFinite(months)) {
    return null;
  }
  if (apr <= 0) {
    return cleanNumber(principal / months);
  }
  const r = monthlyRate(apr);
  const factor = Math.pow(1 + r, months);
  const pmt = (principal * (r * factor)) / (factor - 1);
  return cleanNumber(pmt);
}

/**
 * Interest-only monthly payment: PMT_io = P * r
 * Returns null if principal <= 0 or apr < 0.
 */
export function interestOnlyPayment(principal: number, apr: number): number | null {
  if (principal <= 0 || apr < 0 || !Number.isFinite(principal) || !Number.isFinite(apr)) {
    return null;
  }
  const r = monthlyRate(apr);
  return cleanNumber(principal * r);
}

/**
 * Remaining loan balance after a given number of paid months on an amortizing loan:
 * B_k = P * [ (1 + r)^n - (1 + r)^k ] / [ (1 + r)^n - 1 ]
 * Returns null if parameters are invalid.
 */
export function balanceAfter(principal: number, apr: number, amortMonths: number, paidMonths: number): number | null {
  if (principal <= 0 || amortMonths <= 0 || paidMonths < 0 || !Number.isFinite(principal) || !Number.isFinite(apr)) {
    return null;
  }
  if (paidMonths >= amortMonths) return 0;
  if (paidMonths === 0) return cleanNumber(principal);

  if (apr <= 0) {
    const monthlyPrincipal = principal / amortMonths;
    return cleanNumber(Math.max(0, principal - monthlyPrincipal * paidMonths));
  }

  const r = monthlyRate(apr);
  const factorTotal = Math.pow(1 + r, amortMonths);
  const factorPaid = Math.pow(1 + r, paidMonths);
  const bal = principal * ((factorTotal - factorPaid) / (factorTotal - 1));
  return cleanNumber(Math.max(0, bal));
}

/**
 * Computes maximum loan borrowing capacity from affordable monthly payment (PV of an Annuity):
 * PV = PMT * [ 1 - (1 + r)^(-n) ] / r
 * If APR = 0%, PV = PMT * n.
 */
export function maxLoanFromPayment(monthlyPayment: number, apr: number, months: number): number | null {
  if (monthlyPayment <= 0 || months <= 0 || !Number.isFinite(monthlyPayment) || !Number.isFinite(apr) || !Number.isFinite(months)) {
    return null;
  }
  if (apr <= 0) {
    return cleanNumber(monthlyPayment * months);
  }
  const r = monthlyRate(apr);
  const pv = monthlyPayment * (1 - Math.pow(1 + r, -months)) / r;
  return cleanNumber(pv);
}

/**
 * Solves true effective Annual Percentage Rate (APR) including upfront lender/broker points and fees.
 * Uses bisection search to find the rate where PV(payments) = Net Amount Advanced (Principal - Fees).
 */
export function aprWithFees(principal: number, fees: number, nominalApr: number, months: number): number | null {
  if (principal <= 0 || months <= 0 || fees < 0 || fees >= principal) {
    return null;
  }
  const netAdvance = principal - fees;
  const regularPmt = payment(principal, nominalApr, months);
  if (!regularPmt) return null;

  // If no fees, effective APR equals nominal APR
  if (fees === 0) return cleanNumber(nominalApr);

  // Objective function: PV(regularPmt at monthly rate r) - netAdvance = 0
  const pvDiff = (annualRatePct: number): number => {
    const r = (annualRatePct / 100) / 12;
    if (r <= 0) return (regularPmt * months) - netAdvance;
    return (regularPmt * (1 - Math.pow(1 + r, -months)) / r) - netAdvance;
  };

  let low = nominalApr;
  let high = nominalApr + 50; // Initial bracket
  while (pvDiff(high) > 0 && high < 200) {
    high += 50;
  }

  // Bisection solver
  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const diff = pvDiff(mid);
    if (Math.abs(diff) < 1e-6 || (high - low) < 1e-8) {
      return cleanNumber(mid);
    }
    if (diff > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return cleanNumber((low + high) / 2);
}

/**
 * Converts Merchant Cash Advance (MCA) factor rate to estimated annual percentage rate (APR).
 * Example: Advance $50,000, Factor 1.25 -> Total Payback $62,500 over 180 days with daily remittance.
 */
export function factorRateToApr(advance: number, factor: number, termDays: number, remitEveryDays = 1): number | null {
  if (advance <= 0 || factor < 1 || termDays <= 0 || remitEveryDays <= 0 || termDays < remitEveryDays) {
    return null;
  }
  const totalPayback = advance * factor;
  const numPayments = Math.floor(termDays / remitEveryDays);
  const paymentPerRemittance = totalPayback / numPayments;
  const periodsPerYear = 365 / remitEveryDays;

  // Simple fee percentage
  const totalFeePct = (factor - 1);
  const years = termDays / 365;

  // Approximate un-amortized APR
  if (years <= 0) return null;
  const simpleApr = (totalFeePct / years) * 100;

  // Rigorous effective APR solving: PV(payments) = advance
  const pvDiff = (periodicRate: number): number => {
    if (periodicRate <= 0) return totalPayback - advance;
    return (paymentPerRemittance * (1 - Math.pow(1 + periodicRate, -numPayments)) / periodicRate) - advance;
  };

  let low = 0.0001;
  let high = 10.0;
  if (pvDiff(high) > 0) {
    return cleanNumber(simpleApr); // Fallback to simple annualized rate
  }

  for (let i = 0; i < 80; i++) {
    const mid = (low + high) / 2;
    const diff = pvDiff(mid);
    if (Math.abs(diff) < 1e-5 || (high - low) < 1e-7) {
      const annualizedRate = (Math.pow(1 + mid, periodsPerYear) - 1) * 100;
      return cleanNumber(annualizedRate);
    }
    if (diff > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }

  const resultPeriodic = (low + high) / 2;
  const aprCompound = (Math.pow(1 + resultPeriodic, periodsPerYear) - 1) * 100;
  return cleanNumber(aprCompound);
}

/**
 * Generates full loan amortization schedule with support for:
 * - Interest-only introductory periods
 * - Balloon payoff upon term expiration (e.g. 5-year or 10-year balloon on 25-year commercial amortization)
 * - Extra principal payments
 * - Complete monthly rows and annual rolled-up summaries
 */
export function schedule(opts: LoanScheduleOpts): LoanScheduleResult {
  const principal = Math.max(0, opts.principal || 0);
  const apr = Math.max(0, opts.apr || 0);
  const amortMonths = Math.max(1, Math.round(opts.amortizationMonths || 1));
  const termMonths = opts.termMonths && opts.termMonths > 0 ? Math.min(amortMonths, Math.round(opts.termMonths)) : amortMonths;
  const ioMonths = opts.interestOnlyMonths && opts.interestOnlyMonths > 0 ? Math.min(termMonths, Math.round(opts.interestOnlyMonths)) : 0;
  const extraPrincipalMonthly = Math.max(0, opts.extraPrincipalMonthly || 0);

  const r = monthlyRate(apr);
  const ioPmt = ioMonths > 0 ? interestOnlyPayment(principal, apr) : null;

  // Remaining amortization months after IO period expires
  const regularAmortMonths = Math.max(1, amortMonths - ioMonths);
  const regularPmt = payment(principal, apr, regularAmortMonths) || 0;

  const monthlyRows: MonthlyScheduleRow[] = [];
  const annualSummaries: AnnualScheduleSummary[] = [];

  let currentBalance = principal;
  let totalInterest = 0;
  let totalPayments = 0;
  let balloonPayment = 0;
  let payoffMonth = 0;

  let yearNum = 1;
  let yrStartingBalance = principal;
  let yrPayments = 0;
  let yrPrincipal = 0;
  let yrInterest = 0;

  for (let m = 1; m <= termMonths; m++) {
    if (currentBalance <= 0) break;

    const isIo = m <= ioMonths;
    const interest = cleanNumber(currentBalance * r);
    let pmtScheduled = isIo ? (ioPmt || interest) : regularPmt;

    let principalPaid = 0;
    let extra = 0;

    if (isIo) {
      principalPaid = 0;
      extra = Math.min(currentBalance, extraPrincipalMonthly);
      currentBalance = cleanNumber(Math.max(0, currentBalance - extra));
    } else {
      const scheduledPrincipal = Math.max(0, pmtScheduled - interest);
      if (currentBalance <= scheduledPrincipal) {
        // Last payment
        principalPaid = currentBalance;
        pmtScheduled = cleanNumber(interest + principalPaid);
        extra = 0;
        currentBalance = 0;
      } else {
        principalPaid = scheduledPrincipal;
        currentBalance = cleanNumber(currentBalance - principalPaid);
        extra = Math.min(currentBalance, extraPrincipalMonthly);
        currentBalance = cleanNumber(currentBalance - extra);
      }
    }

    const monthTotalPayment = cleanNumber(pmtScheduled + extra);
    totalPayments += monthTotalPayment;
    totalInterest += interest;

    yrPayments += monthTotalPayment;
    yrPrincipal += (principalPaid + extra);
    yrInterest += interest;

    monthlyRows.push({
      month: m,
      payment: monthTotalPayment,
      principal: principalPaid,
      interest,
      extraPrincipal: extra,
      endingBalance: currentBalance,
      isInterestOnly: isIo,
    });

    payoffMonth = m;

    // Check balloon at end of loan term
    if (m === termMonths && termMonths < amortMonths && currentBalance > 0) {
      balloonPayment = currentBalance;
    }

    // End of year or final month rollup
    if (m % 12 === 0 || m === termMonths || currentBalance === 0) {
      annualSummaries.push({
        year: yearNum,
        startingBalance: yrStartingBalance,
        totalPayments: cleanNumber(yrPayments),
        principalPaid: cleanNumber(yrPrincipal),
        interestPaid: cleanNumber(yrInterest),
        endingBalance: currentBalance,
      });

      yearNum++;
      yrStartingBalance = currentBalance;
      yrPayments = 0;
      yrPrincipal = 0;
      yrInterest = 0;
    }

    if (currentBalance <= 0) break;
  }

  return {
    monthlyPayment: cleanNumber(regularPmt),
    interestOnlyPayment: ioPmt,
    totalPayments: cleanNumber(totalPayments + balloonPayment),
    totalInterest: cleanNumber(totalInterest),
    balloonPayment: cleanNumber(balloonPayment),
    payoffMonth,
    monthlyRows,
    annualSummaries,
  };
}
