/**
 * Deck Stain Calculator engine (Batch 2, Tier 1 #10).
 *
 * Surface area of every part of a deck → gallons (or litres) of stain → cans to buy → cost.
 *   floor        = Σ sections L × W (+ board edges if stained)
 *   railing      = posts (4 faces) + rails (perimeter × length) + balusters (4 faces or π·d) — or a simple L × H × 2
 *   stairs       = treads + risers + stringer faces
 *   skirting     = L × H × sides
 *   coat 1       = area ÷ (coverage × wood-condition factor)
 *   coat 2       = area ÷ (coat-1 coverage × second-coat factor)
 *   to buy       = (coat 1 + coat 2) × (1 + waste %)
 *
 * Coverage defaults come from manufacturer data (BEHR PREMIUM stain family); wood-condition and
 * second-coat factors are explained, editable assumptions (see calculation-methods.ts).
 * Canonical units: feet, inches, ft², US gallons. Pure functions, no network.
 */

export const L_PER_GAL = 3.785411784;
export const SQFT_PER_M2 = 10.7639104;
export const M_PER_FT = 0.3048;

// ---------- stain data ----------
export type Opacity = 'transparent' | 'semi' | 'solid';
export interface OpacitySpec {
  id: Opacity;
  label: string;
  /** published first-coat coverage range, ft²/gal */
  coat1: [number, number];
  /** published second-coat coverage range, ft²/gal */
  coat2: [number, number];
  /** default first-coat coverage used by the calculator (low end of the range = enough stain) */
  coverage: number;
  product: string;
}
export const OPACITIES: OpacitySpec[] = [
  { id: 'transparent', label: 'Transparent / toner', coat1: [300, 350], coat2: [600, 700], coverage: 300, product: 'BEHR PREMIUM Transparent Waterproofing Wood Finish (No. 500)' },
  { id: 'semi', label: 'Semi-transparent', coat1: [250, 300], coat2: [500, 600], coverage: 250, product: 'BEHR PREMIUM Semi-Transparent Waterproofing Stain & Sealer (No. 5077)' },
  { id: 'solid', label: 'Solid colour', coat1: [200, 400], coat2: [400, 800], coverage: 250, product: 'BEHR PREMIUM Solid Color Waterproofing Stain & Sealer (No. 5011)' },
];
export const opacityById = (id: string): OpacitySpec => OPACITIES.find((o) => o.id === id) || OPACITIES[1];

export type Condition = 'smooth' | 'weathered' | 'rough';
/** Multiplier on label coverage. Rough 0.62 ≈ Duckback SuperDeck rough (175–225) ÷ smooth (275–375); weathered is a midway assumption. */
export const CONDITION_FACTOR: Record<Condition, number> = { smooth: 1, weathered: 0.8, rough: 0.62 };
export const CONDITION_LABEL: Record<Condition, string> = { smooth: 'New / smooth', weathered: 'Weathered / grey', rough: 'Rough-sawn / very porous' };

export type Method = 'brush' | 'spray';
/** Default allowance for drips, overspray and leftovers in the tray (working assumption, editable). */
export const METHOD_WASTE: Record<Method, number> = { brush: 10, spray: 15 };

/** Second coat covers more because the wood is already partly filled: TWP ≈ 1.3–1.5×, BEHR ≈ 2×. */
export const DEFAULT_SECOND_COAT_FACTOR = 1.5;

// ---------- inputs ----------
export interface Section {
  lengthFt: number;
  widthFt: number;
}

export type RailingMode = 'none' | 'simple' | 'detailed';
export interface Railing {
  mode: RailingMode;
  lengthFt: number;
  heightIn: number;
  postIn: number; // post face width (4×4 = 3.5 in)
  postSpacingFt: number;
  rails: number; // horizontal rails (top + bottom = 2)
  railWidthIn: number; // 2×4 laid flat = 3.5 in
  railThickIn: number; // 1.5 in
  baluster: 'square' | 'round';
  balusterIn: number; // 2×2 = 1.5 in, round = diameter
  gapIn: number; // clear gap between balusters
}

export interface Stairs {
  steps: number;
  widthFt: number;
  treadIn: number;
  riserIn: number;
  risers: boolean;
  stringers: number; // visible stringers (outer = 2)
  stringerDepthIn: number; // 2×12 = 11.25 in
}

export interface Skirting {
  lengthFt: number;
  heightFt: number;
  sides: 1 | 2;
}

export interface Boards {
  edges: boolean;
  widthIn: number; // 5.5 in for 6-inch decking
  thickIn: number; // 1 in for 5/4 decking
  gapIn: number;
}

export interface StainOptions {
  opacity: Opacity;
  coverage: number; // first-coat coverage on the label, ft²/gal
  coats: 1 | 2;
  secondCoatFactor: number;
  condition: Condition;
  wastePct: number;
}

export interface CostOptions {
  pricePerGal: number;
  pricePerPail: number; // 5-gal pail; 0 = not used
  cleaner: boolean;
  cleanerCoverage: number; // ft²/gal ready to use
  cleanerPricePerGal: number;
  labourPerSqFt: number;
  prep: 'none' | 'wash' | 'strip' | 'sand';
  washPerSqFt: number;
  stripPerSqFt: number;
  sandPerSqFt: number;
  /** price stain by metric tins (litres bought × price per litre) instead of US cans */
  metricCans?: boolean;
}

export interface DeckStainInput {
  sections: Section[];
  boards: Boards;
  railing: Railing;
  stairs: Stairs;
  skirting: Skirting;
  stain: StainOptions;
  cost: CostOptions;
}

export const DEFAULT_RAILING: Railing = {
  mode: 'detailed',
  lengthFt: 40,
  heightIn: 36,
  postIn: 3.5,
  postSpacingFt: 6,
  rails: 2,
  railWidthIn: 3.5,
  railThickIn: 1.5,
  baluster: 'square',
  balusterIn: 1.5,
  gapIn: 3.5,
};
export const DEFAULT_STAIRS: Stairs = { steps: 0, widthFt: 4, treadIn: 10.5, riserIn: 7.5, risers: true, stringers: 2, stringerDepthIn: 11.25 };
export const DEFAULT_SKIRTING: Skirting = { lengthFt: 0, heightFt: 2, sides: 1 };
export const DEFAULT_BOARDS: Boards = { edges: false, widthIn: 5.5, thickIn: 1, gapIn: 0.125 };
export const DEFAULT_STAIN: StainOptions = { opacity: 'semi', coverage: 250, coats: 2, secondCoatFactor: DEFAULT_SECOND_COAT_FACTOR, condition: 'smooth', wastePct: 10 };
export const DEFAULT_COST: CostOptions = {
  pricePerGal: 45,
  pricePerPail: 0,
  cleaner: true,
  cleanerCoverage: 250,
  cleanerPricePerGal: 17,
  labourPerSqFt: 1.5,
  prep: 'wash',
  washPerSqFt: 0.35,
  stripPerSqFt: 2,
  sandPerSqFt: 2.5,
};

// ---------- geometry ----------
const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const int = (n: number) => Math.max(0, Math.floor(pos(n) + 1e-9));

export const floorArea = (sections: Section[]) => sections.reduce((a, s) => a + pos(s.lengthFt) * pos(s.widthFt), 0);

/** Board edges add 2 × thickness for every (board width + gap) of deck width. */
export function edgeArea(floorSqFt: number, b: Boards): number {
  if (!b.edges) return 0;
  const pitch = pos(b.widthIn) + pos(b.gapIn);
  return pitch > 0 ? floorSqFt * ((2 * pos(b.thickIn)) / pitch) : 0;
}

export interface RailingArea {
  posts: number;
  postCount: number;
  rails: number;
  balusters: number;
  balusterCount: number;
  total: number;
}
export function railingArea(r: Railing): RailingArea {
  const L = pos(r.lengthFt);
  const H = pos(r.heightIn) / 12;
  const zero = { posts: 0, postCount: 0, rails: 0, balusters: 0, balusterCount: 0, total: 0 };
  if (r.mode === 'none' || L === 0 || H === 0) return zero;
  if (r.mode === 'simple') return { ...zero, total: L * H * 2 };
  const postCount = pos(r.postSpacingFt) > 0 ? Math.ceil(L / r.postSpacingFt - 1e-9) + 1 : 0;
  const posts = postCount * 4 * (pos(r.postIn) / 12) * H;
  const rails = int(r.rails) * ((2 * pos(r.railWidthIn) + 2 * pos(r.railThickIn)) / 12) * L;
  const pitch = pos(r.balusterIn) + pos(r.gapIn);
  const balusterCount = pitch > 0 ? Math.floor((L * 12) / pitch + 1e-9) : 0;
  const balH = Math.max(0, pos(r.heightIn) - int(r.rails) * pos(r.railThickIn)) / 12;
  const perBaluster = r.baluster === 'round' ? Math.PI * (pos(r.balusterIn) / 12) * balH : 4 * (pos(r.balusterIn) / 12) * balH;
  const balusters = balusterCount * perBaluster;
  return { posts, postCount, rails, balusters, balusterCount, total: posts + rails + balusters };
}

export interface StairsArea {
  treads: number;
  risers: number;
  stringers: number;
  total: number;
}
export function stairsArea(s: Stairs): StairsArea {
  const n = int(s.steps);
  const W = pos(s.widthFt);
  if (n === 0 || W === 0) return { treads: 0, risers: 0, stringers: 0, total: 0 };
  const treads = n * W * (pos(s.treadIn) / 12);
  const risers = s.risers ? n * W * (pos(s.riserIn) / 12) : 0;
  const runIn = n * pos(s.treadIn);
  const riseIn = n * pos(s.riserIn);
  const lengthFt = Math.hypot(runIn, riseIn) / 12;
  const stringers = int(s.stringers) * 2 * lengthFt * (pos(s.stringerDepthIn) / 12);
  return { treads, risers, stringers, total: treads + risers + stringers };
}

export const skirtingArea = (k: Skirting) => pos(k.lengthFt) * pos(k.heightFt) * (k.sides === 2 ? 2 : 1);

// ---------- cans ----------
export interface CanPlan {
  pails: number; // 5 gal
  gallons: number; // 1 gal
  boughtGal: number;
  cost: number;
}
/** Cheapest mix of 5-gal pails and 1-gal cans that covers `needGal` (pails only considered when priced). */
export function planCans(needGal: number, pricePerGal: number, pricePerPail: number): CanPlan {
  const need = pos(needGal);
  if (need === 0) return { pails: 0, gallons: 0, boughtGal: 0, cost: 0 };
  const g = pos(pricePerGal);
  const p = pos(pricePerPail);
  const onlyGallons = (): CanPlan => {
    const gallons = Math.ceil(need - 1e-9);
    return { pails: 0, gallons, boughtGal: gallons, cost: gallons * g };
  };
  if (p === 0) return onlyGallons();
  let best = onlyGallons();
  const maxPails = Math.ceil(need / 5 - 1e-9);
  for (let pails = 1; pails <= maxPails; pails++) {
    const gallons = Math.max(0, Math.ceil(need - pails * 5 - 1e-9));
    const cost = pails * p + gallons * g;
    if (cost < best.cost - 1e-9 || (Math.abs(cost - best.cost) < 1e-9 && pails * 5 + gallons < best.boughtGal)) best = { pails, gallons, boughtGal: pails * 5 + gallons, cost };
  }
  return best;
}

export interface LitrePlan {
  five: number;
  twoHalf: number;
  one: number;
  boughtL: number;
}
/** Fewest metric tins (5 L, 2.5 L, 1 L) covering `needL`, rounding up to the next litre. */
export function planLitres(needL: number): LitrePlan {
  const need = pos(needL);
  if (need === 0) return { five: 0, twoHalf: 0, one: 0, boughtL: 0 };
  const five = Math.floor(need / 5 + 1e-9);
  const rest = need - five * 5;
  let twoHalf = 0;
  let one = 0;
  if (rest > 1e-9) {
    if (rest > 2.5 + 1e-9) {
      // 2.5 L + litres, or one more 5 L if that is no bigger
      const withHalf = 2.5 + Math.ceil(rest - 2.5 - 1e-9);
      if (withHalf >= 5) return { five: five + 1, twoHalf: 0, one: 0, boughtL: (five + 1) * 5 };
      twoHalf = 1;
      one = Math.ceil(rest - 2.5 - 1e-9);
    } else if (rest > 2 + 1e-9) {
      twoHalf = 1;
    } else {
      one = Math.ceil(rest - 1e-9);
    }
  }
  return { five, twoHalf, one, boughtL: five * 5 + twoHalf * 2.5 + one };
}

// ---------- main ----------
export interface DeckStainResult {
  areas: {
    floor: number;
    edges: number;
    railing: RailingArea;
    stairs: StairsArea;
    skirting: number;
    total: number;
  };
  coverage1: number; // effective ft²/gal, coat 1
  coverage2: number; // effective ft²/gal, coat 2
  coat1Gal: number;
  coat2Gal: number;
  rawGal: number;
  needGal: number;
  needL: number;
  cans: CanPlan;
  litres: LitrePlan;
  cleanerGal: number;
  cleanerL: number;
  cleanerCost: number;
  stainCost: number;
  diyTotal: number;
  prepCost: number;
  labourCost: number;
  proTotal: number;
  diyPerSqFt: number;
  proPerSqFt: number;
}

export function calculateDeckStain(input: DeckStainInput): DeckStainResult {
  const { stain, cost } = input;
  const floor = floorArea(input.sections);
  const edges = edgeArea(floor, input.boards);
  const railing = railingArea(input.railing);
  const stairs = stairsArea(input.stairs);
  const skirting = skirtingArea(input.skirting);
  const total = floor + edges + railing.total + stairs.total + skirting;

  const coverage1 = pos(stain.coverage) * (CONDITION_FACTOR[stain.condition] ?? 1);
  const coverage2 = coverage1 * (pos(stain.secondCoatFactor) || 1);
  const coat1Gal = coverage1 > 0 ? total / coverage1 : 0;
  const coat2Gal = stain.coats === 2 && coverage2 > 0 ? total / coverage2 : 0;
  const rawGal = coat1Gal + coat2Gal;
  const needGal = rawGal * (1 + pos(stain.wastePct) / 100);
  const needL = needGal * L_PER_GAL;
  const cans = planCans(needGal, cost.pricePerGal, cost.pricePerPail);
  const litres = planLitres(needL);

  // cleaner goes on walking surfaces and anything being stained
  const cleanOn = cost.cleaner && pos(cost.cleanerCoverage) > 0;
  const cleanerGal = cleanOn ? Math.ceil(total / cost.cleanerCoverage - 1e-9) : 0;
  const cleanerL = cleanOn ? Math.ceil((total / cost.cleanerCoverage) * L_PER_GAL - 1e-9) : 0;
  const money = (n: number) => Math.round(n * 100) / 100;
  const perL = (perGal: number) => pos(perGal) / L_PER_GAL;
  const cleanerCost = money(cost.metricCans ? cleanerL * perL(cost.cleanerPricePerGal) : cleanerGal * pos(cost.cleanerPricePerGal));
  const stainCost = money(cost.metricCans ? litres.boughtL * perL(cost.pricePerGal) : cans.cost);
  const diyTotal = money(stainCost + cleanerCost);

  const prepRate = cost.prep === 'wash' ? cost.washPerSqFt : cost.prep === 'strip' ? cost.stripPerSqFt : cost.prep === 'sand' ? cost.sandPerSqFt : 0;
  const prepCost = money(total * pos(prepRate));
  const labourCost = money(total * pos(cost.labourPerSqFt));
  // a pro supplies the stain; cleaner is part of their prep line
  const proTotal = money(stainCost + prepCost + labourCost);
  const base = floor + stairs.treads; // walkable area people compare quotes against
  return {
    areas: { floor, edges, railing, stairs, skirting, total },
    coverage1,
    coverage2,
    coat1Gal,
    coat2Gal,
    rawGal,
    needGal,
    needL,
    cans,
    litres,
    cleanerGal,
    cleanerL,
    cleanerCost,
    stainCost,
    diyTotal,
    prepCost,
    labourCost,
    proTotal,
    diyPerSqFt: base > 0 ? diyTotal / base : 0,
    proPerSqFt: base > 0 ? proTotal / base : 0,
  };
}

export function defaultInput(over: Partial<DeckStainInput> = {}): DeckStainInput {
  return {
    sections: [{ lengthFt: 16, widthFt: 20 }],
    boards: DEFAULT_BOARDS,
    railing: DEFAULT_RAILING,
    stairs: DEFAULT_STAIRS,
    skirting: DEFAULT_SKIRTING,
    stain: DEFAULT_STAIN,
    cost: DEFAULT_COST,
    ...over,
  };
}

/** Floor-only gallons for a plain deck (page tables). */
export function floorGallons(lengthFt: number, widthFt: number, stain: Partial<StainOptions> = {}): number {
  return calculateDeckStain(
    defaultInput({ sections: [{ lengthFt, widthFt }], railing: { ...DEFAULT_RAILING, mode: 'none' }, stain: { ...DEFAULT_STAIN, ...stain } }),
  ).needGal;
}
