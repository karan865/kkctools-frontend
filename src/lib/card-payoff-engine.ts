/**
 * card-payoff-engine.ts — Credit Card Payoff, APR & Debt Paydown Engine
 *
 * Core engine for /credit-card-payoff-calculator/
 * Pure functions only. Zero DOM, zero network, zero side-effects.
 */

export interface PayoffMonthRow {
  month: number;
  startingBalance: number;
  interestCharged: number;
  payment: number;
  principalPaid: number;
  endingBalance: number;
  cumulativeInterest: number;
  cumulativePayments: number;
}

export interface PayoffSimulationResult {
  months: number;
  years: number;
  totalInterest: number;
  totalPaid: number;
  monthlyPayment: number;
  isPayoffPossible: boolean;
  unaffordableMessage?: string;
  schedule: PayoffMonthRow[];
  debtFreeDateText: string;
}

export interface MinimumPaymentResult {
  months: number;
  years: number;
  totalInterest: number;
  totalPaid: number;
  firstMonthPayment: number;
  lastMonthPayment: number;
  schedule: PayoffMonthRow[];
}

export interface CreditCardItem {
  id: string;
  name: string;
  balance: number;
  aprPct: number;
  minPayment: number;
}

export interface MultiCardPayoffResult {
  strategy: 'avalanche' | 'snowball';
  months: number;
  years: number;
  totalInterest: number;
  totalPaid: number;
  payoffOrder: string[];
}

export interface BalanceTransferResult {
  transferAmount: number;
  transferFee: number;
  newStartingBalance: number;
  promoMonthlyPayment: number;
  totalInterestPromo: number;
  totalInterestStaying: number;
  netSavings: number;
  isWorthIt: boolean;
}

export interface AprConversionResult {
  aprPct: number;
  dailyPeriodicRatePct: number;
  monthlyPeriodicRatePct: number;
  effectiveApyPct: number;
}

function cleanNumber(val: number): number {
  if (Object.is(val, -0) || Math.abs(val) < 1e-12) return 0;
  return Number(val.toFixed(2));
}

function cleanPrecision(val: number, decimals: number = 4): number {
  if (Object.is(val, -0) || Math.abs(val) < 1e-12) return 0;
  return Number(val.toFixed(decimals));
}

/**
 * Returns effective periodic monthly rate depending on interest convention (monthly APR/12 or daily 365).
 */
export function getPeriodicRate(aprPct: number, method: 'monthly' | 'daily' = 'monthly'): number {
  const safeApr = Math.max(0, aprPct) / 100;
  if (method === 'monthly') {
    return safeApr / 12;
  }
  // Daily average month: 365 / 12 = 30.41667 days
  return (safeApr / 365) * (365 / 12);
}

/**
 * Calculates payment required to clear balance B in targetMonths at aprPct.
 */
export function calculatePaymentForMonths(
  balance: number,
  aprPct: number,
  targetMonths: number,
  method: 'monthly' | 'daily' = 'monthly'
): number {
  if (balance <= 0 || targetMonths <= 0) return 0;
  const r = getPeriodicRate(aprPct, method);
  if (r <= 0) return cleanNumber(balance / targetMonths);

  // Closed form annuity amortization payment: PMT = r * B / (1 - (1 + r)^-n)
  const pmt = (r * balance) / (1 - Math.pow(1 + r, -targetMonths));
  return cleanNumber(pmt);
}

/**
 * Simulates credit card payoff with fixed monthly payment or target months.
 */
export function simulateCardPayoff(
  balance: number,
  aprPct: number,
  monthlyPayment: number,
  method: 'monthly' | 'daily' = 'monthly',
  newChargesPerMonth: number = 0,
  annualFee: number = 0
): PayoffSimulationResult {
  const safeBalance = Math.max(0, balance);
  const r = getPeriodicRate(aprPct, method);
  const safePayment = Math.max(0, monthlyPayment);
  const safeCharges = Math.max(0, newChargesPerMonth);
  const safeAnnualFee = Math.max(0, annualFee);

  if (safeBalance <= 0) {
    return {
      months: 0,
      years: 0,
      totalInterest: 0,
      totalPaid: 0,
      monthlyPayment: 0,
      isPayoffPossible: true,
      schedule: [],
      debtFreeDateText: 'Today (No balance)',
    };
  }

  // Monthly interest on initial balance
  const firstMonthInterest = safeBalance * r;
  if (safePayment <= firstMonthInterest + safeCharges) {
    return {
      months: Infinity,
      years: Infinity,
      totalInterest: Infinity,
      totalPaid: Infinity,
      monthlyPayment: safePayment,
      isPayoffPossible: false,
      unaffordableMessage: `Your payment of $${safePayment.toFixed(2)} does not cover monthly interest ($${firstMonthInterest.toFixed(2)}) plus new charges ($${safeCharges.toFixed(2)}). Balance will grow indefinitely.`,
      schedule: [],
      debtFreeDateText: 'Never (Payment too low)',
    };
  }

  const schedule: PayoffMonthRow[] = [];
  let currentBalance = safeBalance;
  let cumulativeInterest = 0;
  let cumulativePayments = 0;
  let month = 0;
  const maxMonthsGuard = 600; // 50 years max loop guard

  while (currentBalance > 0.005 && month < maxMonthsGuard) {
    month++;
    const startBal = currentBalance;
    const interest = startBal * r;
    currentBalance += interest;

    // Apply annual fee in month 12, 24, 36...
    if (safeAnnualFee > 0 && month % 12 === 0) {
      currentBalance += safeAnnualFee;
    }

    // Add ongoing new charges
    currentBalance += safeCharges;

    // Payment applied: if remaining balance after payment would be under $1.00, clear it in this month
    let payment = safePayment;
    if (currentBalance <= safePayment || currentBalance - safePayment < 1.0) {
      payment = currentBalance;
    }
    const principalPortion = Math.max(0, payment - interest);
    currentBalance = Math.max(0, currentBalance - payment);

    cumulativeInterest += interest;
    cumulativePayments += payment;

    schedule.push({
      month,
      startingBalance: cleanNumber(startBal),
      interestCharged: cleanNumber(interest),
      payment: cleanNumber(payment),
      principalPaid: cleanNumber(principalPortion),
      endingBalance: cleanNumber(currentBalance),
      cumulativeInterest: cleanNumber(cumulativeInterest),
      cumulativePayments: cleanNumber(cumulativePayments),
    });
  }

  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + month);
  const debtFreeDateText = currentDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return {
    months: month,
    years: cleanPrecision(month / 12, 1),
    totalInterest: cleanNumber(cumulativeInterest),
    totalPaid: cleanNumber(cumulativePayments),
    monthlyPayment: safePayment,
    isPayoffPossible: true,
    schedule,
    debtFreeDateText,
  };
}

/**
 * Simulates standard issuer minimum payment schedule.
 * Payment = max(floor, balance * pct + (plusInterest ? interest : 0))
 */
export function simulateMinimumPayment(
  balance: number,
  aprPct: number,
  pctOfBalance: number = 1.0, // 1% typical
  plusInterest: boolean = true, // 1% + interest typical formula
  floorDollars: number = 25.0, // $25 floor typical
  method: 'monthly' | 'daily' = 'monthly'
): MinimumPaymentResult {
  const safeBalance = Math.max(0, balance);
  const r = getPeriodicRate(aprPct, method);
  const minPctDec = Math.max(0, pctOfBalance) / 100;
  const floor = Math.max(10, floorDollars);

  if (safeBalance <= 0) {
    return {
      months: 0,
      years: 0,
      totalInterest: 0,
      totalPaid: 0,
      firstMonthPayment: 0,
      lastMonthPayment: 0,
      schedule: [],
    };
  }

  const schedule: PayoffMonthRow[] = [];
  let currentBalance = safeBalance;
  let cumulativeInterest = 0;
  let cumulativePayments = 0;
  let month = 0;
  let firstPayment = 0;
  let lastPayment = 0;
  const maxMonths = 1200; // 100 years guard

  while (currentBalance > 0.005 && month < maxMonths) {
    month++;
    const startBal = currentBalance;
    const interest = startBal * r;
    currentBalance += interest;

    // Minimum payment rule
    let minCalc = startBal * minPctDec;
    if (plusInterest) {
      minCalc += interest;
    }
    const targetPayment = Math.max(floor, minCalc);
    const payment = Math.min(targetPayment, currentBalance);
    const principalPortion = Math.max(0, payment - interest);
    currentBalance = Math.max(0, currentBalance - payment);

    if (month === 1) firstPayment = payment;
    lastPayment = payment;

    cumulativeInterest += interest;
    cumulativePayments += payment;

    schedule.push({
      month,
      startingBalance: cleanNumber(startBal),
      interestCharged: cleanNumber(interest),
      payment: cleanNumber(payment),
      principalPaid: cleanNumber(principalPortion),
      endingBalance: cleanNumber(currentBalance),
      cumulativeInterest: cleanNumber(cumulativeInterest),
      cumulativePayments: cleanNumber(cumulativePayments),
    });
  }

  return {
    months: month,
    years: cleanPrecision(month / 12, 1),
    totalInterest: cleanNumber(cumulativeInterest),
    totalPaid: cleanNumber(cumulativePayments),
    firstMonthPayment: cleanNumber(firstPayment),
    lastMonthPayment: cleanNumber(lastPayment),
    schedule,
  };
}

/**
 * Multi-Card Debt Payoff: Avalanche (Highest APR first) vs Snowball (Lowest Balance first).
 */
export function simulateMultiCardPayoff(
  cards: CreditCardItem[],
  totalMonthlyBudget: number,
  strategy: 'avalanche' | 'snowball' = 'avalanche'
): MultiCardPayoffResult {
  const activeCards = cards
    .filter((c) => c.balance > 0)
    .map((c) => ({
      ...c,
      currentBal: c.balance,
      r: getPeriodicRate(c.aprPct, 'monthly'),
      isPaid: false,
    }));

  if (activeCards.length === 0) {
    return {
      strategy,
      months: 0,
      years: 0,
      totalInterest: 0,
      totalPaid: 0,
      payoffOrder: [],
    };
  }

  const sumMinimums = activeCards.reduce((acc, c) => acc + c.minPayment, 0);
  const effectiveBudget = Math.max(sumMinimums, totalMonthlyBudget);

  const payoffOrder: string[] = [];
  let cumulativeInterest = 0;
  let cumulativePaid = 0;
  let month = 0;
  const maxMonths = 600;

  while (activeCards.some((c) => !c.isPaid) && month < maxMonths) {
    month++;

    // 1. Charge interest on remaining balances
    activeCards.forEach((c) => {
      if (!c.isPaid) {
        const int = c.currentBal * c.r;
        c.currentBal += int;
        cumulativeInterest += int;
      }
    });

    // 2. Pay minimums on all active cards
    let budgetRemaining = effectiveBudget;
    activeCards.forEach((c) => {
      if (!c.isPaid) {
        const pmt = Math.min(c.minPayment, c.currentBal);
        c.currentBal -= pmt;
        budgetRemaining -= pmt;
        cumulativePaid += pmt;
        if (c.currentBal <= 0.005) {
          c.isPaid = true;
          c.currentBal = 0;
          payoffOrder.push(c.name);
        }
      }
    });

    // 3. Direct all remaining excess budget to the priority card
    // Priority: Avalanche = highest APR; Snowball = smallest current balance
    const unpaidCards = activeCards.filter((c) => !c.isPaid);
    if (unpaidCards.length > 0 && budgetRemaining > 0) {
      if (strategy === 'avalanche') {
        unpaidCards.sort((a, b) => b.aprPct - a.aprPct);
      } else {
        unpaidCards.sort((a, b) => a.currentBal - b.currentBal);
      }

      for (const targetCard of unpaidCards) {
        if (budgetRemaining <= 0) break;
        const extraPmt = Math.min(budgetRemaining, targetCard.currentBal);
        targetCard.currentBal -= extraPmt;
        budgetRemaining -= extraPmt;
        cumulativePaid += extraPmt;

        if (targetCard.currentBal <= 0.005) {
          targetCard.isPaid = true;
          targetCard.currentBal = 0;
          payoffOrder.push(targetCard.name);
        }
      }
    }
  }

  return {
    strategy,
    months: month,
    years: cleanPrecision(month / 12, 1),
    totalInterest: cleanNumber(cumulativeInterest),
    totalPaid: cleanNumber(cumulativePaid),
    payoffOrder,
  };
}

/**
 * Balance Transfer Offer Analysis
 */
export function calculateBalanceTransfer(
  transferAmount: number,
  feePct: number = 3.0, // 3% - 5% typical
  promoAprPct: number = 0.0, // 0% intro APR
  promoMonths: number = 18, // 18-month 0% card typical
  goAprPct: number = 24.0, // Regular APR after promo
  monthlyPayment: number = 250,
  currentAprPct: number = 22.0
): BalanceTransferResult {
  const safeAmount = Math.max(0, transferAmount);
  const transferFee = cleanNumber(safeAmount * (Math.max(0, feePct) / 100));
  const newStartingBalance = safeAmount + transferFee;

  // Simulate staying with current card
  const stayingRes = simulateCardPayoff(safeAmount, currentAprPct, monthlyPayment);

  // Simulate balance transfer:
  // Phase 1: Promo period
  let bal = newStartingBalance;
  let promoInterest = 0;
  const promoR = getPeriodicRate(promoAprPct, 'monthly');

  for (let m = 1; m <= promoMonths && bal > 0.005; m++) {
    const int = bal * promoR;
    bal += int;
    promoInterest += int;
    const pmt = Math.min(monthlyPayment, bal);
    bal = Math.max(0, bal - pmt);
  }

  // Phase 2: Post-promo period at goAprPct if balance remains
  if (bal > 0.005) {
    const postRes = simulateCardPayoff(bal, goAprPct, monthlyPayment);
    promoInterest += postRes.totalInterest;
  }

  const totalTransferCost = promoInterest + transferFee;
  const netSavings = cleanNumber(stayingRes.totalInterest - totalTransferCost);

  return {
    transferAmount: safeAmount,
    transferFee,
    newStartingBalance: cleanNumber(newStartingBalance),
    promoMonthlyPayment: monthlyPayment,
    totalInterestPromo: cleanNumber(totalTransferCost),
    totalInterestStaying: stayingRes.totalInterest,
    netSavings,
    isWorthIt: netSavings > 0,
  };
}

/**
 * APR to Periodic Rates and Effective APY Converter
 */
export function convertApr(aprPct: number): AprConversionResult {
  const safeApr = Math.max(0, aprPct);
  const r = safeApr / 100;

  const dailyPeriodicRatePct = cleanPrecision(safeApr / 365, 4);
  const monthlyPeriodicRatePct = cleanPrecision(safeApr / 12, 4);
  // Compounded daily effective APY: (1 + r/365)^365 - 1
  const effectiveApyPct = cleanPrecision((Math.pow(1 + r / 365, 365) - 1) * 100, 2);

  return {
    aprPct: cleanPrecision(safeApr, 2),
    dailyPeriodicRatePct,
    monthlyPeriodicRatePct,
    effectiveApyPct,
  };
}
