/**
 * Paint Cost and Coverage Calculator Engine
 *
 * Implements pure mathematics for interior/exterior paint estimation:
 * - Room perimeter and gross wall area calculation.
 * - Standard door (21 sq ft) and window (15 sq ft) opening deductions.
 * - Optional ceiling surface area calculation (Length * Width).
 * - Direct sq ft mode for custom wall areas.
 * - Surface texture coverage rates (380, 350, 300, 250 sq ft/gal or custom).
 * - Multi-coat multiplier (1, 2, or 3 coats).
 * - Container breakdown (Gallons vs. Quarts vs. 5-Gallon buckets).
 * - Optional separate primer coat calculation.
 * - DIY material cost breakdown + Pro contractor labor benchmark savings.
 *
 * Adheres strictly to Zero-Network policy (pure client-side math).
 */

export interface SurfaceTexturePreset {
  id: string;
  name: string;
  coverageSqFtPerGal: number;
  description: string;
}

export const SURFACE_TEXTURES: Record<string, SurfaceTexturePreset> = {
  smooth: {
    id: 'smooth',
    name: 'Smooth Drywall (Standard)',
    coverageSqFtPerGal: 380,
    description: 'Smooth primed drywall or previously painted walls',
  },
  lightTexture: {
    id: 'lightTexture',
    name: 'Light Texture (Orange Peel)',
    coverageSqFtPerGal: 350,
    description: 'Minor orange peel or light drywall texture',
  },
  heavyTexture: {
    id: 'heavyTexture',
    name: 'Heavy Texture (Knockdown / Stucco)',
    coverageSqFtPerGal: 300,
    description: 'Knockdown, acoustic ceilings, or heavy sand texture',
  },
  porous: {
    id: 'porous',
    name: 'Unprimed Drywall / Rough Masonry',
    coverageSqFtPerGal: 250,
    description: 'Bare unprimed drywall mud, brick, or cinder block',
  },
};

export interface PaintCalculationInput {
  mode: 'room' | 'direct';
  // Room mode
  roomLengthFeet?: number;
  roomWidthFeet?: number;
  ceilingHeightFeet?: number;
  includeCeiling?: boolean;
  doorsCount?: number;
  windowsCount?: number;
  customDeductionsSqFt?: number;
  // Direct mode
  directWallAreaSqFt?: number;
  // Common settings
  texturePresetId: string; // keyof SURFACE_TEXTURES or 'custom'
  customCoverageSqFt?: number;
  coats: number; // 1, 2, or 3
  includePrimer?: boolean;
  // Cost inputs
  pricePerGallon?: number;
  pricePerPrimerGallon?: number;
  suppliesCost?: number;
}

export interface PaintCalculationResult {
  perimeterFeet: number;
  grossWallAreaSqFt: number;
  openingsDeductionSqFt: number;
  netWallAreaSqFt: number;
  ceilingAreaSqFt: number;
  singleCoatAreaSqFt: number;
  totalCoatAreaSqFt: number;
  exactPaintGallons: number;
  recommendedGallons: number;
  recommendedQuarts: number;
  containerSummary: string;
  hasFiveGallonPailOption: boolean;
  fiveGallonPails: number;
  singleGallonsWithPails: number;
  // Primer
  exactPrimerGallons: number;
  recommendedPrimerGallons: number;
  // Costs
  paintCost: number;
  primerCost: number;
  suppliesCost: number;
  totalDiyCost: number;
  proEstimatedCostLow: number;
  proEstimatedCostHigh: number;
}

export function calculatePaint(input: PaintCalculationInput): PaintCalculationResult {
  const {
    mode,
    roomLengthFeet = 0,
    roomWidthFeet = 0,
    ceilingHeightFeet = 0,
    includeCeiling = false,
    doorsCount = 0,
    windowsCount = 0,
    customDeductionsSqFt = 0,
    directWallAreaSqFt = 0,
    texturePresetId,
    customCoverageSqFt,
    coats = 2,
    includePrimer = false,
    pricePerGallon = 0,
    pricePerPrimerGallon = 0,
    suppliesCost = 0,
  } = input;

  let perimeterFeet = 0;
  let grossWallAreaSqFt = 0;
  let openingsDeductionSqFt = 0;
  let netWallAreaSqFt = 0;
  let ceilingAreaSqFt = 0;

  if (mode === 'room') {
    const len = Math.max(0, roomLengthFeet || 0);
    const wid = Math.max(0, roomWidthFeet || 0);
    const hgt = Math.max(0, ceilingHeightFeet || 0);

    perimeterFeet = parseFloat((2 * (len + wid)).toFixed(1));
    grossWallAreaSqFt = parseFloat((perimeterFeet * hgt).toFixed(1));

    const doorsArea = Math.max(0, doorsCount || 0) * 21; // 3' x 7' = 21 sq ft standard
    const windowsArea = Math.max(0, windowsCount || 0) * 15; // 3' x 5' = 15 sq ft standard
    const customArea = Math.max(0, customDeductionsSqFt || 0);
    openingsDeductionSqFt = parseFloat((doorsArea + windowsArea + customArea).toFixed(1));

    netWallAreaSqFt = parseFloat(Math.max(0, grossWallAreaSqFt - openingsDeductionSqFt).toFixed(1));

    if (includeCeiling) {
      ceilingAreaSqFt = parseFloat((len * wid).toFixed(1));
    }
  } else {
    // Direct mode
    netWallAreaSqFt = parseFloat(Math.max(0, directWallAreaSqFt || 0).toFixed(1));
    grossWallAreaSqFt = netWallAreaSqFt;
  }

  const singleCoatAreaSqFt = parseFloat((netWallAreaSqFt + ceilingAreaSqFt).toFixed(1));
  const validCoats = Math.max(1, coats || 1);
  const totalCoatAreaSqFt = parseFloat((singleCoatAreaSqFt * validCoats).toFixed(1));

  // Determine coverage per gallon
  let coverageRate = 380;
  if (texturePresetId === 'custom') {
    coverageRate = Math.max(50, customCoverageSqFt || 380);
  } else if (SURFACE_TEXTURES[texturePresetId]) {
    coverageRate = SURFACE_TEXTURES[texturePresetId].coverageSqFtPerGal;
  }

  const exactPaintGallons = coverageRate > 0 ? parseFloat((totalCoatAreaSqFt / coverageRate).toFixed(2)) : 0;

  // Purchasing logic: 1 gallon = 4 quarts
  let recommendedGallons = 0;
  let recommendedQuarts = 0;
  let containerSummary = '';

  if (exactPaintGallons === 0) {
    recommendedGallons = 0;
    containerSummary = '0 Gallons';
  } else if (exactPaintGallons <= 0.25) {
    recommendedQuarts = 1;
    containerSummary = '1 Quart (0.25 gal)';
  } else if (exactPaintGallons <= 0.5) {
    recommendedQuarts = 2;
    containerSummary = '2 Quarts (0.50 gal)';
  } else if (exactPaintGallons < 1.0) {
    // 3 quarts usually costs more than 1 gallon in stores
    recommendedGallons = 1;
    containerSummary = '1 Gallon';
  } else {
    // Over 1 gallon: round up to nearest full gallon or gallon + quart
    recommendedGallons = Math.ceil(exactPaintGallons);
    containerSummary = `${recommendedGallons} Gallon${recommendedGallons > 1 ? 's' : ''}`;
  }

  // Bulk 5-gallon pail calculation option
  const hasFiveGallonPailOption = recommendedGallons >= 5;
  const fiveGallonPails = Math.floor(recommendedGallons / 5);
  const singleGallonsWithPails = recommendedGallons % 5;

  // Primer calculations (1 coat of primer if selected)
  let exactPrimerGallons = 0;
  let recommendedPrimerGallons = 0;
  if (includePrimer && singleCoatAreaSqFt > 0) {
    // Primer coverage is typically ~300 sq ft / gallon
    exactPrimerGallons = parseFloat((singleCoatAreaSqFt / 300).toFixed(2));
    recommendedPrimerGallons = Math.ceil(exactPrimerGallons);
  }

  // Cost calculations
  const validPaintPrice = Math.max(0, pricePerGallon || 0);
  const validPrimerPrice = Math.max(0, pricePerPrimerGallon || 0);
  const validSupplies = Math.max(0, suppliesCost || 0);

  const paintCost = parseFloat((recommendedGallons * validPaintPrice).toFixed(2));
  const primerCost = parseFloat((recommendedPrimerGallons * validPrimerPrice).toFixed(2));
  const totalDiyCost = parseFloat((paintCost + primerCost + validSupplies).toFixed(2));

  // Professional labor benchmarks based on total wall area:
  // Typical pro contractor charges ~$1.50 - $3.00 per sq ft of wall surface for 2 coats
  const proEstimatedCostLow = Math.round(singleCoatAreaSqFt * 1.5);
  const proEstimatedCostHigh = Math.round(singleCoatAreaSqFt * 3.0);

  return {
    perimeterFeet,
    grossWallAreaSqFt,
    openingsDeductionSqFt,
    netWallAreaSqFt,
    ceilingAreaSqFt,
    singleCoatAreaSqFt,
    totalCoatAreaSqFt,
    exactPaintGallons,
    recommendedGallons,
    recommendedQuarts,
    containerSummary,
    hasFiveGallonPailOption,
    fiveGallonPails,
    singleGallonsWithPails,
    exactPrimerGallons,
    recommendedPrimerGallons,
    paintCost,
    primerCost,
    suppliesCost: validSupplies,
    totalDiyCost,
    proEstimatedCostLow,
    proEstimatedCostHigh,
  };
}

