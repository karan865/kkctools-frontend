'use client';

import React, { useState } from 'react';
import { EstimateData } from './types';
import styles from './ConstructionEstimate.module.css';

interface SavedEstimatesProps {
  savedList: EstimateData[];
  onLoad: (estimate: EstimateData) => void;
  onDelete: (id: string) => void;
}

export default function SavedEstimates({ savedList, onLoad, onDelete }: SavedEstimatesProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!savedList || savedList.length === 0) {
    return null;
  }

  return (
    <div className={styles.sectionCard}>
      <button
        type="button"
        className={styles.accordionHeader}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className={styles.accordionTitleBlock}>
          <h3 className={styles.sectionTitle}>
            Saved Estimates in Browser{' '}
            <span className={styles.savedCountBadge}>({savedList.length})</span>
          </h3>
          <p className={styles.sectionSubtitle}>
            Access previously saved estimates stored privately on this device.
          </p>
        </div>
        <span className={styles.accordionChevron}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className={styles.savedListContainer}>
          <ul className={styles.savedList}>
            {savedList.map((est) => (
              <li key={est.id} className={styles.savedListItem}>
                <div className={styles.savedItemDetails}>
                  <strong>{est.projectInfo.projectName || 'Untitled Project'}</strong>
                  <span className={styles.savedItemMeta}>
                    {est.projectInfo.clientName && `${est.projectInfo.clientName} • `}
                    {est.projectInfo.date || 'No date'} • {est.lineItems.length} items
                  </span>
                </div>
                <div className={styles.savedItemActions}>
                  <button
                    type="button"
                    onClick={() => onLoad(est)}
                    className={styles.loadBtn}
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(est.id)}
                    className={styles.deleteBtn}
                    aria-label={`Delete estimate for ${est.projectInfo.projectName || 'project'}`}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

