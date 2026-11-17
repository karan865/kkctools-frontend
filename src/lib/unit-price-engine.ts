/**
 * Unit Price Engine — Pure mathematical functions for comparing unit prices,
 * unit conversions (weight, volume, count), deal adjustments (coupons, BOGO, multi-buys),
 * shrinkflation analysis, and seller unit-cost shelf tagging.
 *
 * Sourced exact standards:
 * - National Institute of Standards and Technology (NIST) Handbook 130 / SP 811
 * - 1 avoirdupois ounce = 28.349523125 grams
 * - 1 pound = 16 ounces = 453.59237 grams
 * - 1 US fluid ounce = 29.5735295625 milliliters
 * - 1 US gallon = 128 US fl oz = 3785.411784 milliliters
 */

export type UnitGroup = 'weight' | 'volume' | 'count';

export type WeightUnit = 'oz' | 'lb' | 'g' | 'kg';
export type VolumeUnit = 'fl_oz' | 'cup' | 'pt' | 'qt' | 'gal' | 'ml' | 'l';
export type CountUnit = 'item' | 'sheet' | 'roll' | 'load' | 'pc';

export type AnyUnit = WeightUnit | VolumeUnit | CountUnit;

export type DealType = 'none' | 'percent_off' | 'amount_off' | 'bogo' | 'x_for_y';

export interface DealSpec {
  type: DealType;
  value?: number; // % off or $ off or X in BOGO (e.g. 20 for 20% off, 1.50 for $1.50 off)
  buyQty?: number; // Buy X in "Buy X Get Y Free"
  freeQty?: number; // Get Y free
  bundlePrice?: number; // For "X for $Y", e.g. 3 for $5.00
  bundleQty?: number;
}

export interface UnitPriceItemInput {
  id: string;
  label?: string;
  price: number;
  packCount?: number; // e.g. 6 in a 6-pack
  sizePerItem: number; // e.g. 12 in 12 oz
  unit: AnyUnit;
  deal?: DealSpec;
}

export interface UnitPriceItemOutput {
  id: string;
  label: string;
  originalPrice: number;
  effectivePrice: number;
  packCount: number;
  sizePerItem: number;
  unit: AnyUnit;
  unitGroup: UnitGroup;
  totalBaseQuantity: number; // in grams, ml, or units
  unitPrice: number; // in outputUnit
  unitPriceFormatted: string;
  rank: number;
  isCheapest: boolean;
  percentMoreThanCheapest: number;
  savingPerUnit: number;
  packsNeededForTarget?: number;
  totalCostForTarget?: number;
}

export interface CompareResult {
  hasMismatchedGroups: boolean;
  commonGroup: UnitGroup | null;
  outputUnit: AnyUnit;
  items: UnitPriceItemOutput[];
  cheapestItem: UnitPriceItemOutput | null;
  summarySentence: string;
}

export interface ShrinkflationInput {
  oldPrice: number;
  oldSize: number;
  newPrice: number;
  newSize: number;
  unitLabel?: string;
}

export interface ShrinkflationResult {
  oldUnitPrice: number;
  newUnitPrice: number;
  sizeChangePercent: number; // Negative when shrunk
  priceChangePercent: number;
  unitPriceIncreasePercent: number; // True hidden inflation
  summarySentence: string;
}

export interface SellerCostInput {
  batchTotalCost: number;
  unitsProduced: number;
  packageSize: number;
  packageUnit: AnyUnit;
}

export interface SellerCostResult {
  costPerUnit: number;
  shelfTagPerKgOrLiter: number | null;
  shelfTagPer100gOr100ml: number | null;
}

// Exact NIST / International Conversion Constants
export const OZ_TO_GRAMS = 28.349523125;
export const LB_TO_GRAMS = 453.59237;
export const KG_TO_GRAMS = 1000;

export const FLOZ_TO_ML = 29.5735295625;
export const CUP_TO_ML = 236.5882365;
export const PT_TO_ML = 473.176473;
export const QT_TO_ML = 946.352946;
export const GAL_TO_ML = 3785.411784;
export const L_TO_ML = 1000;

/**
 * Normalises floating point jitter and -0 to 0.
 */
function clean(n: number): number {
  if (Object.is(n, -0)) return 0;
  if (!Number.isFinite(n)) return n;
  const rounded = Math.round(n * 1e12) / 1e12;
  return Object.is(rounded, -0) ? 0 : rounded;
}

/**
 * Get unit measurement category
 */
export function getUnitGroup(unit: AnyUnit): UnitGroup {
  if (['oz', 'lb', 'g', 'kg'].includes(unit)) return 'weight';
  if (['fl_oz', 'cup', 'pt', 'qt', 'gal', 'ml', 'l'].includes(unit)) return 'volume';
  return 'count';
}

/**
 * Convert quantity to standard base unit:
 * - Weight: grams (g)
 * - Volume: milliliters (ml)
 * - Count: items (count)
 */
export function toBaseQuantity(qty: number, unit: AnyUnit): number {
  if (!Number.isFinite(qty) || qty <= 0) return 0;

  switch (unit) {
    // Weight -> grams
    case 'oz':
      return clean(qty * OZ_TO_GRAMS);
    case 'lb':
      return clean(qty * LB_TO_GRAMS);
    case 'g':
      return clean(qty);
    case 'kg':
      return clean(qty * KG_TO_GRAMS);

    // Volume -> milliliters
    case 'fl_oz':
      return clean(qty * FLOZ_TO_ML);
    case 'cup':
      return clean(qty * CUP_TO_ML);
    case 'pt':
      return clean(qty * PT_TO_ML);
    case 'qt':
      return clean(qty * QT_TO_ML);
    case 'gal':
      return clean(qty * GAL_TO_ML);
    case 'ml':
      return clean(qty);
    case 'l':
      return clean(qty * L_TO_ML);

    // Count -> raw count
    case 'item':
    case 'sheet':
    case 'roll':
    case 'load':
    case 'pc':
    default:
      return clean(qty);
  }
}

/**
 * Convert standard base quantity (grams, ml, item) to requested display unit
 */
export function fromBaseQuantity(baseQty: number, toUnit: AnyUnit): number {
  if (!Number.isFinite(baseQty) || baseQty <= 0) return 0;

  switch (toUnit) {
    // Grams -> Target Weight
    case 'oz':
      return clean(baseQty / OZ_TO_GRAMS);
    case 'lb':
      return clean(baseQty / LB_TO_GRAMS);
    case 'g':
      return clean(baseQty);
    case 'kg':
      return clean(baseQty / KG_TO_GRAMS);

    // ML -> Target Volume
    case 'fl_oz':
      return clean(baseQty / FLOZ_TO_ML);
    case 'cup':
      return clean(baseQty / CUP_TO_ML);
    case 'pt':
      return clean(baseQty / PT_TO_ML);
    case 'qt':
      return clean(baseQty / QT_TO_ML);
    case 'gal':
      return clean(baseQty / GAL_TO_ML);
    case 'ml':
      return clean(baseQty);
    case 'l':
      return clean(baseQty / L_TO_ML);

    // Count
    case 'item':
    case 'sheet':
    case 'roll':
    case 'load':
    case 'pc':
    default:
      return clean(baseQty);
  }
}

/**
 * Apply discounts, coupons, BOGO, or multi-pack deals to calculate effective price
 */
export function applyDeal(originalPrice: number, deal?: DealSpec): number {
  if (!deal || deal.type === 'none') {
    return clean(Math.max(0, originalPrice));
  }

  const p = Math.max(0, originalPrice);

  switch (deal.type) {
    case 'percent_off': {
      const discountPct = Math.max(0, Math.min(100, deal.value || 0)) / 100;
      return clean(p * (1 - discountPct));
    }
    case 'amount_off': {
      const discountVal = Math.max(0, deal.value || 0);
      return clean(Math.max(0, p - discountVal));
    }
    case 'bogo': {
      // e.g. Buy 1 Get 1 Free: pay for 1, get 2 => effective unit price is 50%
      // In general: pay for buyQty, get (buyQty + freeQty)
      const buy = Math.max(1, deal.buyQty || 1);
      const free = Math.max(1, deal.freeQty || 1);
      const totalUnits = buy + free;
      const effectivePerPack = (p * buy) / totalUnits;
      return clean(effectivePerPack);
    }
    case 'x_for_y': {
      // e.g. "3 for $5" -> effective price per pack = 5 / 3 = $1.6667
      const bundleQty = Math.max(1, deal.bundleQty || 1);
      const bundlePrice = Math.max(0, deal.bundlePrice || p);
      return clean(bundlePrice / bundleQty);
    }
    default:
      return clean(p);
  }
}

/**
 * Format unit name for clean display labels
 */
export function formatUnitLabel(unit: AnyUnit): string {
  switch (unit) {
    case 'fl_oz':
      return 'fl oz';
    case 'oz':
      return 'oz';
    case 'lb':
      return 'lb';
    case 'g':
      return 'g';
    case 'kg':
      return 'kg';
    case 'cup':
      return 'cup';
    case 'pt':
      return 'pt';
    case 'qt':
      return 'qt';
    case 'gal':
      return 'gal';
    case 'ml':
      return 'ml';
    case 'l':
      return 'L';
    case 'item':
      return 'item';
    case 'sheet':
      return 'sheet';
    case 'roll':
      return 'roll';
    case 'load':
      return 'load';
    case 'pc':
      return 'pc';
    default:
      return unit;
  }
}

/**
 * Compare 2 to 6 product options and determine best value
 */
export function compareUnitPrices(
  items: UnitPriceItemInput[],
  outputUnitOverride?: AnyUnit,
  quantityNeeded?: number
): CompareResult {
  if (!items || items.length === 0) {
    return {
      hasMismatchedGroups: false,
      commonGroup: null,
      outputUnit: 'oz',
      items: [],
      cheapestItem: null,
      summarySentence: 'Please enter at least two product options to compare unit prices.',
    };
  }

  // Check group compatibility
  const groups = items.map((it) => getUnitGroup(it.unit));
  const firstGroup = groups[0];
  const hasMismatchedGroups = groups.some((g) => g !== firstGroup);

  if (hasMismatchedGroups) {
    return {
      hasMismatchedGroups: true,
      commonGroup: null,
      outputUnit: items[0].unit,
      items: [],
      cheapestItem: null,
      summarySentence:
        'Cannot compare weight and volume directly (e.g. fluid ounces are liquid volume, whereas ounces are dry weight). Please use matching units.',
    };
  }

  // Determine output unit
  let resolvedOutputUnit: AnyUnit = outputUnitOverride || items[0].unit;
  if (outputUnitOverride && getUnitGroup(outputUnitOverride) !== firstGroup) {
    resolvedOutputUnit = items[0].unit;
  }

  // Process rows
  const processed = items.map((it, idx) => {
    const pack = Math.max(1, it.packCount || 1);
    const size = Math.max(0, it.sizePerItem);
    const totalSingleUnitBase = toBaseQuantity(size, it.unit);
    const totalBaseQty = clean(pack * totalSingleUnitBase);

    const effPrice = applyDeal(it.price, it.deal);

    // Calculate unit price: Price per 1 outputUnit
    // Convert base quantity of 1 output unit to base unit
    const singleOutputUnitInBase = toBaseQuantity(1, resolvedOutputUnit);
    const unitPrice =
      totalBaseQty > 0 ? clean((effPrice / totalBaseQty) * singleOutputUnitInBase) : 0;

    let packsNeeded: number | undefined = undefined;
    let totalCostForTarget: number | undefined = undefined;

    if (quantityNeeded && quantityNeeded > 0) {
      const targetBase = toBaseQuantity(quantityNeeded, resolvedOutputUnit);
      if (totalBaseQty > 0) {
        packsNeeded = Math.ceil(targetBase / totalBaseQty);
        totalCostForTarget = clean(packsNeeded * effPrice);
      }
    }

    return {
      id: it.id || `item-${idx + 1}`,
      label: it.label || `Option ${String.fromCharCode(65 + idx)}`,
      originalPrice: it.price,
      effectivePrice: effPrice,
      packCount: pack,
      sizePerItem: size,
      unit: it.unit,
      unitGroup: firstGroup,
      totalBaseQuantity: totalBaseQty,
      unitPrice,
      unitPriceFormatted: `$${unitPrice.toFixed(2)} / ${formatUnitLabel(resolvedOutputUnit)}`,
      rank: 1,
      isCheapest: false,
      percentMoreThanCheapest: 0,
      savingPerUnit: 0,
      packsNeededForTarget: packsNeeded,
      totalCostForTarget: totalCostForTarget,
    };
  });

  // Sort by unit price ascending to determine rankings
  const validItems = processed.filter((it) => it.unitPrice > 0);
  const sorted = [...validItems].sort((a, b) => a.unitPrice - b.unitPrice);

  const cheapest = sorted.length > 0 ? sorted[0] : null;

  // Assign ranks & percentages relative to cheapest
  const finalItems: UnitPriceItemOutput[] = processed.map((item) => {
    if (item.unitPrice <= 0 || !cheapest) {
      return {
        ...item,
        rank: 99,
        isCheapest: false,
        percentMoreThanCheapest: 0,
        savingPerUnit: 0,
      };
    }

    const isBest = item.id === cheapest.id || Math.abs(item.unitPrice - cheapest.unitPrice) < 1e-6;
    const pctMore =
      cheapest.unitPrice > 0
        ? clean(((item.unitPrice - cheapest.unitPrice) / cheapest.unitPrice) * 100)
        : 0;
    const saving = clean(item.unitPrice - cheapest.unitPrice);

    // Find rank in sorted list (handle ties)
    const rankIndex = sorted.findIndex((s) => Math.abs(s.unitPrice - item.unitPrice) < 1e-6);

    return {
      ...item,
      rank: rankIndex >= 0 ? rankIndex + 1 : 99,
      isCheapest: isBest,
      percentMoreThanCheapest: pctMore,
      savingPerUnit: saving,
    };
  });

  // Generate plain English summary
  let summary = '';
  if (cheapest && finalItems.length >= 2) {
    const others = finalItems.filter((it) => it.id !== cheapest.id && it.unitPrice > 0);
    if (others.length > 0) {
      const nextBest = others[0];
      const savingsPct =
        nextBest.unitPrice > 0
          ? clean(((nextBest.unitPrice - cheapest.unitPrice) / nextBest.unitPrice) * 100)
          : 0;

      summary = `${cheapest.label} is the best value at $${cheapest.unitPrice.toFixed(
        2
      )}/${formatUnitLabel(resolvedOutputUnit)}, saving ${savingsPct.toFixed(
        1
      )}% compared to ${nextBest.label}.`;
    } else {
      summary = `${cheapest.label} is priced at $${cheapest.unitPrice.toFixed(2)}/${formatUnitLabel(
        resolvedOutputUnit
      )}.`;
    }
  } else if (cheapest) {
    summary = `${cheapest.label} is priced at $${cheapest.unitPrice.toFixed(2)}/${formatUnitLabel(
      resolvedOutputUnit
    )}.`;
  }

  const cheapestFinal = finalItems.find((it) => it.isCheapest) || null;

  return {
    hasMismatchedGroups: false,
    commonGroup: firstGroup,
    outputUnit: resolvedOutputUnit,
    items: finalItems,
    cheapestItem: cheapestFinal,
    summarySentence: summary,
  };
}

/**
 * Shrinkflation Calculator: Detect hidden inflation when package sizes drop
 *
 * Mathematical proof:
 * If a 10 oz product drops 10% to 9 oz while remaining $10:
 * Old unit price = $1.00 / oz
 * New unit price = $10 / 9 = $1.1111 / oz
 * Unit price increase = (1.1111 - 1.00) / 1.00 = +11.11%
 */
export function calculateShrinkflation(input: ShrinkflationInput): ShrinkflationResult {
  const oldP = Math.max(0, input.oldPrice);
  const oldS = Math.max(0, input.oldSize);
  const newP = Math.max(0, input.newPrice);
  const newS = Math.max(0, input.newSize);
  const unit = input.unitLabel || 'unit';

  const oldUnitPrice = oldS > 0 ? clean(oldP / oldS) : 0;
  const newUnitPrice = newS > 0 ? clean(newP / newS) : 0;

  const sizeChangePct = oldS > 0 ? clean(((newS - oldS) / oldS) * 100) : 0;
  const priceChangePct = oldP > 0 ? clean(((newP - oldP) / oldP) * 100) : 0;

  const unitPriceIncreasePct =
    oldUnitPrice > 0 ? clean(((newUnitPrice - oldUnitPrice) / oldUnitPrice) * 100) : 0;

  const sizeDropText =
    sizeChangePct < 0 ? `${Math.abs(sizeChangePct).toFixed(1)}% smaller` : `${sizeChangePct.toFixed(1)}% larger`;

  let sentence = '';
  if (unitPriceIncreasePct > 0) {
    sentence = `The package is ${sizeDropText}, which represents a hidden ${unitPriceIncreasePct.toFixed(
      1
    )}% price increase per ${unit}.`;
  } else if (unitPriceIncreasePct < 0) {
    sentence = `The package is ${sizeDropText}, representing a ${Math.abs(
      unitPriceIncreasePct
    ).toFixed(1)}% price drop per ${unit}.`;
  } else {
    sentence = `The unit price remains unchanged at $${newUnitPrice.toFixed(2)} per ${unit}.`;
  }

  return {
    oldUnitPrice,
    newUnitPrice,
    sizeChangePercent: sizeChangePct,
    priceChangePercent: priceChangePct,
    unitPriceIncreasePercent: unitPriceIncreasePct,
    summarySentence: sentence,
  };
}

/**
 * Seller Cost Per Unit & Statutory Shelf-Tag Label Generator
 * (e.g. Price per kg or Price per liter for retail compliance)
 */
export function calculateSellerUnitCost(input: SellerCostInput): SellerCostResult {
  const batchCost = Math.max(0, input.batchTotalCost);
  const units = Math.max(1, input.unitsProduced);
  const size = Math.max(0, input.packageSize);

  const costPerUnit = clean(batchCost / units);
  const grp = getUnitGroup(input.packageUnit);

  let perKgOrLiter: number | null = null;
  let per100gOr100ml: number | null = null;

  if (grp === 'weight' && size > 0) {
    const sizeInGrams = toBaseQuantity(size, input.packageUnit);
    // Price per 1 kg (1000g)
    perKgOrLiter = sizeInGrams > 0 ? clean((costPerUnit / sizeInGrams) * 1000) : null;
    per100gOr100ml = sizeInGrams > 0 ? clean((costPerUnit / sizeInGrams) * 100) : null;
  } else if (grp === 'volume' && size > 0) {
    const sizeInMl = toBaseQuantity(size, input.packageUnit);
    // Price per 1 L (1000ml)
    perKgOrLiter = sizeInMl > 0 ? clean((costPerUnit / sizeInMl) * 1000) : null;
    per100gOr100ml = sizeInMl > 0 ? clean((costPerUnit / sizeInMl) * 100) : null;
  }

  return {
    costPerUnit,
    shelfTagPerKgOrLiter: perKgOrLiter,
    shelfTagPer100gOr100ml: per100gOr100ml,
  };
}
