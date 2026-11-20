/**
 * Self-Employment (1099) Tax Engine
 *
 * Implements pure IRS mathematical rules for federal self-employment and estimated taxes:
 * 1. Net self-employment earnings calculation (gross 1099 minus expenses & standard mileage).
 * 2. 92.35% statutory net earnings factor (IRC § 1402(a)(12) and Schedule SE Line 4a).
 * 3. $400 minimum net earnings threshold for SE tax liability (IRC § 1402(b)(2)).
 * 4. Social Security 12.4% tax capped at the annual wage base ($184,500 in 2026),
 *    offsetting prior W-2 wages first.
 * 5. Medicare 2.9% tax (uncapped) + 0.9% Additional Medicare surtax above statutory thresholds
 *    by filing status (IRC § 3101(b)(2)).
 * 6. Half-of-SE-tax deduction (IRC § 164(f) and Form 1040 Schedule 1 Line 15).
 * 7. Federal income tax estimation (effective rate model) and state income tax.
 * 8. Quarterly 1040-ES estimated tax voucher schedule with official IRS due dates.
 * 9. Safe harbor calculation (90% of current year vs 100% of prior year tax).
 * 10. "What-if" expense and retirement deduction impact calculator.
 *
 * Rules:
 * - Pure functions only. Zero network calls, zero side effects.
 * - All official rates and wage bases sourced strictly from `src/content/us-tax-data.ts`.
 */

import { US_TAX_DATA, UsTaxYearData } from '../content/us-tax-data';

export type FilingStatus = 'single' | 'mfj' | 'mfs' | 'hoh';

export interface SeTaxInput {
  taxYear?: number; // defaults to 2026
  grossIncome: number; // gross 1099 or freelance receipts
  expenses?: number; // Schedule C business deductions
  milesH1?: number; // Jan 1 – Jun 30 miles
  milesH2?: number; // Jul 1 – Dec 31 miles
  w2Wages?: number; // W-2 employment salary (uses wage base first)
  w2FederalTaxWithheld?: number; // already withheld on W-2
  filingStatus?: FilingStatus;
  fedTaxRatePct?: number; // effective federal rate (default: 12%)
  stateTaxRatePct?: number; // effective state rate (default: 0%)
  priorYearTotalTax?: number; // for safe-harbor comparison
  extraDeductions?: number; // SEP-IRA, Solo 401(k), health insurance deduction
}

export interface QuarterlyVoucher {
  quarter: number;
  label: string;
  dueDate: string;
  amount: number;
}

export interface SeTaxResult {
  taxYear: number;
  grossIncome: number;
  expenses: number;
  mileageDeduction: number;
  netSelfEmploymentEarnings: number;
  isBelowMinimum: boolean;
  seFactor: number;
  taxableSeBase: number;
  ssWageBaseRemaining: number;
  socialSecurityTax: number;
  medicareTax: number;
  additionalMedicareTax: number;
  totalSeTax: number;
  halfSeDeduction: number;
  taxableIncomeEstimate: number;
  federalIncomeTaxEstimate: number;
  stateIncomeTaxEstimate: number;
  totalTaxLiability: number;
  remainingTaxDue: number;
  effectiveTaxRatePct: number;
  quarterlyPayment: number;
  quarterlyVouchers: QuarterlyVoucher[];
  safeHarbor: {
    currentYear90Pct: number;
    priorYear100Pct: number | null;
    recommendedAnnualTarget: number;
    recommendedQuarterlyPayment: number;
  };
}

export interface WhatIfResult {
  additionalDeduction: number;
  baseTotalTax: number;
  newTotalTax: number;
  taxSavings: number;
  effectiveSavingsRatePct: number;
  netOutOfPocketCost: number;
}

function clean(n: number): number {
  if (Object.is(n, -0) || Math.abs(n) < 1e-10) return 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates standard mileage deduction based on official split rates in us-tax-data.
 */
export function calculateMileageDeduction(
  milesH1: number = 0,
  milesH2: number = 0,
  taxYear: number = 2026
): number {
  const data: UsTaxYearData = US_TAX_DATA[taxYear] || US_TAX_DATA[2026];
  const safeMilesH1 = Math.max(0, milesH1 || 0);
  const safeMilesH2 = Math.max(0, milesH2 || 0);

  const rateH1 = (data.mileage[0]?.centsPerMile || 72.5) / 100;
  const rateH2 = (data.mileage[1]?.centsPerMile || 76.0) / 100;

  return clean(safeMilesH1 * rateH1 + safeMilesH2 * rateH2);
}

/**
 * Calculates self-employment tax, deductions, and quarterly payments.
 */
export function calculateSeTax(input: SeTaxInput): SeTaxResult {
  const taxYear = input.taxYear || 2026;
  const data: UsTaxYearData = US_TAX_DATA[taxYear] || US_TAX_DATA[2026];

  const grossIncome = Math.max(0, input.grossIncome || 0);
  const expenses = Math.max(0, input.expenses || 0);
  const mileageDeduction = calculateMileageDeduction(input.milesH1, input.milesH2, taxYear);
  const w2Wages = Math.max(0, input.w2Wages || 0);
  const w2Withheld = Math.max(0, input.w2FederalTaxWithheld || 0);
  const filingStatus = input.filingStatus || 'single';
  const fedRate = Math.max(0, (input.fedTaxRatePct ?? 12) / 100);
  const stateRate = Math.max(0, (input.stateTaxRatePct ?? 0) / 100);
  const priorYearTax = input.priorYearTotalTax && input.priorYearTotalTax > 0 ? input.priorYearTotalTax : null;
  const extraDeductions = Math.max(0, input.extraDeductions || 0);

  // 1. Net Self-Employment Earnings
  const netSelfEmploymentEarnings = clean(grossIncome - expenses - mileageDeduction);

  // 2. Threshold Check (IRC § 1402(b)(2): if net < $400, no SE tax is due)
  const isBelowMinimum = netSelfEmploymentEarnings < data.seMinimumNet;

  const seFactor = data.seFactor ?? 0.9235;

  let taxableSeBase = 0;
  let ssWageBaseRemaining = 0;
  let socialSecurityTax = 0;
  let medicareTax = 0;
  let additionalMedicareTax = 0;
  let totalSeTax = 0;
  let halfSeDeduction = 0;

  if (!isBelowMinimum && netSelfEmploymentEarnings > 0) {
    // Statutory 92.35% net earnings multiplier
    taxableSeBase = clean(netSelfEmploymentEarnings * seFactor);

    // Social Security room remaining after W-2 wages
    ssWageBaseRemaining = clean(Math.max(0, data.ssWageBase - w2Wages));
    const ssSubject = Math.min(taxableSeBase, ssWageBaseRemaining);
    socialSecurityTax = clean(ssSubject * data.ssRate);

    // Standard Medicare 2.9% on all taxable SE base
    medicareTax = clean(taxableSeBase * data.medicareRate);

    // Additional Medicare 0.9% surtax for high earners
    const threshold = data.addlMedicareThresholds[filingStatus] || 200000;
    const combinedEarnings = taxableSeBase + w2Wages;
    const addlMedSubject = Math.max(0, combinedEarnings - threshold);
    additionalMedicareTax = clean(addlMedSubject * data.addlMedicareRate);

    totalSeTax = clean(socialSecurityTax + medicareTax + additionalMedicareTax);

    // Half of regular SE tax is deductible (Schedule 1, Line 15)
    // Note: Additional Medicare 0.9% is NOT deductible
    halfSeDeduction = clean((socialSecurityTax + medicareTax) / 2);
  }

  // 3. Federal & State Income Tax Estimation
  // Adjusted net income for tax brackets
  const taxableIncomeEstimate = clean(
    Math.max(0, netSelfEmploymentEarnings - halfSeDeduction - extraDeductions + w2Wages)
  );

  const federalIncomeTaxEstimate = clean(taxableIncomeEstimate * fedRate);
  const stateIncomeTaxEstimate = clean(taxableIncomeEstimate * stateRate);

  // 4. Total Tax Liability & Net Due
  const totalTaxLiability = clean(totalSeTax + federalIncomeTaxEstimate + stateIncomeTaxEstimate);
  const remainingTaxDue = clean(Math.max(0, totalTaxLiability - w2Withheld));
  const effectiveTaxRatePct = grossIncome > 0 ? clean((totalTaxLiability / grossIncome) * 100) : 0;

  // 5. Quarterly Payments (Form 1040-ES)
  const quarterlyPayment = clean(remainingTaxDue / 4);

  const dueDates = data.estimatedTaxDueDates || ['2026-04-15', '2026-06-15', '2026-09-15', '2027-01-15'];
  const labels = ['Q1 (Jan 1 – Mar 31)', 'Q2 (Apr 1 – May 31)', 'Q3 (Jun 1 – Aug 31)', 'Q4 (Sep 1 – Dec 31)'];

  const quarterlyVouchers: QuarterlyVoucher[] = dueDates.map((date, idx) => ({
    quarter: idx + 1,
    label: labels[idx] || `Q${idx + 1}`,
    dueDate: date,
    amount: quarterlyPayment,
  }));

  // 6. Safe Harbor Benchmark
  const currentYear90Pct = clean(remainingTaxDue * (data.safeHarbor.currentYearPct / 100));
  const priorYear100Pct = priorYearTax ? clean(priorYearTax * (data.safeHarbor.priorYearPct / 100)) : null;

  let recommendedAnnualTarget = currentYear90Pct;
  if (priorYear100Pct !== null) {
    recommendedAnnualTarget = Math.min(currentYear90Pct, priorYear100Pct);
  }
  const recommendedQuarterlyPayment = clean(recommendedAnnualTarget / 4);

  return {
    taxYear,
    grossIncome,
    expenses,
    mileageDeduction,
    netSelfEmploymentEarnings,
    isBelowMinimum,
    seFactor,
    taxableSeBase,
    ssWageBaseRemaining,
    socialSecurityTax,
    medicareTax,
    additionalMedicareTax,
    totalSeTax,
    halfSeDeduction,
    taxableIncomeEstimate,
    federalIncomeTaxEstimate,
    stateIncomeTaxEstimate,
    totalTaxLiability,
    remainingTaxDue,
    effectiveTaxRatePct,
    quarterlyPayment,
    quarterlyVouchers,
    safeHarbor: {
      currentYear90Pct,
      priorYear100Pct,
      recommendedAnnualTarget,
      recommendedQuarterlyPayment,
    },
  };
}

/**
 * Calculates tax savings from an extra business deduction or retirement plan contribution.
 */
export function calculateWhatIf(
  baseInput: SeTaxInput,
  additionalDeduction: number
): WhatIfResult {
  const baseRes = calculateSeTax(baseInput);

  const newExpenses = (baseInput.expenses || 0) + Math.max(0, additionalDeduction);
  const newRes = calculateSeTax({
    ...baseInput,
    expenses: newExpenses,
  });

  const taxSavings = clean(baseRes.totalTaxLiability - newRes.totalTaxLiability);
  const effectiveSavingsRatePct =
    additionalDeduction > 0 ? clean((taxSavings / additionalDeduction) * 100) : 0;
  const netOutOfPocketCost = clean(Math.max(0, additionalDeduction - taxSavings));

  return {
    additionalDeduction,
    baseTotalTax: baseRes.totalTaxLiability,
    newTotalTax: newRes.totalTaxLiability,
    taxSavings,
    effectiveSavingsRatePct,
    netOutOfPocketCost,
  };
}
