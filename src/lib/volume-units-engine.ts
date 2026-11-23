/**
 * Exact Volume Units and Tank Geometry Engine.
 * Shared between Gallons ↔ ft³ (#05), Tank Volume (#16), and Metric Conversion (#20).
 * Uses exact NIST conversion factors: 1 US gal = 231 in³, 1 ft³ = 1728 in³, 1 in = 0.0254 m.
 * 100% pure client-side. Zero network calls.
 */

export type VolumeUnit =
  | 'us_gal'      // US Liquid Gallon (231 in³)
  | 'imp_gal'     // Imperial Gallon (4.54609 L)
  | 'ft3'         // Cubic Feet (1728 in³)
  | 'm3'          // Cubic Metres (1000 L)
  | 'litres'      // Litres (1 dm³)
  | 'in3'         // Cubic Inches
  | 'barrels'     // US Oil Barrels (42 US gal)
  | 'us_dry_gal'; // US Dry Gallon (268.8025 in³)

export type LengthUnit = 'ft' | 'in' | 'm' | 'cm' | 'mm';

// Exact constants based on NIST Handbook 44
export const EXACT_LITRES_PER_M3 = 1000.0;
export const EXACT_M_PER_INCH = 0.0254;
export const EXACT_IN3_PER_US_GAL = 231.0;
export const EXACT_IN3_PER_FT3 = 1728.0;
export const EXACT_LITRES_PER_IMP_GAL = 4.54609;
export const EXACT_IN3_PER_US_DRY_GAL = 268.8025;
export const EXACT_US_GAL_PER_BARREL = 42.0;

// Derived exact litres conversions
export const EXACT_LITRES_PER_IN3 = Math.pow(EXACT_M_PER_INCH, 3) * 1000.0; // 0.016387064 L
export const EXACT_LITRES_PER_US_GAL = EXACT_IN3_PER_US_GAL * EXACT_LITRES_PER_IN3; // 3.785411784 L
export const EXACT_LITRES_PER_FT3 = EXACT_IN3_PER_FT3 * EXACT_LITRES_PER_IN3; // 28.316846592 L

export const US_GAL_PER_FT3 = EXACT_IN3_PER_FT3 / EXACT_IN3_PER_US_GAL; // 7.48051948051948
export const FT3_PER_US_GAL = EXACT_IN3_PER_US_GAL / EXACT_IN3_PER_FT3; // 0.13368055555555555

/**
 * Converts any volume value into exact litres (our canonical base unit).
 */
export function volumeToLitres(value: number, unit: VolumeUnit): number {
  switch (unit) {
    case 'litres':
      return value;
    case 'm3':
      return value * EXACT_LITRES_PER_M3;
    case 'us_gal':
      return value * EXACT_LITRES_PER_US_GAL;
    case 'imp_gal':
      return value * EXACT_LITRES_PER_IMP_GAL;
    case 'ft3':
      return value * EXACT_LITRES_PER_FT3;
    case 'in3':
      return value * EXACT_LITRES_PER_IN3;
    case 'barrels':
      return value * EXACT_US_GAL_PER_BARREL * EXACT_LITRES_PER_US_GAL;
    case 'us_dry_gal':
      return value * EXACT_IN3_PER_US_DRY_GAL * EXACT_LITRES_PER_IN3;
  }
}

/**
 * Converts litres into any target volume unit.
 */
export function litresToVolume(litres: number, targetUnit: VolumeUnit): number {
  switch (targetUnit) {
    case 'litres':
      return litres;
    case 'm3':
      return litres / EXACT_LITRES_PER_M3;
    case 'us_gal':
      return litres / EXACT_LITRES_PER_US_GAL;
    case 'imp_gal':
      return litres / EXACT_LITRES_PER_IMP_GAL;
    case 'ft3':
      return litres / EXACT_LITRES_PER_FT3;
    case 'in3':
      return litres / EXACT_LITRES_PER_IN3;
    case 'barrels':
      return litres / (EXACT_US_GAL_PER_BARREL * EXACT_LITRES_PER_US_GAL);
    case 'us_dry_gal':
      return litres / (EXACT_IN3_PER_US_DRY_GAL * EXACT_LITRES_PER_IN3);
  }
}

/**
 * Converts volume between any two supported units.
 */
export function convertVolume(value: number, fromUnit: VolumeUnit, toUnit: VolumeUnit): number {
  if (fromUnit === toUnit) return value;
  const litres = volumeToLitres(value, fromUnit);
  return litresToVolume(litres, toUnit);
}

/**
 * Converts linear length into metres.
 */
export function lengthToMetres(val: number, unit: LengthUnit): number {
  switch (unit) {
    case 'm':
      return val;
    case 'cm':
      return val / 100.0;
    case 'mm':
      return val / 1000.0;
    case 'ft':
      return val * 12.0 * EXACT_M_PER_INCH;
    case 'in':
      return val * EXACT_M_PER_INCH;
  }
}

/**
 * Calculates volume of a rectangular prism (box).
 */
export function calculateBoxVolume(
  length: number,
  width: number,
  height: number,
  lengthUnit: LengthUnit,
  resultUnit: VolumeUnit = 'us_gal'
): number {
  if (length <= 0 || width <= 0 || height <= 0) return 0;
  const l_m = lengthToMetres(length, lengthUnit);
  const w_m = lengthToMetres(width, lengthUnit);
  const h_m = lengthToMetres(height, lengthUnit);
  const m3 = l_m * w_m * h_m;
  const litres = m3 * EXACT_LITRES_PER_M3;
  return litresToVolume(litres, resultUnit);
}

/**
 * Calculates volume of a cylinder.
 */
export function calculateCylinderVolume(
  diameter: number,
  height: number,
  lengthUnit: LengthUnit,
  resultUnit: VolumeUnit = 'us_gal'
): number {
  if (diameter <= 0 || height <= 0) return 0;
  const d_m = lengthToMetres(diameter, lengthUnit);
  const h_m = lengthToMetres(height, lengthUnit);
  const r_m = d_m / 2.0;
  const m3 = Math.PI * r_m * r_m * h_m;
  const litres = m3 * EXACT_LITRES_PER_M3;
  return litresToVolume(litres, resultUnit);
}

/**
 * Calculates volume of a horizontal cylindrical tank filled to liquid depth h.
 * Radius r = diameter / 2. Length L.
 */
export function calculateHorizontalTankFilledVolume(
  diameter: number,
  length: number,
  liquidDepth: number,
  lengthUnit: LengthUnit,
  resultUnit: VolumeUnit = 'us_gal'
): { totalVolume: number; filledVolume: number; filledPercentage: number } {
  if (diameter <= 0 || length <= 0) {
    return { totalVolume: 0, filledVolume: 0, filledPercentage: 0 };
  }

  const d = lengthToMetres(diameter, lengthUnit);
  const L = lengthToMetres(length, lengthUnit);
  const r = d / 2.0;
  const h = Math.max(0, Math.min(d, lengthToMetres(liquidDepth, lengthUnit)));

  const totalM3 = Math.PI * r * r * L;

  let filledM3 = 0;
  if (h <= 0) {
    filledM3 = 0;
  } else if (h >= d) {
    filledM3 = totalM3;
  } else {
    // Area of circular segment = r^2 * arccos((r - h) / r) - (r - h) * sqrt(2*r*h - h^2)
    const segmentArea =
      r * r * Math.acos((r - h) / r) - (r - h) * Math.sqrt(2 * r * h - h * h);
    filledM3 = segmentArea * L;
  }

  const totalLitres = totalM3 * EXACT_LITRES_PER_M3;
  const filledLitres = filledM3 * EXACT_LITRES_PER_M3;

  return {
    totalVolume: litresToVolume(totalLitres, resultUnit),
    filledVolume: litresToVolume(filledLitres, resultUnit),
    filledPercentage: totalM3 > 0 ? (filledM3 / totalM3) * 100 : 0,
  };
}

/**
 * Estimates weight of pure fresh water at standard temperature (approx. 8.34 lb/gal or 1 kg/L).
 */
export function calculateWaterWeight(
  volume: number,
  volUnit: VolumeUnit,
  weightUnit: 'lb' | 'kg' = 'lb'
): number {
  const gallons = convertVolume(volume, volUnit, 'us_gal');
  const lb = gallons * 8.34; // standard 8.34 lb per US gallon
  if (weightUnit === 'lb') {
    return lb;
  }
  return lb * 0.45359237; // lb to kg
}
