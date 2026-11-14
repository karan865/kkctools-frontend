'use client';

import React from 'react';
import { Currency, EstimateTotals } from './types';
import { CATEGORIES } from './constants';
import { formatCurrency } from './calculations';
import styles from './ConstructionEstimate.module.css';

interface TotalsPanelProps {
  totals: EstimateTotals;
  taxRate: number;
  markupRate: number;
  currency: Currency;
  onTaxRateChange: (rate: number) => void;
  onMarkupRateChange: (rate: number) => void;
}

export default function TotalsPanel({
  totals,
  taxRate,
  markupRate,
  currency,
  onTaxRateChange,
  onMarkupRateChange,
}: TotalsPanelProps) {
  return (
    <div className={styles.totalsContainer} aria-live="polite">
      {/* Category Breakdown Sidebar */}
      <div className={styles.categoryBreakdown}>
        <h3 className={styles.totalsSubheading}>Category Breakdown</h3>
        <ul className={styles.categoryList}>
          {CATEGORIES.map((cat) => {
            const amount = totals.categorySubtotals[cat.value] || 0;
            if (amount <= 0) return null;
            return (
              <li key={cat.value} className={styles.categoryItem}>
                <span className={styles.categoryBadge}>{cat.label}</span>
                <span className={styles.categoryAmount}>{formatCurrency(amount, currency)}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Financial Calculations Box */}
      <div className={styles.calculationBox}>
        <div className={styles.calcRow}>
          <span className={styles.calcLabel}>Subtotal:</span>
          <span className={styles.calcValue}>{formatCurrency(totals.subtotal, currency)}</span>
        </div>

        <div className={styles.calcRow}>
          <div className={styles.rateControl}>
            <label htmlFor="tax-rate-input" className={styles.rateLabel}>
              Tax Rate (%):
            </label>
            <input
              id="tax-rate-input"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={taxRate === 0 ? '' : taxRate}
              placeholder="0.00"
              onChange={(e) => onTaxRateChange(parseFloat(e.target.value) || 0)}
              className={styles.rateInput}
            />
          </div>
          <span className={styles.calcValue}>{formatCurrency(totals.taxAmount, currency)}</span>
        </div>

        <div className={styles.calcRow}>
          <div className={styles.rateControl}>
            <label htmlFor="markup-rate-input" className={styles.rateLabel}>
              Markup / Profit (%):
            </label>
            <input
              id="markup-rate-input"
              type="number"
              min="0"
              max="200"
              step="0.1"
              value={markupRate === 0 ? '' : markupRate}
              placeholder="0.00"
              onChange={(e) => onMarkupRateChange(parseFloat(e.target.value) || 0)}
              className={styles.rateInput}
            />
          </div>
          <span className={styles.calcValue}>{formatCurrency(totals.markupAmount, currency)}</span>
        </div>

        <div className={styles.grandTotalDivider} />

        <div className={styles.grandTotalRow}>
          <span className={styles.grandTotalLabel}>Estimated Grand Total:</span>
          <span className={styles.grandTotalValue}>
            {formatCurrency(totals.grandTotal, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}

