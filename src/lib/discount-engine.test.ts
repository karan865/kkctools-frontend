import { describe, it, expect } from 'vitest';
import {
  calculateDiscount,
  reverseDiscount,
  calculateDeal,
  generateDiscountTable,
  generateCommonPricesMatrix,
} from './discount-engine';

describe('discount-engine', () => {
  describe('calculateDiscount (forward mode)', () => {
    it('calculates simple 20% off $100 correctly', () => {
      const result = calculateDiscount({
        originalPrice: 100,
        discountPercent: 20,
      });

      expect(result.originalPrice).toBe(100);
      expect(result.salePrice).toBe(80);
      expect(result.totalSavings).toBe(20);
      expect(result.effectiveDiscountPercent).toBe(20);
      expect(result.taxAmount).toBe(0);
      expect(result.finalPriceWithTax).toBe(80);
    });

    it('handles stacked discounts: 20% off plus extra 10% off ($100 -> $72)', () => {
      const result = calculateDiscount({
        originalPrice: 100,
        discountPercent: 20,
        stackedDiscountPercent: 10,
      });

      // $100 - 20% = $80; $80 - 10% = $72. Savings = $28 (28% off, NOT 30%)
      expect(result.salePrice).toBe(72);
      expect(result.totalSavings).toBe(28);
      expect(result.effectiveDiscountPercent).toBe(28);
      expect(result.stackedBreakdown).toContain('effective 28% total discount (not 30%)');
    });

    it('applies fixed coupon after percentage discount (percent-first)', () => {
      // $100 - 20% = $80; $80 - $15 coupon = $65
      const result = calculateDiscount({
        originalPrice: 100,
        discountPercent: 20,
        couponAmount: 15,
        couponOrder: 'percent-first',
      });

      expect(result.salePrice).toBe(65);
      expect(result.totalSavings).toBe(35);
      expect(result.effectiveDiscountPercent).toBe(35);
    });

    it('applies fixed coupon before percentage discount (coupon-first)', () => {
      // $100 - $15 coupon = $85; $85 - 20% = $68
      const result = calculateDiscount({
        originalPrice: 100,
        discountPercent: 20,
        couponAmount: 15,
        couponOrder: 'coupon-first',
      });

      expect(result.salePrice).toBe(68);
      expect(result.totalSavings).toBe(32);
      expect(result.effectiveDiscountPercent).toBe(32);
    });

    it('calculates sales tax on discounted sale price', () => {
      // $100 with 25% off = $75. 8.25% tax on $75 = $6.1875 -> $6.19. Total = $81.19
      const result = calculateDiscount({
        originalPrice: 100,
        discountPercent: 25,
        taxPercent: 8.25,
        taxTiming: 'after-discount',
      });

      expect(result.salePrice).toBe(75);
      expect(result.taxAmount).toBe(6.19);
      expect(result.finalPriceWithTax).toBe(81.19);
    });

    it('calculates sales tax on full original price when specified (before-discount)', () => {
      // $100 with 25% off = $75. 8% tax on $100 = $8.00. Total = $83.00
      const result = calculateDiscount({
        originalPrice: 100,
        discountPercent: 25,
        taxPercent: 8,
        taxTiming: 'before-discount',
      });

      expect(result.salePrice).toBe(75);
      expect(result.taxAmount).toBe(8);
      expect(result.finalPriceWithTax).toBe(83);
    });

    it('handles zero or negative inputs safely without NaN', () => {
      const result = calculateDiscount({
        originalPrice: 0,
        discountPercent: 30,
      });

      expect(result.originalPrice).toBe(0);
      expect(result.salePrice).toBe(0);
      expect(result.totalSavings).toBe(0);
      expect(result.effectiveDiscountPercent).toBe(0);
    });

    it('clamps discounts exceeding 100% or coupons exceeding price to zero floor', () => {
      const result = calculateDiscount({
        originalPrice: 50,
        discountPercent: 20,
        couponAmount: 100, // exceeds price
      });

      expect(result.salePrice).toBe(0);
      expect(result.totalSavings).toBe(50);
      expect(result.effectiveDiscountPercent).toBe(100);
    });
  });

  describe('reverseDiscount', () => {
    it('solves original price from sale price and discount %', () => {
      // Sale price $80 at 20% off -> Original price $100
      const result = reverseDiscount({
        mode: 'find-original',
        salePrice: 80,
        discountPercent: 20,
      });

      expect(result.originalPrice).toBe(100);
      expect(result.savingsDollars).toBe(20);
      expect(result.formulaUsed).toContain('$80.00 ÷ (1 − 0.2000) = $100.00');
    });

    it('solves discount % from original price and sale price', () => {
      // Original $120, Sale $90 -> 25% discount, $30 savings
      const result = reverseDiscount({
        mode: 'find-percent',
        originalPrice: 120,
        salePrice: 90,
      });

      expect(result.discountPercent).toBe(25);
      expect(result.savingsDollars).toBe(30);
      expect(result.formulaUsed).toContain('25.00%');
    });

    it('solves target price for desired dollar savings', () => {
      // Original $150, want to save $30 -> Target price $120 (20% off)
      const result = reverseDiscount({
        mode: 'find-target',
        originalPrice: 150,
        desiredSavings: 30,
      });

      expect(result.salePrice).toBe(120);
      expect(result.discountPercent).toBe(20);
      expect(result.savingsDollars).toBe(30);
    });
  });

  describe('calculateDeal (retail promo equivalents)', () => {
    it('computes BOGO Free as 50% effective discount', () => {
      const deal = calculateDeal({
        type: 'bogo-free',
        itemPrice: 40,
      });

      expect(deal.effectiveDiscountPercent).toBe(50);
      expect(deal.totalOriginalCost).toBe(80);
      expect(deal.totalSalePrice).toBe(40);
      expect(deal.totalSavings).toBe(40);
      expect(deal.pricePerUnit).toBe(20);
    });

    it('computes BOGO 50% off as 25% effective discount', () => {
      const deal = calculateDeal({
        type: 'bogo-percent',
        itemPrice: 60,
        secondItemDiscountPercent: 50,
      });

      // Item 1: $60, Item 2: $30. Total: $90 vs $120 original = $30 savings = 25% off
      expect(deal.effectiveDiscountPercent).toBe(25);
      expect(deal.totalOriginalCost).toBe(120);
      expect(deal.totalSalePrice).toBe(90);
      expect(deal.totalSavings).toBe(30);
      expect(deal.pricePerUnit).toBe(45);
    });

    it('computes Buy 2 Get 1 Free (3-for-2) as 33.33% effective discount', () => {
      const deal = calculateDeal({
        type: 'buy-x-get-y',
        itemPrice: 30,
        buyQty: 2,
        getQty: 1,
      });

      // Total 3 items: Pay for 2 ($60) vs normal $90 = $30 savings = 33.33% off
      expect(deal.effectiveDiscountPercent).toBe(33.33);
      expect(deal.totalOriginalCost).toBe(90);
      expect(deal.totalSalePrice).toBe(60);
      expect(deal.totalSavings).toBe(30);
      expect(deal.pricePerUnit).toBe(20);
    });

    it('computes Spend $100 Save $20 as 20% effective discount', () => {
      const deal = calculateDeal({
        type: 'spend-x-save-y',
        spendThreshold: 100,
        saveAmount: 20,
      });

      expect(deal.effectiveDiscountPercent).toBe(20);
      expect(deal.totalOriginalCost).toBe(100);
      expect(deal.totalSalePrice).toBe(80);
      expect(deal.totalSavings).toBe(20);
    });
  });

  describe('reference tables', () => {
    it('generates 12 discount rows for a $50 item with accurate step calculations', () => {
      const table = generateDiscountTable(50);

      expect(table).toHaveLength(12);
      // 10% off $50 = $45 ($5 savings)
      const row10 = table.find((r) => r.percent === 10);
      expect(row10).toBeDefined();
      expect(row10?.salePrice).toBe(45);
      expect(row10?.savings).toBe(5);

      // 50% off $50 = $25 ($25 savings)
      const row50 = table.find((r) => r.percent === 50);
      expect(row50).toBeDefined();
      expect(row50?.salePrice).toBe(25);
      expect(row50?.savings).toBe(25);
    });

    it('generates common price matrix covering search queries like 30 off of 50', () => {
      const matrix = generateCommonPricesMatrix();
      expect(matrix.length).toBeGreaterThan(5);

      // Verify $50 item with 30% off: sale price $35, savings $15
      const item50 = matrix.find((m) => m.price === 50);
      expect(item50).toBeDefined();
      expect(item50?.discounts[30].salePrice).toBe(35);
      expect(item50?.discounts[30].savings).toBe(15);
    });
  });
});
