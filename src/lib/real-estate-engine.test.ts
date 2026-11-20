import { describe, it, expect } from 'vitest';
import {
  noi,
  calculateNoiBreakdown,
  capRate,
  valueFromCap,
  noiFromCap,
  grm,
  dscr,
  debtYield,
  cashOnCash,
  grossYield,
  netYield,
  npv,
  irr,
} from './real-estate-engine';

describe('real-estate-engine', () => {
  describe('noi and calculateNoiBreakdown', () => {
    it('accurately calculates the Cap Rate spec default worked example', () => {
      // Spec default:
      // 10 units * $1,500/mo * 12 = $180,000 gross rent
      // $3,000 other income
      // 5% vacancy on rent = $9,000
      // Effective Income = $180,000 + $3,000 - $9,000 = $174,000
      // Expenses: tax $18,000, insurance $6,000, repairs $9,000, reserves $3,000 = $36,000
      // Management: 6% of $174,000 = $10,440
      // Total expenses = $36,000 + $10,440 = $46,440
      // NOI = $174,000 - $46,440 = $127,560
      const input = {
        grossRent: 180000,
        otherIncome: 3000,
        vacancyPct: 5,
        expenses: [
          { name: 'Property Tax', amount: 18000 },
          { name: 'Insurance', amount: 6000 },
          { name: 'Repairs & Maintenance', amount: 9000 },
          { name: 'Replacement Reserves', amount: 3000 },
        ],
        managementPct: 6,
      };

      const resultNoi = noi(input);
      expect(resultNoi).toBe(127560);

      const breakdown = calculateNoiBreakdown(input);
      expect(breakdown.grossRent).toBe(180000);
      expect(breakdown.otherIncome).toBe(3000);
      expect(breakdown.vacancyLoss).toBe(9000);
      expect(breakdown.effectiveIncome).toBe(174000);
      expect(breakdown.managementCost).toBe(10440);
      expect(breakdown.totalExpenses).toBe(46440);
      expect(breakdown.noi).toBe(127560);
      // Expense ratio: 46,440 / 174,000 = 26.689655%
      expect(breakdown.expenseRatioPct).toBeCloseTo(26.6897, 2);
    });

    it('handles numeric arrays for expenses and zero other income', () => {
      const res = noi({
        grossRent: 100000,
        vacancyPct: 10, // $10,000 loss -> $90,000 EGI
        expenses: [15000, 5000], // $20,000
        managementPct: 5, // 5% of $90,000 = $4,500
      });
      // 90,000 - 24,500 = 65,500
      expect(res).toBe(65500);
    });

    it('allows negative NOI when expenses exceed income without failing', () => {
      const res = noi({
        grossRent: 10000,
        vacancyPct: 0,
        expenses: [25000],
      });
      expect(res).toBe(-15000);
    });
  });

  describe('capRate, valueFromCap, and noiFromCap', () => {
    it('computes cap rate correctly matching spec worked example', () => {
      // $127,560 NOI on $2,400,000 purchase price = 5.315% (rounds to 5.32% in UI)
      const rate = capRate(127560, 2400000);
      expect(rate).toBeCloseTo(5.315, 3);
    });

    it('computes property value from NOI and cap rate', () => {
      // $127,560 / 0.07 = $1,822,285.714...
      const val = valueFromCap(127560, 7);
      expect(val).toBeCloseTo(1822285.714, 2);
    });

    it('computes required NOI from price and target cap rate', () => {
      // $2,400,000 * 0.07 = $168,000
      const required = noiFromCap(2400000, 7);
      expect(required).toBe(168000);
    });

    it('round-trips value -> cap -> value accurately', () => {
      const initialValue = 3500000;
      const testNoi = 210000;
      const calculatedCap = capRate(testNoi, initialValue);
      expect(calculatedCap).not.toBeNull();
      const roundTripValue = valueFromCap(testNoi, calculatedCap!);
      expect(roundTripValue).toBeCloseTo(initialValue, 4);
    });

    it('returns null for non-positive or invalid values', () => {
      expect(capRate(100000, 0)).toBeNull();
      expect(capRate(100000, -500000)).toBeNull();
      expect(valueFromCap(100000, 0)).toBeNull();
      expect(valueFromCap(100000, -4)).toBeNull();
      expect(noiFromCap(0, 6)).toBeNull();
      expect(noiFromCap(1000000, 0)).toBeNull();
    });
  });

  describe('real estate valuation ratios (grm, dscr, debtYield, cashOnCash, yields)', () => {
    it('calculates GRM accurately', () => {
      // $2,400,000 price / $180,000 annual rent = 13.333x
      expect(grm(2400000, 180000)).toBeCloseTo(13.333, 3);
      expect(grm(2400000, 0)).toBeNull();
      expect(grm(-100, 50000)).toBeNull();
    });

    it('calculates DSCR accurately', () => {
      // $127,560 NOI / $98,000 debt service = 1.3016x
      expect(dscr(127560, 98000)).toBeCloseTo(1.3016, 3);
      expect(dscr(127560, 0)).toBeNull();
    });

    it('calculates Debt Yield accurately', () => {
      // $127,560 NOI / $1,500,000 loan = 8.504%
      expect(debtYield(127560, 1500000)).toBeCloseTo(8.504, 3);
      expect(debtYield(127560, 0)).toBeNull();
    });

    it('calculates Cash-on-Cash return accurately', () => {
      // Cash flow after debt service: $29,560 on $600,000 down payment = 4.9267%
      expect(cashOnCash(29560, 600000)).toBeCloseTo(4.9267, 3);
      expect(cashOnCash(29560, 0)).toBeNull();
    });

    it('calculates Gross and Net rental yields', () => {
      // Gross rent $180,000 / $2,400,000 = 7.5%
      expect(grossYield(180000, 2400000)).toBe(7.5);
      // Net yield = NOI $127,560 / $2,400,000 = 5.315%
      expect(netYield(127560, 2400000)).toBeCloseTo(5.315, 3);
    });
  });

  describe('npv and irr', () => {
    it('calculates NPV correctly for standard cash flows', () => {
      // Initial: -$1,000, Year 1: $300, Year 2: $500, Year 3: $600 at 10%
      // NPV = -1000 + 300/1.1 + 500/(1.1^2) + 600/(1.1^3) = -1000 + 272.727 + 413.223 + 450.789 = 136.739
      const flows = [-1000, 300, 500, 600];
      const result = npv(10, flows);
      expect(result).toBeCloseTo(136.739, 2);
    });

    it('calculates IRR accurately and confirms NPV is near zero at that rate', () => {
      const flows = [-1000, 300, 400, 600];
      const rate = irr(flows);
      expect(rate).not.toBeNull();
      // At this IRR, NPV must be effectively zero
      const checkNpv = npv(rate!, flows);
      expect(checkNpv).toBeCloseTo(0, 1);
    });

    it('returns null for IRR when no sign changes exist', () => {
      expect(irr([100, 200, 300])).toBeNull();
      expect(irr([-100, -200, -300])).toBeNull();
      expect(irr([])).toBeNull();
      expect(irr([-500])).toBeNull();
    });
  });
});
