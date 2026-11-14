/**
 * Cubic Feet ↔ Square Feet Converter engine (Batch 2, Tier 2 #12).
 *
 * Volume and area are different dimensions, so they only convert through a thickness:
 *   area   = volume ÷ depth          (how much ground a volume covers)
 *   volume = area × depth            (how much material an area needs)
 * Everything is worked in feet internally; metric units convert exactly
 * (1 ft = 0.3048 m, NIST SP 811). Pure functions, no network.
 */

export const M_PER_FT = 0.3048;
export const FT2_PER_M2 = 1 / (M_PER_FT * M_PER_FT); // 10.7639…
export const FT3_PER_M3 = 1 / (M_PER_FT * M_PER_FT * M_PER_FT); // 35.3147…
export const FT3_PER_YD3 = 27;
export const L_PER_FT3 = 28.316846592;

export type DepthUnit = 'in' | 'ft' | 'cm' | 'mm' | 'm';
export type VolumeUnit = 'ft3' | 'yd3' | 'm3' | 'L';
export type AreaUnit = 'ft2' | 'm2' | 'yd2';

const DEPTH_TO_FT: Record<DepthUnit, number> = { in: 1 / 12, ft: 1, cm: 0.01 / M_PER_FT, mm: 0.001 / M_PER_FT, m: 1 / M_PER_FT };
const VOLUME_TO_FT3: Record<VolumeUnit, number> = { ft3: 1, yd3: FT3_PER_YD3, m3: FT3_PER_M3, L: 1 / L_PER_FT3 };
const AREA_TO_FT2: Record<AreaUnit, number> = { ft2: 1, m2: FT2_PER_M2, yd2: 9 };

export const depthToFt = (v: number, u: DepthUnit) => (Number.isFinite(v) && v > 0 ? v * DEPTH_TO_FT[u] : 0);
export const volumeToFt3 = (v: number, u: VolumeUnit) => (Number.isFinite(v) && v > 0 ? v * VOLUME_TO_FT3[u] : 0);
export const areaToFt2 = (v: number, u: AreaUnit) => (Number.isFinite(v) && v > 0 ? v * AREA_TO_FT2[u] : 0);
export const ft3To = (ft3: number, u: VolumeUnit) => ft3 / VOLUME_TO_FT3[u];
export const ft2To = (ft2: number, u: AreaUnit) => ft2 / AREA_TO_FT2[u];
export const ftTo = (ft: number, u: DepthUnit) => ft / DEPTH_TO_FT[u];

/** Area covered (ft²) by a volume (ft³) spread to a depth (ft). */
export const coverageFt2 = (volumeFt3: number, depthFt: number) => (depthFt > 0 && volumeFt3 > 0 ? volumeFt3 / depthFt : 0);
/** Volume (ft³) needed to cover an area (ft²) to a depth (ft). */
export const volumeNeededFt3 = (areaFt2: number, depthFt: number) => (depthFt > 0 && areaFt2 > 0 ? areaFt2 * depthFt : 0);

/** Whole bags (rounded up) of a given size to supply a volume. */
export const bagsFor = (volumeFt3: number, bagFt3: number) => (bagFt3 > 0 && volumeFt3 > 0 ? Math.ceil(volumeFt3 / bagFt3 - 1e-9) : 0);

// ---------- presets ----------
export interface Preset {
  id: string;
  label: string;
  depthIn: number;
  note: string;
}
export const PRESETS: Preset[] = [
  { id: 'slab', label: 'Concrete slab', depthIn: 4, note: 'Patios, walkways and shed bases are commonly 4 in thick.' },
  { id: 'mulch', label: 'Mulch bed', depthIn: 3, note: 'University extensions advise about 2–3 in of settled mulch (no more than 3–4 in).' },
  { id: 'topsoil', label: 'Topsoil for a lawn', depthIn: 4, note: 'Penn State Extension: at least 4–6 in of settled topsoil for a new lawn.' },
  { id: 'base', label: 'Paver / gravel base', depthIn: 4, note: 'Walkways and patios are often 4 in of compacted base; driveways more.' },
  { id: 'sand', label: 'Bedding sand', depthIn: 1, note: 'Pavers sit on about 1 in of screeded bedding sand.' },
  { id: 'stone', label: 'Stone mulch', depthIn: 1, note: 'Maryland Extension suggests about a 1 in layer of gravel or stone mulch.' },
];

/** Square feet one cubic foot covers at a depth in inches (12 ÷ depth). */
export const ft2PerFt3AtInches = (depthIn: number) => (depthIn > 0 ? 12 / depthIn : 0);
/** Cubic feet needed per 100 ft² at a depth in inches. */
export const ft3Per100Ft2 = (depthIn: number) => (depthIn > 0 ? (100 * depthIn) / 12 : 0);
