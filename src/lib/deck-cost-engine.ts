/**
 * Deck Cost Calculator & Estimator Engine (Batch 2, Tier 3 #18).
 *
 * Neutral, brand-free estimator calculating structural framing, decking takeoff,
 * concrete footings, fasteners, railing, stairs, labour, and total project costs.
 *
 * Models 4 project modes:
 *   1. 'new': full substructure framing + footings + decking + railing + stairs
 *   2. 'resurface': board & railing replacement on existing sound frame (framing & footings = 0, demo > 0)
 *   3. 'replace': full demolition & haul-away of old deck + brand new build
 *   4. 'repair': targeted replacement of damaged boards, joists, and railing
 *
 * All default prices cite named, public, dated sources (HomeGuide 2026, Fixr 2026,
 * This Old House 2026, Trex/TimberTech 2025/2026 guides, BLS OEWS SOC 47-2031, IRC R312/R507).
 * Pure functions, zero network, zero external dependencies.
 */

import { floorArea, type Section } from './deck-stain-engine';
import { BAGS, FT3_PER_YD3, M_PER_FT, M_PER_IN } from './concrete-engine';

export const SQFT_PER_M2 = 10.7639104;

const round2 = (n: number) => Math.round(n * 100) / 100;
const pos = (n: number | undefined) => (typeof n === 'number' && Number.isFinite(n) && n > 0 ? n : 0);

// ---------- Project Modes ----------
export type ProjectMode = 'new' | 'resurface' | 'replace' | 'repair';

export interface ProjectModeInfo {
  id: ProjectMode;
  label: string;
  description: string;
}

export const PROJECT_MODES: ProjectModeInfo[] = [
  { id: 'new', label: 'New Deck', description: 'Complete new build: footings, framing, decking, railing, and stairs.' },
  { id: 'resurface', label: 'Resurface (Re-deck)', description: 'Replace deck boards and railing on existing sound framing. No new posts or footings.' },
  { id: 'replace', label: 'Full Replacement', description: 'Demolish and haul away existing old deck, then build a complete new deck from the ground up.' },
  { id: 'repair', label: 'Repairs', description: 'Replace isolated damaged deck boards, joists, or railing sections.' },
];

// ---------- Height Bands ----------
export type HeightBand = 'ground' | 'low' | 'mid' | 'elevated';

export interface HeightBandInfo {
  id: HeightBand;
  label: string;
  rangeFt: string;
  nominalHeightIn: number;
  laborMultiplier: number;
  postLengthFt: number;
  guardRequired: boolean; // IRC R312.1.1 requires guardrails if > 30 inches (2.5 ft)
}

export const HEIGHT_BANDS: Record<HeightBand, HeightBandInfo> = {
  ground: {
    id: 'ground',
    label: 'Ground Level (<2 ft)',
    rangeFt: '0 – 2 ft',
    nominalHeightIn: 18,
    laborMultiplier: 1.0,
    postLengthFt: 4,
    guardRequired: false,
  },
  low: {
    id: 'low',
    label: 'Low Elevation (2–4 ft)',
    rangeFt: '2 – 4 ft',
    nominalHeightIn: 36,
    laborMultiplier: 1.1,
    postLengthFt: 6,
    guardRequired: true,
  },
  mid: {
    id: 'mid',
    label: 'Mid Elevation (4–8 ft)',
    rangeFt: '4 – 8 ft',
    nominalHeightIn: 72,
    laborMultiplier: 1.25,
    postLengthFt: 10,
    guardRequired: true,
  },
  elevated: {
    id: 'elevated',
    label: 'Elevated / Second Story (8+ ft)',
    rangeFt: '8 – 14 ft',
    nominalHeightIn: 120,
    laborMultiplier: 1.45,
    postLengthFt: 14,
    guardRequired: true,
  },
};

// ---------- Decking Materials ----------
export type DeckMaterialId =
  | 'pt_pine'
  | 'cedar'
  | 'redwood'
  | 'composite_basic'
  | 'composite_premium'
  | 'pvc'
  | 'ipe';

export interface DeckMaterialInfo {
  id: DeckMaterialId;
  label: string;
  category: 'wood' | 'composite' | 'pvc' | 'hardwood';
  lifespanYears: number;
  annualMaintenancePerSqFt: number;
  recommendedGapIn: number;
  materialCostPerSqFt: { low: number; typical: number; high: number };
  laborCostPerSqFt: { low: number; typical: number; high: number };
  source: string;
  sourceDate: string;
}

export const DECK_MATERIALS: Record<DeckMaterialId, DeckMaterialInfo> = {
  pt_pine: {
    id: 'pt_pine',
    label: 'Pressure-Treated Pine',
    category: 'wood',
    lifespanYears: 15,
    annualMaintenancePerSqFt: 1.25, // Staining/sealing every 2-3 years (~$2.50-$3.50/sq ft)
    recommendedGapIn: 0.125, // 1/8" gap when wet; shrinks to ~1/4"
    materialCostPerSqFt: { low: 4.5, typical: 7.0, high: 10.0 },
    laborCostPerSqFt: { low: 10.0, typical: 15.0, high: 20.0 },
    source: 'HomeGuide (2026) / This Old House (2026)',
    sourceDate: '2026-06',
  },
  cedar: {
    id: 'cedar',
    label: 'Western Red Cedar',
    category: 'wood',
    lifespanYears: 20,
    annualMaintenancePerSqFt: 1.5,
    recommendedGapIn: 0.1875, // 3/16" gap
    materialCostPerSqFt: { low: 7.5, typical: 12.0, high: 16.0 },
    laborCostPerSqFt: { low: 12.0, typical: 17.0, high: 24.0 },
    source: 'Fixr (2026) / HomeGuide (2026)',
    sourceDate: '2026-01',
  },
  redwood: {
    id: 'redwood',
    label: 'California Redwood',
    category: 'wood',
    lifespanYears: 25,
    annualMaintenancePerSqFt: 1.5,
    recommendedGapIn: 0.1875,
    materialCostPerSqFt: { low: 9.0, typical: 14.5, high: 20.0 },
    laborCostPerSqFt: { low: 13.0, typical: 18.0, high: 25.0 },
    source: 'Fixr (2026)',
    sourceDate: '2026-01',
  },
  composite_basic: {
    id: 'composite_basic',
    label: 'Composite (Entry / Uncapped)',
    category: 'composite',
    lifespanYears: 25,
    annualMaintenancePerSqFt: 0.25, // Soap and water wash only
    recommendedGapIn: 0.25, // 1/4" thermal expansion gap
    materialCostPerSqFt: { low: 8.5, typical: 13.0, high: 17.5 },
    laborCostPerSqFt: { low: 14.0, typical: 20.0, high: 28.0 },
    source: 'Trex Cost Guide (2025/2026) / HomeAdvisor',
    sourceDate: '2026-01',
  },
  composite_premium: {
    id: 'composite_premium',
    label: 'Composite (Premium Capped 4-Sided)',
    category: 'composite',
    lifespanYears: 30,
    annualMaintenancePerSqFt: 0.25,
    recommendedGapIn: 0.25,
    materialCostPerSqFt: { low: 14.0, typical: 20.0, high: 26.0 },
    laborCostPerSqFt: { low: 16.0, typical: 22.0, high: 30.0 },
    source: 'TimberTech Cost Overview (2026)',
    sourceDate: '2026-06',
  },
  pvc: {
    id: 'pvc',
    label: 'Capped Cellular PVC (AZEK-style)',
    category: 'pvc',
    lifespanYears: 40,
    annualMaintenancePerSqFt: 0.2,
    recommendedGapIn: 0.125, // Lower thermal movement across width
    materialCostPerSqFt: { low: 16.0, typical: 24.0, high: 32.0 },
    laborCostPerSqFt: { low: 17.0, typical: 24.0, high: 32.0 },
    source: 'TimberTech AZEK Guide (2026)',
    sourceDate: '2026-06',
  },
  ipe: {
    id: 'ipe',
    label: 'Tropical Hardwood (Ipe / Ironwood)',
    category: 'hardwood',
    lifespanYears: 50,
    annualMaintenancePerSqFt: 1.0, // UV oil annually or let silver-grey
    recommendedGapIn: 0.25,
    materialCostPerSqFt: { low: 22.0, typical: 32.0, high: 45.0 },
    laborCostPerSqFt: { low: 20.0, typical: 28.0, high: 40.0 },
    source: 'NovaUSA / Decks.com (2026)',
    sourceDate: '2026-01',
  },
};

// ---------- Decking Pattern & Waste ----------
export type DeckPattern = 'straight' | 'diagonal' | 'herringbone';

export interface DeckPatternInfo {
  id: DeckPattern;
  label: string;
  defaultWastePct: number;
  description: string;
}

export const DECK_PATTERNS: Record<DeckPattern, DeckPatternInfo> = {
  straight: { id: 'straight', label: 'Perpendicular (90°)', defaultWastePct: 10, description: 'Standard layout perpendicular to joists. Lowest off-cut waste.' },
  diagonal: { id: 'diagonal', label: 'Diagonal (45°)', defaultWastePct: 15, description: 'Requires 12" o.c. joist spacing and creates 45° angle end off-cuts.' },
  herringbone: { id: 'herringbone', label: 'Herringbone / Chevron', defaultWastePct: 20, description: 'Intricate geometric pattern with double blocking and extensive angle cuts.' },
};

// ---------- Railing Types ----------
export type RailingType = 'wood' | 'composite' | 'aluminum' | 'cable' | 'glass';

export interface RailingTypeInfo {
  id: RailingType;
  label: string;
  installedCostPerLf: { low: number; typical: number; high: number };
  materialCostPerLf: { low: number; typical: number; high: number };
  source: string;
}

export const RAILING_TYPES: Record<RailingType, RailingTypeInfo> = {
  wood: {
    id: 'wood',
    label: 'Pressure-Treated Wood Balusters',
    installedCostPerLf: { low: 20, typical: 32, high: 45 },
    materialCostPerLf: { low: 12, typical: 18, high: 26 },
    source: 'HomeGuide (2026)',
  },
  composite: {
    id: 'composite',
    label: 'Composite Railing & Post Sleeves',
    installedCostPerLf: { low: 45, typical: 68, high: 95 },
    materialCostPerLf: { low: 28, typical: 42, high: 60 },
    source: 'TimberTech / Trex (2026)',
  },
  aluminum: {
    id: 'aluminum',
    label: 'Powder-Coated Aluminum',
    installedCostPerLf: { low: 55, typical: 82, high: 115 },
    materialCostPerLf: { low: 35, typical: 54, high: 75 },
    source: 'Fixr (2026)',
  },
  cable: {
    id: 'cable',
    label: 'Stainless Steel Cable Infill',
    installedCostPerLf: { low: 75, typical: 110, high: 160 },
    materialCostPerLf: { low: 45, typical: 70, high: 105 },
    source: 'Decks.com (2026)',
  },
  glass: {
    id: 'glass',
    label: 'Tempered Glass Panels',
    installedCostPerLf: { low: 110, typical: 165, high: 240 },
    materialCostPerLf: { low: 70, typical: 105, high: 155 },
    source: 'Fixr (2026)',
  },
};

// ---------- Framing Presets ----------
export interface FramingOptions {
  joistSize: '2x6' | '2x8' | '2x10' | '2x12';
  joistSpacingIn: 12 | 16 | 24; // 12" often required for diagonal or composite
  postSize: '4x4' | '6x6'; // 6x6 required for decks > 8 ft or multi-story
  postSpacingFt: number; // typically 6 to 8 ft
  footingDiameterIn: number; // 10" or 12"
  footingDepthIn: number; // 36" to 48" to frost line
  beamLayers: 2 | 3; // Double or triple 2x10/2x12 beam
}

export const DEFAULT_FRAMING: FramingOptions = {
  joistSize: '2x8',
  joistSpacingIn: 16,
  postSize: '6x6',
  postSpacingFt: 8,
  footingDiameterIn: 12,
  footingDepthIn: 42, // Typical frost depth
  beamLayers: 2,
};

// ---------- Fasteners ----------
export type FastenerType = 'face_screws' | 'hidden_clips';

export interface FastenerInfo {
  id: FastenerType;
  label: string;
  costPerBox: number;
  countPerBox: number;
  fastenersPerCrossing: number; // 2 screws vs 1 clip per board/joist crossing
  source: string;
}

export const FASTENERS: Record<FastenerType, FastenerInfo> = {
  face_screws: {
    id: 'face_screws',
    label: 'Color-Matched Face Screws',
    costPerBox: 48,
    countPerBox: 350,
    fastenersPerCrossing: 2,
    source: 'FastenMaster / Camo (2026)',
  },
  hidden_clips: {
    id: 'hidden_clips',
    label: 'Concealed Deck Clips & Screws',
    costPerBox: 85,
    countPerBox: 500,
    fastenersPerCrossing: 1,
    source: 'Trex Hideaway / CAMO EdgeClips (2026)',
  },
};

// ---------- Unit Cost Item Rates ----------
export interface UnitCostRates {
  // Lumber materials ($/piece)
  joistPiece: number; // e.g. $18 for 2x8x12 PT
  beamPiece: number; // e.g. $38 for 2x10x12 PT
  postPiece: number; // e.g. $42 for 6x6x10 PT
  concreteBag80lb: number; // e.g. $6.75 per 80 lb QUIKRETE bag
  hardwarePerSqFt: number; // hangers, ledger lags, tension ties, joist tape ($2.25/sq ft)
  
  // Stair costs
  stairCostPerRiser: number; // $55 materials + labor per riser
  
  // Site & Permit
  permitFee: number; // $400 flat typical
  sitePrepPerSqFt: number; // $0.75/sq ft (grading, weed barrier, gravel bed)
  
  // Demo (Replace / Resurface)
  demoPerSqFtFull: number; // $6.00/sq ft (full deck tear-out and dumpster)
  demoPerSqFtBoardsOnly: number; // $2.75/sq ft (board removal and disposal)
}

export const DEFAULT_UNIT_RATES: UnitCostRates = {
  joistPiece: 22,
  beamPiece: 42,
  postPiece: 45,
  concreteBag80lb: 6.75,
  hardwarePerSqFt: 2.25,
  stairCostPerRiser: 55,
  permitFee: 400,
  sitePrepPerSqFt: 0.75,
  demoPerSqFtFull: 6.0,
  demoPerSqFtBoardsOnly: 2.75,
};

// ---------- Inputs ----------
export interface DeckSectionInput extends Section {
  name: string;
  isAttached: boolean; // Attached with ledger to house, or freestanding
  houseEdge: 'length' | 'width' | 'none'; // Edge attached to house (no railing here)
}

export interface DeckCostInput {
  mode: ProjectMode;
  sections: DeckSectionInput[];
  heightBand: HeightBand;
  materialId: DeckMaterialId;
  boardWidthIn: number; // 5.5 for 6" decking, or 3.5
  boardLengthFt: 8 | 12 | 16 | 20; // Stock length
  gapIn: number;
  pattern: DeckPattern;
  wastePct?: number; // User override or default by pattern
  pictureFrame: boolean; // Perimeter border boards
  framing: FramingOptions;
  railing: {
    include: boolean;
    type: RailingType;
    customLengthLf?: number;
  };
  stairs: {
    include: boolean;
    risers?: number; // Auto: heightIn / 7.5
    widthFt: number; // Standard 4 ft
    hasLanding: boolean;
  };
  fastenerType: FastenerType;
  isDIY: boolean; // Hides pro labor, adds tool rental allowance
  customRates?: Partial<UnitCostRates>;
  customDeckingPricePerSqFt?: number;
  customLaborPricePerSqFt?: number;
  customRailingPricePerLf?: number;
  regionIndex: number; // 0.75 to 1.35
  contingencyPct: number; // Default 10%
  currencySymbol: string; // '$', '£', '€', 'C$', 'A$'
}

// ---------- BOM (Bill of Materials) ----------
export interface BomItem {
  category: 'decking' | 'framing' | 'hardware' | 'railing' | 'stairs' | 'concrete';
  item: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  note?: string;
}

// ---------- Results Structure ----------
export interface CostLineItem {
  id: string;
  label: string;
  category: 'decking' | 'framing' | 'footings' | 'fasteners' | 'railing' | 'stairs' | 'labor' | 'site_prep' | 'demo' | 'permit';
  materialsCost: number;
  laborCost: number;
  totalCost: number;
  pctOfTotal: number;
  description: string;
}

export interface DeckCostResult {
  // Geometry
  totalAreaSqFt: number;
  totalPerimeterLf: number;
  exposedPerimeterLf: number; // Perimeter minus house-attached sides
  
  // Takeoff counts
  decking: {
    sqFtPurchased: number;
    rows: number;
    boardCount: number;
    pictureFrameBoards: number;
    totalBoards: number;
    wastePct: number;
    fastenerCrossings: number;
    fastenerBoxes: number;
  };
  framing: {
    joistCount: number;
    beamCount: number;
    postCount: number;
    footingCount: number;
    concreteVolumeCuYd: number;
    concreteBags80lb: number;
    ledgerLengthLf: number;
  };
  railing: {
    lengthLf: number;
    type: RailingType;
  };
  stairs: {
    riserCount: number;
    treadCount: number;
    stringerCount: number;
    widthFt: number;
  };

  // Cost estimates
  materialsTotal: number;
  laborTotal: number;
  contingencyAmount: number;
  grandTotal: number;
  lowEstimate: number;
  highEstimate: number;
  costPerSqFt: number;
  costPerSqFtRange: { low: number; high: number };

  // DIY comparison
  diyTotal: number;
  diySavings: number;

  // Breakdown lines
  lineItems: CostLineItem[];
  bom: BomItem[];
}

// ---------- Calculation Engine ----------

export function calculateDeckCost(input: DeckCostInput): DeckCostResult {
  const sections = input.sections.length > 0
    ? input.sections
    : [{ name: 'Main Deck', lengthFt: 16, widthFt: 12, isAttached: true, houseEdge: 'length' as const }];

  const totalAreaSqFt = floorArea(sections);
  const heightInfo = HEIGHT_BANDS[input.heightBand] || HEIGHT_BANDS.low;
  const mat = DECK_MATERIALS[input.materialId] || DECK_MATERIALS.pt_pine;
  const patternInfo = DECK_PATTERNS[input.pattern] || DECK_PATTERNS.straight;
  const wastePct = typeof input.wastePct === 'number' && input.wastePct >= 0
    ? input.wastePct
    : patternInfo.defaultWastePct;

  const framing = { ...DEFAULT_FRAMING, ...input.framing };
  const rates = { ...DEFAULT_UNIT_RATES, ...input.customRates };
  const region = Math.max(0.5, Math.min(2.0, pos(input.regionIndex) || 1.0));
  const contingencyPct = Math.max(0, Math.min(30, pos(input.contingencyPct) || 10));

  // --- Geometry & House Ledger Edge ---
  let totalPerimeterLf = 0;
  let houseLedgerLf = 0;

  for (const s of sections) {
    const l = pos(s.lengthFt);
    const w = pos(s.widthFt);
    totalPerimeterLf += 2 * (l + w);
    if (s.isAttached) {
      if (s.houseEdge === 'length') houseLedgerLf += l;
      else if (s.houseEdge === 'width') houseLedgerLf += w;
    }
  }

  const stairOpeningLf = input.stairs.include ? Math.max(3, pos(input.stairs.widthFt) || 4) : 0;
  const exposedPerimeterLf = Math.max(0, totalPerimeterLf - houseLedgerLf);

  // --- Decking Takeoff ---
  const boardPitchFt = (pos(input.boardWidthIn) + pos(input.gapIn || mat.recommendedGapIn)) / 12;
  const stockLengthFt = input.boardLengthFt || 16;

  let totalDeckRows = 0;
  let totalFieldBoards = 0;
  let totalCrossings = 0;

  for (const s of sections) {
    const l = pos(s.lengthFt);
    const w = pos(s.widthFt);
    // boards run along length, spanned across width
    const rows = boardPitchFt > 0 ? Math.ceil(w / boardPitchFt) : 0;
    const boardsPerRow = Math.ceil(l / stockLengthFt);
    const fieldBoards = rows * boardsPerRow;
    const joistCountSection = Math.ceil((l * 12) / framing.joistSpacingIn) + 1;

    totalDeckRows += rows;
    totalFieldBoards += fieldBoards;
    totalCrossings += rows * joistCountSection;
  }

  // Picture frame border boards
  const pictureFrameBoards = input.pictureFrame
    ? Math.ceil(exposedPerimeterLf / stockLengthFt)
    : 0;

  const baseBoards = totalFieldBoards + pictureFrameBoards;
  const totalDeckingBoards = Math.ceil(baseBoards * (1 + wastePct / 100));
  const deckingPurchasedSqFt = round2(totalAreaSqFt * (1 + wastePct / 100));

  // Fasteners
  const fast = FASTENERS[input.fastenerType] || FASTENERS.face_screws;
  const totalFastenersNeeded = totalCrossings * fast.fastenersPerCrossing * (1 + wastePct / 100);
  const fastenerBoxes = Math.ceil(totalFastenersNeeded / fast.countPerBox);

  // --- Framing Takeoff ---
  // In 'resurface' or 'repair' mode, framing is excluded or reduced
  const isResurface = input.mode === 'resurface';
  const isRepair = input.mode === 'repair';
  const isReplace = input.mode === 'replace';

  let totalJoists = 0;
  let totalBeams = 0;
  let totalPosts = 0;
  let totalFootings = 0;

  if (!isResurface && !isRepair) {
    for (const s of sections) {
      const l = pos(s.lengthFt);
      // Joists run across span; span along ledger = l
      const joistsInSection = Math.ceil((l * 12) / framing.joistSpacingIn) + 1 + 2; // +2 for rim joists
      // Beam rows: 1 row if attached to house, 2 rows if freestanding
      const beamRows = s.isAttached ? 1 : 2;
      const beamLengthFt = l;
      const postsInBeam = Math.ceil(beamLengthFt / framing.postSpacingFt) + 1;

      totalJoists += joistsInSection;
      totalBeams += beamRows;
      totalPosts += beamRows * postsInBeam;
      totalFootings += beamRows * postsInBeam;
    }
  } else if (isRepair) {
    // Isolated repairs: 10% of typical framing
    totalJoists = Math.max(2, Math.ceil(totalAreaSqFt / 150));
    totalPosts = 0;
    totalBeams = 0;
    totalFootings = 0;
  }

  // Footing Concrete
  const footingRadiusM = (framing.footingDiameterIn / 2) * M_PER_IN;
  const footingDepthM = framing.footingDepthIn * M_PER_IN;
  const singleFootingVolumeM3 = Math.PI * footingRadiusM * footingRadiusM * footingDepthM;
  const totalConcreteM3 = totalFootings * singleFootingVolumeM3;
  const concreteTotalFt3 = totalConcreteM3 / (M_PER_FT ** 3);
  const concreteVolumeCuYd = round2(concreteTotalFt3 / FT3_PER_YD3);
  
  // 80 lb QUIKRETE bag yield = 0.60 ft³ = BAGS[3]
  const bagYieldFt3 = BAGS[3].yieldM3 * (1 / (M_PER_FT ** 3)); // 0.60
  const concreteBags80lb = Math.ceil(concreteTotalFt3 / (bagYieldFt3 || 0.6));

  // --- Railing Takeoff ---
  let railingLf = 0;
  if (input.railing.include) {
    railingLf = typeof input.railing.customLengthLf === 'number' && input.railing.customLengthLf >= 0
      ? input.railing.customLengthLf
      : Math.max(0, exposedPerimeterLf - stairOpeningLf);
  }

  // --- Stairs Takeoff ---
  let riserCount = 0;
  let treadCount = 0;
  let stringerCount = 0;
  const stairWidthFt = input.stairs.include ? pos(input.stairs.widthFt) || 4 : 0;

  if (input.stairs.include) {
    riserCount = typeof input.stairs.risers === 'number' && input.stairs.risers > 0
      ? input.stairs.risers
      : Math.max(1, Math.ceil(heightInfo.nominalHeightIn / 7.5));
    treadCount = Math.max(0, riserCount - 1);
    stringerCount = Math.ceil((stairWidthFt * 12) / 16) + 1; // Stringer every 16" o.c.
  }

  // --- Pricing Calculations ---
  // Decking material rate
  const deckingMatRate = typeof input.customDeckingPricePerSqFt === 'number' && input.customDeckingPricePerSqFt >= 0
    ? input.customDeckingPricePerSqFt
    : mat.materialCostPerSqFt.typical;

  // Labor rate (scaled by height band)
  const baseLaborRate = typeof input.customLaborPricePerSqFt === 'number' && input.customLaborPricePerSqFt >= 0
    ? input.customLaborPricePerSqFt
    : mat.laborCostPerSqFt.typical;
  const effectiveLaborRate = input.isDIY ? 0 : baseLaborRate * heightInfo.laborMultiplier;

  // Railing rate
  const railSpec = RAILING_TYPES[input.railing.type] || RAILING_TYPES.wood;
  const railingRatePerLf = typeof input.customRailingPricePerLf === 'number' && input.customRailingPricePerLf >= 0
    ? input.customRailingPricePerLf
    : (input.isDIY ? railSpec.materialCostPerLf.typical : railSpec.installedCostPerLf.typical);

  // Cost items
  const deckingMaterials = deckingPurchasedSqFt * deckingMatRate;
  const framingLumber = (totalJoists * rates.joistPiece) + (totalBeams * rates.beamPiece) + (totalPosts * rates.postPiece);
  const concreteCost = concreteBags80lb * rates.concreteBag80lb;
  const hardwareFasteners = (totalAreaSqFt * rates.hardwarePerSqFt) + (fastenerBoxes * fast.costPerBox);
  
  const railingCost = railingLf * railingRatePerLf;
  const stairsCost = input.stairs.include
    ? riserCount * (input.isDIY ? rates.stairCostPerRiser * 0.5 : rates.stairCostPerRiser) * (stairWidthFt / 4)
    : 0;
  
  const sitePrepCost = (!isResurface && !isRepair) ? totalAreaSqFt * rates.sitePrepPerSqFt : 0;
  
  // Demolition cost
  let demoCost = 0;
  if (isReplace) {
    demoCost = totalAreaSqFt * (input.isDIY ? rates.demoPerSqFtFull * 0.4 : rates.demoPerSqFtFull);
  } else if (isResurface) {
    demoCost = totalAreaSqFt * (input.isDIY ? rates.demoPerSqFtBoardsOnly * 0.4 : rates.demoPerSqFtBoardsOnly);
  }

  // Permit fee
  const permitCost = (!isRepair) ? rates.permitFee : 0;

  // Labor Total
  const laborCostTotal = input.isDIY ? 0 : totalAreaSqFt * effectiveLaborRate;

  // Tool rental for DIY
  const toolRentalAllowance = input.isDIY ? 350 : 0;

  // Line items for breakdown
  const rawSubtotal = deckingMaterials + framingLumber + concreteCost + hardwareFasteners + railingCost + stairsCost + sitePrepCost + demoCost + permitCost + laborCostTotal + toolRentalAllowance;
  const subtotalWithRegion = rawSubtotal * region;
  const contingencyAmount = round2(subtotalWithRegion * (contingencyPct / 100));
  const grandTotal = round2(subtotalWithRegion + contingencyAmount);

  // Materials vs Labor
  const materialsTotal = input.isDIY
    ? round2(subtotalWithRegion)
    : round2((deckingMaterials + framingLumber + concreteCost + hardwareFasteners + (railingCost * 0.6) + (stairsCost * 0.5) + sitePrepCost + permitCost + (demoCost * 0.4)) * region);
  const laborTotal = input.isDIY ? 0 : Math.max(0, round2(grandTotal - materialsTotal));

  // Low / High Range (based on ±15% variance + material bounds)
  const lowMultiplier = (mat.materialCostPerSqFt.low / mat.materialCostPerSqFt.typical) * 0.9;
  const highMultiplier = (mat.materialCostPerSqFt.high / mat.materialCostPerSqFt.typical) * 1.15;
  const lowEstimate = round2(grandTotal * lowMultiplier);
  const highEstimate = round2(grandTotal * highMultiplier);

  const costPerSqFt = totalAreaSqFt > 0 ? round2(grandTotal / totalAreaSqFt) : 0;
  const costPerSqFtRange = {
    low: totalAreaSqFt > 0 ? round2(lowEstimate / totalAreaSqFt) : 0,
    high: totalAreaSqFt > 0 ? round2(highEstimate / totalAreaSqFt) : 0,
  };

  // DIY savings
  const proLaborEstimate = totalAreaSqFt * baseLaborRate * heightInfo.laborMultiplier * region;
  const diyTotal = input.isDIY
    ? grandTotal
    : round2(materialsTotal + toolRentalAllowance + (demoCost * 0.4 * region));
  const diySavings = input.isDIY
    ? Math.max(0, round2(proLaborEstimate - toolRentalAllowance))
    : Math.max(0, round2(grandTotal - diyTotal));

  // Itemized breakdown lines
  const lineItems: CostLineItem[] = [
    {
      id: 'decking',
      label: `Decking Boards (${mat.label})`,
      category: 'decking',
      materialsCost: round2(deckingMaterials * region),
      laborCost: 0,
      totalCost: round2(deckingMaterials * region),
      pctOfTotal: grandTotal > 0 ? round2((deckingMaterials * region / grandTotal) * 100) : 0,
      description: `${totalDeckingBoards} boards (${stockLengthFt} ft) incl. ${wastePct}% pattern waste`,
    },
    {
      id: 'framing',
      label: 'Substructure Framing Lumber',
      category: 'framing',
      materialsCost: round2(framingLumber * region),
      laborCost: 0,
      totalCost: round2(framingLumber * region),
      pctOfTotal: grandTotal > 0 ? round2((framingLumber * region / grandTotal) * 100) : 0,
      description: isResurface ? 'Reusing existing sound framing' : `${totalJoists} joists, ${totalBeams} beams, ${totalPosts} posts`,
    },
    {
      id: 'footings',
      label: 'Concrete Pier Footings',
      category: 'footings',
      materialsCost: round2(concreteCost * region),
      laborCost: 0,
      totalCost: round2(concreteCost * region),
      pctOfTotal: grandTotal > 0 ? round2((concreteCost * region / grandTotal) * 100) : 0,
      description: isResurface ? 'Reusing existing foundation' : `${totalFootings} footings (${concreteBags80lb} × 80 lb bags)`,
    },
    {
      id: 'fasteners',
      label: 'Hardware & Fasteners',
      category: 'fasteners',
      materialsCost: round2(hardwareFasteners * region),
      laborCost: 0,
      totalCost: round2(hardwareFasteners * region),
      pctOfTotal: grandTotal > 0 ? round2((hardwareFasteners * region / grandTotal) * 100) : 0,
      description: `${fastenerBoxes} boxes ${fast.label}, joist hangers, flashing tape`,
    },
    {
      id: 'railing',
      label: `Railing System (${railSpec.label})`,
      category: 'railing',
      materialsCost: round2(railingCost * 0.6 * region),
      laborCost: round2(railingCost * 0.4 * region),
      totalCost: round2(railingCost * region),
      pctOfTotal: grandTotal > 0 ? round2((railingCost * region / grandTotal) * 100) : 0,
      description: `${railingLf} linear feet along exposed deck perimeter`,
    },
    {
      id: 'stairs',
      label: 'Stairs & Stringers',
      category: 'stairs',
      materialsCost: round2(stairsCost * 0.5 * region),
      laborCost: round2(stairsCost * 0.5 * region),
      totalCost: round2(stairsCost * region),
      pctOfTotal: grandTotal > 0 ? round2((stairsCost * region / grandTotal) * 100) : 0,
      description: input.stairs.include ? `${riserCount} risers (${stairWidthFt} ft wide, ${stringerCount} stringers)` : 'No stairs included',
    },
    {
      id: 'labor',
      label: 'Professional Framing & Decking Labor',
      category: 'labor',
      materialsCost: 0,
      laborCost: round2(laborCostTotal * region),
      totalCost: round2(laborCostTotal * region),
      pctOfTotal: grandTotal > 0 ? round2((laborCostTotal * region / grandTotal) * 100) : 0,
      description: input.isDIY ? 'Self-installed (DIY)' : `$${round2(effectiveLaborRate)}/sq ft (${heightInfo.label})`,
    },
    {
      id: 'permit_site',
      label: 'Building Permit & Site Preparation',
      category: 'permit',
      materialsCost: round2((permitCost + sitePrepCost) * region),
      laborCost: 0,
      totalCost: round2((permitCost + sitePrepCost) * region),
      pctOfTotal: grandTotal > 0 ? round2(((permitCost + sitePrepCost) * region / grandTotal) * 100) : 0,
      description: `Local permit fee + ground weed barrier / gravel`,
    },
  ];

  if (demoCost > 0) {
    lineItems.push({
      id: 'demo',
      label: isReplace ? 'Existing Deck Demolition & Haul-Away' : 'Existing Board Removal & Disposal',
      category: 'demo',
      materialsCost: round2(demoCost * 0.4 * region),
      laborCost: round2(demoCost * 0.6 * region),
      totalCost: round2(demoCost * region),
      pctOfTotal: grandTotal > 0 ? round2((demoCost * region / grandTotal) * 100) : 0,
      description: `${totalAreaSqFt} sq ft tear-out + dumpster rental`,
    });
  }

  // --- Bill of Materials (BOM) ---
  const bom: BomItem[] = [];

  // Decking
  bom.push({
    category: 'decking',
    item: `${mat.label} Deck Boards (${input.boardWidthIn}" × ${stockLengthFt}')`,
    quantity: totalDeckingBoards,
    unit: 'boards',
    unitCost: round2(deckingMaterials / (totalDeckingBoards || 1)),
    totalCost: round2(deckingMaterials),
    note: `${totalDeckRows} rows, ${wastePct}% waste included`,
  });

  if (pictureFrameBoards > 0) {
    bom.push({
      category: 'decking',
      item: 'Picture-Frame Perimeter Border Boards',
      quantity: pictureFrameBoards,
      unit: 'boards',
      unitCost: round2(deckingMaterials / (totalDeckingBoards || 1)),
      totalCost: round2(pictureFrameBoards * (deckingMaterials / (totalDeckingBoards || 1))),
      note: 'Mitred picture frame edge',
    });
  }

  // Fasteners
  bom.push({
    category: 'hardware',
    item: fast.label,
    quantity: fastenerBoxes,
    unit: 'boxes',
    unitCost: fast.costPerBox,
    totalCost: round2(fastenerBoxes * fast.costPerBox),
    note: `${fast.countPerBox} fasteners/box (${totalFastenersNeeded} total)`,
  });

  // Framing
  if (totalJoists > 0) {
    bom.push({
      category: 'framing',
      item: `Pressure-Treated Joists (${framing.joistSize} × 12')`,
      quantity: totalJoists,
      unit: 'pieces',
      unitCost: rates.joistPiece,
      totalCost: round2(totalJoists * rates.joistPiece),
      note: `${framing.joistSpacingIn}" on-center spacing`,
    });
  }

  if (totalBeams > 0) {
    bom.push({
      category: 'framing',
      item: `Pressure-Treated Beams (Double 2×10 × 12')`,
      quantity: totalBeams * 2,
      unit: 'pieces',
      unitCost: rates.beamPiece,
      totalCost: round2(totalBeams * 2 * rates.beamPiece),
      note: 'Multi-ply carrier beam',
    });
  }

  if (totalPosts > 0) {
    bom.push({
      category: 'framing',
      item: `Support Posts (${framing.postSize} × ${heightInfo.postLengthFt}')`,
      quantity: totalPosts,
      unit: 'pieces',
      unitCost: rates.postPiece,
      totalCost: round2(totalPosts * rates.postPiece),
      note: `Rated for ${heightInfo.label}`,
    });
  }

  if (totalFootings > 0) {
    bom.push({
      category: 'concrete',
      item: `Concrete Footing Bags (80 lb QUIKRETE #1101)`,
      quantity: concreteBags80lb,
      unit: 'bags',
      unitCost: rates.concreteBag80lb,
      totalCost: round2(concreteBags80lb * rates.concreteBag80lb),
      note: `${totalFootings} pier holes (${framing.footingDiameterIn}" dia × ${framing.footingDepthIn}" deep, ${concreteVolumeCuYd} yd³)`,
    });
  }

  // Hardware
  bom.push({
    category: 'hardware',
    item: 'Joist Hangers, Ledger Lag Screws & Joist Tape',
    quantity: Math.ceil(totalAreaSqFt),
    unit: 'sq ft',
    unitCost: rates.hardwarePerSqFt,
    totalCost: round2(totalAreaSqFt * rates.hardwarePerSqFt),
    note: 'Simpson Strong-Tie connectors & flashing tape',
  });

  // Railing
  if (railingLf > 0) {
    bom.push({
      category: 'railing',
      item: `${railSpec.label}`,
      quantity: Math.ceil(railingLf),
      unit: 'lin ft',
      unitCost: round2(railingCost / railingLf),
      totalCost: round2(railingCost),
      note: 'Complete top/bottom rail, balusters & posts',
    });
  }

  // Stairs
  if (input.stairs.include && riserCount > 0) {
    bom.push({
      category: 'stairs',
      item: `Cut Stair Stringers (2×12 Pressure-Treated)`,
      quantity: stringerCount,
      unit: 'pieces',
      unitCost: 35,
      totalCost: round2(stringerCount * 35),
      note: `${riserCount} risers, 16" o.c. spacing`,
    });
    bom.push({
      category: 'stairs',
      item: `Stair Treads & Risers (${stairWidthFt} ft wide)`,
      quantity: treadCount,
      unit: 'steps',
      unitCost: round2((stairsCost - (stringerCount * 35)) / (treadCount || 1)),
      totalCost: round2(stairsCost - (stringerCount * 35)),
      note: 'Bullnose treads and matching risers',
    });
  }

  return {
    totalAreaSqFt: round2(totalAreaSqFt),
    totalPerimeterLf: round2(totalPerimeterLf),
    exposedPerimeterLf: round2(exposedPerimeterLf),
    decking: {
      sqFtPurchased: deckingPurchasedSqFt,
      rows: totalDeckRows,
      boardCount: totalFieldBoards,
      pictureFrameBoards,
      totalBoards: totalDeckingBoards,
      wastePct,
      fastenerCrossings: totalCrossings,
      fastenerBoxes,
    },
    framing: {
      joistCount: totalJoists,
      beamCount: totalBeams,
      postCount: totalPosts,
      footingCount: totalFootings,
      concreteVolumeCuYd,
      concreteBags80lb,
      ledgerLengthLf: round2(houseLedgerLf),
    },
    railing: {
      lengthLf: round2(railingLf),
      type: input.railing.type,
    },
    stairs: {
      riserCount,
      treadCount,
      stringerCount,
      widthFt: stairWidthFt,
    },
    materialsTotal,
    laborTotal,
    contingencyAmount,
    grandTotal,
    lowEstimate,
    highEstimate,
    costPerSqFt,
    costPerSqFtRange,
    diyTotal,
    diySavings,
    lineItems,
    bom,
  };
}

// ---------- Standard Size Table (SPEC §3.2) ----------
export interface DeckSizeBenchmark {
  dimensions: string;
  areaSqFt: number;
  ptPineCost: { low: number; typical: number; high: number };
  cedarCost: { low: number; typical: number; high: number };
  compositeCost: { low: number; typical: number; high: number };
  pvcCost: { low: number; typical: number; high: number };
}

export const DECK_SIZE_BENCHMARKS: DeckSizeBenchmark[] = [
  { dimensions: '10 × 10', areaSqFt: 100, ptPineCost: { low: 2200, typical: 3200, high: 4400 }, cedarCost: { low: 3000, typical: 4300, high: 5800 }, compositeCost: { low: 3600, typical: 5100, high: 6900 }, pvcCost: { low: 4600, typical: 6400, high: 8800 } },
  { dimensions: '12 × 12', areaSqFt: 144, ptPineCost: { low: 3100, typical: 4400, high: 6100 }, cedarCost: { low: 4200, typical: 6000, high: 8100 }, compositeCost: { low: 5100, typical: 7100, high: 9700 }, pvcCost: { low: 6400, typical: 8900, high: 12200 } },
  { dimensions: '12 × 16', areaSqFt: 192, ptPineCost: { low: 4100, typical: 5800, high: 7900 }, cedarCost: { low: 5500, typical: 7800, high: 10600 }, compositeCost: { low: 6700, typical: 9300, high: 12700 }, pvcCost: { low: 8400, typical: 11700, high: 16000 } },
  { dimensions: '14 × 20', areaSqFt: 280, ptPineCost: { low: 5800, typical: 8200, high: 11300 }, cedarCost: { low: 7800, typical: 11100, high: 15100 }, compositeCost: { low: 9500, typical: 13300, high: 18200 }, pvcCost: { low: 12000, typical: 16700, high: 23000 } },
  { dimensions: '16 × 20', areaSqFt: 320, ptPineCost: { low: 6600, typical: 9300, high: 12800 }, cedarCost: { low: 8800, typical: 12600, high: 17100 }, compositeCost: { low: 10800, typical: 15100, high: 20600 }, pvcCost: { low: 13600, typical: 18900, high: 26100 } },
  { dimensions: '20 × 20', areaSqFt: 400, ptPineCost: { low: 8100, typical: 11400, high: 15800 }, cedarCost: { low: 10900, typical: 15500, high: 21100 }, compositeCost: { low: 13300, typical: 18600, high: 25400 }, pvcCost: { low: 16700, typical: 23300, high: 32200 } },
];

export function deckSizeTable(materialId: DeckMaterialId) {
  const m = DECK_MATERIALS[materialId] || DECK_MATERIALS.pt_pine;
  return DECK_SIZE_BENCHMARKS.map((b) => {
    // Generate exact price with standard height/railing defaults
    const input: DeckCostInput = {
      mode: 'new',
      sections: [{ name: 'Main', lengthFt: Math.sqrt(b.areaSqFt), widthFt: Math.sqrt(b.areaSqFt), isAttached: true, houseEdge: 'length' }],
      heightBand: 'low',
      materialId,
      boardWidthIn: 5.5,
      boardLengthFt: 16,
      gapIn: m.recommendedGapIn,
      pattern: 'straight',
      pictureFrame: false,
      framing: DEFAULT_FRAMING,
      railing: { include: true, type: 'wood' },
      stairs: { include: true, widthFt: 4, hasLanding: false },
      fastenerType: 'face_screws',
      isDIY: false,
      regionIndex: 1.0,
      contingencyPct: 10,
      currencySymbol: '$',
    };
    const res = calculateDeckCost(input);
    return {
      dimensions: b.dimensions,
      areaSqFt: b.areaSqFt,
      low: res.lowEstimate,
      typical: res.grandTotal,
      high: res.highEstimate,
      costPerSqFt: res.costPerSqFt,
    };
  });
}

// ---------- Material Comparison (SPEC §3.2) ----------
export interface MaterialComparisonItem {
  id: DeckMaterialId;
  label: string;
  category: string;
  upfrontCost: number;
  lifespanYears: number;
  annualMaintenance: number;
  lifetimeCost25Yr: number;
  costPerYearOfService: number;
  pros: string;
  cons: string;
}

export function compareMaterials(input: DeckCostInput): MaterialComparisonItem[] {
  const materials: DeckMaterialId[] = ['pt_pine', 'cedar', 'composite_basic', 'composite_premium', 'pvc', 'ipe'];
  const area = floorArea(input.sections.length > 0 ? input.sections : [{ lengthFt: 16, widthFt: 12 }]);

  return materials.map((mId) => {
    const mat = DECK_MATERIALS[mId];
    const clone = { ...input, materialId: mId };
    const res = calculateDeckCost(clone);
    const annualMaint = round2(area * mat.annualMaintenancePerSqFt);
    const lifetimeCost25Yr = round2(res.grandTotal + (annualMaint * 25));
    const costPerYearOfService = round2(res.grandTotal / mat.lifespanYears + annualMaint);

    let pros = '';
    let cons = '';
    switch (mId) {
      case 'pt_pine':
        pros = 'Lowest initial upfront cost, widely available';
        cons = 'Requires annual washing & sealing every 2 yrs, susceptible to warping';
        break;
      case 'cedar':
        pros = 'Natural beauty, pleasant aroma, naturally insect and rot resistant';
        cons = 'Softer wood that dents easily, requires regular staining to maintain color';
        break;
      case 'composite_basic':
        pros = 'No splinters, no annual staining, rot-proof';
        cons = 'Higher upfront price, uncapped surface prone to grease stains';
        break;
      case 'composite_premium':
        pros = '4-sided protective cap, 25-30 yr fade & stain warranty, realistic wood grain';
        cons = 'Higher upfront investment, boards get hotter in direct sun';
        break;
      case 'pvc':
        pros = 'Zero organic wood fibers, 100% moisture impervious, lightweight, 40+ yr life';
        cons = 'Highest initial investment, expansive across long runs';
        break;
      case 'ipe':
        pros = 'Incredible 50+ yr density and hardness, Class A fire rating, heirloom aesthetics';
        cons = 'Very difficult to cut and pre-drill, expensive imported timber';
        break;
    }

    return {
      id: mId,
      label: mat.label,
      category: mat.category,
      upfrontCost: res.grandTotal,
      lifespanYears: mat.lifespanYears,
      annualMaintenance: annualMaint,
      lifetimeCost25Yr,
      costPerYearOfService,
      pros,
      cons,
    };
  });
}

// ---------- Contractor Quote Verifier (SPEC §3.2) ----------
export interface QuoteCheckResult {
  status: 'low' | 'fair' | 'high' | 'very_high';
  headline: string;
  diffAmount: number;
  diffPercent: number;
  explanation: string;
}

export function checkQuote(contractorQuote: number, calculatedResult: DeckCostResult): QuoteCheckResult {
  const quote = pos(contractorQuote);
  const fair = calculatedResult.grandTotal;
  const low = calculatedResult.lowEstimate;
  const high = calculatedResult.highEstimate;

  if (quote === 0 || fair === 0) {
    return {
      status: 'fair',
      headline: 'Enter a valid quote amount to evaluate',
      diffAmount: 0,
      diffPercent: 0,
      explanation: 'Compare your contractor bid against our independent, material-based takeoff estimate.',
    };
  }

  const diffAmount = round2(quote - fair);
  const diffPercent = round2(((quote - fair) / fair) * 100);

  if (quote < low * 0.9) {
    return {
      status: 'low',
      headline: 'Quote is unusually low (Verify Scope & Materials)',
      diffAmount,
      diffPercent,
      explanation: `This bid is ${Math.abs(diffPercent)}% below our low benchmark of $${low.toLocaleString()}. Verify if the contractor omitted permit fees, joist tape, proper footing depth below the frost line, or high-grade fasteners.`,
    };
  }

  if (quote <= high * 1.05) {
    return {
      status: 'fair',
      headline: 'Fair & Competitive Contractor Bid',
      diffAmount,
      diffPercent,
      explanation: `This quote sits comfortably within our calculated typical market range ($${low.toLocaleString()} – $${high.toLocaleString()}) for your specified size, height, and materials.`,
    };
  }

  if (quote <= high * 1.3) {
    return {
      status: 'high',
      headline: 'Quote is higher than average',
      diffAmount,
      diffPercent,
      explanation: `This bid is ${diffPercent}% above our fair market midpoint. It may reflect premium composite trim, tight site access, complex multi-level steps, or peak-season contractor demand.`,
    };
  }

  return {
    status: 'very_high',
    headline: 'Quote is significantly inflated',
    diffAmount,
    diffPercent,
    explanation: `This bid is ${diffPercent}% higher than our estimated high benchmark ($${high.toLocaleString()}). We recommend requesting an itemized line-item breakdown of lumber, decking, and labor hours, or soliciting 2 additional competitive bids.`,
  };
}
