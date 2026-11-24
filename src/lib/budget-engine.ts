/**
 * Monthly Budget & 50/30/20 Rule Calculation Engine
 * 
 * Implements:
 * - Multi-source income aggregation with pay frequencies (weekly, bi-weekly, semi-monthly, monthly, annual)
 * - Itemized expense tracking categorized into Needs, Wants, and Savings/Debt
 * - 50/30/20, 70/20/10, 60/20/20, 80/20, and custom budget allocation comparison
 * - Surplus (leftover) and shortfall detection
 * - Annualized budget breakdown and sinking-fund annual bill calculation
 * - Client-side RFC 4180 compliant CSV generator for Excel / Google Sheets
 * 
 * Pure deterministic functions, zero network, zero external libraries.
 */

export type PayFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly' | 'yearly';

export type ExpenseCategory = 'needs' | 'wants' | 'savings';

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: PayFrequency;
}

export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  isYearlyBill?: boolean; // if true, amount is annual bill divided by 12
}

export interface BudgetRuleSplit {
  name: string;
  needsPct: number;
  wantsPct: number;
  savingsPct: number;
}

export const BUDGET_RULE_PRESETS: Record<string, BudgetRuleSplit> = {
  '50/30/20': { name: '50/30/20 Guideline', needsPct: 50, wantsPct: 30, savingsPct: 20 },
  '70/20/10': { name: '70/20/10 Split', needsPct: 70, wantsPct: 20, savingsPct: 10 },
  '60/20/20': { name: '60/20/20 Split', needsPct: 60, wantsPct: 20, savingsPct: 20 },
  '80/20': { name: '80/20 Split (Needs & Savings)', needsPct: 80, wantsPct: 0, savingsPct: 20 },
};

export const FREQUENCY_ANNUAL_MULTIPLIERS: Record<PayFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
  yearly: 1,
};

export interface CategorySummary {
  actualAmount: number;
  actualPct: number;
  targetAmount: number;
  targetPct: number;
  gapAmount: number; // actual - target (+ means over budget, - means under)
}

export interface BudgetCalculationResult {
  monthlyIncome: number;
  annualIncome: number;
  monthlyExpenses: number;
  annualExpenses: number;
  monthlyLeftover: number;
  annualLeftover: number;
  isShortfall: boolean;
  needs: CategorySummary;
  wants: CategorySummary;
  savings: CategorySummary;
  ruleName: string;
}

/**
 * Converts any income amount with a given pay frequency to a monthly take-home equivalent.
 */
export function frequencyToMonthly(amount: number, frequency: PayFrequency): number {
  const annual = Math.max(0, amount) * FREQUENCY_ANNUAL_MULTIPLIERS[frequency];
  return Number((annual / 12.0).toFixed(2));
}

/**
 * Calculates total monthly take-home income from multiple income sources.
 */
export function calculateTotalMonthlyIncome(sources: IncomeSource[]): number {
  const total = sources.reduce((sum, s) => sum + frequencyToMonthly(s.amount, s.frequency), 0);
  return Number(total.toFixed(2));
}

/**
 * Evaluates monthly budget against a chosen allocation rule.
 */
export function calculateBudget(
  incomes: IncomeSource[],
  expenses: ExpenseItem[],
  rule: BudgetRuleSplit = BUDGET_RULE_PRESETS['50/30/20']
): BudgetCalculationResult {
  const monthlyIncome = calculateTotalMonthlyIncome(incomes);
  const annualIncome = Number((monthlyIncome * 12.0).toFixed(2));

  let needsTotal = 0;
  let wantsTotal = 0;
  let savingsTotal = 0;

  expenses.forEach((item) => {
    const rawAmt = Math.max(0, item.amount);
    const monthlyAmt = item.isYearlyBill ? rawAmt / 12.0 : rawAmt;

    if (item.category === 'needs') needsTotal += monthlyAmt;
    else if (item.category === 'wants') wantsTotal += monthlyAmt;
    else if (item.category === 'savings') savingsTotal += monthlyAmt;
  });

  const roundedNeeds = Number(needsTotal.toFixed(2));
  const roundedWants = Number(wantsTotal.toFixed(2));
  const roundedSavings = Number(savingsTotal.toFixed(2));

  const monthlyExpenses = Number((roundedNeeds + roundedWants + roundedSavings).toFixed(2));
  const annualExpenses = Number((monthlyExpenses * 12.0).toFixed(2));

  const monthlyLeftover = Number((monthlyIncome - monthlyExpenses).toFixed(2));
  const annualLeftover = Number((monthlyLeftover * 12.0).toFixed(2));
  const isShortfall = monthlyLeftover < 0;

  const buildCategorySummary = (actual: number, targetPct: number): CategorySummary => {
    const actualPct = monthlyIncome > 0 ? Number(((actual / monthlyIncome) * 100.0).toFixed(1)) : 0;
    const targetAmount = Number(((monthlyIncome * targetPct) / 100.0).toFixed(2));
    const gapAmount = Number((actual - targetAmount).toFixed(2));

    return {
      actualAmount: actual,
      actualPct,
      targetAmount,
      targetPct,
      gapAmount,
    };
  };

  return {
    monthlyIncome,
    annualIncome,
    monthlyExpenses,
    annualExpenses,
    monthlyLeftover,
    annualLeftover,
    isShortfall,
    needs: buildCategorySummary(roundedNeeds, rule.needsPct),
    wants: buildCategorySummary(roundedWants, rule.wantsPct),
    savings: buildCategorySummary(roundedSavings, rule.savingsPct),
    ruleName: rule.name,
  };
}

/**
 * Escapes a cell string for RFC 4180 CSV export.
 */
function escapeCsv(val: string | number): string {
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generates CSV string of the budget worksheet for Microsoft Excel or Google Sheets.
 */
export function generateBudgetCsv(
  incomes: IncomeSource[],
  expenses: ExpenseItem[],
  result: BudgetCalculationResult
): string {
  const lines: string[] = [];

  // Header
  lines.push('MONTHLY BUDGET WORKSHEET (KKC TOOLS)');
  lines.push('');

  // Summary
  lines.push('BUDGET SUMMARY');
  lines.push(['Metric', 'Monthly Amount', 'Annual Amount'].map(escapeCsv).join(','));
  lines.push(['Total Income', result.monthlyIncome.toFixed(2), result.annualIncome.toFixed(2)].map(escapeCsv).join(','));
  lines.push(['Total Expenses', result.monthlyExpenses.toFixed(2), result.annualExpenses.toFixed(2)].map(escapeCsv).join(','));
  lines.push(['Net Leftover / (Shortfall)', result.monthlyLeftover.toFixed(2), result.annualLeftover.toFixed(2)].map(escapeCsv).join(','));
  lines.push('');

  // 50/30/20 Breakdown
  lines.push(`ALLOCATION BREAKDOWN (${escapeCsv(result.ruleName)})`);
  lines.push(['Category', 'Actual ($)', 'Actual (%)', 'Target ($)', 'Target (%)', 'Variance Gap ($)'].map(escapeCsv).join(','));
  lines.push(['Needs', result.needs.actualAmount.toFixed(2), `${result.needs.actualPct}%`, result.needs.targetAmount.toFixed(2), `${result.needs.targetPct}%`, result.needs.gapAmount.toFixed(2)].map(escapeCsv).join(','));
  lines.push(['Wants', result.wants.actualAmount.toFixed(2), `${result.wants.actualPct}%`, result.wants.targetAmount.toFixed(2), `${result.wants.targetPct}%`, result.wants.gapAmount.toFixed(2)].map(escapeCsv).join(','));
  lines.push(['Savings & Extra Debt', result.savings.actualAmount.toFixed(2), `${result.savings.actualPct}%`, result.savings.targetAmount.toFixed(2), `${result.savings.targetPct}%`, result.savings.gapAmount.toFixed(2)].map(escapeCsv).join(','));
  lines.push('');

  // Income items
  lines.push('INCOME SOURCES');
  lines.push(['Source Name', 'Entered Amount', 'Pay Frequency', 'Monthly Value'].map(escapeCsv).join(','));
  incomes.forEach((inc) => {
    const monthlyVal = frequencyToMonthly(inc.amount, inc.frequency);
    lines.push([inc.name, inc.amount.toFixed(2), inc.frequency, monthlyVal.toFixed(2)].map(escapeCsv).join(','));
  });
  lines.push('');

  // Expense items
  lines.push('ITEMIZED EXPENSES');
  lines.push(['Expense Description', 'Category Bucket', 'Monthly Amount', 'Annual Amount'].map(escapeCsv).join(','));
  expenses.forEach((exp) => {
    const monthlyVal = exp.isYearlyBill ? exp.amount / 12.0 : exp.amount;
    lines.push([exp.name, exp.category.toUpperCase(), monthlyVal.toFixed(2), (monthlyVal * 12.0).toFixed(2)].map(escapeCsv).join(','));
  });

  return lines.join('\r\n');
}
