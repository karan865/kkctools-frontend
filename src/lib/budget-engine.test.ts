import { describe, it, expect } from 'vitest';
import {
  calculateBudget,
  calculateTotalMonthlyIncome,
  frequencyToMonthly,
  generateBudgetCsv,
  BUDGET_RULE_PRESETS,
  IncomeSource,
  ExpenseItem,
} from './budget-engine';

describe('Budget Engine (50/30/20)', () => {
  it('converts pay frequencies to monthly values correctly', () => {
    // Bi-weekly $2,000 = $2,000 * 26 / 12 = $4,333.33
    expect(frequencyToMonthly(2000, 'biweekly')).toBe(4333.33);
    // Weekly $1,000 = $1,000 * 52 / 12 = $4,333.33
    expect(frequencyToMonthly(1000, 'weekly')).toBe(4333.33);
    // Semi-monthly $2,000 = $2,000 * 24 / 12 = $4,000
    expect(frequencyToMonthly(2000, 'semimonthly')).toBe(4000.0);
    // Annual $60,000 = $5,000/mo
    expect(frequencyToMonthly(60000, 'yearly')).toBe(5000.0);
  });

  it('matches the worked example from the build spec ($5,000 income, 50/30/20 rule)', () => {
    const incomes: IncomeSource[] = [
      { id: '1', name: 'Primary Salary', amount: 5000, frequency: 'monthly' },
    ];

    const expenses: ExpenseItem[] = [
      // Needs: $2,750
      { id: 'n1', name: 'Rent', amount: 1600, category: 'needs' },
      { id: 'n2', name: 'Utilities', amount: 200, category: 'needs' },
      { id: 'n3', name: 'Groceries', amount: 500, category: 'needs' },
      { id: 'n4', name: 'Transport', amount: 250, category: 'needs' },
      { id: 'n5', name: 'Insurance', amount: 200, category: 'needs' },
      // Wants: $1,000
      { id: 'w1', name: 'Dining Out', amount: 300, category: 'wants' },
      { id: 'w2', name: 'Entertainment', amount: 200, category: 'wants' },
      { id: 'w3', name: 'Subscriptions', amount: 100, category: 'wants' },
      { id: 'w4', name: 'Shopping', amount: 400, category: 'wants' },
      // Savings / Debt: $750
      { id: 's1', name: 'Emergency Savings', amount: 500, category: 'savings' },
      { id: 's2', name: 'Extra Debt Payment', amount: 250, category: 'savings' },
    ];

    const res = calculateBudget(incomes, expenses, BUDGET_RULE_PRESETS['50/30/20']);

    expect(res.monthlyIncome).toBe(5000.0);
    expect(res.monthlyExpenses).toBe(4500.0);
    expect(res.monthlyLeftover).toBe(500.0);
    expect(res.isShortfall).toBe(false);

    // Needs: Actual $2,750 (55%), Target $2,500 (50%), Gap +$250
    expect(res.needs.actualAmount).toBe(2750.0);
    expect(res.needs.actualPct).toBe(55.0);
    expect(res.needs.targetAmount).toBe(2500.0);
    expect(res.needs.gapAmount).toBe(250.0);

    // Wants: Actual $1,000 (20%), Target $1,500 (30%), Gap -$500
    expect(res.wants.actualAmount).toBe(1000.0);
    expect(res.wants.actualPct).toBe(20.0);
    expect(res.wants.targetAmount).toBe(1500.0);
    expect(res.wants.gapAmount).toBe(-500.0);

    // Savings: Actual $750 (15%), Target $1,000 (20%), Gap -$250
    expect(res.savings.actualAmount).toBe(750.0);
    expect(res.savings.actualPct).toBe(15.0);
    expect(res.savings.targetAmount).toBe(1000.0);
    expect(res.savings.gapAmount).toBe(-250.0);
  });

  it('handles annual sinking-fund bills divided by 12', () => {
    const incomes: IncomeSource[] = [
      { id: '1', name: 'Salary', amount: 4000, frequency: 'monthly' },
    ];
    const expenses: ExpenseItem[] = [
      { id: 'e1', name: 'Annual Car Insurance', amount: 1200, category: 'needs', isYearlyBill: true },
    ];

    const res = calculateBudget(incomes, expenses);
    // $1,200 / 12 = $100/mo
    expect(res.needs.actualAmount).toBe(100.0);
    expect(res.monthlyExpenses).toBe(100.0);
    expect(res.monthlyLeftover).toBe(3900.0);
  });

  it('generates well-formed CSV with proper RFC 4180 escaping', () => {
    const incomes: IncomeSource[] = [
      { id: '1', name: 'Salary, Primary & Bonus', amount: 5000, frequency: 'monthly' },
    ];
    const expenses: ExpenseItem[] = [
      { id: '1', name: 'Rent "Luxury" Apt', amount: 1500, category: 'needs' },
    ];

    const res = calculateBudget(incomes, expenses);
    const csv = generateBudgetCsv(incomes, expenses, res);

    expect(csv).toContain('"Salary, Primary & Bonus"');
    expect(csv).toContain('"Rent ""Luxury"" Apt"');
    expect(csv).toContain('5000.00');
    expect(csv).toContain('1500.00');
  });
});
