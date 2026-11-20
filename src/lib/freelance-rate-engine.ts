/**
 * Freelance Hourly Rate Calculator Engine
 *
 * Implements two-way freelance economics:
 * 1. Goal -> Rate: Target annual take-home pay -> Required pre-tax profit -> Gross revenue needed -> Break-even & recommended hourly rate, day rate, weekly retainer.
 * 2. Rate -> Income: Hourly rate -> Gross revenue based on billable hours -> Operating profit -> Net take-home pay after tax.
 * 3. Project Quote: Project hours * rate * (1 + revision buffer) + fixed project expenses.
 * 4. Equivalent Salaried Wage comparison.
 * 5. US Self-Employment Tax helper (SECA 15.3% on 92.35% of net profit, capped at wage base for Social Security, using us-tax-data.ts).
 *
 * Zero external network calls. All calculations are deterministic, pure, and protected against division by zero.
 */

import { US_TAX_DATA } from '../content/us-tax-data';

export interface FreelanceCalendarInput {
  workDaysPerWeek?: number; // default: 5
  hoursPerDay?: number; // default: 8
  holidaysDays?: number; // default: 10
  vacationDays?: number; // default: 15
  sickDays?: number; // default: 5
  trainingDays?: number; // default: 5
  billablePct: number; // percentage of working time that is billable (e.g. 70%)
}

export interface FreelanceBusinessCostsInput {
  softwareMonthly?: number; // SaaS, design tools, accounting software
  equipmentAnnual?: number; // Laptop, cameras, hardware amortized
  insuranceAnnual?: number; // Professional liability / E&O insurance
  coworkingMonthly?: number; // Office or coworking space
  otherAnnual?: number; // Phone, internet share, marketing, legal/accounting
}

export interface FreelanceBenefitsInput {
  healthInsuranceAnnual?: number; // Private health/dental/vision premiums
  retirementAnnual?: number; // SEP-IRA, Solo 401(k), pension contributions
}

export interface FreelanceGoalInput {
  targetTakeHome: number; // Target annual income after income tax ($70,000)
  taxPct: number; // Estimated effective income & self-employment tax % on profit (e.g. 25%)
  calendar: FreelanceCalendarInput;
  businessCosts: FreelanceBusinessCostsInput;
  benefits: FreelanceBenefitsInput;
  bufferPct?: number; // Profit margin / risk buffer % on top of break-even (e.g. 15%)
}

export interface FreelanceRateResult {
  // Calendar breakdown
  totalPossibleDays: number; // 52 * workDaysPerWeek
  timeOffDays: number; // holidays + vacation + sick + training
  actualWorkDays: number;
  totalWorkingHours: number;
  billableHours: number;
  nonBillableHours: number;
  billableHoursPerWeek: number;

  // Financial stack
  targetTakeHome: number;
  effectiveTaxPct: number;
  taxAmount: number;
  preTaxProfitNeeded: number;
  totalBusinessCostsAnnual: number;
  totalBenefitsAnnual: number;
  requiredRevenueAnnual: number;
  requiredRevenueMonthly: number;

  // Rates
  breakEvenHourlyRate: number | null;
  recommendedHourlyRate: number | null;
  bufferPct: number;
  dayRate: number | null; // recommendedHourlyRate * hoursPerDay
  weeklyRetainer: number | null; // recommendedHourlyRate * billableHoursPerWeek
  monthlyRetainer: number | null; // weeklyRetainer * 52 / 12

  // Equivalent salaried wage
  equivalentSalaryGross: number; // Salaried job paying preTaxProfitNeeded
}

export interface FreelanceIncomeInput {
  hourlyRate: number;
  calendar: FreelanceCalendarInput;
  businessCosts: FreelanceBusinessCostsInput;
  benefits: FreelanceBenefitsInput;
  taxPct: number;
}

export interface FreelanceIncomeResult {
  hourlyRate: number;
  billableHours: number;
  grossRevenueAnnual: number;
  grossRevenueMonthly: number;
  totalBusinessCostsAnnual: number;
  totalBenefitsAnnual: number;
  operatingProfit: number;
  taxAmount: number;
  netTakeHomeAnnual: number;
  netTakeHomeMonthly: number;
}

export interface FreelanceProjectInput {
  estimatedHours: number;
  hourlyRate: number;
  revisionBufferPct?: number; // e.g. 10% - 20% scope creep buffer
  fixedExpenses?: number; // subcontracts, assets, stock licenses
}

export interface FreelanceProjectResult {
  baseLaborCost: number;
  bufferAmount: number;
  fixedExpenses: number;
  totalProjectQuote: number;
  effectiveHourlyRate: number;
}

export interface UsSelfEmploymentTaxBreakdown {
  profitSubjectToTax: number; // 92.35% of net profit
  socialSecurityTax: number; // 12.4% up to cap
  medicareTax: number; // 2.9% uncapped
  totalSelfEmploymentTax: number;
  halfDeductiblePortion: number; // 50% deduction for AGI
  effectiveSeTaxRatePct: number;
}

/**
 * Calculates work days and billable hours from calendar inputs.
 */
export function calculateFreelanceCalendar(cal: FreelanceCalendarInput) {
  const daysPerWeek = Math.max(1, Math.min(7, cal.workDaysPerWeek ?? 5));
  const hoursPerDay = Math.max(1, Math.min(24, cal.hoursPerDay ?? 8));
  const holidays = Math.max(0, cal.holidaysDays ?? 10);
  const vacation = Math.max(0, cal.vacationDays ?? 15);
  const sick = Math.max(0, cal.sickDays ?? 5);
  const training = Math.max(0, cal.trainingDays ?? 5);
  const billableRatio = Math.max(0, Math.min(100, cal.billablePct)) / 100;

  const totalPossibleDays = 52 * daysPerWeek;
  const timeOffDays = holidays + vacation + sick + training;
  const actualWorkDays = Math.max(0, totalPossibleDays - timeOffDays);
  const totalWorkingHours = actualWorkDays * hoursPerDay;
  const billableHours = totalWorkingHours * billableRatio;
  const nonBillableHours = totalWorkingHours - billableHours;
  const billableHoursPerWeek = billableHours / 52;

  return {
    daysPerWeek,
    hoursPerDay,
    totalPossibleDays,
    timeOffDays,
    actualWorkDays,
    totalWorkingHours,
    billableHours,
    nonBillableHours,
    billableHoursPerWeek,
  };
}

/**
 * Sums annual business operating costs and health/retirement benefits.
 */
export function sumFreelanceExpenses(
  costs: FreelanceBusinessCostsInput,
  benefits: FreelanceBenefitsInput
) {
  const software = Math.max(0, costs.softwareMonthly ?? 0) * 12;
  const equipment = Math.max(0, costs.equipmentAnnual ?? 0);
  const insurance = Math.max(0, costs.insuranceAnnual ?? 0);
  const coworking = Math.max(0, costs.coworkingMonthly ?? 0) * 12;
  const other = Math.max(0, costs.otherAnnual ?? 0);

  const totalBusinessCostsAnnual = software + equipment + insurance + coworking + other;

  const health = Math.max(0, benefits.healthInsuranceAnnual ?? 0);
  const retirement = Math.max(0, benefits.retirementAnnual ?? 0);
  const totalBenefitsAnnual = health + retirement;

  return {
    totalBusinessCostsAnnual,
    totalBenefitsAnnual,
  };
}

/**
 * Mode 1: Goal -> Hourly & Project Rate
 */
export function calculateFreelanceRateFromGoal(input: FreelanceGoalInput): FreelanceRateResult {
  const cal = calculateFreelanceCalendar(input.calendar);
  const exp = sumFreelanceExpenses(input.businessCosts, input.benefits);

  const targetTakeHome = Math.max(0, input.targetTakeHome);
  const taxRatio = Math.max(0, Math.min(99, input.taxPct)) / 100;
  const bufferRatio = Math.max(0, (input.bufferPct ?? 15) / 100);

  // Pre-tax profit needed: Take-Home / (1 - Tax Rate)
  const preTaxProfitNeeded = 1 - taxRatio > 0 ? targetTakeHome / (1 - taxRatio) : targetTakeHome;
  const taxAmount = preTaxProfitNeeded - targetTakeHome;

  // Required Revenue: Profit + Business Costs + Benefits
  const requiredRevenueAnnual = preTaxProfitNeeded + exp.totalBusinessCostsAnnual + exp.totalBenefitsAnnual;
  const requiredRevenueMonthly = requiredRevenueAnnual / 12;

  // Rates
  let breakEvenHourlyRate: number | null = null;
  let recommendedHourlyRate: number | null = null;
  let dayRate: number | null = null;
  let weeklyRetainer: number | null = null;
  let monthlyRetainer: number | null = null;

  if (cal.billableHours > 0) {
    breakEvenHourlyRate = requiredRevenueAnnual / cal.billableHours;
    recommendedHourlyRate = breakEvenHourlyRate * (1 + bufferRatio);
    dayRate = recommendedHourlyRate * cal.hoursPerDay;
    // Weekly retainer = recommended rate * hoursPerDay * daysPerWeek * billablePct (per SPEC §3.4)
    const billableRatio = Math.max(0, Math.min(100, input.calendar.billablePct)) / 100;
    weeklyRetainer = recommendedHourlyRate * cal.hoursPerDay * cal.daysPerWeek * billableRatio;
    monthlyRetainer = (weeklyRetainer * 52) / 12;
  }

  return {
    totalPossibleDays: cal.totalPossibleDays,
    timeOffDays: cal.timeOffDays,
    actualWorkDays: cal.actualWorkDays,
    totalWorkingHours: cal.totalWorkingHours,
    billableHours: cal.billableHours,
    nonBillableHours: cal.nonBillableHours,
    billableHoursPerWeek: cal.billableHoursPerWeek,
    targetTakeHome,
    effectiveTaxPct: input.taxPct,
    taxAmount,
    preTaxProfitNeeded,
    totalBusinessCostsAnnual: exp.totalBusinessCostsAnnual,
    totalBenefitsAnnual: exp.totalBenefitsAnnual,
    requiredRevenueAnnual,
    requiredRevenueMonthly,
    breakEvenHourlyRate,
    recommendedHourlyRate,
    bufferPct: input.bufferPct ?? 15,
    dayRate,
    weeklyRetainer,
    monthlyRetainer,
    equivalentSalaryGross: preTaxProfitNeeded,
  };
}

/**
 * Mode 2: Hourly Rate -> Projected Annual Income
 */
export function calculateIncomeFromRate(input: FreelanceIncomeInput): FreelanceIncomeResult {
  const cal = calculateFreelanceCalendar(input.calendar);
  const exp = sumFreelanceExpenses(input.businessCosts, input.benefits);

  const hourlyRate = Math.max(0, input.hourlyRate);
  const taxRatio = Math.max(0, Math.min(100, input.taxPct)) / 100;

  const grossRevenueAnnual = hourlyRate * cal.billableHours;
  const grossRevenueMonthly = grossRevenueAnnual / 12;

  const operatingProfit = Math.max(
    0,
    grossRevenueAnnual - exp.totalBusinessCostsAnnual - exp.totalBenefitsAnnual
  );
  const taxAmount = operatingProfit * taxRatio;
  const netTakeHomeAnnual = operatingProfit - taxAmount;
  const netTakeHomeMonthly = netTakeHomeAnnual / 12;

  return {
    hourlyRate,
    billableHours: cal.billableHours,
    grossRevenueAnnual,
    grossRevenueMonthly,
    totalBusinessCostsAnnual: exp.totalBusinessCostsAnnual,
    totalBenefitsAnnual: exp.totalBenefitsAnnual,
    operatingProfit,
    taxAmount,
    netTakeHomeAnnual,
    netTakeHomeMonthly,
  };
}

/**
 * Mode 3: Project Quote Builder
 */
export function calculateProjectQuote(input: FreelanceProjectInput): FreelanceProjectResult {
  const hours = Math.max(0, input.estimatedHours);
  const rate = Math.max(0, input.hourlyRate);
  const bufferRatio = Math.max(0, (input.revisionBufferPct ?? 15) / 100);
  const fixed = Math.max(0, input.fixedExpenses ?? 0);

  const baseLaborCost = hours * rate;
  const bufferAmount = baseLaborCost * bufferRatio;
  const totalProjectQuote = baseLaborCost + bufferAmount + fixed;
  const effectiveHourlyRate = hours > 0 ? (totalProjectQuote - fixed) / hours : rate;

  return {
    baseLaborCost,
    bufferAmount,
    fixedExpenses: fixed,
    totalProjectQuote,
    effectiveHourlyRate,
  };
}

/**
 * US Self-Employment Tax Helper (SECA computation)
 * Uses official IRS statutory rate (15.3% on 92.35% of net earnings) from us-tax-data.ts
 */
export function calculateUsSelfEmploymentTaxHelper(netProfit: number, taxYear = 2026): UsSelfEmploymentTaxBreakdown {
  const profit = Math.max(0, netProfit);
  const yearData = US_TAX_DATA[taxYear] || US_TAX_DATA[2026];
  // Net earnings from self-employment = net profit * 92.35% (Schedule SE instructions)
  const seFactor = yearData.seFactor ?? 0.9235;
  const profitSubjectToTax = profit * seFactor;

  // Social Security: 12.4% up to statutory cap
  const ssCap = yearData.ssWageBase;
  const ssSubject = Math.min(profitSubjectToTax, ssCap);
  const socialSecurityTax = ssSubject * yearData.ssRate;

  // Medicare: 2.9% uncapped
  const medicareTax = profitSubjectToTax * yearData.medicareRate;

  const totalSelfEmploymentTax = socialSecurityTax + medicareTax;
  const halfDeductiblePortion = totalSelfEmploymentTax / 2; // Above-the-line deduction for AGI
  const effectiveSeTaxRatePct = profit > 0 ? (totalSelfEmploymentTax / profit) * 100 : 0;

  return {
    profitSubjectToTax,
    socialSecurityTax,
    medicareTax,
    totalSelfEmploymentTax,
    halfDeductiblePortion,
    effectiveSeTaxRatePct,
  };
}
