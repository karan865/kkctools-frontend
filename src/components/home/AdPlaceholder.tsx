import React from 'react';
import styles from './AdPlaceholder.module.css';

interface AdPlaceholderProps {
  slotName?: string;
}

export default function AdPlaceholder({ slotName = 'responsive-banner' }: AdPlaceholderProps) {
  return (
    <div
      className={styles.adWrapper}
      data-ad-slot={slotName}
      role="region"
      aria-label="Advertisement area"
    >
      <div className={styles.adBox}>
        <span className={styles.adNotice}>Advertisement Placeholder (Inert)</span>
      </div>
    </div>
  );
}

