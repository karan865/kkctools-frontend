'use client';

import React, { useState } from 'react';
import styles from './StatTiles.module.css';

export interface StatTileItem {
  id: string;
  label: string;
  value: string | number;
  sublabel?: string;
  highlight?: boolean;
  warning?: boolean;
}

export interface StatTilesProps {
  stats: StatTileItem[];
  columns?: 2 | 3 | 4 | 5 | 6;
  title?: string;
  copyableText?: string;
  className?: string;
}

export default function StatTiles({
  stats,
  columns = 4,
  title,
  copyableText,
  className = '',
}: StatTilesProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy =
      copyableText ||
      stats.map((s) => `${s.label}: ${typeof s.value === 'number' ? s.value.toLocaleString('en-US') : s.value}`).join('\n');

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const colClass = styles[`cols${columns}`] || styles.cols4;

  return (
    <div className={`${styles.container} ${className}`}>
      {(title || copyableText || stats.length > 0) && (
        <div className={styles.topRow}>
          {title && <h3 className={styles.title}>{title}</h3>}
          <button
            type="button"
            className={styles.copyBtn}
            onClick={handleCopy}
            title="Copy summary stats to clipboard"
          >
            {copied ? '✓ Copied' : '📋 Copy Stats'}
          </button>
        </div>
      )}

      <div className={`${styles.grid} ${colClass}`}>
        {stats.map((s) => (
          <div
            key={s.id}
            className={`${styles.tile} ${s.highlight ? styles.highlight : ''} ${
              s.warning ? styles.warning : ''
            }`}
          >
            <div className={styles.label}>{s.label}</div>
            <div className={styles.value}>
              {typeof s.value === 'number' ? s.value.toLocaleString('en-US') : s.value}
            </div>
            {s.sublabel && <div className={styles.sublabel}>{s.sublabel}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
