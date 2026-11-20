/**
 * Commercial Lease Engine — Pure calculation functions for:
 * 1. Occupancy cost, rentable sq ft (load factor), and pass-throughs (Gross, Modified Gross, NNN)
 * 2. Multi-year lease schedule with escalations (fixed % or $/SF), free rent, and TI allowance
 * 3. Net effective rent per square foot
 * 4. CAM (Common Area Maintenance) pro-rata building share
 * 5. Retail percentage rent with natural/specified breakpoints
 * 6. Side-by-side comparison of two lease offers
 *
 * Rules:
 * - Pure functions only. Zero network calls, zero external side effects.
 * - Handles sq ft and sq m.
 */

export type AreaUnit = 'sqft' | 'sqm';
export type LeaseType = 'gross' | 'modified-gross' | 'nnn' | 'absolute-nnn';
export type RateBasis = 'per-year' | 'per-month';
export type EscalationType = 'percent' | 'step-rate' | 'none';
export type EscalationAppliesTo = 'base-only' | 'all-costs';
export type FreeRentAppliesTo = 'base-only' | 'all-costs';

export interface ModifiedGrossToggles {
  tenantPaysPropertyTax: boolean;
  tenantPaysInsurance: boolean;
  tenantPaysCam: boolean;
  tenantPaysUtilities: boolean;
}

export interface CommercialLeaseInput {
  // Space
  areaInputMode?: 'usable' | 'rentable';
  usableArea: number; // USF (e.g. 2,000)
  rentableArea?: number; // RSF (e.g. 2,300 or computed)
  loadFactorPercent: number; // e.g. 15%
  areaUnit: AreaUnit; // 'sqft' | 'sqm'

  // Rent & Type
  baseRate: number; // e.g. 24
  rateBasis: RateBasis; // 'per-year' (default) or 'per-month'
  leaseType: LeaseType; // 'gross' | 'modified-gross' | 'nnn' | 'absolute-nnn'
  modifiedGrossToggles?: ModifiedGrossToggles;

  // Pass-Throughs ($/unit/year)
  propertyTaxAnnualPerUnit: number; // e.g. 3
  insuranceAnnualPerUnit: number; // e.g. 1
  camAnnualPerUnit: number; // e.g. 4
  utilitiesAnnualPerUnit?: number; // optional additional

  // Term & Escalations
  leaseTermYears: number; // e.g. 5
  escalationType: EscalationType; // 'percent' (default), 'step-rate', 'none'
  escalationValue: number; // e.g. 3 (% per year) or 1.00 ($/SF/year increase)
  escalationAppliesTo: EscalationAppliesTo; // 'base-only' (default) | 'all-costs'

  // Concessions
  freeRentMonths: number; // e.g. 2
  freeRentAppliesTo: FreeRentAppliesTo; // 'base-only' (default) | 'all-costs'
  tenantImprovementAllowancePerUnit: number; // e.g. 10 ($/SF TI)
}

export interface LeaseScheduleYear {
  year: number;
  baseRatePerUnitYr: number;
  passThroughRatePerUnitYr: number;
  baseRentAnnual: number;
  passThroughAnnual: number;
  freeRentCredit: number;
  totalRentAnnual: number;
  monthlyAverage: number;
  cumulativeTotal: number;
}

export interface CommercialLeaseResult {
  rentableArea: number; // RSF
  usableArea: number; // USF
  loadFactorPercent: number;

  // Year 1 Metrics
  year1BaseRentAnnual: number;
  year1BaseRentMonthly: number;
  year1PassThroughAnnual: number;
  year1PassThroughMonthly: number;
  year1TotalAnnual: number;
  year1TotalMonthly: number;

  // Full Term Metrics
  totalLeaseCost: number;
  totalBaseRent: number;
  totalPassThroughs: number;
  totalFreeRentCredit: number;
  totalTiAllowance: number;
  averageMonthlyCost: number;

  // Effective Rent
  netEffectiveRentPerUnitYr: number; // (Total Base - Free Rent - TI) / (RSF * years)
  netEffectiveRentTotalCostPerUnitYr: number; // (Total Cost - TI) / (RSF * years)

  // Schedule Breakdown
  schedule: LeaseScheduleYear[];
}

export interface CamShareInput {
  tenantRentableArea: number; // e.g. 2,300
  buildingRentableArea: number; // e.g. 50,000
  totalBuildingCamAnnual: number; // e.g. 200,000
}

export interface CamShareResult {
  proRataSharePercent: number | null; // e.g. 4.6%
  tenantCamAnnual: number | null;
  tenantCamMonthly: number | null;
  tenantCamPerUnitYr: number | null;
}

export interface PercentageRentInput {
  annualGrossSales: number; // e.g. 1,000,000
  breakpointMode: 'natural' | 'custom';
  annualBaseRent: number; // for natural breakpoint = baseRent / percentage
  customBreakpoint: number; // e.g. 800,000
  percentageRentRate: number; // e.g. 6% (0.06)
}

export interface PercentageRentResult {
  effectiveBreakpoint: number;
  salesAboveBreakpoint: number;
  percentageRentAnnual: number;
  totalRentAnnual: number; // baseRent + percentageRent
}

export interface LeaseComparisonResult {
  offerA: CommercialLeaseResult;
  offerB: CommercialLeaseResult;
  costDifferenceTotal: number; // Offer A - Offer B
  monthlyDifference: number;
  cheaperOffer: 'A' | 'B' | 'equal';
  savingsPercent: number;
}

// -------------------------------------------------------------
// HELPER CALCULATIONS
// -------------------------------------------------------------

function clean(val: number): number {
  if (!Number.isFinite(val)) return 0;
  return Math.round(val * 100) / 100;
}

// -------------------------------------------------------------
// 1. COMMERCIAL LEASE CALCULATOR ENGINE
// -------------------------------------------------------------

export function calculateCommercialLease(input: CommercialLeaseInput): CommercialLeaseResult {
  const loadFactor = Math.max(0, input.loadFactorPercent || 0);

  let usf = Math.max(0, input.usableArea || 0);
  let rsf = 0;

  if (input.areaInputMode === 'rentable' && input.rentableArea !== undefined && input.rentableArea > 0) {
    rsf = input.rentableArea;
    usf = loadFactor > 0 ? rsf / (1 + loadFactor / 100) : rsf;
  } else {
    rsf = usf * (1 + loadFactor / 100);
  }

  // Base rate normalized to $/unit/year
  let baseRateYr = Math.max(0, input.baseRate || 0);
  if (input.rateBasis === 'per-month') {
    baseRateYr = baseRateYr * 12;
  }

  // Determine tenant's pass-through rate per unit per year based on lease type
  let passThroughRateYr = 0;
  const taxRate = Math.max(0, input.propertyTaxAnnualPerUnit || 0);
  const insRate = Math.max(0, input.insuranceAnnualPerUnit || 0);
  const camRate = Math.max(0, input.camAnnualPerUnit || 0);
  const utilRate = Math.max(0, input.utilitiesAnnualPerUnit || 0);

  if (input.leaseType === 'gross') {
    // Full service gross: landlord absorbs all pass-throughs
    passThroughRateYr = 0;
  } else if (input.leaseType === 'modified-gross') {
    // Modified gross: tenant pays selected items
    const toggles = input.modifiedGrossToggles || {
      tenantPaysPropertyTax: false,
      tenantPaysInsurance: false,
      tenantPaysCam: true,
      tenantPaysUtilities: true,
    };
    if (toggles.tenantPaysPropertyTax) passThroughRateYr += taxRate;
    if (toggles.tenantPaysInsurance) passThroughRateYr += insRate;
    if (toggles.tenantPaysCam) passThroughRateYr += camRate;
    if (toggles.tenantPaysUtilities) passThroughRateYr += utilRate;
  } else {
    // NNN and Absolute NNN: tenant pays tax + ins + cam + utilities
    passThroughRateYr = taxRate + insRate + camRate + utilRate;
  }

  const years = Math.max(1, Math.round(input.leaseTermYears || 5));
  const escType = input.escalationType || 'percent';
  const escVal = input.escalationValue || 0;
  const escAppliesTo = input.escalationAppliesTo || 'base-only';

  const freeMonths = Math.max(0, input.freeRentMonths || 0);
  const freeAppliesTo = input.freeRentAppliesTo || 'base-only';
  const tiAllowancePerUnit = Math.max(0, input.tenantImprovementAllowancePerUnit || 0);
  const totalTiAllowance = rsf * tiAllowancePerUnit;

  const schedule: LeaseScheduleYear[] = [];
  let cumTotal = 0;
  let totalBaseRent = 0;
  let totalPassThroughs = 0;
  let totalFreeRentCredit = 0;

  for (let y = 1; y <= years; y++) {
    // Calculate year's rates
    let yrBaseRate = baseRateYr;
    let yrPassRate = passThroughRateYr;

    if (escType === 'percent') {
      const mult = Math.pow(1 + escVal / 100, y - 1);
      yrBaseRate = baseRateYr * mult;
      if (escAppliesTo === 'all-costs') {
        yrPassRate = passThroughRateYr * mult;
      }
    } else if (escType === 'step-rate') {
      yrBaseRate = baseRateYr + escVal * (y - 1);
      if (escAppliesTo === 'all-costs') {
        yrPassRate = passThroughRateYr + escVal * (y - 1);
      }
    }

    const yrBaseRent = rsf * yrBaseRate;
    const yrPassRent = rsf * yrPassRate;

    // Free rent credit calculation (typically applied in year 1)
    let yrFreeRentCredit = 0;
    if (y === 1 && freeMonths > 0) {
      const monthlyBase1 = yrBaseRent / 12;
      const monthlyPass1 = yrPassRent / 12;
      if (freeAppliesTo === 'all-costs') {
        yrFreeRentCredit = freeMonths * (monthlyBase1 + monthlyPass1);
      } else {
        yrFreeRentCredit = freeMonths * monthlyBase1;
      }
    }

    const yrTotalRent = yrBaseRent + yrPassRent - yrFreeRentCredit;
    cumTotal += yrTotalRent;
    totalBaseRent += yrBaseRent;
    totalPassThroughs += yrPassRent;
    totalFreeRentCredit += yrFreeRentCredit;

    schedule.push({
      year: y,
      baseRatePerUnitYr: clean(yrBaseRate),
      passThroughRatePerUnitYr: clean(yrPassRate),
      baseRentAnnual: clean(yrBaseRent),
      passThroughAnnual: clean(yrPassRent),
      freeRentCredit: clean(yrFreeRentCredit),
      totalRentAnnual: clean(yrTotalRent),
      monthlyAverage: clean(yrTotalRent / 12),
      cumulativeTotal: clean(cumTotal),
    });
  }

  // Year 1 base metrics
  const yr1 = schedule[0];
  const yr1BaseRentAnnual = yr1.baseRentAnnual;
  const yr1BaseRentMonthly = yr1BaseRentAnnual / 12;
  const yr1PassThroughAnnual = yr1.passThroughAnnual;
  const yr1PassThroughMonthly = yr1PassThroughAnnual / 12;
  const yr1TotalAnnual = yr1BaseRentAnnual + yr1PassThroughAnnual; // gross before one-time free rent concession
  const yr1TotalMonthly = yr1TotalAnnual / 12;

  const totalLeaseCost = cumTotal;
  const totalMonths = years * 12;
  const averageMonthlyCost = totalMonths > 0 ? totalLeaseCost / totalMonths : 0;

  // Net Effective Rent per Unit per Year
  // Standard CRE definition: (Total Base Rent - Free Rent Concessions - TI Allowance) / (RSF * Years)
  const totalAreaYears = rsf * years;
  const netEffectiveRentPerUnitYr =
    totalAreaYears > 0 ? (totalBaseRent - totalFreeRentCredit - totalTiAllowance) / totalAreaYears : 0;
  const netEffectiveRentTotalCostPerUnitYr =
    totalAreaYears > 0 ? (totalLeaseCost - totalTiAllowance) / totalAreaYears : 0;

  return {
    rentableArea: clean(rsf),
    usableArea: clean(usf),
    loadFactorPercent: clean(loadFactor),
    year1BaseRentAnnual: clean(yr1BaseRentAnnual),
    year1BaseRentMonthly: clean(yr1BaseRentMonthly),
    year1PassThroughAnnual: clean(yr1PassThroughAnnual),
    year1PassThroughMonthly: clean(yr1PassThroughMonthly),
    year1TotalAnnual: clean(yr1TotalAnnual),
    year1TotalMonthly: clean(yr1TotalMonthly),
    totalLeaseCost: clean(totalLeaseCost),
    totalBaseRent: clean(totalBaseRent),
    totalPassThroughs: clean(totalPassThroughs),
    totalFreeRentCredit: clean(totalFreeRentCredit),
    totalTiAllowance: clean(totalTiAllowance),
    averageMonthlyCost: clean(averageMonthlyCost),
    netEffectiveRentPerUnitYr: clean(netEffectiveRentPerUnitYr),
    netEffectiveRentTotalCostPerUnitYr: clean(netEffectiveRentTotalCostPerUnitYr),
    schedule,
  };
}

// -------------------------------------------------------------
// 2. CAM PRO-RATA SHARE ENGINE
// -------------------------------------------------------------

export function calculateCamShare(input: CamShareInput): CamShareResult {
  const tenantRsf = Math.max(0, input.tenantRentableArea || 0);
  const buildingRsf = Math.max(0, input.buildingRentableArea || 0);
  const totalCam = Math.max(0, input.totalBuildingCamAnnual || 0);

  if (buildingRsf <= 0 || tenantRsf <= 0) {
    return {
      proRataSharePercent: null,
      tenantCamAnnual: null,
      tenantCamMonthly: null,
      tenantCamPerUnitYr: null,
    };
  }

  const sharePct = (tenantRsf / buildingRsf) * 100;
  const tenantCamAnnual = (totalCam * sharePct) / 100;
  const tenantCamMonthly = tenantCamAnnual / 12;
  const tenantCamPerUnitYr = tenantRsf > 0 ? tenantCamAnnual / tenantRsf : 0;

  return {
    proRataSharePercent: clean(sharePct),
    tenantCamAnnual: clean(tenantCamAnnual),
    tenantCamMonthly: clean(tenantCamMonthly),
    tenantCamPerUnitYr: clean(tenantCamPerUnitYr),
  };
}

// -------------------------------------------------------------
// 3. RETAIL PERCENTAGE RENT ENGINE
// -------------------------------------------------------------

export function calculatePercentageRent(input: PercentageRentInput): PercentageRentResult {
  const sales = Math.max(0, input.annualGrossSales || 0);
  const rate = Math.max(0, input.percentageRentRate || 0) / 100;
  const baseRent = Math.max(0, input.annualBaseRent || 0);

  let breakpoint = 0;
  if (input.breakpointMode === 'natural') {
    breakpoint = rate > 0 ? baseRent / rate : 0;
  } else {
    breakpoint = Math.max(0, input.customBreakpoint || 0);
  }

  const salesAbove = Math.max(0, sales - breakpoint);
  const pctRent = salesAbove * rate;
  const totalRent = baseRent + pctRent;

  return {
    effectiveBreakpoint: clean(breakpoint),
    salesAboveBreakpoint: clean(salesAbove),
    percentageRentAnnual: clean(pctRent),
    totalRentAnnual: clean(totalRent),
  };
}

// -------------------------------------------------------------
// 4. LEASE OFFERS COMPARISON ENGINE
// -------------------------------------------------------------

export function compareLeaseOffers(
  offerAInput: CommercialLeaseInput,
  offerBInput: CommercialLeaseInput
): LeaseComparisonResult {
  const resA = calculateCommercialLease(offerAInput);
  const resB = calculateCommercialLease(offerBInput);

  const costDiff = resA.totalLeaseCost - resB.totalLeaseCost;
  const monthlyDiff = resA.averageMonthlyCost - resB.averageMonthlyCost;

  let cheaper: 'A' | 'B' | 'equal' = 'equal';
  if (Math.abs(costDiff) < 1.0) {
    cheaper = 'equal';
  } else if (costDiff > 0) {
    cheaper = 'B'; // Offer B is lower total cost
  } else {
    cheaper = 'A'; // Offer A is lower total cost
  }

  const baseForPct = Math.max(resA.totalLeaseCost, resB.totalLeaseCost);
  const savingsPct = baseForPct > 0 ? (Math.abs(costDiff) / baseForPct) * 100 : 0;

  return {
    offerA: resA,
    offerB: resB,
    costDifferenceTotal: clean(costDiff),
    monthlyDifference: clean(monthlyDiff),
    cheaperOffer: cheaper,
    savingsPercent: clean(savingsPct),
  };
}
