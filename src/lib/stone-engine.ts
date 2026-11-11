export interface StoneMaterialPreset {
  id: string;
  name: string;
  densityLbFt3: number; // lbs per cubic foot
  tonsPerYd3: number; // tons per cubic yard (density * 27 / 2000)
  description: string;
}

export const STONE_MATERIAL_PRESETS: StoneMaterialPreset[] = [
  {
    id: 'crushed-limestone-57',
    name: 'Crushed Limestone / #57 Stone (95 lbs/cu ft)',
    densityLbFt3: 95,
    tonsPerYd3: 1.2825,
    description: 'Driveway base, French drains, concrete aggregate',
  },
  {
    id: 'river-rock',
    name: 'River Rock / Smooth Round Cobble (100 lbs/cu ft)',
    densityLbFt3: 100,
    tonsPerYd3: 1.35,
    description: 'Decorative landscape beds, dry riverbeds',
  },
  {
    id: 'pea-gravel',
    name: 'Pea Rock / Pea Gravel (105 lbs/cu ft)',
    densityLbFt3: 105,
    tonsPerYd3: 1.4175,
    description: 'Walkways, patios, dog runs, playgrounds',
  },
  {
    id: 'crushed-granite',
    name: 'Crushed Granite / Trap Rock (105 lbs/cu ft)',
    densityLbFt3: 105,
    tonsPerYd3: 1.4175,
    description: 'Heavy-duty driveways, commercial foundations',
  },
  {
    id: 'decomposed-granite',
    name: 'Decomposed Granite / DG (110 lbs/cu ft)',
    densityLbFt3: 110,
    tonsPerYd3: 1.485,
    description: 'Pathways, bocce ball courts, xeriscaping',
  },
  {
    id: 'rip-rap',
    name: 'Heavy Rip Rap / Quarry Stone (115 lbs/cu ft)',
    densityLbFt3: 115,
    tonsPerYd3: 1.5525,
    description: 'Shoreline erosion control, culverts, steep slopes',
  },
  {
    id: 'lava-rock',
    name: 'Lightweight Lava Rock (45 lbs/cu ft)',
    densityLbFt3: 45,
    tonsPerYd3: 0.6075,
    description: 'Porous volcanic mulch, fire pit surrounds',
  },
];

export interface StoneCalculationInput {
  mode: 'dimensions' | 'area';
  lengthFt?: number;
  widthFt?: number;
  areaSqFt?: number;
  depthInches: number;
  densityLbFt3: number;
  wastePercent: number;
  pricingMode?: 'ton' | 'cubicYard';
  unitPrice?: number;
  deliveryFee?: number;
}

export interface StoneCalculationResult {
  netAreaSqFt: number;
  depthInches: number;
  depthFt: number;
  netVolumeCuFt: number;
  wastePercent: number;
  grossVolumeCuFt: number;
  volumeCuYds: number;
  totalWeightLbs: number;
  weightUSShortTons: number;
  weightMetricTonnes: number;
  bags50lb: number;
  materialCost: number;
  deliveryFee: number;
  totalCost: number;
}

export function calculateStone(input: StoneCalculationInput): StoneCalculationResult {
  const depthInches = Math.max(0, input.depthInches || 0);
  const depthFt = depthInches / 12;

  let netAreaSqFt = 0;
  if (input.mode === 'area') {
    netAreaSqFt = Math.max(0, input.areaSqFt || 0);
  } else {
    const l = Math.max(0, input.lengthFt || 0);
    const w = Math.max(0, input.widthFt || 0);
    netAreaSqFt = l * w;
  }

  const netVolumeCuFt = netAreaSqFt * depthFt;
  const wastePercent = Math.max(0, input.wastePercent || 0);
  const grossVolumeCuFt = netVolumeCuFt * (1 + wastePercent / 100);
  const volumeCuYds = grossVolumeCuFt / 27;

  const densityLbFt3 = Math.max(1, input.densityLbFt3 || 100);
  const totalWeightLbs = grossVolumeCuFt * densityLbFt3;
  const weightUSShortTons = totalWeightLbs / 2000;
  const weightMetricTonnes = totalWeightLbs / 2204.62;
  const bags50lb = Math.ceil(parseFloat((totalWeightLbs / 50).toFixed(4)));

  const pricingMode = input.pricingMode || 'ton';
  const unitPrice = Math.max(0, input.unitPrice || 0);
  const deliveryFee = Math.max(0, input.deliveryFee || 0);

  let materialCost = 0;
  if (unitPrice > 0) {
    if (pricingMode === 'cubicYard') {
      materialCost = parseFloat((volumeCuYds * unitPrice).toFixed(2));
    } else {
      materialCost = parseFloat((parseFloat(weightUSShortTons.toFixed(2)) * unitPrice).toFixed(2));
    }
  }

  const totalCost = materialCost > 0 ? materialCost + deliveryFee : 0;

  return {
    netAreaSqFt: parseFloat(netAreaSqFt.toFixed(2)),
    depthInches: parseFloat(depthInches.toFixed(2)),
    depthFt: parseFloat(depthFt.toFixed(4)),
    netVolumeCuFt: parseFloat(netVolumeCuFt.toFixed(2)),
    wastePercent,
    grossVolumeCuFt: parseFloat(grossVolumeCuFt.toFixed(2)),
    volumeCuYds: parseFloat(volumeCuYds.toFixed(2)),
    totalWeightLbs: Math.round(totalWeightLbs),
    weightUSShortTons: parseFloat(weightUSShortTons.toFixed(2)),
    weightMetricTonnes: parseFloat(weightMetricTonnes.toFixed(2)),
    bags50lb,
    materialCost: parseFloat(materialCost.toFixed(2)),
    deliveryFee: parseFloat(deliveryFee.toFixed(2)),
    totalCost: parseFloat(totalCost.toFixed(2)),
  };
}
