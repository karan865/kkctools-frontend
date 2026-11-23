/**
 * Compound Annual Growth Rate (CAGR) and Investment Growth Engine.
 * Shared between CAGR Calculator (#06) and ROI Calculator (#18).
 * Pure client-side calculations. Zero network.
 */

export interface CagrSeriesResult {
  cagr: number;
  arithmeticAverage: number;
  yearlyChanges: number[];
  finalVsStartRatio: number;
}

export interface DoublingComparison {
  exactYears: number;
  rule72Years: number;
  rule72Error: number;
  rule70Years: number;
  rule70Error: number;
  rule69Years: number;
  rule69Error: number;
}

/**
 * Calculates CAGR given starting value, ending value, and time in years.
 * Returns rate as a decimal (e.g. 0.1487 for 14.87%).
 */
export function calculateCagr(
  startValue: number,
  endValue: number,
  years: number
): number | null {
  if (startValue <= 0 || years <= 0) return null;
  if (endValue < 0) return null;
  if (endValue === 0) return -1.0; // 100% loss

  return Math.pow(endValue / startValue, 1.0 / years) - 1.0;
}

/**
 * Calculates Ending Value from Start Value, CAGR (decimal), and years.
 */
export function calculateEndFromCagr(
  startValue: number,
  cagrRate: number,
  years: number
): number | null {
  if (startValue <= 0 || years < 0 || cagrRate <= -1.0) return null;
  return startValue * Math.pow(1.0 + cagrRate, years);
}

/**
 * Calculates Starting Value from End Value, CAGR (decimal), and years.
 */
export function calculateStartFromCagr(
  endValue: number,
  cagrRate: number,
  years: number
): number | null {
  if (endValue < 0 || years <= 0 || cagrRate <= -1.0) return null;
  return endValue / Math.pow(1.0 + cagrRate, years);
}

/**
 * Calculates Years needed to grow from Start to End at a given CAGR.
 */
export function calculateYearsFromCagr(
  startValue: number,
  endValue: number,
  cagrRate: number
): number | null {
  if (startValue <= 0 || endValue <= 0 || cagrRate <= -1.0 || cagrRate === 0) {
    return null;
  }
  const ratio = endValue / startValue;
  if (ratio <= 0) return null;

  return Math.log(ratio) / Math.log(1.0 + cagrRate);
}

/**
 * Adjusts nominal CAGR for inflation using the Fisher equation:
 * Real CAGR = (1 + Nominal) / (1 + Inflation) - 1
 */
export function calculateRealCagr(
  nominalCagr: number,
  inflationRate: number
): number | null {
  if (inflationRate <= -1.0) return null;
  return (1.0 + nominalCagr) / (1.0 + inflationRate) - 1.0;
}

/**
 * Calculates CAGR and simple arithmetic average across a series of historical values.
 */
export function calculateCagrFromSeries(values: number[]): CagrSeriesResult | null {
  const n = values.length;
  if (n < 2) return null;

  const start = values[0];
  const end = values[n - 1];
  const periods = n - 1;

  const cagr = calculateCagr(start, end, periods);
  if (cagr === null) return null;

  const yearlyChanges: number[] = [];
  let sumChanges = 0;

  for (let i = 1; i < n; i++) {
    const prev = values[i - 1];
    const curr = values[i];
    if (prev <= 0) return null; // cannot compute percentage change from non-positive
    const change = (curr - prev) / prev;
    yearlyChanges.push(change);
    sumChanges += change;
  }

  const arithmeticAverage = sumChanges / periods;
  const finalVsStartRatio = end / start;

  return {
    cagr,
    arithmeticAverage,
    yearlyChanges,
    finalVsStartRatio,
  };
}

/**
 * Calculates exact doubling time and comparisons with Rule of 72, 70, and 69.3.
 * rateDecimal is expected as e.g. 0.08 for 8%.
 */
export function calculateDoubling(rateDecimal: number): DoublingComparison | null {
  if (rateDecimal <= 0) return null;

  const exactYears = Math.LN2 / Math.log(1.0 + rateDecimal);
  const ratePercent = rateDecimal * 100;

  const rule72Years = 72.0 / ratePercent;
  const rule72Error = rule72Years - exactYears;

  const rule70Years = 70.0 / ratePercent;
  const rule70Error = rule70Years - exactYears;

  const rule69Years = 69.3 / ratePercent;
  const rule69Error = rule69Years - exactYears;

  return {
    exactYears,
    rule72Years,
    rule72Error,
    rule70Years,
    rule70Error,
    rule69Years,
    rule69Error,
  };
}

/**
 * Annualizes a total cumulative ROI percentage over a number of years.
 * e.g., 100% total ROI over 5 years -> ((1 + 1.0)^(1/5) - 1) * 100 = 14.87%
 */
export function annualizeRoi(totalRoiPercent: number, years: number): number | null {
  if (years <= 0) return null;
  const totalReturnDecimal = totalRoiPercent / 100.0;
  if (totalReturnDecimal <= -1.0) return -100.0;

  const annualizedDecimal = Math.pow(1.0 + totalReturnDecimal, 1.0 / years) - 1.0;
  return annualizedDecimal * 100.0;
}
