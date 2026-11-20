/**
 * Equipment & Business Loan Engine
 * Pure mathematical calculations for commercial equipment financing, machinery leases,
 * business lines of credit, and merchant cash advances (MCA).
 *
 * Implements:
 * 1. Equipment Loan Financing:
 *    - Amount financed = Price * (1 + Sales Tax %) + Fees - Down Payment - Trade-in
 *    - Standard amortizing payment with optional balloon payoff at maturity
 *    - Multi-frequency support: Monthly (12/yr), Quarterly (4/yr), Semi-Annual (2/yr), Annual (1/yr, farm equipment)
 *    - Multi-term comparison table (24, 36, 48, 60, 72, 84 months)
 *    - Effective APR with lender/origination fees
 * 2. Lease vs Loan vs Cash Comparison:
 *    - Full lifecycle cost: upfront, periodic payments, buyout ($1 buyout / FMV % / none), resale equity
 *    - Cheapest option identification
 * 3. Equipment ROI & Payback:
 *    - Monthly revenue/savings − operating cost − loan payment = net monthly cash flow
 *    - Payback duration in months
 * 4. Line of Credit (LOC):
 *    - Interest-only draw period payment vs amortizing repayment period
 * 5. Merchant Cash Advance (MCA):
 *    - Advance * factor rate = total payback
 *    - Daily / weekly remittance payment
 *    - True nominal & compounding APR from factor rate
 * 6. Debt Service Coverage Ratio (DSCR) Affordability
 *
 * Rules:
 * - 100% pure TypeScript. Zero I/O, zero network, zero side effects.
 * - Enforces clean floating-point numbers without precision artifacts.
 */

import {
  payment as baseAmortPayment,
  aprWithFees,
  factorRateToApr,
  schedule,
  type LoanScheduleResult,
} from './loan-engine';

export type PaymentFrequency = 'monthly' | 'quarterly' | 'semi-annual' | 'annual';

export interface EquipmentLoanInput {
  equipmentPrice: number;
  salesTaxPercent?: number; // e.g. 6 for 6%
  lenderFees?: number; // e.g. $500
  downPayment?: number; // e.g. $10,000
  tradeInValue?: number; // e.g. $0
  annualInterestRate: number; // e.g. 8.5 for 8.5%
  termMonths: number; // e.g. 60
  balloonPayment?: number; // optional lump-sum at maturity ($ or derived from %)
  balloonPercent?: number; // optional % of purchase price or financed amount
  frequency?: PaymentFrequency; // defaults to 'monthly'
}

export interface EquipmentLoanResult {
  purchasePrice: number;
  salesTaxAmount: number;
  grossCost: number;
  amountFinanced: number;
  monthlyPayment: number;
  periodicPayment: number;
  frequency: PaymentFrequency;
  paymentsPerYear: number;
  totalPaymentsCount: number;
  balloonAmount: number;
  totalInterest: number;
  totalCostOfLoan: number;
  effectiveApr: number | null;
  termOptions: Array<{
    months: number;
    payment: number;
    totalInterest: number;
  }>;
  scheduleResult: LoanScheduleResult;
}

export interface LeaseVsLoanVsCashInput {
  equipmentPrice: number;
  salesTaxPercent: number;
  cashDiscountOrFee?: number;
  resaleValueAtEnd?: number; // Estimated value of equipment when term finishes

  // Loan terms
  loanDownPayment: number;
  loanInterestRate: number;
  loanTermMonths: number;
  loanFees?: number;
  loanBalloon?: number;

  // Lease terms
  leaseMonthlyPayment: number;
  leaseTermMonths: number;
  leaseUpfrontCosts: number; // first/last month + security deposit + doc fee
  leaseFees?: number;
  leaseBuyoutType: '$1' | 'fmv' | 'none';
  leaseBuyoutAmount?: number; // e.g. $1 or FMV estimate
}

export interface LeaseVsLoanVsCashResult {
  loan: {
    upfrontCost: number;
    monthlyPayment: number;
    totalPayments: number;
    totalGrossCost: number;
    resaleEquity: number;
    netCostAfterResale: number;
    ownsEquipmentAtEnd: boolean;
  };
  lease: {
    upfrontCost: number;
    monthlyPayment: number;
    totalPayments: number;
    buyoutCost: number;
    totalGrossCost: number;
    resaleEquity: number;
    netCostAfterResale: number;
    ownsEquipmentAtEnd: boolean;
  };
  cash: {
    upfrontCost: number;
    monthlyPayment: number;
    totalPayments: number;
    totalGrossCost: number;
    resaleEquity: number;
    netCostAfterResale: number;
    ownsEquipmentAtEnd: boolean;
  };
  cheapestOption: 'loan' | 'lease' | 'cash';
  savingsVsHighest: number;
}

export interface EquipmentRoiInput {
  equipmentPrice: number;
  downPayment: number;
  lenderFees?: number;
  monthlyLoanPayment: number;
  monthlyRevenueOrSavings: number; // e.g. billable tractor hours, saved subcontractor costs
  monthlyOperatingCost: number; // fuel, insurance, maintenance, operator
}

export interface EquipmentRoiResult {
  upfrontInvestment: number;
  grossMonthlyBenefit: number;
  netOperatingCashFlow: number; // revenue/savings - operating cost
  netMonthlyCashFlowAfterLoan: number; // netOperatingCashFlow - loan payment
  paybackMonths: number | null; // upfrontInvestment / netMonthlyCashFlowAfterLoan (null if <= 0)
  annualRoiPercent: number | null; // (netCashFlowAfterLoan * 12) / upfrontInvestment
}

export interface McaInput {
  advanceAmount: number;
  factorRate: number; // e.g. 1.25 to 1.45
  repaymentDays: number; // e.g. 90 to 250 days
  remittanceFrequency: 'daily' | 'weekly';
}

export interface McaResult {
  advanceAmount: number;
  factorRate: number;
  totalPayback: number;
  totalFinanceCost: number;
  paymentCount: number;
  paymentPerRemittance: number;
  nominalApr: number; // Annualized nominal rate
  effectiveApr: number | null; // Compounding APR via IRR bisection
}

export interface LineOfCreditInput {
  creditLimit: number;
  amountDrawn: number;
  annualInterestRate: number;
  repaymentMonths: number;
}

export interface LineOfCreditResult {
  creditLimit: number;
  amountDrawn: number;
  availableCredit: number;
  drawPeriodMonthlyInterest: number;
  repaymentPeriodMonthlyPayment: number;
  totalRepaymentInterest: number;
}

function round2(v: number): number {
  if (Object.is(v, -0) || Math.abs(v) < 1e-12) return 0;
  return Math.round(v * 100) / 100;
}

/**
 * Calculates periodic payment for a loan with an optional lump-sum balloon payment at maturity.
 * Formula: PMT = [ P - B * (1 + r)^(-n) ] * [ r / (1 - (1 + r)^(-n)) ]
 */
export function calculatePaymentWithBalloon(
  principal: number,
  periodicRate: number,
  periods: number,
  balloon = 0
): number {
  if (principal <= 0 || periods <= 0) return 0;
  const b = Math.max(0, balloon);

  if (periodicRate <= 0) {
    return round2(Math.max(0, (principal - b) / periods));
  }

  const discountFactor = Math.pow(1 + periodicRate, -periods);
  const pvBalloon = b * discountFactor;
  const amortizingPrincipal = principal - pvBalloon;

  if (amortizingPrincipal <= 0) {
    // Balloon covers or exceeds present value of principal; interest-only on principal
    return round2(principal * periodicRate);
  }

  const pmt = amortizingPrincipal * (periodicRate / (1 - discountFactor));
  return round2(pmt);
}

/**
 * Primary Equipment Loan Calculator
 */
export function calculateEquipmentLoan(input: EquipmentLoanInput): EquipmentLoanResult {
  const price = Math.max(0, input.equipmentPrice || 0);
  const taxPct = Math.max(0, input.salesTaxPercent || 0);
  const fees = Math.max(0, input.lenderFees || 0);
  const down = Math.max(0, input.downPayment || 0);
  const tradeIn = Math.max(0, input.tradeInValue || 0);
  const ratePct = Math.max(0, input.annualInterestRate || 0);
  const termMonths = Math.max(1, Math.round(input.termMonths || 60));
  const frequency: PaymentFrequency = input.frequency || 'monthly';

  const taxAmount = round2(price * (taxPct / 100));
  const grossCost = round2(price + taxAmount + fees);
  const amountFinanced = round2(Math.max(0, grossCost - down - tradeIn));

  // Determine balloon
  let balloon = Math.max(0, input.balloonPayment || 0);
  if (balloon === 0 && input.balloonPercent && input.balloonPercent > 0) {
    balloon = round2(price * (input.balloonPercent / 100));
  }

  const freqMap: Record<PaymentFrequency, number> = {
    monthly: 12,
    quarterly: 4,
    'semi-annual': 2,
    annual: 1,
  };
  const paymentsPerYear = freqMap[frequency];
  const periodicRate = (ratePct / 100) / paymentsPerYear;
  const totalPeriods = Math.max(1, Math.round((termMonths / 12) * paymentsPerYear));

  const periodicPayment = calculatePaymentWithBalloon(amountFinanced, periodicRate, totalPeriods, balloon);

  // Normalized monthly payment equivalent for comparisons
  const monthlyRate = (ratePct / 100) / 12;
  const monthlyPayment = calculatePaymentWithBalloon(amountFinanced, monthlyRate, termMonths, balloon);

  const totalPayments = round2(periodicPayment * totalPeriods);
  const totalCostOfLoan = round2(totalPayments + balloon);
  const totalInterest = round2(Math.max(0, totalCostOfLoan - amountFinanced));

  // Term options table [24, 36, 48, 60, 72, 84]
  const standardTerms = [24, 36, 48, 60, 72, 84];
  const termOptions = standardTerms.map((m) => {
    const pmt = calculatePaymentWithBalloon(amountFinanced, (ratePct / 100) / 12, m, 0);
    const totPmt = pmt * m;
    return {
      months: m,
      payment: pmt,
      totalInterest: round2(Math.max(0, totPmt - amountFinanced)),
    };
  });

  // Effective APR with lender fees
  const effApr = aprWithFees(amountFinanced, fees, ratePct, termMonths);

  // Amortization schedule
  const scheduleResult = schedule({
    principal: amountFinanced,
    apr: ratePct,
    amortizationMonths: termMonths,
    termMonths,
  });

  return {
    purchasePrice: price,
    salesTaxAmount: taxAmount,
    grossCost,
    amountFinanced,
    monthlyPayment,
    periodicPayment,
    frequency,
    paymentsPerYear,
    totalPaymentsCount: totalPeriods,
    balloonAmount: balloon,
    totalInterest,
    totalCostOfLoan,
    effectiveApr: effApr,
    termOptions,
    scheduleResult,
  };
}

/**
 * Side-by-side Lease vs Loan vs Cash comparison
 */
export function calculateLeaseVsLoanVsCash(input: LeaseVsLoanVsCashInput): LeaseVsLoanVsCashResult {
  const price = Math.max(0, input.equipmentPrice || 0);
  const taxPct = Math.max(0, input.salesTaxPercent || 0);
  const taxAmount = round2(price * (taxPct / 100));
  const resale = Math.max(0, input.resaleValueAtEnd || 0);

  // 1. Cash Purchase
  const cashUpfront = round2(price + taxAmount + (input.cashDiscountOrFee || 0));
  const cashGross = cashUpfront;
  const cashNetAfterResale = round2(cashGross - resale);

  // 2. Equipment Loan
  const loanDown = Math.max(0, input.loanDownPayment || 0);
  const loanFees = Math.max(0, input.loanFees || 0);
  const loanBalloon = Math.max(0, input.loanBalloon || 0);
  const loanPrincipal = round2(Math.max(0, price + taxAmount + loanFees - loanDown));
  const loanMonthlyRate = (Math.max(0, input.loanInterestRate) / 100) / 12;
  const loanTerm = Math.max(1, Math.round(input.loanTermMonths || 60));
  const loanMonthlyPmt = calculatePaymentWithBalloon(loanPrincipal, loanMonthlyRate, loanTerm, loanBalloon);
  const loanTotalPayments = round2(loanMonthlyPmt * loanTerm);
  const loanGross = round2(loanDown + loanTotalPayments + loanBalloon);
  const loanNetAfterResale = round2(loanGross - resale);

  // 3. Equipment Lease
  const leasePmt = Math.max(0, input.leaseMonthlyPayment || 0);
  const leaseTerm = Math.max(1, Math.round(input.leaseTermMonths || 60));
  const leaseUpfront = Math.max(0, input.leaseUpfrontCosts || 0);
  const leaseFees = Math.max(0, input.leaseFees || 0);
  let buyoutCost = 0;
  let leaseOwnsAtEnd = false;

  if (input.leaseBuyoutType === '$1') {
    buyoutCost = 1;
    leaseOwnsAtEnd = true;
  } else if (input.leaseBuyoutType === 'fmv') {
    buyoutCost = input.leaseBuyoutAmount && input.leaseBuyoutAmount > 0
      ? input.leaseBuyoutAmount
      : round2(price * 0.10); // Standard 10% FMV assumption if not specified
    leaseOwnsAtEnd = true;
  } else {
    buyoutCost = 0;
    leaseOwnsAtEnd = false; // Returned to lessor
  }

  const leaseTotalPeriodic = round2(leasePmt * leaseTerm);
  const leaseGross = round2(leaseUpfront + leaseTotalPeriodic + leaseFees + buyoutCost);
  const leaseNetAfterResale = round2(leaseGross - (leaseOwnsAtEnd ? resale : 0));

  // Determine cheapest option based on net cost after resale
  let cheapestOption: 'loan' | 'lease' | 'cash' = 'cash';
  let minCost = cashNetAfterResale;
  const maxCost = Math.max(cashNetAfterResale, loanNetAfterResale, leaseNetAfterResale);

  if (loanNetAfterResale < minCost) {
    minCost = loanNetAfterResale;
    cheapestOption = 'loan';
  }
  if (leaseNetAfterResale < minCost) {
    minCost = leaseNetAfterResale;
    cheapestOption = 'lease';
  }

  const savingsVsHighest = round2(Math.max(0, maxCost - minCost));

  return {
    loan: {
      upfrontCost: loanDown,
      monthlyPayment: loanMonthlyPmt,
      totalPayments: loanTotalPayments,
      totalGrossCost: loanGross,
      resaleEquity: resale,
      netCostAfterResale: loanNetAfterResale,
      ownsEquipmentAtEnd: true,
    },
    lease: {
      upfrontCost: leaseUpfront,
      monthlyPayment: leasePmt,
      totalPayments: leaseTotalPeriodic,
      buyoutCost,
      totalGrossCost: leaseGross,
      resaleEquity: leaseOwnsAtEnd ? resale : 0,
      netCostAfterResale: leaseNetAfterResale,
      ownsEquipmentAtEnd: leaseOwnsAtEnd,
    },
    cash: {
      upfrontCost: cashUpfront,
      monthlyPayment: 0,
      totalPayments: 0,
      totalGrossCost: cashGross,
      resaleEquity: resale,
      netCostAfterResale: cashNetAfterResale,
      ownsEquipmentAtEnd: true,
    },
    cheapestOption,
    savingsVsHighest,
  };
}

/**
 * Payback and Return on Investment (ROI) for equipment acquisition
 */
export function calculateEquipmentRoi(input: EquipmentRoiInput): EquipmentRoiResult {
  const down = Math.max(0, input.downPayment || 0);
  const fees = Math.max(0, input.lenderFees || 0);
  const upfrontInvestment = round2(down + fees);

  const grossMonthlyBenefit = Math.max(0, input.monthlyRevenueOrSavings || 0);
  const monthlyOpCost = Math.max(0, input.monthlyOperatingCost || 0);
  const loanPmt = Math.max(0, input.monthlyLoanPayment || 0);

  const netOperatingCashFlow = round2(grossMonthlyBenefit - monthlyOpCost);
  const netMonthlyCashFlowAfterLoan = round2(netOperatingCashFlow - loanPmt);

  let paybackMonths: number | null = null;
  let annualRoiPercent: number | null = null;

  if (netMonthlyCashFlowAfterLoan > 0 && upfrontInvestment > 0) {
    paybackMonths = round2(upfrontInvestment / netMonthlyCashFlowAfterLoan);
    annualRoiPercent = round2(((netMonthlyCashFlowAfterLoan * 12) / upfrontInvestment) * 100);
  }

  return {
    upfrontInvestment,
    grossMonthlyBenefit,
    netOperatingCashFlow,
    netMonthlyCashFlowAfterLoan,
    paybackMonths,
    annualRoiPercent,
  };
}

/**
 * Merchant Cash Advance (MCA) Factor Rate to APR converter
 */
export function calculateMca(input: McaInput): McaResult {
  const advance = Math.max(0, input.advanceAmount || 0);
  const factor = Math.max(1.0, input.factorRate || 1.0);
  const days = Math.max(1, Math.round(input.repaymentDays || 180));
  const freq = input.remittanceFrequency || 'daily';

  const totalPayback = round2(advance * factor);
  const totalFinanceCost = round2(totalPayback - advance);

  const paymentCount = freq === 'daily' ? days : Math.max(1, Math.round(days / 7));
  const paymentPerRemittance = round2(totalPayback / paymentCount);

  // Effective compounding APR via bisection IRR solver
  const remitInterval = freq === 'daily' ? 1 : 7;
  const effectiveApr = factorRateToApr(advance, factor, days, remitInterval);

  // Nominal APR = periodic IRR × periods per year (the IRR accounts for the balance being repaid
  // every remittance, so it is NOT simply fee ÷ years). Derived from the effective rate.
  const periodsPerYear = 365 / remitInterval;
  const nominalApr =
    effectiveApr === null
      ? round2(((factor - 1) / (days / 365)) * 100)
      : round2((Math.pow(1 + effectiveApr / 100, 1 / periodsPerYear) - 1) * periodsPerYear * 100);

  return {
    advanceAmount: advance,
    factorRate: factor,
    totalPayback,
    totalFinanceCost,
    paymentCount,
    paymentPerRemittance,
    nominalApr,
    effectiveApr,
  };
}

/**
 * Business Line of Credit (LOC) Calculator
 */
export function calculateLineOfCredit(input: LineOfCreditInput): LineOfCreditResult {
  const limit = Math.max(0, input.creditLimit || 0);
  const drawn = Math.min(limit, Math.max(0, input.amountDrawn || 0));
  const availableCredit = round2(Math.max(0, limit - drawn));
  const ratePct = Math.max(0, input.annualInterestRate || 0);
  const repayMonths = Math.max(1, Math.round(input.repaymentMonths || 36));

  const monthlyRate = (ratePct / 100) / 12;
  const drawPeriodMonthlyInterest = round2(drawn * monthlyRate);
  const repaymentPeriodMonthlyPayment = baseAmortPayment(drawn, ratePct, repayMonths) || 0;
  const totalRepaymentPayments = round2(repaymentPeriodMonthlyPayment * repayMonths);
  const totalRepaymentInterest = round2(Math.max(0, totalRepaymentPayments - drawn));

  return {
    creditLimit: limit,
    amountDrawn: drawn,
    availableCredit,
    drawPeriodMonthlyInterest,
    repaymentPeriodMonthlyPayment: round2(repaymentPeriodMonthlyPayment),
    totalRepaymentInterest,
  };
}
