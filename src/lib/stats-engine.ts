/**
 * Pure statistical calculation engine.
 * Zero network dependencies. Client-side verified.
 * Used by: IQR, Standard Deviation, Binomial, T-Test, A/B Test.
 */

export interface ParsedNumbers {
  numbers: number[];
  rejectedTokens: string[];
}

export type QuartileMethod =
  | 'tukey_exclusive' // TI-84, textbook standard (median excluded)
  | 'tukey_inclusive' // median included in halves
  | 'exclusive'       // Excel QUARTILE.EXC, R type 6 (n+1)
  | 'inclusive';      // Excel QUARTILE.INC, R type 7, Google Sheets (n-1)+1

export interface QuartileResult {
  q1: number;
  q2: number; // Median
  q3: number;
  iqr: number;
  min: number;
  max: number;
  range: number;
  lowerInnerFence: number;
  upperInnerFence: number;
  lowerOuterFence: number;
  upperOuterFence: number;
  whiskerLower: number;
  whiskerUpper: number;
  mildOutliers: number[];
  extremeOutliers: number[];
  allOutliers: number[];
}

export interface SummaryStats {
  count: number;
  sum: number;
  mean: number;
  median: number;
  modes: number[];
  min: number;
  max: number;
  range: number;
  sampleVariance: number;
  populationVariance: number;
  sampleSD: number;
  populationSD: number;
  standardError: number;
  quartiles: QuartileResult;
}

/**
 * Robustly parses numbers from text with commas, spaces, tabs, newlines, semicolons.
 */
export function parseNumbers(input: string): ParsedNumbers {
  if (!input || !input.trim()) {
    return { numbers: [], rejectedTokens: [] };
  }

  const rawTokens = input.split(/[\s,;\t\r\n]+/);
  const numbers: number[] = [];
  const rejectedTokens: string[] = [];

  for (const token of rawTokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;

    // Clean leading/trailing parentheses or common currency signs
    const sanitized = trimmed.replace(/^[$€£¥(]+/, '').replace(/[)]+$/, '');
    const num = Number(sanitized);

    if (!isNaN(num) && isFinite(num)) {
      numbers.push(num);
    } else {
      rejectedTokens.push(trimmed);
    }
  }

  return { numbers, rejectedTokens };
}

export function sum(values: number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

export function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return sum(values) / values.length;
}

export function median(sorted: number[]): number | null {
  const n = sorted.length;
  if (n === 0) return null;
  const mid = Math.floor(n / 2);
  if (n % 2 !== 0) {
    return sorted[mid];
  }
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

export interface MethodComparisonRow {
  methodId: QuartileMethod;
  name: string;
  softwareLabel: string;
  q1: number;
  median: number;
  q3: number;
  iqr: number;
  rule: string;
}

/**
 * Compares all 4 quartile calculation methods on a sorted dataset.
 */
export function compareAllQuartileMethods(sorted: number[]): MethodComparisonRow[] {
  const methods: { id: QuartileMethod; name: string; software: string; rule: string }[] = [
    {
      id: 'tukey_exclusive',
      name: 'Tukey (Median Excluded)',
      software: 'TI-83/TI-84, standard textbooks',
      rule: 'Odd n: median excluded from halves; Q1 is median of lower half',
    },
    {
      id: 'inclusive',
      name: 'Inclusive Interpolation',
      software: 'Excel QUARTILE.INC, Google Sheets, R Type 7',
      rule: 'Rank = p(n − 1) + 1 with linear interpolation',
    },
    {
      id: 'exclusive',
      name: 'Exclusive Interpolation',
      software: 'Excel QUARTILE.EXC, R Type 6',
      rule: 'Rank = p(n + 1) with linear interpolation',
    },
    {
      id: 'tukey_inclusive',
      name: 'Tukey (Median Included)',
      software: 'Alternative textbook conventions',
      rule: 'Odd n: median included in both upper and lower halves',
    },
  ];

  return methods.map((m) => {
    const res = calculateQuartiles(sorted, m.id);
    return {
      methodId: m.id,
      name: m.name,
      softwareLabel: m.software,
      q1: res ? res.q1 : 0,
      median: res ? res.q2 : 0,
      q3: res ? res.q3 : 0,
      iqr: res ? res.iqr : 0,
      rule: m.rule,
    };
  });
}

export function mode(values: number[]): number[] {
  if (values.length === 0) return [];
  const freq = new Map<number, number>();
  let maxCount = 0;

  for (const v of values) {
    const count = (freq.get(v) || 0) + 1;
    freq.set(v, count);
    if (count > maxCount) maxCount = count;
  }

  if (maxCount <= 1 && values.length > 1) {
    return []; // No distinct mode
  }

  const modes: number[] = [];
  for (const [val, count] of freq.entries()) {
    if (count === maxCount) {
      modes.push(val);
    }
  }

  return modes.sort((a, b) => a - b);
}

/**
 * Calculates quartiles and fences based on the specified method.
 * Assumes sorted array in ascending order.
 */
export function calculateQuartiles(
  sorted: number[],
  method: QuartileMethod = 'tukey_exclusive'
): QuartileResult | null {
  const n = sorted.length;
  if (n === 0) return null;

  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;
  const q2 = median(sorted) ?? sorted[0];

  let q1: number;
  let q3: number;

  if (n === 1) {
    q1 = sorted[0];
    q3 = sorted[0];
  } else if (method === 'tukey_exclusive') {
    // Standard textbook / TI-84 method
    const mid = Math.floor(n / 2);
    const lowerHalf = sorted.slice(0, mid);
    const upperHalf = n % 2 === 0 ? sorted.slice(mid) : sorted.slice(mid + 1);
    q1 = median(lowerHalf) ?? sorted[0];
    q3 = median(upperHalf) ?? sorted[n - 1];
  } else if (method === 'tukey_inclusive') {
    // Median included in both halves if n is odd
    const mid = Math.floor(n / 2);
    const lowerHalf = n % 2 === 0 ? sorted.slice(0, mid) : sorted.slice(0, mid + 1);
    const upperHalf = sorted.slice(mid);
    q1 = median(lowerHalf) ?? sorted[0];
    q3 = median(upperHalf) ?? sorted[n - 1];
  } else if (method === 'exclusive') {
    // Excel QUARTILE.EXC / R type 6: rank = p * (n + 1)
    q1 = interpolatePercentile(sorted, 0.25, (p, len) => p * (len + 1) - 1);
    q3 = interpolatePercentile(sorted, 0.75, (p, len) => p * (len + 1) - 1);
  } else {
    // inclusive: Excel QUARTILE.INC / R type 7: rank = p * (n - 1)
    q1 = interpolatePercentile(sorted, 0.25, (p, len) => p * (len - 1));
    q3 = interpolatePercentile(sorted, 0.75, (p, len) => p * (len - 1));
  }

  const iqr = q3 - q1;
  const lowerInnerFence = q1 - 1.5 * iqr;
  const upperInnerFence = q3 + 1.5 * iqr;
  const lowerOuterFence = q1 - 3.0 * iqr;
  const upperOuterFence = q3 + 3.0 * iqr;

  // Whiskers: extreme values inside the inner fences
  let whiskerLower = min;
  for (let i = 0; i < n; i++) {
    if (sorted[i] >= lowerInnerFence) {
      whiskerLower = sorted[i];
      break;
    }
  }

  let whiskerUpper = max;
  for (let i = n - 1; i >= 0; i--) {
    if (sorted[i] <= upperInnerFence) {
      whiskerUpper = sorted[i];
      break;
    }
  }

  const mildOutliers: number[] = [];
  const extremeOutliers: number[] = [];
  const allOutliers: number[] = [];

  for (const val of sorted) {
    if (val < lowerOuterFence || val > upperOuterFence) {
      extremeOutliers.push(val);
      allOutliers.push(val);
    } else if (val < lowerInnerFence || val > upperInnerFence) {
      mildOutliers.push(val);
      allOutliers.push(val);
    }
  }

  return {
    q1,
    q2,
    q3,
    iqr,
    min,
    max,
    range,
    lowerInnerFence,
    upperInnerFence,
    lowerOuterFence,
    upperOuterFence,
    whiskerLower,
    whiskerUpper,
    mildOutliers,
    extremeOutliers,
    allOutliers,
  };
}

function interpolatePercentile(
  sorted: number[],
  p: number,
  indexFormula: (p: number, n: number) => number
): number {
  const n = sorted.length;
  if (n === 1) return sorted[0];

  const idx = indexFormula(p, n);
  if (idx <= 0) return sorted[0];
  if (idx >= n - 1) return sorted[n - 1];

  const lowerIndex = Math.floor(idx);
  const frac = idx - lowerIndex;
  return sorted[lowerIndex] + frac * (sorted[lowerIndex + 1] - sorted[lowerIndex]);
}

/**
 * Calculates complete summary statistics for a dataset.
 */
export function getSummaryStats(
  values: number[],
  method: QuartileMethod = 'tukey_exclusive'
): SummaryStats | null {
  const count = values.length;
  if (count === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const totalSum = sum(sorted);
  const avg = totalSum / count;
  const med = median(sorted) ?? sorted[0];
  const modes = mode(sorted);
  const min = sorted[0];
  const max = sorted[count - 1];
  const range = max - min;

  // Variances
  let sqDiffSum = 0;
  for (const v of sorted) {
    const diff = v - avg;
    sqDiffSum += diff * diff;
  }

  const populationVariance = sqDiffSum / count;
  const sampleVariance = count > 1 ? sqDiffSum / (count - 1) : 0;
  const populationSD = Math.sqrt(populationVariance);
  const sampleSD = Math.sqrt(sampleVariance);
  const standardError = count > 0 ? sampleSD / Math.sqrt(count) : 0;

  const quartiles = calculateQuartiles(sorted, method)!;

  return {
    count,
    sum: totalSum,
    mean: avg,
    median: med,
    modes,
    min,
    max,
    range,
    sampleVariance,
    populationVariance,
    sampleSD,
    populationSD,
    standardError,
    quartiles,
  };
}

// -------------------------------------------------------------
// Mathematical Distributions: Normal, Student-t, Gamma & Beta
// -------------------------------------------------------------

/**
 * Error function erf(x) via Abramowitz & Stegun formula 7.1.26
 * Maximum error < 1.5e-7 across all real x.
 */
export function erf(x: number): number {
  if (x === 0) return 0;
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);

  const p = 0.3275911;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;

  const t = 1.0 / (1.0 + p * absX);
  const poly = ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t;
  const y = 1.0 - poly * Math.exp(-absX * absX);

  return sign * y;
}

/**
 * Standard Normal Probability Density Function (PDF)
 */
export function normalPdf(z: number): number {
  return (1.0 / Math.sqrt(2.0 * Math.PI)) * Math.exp(-0.5 * z * z);
}

/**
 * Standard Normal Cumulative Distribution Function Φ(z)
 */
export function normalCdf(z: number): number {
  return 0.5 * (1.0 + erf(z / Math.SQRT2));
}

/**
 * Inverse Normal CDF (probit function) via Acklam's algorithm.
 * High precision (< 1.15e-9 relative error).
 */
export function normalInverse(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;

  // Coefficients in rational approximations
  const a1 = -3.969683028665376e1;
  const a2 = 2.209460984245205e2;
  const a3 = -2.759285104469687e2;
  const a4 = 1.38357751867269e2;
  const a5 = -3.066479806614716e1;
  const a6 = 2.506628277459239;

  const b1 = -5.447609879822406e1;
  const b2 = 1.615858368580409e2;
  const b3 = -1.556989798598866e2;
  const b4 = 6.680131188771972e1;
  const b5 = -1.328068155288572e1;

  const c1 = -7.784894002430293e-3;
  const c2 = -3.223964580411365e-1;
  const c3 = -2.400758277161838;
  const c4 = -2.549732539343734;
  const c5 = 4.374664141464968;
  const c6 = 2.938163982698783;

  const d1 = 7.784695709041462e-3;
  const d2 = 3.224671290700398e-1;
  const d3 = 2.445134137142996;
  const d4 = 3.754408661907416;

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let q: number;
  let r: number;

  if (p < pLow) {
    // Rational approximation for lower region
    q = Math.sqrt(-2.0 * Math.log(p));
    return (
      (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1.0)
    );
  } else if (p <= pHigh) {
    // Rational approximation for central region
    q = p - 0.5;
    r = q * q;
    return (
      ((((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q) /
      (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1.0)
    );
  } else {
    // Rational approximation for upper region
    q = Math.sqrt(-2.0 * Math.log(1.0 - p));
    return -(
      (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1.0)
    );
  }
}

/**
 * Natural log of Gamma function ln(Γ(x)) using Lanczos approximation (g=7, n=9)
 */
export function lgamma(x: number): number {
  if (x <= 0) return NaN;

  const p = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];

  const g = 7;
  const z = x - 1;
  let a = p[0];
  const t = z + g + 0.5;

  for (let i = 1; i < p.length; i++) {
    a += p[i] / (z + i);
  }

  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a);
}

/**
 * Regularized Incomplete Beta function Ix(a, b) via Lentz continued fractions
 */
export function regularizedIncompleteBeta(x: number, a: number, b: number): number {
  if (x < 0 || x > 1) return NaN;
  if (x === 0) return 0;
  if (x === 1) return 1;

  // Use symmetry transformation if x > (a + 1)/(a + b + 2)
  if (x > (a + 1.0) / (a + b + 2.0)) {
    return 1.0 - regularizedIncompleteBeta(1.0 - x, b, a);
  }

  const factor = Math.exp(
    a * Math.log(x) + b * Math.log(1.0 - x) - lgamma(a) - lgamma(b) + lgamma(a + b)
  ) / a;

  // Continued fraction evaluation
  const maxIter = 200;
  const eps = 1e-14;
  let c = 1.0;
  let d = 1.0 - ((a + b) * x) / (a + 1.0);
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1.0 / d;
  let cf = d;

  for (let m = 1; m <= maxIter; m++) {
    const m2 = 2 * m;

    // Even step
    let num = (m * (b - m) * x) / ((a + m2 - 1.0) * (a + m2));
    d = 1.0 + num * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1.0 + num / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1.0 / d;
    cf *= c * d;

    // Odd step
    num = -((a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1.0));
    d = 1.0 + num * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1.0 + num / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1.0 / d;
    const delta = c * d;
    cf *= delta;

    if (Math.abs(delta - 1.0) < eps) {
      break;
    }
  }

  return factor * cf;
}

/**
 * Student's t Cumulative Distribution Function F(t; df)
 */
export function studentTCdf(t: number, df: number): number {
  if (df <= 0) return NaN;
  if (t === 0) return 0.5;

  const x = df / (df + t * t);
  const p = 0.5 * regularizedIncompleteBeta(x, df / 2.0, 0.5);

  return t > 0 ? 1.0 - p : p;
}

/**
 * Student's t Inverse CDF: returns t such that studentTCdf(t, df) = p
 */
export function studentTInverse(p: number, df: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p === 0.5) return 0;
  if (df <= 0) return NaN;
  // Symmetry: solve the upper tail only.
  if (p < 0.5) return -studentTInverse(1 - p, df);

  // Grow the bracket until it holds the answer (df = 1, p = 0.9995 needs t ≈ 636.6).
  let lo = 0;
  let hi = 1;
  while (studentTCdf(hi, df) < p && hi < 1e12) {
    lo = hi;
    hi *= 2;
  }

  // Bisection on t until the bracket is tight.
  for (let iter = 0; iter < 200; iter++) {
    const mid = (lo + hi) / 2;
    if (studentTCdf(mid, df) < p) {
      lo = mid;
    } else {
      hi = mid;
    }
    if (hi - lo <= 1e-12 * Math.max(1, hi)) break;
  }

  return (lo + hi) / 2;
}

/**
 * Binomial Probability Mass Function: P(X = k) for B(n, p)
 */
export function binomialPmf(k: number, n: number, p: number): number {
  if (k < 0 || k > n || p < 0 || p > 1) return 0;
  if (p === 0) return k === 0 ? 1 : 0;
  if (p === 1) return k === n ? 1 : 0;

  const logCoeff = lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1);
  const logProb = logCoeff + k * Math.log(p) + (n - k) * Math.log(1 - p);
  return Math.exp(logProb);
}

/**
 * Binomial Cumulative Distribution Function: P(X <= k) for B(n, p)
 */
export function binomialCdf(k: number, n: number, p: number): number {
  if (k < 0) return 0;
  if (k >= n) return 1;
  return regularizedIncompleteBeta(1.0 - p, n - k, k + 1.0);
}
