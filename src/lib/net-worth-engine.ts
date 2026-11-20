/**
 * net-worth-engine.ts — Net Worth, Liquid Net Worth & Asset Allocation Engine
 *
 * Core mathematical engine for /net-worth-calculator/
 * Pure functions only. Zero DOM, zero network, zero side-effects.
 */

export interface CustomEntry {
  id: string;
  name: string;
  value: number;
}

export interface AssetsInput {
  cashChecking: number;
  savings: number;
  taxableInvestments: number;
  retirementPreTax: number;
  retirementRoth: number;
  primaryHome: number;
  otherRealEstate: number;
  vehicles: number;
  businessInterests: number;
  otherAssets: number;
  customAssets?: CustomEntry[];
}

export interface LiabilitiesInput {
  primaryMortgage: number;
  helocHomeEquity: number;
  autoLoans: number;
  studentLoans: number;
  creditCards: number;
  personalLoans: number;
  otherLiabilities: number;
  customLiabilities?: CustomEntry[];
}

export interface NetWorthOptions {
  preTaxHaircutPct?: number; // 0% - 40% optional estimated tax haircut on pre-tax 401k/IRA
  monthlySpend?: number; // for liquid emergency months covered calculation
  currency?: string; // 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' etc.
}

export interface AssetCategoryBreakdown {
  category: string;
  label: string;
  amount: number;
  pctOfTotal: number;
  color: string;
}

export interface NetWorthCalculationResult {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  liquidAssets: number;
  nonMortgageDebt: number;
  liquidNetWorth: number;
  investableAssets: number;
  investableNetWorth: number;
  debtToAssetPct: number | null;
  homeEquity: number;
  monthsCovered: number | null;
  isNegative: boolean;
  assetBreakdown: AssetCategoryBreakdown[];
}

export interface HouseholdMemberData {
  name: string;
  assets: AssetsInput;
  liabilities: LiabilitiesInput;
}

export interface HouseholdCalculationResult {
  memberA: NetWorthCalculationResult;
  memberB: NetWorthCalculationResult;
  joint: NetWorthCalculationResult;
  combined: NetWorthCalculationResult;
}

export interface SnapshotChangeResult {
  currentNetWorth: number;
  previousNetWorth: number;
  dollarChange: number;
  pctChange: number | null;
  isPositive: boolean;
}

function cleanMoney(val: number): number {
  if (Object.is(val, -0) || Math.abs(val) < 1e-12) return 0;
  return Number(val.toFixed(2));
}

function cleanPct(val: number, decimals: number = 2): number {
  if (Object.is(val, -0) || Math.abs(val) < 1e-12) return 0;
  return Number(val.toFixed(decimals));
}

/**
 * Calculates complete net worth, liquidity tiers, and asset allocation.
 */
export function calculateNetWorth(
  assets: AssetsInput,
  liabilities: LiabilitiesInput,
  options: NetWorthOptions = {}
): NetWorthCalculationResult {
  const haircut = Math.min(1, Math.max(0, (options.preTaxHaircutPct || 0) / 100));
  const effectivePreTaxRetirement = Math.max(0, assets.retirementPreTax) * (1 - haircut);

  const customAssetsTotal = (assets.customAssets || []).reduce((acc, c) => acc + Math.max(0, c.value), 0);
  const customLiabilitiesTotal = (liabilities.customLiabilities || []).reduce((acc, c) => acc + Math.max(0, c.value), 0);

  // 1. Total Assets
  const totalAssets = cleanMoney(
    Math.max(0, assets.cashChecking) +
    Math.max(0, assets.savings) +
    Math.max(0, assets.taxableInvestments) +
    effectivePreTaxRetirement +
    Math.max(0, assets.retirementRoth) +
    Math.max(0, assets.primaryHome) +
    Math.max(0, assets.otherRealEstate) +
    Math.max(0, assets.vehicles) +
    Math.max(0, assets.businessInterests) +
    Math.max(0, assets.otherAssets) +
    customAssetsTotal
  );

  // 2. Total Liabilities
  const totalLiabilities = cleanMoney(
    Math.max(0, liabilities.primaryMortgage) +
    Math.max(0, liabilities.helocHomeEquity) +
    Math.max(0, liabilities.autoLoans) +
    Math.max(0, liabilities.studentLoans) +
    Math.max(0, liabilities.creditCards) +
    Math.max(0, liabilities.personalLoans) +
    Math.max(0, liabilities.otherLiabilities) +
    customLiabilitiesTotal
  );

  // 3. Core Net Worth
  const netWorth = cleanMoney(totalAssets - totalLiabilities);

  // 4. Liquid Assets & Liquid Net Worth
  // Liquid assets = Cash + Savings + Taxable Brokerage
  const liquidAssets = cleanMoney(
    Math.max(0, assets.cashChecking) +
    Math.max(0, assets.savings) +
    Math.max(0, assets.taxableInvestments)
  );

  // Non-mortgage debt = Total liabilities − Primary Mortgage − HELOC
  const securedPropertyDebt = Math.max(0, liabilities.primaryMortgage) + Math.max(0, liabilities.helocHomeEquity);
  const nonMortgageDebt = cleanMoney(Math.max(0, totalLiabilities - securedPropertyDebt));

  // Liquid Net Worth = Liquid assets − Non-mortgage debt
  const liquidNetWorth = cleanMoney(liquidAssets - nonMortgageDebt);

  // 5. Investable Net Worth
  // Investable assets = Liquid assets + Retirement accounts
  const retirementTotal = effectivePreTaxRetirement + Math.max(0, assets.retirementRoth);
  const investableAssets = cleanMoney(liquidAssets + retirementTotal);
  const investableNetWorth = cleanMoney(investableAssets - nonMortgageDebt);

  // 6. Ratios & Real Estate Metrics
  const debtToAssetPct = totalAssets > 0 ? cleanPct((totalLiabilities / totalAssets) * 100) : null;
  const homeEquity = cleanMoney(Math.max(0, assets.primaryHome) - securedPropertyDebt);

  // Months of living expenses covered by liquid assets
  const monthsCovered =
    options.monthlySpend && options.monthlySpend > 0
      ? cleanPct(liquidAssets / options.monthlySpend, 1)
      : null;

  // 7. Asset Allocation Breakdown for SVG Visualization
  const rawCategories = [
    {
      category: 'cash',
      label: 'Cash & Savings',
      amount: Math.max(0, assets.cashChecking) + Math.max(0, assets.savings),
      color: '#3b82f6', // blue
    },
    {
      category: 'investments',
      label: 'Taxable Investments',
      amount: Math.max(0, assets.taxableInvestments),
      color: '#06b6d4', // cyan
    },
    {
      category: 'retirement',
      label: 'Retirement Accounts',
      amount: effectivePreTaxRetirement + Math.max(0, assets.retirementRoth),
      color: '#10b981', // green
    },
    {
      category: 'realEstate',
      label: 'Real Estate & Home',
      amount: Math.max(0, assets.primaryHome) + Math.max(0, assets.otherRealEstate),
      color: '#f59e0b', // amber
    },
    {
      category: 'vehiclesOther',
      label: 'Vehicles, Business & Other',
      amount:
        Math.max(0, assets.vehicles) +
        Math.max(0, assets.businessInterests) +
        Math.max(0, assets.otherAssets) +
        customAssetsTotal,
      color: '#8b5cf6', // purple
    },
  ];

  const assetBreakdown: AssetCategoryBreakdown[] = rawCategories.map((c) => ({
    ...c,
    amount: cleanMoney(c.amount),
    pctOfTotal: totalAssets > 0 ? cleanPct((c.amount / totalAssets) * 100) : 0,
  }));

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    liquidAssets,
    nonMortgageDebt,
    liquidNetWorth,
    investableAssets,
    investableNetWorth,
    debtToAssetPct,
    homeEquity,
    monthsCovered,
    isNegative: netWorth < 0,
    assetBreakdown,
  };
}

/**
 * Combines two household members plus joint assets/liabilities.
 */
export function calculateHouseholdNetWorth(
  memberA: HouseholdMemberData,
  memberB: HouseholdMemberData,
  joint: { assets: AssetsInput; liabilities: LiabilitiesInput },
  options: NetWorthOptions = {}
): HouseholdCalculationResult {
  const resA = calculateNetWorth(memberA.assets, memberA.liabilities, options);
  const resB = calculateNetWorth(memberB.assets, memberB.liabilities, options);
  const resJoint = calculateNetWorth(joint.assets, joint.liabilities, options);

  // Sum combined inputs
  const sumKeys = <T extends object>(a: T, b: T, j: T): T => {
    const res: Record<string, unknown> = {};
    const recA = a as Record<string, unknown>;
    const recB = b as Record<string, unknown>;
    const recJ = j as Record<string, unknown>;
    const allKeys = Array.from(new Set([...Object.keys(a), ...Object.keys(b), ...Object.keys(j)]));
    for (const k of allKeys) {
      if (k === 'customAssets' || k === 'customLiabilities') {
        const listA = (recA[k] as CustomEntry[]) || [];
        const listB = (recB[k] as CustomEntry[]) || [];
        const listJ = (recJ[k] as CustomEntry[]) || [];
        res[k] = [...listA, ...listB, ...listJ];
      } else {
        res[k] = (Number(recA[k]) || 0) + (Number(recB[k]) || 0) + (Number(recJ[k]) || 0);
      }
    }
    return res as T;
  };

  const combinedAssets = sumKeys(memberA.assets, memberB.assets, joint.assets);
  const combinedLiabilities = sumKeys(memberA.liabilities, memberB.liabilities, joint.liabilities);
  const resCombined = calculateNetWorth(combinedAssets, combinedLiabilities, options);

  return {
    memberA: resA,
    memberB: resB,
    joint: resJoint,
    combined: resCombined,
  };
}

/**
 * Compares current net worth with a previous locally saved snapshot.
 */
export function compareWithSnapshot(currentNetWorth: number, previousNetWorth: number): SnapshotChangeResult {
  const dollarChange = cleanMoney(currentNetWorth - previousNetWorth);
  let pctChange: number | null = null;

  if (Math.abs(previousNetWorth) > 0.005) {
    pctChange = cleanPct((dollarChange / Math.abs(previousNetWorth)) * 100);
  }

  return {
    currentNetWorth: cleanMoney(currentNetWorth),
    previousNetWorth: cleanMoney(previousNetWorth),
    dollarChange,
    pctChange,
    isPositive: dollarChange >= 0,
  };
}
