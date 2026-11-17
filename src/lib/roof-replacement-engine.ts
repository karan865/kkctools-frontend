/**
 * Roof Replacement Cost Calculator engine (Batch 2, Tier 3 #19).
 *
 * Implements accurate roof pitch geometry (reusing shingle-engine),
 * multi-plane roof sections or direct footprint entry,
 * full material breakdown (asphalt, metal, tile, slate, wood shake, flat membranes),
 * labour with stories and steep-pitch multipliers,
 * tear-off and dumpster disposal scaling by existing layers,
 * decking repair allowances, underlayment & accessories,
 * and a 3-way repair vs overlay vs full replacement comparison (enforcing IRC R908.3.1.1 2-layer code limit).
 *
 * All calculations are pure, client-side, with zero network calls.
 */

import {
  pitchFactor,
  pitchToDegrees,
  degreesToPitch,
  SQFT_PER_SQUARE,
  M2_PER_SQUARE,
  RoofSection,
  sectionGeometry,
  SHINGLE_TYPES,
  UNDERLAYMENTS,
  WASTE_PRESETS,
} from './shingle-engine';

import {
  TEAR_OFF_RANGE,
  TEAR_OFF_PRICE,
} from './metal-roof-engine';

export {
  pitchFactor,
  pitchToDegrees,
  degreesToPitch,
  SQFT_PER_SQUARE,
  M2_PER_SQUARE,
  SHINGLE_TYPES,
  UNDERLAYMENTS,
  WASTE_PRESETS,
};

const round2 = (n: number) => Math.round(n * 100) / 100;
const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

// ---------- Material Options & Sourced Defaults ----------
export type RoofingMaterialId =
  | 'threeTab'
  | 'architectural'
  | 'premium'
  | 'standingSeam'
  | 'corrugated'
  | 'clayTile'
  | 'concreteTile'
  | 'slate'
  | 'woodShake'
  | 'flatMembrane';

export interface RoofingMaterialInfo {
  id: RoofingMaterialId;
  label: string;
  category: 'asphalt' | 'metal' | 'tile' | 'natural' | 'flat';
  /** Installed total cost per square ($/100 sq ft) */
  installedRange: [number, number];
  defaultInstalledPerSquare: number;
  /** Material-only cost per square */
  materialRange: [number, number];
  defaultMaterialPerSquare: number;
  /** Labour-only cost per square */
  laborRange: [number, number];
  defaultLaborPerSquare: number;
  /** Expected lifespan in years [min, max] */
  lifespan: [number, number];
  typicalLifespan: number;
  warranty: string;
  note: string;
}

/**
 * Public, dated sources for default roofing material & labour rates:
 * - Asphalt (3-tab, architectural): Fixr (2026), HomeGuide (2026), matches metal-roof-engine ASPHALTS ($4-$6/sq ft = $400-$600/square)
 * - Metal (standing seam, corrugated): HomeGuide (2026), This Old House (Mar 2026), matches metal-roof-engine METALS
 * - Tile (clay, concrete): Fixr (2026), HomeGuide (2026: concrete $8-$18/sq ft, clay $12-$25/sq ft)
 * - Natural Slate: This Old House (2026: $15-$35/sq ft = $1,500-$3,500/square)
 * - Wood Shake: HomeGuide (2026: $7-$15/sq ft = $700-$1,500/square)
 * - Flat (EPDM/TPO): HomeGuide (2026: $5-$11/sq ft = $500-$1,100/square)
 * - Roofer wages: US Bureau of Labor Statistics (BLS OEWS SOC 47-2181 Roofers mean wage)
 */
export const ROOFING_MATERIALS: Record<RoofingMaterialId, RoofingMaterialInfo> = {
  threeTab: {
    id: 'threeTab',
    label: '3-Tab Asphalt Shingles',
    category: 'asphalt',
    installedRange: [300, 500],
    defaultInstalledPerSquare: 400,
    materialRange: [110, 180],
    defaultMaterialPerSquare: 145,
    laborRange: [190, 320],
    defaultLaborPerSquare: 255,
    lifespan: [15, 20],
    typicalLifespan: 18,
    warranty: '20–25 years',
    note: 'Economical, flat 12×36 in rectangular tabs. Best for budget replacements or mild climates.',
  },
  architectural: {
    id: 'architectural',
    label: 'Architectural Shingles (Laminated)',
    category: 'asphalt',
    installedRange: [400, 600],
    defaultInstalledPerSquare: 500,
    materialRange: [150, 240],
    defaultMaterialPerSquare: 195,
    laborRange: [250, 360],
    defaultLaborPerSquare: 305,
    lifespan: [25, 30],
    typicalLifespan: 28,
    warranty: '30–50 years (Limited Lifetime)',
    note: 'Most popular US residential choice. Multi-layered dimension, enhanced wind resistance (up to 130 mph).',
  },
  premium: {
    id: 'premium',
    label: 'Designer / Luxury Asphalt Shingles',
    category: 'asphalt',
    installedRange: [600, 900],
    defaultInstalledPerSquare: 750,
    materialRange: [260, 420],
    defaultMaterialPerSquare: 340,
    laborRange: [340, 480],
    defaultLaborPerSquare: 410,
    lifespan: [30, 50],
    typicalLifespan: 40,
    warranty: 'Lifetime / 50 years',
    note: 'Thick, heavy multi-laminate shingles simulating hand-cut slate or cedar shake.',
  },
  standingSeam: {
    id: 'standingSeam',
    label: 'Metal: Standing Seam',
    category: 'metal',
    installedRange: [900, 1600],
    defaultInstalledPerSquare: 1250,
    materialRange: [400, 750],
    defaultMaterialPerSquare: 575,
    laborRange: [500, 850],
    defaultLaborPerSquare: 675,
    lifespan: [50, 70],
    typicalLifespan: 60,
    warranty: '30–50 years',
    note: 'Concealed fasteners, raised vertical interlocking ribs. Exceptional weather & snow shedding.',
  },
  corrugated: {
    id: 'corrugated',
    label: 'Metal: Corrugated / Exposed Fastener',
    category: 'metal',
    installedRange: [500, 1200],
    defaultInstalledPerSquare: 850,
    materialRange: [220, 480],
    defaultMaterialPerSquare: 350,
    laborRange: [280, 720],
    defaultLaborPerSquare: 500,
    lifespan: [40, 60],
    typicalLifespan: 50,
    warranty: '20–40 years',
    note: 'Affordable sheet metal screwed through rubber grommets into deck. Fast install.',
  },
  concreteTile: {
    id: 'concreteTile',
    label: 'Concrete Roof Tile',
    category: 'tile',
    installedRange: [800, 1800],
    defaultInstalledPerSquare: 1300,
    materialRange: [320, 700],
    defaultMaterialPerSquare: 510,
    laborRange: [480, 1100],
    defaultLaborPerSquare: 790,
    lifespan: [50, 75],
    typicalLifespan: 60,
    warranty: '50 years',
    note: 'Durable, Class A fire rated. Heavy (800–1,100 lbs/sq); requires structural inspection.',
  },
  clayTile: {
    id: 'clayTile',
    label: 'Clay / Spanish Roof Tile',
    category: 'tile',
    installedRange: [1200, 2500],
    defaultInstalledPerSquare: 1850,
    materialRange: [500, 1100],
    defaultMaterialPerSquare: 800,
    laborRange: [700, 1400],
    defaultLaborPerSquare: 1050,
    lifespan: [60, 100],
    typicalLifespan: 80,
    warranty: '50–100 years',
    note: 'Classic Mediterranean/Mission aesthetic. Natural baked terra cotta, non-combustible.',
  },
  slate: {
    id: 'slate',
    label: 'Natural Quarry Slate',
    category: 'natural',
    installedRange: [1500, 3500],
    defaultInstalledPerSquare: 2500,
    materialRange: [650, 1500],
    defaultMaterialPerSquare: 1075,
    laborRange: [850, 2000],
    defaultLaborPerSquare: 1425,
    lifespan: [75, 150],
    typicalLifespan: 100,
    warranty: '75–100+ years',
    note: 'Generational stone roofing. Unmatched elegance and fire protection; highly skilled artisan install.',
  },
  woodShake: {
    id: 'woodShake',
    label: 'Cedar Wood Shake / Shingle',
    category: 'natural',
    installedRange: [700, 1500],
    defaultInstalledPerSquare: 1100,
    materialRange: [320, 680],
    defaultMaterialPerSquare: 500,
    laborRange: [380, 820],
    defaultLaborPerSquare: 600,
    lifespan: [25, 40],
    typicalLifespan: 30,
    warranty: '20–30 years',
    note: 'Rustic textured western red cedar. Natural insulator; requires periodic treating and fire-retardant.',
  },
  flatMembrane: {
    id: 'flatMembrane',
    label: 'Flat / Low-Slope Membrane (TPO / EPDM)',
    category: 'flat',
    installedRange: [500, 1100],
    defaultInstalledPerSquare: 800,
    materialRange: [200, 450],
    defaultMaterialPerSquare: 325,
    laborRange: [300, 650],
    defaultLaborPerSquare: 475,
    lifespan: [20, 30],
    typicalLifespan: 25,
    warranty: '20–30 years',
    note: 'Single-ply rubber (EPDM) or heat-welded thermoplastic (TPO) for low-slope roofs (≤ 2/12 pitch).',
  },
};

export const materialById = (id: string): RoofingMaterialInfo =>
  ROOFING_MATERIALS[id as RoofingMaterialId] || ROOFING_MATERIALS.architectural;

// ---------- Multipliers (Stories, Pitch, Complexity) ----------
export const STORIES_MULTIPLIERS: Record<string, { label: string; factor: number }> = {
  '1': { label: '1 Story (Standard)', factor: 1.0 },
  '1.5': { label: '1.5 Stories', factor: 1.1 },
  '2': { label: '2 Stories (Two-story lift/scaffolding)', factor: 1.2 },
  '3': { label: '3+ Stories (High elevation safety/rigging)', factor: 1.35 },
};

export const COMPLEXITY_MULTIPLIERS: Record<string, { label: string; factor: number; wastePercent: number }> = {
  simple: { label: 'Simple Gable / Shed (Minimal valleys)', factor: 1.0, wastePercent: 10 },
  hip: { label: 'Hip Roof / Standard (Hips & ridges)', factor: 1.08, wastePercent: 15 },
  complex: { label: 'Cut-Up / Dormers / Multiple Valleys', factor: 1.22, wastePercent: 20 },
};

/** Steep slope threshold: 8/12 pitch (approx 33.7°). OSHA & trade standard for steep-slope safety rigging. */
export const STEEP_SLOPE_THRESHOLD_RISE = 8;
export const DEFAULT_STEEP_SLOPE_SURCHARGE_PCT = 20; // +20% on labour

/** Tear-off constants (reused from HomeGuide 2026 & metal-roof-engine) */
export const DEFAULT_TEAR_OFF_PER_SQUARE_PER_LAYER = TEAR_OFF_PRICE * 100; // $200 per square ($2/sq ft)
export const TEAR_OFF_RANGE_PER_SQUARE = [TEAR_OFF_RANGE[0] * 100, TEAR_OFF_RANGE[1] * 100]; // $100–$300/square

/** Decking (OSB / Plywood 4x8 sheet = 32 sq ft) replacement cost installed */
export const DEFAULT_DECKING_SHEET_PRICE = 80; // $80 per 4×8 sheet installed (HomeGuide/Angi: $60–$120)

/** Dumpster / Disposal */
export const SQUARES_PER_DUMPSTER = 35; // typical 10–20 yard roll-off holds approx 35 squares of 1-layer shingles
export const DEFAULT_DUMPSTER_PRICE = 475; // average 20-yard roll-off dumpster cost (Fixr: $380–$550)

/** Underlayment, Ice & Water, Flashing, Vent Defaults */
export const DEFAULT_ICE_WATER_ROLL_PRICE = 95; // 200 sq ft roll (36 in × 66.7 ft)
export const DEFAULT_UNDERLAYMENT_SYNTHETIC_ROLL_PRICE = 110; // 1,000 sq ft roll
export const DEFAULT_DRIP_EDGE_PER_LF = 2.5; // $/linear foot installed
export const DEFAULT_RIDGE_VENT_PER_LF = 10.0; // $/linear foot installed
export const DEFAULT_PIPE_BOOT_PRICE = 85; // each installed
export const DEFAULT_CHIMNEY_FLASHING_PRICE = 375; // each
export const DEFAULT_SKYLIGHT_FLASHING_PRICE = 225; // each
export const DEFAULT_GUTTER_PER_LF = 10.5; // $/linear foot seamless aluminum gutters
export const DEFAULT_PERMIT_FEE = 250; // flat municipal building permit allowance

// ---------- Calculator Input & Result Interfaces ----------
export interface RoofReplacementInput {
  /** Mode: 'quick' calculates from house footprint + pitch; 'detailed' uses specific sections */
  mode?: 'quick' | 'detailed';
  /** Ground footprint in sq ft (or living area ÷ stories) */
  footprintSqFt?: number;
  /** Roof pitch rise in inches per 12 inches run (e.g., 6 for 6/12 pitch) */
  pitchRise?: number;
  /** Eaves & rakes overhang in inches (default 12 in = 1 ft all round) */
  overhangInches?: number;
  /** Custom roof sections if detailed mode */
  sections?: RoofSection[];
  /** Or directly entered measured roof surface area */
  directRoofAreaSqFt?: number;

  /** Material selection */
  materialId?: RoofingMaterialId;
  /** Custom unit prices if user overrides defaults ($/square) */
  customMaterialPerSquare?: number;
  customLaborPerSquare?: number;

  /** Roof configuration & conditions */
  stories?: '1' | '1.5' | '2' | '3';
  complexity?: 'simple' | 'hip' | 'complex';
  /** Number of existing shingle layers to tear off (0 = new construction / overlay; 1 = 1 layer; 2 = 2 layers) */
  existingLayers?: number;
  customTearOffPerSquare?: number;

  /** Decking replacement allowance: percent (0, 10, 25, 50, 100) or explicit sheets */
  deckingReplacePercent?: number;
  customDeckingSheets?: number;
  customDeckingPricePerSheet?: number;

  /** Add-ons & Underlayment */
  underlaymentType?: 'synthetic' | 'felt15' | 'felt30';
  includeIceAndWater?: boolean;
  iceWaterEavesWidthFt?: number; // default 3 ft
  hasValleys?: boolean;

  /** Flashing & penetrations */
  pipeBootsCount?: number;
  chimneyCount?: number;
  skylightCount?: number;
  includeDripEdge?: boolean;
  includeRidgeVent?: boolean;

  /** Gutters & Exterior Extras */
  includeGutters?: boolean;
  gutterLengthLf?: number;
  gutterPricePerLf?: number;

  /** Permit & Dumpster */
  permitFee?: number;
  customDumpsterPrice?: number;

  /** Location & Contingency adjustment */
  regionMultiplier?: number; // 0.7 to 1.4, default 1.0
  contingencyPercent?: number; // default 10%
}

export interface LineItem {
  id: string;
  label: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  lowCost: number;
  highCost: number;
  percentOfTotal: number;
  category: 'materials' | 'labor' | 'tearOff' | 'decking' | 'disposal' | 'addons' | 'permit';
}

export interface CompareOption {
  type: 'repair' | 'overlay' | 'replacement';
  title: string;
  totalCost: number;
  lowCost: number;
  highCost: number;
  costPerSquare: number;
  isPermitted: boolean;
  restrictionNote?: string;
  description: string;
}

export interface RoofReplacementResult {
  /** Core geometric measurements */
  pitchRise: number;
  pitchFactorVal: number;
  footprintSqFt: number;
  roofAreaSqFt: number;
  roofAreaM2: number;
  wastePercent: number;
  totalSquares: number; // includes waste

  /** Material chosen */
  material: RoofingMaterialInfo;
  materialUnitCost: number;
  laborUnitCost: number;

  /** Cost Totals */
  total: number;
  low: number;
  high: number;
  costPerSquare: number;
  costPerSqFt: number;
  laborPerSquareVal: number;

  /** Category breakdown */
  materialTotal: number;
  laborTotal: number;
  tearOffTotal: number;
  disposalTotal: number;
  deckingTotal: number;
  addonsTotal: number;
  permitTotal: number;
  subtotal: number;
  contingencyAmount: number;

  /** Quantities */
  shingleBundles: number;
  underlaymentRolls: number;
  iceWaterRolls: number;
  dumpsterCount: number;
  deckingSheets: number;
  dripEdgeLf: number;
  ridgeCapLf: number;
  ridgeVentLf: number;

  /** Line Items & Comparisons */
  lineItems: LineItem[];
  compareOptions: CompareOption[];
  quoteCheck: (quote: number) => { status: 'below' | 'within' | 'above' | 'n/a'; diffPercent: number; diffAmount: number };
}

// ---------- Main Calculation Engine Function ----------
export function calculateRoofReplacement(rawInput: RoofReplacementInput = {}): RoofReplacementResult {
  const footprint = pos(rawInput.footprintSqFt ?? 2000);
  const pitchRise = Math.max(0, rawInput.pitchRise ?? 6);
  const overhangIn = rawInput.overhangInches ?? 12;
  const overhangFt = overhangIn / 12;

  const mat = materialById(rawInput.materialId || 'architectural');
  const stories = rawInput.stories || '1';
  const complexity = rawInput.complexity || 'hip';
  const layers = Math.max(0, Math.min(3, Math.round(rawInput.existingLayers ?? 1)));

  const pf = pitchFactor(pitchRise);

  // 1. Calculate true roof area
  let roofArea = 0;
  let eavesLf = 0;
  let rakesLf = 0;
  let ridgeLf = 0;

  if (rawInput.directRoofAreaSqFt && rawInput.directRoofAreaSqFt > 0) {
    roofArea = rawInput.directRoofAreaSqFt;
    // Estimate perimeter features from area for add-ons
    const side = Math.sqrt(roofArea / pf);
    eavesLf = round2(2 * side);
    rakesLf = round2(2 * side * pf);
    ridgeLf = round2(side);
  } else if (rawInput.sections && rawInput.sections.length > 0) {
    for (const sec of rawInput.sections) {
      const geom = sectionGeometry(sec);
      roofArea += geom.roofArea;
      eavesLf += geom.eaves;
      rakesLf += geom.rakes;
      ridgeLf += geom.ridge;
    }
  } else {
    // Quick Mode: Model house footprint as rectangular aspect ratio ~1.5:1
    // Area = L * W => W = sqrt(footprint / 1.5), L = 1.5 * W
    const w = Math.sqrt(footprint / 1.5);
    const l = 1.5 * w;
    const lWithOverhang = l + 2 * overhangFt;
    const wWithOverhang = w + 2 * overhangFt;

    // Projected horizontal area with eaves/rakes
    const horizontalProjectedArea = lWithOverhang * wWithOverhang;
    roofArea = round2(horizontalProjectedArea * pf);

    eavesLf = round2(2 * lWithOverhang);
    rakesLf = round2(2 * wWithOverhang * pf);
    ridgeLf = round2(lWithOverhang);
  }

  // 2. Waste & Squares
  const compInfo = COMPLEXITY_MULTIPLIERS[complexity] || COMPLEXITY_MULTIPLIERS.hip;
  const wastePct = compInfo.wastePercent;
  const netSquares = roofArea / SQFT_PER_SQUARE;
  const totalSquares = round2((roofArea * (1 + wastePct / 100)) / SQFT_PER_SQUARE);

  // 3. Multipliers for labour
  const storiesMult = (STORIES_MULTIPLIERS[stories] || STORIES_MULTIPLIERS['1']).factor;
  const compMult = compInfo.factor;
  const isSteep = pitchRise >= STEEP_SLOPE_THRESHOLD_RISE;
  const steepMult = isSteep ? 1 + DEFAULT_STEEP_SLOPE_SURCHARGE_PCT / 100 : 1.0;
  const combinedLaborMultiplier = storiesMult * compMult * steepMult;

  // 4. Unit Costs
  const matPerSquare = rawInput.customMaterialPerSquare ?? mat.defaultMaterialPerSquare;
  const baseLaborPerSquare = rawInput.customLaborPerSquare ?? mat.defaultLaborPerSquare;
  const laborPerSquareAdjusted = round2(baseLaborPerSquare * combinedLaborMultiplier);

  // Material cost
  const materialCost = round2(totalSquares * matPerSquare);
  const materialLow = round2(totalSquares * mat.materialRange[0]);
  const materialHigh = round2(totalSquares * mat.materialRange[1]);

  // Labour cost
  const laborCost = round2(totalSquares * laborPerSquareAdjusted);
  const laborLow = round2(totalSquares * mat.laborRange[0] * combinedLaborMultiplier);
  const laborHigh = round2(totalSquares * mat.laborRange[1] * combinedLaborMultiplier);

  // 5. Tear-Off Cost
  const tearOffRate = rawInput.customTearOffPerSquare ?? DEFAULT_TEAR_OFF_PER_SQUARE_PER_LAYER;
  const tearOffCost = round2(netSquares * layers * tearOffRate);
  const tearOffLow = round2(netSquares * layers * TEAR_OFF_RANGE_PER_SQUARE[0]);
  const tearOffHigh = round2(netSquares * layers * TEAR_OFF_RANGE_PER_SQUARE[1]);

  // 6. Disposal & Dumpster
  const dumpsterPrice = rawInput.customDumpsterPrice ?? DEFAULT_DUMPSTER_PRICE;
  const dumpsterCount = layers > 0 ? Math.max(1, Math.ceil((totalSquares * layers) / SQUARES_PER_DUMPSTER)) : 0;
  const disposalCost = round2(dumpsterCount * dumpsterPrice);
  const disposalLow = round2(dumpsterCount * 380);
  const disposalHigh = round2(dumpsterCount * 550);

  // 7. Decking (Sheathing Replacement)
  const deckPrice = rawInput.customDeckingPricePerSheet ?? DEFAULT_DECKING_SHEET_PRICE;
  let deckingSheets = 0;
  if (rawInput.customDeckingSheets !== undefined) {
    deckingSheets = Math.max(0, rawInput.customDeckingSheets);
  } else {
    const deckPct = Math.max(0, rawInput.deckingReplacePercent ?? 10); // default 10% damaged decking replaced
    deckingSheets = Math.ceil((roofArea * (deckPct / 100)) / 32);
  }
  const deckingCost = round2(deckingSheets * deckPrice);
  const deckingLow = round2(deckingSheets * 60);
  const deckingHigh = round2(deckingSheets * 110);

  // 8. Add-ons: Underlayment, Ice & Water, Flashing, Vents, Gutters
  const underlayChoice = rawInput.underlaymentType || 'synthetic';
  const underlayInfo = UNDERLAYMENTS.find((u) => u.id === underlayChoice) || UNDERLAYMENTS[0];
  const underlayRolls = Math.max(1, Math.ceil(roofArea / underlayInfo.sqftPerRoll));
  const underlayCost = round2(underlayRolls * DEFAULT_UNDERLAYMENT_SYNTHETIC_ROLL_PRICE);

  const includeIceWater = rawInput.includeIceAndWater ?? true;
  const iceWaterWidth = rawInput.iceWaterEavesWidthFt ?? 3;
  const iceWaterArea = includeIceWater ? (eavesLf + (rawInput.hasValleys ? 40 : 0)) * iceWaterWidth : 0;
  const iceWaterRolls = includeIceWater ? Math.max(1, Math.ceil(iceWaterArea / 200)) : 0;
  const iceWaterCost = round2(iceWaterRolls * DEFAULT_ICE_WATER_ROLL_PRICE);

  const includeDrip = rawInput.includeDripEdge ?? true;
  const dripEdgeLf = includeDrip ? round2(eavesLf + rakesLf) : 0;
  const dripEdgeCost = round2(dripEdgeLf * DEFAULT_DRIP_EDGE_PER_LF);

  const includeVent = rawInput.includeRidgeVent ?? true;
  const ridgeVentLf = includeVent ? round2(ridgeLf) : 0;
  const ridgeVentCost = round2(ridgeVentLf * DEFAULT_RIDGE_VENT_PER_LF);

  // Penetration Flashing
  const pipeBoots = rawInput.pipeBootsCount ?? 3;
  const chimneys = rawInput.chimneyCount ?? 1;
  const skylights = rawInput.skylightCount ?? 0;
  const flashingCost = round2(
    pipeBoots * DEFAULT_PIPE_BOOT_PRICE +
    chimneys * DEFAULT_CHIMNEY_FLASHING_PRICE +
    skylights * DEFAULT_SKYLIGHT_FLASHING_PRICE
  );

  // Gutters (optional)
  const includeGutters = rawInput.includeGutters ?? false;
  const gutterLf = includeGutters ? (rawInput.gutterLengthLf ?? eavesLf) : 0;
  const gutterRate = rawInput.gutterPricePerLf ?? DEFAULT_GUTTER_PER_LF;
  const gutterCost = round2(gutterLf * gutterRate);

  const addonsTotal = round2(underlayCost + iceWaterCost + dripEdgeCost + ridgeVentCost + flashingCost + gutterCost);
  const addonsLow = round2(addonsTotal * 0.85);
  const addonsHigh = round2(addonsTotal * 1.25);

  // 9. Permit Fee
  const permitFee = Math.max(0, rawInput.permitFee ?? DEFAULT_PERMIT_FEE);

  // 10. Subtotal, Region & Contingency
  const region = Math.max(0.5, Math.min(2.0, rawInput.regionMultiplier ?? 1.0));
  const contingencyPct = Math.max(0, Math.min(50, rawInput.contingencyPercent ?? 10));

  const subtotalBeforeAdjust = round2(
    materialCost + laborCost + tearOffCost + disposalCost + deckingCost + addonsTotal + permitFee
  );

  const subtotalLowBeforeAdjust = round2(
    materialLow + laborLow + tearOffLow + disposalLow + deckingLow + addonsLow + permitFee
  );

  const subtotalHighBeforeAdjust = round2(
    materialHigh + laborHigh + tearOffHigh + disposalHigh + deckingHigh + addonsHigh + permitFee
  );

  const subtotalRegional = round2(subtotalBeforeAdjust * region);
  const contingencyAmount = round2(subtotalRegional * (contingencyPct / 100));
  const total = round2(subtotalRegional + contingencyAmount);

  const lowRegional = round2(subtotalLowBeforeAdjust * region);
  const low = round2(lowRegional * (1 + contingencyPct / 100));

  const highRegional = round2(subtotalHighBeforeAdjust * region);
  const high = round2(highRegional * (1 + contingencyPct / 100));

  const costPerSquare = netSquares > 0 ? round2(total / netSquares) : 0;
  const costPerSqFt = roofArea > 0 ? round2(total / roofArea) : 0;

  // 11. Shingle Bundles count helper
  const shingleBundles = Math.ceil(totalSquares * 3);
  const ridgeCapLf = round2(ridgeLf);

  // 12. Line Items Table
  const lineItems: LineItem[] = [
    {
      id: 'materials',
      label: `${mat.label} (Covering)`,
      quantity: totalSquares,
      unit: 'squares',
      unitCost: matPerSquare,
      totalCost: round2(materialCost * region * (1 + contingencyPct / 100)),
      lowCost: round2(materialLow * region * (1 + contingencyPct / 100)),
      highCost: round2(materialHigh * region * (1 + contingencyPct / 100)),
      percentOfTotal: total > 0 ? round2((materialCost / subtotalBeforeAdjust) * 100) : 0,
      category: 'materials',
    },
    {
      id: 'labor',
      label: `Roofing Installation Labour (${stories} stories${isSteep ? ', steep-slope' : ''})`,
      quantity: totalSquares,
      unit: 'squares',
      unitCost: laborPerSquareAdjusted,
      totalCost: round2(laborCost * region * (1 + contingencyPct / 100)),
      lowCost: round2(laborLow * region * (1 + contingencyPct / 100)),
      highCost: round2(laborHigh * region * (1 + contingencyPct / 100)),
      percentOfTotal: total > 0 ? round2((laborCost / subtotalBeforeAdjust) * 100) : 0,
      category: 'labor',
    },
    {
      id: 'tearOff',
      label: `Tear-Off Existing Roofing (${layers} layer${layers === 1 ? '' : 's'})`,
      quantity: round2(netSquares * layers),
      unit: 'sq-layers',
      unitCost: tearOffRate,
      totalCost: round2(tearOffCost * region * (1 + contingencyPct / 100)),
      lowCost: round2(tearOffLow * region * (1 + contingencyPct / 100)),
      highCost: round2(tearOffHigh * region * (1 + contingencyPct / 100)),
      percentOfTotal: total > 0 ? round2((tearOffCost / subtotalBeforeAdjust) * 100) : 0,
      category: 'tearOff',
    },
    {
      id: 'disposal',
      label: `Debris Disposal (${dumpsterCount} roll-off dumpster${dumpsterCount === 1 ? '' : 's'})`,
      quantity: dumpsterCount,
      unit: 'dumpsters',
      unitCost: dumpsterPrice,
      totalCost: round2(disposalCost * region * (1 + contingencyPct / 100)),
      lowCost: round2(disposalLow * region * (1 + contingencyPct / 100)),
      highCost: round2(disposalHigh * region * (1 + contingencyPct / 100)),
      percentOfTotal: total > 0 ? round2((disposalCost / subtotalBeforeAdjust) * 100) : 0,
      category: 'disposal',
    },
    {
      id: 'decking',
      label: `Decking / Sheathing Replacement (${deckingSheets} sheets 4×8)`,
      quantity: deckingSheets,
      unit: 'sheets',
      unitCost: deckPrice,
      totalCost: round2(deckingCost * region * (1 + contingencyPct / 100)),
      lowCost: round2(deckingLow * region * (1 + contingencyPct / 100)),
      highCost: round2(deckingHigh * region * (1 + contingencyPct / 100)),
      percentOfTotal: total > 0 ? round2((deckingCost / subtotalBeforeAdjust) * 100) : 0,
      category: 'decking',
    },
    {
      id: 'addons',
      label: 'Underlayment, Flashing, Drip Edge & Vents',
      quantity: 1,
      unit: 'job pack',
      unitCost: addonsTotal,
      totalCost: round2(addonsTotal * region * (1 + contingencyPct / 100)),
      lowCost: round2(addonsLow * region * (1 + contingencyPct / 100)),
      highCost: round2(addonsHigh * region * (1 + contingencyPct / 100)),
      percentOfTotal: total > 0 ? round2((addonsTotal / subtotalBeforeAdjust) * 100) : 0,
      category: 'addons',
    },
    {
      id: 'permit',
      label: 'Local Building Permit & Inspection Allowance',
      quantity: 1,
      unit: 'permit',
      unitCost: permitFee,
      totalCost: round2(permitFee),
      lowCost: round2(permitFee * 0.8),
      highCost: round2(permitFee * 1.3),
      percentOfTotal: total > 0 ? round2((permitFee / subtotalBeforeAdjust) * 100) : 0,
      category: 'permit',
    },
  ];

  // 13. Comparison Options: Repair vs Overlay vs Full Replacement
  // Overlay: full replacement minus tear-off and disposal
  // IRC R908.3.1.1: Recovering is NOT permitted where existing roof has two or more applications of any type of roof covering.
  const isOverlayPermitted = layers < 2;
  const overlayTotal = isOverlayPermitted
    ? round2((materialCost + laborCost + addonsTotal + permitFee) * region * (1 + contingencyPct / 100))
    : 0;
  const overlayLow = isOverlayPermitted ? round2(overlayTotal * 0.88) : 0;
  const overlayHigh = isOverlayPermitted ? round2(overlayTotal * 1.15) : 0;

  // Typical repair: patch 100–250 sq ft or isolated leak repair ($350–$1,200)
  const repairTypical = round2(Math.min(1250, Math.max(450, total * 0.08)));
  const repairLow = round2(repairTypical * 0.65);
  const repairHigh = round2(repairTypical * 1.5);

  const compareOptions: CompareOption[] = [
    {
      type: 'repair',
      title: 'Spot Repair / Leak Fix',
      totalCost: repairTypical,
      lowCost: repairLow,
      highCost: repairHigh,
      costPerSquare: round2(repairTypical / 2),
      isPermitted: true,
      description: 'Patching isolated flashing, pipe boots, or minor wind-damaged shingle tabs. Ideal when >80% of roof has remaining life.',
    },
    {
      type: 'overlay',
      title: 'Overlay / Reroof (2nd Layer)',
      totalCost: overlayTotal,
      lowCost: overlayLow,
      highCost: overlayHigh,
      costPerSquare: netSquares > 0 ? round2(overlayTotal / netSquares) : 0,
      isPermitted: isOverlayPermitted,
      restrictionNote: isOverlayPermitted
        ? 'Allowed only over 1 smooth existing layer (saves tear-off and dumpster costs).'
        : 'BLOCKED by IRC R908.3.1.1: Building code prohibits re-covering roofs with 2 or more existing layers. Full tear-off required.',
      description: 'Laying new shingles directly over existing layer. Saves $1,500–$3,500 on tear-off, but hides wood deck rot.',
    },
    {
      type: 'replacement',
      title: 'Full Tear-Off & Replacement',
      totalCost: total,
      lowCost: low,
      highCost: high,
      costPerSquare: costPerSquare,
      isPermitted: true,
      description: 'Complete removal down to the decking, inspection/repair of wood sheathing, new ice & water shield, underlayment, and full warranty.',
    },
  ];

  // 14. Quote Check Helper
  const quoteCheck = (quote: number) => {
    if (!(quote > 0) || !(total > 0)) {
      return { status: 'n/a' as const, diffPercent: 0, diffAmount: 0 };
    }
    const diff = round2(quote - total);
    const pct = round2((diff / total) * 100);

    if (quote < low) {
      return { status: 'below' as const, diffPercent: pct, diffAmount: diff };
    }
    if (quote > high) {
      return { status: 'above' as const, diffPercent: pct, diffAmount: diff };
    }
    return { status: 'within' as const, diffPercent: pct, diffAmount: diff };
  };

  return {
    pitchRise,
    pitchFactorVal: round2(pf),
    footprintSqFt: footprint,
    roofAreaSqFt: roofArea,
    roofAreaM2: round2(roofArea / 10.7639104),
    wastePercent: wastePct,
    totalSquares,
    material: mat,
    materialUnitCost: matPerSquare,
    laborUnitCost: laborPerSquareAdjusted,
    total,
    low,
    high,
    costPerSquare,
    costPerSqFt,
    laborPerSquareVal: laborPerSquareAdjusted,
    materialTotal: round2(materialCost * region * (1 + contingencyPct / 100)),
    laborTotal: round2(laborCost * region * (1 + contingencyPct / 100)),
    tearOffTotal: round2(tearOffCost * region * (1 + contingencyPct / 100)),
    disposalTotal: round2(disposalCost * region * (1 + contingencyPct / 100)),
    deckingTotal: round2(deckingCost * region * (1 + contingencyPct / 100)),
    addonsTotal: round2(addonsTotal * region * (1 + contingencyPct / 100)),
    permitTotal: permitFee,
    subtotal: subtotalRegional,
    contingencyAmount,
    shingleBundles,
    underlaymentRolls: underlayRolls,
    iceWaterRolls,
    dumpsterCount,
    deckingSheets,
    dripEdgeLf,
    ridgeCapLf,
    ridgeVentLf,
    lineItems,
    compareOptions,
    quoteCheck,
  };
}

// ---------- Quick Mode Helper ----------
export function quickEstimate(
  footprintSqFt = 2000,
  pitchRise = 6,
  materialId: RoofingMaterialId = 'architectural',
  layers = 1,
  stories: '1' | '1.5' | '2' | '3' = '1'
): RoofReplacementResult {
  return calculateRoofReplacement({
    mode: 'quick',
    footprintSqFt,
    pitchRise,
    materialId,
    existingLayers: layers,
    stories,
  });
}

// ---------- Home Size Benchmark Table (For Page Content & FAQ) ----------
export interface HomeSizeRow {
  homeFootprintSqFt: number;
  pitch: string;
  roofAreaSqFt: number;
  squares: number;
  lowCost: number;
  typicalCost: number;
  highCost: number;
  costPerSquare: number;
}

export function homeSizeTable(materialId: RoofingMaterialId = 'architectural'): HomeSizeRow[] {
  const sizes = [1000, 1500, 2000, 2500, 3000];
  return sizes.map((footprint) => {
    const res = quickEstimate(footprint, 6, materialId, 1, '1');
    return {
      homeFootprintSqFt: footprint,
      pitch: '6/12',
      roofAreaSqFt: res.roofAreaSqFt,
      squares: res.totalSquares,
      lowCost: res.low,
      typicalCost: res.total,
      highCost: res.high,
      costPerSquare: res.costPerSquare,
    };
  });
}

// ---------- Material Comparison Matrix (Upfront, Lifespan, Annual Cost) ----------
export interface MaterialComparisonRow {
  id: RoofingMaterialId;
  label: string;
  category: string;
  totalCost: number;
  costPerSquare: number;
  lifespanYears: number;
  costPerYear: number;
  warranty: string;
}

export function materialComparison(
  footprintSqFt = 2000,
  pitchRise = 6,
  layers = 1
): MaterialComparisonRow[] {
  const materialKeys = Object.keys(ROOFING_MATERIALS) as RoofingMaterialId[];
  return materialKeys.map((mid) => {
    const res = quickEstimate(footprintSqFt, pitchRise, mid, layers);
    const life = res.material.typicalLifespan;
    const costPerYear = round2(res.total / life);
    return {
      id: mid,
      label: res.material.label,
      category: res.material.category,
      totalCost: res.total,
      costPerSquare: res.costPerSquare,
      lifespanYears: life,
      costPerYear,
      warranty: res.material.warranty,
    };
  });
}

// ---------- Separate Labour Per Square Helper (for Keyword Targeting) ----------
export function laborPerSquare(
  materialId: RoofingMaterialId = 'architectural',
  stories: '1' | '1.5' | '2' | '3' = '1',
  pitchRise = 6,
  complexity: 'simple' | 'hip' | 'complex' = 'hip'
): { low: number; typical: number; high: number } {
  const mat = materialById(materialId);
  const storiesMult = (STORIES_MULTIPLIERS[stories] || STORIES_MULTIPLIERS['1']).factor;
  const compMult = (COMPLEXITY_MULTIPLIERS[complexity] || COMPLEXITY_MULTIPLIERS.hip).factor;
  const isSteep = pitchRise >= STEEP_SLOPE_THRESHOLD_RISE;
  const steepMult = isSteep ? 1 + DEFAULT_STEEP_SLOPE_SURCHARGE_PCT / 100 : 1.0;
  const mult = storiesMult * compMult * steepMult;

  return {
    low: round2(mat.laborRange[0] * mult),
    typical: round2(mat.defaultLaborPerSquare * mult),
    high: round2(mat.laborRange[1] * mult),
  };
}
