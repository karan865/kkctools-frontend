/**
 * Metal Roof Cost Calculator engine (Batch 2, Tier 2 #13).
 *
 * Roof area comes from the Shingle Calculator geometry (sections × pitch factor). Then:
 *   metal total   = area × installed price + tear-off (if replacing) + permit
 *   asphalt total = area × tear-off-and-replace price (− tear-off if not replacing) + permit
 *   cost per year = total ÷ mid-point lifespan
 * Quantities: squares, standing-seam / corrugated panels (count and length on gable and shed
 * planes; linear feet on hips), trim lengths and underlayment rolls.
 *
 * Price ranges are HomeGuide 2026 installed figures (midpoints as defaults); lifespans from
 * This Old House (Mar 2026) and Fixr (2026). All editable. Pure functions, no network.
 */

import { pitchFactor, sectionGeometry, type RoofSection } from './shingle-engine';

export type MetalId = 'standingSeam' | 'corrugated' | 'metalShingle';
export interface MetalType {
  id: MetalId;
  label: string;
  range: [number, number]; // installed $/ft²
  price: number; // default: midpoint
  coverageIn: number; // panel coverage width; 0 = sold by the square
  note: string;
}
export const METALS: MetalType[] = [
  { id: 'standingSeam', label: 'Standing seam', range: [9, 16], price: 12.5, coverageIn: 16, note: 'Hidden fasteners, raised seams; panels often 12–18 in wide.' },
  { id: 'corrugated', label: 'Corrugated / exposed fastener', range: [5, 12], price: 8.5, coverageIn: 36, note: 'Screwed through the panel; the cheapest metal option.' },
  { id: 'metalShingle', label: 'Metal shingles / tiles', range: [6, 14], price: 10, coverageIn: 0, note: 'Stamped to look like shingles, slate or tile.' },
];
export const metalById = (id: string): MetalType => METALS.find((m) => m.id === id) || METALS[0];

export type AsphaltId = 'architectural' | 'threeTab';
export interface AsphaltType {
  id: AsphaltId;
  label: string;
  range: [number, number]; // tear-off-and-replace $/ft² (HomeGuide)
  price: number;
  life: [number, number];
}
export const ASPHALTS: AsphaltType[] = [
  { id: 'architectural', label: 'Architectural shingles', range: [4, 6], price: 5, life: [25, 30] },
  { id: 'threeTab', label: '3-tab shingles', range: [3, 5], price: 4, life: [15, 20] },
];
export const asphaltById = (id: string): AsphaltType => ASPHALTS.find((a) => a.id === id) || ASPHALTS[0];

/** This Old House (Mar 2026): metal roofs last 40–70 years. */
export const METAL_LIFE: [number, number] = [40, 70];
/** HomeGuide 2026: tearing off the old roof is $1–$3 per ft². */
export const TEAR_OFF_RANGE: [number, number] = [1, 3];
export const TEAR_OFF_PRICE = 2;
export const UNDERLAYMENT_SQFT_PER_ROLL = 1000; // synthetic, same as the Shingle Calculator

export interface MetalRoofInput {
  sections: RoofSection[];
  metal: MetalId;
  metalPrice: number;
  coverageIn: number;
  asphalt: AsphaltId;
  asphaltPrice: number; // tear-off-and-replace
  tearOff: boolean;
  tearOffPrice: number;
  permit: number;
  metalLife: number;
  asphaltLife: number;
}

export function defaultMetalInput(over: Partial<MetalRoofInput> = {}): MetalRoofInput {
  const m = METALS[0];
  const a = ASPHALTS[0];
  return {
    sections: [{ id: 's1', shape: 'gable', length: 40, width: 28, overhang: 1, pitch: 6, area: 1500 }],
    metal: m.id,
    metalPrice: m.price,
    coverageIn: m.coverageIn,
    asphalt: a.id,
    asphaltPrice: a.price,
    tearOff: true,
    tearOffPrice: TEAR_OFF_PRICE,
    permit: 0,
    metalLife: (METAL_LIFE[0] + METAL_LIFE[1]) / 2,
    asphaltLife: (a.life[0] + a.life[1]) / 2,
    ...over,
  };
}

export interface PanelPlan {
  panels: number; // counted on gable and shed planes
  panelLengthsFt: number[]; // distinct lengths (one per plane type)
  linearFt: number; // total panel length, all planes (hips estimated from area)
}

export interface MetalRoofResult {
  roofArea: number;
  squares: number;
  eaves: number;
  rakes: number;
  ridge: number;
  hips: number;
  panels: PanelPlan;
  underlaymentRolls: number;
  metal: { installed: number; tearOff: number; total: number; perSqFt: number; perSquare: number; low: number; high: number; perYear: number };
  asphalt: { total: number; perSqFt: number; low: number; high: number; perYear: number };
  difference: number;
  ratio: number;
  /** asphalt roofs needed to match one metal roof's life, and their cost */
  asphaltOverMetalLife: { roofs: number; cost: number };
}

const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const money = (n: number) => Math.round(n * 100) / 100;

export function calculateMetalRoof(input: MetalRoofInput): MetalRoofResult {
  const geo = input.sections.map(sectionGeometry);
  const roofArea = geo.reduce((a, g) => a + g.roofArea, 0);
  const sum = (k: 'eaves' | 'rakes' | 'ridge' | 'hips') => geo.reduce((a, g) => a + g[k], 0);

  // panels
  const cov = pos(input.coverageIn) / 12; // ft
  let panels = 0;
  const lengths: number[] = [];
  let linearFt = 0;
  if (cov > 0) {
    for (const s of input.sections) {
      const f = pitchFactor(s.pitch);
      const L = pos(s.length) + 2 * pos(s.overhang);
      const W = pos(s.width) + 2 * pos(s.overhang);
      if (s.shape === 'gable' || s.shape === 'shed') {
        if (!(s.length > 0 && s.width > 0)) continue;
        const slopes = s.shape === 'gable' ? 2 : 1;
        const len = (s.shape === 'gable' ? W / 2 : W) * f;
        const perSlope = Math.ceil((L - 1e-9) / cov);
        panels += perSlope * slopes;
        lengths.push(len);
        linearFt += perSlope * slopes * len;
      } else {
        // hips and measured areas: panels are cut to many lengths — give total length from area
        linearFt += sectionGeometry(s).roofArea / cov;
      }
    }
  }

  const metal = metalById(input.metal);
  const asphalt = asphaltById(input.asphalt);
  const tearRate = pos(input.tearOffPrice);
  const tearOff = input.tearOff ? money(roofArea * tearRate) : 0;
  const permit = pos(input.permit);
  const installed = money(roofArea * pos(input.metalPrice));
  const metalTotal = money(installed + tearOff + permit);
  const asphaltRate = Math.max(0, pos(input.asphaltPrice) - (input.tearOff ? 0 : tearRate));
  const asphaltTotal = money(roofArea * asphaltRate + permit);
  const adj = input.tearOff ? 0 : tearRate;
  const metalLife = pos(input.metalLife) || 1;
  const asphaltLife = pos(input.asphaltLife) || 1;
  const roofs = Math.ceil(metalLife / asphaltLife - 1e-9);

  return {
    roofArea,
    squares: roofArea / 100,
    eaves: sum('eaves'),
    rakes: sum('rakes'),
    ridge: sum('ridge'),
    hips: sum('hips'),
    panels: { panels, panelLengthsFt: lengths, linearFt },
    underlaymentRolls: roofArea > 0 ? Math.ceil(roofArea / UNDERLAYMENT_SQFT_PER_ROLL - 1e-9) : 0,
    metal: {
      installed,
      tearOff,
      total: metalTotal,
      perSqFt: roofArea > 0 ? metalTotal / roofArea : 0,
      perSquare: roofArea > 0 ? (metalTotal / roofArea) * 100 : 0,
      low: money(roofArea * (metal.range[0] + (input.tearOff ? TEAR_OFF_RANGE[0] : 0)) + permit),
      high: money(roofArea * (metal.range[1] + (input.tearOff ? TEAR_OFF_RANGE[1] : 0)) + permit),
      perYear: metalTotal / metalLife,
    },
    asphalt: {
      total: asphaltTotal,
      perSqFt: roofArea > 0 ? asphaltTotal / roofArea : 0,
      low: money(roofArea * Math.max(0, asphalt.range[0] - adj) + permit),
      high: money(roofArea * Math.max(0, asphalt.range[1] - adj) + permit),
      perYear: asphaltTotal / asphaltLife,
    },
    difference: money(metalTotal - asphaltTotal),
    ratio: asphaltTotal > 0 ? metalTotal / asphaltTotal : 0,
    asphaltOverMetalLife: { roofs, cost: money(asphaltTotal * (metalLife / asphaltLife)) },
  };
}

/** Plain gable roof of a given roof area (page tables): a measured section. */
export function roofOfArea(areaFt2: number, over: Partial<MetalRoofInput> = {}): MetalRoofResult {
  return calculateMetalRoof(defaultMetalInput({ sections: [{ id: 'a', shape: 'area', length: 0, width: 0, overhang: 0, pitch: 6, area: areaFt2 }], ...over }));
}
