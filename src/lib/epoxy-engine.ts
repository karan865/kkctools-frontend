/**
 * epoxy-engine.ts
 * Pure calculation engine for epoxy resin calculations.
 * Used by:
 * - /epoxy-resin-calculator/
 * - /epoxy-table-calculator/
 * 
 * Exact constants:
 * 1 US gal = 231 in³
 * 1 fl oz = 231/128 = 1.8046875 in³ (exact)
 * 1 in³ = 16.387064 mL
 * 1 L = 1000 mL
 */

export const IN3_PER_US_GAL = 231;
/** Exact: 1 US fl oz = 1/128 US gal = 231/128 in³ = 1.8046875 in³. */
export const IN3_PER_FL_OZ = 231 / 128;
/** Exact: 1 avoirdupois oz = 28.349523125 g. */
const G_PER_OZ = 28.349523125;
export const ML_PER_IN3 = 16.387064;
export const CM3_PER_IN3 = 16.387064;

export type EpoxyShape = 'rectangle' | 'circle' | 'cylinder' | 'box' | 'river' | 'void';

export interface VolumeResult {
  in3: number;
  flOz: number;
  usGal: number;
  ml: number;
  liters: number;
}

export interface MixSplitResult {
  volumeA: VolumeResult;
  volumeB: VolumeResult;
  totalVolume: VolumeResult;
  mode: 'volume' | 'weight';
  weightA_g?: number;
  weightB_g?: number;
  totalWeight_g?: number;
  weightA_oz?: number;
  weightB_oz?: number;
  totalWeight_oz?: number;
}

export interface PourPlanResult {
  poursCount: number;
  depthPerPourInches: number;
  volumePerPour: VolumeResult;
  partAPerPour: VolumeResult;
  partBPerPour: VolumeResult;
}

export interface KitOption {
  name: string;
  volumeIn3: number;
  price?: number;
}

export interface KitPlanItem {
  kit: KitOption;
  count: number;
  totalIn3: number;
  totalPrice?: number;
}

export interface KitPlanResult {
  items: KitPlanItem[];
  totalVolumeIn3: number;
  leftoverIn3: number;
  leftoverFlOz: number;
  totalCost?: number;
}

/** Convert cubic inches to all standard liquid volume units. */
export function in3ToVolumes(in3: number): VolumeResult {
  const safeIn3 = Math.max(0, in3);
  const flOz = safeIn3 / IN3_PER_FL_OZ;
  const usGal = safeIn3 / IN3_PER_US_GAL;
  const ml = safeIn3 * ML_PER_IN3;
  const liters = ml / 1000;
  return {
    in3: safeIn3,
    flOz: flOz === 0 ? 0 : flOz,
    usGal: usGal === 0 ? 0 : usGal,
    ml: ml === 0 ? 0 : ml,
    liters: liters === 0 ? 0 : liters,
  };
}

/** Convert US fluid ounces to cubic inches. */
export function flOzToIn3(flOz: number): number {
  return Math.max(0, flOz) * IN3_PER_FL_OZ;
}

/** Convert US gallons to cubic inches. */
export function usGalToIn3(gal: number): number {
  return Math.max(0, gal) * IN3_PER_US_GAL;
}

/** Convert milliliters to cubic inches. */
export function mlToIn3(ml: number): number {
  return Math.max(0, ml) / ML_PER_IN3;
}

/** Convert liters to cubic inches. */
export function litersToIn3(liters: number): number {
  return mlToIn3(Math.max(0, liters) * 1000);
}

/** Convert cubic centimeters (cm³) to cubic inches. */
export function cm3ToIn3(cm3: number): number {
  return Math.max(0, cm3) / CM3_PER_IN3;
}

/** Volume of a rectangular coat or slab: Length × Width × Thickness (all inches). */
export function rectVolumeIn3(lengthIn: number, widthIn: number, thicknessIn: number): number {
  if (lengthIn <= 0 || widthIn <= 0 || thicknessIn <= 0) return 0;
  return lengthIn * widthIn * thicknessIn;
}

/** Volume of a circle / round table / disc: π × r² × Thickness (inches). */
export function circleVolumeIn3(diameterOrRadiusIn: number, thicknessIn: number, isDiameter = true): number {
  if (diameterOrRadiusIn <= 0 || thicknessIn <= 0) return 0;
  const r = isDiameter ? diameterOrRadiusIn / 2 : diameterOrRadiusIn;
  return Math.PI * r * r * thicknessIn;
}

/** Volume of a cylinder / cylindrical mold: π × r² × Height (inches). */
export function cylinderVolumeIn3(diameterOrRadiusIn: number, heightIn: number, isDiameter = true): number {
  return circleVolumeIn3(diameterOrRadiusIn, heightIn, isDiameter);
}

/** Volume of a rectangular box / deep mold: Length × Width × Height (inches). */
export function boxVolumeIn3(lengthIn: number, widthIn: number, heightIn: number): number {
  return rectVolumeIn3(lengthIn, widthIn, heightIn);
}

/** Calculate arithmetic average of multiple width readings. Returns null if empty. */
export function averageWidth(readings: number[]): number | null {
  const valid = readings.filter((r) => typeof r === 'number' && !isNaN(r) && r > 0);
  if (valid.length === 0) return null;
  const sum = valid.reduce((acc, val) => acc + val, 0);
  return sum / valid.length;
}

/** Volume of a river: Length × Average Width × Depth (all inches). */
export function riverVolumeIn3(lengthIn: number, avgWidthIn: number, depthIn: number): number {
  if (lengthIn <= 0 || avgWidthIn <= 0 || depthIn <= 0) return 0;
  return lengthIn * avgWidthIn * depthIn;
}

export interface RiverSegment {
  lengthIn: number;
  widthsIn: number[];
  depthIn: number;
}

/** Volume of a multi-segment river channel. */
export function riverSegmentsVolumeIn3(segments: RiverSegment[]): number {
  let total = 0;
  for (const seg of segments) {
    const avgW = averageWidth(seg.widthsIn);
    if (avgW && seg.lengthIn > 0 && seg.depthIn > 0) {
      total += seg.lengthIn * avgW * seg.depthIn;
    }
  }
  return total;
}

/**
 * Apply edge drip allowance and waste allowance.
 * Formula per spec: withAllowances = v * (1 + edgePct) * (1 + wastePct)
 */
export function applyAllowances(
  baseIn3: number,
  edgePct: number = 0,
  wastePct: number = 0
): {
  baseIn3: number;
  edgeAllowanceIn3: number;
  subtotalIn3: number;
  wasteIn3: number;
  totalIn3: number;
} {
  const safeBase = Math.max(0, baseIn3);
  const safeEdgePct = Math.max(0, edgePct) / 100;
  const safeWastePct = Math.max(0, wastePct) / 100;

  const edgeAllowanceIn3 = safeBase * safeEdgePct;
  const subtotalIn3 = safeBase + edgeAllowanceIn3;
  const wasteIn3 = subtotalIn3 * safeWastePct;
  const totalIn3 = subtotalIn3 + wasteIn3;

  return {
    baseIn3: safeBase,
    edgeAllowanceIn3,
    subtotalIn3,
    wasteIn3,
    totalIn3,
  };
}

/**
 * Split mixed epoxy into Part A (Resin) and Part B (Hardener).
 * Supports volume ratio (e.g. 1:1, 2:1, 3:1, 4:1) or weight ratio (with optional densities in g/mL).
 */
export function mixSplit(
  totalVolumeIn3: number,
  ratioA: number,
  ratioB: number,
  mode: 'volume' | 'weight' = 'volume',
  densityA_g_ml?: number,
  densityB_g_ml?: number
): MixSplitResult {
  const safeVol = Math.max(0, totalVolumeIn3);
  const safeA = Math.max(0.0001, ratioA);
  const safeB = Math.max(0.0001, ratioB);

  let volA_in3 = 0;
  let volB_in3 = 0;

  if (mode === 'volume' || !densityA_g_ml || !densityB_g_ml) {
    volA_in3 = safeVol * (safeA / (safeA + safeB));
    volB_in3 = safeVol * (safeB / (safeA + safeB));
  } else {
    // Mode is weight with known densities
    // Mass = Volume * Density -> Vol = Mass / Density
    // Let total weight W = Wa + Wb, with Wa = W * (A/(A+B)), Wb = W * (B/(A+B))
    // Total Volume = Va + Vb = Wa/densA + Wb/densB = W * [ A/((A+B)*densA) + B/((A+B)*densB) ]
    // Therefore W = totalVolume_mL / [ A/((A+B)*densA) + B/((A+B)*densB) ]
    const totalMl = safeVol * ML_PER_IN3;
    const factorA = safeA / ((safeA + safeB) * densityA_g_ml);
    const factorB = safeB / ((safeA + safeB) * densityB_g_ml);
    const totalWeight_g = totalMl / (factorA + factorB);

    const weightA_g = totalWeight_g * (safeA / (safeA + safeB));
    const weightB_g = totalWeight_g * (safeB / (safeA + safeB));

    volA_in3 = (weightA_g / densityA_g_ml) / ML_PER_IN3;
    volB_in3 = (weightB_g / densityB_g_ml) / ML_PER_IN3;

    const volARes = in3ToVolumes(volA_in3);
    const volBRes = in3ToVolumes(volB_in3);
    const totalVolRes = in3ToVolumes(safeVol);

    return {
      volumeA: volARes,
      volumeB: volBRes,
      totalVolume: totalVolRes,
      mode: 'weight',
      weightA_g,
      weightB_g,
      totalWeight_g,
      weightA_oz: weightA_g / G_PER_OZ,
      weightB_oz: weightB_g / G_PER_OZ,
      totalWeight_oz: totalWeight_g / G_PER_OZ,
    };
  }

  const volARes = in3ToVolumes(volA_in3);
  const volBRes = in3ToVolumes(volB_in3);
  const totalVolRes = in3ToVolumes(safeVol);

  let weightA_g: number | undefined;
  let weightB_g: number | undefined;
  let totalWeight_g: number | undefined;

  if (densityA_g_ml && densityB_g_ml) {
    weightA_g = volARes.ml * densityA_g_ml;
    weightB_g = volBRes.ml * densityB_g_ml;
    totalWeight_g = weightA_g + weightB_g;
  }

  return {
    volumeA: volARes,
    volumeB: volBRes,
    totalVolume: totalVolRes,
    mode: 'volume',
    weightA_g,
    weightB_g,
    totalWeight_g,
    weightA_oz: weightA_g ? weightA_g / G_PER_OZ : undefined,
    weightB_oz: weightB_g ? weightB_g / G_PER_OZ : undefined,
    totalWeight_oz: totalWeight_g ? totalWeight_g / G_PER_OZ : undefined,
  };
}

/**
 * Plan deep pour layers based on total depth and max layer depth specified on product label.
 * Returns null if maxLayerDepthIn <= 0 or totalDepthIn <= 0.
 */
export function pourPlan(
  totalDepthIn: number,
  maxLayerDepthIn: number,
  totalVolumeIn3: number = 0,
  ratioA = 1,
  ratioB = 1
): PourPlanResult | null {
  if (totalDepthIn <= 0 || maxLayerDepthIn <= 0) return null;

  const count = Math.ceil(totalDepthIn / maxLayerDepthIn);
  if (count <= 0) return null;

  const depthPerPour = totalDepthIn / count;
  const volPerPourIn3 = totalVolumeIn3 > 0 ? totalVolumeIn3 / count : 0;
  const volPerPour = in3ToVolumes(volPerPourIn3);

  const split = mixSplit(volPerPourIn3, ratioA, ratioB);

  return {
    poursCount: count,
    depthPerPourInches: depthPerPour,
    volumePerPour: volPerPour,
    partAPerPour: split.volumeA,
    partBPerPour: split.volumeB,
  };
}

/** Standard kit sizes in cubic inches for convenience. */
export const STANDARD_KITS: KitOption[] = [
  { name: '16 fl oz Kit (Pint)', volumeIn3: 16 * IN3_PER_FL_OZ },
  { name: '32 fl oz Kit (Quart)', volumeIn3: 32 * IN3_PER_FL_OZ },
  { name: '1/2 Gallon Kit (64 fl oz)', volumeIn3: 64 * IN3_PER_FL_OZ },
  { name: '1 Gallon Kit (128 fl oz)', volumeIn3: 128 * IN3_PER_FL_OZ },
  { name: '1.5 Gallon Kit', volumeIn3: 1.5 * IN3_PER_US_GAL },
  { name: '2 Gallon Kit', volumeIn3: 2 * IN3_PER_US_GAL },
  { name: '3 Gallon Kit', volumeIn3: 3 * IN3_PER_US_GAL },
  { name: '4 Gallon Kit', volumeIn3: 4 * IN3_PER_US_GAL },
  { name: '5 Gallon Kit', volumeIn3: 5 * IN3_PER_US_GAL },
];

/**
 * Kit planner: finds combination of kits that covers neededIn3 with minimal leftover volume.
 */
export function kitPlan(
  neededIn3: number,
  availableKits: KitOption[] = STANDARD_KITS
): KitPlanResult {
  if (neededIn3 <= 0 || availableKits.length === 0) {
    return {
      items: [],
      totalVolumeIn3: 0,
      leftoverIn3: 0,
      leftoverFlOz: 0,
    };
  }

  // Sort descending by volume
  const validKits = availableKits
    .filter((k) => k.volumeIn3 > 0)
    .sort((a, b) => b.volumeIn3 - a.volumeIn3);

  if (validKits.length === 0) {
    return {
      items: [],
      totalVolumeIn3: 0,
      leftoverIn3: 0,
      leftoverFlOz: 0,
    };
  }

  // Greedy approach
  let remaining = neededIn3;
  const items: KitPlanItem[] = [];

  for (let i = 0; i < validKits.length; i++) {
    const kit = validKits[i];
    const isSmallest = i === validKits.length - 1;

    if (remaining <= 0) break;

    if (isSmallest) {
      // Must take enough of smallest kit to cover remaining
      const count = Math.ceil(remaining / kit.volumeIn3);
      if (count > 0) {
        items.push({
          kit,
          count,
          totalIn3: count * kit.volumeIn3,
          totalPrice: kit.price ? count * kit.price : undefined,
        });
        remaining -= count * kit.volumeIn3;
      }
    } else {
      const count = Math.floor(remaining / kit.volumeIn3);
      if (count > 0) {
        items.push({
          kit,
          count,
          totalIn3: count * kit.volumeIn3,
          totalPrice: kit.price ? count * kit.price : undefined,
        });
        remaining -= count * kit.volumeIn3;
      }
    }
  }

  const totalVolumeIn3 = items.reduce((acc, it) => acc + it.totalIn3, 0);
  const leftoverIn3 = Math.max(0, totalVolumeIn3 - neededIn3);
  const leftoverFlOz = leftoverIn3 / IN3_PER_FL_OZ;

  const hasPrices = items.every((it) => it.kit.price !== undefined);
  const totalCost = hasPrices
    ? items.reduce((acc, it) => acc + (it.totalPrice || 0), 0)
    : undefined;

  return {
    items,
    totalVolumeIn3,
    leftoverIn3,
    leftoverFlOz,
    totalCost,
  };
}
