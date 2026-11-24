/**
 * Return on Investment (ROI) and Business / Project Return Engine
 * 
 * Implements:
 * - Basic ROI and Net Profit: ROI = (Final + Income - Expenses - Cost) / Cost
 * - Annualized ROI: (1 + ROI)^(1 / years) - 1, with years = days / 365.25 or decimal years
 * - Real ROI (after inflation): Fisher equation (1 + Annualized) / (1 + Inflation) - 1
 * - Target Ending Value: Cost * (1 + Target ROI)
 * - Side-by-side comparison of 2-4 investments with ranking and duration mismatch warnings
 * - Marketing ROI on Margin vs Revenue ROI vs ROAS (Return on Ad Spend)
 * - Equipment & Project Capital ROI with simple Payback Period
 * 
 * Pure functions, zero network, zero dependencies beyond Math.
 */

export interface BasicRoiInput {
  cost: number;
  finalValue: number;
  years?: number;
  income?: number;
  expenses?: number;
  inflationPct?: number;
}

export interface BasicRoiResult {
  cost: number;
  finalValue: number;
  income: number;
  expenses: number;
  netGain: number;
  totalReturnRatio: number;
  roiPct: number;
  annualizedRoiPct: number | null;
  realRoiPct: number | null;
  years: number;
}

export interface MarketingRoiInput {
  revenue: number;
  adCost: number;
  grossMarginPct: number; // e.g. 40 for 40%
}

export interface MarketingRoiResult {
  revenue: number;
  adCost: number;
  grossMarginPct: number;
  grossProfit: number;
  netProfit: number;
  roiOnMarginPct: number; // (Gross Profit - Ad Cost) / Ad Cost
  roiOnRevenuePct: number; // (Revenue - Ad Cost) / Ad Cost
  roas: number; // Revenue / Ad Cost
}

export interface ProjectRoiInput {
  cost: number;
  annualBenefit: number;
  projectLifeYears: number;
}

export interface ProjectRoiResult {
  cost: number;
  annualBenefit: number;
  projectLifeYears: number;
  totalBenefits: number;
  netProfit: number;
  roiPct: number;
  paybackYears: number | null;
}

export interface CompareOptionInput {
  name: string;
  cost: number;
  finalValue: number;
  years: number;
  income?: number;
  expenses?: number;
}

export interface CompareOptionResult {
  name: string;
  cost: number;
  finalValue: number;
  years: number;
  netGain: number;
  roiPct: number;
  annualizedRoiPct: number | null;
  rank: number;
}

export interface CompareAnalysisResult {
  options: CompareOptionResult[];
  hasMismatchedDurations: boolean;
  bestOptionByAnnualized: CompareOptionResult | null;
}

/**
 * Calculates standard ROI and Annualized ROI.
 */
export function calculateRoi(input: BasicRoiInput): BasicRoiResult | null {
  const {
    cost,
    finalValue,
    years = 1,
    income = 0,
    expenses = 0,
    inflationPct = 0,
  } = input;

  if (cost <= 0) return null;

  const netGain = finalValue + income - expenses - cost;
  const totalReturnRatio = (finalValue + income - expenses) / cost;
  const roiPct = Number(((netGain / cost) * 100).toFixed(2));

  let annualizedRoiPct: number | null = null;
  let annDecimal: number | null = null; // unrounded, so real ROI is not built on a rounded figure
  if (years > 0) {
    if (totalReturnRatio > 0) {
      annDecimal = Math.pow(totalReturnRatio, 1.0 / years) - 1.0;
      annualizedRoiPct = Number((annDecimal * 100).toFixed(2));
    } else if (totalReturnRatio === 0) {
      annDecimal = -1.0;
      annualizedRoiPct = -100.0;
    }
  }

  let realRoiPct: number | null = null;
  if (annDecimal !== null && inflationPct !== 0) {
    const inflDecimal = inflationPct / 100.0;
    if (inflDecimal > -1.0) {
      const realDecimal = (1.0 + annDecimal) / (1.0 + inflDecimal) - 1.0;
      realRoiPct = Number((realDecimal * 100).toFixed(2));
    }
  }

  return {
    cost,
    finalValue,
    income,
    expenses,
    netGain: Number(netGain.toFixed(2)),
    totalReturnRatio: Number(totalReturnRatio.toFixed(4)),
    roiPct,
    annualizedRoiPct,
    realRoiPct,
    years,
  };
}

/**
 * Calculates marketing campaign ROI comparing margin-based ROI vs revenue ROI and ROAS.
 */
export function calculateMarketingRoi(input: MarketingRoiInput): MarketingRoiResult | null {
  const { revenue, adCost, grossMarginPct } = input;
  if (adCost <= 0) return null;

  const marginDecimal = Math.max(0, grossMarginPct) / 100.0;
  const grossProfit = revenue * marginDecimal;
  const netProfit = grossProfit - adCost;

  const roiOnMarginPct = Number(((netProfit / adCost) * 100).toFixed(2));
  const roiOnRevenuePct = Number((((revenue - adCost) / adCost) * 100).toFixed(2));
  const roas = Number((revenue / adCost).toFixed(2));

  return {
    revenue,
    adCost,
    grossMarginPct,
    grossProfit: Number(grossProfit.toFixed(2)),
    netProfit: Number(netProfit.toFixed(2)),
    roiOnMarginPct,
    roiOnRevenuePct,
    roas,
  };
}

/**
 * Calculates capital equipment or internal project ROI with payback period.
 */
export function calculateProjectRoi(input: ProjectRoiInput): ProjectRoiResult | null {
  const { cost, annualBenefit, projectLifeYears } = input;
  if (cost <= 0) return null;

  const totalBenefits = annualBenefit * projectLifeYears;
  const netProfit = totalBenefits - cost;
  const roiPct = Number(((netProfit / cost) * 100).toFixed(2));

  const paybackYears = annualBenefit > 0 ? Number((cost / annualBenefit).toFixed(2)) : null;

  return {
    cost,
    annualBenefit,
    projectLifeYears,
    totalBenefits: Number(totalBenefits.toFixed(2)),
    netProfit: Number(netProfit.toFixed(2)),
    roiPct,
    paybackYears,
  };
}

/**
 * Compares 2 to 4 investment options and ranks them by annualized ROI.
 */
export function compareInvestments(options: CompareOptionInput[]): CompareAnalysisResult {
  const results: CompareOptionResult[] = [];
  const yearsSet = new Set<number>();

  options.forEach((opt) => {
    const res = calculateRoi({
      cost: opt.cost,
      finalValue: opt.finalValue,
      years: opt.years,
      income: opt.income,
      expenses: opt.expenses,
    });

    if (res) {
      results.push({
        name: opt.name || 'Option',
        cost: opt.cost,
        finalValue: opt.finalValue,
        years: opt.years,
        netGain: res.netGain,
        roiPct: res.roiPct,
        annualizedRoiPct: res.annualizedRoiPct,
        rank: 0,
      });
      yearsSet.add(opt.years);
    }
  });

  // Sort descending by annualized ROI (or total ROI if annualized is unavailable)
  results.sort((a, b) => {
    const valA = a.annualizedRoiPct ?? a.roiPct;
    const valB = b.annualizedRoiPct ?? b.roiPct;
    return valB - valA;
  });

  results.forEach((r, idx) => {
    r.rank = idx + 1;
  });

  return {
    options: results,
    hasMismatchedDurations: yearsSet.size > 1,
    bestOptionByAnnualized: results.length > 0 ? results[0] : null,
  };
}

/**
 * Calculates ending value required to achieve a target ROI percentage.
 */
export function calculateTargetValue(cost: number, targetRoiPct: number): number {
  if (cost <= 0) return 0;
  return Number((cost * (1.0 + targetRoiPct / 100.0)).toFixed(2));
}
