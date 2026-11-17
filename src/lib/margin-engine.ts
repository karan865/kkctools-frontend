/**
 * Margin Engine — Calculations for Gross Margin, Operating Margin (EBIT),
 * EBITDA Margin, Net Profit Margin, Waterfall P&L, Target Margin Pricing,
 * and Multi-Product Blended Margin.
 *
 * Rules:
 * - Pure functions only. Zero I/O, zero network, zero side effects.
 * - Division by zero safely returns null.
 * - Normalises floating-point precision artifacts and -0 to 0.
 */

import {
  priceFromMargin,
  markupFromMargin,
  multiplier,
  calculateLandedCost,
} from './pricing-engine';

export interface GrossMarginInput {
  revenue: number;
  cogs: number;
  units?: number;
}

export interface GrossMarginResult {
  revenue: number;
  cogs: number;
  grossProfit: number;
  grossMarginPercent: number | null;
  markupPercent: number | null;
  revenuePerUnit?: number;
  costPerUnit?: number;
  profitPerUnit?: number;
  multiplier: number | null;
  isNegative: boolean;
}

export interface OperatingExpensesDetail {
  rent?: number;
  salaries?: number;
  marketing?: number;
  utilities?: number;
  other?: number;
}

export interface PnLInput {
  grossSales: number;
  returnsAndAllowances?: number;
  cogs: number;
  operatingExpenses: number | OperatingExpensesDetail;
  depreciationAmortization?: number;
  interest?: number;
  taxes?: number;
}

export interface WaterfallStep {
  label: string;
  amount: number;
  percentOfRevenue: number | null;
  type: 'base' | 'deduction' | 'subtotal' | 'final';
}

export interface PnLResult {
  grossSales: number;
  returnsAndAllowances: number;
  netRevenue: number;
  cogs: number;
  grossProfit: number;
  grossMarginPercent: number | null;
  operatingExpenses: number;
  operatingProfit: number; // EBIT
  operatingMarginPercent: number | null;
  depreciationAmortization: number;
  ebitda: number;
  ebitdaMarginPercent: number | null;
  interest: number;
  taxes: number;
  netProfit: number;
  netMarginPercent: number | null;
  waterfall: WaterfallStep[];
}

export interface ProductMixItemInput {
  name: string;
  units: number;
  pricePerUnit: number;
  costPerUnit: number;
}

export interface ProductMixItemOutput {
  name: string;
  units: number;
  pricePerUnit: number;
  costPerUnit: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  marginPercent: number | null;
  revenueSharePercent: number;
}

export interface ProductMixResult {
  items: ProductMixItemOutput[];
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  blendedMarginPercent: number | null;
  simpleAverageMarginPercent: number | null;
}

/**
 * Normalises floating point jitter (e.g. 0.15000000000000002 -> 0.15) and -0 to +0.
 */
function clean(n: number): number {
  if (Object.is(n, -0)) return 0;
  if (!Number.isFinite(n)) return n;
  const rounded = Math.round(n * 1e12) / 1e12;
  return Object.is(rounded, -0) ? 0 : rounded;
}

/**
 * Calculate Gross Margin from Revenue and Cost of Goods Sold (COGS)
 * Formula:
 * Gross Profit = Revenue − COGS
 * Gross Margin % = (Gross Profit ÷ Revenue) × 100
 * Markup % = (Gross Profit ÷ COGS) × 100
 */
export function calculateGrossMargin(input: GrossMarginInput): GrossMarginResult {
  const rev = Number.isFinite(input.revenue) ? input.revenue : 0;
  const cogs = Number.isFinite(input.cogs) ? input.cogs : 0;
  const units = Number.isFinite(input.units) && input.units! > 0 ? input.units! : undefined;

  const grossProfit = clean(rev - cogs);
  const grossMarginPercent = rev > 0 ? clean((grossProfit / rev) * 100) : null;
  const markupPercent = cogs > 0 ? clean((grossProfit / cogs) * 100) : null;
  const mult = cogs > 0 ? multiplier(cogs, rev) : null;

  const res: GrossMarginResult = {
    revenue: rev,
    cogs,
    grossProfit,
    grossMarginPercent,
    markupPercent,
    multiplier: mult,
    isNegative: grossProfit < 0,
  };

  if (units) {
    res.revenuePerUnit = clean(rev / units);
    res.costPerUnit = clean(cogs / units);
    res.profitPerUnit = clean(grossProfit / units);
  }

  return res;
}

/**
 * Calculate Full Income Statement (P&L) Margins:
 * Gross Margin, Operating Margin (EBIT), EBITDA Margin, and Net Profit Margin.
 */
export function calculatePnL(input: PnLInput): PnLResult {
  const grossSales = Number.isFinite(input.grossSales) ? input.grossSales : 0;
  const returns = Number.isFinite(input.returnsAndAllowances) ? input.returnsAndAllowances! : 0;
  const netRevenue = clean(Math.max(0, grossSales - returns));

  const cogs = Number.isFinite(input.cogs) ? input.cogs : 0;
  const grossProfit = clean(netRevenue - cogs);
  const grossMarginPercent = netRevenue > 0 ? clean((grossProfit / netRevenue) * 100) : null;

  // Operating Expenses
  let opex = 0;
  if (typeof input.operatingExpenses === 'number') {
    opex = Number.isFinite(input.operatingExpenses) ? input.operatingExpenses : 0;
  } else if (typeof input.operatingExpenses === 'object' && input.operatingExpenses !== null) {
    const o = input.operatingExpenses;
    opex =
      (o.rent || 0) +
      (o.salaries || 0) +
      (o.marketing || 0) +
      (o.utilities || 0) +
      (o.other || 0);
  }
  opex = clean(opex);

  const operatingProfit = clean(grossProfit - opex); // EBIT
  const operatingMarginPercent =
    netRevenue > 0 ? clean((operatingProfit / netRevenue) * 100) : null;

  // D&A
  const da = Number.isFinite(input.depreciationAmortization)
    ? input.depreciationAmortization!
    : 0;
  const ebitda = clean(operatingProfit + da);
  const ebitdaMarginPercent = netRevenue > 0 ? clean((ebitda / netRevenue) * 100) : null;

  // Interest & Tax
  const interest = Number.isFinite(input.interest) ? input.interest! : 0;
  const taxes = Number.isFinite(input.taxes) ? input.taxes! : 0;

  const netProfit = clean(operatingProfit - interest - taxes);
  const netMarginPercent = netRevenue > 0 ? clean((netProfit / netRevenue) * 100) : null;

  // P&L Waterfall Steps
  const pctOfRev = (val: number) => (netRevenue > 0 ? clean((val / netRevenue) * 100) : null);

  const waterfall: WaterfallStep[] = [
    { label: 'Net Revenue', amount: netRevenue, percentOfRevenue: 100, type: 'base' },
    { label: 'Cost of Goods Sold (COGS)', amount: -cogs, percentOfRevenue: pctOfRev(-cogs), type: 'deduction' },
    { label: 'Gross Profit', amount: grossProfit, percentOfRevenue: grossMarginPercent, type: 'subtotal' },
    { label: 'Operating Expenses (OPEX)', amount: -opex, percentOfRevenue: pctOfRev(-opex), type: 'deduction' },
    { label: 'Operating Profit (EBIT)', amount: operatingProfit, percentOfRevenue: operatingMarginPercent, type: 'subtotal' },
    { label: 'Interest & Taxes', amount: -(interest + taxes), percentOfRevenue: pctOfRev(-(interest + taxes)), type: 'deduction' },
    { label: 'Net Profit', amount: netProfit, percentOfRevenue: netMarginPercent, type: 'final' },
  ];

  return {
    grossSales,
    returnsAndAllowances: returns,
    netRevenue,
    cogs,
    grossProfit,
    grossMarginPercent,
    operatingExpenses: opex,
    operatingProfit,
    operatingMarginPercent,
    depreciationAmortization: da,
    ebitda,
    ebitdaMarginPercent,
    interest,
    taxes,
    netProfit,
    netMarginPercent,
    waterfall,
  };
}

/**
 * Calculate Selling Price for a Desired Target Gross Margin
 * Reuses core logic from pricing-engine with optional payment/marketplace fee %.
 */
export function priceForTargetMargin(
  cost: number,
  targetMarginPercent: number,
  feePercent: number = 0
): {
  sellingPrice: number | null;
  grossProfit: number | null;
  equivalentMarkupPercent: number | null;
} {
  if (feePercent > 0) {
    const landed = calculateLandedCost({ baseCost: cost, feePercent });
    const p = landed.requiredPriceMargin(targetMarginPercent);
    if (p === null) return { sellingPrice: null, grossProfit: null, equivalentMarkupPercent: null };
    const profit = clean(p - cost);
    const markup = cost > 0 ? clean((profit / cost) * 100) : null;
    return {
      sellingPrice: p,
      grossProfit: profit,
      equivalentMarkupPercent: markup,
    };
  }

  const p = priceFromMargin(cost, targetMarginPercent);
  if (p === null) {
    return { sellingPrice: null, grossProfit: null, equivalentMarkupPercent: null };
  }
  const profit = clean(p - cost);
  const markup = markupFromMargin(targetMarginPercent);

  return {
    sellingPrice: p,
    grossProfit: profit,
    equivalentMarkupPercent: markup,
  };
}

/**
 * Calculate Multi-Product Product Mix and Blended Gross Margin
 *
 * NOTE: The blended gross margin is strictly calculated as:
 *   Blended Margin = (Total Profit across all products) ÷ (Total Revenue across all products)
 * It is NEVER the simple arithmetic average of the individual product margins!
 */
export function calculateProductMix(items: ProductMixItemInput[]): ProductMixResult {
  if (!items || items.length === 0) {
    return {
      items: [],
      totalRevenue: 0,
      totalCost: 0,
      totalProfit: 0,
      blendedMarginPercent: null,
      simpleAverageMarginPercent: null,
    };
  }

  let totalRev = 0;
  let totalCost = 0;
  let totalProfit = 0;

  const intermediate = items.map((item) => {
    const u = Math.max(0, Number.isFinite(item.units) ? item.units : 0);
    const p = Math.max(0, Number.isFinite(item.pricePerUnit) ? item.pricePerUnit : 0);
    const c = Math.max(0, Number.isFinite(item.costPerUnit) ? item.costPerUnit : 0);

    const rev = clean(u * p);
    const cost = clean(u * c);
    const profit = clean(rev - cost);
    const margin = rev > 0 ? clean((profit / rev) * 100) : null;

    totalRev = clean(totalRev + rev);
    totalCost = clean(totalCost + cost);
    totalProfit = clean(totalProfit + profit);

    return {
      name: item.name || 'Product',
      units: u,
      pricePerUnit: p,
      costPerUnit: c,
      totalRevenue: rev,
      totalCost: cost,
      totalProfit: profit,
      marginPercent: margin,
    };
  });

  // Calculate revenue share per product
  const outputItems: ProductMixItemOutput[] = intermediate.map((it) => ({
    ...it,
    revenueSharePercent: totalRev > 0 ? clean((it.totalRevenue / totalRev) * 100) : 0,
  }));

  const blendedMarginPercent = totalRev > 0 ? clean((totalProfit / totalRev) * 100) : null;

  // Simple arithmetic average of valid percentage margins for comparison
  const validMargins = outputItems
    .map((it) => it.marginPercent)
    .filter((m): m is number => m !== null);
  const simpleAvg =
    validMargins.length > 0
      ? clean(validMargins.reduce((a, b) => a + b, 0) / validMargins.length)
      : null;

  return {
    items: outputItems,
    totalRevenue: totalRev,
    totalCost,
    totalProfit,
    blendedMarginPercent,
    simpleAverageMarginPercent: simpleAvg,
  };
}
