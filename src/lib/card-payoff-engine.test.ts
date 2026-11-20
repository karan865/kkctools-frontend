import { describe, it, expect } from 'vitest';
import {
  simulateCardPayoff,
  calculatePaymentForMonths,
  simulateMinimumPayment,
  simulateMultiCardPayoff,
  calculateBalanceTransfer,
  convertApr,
  getPeriodicRate,
} from './card-payoff-engine';

describe('card-payoff-engine', () => {
  it('verifies spec worked example 1: $5,000 at 22% paying $200/month', () => {
    const res = simulateCardPayoff(5000, 22, 200, 'monthly');
    expect(res.isPayoffPossible).toBe(true);
    expect(res.months).toBe(34);
    // Interest is approx $1,750
    expect(res.totalInterest).toBeGreaterThan(1700);
    expect(res.totalInterest).toBeLessThan(1800);
    expect(res.totalPaid).toBeCloseTo(5000 + res.totalInterest, 0);
  });

  it('verifies spec worked example 2: payment needed to pay off $5,000 in 24 months', () => {
    const pmt = calculatePaymentForMonths(5000, 22, 24, 'monthly');
    expect(pmt).toBe(259.39);

    // Verify simulating with $259.39 clears debt in exactly 24 months
    const sim = simulateCardPayoff(5000, 22, pmt, 'monthly');
    expect(sim.months).toBe(24);
  });

  it('verifies spec worked example 3: minimum payments (1% + interest, $25 floor)', () => {
    const res = simulateMinimumPayment(5000, 22, 1.0, true, 25.0, 'monthly');
    // Spec benchmarks: ~230 months (~19.2 years), ~$8,100 interest
    expect(res.months).toBe(230);
    expect(res.years).toBeCloseTo(19.2, 0);
    expect(res.totalInterest).toBeGreaterThan(8000);
    expect(res.totalInterest).toBeLessThan(8200);
    expect(res.firstMonthPayment).toBeCloseTo(5000 * 0.01 + 5000 * (0.22 / 12), 1); // $50 + $91.67 = $141.67
    expect(res.lastMonthPayment).toBeCloseTo(22.86, 2);
    expect(res.schedule[res.schedule.length - 2].payment).toBe(25.0);
  });

  it('detects when monthly payment does not cover interest', () => {
    // $5,000 @ 22% has monthly interest of $91.67
    const res = simulateCardPayoff(5000, 22, 90, 'monthly');
    expect(res.isPayoffPossible).toBe(false);
    expect(res.months).toBe(Infinity);
    expect(res.unaffordableMessage).toContain('does not cover monthly interest');
  });

  it('compares monthly vs daily average compounding methods', () => {
    const monthlyRate = getPeriodicRate(22, 'monthly');
    const dailyRate = getPeriodicRate(22, 'daily');
    expect(monthlyRate).toBeCloseTo(dailyRate, 4);

    const simMonthly = simulateCardPayoff(5000, 22, 200, 'monthly');
    const simDaily = simulateCardPayoff(5000, 22, 200, 'daily');
    // Both should yield 34 months with very slight differences in interest
    expect(simMonthly.months).toBe(34);
    expect(simDaily.months).toBe(34);
  });

  it('verifies avalanche strategy saves more interest than snowball on mixed cards', () => {
    const cards = [
      { id: '1', name: 'Store Card', balance: 1500, aprPct: 28.0, minPayment: 50 },
      { id: '2', name: 'Bank Card', balance: 6000, aprPct: 24.0, minPayment: 150 },
      { id: '3', name: 'Credit Union', balance: 2500, aprPct: 15.0, minPayment: 60 },
    ];

    const budget = 500; // $500 monthly budget vs $260 minimum sum
    const avalanche = simulateMultiCardPayoff(cards, budget, 'avalanche');
    const snowball = simulateMultiCardPayoff(cards, budget, 'snowball');

    expect(avalanche.months).toBeLessThanOrEqual(snowball.months);
    expect(avalanche.totalInterest).toBeLessThan(snowball.totalInterest);
    expect(avalanche.payoffOrder[0]).toBe('Store Card'); // Highest APR (28%)
    expect(snowball.payoffOrder[0]).toBe('Store Card'); // Also lowest balance ($1500)
  });

  it('evaluates balance transfer offer including fee and net savings', () => {
    // Transfer $5,000 from 22% APR to 0% for 18 months with 3% fee ($150)
    // Paying $250/mo:
    // With staying: $5,000 @ 22% paying $250/mo takes 25 months, ~$1,280 interest
    // With transfer: $5,150 paying $250/mo for 18 mos leaves $650 balance -> then post-promo interest
    const transfer = calculateBalanceTransfer(5000, 3.0, 0.0, 18, 24.0, 250, 22.0);
    expect(transfer.transferFee).toBe(150.0);
    expect(transfer.newStartingBalance).toBe(5150.0);
    expect(transfer.isWorthIt).toBe(true);
    expect(transfer.netSavings).toBeGreaterThan(800);
  });

  it('converts APR to daily periodic rate, monthly rate, and APY', () => {
    const conv = convertApr(22.0);
    expect(conv.aprPct).toBe(22.0);
    expect(conv.dailyPeriodicRatePct).toBeCloseTo(22 / 365, 4); // ~0.0603%
    expect(conv.monthlyPeriodicRatePct).toBeCloseTo(22 / 12, 4); // ~1.8333%
    expect(conv.effectiveApyPct).toBeCloseTo(24.59, 1); // ~24.59%
  });
});
