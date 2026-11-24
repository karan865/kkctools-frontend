/**
 * Metric Conversion & Unit Calculation Engine
 * 
 * Standards & Exact Definitions:
 * - NIST Special Publication 811 (Guide for the Use of the International System of Units, SI)
 * - NIST Handbook 44 (Specifications, Tolerances, and Other Technical Requirements for Weighing and Measuring Devices)
 * - BIPM SI Brochure (9th edition, 2019 redefinition of SI base units via physical constants)
 * 
 * Exact Definitional Factors:
 * - Length: 1 in = 0.0254 m, 1 ft = 0.3048 m, 1 yd = 0.9144 m, 1 mi = 1,609.344 m, 1 nmi = 1,852 m
 * - Mass: 1 lb = 0.45359237 kg (1959 International Yard and Pound Agreement), 1 oz = 28.349523125 g
 * - Volume: 1 US gal = 231 in³ = 3.785411784 L, 1 imp gal = 4.54609 L, 1 US fl oz = 29.5735295625 mL
 * - Area: 1 sq ft = 0.09290304 m², 1 acre = 43,560 sq ft = 4,046.8564224 m²
 * - Temperature: [°C] = ([°F] − 32) × 5/9, [K] = [°C] + 273.15. Difference factor = 1.8 °F/°C.
 * 
 * Zero external network calls. Pure functions.
 */

export type UnitCategory = 'length' | 'weight' | 'volume' | 'area' | 'temperature' | 'speed';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  category: UnitCategory;
  toBaseFactor: number; // multiplied by value to get base SI unit (m, kg, L, m², m/s)
  system: 'metric' | 'us' | 'imperial' | 'other';
  isExact: boolean;
}

export const LENGTH_UNITS: Record<string, UnitDefinition> = {
  mm: { id: 'mm', name: 'Millimetres', symbol: 'mm', category: 'length', toBaseFactor: 0.001, system: 'metric', isExact: true },
  cm: { id: 'cm', name: 'Centimetres', symbol: 'cm', category: 'length', toBaseFactor: 0.01, system: 'metric', isExact: true },
  m: { id: 'm', name: 'Metres', symbol: 'm', category: 'length', toBaseFactor: 1.0, system: 'metric', isExact: true },
  km: { id: 'km', name: 'Kilometres', symbol: 'km', category: 'length', toBaseFactor: 1000.0, system: 'metric', isExact: true },
  in: { id: 'in', name: 'Inches', symbol: 'in', category: 'length', toBaseFactor: 0.0254, system: 'us', isExact: true },
  ft: { id: 'ft', name: 'Feet', symbol: 'ft', category: 'length', toBaseFactor: 0.3048, system: 'us', isExact: true },
  yd: { id: 'yd', name: 'Yards', symbol: 'yd', category: 'length', toBaseFactor: 0.9144, system: 'us', isExact: true },
  mi: { id: 'mi', name: 'Miles', symbol: 'mi', category: 'length', toBaseFactor: 1609.344, system: 'us', isExact: true },
  nmi: { id: 'nmi', name: 'Nautical Miles', symbol: 'NM', category: 'length', toBaseFactor: 1852.0, system: 'other', isExact: true },
};

export const WEIGHT_UNITS: Record<string, UnitDefinition> = {
  mg: { id: 'mg', name: 'Milligrams', symbol: 'mg', category: 'weight', toBaseFactor: 0.000001, system: 'metric', isExact: true },
  g: { id: 'g', name: 'Grams', symbol: 'g', category: 'weight', toBaseFactor: 0.001, system: 'metric', isExact: true },
  kg: { id: 'kg', name: 'Kilograms', symbol: 'kg', category: 'weight', toBaseFactor: 1.0, system: 'metric', isExact: true },
  tonne: { id: 'tonne', name: 'Metric Tonnes', symbol: 't', category: 'weight', toBaseFactor: 1000.0, system: 'metric', isExact: true },
  oz: { id: 'oz', name: 'Ounces (avdp)', symbol: 'oz', category: 'weight', toBaseFactor: 0.028349523125, system: 'us', isExact: true },
  lb: { id: 'lb', name: 'Pounds (avdp)', symbol: 'lb', category: 'weight', toBaseFactor: 0.45359237, system: 'us', isExact: true },
  st: { id: 'st', name: 'Stone (UK)', symbol: 'st', category: 'weight', toBaseFactor: 6.35029318, system: 'imperial', isExact: true },
  short_ton: { id: 'short_ton', name: 'Short Tons (US, 2000 lb)', symbol: 'ton', category: 'weight', toBaseFactor: 907.18474, system: 'us', isExact: true },
  long_ton: { id: 'long_ton', name: 'Long Tons (UK, 2240 lb)', symbol: 'long ton', category: 'weight', toBaseFactor: 1016.0469088, system: 'imperial', isExact: true },
};

export const VOLUME_UNITS: Record<string, UnitDefinition> = {
  ml: { id: 'ml', name: 'Millilitres', symbol: 'mL', category: 'volume', toBaseFactor: 0.001, system: 'metric', isExact: true },
  l: { id: 'l', name: 'Litres', symbol: 'L', category: 'volume', toBaseFactor: 1.0, system: 'metric', isExact: true },
  m3: { id: 'm3', name: 'Cubic Metres', symbol: 'm³', category: 'volume', toBaseFactor: 1000.0, system: 'metric', isExact: true },
  us_floz: { id: 'us_floz', name: 'US Fluid Ounces', symbol: 'fl oz', category: 'volume', toBaseFactor: 0.0295735295625, system: 'us', isExact: true },
  imp_floz: { id: 'imp_floz', name: 'Imperial Fluid Ounces', symbol: 'fl oz (imp)', category: 'volume', toBaseFactor: 0.0284130625, system: 'imperial', isExact: true },
  us_cup: { id: 'us_cup', name: 'US Cups (8 fl oz)', symbol: 'cup', category: 'volume', toBaseFactor: 0.2365882365, system: 'us', isExact: true },
  us_pt: { id: 'us_pt', name: 'US Pints', symbol: 'pt', category: 'volume', toBaseFactor: 0.473176473, system: 'us', isExact: true },
  us_qt: { id: 'us_qt', name: 'US Quarts', symbol: 'qt', category: 'volume', toBaseFactor: 0.946352946, system: 'us', isExact: true },
  us_gal: { id: 'us_gal', name: 'US Gallons', symbol: 'gal', category: 'volume', toBaseFactor: 3.785411784, system: 'us', isExact: true },
  imp_gal: { id: 'imp_gal', name: 'Imperial Gallons', symbol: 'gal (imp)', category: 'volume', toBaseFactor: 4.54609, system: 'imperial', isExact: true },
  ft3: { id: 'ft3', name: 'Cubic Feet', symbol: 'ft³', category: 'volume', toBaseFactor: 28.316846592, system: 'us', isExact: true },
  yd3: { id: 'yd3', name: 'Cubic Yards', symbol: 'yd³', category: 'volume', toBaseFactor: 764.554857984, system: 'us', isExact: true },
};

export const AREA_UNITS: Record<string, UnitDefinition> = {
  sq_cm: { id: 'sq_cm', name: 'Square Centimetres', symbol: 'cm²', category: 'area', toBaseFactor: 0.0001, system: 'metric', isExact: true },
  sq_m: { id: 'sq_m', name: 'Square Metres', symbol: 'm²', category: 'area', toBaseFactor: 1.0, system: 'metric', isExact: true },
  ha: { id: 'ha', name: 'Hectares', symbol: 'ha', category: 'area', toBaseFactor: 10000.0, system: 'metric', isExact: true },
  sq_km: { id: 'sq_km', name: 'Square Kilometres', symbol: 'km²', category: 'area', toBaseFactor: 1000000.0, system: 'metric', isExact: true },
  sq_in: { id: 'sq_in', name: 'Square Inches', symbol: 'in²', category: 'area', toBaseFactor: 0.00064516, system: 'us', isExact: true },
  sq_ft: { id: 'sq_ft', name: 'Square Feet', symbol: 'ft²', category: 'area', toBaseFactor: 0.09290304, system: 'us', isExact: true },
  sq_yd: { id: 'sq_yd', name: 'Square Yards', symbol: 'yd²', category: 'area', toBaseFactor: 0.83612736, system: 'us', isExact: true },
  acre: { id: 'acre', name: 'Acres', symbol: 'ac', category: 'area', toBaseFactor: 4046.8564224, system: 'us', isExact: true },
  sq_mi: { id: 'sq_mi', name: 'Square Miles', symbol: 'mi²', category: 'area', toBaseFactor: 2589988.110336, system: 'us', isExact: true },
};

export const SPEED_UNITS: Record<string, UnitDefinition> = {
  ms: { id: 'ms', name: 'Metres per Second', symbol: 'm/s', category: 'speed', toBaseFactor: 1.0, system: 'metric', isExact: true },
  kmh: { id: 'kmh', name: 'Kilometres per Hour', symbol: 'km/h', category: 'speed', toBaseFactor: 1 / 3.6, system: 'metric', isExact: true },
  mph: { id: 'mph', name: 'Miles per Hour', symbol: 'mph', category: 'speed', toBaseFactor: 0.44704, system: 'us', isExact: true },
  knot: { id: 'knot', name: 'Knots (nautical mph)', symbol: 'kn', category: 'speed', toBaseFactor: 1852 / 3600, system: 'other', isExact: true },
  fps: { id: 'fps', name: 'Feet per Second', symbol: 'ft/s', category: 'speed', toBaseFactor: 0.3048, system: 'us', isExact: true },
};

export type TemperatureUnit = 'c' | 'f' | 'k';

export interface ConversionResult {
  fromValue: number;
  fromUnit: string;
  toUnit: string;
  resultValue: number;
  formattedResult: string;
  explanation: string;
  allConversions: { unit: string; symbol: string; value: number; formatted: string }[];
}

/**
 * Converts linear, mass, volume, area, or speed between two units.
 */
export function convertGeneral(
  value: number,
  fromId: string,
  toId: string,
  category: UnitCategory,
  decimals = 4
): ConversionResult | null {
  let unitDict: Record<string, UnitDefinition>;
  if (category === 'length') unitDict = LENGTH_UNITS;
  else if (category === 'weight') unitDict = WEIGHT_UNITS;
  else if (category === 'volume') unitDict = VOLUME_UNITS;
  else if (category === 'area') unitDict = AREA_UNITS;
  else if (category === 'speed') unitDict = SPEED_UNITS;
  else return null;

  const fromDef = unitDict[fromId];
  const toDef = unitDict[toId];
  if (!fromDef || !toDef) return null;

  // Convert to SI base unit, then to target unit
  const baseValue = value * fromDef.toBaseFactor;
  const targetValue = baseValue / toDef.toBaseFactor;

  // Calculate conversions across all units in category
  const allConversions = Object.values(unitDict).map((u) => {
    const val = baseValue / u.toBaseFactor;
    return {
      unit: u.name,
      symbol: u.symbol,
      value: val,
      formatted: formatPrecision(val, decimals),
    };
  });

  return {
    fromValue: value,
    fromUnit: fromDef.name,
    toUnit: toDef.name,
    resultValue: targetValue,
    formattedResult: formatPrecision(targetValue, decimals),
    explanation: `${value} ${fromDef.symbol} × ${fromDef.toBaseFactor} (${fromDef.isExact ? 'exact definition' : 'derived factor'}) ÷ ${toDef.toBaseFactor} = ${formatPrecision(
      targetValue,
      decimals
    )} ${toDef.symbol}, converting through the SI base unit and rounding only for display.`,
    allConversions,
  };
}

/**
 * Helper to compute single temperature conversion without recursion.
 */
function calcSingleTemp(
  val: number,
  from: TemperatureUnit,
  to: TemperatureUnit,
  mode: 'point' | 'diff'
): number {
  if (from === to) return val;
  if (mode === 'diff') {
    let cDiff = val;
    if (from === 'f') cDiff = val * (5 / 9);
    else if (from === 'k') cDiff = val;

    if (to === 'c') return cDiff;
    if (to === 'f') return cDiff * (9 / 5);
    if (to === 'k') return cDiff;
    return cDiff;
  } else {
    let celsius = val;
    if (from === 'f') celsius = (val - 32) * (5 / 9);
    else if (from === 'k') celsius = val - 273.15;

    if (to === 'c') return celsius;
    if (to === 'f') return celsius * (9 / 5) + 32;
    if (to === 'k') return celsius + 273.15;
    return celsius;
  }
}

/**
 * Temperature conversion supporting absolute scale and relative temperature differences.
 */
export function convertTemperature(
  value: number,
  fromUnit: TemperatureUnit,
  toUnit: TemperatureUnit,
  mode: 'point' | 'diff' = 'point',
  decimals = 4
): ConversionResult {
  const res = calcSingleTemp(value, fromUnit, toUnit, mode);

  const names: Record<TemperatureUnit, { name: string; sym: string }> = {
    c: { name: 'Celsius', sym: '°C' },
    f: { name: 'Fahrenheit', sym: '°F' },
    k: { name: 'Kelvin', sym: 'K' },
  };

  const allConversions: { unit: string; symbol: string; value: number; formatted: string }[] = (
    ['c', 'f', 'k'] as TemperatureUnit[]
  ).map((u) => {
    const val = calcSingleTemp(value, fromUnit, u, mode);
    return {
      unit: names[u].name,
      symbol: names[u].sym,
      value: val,
      formatted: formatPrecision(val, decimals),
    };
  });

  return {
    fromValue: value,
    fromUnit: names[fromUnit].name,
    toUnit: names[toUnit].name,
    resultValue: res,
    formattedResult: formatPrecision(res, decimals),
    explanation:
      mode === 'diff'
        ? `A temperature difference of ${value} ${names[fromUnit].sym} equals ${formatPrecision(
            res,
            decimals
          )} ${names[toUnit].sym} using the factor 1.8 °F per °C.`
        : `${value} ${names[fromUnit].sym} converts to ${formatPrecision(res, decimals)} ${
            names[toUnit].sym
          } via standard thermodynamic scaling.`,
    allConversions,
  };
}

/**
 * Parses mixed feet and inches strings (e.g. `5' 10"`, `5 ft 10 in`, `5-10`, `5' 10 1/2"`).
 */
export function parseFeetInches(input: string): number | null {
  const clean = input.trim();
  if (!clean) return null;

  // Simple number check (e.g. "10")
  if (/^-?\d+(\.\d+)?$/.test(clean)) {
    return parseFloat(clean);
  }

  // Regex for 5' 10", 5 ft 10 in, 5' 10 1/2"
  const ftInRegex = /^(?:(\d+)\s*(?:'|ft|feet)\s*)?(?:(\d+)(?:\s+(\d+)\/(\d+))?|\s*(\d+)\/(\d+))?\s*(?:"|in|inches)?$/i;
  const match = clean.match(ftInRegex);

  if (match) {
    const feet = match[1] ? parseInt(match[1], 10) : 0;
    const wholeInches = match[2] ? parseInt(match[2], 10) : 0;
    const fracNum = match[3] || match[5];
    const fracDen = match[4] || match[6];
    const fraction = fracNum && fracDen ? parseInt(fracNum, 10) / parseInt(fracDen, 10) : 0;

    const totalInches = feet * 12 + wholeInches + fraction;
    return totalInches / 12; // in feet
  }

  return null;
}

/**
 * Formats a decimal number with chosen precision.
 */
export function formatPrecision(val: number, decimals: number): string {
  if (Number.isInteger(val)) return val.toString();
  const rounded = parseFloat(val.toFixed(decimals));
  return rounded.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/**
 * Generates conversion chart rows for unit comparison table.
 */
export function generateConversionChart(
  fromUnitId: string,
  toUnitId: string,
  category: UnitCategory,
  startVal = 1,
  endVal = 10,
  step = 1
): { from: number; to: number; toFormatted: string }[] {
  const rows: { from: number; to: number; toFormatted: string }[] = [];
  for (let v = startVal; v <= endVal; v += step) {
    if (category === 'temperature') {
      const res = convertTemperature(
        v,
        fromUnitId as TemperatureUnit,
        toUnitId as TemperatureUnit,
        'point',
        2
      );
      rows.push({ from: v, to: res.resultValue, toFormatted: res.formattedResult });
    } else {
      const res = convertGeneral(v, fromUnitId, toUnitId, category, 4);
      if (res) {
        rows.push({ from: v, to: res.resultValue, toFormatted: res.formattedResult });
      }
    }
  }
  return rows;
}
