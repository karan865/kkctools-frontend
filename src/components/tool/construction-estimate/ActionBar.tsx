'use client';

import React from 'react';
import styles from './ConstructionEstimate.module.css';

interface ActionBarProps {
  onPrint: () => void;
  onDownloadCSV: () => void;
  onDownloadTXT: () => void;
  onSave: () => void;
  onNew: () => void;
}

export default function ActionBar({
  onPrint,
  onDownloadCSV,
  onDownloadTXT,
  onSave,
  onNew,
}: ActionBarProps) {
  return (
    <div className={styles.actionBar}>
      <div className={styles.actionGroupPrimary}>
        <button
          type="button"
          onClick={onPrint}
          className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
          title="Print or export to PDF via browser print dialog"
        >
          <span className={styles.btnIcon}>🖨️</span>
          <span>Print / PDF</span>
        </button>

        <button
          type="button"
          onClick={onDownloadCSV}
          className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
          title="Export spreadsheet line items as CSV"
        >
          <span className={styles.btnIcon}>📊</span>
          <span>Download CSV</span>
        </button>

        <button
          type="button"
          onClick={onDownloadTXT}
          className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
          title="Export clean formatted text document"
        >
          <span className={styles.btnIcon}>📄</span>
          <span>Download TXT</span>
        </button>
      </div>

      <div className={styles.actionGroupSecondary}>
        <button
          type="button"
          onClick={onSave}
          className={`${styles.actionBtn} ${styles.actionBtnOutline}`}
          title="Save this estimate locally in your browser"
        >
          <span className={styles.btnIcon}>💾</span>
          <span>Save</span>
        </button>

        <button
          type="button"
          onClick={onNew}
          className={`${styles.actionBtn} ${styles.actionBtnGhost}`}
          title="Clear fields and start a fresh estimate"
        >
          <span className={styles.btnIcon}>➕</span>
          <span>New Estimate</span>
        </button>
      </div>
    </div>
  );
}

