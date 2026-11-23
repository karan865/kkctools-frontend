/**
 * T-Test Calculation Engine.
 * Supports:
 * - Two-sample t-test: Welch's t-test (default) and Student's pooled variance t-test
 * - Paired (dependent) t-test
 * - One-sample t-test
 * - Two-tailed, one-tailed (greater), and one-tailed (less) hypotheses
 * - Exact degrees of freedom (Welch-Satterthwaite equation)
 * - p-values via Student-t CDF and critical t thresholds
 * - Confidence intervals for mean differences
 * - Effect sizes: Cohen's d and Hedges' g correction
 * Zero network dependencies. Client-side verified.
 */

import { studentTCdf, studentTInverse } from './stats-engine';

export type TTestType = 'welch' | 'pooled' | 'paired' | 'one_sample';
export type TailType = 'two' | 'one_greater' | 'one_less';

export interface TTestResult {
  t: number;
  df: number;
  pValue: number;
  criticalT: number;
  isSignificant: boolean;
  alpha: number;
  tails: TailType;
  meanDiff: number;
  seDiff: number;
  ciLower: number;
  ciUpper: number;
  cohensD: number;
  hedgesG: number;
  testType: TTestType;
}

/**
 * Calculates Two-Sample t-test (Welch or Pooled).
 */
export function calculateTwoSampleTTest(
  n1: number,
  mean1: number,
  sd1: number,
  n2: number,
  mean2: number,
  sd2: number,
  isWelch: boolean = true,
  alpha: number = 0.05,
  tails: TailType = 'two',
  delta: number = 0
): TTestResult | null {
  if (n1 < 2 || n2 < 2 || sd1 <= 0 || sd2 <= 0 || alpha <= 0 || alpha >= 1) {
    return null;
  }

  const meanDiff = mean1 - mean2;
  const v1 = (sd1 * sd1) / n1;
  const v2 = (sd2 * sd2) / n2;

  let t: number;
  let df: number;
  let seDiff: number;
  let pooledSd: number;

  if (isWelch) {
    seDiff = Math.sqrt(v1 + v2);
    t = (meanDiff - delta) / seDiff;
    // Welch-Satterthwaite degrees of freedom
    const numerator = Math.pow(v1 + v2, 2);
    const denominator = Math.pow(v1, 2) / (n1 - 1) + Math.pow(v2, 2) / (n2 - 1);
    df = numerator / denominator;
    pooledSd = Math.sqrt(((n1 - 1) * sd1 * sd1 + (n2 - 1) * sd2 * sd2) / (n1 + n2 - 2));
  } else {
    // Pooled variance Student's t-test
    df = n1 + n2 - 2;
    const pooledVariance = ((n1 - 1) * sd1 * sd1 + (n2 - 1) * sd2 * sd2) / df;
    pooledSd = Math.sqrt(pooledVariance);
    seDiff = pooledSd * Math.sqrt(1 / n1 + 1 / n2);
    t = (meanDiff - delta) / seDiff;
  }

  // p-value calculation
  let pValue: number;
  if (tails === 'two') {
    pValue = 2 * (1.0 - studentTCdf(Math.abs(t), df));
  } else if (tails === 'one_greater') {
    pValue = 1.0 - studentTCdf(t, df);
  } else {
    pValue = studentTCdf(t, df);
  }

  // Ensure pValue is bounded within [0, 1]
  pValue = Math.max(0, Math.min(1, pValue));

  // Critical t
  const critProb = tails === 'two' ? 1 - alpha / 2 : 1 - alpha;
  const criticalT = studentTInverse(critProb, df);

  // Confidence interval for mean difference
  const marginOfError = criticalT * seDiff;
  const ciLower = meanDiff - marginOfError;
  const ciUpper = meanDiff + marginOfError;

  // Effect sizes
  const cohensD = (mean1 - mean2) / pooledSd;
  const j = 1 - 3 / (4 * (n1 + n2) - 9); // Hedges' g correction factor
  const hedgesG = cohensD * j;

  const isSignificant = pValue < alpha;

  return {
    t,
    df,
    pValue,
    criticalT,
    isSignificant,
    alpha,
    tails,
    meanDiff,
    seDiff,
    ciLower,
    ciUpper,
    cohensD,
    hedgesG,
    testType: isWelch ? 'welch' : 'pooled',
  };
}

/**
 * Calculates Paired t-test given summary difference stats or paired numbers.
 */
export function calculatePairedTTest(
  n: number,
  meanDiff: number,
  sdDiff: number,
  alpha: number = 0.05,
  tails: TailType = 'two',
  delta: number = 0
): TTestResult | null {
  if (n < 2 || sdDiff <= 0 || alpha <= 0 || alpha >= 1) return null;

  const df = n - 1;
  const seDiff = sdDiff / Math.sqrt(n);
  const t = (meanDiff - delta) / seDiff;

  let pValue: number;
  if (tails === 'two') {
    pValue = 2 * (1.0 - studentTCdf(Math.abs(t), df));
  } else if (tails === 'one_greater') {
    pValue = 1.0 - studentTCdf(t, df);
  } else {
    pValue = studentTCdf(t, df);
  }
  pValue = Math.max(0, Math.min(1, pValue));

  const critProb = tails === 'two' ? 1 - alpha / 2 : 1 - alpha;
  const criticalT = studentTInverse(critProb, df);

  const marginOfError = criticalT * seDiff;
  const ciLower = meanDiff - marginOfError;
  const ciUpper = meanDiff + marginOfError;

  const cohensD = meanDiff / sdDiff;
  const j = 1 - 3 / (4 * df - 1);
  const hedgesG = cohensD * j;

  return {
    t,
    df,
    pValue,
    criticalT,
    isSignificant: pValue < alpha,
    alpha,
    tails,
    meanDiff,
    seDiff,
    ciLower,
    ciUpper,
    cohensD,
    hedgesG,
    testType: 'paired',
  };
}

/**
 * Calculates One-Sample t-test comparing sample mean to a hypothesized population mean (mu0).
 */
export function calculateOneSampleTTest(
  n: number,
  sampleMean: number,
  sd: number,
  mu0: number = 0,
  alpha: number = 0.05,
  tails: TailType = 'two'
): TTestResult | null {
  if (n < 2 || sd <= 0 || alpha <= 0 || alpha >= 1) return null;

  const meanDiff = sampleMean - mu0;
  const df = n - 1;
  const seDiff = sd / Math.sqrt(n);
  const t = meanDiff / seDiff;

  let pValue: number;
  if (tails === 'two') {
    pValue = 2 * (1.0 - studentTCdf(Math.abs(t), df));
  } else if (tails === 'one_greater') {
    pValue = 1.0 - studentTCdf(t, df);
  } else {
    pValue = studentTCdf(t, df);
  }
  pValue = Math.max(0, Math.min(1, pValue));

  const critProb = tails === 'two' ? 1 - alpha / 2 : 1 - alpha;
  const criticalT = studentTInverse(critProb, df);

  const marginOfError = criticalT * seDiff;
  const ciLower = meanDiff - marginOfError;
  const ciUpper = meanDiff + marginOfError;

  const cohensD = meanDiff / sd;
  const j = 1 - 3 / (4 * df - 1);
  const hedgesG = cohensD * j;

  return {
    t,
    df,
    pValue,
    criticalT,
    isSignificant: pValue < alpha,
    alpha,
    tails,
    meanDiff,
    seDiff,
    ciLower,
    ciUpper,
    cohensD,
    hedgesG,
    testType: 'one_sample',
  };
}
