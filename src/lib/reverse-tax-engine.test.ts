import { describe, it, expect } from 'vitest';
import {
  calculateReverseTax,
  calculateRateFromPreTaxAndTotal,
  calculateRateFromTaxAndTotal,
  calculateForwardTax,
  calculateReceipt,
  round2,
} from './reverse-tax-engine';

describe('reverse-tax-engine', () => {
  describe('Spec 08 worked examples', () => {
    it('calculates $107.25 at 7.25% -> $100.00 before tax and $7.25 tax', () => {
      const res = calculateReverseTax(107.25, 7.25)!;
      expect(res.preTax).toBe(100.00);
      expect(res.taxAmount).toBe(7.25);
      expect(res.reconciled).toBe(true);
      expect(round2(res.preTax + res.taxAmount)).toBe(107.25);
    });

    it('calculates tax rate from pre-tax $100 and total $108.875 -> 8.875%', () => {
      const rate = calculateRateFromPreTaxAndTotal(100, 108.875)!;
      expect(parseFloat(rate.toFixed(3))).toBe(8.875);
    });

    it('calculates tax rate from tax amount and total', () => {
      // Total $107.25, tax $7.25 -> pre-tax $100 -> rate 7.25%
      const rate = calculateRateFromTaxAndTotal(7.25, 107.25)!;
      expect(parseFloat(rate.toFixed(2))).toBe(7.25);
    });

    it('calculates £120 including 20% VAT -> £100 + £20 VAT (= gross ÷ 6)', () => {
      const res = calculateReverseTax(120, 20)!;
      expect(res.preTax).toBe(100.00);
      expect(res.taxAmount).toBe(20.00);
      expect(res.vatFractionString).toContain('Gross ÷ 6');
      expect(res.taxAmount).toBe(round2(120 / 6));
    });

    it('performs forward tax calculation correctly', () => {
      const fwd = calculateForwardTax(100, 7.25)!;
      expect(fwd.taxAmount).toBe(7.25);
      expect(fwd.total).toBe(107.25);
    });

    it('calculates multi-line receipt with tax-exempt items', () => {
      const items = [
        { id: '1', name: 'Standard Item A', total: 107.25 },
        { id: '2', name: 'Tax-Exempt Grocery', total: 50.00, isTaxExempt: true },
      ];
      const receipt = calculateReceipt(items, 7.25);
      expect(receipt.subtotalPreTax).toBe(150.00);
      expect(receipt.totalTax).toBe(7.25);
      expect(receipt.grandTotal).toBe(157.25);
    });
  });

  describe('Edge cases and cent rounding reconciliation', () => {
    it('always reconciles preTax + tax === total to the exact cent', () => {
      // Challenging totals that can cause cent drift
      const testCases = [
        { total: 19.99, rate: 8.25 },
        { total: 9.95, rate: 6.5 },
        { total: 105.49, rate: 7.875 },
        { total: 1.00, rate: 7.0 },
      ];

      for (const tc of testCases) {
        const res = calculateReverseTax(tc.total, tc.rate)!;
        expect(round2(res.preTax + res.taxAmount)).toBe(tc.total);
        expect(res.reconciled).toBe(true);
      }
    });

    it('handles negative or invalid inputs cleanly', () => {
      expect(calculateReverseTax(-10, 7)).toBeNull();
      expect(calculateReverseTax(100, -5)).toBeNull();
      expect(calculateRateFromPreTaxAndTotal(0, 100)).toBeNull();
      expect(calculateRateFromPreTaxAndTotal(100, 50)).toBeNull();
      expect(calculateRateFromTaxAndTotal(-1, 100)).toBeNull();
    });
  });

  it('receipt with a taxable tip still reconciles: subtotal + tax = grand total', () => {
    const r = calculateReceipt([{ id: 'a', name: 'Meal', total: 107.25 }], 7.25, 21.45, true);
    expect(r.grandTotal).toBe(128.7);
    expect(r.tipTax).toBe(1.45);
    expect(Math.round((r.subtotalPreTax + r.totalTax) * 100) / 100).toBe(r.grandTotal);
  });
});

