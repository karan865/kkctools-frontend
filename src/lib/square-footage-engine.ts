export type LengthUnit = 'feet' | 'inches' | 'feet-inches' | 'yards' | 'meters' | 'centimeters';

export type ShapeType = 'rectangle' | 'triangle' | 'circle' | 'semicircle' | 'trapezoid' | 'l-shape';

export interface RoomItem {
  id: string;
  name: string;
  shape: ShapeType;
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
  perimeterLinearFt: number;
  estimatedCost: number;
  estimatedCostWithWaste: number;
  roomBreakdowns: {
    id: string;
    name: string;
    sqft: number;
    sqMeters: number;
    perimeterLinearFt: number;
  }[];
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
      return val * 3.280839895;
    case 'centimeters':
      return val / 30.48;
    default:
      return val;
  }
}

/**
 * Calculates square footage and perimeter for a single room / shape
 */
export function calculateRoomSqft(room: RoomItem): { sqft: number; perimeterLinearFt: number } {
  const u = room.unit;

  if (room.shape === 'circle') {
    const r = convertToDecimalFeet(room.radius || (room.length / 2), u);
    if (r <= 0) return { sqft: 0, perimeterLinearFt: 0 };
    const sqft = Math.PI * r * r;
    const perimeterLinearFt = 2 * Math.PI * r;
    return { sqft, perimeterLinearFt };
  }

  if (room.shape === 'semicircle') {
    const r = convertToDecimalFeet(room.radius || (room.length / 2), u);
    if (r <= 0) return { sqft: 0, perimeterLinearFt: 0 };
    const sqft = (Math.PI * r * r) / 2;
    const perimeterLinearFt = Math.PI * r + 2 * r;
    return { sqft, perimeterLinearFt };
  }

  if (room.shape === 'triangle') {
    const base = convertToDecimalFeet(room.length, u, room.lengthInches);
    const height = convertToDecimalFeet(room.width, u, room.widthInches);
    if (base <= 0 || height <= 0) return { sqft: 0, perimeterLinearFt: 0 };
    const sqft = (base * height) / 2;
    // Approximating hypotenuse for right triangle perimeter estimate
    const hypotenuse = Math.sqrt(base * base + height * height);
    const perimeterLinearFt = base + height + hypotenuse;
    return { sqft, perimeterLinearFt };
  }

  if (room.shape === 'trapezoid') {
    const base1 = convertToDecimalFeet(room.length, u, room.lengthInches);
    const base2 = convertToDecimalFeet(room.base2 || 0, u);
    const height = convertToDecimalFeet(room.width, u, room.widthInches);
    if ((base1 <= 0 && base2 <= 0) || height <= 0) return { sqft: 0, perimeterLinearFt: 0 };
    const sqft = ((base1 + base2) / 2) * height;
    // Slant estimation
    const diff = Math.abs(base1 - base2) / 2;
    const slant = Math.sqrt(height * height + diff * diff);
    const perimeterLinearFt = base1 + base2 + 2 * slant;
    return { sqft, perimeterLinearFt };
  }

  if (room.shape === 'l-shape') {
    const l1 = convertToDecimalFeet(room.length, u, room.lengthInches);
    const w1 = convertToDecimalFeet(room.width, u, room.widthInches);
    const l2 = convertToDecimalFeet(room.length2 || 0, u);
    const w2 = convertToDecimalFeet(room.width2 || 0, u);
    const sqft = (l1 * w1) + (l2 * w2);
    // Perimeter of 2 connected blocks: (2*(l1+w1) + 2*(l2+w2) - shared edge) ~ rough estimate
    const perimeterLinearFt = 2 * (l1 + w1 + l2 + w2);
    return { sqft, perimeterLinearFt };
  }

  // Default: rectangle
  const l = convertToDecimalFeet(room.length, u, room.lengthInches);
  const w = convertToDecimalFeet(room.width, u, room.widthInches);
  if (l <= 0 || w <= 0) return { sqft: 0, perimeterLinearFt: 0 };
  const sqft = l * w;
  const perimeterLinearFt = 2 * (l + w);
  return { sqft, perimeterLinearFt };
}

/**
 * Master multi-room calculator with waste factor and unit conversions
 */
export function calculateSquareFootage(
  rooms: RoomItem[],
  wastePercentage: number = 0,
  costPerSqft: number = 0
): CalculationResult {
  let totalSqft = 0;
  let totalPerimeter = 0;

  const roomBreakdowns = rooms.map((room) => {
    const { sqft, perimeterLinearFt } = calculateRoomSqft(room);
    totalSqft += sqft;
    totalPerimeter += perimeterLinearFt;
    return {
      id: room.id,
      name: room.name || 'Room',
      sqft: Number(sqft.toFixed(2)),
      sqMeters: Number((sqft * 0.09290304).toFixed(2)),
      perimeterLinearFt: Number(perimeterLinearFt.toFixed(2)),
    };
  });

  const wasteMult = 1 + (Math.max(0, wastePercentage) / 100);
  const sqftWithWaste = totalSqft * wasteMult;

  // Conversions
  const sqMeters = totalSqft * 0.09290304;
  const sqMetersWithWaste = sqftWithWaste * 0.09290304;

  const sqYards = totalSqft / 9;
  const sqYardsWithWaste = sqftWithWaste / 9;

  const sqInches = totalSqft * 144;

  // Cost estimates
  const validCostPerSqft = Math.max(0, isNaN(costPerSqft) ? 0 : costPerSqft);
  const estimatedCost = totalSqft * validCostPerSqft;
  const estimatedCostWithWaste = sqftWithWaste * validCostPerSqft;

  return {
    sqft: Number(totalSqft.toFixed(2)),
    sqftWithWaste: Number(sqftWithWaste.toFixed(2)),
    sqMeters: Number(sqMeters.toFixed(2)),
    sqMetersWithWaste: Number(sqMetersWithWaste.toFixed(2)),
    sqYards: Number(sqYards.toFixed(2)),
    sqYardsWithWaste: Number(sqYardsWithWaste.toFixed(2)),
    sqInches: Number(sqInches.toFixed(0)),
    perimeterLinearFt: Number(totalPerimeter.toFixed(2)),
    estimatedCost: Number(estimatedCost.toFixed(2)),
    estimatedCostWithWaste: Number(estimatedCostWithWaste.toFixed(2)),
    roomBreakdowns,
  };
}

