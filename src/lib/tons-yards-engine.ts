export type ConversionDirection = 'tons-to-yards' | 'yards-to-tons';

export interface MaterialDensityPreset {
  id: string;
  name: string;
  densityTonsPerYard: number; // US short tons per cubic yard
  lbsPerCuFt: number; // lbs per cu ft (densityTonsPerYard * 2000 / 27)
  category: string;
}

export const MATERIAL_DENSITIES: MaterialDensityPreset[] = [
  {
    id: 'crushed-stone',
    name: 'Crushed Stone / Road Base',
    densityTonsPerYard: 1.4,
    lbsPerCuFt: 103.7,
    category: 'Aggregates',
  },
  {
    id: 'river-gravel',
    name: 'River Gravel / Washed Stone',
    densityTonsPerYard: 1.35,
    lbsPerCuFt: 100.0,
    category: 'Aggregates',
  },
  {
    id: 'clean-limestone-57',
    name: '#57 Clean Limestone',
    densityTonsPerYard: 1.35,
    lbsPerCuFt: 100.0,
    category: 'Aggregates',
  },
  {
    id: 'dry-sand',
    name: 'Dry Concrete Sand',
    densityTonsPerYard: 1.35,
    lbsPerCuFt: 100.0,
    category: 'Sand',
  },
  {
    id: 'wet-sand',
    name: 'Wet Packed Sand',
    densityTonsPerYard: 1.6,
    lbsPerCuFt: 118.5,
    category: 'Sand',
  },
  {
    id: 'topsoil-screened',
    name: 'Topsoil / Screened Loam',
    densityTonsPerYard: 1.1,
    lbsPerCuFt: 81.5,
    category: 'Soils',
  },
  {
    id: 'fill-dirt',
    name: 'Fill Dirt (Compacted)',
    densityTonsPerYard: 1.25,
    lbsPerCuFt: 92.6,
    category: 'Soils',
  },
  {
    id: 'hot-mix-asphalt',
    name: 'Hot Mix Asphalt',
    densityTonsPerYard: 2.025,
    lbsPerCuFt: 150.0,
    category: 'Paving',
  },
  {
    id: 'solid-concrete',
    name: 'Poured Solid Concrete',
    densityTonsPerYard: 2.02,
    lbsPerCuFt: 149.6,
    category: 'Concrete',
  },
  {
    id: 'garden-compost',
    name: 'Organic Garden Compost',
    densityTonsPerYard: 0.65,
    lbsPerCuFt: 48.1,
    category: 'Landscaping',
  },
  {
    id: 'bark-mulch',
    name: 'Hardwood Bark Mulch',
    densityTonsPerYard: 0.4,
    lbsPerCuFt: 29.6,
    category: 'Landscaping',
  },
];

export interface TonsYardsInput {
  direction: ConversionDirection;
  amount: number; // tons or cubic yards
  materialId: string;
  customDensityTonsPerYard?: number;
  unitPrice?: number; // price per ton or cubic yard
}

export interface TonsYardsResult {
  weightShortTons: number;
  weightPounds: number;
  weightMetricTonnes: number;
  volumeCubicYards: number;
  volumeCubicFeet: number;
  volumeCubicMeters: number;
  bags50LbCount: number;
  effectiveDensityTonsPerYard: number;
  totalCost?: number;
}

export function convertTonsToCubicYards(input: TonsYardsInput): TonsYardsResult {
  const amount = Math.max(0, input.amount || 0);

  let density = 1.4;
  if (input.materialId === 'custom' && input.customDensityTonsPerYard && input.customDensityTonsPerYard > 0) {
    density = input.customDensityTonsPerYard;
  } else {
    const preset = MATERIAL_DENSITIES.find((m) => m.id === input.materialId);
    if (preset) {
      density = preset.densityTonsPerYard;
    }
  }

  let weightShortTons = 0;
  let volumeCubicYards = 0;

  if (input.direction === 'tons-to-yards') {
    weightShortTons = amount;
    volumeCubicYards = density > 0 ? amount / density : 0;
  } else {
    // yards-to-tons
    volumeCubicYards = amount;
    weightShortTons = amount * density;
  }

  const weightPounds = weightShortTons * 2000;
  const weightMetricTonnes = weightPounds / 2204.62;
  const volumeCubicFeet = volumeCubicYards * 27;
  const volumeCubicMeters = volumeCubicYards * 0.764555;
  const bags50LbCount = Math.ceil(weightPounds / 50);

  let totalCost: number | undefined;
  if (input.unitPrice !== undefined && input.unitPrice > 0) {
    // Price applies to input quantity
    totalCost = parseFloat((amount * input.unitPrice).toFixed(2));
  }

  return {
    weightShortTons: parseFloat(weightShortTons.toFixed(2)),
    weightPounds: Math.round(weightPounds),
    weightMetricTonnes: parseFloat(weightMetricTonnes.toFixed(2)),
    volumeCubicYards: parseFloat(volumeCubicYards.toFixed(2)),
    volumeCubicFeet: parseFloat(volumeCubicFeet.toFixed(2)),
    volumeCubicMeters: parseFloat(volumeCubicMeters.toFixed(2)),
    bags50LbCount,
    effectiveDensityTonsPerYard: density,
    totalCost,
  };
}

