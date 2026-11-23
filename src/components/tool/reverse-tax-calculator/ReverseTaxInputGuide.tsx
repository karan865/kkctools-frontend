import React from 'react';
import styles from './ReverseTaxInputGuide.module.css';

interface ReverseTaxInputGuideProps {
  tab: 'priceBefore' | 'findRate' | 'receipt' | 'addTax';
}

export default function ReverseTaxInputGuide({ tab }: ReverseTaxInputGuideProps) {
  return (
    <div className={styles.diagramWrapper} aria-hidden="true">
      <div className={styles.title}>Tax-Inclusive Receipt Anatomy</div>
      <div className={styles.receiptCard}>
        <div className={`${styles.receiptRow} ${styles.highlightRow}`}>
          <span className={styles.highlightLabel}>1 Pre-Tax Base Price (Solved)</span>
          <span className={styles.highlightVal}>$100.00</span>
        </div>
        <div className={styles.receiptRow}>
          <span className={styles.receiptLabel}>2 Sales Tax Rate (Combined)</span>
          <span className={styles.receiptVal}>+ 7.25% ($7.25)</span>
        </div>
        <div className={styles.receiptDivider} />
        <div className={styles.receiptRow}>
          <span className={styles.receiptLabel}><strong>3 Total Amount Paid</strong></span>
          <span className={styles.receiptVal}><strong>$107.25</strong></span>
        </div>
      </div>
      <div className={styles.chipsRow}>
        <span className={styles.chip}>✓ Correct equation: Total ÷ (1 + Rate)</span>
        <span className={styles.chip}>✓ Reconciles cents: Pre-Tax + Tax = Total</span>
        <span className={styles.chip}>✓ Never multiply Total × Rate (avoids overcounting)</span>
      </div>
    </div>
  );
}
