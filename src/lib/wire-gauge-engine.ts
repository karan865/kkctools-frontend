/**
 * Wire Gauge Calculator engine (Batch 2, Tier 1 #8). SAFETY-SENSITIVE — every number here is documented.
 *
 * Sizing = the larger of two checks:
 *   1. Voltage drop: DC / single-phase VD = 2 × I × R × L ; three-phase VD = √3 × I × R × L  (L one way, R per length)
 *   2. Ampacity (AWG only): NEC Table 310.16 at the insulation column × ambient correction (Table 310.15(B)(1))
 *      × bundling adjustment (Table 310.15(C)(1)), never more than the terminal-temperature column (110.14(C)),
 *      with the 125 % continuous-load factor and the small-conductor limits of 240.4(D).
 *
 * Resistance:
 *   AWG / kcmil — from geometry (ASTM B258 gauge formula) and resistivity at 75 °C (the NEC Chapter 9 Table 8 basis):
 *     copper 1.7241 µΩ·cm at 20 °C (100 % IACS, IEC 60028), α = 0.00393 /°C
 *     aluminium 2.8264 µΩ·cm at 20 °C (61 % IACS), α = 0.00403 /°C
 *     × 1.02 for stranding (Table 8 stranded/solid ratio) → 12 AWG Cu ≈ 1.97 Ω/1000 ft vs 1.98 in Table 8.
 *   mm² — IEC 60228 class 2 maximum DC resistance at 20 °C, corrected to 70 °C (PVC conductor temperature).
 *
 * Where published reproductions of Table 310.16 differed (Cu 3 AWG 90 °C; Al 300 kcmil), the LOWER value is used.
 * No reactance is included (fine for small conductors; large AC feeders need an engineer).
 *
 * Pure functions, no network.
 */

export type System = 'dc' | 'ac1' | 'ac3';
export type Metal = 'cu' | 'al';
export type TempCol = 60 | 75 | 90;

export const M_PER_FT = 0.3048;
const RHO20 = { cu: 1.7241e-8, al: 2.8264e-8 } as const; // Ω·m
const ALPHA = { cu: 0.00393, al: 0.00403 } as const;
const STRANDING = 1.02;
const MM2_PER_KCMIL = 0.506707479;

/** AWG gauge → diameter in inches. "0000" = −3 … "0" = 0. */
export function awgDiameterIn(n: number): number {
  return 0.005 * Math.pow(92, (36 - n) / 39);
}
export const awgAreaMm2 = (n: number) => Math.PI / 4 * (awgDiameterIn(n) * 25.4) ** 2;
export const awgName = (n: number) => (n > 0 ? `${n} AWG` : n === 0 ? '1/0 AWG' : `${1 - n}/0 AWG`);

export interface Conductor {
  id: string;
  label: string;
  system: 'awg' | 'mm2';
  areaMm2: number;
  amp?: { cu: [number, number, number]; al: [number, number, number] | null }; // NEC 310.16, 60/75/90 °C
  iec20?: { cu: number; al: number | null }; // Ω/km at 20 °C, IEC 60228 class 2
  smallLimit?: { cu?: number; al?: number }; // NEC 240.4(D) max overcurrent device
}

const awg = (n: number, cu: [number, number, number], al: [number, number, number] | null, smallLimit?: Conductor['smallLimit']): Conductor => ({
  id: `awg${n}`,
  label: awgName(n),
  system: 'awg',
  areaMm2: awgAreaMm2(n),
  amp: { cu, al },
  smallLimit,
});
const kcmil = (k: number, cu: [number, number, number], al: [number, number, number]): Conductor => ({
  id: `kcmil${k}`,
  label: `${k} kcmil`,
  system: 'awg',
  areaMm2: k * MM2_PER_KCMIL,
  amp: { cu, al },
});

/** AWG / kcmil sizes with NEC Table 310.16 ampacities (≤ 3 current-carrying conductors, 30 °C ambient). */
export const AWG_SIZES: Conductor[] = [
  awg(14, [15, 20, 25], null, { cu: 15 }),
  awg(12, [20, 25, 30], [15, 20, 25], { cu: 20, al: 15 }),
  awg(10, [30, 35, 40], [25, 30, 35], { cu: 30, al: 25 }),
  awg(8, [40, 50, 55], [30, 40, 45]),
  awg(6, [55, 65, 75], [40, 50, 55]),
  awg(4, [70, 85, 95], [55, 65, 75]),
  awg(3, [85, 100, 110], [65, 75, 85]),
  awg(2, [95, 115, 130], [75, 90, 100]),
  awg(1, [110, 130, 145], [85, 100, 115]),
  awg(0, [125, 150, 170], [100, 120, 135]),
  awg(-1, [145, 175, 195], [115, 135, 150]),
  awg(-2, [165, 200, 225], [130, 155, 175]),
  awg(-3, [195, 230, 260], [150, 180, 205]),
  kcmil(250, [215, 255, 290], [170, 205, 230]),
  kcmil(300, [240, 285, 320], [190, 225, 255]),
  kcmil(350, [260, 310, 350], [210, 250, 280]),
  kcmil(400, [280, 335, 380], [225, 270, 305]),
  kcmil(500, [320, 380, 430], [260, 310, 350]),
];

/** IEC 60228 metric sizes, class 2 max DC resistance at 20 °C (Ω/km). Aluminium starts at 10 mm². */
export const MM2_SIZES: Conductor[] = (
  [
    [1.5, 12.1, null], [2.5, 7.41, null], [4, 4.61, null], [6, 3.08, null], [10, 1.83, 3.08], [16, 1.15, 1.91], [25, 0.727, 1.2], [35, 0.524, 0.868],
    [50, 0.387, 0.641], [70, 0.268, 0.443], [95, 0.193, 0.32], [120, 0.153, 0.253], [150, 0.124, 0.206], [185, 0.0991, 0.164], [240, 0.0754, 0.125], [300, 0.0601, 0.1],
  ] as [number, number, number | null][]
).map(([a, cu, al]) => ({ id: `mm${a}`, label: `${a} mm²`, system: 'mm2' as const, areaMm2: a, iec20: { cu, al } }));

export const conductorById = (id: string) => [...AWG_SIZES, ...MM2_SIZES].find((c) => c.id === id);
export const METRIC_TEMP_C = 70;
export const AWG_TEMP_C = 75;

/** Resistance in Ω per metre of one conductor (null if the size/metal combination has no data). */
export function resistancePerM(c: Conductor, metal: Metal): number | null {
  if (c.system === 'mm2') {
    const r20 = c.iec20?.[metal];
    if (r20 === null || r20 === undefined) return null;
    return (r20 / 1000) * (1 + ALPHA[metal] * (METRIC_TEMP_C - 20));
  }
  if (metal === 'al' && !c.amp?.al) return null;
  const rho = RHO20[metal] * (1 + ALPHA[metal] * (AWG_TEMP_C - 20));
  return (rho / (c.areaMm2 * 1e-6)) * STRANDING;
}

/** Solid-conductor resistance at 20 °C (lookup tables). */
export function resistance20PerM(areaMm2: number, metal: Metal): number {
  return RHO20[metal] / (areaMm2 * 1e-6);
}

// ---------- load ----------
export function currentFromPower(watts: number, volts: number, system: System, powerFactor = 1): number {
  if (!(watts > 0) || !(volts > 0)) return 0;
  const pf = system === 'dc' ? 1 : Math.min(1, Math.max(0.1, powerFactor));
  return system === 'ac3' ? watts / (Math.sqrt(3) * volts * pf) : watts / (volts * pf);
}

export function voltageDrop(amps: number, ohmPerM: number, oneWayM: number, system: System): number {
  const k = system === 'ac3' ? Math.sqrt(3) : 2;
  return k * Math.max(0, amps) * Math.max(0, ohmPerM) * Math.max(0, oneWayM);
}

// ---------- ampacity ----------
const AMBIENT_ROWS: { maxC: number; f: [number | null, number | null, number | null] }[] = [
  { maxC: 10, f: [1.29, 1.2, 1.15] },
  { maxC: 15, f: [1.22, 1.15, 1.12] },
  { maxC: 20, f: [1.15, 1.11, 1.08] },
  { maxC: 25, f: [1.08, 1.05, 1.04] },
  { maxC: 30, f: [1, 1, 1] },
  { maxC: 35, f: [0.91, 0.94, 0.96] },
  { maxC: 40, f: [0.82, 0.88, 0.91] },
  { maxC: 45, f: [0.71, 0.82, 0.87] },
  { maxC: 50, f: [0.58, 0.75, 0.82] },
  { maxC: 55, f: [0.41, 0.67, 0.76] },
  { maxC: 60, f: [null, 0.58, 0.71] },
  { maxC: 70, f: [null, 0.35, 0.58] },
  { maxC: 80, f: [null, null, 0.41] },
];
const colIndex = (t: TempCol) => (t === 60 ? 0 : t === 75 ? 1 : 2);

/** NEC Table 310.15(B)(1) factor (30 °C base); 0 when the insulation can't be used at that ambient. */
export function ambientFactor(ambientC: number, insulation: TempCol): number {
  const row = AMBIENT_ROWS.find((r) => Math.ceil(ambientC) <= r.maxC);
  if (!row) return 0;
  return row.f[colIndex(insulation)] ?? 0;
}

/** NEC Table 310.15(C)(1) factor for current-carrying conductors in a raceway or cable. */
export function bundleFactor(conductors: number): number {
  const n = Math.max(1, Math.floor(conductors));
  if (n <= 3) return 1;
  if (n <= 6) return 0.8;
  if (n <= 9) return 0.7;
  if (n <= 20) return 0.5;
  if (n <= 30) return 0.45;
  if (n <= 40) return 0.4;
  return 0.35;
}

export interface AmpacityInput {
  metal: Metal;
  insulation: TempCol;
  terminal: 60 | 75;
  ambientC: number;
  conductors: number;
}

/** Allowable ampacity after correction, capped by the terminal column. null = size not listed for that metal. */
export function allowableAmpacity(c: Conductor, i: AmpacityInput): number | null {
  const row = c.amp?.[i.metal];
  if (!row) return null;
  const corrected = row[colIndex(i.insulation)] * ambientFactor(i.ambientC, i.insulation) * bundleFactor(i.conductors);
  const terminalCap = row[colIndex(Math.min(i.insulation, i.terminal) as TempCol)];
  return Math.min(corrected, terminalCap);
}

/** Largest overcurrent device allowed for this conductor (240.4(D) for 14–10 AWG, otherwise the ampacity). */
export function maxBreaker(c: Conductor, metal: Metal, allowable: number): number {
  const lim = c.smallLimit?.[metal];
  return lim !== undefined ? Math.min(lim, allowable) : allowable;
}

export const STANDARD_BREAKERS = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200, 225, 250, 300, 350, 400, 450, 500];

// ---------- sizing ----------
export interface SizeInput extends AmpacityInput {
  sizeSystem: 'awg' | 'mm2';
  system: System;
  volts: number;
  amps: number;
  oneWayM: number;
  maxDropPct: number;
  continuous: boolean;
}

export interface SizeRow {
  c: Conductor;
  dropV: number;
  dropPct: number;
  allowable: number | null;
  okDrop: boolean;
  okAmp: boolean;
  maxBreaker: number | null;
}

export interface SizeResult {
  rows: SizeRow[];
  requiredAmps: number;
  byDrop: Conductor | null;
  byAmpacity: Conductor | null;
  chosen: Conductor | null;
  controls: 'drop' | 'ampacity' | 'both' | null;
  breaker: number | null;
  chosenRow: SizeRow | null;
}

export function sizeWire(i: SizeInput): SizeResult {
  const list = i.sizeSystem === 'awg' ? AWG_SIZES : MM2_SIZES;
  const requiredAmps = Math.max(0, i.amps) * (i.continuous ? 1.25 : 1);
  const rows: SizeRow[] = [];
  for (const c of list) {
    const r = resistancePerM(c, i.metal);
    if (r === null) continue;
    const dropV = voltageDrop(i.amps, r, i.oneWayM, i.system);
    const dropPct = i.volts > 0 ? (dropV / i.volts) * 100 : Infinity;
    const allowable = i.sizeSystem === 'awg' ? allowableAmpacity(c, i) : null;
    const mb = allowable !== null ? maxBreaker(c, i.metal, allowable) : null;
    rows.push({
      c,
      dropV,
      dropPct,
      allowable,
      okDrop: dropPct <= i.maxDropPct + 1e-9,
      // ampacity must cover the load and leave room for a standard breaker at or above it
      okAmp: i.sizeSystem === 'mm2' ? true : allowable !== null && allowable >= requiredAmps && STANDARD_BREAKERS.some((b) => b >= requiredAmps && b <= (mb ?? 0)),
      maxBreaker: mb,
    });
  }
  const byDropRow = rows.find((r) => r.okDrop) || null;
  const byAmpRow = i.sizeSystem === 'awg' ? rows.find((r) => r.okAmp) || null : null;
  const idx = (r: SizeRow | null) => (r ? rows.indexOf(r) : -1);
  let chosenRow: SizeRow | null = null;
  if (byDropRow && (i.sizeSystem === 'mm2' || byAmpRow)) chosenRow = rows[Math.max(idx(byDropRow), idx(byAmpRow))];
  const controls: SizeResult['controls'] = !chosenRow
    ? null
    : i.sizeSystem === 'mm2'
      ? 'drop'
      : idx(byDropRow) === idx(byAmpRow)
        ? 'both'
        : idx(byDropRow) > idx(byAmpRow)
          ? 'drop'
          : 'ampacity';
  const breaker =
    chosenRow && chosenRow.maxBreaker !== null ? STANDARD_BREAKERS.find((b) => b >= requiredAmps && b <= (chosenRow!.maxBreaker as number)) ?? null : null;
  return {
    rows,
    requiredAmps,
    byDrop: byDropRow?.c ?? null,
    byAmpacity: byAmpRow?.c ?? null,
    chosen: chosenRow?.c ?? null,
    controls,
    breaker,
    chosenRow,
  };
}

/** Longest one-way run (m) a conductor can carry `amps` within the drop limit. */
export function maxRunM(c: Conductor, metal: Metal, amps: number, volts: number, system: System, maxDropPct: number): number {
  const r = resistancePerM(c, metal);
  if (r === null || !(amps > 0)) return 0;
  const k = system === 'ac3' ? Math.sqrt(3) : 2;
  return ((maxDropPct / 100) * volts) / (k * amps * r);
}

/** Smallest metric size with at least the area of a given AWG conductor. */
export function nearestMetricUp(areaMm2: number): Conductor | null {
  return MM2_SIZES.find((m) => m.areaMm2 >= areaMm2 - 1e-9) || null;
}

/** Gauge lookup values for AWG n (−3 = 4/0 … 40). */
export function gaugeLookup(n: number) {
  const dIn = awgDiameterIn(n);
  const areaMm2 = awgAreaMm2(n);
  const cuOhmM = resistance20PerM(areaMm2, 'cu');
  const alOhmM = resistance20PerM(areaMm2, 'al');
  const cuKgPerKm = areaMm2 * 8.89; // copper density 8.89 g/cm³ → kg/km
  return {
    n,
    name: awgName(n),
    dIn,
    dMm: dIn * 25.4,
    areaMm2,
    kcmil: areaMm2 / MM2_PER_KCMIL,
    cuOhmPerKft: cuOhmM * 304.8,
    cuOhmPerKm: cuOhmM * 1000,
    alOhmPerKft: alOhmM * 304.8,
    alOhmPerKm: alOhmM * 1000,
    cuLbPerKft: (cuKgPerKm * 0.3048) / 0.45359237,
    cuKgPerKm,
  };
}
