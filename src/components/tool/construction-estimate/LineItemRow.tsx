'use client';

import React from 'react';
import { Category, Currency, LineItem, Unit } from './types';
import { CATEGORIES, UNITS } from './constants';
import { calculateLineTotal, formatCurrency } from './calculations';
import styles from './ConstructionEstimate.module.css';

interface LineItemRowProps {
  item: LineItem;
  index: number;
  currency: Currency;
  onUpdate: (updated: LineItem) => void;
  onRemove: (id: string) => void;
}

export default function LineItemRow({
  item,
  index,
  currency,
  onUpdate,
  onRemove,
}: LineItemRowProps) {
  const handleFieldChange = (field: keyof LineItem, val: string | number) => {
    let nextQty = item.quantity;
    let nextPrice = item.unitPrice;

    if (field === 'quantity') {
      nextQty = parseFloat(String(val)) || 0;
    } else if (field === 'unitPrice') {
      nextPrice = parseFloat(String(val)) || 0;
    }

    const nextTotal = calculateLineTotal(nextQty, nextPrice);

    onUpdate({
      ...item,
      [field]: val,
      quantity: nextQty,
      unitPrice: nextPrice,
      total: nextTotal,
    });
  };

  return (
    <tr className={styles.tableRow}>
      <td className={styles.colIndex}>{index + 1}</td>
      <td className={styles.colCategory}>
        <select
          value={item.category}
          onChange={(e) => handleFieldChange('category', e.target.value as Category)}
          className={styles.rowSelect}
          aria-label={`Category for line item ${index + 1}`}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </td>
      <td className={styles.colDescription}>
        <input
          type="text"
          value={item.description}
          placeholder="Task or material description"
          onChange={(e) => handleFieldChange('description', e.target.value)}
          className={styles.rowInput}
          aria-label={`Description for line item ${index + 1}`}
        />
      </td>
      <td className={styles.colQuantity}>
        <input
          type="number"
          min="0"
          step="any"
          value={item.quantity === 0 ? '' : item.quantity}
          placeholder="0"
          onChange={(e) => handleFieldChange('quantity', e.target.value)}
          className={`${styles.rowInput} ${styles.numInput}`}
          aria-label={`Quantity for line item ${index + 1}`}
        />
      </td>
      <td className={styles.colUnit}>
        <select
          value={item.unit}
          onChange={(e) => handleFieldChange('unit', e.target.value as Unit)}
          className={styles.rowSelect}
          aria-label={`Unit of measure for line item ${index + 1}`}
        >
          {UNITS.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>
      </td>
      <td className={styles.colUnitPrice}>
        <input
          type="number"
          min="0"
          step="any"
          value={item.unitPrice === 0 ? '' : item.unitPrice}
          placeholder="0.00"
          onChange={(e) => handleFieldChange('unitPrice', e.target.value)}
          className={`${styles.rowInput} ${styles.numInput}`}
          aria-label={`Unit price for line item ${index + 1}`}
        />
      </td>
      <td className={styles.colTotal}>
        <span className={styles.totalValue}>{formatCurrency(item.total, currency)}</span>
      </td>
      <td className={styles.colAction}>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className={styles.removeBtn}
          aria-label={`Remove line item: ${item.description || `Item ${index + 1}`}`}
          title="Delete item"
        >
          ✕
        </button>
      </td>
    </tr>
  );
}

