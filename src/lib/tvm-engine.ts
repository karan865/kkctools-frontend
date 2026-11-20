/**
 * tvm-engine.ts — Time Value of Money (TVM) & Capital Budgeting Engine
 *
 * Core engine for:
 * 1. Present Value Calculator (/present-value-calculator/)
 * 2. Compound Interest Calculator (/compound-interest-calculator/)
 * 3. Investment Return Calculator (/investment-return-calculator/)
 *
 * Reuses npv and irr from real-estate-engine.ts per Batch 3 Part 3 §13 rules.
 * Pure functions only. Zero DOM, zero network, zero side-effects.
 */

import { npv as baseNpv, irr as baseIrr } from './real-estate-engine';

export type CompoundingFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'semimonthly'
  | 'biweekly'
  | 'weekly'
  | 'daily'
  | 'continuous';

export const COMPOUNDING_PERIODS: Record<CompoundingFrequency, number> = {
  annually: 1,
  semiannually: 2,
  quarterly: 4,
  monthly: 12,
  semimonthly: 24,
  biweekly: 26,
  weekly: 52,
  daily: 365,
  continuous: -1,
};

function cleanNumber(val: number): number {
  if (Object.is(val, -0) || Math.abs(val) < 1e-12) return 0;
  return Number(val.toFixed(10));
}

/**
 * Present Value of a Single Sum (Lump Sum)
 * PV = FV / (1 + r/m)^(m*t)
 * For continuous: PV = FV * e^(-r*t)
 */
export function pv(
  fv: number,
  ratePct: number,
  years: number,
  compounding: CompoundingFrequency | number = 'annually'
): number | null {
  if (!Number.isFinite(fv) || !Number.isFinite(ratePct) || !Number.isFinite(years)) return null;
  if (years < 0) return null;

  const r = ratePct / 100;
  const m = typeof compounding === 'number' ? compounding : COMPOUNDING_PERIODS[compounding] ?? 1;

  if (m === -1 || compounding === 'continuous') {
    return cleanNumber(fv * Math.exp(-r * years));
  }

  if (m <= 0) return null;
  const periodicRate = r / m;
  if (periodicRate <= -1) return null;

  const totalPeriods = m * years;
  if (periodicRate === 0) return cleanNumber(fv);

  const discountFactor = Math.pow(1 + periodicRate, totalPeriods);
  if (!Number.isFinite(discountFactor) || discountFactor === 0) return null;

  return cleanNumber(fv / discountFactor);
}

/**
 * Future Value of a Single Sum
 * FV = PV * (1 + r/m)^(m*t)
 * Continuous: FV = PV * e^(r*t)
 */
export function fv(
  pvAmount: number,
  ratePct: number,
  years: number,
  compounding: CompoundingFrequency | number = 'annually'
): number | null {
  if (!Number.isFinite(pvAmount) || !Number.isFinite(ratePct) || !Number.isFinite(years)) return null;
  if (years < 0) return null;

  const r = ratePct / 100;
  const m = typeof compounding === 'number' ? compounding : COMPOUNDING_PERIODS[compounding] ?? 1;

  if (m === -1 || compounding === 'continuous') {
    return cleanNumber(pvAmount * Math.exp(r * years));
  }

  if (m <= 0) return null;
  const periodicRate = r / m;
  if (periodicRate <= -1) return null;

  const totalPeriods = m * years;
  return cleanNumber(pvAmount * Math.pow(1 + periodicRate, totalPeriods));
}

/**
 * Present Value of an Annuity (Ordinary or Due)
 * PV = PMT * [(1 - (1 + i)^-n) / i] * (due ? 1 + i : 1)
 */
export function pvAnnuity(
  payment: number,
  ratePct: number,
  periods: number,
  timing: 'ordinary' | 'due' = 'ordinary'
): number | null {
  if (!Number.isFinite(payment) || !Number.isFinite(ratePct) || !Number.isFinite(periods)) return null;
  if (periods < 0) return null;

  const i = ratePct / 100;
  const dueFactor = timing === 'due' ? 1 + i : 1;

  if (Math.abs(i) < 1e-12) {
    return cleanNumber(payment * periods);
  }

  if (i <= -1) return null;

  const factor = (1 - Math.pow(1 + i, -periods)) / i;
  return cleanNumber(payment * factor * dueFactor);
}

/**
 * Future Value of an Annuity (Ordinary or Due)
 * FV = PMT * [((1 + i)^n - 1) / i] * (due ? 1 + i : 1)
 */
export function fvAnnuity(
  payment: number,
  ratePct: number,
  periods: number,
  timing: 'ordinary' | 'due' = 'ordinary'
): number | null {
  if (!Number.isFinite(payment) || !Number.isFinite(ratePct) || !Number.isFinite(periods)) return null;
  if (periods < 0) return null;

  const i = ratePct / 100;
  const dueFactor = timing === 'due' ? 1 + i : 1;

  if (Math.abs(i) < 1e-12) {
    return cleanNumber(payment * periods);
  }

  if (i <= -1) return null;

  const factor = (Math.pow(1 + i, periods) - 1) / i;
  return cleanNumber(payment * factor * dueFactor);
}

/**
 * Present Value of a Growing Annuity
 * PV = PMT / (i - g) * [1 - ((1 + g) / (1 + i))^n] * (due ? 1 + i : 1)
 * Special case: when i === g, PV = (PMT * n / (1 + i)) * (due ? 1 + i : 1)
 */
export function pvGrowingAnnuity(
  payment: number,
  ratePct: number,
  growthPct: number,
  periods: number,
  timing: 'ordinary' | 'due' = 'ordinary'
): number | null {
  if (
    !Number.isFinite(payment) ||
    !Number.isFinite(ratePct) ||
    !Number.isFinite(growthPct) ||
    !Number.isFinite(periods)
  ) {
    return null;
  }
  if (periods < 0) return null;

  const i = ratePct / 100;
  const g = growthPct / 100;
  const dueFactor = timing === 'due' ? 1 + i : 1;

  if (i <= -1 || g <= -1) return null;

  // When discount rate equals growth rate
  if (Math.abs(i - g) < 1e-9) {
    return cleanNumber(((payment * periods) / (1 + i)) * dueFactor);
  }

  const factor = (1 / (i - g)) * (1 - Math.pow((1 + g) / (1 + i), periods));
  return cleanNumber(payment * factor * dueFactor);
}

/**
 * Present Value of a Perpetuity (or Growing Perpetuity)
 * PV = PMT / (i - g)
 * Returns null if discount rate <= growth rate
 */
export function pvPerpetuity(payment: number, ratePct: number, growthPct: number = 0): number | null {
  if (!Number.isFinite(payment) || !Number.isFinite(ratePct) || !Number.isFinite(growthPct)) return null;

  const i = ratePct / 100;
  const g = growthPct / 100;

  if (i <= g || i <= 0) return null;

  return cleanNumber(payment / (i - g));
}

/**
 * Effective Annual Rate (EAR / APY) from Nominal Rate
 * EAR = (1 + r/m)^m - 1
 */
export function effectiveRate(nominalRatePct: number, m: number): number | null {
  if (!Number.isFinite(nominalRatePct) || !Number.isFinite(m) || m <= 0) return null;
  const r = nominalRatePct / 100;
  const ear = Math.pow(1 + r / m, m) - 1;
  return cleanNumber(ear * 100);
}

/**
 * Nominal Rate (APR) from Effective Annual Rate (APY)
 * r = m * [(1 + APY)^(1/m) - 1]
 */
export function nominalFromApy(apyPct: number, m: number): number | null {
  if (!Number.isFinite(apyPct) || !Number.isFinite(m) || m <= 0) return null;
  const apy = apyPct / 100;
  if (apy <= -1) return null;
  const nominal = m * (Math.pow(1 + apy, 1 / m) - 1);
  return cleanNumber(nominal * 100);
}

/**
 * Equivalent Periodic Rate
 */
export function perPeriodRate(nominalRatePct: number, m: number): number | null {
  if (!Number.isFinite(nominalRatePct) || !Number.isFinite(m) || m <= 0) return null;
  return cleanNumber(nominalRatePct / m);
}

/**
 * Re-export verified base NPV and IRR from real-estate-engine
 */
export const npv = baseNpv;
export const irr = baseIrr;

/**
 * Capital Budgeting: Net Present Value with Initial Outlay
 * NPV = -initialInvestment + sum(flows[t] / (1+r)^t)
 */
export function npvProject(
  initialInvestment: number,
  cashFlows: number[],
  discountRatePct: number
): number | null {
  if (!Number.isFinite(initialInvestment) || !Array.isArray(cashFlows) || !Number.isFinite(discountRatePct)) {
    return null;
  }
  const series = [-Math.abs(initialInvestment), ...cashFlows];
  return baseNpv(discountRatePct, series);
}

/**
 * Profitability Index (Benefit-Cost Ratio)
 * PI = Present Value of Future Cash Inflows / Initial Investment
 */
export function profitabilityIndex(
  initialInvestment: number,
  cashFlows: number[],
  discountRatePct: number
): number | null {
  if (!Number.isFinite(initialInvestment) || initialInvestment <= 0 || !Array.isArray(cashFlows)) {
    return null;
  }
  const pvInflows = baseNpv(discountRatePct, [0, ...cashFlows]);
  if (pvInflows === null) return null;
  return cleanNumber(pvInflows / initialInvestment);
}

/**
 * Discounted Payback Period (in years, fractional)
 */
export function discountedPayback(
  initialInvestment: number,
  cashFlows: number[],
  discountRatePct: number
): number | null {
  if (!Number.isFinite(initialInvestment) || initialInvestment <= 0 || !Array.isArray(cashFlows) || cashFlows.length === 0) {
    return null;
  }

  const r = discountRatePct / 100;
  let cumulative = 0;

  for (let t = 0; t < cashFlows.length; t++) {
    const cf = cashFlows[t];
    const discountedCf = cf / Math.pow(1 + r, t + 1);
    const prevCumulative = cumulative;
    cumulative += discountedCf;

    if (cumulative >= initialInvestment) {
      const needed = initialInvestment - prevCumulative;
      const fraction = discountedCf > 0 ? needed / discountedCf : 0;
      return cleanNumber(t + fraction);
    }
  }

  // Never paid back within given flows
  return null;
}

/**
 * NPV Profile Curve
 * Evaluates NPV across a range of discount rates to graph where it crosses zero (IRR)
 */
export function npvProfile(
  initialInvestment: number,
  cashFlows: number[],
  fromRatePct: number = 0,
  toRatePct: number = 30,
  stepPct: number = 2
): Array<{ rate: number; npv: number }> {
  if (!Number.isFinite(initialInvestment) || !Array.isArray(cashFlows)) return [];

  const points: Array<{ rate: number; npv: number }> = [];
  const series = [-Math.abs(initialInvestment), ...cashFlows];

  for (let rate = fromRatePct; rate <= toRatePct + 1e-9; rate += stepPct) {
    const val = baseNpv(rate, series);
    if (val !== null) {
      points.push({ rate: cleanNumber(rate), npv: cleanNumber(val) });
    }
  }

  return points;
}

export interface DateCashFlow {
  date: string | Date;
  amount: number;
}

/**
 * XNPV — Net Present Value for Cash Flows with Irregular Dates
 * XNPV = sum( amount_i / (1 + r)^((d_i - d_0) / 365) )
 */
export function xnpv(discountRatePct: number, cashFlows: DateCashFlow[]): number | null {
  if (!Number.isFinite(discountRatePct) || !Array.isArray(cashFlows) || cashFlows.length === 0) return null;

  const r = discountRatePct / 100;
  if (r <= -1) return null;

  const parseDate = (d: string | Date): number => {
    return typeof d === 'string' ? new Date(d).getTime() : d.getTime();
  };

  const d0 = parseDate(cashFlows[0].date);
  if (Number.isNaN(d0)) return null;

  let total = 0;
  const msPerYear = 1000 * 60 * 60 * 24 * 365;

  for (let i = 0; i < cashFlows.length; i++) {
    const item = cashFlows[i];
    if (!Number.isFinite(item.amount)) return null;
    const di = parseDate(item.date);
    if (Number.isNaN(di)) return null;

    const years = (di - d0) / msPerYear;
    total += item.amount / Math.pow(1 + r, years);
  }

  return cleanNumber(total);
}

/**
 * Present Value Discount Factor Table Generator
 * Matrix of 1 / (1 + r)^n rounded to 4 decimals
 */
export function pvTable(ratesPct: number[], maxPeriod: number = 20): Array<{ period: number; factors: Record<number, number> }> {
  const table: Array<{ period: number; factors: Record<number, number> }> = [];

  for (let n = 1; n <= maxPeriod; n++) {
    const row: Record<number, number> = {};
    for (const rate of ratesPct) {
      const r = rate / 100;
      const factor = 1 / Math.pow(1 + r, n);
      row[rate] = Number(factor.toFixed(4));
    }
    table.push({ period: n, factors: row });
  }

  return table;
}

/**
 * Annuity Factor Table Generator
 * Matrix of (1 - (1 + r)^-n) / r rounded to 4 decimals
 */
export function annuityTable(ratesPct: number[], maxPeriod: number = 20): Array<{ period: number; factors: Record<number, number> }> {
  const table: Array<{ period: number; factors: Record<number, number> }> = [];

  for (let n = 1; n <= maxPeriod; n++) {
    const row: Record<number, number> = {};
    for (const rate of ratesPct) {
      const r = rate / 100;
      const factor = r === 0 ? n : (1 - Math.pow(1 + r, -n)) / r;
      row[rate] = Number(factor.toFixed(4));
    }
    table.push({ period: n, factors: row });
  }

  return table;
}

/**
 * Excel & Google Sheets Formula Generator
 * Solves the period-0 mistake and sign conventions in spreadsheet TVM functions
 */
export function generateExcelFormulas(
  mode: 'lump-sum' | 'annuity' | 'uneven' | 'npv',
  params: {
    fv?: number;
    payment?: number;
    ratePct?: number;
    periods?: number;
    timing?: 'ordinary' | 'due';
    initialInvestment?: number;
    cashFlows?: number[];
  }
): { excel: string; sheets: string; notes: string } {
  switch (mode) {
    case 'lump-sum': {
      const fvVal = params.fv ?? 10000;
      const n = params.periods ?? 10;
      return {
        excel: `=PV(${params.ratePct}%, ${n}, 0, -${fvVal})`,
        sheets: `=PV(${params.ratePct}%, ${n}, 0, -${fvVal})`,
        notes:
          'Excel PV uses negative sign on FV (-FV) so that the calculated Present Value returns as a positive number.',
      };
    }
    case 'annuity': {
      const pmt = params.payment ?? 1000;
      const n = params.periods ?? 10;
      const type = params.timing === 'due' ? 1 : 0;
      return {
        excel: `=PV(${params.ratePct}%, ${n}, -${pmt}, 0, ${type})`,
        sheets: `=PV(${params.ratePct}%, ${n}, -${pmt}, 0, ${type})`,
        notes: `Type ${type} indicates ${type === 1 ? 'Annuity Due (payments at beginning)' : 'Ordinary Annuity (payments at end)'}.`,
      };
    }
    case 'uneven': {
      return {
        excel: `=NPV(${params.ratePct}%, B2:B${(params.cashFlows?.length ?? 5) + 1})`,
        sheets: `=NPV(${params.ratePct}%, B2:B${(params.cashFlows?.length ?? 5) + 1})`,
        notes: 'NPV discounts all values in range starting at period 1.',
      };
    }
    case 'npv': {
      const c0 = params.initialInvestment ?? 10000;
      const count = params.cashFlows?.length ?? 5;
      return {
        excel: `=NPV(${params.ratePct}%, B2:B${count + 1}) - ${c0}`,
        sheets: `=NPV(${params.ratePct}%, B2:B${count + 1}) - ${c0}`,
        notes:
          'Crucial spreadsheet rule: Excel & Google Sheets NPV functions assume the first value in range is Year 1. Always add period 0 outflow outside the NPV function: =NPV(rate, inflows) - initial_outlay.',
      };
    }
  }
}
