import { describe, it, expect } from 'vitest';
import {
  parseDuration,
  roundHours,
  calculateInvoiceTotals,
  calculateDueDate,
  generateNextInvoiceNumber,
  formatInvoiceCsv,
  formatInvoiceText,
  InvoiceData,
} from './invoice-engine';

describe('invoice-engine', () => {
  describe('parseDuration', () => {
    it('parses colon time formats', () => {
      expect(parseDuration('2:30')).toBe(2.5);
      expect(parseDuration('01:15')).toBe(1.25);
      expect(parseDuration('0:45')).toBe(0.75);
      expect(parseDuration('10:00')).toBe(10);
    });

    it('parses decimal hour strings', () => {
      expect(parseDuration('2.5')).toBe(2.5);
      expect(parseDuration('3')).toBe(3);
      expect(parseDuration('0.75')).toBe(0.75);
    });

    it('parses compound text durations', () => {
      expect(parseDuration('2h 30m')).toBe(2.5);
      expect(parseDuration('2 hrs 30 mins')).toBe(2.5);
      expect(parseDuration('45m')).toBe(0.75);
      expect(parseDuration('45 min')).toBe(0.75);
      expect(parseDuration('3 hours')).toBe(3);
      expect(parseDuration('1 hr')).toBe(1);
    });

    it('returns null on invalid or negative input', () => {
      expect(parseDuration('')).toBeNull();
      expect(parseDuration('abc')).toBeNull();
      expect(parseDuration('2:75')).toBeNull(); // invalid minutes >= 60
      expect(parseDuration('-2.5')).toBeNull();
    });
  });

  describe('roundHours', () => {
    it('handles mode: none or increment: 0', () => {
      expect(roundHours(2.33, 0, 'none')).toBe(2.33);
      expect(roundHours(2.33, 15, 'none')).toBe(2.33);
    });

    it('rounds up to 15-minute increments (0.25h)', () => {
      expect(roundHours(2.1, 15, 'up')).toBe(2.25);
      expect(roundHours(2.26, 15, 'up')).toBe(2.5);
      expect(roundHours(2.5, 15, 'up')).toBe(2.5);
    });

    it('rounds to nearest 15-minute increment', () => {
      expect(roundHours(2.1, 15, 'nearest')).toBe(2.0);
      expect(roundHours(2.2, 15, 'nearest')).toBe(2.25);
      expect(roundHours(2.4, 15, 'nearest')).toBe(2.5);
    });

    it('rounds up to 6-minute increments (0.1h tenths)', () => {
      expect(roundHours(1.02, 6, 'up')).toBe(1.1);
      expect(roundHours(1.1, 6, 'up')).toBe(1.1);
      expect(roundHours(1.12, 6, 'up')).toBe(1.2);
    });
  });

  describe('Spec Benchmark (15 min round up)', () => {
    it('verifies entries 2:30, 1:45, 3:10 at $75/hr = $562.50', () => {
      // 2:30 -> 2.5
      const h1 = roundHours(parseDuration('2:30')!, 15, 'up');
      // 1:45 -> 1.75
      const h2 = roundHours(parseDuration('1:45')!, 15, 'up');
      // 3:10 -> 3.1666... rounded up to 15 min (0.25) -> 3.25
      const h3 = roundHours(parseDuration('3:10')!, 15, 'up');

      expect(h1).toBe(2.5);
      expect(h2).toBe(1.75);
      expect(h3).toBe(3.25);

      const totalHours = h1 + h2 + h3;
      expect(totalHours).toBe(7.5);

      const rate = 75;
      const totalAmount = totalHours * rate;
      expect(totalAmount).toBe(562.5);

      const totals = calculateInvoiceTotals({
        lines: [
          { id: '1', type: 'hours', description: 'Task 1', quantityOrHours: h1, rateOrPrice: rate, amount: h1 * rate },
          { id: '2', type: 'hours', description: 'Task 2', quantityOrHours: h2, rateOrPrice: rate, amount: h2 * rate },
          { id: '3', type: 'hours', description: 'Task 3', quantityOrHours: h3, rateOrPrice: rate, amount: h3 * rate },
        ],
        discountType: 'pct',
        discountValue: 0,
        taxRate: 0,
        taxOnDiscounted: true,
        shippingFee: 0,
        depositPaid: 0,
      });

      expect(totals.subtotal).toBe(562.5);
      expect(totals.total).toBe(562.5);
      expect(totals.balanceDue).toBe(562.5);
      expect(totals.totalHoursWorked).toBe(7.5);
    });
  });

  describe('Discounts and Taxes', () => {
    it('calculates percentage discount capped at 100%', () => {
      const totals = calculateInvoiceTotals({
        lines: [{ id: '1', type: 'fixed', description: 'Service', quantityOrHours: 1, rateOrPrice: 1000, amount: 1000 }],
        discountType: 'pct',
        discountValue: 10, // 10% off
        taxRate: 0,
        taxOnDiscounted: true,
        shippingFee: 0,
        depositPaid: 0,
      });

      expect(totals.subtotal).toBe(1000);
      expect(totals.discountAmount).toBe(100);
      expect(totals.total).toBe(900);
    });

    it('calculates fixed dollar discount capped at subtotal', () => {
      const totals = calculateInvoiceTotals({
        lines: [{ id: '1', type: 'fixed', description: 'Service', quantityOrHours: 1, rateOrPrice: 500, amount: 500 }],
        discountType: 'fixed',
        discountValue: 600, // exceeds subtotal
        taxRate: 0,
        taxOnDiscounted: true,
        shippingFee: 0,
        depositPaid: 0,
      });

      expect(totals.discountAmount).toBe(500);
      expect(totals.total).toBe(0);
    });

    it('taxes on discounted subtotal vs full subtotal', () => {
      // Subtotal $1,000, discount $200 -> net $800. Tax 10%
      const taxOnDiscounted = calculateInvoiceTotals({
        lines: [{ id: '1', type: 'fixed', description: 'Item', quantityOrHours: 1, rateOrPrice: 1000, amount: 1000 }],
        discountType: 'fixed',
        discountValue: 200,
        taxRate: 10,
        taxOnDiscounted: true,
        shippingFee: 0,
        depositPaid: 0,
      });

      expect(taxOnDiscounted.taxableSubtotal).toBe(800);
      expect(taxOnDiscounted.taxAmount).toBe(80);
      expect(taxOnDiscounted.total).toBe(880);

      const taxOnFull = calculateInvoiceTotals({
        lines: [{ id: '1', type: 'fixed', description: 'Item', quantityOrHours: 1, rateOrPrice: 1000, amount: 1000 }],
        discountType: 'fixed',
        discountValue: 200,
        taxRate: 10,
        taxOnDiscounted: false,
        shippingFee: 0,
        depositPaid: 0,
      });

      expect(taxOnFull.taxableSubtotal).toBe(1000);
      expect(taxOnFull.taxAmount).toBe(100);
      expect(taxOnFull.total).toBe(900); // 1000 - 200 + 100
    });

    it('labels excess deposit as credit balance due', () => {
      const totals = calculateInvoiceTotals({
        lines: [{ id: '1', type: 'fixed', description: 'Deposit item', quantityOrHours: 1, rateOrPrice: 400, amount: 400 }],
        discountType: 'pct',
        discountValue: 0,
        taxRate: 0,
        taxOnDiscounted: true,
        shippingFee: 0,
        depositPaid: 500, // overpaid $100
      });

      expect(totals.total).toBe(400);
      expect(totals.balanceDue).toBe(-100);
      expect(totals.isCredit).toBe(true);
    });
  });

  describe('calculateDueDate and generateNextInvoiceNumber', () => {
    it('calculates due date from payment terms across months', () => {
      expect(calculateDueDate('2026-01-15', 'due_on_receipt')).toBe('2026-01-15');
      expect(calculateDueDate('2026-01-15', 'net_7')).toBe('2026-01-22');
      expect(calculateDueDate('2026-01-15', 'net_30')).toBe('2026-02-14');
      expect(calculateDueDate('2026-01-31', 'net_30')).toBe('2026-03-02');
    });

    it('increments sequential invoice numbers', () => {
      const year = new Date().getFullYear();
      expect(generateNextInvoiceNumber('', 0)).toBe(`INV-${year}-001`);
      expect(generateNextInvoiceNumber('INV-{year}-{num}', 42)).toBe(`INV-${year}-043`);
      expect(generateNextInvoiceNumber('ACME-{n}', 9)).toBe('ACME-10');
    });
  });

  describe('formatInvoiceCsv and formatInvoiceText', () => {
    const sampleInvoice: InvoiceData = {
      from: {
        businessName: 'Studio & Co, LLC',
        senderName: 'Jane Doe',
        address: '123 Market St, Suite 400',
        email: 'jane@example.com',
        phone: '555-0199',
        taxId: '12-3456789',
        taxIdLabel: 'EIN',
        paymentInstructions: 'ACH routing: 021000021 / Acct: 12345678',
      },
      to: {
        clientName: 'Acme Corp',
        companyName: 'Acme International',
        address: '500 Tech Blvd',
        email: 'billing@acme.com',
      },
      meta: {
        invoiceNumber: 'INV-2026-001',
        issueDate: '2026-11-20',
        terms: 'net_30',
        dueDate: '2026-12-20',
        poNumber: 'PO-98765',
      },
      lines: [
        { id: '1', type: 'hours', date: '2026-11-18', description: 'Design, UX review', quantityOrHours: 5, rateOrPrice: 100, amount: 500 },
      ],
      currency: 'USD',
      currencySymbol: '$',
      discountType: 'pct',
      discountValue: 0,
      taxRate: 5,
      taxLabel: 'Sales Tax',
      taxOnDiscounted: true,
      shippingFee: 0,
      depositPaid: 100,
      notes: 'Thank you for your prompt business.',
    };

    it('escapes quotes and commas in CSV export', () => {
      const totals = calculateInvoiceTotals({
        lines: sampleInvoice.lines,
        discountType: sampleInvoice.discountType,
        discountValue: sampleInvoice.discountValue,
        taxRate: sampleInvoice.taxRate,
        taxOnDiscounted: sampleInvoice.taxOnDiscounted,
        shippingFee: sampleInvoice.shippingFee,
        depositPaid: sampleInvoice.depositPaid,
      });

      const csv = formatInvoiceCsv(sampleInvoice, totals);
      expect(csv).toContain('"Studio & Co, LLC"');
      expect(csv).toContain('INV-2026-001');
      expect(csv).toContain('"Design, UX review"');
      expect(csv).toContain('525.00'); // $500 subtotal + 5% tax = $525
      expect(csv).toContain('425.00'); // after $100 deposit = $425 balance due
    });

    it('formats monospace text invoice with headers and balance due', () => {
      const totals = calculateInvoiceTotals({
        lines: sampleInvoice.lines,
        discountType: sampleInvoice.discountType,
        discountValue: sampleInvoice.discountValue,
        taxRate: sampleInvoice.taxRate,
        taxOnDiscounted: sampleInvoice.taxOnDiscounted,
        shippingFee: sampleInvoice.shippingFee,
        depositPaid: sampleInvoice.depositPaid,
      });

      const txt = formatInvoiceText(sampleInvoice, totals);
      expect(txt).toContain('INVOICE #INV-2026-001');
      expect(txt).toContain('BALANCE DUE:');
      expect(txt).toContain('$425.00');
    });
  });
});
