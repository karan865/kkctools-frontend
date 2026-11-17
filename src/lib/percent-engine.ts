/**
 * Percentage Engine — Pure functions for percentage change, difference,
 * points, reverse math, list aggregation, and spreadsheet formulas.
 *
 * Rules:
 * - Pure functions only. Zero I/O, zero network, zero Date.now().
 * - Returns null (not NaN or Infinity) for undefined mathematical cases (divide by zero).
 * - Normalises -0 to 0.
 * - Precision preserved; display rounding handled by UI formatters.
 */

export type ExcelMode =
  | 'change'
  | 'difference'
  | 'increaseBy'
  | 'original'
  | 'pctOf'
  | 'whatPct';

export interface PercentPointsResult {
  points: number;
  percent: number | null;
}

export interface ListPair {
  oldVal: number;
  newVal: number;
  label?: string;
}

export interface ListRowResult {
  oldVal: number;
  newVal: number;
  label?: string;
  absChange: number;
  pctChange: number | null;
}

export interface ListAggregationResult {
  rows: ListRowResult[];
  totalOld: number;
  totalNew: number;
  totalAbsChange: number;
  totalPctChange: number | null;
  averagePctChange: number | null;
}

export interface ExcelFormulaResult {
  formula: string;
  syntax: string;
  note: string;
}

/**
 * Normalises floating point jitter (e.g. 114.99999999999999 -> 115) and -0 to +0.
 */
function cleanNumber(n: number): number {
  if (Object.is(n, -0)) return 0;
  if (!Number.isFinite(n)) return n;
  // Round to 12 decimal places to eliminate IEEE-754 precision artifacts while preserving true precision
  const rounded = Math.round(n * 1e12) / 1e12;
  return Object.is(rounded, -0) ? 0 : rounded;
}

/**
 * Percentage Change (Signed)
 * Formula: ((newVal - oldVal) / |oldVal|) * 100
 * Returns null if oldVal === 0 (mathematically undefined).
 */
export function pctChange(oldVal: number, newVal: number): number | null {
  if (oldVal === 0 || !Number.isFinite(oldVal) || !Number.isFinite(newVal)) {
    return null;
  }
  const result = ((newVal - oldVal) / Math.abs(oldVal)) * 100;
  return cleanNumber(result);
}

/**
 * Percentage Difference (Unsigned / Symmetric between two positive values)
 * Formula: (|a - b| / ((a + b) / 2)) * 100
 * Returns null if (a + b) === 0 or undefined.
 */
export function pctDifference(a: number, b: number): number | null {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return null;
  }
  const denominator = (Math.abs(a) + Math.abs(b)) / 2;
  if (denominator === 0) {
    return null;
  }
  const result = (Math.abs(a - b) / denominator) * 100;
  return cleanNumber(result);
}

/**
 * Apply Percentage (Increase or Decrease by p%)
 * Formula: x * (1 + p / 100)
 * Note: p can be negative for a decrease (e.g. -20 for a 20% discount).
 */
export function applyPct(x: number, p: number): number {
  if (!Number.isFinite(x) || !Number.isFinite(p)) {
    return 0;
  }
  const result = x * (1 + p / 100);
  return cleanNumber(result);
}

/**
 * Reverse Percentage (Find the Original Value)
 * If a new value after a p% change is newVal, what was the original?
 * Formula: newVal / (1 + p / 100)
 * Returns null if p === -100 (complete wipeout / division by zero).
 */
export function reversePct(newVal: number, p: number): number | null {
  if (!Number.isFinite(newVal) || !Number.isFinite(p) || p === -100) {
    return null;
  }
  const factor = 1 + p / 100;
  if (factor === 0) {
    return null;
  }
  const result = newVal / factor;
  return cleanNumber(result);
}

/**
 * Percentage Of: What is p% of y?
 * Formula: (p / 100) * y
 */
export function pctOf(p: number, y: number): number {
  if (!Number.isFinite(p) || !Number.isFinite(y)) {
    return 0;
  }
  const result = (p / 100) * y;
  return cleanNumber(result);
}

/**
 * What Percentage: x is what percentage of y?
 * Formula: (x / y) * 100
 * Returns null if y === 0.
 */
export function whatPct(x: number, y: number): number | null {
  if (y === 0 || !Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }
  const result = (x / y) * 100;
  return cleanNumber(result);
}

/**
 * Percentage Points vs Percentage Difference
 * When a rate or interest moves from a% to b%:
 * - Points difference = b - a (in percentage points, pp)
 * - Relative percent change = pctChange(a, b)
 */
export function ppDifference(a: number, b: number): PercentPointsResult {
  const points = cleanNumber(b - a);
  const percent = pctChange(a, b);
  return { points, percent };
}

/**
 * List Mode Aggregation
 * Compares multiple old -> new pairs, providing row-by-row changes,
 * the arithmetic average of individual percentage changes, and the true aggregate change.
 */
export function listChanges(pairs: ListPair[]): ListAggregationResult {
  if (!pairs || pairs.length === 0) {
    return {
      rows: [],
      totalOld: 0,
      totalNew: 0,
      totalAbsChange: 0,
      totalPctChange: null,
      averagePctChange: null,
    };
  }

  let sumOld = 0;
  let sumNew = 0;
  let validPctSum = 0;
  let validPctCount = 0;

  const rows: ListRowResult[] = pairs.map((pair) => {
    const o = Number.isFinite(pair.oldVal) ? pair.oldVal : 0;
    const n = Number.isFinite(pair.newVal) ? pair.newVal : 0;
    const absChange = cleanNumber(n - o);
    const change = pctChange(o, n);

    sumOld += o;
    sumNew += n;

    if (change !== null) {
      validPctSum += change;
      validPctCount += 1;
    }

    return {
      oldVal: o,
      newVal: n,
      label: pair.label,
      absChange,
      pctChange: change,
    };
  });

  const totalAbsChange = cleanNumber(sumNew - sumOld);
  const totalPctChange = pctChange(sumOld, sumNew);
  const averagePctChange = validPctCount > 0 ? cleanNumber(validPctSum / validPctCount) : null;

  return {
    rows,
    totalOld: cleanNumber(sumOld),
    totalNew: cleanNumber(sumNew),
    totalAbsChange,
    totalPctChange,
    averagePctChange,
  };
}

/**
 * Excel / Google Sheets Formula Generator
 * Produces copy-pasteable formulas for spreadsheet cells with proper Excel syntax.
 * Note: In Excel/Sheets, cells formatted with the "Percentage" format automatically multiply by 100.
 */
export function excelFormula(
  mode: ExcelMode,
  cells: { oldCell?: string; newCell?: string } = {}
): ExcelFormulaResult {
  const o = (cells.oldCell || 'A2').trim().toUpperCase() || 'A2';
  const n = (cells.newCell || 'B2').trim().toUpperCase() || 'B2';

  switch (mode) {
    case 'change':
      return {
        formula: `=(${n}-${o})/ABS(${o})`,
        syntax: `=(${n} - ${o}) / ABS(${o})`,
        note: 'Format the formula cell as Percentage (Ctrl+Shift+%). Do NOT multiply by 100 in the formula, or Excel will display it 100× too large.',
      };
    case 'difference':
      return {
        formula: `=ABS(${o}-${n})/AVERAGE(${o},${n})`,
        syntax: `=ABS(${o} - ${n}) / AVERAGE(${o}, ${n})`,
        note: 'Format the formula cell as Percentage. Computes the symmetric relative difference between two values regardless of order.',
      };
    case 'increaseBy':
      return {
        formula: `=${o}*(1+${n})`,
        syntax: `=${o} * (1 + ${n})`,
        note: `Assumes ${n} is formatted as a percentage (e.g. 15%). If ${n} is an integer like 15, use =${o}*(1+${n}/100).`,
      };
    case 'original':
      return {
        formula: `=${n}/(1+${o})`,
        syntax: `=${n} / (1 + ${o})`,
        note: `Where ${n} is the final value and ${o} is the % change (formatted as %). If ${o} is an integer like 20, use =${n}/(1+${o}/100).`,
      };
    case 'pctOf':
      return {
        formula: `=${o}*${n}`,
        syntax: `=${o} * ${n}`,
        note: `Where ${o} is the percentage rate (formatted as % e.g. 25%) and ${n} is the number. If ${o} is 25, use =(${o}/100)*${n}.`,
      };
    case 'whatPct':
      return {
        formula: `=${o}/${n}`,
        syntax: `=${o} / ${n}`,
        note: `Format the formula cell as Percentage. Divides part (${o}) by whole (${n}).`,
      };
  }
}

/**
 * Format helper for numbers (preserves decimals with clean presentation)
 */
export function formatNumber(val: number, decimals: number = 2): string {
  if (!Number.isFinite(val)) return '0';
  return val.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format helper for percentage display
 */
export function formatPct(val: number | null, decimals: number = 2, showSign: boolean = true): string {
  if (val === null || !Number.isFinite(val)) {
    return 'Undefined';
  }
  const clean = cleanNumber(val);
  const formatted = Math.abs(clean).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (clean === 0) {
    return `0.${'0'.repeat(decimals)}%`;
  }

  const sign = clean > 0 ? (showSign ? '+' : '') : '-';
  return `${sign}${formatted}%`;
}
