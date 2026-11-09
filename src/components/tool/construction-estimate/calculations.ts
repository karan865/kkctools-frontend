import { Category, Currency, EstimateTotals, LineItem } from './types';
import { CURRENCIES } from './constants';

export function roundToCents(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function calculateLineTotal(quantity: number, unitPrice: number): number {
  if (isNaN(quantity) || isNaN(unitPrice) || quantity <= 0 || unitPrice <= 0) {
    return 0;
  }
  return roundToCents(quantity * unitPrice);
}

export function calculateSubtotal(lineItems: LineItem[]): number {
  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    return 0;
  }
  const sum = lineItems.reduce((acc, item) => acc + (item.total || 0), 0);
  return roundToCents(sum);
}

export function calculateCategorySubtotals(lineItems: LineItem[]): Record<Category, number> {
  const result: Record<Category, number> = {
    materials: 0,
    labor: 0,
    equipment: 0,
    subcontractor: 0,
    permits: 0,
    overhead: 0,
    other: 0,
  };

  if (!Array.isArray(lineItems)) return result;

  for (const item of lineItems) {
    if (item.category && item.category in result) {
      result[item.category] = roundToCents(result[item.category] + (item.total || 0));
    } else {
      result.other = roundToCents(result.other + (item.total || 0));
    }
  }

  return result;
}

export function calculateTax(subtotal: number, taxRate: number): number {
  if (isNaN(subtotal) || isNaN(taxRate) || subtotal <= 0 || taxRate <= 0) {
    return 0;
  }
  return roundToCents((subtotal * taxRate) / 100);
}

export function calculateMarkup(subtotal: number, markupRate: number): number {
  if (isNaN(subtotal) || isNaN(markupRate) || subtotal <= 0 || markupRate <= 0) {
    return 0;
  }
  return roundToCents((subtotal * markupRate) / 100);
}

export function calculateGrandTotal(
  subtotal: number,
  taxAmount: number,
  markupAmount: number
): number {
  return roundToCents(subtotal + taxAmount + markupAmount);
}

export function calculateEstimateTotals(
  lineItems: LineItem[],
  taxRate: number,
  markupRate: number
): EstimateTotals {
  const subtotal = calculateSubtotal(lineItems);
  const categorySubtotals = calculateCategorySubtotals(lineItems);
  const taxAmount = calculateTax(subtotal, taxRate);
  const markupAmount = calculateMarkup(subtotal, markupRate);
  const grandTotal = calculateGrandTotal(subtotal, taxAmount, markupAmount);

  return {
    subtotal,
    categorySubtotals,
    taxAmount,
    markupAmount,
    grandTotal,
  };
}

export function formatCurrency(amount: number, currency: Currency = 'USD'): string {
  const curConfig = CURRENCIES.find((c) => c.value === currency) || CURRENCIES[0];
  try {
    return new Intl.NumberFormat(curConfig.locale, {
      style: 'currency',
      currency: curConfig.value,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(isNaN(amount) ? 0 : amount);
  } catch {
    // Fallback if locale or currency code is unsupported in environment
    const safeAmount = isNaN(amount) ? 0 : roundToCents(amount);
    return `${curConfig.symbol}${safeAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
