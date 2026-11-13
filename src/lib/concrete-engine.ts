/**
 * Concrete volume engine.
 *
 * All lengths are stored in metres and all volumes in cubic metres. The UI
 * converts to and from feet/inches or metres/centimetres for display only, so
 * switching unit systems never changes the physical size of a pour.
 *
 * Bag yields come from the QUIKRETE Concrete Mix (No. 1101) data sheet,
 * revised October 2022: 40 lb = 0.30 ft³, 50 lb = 0.375 ft³, 60 lb = 0.45 ft³,
 * 80 lb = 0.60 ft³, 90 lb = 0.675 ft³. Metric bag yields are estimated with the
 * same yield per kilogram (≈ 0.468 L per kg of dry mix).
 */

// ---------- unit constants ----------
export const M_PER_FT = 0.3048;
export const M_PER_IN = 0.0254;
export const FT3_PER_M3 = 1 / (M_PER_FT * M_PER_FT * M_PER_FT); // 35.3147
export const FT3_PER_YD3 = 27;
export const YD3_PER_M3 = FT3_PER_M3 / FT3_PER_YD3; // 1.30795
export const KG_PER_LB = 0.45359237;
export const LB_FT3_PER_KG_M3 = (1 / KG_PER_LB) / FT3_PER_M3; // 0.062428

export type UnitSystem = 'imperial' | 'metric';

// ---------- shapes ----------
export type ShapeId =
  | 'slab'
  | 'circle'
  | 'footing'
  | 'wall'
  | 'squareColumn'
  | 'roundColumn'
  | 'postHoles'
  | 'steps';

/** long = ft+in / m · short = in / cm · count = whole number */
export type FieldKind = 'long' | 'short' | 'count';

export interface FieldSpec {
  key: string;
  label: string;
  symbol: string;
  kind: FieldKind;
  /** default value in metres (or a plain number for counts) */
  defaultValue: number;
  help?: string;
}

export interface ShapeSpec {
  id: ShapeId;
  label: string;
  shortLabel: string;
  qtyLabel: string;
  defaultQty: number;
  fields: FieldSpec[];
  formula: string;
}

const ft = (v: number) => v * M_PER_FT;
const inch = (v: number) => v * M_PER_IN;

export const SHAPES: Record<ShapeId, ShapeSpec> = {
  slab: {
    id: 'slab',
    label: 'Slab, patio or driveway',
    shortLabel: 'Slab',
    qtyLabel: 'Number of identical slabs',
    defaultQty: 1,
    formula: 'V = L × W × T',
    fields: [
      { key: 'length', label: 'Length', symbol: 'L', kind: 'long', defaultValue: ft(10) },
      { key: 'width', label: 'Width', symbol: 'W', kind: 'long', defaultValue: ft(10) },
      { key: 'thickness', label: 'Thickness', symbol: 'T', kind: 'short', defaultValue: inch(4) },
    ],
  },
  circle: {
    id: 'circle',
    label: 'Round slab or pad',
    shortLabel: 'Round slab',
    qtyLabel: 'Number of identical pads',
    defaultQty: 1,
    formula: 'V = π × (D ÷ 2)² × T',
    fields: [
      { key: 'diameter', label: 'Diameter', symbol: 'D', kind: 'long', defaultValue: ft(8) },
      { key: 'thickness', label: 'Thickness', symbol: 'T', kind: 'short', defaultValue: inch(4) },
    ],
  },
  footing: {
    id: 'footing',
    label: 'Footing or trench',
    shortLabel: 'Footing',
    qtyLabel: 'Number of identical footings',
    defaultQty: 1,
    formula: 'V = L × W × D',
    fields: [
      { key: 'length', label: 'Length', symbol: 'L', kind: 'long', defaultValue: ft(20) },
      { key: 'width', label: 'Width', symbol: 'W', kind: 'short', defaultValue: inch(16) },
      { key: 'depth', label: 'Depth', symbol: 'D', kind: 'short', defaultValue: inch(8) },
    ],
  },
  wall: {
    id: 'wall',
    label: 'Wall',
    shortLabel: 'Wall',
    qtyLabel: 'Number of identical walls',
    defaultQty: 1,
    formula: 'V = L × H × T',
    fields: [
      { key: 'length', label: 'Length', symbol: 'L', kind: 'long', defaultValue: ft(12) },
      { key: 'height', label: 'Height', symbol: 'H', kind: 'long', defaultValue: ft(4) },
      { key: 'thickness', label: 'Thickness', symbol: 'T', kind: 'short', defaultValue: inch(8) },
    ],
  },
  squareColumn: {
    id: 'squareColumn',
    label: 'Square column or pier',
    shortLabel: 'Square column',
    qtyLabel: 'Number of columns',
    defaultQty: 1,
    formula: 'V = W × D × H',
    fields: [
      { key: 'width', label: 'Width', symbol: 'W', kind: 'short', defaultValue: inch(12) },
      { key: 'depth', label: 'Depth', symbol: 'D', kind: 'short', defaultValue: inch(12) },
      { key: 'height', label: 'Height', symbol: 'H', kind: 'long', defaultValue: ft(8) },
    ],
  },
  roundColumn: {
    id: 'roundColumn',
    label: 'Round column or Sonotube',
    shortLabel: 'Sonotube',
    qtyLabel: 'Number of tubes',
    defaultQty: 4,
    formula: 'V = π × (D ÷ 2)² × H',
    fields: [
      { key: 'diameter', label: 'Diameter', symbol: 'D', kind: 'short', defaultValue: inch(12) },
      { key: 'height', label: 'Height', symbol: 'H', kind: 'long', defaultValue: ft(4) },
    ],
  },
  postHoles: {
    id: 'postHoles',
    label: 'Fence or deck post holes',
    shortLabel: 'Post holes',
    qtyLabel: 'Number of post holes',
    defaultQty: 8,
    formula: 'V = π × (D ÷ 2)² × H − post × H',
    fields: [
      { key: 'diameter', label: 'Hole diameter', symbol: 'D', kind: 'short', defaultValue: inch(10) },
      { key: 'depth', label: 'Hole depth', symbol: 'H', kind: 'short', defaultValue: inch(24) },
      {
        key: 'postSize',
        label: 'Post width (square post)',
        symbol: 'P',
        kind: 'short',
        defaultValue: inch(3.5),
        help: 'A 4×4 post is 3.5 in wide. Enter 0 if the post goes in later.',
      },
    ],
  },
  steps: {
    id: 'steps',
    label: 'Steps or stairs',
    shortLabel: 'Steps',
    qtyLabel: 'Number of identical step sets',
    defaultQty: 1,
    formula: 'V = W × R × T × N × (N + 1) ÷ 2',
    fields: [
      { key: 'stepCount', label: 'Number of steps', symbol: 'N', kind: 'count', defaultValue: 3 },
      { key: 'rise', label: 'Rise per step', symbol: 'R', kind: 'short', defaultValue: inch(7) },
      { key: 'run', label: 'Run (tread depth)', symbol: 'T', kind: 'short', defaultValue: inch(11) },
      { key: 'width', label: 'Step width', symbol: 'W', kind: 'long', defaultValue: ft(4) },
    ],
  },
};

export const SHAPE_ORDER: ShapeId[] = [
  'slab',
  'footing',
  'circle',
  'wall',
  'squareColumn',
  'roundColumn',
  'postHoles',
  'steps',
];

export function defaultValues(shape: ShapeId): Record<string, number> {
  const out: Record<string, number> = {};
  for (const f of SHAPES[shape].fields) out[f.key] = f.defaultValue;
  return out;
}

const pos = (v: number | undefined) => (typeof v === 'number' && isFinite(v) && v > 0 ? v : 0);

/** Volume of ONE unit of the shape, in m³ (before quantity and waste). */
export function shapeVolumeM3(shape: ShapeId, v: Record<string, number>): number {
  switch (shape) {
    case 'slab':
      return pos(v.length) * pos(v.width) * pos(v.thickness);
    case 'footing':
      return pos(v.length) * pos(v.width) * pos(v.depth);
    case 'circle': {
      const r = pos(v.diameter) / 2;
      return Math.PI * r * r * pos(v.thickness);
    }
    case 'wall':
      return pos(v.length) * pos(v.height) * pos(v.thickness);
    case 'squareColumn':
      return pos(v.width) * pos(v.depth) * pos(v.height);
    case 'roundColumn': {
      const r = pos(v.diameter) / 2;
      return Math.PI * r * r * pos(v.height);
    }
    case 'postHoles': {
      const r = pos(v.diameter) / 2;
      const depth = pos(v.depth);
      const hole = Math.PI * r * r * depth;
      const post = pos(v.postSize) * pos(v.postSize) * depth;
      return Math.max(0, hole - post);
    }
    case 'steps': {
      const n = Math.floor(pos(v.stepCount));
      return pos(v.width) * pos(v.rise) * pos(v.run) * ((n * (n + 1)) / 2);
    }
    default:
      return 0;
  }
}

// ---------- bags ----------
export interface BagSpec {
  id: string;
  label: string;
  system: UnitSystem;
  /** yield of mixed concrete per bag, m³ */
  yieldM3: number;
}

const FT3 = 1 / FT3_PER_M3;
/** m³ of mixed concrete per kg of dry bagged mix (80 lb → 0.60 ft³). */
export const YIELD_M3_PER_KG = (0.6 * FT3) / (80 * KG_PER_LB);

export const BAGS: BagSpec[] = [
  { id: 'lb40', label: '40 lb', system: 'imperial', yieldM3: 0.3 * FT3 },
  { id: 'lb50', label: '50 lb', system: 'imperial', yieldM3: 0.375 * FT3 },
  { id: 'lb60', label: '60 lb', system: 'imperial', yieldM3: 0.45 * FT3 },
  { id: 'lb80', label: '80 lb', system: 'imperial', yieldM3: 0.6 * FT3 },
  { id: 'lb90', label: '90 lb', system: 'imperial', yieldM3: 0.675 * FT3 },
  { id: 'kg20', label: '20 kg', system: 'metric', yieldM3: 20 * YIELD_M3_PER_KG },
  { id: 'kg25', label: '25 kg', system: 'metric', yieldM3: 25 * YIELD_M3_PER_KG },
  { id: 'kg30', label: '30 kg', system: 'metric', yieldM3: 30 * YIELD_M3_PER_KG },
  { id: 'kg40', label: '40 kg', system: 'metric', yieldM3: 40 * YIELD_M3_PER_KG },
];

/** Whole bags needed, always rounded up (tiny float noise ignored). */
export function bagsNeeded(volumeM3: number, yieldM3: number): number {
  if (!(volumeM3 > 0) || !(yieldM3 > 0)) return 0;
  return Math.ceil(volumeM3 / yieldM3 - 1e-9);
}

/** Round a value up to the next multiple of step (e.g. 0.25 yd³). */
export function roundUpTo(value: number, step: number): number {
  if (!(value > 0)) return 0;
  if (!(step > 0)) return value;
  return Math.ceil(value / step - 1e-9) * step;
}

// ---------- site-mix (cement / sand / gravel) ----------
export interface MixRatio {
  id: string;
  label: string;
  parts: [number, number, number];
}

export const MIX_RATIOS: MixRatio[] = [
  { id: '1-1.5-3', label: '1 : 1.5 : 3 (stronger, ~M20)', parts: [1, 1.5, 3] },
  { id: '1-2-4', label: '1 : 2 : 4 (general, ~M15)', parts: [1, 2, 4] },
  { id: '1-3-6', label: '1 : 3 : 6 (blinding / mass fill, ~M10)', parts: [1, 3, 6] },
];

/** Dry loose materials take ~54% more volume than the finished concrete. */
export const DRY_VOLUME_FACTOR = 1.54;
/** Bulk density of portland cement, kg/m³. */
export const CEMENT_DENSITY_KG_M3 = 1440;
export const US_CEMENT_BAG_KG = 94 * KG_PER_LB; // 42.64 kg
export const METRIC_CEMENT_BAG_KG = 50;

export interface MixResult {
  cementKg: number;
  cementBags94lb: number;
  cementBags50kg: number;
  sandM3: number;
  gravelM3: number;
}

export function siteMix(volumeM3: number, parts: [number, number, number]): MixResult {
  const v = pos(volumeM3);
  const sum = parts[0] + parts[1] + parts[2];
  const dry = v * DRY_VOLUME_FACTOR;
  const cementM3 = (dry * parts[0]) / sum;
  const cementKg = cementM3 * CEMENT_DENSITY_KG_M3;
  return {
    cementKg,
    cementBags94lb: cementKg > 0 ? Math.ceil(cementKg / US_CEMENT_BAG_KG - 1e-9) : 0,
    cementBags50kg: cementKg > 0 ? Math.ceil(cementKg / METRIC_CEMENT_BAG_KG - 1e-9) : 0,
    sandM3: (dry * parts[1]) / sum,
    gravelM3: (dry * parts[2]) / sum,
  };
}

// ---------- job ----------
export interface JobItem {
  id: string;
  shape: ShapeId;
  values: Record<string, number>;
  qty: number;
}

export interface JobInput {
  items: JobItem[];
  wastePercent: number;
  densityKgM3: number;
  truckCapacityM3: number;
}

export interface JobItemResult {
  id: string;
  unitVolumeM3: number;
  volumeM3: number;
}

export interface JobResult {
  items: JobItemResult[];
  netM3: number;
  wasteM3: number;
  totalM3: number;
  weightKg: number;
  bags: { id: string; label: string; system: UnitSystem; count: number }[];
  truckLoads: number;
}

export function calculateJob(input: JobInput): JobResult {
  const items = input.items.map((it) => {
    const unit = shapeVolumeM3(it.shape, it.values);
    const qty = Math.max(0, Math.floor(pos(it.qty)));
    return { id: it.id, unitVolumeM3: unit, volumeM3: unit * qty };
  });
  const netM3 = items.reduce((s, i) => s + i.volumeM3, 0);
  const waste = Math.min(100, Math.max(0, input.wastePercent || 0));
  const totalM3 = netM3 * (1 + waste / 100);
  const weightKg = totalM3 * pos(input.densityKgM3);
  const bags = BAGS.map((b) => ({
    id: b.id,
    label: b.label,
    system: b.system,
    count: bagsNeeded(totalM3, b.yieldM3),
  }));
  const cap = pos(input.truckCapacityM3);
  const truckLoads = cap > 0 && totalM3 > 0 ? Math.ceil(totalM3 / cap - 1e-9) : 0;
  return { items, netM3, wasteM3: totalM3 - netM3, totalM3, weightKg, bags, truckLoads };
}

// ---------- display helpers ----------
export const m3ToFt3 = (m3: number) => m3 * FT3_PER_M3;
export const m3ToYd3 = (m3: number) => m3 * YD3_PER_M3;
export const yd3ToM3 = (yd3: number) => yd3 / YD3_PER_M3;
export const kgToLb = (kg: number) => kg / KG_PER_LB;
