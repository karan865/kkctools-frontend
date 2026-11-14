/**
 * Shingle Roof Calculator engine (Batch 2, Tier 1 #5).
 *
 * Roof area from roof sections (footprint × pitch factor, or a measured sloped area),
 * then squares → bundles, plus the accessories nobody else totals: starter strip,
 * hip & ridge cap, drip edge, underlayment, ice & water barrier and nails.
 *
 * Product coverage defaults come from manufacturer data (see src/content/calculation-methods.ts):
 *   3-tab 12" × 36", 5" exposure: 80 shingles & 3 bundles per square (Owens Corning Supreme)
 *   architectural 13¼" × 39⅜", 5⅝" exposure: 64 pieces & 3 bundles per square (GAF Timberline HDZ)
 *   starter: 105 lin ft per bundle (OC Starter Strip Plus) · hip & ridge: 33 lin ft per bundle (OC ProEdge)
 *   underlayment: synthetic ≈ 10 squares, #15 felt ≈ 4, #30 felt ≈ 2 squares per roll (net of laps)
 *   ice & water barrier: 2 squares (36 in × 66.7 ft) per roll
 * Every value is editable in the UI because products differ.
 *
 * All lengths are in feet and areas in square feet internally. Pure functions, no network.
 */

export const SQFT_PER_SQUARE = 100;
export const M2_PER_SQUARE = 9.290304; // 100 ft² exactly
export const FT_PER_M = 1 / 0.3048;

/** Slope factor: sloped length ÷ horizontal run = √(1 + (rise/12)²). */
export function pitchFactor(risePer12: number): number {
  const r = Math.max(0, risePer12);
  return Math.sqrt(1 + (r / 12) ** 2);
}
export const pitchToDegrees = (risePer12: number) => (Math.atan(Math.max(0, risePer12) / 12) * 180) / Math.PI;
export const degreesToPitch = (deg: number) => Math.tan((Math.min(Math.max(deg, 0), 80) * Math.PI) / 180) * 12;

// ---------- shingle products ----------
export interface ShingleType {
  id: string;
  label: string;
  bundlesPerSquare: number;
  shinglesPerSquare: number;
  nailsPerShingle: number;
  note: string;
}
export const SHINGLE_TYPES: ShingleType[] = [
  { id: 'arch', label: 'Architectural (laminated)', bundlesPerSquare: 3, shinglesPerSquare: 64, nailsPerShingle: 4, note: '13¼ × 39⅜ in, 5⅝ in exposure — e.g. GAF Timberline HDZ' },
  { id: 'threeTab', label: '3-tab, 12 × 36 in', bundlesPerSquare: 3, shinglesPerSquare: 80, nailsPerShingle: 4, note: '5 in exposure — e.g. Owens Corning Supreme' },
  { id: 'threeTabMetric', label: '3-tab, 13¼ × 39⅜ in', bundlesPerSquare: 3, shinglesPerSquare: 65, nailsPerShingle: 4, note: '5⅝ in exposure' },
  { id: 'premium', label: 'Premium / designer', bundlesPerSquare: 4, shinglesPerSquare: 64, nailsPerShingle: 4, note: 'some heavy lines ship 4 bundles per square — e.g. OC Duration MAX' },
];
export const shingleById = (id: string) => SHINGLE_TYPES.find((s) => s.id === id) || SHINGLE_TYPES[0];

// ---------- underlayment ----------
export const UNDERLAYMENTS: { id: string; label: string; sqftPerRoll: number }[] = [
  { id: 'synthetic', label: 'Synthetic (≈10 squares/roll)', sqftPerRoll: 1000 },
  { id: 'felt15', label: '#15 felt (≈4 squares/roll)', sqftPerRoll: 400 },
  { id: 'felt30', label: '#30 felt (≈2 squares/roll)', sqftPerRoll: 200 },
  { id: 'none', label: 'None', sqftPerRoll: 0 },
];
export const underlaymentById = (id: string) => UNDERLAYMENTS.find((u) => u.id === id) || UNDERLAYMENTS[0];

// ---------- waste ----------
export const WASTE_PRESETS: { id: string; label: string; percent: number }[] = [
  { id: 'simple', label: 'Simple gable', percent: 10 },
  { id: 'hip', label: 'Hip roof', percent: 15 },
  { id: 'complex', label: 'Complex (valleys, dormers)', percent: 20 },
];

// ---------- roof sections ----------
export type SectionShape = 'gable' | 'hip' | 'shed' | 'area';
export interface RoofSection {
  id: string;
  shape: SectionShape;
  length: number; // ft, building length (along the ridge)
  width: number; // ft, building width (across the ridge)
  overhang: number; // ft, eave/rake overhang each side
  pitch: number; // rise per 12
  area: number; // ft², sloped area (shape 'area' only)
}

export interface SectionResult {
  id: string;
  planArea: number;
  roofArea: number;
  eaves: number;
  rakes: number;
  ridge: number;
  hips: number;
}

/** Roof area and edge lengths for one section (edges are 0 for a measured 'area' section). */
export function sectionGeometry(s: RoofSection): SectionResult {
  const f = pitchFactor(s.pitch);
  if (s.shape === 'area') {
    return { id: s.id, planArea: Math.max(0, s.area) / f, roofArea: Math.max(0, s.area), eaves: 0, rakes: 0, ridge: 0, hips: 0 };
  }
  const oh = Math.max(0, s.overhang);
  const L = Math.max(0, s.length) + 2 * oh;
  const W = Math.max(0, s.width) + 2 * oh;
  const planArea = L * W;
  const roofArea = planArea * f;
  if (!(s.length > 0) || !(s.width > 0)) return { id: s.id, planArea: 0, roofArea: 0, eaves: 0, rakes: 0, ridge: 0, hips: 0 };

  if (s.shape === 'shed') {
    // one plane: low eave along L, high edge along L, rakes up the two ends
    return { id: s.id, planArea, roofArea, eaves: L, rakes: 2 * W * f, ridge: 0, hips: 0 };
  }
  if (s.shape === 'gable') {
    return { id: s.id, planArea, roofArea, eaves: 2 * L, rakes: 4 * (W / 2) * f, ridge: L, hips: 0 };
  }
  // hip: eaves all round, ridge = long side − short side, 4 hips
  const long = Math.max(L, W);
  const short = Math.min(L, W);
  const run = short / 2;
  const hipLength = Math.sqrt(2 * run * run + (run * (s.pitch / 12)) ** 2);
  return { id: s.id, planArea, roofArea, eaves: 2 * (L + W), rakes: 0, ridge: long - short, hips: 4 * hipLength };
}

// ---------- full estimate ----------
export interface ShingleInput {
  sections: RoofSection[];
  wastePercent: number;
  bundlesPerSquare: number;
  shinglesPerSquare: number;
  nailsPerShingle: number;
  starterLfPerBundle: number;
  starterOnRakes: boolean;
  ridgeLfPerBundle: number;
  dripEdgePieceFt: number;
  underlaymentSqftPerRoll: number;
  iceCourses: number; // rows of ice & water barrier along the eaves (0 = none)
  iceRollWidthFt: number;
  iceSqftPerRoll: number;
  valleyLf: number; // valleys lined with ice & water barrier
  /** Optional manual edge lengths (ft); when set they replace the automatic estimate. */
  edgeOverride?: Partial<Record<'eaves' | 'rakes' | 'ridge' | 'hips', number>>;
}

export interface ShingleResult {
  sections: SectionResult[];
  planArea: number;
  roofArea: number;
  squares: number; // exact, before waste
  squaresWithWaste: number;
  bundles: number; // whole bundles
  orderSquares: number; // bundles ÷ bundles per square
  shingles: number; // pieces in the bundles bought
  eaves: number;
  rakes: number;
  ridge: number;
  hips: number;
  starterLf: number;
  starterBundles: number;
  ridgeLf: number;
  ridgeBundles: number;
  dripEdgeLf: number;
  dripEdgePieces: number;
  iceSqft: number;
  iceRolls: number;
  underlaymentSqft: number;
  underlaymentRolls: number;
  nails: number;
}

const pos = (n: number) => (isFinite(n) && n > 0 ? n : 0);
const ceilSafe = (n: number) => (n <= 0 ? 0 : Math.ceil(n - 1e-9));

export function calculateShingles(input: ShingleInput): ShingleResult {
  const sections = input.sections.map(sectionGeometry);
  const sum = (k: keyof SectionResult) => sections.reduce((s, x) => s + (x[k] as number), 0);
  const planArea = sum('planArea');
  const roofArea = sum('roofArea');
  const o = input.edgeOverride || {};
  const pick = (k: 'eaves' | 'rakes' | 'ridge' | 'hips') => (o[k] !== undefined && isFinite(o[k] as number) && (o[k] as number) >= 0 ? (o[k] as number) : sum(k));
  const eaves = pick('eaves');
  const rakes = pick('rakes');
  const ridge = pick('ridge');
  const hips = pick('hips');

  const squares = roofArea / SQFT_PER_SQUARE;
  const squaresWithWaste = squares * (1 + pos(input.wastePercent) / 100);
  const bps = pos(input.bundlesPerSquare);
  const bundles = ceilSafe(squaresWithWaste * bps);
  const orderSquares = bps > 0 ? bundles / bps : 0;
  const shingles = Math.round(orderSquares * pos(input.shinglesPerSquare));

  const starterLf = eaves + (input.starterOnRakes ? rakes : 0);
  const starterBundles = pos(input.starterLfPerBundle) > 0 ? ceilSafe(starterLf / input.starterLfPerBundle) : 0;
  const ridgeLf = ridge + hips;
  const ridgeBundles = pos(input.ridgeLfPerBundle) > 0 ? ceilSafe(ridgeLf / input.ridgeLfPerBundle) : 0;
  const dripEdgeLf = eaves + rakes;
  const dripEdgePieces = pos(input.dripEdgePieceFt) > 0 ? ceilSafe(dripEdgeLf / input.dripEdgePieceFt) : 0;

  const iceSqft = Math.min(roofArea, eaves * Math.max(0, Math.floor(input.iceCourses)) * pos(input.iceRollWidthFt) + pos(input.valleyLf) * pos(input.iceRollWidthFt));
  const iceRolls = pos(input.iceSqftPerRoll) > 0 ? ceilSafe(iceSqft / input.iceSqftPerRoll) : 0;
  const underlaymentSqft = Math.max(0, roofArea - iceSqft);
  const underlaymentRolls = pos(input.underlaymentSqftPerRoll) > 0 ? ceilSafe(underlaymentSqft / input.underlaymentSqftPerRoll) : 0;

  const nails = Math.round(squaresWithWaste * pos(input.shinglesPerSquare) * pos(input.nailsPerShingle));

  return {
    sections,
    planArea,
    roofArea,
    squares,
    squaresWithWaste,
    bundles,
    orderSquares,
    shingles,
    eaves,
    rakes,
    ridge,
    hips,
    starterLf,
    starterBundles,
    ridgeLf,
    ridgeBundles,
    dripEdgeLf,
    dripEdgePieces,
    iceSqft,
    iceRolls,
    underlaymentSqft,
    underlaymentRolls,
    nails,
  };
}

export interface ShingleCost {
  shingles: number;
  starter: number;
  ridge: number;
  dripEdge: number;
  underlayment: number;
  ice: number;
  total: number;
}
export function estimateShingleCost(
  r: ShingleResult,
  p: { bundle?: number; starter?: number; ridge?: number; dripEdge?: number; underlayment?: number; ice?: number },
): ShingleCost {
  const c = {
    shingles: r.bundles * pos(p.bundle ?? 0),
    starter: r.starterBundles * pos(p.starter ?? 0),
    ridge: r.ridgeBundles * pos(p.ridge ?? 0),
    dripEdge: r.dripEdgePieces * pos(p.dripEdge ?? 0),
    underlayment: r.underlaymentRolls * pos(p.underlayment ?? 0),
    ice: r.iceRolls * pos(p.ice ?? 0),
  };
  return { ...c, total: c.shingles + c.starter + c.ridge + c.dripEdge + c.underlayment + c.ice };
}

export function defaultSection(id: string, over: Partial<RoofSection> = {}): RoofSection {
  return { id, shape: 'gable', length: 40, width: 28, overhang: 1, pitch: 6, area: 1500, ...over };
}

/** Defaults used by the page examples and tables: architectural shingles, synthetic underlayment, 10% waste. */
export function defaultShingleInput(sections: RoofSection[], over: Partial<ShingleInput> = {}): ShingleInput {
  const t = SHINGLE_TYPES[0];
  return {
    sections,
    wastePercent: 10,
    bundlesPerSquare: t.bundlesPerSquare,
    shinglesPerSquare: t.shinglesPerSquare,
    nailsPerShingle: t.nailsPerShingle,
    starterLfPerBundle: 105,
    starterOnRakes: true,
    ridgeLfPerBundle: 33,
    dripEdgePieceFt: 10,
    underlaymentSqftPerRoll: 1000,
    iceCourses: 0,
    iceRollWidthFt: 3,
    iceSqftPerRoll: 200,
    valleyLf: 0,
    ...over,
  };
}
