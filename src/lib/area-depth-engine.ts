// area-depth-engine.ts — framework-independent area-depth calculation core (no DOM, no external deps)
// Reusable across Asphalt, Stone, Sand, Fill Dirt, Cubic Yard calculators.

export const LB_PER_SHORT_TON = 2000;
export const KG_PER_LB = 0.45359237;
export const FT_PER_M = 3.280839895013123;

export type LengthUnit = 'ft' | 'in' | 'yd' | 'm' | 'cm' | 'mm';
export type AreaUnit = 'sqft' | 'sqyd' | 'sqm';
export type DensityUnit = 'lb/ft3' | 'kg/m3' | 'tons/yd3' | 'lb/yd3';
export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'area';

export const LENGTH_TO_FT: Record<LengthUnit, number> = {
  ft: 1,
  in: 1 / 12,
  yd: 3,
  m: FT_PER_M,
  cm: FT_PER_M / 100,
  mm: FT_PER_M / 1000,
};

export const AREA_TO_SQFT: Record<AreaUnit, number> = {
  sqft: 1,
  sqyd: 9,
  sqm: FT_PER_M * FT_PER_M,
};

export const DENSITY_TO_LB_FT3: Record<DensityUnit, number> = {
  'lb/ft3': 1,
  'kg/m3': 1 / 16.01846337396, // 1 lb/ft3 = 16.01846 kg/m3
  'tons/yd3': LB_PER_SHORT_TON / 27, // short tons per cubic yard
  'lb/yd3': 1 / 27,
};

export interface RectangleSection {
  shape: 'rectangle';
  length: number;
  lengthUnit: LengthUnit;
  width: number;
  widthUnit: LengthUnit;
}

export interface CircleSection {
  shape: 'circle';
  diameter: number;
  diameterUnit: LengthUnit;
}

export interface TriangleSection {
  shape: 'triangle';
  base: number;
  baseUnit: LengthUnit;
  height: number;
  heightUnit: LengthUnit;
}

export interface KnownAreaSection {
  shape: 'area';
  area: number;
  areaUnit: AreaUnit;
}

export type SectionInput = RectangleSection | CircleSection | TriangleSection | KnownAreaSection;

export interface MaterialCalcInput {
  sections: SectionInput[];
  thickness: number;
  thicknessUnit: LengthUnit;
  density: number;
  densityUnit: DensityUnit;
  wastePct: number;
  pricePerTon?: number;
  truckCapacityTons?: number;
  binderPct?: number;
}

export interface BuildQuantities {
  tons: number;
  tonnes: number;
  pounds: number;
  cubicFeet: number;
  cubicYards: number;
  cubicMeters: number;
}

export interface MaterialCalcResult {
  ok: true;
  areaSqFt: number;
  areaSqYd: number;
  areaSqM: number;
  thicknessIn: number;
  densityLbFt3: number;
  densityTonsPerYd3: number;
  exact: BuildQuantities;
  order: BuildQuantities;
  suggestedOrderTons: number;
  coverageSqFtPerTon: number;
  materialCost?: number;
  truckloads?: number;
  binderTons?: number;
}

export interface MaterialCalcError {
  ok: false;
  errors: string[];
}

export type CalcOutput = MaterialCalcResult | MaterialCalcError;

export const toFt = (v: number, unit: LengthUnit): number => v * LENGTH_TO_FT[unit];

export function sectionAreaSqFt(s: SectionInput): number {
  switch (s.shape) {
    case 'rectangle':
      return toFt(s.length, s.lengthUnit) * toFt(s.width, s.widthUnit);
    case 'circle': {
      const r = toFt(s.diameter, s.diameterUnit) / 2;
      return Math.PI * r * r;
    }
    case 'triangle':
      return 0.5 * toFt(s.base, s.baseUnit) * toFt(s.height, s.heightUnit);
    case 'area':
      return s.area * AREA_TO_SQFT[s.areaUnit];
    default:
      throw new Error('Unknown shape: ' + (s as SectionInput).shape);
  }
}

export function validate(input: MaterialCalcInput): string[] {
  const errors: string[] = [];
  const pos = (n: unknown): boolean => typeof n === 'number' && isFinite(n) && n > 0;

  if (!input.sections || !input.sections.length) {
    errors.push('Add at least one section.');
  }

  (input.sections || []).forEach((s, i) => {
    const a = (() => {
      try {
        return sectionAreaSqFt(s);
      } catch {
        return NaN;
      }
    })();
    if (!pos(a)) {
      errors.push(`Section ${i + 1}: enter dimensions greater than 0.`);
    }
  });

  const thicknessIn = toFt(input.thickness, input.thicknessUnit) * 12;
  if (!pos(thicknessIn)) {
    errors.push('Enter a thickness greater than 0.');
  } else if (thicknessIn > 24) {
    errors.push('Thickness above 24 in (60 cm) is not supported.');
  }

  const dens = input.density * DENSITY_TO_LB_FT3[input.densityUnit];
  if (!pos(dens)) {
    errors.push('Enter a density greater than 0.');
  } else if (dens < 60 || dens > 200) {
    errors.push('Density looks out of range (expected roughly 90–160 lb/ft³).');
  }

  if (!(input.wastePct >= 0 && input.wastePct <= 50)) {
    errors.push('Waste must be between 0% and 50%.');
  }

  return errors;
}

export function calcMaterial(input: MaterialCalcInput): CalcOutput {
  const errors = validate(input);
  if (errors.length) return { ok: false, errors };

  const areaSqFt = input.sections.reduce((sum, s) => sum + sectionAreaSqFt(s), 0);
  const thicknessFt = toFt(input.thickness, input.thicknessUnit);
  const densityLbFt3 = input.density * DENSITY_TO_LB_FT3[input.densityUnit];
  const wasteFactor = 1 + input.wastePct / 100;

  const volFt3 = areaSqFt * thicknessFt;
  const exactLb = volFt3 * densityLbFt3;
  const exactTons = exactLb / LB_PER_SHORT_TON; // US short tons
  const orderTons = exactTons * wasteFactor;

  const build = (factor: number): BuildQuantities => ({
    tons: exactTons * factor,
    tonnes: ((exactLb * KG_PER_LB) / 1000) * factor, // metric tonnes
    pounds: exactLb * factor,
    cubicFeet: volFt3 * factor,
    cubicYards: (volFt3 / 27) * factor,
    cubicMeters: (volFt3 / (FT_PER_M ** 3)) * factor,
  });

  const out: MaterialCalcResult = {
    ok: true,
    areaSqFt,
    areaSqYd: areaSqFt / 9,
    areaSqM: areaSqFt / (FT_PER_M ** 2),
    thicknessIn: thicknessFt * 12,
    densityLbFt3,
    densityTonsPerYd3: (densityLbFt3 * 27) / LB_PER_SHORT_TON,
    exact: build(1),
    order: build(wasteFactor),
    suggestedOrderTons: Math.ceil(orderTons * 2) / 2, // round UP to nearest 0.5 ton
    coverageSqFtPerTon: LB_PER_SHORT_TON / (densityLbFt3 * thicknessFt),
  };

  if (input.pricePerTon && input.pricePerTon > 0) {
    out.materialCost = orderTons * input.pricePerTon;
  }
  if (input.truckCapacityTons && input.truckCapacityTons > 0) {
    out.truckloads = orderTons / input.truckCapacityTons;
  }
  if (input.binderPct && input.binderPct > 0) {
    out.binderTons = (orderTons * input.binderPct) / 100;
  }

  return out;
}

