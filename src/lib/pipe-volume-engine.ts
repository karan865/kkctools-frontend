/**
 * Pipe / Tube Volume Calculator engine (Batch 2, Tier 1 #7).
 *
 * One list of runs serves both meanings of "tube volume":
 *   capacity  = liquid inside   = π/4 × ID² × length   (round)   ·  (W − 2t)(H − 2t) × length (rectangular)
 *   material  = the tube wall    = π/4 × (OD² − ID²) × length     ·  (W × H − inner area) × length
 * plus liquid weight, tube weight by material density and time to fill at a flow rate.
 *
 * All lengths are INCHES internally. Pure functions, no network.
 *
 * Pipe sizes:
 *   steel & PVC Schedule 40/80 — ASME B36.10M (PVC per ASTM D1785 shares the OD and walls for these sizes)
 *   copper water tube Types K, L, M — ASTM B88 (OD = nominal + ⅛ in)
 *   PEX tubing, copper tube size, SDR 9 — ASTM F876 (wall = OD ÷ 9, min 0.070 in)
 *   metric PE pipe SDR 11 — EN 12201 / ISO 4427
 */

export const MM_PER_IN = 25.4;
export const IN3_PER_US_GAL = 231; // exact
export const L_PER_IN3 = 0.016387064; // exact (2.54³ / 1000)
export const L_PER_IMP_GAL = 4.54609; // exact
export const IN_PER_M = 1000 / MM_PER_IN;

export interface PipePreset {
  id: string;
  group: string;
  label: string;
  odIn: number;
  wallIn: number;
}

const steel = (sch: string, rows: [string, number, number][]): PipePreset[] =>
  rows.map(([nps, od, wall]) => ({ id: `sch${sch}-${nps}`, group: `Steel / PVC Schedule ${sch}`, label: `${nps}" Sch ${sch}`, odIn: od, wallIn: wall }));
const copper = (type: string, rows: [string, number, number][]): PipePreset[] =>
  rows.map(([size, od, wall]) => ({ id: `cu${type}-${size}`, group: `Copper Type ${type}`, label: `${size}" Type ${type}`, odIn: od, wallIn: wall }));

export const PIPE_PRESETS: PipePreset[] = [
  ...steel('40', [
    ['1/2', 0.84, 0.109], ['3/4', 1.05, 0.113], ['1', 1.315, 0.133], ['1-1/4', 1.66, 0.14], ['1-1/2', 1.9, 0.145], ['2', 2.375, 0.154],
    ['2-1/2', 2.875, 0.203], ['3', 3.5, 0.216], ['4', 4.5, 0.237], ['6', 6.625, 0.28], ['8', 8.625, 0.322], ['10', 10.75, 0.365], ['12', 12.75, 0.406],
  ]),
  ...steel('80', [
    ['1/2', 0.84, 0.147], ['3/4', 1.05, 0.154], ['1', 1.315, 0.179], ['1-1/4', 1.66, 0.191], ['1-1/2', 1.9, 0.2], ['2', 2.375, 0.218],
    ['2-1/2', 2.875, 0.276], ['3', 3.5, 0.3], ['4', 4.5, 0.337], ['6', 6.625, 0.432], ['8', 8.625, 0.5], ['10', 10.75, 0.594], ['12', 12.75, 0.688],
  ]),
  ...copper('K', [['3/8', 0.5, 0.049], ['1/2', 0.625, 0.049], ['3/4', 0.875, 0.065], ['1', 1.125, 0.065], ['1-1/4', 1.375, 0.065], ['1-1/2', 1.625, 0.072], ['2', 2.125, 0.083], ['3', 3.125, 0.109], ['4', 4.125, 0.134]]),
  ...copper('L', [['3/8', 0.5, 0.035], ['1/2', 0.625, 0.04], ['3/4', 0.875, 0.045], ['1', 1.125, 0.05], ['1-1/4', 1.375, 0.055], ['1-1/2', 1.625, 0.06], ['2', 2.125, 0.07], ['3', 3.125, 0.09], ['4', 4.125, 0.114]]),
  ...copper('M', [['3/8', 0.5, 0.025], ['1/2', 0.625, 0.028], ['3/4', 0.875, 0.032], ['1', 1.125, 0.035], ['1-1/4', 1.375, 0.042], ['1-1/2', 1.625, 0.049], ['2', 2.125, 0.058], ['3', 3.125, 0.072], ['4', 4.125, 0.095]]),
  ...(['3/8', '1/2', '3/4', '1'] as const).map((s, k) => {
    const od = [0.5, 0.625, 0.875, 1.125][k];
    return { id: `pex-${s}`, group: 'PEX (CTS, SDR 9)', label: `${s}" PEX`, odIn: od, wallIn: Math.max(0.07, od / 9) };
  }),
  ...([
    [20, 2.0], [25, 2.3], [32, 2.9], [40, 3.7], [50, 4.6], [63, 5.8], [75, 6.8], [90, 8.2], [110, 10.0],
  ] as [number, number][]).map(([od, wall]) => ({ id: `pe-${od}`, group: 'PE pipe SDR 11 (metric)', label: `${od} mm PE`, odIn: od / MM_PER_IN, wallIn: wall / MM_PER_IN })),
];
export const presetById = (id: string) => PIPE_PRESETS.find((p) => p.id === id);
export const PRESET_GROUPS = Array.from(new Set(PIPE_PRESETS.map((p) => p.group)));

export const MATERIALS: { id: string; label: string; kgPerM3: number }[] = [
  { id: 'steel', label: 'Carbon steel', kgPerM3: 7850 },
  { id: 'stainless', label: 'Stainless steel', kgPerM3: 8000 },
  { id: 'copper', label: 'Copper', kgPerM3: 8940 },
  { id: 'aluminium', label: 'Aluminium', kgPerM3: 2700 },
  { id: 'brass', label: 'Brass', kgPerM3: 8500 },
  { id: 'pvc', label: 'PVC', kgPerM3: 1400 },
  { id: 'pe', label: 'Polyethylene (HDPE)', kgPerM3: 950 },
];
export const LIQUIDS: { id: string; label: string; kgPerL: number }[] = [
  { id: 'water', label: 'Water', kgPerL: 1.0 },
  { id: 'seawater', label: 'Seawater', kgPerL: 1.025 },
];

export type RunShape = 'round' | 'rect';
export interface PipeRun {
  id: string;
  shape: RunShape;
  odIn: number; // round: outside diameter (0 = unknown → capacity only)
  idIn: number; // round: inside diameter
  widthIn: number; // rect: outside width
  heightIn: number; // rect: outside height
  wallIn: number; // rect: wall thickness
  lengthIn: number;
  qty: number;
}

export interface RunResult {
  id: string;
  innerAreaIn2: number;
  wallAreaIn2: number;
  capacityIn3: number;
  materialIn3: number;
  valid: boolean;
}

const pos = (n: number) => (isFinite(n) && n > 0 ? n : 0);

export function runAreas(r: PipeRun): { inner: number; wall: number; valid: boolean } {
  if (r.shape === 'rect') {
    const W = pos(r.widthIn), H = pos(r.heightIn), t = pos(r.wallIn);
    const iw = W - 2 * t, ih = H - 2 * t;
    if (W === 0 || H === 0 || iw <= 0 || ih <= 0) return { inner: 0, wall: 0, valid: false };
    return { inner: iw * ih, wall: W * H - iw * ih, valid: true };
  }
  const id = pos(r.idIn), od = pos(r.odIn);
  if (id === 0) return { inner: 0, wall: 0, valid: false };
  if (od > 0 && od <= id) return { inner: 0, wall: 0, valid: false };
  const inner = (Math.PI / 4) * id * id;
  return { inner, wall: od > 0 ? (Math.PI / 4) * (od * od - id * id) : 0, valid: true };
}

export interface PipeInput {
  runs: PipeRun[];
  liquidKgPerL: number;
  materialKgPerM3: number;
  flowLPerMin?: number;
}

export interface PipeResult {
  runs: RunResult[];
  capacityIn3: number;
  usGal: number;
  impGal: number;
  litres: number;
  cubicFt: number;
  cubicIn: number;
  cubicM: number;
  liquidKg: number;
  liquidLb: number;
  materialIn3: number;
  materialKg: number;
  materialLb: number;
  totalLengthIn: number;
  fillMinutes: number | null;
}

export const KG_PER_LB = 0.45359237;

export function calculatePipes(input: PipeInput): PipeResult {
  const runs: RunResult[] = input.runs.map((r) => {
    const a = runAreas(r);
    const len = pos(r.lengthIn) * Math.max(0, Math.floor(r.qty));
    return { id: r.id, innerAreaIn2: a.inner, wallAreaIn2: a.wall, capacityIn3: a.inner * len, materialIn3: a.wall * len, valid: a.valid };
  });
  const capacityIn3 = runs.reduce((s, r) => s + r.capacityIn3, 0);
  const materialIn3 = runs.reduce((s, r) => s + r.materialIn3, 0);
  const litres = capacityIn3 * L_PER_IN3;
  const liquidKg = litres * pos(input.liquidKgPerL);
  const materialKg = materialIn3 * L_PER_IN3 * (pos(input.materialKgPerM3) / 1000);
  const totalLengthIn = input.runs.reduce((s, r) => s + pos(r.lengthIn) * Math.max(0, Math.floor(r.qty)), 0);
  const flow = input.flowLPerMin && input.flowLPerMin > 0 ? input.flowLPerMin : 0;
  return {
    runs,
    capacityIn3,
    usGal: capacityIn3 / IN3_PER_US_GAL,
    impGal: litres / L_PER_IMP_GAL,
    litres,
    cubicFt: capacityIn3 / 1728,
    cubicIn: capacityIn3,
    cubicM: litres / 1000,
    liquidKg,
    liquidLb: liquidKg / KG_PER_LB,
    materialIn3,
    materialKg,
    materialLb: materialKg / KG_PER_LB,
    totalLengthIn,
    fillMinutes: flow > 0 && litres > 0 ? litres / flow : null,
  };
}

/** Capacity per foot (US gal) and per metre (L) for a round inside diameter in inches. */
export function perLength(idIn: number): { galPerFt: number; lPerM: number } {
  const a = (Math.PI / 4) * pos(idIn) ** 2;
  return { galPerFt: (a * 12) / IN3_PER_US_GAL, lPerM: a * IN_PER_M * L_PER_IN3 };
}

/** Tube weight per foot (lb) and per metre (kg) from OD, wall and density. */
export function weightPerLength(odIn: number, wallIn: number, kgPerM3: number): { lbPerFt: number; kgPerM: number } {
  const id = odIn - 2 * wallIn;
  if (!(odIn > 0) || !(id >= 0)) return { lbPerFt: 0, kgPerM: 0 };
  const a = (Math.PI / 4) * (odIn * odIn - id * id);
  const kgPerM = a * IN_PER_M * L_PER_IN3 * (kgPerM3 / 1000);
  return { lbPerFt: (kgPerM * 0.3048) / KG_PER_LB, kgPerM };
}

export const presetId = (p: PipePreset) => p.odIn - 2 * p.wallIn;

export function presetRun(id: string, presetIdValue: string, lengthIn: number, qty = 1): PipeRun {
  const p = presetById(presetIdValue)!;
  return { id, shape: 'round', odIn: p.odIn, idIn: p.odIn - 2 * p.wallIn, widthIn: 0, heightIn: 0, wallIn: p.wallIn, lengthIn, qty };
}
