'use client';

import React from 'react';
import { Currency, LineItem } from './types';
import LineItemRow from './LineItemRow';
import styles from './ConstructionEstimate.module.css';

interface LineItemsProps {
  items: LineItem[];
  currency: Currency;
  onUpdateItem: (updated: LineItem) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: () => void;
}

export default function LineItems({
  items,
  currency,
  onUpdateItem,
  onRemoveItem,
  onAddItem,
}: LineItemsProps) {
  return (
    <div className={styles.sectionCard}>
      <div className={styles.lineItemsHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Scope of Work &amp; Line Items</h2>
          <p className={styles.sectionSubtitle}>
            Break down materials, labor hours, subcontractors, equipment, and permits.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddItem}
          className={styles.addItemBtn}
        >
          + Add Line Item
        </button>
      </div>

      <div className={styles.tableResponsive}>
        <table className={styles.lineItemsTable}>
          <thead>
            <tr>
              <th scope="col" className={styles.thIndex}>#</th>
              <th scope="col" className={styles.thCategory}>Category</th>
              <th scope="col" className={styles.thDescription}>Item Description</th>
              <th scope="col" className={styles.thQuantity}>Qty</th>
              <th scope="col" className={styles.thUnit}>Unit</th>
              <th scope="col" className={styles.thUnitPrice}>Unit Rate</th>
              <th scope="col" className={styles.thTotal}>Total</th>
              <th scope="col" className={styles.thAction}><span className={styles.srOnly}>Action</span></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.emptyTable}>
                  No line items yet. Click <strong>+ Add Line Item</strong> above to start your estimate.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <LineItemRow
                  key={item.id}
                  item={item}
                  index={idx}
                  currency={currency}
                  onUpdate={onUpdateItem}
                  onRemove={onRemoveItem}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.tableFooterAction}>
        <button
          type="button"
          onClick={onAddItem}
          className={styles.addItemBtnSecondary}
        >
          + Add Another Item
        </button>
      </div>
    </div>
  );
}

