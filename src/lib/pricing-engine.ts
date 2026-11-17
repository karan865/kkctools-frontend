/**
 * Pricing Engine — Pure mathematical functions for Markup, Gross Margin,
 * Multipliers, Landed Costs with Fees, Tax, Price Endings, and Price Chains.
 *
 * Shared engine between Markup Calculator and Profit Margin Calculator.
 *
 * Rules:
 * - Pure functions only. Zero I/O, zero network, zero Date.now().
 * - Returns null (not NaN or Infinity) for undefined cases (e.g. cost = 0 or margin >= 100%).
 * - Normalises floating point precision artifacts and -0 to 0.
 * - Precision preserved; display rounding handled by UI formatters.
 */

export interface LandedCostItem {
  name: string;
  amount: number;
}

export interface LandedCostInput {
  baseCost: number;
  items?: LandedCostItem[];
  feePercent?: number; // Payment or marketplace fee charged on selling price (0-100)
}

export interface LandedCostResult {
  subtotalCost: number;
  effectiveFeePercent: number;
  requiredPriceMarkup: (markupPercent: number) => number | null;
  requiredPriceMargin: (marginPercent: number) => number | null;
}

export interface PriceChainTier {
  role: string; // e.g. "Maker / Factory", "Wholesale Distributor", "Retailer"
  markupPercent: number; // e.g. 50%
}

export interface PriceChainRow {
  role: string;
  buyPrice: number;
  markupPercent: number;
  sellPrice: number;
  profit: number;
  marginPercent: number;
  multiplier: number;
}

export interface PriceChainResult {
  rows: PriceChainRow[];
  totalMultiplier: number;
  consumerPrice: number;
  totalSystemProfit: number;
}

export interface ProductListRowInput {
  id?: string;
  name: string;
  cost: number;
  markupPercent?: number;
}

export interface ProductListRowOutput {
  id?: string;
  name: string;
  cost: number;
  markupPercent: number;
  price: number;
  profit: number;
  marginPercent: number;
}

export interface MarkupMarginRow {
  markupPercent: number;
  marginPercent: number;
  multiplier: number;
  exampleCost: number;
  examplePrice: number;
  exampleProfit: number;
}

export type PriceEndingOption = 'none' | '99' | '95' | '49' | 'whole' | 'up5';

/**
 * Normalises floating point jitter (e.g. 0.15000000000000002 -> 0.15) and -0 to +0.
 */
function cleanNumber(n: number): number {
  if (Object.is(n, -0)) return 0;
  if (!Number.isFinite(n)) return n;
  const rounded = Math.round(n * 1e12) / 1e12;
  return Object.is(rounded, -0) ? 0 : rounded;
}

/**
 * Selling Price from Cost and Markup Percentage
 * Formula: price = cost * (1 + markup% / 100)
 */
export function priceFromMarkup(cost: number, markupPercent: number): number {
  if (!Number.isFinite(cost) || !Number.isFinite(markupPercent)) return 0;
  const result = cost * (1 + markupPercent / 100);
  return cleanNumber(result);
}

/**
 * Markup Percentage from Cost and Selling Price
 * Formula: markup% = ((price - cost) / cost) * 100
 * Returns null if cost <= 0 (cannot markup a zero baseline).
 */
export function markupFromPrice(cost: number, price: number): number | null {
  if (cost <= 0 || !Number.isFinite(cost) || !Number.isFinite(price)) {
    return null;
  }
  const result = ((price - cost) / cost) * 100;
  return cleanNumber(result);
}

/**
 * Cost from Selling Price and Markup Percentage
 * Formula: cost = price / (1 + markup% / 100)
 * Returns null if markup% <= -100 (division by zero / total loss).
 */
export function costFromPrice(price: number, markupPercent: number): number | null {
  if (!Number.isFinite(price) || !Number.isFinite(markupPercent) || markupPercent <= -100) {
    return null;
  }
  const factor = 1 + markupPercent / 100;
  if (factor === 0) return null;
  const result = price / factor;
  return cleanNumber(result);
}

/**
 * Cost from Selling Price and Profit
 * Formula: cost = price - profit
 */
export function costFromPriceAndProfit(price: number, profit: number): number {
  if (!Number.isFinite(price) || !Number.isFinite(profit)) return 0;
  return cleanNumber(price - profit);
}

/**
 * Selling Price from Cost and Profit
 * Formula: price = cost + profit
 */
export function priceFromCostAndProfit(cost: number, profit: number): number {
  if (!Number.isFinite(cost) || !Number.isFinite(profit)) return 0;
  return cleanNumber(cost + profit);
}

/**
 * Selling Price from Cost and Target Gross Margin Percentage
 * Formula: price = cost / (1 - margin% / 100)
 * Returns null if margin% >= 100% (requires infinite price to achieve 100% margin on positive cost).
 */
export function priceFromMargin(cost: number, marginPercent: number): number | null {
  if (!Number.isFinite(cost) || !Number.isFinite(marginPercent) || marginPercent >= 100) {
    return null;
  }
  const factor = 1 - marginPercent / 100;
  if (factor <= 0) return null;
  const result = cost / factor;
  return cleanNumber(result);
}

/**
 * Gross Margin Percentage from Cost and Selling Price
 * Formula: margin% = ((price - cost) / price) * 100
 * Returns null if price <= 0.
 */
export function marginFromPrice(cost: number, price: number): number | null {
  if (price <= 0 || !Number.isFinite(cost) || !Number.isFinite(price)) {
    return null;
  }
  const result = ((price - cost) / price) * 100;
  return cleanNumber(result);
}

/**
 * Convert Markup % to Gross Margin %
 * Formula: margin% = (markup% / (100 + markup%)) * 100
 * Or in decimals: g = m / (1 + m)
 */
export function marginFromMarkup(markupPercent: number): number | null {
  if (!Number.isFinite(markupPercent) || markupPercent <= -100) {
    return null;
  }
  const m = markupPercent / 100;
  const result = (m / (1 + m)) * 100;
  return cleanNumber(result);
}

/**
 * Convert Gross Margin % to Markup %
 * Formula: markup% = (margin% / (100 - margin%)) * 100
 * Or in decimals: m = g / (1 - g)
 * Returns null if margin% >= 100%.
 */
export function markupFromMargin(marginPercent: number): number | null {
  if (!Number.isFinite(marginPercent) || marginPercent >= 100) {
    return null;
  }
  const g = marginPercent / 100;
  const result = (g / (1 - g)) * 100;
  return cleanNumber(result);
}

/**
 * Pricing Multiplier from Cost and Selling Price
 * Formula: multiplier = price / cost (e.g. Keystone = 2.0x)
 * Returns null if cost <= 0.
 */
export function multiplier(cost: number, price: number): number | null {
  if (cost <= 0 || !Number.isFinite(cost) || !Number.isFinite(price)) {
    return null;
  }
  const result = price / cost;
  return cleanNumber(result);
}

/**
 * Landed Cost with Payment / Marketplace Fee Adjustment
 * When a platform (e.g. Shopify, Amazon, Stripe) charges a fee % on the final selling price:
 * Net revenue received = price * (1 - feePct)
 * To achieve target markup m on landed cost c:
 *   price * (1 - feePct) = c * (1 + m)
 *   => price = (c * (1 + m)) / (1 - feePct)
 * To achieve target gross margin g on landed cost c:
 *   price * (1 - feePct) = c / (1 - g) ... or margin on revenue
 *   margin = (price - fee - cost) / price = 1 - feePct - cost/price = g
 *   => price = cost / (1 - g - feePct)
 */
export function calculateLandedCost(input: LandedCostInput): LandedCostResult {
  const base = Number.isFinite(input.baseCost) ? input.baseCost : 0;
  const itemsSum = (input.items || []).reduce((acc, it) => acc + (Number.isFinite(it.amount) ? it.amount : 0), 0);
  const subtotalCost = cleanNumber(base + itemsSum);

  const feePct = Number.isFinite(input.feePercent) ? Math.max(0, input.feePercent || 0) / 100 : 0;

  return {
    subtotalCost,
    effectiveFeePercent: cleanNumber(feePct * 100),
    requiredPriceMarkup: (mPercent: number) => {
      if (feePct >= 1) return null;
      const m = mPercent / 100;
      const price = (subtotalCost * (1 + m)) / (1 - feePct);
      return cleanNumber(price);
    },
    requiredPriceMargin: (gPercent: number) => {
      const g = gPercent / 100;
      const denom = 1 - g - feePct;
      if (denom <= 0) return null;
      const price = subtotalCost / denom;
      return cleanNumber(price);
    },
  };
}

/**
 * Add Tax to Price (Ex-tax to Inc-tax)
 * Formula: priceInc = priceEx * (1 + taxRate / 100)
 */
export function addTax(priceExTax: number, taxRatePercent: number): number {
  if (!Number.isFinite(priceExTax) || !Number.isFinite(taxRatePercent)) return 0;
  const result = priceExTax * (1 + taxRatePercent / 100);
  return cleanNumber(result);
}

/**
 * Strip Tax from Price (Inc-tax to Ex-tax)
 * Formula: priceEx = priceInc / (1 + taxRate / 100)
 */
export function stripTax(priceIncTax: number, taxRatePercent: number): number {
  if (!Number.isFinite(priceIncTax) || !Number.isFinite(taxRatePercent) || taxRatePercent <= -100) {
    return 0;
  }
  const factor = 1 + taxRatePercent / 100;
  if (factor === 0) return 0;
  const result = priceIncTax / factor;
  return cleanNumber(result);
}

/**
 * Price Ending Formatting & Adjustment (.99, .95, .49, whole dollar, nearest 5)
 * Adjusts price to popular psychological retail price points while ensuring:
 * - Rounded price never drops below cost.
 * - Recalculates the actual resulting markup % and margin % after rounding.
 */
export function roundPriceEnding(
  calculatedPrice: number,
  ending: PriceEndingOption,
  cost: number = 0
): { roundedPrice: number; actualMarkupPercent: number | null; actualMarginPercent: number | null } {
  if (!Number.isFinite(calculatedPrice) || calculatedPrice <= 0) {
    return {
      roundedPrice: 0,
      actualMarkupPercent: null,
      actualMarginPercent: null,
    };
  }

  let rounded = calculatedPrice;

  switch (ending) {
    case '99':
      // e.g. 59.20 -> 59.99; 59.99 -> 59.99
      rounded = Math.floor(calculatedPrice) + 0.99;
      // If rounding dropped below calculatedPrice by more than $0.20, bump up by $1
      if (rounded < calculatedPrice - 0.05) {
        rounded += 1;
      }
      break;
    case '95':
      rounded = Math.floor(calculatedPrice) + 0.95;
      if (rounded < calculatedPrice - 0.05) {
        rounded += 1;
      }
      break;
    case '49':
      rounded = Math.floor(calculatedPrice) + 0.49;
      if (rounded < calculatedPrice - 0.05) {
        rounded += 1;
      }
      break;
    case 'whole':
      rounded = Math.round(calculatedPrice);
      break;
    case 'up5':
      rounded = Math.ceil(calculatedPrice / 5) * 5;
      break;
    case 'none':
    default:
      rounded = cleanNumber(calculatedPrice);
      break;
  }

  // Safety constraint: Never round below cost!
  if (cost > 0 && rounded < cost) {
    rounded = cleanNumber(Math.ceil(cost));
    if (ending === '99') rounded = Math.floor(cost) + 0.99;
    if (rounded < cost) rounded += 1;
  }

  const finalPrice = cleanNumber(rounded);
  const actualMarkup = markupFromPrice(cost, finalPrice);
  const actualMargin = marginFromPrice(cost, finalPrice);

  return {
    roundedPrice: finalPrice,
    actualMarkupPercent: actualMarkup,
    actualMarginPercent: actualMargin,
  };
}

/**
 * Sequential Price Chain (Maker -> Wholesaler -> Retailer)
 * Calculates price propagation and margin at each distribution step.
 */
export function calculatePriceChain(
  initialMakerCost: number,
  tiers: PriceChainTier[]
): PriceChainResult {
  if (initialMakerCost <= 0 || !tiers || tiers.length === 0) {
    return {
      rows: [],
      totalMultiplier: 1,
      consumerPrice: 0,
      totalSystemProfit: 0,
    };
  }

  let currentBuyPrice = initialMakerCost;
  let totalProfit = 0;
  const rows: PriceChainRow[] = [];

  for (const tier of tiers) {
    const markup = Number.isFinite(tier.markupPercent) ? tier.markupPercent : 0;
    const sellPrice = priceFromMarkup(currentBuyPrice, markup);
    const profit = cleanNumber(sellPrice - currentBuyPrice);
    const margin = marginFromPrice(currentBuyPrice, sellPrice) || 0;
    const mult = multiplier(currentBuyPrice, sellPrice) || 1;

    rows.push({
      role: tier.role,
      buyPrice: currentBuyPrice,
      markupPercent: markup,
      sellPrice,
      profit,
      marginPercent: margin,
      multiplier: mult,
    });

    totalProfit = cleanNumber(totalProfit + profit);
    currentBuyPrice = sellPrice;
  }

  const consumerPrice = currentBuyPrice;
  const totalMult = multiplier(initialMakerCost, consumerPrice) || 1;

  return {
    rows,
    totalMultiplier: totalMult,
    consumerPrice,
    totalSystemProfit: totalProfit,
  };
}

/**
 * Product List Batch Calculator (Parses TSV/CSV & computes per-item prices)
 */
export function calculateProductList(
  rows: ProductListRowInput[],
  defaultMarkupPercent: number = 50
): ProductListRowOutput[] {
  return (rows || []).map((row) => {
    const cost = Number.isFinite(row.cost) ? row.cost : 0;
    const markup = Number.isFinite(row.markupPercent) ? row.markupPercent! : defaultMarkupPercent;
    const price = priceFromMarkup(cost, markup);
    const profit = cleanNumber(price - cost);
    const margin = marginFromPrice(cost, price) || 0;

    return {
      id: row.id,
      name: row.name || 'Untitled Product',
      cost,
      markupPercent: markup,
      price,
      profit,
      marginPercent: margin,
    };
  });
}

/**
 * Parse raw pasted spreadsheet text (tab-separated or comma-separated) into ProductListRowInput
 */
export function parsePastedSpreadsheet(text: string): ProductListRowInput[] {
  if (!text || typeof text !== 'string') return [];
  const lines = text.trim().split(/\r?\n/);
  const rows: ProductListRowInput[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Detect tab vs comma
    const delimiter = line.includes('\t') ? '\t' : ',';
    const parts = line.split(delimiter).map((p) => p.trim().replace(/^["']|["']$/g, ''));

    if (parts.length >= 2) {
      const name = parts[0];
      // Clean currency symbols and commas from cost e.g. "$1,250.00" -> 1250.00
      const costClean = parts[1].replace(/[^0-9.-]+/g, '');
      const cost = parseFloat(costClean);

      let markup: number | undefined = undefined;
      if (parts.length >= 3) {
        const markupClean = parts[2].replace(/[^0-9.-]+/g, '');
        const parsedMarkup = parseFloat(markupClean);
        if (Number.isFinite(parsedMarkup)) markup = parsedMarkup;
      }

      if (Number.isFinite(cost)) {
        rows.push({
          id: `item-${i + 1}`,
          name: name || `Product ${i + 1}`,
          cost,
          markupPercent: markup,
        });
      }
    } else if (parts.length === 1) {
      // Just a single number on the line
      const costClean = parts[0].replace(/[^0-9.-]+/g, '');
      const cost = parseFloat(costClean);
      if (Number.isFinite(cost)) {
        rows.push({
          id: `item-${i + 1}`,
          name: `Product ${i + 1}`,
          cost,
        });
      }
    }
  }

  return rows;
}

/**
 * Markup ↔ Gross Margin Standard Reference Table Generator
 * Produces standard benchmark markups: 10%, 20%, 25%, 30%, 33.33%, 40%, 50%, 60%, 75%, 100%, 150%, 200%, 300%
 */
export function generateMarkupMarginTable(baseCost: number = 100): MarkupMarginRow[] {
  const markups = [10, 15, 20, 25, 30, 33.3333, 40, 50, 60, 66.6667, 75, 100, 150, 200, 300];

  return markups.map((m) => {
    const price = priceFromMarkup(baseCost, m);
    const profit = cleanNumber(price - baseCost);
    const margin = marginFromMarkup(m) || 0;
    const mult = multiplier(baseCost, price) || 1;

    return {
      markupPercent: cleanNumber(m),
      marginPercent: cleanNumber(margin),
      multiplier: cleanNumber(mult),
      exampleCost: baseCost,
      examplePrice: price,
      exampleProfit: profit,
    };
  });
}

/**
 * Format helper for currency display
 */
export function formatCurrency(
  amount: number,
  symbol: string = '$',
  decimals: number = 2
): string {
  if (!Number.isFinite(amount)) return `${symbol}0.00`;
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${amount < 0 ? '−' : ''}${symbol}${formatted}`;
}

/**
 * Format helper for percentages
 */
export function formatPercent(val: number | null, decimals: number = 2): string {
  if (val === null || !Number.isFinite(val)) return '0.00%';
  const clean = cleanNumber(val);
  return `${clean.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
}
