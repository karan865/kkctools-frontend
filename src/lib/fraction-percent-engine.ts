/**
 * Fraction and Score to Percentage Engine.
 * Supports:
 * - Parsing fractions (a/b, mixed w a/b, improper, decimal strings)
 * - Decimal conversion with repeating repetend detection (e.g. 1/3 -> 33.3̅%)
 * - Greatest Common Divisor (GCD) fraction reduction
 * - Test score calculations with configurable half-open grade boundaries and points to next grade
 * - Percentage of a number operations (P% of X, X is what % of Y, whole from part, add/subtract %)
 * - Static reference tables generation
 * Pure client-side calculations. Zero network.
 */

export interface ParsedFraction {
  numerator: number;
  denominator: number;
}

export interface FractionResult {
  numerator: number;
  denominator: number;
  decimal: number;
  percent: number;
  simplifiedNum: number;
  simplifiedDen: number;
  isRepeating: boolean;
  repeatString: string; // e.g. "33.3̅%"
  formattedPercent: string; // e.g. "33.33%" or "80%"
  formattedDecimal: string;
}

export interface GradeBoundary {
  letter: string;
  minPercent: number; // lower bound inclusive: [minPercent, nextMinPercent)
}

export interface ScoreResult {
  earned: number;
  total: number;
  bonus: number;
  effectiveEarned: number;
  percent: number;
  letterGrade: string;
  pointsToNextGrade: number;
  nextGradeLetter: string | null;
}

export const DEFAULT_STANDARD_GRADE_SCALE: GradeBoundary[] = [
  { letter: 'A', minPercent: 90 },
  { letter: 'B', minPercent: 80 },
  { letter: 'C', minPercent: 70 },
  { letter: 'D', minPercent: 60 },
  { letter: 'F', minPercent: 0 },
];

export const DEFAULT_PLUS_MINUS_GRADE_SCALE: GradeBoundary[] = [
  { letter: 'A+', minPercent: 97 },
  { letter: 'A', minPercent: 93 },
  { letter: 'A−', minPercent: 90 },
  { letter: 'B+', minPercent: 87 },
  { letter: 'B', minPercent: 83 },
  { letter: 'B−', minPercent: 80 },
  { letter: 'C+', minPercent: 77 },
  { letter: 'C', minPercent: 73 },
  { letter: 'C−', minPercent: 70 },
  { letter: 'D+', minPercent: 67 },
  { letter: 'D', minPercent: 63 },
  { letter: 'D−', minPercent: 60 },
  { letter: 'F', minPercent: 0 },
];

/**
 * Calculates Greatest Common Divisor (Euclidean algorithm).
 */
export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

/**
 * Parses user fraction input string:
 * - "4/5" -> { numerator: 4, denominator: 5 }
 * - "1 1/4" -> { numerator: 5, denominator: 4 }
 * - "4 3/4" -> { numerator: 19, denominator: 4 }
 * - "0.375" -> { numerator: 3, denominator: 8 }
 * - "8" -> { numerator: 8, denominator: 1 }
 */
export function parseFractionInput(input: string): ParsedFraction | null {
  const clean = input.trim();
  if (!clean) return null;

  // Mixed number pattern: e.g. "1 1/4", "-2 3/5"
  const mixedMatch = clean.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10);
    const num = parseInt(mixedMatch[2], 10);
    const den = parseInt(mixedMatch[3], 10);
    if (den === 0) return null;
    const sign = whole < 0 ? -1 : 1;
    const totalNum = sign * (Math.abs(whole) * den + num);
    return { numerator: totalNum, denominator: den };
  }

  // Simple fraction pattern: e.g. "4/5", "16 / 20"
  const fracMatch = clean.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
  if (fracMatch) {
    const num = parseInt(fracMatch[1], 10);
    const den = parseInt(fracMatch[2], 10);
    if (den === 0) return null;
    return { numerator: num, denominator: den };
  }

  // Decimal number pattern: e.g. "0.375", "1.25"
  if (clean.includes('.')) {
    const val = parseFloat(clean);
    if (isNaN(val)) return null;
    const parts = clean.split('.');
    const decPlaces = parts[1] ? parts[1].length : 0;
    const den = Math.pow(10, decPlaces);
    const num = Math.round(val * den);
    const g = gcd(num, den);
    return { numerator: num / g, denominator: den / g };
  }

  // Single integer: e.g. "5"
  const intVal = parseInt(clean, 10);
  if (!isNaN(intVal)) {
    return { numerator: intVal, denominator: 1 };
  }

  return null;
}

/**
 * Checks whether a fraction in lowest terms produces a repeating decimal in base 10.
 * A reduced fraction a/b terminates in base 10 iff the prime factors of b are only 2 and/or 5.
 */
export function isRepeatingDenominator(den: number): boolean {
  let d = Math.abs(Math.round(den));
  if (d === 0) return false;
  while (d % 2 === 0) d /= 2;
  while (d % 5 === 0) d /= 5;
  return d !== 1;
}

/**
 * Writes num/den as a percentage with the repeating block marked by a combining
 * overline on each repeating digit, using exact integer long division with
 * remainder-cycle detection. Returns null when the cycle is longer than
 * `maxCycle` digits (the caller then shows a rounded value with an ellipsis).
 */
export function repeatingPercentString(num: number, den: number, maxCycle = 6): string | null {
  if (den === 0 || !Number.isInteger(num) || !Number.isInteger(den)) return null;
  const negative = num < 0 !== den < 0 && num !== 0;
  const n = Math.abs(num) * 100;
  const d = Math.abs(den);
  const whole = Math.floor(n / d);
  let rem = n % d;
  if (rem === 0) return `${negative ? '-' : ''}${whole}%`;

  const seen = new Map<number, number>();
  const digits: number[] = [];
  while (rem !== 0 && !seen.has(rem)) {
    if (digits.length > 60) return null;
    seen.set(rem, digits.length);
    rem *= 10;
    digits.push(Math.floor(rem / d));
    rem %= d;
  }
  if (rem === 0) return `${negative ? '-' : ''}${whole}.${digits.join('')}%`;

  const start = seen.get(rem)!;
  const pre = digits.slice(0, start).join('');
  const cycle = digits.slice(start);
  if (cycle.length > maxCycle) return null;
  const marked = cycle.map((dg) => `${dg}̅`).join('');
  return `${negative ? '-' : ''}${whole}.${pre}${marked}%`;
}

/**
 * Converts fraction to percentage, reduced form, and repeat status.
 */
export function calculateFractionToPercent(
  num: number,
  den: number,
  decimals: number = 2
): FractionResult | null {
  if (den === 0) return null;

  const g = gcd(num, den);
  const sNum = num / g;
  const sDen = den / g;

  const decimal = num / den;
  const percent = decimal * 100;
  const repeating = isRepeatingDenominator(sDen);

  // Repeat string creation (e.g. 1/3 -> 33.3̅%)
  let repeatString = '';
  if (repeating) {
    // Exact long division marks the true repeating block (2/3 -> 66.6̅%, 1/22 -> 4.5̅4̅%).
    const exact = repeatingPercentString(num, den);
    // Cycles longer than 6 digits (e.g. 1/17) fall back to a rounded value.
    repeatString = exact ?? `${percent.toFixed(decimals)}\u2026%`;
  } else {
    repeatString = `${parseFloat(percent.toFixed(decimals))}%`;
  }

  return {
    numerator: num,
    denominator: den,
    decimal,
    percent,
    simplifiedNum: sNum,
    simplifiedDen: sDen,
    isRepeating: repeating,
    repeatString,
    formattedPercent: percent.toFixed(decimals) + '%',
    formattedDecimal: decimal.toFixed(decimals + 2),
  };
}

/**
 * Calculates test score, percent, letter grade, and points required for next grade.
 */
export function calculateScore(
  rawInput: number,
  total: number,
  isWrongCount: boolean = false,
  bonus: number = 0,
  scale: GradeBoundary[] = DEFAULT_STANDARD_GRADE_SCALE
): ScoreResult | null {
  if (total <= 0) return null;

  const earned = isWrongCount ? total - rawInput : rawInput;
  const effectiveEarned = earned + (bonus || 0);
  const percent = (effectiveEarned / total) * 100;

  // Sort scale descending by minPercent
  const sorted = [...scale].sort((a, b) => b.minPercent - a.minPercent);

  let letterGrade = sorted[sorted.length - 1].letter;
  let nextGradeLetter: string | null = null;
  let pointsToNextGrade = 0;

  for (let i = 0; i < sorted.length; i++) {
    if (percent >= sorted[i].minPercent) {
      letterGrade = sorted[i].letter;
      if (i > 0) {
        nextGradeLetter = sorted[i - 1].letter;
        const targetPercent = sorted[i - 1].minPercent;
        const targetPoints = Math.ceil((targetPercent * total) / 100);
        pointsToNextGrade = Math.max(0, targetPoints - effectiveEarned);
      }
      break;
    }
  }

  return {
    earned,
    total,
    bonus,
    effectiveEarned,
    percent,
    letterGrade,
    pointsToNextGrade,
    nextGradeLetter,
  };
}

/**
 * Percent of a number helpers
 */
export function percentOf(percent: number, whole: number): number {
  return (whole * percent) / 100;
}

export function whatPercentIs(part: number, whole: number): number | null {
  if (whole === 0) return null;
  return (part / whole) * 100;
}

export function wholeFromPartAndPercent(part: number, percent: number): number | null {
  if (percent === 0) return null;
  return part / (percent / 100);
}

export function addPercent(value: number, percent: number): number {
  return value * (1 + percent / 100);
}

export function subtractPercent(value: number, percent: number): number {
  return value * (1 - percent / 100);
}

/**
 * Generate standard reference table for common denominators
 */
export function generateCommonFractionsTable(): Array<{
  fraction: string;
  decimal: string;
  percent: string;
}> {
  const fractions: Array<[number, number]> = [
    [1, 2], [1, 3], [2, 3], [1, 4], [3, 4],
    [1, 5], [2, 5], [3, 5], [4, 5],
    [1, 6], [5, 6], [1, 8], [3, 8], [5, 8], [7, 8],
    [1, 10], [3, 10], [7, 10], [9, 10],
    [1, 12], [5, 12], [7, 12], [11, 12],
    [1, 15], [11, 15], [13, 15],
    [1, 16], [3, 16], [5, 16], [7, 16],
    [1, 20], [3, 20], [17, 20],
    [1, 25], [4, 25], [21, 25],
    [1, 32], [1, 50], [1, 100],
  ];

  return fractions.map(([num, den]) => {
    const res = calculateFractionToPercent(num, den, 2)!;
    return {
      fraction: `${num}/${den}`,
      decimal: res.decimal.toFixed(4).replace(/\.?0+$/, ''),
      percent: res.isRepeating ? res.repeatString : `${res.percent}%`,
    };
  });
}
