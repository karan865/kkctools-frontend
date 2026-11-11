import {
  DOOR_SQFT,
  WINDOW_SQFT,
  COVERAGE,
  CoverageTextureKey,
  PRIMER_COVERAGE_DEFAULT,
  QUART_PRICE_RATIO,
  PRICE_PRESETS,
  DEFAULT_PRIMER_PRICE,
  DEFAULT_SUNDRIES,
  PRO_RATE_LOW,
  PRO_RATE_HIGH,
  MAX_ROOMS,
} from './paint-constants';

export interface RoomPaintInput {
  id: string;
  name: string;
  lengthFeet: number;
  widthFeet: number;
  heightFeet: number;
  doorsCount: number;
  windowsCount: number;
  customDeductionSqFt?: number;
  includeCeiling: boolean;
  // Direct Wall Area mode overrides
  isDirectArea?: boolean;
  directGrossWallSqFt?: number;
  directCeilingSqFt?: number;
}

export interface ContainerBreakdown {
  exactGallons: number;
  wholeGallons: number;
  quarts: number;
  displayLabel: string;
  suggestFiveGallonBucket: boolean;
}

export interface RoomBreakdownResult {
  id: string;
  name: string;
  perimeter: number;
  grossWallAreaSqFt: number;
  openingsDeductionSqFt: number;
  netWallAreaSqFt: number;
  ceilingAreaSqFt: number;
}

export interface PaintCalculationInput {
  rooms: RoomPaintInput[];
  textureKey: CoverageTextureKey;
  customCoverageSqFt?: number;
  coats: number; // 1, 2, or 3 (default 2)
  ceilingCoats?: number; // default 2
  includePrimer: boolean;
  primerCoverageSqFt?: number;
  wallPricePerGallon?: number;
  ceilingPricePerGallon?: number;
  primerPricePerGallon?: number;
  sundriesCost?: number;
}

export interface PaintCalculationResult {
  // Areas
  totalGrossWallSqFt: number;
  totalOpeningsDeductionSqFt: number;
  totalNetWallSqFt: number;
  totalCeilingSqFt: number;
  totalPaintableSurfaceSqFt: number;
  effectiveCoverage: number;
  // Gallons & containers
  wallExactGallons: number;
  wallContainers: ContainerBreakdown;
  ceilingExactGallons: number;
  ceilingContainers: ContainerBreakdown;
  primerExactGallons: number;
  primerGallonsToBuy: number; // ceil(primerExactGallons)
  // Costs
  wallPaintCost: number;
  ceilingPaintCost: number;
  primerCost: number;
  sundriesCost: number;
  totalDIYCost: number;
  // Pro benchmark
  proEstimateLow: number;
  proEstimateHigh: number;
  proSavingsLow: number;
  proSavingsHigh: number;
  // Flags & Warnings
  unprimedPrimerConflict: boolean;
  roomBreakdowns: RoomBreakdownResult[];
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
 * Container rounding rule (exact gallon value N, with 1e-9 epsilon):
 * whole = floor(N); frac = N - whole
 * frac == 0      → whole gal
 * frac <= 0.25   → whole gal + 1 qt
 * frac <= 0.50   → whole gal + 2 qt
 * frac >  0.50   → (whole + 1) gal
 */
export function calculateContainerBreakdown(exactGallons: number): ContainerBreakdown {
  if (exactGallons <= 0) {
    return {
      exactGallons: 0,
      wholeGallons: 0,
      quarts: 0,
      displayLabel: '0 Gallons',
      suggestFiveGallonBucket: false,
    };
  }

  const eps = 1e-9;
  const whole = Math.floor(exactGallons + eps);
  const frac = Math.max(0, exactGallons - whole);

  let finalGal = whole;
  let finalQt = 0;

  if (frac <= eps) {
    finalGal = whole;
    finalQt = 0;
  } else if (frac <= 0.25 + eps) {
    finalGal = whole;
    finalQt = 1;
  } else if (frac <= 0.50 + eps) {
    finalGal = whole;
    finalQt = 2;
  } else {
    finalGal = whole + 1;
    finalQt = 0;
  }

  // Label construction
  let displayLabel = '';
  if (finalGal > 0 && finalQt > 0) {
    displayLabel = `${finalGal} ${finalGal === 1 ? 'Gallon' : 'Gallons'} + ${finalQt} ${finalQt === 1 ? 'Quart' : 'Quarts'}`;
  } else if (finalGal > 0) {
    displayLabel = `${finalGal} ${finalGal === 1 ? 'Gallon' : 'Gallons'}`;
  } else if (finalQt > 0) {
    displayLabel = `${finalQt} ${finalQt === 1 ? 'Quart' : 'Quarts'}`;
  } else {
    displayLabel = '0 Gallons';
  }

  const totalEffectiveGallons = finalGal + finalQt * 0.25;
  const suggestFiveGallonBucket = totalEffectiveGallons >= 5;

  return {
    exactGallons: Number(exactGallons.toFixed(3)),
    wholeGallons: finalGal,
    quarts: finalQt,
    displayLabel,
    suggestFiveGallonBucket,
  };
}

/**
 * Calculates cost for gallons and quarts:
 * cost = gal * price + qt * price * QUART_PRICE_RATIO
 */
export function calculatePaintCost(containers: ContainerBreakdown, gallonPrice: number): number {
  const g = containers.wholeGallons;
  const q = containers.quarts;
  return g * gallonPrice + q * gallonPrice * QUART_PRICE_RATIO;
}

/**
 * Helper to round to nearest 10
 */
export function round10(x: number): number {
  return Math.round(x / 10) * 10;
}

/**
 * Main Paint Calculator Engine
 */
export function calculatePaint(input: PaintCalculationInput): PaintCalculationResult {
  const rooms = (input.rooms || []).slice(0, MAX_ROOMS);

  // Coverage resolution
  let coverage: number = COVERAGE.smooth;
  if (input.textureKey === 'custom' && input.customCoverageSqFt && input.customCoverageSqFt > 0) {
    coverage = input.customCoverageSqFt;
  } else if (input.textureKey in COVERAGE) {
    coverage = COVERAGE[input.textureKey as keyof typeof COVERAGE];
  }

  const coats = Math.max(1, Math.min(3, input.coats || 2));
  const ceilingCoats = Math.max(1, Math.min(3, input.ceilingCoats || 2));
  const primerCoverage = Math.max(1, input.primerCoverageSqFt || PRIMER_COVERAGE_DEFAULT);

  let totalGrossWallSqFt = 0;
  let totalOpeningsDeductionSqFt = 0;
  let totalNetWallSqFt = 0;
  let totalCeilingSqFt = 0;

  const roomBreakdowns: RoomBreakdownResult[] = [];

  for (const r of rooms) {
    if (r.isDirectArea) {
      const grossWall = Math.max(0, r.directGrossWallSqFt || 0);
      const openings =
        Math.max(0, r.doorsCount || 0) * DOOR_SQFT +
        Math.max(0, r.windowsCount || 0) * WINDOW_SQFT +
        Math.max(0, r.customDeductionSqFt || 0);
      const netWall = Math.max(0, grossWall - openings);
      const ceiling = r.includeCeiling ? Math.max(0, r.directCeilingSqFt || 0) : 0;

      totalGrossWallSqFt += grossWall;
      totalOpeningsDeductionSqFt += openings;
      totalNetWallSqFt += netWall;
      totalCeilingSqFt += ceiling;

      roomBreakdowns.push({
        id: r.id,
        name: r.name || 'Custom Area',
        perimeter: 0,
        grossWallAreaSqFt: Number(grossWall.toFixed(1)),
        openingsDeductionSqFt: Number(openings.toFixed(1)),
        netWallAreaSqFt: Number(netWall.toFixed(1)),
        ceilingAreaSqFt: Number(ceiling.toFixed(1)),
      });
    } else {
      const l = Math.max(0, Math.min(200, r.lengthFeet || 0));
      const w = Math.max(0, Math.min(200, r.widthFeet || 0));
      const h = Math.max(0, Math.min(40, r.heightFeet || 0));
      const perimeter = 2 * (l + w);
      const grossWall = perimeter * h;
      const openings =
        Math.max(0, Math.min(50, r.doorsCount || 0)) * DOOR_SQFT +
        Math.max(0, Math.min(50, r.windowsCount || 0)) * WINDOW_SQFT +
        Math.max(0, r.customDeductionSqFt || 0);
      const netWall = Math.max(0, grossWall - openings);
      const ceiling = r.includeCeiling ? l * w : 0;

      totalGrossWallSqFt += grossWall;
      totalOpeningsDeductionSqFt += openings;
      totalNetWallSqFt += netWall;
      totalCeilingSqFt += ceiling;

      roomBreakdowns.push({
        id: r.id,
        name: r.name || 'Room',
        perimeter: Number(perimeter.toFixed(1)),
        grossWallAreaSqFt: Number(grossWall.toFixed(1)),
        openingsDeductionSqFt: Number(openings.toFixed(1)),
        netWallAreaSqFt: Number(netWall.toFixed(1)),
        ceilingAreaSqFt: Number(ceiling.toFixed(1)),
      });
    }
  }

  // Gallons calculated on total sum across rooms
  const wallExactGallons = coverage > 0 ? (totalNetWallSqFt * coats) / coverage : 0;
  const wallContainers = calculateContainerBreakdown(wallExactGallons);

  const ceilingExactGallons = coverage > 0 && totalCeilingSqFt > 0 ? (totalCeilingSqFt * ceilingCoats) / coverage : 0;
  const ceilingContainers = calculateContainerBreakdown(ceilingExactGallons);

  // Primer: 1 coat over net wall + ceiling
  const primerSurface = totalNetWallSqFt + totalCeilingSqFt;
  const primerExactGallons = input.includePrimer && primerCoverage > 0 ? primerSurface / primerCoverage : 0;
  const primerGallonsToBuy = input.includePrimer && primerExactGallons > 0 ? Math.ceil(primerExactGallons - 1e-9) : 0;

  // Costs
  const wallPrice = Math.max(0, Math.min(1000, input.wallPricePerGallon !== undefined ? input.wallPricePerGallon : PRICE_PRESETS.mid));
  const ceilingPrice = Math.max(0, Math.min(1000, input.ceilingPricePerGallon !== undefined ? input.ceilingPricePerGallon : wallPrice));
  const primerPrice = Math.max(0, Math.min(1000, input.primerPricePerGallon !== undefined ? input.primerPricePerGallon : DEFAULT_PRIMER_PRICE));
  const sundries = Math.max(0, Math.min(1000, input.sundriesCost !== undefined ? input.sundriesCost : DEFAULT_SUNDRIES));

  const wallPaintCost = calculatePaintCost(wallContainers, wallPrice);
  const ceilingPaintCost = calculatePaintCost(ceilingContainers, ceilingPrice);
  const primerCost = primerGallonsToBuy * primerPrice;
  const totalDIYCost = wallPaintCost + ceilingPaintCost + primerCost + sundries;

  // PRO benchmark
  const totalPaintableSurfaceSqFt = totalNetWallSqFt + totalCeilingSqFt;
  const proEstimateLow = round10(totalPaintableSurfaceSqFt * PRO_RATE_LOW);
  const proEstimateHigh = round10(totalPaintableSurfaceSqFt * PRO_RATE_HIGH);
  const proSavingsLow = Math.max(0, proEstimateLow - totalDIYCost);
  const proSavingsHigh = Math.max(0, proEstimateHigh - totalDIYCost);

  // Conflict flag: texture = unprimed (250) AND primer is enabled
  const unprimedPrimerConflict = input.textureKey === 'unprimed' && input.includePrimer;

  return {
    totalGrossWallSqFt: Number(totalGrossWallSqFt.toFixed(1)),
    totalOpeningsDeductionSqFt: Number(totalOpeningsDeductionSqFt.toFixed(1)),
    totalNetWallSqFt: Number(totalNetWallSqFt.toFixed(1)),
    totalCeilingSqFt: Number(totalCeilingSqFt.toFixed(1)),
    totalPaintableSurfaceSqFt: Number(totalPaintableSurfaceSqFt.toFixed(1)),
    effectiveCoverage: coverage,
    wallExactGallons: Number(wallExactGallons.toFixed(3)),
    wallContainers,
    ceilingExactGallons: Number(ceilingExactGallons.toFixed(3)),
    ceilingContainers,
    primerExactGallons: Number(primerExactGallons.toFixed(3)),
    primerGallonsToBuy,
    wallPaintCost: Number(wallPaintCost.toFixed(2)),
    ceilingPaintCost: Number(ceilingPaintCost.toFixed(2)),
    primerCost: Number(primerCost.toFixed(2)),
    sundriesCost: Number(sundries.toFixed(2)),
    totalDIYCost: Number(totalDIYCost.toFixed(2)),
    proEstimateLow,
    proEstimateHigh,
    proSavingsLow: Math.round(proSavingsLow),
    proSavingsHigh: Math.round(proSavingsHigh),
    unprimedPrimerConflict,
    roomBreakdowns,
  };
}
