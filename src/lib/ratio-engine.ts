/**
 * Ratio Calculation Engine
 * Pure mathematical functions for simplifying, solving, splitting,
 * generating equivalent ratios, and converting ratios to fractions/percentages.
 * Zero network calls, zero external dependencies.
 */

export interface ParsedTerm {
  original: string;
  value: number;
}

export interface SimplifyResult {
  simplifiedTerms: number[];
  multiplier: number;
  gcd: number;
  ratioString: string;
  oneToN: string;
  nToOne: string;
  steps: string[];
}

export interface SolveResult {
  xValue: number;
  stepExplanation: string;
  crossMultiplication?: string;
  scaleFactor?: number;
}

export interface SplitResult {
  total: number;
  shares: {
    term: number;
    shareRatio: number;
    amount: number;
    percentage: number;
  }[];
  sumTerms: number;
  unit: string;
  unroundedSum: number;
}

export interface EquivalentPair {
  multiplier: number;
  terms: number[];
}

export interface FractionPercentResult {
  partOfWhole: {
    term: number;
    fraction: string;
    decimal: number;
    percentage: number;
  }[];
  partToPart: {
    comparison: string;
    ratio: string;
    multiplier: number;
    percentage: number;
  };
}

/**
 * Parses a string number representation: supports integers, decimals (e.g. 1.5),
 * fractions (e.g. 1/2), and mixed numbers (e.g. 1 1/4).
 */
export function parseRatioTerm(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Mixed number "1 1/2"
  const mixedMatch = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10);
    const num = parseInt(mixedMatch[2], 10);
    const den = parseInt(mixedMatch[3], 10);
    if (den === 0) return null;
    return whole + num / den;
  }

  // Simple fraction "3/4"
  const fracMatch = trimmed.match(/^(\d+)\/(\d+)$/);
  if (fracMatch) {
    const num = parseInt(fracMatch[1], 10);
    const den = parseInt(fracMatch[2], 10);
    if (den === 0) return null;
    return num / den;
  }

  // Standard float / integer
  const val = Number(trimmed);
  if (isNaN(val) || !isFinite(val)) return null;
  return val;
}

/**
 * Greatest common divisor using Euclidean algorithm
 */
export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

/**
 * Least common multiple
 */
export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.round((a * b) / gcd(a, b)));
}

/**
 * GCD of an array of numbers
 */
export function gcdAll(arr: number[]): number {
  if (arr.length === 0) return 1;
  let current = Math.abs(Math.round(arr[0]));
  for (let i = 1; i < arr.length; i++) {
    current = gcd(current, Math.abs(Math.round(arr[i])));
  }
  return current || 1;
}

/**
 * Converts decimal/fractional terms into integers by scaling.
 * Returns the scaling multiplier and integer terms.
 */
export function termsToIntegers(rawTerms: number[]): { multiplier: number; intTerms: number[] } {
  // Count max decimal places (up to 4)
  let maxDecimals = 0;
  for (const t of rawTerms) {
    const s = t.toString();
    if (s.includes('.')) {
      const decCount = s.split('.')[1].length;
      maxDecimals = Math.max(maxDecimals, Math.min(decCount, 4));
    }
  }

  // Smallest whole multiplier (up to 10,000) that turns every term into a whole number.
  // This is the LCM of the terms' denominators, so 1/7 : 2/7 scales by 7 and ½ : ¾ by 4.
  const isWhole = (x: number) => Math.abs(x - Math.round(x)) <= 1e-9 * Math.max(1, Math.abs(x));
  let bestFracMult = 0;
  for (let d = 1; d <= 10000; d++) {
    if (rawTerms.every((t) => isWhole(t * d))) {
      bestFracMult = d;
      break;
    }
  }

  const decMult = Math.pow(10, maxDecimals);
  const mult = bestFracMult > 0 ? bestFracMult : decMult;

  const intTerms = rawTerms.map((t) => Math.round(t * mult));
  return { multiplier: mult, intTerms };
}

/**
 * Simplifies an N-part ratio.
 */
export function simplifyRatio(terms: number[]): SimplifyResult | null {
  if (terms.length < 2) return null;
  if (terms.some((t) => t <= 0 || isNaN(t))) return null;

  const steps: string[] = [];
  const { multiplier, intTerms } = termsToIntegers(terms);

  if (multiplier > 1) {
    steps.push(`Multiplied all terms by ${multiplier} to convert to whole numbers: ${intTerms.join(' : ')}`);
  }

  const factor = gcdAll(intTerms);
  const simplified = intTerms.map((t) => t / factor);

  if (factor > 1) {
    steps.push(`Found Greatest Common Divisor (GCD) = ${factor}. Divided each term by ${factor}: ${simplified.join(' : ')}`);
  } else if (multiplier === 1) {
    steps.push(`The terms already share no common factor greater than 1: already in simplest form.`);
  }

  const first = simplified[0];
  const last = simplified[simplified.length - 1];

  const oneToN = simplified.map((t) => (t / first >= 1 ? (t / first).toFixed(2).replace(/\.00$/, '') : (t / first).toFixed(3))).join(' : ');
  const nToOne = simplified.map((t) => (t / last >= 1 ? (t / last).toFixed(2).replace(/\.00$/, '') : (t / last).toFixed(3))).join(' : ');

  return {
    simplifiedTerms: simplified,
    multiplier,
    gcd: factor,
    ratioString: simplified.join(' : '),
    oneToN,
    nToOne,
    steps,
  };
}

/**
 * Solves a 2-part proportion: A / B = C / D, where exactly one value is unknown (represented as null/NaN).
 * Or N-part proportion where one position is unknown.
 */
export function solveProportion(
  ratio1: (number | null)[],
  ratio2: (number | null)[]
): SolveResult | null {
  if (ratio1.length !== ratio2.length || ratio1.length < 2) return null;

  // Count unknowns
  let unknownPos: { ratio: 1 | 2; index: number } | null = null;
  let unknownCount = 0;

  for (let i = 0; i < ratio1.length; i++) {
    if (ratio1[i] === null || isNaN(ratio1[i]!)) {
      unknownCount++;
      unknownPos = { ratio: 1, index: i };
    }
  }
  for (let i = 0; i < ratio2.length; i++) {
    if (ratio2[i] === null || isNaN(ratio2[i]!)) {
      unknownCount++;
      unknownPos = { ratio: 2, index: i };
    }
  }

  if (unknownCount !== 1 || !unknownPos) return null;

  // Find a reference index that is known in both ratios
  let refIndex = -1;
  for (let i = 0; i < ratio1.length; i++) {
    if (
      ratio1[i] !== null &&
      !isNaN(ratio1[i]!) &&
      ratio2[i] !== null &&
      !isNaN(ratio2[i]!)
    ) {
      refIndex = i;
      break;
    }
  }

  if (refIndex === -1) return null;

  const val1 = ratio1[refIndex]!;
  const val2 = ratio2[refIndex]!;
  if (val1 <= 0 || val2 <= 0) return null;

  const scale = val2 / val1;

  if (unknownPos.ratio === 2) {
    const knownIn1 = ratio1[unknownPos.index]!;
    if (knownIn1 <= 0) return null;
    const x = knownIn1 * scale;
    const isClassic2Part = ratio1.length === 2;

    let crossMultiplication: string | undefined;
    let stepExplanation = '';

    if (isClassic2Part && unknownPos.index === 1 && refIndex === 0) {
      // a / b = c / x -> x = (b * c) / a
      const a = ratio1[0]!;
      const b = ratio1[1]!;
      const c = ratio2[0]!;
      crossMultiplication = `${a} × x = ${b} × ${c} → ${a}x = ${b * c} → x = ${b * c} / ${a} = ${x}`;
      stepExplanation = `Using cross-multiplication: multiply ${b} by ${c} and divide by ${a} to get x = ${x}.`;
    } else {
      stepExplanation = `Scale factor = ${val2} / ${val1} = ${scale}. Unknown x = ${knownIn1} × ${scale} = ${x}.`;
    }

    return {
      xValue: x,
      stepExplanation,
      crossMultiplication,
      scaleFactor: scale,
    };
  } else {
    // Unknown is in ratio 1
    const knownIn2 = ratio2[unknownPos.index]!;
    if (knownIn2 <= 0) return null;
    const x = knownIn2 / scale;
    return {
      xValue: x,
      stepExplanation: `Scale factor = ${val2} / ${val1} = ${scale}. Unknown x = ${knownIn2} / ${scale} = ${x}.`,
      scaleFactor: scale,
    };
  }
}

/**
 * Splits a total amount according to ratio terms.
 * e.g. 60 kg split 1:2:3 -> 10, 20, 30 kg.
 */
export function splitTotalByRatio(
  total: number,
  terms: number[],
  unit: string = ''
): SplitResult | null {
  if (total <= 0 || terms.length < 2 || terms.some((t) => t <= 0 || isNaN(t))) {
    return null;
  }

  const sumTerms = terms.reduce((acc, t) => acc + t, 0);
  if (sumTerms <= 0) return null;

  let unroundedSum = 0;
  const shares = terms.map((term) => {
    const shareRatio = term / sumTerms;
    const amount = total * shareRatio;
    unroundedSum += amount;
    const percentage = shareRatio * 100;
    return {
      term,
      shareRatio,
      amount: Math.round(amount * 1000) / 1000,
      percentage: Math.round(percentage * 100) / 100,
    };
  });

  return {
    total,
    shares,
    sumTerms,
    unit: unit.trim(),
    unroundedSum,
  };
}

/**
 * Generates equivalent ratios for multipliers from minMult to maxMult.
 */
export function generateEquivalents(terms: number[], maxMult: number = 10): EquivalentPair[] {
  const simplified = simplifyRatio(terms);
  const base = simplified ? simplified.simplifiedTerms : terms;

  const pairs: EquivalentPair[] = [];
  for (let m = 1; m <= maxMult; m++) {
    pairs.push({
      multiplier: m,
      terms: base.map((t) => t * m),
    });
  }
  return pairs;
}

/**
 * Checks whether two ratios are mathematically equivalent.
 */
export function areRatiosEquivalent(r1: number[], r2: number[]): boolean {
  if (r1.length !== r2.length || r1.length < 2) return false;
  if (r1.some((t) => t <= 0) || r2.some((t) => t <= 0)) return false;

  const s1 = simplifyRatio(r1);
  const s2 = simplifyRatio(r2);
  if (!s1 || !s2) return false;

  return s1.simplifiedTerms.every((t, i) => t === s2.simplifiedTerms[i]);
}

/**
 * Converts a 2-part ratio into both fraction/percentage meanings:
 * 1) Part of whole: term / (sum of all terms)
 * 2) Part to part: term 1 / term 2
 */
export function ratioToFractionsAndPercentages(terms: number[]): FractionPercentResult | null {
  if (terms.length < 2 || terms.some((t) => t <= 0 || isNaN(t))) return null;

  const sum = terms.reduce((acc, t) => acc + t, 0);
  // Fractions are reduced on whole-number terms so 1.5 : 2.5 gives 3/8 and 5/8.
  const { intTerms } = termsToIntegers(terms);
  const intSum = intTerms.reduce((acc, t) => acc + t, 0);

  const partOfWhole = terms.map((term, i) => {
    const decimal = term / sum;
    const percentage = decimal * 100;
    const g = gcd(intTerms[i], intSum) || 1;
    const fraction = `${intTerms[i] / g}/${intSum / g}`;
    return {
      term,
      fraction,
      decimal: Math.round(decimal * 10000) / 10000,
      percentage: Math.round(percentage * 100) / 100,
    };
  });

  const partToPartMult = terms[0] / terms[1];
  const partToPart = {
    comparison: `Term 1 compared to Term 2 (${terms[0]} / ${terms[1]})`,
    ratio: `${terms[0]} : ${terms[1]}`,
    multiplier: Math.round(partToPartMult * 10000) / 10000,
    percentage: Math.round(partToPartMult * 10000) / 100,
  };

  return {
    partOfWhole,
    partToPart,
  };
}
