import React from 'react';
import styles from './AdPlaceholder.module.css';
import { ADS_ENABLED } from '@/config/site';

interface AdPlaceholderProps {
  slotName?: string;
}

export default function AdPlaceholder({ slotName = 'responsive-banner' }: AdPlaceholderProps) {
  // Visitors should never see an empty "advertisement" box; the slot only reserves space once ads are on.
  if (!ADS_ENABLED) return null;
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

