/**
 * investment-return-engine.ts — Investment Return, S&P 500 Projection, T-Bill & Money Market Engine
 *
 * Core engine for:
 * 1. Investment Return Calculator (/investment-return-calculator/)
 *
 * Capabilities:
 * - Projection: Lump sum + periodic contributions with annual step-up, nominal vs real (inflation-adjusted),
 *   expense ratio fee drag, and tax drag.
 * - Money Market: Compounded monthly interest from APY with monthly deposit schedule.
 * - Treasury Bills (T-Bills): Standard TreasuryDirect price ↔ discount yield & investment yield (coupon equivalent).
 * - Compare: Stocks (assumed return) vs cash / money market over identical time horizons.
 *
 * Pure functions only. Zero DOM, zero network calls, zero side effects.
 */

export type ContributionFrequency = 'monthly' | 'yearly' | 'biweekly' | 'weekly';
export type ContributionTiming = 'end' | 'beginning';

export interface ProjectionInputs {
  startingAmount: number;
  contribution: number;
  contributionFrequency?: ContributionFrequency;
  contributionTiming?: ContributionTiming;
  stepUpPct?: number; // annual contribution increase %
  assumedReturnPct: number; // annual nominal return %
  feesPct?: number; // annual expense ratio / fee %
  taxDragPct?: number; // annual tax drag %
  inflationPct?: number; // annual inflation %
  years: number;
  withdrawalAmount?: number; // monthly withdrawal amount
}

export interface ProjectionYearlySchedule {
  year: number;
  startingBalance: number;
  contributions: number;
  interestEarned: number;
  feesPaid: number;
  endingBalance: number;
  realEndingBalance: number;
}

export interface ProjectionResult {
  finalBalance: number;
  totalContributed: number;
  totalGains: number;
  realFinalBalance: number;
  totalFeesPaid: number;
  annualizedCagr: number;
  schedule: ProjectionYearlySchedule[];
}

export interface MoneyMarketInputs {
  initialBalance: number;
  apyPct: number;
  monthlyDeposit?: number;
  months: number;
}

export interface MoneyMarketMonthlySchedule {
  month: number;
  startingBalance: number;
  deposit: number;
  interest: number;
  endingBalance: number;
}

export interface MoneyMarketResult {
  finalBalance: number;
  totalDeposited: number;
  totalInterest: number;
  effectiveAnnualRate: number;
  schedule: MoneyMarketMonthlySchedule[];
}

export interface TBillInputs {
  faceValue: number;
  pricePaid?: number;
  discountRatePct?: number;
  daysToMaturity: number;
}

export interface TBillResult {
  faceValue: number;
  pricePaid: number;
  totalInterest: number;
  discountRatePct: number; // Treasury discount rate (360-day year)
  investmentYieldPct: number; // Coupon equivalent yield (365-day year)
}

export interface CompareInputs {
  startingAmount: number;
  monthlyContribution: number;
  years: number;
  stockAssumedReturnPct: number;
  cashApyPct: number;
  inflationPct?: number;
}

export interface CompareScheduleEntry {
  year: number;
  totalContributed: number;
  stockBalance: number;
  cashBalance: number;
  difference: number;
}

export interface CompareResult {
  totalContributed: number;
  stockFinalBalance: number;
  stockTotalGains: number;
  stockRealBalance: number;
  cashFinalBalance: number;
  cashTotalGains: number;
  cashRealBalance: number;
  difference: number;
  differencePct: number;
  schedule: CompareScheduleEntry[];
}

function cleanRound(val: number, decimals: number = 2): number {
  if (!Number.isFinite(val)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

const FREQUENCY_MULTIPLIERS: Record<ContributionFrequency, number> = {
  monthly: 12,
  yearly: 1,
  biweekly: 26,
  weekly: 52,
};

/**
 * 1. Projection Mode
 * Monthly loop simulating growth, contributions, annual step-up, fee drag, and inflation discount.
 */
export function calculateProjection(inputs: ProjectionInputs): ProjectionResult {
  const {
    startingAmount = 0,
    contribution = 0,
    contributionFrequency = 'monthly',
    contributionTiming = 'end',
    stepUpPct = 0,
    assumedReturnPct = 7,
    feesPct = 0,
    taxDragPct = 0,
    inflationPct = 0,
    years = 20,
    withdrawalAmount = 0,
  } = inputs;

  const validYears = Math.max(0, years);
  const freqPerYear = FREQUENCY_MULTIPLIERS[contributionFrequency] ?? 12;

  // Monthly nominal rate: r / 12
  const grossMonthlyRate = (assumedReturnPct / 100) / 12;
  const monthlyFeeRate = (feesPct / 100) / 12;
  const monthlyTaxRate = (taxDragPct / 100) / 12;

  let currentBalance = Math.max(0, startingAmount);
  let balanceWithoutFees = Math.max(0, startingAmount);
  let totalContributed = Math.max(0, startingAmount);

  const schedule: ProjectionYearlySchedule[] = [];

  let currentMonthlyContrib = (contribution * freqPerYear) / 12;

  for (let yr = 1; yr <= validYears; yr++) {
    const yrStartBalance = currentBalance;
    let yrContributions = 0;
    let yrInterest = 0;
    let yrFees = 0;

    for (let m = 1; m <= 12; m++) {
      const contrib = currentMonthlyContrib;
      const withdraw = Math.max(0, withdrawalAmount);

      if (contributionTiming === 'beginning') {
        currentBalance += contrib;
        balanceWithoutFees += contrib;
        totalContributed += contrib;
        yrContributions += contrib;
      }

      // Interest & fee calculations
      const monthGrossInterest = currentBalance * grossMonthlyRate;
      const monthFee = currentBalance * monthlyFeeRate;
      const monthTax = currentBalance * monthlyTaxRate;
      const monthNetInterest = monthGrossInterest - monthFee - monthTax;

      // Tracking baseline without fees
      const monthInterestNoFees = balanceWithoutFees * (grossMonthlyRate - monthlyTaxRate);
      balanceWithoutFees += monthInterestNoFees;

      currentBalance += monthNetInterest;
      yrInterest += monthNetInterest;
      yrFees += monthFee;

      if (contributionTiming === 'end') {
        currentBalance += contrib;
        balanceWithoutFees += contrib;
        totalContributed += contrib;
        yrContributions += contrib;
      }

      // Withdrawals
      if (withdraw > 0) {
        currentBalance = Math.max(0, currentBalance - withdraw);
        balanceWithoutFees = Math.max(0, balanceWithoutFees - withdraw);
      }
    }

    // Real value adjusted for inflation
    const inflationFactor = Math.pow(1 + inflationPct / 100, yr);
    const realBalance = inflationFactor > 0 ? currentBalance / inflationFactor : currentBalance;

    schedule.push({
      year: yr,
      startingBalance: cleanRound(yrStartBalance, 2),
      contributions: cleanRound(yrContributions, 2),
      interestEarned: cleanRound(yrInterest, 2),
      feesPaid: cleanRound(yrFees, 2),
      endingBalance: cleanRound(currentBalance, 2),
      realEndingBalance: cleanRound(realBalance, 2),
    });

    // Annual contribution step-up
    if (stepUpPct > 0) {
      currentMonthlyContrib *= (1 + stepUpPct / 100);
    }
  }

  const finalBalance = cleanRound(currentBalance, 2);
  const roundedContributed = cleanRound(totalContributed, 2);
  const totalGains = cleanRound(Math.max(0, finalBalance - roundedContributed), 2);

  const totalInflationFactor = Math.pow(1 + inflationPct / 100, validYears);
  const realFinalBalance = totalInflationFactor > 0 ? cleanRound(finalBalance / totalInflationFactor, 2) : finalBalance;
  const totalFeesPaid = cleanRound(Math.max(0, balanceWithoutFees - currentBalance), 2);

  // Annualized CAGR (nominal)
  let annualizedCagr = 0;
  if (startingAmount > 0 && validYears > 0 && totalContributed === startingAmount) {
    annualizedCagr = cleanRound((Math.pow(finalBalance / startingAmount, 1 / validYears) - 1) * 100, 2);
  } else if (validYears > 0 && totalContributed > 0) {
    // Standard approximation if regular contributions exist
    annualizedCagr = cleanRound(assumedReturnPct - feesPct - taxDragPct, 2);
  }

  return {
    finalBalance,
    totalContributed: roundedContributed,
    totalGains,
    realFinalBalance,
    totalFeesPaid,
    annualizedCagr,
    schedule,
  };
}

/**
 * 2. Money Market Mode
 * Compounded monthly interest from stated APY with monthly contributions.
 */
export function calculateMoneyMarket(inputs: MoneyMarketInputs): MoneyMarketResult {
  const {
    initialBalance = 0,
    apyPct = 4.5,
    monthlyDeposit = 0,
    months = 12,
  } = inputs;

  const validMonths = Math.max(0, Math.round(months));
  // Monthly rate derived from APY: (1 + APY)^(1/12) - 1
  const monthlyRate = Math.pow(1 + apyPct / 100, 1 / 12) - 1;

  let currentBalance = Math.max(0, initialBalance);
  let totalDeposited = Math.max(0, initialBalance);
  let totalInterest = 0;
  const schedule: MoneyMarketMonthlySchedule[] = [];

  for (let m = 1; m <= validMonths; m++) {
    const startBal = currentBalance;
    const interest = startBal * monthlyRate;
    const dep = Math.max(0, monthlyDeposit);

    currentBalance = startBal + interest + dep;
    totalDeposited += dep;
    totalInterest += interest;

    schedule.push({
      month: m,
      startingBalance: cleanRound(startBal, 2),
      deposit: cleanRound(dep, 2),
      interest: cleanRound(interest, 2),
      endingBalance: cleanRound(currentBalance, 2),
    });
  }

  return {
    finalBalance: cleanRound(currentBalance, 2),
    totalDeposited: cleanRound(totalDeposited, 2),
    totalInterest: cleanRound(totalInterest, 2),
    effectiveAnnualRate: cleanRound(apyPct, 2),
    schedule,
  };
}

/**
 * 3. Treasury Bill (T-Bill) Mode
 * Calculates price, discount rate (360-day), and investment yield (365-day coupon equivalent).
 * TreasuryDirect standard formulas.
 */
export function calculateTBill(inputs: TBillInputs): TBillResult {
  const {
    faceValue = 10000,
    daysToMaturity = 182,
  } = inputs;

  const validDays = Math.max(1, daysToMaturity);
  const face = Math.max(0, faceValue);

  let price = 0;
  let discountRate = 0;

  if (inputs.pricePaid !== undefined && inputs.pricePaid > 0) {
    price = inputs.pricePaid;
    // Discount Rate: ((Face - Price) / Face) * (360 / Days) * 100
    discountRate = face > 0 ? ((face - price) / face) * (360 / validDays) * 100 : 0;
  } else {
    discountRate = inputs.discountRatePct ?? 5.0;
    // Price = Face * (1 - (DiscountRate / 100) * (Days / 360))
    price = face * (1 - (discountRate / 100) * (validDays / 360));
  }

  const cleanPrice = cleanRound(price, 2);
  const totalInterest = cleanRound(face - cleanPrice, 2);
  const cleanDiscountRate = cleanRound(discountRate, 3);

  // Investment Yield (Coupon Equivalent Rate): ((Face - Price) / Price) * (365 / Days) * 100
  const investmentYield = cleanPrice > 0 ? ((face - cleanPrice) / cleanPrice) * (365 / validDays) * 100 : 0;
  const cleanInvestmentYield = cleanRound(investmentYield, 3);

  return {
    faceValue: cleanRound(face, 2),
    pricePaid: cleanPrice,
    totalInterest,
    discountRatePct: cleanDiscountRate,
    investmentYieldPct: cleanInvestmentYield,
  };
}

/**
 * 4. Compare Mode
 * Stock-like assumed return vs Cash-like APY over identical horizons and deposits.
 */
export function calculateCompare(inputs: CompareInputs): CompareResult {
  const {
    startingAmount = 10000,
    monthlyContribution = 300,
    years = 20,
    stockAssumedReturnPct = 7,
    cashApyPct = 4.5,
    inflationPct = 2.5,
  } = inputs;

  const stockRes = calculateProjection({
    startingAmount,
    contribution: monthlyContribution,
    contributionFrequency: 'monthly',
    contributionTiming: 'end',
    assumedReturnPct: stockAssumedReturnPct,
    inflationPct,
    years,
  });

  // Cash APY compounded monthly
  const totalMonths = Math.round(years * 12);
  const cashRes = calculateMoneyMarket({
    initialBalance: startingAmount,
    apyPct: cashApyPct,
    monthlyDeposit: monthlyContribution,
    months: totalMonths,
  });

  const inflationFactor = Math.pow(1 + inflationPct / 100, years);
  const cashRealBalance = inflationFactor > 0 ? cleanRound(cashRes.finalBalance / inflationFactor, 2) : cashRes.finalBalance;

  const difference = cleanRound(stockRes.finalBalance - cashRes.finalBalance, 2);
  const diffPct = cashRes.finalBalance > 0 ? cleanRound((difference / cashRes.finalBalance) * 100, 2) : 0;

  const schedule: CompareScheduleEntry[] = [];
  for (let yr = 1; yr <= years; yr++) {
    const stockYr = stockRes.schedule[yr - 1];
    const cashMonths = yr * 12;
    const cashInterim = calculateMoneyMarket({
      initialBalance: startingAmount,
      apyPct: cashApyPct,
      monthlyDeposit: monthlyContribution,
      months: cashMonths,
    });

    schedule.push({
      year: yr,
      totalContributed: stockYr.startingBalance + stockYr.contributions,
      stockBalance: stockYr.endingBalance,
      cashBalance: cashInterim.finalBalance,
      difference: cleanRound(stockYr.endingBalance - cashInterim.finalBalance, 2),
    });
  }

  return {
    totalContributed: stockRes.totalContributed,
    stockFinalBalance: stockRes.finalBalance,
    stockTotalGains: stockRes.totalGains,
    stockRealBalance: stockRes.realFinalBalance,
    cashFinalBalance: cashRes.finalBalance,
    cashTotalGains: cashRes.totalInterest,
    cashRealBalance,
    difference,
    differencePct: diffPct,
    schedule,
  };
}
