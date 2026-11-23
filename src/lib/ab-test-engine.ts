/**
 * Pure A/B test statistical calculation engine.
 * Zero network dependencies. Client-side verified.
 * Used by: A/B Test Significance Calculator (/ab-test-significance-calculator/)
 */

import { normalCdf, normalInverse } from './stats-engine';

export interface AbTestInput {
  controlVisitors: number;
  controlConversions: number;
  variantVisitors: number;
  variantConversions: number;
  confidenceLevel: number; // e.g. 0.95
  isTwoSided: boolean;
}

export interface AbTestResult {
  controlVisitors: number;
  controlConversions: number;
  controlRate: number; // e.g. 0.050 (5.0%)
  variantVisitors: number;
  variantConversions: number;
  variantRate: number; // e.g. 0.057 (5.7%)
  rateDifference: number; // variantRate - controlRate (absolute pp)
  relativeLift: number; // ((variantRate - controlRate) / controlRate) * 100
  pooledRate: number;
  standardError: number; // unpooled SE for confidence interval
  pooledSE: number; // pooled SE for hypothesis test
  zScore: number;
  pValueTwoSided: number;
  pValueOneSided: number;
  pValue: number; // based on isTwoSided
  confidenceLevel: number;
  criticalZ: number;
  isSignificant: boolean;
  ciLower: number; // absolute difference CI lower bound
  ciUpper: number; // absolute difference CI upper bound
  observedPower: number; // retrospective power
  verdict: string;
  explanation: string;
  meaning: string; // plain-language p-value meaning
  warnings: string[];
}

export interface VariantArmInput {
  name: string;
  visitors: number;
  conversions: number;
}

export interface MultiVariantResult {
  control: { name: string; visitors: number; conversions: number; rate: number };
  variants: Array<{
    name: string;
    visitors: number;
    conversions: number;
    rate: number;
    rateDifference: number;
    relativeLift: number;
    zScore: number;
    rawPValue: number;
    adjustedPValue: number;
    isSignificant: boolean;
    ciLower: number;
    ciUpper: number;
  }>;
  correctionMethod: 'bonferroni' | 'sidak' | 'none';
  nominalAlpha: number;
  adjustedAlpha: number;
}

export interface SampleSizeInput {
  baselineRate: number; // e.g. 0.05 (5%)
  relativeMde: number; // e.g. 0.10 (10% relative -> variantRate = 0.055)
  alpha: number; // e.g. 0.05 (significance level, usually 1 - confidenceLevel)
  power: number; // e.g. 0.80 (statistical power 1 - beta)
  isTwoSided: boolean;
  dailyTraffic?: number;
}

export interface SampleSizeResult {
  baselineRate: number;
  targetRate: number;
  absoluteMde: number;
  relativeMde: number;
  alpha: number;
  power: number;
  isTwoSided: boolean;
  sampleSizePerArm: number;
  totalSampleSize: number;
  daysNeeded: number | null;
  formula: string;
}

export interface SrmCheckInput {
  controlVisitors: number;
  variantVisitors: number;
  plannedControlRatio?: number; // default 0.50
}

export interface SrmCheckResult {
  controlVisitors: number;
  variantVisitors: number;
  totalVisitors: number;
  expectedControl: number;
  expectedVariant: number;
  chiSquare: number;
  pValue: number;
  isMismatch: boolean; // p < 0.001
  statusText: string;
}

/**
 * Calculates two-proportion z-test significance and confidence intervals.
 */
export function calculateAbTest(input: AbTestInput): AbTestResult {
  const {
    controlVisitors: nA,
    controlConversions: cA,
    variantVisitors: nB,
    variantConversions: cB,
    confidenceLevel = 0.95,
    isTwoSided = true,
  } = input;

  const warnings: string[] = [];

  if (nA <= 0 || nB <= 0) {
    throw new Error('Visitor counts must be greater than zero.');
  }
  if (cA < 0 || cB < 0) {
    throw new Error('Conversion counts cannot be negative.');
  }
  if (cA > nA) {
    throw new Error(`Control conversions (${cA}) cannot exceed visitors (${nA}).`);
  }
  if (cB > nB) {
    throw new Error(`Variant conversions (${cB}) cannot exceed visitors (${nB}).`);
  }

  // Small count checks (rule of thumb: np >= 5 and n(1-p) >= 5)
  if (cA < 5 || nA - cA < 5 || cB < 5 || nB - cB < 5) {
    warnings.push('Low conversion counts (< 5). Normal approximation may be inaccurate.');
  }

  const pA = cA / nA;
  const pB = cB / nB;
  const rateDifference = pB - pA;
  const relativeLift = pA > 0 ? (rateDifference / pA) * 100 : 0;

  // Pooled proportion for standard error under H0: pA = pB
  const pooledRate = (cA + cB) / (nA + nB);
  const pooledSE = Math.sqrt(pooledRate * (1 - pooledRate) * (1 / nA + 1 / nB));

  // Unpooled standard error for confidence intervals
  const unpooledSE = Math.sqrt((pA * (1 - pA)) / nA + (pB * (1 - pB)) / nB);

  // Z-Score
  const zScore = pooledSE > 0 ? (pB - pA) / pooledSE : 0;
  const absZ = Math.abs(zScore);

  // Two-sided and one-sided p-values
  const pValueTwoSided = 2 * (1 - normalCdf(absZ));
  const pValueOneSided = 1 - normalCdf(zScore);

  const pValue = isTwoSided ? pValueTwoSided : pValueOneSided;

  // Critical z for chosen confidence level
  const alpha = 1 - confidenceLevel;
  const criticalZ = isTwoSided ? normalInverse(1 - alpha / 2) : normalInverse(1 - alpha);

  const isSignificant = pValue < alpha;

  // Confidence interval for difference in proportions (unpooled)
  const marginOfError = criticalZ * unpooledSE;
  const ciLower = rateDifference - marginOfError;
  const ciUpper = rateDifference + marginOfError;

  // Observed retrospective power (two-sided)
  let observedPower = 0;
  if (unpooledSE > 0) {
    const zCrit = normalInverse(1 - alpha / 2);
    const delta = Math.abs(rateDifference) / unpooledSE;
    observedPower = (1 - normalCdf(zCrit - delta)) + normalCdf(-zCrit - delta);
    observedPower = Math.min(1, Math.max(0, observedPower));
  }

  const roundedLift = (Math.round(relativeLift * 10) / 10).toFixed(1);
  const roundedP = (Math.round(pValue * 1000) / 1000).toFixed(3);
  const roundedA = (pA * 100).toFixed(2);
  const roundedB = (pB * 100).toFixed(2);
  const confPct = Math.round(confidenceLevel * 100);

  let verdict = '';
  let explanation = '';

  if (isSignificant) {
    if (rateDifference > 0) {
      verdict = `B's conversion rate is ${roundedLift}% higher than A's (${roundedB}% vs ${roundedA}%).`;
      explanation = `${isTwoSided ? 'Two-sided' : 'One-sided'} p = ${roundedP}, below ${alpha.toFixed(2)}, so this positive difference is statistically significant at ${confPct}% confidence.`;
    } else {
      verdict = `B's conversion rate is ${Math.abs(Number(roundedLift))}% lower than A's (${roundedB}% vs ${roundedA}%).`;
      explanation = `${isTwoSided ? 'Two-sided' : 'One-sided'} p = ${roundedP}, below ${alpha.toFixed(2)}, so this negative drop is statistically significant at ${confPct}% confidence.`;
    }
  } else {
    verdict = `No statistically significant difference detected between A and B (${roundedA}% vs ${roundedB}%).`;
    explanation = `${isTwoSided ? 'Two-sided' : 'One-sided'} p = ${roundedP}, not below ${alpha.toFixed(2)}, so the difference is not statistically significant at ${confPct}% confidence. This does not prove A and B are equal: the test may be too small to detect a real difference.`;
  }

  // Plain-language meaning of the p-value (spec 04 §3.5). Never "X% chance B is better".
  const pctOfTime = pValue * 100;
  const pctText = pctOfTime < 0.1 ? 'less than 0.1%' : `about ${pctOfTime < 10 ? pctOfTime.toFixed(1) : pctOfTime.toFixed(0)}%`;
  const meaning = isTwoSided
    ? `If there were truly no difference, a gap this large (in either direction) would show up ${pctText} of the time.`
    : `If there were truly no difference, a lift this large would show up ${pctText} of the time.`;

  return {
    controlVisitors: nA,
    controlConversions: cA,
    controlRate: pA,
    variantVisitors: nB,
    variantConversions: cB,
    variantRate: pB,
    rateDifference,
    relativeLift,
    pooledRate,
    standardError: unpooledSE,
    pooledSE,
    zScore,
    pValueTwoSided,
    pValueOneSided,
    pValue,
    confidenceLevel,
    criticalZ,
    isSignificant,
    ciLower,
    ciUpper,
    observedPower,
    verdict,
    explanation,
    meaning,
    warnings,
  };
}

/**
 * Calculates required sample size per arm using the standard Fleiss / Evan Miller formula:
 * n = (z_{1-a/2} * sqrt(2 * p_bar * (1 - p_bar)) + z_{1-b} * sqrt(p1*(1-p1) + p2*(1-p2)))^2 / (p2 - p1)^2
 */
export function calculateSampleSize(input: SampleSizeInput): SampleSizeResult {
  const {
    baselineRate: p1,
    relativeMde,
    alpha = 0.05,
    power = 0.80,
    isTwoSided = true,
    dailyTraffic,
  } = input;

  if (p1 <= 0 || p1 >= 1) {
    throw new Error('Baseline rate must be between 0 and 1 (exclusive).');
  }
  if (relativeMde === 0) {
    throw new Error('Minimum detectable effect (MDE) cannot be 0.');
  }

  const p2 = p1 * (1 + relativeMde);
  if (p2 <= 0 || p2 >= 1) {
    throw new Error('Target conversion rate exceeds 0% or 100%.');
  }

  const pBar = (p1 + p2) / 2;
  const zAlpha = isTwoSided ? normalInverse(1 - alpha / 2) : normalInverse(1 - alpha);
  const zBeta = normalInverse(power);

  const term1 = zAlpha * Math.sqrt(2 * pBar * (1 - pBar));
  const term2 = zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2));
  const numerator = Math.pow(term1 + term2, 2);
  const denominator = Math.pow(p2 - p1, 2);

  const sampleSizePerArm = Math.ceil(numerator / denominator);
  const totalSampleSize = sampleSizePerArm * 2;

  let daysNeeded: number | null = null;
  if (dailyTraffic && dailyTraffic > 0) {
    daysNeeded = Math.ceil(totalSampleSize / dailyTraffic);
  }

  return {
    baselineRate: p1,
    targetRate: p2,
    absoluteMde: Math.abs(p2 - p1),
    relativeMde,
    alpha,
    power,
    isTwoSided,
    sampleSizePerArm,
    totalSampleSize,
    daysNeeded,
    formula: 'n = (z_{1-α/2}√(2p̄(1−p̄)) + z_{1−β}√(p₁(1−p₁) + p₂(1−p₂)))² / (p₂−p₁)²',
  };
}

/**
 * Checks for Sample Ratio Mismatch (SRM) using a Pearson chi-square goodness-of-fit test.
 */
export function checkSrm(input: SrmCheckInput): SrmCheckResult {
  const { controlVisitors: nA, variantVisitors: nB, plannedControlRatio = 0.50 } = input;
  const total = nA + nB;
  if (total <= 0) {
    throw new Error('Total visitors must be greater than zero.');
  }

  const expectedControl = total * plannedControlRatio;
  const expectedVariant = total * (1 - plannedControlRatio);

  const chiSquare =
    Math.pow(nA - expectedControl, 2) / expectedControl +
    Math.pow(nB - expectedVariant, 2) / expectedVariant;

  // For df = 1, chi-square p-value equals 2 * (1 - normalCdf(sqrt(chiSquare)))
  const pValue = 2 * (1 - normalCdf(Math.sqrt(chiSquare)));
  const isMismatch = pValue < 0.001; // SRM standard threshold

  let statusText = 'Normal Traffic Split';
  if (isMismatch) {
    statusText = 'Severe Sample Ratio Mismatch (SRM) detected! Investigate traffic allocation.';
  } else if (pValue < 0.05) {
    statusText = 'Slight split variance (p < 0.05). Continue monitoring.';
  }

  return {
    controlVisitors: nA,
    variantVisitors: nB,
    totalVisitors: total,
    expectedControl: Math.round(expectedControl),
    expectedVariant: Math.round(expectedVariant),
    chiSquare,
    pValue,
    isMismatch,
    statusText,
  };
}

/**
 * Multiple comparisons: tests control against up to 4 variants with Bonferroni or Šidák adjustments.
 */
export function calculateMultiVariantTest(
  control: VariantArmInput,
  variants: VariantArmInput[],
  nominalAlpha: number = 0.05,
  correction: 'bonferroni' | 'sidak' | 'none' = 'bonferroni'
): MultiVariantResult {
  const m = variants.length;
  if (m === 0) {
    throw new Error('At least one variant must be provided.');
  }

  let adjustedAlpha = nominalAlpha;
  if (correction === 'bonferroni') {
    adjustedAlpha = nominalAlpha / m;
  } else if (correction === 'sidak') {
    adjustedAlpha = 1 - Math.pow(1 - nominalAlpha, 1 / m);
  }

  const variantResults = variants.map((v) => {
    const res = calculateAbTest({
      controlVisitors: control.visitors,
      controlConversions: control.conversions,
      variantVisitors: v.visitors,
      variantConversions: v.conversions,
      confidenceLevel: 1 - adjustedAlpha,
      isTwoSided: true,
    });

    return {
      name: v.name,
      visitors: v.visitors,
      conversions: v.conversions,
      rate: res.variantRate,
      rateDifference: res.rateDifference,
      relativeLift: res.relativeLift,
      zScore: res.zScore,
      rawPValue: res.pValueTwoSided,
      adjustedPValue: Math.min(1, res.pValueTwoSided * (correction === 'bonferroni' ? m : 1)),
      isSignificant: res.pValueTwoSided < adjustedAlpha,
      ciLower: res.ciLower,
      ciUpper: res.ciUpper,
    };
  });

  return {
    control: {
      name: control.name,
      visitors: control.visitors,
      conversions: control.conversions,
      rate: control.conversions / control.visitors,
    },
    variants: variantResults,
    correctionMethod: correction,
    nominalAlpha,
    adjustedAlpha,
  };
}
