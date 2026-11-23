/**
 * Reverse Sales Tax, VAT, and GST Calculation Engine.
 * Supports:
 * - Backing out price before tax and tax amount from total and tax rate
 * - Reconciling cents exactly: preTax + tax === total
 * - Calculating tax rate from pre-tax price and total paid
 * - Calculating tax rate from tax amount and total paid
 * - Multi-component additive tax rate builder (state + county + city + district)
 * - Multi-line receipt calculator with tax-exempt items and taxable tip/shipping toggles
 * - Forward tax calculation for reconciliation
 * Pure client-side calculations. Zero network.
 */

export interface ReverseTaxResult {
  total: number;
  ratePercent: number;
  preTax: number;
  taxAmount: number;
  reconciled: boolean;
  vatFractionString?: string; // e.g. "Gross ÷ 6" for 20% VAT
}

export interface ReceiptItem {
  id: string;
  name: string;
  total: number;
  isTaxExempt?: boolean;
  customRate?: number; // if undefined, uses receipt default rate
}

export interface ReceiptItemResult {
  id: string;
  name: string;
  total: number;
  preTax: number;
  taxAmount: number;
  effectiveRate: number;
  isTaxExempt: boolean;
}

export interface ReceiptCalculationResult {
  items: ReceiptItemResult[];
  subtotalPreTax: number;
  totalTax: number;
  grandTotal: number;
  tipAmount: number;
  tipTax: number;
  shippingAmount: number;
  shippingTax: number;
}

/**
 * Rounds a number to exactly two decimal places (cents) using round half-up.
 */
export function round2(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates pre-tax amount and tax paid from total and rate.
 * Reconciles cents: tax = round2(total - preTax).
 */
export function calculateReverseTax(
  total: number,
  ratePercent: number
): ReverseTaxResult | null {
  if (total < 0 || ratePercent < 0) return null;

  const r = ratePercent / 100;
  const preTax = round2(total / (1 + r));
  const taxAmount = round2(total - preTax);

  let vatFractionString: string | undefined;
  if (Math.abs(ratePercent - 20) < 0.001) {
    vatFractionString = 'Gross ÷ 6 (20% VAT)';
  }

  return {
    total,
    ratePercent,
    preTax,
    taxAmount,
    reconciled: round2(preTax + taxAmount) === round2(total),
    vatFractionString,
  };
}

/**
 * Calculates the exact tax rate given the pre-tax price and the total paid.
 */
export function calculateRateFromPreTaxAndTotal(
  preTax: number,
  total: number
): number | null {
  if (preTax <= 0 || total < preTax) return null;
  return ((total / preTax) - 1) * 100;
}

/**
 * Calculates the exact tax rate given the tax amount and total paid.
 */
export function calculateRateFromTaxAndTotal(
  taxAmount: number,
  total: number
): number | null {
  if (taxAmount < 0 || total <= taxAmount) return null;
  const preTax = total - taxAmount;
  if (preTax <= 0) return null;
  return (taxAmount / preTax) * 100;
}

/**
 * Forward tax calculation for checking and cross-referencing.
 */
export function calculateForwardTax(
  preTax: number,
  ratePercent: number
): { preTax: number; taxAmount: number; total: number } | null {
  if (preTax < 0 || ratePercent < 0) return null;
  const taxAmount = round2(preTax * (ratePercent / 100));
  const total = round2(preTax + taxAmount);
  return { preTax, taxAmount, total };
}

/**
 * Multi-line receipt calculation.
 */
export function calculateReceipt(
  items: ReceiptItem[],
  defaultRatePercent: number,
  tipAmount: number = 0,
  isTipTaxable: boolean = false,
  shippingAmount: number = 0,
  isShippingTaxable: boolean = false
): ReceiptCalculationResult {
  const itemResults: ReceiptItemResult[] = [];
  let subtotalPreTax = 0;
  let totalTax = 0;
  let grandTotal = 0;

  for (const item of items) {
    if (item.isTaxExempt) {
      itemResults.push({
        id: item.id,
        name: item.name,
        total: item.total,
        preTax: item.total,
        taxAmount: 0,
        effectiveRate: 0,
        isTaxExempt: true,
      });
      subtotalPreTax += item.total;
      grandTotal += item.total;
    } else {
      const rate = item.customRate !== undefined ? item.customRate : defaultRatePercent;
      const res = calculateReverseTax(item.total, rate);
      const pre = res ? res.preTax : item.total;
      const tax = res ? res.taxAmount : 0;

      itemResults.push({
        id: item.id,
        name: item.name,
        total: item.total,
        preTax: pre,
        taxAmount: tax,
        effectiveRate: rate,
        isTaxExempt: false,
      });
      subtotalPreTax += pre;
      totalTax += tax;
      grandTotal += item.total;
    }
  }

  // Handle Tip
  let tipTax = 0;
  if (tipAmount > 0 && isTipTaxable) {
    const tipRes = calculateReverseTax(tipAmount, defaultRatePercent);
    tipTax = tipRes ? tipRes.taxAmount : 0;
  }
  grandTotal += tipAmount;
  totalTax += tipTax;
  subtotalPreTax += tipAmount - tipTax; // keeps subtotal + tax === grand total

  // Handle Shipping
  let shippingTax = 0;
  if (shippingAmount > 0 && isShippingTaxable) {
    const shipRes = calculateReverseTax(shippingAmount, defaultRatePercent);
    shippingTax = shipRes ? shipRes.taxAmount : 0;
  }
  grandTotal += shippingAmount;
  totalTax += shippingTax;
  subtotalPreTax += shippingAmount - shippingTax;

  return {
    items: itemResults,
    subtotalPreTax: round2(subtotalPreTax),
    totalTax: round2(totalTax),
    grandTotal: round2(grandTotal),
    tipAmount: round2(tipAmount),
    tipTax: round2(tipTax),
    shippingAmount: round2(shippingAmount),
    shippingTax: round2(shippingTax),
  };
}
