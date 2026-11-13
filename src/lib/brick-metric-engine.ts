/**
 * Metric brick engine (UK, Europe, Australia / NZ).
 *
 * Pure geometry, no network:
 * - bricks per m² = 1 / ((L + j) × (H + j)), sizes in metres, j = joint thickness
 *   UK standard 215 × 65 mm with 10 mm joints → 1 / (0.225 × 0.075) = 59.26 per m² (the "60 per m²" rule)
 * - half-brick wall (stretcher bond, one leaf) = 1 × that rate; one-brick wall (two leaves) = 2 ×
 * - mortar volume = bricks × joint volume per brick, where one brick carries one bed joint and one
 *   perpend: W × j × (L + j + H)  (net, solid bricks, no frog fill)
 * - bag count only if the user enters the yield printed on their mortar bag (litres of mortar per bag)
 */

export interface MetricBrickPreset {
  id: string;
  name: string;
  region: string;
  lengthMm: number;
  heightMm: number;
  widthMm: number;
  note?: string;
}

export const METRIC_BRICK_PRESETS: Record<string, MetricBrickPreset> = {
  ukStandard: {
    id: 'ukStandard',
    name: 'UK standard (215 × 102.5 × 65 mm)',
    region: 'UK & Ireland',
    lengthMm: 215,
    heightMm: 65,
    widthMm: 102.5,
    note: 'Work size of the UK standard brick (BS EN 771-1). About 60 per m² with 10 mm joints.',
  },
  ukImperial: {
    id: 'ukImperial',
    name: 'UK imperial (220 × 105 × 73 mm)',
    region: 'UK restoration',
    lengthMm: 220,
    heightMm: 73,
    widthMm: 105,
    note: 'Sizes vary by maker; use Custom if yours differs.',
  },
  auStandard: {
    id: 'auStandard',
    name: 'Australian standard (230 × 110 × 76 mm)',
    region: 'Australia & NZ',
    lengthMm: 230,
    heightMm: 76,
    widthMm: 110,
    note: 'About 48.5 per m² with 10 mm joints.',
  },
  deNF: {
    id: 'deNF',
    name: 'Normalformat NF (240 × 115 × 71 mm)',
    region: 'Germany / Europe',
    lengthMm: 240,
    heightMm: 71,
    widthMm: 115,
  },
  deDF: {
    id: 'deDF',
    name: 'Dünnformat DF (240 × 115 × 52 mm)',
    region: 'Germany / Europe',
    lengthMm: 240,
    heightMm: 52,
    widthMm: 115,
  },
};

export interface MetricWall {
  id: string;
  name: string;
  lengthM: number;
  heightM: number;
  quantity: number;
}

export interface MetricOpening {
  id: string;
  name: string;
  widthM: number;
  heightM: number;
  quantity: number;
}

export type MetricWallType = 'half' | 'one';

export interface MetricBrickInput {
  walls: MetricWall[];
  openings?: MetricOpening[];
  presetId: string;
  customLengthMm?: number;
  customHeightMm?: number;
  customWidthMm?: number;
  jointMm: number;
  wallType: MetricWallType;
  wastePercentage: number;
  bricksPerPack?: number;
  mortarBagYieldLitres?: number;
  pricePerBrick?: number;
}

export interface MetricBrickResult {
  grossAreaM2: number;
  openingsAreaM2: number;
  netAreaM2: number;
  isOpeningExceeded: boolean;
  lengthMm: number;
  heightMm: number;
  widthMm: number;
  bricksPerM2Face: number;
  bricksPerM2Wall: number;
  baseBricks: number;
  wasteBricks: number;
  totalBricks: number;
  mortarM3: number;
  mortarLitres: number;
  mortarBags: number | null;
  packsExact: number;
  packsRounded: number;
  totalBrickCost: number | null;
}

const round = (n: number, dp: number) => {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
};

function positive(n: number | undefined): number {
  return typeof n === 'number' && Number.isFinite(n) && n > 0 ? n : 0;
}

export function resolveMetricBrickSize(input: Pick<MetricBrickInput, 'presetId' | 'customLengthMm' | 'customHeightMm' | 'customWidthMm'>) {
  if (input.presetId === 'custom') {
    return {
      lengthMm: positive(input.customLengthMm) || 215,
      heightMm: positive(input.customHeightMm) || 65,
      widthMm: positive(input.customWidthMm) || 102.5,
    };
  }
  const p = METRIC_BRICK_PRESETS[input.presetId] ?? METRIC_BRICK_PRESETS.ukStandard;
  return { lengthMm: p.lengthMm, heightMm: p.heightMm, widthMm: p.widthMm };
}

export function bricksPerSquareMetre(lengthMm: number, heightMm: number, jointMm: number): number {
  const l = (lengthMm + jointMm) / 1000;
  const h = (heightMm + jointMm) / 1000;
  return 1 / (l * h);
}

export function calculateMetricBricks(input: MetricBrickInput): MetricBrickResult {
  const { lengthMm, heightMm, widthMm } = resolveMetricBrickSize(input);
  const jointMm = Math.max(0, input.jointMm || 0);

  const grossAreaM2 = input.walls.reduce(
    (sum, w) => sum + positive(w.lengthM) * positive(w.heightM) * Math.max(0, Math.round(w.quantity || 0)),
    0
  );
  const openingsAreaM2 = (input.openings ?? []).reduce(
    (sum, o) => sum + positive(o.widthM) * positive(o.heightM) * Math.max(0, Math.round(o.quantity || 0)),
    0
  );
  const isOpeningExceeded = openingsAreaM2 > grossAreaM2;
  const netAreaM2 = Math.max(0, grossAreaM2 - openingsAreaM2);

  const leaves = input.wallType === 'one' ? 2 : 1;
  const bricksPerM2Face = bricksPerSquareMetre(lengthMm, heightMm, jointMm);
  const bricksPerM2Wall = bricksPerM2Face * leaves;

  const baseBricks = Math.max(0, Math.ceil(netAreaM2 * bricksPerM2Wall - 1e-9));
  const waste = Math.max(0, input.wastePercentage || 0);
  const totalBricks = Math.max(0, Math.ceil(baseBricks * (1 + waste / 100) - 1e-9));
  const wasteBricks = totalBricks - baseBricks;

  // Joint volume carried by one brick: bed joint (W × j × (L + j)) + perpend (W × j × H), in m³.
  const w = widthMm / 1000;
  const j = jointMm / 1000;
  const jointPerBrickM3 = w * j * ((lengthMm + jointMm) / 1000 + heightMm / 1000);
  // A one-brick wall also has a 10 mm collar joint between the leaves (when j > 0): net area × j.
  const collarM3 = leaves === 2 ? netAreaM2 * j : 0;
  const mortarNetM3 = baseBricks * jointPerBrickM3 + collarM3;
  const mortarM3 = mortarNetM3 * (1 + waste / 100);
  const mortarLitres = mortarM3 * 1000;

  const yieldL = positive(input.mortarBagYieldLitres);
  const mortarBags = yieldL ? Math.ceil(mortarLitres / yieldL - 1e-9) : null;

  const perPack = positive(input.bricksPerPack) || 500;
  const packsExact = totalBricks / perPack;
  const price = positive(input.pricePerBrick);

  return {
    grossAreaM2: round(grossAreaM2, 2),
    openingsAreaM2: round(openingsAreaM2, 2),
    netAreaM2: round(netAreaM2, 2),
    isOpeningExceeded,
    lengthMm,
    heightMm,
    widthMm,
    bricksPerM2Face: round(bricksPerM2Face, 2),
    bricksPerM2Wall: round(bricksPerM2Wall, 2),
    baseBricks,
    wasteBricks,
    totalBricks,
    mortarM3: round(mortarM3, 3),
    mortarLitres: round(mortarLitres, 0),
    mortarBags,
    packsExact: round(packsExact, 2),
    packsRounded: Math.ceil(packsExact - 1e-9),
    totalBrickCost: price ? round(totalBricks * price, 2) : null,
  };
}
