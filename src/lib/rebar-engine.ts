/**
 * Rebar / reinforcement steel quantity and weight engine.
 *
 * Storage units: metres for lengths, kilograms for mass. The UI converts for display.
 *
 * Sources (see the page's "Sources" section):
 * - US bar numbers are the nominal diameter in eighths of an inch, and nominal
 *   dimensions equal a plain round bar of the same weight per foot (ASTM A615/A615M).
 *   Weights per foot below are the standard published values for #3–#11.
 * - Metric bars: mass per metre = cross-section × 7,850 kg/m³ (the basis of BS 4449
 *   nominal masses, e.g. 12 mm = 0.888 kg/m).
 * - Default edge cover 3 in / 75 mm: ACI 318 cover for concrete cast against and
 *   permanently in contact with the ground. Editable.
 * - Default lap = 40 × bar diameter: a common field rule of thumb, editable — the lap
 *   on the project drawings always governs.
 */

export const M_PER_FT = 0.3048;
export const M_PER_IN = 0.0254;
export const KG_PER_LB = 0.45359237;
export const STEEL_KG_PER_M3 = 7850;

export type UnitSystem = 'imperial' | 'metric';

const ft = (v: number) => v * M_PER_FT;
const inch = (v: number) => v * M_PER_IN;
const pos = (v: number | undefined) => (typeof v === 'number' && isFinite(v) && v > 0 ? v : 0);
const ceilUp = (v: number) => (v > 0 ? Math.ceil(v - 1e-9) : 0);

// ---------- bars ----------
export interface BarSpec {
  id: string;
  label: string;
  system: UnitSystem;
  /** nominal diameter, metres */
  diameterM: number;
  /** mass per metre, kg/m */
  kgPerM: number;
  /** published lb/ft for US bars (display) */
  lbPerFt?: number;
}

const US_BARS: [number, number, number][] = [
  // bar #, nominal diameter (in), weight (lb/ft)
  [3, 0.375, 0.376],
  [4, 0.5, 0.668],
  [5, 0.625, 1.043],
  [6, 0.75, 1.502],
  [7, 0.875, 2.044],
  [8, 1.0, 2.67],
  [9, 1.128, 3.4],
  [10, 1.27, 4.303],
  [11, 1.41, 5.313],
];

const METRIC_BARS = [8, 10, 12, 16, 20, 25, 32, 40];

/** kg per metre of a round steel bar of diameter d (m). */
export const roundBarKgPerM = (dM: number) => (Math.PI / 4) * dM * dM * STEEL_KG_PER_M3;

export const BARS: BarSpec[] = [
  ...US_BARS.map(([n, d, w]) => ({
    id: `us${n}`,
    label: `#${n}`,
    system: 'imperial' as const,
    diameterM: inch(d),
    lbPerFt: w,
    kgPerM: (w * KG_PER_LB) / M_PER_FT,
  })),
  ...METRIC_BARS.map((d) => ({
    id: `mm${d}`,
    label: `${d} mm`,
    system: 'metric' as const,
    diameterM: d / 1000,
    kgPerM: roundBarKgPerM(d / 1000),
  })),
];

export const barById = (id: string): BarSpec => BARS.find((b) => b.id === id) || BARS[1];

/** Closest bar by diameter in the other unit system. */
export function equivalentBar(id: string, system: UnitSystem): BarSpec {
  const cur = barById(id);
  if (cur.system === system) return cur;
  return BARS.filter((b) => b.system === system).reduce((best, b) =>
    Math.abs(b.diameterM - cur.diameterM) < Math.abs(best.diameterM - cur.diameterM) ? b : best,
  );
}

// ---------- stock lengths ----------
export const STOCK_LENGTHS = [
  { id: 'ft10', label: '10 ft', system: 'imperial' as const, lengthM: ft(10) },
  { id: 'ft20', label: '20 ft', system: 'imperial' as const, lengthM: ft(20) },
  { id: 'ft40', label: '40 ft', system: 'imperial' as const, lengthM: ft(40) },
  { id: 'm6', label: '6 m', system: 'metric' as const, lengthM: 6 },
  { id: 'm12', label: '12 m', system: 'metric' as const, lengthM: 12 },
];

export const stockById = (id: string) => STOCK_LENGTHS.find((s) => s.id === id) || STOCK_LENGTHS[1];
export const defaultStockId = (system: UnitSystem) => (system === 'metric' ? 'm6' : 'ft20');

// ---------- items ----------
export type ItemKind = 'slab' | 'footing' | 'wall' | 'bars';

export interface RebarItem {
  id: string;
  kind: ItemKind;
  barId: string;
  /** slab/footing/wall: length · bars: length of each bar */
  length: number;
  /** slab: width · footing: width (for cross bars) */
  width: number;
  /** wall: height */
  height: number;
  /** slab: spacing along both directions · wall: vertical bar spacing · footing: cross-bar spacing (0 = none) */
  spacing: number;
  /** wall: horizontal bar spacing */
  spacing2: number;
  /** edge cover from each end/edge */
  cover: number;
  /** footing: number of long bars · bars: number of bars */
  count: number;
  /** slab: mats (1 or 2) · wall: curtains (1 or 2) */
  layers: number;
  qty: number;
}

export interface ItemKindSpec {
  kind: ItemKind;
  label: string;
  short: string;
  hint: string;
}

export const ITEM_KINDS: ItemKindSpec[] = [
  { kind: 'slab', label: 'Slab grid', short: 'Slab', hint: 'Bars both ways at equal spacing — patios, driveways, floors.' },
  { kind: 'footing', label: 'Strip footing', short: 'Footing', hint: 'Long bars down the footing, with optional cross bars.' },
  { kind: 'wall', label: 'Wall', short: 'Wall', hint: 'Vertical and horizontal bars in a concrete or block wall.' },
  { kind: 'bars', label: 'Bar list (weight)', short: 'Bar list', hint: 'You already know how many bars and how long — get the weight.' },
];

export function defaultItem(kind: ItemKind, id: string, system: UnitSystem = 'imperial'): RebarItem {
  const metric = system === 'metric';
  const base: RebarItem = {
    id,
    kind,
    barId: metric ? 'mm12' : 'us4',
    length: metric ? 4 : ft(12),
    width: metric ? 4 : ft(12),
    height: metric ? 2.4 : ft(8),
    spacing: metric ? 0.45 : inch(18),
    spacing2: metric ? 0.45 : inch(18),
    cover: metric ? 0.075 : inch(3),
    count: 2,
    layers: 1,
    qty: 1,
  };
  if (kind === 'footing')
    return { ...base, length: metric ? 12 : ft(40), width: metric ? 0.6 : inch(24), spacing: 0, count: 2 };
  if (kind === 'wall')
    return { ...base, length: metric ? 6 : ft(20), spacing: metric ? 0.4 : inch(16), spacing2: metric ? 0.4 : inch(16), cover: metric ? 0.05 : inch(2) };
  if (kind === 'bars') return { ...base, length: metric ? 6 : ft(20), count: 10 };
  return base;
}

/** A run of identical straight bars. */
export interface Run {
  bars: number;
  lengthM: number;
}

/** Bars needed so no gap exceeds the spacing: ceil(span / spacing) + 1. */
export function barsAcross(spanM: number, spacingM: number): number {
  if (!(spanM > 0)) return 0;
  if (!(spacingM > 0)) return 0;
  return Math.ceil(spanM / spacingM - 1e-9) + 1;
}

/** Straight runs for ONE unit of an item (before quantity). */
export function itemRuns(it: RebarItem): Run[] {
  const c = pos(it.cover);
  const layers = Math.max(1, Math.floor(pos(it.layers)) || 1);
  switch (it.kind) {
    case 'slab': {
      const l = Math.max(0, pos(it.length) - 2 * c);
      const w = Math.max(0, pos(it.width) - 2 * c);
      if (!l || !w) return [];
      return [
        { bars: barsAcross(w, pos(it.spacing)) * layers, lengthM: l }, // bars running the long way
        { bars: barsAcross(l, pos(it.spacing)) * layers, lengthM: w }, // bars running across
      ];
    }
    case 'footing': {
      const l = Math.max(0, pos(it.length) - 2 * c);
      const w = Math.max(0, pos(it.width) - 2 * c);
      const runs: Run[] = [];
      if (l > 0 && pos(it.count) > 0) runs.push({ bars: Math.floor(pos(it.count)), lengthM: l });
      if (l > 0 && w > 0 && pos(it.spacing) > 0) runs.push({ bars: barsAcross(l, pos(it.spacing)), lengthM: w });
      return runs;
    }
    case 'wall': {
      const l = Math.max(0, pos(it.length) - 2 * c);
      const h = Math.max(0, pos(it.height) - 2 * c);
      if (!l || !h) return [];
      return [
        { bars: barsAcross(l, pos(it.spacing)) * layers, lengthM: h }, // vertical
        { bars: barsAcross(h, pos(it.spacing2)) * layers, lengthM: l }, // horizontal
      ];
    }
    case 'bars':
      return pos(it.count) > 0 && pos(it.length) > 0 ? [{ bars: Math.floor(pos(it.count)), lengthM: pos(it.length) }] : [];
  }
}

/** Length of one run including laps when it is longer than a stock bar. */
export function runLengthWithLaps(lengthM: number, stockM: number, lapM: number): { lengthM: number; laps: number } {
  if (!(lengthM > 0)) return { lengthM: 0, laps: 0 };
  if (!(stockM > 0) || lengthM <= stockM + 1e-9 || !(stockM > lapM)) return { lengthM, laps: 0 };
  const laps = Math.ceil((lengthM - stockM) / (stockM - lapM) - 1e-9);
  return { lengthM: lengthM + laps * lapM, laps };
}

// ---------- job ----------
export interface RebarInput {
  items: RebarItem[];
  stockLengthM: number;
  /** lap length as a multiple of bar diameter */
  lapDiameters: number;
  wastePercent: number;
}

export interface BarTotal {
  barId: string;
  label: string;
  bars: number;
  laps: number;
  /** steel length incl. laps, before waste */
  netLengthM: number;
  /** with waste */
  orderLengthM: number;
  pieces: number;
  weightKg: number;
}

export interface ItemResult {
  id: string;
  bars: number;
  laps: number;
  lengthM: number;
  weightKg: number;
}

export interface RebarResult {
  items: ItemResult[];
  bySize: BarTotal[];
  bars: number;
  laps: number;
  netLengthM: number;
  orderLengthM: number;
  pieces: number;
  weightKg: number;
}

export function calculateRebar(input: RebarInput): RebarResult {
  const waste = Math.min(100, Math.max(0, input.wastePercent || 0)) / 100;
  const stock = pos(input.stockLengthM);
  const sizeMap = new Map<string, { bars: number; laps: number; length: number }>();

  const items: ItemResult[] = input.items.map((it) => {
    const bar = barById(it.barId);
    const q = Math.max(0, Math.floor(pos(it.qty)));
    const lap = pos(input.lapDiameters) * bar.diameterM;
    let bars = 0;
    let laps = 0;
    let length = 0;
    for (const run of itemRuns(it)) {
      const r = runLengthWithLaps(run.lengthM, stock, lap);
      bars += run.bars * q;
      laps += r.laps * run.bars * q;
      length += r.lengthM * run.bars * q;
    }
    const agg = sizeMap.get(bar.id) || { bars: 0, laps: 0, length: 0 };
    sizeMap.set(bar.id, { bars: agg.bars + bars, laps: agg.laps + laps, length: agg.length + length });
    return { id: it.id, bars, laps, lengthM: length, weightKg: length * bar.kgPerM };
  });

  const bySize: BarTotal[] = BARS.filter((b) => sizeMap.has(b.id)).map((b) => {
    const s = sizeMap.get(b.id)!;
    const order = s.length * (1 + waste);
    return {
      barId: b.id,
      label: b.label,
      bars: s.bars,
      laps: s.laps,
      netLengthM: s.length,
      orderLengthM: order,
      pieces: stock > 0 ? ceilUp(order / stock) : 0,
      weightKg: order * b.kgPerM,
    };
  });

  return {
    items,
    bySize,
    bars: bySize.reduce((a, b) => a + b.bars, 0),
    laps: bySize.reduce((a, b) => a + b.laps, 0),
    netLengthM: bySize.reduce((a, b) => a + b.netLengthM, 0),
    orderLengthM: bySize.reduce((a, b) => a + b.orderLengthM, 0),
    pieces: bySize.reduce((a, b) => a + b.pieces, 0),
    weightKg: bySize.reduce((a, b) => a + b.weightKg, 0),
  };
}

/** Optional cost: price per lb or kg of steel, and/or a price per stock bar. */
export function estimateRebarCost(r: RebarResult, pricePerKg: number, pricePerPiece: number) {
  const byWeight = r.weightKg * pos(pricePerKg);
  const byPiece = r.pieces * pos(pricePerPiece);
  return { byWeight, byPiece };
}

// ---------- display helpers ----------
export const mToFt = (m: number) => m / M_PER_FT;
export const kgToLb = (kg: number) => kg / KG_PER_LB;
export const kgPerMToLbPerFt = (kgm: number) => (kgm / KG_PER_LB) * M_PER_FT;
