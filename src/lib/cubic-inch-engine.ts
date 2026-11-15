/**
 * Cubic Inch & Engine Displacement Calculator engine (Batch 2, Tier 3 #16).
 *
 * Shape volume in cubic inches (box, cylinder, tube, sphere) and engine displacement
 * (π/4 × bore² × stroke × cylinders), with exact unit conversions:
 *   1 in = 2.54 cm exactly → 1 in³ = 16.387064 cm³; 1 ft³ = 1,728 in³; 1 US gal = 231 in³;
 *   1 imperial gal = 4.54609 L.
 * Engine presets use bore and stroke published by the manufacturer. Pure functions, no network.
 */

export const CC_PER_IN3 = 16.387064; // exact (2.54³)
export const IN3_PER_FT3 = 1728;
export const IN3_PER_YD3 = 46656;
export const IN3_PER_USGAL = 231; // exact by definition
export const L_PER_IMPGAL = 4.54609; // exact by definition
export const MM_PER_IN = 25.4;

export type LengthUnit = 'in' | 'ft' | 'mm' | 'cm' | 'm';
export const LENGTH_UNITS: Record<LengthUnit, { label: string; perInch: number }> = {
  in: { label: 'inches', perInch: 1 },
  ft: { label: 'feet', perInch: 1 / 12 },
  mm: { label: 'millimetres', perInch: 25.4 },
  cm: { label: 'centimetres', perInch: 2.54 },
  m: { label: 'metres', perInch: 0.0254 },
};
/** Converts a length in `unit` to inches. */
export const toInches = (v: number, unit: LengthUnit) => v / LENGTH_UNITS[unit].perInch;

const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

// ---------- conversions ----------
export interface VolumeSet {
  in3: number;
  ft3: number;
  yd3: number;
  usGal: number;
  impGal: number;
  litres: number;
  cc: number; // = mL = cm³
  m3: number;
}
export function fromCubicInches(in3: number): VolumeSet {
  const v = Number.isFinite(in3) ? in3 : 0;
  const cc = v * CC_PER_IN3;
  return {
    in3: v,
    ft3: v / IN3_PER_FT3,
    yd3: v / IN3_PER_YD3,
    usGal: v / IN3_PER_USGAL,
    impGal: cc / 1000 / L_PER_IMPGAL,
    litres: cc / 1000,
    cc,
    m3: cc / 1e6,
  };
}
export type VolumeUnit = keyof VolumeSet;
export const VOLUME_UNITS: Record<VolumeUnit, { label: string; short: string; in3: number }> = {
  in3: { label: 'Cubic inches', short: 'in³', in3: 1 },
  ft3: { label: 'Cubic feet', short: 'ft³', in3: IN3_PER_FT3 },
  yd3: { label: 'Cubic yards', short: 'yd³', in3: IN3_PER_YD3 },
  usGal: { label: 'US gallons', short: 'US gal', in3: IN3_PER_USGAL },
  impGal: { label: 'Imperial gallons', short: 'imp gal', in3: (L_PER_IMPGAL * 1000) / CC_PER_IN3 },
  litres: { label: 'Litres', short: 'L', in3: 1000 / CC_PER_IN3 },
  cc: { label: 'Cubic centimetres (cc, mL)', short: 'cc', in3: 1 / CC_PER_IN3 },
  m3: { label: 'Cubic metres', short: 'm³', in3: 1e6 / CC_PER_IN3 },
};
/** Any volume unit → cubic inches. */
export const toCubicInches = (v: number, unit: VolumeUnit) => (Number.isFinite(v) ? v : 0) * VOLUME_UNITS[unit].in3;

// ---------- shapes ----------
export type Shape = 'box' | 'cylinder' | 'tube' | 'sphere';
export interface ShapeInput {
  shape: Shape;
  /** all dimensions in inches */
  length: number; // box length, cylinder/tube length or height
  width: number; // box width
  height: number; // box height
  diameter: number; // cylinder diameter, tube outside diameter, sphere diameter
  inner: number; // tube inside diameter
  quantity: number;
}
export interface ShapeResult {
  /** solid volume of one item (tube: the wall material) */
  each: number;
  /** total for the quantity */
  total: number;
  /** tube only: inside capacity of one tube */
  capacityEach: number;
  capacityTotal: number;
  error: string;
}
export function shapeVolume(i: ShapeInput): ShapeResult {
  const q = Math.max(1, Math.floor(pos(i.quantity) || 1));
  const L = pos(i.length);
  const D = pos(i.diameter);
  let each = 0;
  let capacityEach = 0;
  let error = '';
  switch (i.shape) {
    case 'box':
      each = L * pos(i.width) * pos(i.height);
      break;
    case 'cylinder':
      each = (Math.PI / 4) * D * D * L;
      break;
    case 'tube': {
      const d = pos(i.inner);
      if (d >= D && D > 0) error = 'The inside diameter must be smaller than the outside diameter.';
      else {
        each = (Math.PI / 4) * (D * D - d * d) * L;
        capacityEach = (Math.PI / 4) * d * d * L;
      }
      break;
    }
    case 'sphere':
      each = (Math.PI / 6) * D * D * D;
      break;
  }
  return { each, total: each * q, capacityEach, capacityTotal: capacityEach * q, error };
}

// ---------- engines ----------
/** Displacement in cubic inches from bore and stroke in inches. */
export function displacementIn3(boreIn: number, strokeIn: number, cylinders: number): number {
  return (Math.PI / 4) * pos(boreIn) ** 2 * pos(strokeIn) * Math.floor(pos(cylinders));
}

export interface EngineResult {
  ci: number;
  cc: number;
  litres: number;
  perCylinderCc: number;
  /** bore ÷ stroke: > 1 oversquare, < 1 undersquare */
  boreStrokeRatio: number;
  layout: 'oversquare' | 'square' | 'undersquare' | '';
}
export function engine(boreIn: number, strokeIn: number, cylinders: number): EngineResult {
  const ci = displacementIn3(boreIn, strokeIn, cylinders);
  const cc = ci * CC_PER_IN3;
  const n = Math.floor(pos(cylinders));
  const ratio = pos(strokeIn) > 0 ? pos(boreIn) / pos(strokeIn) : 0;
  // within ±1% counts as square
  const layout = ratio === 0 ? '' : Math.abs(ratio - 1) <= 0.01 ? 'square' : ratio > 1 ? 'oversquare' : 'undersquare';
  return { ci, cc, litres: cc / 1000, perCylinderCc: n > 0 ? cc / n : 0, boreStrokeRatio: ratio, layout };
}

/** Bore (in) that gives a target displacement (in³) with a known stroke. */
export function boreFor(targetIn3: number, strokeIn: number, cylinders: number): number {
  const s = pos(strokeIn);
  const n = Math.floor(pos(cylinders));
  if (!(pos(targetIn3) > 0) || !(s > 0) || !(n > 0)) return 0;
  return Math.sqrt((4 * targetIn3) / (Math.PI * s * n));
}
/** Stroke (in) that gives a target displacement (in³) with a known bore. */
export function strokeFor(targetIn3: number, boreIn: number, cylinders: number): number {
  const b = pos(boreIn);
  const n = Math.floor(pos(cylinders));
  if (!(pos(targetIn3) > 0) || !(b > 0) || !(n > 0)) return 0;
  return (4 * targetIn3) / (Math.PI * b * b * n);
}

/** Overbore and/or new stroke compared with the stock engine. */
export function whatIf(boreIn: number, strokeIn: number, cylinders: number, overboreIn: number, newStrokeIn?: number) {
  const before = engine(boreIn, strokeIn, cylinders);
  const nb = pos(boreIn) + (Number.isFinite(overboreIn) ? overboreIn : 0);
  const ns = newStrokeIn && newStrokeIn > 0 ? newStrokeIn : strokeIn;
  const after = engine(nb, ns, cylinders);
  return { before, after, bore: nb, stroke: ns, addedCi: after.ci - before.ci, addedCc: after.cc - before.cc, pct: before.ci > 0 ? ((after.ci - before.ci) / before.ci) * 100 : 0 };
}

export interface Preset {
  id: string;
  name: string;
  /** what the maker calls it */
  nominal: string;
  bore: number;
  stroke: number;
  unit: 'in' | 'mm';
  cylinders: number;
  source: string;
  url: string;
}
/** Bore and stroke exactly as published by the manufacturer. */
export const PRESETS: Preset[] = [
  {
    id: 'sbc350',
    name: 'Chevrolet small-block 350 (ZZ6)',
    nominal: '350 ci',
    bore: 4.0,
    stroke: 3.48,
    unit: 'in',
    cylinders: 8,
    source: 'Chevrolet Performance — ZZ6 crate engine specifications',
    url: 'https://www.chevrolet.com/performance-parts/crate-engines/small-block-zz6-efi-deluxe',
  },
  {
    id: 'ls3',
    name: 'Chevrolet LS3 6.2L',
    nominal: '376 ci / 6.2 L',
    bore: 4.065,
    stroke: 3.622,
    unit: 'in',
    cylinders: 8,
    source: 'Chevrolet Performance — LS3 long block specifications',
    url: 'https://www.chevrolet.com/performance-parts/crate-engines/ls-lsx-engines/ls3-engine',
  },
  {
    id: 'bbc502',
    name: 'Chevrolet big-block 502',
    nominal: '502 ci / 8.2 L',
    bore: 4.47,
    stroke: 4.0,
    unit: 'in',
    cylinders: 8,
    source: 'Chevrolet Performance — 502 big-block crate engine',
    url: 'https://www.chevrolet.com/performance-parts/crate-engines/big-block/zz-502-base',
  },
  {
    id: 'hemi392',
    name: 'Mopar 392 HEMI 6.4L',
    nominal: '392 ci / 6.4 L',
    bore: 4.09,
    stroke: 3.72,
    unit: 'in',
    cylinders: 8,
    source: 'Dodge Garage (Stellantis) — Gen III HEMI quick reference guide',
    url: 'https://www.dodgegarage.com/news/article/how-to/2020/10/gen-iii-hemi-engine-quick-reference-guide-part-iv.html',
  },
  {
    id: 'coyote',
    name: 'Ford Coyote 5.0L Gen 4 (crate)',
    nominal: '5.0 L',
    bore: 93,
    stroke: 92.7,
    unit: 'mm',
    cylinders: 8,
    source: 'Ford Performance — 5.0L Gen 4 crate engine M-6007-M50D',
    url: 'https://www.ford.com/product/50l-gen-4-mustang-crate-engine-w-flywheel-p2959841009',
  },
  {
    id: 'k20c1',
    name: 'Honda Civic Type R 2.0L',
    nominal: '1,996 cc',
    bore: 86.0,
    stroke: 85.9,
    unit: 'mm',
    cylinders: 4,
    source: 'Honda — Civic Type R specifications',
    url: 'https://hondanews.com/en-US/honda-automobiles/releases/2021-civic-type-r-specifications-features',
  },
];
export const presetEngine = (p: Preset) => {
  const f = p.unit === 'mm' ? 1 / MM_PER_IN : 1;
  return engine(p.bore * f, p.stroke * f, p.cylinders);
};

/** Bore × stroke displacement chart (V8 by default), in cubic inches. */
export function cidChart(bores: number[], strokes: number[], cylinders = 8): number[][] {
  return bores.map((b) => strokes.map((s) => displacementIn3(b, s, cylinders)));
}
