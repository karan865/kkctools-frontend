/**
 * Hardwood Floor Refinishing Cost Calculator engine (Batch 2, Tier 2 #15).
 *
 * Professional estimate = floor area × method rate (× species factor for sanding methods)
 *   + stain + repairs + subfloor + carpet removal + stairs + furniture + baseboards,
 *   × region factor, never below an optional minimum job charge.
 * Every default is the midpoint of a dated published range (This Old House, Jun 2026; Fixr, Jan 2025)
 * and the low/high range uses the ends of the same ranges. Every price is editable.
 * DIY estimate = equipment rental + abrasives + stain + finish (gallons from coverage) + supplies.
 * Pure functions, no network.
 */

export const SQFT_PER_M2 = 10.7639104;

const mid = (lo: number, hi: number) => Math.round(((lo + hi) / 2) * 100) / 100;
const money = (n: number) => Math.round(n * 100) / 100;
const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export interface Range {
  low: number;
  high: number;
  /** default = midpoint */
  rate: number;
}
const range = (low: number, high: number): Range => ({ low, high, rate: mid(low, high) });

// ---------- methods ----------
export type Method = 'recoat' | 'sand' | 'dustless';
export interface MethodInfo extends Range {
  label: string;
  short: string;
  /** does the method cut into bare wood (uses up some of the floor's sandable thickness)? */
  removesWood: boolean;
  /** can the colour be changed (stain needs bare wood)? */
  stainable: boolean;
}
/** This Old House (Jun 2026): recoating $1–$2, sanding $3–$5.50, dustless $5–$8 per sq ft. */
export const METHODS: Record<Method, MethodInfo> = {
  recoat: { label: 'Screen & recoat', short: 'recoat', removesWood: false, stainable: false, ...range(1, 2) },
  sand: { label: 'Full sand & refinish', short: 'full sand', removesWood: true, stainable: true, ...range(3, 5.5) },
  dustless: { label: 'Dustless sand & refinish', short: 'dustless', removesWood: true, stainable: true, ...range(5, 8) },
};
export const METHOD_ORDER: Method[] = ['recoat', 'sand', 'dustless'];

// ---------- species ----------
export type Species = 'oak' | 'cherry' | 'engineered' | 'parquet' | 'bamboo' | 'pine' | 'maple' | 'mahogany';
/** This Old House cost to refinish by wood type ($/sq ft); factor = midpoint ÷ oak midpoint ($4). */
const SPECIES_RANGES: Record<Species, [string, number, number]> = {
  oak: ['Oak', 3, 5],
  cherry: ['Cherry', 3, 5],
  engineered: ['Engineered hardwood', 3, 5],
  parquet: ['Parquet', 3.5, 5],
  bamboo: ['Bamboo', 3, 6],
  pine: ['Pine', 4, 7],
  maple: ['Maple', 5, 8],
  mahogany: ['Mahogany', 6, 8],
};
export const SPECIES: Record<Species, { label: string; low: number; high: number; factor: number }> = Object.fromEntries(
  (Object.keys(SPECIES_RANGES) as Species[]).map((k) => {
    const [label, low, high] = SPECIES_RANGES[k];
    return [k, { label, low, high, factor: Math.round((mid(low, high) / mid(3, 5)) * 1000) / 1000 }];
  }),
) as Record<Species, { label: string; low: number; high: number; factor: number }>;

// ---------- add-ons ----------
/** This Old House: staining $1–$3 per sq ft (on top of sanding). */
export const STAIN = range(1, 3);
export type ExtraId = 'repair' | 'boards' | 'subfloor' | 'carpet' | 'stairs' | 'furniture' | 'baseboard';
export interface ExtraInfo extends Range {
  label: string;
  unit: 'sqft' | 'step' | 'room' | 'job';
  source: 'TOH' | 'Fixr';
}
export const EXTRAS: Record<ExtraId, ExtraInfo> = {
  repair: { label: 'Spot repairs (deep scratches, gouges, loose boards)', unit: 'sqft', source: 'TOH', ...range(6, 12) },
  boards: { label: 'Board replacement', unit: 'sqft', source: 'Fixr', ...range(14, 32) },
  subfloor: { label: 'Subfloor repair (water damage)', unit: 'sqft', source: 'TOH', ...range(3, 10) },
  carpet: { label: 'Carpet removal & disposal', unit: 'sqft', source: 'TOH', ...range(1, 5) },
  stairs: { label: 'Stairs (treads refinished)', unit: 'step', source: 'Fixr', ...range(25, 45) },
  furniture: { label: 'Moving furniture', unit: 'room', source: 'TOH', ...range(20, 50) },
  baseboard: { label: 'Remove & refit baseboards / shoe moulding', unit: 'job', source: 'Fixr', ...range(140, 140) },
};
export const EXTRA_ORDER: ExtraId[] = ['repair', 'boards', 'subfloor', 'carpet', 'stairs', 'furniture', 'baseboard'];

/** This Old House: new hardwood installed $6–$18 per sq ft. */
export const REPLACE = range(6, 18);
/** This Old House: labour runs about five hours per 100 sq ft. */
export const LABOUR_HOURS_PER_100 = 5;

// ---------- professional estimate ----------
export interface RefinishInput {
  areaSqFt: number;
  rooms: number;
  method: Method;
  species: Species;
  /** $/sq ft for the chosen method, before the species factor */
  methodRate: number;
  stain: boolean;
  stainRate: number;
  /** quantity per extra: sq ft, steps, rooms, or 1/0 for the job */
  qty: Partial<Record<ExtraId, number>>;
  /** $ per unit per extra */
  rates: Partial<Record<ExtraId, number>>;
  regionFactor: number;
  minimumCharge: number;
}

export interface Line {
  id: string;
  label: string;
  qty: number;
  unit: string;
  rate: number;
  amount: number;
  low: number;
  high: number;
}

export interface RefinishResult {
  lines: Line[];
  subtotal: number;
  subLow: number;
  subHigh: number;
  regionAdj: number;
  /** amount added to reach the minimum job charge */
  minimumTopUp: number;
  total: number;
  low: number;
  high: number;
  perSqFt: number;
  effectiveRate: number; // method rate after species factor
  labourHours: number;
}

/** Species factor applies to the sanding methods only (a recoat doesn't touch the wood). */
export const speciesFactor = (method: Method, species: Species) => (METHODS[method].removesWood ? SPECIES[species].factor : 1);

export function defaultRefinishInput(over: Partial<RefinishInput> = {}): RefinishInput {
  const method = over.method ?? 'sand';
  return {
    areaSqFt: 444,
    rooms: 2,
    method,
    species: 'oak',
    methodRate: METHODS[method].rate,
    stain: false,
    stainRate: STAIN.rate,
    qty: {},
    rates: Object.fromEntries(EXTRA_ORDER.map((k) => [k, EXTRAS[k].rate])),
    regionFactor: 1,
    minimumCharge: 0,
    ...over,
  };
}

/** Scales a user rate to low/high using the ratio of the published range ends to its midpoint. */
function lineOf(id: string, label: string, qty: number, unit: string, rate: number, r: Range): Line {
  const amount = money(qty * rate);
  const lo = r.rate > 0 ? r.low / r.rate : 1;
  const hi = r.rate > 0 ? r.high / r.rate : 1;
  return { id, label, qty, unit, rate, amount, low: money(amount * lo), high: money(amount * hi) };
}

export function calculateRefinish(input: RefinishInput): RefinishResult {
  const area = pos(input.areaSqFt);
  const m = METHODS[input.method];
  const factor = speciesFactor(input.method, input.species);
  const effectiveRate = money(pos(input.methodRate) * factor);
  const lines: Line[] = [];
  if (area > 0 && effectiveRate > 0) {
    lines.push(lineOf('method', m.label, area, 'sqft', effectiveRate, m));
  }
  if (input.stain && m.stainable && area > 0 && pos(input.stainRate) > 0) {
    lines.push(lineOf('stain', 'Stain (colour change)', area, 'sqft', pos(input.stainRate), STAIN));
  }
  for (const k of EXTRA_ORDER) {
    const e = EXTRAS[k];
    let q = pos(input.qty[k] ?? 0);
    if (k === 'furniture' && q > 0) q = Math.ceil(q);
    if (k === 'stairs') q = Math.floor(q);
    if (e.unit === 'job') q = q > 0 ? 1 : 0;
    if (e.unit === 'sqft') q = Math.min(q, area || q); // can't repair more floor than there is
    const rate = pos(input.rates[k] ?? e.rate);
    if (q > 0 && rate > 0) lines.push(lineOf(k, e.label, q, e.unit, rate, e));
  }

  const subtotal = money(lines.reduce((a, l) => a + l.amount, 0));
  const subLow = money(lines.reduce((a, l) => a + l.low, 0));
  const subHigh = money(lines.reduce((a, l) => a + l.high, 0));
  const rf = pos(input.regionFactor) || 1;
  const regionAdj = money(subtotal * (rf - 1));
  const before = money(subtotal + regionAdj);
  const minimum = pos(input.minimumCharge);
  const total = before > 0 && before < minimum ? minimum : before;
  const floorAt = (v: number) => (v > 0 && v < minimum ? minimum : v);
  return {
    lines,
    subtotal,
    subLow,
    subHigh,
    regionAdj,
    minimumTopUp: money(total - before),
    total: money(total),
    low: money(floorAt(subLow * rf)),
    high: money(floorAt(subHigh * rf)),
    perSqFt: area > 0 ? total / area : 0,
    effectiveRate,
    labourHours: (area / 100) * LABOUR_HOURS_PER_100,
  };
}

/** Quick estimate for the page tables: area, method, species, stain, nothing else. */
export function quickRefinish(areaSqFt: number, method: Method = 'sand', stain = false, species: Species = 'oak', rooms = 0): RefinishResult {
  return calculateRefinish(defaultRefinishInput({ areaSqFt, method, species, stain, methodRate: METHODS[method].rate, qty: rooms ? { furniture: rooms } : {} }));
}

/** Compare a contractor's quote with the estimate range. */
export function checkQuote(quote: number, r: RefinishResult): 'low' | 'within' | 'high' | 'n/a' {
  if (!(quote > 0) || !(r.total > 0)) return 'n/a';
  if (quote < r.low) return 'low';
  if (quote > r.high) return 'high';
  return 'within';
}

// ---------- refinish vs replace ----------
export function replaceCost(areaSqFt: number, rate = REPLACE.rate) {
  const a = pos(areaSqFt);
  return { total: money(a * rate), low: money(a * REPLACE.low), high: money(a * REPLACE.high) };
}

// ---------- DIY ----------
/** Minwax Ultimate Floor Finish (Sherwin-Williams): ~500 sq ft per gallon; Minwax Wood Finish stain: ~500 sq ft per gallon per coat. */
export const FINISH_COVERAGE = 500;
export const STAIN_COVERAGE = 500;
export type FinishType = 'oil' | 'water';
/** This Old House: polyurethane topcoat $20–$50 per gallon (oil-based); Fixr / This Old House: water-based $30–$55. */
export const FINISHES: Record<FinishType, { label: string; low: number; high: number; price: number }> = {
  oil: { label: 'Oil-based polyurethane', low: 20, high: 50, price: mid(20, 50) },
  water: { label: 'Water-based polyurethane', low: 30, high: 55, price: mid(30, 55) },
};
export const DEFAULT_COATS = 3;

export type DiyId = 'sander' | 'edger' | 'buffer' | 'sandpaper' | 'stain' | 'finish' | 'sheeting' | 'tape' | 'rollers' | 'safety' | 'vacuum';
export interface DiyPrices {
  sanderPerDay: number;
  edgerPerDay: number;
  bufferPerDay: number;
  sandpaper: number;
  stainPerGallon: number;
  finishPerGallon: number;
  sheeting: number;
  tape: number;
  rollers: number;
  safety: number;
  vacuum: number;
}
/** Midpoints of This Old House’s DIY price list (Jun 2026). */
export const DIY_DEFAULTS: DiyPrices = {
  sanderPerDay: mid(50, 80), // drum sander
  edgerPerDay: mid(35, 45),
  bufferPerDay: mid(50, 80), // assumption: priced like a drum sander — TOH gives no buffer rate
  sandpaper: mid(30, 60),
  stainPerGallon: mid(20, 60),
  finishPerGallon: FINISHES.water.price,
  sheeting: mid(12, 25),
  tape: mid(5, 7),
  rollers: mid(30, 60),
  safety: mid(10, 20) + mid(5, 15) + mid(30, 70), // knee pads + goggles + respirator
  vacuum: mid(40, 180),
};

export interface DiyInput {
  areaSqFt: number;
  method: Method;
  stain: boolean;
  coats: number;
  stainCoats: number;
  days: number;
  buyVacuum: boolean;
  prices: DiyPrices;
  finishCoverage: number;
  stainCoverage: number;
}

export interface DiyLine {
  id: DiyId;
  label: string;
  detail: string;
  amount: number;
}
export interface DiyResult {
  lines: DiyLine[];
  finishGallons: number;
  stainGallons: number;
  total: number;
}

export function defaultDiyInput(over: Partial<DiyInput> = {}): DiyInput {
  return {
    areaSqFt: 444,
    method: 'sand',
    stain: false,
    coats: DEFAULT_COATS,
    stainCoats: 1,
    days: 1,
    buyVacuum: false,
    prices: { ...DIY_DEFAULTS },
    finishCoverage: FINISH_COVERAGE,
    stainCoverage: STAIN_COVERAGE,
    ...over,
  };
}

/** Gallons to buy: area × coats ÷ coverage, rounded up to whole gallons (0 when there is nothing to cover). */
export function gallons(areaSqFt: number, coats: number, coverage: number): number {
  const need = (pos(areaSqFt) * pos(coats)) / (pos(coverage) || FINISH_COVERAGE);
  return need > 0 ? Math.ceil(need - 1e-9) : 0;
}

export function calculateDiy(input: DiyInput): DiyResult {
  const p = input.prices;
  const area = pos(input.areaSqFt);
  const days = Math.max(1, Math.ceil(pos(input.days) || 1));
  const sanding = METHODS[input.method].removesWood;
  const finishGallons = gallons(area, input.coats, input.finishCoverage);
  const stainGallons = sanding && input.stain ? gallons(area, input.stainCoats || 1, input.stainCoverage) : 0;
  const lines: DiyLine[] = [];
  const add = (id: DiyId, label: string, detail: string, amount: number) => {
    if (amount > 0) lines.push({ id, label, detail, amount: money(amount) });
  };
  if (area > 0) {
    if (sanding) {
      add('sander', 'Drum sander rental', `${days} day${days > 1 ? 's' : ''}`, pos(p.sanderPerDay) * days);
      add('edger', 'Edger rental', `${days} day${days > 1 ? 's' : ''}`, pos(p.edgerPerDay) * days);
    } else {
      add('buffer', 'Floor buffer rental', `${days} day${days > 1 ? 's' : ''}`, pos(p.bufferPerDay) * days);
    }
    add('sandpaper', sanding ? 'Sandpaper (all grits)' : 'Screening pads', 'per job', pos(p.sandpaper));
    add('stain', 'Stain', `${stainGallons} gal`, stainGallons * pos(p.stainPerGallon));
    add('finish', 'Floor finish', `${finishGallons} gal · ${pos(input.coats)} coat${pos(input.coats) === 1 ? '' : 's'}`, finishGallons * pos(p.finishPerGallon));
    add('sheeting', 'Plastic sheeting', '1 roll', pos(p.sheeting));
    add('tape', 'Tape', '1 roll', pos(p.tape));
    add('rollers', 'Applicators, rollers & pole', 'per job', pos(p.rollers));
    add('safety', 'Respirator, goggles & knee pads', 'per job', pos(p.safety));
    if (input.buyVacuum) add('vacuum', 'Shop vacuum', 'buy', pos(p.vacuum));
  }
  return { lines, finishGallons, stainGallons, total: money(lines.reduce((a, l) => a + l.amount, 0)) };
}
