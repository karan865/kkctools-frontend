/**
 * Tons to Cubic Yards Converter Engine (Tool #15)
 * Pure mathematical engine - 100% client-side, zero network dependencies.
 */

export const CONVERTER_CONSTANTS = {
  SHORT_TON_LB: 2000,
  TONNE_LB: 2204.62,
  CF_PER_CY: 27,
  M3_PER_CY: 0.764555,
  BAG_LB: 50,
  TANDEM_LOAD_TONS: 14,
} as const;

export type ConversionDirection = 'tons-to-yards' | 'yards-to-tons';
export type WeightUnit = 'short-ton' | 'metric-tonne';
export type PriceMode = 'ton' | 'cy';
export type CustomDensityUnit = 'tons-per-cy' | 'lb-per-cf' | 'lb-per-cy';

export interface MaterialDensityPreset {
  id: string;
  name: string;
  densityLbPerCy: number; // base density in lb/yd3
  category: string;
}

export const MATERIAL_PRESETS: MaterialDensityPreset[] = [
  { id: 'crushed_stone', name: 'Crushed Stone / Road Base', densityLbPerCy: 2800, category: 'Aggregates' },
  { id: 'river_rock', name: 'River Rock / Washed Cobble', densityLbPerCy: 2700, category: 'Aggregates' },
  { id: 'limestone_57', name: 'Clean Crushed Limestone (#57)', densityLbPerCy: 2700, category: 'Aggregates' },
  { id: 'pea_gravel', name: 'Pea Gravel', densityLbPerCy: 2840, category: 'Aggregates' },
  { id: 'dry_sand', name: 'Dry Concrete Sand', densityLbPerCy: 2700, category: 'Sand' },
  { id: 'wet_sand', name: 'Wet Packed Masonry Sand', densityLbPerCy: 3200, category: 'Sand' },
  { id: 'topsoil', name: 'Screened Topsoil / Garden Loam', densityLbPerCy: 2200, category: 'Soils' },
  { id: 'fill_dirt', name: 'Fill Dirt (delivered, loose)', densityLbPerCy: 2500, category: 'Soils' },
  { id: 'hot_mix_asphalt', name: 'Hot Mix Asphalt', densityLbPerCy: 4050, category: 'Paving' },
  { id: 'concrete', name: 'Poured Cured Concrete', densityLbPerCy: 4040, category: 'Concrete' },
  { id: 'compost', name: 'Dark Aged Organic Compost', densityLbPerCy: 1300, category: 'Landscaping' },
  { id: 'mulch', name: 'Hardwood Shredded Bark Mulch', densityLbPerCy: 800, category: 'Landscaping' },
];

export interface ConvertInput {
  direction: ConversionDirection;
  quantity: number | string; // supports commas e.g. "1,200"
  weightUnit?: WeightUnit; // for Direction A: short-ton (default) or metric-tonne
  materialId: string;
  customDensityValue?: number;
  customDensityUnit?: CustomDensityUnit;
  bufferPct?: number; // 0, 5, 10, 15, 20 (Direction B only)
  priceMode?: PriceMode;
  price?: number;
  deliveryFee?: number;
}

export interface ConvertResult {
  direction: ConversionDirection;
  effectiveDensityLbPerCy: number;
  densityTonsPerCy: number;
  densityLbPerCf: number;

  // Primary quantities
  baseLbs: number;
  orderLbs: number;
  baseShortTons: number;
  orderShortTons: number;
  baseMetricTonnes: number;
  orderMetricTonnes: number;
  baseCy: number;
  orderCy: number;
  baseCf: number;
  orderCf: number;
  baseM3: number;
  orderM3: number;
  bags50Lb: number;

  // Logistics & Pricing
  tandemLoads: number;
  pricePerTon?: number;
  pricePerCy?: number;
  materialTotalCost?: number;
  grandTotalCost?: number;
}

/**
 * Pure conversion function for Tons to Cubic Yards & vice versa.
 */
export function convert(input: ConvertInput): ConvertResult {
  // Parse quantity string handling commas
  let rawQty = 0;
  if (typeof input.quantity === 'number') {
    rawQty = isNaN(input.quantity) ? 0 : input.quantity;
  } else if (typeof input.quantity === 'string') {
    const cleaned = input.quantity.replace(/,/g, '').trim();
    rawQty = parseFloat(cleaned);
    if (isNaN(rawQty)) rawQty = 0;
  }
  const qty = Math.min(1000000, Math.max(0, rawQty));

  // Determine effective density in lb/yd3
  let densityLbPerCy = 2800; // default crushed stone
  if (input.materialId === 'custom') {
    const customVal = Math.max(0.01, input.customDensityValue || 2800);
    const customUnit = input.customDensityUnit || 'lb-per-cy';
    if (customUnit === 'tons-per-cy') {
      densityLbPerCy = customVal * CONVERTER_CONSTANTS.SHORT_TON_LB;
    } else if (customUnit === 'lb-per-cf') {
      densityLbPerCy = customVal * CONVERTER_CONSTANTS.CF_PER_CY;
    } else {
      densityLbPerCy = customVal;
    }
  } else {
    const preset = MATERIAL_PRESETS.find((m) => m.id === input.materialId);
    if (preset) {
      densityLbPerCy = preset.densityLbPerCy;
    }
  }

  const densityTonsPerCy = densityLbPerCy / CONVERTER_CONSTANTS.SHORT_TON_LB;
  const densityLbPerCf = densityLbPerCy / CONVERTER_CONSTANTS.CF_PER_CY;

  const bufferPct = input.direction === 'yards-to-tons' ? Math.max(0, input.bufferPct || 0) : 0;
  const weightUnit = input.weightUnit || 'short-ton';

  let baseLbs = 0;
  let orderLbs = 0;
  let baseCy = 0;
  let orderCy = 0;

  if (input.direction === 'tons-to-yards') {
    // Direction A: Weight to Volume
    const multiplier = weightUnit === 'metric-tonne' ? CONVERTER_CONSTANTS.TONNE_LB : CONVERTER_CONSTANTS.SHORT_TON_LB;
    baseLbs = qty * multiplier;
    orderLbs = baseLbs; // buffer does not apply in Direction A
    baseCy = densityLbPerCy > 0 ? baseLbs / densityLbPerCy : 0;
    orderCy = baseCy;
  } else {
    // Direction B: Volume to Weight
    baseCy = qty;
    baseLbs = baseCy * densityLbPerCy;
    orderLbs = baseLbs * (1 + bufferPct / 100);
    orderCy = baseCy * (1 + bufferPct / 100);
  }

  const baseShortTons = baseLbs / CONVERTER_CONSTANTS.SHORT_TON_LB;
  const orderShortTons = orderLbs / CONVERTER_CONSTANTS.SHORT_TON_LB;
  const baseMetricTonnes = baseLbs / CONVERTER_CONSTANTS.TONNE_LB;
  const orderMetricTonnes = orderLbs / CONVERTER_CONSTANTS.TONNE_LB;

  const baseCf = baseCy * CONVERTER_CONSTANTS.CF_PER_CY;
  const orderCf = orderCy * CONVERTER_CONSTANTS.CF_PER_CY;
  const baseM3 = baseCy * CONVERTER_CONSTANTS.M3_PER_CY;
  const orderM3 = orderCy * CONVERTER_CONSTANTS.M3_PER_CY;

  const bags50Lb = Math.ceil(orderLbs / CONVERTER_CONSTANTS.BAG_LB);
  const tandemLoads = parseFloat((orderShortTons / CONVERTER_CONSTANTS.TANDEM_LOAD_TONS).toFixed(1));

  // Pricing calculations
  let pricePerTon: number | undefined;
  let pricePerCy: number | undefined;
  let materialTotalCost: number | undefined;
  let grandTotalCost: number | undefined;

  const p = typeof input.price === 'number' && input.price > 0 ? input.price : undefined;
  const delivery = typeof input.deliveryFee === 'number' && input.deliveryFee > 0 ? input.deliveryFee : 0;

  if (p !== undefined) {
    if (input.priceMode === 'cy') {
      pricePerCy = p;
      pricePerTon = densityTonsPerCy > 0 ? parseFloat((p / densityTonsPerCy).toFixed(2)) : undefined;
    } else {
      // mode 'ton' (default)
      pricePerTon = p;
      pricePerCy = parseFloat((p * densityTonsPerCy).toFixed(2));
    }

    if (pricePerTon !== undefined) {
      materialTotalCost = parseFloat((orderShortTons * pricePerTon).toFixed(2));
      grandTotalCost = parseFloat((materialTotalCost + delivery).toFixed(2));
    }
  }

  return {
    direction: input.direction,
    effectiveDensityLbPerCy: parseFloat(densityLbPerCy.toFixed(1)),
    densityTonsPerCy: parseFloat(densityTonsPerCy.toFixed(3)),
    densityLbPerCf: parseFloat(densityLbPerCf.toFixed(1)),
    baseLbs: Math.round(baseLbs),
    orderLbs: Math.round(orderLbs),
    baseShortTons: parseFloat(baseShortTons.toFixed(2)),
    orderShortTons: parseFloat(orderShortTons.toFixed(2)),
    baseMetricTonnes: parseFloat(baseMetricTonnes.toFixed(2)),
    orderMetricTonnes: parseFloat(orderMetricTonnes.toFixed(2)),
    baseCy: parseFloat(baseCy.toFixed(2)),
    orderCy: parseFloat(orderCy.toFixed(2)),
    baseCf: parseFloat(baseCf.toFixed(1)),
    orderCf: parseFloat(orderCf.toFixed(1)),
    baseM3: parseFloat(baseM3.toFixed(2)),
    orderM3: parseFloat(orderM3.toFixed(2)),
    bags50Lb,
    tandemLoads,
    pricePerTon,
    pricePerCy,
    materialTotalCost,
    grandTotalCost,
  };
}
