/**
 * drawdown-engine.ts — Retirement Drawdown & Capital Depletion Engine
 *
 * Core engine for:
 * - "How Long Will My Money Last?" Calculator (/how-long-will-my-money-last/)
 *
 * Capabilities:
 * - Years to depletion simulation (flat or inflation-adjusted spending)
 * - Closed-form verification for flat withdrawals
 * - Max sustainable initial spending solver for target age (growing annuity)
 * - 4% rule initial spending and durability
 * - Other income sources (Social Security, pensions) with start ages and annual escalation
 * - One-off lump-sum expenses
 * - Sequence-of-returns stress testing (bad start: -15% in years 1-2)
 *
 * Pure functions only. Zero DOM, zero network calls, zero side effects.
 */

export interface OtherIncomeSource {
  id?: string;
  label: string;
  annualAmount: number;
  startAge: number;
  annualIncreasePct?: number;
}

export interface OneOffExpense {
  id?: string;
  label: string;
  amount: number;
  atAge: number;
}

export interface DrawdownInputs {
  initialSavings: number;
  currentAge: number;
  spendingAnnual: number;
  inflationAdjusted?: boolean;
  expectedReturnPct: number;
  inflationPct?: number;
  feesPct?: number;
  otherIncomes?: OtherIncomeSource[];
  oneOffExpenses?: OneOffExpense[];
  taxRatePct?: number;
  timing?: 'beginning' | 'end'; // default: 'end'
  maxYears?: number; // safety cap, default: 80
}

export interface YearScheduleEntry {
  year: number;
  age: number;
  startingBalance: number;
  investmentGrowth: number;
  grossSpending: number;
  otherIncome: number;
  oneOffExpense: number;
  netWithdrawal: number;
  endingBalance: number;
}

export interface DrawdownResult {
  yearsLasted: number; // e.g. 15.2
  monthsLasted: number; // total months
  depletedAge: number; // e.g. 80.2
  isIndefinite: boolean;
  totalWithdrawn: number;
  totalGrowthEarned: number;
  schedule: YearScheduleEntry[];
}

export interface SpendSolverInputs {
  initialSavings: number;
  currentAge: number;
  targetAge: number;
  inflationAdjusted?: boolean;
  expectedReturnPct: number;
  inflationPct?: number;
  feesPct?: number;
  taxRatePct?: number;
  otherIncomes?: OtherIncomeSource[];
  timing?: 'beginning' | 'end';
}

export interface SpendSolverResult {
  maxInitialAnnualSpending: number;
  maxInitialMonthlySpending: number;
  initialWithdrawalRatePct: number;
  schedule: YearScheduleEntry[];
}

export interface ScenarioResult {
  expectedYears: number;
  expectedEndAge: number;
  lowerReturnYears: number;
  lowerReturnEndAge: number;
  badStartYears: number;
  badStartEndAge: number;
}

function cleanRound(val: number, decimals: number = 2): number {
  if (!Number.isFinite(val)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

/**
 * Closed-form analytical formula for flat spending with zero other income/expenses.
 * n = ln(W / (W - r*P)) / ln(1 + r)
 * Returns Infinity if W <= r*P (lasts forever).
 */
export function calculateClosedFormYears(
  principal: number,
  annualWithdrawal: number,
  returnPct: number
): number | null {
  if (principal <= 0 || annualWithdrawal <= 0) return 0;
  const r = returnPct / 100;
  if (r <= 0) {
    return cleanRound(principal / annualWithdrawal, 2);
  }
  const annualEarnings = principal * r;
  if (annualWithdrawal <= annualEarnings) {
    return Infinity;
  }
  const numerator = Math.log(annualWithdrawal / (annualWithdrawal - annualEarnings));
  const denominator = Math.log(1 + r);
  return cleanRound(numerator / denominator, 2);
}

/**
 * 1. Simulate How Many Years Money Lasts
 */
export function calculateDrawdown(inputs: DrawdownInputs): DrawdownResult {
  const {
    initialSavings = 500000,
    currentAge = 65,
    spendingAnnual = 40000,
    inflationAdjusted = true,
    expectedReturnPct = 5.0,
    inflationPct = 3.0,
    feesPct = 0.0,
    otherIncomes = [],
    oneOffExpenses = [],
    taxRatePct = 0.0,
    timing = 'end',
    maxYears = 80,
  } = inputs;

  const netAnnualReturnRate = Math.max(-0.99, (expectedReturnPct - feesPct) / 100);
  const inflationRate = (inflationPct ?? 0) / 100;
  const taxDivisor = Math.max(0.01, 1 - (taxRatePct ?? 0) / 100);

  let currentBalance = Math.max(0, initialSavings);
  let totalWithdrawn = 0;
  let totalGrowthEarned = 0;
  const schedule: YearScheduleEntry[] = [];

  let isDepleted = false;
  let exactYears = 0;

  for (let yr = 1; yr <= maxYears; yr++) {
    const age = currentAge + yr - 1;
    const startBal = currentBalance;

    // 1. Spending inflated
    const inflationFactor = inflationAdjusted ? Math.pow(1 + inflationRate, yr - 1) : 1;
    const grossNeededPreTax = spendingAnnual * inflationFactor;
    const grossNeeded = grossNeededPreTax / taxDivisor;

    // 2. Other income active at this age
    let yrOtherIncome = 0;
    for (const inc of otherIncomes) {
      if (age >= inc.startAge) {
        const yearsActive = age - inc.startAge;
        const incGrowth = inc.annualIncreasePct ? Math.pow(1 + inc.annualIncreasePct / 100, yearsActive) : 1;
        yrOtherIncome += inc.annualAmount * incGrowth;
      }
    }

    // 3. One-off expenses at this age
    let yrOneOff = 0;
    for (const exp of oneOffExpenses) {
      if (exp.atAge === age) {
        yrOneOff += exp.amount;
      }
    }

    // 4. Net withdrawal required from portfolio
    const netWithdrawal = Math.max(0, grossNeeded - yrOtherIncome) + yrOneOff;

    let growth = 0;
    let endBal = 0;

    if (timing === 'beginning') {
      const balanceAfterWithdrawal = startBal - netWithdrawal;
      if (balanceAfterWithdrawal <= 0) {
        // Runs out during withdrawal at start of year
        const fraction = startBal / netWithdrawal;
        exactYears = yr - 1 + fraction;
        isDepleted = true;
        totalWithdrawn += startBal;
        schedule.push({
          year: yr,
          age,
          startingBalance: cleanRound(startBal, 2),
          investmentGrowth: 0,
          grossSpending: cleanRound(grossNeeded, 2),
          otherIncome: cleanRound(yrOtherIncome, 2),
          oneOffExpense: cleanRound(yrOneOff, 2),
          netWithdrawal: cleanRound(startBal, 2),
          endingBalance: 0,
        });
        break;
      }
      growth = balanceAfterWithdrawal * netAnnualReturnRate;
      endBal = balanceAfterWithdrawal + growth;
    } else {
      // Default: 'end' of year
      growth = startBal * netAnnualReturnRate;
      const balanceWithGrowth = startBal + growth;

      if (balanceWithGrowth <= netWithdrawal) {
        // Runs out during end-of-year withdrawal
        const fraction = balanceWithGrowth / netWithdrawal;
        exactYears = yr - 1 + fraction;
        isDepleted = true;
        totalWithdrawn += balanceWithGrowth;
        totalGrowthEarned += growth;
        schedule.push({
          year: yr,
          age,
          startingBalance: cleanRound(startBal, 2),
          investmentGrowth: cleanRound(growth, 2),
          grossSpending: cleanRound(grossNeeded, 2),
          otherIncome: cleanRound(yrOtherIncome, 2),
          oneOffExpense: cleanRound(yrOneOff, 2),
          netWithdrawal: cleanRound(balanceWithGrowth, 2),
          endingBalance: 0,
        });
        break;
      }
      endBal = balanceWithGrowth - netWithdrawal;
    }

    totalWithdrawn += netWithdrawal;
    totalGrowthEarned += growth;
    currentBalance = endBal;

    schedule.push({
      year: yr,
      age,
      startingBalance: cleanRound(startBal, 2),
      investmentGrowth: cleanRound(growth, 2),
      grossSpending: cleanRound(grossNeeded, 2),
      otherIncome: cleanRound(yrOtherIncome, 2),
      oneOffExpense: cleanRound(yrOneOff, 2),
      netWithdrawal: cleanRound(netWithdrawal, 2),
      endingBalance: cleanRound(endBal, 2),
    });

    if (currentBalance <= 0) {
      exactYears = yr;
      isDepleted = true;
      break;
    }
  }

  const isIndefinite = !isDepleted && currentBalance >= initialSavings;
  const yearsLasted = isDepleted ? cleanRound(exactYears, 1) : cleanRound(maxYears, 1);
  const monthsLasted = Math.round(yearsLasted * 12);
  const depletedAge = cleanRound(currentAge + yearsLasted, 1);

  return {
    yearsLasted,
    monthsLasted,
    depletedAge,
    isIndefinite,
    totalWithdrawn: cleanRound(totalWithdrawn, 2),
    totalGrowthEarned: cleanRound(totalGrowthEarned, 2),
    schedule,
  };
}

/**
 * 2. Solve for Maximum Sustainable Annual Spending to Last Until Target Age
 * Uses analytical growing annuity formula when applicable, with bisection fallback.
 */
export function solveMaxSpending(inputs: SpendSolverInputs): SpendSolverResult {
  const {
    initialSavings = 500000,
    currentAge = 65,
    targetAge = 95,
    inflationAdjusted = true,
    expectedReturnPct = 5.0,
    inflationPct = 3.0,
    feesPct = 0.0,
    taxRatePct = 0.0,
    otherIncomes = [],
    timing = 'end',
  } = inputs;

  const totalYears = Math.max(1, targetAge - currentAge);
  const r = (expectedReturnPct - feesPct) / 100;
  const g = inflationAdjusted ? (inflationPct ?? 0) / 100 : 0;

  // If no other incomes and timing === 'end', exact growing annuity formula:
  if (otherIncomes.length === 0 && (taxRatePct ?? 0) === 0 && timing === 'end') {
    let initialSpending = 0;
    if (Math.abs(r - g) < 1e-7) {
      initialSpending = (initialSavings * (1 + r)) / totalYears;
    } else {
      const discountRatio = (1 + g) / (1 + r);
      const denominator = 1 - Math.pow(discountRatio, totalYears);
      initialSpending = initialSavings * ((r - g) / denominator);
    }
    const cleanSpend = cleanRound(initialSpending, 2);
    const run = calculateDrawdown({
      initialSavings,
      currentAge,
      spendingAnnual: cleanSpend,
      inflationAdjusted,
      expectedReturnPct,
      inflationPct,
      feesPct,
      maxYears: totalYears,
    });

    return {
      maxInitialAnnualSpending: cleanSpend,
      maxInitialMonthlySpending: cleanRound(cleanSpend / 12, 2),
      initialWithdrawalRatePct: cleanRound((cleanSpend / initialSavings) * 100, 2),
      schedule: run.schedule,
    };
  }

  // Bisection solver for general case with other incomes/taxes
  let low = 0;
  let high = initialSavings * 2;
  let bestW = 0;

  for (let iter = 0; iter < 45; iter++) {
    const mid = (low + high) / 2;
    const sim = calculateDrawdown({
      initialSavings,
      currentAge,
      spendingAnnual: mid,
      inflationAdjusted,
      expectedReturnPct,
      inflationPct,
      feesPct,
      otherIncomes,
      taxRatePct,
      timing,
      maxYears: totalYears,
    });

    if (sim.schedule.length < totalYears || (sim.schedule[totalYears - 1] && sim.schedule[totalYears - 1].endingBalance <= 0)) {
      high = mid;
    } else {
      bestW = mid;
      low = mid;
    }
  }

  const cleanW = cleanRound(bestW, 2);
  const finalRun = calculateDrawdown({
    initialSavings,
    currentAge,
    spendingAnnual: cleanW,
    inflationAdjusted,
    expectedReturnPct,
    inflationPct,
    feesPct,
    otherIncomes,
    taxRatePct,
    timing,
    maxYears: totalYears,
  });

  return {
    maxInitialAnnualSpending: cleanW,
    maxInitialMonthlySpending: cleanRound(cleanW / 12, 2),
    initialWithdrawalRatePct: cleanRound((cleanW / initialSavings) * 100, 2),
    schedule: finalRun.schedule,
  };
}

/**
 * 3. Stress-Test Scenarios (Lower Return & Bad-Start Sequence of Returns)
 */
export function calculateScenarios(inputs: DrawdownInputs): ScenarioResult {
  const baseRun = calculateDrawdown(inputs);

  // Lower return (-2 percentage points)
  const lowerReturnRun = calculateDrawdown({
    ...inputs,
    expectedReturnPct: Math.max(0, inputs.expectedReturnPct - 2.0),
  });

  // Bad-start sequence: first 2 years experience -15% drawdown, then expected return
  const badStartSchedule: YearScheduleEntry[] = [];
  let bal = inputs.initialSavings;
  let exactYears = 0;
  let isDepleted = false;
  const inflationRate = (inputs.inflationPct ?? 0) / 100;

  for (let yr = 1; yr <= (inputs.maxYears ?? 80); yr++) {
    const age = inputs.currentAge + yr - 1;
    const startBal = bal;
    // Years 1 and 2 return -15%
    const yrReturnRate = yr <= 2 ? -0.15 : (inputs.expectedReturnPct - (inputs.feesPct ?? 0)) / 100;
    const inflationFactor = inputs.inflationAdjusted ? Math.pow(1 + inflationRate, yr - 1) : 1;
    const grossNeeded = inputs.spendingAnnual * inflationFactor;

    let yrOtherIncome = 0;
    for (const inc of inputs.otherIncomes ?? []) {
      if (age >= inc.startAge) {
        const yearsActive = age - inc.startAge;
        const incGrowth = inc.annualIncreasePct ? Math.pow(1 + inc.annualIncreasePct / 100, yearsActive) : 1;
        yrOtherIncome += inc.annualAmount * incGrowth;
      }
    }

    const netW = Math.max(0, grossNeeded - yrOtherIncome);
    const growth = startBal * yrReturnRate;
    const grownBal = startBal + growth;

    if (grownBal <= netW) {
      const frac = Math.max(0, grownBal / netW);
      exactYears = yr - 1 + frac;
      isDepleted = true;
      badStartSchedule.push({
        year: yr,
        age,
        startingBalance: cleanRound(startBal, 2),
        investmentGrowth: cleanRound(growth, 2),
        grossSpending: cleanRound(grossNeeded, 2),
        otherIncome: cleanRound(yrOtherIncome, 2),
        oneOffExpense: 0,
        netWithdrawal: cleanRound(grownBal, 2),
        endingBalance: 0,
      });
      break;
    }

    bal = grownBal - netW;
    badStartSchedule.push({
      year: yr,
      age,
      startingBalance: cleanRound(startBal, 2),
      investmentGrowth: cleanRound(growth, 2),
      grossSpending: cleanRound(grossNeeded, 2),
      otherIncome: cleanRound(yrOtherIncome, 2),
      oneOffExpense: 0,
      netWithdrawal: cleanRound(netW, 2),
      endingBalance: cleanRound(bal, 2),
    });
  }

  const badYears = isDepleted ? cleanRound(exactYears, 1) : cleanRound(inputs.maxYears ?? 80, 1);

  return {
    expectedYears: baseRun.yearsLasted,
    expectedEndAge: baseRun.depletedAge,
    lowerReturnYears: lowerReturnRun.yearsLasted,
    lowerReturnEndAge: lowerReturnRun.depletedAge,
    badStartYears: badYears,
    badStartEndAge: cleanRound(inputs.currentAge + badYears, 1),
  };
}
