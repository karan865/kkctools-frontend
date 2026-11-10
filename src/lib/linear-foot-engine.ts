/**
 * Linear Foot and Square Feet <-> Linear Feet calculation engine for kkctools.com
 * Handles:
 * Mode 1: Linear Feet (Multi-row pieces with individual unit selection, quantity, waste %, optional price/lf)
 * Mode 2: Sq Ft <-> Linear Ft conversion with required material width (in, ft, cm, mm, m) and optional waste %
 */

export type LengthUnit = 'ft' | 'in' | 'ft-in' | 'yd' | 'm' | 'cm';
export type WidthUnit = 'in' | 'ft' | 'cm' | 'mm' | 'm';
export type ConversionDirection = 'sqft-to-linear' | 'linear-to-sqft';

export interface LinearPieceRow {
  id: string;
  length: number;
  inchesPart?: number; // only when unit === 'ft-in'
  unit: LengthUnit;
  quantity: number;
}

export interface LinearFeetInputs {
  rows: LinearPieceRow[];
  wastePercent: number; // default 0, range 0-100
  pricePerLinearFoot?: number; // optional, $ per linear ft
}

export interface LinearFeetResult {
  rawLinearFeet: number;
  totalLinearFeetWithWaste: number;
  totalInchesWithWaste: number;
  totalYardsWithWaste: number;
  totalMetersWithWaste: number;
  totalPieces: number;
  estimatedCost?: number;
  rowSubtotals: {
    id: string;
    feetPerPiece: number;
    subtotalFeet: number;
  }[];
  mathSteps: {
    step: string;
    formula: string;
    result: string;
  }[];
}

export interface SqFtLinearFtInputs {
  direction: ConversionDirection;
  value: number; // area (sq ft) or length (linear ft)
  widthValue: number;
  widthUnit: WidthUnit;
  wastePercent?: number; // only applies when direction === 'sqft-to-linear'
}

export interface SqFtLinearFtResult {
  convertedValueRaw: number;
  convertedValueWithWaste: number;
  widthInFeet: number;
  sqFtPerLinearFoot: number;
  linearFtPerSqFt: number;
  mathSteps: {
    step: string;
    formula: string;
    result: string;
  }[];
}

// 1 ft = 0.3048 m exact
// 1 m = 3.280839895 ft
export function lengthToFeet(length: number, unit: LengthUnit, inchesPart?: number): number {
  if (length < 0 || !Number.isFinite(length)) return 0;

  switch (unit) {
    case 'in':
      return length / 12;
    case 'ft-in':
      return length + (inchesPart && inchesPart > 0 ? inchesPart / 12 : 0);
    case 'yd':
      return length * 3;
    case 'm':
      return length / 0.3048;
    case 'cm':
      return length / 30.48;
    case 'ft':
    default:
      return length;
  }
}

export function widthToFeet(width: number, unit: WidthUnit): number {
  if (width <= 0 || !Number.isFinite(width)) return 0;

  switch (unit) {
    case 'in':
      return width / 12;
    case 'cm':
      return width / 30.48;
    case 'mm':
      return width / 304.8;
    case 'm':
      return width / 0.3048;
    case 'ft':
    default:
      return width;
  }
}

/**
 * Mode 1: Calculate Total Linear Feet
 */
export function calculateLinearFeet(inputs: LinearFeetInputs): LinearFeetResult {
  const waste = Math.max(0, Math.min(100, inputs.wastePercent || 0)) / 100;
  const wasteMultiplier = 1 + waste;

  let totalRawFeet = 0;
  let totalPieces = 0;
  const rowSubtotals: LinearFeetResult['rowSubtotals'] = [];
  const mathSteps: LinearFeetResult['mathSteps'] = [];

  inputs.rows.forEach((row, idx) => {
    if (row.length <= 0 || row.quantity <= 0) return;

    const feetPerPiece = lengthToFeet(row.length, row.unit, row.inchesPart);
    const subtotalFeet = feetPerPiece * row.quantity;
    totalRawFeet += subtotalFeet;
    totalPieces += row.quantity;

    rowSubtotals.push({
      id: row.id,
      feetPerPiece,
      subtotalFeet,
    });

    const displayLength =
      row.unit === 'ft-in'
        ? `${row.length} ft ${row.inchesPart || 0} in`
        : `${row.length} ${row.unit}`;

    mathSteps.push({
      step: `Row #${idx + 1}`,
      formula: `${displayLength} (${feetPerPiece.toFixed(4)} ft) × ${row.quantity} pcs`,
      result: `${subtotalFeet.toFixed(2)} linear ft`,
    });
  });

  const totalLinearFeetWithWaste = totalRawFeet * wasteMultiplier;
  const totalInchesWithWaste = totalLinearFeetWithWaste * 12;
  const totalYardsWithWaste = totalLinearFeetWithWaste / 3;
  const totalMetersWithWaste = totalLinearFeetWithWaste * 0.3048;

  mathSteps.push({
    step: 'Total Base Linear Feet',
    formula: 'Sum of all piece lengths',
    result: `${totalRawFeet.toFixed(2)} ft (${totalPieces} pieces)`,
  });

  if (waste > 0) {
    mathSteps.push({
      step: `Waste Allowance (${inputs.wastePercent}%)`,
      formula: `${totalRawFeet.toFixed(2)} ft × (1 + ${inputs.wastePercent}/100)`,
      result: `${totalLinearFeetWithWaste.toFixed(2)} linear ft`,
    });
  }

  let estimatedCost: number | undefined;
  if (inputs.pricePerLinearFoot && inputs.pricePerLinearFoot > 0) {
    estimatedCost = totalLinearFeetWithWaste * inputs.pricePerLinearFoot;
    mathSteps.push({
      step: 'Estimated Material Cost',
      formula: `${totalLinearFeetWithWaste.toFixed(2)} ft × $${inputs.pricePerLinearFoot.toFixed(2)}/ft`,
      result: `$${estimatedCost.toFixed(2)}`,
    });
  }

  return {
    rawLinearFeet: totalRawFeet,
    totalLinearFeetWithWaste,
    totalInchesWithWaste,
    totalYardsWithWaste,
    totalMetersWithWaste,
    totalPieces,
    estimatedCost,
    rowSubtotals,
    mathSteps,
  };
}

/**
 * Mode 2: Convert Sq Ft <-> Linear Ft with Material Width
 */
export function calculateSqFtLinearFt(inputs: SqFtLinearFtInputs): SqFtLinearFtResult | null {
  if (inputs.value <= 0 || inputs.widthValue <= 0) {
    return null;
  }

  const widthInFeet = widthToFeet(inputs.widthValue, inputs.widthUnit);
  if (widthInFeet <= 0) return null;

  const sqFtPerLinearFoot = widthInFeet; // 1 LF covers width(ft) sq ft
  const linearFtPerSqFt = 1 / widthInFeet;

  const mathSteps: SqFtLinearFtResult['mathSteps'] = [
    {
      step: 'Material Width Conversion',
      formula: `${inputs.widthValue} ${inputs.widthUnit} to feet`,
      result: `${widthInFeet.toFixed(4)} ft (${(12 * widthInFeet).toFixed(2)} in)`,
    },
  ];

  if (inputs.direction === 'sqft-to-linear') {
    const rawLinearFeet = inputs.value / widthInFeet;
    const waste = Math.max(0, Math.min(100, inputs.wastePercent || 0)) / 100;
    const withWaste = rawLinearFeet * (1 + waste);

    mathSteps.push(
      {
        step: 'Base Linear Feet',
        formula: `${inputs.value} sq ft ÷ ${widthInFeet.toFixed(4)} ft width`,
        result: `${rawLinearFeet.toFixed(2)} linear ft`,
      }
    );

    if (waste > 0) {
      mathSteps.push({
        step: `Waste Allowance (${inputs.wastePercent}%)`,
        formula: `${rawLinearFeet.toFixed(2)} ft × (1 + ${inputs.wastePercent}/100)`,
        result: `${withWaste.toFixed(2)} linear ft`,
      });
    }

    return {
      convertedValueRaw: rawLinearFeet,
      convertedValueWithWaste: withWaste,
      widthInFeet,
      sqFtPerLinearFoot,
      linearFtPerSqFt,
      mathSteps,
    };
  } else {
    // linear-to-sqft
    const rawSqFt = inputs.value * widthInFeet;
    mathSteps.push({
      step: 'Calculated Coverage Area',
      formula: `${inputs.value} linear ft × ${widthInFeet.toFixed(4)} ft width`,
      result: `${rawSqFt.toFixed(2)} sq ft`,
    });

    return {
      convertedValueRaw: rawSqFt,
      convertedValueWithWaste: rawSqFt,
      widthInFeet,
      sqFtPerLinearFoot,
      linearFtPerSqFt,
      mathSteps,
    };
  }
}

