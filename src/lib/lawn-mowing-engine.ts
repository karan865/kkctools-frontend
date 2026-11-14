/**
 * Lawn Mowing Cost Calculator engine (Batch 2, Tier 1 #4).
 *
 * Time-based model, the way lawn-care pros price work:
 *   mowing time   = area ÷ mower productivity × condition factors
 *   time per visit = mowing time + extras + setup (+ travel for pros)
 *   price per visit = max(minimum charge, hours × hourly rate)
 *   season cost     = price per visit × number of visits
 *
 * Every rate is an editable starting value. The hourly-rate presets sit inside the
 * $30–$68/hour range published by Jobber (Mar 2026) and Housecall Pro (Oct 2026);
 * see src/content/calculation-methods.ts. Productivity and condition factors are
 * typical working assumptions, not published standards, and the page says so.
 *
 * Pure functions, no network, no browser APIs.
 */

export const SQFT_PER_ACRE = 43560; // exact
export const SQFT_PER_M2 = 10.7639104; // 1 m² = 1 / 0.3048² ft²
export const FT_PER_MILE = 5280;
export const WEEKS_PER_MONTH = 52 / 12; // 4.333…

export type Mode = 'homeowner' | 'pro';

// ---------- mowers ----------
export interface Mower {
  id: string;
  label: string;
  deckIn: number; // cutting width, inches
  mph: number; // typical working speed
  efficiency: number; // share of time actually cutting new grass (turns, overlap, trimming around obstacles)
}

export const MOWERS: Mower[] = [
  { id: 'push21', label: '21 in push mower', deckIn: 21, mph: 3, efficiency: 0.75 },
  { id: 'walk36', label: '36 in walk-behind', deckIn: 36, mph: 4, efficiency: 0.8 },
  { id: 'zt48', label: '48 in zero-turn', deckIn: 48, mph: 6, efficiency: 0.8 },
  { id: 'zt60', label: '60 in zero-turn', deckIn: 60, mph: 7, efficiency: 0.8 },
];

export const mowerById = (id: string): Mower => MOWERS.find((m) => m.id === id) || MOWERS[0];

/** Acres cut per hour = deck width (ft) × speed (ft/h) × efficiency ÷ 43,560. */
export function acresPerHour(m: Pick<Mower, 'deckIn' | 'mph' | 'efficiency'>): number {
  if (m.deckIn <= 0 || m.mph <= 0 || m.efficiency <= 0) return 0;
  return ((m.deckIn / 12) * m.mph * FT_PER_MILE * m.efficiency) / SQFT_PER_ACRE;
}

/** The mower a service would typically bring for a lawn this size (narrow gate forces a push mower). */
export function autoMowerId(areaSqFt: number, narrowGate = false): string {
  if (narrowGate || areaSqFt <= 6000) return 'push21';
  if (areaSqFt <= 15000) return 'walk36';
  if (areaSqFt <= SQFT_PER_ACRE) return 'zt48';
  return 'zt60';
}

// ---------- frequency ----------
export type FrequencyId = 'weekly' | 'tenDays' | 'biweekly' | 'monthly' | 'once';
export interface Frequency {
  id: FrequencyId;
  label: string;
  intervalDays: number; // 0 = one-time
  growthFactor: number; // longer grass between cuts takes longer to mow
}

export const FREQUENCIES: Frequency[] = [
  { id: 'weekly', label: 'Weekly', intervalDays: 7, growthFactor: 1 },
  { id: 'tenDays', label: 'Every 10 days', intervalDays: 10, growthFactor: 1.1 },
  { id: 'biweekly', label: 'Every 2 weeks', intervalDays: 14, growthFactor: 1.2 },
  { id: 'monthly', label: 'Monthly', intervalDays: 30, growthFactor: 1.4 },
  { id: 'once', label: 'One-time cut', intervalDays: 0, growthFactor: 1 },
];

export const frequencyById = (id: string): Frequency => FREQUENCIES.find((f) => f.id === id) || FREQUENCIES[0];

/** Visits in a season of `weeks` weeks: days ÷ interval, rounded, at least 1. One-time = 1. */
export function visitsPerSeason(freq: Frequency, weeks: number): number {
  if (freq.intervalDays === 0) return 1;
  const w = Math.max(0, weeks);
  return Math.max(1, Math.round((w * 7) / freq.intervalDays));
}

// ---------- conditions ----------
export const GRASS: { id: string; label: string; factor: number }[] = [
  { id: 'normal', label: 'Normal height', factor: 1 },
  { id: 'long', label: 'Long (missed a cut)', factor: 1.25 },
  { id: 'overgrown', label: 'Overgrown', factor: 1.5 },
];
export const SLOPE: { id: string; label: string; factor: number }[] = [
  { id: 'flat', label: 'Flat', factor: 1 },
  { id: 'some', label: 'Some slope', factor: 1.15 },
  { id: 'steep', label: 'Steep', factor: 1.35 },
];
export const OBSTACLES: { id: string; label: string; factor: number }[] = [
  { id: 'few', label: 'Open lawn', factor: 1 },
  { id: 'some', label: 'Some beds & trees', factor: 1.1 },
  { id: 'many', label: 'Many obstacles', factor: 1.25 },
];
const factorOf = (list: { id: string; factor: number }[], id: string) => (list.find((x) => x.id === id) || list[0]).factor;

// ---------- extras ----------
export type ExtraId = 'trim' | 'edge' | 'blow' | 'bag';
export interface Extra {
  id: ExtraId;
  label: string;
  baseMin: number; // fixed minutes per visit
  minPer1000: number; // extra minutes per 1,000 sq ft
  mowShare: number; // extra share of mowing time (bagging)
}
export const EXTRAS: Extra[] = [
  { id: 'trim', label: 'String trimming', baseMin: 3, minPer1000: 0.6, mowShare: 0 },
  { id: 'edge', label: 'Edging drives & walks', baseMin: 2, minPer1000: 0.5, mowShare: 0 },
  { id: 'blow', label: 'Blowing clippings off hard surfaces', baseMin: 2, minPer1000: 0.3, mowShare: 0 },
  { id: 'bag', label: 'Bagging & hauling clippings', baseMin: 0, minPer1000: 0, mowShare: 0.25 },
];

// ---------- price levels (hourly rate presets) ----------
export const RATE_LEVELS: { id: string; label: string; rate: number }[] = [
  { id: 'low', label: 'Lower-cost area', rate: 32 },
  { id: 'avg', label: 'Average', rate: 50 },
  { id: 'high', label: 'Higher-cost area', rate: 68 },
];

// ---------- input / result ----------
export interface LawnInput {
  areaSqFt: number;
  mode: Mode;
  frequency: FrequencyId;
  seasonWeeks: number;
  grass: string;
  slope: string;
  obstacles: string;
  extras: ExtraId[];
  mower: Pick<Mower, 'deckIn' | 'mph' | 'efficiency'>;
  hourlyRate: number;
  minimumCharge: number;
  setupMin: number; // unload/load per visit
  travelMin: number; // drive time to the job (part of every service's price)
  costPerHour?: number; // pro only: crew wages + fuel + equipment, optional
}

export interface LawnResult {
  acres: number;
  acresPerHour: number;
  mowMin: number;
  extrasMin: number;
  setupMin: number;
  travelMin: number;
  totalMin: number;
  pricePerVisit: number;
  minimumApplied: boolean;
  visits: number;
  pricePerMonth: number;
  pricePerSeason: number;
  pricePerAcre: number;
  pricePer1000: number;
  effectiveHourly: number;
  profitPerVisit: number | null;
}

const pos = (n: number) => (isFinite(n) && n > 0 ? n : 0);

export function calculateLawn(input: LawnInput): LawnResult {
  const area = pos(input.areaSqFt);
  const acres = area / SQFT_PER_ACRE;
  const freq = frequencyById(input.frequency);
  const aph = acresPerHour(input.mower);
  const condition = factorOf(GRASS, input.grass) * factorOf(SLOPE, input.slope) * factorOf(OBSTACLES, input.obstacles) * freq.growthFactor;
  const mowMin = aph > 0 ? (acres / aph) * 60 * condition : 0;

  let extrasMin = 0;
  for (const e of EXTRAS) {
    if (!input.extras.includes(e.id) || area === 0) continue;
    extrasMin += e.baseMin + (e.minPer1000 * area) / 1000 + e.mowShare * mowMin;
  }

  const setupMin = area > 0 ? pos(input.setupMin) : 0;
  const travelMin = area > 0 ? pos(input.travelMin) : 0;
  const totalMin = mowMin + extrasMin + setupMin + travelMin;
  const rate = pos(input.hourlyRate);
  const timePrice = (totalMin / 60) * rate;
  const minimum = pos(input.minimumCharge);
  const pricePerVisit = area > 0 ? Math.max(minimum, timePrice) : 0;
  const minimumApplied = area > 0 && minimum > timePrice;

  const visits = visitsPerSeason(freq, input.seasonWeeks);
  const pricePerSeason = pricePerVisit * visits;
  // Average month during the mowing season. A one-time cut has no monthly figure (0).
  const seasonMonths = pos(input.seasonWeeks) / WEEKS_PER_MONTH;
  const pricePerMonth = freq.intervalDays === 0 || seasonMonths === 0 ? 0 : pricePerSeason / seasonMonths;

  const costPerHour = input.mode === 'pro' && input.costPerHour && input.costPerHour > 0 ? input.costPerHour : 0;
  const profitPerVisit = costPerHour > 0 && area > 0 ? pricePerVisit - (totalMin / 60) * costPerHour : null;

  return {
    acres,
    acresPerHour: aph,
    mowMin,
    extrasMin,
    setupMin,
    travelMin,
    totalMin,
    pricePerVisit,
    minimumApplied,
    visits,
    pricePerMonth,
    pricePerSeason,
    pricePerAcre: acres > 0 ? pricePerVisit / acres : 0,
    pricePer1000: area > 0 ? (pricePerVisit / area) * 1000 : 0,
    effectiveHourly: totalMin > 0 ? pricePerVisit / (totalMin / 60) : 0,
    profitPerVisit,
  };
}

/** Low / typical / high per-visit prices: same job, hourly rate at each preset level. */
export function priceRange(input: LawnInput): { low: number; typical: number; high: number } {
  const at = (rate: number) => calculateLawn({ ...input, hourlyRate: rate }).pricePerVisit;
  return { low: at(RATE_LEVELS[0].rate), typical: at(RATE_LEVELS[1].rate), high: at(RATE_LEVELS[2].rate) };
}

// ---------- helpers ----------
export interface LawnPatch {
  id: string;
  name: string;
  length: number; // ft (or m in metric UI; converted before use)
  width: number;
}

/** Sum of rectangles minus exclusions, never negative. */
export function patchesArea(patches: { length: number; width: number; subtract?: boolean }[]): number {
  const total = patches.reduce((s, p) => s + (p.subtract ? -1 : 1) * pos(p.length) * pos(p.width), 0);
  return Math.max(0, total);
}

export const LAWN_PRESETS: { label: string; sqft: number }[] = [
  { label: '2,500 sq ft', sqft: 2500 },
  { label: '5,000 sq ft', sqft: 5000 },
  { label: '⅛ acre', sqft: SQFT_PER_ACRE / 8 },
  { label: '¼ acre', sqft: SQFT_PER_ACRE / 4 },
  { label: '½ acre', sqft: SQFT_PER_ACRE / 2 },
  { label: '1 acre', sqft: SQFT_PER_ACRE },
  { label: '2 acres', sqft: SQFT_PER_ACRE * 2 },
];

/** Default homeowner job: what the page examples and tables use unless stated otherwise. */
export function defaultInput(areaSqFt: number, over: Partial<LawnInput> = {}): LawnInput {
  const mower = mowerById(autoMowerId(areaSqFt));
  return {
    areaSqFt,
    mode: 'homeowner',
    frequency: 'weekly',
    seasonWeeks: 30,
    grass: 'normal',
    slope: 'flat',
    obstacles: 'few',
    extras: ['trim', 'edge', 'blow'],
    mower,
    hourlyRate: 50,
    minimumCharge: 35,
    setupMin: 8,
    travelMin: 12,
    ...over,
  };
}
