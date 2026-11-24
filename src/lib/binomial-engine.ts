/**
 * Binomial Distribution Engine
 *
 * Implements:
 * - Exact PMF: P(X = k) = C(n, k) * p^k * (1 - p)^(n - k) via log-gamma
 * - Cumulative CDF: P(X <= k) via regularized incomplete beta
 * - Comparisons: =, <, <=, >, >=, between [k1, k2], outside [k1, k2]
 * - Distribution moments: mean, variance, standard deviation, mode(s), skewness
 * - Normal approximation with continuity correction: criteria np >= 10, n(1-p) >= 10
 * - Inverse mode: trials needed for P(X >= 1) >= target, and smallest k for CDF >= target
 * - Table generation for distribution bars and CSV export
 *
 * Zero network dependencies. Client-side verified.
 */

import { binomialPmf, binomialCdf, normalCdf } from './stats-engine';

export type ComparisonType =
  | 'exact' // P(X = k)
  | 'at_most' // P(X <= k)
  | 'less_than' // P(X < k)
  | 'at_least' // P(X >= k)
  | 'greater_than' // P(X > k)
  | 'between' // P(k1 <= X <= k2)
  | 'outside'; // P(X < k1 or X > k2)

export interface BinomialMoments {
  mean: number;
  variance: number;
  sd: number;
  modes: number[];
  skewness: number;
}

export interface NormalApproxResult {
  isApplicable: boolean;
  np: number;
  nq: number;
  approxProbability: number;
  exactProbability: number;
  absoluteError: number;
  ruleCitation: string;
}

export interface BinomialBarData {
  k: number;
  pmf: number;
  cdf: number;
  isSelected: boolean;
}

export interface BinomialResult {
  n: number;
  p: number;
  k: number;
  k2?: number;
  comparison: ComparisonType;
  selectedProbability: number;
  exactPmf: number;
  atMostCdf: number;
  atLeastProb: number;
  moments: BinomialMoments;
  normalApprox: NormalApproxResult;
  bars: BinomialBarData[];
  comparisonLabel: string;
}

/**
 * Calculates full Binomial distribution for given n, p, k (and optional k2).
 */
export function calculateBinomial(
  n: number,
  p: number,
  k: number,
  comparison: ComparisonType = 'exact',
  k2?: number
): BinomialResult | null {
  if (!Number.isInteger(n) || n < 1 || p < 0 || p > 1 || !Number.isInteger(k)) {
    return null;
  }

  // Distribution moments
  const mean = n * p;
  const q = 1 - p;
  const variance = n * p * q;
  const sd = Math.sqrt(variance);

  // Mode(s): floor((n + 1) * p)
  const modeVal = (n + 1) * p;
  const modes: number[] = [];
  if (p === 0) {
    modes.push(0);
  } else if (p === 1) {
    modes.push(n);
  } else if (Number.isInteger(modeVal) && modeVal > 0 && modeVal <= n) {
    modes.push(modeVal - 1, modeVal);
  } else {
    modes.push(Math.floor(modeVal));
  }

  const skewness = variance > 0 ? (q - p) / sd : 0;
  const moments: BinomialMoments = { mean, variance, sd, modes, skewness };

  // Calculate comparisons
  const exactPmf = binomialPmf(k, n, p);
  const atMostCdf = binomialCdf(k, n, p);
  const atLeastProb = 1 - (k > 0 ? binomialCdf(k - 1, n, p) : 0);

  let selectedProbability = 0;
  let comparisonLabel = `P(X = ${k})`;

  switch (comparison) {
    case 'exact':
      selectedProbability = exactPmf;
      comparisonLabel = `P(X = ${k})`;
      break;

    case 'at_most':
      selectedProbability = atMostCdf;
      comparisonLabel = `P(X ≤ ${k})`;
      break;

    case 'less_than':
      selectedProbability = k > 0 ? binomialCdf(k - 1, n, p) : 0;
      comparisonLabel = `P(X < ${k})`;
      break;

    case 'at_least':
      selectedProbability = atLeastProb;
      comparisonLabel = `P(X ≥ ${k})`;
      break;

    case 'greater_than':
      selectedProbability = 1 - atMostCdf;
      comparisonLabel = `P(X > ${k})`;
      break;

    case 'between': {
      const lower = Math.min(k, k2 ?? k);
      const upper = Math.max(k, k2 ?? k);
      const cdfUpper = binomialCdf(upper, n, p);
      const cdfLowerMinus1 = lower > 0 ? binomialCdf(lower - 1, n, p) : 0;
      selectedProbability = Math.max(0, cdfUpper - cdfLowerMinus1);
      comparisonLabel = `P(${lower} ≤ X ≤ ${upper})`;
      break;
    }

    case 'outside': {
      const lower = Math.min(k, k2 ?? k);
      const upper = Math.max(k, k2 ?? k);
      const cdfUpper = binomialCdf(upper, n, p);
      const cdfLowerMinus1 = lower > 0 ? binomialCdf(lower - 1, n, p) : 0;
      const betweenProb = Math.max(0, cdfUpper - cdfLowerMinus1);
      selectedProbability = Math.max(0, 1 - betweenProb);
      comparisonLabel = `P(X < ${lower} or X > ${upper})`;
      break;
    }
  }

  // Bounds check [0, 1]
  selectedProbability = Math.max(0, Math.min(1, selectedProbability));

  // Normal approximation with continuity correction
  const np = n * p;
  const nq = n * q;
  const isApplicable = np >= 10 && nq >= 10;
  let approxProbability = 0;

  if (isApplicable && sd > 0) {
    switch (comparison) {
      case 'exact': {
        const zUpper = (k + 0.5 - mean) / sd;
        const zLower = (k - 0.5 - mean) / sd;
        approxProbability = Math.max(0, normalCdf(zUpper) - normalCdf(zLower));
        break;
      }
      case 'at_most': {
        const z = (k + 0.5 - mean) / sd;
        approxProbability = normalCdf(z);
        break;
      }
      case 'less_than': {
        const z = (k - 0.5 - mean) / sd;
        approxProbability = normalCdf(z);
        break;
      }
      case 'at_least': {
        const z = (k - 0.5 - mean) / sd;
        approxProbability = 1 - normalCdf(z);
        break;
      }
      case 'greater_than': {
        const z = (k + 0.5 - mean) / sd;
        approxProbability = 1 - normalCdf(z);
        break;
      }
      case 'between': {
        const lower = Math.min(k, k2 ?? k);
        const upper = Math.max(k, k2 ?? k);
        const zUpper = (upper + 0.5 - mean) / sd;
        const zLower = (lower - 0.5 - mean) / sd;
        approxProbability = Math.max(0, normalCdf(zUpper) - normalCdf(zLower));
        break;
      }
      case 'outside': {
        const lower = Math.min(k, k2 ?? k);
        const upper = Math.max(k, k2 ?? k);
        const zUpper = (upper + 0.5 - mean) / sd;
        const zLower = (lower - 0.5 - mean) / sd;
        const betweenApprox = Math.max(0, normalCdf(zUpper) - normalCdf(zLower));
        approxProbability = Math.max(0, 1 - betweenApprox);
        break;
      }
    }
  }

  approxProbability = Math.max(0, Math.min(1, approxProbability));
  const absoluteError = Math.abs(approxProbability - selectedProbability);

  const normalApprox: NormalApproxResult = {
    isApplicable,
    np,
    nq,
    approxProbability,
    exactProbability: selectedProbability,
    absoluteError,
    ruleCitation: 'rule of thumb used here: np ≥ 10 and n(1 − p) ≥ 10 (some textbooks use 5); the exact value above is always the one to use',
  };

  // Generate distribution bars for SVG visualization & table
  // For small to medium n (n <= 50), show all 0..n
  // For larger n, focus on range [max(0, floor(mean - 4*sd)), min(n, ceil(mean + 4*sd))]
  const startK = n <= 50 ? 0 : Math.max(0, Math.floor(mean - 4 * sd));
  const endK = n <= 50 ? n : Math.min(n, Math.ceil(mean + 4 * sd));

  const bars: BinomialBarData[] = [];
  const lowerB = Math.min(k, k2 ?? k);
  const upperB = Math.max(k, k2 ?? k);

  for (let i = startK; i <= endK; i++) {
    const pVal = binomialPmf(i, n, p);
    const cVal = binomialCdf(i, n, p);

    let isSelected = false;
    switch (comparison) {
      case 'exact':
        isSelected = i === k;
        break;
      case 'at_most':
        isSelected = i <= k;
        break;
      case 'less_than':
        isSelected = i < k;
        break;
      case 'at_least':
        isSelected = i >= k;
        break;
      case 'greater_than':
        isSelected = i > k;
        break;
      case 'between':
        isSelected = i >= lowerB && i <= upperB;
        break;
      case 'outside':
        isSelected = i < lowerB || i > upperB;
        break;
    }

    bars.push({ k: i, pmf: pVal, cdf: cVal, isSelected });
  }

  return {
    n,
    p,
    k,
    k2,
    comparison,
    selectedProbability,
    exactPmf,
    atMostCdf,
    atLeastProb,
    moments,
    normalApprox,
    bars,
    comparisonLabel,
  };
}

/**
 * Calculates trials needed to achieve at least target probability of >= 1 success:
 * P(X >= 1) = 1 - (1 - p)^n >= target
 * => (1 - p)^n <= 1 - target
 * => n * ln(1 - p) <= ln(1 - target)
 * => n >= ln(1 - target) / ln(1 - p)
 */
export function calculateTrialsNeeded(targetProb: number, p: number): number | null {
  if (targetProb <= 0 || targetProb >= 1 || p <= 0 || p >= 1) return null;
  const numerator = Math.log(1 - targetProb);
  const denominator = Math.log(1 - p);
  if (denominator === 0) return null;
  return Math.ceil(numerator / denominator);
}

/**
 * Calculates the smallest k such that cumulative P(X <= k) >= targetProb
 */
export function calculateInverseCdf(n: number, p: number, targetProb: number): number | null {
  if (n < 1 || p < 0 || p > 1 || targetProb <= 0 || targetProb > 1) return null;
  for (let k = 0; k <= n; k++) {
    if (binomialCdf(k, n, p) >= targetProb) {
      return k;
    }
  }
  return n;
}
