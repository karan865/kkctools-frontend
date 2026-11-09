import { describe, it, expect } from 'vitest';
import { formatAsCSV, formatAsTXT } from './formatter';
import { STARTER_ESTIMATE } from './constants';
import { calculateEstimateTotals } from './calculations';

describe('Construction Estimate Formatter', () => {
  const totals = calculateEstimateTotals(
    STARTER_ESTIMATE.lineItems,
    STARTER_ESTIMATE.taxRate,
    STARTER_ESTIMATE.markupRate
  );

  it('formatAsCSV produces valid CSV with headers', () => {
    const csv = formatAsCSV(STARTER_ESTIMATE, totals);
    expect(csv).toContain('ESTIMATE INFORMATION');
    expect(csv).toContain('Category,Description,Quantity,Unit,Unit Price,Line Total');
    expect(csv).toContain('Kitchen Renovation');
  });

  it('formatAsCSV escapes commas in descriptions', () => {
    const sample = {
      ...STARTER_ESTIMATE,
      lineItems: [
        {
          id: 'test-1',
          description: 'Drywall, Taping, and Mudding',
          category: 'labor' as const,
          quantity: 1,
          unit: 'lump_sum' as const,
          unitPrice: 500,
          total: 500,
        },
      ],
    };
    const sampleTotals = calculateEstimateTotals(sample.lineItems, 0, 0);
    const csv = formatAsCSV(sample, sampleTotals);
    expect(csv).toContain('"Drywall, Taping, and Mudding"');
  });

  it('formatAsCSV includes totals row', () => {
    const csv = formatAsCSV(STARTER_ESTIMATE, totals);
    expect(csv).toContain('Subtotal');
    expect(csv).toContain('GRAND TOTAL');
    expect(csv).toContain(totals.grandTotal.toFixed(2));
  });

  it('formatAsTXT produces readable plain text', () => {
    const txt = formatAsTXT(STARTER_ESTIMATE, totals);
    expect(txt).toContain('CONSTRUCTION ESTIMATE');
    expect(txt).toContain('DESCRIPTION');
    expect(txt).toContain('GRAND TOTAL:');
  });

  it('formatAsTXT includes project info header', () => {
    const txt = formatAsTXT(STARTER_ESTIMATE, totals);
    expect(txt).toContain('PROJECT: Kitchen Renovation');
    expect(txt).toContain('CLIENT:  Sarah & David Miller');
    expect(txt).toContain('ADDRESS: 742 Evergreen Terrace, Springfield, OR');
  });

  it('formatAsTXT includes category subtotals', () => {
    const txt = formatAsTXT(STARTER_ESTIMATE, totals);
    expect(txt).toContain('CATEGORY BREAKDOWN:');
    expect(txt).toContain('Materials');
    expect(txt).toContain('Labor');
  });
});

