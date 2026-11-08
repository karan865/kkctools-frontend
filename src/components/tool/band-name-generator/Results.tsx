'use client';

import React, { useState } from 'react';
import ResultRow from './ResultRow';
import styles from './Results.module.css';

interface ResultsProps {
  names: string[];
  warning?: string;
  savedNames: Set<string>;
  onToggleSave: (name: string) => void;
  onCopySuccess: (msg: string) => void;
}

export default function Results({
  names,
  warning,
  savedNames,
  onToggleSave,
  onCopySuccess,
}: ResultsProps) {
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = async () => {
    if (names.length === 0) return;
    const allText = names.join('\n');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(allText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = allText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedAll(true);
      onCopySuccess(`Copied all ${names.length} names to clipboard`);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      onCopySuccess('Failed to copy all names');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.countText} aria-live="polite">
            {names.length} {names.length === 1 ? 'name' : 'names'} generated
          </span>
        </div>

        {names.length > 0 && (
          <button
            type="button"
            onClick={handleCopyAll}
            className={`${styles.copyAllBtn} ${copiedAll ? styles.copiedAllBtn : ''}`}
            aria-label="Copy all generated names"
          >
            {copiedAll ? '✓ All Copied' : '⧉ Copy all'}
          </button>
        )}
      </div>

      {warning && (
        <div className={styles.warningBox} role="alert" aria-live="polite">
          <span className={styles.warningIcon} aria-hidden="true">⚠️</span>
          <span>{warning}</span>
        </div>
      )}

      {names.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No names found with your current filters. Try relaxing your search options.</p>
        </div>
      ) : (
        <ol className={styles.list}>
          {names.map((name, idx) => (
            <ResultRow
              key={`${name}-${idx}`}
              index={idx}
              name={name}
              isSaved={savedNames.has(name)}
              onToggleSave={onToggleSave}
              onCopySuccess={onCopySuccess}
            />
          ))}
        </ol>
      )}
    </div>
  );
}

