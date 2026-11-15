/**
 * Bathroom Remodel Cost Calculator engine (Batch 2, Tier 2 #14).
 *
 * Line-item model built from This Old House's 2026 national averages:
 *   fixed items (per bathroom): toilet, vanity/cabinetry, top, faucets, electrical, plumbing, tub/shower
 *   area items  (per ft² of floor): flooring, wall tile, painting, insulation & drywall
 *     — each average is spread over a 70 ft² reference room, which reproduces This Old House's
 *       cost-by-size table (40 ft² ≈ $14.8k, 100 ft² ≈ $19.9k, 130 ft² ≈ $22.4k at mid-range)
 *   finish level multiplies every price (budget × 0.575, high-end × 1.881 — ratios of This Old
 *   House's 50 ft² finish-level ranges to its mid-range); scope drops items a cosmetic refresh
 *   doesn't touch; region factor and contingency on top.
 * Every price is editable. Pure functions, no network.
 */

export const REFERENCE_SQFT = 70;
export const SQFT_PER_M2 = 10.7639104;

export type Finish = 'basic' | 'mid' | 'high';
/** Midpoints of This Old House's 50 ft² finish ranges ($8,478–$10,883 / $14,609–$19,040 / $27,492–$35,808) ÷ mid-range. */
export const FINISH_FACTOR: Record<Finish, number> = {
  basic: Math.round(((8478 + 10883) / 2 / ((14609 + 19040) / 2)) * 1000) / 1000, // 0.575
  mid: 1,
  high: Math.round(((27492 + 35808) / 2 / ((14609 + 19040) / 2)) * 1000) / 1000, // 1.881
};
export const FINISH_LABEL: Record<Finish, string> = { basic: 'Budget', mid: 'Mid-range', high: 'High-end' };
/** Half-width of This Old House's mid-range band (±13% around its midpoint), used for the low–high range. */
export const RANGE_SPREAD = 0.13;
/** This Old House: set aside 20% of the budget for surprises. */
export const CONTINGENCY_PCT = 20;

export type ItemKind = 'fixed' | 'area';
export interface Item {
  id: string;
  label: string;
  kind: ItemKind;
  /** This Old House 2026 average (fixed items: per bathroom; area items: for a 70 ft² room) */
  average: number;
  /** included in a cosmetic refresh (no demolition to studs, existing tub and plumbing kept) */
  cosmetic: boolean;
}
export const ITEMS: Item[] = [
  { id: 'toilet', label: 'Toilet, installed', kind: 'fixed', average: 467, cosmetic: true },
  { id: 'vanity', label: 'Vanity cabinet (incl. removal)', kind: 'fixed', average: 2929, cosmetic: true },
  { id: 'top', label: 'Vanity top', kind: 'fixed', average: 332, cosmetic: true },
  { id: 'faucets', label: 'Faucets', kind: 'fixed', average: 423, cosmetic: true },
  { id: 'electrical', label: 'Electrical (lights, fan, outlets)', kind: 'fixed', average: 456, cosmetic: true },
  { id: 'plumbing', label: 'Plumbing', kind: 'fixed', average: 5545, cosmetic: false },
  { id: 'flooring', label: 'Flooring', kind: 'area', average: 1114, cosmetic: true },
  { id: 'tile', label: 'Wall tile', kind: 'area', average: 1326, cosmetic: true },
  { id: 'paint', label: 'Painting', kind: 'area', average: 1145, cosmetic: true },
  { id: 'drywall', label: 'Insulation & drywall', kind: 'area', average: 2338, cosmetic: false },
];
export const itemById = (id: string) => ITEMS.find((i) => i.id === id);

export type Bathing = 'none' | 'combo' | 'shower' | 'tub' | 'both';
/** This Old House averages: tub/shower combo $1,258, complete shower remodel $8,044, freestanding tub $1,123. */
export const BATHING: Record<Bathing, { label: string; average: number }> = {
  none: { label: 'No tub or shower (half bath)', average: 0 },
  combo: { label: 'Tub & shower combo', average: 1258 },
  shower: { label: 'Walk-in shower', average: 8044 },
  tub: { label: 'Freestanding tub', average: 1123 },
  both: { label: 'Tub + separate shower', average: 1123 + 8044 },
};
export const WATER_HEATER = 1478; // This Old House: water heating upgrade

export type RoomType = 'half' | 'full' | 'primary';
export const ROOM_TYPES: Record<RoomType, { label: string; lengthFt: number; widthFt: number; bathing: Bathing }> = {
  half: { label: 'Half bath / powder room', lengthFt: 5, widthFt: 5, bathing: 'none' },
  full: { label: 'Full bathroom', lengthFt: 8, widthFt: 5, bathing: 'combo' },
  primary: { label: 'Primary (master) bath', lengthFt: 13, widthFt: 10, bathing: 'both' },
};

export type Scope = 'cosmetic' | 'full';

/** Starting price of an item at a finish level: fixed $ per bathroom, or $ per ft² of floor for area items. */
export function itemRate(item: Item, finish: Finish): number {
  const base = item.kind === 'area' ? item.average / REFERENCE_SQFT : item.average;
  return Math.round(base * FINISH_FACTOR[finish] * 100) / 100; // cents, so the form and the page show the same numbers
}
const cents = (n: number) => Math.round(n * 100) / 100;

export interface RemodelInput {
  floorSqFt: number;
  scope: Scope;
  /** item id → rate (fixed: $ per bathroom; area: $ per ft² of floor) */
  rates: Record<string, number>;
  /** item ids switched off by the user */
  off: string[];
  bathing: Bathing;
  bathingPrice: number;
  waterHeater: boolean;
  waterHeaterPrice: number;
  permit: number;
  regionFactor: number;
  contingencyPct: number;
}

export interface Line {
  id: string;
  label: string;
  detail: string;
  amount: number;
}

export interface RemodelResult {
  lines: Line[];
  subtotal: number;
  regionAdj: number;
  permit: number;
  total: number;
  contingency: number;
  budget: number; // total + contingency
  low: number;
  high: number;
  perSqFt: number;
}

const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const money = (n: number) => Math.round(n * 100) / 100;

export function defaultRates(finish: Finish): Record<string, number> {
  return Object.fromEntries(ITEMS.map((i) => [i.id, itemRate(i, finish)]));
}

export function defaultRemodelInput(type: RoomType = 'full', finish: Finish = 'mid', over: Partial<RemodelInput> = {}): RemodelInput {
  const t = ROOM_TYPES[type];
  return {
    floorSqFt: t.lengthFt * t.widthFt,
    scope: 'full',
    rates: defaultRates(finish),
    off: [],
    bathing: t.bathing,
    bathingPrice: cents(BATHING[t.bathing].average * FINISH_FACTOR[finish]),
    waterHeater: false,
    waterHeaterPrice: cents(WATER_HEATER * FINISH_FACTOR[finish]),
    permit: 0,
    regionFactor: 1,
    contingencyPct: CONTINGENCY_PCT,
    ...over,
  };
}

export function calculateRemodel(input: RemodelInput): RemodelResult {
  const area = pos(input.floorSqFt);
  const lines: Line[] = [];
  for (const item of ITEMS) {
    if (input.off.includes(item.id)) continue;
    if (input.scope === 'cosmetic' && !item.cosmetic) continue;
    const rate = pos(input.rates[item.id] ?? 0);
    const amount = item.kind === 'area' ? rate * area : rate;
    if (amount > 0) lines.push({ id: item.id, label: item.label, detail: item.kind === 'area' ? `${Math.round(area)} ft² × $${rate.toFixed(2)}` : 'per bathroom', amount: money(amount) });
  }
  if (input.scope === 'full' && input.bathing !== 'none' && pos(input.bathingPrice) > 0) {
    lines.push({ id: 'bathing', label: BATHING[input.bathing].label, detail: 'installed', amount: money(input.bathingPrice) });
  }
  if (input.waterHeater && pos(input.waterHeaterPrice) > 0) lines.push({ id: 'waterHeater', label: 'Water heater upgrade', detail: 'installed', amount: money(input.waterHeaterPrice) });

  const subtotal = money(lines.reduce((a, l) => a + l.amount, 0));
  const factor = pos(input.regionFactor) || 1;
  const regionAdj = money(subtotal * (factor - 1));
  const permit = money(pos(input.permit));
  const total = money(subtotal + regionAdj + permit);
  const contingency = money(total * (pos(input.contingencyPct) / 100));
  return {
    lines,
    subtotal,
    regionAdj,
    permit,
    total,
    contingency,
    budget: money(total + contingency),
    low: money((subtotal + regionAdj) * (1 - RANGE_SPREAD) + permit),
    high: money((subtotal + regionAdj) * (1 + RANGE_SPREAD) + permit),
    perSqFt: area > 0 ? total / area : 0,
  };
}

/** Quick estimate for the page tables. */
export function quickRemodel(floorSqFt: number, finish: Finish = 'mid', bathing: Bathing = 'combo', scope: Scope = 'full'): RemodelResult {
  return calculateRemodel(defaultRemodelInput('full', finish, { floorSqFt, bathing, bathingPrice: cents(BATHING[bathing].average * FINISH_FACTOR[finish]), scope }));
}

/** Compare a contractor's quote with the estimate range. */
export function checkQuote(quote: number, r: RemodelResult): 'low' | 'within' | 'high' | 'n/a' {
  if (!(quote > 0) || !(r.total > 0)) return 'n/a';
  if (quote < r.low) return 'low';
  if (quote > r.high) return 'high';
  return 'within';
}
