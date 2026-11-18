/**
 * discount-engine.ts
 *
 * Core computation engine for the Discount / Percent Off Calculator (#46).
 * Features:
 * - Forward % off with optional fixed coupon, coupon order toggle, stacked discount %, and sales tax
 * - Reverse discount calculations: find original price, find discount %, or target price
 * - Real retail promo equivalents: BOGO, BOGO at X% off, Buy X Get Y Free (3-for-2), Spend X Save Y, and bundles
 * - Dynamic reference tables for custom prices and common "X% off $Y" price matrix
 *
 * All functions are pure, deterministic, and return clean numbers (never NaN or Infinity).
 * Zero external dependencies. Zero network calls.
 */

export interface DiscountInput {
  originalPrice: number;
  discountPercent: number;
  couponAmount?: number;
  couponOrder?: 'percent-first' | 'coupon-first';
  stackedDiscountPercent?: number;
  taxPercent?: number;
  taxTiming?: 'after-discount' | 'before-discount';
}

export interface DiscountResult {
  originalPrice: number;
  salePrice: number;
  totalSavings: number;
  effectiveDiscountPercent: number;
  percentSavingsOnly: number;
  couponSavingsOnly: number;
  stackedSavingsOnly: number;
  stackedBreakdown: string;
  taxAmount: number;
  finalPriceWithTax: number;
  priceAfterFirstDiscount: number;
  priceAfterCoupon: number;
}

export interface ReverseDiscountInput {
  mode: 'find-original' | 'find-percent' | 'find-target';
  originalPrice?: number;
  salePrice?: number;
  discountPercent?: number;
  desiredSavings?: number;
}

export interface ReverseDiscountResult {
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  savingsDollars: number;
  formulaUsed: string;
}

export type DealType = 'bogo-free' | 'bogo-percent' | 'buy-x-get-y' | 'spend-x-save-y' | 'bundle';

export interface DealInput {
  type: DealType;
  itemPrice?: number;
  secondItemDiscountPercent?: number; // for bogo-percent (e.g. 50%)
  buyQty?: number; // for buy-x-get-y (e.g. buy 2)
  getQty?: number; // for buy-x-get-y (e.g. get 1 free)
  spendThreshold?: number; // for spend-x-save-y (e.g. spend 100)
  saveAmount?: number; // for spend-x-save-y (e.g. save 20)
  bundleQty?: number; // for bundle (e.g. 3)
  bundleTotalPrice?: number; // for bundle (e.g. $25)
}

export interface DealResult {
  dealName: string;
  effectiveDiscountPercent: number;
  totalOriginalCost: number;
  totalSalePrice: number;
  totalSavings: number;
  pricePerUnit: number;
  explanation: string;
}

export interface DiscountTableRow {
  percent: number;
  salePrice: number;
  savings: number;
  multiplier: number;
  stepCalculation: string;
}

export interface CommonPriceMatrixEntry {
  price: number;
  discounts: Record<number, { salePrice: number; savings: number }>;
}

/**
 * Clean floating point inaccuracies to 6 decimal places.
 */
function clean(n: number): number {
  return Math.round((n + Number.EPSILON) * 1e6) / 1e6;
}

/**
 * Round to currency 2 decimal places.
 */
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Calculate standard discount with optional stacked discount, coupon, and sales tax.
 */
export function calculateDiscount(input: DiscountInput): DiscountResult {
  const orig = Math.max(0, clean(Number(input.originalPrice) || 0));
  const d1 = Math.max(0, Math.min(100, clean(Number(input.discountPercent) || 0)));
  const coupon = Math.max(0, clean(Number(input.couponAmount) || 0));
  const order = input.couponOrder || 'percent-first';
  const d2 = Math.max(0, Math.min(100, clean(Number(input.stackedDiscountPercent) || 0)));
  const taxPct = Math.max(0, clean(Number(input.taxPercent) || 0));
  const taxTiming = input.taxTiming || 'after-discount';

  let currentPrice = orig;
  let priceAfterFirst = orig;
  let priceAfterCoupon = orig;
  let percentSavings = 0;
  let couponSavings = 0;
  let stackedSavings = 0;

  if (order === 'percent-first') {
    // 1. Primary percentage discount
    const step1Saving = clean(orig * (d1 / 100));
    percentSavings = step1Saving;
    currentPrice = Math.max(0, clean(orig - step1Saving));
    priceAfterFirst = currentPrice;

    // 2. Stacked percentage discount (applied to reduced price)
    if (d2 > 0) {
      const step2Saving = clean(currentPrice * (d2 / 100));
      stackedSavings = step2Saving;
      currentPrice = Math.max(0, clean(currentPrice - step2Saving));
    }

    // 3. Fixed dollar coupon
    if (coupon > 0) {
      const actualCoupon = Math.min(currentPrice, coupon);
      couponSavings = actualCoupon;
      currentPrice = Math.max(0, clean(currentPrice - coupon));
    }
    priceAfterCoupon = currentPrice;
  } else {
    // Coupon applied first
    if (coupon > 0) {
      const actualCoupon = Math.min(orig, coupon);
      couponSavings = actualCoupon;
      currentPrice = Math.max(0, clean(orig - coupon));
    }
    priceAfterCoupon = currentPrice;

    // Primary percentage discount
    const step1Saving = clean(currentPrice * (d1 / 100));
    percentSavings = step1Saving;
    currentPrice = Math.max(0, clean(currentPrice - step1Saving));
    priceAfterFirst = currentPrice;

    // Stacked percentage discount
    if (d2 > 0) {
      const step2Saving = clean(currentPrice * (d2 / 100));
      stackedSavings = step2Saving;
      currentPrice = Math.max(0, clean(currentPrice - step2Saving));
    }
  }

  const salePrice = round2(currentPrice);
  const totalSavings = round2(Math.max(0, orig - currentPrice));
  const effectiveDiscountPercent = orig > 0 ? round2((totalSavings / orig) * 100) : 0;

  // Explanation for stacked discounts if active
  let stackedBreakdown = '';
  if (d2 > 0) {
    const combinedNominal = d1 + d2;
    const compoundEffective = round2((1 - (1 - d1 / 100) * (1 - d2 / 100)) * 100);
    stackedBreakdown = `${d1}% off followed by an extra ${d2}% off yields an effective ${compoundEffective}% total discount (not ${combinedNominal}%), because the second discount applies to the already reduced price.`;
  }

  // Sales tax computation
  let taxAmount = 0;
  if (taxPct > 0) {
    if (taxTiming === 'before-discount') {
      // In certain jurisdictions/manufacturer coupons, tax is assessed on full original MSRP
      taxAmount = round2(orig * (taxPct / 100));
    } else {
      // Standard store discount: tax on net sale price
      taxAmount = round2(currentPrice * (taxPct / 100));
    }
  }

  const finalPriceWithTax = round2(currentPrice + taxAmount);

  return {
    originalPrice: round2(orig),
    salePrice,
    totalSavings,
    effectiveDiscountPercent,
    percentSavingsOnly: round2(percentSavings),
    couponSavingsOnly: round2(couponSavings),
    stackedSavingsOnly: round2(stackedSavings),
    stackedBreakdown,
    taxAmount,
    finalPriceWithTax,
    priceAfterFirstDiscount: round2(priceAfterFirst),
    priceAfterCoupon: round2(priceAfterCoupon),
  };
}

/**
 * Reverse discount calculation:
 * - Find original price: P = S / (1 - d)
 * - Find discount percent: d = ((P - S) / P) * 100
 * - Find target price: S = P - desiredSavings
 */
export function reverseDiscount(input: ReverseDiscountInput): ReverseDiscountResult {
  const orig = Math.max(0, clean(Number(input.originalPrice) || 0));
  const sale = Math.max(0, clean(Number(input.salePrice) || 0));
  const pct = Math.max(0, Math.min(99.999, clean(Number(input.discountPercent) || 0)));
  const desired = Math.max(0, clean(Number(input.desiredSavings) || 0));

  if (input.mode === 'find-original') {
    // S and pct given -> find P
    if (pct >= 100) {
      return {
        originalPrice: 0,
        salePrice: round2(sale),
        discountPercent: 100,
        savingsDollars: 0,
        formulaUsed: 'Original Price = Undefined (discount cannot be 100% or higher for non-zero sale price)',
      };
    }
    const computedOrig = round2(sale / (1 - pct / 100));
    const savings = round2(computedOrig - sale);
    return {
      originalPrice: computedOrig,
      salePrice: round2(sale),
      discountPercent: round2(pct),
      savingsDollars: savings,
      formulaUsed: `Original Price = Sale Price ÷ (1 − Discount% ÷ 100) = $${sale.toFixed(2)} ÷ (1 − ${(pct / 100).toFixed(4)}) = $${computedOrig.toFixed(2)}`,
    };
  }

  if (input.mode === 'find-percent') {
    // P and S given -> find pct
    if (orig <= 0) {
      return {
        originalPrice: 0,
        salePrice: round2(sale),
        discountPercent: 0,
        savingsDollars: 0,
        formulaUsed: 'Original Price must be greater than zero.',
      };
    }
    const savings = round2(Math.max(0, orig - sale));
    const computedPct = round2((savings / orig) * 100);
    return {
      originalPrice: round2(orig),
      salePrice: round2(sale),
      discountPercent: computedPct,
      savingsDollars: savings,
      formulaUsed: `Discount% = ((Original − Sale) ÷ Original) × 100 = (($${orig.toFixed(2)} − $${sale.toFixed(2)}) ÷ $${orig.toFixed(2)}) × 100 = ${computedPct.toFixed(2)}%`,
    };
  }

  // mode === 'find-target'
  // P and desiredSavings given -> find S and pct
  const targetSale = round2(Math.max(0, orig - desired));
  const computedPct = orig > 0 ? round2((desired / orig) * 100) : 0;
  return {
    originalPrice: round2(orig),
    salePrice: targetSale,
    discountPercent: computedPct,
    savingsDollars: round2(desired),
    formulaUsed: `Sale Price = Original Price − Desired Savings = $${orig.toFixed(2)} − $${desired.toFixed(2)} = $${targetSale.toFixed(2)} (${computedPct.toFixed(2)}% off)`,
  };
}

/**
 * Calculate effective percentage off and savings for retail deal types:
 * - BOGO Free (Buy 1 Get 1 Free) = 50%
 * - BOGO X% off (e.g. 50% off second item) = (X / 2)%
 * - Buy X Get Y Free (e.g. Buy 2 Get 1 Free) = Y / (X + Y)
 * - Spend X Save Y (e.g. Spend $100 Save $20) = Y / X
 * - Bundle (e.g. 3 for $25 vs $10 each)
 */
export function calculateDeal(input: DealInput): DealResult {
  const itemPrice = Math.max(0, clean(Number(input.itemPrice) || 0));

  switch (input.type) {
    case 'bogo-free': {
      const origCost = round2(itemPrice * 2);
      const saleCost = round2(itemPrice);
      const savings = round2(itemPrice);
      const unitPrice = round2(itemPrice / 2);
      return {
        dealName: 'Buy 1, Get 1 Free (BOGO)',
        effectiveDiscountPercent: 50.0,
        totalOriginalCost: origCost,
        totalSalePrice: saleCost,
        totalSavings: savings,
        pricePerUnit: unitPrice,
        explanation: 'Buy 1 Get 1 Free halves your total bill across 2 items, giving you an exact 50.00% discount per item.',
      };
    }

    case 'bogo-percent': {
      const secondPct = Math.max(0, Math.min(100, clean(Number(input.secondItemDiscountPercent) || 50)));
      const origCost = round2(itemPrice * 2);
      const secondItemPrice = clean(itemPrice * (1 - secondPct / 100));
      const saleCost = round2(itemPrice + secondItemPrice);
      const savings = round2(origCost - saleCost);
      const effectivePct = origCost > 0 ? round2((savings / origCost) * 100) : 0;
      const unitPrice = round2(saleCost / 2);
      return {
        dealName: `Buy 1, Get 1 at ${secondPct}% Off`,
        effectiveDiscountPercent: effectivePct,
        totalOriginalCost: origCost,
        totalSalePrice: saleCost,
        totalSavings: savings,
        pricePerUnit: unitPrice,
        explanation: `Discounting the 2nd item by ${secondPct}% saves $${savings.toFixed(2)} across both items, which equals an effective ${effectivePct.toFixed(2)}% discount across your entire purchase.`,
      };
    }

    case 'buy-x-get-y': {
      const buyQty = Math.max(1, Math.round(Number(input.buyQty) || 2));
      const getQty = Math.max(1, Math.round(Number(input.getQty) || 1));
      const totalUnits = buyQty + getQty;
      const origCost = round2(itemPrice * totalUnits);
      const saleCost = round2(itemPrice * buyQty);
      const savings = round2(itemPrice * getQty);
      const effectivePct = totalUnits > 0 ? round2((getQty / totalUnits) * 100) : 0;
      const unitPrice = totalUnits > 0 ? round2(saleCost / totalUnits) : 0;
      return {
        dealName: `Buy ${buyQty}, Get ${getQty} Free`,
        effectiveDiscountPercent: effectivePct,
        totalOriginalCost: origCost,
        totalSalePrice: saleCost,
        totalSavings: savings,
        pricePerUnit: unitPrice,
        explanation: `Receiving ${getQty} free item(s) out of ${totalUnits} total items yields an effective ${effectivePct.toFixed(2)}% savings ($${unitPrice.toFixed(2)}/unit vs normal $${itemPrice.toFixed(2)}).`,
      };
    }

    case 'spend-x-save-y': {
      const spend = Math.max(1, clean(Number(input.spendThreshold) || 100));
      const save = Math.max(0, clean(Number(input.saveAmount) || 20));
      const effectivePct = spend > 0 ? round2((save / spend) * 100) : 0;
      const saleCost = round2(Math.max(0, spend - save));
      return {
        dealName: `Spend $${spend.toFixed(0)}, Save $${save.toFixed(0)}`,
        effectiveDiscountPercent: effectivePct,
        totalOriginalCost: round2(spend),
        totalSalePrice: saleCost,
        totalSavings: round2(save),
        pricePerUnit: saleCost,
        explanation: `Saving $${save.toFixed(2)} on a $${spend.toFixed(2)} purchase represents an exact ${effectivePct.toFixed(2)}% discount at the qualification threshold.`,
      };
    }

    case 'bundle': {
      const bundleQty = Math.max(2, Math.round(Number(input.bundleQty) || 3));
      const bundlePrice = Math.max(0, clean(Number(input.bundleTotalPrice) || 25));
      const regularUnit = itemPrice > 0 ? itemPrice : round2((bundlePrice * 1.3) / bundleQty);
      const origCost = round2(regularUnit * bundleQty);
      const savings = round2(Math.max(0, origCost - bundlePrice));
      const effectivePct = origCost > 0 ? round2((savings / origCost) * 100) : 0;
      const unitPrice = round2(bundlePrice / bundleQty);
      return {
        dealName: `${bundleQty}-Pack Multi-Buy Bundle`,
        effectiveDiscountPercent: effectivePct,
        totalOriginalCost: origCost,
        totalSalePrice: round2(bundlePrice),
        totalSavings: savings,
        pricePerUnit: unitPrice,
        explanation: `Buying ${bundleQty} items for $${bundlePrice.toFixed(2)} ($${unitPrice.toFixed(2)} each) instead of individual retail ($${regularUnit.toFixed(2)} each) saves $${savings.toFixed(2)} (${effectivePct.toFixed(2)}% off).`,
      };
    }
  }
}

/**
 * Generate quick discount reference table for any given base price across standard discount percentages.
 */
export function generateDiscountTable(price: number): DiscountTableRow[] {
  const p = Math.max(0, clean(Number(price) || 0));
  const percentages = [5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 75];

  return percentages.map((pct) => {
    const savings = round2(p * (pct / 100));
    const salePrice = round2(Math.max(0, p - savings));
    const multiplier = round2(1 - pct / 100);
    const stepCalculation = `$${p.toFixed(2)} × (1 − ${(pct / 100).toFixed(2)}) = $${p.toFixed(2)} × ${multiplier.toFixed(2)} = $${salePrice.toFixed(2)}`;

    return {
      percent: pct,
      salePrice,
      savings,
      multiplier,
      stepCalculation,
    };
  });
}

/**
 * Pre-computed common prices matrix ($20, $25, $30, $40, $50, $60, $75, $80, $100, $150, $200)
 * across key discounts (10%, 15%, 20%, 25%, 30%, 40%, 50%, 75%).
 * Directly answers high-volume long-tail searches (e.g. "30 off of 50$", "20$ with 30 off", "60 off 25.00").
 */
export function generateCommonPricesMatrix(): CommonPriceMatrixEntry[] {
  const commonPrices = [20, 25, 30, 40, 50, 60, 75, 80, 100, 150, 200];
  const standardDiscounts = [10, 15, 20, 25, 30, 40, 50, 75];

  return commonPrices.map((price) => {
    const discounts: Record<number, { salePrice: number; savings: number }> = {};
    for (const d of standardDiscounts) {
      const sav = round2(price * (d / 100));
      const sale = round2(price - sav);
      discounts[d] = { salePrice: sale, savings: sav };
    }
    return {
      price,
      discounts,
    };
  });
}
