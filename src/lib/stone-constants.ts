/**
 * Constants and presets for Stone / Rock / Aggregate Calculator (Tool #13).
 * Strictly client-side pure data.
 * All figures derived from standard bulk aggregate quarry scale weights (2026-11).
 */

export const LAST_VERIFIED = '2026-11';

export interface StonePreset {
  id: string;
  name: string;
  shortLabel: string;
  tonsPerYd3: number; // base density rating
  densityLbFt3: number; // derived: tonsPerYd3 * 2000 / 27
  typicalRange: string;
  typicalSize: string;
  commonUses: string;
}

export const STONE_PRESETS: Record<string, StonePreset> = {
  crushedStone57: {
    id: 'crushedStone57',
    name: 'Crushed Stone #57 (Open-graded 1/2" to 1")',
    shortLabel: '#57 Crushed Stone',
    tonsPerYd3: 1.40,
    densityLbFt3: parseFloat(((1.40 * 2000) / 27).toFixed(2)), // ~103.70 lb/cu ft
    typicalRange: '1.35 – 1.50 t/yd³',
    typicalSize: '1/2" – 1" angular',
    commonUses: 'Driveways, French drains, concrete aggregate, sub-bases',
  },
  crusherRun: {
    id: 'crusherRun',
    name: 'Crusher Run / Dense-Graded Base (DGA / ABC)',
    shortLabel: 'Crusher Run (Dense Base)',
    tonsPerYd3: 1.50,
    densityLbFt3: parseFloat(((1.50 * 2000) / 27).toFixed(2)), // ~111.11 lb/cu ft
    typicalRange: '1.40 – 1.70 t/yd³',
    typicalSize: '3/4" down to stone dust',
    commonUses: 'Compacted driveway base, paver foundations, road base',
  },
  riverRock: {
    id: 'riverRock',
    name: 'River Rock / River Stone (1" to 3" smooth)',
    shortLabel: 'River Rock / Stone',
    tonsPerYd3: 1.35,
    densityLbFt3: parseFloat(((1.35 * 2000) / 27).toFixed(2)), // 100.00 lb/cu ft
    typicalRange: '1.10 – 1.50 t/yd³',
    typicalSize: '1" – 3" smooth rounded',
    commonUses: 'Landscape beds, dry creek beds, decorative garden borders',
  },
  peaGravel: {
    id: 'peaGravel',
    name: 'Pea Gravel / Pea Rock (3/8" smooth pebbles)',
    shortLabel: 'Pea Gravel',
    tonsPerYd3: 1.40,
    densityLbFt3: parseFloat(((1.40 * 2000) / 27).toFixed(2)), // ~103.70 lb/cu ft
    typicalRange: '1.20 – 1.45 t/yd³',
    typicalSize: '1/4" – 1/2" smooth pebbles',
    commonUses: 'Walkways, patios, dog runs, play areas, decorative cover',
  },
  crushedGranite: {
    id: 'crushedGranite',
    name: 'Crushed Granite / Trap Rock',
    shortLabel: 'Crushed Granite / Trap',
    tonsPerYd3: 1.42,
    densityLbFt3: parseFloat(((1.42 * 2000) / 27).toFixed(2)), // ~105.19 lb/cu ft
    typicalRange: '1.38 – 1.55 t/yd³',
    typicalSize: '3/4" – 1.5" dense angular',
    commonUses: 'Heavy-duty driveway surfaces, commercial parking, rail ballast',
  },
  decomposedGranite: {
    id: 'decomposedGranite',
    name: 'Decomposed Granite (DG)',
    shortLabel: 'Decomposed Granite (DG)',
    tonsPerYd3: 1.48,
    densityLbFt3: parseFloat(((1.48 * 2000) / 27).toFixed(2)), // ~109.63 lb/cu ft
    typicalRange: '1.40 – 1.60 t/yd³',
    typicalSize: '3/8" down to fine grit',
    commonUses: 'Rustic paths, patio spaces, xeriscaping, bocce ball courts',
  },
  ripRap: {
    id: 'ripRap',
    name: 'Heavy Rip Rap / Quarry Stone (4" to 12"+)',
    shortLabel: 'Rip Rap (Erosion Stone)',
    tonsPerYd3: 1.55,
    densityLbFt3: parseFloat(((1.55 * 2000) / 27).toFixed(2)), // ~114.81 lb/cu ft
    typicalRange: '1.45 – 1.75 t/yd³',
    typicalSize: '4" – 12"+ heavy broken stone',
    commonUses: 'Steep slope erosion control, drainage outfalls, culverts',
  },
  lavaRock: {
    id: 'lavaRock',
    name: 'Lava Rock / Scoria (Lightweight Volcanic)',
    shortLabel: 'Lava Rock (Volcanic)',
    tonsPerYd3: 0.61,
    densityLbFt3: parseFloat(((0.61 * 2000) / 27).toFixed(2)), // ~45.19 lb/cu ft
    typicalRange: '0.60 – 0.90 t/yd³',
    typicalSize: '1/2" – 1.5" porous red/black',
    commonUses: 'Lightweight garden mulch, fire pits, gas barbecue beds',
  },
  custom: {
    id: 'custom',
    name: 'Custom Density Input',
    shortLabel: 'Custom Density',
    tonsPerYd3: 1.40,
    densityLbFt3: 103.7,
    typicalRange: '20 – 200 lb/cu ft',
    typicalSize: 'Custom specification',
    commonUses: 'Locally quarried rock, regional crushed stone',
  },
};

export interface StoneMaterialRow {
  id: string;
  name: string;
  typicalSize: string;
  tonsPerCuYard: number;
  densityLbsPerCuFt: number;
  coveragePerTonSqFtAt2In: number;
  typicalUse: string;
}

export const STONE_MATERIALS: StoneMaterialRow[] = [
  {
    id: 'crushedStone57',
    name: '#57 Crushed Limestone',
    typicalSize: '1/2" to 1" angular stone',
    tonsPerCuYard: 1.40,
    densityLbsPerCuFt: 95,
    coveragePerTonSqFtAt2In: 115,
    typicalUse: 'Driveway base, French drains, concrete aggregate',
  },
  {
    id: 'crusherRun',
    name: 'Crusher Run / Dense Base',
    typicalSize: '3/4" down to stone dust',
    tonsPerCuYard: 1.50,
    densityLbsPerCuFt: 110,
    coveragePerTonSqFtAt2In: 100,
    typicalUse: 'Compacted driveway base, paver foundations',
  },
  {
    id: 'riverRock',
    name: 'River Rock (Smooth)',
    typicalSize: '1" to 3" rounded cobble',
    tonsPerCuYard: 1.35,
    densityLbsPerCuFt: 100,
    coveragePerTonSqFtAt2In: 110,
    typicalUse: 'Decorative landscape beds, dry riverbeds',
  },
  {
    id: 'peaGravel',
    name: 'Pea Rock / Pea Gravel',
    typicalSize: '3/8" smooth pebbles',
    tonsPerCuYard: 1.40,
    densityLbsPerCuFt: 105,
    coveragePerTonSqFtAt2In: 100,
    typicalUse: 'Walkways, patios, dog runs, playgrounds',
  },
  {
    id: 'crushedGranite',
    name: 'Crushed Granite / Trap Rock',
    typicalSize: '3/4" angular durable rock',
    tonsPerCuYard: 1.42,
    densityLbsPerCuFt: 105,
    coveragePerTonSqFtAt2In: 100,
    typicalUse: 'Heavy-duty driveways, commercial foundations',
  },
  {
    id: 'decomposedGranite',
    name: 'Decomposed Granite (DG)',
    typicalSize: 'Fine granite with natural fines',
    tonsPerCuYard: 1.48,
    densityLbsPerCuFt: 110,
    coveragePerTonSqFtAt2In: 95,
    typicalUse: 'Pathways, bocce ball courts, xeriscaping',
  },
  {
    id: 'ripRap',
    name: 'Heavy Rip Rap',
    typicalSize: '4" to 8"+ massive stone',
    tonsPerCuYard: 1.55,
    densityLbsPerCuFt: 115,
    coveragePerTonSqFtAt2In: 80,
    typicalUse: 'Shoreline erosion control, culverts, steep slopes',
  },
  {
    id: 'lavaRock',
    name: 'Volcanic Lava Rock',
    typicalSize: 'Porous, lightweight pumice',
    tonsPerCuYard: 0.61,
    densityLbsPerCuFt: 45,
    coveragePerTonSqFtAt2In: 220,
    typicalUse: 'Lightweight planter mulch, gas fire pits',
  },
];

export interface UseCaseChip {
  id: string;
  name: string;
  presetId: string;
  depthInches: number;
  wastePercent: number;
  description: string;
}

export const USE_CASE_CHIPS: UseCaseChip[] = [
  {
    id: 'decorative-bed',
    name: 'Decorative Bed',
    presetId: 'riverRock',
    depthInches: 3,
    wastePercent: 5,
    description: '3" river rock layer over landscape fabric (5% waste)',
  },
  {
    id: 'walkway-patio',
    name: 'Walkway / Patio',
    presetId: 'peaGravel',
    depthInches: 2,
    wastePercent: 5,
    description: '2" pea gravel walking surface (5% waste)',
  },
  {
    id: 'driveway',
    name: 'Driveway',
    presetId: 'crusherRun',
    depthInches: 4,
    wastePercent: 10,
    description: '4" compacted crusher run base (10% waste & compaction)',
  },
  {
    id: 'french-drain',
    name: 'French Drain / Trench',
    presetId: 'crushedStone57',
    depthInches: 12,
    wastePercent: 5,
    description: '12" washed #57 stone surrounding drainage pipe (5% waste)',
  },
  {
    id: 'shed-paver-base',
    name: 'Shed / Paver Base',
    presetId: 'crushedStone57',
    depthInches: 4,
    wastePercent: 10,
    description: '4" open #57 gravel sub-base for shed or patio (10% waste)',
  },
];

export interface WastePillOption {
  id: string;
  name: string;
  wastePercent: number;
  description: string;
}

export const WASTE_PILLS: WastePillOption[] = [
  { id: 'exact', name: '0% Exact', wastePercent: 0, description: 'Net geometric volume with zero extra allowance' },
  { id: 'standard', name: '5% Standard Bed', wastePercent: 5, description: 'Clean rectangular landscape beds on level grade' },
  { id: 'driveway', name: '10% Driveways / Settling', wastePercent: 10, description: 'Driveways, pathways & sub-base compaction (Recommended default)' },
  { id: 'slopes', name: '15% Slopes / Uneven', wastePercent: 15, description: 'Rough excavated dirt, slopes, and irregular ground' },
  { id: 'custom', name: 'Custom %', wastePercent: 10, description: 'Specify custom allowance between 0% and 30%' },
];

export type BagSizeBasis = '50lb' | '40lb' | '0.5cuft' | '1cuft';

export interface BagSizeOption {
  id: BagSizeBasis;
  name: string;
  weightLb?: number;
  volumeCuFt?: number;
}

export const BAG_SIZE_OPTIONS: BagSizeOption[] = [
  { id: '50lb', name: '50 lb Bag (Most Common Retail)', weightLb: 50 },
  { id: '40lb', name: '40 lb Bag', weightLb: 40 },
  { id: '0.5cuft', name: '0.5 Cu Ft Bag', volumeCuFt: 0.5 },
  { id: '1cuft', name: '1.0 Cu Ft Bag', volumeCuFt: 1.0 },
];

