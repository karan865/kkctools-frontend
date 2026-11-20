/**
 * Real Estate Engine — Pure mathematical functions for commercial and residential
 * real estate metrics: Net Operating Income (NOI), Cap Rate, Property Valuation,
 * Gross Rent Multiplier (GRM), DSCR, Debt Yield, Cash-on-Cash Return, Gross/Net Yields,
 * Internal Rate of Return (IRR), and Net Present Value (NPV).
 *
 * Shared engine across Cap Rate Calculator, Rental Property Calculator,
 * Commercial Lease Calculator, Airbnb Calculator, and Commercial Mortgage Calculator.
 *
 * Rules:
 * - Pure functions only. Zero I/O, zero network, zero state.
 * - Returns null (not NaN or Infinity) for undefined or invalid cases (e.g. division by zero, non-positive price).
 * - Normalises floating point precision artifacts and -0 to 0.
 * - Full precision maintained; display rounding handled by UI formatters.
 */

export interface ExpenseItem {
  name?: string;
  amount: number;
}

export interface NoiInput {
  grossRent: number;
  otherIncome?: number;
  vacancyPct?: number; // e.g. 5 for 5%
  expenses?: (number | ExpenseItem)[];
  managementPct?: number; // e.g. 6 for 6% of effective income
}

export interface NoiBreakdown {
  grossRent: number;
  otherIncome: number;
  vacancyLoss: number;
  effectiveIncome: number;
  itemizedExpenses: { name: string; amount: number; pctOfEffective: number }[];
  managementCost: number;
  totalExpenses: number;
  noi: number;
  expenseRatioPct: number;
}

/**
 * Normalises numbers, converting -0 to 0 and rounding microscopic precision noise.
 */
function cleanNumber(n: number): number {
  if (Object.is(n, -0) || Math.abs(n) < 1e-12) return 0;
  return Number(n.toFixed(10));
}

/**
 * Calculates Net Operating Income (NOI) with vacancy applied to gross rent only,
 * plus management percentage calculated against Effective Gross Income (EGI).
 */
export function noi(input: NoiInput): number {
  const grossRent = Math.max(0, input.grossRent || 0);
  const otherIncome = Math.max(0, input.otherIncome || 0);
  const vacancyPct = Math.max(0, input.vacancyPct || 0);
  const managementPct = Math.max(0, input.managementPct || 0);

  // Vacancy loss is applied strictly to gross rental income
  const vacancyLoss = grossRent * (vacancyPct / 100);
  const effectiveIncome = grossRent + otherIncome - vacancyLoss;

  // Management cost as percentage of Effective Gross Income
  const managementCost = effectiveIncome * (managementPct / 100);

  // Sum of itemized expenses
  let itemizedTotal = 0;
  if (Array.isArray(input.expenses)) {
    for (const exp of input.expenses) {
      if (typeof exp === 'number') {
        itemizedTotal += exp;
      } else if (exp && typeof exp.amount === 'number') {
        itemizedTotal += exp.amount;
      }
    }
  }

  const totalExpenses = itemizedTotal + managementCost;
  return cleanNumber(effectiveIncome - totalExpenses);
}

/**
 * Returns detailed line-by-line NOI breakdown for display in tables and waterfall views.
 */
export function calculateNoiBreakdown(input: NoiInput): NoiBreakdown {
  const grossRent = Math.max(0, input.grossRent || 0);
  const otherIncome = Math.max(0, input.otherIncome || 0);
  const vacancyPct = Math.max(0, input.vacancyPct || 0);
  const managementPct = Math.max(0, input.managementPct || 0);

  const vacancyLoss = cleanNumber(grossRent * (vacancyPct / 100));
  const effectiveIncome = cleanNumber(grossRent + otherIncome - vacancyLoss);

  const managementCost = cleanNumber(effectiveIncome * (managementPct / 100));

  const itemizedExpenses: { name: string; amount: number; pctOfEffective: number }[] = [];
  let itemizedTotal = 0;

  if (Array.isArray(input.expenses)) {
    input.expenses.forEach((exp, index) => {
      const amount = typeof exp === 'number' ? exp : (exp?.amount || 0);
      const name = typeof exp === 'object' && exp?.name ? exp.name : `Expense ${index + 1}`;
      itemizedTotal += amount;
      const pctOfEffective = effectiveIncome > 0 ? cleanNumber((amount / effectiveIncome) * 100) : 0;
      itemizedExpenses.push({ name, amount: cleanNumber(amount), pctOfEffective });
    });
  }

  if (managementCost > 0 || managementPct > 0) {
    const mgmtPctOfEffective = effectiveIncome > 0 ? cleanNumber((managementCost / effectiveIncome) * 100) : 0;
    itemizedExpenses.push({
      name: `Property Management (${managementPct}%)`,
      amount: managementCost,
      pctOfEffective: mgmtPctOfEffective,
    });
  }

  const totalExpenses = cleanNumber(itemizedTotal + managementCost);
  const netOperatingIncome = cleanNumber(effectiveIncome - totalExpenses);
  const expenseRatioPct = effectiveIncome > 0 ? cleanNumber((totalExpenses / effectiveIncome) * 100) : 0;

  return {
    grossRent: cleanNumber(grossRent),
    otherIncome: cleanNumber(otherIncome),
    vacancyLoss,
    effectiveIncome,
    itemizedExpenses,
    managementCost,
    totalExpenses,
    noi: netOperatingIncome,
    expenseRatioPct,
  };
}

/**
 * Capitalization Rate (%) = (Net Operating Income / Property Value or Purchase Price) * 100
 * Returns percentage (e.g. 5.315 for 5.315%).
 * Returns null if price <= 0.
 */
export function capRate(netOperatingIncome: number, propertyValue: number): number | null {
  if (propertyValue <= 0 || !Number.isFinite(propertyValue) || !Number.isFinite(netOperatingIncome)) {
    return null;
  }
  return cleanNumber((netOperatingIncome / propertyValue) * 100);
}

/**
 * Property Valuation from Cap Rate: Value = Net Operating Income / (Cap Rate % / 100)
 * Returns null if capRatePct <= 0 or if noi is non-finite.
 */
export function valueFromCap(netOperatingIncome: number, capRatePct: number): number | null {
  if (capRatePct <= 0 || !Number.isFinite(capRatePct) || !Number.isFinite(netOperatingIncome)) {
    return null;
  }
  return cleanNumber(netOperatingIncome / (capRatePct / 100));
}

/**
 * Required NOI from Target Cap Rate: NOI = Property Price * (Cap Rate % / 100)
 * Returns null if price <= 0 or capRatePct <= 0.
 */
export function noiFromCap(propertyValue: number, capRatePct: number): number | null {
  if (propertyValue <= 0 || capRatePct <= 0 || !Number.isFinite(propertyValue) || !Number.isFinite(capRatePct)) {
    return null;
  }
  return cleanNumber(propertyValue * (capRatePct / 100));
}

/**
 * Gross Rent Multiplier (GRM) = Property Price / Gross Annual Rent
 * Returns null if annualRent <= 0 or price <= 0.
 */
export function grm(price: number, annualGrossRent: number): number | null {
  if (price <= 0 || annualGrossRent <= 0 || !Number.isFinite(price) || !Number.isFinite(annualGrossRent)) {
    return null;
  }
  return cleanNumber(price / annualGrossRent);
}

/**
 * Debt Service Coverage Ratio (DSCR) = Net Operating Income / Annual Debt Service
 * Returns null if annualDebtService <= 0 or non-finite.
 */
export function dscr(netOperatingIncome: number, annualDebtService: number): number | null {
  if (annualDebtService <= 0 || !Number.isFinite(annualDebtService) || !Number.isFinite(netOperatingIncome)) {
    return null;
  }
  return cleanNumber(netOperatingIncome / annualDebtService);
}

/**
 * Debt Yield (%) = (Net Operating Income / Total Loan Amount) * 100
 * Commercial lenders use this as an un-leveraged measure of risk.
 * Returns null if loanAmount <= 0.
 */
export function debtYield(netOperatingIncome: number, loanAmount: number): number | null {
  if (loanAmount <= 0 || !Number.isFinite(loanAmount) || !Number.isFinite(netOperatingIncome)) {
    return null;
  }
  return cleanNumber((netOperatingIncome / loanAmount) * 100);
}

/**
 * Cash-on-Cash Return (%) = (Annual Pre-Tax Cash Flow / Total Cash Invested) * 100
 * Returns null if cashInvested <= 0.
 */
export function cashOnCash(annualCashFlow: number, cashInvested: number): number | null {
  if (cashInvested <= 0 || !Number.isFinite(cashInvested) || !Number.isFinite(annualCashFlow)) {
    return null;
  }
  return cleanNumber((annualCashFlow / cashInvested) * 100);
}

/**
 * Gross Rental Yield (%) = (Annual Gross Rent / Purchase Price) * 100
 * Returns null if price <= 0.
 */
export function grossYield(annualGrossRent: number, price: number): number | null {
  if (price <= 0 || !Number.isFinite(price) || !Number.isFinite(annualGrossRent)) {
    return null;
  }
  return cleanNumber((annualGrossRent / price) * 100);
}

/**
 * Net Rental Yield (%) = (Net Operating Income / Purchase Price) * 100
 * Note: Mathematically identical to Cap Rate based on purchase price.
 * Returns null if price <= 0.
 */
export function netYield(netOperatingIncome: number, price: number): number | null {
  return capRate(netOperatingIncome, price);
}

/**
 * Net Present Value (NPV):
 * NPV = \sum_{t=0}^{n-1} \frac{CF_t}{(1 + r)^t}
 * where r = discountRatePct / 100.
 */
export function npv(discountRatePct: number, cashFlows: number[]): number | null {
  if (!Array.isArray(cashFlows) || cashFlows.length === 0 || !Number.isFinite(discountRatePct)) {
    return null;
  }
  const r = discountRatePct / 100;
  if (r <= -1) return null; // Avoid division by zero or negative base issues

  let total = 0;
  for (let t = 0; t < cashFlows.length; t++) {
    const cf = cashFlows[t];
    if (!Number.isFinite(cf)) return null;
    total += cf / Math.pow(1 + r, t);
  }
  return cleanNumber(total);
}

/**
 * Internal Rate of Return (IRR) as a percentage (e.g. 12.5 for 12.5%).
 * Uses bisection with Newton-Raphson acceleration.
 * Returns null if there are no sign changes in cashFlows or if IRR does not converge.
 */
export function irr(cashFlows: number[]): number | null {
  if (!Array.isArray(cashFlows) || cashFlows.length < 2) {
    return null;
  }

  let hasPositive = false;
  let hasNegative = false;
  for (const cf of cashFlows) {
    if (!Number.isFinite(cf)) return null;
    if (cf > 0) hasPositive = true;
    if (cf < 0) hasNegative = true;
  }

  // IRR requires at least one cash outflow and one cash inflow
  if (!hasPositive || !hasNegative) {
    return null;
  }

  // NPV helper for a given rate (as decimal)
  const calcNpv = (rate: number): number => {
    let sum = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      sum += cashFlows[t] / Math.pow(1 + rate, t);
    }
    return sum;
  };

  // Derivative of NPV with respect to rate
  const calcDnpv = (rate: number): number => {
    let sum = 0;
    for (let t = 1; t < cashFlows.length; t++) {
      sum -= (t * cashFlows[t]) / Math.pow(1 + rate, t + 1);
    }
    return sum;
  };

  // Attempt Newton-Raphson from initial guess of 0.1 (10%)
  let guess = 0.1;
  const maxNewtonIter = 30;
  for (let i = 0; i < maxNewtonIter; i++) {
    const val = calcNpv(guess);
    if (Math.abs(val) < 1e-7) {
      return cleanNumber(guess * 100);
    }
    const deriv = calcDnpv(guess);
    if (Math.abs(deriv) < 1e-9) break; // Derivative too flat, fall back to bisection
    const nextGuess = guess - val / deriv;
    if (nextGuess <= -0.999 || nextGuess > 100 || isNaN(nextGuess)) {
      break; // Stepped out of bounds
    }
    guess = nextGuess;
  }

  // Fallback: Bisection method between -0.99 (-99%) and 10 (1,000%)
  let low = -0.99;
  let high = 10.0;
  let npvLow = calcNpv(low);
  let npvHigh = calcNpv(high);

  // If bounds do not straddle zero, try expanding high bound
  if (npvLow * npvHigh > 0) {
    high = 100.0;
    npvHigh = calcNpv(high);
    if (npvLow * npvHigh > 0) {
      return null;
    }
  }

  const maxBisectionIter = 100;
  for (let i = 0; i < maxBisectionIter; i++) {
    const mid = (low + high) / 2;
    const npvMid = calcNpv(mid);
    if (Math.abs(npvMid) < 1e-7 || (high - low) < 1e-9) {
      return cleanNumber(mid * 100);
    }
    if (npvLow * npvMid < 0) {
      high = mid;
      npvHigh = npvMid;
    } else {
      low = mid;
      npvLow = npvMid;
    }
  }

  const result = (low + high) / 2;
  return cleanNumber(result * 100);
}
