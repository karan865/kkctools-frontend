export type LengthUnit = 'feet' | 'inches' | 'feet-inches' | 'yards' | 'meters' | 'centimeters';

export type ShapeType = 'rectangle' | 'triangle' | 'circle' | 'semicircle' | 'trapezoid' | 'l-shape';

export type RoomMode = 'add' | 'subtract';

export interface RoomItem {
  id: string;
  name: string;
  shape: ShapeType;
  mode?: RoomMode; // 'add' by default, 'subtract' for closets/cutouts/islands/stairwells
  // Dimensions
  length: number; // primary length / base
  lengthInches?: number; // for feet-inches
  width: number; // primary width / height
  widthInches?: number; // for feet-inches
  // Additional shape inputs
  radius?: number;
  base2?: number; // for trapezoid
  // For L-shape
  length2?: number;
  width2?: number;
  unit: LengthUnit;
}

export interface CalculationResult {
  sqft: number;
  sqftWithWaste: number;
  sqMeters: number;
  sqMetersWithWaste: number;
  sqYards: number;
  sqYardsWithWaste: number;
  sqInches: number;
  perimeterLinearFt: number | null; // null when perimeter is not applicable (triangle, trapezoid, L-shape)
  hasPerimeter: boolean;
  isPerimeterApprox?: boolean;
  estimatedCost: number;
  estimatedCostWithWaste: number;
  isNegativeTotal?: boolean;
  roomBreakdowns: {
    id: string;
    name: string;
    mode: RoomMode;
    sqft: number;
    sqMeters: number;
    perimeterLinearFt: number | null;
  }[];
}

/**
 * Converts string or number input to float, handling comma decimal separators
 */
export function parseDimension(value: string | number | undefined | null): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  const cleaned = value.toString().trim().replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Converts any length input with its unit into decimal feet
 */
export function convertToDecimalFeet(val: number, unit: LengthUnit, inchesPart: number = 0): number {
  if (isNaN(val) || val <= 0) {
    if (unit === 'feet-inches' && !isNaN(inchesPart) && inchesPart > 0) {
      return inchesPart / 12;
    }
    return 0;
  }

  switch (unit) {
    case 'feet':
      return val;
    case 'inches':
      return val / 12;
    case 'feet-inches':
      return val + (isNaN(inchesPart) ? 0 : inchesPart) / 12;
    case 'yards':
      return val * 3;
    case 'meters':
      return val * 3.280839895; // 1 m = 3.280839895 ft (1 ft = 0.3048 m)
    case 'centimeters':
      return val / 30.48; // 30.48 cm = 1 ft
    default:
      return val;
  }
}

/**
 * Calculates square footage and perimeter for a single room / shape.
 * Perimeter rule:
 * - Computable for: Rectangle (2*(l+w)), Circle (2*pi*r), Semi-circle (pi*r + 2*r).
 * - NOT computable / hidden for: Triangle, Trapezoid, L-shape (set to null).
 */
export function calculateRoomSqft(room: RoomItem): { sqft: number; perimeterLinearFt: number | null } {
  const u = room.unit;

  if (room.shape === 'circle') {
    const r = convertToDecimalFeet(room.radius || (room.length / 2), u);
    if (r <= 0) return { sqft: 0, perimeterLinearFt: null };
    const sqft = Math.PI * r * r;
    const perimeterLinearFt = 2 * Math.PI * r;
    return { sqft, perimeterLinearFt };
  }

  if (room.shape === 'semicircle') {
    const r = convertToDecimalFeet(room.radius || (room.length / 2), u);
    if (r <= 0) return { sqft: 0, perimeterLinearFt: null };
    const sqft = (Math.PI * r * r) / 2;
    const perimeterLinearFt = Math.PI * r + 2 * r;
    return { sqft, perimeterLinearFt };
  }

  if (room.shape === 'triangle') {
    const base = convertToDecimalFeet(room.length, u, room.lengthInches);
    const height = convertToDecimalFeet(room.width, u, room.widthInches);
    if (base <= 0 || height <= 0) return { sqft: 0, perimeterLinearFt: null };
    const sqft = (base * height) / 2;
    // Perimeter hidden for triangle
    return { sqft, perimeterLinearFt: null };
  }

  if (room.shape === 'trapezoid') {
    const base1 = convertToDecimalFeet(room.length, u, room.lengthInches);
    const base2 = convertToDecimalFeet(room.base2 || 0, u);
    const height = convertToDecimalFeet(room.width, u, room.widthInches);
    if ((base1 <= 0 && base2 <= 0) || height <= 0) return { sqft: 0, perimeterLinearFt: null };
    const sqft = ((base1 + base2) / 2) * height;
    // Perimeter hidden for trapezoid
    return { sqft, perimeterLinearFt: null };
  }

  if (room.shape === 'l-shape') {
    const l1 = convertToDecimalFeet(room.length, u, room.lengthInches);
    const w1 = convertToDecimalFeet(room.width, u, room.widthInches);
    const l2 = convertToDecimalFeet(room.length2 || 0, u);
    const w2 = convertToDecimalFeet(room.width2 || 0, u);
    const sqft = (l1 * w1) + (l2 * w2);
    // Perimeter hidden for L-Shape
    return { sqft, perimeterLinearFt: null };
  }

  // Default: rectangle
  const l = convertToDecimalFeet(room.length, u, room.lengthInches);
  const w = convertToDecimalFeet(room.width, u, room.widthInches);
  if (l <= 0 || w <= 0) return { sqft: 0, perimeterLinearFt: null };
  const sqft = l * w;
  const perimeterLinearFt = 2 * (l + w);
  return { sqft, perimeterLinearFt };
}

/**
 * Master multi-room calculator with waste factor, add/subtract toggles, negative total guard, and unit conversions
 */
export function calculateSquareFootage(
  rooms: RoomItem[],
  wastePercentage: number = 0,
  costPerSqft: number = 0
): CalculationResult {
  let rawTotalSqft = 0;
  let totalPerimeter = 0;
  let hasValidPerimeterCount = 0;

  const roomBreakdowns = rooms.map((room) => {
    const mode = room.mode || 'add';
    const { sqft, perimeterLinearFt } = calculateRoomSqft(room);

    if (mode === 'subtract') {
      rawTotalSqft -= sqft;
    } else {
      rawTotalSqft += sqft;
    }

    if (perimeterLinearFt !== null && perimeterLinearFt > 0) {
      totalPerimeter += perimeterLinearFt;
      hasValidPerimeterCount++;
    }

    return {
      id: room.id,
      name: room.name || 'Room',
      mode,
      sqft: Number(sqft.toFixed(2)),
      sqMeters: Number((sqft * 0.09290304).toFixed(2)),
      perimeterLinearFt: perimeterLinearFt !== null ? Number(perimeterLinearFt.toFixed(2)) : null,
    };
  });

  const isNegativeTotal = rawTotalSqft < 0;
  const totalSqft = Math.max(0, rawTotalSqft);

  const wasteMult = 1 + (Math.max(0, wastePercentage) / 100);
  const sqftWithWaste = totalSqft * wasteMult;

  // Conversions (exact 1 sq ft = 0.09290304 m2, 1 sq yd = 9 sq ft, 1 sq ft = 144 sq in)
  const sqMeters = totalSqft * 0.09290304;
  const sqMetersWithWaste = sqftWithWaste * 0.09290304;

  const sqYards = totalSqft / 9;
  const sqYardsWithWaste = sqftWithWaste / 9;

  const sqInches = totalSqft * 144;

  // Cost estimates
  const validCostPerSqft = Math.max(0, isNaN(costPerSqft) ? 0 : costPerSqft);
  const estimatedCost = totalSqft * validCostPerSqft;
  const estimatedCostWithWaste = sqftWithWaste * validCostPerSqft;

  const hasPerimeter = hasValidPerimeterCount > 0;

  return {
    sqft: Number(totalSqft.toFixed(2)),
    sqftWithWaste: Number(sqftWithWaste.toFixed(2)),
    sqMeters: Number(sqMeters.toFixed(2)),
    sqMetersWithWaste: Number(sqMetersWithWaste.toFixed(2)),
    sqYards: Number(sqYards.toFixed(2)),
    sqYardsWithWaste: Number(sqYardsWithWaste.toFixed(2)),
    sqInches: Number(sqInches.toFixed(0)),
    perimeterLinearFt: hasPerimeter ? Number(totalPerimeter.toFixed(2)) : null,
    hasPerimeter,
    isPerimeterApprox: rooms.length > 1,
    estimatedCost: Number(estimatedCost.toFixed(2)),
    estimatedCostWithWaste: Number(estimatedCostWithWaste.toFixed(2)),
    isNegativeTotal,
    roomBreakdowns,
  };
}
