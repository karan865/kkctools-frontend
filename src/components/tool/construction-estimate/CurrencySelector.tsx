'use client';

import React from 'react';
import { Currency } from './types';
import { CURRENCIES } from './constants';
import styles from './ConstructionEstimate.module.css';

interface CurrencySelectorProps {
  value: Currency;
  onChange: (currency: Currency) => void;
}

export default function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <div className={styles.currencySelectorWrapper}>
      <label htmlFor="currency-select" className={styles.label}>
        Currency
      </label>
      <select
        id="currency-select"
        value={value}
        onChange={(e) => onChange(e.target.value as Currency)}
        className={styles.select}
      >
        {CURRENCIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
    </div>
  );
}

