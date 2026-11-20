/**
 * Short-Term Rental (Airbnb / Vrbo) Profit Calculator Engine
 *
 * Implements full-stack STR profitability modeling:
 * - Gross revenue from nightly rate (ADR), occupancy %, nights available, weekend pricing, cleaning fees charged, and other income
 * - Host platform fees (Airbnb host-only or split-fee, Vrbo, payment processing)
 * - Variable operating costs per stay (cleaning turnover, guest supplies, property management % of revenue, maintenance reserve % of revenue)
 * - Fixed operating costs (utilities, internet, insurance, software/tech stack, HOA, licenses/permits, property taxes)
 * - Remitted occupancy / lodging taxes (when collected and paid directly by host)
 * - Net Operating Income (NOI)
 * - Financing debt service or master lease arbitrage rent
 * - Cash Flow (monthly & annual)
 * - RevPAR (Revenue Per Available Room/Night)
 * - Break-even occupancy % and break-even nightly rate (ADR)
 * - Cash-on-Cash Return (%) and furniture/setup payback period (months)
 * - Scenario analysis (expected, conservative, optimistic)
 * - Side-by-side STR vs Long-Term Rental (LTR) comparison
 *
 * Zero outside network dependencies. All functions are pure, deterministic, and safe against division-by-zero.
 */

import { capRate as calcCapRate, cashOnCash as calcCashOnCash } from './real-estate-engine';

export interface StrRevenueInput {
  nightlyRate: number; // Average Daily Rate (ADR) in base currency ($180)
  occupancyPct: number; // Occupancy rate 0-100% (65)
  nightsAvailable?: number; // Days in year or period (default: 365)
  avgStayNights?: number; // Average stay duration in nights (3)
  cleaningFeeCharged?: number; // Cleaning fee charged to guest per stay ($90)
  weekendUpliftPct?: number; // % increase on weekend nights (Fri-Sat) (default: 0)
  otherIncomeAnnual?: number; // Pet fees, early check-in, parking, etc. ($0)
}

export interface StrPlatformFeesInput {
  hostFeePct: number; // Platform fee % deducted from host payout (e.g. 3% for Airbnb split, 15% host-only)
  paymentProcessingFeePct?: number; // Extra payment processing % if applicable (default: 0)
}

export interface StrVariableCostsInput {
  cleaningCostPerTurnover: number; // Actual cleaner fee per stay turnover ($80)
  suppliesPerStay: number; // Coffee, toiletries, snacks, paper goods per stay ($10)
  managementFeePct?: number; // Co-host or property manager % of revenue (default: 0)
  maintenancePct?: number; // Maintenance reserve % of revenue (default: 5)
}

export interface StrFixedCostsInput {
  utilitiesMonthly: number; // Electric, gas, water, trash ($250)
  internetMonthly: number; // High-speed Wi-Fi, streaming ($60)
  insuranceMonthly: number; // STR commercial / liability insurance policy ($150)
  softwareMonthly?: number; // PMS, dynamic pricing tool, smart lock, noise monitor ($0)
  hoaMonthly?: number; // HOA / condo dues if applicable ($0)
  licencesAnnual?: number; // Municipal STR permit / licensing fees per year ($0)
  propertyTaxAnnual?: number; // Real estate property taxes per year ($0)
}

export interface StrTaxInput {
  occupancyTaxPct: number; // Transient occupancy tax (TOT) / lodging tax % (only if host directly remits)
}

export interface StrFinancingInput {
  mode: 'buy' | 'arbitrage' | 'midterm';
  mortgagePaymentMonthly?: number; // Monthly principal & interest debt service ($1,800)
  rentToLandlordMonthly?: number; // Monthly lease paid to master landlord for arbitrage ($0)
  cashInvested?: number; // Down payment + closing costs for buy mode ($60,000)
  startupCost?: number; // Furniture, decor, photography, setup costs ($15,000)
  propertyPurchasePrice?: number; // For property valuation / cap rate ($0)
}

export interface StrLtrComparisonInput {
  monthlyLtrRent: number; // Expected monthly rent on standard 12-month lease
  ltrVacancyPct?: number; // Long-term vacancy % (e.g. 5%)
  ltrManagementPct?: number; // Long-term PM fee % (e.g. 8%)
  ltrMaintenancePct?: number; // Long-term maintenance % (e.g. 5%)
  ltrFixedMonthlyUtilities?: number; // Fixed utilities paid by landlord in LTR ($0)
}

export interface StrAnalysisResult {
  // Operational Volumes
  nightsAvailable: number;
  bookedNights: number;
  staysCount: number;
  unbookedNights: number;
  revPar: number; // Revenue Per Available Night = Nightly Rate * Occupancy

  // Revenue Breakdown (Annual)
  nightlyGrossRevenue: number;
  cleaningFeeRevenue: number;
  otherRevenue: number;
  grossRevenueAnnual: number;
  grossRevenueMonthly: number;

  // Operating Expenses Breakdown (Annual)
  platformFeesAnnual: number;
  cleaningExpensesAnnual: number;
  suppliesExpensesAnnual: number;
  managementExpensesAnnual: number;
  maintenanceExpensesAnnual: number;
  totalVariableCostsAnnual: number;

  utilitiesAnnual: number;
  internetAnnual: number;
  insuranceAnnual: number;
  softwareAnnual: number;
  hoaAnnual: number;
  licencesAnnual: number;
  propertyTaxAnnual: number;
  totalFixedCostsAnnual: number;

  occupancyTaxAnnual: number;
  totalOperatingExpensesAnnual: number;
  operatingExpenseRatioPct: number;

  // Bottom Line Profitability
  noiAnnual: number; // Net Operating Income before debt/lease
  noiMonthly: number;
  annualDebtServiceOrRent: number;
  cashFlowAnnual: number; // True net cash flow after debt/lease
  cashFlowMonthly: number;

  // Investment Metrics
  totalCashInvested: number; // Down payment + closing + setup
  cashOnCashReturnPct: number | null; // Cash Flow / Total Cash Invested
  capRatePct: number | null; // NOI / Purchase Price (if purchase price provided)
  paybackPeriodMonths: number | null; // Startup / (Cash Flow / 12)

  // Break-Even Metrics
  contributionPerNight: number; // Net cash contribution from 1 booked night
  breakEvenOccupancyPct: number | null; // Occupancy % required for Cash Flow = 0
  breakEvenAdr: number | null; // Nightly rate required for Cash Flow = 0 at current occupancy
}

export interface StrScenarioResult {
  label: string;
  occupancyPct: number;
  nightlyRate: number;
  grossRevenue: number;
  noi: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCashReturnPct: number | null;
}

export interface StrLtrComparisonResult {
  strAnnualRevenue: number;
  strAnnualOpex: number;
  strAnnualCashFlow: number;
  strMonthlyCashFlow: number;
  strCashOnCashPct: number | null;

  ltrAnnualGrossRent: number;
  ltrAnnualOpex: number;
  ltrAnnualCashFlow: number;
  ltrMonthlyCashFlow: number;
  ltrCashOnCashPct: number | null;

  annualCashFlowDifference: number; // STR Cash Flow - LTR Cash Flow
  monthlyCashFlowDifference: number;
  strPremiumPct: number | null; // (STR / LTR - 1) * 100
}

/**
 * Calculates complete short-term rental performance and returns itemized financial metrics.
 */
export function calculateStrProfit(
  revenue: StrRevenueInput,
  platform: StrPlatformFeesInput,
  variable: StrVariableCostsInput,
  fixed: StrFixedCostsInput,
  tax: StrTaxInput,
  financing: StrFinancingInput
): StrAnalysisResult {
  const nightsAvailable = Math.max(1, revenue.nightsAvailable ?? 365);
  const occupancyPct = Math.min(100, Math.max(0, revenue.occupancyPct));
  const occupancyRatio = occupancyPct / 100;
  const avgStay = Math.max(0.5, revenue.avgStayNights ?? 3);
  const nightlyRate = Math.max(0, revenue.nightlyRate);
  const weekendUplift = Math.max(0, (revenue.weekendUpliftPct ?? 0) / 100);
  const cleaningFeeCharged = Math.max(0, revenue.cleaningFeeCharged ?? 0);
  const otherIncome = Math.max(0, revenue.otherIncomeAnnual ?? 0);

  // Volumes
  const bookedNights = nightsAvailable * occupancyRatio;
  const unbookedNights = Math.max(0, nightsAvailable - bookedNights);
  const staysCount = avgStay > 0 ? bookedNights / avgStay : 0;
  const revPar = nightlyRate * occupancyRatio;

  // Weekend rate blending: assuming 2 weekend nights (Fri, Sat) out of 7 days
  const weekendShare = 2 / 7;
  const blendedRate = nightlyRate * (1 + weekendShare * weekendUplift);
  const nightlyGrossRevenue = bookedNights * blendedRate;
  const cleaningFeeRevenue = staysCount * cleaningFeeCharged;
  const grossRevenueAnnual = nightlyGrossRevenue + cleaningFeeRevenue + otherIncome;
  const grossRevenueMonthly = grossRevenueAnnual / 12;

  // Platform & Transaction fees
  const hostFeeRatio = Math.max(0, platform.hostFeePct / 100);
  const paymentFeeRatio = Math.max(0, (platform.paymentProcessingFeePct ?? 0) / 100);
  const totalPlatformPct = hostFeeRatio + paymentFeeRatio;
  const platformFeesAnnual = grossRevenueAnnual * totalPlatformPct;

  // Variable Operating Costs
  const cleaningExpensesAnnual = staysCount * Math.max(0, variable.cleaningCostPerTurnover);
  const suppliesExpensesAnnual = staysCount * Math.max(0, variable.suppliesPerStay);
  const mgmtRatio = Math.max(0, (variable.managementFeePct ?? 0) / 100);
  const managementExpensesAnnual = grossRevenueAnnual * mgmtRatio;
  const maintRatio = Math.max(0, (variable.maintenancePct ?? 0) / 100);
  const maintenanceExpensesAnnual = grossRevenueAnnual * maintRatio;
  const totalVariableCostsAnnual =
    cleaningExpensesAnnual + suppliesExpensesAnnual + managementExpensesAnnual + maintenanceExpensesAnnual;

  // Fixed Operating Costs
  const utilitiesAnnual = Math.max(0, fixed.utilitiesMonthly) * 12;
  const internetAnnual = Math.max(0, fixed.internetMonthly) * 12;
  const insuranceAnnual = Math.max(0, fixed.insuranceMonthly) * 12;
  const softwareAnnual = Math.max(0, fixed.softwareMonthly ?? 0) * 12;
  const hoaAnnual = Math.max(0, fixed.hoaMonthly ?? 0) * 12;
  const licencesAnnual = Math.max(0, fixed.licencesAnnual ?? 0);
  const propertyTaxAnnual = Math.max(0, fixed.propertyTaxAnnual ?? 0);
  const totalFixedCostsAnnual =
    utilitiesAnnual + internetAnnual + insuranceAnnual + softwareAnnual + hoaAnnual + licencesAnnual + propertyTaxAnnual;

  // Occupancy / Lodging Tax (remitted by host directly)
  const occTaxRatio = Math.max(0, (tax.occupancyTaxPct ?? 0) / 100);
  const occupancyTaxAnnual = grossRevenueAnnual * occTaxRatio;

  // Operating Expenses & NOI
  const totalOperatingExpensesAnnual =
    platformFeesAnnual + totalVariableCostsAnnual + totalFixedCostsAnnual + occupancyTaxAnnual;
  const operatingExpenseRatioPct =
    grossRevenueAnnual > 0 ? (totalOperatingExpensesAnnual / grossRevenueAnnual) * 100 : 0;
  const noiAnnual = grossRevenueAnnual - totalOperatingExpensesAnnual;
  const noiMonthly = noiAnnual / 12;

  // Debt Service or Master Lease Arbitrage Rent
  let annualDebtServiceOrRent = 0;
  if (financing.mode === 'arbitrage') {
    annualDebtServiceOrRent = Math.max(0, financing.rentToLandlordMonthly ?? 0) * 12;
  } else {
    annualDebtServiceOrRent = Math.max(0, financing.mortgagePaymentMonthly ?? 0) * 12;
  }

  const cashFlowAnnual = noiAnnual - annualDebtServiceOrRent;
  const cashFlowMonthly = cashFlowAnnual / 12;

  // Capital invested & Returns
  const startupCost = Math.max(0, financing.startupCost ?? 0);
  const cashInvested = Math.max(0, financing.cashInvested ?? 0);
  const totalCashInvested = cashInvested + startupCost;

  let cashOnCashReturnPct: number | null = null;
  if (totalCashInvested > 0) {
    cashOnCashReturnPct = (cashFlowAnnual / totalCashInvested) * 100;
  }

  let capRatePct: number | null = null;
  if (financing.propertyPurchasePrice && financing.propertyPurchasePrice > 0) {
    capRatePct = (noiAnnual / financing.propertyPurchasePrice) * 100;
  }

  let paybackPeriodMonths: number | null = null;
  if (startupCost > 0 && cashFlowMonthly > 0) {
    paybackPeriodMonths = startupCost / cashFlowMonthly;
  }

  // Break-Even Analysis
  // Contribution margin per booked night:
  // Revenue per night = blendedRate + cleaningFeeCharged / avgStay
  // Net revenue per night after % deductions = (blendedRate + cleaningFeeCharged / avgStay) * (1 - totalPlatformPct - mgmtRatio - maintRatio - occTaxRatio)
  // Minus variable cleaning and supplies per night = (cleaningCost + supplies) / avgStay
  const revPerNight = blendedRate + (avgStay > 0 ? cleaningFeeCharged / avgStay : 0);
  const pctDeductions = totalPlatformPct + mgmtRatio + maintRatio + occTaxRatio;
  const netRevPerNight = revPerNight * (1 - pctDeductions);
  const varCostPerNight = avgStay > 0 ? (variable.cleaningCostPerTurnover + variable.suppliesPerStay) / avgStay : 0;
  const contributionPerNight = netRevPerNight - varCostPerNight;

  const totalFixedBurden = totalFixedCostsAnnual + annualDebtServiceOrRent - otherIncome;

  let breakEvenOccupancyPct: number | null = null;
  if (contributionPerNight > 0 && nightsAvailable > 0) {
    const nightsNeeded = totalFixedBurden / contributionPerNight;
    breakEvenOccupancyPct = (nightsNeeded / nightsAvailable) * 100;
  }

  let breakEvenAdr: number | null = null;
  if (bookedNights > 0 && 1 - pctDeductions > 0) {
    // Solve for blendedRate:
    // bookedNights * contributionPerNight = totalFixedBurden
    // contributionPerNight = totalFixedBurden / bookedNights
    // blendedRate = (contributionPerNight + varCostPerNight) / (1 - pctDeductions) - (cleaningFeeCharged / avgStay)
    const targetContribution = totalFixedBurden / bookedNights;
    const reqBlendedRate = (targetContribution + varCostPerNight) / (1 - pctDeductions) - (avgStay > 0 ? cleaningFeeCharged / avgStay : 0);
    const divisor = 1 + weekendShare * weekendUplift;
    breakEvenAdr = divisor > 0 ? reqBlendedRate / divisor : reqBlendedRate;
  }

  return {
    nightsAvailable,
    bookedNights,
    staysCount,
    unbookedNights,
    revPar,
    nightlyGrossRevenue,
    cleaningFeeRevenue,
    otherRevenue: otherIncome,
    grossRevenueAnnual,
    grossRevenueMonthly,
    platformFeesAnnual,
    cleaningExpensesAnnual,
    suppliesExpensesAnnual,
    managementExpensesAnnual,
    maintenanceExpensesAnnual,
    totalVariableCostsAnnual,
    utilitiesAnnual,
    internetAnnual,
    insuranceAnnual,
    softwareAnnual,
    hoaAnnual,
    licencesAnnual,
    propertyTaxAnnual,
    totalFixedCostsAnnual,
    occupancyTaxAnnual,
    totalOperatingExpensesAnnual,
    operatingExpenseRatioPct,
    noiAnnual,
    noiMonthly,
    annualDebtServiceOrRent,
    cashFlowAnnual,
    cashFlowMonthly,
    totalCashInvested,
    cashOnCashReturnPct,
    capRatePct,
    paybackPeriodMonths,
    contributionPerNight,
    breakEvenOccupancyPct,
    breakEvenAdr,
  };
}

/**
 * Calculates 3 scenario tiers: Conservative (-10% occ, -10% ADR), Expected, Optimistic (+5% occ, +5% ADR).
 */
export function calculateStrScenarios(
  revenue: StrRevenueInput,
  platform: StrPlatformFeesInput,
  variable: StrVariableCostsInput,
  fixed: StrFixedCostsInput,
  tax: StrTaxInput,
  financing: StrFinancingInput
): StrScenarioResult[] {
  const currentOcc = revenue.occupancyPct;
  const currentAdr = revenue.nightlyRate;

  const scenariosDef = [
    {
      label: 'Conservative',
      occ: Math.max(10, currentOcc - 10),
      adr: currentAdr * 0.9,
    },
    {
      label: 'Expected (Baseline)',
      occ: currentOcc,
      adr: currentAdr,
    },
    {
      label: 'Optimistic',
      occ: Math.min(100, currentOcc + 5),
      adr: currentAdr * 1.05,
    },
  ];

  return scenariosDef.map((s) => {
    const res = calculateStrProfit(
      { ...revenue, occupancyPct: s.occ, nightlyRate: s.adr },
      platform,
      variable,
      fixed,
      tax,
      financing
    );
    return {
      label: s.label,
      occupancyPct: s.occ,
      nightlyRate: s.adr,
      grossRevenue: res.grossRevenueAnnual,
      noi: res.noiAnnual,
      monthlyCashFlow: res.cashFlowMonthly,
      annualCashFlow: res.cashFlowAnnual,
      cashOnCashReturnPct: res.cashOnCashReturnPct,
    };
  });
}

/**
 * Compares Short-Term Rental against a standard Long-Term Rental lease.
 */
export function compareStrVsLtr(
  strResult: StrAnalysisResult,
  financing: StrFinancingInput,
  ltr: StrLtrComparisonInput
): StrLtrComparisonResult {
  const monthlyRent = Math.max(0, ltr.monthlyLtrRent);
  const vacRatio = Math.max(0, (ltr.ltrVacancyPct ?? 5) / 100);
  const mgmtRatio = Math.max(0, (ltr.ltrManagementPct ?? 8) / 100);
  const maintRatio = Math.max(0, (ltr.ltrMaintenancePct ?? 5) / 100);
  const fixedMonthly = Math.max(0, ltr.ltrFixedMonthlyUtilities ?? 0);

  const ltrPotentialRentAnnual = monthlyRent * 12;
  const ltrEffectiveGrossRent = ltrPotentialRentAnnual * (1 - vacRatio);

  const ltrMgmt = ltrEffectiveGrossRent * mgmtRatio;
  const ltrMaint = ltrEffectiveGrossRent * maintRatio;
  const ltrFixed = fixedMonthly * 12;
  const ltrAnnualOpex = ltrMgmt + ltrMaint + ltrFixed;

  const ltrNoi = ltrEffectiveGrossRent - ltrAnnualOpex;
  const debtOrRent = strResult.annualDebtServiceOrRent;
  const ltrAnnualCashFlow = ltrNoi - debtOrRent;
  const ltrMonthlyCashFlow = ltrAnnualCashFlow / 12;

  const cashInvested = Math.max(1, financing.cashInvested ?? 0);
  const ltrCashOnCashPct = (ltrAnnualCashFlow / cashInvested) * 100;

  const annualDiff = strResult.cashFlowAnnual - ltrAnnualCashFlow;
  const monthlyDiff = annualDiff / 12;
  const premiumPct = ltrAnnualCashFlow > 0 ? (annualDiff / ltrAnnualCashFlow) * 100 : null;

  return {
    strAnnualRevenue: strResult.grossRevenueAnnual,
    strAnnualOpex: strResult.totalOperatingExpensesAnnual,
    strAnnualCashFlow: strResult.cashFlowAnnual,
    strMonthlyCashFlow: strResult.cashFlowMonthly,
    strCashOnCashPct: strResult.cashOnCashReturnPct,

    ltrAnnualGrossRent: ltrEffectiveGrossRent,
    ltrAnnualOpex,
    ltrAnnualCashFlow,
    ltrMonthlyCashFlow,
    ltrCashOnCashPct,

    annualCashFlowDifference: annualDiff,
    monthlyCashFlowDifference: monthlyDiff,
    strPremiumPct: premiumPct,
  };
}
