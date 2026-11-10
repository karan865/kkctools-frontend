// volume-engine.ts — shared "dimensions -> volume" calculation core (no DOM, no external deps).
// Supports: rectangle, circle, triangle (prism), area x depth, and known volume.
// Cubic Yard page uses this directly. Asphalt / Stone / Sand / Fill Dirt can reuse it later.

export const FT_PER_M = 3.280839895013123;
export const KG_PER_LB = 0.45359237;
export const LB_PER_SHORT_TON = 2000;
export const EPS = 1e-9;
export const ceilSafe = (x: number): number => Math.ceil(x - EPS); // avoids 45.0000000001 -> 46

export type VolumeLengthUnit = 'ft' | 'in' | 'yd' | 'm' | 'cm' | 'mm';
export type VolumeAreaUnit = 'sqft' | 'sqyd' | 'sqm';
export type VolumeUnit = 'ft3' | 'yd3' | 'm3' | 'in3' | 'l';
export type VolumeDensityUnit = 'lb/ft3' | 'kg/m3' | 'tons/yd3' | 'lb/yd3';

export const LENGTH_TO_FT: Record<VolumeLengthUnit, number> = {
  ft: 1,
  in: 1 / 12,
  yd: 3,
  m: FT_PER_M,
  cm: FT_PER_M / 100,
  mm: FT_PER_M / 1000,
};

export const AREA_TO_SQFT: Record<VolumeAreaUnit, number> = {
  sqft: 1,
  sqyd: 9,
  sqm: FT_PER_M ** 2,
};

export const VOLUME_TO_FT3: Record<VolumeUnit, number> = {
  ft3: 1,
  yd3: 27,
  m3: FT_PER_M ** 3,
  in3: 1 / 1728,
  l: (FT_PER_M ** 3) / 1000,
};

export const DENSITY_TO_LB_FT3: Record<VolumeDensityUnit, number> = {
  'lb/ft3': 1,
  'kg/m3': 1 / 16.01846337396,
  'tons/yd3': LB_PER_SHORT_TON / 27,
  'lb/yd3': 1 / 27,
};

// Typical bagged concrete mix yields (ft3 per bag).
export const BAG_YIELD_FT3: Record<number, number> = {
  40: 0.3,
  50: 0.375,
  60: 0.45,
  80: 0.6,
};
export const CONCRETE_DENSITY_LB_FT3 = 150; // normal-weight concrete

export const toFt = (v: number, u: VolumeLengthUnit): number => v * LENGTH_TO_FT[u];

export interface RectangleVolumeSection {
  shape: 'rectangle';
  length: number;
  lengthUnit: VolumeLengthUnit;
  width: number;
  widthUnit: VolumeLengthUnit;
  depth: number;
  depthUnit: VolumeLengthUnit;
  qty?: number;
  label?: string;
}

export interface CircleVolumeSection {
  shape: 'circle';
  diameter: number;
  diameterUnit: VolumeLengthUnit;
  depth: number;
  depthUnit: VolumeLengthUnit;
  qty?: number;
  label?: string;
}

export interface TriangleVolumeSection {
  shape: 'triangle';
  base: number;
  baseUnit: VolumeLengthUnit;
  height: number;
  heightUnit: VolumeLengthUnit;
  depth: number;
  depthUnit: VolumeLengthUnit;
  qty?: number;
  label?: string;
}

export interface AreaDepthVolumeSection {
  shape: 'area';
  area: number;
  areaUnit: VolumeAreaUnit;
  depth: number;
  depthUnit: VolumeLengthUnit;
  qty?: number;
  label?: string;
}

export interface DirectVolumeSection {
  shape: 'volume';
  volume: number;
  volumeUnit: VolumeUnit;
  qty?: number;
  label?: string;
}

export type VolumeSectionInput =
  | RectangleVolumeSection
  | CircleVolumeSection
  | TriangleVolumeSection
  | AreaDepthVolumeSection
  | DirectVolumeSection;

export interface VolumeCalcInput {
  material?: 'concrete' | 'other';
  wastePct: number;
  density?: number;
  densityUnit?: VolumeDensityUnit;
  sections: VolumeSectionInput[];
}

export function sectionVolumeFt3(s: VolumeSectionInput): number {
  const qty = s.qty == null ? 1 : s.qty;
  let v = 0;
  switch (s.shape) {
    case 'rectangle':
      v = toFt(s.length, s.lengthUnit) * toFt(s.width, s.widthUnit) * toFt(s.depth, s.depthUnit);
      break;
    case 'circle': {
      const r = toFt(s.diameter, s.diameterUnit) / 2;
      v = Math.PI * r * r * toFt(s.depth, s.depthUnit);
      break;
    }
    case 'triangle':
      v = 0.5 * toFt(s.base, s.baseUnit) * toFt(s.height, s.heightUnit) * toFt(s.depth, s.depthUnit);
      break;
    case 'area':
      v = s.area * AREA_TO_SQFT[s.areaUnit] * toFt(s.depth, s.depthUnit);
      break;
    case 'volume':
      v = s.volume * VOLUME_TO_FT3[s.volumeUnit];
      break;
    default:
      throw new Error('Unknown shape: ' + (s as VolumeSectionInput).shape);
  }
  return v * qty;
}

export function validate(input: VolumeCalcInput): string[] {
  const errors: string[] = [];
  const pos = (n: unknown): boolean => typeof n === 'number' && isFinite(n) && n > 0;
  const secs = input.sections || [];

  if (!secs.length) errors.push('Add at least one section.');
  if (secs.length > 10) errors.push('Maximum 10 sections.');

  secs.forEach((s, i) => {
    const q = s.qty == null ? 1 : s.qty;
    if (!(Number.isInteger(q) && q >= 1 && q <= 1000)) {
      errors.push(`Section ${i + 1}: quantity must be a whole number from 1 to 1,000.`);
    }
    let v = NaN;
    try {
      v = sectionVolumeFt3(s);
    } catch {}
    if (!pos(v)) {
      errors.push(`Section ${i + 1}: enter dimensions greater than 0.`);
    }
  });

  if (!(input.wastePct >= 0 && input.wastePct <= 50)) {
    errors.push('Waste must be between 0% and 50%.');
  }

  if (input.density != null && input.density !== ('' as unknown)) {
    const d = input.density * DENSITY_TO_LB_FT3[input.densityUnit || 'lb/ft3'];
    if (!pos(d)) {
      errors.push('Enter a density greater than 0.');
    }
  }

  return errors;
}

export interface VolumeBreakdownItem {
  label: string;
  ft3: number;
  yd3: number;
}

export interface VolumeQuantities {
  ft3: number;
  yd3: number;
  m3: number;
}

export interface WeightQuantities {
  pounds: number;
  tons: number;
  tonnes: number;
}

export interface ConcreteBagYield {
  sizeLb: number;
  yieldFt3: number;
  bags: number;
}

export interface VolumeCalcResult {
  ok: true;
  material: 'concrete' | 'other';
  breakdown: VolumeBreakdownItem[];
  exact: VolumeQuantities;
  order: VolumeQuantities;
  suggestedOrderYd3: number;
  densityLbFt3?: number;
  weightExact?: WeightQuantities;
  weightOrder?: WeightQuantities;
  bags?: ConcreteBagYield[];
  guidance?: 'bags' | 'compare' | 'ready-mix';
}

export interface VolumeCalcError {
  ok: false;
  errors: string[];
}

export type VolumeCalcOutput = VolumeCalcResult | VolumeCalcError;

export function calcVolume(input: VolumeCalcInput): VolumeCalcOutput {
  const errors = validate(input);
  if (errors.length) return { ok: false, errors };

  const material = input.material || 'concrete';
  const breakdown: VolumeBreakdownItem[] = input.sections.map((s, i) => {
    const ft3 = sectionVolumeFt3(s);
    return { label: s.label || `Section ${i + 1}`, ft3, yd3: ft3 / 27 };
  });

  const exactFt3 = breakdown.reduce((a, b) => a + b.ft3, 0);
  const factor = 1 + input.wastePct / 100;
  const vols = (f: number): VolumeQuantities => ({
    ft3: exactFt3 * f,
    yd3: (exactFt3 * f) / 27,
    m3: (exactFt3 * f) / (FT_PER_M ** 3),
  });

  const exact = vols(1);
  const order = vols(factor);

  const out: VolumeCalcResult = {
    ok: true,
    material,
    breakdown,
    exact,
    order,
    suggestedOrderYd3: ceilSafe(order.yd3 * 4) / 4, // round UP to nearest 1/4 yd3 (ready-mix style)
  };

  // Weight: concrete defaults to 150 lb/ft3; other materials only if a density is supplied
  let dens: number | null = null;
  if (input.density != null && input.density !== ('' as unknown)) {
    dens = input.density * DENSITY_TO_LB_FT3[input.densityUnit || 'lb/ft3'];
  } else if (material === 'concrete') {
    dens = CONCRETE_DENSITY_LB_FT3;
  }

  if (dens) {
    const w = (ft3: number): WeightQuantities => {
      const lb = ft3 * (dens as number);
      return {
        pounds: lb,
        tons: lb / LB_PER_SHORT_TON,
        tonnes: (lb * KG_PER_LB) / 1000,
      };
    };
    out.densityLbFt3 = dens;
    out.weightExact = w(exactFt3);
    out.weightOrder = w(exactFt3 * factor);
  }

  if (material === 'concrete') {
    out.bags = Object.keys(BAG_YIELD_FT3).map((k) => {
      const sizeLb = Number(k);
      const yieldFt3 = BAG_YIELD_FT3[sizeLb];
      return {
        sizeLb,
        yieldFt3,
        bags: ceilSafe(order.ft3 / yieldFt3),
      };
    });
    out.guidance = order.yd3 < 1 ? 'bags' : order.yd3 < 5 ? 'compare' : 'ready-mix';
  }

  return out;
}

