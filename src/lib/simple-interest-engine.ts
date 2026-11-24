/**
 * Simple Interest & Accrued Interest Calculation Engine
 * 
 * Supports:
 * - Simple interest: I = P * r * t, A = P + I
 * - Variable solver: solve for I, P, r, or t
 * - Accrued interest between dates with 5 day-count conventions:
 *   Act/365, Act/360, 30/360 US (NASD), 30E/360 (Eurobond), Act/Act (ISDA)
 * - Bond accrued interest (dirty vs clean price calculation basis)
 * - Side-by-side day-count comparison
 * - Compound interest comparison (monthly compounding baseline)
 * 
 * Zero network, zero client-only imports, pure deterministic math.
 */

import {
  DateYMD,
  parseISODate,
  formatISODate,
  dateToUtcDayNumber,
  isLeapYear,
  getDaysInMonth,
} from './date-diff-engine';

export type DayCountMethod = 'ACT/365' | 'ACT/360' | '30/360' | '30E/360' | 'ACT/ACT';

export type TimeUnit = 'years' | 'months' | 'weeks' | 'days';

export interface SimpleInterestResult {
  principal: number;
  annualRatePct: number;
  timeYears: number;
  interest: number;
  totalAmount: number;
  monthlyCompoundAmount: number;
  monthlyCompoundInterest: number;
  compoundDifference: number;
}

export interface AccruedInterestResult {
  principal: number;
  annualRatePct: number;
  startDate: string;
  endDate: string;
  convention: DayCountMethod;
  actualDays: number;
  countedDays: number;
  yearFraction: number;
  dailyAccrual: number;
  accruedInterest: number;
  totalAmount: number;
  excelFormula: string;
}

export interface DayCountComparisonItem {
  convention: DayCountMethod;
  label: string;
  basis: number | string;
  countedDays: number;
  yearFraction: number;
  accruedInterest: number;
  differenceVsAct365: number;
  description: string;
}

export interface BondAccruedResult {
  faceValue: number;
  couponRatePct: number;
  frequency: number; // 1, 2, 4, 12
  annualCoupon: number;
  periodicCoupon: number;
  daysAccrued: number;
  daysInPeriod: number;
  accruedInterest: number;
  dirtyPricePerBond: number; // face + accrued
  excelFormula: string;
}

/**
 * Calculates simple interest given principal, annual rate (percent), and time in years.
 */
export function calculateSimpleInterest(
  principal: number,
  annualRatePct: number,
  timeYears: number
): SimpleInterestResult {
  const p = Math.max(0, principal);
  const r = Math.max(0, annualRatePct) / 100;
  const t = Math.max(0, timeYears);

  const interest = Number((p * r * t).toFixed(2));
  const totalAmount = Number((p + interest).toFixed(2));

  // Monthly compound interest comparison
  // A = P * (1 + r/12)^(12*t)
  const monthlyRate = r / 12;
  const periods = 12 * t;
  const compoundTotal = periods > 0 ? p * Math.pow(1 + monthlyRate, periods) : p;
  const monthlyCompoundAmount = Number(compoundTotal.toFixed(2));
  const monthlyCompoundInterest = Number((compoundTotal - p).toFixed(2));
  const compoundDifference = Number((monthlyCompoundInterest - interest).toFixed(2));

  return {
    principal: p,
    annualRatePct,
    timeYears: t,
    interest,
    totalAmount,
    monthlyCompoundAmount,
    monthlyCompoundInterest,
    compoundDifference,
  };
}

/**
 * Solves for missing simple interest parameter (I, P, r, or t).
 */
export function solveSimpleInterest(params: {
  solveFor: 'I' | 'P' | 'r' | 't';
  principal?: number;
  annualRatePct?: number;
  time?: number;
  timeUnit?: TimeUnit;
  interest?: number;
  dayBasis?: 365 | 360;
}): {
  solvedValue: number;
  timeInYears: number;
  interest: number;
  principal: number;
  annualRatePct: number;
  totalAmount: number;
} {
  const {
    solveFor,
    timeUnit = 'years',
    dayBasis = 365,
  } = params;

  // Convert time to years
  const rawTime = Math.max(0, params.time ?? 0);
  let timeInYears = rawTime;
  if (timeUnit === 'months') {
    timeInYears = rawTime / 12;
  } else if (timeUnit === 'weeks') {
    timeInYears = rawTime / 52;
  } else if (timeUnit === 'days') {
    timeInYears = rawTime / dayBasis;
  }

  let p = params.principal ?? 0;
  let r = (params.annualRatePct ?? 0) / 100;
  let t = timeInYears;
  let i = params.interest ?? 0;

  if (solveFor === 'I') {
    i = p * r * t;
    return {
      solvedValue: Number(i.toFixed(2)),
      timeInYears: t,
      interest: Number(i.toFixed(2)),
      principal: p,
      annualRatePct: params.annualRatePct ?? 0,
      totalAmount: Number((p + i).toFixed(2)),
    };
  }

  if (solveFor === 'P') {
    const denom = r * t;
    p = denom > 0 ? i / denom : 0;
    return {
      solvedValue: Number(p.toFixed(2)),
      timeInYears: t,
      interest: i,
      principal: Number(p.toFixed(2)),
      annualRatePct: params.annualRatePct ?? 0,
      totalAmount: Number((p + i).toFixed(2)),
    };
  }

  if (solveFor === 'r') {
    const denom = p * t;
    r = denom > 0 ? i / denom : 0;
    const rPct = Number((r * 100).toFixed(4));
    return {
      solvedValue: rPct,
      timeInYears: t,
      interest: i,
      principal: p,
      annualRatePct: rPct,
      totalAmount: Number((p + i).toFixed(2)),
    };
  }

  if (solveFor === 't') {
    const denom = p * r;
    t = denom > 0 ? i / denom : 0;
    // convert back to requested unit
    let solvedTimeUnit = t;
    if (timeUnit === 'months') solvedTimeUnit = t * 12;
    else if (timeUnit === 'weeks') solvedTimeUnit = t * 52;
    else if (timeUnit === 'days') solvedTimeUnit = t * dayBasis;

    return {
      solvedValue: Number(solvedTimeUnit.toFixed(2)),
      timeInYears: Number(t.toFixed(4)),
      interest: i,
      principal: p,
      annualRatePct: params.annualRatePct ?? 0,
      totalAmount: Number((p + i).toFixed(2)),
    };
  }

  return {
    solvedValue: 0,
    timeInYears: 0,
    interest: 0,
    principal: 0,
    annualRatePct: 0,
    totalAmount: 0,
  };
}

/**
 * Calculates day count and year fraction between two DateYMD dates according to standard conventions.
 */
export function calculateDayCount(
  start: DateYMD,
  end: DateYMD,
  convention: DayCountMethod
): { actualDays: number; countedDays: number; yearFraction: number; basis: number } {
  const dayA = dateToUtcDayNumber(start);
  const dayB = dateToUtcDayNumber(end);
  const actualDays = Math.max(0, dayB - dayA);

  if (actualDays === 0) {
    return { actualDays: 0, countedDays: 0, yearFraction: 0, basis: 365 };
  }

  switch (convention) {
    case 'ACT/365':
      return {
        actualDays,
        countedDays: actualDays,
        yearFraction: actualDays / 365.0,
        basis: 365,
      };

    case 'ACT/360':
      return {
        actualDays,
        countedDays: actualDays,
        yearFraction: actualDays / 360.0,
        basis: 360,
      };

    case '30/360': {
      // US 30/360 (Bond Basis / NASD)
      let d1 = start.day;
      let d2 = end.day;

      // If D1 is 31 or last day of February, change D1 to 30
      const isStartFebEnd = start.month === 2 && start.day === getDaysInMonth(start.year, 2);
      if (d1 === 31 || isStartFebEnd) {
        d1 = 30;
      }

      // If D2 is 31 and D1 is 30, change D2 to 30
      // If D2 is last day of February and D1 is last day of February, change D2 to 30
      const isEndFebEnd = end.month === 2 && end.day === getDaysInMonth(end.year, 2);
      if (d2 === 31 && d1 === 30) {
        d2 = 30;
      } else if (isEndFebEnd && isStartFebEnd) {
        d2 = 30;
      }

      const countedDays =
        (end.year - start.year) * 360 +
        (end.month - start.month) * 30 +
        (d2 - d1);

      const nonNegative = Math.max(0, countedDays);
      return {
        actualDays,
        countedDays: nonNegative,
        yearFraction: nonNegative / 360.0,
        basis: 360,
      };
    }

    case '30E/360': {
      // European 30E/360 (ISMA 30/360)
      const d1 = start.day === 31 ? 30 : start.day;
      const d2 = end.day === 31 ? 30 : end.day;

      const countedDays =
        (end.year - start.year) * 360 +
        (end.month - start.month) * 30 +
        (d2 - d1);

      const nonNegative = Math.max(0, countedDays);
      return {
        actualDays,
        countedDays: nonNegative,
        yearFraction: nonNegative / 360.0,
        basis: 360,
      };
    }

    case 'ACT/ACT': {
      // ISDA Actual/Actual
      if (start.year === end.year) {
        const yearDays = isLeapYear(start.year) ? 366 : 365;
        return {
          actualDays,
          countedDays: actualDays,
          yearFraction: actualDays / yearDays,
          basis: yearDays,
        };
      }

      const startYearDays = isLeapYear(start.year) ? 366 : 365;
      const endYearDays = isLeapYear(end.year) ? 366 : 365;

      const daysInStartYear =
        dateToUtcDayNumber({ year: start.year, month: 12, day: 31 }) - dayA + 1;
      const daysInEndYear =
        dayB - dateToUtcDayNumber({ year: end.year, month: 1, day: 1 });
      const fullYears = Math.max(0, end.year - start.year - 1);

      const yearFraction =
        daysInStartYear / startYearDays +
        fullYears +
        daysInEndYear / endYearDays;

      return {
        actualDays,
        countedDays: actualDays,
        yearFraction,
        basis: 365.25,
      };
    }
  }
}

/**
 * Calculates accrued interest between two calendar dates.
 */
export function calculateAccruedInterest(
  principal: number,
  annualRatePct: number,
  startDateStr: string,
  endDateStr: string,
  convention: DayCountMethod = 'ACT/365'
): AccruedInterestResult | null {
  const start = parseISODate(startDateStr);
  const end = parseISODate(endDateStr);
  if (!start || !end) return null;

  const p = Math.max(0, principal);
  const r = Math.max(0, annualRatePct) / 100;

  const dayInfo = calculateDayCount(start, end, convention);
  const accruedRaw = p * r * dayInfo.yearFraction;
  const accruedInterest = Number(accruedRaw.toFixed(2));
  const totalAmount = Number((p + accruedInterest).toFixed(2));

  // Daily accrual rate
  const dailyAccrual = Number((p * r / dayInfo.basis).toFixed(4));

  // Excel formula representation
  let excelBasis = 3; // ACT/365
  if (convention === 'ACT/360') excelBasis = 2;
  else if (convention === '30/360') excelBasis = 0; // US 30/360
  else if (convention === '30E/360') excelBasis = 4; // European 30/360
  else if (convention === 'ACT/ACT') excelBasis = 1; // Actual/Actual

  const excelFormula = `=${p}*${annualRatePct}%*YEARFRAC(DATE(${start.year},${start.month},${start.day}),DATE(${end.year},${end.month},${end.day}),${excelBasis})`;

  return {
    principal: p,
    annualRatePct,
    startDate: formatISODate(start),
    endDate: formatISODate(end),
    convention,
    actualDays: dayInfo.actualDays,
    countedDays: dayInfo.countedDays,
    yearFraction: Number(dayInfo.yearFraction.toFixed(6)),
    dailyAccrual,
    accruedInterest,
    totalAmount,
    excelFormula,
  };
}

/**
 * Compares all 5 day-count conventions side-by-side for the same loan/investment.
 */
export function compareDayCountConventions(
  principal: number,
  annualRatePct: number,
  startDateStr: string,
  endDateStr: string
): DayCountComparisonItem[] {
  const conventions: Array<{
    conv: DayCountMethod;
    label: string;
    basis: number | string;
    description: string;
  }> = [
    {
      conv: 'ACT/365',
      label: 'Actual/365 (Fixed)',
      basis: 365,
      description: 'Actual days elapsed ÷ 365, every year (leap years too).',
    },
    {
      conv: 'ACT/360',
      label: 'Actual/360 (Banker’s Rule)',
      basis: 360,
      description: 'Actual days elapsed ÷ 360. For the same days this gives 365 ÷ 360 − 1 = 1.39% more interest than Actual/365.',
    },
    {
      conv: '30/360',
      label: '30/360 US (NASD / Bond Basis)',
      basis: 360,
      description: 'Every month counts as 30 days and the year as 360, with the US end-of-month rules (31st → 30th; end of February rules).',
    },
    {
      conv: '30E/360',
      label: '30E/360 (Eurobond Basis)',
      basis: 360,
      description: 'Every month counts as 30 days and the year as 360; any 31st becomes the 30th (no February rule).',
    },
    {
      conv: 'ACT/ACT',
      label: 'Actual/Actual (ISDA)',
      basis: '365 / 366',
      description: 'Days in each calendar year ÷ that year’s length (365 or 366), added up (ISDA method). Excel’s YEARFRAC basis 1 uses a different averaging method, so it can differ slightly across years.',
    },
  ];

  const act365Result = calculateAccruedInterest(principal, annualRatePct, startDateStr, endDateStr, 'ACT/365');
  const baseInterest = act365Result ? act365Result.accruedInterest : 0;

  return conventions.map((item) => {
    const res = calculateAccruedInterest(principal, annualRatePct, startDateStr, endDateStr, item.conv);
    const accrued = res ? res.accruedInterest : 0;
    const diff = Number((accrued - baseInterest).toFixed(2));

    return {
      convention: item.conv,
      label: item.label,
      basis: item.basis,
      countedDays: res ? res.countedDays : 0,
      yearFraction: res ? res.yearFraction : 0,
      accruedInterest: accrued,
      differenceVsAct365: diff,
      description: item.description,
    };
  });
}

/**
 * Calculates accrued interest on a fixed-income bond.
 * Bond AI = Face Value * (Coupon Rate / Frequency) * (Days Accrued / Days in Period)
 */
export function calculateBondAccruedInterest(
  faceValue: number,
  annualCouponPct: number,
  frequency: 1 | 2 | 4 | 12,
  daysAccrued: number,
  daysInPeriod?: number
): BondAccruedResult {
  const face = Math.max(0, faceValue);
  const couponRate = Math.max(0, annualCouponPct) / 100;
  const annualCoupon = face * couponRate;
  const periodicCoupon = annualCoupon / frequency;

  // Default days in coupon period if not given
  // semi-annual = 180 (under 30/360) or 182.5 (under Act/365)
  // Or annualized days basis: 360 / frequency
  const periodDays = daysInPeriod && daysInPeriod > 0 ? daysInPeriod : 360 / frequency;
  const clampedAccrued = Math.max(0, daysAccrued);

  // Standard bond accrued calculation: periodicCoupon * (daysAccrued / periodDays)
  // Which equals face * couponRate * (daysAccrued / (frequency * periodDays))
  const accruedRaw = periodicCoupon * (clampedAccrued / periodDays);
  const accruedInterest = Number(accruedRaw.toFixed(2));
  const dirtyPricePerBond = Number((face + accruedInterest).toFixed(2));

  const excelFormula = `=ACCRINT(issue, first_interest, settlement, ${annualCouponPct}%, ${faceValue}, ${frequency}, 0)`;

  return {
    faceValue: face,
    couponRatePct: annualCouponPct,
    frequency,
    annualCoupon: Number(annualCoupon.toFixed(2)),
    periodicCoupon: Number(periodicCoupon.toFixed(2)),
    daysAccrued: clampedAccrued,
    daysInPeriod: periodDays,
    accruedInterest,
    dirtyPricePerBond,
    excelFormula,
  };
}
