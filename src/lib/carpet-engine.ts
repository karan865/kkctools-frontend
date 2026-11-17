/**
 * Carpet Cost Calculator Engine (Tool #37, Batch 2 #17).
 *
 * Implements pure calculations for:
 * - Room-by-room takeoff with roll width optimization (12 ft, 13.5 ft, 15 ft) & seam minimization
 * - Stair geometry (waterfall vs box/cap & band, treads, risers, nosing wrap, landing)
 * - Carpet grades, fibres (nylon, polyester, triexta, olefin, wool), and styles (plush, berber, frieze, pattern, tiles)
 * - Padding options (thickness & density requirements per CRI warranty guidelines)
 * - Comprehensive labour & extras (tear-off, haul-away disposal, tack strip, transitions, subfloor repair, doors, furniture)
 * - Quick room benchmark matrices (10x10 to whole house)
 * - Contractor quote verifier & alternative flooring comparisons (LVP, Laminate, Hardwood Refinishing)
 *
 * All price defaults derived from dated, verifiable public sources:
 * HomeAdvisor/Angi (Jun 2026), Fixr (Jan 2026), HomeGuide (2026), Homewyse (May 2026), BLS SOC 47-2041.
 * Pure functions, zero network, zero side effects.
 */

export const SQFT_PER_SQYD = 9;
export const SQFT_PER_M2 = 10.7639104;

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export interface PriceRange {
  low: number;
  typical: number;
  high: number;
  unit: string;
  source: string;
  asOf: string;
}

export const createPriceRange = (
  low: number,
  typical: number,
  high: number,
  unit = '$/sq ft',
  source = 'HomeAdvisor / Fixr 2026',
  asOf = '2026-06'
): PriceRange => ({ low, typical, high, unit, source, asOf });

// ---------- Carpet Material Grades ----------
export type CarpetGrade = 'budget' | 'mid' | 'premium';

export interface GradeInfo extends PriceRange {
  id: CarpetGrade;
  name: string;
  description: string;
  typicalLifespanYears: number;
}

export const CARPET_GRADES: Record<CarpetGrade, GradeInfo> = {
  budget: {
    id: 'budget',
    name: 'Builder / Budget Grade',
    description: 'Polyester or olefin loop, entry-level density, ideal for rentals or quick flips',
    typicalLifespanYears: 5,
    ...createPriceRange(1.0, 1.75, 2.5, '$/sq ft', 'HomeAdvisor / HomeGuide', '2026-06'),
  },
  mid: {
    id: 'mid',
    name: 'Mid-Grade (Most Popular)',
    description: 'Durable nylon or triexta, stain-resistant, medium face weight (35–45 oz)',
    typicalLifespanYears: 10,
    ...createPriceRange(2.5, 4.0, 5.5, '$/sq ft', 'HomeAdvisor / Fixr', '2026-06'),
  },
  premium: {
    id: 'premium',
    name: 'Premium / Luxury Grade',
    description: 'Heavyweight nylon, premium soft triexta or wool blend (50+ oz face weight)',
    typicalLifespanYears: 18,
    ...createPriceRange(5.5, 8.0, 12.0, '$/sq ft', 'HomeAdvisor / Fixr', '2026-06'),
  },
};

// ---------- Carpet Fibres ----------
export type CarpetFibre = 'nylon' | 'polyester' | 'triexta' | 'olefin' | 'wool';

export interface FibreInfo extends PriceRange {
  id: CarpetFibre;
  name: string;
  pros: string;
  cons: string;
}

export const CARPET_FIBRES: Record<CarpetFibre, FibreInfo> = {
  nylon: {
    id: 'nylon',
    name: 'Nylon',
    pros: 'Extremely resilient, resists crushing & matted traffic paths, long-lasting',
    cons: 'Requires factory stain treatment (solution-dyed preferred)',
    ...createPriceRange(2.5, 4.25, 6.0, '$/sq ft', 'Fixr / HomeGuide', '2026-06'),
  },
  polyester: {
    id: 'polyester',
    name: 'Polyester (PET)',
    pros: 'Inherent stain resistance, vibrant fade-resistant colours, budget friendly, eco-recycled',
    cons: 'Less resilient than nylon; prone to crushing in heavy walkways',
    ...createPriceRange(1.0, 2.25, 3.5, '$/sq ft', 'Fixr / HomeGuide', '2026-06'),
  },
  triexta: {
    id: 'triexta',
    name: 'Triexta (SmartStrand / Sorona)',
    pros: 'Permanent built-in stain resistance that never washes off, ultra-soft, resilient',
    cons: 'Higher initial material price than standard polyester',
    ...createPriceRange(3.0, 4.75, 6.5, '$/sq ft', 'Fixr / HomeGuide', '2026-06'),
  },
  olefin: {
    id: 'olefin',
    name: 'Olefin (Polypropylene)',
    pros: 'Hydrophobic (moisture & mildew resistant), bleach-cleanable, affordable',
    cons: 'Attracts oily soils, low heat tolerance (friction burn risk), poor pile memory',
    ...createPriceRange(1.0, 2.0, 3.0, '$/sq ft', 'Fixr / HomeGuide', '2026-06'),
  },
  wool: {
    id: 'wool',
    name: 'Wool',
    pros: '100% natural, flame retardant, luxurious texture, sustainable, 20+ year lifespan',
    cons: 'Highest cost, susceptible to moth damage, requires specialised pH-neutral cleaning',
    ...createPriceRange(6.0, 12.0, 20.0, '$/sq ft', 'Fixr / This Old House', '2026-06'),
  },
};

// ---------- Carpet Styles ----------
export type CarpetStyle = 'plush' | 'berber' | 'frieze' | 'pattern' | 'carpetTiles';

export interface StyleInfo extends PriceRange {
  id: CarpetStyle;
  name: string;
  description: string;
}

export const CARPET_STYLES: Record<CarpetStyle, StyleInfo> = {
  plush: {
    id: 'plush',
    name: 'Plush / Texture (Cut Pile)',
    description: 'Even cut yarns, soft and traditional; textured twist hides vacuum trails',
    ...createPriceRange(2.0, 4.0, 6.0, '$/sq ft', 'Fixr / HomeAdvisor', '2026-06'),
  },
  berber: {
    id: 'berber',
    name: 'Berber / Loop Pile',
    description: 'Continuous uncut loops, exceptionally durable for high-traffic basements & dens',
    ...createPriceRange(1.5, 3.25, 5.0, '$/sq ft', 'Fixr / HomeAdvisor', '2026-06'),
  },
  frieze: {
    id: 'frieze',
    name: 'Frieze / Twisted Shag',
    description: 'High-twist yarns curled in varied directions, superb durability and hides dirt',
    ...createPriceRange(2.5, 4.5, 7.0, '$/sq ft', 'Fixr / HomeAdvisor', '2026-06'),
  },
  pattern: {
    id: 'pattern',
    name: 'Cut and Loop / Pattern',
    description: 'Combination of cut and loop tufts creating decorative geometric or floral patterns',
    ...createPriceRange(3.5, 6.0, 9.0, '$/sq ft', 'Fixr / HomeAdvisor', '2026-06'),
  },
  carpetTiles: {
    id: 'carpetTiles',
    name: 'Carpet Tiles (Modular Squares)',
    description: 'Easy DIY peel-and-stick or glue-down tiles, zero roll waste, modular spot replacement',
    ...createPriceRange(2.0, 3.5, 5.0, '$/sq ft', 'HomeGuide / Homewyse', '2026-06'),
  },
};

// ---------- Cushion / Padding ----------
export type PadType = 'standard' | 'highDensity' | 'luxuryMoisture';

export interface PadInfo extends PriceRange {
  id: PadType;
  name: string;
  thickness: string;
  density: string;
  warrantySuitability: string;
}

export const CARPET_PADS: Record<PadType, PadInfo> = {
  standard: {
    id: 'standard',
    name: 'Standard Rebond Cushion',
    thickness: '3/8 in',
    density: '6 lb',
    warrantySuitability: 'Meets FHA minimum standards; suitable for guest rooms and low traffic',
    ...createPriceRange(0.5, 0.75, 1.0, '$/sq ft', 'HomeAdvisor', '2026-06'),
  },
  highDensity: {
    id: 'highDensity',
    name: 'High-Density Rebond (Recommended)',
    thickness: '7/16 in',
    density: '8 lb',
    warrantySuitability: 'Meets major manufacturer warranties (Shaw, Mohawk); optimal cushion balance',
    ...createPriceRange(0.75, 1.0, 1.35, '$/sq ft', 'HomeAdvisor / Fixr', '2026-06'),
  },
  luxuryMoisture: {
    id: 'luxuryMoisture',
    name: 'Memory Foam / Moisture Barrier',
    thickness: '1/2 in',
    density: '10 lb',
    warrantySuitability: 'Spill-safe spill barrier for pet homes, maximum sound dampening and luxury feel',
    ...createPriceRange(1.0, 1.35, 1.75, '$/sq ft', 'HomeAdvisor / Fixr', '2026-06'),
  },
};

// Overall default padding range
export const DEFAULT_PAD_PRICING = createPriceRange(0.6, 0.9, 1.5, '$/sq ft', 'HomeAdvisor / Fixr', '2026-06');

// ---------- Installation Labour & Extras ----------
export interface ExtraItemDef extends PriceRange {
  id: string;
  name: string;
  defaultUnit: string;
}

export const LABOUR_AND_EXTRAS = {
  installation: createPriceRange(0.75, 1.5, 2.5, '$/sq ft', 'BLS SOC 47-2041 / HomeAdvisor', '2026-06'),
  stairsWaterfall: createPriceRange(5.0, 8.0, 12.0, '$/step', 'Fixr / HomeAdvisor', '2026-06'),
  stairsBox: createPriceRange(10.0, 15.0, 25.0, '$/step', 'Fixr / HomeAdvisor', '2026-06'),
  removal: createPriceRange(0.25, 0.4, 0.6, '$/sq ft', 'HomeAdvisor / Fixr', '2026-06'),
  disposal: createPriceRange(0.15, 0.25, 0.4, '$/sq ft', 'HomeAdvisor / Homewyse', '2026-06'),
  furniture: createPriceRange(25.0, 40.0, 60.0, '$/room', 'HomeAdvisor / This Old House', '2026-06'),
  tackStrip: createPriceRange(0.5, 0.9, 1.5, '$/linear ft', 'Fixr / Homewyse', '2026-06'),
  transitions: createPriceRange(15.0, 25.0, 35.0, '$/threshold', 'Fixr / HomeAdvisor', '2026-06'),
  subfloorRepair: createPriceRange(2.0, 3.5, 6.0, '$/sq ft', 'HomeAdvisor / Fixr', '2026-06'),
  doorTrimming: createPriceRange(20.0, 30.0, 45.0, '$/door', 'HomeAdvisor / Fixr', '2026-06'),
};

// ---------- Data Interfaces ----------
export interface RoomInput {
  id: string;
  name: string;
  type: 'room' | 'closet' | 'hallway';
  lengthFt: number;
  widthFt: number;
}

export interface StairsInput {
  enabled: boolean;
  steps: number;
  style: 'waterfall' | 'box';
  stairWidthIn: number;
  treadDepthIn: number;
  riserHeightIn: number;
  nosingWrapIn: number;
  landingLengthFt: number;
  landingWidthFt: number;
}

export interface RollLayoutResult {
  roomName: string;
  netAreaSqFt: number;
  orientation: 'lengthwise' | 'widthwise';
  drops: number;
  cutLengthFt: number;
  boughtSqFt: number;
  seams: number;
  wasteSqFt: number;
  wastePercent: number;
}

export interface CarpetCalculatorInput {
  mode: 'replace' | 'new';
  rooms: RoomInput[];
  stairs: StairsInput;
  rollWidthFt: number; // 12, 13.5, 15, or custom
  patternWastePercent: number; // 0, 5, 10
  isCarpetTiles: boolean;
  // Material pricing
  carpetPricePerSqFt: number;
  padPricePerSqFt: number;
  // Labour rates
  laborRatePerSqFt: number;
  stairsRatePerStep?: number; // optional override
  // Extras toggles and quantities
  includeRemoval: boolean;
  removalRatePerSqFt: number;
  includeDisposal: boolean;
  disposalRatePerSqFt: number;
  furnitureRoomsCount: number;
  furnitureRatePerRoom: number;
  replaceTackStrips: boolean;
  tackStripRatePerFt: number;
  transitionCount: number;
  transitionRate: number;
  subfloorRepairSqFt: number;
  subfloorRatePerSqFt: number;
  doorsToTrimCount: number;
  doorTrimRate: number;
  // Tax & regional
  salesTaxPercent: number;
  taxMaterialsOnly: boolean;
  regionalMultiplier: number; // 0.7 to 1.4
}

export interface LineItem {
  id: string;
  name: string;
  category: 'Materials' | 'Labour' | 'Prep & Removal' | 'Extras' | 'Tax';
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
  enabled: boolean;
  description?: string;
}

export interface CarpetCalculationResult {
  // Area & quantities
  totalNetSqFt: number;
  totalNetSqYd: number;
  totalNetM2: number;
  totalBoughtSqFt: number;
  totalBoughtSqYd: number;
  totalBoughtM2: number;
  totalWasteSqFt: number;
  totalWastePercent: number;
  totalSeams: number;
  roomRollLayouts: RollLayoutResult[];
  // Stairs breakdown
  stairsNetSqFt: number;
  stairsCarpetSqFt: number;
  // Pad
  padSqFt: number;
  padSqYd: number;
  // Line items
  lineItems: LineItem[];
  materialsCost: number;
  laborCost: number;
  prepRemovalCost: number;
  extrasCost: number;
  salesTaxAmount: number;
  // Totals
  subtotalBeforeTax: number;
  grandTotal: number;
  totalLow: number;
  totalTypical: number;
  totalHigh: number;
  // Installed unit metrics
  installedCostPerSqFt: number;
  installedCostPerSqYd: number;
  installedCostPerM2: number;
}

// ---------- Engine Calculation Functions ----------

/**
 * Calculates optimal single-room roll layout.
 * Compares feeding roll along room Length vs room Width, chooses configuration that minimizes purchased square footage.
 */
export function calculateRoomRollLayout(
  lengthFt: number,
  widthFt: number,
  rollWidthFt = 12,
  trimAllowanceFt = 0.5, // 3 in on each end = 6 in total (0.5 ft)
  roomName = 'Room'
): RollLayoutResult {
  const L = pos(lengthFt);
  const W = pos(widthFt);
  const R = pos(rollWidthFt) || 12;
  const netAreaSqFt = round2(L * W);

  if (netAreaSqFt === 0) {
    return {
      roomName,
      netAreaSqFt: 0,
      orientation: 'lengthwise',
      drops: 0,
      cutLengthFt: 0,
      boughtSqFt: 0,
      seams: 0,
      wasteSqFt: 0,
      wastePercent: 0,
    };
  }

  // Option A: Roll unrolls along Length, strips cut across Width
  const dropsA = Math.max(1, Math.ceil(W / R));
  const cutLengthA = L + trimAllowanceFt;
  const boughtA = dropsA * R * cutLengthA;
  const seamsA = dropsA - 1;

  // Option B: Roll unrolls along Width, strips cut across Length
  const dropsB = Math.max(1, Math.ceil(L / R));
  const cutLengthB = W + trimAllowanceFt;
  const boughtB = dropsB * R * cutLengthB;
  const seamsB = dropsB - 1;

  // Choose configuration that minimizes purchased carpet
  // If tied, choose fewer seams
  let orientation: 'lengthwise' | 'widthwise' = 'lengthwise';
  let drops = dropsA;
  let cutLengthFt = cutLengthA;
  let boughtSqFt = boughtA;
  let seams = seamsA;

  if (boughtB < boughtA || (boughtB === boughtA && seamsB < seamsA)) {
    orientation = 'widthwise';
    drops = dropsB;
    cutLengthFt = cutLengthB;
    boughtSqFt = boughtB;
    seams = seamsB;
  }

  const wasteSqFt = round2(Math.max(0, boughtSqFt - netAreaSqFt));
  const wastePercent = netAreaSqFt > 0 ? round2((wasteSqFt / netAreaSqFt) * 100) : 0;

  return {
    roomName,
    netAreaSqFt,
    orientation,
    drops,
    cutLengthFt: round2(cutLengthFt),
    boughtSqFt: round2(boughtSqFt),
    seams,
    wasteSqFt,
    wastePercent,
  };
}

/**
 * Calculates net and gross carpet area required for a flight of stairs.
 */
export function calculateStairsArea(stairs: StairsInput, stairWastePercent = 10) {
  if (!stairs.enabled || stairs.steps <= 0) {
    return {
      stairsNetSqFt: 0,
      stairsCarpetSqFt: 0,
    };
  }

  const steps = pos(stairs.steps);
  const widthIn = pos(stairs.stairWidthIn) || 36;
  const treadIn = pos(stairs.treadDepthIn) || 10;
  const riserIn = pos(stairs.riserHeightIn) || 7.5;
  const nosingIn = pos(stairs.nosingWrapIn) || 1.5;

  const perStepDepthIn = treadIn + riserIn + nosingIn;
  const flightSqFt = (steps * widthIn * perStepDepthIn) / 144;
  const landingSqFt = pos(stairs.landingLengthFt) * pos(stairs.landingWidthFt);

  const stairsNetSqFt = round2(flightSqFt + landingSqFt);
  const stairMultiplier = 1 + (pos(stairWastePercent) / 100);
  const stairsCarpetSqFt = round2(stairsNetSqFt * stairMultiplier);

  return {
    stairsNetSqFt,
    stairsCarpetSqFt,
  };
}

/**
 * Main calculation engine function.
 */
export function calculateCarpetProject(input: CarpetCalculatorInput): CarpetCalculationResult {
  const rollWidth = pos(input.rollWidthFt) || 12;
  const regionalMult = Math.max(0.5, Math.min(2.0, input.regionalMultiplier || 1.0));

  // 1. Calculate room roll layouts
  let roomNetSqFtSum = 0;
  let roomBoughtSqFtSum = 0;
  let roomSeamsSum = 0;
  let roomPerimeterFtSum = 0;
  const roomRollLayouts: RollLayoutResult[] = [];

  for (let i = 0; i < input.rooms.length; i++) {
    const rm = input.rooms[i];
    const L = pos(rm.lengthFt);
    const W = pos(rm.widthFt);
    const net = round2(L * W);
    roomNetSqFtSum += net;
    roomPerimeterFtSum += round2(2 * (L + W));

    if (input.isCarpetTiles) {
      // Carpet tiles: 5% cutting waste, no roll overage
      const tilesBought = round2(net * 1.05);
      roomBoughtSqFtSum += tilesBought;
      roomRollLayouts.push({
        roomName: rm.name || `Room ${i + 1}`,
        netAreaSqFt: net,
        orientation: 'lengthwise',
        drops: 1,
        cutLengthFt: L,
        boughtSqFt: tilesBought,
        seams: 0,
        wasteSqFt: round2(tilesBought - net),
        wastePercent: 5.0,
      });
    } else {
      const layout = calculateRoomRollLayout(L, W, rollWidth, 0.5, rm.name || `Room ${i + 1}`);
      roomBoughtSqFtSum += layout.boughtSqFt;
      roomSeamsSum += layout.seams;
      roomRollLayouts.push(layout);
    }
  }

  // 2. Calculate stairs
  const { stairsNetSqFt, stairsCarpetSqFt } = calculateStairsArea(input.stairs);

  // 3. Pattern match allowance
  const patternWasteMult = 1 + (pos(input.patternWastePercent) / 100);
  const totalBoughtSqFt = round2((roomBoughtSqFtSum + stairsCarpetSqFt) * patternWasteMult);

  const totalNetSqFt = round2(roomNetSqFtSum + stairsNetSqFt);
  const totalNetSqYd = round2(totalNetSqFt / SQFT_PER_SQYD);
  const totalNetM2 = round2(totalNetSqFt / SQFT_PER_M2);

  const totalBoughtSqYd = round2(totalBoughtSqFt / SQFT_PER_SQYD);
  const totalBoughtM2 = round2(totalBoughtSqFt / SQFT_PER_M2);

  const totalWasteSqFt = round2(Math.max(0, totalBoughtSqFt - totalNetSqFt));
  const totalWastePercent = totalNetSqFt > 0 ? round2((totalWasteSqFt / totalNetSqFt) * 100) : 0;

  // 4. Padding area (Pad is cut to room net area with standard 5% waste allowance)
  const padSqFt = round2(totalNetSqFt * 1.05);
  const padSqYd = round2(padSqFt / SQFT_PER_SQYD);

  // 5. Line items build-up
  const carpetPrice = pos(input.carpetPricePerSqFt);
  const padPrice = pos(input.padPricePerSqFt);
  const laborRate = pos(input.laborRatePerSqFt);

  // Determine stairs labor rate
  const stairRate = input.stairsRatePerStep ??
    (input.stairs.style === 'box' ? LABOUR_AND_EXTRAS.stairsBox.typical : LABOUR_AND_EXTRAS.stairsWaterfall.typical);

  const lineItems: LineItem[] = [
    {
      id: 'carpet-material',
      name: input.isCarpetTiles ? 'Carpet Tiles' : `Broadloom Carpet (${rollWidth}' roll)`,
      category: 'Materials',
      quantity: totalBoughtSqFt,
      unit: 'sq ft',
      unitPrice: carpetPrice,
      subtotal: round2(totalBoughtSqFt * carpetPrice),
      enabled: true,
      description: input.isCarpetTiles
        ? 'Includes 5% box cutting allowance'
        : `Includes roll layout cuts, ${roomSeamsSum} seams & ${stairsNetSqFt > 0 ? 'stairs' : 'waste'}`,
    },
    {
      id: 'carpet-pad',
      name: 'Carpet Cushion / Underlayment Pad',
      category: 'Materials',
      quantity: padSqFt,
      unit: 'sq ft',
      unitPrice: padPrice,
      subtotal: round2(padSqFt * padPrice),
      enabled: !input.isCarpetTiles,
      description: input.isCarpetTiles ? 'N/A (Carpet tiles have integrated cushion backing)' : 'Includes 5% installation allowance',
    },
    {
      id: 'installation-labor',
      name: 'Standard Installation Labour',
      category: 'Labour',
      quantity: totalNetSqFt,
      unit: 'sq ft',
      unitPrice: laborRate,
      subtotal: round2(totalNetSqFt * laborRate),
      enabled: true,
      description: 'Power-stretching, seam iron taping, trimming, tucking into tack strips',
    },
    {
      id: 'stairs-labor',
      name: `Stairs Installation (${input.stairs.style === 'box' ? 'Box / Cap & Band' : 'Waterfall'})`,
      category: 'Labour',
      quantity: input.stairs.enabled ? input.stairs.steps : 0,
      unit: 'step',
      unitPrice: stairRate,
      subtotal: input.stairs.enabled ? round2(pos(input.stairs.steps) * stairRate) : 0,
      enabled: input.stairs.enabled && input.stairs.steps > 0,
      description: input.stairs.style === 'box'
        ? 'Hand-wrapped spindle cuts and contoured edge tailoring'
        : 'Continuous runner stretch over risers and treads',
    },
    {
      id: 'old-carpet-removal',
      name: 'Old Carpet & Pad Tear-Out',
      category: 'Prep & Removal',
      quantity: input.includeRemoval ? totalNetSqFt : 0,
      unit: 'sq ft',
      unitPrice: input.removalRatePerSqFt,
      subtotal: input.includeRemoval ? round2(totalNetSqFt * input.removalRatePerSqFt) : 0,
      enabled: input.includeRemoval,
      description: 'Stripping old carpet, ripping up degraded pad, and pulling residual staples',
    },
    {
      id: 'haul-away-disposal',
      name: 'Debris Disposal & Dumpster Haul-Away',
      category: 'Prep & Removal',
      quantity: input.includeDisposal ? totalNetSqFt : 0,
      unit: 'sq ft',
      unitPrice: input.disposalRatePerSqFt,
      subtotal: input.includeDisposal ? round2(totalNetSqFt * input.disposalRatePerSqFt) : 0,
      enabled: input.includeDisposal,
      description: 'Bagging/rolling remnants, local landfill tipping fees and transport',
    },
    {
      id: 'furniture-moving',
      name: 'Furniture Moving & Reset',
      category: 'Extras',
      quantity: pos(input.furnitureRoomsCount),
      unit: 'room',
      unitPrice: input.furnitureRatePerRoom,
      subtotal: round2(pos(input.furnitureRoomsCount) * input.furnitureRatePerRoom),
      enabled: pos(input.furnitureRoomsCount) > 0,
      description: 'Moving large furniture out of work areas and resetting after installation',
    },
    {
      id: 'tack-strips',
      name: 'New Perimeter Tack Strips',
      category: 'Extras',
      quantity: input.replaceTackStrips ? roomPerimeterFtSum : 0,
      unit: 'lin ft',
      unitPrice: input.tackStripRatePerFt,
      subtotal: input.replaceTackStrips ? round2(roomPerimeterFtSum * input.tackStripRatePerFt) : 0,
      enabled: input.replaceTackStrips,
      description: 'Replacing rotted, broken, or water-damaged perimeter tack strips',
    },
    {
      id: 'transition-molding',
      name: 'Transition Threshold Strips (Metal / Wood)',
      category: 'Extras',
      quantity: pos(input.transitionCount),
      unit: 'threshold',
      unitPrice: input.transitionRate,
      subtotal: round2(pos(input.transitionCount) * input.transitionRate),
      enabled: pos(input.transitionCount) > 0,
      description: 'Doorway transition bars to tile, hardwood, vinyl, or concrete',
    },
    {
      id: 'subfloor-repair',
      name: 'Subfloor Leveling & Plywood Patching',
      category: 'Extras',
      quantity: pos(input.subfloorRepairSqFt),
      unit: 'sq ft',
      unitPrice: input.subfloorRatePerSqFt,
      subtotal: round2(pos(input.subfloorRepairSqFt) * input.subfloorRatePerSqFt),
      enabled: pos(input.subfloorRepairSqFt) > 0,
      description: 'Securing loose subfloor squeaks, patch leveling dips, or replacing rotted sheets',
    },
    {
      id: 'door-trimming',
      name: 'Interior Door Trimming / Undercut',
      category: 'Extras',
      quantity: pos(input.doorsToTrimCount),
      unit: 'door',
      unitPrice: input.doorTrimRate,
      subtotal: round2(pos(input.doorsToTrimCount) * input.doorTrimRate),
      enabled: pos(input.doorsToTrimCount) > 0,
      description: 'Trimming door bottoms to clear higher pile carpet and pad',
    },
  ];

  // Category subtotals
  let materialsCost = 0;
  let laborCost = 0;
  let prepRemovalCost = 0;
  let extrasCost = 0;

  for (const item of lineItems) {
    if (!item.enabled) continue;
    switch (item.category) {
      case 'Materials':
        materialsCost += item.subtotal;
        break;
      case 'Labour':
        laborCost += item.subtotal;
        break;
      case 'Prep & Removal':
        prepRemovalCost += item.subtotal;
        break;
      case 'Extras':
        extrasCost += item.subtotal;
        break;
    }
  }

  // Apply regional multiplier to labor, prep & extras (materials are retail commodity)
  materialsCost = round2(materialsCost);
  laborCost = round2(laborCost * regionalMult);
  prepRemovalCost = round2(prepRemovalCost * regionalMult);
  extrasCost = round2(extrasCost * regionalMult);

  const subtotalBeforeTax = round2(materialsCost + laborCost + prepRemovalCost + extrasCost);

  // Sales Tax
  const taxBasis = input.taxMaterialsOnly ? materialsCost : subtotalBeforeTax;
  const salesTaxAmount = round2(taxBasis * (pos(input.salesTaxPercent) / 100));

  if (salesTaxAmount > 0) {
    lineItems.push({
      id: 'sales-tax',
      name: `Sales Tax (${input.salesTaxPercent}% on ${input.taxMaterialsOnly ? 'Materials' : 'Total'})`,
      category: 'Tax',
      quantity: 1,
      unit: 'job',
      unitPrice: salesTaxAmount,
      subtotal: salesTaxAmount,
      enabled: true,
      description: input.taxMaterialsOnly ? 'State/local sales tax on carpet & pad materials' : 'Sales tax applied to job total',
    });
  }

  const grandTotal = round2(subtotalBeforeTax + salesTaxAmount);

  // Low & High ranges using benchmark industry spread (±18% on materials, ±25% on labour/prep)
  const totalLow = round2(
    (materialsCost * 0.82 + (laborCost + prepRemovalCost + extrasCost) * 0.75 + salesTaxAmount * 0.82)
  );
  const totalHigh = round2(
    (materialsCost * 1.25 + (laborCost + prepRemovalCost + extrasCost) * 1.30 + salesTaxAmount * 1.25)
  );

  const installedCostPerSqFt = totalNetSqFt > 0 ? round2(grandTotal / totalNetSqFt) : 0;
  const installedCostPerSqYd = round2(installedCostPerSqFt * SQFT_PER_SQYD);
  const installedCostPerM2 = round2(installedCostPerSqFt * SQFT_PER_M2);

  return {
    totalNetSqFt,
    totalNetSqYd,
    totalNetM2,
    totalBoughtSqFt,
    totalBoughtSqYd,
    totalBoughtM2,
    totalWasteSqFt,
    totalWastePercent,
    totalSeams: roomSeamsSum,
    roomRollLayouts,
    stairsNetSqFt,
    stairsCarpetSqFt,
    padSqFt,
    padSqYd,
    lineItems,
    materialsCost,
    laborCost,
    prepRemovalCost,
    extrasCost,
    salesTaxAmount,
    subtotalBeforeTax,
    grandTotal,
    totalLow,
    totalTypical: grandTotal,
    totalHigh,
    installedCostPerSqFt,
    installedCostPerSqYd,
    installedCostPerM2,
  };
}

// ---------- Benchmark Helpers for Content & Tables ----------

export interface QuickRoomBenchmark {
  roomLabel: string;
  dimensions: string;
  netSqFt: number;
  sqYd: number;
  lowCost: number;
  typicalCost: number;
  highCost: number;
}

/**
 * Generates the room-by-room benchmark matrix (10x10 to whole house)
 * for mid-grade carpet + pad + standard installation + removal.
 */
export function generateRoomBenchmarks(): QuickRoomBenchmark[] {
  const rooms = [
    { label: 'Small Bedroom / Office', dim: '10 × 10 ft', l: 10, w: 10 },
    { label: 'Standard Bedroom', dim: '10 × 12 ft', l: 10, w: 12 },
    { label: 'Master Bedroom', dim: '12 × 12 ft', l: 12, w: 12 },
    { label: 'Large Master / Bonus Room', dim: '12 × 14 ft', l: 12, w: 14 },
    { label: 'Family Room / Living Room', dim: '12 × 15 ft', l: 12, w: 15 },
    { label: 'Great Room / Open Den', dim: '14 × 16 ft', l: 14, w: 16 },
    { label: 'Large Basement / Game Room', dim: '15 × 20 ft', l: 15, w: 20 },
    { label: 'Three Bedrooms Combined', dim: '~450 sq ft total', l: 15, w: 30 },
    { label: 'Whole House (Small Home)', dim: '~1,000 sq ft', l: 25, w: 40 },
    { label: 'Whole House (Mid-Sized)', dim: '~1,500 sq ft', l: 30, w: 50 },
  ];

  return rooms.map((r) => {
    const res = calculateCarpetProject({
      mode: 'replace',
      rooms: [{ id: '1', name: r.label, type: 'room', lengthFt: r.l, widthFt: r.w }],
      stairs: { enabled: false, steps: 0, style: 'waterfall', stairWidthIn: 36, treadDepthIn: 10, riserHeightIn: 7.5, nosingWrapIn: 1.5, landingLengthFt: 0, landingWidthFt: 0 },
      rollWidthFt: 12,
      patternWastePercent: 0,
      isCarpetTiles: false,
      carpetPricePerSqFt: CARPET_GRADES.mid.typical,
      padPricePerSqFt: DEFAULT_PAD_PRICING.typical,
      laborRatePerSqFt: LABOUR_AND_EXTRAS.installation.typical,
      includeRemoval: true,
      removalRatePerSqFt: LABOUR_AND_EXTRAS.removal.typical,
      includeDisposal: true,
      disposalRatePerSqFt: LABOUR_AND_EXTRAS.disposal.typical,
      furnitureRoomsCount: 0,
      furnitureRatePerRoom: LABOUR_AND_EXTRAS.furniture.typical,
      replaceTackStrips: false,
      tackStripRatePerFt: LABOUR_AND_EXTRAS.tackStrip.typical,
      transitionCount: 1,
      transitionRate: LABOUR_AND_EXTRAS.transitions.typical,
      subfloorRepairSqFt: 0,
      subfloorRatePerSqFt: LABOUR_AND_EXTRAS.subfloorRepair.typical,
      doorsToTrimCount: 0,
      doorTrimRate: LABOUR_AND_EXTRAS.doorTrimming.typical,
      salesTaxPercent: 0,
      taxMaterialsOnly: true,
      regionalMultiplier: 1.0,
    });

    return {
      roomLabel: r.label,
      dimensions: r.dim,
      netSqFt: res.totalNetSqFt,
      sqYd: res.totalNetSqYd,
      lowCost: Math.round(res.totalLow),
      typicalCost: Math.round(res.totalTypical),
      highCost: Math.round(res.totalHigh),
    };
  });
}

// ---------- Contractor Quote Verifier ----------
export interface QuoteCheckResult {
  status: 'below' | 'within' | 'above';
  differenceDollars: number;
  differencePercent: number;
  message: string;
}

export function checkQuote(quoteTotal: number, result: CarpetCalculationResult): QuoteCheckResult {
  const quote = pos(quoteTotal);
  const diffDollars = round2(quote - result.grandTotal);
  const diffPercent = result.grandTotal > 0 ? round2((diffDollars / result.grandTotal) * 100) : 0;

  if (quote < result.totalLow) {
    return {
      status: 'below',
      differenceDollars: diffDollars,
      differencePercent: diffPercent,
      message: `Your quote ($${quote.toLocaleString()}) is below the typical market low ($${Math.round(result.totalLow).toLocaleString()}). Verify whether padding quality (min 8 lb), tear-out removal, disposal fees, or transition strips are excluded.`,
    };
  }

  if (quote > result.totalHigh) {
    return {
      status: 'above',
      differenceDollars: diffDollars,
      differencePercent: diffPercent,
      message: `Your quote ($${quote.toLocaleString()}) is higher than the expected market high ($${Math.round(result.totalHigh).toLocaleString()}). Request an itemized invoice detailing carpet face weight/fibre, subfloor prep, stair charges, and labour rate.`,
    };
  }

  return {
    status: 'within',
    differenceDollars: diffDollars,
    differencePercent: diffPercent,
    message: `Your quote ($${quote.toLocaleString()}) is right within the competitive market range ($${Math.round(result.totalLow).toLocaleString()} – $${Math.round(result.totalHigh).toLocaleString()}) for your room area and scope.`,
  };
}

// ---------- Alternative Flooring Comparison ----------
export interface FloorComparisonItem {
  type: string;
  costPerSqFtInstalled: string;
  totalCost: number;
  lifespanYears: string;
  waterResistance: string;
  bestFor: string;
}

export function compareFloors(netSqFt: number): FloorComparisonItem[] {
  const sqft = pos(netSqFt) || 500;

  return [
    {
      type: 'Carpet (Mid-Grade Nylon)',
      costPerSqFtInstalled: '$4.00 – $9.50',
      totalCost: Math.round(sqft * 6.55),
      lifespanYears: '8 – 15 yrs',
      waterResistance: 'Low (absorbs spills)',
      bestFor: 'Bedrooms, family rooms, cold basements, stairs',
    },
    {
      type: 'Luxury Vinyl Plank (LVP)',
      costPerSqFtInstalled: '$4.50 – $10.00',
      totalCost: Math.round(sqft * 7.25),
      lifespanYears: '15 – 25 yrs',
      waterResistance: '100% Waterproof',
      bestFor: 'Kitchens, bathrooms, basements, pet-friendly living',
    },
    {
      type: 'Laminate Flooring',
      costPerSqFtInstalled: '$3.50 – $8.00',
      totalCost: Math.round(sqft * 5.5),
      lifespanYears: '15 – 25 yrs',
      waterResistance: 'Moderate (water-resistant top)',
      bestFor: 'Living rooms, bedrooms, high scratch-resistance',
    },
    {
      type: 'Hardwood Floor Refinishing',
      costPerSqFtInstalled: '$3.00 – $6.50',
      totalCost: Math.round(sqft * 4.75),
      lifespanYears: '10 – 20 yrs (per sand)',
      waterResistance: 'Low (standing water damages)',
      bestFor: 'Restoring existing solid or engineered hardwood',
    },
  ];
}
