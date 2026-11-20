/**
 * Rental Property & Cash-on-Cash Return Calculation Engine
 * Pure calculation functions for rental property underwriting, cash flow,
 * cash-on-cash return, cap rate, yield, 10-year pro forma, and financing comparison.
 * Zero network calls, zero external dependencies.
 */

import {
  irr,
} from './real-estate-engine';
import {
  payment,
  schedule,
  LoanScheduleResult,
} from './loan-engine';

export interface RentalPropertyInput {
  // Purchase & Initial Outlay
  purchasePrice: number;
  closingCosts: number;
  upfrontRepairs: number;

  // Financing
  isFinanced: boolean;
  downPaymentPercent: number;
  interestRatePercent: number;
  loanTermYears: number;
  loanPointsPercent?: number;

  // Rental Income
  monthlyRent: number;
  otherIncomeMonthly?: number;
  vacancyPercent: number;

  // Operating Expenses
  propertyTaxAnnual: number;
  insuranceAnnual: number;
  hoaMonthly?: number;
  utilitiesMonthly?: number;
  maintenancePercentOfRent: number;
  capexPercentOfRent: number;
  managementPercentOfEgi: number;
  otherExpensesAnnual?: number;

  // Pro Forma Projection Parameters
  proFormaYears?: number; // 5 or 10
  annualRentGrowthPercent?: number;
  annualExpenseGrowthPercent?: number;
  annualAppreciationPercent?: number;
  sellingCostPercent?: number;
}

export interface ExpenseBreakdown {
  propertyTaxAnnual: number;
  insuranceAnnual: number;
  hoaAnnual: number;
  utilitiesAnnual: number;
  maintenanceAnnual: number;
  capexAnnual: number;
  managementAnnual: number;
  otherExpensesAnnual: number;
  totalOperatingExpensesAnnual: number;
  totalOperatingExpensesMonthly: number;
}

export interface ProFormaYearRow {
  year: number;
  grossRent: number;
  otherIncome: number;
  vacancyLoss: number;
  effectiveGrossIncome: number;
  operatingExpenses: number;
  noi: number;
  debtService: number;
  annualCashFlow: number;
  monthlyCashFlow: number;
  propertyValue: number;
  loanBalance: number;
  equity: number;
  principalPaidYear: number;
  cumulativeCashFlow: number;
  saleProceeds: number;
  totalReturn: number;
  irrPercent: number | null;
}

export interface RentalPropertyResult {
  // Upfront Capital
  downPaymentAmount: number;
  loanAmount: number;
  loanPointsCost: number;
  totalCashInvested: number;

  // Annual & Monthly Income Waterfall
  grossRentAnnual: number;
  otherIncomeAnnual: number;
  vacancyLossAnnual: number;
  effectiveGrossIncomeAnnual: number;

  // Expenses
  expenses: ExpenseBreakdown;

  // Operational Return (NOI)
  noiAnnual: number;
  noiMonthly: number;

  // Debt Service
  monthlyMortgagePayment: number;
  annualDebtService: number;

  // Cash Flow
  annualCashFlow: number;
  monthlyCashFlow: number;

  // Key Investment Ratios
  cashOnCashPercent: number | null;
  capRatePercent: number | null;
  dscr: number | null;
  grossYieldPercent: number | null;
  netYieldPercent: number | null;
  grm: number | null;
  rentToPricePercent: number;
  meetsOnePercentRule: boolean;
  breakEvenOccupancyPercent: number | null;

  // Multi-Year Pro Forma
  proFormaYears: ProFormaYearRow[];

  // Cash vs Financed Comparison
  comparison: {
    financed: {
      cashInvested: number;
      monthlyCashFlow: number;
      annualCashFlow: number;
      cashOnCashPercent: number | null;
      capRatePercent: number | null;
      dscr: number | null;
      tenYearTotalReturn: number;
      tenYearIrrPercent: number | null;
    };
    allCash: {
      cashInvested: number;
      monthlyCashFlow: number;
      annualCashFlow: number;
      cashOnCashPercent: number | null;
      capRatePercent: number | null;
      dscr: number | null;
      tenYearTotalReturn: number;
      tenYearIrrPercent: number | null;
    };
  };
}

function clean(n: number | null | undefined): number | null {
  if (n === null || n === undefined || !Number.isFinite(n)) return null;
  if (Object.is(n, -0) || Math.abs(n) < 1e-12) return 0;
  return Number(n.toFixed(6));
}

/**
 * Calculates complete rental property metrics from underwriting inputs.
 */
export function calculateRentalProperty(input: RentalPropertyInput): RentalPropertyResult {
  const price = Math.max(0, input.purchasePrice || 0);
  const closing = Math.max(0, input.closingCosts || 0);
  const repairs = Math.max(0, input.upfrontRepairs || 0);

  const isFinanced = input.isFinanced;
  const downPct = Math.max(0, Math.min(100, input.downPaymentPercent || 0));
  const ratePct = Math.max(0, input.interestRatePercent || 0);
  const termYears = Math.max(1, Math.round(input.loanTermYears || 30));
  const pointsPct = Math.max(0, input.loanPointsPercent || 0);

  const monthlyRent = Math.max(0, input.monthlyRent || 0);
  const otherMonthly = Math.max(0, input.otherIncomeMonthly || 0);
  const vacancyPct = Math.max(0, Math.min(100, input.vacancyPercent || 0));

  const taxAnnual = Math.max(0, input.propertyTaxAnnual || 0);
  const insAnnual = Math.max(0, input.insuranceAnnual || 0);
  const hoaMonthly = Math.max(0, input.hoaMonthly || 0);
  const utilMonthly = Math.max(0, input.utilitiesMonthly || 0);
  const maintPct = Math.max(0, input.maintenancePercentOfRent || 0);
  const capexPct = Math.max(0, input.capexPercentOfRent || 0);
  const mgmtPct = Math.max(0, input.managementPercentOfEgi || 0);
  const otherExpAnnual = Math.max(0, input.otherExpensesAnnual || 0);

  const proFormaYearsCount = input.proFormaYears && input.proFormaYears === 5 ? 5 : 10;
  const rentGrowthPct = input.annualRentGrowthPercent ?? 3;
  const expGrowthPct = input.annualExpenseGrowthPercent ?? 3;
  const apprecPct = input.annualAppreciationPercent ?? 3;
  const sellingCostPct = Math.max(0, Math.min(100, input.sellingCostPercent ?? 6));

  // 1. Initial Capital & Financing
  const downPaymentAmount = isFinanced ? (price * downPct) / 100 : price;
  const loanAmount = isFinanced ? Math.max(0, price - downPaymentAmount) : 0;
  const loanPointsCost = isFinanced ? (loanAmount * pointsPct) / 100 : 0;
  const totalCashInvested = downPaymentAmount + closing + repairs + loanPointsCost;

  // 2. Annualized Gross Income & Effective Income
  const grossRentAnnual = monthlyRent * 12;
  const otherIncomeAnnual = otherMonthly * 12;
  const vacancyLossAnnual = (grossRentAnnual * vacancyPct) / 100;
  const effectiveGrossIncomeAnnual = grossRentAnnual - vacancyLossAnnual + otherIncomeAnnual;

  // 3. Operating Expenses Breakdown
  const hoaAnnual = hoaMonthly * 12;
  const utilitiesAnnual = utilMonthly * 12;
  const maintenanceAnnual = (grossRentAnnual * maintPct) / 100;
  const capexAnnual = (grossRentAnnual * capexPct) / 100;
  const managementAnnual = (effectiveGrossIncomeAnnual * mgmtPct) / 100;

  const totalOperatingExpensesAnnual =
    taxAnnual +
    insAnnual +
    hoaAnnual +
    utilitiesAnnual +
    maintenanceAnnual +
    capexAnnual +
    managementAnnual +
    otherExpAnnual;
  const totalOperatingExpensesMonthly = totalOperatingExpensesAnnual / 12;

  const expenses: ExpenseBreakdown = {
    propertyTaxAnnual: taxAnnual,
    insuranceAnnual: insAnnual,
    hoaAnnual,
    utilitiesAnnual,
    maintenanceAnnual,
    capexAnnual,
    managementAnnual,
    otherExpensesAnnual: otherExpAnnual,
    totalOperatingExpensesAnnual,
    totalOperatingExpensesMonthly,
  };

  // 4. Net Operating Income (NOI)
  const noiAnnual = effectiveGrossIncomeAnnual - totalOperatingExpensesAnnual;
  const noiMonthly = noiAnnual / 12;

  // 5. Debt Service
  let monthlyMortgagePayment = 0;
  let annualDebtService = 0;
  let loanSched: LoanScheduleResult | null = null;

  if (isFinanced && loanAmount > 0) {
    monthlyMortgagePayment = payment(loanAmount, ratePct, termYears * 12) || 0;
    annualDebtService = monthlyMortgagePayment * 12;
    loanSched = schedule({
      principal: loanAmount,
      apr: ratePct,
      amortizationMonths: termYears * 12,
      termMonths: termYears * 12,
    });
  }

  // 6. Cash Flow
  const annualCashFlow = noiAnnual - annualDebtService;
  const monthlyCashFlow = annualCashFlow / 12;

  // 7. Core Ratios & Benchmarks
  const cashOnCashVal = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : null;
  const capRateVal = price > 0 ? (noiAnnual / price) * 100 : null;
  const dscrVal = isFinanced && annualDebtService > 0 ? noiAnnual / annualDebtService : null;
  const grossYieldVal = price > 0 ? (grossRentAnnual / price) * 100 : null;
  const netYieldVal = price > 0 ? (noiAnnual / price) * 100 : null;
  const grmVal = grossRentAnnual > 0 ? price / grossRentAnnual : null;
  const rentToPricePercent = price > 0 ? (monthlyRent / price) * 100 : 0;
  const meetsOnePercentRule = rentToPricePercent >= 1.0;

  // Break-even Occupancy %
  // Fixed costs: property tax + insurance + HOA + utilities + other + debt service
  // Variable costs: maintenance & capex (% of gross rent), management (% of EGI)
  const fixedAnnualCosts = taxAnnual + insAnnual + hoaAnnual + utilitiesAnnual + otherExpAnnual + annualDebtService;
  const grossVariablePct = maintPct + capexPct; // % of gross rent
  const mgmtDecimal = mgmtPct / 100;

  let breakEvenOccupancyPercent: number | null = null;
  if (grossRentAnnual > 0 && mgmtDecimal < 1.0) {
    const requiredGrossRent = (fixedAnnualCosts + (grossRentAnnual * grossVariablePct) / 100) / (1 - mgmtDecimal) - otherIncomeAnnual;
    const requiredOccupancyFraction = requiredGrossRent / grossRentAnnual;
    if (requiredOccupancyFraction >= 0) {
      breakEvenOccupancyPercent = clean(requiredOccupancyFraction * 100);
    }
  }

  // 8. 10-Year Pro Forma
  const proFormaYears: ProFormaYearRow[] = [];
  let cumCashFlow = 0;

  for (let year = 1; year <= proFormaYearsCount; year++) {
    const rentGrowthFactor = Math.pow(1 + rentGrowthPct / 100, year - 1);
    const expGrowthFactor = Math.pow(1 + expGrowthPct / 100, year - 1);
    const apprecFactor = Math.pow(1 + apprecPct / 100, year);

    const yrGrossRent = grossRentAnnual * rentGrowthFactor;
    const yrOtherInc = otherIncomeAnnual * rentGrowthFactor;
    const yrVacLoss = (yrGrossRent * vacancyPct) / 100;
    const yrEgi = yrGrossRent - yrVacLoss + yrOtherInc;

    const yrFixedOpex = (taxAnnual + insAnnual + hoaAnnual + utilitiesAnnual + otherExpAnnual) * expGrowthFactor;
    const yrMaint = (yrGrossRent * maintPct) / 100;
    const yrCapex = (yrGrossRent * capexPct) / 100;
    const yrMgmt = (yrEgi * mgmtPct) / 100;
    const yrOpex = yrFixedOpex + yrMaint + yrCapex + yrMgmt;

    const yrNoi = yrEgi - yrOpex;
    const yrDebtService = annualDebtService;
    const yrCashFlow = yrNoi - yrDebtService;
    cumCashFlow += yrCashFlow;

    const yrPropertyValue = price * apprecFactor;

    // Loan schedule amortization for this year
    let yrEndingBalance = 0;
    let yrPrincipalPaid = 0;
    if (loanSched && loanSched.annualSummaries[year - 1]) {
      yrEndingBalance = loanSched.annualSummaries[year - 1].endingBalance;
      yrPrincipalPaid = loanSched.annualSummaries[year - 1].principalPaid;
    }

    const yrEquity = yrPropertyValue - yrEndingBalance;
    const yrSaleProceeds = yrPropertyValue * (1 - sellingCostPct / 100) - yrEndingBalance;
    const yrTotalReturn = cumCashFlow + yrSaleProceeds - totalCashInvested;

    // Build cash flow stream for IRR
    const cashFlowSeries: number[] = [-totalCashInvested];
    const fixedExpensesAnnual = taxAnnual + insAnnual + hoaAnnual + utilitiesAnnual + otherExpAnnual;

    for (let k = 1; k <= year; k++) {
      const kRentFactor = Math.pow(1 + rentGrowthPct / 100, k - 1);
      const kExpFactor = Math.pow(1 + expGrowthPct / 100, k - 1);
      const kGross = grossRentAnnual * kRentFactor;
      const kEgi = kGross * (1 - vacancyPct / 100) + otherIncomeAnnual * kRentFactor;
      const kOpex = fixedExpensesAnnual * kExpFactor + (kGross * (maintPct + capexPct)) / 100 + (kEgi * mgmtPct) / 100;
      const kCf = kEgi - kOpex - annualDebtService;

      if (k === year) {
        cashFlowSeries.push(kCf + yrSaleProceeds);
      } else {
        cashFlowSeries.push(kCf);
      }
    }

    const yrIrr = totalCashInvested > 0 ? irr(cashFlowSeries) : null;

    proFormaYears.push({
      year,
      grossRent: clean(yrGrossRent) ?? yrGrossRent,
      otherIncome: clean(yrOtherInc) ?? yrOtherInc,
      vacancyLoss: clean(yrVacLoss) ?? yrVacLoss,
      effectiveGrossIncome: clean(yrEgi) ?? yrEgi,
      operatingExpenses: clean(yrOpex) ?? yrOpex,
      noi: clean(yrNoi) ?? yrNoi,
      debtService: clean(yrDebtService) ?? yrDebtService,
      annualCashFlow: clean(yrCashFlow) ?? yrCashFlow,
      monthlyCashFlow: clean(yrCashFlow / 12) ?? yrCashFlow / 12,
      propertyValue: clean(yrPropertyValue) ?? yrPropertyValue,
      loanBalance: clean(yrEndingBalance) ?? yrEndingBalance,
      equity: clean(yrEquity) ?? yrEquity,
      principalPaidYear: clean(yrPrincipalPaid) ?? yrPrincipalPaid,
      cumulativeCashFlow: clean(cumCashFlow) ?? cumCashFlow,
      saleProceeds: clean(yrSaleProceeds) ?? yrSaleProceeds,
      totalReturn: clean(yrTotalReturn) ?? yrTotalReturn,
      irrPercent: yrIrr !== null ? clean(yrIrr) : null,
    });
  }

  // 9. Comparison: Financed vs All-Cash (10-Year Horizon)
  // All Cash Calculation
  const cashInvestedAllCash = price + closing + repairs;
  const cashFlowAllCashAnnual = noiAnnual;
  const cashFlowAllCashMonthly = noiAnnual / 12;
  const cocAllCash = cashInvestedAllCash > 0 ? (cashFlowAllCashAnnual / cashInvestedAllCash) * 100 : null;

  // All Cash 10-Year Pro Forma
  let cumCashFlowAllCash = 0;
  const allCashCfSeries: number[] = [-cashInvestedAllCash];
  for (let k = 1; k <= 10; k++) {
    const kRentFactor = Math.pow(1 + rentGrowthPct / 100, k - 1);
    const kExpFactor = Math.pow(1 + expGrowthPct / 100, k - 1);
    const kGross = grossRentAnnual * kRentFactor;
    const kEgi = kGross * (1 - vacancyPct / 100) + otherIncomeAnnual * kRentFactor;
    const kFixed = (taxAnnual + insAnnual + hoaAnnual + utilitiesAnnual + otherExpAnnual) * kExpFactor;
    const kOpex = kFixed + (kGross * (maintPct + capexPct)) / 100 + (kEgi * mgmtPct) / 100;
    const kNoi = kEgi - kOpex;
    cumCashFlowAllCash += kNoi;
    if (k === 10) {
      const year10Value = price * Math.pow(1 + apprecPct / 100, 10);
      const year10Proceeds = year10Value * (1 - sellingCostPct / 100);
      allCashCfSeries.push(kNoi + year10Proceeds);
    } else {
      allCashCfSeries.push(kNoi);
    }
  }

  const year10ValueAllCash = price * Math.pow(1 + apprecPct / 100, 10);
  const year10ProceedsAllCash = year10ValueAllCash * (1 - sellingCostPct / 100);
  const tenYearTotalReturnAllCash = cumCashFlowAllCash + year10ProceedsAllCash - cashInvestedAllCash;
  const tenYearIrrAllCash = cashInvestedAllCash > 0 ? irr(allCashCfSeries) : null;

  // Financed comparison values at year 10
  const year10ProForma = proFormaYears[Math.min(9, proFormaYears.length - 1)];
  const tenYearTotalReturnFinanced = year10ProForma ? year10ProForma.totalReturn : 0;
  const tenYearIrrFinanced = year10ProForma ? year10ProForma.irrPercent : null;

  return {
    downPaymentAmount: clean(downPaymentAmount) ?? downPaymentAmount,
    loanAmount: clean(loanAmount) ?? loanAmount,
    loanPointsCost: clean(loanPointsCost) ?? loanPointsCost,
    totalCashInvested: clean(totalCashInvested) ?? totalCashInvested,

    grossRentAnnual: clean(grossRentAnnual) ?? grossRentAnnual,
    otherIncomeAnnual: clean(otherIncomeAnnual) ?? otherIncomeAnnual,
    vacancyLossAnnual: clean(vacancyLossAnnual) ?? vacancyLossAnnual,
    effectiveGrossIncomeAnnual: clean(effectiveGrossIncomeAnnual) ?? effectiveGrossIncomeAnnual,

    expenses,

    noiAnnual: clean(noiAnnual) ?? noiAnnual,
    noiMonthly: clean(noiMonthly) ?? noiMonthly,

    monthlyMortgagePayment: clean(monthlyMortgagePayment) ?? monthlyMortgagePayment,
    annualDebtService: clean(annualDebtService) ?? annualDebtService,

    annualCashFlow: clean(annualCashFlow) ?? annualCashFlow,
    monthlyCashFlow: clean(monthlyCashFlow) ?? monthlyCashFlow,

    cashOnCashPercent: clean(cashOnCashVal),
    capRatePercent: clean(capRateVal),
    dscr: clean(dscrVal),
    grossYieldPercent: clean(grossYieldVal),
    netYieldPercent: clean(netYieldVal),
    grm: clean(grmVal),
    rentToPricePercent: clean(rentToPricePercent) ?? rentToPricePercent,
    meetsOnePercentRule,
    breakEvenOccupancyPercent,

    proFormaYears,

    comparison: {
      financed: {
        cashInvested: clean(totalCashInvested) ?? totalCashInvested,
        monthlyCashFlow: clean(monthlyCashFlow) ?? monthlyCashFlow,
        annualCashFlow: clean(annualCashFlow) ?? annualCashFlow,
        cashOnCashPercent: clean(cashOnCashVal),
        capRatePercent: clean(capRateVal),
        dscr: clean(dscrVal),
        tenYearTotalReturn: clean(tenYearTotalReturnFinanced) ?? tenYearTotalReturnFinanced,
        tenYearIrrPercent: clean(tenYearIrrFinanced),
      },
      allCash: {
        cashInvested: clean(cashInvestedAllCash) ?? cashInvestedAllCash,
        monthlyCashFlow: clean(cashFlowAllCashMonthly) ?? cashFlowAllCashMonthly,
        annualCashFlow: clean(cashFlowAllCashAnnual) ?? cashFlowAllCashAnnual,
        cashOnCashPercent: clean(cocAllCash),
        capRatePercent: clean(capRateVal),
        dscr: null,
        tenYearTotalReturn: clean(tenYearTotalReturnAllCash) ?? tenYearTotalReturnAllCash,
        tenYearIrrPercent: clean(tenYearIrrAllCash),
      },
    },
  };
}
