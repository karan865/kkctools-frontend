/**
 * Constants and presets for Tile Calculator (Tool #11).
 * All constants verified against industry standard manufacturer yields & TCA guidelines (2026-11).
 */

export const LAST_VERIFIED = '2026-11';

export interface TilePreset {
  id: string;
  name: string;
  shortLabel: string;
  lengthInches: number;
  widthInches: number;
  thicknessInches: number;
  defaultTilesPerBox: number;
  description: string;
  isMosaic?: boolean;
  pieceLengthInches?: number;
  pieceWidthInches?: number;
}

export const TILE_PRESETS: Record<string, TilePreset> = {
  tile12x12: {
    id: 'tile12x12',
    name: '12" × 12" Standard Floor Tile',
    shortLabel: '12" × 12"',
    lengthInches: 12,
    widthInches: 12,
    thicknessInches: 0.375, // 3/8"
    defaultTilesPerBox: 10,
    description: '1.00 sq ft per tile — Standard bathroom & utility floors',
  },
  tile12x24: {
    id: 'tile12x24',
    name: '12" × 24" Large Format Tile',
    shortLabel: '12" × 24"',
    lengthInches: 24,
    widthInches: 12,
    thicknessInches: 0.375, // 3/8"
    defaultTilesPerBox: 8,
    description: '2.00 sq ft per tile — Modern open floors & shower walls',
  },
  tile6x24: {
    id: 'tile6x24',
    name: '6" × 24" Wood-Look Plank',
    shortLabel: '6" × 24"',
    lengthInches: 24,
    widthInches: 6,
    thicknessInches: 0.375, // 3/8"
    defaultTilesPerBox: 10,
    description: '1.00 sq ft per tile — Kitchens, basements & living rooms',
  },
  subway3x6: {
    id: 'subway3x6',
    name: '3" × 6" Classic Subway Tile',
    shortLabel: '3" × 6"',
    lengthInches: 6,
    widthInches: 3,
    thicknessInches: 0.3125, // 5/16"
    defaultTilesPerBox: 100,
    description: '0.125 sq ft per tile (8 tiles/sq ft) — Backsplashes & tub surrounds',
  },
  tile4x12: {
    id: 'tile4x12',
    name: '4" × 12" Modern Subway Tile',
    shortLabel: '4" × 12"',
    lengthInches: 12,
    widthInches: 4,
    thicknessInches: 0.3125, // 5/16"
    defaultTilesPerBox: 30,
    description: '0.333 sq ft per tile (3 tiles/sq ft) — Contemporary shower walls',
  },
  tile4x4: {
    id: 'tile4x4',
    name: '4" × 4" Square Wall Accent',
    shortLabel: '4" × 4"',
    lengthInches: 4,
    widthInches: 4,
    thicknessInches: 0.3125, // 5/16"
    defaultTilesPerBox: 90,
    description: '0.111 sq ft per tile (9 tiles/sq ft) — Retro walls & accent borders',
  },
  tile24x24: {
    id: 'tile24x24',
    name: '24" × 24" Extra-Large Format',
    shortLabel: '24" × 24"',
    lengthInches: 24,
    widthInches: 24,
    thicknessInches: 0.375, // 3/8"
    defaultTilesPerBox: 4,
    description: '4.00 sq ft per tile — Great rooms & commercial foyers',
  },
  tile6x6: {
    id: 'tile6x6',
    name: '6" × 6" Square Floor / Wall',
    shortLabel: '6" × 6"',
    lengthInches: 6,
    widthInches: 6,
    thicknessInches: 0.375, // 3/8"
    defaultTilesPerBox: 40,
    description: '0.25 sq ft per tile (4 tiles/sq ft) — Laundry, entryways & mudrooms',
  },
  mosaic12x12: {
    id: 'mosaic12x12',
    name: '12" × 12" Mosaic Sheet (2" pieces)',
    shortLabel: '12" × 12" Mosaic',
    lengthInches: 12,
    widthInches: 12,
    thicknessInches: 0.25, // 1/4"
    defaultTilesPerBox: 10,
    description: '1.00 sq ft per sheet — Shower pans, niches & backsplashes',
    isMosaic: true,
    pieceLengthInches: 2,
    pieceWidthInches: 2,
  },
  custom: {
    id: 'custom',
    name: 'Custom Dimensions',
    shortLabel: 'Custom',
    lengthInches: 12,
    widthInches: 12,
    thicknessInches: 0.375, // default 3/8"
    defaultTilesPerBox: 10,
    description: 'Custom tile dimensions & packaging',
  },
};

export interface GroutJointOption {
  value: number;
  label: string;
}

export const GROUT_JOINT_OPTIONS: GroutJointOption[] = [
  { value: 0.0625, label: '1/16" (1.6 mm) – Rectified tile' },
  { value: 0.125, label: '1/8" (3.2 mm) – Standard floor/wall' },
  { value: 0.1875, label: '3/16" (4.8 mm) – Textured/rustic tile' },
  { value: 0.25, label: '1/4" (6.4 mm) – Handmade/saltillo' },
  { value: 0.375, label: '3/8" (9.5 mm) – Wide quarry tile' },
];

export interface PatternPreset {
  id: string;
  name: string;
  wastePercent: number;
  description: string;
}

export const PATTERN_PRESETS: PatternPreset[] = [
  {
    id: 'grid',
    name: 'Grid (Straight Stack)',
    wastePercent: 10,
    description: 'Minimal perimeter cuts, recommended 10% waste',
  },
  {
    id: 'running-bond',
    name: 'Running Bond (Offset 1/3 or 1/2)',
    wastePercent: 12,
    description: 'Staggered brick style, recommended 12% waste',
  },
  {
    id: 'diagonal',
    name: 'Diagonal (45° Diamond)',
    wastePercent: 15,
    description: '45-degree angle cuts on every wall, 15% waste',
  },
  {
    id: 'herringbone',
    name: 'Herringbone / Chevron',
    wastePercent: 20,
    description: 'Complex 45° interlock, high cutoff rate, 20% waste',
  },
  {
    id: 'custom',
    name: 'Custom %',
    wastePercent: 10,
    description: 'Specify 0% to 25% custom waste allowance',
  },
];

export interface TileMaterialOption {
  id: string;
  name: string;
  defaultPricePerSqFt: number;
}

export const TILE_MATERIAL_OPTIONS: TileMaterialOption[] = [
  { id: 'ceramic', name: 'Ceramic ($3.00/sq ft)', defaultPricePerSqFt: 3.0 },
  { id: 'porcelain', name: 'Porcelain ($5.00/sq ft)', defaultPricePerSqFt: 5.0 },
  { id: 'natural-stone', name: 'Natural Stone ($12.00/sq ft)', defaultPricePerSqFt: 12.0 },
  { id: 'custom', name: 'Custom Price', defaultPricePerSqFt: 3.0 },
];

export const DEFAULT_PRICES = {
  thinset50lbBag: 28,
  grout25lbBag: 22,
  toolsAllowance: 85,
  proLaborRateLow: 5.0,
  proLaborRateHigh: 15.0,
  proLaborDiagonalSurge: 0.2, // +20% for diagonal / herringbone
};

