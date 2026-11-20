/**
 * compound-interest-engine.ts — Compound Interest & Wealth Accumulation Engine
 *
 * Core engine for /compound-interest-calculator/
 * Reuses tvm-engine.ts per Batch 3 Part 3 §12–13 rules.
 * Pure functions only. Zero DOM, zero network, zero side-effects.
 */

import {
  effectiveRate as calcEffectiveRate,
  nominalFromApy as calcNominalFromApy,
} from './tvm-engine';

export type CompoundingFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'daily365'
  | 'daily360'
  | 'continuous';

export type DepositFrequency = 'annually' | 'semiannually' | 'quarterly' | 'monthly' | 'biweekly' | 'weekly';

export type DepositTiming = 'start' | 'end';

export const COMPOUNDING_PERIODS_MAP: Record<CompoundingFrequency, number> = {
  annually: 1,
  semiannually: 2,
  quarterly: 4,
  monthly: 12,
  daily365: 365,
  daily360: 360,
  continuous: -1,
};

export const DEPOSIT_PERIODS_MAP: Record<DepositFrequency, number> = {
  annually: 1,
  semiannually: 2,
  quarterly: 4,
  monthly: 12,
  biweekly: 26,
  weekly: 52,
};

function cleanNumber(val: number): number {
  if (Object.is(val, -0) || Math.abs(val) < 1e-12) return 0;
  return Number(val.toFixed(10));
}

export interface CompoundCalculationParams {
  initialPrincipal: number;
  ratePct: number;
  rateType?: 'apr' | 'apy';
  years: number;
  months?: number;
  compounding?: CompoundingFrequency;
  depositAmount?: number;
  depositFrequency?: DepositFrequency;
  depositTiming?: DepositTiming;
  annualDepositIncreasePct?: number;
  inflationPct?: number;
  taxPct?: number;
}

export interface YearlyScheduleRow {
  year: number;
  startingBalance: number;
  deposits: number;
  interestEarned: number;
  endingBalance: number;
  cumulativeDeposits: number;
  cumulativeInterest: number;
  inflationAdjustedBalance: number;
}

export interface CompoundCalculationResult {
  futureValue: number;
  totalDeposits: number;
  totalInterest: number;
  apyPct: number;
  effectiveNominalAprPct: number;
  doublingYears: number;
  ruleOf72Years: number;
  realPurchasingPower: number;
  schedule: YearlyScheduleRow[];
}

/**
 * Calculates the nominal APR from user input, adjusting for APY input if specified.
 */
export function getNominalRate(
  ratePct: number,
  rateType: 'apr' | 'apy',
  compounding: CompoundingFrequency
): number {
  if (rateType === 'apr' || compounding === 'annually') return ratePct;
  const n = COMPOUNDING_PERIODS_MAP[compounding];
  if (n === -1) {
    // Continuous: APY = e^r - 1 => r = ln(1 + APY)
    return Math.log(1 + ratePct / 100) * 100;
  }
  return calcNominalFromApy(ratePct, n) ?? ratePct;
}

/**
 * Computes Annual Percentage Yield (APY) from nominal rate & compounding.
 */
export function getApy(nominalAprPct: number, compounding: CompoundingFrequency): number {
  const n = COMPOUNDING_PERIODS_MAP[compounding];
  if (n === -1) {
    // Continuous: APY = e^r - 1
    const r = nominalAprPct / 100;
    return (Math.exp(r) - 1) * 100;
  }
  return calcEffectiveRate(nominalAprPct, n) ?? nominalAprPct;
}

/**
 * Main Compound Interest Calculator Engine
 */
export function calculateCompoundGrowth(params: CompoundCalculationParams): CompoundCalculationResult {
  const initial = Math.max(0, params.initialPrincipal || 0);
  const rawRate = Math.max(0, params.ratePct || 0);
  const rateType = params.rateType || 'apr';
  const compounding = params.compounding || 'monthly';
  const years = Math.max(0, (params.years || 0) + (params.months || 0) / 12);
  const baseDeposit = Math.max(0, params.depositAmount || 0);
  const depositFreq = params.depositFrequency || 'monthly';
  const timing = params.depositTiming || 'end';
  const annualStepUp = (params.annualDepositIncreasePct || 0) / 100;
  const inflation = (params.inflationPct || 0) / 100;
  const taxRate = (params.taxPct || 0) / 100;

  const nominalAprPct = getNominalRate(rawRate, rateType, compounding);
  const effectiveApyPct = getApy(nominalAprPct, compounding);

  const nCompounds = COMPOUNDING_PERIODS_MAP[compounding];
  const mDeposits = DEPOSIT_PERIODS_MAP[depositFreq];

  // Exact period loop to handle step-up deposit increases, tax on interest, and yearly schedules
  const totalYearsCeil = Math.ceil(years);
  const schedule: YearlyScheduleRow[] = [];

  let currentBalance = initial;
  let cumulativeDeposits = initial;
  let cumulativeInterest = 0;
  let currentDeposit = baseDeposit;

  for (let y = 1; y <= totalYearsCeil; y++) {
    const fractionOfYear = y === totalYearsCeil && years % 1 !== 0 ? years % 1 : 1.0;
    const periodsInYear = Math.round(mDeposits * fractionOfYear);

    const yearStartBalance = currentBalance;
    let yearDeposits = 0;
    let yearInterest = 0;

    // Effective rate per deposit period under the specified compounding frequency
    let iPerPeriod: number;
    if (nCompounds === -1) {
      // Continuous compounding
      iPerPeriod = Math.exp((nominalAprPct / 100) / mDeposits) - 1;
    } else {
      iPerPeriod = Math.pow(1 + (nominalAprPct / 100) / nCompounds, nCompounds / mDeposits) - 1;
    }

    for (let p = 1; p <= periodsInYear; p++) {
      if (timing === 'start') {
        currentBalance += currentDeposit;
        yearDeposits += currentDeposit;
        const periodInterest = currentBalance * iPerPeriod;
        const netInterest = periodInterest * (1 - taxRate);
        currentBalance += netInterest;
        yearInterest += netInterest;
      } else {
        const periodInterest = currentBalance * iPerPeriod;
        const netInterest = periodInterest * (1 - taxRate);
        currentBalance += netInterest;
        yearInterest += netInterest;
        currentBalance += currentDeposit;
        yearDeposits += currentDeposit;
      }
    }

    cumulativeDeposits += yearDeposits;
    cumulativeInterest += yearInterest;

    // Real purchasing power adjusted for inflation
    const realBalance = currentBalance / Math.pow(1 + inflation, y * fractionOfYear);

    schedule.push({
      year: y,
      startingBalance: cleanNumber(yearStartBalance),
      deposits: cleanNumber(yearDeposits),
      interestEarned: cleanNumber(yearInterest),
      endingBalance: cleanNumber(currentBalance),
      cumulativeDeposits: cleanNumber(cumulativeDeposits),
      cumulativeInterest: cleanNumber(cumulativeInterest),
      inflationAdjustedBalance: cleanNumber(realBalance),
    });

    // Annual deposit increase step-up
    if (annualStepUp > 0) {
      currentDeposit = currentDeposit * (1 + annualStepUp);
    }
  }

  const finalBalance = currentBalance;
  const totalInterest = currentBalance - cumulativeDeposits;

  // Doubling time calculations
  const apyDec = effectiveApyPct / 100;
  const doublingYears = apyDec > 0 ? Math.log(2) / Math.log(1 + apyDec) : 0;
  const ruleOf72Years = rawRate > 0 ? 72 / rawRate : 0;
  const realPurchasingPower = finalBalance / Math.pow(1 + inflation, years);

  return {
    futureValue: cleanNumber(finalBalance),
    totalDeposits: cleanNumber(cumulativeDeposits),
    totalInterest: cleanNumber(totalInterest),
    apyPct: cleanNumber(effectiveApyPct),
    effectiveNominalAprPct: cleanNumber(nominalAprPct),
    doublingYears: cleanNumber(doublingYears),
    ruleOf72Years: cleanNumber(ruleOf72Years),
    realPurchasingPower: cleanNumber(realPurchasingPower),
    schedule,
  };
}

/**
 * Compounding Frequency Comparison Table
 * Evaluates the impact of different compounding frequencies on the exact same starting principal.
 */
export function compareFrequencies(
  principal: number,
  ratePct: number,
  years: number
): Array<{
  frequency: CompoundingFrequency;
  label: string;
  periodsPerYear: number | string;
  apy: number;
  endingBalance: number;
  totalInterest: number;
  diffFromAnnual: number;
}> {
  const frequencies: Array<{ id: CompoundingFrequency; label: string; periods: number | string }> = [
    { id: 'annually', label: 'Annually', periods: 1 },
    { id: 'semiannually', label: 'Semi-Annually', periods: 2 },
    { id: 'quarterly', label: 'Quarterly', periods: 4 },
    { id: 'monthly', label: 'Monthly', periods: 12 },
    { id: 'daily365', label: 'Daily (365 days)', periods: 365 },
    { id: 'daily360', label: 'Daily (360 days / Bank)', periods: 360 },
    { id: 'continuous', label: 'Compounded Continuously', periods: '∞' },
  ];

  let annualEndBalance = 0;

  return frequencies.map((freq, idx) => {
    const res = calculateCompoundGrowth({
      initialPrincipal: principal,
      ratePct,
      years,
      compounding: freq.id,
      depositAmount: 0,
    });

    if (idx === 0) {
      annualEndBalance = res.futureValue;
    }

    return {
      frequency: freq.id,
      label: freq.label,
      periodsPerYear: freq.periods,
      apy: res.apyPct,
      endingBalance: res.futureValue,
      totalInterest: res.totalInterest,
      diffFromAnnual: cleanNumber(res.futureValue - annualEndBalance),
    };
  });
}

/**
 * Simple vs. Compound Interest Comparison
 * Compares wealth accumulation under simple interest versus compound interest.
 */
export function compareSimpleVsCompound(
  principal: number,
  ratePct: number,
  years: number,
  monthlyDeposit: number = 0
): {
  simpleTotal: number;
  simpleInterest: number;
  compoundTotal: number;
  compoundInterest: number;
  advantage: number;
  advantagePct: number;
} {
  const r = ratePct / 100;

  // Simple interest on principal: P * (1 + r * t)
  const simplePrincipalEnd = principal * (1 + r * years);

  // Simple interest on regular monthly deposits:
  // Each deposit i earns simple interest for its remaining tenure
  let simpleDepositsEnd = 0;
  const totalMonths = years * 12;
  for (let m = 1; m <= totalMonths; m++) {
    const remainingYears = (totalMonths - m) / 12;
    simpleDepositsEnd += monthlyDeposit * (1 + r * remainingYears);
  }
  const simpleTotal = simplePrincipalEnd + simpleDepositsEnd;
  const totalPrincipalDeposited = principal + monthlyDeposit * totalMonths;
  const simpleInterest = simpleTotal - totalPrincipalDeposited;

  // Compound interest calculation
  const compoundRes = calculateCompoundGrowth({
    initialPrincipal: principal,
    ratePct,
    years,
    compounding: 'monthly',
    depositAmount: monthlyDeposit,
    depositFrequency: 'monthly',
    depositTiming: 'end',
  });

  const compoundTotal = compoundRes.futureValue;
  const compoundInterest = compoundRes.totalInterest;
  const advantage = compoundTotal - simpleTotal;
  const advantagePct = simpleTotal > 0 ? (advantage / simpleTotal) * 100 : 0;

  return {
    simpleTotal: cleanNumber(simpleTotal),
    simpleInterest: cleanNumber(simpleInterest),
    compoundTotal: cleanNumber(compoundTotal),
    compoundInterest: cleanNumber(compoundInterest),
    advantage: cleanNumber(advantage),
    advantagePct: cleanNumber(advantagePct),
  };
}

/**
 * Solve for Required Monthly Deposit to reach Target Savings Goal
 */
export function solveDepositForGoal(
  targetFv: number,
  initialPrincipal: number,
  ratePct: number,
  years: number,
  compounding: CompoundingFrequency = 'monthly',
  depositTiming: DepositTiming = 'end'
): number | null {
  if (targetFv <= 0 || years <= 0) return null;
  const r = (ratePct || 0) / 100;
  const m = 12; // monthly deposits
  const n = COMPOUNDING_PERIODS_MAP[compounding];

  // FV from initial principal alone
  let fvInitial: number;
  if (n === -1) {
    fvInitial = initialPrincipal * Math.exp(r * years);
  } else {
    fvInitial = initialPrincipal * Math.pow(1 + r / n, n * years);
  }

  const neededFromDeposits = targetFv - fvInitial;
  if (neededFromDeposits <= 0) return 0; // Initial alone already reaches target

  // Effective rate per deposit period
  let i: number;
  if (n === -1) {
    i = Math.exp(r / m) - 1;
  } else {
    i = Math.pow(1 + r / n, n / m) - 1;
  }

  const totalPeriods = m * years;
  if (Math.abs(i) < 1e-12) {
    return cleanNumber(neededFromDeposits / totalPeriods);
  }

  const annuityFactor = ((Math.pow(1 + i, totalPeriods) - 1) / i) * (depositTiming === 'start' ? 1 + i : 1);
  return cleanNumber(neededFromDeposits / annuityFactor);
}

/**
 * Solve for Required Interest Rate to reach Target Savings Goal
 * Uses bounded bisection method.
 */
export function solveRateForGoal(
  targetFv: number,
  initialPrincipal: number,
  years: number,
  monthlyDeposit: number = 0,
  compounding: CompoundingFrequency = 'monthly'
): number | null {
  if (targetFv <= initialPrincipal + monthlyDeposit * years * 12 || years <= 0) {
    return 0;
  }

  let low = 0;
  let high = 100; // max 100% rate

  for (let iter = 0; iter < 60; iter++) {
    const mid = (low + high) / 2;
    const res = calculateCompoundGrowth({
      initialPrincipal,
      ratePct: mid,
      years,
      compounding,
      depositAmount: monthlyDeposit,
      depositFrequency: 'monthly',
    });

    if (Math.abs(res.futureValue - targetFv) < 0.01) {
      return cleanNumber(mid);
    }

    if (res.futureValue < targetFv) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return cleanNumber((low + high) / 2);
}

/**
 * Solve for Time (in Years) Required to reach Target Savings Goal
 */
export function solveTimeForGoal(
  targetFv: number,
  initialPrincipal: number,
  ratePct: number,
  monthlyDeposit: number = 0,
  compounding: CompoundingFrequency = 'monthly'
): number | null {
  if (targetFv <= initialPrincipal) return 0;
  if (ratePct <= 0 && monthlyDeposit <= 0) return null; // Never reached

  // If rate is 0, time is simply linear deposits
  if (ratePct === 0) {
    const needed = targetFv - initialPrincipal;
    const months = needed / monthlyDeposit;
    return cleanNumber(months / 12);
  }

  // Bisection solver for years between 0.1 and 100 years
  let low = 0.05;
  let high = 100;

  for (let iter = 0; iter < 60; iter++) {
    const mid = (low + high) / 2;
    const res = calculateCompoundGrowth({
      initialPrincipal,
      ratePct,
      years: mid,
      compounding,
      depositAmount: monthlyDeposit,
      depositFrequency: 'monthly',
    });

    if (Math.abs(res.futureValue - targetFv) < 0.1) {
      return cleanNumber(mid);
    }

    if (res.futureValue < targetFv) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return cleanNumber((low + high) / 2);
}
