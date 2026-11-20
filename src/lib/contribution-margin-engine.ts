/**
 * Contribution Margin & CVP (Cost-Volume-Profit) Engine
 *
 * Implements standard managerial accounting CVP analysis:
 * - Contribution margin per unit and contribution margin ratio
 * - Break-even point in units and sales dollars
 * - Margin of safety (units, dollars, percentage)
 * - Degree of Operating Leverage (DOL) and sensitivity
 * - Target profit analysis (pre-tax and after-tax)
 * - Contribution-format income statement
 * - Multi-product sales-mix analysis
 *
 * 100% client-side, pure TypeScript, zero network calls.
 */

export interface SingleProductInput {
  sellingPrice: number;
  variableCostPerUnit: number;
  fixedCosts: number;
  unitsSold: number;
  targetProfit?: number;
  isTargetAfterTax?: boolean;
  taxRatePercent?: number;
  monthlyUnitVolume?: number;
}

export interface ContributionStatementItem {
  label: string;
  total: number;
  perUnit: number;
  percentage: number;
}

export interface ContributionIncomeStatement {
  salesRevenue: ContributionStatementItem;
  variableCosts: ContributionStatementItem;
  contributionMargin: ContributionStatementItem;
  fixedCosts: {
    label: string;
    total: number;
    perUnit: number | null;
    percentage: number | null;
  };
  operatingIncome: {
    label: string;
    total: number;
    perUnit: number | null;
    percentage: number | null;
  };
}

export interface SingleProductCvpResult {
  sellingPrice: number;
  variableCostPerUnit: number;
  fixedCosts: number;
  unitsSold: number;

  // CM Core
  cmPerUnit: number;
  cmRatio: number | null; // e.g. 0.40 for 40%
  totalCm: number;

  // Break-even
  breakEvenUnits: number | null;
  breakEvenSales: number | null;
  timeToBreakEvenMonths: number | null;
  isLossMakingPerUnit: boolean;

  // Actual performance
  totalRevenue: number;
  totalVariableCosts: number;
  operatingIncome: number;
  isOperatingProfit: boolean;

  // Margin of safety
  marginOfSafetyUnits: number | null;
  marginOfSafetySales: number | null;
  marginOfSafetyRatio: number | null; // e.g. 0.3333 for 33.33%

  // Operating Leverage
  dol: number | null; // Degree of Operating Leverage
  dolExplanation: string;
  profitImpactWithTenPctSalesIncrease: number | null;

  // Target profit
  targetProfitPreTax: number | null;
  targetProfitAfterTax: number | null;
  targetUnits: number | null;
  targetSales: number | null;

  // Income statement
  statement: ContributionIncomeStatement;

  // Step-by-step exam working
  steps: {
    step: number;
    title: string;
    formula: string;
    calculation: string;
    result: string;
  }[];
}

export interface ProductMixItemInput {
  id: string;
  name: string;
  sellingPrice: number;
  variableCostPerUnit: number;
  mixPercent?: number; // e.g. 60 for 60%
  units?: number;
}

export interface ProductMixItemResult {
  id: string;
  name: string;
  sellingPrice: number;
  variableCostPerUnit: number;
  cmPerUnit: number;
  cmRatio: number;
  mixPercent: number; // Normalized % (0 to 100)
  breakEvenUnits: number | null;
  breakEvenSales: number | null;
}

export interface SalesMixCvpResult {
  products: ProductMixItemResult[];
  fixedCosts: number;
  weightedCmPerUnit: number;
  weightedSellingPrice: number;
  weightedCmRatio: number;
  breakEvenTotalUnits: number | null;
  breakEvenTotalSales: number | null;
  isLossMakingWeighted: boolean;
}

export interface WhatIfScenarioInput {
  base: SingleProductInput;
  priceChangePct: number; // e.g. +10 or -5
  variableCostChangePct: number;
  fixedCostChangePct: number;
  volumeChangePct: number;
}

export interface WhatIfScenarioResult {
  scenarioName: string;
  sellingPrice: number;
  variableCostPerUnit: number;
  fixedCosts: number;
  unitsSold: number;
  cmPerUnit: number;
  cmRatio: number | null;
  breakEvenUnits: number | null;
  breakEvenSales: number | null;
  operatingIncome: number;
  incomeChangeFromBase: number;
  incomeChangePctFromBase: number | null;
}

/**
 * Calculate full single-product CVP analysis
 */
export function calculateSingleProductCvp(input: SingleProductInput): SingleProductCvpResult {
  const price = Math.max(0, input.sellingPrice);
  const vc = Math.max(0, input.variableCostPerUnit);
  const fixed = Math.max(0, input.fixedCosts);
  const units = Math.max(0, input.unitsSold);

  const cmUnit = price - vc;
  const isLossMaking = cmUnit <= 0;
  const cmRatio = price > 0 ? cmUnit / price : null;

  const totalRevenue = price * units;
  const totalVc = vc * units;
  const totalCm = cmUnit * units;
  const operatingIncome = totalCm - fixed;
  const isOperatingProfit = operatingIncome >= 0;

  // Break-even
  let breakEvenUnits: number | null = null;
  let breakEvenSales: number | null = null;
  let timeToBreakEvenMonths: number | null = null;

  if (!isLossMaking && cmUnit > 0) {
    breakEvenUnits = fixed / cmUnit;
    breakEvenSales = cmRatio && cmRatio > 0 ? fixed / cmRatio : breakEvenUnits * price;
    if (input.monthlyUnitVolume && input.monthlyUnitVolume > 0) {
      timeToBreakEvenMonths = breakEvenUnits / input.monthlyUnitVolume;
    }
  }

  // Margin of safety
  let mosUnits: number | null = null;
  let mosSales: number | null = null;
  let mosRatio: number | null = null;

  if (breakEvenUnits !== null && units > 0) {
    mosUnits = units - breakEvenUnits;
    mosSales = mosUnits * price;
    mosRatio = mosUnits / units;
  }

  // Degree of Operating Leverage (DOL)
  let dol: number | null = null;
  let dolExplanation = 'Undefined at zero operating income';
  let profitImpactTenPct: number | null = null;

  if (operatingIncome !== 0) {
    dol = totalCm / operatingIncome;
    if (operatingIncome > 0) {
      profitImpactTenPct = operatingIncome * (1 + dol * 0.1) - operatingIncome;
      dolExplanation = `A 10% increase in sales volume increases operating profit by ${(dol * 10).toFixed(1)}% (+$${Math.round(profitImpactTenPct).toLocaleString()}).`;
    } else {
      dolExplanation = `DOL is negative (${dol.toFixed(2)}) because the business operates at a loss at current volume.`;
    }
  }

  // Target profit
  let targetProfitPreTax: number | null = null;
  let targetProfitAfterTax: number | null = null;
  let targetUnits: number | null = null;
  let targetSales: number | null = null;

  if (input.targetProfit !== undefined && input.targetProfit > 0) {
    if (input.isTargetAfterTax) {
      targetProfitAfterTax = input.targetProfit;
      const t = Math.min(0.99, Math.max(0, (input.taxRatePercent ?? 0) / 100));
      targetProfitPreTax = t < 1 ? targetProfitAfterTax / (1 - t) : targetProfitAfterTax;
    } else {
      targetProfitPreTax = input.targetProfit;
    }

    if (!isLossMaking && cmUnit > 0) {
      targetUnits = (fixed + targetProfitPreTax) / cmUnit;
      targetSales = targetUnits * price;
    }
  }

  // Contribution-format income statement
  const revPct = 1.0;
  const vcPct = price > 0 ? totalVc / (totalRevenue || 1) : 0;
  const cmPct = cmRatio ?? 0;

  const statement: ContributionIncomeStatement = {
    salesRevenue: {
      label: 'Sales Revenue',
      total: totalRevenue,
      perUnit: price,
      percentage: revPct,
    },
    variableCosts: {
      label: 'Variable Costs',
      total: totalVc,
      perUnit: vc,
      percentage: vcPct,
    },
    contributionMargin: {
      label: 'Contribution Margin',
      total: totalCm,
      perUnit: cmUnit,
      percentage: cmPct,
    },
    fixedCosts: {
      label: 'Fixed Operating Costs',
      total: fixed,
      perUnit: units > 0 ? fixed / units : null,
      percentage: totalRevenue > 0 ? fixed / totalRevenue : null,
    },
    operatingIncome: {
      label: operatingIncome >= 0 ? 'Net Operating Income (Profit)' : 'Net Operating Loss',
      total: operatingIncome,
      perUnit: units > 0 ? operatingIncome / units : null,
      percentage: totalRevenue > 0 ? operatingIncome / totalRevenue : null,
    },
  };

  // Step-by-step exam working
  const steps = [
    {
      step: 1,
      title: 'Contribution Margin Per Unit',
      formula: 'CM per Unit = Selling Price − Variable Cost per Unit',
      calculation: `$${price.toFixed(2)} − $${vc.toFixed(2)}`,
      result: `$${cmUnit.toFixed(2)} per unit`,
    },
    {
      step: 2,
      title: 'Contribution Margin Ratio',
      formula: 'CM Ratio = CM per Unit ÷ Selling Price',
      calculation: price > 0 ? `$${cmUnit.toFixed(2)} ÷ $${price.toFixed(2)}` : 'N/A',
      result: cmRatio !== null ? `${(cmRatio * 100).toFixed(2)}%` : 'N/A',
    },
    {
      step: 3,
      title: 'Break-Even Point in Units',
      formula: 'Break-Even Units = Total Fixed Costs ÷ CM per Unit',
      calculation: cmUnit > 0 ? `$${fixed.toLocaleString()} ÷ $${cmUnit.toFixed(2)}` : 'CM ≤ 0',
      result: breakEvenUnits !== null ? `${Math.ceil(breakEvenUnits).toLocaleString()} units (${breakEvenUnits.toFixed(2)})` : 'Impossible (negative/zero CM)',
    },
    {
      step: 4,
      title: 'Break-Even Point in Sales Dollars',
      formula: 'Break-Even Sales = Total Fixed Costs ÷ CM Ratio',
      calculation: cmRatio && cmRatio > 0 ? `$${fixed.toLocaleString()} ÷ ${(cmRatio * 100).toFixed(2)}%` : 'N/A',
      result: breakEvenSales !== null ? `$${breakEvenSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A',
    },
    {
      step: 5,
      title: 'Margin of Safety (at Current Volume)',
      formula: 'Margin of Safety = Actual Units − Break-Even Units',
      calculation: breakEvenUnits !== null ? `${units.toLocaleString()} − ${breakEvenUnits.toFixed(2)}` : 'N/A',
      result: mosUnits !== null ? `${mosUnits.toFixed(2)} units (${mosSales ? `$${mosSales.toFixed(2)}` : '$0'}, ${(mosRatio! * 100).toFixed(2)}%)` : 'N/A',
    },
  ];

  if (targetUnits !== null && targetProfitPreTax !== null) {
    steps.push({
      step: 6,
      title: 'Required Units for Target Profit',
      formula: 'Target Units = (Fixed Costs + Target Pre-Tax Profit) ÷ CM per Unit',
      calculation: `($${fixed.toLocaleString()} + $${targetProfitPreTax.toLocaleString()}) ÷ $${cmUnit.toFixed(2)}`,
      result: `${Math.ceil(targetUnits).toLocaleString()} units (${targetUnits.toFixed(2)}) = $${(targetUnits * price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    });
  }

  return {
    sellingPrice: price,
    variableCostPerUnit: vc,
    fixedCosts: fixed,
    unitsSold: units,
    cmPerUnit: cmUnit,
    cmRatio,
    totalCm,
    breakEvenUnits,
    breakEvenSales,
    timeToBreakEvenMonths,
    isLossMakingPerUnit: isLossMaking,
    totalRevenue,
    totalVariableCosts: totalVc,
    operatingIncome,
    isOperatingProfit,
    marginOfSafetyUnits: mosUnits,
    marginOfSafetySales: mosSales,
    marginOfSafetyRatio: mosRatio,
    dol,
    dolExplanation,
    profitImpactWithTenPctSalesIncrease: profitImpactTenPct,
    targetProfitPreTax,
    targetProfitAfterTax,
    targetUnits,
    targetSales,
    statement,
    steps,
  };
}

/**
 * Calculate multi-product sales mix CVP
 */
export function calculateSalesMixCvp(
  rawProducts: ProductMixItemInput[],
  fixedCosts: number
): SalesMixCvpResult {
  const fixed = Math.max(0, fixedCosts);
  if (!rawProducts || rawProducts.length === 0) {
    return {
      products: [],
      fixedCosts: fixed,
      weightedCmPerUnit: 0,
      weightedSellingPrice: 0,
      weightedCmRatio: 0,
      breakEvenTotalUnits: null,
      breakEvenTotalSales: null,
      isLossMakingWeighted: true,
    };
  }

  // Determine weighting: from mixPercent or units
  const hasMixPercent = rawProducts.some((p) => p.mixPercent !== undefined && p.mixPercent > 0);
  const totalUnits = rawProducts.reduce((sum, p) => sum + (p.units || 0), 0);

  const rawWeights = rawProducts.map((p) => {
    if (hasMixPercent) {
      return Math.max(0, p.mixPercent ?? 0);
    }
    return totalUnits > 0 ? ((p.units || 0) / totalUnits) * 100 : 100 / rawProducts.length;
  });

  const sumWeights = rawWeights.reduce((a, b) => a + b, 0);
  const normalizedPcts = sumWeights > 0 ? rawWeights.map((w) => (w / sumWeights) * 100) : rawWeights.map(() => 100 / rawProducts.length);

  let weightedCm = 0;
  let weightedPrice = 0;

  const productResults: ProductMixItemResult[] = rawProducts.map((p, idx) => {
    const price = Math.max(0, p.sellingPrice);
    const vc = Math.max(0, p.variableCostPerUnit);
    const cm = price - vc;
    const ratio = price > 0 ? cm / price : 0;
    const mixPct = normalizedPcts[idx];
    const weightFraction = mixPct / 100;

    weightedCm += weightFraction * cm;
    weightedPrice += weightFraction * price;

    return {
      id: p.id,
      name: p.name || `Product ${idx + 1}`,
      sellingPrice: price,
      variableCostPerUnit: vc,
      cmPerUnit: cm,
      cmRatio: ratio,
      mixPercent: mixPct,
      breakEvenUnits: null,
      breakEvenSales: null,
    };
  });

  const weightedCmRatio = weightedPrice > 0 ? weightedCm / weightedPrice : 0;
  const isLossMaking = weightedCm <= 0;

  let breakEvenTotalUnits: number | null = null;
  let breakEvenTotalSales: number | null = null;

  if (!isLossMaking && weightedCm > 0) {
    breakEvenTotalUnits = fixed / weightedCm;
    breakEvenTotalSales = weightedCmRatio > 0 ? fixed / weightedCmRatio : breakEvenTotalUnits * weightedPrice;

    // Allocate break-even units to each product
    for (const prod of productResults) {
      const prodUnits = breakEvenTotalUnits * (prod.mixPercent / 100);
      prod.breakEvenUnits = prodUnits;
      prod.breakEvenSales = prodUnits * prod.sellingPrice;
    }
  }

  return {
    products: productResults,
    fixedCosts: fixed,
    weightedCmPerUnit: weightedCm,
    weightedSellingPrice: weightedPrice,
    weightedCmRatio,
    breakEvenTotalUnits,
    breakEvenTotalSales,
    isLossMakingWeighted: isLossMaking,
  };
}

/**
 * Calculate What-If scenario against a baseline
 */
export function calculateWhatIfScenario(scenario: WhatIfScenarioInput): WhatIfScenarioResult {
  const base = scenario.base;
  const baseResult = calculateSingleProductCvp(base);

  const priceMult = 1 + scenario.priceChangePct / 100;
  const vcMult = 1 + scenario.variableCostChangePct / 100;
  const fixedMult = 1 + scenario.fixedCostChangePct / 100;
  const volumeMult = 1 + scenario.volumeChangePct / 100;

  const round2 = (v: number) => Math.round(v * 100) / 100;

  const newPrice = Math.max(0, round2(base.sellingPrice * priceMult));
  const newVc = Math.max(0, round2(base.variableCostPerUnit * vcMult));
  const newFixed = Math.max(0, round2(base.fixedCosts * fixedMult));
  const newUnits = Math.max(0, Math.round(base.unitsSold * volumeMult));

  const newResult = calculateSingleProductCvp({
    sellingPrice: newPrice,
    variableCostPerUnit: newVc,
    fixedCosts: newFixed,
    unitsSold: newUnits,
  });

  const diffIncome = round2(newResult.operatingIncome - baseResult.operatingIncome);
  let diffPct: number | null = null;
  if (baseResult.operatingIncome !== 0) {
    diffPct = round2((diffIncome / Math.abs(baseResult.operatingIncome)) * 100);
  }

  return {
    scenarioName: 'What-If Simulation',
    sellingPrice: newPrice,
    variableCostPerUnit: newVc,
    fixedCosts: newFixed,
    unitsSold: newUnits,
    cmPerUnit: round2(newResult.cmPerUnit),
    cmRatio: newResult.cmRatio !== null ? round2(newResult.cmRatio * 100) / 100 : null,
    breakEvenUnits: newResult.breakEvenUnits !== null ? Math.round(newResult.breakEvenUnits * 100) / 100 : null,
    breakEvenSales: newResult.breakEvenSales !== null ? round2(newResult.breakEvenSales) : null,
    operatingIncome: round2(newResult.operatingIncome),
    incomeChangeFromBase: diffIncome,
    incomeChangePctFromBase: diffPct,
  };
}
