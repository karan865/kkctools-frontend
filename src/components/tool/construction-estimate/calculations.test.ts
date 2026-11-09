import { describe, it, expect } from 'vitest';
import {
  calculateLineTotal,
  calculateSubtotal,
  calculateCategorySubtotals,
  calculateTax,
  calculateMarkup,
  calculateGrandTotal,
  calculateEstimateTotals,
  formatCurrency,
} from './calculations';
import { LineItem } from './types';

describe('Construction Estimate Calculations', () => {
  it('calculateLineTotal calculates basic product correctly', () => {
    expect(calculateLineTotal(10, 25)).toBe(250);
  });

  it('calculateLineTotal returns 0 when quantity or price is 0', () => {
    expect(calculateLineTotal(0, 100)).toBe(0);
    expect(calculateLineTotal(10, 0)).toBe(0);
    expect(calculateLineTotal(-5, 100)).toBe(0);
  });

  it('calculateLineTotal handles decimal precision correctly', () => {
    expect(calculateLineTotal(3.5, 45.5)).toBe(159.25);
  });

  it('calculateSubtotal sums all line item totals', () => {
    const items: LineItem[] = [
      { id: '1', description: 'Item 1', category: 'materials', quantity: 2, unit: 'each', unitPrice: 50, total: 100 },
      { id: '2', description: 'Item 2', category: 'labor', quantity: 5, unit: 'hour', unitPrice: 30, total: 150 },
    ];
    expect(calculateSubtotal(items)).toBe(250);
  });

  it('calculateSubtotal of empty array returns 0', () => {
    expect(calculateSubtotal([])).toBe(0);
  });

  it('calculateCategorySubtotals groups totals by category correctly', () => {
    const items: LineItem[] = [
      { id: '1', description: 'Lumber', category: 'materials', quantity: 10, unit: 'each', unitPrice: 20, total: 200 },
      { id: '2', description: 'Hardware', category: 'materials', quantity: 1, unit: 'each', unitPrice: 50, total: 50 },
      { id: '3', description: 'Framing', category: 'labor', quantity: 8, unit: 'hour', unitPrice: 40, total: 320 },
      { id: '4', description: 'Excavator', category: 'equipment', quantity: 1, unit: 'day', unitPrice: 350, total: 350 },
    ];
    const catSubtotals = calculateCategorySubtotals(items);
    expect(catSubtotals.materials).toBe(250);
    expect(catSubtotals.labor).toBe(320);
    expect(catSubtotals.equipment).toBe(350);
    expect(catSubtotals.subcontractor).toBe(0);
    expect(catSubtotals.permits).toBe(0);
  });

  it('calculateTax computes percentage correctly', () => {
    expect(calculateTax(1000, 8.25)).toBe(82.5);
    expect(calculateTax(1000, 0)).toBe(0);
  });

  it('calculateMarkup computes markup percentage correctly', () => {
    expect(calculateMarkup(1000, 15)).toBe(150);
    expect(calculateMarkup(1000, 0)).toBe(0);
  });

  it('calculateGrandTotal sums subtotal, tax, and markup', () => {
    expect(calculateGrandTotal(1000, 82.5, 150)).toBe(1232.5);
  });

  it('calculateEstimateTotals returns correct complete totals object', () => {
    const items: LineItem[] = [
      { id: '1', description: 'Paint', category: 'materials', quantity: 4, unit: 'gallon', unitPrice: 50, total: 200 },
      { id: '2', description: 'Painter', category: 'labor', quantity: 10, unit: 'hour', unitPrice: 40, total: 400 },
    ];
    const totals = calculateEstimateTotals(items, 10, 20);
    expect(totals.subtotal).toBe(600);
    expect(totals.categorySubtotals.materials).toBe(200);
    expect(totals.categorySubtotals.labor).toBe(400);
    expect(totals.taxAmount).toBe(60);
    expect(totals.markupAmount).toBe(120);
    expect(totals.grandTotal).toBe(780);
  });

  it('formatCurrency formats USD and GBP correctly', () => {
    expect(formatCurrency(1234.56, 'USD')).toContain('1,234.56');
    expect(formatCurrency(1234.56, 'USD')).toContain('$');
    expect(formatCurrency(1234.56, 'GBP')).toContain('£');
  });

  it('formatCurrency handles zero correctly', () => {
    expect(formatCurrency(0, 'USD')).toContain('0.00');
  });

  it('formatCurrency handles large numbers', () => {
    const formatted = formatCurrency(1500000.75, 'USD');
    expect(formatted).toContain('1,500,000.75');
  });
});

