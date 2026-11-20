/**
 * Labor Cost Engine — Pure calculation functions for:
 * 1. Fully burdened employee cost and hourly rates (paid vs productive)
 * 2. Crew and job labor estimating with overhead and profit markup/margin
 * 3. Labor cost as a percentage of revenue
 * 4. Employee vs subcontractor cost comparison
 *
 * Rules:
 * - Pure functions only. Zero network calls, zero external side effects.
 * - Tax data aligns with verified IRS and SSA figures in us-tax-data.ts.
 * - Caps modeled: Social Security wage base, FUTA wage base, SUTA wage base.
 */

import { US_TAX_DATA } from '../content/us-tax-data';
import { priceFromMargin } from './pricing-engine';

export type PayType = 'hourly' | 'salary';
export type CountryMode = 'us' | 'other';
export type QuotePricingMode = 'markup' | 'margin';

export interface EmployeeBurdenInput {
  payType: PayType;
  hourlyRate: number; // e.g. 30
  annualSalary: number; // e.g. 62400
  paidHoursPerYear: number; // standard 2,080 (40 hrs/wk * 52 wks)
  overtimeHoursPerYear?: number; // e.g. 0
  overtimeMultiplier?: number; // standard 1.5

  // Time off / non-productive hours
  paidHolidaysHours: number; // e.g. 80 (10 days)
  paidPtoHours: number; // e.g. 80 (10 days vacation/PTO)
  paidSickHours: number; // e.g. 0
  trainingNonBillableHours: number; // e.g. 0

  // Geography & Taxes
  countryMode: CountryMode;

  // US Mode Payroll Taxes (defaults drawn from 2026 IRS / SSA guidelines)
  ssEmployerRate?: number; // default 0.062 (6.2%)
  ssWageBase?: number; // default from US_TAX_DATA (e.g. 184500)
  medicareRate?: number; // default 0.0145 (1.45%, no wage cap for employer)
  futaRate?: number; // default 0.006 (0.6% effective with full state credit)
  futaWageBase?: number; // default 7,000
  sutaRate?: number; // state unemployment tax rate (e.g. 0.02 = 2.0%)
  sutaWageBase?: number; // state wage base (e.g. 10,000)

  // Insurance & Benefits
  workersCompRatePer100: number; // e.g. $5.00 per $100 of gross payroll
  generalLiabilityAnnual: number; // e.g. $0 or flat annual / payroll rate
  annualBenefits: number; // health, retirement match, etc. (e.g. $6,000)

  // Non-US Mode: Single employer on-costs %
  otherOnCostsPercent?: number; // e.g. 25%
}

export interface EmployeeBurdenBreakdown {
  wagesAnnual: number;
  regularWagesAnnual: number;
  overtimeWagesAnnual: number;
  socialSecurityAnnual: number;
  medicareAnnual: number;
  futaAnnual: number;
  sutaAnnual: number;
  payrollTaxesAnnual: number; // SS + Medicare + FUTA + SUTA
  workersCompAnnual: number;
  generalLiabilityAnnual: number;
  benefitsAnnual: number;
  otherOnCostsAnnual: number;
  totalCostAnnual: number;
  burdenAmountAnnual: number; // totalCostAnnual - wagesAnnual
  burdenPercent: number; // (burdenAmount / wages) * 100

  // Hours
  paidHoursAnnual: number;
  timeOffHoursAnnual: number;
  productiveHoursAnnual: number;

  // Rates
  burdenedRatePerPaidHour: number;
  burdenedRatePerProductiveHour: number | null;
  baseHourlyWage: number;
}

export interface CrewMemberRow {
  id: string;
  role: string;
  burdenedHourlyRate: number; // rate per productive hour
  regularHours: number;
  overtimeHours: number;
  overtimeMultiplier?: number; // default 1.5
}

export interface JobQuoteInput {
  crew: CrewMemberRow[];
  materialsCost: number;
  equipmentCost: number;
  subcontractorsCost: number;
  overheadPercent: number; // e.g. 15%
  profitPercent: number; // e.g. 10%
  pricingMode?: QuotePricingMode; // 'markup' (default) or 'margin'
}

export interface JobQuoteResult {
  totalLaborHours: number;
  regularLaborHours: number;
  overtimeLaborHours: number;
  totalLaborCost: number;
  directCostsSubtotal: number; // labor + materials + equipment + subs
  overheadAmount: number;
  costWithOverhead: number;
  profitAmount: number;
  finalQuotePrice: number;
  effectiveMarkupPercent: number;
  effectiveGrossMarginPercent: number;
}

export interface LaborPercentResult {
  laborCost: number;
  revenue: number;
  laborPercent: number | null; // (laborCost / revenue) * 100
}

export interface SubVsEmployeeInput {
  burdenedProductiveRate: number; // from EmployeeBurdenResult
  subcontractorHourlyRate: number; // quote from 1099 contractor
  projectHours: number;
}

export interface SubVsEmployeeResult {
  employeeTotalCost: number;
  subcontractorTotalCost: number;
  costDifference: number; // positive = employee cheaper; negative = sub cheaper
  cheaperOption: 'employee' | 'subcontractor' | 'equal';
  percentDifference: number; // difference as % of employee cost
}

// -------------------------------------------------------------
// HELPER CALCULATIONS
// -------------------------------------------------------------

function cleanNum(val: number): number {
  if (!Number.isFinite(val)) return 0;
  return Math.round(val * 100) / 100;
}

// -------------------------------------------------------------
// 1. EMPLOYEE BURDEN ENGINE
// -------------------------------------------------------------

export function calculateEmployeeBurden(input: EmployeeBurdenInput): EmployeeBurdenBreakdown {
  const paidHours = Math.max(0, input.paidHoursPerYear || 2080);
  const otHours = Math.max(0, input.overtimeHoursPerYear || 0);
  const otMultiplier = Math.max(1, input.overtimeMultiplier || 1.5);

  let baseRate = 0;
  let regularWages = 0;

  if (input.payType === 'salary') {
    regularWages = Math.max(0, input.annualSalary || 0);
    baseRate = paidHours > 0 ? regularWages / paidHours : 0;
  } else {
    baseRate = Math.max(0, input.hourlyRate || 0);
    regularWages = baseRate * paidHours;
  }

  const otWages = otHours * baseRate * otMultiplier;
  const wagesAnnual = regularWages + otWages;

  let ssAnnual = 0;
  let medAnnual = 0;
  let futaAnnual = 0;
  let sutaAnnual = 0;
  let otherOnCosts = 0;

  if (input.countryMode === 'us') {
    const tax2026 = US_TAX_DATA[2026];
    const ssRate = input.ssEmployerRate !== undefined ? input.ssEmployerRate : 0.062;
    const ssBase = input.ssWageBase !== undefined ? input.ssWageBase : (tax2026?.ssWageBase ?? 184500);
    const medRate = input.medicareRate !== undefined ? input.medicareRate : 0.0145;

    const futaRate = input.futaRate !== undefined ? input.futaRate : 0.006;
    const futaBase = input.futaWageBase !== undefined ? input.futaWageBase : 7000;
    const sutaRate = input.sutaRate !== undefined ? input.sutaRate : 0.02;
    const sutaBase = input.sutaWageBase !== undefined ? input.sutaWageBase : 10000;

    // Social Security (capped at wage base)
    ssAnnual = Math.min(wagesAnnual, ssBase) * ssRate;

    // Medicare (no employer wage cap)
    medAnnual = wagesAnnual * medRate;

    // FUTA (capped at $7,000 standard wage base)
    futaAnnual = Math.min(wagesAnnual, futaBase) * futaRate;

    // SUTA (capped at state wage base)
    sutaAnnual = Math.min(wagesAnnual, sutaBase) * sutaRate;
  } else {
    // Non-US Mode: Single employer on-costs %
    const onCostsPct = Math.max(0, input.otherOnCostsPercent || 0);
    otherOnCosts = (wagesAnnual * onCostsPct) / 100;
  }

  const payrollTaxesAnnual = ssAnnual + medAnnual + futaAnnual + sutaAnnual;

  // Workers' Comp (calculated per $100 of gross payroll)
  const wcRate = Math.max(0, input.workersCompRatePer100 || 0);
  const wcAnnual = (wagesAnnual / 100) * wcRate;

  // General Liability
  const glAnnual = Math.max(0, input.generalLiabilityAnnual || 0);

  // Benefits (health, retirement, bonuses, etc.)
  const benefitsAnnual = Math.max(0, input.annualBenefits || 0);

  const totalCostAnnual =
    wagesAnnual +
    payrollTaxesAnnual +
    otherOnCosts +
    wcAnnual +
    glAnnual +
    benefitsAnnual;

  const burdenAmountAnnual = totalCostAnnual - wagesAnnual;
  const burdenPercent = wagesAnnual > 0 ? (burdenAmountAnnual / wagesAnnual) * 100 : 0;

  // Productive Hours calculation
  const holidays = Math.max(0, input.paidHolidaysHours || 0);
  const pto = Math.max(0, input.paidPtoHours || 0);
  const sick = Math.max(0, input.paidSickHours || 0);
  const training = Math.max(0, input.trainingNonBillableHours || 0);
  const timeOffHours = holidays + pto + sick + training;
  const productiveHours = Math.max(0, paidHours - timeOffHours);

  const burdenedRatePaid = paidHours > 0 ? totalCostAnnual / paidHours : 0;
  const burdenedRateProductive = productiveHours > 0 ? totalCostAnnual / productiveHours : null;

  return {
    wagesAnnual: cleanNum(wagesAnnual),
    regularWagesAnnual: cleanNum(regularWages),
    overtimeWagesAnnual: cleanNum(otWages),
    socialSecurityAnnual: cleanNum(ssAnnual),
    medicareAnnual: cleanNum(medAnnual),
    futaAnnual: cleanNum(futaAnnual),
    sutaAnnual: cleanNum(sutaAnnual),
    payrollTaxesAnnual: cleanNum(payrollTaxesAnnual),
    workersCompAnnual: cleanNum(wcAnnual),
    generalLiabilityAnnual: cleanNum(glAnnual),
    benefitsAnnual: cleanNum(benefitsAnnual),
    otherOnCostsAnnual: cleanNum(otherOnCosts),
    totalCostAnnual: cleanNum(totalCostAnnual),
    burdenAmountAnnual: cleanNum(burdenAmountAnnual),
    burdenPercent: cleanNum(burdenPercent),
    paidHoursAnnual: cleanNum(paidHours),
    timeOffHoursAnnual: cleanNum(timeOffHours),
    productiveHoursAnnual: cleanNum(productiveHours),
    burdenedRatePerPaidHour: cleanNum(burdenedRatePaid),
    burdenedRatePerProductiveHour: burdenedRateProductive !== null ? cleanNum(burdenedRateProductive) : null,
    baseHourlyWage: cleanNum(baseRate),
  };
}

// -------------------------------------------------------------
// 2. JOB LABOR & QUOTE ENGINE
// -------------------------------------------------------------

export function calculateJobQuote(input: JobQuoteInput): JobQuoteResult {
  let regularLaborHours = 0;
  let overtimeLaborHours = 0;
  let totalLaborCost = 0;

  for (const worker of input.crew) {
    const regH = Math.max(0, worker.regularHours || 0);
    const otH = Math.max(0, worker.overtimeHours || 0);
    const rate = Math.max(0, worker.burdenedHourlyRate || 0);
    const otMult = Math.max(1, worker.overtimeMultiplier || 1.5);

    regularLaborHours += regH;
    overtimeLaborHours += otH;
    totalLaborCost += regH * rate + otH * rate * otMult;
  }

  const totalLaborHours = regularLaborHours + overtimeLaborHours;
  const materials = Math.max(0, input.materialsCost || 0);
  const equipment = Math.max(0, input.equipmentCost || 0);
  const subs = Math.max(0, input.subcontractorsCost || 0);

  const directCostsSubtotal = totalLaborCost + materials + equipment + subs;

  const overheadPct = Math.max(0, input.overheadPercent || 0);
  const profitPct = Math.max(0, input.profitPercent || 0);
  const mode = input.pricingMode || 'markup';

  let overheadAmount = 0;
  let costWithOverhead = 0;
  let profitAmount = 0;
  let finalQuotePrice = 0;

  if (mode === 'margin') {
    // Margin mode: profit is a percentage of final selling price
    overheadAmount = (directCostsSubtotal * overheadPct) / 100;
    costWithOverhead = directCostsSubtotal + overheadAmount;
    const computedPrice = priceFromMargin(costWithOverhead, profitPct);
    finalQuotePrice = computedPrice !== null ? computedPrice : costWithOverhead;
    profitAmount = finalQuotePrice - costWithOverhead;
  } else {
    // Markup mode (sequential multiplier matching build spec §3.4: (directCost) * (1 + overhead) * (1 + profit))
    overheadAmount = (directCostsSubtotal * overheadPct) / 100;
    costWithOverhead = directCostsSubtotal + overheadAmount;
    finalQuotePrice = costWithOverhead * (1 + profitPct / 100);
    profitAmount = finalQuotePrice - costWithOverhead;
  }

  const effectiveMarkup = directCostsSubtotal > 0 ? ((finalQuotePrice - directCostsSubtotal) / directCostsSubtotal) * 100 : 0;
  const effectiveMargin = finalQuotePrice > 0 ? ((finalQuotePrice - directCostsSubtotal) / finalQuotePrice) * 100 : 0;

  return {
    totalLaborHours: cleanNum(totalLaborHours),
    regularLaborHours: cleanNum(regularLaborHours),
    overtimeLaborHours: cleanNum(overtimeLaborHours),
    totalLaborCost: cleanNum(totalLaborCost),
    directCostsSubtotal: cleanNum(directCostsSubtotal),
    overheadAmount: cleanNum(overheadAmount),
    costWithOverhead: cleanNum(costWithOverhead),
    profitAmount: cleanNum(profitAmount),
    finalQuotePrice: cleanNum(finalQuotePrice),
    effectiveMarkupPercent: cleanNum(effectiveMarkup),
    effectiveGrossMarginPercent: cleanNum(effectiveMargin),
  };
}

// -------------------------------------------------------------
// 3. LABOR % OF REVENUE ENGINE
// -------------------------------------------------------------

export function calculateLaborPercent(laborCost: number, revenue: number): LaborPercentResult {
  const safeLabor = Math.max(0, laborCost || 0);
  const safeRevenue = Math.max(0, revenue || 0);

  if (safeRevenue <= 0) {
    return {
      laborCost: cleanNum(safeLabor),
      revenue: cleanNum(safeRevenue),
      laborPercent: null,
    };
  }

  const pct = (safeLabor / safeRevenue) * 100;
  return {
    laborCost: cleanNum(safeLabor),
    revenue: cleanNum(safeRevenue),
    laborPercent: cleanNum(pct),
  };
}

// -------------------------------------------------------------
// 4. EMPLOYEE VS SUBCONTRACTOR ENGINE
// -------------------------------------------------------------

export function compareEmployeeVsSub(input: SubVsEmployeeInput): SubVsEmployeeResult {
  const hours = Math.max(0, input.projectHours || 0);
  const empRate = Math.max(0, input.burdenedProductiveRate || 0);
  const subRate = Math.max(0, input.subcontractorHourlyRate || 0);

  const empTotal = hours * empRate;
  const subTotal = hours * subRate;
  const diff = subTotal - empTotal; // positive if sub is more expensive, so employee saves money

  let cheaperOption: 'employee' | 'subcontractor' | 'equal' = 'equal';
  if (Math.abs(diff) < 0.01) {
    cheaperOption = 'equal';
  } else if (diff > 0) {
    cheaperOption = 'employee';
  } else {
    cheaperOption = 'subcontractor';
  }

  const pctDiff = empTotal > 0 ? (Math.abs(diff) / empTotal) * 100 : 0;

  return {
    employeeTotalCost: cleanNum(empTotal),
    subcontractorTotalCost: cleanNum(subTotal),
    costDifference: cleanNum(diff),
    cheaperOption,
    percentDifference: cleanNum(pctDiff),
  };
}
